import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";

import { OrchestrationStop, type DelegationRequest, type DelegationResult } from "../contracts.ts";
import { normalizeCheckpointInput, runFullWorkflow, validateOperationReceipt, type WorkflowPlan } from "../full-orchestrator.ts";
import { loadTransitionCatalog, type TransitionDefinition } from "../workflow-routing.ts";
import { workflowResultBlock } from "../workflow-lineage.ts";

const execFileAsync = promisify(execFile);
const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../../");

async function git(root: string, ...args: string[]): Promise<string> {
  return (await execFileAsync("git", args, { cwd: root, encoding: "utf8" })).stdout.trim();
}

async function makeRoot(): Promise<{ root: string; cleanup(): Promise<void> }> {
  const root = await mkdtemp(path.join(os.tmpdir(), "pi-full-workflow-"));
  await Promise.all([
    mkdir(path.join(root, ".pi"), { recursive: true }),
    mkdir(path.join(root, "tools"), { recursive: true }),
    mkdir(path.join(root, "docs"), { recursive: true }),
  ]);
  await Promise.all([
    cp(path.join(repositoryRoot, "skills"), path.join(root, "skills"), { recursive: true }),
    cp(path.join(repositoryRoot, ".pi", "agents"), path.join(root, ".pi", "agents"), { recursive: true }),
    cp(path.join(repositoryRoot, "tools", "verify-phase-manifest.mjs"), path.join(root, "tools", "verify-phase-manifest.mjs"), { recursive: true }),
    writeFile(path.join(root, "tools", "pass-check.mjs"), "process.exit(0);\n"),
    writeFile(path.join(root, "package.json"), JSON.stringify({
      private: true,
      scripts: {
        "verify:canonical-consistency": "node tools/pass-check.mjs",
        "verify:audit-governance": "node tools/pass-check.mjs",
      },
    }, null, 2)),
  ]);
  await Promise.all([
    writeFile(path.join(root, "docs", "entry-ticket-conformance.md"), resultArtifact("checkpoint-component-implementation-tickets-conformance", "SPEC-X", "NEXT_AUTHORIZED_OPERATION", "implement-ready-tickets")),
    writeFile(path.join(root, "docs", "entry-ticket-finalize.md"), resultArtifact("audit-implemented-ticket", "SPEC-X", "NEXT_AUTHORIZED_OPERATION", "finalize-implemented-ticket")),
    writeFile(path.join(root, "docs", "entry-governance-recovery.md"), "WORKFLOW_SUBJECT_ID: SPEC-X\nSPEC-X workflow changes requiring preservation\n"),
    writeFile(path.join(root, "docs", "entry-governance-authorized.md"), "WORKFLOW_SUBJECT_ID: SPEC-X\nHUMAN_PRESERVATION_AUTHORIZATION: YES\nPRESERVATION_SCOPE: EXPLICIT\n"),
    writeFile(path.join(root, "docs", "entry-portfolio-approved.md"), resultArtifact("audit-spec-portfolio-decomposition", "SPEC-X", "GATE", "READY_FOR_COMPONENT_SPEC_GENERATION")),
    writeFile(path.join(root, "docs", "entry-portfolio-reaudit.md"), resultArtifact("remediate-spec-portfolio-decomposition", "SPEC-X", "GATE", "READY_FOR_INDEPENDENT_DECOMPOSITION_REAUDIT")),
    writeFile(path.join(root, ".gitignore"), "/.pi/session-logs/\n"),
  ]);
  await git(root, "init", "-q");
  await git(root, "config", "user.email", "test@example.invalid");
  await git(root, "config", "user.name", "Test");
  await git(root, "add", ".");
  await git(root, "commit", "-qm", "workflow fixture");
  return { root, cleanup: () => rm(root, { recursive: true, force: true }) };
}

test("ticket-set audit receipt subject is reconciled only when the canonical report proves identity and gate", async () => {
  const fx = await makeRoot();
  try {
    const artifactPath = "docs/tickets/SPEC-X/implementation-ticket-audit.md";
    await mkdir(path.dirname(path.join(fx.root, artifactPath)), { recursive: true });
    await writeFile(path.join(fx.root, artifactPath), [
      "COMPONENT_IMPLEMENTATION_TICKET_AUDIT_COMPLETE",
      "SPEC: SPEC-X",
      `REPORT: ${artifactPath}`,
      "VERDICT: IMPLEMENTATION_TICKETS_REMEDIATION_REQUIRED",
      "",
    ].join("\n"));
    const value = {
      operation: "audit-component-implementation-tickets",
      subject: "SPEC-X / report label",
      status: "COMPLETE",
      artifactPaths: [artifactPath],
      gateArtifactPath: artifactPath,
      gateField: "VERDICT",
      gateValue: "IMPLEMENTATION_TICKETS_REMEDIATION_REQUIRED",
      changedPaths: [artifactPath],
      reason: "Independent ticket-set audit completed.",
    };

    const receipt = await validateOperationReceipt(fx.root, value, value.operation, value.gateField, "SPEC-X");
    assert.equal(receipt.subject, "SPEC-X");
  } finally { await fx.cleanup(); }
});

test("ticket-set audit receipt subject mismatch remains blocked without canonical identity proof", async () => {
  const fx = await makeRoot();
  try {
    const artifactPath = "docs/tickets/SPEC-X/implementation-ticket-audit.md";
    await mkdir(path.dirname(path.join(fx.root, artifactPath)), { recursive: true });
    await writeFile(path.join(fx.root, artifactPath), [
      "COMPONENT_IMPLEMENTATION_TICKET_AUDIT_COMPLETE",
      "SPEC: SPEC-Y",
      `REPORT: ${artifactPath}`,
      "VERDICT: IMPLEMENTATION_TICKETS_REMEDIATION_REQUIRED",
      "",
    ].join("\n"));
    const value = {
      operation: "audit-component-implementation-tickets",
      subject: "SPEC-Y",
      status: "COMPLETE",
      artifactPaths: [artifactPath],
      gateArtifactPath: artifactPath,
      gateField: "VERDICT",
      gateValue: "IMPLEMENTATION_TICKETS_REMEDIATION_REQUIRED",
      changedPaths: [artifactPath],
      reason: "Independent ticket-set audit completed.",
    };

    await assert.rejects(
      validateOperationReceipt(fx.root, value, value.operation, value.gateField, "SPEC-X"),
      /does not prove the selected component identity and gate/,
    );
  } finally { await fx.cleanup(); }
});

