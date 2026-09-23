---
name: audit-component-implementation-plan
description: >
  Independently audit a component Implementation Plan derived from a validated
  component Implementation Gap Matrix governed by an approved SPEC portfolio
  decomposition. Verify ADR, portfolio, component SPEC, upstream contract and
  validated Gap Matrix conformance; Portfolio Obligation to Requirement to Gap
  to Implementation Unit traceability; implementation-unit justification and
  granularity; ownership preservation; normative dependency direction;
  independent local closure; local acceptance provability; final proof
  ownership; issue decomposition readiness; initial DAG state; dependency DAG
  correctness; safe parallelization; test strategy; failure and
  compatibility/cutover ownership; completion evidence; and mechanically
  reconciled plan metrics. Use after plan-component-implementation and before
  ticket/issue decomposition. This skill is read-only and never remediates the
  plan, implementation, Gap Matrix, SPEC, portfolio, or ADRs.
---

# Audit Component Implementation Plan

## Purpose

Independently determine whether a component Implementation Plan is a correct,
complete, ownership-preserving, dependency-valid and auditable translation of
a validated component Implementation Gap Matrix.

The workflow under audit is:

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
        +
Implementation Plan
        ↓
audit-component-implementation-plan
        ↓
IMPLEMENTATION_PLAN_CONFORMANT
or
IMPLEMENTATION_PLAN_REMEDIATION_REQUIRED
```

The audit must determine whether the plan may safely proceed to ticket/issue
decomposition without requiring the downstream agent to rediscover:

* architecture;
* ownership;
* requirements;
* implementation gaps;
* implementation-unit boundaries;
* dependency structure;
* acceptance allocation;
* proof ownership.

## Operating mode

Operate in:

```text
READ_ONLY
INDEPENDENT
ADVERSARIAL
ADR_FIRST
PORTFOLIO_GOVERNED
SPEC_FIRST
VALIDATED_GAP_DRIVEN
IMPLEMENTATION_AWARE
EVIDENCE_REQUIRED
OWNERSHIP_PRESERVING
DEPENDENCY_AWARE
LOCAL_CLOSURE_REQUIRED
PROOF_OWNERSHIP_AWARE
ISSUE_DECOMPOSITION_INDEPENDENT
PLAN_SKEPTICAL
NO_REMEDIATION
NO_IMPLEMENTATION
```

Do not modify:

* ADRs;
* portfolio decomposition;
* component SPEC;
* upstream SPECs;
* Gap Matrix;
* Implementation Plan;
* production code;
* tests;
* migrations;
* schemas;
* tickets;
* Issues;
* previous audits.

Only create the requested plan audit artifact.

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
Implementation Plan under audit
    >
prototype / historical evidence
```

Interpret authority as:

```text
ADR
    defines architecture

Portfolio
    defines WHO owns obligations
    and normative dependency direction

Component SPEC
    defines WHAT must be true

Gap Matrix
    proves WHAT implementation delta exists

Implementation Plan
    proposes HOW validated local deltas will be closed

Plan Audit
    independently proves or disproves that planning translation
```

The Implementation Plan is never authority.

Read `../_shared/authority-completeness-gates.md`. This audit confirms the
upstream proof and verifies that no plan unit silently becomes the owner of an
unresolved normative decision.

Recalculate the shared `IMPLEMENTER_DECISION_CHECK` for every critical unit
handoff. A `NO` or `UNKNOWN` normative answer is a blocking upstream authority
finding, not a plan defect that can be ticketed.

## 1. Required preconditions

### 1.1 Portfolio gate

Verify:

```text
PORTFOLIO_DECOMPOSITION_APPROVED
```

Otherwise:

```text
PLAN_AUDIT_BLOCKED
reason = PORTFOLIO_NOT_APPROVED
```

### 1.2 Component SPEC gate

Verify latest independent SPEC audit:

```text
PASS — COMPONENT_SPEC_CONFORMANT
```

Otherwise:

```text
PLAN_AUDIT_BLOCKED
reason = COMPONENT_SPEC_NOT_CONFORMANT
```

### 1.3 Gap Matrix gate

Verify latest independent Gap Matrix audit:

```text
GAP_MATRIX_CONFORMANT
```

and:

```text
READY_FOR_IMPLEMENTATION_PLAN
```

Otherwise:

```text
PLAN_AUDIT_BLOCKED
reason = GAP_MATRIX_NOT_VALIDATED
```

Do not trust readiness merely because the Gap Matrix or Plan states it.

### 1.4 Plan audit gate

The Implementation Plan must state:

```text
IMPLEMENTATION_PLAN_GATE:
READY_FOR_IMPLEMENTATION_PLAN_AUDIT
```

Otherwise:

```text
PLAN_AUDIT_BLOCKED
reason = PLAN_NOT_READY_FOR_AUDIT
```

### 1.5 Upstream SPEC authority

Every normative upstream component contract used by the plan must remain
conformant.

Otherwise:

```text
PLAN_AUDIT_BLOCKED
reason = UPSTREAM_SPEC_NOT_CONFORMANT
```

### 1.6 Authority completeness gate

Require current SPEC and Gap Matrix audit evidence for
`SPEC_IMPLEMENTABILITY_CHECK = PASS` and all applicable identity,
reconstruction, lifecycle, persistence, and cross-SPEC proofs. Missing,
failed, stale, or contradictory evidence blocks this audit:

```text
IMPLEMENTATION_PLAN_BLOCKED_BY_UPSTREAM_AUTHORITY
```

Do not remediate the upstream artifact or reinterpret its absence as planned
implementation work.

## 2. Required inputs

Identify independently:

* accepted ADRs;
* governing portfolio;
* latest portfolio audit;
* component SPEC;
* latest component SPEC audit;
* conformant upstream component SPECs;
* validated component Gap Matrix;
* latest Gap Matrix audit;
* Implementation Plan;
* repository root;
* portfolio baseline;
* component SPEC baseline;
* upstream SPEC baselines;
* Gap Matrix baseline;
* plan repository baseline;
* current HEAD;
* relevant implementation;
* relevant tests;
* migration/cutover paths where applicable.

## 3. Establish audit baseline

Read `skills/_shared/baseline-drift-remediation-contract.md`. If any authority,
Gap Matrix, plan, repository, or evidence baseline has drifted, perform the
complete reassessment proof before emitting the verdict. Emit the shared drift
status, reassessment completeness, actionable-findings, readiness, and exact
audit-basis fingerprint fields so `remediate-component-implementation-plan`
can consume assessed drift without a duplicate audit.

Record:

```text
PORTFOLIO_BASELINE
COMPONENT_SPEC_BASELINE
UPSTREAM_SPEC_BASELINES
GAP_MATRIX_BASELINE
PLAN_BASELINE
CURRENT_HEAD
WORKING_TREE_STATE
BASELINE_DRIFT_STATUS
REASSESSMENT_COMPLETE
FINDINGS_ARE_ACTIONABLE
BASELINE_REMEDIATION_READINESS
AUDIT_BASIS_FINGERPRINT
```

Capture revisions/digests when available.

## 4. Baseline drift audit

