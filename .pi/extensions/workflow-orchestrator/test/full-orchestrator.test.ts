import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import test from "node:test";

import { OrchestrationStop, type DelegationRequest, type DelegationResult } from "../contracts.ts";
import { runFullWorkflow, type WorkflowPlan } from "../full-orchestrator.ts";

const execFileAsync = promisify(execFile);

async function git(root: string, ...args: string[]): Promise<string> {
  return (await execFileAsync("git", args, { cwd: root, encoding: "utf8" })).stdout.trim();
}

async function makeRoot(): Promise<{ root: string; cleanup(): Promise<void> }> {
  const root = await mkdtemp(path.join(os.tmpdir(), "pi-full-workflow-"));
  await git(root, "init", "-q");
  await git(root, "config", "user.email", "test@example.invalid");
  await git(root, "config", "user.name", "Test");
  await mkdir(path.join(root, "skills", "generate-component-spec-from-portfolio"), { recursive: true });
  await mkdir(path.join(root, "skills", "checkpoint-implemented-ticket"), { recursive: true });
  await mkdir(path.join(root, "skills", "checkpoint-component-gap-matrix-audit"), { recursive: true });
  await mkdir(path.join(root, "skills", "generate-component-implementation-gap-matrix"), { recursive: true });
  await mkdir(path.join(root, "skills", "checkpoint-component-implementation-plan-remediation"), { recursive: true });
  await writeFile(
    path.join(root, "skills", "generate-component-spec-from-portfolio", "SKILL.md"),
    "---\nname: generate-component-spec-from-portfolio\ndescription: fixture\n---\n",
  );
  await writeFile(
    path.join(root, "skills", "checkpoint-implemented-ticket", "SKILL.md"),
    "---\nname: checkpoint-implemented-ticket\ndescription: fixture\n---\n",
  );
  await writeFile(
    path.join(root, "skills", "checkpoint-component-gap-matrix-audit", "SKILL.md"),
    "---\nname: checkpoint-component-gap-matrix-audit\ndescription: fixture\n---\n",
  );
  await writeFile(
    path.join(root, "skills", "generate-component-implementation-gap-matrix", "SKILL.md"),
    "---\nname: generate-component-implementation-gap-matrix\ndescription: fixture\n---\n",
  );
  await writeFile(
    path.join(root, "skills", "checkpoint-component-implementation-plan-remediation", "SKILL.md"),
    "---\nname: checkpoint-component-implementation-plan-remediation\ndescription: fixture\n---\n",
  );
  await writeFile(path.join(root, "authority.md"), "APPROVED\n");
  await mkdir(path.join(root, ".pi", "agents"), { recursive: true });
  await writeFile(path.join(root, ".pi", "agents", "workflow-controller.md"), "---\nname: workflow-controller\n---\n");
  await writeFile(path.join(root, ".pi", "agents", "workflow-skill-executor.md"), "---\nname: workflow-skill-executor\n---\n");
  await writeFile(path.join(root, ".pi", "agents", "workflow-checkpoint.md"), "---\nname: workflow-checkpoint\n---\n");
  await git(root, "add", ".");
  await git(root, "commit", "-qm", "fixture");
  return { root, cleanup: () => rm(root, { recursive: true, force: true }) };
}

function plan(overrides: Partial<WorkflowPlan> = {}): WorkflowPlan {
  return {
    decision: "EXECUTE",
    operation: "generate-component-spec-from-portfolio",
    subject: "SPEC-X",
    reason: "Approved decomposition authorizes generation.",
    authorityFiles: ["skills/generate-component-spec-from-portfolio/SKILL.md"],
    evidenceFiles: ["authority.md"],
    stateFingerprint: "approved-before-spec",
    executionIsolation: "main",
    operationInputJson: "{}",
    ...overrides,
  };
}

async function expectStop(run: Promise<unknown>, code: OrchestrationStop["code"]): Promise<void> {
  await assert.rejects(run, (error: unknown) => error instanceof OrchestrationStop && error.code === code);
}

