import { randomUUID } from "node:crypto";
import { access, readFile, realpath, readdir } from "node:fs/promises";
import { dirname, relative, resolve, sep } from "node:path";

import {
  ARCHITECTURE_SPECIALIST,
  BASE_SPECIALISTS,
  CONSOLIDATOR,
  OrchestrationStop,
  type AuditSliceInput,
  type DelegationRequest,
  type DelegationResult,
} from "./contracts.ts";
import {
  assertCheckpointAdvance,
  assertPinnedHead,
  currentHead,
  sameWorkflowState,
  workflowStateDiff,
  workflowStateSnapshot,
  loadSemanticFingerprintPolicy,
} from "./git-state.ts";
import { runAuditSlice } from "./orchestrator.ts";
import { createWorkflowResultContext, validateProducedWorkflowResult, type WorkflowResultContext } from "./workflow-lineage.ts";
import {
  loadTransitionCatalog,
  operationReceiptSchema,
  routeOperation,
  validateReceiptShape,
  type OperationReceipt,
  type TransitionCatalog,
} from "./workflow-routing.ts";
import { validateAndCaptureWorkflowBasis, validateControllerEntry, type TransitionBasis, type WorkflowEntryBasis } from "./workflow-preflight.ts";

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
    "entryBasis",
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
    entryBasis: {
      oneOf: [
        { type: "null" },
        {
          type: "object",
          additionalProperties: false,
          required: ["type", "source"],
          properties: {
            type: { const: "transition" },
            source: {
              type: "object",
              additionalProperties: false,
              required: ["operation", "subject", "artifactPath", "gateField", "gateValue"],
              properties: {
                operation: { type: "string", minLength: 1 },
                subject: { type: "string", minLength: 1 },
                artifactPath: { type: "string", minLength: 1 },
                gateField: { type: "string", minLength: 1 },
                gateValue: { type: "string", minLength: 1 },
              },
            },
          },
        },
        {
          type: "object",
          additionalProperties: false,
          required: ["type", "artifactPath"],
          properties: {
            type: { const: "intake" },
            artifactPath: { type: "string", minLength: 1 },
          },
        },
      ],
    },
    executionIsolation: { enum: ["main", "worktree", "human_required"] },
    operationInputJson: { type: "string", maxLength: 65536 },
  },
} as const;

const preflightSchema = {
  type: "object",
  additionalProperties: false,
  required: ["status", "operation", "subject", "head", "checks", "blockers", "resolvedInputJson"],
  properties: {
    status: { enum: ["PASS", "BLOCKED", "HUMAN_REQUIRED"] },
    operation: { type: "string" },
    subject: { type: "string", minLength: 1 },
    head: { type: "string", minLength: 1 },
    checks: {
      type: "object",
      additionalProperties: false,
      required: ["skillPreconditions"],
      properties: {
        skillPreconditions: { enum: ["PASS", "BLOCKED", "HUMAN_REQUIRED"] },
      },
    },
    blockers: { type: "array", items: { type: "string" }, maxItems: 64 },
    resolvedInputJson: { type: "string", maxLength: 65536 },
  },
} as const;

const PREFLIGHT_TIMEOUT_MS = 2 * 60 * 1000;
const WORKFLOW_FRAMEWORK_AUTHORITY = [
  "skills/_shared/workflow-transition-contract.md",
  "skills/_shared/workflow-transitions.json",
  "skills/_shared/workflow-preflight-contract.md",
  "skills/_shared/phase-checkpoint-contract.md",
  "skills/_shared/phase-manifest-contract.md",
  "tools/verify-phase-manifest.mjs",
  "skills/_shared/workflow-execution-topology-contract.md",
  "skills/_shared/interrupted-remediation-recovery-contract.md",
  "skills/_shared/interrupted-artifact-production-recovery-contract.md",
  "skills/_shared/implementation-audit-routing-contract.md",
  "skills/_shared/semantic-fingerprint-policy.json",
];

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
  entryBasis: WorkflowEntryBasis | null;
  executionIsolation: "main" | "worktree" | "human_required";
  operationInputJson: string;
  /** Preserved only when recovery selects the governance checkpoint entry. */
  recoveryOriginOperation?: string;
  /** Set only by the extension for a catalog-routed successor. */
  transitionBasis?: TransitionBasis;
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
  "entryBasis",
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
  const unexpected = Object.keys(item).filter((key) => !(WORKFLOW_PLAN_KEYS as readonly string[]).includes(key));
  if (unexpected.length) issues.push(`unexpected fields: ${unexpected.join(", ")}`);
  if (!["EXECUTE", "COMPLETE", "BLOCKED", "HUMAN_REQUIRED"].includes(String(item.decision))) {
    issues.push("decision must be EXECUTE, COMPLETE, BLOCKED, or HUMAN_REQUIRED");
  }
  if (typeof item.operation !== "string" || (item.decision === "EXECUTE" && item.operation.trim() === "")) {
    issues.push(item.decision === "EXECUTE" ? "operation must be a non-empty string" : "operation must be a string");
  }
  if (typeof item.subject !== "string" || item.subject.trim() === "") issues.push("subject must be a non-empty canonical identifier");
  if (typeof item.reason !== "string") issues.push("reason must be a string");
  if (!Array.isArray(item.authorityFiles)) issues.push("authorityFiles must be an array");
  if (!Array.isArray(item.evidenceFiles)) issues.push("evidenceFiles must be an array");
  if (item.entryBasis !== null && (!item.entryBasis || typeof item.entryBasis !== "object" || Array.isArray(item.entryBasis))) {
    issues.push("entryBasis must be null or a structured entry basis");
  } else if (item.entryBasis && typeof item.entryBasis === "object") {
    const basis = item.entryBasis as Record<string, unknown>;
    if (basis.type === "transition") {
      const source = basis.source;
      if (!source || typeof source !== "object" || Array.isArray(source)) issues.push("transition entryBasis must include a source gate");
      else {
        const gate = source as Record<string, unknown>;
        if (!["operation", "subject", "artifactPath", "gateField", "gateValue"].every((key) => typeof gate[key] === "string" && (gate[key] as string).length > 0)) {
          issues.push("transition entryBasis source must include operation, subject, artifactPath, gateField, and gateValue");
        }
      }
    } else if (basis.type === "intake") {
      if (typeof basis.artifactPath !== "string" || basis.artifactPath.length === 0) issues.push("intake entryBasis must include artifactPath");
    } else issues.push("entryBasis type must be transition or intake");
  }
  if (item.decision !== "EXECUTE" && item.entryBasis !== null) issues.push("non-EXECUTE decisions must set entryBasis to null");
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

