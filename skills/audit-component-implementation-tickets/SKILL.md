---
name: audit-component-implementation-tickets
description: >
  Independently audit a complete set of component implementation tickets
  generated from a conformant component Implementation Plan governed by an
  approved SPEC portfolio decomposition. Verify the full ADR to Portfolio
  Obligation to Component Requirement to Gap to Implementation Unit to Ticket
  traceability chain; ticket scope and local closure; decomposition
  completeness; ownership; normative dependencies; status, blockers,
  dependencies, handoffs, blocker graph, waves, parallelization, acceptance,
  Final Proof Ownership, tests, completion evidence, legacy/cutover safety,
  failure and compatibility ownership, and readiness for implementation. Use
  after ticket decomposition and before implementation. Read-only; never
  remediate tickets, modify upstream authority, or implement code.
---

# Audit Component Implementation Tickets

## Purpose

Independently determine whether generated component implementation tickets are a
complete, correct, ownership-preserving, dependency-safe and execution-safe
decomposition of a conformant component Implementation Plan.

Workflow:

```text
Accepted ADRs
 + PORTFOLIO_DECOMPOSITION_APPROVED
 + PASS — COMPONENT_SPEC_CONFORMANT
 + GAP_MATRIX_CONFORMANT
 + IMPLEMENTATION_PLAN_CONFORMANT
 + READY_FOR_ISSUE_DECOMPOSITION
 + Generated Tickets
        ↓
audit-component-implementation-tickets
        ↓
IMPLEMENTATION_TICKETS_CONFORMANT
or
IMPLEMENTATION_TICKETS_REMEDIATION_REQUIRED
        ↓
READY_FOR_IMPLEMENTATION
or
NOT_READY_FOR_IMPLEMENTATION
```

The audit must prove that the implementation orchestrator need not rediscover
authority, ownership, Unit boundaries, dependencies, blockers, acceptance
allocation, Final Proof Ownership, or execution order.

Read `../_shared/authority-completeness-gates.md`. This audit is the readiness
defense: it verifies that upstream contract availability is real at each
ticket's start point and does not create missing authority or contracts.

## Operating mode

```text
READ_ONLY
INDEPENDENT
ADVERSARIAL
ADR_FIRST
PORTFOLIO_GOVERNED
SPEC_FIRST
VALIDATED_GAP_DRIVEN
PLAN_GOVERNED
IMPLEMENTATION_AWARE
EVIDENCE_REQUIRED
OWNERSHIP_PRESERVING
DEPENDENCY_AWARE
STATUS_AWARE
BLOCKER_AWARE
LOCAL_CLOSURE_REQUIRED
PROOF_OWNERSHIP_AWARE
EXECUTION_ORDER_AWARE
TICKET_SKEPTICAL
NO_REMEDIATION
NO_IMPLEMENTATION
```

Do not modify ADRs, portfolio, SPECs, Gap Matrix, Plan, Plan Audit, tickets,
index, code, tests, migrations, schemas, or Issues. Only create the ticket
audit artifact.

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
current repository implementation
    >
tests
    >