test("full workflow replans after each canonical operation until COMPLETE", async () => {
  const fx = await makeRoot();
  try {
    let controllerCalls = 0;
    const calls: string[] = [];
    const delegate = async (request: DelegationRequest): Promise<DelegationResult> => {
      calls.push(request.agent);
      if (request.agent === "workflow-controller") {
        controllerCalls++;
        return {
          status: "completed",
          value: controllerCalls === 1
            ? plan()
            : plan({ decision: "COMPLETE", operation: "", subject: "portfolio", reason: "Canonical terminal state reached.", stateFingerprint: "complete" }),
        };
      }
      await writeFile(path.join(fx.root, "generated-spec.md"), "READY_FOR_SPEC_VALIDATION\n");
      return { status: "completed" };
    };
    const result = await runFullWorkflow({ objective: "Complete the repository workflow", maxSteps: 4 }, { root: fx.root, delegate });
    assert.equal(result.status, "COMPLETE");
    assert.equal(result.steps.length, 1);
    assert.deepEqual(calls, ["workflow-controller", "workflow-skill-executor", "workflow-controller"]);
  } finally { await fx.cleanup(); }
});

test("invalid controller plans expose structured diagnostics", async () => {
  const fx = await makeRoot();
  try {
    await assert.rejects(
      runFullWorkflow(
        { objective: "diagnose controller", maxSteps: 1 },
        {
          root: fx.root,
          delegate: async (request) => request.agent === "workflow-controller"
            ? {
              status: "completed",
              runId: "controller-run-1",
              value: { decision: "EXECUTE", operation: "generate-component-spec-from-portfolio" },
            }
            : { status: "completed" },
        },
      ),
      (error: unknown) => {
        assert.ok(error instanceof OrchestrationStop);
        assert.equal(error.code, "SUBAGENT_FAILURE");
        assert.match(error.message, /status=completed/);
        assert.match(error.message, /issues=/);
        assert.equal(error.details.failureClass, "INVALID_WORKFLOW_PLAN");
        assert.equal(error.details.runId, "controller-run-1");
        assert.deepEqual(error.details.receivedKeys, ["decision", "operation"]);
        assert.match(String(error.details.responsePreview), /generate-component-spec-from-portfolio/);
        assert.equal(error.details.controllerNodeId, "controller-1-attempt-1");
        return true;
      },
    );
  } finally { await fx.cleanup(); }
});

test("controller delegation failures expose status, run id, and error", async () => {
  const fx = await makeRoot();
  try {
    await assert.rejects(
      runFullWorkflow(
        { objective: "diagnose controller", maxSteps: 1 },
        {
          root: fx.root,
          delegate: async (request) => request.agent === "workflow-controller"
            ? { status: "failed", runId: "controller-run-2", error: "provider unavailable" }
            : { status: "completed" },
        },
      ),
      (error: unknown) => {
        assert.ok(error instanceof OrchestrationStop);
        assert.equal(error.code, "SUBAGENT_FAILURE");
        assert.match(error.message, /status=failed/);
        assert.match(error.message, /error=provider unavailable/);
        assert.equal(error.details.failureClass, "CONTROLLER_DELEGATION_FAILURE");
        assert.equal(error.details.runId, "controller-run-2");
        assert.equal(error.details.error, "provider unavailable");
        return true;
      },
    );
  } finally { await fx.cleanup(); }
});

