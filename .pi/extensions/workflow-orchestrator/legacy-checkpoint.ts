import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { lstat, readFile, readdir, realpath } from "node:fs/promises";
import { relative, resolve, sep } from "node:path";
import { promisify } from "node:util";

import { fieldLast, fieldValues } from "./artifacts.ts";
import { OrchestrationStop } from "./contracts.ts";

const execFileAsync = promisify(execFile);
const CHECKPOINT_KINDS = new Set([
  "IMPLEMENTATION_CHECKPOINT",
  "AUDIT_CHECKPOINT",
  "REMEDIATION_CHECKPOINT",
  "FINALIZATION_CHECKPOINT",
]);
const MIGRATABLE_NEXT_OPERATION = "audit-implemented-ticket";
const MAX_PRESERVED_PATH_DRIFT = 128;

export interface TicketRevisionProof {
  generationMarkerPath: string;
  generationManifestPath: string;
  generationCommit: string;
  conformanceMarkerPath: string;
  conformanceManifestPath: string;
  conformanceCommit: string;
  ticketPath: string;
  ticketSha256: string;
}

export interface LegacyCheckpointProof {
  markerPath: string;
  subject: string;
  checkpointKind: string;
  checkpointCommit: string;
  parentHead: string;
  manifestPath: string;
  manifestSha256: string;
  markerSha256: string;
  targetHead: string;
  ticketRevision: TicketRevisionProof;
  preservedPathDrift: Array<{
    path: string;
    checkpointTreeEntry: string | null;
    migrationTreeEntry: string | null;
  }>;
  nextOperation: string;
  commitMessage: string;
}

function validPreservedPathDrift(value: unknown): value is LegacyCheckpointProof["preservedPathDrift"][number] {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const drift = value as Record<string, unknown>;
  return Object.keys(drift).length === 3
    && typeof drift.path === "string" && drift.path.length > 0 && drift.path.length <= 1024
    && (drift.checkpointTreeEntry === null || (typeof drift.checkpointTreeEntry === "string" && drift.checkpointTreeEntry.length <= 1200))
    && (drift.migrationTreeEntry === null || (typeof drift.migrationTreeEntry === "string" && drift.migrationTreeEntry.length <= 1200))
    && drift.checkpointTreeEntry !== drift.migrationTreeEntry;
}

export function isLegacyCheckpointProof(value: unknown): value is LegacyCheckpointProof {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const proof = value as Record<string, unknown>;
  const keys = [
    "markerPath",
    "subject",
    "checkpointKind",
    "checkpointCommit",
    "parentHead",
    "manifestPath",
    "manifestSha256",
    "markerSha256",
    "targetHead",
    "ticketRevision",
    "preservedPathDrift",
    "nextOperation",
    "commitMessage",
  ];
  return Object.keys(proof).length === keys.length
    && keys.every((key) => key in proof)
    && typeof proof.markerPath === "string" && proof.markerPath.startsWith("docs/")
    && typeof proof.subject === "string" && proof.subject.length > 0 && proof.subject.length <= 240
    && typeof proof.checkpointKind === "string" && CHECKPOINT_KINDS.has(proof.checkpointKind)
    && typeof proof.checkpointCommit === "string" && /^[0-9a-f]{40}$/.test(proof.checkpointCommit)
    && typeof proof.parentHead === "string" && /^[0-9a-f]{40}$/.test(proof.parentHead)
    && typeof proof.manifestPath === "string" && proof.manifestPath.startsWith("docs/")
    && typeof proof.manifestSha256 === "string" && /^[0-9a-f]{64}$/.test(proof.manifestSha256)
    && typeof proof.markerSha256 === "string" && /^[0-9a-f]{64}$/.test(proof.markerSha256)
    && typeof proof.targetHead === "string" && /^[0-9a-f]{40}$/.test(proof.targetHead)
    && validTicketRevisionProof(proof.ticketRevision)
    && Array.isArray(proof.preservedPathDrift) && proof.preservedPathDrift.length <= 128
    && proof.preservedPathDrift.every(validPreservedPathDrift)
    && proof.nextOperation === MIGRATABLE_NEXT_OPERATION
    && typeof proof.commitMessage === "string" && proof.commitMessage.length > 0 && proof.commitMessage.length <= 500;
}

function validTicketRevisionProof(value: unknown): value is TicketRevisionProof {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const revision = value as Record<string, unknown>;
  const keys = [
    "generationMarkerPath",
    "generationManifestPath",
    "generationCommit",
    "conformanceMarkerPath",
    "conformanceManifestPath",
    "conformanceCommit",
    "ticketPath",
    "ticketSha256",
  ];
  return Object.keys(revision).length === keys.length
    && keys.every((key) => key in revision)
    && typeof revision.generationMarkerPath === "string" && revision.generationMarkerPath.startsWith("docs/workflow-checkpoints/")
    && typeof revision.generationManifestPath === "string" && revision.generationManifestPath.startsWith("docs/workflow-checkpoints/")
    && typeof revision.generationCommit === "string" && /^[0-9a-f]{40}$/.test(revision.generationCommit)
    && typeof revision.conformanceMarkerPath === "string" && revision.conformanceMarkerPath.startsWith("docs/workflow-checkpoints/")
    && typeof revision.conformanceManifestPath === "string" && revision.conformanceManifestPath.startsWith("docs/workflow-checkpoints/")
    && typeof revision.conformanceCommit === "string" && /^[0-9a-f]{40}$/.test(revision.conformanceCommit)
    && typeof revision.ticketPath === "string" && revision.ticketPath.startsWith("docs/tickets/")
    && typeof revision.ticketSha256 === "string" && /^[0-9a-f]{64}$/.test(revision.ticketSha256);
}

export function legacyMigrationReportPath(subject: string, checkpointCommit: string): string {
  const slug = subject.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "ticket";
  return `docs/workflow-checkpoints/${slug}-legacy-checkpoint-lineage-${checkpointCommit.slice(0, 12)}.md`;
}

async function git(root: string, args: string[]): Promise<string> {
  try {
    const { stdout } = await execFileAsync("git", args, {
      cwd: root,
      encoding: "utf8",
      maxBuffer: 16 * 1024 * 1024,
    });
    return stdout;
  } catch (error) {
    throw new OrchestrationStop("INCOMPLETE_CANONICAL_RESULT", "Legacy checkpoint validation could not read the required Git evidence.", {
      args,
      cause: String(error),
    });
  }
}

