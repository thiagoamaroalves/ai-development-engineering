---
name: remediate-component-implementation-tickets
description: >
  Remediate validated findings produced by audit-component-implementation-tickets
  against a component implementation ticket set. Modify only ticket artifacts,
  their derived index, and optional remediation evidence required to address
  validated CITA findings. Preserve accepted ADR authority, approved portfolio,
  conformant component and upstream SPEC contracts, validated Gap Matrix,
  conformant Implementation Plan, complete authority traceability, ownership,
  normative dependency direction, Unit boundaries, ticket-local closure,
  acceptance contribution, Final Proof Ownership, status, blockers, DAG order,
  waves, and parallelization. Use only after
  IMPLEMENTATION_TICKETS_REMEDIATION_REQUIRED. Never implement code, modify
  upstream planning authority, or declare readiness for implementation.
---

# Remediate Component Implementation Tickets

Read `skills/_shared/interrupted-remediation-recovery-contract.md` before acting.
A dirty ticket set left by an interrupted attempt is an untrusted candidate;
resume and reconcile it against the current actionable ticket audit before
checkpointing.

Before baseline validation, read
`skills/_shared/baseline-drift-remediation-contract.md`. Findings from an audit
with complete actionable reassessment are consumable; drift alone is not a
blocker. The live state must still match the exact audited fingerprint.

## Purpose

Apply surgical corrections to a component implementation-ticket set after an
independent `audit-component-implementation-tickets` returns:

```text
IMPLEMENTATION_TICKETS_REMEDIATION_REQUIRED
```

Workflow:

```text
decompose-component-implementation-plan-into-tickets
        ↓
audit-component-implementation-tickets
        ↓
IMPLEMENTATION_TICKETS_REMEDIATION_REQUIRED
        ↓
remediate-component-implementation-tickets
        ↓
READY_FOR_INDEPENDENT_TICKET_REAUDIT
        ↓
audit-component-implementation-tickets
        ↺
IMPLEMENTATION_TICKETS_CONFORMANT
        ↓
READY_FOR_IMPLEMENTATION
```

Correct ticket decomposition defects only. Do not redesign the Plan, regenerate
the Gap Matrix, change architecture or ownership, implement code, change tests,
make blocked tickets READY artificially, or approve implementation readiness.

## Operating mode

```text
WRITE_ALLOWED
AUDIT_DRIVEN
FINDING_DRIVEN
TARGETED
SURGICAL
ADR_FIRST
PORTFOLIO_GOVERNED
SPEC_PRESERVING
GAP_MATRIX_PRESERVING
PLAN_PRESERVING
OWNERSHIP_PRESERVING
DEPENDENCY_PRESERVING
STATUS_AWARE
BLOCKER_AWARE
LOCAL_CLOSURE_AWARE
PROOF_OWNERSHIP_AWARE
TRACEABILITY_PRESERVING
NO_SCOPE_EXPANSION
NO_ARCHITECTURE_INVENTION
NO_IMPLEMENTATION
NO_SELF_APPROVAL
```

## Core authority model

```text
accepted ADR
    >
approved SPEC portfolio decomposition
    >
conformant component SPEC
    >
conformant upstream component SPECs
    >
validated component Gap Matrix
    >
conformant component Implementation Plan
    >
conformant Implementation Plan Audit
    >
validated independent Ticket Audit findings
    >
current repository evidence
    >
ticket artifacts being remediated
```

ADR defines architecture; Portfolio defines ownership and normative dependency
direction; SPEC defines required behavior; Gap Matrix defines validated deltas;
Plan defines Units; Ticket Audit identifies validated decomposition defects; this
skill corrects those defects only.

## 1. Preconditions and upstream gates

Normal remediation requires:

```text
IMPLEMENTATION_TICKETS_REMEDIATION_REQUIRED
NOT_READY_FOR_IMPLEMENTATION
```

If tickets are conformant, return:

```text
TICKET_REMEDIATION_NOT_REQUIRED
reason = TICKETS_ALREADY_CONFORMANT
```

