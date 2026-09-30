import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { OrchestrationStop } from "../contracts.ts";
import { isAuthorizedRecoveryTarget, loadTransitionCatalog } from "../workflow-routing.ts";
import { validateAndCaptureWorkflowBasis, validateControllerEntry, validateTransitionBasis, type TransitionBasis } from "../workflow-preflight.ts";
import { createTransitionWorkflowBasis, resolveCurrentWorkflowResult, validateCurrentWorkflowBasis, workflowResultBlock } from "../workflow-lineage.ts";

const repositoryRoot = process.cwd();

async function makeRoot(): Promise<{ root: string; cleanup(): Promise<void> }> {
  const root = await mkdtemp(path.join(os.tmpdir(), "pi-workflow-preflight-"));
  await mkdir(path.join(root, "docs"), { recursive: true });
  return { root, cleanup: () => rm(root, { recursive: true, force: true }) };
}

function basis(overrides: Partial<TransitionBasis> = {}): TransitionBasis {
  return {
    operation: "generate-component-spec-from-portfolio",
    subject: "SPEC-X",
    artifactPath: "docs/source-gate.md",
    gateField: "GATE",
    gateValue: "READY_FOR_SPEC_VALIDATION",
    ...overrides,
  };
}

function resultArtifact(operation: string, subject: string, gateField: string, gateValue: string, resultId = "r1", supersedesResultId: string | null = null): string {
  return [
    `${gateField}: ${gateValue}`,
    workflowResultBlock({ resultId, supersedesResultId }, operation, subject, gateField, gateValue),
    "",
  ].join("\n");
}

test("normal transition preflight rechecks the canonical source gate and successor", async () => {
  const fx = await makeRoot();
  try {
    const catalog = await loadTransitionCatalog(repositoryRoot);
    const artifactPath = "docs/SPEC-X-source-gate.md";
    await writeFile(path.join(fx.root, artifactPath), resultArtifact("generate-component-spec-from-portfolio", "SPEC-X", "GATE", "READY_FOR_SPEC_VALIDATION"));

    await validateTransitionBasis(
      fx.root,
      catalog,
      "audit-component-spec-conformance",
      "SPEC-X",
      basis({ artifactPath }),
    );
  } finally { await fx.cleanup(); }
});

test("normal transition preflight blocks when the source gate changed after routing", async () => {
  const fx = await makeRoot();
  try {
    const catalog = await loadTransitionCatalog(repositoryRoot);
    const artifactPath = "docs/SPEC-X-source-gate.md";
    await writeFile(path.join(fx.root, artifactPath), resultArtifact("generate-component-spec-from-portfolio", "SPEC-X", "GATE", "READY_FOR_SPEC_VALIDATION" ) + "GATE: BLOCKED\n");

    await assert.rejects(
      validateTransitionBasis(fx.root, catalog, "audit-component-spec-conformance", "SPEC-X", basis({ artifactPath })),
      (error: unknown) => error instanceof OrchestrationStop && error.code === "CANONICAL_ARTIFACT_CONTRADICTION",
    );
  } finally { await fx.cleanup(); }
});

test("normal transition preflight rejects a target that is not the source gate's successor", async () => {
  const fx = await makeRoot();
  try {
    const catalog = await loadTransitionCatalog(repositoryRoot);
    const artifactPath = "docs/SPEC-X-source-gate.md";
    await writeFile(path.join(fx.root, artifactPath), resultArtifact("generate-component-spec-from-portfolio", "SPEC-X", "GATE", "READY_FOR_SPEC_VALIDATION"));

    await assert.rejects(
      validateTransitionBasis(fx.root, catalog, "generate-component-implementation-gap-matrix", "SPEC-X", basis({ artifactPath })),
      (error: unknown) => error instanceof OrchestrationStop && error.code === "PROCESS_AUTHORITY_DRIFT",
    );
  } finally { await fx.cleanup(); }
});

