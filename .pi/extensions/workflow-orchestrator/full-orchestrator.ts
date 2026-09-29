import { randomUUID } from "node:crypto";
import { access, readFile } from "node:fs/promises";
import { relative, resolve, sep } from "node:path";

import { OrchestrationStop, type AuditSliceInput, type DelegationRequest, type DelegationResult } from "./contracts.ts";
import { assertCheckpointAdvance, assertPinnedHead, currentHead, workspaceFingerprint } from "./git-state.ts";
import { runAuditSlice } from "./orchestrator.ts";

const planSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "decision",
    "operation",
    "subject",
    "reason",
    "authorityFiles",
    "evidenceFiles",
    "stateFingerprint",
    "executionIsolation",
    "operationInputJson",
  ],
  properties: {
    decision: { enum: ["EXECUTE", "COMPLETE", "BLOCKED", "HUMAN_REQUIRED"] },
    operation: { type: "string" },
    subject: { type: "string" },
    reason: { type: "string" },
    authorityFiles: { type: "array", items: { type: "string" }, maxItems: 32 },
    evidenceFiles: { type: "array", items: { type: "string" }, maxItems: 64 },
    stateFingerprint: { type: "string", minLength: 1, maxLength: 4096 },
    executionIsolation: { enum: ["main", "worktree", "human_required"] },
    operationInputJson: { type: "string", maxLength: 65536 },
  },
} as const;

export interface FullWorkflowInput {
  objective: string;
  maxSteps: number;
}

export interface WorkflowPlan {
  decision: "EXECUTE" | "COMPLETE" | "BLOCKED" | "HUMAN_REQUIRED";
  operation: string;
  subject: string;
  reason: string;
  authorityFiles: string[];
  evidenceFiles: string[];
  stateFingerprint: string;
  executionIsolation: "main" | "worktree" | "human_required";
  operationInputJson: string;
}

export interface FullWorkflowDependencies {
  root: string;
  delegate(request: DelegationRequest): Promise<DelegationResult>;
  onProgress?(message: string): void;
}

export interface WorkflowStepRecord {
  step: number;
  operation: string;
  subject: string;
  authorityFiles: string[];
  evidenceFiles: string[];
  result: string;
}

export interface FullWorkflowResult {
  executionId: string;
  status: "COMPLETE";
  reason: string;
  steps: WorkflowStepRecord[];
}

const WORKFLOW_PLAN_KEYS = [
  "decision",
  "operation",
  "subject",
  "reason",
  "authorityFiles",
  "evidenceFiles",
  "stateFingerprint",
  "executionIsolation",
  "operationInputJson",
] as const;

function workflowPlanIssues(value: unknown): string[] {
  if (!value || typeof value !== "object") {
    return [`response must be an object; received ${value === undefined ? "undefined" : typeof value}`];
  }
  const item = value as Record<string, unknown>;
  const issues: string[] = [];
  const missing = WORKFLOW_PLAN_KEYS.filter((key) => !(key in item));
  if (missing.length) issues.push(`missing fields: ${missing.join(", ")}`);
  if (!["EXECUTE", "COMPLETE", "BLOCKED", "HUMAN_REQUIRED"].includes(String(item.decision))) {
    issues.push("decision must be EXECUTE, COMPLETE, BLOCKED, or HUMAN_REQUIRED");
  }
  if (typeof item.operation !== "string") issues.push("operation must be a string");
  if (typeof item.subject !== "string") issues.push("subject must be a string");
  if (typeof item.reason !== "string") issues.push("reason must be a string");
  if (!Array.isArray(item.authorityFiles)) issues.push("authorityFiles must be an array");
  if (!Array.isArray(item.evidenceFiles)) issues.push("evidenceFiles must be an array");
  if (typeof item.stateFingerprint !== "string") issues.push("stateFingerprint must be a string");
  if (!["main", "worktree", "human_required"].includes(String(item.executionIsolation))) {
    issues.push("executionIsolation must be main, worktree, or human_required");
  }
  if (typeof item.operationInputJson !== "string") issues.push("operationInputJson must be a string");
  return issues;
}