If the audit is blocked, return:

```text
COMPONENT_IMPLEMENTATION_TICKET_REMEDIATION_BLOCKED
reason = UPSTREAM_AUDIT_BLOCKED
```

Verify upstream:

```text
PORTFOLIO_DECOMPOSITION_APPROVED
PASS — COMPONENT_SPEC_CONFORMANT
GAP_MATRIX_CONFORMANT
IMPLEMENTATION_PLAN_CONFORMANT
READY_FOR_ISSUE_DECOMPOSITION
```

If any fails:

```text
COMPONENT_IMPLEMENTATION_TICKET_REMEDIATION_BLOCKED
reason = UPSTREAM_CONFORMANCE_GATE_NOT_SATISFIED
```

Do not compensate locally.

## 2. Required inputs and remediation baseline

Identify ADRs, portfolio/audit, component and upstream SPECs/audits, validated
Gap Matrix/audit, conformant Plan/Plan Audit, ticket folder/index/files, latest
Ticket Audit, repository root/evidence, audited baseline, and current HEAD.

Record:

```text
SPEC_ID
PORTFOLIO_ID
TICKET_FOLDER
TICKET_INDEX
SOURCE_AUDIT
SOURCE_AUDIT_VERDICT
PORTFOLIO_BASELINE
COMPONENT_SPEC_BASELINE
UPSTREAM_SPEC_BASELINES
GAP_MATRIX_BASELINE
IMPLEMENTATION_PLAN_BASELINE
PLAN_AUDIT_BASELINE
TICKET_AUDIT_BASELINE
AUDITED_HEAD
CURRENT_HEAD
WORKING_TREE_STATE
ACTIVE_CITA_FINDINGS
BASELINE_DRIFT_STATUS
REASSESSMENT_COMPLETE
FINDINGS_ARE_ACTIONABLE
BASELINE_REMEDIATION_READINESS
AUDIT_BASIS_FINGERPRINT
BASELINE_REASSESSMENT_PROOF
```

Track drift:

```text
PORTFOLIO_BASELINE_DRIFT
COMPONENT_SPEC_BASELINE_DRIFT
UPSTREAM_SPEC_BASELINE_DRIFT
GAP_MATRIX_BASELINE_DRIFT
PLAN_BASELINE_DRIFT
REPOSITORY_BASELINE_DRIFT
TICKET_BASELINE_DRIFT
```

Classify as `NO_RELEVANT_DRIFT`, `NON_SEMANTIC_DOCUMENTARY_DRIFT`,
`LOCALIZED_TICKET_DRIFT`, `LOCALIZED_IMPLEMENTATION_DRIFT`, or
`MATERIAL_BASELINE_DRIFT`.

For material drift, consume the source audit's shared state and
`BASELINE_REASSESSMENT_PROOF`. If it is complete, findings are actionable, and
the live fingerprint equals the audit basis, continue with:

```text
BASELINE_DRIFT_STATUS = DRIFT_ASSESSED
REASSESSMENT_COMPLETE = YES
BASELINE_REMEDIATION_READINESS = READY
REMEDIATION_ENTRY_STATE = COMPONENT_IMPLEMENTATION_TICKET_REMEDIATION_ALLOWED
```

Preserve the old baselines, record the current adopted baseline, reconcile
affected ticket/Unit records, and require independent ticket re-audit.

If reassessment is missing/incomplete or the source/repository state is
indeterminate, return:

```text
COMPONENT_IMPLEMENTATION_TICKET_REMEDIATION_BLOCKED
reason = BLOCKED_INSUFFICIENT_REASSESSMENT
```

If the live state changed after the reassessment, return:

```text
COMPONENT_IMPLEMENTATION_TICKET_REMEDIATION_BLOCKED
reason = STALE_AUDIT_BASIS
```

Implementation drift that changes Gap or Plan conclusions requires a fresh
audit only when the existing audit did not assess that delta. Ticket-only drift
still requires finding-by-finding revalidation; never overwrite a newer valid
correction mechanically.
Ticket-only drift requires finding-by-finding revalidation; never overwrite a
newer valid correction mechanically.

