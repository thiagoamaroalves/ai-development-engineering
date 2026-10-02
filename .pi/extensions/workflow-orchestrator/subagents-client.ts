import { randomUUID } from "node:crypto";
import { performance } from "node:perf_hooks";

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

import type { DelegationRequest, DelegationResult } from "./contracts.ts";
import { OrchestrationStop } from "./contracts.ts";
import { appendWorkflowRunEvent } from "./run-logger.ts";

const REQUEST = "prompt-template:subagent:request";
const RESPONSE = "prompt-template:subagent:response";
const CANCEL = "prompt-template:subagent:cancel";
const SUBAGENT_TIMEOUT_MS = 60 * 60 * 1000;
interface DelegationResponse {
  requestId: string;
  ownerRunId?: string;
  nodeId?: string;
  status: string;
  runId?: string;
  error?: string;
  usage?: unknown;
  result?: { kind: "text"; text: string } | { kind: "structured"; value: unknown };
}

function tokenCount(value: unknown): number | undefined {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0 ? value : undefined;
}

function normalizeUsage(value: unknown): DelegationResult["usage"] {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  const source = value as Record<string, unknown>;
  const usage = {
    input: tokenCount(source.input ?? source.inputTokens),
    output: tokenCount(source.output ?? source.outputTokens),
    cacheRead: tokenCount(source.cacheRead ?? source.cacheReadTokens),
    cacheWrite: tokenCount(source.cacheWrite ?? source.cacheWriteTokens),
    total: tokenCount(source.totalTokens ?? source.total),
  };
  return Object.values(usage).some((count) => count !== undefined) ? usage : undefined;
}

function usageLogFields(usage: DelegationResult["usage"]): Record<string, unknown> {
  return {
    usageAvailable: Boolean(usage),
    usageSource: usage ? "delegate-response" : "unavailable",
    ...(usage?.input !== undefined ? { inputTokens: usage.input } : {}),
    ...(usage?.output !== undefined ? { outputTokens: usage.output } : {}),
    ...(usage?.cacheRead !== undefined ? { cacheReadTokens: usage.cacheRead } : {}),
    ...(usage?.cacheWrite !== undefined ? { cacheWriteTokens: usage.cacheWrite } : {}),
    ...(usage?.total !== undefined ? { totalTokens: usage.total } : {}),
  };
}

export function createDelegator(pi: ExtensionAPI) {
  return async function delegate(input: DelegationRequest): Promise<DelegationResult> {
    const requestId = randomUUID();
    const logExecutionId = input.logExecutionId ?? input.ownerRunId;
    const startedAt = performance.now();
    const skill = Array.isArray(input.skill) ? input.skill.join(",") : input.skill;
    await appendWorkflowRunEvent(input.cwd, logExecutionId, "agent_started", {
      ownerRunId: input.ownerRunId,
      nodeId: input.nodeId,
      agent: input.agent,
      skill,
    });
    return new Promise<DelegationResult>((resolve, reject) => {
      let settled = false;
      let unsubscribe = () => {};
      const finish = (event: string, fields: Record<string, unknown>, fn: () => void) => {
        if (settled) return;
        settled = true;
        const cleanup = () => {
          unsubscribe();
          input.signal?.removeEventListener("abort", abort);
          fn();
        };
        void appendWorkflowRunEvent(input.cwd, logExecutionId, event, {
          ownerRunId: input.ownerRunId,
          nodeId: input.nodeId,
          agent: input.agent,
          skill,
          durationMs: Math.max(0, Math.round(performance.now() - startedAt)),
          ...fields,
        }).then(cleanup, cleanup);
      };
      const abort = () => {
        pi.events.emit(CANCEL, { requestId, ownerRunId: input.ownerRunId, nodeId: input.nodeId });
        finish("agent_cancelled", { status: "cancelled" }, () => reject(new OrchestrationStop("SUBAGENT_FAILURE", "Subagent execution was cancelled.", {
          nodeId: input.nodeId,
        })));
      };
      unsubscribe = pi.events.on(RESPONSE, (payload: unknown) => {
        const response = payload as DelegationResponse;
        if (response.requestId !== requestId) return;
        if (response.ownerRunId && response.ownerRunId !== input.ownerRunId) return;
        if (response.nodeId && response.nodeId !== input.nodeId) return;
        const usage = normalizeUsage(response.usage);
        const result: DelegationResult = {
          status: response.status,
          runId: response.runId,
          error: response.error,
          value: response.result?.kind === "structured" ? response.result.value : response.result?.text,
          ...(usage ? { usage } : {}),
        };
        finish(response.status === "completed" ? "agent_completed" : "agent_finished", {
          status: response.status,
          runId: response.runId,
          resultKind: response.result?.kind,
          ...(response.error ? { message: response.error } : {}),
          ...usageLogFields(usage),
        }, () => resolve(result));
      });
      input.signal?.addEventListener("abort", abort, { once: true });
      if (input.signal?.aborted) {
        abort();
        return;
      }
      pi.events.emit(REQUEST, {
        requestId,
        ownerRunId: input.ownerRunId,
        nodeId: input.nodeId,
        agent: input.agent,
        task: input.task,
        context: "fresh",
        cwd: input.cwd,
        timeoutMs: input.timeoutMs ?? SUBAGENT_TIMEOUT_MS,
        artifacts: true,
        skill: input.skill,
        intercomBridge: { mode: "off" },
        result: input.structuredSchema
          ? { kind: "structured", schema: input.structuredSchema }
          : { kind: "text" },
      });
    });
  };
}