ticket set under audit
```

ADR defines architecture; Portfolio defines ownership and normative dependency
direction; SPEC defines required behavior; Gap Matrix defines validated deltas;
Plan defines coherent Units; ticket decomposition creates execution artifacts;
this audit proves or disproves that decomposition. Tickets never redefine
upstream authority.

## 1. Preconditions and blockers

Verify all of:

```text
PORTFOLIO_DECOMPOSITION_APPROVED
PASS — COMPONENT_SPEC_CONFORMANT
GAP_MATRIX_CONFORMANT
READY_FOR_IMPLEMENTATION_PLAN
IMPLEMENTATION_PLAN_CONFORMANT
READY_FOR_ISSUE_DECOMPOSITION
TICKET_DECOMPOSITION_GATE:
READY_FOR_TICKET_AUDIT | READY_FOR_INDEPENDENT_TICKET_REAUDIT
```

Also require current:

```text
SPEC_IMPLEMENTABILITY_CHECK = PASS
IMPLEMENTATION_UNIT_AUTHORITY_CHECK = PASS
```

Reconcile every ticket's capability record with the audited Plan and Gap Matrix:
`CAPABILITY_ID`, authority status, contract status, authority owner, producer,
consumer, contract, semantic status, local testability, productive
availability, dependency class, availability evidence, and blocking effect.
Recalculate the shared `EXECUTION_READY` predicate and the complete
`ACCEPTANCE_WITNESS_MATRIX`; a fixture/mock/in-memory repository proves local
contract behavior only.

If `AUTHORITY_STATUS = UNDEFINED` (derived summary
`AUTHORITY_NOT_DEFINED`), return `TICKET_AUDIT_BLOCKED` with
`reason = BLOCKED_BY_UPSTREAM_AUTHORITY`. If authority exists but the required
producer/consumer capability has `CONTRACT_STATUS = UNDEFINED` or
`PRODUCTIVE_AVAILABILITY = NO` with dependency class
`REQUIRED_FOR_LOCAL_EXECUTION` or `REQUIRED_FOR_LOCAL_CLOSURE`, return
`TICKET_AUDIT_BLOCKED` with `reason = BLOCKED_BY_UPSTREAM_CONTRACT` only when
the ticket set cannot faithfully represent the blocker; otherwise the affected
ticket must remain `BLOCKED`, never `READY`. `AUTHORITY_DEFINED_BUT_NOT_CONSUMABLE`
is only the compatibility label for these lower statuses.

A finalization artifact or checkpoint that records
`DOWNSTREAM_RECONCILIATION_REQUIRED = YES`, `TICKETS_NEWLY_UNBLOCKED`, or a
released dependency edge with `DOWNSTREAM_TICKET_STATE_MUTATIONS = 0` is a
mandatory post-finalization audit trigger. Reconcile the current primary ticket
files against the derived index and preserve the historical
`INITIAL_DAG_STATE`; a released edge may justify a current `READY` state only
after the shared `EXECUTION_READY` predicate is recalculated and all current
blockers are satisfied. Do not treat a finalization projection as proof of
current downstream readiness.

Otherwise return one exact blocker:

```text
TICKET_AUDIT_BLOCKED
reason = PORTFOLIO_NOT_APPROVED
```

```text
TICKET_AUDIT_BLOCKED
reason = COMPONENT_SPEC_NOT_CONFORMANT
```

```text
TICKET_AUDIT_BLOCKED
reason = GAP_MATRIX_NOT_VALIDATED
```

```text
TICKET_AUDIT_BLOCKED
reason = IMPLEMENTATION_PLAN_NOT_CONFORMANT
```

```text
TICKET_AUDIT_BLOCKED
reason = PLAN_NOT_READY_FOR_ISSUE_DECOMPOSITION
```

```text
TICKET_AUDIT_BLOCKED
reason = TICKET_DECOMPOSITION_NOT_READY_FOR_AUDIT
```

## 2. Required inputs and baseline

Read `skills/_shared/baseline-drift-remediation-contract.md`. When baseline
drift is detected, compare old/current authority and repository state, persist
the complete reassessment proof, and emit exact shared readiness and audit-basis
fingerprint fields. `remediate-component-implementation-tickets` may consume
assessed actionable drift; incomplete reassessment remains a blocker.

Identify accepted ADRs, approved portfolio and audits, component/upstream SPECs
and audits, validated Gap Matrix and audit, conformant Plan and audit, ticket
folder/index/files, repository root, all baselines, current HEAD, and relevant
implementation/tests.

Record:

```text
PORTFOLIO_BASELINE
COMPONENT_SPEC_BASELINE
UPSTREAM_SPEC_BASELINES
GAP_MATRIX_BASELINE
IMPLEMENTATION_PLAN_BASELINE
PLAN_AUDIT_BASELINE
TICKET_DECOMPOSITION_BASELINE
CURRENT_HEAD
WORKING_TREE_STATE
BASELINE_DRIFT_STATUS
REASSESSMENT_COMPLETE
FINDINGS_ARE_ACTIONABLE
BASELINE_REMEDIATION_READINESS
AUDIT_BASIS_FINGERPRINT
```

Track each drift independently:

```text
PORTFOLIO_BASELINE_DRIFT
COMPONENT_SPEC_BASELINE_DRIFT
UPSTREAM_SPEC_BASELINE_DRIFT
GAP_MATRIX_BASELINE_DRIFT
PLAN_BASELINE_DRIFT
REPOSITORY_BASELINE_DRIFT
```

Classify overall drift as:

```text
NO_RELEVANT_DRIFT
NON_SEMANTIC_DOCUMENTARY_DRIFT
LOCALIZED_IMPLEMENTATION_DRIFT
LOCALIZED_TICKET_DRIFT
MATERIAL_BASELINE_DRIFT
```

For material drift, complete and persist `BASELINE_REASSESSMENT_PROOF` before
deciding the verdict. Assessed actionable drift is a valid remediation input:

```text
BASELINE_DRIFT_STATUS = DRIFT_ASSESSED
REASSESSMENT_COMPLETE = YES
BASELINE_REMEDIATION_READINESS = READY
```

Use `TICKET_AUDIT_BLOCKED` with
`reason = BLOCKED_INSUFFICIENT_REASSESSMENT` only when the current authority,
source/repository baseline, affected ticket records, or evidence cannot be
determined. If the live state changes after this audit, the remediator blocks
with `STALE_AUDIT_BASIS`.

Ticket changes after decomposition are audited as current state but cannot be
silently normalized.

## 3. Ticket inventory and identity

Enumerate every ticket file and extract:

```text
Ticket ID
Filename
Title
Status
Blocked By
Depends On
Portfolio Obligations
Requirements
Gap IDs
Implementation Unit
Issue Decomposition Readiness
Initial DAG State
Goal
Validated Delta
Required Behavior
Does Not Implement
Ownership
Cross-Spec Dependencies
Foreign Capabilities
Authority Consumption Proof
Producer / Consumer Contract Proof
Temporal Authority Proof
Acceptance IDs and Proof Roles
Repository Evidence
Expected Repository Impact
Implementation Constraints
Acceptance Criteria
Acceptance Witness Matrix
Required Tests
Completion Evidence
Completion Gate
Legacy / Cutover Impact
Risks
Wave
Parallelization
Unblocks
Ticket Local Closure
```

Every ID is unique. Detect:

```text
DUPLICATE_TICKET_ID
DUPLICATE_TICKET_SCOPE
ORPHAN_TICKET_FILE
INDEX_ONLY_TICKET
FILE_ONLY_TICKET
AMBIGUOUS_FILENAME
```

Required:

```text
DUPLICATE_TICKET_IDS = 0
ORPHAN_TICKETS = 0
```

For every external capability, verify its
`PRODUCER_CONSUMER_CONTRACT_PROOF`: producer, produced contract, authority
owner, consumer, capability, availability condition, and dependency edge. A
ticket's `READY` claim is valid only when that contract is productively
available at the ticket's execution point.

## 4. Full authority traceability

Every ticket must preserve:

```text
ADR
→ Portfolio Obligation
→ Component Requirement
→ Gap
→ Implementation Unit
→ Ticket
```

Verify each referenced ID exists upstream and classify:

```text
TRACEABILITY_COMPLETE
PORTFOLIO_OBLIGATION_MISSING
REQUIREMENT_REFERENCE_INVALID
GAP_REFERENCE_INVALID
WRONG_IMPLEMENTATION_UNIT
WRONG_COMPONENT_SPEC
WRONG_GAP_MATRIX
WRONG_IMPLEMENTATION_PLAN
WRONG_PLAN_AUDIT
```

Reconstruct all locally implemented Portfolio Obligations and require:

```text
UNMAPPED_PORTFOLIO_OBLIGATIONS = 0
```

## 5. Unit and Gap coverage

Reconstruct all decomposable Units and classify each:

```text
FULLY_DECOMPOSED
PARTIALLY_DECOMPOSED
NOT_DECOMPOSED
OVER_DECOMPOSED
INVALID_SPLIT
INVALID_MERGE
```

Combined ticket scope must preserve full Unit Goal, behavior, acceptance, tests,
completion evidence, ownership, and dependencies.

Only Units with `ISSUE_DECOMPOSITION_READINESS = ISSUE_READY` normally produce
tickets. Detect tickets from `PLAN_BLOCKED` Units and unjustified
`INTERNAL_ONLY` tickets.

For each active local Gap classify:

```text
FULLY_COVERED
PARTIALLY_COVERED
MIS_COVERED
UNCOVERED
FOREIGN_DEPENDENCY_CORRECTLY_EXCLUDED
NO_LOCAL_WORK_CORRECTLY_EXCLUDED
```

A Gap ID appearing in text is insufficient. Require:

```text
UNMAPPED_LOCAL_GAPS = 0
```

Tickets must not resurrect a false-positive Gap removed by validated audit:

```text
RESURRECTED_FALSE_POSITIVE_GAPS = 0
```

Every ticket must have conformant Unit backing or a valid Unit split. Classify
each as `JUSTIFIED`, `OVERBROAD`, `SPECULATIVE`, `DUPLICATIVE`, `WRONG_OWNER`,
`INVALID_SPLIT`, or `INVALID_MERGE`.

## 6. Ownership and normative dependency audit

For every ticket compare:

```text
PORTFOLIO_APPROVED_OWNER
PLAN_OWNER
TICKET_OWNER
```

Detect ownership leakage, wrong local owner, duplicated foreign capability,
duplicated canonical authority, and missing foreign owner. Require:

```text
OWNERSHIP_ERRORS = 0
```

Use the approved portfolio dependency graph and classify every dependency:

```text
APPROVED_NORMATIVE_DEPENDENCY
VALID_IMPLEMENTATION_DEPENDENCY
VALID_SPLIT_DEPENDENCY
UNAPPROVED_NORMATIVE_DEPENDENCY
WRONG_NORMATIVE_DIRECTION
IMPLEMENTATION_DEPENDENCY_MISREPRESENTED_AS_NORMATIVE
```

Require:

```text
UNAPPROVED_NORMATIVE_DEPENDENCIES = 0
```

No local ticket implements another SPEC's canonical lifecycle or authority.

## 7. Split, merge, and granularity audit

Valid Unit split reasons are:

```text
INDEPENDENT_DURABLE_MIGRATIONS
HARD_REPOSITORY_BOUNDARY
MANDATORY_SEQUENTIAL_PREREQUISITE
DESTRUCTIVE_CUTOVER_SEPARATION
EXCESSIVE_CHANGE_RADIUS
INDEPENDENTLY_CLOSABLE_SUBWORK
REPOSITORY_COLLISION_SEQUENCING
```

Detect `FALSE_TICKET_SPLIT` when tickets cannot independently close, divide one
invariant, require each other's future behavior, duplicate proof boundaries, or
exist only for artificial parallelism.

Detect `FALSE_TICKET_MERGE` when a ticket absorbs independently closable Units,
different owners, unrelated dependencies, independent cutover, or unrelated
conformance boundaries. Also detect it when productive availability, external
blockers, authority completeness, cross-SPEC prerequisites, local closure
conditions, completion-evidence timing, or `SHARED_CLOSURE_BOUNDARY` differ.
Shared authority, persistence boundary, or invariant alone is not merge proof.

Require:

```text
FALSE_TICKET_SPLITS = 0
FALSE_TICKET_MERGES = 0
```

## 8. Local closure and acceptance audit

Every implementation ticket must independently prove:

```text
TICKET_LOCAL_CLOSURE = YES
```

This requires local ACs provable, required tests executable, Completion Evidence
locally producible, no downstream ticket required, no unavailable foreign
capability, and no Does Not Implement contradiction.

For every local witness row require the producer/capability, canonical
availability status, evidence type, and:

```text
WITNESS_EXECUTABLE_AT_LOCAL_CLOSURE = YES
```

If a capability required for local execution/closure has
`PRODUCTIVE_AVAILABILITY = NO`, the ticket must be `BLOCKED` by
`BLOCKED_BY_UPSTREAM_CONTRACT`; it cannot claim local closure, `BLOCKED_BY:
NONE`, or `STATUS: READY`. A dependency classified only
`REQUIRED_FOR_INTEGRATED_PROOF` or `INFORMATIONAL` does not create this local
blocker.

For every AC determine:

```text
TESTABLE = YES | NO
LOCALLY_PROVABLE = YES | NO
```

Classify vague, non-testable, over-specified, missing-negative-case, non-local,
downstream-dependent, Does Not Implement contradiction, or unavailable
dependency acceptance.

Preserve distinct roles:

```text
CONTRIBUTOR
LOCAL_ACCEPTANCE_OWNER
FINAL_PROOF_OWNER
```

Reconstruct all Acceptance obligations. For each affected multi-ticket
obligation require exactly one Final Proof Owner or `ALREADY_SATISFIED`:

```text
UNRESOLVED_TICKET_FINAL_PROOF_OWNERS = 0
```

The owner must execute after contributors, have evidence, prove the complete
obligation, and require no future ticket. Detect missing, invalid, premature,
multiple, or synthetic proof ownership.

## 9. Dependency, blocker, status, and handoff audit

Reconstruct ticket prerequisites from Plan DAG, Unit dependencies, legitimate
splits, and cross-SPEC prerequisites. Detect missing/extra/wrong-direction,
false-serialization, and hidden dependencies. A split may add sequencing but
may not remove a Plan prerequisite.

For each ticket reconcile:

```text
DEPENDS_ON
BLOCKED_BY
Current prerequisite state
```

Run the shared `CALLER_AS_AUTHORITY_CHECK` and verify applicable
`TEMPORAL_AUTHORITY_PROOF` references are preserved in the ticket. Do not
accept caller-supplied canonical values or an unverified mutable-authority
dependency as evidence of readiness.

Classify valid, missing, false, stale, wrong-target, or hidden external
blockers. Initial statuses normally are only `READY` or `BLOCKED`; later states
are audited only when evidence supports them.

`ISSUE_READY` means safe to define; ticket `READY` means safe to start now.
Never conflate them. Parent `INITIAL_DAG_STATE` must be preserved unless a
legitimate split or satisfied prerequisite justifies a change.

`STATUS: READY` is valid only when the shared `EXECUTION_READY` predicate is
true. Any downstream productive-availability promotion without
`NO_DOWNSTREAM_CAPABILITY_PROMOTION_WITHOUT_NEW_EVIDENCE` and its complete
previous/new status, evidence, owner, baseline/commit, and capability ID record
is a gate failure, not a status correction.

For every internal blocker:

```text
B BLOCKED_BY A
```

must imply:

```text
A UNBLOCKS includes B
```

Report missing, false, or wrong-direction UNBLOCKS. External blockers use stable
foreign identifiers, not fake local tickets.

## 10. Graph, wave, and parallelization audit

Construct full `DEPENDS_ON` and `BLOCKED_BY` graphs independently. Require:

```text
DEPENDENCY_GRAPH_CYCLE = NO
BLOCKER_GRAPH_CYCLE = NO
UNBLOCK_GRAPH_MISMATCHES = 0
```

Verify producer before consumer, replacement before destructive retirement,
identity/mapping before migration, and contributors before Final Proof Owner.

Verify each Wave and Parallelization mode against collisions in repository
files, schemas/migrations, contracts, identities, registries, integration
seams, and output consumption. Classify `PARALLEL_SAFE`,
`SAFE_WITH_COORDINATION`, `SERIAL_REQUIRED`, or `INVALID_PARALLELIZATION`.

## 11. Ticket completeness and evidence

Every ticket must contain Status, Source Traceability, Authority/Scope,
Portfolio Obligation, Gap/Requirement/Acceptance coverage, Unit, Goal,
Validated Delta, Required Behavior, Does Not Implement, Repository Evidence,
Expected Impact, Dependencies, Blockers, Constraints, ACs, Proof Role, Tests,
Completion Evidence/Gate, Legacy/Cutover, Risks, Wave, Parallelization,
Handoff, and Local Closure.

Classify `TICKET_COMPLETE`, `TICKET_INCOMPLETE`, `TICKET_AMBIGUOUS`, or
`TICKET_INTERNALLY_INCONSISTENT`.

Inspect cited repository evidence for source, tests, schemas, adapters,
handlers, legacy paths, and preexisting capabilities. Evidence quality:

```text
STRONG
SUFFICIENT
WEAK
CONTRADICTORY
UNSUPPORTED
```

Verify tests cover applicable unit/domain, persistence, application,
integration, cross-spec, concurrency, stale, idempotency, recovery, migration,
compatibility, regression, conformance, and negative semantics. Ticket-owned
tests must execute at local closure. Completion Evidence must be auditable and
locally producible; code existence alone is not enough.

For every Required Behavior and Acceptance Criterion containing normative
behavior, verify a complete `ACCEPTANCE_WITNESS_MATRIX`: concrete operation,
affected state/transition, direct positive test, negative/isolation test, and
expected evidence file. A proxy is not sufficient: registration/listing does
not prove progress, sequential duplication does not prove concurrency, and
source inspection does not prove an architecture guard. Missing or incomplete
rows fail ticket completeness and cannot support `READY`.

## 12. Failure, compatibility, legacy, and destructive-transition audit

For failure-related tickets preserve:

```text
CANONICAL_FAILURE_OWNER
TICKET_LOCAL_ROLE
```

Detect failure-owner leakage, redefined semantics, and foreign failure
implementation.

For canonical path, legacy compatibility, replay, cutover, and retirement,
preserve portfolio ownership and exact transition behavior. Detect wrong owner,
dual authority, unpreserved legacy reads, unretired legacy writes, missing
migration semantics, and misplaced cutover proof.

Tickets that retire legacy writes, alternate authority, or productive routes
must remain blocked until replacement/proof prerequisites exist. Classify
destructive transition as safe, premature retirement, replacement not proven,
or blocker missing.

Verify concurrency, idempotency, stale rejection, immutable state, retries,
recovery, resumption, durable handoff, and predecessor constraints are present
in acceptance and tests where normative.

## 13. Index and execution readiness audit

The ticket index must include Authority, Baselines, Status Summary, Unit→Ticket,
Portfolio Obligation→Ticket, Gap→Ticket, Acceptance→Ticket, dependency/blocker
graph, execution order, initial states, cross-SPEC dependencies, waves, proof
ownership, split/merge ledger, metrics, and gate.

Recompute index from ticket files. Detect stale index, status/blocker/
dependency/coverage/proof/metric mismatches; the index cannot override ticket
truth.

Determine actual startability:

```text
READY_TICKETS_CLAIMED
READY_TICKETS_CONFIRMED
READY_TICKETS_OVERRATED
READY_TICKETS_WITH_UNAVAILABLE_CONTRACT
CAPABILITY_AVAILABILITY_CLASSIFICATION_ERRORS
DOWNSTREAM_PROMOTION_WITHOUT_NEW_EVIDENCE
BLOCKED_TICKETS_CLAIMED
BLOCKED_TICKETS_CONFIRMED
BLOCKERS_MISSING
```

`READY_FOR_IMPLEMENTATION` means the set is conformant, READY tickets are
startable, and BLOCKED tickets have valid explicit blockers. It does not mean
all tickets are READY; blocked tickets may be conformant.

## 14. Escalations and audit dimensions

If audit uncovers unresolved semantics, classify `SPECIFICATION_GAP`,
`PORTFOLIO_GAP`, or `PLAN_GAP`; do not solve it. Use `TICKET_AUDIT_BLOCKED`
only for upstream authority/baseline blockers, not ordinary ticket defects.

Report PASS/FAIL/BLOCKED for:

```text
AUTHORITY_TRACEABILITY
IMPLEMENTATION_UNIT_COVERAGE
GAP_COVERAGE
TICKET_JUSTIFICATION
TICKET_GRANULARITY
OWNERSHIP_CONFORMANCE
DEPENDENCY_CONFORMANCE
BLOCKER_CONFORMANCE
STATUS_CONFORMANCE
LOCAL_CLOSURE_CONFORMANCE
ACCEPTANCE_ALLOCATION
FINAL_PROOF_OWNERSHIP
TEST_STRATEGY
COMPLETION_EVIDENCE
LEGACY_CUTOVER
DAG_CONFORMANCE
PARALLELIZATION_SAFETY
INDEX_CONFORMANCE
IMPLEMENTATION_READINESS
```

## 15. Findings

Use IDs:

```text
CITA-CRITICAL-###
CITA-MAJOR-###
CITA-MINOR-###
CITA-INFO-###
```

CRITICAL includes foreign lifecycle, duplicate canonical authority, premature
destructive retirement, missing blocker permitting unsafe execution, or wrong
canonical owner. MAJOR includes uncovered local Gap, false split/merge, READY
with blocker, missing dependency, hidden blocker, closure failure, invalid proof
allocation, critical test gap, or unsafe parallelization. MINOR is localized
non-corrupting traceability/status/metric/evidence defect. INFO is non-blocking.

Classify every finding:

```text
IMPLEMENTATION_BLOCKING
NON_BLOCKING
```

Every material finding contains ticket(s), Unit(s), ADR/Portfolio/Requirement/
Gap/Owner, ticket claim, independent result, repository evidence, problem,
closure impact, acceptance/proof impact, dependency/blocker impact, orchestration
impact, minimum correction required, and revalidation.

## 16. Verdicts and gates

Use exactly one:

```text
IMPLEMENTATION_TICKETS_CONFORMANT
IMPLEMENTATION_TICKETS_REMEDIATION_REQUIRED
TICKET_AUDIT_BLOCKED
```

Conformant requires zero CRITICAL/MAJOR, zero unmapped local obligations and
Gaps, zero speculative/wrong-owner tickets, zero false splits/merges, all local
closure and local-probability invariants, one valid Final Proof Owner per
affected obligation, no status/dependency/blocker/unblock mismatch, acyclic
graphs, no hidden external blockers, safe waves/parallelization, complete
acceptance/tests/evidence, and zero unresolved SPEC/architecture/portfolio
gaps. Minor non-blocking findings may exist.

Return:

```text
READY_FOR_IMPLEMENTATION
```

only when:

```text
VERDICT = IMPLEMENTATION_TICKETS_CONFORMANT
```

otherwise:

```text
NOT_READY_FOR_IMPLEMENTATION
```

Blocked tickets are allowed when correctly defined and explicitly blocked.

## 17. Required audit artifact

Create:

```text
<ticket-folder>/implementation-ticket-audit.md
```

or repository-equivalent convention, with:

```text
1. Audit Verdict
2. Audit Mode
3. Canonical Subject
4. Baseline Validation
5. Ticket Inventory
6. Full Authority Traceability Audit
7. Portfolio Obligation → Ticket Coverage
8. Implementation Unit → Ticket Coverage
9. Gap → Ticket Coverage
10. Ticket → Plan Justification
11. Portfolio Ownership Audit
12. Normative Dependency Audit
13. Ticket Split / Merge Audit
14. Ticket Local Closure Audit
15. Acceptance Criteria Audit
16. Acceptance / Final Proof Ownership Audit
17. Dependency Audit
18. Blocker Audit
19. Status Audit
20. Initial DAG State Audit
21. Dependency / Blocker Graph Audit
22. Cross-Spec Dependency Audit
23. Wave / Parallelization Audit
24. Ticket Completeness / Granularity Audit
25. Repository Evidence Audit
26. Required Test Audit
27. Completion Evidence / Gate Audit
28. Failure Ownership Audit
29. Compatibility / Legacy / Cutover Audit
30. Concurrency / Idempotency / Recovery Audit
31. Handoff / UNBLOCKS Audit
32. Ticket Index Audit
33. Initial Execution Readiness
34. Metrics Recalculation
35. Findings
36. Upstream Escalations
37. Implementation Gate
38. Closure Metrics
39. Completeness Proof
```

## 18. Completion metrics and checks

Report at minimum:

```text
TICKET_FILES
UNIQUE_TICKET_IDS
DUPLICATE_TICKET_IDS
ORPHAN_TICKETS
PORTFOLIO_OBLIGATIONS_EXPECTED
PORTFOLIO_OBLIGATIONS_MAPPED
UNMAPPED_PORTFOLIO_OBLIGATIONS
IMPLEMENTATION_UNITS_TOTAL
IMPLEMENTATION_UNITS_FULLY_DECOMPOSED
IMPLEMENTATION_UNITS_PARTIALLY_DECOMPOSED
IMPLEMENTATION_UNITS_NOT_DECOMPOSED
ACTIVE_LOCAL_GAPS
GAPS_FULLY_COVERED
GAPS_PARTIALLY_COVERED
UNMAPPED_LOCAL_GAPS
RESURRECTED_FALSE_POSITIVE_GAPS
JUSTIFIED_TICKETS
SPECULATIVE_TICKETS
WRONG_OWNER_TICKETS
FALSE_TICKET_SPLITS
FALSE_TICKET_MERGES
TICKETS_WITH_LOCAL_CLOSURE_NO
LOCAL_PROVABILITY_FAILURES
LOCAL_AC_REQUIRING_DOWNSTREAM
LOCAL_AC_CONTRADICTING_DOES_NOT_IMPLEMENT
LOCAL_AC_REQUIRING_UNAVAILABLE_FOREIGN_CAPABILITY
WITNESS_NOT_EXECUTABLE_AT_LOCAL_CLOSURE
ACCEPTANCE_OBLIGATIONS
ACCEPTANCE_OBLIGATIONS_REFERENCED
UNCOVERED_ACCEPTANCE_OBLIGATIONS
UNRESOLVED_TICKET_FINAL_PROOF_OWNERS
FINAL_PROOF_PREMATURE
SYNTHETIC_FINAL_PROOF_TICKETS
READY_TICKETS_CLAIMED
READY_TICKETS_CONFIRMED
READY_TICKETS_OVERRATED
BLOCKED_TICKETS_CLAIMED
BLOCKED_TICKETS_CONFIRMED
STATUS_ERRORS
DEPENDENCY_ERRORS
BLOCKER_ERRORS
HIDDEN_EXTERNAL_BLOCKERS
UNBLOCK_GRAPH_MISMATCHES
DEPENDENCY_GRAPH_CYCLE
BLOCKER_GRAPH_CYCLE
UNSAFE_WAVE_ASSIGNMENTS
INVALID_PARALLELIZATIONS
CRITICAL_TEST_GAPS
SPECIFICATION_GAPS
ARCHITECTURE_GAPS
PORTFOLIO_GAPS
CRITICAL_FINDINGS
MAJOR_FINDINGS
MINOR_FINDINGS
INFO_FINDINGS
IMPLEMENTATION_BLOCKING_FINDINGS
PRODUCER_CONSUMER_CONTRACT_ERRORS
UPSTREAM_AUTHORITY_BLOCKER_MISMATCHES
CALLER_SUPPLIED_AUTHORITY_BYPASS
TEMPORAL_AUTHORITY_GAPS
```

Also report these mandatory checks as PASS, FAIL, BLOCKED, or NOT_APPLICABLE:

```text
CHECK-01 Portfolio approved and stable.
CHECK-02 Component SPEC conformant.
CHECK-03 Gap Matrix conformant.
CHECK-04 Implementation Plan conformant.
CHECK-05 Ticket decomposition gate valid.
CHECK-06 Baselines valid.
CHECK-07 Full ticket authority traceability.
CHECK-08 Local Portfolio Obligations mapped.
CHECK-09 Every ISSUE_READY Unit fully decomposed.
CHECK-10 Every active local Gap covered.
CHECK-11 No false-positive Gap resurrected.
CHECK-12 Every ticket justified.
CHECK-13 No foreign lifecycle ticket.
CHECK-14 Ownership preserved.
CHECK-15 Normative dependency direction preserved.
CHECK-16 No false Ticket Split.
CHECK-17 No false Ticket Merge.
CHECK-18 Every ticket locally closable.
CHECK-19 Every ticket AC locally provable.
CHECK-20 No downstream local AC.
CHECK-21 No Does Not Implement contradiction.
CHECK-22 No unavailable foreign capability AC.
CHECK-23 Acceptance/proof roles correct.
CHECK-24 Exactly one Final Proof Owner per affected obligation.
CHECK-25 No premature Final Proof Owner.
CHECK-26 DEPENDS_ON correct.
CHECK-27 BLOCKED_BY correct.
CHECK-28 Status mechanically correct.
CHECK-29 ISSUE_READY and ticket READY distinct.
CHECK-30 Initial DAG state preserved.
CHECK-31 Dependency graph acyclic.
CHECK-32 Blocker graph acyclic.
CHECK-33 UNBLOCKS reconciled.
CHECK-34 Cross-SPEC blockers correct.
CHECK-35 Waves safe.
CHECK-36 Parallelization safe.
CHECK-37 Ticket scope complete/coherent.
CHECK-38 Tests sufficient and locally executable.
CHECK-39 Completion Evidence auditable/local.
CHECK-40 Failure ownership preserved.
CHECK-41 Compatibility/cutover ownership preserved.
CHECK-42 Destructive transitions safely blocked.
CHECK-43 Concurrency/idempotency/recovery represented.
CHECK-44 Index matches ticket files.
CHECK-45 READY tickets actually startable.
CHECK-46 BLOCKED tickets have real blockers.
CHECK-47 Set safe for orchestration.
CHECK-48 Producer/consumer contract availability is evidenced.
CHECK-49 READY tickets have no unavailable upstream contract.
CHECK-50 Upstream authority blockers are represented accurately.
CHECK-51 Caller-supplied authority does not bypass canonical truth.
CHECK-52 Temporal authority proofs are preserved where applicable.
CHECK-53 Acceptance witness matrix is complete and direct.
CHECK-54 No proxy-only behavior, untested transition, unproven concurrency
obligation, or missing required architecture guard.
```

## 19. Final console response

Use:

```text
COMPONENT_IMPLEMENTATION_TICKET_AUDIT_COMPLETE