function controllerResponsePreview(value: unknown): string {
  try {
    const encoded = JSON.stringify(value);
    if (encoded === undefined) return "undefined";
    return encoded.length > 2048 ? `${encoded.slice(0, 2048)}…` : encoded;
  } catch (error) {
    return `<unserializable response: ${String(error)}>`;
  }
}

function controllerResponseKeys(value: unknown): string[] {
  if (!value || typeof value !== "object" || Array.isArray(value)) return [];
  return Object.keys(value as Record<string, unknown>);
}

function controllerHistorySummary(previous: WorkflowStepRecord[]): string {
  const last = previous.at(-1);
  return JSON.stringify({
    completedStepCount: previous.length,
    lastCompletedStep: last
      ? { step: last.step, operation: last.operation, subject: last.subject, result: last.result }
      : null,
  });
}

function controllerTask(objective: string, head: string, previous: WorkflowStepRecord[], replanReason = ""): string {
  return [
    "Determine exactly one next authorized workflow operation from current canonical repository state.",
    `Objective/scope: ${objective}`,
    `Current pinned HEAD: ${head}`,
    "The repository skills and their referenced shared contracts are process authority.",
    "Discover applicable skills; read every skill required for this decision completely.",
    "Inspect canonical ADR/SPEC/Gap/Plan/Ticket/audit/remediation/finalization artifacts in the target repository.",
    "Return EXECUTE only when the chosen skill's preconditions and gate are explicitly evidenced.",
    "Return HUMAN_REQUIRED for an authorized confirmation/choice; BLOCKED for missing or conflicting authority/evidence; COMPLETE only for a canonical terminal state.",
    "Do not use console history or this prompt as canonical state. Do not modify files.",
    "Read skills/_shared/workflow-execution-topology-contract.md. For authorized ticket implementation/remediation/review in this repository, executionIsolation must be main under its guards; select worktree only when an explicit allocation/merge protocol is cited. Never infer a worktree policy.",
    "For operation audit-implemented-ticket, operationInputJson must encode the full AuditSliceInput expected by workflow_audit_implemented_ticket.",
    "For checkpoint operations, operationInputJson must contain phaseManifestPath, and phaseManifestPath must not be listed in evidenceFiles because it may be created by the checkpoint agent. Phase manifests are phase-scoped and HEAD-scoped: if an existing manifest target.head or operation differs from the current operation, treat it as historical evidence and derive a new current-head path; never reuse or overwrite it. If the current manifest file does not exist yet, that is not missing authority: the owning checkpoint agent must derive and create it from canonical artifacts, current HEAD, and the exact dirty candidate before validation. For other operations, operationInputJson must be an empty JSON object string unless the canonical skill requires bounded arguments worth preserving.",
    "A completed phase checkpoint creates a new HEAD. On the next controller call, treat that current HEAD as authoritative, refresh the operation input and semantic basis, and do not reuse a pre-checkpoint plan or reject the phase solely because a non-semantic checkpoint overlay changed HEAD.",
    "Read exactly these shared contracts: skills/_shared/interrupted-remediation-recovery-contract.md and skills/_shared/interrupted-artifact-production-recovery-contract.md. Do not invent abbreviated or alternate authority paths. If an external failure left an authorized remediation target dirty while its current actionable source audit remains unchanged and no complete matching remediation report exists, select the owning remediation skill again in RESUME_OR_RECONCILE mode; do not require a checkpoint, do not route to re-audit, and do not treat a candidate ready marker as proof of completion. If an external failure left an authorized Gap Matrix, Plan, or ticket output dirty while its current source audit remains conformant and no complete matching output exists, select the owning producer again in RESUME_OR_RECONCILE mode after checkpointing the source authority; do not route downstream. Once a producer returns its exact complete result, select its generation checkpoint before selecting the independent audit.",
    ...(replanReason ? [`Previous controller plan was rejected and must be replanned: ${replanReason}`] : []),
    `Previously completed orchestration steps (operational history only; canonical artifacts remain authoritative): ${controllerHistorySummary(previous)}`,
  ].join("\n");
}

