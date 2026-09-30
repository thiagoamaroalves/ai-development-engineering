import { access, readFile, realpath } from "node:fs/promises";
import { relative, resolve, sep } from "node:path";

import { fieldLast, fieldValues } from "./artifacts.ts";
import { OrchestrationStop } from "./contracts.ts";
import { isAuthorizedRecoveryTarget, routeOperation, type OperationReceipt, type TransitionCatalog } from "./workflow-routing.ts";
import {
  createIntakeWorkflowBasis,
  createTransitionWorkflowBasis,
  resolveCurrentWorkflowResult,
  validateCurrentWorkflowBasis,
  type WorkflowResultBasis,
} from "./workflow-lineage.ts";

export interface TransitionBasis {
  operation: string;
  subject: string;
  artifactPath: string;
  gateField: string;
  gateValue: string;
}

export type WorkflowEntryBasis =
  | { type: "transition"; source: TransitionBasis }
  | { type: "intake"; artifactPath: string };

export async function validateAndCaptureWorkflowBasis(
  root: string,
  catalog: TransitionCatalog,
  targetOperation: string,
  targetSubject: string,
  basis: WorkflowEntryBasis,
  evidenceFiles: string[],
  mode: "initial" | "recovery",
  failedOperation?: string,
): Promise<WorkflowResultBasis> {
  await validateControllerEntry(root, catalog, targetOperation, targetSubject, basis, evidenceFiles, mode, failedOperation);
  if (basis.type === "transition") {
    const source = await resolveCurrentWorkflowResult(root, basis.source.operation, basis.source.subject);
    if (!source || source.artifactPath !== normalizeEvidencePath(basis.source.artifactPath)
      || source.gateField !== basis.source.gateField || source.gateValue !== basis.source.gateValue) {
      throw new OrchestrationStop("CANONICAL_ARTIFACT_CONTRADICTION", "Workflow transition source changed after preflight validation.", {
        operation: basis.source.operation,
        subject: basis.source.subject,
        citedArtifactPath: basis.source.artifactPath,
        currentSource: source,
      });
    }
    return createTransitionWorkflowBasis(root, source);
  }

  const entryPolicy = catalog.controllerEntry[mode][targetOperation];
  if (!entryPolicy) {
    throw new OrchestrationStop("PROCESS_AUTHORITY_DRIFT", `Operation ${targetOperation} has no declared ${mode} intake route.`, {
      operation: targetOperation,
      mode,
    });
  }
  const fields = [...entryPolicy.subjectFields, ...(entryPolicy.revisionFields ?? []), ...Object.keys(entryPolicy.requiredFields ?? {})];
  return createIntakeWorkflowBasis(root, [{ artifactPath: basis.artifactPath, fields }]);
}

