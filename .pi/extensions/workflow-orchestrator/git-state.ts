import { createHash } from "node:crypto";
import { lstat, readFile, readlink } from "node:fs/promises";
import { dirname, relative, resolve, sep } from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

import { OrchestrationStop } from "./contracts.ts";

const execFileAsync = promisify(execFile);

async function git(cwd: string, args: string[]): Promise<string> {
  const { stdout } = await execFileAsync("git", args, {
    cwd,
    encoding: "utf8",
    maxBuffer: 16 * 1024 * 1024,
  });
  return stdout.trim();
}

export interface KeyScopedSemanticExclusion {
  path: string;
  jsonPaths: string[];
  reason: string;
}

export interface SemanticFingerprintPolicy {
  version: 1;
  semanticExclusions: string[];
  keyScopedExclusions: KeyScopedSemanticExclusion[];
}

const POLICY_PATH = "skills/_shared/semantic-fingerprint-policy.json";

function validatePolicy(value: unknown): SemanticFingerprintPolicy {
  if (!value || typeof value !== "object") throw new Error("policy must be an object");
  const candidate = value as Record<string, unknown>;
  if (candidate.version !== 1) throw new Error("policy version must be 1");
  if (!Array.isArray(candidate.semanticExclusions) || !candidate.semanticExclusions.every((item) => typeof item === "string" && item.length > 0)) {
    throw new Error("semanticExclusions must be a non-empty-string array");
  }
  if (!Array.isArray(candidate.keyScopedExclusions)) throw new Error("keyScopedExclusions must be an array");
  const keyScopedExclusions = candidate.keyScopedExclusions.map((item) => {
    if (!item || typeof item !== "object") throw new Error("key-scoped exclusion must be an object");
    const entry = item as Record<string, unknown>;
    if (typeof entry.path !== "string" || !Array.isArray(entry.jsonPaths) || !entry.jsonPaths.every((path) => typeof path === "string" && path.startsWith("/")) || typeof entry.reason !== "string" || entry.reason.trim() === "") {
      throw new Error("invalid key-scoped exclusion");
    }
    return { path: entry.path, jsonPaths: entry.jsonPaths as string[], reason: entry.reason };
  });
  return {
    version: 1,
    semanticExclusions: candidate.semanticExclusions as string[],
    keyScopedExclusions,
  };
}

export async function loadSemanticFingerprintPolicy(root: string): Promise<SemanticFingerprintPolicy> {
  const policyPath = resolve(root, POLICY_PATH);
  try {
    const raw = await readFile(policyPath, "utf8");
    return validatePolicy(JSON.parse(raw));
  } catch (error) {
    if (error instanceof OrchestrationStop) throw error;
    throw new OrchestrationStop("MISSING_AUTHORITY", "Semantic fingerprint policy is missing or invalid.", {
      policyPath: POLICY_PATH,
      cause: String(error),
    });
  }
}

export async function repositoryRoot(cwd: string): Promise<string> {
  try {
    return await git(cwd, ["rev-parse", "--show-toplevel"]);
  } catch (error) {
    throw new OrchestrationStop("MISSING_AUTHORITY", "The target is not inside a Git repository.", {
      cause: String(error),
    });
  }
}

export async function currentHead(root: string): Promise<string> {
  return git(root, ["rev-parse", "--verify", "HEAD"]);
}

export async function assertPinnedHead(root: string, expected: string): Promise<void> {
  const actual = await currentHead(root);
  if (actual !== expected) {
    throw new OrchestrationStop("TARGET_HEAD_DRIFT", "Current HEAD differs from the skill-derived audit target.", {
      expected,
      actual,
    });
  }
}

export async function assertCheckpointAdvance(root: string, expectedParent: string): Promise<string> {
  const actual = await currentHead(root);
  if (actual === expectedParent) {
    throw new OrchestrationStop("INCOMPLETE_CANONICAL_RESULT", "Checkpoint operation completed without creating a commit.", {
      expectedParent,
      actual,
    });
  }
  let parent: string;
  try {
    parent = await git(root, ["rev-parse", `${actual}^`]);
  } catch (error) {
    throw new OrchestrationStop("TARGET_HEAD_DRIFT", "Checkpoint HEAD has no verifiable parent commit.", {
      expectedParent,
      actual,
      cause: String(error),
    });
  }
  if (parent !== expectedParent) {
    throw new OrchestrationStop("TARGET_HEAD_DRIFT", "Checkpoint did not create exactly one commit on the pinned parent.", {
      expectedParent,
      actual,
      parent,
    });
  }
  return actual;
}