function controllerTask(objective: string, head: string, previous: WorkflowStepRecord[], replanReason = "", failedOperation?: string): string {
  return [
    replanReason
      ? "Exceptional recovery call: inspect current canonical state after the stated error and select one authorized recovery operation or stop."
      : "Intake call: select the single authorized entry operation for the requested workflow objective.",
    `Objective/scope: ${objective}`,
    `Current pinned HEAD: ${head}`,
    ...(failedOperation ? [`Operation requiring recovery: ${failedOperation}`] : []),
    "The repository skills and their referenced shared contracts are process authority.",
    "Read skills/_shared/workflow-transition-contract.md and skills/_shared/workflow-transitions.json. Normal transitions after this plan are deterministic; do not plan later steps.",
    "Discover applicable skills; read every skill required for this decision completely.",
    "Inspect canonical ADR/SPEC/Gap/Plan/Ticket/audit/remediation/finalization artifacts in the target repository.",
    "Return EXECUTE only when the chosen skill's preconditions and gate are explicitly evidenced.",
    "Every EXECUTE plan must include entryBasis. Prefer {type: transition, source: {operation, subject, artifactPath, gateField, gateValue}} for an exact catalog edge. Use {type: intake, artifactPath} only for an operation explicitly declared as a direct initial or exceptional recovery entry. The artifactPath must also appear in evidenceFiles. Use null for COMPLETE, BLOCKED, or HUMAN_REQUIRED.",
    "Return HUMAN_REQUIRED for an authorized confirmation/choice; BLOCKED for missing or conflicting authority/evidence; COMPLETE only for a canonical terminal state.",
    "Return the controller plan as the exact structured schema supplied to this task; do not add a state fingerprint or later-step plan.",
    "Do not use console history or this prompt as canonical state. Do not modify files.",
    "Read skills/_shared/workflow-execution-topology-contract.md. For authorized ticket implementation/remediation/review in this repository, executionIsolation must be main under its guards; select worktree only when an explicit allocation/merge protocol is cited. Never infer a worktree policy.",
    "For operation audit-implemented-ticket, operationInputJson must encode the full AuditSliceInput expected by workflow_audit_implemented_ticket.",
    "For checkpoint operations, operationInputJson must contain phaseManifestPath, and phaseManifestPath must not be listed in evidenceFiles because it may be created by the checkpoint agent. Phase manifests are phase-scoped and HEAD-scoped: if an existing manifest target.head or operation differs from the current operation, treat it as historical evidence and derive a new current-head path; never reuse or overwrite it. If the current manifest file does not exist yet, that is not missing authority: the owning checkpoint agent must derive and create it from canonical artifacts, current HEAD, and the exact dirty candidate before validation. For other operations, operationInputJson must be an empty JSON object string unless the canonical skill requires bounded arguments worth preserving.",
    "When invoked for exceptional recovery after a checkpoint, use the live HEAD and rebuild operation input from canonical state; never reuse a stale pre-checkpoint plan.",
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
  await validateCitedPaths(root, [skillPath], "authority");
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
  const canonicalRoot = await realpath(root);
  for (const candidate of paths) {
    const absolute = resolve(root, candidate);
    const rel = relative(root, absolute);
    if (!rel || rel === ".." || rel.startsWith(`..${sep}`) || rel.startsWith(sep)) {
      throw new OrchestrationStop("INVALID_PATH", `Controller cited ${kind} outside the repository.`, { candidate });
    }
    try {
      await access(absolute);
    } catch {
      throw new OrchestrationStop(
        kind === "authority" ? "MISSING_AUTHORITY" : "INCOMPLETE_CANONICAL_RESULT",
        `Controller cited missing ${kind}: ${candidate}`,
      );
    }
    const canonical = await realpath(absolute);
    const canonicalRelative = relative(canonicalRoot, canonical);
    if (canonicalRelative === ".." || canonicalRelative.startsWith(`..${sep}`) || canonicalRelative.startsWith(sep)) {
      throw new OrchestrationStop("INVALID_PATH", `Controller cited ${kind} through a symlink outside the repository.`, { candidate });
    }
  }
}

async function assertPathResolvesInside(root: string, candidate: string): Promise<void> {
  const absolute = resolve(root, candidate);
  const relativePath = relative(root, absolute);
  if (!relativePath || relativePath === ".." || relativePath.startsWith(`..${sep}`) || relativePath.startsWith(sep)) {
    throw new OrchestrationStop("INVALID_PATH", "Workflow path escapes the repository.", { candidate });
  }
  const canonicalRoot = await realpath(root);
  let existingAncestor = absolute;
  while (true) {
    try {
      existingAncestor = await realpath(existingAncestor);
      break;
    } catch {
      const parent = dirname(existingAncestor);
      if (parent === existingAncestor) {
        throw new OrchestrationStop("INVALID_PATH", "Workflow path has no verifiable repository ancestor.", { candidate });
      }
      existingAncestor = parent;
    }
  }
  const canonicalRelative = relative(canonicalRoot, existingAncestor);
  if (canonicalRelative === ".." || canonicalRelative.startsWith(`..${sep}`) || canonicalRelative.startsWith(sep)) {
    throw new OrchestrationStop("INVALID_PATH", "Workflow path resolves through a symlink outside the repository.", { candidate });
  }
}

async function validateAgent(root: string, agent: string): Promise<void> {
  const agentPath = `.pi/agents/${agent}.md`;
  const text = await readFile(resolve(root, agentPath), "utf8").catch(() => undefined);
  if (!text) throw new OrchestrationStop("MISSING_AGENT", `Required project-local agent is absent: ${agent}`, { agentPath });
  await validateCitedPaths(root, [agentPath], "authority");
  const declared = text.match(/^name:\s*(.+?)\s*$/m)?.[1];
  if (declared !== agent) {
    throw new OrchestrationStop("PROCESS_AUTHORITY_DRIFT", "Agent path and declared name disagree.", { agent, agentPath, declared });
  }
}

function isCheckpointOperation(operation: string): boolean {
  return operation.startsWith("checkpoint-");
}

const IDEMPOTENT_PRODUCER_COMPLETION_MARKERS: Record<string, string> = {
  "generate-component-implementation-gap-matrix": "COMPONENT_IMPLEMENTATION_GAP_MATRIX_COMPLETE",
  "plan-component-implementation": "COMPONENT_IMPLEMENTATION_PLAN_COMPLETE",
  "decompose-component-implementation-plan-into-tickets": "COMPONENT_TICKET_DECOMPOSITION_COMPLETE",
};

function isIdempotentProducerCompletion(operation: string, value: unknown): boolean {
  const marker = IDEMPOTENT_PRODUCER_COMPLETION_MARKERS[operation];
  return typeof marker === "string" && typeof value === "string" && value.includes(marker);
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
  await assertPathResolvesInside(root, manifestPath);
  const absolute = resolve(root, manifestPath);
  try {
    const canonicalManifest = await realpath(absolute);
    const parsed = JSON.parse(await readFile(canonicalManifest, "utf8")) as Record<string, unknown>;
    const target = parsed.target as Record<string, unknown> | undefined;
    return parsed.manifestKind === "PHASE_CHECKPOINT" && parsed.operation === operation && target?.head === head;
  } catch (error) {
    if (error instanceof OrchestrationStop) throw error;
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
  await assertPathResolvesInside(root, manifestPath);
  const normalizedManifestPath = relativePath.split(sep).join("/");
  return {
    ...plan,
    evidenceFiles,
    operationInputJson: JSON.stringify({ ...input, phaseManifestPath: normalizedManifestPath }),
  };
}

interface SemanticPreflightResponse {
  status: "PASS" | "BLOCKED" | "HUMAN_REQUIRED";
  operation: string;
  subject: string;
  head: string;
  checks: { skillPreconditions: "PASS" | "BLOCKED" | "HUMAN_REQUIRED" };
  blockers: string[];
  resolvedInputJson: string;
}

function canonicalJson(value: unknown): string {
  const normalize = (current: unknown): unknown => {
    if (Array.isArray(current)) return current.map(normalize);
    if (!current || typeof current !== "object") return current;
    return Object.fromEntries(Object.entries(current as Record<string, unknown>)
      .sort(([left], [right]) => left < right ? -1 : left > right ? 1 : 0)
      .map(([key, child]) => [key, normalize(child)]));
  };
  return JSON.stringify(normalize(value)) ?? "undefined";
}

async function validateAuditSliceInput(root: string, value: unknown, head: string): Promise<AuditSliceInput> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new OrchestrationStop("INCOMPLETE_CANONICAL_RESULT", "Implemented-ticket audit input must be an object.");
  }
  const candidate = value as Record<string, unknown>;
  const requiredKeys = [
    "ticketPath",
    "implementationDesignPath",
    "ticketSetAuditPath",
    "targetHead",
    "architectureRequired",
    "architectureReason",
    "specialistArtifacts",
    "canonicalAuditPath",
  ];
  const actualKeys = Object.keys(candidate);
  if (actualKeys.length !== requiredKeys.length || requiredKeys.some((key) => !(key in candidate))) {
    throw new OrchestrationStop("INCOMPLETE_CANONICAL_RESULT", "Implemented-ticket audit input has missing or unexpected fields.", {
      requiredKeys,
      actualKeys,
    });
  }
  const sourcePaths = [candidate.ticketPath, candidate.implementationDesignPath, candidate.ticketSetAuditPath];
  if (!sourcePaths.every((path) => typeof path === "string" && path.length > 0)
    || candidate.targetHead !== head
    || typeof candidate.architectureRequired !== "boolean"
    || typeof candidate.architectureReason !== "string"
    || (candidate.architectureRequired && candidate.architectureReason.trim() === "")
    || typeof candidate.canonicalAuditPath !== "string" || candidate.canonicalAuditPath.length === 0
    || !candidate.specialistArtifacts || typeof candidate.specialistArtifacts !== "object" || Array.isArray(candidate.specialistArtifacts)) {
    throw new OrchestrationStop("INCOMPLETE_CANONICAL_RESULT", "Implemented-ticket audit input is incomplete or targets a different HEAD.", {
      expectedHead: head,
      receivedHead: candidate.targetHead,
    });
  }
  const specialistArtifacts = candidate.specialistArtifacts as Record<string, unknown>;
  const specialistKeys = ["conformance", "behavior", "design", "architecture"];
  if (Object.keys(specialistArtifacts).length !== specialistKeys.length
    || specialistKeys.some((key) => typeof specialistArtifacts[key] !== "string" || (specialistArtifacts[key] as string).length === 0)) {
    throw new OrchestrationStop("INCOMPLETE_CANONICAL_RESULT", "Implemented-ticket audit specialist artifact paths are incomplete.", {
      specialistKeys,
      receivedKeys: Object.keys(specialistArtifacts),
    });
  }
  const outputPaths = [candidate.canonicalAuditPath as string, ...specialistKeys.map((key) => specialistArtifacts[key] as string)];
  if (new Set(outputPaths).size !== outputPaths.length) {
    throw new OrchestrationStop("INCOMPLETE_CANONICAL_RESULT", "Implemented-ticket audit output paths must be unique.", { outputPaths });
  }
  await validateCitedPaths(root, sourcePaths as string[], "evidence");
  for (const outputPath of outputPaths) await assertPathResolvesInside(root, outputPath);
  return candidate as unknown as AuditSliceInput;
}