test("checkpoint operation creates one local commit and replans from its new HEAD", async () => {
  const fx = await makeRoot();
  try {
    let controllerCalls = 0;
    const checkpointSkill = "skills/checkpoint-implemented-ticket/SKILL.md";
    const calls: string[] = [];
    const delegate = async (request: DelegationRequest): Promise<DelegationResult> => {
      calls.push(request.agent);
      if (request.agent === "workflow-controller") {
        controllerCalls++;
        return {
          status: "completed",
          value: controllerCalls === 1
            ? plan({ operation: "checkpoint-implemented-ticket", authorityFiles: [checkpointSkill] })
            : plan({ decision: "COMPLETE", operation: "", subject: "ticket", reason: "Checkpoint complete.", stateFingerprint: "complete" }),
        };
      }
      await writeFile(path.join(fx.root, "checkpoint-marker.md"), "CHECKPOINT_COMPLETE\n");
      await git(fx.root, "add", "checkpoint-marker.md");
      await git(fx.root, "commit", "-qm", "checkpoint(SPEC-X/T001): implementation");
      return { status: "completed", value: "CHECKPOINT_COMPLETE\nCHECKPOINT_HEAD = pending\n" };
    };
    const result = await runFullWorkflow({ objective: "Create checkpoint", maxSteps: 2 }, { root: fx.root, delegate });
    assert.equal(result.status, "COMPLETE");
    assert.equal(result.steps.length, 1);
    assert.match(result.steps[0].result, /^checkpoint-created\/[0-9a-f]{40}$/);
    assert.deepEqual(calls, ["workflow-controller", "workflow-checkpoint", "workflow-controller"]);
  } finally { await fx.cleanup(); }
});

test("phase checkpoint operation creates a local commit and replans", async () => {
  const fx = await makeRoot();
  try {
    let controllerCalls = 0;
    const delegate = async (request: DelegationRequest): Promise<DelegationResult> => {
      if (request.agent === "workflow-controller") {
        controllerCalls++;
        return {
          status: "completed",
          value: controllerCalls === 1
            ? plan({ operation: "checkpoint-component-gap-matrix-audit", authorityFiles: ["skills/checkpoint-component-gap-matrix-audit/SKILL.md"] })
            : plan({ decision: "COMPLETE", operation: "", subject: "gap-matrix", reason: "Phase checkpoint complete.", stateFingerprint: "complete" }),
        };
      }
      await writeFile(path.join(fx.root, "gap-matrix-checkpoint.md"), "CHECKPOINT_COMPLETE\n");
      await git(fx.root, "add", "gap-matrix-checkpoint.md");
      await git(fx.root, "commit", "-qm", "checkpoint(SPEC-X): gap matrix audit");
      return { status: "completed", value: "CHECKPOINT_COMPLETE\nPHASE_CHECKPOINT_COMPLETE\n" };
    };
    const result = await runFullWorkflow({ objective: "Create phase checkpoint", maxSteps: 2 }, { root: fx.root, delegate });
    assert.equal(result.status, "COMPLETE");
    assert.equal(result.steps[0].operation, "checkpoint-component-gap-matrix-audit");
    assert.match(result.steps[0].result, /^checkpoint-created\/[0-9a-f]{40}$/);
  } finally { await fx.cleanup(); }
});

test("idempotent producer completion is accepted when output is already reconciled", async () => {
  const fx = await makeRoot();
  try {
    let controllerCalls = 0;
    const delegate = async (request: DelegationRequest): Promise<DelegationResult> => {
      if (request.agent === "workflow-controller") {
        controllerCalls++;
        return {
          status: "completed",
          value: controllerCalls === 1
            ? plan({ operation: "generate-component-implementation-gap-matrix", authorityFiles: ["skills/generate-component-implementation-gap-matrix/SKILL.md"] })
            : plan({ decision: "COMPLETE", operation: "", subject: "gap-matrix", reason: "Producer result already reconciled.", stateFingerprint: "complete" }),
        };
      }
      return { status: "completed", value: "COMPONENT_IMPLEMENTATION_GAP_MATRIX_COMPLETE\nRESULT:\nREADY_FOR_IMPLEMENTATION_PLAN\n" };
    };
    const result = await runFullWorkflow({ objective: "Replay reconciled producer", maxSteps: 2 }, { root: fx.root, delegate });
    assert.equal(result.status, "COMPLETE");
    assert.equal(result.steps.length, 1);
  } finally { await fx.cleanup(); }
});

