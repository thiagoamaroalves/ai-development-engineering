---
name: remediate-component-implementation-plan
description: >
  Remediate validated findings produced by audit-component-implementation-plan
  against one component Implementation Plan. Modify only the audited plan and
  directly related plan-local remediation evidence required to address
  validated CIPA findings. Preserve accepted ADR authority, the approved SPEC
  portfolio decomposition, conformant component and upstream SPEC contracts,
  the validated Gap Matrix, ownership and dependency direction, Gap identities,
  local closure, issue-decomposition readiness, DAG state, acceptance and proof
  ownership, failure ownership, compatibility/cutover ownership, and
  auditability. Use after IMPLEMENTATION_PLAN_REMEDIATION_REQUIRED and before
  independent plan re-audit. Never modify code, tests, ADRs, portfolio
  authority, SPECs, the validated Gap Matrix, or tickets.
---

# Remediate Component Implementation Plan

Before applying baseline gates, read
`skills/_shared/baseline-drift-remediation-contract.md`. A changed baseline is
remediation input when the source audit persisted a complete, actionable
reassessment; only unassessed drift or a stale audit basis blocks.

## Purpose

Remediate validated findings produced by:

```text
audit-component-implementation-plan
```

against a component Implementation Plan.

Workflow:

```text
GAP_MATRIX_CONFORMANT
        +
READY_FOR_IMPLEMENTATION_PLAN
        ↓
plan-component-implementation
        ↓
audit-component-implementation-plan
        ↓
IMPLEMENTATION_PLAN_REMEDIATION_REQUIRED
        ↓
remediate-component-implementation-plan
        ↓
READY_FOR_INDEPENDENT_IMPLEMENTATION_PLAN_REAUDIT
        ↓
audit-component-implementation-plan
        ↺
IMPLEMENTATION_PLAN_CONFORMANT
        ↓
READY_FOR_ISSUE_DECOMPOSITION
```

Correct the planning artifact only. Do not implement gaps, change architecture
or ownership, regenerate the Gap Matrix, create tickets, or approve the Plan.

## Operating mode

Operate in:

```text
WRITE_ALLOWED
AUDIT_DRIVEN
FINDING_DRIVEN
MINIMAL_CHANGE
ADR_FIRST
PORTFOLIO_GOVERNED
SPEC_PRESERVING
GAP_MATRIX_PRESERVING
OWNERSHIP_PRESERVING
DEPENDENCY_PRESERVING
LOCAL_CLOSURE_AWARE
PROOF_OWNERSHIP_AWARE
DAG_AWARE
ISSUE_DECOMPOSITION_AWARE
NO_ARCHITECTURE_INVENTION
NO_SCOPE_EXPANSION
NO_IMPLEMENTATION
NO_TICKET_CREATION
NO_SELF_APPROVAL
```

## Core authority model

Use exactly:

```text
accepted ADR
    >
approved SPEC portfolio decomposition
    >
conformant component SPEC
    >
conformant upstream component SPECs
    >
validated component Implementation Gap Matrix
    >
validated independent Implementation Plan audit findings
    >
current repository evidence
    >
Implementation Plan being remediated
```

Interpret responsibility as:

```text
ADR
    defines architecture

Portfolio
    defines WHO owns obligations
    and normative dependency direction

Component SPEC
    defines WHAT must be true

Gap Matrix
    defines the validated implementation delta

Plan Audit
    defines validated defects in the planning artifact

Plan Remediation
    corrects those defects only
```

## 1. Preconditions

Run normal remediation only when the latest independent audit verdict is:

```text
IMPLEMENTATION_PLAN_REMEDIATION_REQUIRED
```

If it is `IMPLEMENTATION_PLAN_CONFORMANT`, return:

```text
IMPLEMENTATION_PLAN_REMEDIATION_NOT_REQUIRED
reason = PLAN_ALREADY_CONFORMANT
```

If it is `IMPLEMENTATION_PLAN_AUDIT_BLOCKED`, return:

```text
IMPLEMENTATION_PLAN_REMEDIATION_BLOCKED
reason = UPSTREAM_AUDIT_BLOCKER
```

## 2. Required upstream gates

Verify:

```text
PORTFOLIO_VERDICT = PORTFOLIO_DECOMPOSITION_APPROVED
COMPONENT_SPEC_VERDICT = PASS — COMPONENT_SPEC_CONFORMANT
GAP_MATRIX_VERDICT = GAP_MATRIX_CONFORMANT
GAP_MATRIX_READINESS = READY_FOR_IMPLEMENTATION_PLAN
```

If any is invalid:

```text
IMPLEMENTATION_PLAN_REMEDIATION_BLOCKED
reason = UPSTREAM_CONFORMANCE_GATE_NOT_SATISFIED
```

## 3. Required inputs

Identify:

* accepted ADRs;
* governing portfolio and portfolio audit;
* component SPEC and SPEC audit;
* conformant upstream SPECs;
* validated Gap Matrix and Gap Matrix audit;
* Implementation Plan;
* latest component Implementation Plan audit;
* obligation, dependency, failure, and compatibility registries;
* repository root and relevant evidence;
* audit baseline, plan baseline, and current HEAD.

## 4. Establish remediation baseline

Record:

```text
SPEC_ID
PORTFOLIO_ID
IMPLEMENTATION_PLAN
SOURCE_AUDIT
SOURCE_AUDIT_VERDICT
PORTFOLIO_BASELINE
COMPONENT_SPEC_BASELINE
UPSTREAM_SPEC_BASELINES
GAP_MATRIX_BASELINE
PLAN_BASELINE
AUDIT_HEAD
CURRENT_HEAD
WORKING_TREE_STATE
ACTIVE_FINDINGS
BASELINE_DRIFT_STATUS
REASSESSMENT_COMPLETE
FINDINGS_ARE_ACTIONABLE
BASELINE_REMEDIATION_READINESS
AUDIT_BASIS_FINGERPRINT
BASELINE_REASSESSMENT_PROOF
```

## 5. Baseline drift validation

Consume the source audit's `BASELINE_REASSESSMENT_PROOF` and shared state before
classifying local plan drift. Preserve the old audited baselines and record the
current adopted authority/repository fingerprint.

Compare:

```text
PORTFOLIO_BASELINE
COMPONENT_SPEC_BASELINE
UPSTREAM_SPEC_BASELINES
GAP_MATRIX_BASELINE
PLAN_BASELINE
REPOSITORY_BASELINE
```

Classify:

```text
NO_RELEVANT_DRIFT
NON_SEMANTIC_DOCUMENTARY_DRIFT
LOCALIZED_PLAN_DRIFT
LOCALIZED_IMPLEMENTATION_DRIFT
MATERIAL_AUTHORITY_DRIFT
```

Material changes to ADRs, portfolio, SPECs, upstream contracts, or the
validated Gap Matrix require complete reassessment proof. When that proof is
complete, findings are actionable, and the live fingerprint equals the audit
basis, continue with:

```text
BASELINE_DRIFT_STATUS = DRIFT_ASSESSED
REASSESSMENT_COMPLETE = YES
BASELINE_REMEDIATION_READINESS = READY
REMEDIATION_ENTRY_STATE = IMPLEMENTATION_PLAN_REMEDIATION_ALLOWED
```

If the proof is absent/incomplete or drift is `DRIFT_UNASSESSED`, return:

```text
IMPLEMENTATION_PLAN_REMEDIATION_BLOCKED
reason = BLOCKED_INSUFFICIENT_REASSESSMENT
```

If the live authority or repository differs from the persisted audit basis after
the reassessment, return:

```text
IMPLEMENTATION_PLAN_REMEDIATION_BLOCKED
reason = STALE_AUDIT_BASIS
```

Do not request another audit merely because the source audit reported drift;
request one only for incomplete reassessment or a newly stale audit basis.

## 6. Intake and revalidate every CIPA finding

Read the full audit and inventory every:

```text
CIPA-CRITICAL-###
CIPA-MAJOR-###
CIPA-MINOR-###
CIPA-INFO-###
```

Capture:

```text
Finding ID
Severity
Issue decomposition impact
Category
ADR
Portfolio Obligation
Component Requirement
Gap ID
Approved Owner
Plan Unit
Plan Section
Plan Claim
Independent Audit Result
Repository Evidence
Local Closure Impact
Acceptance / Proof Ownership Impact
DAG / Dependency Impact
Minimum Plan Correction
Revalidation Condition
```

Revalidate each as:

```text
CONFIRMED
ALREADY_REMEDIATED
SUPERSEDED_BY_VALID_PLAN_CHANGE
INVALIDATED_BY_NEW_EVIDENCE
BLOCKED_BY_BASELINE_CHANGE
```

Reject only with concrete evidence. Use remediation states only:

```text
REMEDIATED
ALREADY_REMEDIATED
REJECTED_BY_VALID_EVIDENCE
PARTIALLY_REMEDIATED
BLOCKED
```

Never use `CLOSED`, `CONFORMANT`, or `APPROVED`; only the independent re-audit
may close findings.

## 7. Modification boundary and root causes

Normally modify only the Implementation Plan and an optional plan-local
remediation report. Do not modify ADRs, portfolio, SPECs, upstream SPECs, Gap
Matrix, code, tests, migrations, tickets, Issues, or prior audits.

For each confirmed finding classify one or more:

```text
GAP_COVERAGE
UNIT_JUSTIFICATION
UNIT_GRANULARITY
OWNERSHIP
NORMATIVE_DEPENDENCY
CROSS_SPEC_DEPENDENCY
LOCAL_ACCEPTANCE_ALLOCATION
LOCAL_CLOSURE
COMPLETION_EVIDENCE
TEST_ALLOCATION
ISSUE_DECOMPOSITION_READINESS
INITIAL_DAG_STATE
DAG_STRUCTURE
PARALLELIZATION
FINAL_PROOF_OWNERSHIP
FAILURE_OWNERSHIP
COMPATIBILITY_CUTOVER
TRACEABILITY
METRICS
BASELINE_METADATA
OTHER_PLAN_LOCAL
```

## 8. Preserve validated Gap semantics and traceability

Do not alter Gap classification, category, severity, exact delta, ownership, or
identity. If a finding appears to require that, return:

```text
IMPLEMENTATION_PLAN_REMEDIATION_BLOCKED
reason = GAP_MATRIX_REVALIDATION_REQUIRED
```

Every affected unit must preserve:

```text
ADR
→ Portfolio Obligation
→ Component Requirement
→ Validated Gap
→ Implementation Unit
```

Correct missing plan traceability without inventing obligations.

## 9. Gap coverage and speculative-unit remediation

For `UNCOVERED_GAP`, `PARTIALLY_COVERED_GAP`, or `MIS_COVERED_GAP`, address the
complete validated local delta without broadening it. Reuse existing units when
coherent; add a unit only when the work cannot fit without false merge or
closure defects.

For `SPECULATIVE_UNIT`, retain it only when:

```text
VALIDATED_GAP_BACKING = YES
```

or:

```text
REQUIRED_SUPPORTING_WORK = YES
```

Otherwise remove it and reconcile the DAG, waves, checkpoints, traceability,
acceptance mapping, and metrics.

For overbroad units, remove only behavior not justified by validated Gap or
required supporting work.

## 10. Ownership and dependency remediation

For ownership leakage, wrong local owner, duplicate foreign capability, or
duplicate canonical authority, restore approved ownership across:

```text
Primary owner
Local behavior
Foreign dependency
Does Not Implement
Acceptance
Tests
Completion Evidence
```

Consumers may implement local integration but not foreign canonical semantics or
lifecycle.

For normative dependency defects use the approved portfolio graph. If a new
normative dependency is actually required:

```text
IMPLEMENTATION_PLAN_REMEDIATION_BLOCKED
reason = PORTFOLIO_DEPENDENCY_CHANGE_REQUIRED
```

For cross-SPEC defects reconcile owner, foreign requirement, consumer unit,
contract, foreign implementation state, independent capability dimensions,
dependency class, availability evidence, and blocking status. A future foreign capability
may block execution but cannot be represented as available. A fixture/mock/fake
is local testability evidence only.

## 11. Readiness, local acceptance, and closure

Preserve:

```text
ISSUE_DECOMPOSITION_READINESS
!=
INITIAL_DAG_STATE
```

Allowed readiness values:

```text
ISSUE_READY
INTERNAL_ONLY
PLAN_BLOCKED
```

Allowed DAG states:

```text
READY
BLOCKED
```

A unit may be `ISSUE_READY` and `INITIAL_DAG_STATE = BLOCKED` when prerequisites
are known. Do not downgrade it merely because execution cannot start.

