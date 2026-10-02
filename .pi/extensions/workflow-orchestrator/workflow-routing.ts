import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { fieldLast } from "./artifacts.ts";
import { OrchestrationStop } from "./contracts.ts";

export type OperationStatus = "COMPLETE" | "BLOCKED" | "HUMAN_REQUIRED" | "PARTIAL" | "ERROR";

export interface OperationReceipt {
  operation: string;
  subject: string;
  status: OperationStatus;
  artifactPaths: string[];
  gateArtifactPath: string;
  gateField: string;
  gateValue: string;
  changedPaths: string[];
  reason: string;
}

export interface TransitionDefinition {
  gateField: string;
  routes?: Record<string, string>;
  dynamicNext?: boolean;
  allowedNext?: string[];
  assertions?: Record<string, Record<string, string>>;
  requireArtifactGate?: boolean;
}

export interface TransitionCatalog {
  version: 3;
  operations: Record<string, TransitionDefinition>;
  resultAuthority: {
    version: 2;
    root: string;
    block: "WORKFLOW_RESULT_V2";
  };
  controllerEntry: {
    initial: Record<string, { subjectFields: string[]; revisionFields?: string[]; requiredFields?: Record<string, string> }>;
    recovery: Record<string, { subjectFields: string[]; revisionFields?: string[]; requiredFields?: Record<string, string> }>;
    sameOperationResume: string[];
  };
}

const TRANSITION_PATH = "skills/_shared/workflow-transitions.json";
const FAILURE_ATOMIC_RESUMABLE_CHECKPOINTS = new Set([
  "checkpoint-component-implementation-tickets-audit",
  "checkpoint-component-implementation-tickets-remediation",
]);