export async function validateControllerEntry(
  root: string,
  catalog: TransitionCatalog,
  targetOperation: string,
  targetSubject: string,
  basis: WorkflowEntryBasis | null,
  evidenceFiles: string[],
  mode: "initial" | "recovery",
  failedOperation?: string,
): Promise<void> {
  if (!basis) {
    throw new OrchestrationStop("INCOMPLETE_CANONICAL_RESULT", "Controller-selected operation has no structured entry basis.", {
      operation: targetOperation,
      mode,
    });
  }
  const evidencePaths = new Set(evidenceFiles.map(normalizeEvidencePath));
  const artifactPath = basis.type === "transition" ? basis.source.artifactPath : basis.artifactPath;
  requireWorkflowArtifactPath(catalog, artifactPath, targetOperation);
  if (!evidencePaths.has(normalizeEvidencePath(artifactPath))) {
    throw new OrchestrationStop("MISSING_AUTHORITY", "Controller entry basis artifact is not cited in evidenceFiles.", {
      operation: targetOperation,
      artifactPath,
    });
  }

  if (mode === "recovery") {
    if (!failedOperation) {
      throw new OrchestrationStop("PROCESS_AUTHORITY_DRIFT", "Recovery entry validation has no failed operation context.", { operation: targetOperation });
    }
    if (!isAuthorizedRecoveryTarget(catalog, failedOperation, targetOperation)
      && !(basis.type === "intake" && catalog.controllerEntry.recovery[targetOperation])) {
      throw new OrchestrationStop("PROCESS_AUTHORITY_DRIFT", "Recovery operation is not the failed operation or one of its catalog ancestors.", {
        failedOperation,
        recoveryOperation: targetOperation,
      });
    }
  }

  if (basis.type === "transition") {
    await validateTransitionBasis(root, catalog, targetOperation, targetSubject, basis.source);
    return;
  }

  const entryPolicy = catalog.controllerEntry[mode][targetOperation];
  if (!entryPolicy) {
    throw new OrchestrationStop("PROCESS_AUTHORITY_DRIFT", `Operation ${targetOperation} has no declared ${mode} intake route.`, {
      operation: targetOperation,
      mode,
    });
  }
  const absolute = resolve(root, artifactPath);
  const lexicalRelative = relative(root, absolute);
  if (!lexicalRelative || lexicalRelative === ".." || lexicalRelative.startsWith(`..${sep}`) || lexicalRelative.startsWith(sep)) {
    throw new OrchestrationStop("INVALID_PATH", "Controller entry evidence escapes the repository.", { artifactPath });
  }
  try {
    await access(absolute);
  } catch {
    throw new OrchestrationStop("INCOMPLETE_CANONICAL_RESULT", "Controller entry evidence is missing before the operation starts.", {
      operation: targetOperation,
      artifactPath,
    });
  }
  const [canonicalRoot, canonicalArtifact] = await Promise.all([realpath(root), realpath(absolute)]);
  const canonicalRelative = relative(canonicalRoot, canonicalArtifact);
  if (canonicalRelative === ".." || canonicalRelative.startsWith(`..${sep}`) || canonicalRelative.startsWith(sep)) {
    throw new OrchestrationStop("INVALID_PATH", "Controller entry evidence resolves outside the repository.", { artifactPath });
  }
  const text = await readFile(canonicalArtifact, "utf8");
  const requiredFieldMismatches = Object.entries(entryPolicy.requiredFields ?? {})
    .filter(([field, expected]) => fieldLast(text, field) !== expected)
    .map(([field, expected]) => ({ field, expected, actual: fieldLast(text, field) }));
  const exactSubjectValues = entryPolicy.subjectFields.flatMap((field) => fieldValues(text, field));
  const subjectMismatch = exactSubjectValues.length === 0
    || exactSubjectValues.some((value) => value !== targetSubject);
  if (!text.trim() || subjectMismatch || requiredFieldMismatches.length > 0) {
    throw new OrchestrationStop("CANONICAL_ARTIFACT_CONTRADICTION", "Controller entry evidence is empty or does not bind the selected subject.", {
      operation: targetOperation,
      subject: targetSubject,
      artifactPath,
      subjectFields: entryPolicy.subjectFields,
      actualSubjectValues: exactSubjectValues,
      requiredFieldMismatches,
    });
  }
}