test("normal transition preflight rejects a source artifact for a different subject", async () => {
  const fx = await makeRoot();
  try {
    const catalog = await loadTransitionCatalog(repositoryRoot);
    const artifactPath = "docs/SPEC-X-source-gate.md";
    await writeFile(path.join(fx.root, artifactPath), resultArtifact("generate-component-spec-from-portfolio", "SPEC-X", "GATE", "READY_FOR_SPEC_VALIDATION"));

    await assert.rejects(
      validateTransitionBasis(fx.root, catalog, "audit-component-spec-conformance", "SPEC-Y", basis({ artifactPath })),
      (error: unknown) => error instanceof OrchestrationStop && error.code === "CANONICAL_ARTIFACT_CONTRADICTION",
    );
  } finally { await fx.cleanup(); }
});

test("normal transition preflight fails when the source gate artifact is missing", async () => {
  const fx = await makeRoot();
  try {
    const catalog = await loadTransitionCatalog(repositoryRoot);

    await assert.rejects(
      validateTransitionBasis(fx.root, catalog, "audit-component-spec-conformance", "SPEC-X", basis()),
      (error: unknown) => error instanceof OrchestrationStop && error.code === "INCOMPLETE_CANONICAL_RESULT",
    );
  } finally { await fx.cleanup(); }
});

const flowFamilies = [
  {
    family: "portfolio decomposition",
    sourceOperation: "remediate-spec-portfolio-decomposition",
    gateField: "GATE",
    gateValue: "READY_FOR_INDEPENDENT_DECOMPOSITION_REAUDIT",
    targetOperation: "audit-spec-portfolio-decomposition",
    failedOperation: "generate-component-spec-from-portfolio",
    unrelatedFailure: "checkpoint-governance-workspace",
    resumableOperation: "remediate-spec-portfolio-decomposition",
    nonResumableOperation: "checkpoint-component-spec-audit",
  },
  {
    family: "component SPEC",
    sourceOperation: "generate-component-spec-from-portfolio",
    gateField: "GATE",
    gateValue: "READY_FOR_SPEC_VALIDATION",
    targetOperation: "audit-component-spec-conformance",
    failedOperation: "audit-spec-portfolio-conformance",
    unrelatedFailure: "checkpoint-governance-workspace",
    resumableOperation: "remediate-component-spec",
    nonResumableOperation: "checkpoint-component-spec-audit",
  },
  {
    family: "Gap Matrix",
    sourceOperation: "checkpoint-component-gap-matrix-generation",
    gateField: "NEXT_AUTHORIZED_OPERATION",
    gateValue: "audit-component-implementation-gap-matrix",
    targetOperation: "audit-component-implementation-gap-matrix",
    failedOperation: "plan-component-implementation",
    unrelatedFailure: "checkpoint-governance-workspace",
    resumableOperation: "remediate-component-implementation-gap-matrix",
    nonResumableOperation: "checkpoint-component-gap-matrix-audit",
  },
  {
    family: "Implementation Plan",
    sourceOperation: "checkpoint-component-implementation-plan-generation",
    gateField: "NEXT_AUTHORIZED_OPERATION",
    gateValue: "audit-component-implementation-plan",
    targetOperation: "audit-component-implementation-plan",
    failedOperation: "decompose-component-implementation-plan-into-tickets",
    unrelatedFailure: "checkpoint-governance-workspace",
    resumableOperation: "remediate-component-implementation-plan",
    nonResumableOperation: "checkpoint-component-implementation-plan-audit",
  },
  {
    family: "implementation ticket set",
    sourceOperation: "checkpoint-component-implementation-tickets-generation",
    gateField: "NEXT_AUTHORIZED_OPERATION",
    gateValue: "audit-component-implementation-tickets",
    targetOperation: "audit-component-implementation-tickets",
    failedOperation: "design-ticket-implementation",
    unrelatedFailure: "checkpoint-governance-workspace",
    resumableOperation: "remediate-component-implementation-tickets",
    nonResumableOperation: "checkpoint-component-implementation-tickets-audit",
  },
  {
    family: "implemented ticket",
    sourceOperation: "audit-implemented-ticket",
    gateField: "NEXT_AUTHORIZED_OPERATION",
    gateValue: "audit-implemented-ticket",
    targetOperation: "audit-implemented-ticket",
    failedOperation: "finalize-implemented-ticket",
    unrelatedFailure: "checkpoint-governance-workspace",
    resumableOperation: "remediate-implemented-ticket",
    nonResumableOperation: "checkpoint-implemented-ticket",
  },
] as const;

