import { randomUUID } from "node:crypto";
import { copyFile, mkdir, readFile, rm } from "node:fs/promises";
import { basename, join, relative, resolve, sep } from "node:path";

import {
  ARCHITECTURE_SPECIALIST,
  BASE_SPECIALISTS,
  CANONICAL_GATES,
  CANONICAL_VERDICTS,
  CONSOLIDATOR,
  OrchestrationStop,
  type AuditRuntimeState,
  type AuditSliceInput,
  type DelegationRequest,
  type DelegationResult,
  type SpecialistKey,
} from "./contracts.ts";
import { explicitTicketState, field, readRequired, requireFile, requireOneOf } from "./artifacts.ts";
import {
  createIntakeWorkflowBasis,
  createWorkflowResultContext,
  validateProducedWorkflowResult,
  type WorkflowResultContext,
} from "./workflow-lineage.ts";
import {
  assertPinnedHead,
  loadSemanticFingerprintPolicy,
  repositoryRelative,
  workspaceSnapshot,
  workspaceSnapshotDiff,
} from "./git-state.ts";

export interface AuditSliceDependencies {
  root: string;
  delegate(request: DelegationRequest): Promise<DelegationResult>;
  now?(): Date;
  /** Optional ID for the local run log; defaults to the audit wave ID. */
  logExecutionId?: string;
  /** Optional ID for callers that own the enclosing workflow execution. */
  executionId?: string;
  workflowSubject?: string;
  workflowResult?: WorkflowResultContext;
}

export interface AuditSliceResult {
  runtime: AuditRuntimeState;
  verdict: string;
  gate: string;
  nextOperation: string;
  postCheckpointOperation?: string;
  canonicalAuditPath: string;
}

function relativePath(root: string, candidate: string): string {
  const rel = relative(root, resolve(root, candidate));
  if (rel === "" || rel === ".." || rel.startsWith(`..${sep}`) || rel.startsWith(sep)) {
    throw new OrchestrationStop("INVALID_PATH", "Workflow input must identify a file inside the repository.", {
      candidate,
    });
  }
  return rel.split(sep).join("/");
}

function workspaceDiffSummary(diff: ReturnType<typeof workspaceSnapshotDiff>): string {
  const format = (paths: string[]) => paths.length ? paths.join(", ") : "none";
  return `added=[${format(diff.added)}]; removed=[${format(diff.removed)}]; modified=[${format(diff.modified)}]`;
}

async function validateAvailability(root: string, architectureRequired: boolean): Promise<void> {
  const specialists = architectureRequired ? [...BASE_SPECIALISTS, ARCHITECTURE_SPECIALIST] : [...BASE_SPECIALISTS];
  for (const specialist of specialists) {
    await requireFile(root, `skills/${specialist.skill}/SKILL.md`, "MISSING_SKILL");
    await requireFile(root, `.pi/agents/${specialist.agent}.md`, "MISSING_AGENT");
  }
  await requireFile(root, `skills/${CONSOLIDATOR.skill}/SKILL.md`, "MISSING_SKILL");
  await requireFile(root, `.pi/agents/${CONSOLIDATOR.agent}.md`, "MISSING_AGENT");
  for (const shared of [
    "skills/_shared/authority-completeness-gates.md",
    "skills/_shared/finding-completion-readiness-contract.md",
    "skills/_shared/baseline-drift-remediation-contract.md",
    "skills/_shared/implementation-audit-routing-contract.md",
    "skills/_shared/workflow-execution-topology-contract.md",
  ]) await requireFile(root, shared, "MISSING_AUTHORITY");
}

const MAX_SPECIALIST_ATTEMPTS = 3;