export async function resolveInside(root: string, candidate: string): Promise<string> {
  const absolute = resolve(root, candidate);
  const rel = relative(root, absolute);
  if (rel === "" || (!rel.startsWith(`..${sep}`) && rel !== ".." && !rel.startsWith(sep))) return absolute;
  throw new OrchestrationStop("INVALID_PATH", "A workflow path escapes the repository root.", { candidate });
}

function globToRegExp(pattern: string): RegExp {
  let expression = "^";
  for (let index = 0; index < pattern.length; index += 1) {
    const character = pattern[index];
    if (character === "*" && pattern[index + 1] === "*") {
      expression += ".*";
      index += 1;
    } else if (character === "*") {
      expression += "[^/]*";
    } else {
      expression += character.replace(/[\\^$.*+?()[\\]{}|]/g, "\\$&");
    }
  }
  return new RegExp(`${expression}$`);
}

function jsonPathMatches(path: string, pattern: string): boolean {
  const pathParts = path.split("/").filter(Boolean);
  const patternParts = pattern.split("/").filter(Boolean);
  if (pathParts.length !== patternParts.length) return false;
  return patternParts.every((part, index) => globToRegExp(part).test(pathParts[index]));
}

function stripExcludedJsonPaths(value: unknown, currentPath: string, excludedPaths: string[]): unknown {
  if (Array.isArray(value)) return value.map((item, index) => stripExcludedJsonPaths(item, `${currentPath}/${index}`, excludedPaths));
  if (!value || typeof value !== "object") return value;
  const result: Record<string, unknown> = {};
  for (const [key, child] of Object.entries(value)) {
    const childPath = `${currentPath}/${key}`;
    if (excludedPaths.some((pattern) => jsonPathMatches(childPath, pattern))) continue;
    result[key] = stripExcludedJsonPaths(child, childPath, excludedPaths);
  }
  return result;
}

function sortJsonKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortJsonKeys);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(Object.entries(value as Record<string, unknown>).sort(([left], [right]) => left < right ? -1 : left > right ? 1 : 0).map(([key, child]) => [key, sortJsonKeys(child)]));
}

async function semanticOverlayContent(
  root: string,
  relativePath: string,
  content: Buffer | undefined,
  policy: SemanticFingerprintPolicy,
): Promise<Buffer | undefined> {
  if (policy.semanticExclusions.some((pattern) => globToRegExp(pattern).test(relativePath))) return undefined;
  if (!content) return Buffer.from("DELETED");
  const rule = policy.keyScopedExclusions.find((candidate) => candidate.path === relativePath);
  if (!rule) return content;
  try {
    const current = JSON.parse(content.toString("utf8"));
    const normalizedCurrent = sortJsonKeys(stripExcludedJsonPaths(current, "", rule.jsonPaths));
    let baseline: unknown;
    try { baseline = JSON.parse(await git(root, ["show", `HEAD:${relativePath}`])); }
    catch { baseline = undefined; }
    if (baseline !== undefined) {
      const normalizedBaseline = sortJsonKeys(stripExcludedJsonPaths(baseline, "", rule.jsonPaths));
      if (JSON.stringify(normalizedCurrent) === JSON.stringify(normalizedBaseline)) return undefined;
    }
    return Buffer.from(JSON.stringify(normalizedCurrent) ?? "null");
  } catch {
    return content;
  }
}

export interface WorkspaceSnapshot {
  fingerprint: string;
  files: Map<string, string>;
}

export interface WorkspaceSnapshotDiff {
  added: string[];
  removed: string[];
  modified: string[];
}

async function snapshotWorkspace(
  root: string,
  ignored: ReadonlySet<string>,
  excludedPrefixes: readonly string[],
  policy?: SemanticFingerprintPolicy,
): Promise<WorkspaceSnapshot> {
  const hash = createHash("sha256");
  const fileHashes = new Map<string, string>();
  const head = await currentHead(root);
  const [trackedChanges, untracked] = await Promise.all([
    gitNulSeparated(root, ["diff", "--name-only", "--no-renames", "-z", "HEAD", "--"]),
    gitNulSeparated(root, ["ls-files", "--others", "--exclude-standard", "-z"]),
  ]);
  hash.update(`HEAD:${head}\0`);
  for (const rel of [...new Set([...trackedChanges, ...untracked])].sort()) {
    if (ignored.has(rel) || excludedPrefixes.some((prefix) => rel === prefix.slice(0, -1) || rel.startsWith(prefix))) continue;
    const absolute = resolve(root, rel);
    let content: Buffer | undefined;
    try {
      const info = await lstat(absolute);
      content = info.isSymbolicLink() ? Buffer.from(`symlink:${await readlink(absolute)}`) : await readFile(absolute);
    } catch {
      content = undefined;
    }
    const semanticContent = policy ? await semanticOverlayContent(root, rel, content, policy) : (content ?? Buffer.from("DELETED"));
    if (semanticContent === undefined) continue;
    hash.update(rel);
    hash.update("\0");
    hash.update(semanticContent);
    hash.update("\0");
    fileHashes.set(rel, semanticContent.toString("base64"));
  }
  return { fingerprint: hash.digest("hex"), files: fileHashes };
}

