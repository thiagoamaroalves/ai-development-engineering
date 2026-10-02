import { constants } from "node:fs";
import { chmod, lstat, mkdir, open, realpath } from "node:fs/promises";
import { relative, resolve, sep } from "node:path";

const MAX_TEXT_LENGTH = 500;
const MAX_PATHS = 100;
const writeQueues = new Map<string, Promise<boolean>>();

const ALLOWED_FIELDS = new Set([
  "operation",
  "subject",
  "step",
  "agent",
  "nodeId",
  "ownerRunId",
  "skill",
  "status",
  "decision",
  "durationMs",
  "gateField",
  "gateValue",
  "nextOperation",
  "stopCode",
  "errorName",
  "message",
  "runId",
  "resultKind",
  "targetHead",
  "commitHead",
  "parentHead",
  "changedPaths",
  "artifactPaths",
  "usageAvailable",
  "usageSource",
  "inputTokens",
  "outputTokens",
  "cacheReadTokens",
  "cacheWriteTokens",
  "totalTokens",
  "stepCount",
]);

function safeIdentifier(value: string): string {
  const safe = value.replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 96);
  return safe || "unknown-run";
}

function safeText(value: string): string {
  return value
    .replace(/\bBearer\s+[A-Za-z0-9._~+/-]+=*/gi, "Bearer [REDACTED]")
    .replace(/\b(?:sk|rk|pk)-[A-Za-z0-9_-]{16,}\b/gi, "[REDACTED_KEY]")
    .replace(/\b(api[_-]?key|access[_-]?token|secret|password)\s*[:=]\s*["']?[^\s,"']+/gi, "$1=[REDACTED]")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .slice(0, MAX_TEXT_LENGTH);
}

function safePaths(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value
    .filter((item): item is string => typeof item === "string")
    .slice(0, MAX_PATHS)
    .map((item) => safeText(item));
}

function safeFields(fields: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(fields)) {
    if (!ALLOWED_FIELDS.has(key)) continue;
    if (typeof value === "string") result[key] = safeText(value);
    else if (typeof value === "number" && Number.isFinite(value)) result[key] = value;
    else if (typeof value === "boolean" || value === null) result[key] = value;
    else if (key === "changedPaths" || key === "artifactPaths") {
      const paths = safePaths(value);
      if (paths) result[key] = paths;
    }
  }
  return result;
}

function isInside(root: string, candidate: string): boolean {
  const rel = relative(root, candidate);
  return rel === "" || (rel !== ".." && !rel.startsWith(`..${sep}`) && !rel.startsWith(sep));
}

export function workflowRunLogPath(root: string, executionId: string): string {
  return resolve(root, ".pi", "session-logs", `workflow-${safeIdentifier(executionId)}.jsonl`);
}

/**
 * Append one metadata-only event to a local, per-run JSONL file.
 * Logging is deliberately fail-open: observability must not change workflow behavior.
 */
export async function appendWorkflowRunEvent(
  root: string,
  executionId: string,
  event: string,
  fields: Record<string, unknown> = {},
): Promise<boolean> {
  const filePath = workflowRunLogPath(root, executionId);
  const record = {
    schemaVersion: 1,
    timestamp: new Date().toISOString(),
    executionId: safeIdentifier(executionId),
    event: safeText(event),
    ...safeFields(fields),
  };
  const line = `${JSON.stringify(record)}\n`;
  const previous = writeQueues.get(filePath) ?? Promise.resolve(true);
  const pending = previous.catch(() => false).then(async () => {
    try {
      const canonicalRoot = await realpath(root);
      const stateDirectory = resolve(canonicalRoot, ".pi");
      let stateInfo: Awaited<ReturnType<typeof lstat>>;
      try {
        stateInfo = await lstat(stateDirectory);
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "ENOENT") return false;
        try {
          await mkdir(stateDirectory, { mode: 0o700 });
        } catch (mkdirError) {
          if ((mkdirError as NodeJS.ErrnoException).code !== "EEXIST") return false;
        }
        stateInfo = await lstat(stateDirectory);
      }
      if (!stateInfo.isDirectory() || stateInfo.isSymbolicLink()) return false;
      const canonicalStateDirectory = await realpath(stateDirectory);
      if (!isInside(canonicalRoot, canonicalStateDirectory)) return false;

      const directory = resolve(canonicalStateDirectory, "session-logs");
      let directoryInfo: Awaited<ReturnType<typeof lstat>>;
      try {
        directoryInfo = await lstat(directory);
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "ENOENT") return false;
        try {
          await mkdir(directory, { mode: 0o700 });
        } catch (mkdirError) {
          if ((mkdirError as NodeJS.ErrnoException).code !== "EEXIST") return false;
        }
        directoryInfo = await lstat(directory);
      }
      if (!directoryInfo.isDirectory() || directoryInfo.isSymbolicLink()) return false;
      const canonicalDirectory = await realpath(directory);
      if (!isInside(canonicalStateDirectory, canonicalDirectory)) return false;
      await chmod(canonicalDirectory, 0o700);
      const canonicalFile = resolve(canonicalDirectory, filePath.split(sep).at(-1)!);
      const handle = await open(
        canonicalFile,
        constants.O_CREAT | constants.O_APPEND | constants.O_WRONLY | constants.O_NOFOLLOW,
        0o600,
      );
      try {
        await handle.chmod(0o600);
        await handle.writeFile(line, "utf8");
      } finally {
        await handle.close();
      }
      return true;
    } catch {
      return false;
    }
  });
  writeQueues.set(filePath, pending);
  const written = await pending;
  if (writeQueues.get(filePath) === pending) writeQueues.delete(filePath);
  return written;
}

export function safeFailureFields(error: unknown): Record<string, unknown> {
  const candidate = error && typeof error === "object" ? error as Record<string, unknown> : undefined;
  const message = error instanceof Error ? error.message : String(error);
  return {
    ...(typeof candidate?.code === "string" ? { stopCode: candidate.code } : {}),
    ...(error instanceof Error ? { errorName: error.name } : {}),
    message,
  };
}
