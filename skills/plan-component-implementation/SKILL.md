---
name: plan-component-implementation
description: >
  Convert a validated and independently audited component Implementation Gap
  Matrix into a dependency-ordered, evidence-backed Implementation Plan for one
  component SPEC governed by an approved SPEC portfolio decomposition. Preserve
  accepted ADR authority, approved portfolio ownership and dependencies,
  conformant component and upstream SPEC contracts, validated Gap identities,
  cross-spec boundaries, failure and compatibility ownership, and repository
  evidence. Create implementation units that are independently implementable,
  locally closable, auditable, and suitable for later ticket decomposition
  without requiring downstream work to satisfy their own acceptance criteria.
  Verify every unit already has upstream authority for identity, lifecycle,
  provenance, persistence, and ownership.
  Use only after GAP_MATRIX_CONFORMANT and READY_FOR_IMPLEMENTATION_PLAN.
  This skill does not modify code, regenerate the Gap Matrix, create tickets, or
  approve the resulting Implementation Plan.
---

# Plan Component Implementation

## Purpose

Convert a validated implementation delta into a complete, dependency-aware,
auditable Implementation Plan for one component SPEC.

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
READY_FOR_IMPLEMENTATION_PLAN
        ↓
plan-component-implementation
        ↓
Implementation Plan
        ↓
READY_FOR_IMPLEMENTATION_PLAN_AUDIT
        ↓
audit-component-implementation-plan
```

The Implementation Plan determines HOW validated implementation gaps will be
closed.

It must not reopen WHAT must be true or WHO owns that behavior.

## Operating mode

Operate in:

```text
WRITE_ALLOWED
ADR_FIRST
PORTFOLIO_GOVERNED
SPEC_PRESERVING
VALIDATED_GAP_DRIVEN
REPOSITORY_AWARE
OWNERSHIP_PRESERVING
DEPENDENCY_ORDERED
LOCAL_CLOSURE_REQUIRED
AUDIT_READY
NO_ARCHITECTURE_INVENTION
NO_GAP_REGENERATION
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
current repository implementation
    >
tests
    >
prototype / historical evidence
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
    proves WHAT implementation delta exists

Implementation Plan
    defines HOW validated local deltas will be closed

Tickets
    later decompose approved implementation units into execution work
```

The plan must not rediscover or reassign architectural ownership.

Read `../_shared/authority-completeness-gates.md`. Planning is downstream of
the SPEC authority proof; use it to validate each unit's preconditions, not to
repair or invent domain authority.

## 1. Preconditions

Run only when all of the following are true.

### 1.1 Portfolio gate

Latest portfolio audit:

```text
PORTFOLIO_DECOMPOSITION_APPROVED
```

Otherwise:

```text
PLANNING_BLOCKED
reason = PORTFOLIO_NOT_APPROVED
```

### 1.2 Component SPEC gate

Latest component SPEC audit:

```text
PASS — COMPONENT_SPEC_CONFORMANT
```

Otherwise:

```text
PLANNING_BLOCKED
reason = COMPONENT_SPEC_NOT_CONFORMANT
```

### 1.3 Gap Matrix gate

Latest independent Gap Matrix audit must state:

```text
GAP_MATRIX_CONFORMANT
```

and:

```text
READY_FOR_IMPLEMENTATION_PLAN
```

Otherwise:

```text
PLANNING_BLOCKED
reason = GAP_MATRIX_NOT_VALIDATED
```

Do not trust readiness stated only inside the Gap Matrix.

Verify the independent audit artifact.

### 1.4 Upstream SPEC authority

Every normative upstream component contract required by the target SPEC must
remain conformant.

If not:

```text
PLANNING_BLOCKED
reason = UPSTREAM_SPEC_NOT_CONFORMANT
```

### 1.5 Authority completeness gate

Require the latest SPEC audit and Gap Matrix audit to confirm
`SPEC_IMPLEMENTABILITY_CHECK = PASS` and the applicable identity,
reconstruction, lifecycle, persistence, and cross-SPEC proofs. Otherwise:

```text
PLANNING_BLOCKED
reason = UPSTREAM_AUTHORITY_INCOMPLETE
```

Do not create a compensating implementation unit for an authority gap.

The handoff must explicitly cite `AGGREGATE_IDENTITY_PROOF` for each applicable
Aggregate Root and `AGGREGATE_RECONSTRUCTION_PROOF` for each persistible
Aggregate Root/Entity. The authority categories are
`IDENTITY_AUTHORITY_GAP`, `REHYDRATION_AUTHORITY_GAP`,
`LIFECYCLE_AUTHORITY_GAP`, `PERSISTENCE_SEMANTICS_GAP`, and
`CROSS_SPEC_AUTHORITY_GAP`.

Missing upstream implementation may create blocked units.

Missing upstream normative authority blocks planning.

Require the completed shared Implementation Decision Simulation for every
critical requirement. Re-run it defensively for any unit touching identity,
reconstruction, rehydration, lifecycle, persistence, recovery, concurrency,
stale/duplicate behavior, authorization, external effects, or cross-SPEC
consumption. Any `NO` or `UNKNOWN` answer is `UPSTREAM_AUTHORITY_INCOMPLETE`;
the Plan cannot repair it.

## 2. Required inputs

Identify:

* accepted ADRs;
* governing portfolio;
* latest portfolio audit;
* target component SPEC;
* latest component SPEC audit;
* validated component Gap Matrix;
* latest independent Gap Matrix audit;
* conformant upstream component SPECs;
* portfolio obligation registry;
* portfolio dependency registry;
* failure ownership registry;
* compatibility/cutover registry;
* repository root;
* Gap Matrix repository baseline;
* current repository HEAD;
* relevant implementation;
* relevant tests;
* repository Implementation Plan conventions.

## 3. Establish planning baseline

Record:

```text
PORTFOLIO_BASELINE
COMPONENT_SPEC_BASELINE
UPSTREAM_SPEC_BASELINES
GAP_MATRIX_BASELINE
GAP_MATRIX_AUDIT_BASELINE
REPOSITORY_BASELINE
CURRENT_HEAD
WORKING_TREE_STATE
```

Capture revisions/digests where available.

## 4. Baseline drift validation

Compare current state against validated planning baseline.

Classify separately:

```text
AUTHORITY_DRIFT
IMPLEMENTATION_DRIFT
```

Then assign one planning drift result:

```text
NO_RELEVANT_DRIFT
NON_SEMANTIC_DOCUMENTARY_DRIFT
LOCALIZED_IMPLEMENTATION_DRIFT
MATERIAL_BASELINE_DRIFT
```

## 5. Authority drift

Authority drift includes changes to:

* accepted ADR semantics;
* approved portfolio ownership;
* portfolio dependency graph;
* component SPEC semantics;
* upstream SPEC semantics;
* failure ownership;
* compatibility/cutover ownership.

If material authority drift exists:

```text
PLANNING_BLOCKED
reason = UPSTREAM_AUTHORITY_REVALIDATION_REQUIRED
```

Do not patch planning assumptions locally.

## 6. Localized implementation drift

If repository implementation/tests changed after validated Gap Matrix baseline,
but authority remains stable:

revalidate only affected Gap IDs.

For each record:

```text
VALIDATED_GAP_STATUS =
    UNCHANGED
    SATISFIED_BY_DRIFT
    MODIFIED_BY_DRIFT
    NEW_CONTRADICTION_DISCOVERED