function plan(overrides: Partial<WorkflowPlan> = {}): WorkflowPlan {
  const operation = overrides.operation ?? "implement-ready-tickets";
  const entryBasis = overrides.entryBasis ?? (operation === "finalize-implemented-ticket"
    ? {
      type: "transition" as const,
      source: {
        operation: "audit-implemented-ticket",
        subject: "SPEC-X",
        artifactPath: "docs/entry-ticket-finalize.md",
        gateField: "NEXT_AUTHORIZED_OPERATION",
        gateValue: "finalize-implemented-ticket",
      },
    }
    : operation === "generate-component-spec-from-portfolio"
    ? {
      type: "transition" as const,
      source: {
        operation: "audit-spec-portfolio-decomposition",
        subject: "SPEC-X",
        artifactPath: "docs/entry-portfolio-approved.md",
        gateField: "GATE",
        gateValue: "READY_FOR_COMPONENT_SPEC_GENERATION",
      },
    }
    : operation === "audit-spec-portfolio-decomposition"
      ? {
        type: "transition" as const,
        source: {
          operation: "remediate-spec-portfolio-decomposition",
          subject: "SPEC-X",
          artifactPath: "docs/entry-portfolio-reaudit.md",
          gateField: "GATE",
          gateValue: "READY_FOR_INDEPENDENT_DECOMPOSITION_REAUDIT",
        },
      }
      : {
        type: "transition" as const,
        source: {
          operation: "checkpoint-component-implementation-tickets-conformance",
          subject: "SPEC-X",
          artifactPath: "docs/entry-ticket-conformance.md",
          gateField: "NEXT_AUTHORIZED_OPERATION",
          gateValue: "implement-ready-tickets",
        },
      });
  return {
    decision: "EXECUTE",
    operation,
    subject: "SPEC-X",
    reason: "Canonical authority supports this operation.",
    authorityFiles: [`skills/${operation}/SKILL.md`],
    evidenceFiles: ["skills/_shared/workflow-transition-contract.md", entryBasis.type === "transition" ? entryBasis.source.artifactPath : entryBasis.artifactPath],
    entryBasis,
    executionIsolation: "main",
    operationInputJson: "{}",
    ...overrides,
  };
}

test("checkpoint normalization preserves an incomplete current-head manifest and selects a fresh path", async () => {
  const fx = await makeRoot();
  try {
    const head = await git(fx.root, "rev-parse", "HEAD");
    const staleManifest = "docs/workflow-checkpoints/governance-current-manifest.json";
    await mkdir(path.dirname(path.join(fx.root, staleManifest)), { recursive: true });
    await writeFile(path.join(fx.root, staleManifest), JSON.stringify({
      schemaVersion: 1,
      manifestKind: "PHASE_CHECKPOINT",
      operation: "checkpoint-governance-workspace",
      target: { head },
      sourceAuthority: [],
      paths: { manifest: staleManifest, marker: "docs/workflow-checkpoints/governance-current-marker.md" },
    }));
    const candidate = plan({
      operation: "checkpoint-governance-workspace",
      operationInputJson: JSON.stringify({ phaseManifestPath: staleManifest }),
      evidenceFiles: [staleManifest, "docs/entry-governance-authorized.md"],
    });

    const normalized = await normalizeCheckpointInput(fx.root, candidate, head, {
      preservePaths: [],
      unstagedRecoveryPaths: [staleManifest],
    });
    const input = JSON.parse(normalized.operationInputJson) as Record<string, unknown>;
    assert.notEqual(input.phaseManifestPath, staleManifest);
    assert.deepEqual(input.preserveUnstagedRecoveryPaths, [staleManifest]);
    assert.deepEqual(normalized.evidenceFiles, ["docs/entry-governance-authorized.md"]);
    const status = await git(fx.root, "status", "--short", "--untracked-files=all");
    assert.match(status, /\?\? docs\/workflow-checkpoints\/governance-current-manifest\.json/);
    assert.equal(status.includes(String(input.phaseManifestPath)), false);
  } finally { await fx.cleanup(); }
});

test("governance checkpoint normalization keeps approved paths out of recovery and preserves its marker path", async () => {
  const fx = await makeRoot();
  try {
    const head = await git(fx.root, "rev-parse", "HEAD");
    const preservePath = ".pi/agents/workflow-controller.md";
    const recoveryPath = "docs/workflow-checkpoints/old-recovery.json";
    const original = await readFile(path.join(fx.root, preservePath), "utf8");
    await writeFile(path.join(fx.root, preservePath), `${original}\n# authorized test change\n`);
    await mkdir(path.dirname(path.join(fx.root, recoveryPath)), { recursive: true });
    await writeFile(path.join(fx.root, recoveryPath), "leave unstaged\n");

    const scope = { preservePaths: [preservePath], unstagedRecoveryPaths: [recoveryPath] };
    const candidate = plan({
      operation: "checkpoint-governance-workspace",
      operationInputJson: JSON.stringify({ phaseManifestPath: "docs/workflow-checkpoints/governance.json" }),
      evidenceFiles: ["docs/entry-governance-authorized.md"],
    });
    const normalized = await normalizeCheckpointInput(fx.root, candidate, head, scope);
    const firstInput = JSON.parse(normalized.operationInputJson) as Record<string, unknown>;
    const normalizedAgain = await normalizeCheckpointInput(fx.root, normalized, head, scope);
    const secondInput = JSON.parse(normalizedAgain.operationInputJson) as Record<string, unknown>;

    assert.equal(firstInput.humanPreservationAuthorization, "YES");
    assert.equal(firstInput.preservationScope, "EXPLICIT");
    assert.deepEqual(firstInput.authorizedPreservePaths, [preservePath]);
    assert.deepEqual(firstInput.preserveUnstagedRecoveryPaths, [recoveryPath]);
    assert.ok(normalized.evidenceFiles.includes(preservePath));
    assert.equal(firstInput.phaseMarkerPath, secondInput.phaseMarkerPath);
  } finally { await fx.cleanup(); }
});

