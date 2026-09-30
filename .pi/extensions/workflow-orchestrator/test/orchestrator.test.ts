import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import test from "node:test";

import {
  ARCHITECTURE_SPECIALIST,
  BASE_SPECIALISTS,
  CONSOLIDATOR,
  OrchestrationStop,
  type AuditSliceInput,
  type DelegationRequest,
  type DelegationResult,
} from "../contracts.ts";
import { runAuditSlice, type AuditSliceDependencies } from "../orchestrator.ts";
import { workflowResultBlock } from "../workflow-lineage.ts";

const execFileAsync = promisify(execFile);

interface Fixture {
  root: string;
  input: AuditSliceInput;
  head: string;
  cleanup(): Promise<void>;
}

async function put(root: string, relative: string, content: string): Promise<void> {
  const target = path.join(root, relative);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, content, "utf8");
}

async function git(root: string, ...args: string[]): Promise<string> {
  const { stdout } = await execFileAsync("git", args, { cwd: root, encoding: "utf8" });
  return stdout.trim();
}

async function fixture(options: { architecture?: boolean; state?: string; dependencyReady?: boolean } = {}): Promise<Fixture> {
  const root = await mkdtemp(path.join(os.tmpdir(), "pi-workflow-orchestrator-"));
  await git(root, "init", "-q");
  await git(root, "config", "user.email", "test@example.invalid");
  await git(root, "config", "user.name", "Test");
  const all = [...BASE_SPECIALISTS, ARCHITECTURE_SPECIALIST, CONSOLIDATOR];
  for (const item of all) {
    await put(root, `skills/${item.skill}/SKILL.md`, `---\nname: ${item.skill}\ndescription: fixture\n---\n`);
    await put(root, `.pi/agents/${item.agent}.md`, `---\nname: ${item.agent}\ndescription: fixture\n---\n`);
  }
  await put(root, "skills/_shared/semantic-fingerprint-policy.json", JSON.stringify({
    version: 1,
    semanticExclusions: [".pi/**", "skills/**", ".codex/**", "tools/verify-*.mjs"],
    keyScopedExclusions: [{ path: "package.json", jsonPaths: ["/scripts/verify:*"], reason: "test workflow scripts" }],
  }));
  for (const shared of [
    "authority-completeness-gates.md",
    "finding-completion-readiness-contract.md",
    "baseline-drift-remediation-contract.md",
    "implementation-audit-routing-contract.md",
    "workflow-execution-topology-contract.md",
  ]) await put(root, `skills/_shared/${shared}`, "fixture\n");
  await put(root, "docs/tickets/T-001.md", `TICKET_ID = T-001\n\`STATUS: ${options.state ?? "VALIDATION_REQUIRED"}\`\n`);
  await put(root, "docs/design/T-001-design.md", "IMPLEMENTATION_DESIGN_READY\nIMPLEMENTATION_DESIGN_GATE: READY_FOR_IMPLEMENTATION\n");
  await put(
    root,
    "docs/audits/tickets.md",
    options.dependencyReady === false ? "NOT_READY_FOR_IMPLEMENTATION\n" : "IMPLEMENTATION_TICKETS_CONFORMANT\nREADY_FOR_IMPLEMENTATION\n",
  );
  await mkdir(path.join(root, "docs/audits/T-001"), { recursive: true });
  await git(root, "add", ".");
  await git(root, "commit", "-qm", "fixture");
  const head = await git(root, "rev-parse", "HEAD");
  return {
    root,
    head,
    input: {
      ticketPath: "docs/tickets/T-001.md",
      implementationDesignPath: "docs/design/T-001-design.md",
      ticketSetAuditPath: "docs/audits/tickets.md",
      targetHead: head,
      architectureRequired: options.architecture ?? true,
      architectureReason: options.architecture === false ? "" : "Ticket affects canonical authority.",
      specialistArtifacts: {
        conformance: "docs/audits/T-001/conformance.md",
        behavior: "docs/audits/T-001/behavior.md",
        design: "docs/audits/T-001/design.md",
        architecture: "docs/audits/T-001/architecture.md",
      },
      canonicalAuditPath: "docs/audits/T-001/implementation-audit.md",
    },
    cleanup: () => rm(root, { recursive: true, force: true }),
  };
}

const specialistResult: Record<string, string> = {
  "workflow-ticket-conformance-auditor": "SPECIALIST_CONFORMANCE_PASS",
  "workflow-behavior-auditor": "SPECIALIST_BEHAVIOR_PASS",
  "workflow-design-auditor": "SPECIALIST_DESIGN_PASS",
  "workflow-architecture-auditor": "SPECIALIST_ARCHITECTURE_PASS",
};

