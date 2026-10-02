import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

import { createDelegator } from "../subagents-client.ts";
import { workflowRunLogPath } from "../run-logger.ts";

interface EventBus {
  handlers: Map<string, Set<(payload: unknown) => void>>;
  on(event: string, handler: (payload: unknown) => void): () => void;
  emit(event: string, payload: unknown): void;
}

function eventBus(): EventBus {
  const handlers = new Map<string, Set<(payload: unknown) => void>>();
  return {
    handlers,
    on(event, handler) {
      const listeners = handlers.get(event) ?? new Set();
      listeners.add(handler);
      handlers.set(event, listeners);
      return () => listeners.delete(handler);
    },
    emit(event, payload) {
      for (const handler of handlers.get(event) ?? []) handler(payload);
    },
  };
}

test("delegation omits in-process context for compatibility with older pi-subagents", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "pi-delegator-"));
  try {
  const events = eventBus();
  let request: any;
  events.on("prompt-template:subagent:request", (payload) => {
    request = payload as any;
    events.emit("prompt-template:subagent:response", {
      requestId: request.requestId,
      ownerRunId: request.ownerRunId,
      nodeId: request.nodeId,
      status: "completed",
      runId: "run-controller",
      usage: { input: 11, output: 7, cacheRead: 3, cacheWrite: 1, totalTokens: 22 },
      result: { kind: "structured", value: { decision: "COMPLETE" } },
    });
  });

  const delegate = createDelegator({ events } as unknown as ExtensionAPI);
  const extensionContext = {};
  const result = await delegate({
    ownerRunId: "workflow",
    nodeId: "controller-1",
    agent: "workflow-controller",
    task: "derive one operation",
    cwd: root,
    structuredSchema: { type: "object" },
    extensionContext: extensionContext as never,
  });

  assert.equal(request.ctx, undefined);
  assert.equal(request.agent, "workflow-controller");
  assert.equal(request.timeoutMs, 60 * 60 * 1000);
  assert.equal(request.result.schema.type, "object");
  assert.equal("logExecutionId" in request, false);
  assert.deepEqual(result, {
    status: "completed",
    runId: "run-controller",
    error: undefined,
    value: { decision: "COMPLETE" },
    usage: { input: 11, output: 7, cacheRead: 3, cacheWrite: 1, total: 22 },
  });
  const log = await readFile(workflowRunLogPath(root, "workflow"), "utf8");
  const rows = log.trim().split("\n").map((line) => JSON.parse(line) as Record<string, unknown>);
  assert.deepEqual(rows.map((row) => row.event), ["agent_started", "agent_completed"]);
  assert.equal(rows[1]?.inputTokens, 11);
  assert.equal(rows[1]?.outputTokens, 7);
  assert.equal(rows[1]?.totalTokens, 22);
  assert.equal(log.includes("derive one operation"), false);
  assert.equal(log.includes("COMPLETE"), false);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