test("governance checkpoint uses deterministic authorization validation and forwards the exact request to its skill", async () => {
  const fx = await makeRoot();
  try {
    const preservePath = ".pi/agents/workflow-controller.md";
    const recoveryPath = "docs/workflow-checkpoints/old-recovery.json";
    const original = await readFile(path.join(fx.root, preservePath), "utf8");
    await writeFile(path.join(fx.root, preservePath), `${original}\n# authorized test change\n`);
    await mkdir(path.dirname(path.join(fx.root, recoveryPath)), { recursive: true });
    await writeFile(path.join(fx.root, recoveryPath), "leave unstaged\n");
    const entryPath = "docs/entry-governance-conformance.md";
    await writeFile(path.join(fx.root, entryPath), [
      "CHECKPOINT_KIND = COMPONENT_IMPLEMENTATION_TICKETS_CONFORMANCE_CHECKPOINT",
      "COMPONENT = SPEC-X",
      "AUDIT_VERDICT = IMPLEMENTATION_TICKETS_CONFORMANT",
      "IMPLEMENTATION_GATE = READY_FOR_IMPLEMENTATION",
      "TICKET_SET_AUDIT_COMPLETE = YES",
      "",
    ].join("\n"));
    await git(fx.root, "add", entryPath);
    await git(fx.root, "commit", "-qm", "add governance conformance fixture");

    const objective = [
      "Perform the explicitly authorized governance checkpoint.",
      "HUMAN_PRESERVATION_AUTHORIZATION = YES",
      "PRESERVATION_SCOPE = EXPLICIT",
      "PRESERVED_PATHS_BEGIN",
      preservePath,
      "PRESERVED_PATHS_END",
      "UNSTAGED_RECOVERY_PATHS_BEGIN",
      recoveryPath,
      "UNSTAGED_RECOVERY_PATHS_END",
    ].join("\n");
    let controllerCalls = 0;
    let preflightCalls = 0;
    let checkpointTask = "";
    const selected = plan({
      operation: "checkpoint-governance-workspace",
      entryBasis: { type: "intake", artifactPath: entryPath },
      authorityFiles: ["skills/checkpoint-governance-workspace/SKILL.md"],
      evidenceFiles: [entryPath],
      operationInputJson: JSON.stringify({ phaseManifestPath: "docs/workflow-checkpoints/governance.json" }),
    });
    const blocked = plan({
      decision: "BLOCKED",
      operation: "checkpoint-governance-workspace",
      reason: "Stop after observing the deterministic preflight path.",
      authorityFiles: ["skills/checkpoint-governance-workspace/SKILL.md"],
      evidenceFiles: [],
      entryBasis: null,
      operationInputJson: "{}",
    });
    const delegate = async (request: DelegationRequest): Promise<DelegationResult> => {
      if (request.agent === "workflow-controller") {
        controllerCalls += 1;
        return { status: "completed", value: controllerCalls === 1 ? selected : blocked };
      }
      if (request.agent === "workflow-preflight") {
        preflightCalls += 1;
        return { status: "completed", value: semanticPreflight(request, "BLOCKED") };
      }
      if (request.agent === "workflow-checkpoint") {
        checkpointTask = request.task;
        return { status: "failed", error: "test stops before checkpoint mutation" };
      }
      throw new Error(`Unexpected delegate ${request.agent}/${String(request.skill)}.`);
    };

    await assert.rejects(
      runFullWorkflow({ objective, maxSteps: 2 }, { root: fx.root, delegate }),
      (error: unknown) => error instanceof OrchestrationStop && error.code === "MISSING_AUTHORITY",
    );
    assert.equal(preflightCalls, 0);
    assert.equal(controllerCalls, 2);
    assert.match(checkpointTask, /PRESERVED_PATHS_BEGIN/);
    assert.match(checkpointTask, /UNSTAGED_RECOVERY_PATHS_BEGIN/);
    assert.match(checkpointTask, /"authorizedPreservePaths":\["\.pi\/agents\/workflow-controller\.md"\]/);
    assert.match(checkpointTask, /"preserveUnstagedRecoveryPaths":\["docs\/workflow-checkpoints\/old-recovery\.json"\]/);
  } finally { await fx.cleanup(); }
});

test("checkpoint normalization leaves a clean tracked stale manifest out of unstaged recovery", async () => {
  const fx = await makeRoot();
  try {
    const originalHead = await git(fx.root, "rev-parse", "HEAD");
    const staleManifest = "docs/workflow-checkpoints/ticket-audit-old-manifest.json";
    await mkdir(path.dirname(path.join(fx.root, staleManifest)), { recursive: true });
    await writeFile(path.join(fx.root, staleManifest), JSON.stringify({
      schemaVersion: 1,
      manifestKind: "PHASE_CHECKPOINT",
      operation: "checkpoint-component-implementation-tickets-audit",
      target: { head: originalHead },
      sourceAuthority: [],
      paths: { manifest: staleManifest, marker: "docs/workflow-checkpoints/ticket-audit-old-marker.md" },
    }));
    await git(fx.root, "add", staleManifest);
    await git(fx.root, "commit", "-qm", "preserve stale phase manifest");
    const currentHead = await git(fx.root, "rev-parse", "HEAD");

    const normalized = await normalizeCheckpointInput(fx.root, plan({
      operation: "checkpoint-component-implementation-tickets-audit",
      operationInputJson: JSON.stringify({ phaseManifestPath: staleManifest }),
      evidenceFiles: [staleManifest, "docs/entry-ticket-conformance.md"],
    }), currentHead);
    const input = JSON.parse(normalized.operationInputJson) as Record<string, unknown>;

    assert.notEqual(input.phaseManifestPath, staleManifest);
    assert.equal("preserveUnstagedRecoveryPaths" in input, false);
    assert.deepEqual(normalized.evidenceFiles, ["docs/entry-ticket-conformance.md"]);
    assert.equal(await git(fx.root, "status", "--short", "--untracked-files=all"), "");
  } finally { await fx.cleanup(); }
});

test("ticket-set deterministic checkpoint allocates fresh paths instead of reusing a current manifest", async () => {
  const fx = await makeRoot();
  try {
    const head = await git(fx.root, "rev-parse", "HEAD");
    const oldManifest = "docs/workflow-checkpoints/ticket-set-current-manifest.json";
    const oldMarker = "docs/workflow-checkpoints/ticket-set-current-marker.md";
    await mkdir(path.dirname(path.join(fx.root, oldManifest)), { recursive: true });
    await writeFile(path.join(fx.root, oldMarker), "incomplete checkpoint draft\n");
    await writeFile(path.join(fx.root, oldManifest), `${JSON.stringify({
      schemaVersion: 1,
      manifestKind: "PHASE_CHECKPOINT",
      operation: "checkpoint-component-implementation-tickets-audit",
      target: { head },
      sourceAuthority: [{
        path: "docs/entry-ticket-conformance.md",
        sha256: createHash("sha256").update(await readFile(path.join(fx.root, "docs/entry-ticket-conformance.md"))).digest("hex"),
      }],
      paths: { manifest: oldManifest, marker: oldMarker },
    }, null, 2)}\n`);
    const normalized = await normalizeCheckpointInput(fx.root, plan({
      operation: "checkpoint-component-implementation-tickets-audit",
      operationInputJson: JSON.stringify({ phaseManifestPath: oldManifest }),
      evidenceFiles: ["skills/_shared/workflow-transition-contract.md", "docs/entry-ticket-conformance.md"],
    }), head);
    const operationInput = JSON.parse(normalized.operationInputJson) as Record<string, unknown>;

    assert.notEqual(operationInput.phaseManifestPath, oldManifest);
    assert.notEqual(operationInput.phaseMarkerPath, oldMarker);
    assert.deepEqual(operationInput.preserveUnstagedRecoveryPaths, [oldManifest, oldMarker]);
  } finally { await fx.cleanup(); }
});