Use the shared baseline/remediation contract. A drift observation is not the
same as an incomplete reassessment. When drift exists, complete the
`BASELINE_REASSESSMENT_PROOF` by comparing old/current authority and repository
baselines, affected plan records, stale/current evidence, metrics, correction
scope, and revalidation criteria. Continue to an actionable remediation result
when that proof is complete.

Compare current state against the plan's validated authority and repository
baseline.

Track separately:

```text
PORTFOLIO_BASELINE_DRIFT
COMPONENT_SPEC_BASELINE_DRIFT
UPSTREAM_SPEC_BASELINE_DRIFT
GAP_MATRIX_BASELINE_DRIFT
REPOSITORY_BASELINE_DRIFT
```

Classify overall drift:

```text
NO_RELEVANT_DRIFT
NON_SEMANTIC_DOCUMENTARY_DRIFT
LOCALIZED_IMPLEMENTATION_DRIFT
MATERIAL_BASELINE_DRIFT
```

## 5. Material authority drift

Material changes to:

* accepted ADR semantics;
* portfolio ownership;
* normative dependency graph;
* component SPEC;
* upstream SPEC;
* Gap Matrix authority baseline;

must not be repaired inside this audit. They must be reassessed and explicitly
classified. Emit `DRIFT_ASSESSED` and `REASSESSMENT_COMPLETE = YES` when the
current state is fully compared and the findings are actionable. Emit
`DRIFT_UNASSESSED`, `REASSESSMENT_COMPLETE = NO`, and
`BASELINE_REMEDIATION_READINESS = BLOCKED_INSUFFICIENT_REASSESSMENT` only when
the current authority/source/evidence cannot be determined.

The remediator consumes the assessed proof; it does not require a duplicate
audit merely because this audit observed material drift.

## 6. Localized repository drift

If implementation/tests changed after the validated Gap Matrix and plan
baseline, identify affected:

```text
Gap IDs
Implementation Units
Repository evidence
```

Do not silently update the Plan.

Create findings where the plan became stale.

If drift invalidates the Gap Matrix materially:

```text
IMPLEMENTATION_PLAN_AUDIT_BLOCKED
reason = GAP_MATRIX_REVALIDATION_REQUIRED
```

## 7. Independent authority reconstruction

Independently reconstruct relevant:

```text
ADR decisions
Portfolio obligations
Portfolio owners
Portfolio consumers
Normative dependencies
Failure owners
Compatibility/cutover owners
Component requirements
Upstream contracts
```

Do not infer authority from the Implementation Plan.

## 7a. IMPLEMENTATION_UNIT_AUTHORITY_CHECK

For every unit, independently answer whether all normative decisions needed for
implementation already exist upstream. The answer must be `YES` with proof
IDs. Reject units that invent canonical identity, lifecycle, progression
provenance, ownership, recovery semantics, persistence meaning, or missing
domain invariants. Classify the smallest root-cause stage and report
`IMPLEMENTATION_UNIT_AUTHORITY_CHECK = FAIL` when any unit requires such a
decision.

Also independently audit each unit's `PRODUCER_CONSUMER_CONTRACT_PROOF`:
producer, produced contract, authority owner, consumer, capability,
availability condition, and dependency edge, plus capability ID, authority
status, contract status, semantic status, local testability, productive
availability, availability evidence, dependency class, and blocking effect. A capability with
`PRODUCTIVE_AVAILABILITY = NO` and class `REQUIRED_FOR_LOCAL_EXECUTION` or
`REQUIRED_FOR_LOCAL_CLOSURE` is `BLOCKED_BY_UPSTREAM_CONTRACT`; it is acceptable
only when the DAG and unit state represent that blocker, and never when the
unit is `READY`. A fixture/mock/in-memory repository proves local testability
only.
Confirm any applicable `TEMPORAL_AUTHORITY_PROOF` is cited and not invented by
the plan.

Keep the distinction explicit: `AUTHORITY_STATUS = UNDEFINED` is an upstream
authority blocker; `CONTRACT_STATUS = UNDEFINED` or
`PRODUCTIVE_AVAILABILITY = NO` for a local-execution/local-closure dependency
maps to `AUTHORITY_CONSUMPTION_GAP`/`BLOCKED_BY_UPSTREAM_CONTRACT`. A capability
needed only for integrated proof or information does not block local work.
None may be silently converted into an implementation decision.

Reconcile the complete upstream availability record mechanically. A downstream
claim of `PRODUCTIVE_AVAILABILITY = YES` requires the complete
`NO_DOWNSTREAM_CAPABILITY_PROMOTION_WITHOUT_NEW_EVIDENCE` record; without it,
emit `DOWNSTREAM_PROMOTION_WITHOUT_NEW_EVIDENCE` and fail the plan gate.

## 8. Reconstruct validated Gap inventory

Read the validated Gap Matrix independently.

For every active Gap capture:

```text
Gap ID
Affected Requirement IDs
Portfolio Obligation IDs
Classification
Gap Category
Severity
Local Owner
Planning Type
Exact Delta
Foreign Dependencies
Acceptance Obligations
```

Also identify:

```text
FOREIGN_DEPENDENCY_ONLY
NO_LOCAL_WORK
ALREADY_SATISFIED
```

where applicable.

## 9. Reconstruct Implementation Unit inventory

For every unit capture:

```text
Unit ID
Title
Goal
Portfolio Obligations
Requirement IDs
Gap IDs
Unit Formation Reason
Ownership
Required Behavior
Does Not Implement
Repository Evidence
Expected Repository Impact
Implementation Constraints
Internal Prerequisites
Cross-Spec Prerequisites
Acceptance Criteria
Local Closure
Required Tests
Legacy/Cutover Impact
Completion Evidence
Issue Decomposition Readiness
Initial DAG State
Blocked By
```

Every Unit ID must be unique.

Every unit inventory also includes:

```text
CAPABILITY_AVAILABILITY_RECORDS
WORK_CAN_START
LOCAL_CLOSURE
SHARED_CLOSURE_BOUNDARY
ACCEPTANCE_WITNESS_MATRIX
```

## 10. ADR → Portfolio → Requirement → Gap → Unit traceability audit

