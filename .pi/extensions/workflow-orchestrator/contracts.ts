import type { ExtensionContext } from "@earendil-works/pi-coding-agent";

export const BASE_SPECIALISTS = [
  {
    key: "conformance",
    agent: "workflow-ticket-conformance-auditor",
    skill: "audit-ticket-conformance",
    allowedResults: ["SPECIALIST_CONFORMANCE_PASS", "SPECIALIST_CONFORMANCE_FINDINGS", "SPECIALIST_AUDIT_BLOCKED"] as const,
  },
  {
    key: "behavior",
    agent: "workflow-behavior-auditor",
    skill: "audit-implementation-behavior",
    allowedResults: ["SPECIALIST_BEHAVIOR_PASS", "SPECIALIST_BEHAVIOR_FINDINGS", "SPECIALIST_AUDIT_BLOCKED"] as const,
  },
  {
    key: "design",
    agent: "workflow-design-auditor",
    skill: "audit-implementation-design-conformance",
    allowedResults: ["SPECIALIST_DESIGN_PASS", "SPECIALIST_DESIGN_FINDINGS", "SPECIALIST_AUDIT_BLOCKED"] as const,
  },
] as const;

export const ARCHITECTURE_SPECIALIST = {
  key: "architecture",
  agent: "workflow-architecture-auditor",
  skill: "audit-architecture-boundaries",
  allowedResults: ["SPECIALIST_ARCHITECTURE_PASS", "SPECIALIST_ARCHITECTURE_FINDINGS", "SPECIALIST_AUDIT_BLOCKED"] as const,
} as const;

export const CONSOLIDATOR = {
  agent: "workflow-audit-consolidator",
  skill: "consolidate-implementation-audit",
} as const;

export const CANONICAL_VERDICTS = [
  "TICKET_IMPLEMENTATION_CONFORMANT",
  "TICKET_IMPLEMENTATION_REMEDIATION_REQUIRED",
  "TICKET_IMPLEMENTATION_AUDIT_BLOCKED",
] as const;

export const CANONICAL_GATES = ["READY_FOR_DONE", "NOT_READY_FOR_DONE"] as const;

export type SpecialistKey =
  | (typeof BASE_SPECIALISTS)[number]["key"]
  | typeof ARCHITECTURE_SPECIALIST.key;

export interface AuditSliceInput {
  ticketPath: string;
  implementationDesignPath: string;
  ticketSetAuditPath: string;
  targetHead: string;
  architectureRequired: boolean;
  architectureReason: string;
  specialistArtifacts: Record<SpecialistKey, string>;
  canonicalAuditPath: string;
}

export interface DelegationRequest {
  ownerRunId: string;
  nodeId: string;
  agent: string;
  task: string;
  cwd: string;
  signal?: AbortSignal;
  skill?: string | string[];
  structuredSchema?: Record<string, unknown>;
  /** In-process context supplied by a custom workflow tool invocation. */
  extensionContext?: ExtensionContext;
}

export interface DelegationResult {
  status: string;
  runId?: string;
  error?: string;
  value?: unknown;
}

export interface AuditRuntimeState {
  executionId: string;
  targetHead: string;
  targetStateFingerprint: string;
  specialistRunIds: Partial<Record<SpecialistKey | "consolidation", string>>;
  startedAt: string;
}

export type StopCode =
  | "AMBIGUOUS_STATE"
  | "MISSING_AUTHORITY"
  | "MISSING_SKILL"
  | "MISSING_AGENT"
  | "DEPENDENCY_NOT_READY"
  | "TARGET_HEAD_DRIFT"
  | "SUBAGENT_FAILURE"
  | "INCOMPLETE_SPECIALIST_RESULT"
  | "INCOMPLETE_CANONICAL_RESULT"
  | "HUMAN_GATE_REQUIRED"
  | "PROCESS_AUTHORITY_DRIFT"
  | "CANONICAL_ARTIFACT_CONTRADICTION"
  | "UNSUPPORTED_EXECUTION_TOPOLOGY"
  | "MAX_STEPS_REACHED"
  | "INVALID_PATH";

export class OrchestrationStop extends Error {
  readonly code: StopCode;
  readonly details: Record<string, unknown>;

  constructor(
    code: StopCode,
    message: string,
    details: Record<string, unknown> = {},
  ) {
    super(message);
    this.name = "OrchestrationStop";
    this.code = code;
    this.details = details;
  }
}