```

Use concrete evidence.

Do not regenerate the Gap Matrix.

If drift invalidates the validated matrix materially:

```text
PLANNING_BLOCKED
reason = GAP_MATRIX_REVALIDATION_REQUIRED
```

## 7. Validated Gap intake

Read the validated Gap Matrix completely.

Build an inventory of every distinct active Gap.

For each capture:

```text
Gap ID
Affected Requirement IDs
Portfolio Obligation IDs
Gap Category
Severity
Classification(s)
Local Owner
Cross-Spec Dependency
Exact Delta
Observed Repository Boundary
Acceptance Evidence Needed
```

Do not reclassify validated gaps unless baseline drift explicitly requires
revalidation.

## 8. Gap planning responsibility

Classify every active Gap into exactly one primary planning type:

```text
LOCAL_IMPLEMENTATION_WORK
CROSS_SPEC_DEPENDENCY
PREEXISTING_FOREIGN_CAPABILITY
INTEGRATION_OR_CONVERGENCE_WORK
TEST_OR_CONFORMANCE_WORK
NO_LOCAL_WORK
```

## 9. LOCAL_IMPLEMENTATION_WORK

Use when the selected component owns the implementation delta.

It must map to one or more implementation units.

## 10. CROSS_SPEC_DEPENDENCY

Use when another approved SPEC owns required implementation.

Record:

```text
FOREIGN_OWNER
FOREIGN_REQUIREMENT
LOCAL_DEPENDENCY
BLOCKING_STATUS
```

Do not create a local unit for foreign lifecycle implementation.

A local integration unit may still exist if the target SPEC owns integration.

## 11. PREEXISTING_FOREIGN_CAPABILITY

Use when another component already provides the required capability.

Plan only validated local work such as:

* consume;
* map;
* converge;
* preserve identity;
* preserve lineage;
* remove duplicate local authority.

Do not recreate the foreign capability.

## 12. INTEGRATION_OR_CONVERGENCE_WORK

Use when local implementation must:

* consume owner-produced outcome;
* preserve exact foreign identity;
* bridge to existing capability;
* retire alternate local authority;
* converge projections;
* map foreign semantics without redefining them.

This may become a local implementation unit.

## 13. TEST_OR_CONFORMANCE_WORK

Use when implementation behavior exists but validated Gap requires evidence,
integration proof, regression proof, or conformance proof.

Do not create artificial production work for an evidence-only gap.

## 14. NO_LOCAL_WORK

Use when the validated matrix row exists only for:

* pure foreign ownership;
* compatibility reference;
* evidence already satisfied;
* non-actionable planning context.

No implementation unit is created.

## 15. Portfolio ownership constraint

For every Gap and planned unit record:

```text
PORTFOLIO_OBLIGATION_ID
APPROVED_COMPONENT_ROLE
```

Implementation Units must not redefine ownership.

If planning appears to require a normative ownership change:

```text
PLANNING_BLOCKED
reason = PORTFOLIO_OWNERSHIP_CHANGE_REQUIRED
```

## 15a. IMPLEMENTATION_UNIT_AUTHORITY_CHECK

For every Implementation Unit, answer:

```text
Todas as decisões normativas necessárias para implementar esta unidade já
existem upstream?
```

The answer must be `YES` and cite ADR/SPEC/proof IDs. A unit must not be
responsible for inventing or selecting:

```text
canonical identity or identity owner
lifecycle states or transitions
progression provenance or reconstruction validity
domain ownership or cross-SPEC ownership
recovery semantics
persistence meaning or domain invariants
```

If any answer is `NO`, return `PLANNING_BLOCKED` with
`reason = UPSTREAM_AUTHORITY_INCOMPLETE` and record the smallest root-cause
stage. Do not disguise it as `SPECIFICATION_GAP` work unless the validated
upstream audit has already classified it there.

For each unit, the readiness classification is exactly one of:

```text
READY
BLOCKED_BY_UPSTREAM_AUTHORITY
BLOCKED_BY_UPSTREAM_CONTRACT
```

Before assigning `READY`, calculate the shared `EXECUTION_READY` predicate.
Every capability classified `REQUIRED_FOR_LOCAL_EXECUTION` or
`REQUIRED_FOR_LOCAL_CLOSURE` must have `PRODUCTIVE_AVAILABILITY = YES` with
concrete producer/integration evidence at the unit's execution/closure point.
A locally testable fixture remains `LOCAL_TESTABILITY = YES` and
`PRODUCTIVE_AVAILABILITY = NO`; it is valid contract-level evidence, but the
real producer produces `BLOCKED_BY_UPSTREAM_CONTRACT` when its capability is
classified as required for local execution or closure.

## 15b. Producer/consumer and availability proof

For every unit that consumes an external capability, include a
`PRODUCER_CONSUMER_CONTRACT_PROOF` identifying producer, produced contract,
authority owner, consumer, consumed capability, availability condition, and
dependency edge, plus capability ID, authority status, contract status,
semantic status, local testability, productive availability, dependency class,
availability evidence, and blocking effect.
`CONTRACT_STATUS = UNDEFINED` or `PRODUCTIVE_AVAILABILITY = NO` becomes
`BLOCKED_BY_UPSTREAM_CONTRACT` only when the dependency class is
`REQUIRED_FOR_LOCAL_EXECUTION` or `REQUIRED_FOR_LOCAL_CLOSURE`.
`AUTHORITY_STATUS = UNDEFINED` remains an upstream authority blocker. A
dependency classified only `REQUIRED_FOR_INTEGRATED_PROOF` or `INFORMATIONAL`
is carried forward without blocking local readiness. A downstream promotion
without the complete `NO_DOWNSTREAM_CAPABILITY_PROMOTION_WITHOUT_NEW_EVIDENCE`
record is invalid.

For operations that observe mutable authority before committing an effect,
allocate the already-authorized `TEMPORAL_AUTHORITY_PROOF` and its validation
owner. The plan may sequence this work, but may not invent the revalidation
semantics.

## 16. Normative dependency constraint

The approved portfolio defines normative dependency direction.

The planner may discover:

```text
IMPLEMENTATION_DEPENDENCY
```

but it may not silently create:

```text
NEW_NORMATIVE_DEPENDENCY
```

If a new normative dependency is required:

```text
PLANNING_BLOCKED
reason = PORTFOLIO_DEPENDENCY_CHANGE_REQUIRED
```

## 17. Repository planning investigation

Inspect repository only to determine implementation planning structure.

Investigate:

* reusable seams;
* likely change boundaries;
* persistence effects;
* commands/queries/events;
* adapters;
* integration surfaces;
* legacy paths;
* tests;
* possible collision points;
* migration/cutover paths.

This is not a new Gap Matrix audit.

Repository findings must remain inside validated Gap scope.

## 18. Reuse assessment

For each local Gap determine:

```text
REUSE_UNCHANGED
REUSE_AND_EXTEND
REFACTOR_IN_PLACE
REPLACE_CONTRADICTORY_PATH
ADD_NEW_CAPABILITY
ADD_INTEGRATION_SEAM
RETIRE_LEGACY_WRITES
TEST_ONLY_OR_CONFORMANCE_WORK
```

This is implementation planning guidance.

It does not change Gap classification.

## 19. Specification/authority escape hatch

Planning may expose a semantic question.

Classify:

```text
IMPLEMENTATION_DETAIL
SPECIFICATION_GAP
ARCHITECTURE_GAP
PORTFOLIO_OWNERSHIP_GAP
UPSTREAM_CONTRACT_GAP
```

Only `IMPLEMENTATION_DETAIL` may be resolved within the plan.

If any material other category exists, block.

## 20. Specification gap

If required behavior is not deterministic from the conformant SPEC:

```text
PLANNING_BLOCKED
reason = SPECIFICATION_GAP_DISCOVERED
```

## 21. Architecture gap

If implementation requires a new architectural decision:

```text
PLANNING_BLOCKED
reason = ARCHITECTURE_DECISION_REQUIRED
```

## 22. Portfolio ownership/dependency gap

If owner or dependency allocation is insufficient:

```text
PLANNING_BLOCKED
reason = PORTFOLIO_REMEDIATION_REQUIRED
```

## 23. Upstream contract gap

If planning requires semantics absent from a conformant upstream contract:

```text
PLANNING_BLOCKED
reason = UPSTREAM_SPEC_REMEDIATION_REQUIRED
```

## 24. Implementation Plan artifact

Create:

```text
docs/specs/implementation-plans/
<SPEC-ID>-implementation-plan.md
```

or repository-equivalent convention.

Begin with:

```text
# <SPEC-ID> — Implementation Plan