For every Implementation Unit independently prove:

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
```

Classify:

```text
TRACEABILITY_CONFIRMED
PORTFOLIO_OBLIGATION_MISSING
REQUIREMENT_BACKING_MISSING
GAP_BACKING_MISSING
SPECULATIVE_SUPPORTING_WORK
AUTHORITY_TRACEABILITY_INVALID
```

Supporting work must have an explicit validated planning justification.

## 11. Gap → Plan coverage audit

For every validated local Gap determine:

```text
FULLY_COVERED
PARTIALLY_COVERED
MIS_COVERED
UNCOVERED
FOREIGN_DEPENDENCY_CORRECTLY_EXCLUDED
NO_LOCAL_WORK_CORRECTLY_EXCLUDED
```

`FULLY_COVERED` requires the plan to address:

* complete local delta;
* required integration;
* contradictory path retirement where local;
* tests;
* migration/cutover where local;
* completion evidence.

A Gap ID merely appearing in text is insufficient.

Target:

```text
UNCOVERED_LOCAL_GAPS = 0
```

## 12. Plan → Gap / supporting-work audit

For every Implementation Unit verify exactly one:

```text
VALIDATED_GAP_BACKING = YES
```

or:

```text
REQUIRED_SUPPORTING_WORK = YES
```

Classify:

```text
JUSTIFIED
OVERBROAD
SPECULATIVE
DUPLICATIVE
WRONG_OWNER
```

Supporting work may include integration evidence, required migration,
conformance evidence, compatibility proof, or necessary local scaffolding.

It must not be speculative feature work.

## 13. Portfolio ownership audit

For every unit compare:

```text
PORTFOLIO_APPROVED_OWNER
PLAN_CLAIMED_OWNER
PLANNED_IMPLEMENTATION_ROLE
```

Verify foreign lifecycle remains foreign.

Detect:

```text
OWNERSHIP_LEAKAGE
FOREIGN_CAPABILITY_DUPLICATED
WRONG_LOCAL_OWNER
CANONICAL_AUTHORITY_DUPLICATED
MISSING_OWNER_REFERENCE
```

A consumer may implement local integration.

It may not absorb foreign canonical semantics.

## 14. Normative dependency audit

Use the approved portfolio dependency graph.

For every Plan dependency classify:

```text
APPROVED_NORMATIVE_DEPENDENCY
VALID_IMPLEMENTATION_DEPENDENCY
VALID_CROSS_SPEC_PREREQUISITE
UNAPPROVED_NORMATIVE_DEPENDENCY
MISSING_PORTFOLIO_DEPENDENCY
WRONG_NORMATIVE_DIRECTION
IMPLEMENTATION_DEPENDENCY_MISREPRESENTED_AS_NORMATIVE
```

Required target:

```text
UNAPPROVED_NORMATIVE_DEPENDENCIES = 0
```

## 15. Cross-Spec dependency audit

For every cross-spec dependency verify:

```text
Portfolio owner
Foreign requirement
Local consumer unit
Required contract
Foreign implementation state
Blocking status
```

Classify:

```text
CONFIRMED
WRONG_OWNER
WRONG_DIRECTION
MISSING_DEPENDENCY
FALSE_BLOCKER
HIDDEN_BLOCKER
PREEXISTING_CAPABILITY_CONFIRMED
PREEXISTING_CAPABILITY_NOT_PROVEN
```

A missing foreign implementation may block a Unit's execution.

It does not automatically make the Implementation Plan non-conformant if the
dependency is explicit and deterministic.

## 16. Implementation Unit formation audit

Every unit must state a valid formation reason:

```text
SHARED_AUTHORITY
SHARED_INVARIANT
SHARED_PERSISTENCE_BOUNDARY
SHARED_COMMAND_BOUNDARY
SHARED_INTEGRATION_SEAM
SHARED_CUTOVER
SHARED_CONFORMANCE
```

or an equally precise repository-approved equivalent.

Verify the reason matches actual work.

## 17. False Unit Split audit

Detect:

```text
FALSE_UNIT_SPLIT
```

when two or more units represent one indivisible implementation delta.

Indicators:

* same owner;
* same invariant;
* same persistence transaction;
* same closure condition;
* neither can independently close;
* split exists only for artificial parallelism.

Do not flag units merely because they touch similar files.

Target:

```text
FALSE_UNIT_SPLITS = 0
```

## 18. False Unit Merge audit

Detect:

```text
FALSE_UNIT_MERGE
```

when one unit combines materially independent work.

Indicators:

* different owners;
* independent dependencies;
* independent closure;
* unrelated failure semantics;
* independent cutover;
* different canonical paths;
* excessive audit radius.

Also compare `PRODUCTIVE_AVAILABILITY`, `EXTERNAL_BLOCKERS`,
`AUTHORITY_COMPLETENESS`, `CROSS_SPEC_PREREQUISITES`,
`LOCAL_CLOSURE_CONDITIONS`, and `COMPLETION_EVIDENCE_TIMING`. If these differ,
the plan must prove `SHARED_CLOSURE_BOUNDARY = YES`; otherwise classify
`FALSE_UNIT_MERGE`, even when units share authority, persistence boundary, or an
invariant. If one part is locally closable and another requires an unavailable
local-execution/local-closure capability, classify `FALSE_UNIT_MERGE`; split it
when authorized or retain the unit blocked. Do not defer the inconsistency to
ticket decomposition. Apply the shared `UNIT_MERGE_ALLOWED` predicate
mechanically.

Target:

```text
FALSE_UNIT_MERGES = 0
```

## 19. Unit completeness audit

Every unit must contain coherent:

```text
Goal
Authority and Ownership
Gap Matrix Coverage
Portfolio Obligation Coverage
Validated Delta
Required Behavior
Does Not Implement
Repository Evidence
Expected Repository Impact
Implementation Constraints
Dependencies
Acceptance Criteria
Local Closure
Required Tests
Legacy/Cutover Impact
Completion Evidence
Risks
Issue Decomposition Readiness
Initial DAG State
```

Classify:

```text
UNIT_COMPLETE
UNIT_INCOMPLETE
UNIT_AMBIGUOUS
UNIT_INTERNALLY_INCONSISTENT
```

## 20. Unit internal consistency audit

Evaluate together:

```text
Goal
    ↕
Required Behavior
    ↕
Does Not Implement
    ↕
Dependencies
    ↕
Acceptance Criteria
    ↕
Required Tests
    ↕
