---
name: decompose-component-implementation-plan-into-tickets
description: >
  Convert one conformant, independently audited component Implementation Plan
  into implementation ticket artifacts while preserving the full authority and
  traceability chain from accepted ADRs through the approved SPEC portfolio,
  conformant component SPEC, validated Gap Matrix, Implementation Units, and
  final ticket scope. Preserve ownership, normative dependency direction, Gap
  identities, Unit boundaries, local closure, acceptance contribution, Final
  Proof Ownership, cross-spec dependencies, and initial DAG state. Use only
  after IMPLEMENTATION_PLAN_CONFORMANT and READY_FOR_ISSUE_DECOMPOSITION. This
  skill creates ticket artifacts only; it does not implement code, modify
  upstream authority, regenerate planning artifacts, or approve tickets.
---

# Decompose Component Implementation Plan Into Tickets

Read `../_shared/interrupted-artifact-production-recovery-contract.md` before
acting. If the ticket output is dirty because an external failure interrupted a
prior decomposition, treat it as an untrusted candidate and rerun this producer
from the current conformant Implementation Plan.

## Purpose

Convert a conformant component Implementation Plan into a complete,
dependency-aware and independently auditable set of implementation tickets.

The workflow is:

```text
Accepted ADRs
        +
PORTFOLIO_DECOMPOSITION_APPROVED
        +
PASS — COMPONENT_SPEC_CONFORMANT
        +
GAP_MATRIX_CONFORMANT
        +
IMPLEMENTATION_PLAN_CONFORMANT
        +
READY_FOR_ISSUE_DECOMPOSITION
        ↓
decompose-component-implementation-plan-into-tickets
        ↓
Implementation Tickets
        ↓
READY_FOR_TICKET_AUDIT
        ↓
Independent Ticket Audit
        ↓
Implementation
```

Tickets preserve established planning authority; they do not redesign the
work. They decompose approved Implementation Units into executable artifacts.

Read `../_shared/authority-completeness-gates.md`. Ticket decomposition owns
readiness derivation from actual upstream availability; it does not create
missing authority or contracts.

## Operating mode

Operate in:

```text
WRITE_ALLOWED
ADR_FIRST
PORTFOLIO_GOVERNED
SPEC_PRESERVING
GAP_MATRIX_PRESERVING
PLAN_PRESERVING
OWNERSHIP_PRESERVING
DEPENDENCY_PRESERVING
LOCAL_CLOSURE_PRESERVING
PROOF_OWNERSHIP_PRESERVING
TRACEABILITY_COMPLETE
TICKET_ARTIFACT_ONLY
NO_ARCHITECTURE_INVENTION
NO_GAP_REGENERATION
NO_PLAN_REDESIGN
NO_IMPLEMENTATION
NO_TICKET_SELF_APPROVAL
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
validated component Gap Matrix
    >
conformant component Implementation Plan
    >
independent Implementation Plan Audit
    >
current repository evidence
    >
tickets being created
```

Interpret responsibility as:

```text
ADR
    defines architecture

Portfolio
    defines WHO owns obligations and normative dependencies

Component SPEC
    defines WHAT must be true

Gap Matrix
    defines WHAT validated implementation delta exists

Implementation Plan
    defines HOW the validated delta is partitioned into Implementation Units

Ticket Decomposition
    converts approved Implementation Units into execution artifacts
```

Tickets must not redefine upstream planning.

## 1. Required preconditions

Run only when all gates are valid.

```text
PORTFOLIO_DECOMPOSITION_APPROVED
PASS — COMPONENT_SPEC_CONFORMANT
GAP_MATRIX_CONFORMANT
READY_FOR_IMPLEMENTATION_PLAN
IMPLEMENTATION_PLAN_CONFORMANT
READY_FOR_ISSUE_DECOMPOSITION
```

Also require current upstream authority evidence:

```text
SPEC_IMPLEMENTABILITY_CHECK = PASS
IMPLEMENTATION_UNIT_AUTHORITY_CHECK = PASS
```

Also require every unit's independent authority/contract/local-testability/
productive-availability records, dependency classes, and any derived
`CAPABILITY_SUMMARY_STATUS`, `IMPLEMENTER_DECISION_CHECK` handoff, and
`ACCEPTANCE_WITNESS_MATRIX` to be
current. A unit with `WORK_CAN_START = YES` but `LOCAL_CLOSURE = NO` must be
split or blocked before decomposition; it cannot produce a normal ticket.