Status: PROPOSED
Planning source: validated component Implementation Gap Matrix
```

## 25. Required plan authority header

Include:

```text
Portfolio:
Portfolio audit:
Component SPEC:
Component SPEC audit:
Validated Gap Matrix:
Gap Matrix audit:
Repository baseline:
Current HEAD:
Baseline drift:
```

State explicitly:

```text
This plan does not redefine ADR, portfolio, SPEC, or Gap Matrix authority.
```

## 26. Implementation Unit formation principle

Do not mechanically create:

```text
1 Gap = 1 Implementation Unit
```

Group validated gaps only when they share a coherent implementation boundary.

Possible unit formation reasons:

```text
SHARED_AUTHORITY
SHARED_INVARIANT
SHARED_PERSISTENCE_BOUNDARY
SHARED_COMMAND_BOUNDARY
SHARED_INTEGRATION_SEAM
SHARED_CUTOVER
SHARED_CONFORMANCE
```

Every unit must state:

```text
UNIT_FORMATION_REASON
```

## 27. Split Implementation Units when needed

Split when combining work would:

* mix owners;
* mix unrelated invariants;
* hide dependencies;
* combine independent closure conditions;
* create unnecessary change radius;
* prevent independent audit;
* create avoidable parallel collision;
* mix authority transition with unrelated presentation.

## 28. False Unit Split rule

Detect:

```text
FALSE_UNIT_SPLIT
```

when multiple units represent what is actually one indivisible implementation
change.

Examples:

* same owner;
* same invariant;
* same persistence transaction;
* same closure condition;
* cannot be independently completed.

Target:

```text
FALSE_UNIT_SPLITS = 0
```

## 29. False Unit Merge rule

Detect:

```text
FALSE_UNIT_MERGE
```

when one unit contains materially independent implementation work.

Indicators:

* different owners;
* independent dependencies;
* independent closure;
* different cutover paths;
* unrelated failure semantics;
* distinct conformance boundaries.

Also compare, for every proposed merge:

```text
PRODUCTIVE_AVAILABILITY
AUTHORITY_STATUS
CONTRACT_STATUS
LOCAL_TESTABILITY
DEPENDENCY_CLASS
EXTERNAL_BLOCKERS
AUTHORITY_COMPLETENESS
CROSS_SPEC_PREREQUISITES
LOCAL_CLOSURE_CONDITIONS
COMPLETION_EVIDENCE_TIMING
SHARED_CLOSURE_BOUNDARY
```

`SHARED_AUTHORITY`, `SHARED_PERSISTENCE_BOUNDARY`, or `SHARED_INVARIANT`
alone never permits a merge. The planner must prove:

```text
UNIT_MERGE_ALLOWED =
    COHESIVE_IMPLEMENTATION_BOUNDARY
    AND SHARED_CLOSURE_BOUNDARY = YES
    AND COMPATIBLE_READINESS_STATE
    AND COMPATIBLE_LOCAL_CLOSURE
    AND COMPATIBLE_DEPENDENCY_CLASSES