function specialistTask(
  input: AuditSliceInput,
  root: string,
  specialist: (typeof BASE_SPECIALISTS)[number] | typeof ARCHITECTURE_SPECIALIST,
  targetStateFingerprint: string,
  artifactPath: string,
  auditWaveId: string,
  attempt: number,
): string {
  const artifact = relativePath(root, artifactPath);
  const auditArtifactExclusions = [
    input.canonicalAuditPath,
    ...Object.values(input.specialistArtifacts),
  ].map((path) => relativePath(root, path)).join("; ");
  return [
    `Load and execute the canonical skill ${specialist.skill}.`,
    `Ticket: ${relativePath(root, input.ticketPath)}`,
    `Approved implementation design: ${relativePath(root, input.implementationDesignPath)}`,
    `Ticket-set audit: ${relativePath(root, input.ticketSetAuditPath)}`,
    `Pinned AUDIT_TARGET_HEAD: ${input.targetHead}`,
    `Pinned AUDIT_TARGET_STATE_FINGERPRINT: ${targetStateFingerprint}`,
    `AUDIT_ARTIFACT_EXCLUSIONS: ${auditArtifactExclusions}`,
    "When independently checking the pinned semantic fingerprint, use the repository workspaceSnapshot helper and semantic-fingerprint-policy.json with exactly these audit-artifact exclusions. Do not include audit artifacts or .pi/runtime staging artifacts in the implementation fingerprint.",
    `AUDIT_WAVE_ID: ${auditWaveId}`,
    `SPECIALIST_ATTEMPT: ${attempt}/${MAX_SPECIALIST_ATTEMPTS}`,
    `Write the required specialist audit only to: ${artifact}`,
    "Do not read any sibling specialist audit artifact.",
    "Do not change production code, tests, ticket state, upstream authority, Git state, commits, branches, remotes, or publication state.",
    "End the artifact with these exact machine-readable fields:",
    `AUDIT_TARGET_HEAD: ${input.targetHead}`,
    `AUDIT_TARGET_STATE_FINGERPRINT: ${targetStateFingerprint}`,
    `AUDIT_WAVE_ID: ${auditWaveId}`,
    "DOMAIN_AUDIT_COMPLETE: YES",
    `SPECIALIST_RESULT: one result authorized by ${specialist.skill}`,
  ].join("\n");
}

const MAX_CONSOLIDATION_ATTEMPTS = 3;

function consolidationTask(
  input: AuditSliceInput,
  root: string,
  keys: SpecialistKey[],
  targetStateFingerprint: string,
  artifactPaths: Record<SpecialistKey, string>,
  auditWaveId: string,
  attempt: number,
  workflowSubject: string,
  workflowResult: WorkflowResultContext,
): string {
  const artifacts = keys.map((key) => `- ${key}: ${relativePath(root, artifactPaths[key])}`).join("\n");
  return [
    `Load and execute the canonical skill ${CONSOLIDATOR.skill}.`,
    `Ticket: ${relativePath(root, input.ticketPath)}`,
    `Approved implementation design: ${relativePath(root, input.implementationDesignPath)}`,
    `Pinned AUDIT_TARGET_HEAD: ${input.targetHead}`,
    `Pinned AUDIT_TARGET_STATE_FINGERPRINT: ${targetStateFingerprint}`,
    `AUDIT_WAVE_ID: ${auditWaveId}`,
    `CONSOLIDATION_ATTEMPT: ${attempt}/${MAX_CONSOLIDATION_ATTEMPTS}`,
    attempt > 1
      ? "A previous consolidation attempt did not return completed. Treat the canonical audit path as an untrusted partial candidate; reconcile or replace it from the same pinned specialist artifacts and do not treat its prior content as authoritative."
      : "This is the initial consolidation attempt; do not use historical canonical content as current evidence.",
    "Consume these completed independent specialist artifacts and no console paraphrase:",
    artifacts,
    `Write the canonical audit only to: ${relativePath(root, input.canonicalAuditPath)}`,
    "Do not re-run a specialist inline, remediate, transition ticket state, commit, merge, or push.",
    "End the canonical artifact with these exact machine-readable fields:",
    `AUDIT_TARGET_HEAD: ${input.targetHead}`,
    `AUDIT_TARGET_STATE_FINGERPRINT: ${targetStateFingerprint}`,
    `AUDIT_WAVE_ID: ${auditWaveId}`,
    "AUDIT_VERDICT: one canonical verdict authorized by consolidate-implementation-audit",
    "TICKET_GATE: READY_FOR_DONE or NOT_READY_FOR_DONE",
    "NEXT_AUTHORIZED_OPERATION: one value authorized by implementation-audit-routing-contract",
    "Append exactly one terminal WORKFLOW_RESULT_V2 block to the canonical audit. Preserve earlier result blocks in this artifact. Copy the exact BASIS value below and set GATE_VALUE to the exact NEXT_AUTHORIZED_OPERATION:",
    "<!-- WORKFLOW_RESULT_V2",
    "OPERATION = audit-implemented-ticket",
    `SUBJECT_ID = ${workflowSubject}`,
    `RESULT_ID = ${workflowResult.resultId}`,
    `SUPERSEDES_RESULT_ID = ${workflowResult.supersedesResultId ?? "NONE"}`,
    "GATE_FIELD = NEXT_AUTHORIZED_OPERATION",
    "GATE_VALUE = <exact NEXT_AUTHORIZED_OPERATION>",
    `BASIS = ${JSON.stringify(workflowResult.basis ?? { type: "none" })}`,
    "-->",
  ].join("\n");
}