export async function loadTransitionCatalog(root: string): Promise<TransitionCatalog> {
  try {
    const parsed = JSON.parse(await readFile(resolve(root, TRANSITION_PATH), "utf8")) as Record<string, unknown>;
    if (parsed.version !== 3 || !parsed.operations || typeof parsed.operations !== "object" || Array.isArray(parsed.operations)
      || !parsed.controllerEntry || typeof parsed.controllerEntry !== "object" || Array.isArray(parsed.controllerEntry)) {
      throw new Error("transition catalog must use version 3 and define operations and controllerEntry");
    }
    const rawResultAuthority = parsed.resultAuthority;
    if (!rawResultAuthority || typeof rawResultAuthority !== "object" || Array.isArray(rawResultAuthority)) {
      throw new Error("resultAuthority must be an object");
    }
    const resultAuthority = rawResultAuthority as Record<string, unknown>;
    if (resultAuthority.version !== 2 || resultAuthority.root !== "docs" || resultAuthority.block !== "WORKFLOW_RESULT_V2") {
      throw new Error("resultAuthority must use version 2, root docs, and WORKFLOW_RESULT_V2 blocks");
    }
    const operations: Record<string, TransitionDefinition> = {};
    for (const [operation, raw] of Object.entries(parsed.operations as Record<string, unknown>)) {
      if (!/^[a-z0-9][a-z0-9-]*$/.test(operation) || !raw || typeof raw !== "object" || Array.isArray(raw)) {
        throw new Error(`invalid operation entry: ${operation}`);
      }
      const entry = raw as Record<string, unknown>;
      if (typeof entry.gateField !== "string" || entry.gateField.length === 0) throw new Error(`${operation} has no gateField`);
      if (entry.routes !== undefined && (!entry.routes || typeof entry.routes !== "object" || Array.isArray(entry.routes))) {
        throw new Error(`${operation}.routes must be an object`);
      }
      if (entry.routes && !Object.entries(entry.routes as Record<string, unknown>).every(([gate, target]) => gate.length > 0 && typeof target === "string" && target.length > 0)) {
        throw new Error(`${operation}.routes must map non-empty gates to operation names`);
      }
      if (entry.dynamicNext !== undefined && typeof entry.dynamicNext !== "boolean") throw new Error(`${operation}.dynamicNext must be boolean`);
      if (entry.allowedNext !== undefined && (!Array.isArray(entry.allowedNext) || !entry.allowedNext.every((item) => typeof item === "string"))) {
        throw new Error(`${operation}.allowedNext must be a string array`);
      }
      if (!entry.routes && entry.dynamicNext !== true) throw new Error(`${operation} has no static or dynamic routes`);
      if (entry.dynamicNext === true && (!Array.isArray(entry.allowedNext) || entry.allowedNext.length === 0)) {
        throw new Error(`${operation} dynamicNext requires allowedNext`);
      }
      if (entry.requireArtifactGate !== undefined && typeof entry.requireArtifactGate !== "boolean") {
        throw new Error(`${operation}.requireArtifactGate must be boolean`);
      }
      if (entry.assertions !== undefined && (!entry.assertions || typeof entry.assertions !== "object" || Array.isArray(entry.assertions))) {
        throw new Error(`${operation}.assertions must be an object`);
      }
      operations[operation] = {
        gateField: entry.gateField,
        routes: entry.routes as Record<string, string> | undefined,
        dynamicNext: entry.dynamicNext as boolean | undefined,
        allowedNext: entry.allowedNext as string[] | undefined,
        assertions: entry.assertions as Record<string, Record<string, string>> | undefined,
        requireArtifactGate: entry.requireArtifactGate === true,
      };
    }
    const reservedTargets = new Set(["COMPLETE", "HUMAN_REQUIRED", "RECOVERY_CONTROLLER"]);
    const controllerEntry = parsed.controllerEntry as Record<string, unknown>;
    const parseEntryOperations = (key: "initial" | "recovery"): Record<string, { subjectFields: string[]; revisionFields?: string[]; requiredFields?: Record<string, string> }> => {
      const rawEntries = controllerEntry[key];
      if (!rawEntries || typeof rawEntries !== "object" || Array.isArray(rawEntries)) {
        throw new Error(`controllerEntry.${key} must be an object`);
      }
      const entries: Record<string, { subjectFields: string[]; revisionFields?: string[]; requiredFields?: Record<string, string> }> = {};
      for (const [operation, rawEntry] of Object.entries(rawEntries as Record<string, unknown>)) {
        if (!operations[operation] || !rawEntry || typeof rawEntry !== "object" || Array.isArray(rawEntry)) {
          throw new Error(`controllerEntry.${key}.${operation} is invalid`);
        }
        const entry = rawEntry as Record<string, unknown>;
        if (!Array.isArray(entry.subjectFields) || entry.subjectFields.length === 0
          || !entry.subjectFields.every((field) => typeof field === "string" && /^[A-Za-z][A-Za-z0-9 _-]*$/.test(field))) {
          throw new Error(`controllerEntry.${key}.${operation}.subjectFields must declare exact identity fields`);
        }
        if (entry.revisionFields !== undefined && (!Array.isArray(entry.revisionFields)
          || !entry.revisionFields.every((field) => typeof field === "string" && /^[A-Za-z][A-Za-z0-9 _-]*$/.test(field)))) {
          throw new Error(`controllerEntry.${key}.${operation}.revisionFields must declare exact revision fields`);
        }
        if (entry.requiredFields !== undefined && (!entry.requiredFields || typeof entry.requiredFields !== "object" || Array.isArray(entry.requiredFields)
          || !Object.entries(entry.requiredFields as Record<string, unknown>).every(([field, value]) => field.length > 0 && typeof value === "string"))) {
          throw new Error(`controllerEntry.${key}.${operation}.requiredFields must map field names to string values`);
        }
        entries[operation] = {
          subjectFields: entry.subjectFields as string[],
          revisionFields: entry.revisionFields as string[] | undefined,
          requiredFields: entry.requiredFields as Record<string, string> | undefined,
        };
      }
      return entries;
    };
    const sameOperationResume = controllerEntry.sameOperationResume;
    if (!Array.isArray(sameOperationResume) || !sameOperationResume.every((operation) => typeof operation === "string" && !!operations[operation])) {
      throw new Error("controllerEntry.sameOperationResume must contain registered operation names");
    }
    const initial = parseEntryOperations("initial");
    const recovery = parseEntryOperations("recovery");
    const inbound = new Set<string>();
    for (const [operation, definition] of Object.entries(operations)) {
      const targets = [
        ...Object.values(definition.routes ?? {}),
        ...(definition.dynamicNext ? definition.allowedNext ?? [] : []),
      ];
      const invalid = targets.filter((target) => !reservedTargets.has(target) && !operations[target]);
      if (invalid.length) throw new Error(`${operation} routes to unregistered operation(s): ${invalid.join(", ")}`);
      for (const target of targets) if (operations[target]) inbound.add(target);
    }
    for (const operation of Object.keys(operations)) {
      if (!inbound.has(operation) && !initial[operation] && !recovery[operation]) {
        throw new Error(`${operation} has no incoming transition or declared controller entry`);
      }
    }
    for (const operation of sameOperationResume as string[]) {
      if ((operation.startsWith("checkpoint-") || operation === "checkpoint-governance-workspace")
        && !FAILURE_ATOMIC_RESUMABLE_CHECKPOINTS.has(operation)) {
        throw new Error(`${operation} cannot use same-operation recovery`);
      }
    }
    return {
      version: 3,
      operations,
      resultAuthority: { version: 2, root: "docs", block: "WORKFLOW_RESULT_V2" },
      controllerEntry: { initial, recovery, sameOperationResume: sameOperationResume as string[] },
    };
  } catch (error) {
    throw new OrchestrationStop("MISSING_AUTHORITY", "Workflow transition catalog is missing or invalid.", {
      path: TRANSITION_PATH,
      cause: String(error),
    });
  }
}