```

Otherwise emit `FALSE_UNIT_MERGE` and split at the closure/readiness boundary
when the approved Plan authority permits it. If splitting is not authorized,
retain the combined unit as `PLAN_BLOCKED` with the exact incompatible parts,
capability IDs, and blocker evidence. Do not delegate the inconsistency to
ticket decomposition or invent ownership or requirements during the split.

Target:

```text
FALSE_UNIT_MERGES = 0
```

## 30. Stable Implementation Unit IDs

Use:

```text
<SPEC-PREFIX>-IMP-01
<SPEC-PREFIX>-IMP-02
...
```

Do not reuse Gap IDs.

Preserve stable IDs when regenerating/reconciling the same plan when possible.

## 31. Required Implementation Unit structure

Every unit must contain:

```text
## <UNIT-ID> — <Title>

### Goal
### Authority and Ownership
### Gap Matrix Coverage
### Portfolio Obligation Coverage
### Validated Delta
### Required Behavior
### Does Not Implement
### Repository Evidence
### Expected Repository Impact
### Implementation Constraints
### Internal Prerequisites
### Cross-Spec Prerequisites
### Producer / Consumer Contract Proof
### Capability Availability and Blocking Effect
### Temporal Authority Preconditions
### Acceptance Criteria
### ACCEPTANCE_WITNESS_MATRIX
### Local Closure
### Work Can Start
### Shared Closure Boundary
### Required Tests
### Legacy / Cutover Impact
### Completion Evidence
### Risks
### Issue Decomposition Readiness
### Initial DAG State
```

## 32. Goal

Describe behavior that becomes true when this unit is complete.

The goal must be locally achievable.

Do not use end-to-end capability as local Goal if downstream units are needed.

## 33. Authority and Ownership

Record:

```text
Primary component SPEC:
Portfolio obligations:
Approved ownership role:
Local ownership:
Cross-spec dependencies:
Foreign capabilities consumed:
Producer / Consumer Contract Proof:
Authority Consumption Proof:
Authority consumption result:
Availability condition:
```

For mutable external authority also record the applicable
`TEMPORAL_AUTHORITY_PROOF` and its fail-closed behavior. These fields cite
upstream authority; they must not introduce new normative meaning.

## 34. Gap Matrix Coverage

List:

```text
GAP-###
Requirement IDs
Acceptance IDs, where relevant
```

All references must exist upstream.

## 35. Portfolio Obligation Coverage

List exact:

```text
O-###
```

or repository-equivalent obligation IDs.

This creates:

```text
ADR
→ Portfolio Obligation
→ Requirement
→ Gap
→ Implementation Unit
```

## 36. Validated Delta

Restate the validated Gap delta.

Do not broaden it.

Use:

```text
OBSERVED
REQUIRED
DELTA
```

where practical.

## 37. Required Behavior

Describe local behavior that must become true.

Separate:

```text
LOCAL_BEHAVIOR
```

from:

```text
END_TO_END_CONTRIBUTION
```

Do not assign downstream behavior locally.

## 38. Does Not Implement

Mandatory when nearby ownership could be confused.

Explicitly list:

* foreign lifecycle;
* downstream integration;
* UI/OPS behavior;
* final conformance;
* cutover owned later;
* foreign persistence;
* canonical semantics owned elsewhere.

Otherwise:

```text
None beyond normal component boundaries.
```

## 39. Repository Evidence

Record current reusable evidence:

* files;
* symbols;
* tests;
* schemas;
* handlers;
* adapters;
* legacy paths.

Explain:

```text
REUSE
EXTEND
REPLACE
RETIRE
```

where relevant.

## 40. Expected Repository Impact

Identify likely affected areas.

Examples:

```text
domain
application
persistence
integration
scheduler
Git/GitHub adapter
API
operations
UI
tests
migration
```

Concrete files/modules may be listed when evidence supports them.

State explicitly:

```text
Expected Repository Impact is planning guidance, not normative design authority.
```

Do not freeze unnecessary internal design.

## 41. Implementation Constraints

Only constraints derived from accepted authority or validated Gap.

Examples:

* preserve canonical identity;
* preserve idempotency;
* reject stale revision;
* prevent duplicate authority;
* preserve historical reads;
* retire contradictory writes;
* preserve foreign lifecycle ownership.

Do not dictate mechanism unnecessarily.

## 42. Internal prerequisites

List prerequisite Implementation Unit IDs.

A unit may depend only on earlier/upstream units.

## 43. Cross-Spec prerequisites

List separately:

```text
Owner SPEC
Required capability
Implementation state
Blocking?
```

Do not hide foreign blockers inside internal DAG edges.

## 44. Acceptance Criteria

Acceptance Criteria must be locally provable.

Every local AC must satisfy:

```text
LOCAL_PROVABILITY = YES
```

Proof may use only:

1. behavior implemented by this unit;
2. already completed internal prerequisites;
3. confirmed preexisting foreign capabilities.

For every local AC and every completion-evidence item, evaluate the shared
`ACCEPTANCE_WITNESS_MATRIX` fields:

```text
required productive dependencies available now?
required operation executable now?
required negative witness executable now?
required durability/restart/recovery/concurrency/physical-CAS/foreign-effect
evidence executable now, when applicable?
WITNESS_EXECUTABLE_AT_LOCAL_CLOSURE = YES | NO
```

If any answer is `NO`, `LOCAL_PROVABILITY = NO` and `LOCAL_CLOSURE = NO`; a
future integration checkpoint or downstream Final Proof Owner cannot repair the
local criterion.

## 45. Forbidden local Acceptance dependencies

A local AC must not require:

* downstream Implementation Unit;
* future integration;
* behavior under Does Not Implement;
* unavailable foreign capability;
* final end-to-end conformance;
* later cutover.

If it does:

```text
LOCAL_PROVABILITY = NO
```

and the unit is not ready.

## 46. Multi-unit acceptance obligations

When an upstream normative Acceptance obligation spans multiple units:

do not copy the complete obligation into each unit.

Instead define:

```text
LOCAL_CONTRIBUTION
CONTRIBUTING_UNITS
FINAL_PROOF_OWNER
```

## 47. Local Closure

Report:

```text
LOCAL_CLOSURE = YES | NO
```

YES requires:

```text
all local ACs locally provable
completion evidence locally producible
no downstream dependency for local completion
no conflict with Does Not Implement
no unavailable foreign dependency classified REQUIRED_FOR_LOCAL_EXECUTION or
REQUIRED_FOR_LOCAL_CLOSURE
local required tests executable at closure point
unit independently auditable
```

`LOCAL_CLOSURE = YES` is forbidden when any capability classified
`REQUIRED_FOR_LOCAL_CLOSURE` has `PRODUCTIVE_AVAILABILITY = NO` or any local witness has
`WITNESS_EXECUTABLE_AT_LOCAL_CLOSURE = NO`.

## 48. Required Tests

Assign tests that can execute when the unit closes.

Applicable categories:

```text
unit
domain invariant
persistence
application
integration
concurrency
stale protection
idempotency
recovery
compatibility
migration
regression
conformance
API/UI contract
```

Correctness-sensitive semantics must receive automated proof.

## 49. End-to-end tests

Tests requiring several implementation units belong to:

* earliest unit where all behavior exists; or
* designated Final Proof Owner.

Do not assign them to an earlier contributor.

## 50. Legacy / Cutover Impact

Use applicable values:

```text
NO_LEGACY_IMPACT
PRESERVE_LEGACY_READS
RETIRE_LEGACY_WRITES
ADD_COMPATIBILITY_MAPPING
MIGRATE_EXISTING_STATE
REMOVE_ALTERNATE_AUTHORITY
DEFERRED_TO_OTHER_SPEC
```

Explain exact local behavior.

Preserve approved compatibility ownership.

## 51. Completion Evidence

Define objective evidence required to consider the unit complete.

Examples:

* code path exists;
* old authority removed;
* persistence semantics proven;
* integration wiring exists;
* tests pass;
* migration evidence exists;
* local conformance tests pass.

Evidence must be producible when this unit closes.

## 52. Issue Decomposition Readiness

Separate plan quality from execution state.

Use exactly:

```text
ISSUE_READY
INTERNAL_ONLY
PLAN_BLOCKED
```

### ISSUE_READY

Use when:

```text
semantics frozen
scope coherent
LOCAL_CLOSURE = YES
dependencies known
acceptance locally provable
completion evidence local
no unresolved authority gap
```

Because ticket decomposition requires locally closable tickets, an otherwise
startable unit with `LOCAL_CLOSURE = NO` is `PLAN_BLOCKED` or
`SPLIT_REQUIRED_BEFORE_TICKETING`; it is never `ISSUE_READY`.

### INTERNAL_ONLY

Use when work is necessary but should be absorbed into another unit/ticket.

### PLAN_BLOCKED

Use when unit itself cannot be coherently decomposed yet.

## 53. Initial DAG State

Separately report:

```text
READY
BLOCKED
```

### READY

No unresolved internal or cross-SPEC prerequisite, and the shared
`EXECUTION_READY` predicate is true. A later wave is not an availability
exception.

### BLOCKED

One or more prerequisite units or required external capabilities must become
available first. Record the exact Unit or `CAPABILITY_ID` blocker and use
`BLOCKED_BY_UPSTREAM_CONTRACT` for a defined but non-productive capability.

Record:

```text
BLOCKED_BY = <UNIT-ID(s)>
```

Important:

```text
ISSUE_READY
```

does not imply:

```text
INITIAL_DAG_STATE = READY
```

A valid ticket may be born BLOCKED.

Do not conflate decomposition quality with runtime scheduling state.

## 54. Unit readiness invariant

A unit may therefore be:

```text
ISSUE_READY
+
INITIAL_DAG_STATE = BLOCKED
```

This means:

* ticket can be generated safely;
* ticket cannot execute yet.

## 55. Gap → Plan Traceability

Create:

| Gap ID | Requirement | Portfolio Obligation | Classification | Severity | Planning Type | Implementation Unit(s) | Status |
| ------ | ----------- | -------------------- | -------------- | -------- | ------------- | ---------------------- | ------ |

Status:

```text
COVERED
FOREIGN_DEPENDENCY_ONLY
NO_LOCAL_WORK
BLOCKED
```

Required:

```text
UNCOVERED_LOCAL_GAPS = 0
```

## 56. Plan → Gap Authority Validation

Every unit must satisfy one:

```text
VALIDATED_GAP_BACKING = YES
```

or:

```text
REQUIRED_SUPPORTING_WORK = YES
```

Supporting work examples:

* necessary migration;
* required integration test;
* required conformance proof;
* unavoidable local scaffolding.

If neither:

```text
SPECULATIVE_UNIT
```

Remove it.

## 57. Unit formation validation

For every unit report:

```text
UNIT_FORMATION_REASON
GAP_BACKING
INDEPENDENT_CLOSURE
```

Required:

```text
UNITS_WITHOUT_GAP_OR_SUPPORTING_AUTHORITY = 0
FALSE_UNIT_SPLITS = 0
FALSE_UNIT_MERGES = 0
```

## 58. Acceptance → Plan Traceability

Create:

| Acceptance ID | Requirement(s) | Contributing Units | Final Proof Owner | Local Evidence | Final Evidence |
| ------------- | -------------- | ------------------ | ----------------- | -------------- | -------------- |

## 59. Contributing Units

List every unit whose work contributes to satisfying the normative acceptance.

Contribution does not mean final proof ownership.

## 60. Final Proof Owner

Exactly one of:

```text
<UNIT-ID>
ALREADY_SATISFIED
UNRESOLVED
```

for every acceptance obligation.

Required:

```text
UNRESOLVED_FINAL_PROOF_OWNERS = 0
```

## 61. Final Proof Owner selection

Choose the earliest legitimate unit where:

* all required contributors are complete;
* complete obligation can be proven;
* unit has authority to host the evidence;
* proof does not require future work.

A dedicated conformance unit is allowed only when real integrated conformance
work exists.

Do not create a synthetic final unit merely to own proof.

## 62. Local AC consistency checks

Calculate:

```text
LOCAL_AC_REQUIRING_DOWNSTREAM
LOCAL_AC_CONTRADICTING_DOES_NOT_IMPLEMENT
LOCAL_AC_REQUIRING_UNAVAILABLE_FOREIGN_CAPABILITY
```

Required for readiness:

```text
all = 0
```

## 63. Cross-Spec Dependency Table

Create:

| Dependency | Portfolio Owner | Consumer Unit | Required Contract | Foreign Implementation State | Blocking? |
| ---------- | --------------- | ------------- | ----------------- | ---------------------------- | ---------- |

Foreign lifecycle implementation remains foreign.

## 64. Foreign implementation missing

A missing foreign implementation may cause:

```text
INITIAL_DAG_STATE = BLOCKED
```

for affected local units.

It does not automatically make the entire Implementation Plan invalid if:

* ownership is known;
* dependency is explicit;
* local work is deterministic;
* DAG remains complete.

## 65. Dependency DAG

Create explicit acyclic DAG over Implementation Units.

Validate:

```text
DAG_CYCLE_DETECTED = NO
```

Every internal prerequisite must correspond to an actual implementation
dependency.

## 66. DAG local-closure invariant

For every edge:

```text
IMP-A → IMP-B
```

IMP-A local closure must not depend on IMP-B.

Otherwise dependency/acceptance allocation is invalid.

## 67. Parallelization Waves

Derive waves from DAG.

For each wave record:

```text
Units
Prerequisites
Shared repository collision risk
Execution mode
```

Execution mode:

```text
SAFE
SAFE_WITH_COORDINATION
SERIAL_REQUIRED
```

Do not maximize parallelism at the expense of correctness.

## 68. Integration Checkpoints

Create when several units must converge before downstream work.

Each checkpoint:

```text
CHECKPOINT_ID
Required Units
Integrated Behavior
Required Evidence
Unlocked Units
```

Checkpoints are especially useful for:

* canonical identity;
* persistence authority;
* scheduler semantics;
* shared integration;
* compatibility/cutover;
* migration;
* concurrency.

## 69. Checkpoint acceptance

Checkpoint-level integrated behavior must not be copied into local ACs of
earlier units.

Preserve:

```text
LOCAL_PROOF
!=
INTEGRATED_PROOF
```

## 70. Legacy / Authority Transition Table

When any Gap involves:

* contradiction;
* alternate authority;
* legacy compatibility;
* write retirement;
* migration;
* cutover;

produce:

| Current Path | Target Authority | Read Behavior | Write Behavior | Migration/Mapping | Owning Unit |
| ------------ | ---------------- | ------------- | -------------- | ----------------- | ----------- |

## 71. Failure semantic implementation planning

For validated failure-related gaps preserve:

```text
CANONICAL_FAILURE_OWNER
LOCAL_COMPONENT_ROLE
```

Plan only locally owned implementation.

Do not redesign failure ownership.

## 72. Compatibility planning

For:

```text
NEW_CANONICAL_PATH
LEGACY_COMPATIBILITY
HISTORICAL_REPLAY
CUTOVER
RETIREMENT
```

plan only behavior allocated to the target component.

Foreign compatibility work remains a dependency.

## 73. Test Strategy

Produce plan-level test strategy covering:

```text
existing tests retained
tests modified
new tests
integration tests
cross-spec tests
concurrency/idempotency tests
recovery tests
migration/compatibility tests
conformance tests
```

## 74. Test evidence classes

Distinguish:

```text
LOCAL_TEST_EVIDENCE
INTEGRATION_TEST_EVIDENCE
FINAL_CONFORMANCE_EVIDENCE
```

Map each to the appropriate unit/checkpoint/final proof owner.

## 75. Risk Register

Create:

| Risk | Cause | Affected Units | Mitigation / Gate |
| ---- | ----- | -------------- | ----------------- |

Prioritize:

* duplicate authority;
* stale writes;
* identity mismatch;
* partial migration;
* idempotency loss;
* durability mismatch;
* hidden lifecycle duplication;
* compatibility regression;
* downstream-dependent local acceptance;
* parallel change collision;
* ambiguous final proof ownership.

## 76. Implementation Unit Closure Matrix

Create:

| Unit | Independently Implementable | Local Closure | Issue Decomposition Readiness | Initial DAG State | Blocked By |
| ---- | --------------------------- | ------------- | ----------------------------- | ----------------- | ---------- |

For all `ISSUE_READY` units:

```text
INDEPENDENTLY_IMPLEMENTABLE = YES
LOCAL_CLOSURE = YES
```

Their Initial DAG State may be READY or BLOCKED.

## 77. Planning completeness metrics

Report:

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

## 78. Mechanical coverage invariants

Required:

```text
GAPS_WITHOUT_PLAN_COVERAGE = 0