function successfulDelegate(fx: Fixture, options: { incompleteAgent?: string; blockedAgent?: string; failAgent?: string; specialistFailures?: Record<string, number>; mutate?: boolean; runtimeMutate?: boolean; consolidationFailure?: boolean; consolidationFailures?: number } = {}) {
  let consolidationAttempts = 0;
  const specialistAttempts = new Map<string, number>();
  return async (request: DelegationRequest): Promise<DelegationResult> => {
    if (request.agent === options.failAgent) return { status: "failed", error: "synthetic failure" };
    if (request.agent !== CONSOLIDATOR.agent) {
      const attempt = (specialistAttempts.get(request.agent) ?? 0) + 1;
      specialistAttempts.set(request.agent, attempt);
      if (attempt <= (options.specialistFailures?.[request.agent] ?? 0)) {
        return { status: "failed", error: "synthetic transient specialist failure" };
      }
    }
    const targetStateFingerprint = request.task.match(/Pinned AUDIT_TARGET_STATE_FINGERPRINT: ([a-f0-9]+)/)?.[1];
    const auditWaveId = request.task.match(/AUDIT_WAVE_ID: ([a-f0-9-]+)/)?.[1];
    assert.ok(targetStateFingerprint, "synthetic delegate must receive the semantic target fingerprint");
    assert.ok(auditWaveId, "synthetic delegate must receive the audit wave id");
    if (request.agent === CONSOLIDATOR.agent) {
      consolidationAttempts += 1;
      if (options.consolidationFailure || consolidationAttempts <= (options.consolidationFailures ?? 0)) return { status: "failed", error: "synthetic consolidation failure" };
      const blocked = options.blockedAgent !== undefined;
      const workflowSubject = request.task.match(/^SUBJECT_ID = (.+)$/m)?.[1] ?? "T-001";
      const resultId = request.task.match(/^RESULT_ID = (.+)$/m)?.[1];
      const supersedesText = request.task.match(/^SUPERSEDES_RESULT_ID = (.+)$/m)?.[1] ?? "NONE";
      const basisText = request.task.match(/^BASIS = (.+)$/m)?.[1];
      assert.ok(resultId, "synthetic consolidator must receive a workflow result ID");
      assert.ok(basisText, "synthetic consolidator must receive the upstream workflow basis");
      await put(
        fx.root,
        fx.input.canonicalAuditPath,
        `AUDIT_TARGET_HEAD: ${fx.head}\nAUDIT_TARGET_STATE_FINGERPRINT: ${targetStateFingerprint}\nAUDIT_WAVE_ID: ${auditWaveId}\nAUDIT_VERDICT: ${blocked ? "TICKET_IMPLEMENTATION_AUDIT_BLOCKED" : "TICKET_IMPLEMENTATION_CONFORMANT"}\nTICKET_GATE: ${blocked ? "NOT_READY_FOR_DONE" : "READY_FOR_DONE"}\nNEXT_AUTHORIZED_OPERATION: ${blocked ? "HUMAN_REQUIRED" : "finalize-implemented-ticket"}\n${workflowResultBlock({ resultId, supersedesResultId: supersedesText === "NONE" ? null : supersedesText, basis: JSON.parse(basisText) }, "audit-implemented-ticket", workflowSubject, "NEXT_AUTHORIZED_OPERATION", blocked ? "HUMAN_REQUIRED" : "finalize-implemented-ticket")}\n`,
      );
      return { status: "completed", runId: "run-consolidation" };
    }
    const key = request.nodeId as keyof AuditSliceInput["specialistArtifacts"];
    const complete = request.agent !== options.incompleteAgent;
    const specialistOutcome = request.agent === options.blockedAgent
      ? "SPECIALIST_AUDIT_BLOCKED"
      : specialistResult[request.agent];
    const artifactPath = request.task.match(/Write the required specialist audit only to: ([^\n]+)/)?.[1];
    assert.ok(artifactPath, "synthetic delegate must receive a wave-specific artifact path");
    await put(
      fx.root,
      artifactPath,
      complete
        ? `AUDIT_TARGET_HEAD: ${fx.head}\nAUDIT_TARGET_STATE_FINGERPRINT: ${targetStateFingerprint}\nAUDIT_WAVE_ID: ${auditWaveId}\nDOMAIN_AUDIT_COMPLETE: YES\nSPECIALIST_RESULT: ${specialistOutcome}\n`
        : `AUDIT_TARGET_HEAD: ${fx.head}\nAUDIT_WAVE_ID: ${auditWaveId}\nDOMAIN_AUDIT_COMPLETE: NO\n`,
    );
    if (options.mutate) await put(fx.root, "src/unauthorized.ts", "mutation\n");
    if (options.runtimeMutate) await put(fx.root, ".pi/agents/runtime-noise.md", "runtime-only\n");
    return { status: "completed", runId: `run-${key}` };
  };
}