async function validateSelectedSkill(root: string, operation: string, authorityFiles: string[]): Promise<void> {
  if (!/^[a-z0-9][a-z0-9-]*$/.test(operation)) {
    throw new OrchestrationStop("PROCESS_AUTHORITY_DRIFT", "Controller selected an invalid skill name.", { operation });
  }
  const skillPath = `skills/${operation}/SKILL.md`;
  const text = await readFile(resolve(root, skillPath), "utf8").catch(() => undefined);
  if (!text) throw new OrchestrationStop("MISSING_SKILL", `Selected skill is absent: ${operation}`);
  const declared = text.match(/^name:\s*(.+?)\s*$/m)?.[1];
  if (declared !== operation) {
    throw new OrchestrationStop("PROCESS_AUTHORITY_DRIFT", "Selected skill path and declared name disagree.", {
      operation,
      declared,
    });
  }
  if (!authorityFiles.includes(skillPath)) {
    throw new OrchestrationStop("MISSING_AUTHORITY", "The transition plan did not cite its selected skill as authority.", {
      operation,
      skillPath,
    });
  }
}

async function validateCitedPaths(root: string, paths: string[], kind: "authority" | "evidence"): Promise<void> {
  for (const candidate of paths) {
    const absolute = resolve(root, candidate);
    const rel = relative(root, absolute);
    if (!rel || rel === ".." || rel.startsWith(`..${sep}`) || rel.startsWith(sep)) {
      throw new OrchestrationStop("INVALID_PATH", `Controller cited ${kind} outside the repository.`, { candidate });
    }
    try { await access(absolute); }
    catch {
      throw new OrchestrationStop(
        kind === "authority" ? "MISSING_AUTHORITY" : "INCOMPLETE_CANONICAL_RESULT",
        `Controller cited missing ${kind}: ${candidate}`,
      );
    }
  }
}

async function validateAgent(root: string, agent: string): Promise<void> {
  try { await access(resolve(root, `.pi/agents/${agent}.md`)); }
  catch { throw new OrchestrationStop("MISSING_AGENT", `Required project-local agent is absent: ${agent}`); }
}

const CHECKPOINT_OPERATIONS = new Set([
  "checkpoint-implemented-ticket",
  "checkpoint-governance-workspace",
  "checkpoint-component-spec-audit",
  "checkpoint-component-spec-conformance",
  "checkpoint-component-spec-remediation",
  "checkpoint-component-gap-matrix-generation",
  "checkpoint-component-gap-matrix-audit",
  "checkpoint-component-gap-matrix-conformance",
  "checkpoint-component-gap-matrix-remediation",
  "checkpoint-component-implementation-plan-generation",
  "checkpoint-component-implementation-plan-audit",
  "checkpoint-component-implementation-plan-conformance",
  "checkpoint-component-implementation-plan-remediation",
  "checkpoint-component-implementation-tickets-generation",
  "checkpoint-component-implementation-tickets-audit",
  "checkpoint-component-implementation-tickets-conformance",
  "checkpoint-component-implementation-tickets-remediation",
]);

function isCheckpointOperation(operation: string): boolean {
  return CHECKPOINT_OPERATIONS.has(operation);
}

const IDEMPOTENT_PRODUCER_COMPLETION_MARKERS: Record<string, string> = {
  "generate-component-implementation-gap-matrix": "COMPONENT_IMPLEMENTATION_GAP_MATRIX_COMPLETE",
  "plan-component-implementation": "COMPONENT_IMPLEMENTATION_PLAN_COMPLETE",
  "decompose-component-implementation-plan-into-tickets": "COMPONENT_TICKET_DECOMPOSITION_COMPLETE",
};

const PRODUCER_GENERATION_CHECKPOINTS: Record<string, string> = {
  "generate-component-implementation-gap-matrix": "checkpoint-component-gap-matrix-generation",
  "plan-component-implementation": "checkpoint-component-implementation-plan-generation",
  "decompose-component-implementation-plan-into-tickets": "checkpoint-component-implementation-tickets-generation",
};