test("every flow family accepts an exact persisted entry gate", async () => {
  const fx = await makeRoot();
  try {
    const catalog = await loadTransitionCatalog(repositoryRoot);
    for (const item of flowFamilies) {
      const artifactPath = `docs/SPEC-X-${item.family.replaceAll(" ", "-")}-entry.md`;
      await writeFile(path.join(fx.root, artifactPath), resultArtifact(item.sourceOperation, "SPEC-X", item.gateField, item.gateValue));
      const entryBasis = {
        type: "transition" as const,
        source: {
          operation: item.sourceOperation,
          subject: "SPEC-X",
          artifactPath,
          gateField: item.gateField,
          gateValue: item.gateValue,
        },
      };
      await assert.doesNotReject(validateControllerEntry(
        fx.root,
        catalog,
        item.targetOperation,
        "SPEC-X",
        entryBasis,
        [artifactPath],
        "initial",
      ), item.family);
      assert.equal(isAuthorizedRecoveryTarget(catalog, item.failedOperation, item.targetOperation), true, item.family);
    }
  } finally { await fx.cleanup(); }
});

test("every flow family rejects a stale entry gate before dispatch", async () => {
  const fx = await makeRoot();
  try {
    const catalog = await loadTransitionCatalog(repositoryRoot);
    for (const item of flowFamilies) {
      const artifactPath = `docs/SPEC-X-${item.family.replaceAll(" ", "-")}-stale-entry.md`;
      await writeFile(path.join(fx.root, artifactPath), resultArtifact(item.sourceOperation, "SPEC-X", item.gateField, "STALE_GATE"));
      await assert.rejects(
        validateControllerEntry(
          fx.root,
          catalog,
          item.targetOperation,
          "SPEC-X",
          {
            type: "transition",
            source: {
              operation: item.sourceOperation,
              subject: "SPEC-X",
              artifactPath,
              gateField: item.gateField,
              gateValue: item.gateValue,
            },
          },
          [artifactPath],
          "initial",
        ),
        (error: unknown) => error instanceof OrchestrationStop && error.code === "CANONICAL_ARTIFACT_CONTRADICTION",
        item.family,
      );
    }
  } finally { await fx.cleanup(); }
});

test("every flow family rejects an older valid result when a newer result supersedes it", async () => {
  const fx = await makeRoot();
  try {
    const catalog = await loadTransitionCatalog(repositoryRoot);
    for (const item of flowFamilies) {
      const family = item.family.replaceAll(" ", "-");
      const oldPath = `docs/SPEC-X-${family}-old.md`;
      const currentPath = `docs/SPEC-X-${family}-current.md`;
      const newerGate = "CURRENT_RESULT_SUPERSEDES_OLD";
      await writeFile(path.join(fx.root, oldPath), resultArtifact(item.sourceOperation, "SPEC-X", item.gateField, item.gateValue, `${family}-r1`));
      await writeFile(path.join(fx.root, currentPath), resultArtifact(item.sourceOperation, "SPEC-X", item.gateField, newerGate, `${family}-r2`, `${family}-r1`));
      await assert.rejects(
        validateControllerEntry(
          fx.root,
          catalog,
          item.targetOperation,
          "SPEC-X",
          {
            type: "transition",
            source: {
              operation: item.sourceOperation,
              subject: "SPEC-X",
              artifactPath: oldPath,
              gateField: item.gateField,
              gateValue: item.gateValue,
            },
          },
          [oldPath],
          "initial",
        ),
        (error: unknown) => error instanceof OrchestrationStop
          && error.code === "CANONICAL_ARTIFACT_CONTRADICTION"
          && /historical or contradictory/.test(error.message),
        item.family,
      );
    }
  } finally { await fx.cleanup(); }
});