function sha256(value: string): string {
  return createHash("sha256").update(Buffer.from(value, "utf8")).digest("hex");
}

function safeRepoPath(root: string, value: unknown, label: string): string {
  if (typeof value !== "string" || value.length === 0 || value.includes("\\")
    || /[\u0000-\u001f\u007f]/.test(value) || value.startsWith("/")
    || /^[A-Za-z]:/.test(value)
    || value.split("/").some((segment) => segment === "" || segment === "." || segment === ".." || segment.toLowerCase() === ".git")) {
    throw new OrchestrationStop("INVALID_PATH", `${label} is not a normalized repository-relative path.`, { path: value });
  }
  const absolute = resolve(root, value);
  const relativePath = relative(root, absolute);
  if (!relativePath || relativePath === ".." || relativePath.startsWith(`..${sep}`) || relativePath.startsWith(sep)
    || relativePath.split(sep).join("/") !== value) {
    throw new OrchestrationStop("INVALID_PATH", `${label} escapes the repository or uses a non-canonical spelling.`, { path: value });
  }
  return absolute;
}

async function gitFile(root: string, commit: string, path: string): Promise<string> {
  return git(root, ["show", `${commit}:${path}`]);
}

async function assertWorkingTreeMatches(root: string, commit: string, path: string, label: string): Promise<void> {
  try {
    await execFileAsync("git", ["--literal-pathspecs", "diff", "--quiet", "--no-ext-diff", "--no-renames", commit, "--", path], {
      cwd: root,
      encoding: "utf8",
      maxBuffer: 1024 * 1024,
    });
  } catch (error) {
    const code = (error as { code?: string | number }).code;
    if (code === 1 || code === "1") {
      throw new OrchestrationStop("CANONICAL_ARTIFACT_CONTRADICTION", `${label} differs from the pinned Git tree.`, {
        path,
        commit,
      });
    }
    throw new OrchestrationStop("INCOMPLETE_CANONICAL_RESULT", `Git could not compare ${label} with the pinned tree.`, {
      path,
      commit,
      cause: String(error),
    });
  }
}

async function currentRepoFile(root: string, path: string, label: string): Promise<string> {
  const absolute = safeRepoPath(root, path, label);
  const info = await lstat(absolute).catch(() => undefined);
  if (!info?.isFile() || info.isSymbolicLink()) {
    throw new OrchestrationStop("CANONICAL_ARTIFACT_CONTRADICTION", `${label} is missing, not a regular file, or a symlink in the working tree.`, { path });
  }
  const [canonicalRoot, canonicalFile] = await Promise.all([realpath(root), realpath(absolute)]);
  const canonicalRelative = relative(canonicalRoot, canonicalFile).split(sep).join("/");
  if (canonicalRelative !== path) {
    throw new OrchestrationStop("INVALID_PATH", `${label} resolves through a symlink or outside its canonical repository path.`, {
      path,
      canonicalPath: canonicalRelative,
    });
  }
  return readFile(absolute, "utf8");
}

async function treeEntry(root: string, commit: string, path: string): Promise<string | null> {
  const output = await git(root, ["--literal-pathspecs", "ls-tree", "-r", "-z", commit, "--", path]);
  const entries = output.split("\0").filter(Boolean);
  const exact = entries.filter((entry) => entry.slice(entry.indexOf("\t") + 1) === path);
  if (exact.length > 1) {
    throw new OrchestrationStop("AMBIGUOUS_STATE", "Git tree contains duplicate exact entries for a manifest path.", {
      commit,
      path,
      entries: exact,
    });
  }
  return exact[0] ?? null;
}

async function pathExists(absolute: string, path: string): Promise<boolean> {
  try {
    await lstat(absolute);
    return true;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return false;
    throw new OrchestrationStop("INCOMPLETE_CANONICAL_RESULT", "Could not determine whether a legacy checkpoint deletion reappeared in the working tree.", {
      path,
      cause: String(error),
    });
  }
}

async function isAncestor(root: string, ancestor: string, descendant: string): Promise<boolean> {
  try {
    await execFileAsync("git", ["merge-base", "--is-ancestor", ancestor, descendant], {
      cwd: root,
      encoding: "utf8",
      maxBuffer: 1024 * 1024,
    });
    return true;
  } catch (error) {
    if ((error as { code?: string | number }).code === 1) return false;
    throw new OrchestrationStop("INCOMPLETE_CANONICAL_RESULT", "Git could not establish checkpoint commit ancestry.", {
      ancestor,
      descendant,
      cause: String(error),
    });
  }
}

async function checkpointCommitForPath(root: string, head: string, markerPath: string): Promise<string> {
  const value = (await git(root, ["log", "-1", "--format=%H", "--diff-filter=A", head, "--", markerPath])).trim();
  if (!/^[0-9a-f]{40}$/.test(value)) {
    throw new OrchestrationStop("INCOMPLETE_CANONICAL_RESULT", "Legacy checkpoint marker has no unique committed introduction in the current history.", {
      markerPath,
      head,
    });
  }
  return value;
}

async function commitDetails(root: string, commit: string): Promise<{ hash: string; parents: string[]; message: string }> {
  const value = await git(root, ["show", "-s", "--format=%H%x00%P%x00%B", commit]);
  const [hash = "", parents = "", ...messageParts] = value.split("\0");
  return { hash: hash.trim(), parents: parents.trim().split(/\s+/).filter(Boolean), message: messageParts.join("\0").trim() };
}

interface PhaseManifest {
  schemaVersion: number;
  manifestKind: string;
  phaseId: string;
  operation: string;
  subject: { id: string; type: string };
  sourceAuthority: Array<{ path: string; sha256: string }>;
  target: { head: string; semanticFingerprint: string };
  paths: {
    manifest: string;
    preserve: string[];
    delete: string[];
    unstagedRecovery: string[];
    marker: string;
  };
  nextAuthorizedOperation: string;
  commitMessage: string;
}