function isArtifactProducerOperation(operation: string): boolean {
  return Object.hasOwn(IDEMPOTENT_PRODUCER_COMPLETION_MARKERS, operation);
}

function isIdempotentProducerCompletion(operation: string, value: unknown): boolean {
  const marker = IDEMPOTENT_PRODUCER_COMPLETION_MARKERS[operation];
  return typeof marker === "string" && typeof value === "string" && value.includes(marker);
}

async function assertCanonicalPlanRemediationConsistency(root: string): Promise<void> {
  const planPath = "docs/specs/implementation-plans/SPEC-EXEC-001-implementation-plan.md";
  const checkpointPath = "docs/workflow-checkpoints/SPEC-EXEC-001-component-implementation-plan-remediation.md";
  const plan = await readFile(resolve(root, planPath), "utf8").catch(() => "");
  const checkpoint = await readFile(resolve(root, checkpointPath), "utf8").catch(() => "");
  const values = (text: string, field: string) => [...text.matchAll(new RegExp(`^\\s*${field}\\s*[:=]\\s*(.+?)\\s*$`, "gm"))].map((match) => match[1].trim());
  const gates = [...new Set(values(plan, "IMPLEMENTATION_PLAN_GATE"))];
  const next = [...new Set(values(checkpoint, "NEXT_AUTHORIZED_OPERATION"))];
  const verdict = [...new Set(values(checkpoint, "REMEDIATION_VERDICT"))];
  if (gates.length !== 1 || next.length !== 1 || verdict.length !== 1) {
    throw new OrchestrationStop("CANONICAL_ARTIFACT_CONTRADICTION", "Plan remediation checkpoint has missing or non-singleton routing fields.", {
      planPath,
      checkpointPath,
      implementationPlanGates: gates,
      nextAuthorizedOperations: next,
      remediationVerdicts: verdict,
    });
  }
  if (verdict[0] === "COMPONENT_IMPLEMENTATION_PLAN_REMEDIATION_COMPLETE" && next[0] === "audit-component-implementation-plan" && gates[0] !== "READY_FOR_IMPLEMENTATION_PLAN_AUDIT") {
    throw new OrchestrationStop("CANONICAL_ARTIFACT_CONTRADICTION", "Plan remediation checkpoint routes to audit but the Plan gate is not READY_FOR_IMPLEMENTATION_PLAN_AUDIT.", {
      planPath,
      checkpointPath,
      implementationPlanGate: gates[0],
      nextAuthorizedOperation: next[0],
      remediationVerdict: verdict[0],
    });
  }
}

function executionAgent(operation: string): string {
  if (operation.startsWith("audit-")) return "workflow-independent-auditor";
  if (operation.startsWith("remediate-")) return "workflow-remediator";
  if (operation === "design-ticket-implementation" || operation === "implement-ready-tickets" || operation === "review-implemented-ticket-structure") {
    return "workflow-implementer";
  }
  if (isCheckpointOperation(operation)) return "workflow-checkpoint";
  return "workflow-skill-executor";
}

function defaultPhaseManifestPath(plan: WorkflowPlan, head: string): string {
  const subject = plan.subject.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "phase";
  return `docs/workflow-checkpoints/${subject}-${plan.operation}-${head.slice(0, 12)}-manifest.json`;
}

async function currentManifestMatches(root: string, manifestPath: string, operation: string, head: string): Promise<boolean> {
  try {
    const parsed = JSON.parse(await readFile(resolve(root, manifestPath), "utf8")) as Record<string, unknown>;
    const target = parsed.target as Record<string, unknown> | undefined;
    return parsed.manifestKind === "PHASE_CHECKPOINT" && parsed.operation === operation && target?.head === head;
  } catch {
    return false;
  }
}

