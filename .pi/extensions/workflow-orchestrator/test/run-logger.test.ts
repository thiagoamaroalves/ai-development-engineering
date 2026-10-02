import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, stat, symlink } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { appendWorkflowRunEvent, workflowRunLogPath } from "../run-logger.ts";

test("run logger appends serialized metadata events to a private per-run JSONL file", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "pi-run-log-"));
  try {
    await Promise.all([
      appendWorkflowRunEvent(root, "run-123", "workflow_started", { operation: "workflow_orchestrate" }),
      appendWorkflowRunEvent(root, "run-123", "agent_started", {
        agent: "workflow-controller",
        task: "do not persist this prompt",
        reason: "do not persist this response text",
      }),
      appendWorkflowRunEvent(root, "run-123", "agent_finished", {
        status: "failed",
        message: "api_key=very-secret-value",
      }),
    ]);

    const logPath = workflowRunLogPath(root, "run-123");
    const contents = await readFile(logPath, "utf8");
    const rows = contents.trim().split("\n").map((line) => JSON.parse(line) as Record<string, unknown>);
    assert.equal(rows.length, 3);
    assert.ok(rows.every((row) => row.schemaVersion === 1 && row.executionId === "run-123"));
    assert.deepEqual(new Set(rows.map((row) => row.event)), new Set(["workflow_started", "agent_started", "agent_finished"]));
    assert.equal(contents.includes("do not persist this prompt"), false);
    assert.equal(contents.includes("do not persist this response text"), false);
    assert.equal(contents.includes("very-secret-value"), false);
    assert.equal(rows.find((row) => row.event === "agent_finished")?.message, "api_key=[REDACTED]");
    assert.equal((await stat(logPath)).mode & 0o777, 0o600);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("run logger refuses a symlinked local state directory without writing outside the repository", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "pi-run-log-symlink-root-"));
  const outside = await mkdtemp(path.join(os.tmpdir(), "pi-run-log-symlink-outside-"));
  try {
    await symlink(outside, path.join(root, ".pi"));
    assert.equal(await appendWorkflowRunEvent(root, "run-123", "workflow_started"), false);
    await assert.rejects(readFile(path.join(outside, "session-logs", "workflow-run-123.jsonl"), "utf8"));
    await assert.rejects(stat(path.join(outside, "session-logs")));
  } finally {
    await rm(root, { recursive: true, force: true });
    await rm(outside, { recursive: true, force: true });
  }
});

test("run logger keeps execution IDs within the local log directory", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "pi-run-log-path-"));
  try {
    const logPath = workflowRunLogPath(root, "../../outside");
    assert.equal(path.dirname(logPath), path.join(root, ".pi", "session-logs"));
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