test("every flow family rejects downstream results when their upstream lineage is superseded", async () => {
  const fx = await makeRoot();
  try {
    const catalog = await loadTransitionCatalog(repositoryRoot);
    for (const item of flowFamilies) {
      const family = item.family.replaceAll(" ", "-");
      const sourcePath = `docs/SPEC-X-${family}-basis-source.md`;
      const sourceCurrentPath = `docs/SPEC-X-${family}-basis-current.md`;
      const downstreamPath = `docs/SPEC-X-${family}-downstream.md`;
      const sourceResultId = `${family}-basis-r1`;
      await writeFile(path.join(fx.root, sourcePath), resultArtifact(item.sourceOperation, "SPEC-X", item.gateField, item.gateValue, sourceResultId));
      const source = await resolveCurrentWorkflowResult(fx.root, item.sourceOperation, "SPEC-X");
      assert.ok(source, `${item.family} source result exists`);
      const capturedBasis = await createTransitionWorkflowBasis(fx.root, source);
      const targetGateField = catalog.operations[item.targetOperation].gateField;
      const downstreamResultId = `${family}-downstream-r1`;
      const downstreamPredecessor = item.sourceOperation === item.targetOperation ? sourceResultId : null;
      await writeFile(
        path.join(fx.root, downstreamPath),
        `${targetGateField}: CURRENT\n${workflowResultBlock({ resultId: downstreamResultId, supersedesResultId: downstreamPredecessor, basis: capturedBasis }, item.targetOperation, "SPEC-X", targetGateField, "CURRENT")}\n`,
      );
      await validateCurrentWorkflowBasis(fx.root, item.targetOperation, "SPEC-X", downstreamPath, targetGateField, "CURRENT");
      await writeFile(
        path.join(fx.root, sourceCurrentPath),
        resultArtifact(
          item.sourceOperation,
          "SPEC-X",
          item.gateField,
          item.gateValue,
          `${family}-basis-r2`,
          item.sourceOperation === item.targetOperation ? downstreamResultId : sourceResultId,
        ),
      );
      await assert.rejects(
        validateCurrentWorkflowBasis(fx.root, item.targetOperation, "SPEC-X", downstreamPath, targetGateField, "CURRENT"),
        (error: unknown) => error instanceof OrchestrationStop
          && error.code === "CANONICAL_ARTIFACT_CONTRADICTION"
          && (item.sourceOperation === item.targetOperation
            ? /historical or contradictory/.test(error.message)
            : /upstream transition result was superseded/.test(error.message)),
        item.family,
      );
    }
  } finally { await fx.cleanup(); }
});

test("every flow family rejects an entry artifact bound to a different subject", async () => {
  const fx = await makeRoot();
  try {
    const catalog = await loadTransitionCatalog(repositoryRoot);
    for (const item of flowFamilies) {
      const artifactPath = `docs/SPEC-X-${item.family.replaceAll(" ", "-")}-wrong-subject.md`;
      await writeFile(path.join(fx.root, artifactPath), resultArtifact(item.sourceOperation, "SPEC-Y", item.gateField, item.gateValue));
      await assert.rejects(
        validateControllerEntry(
          fx.root,
          catalog,
          item.targetOperation,
          "SPEC-X",
          {
            type: "transition",
            source: {
              operation: item.sourceOperation,
              subject: "SPEC-X",
              artifactPath,
              gateField: item.gateField,
              gateValue: item.gateValue,
            },
          },
          [artifactPath],
          "initial",
        ),
        (error: unknown) => error instanceof OrchestrationStop
          && error.code === "CANONICAL_ARTIFACT_CONTRADICTION"
          && /subject does not match/.test(error.message),
        item.family,
      );
    }
  } finally { await fx.cleanup(); }
});

test("every flow family allows only recovery along its catalog path", async () => {
  const fx = await makeRoot();
  try {
    const catalog = await loadTransitionCatalog(repositoryRoot);
    for (const item of flowFamilies) {
      const artifactPath = `docs/SPEC-X-${item.family.replaceAll(" ", "-")}-recovery.md`;
      await writeFile(path.join(fx.root, artifactPath), resultArtifact(item.sourceOperation, "SPEC-X", item.gateField, item.gateValue));
      const entryBasis = {
        type: "transition" as const,
        source: {
          operation: item.sourceOperation,
          subject: "SPEC-X",
          artifactPath,
          gateField: item.gateField,
          gateValue: item.gateValue,
        },
      };
      await assert.doesNotReject(validateControllerEntry(
        fx.root,
        catalog,
        item.targetOperation,
        "SPEC-X",
        entryBasis,
        [artifactPath],
        "recovery",
        item.failedOperation,
      ), `${item.family} authorized recovery`);
      assert.equal(isAuthorizedRecoveryTarget(catalog, item.unrelatedFailure, item.targetOperation), false, item.family);
      assert.equal(isAuthorizedRecoveryTarget(catalog, item.resumableOperation, item.resumableOperation), true, `${item.family} same-operation resume`);
      assert.equal(isAuthorizedRecoveryTarget(catalog, item.nonResumableOperation, item.nonResumableOperation), false, `${item.family} checkpoint replay`);
      await assert.rejects(
        validateControllerEntry(
          fx.root,
          catalog,
          item.targetOperation,
          "SPEC-X",
          entryBasis,
          [artifactPath],
          "recovery",
          item.unrelatedFailure,
        ),
        (error: unknown) => error instanceof OrchestrationStop
          && error.code === "PROCESS_AUTHORITY_DRIFT"
          && /not the failed operation or one of its catalog ancestors/.test(error.message),
        `${item.family} unrelated recovery`);
    }
  } finally { await fx.cleanup(); }
});