async function normalizeCheckpointInput(root: string, plan: WorkflowPlan, head: string): Promise<WorkflowPlan> {
  const evidenceFiles = plan.evidenceFiles.filter((candidate) => !candidate.toLowerCase().endsWith("manifest.json"));
  if (!isCheckpointOperation(plan.operation)) return { ...plan, evidenceFiles };
  let input: Record<string, unknown>;
  try {
    const parsed = JSON.parse(plan.operationInputJson || "{}");
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("operationInputJson must be an object");
    input = parsed as Record<string, unknown>;
  } catch (error) {
    throw new OrchestrationStop("INCOMPLETE_CANONICAL_RESULT", "Checkpoint operationInputJson is not a valid object.", {
      operation: plan.operation,
      cause: String(error),
    });
  }
  const requestedManifestPath = typeof input.phaseManifestPath === "string" && input.phaseManifestPath.trim() !== ""
    ? input.phaseManifestPath
    : undefined;
  const manifestPath = requestedManifestPath && await currentManifestMatches(root, requestedManifestPath, plan.operation, head)
    ? requestedManifestPath
    : defaultPhaseManifestPath(plan, head);
  const absolute = resolve(root, manifestPath);
  const relativePath = relative(root, absolute);
  if (!relativePath || relativePath === ".." || relativePath.startsWith(`..${sep}`) || relativePath.startsWith(sep)) {
    throw new OrchestrationStop("INVALID_PATH", "Phase manifest path escapes the repository.", { manifestPath });
  }
  const normalizedManifestPath = relativePath.split(sep).join("/");
  return {
    ...plan,
    evidenceFiles,
    operationInputJson: JSON.stringify({ ...input, phaseManifestPath: normalizedManifestPath }),
  };
}

function operationTask(plan: WorkflowPlan, head: string): string {
  const checkpoint = isCheckpointOperation(plan.operation);
  return [
    `Execute exactly the canonical skill: ${plan.operation}`,
    `Subject: ${plan.subject}`,
    `Pinned starting HEAD: ${head}`,
    `Controller reason: ${plan.reason}`,
    `Canonical evidence: ${plan.evidenceFiles.join(", ")}`,
    `Bounded arguments: ${plan.operationInputJson}`,
    "Read the complete skill and every referenced contract before acting.",
    "Return only outcomes authorized by that skill. Stop on any missing authority, drift, blocker, or human gate.",
    checkpoint
      ? "A local commit is authorized only under the checkpoint skill's phase-manifest protocol. If phaseManifestPath does not exist, derive and create it from canonical authority and the exact dirty candidate before running verify-phase-manifest; do not merge, push, publish, reset, clean, or perform another workflow phase."
      : "Do not commit, merge, push, publish, delete branches, or perform another workflow phase.",
  ].join("\n");
}