## 3. Finding intake and validity

Read the complete independent audit and inventory every:

```text
CITA-CRITICAL-###
CITA-MAJOR-###
CITA-MINOR-###
CITA-INFO-###
```

Capture finding ID, severity, implementation impact/category, tickets/Units,
ADR/Portfolio/Requirement/Gap/Owner, ticket claim, audit result, repository
evidence, closure impact, acceptance/proof impact, dependency/blocker impact,
minimum correction, and revalidation.

Revalidate each as:

```text
CONFIRMED
ALREADY_REMEDIATED
SUPERSEDED_BY_VALID_TICKET_CHANGE
INVALIDATED_BY_NEW_EVIDENCE
BLOCKED_BY_BASELINE_CHANGE
```

Reject only with concrete evidence. Finding states are only:

```text
REMEDIATED
ALREADY_REMEDIATED
REJECTED_BY_VALID_EVIDENCE
PARTIALLY_REMEDIATED
BLOCKED
```

Never use `CLOSED`, `CONFORMANT`, or `APPROVED`; the independent re-audit closes
findings.

## 4. Artifact boundary and root causes

Modify only ticket files, ticket index README, and optional remediation evidence.
Never modify ADRs, portfolio, SPECs, Gap Matrix, Plan, audits, code, tests,
migrations, or schemas.

Classify confirmed findings as one or more:

```text
TRACEABILITY
PORTFOLIO_OWNERSHIP
UNIT_DECOMPOSITION
TICKET_SCOPE
FALSE_TICKET_SPLIT
FALSE_TICKET_MERGE
LOCAL_ACCEPTANCE
LOCAL_CLOSURE
ACCEPTANCE_PROOF_ROLE
FINAL_PROOF_OWNERSHIP
DEPENDENCY
BLOCKER
STATUS
INITIAL_DAG_STATE
CROSS_SPEC_DEPENDENCY
WAVE
PARALLELIZATION
TEST_ALLOCATION
COMPLETION_EVIDENCE
FAILURE_OWNERSHIP
COMPATIBILITY_CUTOVER
HANDOFF_UNBLOCK
INDEX
METRICS
BASELINE_METADATA
OTHER_TICKET_LOCAL
```

## 5. Preserve upstream semantics and traceability

Every affected ticket preserves:

```text
ADR
→ Portfolio Obligation
→ Component Requirement
→ Validated Gap
→ Implementation Unit
→ Ticket
```

Correct missing/wrong references from authority; invent no IDs. Do not change
Gap classification, category, severity, exact delta, owner, identity, Unit
Goal, Unit ownership, Unit local delta, normative dependencies, or Final Proof
allocation. If a finding requires any such change:

```text
COMPONENT_IMPLEMENTATION_TICKET_REMEDIATION_BLOCKED
reason = GAP_MATRIX_REVALIDATION_REQUIRED
```

or, for Unit semantics beyond allowed ticket refinement:

```text
COMPONENT_IMPLEMENTATION_TICKET_REMEDIATION_BLOCKED
reason = IMPLEMENTATION_PLAN_REVALIDATION_REQUIRED
```

## 6. Missing, speculative, and overbroad tickets

For `MISSING_TICKET` or `IMPLEMENTATION_UNIT_NOT_DECOMPOSED`, create a ticket
only from an existing conformant `ISSUE_READY` Unit. Reconcile Unit→Ticket,
Gap→Ticket, Acceptance→Ticket, dependencies, blockers, waves, proof, index, and
metrics.

Reconcile the shared capability record before any ticket is created or promoted:
preserve `CAPABILITY_ID`, authority status, contract status, authority owner,
producer, consumer, contract, semantic status, local testability, productive
availability, dependency class, availability evidence, and blocking effect. A
fixture/mock/fake/interface/in-memory
repository is not productive evidence.