UNITS_WITHOUT_GAP_OR_SUPPORTING_AUTHORITY = 0

FALSE_UNIT_SPLITS = 0
FALSE_UNIT_MERGES = 0

UNRESOLVED_FINAL_PROOF_OWNERS = 0

LOCAL_AC_REQUIRING_DOWNSTREAM = 0
LOCAL_AC_CONTRADICTING_DOES_NOT_IMPLEMENT = 0
LOCAL_AC_REQUIRING_UNAVAILABLE_FOREIGN_CAPABILITY = 0

UNAPPROVED_NORMATIVE_DEPENDENCIES = 0

SPECIFICATION_GAPS = 0
ARCHITECTURE_GAPS = 0
PORTFOLIO_GAPS = 0
UPSTREAM_CONTRACT_GAPS = 0

IMPLEMENTATION_UNIT_AUTHORITY_CHECK = PASS
UNITS_INVENTING_IDENTITY = 0
UNITS_INVENTING_LIFECYCLE = 0
UNITS_INVENTING_PROVENANCE = 0
UNITS_INVENTING_OWNERSHIP = 0
UNITS_INVENTING_RECOVERY = 0
UNITS_INVENTING_PERSISTENCE_SEMANTICS = 0

DAG_CYCLE_DETECTED = NO
```

## 79. Plan gate semantics

The Implementation Plan may contain units whose:

```text
INITIAL_DAG_STATE = BLOCKED
```

and still be ready for independent audit.

Known dependency blocking is not equivalent to an incomplete plan.

The plan is blocked only when planning itself is indeterminate.

## 80. Implementation Plan gate

Return exactly one:

```text
IMPLEMENTATION_PLAN_GATE: READY_FOR_IMPLEMENTATION_PLAN_AUDIT
```

or:

```text
IMPLEMENTATION_PLAN_GATE: BLOCKED
```

## 81. READY gate

Use only when:

```text
portfolio baseline approved
component SPEC conformant
Gap Matrix conformant
Gap Matrix readiness valid