Completion Evidence
```

A unit may have every section and still be invalid.

## 21. Acceptance Criteria audit

For every local Acceptance Criterion independently determine:

```text
TESTABLE = YES | NO
LOCAL_PROVABILITY = YES | NO
```

For every row in the local `ACCEPTANCE_WITNESS_MATRIX`, independently verify
the required producer/capability, independent authority/contract/local-
testability/productive-availability dimensions, dependency class, evidence type,
and `WITNESS_EXECUTABLE_AT_LOCAL_CLOSURE`. A fixture can witness a local
contract only; it cannot witness durable, restart, physical-CAS, foreign
integration, productive recovery, or external-effect requirements.

Local proof may use only:

1. behavior implemented by this unit;
2. completed internal prerequisites;
3. confirmed preexisting foreign capabilities.

Detect:

```text
VAGUE
NON_TESTABLE
OVER_SPECIFIED
MISSING_NEGATIVE_CASE
NON_LOCAL_ACCEPTANCE
DOWNSTREAM_DEPENDENT_ACCEPTANCE
DOES_NOT_IMPLEMENT_CONTRADICTION
UNAVAILABLE_DEPENDENCY_ACCEPTANCE
```

Do not confuse testability with local provability.

## 22. Local Closure audit

For every unit determine:

```text
INDEPENDENTLY_IMPLEMENTABLE = YES | NO
LOCAL_CLOSURE = YES | NO
```

`LOCAL_CLOSURE = YES` requires:

* all local ACs have LOCAL_PROVABILITY=YES;
* required tests can execute when unit closes;
* Completion Evidence can exist at unit closure;
* no downstream unit needed;
* no excluded scope needed;
* no unavailable foreign capability classified
  `REQUIRED_FOR_LOCAL_EXECUTION` or `REQUIRED_FOR_LOCAL_CLOSURE` needed;
* unit can be independently audited.
* every capability classified `REQUIRED_FOR_LOCAL_CLOSURE` has
  `PRODUCTIVE_AVAILABILITY = YES` at closure;
* every local witness is executable at closure.

Detect:

```text
NON_LOCAL_ACCEPTANCE
DOWNSTREAM_DEPENDENT_ACCEPTANCE
DOES_NOT_IMPLEMENT_CONTRADICTION
COMPLETION_EVIDENCE_NOT_LOCALLY_PRODUCIBLE
REQUIRED_TEST_NOT_LOCALLY_EXECUTABLE
UNAVAILABLE_FOREIGN_CAPABILITY
FINAL_CONFORMANCE_MISALLOCATED
```

## 23. Issue Decomposition Readiness audit

Audit independently from DAG state:

```text
ISSUE_READY
INTERNAL_ONLY
PLAN_BLOCKED
```

`ISSUE_READY` requires:

```text
frozen semantics
valid backing
correct ownership
coherent scope
known dependencies
LOCAL_CLOSURE = YES
local acceptance provable
local completion evidence producible
no unresolved authority gap
```

Classify:

```text
ISSUE_READY_CONFIRMED
ISSUE_READY_OVERRATED
INTERNAL_ONLY_CONFIRMED
INTERNAL_ONLY_INCORRECT
PLAN_BLOCKED_CONFIRMED
PLAN_BLOCKER_MISSING
```

`ISSUE_READY_CONFIRMED` requires `LOCAL_CLOSURE = YES`, all local witness rows
with `WITNESS_EXECUTABLE_AT_LOCAL_CLOSURE = YES`, and every capability
classified `REQUIRED_FOR_LOCAL_EXECUTION` or `REQUIRED_FOR_LOCAL_CLOSURE` at
`PRODUCTIVE_AVAILABILITY = YES`. A unit that is startable but not locally
closable must be split or remain `PLAN_BLOCKED` before ticket decomposition.

## 24. Initial DAG State audit

Separately audit:

```text
READY
BLOCKED
```

`INITIAL_DAG_STATE = READY` is allowed only when the shared `EXECUTION_READY`
predicate is true. A known missing producer is an external blocker, not a later
wave detail.

A unit can validly be:

```text
ISSUE_READY
+
INITIAL_DAG_STATE = BLOCKED
```

Verify `BLOCKED_BY` is correct.

Detect:

```text
INITIAL_READY_INCORRECT
INITIAL_BLOCKED_INCORRECT
MISSING_BLOCKER_EDGE
FALSE_BLOCKER_EDGE
```

Do not treat operational dependency blocking as plan incompleteness.

## 25. Critical readiness distinction

Preserve:

```text
ISSUE_DECOMPOSITION_READINESS
!=
INITIAL_DAG_STATE
```

The first describes whether a future ticket can be safely generated.

The second describes whether it may execute immediately.

Any plan that conflates them has a planning defect.

## 26. Dependency DAG reconstruction

Reconstruct DAG independently.

Do not trust plan diagram.

Verify:

```text
all units included
all prerequisites exist
no cycles
correct semantic ordering
producer before consumer
replacement before destructive retirement
identity/mapping before migration
contributors before final proof owner
```

Report:

```text
DAG_CYCLE_DETECTED
MISSING_EDGES
UNNECESSARY_EDGES
WRONG_EDGE_DIRECTION
HIDDEN_DEPENDENCIES
FALSE_SERIALIZATION
DOWNSTREAM_ACCEPTANCE_DEPENDENCY
```

## 27. DAG local-closure invariant

For every edge:

```text
IMP-A → IMP-B
```

verify:

```text
IMP-A local closure does not require IMP-B behavior
```

If it does:

```text
DOWNSTREAM_ACCEPTANCE_DEPENDENCY
```

or equivalent closure finding.

## 28. Parallelization audit

For every proposed Wave independently inspect:

* DAG dependencies;
* shared contracts;
* shared files;
* shared schemas/migrations;
* shared identities;
* generated contracts;
* common integration seams;
* semantic collision risk.

Classify:

```text
SAFE
SAFE_WITH_COORDINATION
SERIAL_REQUIRED
INVALID_PARALLELIZATION
```

Flag when plan claims SAFE but audit proves otherwise.

## 29. Integration checkpoint audit

For every checkpoint verify:

```text
Required units
Integrated behavior
Required evidence
Unlocked downstream units
```

Classify:

```text
CHECKPOINT_VALID
CHECKPOINT_INCOMPLETE
CHECKPOINT_REDUNDANT
CHECKPOINT_MISSING
CHECKPOINT_PROOF_MISALLOCATED
```

Checkpoint-level proof must not be required for an earlier unit's local
closure.

## 30. Acceptance obligation reconstruction

Independently reconstruct all normative Acceptance IDs from the conformant
component SPEC.

For each capture:

```text
Acceptance ID
Requirements
Portfolio Obligations
Current implementation status
Affected by plan?
```

No acceptance obligation may disappear.

## 31. Acceptance → Plan traceability audit

For every acceptance obligation compare:

```text
Contributing Units
Final Proof Owner
Local Evidence
Final Evidence
```

Classify coverage:

```text
DIRECTLY_PLANNED
ALREADY_SATISFIED_CONFIRMED
PARTIALLY_PLANNED
INCORRECTLY_MAPPED
UNCOVERED
```

## 32. Contribution versus proof audit

Preserve:

```text
CONTRIBUTING_UNIT
!=
LOCAL_ACCEPTANCE_OWNER
!=
FINAL_PROOF_OWNER
```

A unit may contribute without owning complete acceptance.

Detect:

```text
CONTRIBUTION_MISCLASSIFIED_AS_LOCAL_ACCEPTANCE
```

## 33. Final Proof Owner audit

Every affected multi-unit acceptance obligation must have exactly one:

```text
FINAL_PROOF_OWNER
```

Allowed:

```text
<UNIT-ID>
ALREADY_SATISFIED
```

`UNRESOLVED` is not conformant.

Verify selected owner:

* runs after all contributors;
* has access to required evidence;
* can prove complete normative obligation;
* does not depend on future work.

Detect:

```text
FINAL_PROOF_OWNER_MISSING
FINAL_PROOF_OWNER_INVALID
FINAL_PROOF_PREMATURE
```

## 34. Synthetic final-proof unit audit

Detect:

```text
SYNTHETIC_FINAL_PROOF_UNIT
```

when a unit exists only to hold a Final Proof Owner label without meaningful
integration, conformance, cutover, migration validation, or cross-unit
evidence aggregation.

A dedicated final-conformance unit is valid only when real work exists.

## 35. Failure ownership planning audit

For validated failure-related gaps verify plan preserves:

```text
CANONICAL_FAILURE_OWNER
LOCAL_COMPONENT_ROLE
```

Detect:

```text
FAILURE_OWNER_LEAKAGE
FAILURE_MAPPING_REDEFINED
FOREIGN_FAILURE_IMPLEMENTED_LOCALLY
```

## 36. Compatibility/cutover planning audit

For:

```text
NEW_CANONICAL_PATH
LEGACY_COMPATIBILITY
HISTORICAL_REPLAY
CUTOVER
RETIREMENT
```

verify plan allocates only locally owned work.

Detect:

```text
WRONG_COMPATIBILITY_OWNER
DUAL_AUTHORITY_RISK
LEGACY_WRITES_NOT_RETIRED
LEGACY_READS_NOT_PRESERVED
MIGRATION_SEMANTICS_MISSING
CUTOVER_PROOF_MISALLOCATED
```

## 37. Legacy / Authority Transition audit

When relevant, independently audit:

| Current Path | Target Authority | Read Behavior | Write Behavior | Migration/Mapping | Owning Unit |
| ------------ | ---------------- | ------------- | -------------- | ----------------- | ----------- |

Verify old productive authority does not remain active indefinitely where
prohibited.

## 38. Concurrency / idempotency / recovery audit

Identify every normative requirement involving:

* uniqueness;
* stale rejection;
* compare-and-set;
* idempotency;
* atomicity;
* durable handoff;
* retries;
* recovery;
* resume;
* immutable freeze.

Verify plan includes correct implementation work and proof at the correct DAG
stage.

Classify:

```text
FULLY_REPRESENTED
PARTIALLY_REPRESENTED
MISSING_FROM_PLAN
PROOF_MISALLOCATED
```

Do not prescribe technical mechanism.

## 39. Test Strategy audit

Verify coverage of:

```text
unit/domain invariant
persistence
application
integration
cross-spec
concurrency
stale behavior
idempotency
recovery
migration
compatibility
regression
conformance
negative cases
```

Distinguish:

```text
LOCAL_TEST_EVIDENCE
INTEGRATION_TEST_EVIDENCE
FINAL_CONFORMANCE_EVIDENCE
```

Classify:

```text
TEST_STRATEGY_COMPLETE
TEST_STRATEGY_PARTIAL
CRITICAL_TEST_GAP
TEST_PROOF_MISALLOCATED
```

## 40. Local test executability audit

Tests owned by a unit must be executable when that unit closes.

If a local test requires downstream behavior:

```text
REQUIRED_TEST_NOT_LOCALLY_EXECUTABLE
```

Do not make early units depend on future integrated tests.

## 41. Completion Evidence audit

For every unit independently determine whether Completion Evidence is:

```text
AUDITABLE
PARTIALLY_AUDITABLE
CLAIM_BASED
INSUFFICIENT
NOT_LOCALLY_PRODUCIBLE
```

Evidence must be producible at local closure.

Developer claims are not completion evidence.

## 42. Expected Repository Impact audit

Verify planned repository impact is supported by repository evidence.

The plan may identify likely affected files/modules.

It must not turn them into unsupported normative design.

Detect:

```text
IMPACT_UNSUPPORTED
IMPACT_OVERBROAD
IMPLEMENTATION_DESIGN_OVERFREEZE
```

## 43. Reuse strategy audit

Audit:

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

Detect:

```text
REUSE_OVERSTATED
REUSE_UNDERSTATED
REPLACEMENT_NOT_REQUIRED
CONTRADICTION_NOT_RETIRED
NEW_CAPABILITY_ALREADY_EXISTS
DUPLICATE_IMPLEMENTATION_RISK
```

## 44. Unit granularity audit

Classify every unit:

```text
GRANULARITY_APPROPRIATE
UNIT_TOO_LARGE
UNIT_TOO_SMALL
```

Use false split/merge analysis for planning-significant defects.

Do not classify a unit as too small merely because it contributes to a later
acceptance obligation.

## 45. Plan metrics audit

Independently recalculate:

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

IDENTITY_AUTHORITY_GAPS
RECONSTRUCTION_AUTHORITY_GAPS
LIFECYCLE_AUTHORITY_GAPS
PERSISTENCE_SEMANTICS_GAPS
CROSS_SPEC_AUTHORITY_GAPS
SPEC_IMPLEMENTABILITY_CHECK
IMPLEMENTATION_UNIT_AUTHORITY_CHECK
AGGREGATE_IDENTITY_PROOF
AGGREGATE_RECONSTRUCTION_PROOF
REHYDRATION_AUTHORITY_GAPS
UNITS_INVENTING_IDENTITY
UNITS_INVENTING_LIFECYCLE
UNITS_INVENTING_PROVENANCE
UNITS_INVENTING_OWNERSHIP
UNITS_INVENTING_RECOVERY
UNITS_INVENTING_PERSISTENCE_SEMANTICS
AUTHORITY_CONSUMPTION_GAPS
BLOCKED_BY_UPSTREAM_CONTRACT
UNREPRESENTED_UPSTREAM_CONTRACT_BLOCKERS
READY_UNITS_WITH_UNAVAILABLE_CONTRACT
CAPABILITY_AVAILABILITY_CLASSIFICATION_ERRORS
DOWNSTREAM_PROMOTION_WITHOUT_NEW_EVIDENCE
LOCAL_CLOSURE_WITH_UNAVAILABLE_REQUIRED_CAPABILITY
WITNESSES_NOT_EXECUTABLE_AT_LOCAL_CLOSURE
TEMPORAL_AUTHORITY_GAPS

DAG_CYCLE_DETECTED
```