test("checkpoint preparation and phase manifest validation use the active linked worktree", async () => {
  const fx = await makeRoot();
  const linkedRoot = `${fx.root}-linked`;
  let linkedWorktreeCreated = false;
  try {
    await git(fx.root, "worktree", "add", "--detach", linkedRoot, "HEAD");
    linkedWorktreeCreated = true;
    const head = await git(linkedRoot, "rev-parse", "HEAD");
    assert.equal(await git(linkedRoot, "rev-parse", "--show-toplevel"), linkedRoot);
    assert.notEqual(await git(linkedRoot, "rev-parse", "--absolute-git-dir"), path.join(linkedRoot, ".git"));

    const workflowResult = await runFullWorkflow({ objective: "Use the active linked worktree", maxSteps: 1 }, {
      root: linkedRoot,
      delegate: async () => ({ status: "completed", value: completePlan() }),
    });
    assert.equal(workflowResult.status, "COMPLETE");

    const auditPath = "docs/ticket-audit.md";
    const markerPath = "docs/workflow-checkpoints/ticket-audit-checkpoint.md";
    const manifestPath = "docs/workflow-checkpoints/ticket-audit-checkpoint-manifest.json";
    const auditContent = "TICKET_GATE: IMPLEMENTATION_TICKETS_REMEDIATION_REQUIRED\n";
    await mkdir(path.dirname(path.join(linkedRoot, markerPath)), { recursive: true });
    await writeFile(path.join(linkedRoot, auditPath), auditContent);
    await writeFile(path.join(linkedRoot, markerPath), "CHECKPOINT = PENDING\n");

    const normalized = await normalizeCheckpointInput(linkedRoot, plan({
      operation: "checkpoint-component-implementation-tickets-audit",
      evidenceFiles: ["skills/_shared/workflow-transition-contract.md", auditPath],
    }), head);
    const operationInput = JSON.parse(normalized.operationInputJson) as Record<string, unknown>;
    assert.equal(typeof operationInput.phaseManifestPath, "string");
    assert.equal(typeof operationInput.phaseMarkerPath, "string");

    const manifest = {
      schemaVersion: 1,
      manifestKind: "PHASE_CHECKPOINT",
      phaseId: "linked-worktree-checkpoint-test",
      operation: "checkpoint-component-implementation-tickets-audit",
      subject: { id: "SPEC-X", type: "component" },
      sourceAuthority: [{
        path: auditPath,
        sha256: createHash("sha256").update(auditContent).digest("hex"),
      }],
      target: { head, semanticFingerprint: `HEAD:${head}` },
      paths: {
        manifest: manifestPath,
        preserve: [auditPath],
        delete: [],
        unstagedRecovery: [],
        marker: markerPath,
      },
      nextAuthorizedOperation: "remediate-component-implementation-tickets",
      commitMessage: "checkpoint fixture from linked worktree",
    };
    await writeFile(path.join(linkedRoot, manifestPath), `${JSON.stringify(manifest, null, 2)}\n`);

    const verification = await execFileAsync(process.execPath, [
      path.join(linkedRoot, "tools", "verify-phase-manifest.mjs"),
      "--manifest",
      manifestPath,
    ], { cwd: linkedRoot, encoding: "utf8" });
    assert.match(verification.stdout, /PHASE_MANIFEST_VALID = PASS/);
  } finally {
    if (linkedWorktreeCreated) await git(fx.root, "worktree", "remove", "--force", linkedRoot).catch(() => undefined);
    await fx.cleanup();
  }
});

test("checkpoint normalization supplies unrelated dirty paths as exact unstaged recovery candidates", async () => {
  const fx = await makeRoot();
  try {
    const head = await git(fx.root, "rev-parse", "HEAD");
    const auditArtifact = "docs/ticket-audit.md";
    const unrelatedTracked = ".gitignore";
    const unrelatedUntracked = "docs/local-work.md";
    await writeFile(path.join(fx.root, auditArtifact), "current audit candidate\n");
    await writeFile(path.join(fx.root, unrelatedTracked), "/.pi/session-logs/\n# preserved local change\n");
    await writeFile(path.join(fx.root, unrelatedUntracked), "preserve without staging\n");

    const normalized = await normalizeCheckpointInput(fx.root, plan({
      operation: "checkpoint-component-implementation-tickets-audit",
      evidenceFiles: ["skills/_shared/workflow-transition-contract.md", "docs/entry-ticket-conformance.md", auditArtifact],
    }), head);
    const input = JSON.parse(normalized.operationInputJson) as Record<string, unknown>;

    assert.deepEqual(input.preserveUnstagedRecoveryPaths, [unrelatedTracked, unrelatedUntracked]);
    assert.equal((input.preserveUnstagedRecoveryPaths as string[]).includes(auditArtifact), false);
  } finally { await fx.cleanup(); }
});

test("checkpoint normalization selects a fresh marker path without reusing a historical marker", async () => {
  const fx = await makeRoot();
  try {
    const historicalMarker = "docs/workflow-checkpoints/SPEC-X-component-implementation-tickets-audit.md";
    await mkdir(path.dirname(path.join(fx.root, historicalMarker)), { recursive: true });
    await writeFile(path.join(fx.root, historicalMarker), "PARENT_HEAD = historical\n");
    await git(fx.root, "add", historicalMarker);
    await git(fx.root, "commit", "-qm", "preserve historical phase marker");
    const head = await git(fx.root, "rev-parse", "HEAD");

    const normalized = await normalizeCheckpointInput(fx.root, plan({
      operation: "checkpoint-component-implementation-tickets-audit",
    }), head);
    const input = JSON.parse(normalized.operationInputJson) as Record<string, unknown>;

    assert.equal(input.phaseMarkerPath, `docs/workflow-checkpoints/spec-x-checkpoint-component-implementation-tickets-audit-${head.slice(0, 12)}.md`);
    assert.notEqual(input.phaseMarkerPath, historicalMarker);
  } finally { await fx.cleanup(); }
});

test("checkpoint normalization is reapplied after preflight to restore extension-owned inputs", async () => {
  const fx = await makeRoot();
  try {
    const head = await git(fx.root, "rev-parse", "HEAD");
    const auditPath = "docs/ticket-audit.md";
    const recoveryPath = "docs/local-work.md";
    await writeFile(path.join(fx.root, auditPath), "current audit candidate\n");
    await writeFile(path.join(fx.root, recoveryPath), "preserve unchanged\n");
    const initial = await normalizeCheckpointInput(fx.root, plan({
      operation: "checkpoint-component-implementation-tickets-audit",
      evidenceFiles: ["skills/_shared/workflow-transition-contract.md", "docs/entry-ticket-conformance.md", auditPath],
    }), head);
    const preflightReturnedPlan = { ...initial, operationInputJson: "{}" };
    const restored = await normalizeCheckpointInput(fx.root, preflightReturnedPlan, head);
    const input = JSON.parse(restored.operationInputJson) as Record<string, unknown>;

    assert.equal(typeof input.phaseManifestPath, "string");
    assert.equal(typeof input.phaseMarkerPath, "string");
    assert.deepEqual(input.preserveUnstagedRecoveryPaths, [recoveryPath]);
  } finally { await fx.cleanup(); }
});

function completePlan(): WorkflowPlan {
  return plan({
    decision: "COMPLETE",
    operation: "",
    subject: "SPEC-X",
    reason: "Canonical terminal state is evidenced.",
    authorityFiles: [],
    evidenceFiles: ["skills/_shared/workflow-transitions.json"],
    entryBasis: null,
  });
}

function taskValue(task: string, key: string): string {
  const value = task.match(new RegExp(`^${key}: (.+)$`, "m"))?.[1];
  if (!value) throw new Error(`Task is missing ${key}.`);
  return value;
}