function normalizeEvidencePath(path: string): string {
  return path.replaceAll("\\", "/").replace(/^\.\//, "");
}

export async function validateTransitionBasis(
  root: string,
  catalog: TransitionCatalog,
  targetOperation: string,
  targetSubject: string,
  basis: TransitionBasis,
): Promise<string> {
  const definition = catalog.operations[basis.operation];
  if (!definition || definition.gateField !== basis.gateField) {
    throw new OrchestrationStop("PROCESS_AUTHORITY_DRIFT", "Transition basis does not match its registered source operation.", {
      sourceOperation: basis.operation,
      configuredGateField: definition?.gateField,
      receivedGateField: basis.gateField,
    });
  }
  if (basis.subject !== targetSubject) {
    throw new OrchestrationStop("CANONICAL_ARTIFACT_CONTRADICTION", "Transition source and destination subjects differ.", {
      sourceSubject: basis.subject,
      targetSubject,
    });
  }
  requireWorkflowArtifactPath(catalog, basis.artifactPath, targetOperation);

  const absolute = resolve(root, basis.artifactPath);
  const lexicalRelative = relative(root, absolute);
  if (!lexicalRelative || lexicalRelative === ".." || lexicalRelative.startsWith(`..${sep}`) || lexicalRelative.startsWith(sep)) {
    throw new OrchestrationStop("INVALID_PATH", "Transition basis artifact escapes the repository.", { artifactPath: basis.artifactPath });
  }
  try {
    await access(absolute);
  } catch {
    throw new OrchestrationStop("INCOMPLETE_CANONICAL_RESULT", "Transition basis artifact is missing before the next operation starts.", {
      sourceOperation: basis.operation,
      artifactPath: basis.artifactPath,
    });
  }
  const [canonicalRoot, canonicalArtifact] = await Promise.all([realpath(root), realpath(absolute)]);
  const canonicalRelative = relative(canonicalRoot, canonicalArtifact);
  if (canonicalRelative === ".." || canonicalRelative.startsWith(`..${sep}`) || canonicalRelative.startsWith(sep)) {
    throw new OrchestrationStop("INVALID_PATH", "Transition basis artifact resolves outside the repository.", {
      artifactPath: basis.artifactPath,
    });
  }
  const artifactText = await readFile(canonicalArtifact, "utf8");
  await validateCurrentWorkflowBasis(
    root,
    basis.operation,
    targetSubject,
    basis.artifactPath,
    basis.gateField,
    basis.gateValue,
  );
  const actualGate = basis.gateField === "$marker"
    ? (artifactText.includes(basis.gateValue) ? basis.gateValue : undefined)
    : fieldLast(artifactText, basis.gateField);
  if (actualGate !== basis.gateValue) {
    throw new OrchestrationStop("CANONICAL_ARTIFACT_CONTRADICTION", "Transition source artifact no longer carries the gate that authorized the next operation.", {
      sourceOperation: basis.operation,
      gateField: basis.gateField,
      expected: basis.gateValue,
      actual: actualGate,
      artifactPath: basis.artifactPath,
    });
  }

  const receipt: OperationReceipt = {
    operation: basis.operation,
    subject: basis.subject,
    status: "COMPLETE",
    artifactPaths: [basis.artifactPath],
    gateArtifactPath: basis.artifactPath,
    gateField: basis.gateField,
    gateValue: basis.gateValue,
    changedPaths: [],
    reason: "revalidated transition basis",
  };
  const nextOperation = routeOperation(catalog, receipt, new Map([[basis.artifactPath, artifactText]]));
  if (nextOperation !== targetOperation) {
    throw new OrchestrationStop("PROCESS_AUTHORITY_DRIFT", "The current source gate no longer authorizes the selected next operation.", {
      sourceOperation: basis.operation,
      sourceGate: `${basis.gateField}=${basis.gateValue}`,
      expectedTarget: targetOperation,
      actualTarget: nextOperation,
    });
  }
  return nextOperation;
}

function requireWorkflowArtifactPath(catalog: TransitionCatalog, artifactPath: string, targetOperation: string): void {
  const normalized = normalizeEvidencePath(artifactPath);
  const root = `${catalog.resultAuthority.root}/`;
  if (!normalized.startsWith(root) || !normalized.toLowerCase().endsWith(".md")) {
    throw new OrchestrationStop("INVALID_PATH", "Workflow transition and intake evidence must be a Markdown artifact under the configured canonical result root.", {
      operation: targetOperation,
      artifactPath,
      requiredRoot: catalog.resultAuthority.root,
    });
  }
}
