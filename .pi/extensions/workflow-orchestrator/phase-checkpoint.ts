import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { access, lstat, open, readFile, readdir, readlink, realpath, rename, unlink, writeFile } from "node:fs/promises";
import { relative, resolve, sep } from "node:path";
import { promisify } from "node:util";

import { fieldLast } from "./artifacts.ts";
import { OrchestrationStop } from "./contracts.ts";
import type { WorkflowResultBasis, WorkflowResultContext, WorkflowResultRecord } from "./workflow-lineage.ts";
import { normalizeTicketSetAuditWorkflowResultEnding, parseWorkflowResultRecords, workflowResultBlock } from "./workflow-lineage.ts";
import type { OperationReceipt, TransitionCatalog } from "./workflow-routing.ts";

const execFileAsync = promisify(execFile);

const TICKET_SET_CHECKPOINTS = {
  "checkpoint-component-implementation-tickets-audit": {
    sourceOperation: "audit-component-implementation-tickets",
    sourceGateField: "VERDICT",
    sourceGateValue: "IMPLEMENTATION_TICKETS_REMEDIATION_REQUIRED",
    nextOperation: "remediate-component-implementation-tickets",
    kind: "COMPONENT_IMPLEMENTATION_TICKETS_AUDIT_CHECKPOINT",
    title: "Component Implementation Tickets Audit Checkpoint",
  },
  "checkpoint-component-implementation-tickets-remediation": {
    sourceOperation: "remediate-component-implementation-tickets",
    sourceGateField: "GATE",
    sourceGateValue: "READY_FOR_INDEPENDENT_TICKET_REAUDIT",
    nextOperation: "audit-component-implementation-tickets",
    kind: "COMPONENT_IMPLEMENTATION_TICKETS_REMEDIATION_CHECKPOINT",
    title: "Component Implementation Tickets Remediation Checkpoint",
  },
} as const;

type TicketSetCheckpointOperation = keyof typeof TICKET_SET_CHECKPOINTS;

export function isDeterministicTicketSetCheckpoint(operation: string): operation is TicketSetCheckpointOperation {
  return operation in TICKET_SET_CHECKPOINTS;
}

export interface CheckpointProgressEvent {
  event: string;
  fields: Record<string, unknown>;
}

export interface TicketSetCheckpointInput {
  root: string;
  executionId: string;
  step: number;
  operation: TicketSetCheckpointOperation;
  subject: string;
  parentHead: string;
  operationInputJson: string;
  evidenceFiles: string[];
  workflowResult: WorkflowResultContext;
  catalog: TransitionCatalog;
  onEvent?(event: CheckpointProgressEvent): Promise<void> | void;
}

export interface TicketSetCheckpointResult {
  receipt: OperationReceipt;
  commitHead: string;
  validationDurationsMs: Record<string, number>;
}

interface WorktreeIdentity {
  root: string;
  gitDir: string;
  branch: string;
  head: string;
}

interface IndexSnapshot {
  path: string;
  bytes: Buffer;
  mode: number;
}

interface SourceChainEntry {
  record: WorkflowResultRecord;
  text: string;
  sha256: string;
}