zero uncovered local gaps
zero speculative units
zero false unit splits
zero false unit merges

every ISSUE_READY unit locally closable
every local AC locally provable
zero downstream-dependent local ACs
zero Does Not Implement contradictions
every local witness executable at closure
every capability classified REQUIRED_FOR_LOCAL_CLOSURE productively available
at closure

every acceptance obligation has one final proof owner
cross-spec dependencies explicit
normative dependency direction preserved

legacy/cutover represented where applicable
failure ownership preserved
required tests represented

DAG acyclic
no unresolved authority gaps
SPEC_IMPLEMENTABILITY_CHECK = PASS
IMPLEMENTATION_UNIT_AUTHORITY_CHECK = PASS
AUTHORITY_CONSUMPTION_GAPS = 0
TEMPORAL_AUTHORITY_GAPS = 0
UNREPRESENTED_UPSTREAM_CONTRACT_BLOCKERS = 0
READY_UNITS_WITH_UNAVAILABLE_CONTRACT = 0
DOWNSTREAM_PROMOTION_WITHOUT_NEW_EVIDENCE = 0
LOCAL_CLOSURE_WITH_UNAVAILABLE_REQUIRED_CAPABILITY = 0
WITNESSES_NOT_EXECUTABLE_AT_LOCAL_CLOSURE = 0
zero units inventing identity, lifecycle, provenance, ownership, recovery, or
persistence semantics
```

Blocked runtime units are allowed if the dependency is fully known.

## 82. BLOCKED gate

Use when planning cannot be made deterministic because of:

```text
UPSTREAM_AUTHORITY_REVALIDATION_REQUIRED
UPSTREAM_AUTHORITY_INCOMPLETE
GAP_MATRIX_REVALIDATION_REQUIRED
SPECIFICATION_GAP_DISCOVERED
ARCHITECTURE_DECISION_REQUIRED
PORTFOLIO_REMEDIATION_REQUIRED
PORTFOLIO_DEPENDENCY_CHANGE_REQUIRED
UPSTREAM_SPEC_REMEDIATION_REQUIRED
UNRESOLVED_PLAN_STRUCTURE
```

## 83. No ticket generation

Do not produce ticket artifacts.

Do not assign:

```text
READY
BLOCKED
DONE
```

as ticket lifecycle states.

Only record the projected initial execution state of future tickets.

Issue decomposition is a downstream phase.

## 84. No implementation

Do not:

* modify code;
* modify tests;
* create migrations;
* create schemas;
* implement adapters;
* perform Git changes unrelated to the plan artifact.

This skill creates only planning documentation.

## 85. No Gap Matrix mutation

Do not modify or regenerate the validated Gap Matrix.

If baseline drift invalidates it:

```text
PLANNING_BLOCKED
reason = GAP_MATRIX_REVALIDATION_REQUIRED
```

## 86. No architecture mutation

Do not modify:

* ADRs;
* portfolio;
* component SPECs;
* upstream SPECs.

Escalate instead.

## 87. Required plan sections

The final Implementation Plan must include:

```text
1. Status
2. Planning Authority
3. Frozen Baselines
4. Baseline Drift Assessment
5. Validated Gap Intake
6. Planning Ownership Classification
7. Repository Planning Evidence
8. Reuse Assessment
9. Implementation Units
10. Gap → Plan Traceability
11. Acceptance → Plan Traceability
12. Cross-Spec Dependencies
13. Dependency DAG
14. Parallelization Waves
15. Integration Checkpoints
16. Legacy / Authority Transition
17. Test Strategy
18. Risk Register
19. Implementation Unit Closure Matrix
20. Plan Metrics
21. Authority / Specification Escalations
22. Upstream Authority Preconditions
23. Implementation Unit Authority Checks
24. Implementation Plan Gate
```

## 88. Required final response

Return:

```text
COMPONENT_IMPLEMENTATION_PLAN_COMPLETE