Otherwise return `TICKET_DECOMPOSITION_BLOCKED` with
`reason = BLOCKED_BY_UPSTREAM_AUTHORITY`.

Failures return exactly:

```text
TICKET_DECOMPOSITION_BLOCKED
reason = PORTFOLIO_NOT_APPROVED
```

or:

```text
TICKET_DECOMPOSITION_BLOCKED
reason = COMPONENT_SPEC_NOT_CONFORMANT
```

or:

```text
TICKET_DECOMPOSITION_BLOCKED
reason = GAP_MATRIX_NOT_VALIDATED
```

or:

```text
TICKET_DECOMPOSITION_BLOCKED
reason = PLAN_NOT_CONFORMANT
```

or:

```text
TICKET_DECOMPOSITION_BLOCKED
reason = PLAN_NOT_READY_FOR_ISSUE_DECOMPOSITION
```

A destination folder must be supplied or established by repository convention.
If neither exists:

```text
TICKET_DECOMPOSITION_BLOCKED
reason = DESTINATION_FOLDER_REQUIRED
```

Do not invent a conflicting location.

## 2. Required inputs and frozen baseline

Identify accepted ADRs, approved portfolio and audits, component and upstream
SPECs and audits, validated Gap Matrix and audit, conformant Implementation
Plan and audit, repository root, destination folder, ticket naming/schema
conventions, and current HEAD.

Record:

```text
PORTFOLIO_BASELINE
COMPONENT_SPEC_BASELINE
UPSTREAM_SPEC_BASELINES
GAP_MATRIX_BASELINE
IMPLEMENTATION_PLAN_BASELINE
PLAN_AUDIT_BASELINE
CURRENT_HEAD
WORKING_TREE_STATE
```

If authority or planning artifacts changed after the conformant Plan Audit:

```text
TICKET_DECOMPOSITION_BLOCKED
reason = UPSTREAM_BASELINE_REVALIDATION_REQUIRED
```

Do not decompose stale plans.

## 3. Full authority and unit intake

Every ticket preserves:

```text
ADR
    →
Portfolio Obligation
    →
Component Requirement
    →
Validated Gap
    →
Implementation Unit
    →
Ticket
```

For each ticket capture ADR authority, Portfolio Obligation ID, Requirement ID,
Gap ID, Implementation Unit ID, and Ticket ID.

For every external capability captured by a ticket, preserve its
`PRODUCER_CONSUMER_CONTRACT_PROOF`: producer, produced contract, authority
owner, consumer, capability, availability condition, and dependency edge, plus
authority status, contract status, semantic status, local testability,
productive availability, dependency class, availability evidence, and blocking
effect. A ticket may be `BLOCKED` by
`BLOCKED_BY_UPSTREAM_CONTRACT`, but it may not be `READY` or locally closable
until every capability classified `REQUIRED_FOR_LOCAL_EXECUTION` or
`REQUIRED_FOR_LOCAL_CLOSURE` has a productive producer and contract. A
dependency classified only `REQUIRED_FOR_INTEGRATED_PROOF` or `INFORMATIONAL`
is carried forward without blocking local readiness.

Read the conformant Plan completely. For each Unit capture its goal, obligations,
requirements, gaps, formation reason, ownership, delta, required behavior,
exclusions, repository evidence, impact, constraints, prerequisites, acceptance,
closure, tests, legacy/cutover, completion evidence, readiness, DAG state,
blockers, proof responsibilities, wave, and parallelization mode.

Only Units with:

```text
ISSUE_DECOMPOSITION_READINESS = ISSUE_READY
```

normally produce tickets. `INTERNAL_ONLY` is absorbed unless the Plan explicitly
requires independent execution. `PLAN_BLOCKED` does not produce an executable
ticket; if required despite a conformant Plan, return:

```text
TICKET_DECOMPOSITION_BLOCKED
reason = PLAN_CONFORMANCE_INCONSISTENCY
```

## 4. Readiness versus execution state

Preserve:

```text
ISSUE_DECOMPOSITION_READINESS
!=
INITIAL_DAG_STATE
```