export async function runFullWorkflow(input: FullWorkflowInput, deps: FullWorkflowDependencies): Promise<FullWorkflowResult> {
  const root = resolve(deps.root);
  const executionId = randomUUID();
  const steps: WorkflowStepRecord[] = [];
  const seen = new Set<string>();
  await validateAgent(root, "workflow-controller");

  for (let index = 1; index <= input.maxSteps; index++) {
    const head = await currentHead(root);
    const maxControllerReplans = 3;
    let beforePlan = "";
    let controllerBaselineFingerprint: string | undefined;
    let plan: WorkflowPlan | undefined;
    let replanReason = "";

    for (let attempt = 1; attempt <= maxControllerReplans; attempt++) {
      // A bounded replan is still read-only. Reuse the already validated
      // baseline between attempts and let the post-controller comparison
      // detect any mutation or external workspace drift.
      controllerBaselineFingerprint ??= await workspaceFingerprint(root, new Set());
      beforePlan = controllerBaselineFingerprint;
      deps.onProgress?.(
        attempt === 1
          ? `Deriving authorized operation ${index} from canonical state…`
          : `Replanning authorized operation ${index} after stale controller input…`,
      );
      const planned = await deps.delegate({
        ownerRunId: executionId,
        nodeId: `controller-${index}-attempt-${attempt}`,
        agent: "workflow-controller",
        task: controllerTask(input.objective, head, steps, replanReason),
        cwd: root,
        structuredSchema: planSchema as unknown as Record<string, unknown>,
      });
      const planIssues = workflowPlanIssues(planned.value);
      if (planned.status !== "completed" || planIssues.length) {
        const responseSummary = `status=${planned.status}; runId=${planned.runId ?? "<none>"}; error=${planned.error ?? "<none>"}; issues=${planIssues.length ? planIssues.join(" | ") : "none"}`;
        throw new OrchestrationStop(
          "SUBAGENT_FAILURE",
          `Workflow controller failed or returned an invalid structured decision (${responseSummary}).`,
          {
            status: planned.status,
            runId: planned.runId,
            error: planned.error,
            failureClass: planned.status !== "completed" ? "CONTROLLER_DELEGATION_FAILURE" : "INVALID_WORKFLOW_PLAN",
            planIssues,
            receivedKeys: controllerResponseKeys(planned.value),
            responsePreview: controllerResponsePreview(planned.value),
            controllerNodeId: `controller-${index}-attempt-${attempt}`,
          },
        );
      }
      await assertPinnedHead(root, head);
      const afterControllerFingerprint = await workspaceFingerprint(root, new Set());
      if (beforePlan !== afterControllerFingerprint) {
        throw new OrchestrationStop("TARGET_HEAD_DRIFT", "Read-only workflow controller modified the repository.");
      }
      controllerBaselineFingerprint = afterControllerFingerprint;
      const candidate = planned.value as WorkflowPlan;
      if (![...candidate.authorityFiles, ...candidate.evidenceFiles].every((item) => typeof item === "string")) {
        throw new OrchestrationStop("PROCESS_AUTHORITY_DRIFT", "Controller returned non-string authority or evidence paths.");
      }

      if (candidate.decision === "EXECUTE" && candidate.operation === "audit-implemented-ticket") {
        let auditInput: AuditSliceInput;
        try { auditInput = JSON.parse(candidate.operationInputJson) as AuditSliceInput; }
        catch { throw new OrchestrationStop("INCOMPLETE_CANONICAL_RESULT", "audit-implemented-ticket input is not valid JSON."); }
        if (auditInput.targetHead !== head) {
          replanReason = `audit target ${auditInput.targetHead} differs from current HEAD ${head}; discard the stale plan and rebuild operationInputJson from the current HEAD`;
          if (attempt < maxControllerReplans) continue;
          throw new OrchestrationStop("TARGET_HEAD_DRIFT", "Audit slice target differs from the current controller HEAD after bounded replanning.", {
            expected: head,
            received: auditInput.targetHead,
            attempts: maxControllerReplans,
          });
        }
      }

      plan = await normalizeCheckpointInput(root, candidate, head);
      break;
    }

    if (!plan) {
      throw new OrchestrationStop("TARGET_HEAD_DRIFT", "No current-head workflow plan was produced after bounded replanning.");
    }
    const previousStep = steps.at(-1);
    if (previousStep && isArtifactProducerOperation(plan.operation) && previousStep.operation === plan.operation) {
      throw new OrchestrationStop(
        "AMBIGUOUS_STATE",
        "The same artifact producer was selected again before its generation checkpoint; stop instead of looping.",
        {
          operation: plan.operation,
          previousStep: previousStep.step,
          requiredTransition: PRODUCER_GENERATION_CHECKPOINTS[plan.operation],
        },
      );
    }
    // Controller-reported fingerprints are advisory plan metadata. Loop
    // detection must use the repository state observed immediately before the
    // plan, otherwise a valid artifact-producing operation can change
    // canonical state while the controller repeats an unchanged label.
    const signature = `${head}\n${plan.decision}\n${plan.operation}\n${plan.subject}\n${beforePlan}`;
    if (seen.has(signature)) {
      throw new OrchestrationStop("AMBIGUOUS_STATE", "Workflow controller repeated the same canonical decision without state progress.", {
        operation: plan.operation,
        subject: plan.subject,
      });
    }
    seen.add(signature);

    if (plan.decision === "COMPLETE") return { executionId, status: "COMPLETE", reason: plan.reason, steps };
    if (plan.decision === "HUMAN_REQUIRED" || plan.executionIsolation === "human_required") {
      throw new OrchestrationStop("HUMAN_GATE_REQUIRED", plan.reason, { plan });
    }
    if (plan.decision === "BLOCKED") throw new OrchestrationStop("MISSING_AUTHORITY", plan.reason, { plan });
    if (plan.executionIsolation === "worktree") {
      throw new OrchestrationStop(
        "UNSUPPORTED_EXECUTION_TOPOLOGY",
        "Repository authority requires worktree execution, but this repository defines no worktree allocation/merge protocol.",
        { plan },
      );
    }

    await validateSelectedSkill(root, plan.operation, plan.authorityFiles);
    await validateCitedPaths(root, plan.authorityFiles, "authority");
    await validateCitedPaths(root, plan.evidenceFiles, "evidence");
    deps.onProgress?.(`Executing ${plan.operation} for ${plan.subject}…`);
    if (plan.operation === "audit-implemented-ticket") {
      let auditInput: AuditSliceInput;
      try { auditInput = JSON.parse(plan.operationInputJson) as AuditSliceInput; }
      catch { throw new OrchestrationStop("INCOMPLETE_CANONICAL_RESULT", "audit-implemented-ticket input is not valid JSON."); }
      if (auditInput.targetHead !== head) {
        throw new OrchestrationStop("TARGET_HEAD_DRIFT", "Audit slice target differs from the current controller HEAD.");
      }
      const result = await runAuditSlice(auditInput, { root, delegate: deps.delegate });
      steps.push({
        step: index,
        operation: plan.operation,
        subject: plan.subject,
        authorityFiles: plan.authorityFiles,
        evidenceFiles: plan.evidenceFiles,
        result: `${result.verdict}/${result.gate}`,
      });
    } else {
      await validateAgent(root, executionAgent(plan.operation));
      const result = await deps.delegate({
        ownerRunId: executionId,
        nodeId: `operation-${index}`,
        agent: executionAgent(plan.operation),
        task: operationTask(plan, head),
        cwd: root,
        skill: plan.operation,
      });
      if (result.status !== "completed") {
        throw new OrchestrationStop("SUBAGENT_FAILURE", "Authorized workflow operation failed operationally.", {
          operation: plan.operation,
          status: result.status,
          error: result.error,
        });
      }
      if (isCheckpointOperation(plan.operation)) {
        if (typeof result.value !== "string" || !result.value.includes("CHECKPOINT_COMPLETE")) {
          throw new OrchestrationStop("INCOMPLETE_CANONICAL_RESULT", "Checkpoint agent did not return CHECKPOINT_COMPLETE.", {
            value: result.value,
          });
        }
        if (plan.operation === "checkpoint-component-implementation-plan-remediation") {
          await assertCanonicalPlanRemediationConsistency(root);
        }
      }
      const afterHead = isCheckpointOperation(plan.operation)
        ? await assertCheckpointAdvance(root, head)
        : (await assertPinnedHead(root, head), head);
      const afterOperation = await workspaceFingerprint(root, new Set());
      if (!isCheckpointOperation(plan.operation) && afterOperation === beforePlan && !isIdempotentProducerCompletion(plan.operation, result.value)) {
        throw new OrchestrationStop("INCOMPLETE_CANONICAL_RESULT", "Operation completed without producing canonical repository state change.", {
          operation: plan.operation,
        });
      }
      steps.push({
        step: index,
        operation: plan.operation,
        subject: plan.subject,
        authorityFiles: plan.authorityFiles,
        evidenceFiles: plan.evidenceFiles,
        result: isCheckpointOperation(plan.operation)
          ? `checkpoint-created/${afterHead}`
          : "completed",
      });
    }
  }
  throw new OrchestrationStop("MAX_STEPS_REACHED", "Workflow stopped at the configured step bound without a canonical terminal state.", {
    maxSteps: input.maxSteps,
    steps,
  });
}