async function validateWorkflowCatalog(root: string, catalog: TransitionCatalog): Promise<void> {
  await validateAgent(root, "workflow-controller");
  await validateAgent(root, "workflow-preflight");
  await validateCitedPaths(root, WORKFLOW_FRAMEWORK_AUTHORITY, "authority");
  await loadSemanticFingerprintPolicy(root);
  const internalAuditSkills = new Set<string>([
    ...BASE_SPECIALISTS.map((specialist) => specialist.skill),
    ARCHITECTURE_SPECIALIST.skill,
    CONSOLIDATOR.skill,
  ]);
  const skillDirectories = await readdir(resolve(root, "skills"), { withFileTypes: true });
  const localSkills: string[] = [];
  for (const entry of skillDirectories) {
    if (!entry.isDirectory()) continue;
    try {
      await access(resolve(root, "skills", entry.name, "SKILL.md"));
      localSkills.push(entry.name);
    } catch {
      // Directories without a skill file are not workflow operations.
    }
  }
  const unregisteredSkills = localSkills.filter((operation) => !catalog.operations[operation] && !internalAuditSkills.has(operation));
  const misplacedInternalSkills = localSkills.filter((operation) => catalog.operations[operation] && internalAuditSkills.has(operation));
  const missingInternalSkills = [...internalAuditSkills].filter((operation) => !localSkills.includes(operation));
  if (unregisteredSkills.length || misplacedInternalSkills.length || missingInternalSkills.length) {
    throw new OrchestrationStop("PROCESS_AUTHORITY_DRIFT", "Workflow transition catalog does not cover the complete top-level skill flow.", {
      unregisteredSkills,
      misplacedInternalSkills,
      missingInternalSkills,
    });
  }
  for (const operation of Object.keys(catalog.operations)) {
    const skillPath = `skills/${operation}/SKILL.md`;
    await validateSelectedSkill(root, operation, [skillPath]);
    await validateAgent(root, executionAgent(operation));
  }
  for (const specialist of [...BASE_SPECIALISTS, ARCHITECTURE_SPECIALIST]) {
    await validateSelectedSkill(root, specialist.skill, [`skills/${specialist.skill}/SKILL.md`]);
    await validateAgent(root, specialist.agent);
  }
  await validateSelectedSkill(root, CONSOLIDATOR.skill, [`skills/${CONSOLIDATOR.skill}/SKILL.md`]);
  await validateAgent(root, CONSOLIDATOR.agent);
}