async function expectStop(promise: Promise<unknown>, code: OrchestrationStop["code"]): Promise<void> {
  await assert.rejects(promise, (error: unknown) => error instanceof OrchestrationStop && error.code === code);
}

test("happy path joins independent specialists before canonical consolidation", async () => {
  const fx = await fixture();
  try {
    for (const artifact of Object.values(fx.input.specialistArtifacts)) {
      await put(fx.root, artifact, "AUDIT_TARGET_HEAD: stale\nAUDIT_TARGET_STATE_FINGERPRINT: stale\nAUDIT_WAVE_ID: old-wave\nDOMAIN_AUDIT_COMPLETE: YES\nSPECIALIST_RESULT: SPECIALIST_CONFORMANCE_PASS\n");
    }
    const calls: string[] = [];
    const delegate = successfulDelegate(fx);
    const result = await runAuditSlice(fx.input, {
      root: fx.root,
      delegate: async (request) => {
        calls.push(request.nodeId);
        return delegate(request);
      },
      now: () => new Date("2026-09-17T00:00:00Z"),
    });
    assert.equal(result.verdict, "TICKET_IMPLEMENTATION_CONFORMANT");
    assert.equal(result.gate, "READY_FOR_DONE");
    assert.deepEqual(new Set(calls.slice(0, 4)), new Set(["conformance", "behavior", "design", "architecture"]));
    assert.equal(calls.at(-1), "consolidation-attempt-1");
    for (const artifact of Object.values(fx.input.specialistArtifacts)) {
      const promoted = await readFile(path.join(fx.root, artifact), "utf8");
      assert.match(promoted, new RegExp(`AUDIT_WAVE_ID: ${result.runtime.executionId}`));
      assert.doesNotMatch(promoted, /old-wave/);
    }
  } finally { await fx.cleanup(); }
});

test("retries a transient specialist failure without rerunning completed specialists", async () => {
  const fx = await fixture();
  try {
    const calls: string[] = [];
    const delegate = successfulDelegate(fx, { specialistFailures: { "workflow-design-auditor": 2 } });
    const result = await runAuditSlice(fx.input, {
      root: fx.root,
      delegate: async (request) => {
        calls.push(request.nodeId);
        return delegate(request);
      },
    });
    assert.equal(result.verdict, "TICKET_IMPLEMENTATION_CONFORMANT");
    assert.equal(calls.filter((nodeId) => nodeId === "conformance").length, 1);
    assert.equal(calls.filter((nodeId) => nodeId === "behavior").length, 1);
    assert.equal(calls.filter((nodeId) => nodeId.startsWith("design")).length, 3);
    assert.equal(calls.filter((nodeId) => nodeId === "architecture").length, 1);
  } finally { await fx.cleanup(); }
});

test("retries transient consolidation failure within the same audit wave", async () => {
  const fx = await fixture();
  try {
    const result = await runAuditSlice(fx.input, {
      root: fx.root,
      delegate: successfulDelegate(fx, { consolidationFailures: 2 }),
    });
    assert.equal(result.verdict, "TICKET_IMPLEMENTATION_CONFORMANT");
    assert.equal(result.gate, "READY_FOR_DONE");
  } finally { await fx.cleanup(); }
});

test("allowed blocked specialist result reaches canonical consolidation", async () => {
  const fx = await fixture();
  try {
    const result = await runAuditSlice(fx.input, {
      root: fx.root,
      delegate: successfulDelegate(fx, { blockedAgent: "workflow-design-auditor" }),
    });
    assert.equal(result.verdict, "TICKET_IMPLEMENTATION_AUDIT_BLOCKED");
    assert.equal(result.gate, "NOT_READY_FOR_DONE");
  } finally { await fx.cleanup(); }
});

test("design status-like metadata does not change canonical ticket state", async () => {
  const fx = await fixture();
  try {
    await put(fx.root, "docs/design/T-001-design.md", "IMPLEMENTATION_DESIGN_READY\nStatus: READY\nIMPLEMENTATION_DESIGN_GATE: READY_FOR_IMPLEMENTATION\n");
    const result = await runAuditSlice(fx.input, { root: fx.root, delegate: successfulDelegate(fx) });
    assert.equal(result.verdict, "TICKET_IMPLEMENTATION_CONFORMANT");
    assert.equal(result.gate, "READY_FOR_DONE");
  } finally { await fx.cleanup(); }
});