Do not trust Plan-reported counts.

## 46. Mechanical plan invariants

Conformant plan requires:

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

## 47. Audit dimensions

Report each as:

```text
PASS
FAIL
BLOCKED
```

for:

```text
AUTHORITY_CONFORMANCE
AUTHORITY_CONSUMPTION_CONFORMANCE
GAP_TO_PLAN_COVERAGE
UNIT_JUSTIFICATION
UNIT_GRANULARITY
OWNERSHIP_CONFORMANCE
DEPENDENCY_CONFORMANCE
LOCAL_CLOSURE_CONFORMANCE
ACCEPTANCE_ALLOCATION
FINAL_PROOF_OWNERSHIP
TEST_STRATEGY
LEGACY_CUTOVER
DAG_CONFORMANCE
PARALLELIZATION_SAFETY
METRIC_ACCURACY
ISSUE_DECOMPOSITION_READINESS
```

Overall conformance requires every material dimension to PASS.

## 48. Finding IDs

Use:

```text
CIPA-CRITICAL-###
CIPA-MAJOR-###
CIPA-MINOR-###
CIPA-INFO-###
```

## 49. Finding severity

### CRITICAL

Examples:

* ownership transfer;
* duplicate canonical authority;
* wrong lifecycle owner;
* destructive cutover before replacement;
* validated local Gap completely omitted in a way that could falsely produce
  completion;
* unapproved normative dependency that changes architectural direction.

### MAJOR

Examples:

* partial Gap coverage;
* hidden blocker;
* false unit split/merge;
* unsafe DAG;
* false ISSUE_READY;
* LOCAL_CLOSURE=NO for ISSUE_READY;
* local AC requires downstream behavior;
* Does Not Implement contradiction;
* missing final proof owner;
* premature final proof owner;
* critical test gap;
* unsupported foreign capability dependency;
* legacy contradiction not retired.