interface CheckpointManifest {
  schemaVersion: 1;
  manifestKind: "PHASE_CHECKPOINT";
  phaseId: string;
  operation: TicketSetCheckpointOperation;
  subject: { id: string; type: "component" };
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

function fail(message: string, details: Record<string, unknown> = {}): never {
  throw new OrchestrationStop("INCOMPLETE_CANONICAL_RESULT", message, details);
}

function sortedUnique(paths: string[]): string[] {
  return [...new Set(paths)].sort((left, right) => left < right ? -1 : left > right ? 1 : 0);
}

function normalizeRepoPath(root: string, candidate: string): string {
  const absolute = resolve(root, candidate);
  const relativePath = relative(root, absolute).split(sep).join("/");
  if (!relativePath || relativePath === ".." || relativePath.startsWith("../") || relativePath.startsWith("/")) {
    throw new OrchestrationStop("INVALID_PATH", "Checkpoint path must remain repository-relative.", { candidate });
  }
  if (relativePath !== candidate || candidate.includes("\0") || candidate.includes("\n") || candidate.includes("\r")) {
    throw new OrchestrationStop("INVALID_PATH", "Checkpoint path is not normalized.", { candidate, normalized: relativePath });
  }
  return relativePath;
}

async function git(root: string, args: string[]): Promise<string> {
  try {
    const { stdout } = await execFileAsync("git", args, {
      cwd: root,
      encoding: "utf8",
      maxBuffer: 16 * 1024 * 1024,
      env: { ...process.env, GIT_TERMINAL_PROMPT: "0" },
    });
    return stdout.trim();
  } catch (error) {
    throw new OrchestrationStop("PROCESS_AUTHORITY_DRIFT", "Deterministic checkpoint Git command failed.", {
      command: "git",
      args,
      cause: String(error),
    });
  }
}

async function gitPaths(root: string, args: string[]): Promise<string[]> {
  try {
    const { stdout } = await execFileAsync("git", args, {
      cwd: root,
      encoding: "utf8",
      maxBuffer: 16 * 1024 * 1024,
    });
    return stdout.split("\0").filter(Boolean).map((item) => item.replaceAll("\\", "/"));
  } catch (error) {
    throw new OrchestrationStop("PROCESS_AUTHORITY_DRIFT", "Deterministic checkpoint Git path inventory failed.", {
      args,
      cause: String(error),
    });
  }
}

async function captureIndexSnapshot(root: string): Promise<IndexSnapshot> {
  const reportedPath = await git(root, ["rev-parse", "--git-path", "index"]);
  const path = resolve(root, reportedPath);
  try {
    const stat = await lstat(path);
    if (!stat.isFile() || stat.isSymbolicLink()) {
      fail("Checkpoint requires a regular active-worktree Git index.", { path });
    }
    return { path, bytes: await readFile(path), mode: stat.mode & 0o777 };
  } catch (error) {
    if (error instanceof OrchestrationStop) throw error;
    throw new OrchestrationStop("PROCESS_AUTHORITY_DRIFT", "Could not snapshot the active-worktree Git index.", {
      path,
      cause: String(error),
    });
  }
}

async function restoreIndexSnapshot(
  snapshot: IndexSnapshot,
  checkpointIndex?: Buffer,
  checkpointTree?: string,
  observedFailureIndex?: Buffer,
  observedFailureTree?: string,
): Promise<void> {
  const lockPath = `${snapshot.path}.lock`;
  let handle: Awaited<ReturnType<typeof open>> | undefined;
  let lockPathCreated = false;
  try {
    handle = await open(lockPath, "wx", snapshot.mode);
    lockPathCreated = true;
    const current = await readFile(snapshot.path);
    if (current.equals(snapshot.bytes)) {
      await handle.close();
      handle = undefined;
      await unlink(lockPath);
      lockPathCreated = false;
      return;
    }
    const isKnownCheckpointIndex = !!checkpointIndex && current.equals(checkpointIndex);
    const isKnownCommitRefresh = !!observedFailureIndex && current.equals(observedFailureIndex)
      && !!checkpointTree && observedFailureTree === checkpointTree;
    if (!isKnownCheckpointIndex && !isKnownCommitRefresh) {
      throw new OrchestrationStop("PROCESS_AUTHORITY_DRIFT", "Git index changed outside the checkpoint's known staged state; rollback left it untouched.", {
        indexPath: snapshot.path,
        expectedTree: checkpointTree,
        observedFailureTree,
      });
    }
    await handle.writeFile(snapshot.bytes);
    await handle.chmod(snapshot.mode);
    await handle.sync();
    await handle.close();
    handle = undefined;
    await rename(lockPath, snapshot.path);
    lockPathCreated = false;
  } catch (error) {
    if (handle) await handle.close().catch(() => undefined);
    if (lockPathCreated) await unlink(lockPath).catch(() => undefined);
    if (error instanceof OrchestrationStop) throw error;
    throw new OrchestrationStop("PROCESS_AUTHORITY_DRIFT", "Could not restore the checkpoint's original Git index after failure.", {
      indexPath: snapshot.path,
      cause: String(error),
    });
  }
}

async function writeExclusiveFile(path: string, content: string, onCreated: () => void): Promise<void> {
  const handle = await open(path, "wx");
  onCreated();
  try {
    await handle.writeFile(content, "utf8");
    await handle.sync();
  } finally {
    await handle.close();
  }
}

async function removeOwnedFile(root: string, path: string, owned: boolean, expected: Buffer[]): Promise<void> {
  if (!owned) return;
  const absolute = resolve(root, path);
  let current: Buffer;
  try {
    const stat = await lstat(absolute);
    if (!stat.isFile() || stat.isSymbolicLink()) {
      throw new OrchestrationStop("PROCESS_AUTHORITY_DRIFT", "Checkpoint artifact was replaced by a non-regular file before rollback; the replacement was preserved.", { path });
    }
    current = await readFile(absolute);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return;
    throw new OrchestrationStop("PROCESS_AUTHORITY_DRIFT", "Could not inspect a checkpoint artifact during rollback.", {
      path,
      cause: String(error),
    });
  }
  if (!expected.some((candidate) => current.equals(candidate))) {
    throw new OrchestrationStop("PROCESS_AUTHORITY_DRIFT", "Checkpoint artifact changed after this operation created it; rollback preserved the changed file.", { path });
  }
  await unlink(absolute);
}

async function currentDirtyPathSet(root: string): Promise<Set<string>> {
  const [tracked, untracked] = await Promise.all([
    gitPaths(root, ["diff", "--name-only", "--no-renames", "-z", "HEAD", "--"]),
    gitPaths(root, ["ls-files", "--others", "--exclude-standard", "-z"]),
  ]);
  return new Set([...tracked, ...untracked]);
}

async function captureWorktreeIdentity(root: string): Promise<WorktreeIdentity> {
  const [gitRoot, gitDir, branch, head] = await Promise.all([
    git(root, ["rev-parse", "--show-toplevel"]),
    git(root, ["rev-parse", "--absolute-git-dir"]),
    git(root, ["rev-parse", "--symbolic-full-name", "HEAD"]),
    git(root, ["rev-parse", "--verify", "HEAD"]),
  ]);
  return {
    root: await realpath(gitRoot),
    gitDir: await realpath(gitDir),
    branch,
    head,
  };
}

async function assertWorktreeIdentity(root: string, expected: WorktreeIdentity, parentHead: string): Promise<void> {
  const actual = await captureWorktreeIdentity(root);
  if (actual.root !== expected.root || actual.gitDir !== expected.gitDir || actual.branch !== expected.branch || actual.head !== parentHead) {
    throw new OrchestrationStop("TARGET_HEAD_DRIFT", "Active worktree identity changed during deterministic checkpoint execution.", {
      expected,
      actual,
      parentHead,
    });
  }
}

async function readRegularRepoFile(root: string, candidate: string): Promise<Buffer> {
  const repoPath = normalizeRepoPath(root, candidate);
  const absolute = resolve(root, repoPath);
  try {
    const stat = await lstat(absolute);
    if (!stat.isFile() || stat.isSymbolicLink()) fail("Checkpoint evidence must be a regular non-symlink file.", { path: repoPath });
    const canonical = await realpath(absolute);
    const rel = relative(await realpath(root), canonical);
    if (!rel || rel === ".." || rel.startsWith(`..${sep}`) || rel.startsWith(sep)) {
      throw new OrchestrationStop("INVALID_PATH", "Checkpoint evidence resolves outside the active repository.", { path: repoPath });
    }
    return await readFile(absolute);
  } catch (error) {
    if (error instanceof OrchestrationStop) throw error;
    throw new OrchestrationStop("INCOMPLETE_CANONICAL_RESULT", "Checkpoint evidence is missing or unreadable.", {
      path: repoPath,
      cause: String(error),
    });
  }
}

function recordByIdentity(text: string, path: string, operation: string, subject: string, resultId: string): WorkflowResultRecord {
  const records = parseWorkflowResultRecords(text, path, { operation, subject });
  const matches = records.filter((record) => record.resultId === resultId);
  if (matches.length !== 1) {
    fail("Checkpoint source result identity is absent or ambiguous in its canonical artifact.", {
      path,
      operation,
      subject,
      resultId,
      matches: matches.length,
    });
  }
  return matches[0];
}

async function collectSourceChain(root: string, basis: WorkflowResultBasis, operation: TicketSetCheckpointOperation, subject: string): Promise<SourceChainEntry[]> {
  const policy = TICKET_SET_CHECKPOINTS[operation];
  if (basis.type !== "transition" || basis.source.operation !== policy.sourceOperation
    || basis.source.subject !== subject || basis.source.gateField !== policy.sourceGateField
    || basis.source.gateValue !== policy.sourceGateValue) {
    fail("Ticket-set checkpoint does not have the exact canonical source transition.", {
      operation,
      sourceBasis: basis,
    });
  }

  const chain: SourceChainEntry[] = [];
  const visited = new Set<string>();
  let current: { path: string; operation: string; subject: string; resultId: string } = {
    path: normalizeRepoPath(root, basis.source.artifactPath),
    operation: basis.source.operation,
    subject: basis.source.subject,
    resultId: basis.source.resultId,
  };
  for (let depth = 0; depth < 12; depth += 1) {
    const key = `${current.path}\0${current.resultId}`;
    if (visited.has(key)) fail("Checkpoint source lineage contains a cycle.", { current });
    visited.add(key);
    const bytes = await readRegularRepoFile(root, current.path);
    const text = bytes.toString("utf8");
    const record = recordByIdentity(text, current.path, current.operation, current.subject, current.resultId);
    chain.push({ record, text, sha256: createHash("sha256").update(bytes).digest("hex") });
    if (record.basis.type !== "transition") return chain;
    current = {
      path: normalizeRepoPath(root, record.basis.source.artifactPath),
      operation: record.basis.source.operation,
      subject: record.basis.source.subject,
      resultId: record.basis.source.resultId,
    };
  }
  fail("Checkpoint source lineage exceeded its bounded depth.", { operation, subject, maxDepth: 12 });
}

function requiredField(text: string, key: string, allowed?: readonly string[]): string {
  const value = fieldLast(text, key);
  if (!value || (allowed && !allowed.includes(value))) {
    fail("Checkpoint source artifact is missing a required canonical field or has a disallowed value.", { key, allowed, actual: value });
  }
  return value;
}

function parseMultilinePathField(text: string, key: string): string[] {
  const matches = [...text.matchAll(new RegExp(`^\\s*${key}\\s*=\\s*\\r?\\n`, "gm"))];
  const latest = matches.at(-1);
  if (!latest || latest.index === undefined) fail("Remediation report has no latest structured FILES_CHANGED block.", { key });
  const start = latest.index + latest[0].length;
  const output: string[] = [];
  for (const line of text.slice(start).split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("```")) break;
    output.push(trimmed);
  }
  if (output.length === 0) fail("Remediation FILES_CHANGED block is empty.", { key });
  return output;
}