This is valid:

```text
ISSUE_DECOMPOSITION_READINESS = ISSUE_READY
INITIAL_DAG_STATE = BLOCKED
```

It means the ticket may be generated but may not execute yet.

The ticket generator must calculate the shared `EXECUTION_READY` predicate. A
fixture/mock/fake/in-memory repository can preserve local contract tests but
cannot satisfy a productive capability prerequisite. If local acceptance or
completion evidence needs that capability, the ticket is `BLOCKED` with the
exact `CAPABILITY_ID` and `BLOCKED_BY_UPSTREAM_CONTRACT`.

## 5. Unit-to-ticket mapping and boundaries

Default mapping:

```text
1 ISSUE_READY Implementation Unit
    ↓
1 implementation ticket
```

Do not split or merge automatically. Split only for:

```text
INDEPENDENT_DURABLE_MIGRATIONS
HARD_REPOSITORY_BOUNDARY
MANDATORY_SEQUENTIAL_PREREQUISITE
DESTRUCTIVE_CUTOVER_SEPARATION
EXCESSIVE_CHANGE_RADIUS
INDEPENDENTLY_CLOSABLE_SUBWORK
REPOSITORY_COLLISION_SEQUENCING
```

Do not split merely for file count, apparent size, developer parallelism,
convenience, or one-ticket-per-Gap aesthetics.

Detect and prevent:

```text
FALSE_TICKET_SPLIT
FALSE_TICKET_MERGE
```

A split must preserve Unit scope, acceptance, proof, and local closure. A merge
requires explicit conformant Plan authority such as `INTERNAL_ONLY` or atomic
delivery. Targets:

```text
FALSE_TICKET_SPLITS = 0
FALSE_TICKET_MERGES = 0
```

## 6. IDs, destination, and status

Use unique stable IDs such as:

```text
<SPEC-PREFIX>-TICKET-001
<SPEC-PREFIX>-TICKET-002
```

For legitimate splits use a repository-equivalent stable suffix convention.

Use filenames:

```text
<TICKET-ID>-<short-slug>.md
```

Create all artifacts in the canonical destination, preferably:

```text
<ticket-folder>/
    README.md
    <TICKET-ID>-<slug>.md
```

New tickets initially use only:

```text
READY
BLOCKED
```

Map Unit Initial DAG State mechanically:

```text
READY   → STATUS: READY
BLOCKED → STATUS: BLOCKED
```

`STATUS: READY` requires `EXECUTION_READY = TRUE`, `BLOCKED_BY: NONE`, and all
mandatory internal prerequisites plus capabilities classified
`REQUIRED_FOR_LOCAL_EXECUTION` or `REQUIRED_FOR_LOCAL_CLOSURE` to have
`PRODUCTIVE_AVAILABILITY = YES`. Do not derive READY from
`INITIAL_DAG_STATE` alone. A capability classified only
`REQUIRED_FOR_INTEGRATED_PROOF` or `INFORMATIONAL` must not block local READY.
BLOCKED requires at least one unresolved blocker.

Readiness must also satisfy:

```text
AUTHORITY_CONSUMPTION_PROOF = AUTHORITY_CONSUMABLE
REQUIRED_LOCAL_CAPABILITY_PRODUCTIVE_AVAILABILITY = YES
REQUIRED_LOCAL_CAPABILITY_CLASSES =
  REQUIRED_FOR_LOCAL_EXECUTION | REQUIRED_FOR_LOCAL_CLOSURE
READY_TICKETS_WITH_UNAVAILABLE_CONTRACT = 0
CALLER_SUPPLIED_AUTHORITY_BYPASS = 0
```

Use `BLOCKED_BY_UPSTREAM_AUTHORITY` for undefined authority and
`BLOCKED_BY_UPSTREAM_CONTRACT` for defined but unavailable consumability. Do
not collapse either condition into a generic implementation task.

## 7. Dependencies, blockers, waves, and graph

Preserve both:

```text
DEPENDS_ON
BLOCKED_BY
```

An already satisfied prerequisite may remain in `DEPENDS_ON` but not in
`BLOCKED_BY`. External blockers use stable foreign identifiers; do not create
fake local tickets for foreign work.