### MINOR

Localized traceability, metric, proof allocation, clarity or auditability defect
that does not materially invalidate plan semantics.

### INFO

Non-blocking observation.

## 50. Planning-impact classification

For every finding classify:

```text
ISSUE_DECOMPOSITION_BLOCKING
NON_BLOCKING
```

A finding is blocking when it may cause downstream ticket decomposition to:

* omit work;
* create speculative work;
* assign wrong owner;
* create wrong dependency;
* create non-closable ticket;
* make local acceptance depend on downstream work;
* lose acceptance proof ownership;
* fragment or merge work incorrectly;
* create unsafe parallel execution.

## 51. Required finding format

Every CRITICAL, MAJOR and MINOR finding must contain:

```text
## <ID> — <title>

Severity:
Issue decomposition impact:
Category:

### Authority
ADR:
Portfolio Obligation:
Component Requirement:
Gap:
Approved Owner:

### Plan location
Unit:
Section:

### Plan claim

### Independent audit result

### Repository evidence

### Problem

### Local Closure impact

### Acceptance / Proof Ownership impact

### DAG / Dependency impact

### Why this matters for ticket decomposition

### Minimum plan correction required

### Revalidation
```

Do not prescribe implementation code.

## 52. Allowed remediation types

Use:

```text
ADD_GAP_COVERAGE
REMOVE_SPECULATIVE_UNIT
NARROW_OVERBROAD_UNIT
MERGE_FALSE_SPLIT_UNITS
SPLIT_FALSE_MERGED_UNIT
RESTORE_PORTFOLIO_OWNERSHIP
CORRECT_DEPENDENCY
CORRECT_DAG_STATE
CORRECT_ISSUE_DECOMPOSITION_READINESS
CLARIFY_LOCAL_ACCEPTANCE
REMOVE_DOWNSTREAM_ACCEPTANCE_DEPENDENCY
RESTORE_DOES_NOT_IMPLEMENT_BOUNDARY
CORRECT_COMPLETION_EVIDENCE
CORRECT_TEST_ALLOCATION
CORRECT_ACCEPTANCE_TRACEABILITY
ASSIGN_FINAL_PROOF_OWNER
CORRECT_FINAL_PROOF_OWNER
REMOVE_SYNTHETIC_FINAL_PROOF_UNIT
CORRECT_LEGACY_CUTOVER
CORRECT_FAILURE_OWNERSHIP
CORRECT_METRICS
UPSTREAM_REVALIDATION_REQUIRED
SPEC_REMEDIATION_REQUIRED
PORTFOLIO_REMEDIATION_REQUIRED
```

Report only.

Do not remediate.

## 53. Audit verdicts

Use exactly one:

```text
IMPLEMENTATION_PLAN_CONFORMANT
IMPLEMENTATION_PLAN_REMEDIATION_REQUIRED
IMPLEMENTATION_PLAN_AUDIT_BLOCKED
IMPLEMENTATION_PLAN_BLOCKED_BY_UPSTREAM_AUTHORITY
```

Every verdict also carries the shared baseline fields and
`BASELINE_REASSESSMENT_PROOF` when drift is present. A blocked verdict is
reserved for incomplete/indeterminate reassessment or another authority
blocker, not for assessed actionable drift.

## 54. IMPLEMENTATION_PLAN_CONFORMANT

Use only when:

```text
CRITICAL_FINDINGS = 0
MAJOR_FINDINGS = 0

GAPS_WITHOUT_PLAN_COVERAGE = 0
UNITS_WITHOUT_GAP_OR_SUPPORTING_AUTHORITY = 0

FALSE_UNIT_SPLITS = 0
FALSE_UNIT_MERGES = 0

OWNERSHIP_ERRORS = 0
UNAPPROVED_NORMATIVE_DEPENDENCIES = 0

ISSUE_READY_WITH_LOCAL_CLOSURE_NO = 0
LOCAL_AC_REQUIRING_DOWNSTREAM = 0
LOCAL_AC_CONTRADICTING_DOES_NOT_IMPLEMENT = 0
LOCAL_AC_REQUIRING_UNAVAILABLE_FOREIGN_CAPABILITY = 0

UNRESOLVED_FINAL_PROOF_OWNERS = 0
FINAL_PROOF_PREMATURE = 0

CRITICAL_TEST_GAPS = 0

DAG_CYCLE_DETECTED = NO
HIDDEN_BLOCKING_DEPENDENCIES = 0

SPECIFICATION_GAPS = 0
ARCHITECTURE_GAPS = 0
PORTFOLIO_GAPS = 0
UPSTREAM_CONTRACT_GAPS = 0
IDENTITY_AUTHORITY_GAPS = 0
RECONSTRUCTION_AUTHORITY_GAPS = 0
LIFECYCLE_AUTHORITY_GAPS = 0
PERSISTENCE_SEMANTICS_GAPS = 0
CROSS_SPEC_AUTHORITY_GAPS = 0
SPEC_IMPLEMENTABILITY_CHECK = PASS
IMPLEMENTATION_UNIT_AUTHORITY_CHECK = PASS
REHYDRATION_AUTHORITY_GAPS = 0
UNREPRESENTED_UPSTREAM_CONTRACT_BLOCKERS = 0
READY_UNITS_WITH_UNAVAILABLE_CONTRACT = 0
TEMPORAL_AUTHORITY_GAPS = 0
UNITS_INVENTING_IDENTITY = 0
UNITS_INVENTING_LIFECYCLE = 0
UNITS_INVENTING_PROVENANCE = 0
UNITS_INVENTING_OWNERSHIP = 0
UNITS_INVENTING_RECOVERY = 0
UNITS_INVENTING_PERSISTENCE_SEMANTICS = 0
```

Minor non-blocking findings may exist.

Prefer zero.

## 55. IMPLEMENTATION_PLAN_REMEDIATION_REQUIRED

Use when the plan is structurally useful but contains correctable defects.

Use `IMPLEMENTATION_PLAN_BLOCKED_BY_UPSTREAM_AUTHORITY` when the plan or its
inputs lack a current complete authority proof. A unit that invents a
normative decision is not a correctable implementation task.

Examples:

* false unit split;
* false unit merge;
* Gap coverage incomplete;
* ownership row wrong;
* dependency allocation wrong;
* local acceptance not provable;
* issue decomposition readiness overstated;
* initial DAG state wrong;
* final proof owner invalid;
* metrics inconsistent.

## 56. IMPLEMENTATION_PLAN_AUDIT_BLOCKED

Use only when meaningful audit is impossible because upstream authority or
validated planning baseline is invalid.

Examples:

```text
PORTFOLIO_NOT_APPROVED
COMPONENT_SPEC_NOT_CONFORMANT
GAP_MATRIX_NOT_VALIDATED
UPSTREAM_SPEC_NOT_CONFORMANT
BLOCKED_INSUFFICIENT_REASSESSMENT
STALE_AUDIT_BASIS
GAP_MATRIX_REVALIDATION_REQUIRED
```

Do not use BLOCKED for ordinary plan defects.

