import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { chmod, cp, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";

import { executeTicketSetCheckpoint, type TicketSetCheckpointInput } from "../phase-checkpoint.ts";
import type { WorkflowResultContext } from "../workflow-lineage.ts";

const execFileAsync = promisify(execFile);
const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../../");
const subject = "SPEC-X";
const auditOperation = "audit-component-implementation-tickets";
const remediationOperation = "remediate-component-implementation-tickets";
const auditCheckpoint = "checkpoint-component-implementation-tickets-audit";
const remediationCheckpoint = "checkpoint-component-implementation-tickets-remediation";
const auditGate = "IMPLEMENTATION_TICKETS_REMEDIATION_REQUIRED";
const remediationGate = "READY_FOR_INDEPENDENT_TICKET_REAUDIT";

async function git(root: string, ...args: string[]): Promise<string> {
  return (await execFileAsync("git", args, { cwd: root, encoding: "utf8" })).stdout.trim();
}

async function makeRoot(): Promise<{ root: string; cleanup(): Promise<void> }> {
  const root = await mkdtemp(path.join(os.tmpdir(), "pi-phase-checkpoint-"));
  await mkdir(path.join(root, "tools"), { recursive: true });
  await mkdir(path.join(root, "docs"), { recursive: true });
  await cp(path.join(repositoryRoot, "tools", "verify-phase-manifest.mjs"), path.join(root, "tools", "verify-phase-manifest.mjs"));
  await writeFile(path.join(root, "tools", "pass-check.mjs"), "process.exit(0);\n");
  await writeFile(path.join(root, "package.json"), JSON.stringify({
    private: true,
    scripts: {
      "verify:canonical-consistency": "node tools/pass-check.mjs",
      "verify:audit-governance": "node tools/pass-check.mjs",
    },
  }, null, 2));
  await git(root, "init", "-q");
  await git(root, "config", "user.email", "checkpoint-test@example.invalid");
  await git(root, "config", "user.name", "Checkpoint Test");
  await git(root, "add", ".");
  await git(root, "commit", "-qm", "checkpoint fixture");
  return { root, cleanup: () => rm(root, { recursive: true, force: true }) };
}

function resultBlock(operation: string, resultId: string, gateField: string, gateValue: string, basis: unknown = { type: "none" }): string {
  return [
    "<!-- WORKFLOW_RESULT_V2",
    `OPERATION = ${operation}`,
    `SUBJECT_ID = ${subject}`,
    `RESULT_ID = ${resultId}`,
    "SUPERSEDES_RESULT_ID = NONE",
    `GATE_FIELD = ${gateField}`,
    `GATE_VALUE = ${gateValue}`,
    `BASIS = ${JSON.stringify(basis)}`,
    "-->",
  ].join("\n");
}

function auditReport(): string {
  return [
    "# Ticket-set audit",
    "",
    `VERDICT = ${auditGate}`,
    "TICKET_DECOMPOSITION_GATE = READY_FOR_TICKET_AUDIT",
    "BASELINE_DRIFT_STATUS = NO_DRIFT",
    "REASSESSMENT_COMPLETE = YES",
    "BASELINE_REASSESSMENT_PROOF = NONE",
    "FINDINGS_ARE_ACTIONABLE = YES",
    "BASELINE_REMEDIATION_READINESS = READY",
    "FINDING_IDS = CITA-001",
    "AUDIT_BASIS_FINGERPRINT = abcdef0123456789",
    "",
    resultBlock(auditOperation, "audit-result-1", "VERDICT", auditGate),
    "",
  ].join("\n");
}

function auditWorkflowBasis(): WorkflowResultContext {
  return {
    resultId: "checkpoint-audit-result-1",
    supersedesResultId: null,
    basis: {
      type: "transition",
      source: {
        operation: auditOperation,
        subject,
        resultId: "audit-result-1",
        artifactPath: "docs/ticket-set-audit.md",
        gateField: "VERDICT",
        gateValue: auditGate,
        fields: {},
      },
    },
  };
}

function catalog(operation: string, next: string): TicketSetCheckpointInput["catalog"] {
  return { operations: { [operation]: { routes: { [next]: next } } } } as unknown as TicketSetCheckpointInput["catalog"];
}

function checkpointInput(
  root: string,
  operation: TicketSetCheckpointInput["operation"],
  sourceOperation: string,
  sourceGateField: string,
  sourceGateValue: string,
  sourceResultId: string,
  evidenceFiles: string[],
  basis?: WorkflowResultContext,
  manifestPath = `docs/workflow-checkpoints/${operation}-manifest.json`,
  markerPath = `docs/workflow-checkpoints/${operation}.md`,
): TicketSetCheckpointInput {
  return {
    root,
    executionId: "test-execution",
    step: 1,
    operation,
    subject,
    parentHead: "",
    operationInputJson: JSON.stringify({ phaseManifestPath: manifestPath, phaseMarkerPath: markerPath }),
    evidenceFiles,
    workflowResult: basis ?? {
      resultId: `checkpoint-${operation}-result-1`,
      supersedesResultId: null,
      basis: {
        type: "transition",
        source: {
          operation: sourceOperation,
          subject,
          resultId: sourceResultId,
          artifactPath: sourceOperation === auditOperation ? "docs/ticket-set-audit.md" : "docs/ticket-set-remediation.md",
          gateField: sourceGateField,
          gateValue: sourceGateValue,
          fields: {},
        },
      },
    },
    catalog: catalog(operation, operation === auditCheckpoint ? remediationOperation : auditOperation),
  };
}

async function addAuditDirtyCandidate(root: string): Promise<string> {
  const auditPath = "docs/ticket-set-audit.md";
  await writeFile(path.join(root, auditPath), auditReport());
  return auditPath;
}

test("audit ticket-set checkpoint commits its exact allowlist in the active linked worktree", async () => {
  const fx = await makeRoot();
  const linkedRoot = `${fx.root}-linked`;
  let linked = false;
  try {
    await git(fx.root, "worktree", "add", "--detach", linkedRoot, "HEAD");
    linked = true;
    await mkdir(path.join(linkedRoot, "docs", "workflow-checkpoints"), { recursive: true });
    const auditPath = await addAuditDirtyCandidate(linkedRoot);
    const parentHead = await git(linkedRoot, "rev-parse", "HEAD");
    const events: string[] = [];
    const input = checkpointInput(linkedRoot, auditCheckpoint, auditOperation, "VERDICT", auditGate, "audit-result-1", [auditPath]);
    input.parentHead = parentHead;
    input.workflowResult = auditWorkflowBasis();
    input.onEvent = (event) => { events.push(event.event); };

    const result = await executeTicketSetCheckpoint(input);
    const parents = (await git(linkedRoot, "show", "-s", "--format=%P", result.commitHead)).split(/\s+/).filter(Boolean);
    const committed = (await git(linkedRoot, "diff-tree", "--no-commit-id", "--name-only", "--no-renames", "-r", result.commitHead)).split(/\r?\n/).filter(Boolean).sort();
    const manifestPath = JSON.parse(input.operationInputJson).phaseManifestPath as string;
    const markerPath = JSON.parse(input.operationInputJson).phaseMarkerPath as string;

    assert.deepEqual(parents, [parentHead]);
    assert.deepEqual(committed, [auditPath, manifestPath, markerPath].sort());
    assert.equal(await git(fx.root, "rev-parse", "HEAD"), parentHead, "the primary worktree must remain unchanged");
    assert.equal(result.receipt.gateValue, remediationOperation);
    assert.ok(events.includes("checkpoint_validation_completed"));
    assert.ok(events.includes("checkpoint_commit_completed"));
    assert.match(await readFile(path.join(linkedRoot, markerPath), "utf8"), /WORKFLOW_RESULT_V2/);
  } finally {
    if (linked) await git(fx.root, "worktree", "remove", "--force", linkedRoot).catch(() => undefined);
    await fx.cleanup();
  }
});

test("audit checkpoint rejects candidate whitespace before creating phase artifacts", async () => {
  const fx = await makeRoot();
  try {
    await mkdir(path.join(fx.root, "docs", "workflow-checkpoints"), { recursive: true });
    const auditPath = await addAuditDirtyCandidate(fx.root);
    await writeFile(
      path.join(fx.root, auditPath),
      auditReport().replace("AUDIT_BASIS_FINGERPRINT = abcdef0123456789", "AUDIT_BASIS_FINGERPRINT = abcdef0123456789   "),
    );
    const input = checkpointInput(fx.root, auditCheckpoint, auditOperation, "VERDICT", auditGate, "audit-result-1", [auditPath]);
    input.parentHead = await git(fx.root, "rev-parse", "HEAD");
    input.workflowResult = auditWorkflowBasis();
    const { phaseManifestPath, phaseMarkerPath } = JSON.parse(input.operationInputJson) as {
      phaseManifestPath: string;
      phaseMarkerPath: string;
    };
    const indexPath = path.resolve(fx.root, await git(fx.root, "rev-parse", "--git-path", "index"));
    const indexBefore = await readFile(indexPath);

    await assert.rejects(executeTicketSetCheckpoint(input), /trailing whitespace in an untracked artifact/);
    assert.equal(await git(fx.root, "rev-parse", "HEAD"), input.parentHead);
    assert.deepEqual(await readFile(indexPath), indexBefore);
    await assert.rejects(readFile(path.join(fx.root, phaseManifestPath)), { code: "ENOENT" });
    await assert.rejects(readFile(path.join(fx.root, phaseMarkerPath)), { code: "ENOENT" });
  } finally { await fx.cleanup(); }
});

test("audit checkpoint normalizes only redundant line endings after its current extension-owned V2 block", async () => {
  const fx = await makeRoot();
  try {
    await mkdir(path.join(fx.root, "docs", "workflow-checkpoints"), { recursive: true });
    const auditPath = await addAuditDirtyCandidate(fx.root);
    await writeFile(path.join(fx.root, auditPath), `${auditReport()}\n\n`);
    const input = checkpointInput(fx.root, auditCheckpoint, auditOperation, "VERDICT", auditGate, "audit-result-1", [auditPath]);
    input.parentHead = await git(fx.root, "rev-parse", "HEAD");
    input.workflowResult = auditWorkflowBasis();

    await executeTicketSetCheckpoint(input);
    const checkpointedAudit = await readFile(path.join(fx.root, auditPath), "utf8");
    assert.ok(checkpointedAudit.endsWith(`${resultBlock(auditOperation, "audit-result-1", "VERDICT", auditGate)}\n`));
    assert.ok(!checkpointedAudit.endsWith(`${resultBlock(auditOperation, "audit-result-1", "VERDICT", auditGate)}\n\n`));
  } finally { await fx.cleanup(); }
});

test("checkpoint commit failure restores the original index and removes its owned artifacts", async () => {
  const fx = await makeRoot();
  try {
    await mkdir(path.join(fx.root, "docs", "workflow-checkpoints"), { recursive: true });
    const auditPath = await addAuditDirtyCandidate(fx.root);
    const hooksPath = path.resolve(fx.root, await git(fx.root, "rev-parse", "--git-path", "hooks"));
    await mkdir(hooksPath, { recursive: true });
    await writeFile(path.join(hooksPath, "pre-commit"), "#!/bin/sh\nexit 1\n");
    await chmod(path.join(hooksPath, "pre-commit"), 0o755);
    await git(fx.root, "config", "core.hooksPath", hooksPath);
    const input = checkpointInput(fx.root, auditCheckpoint, auditOperation, "VERDICT", auditGate, "audit-result-1", [auditPath]);
    input.parentHead = await git(fx.root, "rev-parse", "HEAD");
    input.workflowResult = auditWorkflowBasis();
    const { phaseManifestPath, phaseMarkerPath } = JSON.parse(input.operationInputJson) as {
      phaseManifestPath: string;
      phaseMarkerPath: string;
    };
    const treeBefore = await git(fx.root, "write-tree");
    const events: Array<{ event: string; fields: Record<string, unknown> }> = [];
    input.onEvent = (event) => { events.push(event); };

    await assert.rejects(executeTicketSetCheckpoint(input), /Git command failed/);
    assert.equal(await git(fx.root, "rev-parse", "HEAD"), input.parentHead);
    assert.equal(await git(fx.root, "diff", "--cached", "--name-only"), "");
    assert.equal(await git(fx.root, "write-tree"), treeBefore);
    assert.ok(events.some((event) => event.event === "checkpoint_rollback_completed"));
    await assert.rejects(readFile(path.join(fx.root, phaseManifestPath)), { code: "ENOENT" });
    await assert.rejects(readFile(path.join(fx.root, phaseMarkerPath)), { code: "ENOENT" });
    assert.equal(await readFile(path.join(fx.root, auditPath), "utf8"), auditReport());
    const status = await git(fx.root, "status", "--short", "--untracked-files=all");
    assert.ok(status.includes(auditPath), status);
  } finally { await fx.cleanup(); }
});

test("audit ticket-set checkpoint refuses to stage a declared recovery path", async () => {
  const fx = await makeRoot();
  try {
    await mkdir(path.join(fx.root, "docs", "workflow-checkpoints"), { recursive: true });
    const auditPath = await addAuditDirtyCandidate(fx.root);
    const recoveryPath = "docs/local-recovery.md";
    await writeFile(path.join(fx.root, recoveryPath), "preserve without staging\n");
    await git(fx.root, "add", recoveryPath);
    const input = checkpointInput(fx.root, auditCheckpoint, auditOperation, "VERDICT", auditGate, "audit-result-1", [auditPath]);
    input.parentHead = await git(fx.root, "rev-parse", "HEAD");
    input.operationInputJson = JSON.stringify({
      phaseManifestPath: "docs/workflow-checkpoints/blocked-manifest.json",
      phaseMarkerPath: "docs/workflow-checkpoints/blocked-marker.md",
      preserveUnstagedRecoveryPaths: [recoveryPath],
    });

    await assert.rejects(executeTicketSetCheckpoint(input), /staged paths outside the effective allowlist/);
    assert.equal(await git(fx.root, "rev-parse", "HEAD"), input.parentHead);
    await assert.rejects(readFile(path.join(fx.root, "docs", "workflow-checkpoints", "blocked-manifest.json")));
  } finally { await fx.cleanup(); }
});

test("phase manifest verifier rejects recovery paths already present in the index", async () => {
  const fx = await makeRoot();
  try {
    const authorityPath = "docs/authority.md";
    const candidatePath = "docs/candidate.md";
    const recoveryPath = "docs/recovery.md";
    const markerPath = "docs/checkpoint.md";
    const manifestPath = "docs/checkpoint-manifest.json";
    const authority = "canonical source authority\n";
    await writeFile(path.join(fx.root, authorityPath), authority);
    await git(fx.root, "add", authorityPath);
    await git(fx.root, "commit", "-qm", "add manifest authority");
    const parentHead = await git(fx.root, "rev-parse", "HEAD");
    await writeFile(path.join(fx.root, candidatePath), "preserved candidate\n");
    await writeFile(path.join(fx.root, recoveryPath), "must remain unstaged\n");
    await writeFile(path.join(fx.root, markerPath), "checkpoint marker\n");
    const manifest = {
      schemaVersion: 1,
      manifestKind: "PHASE_CHECKPOINT",
      phaseId: "manifest-test",
      operation: auditCheckpoint,
      subject: { id: subject, type: "component" },
      sourceAuthority: [{
        path: authorityPath,
        sha256: createHash("sha256").update(authority).digest("hex"),
      }],
      target: { head: parentHead, semanticFingerprint: "fixture-fingerprint" },
      paths: {
        manifest: manifestPath,
        preserve: [candidatePath],
        delete: [],
        unstagedRecovery: [recoveryPath],
        marker: markerPath,
      },
      nextAuthorizedOperation: remediationOperation,
      commitMessage: "checkpoint test",
    };
    await writeFile(path.join(fx.root, manifestPath), `${JSON.stringify(manifest, null, 2)}\n`);
    await git(fx.root, "add", recoveryPath);

    await assert.rejects(
      execFileAsync(process.execPath, [path.join(fx.root, "tools", "verify-phase-manifest.mjs"), "--manifest", manifestPath], {
        cwd: fx.root,
        encoding: "utf8",
      }),
      (error: unknown) => String((error as { stderr?: string }).stderr ?? "").includes("recovery paths must remain unstaged"),
    );
  } finally { await fx.cleanup(); }
});

test("ticket-set remediation checkpoint preserves an existing implemented-ticket V2 result", async () => {
  const fx = await makeRoot();
  try {
    await mkdir(path.join(fx.root, "docs", "workflow-checkpoints"), { recursive: true });
    const ticketFolder = "docs/tickets/SPEC-X";
    const ticketPath = `${ticketFolder}/SPEC-X-TICKET-001-primary.md`;
    const indexPath = `${ticketFolder}/README.md`;
    const preservedT001Path = `${ticketFolder}/evidence/T001-implementation-audit.md`;
    await mkdir(path.dirname(path.join(fx.root, ticketPath)), { recursive: true });
    await mkdir(path.dirname(path.join(fx.root, preservedT001Path)), { recursive: true });
    const initialTicket = "# SPEC-X-TICKET-001 Example\n\n## 1. Status\nSTATUS: BLOCKED\nBLOCKED_BY: CITA-001\n";
    const initialIndex = "| ID | Status |\n| --- | --- |\n| SPEC-X-TICKET-001 | BLOCKED |\n";
    const preservedT001 = `# Existing T001 result\n\n${resultBlock("audit-implemented-ticket", "t001-result-v2", "AUDIT_VERDICT", "IMPLEMENTATION_AUDIT_REMEDIATION_REQUIRED")}\n`;
    const auditPath = "docs/ticket-set-audit.md";
    await writeFile(path.join(fx.root, ticketPath), initialTicket);
    await writeFile(path.join(fx.root, indexPath), initialIndex);
    await writeFile(path.join(fx.root, preservedT001Path), preservedT001);
    await writeFile(path.join(fx.root, auditPath), auditReport());
    await git(fx.root, "add", "docs");
    await git(fx.root, "commit", "-qm", "persist source audit, ticket baseline and existing T001 result");
    const auditDigest = createHash("sha256").update(await readFile(path.join(fx.root, auditPath))).digest("hex");

    const finalTicket = "# SPEC-X-TICKET-001 Example\n\n## 1. Status\nSTATUS: READY\nBLOCKED_BY: NONE\n";
    const finalIndex = "| ID | Status |\n| --- | --- |\n| SPEC-X-TICKET-001 | READY |\n";
    await writeFile(path.join(fx.root, ticketPath), finalTicket);
    await writeFile(path.join(fx.root, indexPath), finalIndex);
    const fingerprintPaths = [indexPath, ticketPath].sort((left, right) => left.localeCompare(right));
    const fingerprintRows = await Promise.all(fingerprintPaths.map(async (file) => {
      const digest = createHash("sha256").update(await readFile(path.join(fx.root, file))).digest("hex");
      return `${file}\t${digest}\n`;
    }));
    const candidateFingerprint = createHash("sha256").update(fingerprintRows.join("")).digest("hex");
    const remediationPath = "docs/ticket-set-remediation.md";
    const remediationBody = [
      "# Ticket-set remediation",
      "",
      `SOURCE_AUDIT = ${auditPath}`,
      "SOURCE_AUDIT_RESULT_ID = audit-result-1",
      `SOURCE_AUDIT_SHA256 = ${auditDigest}`,
      "FINDINGS_RECEIVED = 1",
      "FINDINGS_REMEDIATED = 1",
      `TICKET_FOLDER = ${ticketFolder}`,
      `TICKET_INDEX = ${indexPath}`,
      "TICKETS_AFTER = 1",
      `REMEDIATION_CANDIDATE_FINGERPRINT = SHA256 ${candidateFingerprint} over sorted path/hash rows`,
      "DEPENDENCY_GRAPH_CYCLE = NO",
      "BLOCKER_GRAPH_CYCLE = NO",
      "INITIAL_DAG_STATE_PRESERVED = YES",
      "DOWNSTREAM_TICKET_STATE_MUTATIONS = 0",
      "REMEDIATION_VERDICT = COMPONENT_IMPLEMENTATION_TICKET_REMEDIATION_COMPLETE",
      "GATE = READY_FOR_INDEPENDENT_TICKET_REAUDIT",
      "",
      "FILES_CHANGED =",
      ticketPath,
      indexPath,
      "",
      resultBlock(remediationOperation, "remediation-result-1", "GATE", remediationGate, {
        type: "transition",
        source: {
          operation: auditOperation,
          subject,
          resultId: "audit-result-1",
          artifactPath: auditPath,
          gateField: "VERDICT",
          gateValue: auditGate,
          fields: {},
        },
      }),
      "",
    ].join("\n");
    await writeFile(path.join(fx.root, remediationPath), remediationBody);
    const parentHead = await git(fx.root, "rev-parse", "HEAD");
    const input = checkpointInput(
      fx.root,
      remediationCheckpoint,
      remediationOperation,
      "GATE",
      remediationGate,
      "remediation-result-1",
      [auditPath, remediationPath, ticketPath, indexPath],
    );
    input.parentHead = parentHead;
    input.workflowResult = {
      resultId: "checkpoint-remediation-result-1",
      supersedesResultId: null,
      basis: {
        type: "transition",
        source: {
          operation: remediationOperation,
          subject,
          resultId: "remediation-result-1",
          artifactPath: remediationPath,
          gateField: "GATE",
          gateValue: remediationGate,
          fields: {},
        },
      },
    };

    const result = await executeTicketSetCheckpoint(input);
    const committedPaths = (await git(fx.root, "diff-tree", "--no-commit-id", "--name-only", "--no-renames", "-r", result.commitHead)).split(/\r?\n/).filter(Boolean);
    assert.ok(committedPaths.includes(ticketPath));
    assert.ok(committedPaths.includes(indexPath));
    assert.ok(committedPaths.includes(remediationPath));
    assert.equal(committedPaths.includes(preservedT001Path), false);
    assert.equal(await readFile(path.join(fx.root, preservedT001Path), "utf8"), preservedT001);
    assert.equal(result.receipt.gateValue, auditOperation);
  } finally { await fx.cleanup(); }
});