function preflightTask(plan: WorkflowPlan, objective: string, head: string): string {
  return [
    "Assess only semantic skill preconditions that code cannot decide. Do not repeat or override the deterministic checks already completed by the extension. Do not execute the skill or modify files.",
    `Objective: ${objective}`,
    `Operation: ${plan.operation}`,
    `Subject: ${plan.subject}`,
    `Pinned HEAD: ${head}`,
    `Authority files: ${plan.authorityFiles.join(", ")}`,
    `Evidence files: ${plan.evidenceFiles.join(", ")}`,
    `Bounded operation input: ${plan.operationInputJson}`,
    `Deterministic source gate already validated: ${plan.transitionBasis ? `${plan.transitionBasis.operation} ${plan.transitionBasis.gateField}=${plan.transitionBasis.gateValue} in ${plan.transitionBasis.artifactPath}` : "controller intake or exceptional recovery; cited paths and bounded input were validated"}`,
    "Read skills/_shared/workflow-preflight-contract.md and the complete selected skill. Inspect only facts that require semantic interpretation to decide whether the skill can begin safely.",
    "Return only the semantic skillPreconditions check. Do not report code-checked path existence, HEAD, gate fields, route values, changed paths, or JSON shape as your own findings.",
    "Use BLOCKED for unresolved semantic prerequisites and HUMAN_REQUIRED for a semantic decision requiring a person. Include the exact evidence and reason in blockers.",
    "For audit-implemented-ticket, resolve the complete AuditSliceInput from canonical paths and current skill-defined profile. Return it in resolvedInputJson; do not dispatch specialists.",
    "For other operations, return the original bounded JSON input in resolvedInputJson. Do not choose a next operation.",
  ].join("\n");
}

function operationTask(plan: WorkflowPlan, head: string, gateField: string, workflowResult: WorkflowResultContext): string {
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
    "Read skills/_shared/workflow-transition-contract.md. At the end, return the required structured operation receipt using the exact selected operation, current subject, canonical result paths, and exact gate field/value. The receipt does not choose the next operation; the extension routes it from workflow-transitions.json.",
    `The configured gateField for this operation is exactly: ${gateField}. Set gateArtifactPath to the one canonical result artifact whose gate determines this receipt.`,
    "Append one terminal WORKFLOW_RESULT_V2 block to gateArtifactPath. Preserve any earlier WORKFLOW_RESULT_V2 blocks already in that artifact. Copy every identity, predecessor, and BASIS value below exactly, and set GATE_VALUE to the exact persisted gate value:",
    "<!-- WORKFLOW_RESULT_V2",
    `OPERATION = ${plan.operation}`,
    `SUBJECT_ID = ${plan.subject}`,
    `RESULT_ID = ${workflowResult.resultId}`,
    `SUPERSEDES_RESULT_ID = ${workflowResult.supersedesResultId ?? "NONE"}`,
    `GATE_FIELD = ${gateField}`,
    "GATE_VALUE = <exact persisted gate value>",
    `BASIS = ${JSON.stringify(workflowResult.basis ?? { type: "none" })}`,
    "-->",
    "List every repository path changed by this operation in changedPaths. List the canonical current result artifacts in artifactPaths. Use repository-relative forward-slash paths exactly as Git reports them. Status describes execution completeness: use COMPLETE when the skill produced a complete canonical outcome, even if its domain gate routes upstream; use BLOCKED only when no complete result was produced, HUMAN_REQUIRED for a human decision, and PARTIAL or ERROR for interrupted/failed execution.",
    checkpoint
      ? "A local commit is authorized only under the checkpoint skill's phase-manifest protocol. If phaseManifestPath does not exist, derive and create it from canonical authority and the exact dirty candidate before running verify-phase-manifest; do not merge, push, publish, reset, clean, or perform another workflow phase."
      : "Do not commit, merge, push, publish, delete branches, or perform another workflow phase.",
  ].join("\n");
}

