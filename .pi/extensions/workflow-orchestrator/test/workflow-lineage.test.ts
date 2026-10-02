import assert from "node:assert/strict";
import { appendFile, mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { OrchestrationStop } from "../contracts.ts";
import {
  createIntakeWorkflowBasis,
  createTransitionWorkflowBasis,
  ensureTicketSetAuditWorkflowResultBlock,
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

test("ticket-set audit result metadata always ends with one newline and repairs only its own extra terminal blank lines", async () => {
  const fx = await makeRoot();
  try {
    const artifactPath = "docs/ticket-set-audit.md";
    const operation = "audit-component-implementation-tickets";
    const subject = "SPEC-X";
    const result = {
      operation,
      subject,
      resultId: "audit-r1",
      supersedesResultId: null,
      basis: { type: "none" as const },
      artifactPath,
      gateField: "VERDICT",
      gateValue: "IMPLEMENTATION_TICKETS_REMEDIATION_REQUIRED",
    };
    await writeFile(
      path.join(fx.root, artifactPath),
      [
        "COMPONENT_IMPLEMENTATION_TICKET_AUDIT_COMPLETE",
        `SPEC: ${subject}`,
        `REPORT: ${artifactPath}`,
        `VERDICT: ${result.gateValue}`,
        "",
      ].join("\n"),
    );

    await ensureTicketSetAuditWorkflowResultBlock(fx.root, result);
    const block = workflowResultBlock(result, operation, subject, result.gateField, result.gateValue);
    let text = await readFile(path.join(fx.root, artifactPath), "utf8");
    assert.ok(text.endsWith(`${block}\n`));
    assert.ok(!text.endsWith(`${block}\n\n`));

    await writeFile(path.join(fx.root, artifactPath), `${text}\n\n`);
    await ensureTicketSetAuditWorkflowResultBlock(fx.root, result);
    text = await readFile(path.join(fx.root, artifactPath), "utf8");
    assert.ok(text.endsWith(`${block}\n`));
    assert.ok(!text.endsWith(`${block}\n\n`));
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

test("produced transition results accept semantically identical basis fields in a different key order", async () => {
  const fx = await makeRoot();
  try {
    const sourcePath = "docs/SPEC-X-migration.md";
    const sourceOperation = "reconcile-legacy-ticket-set-audit-lineage";
    await writeFile(
      path.join(fx.root, sourcePath),
      [
        "MIGRATION_GATE: LEGACY_TICKET_SET_AUDIT_VALIDATED",
        "MIGRATION_KIND: LEGACY_COMPONENT_IMPLEMENTATION_TICKET_AUDIT_LINEAGE",
        "COMPONENT_ID: SPEC-X",
        record("migration-r1", null, "LEGACY_TICKET_SET_AUDIT_VALIDATED", sourceOperation, "SPEC-X"),
      ].join("\n"),
    );
    const source = await resolveCurrentWorkflowResult(fx.root, sourceOperation, "SPEC-X");
    assert.ok(source);
    const expectedBasis = await createTransitionWorkflowBasis(fx.root, source);
    assert.equal(expectedBasis.type, "transition");
    if (expectedBasis.type !== "transition") throw new Error("Expected transition basis.");

    const actualBasis = {
      type: "transition" as const,
      source: {
        ...expectedBasis.source,
        fields: Object.fromEntries(Object.entries(expectedBasis.source.fields).reverse()),
      },
    };
    const operation = "audit-component-implementation-tickets";
    const subject = "SPEC-X";
    const previousPath = "docs/SPEC-X-ticket-audit-before.md";
    const currentPath = "docs/SPEC-X-ticket-audit-current.md";
    await writeFile(path.join(fx.root, previousPath), record("audit-r1", null, "PASS", operation, subject));
    await writeFile(
      path.join(fx.root, currentPath),
      [
        "VERDICT: IMPLEMENTATION_TICKETS_REMEDIATION_REQUIRED",
        workflowResultBlock(
          { resultId: "audit-r2", supersedesResultId: "audit-r1", basis: actualBasis },
          operation,
          subject,
          "VERDICT",
          "IMPLEMENTATION_TICKETS_REMEDIATION_REQUIRED",
        ),
      ].join("\n"),
    );

    await validateProducedWorkflowResult(fx.root, {
      operation,
      subject,
      resultId: "audit-r2",
      supersedesResultId: "audit-r1",
      basis: expectedBasis,
      gateField: "VERDICT",
      gateValue: "IMPLEMENTATION_TICKETS_REMEDIATION_REQUIRED",
      artifactPath: currentPath,
    });
    await assert.rejects(
      validateProducedWorkflowResult(fx.root, {
        operation,
        subject,
        resultId: "audit-r2",
        supersedesResultId: "audit-r1",
        basis: {
          ...expectedBasis,
          source: { ...expectedBasis.source, gateValue: "CONTRADICTORY_GATE" },
        },
        gateField: "VERDICT",
        gateValue: "IMPLEMENTATION_TICKETS_REMEDIATION_REQUIRED",
        artifactPath: currentPath,
      }),
      (error: unknown) => error instanceof OrchestrationStop
        && error.code === "INCOMPLETE_CANONICAL_RESULT",
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

test("a current ticket audit checkpoint preserves the prior checkpoint in its completed re-audit lineage", async () => {
  const fx = await makeRoot();
  try {
    const subject = "SPEC-X";
    const auditOperation = "audit-component-implementation-tickets";
    const auditCheckpointOperation = "checkpoint-component-implementation-tickets-audit";
    const remediationOperation = "remediate-component-implementation-tickets";
    const remediationCheckpointOperation = "checkpoint-component-implementation-tickets-remediation";
    const auditPath = "docs/ticket-set-audit.md";

    const appendResult = async (
      artifactPath: string,
      operation: string,
      resultId: string,
      supersedesResultId: string | null,
      gateField: string,
      gateValue: string,
      source?: Awaited<ReturnType<typeof resolveCurrentWorkflowResult>>,
    ) => {
      const basis = source
        ? await createTransitionWorkflowBasis(fx.root, source)
        : { type: "none" as const };
      await mkdir(path.dirname(path.join(fx.root, artifactPath)), { recursive: true });
      await appendFile(
        path.join(fx.root, artifactPath),
        `${gateField}: ${gateValue}\n${workflowResultBlock({ resultId, supersedesResultId, basis }, operation, subject, gateField, gateValue)}\n`,
      );
      const current = await resolveCurrentWorkflowResult(fx.root, operation, subject);
      assert.ok(current, `${operation} ${resultId} should be persisted`);
      assert.equal(current.resultId, resultId);
      return current;
    };

    const audit1 = await appendResult(
      auditPath,
      auditOperation,
      "audit-1",
      null,
      "VERDICT",
      "IMPLEMENTATION_TICKETS_REMEDIATION_REQUIRED",
    );
    const auditCheckpoint1 = await appendResult(
      "docs/audit-checkpoint-1.md",
      auditCheckpointOperation,
      "audit-checkpoint-1",
      null,
      "NEXT_AUTHORIZED_OPERATION",
      remediationOperation,
      audit1,
    );
    const remediation1 = await appendResult(
      "docs/ticket-remediation.md",
      remediationOperation,
      "remediation-1",
      null,
      "GATE",
      "READY_FOR_INDEPENDENT_TICKET_REAUDIT",
      auditCheckpoint1,
    );
    const remediationCheckpoint1 = await appendResult(
      "docs/remediation-checkpoint-1.md",
      remediationCheckpointOperation,
      "remediation-checkpoint-1",
      null,
      "NEXT_AUTHORIZED_OPERATION",
      auditOperation,
      remediation1,
    );
    const audit2 = await appendResult(
      auditPath,
      auditOperation,
      "audit-2",
      audit1.resultId,
      "VERDICT",
      "IMPLEMENTATION_TICKETS_REMEDIATION_REQUIRED",
      remediationCheckpoint1,
    );
    const auditCheckpoint2 = await appendResult(
      "docs/audit-checkpoint-2.md",
      auditCheckpointOperation,
      "audit-checkpoint-2",
      auditCheckpoint1.resultId,
      "NEXT_AUTHORIZED_OPERATION",
      remediationOperation,
      audit2,
    );

    await validateCurrentWorkflowBasis(
      fx.root,
      auditCheckpointOperation,
      subject,
      auditCheckpoint2.artifactPath,
      "NEXT_AUTHORIZED_OPERATION",
      remediationOperation,
    );
    await validateCurrentWorkflowBasis(
      fx.root,
      auditOperation,
      subject,
      auditPath,
      "VERDICT",
      "IMPLEMENTATION_TICKETS_REMEDIATION_REQUIRED",
    );
  } finally { await fx.cleanup(); }
});