test("direct portfolio intake requires declared operation, cited evidence, and subject binding", async () => {
  const fx = await makeRoot();
  try {
    const catalog = await loadTransitionCatalog(repositoryRoot);
    const artifactPath = "docs/SPEC-PORTFOLIO-001-portfolio-under-audit.md";
    await writeFile(path.join(fx.root, artifactPath), "id: SPEC-PORTFOLIO-001\nrevision: 2\nSPEC-PORTFOLIO-001 decomposition\n");
    await validateControllerEntry(
      fx.root,
      catalog,
      "audit-spec-portfolio-decomposition",
      "SPEC-PORTFOLIO-001",
      { type: "intake", artifactPath },
      [artifactPath],
      "initial",
    );
    const capturedBasis = await validateAndCaptureWorkflowBasis(
      fx.root,
      catalog,
      "audit-spec-portfolio-decomposition",
      "SPEC-PORTFOLIO-001",
      { type: "intake", artifactPath },
      [artifactPath],
      "initial",
    );
    assert.equal(capturedBasis.type, "intake");
    if (capturedBasis.type === "intake") assert.deepEqual(capturedBasis.artifacts[0].fields.REVISION, ["2"]);
    await assert.rejects(
      validateControllerEntry(
        fx.root,
        catalog,
        "audit-spec-portfolio-decomposition",
        "SPEC-OTHER",
        { type: "intake", artifactPath },
        [artifactPath],
        "initial",
      ),
      (error: unknown) => error instanceof OrchestrationStop && error.code === "CANONICAL_ARTIFACT_CONTRADICTION",
    );
  } finally { await fx.cleanup(); }
});

test("governance checkpoint is available only as a declared, subject-bound recovery entry", async () => {
  const fx = await makeRoot();
  try {
    const catalog = await loadTransitionCatalog(repositoryRoot);
    const artifactPath = "docs/SPEC-EXEC-001-governance-change.md";
    await writeFile(path.join(fx.root, artifactPath), "WORKFLOW_SUBJECT_ID: SPEC-EXEC-001\nHUMAN_PRESERVATION_AUTHORIZATION: YES\nPRESERVATION_SCOPE: EXPLICIT\n");
    const basis = { type: "intake" as const, artifactPath };
    await validateControllerEntry(
      fx.root,
      catalog,
      "checkpoint-governance-workspace",
      "SPEC-EXEC-001",
      basis,
      [artifactPath],
      "recovery",
      "implement-ready-tickets",
    );
    await assert.rejects(
      validateControllerEntry(
        fx.root,
        catalog,
        "checkpoint-governance-workspace",
        "SPEC-EXEC-001",
        basis,
        [artifactPath],
        "initial",
      ),
      (error: unknown) => error instanceof OrchestrationStop && error.code === "PROCESS_AUTHORITY_DRIFT",
    );
  } finally { await fx.cleanup(); }
});

test("same-operation recovery requires the catalog retry policy", async () => {
  const catalog = await loadTransitionCatalog(repositoryRoot);
  assert.equal(isAuthorizedRecoveryTarget(catalog, "remediate-component-implementation-plan", "remediate-component-implementation-plan"), true);
  assert.equal(isAuthorizedRecoveryTarget(catalog, "checkpoint-component-implementation-plan-generation", "checkpoint-component-implementation-plan-generation"), false);
});
