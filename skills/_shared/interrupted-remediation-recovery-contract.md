# Interrupted Remediation Recovery Contract

This contract governs recovery when an external failure interrupts a write-enabled
remediation after it has changed an authorized target but before it has emitted
complete remediation evidence and a checkpoint.

## Core rule

A dirty target after an interrupted remediation is an **in-progress candidate**,
not proof of completion and not an authority blocker by itself. The canonical
source audit remains the defect authority. The owning remediation skill MUST be
re-run to reconcile the candidate against every finding before any remediation
checkpoint or independent re-audit.

```text
external failure during remediation
  + authorized dirty target
  + current actionable source audit
  + no complete matching remediation evidence
  => REMEDIATION_RECOVERY = RESUME_OR_RECONCILE
  => rerun owning remediation skill
```

Never reset, clean, stash, discard, or silently overwrite the candidate merely
because the previous process failed. Never checkpoint a dirty candidate as a
completed remediation. Never infer that a completion-looking marker in the
candidate SPEC is sufficient evidence.

## Recovery entry conditions

The controller may select the owning remediation skill when all are true:

```text
LATEST_SOURCE_AUDIT = current and actionable remediation verdict
SOURCE_AUDIT_UNMODIFIED = YES
REMEDIATION_BASIS = usable and not stale
DIRTY_PATHS = subset of the remediation skill's declared write boundary
COMPLETE_CURRENT_REMEDIATION_EVIDENCE = NO
```

The dirty target may be the component SPEC, Gap Matrix, Implementation Plan,
ticket set, implementation/tests, or remediation evidence permitted by the
owning skill. A dirty path outside that skill's write boundary remains a hard
blocker. Authority/portfolio/upstream drift remains a hard blocker under the
baseline contract.

A current remediation report is complete only when it matches the current
source-audit identity, target/basis fingerprint, remediation round, changed
paths, finding ledger, mechanical validation, and exact re-audit readiness gate.
A report from an older round or an artifact whose findings contradict the latest
source audit is incomplete/contradictory and MUST route to recovery.

## Remediator recovery protocol

At intake, the remediator MUST emit or persist:

```text
REMEDIATION_RECOVERY_MODE = NONE | RESUME_OR_RECONCILE
INTERRUPTED_ATTEMPT_DETECTED = YES | NO
CANDIDATE_STATE_CLASSIFICATION = CLEAN | PARTIAL | COMPLETE_CLAIM_UNVERIFIED | CONTRADICTORY
SOURCE_AUDIT_IDENTITY = <path, round/revision, verdict, basis fingerprint>
CANDIDATE_PATHS = <exact paths>
```

When recovery is active, the remediator MUST:

1. preserve the source audit and all historical evidence;
2. compare the candidate with the source audit and accepted authority;
3. revalidate every source finding, including findings apparently addressed;
4. classify each as `REMEDIATE`, `ALREADY_RESOLVED_BY_CURRENT_CANDIDATE`,
   `PARTIAL`, `BLOCKED`, or `INVALIDATED_BY_AUTHORITY_DRIFT`;
5. keep only authority-backed corrections and remove/repair contradictory
   completion claims within the authorized target/report boundary;
6. reconcile all summary, metrics, traceability, acceptance, conformance,
   revision, and readiness fields as one atomic semantic result;
7. emit `COMPONENT_*_REMEDIATION_COMPLETE` only when the full skill invariant
   passes; otherwise emit partial or blocked with exact residual findings.

A candidate that claims `READY_FOR_*_REAUDIT` without a matching complete
remediation report is `COMPLETE_CLAIM_UNVERIFIED`, not complete.

## Failure and checkpoint rules

If the remediator fails again, preserve the candidate and any recovery evidence;
do not create a completion checkpoint. The next invocation repeats recovery
from the latest candidate and the unchanged source audit.

Only after the owning remediator emits its exact complete re-audit gate may the
corresponding remediation checkpoint execute. The checkpoint then preserves the
SPEC/Gap Matrix/Plan/ticket or implementation slice plus complete remediation
evidence. The independent re-audit remains mandatory and cannot be skipped.

```text
COMPLETE_CURRENT_REMEDIATION_EVIDENCE = YES
  => phase remediation checkpoint
COMPLETE_CURRENT_REMEDIATION_EVIDENCE = NO
  => owning remediation skill
```

This contract does not authorize a semantic choice absent from accepted
authority. It only makes interrupted work resumable and fail-closed.