function resultValue(task: string, key: string): string {
  const value = task.match(new RegExp(`^${key} = (.+)$`, "m"))?.[1];
  if (!value) throw new Error(`Task is missing ${key}.`);
  return value;
}

function resultArtifact(operation: string, subject: string, gateField: string, gateValue: string, resultId = `${operation}-r1`): string {
  return `${gateField}: ${gateValue}\n${workflowResultBlock({ resultId, supersedesResultId: null }, operation, subject, gateField, gateValue)}\n`;
}

function semanticPreflight(request: DelegationRequest, status: "PASS" | "BLOCKED" | "HUMAN_REQUIRED" = "PASS"): Record<string, unknown> {
  const resolvedInputJson = request.task.match(/^Bounded operation input: (.*)$/m)?.[1] ?? "{}";
  return {
    status,
    operation: taskValue(request.task, "Operation"),
    subject: taskValue(request.task, "Subject"),
    head: taskValue(request.task, "Pinned HEAD"),
    checks: { skillPreconditions: status },
    blockers: status === "PASS" ? [] : ["The selected skill has an unresolved semantic prerequisite."],
    resolvedInputJson,
  };
}

async function operationReceipt(
  root: string,
  request: DelegationRequest,
  catalog: Record<string, TransitionDefinition>,
  gateValue: string,
  options: { persistGate?: boolean; changedPaths?: string[] } = {},
): Promise<DelegationResult> {
  if (typeof request.skill !== "string") throw new Error("Operation request has no single selected skill.");
  const operation = request.skill;
  const subject = taskValue(request.task, "Subject");
  const definition = catalog[operation];
  if (!definition) throw new Error(`No test transition definition for ${operation}.`);
  const artifactPath = `docs/workflow-results/${subject}-${operation}.md`;
  const absolute = path.join(root, artifactPath);
  await mkdir(path.dirname(absolute), { recursive: true });
  const assertions = Object.entries(definition.assertions?.[gateValue] ?? {})
    .map(([field, value]) => `${field}: ${value}`);
  const gateText = definition.gateField === "$marker"
    ? `${gateValue}\n`
    : `${definition.gateField}: ${gateValue}\n${assertions.join("\n")}${assertions.length ? "\n" : ""}`;
  const resultId = resultValue(request.task, "RESULT_ID");
  const supersedesValue = resultValue(request.task, "SUPERSEDES_RESULT_ID");
  const supersedesResultId = supersedesValue === "NONE" ? null : supersedesValue;
  const basis = JSON.parse(resultValue(request.task, "BASIS"));
  const previous = await readFile(absolute, "utf8").catch(() => "");
  const resultBlock = workflowResultBlock({ resultId, supersedesResultId, basis }, operation, subject, definition.gateField, gateValue);
  await writeFile(absolute, `${previous}${options.persistGate === false ? `Subject: ${subject}\nOperation completed without persisting its gate.\n` : `Subject: ${subject}\n${gateText}`}\n${resultBlock}\n`);

  if (operation.startsWith("checkpoint-")) {
    await git(root, "add", artifactPath);
    await git(root, "commit", "-qm", `checkpoint fixture for ${operation}`);
  }

  return {
    status: "completed",
    value: {
      operation,
      subject,
      status: "COMPLETE",
      artifactPaths: [artifactPath],
      gateArtifactPath: artifactPath,
      gateField: definition.gateField,
      gateValue,
      changedPaths: options.changedPaths ?? [artifactPath],
      reason: `Fixture produced ${gateValue}.`,
    },
  };
}

function terminalRecovery(): WorkflowPlan {
  return plan({
    decision: "HUMAN_REQUIRED",
    operation: "",
    reason: "Exceptional state requires a human decision.",
    authorityFiles: [],
    entryBasis: null,
  });
}

test("normal terminal gate completes after one controller intake", async () => {
  const fx = await makeRoot();
  try {
    const catalog = (await loadTransitionCatalog(fx.root)).operations;
    const calls: string[] = [];
    let controllerCalls = 0;
    const delegate = async (request: DelegationRequest): Promise<DelegationResult> => {
      calls.push(request.agent);
      if (request.agent === "workflow-controller") {
        controllerCalls += 1;
        return { status: "completed", value: plan() };
      }
      if (request.agent === "workflow-preflight") return { status: "completed", value: semanticPreflight(request) };
      return operationReceipt(fx.root, request, catalog, "COMPLETE");
    };

    const result = await runFullWorkflow({ objective: "Complete the selected ticket workflow", maxSteps: 3 }, { root: fx.root, delegate });

    assert.equal(result.status, "COMPLETE");
    assert.equal(result.steps.length, 1);
    assert.equal(controllerCalls, 1);
    assert.deepEqual(calls, ["workflow-controller", "workflow-preflight", "workflow-implementer"]);
  } finally { await fx.cleanup(); }
});

test("blocked operation receipt stops before reading an unmaterialized result artifact", async () => {
  const fx = await makeRoot();
  try {
    const catalog = (await loadTransitionCatalog(fx.root)).operations;
    let controllerCalls = 0;
    let operationCalls = 0;
    const missingArtifact = "docs/workflow-checkpoints/checkpoint-that-was-not-created.md";
    const delegate = async (request: DelegationRequest): Promise<DelegationResult> => {
      if (request.agent === "workflow-controller") {
        controllerCalls += 1;
        return { status: "completed", value: plan() };
      }
      if (request.agent === "workflow-preflight") return { status: "completed", value: semanticPreflight(request) };
      operationCalls += 1;
      const definition = catalog["implement-ready-tickets"];
      return {
        status: "completed",
        value: {
          operation: "implement-ready-tickets",
          subject: "SPEC-X",
          status: "BLOCKED",
          artifactPaths: [missingArtifact],
          gateArtifactPath: missingArtifact,
          gateField: definition.gateField,
          gateValue: Object.keys(definition.routes ?? {})[0],
          changedPaths: [],
          reason: "The required runtime is unavailable.",
        },
      };
    };

    const originalHead = await git(fx.root, "rev-parse", "HEAD");
    await assert.rejects(
      runFullWorkflow({ objective: "Stop at a blocked operation result", maxSteps: 2 }, { root: fx.root, delegate }),
      (error: unknown) => error instanceof OrchestrationStop
        && error.code === "MISSING_AUTHORITY"
        && (error.details.receipt as { status?: string; reason?: string } | undefined)?.status === "BLOCKED"
        && /required runtime/.test((error.details.receipt as { reason?: string }).reason ?? ""),
    );

    assert.equal(controllerCalls, 1);
    assert.equal(operationCalls, 1);
    assert.equal(await git(fx.root, "rev-parse", "HEAD"), originalHead);
    assert.equal(await git(fx.root, "status", "--porcelain=v1"), "");
  } finally { await fx.cleanup(); }
});