SPEC: <SPEC-ID>
PORTFOLIO: <PORTFOLIO-ID>
TICKET_FOLDER: <path>
TICKET_INDEX: <path>
IMPLEMENTATION_PLAN: <path>
PLAN_AUDIT: <path>

BASELINE_DRIFT_STATUS: <NO_DRIFT|DRIFT_UNASSESSED|DRIFT_ASSESSED>
REASSESSMENT_COMPLETE: <YES|NO>
FINDINGS_ARE_ACTIONABLE: <YES|NO>
BASELINE_REMEDIATION_READINESS: <READY|BLOCKED_INSUFFICIENT_REASSESSMENT>
AUDIT_BASIS_FINGERPRINT: <exact basis>
BASELINE_REASSESSMENT_PROOF: <path or inline section when drift exists>

DIMENSIONS:
- AUTHORITY_TRACEABILITY: <PASS|FAIL|BLOCKED>
- IMPLEMENTATION_UNIT_COVERAGE: <PASS|FAIL|BLOCKED>
- GAP_COVERAGE: <PASS|FAIL|BLOCKED>
- TICKET_JUSTIFICATION: <PASS|FAIL|BLOCKED>
- TICKET_GRANULARITY: <PASS|FAIL|BLOCKED>
- OWNERSHIP_CONFORMANCE: <PASS|FAIL|BLOCKED>
- DEPENDENCY_CONFORMANCE: <PASS|FAIL|BLOCKED>
- BLOCKER_CONFORMANCE: <PASS|FAIL|BLOCKED>
- STATUS_CONFORMANCE: <PASS|FAIL|BLOCKED>
- LOCAL_CLOSURE_CONFORMANCE: <PASS|FAIL|BLOCKED>
- ACCEPTANCE_ALLOCATION: <PASS|FAIL|BLOCKED>
- FINAL_PROOF_OWNERSHIP: <PASS|FAIL|BLOCKED>
- TEST_STRATEGY: <PASS|FAIL|BLOCKED>
- COMPLETION_EVIDENCE: <PASS|FAIL|BLOCKED>
- LEGACY_CUTOVER: <PASS|FAIL|BLOCKED>
- DAG_CONFORMANCE: <PASS|FAIL|BLOCKED>
- PARALLELIZATION_SAFETY: <PASS|FAIL|BLOCKED>
- INDEX_CONFORMANCE: <PASS|FAIL|BLOCKED>
- IMPLEMENTATION_READINESS: <PASS|FAIL|BLOCKED>
- PRODUCER_CONSUMER_CONFORMANCE: <PASS|FAIL|BLOCKED>
- AUTHORITY_AVAILABILITY_CONFORMANCE: <PASS|FAIL|BLOCKED>