## 57. Issue decomposition gate

Report exactly:

```text
READY_FOR_ISSUE_DECOMPOSITION
```

or:

```text
NOT_READY_FOR_ISSUE_DECOMPOSITION
```

`READY_FOR_ISSUE_DECOMPOSITION` requires:

```text
VERDICT = IMPLEMENTATION_PLAN_CONFORMANT
```

and all ticket-shaping invariants pass.

## 58. Runtime-blocked units do not block decomposition

A conformant Plan may contain:

```text
ISSUE_READY
+
INITIAL_DAG_STATE = BLOCKED
```

This does not prevent:

```text
READY_FOR_ISSUE_DECOMPOSITION
```

when blocking prerequisites are known and explicit.

The downstream ticket should simply be born BLOCKED.

## 59. PLAN_BLOCKED units

A plan containing:

```text
Issue Decomposition Readiness = PLAN_BLOCKED
```

must normally not be ready for full issue decomposition if the blocked unit is
required for local Gap coverage.

Do not confuse this with:

```text
Initial DAG State = BLOCKED
```

## 60. Required audit artifact

Create:

```text
docs/specs/implementation-plans/audits/
<SPEC-ID>-implementation-plan-audit.md
```

or repository-equivalent convention.

Required sections:

```text
1. Audit Verdict
2. Audit Mode
3. Canonical Subject
4. Baseline Validation
5. Authority Reconstruction
6. Validated Gap Inventory
7. Implementation Unit Inventory
8. ADR / Portfolio / Requirement / Gap / Unit Traceability
9. Gap → Plan Coverage Audit
10. Plan → Gap / Supporting Work Audit
11. Portfolio Ownership Audit
12. Normative Dependency Audit
13. Cross-Spec Dependency Audit
14. Unit Formation / Granularity Audit
15. False Unit Split / Merge Audit
16. Unit Completeness Audit
17. Acceptance Criteria Audit
18. Local Closure Audit
19. Issue Decomposition Readiness Audit
20. Initial DAG State Audit
21. Dependency DAG Audit
22. Parallelization Audit
23. Integration Checkpoint Audit
24. Acceptance / Final Proof Ownership Audit
25. Failure Ownership Audit
26. Legacy / Compatibility / Cutover Audit
27. Concurrency / Idempotency / Recovery Audit
28. Test Strategy Audit
29. Completion Evidence Audit
30. Repository Evidence / Reuse Audit
31. Metrics Recalculation
32. Findings
33. Upstream Escalations
34. Issue Decomposition Gate
35. Closure Metrics
36. Completeness Proof
```

## 61. Completion metrics

Report:

```text
VALIDATED_GAPS
AUDITED_GAPS
FULLY_COVERED_GAPS
PARTIALLY_COVERED_GAPS
UNCOVERED_GAPS

IMPLEMENTATION_UNITS
JUSTIFIED_UNITS
SPECULATIVE_UNITS

PORTFOLIO_OBLIGATIONS_PLANNED
UNITS_WITHOUT_GAP_OR_SUPPORTING_AUTHORITY

FALSE_UNIT_SPLITS
FALSE_UNIT_MERGES

LOCALLY_CLOSABLE_UNITS
NON_LOCALLY_CLOSABLE_UNITS

ISSUE_DECOMPOSITION_READY_UNITS
ISSUE_READY_OVERRATED
INTERNAL_ONLY_UNITS
PLAN_BLOCKED_UNITS

INITIAL_READY_UNITS
INITIAL_BLOCKED_UNITS
INITIAL_DAG_STATE_ERRORS

LOCAL_PROVABILITY_FAILURES
LOCAL_AC_REQUIRING_DOWNSTREAM
LOCAL_AC_CONTRADICTING_DOES_NOT_IMPLEMENT
LOCAL_AC_REQUIRING_UNAVAILABLE_FOREIGN_CAPABILITY

NON_LOCAL_COMPLETION_EVIDENCE

ACCEPTANCE_OBLIGATIONS
ACCEPTANCE_WITH_FINAL_PROOF_OWNER
UNRESOLVED_FINAL_PROOF_OWNERS
FINAL_PROOF_PREMATURE
SYNTHETIC_FINAL_PROOF_UNITS

OWNERSHIP_ERRORS
UNAPPROVED_NORMATIVE_DEPENDENCIES
HIDDEN_BLOCKERS

UNSAFE_PARALLEL_RELATIONSHIPS
DAG_CYCLE_DETECTED

CRITICAL_TEST_GAPS

SPECIFICATION_GAPS
ARCHITECTURE_GAPS
PORTFOLIO_GAPS
UPSTREAM_CONTRACT_GAPS

CRITICAL_FINDINGS
MAJOR_FINDINGS
MINOR_FINDINGS
INFO_FINDINGS

ISSUE_DECOMPOSITION_BLOCKING_FINDINGS
```

## 62. Mandatory checks

Report each:

```text
PASS
FAIL
BLOCKED
NOT_APPLICABLE
```

Checks:

```text
CHECK-01 Portfolio baseline is approved.
CHECK-02 Component SPEC is conformant.
CHECK-03 Gap Matrix is conformant and planning-ready.
CHECK-04 Upstream SPEC contracts are conformant.
CHECK-05 Baselines remain valid.
CHECK-06 Every validated local Gap is covered.
CHECK-07 No speculative Implementation Unit exists.
CHECK-08 ADR → Portfolio → Requirement → Gap → Unit traceability is complete.
CHECK-09 Portfolio ownership is preserved.
CHECK-10 Normative dependency direction matches portfolio.
CHECK-11 No unapproved normative dependency exists.
CHECK-12 Cross-spec dependencies are explicit.
CHECK-13 No foreign capability is duplicated locally.
CHECK-14 No false Unit Split exists.
CHECK-15 No false Unit Merge exists.
CHECK-16 Every unit is internally coherent.
CHECK-17 Every ISSUE_READY unit is locally closable.
CHECK-18 Every local AC is locally provable.
CHECK-19 No local AC requires downstream work.
CHECK-20 No local AC contradicts Does Not Implement.
CHECK-21 No local AC requires unavailable foreign capability.
CHECK-22 Completion Evidence is locally producible.
CHECK-23 Issue Decomposition Readiness is correct.
CHECK-24 Initial DAG State is correct.
CHECK-25 Readiness and DAG state are not conflated.
CHECK-26 Dependency DAG is semantically valid and acyclic.
CHECK-27 Parallelization is safe.
CHECK-28 Integration checkpoints are sufficient.
CHECK-29 Every affected acceptance obligation has one valid Final Proof Owner.
CHECK-30 No Final Proof Owner is premature.
CHECK-31 No synthetic final-proof unit exists without real work.
CHECK-32 Failure ownership is preserved.
CHECK-33 Compatibility/cutover ownership is preserved.
CHECK-34 Legacy authority transitions are complete where applicable.
CHECK-35 Concurrency/idempotency/recovery semantics are represented.
CHECK-36 Test strategy is complete at correct DAG stages.
CHECK-37 Metrics mechanically reconcile.
CHECK-38 No unresolved authority gap remains.
CHECK-39 Plan is safe for ticket/issue decomposition.
CHECK-40 Upstream SPEC_IMPLEMENTABILITY_CHECK remains PASS and current.
CHECK-41 Aggregate identity/reconstruction proofs remain complete.
CHECK-42 Lifecycle, persistence, and cross-SPEC authority remain complete.
CHECK-43 IMPLEMENTATION_UNIT_AUTHORITY_CHECK passes for every unit.
CHECK-44 No unit invents identity, lifecycle, provenance, ownership, recovery,
         persistence semantics, or missing domain rules.
```