test("blocked or unknown ticket state stops before dispatch", async () => {
  for (const state of ["BLOCKED", "MYSTERY"]) {
    const fx = await fixture({ state });
    try {
      let calls = 0;
      await expectStop(runAuditSlice(fx.input, { root: fx.root, delegate: async () => { calls++; return { status: "completed" }; } }), "AMBIGUOUS_STATE");
      assert.equal(calls, 0);
    } finally { await fx.cleanup(); }
  }
});

test("missing authority stops", async () => {
  const fx = await fixture();
  try {
    await rm(path.join(fx.root, "skills/_shared/authority-completeness-gates.md"));
    await expectStop(runAuditSlice(fx.input, { root: fx.root, delegate: successfulDelegate(fx) }), "MISSING_AUTHORITY");
  } finally { await fx.cleanup(); }
});

test("missing skill stops", async () => {
  const fx = await fixture();
  try {
    await rm(path.join(fx.root, "skills/audit-implementation-behavior/SKILL.md"));
    await expectStop(runAuditSlice(fx.input, { root: fx.root, delegate: successfulDelegate(fx) }), "MISSING_SKILL");
  } finally { await fx.cleanup(); }
});

test("missing agent stops", async () => {
  const fx = await fixture();
  try {
    await rm(path.join(fx.root, ".pi/agents/workflow-design-auditor.md"));
    await expectStop(runAuditSlice(fx.input, { root: fx.root, delegate: successfulDelegate(fx) }), "MISSING_AGENT");
  } finally { await fx.cleanup(); }
});

test("subagent failure never falls back inline", async () => {
  const fx = await fixture();
  try {
    await expectStop(
      runAuditSlice(fx.input, { root: fx.root, delegate: successfulDelegate(fx, { failAgent: "workflow-behavior-auditor" }) }),
      "SUBAGENT_FAILURE",
    );
  } finally { await fx.cleanup(); }
});

test("incomplete specialist result blocks consolidation", async () => {
  const fx = await fixture();
  try {
    await expectStop(
      runAuditSlice(fx.input, { root: fx.root, delegate: successfulDelegate(fx, { incompleteAgent: "workflow-design-auditor" }) }),
      "INCOMPLETE_SPECIALIST_RESULT",
    );
  } finally { await fx.cleanup(); }
});

test("target HEAD drift stops before dispatch", async () => {
  const fx = await fixture();
  try {
    fx.input.targetHead = "0".repeat(40);
    await expectStop(runAuditSlice(fx.input, { root: fx.root, delegate: successfulDelegate(fx) }), "TARGET_HEAD_DRIFT");
  } finally { await fx.cleanup(); }
});

test("workflow machinery changes do not invalidate the semantic target", async () => {
  const fx = await fixture();
  try {
    const result = await runAuditSlice(fx.input, { root: fx.root, delegate: successfulDelegate(fx, { runtimeMutate: true }) });
    assert.equal(result.verdict, "TICKET_IMPLEMENTATION_CONFORMANT");
    assert.equal(result.gate, "READY_FOR_DONE");
  } finally { await fx.cleanup(); }
});

test("unauthorized workspace mutation is treated as target drift and names changed files", async () => {
  const fx = await fixture();
  try {
    await assert.rejects(
      runAuditSlice(fx.input, { root: fx.root, delegate: successfulDelegate(fx, { mutate: true }) }),
      (error: unknown) => {
        assert.ok(error instanceof OrchestrationStop);
        assert.equal(error.code, "TARGET_HEAD_DRIFT");
        assert.match(error.message, /added=\[src\/unauthorized\.ts\]/);
        assert.deepEqual(error.details.changedFiles, {
          added: ["src/unauthorized.ts"],
          removed: [],
          modified: [],
        });
        return true;
      },
    );
  } finally { await fx.cleanup(); }
});

test("dependency not ready stops before dispatch", async () => {
  const fx = await fixture({ dependencyReady: false });
  try {
    await expectStop(runAuditSlice(fx.input, { root: fx.root, delegate: successfulDelegate(fx) }), "DEPENDENCY_NOT_READY");
  } finally { await fx.cleanup(); }
});

test("consolidation failure preserves the explicit human gate", async () => {
  const fx = await fixture();
  try {
    await expectStop(
      runAuditSlice(fx.input, { root: fx.root, delegate: successfulDelegate(fx, { consolidationFailure: true }) }),
      "HUMAN_GATE_REQUIRED",
    );
  } finally { await fx.cleanup(); }
});