function parseManifest(text: string, path: string): PhaseManifest {
  try {
    const manifest = JSON.parse(text) as PhaseManifest;
    if (!manifest || manifest.schemaVersion !== 1 || manifest.manifestKind !== "PHASE_CHECKPOINT"
      || typeof manifest.phaseId !== "string" || manifest.phaseId.trim() === ""
      || typeof manifest.operation !== "string" || manifest.operation.trim() === ""
      || !manifest.subject || typeof manifest.subject.type !== "string" || typeof manifest.subject.id !== "string"
      || !manifest.target || !/^[0-9a-f]{40}$/.test(manifest.target.head)
      || typeof manifest.target.semanticFingerprint !== "string" || manifest.target.semanticFingerprint.length === 0
      || !manifest.paths || !Array.isArray(manifest.paths.preserve) || !Array.isArray(manifest.paths.delete)
      || !Array.isArray(manifest.paths.unstagedRecovery) || typeof manifest.paths.manifest !== "string"
      || typeof manifest.paths.marker !== "string" || !Array.isArray(manifest.sourceAuthority)
      || manifest.sourceAuthority.length === 0 || typeof manifest.nextAuthorizedOperation !== "string"
      || manifest.nextAuthorizedOperation.length === 0
      || typeof manifest.commitMessage !== "string") {
      throw new Error("manifest fields do not match the phase checkpoint contract");
    }
    for (const [index, source] of manifest.sourceAuthority.entries()) {
      if (!source || typeof source.path !== "string" || !/^[0-9a-f]{64}$/.test(source.sha256)) {
        throw new Error(`sourceAuthority[${index}] is invalid`);
      }
    }
    if (new Set(manifest.sourceAuthority.map((source) => source.path)).size !== manifest.sourceAuthority.length) {
      throw new Error("sourceAuthority contains duplicate paths");
    }
    return manifest;
  } catch (error) {
    throw new OrchestrationStop("INCOMPLETE_CANONICAL_RESULT", "Legacy checkpoint phase manifest is invalid.", {
      manifestPath: path,
      cause: String(error),
    });
  }
}

function requireSingleField(text: string, name: string, artifactPath: string): string {
  const values = fieldValues(text, name);
  if (values.length !== 1) {
    throw new OrchestrationStop("INCOMPLETE_CANONICAL_RESULT", `Legacy checkpoint marker must contain exactly one ${name} field.`, {
      artifactPath,
      field: name,
      count: values.length,
    });
  }
  return values[0];
}

function sameSet(left: string[], right: string[]): boolean {
  return left.length === right.length && new Set(left).size === left.length && left.every((value) => right.includes(value));
}

interface VerifiedPhaseCheckpoint {
  markerPath: string;
  manifestPath: string;
  commit: string;
  targetHead: string;
  markerText: string;
  manifest: PhaseManifest;
}

async function verifyTicketSetCheckpoint(
  root: string,
  specId: string,
  targetHead: string,
  phase: "generation" | "conformance",
  requireCurrent: boolean,
): Promise<VerifiedPhaseCheckpoint> {
  const stem = `${specId}-component-implementation-tickets-${phase}`;
  const markerPath = `docs/workflow-checkpoints/${stem}.md`;
  const manifestPath = `docs/workflow-checkpoints/${stem}-manifest.json`;
  const operation = phase === "generation"
    ? "checkpoint-component-implementation-tickets-generation"
    : "checkpoint-component-implementation-tickets-conformance";
  const checkpointKind = phase === "generation"
    ? "COMPONENT_IMPLEMENTATION_TICKETS_GENERATION_CHECKPOINT"
    : "COMPONENT_IMPLEMENTATION_TICKETS_CONFORMANCE_CHECKPOINT";
  const expectedNextOperation = phase === "generation"
    ? "audit-component-implementation-tickets"
    : "design-ticket-implementation";
  safeRepoPath(root, markerPath, "Current ticket-set checkpoint marker");
  safeRepoPath(root, manifestPath, "Current ticket-set phase manifest");

  const markerText = await gitFile(root, targetHead, markerPath);
  const manifestText = await gitFile(root, targetHead, manifestPath);
  const manifest = parseManifest(manifestText, manifestPath);
  const parentHead = requireSingleField(markerText, "PARENT_HEAD", markerPath);
  const markerManifestPath = requireSingleField(markerText, "PHASE_MANIFEST", markerPath);
  const commitMessage = requireSingleField(markerText, "CHECKPOINT_COMMIT_MESSAGE", markerPath);
  const nextOperation = requireSingleField(markerText, "NEXT_AUTHORIZED_OPERATION", markerPath);
  const sourceAuditPath = phase === "conformance"
    ? requireSingleField(markerText, "SOURCE_AUDIT", markerPath)
    : undefined;
  if (requireSingleField(markerText, "CHECKPOINT_KIND", markerPath) !== checkpointKind
    || requireSingleField(markerText, "COMPONENT", markerPath) !== specId
    || markerManifestPath !== manifestPath
    || !/^[0-9a-f]{40}$/.test(parentHead)
    || nextOperation !== expectedNextOperation
    || manifest.operation !== operation
    || manifest.subject.id !== specId || manifest.subject.type !== "component"
    || manifest.target.head !== parentHead
    || manifest.paths.manifest !== manifestPath || manifest.paths.marker !== markerPath
    || manifest.nextAuthorizedOperation !== nextOperation || manifest.commitMessage !== commitMessage) {
    throw new OrchestrationStop("CANONICAL_ARTIFACT_CONTRADICTION", "Current implementation-ticket set checkpoint does not match its phase manifest and declared gate.", {
      phase,
      markerPath,
      manifestPath,
      expectedOperation: operation,
      actualOperation: manifest.operation,
      specId,
      manifestSubject: manifest.subject,
      parentHead,
      manifestTargetHead: manifest.target.head,
    });
  }
  if (phase === "conformance") {
    if (requireSingleField(markerText, "AUDIT_VERDICT", markerPath) !== "IMPLEMENTATION_TICKETS_CONFORMANT"
      || requireSingleField(markerText, "IMPLEMENTATION_GATE", markerPath) !== "READY_FOR_IMPLEMENTATION"
      || requireSingleField(markerText, "TICKET_SET_AUDIT_COMPLETE", markerPath) !== "YES") {
      throw new OrchestrationStop("MISSING_AUTHORITY", "Current implementation-ticket set has no conformant, complete independent audit checkpoint.", {
        markerPath,
      });
    }
  } else if (requireSingleField(markerText, "TICKET_DECOMPOSITION_GATE", markerPath) !== "READY_FOR_TICKET_AUDIT") {
    throw new OrchestrationStop("MISSING_AUTHORITY", "Current implementation-ticket set has no completed generation checkpoint ready for audit.", {
      markerPath,
    });
  }

  const checkpointCommit = await checkpointCommitForPath(root, targetHead, markerPath);
  const details = await commitDetails(root, checkpointCommit);
  const committedMarker = await gitFile(root, checkpointCommit, markerPath);
  const committedManifest = await gitFile(root, checkpointCommit, manifestPath);
  const committedPaths = (await git(root, ["diff-tree", "--no-commit-id", "--name-only", "--no-renames", "-r", "-z", checkpointCommit]))
    .split("\0").filter(Boolean);
  const effectivePaths = [...manifest.paths.preserve, ...manifest.paths.delete, manifestPath, markerPath];
  if (details.hash !== checkpointCommit || details.parents.length !== 1 || details.parents[0] !== parentHead
    || details.message !== commitMessage || committedMarker !== markerText || committedManifest !== manifestText
    || !sameSet(effectivePaths, committedPaths)
    || !(await isAncestor(root, checkpointCommit, targetHead))) {
    throw new OrchestrationStop("CANONICAL_ARTIFACT_CONTRADICTION", "Current implementation-ticket set checkpoint commit, parent, paths, or ancestry is invalid.", {
      phase,
      markerPath,
      checkpointCommit,
      actualParents: details.parents,
      parentHead,
      committedPaths,
      manifestPaths: effectivePaths,
    });
  }
  for (const path of [...manifest.paths.preserve, ...manifest.paths.delete, ...manifest.paths.unstagedRecovery, manifestPath, markerPath]) {
    safeRepoPath(root, path, "Current ticket-set manifest path");
  }
  for (const source of manifest.sourceAuthority) {
    safeRepoPath(root, source.path, "Current ticket-set source authority");
    const sourceText = await gitFile(root, checkpointCommit, source.path);
    const checkpointSource = await treeEntry(root, checkpointCommit, source.path);
    const targetSource = await treeEntry(root, targetHead, source.path);
    if (sha256(sourceText) !== source.sha256 || !checkpointSource
      || (phase === "conformance" && source.path === sourceAuditPath && checkpointSource !== targetSource)) {
      throw new OrchestrationStop("CANONICAL_ARTIFACT_CONTRADICTION", "Current ticket-set source authority digest or current conformance audit is invalid.", {
        phase,
        sourcePath: source.path,
      });
    }
  }
  if (sourceAuditPath) {
    const auditSource = manifest.sourceAuthority.find((source) => source.path === sourceAuditPath);
    const auditText = await gitFile(root, checkpointCommit, sourceAuditPath);
    if (!auditSource || fieldLast(auditText, "VERDICT") !== "IMPLEMENTATION_TICKETS_CONFORMANT"
      || fieldLast(auditText, "IMPLEMENTATION_GATE") !== "READY_FOR_IMPLEMENTATION"
      || fieldLast(auditText, "CURRENT_HEAD") !== manifest.target.head
      || requireSingleField(markerText, "SOURCE_AUDIT_SHA256", markerPath) !== auditSource.sha256) {
      throw new OrchestrationStop("MISSING_AUTHORITY", "The current ticket-set checkpoint does not preserve its conformant independent audit as source authority.", {
        markerPath,
        sourceAuditPath,
      });
    }
  }
  if (requireCurrent) {
    for (const path of [markerPath, manifestPath, ...manifest.sourceAuthority.map((source) => source.path)]) {
      await currentRepoFile(root, path, "Current ticket-set checkpoint evidence");
      await assertWorkingTreeMatches(root, targetHead, path, "Current ticket-set checkpoint evidence");
    }
  }
  return { markerPath, manifestPath, commit: checkpointCommit, targetHead: manifest.target.head, markerText, manifest };
}

