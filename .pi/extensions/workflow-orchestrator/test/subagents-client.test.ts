import assert from "node:assert/strict";
import test from "node:test";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

import { createDelegator } from "../subagents-client.ts";

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
    cwd: "/repo",
    structuredSchema: { type: "object" },
    extensionContext: extensionContext as never,
  });

  assert.equal(request.ctx, undefined);
  assert.equal(request.agent, "workflow-controller");
  assert.equal(request.timeoutMs, 60 * 60 * 1000);
  assert.equal(request.result.schema.type, "object");
  assert.deepEqual(result, {
    status: "completed",
    runId: "run-controller",
    error: undefined,
    value: { decision: "COMPLETE" },
  });
});