For `SPECULATIVE_TICKET`, remove only when no valid Unit/supporting authority
exists, then reconcile all derived relationships. For `OVERBROAD`, remove only
behavior unjustified by the originating Unit; never change parent Unit scope.

## 7. Ownership, foreign capabilities, and boundaries

For ownership leakage, wrong owner, duplicated foreign capability, or duplicate
canonical authority, restore Portfolio ownership across Authority/Scope,
Required Behavior, Does Not Implement, Cross-Spec Dependencies, ACs, Tests, and
Completion Evidence.

No ticket implements another SPEC's canonical lifecycle. Narrow such work to
local integration/convergence or remove it if no local work remains.

## 8. Ticket split/merge remediation

Merge a `FALSE_TICKET_SPLIT` only when child tickets have the same Unit, owner,
indivisible invariant, closure boundary, and cannot independently close.
Preserve a stable ID and record old-to-new mapping.

Split a `FALSE_TICKET_MERGE` only when work has materially different closure,
destructive cutover, durable migration, execution prerequisite, local acceptance
boundary, productive availability, cross-SPEC prerequisite, completion-evidence
timing, or ownership. Shared authority/persistence/invariant alone is not a
merge proof. Every resulting child must satisfy:

```text
TICKET_LOCAL_CLOSURE = YES
```

For every split:

```text
COMBINED_CHILD_SCOPE = ORIGINAL_TICKET_SCOPE
UNIT_SCOPE_LOST_BY_SPLIT = 0
```

Preserve all Gaps, Requirements, Acceptance IDs, tests, evidence, dependencies,
and proof roles.

## 9. Local closure and acceptance remediation

Never edit only the closure label. Reconcile Goal, Required Behavior, Does Not
Implement, Dependencies, Blocking Conditions, ACs, Tests, Completion Evidence,
and Proof Role, then recompute:

```text
TICKET_LOCAL_CLOSURE = YES | NO
```

Every local AC must be:

```text
TESTABLE = YES
LOCALLY_PROVABLE = YES
```

Local proof uses only this ticket, completed prerequisites, and confirmed
preexisting foreign capabilities.

For every local witness require `WITNESS_EXECUTABLE_AT_LOCAL_CLOSURE = YES` and
`PRODUCTIVE_AVAILABILITY = YES` whenever the witness is durable,
restart/recovery, physical-CAS, foreign-integration, productive-recovery, or
external-effect evidence and its dependency class is
`REQUIRED_FOR_LOCAL_CLOSURE`. Otherwise set local closure to `NO` and preserve
the exact upstream contract blocker. A fixture remains valid contract-level
evidence when the witness is explicitly local/contract-level.

For downstream-dependent/non-local ACs, narrow the local contribution, preserve
the normative Acceptance ID, preserve downstream contributors, and preserve one
Final Proof Owner. Do not absorb excluded behavior. If an unavailable foreign
capability is required, keep the ticket BLOCKED with an explicit external
blocker; do not make planning blocked.

## 10. Acceptance and Final Proof Owner

Allowed roles:

```text
CONTRIBUTOR
LOCAL_ACCEPTANCE_OWNER
FINAL_PROOF_OWNER
```

For every affected multi-ticket Acceptance:

```text
FINAL_PROOF_OWNER = exactly one ticket
```

The owner runs after all contributors, has final evidence, proves the complete
obligation, and requires no future ticket. Correct missing, invalid, premature,
or multiple owners. Remove a synthetic proof-only ticket unless it has real
integration, conformance, migration, cutover, or cross-ticket evidence work;
move proof to the earliest legitimate ticket and reconcile graph/index/metrics.

## 11. Dependencies, blockers, status, and handoff

Reconstruct `DEPENDS_ON` from the conformant Plan DAG, valid splits, and
Cross-Spec prerequisites. Correct missing, extra, wrong-direction,
false-serialization, and hidden dependencies. Ticket dependencies may be
stricter than Plan due to valid splitting, never weaker.

If B depends on unresolved A:

```text
B STATUS = BLOCKED
B BLOCKED_BY includes A
```