export function isAuthorizedRecoveryTarget(catalog: TransitionCatalog, failedOperation: string, candidateOperation: string): boolean {
  if (!catalog.operations[failedOperation] || !catalog.operations[candidateOperation]) return false;
  if (FAILURE_ATOMIC_RESUMABLE_CHECKPOINTS.has(failedOperation)) {
    return candidateOperation === failedOperation
      && FAILURE_ATOMIC_RESUMABLE_CHECKPOINTS.has(failedOperation)
      && catalog.controllerEntry.sameOperationResume.includes(candidateOperation);
  }
  if (failedOperation === candidateOperation) return catalog.controllerEntry.sameOperationResume.includes(candidateOperation);

  const visited = new Set<string>();
  const queue = [candidateOperation];
  while (queue.length > 0) {
    const current = queue.shift()!;
    if (current === failedOperation) return true;
    if (visited.has(current)) continue;
    visited.add(current);
    const definition = catalog.operations[current];
    const next = [
      ...Object.values(definition.routes ?? {}),
      ...(definition.dynamicNext ? definition.allowedNext ?? [] : []),
    ];
    for (const target of next) if (catalog.operations[target] && !visited.has(target)) queue.push(target);
  }
  return false;
}

export function operationReceiptSchema(definition: TransitionDefinition): Record<string, unknown> {
  const knownGateValues = [...new Set([
    ...Object.keys(definition.routes ?? {}),
    ...(definition.dynamicNext ? definition.allowedNext ?? [] : []),
  ])];
  return {
    type: "object",
    additionalProperties: false,
    required: ["operation", "subject", "status", "artifactPaths", "gateArtifactPath", "gateField", "gateValue", "changedPaths", "reason"],
    properties: {
      operation: { type: "string", minLength: 1, maxLength: 120 },
      subject: { type: "string", minLength: 1, maxLength: 240 },
      status: { enum: ["COMPLETE", "BLOCKED", "HUMAN_REQUIRED", "PARTIAL", "ERROR"] },
      artifactPaths: { type: "array", items: { type: "string", minLength: 1 }, maxItems: 64 },
      gateArtifactPath: { type: "string", maxLength: 1024 },
      gateField: { type: "string", minLength: 1, maxLength: 80 },
      gateValue: { enum: [...knownGateValues, ""] },
      changedPaths: { type: "array", items: { type: "string", minLength: 1 }, maxItems: 128 },
      reason: { type: "string", maxLength: 4000 },
    },
  };
}

