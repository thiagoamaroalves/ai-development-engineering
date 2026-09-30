import assert from "node:assert/strict";
import test from "node:test";

import { OrchestrationStop } from "../contracts.ts";
import { loadTransitionCatalog, routeOperation, validateReceiptShape } from "../workflow-routing.ts";

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