async function validateSpecialistArtifact(
  root: string,
  path: string,
  head: string,
  targetStateFingerprint: string,
  auditWaveId: string,
  allowed: readonly string[],
): Promise<void> {
  const text = await readRequired(root, path);
  const actual = {
    head: field(text, "AUDIT_TARGET_HEAD"),
    fingerprint: field(text, "AUDIT_TARGET_STATE_FINGERPRINT"),
    waveId: field(text, "AUDIT_WAVE_ID"),
    complete: field(text, "DOMAIN_AUDIT_COMPLETE"),
  };
  const mismatches = [
    actual.head !== head ? `AUDIT_TARGET_HEAD=${actual.head ?? "<missing>"}` : undefined,
    actual.fingerprint !== targetStateFingerprint ? `AUDIT_TARGET_STATE_FINGERPRINT=${actual.fingerprint ?? "<missing>"}` : undefined,
    actual.waveId !== auditWaveId ? `AUDIT_WAVE_ID=${actual.waveId ?? "<missing>"}` : undefined,
    actual.complete !== "YES" ? `DOMAIN_AUDIT_COMPLETE=${actual.complete ?? "<missing>"}` : undefined,
  ].filter((item): item is string => Boolean(item));
  if (mismatches.length) {
    throw new OrchestrationStop("INCOMPLETE_SPECIALIST_RESULT", "Specialist artifact lacks complete same-target evidence.", {
      path,
      auditWaveId,
      expectedHead: head,
      expectedStateFingerprint: targetStateFingerprint,
      mismatches,
      actual,
    });
  }
  requireOneOf(text, "SPECIALIST_RESULT", allowed, "INCOMPLETE_SPECIALIST_RESULT");
}