If A is satisfied, it may remain in `DEPENDS_ON` but not `BLOCKED_BY`. External
blockers use stable foreign IDs, not fake tickets.

Allowed statuses:

```text
READY
BLOCKED
IN_PROGRESS
IMPLEMENTED
VALIDATION_REQUIRED
DONE
```

Remediation records factual state only. READY requires the shared
`EXECUTION_READY` predicate, `BLOCKED_BY: NONE`, no unresolved internal/foreign
prerequisite, and no hidden blocker. BLOCKED needs a concrete current blocker;
never remove true blockers to increase READY count.

When remediation consumes a post-finalization ticket-set finding, a satisfied
predecessor is factual evidence for changing the current downstream state, not
an artificial promotion. Preserve `INITIAL_DAG_STATE` and `DEPENDS_ON`, remove
the satisfied predecessor only from current `BLOCKED_BY`, set current
`EXECUTION_READY`/`STATUS` only when the shared predicate passes, and reconcile
the primary ticket, `UNBLOCKS`, derived index, metrics, and any current
projection together. Record `DOWNSTREAM_TICKET_STATE_MUTATIONS` as the actual
count. The independent ticket-set re-audit must verify the result before design
or implementation is authorized.

Preserve `ISSUE_READY != Ticket STATUS READY` and parent `INITIAL_DAG_STATE`.

For every internal blocker:

```text
B BLOCKED_BY A
```

must be reflected in A's `UNBLOCKS`. Use one consistent UNBLOCKS meaning.

## 12. DAG, waves, parallelization, and cross-SPEC work

Rebuild dependency and blocker graphs after changes:

```text
DEPENDENCY_GRAPH_CYCLE = NO
BLOCKER_GRAPH_CYCLE = NO
```

Waves preserve Plan semantics; a split may become later but never earlier than
prerequisites. Parallelization is only:

```text
SAFE
SAFE_WITH_COORDINATION
SERIAL_REQUIRED
```

Correct unsafe claims based on real collisions and dependencies.

For Cross-Spec dependencies reconcile owner, capability, consumer ticket,
availability, and blocking. Foreign lifecycle remains foreign.

## 13. Tests, evidence, failures, compatibility, and destructive changes

Add only planned test requirements, not test code. Correct omissions for
authority, identity, immutability, atomicity, concurrency, stale rejection,
idempotency, durability, recovery, migration, compatibility, and cross-Spec
integration. Distinguish:

```text
LOCAL_TEST_EVIDENCE
INTEGRATION_TEST_EVIDENCE
FINAL_CONFORMANCE_EVIDENCE
```

Tests must execute at ticket closure; local correctness tests are not deferred
to final conformance. Completion Evidence must be objective, auditable, and
locally producible. Completion Gate must require relevant code, tests,
integration, legacy, and conformance evidence; code-only completion is invalid.

Restore failure ownership and authorized local mapping/propagation/presentation.
Preserve compatibility ownership for canonical path, legacy compatibility,
replay, cutover, and retirement.

For tickets retiring legacy writes, alternate authority, destructive migration,
or irreversible cutover, require:

```text
replacement exists
        ↓
replacement proof exists
        ↓
retirement/cutover ticket becomes executable
```

Add dependency/blocker or a valid split; do not bypass ordering.

## 14. Derived traceability and index reconciliation

Rebuild and reconcile:

```text
Implementation Unit → Ticket
Portfolio Obligation → Requirement → Gap → Unit → Ticket
Gap → Ticket
Acceptance → Ticket
Cross-Spec dependencies
DEPENDS_ON
BLOCKED_BY
STATUS
UNBLOCKS
Dependency graph
Blocker graph
Waves
Parallelization
Tests
Completion Gates
Ticket Index
Metrics
```

The index follows ticket truth. Calculate and require zero:

```text
INDEX_STATUS_MISMATCHES
INDEX_BLOCKER_MISMATCHES
INDEX_DEPENDENCY_MISMATCHES
INDEX_COVERAGE_MISMATCHES
INDEX_FINAL_PROOF_MISMATCHES
INDEX_METRIC_MISMATCHES
```