test("plan remediation checkpoint rejects contradictory canonical gate", async () => {
  const fx = await makeRoot();
  try {
    let controllerCalls = 0;
    await assert.rejects(
      runFullWorkflow(
        { objective: "reject contradictory checkpoint", maxSteps: 1 },
        {
          root: fx.root,
          delegate: async (request) => {
            if (request.agent === "workflow-controller") {
              controllerCalls++;
              return {
                status: "completed",
                value: plan({ operation: "checkpoint-component-implementation-plan-remediation", authorityFiles: ["skills/checkpoint-component-implementation-plan-remediation/SKILL.md"] }),
              };
            }
            await mkdir(path.join(fx.root, "docs", "specs", "implementation-plans"), { recursive: true });
            await mkdir(path.join(fx.root, "docs", "workflow-checkpoints"), { recursive: true });
            await writeFile(path.join(fx.root, "docs", "specs", "implementation-plans", "SPEC-EXEC-001-implementation-plan.md"), "IMPLEMENTATION_PLAN_GATE: REMEDIATION_PENDING_INDEPENDENT_REAUDIT\n");
            await writeFile(path.join(fx.root, "docs", "workflow-checkpoints", "SPEC-EXEC-001-component-implementation-plan-remediation.md"), "REMEDIATION_VERDICT = COMPONENT_IMPLEMENTATION_PLAN_REMEDIATION_COMPLETE\nNEXT_AUTHORIZED_OPERATION = audit-component-implementation-plan\n");
            await git(fx.root, "add", "docs");
            await git(fx.root, "commit", "-qm", "checkpoint fixture");
            return { status: "completed", value: "CHECKPOINT_COMPLETE\n" };
          },
        },
      ),
      (error: unknown) => {
        assert.ok(error instanceof OrchestrationStop);
        assert.equal(error.code, "CANONICAL_ARTIFACT_CONTRADICTION");
        assert.match(error.message, /Plan remediation checkpoint routes to audit/);
        return true;
      },
    );
    assert.equal(controllerCalls, 1);
  } finally { await fx.cleanup(); }
});

test("repeated artifact producer stops before a loop without its generation checkpoint", async () => {
  const fx = await makeRoot();
  try {
    let controllerCalls = 0;
    let producerCalls = 0;
    await assert.rejects(
      runFullWorkflow(
        { objective: "stop producer loop", maxSteps: 3 },
        {
          root: fx.root,
          delegate: async (request) => {
            if (request.agent === "workflow-controller") {
              controllerCalls++;
              return {
                status: "completed",
                value: controllerCalls === 1
                  ? plan({ operation: "generate-component-implementation-gap-matrix", authorityFiles: ["skills/generate-component-implementation-gap-matrix/SKILL.md"] })
                  : plan({ operation: "generate-component-implementation-gap-matrix", authorityFiles: ["skills/generate-component-implementation-gap-matrix/SKILL.md"], stateFingerprint: `after-${controllerCalls}` }),
              };
            }
            producerCalls++;
            await writeFile(path.join(fx.root, "matrix.md"), `MATRIX-${producerCalls}\n`);
            return { status: "completed", value: "COMPONENT_IMPLEMENTATION_GAP_MATRIX_COMPLETE\n" };
          },
        },
      ),
      (error: unknown) => {
        assert.ok(error instanceof OrchestrationStop);
        assert.equal(error.code, "AMBIGUOUS_STATE");
        assert.match(error.message, /same artifact producer/);
        assert.equal(error.details.requiredTransition, "checkpoint-component-gap-matrix-generation");
        return true;
      },
    );
    assert.equal(producerCalls, 1);
  } finally { await fx.cleanup(); }
});