## 63. Final console response

Use:

```text
COMPONENT_IMPLEMENTATION_PLAN_AUDIT_COMPLETE

SPEC: <SPEC-ID>
PORTFOLIO: <PORTFOLIO-ID>
PLAN: <path>
GAP_MATRIX: <path>

BASELINE_DRIFT_STATUS: <NO_DRIFT|DRIFT_UNASSESSED|DRIFT_ASSESSED>
REASSESSMENT_COMPLETE: <YES|NO>
FINDINGS_ARE_ACTIONABLE: <YES|NO>
BASELINE_REMEDIATION_READINESS: <READY|BLOCKED_INSUFFICIENT_REASSESSMENT>
AUDIT_BASIS_FINGERPRINT: <exact basis>
BASELINE_REASSESSMENT_PROOF: <path or inline section when drift exists>

DIMENSIONS:
- AUTHORITY_CONFORMANCE: <PASS|FAIL|BLOCKED>
- SPEC_IMPLEMENTABILITY_AUTHORITY: <PASS|FAIL|BLOCKED>
- AUTHORITY_CONSUMPTION_CONFORMANCE: <PASS|FAIL|BLOCKED>
- GAP_TO_PLAN_COVERAGE: <PASS|FAIL|BLOCKED>
- UNIT_JUSTIFICATION: <PASS|FAIL|BLOCKED>
- UNIT_GRANULARITY: <PASS|FAIL|BLOCKED>
- OWNERSHIP_CONFORMANCE: <PASS|FAIL|BLOCKED>
- DEPENDENCY_CONFORMANCE: <PASS|FAIL|BLOCKED>
- LOCAL_CLOSURE_CONFORMANCE: <PASS|FAIL|BLOCKED>
- ACCEPTANCE_ALLOCATION: <PASS|FAIL|BLOCKED>
- FINAL_PROOF_OWNERSHIP: <PASS|FAIL|BLOCKED>
- TEST_STRATEGY: <PASS|FAIL|BLOCKED>
- LEGACY_CUTOVER: <PASS|FAIL|BLOCKED>
- DAG_CONFORMANCE: <PASS|FAIL|BLOCKED>
- PARALLELIZATION_SAFETY: <PASS|FAIL|BLOCKED>
- METRIC_ACCURACY: <PASS|FAIL|BLOCKED>
- ISSUE_DECOMPOSITION_READINESS: <PASS|FAIL|BLOCKED>

GAPS:
- VALIDATED: <n>
- FULLY_COVERED: <n>
- PARTIAL: <n>
- UNCOVERED: <n>

UNITS:
- TOTAL: <n>
- JUSTIFIED: <n>
- SPECULATIVE: <n>
- FALSE_SPLITS: <n>
- FALSE_MERGES: <n>
- LOCALLY_CLOSABLE: <n>
- NON_LOCALLY_CLOSABLE: <n>

READINESS:
- ISSUE_READY: <n>
- ISSUE_READY_OVERRATED: <n>
- INTERNAL_ONLY: <n>
- PLAN_BLOCKED: <n>
- AUTHORITY_BLOCKED_UNITS: <n>
- UNITS_INVENTING_NORMATIVE_DECISIONS: <n>
- INITIAL_READY: <n>
- INITIAL_BLOCKED: <n>
- DAG_STATE_ERRORS: <n>

ACCEPTANCE:
- TOTAL: <n>
- WITH_FINAL_PROOF_OWNER: <n>
- UNRESOLVED_FINAL_PROOF_OWNER: <n>
- FINAL_PROOF_PREMATURE: <n>
- LOCAL_AC_REQUIRING_DOWNSTREAM: <n>
- LOCAL_AC_SCOPE_CONTRADICTIONS: <n>

DEPENDENCIES:
- OWNERSHIP_ERRORS: <n>
- UNAPPROVED_NORMATIVE: <n>
- HIDDEN_BLOCKERS: <n>
- DAG_CYCLE: YES|NO
- UNSAFE_PARALLEL_RELATIONSHIPS: <n>

FINDINGS:
- CRITICAL: <n>
- MAJOR: <n>
- MINOR: <n>
- INFO: <n>

VERDICT:
<IMPLEMENTATION_PLAN_CONFORMANT |
IMPLEMENTATION_PLAN_REMEDIATION_REQUIRED |
IMPLEMENTATION_PLAN_AUDIT_BLOCKED>

ISSUE_DECOMPOSITION_GATE:
<READY_FOR_ISSUE_DECOMPOSITION |
NOT_READY_FOR_ISSUE_DECOMPOSITION>

REPORT:
<path>
```

## 64. Prohibited shortcuts

Do not:

* trust plan metrics;
* trust claimed LOCAL_CLOSURE;
* trust claimed ISSUE_READY;
* trust Initial DAG State;
* infer ownership from repository structure;
* create or modify dependencies;
* redesign units while auditing;
* create tickets;
* remediate Plan;
* regenerate Gap Matrix;
* absorb foreign lifecycle locally;
* approve false unit split/merge;
* require downstream behavior for local closure;
* treat runtime BLOCKED as decomposition failure;
* treat ISSUE_READY as runtime READY;
* create synthetic final-proof work without real justification;
* accept Final Proof Owner before all contributors;
* move later scope earlier to fix closure;
* treat tests as authority;
* modify code.

## Core completion invariant

The audit is complete only when it can independently support:

> Every validated local implementation Gap is covered by one or more justified,
> authority-backed Implementation Units; every Unit traces through validated Gap,
> Component Requirement and Portfolio Obligation to accepted ADR authority; no
> foreign lifecycle or normative dependency has been reassigned locally; units
> are neither falsely split nor falsely merged; every ISSUE_READY unit is
> independently implementable and locally closable; every local Acceptance
> Criterion is locally provable without downstream work, unavailable foreign
> behavior or excluded scope; Completion Evidence is locally producible; Issue
> Decomposition Readiness is correctly separated from Initial DAG State; the DAG
> is semantically correct and acyclic; runtime-blocked units have explicit known
> prerequisites; multi-unit acceptance obligations have exactly one valid Final
> Proof Owner after all required contributors; failure, compatibility, legacy,
> cutover and recovery semantics preserve approved ownership; test evidence is
> allocated at the correct DAG stage; and no planning defect remains that would
> cause ticket decomposition to create speculative, incorrectly owned,
> non-closable or wrongly ordered implementation work.

When this invariant holds:

```text
IMPLEMENTATION_PLAN_CONFORMANT
READY_FOR_ISSUE_DECOMPOSITION
```