## 15. Metrics and remediation invariants

Calculate at minimum:

```text
TICKETS_BEFORE
TICKETS_AFTER
TICKETS_ADDED
TICKETS_REMOVED
TICKETS_SPLIT
TICKETS_MERGED
IMPLEMENTATION_UNITS_FULLY_DECOMPOSED
UNMAPPED_PORTFOLIO_OBLIGATIONS
UNMAPPED_LOCAL_GAPS
FALSE_TICKET_SPLITS
FALSE_TICKET_MERGES
TICKETS_WITH_LOCAL_CLOSURE_NO
LOCAL_AC_REQUIRING_DOWNSTREAM
LOCAL_AC_CONTRADICTING_DOES_NOT_IMPLEMENT
LOCAL_AC_REQUIRING_UNAVAILABLE_FOREIGN_CAPABILITY
TICKETS_WITH_UNAVAILABLE_REQUIRED_CAPABILITY
WITNESS_NOT_EXECUTABLE_AT_LOCAL_CLOSURE
DOWNSTREAM_PROMOTION_WITHOUT_NEW_EVIDENCE
UNCOVERED_ACCEPTANCE_OBLIGATIONS
UNRESOLVED_TICKET_FINAL_PROOF_OWNERS
FINAL_PROOF_PREMATURE
READY_TICKETS
BLOCKED_TICKETS
STATUS_ERRORS
DEPENDENCY_ERRORS
BLOCKER_ERRORS
KNOWN_EXTERNAL_BLOCKERS
HIDDEN_EXTERNAL_BLOCKERS
UNBLOCK_GRAPH_MISMATCHES
DEPENDENCY_GRAPH_CYCLE
BLOCKER_GRAPH_CYCLE
UNSAFE_WAVE_ASSIGNMENTS
INVALID_PARALLELIZATIONS
OWNERSHIP_ERRORS
FOREIGN_CAPABILITY_DUPLICATION
CRITICAL_TEST_GAPS
INSUFFICIENT_COMPLETION_GATES
INDEX_MISMATCHES
```

Successful local remediation requires:

```text
IMPLEMENTATION_UNITS_NOT_DECOMPOSED = 0
UNMAPPED_PORTFOLIO_OBLIGATIONS = 0
UNMAPPED_LOCAL_GAPS = 0
FALSE_TICKET_SPLITS = 0
FALSE_TICKET_MERGES = 0
TICKETS_WITH_LOCAL_CLOSURE_NO = 0
LOCAL_AC_REQUIRING_DOWNSTREAM = 0
LOCAL_AC_CONTRADICTING_DOES_NOT_IMPLEMENT = 0
LOCAL_AC_REQUIRING_UNAVAILABLE_FOREIGN_CAPABILITY = 0
TICKETS_WITH_UNAVAILABLE_REQUIRED_CAPABILITY = 0
WITNESS_NOT_EXECUTABLE_AT_LOCAL_CLOSURE = 0
DOWNSTREAM_PROMOTION_WITHOUT_NEW_EVIDENCE = 0
UNCOVERED_ACCEPTANCE_OBLIGATIONS = 0
UNRESOLVED_TICKET_FINAL_PROOF_OWNERS = 0
FINAL_PROOF_PREMATURE = 0
STATUS_ERRORS = 0
DEPENDENCY_ERRORS = 0
BLOCKER_ERRORS = 0
UNBLOCK_GRAPH_MISMATCHES = 0
DEPENDENCY_GRAPH_CYCLE = NO
BLOCKER_GRAPH_CYCLE = NO
UNSAFE_WAVE_ASSIGNMENTS = 0
INVALID_PARALLELIZATIONS = 0
OWNERSHIP_ERRORS = 0
FOREIGN_CAPABILITY_DUPLICATION = 0
CRITICAL_TEST_GAPS = 0
INSUFFICIENT_COMPLETION_GATES = 0
INDEX_STATUS_MISMATCHES = 0
INDEX_BLOCKER_MISMATCHES = 0
INDEX_COVERAGE_MISMATCHES = 0
INDEX_METRIC_MISMATCHES = 0
```