test("stale audit target is discarded and replanned before execution", async () => {
  const fx = await makeRoot();
  try {
    let controllerCalls = 0;
    const calls: string[] = [];
    const delegate = async (request: DelegationRequest): Promise<DelegationResult> => {
      calls.push(request.agent);
      if (request.agent === "workflow-controller") {
        controllerCalls++;
        return {
          status: "completed",
          value: controllerCalls === 1
            ? plan({
              operation: "audit-implemented-ticket",
              operationInputJson: JSON.stringify({ targetHead: "0".repeat(40) }),
            })
            : plan({ decision: "COMPLETE", operation: "", subject: "ticket", reason: "Current-head plan accepted.", stateFingerprint: "complete" }),
        };
      }
      throw new Error("stale plan must not dispatch an operation agent");
    };
    const result = await runFullWorkflow({ objective: "Continue the ticket workflow", maxSteps: 1 }, { root: fx.root, delegate });
    assert.equal(result.status, "COMPLETE");
    assert.equal(result.steps.length, 0);
    assert.deepEqual(calls, ["workflow-controller", "workflow-controller"]);
  } finally { await fx.cleanup(); }
});

test("human-required decision stops without executing an operation", async () => {
  const fx = await makeRoot();
  try {
    let calls = 0;
    await expectStop(
      runFullWorkflow(
        { objective: "continue", maxSteps: 2 },
        {
          root: fx.root,
          delegate: async () => {
            calls++;
            return { status: "completed", value: plan({ decision: "HUMAN_REQUIRED", operation: "", reason: "Architecture choice required." }) };
          },
        },
      ),
      "HUMAN_GATE_REQUIRED",
    );
    assert.equal(calls, 1);
  } finally { await fx.cleanup(); }
});

test("missing selected skill stops before execution", async () => {
  const fx = await makeRoot();
  try {
    await expectStop(
      runFullWorkflow(
        { objective: "continue", maxSteps: 2 },
        { root: fx.root, delegate: async () => ({ status: "completed", value: plan({ operation: "missing-skill", authorityFiles: ["skills/missing-skill/SKILL.md"] }) }) },
      ),
      "MISSING_SKILL",
    );
  } finally { await fx.cleanup(); }
});

test("missing cited authority stops before execution", async () => {
  const fx = await makeRoot();
  try {
    await expectStop(
      runFullWorkflow(
        { objective: "continue", maxSteps: 2 },
        { root: fx.root, delegate: async () => ({ status: "completed", value: plan({ authorityFiles: ["skills/generate-component-spec-from-portfolio/SKILL.md", "missing-authority.md"] }) }) },
      ),
      "MISSING_AUTHORITY",
    );
  } finally { await fx.cleanup(); }
});

test("missing execution agent stops before delegation", async () => {
  const fx = await makeRoot();
  try {
    await rm(path.join(fx.root, ".pi", "agents", "workflow-skill-executor.md"));
    await expectStop(
      runFullWorkflow(
        { objective: "continue", maxSteps: 2 },
        { root: fx.root, delegate: async () => ({ status: "completed", value: plan() }) },
      ),
      "MISSING_AGENT",
    );
  } finally { await fx.cleanup(); }
});

test("worktree requirement stops because repository has no allocation and merge authority", async () => {
  const fx = await makeRoot();
  try {
    await expectStop(
      runFullWorkflow(
        { objective: "continue", maxSteps: 2 },
        { root: fx.root, delegate: async () => ({ status: "completed", value: plan({ executionIsolation: "worktree" }) }) },
      ),
      "UNSUPPORTED_EXECUTION_TOPOLOGY",
    );
  } finally { await fx.cleanup(); }
});

test("successful child without canonical state change is not progress", async () => {
  const fx = await makeRoot();
  try {
    await expectStop(
      runFullWorkflow(
        { objective: "continue", maxSteps: 2 },
        {
          root: fx.root,
          delegate: async (request) => request.agent === "workflow-controller"
            ? { status: "completed", value: plan() }
            : { status: "completed" },
        },
      ),
      "INCOMPLETE_CANONICAL_RESULT",
    );
  } finally { await fx.cleanup(); }
});