`ISSUE_READY` still requires `LOCAL_CLOSURE = YES`. If work can start but cannot
close because a capability classified `REQUIRED_FOR_LOCAL_EXECUTION` or
`REQUIRED_FOR_LOCAL_CLOSURE` has `PRODUCTIVE_AVAILABILITY = NO`, split at the
closure boundary or retain `PLAN_BLOCKED` before ticket decomposition. Preserve the exact
`BLOCKED_BY_UPSTREAM_CONTRACT` and `CAPABILITY_ID`.

For every local AC require:

```text
TESTABLE = YES
LOCAL_PROVABILITY = YES
```

Proof may use only behavior from the unit, completed prerequisites, and
confirmed preexisting foreign capabilities.

For every local witness recalculate `WITNESS_EXECUTABLE_AT_LOCAL_CLOSURE`, the
independent capability dimensions, and dependency class. Never move a
durable/recovery/foreign-effect witness downstream merely to preserve a false
`LOCAL_CLOSURE = YES`.

For downstream-dependent or non-local ACs:

1. identify the original normative acceptance;
2. state this unit's local contribution;
3. rewrite the local AC for that contribution;
4. preserve the plan-level Acceptance ID;
5. identify contributors and Final Proof Owner.

Do not absorb excluded behavior to make an AC pass. Reconcile Goal, Required
Behavior, Does Not Implement, dependencies, ACs, tests, completion evidence,
readiness, and DAG state together; never edit only the `LOCAL_CLOSURE` label.

## 12. Completion evidence and test allocation

For every affected evidence item ask whether it exists immediately when the unit
closes. If not, move it to an integration checkpoint, downstream unit, or Final
Proof Owner as appropriate. Keep local correctness evidence local.

Distinguish:

```text
LOCAL_TEST_EVIDENCE
INTEGRATION_TEST_EVIDENCE
FINAL_CONFORMANCE_EVIDENCE
```

Move tests only when their required behavior is unavailable at local closure;
do not defer correctness-sensitive local tests.

## 13. Final Proof Owner remediation

For every multi-unit acceptance:

```text
CONTRIBUTING_UNITS >= 1
FINAL_PROOF_OWNER = exactly 1
```

The owner must run after all required contributors, have the evidence, prove the
complete obligation, and require no future work.

Remove a synthetic proof-only unit unless it has real integration,
conformance, cutover, migration, or cross-unit evidence work. Preserve stable
IDs where practical and reconcile all references.

## 14. Unit boundaries, DAG, waves, and checkpoints

Merge a `FALSE_UNIT_SPLIT` only when units share owner, invariant, closure
condition, compatible dependencies, `SHARED_CLOSURE_BOUNDARY = YES`, and are
not independently closable.

Split a `FALSE_UNIT_MERGE` only when work is materially independent by owner,
dependency, productive availability, authority completeness, cross-SPEC
prerequisite, closure, completion-evidence timing, cutover, or conformance
boundary. Shared authority/persistence/invariant alone is insufficient. Change
boundaries only when acceptance, dependencies, proof, tests, or evidence cannot
restore one shared closure boundary.

Reconstruct the DAG from semantic dependencies. Correct missing, unnecessary,
wrong-direction, hidden, or false-serialization edges. For every edge:

```text
IMP-A → IMP-B
```

IMP-A must not require IMP-B for its own local closure.

For unsafe parallelization, correct Wave, execution mode, coordination, or a
genuine dependency. Allowed modes:

```text
SAFE
SAFE_WITH_COORDINATION
SERIAL_REQUIRED
```

Correct checkpoints as integration gating/evidence only; do not turn a
checkpoint into an implementation unit without actual work.

## 15. Failure, compatibility, and semantic transition remediation

Restore canonical failure ownership and plan only locally owned mapping,
propagation, presentation, or integration.

For compatibility/cutover defects correct only local transition work while
preserving:

```text
NEW_CANONICAL_PATH
LEGACY_COMPATIBILITY
HISTORICAL_REPLAY
CUTOVER
RETIREMENT
```

Separate, where relevant:

```text
INTERNAL_PATH_RETIREMENT
DEPLOYMENT_ROUTE_CUTOVER
LEGACY_WRITE_POLICY
ROLLBACK_AUTHORITY
PARITY_EVIDENCE
FINAL_CUTOVER_PROOF
```

Correct omissions involving uniqueness, stale rejection, compare-and-set,
idempotency, atomicity, durability, retries, recovery, and immutable history
without inventing technical mechanisms.