async function verifyCurrentTicketRevision(
  root: string,
  specId: string,
  subject: string,
  targetHead: string,
  checkpointCommit: string,
  requireCurrent: boolean,
): Promise<TicketRevisionProof> {
  const generation = await verifyTicketSetCheckpoint(root, specId, targetHead, "generation", requireCurrent);
  const conformance = await verifyTicketSetCheckpoint(root, specId, targetHead, "conformance", requireCurrent);
  const auditPath = requireSingleField(conformance.markerText, "SOURCE_AUDIT", conformance.markerPath);
  const auditText = await gitFile(root, conformance.commit, auditPath);
  const generationTargetLine = fieldLast(auditText, "TICKET_DECOMPOSITION_BASELINE") ?? "";
  if (!(await isAncestor(root, generation.commit, conformance.commit))
    || !generationTargetLine.includes(generation.manifest.target.head)) {
    throw new OrchestrationStop("CANONICAL_ARTIFACT_CONTRADICTION", "The conformant ticket audit does not bind the current generated ticket-set revision.", {
      generationCommit: generation.commit,
      conformanceCommit: conformance.commit,
      generationTargetHead: generation.manifest.target.head,
      ticketDecompositionBaseline: generationTargetLine,
    });
  }
  if (!(await isAncestor(root, conformance.commit, checkpointCommit))) {
    throw new OrchestrationStop("CANONICAL_ARTIFACT_CONTRADICTION", "The legacy checkpoint predates the current conformant ticket set and belongs to an obsolete ticket revision.", {
      subject,
      checkpointCommit,
      currentTicketSetConformanceCommit: conformance.commit,
      currentTicketSetMarker: conformance.markerPath,
    });
  }
  const ticketDirectory = `docs/tickets/${specId}/`;
  const currentTicketPaths = generation.manifest.paths.preserve.filter((path) =>
    path.startsWith(ticketDirectory) && path.slice(ticketDirectory.length).startsWith(`${subject}-`)
    && path.slice(ticketDirectory.length).split("/").length === 1 && path.toLowerCase().endsWith(".md"));
  if (currentTicketPaths.length !== 1) {
    throw new OrchestrationStop("MISSING_AUTHORITY", "The approved generated ticket set does not identify exactly one current artifact for this ticket ID.", {
      subject,
      generationManifestPath: generation.manifestPath,
      currentTicketPaths,
    });
  }
  const ticketPath = currentTicketPaths[0];
  const generationTreeEntry = await treeEntry(root, generation.commit, ticketPath);
  const conformanceTreeEntry = await treeEntry(root, conformance.targetHead, ticketPath);
  const migrationTreeEntry = await treeEntry(root, targetHead, ticketPath);
  if (!generationTreeEntry || !conformanceTreeEntry || !migrationTreeEntry) {
    throw new OrchestrationStop("CANONICAL_ARTIFACT_CONTRADICTION", "The current ticket artifact is absent from the generated set, conformance baseline, or migration target.", {
      subject,
      ticketPath,
      generationTreeEntry,
      conformanceTreeEntry,
      migrationTreeEntry,
    });
  }
  if (requireCurrent) await assertWorkingTreeMatches(root, targetHead, ticketPath, "Current ticket revision");
  const ticketText = await gitFile(root, targetHead, ticketPath);
  return {
    generationMarkerPath: generation.markerPath,
    generationManifestPath: generation.manifestPath,
    generationCommit: generation.commit,
    conformanceMarkerPath: conformance.markerPath,
    conformanceManifestPath: conformance.manifestPath,
    conformanceCommit: conformance.commit,
    ticketPath,
    ticketSha256: sha256(ticketText),
  };
}