export async function workspaceSnapshot(
  root: string,
  ignored: ReadonlySet<string>,
  excludedPrefixes: readonly string[] = [],
  policy?: SemanticFingerprintPolicy,
): Promise<WorkspaceSnapshot> {
  return snapshotWorkspace(root, ignored, excludedPrefixes, policy);
}

export function workspaceSnapshotDiff(before: WorkspaceSnapshot, after: WorkspaceSnapshot): WorkspaceSnapshotDiff {
  const added: string[] = [];
  const removed: string[] = [];
  const modified: string[] = [];
  for (const [path, hash] of after.files) {
    if (!before.files.has(path)) added.push(path);
    else if (before.files.get(path) !== hash) modified.push(path);
  }
  for (const path of before.files.keys()) {
    if (!after.files.has(path)) removed.push(path);
  }
  return {
    added: added.sort(),
    removed: removed.sort(),
    modified: modified.sort(),
  };
}

async function gitNulSeparated(cwd: string, args: string[]): Promise<string[]> {
  const { stdout } = await execFileAsync("git", args, {
    cwd,
    encoding: "utf8",
    maxBuffer: 16 * 1024 * 1024,
  });
  return stdout.split("\0").filter((path) => path.length > 0);
}

export interface WorkflowStateSnapshot {
  files: Map<string, Buffer | null>;
}

export interface WorkflowStateDiff {
  added: string[];
  removed: string[];
  modified: string[];
}

/**
 * Captures only Git-visible working-tree paths. Unlike the semantic audit
 * fingerprint this does not walk/hash the repository or establish an audit
 * identity; it detects changes made during one orchestration operation.
 */
export async function workflowStateSnapshot(root: string): Promise<WorkflowStateSnapshot> {
  const { stdout } = await execFileAsync("git", ["status", "--porcelain=v1", "--no-renames", "-z", "--untracked-files=all"], {
    cwd: root,
    encoding: "utf8",
    maxBuffer: 16 * 1024 * 1024,
  });
  const statusByPath = new Map<string, string>();
  for (const entry of stdout.split("\0")) {
    if (entry.length < 4) continue;
    statusByPath.set(entry.slice(3), entry.slice(0, 2));
  }
  const files = new Map<string, Buffer | null>();
  for (const [path, status] of [...statusByPath].sort(([left], [right]) => left < right ? -1 : left > right ? 1 : 0)) {
    try {
      const absolute = resolve(root, path);
      const info = await lstat(absolute);
      const content = info.isSymbolicLink() ? Buffer.from(`symlink:${await readlink(absolute)}`) : info.isFile() ? await readFile(absolute) : Buffer.alloc(0);
      files.set(path, Buffer.concat([Buffer.from(`${status}\0`), content]));
    }
    catch { files.set(path, Buffer.from(`${status}\0<DELETED>`)); }
  }
  return { files };
}

export function workflowStateDiff(before: WorkflowStateSnapshot, after: WorkflowStateSnapshot): WorkflowStateDiff {
  const added: string[] = [];
  const removed: string[] = [];
  const modified: string[] = [];
  for (const [path, content] of after.files) {
    if (!before.files.has(path)) added.push(path);
    else {
      const previous = before.files.get(path);
      if (previous === null || content === null ? previous !== content : !previous!.equals(content!)) modified.push(path);
    }
  }
  for (const path of before.files.keys()) if (!after.files.has(path)) removed.push(path);
  return { added: added.sort(), removed: removed.sort(), modified: modified.sort() };
}

export function sameWorkflowState(before: WorkflowStateSnapshot, after: WorkflowStateSnapshot): boolean {
  const diff = workflowStateDiff(before, after);
  return diff.added.length === 0 && diff.removed.length === 0 && diff.modified.length === 0;
}

export function repositoryRelative(root: string, path: string): string {
  return relative(root, resolve(root, path)).split(sep).join("/");
}

export async function ensureParentInside(root: string, path: string): Promise<void> {
  const parent = dirname(await resolveInside(root, path));
  const rel = relative(root, parent);
  if (rel.startsWith("..")) throw new OrchestrationStop("INVALID_PATH", "Artifact parent escapes repository.");
}