test("catalog routes consecutive operations and calls the controller only at intake", async () => {
  const fx = await makeRoot();
  try {
    const catalog = (await loadTransitionCatalog(fx.root)).operations;
    const calls: string[] = [];
    let controllerCalls = 0;
    const delegate = async (request: DelegationRequest): Promise<DelegationResult> => {
      calls.push(request.agent);
      if (request.agent === "workflow-controller") {
        controllerCalls += 1;
        return { status: "completed", value: plan({ operation: "generate-component-spec-from-portfolio" }) };
      }
      if (request.agent === "workflow-preflight") return { status: "completed", value: semanticPreflight(request) };
      if (request.skill === "generate-component-spec-from-portfolio") {
        return operationReceipt(fx.root, request, catalog, "READY_FOR_SPEC_VALIDATION");
      }
      if (request.skill === "audit-component-spec-conformance") {
        return operationReceipt(fx.root, request, catalog, "PASS — COMPONENT_SPEC_CONFORMANT");
      }
      if (request.skill === "checkpoint-component-spec-conformance") {
        return operationReceipt(fx.root, request, catalog, "audit-spec-portfolio-conformance");
      }
      throw new Error(`Unexpected workflow agent ${request.agent} for ${String(request.skill)}.`);
    };

    await assert.rejects(
      runFullWorkflow({ objective: "Advance through deterministic SPEC gates", maxSteps: 3 }, { root: fx.root, delegate }),
      (error: unknown) => error instanceof OrchestrationStop && error.code === "MAX_STEPS_REACHED",
    );

    assert.equal(controllerCalls, 1);
    assert.deepEqual(calls, [
      "workflow-controller",
      "workflow-preflight", "workflow-skill-executor",
      "workflow-preflight", "workflow-independent-auditor",
      "workflow-preflight", "workflow-checkpoint",
    ]);
  } finally { await fx.cleanup(); }
});

test("ticket-set audit checkpoint runs in the extension without checkpoint or preflight agent delegation", async () => {
  const fx = await makeRoot();
  try {
    await mkdir(path.join(fx.root, "docs", "workflow-checkpoints"), { recursive: true });
    const auditPath = "docs/ticket-set-audit.md";
    const auditContent = [
      "# Ticket-set audit",
      "",
      "VERDICT = IMPLEMENTATION_TICKETS_REMEDIATION_REQUIRED",
      "TICKET_DECOMPOSITION_GATE = READY_FOR_TICKET_AUDIT",
      "BASELINE_DRIFT_STATUS = NO_DRIFT",
      "REASSESSMENT_COMPLETE = YES",
      "BASELINE_REASSESSMENT_PROOF = NONE",
      "FINDINGS_ARE_ACTIONABLE = YES",
      "BASELINE_REMEDIATION_READINESS = READY",
      "FINDING_IDS = CITA-001",
      "AUDIT_BASIS_FINGERPRINT = abcdef0123456789",
      "",
      resultArtifact("audit-component-implementation-tickets", "SPEC-X", "VERDICT", "IMPLEMENTATION_TICKETS_REMEDIATION_REQUIRED", "audit-result-1"),
    ].join("\n");
    await writeFile(path.join(fx.root, auditPath), auditContent);
    const head = await git(fx.root, "rev-parse", "HEAD");
    const manifestPath = "docs/workflow-checkpoints/ticket-set-audit-manifest.json";
    const markerPath = `docs/workflow-checkpoints/spec-x-checkpoint-component-implementation-tickets-audit-${head.slice(0, 12)}.md`;
    const candidate = plan({
      operation: "checkpoint-component-implementation-tickets-audit",
      entryBasis: {
        type: "transition",
        source: {
          operation: "audit-component-implementation-tickets",
          subject: "SPEC-X",
          artifactPath: auditPath,
          gateField: "VERDICT",
          gateValue: "IMPLEMENTATION_TICKETS_REMEDIATION_REQUIRED",
        },
      },
      evidenceFiles: ["skills/_shared/workflow-transition-contract.md", auditPath],
      operationInputJson: JSON.stringify({ phaseManifestPath: manifestPath, phaseMarkerPath: markerPath }),
    });
    const delegatedAgents: string[] = [];
    await assert.rejects(
      runFullWorkflow({ objective: "Create the authorized deterministic ticket-set checkpoint", maxSteps: 1 }, {
        root: fx.root,
        delegate: async (request) => {
          delegatedAgents.push(request.agent);
          if (request.agent === "workflow-controller") return { status: "completed", value: candidate };
          throw new Error(`Unexpected delegated agent: ${request.agent}`);
        },
      }),
      (error: unknown) => error instanceof OrchestrationStop && error.code === "MAX_STEPS_REACHED",
    );

    assert.deepEqual(delegatedAgents, ["workflow-controller"]);
    assert.notEqual(await git(fx.root, "rev-parse", "HEAD"), head);
    const marker = await readFile(path.join(fx.root, markerPath), "utf8");
    assert.match(marker, /WORKFLOW_RESULT_V2/);
    assert.match(marker, /NEXT_AUTHORIZED_OPERATION = remediate-component-implementation-tickets/);
  } finally { await fx.cleanup(); }
});

test("a receipt cannot route on a gate that exists only in the agent response", async () => {
  const fx = await makeRoot();
  try {
    const catalog = (await loadTransitionCatalog(fx.root)).operations;
    let controllerCalls = 0;
    let operationCalls = 0;
    const delegate = async (request: DelegationRequest): Promise<DelegationResult> => {
      if (request.agent === "workflow-controller") {
        controllerCalls += 1;
        return { status: "completed", value: controllerCalls === 1 ? plan() : terminalRecovery() };
      }
      if (request.agent === "workflow-preflight") return { status: "completed", value: semanticPreflight(request) };
      operationCalls += 1;
      return operationReceipt(fx.root, request, catalog, "COMPLETE", { persistGate: false });
    };

    await assert.rejects(
      runFullWorkflow({ objective: "Require a persisted route gate", maxSteps: 2 }, { root: fx.root, delegate }),
      (error: unknown) => error instanceof OrchestrationStop && error.code === "HUMAN_GATE_REQUIRED",
    );

    assert.equal(controllerCalls, 2);
    assert.equal(operationCalls, 1);
  } finally { await fx.cleanup(); }
});

test("semantic preflight blocker stops the skill and asks the controller for recovery", async () => {
  const fx = await makeRoot();
  try {
    let controllerCalls = 0;
    let operationCalls = 0;
    const calls: string[] = [];
    const delegate = async (request: DelegationRequest): Promise<DelegationResult> => {
      calls.push(request.agent);
      if (request.agent === "workflow-controller") {
        controllerCalls += 1;
        return { status: "completed", value: controllerCalls === 1 ? plan() : terminalRecovery() };
      }
      if (request.agent === "workflow-preflight") return { status: "completed", value: semanticPreflight(request, "BLOCKED") };
      operationCalls += 1;
      return { status: "completed" };
    };

    await assert.rejects(
      runFullWorkflow({ objective: "Stop before a semantically blocked skill", maxSteps: 2 }, { root: fx.root, delegate }),
      (error: unknown) => error instanceof OrchestrationStop && error.code === "HUMAN_GATE_REQUIRED",
    );

    assert.equal(controllerCalls, 2);
    assert.equal(operationCalls, 0);
    assert.deepEqual(calls, ["workflow-controller", "workflow-preflight", "workflow-controller"]);
  } finally { await fx.cleanup(); }
});

