import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { OrchestrationStop } from "../contracts.ts";
import {
  createIntakeWorkflowBasis,
  createTransitionWorkflowBasis,
  resolveCurrentWorkflowResult,
  validateCurrentWorkflowBasis,
  validateProducedWorkflowResult,
  workflowResultBlock,
} from "../workflow-lineage.ts";

async function makeRoot(): Promise<{ root: string; cleanup(): Promise<void> }> {
  const root = await mkdtemp(path.join(os.tmpdir(), "pi-workflow-lineage-"));
  await mkdir(path.join(root, "docs"), { recursive: true });
  return { root, cleanup: () => rm(root, { recursive: true, force: true }) };
}

function record(
  resultId: string,
  supersedesResultId: string | null,
  gateValue: string,
  operation = "audit-component-spec-conformance",
  subject = "SPEC-X",
): string {
  return [
    `${operation} result ${resultId}`,
    `VERDICT: ${gateValue}`,
    workflowResultBlock({ resultId, supersedesResultId }, operation, subject, "VERDICT", gateValue),
    "",
  ].join("\n");
}

test("workflow result resolver returns the unique persisted lineage root", async () => {
  const fx = await makeRoot();
  try {
    await writeFile(path.join(fx.root, "docs", "SPEC-X-component-audit.md"), record("r1", null, "PASS"));
    const current = await resolveCurrentWorkflowResult(fx.root, "audit-component-spec-conformance", "SPEC-X");
    assert.equal(current?.resultId, "r1");
    assert.equal(current?.artifactPath, "docs/SPEC-X-component-audit.md");
  } finally { await fx.cleanup(); }
});

test("a newer result must explicitly supersede the old gate result", async () => {
  const fx = await makeRoot();
  try {
    await writeFile(path.join(fx.root, "docs", "SPEC-X-audit-old.md"), record("r1", null, "PASS"));
    await writeFile(path.join(fx.root, "docs", "SPEC-X-audit-current.md"), record("r2", "r1", "FAIL"));
    const current = await resolveCurrentWorkflowResult(fx.root, "audit-component-spec-conformance", "SPEC-X");
    assert.equal(current?.resultId, "r2");
    assert.equal(current?.gateValue, "FAIL");
    assert.equal(current?.artifactPath, "docs/SPEC-X-audit-current.md");
    await assert.rejects(
      validateCurrentWorkflowBasis(fx.root, "audit-component-spec-conformance", "SPEC-X", "docs/SPEC-X-audit-old.md", "VERDICT", "PASS"),
      (error: unknown) => error instanceof OrchestrationStop
        && error.code === "CANONICAL_ARTIFACT_CONTRADICTION"
        && /historical/.test(error.message),
    );
  } finally { await fx.cleanup(); }
});

test("workflow result lineage rejects forks, missing predecessors, and conflicting subjects", async () => {
  const fork = await makeRoot();
  try {
    await writeFile(path.join(fork.root, "docs", "SPEC-X-audit-a.md"), record("r1", null, "PASS"));
    await writeFile(path.join(fork.root, "docs", "SPEC-X-audit-b.md"), record("r2", "r1", "FAIL"));
    await writeFile(path.join(fork.root, "docs", "SPEC-X-audit-c.md"), record("r3", "r1", "PASS"));
    await assert.rejects(
      resolveCurrentWorkflowResult(fork.root, "audit-component-spec-conformance", "SPEC-X"),
      (error: unknown) => error instanceof OrchestrationStop && error.code === "AMBIGUOUS_STATE",
    );
  } finally { await fork.cleanup(); }

  const missing = await makeRoot();
  try {
    await writeFile(path.join(missing.root, "docs", "SPEC-X-audit.md"), record("r2", "missing-r1", "FAIL"));
    await assert.rejects(
      resolveCurrentWorkflowResult(missing.root, "audit-component-spec-conformance", "SPEC-X"),
      (error: unknown) => error instanceof OrchestrationStop
        && error.code === "INCOMPLETE_CANONICAL_RESULT"
        && /missing predecessor/.test(error.message),
    );
  } finally { await missing.cleanup(); }

  const wrongSubject = await makeRoot();
  try {
    await writeFile(path.join(wrongSubject.root, "docs", "SPEC-X-audit.md"), record("r1", null, "PASS", "audit-component-spec-conformance", "SPEC-Y"));
    await assert.rejects(
      validateCurrentWorkflowBasis(wrongSubject.root, "audit-component-spec-conformance", "SPEC-X", "docs/SPEC-X-audit.md", "VERDICT", "PASS"),
      (error: unknown) => error instanceof OrchestrationStop
        && error.code === "CANONICAL_ARTIFACT_CONTRADICTION"
        && /subject does not match/.test(error.message),
    );
  } finally { await wrongSubject.cleanup(); }
});

