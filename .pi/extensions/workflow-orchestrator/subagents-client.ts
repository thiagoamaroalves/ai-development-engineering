import { randomUUID } from "node:crypto";

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

import type { DelegationRequest, DelegationResult } from "./contracts.ts";
import { OrchestrationStop } from "./contracts.ts";

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
  result?: { kind: "text"; text: string } | { kind: "structured"; value: unknown };
}

export function createDelegator(pi: ExtensionAPI) {
  return async function delegate(input: DelegationRequest): Promise<DelegationResult> {
    const requestId = randomUUID();
    return new Promise<DelegationResult>((resolve, reject) => {
      let settled = false;
      const finish = (fn: () => void) => {
        if (settled) return;
        settled = true;
        unsubscribe();
        input.signal?.removeEventListener("abort", abort);
        fn();
      };
      const abort = () => {
        pi.events.emit(CANCEL, { requestId, ownerRunId: input.ownerRunId, nodeId: input.nodeId });
        finish(() => reject(new OrchestrationStop("SUBAGENT_FAILURE", "Subagent execution was cancelled.", {
          nodeId: input.nodeId,
        })));
      };
      const unsubscribe = pi.events.on(RESPONSE, (payload: unknown) => {
        const response = payload as DelegationResponse;
        if (response.requestId !== requestId) return;
        if (response.ownerRunId && response.ownerRunId !== input.ownerRunId) return;
        if (response.nodeId && response.nodeId !== input.nodeId) return;
        finish(() => resolve({
          status: response.status,
          runId: response.runId,
          error: response.error,
          value: response.result?.kind === "structured" ? response.result.value : response.result?.text,
        }));
      });
      input.signal?.addEventListener("abort", abort, { once: true });
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