Translate the conformant Plan DAG; a valid split may add stricter sequencing
but never weaken upstream dependencies. Calculate:

```text
UNBLOCKS:
- <ticket>
```

or `UNBLOCKS: NONE`. Internal blocker relationships are bidirectionally
reconciled.

Inherit Plan Wave and one of:

```text
SAFE
SAFE_WITH_COORDINATION
SERIAL_REQUIRED
```

Do not make a split more permissive without new planning authority.

## 8. Ownership and proof preservation

Every ticket states:

```text
Portfolio Obligation(s)
Approved ownership role
Primary owning specification/domain
Local implementation ownership
Foreign capabilities consumed
```

Do not infer a new owner from repository location. Preserve the distinction:

```text
CONTRIBUTOR
LOCAL_ACCEPTANCE_OWNER
FINAL_PROOF_OWNER
```

If a Unit splits, exactly one resulting ticket preserves the original Final
Proof Owner role, at the point where all required evidence exists. Never create
a proof-only synthetic ticket.

## 9. Ticket local closure and acceptance

Every generated ticket must have:

```text
TICKET_LOCAL_CLOSURE = YES
```

with local ACs provable, required tests executable, Completion Evidence
producible, every local witness executable at closure, no future downstream
behavior required, and no excluded ownership needed. Capabilities classified
`REQUIRED_FOR_LOCAL_EXECUTION` or `REQUIRED_FOR_LOCAL_CLOSURE` must have
`PRODUCTIVE_AVAILABILITY = YES`; `LOCAL_TESTABILITY = YES` alone is not enough
for those classes. A fixture remains valid evidence for a local/contract-level
witness whose dependency is the fixture/harness itself.
If a Unit cannot satisfy this, stop decomposition or split it before creating
tickets. If a Unit splits, all tickets must close locally and combined scope
must equal the original Unit scope:

```text
UNIT_SCOPE_LOST_BY_SPLIT = 0
```

Acceptance derives from the parent Unit and remains:

```text
TESTABLE = YES
LOCALLY_PROVABLE = YES
```

Do not copy complete end-to-end acceptance into every contributor. Partition
local criteria while preserving plan-level Acceptance IDs and Final Proof
Ownership.

## 10. Required ticket structure

Every ticket contains:

```text
# <TICKET-ID> — <Title>

## 1. Status
## 2. Source Traceability
## 3. Authority / Scope
## 4. Portfolio Obligation Coverage
## 5. Gap / Requirement / Acceptance Coverage
## 6. Implementation Unit
## 7. Goal
## 8. Validated Implementation Delta
## 9. Required Behavior
## 10. Does Not Implement
## 11. Repository Evidence
## 12. Expected Repository Impact
## 13. Dependencies
## 14. Blocking Conditions
## 14a. Authority Consumption Proof
## 14b. Producer / Consumer Contract Proof
## 14c. ACCEPTANCE_WITNESS_MATRIX
## 15. Implementation Constraints
## 16. Acceptance Criteria
## 17. Acceptance / Proof Role
## 18. Required Tests
## 19. Completion Evidence
## 20. Completion Gate
## 21. Legacy / Cutover Impact
## 22. Risks
## 23. Implementation Wave
## 24. Parallelization
## 25. Handoff After Completion
## 26. Ticket Local Closure
```

### Status

Use `STATUS: READY` with `BLOCKED_BY: NONE`, or `STATUS: BLOCKED` with at least
one unresolved blocker.

`STATUS: READY` additionally requires an `AUTHORITY_CONSUMPTION_PROOF` with
result `AUTHORITY_CONSUMABLE`,
`PRODUCTIVE_AVAILABILITY = YES` for every capability classified
`REQUIRED_FOR_LOCAL_EXECUTION` or `REQUIRED_FOR_LOCAL_CLOSURE`, and concrete
availability evidence at the execution point. Capabilities classified only
`REQUIRED_FOR_INTEGRATED_PROOF` or `INFORMATIONAL` do not block local READY.
If the authority is undefined use `BLOCKED_BY_UPSTREAM_AUTHORITY`; if a
capability classified `REQUIRED_FOR_LOCAL_EXECUTION` or
`REQUIRED_FOR_LOCAL_CLOSURE` has `PRODUCTIVE_AVAILABILITY = NO`, use
`BLOCKED_BY_UPSTREAM_CONTRACT`. A dependency classified only
`REQUIRED_FOR_INTEGRATED_PROOF` or `INFORMATIONAL` is not a local blocker.
`STATUS: READY`, `BLOCKED_BY: NONE`, and `TICKET_LOCAL_CLOSURE = YES` are
mutually incompatible with any unavailable required capability or witness.