SPEC:
<SPEC-ID>

PORTFOLIO:
<PORTFOLIO-ID>

IMPLEMENTATION_PLAN:
<path>

VALIDATED_GAP_MATRIX:
<path>

GAP_MATRIX_AUDIT:
<path>

BASELINES:
- GAP_MATRIX_BASELINE: <sha>
- CURRENT_HEAD: <sha>
- DRIFT: <classification>

GAPS:
- VALIDATED: <n>
- LOCAL_IMPLEMENTATION: <n>
- CROSS_SPEC_DEPENDENCIES: <n>
- NO_LOCAL_WORK: <n>
- UNCOVERED_LOCAL: <n>

IMPLEMENTATION_UNITS:
- TOTAL: <n>
- LOCALLY_CLOSABLE: <n>
- NON_LOCALLY_CLOSABLE: <n>
- ISSUE_READY: <n>
- INTERNAL_ONLY: <n>
- PLAN_BLOCKED: <n>
- INITIAL_READY: <n>
- INITIAL_BLOCKED: <n>

UNIT_STRUCTURE:
- FALSE_SPLITS: <n>
- FALSE_MERGES: <n>
- SPECULATIVE_UNITS: <n>

ACCEPTANCE:
- TOTAL: <n>
- WITH_FINAL_PROOF_OWNER: <n>
- UNRESOLVED_FINAL_PROOF_OWNER: <n>
- LOCAL_AC_REQUIRING_DOWNSTREAM: <n>
- LOCAL_AC_SCOPE_CONTRADICTIONS: <n>