## 16. Traceability and metrics reconciliation

Rebuild affected Gap → Plan rows:

| Gap | Requirement | Portfolio Obligation | Planning Type | Unit(s) | Status |
| --- | ----------- | -------------------- | ------------- | ------- | ------ |

Allowed status:

```text
COVERED
FOREIGN_DEPENDENCY_ONLY
NO_LOCAL_WORK
BLOCKED
```

Reconcile every Acceptance ID, Cross-Spec Dependency row, Unit Closure Matrix,
DAG, Waves, Checkpoints, Legacy/Cutover table, Test Strategy, and Gate.

Mechanically derive:

```text
VALIDATED_GAPS
LOCAL_IMPLEMENTATION_GAPS
CROSS_SPEC_DEPENDENCIES
PREEXISTING_FOREIGN_CAPABILITIES
NO_LOCAL_WORK_GAPS
IMPLEMENTATION_UNITS
LOCALLY_CLOSABLE_UNITS
NON_LOCALLY_CLOSABLE_UNITS
ISSUE_DECOMPOSITION_READY_UNITS
INTERNAL_ONLY_UNITS
PLAN_BLOCKED_UNITS
INITIAL_READY_UNITS
INITIAL_BLOCKED_UNITS
GAPS_WITH_PLAN_COVERAGE
GAPS_WITHOUT_PLAN_COVERAGE
UNITS_WITHOUT_GAP_OR_SUPPORTING_AUTHORITY
FALSE_UNIT_SPLITS
FALSE_UNIT_MERGES
ACCEPTANCE_OBLIGATIONS
ACCEPTANCE_WITH_FINAL_PROOF_OWNER
UNRESOLVED_FINAL_PROOF_OWNERS
LOCAL_AC_REQUIRING_DOWNSTREAM
LOCAL_AC_CONTRADICTING_DOES_NOT_IMPLEMENT
LOCAL_AC_REQUIRING_UNAVAILABLE_FOREIGN_CAPABILITY
UNAPPROVED_NORMATIVE_DEPENDENCIES
SPECIFICATION_GAPS
ARCHITECTURE_GAPS
PORTFOLIO_GAPS
UPSTREAM_CONTRACT_GAPS
DAG_CYCLE_DETECTED
```

## 17. Required remediation invariants

Successful local remediation requires:

```text
GAPS_WITHOUT_PLAN_COVERAGE = 0
UNITS_WITHOUT_GAP_OR_SUPPORTING_AUTHORITY = 0
FALSE_UNIT_SPLITS = 0
FALSE_UNIT_MERGES = 0
UNRESOLVED_FINAL_PROOF_OWNERS = 0
LOCAL_AC_REQUIRING_DOWNSTREAM = 0
LOCAL_AC_CONTRADICTING_DOES_NOT_IMPLEMENT = 0
LOCAL_AC_REQUIRING_UNAVAILABLE_FOREIGN_CAPABILITY = 0
LOCAL_CLOSURE_WITH_UNAVAILABLE_REQUIRED_CAPABILITY = 0
WITNESSES_NOT_EXECUTABLE_AT_LOCAL_CLOSURE = 0
DOWNSTREAM_PROMOTION_WITHOUT_NEW_EVIDENCE = 0
UNAPPROVED_NORMATIVE_DEPENDENCIES = 0
SPECIFICATION_GAPS = 0
ARCHITECTURE_GAPS = 0
PORTFOLIO_GAPS = 0
UPSTREAM_CONTRACT_GAPS = 0
DAG_CYCLE_DETECTED = NO
```

These prove remediation consistency, not Plan conformance.

## 18. Upstream escalation

Stop affected remediation and return the exact blocker for:

```text
SPEC_REMEDIATION_REQUIRED
ADR_CLARIFICATION_REQUIRED
PORTFOLIO_REMEDIATION_REQUIRED
PORTFOLIO_DEPENDENCY_CHANGE_REQUIRED
UPSTREAM_SPEC_REMEDIATION_REQUIRED
GAP_MATRIX_REVALIDATION_REQUIRED
BLOCKED_INSUFFICIENT_REASSESSMENT
STALE_AUDIT_BASIS
```

Return:

```text
IMPLEMENTATION_PLAN_REMEDIATION_BLOCKED
reason = <one exact reason>
```