Known explicit external blockers are allowed; hidden external blockers are not.

## 16. Escalations

Stop and return an exact blocker for:

```text
SPEC_REMEDIATION_REQUIRED
ADR_CLARIFICATION_REQUIRED
PORTFOLIO_REMEDIATION_REQUIRED
PORTFOLIO_DEPENDENCY_CHANGE_REQUIRED
UPSTREAM_SPEC_REMEDIATION_REQUIRED
GAP_MATRIX_REVALIDATION_REQUIRED
IMPLEMENTATION_PLAN_REVALIDATION_REQUIRED
UPSTREAM_PLANNING_REVALIDATION_REQUIRED
BLOCKED_INSUFFICIENT_REASSESSMENT
STALE_AUDIT_BASIS
AUDIT_SUBJECT_MISMATCH
```

Use:

```text
COMPONENT_IMPLEMENTATION_TICKET_REMEDIATION_BLOCKED
reason = <one exact reason>
```

`UPSTREAM_PLANNING_REVALIDATION_REQUIRED` is reserved for an upstream semantic
change not covered by a complete reassessment or requiring upstream ownership;
it is not a synonym for the presence of assessed baseline drift.

## 17. Finding ledger, verdicts, and reports

Create:

| Finding | Validation | Root Cause | Ticket Change | Evidence | Result |
| ------- | ---------- | ---------- | ------------- | -------- | ------ |

Every CITA finding appears exactly once. Remediation is complete only when all
confirmed CRITICAL/MAJOR and implementation-blocking MINOR findings are
remediated, all derived structures reconcile, and no upstream escalation
remains.

Use exactly one:

```text
COMPONENT_IMPLEMENTATION_TICKET_REMEDIATION_COMPLETE
COMPONENT_IMPLEMENTATION_TICKET_REMEDIATION_PARTIAL
COMPONENT_IMPLEMENTATION_TICKET_REMEDIATION_BLOCKED
TICKET_REMEDIATION_NOT_REQUIRED
```

Complete emits only:

```text
READY_FOR_INDEPENDENT_TICKET_REAUDIT
```

Never emit `IMPLEMENTATION_TICKETS_CONFORMANT` or `READY_FOR_IMPLEMENTATION`.

If repository convention requires evidence, create:

```text
<ticket-folder>/implementation-ticket-remediation.md
```

with Remediation Verdict/Mode, Subject, Source Audit, Baseline, Authority,
Finding Intake/Ledger, ticket changes, traceability, ownership, split/merge,
closure/acceptance, proof, dependencies/status, waves, tests/evidence,
index/metrics, escalations, files, and re-audit readiness.

## 18. Change-boundary proof

Report:

```text
ADRS_CHANGED = NO
PORTFOLIO_CHANGED = NO
COMPONENT_SPEC_CHANGED = NO
UPSTREAM_SPECS_CHANGED = NO
GAP_MATRIX_CHANGED = NO
IMPLEMENTATION_PLAN_CHANGED = NO
PLAN_AUDIT_CHANGED = NO
PRODUCTION_CODE_CHANGED = NO
TESTS_CHANGED = NO
```

Ticket files, index, and remediation evidence may change.

## 19. Final console response

Success:

```text
COMPONENT_IMPLEMENTATION_TICKET_REMEDIATION_COMPLETE

SPEC: <SPEC-ID>
PORTFOLIO: <PORTFOLIO-ID>
TICKET_FOLDER: <path>
TICKET_INDEX: <path>
SOURCE_AUDIT: <path>

BASELINE:
- AUDITED_HEAD: <sha>
- CURRENT_HEAD: <sha>
- DRIFT: <classification>

FINDINGS:
- RECEIVED: <n>
- CONFIRMED: <n>
- REMEDIATED: <n>
- ALREADY_REMEDIATED: <n>
- REJECTED_BY_VALID_EVIDENCE: <n>
- PARTIAL: 0
- BLOCKED: 0

TICKETS:
- BEFORE: <n>
- AFTER: <n>
- ADDED: <n>
- REMOVED: <n>
- SPLIT: <n>
- MERGED: <n>
- READY: <n>
- BLOCKED: <n>

COVERAGE:
- IMPLEMENTATION_UNITS_FULLY_DECOMPOSED: <n>/<n>
- UNMAPPED_PORTFOLIO_OBLIGATIONS: 0
- UNMAPPED_LOCAL_GAPS: 0
- UNCOVERED_ACCEPTANCE_OBLIGATIONS: 0

STRUCTURE:
- FALSE_TICKET_SPLITS: 0
- FALSE_TICKET_MERGES: 0
- TICKETS_WITH_LOCAL_CLOSURE_NO: 0

PROOF:
- UNRESOLVED_FINAL_PROOF_OWNERS: 0
- FINAL_PROOF_PREMATURE: 0

EXECUTION:
- STATUS_ERRORS: 0
- DEPENDENCY_ERRORS: 0
- BLOCKER_ERRORS: 0
- KNOWN_EXTERNAL_BLOCKERS: <n>
- HIDDEN_EXTERNAL_BLOCKERS: 0
- UNBLOCK_MISMATCHES: 0
- DEPENDENCY_GRAPH_CYCLE: NO
- BLOCKER_GRAPH_CYCLE: NO

OWNERSHIP:
- OWNERSHIP_ERRORS: 0
- FOREIGN_CAPABILITY_DUPLICATION: 0

PARALLELIZATION:
- UNSAFE_WAVE_ASSIGNMENTS: 0
- INVALID_PARALLELIZATIONS: 0

EVIDENCE:
- CRITICAL_TEST_GAPS: 0
- INSUFFICIENT_COMPLETION_GATES: 0

GATE:
READY_FOR_INDEPENDENT_TICKET_REAUDIT

REMEDIATION_REPORT: <path>
```

Blocked:

```text
COMPONENT_IMPLEMENTATION_TICKET_REMEDIATION_BLOCKED

SPEC: <SPEC-ID>
TICKET_FOLDER: <path>
SOURCE_AUDIT: <path>
BLOCKER: <exact reason>
AFFECTED_FINDING: <CITA-ID>
AFFECTED_TICKET: <TICKET-ID or N/A>
REQUIRED_UPSTREAM_ACTION: <precise action>
GATE: BLOCKED
```

## 20. Prohibited shortcuts and completion invariant

Do not modify code, tests, ADRs, portfolio, SPECs, Gap Matrix, Plan, or audits;
hide blockers; promote status because prose changed; treat BLOCKED as a defect;
conflate ISSUE_READY with READY; absorb foreign lifecycle; invent Gap scope,
Units, or dependencies; preserve false splits/merges; make downstream work
local; create multiple Final Proof Owners; remove local correctness tests;
create fake foreign tickets; self-approve; or emit READY_FOR_IMPLEMENTATION.

Prefer minimum validated ticket correction, preserved upstream boundaries,
ticket-local closure, truthful blockers, stable boundaries, exact proof roles,
and mechanically reconciled graphs/index.

Remediation is locally complete only when every validated CITA defect is
corrected without changing upstream authority, validated Gap semantics, or
conformant Unit boundaries; every ticket retains complete traceability; no
ticket is speculative, falsely split, falsely merged, or wrong-owner; every
ticket is locally closable; ACs/tests/evidence are local; exactly one Final
Proof Owner exists per multi-ticket obligation; dependencies, blockers, status,
Initial DAG State, UNBLOCKS, graphs, waves, and parallelization reconcile;
known external blockers are explicit; destructive transitions are safely gated;
the index derives from ticket truth; and no upstream decision was invented.

The only successful remediation gate is:

```text
READY_FOR_INDEPENDENT_TICKET_REAUDIT
```

The mandatory next step is:

```text
audit-component-implementation-tickets
```