### Source Traceability

Include paths/IDs for Portfolio, Component SPEC, Gap Matrix, Gap Matrix Audit,
Implementation Plan, Plan Audit, and exact Implementation Unit.

### Scope and coverage

Include approved owner/role, foreign capabilities, exact Portfolio Obligations,
Gaps, Requirements, Acceptance IDs, Unit ID, split reason/siblings when split,
narrow Goal, faithful `OBSERVED / REQUIRED / DELTA`, local Required Behavior,
and mandatory Does Not Implement exclusions.

### Evidence and impact

List concrete repository evidence and likely categories of impact without
turning orientation into unsupported implementation design. Use categories:

```text
Production code:
Persistence/schema:
Integration:
Tests:
Legacy/cutover:
Generated contracts:
```

### Dependencies and constraints

Separate internal ticket dependencies from cross-SPEC dependencies. Preserve
normative constraints such as canonical identity, stale rejection, idempotency,
foreign ownership, and approved cutover boundaries without prescribing mechanism.

### Acceptance and tests

Use checklist criteria. Each ticket has at least one local testable criterion,
unless repository convention explicitly supports a pure mechanical/supporting
ticket with another objective closure contract. Required test categories may
include Unit, Domain invariant, Persistence, Application, Integration,
Cross-spec, Concurrency, Stale protection, Idempotency, Recovery, Migration,
Compatibility, Regression, Conformance, and API/UI contract.

Every ticket must also contain an `ACCEPTANCE_WITNESS_MATRIX: REQUIRED`. Create
one row for every `Required Behavior` and every Acceptance Criterion containing
normative behavior. Each row identifies the normative behavior and verb, a
concrete operation/command/query, affected state or transition, directly
corresponding positive test, negative or isolation test, and expected
file/evidence, required producer/capability, independent capability dimensions,
dependency class, evidence type, and `WITNESS_EXECUTABLE_AT_LOCAL_CLOSURE`. The test must execute
the required verb: registration/listing
does not prove progress, sequential duplication does not prove concurrency,
and source inspection does not prove an architecture guard.

If any row cannot be completed from accepted authority, return:

```text
TICKET_DECOMPOSITION_GATE: BLOCKED
reason = ACCEPTANCE_BEHAVIOR_NOT_OPERATIONALIZED
```

Route the root cause to `PLAN_REVALIDATION_REQUIRED` or `SPECIFICATION_GAP`
according to the smallest artifact lacking the decision. Never create a local
implementation task to invent the missing semantics.

### Completion

State objective evidence and a mechanical completion gate. Use repository-
supported fields such as:

```text
COMPLETION_GATE:
  production_code: REQUIRED
  automated_tests: REQUIRED
  integration_evidence: REQUIRED
  legacy_transition_evidence: NOT_APPLICABLE
  conformance_evidence: REQUIRED
```

The decomposition skill only initializes tickets; later workflow owns
`READY/BLOCKED → IN_PROGRESS → IMPLEMENTED → VALIDATION_REQUIRED → DONE`.

### Transition, risk, wave, handoff

Preserve applicable legacy/cutover values:

```text
NO_LEGACY_IMPACT
PRESERVE_LEGACY_READS
RETIRE_LEGACY_WRITES
ADD_COMPATIBILITY_MAPPING
MIGRATE_EXISTING_STATE
REMOVE_ALTERNATE_AUTHORITY
DEFERRED_TO_OTHER_SPEC
```

Record material risks, `WAVE`, parallelization mode, `UNBLOCKS`, and
`TICKET_LOCAL_CLOSURE = YES`.

## 11. Ticket index

Create/update `<ticket-folder>/README.md` following repository convention with:

```text
1. Authority
2. Baselines
3. Ticket Status Summary
4. Implementation Unit → Ticket Traceability
5. Portfolio Obligation → Ticket Traceability
6. Gap → Ticket Traceability
7. Acceptance → Ticket Traceability
8. Dependency / Blocker Graph
9. Execution Order
10. Initial READY / BLOCKED State
11. Cross-Spec Dependencies
12. Parallelization Waves
13. Final Proof Ownership
14. Ticket Split / Merge Ledger
15. Closure Metrics
16. Ticket Decomposition Gate
```

Include tables for status, Unit mapping, Portfolio Obligation mapping, Gap
mapping, Acceptance mapping, split/merge ledgers, and explicit dependency and
blocker graph. For every affected multi-ticket Acceptance:

```text
FINAL_PROOF_OWNER = exactly one ticket
```

or `ALREADY_SATISFIED`, with:

```text
UNRESOLVED_TICKET_FINAL_PROOF_OWNERS = 0
```

## 12. Graph/status consistency

If ticket B depends on unsatisfied A:

```text
B STATUS = BLOCKED
B BLOCKED_BY includes A
A UNBLOCKS includes B
```

If no unresolved blocker exists, status is READY. Later Wave alone does not
make a ticket BLOCKED. Required graph invariant:

```text
TICKET_BLOCKER_GRAPH_CYCLE = NO
```

No local ticket implements a foreign lifecycle or canonical authority. Only
local integration/convergence work may be ticketed.

## 13. Auditability and escalation

Every ticket must let a later auditor determine whether exact scope was
implemented, ACs satisfied, tests produced/executed, ownership preserved,
blockers respected, local closure achieved, and required proof contribution
produced.

If decomposition exposes undefined behavior, classify `SPECIFICATION_GAP`,
`PORTFOLIO_GAP`, or `PLAN_GAP`; do not invent an answer. Return exactly:

```text
TICKET_DECOMPOSITION_BLOCKED
reason = SPECIFICATION_REMEDIATION_REQUIRED
```

or:

```text
TICKET_DECOMPOSITION_BLOCKED
reason = PORTFOLIO_REMEDIATION_REQUIRED
```

or:

```text
TICKET_DECOMPOSITION_BLOCKED
reason = IMPLEMENTATION_PLAN_REVALIDATION_REQUIRED
```

## 14. Artifact boundary and optional evidence

May create or modify only ticket files, ticket index README, and optional
decomposition evidence. Do not modify ADRs, portfolio, SPECs, Gap Matrix, Plan,
audits, code, tests, or migrations.

Optional evidence:

```text
<ticket-folder>/<SPEC-ID>-ticket-decomposition.md
```

with Subject, Authority, Baselines, Unit mapping, Split/Merge ledger,
traceability, status derivation, dependency/blocker reconciliation, proof
mapping, metrics, and Gate.

## 15. Optional machine-readable frontmatter

If repository convention permits, use its existing schema. An example is:

```yaml
---
id: P04-TICKET-001
status: READY
implementation_unit: P04-IMP-01
portfolio_obligations:
  - O-001
requirements:
  - P04-REQ-001
gaps:
  - GAP-001
wave: 1
blocked_by: []
depends_on: []
issue_decomposition_readiness: ISSUE_READY
initial_dag_state: READY
final_proof_for: []
---
```

Follow existing schema; do not create conflicting metadata representations.

## 16. Mechanical metrics and invariants

Calculate:

```text
IMPLEMENTATION_UNITS_TOTAL
ISSUE_READY_UNITS
INTERNAL_ONLY_UNITS
PLAN_BLOCKED_UNITS
IMPLEMENTATION_UNITS_DECOMPOSED
IMPLEMENTATION_UNITS_NOT_DECOMPOSED
TICKETS_CREATED
READY_TICKETS
BLOCKED_TICKETS
PORTFOLIO_OBLIGATIONS_MAPPED
UNMAPPED_PORTFOLIO_OBLIGATIONS
ACTIVE_LOCAL_GAPS
LOCAL_GAPS_COVERED
UNMAPPED_LOCAL_GAPS
ACCEPTANCE_OBLIGATIONS_REFERENCED
UNRESOLVED_TICKET_FINAL_PROOF_OWNERS
FALSE_TICKET_SPLITS
FALSE_TICKET_MERGES
TICKETS_WITH_LOCAL_CLOSURE_NO
TICKETS_WITHOUT_ACCEPTANCE
TICKETS_WITHOUT_TESTS_WHEN_REQUIRED
TICKETS_WITHOUT_COMPLETION_EVIDENCE
STATUS_BLOCKER_MISMATCHES
DEPENDENCY_BLOCKER_MISMATCHES
UNBLOCK_GRAPH_MISMATCHES
UNRESOLVED_EXTERNAL_BLOCKERS
TICKET_BLOCKER_GRAPH_CYCLE
READY_TICKETS_WITH_UNAVAILABLE_CONTRACT
CAPABILITY_AVAILABILITY_CLASSIFICATION_ERRORS
DOWNSTREAM_PROMOTION_WITHOUT_NEW_EVIDENCE
TICKETS_WITH_UNAVAILABLE_REQUIRED_CAPABILITY
WITNESS_NOT_EXECUTABLE_AT_LOCAL_CLOSURE
UPSTREAM_AUTHORITY_BLOCKER_MISMATCHES
PRODUCER_CONSUMER_CONTRACT_ERRORS
REQUIRED_BEHAVIORS_TOTAL
ACCEPTANCE_CRITERIA_TOTAL
DIRECT_BEHAVIOR_WITNESSES
PROXY_ONLY_BEHAVIORS
UNTESTED_STATE_TRANSITIONS
UNPROVEN_CONCURRENCY_CONTRACTS
MISSING_ARCHITECTURE_GUARDS
```

Successful decomposition requires:

```text
IMPLEMENTATION_UNITS_NOT_DECOMPOSED = 0 for all ISSUE_READY units
UNMAPPED_PORTFOLIO_OBLIGATIONS = 0 for locally implemented obligations
UNMAPPED_LOCAL_GAPS = 0
UNRESOLVED_TICKET_FINAL_PROOF_OWNERS = 0
FALSE_TICKET_SPLITS = 0
FALSE_TICKET_MERGES = 0
TICKETS_WITH_LOCAL_CLOSURE_NO = 0
STATUS_BLOCKER_MISMATCHES = 0
DEPENDENCY_BLOCKER_MISMATCHES = 0
UNBLOCK_GRAPH_MISMATCHES = 0
TICKET_BLOCKER_GRAPH_CYCLE = NO
READY_TICKETS_WITH_UNAVAILABLE_CONTRACT = 0
CAPABILITY_AVAILABILITY_CLASSIFICATION_ERRORS = 0
DOWNSTREAM_PROMOTION_WITHOUT_NEW_EVIDENCE = 0
TICKETS_WITH_UNAVAILABLE_REQUIRED_CAPABILITY = 0
WITNESS_NOT_EXECUTABLE_AT_LOCAL_CLOSURE = 0
UPSTREAM_AUTHORITY_BLOCKER_MISMATCHES = 0
PRODUCER_CONSUMER_CONTRACT_ERRORS = 0
PROXY_ONLY_BEHAVIORS = 0
UNTESTED_STATE_TRANSITIONS = 0
UNPROVEN_CONCURRENCY_CONTRACTS = 0
MISSING_ARCHITECTURE_GUARDS = 0
```

## 17. Gate

Return exactly one:

```text
TICKET_DECOMPOSITION_GATE: READY_FOR_TICKET_AUDIT
```

or:

```text
TICKET_DECOMPOSITION_GATE: BLOCKED
```

`READY_FOR_TICKET_AUDIT` requires conformant Plan and issue gate, every
`ISSUE_READY` Unit fully decomposed, every local Gap and local obligation
mapped, complete ticket traceability, ownership preserved, ticket local closure
YES, criteria/tests/evidence present, readiness and DAG state preserved, status
and blockers mechanically correct, acyclic graph, proof ownership preserved,
and no speculative/unowned/unclosable ticket. It also requires a complete
acceptance witness matrix with no proxy-only behavior, untested transition,
unproven concurrency obligation, or missing required architecture guard.

Never return `READY_FOR_IMPLEMENTATION`; the mandatory next step is independent
ticket audit.

## 18. Final response

For success:

```text
COMPONENT_TICKET_DECOMPOSITION_COMPLETE

SPEC:
<SPEC-ID>

PORTFOLIO:
<PORTFOLIO-ID>

TICKET_FOLDER:
<path>

TICKET_INDEX:
<path>

GAP_MATRIX:
<path>

IMPLEMENTATION_PLAN:
<path>

PLAN_AUDIT:
<path>

UNITS:
- TOTAL: <n>
- ISSUE_READY: <n>
- INTERNAL_ONLY: <n>
- PLAN_BLOCKED: <n>
- DECOMPOSED: <n>
- NOT_DECOMPOSED: <n>

TICKETS:
- CREATED: <n>
- READY: <n>
- BLOCKED: <n>

TRACEABILITY:
- PORTFOLIO_OBLIGATIONS_MAPPED: <n>
- UNMAPPED_PORTFOLIO_OBLIGATIONS: <n>
- LOCAL_GAPS: <n>
- LOCAL_GAPS_COVERED: <n>
- UNMAPPED_LOCAL_GAPS: <n>
- ACCEPTANCE_REFERENCED: <n>
- UNRESOLVED_FINAL_PROOF_OWNERS: <n>

STRUCTURE:
- FALSE_TICKET_SPLITS: <n>
- FALSE_TICKET_MERGES: <n>
- TICKETS_WITH_LOCAL_CLOSURE_NO: <n>

DEPENDENCIES:
- UNRESOLVED_EXTERNAL_BLOCKERS: <n>
- STATUS_BLOCKER_MISMATCHES: <n>
- DEPENDENCY_BLOCKER_MISMATCHES: <n>
- UNBLOCK_GRAPH_MISMATCHES: <n>
- BLOCKER_GRAPH_CYCLE: YES|NO

GATE:
READY_FOR_TICKET_AUDIT
```

For a blocker:

```text
COMPONENT_TICKET_DECOMPOSITION_BLOCKED

SPEC:
<SPEC-ID>

BLOCKER:
<exact reason>

AFFECTED_IMPLEMENTATION_UNIT:
<IMP-ID or N/A>

AFFECTED_TICKET:
<TICKET-ID or N/A>

REQUIRED_UPSTREAM_ACTION:
<precise action>

GATE:
BLOCKED
```

## 19. Prohibited shortcuts

Do not create tickets before Plan conformance; create tickets from PLAN_BLOCKED
units; mark every ticket READY; confuse ISSUE_READY with READY; confuse Initial
DAG BLOCKED with a Plan defect; split every Unit automatically; merge Units for
convenience; create one ticket per Gap mechanically; implement foreign
lifecycle; create foreign work as local blocker tickets; invent obligations,
Requirements, or Gaps; change Final Proof ownership; copy end-to-end acceptance
to every ticket; create non-locally-closable tickets; defer all local testing;
weaken Plan dependencies; create synthetic proof tickets; modify upstream
artifacts; or implement code.

## Preferred decomposition strategy

Prefer:

```text
stable Implementation Unit boundary
+
one ticket per coherent executable unit
+
minimal justified splitting
+
complete authority traceability
+
local closure
+
explicit runtime blockers
+
mechanically derived status
+
preserved final proof ownership
```

Do not optimize primarily for ticket count or parallelism.

## Core completion invariant

Ticket decomposition is complete only when it can support:

> Every ISSUE_READY Implementation Unit from the conformant component
> Implementation Plan has been fully converted into one or more bounded,
> independently closable implementation tickets; every ticket preserves the
> complete ADR to Portfolio Obligation to Requirement to Gap to Implementation
> Unit to Ticket traceability chain; no ownership, normative dependency,
> validated Gap semantic or Plan responsibility has changed; no Unit has been
> falsely fragmented or merged; every ticket's local Acceptance Criteria,
> Required Tests and Completion Evidence can be satisfied at its position in
> the dependency graph; Issue Decomposition Readiness remains distinct from
> Initial DAG State; ticket status is mechanically derived from unresolved
> prerequisites; blocker and UNBLOCKS relationships reconcile; cross-spec
> dependencies remain foreign where appropriate; multi-ticket acceptance
> obligations preserve contributors and exactly one Final Proof Owner; the
> ticket dependency graph is acyclic; and no speculative, incorrectly owned,
> non-closable or untraceable implementation ticket has been introduced.

When this invariant holds:

```text
TICKET_DECOMPOSITION_GATE: READY_FOR_TICKET_AUDIT
```

The mandatory next step is an independent ticket decomposition audit.