async function invokeReadOnlyAgent(
  root: string,
  head: string,
  operation: string,
  delegate: FullWorkflowDependencies["delegate"],
  request: DelegationRequest,
): Promise<DelegationResult> {
  const before = await workflowStateSnapshot(root);
  let result: DelegationResult | undefined;
  let failed = false;
  let failure: unknown;
  try {
    result = await delegate(request);
  } catch (error) {
    failed = true;
    failure = error;
  }
  await assertPinnedHead(root, head);
  const after = await workflowStateSnapshot(root);
  if (!sameWorkflowState(before, after)) {
    throw new OrchestrationStop("TARGET_HEAD_DRIFT", `Read-only ${operation} modified Git-visible workspace state.`, {
      operation,
      changedPaths: observedChangedPaths(workflowStateDiff(before, after)),
    });
  }
  if (failed) throw failure;
  if (!result) throw new OrchestrationStop("SUBAGENT_FAILURE", `Read-only ${operation} returned no delegation result.`, { operation });
  return result;
}

async function validatePreflight(root: string, value: unknown, plan: WorkflowPlan, head: string): Promise<SemanticPreflightResponse> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new OrchestrationStop("INCOMPLETE_CANONICAL_RESULT", "Workflow preflight did not return a structured result.", { operation: plan.operation });
  }
  const result = value as SemanticPreflightResponse;
  const checkKeys = result.checks && typeof result.checks === "object" && !Array.isArray(result.checks)
    ? Object.keys(result.checks)
    : [];
  const semanticCheck = result.checks?.skillPreconditions;
  if (result.operation !== plan.operation || result.subject !== plan.subject || result.head !== head
    || !["PASS", "BLOCKED", "HUMAN_REQUIRED"].includes(result.status)
    || checkKeys.length !== 1 || checkKeys[0] !== "skillPreconditions"
    || !["PASS", "BLOCKED", "HUMAN_REQUIRED"].includes(String(semanticCheck))
    || semanticCheck !== result.status
    || !Array.isArray(result.blockers) || !result.blockers.every((blocker) => typeof blocker === "string")
    || typeof result.resolvedInputJson !== "string") {
    throw new OrchestrationStop("INCOMPLETE_CANONICAL_RESULT", "Workflow preflight response does not match the pinned operation.", {
      operation: plan.operation,
      subject: plan.subject,
      head,
      received: value,
    });
  }
  if (result.status === "HUMAN_REQUIRED") {
    throw new OrchestrationStop("HUMAN_GATE_REQUIRED", result.blockers.join("; ") || "Workflow preflight requires a human decision.", { result });
  }
  if (result.status === "PASS" && result.blockers.length > 0) {
    throw new OrchestrationStop("INCOMPLETE_CANONICAL_RESULT", "Workflow preflight status and blocker list disagree.", {
      operation: plan.operation,
      status: result.status,
      blockers: result.blockers,
    });
  }
  if (result.status === "BLOCKED") {
    throw new OrchestrationStop("MISSING_AUTHORITY", result.blockers.join("; ") || "Workflow preflight blocked before skill execution.", { result });
  }
  try {
    const parsed = JSON.parse(result.resolvedInputJson);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("resolvedInputJson must be an object");
    if (plan.operation === "audit-implemented-ticket") {
      const validated = await validateAuditSliceInput(root, parsed, head);
      const original = await validateAuditSliceInput(root, JSON.parse(plan.operationInputJson), head);
      if (canonicalJson(validated) !== canonicalJson(original)) {
        throw new OrchestrationStop("PROCESS_AUTHORITY_DRIFT", "Preflight changed the pinned implemented-ticket audit input.", {
          original,
          resolved: validated,
        });
      }
    } else {
      const original = JSON.parse(plan.operationInputJson || "{}");
      if (canonicalJson(parsed) !== canonicalJson(original)) {
        throw new OrchestrationStop("PROCESS_AUTHORITY_DRIFT", "Preflight changed the bounded operation input.", {
          operation: plan.operation,
          original,
          resolved: parsed,
        });
      }
    }
  } catch (error) {
    if (error instanceof OrchestrationStop) throw error;
    throw new OrchestrationStop("INCOMPLETE_CANONICAL_RESULT", "Preflight returned invalid bounded operation input.", {
      operation: plan.operation,
      cause: String(error),
    });
  }
  return result;
}

async function runPreflight(
  root: string,
  executionId: string,
  step: number,
  plan: WorkflowPlan,
  objective: string,
  head: string,
  delegate: FullWorkflowDependencies["delegate"],
): Promise<SemanticPreflightResponse> {
  await validateAgent(root, "workflow-preflight");
  const result = await invokeReadOnlyAgent(root, head, "workflow preflight", delegate, {
    ownerRunId: executionId,
    nodeId: `preflight-${step}`,
    agent: "workflow-preflight",
    task: preflightTask(plan, objective, head),
    cwd: root,
    timeoutMs: PREFLIGHT_TIMEOUT_MS,
    structuredSchema: preflightSchema as unknown as Record<string, unknown>,
  });
  if (result.status !== "completed") {
    throw new OrchestrationStop("SUBAGENT_FAILURE", "Read-only workflow preflight failed before the operation started.", {
      operation: plan.operation,
      status: result.status,
      error: result.error,
      runId: result.runId,
    });
  }
  return validatePreflight(root, result.value, plan, head);
}