async function verifyCheckpoint(
  root: string,
  markerPath: string,
  subject: string,
  targetHead: string,
  options: { requireCurrent: boolean; expected?: LegacyCheckpointProof },
): Promise<LegacyCheckpointProof> {
  const markerAbsolute = safeRepoPath(root, markerPath, "Legacy checkpoint marker");
  const markerParts = markerPath.split("/");
  const markerName = markerParts.at(-1) ?? "";
  if (markerParts.length !== 5 || markerParts[0] !== "docs" || markerParts[1] !== "tickets"
    || !markerParts[2] || markerParts[3] !== `${subject}-checkpoints`
    || !markerName.startsWith(`${subject}-`) || !markerName.toLowerCase().endsWith(".md")) {
    throw new OrchestrationStop("INVALID_PATH", "Legacy checkpoint migration accepts only canonical ticket checkpoint markers under docs/tickets/.", { markerPath });
  }
  const markerDir = resolve(markerAbsolute, "..");
  if (options.requireCurrent) {
    const markerInfo = await lstat(markerAbsolute).catch(() => undefined);
    if (!markerInfo?.isFile() || markerInfo.isSymbolicLink()) {
      throw new OrchestrationStop("INCOMPLETE_CANONICAL_RESULT", "Legacy checkpoint marker is missing, not a regular file, or a symlink.", { markerPath });
    }
    await currentRepoFile(root, markerPath, "Legacy checkpoint marker");
    const [canonicalRoot, canonicalDocs, canonicalMarker] = await Promise.all([
      realpath(root),
      realpath(resolve(root, "docs")),
      realpath(markerAbsolute),
    ]);
    const markerFromRoot = relative(canonicalRoot, canonicalMarker).split(sep).join("/");
    const markerFromDocs = relative(canonicalDocs, canonicalMarker);
    if (markerFromRoot !== markerPath || !markerFromDocs || markerFromDocs === ".."
      || markerFromDocs.startsWith(`..${sep}`) || markerFromDocs.startsWith(sep)) {
      throw new OrchestrationStop("INVALID_PATH", "Legacy checkpoint marker resolves through a symlink or outside docs/.", { markerPath });
    }
    await assertWorkingTreeMatches(root, targetHead, markerPath, "Legacy checkpoint marker");
  }
  const markerText = await gitFile(root, targetHead, markerPath);
  if (markerText.includes("<!-- WORKFLOW_RESULT_V2")) {
    throw new OrchestrationStop("CANONICAL_ARTIFACT_CONTRADICTION", "A checkpoint with an existing V2 record cannot enter legacy migration.", { markerPath });
  }
  const actualTicketId = requireSingleField(markerText, "TICKET_ID", markerPath);
  if (actualTicketId !== subject) {
    throw new OrchestrationStop("CANONICAL_ARTIFACT_CONTRADICTION", "Legacy checkpoint marker belongs to a different ticket ID.", {
      markerPath,
      expectedSubject: subject,
      actualTicketId,
    });
  }
  const checkpointCommit = await checkpointCommitForPath(root, targetHead, markerPath);
  const ticketRevision = await verifyCurrentTicketRevision(
    root,
    markerParts[2],
    subject,
    targetHead,
    checkpointCommit,
    options.requireCurrent,
  );
  const checkpointKind = requireSingleField(markerText, "CHECKPOINT_KIND", markerPath);
  const parentHead = requireSingleField(markerText, "PARENT_HEAD", markerPath);
  const manifestPath = requireSingleField(markerText, "PHASE_MANIFEST", markerPath);
  const nextOperation = requireSingleField(markerText, "NEXT_AUTHORIZED_OPERATION", markerPath);
  const commitMessage = requireSingleField(markerText, "CHECKPOINT_COMMIT_MESSAGE", markerPath);
  if (!CHECKPOINT_KINDS.has(checkpointKind) || !/^[0-9a-f]{40}$/.test(parentHead)
    || nextOperation !== MIGRATABLE_NEXT_OPERATION || !commitMessage) {
    throw new OrchestrationStop("CANONICAL_ARTIFACT_CONTRADICTION", "Legacy checkpoint identity, kind, parent, or audit handoff is not eligible for migration.", {
      markerPath,
      expectedSubject: subject,
      actualTicketId,
      checkpointKind,
      parentHead,
      nextOperation,
    });
  }
  safeRepoPath(root, manifestPath, "Legacy phase manifest");
  if (!manifestPath.startsWith("docs/workflow-checkpoints/") || !manifestPath.toLowerCase().endsWith(".json")) {
    throw new OrchestrationStop("INVALID_PATH", "Legacy checkpoint manifest must be a JSON artifact under docs/workflow-checkpoints/.", { manifestPath });
  }

  const details = await commitDetails(root, checkpointCommit);
  if (details.hash !== checkpointCommit || details.parents.length !== 1 || details.parents[0] !== parentHead
    || details.message !== commitMessage) {
    throw new OrchestrationStop("CANONICAL_ARTIFACT_CONTRADICTION", "Legacy checkpoint commit does not match the marker's parent and commit message.", {
      markerPath,
      checkpointCommit,
      markerParentHead: parentHead,
      actualParents: details.parents,
      markerCommitMessage: commitMessage,
      actualCommitMessage: details.message,
    });
  }
  if (!(await isAncestor(root, checkpointCommit, targetHead))) {
    throw new OrchestrationStop("CANONICAL_ARTIFACT_CONTRADICTION", "Legacy checkpoint commit is not an ancestor of the captured migration target.", {
      checkpointCommit,
      targetHead,
    });
  }

  const committedMarker = await gitFile(root, checkpointCommit, markerPath);
  const committedManifest = await gitFile(root, checkpointCommit, manifestPath);
  if (committedMarker !== markerText) {
    throw new OrchestrationStop("CANONICAL_ARTIFACT_CONTRADICTION", "Legacy checkpoint commit does not contain the selected marker exactly as it exists in the pinned tree.", {
      markerPath,
      checkpointCommit,
    });
  }
  safeRepoPath(root, manifestPath, "Legacy phase manifest");
  if (options.requireCurrent) {
    await currentRepoFile(root, manifestPath, "Legacy phase manifest");
    await assertWorkingTreeMatches(root, targetHead, manifestPath, "Legacy phase manifest");
  }
  if (await gitFile(root, targetHead, manifestPath) !== committedManifest) {
    throw new OrchestrationStop("CANONICAL_ARTIFACT_CONTRADICTION", "Legacy phase manifest differs from the committed checkpoint manifest.", {
      markerPath,
      manifestPath,
    });
  }
  const manifest = parseManifest(committedManifest, manifestPath);
  if (manifest.operation !== "checkpoint-implemented-ticket" || manifest.subject.type !== "ticket"
    || manifest.subject.id !== subject || manifest.target.head !== parentHead
    || manifest.paths.manifest !== manifestPath || manifest.paths.marker !== markerPath
    || manifest.nextAuthorizedOperation !== nextOperation || manifest.commitMessage !== commitMessage) {
    throw new OrchestrationStop("CANONICAL_ARTIFACT_CONTRADICTION", "Legacy checkpoint manifest disagrees with the marker or commit identity.", {
      markerPath,
      manifestPath,
      subject: manifest.subject.id,
      markerParentHead: parentHead,
      manifestTargetHead: manifest.target.head,
      markerNextOperation: nextOperation,
      manifestNextOperation: manifest.nextAuthorizedOperation,
    });
  }
  if (!manifest.paths.preserve.includes(ticketRevision.ticketPath)) {
    throw new OrchestrationStop("CANONICAL_ARTIFACT_CONTRADICTION", "The current ticket checkpoint does not preserve the exact ticket artifact approved by the current ticket set.", {
      markerPath,
      ticketPath: ticketRevision.ticketPath,
    });
  }
  if (!CHECKPOINT_KINDS.has(checkpointKind)) {
    throw new OrchestrationStop("CANONICAL_ARTIFACT_CONTRADICTION", "Legacy checkpoint kind is not supported by the controlled migration.", { checkpointKind });
  }
  const fingerprintFields = [...markerText.matchAll(/^\s*([A-Za-z][A-Za-z0-9_]*)\s*[:=]\s*(.*?)\s*$/gm)]
    .filter((match) => /FINGERPRINT$/i.test(match[1]))
    .map((match) => match[2].trim());
  if (!fingerprintFields.includes(manifest.target.semanticFingerprint)) {
    throw new OrchestrationStop("CANONICAL_ARTIFACT_CONTRADICTION", "Legacy checkpoint marker does not persist the semantic fingerprint bound by its manifest.", {
      markerPath,
      manifestFingerprint: manifest.target.semanticFingerprint,
    });
  }

  const pathGroups = [
    manifest.paths.preserve,
    manifest.paths.delete,
    manifest.paths.unstagedRecovery,
    [manifest.paths.manifest, manifest.paths.marker],
  ];
  const allDeclared = pathGroups.flat();
  for (const path of allDeclared) safeRepoPath(root, path, "Phase manifest path");
  if (new Set(allDeclared).size !== allDeclared.length) {
    throw new OrchestrationStop("INCOMPLETE_CANONICAL_RESULT", "Legacy checkpoint manifest contains duplicate paths.", { manifestPath });
  }
  const effectivePaths = [...manifest.paths.preserve, ...manifest.paths.delete, manifest.paths.manifest, manifest.paths.marker];
  const committedPaths = (await git(root, ["diff-tree", "--no-commit-id", "--name-only", "--no-renames", "-r", "-z", checkpointCommit]))
    .split("\0").filter(Boolean);
  if (!sameSet(effectivePaths, committedPaths)) {
    throw new OrchestrationStop("CANONICAL_ARTIFACT_CONTRADICTION", "Legacy checkpoint commit paths do not exactly match its phase manifest.", {
      manifestPath,
      checkpointCommit,
      manifestPaths: effectivePaths,
      committedPaths,
    });
  }

  for (const path of manifest.sourceAuthority.map((source) => source.path)) safeRepoPath(root, path, "Manifest source authority");
  for (const source of manifest.sourceAuthority) {
    const sourceText = await gitFile(root, checkpointCommit, source.path);
    if (sha256(sourceText) !== source.sha256) {
      throw new OrchestrationStop("CANONICAL_ARTIFACT_CONTRADICTION", "Legacy checkpoint source authority digest does not match the committed artifact.", {
        manifestPath,
        sourcePath: source.path,
      });
    }
    const checkpointSource = await treeEntry(root, checkpointCommit, source.path);
    const targetSource = await treeEntry(root, targetHead, source.path);
    if (!checkpointSource || checkpointSource !== targetSource) {
      throw new OrchestrationStop("CANONICAL_ARTIFACT_CONTRADICTION", "Legacy checkpoint source authority differs from the pinned migration tree.", {
        manifestPath,
        sourcePath: source.path,
      });
    }
    if (options.requireCurrent) {
      await currentRepoFile(root, source.path, "Manifest source authority");
      await assertWorkingTreeMatches(root, targetHead, source.path, "Manifest source authority");
    }
  }
  const preservedPathDrift: LegacyCheckpointProof["preservedPathDrift"] = [];
  for (const path of [...manifest.paths.preserve, manifest.paths.manifest, manifest.paths.marker]) {
    const checkpointEntry = await treeEntry(root, checkpointCommit, path);
    const targetEntry = await treeEntry(root, targetHead, path);
    if (path === manifest.paths.manifest || path === manifest.paths.marker) {
      if (!checkpointEntry || checkpointEntry !== targetEntry) {
        throw new OrchestrationStop("CANONICAL_ARTIFACT_CONTRADICTION", "The legacy checkpoint marker or manifest changed after its checkpoint commit.", {
          path,
          checkpointCommit,
          targetHead,
        });
      }
    } else if (!checkpointEntry) {
      throw new OrchestrationStop("CANONICAL_ARTIFACT_CONTRADICTION", "A path declared preserved was absent from the legacy checkpoint tree.", {
        path,
        checkpointCommit,
        targetHead,
      });
    }
    if (checkpointEntry !== targetEntry) {
      preservedPathDrift.push({ path, checkpointTreeEntry: checkpointEntry, migrationTreeEntry: targetEntry });
    }
    if (options.requireCurrent) {
      if (targetEntry) await currentRepoFile(root, path, "Checkpoint path at migration target");
      else if (await pathExists(safeRepoPath(root, path, "Checkpoint path at migration target"), path)) {
        throw new OrchestrationStop("CANONICAL_ARTIFACT_CONTRADICTION", "A checkpoint path absent from the pinned migration tree has reappeared in the working tree.", {
          path,
          targetHead,
        });
      }
      await assertWorkingTreeMatches(root, targetHead, path, "Checkpoint-preserved path");
    }
  }
  for (const path of manifest.paths.delete) {
    const checkpointEntry = await treeEntry(root, checkpointCommit, path);
    const targetEntry = await treeEntry(root, targetHead, path);
    if (checkpointEntry) {
      throw new OrchestrationStop("CANONICAL_ARTIFACT_CONTRADICTION", "A path declared deleted still exists in the legacy checkpoint tree.", {
        path,
        checkpointCommit,
        targetHead,
      });
    }
    if (checkpointEntry !== targetEntry) {
      preservedPathDrift.push({ path, checkpointTreeEntry: checkpointEntry, migrationTreeEntry: targetEntry });
    }
    if (options.requireCurrent) {
      if (targetEntry) await currentRepoFile(root, path, "Checkpoint-deleted path at migration target");
      else if (await pathExists(safeRepoPath(root, path, "Checkpoint-deleted path"), path)) {
        throw new OrchestrationStop("CANONICAL_ARTIFACT_CONTRADICTION", "A path deleted by the legacy checkpoint has reappeared in the working tree.", {
          path,
          checkpointCommit,
          targetHead,
        });
      }
      await assertWorkingTreeMatches(root, targetHead, path, "Checkpoint-deleted path");
    }
  }
  if (preservedPathDrift.length > MAX_PRESERVED_PATH_DRIFT) {
    throw new OrchestrationStop("INCOMPLETE_CANONICAL_RESULT", "Legacy checkpoint descendant drift exceeds the bounded migration proof limit.", {
      driftCount: preservedPathDrift.length,
      maxDriftPaths: MAX_PRESERVED_PATH_DRIFT,
    });
  }

  if (options.requireCurrent) await assertLatestTicketCheckpoint(root, markerDir, markerPath, subject, targetHead, checkpointCommit);

  const proof: LegacyCheckpointProof = {
    markerPath,
    subject,
    checkpointKind,
    checkpointCommit,
    parentHead,
    manifestPath,
    manifestSha256: sha256(committedManifest),
    markerSha256: sha256(committedMarker),
    targetHead,
    ticketRevision,
    preservedPathDrift,
    nextOperation,
    commitMessage,
  };
  if (options.expected && JSON.stringify(proof) !== JSON.stringify(options.expected)) {
    throw new OrchestrationStop("CANONICAL_ARTIFACT_CONTRADICTION", "Legacy checkpoint proof changed after migration intake.", {
      markerPath,
      expected: options.expected,
      actual: proof,
    });
  }
  return proof;
}