## 19. Finding ledger and verdicts

Produce:

| Finding | Validation | Root Cause | Plan Change | Evidence | Result |
| ------- | ---------- | ---------- | ----------- | -------- | ------ |

Every original CIPA finding appears exactly once. Never self-close it; use only
`REMEDIATED`, `ALREADY_REMEDIATED`, `REJECTED_BY_VALID_EVIDENCE`,
`PARTIALLY_REMEDIATED`, or `BLOCKED`.

Use exactly one verdict:

```text
COMPONENT_IMPLEMENTATION_PLAN_REMEDIATION_COMPLETE
COMPONENT_IMPLEMENTATION_PLAN_REMEDIATION_PARTIAL
COMPONENT_IMPLEMENTATION_PLAN_REMEDIATION_BLOCKED
IMPLEMENTATION_PLAN_REMEDIATION_NOT_REQUIRED
```

Use `COMPONENT_IMPLEMENTATION_PLAN_REMEDIATION_COMPLETE` only when all confirmed
CRITICAL/MAJOR and issue-decomposition-blocking MINOR findings are remediated,
all affected representations reconcile, no upstream blocker remains, and all
invariants pass. Then emit:

```text
READY_FOR_INDEPENDENT_IMPLEMENTATION_PLAN_REAUDIT
```

## 20. Required remediation artifact

Create:

```text
docs/specs/implementation-plans/remediations/
<SPEC-ID>-implementation-plan-remediation.md
```

or repository-equivalent convention, with:

```text
1. Remediation Verdict
2. Remediation Mode
3. Subject
4. Source Audit
5. Baseline Validation
6. Authority Context
7. Finding Intake
8. Finding Remediation Ledger
9. Gap Coverage Changes
10. Ownership / Dependency Changes
11. Unit Boundary Changes
12. Local Acceptance / Closure Changes
13. Issue Decomposition Readiness Changes
14. Initial DAG State Changes
15. Acceptance / Final Proof Ownership Changes
16. Test / Completion Evidence Changes
17. Failure / Compatibility / Cutover Changes
18. DAG / Wave / Checkpoint Changes
19. Traceability Reconciliation
20. Metric Recalculation
21. Upstream Escalations
22. Files Changed
23. Reaudit Readiness
```

## 21. Change-boundary proof

Report:

```text
ADRS_CHANGED = NO
PORTFOLIO_CHANGED = NO
COMPONENT_SPEC_CHANGED = NO
UPSTREAM_SPECS_CHANGED = NO
GAP_MATRIX_CHANGED = NO
PRODUCTION_CODE_CHANGED = NO
TESTS_CHANGED = NO
TICKETS_CHANGED = NO
```

## 22. Final remediation metrics

Report at minimum:

```text
FINDINGS_RECEIVED
FINDINGS_CONFIRMED
FINDINGS_REMEDIATED
FINDINGS_ALREADY_REMEDIATED
FINDINGS_REJECTED_BY_VALID_EVIDENCE
FINDINGS_PARTIAL
FINDINGS_BLOCKED
UNITS_CHANGED
UNIT_BOUNDARY_CHANGES
LOCAL_CLOSURE_CHANGES
ISSUE_READINESS_CHANGES
INITIAL_DAG_STATE_CHANGES
CROSS_SPEC_DEPENDENCY_CHANGES
ACCEPTANCE_ALLOCATION_CHANGES
FINAL_PROOF_OWNER_CHANGES
FALSE_UNIT_SPLITS
FALSE_UNIT_MERGES
UNCOVERED_LOCAL_GAPS
UNRESOLVED_FINAL_PROOF_OWNERS
LOCAL_AC_REQUIRING_DOWNSTREAM
LOCAL_AC_CONTRADICTING_DOES_NOT_IMPLEMENT
LOCAL_AC_REQUIRING_UNAVAILABLE_FOREIGN_CAPABILITY
UNAPPROVED_NORMATIVE_DEPENDENCIES
DAG_CYCLE_DETECTED
SPECIFICATION_GAPS
ARCHITECTURE_GAPS
PORTFOLIO_GAPS
UPSTREAM_CONTRACT_GAPS
```

## 23. Final console response

For success:

```text
COMPONENT_IMPLEMENTATION_PLAN_REMEDIATION_COMPLETE

SPEC:
<SPEC-ID>

PORTFOLIO:
<PORTFOLIO-ID>

IMPLEMENTATION_PLAN:
<path>

SOURCE_AUDIT:
<path>

BASELINE:
- AUDIT_HEAD: <sha>
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

UNITS:
- TOTAL: <n>
- CHANGED: <n>
- FALSE_SPLITS: 0
- FALSE_MERGES: 0
- LOCALLY_CLOSABLE: <n>
- NON_LOCALLY_CLOSABLE: <n>

READINESS:
- ISSUE_READY: <n>
- INTERNAL_ONLY: <n>
- PLAN_BLOCKED: <n>
- INITIAL_READY: <n>
- INITIAL_BLOCKED: <n>

ACCEPTANCE:
- TOTAL: <n>
- WITH_FINAL_PROOF_OWNER: <n>
- UNRESOLVED_FINAL_PROOF_OWNER: 0
- LOCAL_AC_REQUIRING_DOWNSTREAM: 0
- LOCAL_AC_SCOPE_CONTRADICTIONS: 0
- LOCAL_AC_REQUIRING_UNAVAILABLE_FOREIGN: 0

DEPENDENCIES:
- UNAPPROVED_NORMATIVE: 0
- DAG_CYCLE: NO

AUTHORITY_GAPS:
- SPECIFICATION: 0
- ARCHITECTURE: 0
- PORTFOLIO: 0
- UPSTREAM_CONTRACT: 0

GATE:
READY_FOR_INDEPENDENT_IMPLEMENTATION_PLAN_REAUDIT

REMEDIATION_REPORT:
<path>
```

For a blocker:

```text
COMPONENT_IMPLEMENTATION_PLAN_REMEDIATION_BLOCKED

SPEC:
<SPEC-ID>

IMPLEMENTATION_PLAN:
<path>

SOURCE_AUDIT:
<path>

BLOCKER:
<exact reason>

AFFECTED_FINDING:
<CIPA-ID>

AFFECTED_UNIT:
<IMP-ID or N/A>

REQUIRED_UPSTREAM_ACTION:
<precise action>

GATE:
BLOCKED
```

## 24. Prohibited shortcuts

Do not modify code, tests, ADRs, portfolio, SPECs, Gap Matrix, tickets, or
Issues; generate tickets; mark the Plan conformant; emit
`READY_FOR_ISSUE_DECOMPOSITION`; absorb foreign lifecycle; introduce normative
dependencies; make downstream behavior local; weaken Does Not Implement;
delete acceptance obligations or correctness tests; create unnecessary proof
units; conflate Initial DAG BLOCKED with PLAN_BLOCKED; conflate ISSUE_READY with
DAG READY; preserve false unit splits/merges; or suppress findings to improve
metrics.

## Preferred remediation strategy

Prefer:

```text
smallest semantically correct planning correction
+
preserved authority boundary
+
preserved validated Gap semantics
+
locally provable acceptance
+
locally producible evidence
+
explicit dependency state
+
mechanically reconciled traceability
```

Do not perform large plan rewrites when targeted correction is sufficient.

## Core completion invariant

Plan remediation is locally complete only when it can support:

> Every validated CIPA defect has been corrected within the Implementation Plan
> without changing accepted ADR authority, approved portfolio ownership,
> component or upstream SPEC semantics, or validated Gap Matrix conclusions;
> every affected Implementation Unit remains traceable through Gap, Requirement
> and Portfolio Obligation; units are neither falsely split nor falsely merged;
> foreign lifecycle and normative dependency ownership remain preserved; every
> affected ISSUE_READY unit is independently implementable and locally closable;
> no local Acceptance Criterion depends on downstream work, unavailable foreign
> capability or excluded scope; Completion Evidence and Required Tests are
> available at the correct DAG stage; Issue Decomposition Readiness remains
> distinct from Initial DAG State; every multi-unit acceptance obligation has
> exactly one valid Final Proof Owner; DAG, waves, checkpoints, cross-spec
> dependencies, legacy/cutover semantics, traceability tables and metrics are
> mutually consistent; and no upstream semantic decision was invented during
> remediation.

Even when this invariant holds, the plan is not yet approved.

The only successful remediation gate is:

```text
READY_FOR_INDEPENDENT_IMPLEMENTATION_PLAN_REAUDIT
```

The mandatory next step is:

```text
audit-component-implementation-plan
```