async function primaryTicketPaths(root: string, ticketFolder: string, ticketIndex: string, expectedCount: number): Promise<string[]> {
  const folder = normalizeRepoPath(root, ticketFolder.replace(/\/$/, ""));
  const indexPath = normalizeRepoPath(root, ticketIndex);
  const readme = (await readRegularRepoFile(root, indexPath)).toString("utf8");
  const ids = [...readme.matchAll(/^\|\s*([A-Z0-9][A-Z0-9-]*-TICKET-\d{3})\s*\|/gm)].map((match) => match[1]);
  if (ids.length !== expectedCount || new Set(ids).size !== ids.length) {
    fail("Ticket index identity/count does not match the remediation report.", { ticketIndex, expectedCount, ids });
  }
  const entries = await readdir(resolve(root, folder), { withFileTypes: true });
  const result: string[] = [];
  for (const id of ids) {
    const matches: string[] = [];
    for (const entry of entries) {
      if (!entry.isFile() || entry.isSymbolicLink() || !entry.name.startsWith(`${id}-`) || !entry.name.endsWith(".md")) continue;
      const candidate = `${folder}/${entry.name}`;
      const text = (await readRegularRepoFile(root, candidate)).toString("utf8");
      const statusHeading = text.match(/^## 1\. Status[ \t]*$/m);
      const statusStart = statusHeading?.index === undefined ? -1 : statusHeading.index + statusHeading[0].length;
      const nextSection = statusStart < 0 ? -1 : text.indexOf("\n## ", statusStart);
      const firstSection = statusStart < 0 ? "" : text.slice(statusStart, nextSection < 0 ? undefined : nextSection);
      if (new RegExp(`^#\\s+${id}\\s+`, "m").test(text)
        && /^STATUS\s*:/m.test(firstSection)
        && /^BLOCKED_BY\s*:/m.test(firstSection)) {
        matches.push(candidate);
      }
    }
    if (matches.length !== 1) fail("Ticket index identity does not resolve to exactly one primary ticket artifact.", { id, matches });
    result.push(matches[0]);
  }
  return sortedUnique(result);
}

async function validateAuditCheckpointSource(
  root: string,
  chain: SourceChainEntry[],
  dirty: Set<string>,
  subject: string,
): Promise<{ candidatePaths: string[]; semanticFingerprint: string; summary: Record<string, string> }> {
  const audit = chain.find((entry) => entry.record.operation === "audit-component-implementation-tickets");
  if (!audit || audit.record.subject !== subject || audit.record.gateField !== "VERDICT"
    || audit.record.gateValue !== "IMPLEMENTATION_TICKETS_REMEDIATION_REQUIRED") {
    fail("Audit checkpoint source chain does not contain the matching actionable ticket-set audit result.", { subject });
  }
  const findingIds = requiredField(audit.text, "FINDING_IDS");
  const findingIdList = findingIds === "NONE" ? [] : findingIds.split(/\s*,\s*/).filter(Boolean);
  if (findingIdList.length === 0 || new Set(findingIdList).size !== findingIdList.length) {
    fail("Actionable ticket-set audit result must declare unique canonical finding IDs.", { subject, findingIds });
  }
  const driftStatus = requiredField(audit.text, "BASELINE_DRIFT_STATUS", ["NO_DRIFT", "NO_RELEVANT_DRIFT", "DRIFT_ASSESSED"]);
  const reassessmentComplete = requiredField(audit.text, "REASSESSMENT_COMPLETE", ["YES", "NO"]);
  const reassessmentProof = fieldLast(audit.text, "BASELINE_REASSESSMENT_PROOF") ?? "NONE";
  if (driftStatus === "DRIFT_ASSESSED" && (reassessmentComplete !== "YES" || !reassessmentProof.trim() || reassessmentProof === "NONE")) {
    fail("Assessed baseline drift requires complete persisted reassessment and its proof reference.", {
      subject,
      driftStatus,
      reassessmentComplete,
      reassessmentProof,
    });
  }
  const summary = {
    AUDIT_VERDICT: requiredField(audit.text, "VERDICT", ["IMPLEMENTATION_TICKETS_REMEDIATION_REQUIRED"]),
    TICKET_DECOMPOSITION_GATE: requiredField(audit.text, "TICKET_DECOMPOSITION_GATE", ["READY_FOR_TICKET_AUDIT", "READY_FOR_INDEPENDENT_TICKET_REAUDIT"]),
    BASELINE_DRIFT_STATUS: driftStatus,
    REASSESSMENT_COMPLETE: reassessmentComplete,
    BASELINE_REASSESSMENT_PROOF: reassessmentProof,
    FINDINGS_ARE_ACTIONABLE: requiredField(audit.text, "FINDINGS_ARE_ACTIONABLE", ["YES"]),
    BASELINE_REMEDIATION_READINESS: requiredField(audit.text, "BASELINE_REMEDIATION_READINESS", ["READY"]),
    FINDING_IDS: findingIds,
  };
  const semanticFingerprint = requiredField(audit.text, "AUDIT_BASIS_FINGERPRINT");
  const candidatePaths = sortedUnique(chain.map((entry) => entry.record.artifactPath).filter((path) => dirty.has(path)));
  if (!chain.some((entry) => entry.record.artifactPath === audit.record.artifactPath)) {
    fail("Audit result is not bound to the checkpoint source chain.");
  }
  return { candidatePaths, semanticFingerprint, summary };
}

async function validateRemediationCheckpointSource(
  root: string,
  chain: SourceChainEntry[],
  dirty: Set<string>,
  subject: string,
): Promise<{ candidatePaths: string[]; semanticFingerprint: string; summary: Record<string, string> }> {
  const remediation = chain.find((entry) => entry.record.operation === "remediate-component-implementation-tickets");
  const audit = chain.find((entry) => entry.record.operation === "audit-component-implementation-tickets");
  if (!remediation || !audit || remediation.record.subject !== subject || audit.record.subject !== subject
    || remediation.record.gateField !== "GATE" || remediation.record.gateValue !== "READY_FOR_INDEPENDENT_TICKET_REAUDIT"
    || audit.record.gateField !== "VERDICT" || audit.record.gateValue !== "IMPLEMENTATION_TICKETS_REMEDIATION_REQUIRED") {
    fail("Remediation checkpoint source chain does not bind the current audit and ready-for-reaudit remediation.", { subject });
  }

  const sourceAuditPath = normalizeRepoPath(root, requiredField(remediation.text, "SOURCE_AUDIT"));
  const sourceAuditResultId = requiredField(remediation.text, "SOURCE_AUDIT_RESULT_ID");
  const expectedAuditDigest = requiredField(remediation.text, "SOURCE_AUDIT_SHA256");
  if (sourceAuditPath !== audit.record.artifactPath || sourceAuditResultId !== audit.record.resultId || expectedAuditDigest !== audit.sha256) {
    fail("Remediation source-audit path or digest does not match its persisted audit lineage.", {
      sourceAuditPath,
      sourceAuditResultId,
      expectedAuditDigest,
      actualAuditPath: audit.record.artifactPath,
      actualAuditResultId: audit.record.resultId,
      actualAuditDigest: audit.sha256,
    });
  }

  const findingIds = requiredField(audit.text, "FINDING_IDS");
  const findings = findingIds === "NONE" ? [] : findingIds.split(/\s*,\s*/).filter(Boolean);
  const received = Number(requiredField(remediation.text, "FINDINGS_RECEIVED"));
  const remediated = Number(requiredField(remediation.text, "FINDINGS_REMEDIATED"));
  if (findings.length === 0 || received !== findings.length || remediated !== findings.length) {
    fail("Remediation finding cardinality does not match the current audit finding set.", {
      findings,
      received,
      remediated,
    });
  }

  const ticketFolder = requiredField(remediation.text, "TICKET_FOLDER");
  const ticketIndex = requiredField(remediation.text, "TICKET_INDEX");
  const ticketCount = Number(requiredField(remediation.text, "TICKETS_AFTER"));
  const ticketPaths = await primaryTicketPaths(root, ticketFolder, ticketIndex, ticketCount);
  const candidateFingerprint = requiredField(remediation.text, "REMEDIATION_CANDIDATE_FINGERPRINT");
  const expectedFingerprint = candidateFingerprint.match(/\bSHA256\s+([0-9a-f]{64})\s+over sorted/)?.[1];
  if (!expectedFingerprint) fail("Remediation candidate fingerprint is not in the supported canonical format.", { candidateFingerprint });
  const fingerprintPaths = sortedUnique([...ticketPaths, ticketIndex]);
  const fingerprintRows: string[] = [];
  for (const path of fingerprintPaths) {
    const digest = createHash("sha256").update(await readRegularRepoFile(root, path)).digest("hex");
    fingerprintRows.push(`${path}\t${digest}\n`);
  }
  const actualFingerprint = createHash("sha256").update(fingerprintRows.join("")).digest("hex");
  if (actualFingerprint !== expectedFingerprint) {
    fail("Current ticket set or index differs from the remediator's candidate fingerprint.", {
      expectedFingerprint,
      actualFingerprint,
      fingerprintPaths,
    });
  }

  const declaredFiles = parseMultilinePathField(remediation.text, "FILES_CHANGED").map((path) => normalizeRepoPath(root, path));
  if (new Set(declaredFiles).size !== declaredFiles.length) {
    fail("Remediation FILES_CHANGED contains duplicate repository paths.", { declaredFiles });
  }
  const ticketRoot = `${normalizeRepoPath(root, ticketFolder.replace(/\/$/, ""))}/`;
  for (const path of declaredFiles) {
    if (!ticketPaths.includes(path) && path !== ticketIndex && !path.startsWith(ticketRoot)) {
      fail("Remediation FILES_CHANGED crosses the ticket-set write boundary.", { path, ticketFolder });
    }
    const records = parseWorkflowResultRecords((await readRegularRepoFile(root, path)).toString("utf8"), path);
    const protectedResult = records.find((record) => [
      "audit-implemented-ticket",
      "remediate-implemented-ticket",
      "finalize-implemented-ticket",
      "checkpoint-implemented-ticket",
      "reconcile-legacy-checkpoint-lineage",
    ].includes(record.operation));
    if (protectedResult) {
      fail("Ticket-set remediation cannot modify an implemented-ticket workflow result or checkpoint marker.", {
        path,
        operation: protectedResult.operation,
        subject: protectedResult.subject,
        resultId: protectedResult.resultId,
      });
    }
  }
  const declaredTicketPaths = declaredFiles.filter((path) => ticketPaths.includes(path));
  if (declaredTicketPaths.length === 0) fail("Remediation FILES_CHANGED must include at least one primary ticket artifact.", { declaredFiles });

  const summary = {
    SOURCE_AUDIT: sourceAuditPath,
    SOURCE_AUDIT_RESULT_ID: audit.record.resultId,
    SOURCE_AUDIT_SHA256: audit.sha256,
    AUDIT_VERDICT: requiredField(audit.text, "VERDICT", ["IMPLEMENTATION_TICKETS_REMEDIATION_REQUIRED"]),
    FINDING_IDS: findings.join(", "),
    REMEDIATION_VERDICT: requiredField(remediation.text, "REMEDIATION_VERDICT", ["COMPONENT_IMPLEMENTATION_TICKET_REMEDIATION_COMPLETE"]),
    REMEDIATION_GATE: requiredField(remediation.text, "GATE", ["READY_FOR_INDEPENDENT_TICKET_REAUDIT"]),
    FINDINGS_REMEDIATED: `${remediated}/${findings.length}`,
    REMEDIATION_CANDIDATE_FINGERPRINT: actualFingerprint,
    INITIAL_DAG_STATE_PRESERVED: requiredField(remediation.text, "INITIAL_DAG_STATE_PRESERVED", ["YES"]),
    DEPENDENCY_GRAPH_CYCLE: requiredField(remediation.text, "DEPENDENCY_GRAPH_CYCLE", ["NO"]),
    BLOCKER_GRAPH_CYCLE: requiredField(remediation.text, "BLOCKER_GRAPH_CYCLE", ["NO"]),
    DOWNSTREAM_TICKET_STATE_MUTATIONS: requiredField(remediation.text, "DOWNSTREAM_TICKET_STATE_MUTATIONS", ["0"]),
    PRODUCTION_FILES_CHANGED: "0",
    TEST_FILES_CHANGED: "0",
  };
  const semanticFingerprint = fieldLast(remediation.text, "LIVE_SEMANTIC_FINGERPRINT")
    ?? actualFingerprint;
  const candidatePaths = sortedUnique([...declaredFiles, remediation.record.artifactPath]);
  const missing = candidatePaths.filter((path) => !dirty.has(path));
  if (missing.length > 0) fail("Remediation report declares candidate files that are not dirty at checkpoint intake.", { missing });
  return { candidatePaths, semanticFingerprint, summary };
}

function markerContent(
  input: TicketSetCheckpointInput,
  manifest: CheckpointManifest,
  summary: Record<string, string>,
  sourceChain: SourceChainEntry[],
  complete: boolean,
): string {
  const policy = TICKET_SET_CHECKPOINTS[input.operation];
  const sourceAudit = sourceChain.find((entry) => entry.record.operation === "audit-component-implementation-tickets");
  const sourceLineage = sourceChain.find((entry) => entry.record.operation === "reconcile-legacy-ticket-set-audit-lineage");
  const lines = [
    `# ${policy.title} — ${input.subject}`,
    "",
    "```text",
    `CHECKPOINT_KIND = ${policy.kind}`,
    `PARENT_HEAD = ${manifest.target.head}`,
    `COMPONENT = ${input.subject}`,
    ...(sourceAudit ? [
      `SOURCE_AUDIT = ${sourceAudit.record.artifactPath}`,
      `SOURCE_AUDIT_RESULT_ID = ${sourceAudit.record.resultId}`,
      `SOURCE_AUDIT_SHA256 = ${sourceAudit.sha256}`,
      `AUDIT_VERDICT = ${summary.AUDIT_VERDICT ?? fieldLast(sourceAudit.text, "VERDICT") ?? sourceAudit.record.gateValue}`,
      `FINDING_IDS = ${summary.FINDING_IDS ?? fieldLast(sourceAudit.text, "FINDING_IDS") ?? "NONE"}`,
    ] : []),
    ...(sourceLineage ? [
      `SOURCE_LINEAGE = ${sourceLineage.record.artifactPath}`,
      `SOURCE_LINEAGE_RESULT_ID = ${sourceLineage.record.resultId}`,
      `SOURCE_LINEAGE_SHA256 = ${sourceLineage.sha256}`,
    ] : []),
    ...Object.entries(summary).map(([key, value]) => `${key} = ${value}`),
    `SOURCE_AUTHORITY_PATHS = ${manifest.sourceAuthority.map((source) => source.path).join(", ")}`,
    `SOURCE_AUTHORITY_SHA256 = ${manifest.sourceAuthority.map((source) => `${source.path}:${source.sha256}`).join("; ")}`,
    `PHASE_MANIFEST = ${manifest.paths.manifest}`,
    `PRESERVED_PATHS = ${manifest.paths.preserve.length + 2}`,
    `UNSTAGED_RECOVERY_PATHS = ${manifest.paths.unstagedRecovery.length}`,
    ...(complete ? [
      "CANONICAL_ARTIFACT_CONSISTENCY = PASS",
      "CACHED_WHITESPACE_VALIDATION = PASS: exact allowlist checked with the audit-only two-space hard-break exception",
      "CHECKS = PASS: verify:phase-manifest, verify:canonical-consistency, verify:audit-governance, git diff --cached --check",
    ] : [
      "CHECKPOINT_VALIDATION_STATUS = PENDING; this marker is not a workflow result until deterministic checks pass",
    ]),
    "VALIDATION_PROFILE = DOCUMENTATION_ONLY; typecheck and tests are not applicable because no production, test, or skill source path is eligible for this checkpoint",
    `CHECKPOINT_COMMIT_MESSAGE = ${manifest.commitMessage}`,
    `NEXT_AUTHORIZED_OPERATION = ${manifest.nextAuthorizedOperation}`,
    "```",
    ...(complete ? [
      "",
      workflowResultBlock(input.workflowResult, input.operation, input.subject, "NEXT_AUTHORIZED_OPERATION", manifest.nextAuthorizedOperation),
      "",
    ] : [""]),
  ];
  return lines.join("\n");
}

async function runValidation(
  input: TicketSetCheckpointInput,
  name: string,
  command: string,
  args: string[],
): Promise<number> {
  const started = Date.now();
  await input.onEvent?.({ event: "checkpoint_validation_started", fields: { step: input.step, operation: input.operation, validation: name } });
  try {
    await execFileAsync(command, args, {
      cwd: input.root,
      encoding: "utf8",
      maxBuffer: 16 * 1024 * 1024,
      env: { ...process.env, CI: "1", GIT_TERMINAL_PROMPT: "0" },
    });
    const durationMs = Date.now() - started;
    await input.onEvent?.({ event: "checkpoint_validation_completed", fields: { step: input.step, operation: input.operation, validation: name, status: "PASS", durationMs } });
    return durationMs;
  } catch (error) {
    const durationMs = Date.now() - started;
    await input.onEvent?.({ event: "checkpoint_validation_completed", fields: { step: input.step, operation: input.operation, validation: name, status: "FAIL", durationMs, error: String(error) } });
    throw new OrchestrationStop("INCOMPLETE_CANONICAL_RESULT", `Required deterministic checkpoint validation failed: ${name}.`, {
      operation: input.operation,
      validation: name,
      durationMs,
      cause: String(error),
    });
  }
}

async function cachedWhitespaceCheck(root: string, allowedAuditPath?: string): Promise<void> {
  let output = "";
  try {
    const result = await execFileAsync("git", ["diff", "--cached", "--check", "--"], {
      cwd: root,
      encoding: "utf8",
      maxBuffer: 8 * 1024 * 1024,
    });
    output = `${result.stdout}${result.stderr}`;
  } catch (error) {
    const details = error as { stdout?: string; stderr?: string };
    output = `${details.stdout ?? ""}${details.stderr ?? ""}`;
  }
  if (!output.trim()) return;
  const issues = output.split(/\r?\n/).filter((line) => line.trim() !== "");
  if (!allowedAuditPath) fail("Cached whitespace validation found a defect.", { output });
  const allowedIssue = /^(.+):(\d+): trailing whitespace\.$/;
  for (const issue of issues) {
    const match = issue.match(allowedIssue);
    if (!match || match[1].replaceAll("\\", "/") !== allowedAuditPath) {
      fail("Cached whitespace validation found a defect outside the audit hard-break exception.", { issue });
    }
    const lineNumber = Number(match[2]);
    const lines = (await readFile(resolve(root, allowedAuditPath), "utf8")).split(/\r?\n/);
    const content = lines[lineNumber - 1] ?? "";
    if (!content.endsWith("  ") || content.endsWith("   ")) {
      fail("Only intentional two-space Markdown hard breaks are permitted in the independent audit artifact.", {
        path: allowedAuditPath,
        line: lineNumber,
      });
    }
  }
}

async function candidateWhitespaceCheck(root: string, candidatePaths: string[], allowedAuditPath?: string): Promise<void> {
  let output = "";
  try {
    const result = await execFileAsync("git", ["diff", "--check", "HEAD", "--", ...candidatePaths], {
      cwd: root,
      encoding: "utf8",
      maxBuffer: 8 * 1024 * 1024,
    });
    output = `${result.stdout}${result.stderr}`;
  } catch (error) {
    const details = error as { stdout?: string; stderr?: string };
    output = `${details.stdout ?? ""}${details.stderr ?? ""}`;
  }
  const issues = output.split(/\r?\n/).filter((line) => line.trim() !== "");
  const allowedIssue = /^(.+):(\d+): trailing whitespace\.$/;
  for (const issue of issues) {
    const match = issue.match(allowedIssue);
    if (!allowedAuditPath || !match || match[1].replaceAll("\\", "/") !== allowedAuditPath) {
      fail("Candidate whitespace validation found a defect before checkpoint artifacts were created.", { issue });
    }
    const lineNumber = Number(match[2]);
    const lines = (await readFile(resolve(root, allowedAuditPath), "utf8")).split(/\r?\n/);
    const content = lines[lineNumber - 1] ?? "";
    if (!content.endsWith("  ") || content.endsWith("   ")) {
      fail("Only intentional two-space Markdown hard breaks are permitted in the independent audit artifact.", {
        path: allowedAuditPath,
        line: lineNumber,
      });
    }
  }

  const untracked = new Set(await gitPaths(root, ["ls-files", "--others", "--exclude-standard", "-z"]));
  for (const path of candidatePaths.filter((candidate) => untracked.has(candidate))) {
    const text = (await readRegularRepoFile(root, path)).toString("utf8");
    if (/\r?\n\r?\n$/.test(text)) {
      fail("Candidate whitespace validation found a blank line at end of an untracked artifact.", { path });
    }
    const lines = text.split(/\r?\n/);
    for (const [index, line] of lines.entries()) {
      if (!/[ \t]+$/.test(line)) continue;
      const intentionalAuditBreak = path === allowedAuditPath && line.endsWith("  ") && !line.endsWith("   ");
      if (!intentionalAuditBreak) {
        fail("Candidate whitespace validation found trailing whitespace in an untracked artifact.", { path, line: index + 1 });
      }
    }
  }
}

async function assertExactStagedPaths(root: string, effective: string[]): Promise<void> {
  const staged = sortedUnique(await gitPaths(root, ["diff", "--cached", "--name-only", "--no-renames", "-z", "HEAD", "--"]));
  const expected = sortedUnique(effective);
  if (JSON.stringify(staged) !== JSON.stringify(expected)) {
    fail("Staged path set differs from the phase manifest effective path set.", { expected, staged });
  }
}

async function assertNoStagedRecoveryPaths(root: string, recovery: string[], effective: string[]): Promise<void> {
  const staged = await gitPaths(root, ["diff", "--cached", "--name-only", "--no-renames", "-z", "HEAD", "--"]);
  const effectiveSet = new Set(effective);
  const forbidden = staged.filter((path) => !effectiveSet.has(path) || recovery.includes(path));
  if (forbidden.length > 0) fail("Checkpoint intake contains staged paths outside the effective allowlist.", { forbidden });
}

async function assertNoUnstagedEffectivePaths(root: string, effective: string[]): Promise<void> {
  const unstaged = new Set(await gitPaths(root, ["diff", "--name-only", "-z", "--"]));
  const changed = effective.filter((path) => unstaged.has(path));
  if (changed.length > 0) fail("Effective checkpoint paths changed in the worktree after they were staged.", { changed });
}

async function snapshotRecoveryPaths(root: string, paths: string[]): Promise<Map<string, string>> {
  const snapshot = new Map<string, string>();
  for (const path of paths) {
    try {
      const stat = await lstat(resolve(root, path));
      if (stat.isSymbolicLink()) {
        snapshot.set(path, `symlink:${await readlink(resolve(root, path))}`);
      } else if (stat.isFile()) {
        snapshot.set(path, `file:${createHash("sha256").update(await readFile(resolve(root, path))).digest("hex")}`);
      } else {
        fail("Unstaged recovery path is not a regular file or symbolic link.", { path });
      }
    } catch (error) {
      if (error instanceof OrchestrationStop) throw error;
      const code = (error as NodeJS.ErrnoException).code;
      if (code === "ENOENT") snapshot.set(path, "missing");
      else throw new OrchestrationStop("PROCESS_AUTHORITY_DRIFT", "Could not snapshot an unstaged recovery path.", { path, cause: String(error) });
    }
  }
  return snapshot;
}

async function assertRecoveryPathsUnchanged(root: string, expected: Map<string, string>): Promise<void> {
  const current = await snapshotRecoveryPaths(root, [...expected.keys()]);
  const changed = [...expected].filter(([path, fingerprint]) => current.get(path) !== fingerprint).map(([path]) => path);
  if (changed.length > 0) fail("Checkpoint changed an unstaged recovery path.", { changed });
}

async function revalidateCheckpointSource(
  input: TicketSetCheckpointInput,
  expectedCandidatePaths: string[],
  expectedSourceAuthority: CheckpointManifest["sourceAuthority"],
): Promise<void> {
  const basis = input.workflowResult.basis;
  if (!basis || basis.type !== "transition") fail("Ticket-set checkpoint lost its persisted source transition before commit.");
  const chain = await collectSourceChain(input.root, basis, input.operation, input.subject);
  const dirty = await currentDirtyPathSet(input.root);
  const validated = input.operation === "checkpoint-component-implementation-tickets-audit"
    ? await validateAuditCheckpointSource(input.root, chain, dirty, input.subject)
    : await validateRemediationCheckpointSource(input.root, chain, dirty, input.subject);
  const candidatePaths = sortedUnique(validated.candidatePaths.map((path) => normalizeRepoPath(input.root, path)));
  if (JSON.stringify(candidatePaths) !== JSON.stringify(expectedCandidatePaths)) {
    fail("Ticket-set checkpoint candidate changed after initial validation.", { expectedCandidatePaths, candidatePaths });
  }
  const sourceAuthority = chain
    .map((entry) => ({ path: entry.record.artifactPath, sha256: entry.sha256 }))
    .sort((left, right) => left.path.localeCompare(right.path));
  if (JSON.stringify(sourceAuthority) !== JSON.stringify(expectedSourceAuthority)) {
    fail("Checkpoint source lineage or digest changed after phase-manifest generation.", {
      expectedSourceAuthority,
      sourceAuthority,
    });
  }
}

function formatCheckSummary(validationDurationsMs: Record<string, number>): string {
  return Object.entries(validationDurationsMs).map(([name, duration]) => `${name}=${duration}ms`).join(", ");
}

export async function executeTicketSetCheckpoint(input: TicketSetCheckpointInput): Promise<TicketSetCheckpointResult> {
  const policy = TICKET_SET_CHECKPOINTS[input.operation];
  const operationInput = JSON.parse(input.operationInputJson || "{}") as Record<string, unknown>;
  const manifestPath = typeof operationInput.phaseManifestPath === "string" ? normalizeRepoPath(input.root, operationInput.phaseManifestPath) : "";
  const markerPath = typeof operationInput.phaseMarkerPath === "string" ? normalizeRepoPath(input.root, operationInput.phaseMarkerPath) : "";
  const recoveryPaths = sortedUnique(Array.isArray(operationInput.preserveUnstagedRecoveryPaths)
    ? operationInput.preserveUnstagedRecoveryPaths.filter((item): item is string => typeof item === "string").map((item) => normalizeRepoPath(input.root, item))
    : []);
  if (!manifestPath || !markerPath || manifestPath === markerPath) fail("Checkpoint operation input lacks distinct normalized manifest and marker paths.");
  if (input.workflowResult.basis?.type !== "transition") fail("Deterministic ticket-set checkpoint requires a validated persisted transition basis.");

  const identity = await captureWorktreeIdentity(input.root);
  if (identity.head !== input.parentHead) {
    throw new OrchestrationStop("TARGET_HEAD_DRIFT", "Checkpoint parent changed before deterministic execution.", {
      expected: input.parentHead,
      actual: identity.head,
    });
  }
  const [manifestExists, markerExists] = await Promise.all([
    access(resolve(input.root, manifestPath)).then(() => true, () => false),
    access(resolve(input.root, markerPath)).then(() => true, () => false),
  ]);
  if (manifestExists || markerExists) {
    fail("Deterministic checkpoint refuses to overwrite a pre-existing manifest or marker.", { manifestPath, markerPath, manifestExists, markerExists });
  }

  let chain = await collectSourceChain(input.root, input.workflowResult.basis, input.operation, input.subject);
  let dirty = await currentDirtyPathSet(input.root);
  let sourceResult = chain[0];
  if (sourceResult.record.operation !== policy.sourceOperation || sourceResult.record.gateField !== policy.sourceGateField
    || sourceResult.record.gateValue !== policy.sourceGateValue) {
    fail("Checkpoint predecessor record no longer matches the selected operation policy.", {
      expectedOperation: policy.sourceOperation,
      sourceOperation: sourceResult.record.operation,
      expectedGate: `${policy.sourceGateField}=${policy.sourceGateValue}`,
      sourceGate: `${sourceResult.record.gateField}=${sourceResult.record.gateValue}`,
    });
  }
  let validated: { candidatePaths: string[]; semanticFingerprint: string; summary: Record<string, string> };
  if (input.operation === "checkpoint-component-implementation-tickets-audit") {
    validated = await validateAuditCheckpointSource(input.root, chain, dirty, input.subject);
  } else {
    validated = await validateRemediationCheckpointSource(input.root, chain, dirty, input.subject);
  }
  let candidatePaths = sortedUnique(validated.candidatePaths.map((path) => normalizeRepoPath(input.root, path)));
  const terminalMetadataNormalized = input.operation === "checkpoint-component-implementation-tickets-audit"
    && await normalizeTicketSetAuditWorkflowResultEnding(input.root, sourceResult.record);
  if (terminalMetadataNormalized) {
    chain = await collectSourceChain(input.root, input.workflowResult.basis, input.operation, input.subject);
    dirty = await currentDirtyPathSet(input.root);
    sourceResult = chain[0];
    validated = await validateAuditCheckpointSource(input.root, chain, dirty, input.subject);
    const normalizedCandidatePaths = sortedUnique(validated.candidatePaths.map((path) => normalizeRepoPath(input.root, path)));
    if (JSON.stringify(normalizedCandidatePaths) !== JSON.stringify(candidatePaths)) {
      fail("Normalizing the terminal workflow metadata changed the validated ticket-set checkpoint candidate.", {
        candidatePaths,
        normalizedCandidatePaths,
      });
    }
    candidatePaths = normalizedCandidatePaths;
    await input.onEvent?.({ event: "checkpoint_source_metadata_normalized", fields: {
      step: input.step,
      operation: input.operation,
      artifactPath: sourceResult.record.artifactPath,
      resultId: sourceResult.record.resultId,
      change: "removed redundant line terminators after extension-owned terminal metadata",
    } });
  }
  const evidenceSet = new Set(input.evidenceFiles.map((path) => normalizeRepoPath(input.root, path)));
  const unauthoritativeCandidates = candidatePaths.filter((path) => !evidenceSet.has(path));
  if (unauthoritativeCandidates.length > 0) fail("Checkpoint candidate path is absent from the validated operation evidence.", { unauthoritativeCandidates });
  const allExpectedDirty = sortedUnique([...candidatePaths, ...recoveryPaths]);
  const actualDirty = sortedUnique([...dirty]);
  if (JSON.stringify(allExpectedDirty) !== JSON.stringify(actualDirty)) {
    fail("Current dirty paths do not exactly partition into the ticket-set candidate and declared unstaged recovery paths.", {
      candidatePaths,
      recoveryPaths,
      actualDirty,
    });
  }
  const recoverySnapshot = await snapshotRecoveryPaths(input.root, recoveryPaths);
  if (candidatePaths.some((path) => !path.startsWith("docs/") || !path.endsWith(".md"))) {
    fail("Ticket-set checkpoint candidate must contain documentation artifacts only.", { candidatePaths });
  }
  await assertNoStagedRecoveryPaths(input.root, recoveryPaths, candidatePaths);
  await candidateWhitespaceCheck(
    input.root,
    candidatePaths,
    input.operation === "checkpoint-component-implementation-tickets-audit" ? sourceResult.record.artifactPath : undefined,
  );

  const routes = input.catalog.operations[input.operation]?.routes;
  const routeEntries = Object.entries(routes ?? {});
  if (routeEntries.length !== 1 || routeEntries[0][0] !== policy.nextOperation || routeEntries[0][1] !== policy.nextOperation) {
    fail("Ticket-set checkpoint policy and deterministic transition catalog disagree.", { operation: input.operation, routeEntries, expected: policy.nextOperation });
  }

  const sourceAuthority = chain
    .map((entry) => ({ path: entry.record.artifactPath, sha256: entry.sha256 }))
    .sort((left, right) => left.path.localeCompare(right.path));
  const semanticFingerprint = validated.semanticFingerprint.trim();
  if (!semanticFingerprint) fail("Checkpoint source does not expose a semantic fingerprint.");
  const commitMessage = input.operation === "checkpoint-component-implementation-tickets-audit"
    ? `checkpoint(${input.subject}): preserve implementation ticket audit baseline`
    : `checkpoint(${input.subject}): preserve implementation ticket remediation`;
  const manifest: CheckpointManifest = {
    schemaVersion: 1,
    manifestKind: "PHASE_CHECKPOINT",
    phaseId: manifestPath.replace(/^docs\/workflow-checkpoints\//, "").replace(/-manifest\.json$/, ""),
    operation: input.operation,
    subject: { id: input.subject, type: "component" },
    sourceAuthority,
    target: { head: input.parentHead, semanticFingerprint },
    paths: {
      manifest: manifestPath,
      preserve: candidatePaths,
      delete: [],
      unstagedRecovery: recoveryPaths,
      marker: markerPath,
    },
    nextAuthorizedOperation: policy.nextOperation,
    commitMessage,
  };
  const manifestContent = `${JSON.stringify(manifest, null, 2)}\n`;
  const draftMarker = markerContent(input, manifest, validated.summary, chain, false);
  const completeMarker = markerContent(input, manifest, validated.summary, chain, true);
  const indexSnapshot = await captureIndexSnapshot(input.root);
  const validationDurationsMs: Record<string, number> = {};
  const phaseValidation = async () => {
    validationDurationsMs["verify:phase-manifest"] = await runValidation(input, "verify:phase-manifest", process.execPath, [
      resolve(input.root, "tools/verify-phase-manifest.mjs"), "--manifest", manifestPath,
    ]);
    validationDurationsMs["verify:canonical-consistency"] = await runValidation(input, "verify:canonical-consistency", "npm", ["run", "verify:canonical-consistency"]);
    validationDurationsMs["verify:audit-governance"] = await runValidation(input, "verify:audit-governance", "npm", ["run", "verify:audit-governance"]);
  };
  const effectivePaths = sortedUnique([...candidatePaths, manifestPath, markerPath]);
  let manifestOwned = false;
  let markerOwned = false;
  let checkpointIndex: Buffer | undefined;
  let checkpointTree: string | undefined;
  let commitStarted = Date.now();
  try {
    await writeExclusiveFile(resolve(input.root, manifestPath), manifestContent, () => { manifestOwned = true; });
    await writeExclusiveFile(resolve(input.root, markerPath), draftMarker, () => { markerOwned = true; });
    await input.onEvent?.({ event: "checkpoint_artifacts_materialized", fields: {
      step: input.step,
      operation: input.operation,
      manifestPath,
      markerPath,
      preservedPathCount: candidatePaths.length,
      recoveryPathCount: recoveryPaths.length,
    } });
    await phaseValidation();
    await assertWorktreeIdentity(input.root, identity, input.parentHead);
    await assertNoStagedRecoveryPaths(input.root, recoveryPaths, candidatePaths);
    await assertRecoveryPathsUnchanged(input.root, recoverySnapshot);
    await input.onEvent?.({ event: "checkpoint_stage_started", fields: { step: input.step, operation: input.operation, pathCount: effectivePaths.length } });

    const generatedRecord = recordByIdentity(completeMarker, markerPath, input.operation, input.subject, input.workflowResult.resultId);
    if (generatedRecord.gateField !== "NEXT_AUTHORIZED_OPERATION" || generatedRecord.gateValue !== policy.nextOperation
      || fieldLast(completeMarker, "NEXT_AUTHORIZED_OPERATION") !== policy.nextOperation) {
      fail("Generated checkpoint marker does not persist the exact catalog-authorized result gate.", {
        operation: input.operation,
        gateField: generatedRecord.gateField,
        gateValue: generatedRecord.gateValue,
        expectedNextOperation: policy.nextOperation,
      });
    }
    await writeFile(resolve(input.root, markerPath), completeMarker, { flag: "w" });
    await git(input.root, ["--literal-pathspecs", "add", "--", ...effectivePaths]);
    checkpointIndex = await readFile(indexSnapshot.path);
    checkpointTree = await git(input.root, ["write-tree"]);
    await assertExactStagedPaths(input.root, effectivePaths);
    const cachedCheckStarted = Date.now();
    await cachedWhitespaceCheck(input.root, input.operation === "checkpoint-component-implementation-tickets-audit" ? sourceResult.record.artifactPath : undefined);
    validationDurationsMs["git diff --cached --check-final"] = Date.now() - cachedCheckStarted;
    await assertWorktreeIdentity(input.root, identity, input.parentHead);
    await assertNoStagedRecoveryPaths(input.root, recoveryPaths, effectivePaths);
    validationDurationsMs["verify:phase-manifest-staged"] = await runValidation(input, "verify:phase-manifest-staged", process.execPath, [
      resolve(input.root, "tools/verify-phase-manifest.mjs"), "--manifest", manifestPath,
    ]);
    await assertExactStagedPaths(input.root, effectivePaths);
    await assertNoUnstagedEffectivePaths(input.root, effectivePaths);
    await revalidateCheckpointSource(input, candidatePaths, manifest.sourceAuthority);
    await assertRecoveryPathsUnchanged(input.root, recoverySnapshot);

    const beforeCommitIdentity = await captureWorktreeIdentity(input.root);
    if (JSON.stringify(beforeCommitIdentity) !== JSON.stringify(identity)) {
      throw new OrchestrationStop("TARGET_HEAD_DRIFT", "Active worktree changed immediately before checkpoint commit.", {
        expected: identity,
        actual: beforeCommitIdentity,
      });
    }
    await input.onEvent?.({ event: "checkpoint_commit_started", fields: { step: input.step, operation: input.operation, commitMessage } });
    commitStarted = Date.now();
    await git(input.root, ["commit", "-m", commitMessage]);
  } catch (error) {
    const currentHead = await git(input.root, ["rev-parse", "--verify", "HEAD"]).catch(() => "");
    try {
      await input.onEvent?.({ event: "checkpoint_failure_head_observed", fields: {
        step: input.step,
        operation: input.operation,
        currentHead: currentHead || "UNAVAILABLE",
        expectedHead: input.parentHead,
      } });
    } catch {
      // Logging must not block rollback.
    }
    if (currentHead === input.parentHead) {
      try {
        const observedFailureTree = checkpointTree
          ? await git(input.root, ["write-tree"]).catch(() => undefined)
          : undefined;
        const observedFailureIndex = await readFile(indexSnapshot.path).catch(() => undefined);
        await restoreIndexSnapshot(indexSnapshot, checkpointIndex, checkpointTree, observedFailureIndex, observedFailureTree);
        const cleanupFailures: string[] = [];
        await removeOwnedFile(input.root, manifestPath, manifestOwned, [Buffer.from(manifestContent)]).catch((cleanupError) => {
          cleanupFailures.push(String(cleanupError));
        });
        await removeOwnedFile(input.root, markerPath, markerOwned, [Buffer.from(draftMarker), Buffer.from(completeMarker)]).catch((cleanupError) => {
          cleanupFailures.push(String(cleanupError));
        });
        if (cleanupFailures.length > 0) {
          throw new OrchestrationStop("PROCESS_AUTHORITY_DRIFT", "Checkpoint validation failed and some owned artifacts could not be rolled back.", {
            operation: input.operation,
            cleanupFailures,
          });
        }
        try {
          await input.onEvent?.({ event: "checkpoint_rollback_completed", fields: {
            step: input.step,
            operation: input.operation,
            manifestRemoved: manifestOwned,
            markerRemoved: markerOwned,
            indexRestored: true,
          } });
        } catch {
          // Rollback has already succeeded; a logging failure must not replace the operation failure.
        }
      } catch (rollbackError) {
        const rollbackFailure = rollbackError instanceof Error ? `${rollbackError.name}: ${rollbackError.message}` : String(rollbackError);
        throw new OrchestrationStop("PROCESS_AUTHORITY_DRIFT", `Checkpoint failed before commit and failure-atomic rollback was incomplete: ${rollbackFailure}.`, {
          operation: input.operation,
          failure: error instanceof Error ? `${error.name}: ${error.message}` : String(error),
          rollbackFailure,
        });
      }
    }
    throw error;
  }
  const commitHead = await git(input.root, ["rev-parse", "--verify", "HEAD"]);
  const parents = (await git(input.root, ["show", "-s", "--format=%P", commitHead])).split(/\s+/).filter(Boolean);
  if (parents.length !== 1 || parents[0] !== input.parentHead) {
    throw new OrchestrationStop("TARGET_HEAD_DRIFT", "Deterministic checkpoint did not create exactly one commit on the pinned parent.", {
      expectedParent: input.parentHead,
      parents,
      commitHead,
    });
  }
  const committedPaths = sortedUnique(await gitPaths(input.root, ["diff-tree", "--no-commit-id", "--name-only", "--no-renames", "-r", "-z", commitHead]));
  if (JSON.stringify(committedPaths) !== JSON.stringify(effectivePaths)) {
    throw new OrchestrationStop("PROCESS_AUTHORITY_DRIFT", "Committed paths differ from the deterministic checkpoint allowlist.", {
      expected: effectivePaths,
      committedPaths,
      commitHead,
    });
  }
  const postCommitDirty = sortedUnique([...(await currentDirtyPathSet(input.root))]);
  if (JSON.stringify(postCommitDirty) !== JSON.stringify(recoveryPaths)) {
    throw new OrchestrationStop("PROCESS_AUTHORITY_DRIFT", "Checkpoint commit left workspace changes outside the declared recovery set.", {
      expectedRecoveryPaths: recoveryPaths,
      postCommitDirty,
      commitHead,
    });
  }
  await assertRecoveryPathsUnchanged(input.root, recoverySnapshot);
  const commitDurationMs = Date.now() - commitStarted;
  validationDurationsMs["git commit"] = commitDurationMs;
  await input.onEvent?.({ event: "checkpoint_commit_completed", fields: {
    step: input.step,
    operation: input.operation,
    status: "PASS",
    durationMs: commitDurationMs,
    commitHead,
    parentHead: input.parentHead,
    committedPathCount: committedPaths.length,
    checks: formatCheckSummary(validationDurationsMs),
  } });

  const receipt: OperationReceipt = {
    operation: input.operation,
    subject: input.subject,
    status: "COMPLETE",
    artifactPaths: [markerPath, manifestPath],
    gateArtifactPath: markerPath,
    gateField: "NEXT_AUTHORIZED_OPERATION",
    gateValue: policy.nextOperation,
    changedPaths: committedPaths,
    reason: `Deterministic phase checkpoint committed at ${commitHead}.`,
  };
  return { receipt, commitHead, validationDurationsMs };
}