async function assertLatestTicketCheckpoint(
  root: string,
  markerDir: string,
  selectedPath: string,
  subject: string,
  head: string,
  selectedCommit: string,
): Promise<void> {
  const markerDirRelative = relative(root, markerDir).split(sep).join("/");
  const trackedPaths = (await git(root, ["ls-tree", "-r", "--name-only", "-z", head, "--", markerDirRelative]))
    .split("\0").filter(Boolean);
  const entries = await readdir(markerDir, { withFileTypes: true });
  const workingPaths = entries.filter((entry) => entry.isFile() && !entry.isSymbolicLink() && entry.name.toLowerCase().endsWith(".md"))
    .map((entry) => `${markerDirRelative}/${entry.name}`);
  const allCandidatePaths = new Set([...trackedPaths, ...workingPaths]);
  for (const candidatePath of allCandidatePaths) {
    if (candidatePath === selectedPath) continue;
    const committedText = trackedPaths.includes(candidatePath) ? await gitFile(root, head, candidatePath) : undefined;
    const candidateAbsolute = safeRepoPath(root, candidatePath, "Ticket checkpoint marker");
    const candidateInfo = await lstat(candidateAbsolute).catch(() => undefined);
    const workingText = candidateInfo?.isFile() && !candidateInfo.isSymbolicLink()
      ? await readFile(candidateAbsolute, "utf8")
      : undefined;
    const candidateText = committedText ?? workingText;
    if (!candidateText || fieldLast(candidateText, "TICKET_ID") !== subject) continue;
    if (!committedText || !workingText) {
      throw new OrchestrationStop("AMBIGUOUS_STATE", "Another ticket checkpoint marker is uncommitted or differs from the current Git tree.", {
        candidatePath,
        head,
      });
    }
    await assertWorkingTreeMatches(root, head, candidatePath, "Ticket checkpoint marker");
    const candidateKind = fieldLast(candidateText, "CHECKPOINT_KIND") ?? "";
    if (!CHECKPOINT_KINDS.has(candidateKind)) {
      throw new OrchestrationStop("AMBIGUOUS_STATE", "Another marker for this ticket declares an unsupported checkpoint kind.", {
        candidatePath,
        candidateKind,
      });
    }
    const candidateCommit = (await git(root, ["log", "-1", "--format=%H", head, "--", candidatePath])).trim();
    if (!/^[0-9a-f]{40}$/.test(candidateCommit)) {
      throw new OrchestrationStop("AMBIGUOUS_STATE", "Another ticket checkpoint marker has no committed history position.", {
        candidatePath,
        head,
      });
    }
    if (candidateCommit !== selectedCommit && await isAncestor(root, candidateCommit, selectedCommit)) {
      continue;
    }
    if (candidateCommit === selectedCommit) {
      throw new OrchestrationStop("AMBIGUOUS_STATE", "Multiple checkpoint markers for one ticket were introduced by the same commit.", {
        selectedPath,
        selectedCommit,
        candidatePath,
      });
    }
    if (await isAncestor(root, selectedCommit, candidateCommit)) {
      throw new OrchestrationStop("CANONICAL_ARTIFACT_CONTRADICTION", "The cited legacy checkpoint is superseded by a later checkpoint for this ticket.", {
        selectedPath,
        selectedCommit,
        newerPath: candidatePath,
        newerCommit: candidateCommit,
      });
    }
    throw new OrchestrationStop("AMBIGUOUS_STATE", "Ticket checkpoint history has incomparable candidate leaves.", {
      selectedPath,
      selectedCommit,
      candidatePath,
      candidateCommit,
    });
  }
}