async function readReceiptArtifacts(root: string, receipt: OperationReceipt): Promise<Map<string, string>> {
  await validateCitedPaths(root, receipt.artifactPaths, "evidence");
  const artifacts = new Map<string, string>();
  for (const path of receipt.artifactPaths) {
    try {
      const absolute = resolve(root, path);
      const rel = relative(root, absolute);
      if (!rel || rel === ".." || rel.startsWith(`..${sep}`) || rel.startsWith(sep)) {
        throw new OrchestrationStop("INVALID_PATH", "Operation receipt cites an artifact outside the repository.", { path });
      }
      artifacts.set(path, await readFile(absolute, "utf8"));
    } catch (error) {
      if (error instanceof OrchestrationStop) throw error;
      throw new OrchestrationStop("INCOMPLETE_CANONICAL_RESULT", "Operation receipt cites a missing canonical artifact.", {
        operation: receipt.operation,
        path,
        cause: String(error),
      });
    }
  }
  return artifacts;
}

function observedChangedPaths(diff: ReturnType<typeof workflowStateDiff>): string[] {
  return [...diff.added, ...diff.modified, ...diff.removed].sort();
}

function samePaths(left: string[], right: string[]): boolean {
  return left.length === right.length && left.every((path, index) => path === right[index]);
}

function successorPlan(
  previous: WorkflowPlan,
  nextOperation: string,
  receipt: OperationReceipt,
  postCheckpointOperation?: string,
): WorkflowPlan {
  const authorityFiles = [...new Set([
    ...previous.authorityFiles,
    `skills/${nextOperation}/SKILL.md`,
  ])];
  const evidenceFiles = [...new Set([...previous.evidenceFiles, ...receipt.artifactPaths])];
  let operationInputJson = "{}";
  if (nextOperation === "checkpoint-implemented-ticket" && previous.operation === "audit-implemented-ticket") {
    operationInputJson = JSON.stringify({ postCheckpointOperation });
  }
  return {
    decision: "EXECUTE",
    operation: nextOperation,
    subject: receipt.subject,
    reason: `Deterministic transition from ${previous.operation} via ${receipt.gateField}=${receipt.gateValue}.`,
    authorityFiles,
    evidenceFiles,
    entryBasis: null,
    executionIsolation: "main",
    operationInputJson,
    transitionBasis: {
      operation: receipt.operation,
      subject: receipt.subject,
      artifactPath: receipt.gateArtifactPath,
      gateField: receipt.gateField,
      gateValue: receipt.gateValue,
    },
  };
}

function shouldRecoverFrom(error: unknown): boolean {
  if (!(error instanceof OrchestrationStop)) return true;
  if (error.code === "MISSING_AUTHORITY" && (error.details.receipt as OperationReceipt | undefined)?.status === "BLOCKED") return false;
  return ["SUBAGENT_FAILURE", "INCOMPLETE_CANONICAL_RESULT", "PROCESS_AUTHORITY_DRIFT", "CANONICAL_ARTIFACT_CONTRADICTION", "AMBIGUOUS_STATE", "DEPENDENCY_NOT_READY", "MISSING_AUTHORITY"].includes(error.code);
}