DEPENDENCIES:
- UNAPPROVED_NORMATIVE: <n>
- DAG_CYCLE: YES|NO

AUTHORITY_GAPS:
- SPECIFICATION: <n>
- ARCHITECTURE: <n>
- PORTFOLIO: <n>
- UPSTREAM_CONTRACT: <n>

GATE:
READY_FOR_IMPLEMENTATION_PLAN_AUDIT
|
BLOCKED
```

## 89. Blocked response

If blocked return only:

```text
COMPONENT_IMPLEMENTATION_PLANNING_BLOCKED

SPEC:
<SPEC-ID>

BLOCKER:
<reason>

AFFECTED_GAP_OR_UNIT:
<id>

REQUIRED_UPSTREAM_ACTION:
<precise action>

GATE:
BLOCKED
```

Do not continue speculative planning after a material authority blocker.

## 90. Prohibited shortcuts

Do not:

* create one unit per Gap mechanically;
* merge independent Gaps just to reduce ticket count;
* split indivisible work merely for parallelism;
* move foreign lifecycle locally;
* add normative dependency not approved by portfolio;
* make downstream behavior a local AC;
* require final conformance for early-unit closure;
* treat ISSUE_READY as runtime READY;
* treat runtime BLOCKED as plan incompleteness;
* create synthetic final-proof units without real work;
* duplicate foreign capability;
* reopen architecture because code differs;
* prescribe unnecessary internal architecture;
* generate tickets;
* modify implementation;
* modify Gap Matrix.

## Core completion invariant

The Implementation Plan is locally complete only when it can support:

> Every validated local implementation gap is mapped to one or more coherent,
> authority-backed Implementation Units; every unit traces through Gap,
> Requirement and Portfolio Obligation to accepted ADR authority; no foreign
> lifecycle or normative dependency has been reassigned locally; every
> ISSUE_READY unit is independently implementable and locally closable; no local
> Acceptance Criterion depends on downstream work, unavailable foreign behavior
> or excluded scope; every multi-unit acceptance obligation has contributing
> units and exactly one Final Proof Owner; Implementation Units are neither
> falsely split nor falsely merged; all internal dependencies form an acyclic
> DAG; initial execution readiness is separated from issue decomposition
> readiness; blocked runtime units have explicit known prerequisites; legacy,
> cutover, failure, compatibility and test responsibilities are represented;
> and no speculative implementation or hidden architectural decision has been
> introduced.

When this invariant holds, return:

```text
IMPLEMENTATION_PLAN_GATE: READY_FOR_IMPLEMENTATION_PLAN_AUDIT
```

The mandatory next step is an independent:

```text
audit-component-implementation-plan
```