export async function captureLegacyCheckpointProof(root: string, markerPath: string, subject: string): Promise<LegacyCheckpointProof> {
  const head = (await git(root, ["rev-parse", "--verify", "HEAD"])).trim();
  if (!/^[0-9a-f]{40}$/.test(head)) {
    throw new OrchestrationStop("INCOMPLETE_CANONICAL_RESULT", "Current Git HEAD is not a valid commit identity.");
  }
  return verifyCheckpoint(root, markerPath, subject, head, { requireCurrent: true });
}

export async function readLegacyCheckpointMarker(root: string, proof: LegacyCheckpointProof): Promise<string> {
  if (!isLegacyCheckpointProof(proof)) {
    throw new OrchestrationStop("INCOMPLETE_CANONICAL_RESULT", "Cannot read a legacy marker without a validated checkpoint proof.");
  }
  const markerText = await gitFile(root, proof.targetHead, proof.markerPath);
  if (sha256(markerText) !== proof.markerSha256) {
    throw new OrchestrationStop("CANONICAL_ARTIFACT_CONTRADICTION", "Pinned legacy checkpoint marker no longer matches its validated digest.", {
      markerPath: proof.markerPath,
      targetHead: proof.targetHead,
    });
  }
  return markerText;
}

export async function assertLegacyCheckpointProofCurrent(root: string, proof: LegacyCheckpointProof): Promise<void> {
  if (!isLegacyCheckpointProof(proof)) {
    throw new OrchestrationStop("INCOMPLETE_CANONICAL_RESULT", "Persisted legacy checkpoint migration basis is malformed.");
  }
  const head = (await git(root, ["rev-parse", "--verify", "HEAD"])).trim();
  if (!(await isAncestor(root, proof.targetHead, head))) {
    throw new OrchestrationStop("CANONICAL_ARTIFACT_CONTRADICTION", "The Git state captured by legacy checkpoint migration is not an ancestor of the current HEAD.", {
      migrationTargetHead: proof.targetHead,
      currentHead: head,
    });
  }
  await verifyCheckpoint(root, proof.markerPath, proof.subject, proof.targetHead, {
    requireCurrent: false,
    expected: proof,
  });
}