test("produced result must use a canonical docs artifact and become the current leaf", async () => {
  const fx = await makeRoot();
  try {
    await writeFile(path.join(fx.root, "docs", "SPEC-X-audit.md"), record("r1", null, "PASS"));
    await writeFile(path.join(fx.root, "docs", "SPEC-X-audit-next.md"), record("r2", "r1", "FAIL"));
    await validateProducedWorkflowResult(fx.root, {
      operation: "audit-component-spec-conformance",
      subject: "SPEC-X",
      resultId: "r2",
      supersedesResultId: "r1",
      basis: { type: "none" },
      gateField: "VERDICT",
      gateValue: "FAIL",
      artifactPath: "docs/SPEC-X-audit-next.md",
    });
    await assert.rejects(
      validateProducedWorkflowResult(fx.root, {
        operation: "audit-component-spec-conformance",
        subject: "SPEC-X",
        resultId: "r2",
        supersedesResultId: "r1",
        basis: { type: "none" },
        gateField: "VERDICT",
        gateValue: "FAIL",
        artifactPath: "other/unscoped-audit.md",
      }),
      (error: unknown) => error instanceof OrchestrationStop && error.code === "INVALID_PATH",
    );
  } finally { await fx.cleanup(); }
});

test("an intake revision change invalidates results derived from that intake", async () => {
  const fx = await makeRoot();
  try {
    const intakePath = "docs/SPEC-PORTFOLIO-001.md";
    await writeFile(path.join(fx.root, intakePath), "id: SPEC-PORTFOLIO-001\nrevision: 1\n");
    const basis = await createIntakeWorkflowBasis(fx.root, [{ artifactPath: intakePath, fields: ["id", "revision"] }]);
    const resultPath = "docs/portfolio-audit.md";
    await writeFile(
      path.join(fx.root, resultPath),
      `GATE: READY_FOR_COMPONENT_SPEC_GENERATION\n${workflowResultBlock({ resultId: "portfolio-r1", supersedesResultId: null, basis }, "audit-spec-portfolio-decomposition", "SPEC-PORTFOLIO-001", "GATE", "READY_FOR_COMPONENT_SPEC_GENERATION")}\n`,
    );
    await validateCurrentWorkflowBasis(fx.root, "audit-spec-portfolio-decomposition", "SPEC-PORTFOLIO-001", resultPath, "GATE", "READY_FOR_COMPONENT_SPEC_GENERATION");
    await writeFile(path.join(fx.root, intakePath), "id: SPEC-PORTFOLIO-001\nrevision: 2\n");
    await assert.rejects(
      validateCurrentWorkflowBasis(fx.root, "audit-spec-portfolio-decomposition", "SPEC-PORTFOLIO-001", resultPath, "GATE", "READY_FOR_COMPONENT_SPEC_GENERATION"),
      (error: unknown) => error instanceof OrchestrationStop && error.code === "CANONICAL_ARTIFACT_CONTRADICTION" && /fields changed/.test(error.message),
    );
  } finally { await fx.cleanup(); }
});

test("a downstream result becomes stale when its upstream result is superseded", async () => {
  const fx = await makeRoot();
  try {
    const sourcePath = "docs/SPEC-X-source.md";
    const sourceOperation = "generate-component-spec-from-portfolio";
    await writeFile(
      path.join(fx.root, sourcePath),
      `id: SPEC-X\nrevision: 1\nGATE: READY_FOR_SPEC_VALIDATION\n${workflowResultBlock({ resultId: "source-r1", supersedesResultId: null }, sourceOperation, "SPEC-X", "GATE", "READY_FOR_SPEC_VALIDATION")}\n`,
    );
    const source = await resolveCurrentWorkflowResult(fx.root, sourceOperation, "SPEC-X");
    assert.ok(source);
    const basis = await createTransitionWorkflowBasis(fx.root, source);
    const downstreamPath = "docs/SPEC-X-audit.md";
    await writeFile(
      path.join(fx.root, downstreamPath),
      `VERDICT: PASS\n${workflowResultBlock({ resultId: "audit-r1", supersedesResultId: null, basis }, "audit-component-spec-conformance", "SPEC-X", "VERDICT", "PASS")}\n`,
    );
    await validateCurrentWorkflowBasis(fx.root, "audit-component-spec-conformance", "SPEC-X", downstreamPath, "VERDICT", "PASS");
    const supersedingPath = "docs/SPEC-X-source-revised.md";
    await writeFile(
      path.join(fx.root, supersedingPath),
      `id: SPEC-X\nrevision: 2\nGATE: READY_FOR_SPEC_VALIDATION\n${workflowResultBlock({ resultId: "source-r2", supersedesResultId: "source-r1" }, sourceOperation, "SPEC-X", "GATE", "READY_FOR_SPEC_VALIDATION")}\n`,
    );
    await assert.rejects(
      validateCurrentWorkflowBasis(fx.root, "audit-component-spec-conformance", "SPEC-X", downstreamPath, "VERDICT", "PASS"),
      (error: unknown) => error instanceof OrchestrationStop && error.code === "CANONICAL_ARTIFACT_CONTRADICTION" && /upstream transition result was superseded/.test(error.message),
    );
  } finally { await fx.cleanup(); }
});
