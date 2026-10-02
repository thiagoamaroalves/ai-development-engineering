import assert from "node:assert/strict";
import test from "node:test";

import { OrchestrationStop } from "../contracts.ts";
import { isAuthorizedRecoveryTarget, loadTransitionCatalog, routeOperation, validateReceiptShape } from "../workflow-routing.ts";

const root = process.cwd();

test("every declared workflow gate resolves to its catalogued successor", async () => {
  const catalog = await loadTransitionCatalog(root);
  let edgeCount = 0;

  for (const [operation, definition] of Object.entries(catalog.operations)) {
    const transitions = [
      ...Object.entries(definition.routes ?? {}),
      ...(definition.dynamicNext ? (definition.allowedNext ?? []).map((next) => [next, next] as const) : []),
    ];
    for (const [gateValue, expectedNext] of transitions) {
      edgeCount += 1;
      const gateText = definition.gateField === "$marker"
        ? `${gateValue}\n`
        : [
          `${definition.gateField}: ${gateValue}`,
          ...Object.entries(definition.assertions?.[gateValue] ?? {}).map(([key, value]) => `${key}: ${value}`),
        ].join("\n");
      const receipt = validateReceiptShape({
        operation,
        subject: "SPEC-X",
        status: "COMPLETE",
        artifactPaths: ["report.md"],
        gateArtifactPath: "report.md",
        gateField: definition.gateField,
        gateValue,
        changedPaths: [],
        reason: "fixture result",
      }, operation, definition.gateField, "SPEC-X");

      assert.equal(routeOperation(catalog, receipt, new Map([["report.md", gateText]])), expectedNext, `${operation}: ${gateValue}`);
    }
  }

  assert.ok(edgeCount > 0);
});

test("a gate value outside the operation's transition table is rejected", async () => {
  const catalog = await loadTransitionCatalog(root);
  const definition = catalog.operations["implement-ready-tickets"];
  const receipt = validateReceiptShape({
    operation: "implement-ready-tickets",
    subject: "SPEC-X",
    status: "COMPLETE",
    artifactPaths: ["report.md"],
    gateArtifactPath: "report.md",
    gateField: definition.gateField,
    gateValue: "SKIP_AHEAD",
    changedPaths: [],
    reason: "fixture result",
  }, "implement-ready-tickets", definition.gateField, "SPEC-X");

  assert.throws(
    () => routeOperation(catalog, receipt, new Map([["report.md", "NEXT_WORKFLOW_GATE: SKIP_AHEAD\n"]])),
    (error: unknown) => error instanceof OrchestrationStop && error.code === "PROCESS_AUTHORITY_DRIFT",
  );
});

test("malformed receipts identify their missing or contradictory fields", async () => {
  const catalog = await loadTransitionCatalog(root);
  const definition = catalog.operations["checkpoint-component-implementation-tickets-audit"];
  assert.throws(
    () => validateReceiptShape({
      operation: "wrong-operation",
      subject: "SPEC-X",
      status: "COMPLETE",
      artifactPaths: ["report.md"],
      gateArtifactPath: "report.md",
      gateField: "GATE",
      gateValue: "",
      changedPaths: [],
    }, "checkpoint-component-implementation-tickets-audit", definition.gateField, "SPEC-X"),
    (error: unknown) => error instanceof OrchestrationStop
      && error.code === "INCOMPLETE_CANONICAL_RESULT"
      && /operation,gateField,gateValue,reason/.test(error.message)
      && /receivedKeys=/.test(error.message),
  );
});

test("non-complete operation receipt can stop without a materialized result artifact", async () => {
  const catalog = await loadTransitionCatalog(root);
  const operation = "implement-ready-tickets";
  const definition = catalog.operations[operation];
  const receipt = validateReceiptShape({
    operation,
    subject: "SPEC-X",
    status: "BLOCKED",
    artifactPaths: [],
    gateArtifactPath: "",
    gateField: definition.gateField,
    gateValue: "",
    changedPaths: [],
    reason: "The operation has no safe semantic implementation baseline.",
  }, operation, definition.gateField, "SPEC-X");

  assert.throws(
    () => routeOperation(catalog, receipt, new Map()),
    (error: unknown) => error instanceof OrchestrationStop
      && error.code === "MISSING_AUTHORITY"
      && (error.details.receipt as { reason?: string } | undefined)?.reason === receipt.reason,
  );
});

test("failed ticket-set checkpoints can resume only themselves, never rerun their source audit or remediation", async () => {
  const catalog = await loadTransitionCatalog(root);
  const auditCheckpoint = "checkpoint-component-implementation-tickets-audit";
  const remediationCheckpoint = "checkpoint-component-implementation-tickets-remediation";

  assert.equal(isAuthorizedRecoveryTarget(catalog, auditCheckpoint, auditCheckpoint), true);
  assert.equal(isAuthorizedRecoveryTarget(catalog, auditCheckpoint, "audit-component-implementation-tickets"), false);
  assert.equal(isAuthorizedRecoveryTarget(catalog, remediationCheckpoint, remediationCheckpoint), true);
  assert.equal(isAuthorizedRecoveryTarget(catalog, remediationCheckpoint, "remediate-component-implementation-tickets"), false);
  assert.equal(isAuthorizedRecoveryTarget(catalog, "checkpoint-component-spec-audit", "checkpoint-component-spec-audit"), false);
});

test("a structured gate that contradicts its canonical report is rejected", async () => {
  const catalog = await loadTransitionCatalog(root);
  const definition = catalog.operations["implement-ready-tickets"];
  const receipt = validateReceiptShape({
    operation: "implement-ready-tickets",
    subject: "SPEC-X",
    status: "COMPLETE",
    artifactPaths: ["report.md"],
    gateArtifactPath: "report.md",
    gateField: definition.gateField,
    gateValue: "COMPLETE",
    changedPaths: [],
    reason: "fixture result",
  }, "implement-ready-tickets", definition.gateField, "SPEC-X");

  assert.throws(
    () => routeOperation(catalog, receipt, new Map([["report.md", "NEXT_WORKFLOW_GATE: BLOCKED\n"]])),
    (error: unknown) => error instanceof OrchestrationStop && error.code === "CANONICAL_ARTIFACT_CONTRADICTION",
  );
});

test("a gate value that is absent from its canonical report is rejected", async () => {
  const catalog = await loadTransitionCatalog(root);
  const definition = catalog.operations["implement-ready-tickets"];
  const receipt = validateReceiptShape({
    operation: "implement-ready-tickets",
    subject: "SPEC-X",
    status: "COMPLETE",
    artifactPaths: ["report.md"],
    gateArtifactPath: "report.md",
    gateField: definition.gateField,
    gateValue: "COMPLETE",
    changedPaths: [],
    reason: "fixture result",
  }, "implement-ready-tickets", definition.gateField, "SPEC-X");

  assert.throws(
    () => routeOperation(catalog, receipt, new Map([["report.md", "The agent said the workflow is complete.\n"]])),
    (error: unknown) => error instanceof OrchestrationStop
      && error.code === "INCOMPLETE_CANONICAL_RESULT"
      && /not persisted/.test(error.message),
  );
});