test("controller entry without a basis fails before semantic preflight", async () => {
  const fx = await makeRoot();
  try {
    let preflightCalls = 0;
    await assert.rejects(
      runFullWorkflow({ objective: "Require verifiable operation entry", maxSteps: 1 }, {
        root: fx.root,
        delegate: async (request) => {
          if (request.agent === "workflow-controller") return { status: "completed", value: plan({ entryBasis: null }) };
          if (request.agent === "workflow-preflight") preflightCalls += 1;
          return { status: "completed", value: semanticPreflight(request) };
        },
      }),
      (error: unknown) => error instanceof OrchestrationStop
        && error.code === "INCOMPLETE_CANONICAL_RESULT"
        && /no structured entry basis/.test(error.message),
    );
    assert.equal(preflightCalls, 0);
  } finally { await fx.cleanup(); }
});

test("controller entry with a stale source gate fails before semantic preflight", async () => {
  const fx = await makeRoot();
  try {
    let preflightCalls = 0;
    const candidate = plan();
    if (candidate.entryBasis?.type !== "transition") throw new Error("Fixture requires a transition entry basis.");
    candidate.entryBasis.source.gateValue = "STALE_GATE";
    await assert.rejects(
      runFullWorkflow({ objective: "Reject stale controller entry", maxSteps: 1 }, {
        root: fx.root,
        delegate: async (request) => {
          if (request.agent === "workflow-controller") return { status: "completed", value: candidate };
          if (request.agent === "workflow-preflight") preflightCalls += 1;
          return { status: "completed", value: semanticPreflight(request) };
        },
      }),
      (error: unknown) => error instanceof OrchestrationStop && error.code === "CANONICAL_ARTIFACT_CONTRADICTION",
    );
    assert.equal(preflightCalls, 0);
  } finally { await fx.cleanup(); }
});

test("recovery rejects a governance checkpoint without explicit preservation authorization", async () => {
  const fx = await makeRoot();
  try {
    let controllerCalls = 0;
    let preflightCalls = 0;
    await assert.rejects(
      runFullWorkflow({ objective: "Reject recovery outside the failed phase lineage", maxSteps: 2 }, {
        root: fx.root,
        delegate: async (request) => {
          if (request.agent === "workflow-controller") {
            controllerCalls += 1;
            return {
              status: "completed",
              value: controllerCalls === 1
                ? plan()
                : plan({
                  operation: "checkpoint-governance-workspace",
                  entryBasis: { type: "intake", artifactPath: "docs/entry-governance-recovery.md" },
                  evidenceFiles: ["skills/_shared/workflow-transition-contract.md", "docs/entry-governance-recovery.md"],
                  operationInputJson: JSON.stringify({ phaseManifestPath: "docs/workflow-checkpoints/governance.json" }),
                }),
            };
          }
          if (request.agent === "workflow-preflight") {
            preflightCalls += 1;
            return { status: "completed", value: semanticPreflight(request, "BLOCKED") };
          }
          throw new Error("Recovery validation must reject before dispatch.");
        },
      }),
      (error: unknown) => error instanceof OrchestrationStop
        && error.code === "CANONICAL_ARTIFACT_CONTRADICTION"
        && Array.isArray(error.details.requiredFieldMismatches)
        && (error.details.requiredFieldMismatches as unknown[]).length > 0,
    );
    assert.equal(controllerCalls, 2);
    assert.equal(preflightCalls, 1);
  } finally { await fx.cleanup(); }
});

test("recovery can resume from a valid catalog ancestor and then follows normal gates", async () => {
  const fx = await makeRoot();
  try {
    const catalog = (await loadTransitionCatalog(fx.root)).operations;
    let controllerCalls = 0;
    const calls: string[] = [];
    const delegate = async (request: DelegationRequest): Promise<DelegationResult> => {
      calls.push(request.agent);
      if (request.agent === "workflow-controller") {
        controllerCalls += 1;
        return {
          status: "completed",
          value: controllerCalls === 1
            ? plan({ operation: "generate-component-spec-from-portfolio" })
            : plan({ operation: "audit-spec-portfolio-decomposition" }),
        };
      }
      if (request.agent === "workflow-preflight") {
        return { status: "completed", value: semanticPreflight(request, calls.filter((agent) => agent === "workflow-preflight").length === 1 ? "BLOCKED" : "PASS") };
      }
      if (request.skill === "audit-spec-portfolio-decomposition") {
        return operationReceipt(fx.root, request, catalog, "READY_FOR_COMPONENT_SPEC_GENERATION");
      }
      throw new Error(`Unexpected recovery dispatch ${request.agent}/${String(request.skill)}.`);
    };

    await assert.rejects(
      runFullWorkflow({ objective: "Recover through the authorized portfolio audit", maxSteps: 2 }, { root: fx.root, delegate }),
      (error: unknown) => error instanceof OrchestrationStop && error.code === "MAX_STEPS_REACHED",
    );
    assert.equal(controllerCalls, 2);
    assert.deepEqual(calls, [
      "workflow-controller",
      "workflow-preflight",
      "workflow-controller",
      "workflow-preflight",
      "workflow-independent-auditor",
    ]);
  } finally { await fx.cleanup(); }
});

test("governance checkpoint recovery returns to the original failed operation context", async () => {
  const fx = await makeRoot();
  try {
    const catalog = (await loadTransitionCatalog(fx.root)).operations;
    let controllerCalls = 0;
    const recoveryTasks: string[] = [];
    const delegate = async (request: DelegationRequest): Promise<DelegationResult> => {
      if (request.agent === "workflow-controller") {
        controllerCalls += 1;
        recoveryTasks.push(request.task);
        if (controllerCalls === 1) return { status: "completed", value: plan() };
        if (controllerCalls === 2) {
          return {
            status: "completed",
            value: plan({
              operation: "checkpoint-governance-workspace",
              entryBasis: { type: "intake", artifactPath: "docs/entry-governance-authorized.md" },
              evidenceFiles: ["skills/_shared/workflow-transition-contract.md", "docs/entry-governance-authorized.md"],
            }),
          };
        }
        return { status: "completed", value: plan() };
      }
      if (request.agent === "workflow-preflight") return { status: "completed", value: semanticPreflight(request) };
      if (request.skill === "implement-ready-tickets") return operationReceipt(fx.root, request, catalog, "BLOCKED");
      if (request.skill === "checkpoint-governance-workspace") return operationReceipt(fx.root, request, catalog, "workflow-controller-replan");
      throw new Error(`Unexpected governance recovery dispatch ${request.agent}/${String(request.skill)}.`);
    };

    await assert.rejects(
      runFullWorkflow({ objective: "Preserve authorized process changes, then recover the ticket operation", maxSteps: 2 }, { root: fx.root, delegate }),
      (error: unknown) => error instanceof OrchestrationStop && error.code === "MAX_STEPS_REACHED",
    );
    assert.equal(controllerCalls, 3);
    assert.match(recoveryTasks[2] ?? "", /Operation requiring recovery: implement-ready-tickets/);
  } finally { await fx.cleanup(); }
});