export async function validateLegacyMigrationArtifact(
  root: string,
  receipt: { operation: string; subject: string; artifactPaths: string[]; gateArtifactPath: string; gateValue: string },
  proof: LegacyCheckpointProof,
): Promise<void> {
  const expectedPath = legacyMigrationReportPath(proof.subject, proof.checkpointCommit);
  if (receipt.operation !== "reconcile-legacy-checkpoint-lineage" || receipt.subject !== proof.subject
    || receipt.gateValue !== "LEGACY_CHECKPOINT_VALIDATED" || receipt.gateArtifactPath !== expectedPath
    || !receipt.artifactPaths.includes(expectedPath)) {
    throw new OrchestrationStop("INCOMPLETE_CANONICAL_RESULT", "Legacy migration receipt does not identify the deterministic proof artifact and gate.", {
      expectedPath,
      receipt,
    });
  }
  const absolute = safeRepoPath(root, expectedPath, "Legacy migration report");
  const info = await lstat(absolute).catch(() => undefined);
  if (!info?.isFile() || info.isSymbolicLink()) {
    throw new OrchestrationStop("INCOMPLETE_CANONICAL_RESULT", "Legacy migration report is missing or is not a regular file.", { expectedPath });
  }
  const text = await currentRepoFile(root, expectedPath, "Legacy migration report");
  const required: Record<string, string> = {
    MIGRATION_KIND: "LEGACY_CHECKPOINT_LINEAGE_RECONCILIATION",
    TICKET_ID: proof.subject,
    SOURCE_CHECKPOINT_MARKER: proof.markerPath,
    SOURCE_CHECKPOINT_KIND: proof.checkpointKind,
    SOURCE_CHECKPOINT_COMMIT: proof.checkpointCommit,
    SOURCE_CHECKPOINT_PARENT_HEAD: proof.parentHead,
    SOURCE_CHECKPOINT_MARKER_SHA256: proof.markerSha256,
    SOURCE_PHASE_MANIFEST: proof.manifestPath,
    SOURCE_PHASE_MANIFEST_SHA256: proof.manifestSha256,
    SOURCE_CHECKPOINT_TARGET_HEAD: proof.targetHead,
    SOURCE_CHECKPOINT_PRESERVED_PATH_DRIFT: JSON.stringify(proof.preservedPathDrift),
    SOURCE_CHECKPOINT_COMMIT_MESSAGE: proof.commitMessage,
    CURRENT_TICKET_GENERATION_MARKER: proof.ticketRevision.generationMarkerPath,
    CURRENT_TICKET_GENERATION_MANIFEST: proof.ticketRevision.generationManifestPath,
    CURRENT_TICKET_GENERATION_COMMIT: proof.ticketRevision.generationCommit,
    CURRENT_TICKET_SET_CONFORMANCE_MARKER: proof.ticketRevision.conformanceMarkerPath,
    CURRENT_TICKET_SET_CONFORMANCE_MANIFEST: proof.ticketRevision.conformanceManifestPath,
    CURRENT_TICKET_SET_CONFORMANCE_COMMIT: proof.ticketRevision.conformanceCommit,
    CURRENT_TICKET_PATH: proof.ticketRevision.ticketPath,
    CURRENT_TICKET_SHA256: proof.ticketRevision.ticketSha256,
    NEXT_AUTHORIZED_OPERATION: proof.nextOperation,
    MIGRATION_VALIDATION: "PASS",
    MIGRATION_REBASE_REQUIRED: "YES",
    MIGRATION_GATE: "LEGACY_CHECKPOINT_VALIDATED",
  };
  const mismatches = Object.entries(required).flatMap(([field, expected]) => {
    const values = fieldValues(text, field);
    return values.length === 1 && values[0] === expected ? [] : [{ field, expected, actual: values }];
  });
  if (mismatches.length > 0) {
    throw new OrchestrationStop("CANONICAL_ARTIFACT_CONTRADICTION", "Legacy migration report does not exactly reproduce the extension-validated checkpoint proof.", {
      expectedPath,
      mismatches,
    });
  }
}