export async function runAuditSlice(input: AuditSliceInput, deps: AuditSliceDependencies): Promise<AuditSliceResult> {
  const root = resolve(deps.root);
  await assertPinnedHead(root, input.targetHead);
  await validateAvailability(root, input.architectureRequired);
  if (input.architectureRequired && !input.architectureReason.trim()) {
    throw new OrchestrationStop("MISSING_AUTHORITY", "The skill-derived architecture profile requires its recorded reason.");
  }

  const ticketText = await readRequired(root, input.ticketPath);
  explicitTicketState(ticketText);
  const ticketSubject = field(ticketText, "TICKET_ID")
    ?? field(ticketText, "id")
    ?? ticketText.match(/^#\s+([A-Z0-9]+(?:-[A-Z0-9]+)*-TICKET-\d+)(?:\s|—|-)/m)?.[1];
  if (!ticketSubject || (deps.workflowSubject && ticketSubject !== deps.workflowSubject)) {
    throw new OrchestrationStop("CANONICAL_ARTIFACT_CONTRADICTION", "Implemented-ticket audit subject does not match the canonical ticket identity field.", {
      expectedSubject: deps.workflowSubject,
      actualSubject: ticketSubject,
      ticketPath: input.ticketPath,
    });
  }
  const workflowSubject = deps.workflowSubject ?? ticketSubject;
  const workflowResult = deps.workflowResult
    ?? await createWorkflowResultContext(
      root,
      "audit-implemented-ticket",
      workflowSubject,
      randomUUID(),
      await createIntakeWorkflowBasis(root, [
        { artifactPath: input.ticketPath, fields: ["TICKET_ID", "id", "STATUS"] },
        { artifactPath: input.implementationDesignPath, fields: ["TICKET_ID", "id", "revision"] },
        {
          artifactPath: input.ticketSetAuditPath,
          fields: ["TICKET_ID", "SPEC_ID", "GATE", "VERDICT", "IMPLEMENTATION_TICKETS_CONFORMANT", "READY_FOR_IMPLEMENTATION"],
        },
      ]));
  await readRequired(root, input.implementationDesignPath);
  const ticketAudit = await readRequired(root, input.ticketSetAuditPath);
  if (!ticketAudit.includes("IMPLEMENTATION_TICKETS_CONFORMANT") || !ticketAudit.includes("READY_FOR_IMPLEMENTATION")) {
    throw new OrchestrationStop("DEPENDENCY_NOT_READY", "The latest ticket-set audit does not authorize implementation audit.", {
      ticketSetAuditPath: input.ticketSetAuditPath,
    });
  }

  const specialists = input.architectureRequired ? [...BASE_SPECIALISTS, ARCHITECTURE_SPECIALIST] : [...BASE_SPECIALISTS];
  const keys = specialists.map((item) => item.key) as SpecialistKey[];
  const runtime: AuditRuntimeState = {
    executionId: deps.executionId ?? randomUUID(),
    targetHead: input.targetHead,
    targetStateFingerprint: "pending",
    specialistRunIds: {},
    startedAt: (deps.now?.() ?? new Date()).toISOString(),
  };
  const auditWaveId = runtime.executionId;
  const stagingRoot = join(".pi", "runtime", "workflow-audits", auditWaveId);
  await mkdir(resolve(root, stagingRoot), { recursive: true });
  const stagedArtifacts = Object.fromEntries(
    keys.map((key) => [key, join(stagingRoot, `${key}-${basename(input.specialistArtifacts[key])}`)]),
  ) as Record<SpecialistKey, string>;
  const allowedArtifacts = new Set([
    ...keys.map((key) => repositoryRelative(root, input.specialistArtifacts[key])),
    ...keys.map((key) => repositoryRelative(root, stagedArtifacts[key])),
    repositoryRelative(root, input.canonicalAuditPath),
  ]);
  // The semantic audit target is the pinned base commit plus the current
  // working-tree overlay. Audit artifacts are excluded below so specialists
  // share one stable implementation fingerprint without requiring a commit.
  // Each specialist writes to a unique per-wave staging path; old canonical
  // specialist artifacts can never satisfy this wave by accident.
  const semanticPolicy = await loadSemanticFingerprintPolicy(root);
  const semanticExcludedPatterns = semanticPolicy.semanticExclusions;
  const beforeSnapshot = await workspaceSnapshot(root, allowedArtifacts, [], semanticPolicy);
  const before = beforeSnapshot.fingerprint;
  const targetStateFingerprint = before;
  runtime.targetStateFingerprint = targetStateFingerprint;

  const specialistByKey = new Map(specialists.map((specialist) => [specialist.key, specialist]));
  let pendingKeys = new Set(keys);
  const specialistAttempts: Array<{ key: SpecialistKey; attempt: number; status: string; runId?: string; error?: string }> = [];
  let hadOperationalFailure = false;

  for (let attempt = 1; attempt <= MAX_SPECIALIST_ATTEMPTS && pendingKeys.size > 0; attempt += 1) {
    const batch = [...pendingKeys].map((key) => specialistByKey.get(key)!);
    const results = await Promise.all(
      batch.map(async (specialist) => {
        try {
          const result = await deps.delegate({
            ownerRunId: runtime.executionId,
            logExecutionId: deps.logExecutionId ?? runtime.executionId,
            nodeId: attempt === 1 ? specialist.key : `${specialist.key}-retry-${attempt}`,
            agent: specialist.agent,
            task: specialistTask(
              input,
              root,
              specialist,
              targetStateFingerprint,
              stagedArtifacts[specialist.key],
              auditWaveId,
              attempt,
            ),
            cwd: root,
          });
          if (result.runId) runtime.specialistRunIds[specialist.key] = result.runId;
          return { specialist, result };
        } catch (error) {
          return { specialist, result: { status: "failed", error: String(error) } as DelegationResult };
        }
      }),
    );

    await assertPinnedHead(root, input.targetHead);
    const afterSpecialistsSnapshot = await workspaceSnapshot(root, allowedArtifacts, [], semanticPolicy);
    if (before !== afterSpecialistsSnapshot.fingerprint) {
      const changedFiles = workspaceSnapshotDiff(beforeSnapshot, afterSpecialistsSnapshot);
      throw new OrchestrationStop(
        "TARGET_HEAD_DRIFT",
        `A specialist changed files outside its authorized audit artifact. ${workspaceDiffSummary(changedFiles)}`,
        {
          changedFiles,
          excludedWorkflowPatterns: semanticExcludedPatterns,
        },
      );
    }

    const nextPendingKeys = new Set<SpecialistKey>();
    for (const { specialist, result } of results) {
      specialistAttempts.push({
        key: specialist.key,
        attempt,
        status: result.status,
        runId: result.runId,
        error: result.error,
      });
      if (result.status !== "completed") {
        hadOperationalFailure = true;
        nextPendingKeys.add(specialist.key);
        continue;
      }
      try {
        await validateSpecialistArtifact(
          root,
          stagedArtifacts[specialist.key],
          input.targetHead,
          targetStateFingerprint,
          auditWaveId,
          specialist.allowedResults,
        );
      } catch (error) {
        if (!(error instanceof OrchestrationStop)
          || !["MISSING_AUTHORITY", "INCOMPLETE_SPECIALIST_RESULT"].includes(error.code)) {
          throw error;
        }
        nextPendingKeys.add(specialist.key);
      }
    }
    pendingKeys = nextPendingKeys;
  }

  if (pendingKeys.size > 0) {
    throw new OrchestrationStop(
      hadOperationalFailure ? "SUBAGENT_FAILURE" : "INCOMPLETE_SPECIALIST_RESULT",
      "One or more required specialists did not produce complete same-target evidence after bounded retries.",
      {
        maxAttempts: MAX_SPECIALIST_ATTEMPTS,
        pendingKeys: [...pendingKeys],
        specialistAttempts,
      },
    );
  }

  let consolidation: DelegationResult | undefined;
  const consolidationAttempts: Array<{ attempt: number; status: string; runId?: string; error?: string }> = [];
  for (let attempt = 1; attempt <= MAX_CONSOLIDATION_ATTEMPTS; attempt += 1) {
    const result = await deps.delegate({
      ownerRunId: runtime.executionId,
      logExecutionId: deps.logExecutionId ?? runtime.executionId,
      nodeId: `consolidation-attempt-${attempt}`,
      agent: CONSOLIDATOR.agent,
      task: consolidationTask(
        input,
        root,
        keys,
        targetStateFingerprint,
        stagedArtifacts,
        auditWaveId,
        attempt,
        workflowSubject,
        workflowResult,
      ),
      cwd: root,
    });
    if (result.runId) runtime.specialistRunIds.consolidation = result.runId;
    consolidationAttempts.push({ attempt, status: result.status, runId: result.runId, error: result.error });
    await assertPinnedHead(root, input.targetHead);
    const afterAttemptSnapshot = await workspaceSnapshot(root, allowedArtifacts, [], semanticPolicy);
    if (before !== afterAttemptSnapshot.fingerprint) {
      const changedFiles = workspaceSnapshotDiff(beforeSnapshot, afterAttemptSnapshot);
      throw new OrchestrationStop(
        "TARGET_HEAD_DRIFT",
        `Consolidation attempt ${attempt} changed files outside the authorized audit artifact. ${workspaceDiffSummary(changedFiles)}`,
        { changedFiles, consolidationAttempts },
      );
    }
    if (result.status === "completed") {
      consolidation = result;
      break;
    }
  }
  if (!consolidation) {
    throw new OrchestrationStop("HUMAN_GATE_REQUIRED", "Canonical consolidation failed after bounded retries; exceptional recovery requires explicit human override.", {
      maxAttempts: MAX_CONSOLIDATION_ATTEMPTS,
      consolidationAttempts,
      recovery: "Do not remediate from unconsolidated findings. Inspect the failed consolidation receipts and either explicitly authorize a same-wave recovery or start a new audit wave only after target/evidence revalidation.",
    });
  }

  const afterConsolidationSnapshot = await workspaceSnapshot(root, allowedArtifacts, [], semanticPolicy);
  if (before !== afterConsolidationSnapshot.fingerprint) {
    const changedFiles = workspaceSnapshotDiff(beforeSnapshot, afterConsolidationSnapshot);
    throw new OrchestrationStop(
      "TARGET_HEAD_DRIFT",
      `Consolidation changed files outside the authorized audit artifact. ${workspaceDiffSummary(changedFiles)}`,
      {
        changedFiles,
        excludedWorkflowPatterns: semanticExcludedPatterns,
      },
    );
  }
  const canonical = await readRequired(root, input.canonicalAuditPath);
  if (
    field(canonical, "AUDIT_TARGET_HEAD") !== input.targetHead
    || field(canonical, "AUDIT_TARGET_STATE_FINGERPRINT") !== targetStateFingerprint
    || field(canonical, "AUDIT_WAVE_ID") !== auditWaveId
  ) {
    throw new OrchestrationStop("INCOMPLETE_CANONICAL_RESULT", "Canonical audit target does not match the pinned semantic state and audit wave.", {
      auditWaveId,
      expectedHead: input.targetHead,
      expectedStateFingerprint: targetStateFingerprint,
      actualHead: field(canonical, "AUDIT_TARGET_HEAD"),
      actualStateFingerprint: field(canonical, "AUDIT_TARGET_STATE_FINGERPRINT"),
      actualWaveId: field(canonical, "AUDIT_WAVE_ID"),
    });
  }
  const verdict = requireOneOf(canonical, "AUDIT_VERDICT", CANONICAL_VERDICTS, "INCOMPLETE_CANONICAL_RESULT");
  const gate = requireOneOf(canonical, "TICKET_GATE", CANONICAL_GATES, "INCOMPLETE_CANONICAL_RESULT");
  const nextOperation = requireOneOf(
    canonical,
    "NEXT_AUTHORIZED_OPERATION",
    ["checkpoint-implemented-ticket", "audit-implemented-ticket", "remediate-implemented-ticket", "finalize-implemented-ticket", "HUMAN_REQUIRED"],
    "INCOMPLETE_CANONICAL_RESULT",
  );
  const postCheckpointOperation = nextOperation === "checkpoint-implemented-ticket"
    ? requireOneOf(
      canonical,
      "POST_CHECKPOINT_OPERATION",
      ["audit-implemented-ticket", "remediate-implemented-ticket", "finalize-implemented-ticket", "HUMAN_REQUIRED"],
      "INCOMPLETE_CANONICAL_RESULT",
    )
    : undefined;

  await validateProducedWorkflowResult(root, {
    operation: "audit-implemented-ticket",
    subject: workflowSubject,
    resultId: workflowResult.resultId,
    supersedesResultId: workflowResult.supersedesResultId,
    basis: workflowResult.basis ?? { type: "none" },
    gateField: "NEXT_AUTHORIZED_OPERATION",
    gateValue: nextOperation,
    artifactPath: input.canonicalAuditPath,
  });

  try {
    for (const key of keys) {
      await copyFile(resolve(root, stagedArtifacts[key]), resolve(root, input.specialistArtifacts[key]));
    }
    await rm(resolve(root, stagingRoot), { recursive: true, force: true });
  } catch (error) {
    throw new OrchestrationStop("INCOMPLETE_CANONICAL_RESULT", "Canonical audit was valid but specialist artifact promotion failed.", {
      auditWaveId,
      stagedArtifacts,
      canonicalArtifacts: input.specialistArtifacts,
      error: String(error),
    });
  }

  return { runtime, verdict, gate, nextOperation, postCheckpointOperation, canonicalAuditPath: input.canonicalAuditPath };
}