export function validateReceiptShape(value: unknown, operation: string, expectedGateField: string, expectedSubject: string): OperationReceipt {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new OrchestrationStop("INCOMPLETE_CANONICAL_RESULT", "Workflow operation did not return a structured receipt.", { operation });
  }
  const receipt = value as Record<string, unknown>;
  const stringArray = (item: unknown): item is string[] => Array.isArray(item) && item.every((entry) => typeof entry === "string");
  const statuses: OperationStatus[] = ["COMPLETE", "BLOCKED", "HUMAN_REQUIRED", "PARTIAL", "ERROR"];
  const issues: string[] = [];
  const complete = receipt.status === "COMPLETE";
  if (receipt.operation !== operation) issues.push("operation");
  if (receipt.subject !== expectedSubject) issues.push("subject");
  if (!statuses.includes(receipt.status as OperationStatus)) issues.push("status");
  if (!stringArray(receipt.artifactPaths) || (complete && receipt.artifactPaths.length === 0)) issues.push("artifactPaths");
  if (typeof receipt.gateArtifactPath !== "string") issues.push("gateArtifactPath");
  else if (complete && receipt.gateArtifactPath.trim() === "") issues.push("gateArtifactPath");
  else if (receipt.gateArtifactPath !== "" && stringArray(receipt.artifactPaths)
    && !receipt.artifactPaths.includes(receipt.gateArtifactPath)) issues.push("gateArtifactPath:not-in-artifactPaths");
  if (receipt.gateField !== expectedGateField) issues.push("gateField");
  if (typeof receipt.gateValue !== "string" || (complete && receipt.gateValue.trim() === "")) issues.push("gateValue");
  else if (!complete && receipt.gateValue.trim() !== "" && receipt.gateArtifactPath === "") issues.push("gateValue:missing-artifact");
  if (!stringArray(receipt.changedPaths)) issues.push("changedPaths");
  if (typeof receipt.reason !== "string") issues.push("reason");
  if (issues.length > 0) {
    throw new OrchestrationStop("INCOMPLETE_CANONICAL_RESULT", `Workflow operation receipt has missing or contradictory fields: ${issues.join(",") || "unknown"}; receivedKeys=${Object.keys(receipt).sort().join(",")}.`, {
      operation,
      expectedSubject,
      expectedGateField,
      received: receipt,
    });
  }
  return receipt as unknown as OperationReceipt;
}

export function routeOperation(catalog: TransitionCatalog, receipt: OperationReceipt, artifacts: Map<string, string>): string {
  const definition = catalog.operations[receipt.operation];
  if (!definition) throw new OrchestrationStop("PROCESS_AUTHORITY_DRIFT", "Operation is absent from the transition catalog.", { operation: receipt.operation });
  if (receipt.status === "BLOCKED") throw new OrchestrationStop("MISSING_AUTHORITY", receipt.reason || `${receipt.operation} is blocked.`, { receipt });
  if (receipt.status === "HUMAN_REQUIRED") throw new OrchestrationStop("HUMAN_GATE_REQUIRED", receipt.reason || `${receipt.operation} requires a human decision.`, { receipt });
  if (receipt.status === "PARTIAL" || receipt.status === "ERROR") {
    throw new OrchestrationStop("SUBAGENT_FAILURE", receipt.reason || `${receipt.operation} ended ${receipt.status}.`, { receipt });
  }

  const gateText = artifacts.get(receipt.gateArtifactPath);
  if (gateText === undefined) throw new OrchestrationStop("INCOMPLETE_CANONICAL_RESULT", "Gate artifact is not included in artifactPaths.", {
    operation: receipt.operation,
    gateArtifactPath: receipt.gateArtifactPath,
  });
  const artifactGateValue = definition.gateField === "$marker"
    ? (gateText.includes(receipt.gateValue) ? receipt.gateValue : undefined)
    : fieldLast(gateText, definition.gateField);
  if (artifactGateValue === undefined) {
    throw new OrchestrationStop("INCOMPLETE_CANONICAL_RESULT", "The gate is not persisted in its cited canonical artifact.", {
      operation: receipt.operation,
      gateField: definition.gateField,
      gateValue: receipt.gateValue,
      gateArtifactPath: receipt.gateArtifactPath,
    });
  }
  if (artifactGateValue !== receipt.gateValue) {
    throw new OrchestrationStop("CANONICAL_ARTIFACT_CONTRADICTION", "Structured receipt does not match the latest gate in its canonical artifact.", {
      operation: receipt.operation,
      gateField: definition.gateField,
      receiptValue: receipt.gateValue,
      artifactValue: artifactGateValue,
    });
  }
  for (const [fieldName, expected] of Object.entries(definition.assertions?.[receipt.gateValue] ?? {})) {
    const actual = fieldLast(gateText, fieldName);
    if (actual !== expected) {
      throw new OrchestrationStop("CANONICAL_ARTIFACT_CONTRADICTION", "A required companion gate disagrees with the routed verdict.", {
        operation: receipt.operation,
        gateValue: receipt.gateValue,
        fieldName,
        expected,
        actual,
      });
    }
  }

  const staticTarget = definition.routes?.[receipt.gateValue];
  if (staticTarget) return staticTarget;
  if (definition.dynamicNext && definition.allowedNext?.includes(receipt.gateValue)) return receipt.gateValue;
  throw new OrchestrationStop("PROCESS_AUTHORITY_DRIFT", "Workflow gate has no authorized transition.", {
    operation: receipt.operation,
    gateField: receipt.gateField,
    gateValue: receipt.gateValue,
  });
}