export async function runFullWorkflow(input: FullWorkflowInput, deps: FullWorkflowDependencies): Promise<FullWorkflowResult> {
  const root = resolve(deps.root);
  const executionId = randomUUID();
  const steps: WorkflowStepRecord[] = [];
  const catalog = await loadTransitionCatalog(root);
  await validateWorkflowCatalog(root, catalog);

  const requestControllerPlan = async (step: number, reason: string, failedOperation?: string): Promise<WorkflowPlan> => {
    await validateAgent(root, "workflow-controller");
    const head = await currentHead(root);
    deps.onProgress?.(reason ? `Recovering workflow route for step ${step}…` : "Selecting the initial workflow operation…");
    const planned = await invokeReadOnlyAgent(root, head, "workflow controller", deps.delegate, {
      ownerRunId: executionId,
      nodeId: reason ? `controller-recovery-${step}` : "controller-intake",
      agent: "workflow-controller",
      task: controllerTask(input.objective, head, steps, reason, failedOperation),
      cwd: root,
      structuredSchema: planSchema as unknown as Record<string, unknown>,
    });
    const planIssues = workflowPlanIssues(planned.value);
    if (planned.status !== "completed" || planIssues.length) {
      const responseSummary = `status=${planned.status}; runId=${planned.runId ?? "<none>"}; error=${planned.error ?? "<none>"}; issues=${planIssues.length ? planIssues.join(" | ") : "none"}`;
      throw new OrchestrationStop("SUBAGENT_FAILURE", `Workflow controller failed or returned an invalid structured decision (${responseSummary}).`, {
        status: planned.status,
        runId: planned.runId,
        error: planned.error,
        planIssues,
        receivedKeys: controllerResponseKeys(planned.value),
        responsePreview: controllerResponsePreview(planned.value),
      });
    }
    const rawCandidate = planned.value as WorkflowPlan;
    if (![...rawCandidate.authorityFiles, ...rawCandidate.evidenceFiles].every((item) => typeof item === "string")) {
      throw new OrchestrationStop("PROCESS_AUTHORITY_DRIFT", "Controller returned non-string authority or evidence paths.");
    }
    const candidate: WorkflowPlan = {
      ...rawCandidate,
      authorityFiles: [...new Set([...rawCandidate.authorityFiles, ...WORKFLOW_FRAMEWORK_AUTHORITY])],
    };
    await validateCitedPaths(root, candidate.authorityFiles, "authority");
    await validateCitedPaths(root, candidate.evidenceFiles, "evidence");
    if (reason && candidate.decision === "COMPLETE") {
      throw new OrchestrationStop("PROCESS_AUTHORITY_DRIFT", "Exceptional recovery cannot declare completion; it must select an authorized operation or stop.", {
        reason,
      });
    }
    if (candidate.decision === "COMPLETE" && candidate.evidenceFiles.length === 0) {
      throw new OrchestrationStop("MISSING_AUTHORITY", "Controller terminal completion must cite canonical evidence.");
    }
    if (candidate.decision === "EXECUTE") {
      if (!catalog.operations[candidate.operation]) {
        throw new OrchestrationStop("PROCESS_AUTHORITY_DRIFT", "Controller selected an operation absent from the deterministic transition catalog.", {
          operation: candidate.operation,
        });
      }
      await validateControllerEntry(
        root,
        catalog,
        candidate.operation,
        candidate.subject,
        candidate.entryBasis,
        candidate.evidenceFiles,
        reason ? "recovery" : "initial",
        failedOperation,
      );
      if (reason && failedOperation) candidate.recoveryOriginOperation = failedOperation;
      await validateSelectedSkill(root, candidate.operation, candidate.authorityFiles);
      if (candidate.operation === "audit-implemented-ticket") {
        try {
          const auditInput = await validateAuditSliceInput(root, JSON.parse(candidate.operationInputJson), head);
          candidate.operationInputJson = JSON.stringify(auditInput);
        } catch (error) {
          if (error instanceof OrchestrationStop) throw error;
          throw new OrchestrationStop("INCOMPLETE_CANONICAL_RESULT", "Controller audit input is incomplete for the current HEAD.", { cause: String(error) });
        }
      }
      return normalizeCheckpointInput(root, candidate, head);
    }
    return candidate;
  };

  let plan = await requestControllerPlan(1, "");
  for (let index = 1; index <= input.maxSteps; index++) {
    const head = await currentHead(root);
    plan = await normalizeCheckpointInput(root, plan, head);
    if (plan.decision === "COMPLETE") return { executionId, status: "COMPLETE", reason: plan.reason, steps };
    if (plan.decision === "HUMAN_REQUIRED" || plan.executionIsolation === "human_required") {
      throw new OrchestrationStop("HUMAN_GATE_REQUIRED", plan.reason, { plan });
    }
    if (plan.decision === "BLOCKED") throw new OrchestrationStop("MISSING_AUTHORITY", plan.reason, { plan });
    if (plan.executionIsolation === "worktree") {
      throw new OrchestrationStop("UNSUPPORTED_EXECUTION_TOPOLOGY", "Repository authority requires worktree execution, but this repository defines no worktree allocation/merge protocol.", { plan });
    }

    const definition = catalog.operations[plan.operation];
    if (!definition) throw new OrchestrationStop("PROCESS_AUTHORITY_DRIFT", "Selected operation has no deterministic transition definition.", { operation: plan.operation });
    await validateSelectedSkill(root, plan.operation, plan.authorityFiles);
    await validateCitedPaths(root, plan.authorityFiles, "authority");
    await validateCitedPaths(root, plan.evidenceFiles, "evidence");
    await validateAgent(root, executionAgent(plan.operation));
    await assertPinnedHead(root, head);

    // Every phase gets a short read-only semantic preflight before its main skill.
    let preflight: SemanticPreflightResponse;
    let workflowResult: WorkflowResultContext;
    try {
      const declaredBasis = plan.transitionBasis
        ? { type: "transition" as const, source: plan.transitionBasis }
        : plan.entryBasis;
      if (!declaredBasis) {
        throw new OrchestrationStop("INCOMPLETE_CANONICAL_RESULT", "Executable workflow plan has no persisted entry basis.", {
          operation: plan.operation,
          subject: plan.subject,
        });
      }
      const capturedBasis = await validateAndCaptureWorkflowBasis(
        root,
        catalog,
        plan.operation,
        plan.subject,
        declaredBasis,
        plan.evidenceFiles,
        plan.recoveryOriginOperation ? "recovery" : "initial",
        plan.recoveryOriginOperation,
      );
      workflowResult = await createWorkflowResultContext(root, plan.operation, plan.subject, `${executionId}:${index}`, capturedBasis);
      preflight = await runPreflight(root, executionId, index, plan, input.objective, head, deps.delegate);
      const confirmedBasis = await validateAndCaptureWorkflowBasis(
        root,
        catalog,
        plan.operation,
        plan.subject,
        declaredBasis,
        plan.evidenceFiles,
        plan.recoveryOriginOperation ? "recovery" : "initial",
        plan.recoveryOriginOperation,
      );
      if (JSON.stringify(confirmedBasis) !== JSON.stringify(capturedBasis)) {
        throw new OrchestrationStop("CANONICAL_ARTIFACT_CONTRADICTION", "Workflow entry basis changed during semantic preflight; the operation was not dispatched.", {
          operation: plan.operation,
          subject: plan.subject,
          capturedBasis,
          confirmedBasis,
        });
      }
    } catch (error) {
      if (!shouldRecoverFrom(error)) throw error;
      const detail = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
      const recovered = await requestControllerPlan(index + 1, `Preflight stopped ${plan.operation} before execution: ${detail}. Select only the same operation when declared resumable, a catalog ancestor with a valid source gate, or the declared governance recovery entry; otherwise stop.`, plan.operation);
      if (recovered.decision === "EXECUTE" && recovered.operation === plan.operation && recovered.subject === plan.subject) throw error;
      steps.push({
        step: index,
        operation: plan.operation,
        subject: plan.subject,
        authorityFiles: plan.authorityFiles,
        evidenceFiles: plan.evidenceFiles,
        result: `preflight-stopped/${detail}`,
      });
      plan = recovered;
      continue;
    }
    plan = { ...plan, operationInputJson: preflight.resolvedInputJson };
    const before = await workflowStateSnapshot(root);
    let receipt: OperationReceipt;
    let postCheckpointOperation: string | undefined;
    let auditSummary = "";
    let requestedRecovery = false;

    try {
      deps.onProgress?.(`Executing ${plan.operation} for ${plan.subject}…`);
      if (plan.operation === "audit-implemented-ticket") {
        let auditInput: AuditSliceInput;
        try { auditInput = JSON.parse(plan.operationInputJson) as AuditSliceInput; }
        catch { throw new OrchestrationStop("INCOMPLETE_CANONICAL_RESULT", "Preflight audit input is not valid JSON."); }
        if (auditInput.targetHead !== head) throw new OrchestrationStop("TARGET_HEAD_DRIFT", "Preflight audit target differs from the current HEAD.");
        const result = await runAuditSlice(auditInput, {
          root,
          delegate: deps.delegate,
          workflowSubject: plan.subject,
          workflowResult,
        });
        postCheckpointOperation = result.postCheckpointOperation;
        auditSummary = `${result.verdict}/${result.gate}`;
        receipt = {
          operation: plan.operation,
          subject: plan.subject,
          status: "COMPLETE",
          artifactPaths: [result.canonicalAuditPath],
          gateArtifactPath: result.canonicalAuditPath,
          gateField: definition.gateField,
          gateValue: result.nextOperation,
          changedPaths: [],
          reason: auditSummary,
        };
      } else {
        const delegated = await deps.delegate({
          ownerRunId: executionId,
          nodeId: `operation-${index}`,
          agent: executionAgent(plan.operation),
          task: operationTask(plan, head, definition.gateField, workflowResult),
          cwd: root,
          skill: plan.operation,
          structuredSchema: operationReceiptSchema(definition),
        });
        if (delegated.status !== "completed") {
          throw new OrchestrationStop("SUBAGENT_FAILURE", "Authorized workflow operation failed operationally.", {
            operation: plan.operation,
            status: delegated.status,
            error: delegated.error,
          });
        }
        receipt = validateReceiptShape(delegated.value, plan.operation, definition.gateField, plan.subject);
      }

      const artifactTexts = await readReceiptArtifacts(root, receipt);
      await validateProducedWorkflowResult(root, {
        operation: receipt.operation,
        subject: receipt.subject,
        resultId: workflowResult.resultId,
        supersedesResultId: workflowResult.supersedesResultId,
        basis: workflowResult.basis ?? { type: "none" },
        gateField: receipt.gateField,
        gateValue: receipt.gateValue,
        artifactPath: receipt.gateArtifactPath,
      });
      const afterHead = isCheckpointOperation(plan.operation)
        ? await assertCheckpointAdvance(root, head)
        : (await assertPinnedHead(root, head), head);
      const after = await workflowStateSnapshot(root);
      const diff = workflowStateDiff(before, after);
      const changedPaths = observedChangedPaths(diff);
      if (!isCheckpointOperation(plan.operation)) {
        const declaredChangedPaths = [...receipt.changedPaths].sort();
        if (!samePaths(changedPaths, declaredChangedPaths)) {
          throw new OrchestrationStop("PROCESS_AUTHORITY_DRIFT", "Operation receipt changedPaths does not match the Git-visible operation diff.", {
            operation: plan.operation,
            declaredChangedPaths,
            observedChangedPaths: changedPaths,
          });
        }
        const isIdempotent = isIdempotentProducerCompletion(plan.operation, receipt.gateValue);
        if (changedPaths.length === 0 && !isIdempotent) {
          throw new OrchestrationStop("INCOMPLETE_CANONICAL_RESULT", "Operation completed without changing a canonical artifact.", { operation: plan.operation });
        }
        if (!isIdempotent && !receipt.artifactPaths.some((path) => changedPaths.includes(path))) {
          throw new OrchestrationStop("INCOMPLETE_CANONICAL_RESULT", "No cited operation result artifact was changed by the operation.", {
            operation: plan.operation,
            artifactPaths: receipt.artifactPaths,
            changedPaths,
          });
        }
      }
      if (!isCheckpointOperation(plan.operation)) receipt = { ...receipt, changedPaths };
      const nextOperation = routeOperation(catalog, receipt, artifactTexts);
      steps.push({
        step: index,
        operation: plan.operation,
        subject: receipt.subject,
        authorityFiles: plan.authorityFiles,
        evidenceFiles: [...new Set([...plan.evidenceFiles, ...receipt.artifactPaths])],
        result: isCheckpointOperation(plan.operation) ? `checkpoint-created/${afterHead}/${receipt.gateValue}` : (auditSummary || `${receipt.status}/${receipt.gateValue}`),
      });

      if (nextOperation === "COMPLETE") {
        return { executionId, status: "COMPLETE", reason: receipt.reason || `${plan.operation} reached its terminal gate.`, steps };
      }
      if (nextOperation === "HUMAN_REQUIRED") {
        throw new OrchestrationStop("HUMAN_GATE_REQUIRED", receipt.reason || `${plan.operation} requires a human decision.`, { receipt });
      }
      if (nextOperation === "RECOVERY_CONTROLLER") {
        requestedRecovery = true;
        const failedOperation = plan.operation === "checkpoint-governance-workspace"
          ? plan.recoveryOriginOperation ?? plan.operation
          : plan.operation;
        plan = await requestControllerPlan(index + 1, `Canonical gate ${receipt.gateField}=${receipt.gateValue} requires exceptional recovery. Select only a valid catalog ancestor, declared resumable operation, or explicit governance recovery entry.`, failedOperation);
      } else {
        plan = successorPlan(plan, nextOperation, receipt, postCheckpointOperation);
      }
    } catch (error) {
      if (requestedRecovery) throw error;
      if (!shouldRecoverFrom(error)) throw error;
      const operationHead = await currentHead(root);
      if (operationHead !== head) {
        if (!isCheckpointOperation(plan.operation)) {
          throw new OrchestrationStop("TARGET_HEAD_DRIFT", "A non-checkpoint operation changed HEAD before exceptional recovery.", {
            operation: plan.operation,
            expectedHead: head,
            actualHead: operationHead,
            cause: error instanceof Error ? error.message : String(error),
          });
        }
        await assertCheckpointAdvance(root, head);
      }
      const detail = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
      steps.push({
        step: index,
        operation: plan.operation,
        subject: plan.subject,
        authorityFiles: plan.authorityFiles,
        evidenceFiles: plan.evidenceFiles,
        result: `recovery-required/${detail}`,
      });
      plan = await requestControllerPlan(index + 1, `The operation did not produce a safely routable complete result: ${detail}. Inspect current canonical state and choose only a valid catalog ancestor, declared resumable operation, or explicit governance recovery entry.`, plan.operation);
    }
  }
  throw new OrchestrationStop("MAX_STEPS_REACHED", "Workflow stopped at the configured step bound without a canonical terminal state.", {
    maxSteps: input.maxSteps,
    steps,
  });
}
