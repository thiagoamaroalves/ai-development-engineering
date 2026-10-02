import { randomUUID } from "node:crypto";
import { Type } from "typebox";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

import { OrchestrationStop, type AuditSliceInput } from "./contracts.ts";
import { repositoryRoot } from "./git-state.ts";
import { runAuditSlice } from "./orchestrator.ts";
import { runFullWorkflow } from "./full-orchestrator.ts";
import { createDelegator } from "./subagents-client.ts";
import { appendWorkflowRunEvent, safeFailureFields } from "./run-logger.ts";

const inputSchema = Type.Object({
  ticketPath: Type.String({ minLength: 1 }),
  implementationDesignPath: Type.String({ minLength: 1 }),
  ticketSetAuditPath: Type.String({ minLength: 1 }),
  targetHead: Type.String({ pattern: "^[0-9a-fA-F]{40}$" }),
  architectureRequired: Type.Boolean(),
  architectureReason: Type.String(),
  specialistArtifacts: Type.Object({
    conformance: Type.String({ minLength: 1 }),
    behavior: Type.String({ minLength: 1 }),
    design: Type.String({ minLength: 1 }),
    architecture: Type.String({ minLength: 1 }),
  }),
  canonicalAuditPath: Type.String({ minLength: 1 }),
});

export default function workflowOrchestrator(pi: ExtensionAPI): void {
  const delegate = createDelegator(pi);
  pi.registerCommand("workflow-status", {
    description: "Show the installed repository workflow orchestration entry points",
    handler: async (_args, ctx) => {
      ctx.ui.notify(
        "Workflow orchestrator loaded: /workflow-status, workflow_orchestrate, workflow_audit_implemented_ticket",
        "info",
      );
    },
  });
  pi.registerTool({
    name: "workflow_audit_implemented_ticket",
    label: "Audit Implemented Ticket",
    description:
      "Execute the independently derived audit-implemented-ticket profile against one pinned semantic state (base HEAD plus a stable working-tree overlay fingerprint). " +
      "The caller must first load the canonical skill and supply its resolved subject/profile. The tool fails closed and never finalizes, remediates, commits, merges, or pushes.",
    promptSnippet: "Run a canonical, independent implemented-ticket audit after loading audit-implemented-ticket",
    promptGuidelines: [
      "Before workflow_audit_implemented_ticket, load audit-implemented-ticket and derive the subject, profile, paths, and pinned HEAD from canonical artifacts.",
      "Never use workflow_audit_implemented_ticket to replace missing authority or to infer UNKNOWN as PASS.",
    ],
    parameters: inputSchema,
    async execute(_toolCallId, params, signal, onUpdate, ctx) {
      const executionId = randomUUID();
      const startedAt = Date.now();
      let root: string | undefined;
      try {
        onUpdate?.({ content: [{ type: "text", text: "Validating canonical state and pinned HEAD…" }], details: undefined });
        root = await repositoryRoot(ctx.cwd);
        await appendWorkflowRunEvent(root, executionId, "workflow_started", {
          operation: "workflow_audit_implemented_ticket",
          targetHead: params.targetHead,
        });
        const result = await runAuditSlice(params as AuditSliceInput, {
          root,
          delegate: (request) => delegate({ ...request, signal, extensionContext: ctx }),
          executionId,
          logExecutionId: executionId,
        });
        await appendWorkflowRunEvent(root, executionId, "workflow_completed", {
          operation: "workflow_audit_implemented_ticket",
          status: "COMPLETE",
          durationMs: Math.max(0, Date.now() - startedAt),
          gateField: "AUDIT_VERDICT",
          gateValue: result.verdict,
          nextOperation: result.nextOperation,
          targetHead: result.runtime.targetHead,
          artifactPaths: [result.canonicalAuditPath],
        });
        return {
          content: [{
            type: "text",
            text: [
              `Canonical audit: ${result.canonicalAuditPath}`,
              `Audit verdict: ${result.verdict}`,
              `Ticket gate: ${result.gate}`,
              `Next authorized operation: ${result.nextOperation}`,
              ...(result.postCheckpointOperation ? [`Post-checkpoint operation: ${result.postCheckpointOperation}`] : []),
              "No ticket state transition, remediation, commit, merge, or push was performed.",
            ].join("\n"),
          }],
          details: result,
        };
      } catch (error) {
        const stop = error instanceof OrchestrationStop
          ? error
          : new OrchestrationStop("SUBAGENT_FAILURE", "Unexpected orchestration failure.", { cause: String(error) });
        if (root) {
          await appendWorkflowRunEvent(root, executionId, "workflow_stopped", {
            operation: "workflow_audit_implemented_ticket",
            durationMs: Math.max(0, Date.now() - startedAt),
            targetHead: params.targetHead,
            ...safeFailureFields(stop),
          });
        }
        return {
          content: [{ type: "text", text: `ORCHESTRATION_STOPPED\nCODE: ${stop.code}\nREASON: ${stop.message}` }],
          details: { stopped: true, code: stop.code, message: stop.message, details: stop.details },
          isError: true,
        };
      }
    },
  });

  pi.registerTool({
    name: "workflow_orchestrate",
    label: "Orchestrate Engineering Workflow",
    description:
      "Continue the repository-defined engineering workflow from canonical state until completion, a blocker, a human gate, or the configured step bound. " +
      "The controller selects the intake operation and handles exceptional recovery; normal gates follow the repository transition catalog, with a read-only preflight before each operation.",
    promptSnippet: "Continue the complete repository-authorized engineering workflow fail-closed",
    promptGuidelines: [
      "Use workflow_orchestrate for the complete engineering workflow; do not manually skip its canonical gates.",
      "Run in the active checkout supplied by the caller, including an already-existing linked worktree; primary-versus-linked status alone is never a blocker. Do not switch branches or create, move, remove, or select another worktree without explicit repository authority.",
      "When workflow_orchestrate stops for a human gate or missing authority, report the stop instead of selecting a convenient fallback.",
    ],
    parameters: Type.Object({
      objective: Type.String({ minLength: 1, maxLength: 4000 }),
      maxSteps: Type.Optional(Type.Integer({ minimum: 1, maximum: 64, default: 32 })),
    }),
    async execute(_toolCallId, params, signal, onUpdate, ctx) {
      try {
        const root = await repositoryRoot(ctx.cwd);
        const result = await runFullWorkflow(
          { objective: params.objective, maxSteps: params.maxSteps ?? 32 },
          {
            root,
            delegate: (request) => delegate({ ...request, signal, extensionContext: ctx }),
            onProgress: (message) => onUpdate?.({ content: [{ type: "text", text: message }], details: undefined }),
          },
        );
        return {
          content: [{ type: "text", text: `WORKFLOW_COMPLETE\nREASON: ${result.reason}\nSTEPS: ${result.steps.length}` }],
          details: result,
        };
      } catch (error) {
        const stop = error instanceof OrchestrationStop
          ? error
          : new OrchestrationStop("SUBAGENT_FAILURE", "Unexpected workflow orchestration failure.", { cause: String(error) });
        return {
          content: [{ type: "text", text: `ORCHESTRATION_STOPPED\nCODE: ${stop.code}\nREASON: ${stop.message}` }],
          details: { stopped: true, code: stop.code, message: stop.message, details: stop.details },
          isError: true,
        };
      }
    },
  });
}