UNITS: TOTAL=<n> FULLY_DECOMPOSED=<n> PARTIAL=<n> NOT_DECOMPOSED=<n>
GAPS: ACTIVE_LOCAL=<n> FULLY_COVERED=<n> PARTIAL=<n> UNMAPPED=<n>
TICKETS: TOTAL=<n> JUSTIFIED=<n> SPECULATIVE=<n> FALSE_SPLITS=<n> FALSE_MERGES=<n> LOCAL_CLOSURE_NO=<n>
STATUS: READY_CLAIMED=<n> READY_CONFIRMED=<n> READY_OVERRATED=<n> BLOCKED_CLAIMED=<n> BLOCKED_CONFIRMED=<n>
ACCEPTANCE: TOTAL=<n> REFERENCED=<n> UNCOVERED=<n> UNRESOLVED_FINAL_PROOF_OWNER=<n> FINAL_PROOF_PREMATURE=<n> LOCAL_AC_REQUIRING_DOWNSTREAM=<n>
DEPENDENCIES: STATUS_ERRORS=<n> DEPENDENCY_ERRORS=<n> BLOCKER_ERRORS=<n> HIDDEN_EXTERNAL_BLOCKERS=<n> UNBLOCK_MISMATCHES=<n> DEPENDENCY_GRAPH_CYCLE=YES|NO BLOCKER_GRAPH_CYCLE=YES|NO
EXECUTION: UNSAFE_WAVE_ASSIGNMENTS=<n> INVALID_PARALLELIZATIONS=<n> CRITICAL_TEST_GAPS=<n>
FINDINGS: CRITICAL=<n> MAJOR=<n> MINOR=<n> INFO=<n>