test("exceptional recovery cannot declare COMPLETE", async () => {
  const fx = await makeRoot();
  try {
    let controllerCalls = 0;
    const delegate = async (request: DelegationRequest): Promise<DelegationResult> => {
      if (request.agent === "workflow-controller") {
        controllerCalls += 1;
        return { status: "completed", value: controllerCalls === 1 ? plan() : completePlan() };
      }
      if (request.agent === "workflow-preflight") return { status: "completed", value: semanticPreflight(request, "BLOCKED") };
      throw new Error("A blocked preflight must not dispatch the operation.");
    };

    await assert.rejects(
      runFullWorkflow({ objective: "Recovery must select an operation or stop", maxSteps: 2 }, { root: fx.root, delegate }),
      (error: unknown) => error instanceof OrchestrationStop
        && error.code === "PROCESS_AUTHORITY_DRIFT"
        && /cannot declare completion/.test(error.message),
    );
    assert.equal(controllerCalls, 2);
  } finally { await fx.cleanup(); }
});

test("startup catalog validation fails before controller intake when its agent is missing", async () => {
  const fx = await makeRoot();
  try {
    await rm(path.join(fx.root, ".pi", "agents", "workflow-preflight.md"));
    let calls = 0;

    await assert.rejects(
      runFullWorkflow({ objective: "Validate workflow before starting", maxSteps: 1 }, {
        root: fx.root,
        delegate: async () => { calls += 1; return { status: "completed", value: plan() }; },
      }),
      (error: unknown) => error instanceof OrchestrationStop && error.code === "MISSING_AGENT",
    );
    assert.equal(calls, 0);
  } finally { await fx.cleanup(); }
});

test("controller plans with invalid shape retain structured diagnostics", async () => {
  const fx = await makeRoot();
  try {
    await assert.rejects(
      runFullWorkflow({ objective: "Diagnose invalid controller output", maxSteps: 1 }, {
        root: fx.root,
        delegate: async () => ({
          status: "completed",
          runId: "controller-run-1",
          value: { decision: "EXECUTE", operation: "implement-ready-tickets" },
        }),
      }),
      (error: unknown) => {
        assert.ok(error instanceof OrchestrationStop);
        assert.equal(error.code, "SUBAGENT_FAILURE");
        assert.match(error.message, /invalid structured decision/);
        assert.deepEqual(error.details.receivedKeys, ["decision", "operation"]);
        assert.ok(Array.isArray(error.details.planIssues));
        assert.equal(error.details.runId, "controller-run-1");
        return true;
      },
    );
  } finally { await fx.cleanup(); }
});

test("request to allocate an additional worktree stops without allocation and merge authority", async () => {
  const fx = await makeRoot();
  try {
    let preflightCalls = 0;
    await assert.rejects(
      runFullWorkflow({ objective: "Require an authorized execution topology", maxSteps: 1 }, {
        root: fx.root,
        delegate: async (request) => {
          if (request.agent === "workflow-controller") return { status: "completed", value: plan({ executionIsolation: "worktree" }) };
          if (request.agent === "workflow-preflight") preflightCalls += 1;
          return { status: "completed", value: semanticPreflight(request) };
        },
      }),
      (error: unknown) => error instanceof OrchestrationStop && error.code === "UNSUPPORTED_EXECUTION_TOPOLOGY",
    );
    assert.equal(preflightCalls, 0);
  } finally { await fx.cleanup(); }
});

test("ticket-set remediation receives a fingerprinted starting snapshot after semantic preflight", async () => {
  const fx = await makeRoot();
  try {
    const catalog = (await loadTransitionCatalog(fx.root)).operations;
    const sourceOperation = "checkpoint-component-implementation-tickets-audit";
    const sourcePath = "docs/ticket-set-audit-checkpoint.md";
    const sourceGate = "remediate-component-implementation-tickets";
    await writeFile(path.join(fx.root, sourcePath), [
      `NEXT_AUTHORIZED_OPERATION = ${sourceGate}`,
      workflowResultBlock(
        { resultId: "ticket-audit-checkpoint-1", supersedesResultId: null, basis: { type: "none" } },
        sourceOperation,
        "SPEC-X",
        "NEXT_AUTHORIZED_OPERATION",
        sourceGate,
      ),
      "",
    ].join("\n"));
    const ticketFolder = path.join(fx.root, "docs", "tickets", "SPEC-X");
    await mkdir(ticketFolder, { recursive: true });
    await writeFile(path.join(ticketFolder, "X-TICKET-001-example.md"), [
      "# SPEC-X-TICKET-001 Example",
      "",
      "## 1. Status",
      "STATUS = BLOCKED",
      "BLOCKED_BY = NONE",
      "DEPENDS_ON = NONE",
      "UNBLOCKS = NONE",
      "",
    ].join("\n"));
    await writeFile(path.join(ticketFolder, "README.md"), [
      "# SPEC-X Tickets",
      "",
      "## Ticket Status Summary",
      "| Ticket | Status |",
      "| --- | --- |",
      "| X-TICKET-001 | BLOCKED |",
      "",
    ].join("\n"));

    const remediationOperation = "remediate-component-implementation-tickets";
    const candidate = plan({
      operation: remediationOperation,
      authorityFiles: [`skills/${remediationOperation}/SKILL.md`],
      evidenceFiles: ["skills/_shared/workflow-transition-contract.md", sourcePath],
      entryBasis: {
        type: "transition",
        source: {
          operation: sourceOperation,
          subject: "SPEC-X",
          artifactPath: sourcePath,
          gateField: "NEXT_AUTHORIZED_OPERATION",
          gateValue: sourceGate,
        },
      },
    });
    let preflightCalls = 0;
    let remediationTask = "";
    await assert.rejects(
      runFullWorkflow({ objective: "Resume ticket-set remediation", maxSteps: 1 }, {
        root: fx.root,
        delegate: async (request) => {
          if (request.agent === "workflow-controller") return { status: "completed", value: candidate };
          if (request.agent === "workflow-preflight") {
            preflightCalls++;
            return { status: "completed", value: semanticPreflight(request) };
          }
          if (request.skill === remediationOperation) remediationTask = request.task;
          return operationReceipt(fx.root, request, catalog, "READY_FOR_INDEPENDENT_TICKET_REAUDIT");
        },
      }),
      (error: unknown) => error instanceof OrchestrationStop && error.code === "MAX_STEPS_REACHED",
    );

    assert.equal(preflightCalls, 1);
    assert.match(remediationTask, /TICKET_SET_STATIC_ANALYSIS_MODE = REMEDIATION_BASELINE/);
    assert.match(remediationTask, /sourceFingerprints/);
    assert.match(remediationTask, /pre-remediation snapshot/);
    assert.match(remediationTask, /recompute affected counts, relationships, metrics, and graphs/);
  } finally { await fx.cleanup(); }
});