VERDICT:
<IMPLEMENTATION_TICKETS_CONFORMANT | IMPLEMENTATION_TICKETS_REMEDIATION_REQUIRED | TICKET_AUDIT_BLOCKED>

IMPLEMENTATION_GATE:
<READY_FOR_IMPLEMENTATION | NOT_READY_FOR_IMPLEMENTATION>

REPORT: <path>

NEXT_TICKET_SET_OPERATION:
<remediate-component-implementation-tickets |
 audit-component-implementation-tickets |
 design-ticket-implementation |
 implement-ready-tickets |
 HUMAN_REQUIRED>
```

## Core completion invariant

The audit is complete only when it independently supports:

> Every generated ticket preserves the full ADR to Portfolio Obligation to
> Requirement to Gap to Implementation Unit to Ticket chain; every ISSUE_READY
> Unit is fully decomposed; no local Gap or obligation is lost; no false-positive
> Gap is resurrected; no ticket is speculative, falsely split, falsely merged,
> or wrong-owner; every ticket is locally closable at its graph position;
> criteria, tests, and evidence are locally available; contributors and exactly
> one Final Proof Owner are preserved; dependencies, blockers, status, waves,
> parallelization and UNBLOCKS reconcile; ISSUE_READY remains distinct from
> ticket READY; BLOCKED tickets have real prerequisites; READY tickets are
> startable; foreign lifecycle remains foreign; destructive transitions wait for
> replacement proof; the index matches ticket truth; and no defect could cause
> unsafe, incorrectly owned, incomplete, or improperly ordered implementation.

When this invariant holds:

```text
IMPLEMENTATION_TICKETS_CONFORMANT
READY_FOR_IMPLEMENTATION
```

For a conformant set, emit `NEXT_TICKET_SET_OPERATION =
`design-ticket-implementation` when the selected READY ticket lacks a current
Implementation Design with `IMPLEMENTATION_DESIGN_READY` and
`IMPLEMENTATION_DESIGN_GATE: READY_FOR_IMPLEMENTATION`; emit
`implement-ready-tickets` only when that design is current and all readiness
predicates hold. No independent design audit or pre-existing Git commit is
required; the design skill owns this gate and the implementation checkpoint
later preserves the design artifact. A historical remediation report cannot
override this current route.

This means the ticket set is safe for orchestration, not that every ticket is
currently READY.
