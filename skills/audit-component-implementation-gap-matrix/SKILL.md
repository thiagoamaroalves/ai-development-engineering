---
name: audit-component-implementation-gap-matrix
description: >
  Independently audit a component Implementation Gap Matrix against accepted
  ADR authority, the approved SPEC portfolio decomposition, the conformant
  component SPEC, SPEC implementability authority, conformant upstream
  component SPECs, and the actual repository implementation. Verify normative
  requirement completeness, portfolio
  obligation traceability, implementation classifications, evidence quality,
  mixed ownership, failure semantic ownership, compatibility/cutover ownership,
  dependency treatment, gap grouping, exact deltas, severity, metrics, baseline
  validity, and Implementation Plan readiness. Operate read-only and
  adversarially. Do not modify ADRs, portfolio, SPECs, Gap Matrix, repository,
  tests, plans, tickets, or implementation.
---

# Audit Component Implementation Gap Matrix

Before evaluating baseline drift or selecting the verdict, read
`skills/_shared/baseline-drift-remediation-contract.md`. The audit and its
remediator share that contract; drift detection and reassessment completeness
are separate judgments.

## Purpose

Independently determine whether an existing component Implementation Gap Matrix
is a complete, accurate, evidence-backed and ownership-preserving
representation of the delta between:

```text
ACCEPTED ADR AUTHORITY
        +
APPROVED SPEC PORTFOLIO
        +
CONFORMANT COMPONENT SPEC
```

and:

```text
CURRENT REPOSITORY IMPLEMENTATION
```

This audit answers:

> Can an Implementation Planning agent safely use this Gap Matrix as the
> authoritative implementation-delta baseline without rediscovering
> requirements, ownership, repository behavior, or gap identity?

The auditor's job is not to agree with the matrix.

The auditor must actively attempt to falsify it.

## Operating mode

Operate in:

```text
READ_ONLY
INDEPENDENT
ADVERSARIAL
ADR_FIRST
PORTFOLIO_GOVERNED
SPEC_FIRST
IMPLEMENTATION_AWARE
EVIDENCE_REQUIRED
OWNERSHIP_PRESERVING
MATRIX_SKEPTICAL
NO_REMEDIATION
NO_IMPLEMENTATION_DESIGN
```

Do not modify:

* accepted ADRs;
* approved SPEC portfolio;
* component SPEC;
* upstream SPECs;
* Gap Matrix;
* prior audits;
* remediation reports;
* source code;
* tests;
* generated clients;
* schemas;
* migrations;
* configuration;
* Implementation Plans;
* tickets.

Only create the Gap Matrix audit artifact.

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
repository implementation
    >
tests
    >
Gap Matrix under audit
    >
prototype / historical evidence
```

Interpret authority as:

```text
ADR
    defines architecture

Portfolio
    defines WHO owns obligations

Component SPEC
    defines WHAT must be true

Repository
    defines WHAT is currently true

Gap Matrix
    claims the delta

Gap Matrix Audit
    independently proves or disproves that claimed delta
```

The Gap Matrix is never authority.

Read `../_shared/authority-completeness-gates.md`. The SPEC audit owns the
full authority proof. This audit must confirm that proof before auditing matrix
classifications and must never turn an authority absence into a planned
implementation delta.

Repository behavior is never architecture.

## 1. Required preconditions

### 1.1 Portfolio approval

Verify the latest portfolio decomposition verdict is:

```text
PORTFOLIO_DECOMPOSITION_APPROVED
```

Otherwise stop with:

```text
AUDIT_BLOCKED_PORTFOLIO_NOT_APPROVED
```

### 1.2 Component SPEC conformance

Verify the latest component SPEC audit verdict is:

```text
PASS — COMPONENT_SPEC_CONFORMANT
```

Otherwise stop with:

```text
AUDIT_BLOCKED_COMPONENT_SPEC_NOT_CONFORMANT
```

### 1.3 Upstream SPEC conformance

Every normative upstream dependency required by the target component must have a
conformant SPEC.

If not:

```text
AUDIT_BLOCKED_UPSTREAM_SPEC_NOT_CONFORMANT
```

Missing upstream implementation does not block the audit by itself.

Missing upstream normative authority does.

### 1.4 SPEC implementability authority gate

Require the latest target SPEC audit to contain:

```text
SPEC_IMPLEMENTABILITY_CHECK = PASS
AUTHORITY_NOT_DEFINED = 0
AGGREGATE_IDENTITY_PROOF
AGGREGATE_RECONSTRUCTION_PROOF, when applicable
LIFECYCLE_AUTHORITY_MATRIX, when applicable
PERSISTENCE_SEMANTICS_MATRIX, when applicable
CROSS_SPEC_AUTHORITY_MATRIX, when applicable
```

Confirm proof revision, applicability, and traceability. If any proof is
missing, failed, stale, contradictory, or reveals that the SPEC permits two
normatively different implementations, stop with:

```text
GAP_MATRIX_BLOCKED_BY_SPEC_AUTHORITY_GAP
```

This is a defensive handoff check; do not repeat the complete SPEC audit.

Reconcile the SPEC's `IMPLEMENTER_DECISION_CHECK` records for every critical
requirement. If any answer is `NO` or `UNKNOWN`, classify the smallest
authority root cause and block with `GAP_MATRIX_BLOCKED_BY_SPEC_AUTHORITY_GAP`;
do not turn the missing decision into an implementation Gap.

### 1.5 Authority consumption and temporal defense

For every external authority dependency, independently verify the matrix's
`AUTHORITY_CONSUMPTION_PROOF` and `PRODUCER_CONSUMER_CONTRACT_PROOF`. Confirm
truth owner, approved semantic source, productive port/query/reader, producer,
consumer, returned data, version/revision and failure semantics, availability
condition, and dependency edge. Record and audit independently:

```text
AUTHORITY_STATUS
CONTRACT_STATUS
LOCAL_TESTABILITY
PRODUCTIVE_AVAILABILITY
DEPENDENCY_CLASS
```

`AUTHORITY_STATUS = UNDEFINED` blocks with
`GAP_MATRIX_BLOCKED_BY_SPEC_AUTHORITY_GAP`. A missing contract or
`PRODUCTIVE_AVAILABILITY = NO` requires `AUTHORITY_CONSUMPTION_GAP` or
`BLOCKED_BY_UPSTREAM_CONTRACT` when the dependency class is
`REQUIRED_FOR_LOCAL_EXECUTION` or `REQUIRED_FOR_LOCAL_CLOSURE`; none may be
treated as `READY`. A fixture/mock/in-memory repository may set
`LOCAL_TESTABILITY = YES`, never `PRODUCTIVE_AVAILABILITY = YES`. A productive
availability promotion requires the complete
`NO_DOWNSTREAM_CAPABILITY_PROMOTION_WITHOUT_NEW_EVIDENCE` record and otherwise
is `DOWNSTREAM_PROMOTION_WITHOUT_NEW_EVIDENCE`.

Where a mutable authority is observed before an effect, verify
`TEMPORAL_AUTHORITY_PROOF`, including an independent second observation, drift
detection, fail-closed behavior, semantic validation ownership, and separation
from physical CAS/integrity. Flag self-comparison, reused snapshots, caller
trust, or CAS-only revalidation as a blocking `TEMPORAL_AUTHORITY_GAP`.
Run `CALLER_AS_AUTHORITY_CHECK` for lifecycle, eligibility, canonical revision,
status, current basis, ownership, approval, and domain state. Any bypass is a
blocking `CALLER_SUPPLIED_AUTHORITY_BYPASS`.

## 2. Required inputs

Identify independently:

* target component SPEC ID;
* target component SPEC path;
* component SPEC revision/status;
* component SPEC conformance audit;
* governing portfolio ID/revision;
* portfolio decomposition audit;
* accepted ADR authority;
* portfolio obligation registry;
* portfolio dependency registry;
* portfolio failure ownership registry;
* portfolio compatibility/cutover registry;
* conformant upstream component SPECs;
* Gap Matrix path;
* Gap Matrix generation baseline;
* repository commit SHA assessed by the matrix;
* current repository commit SHA;
* working-tree state.

## 3. Frozen baseline validation

Record:

```text
PORTFOLIO_BASELINE
COMPONENT_SPEC_BASELINE
UPSTREAM_SPEC_BASELINES
MATRIX_BASELINE
REPOSITORY_BASELINE
CURRENT_REPOSITORY_STATE
```

Compare the matrix's assessed baseline with current state.

Detect:

```text
PORTFOLIO_BASELINE_DRIFT
COMPONENT_SPEC_BASELINE_DRIFT
UPSTREAM_SPEC_BASELINE_DRIFT
REPOSITORY_BASELINE_DRIFT
```

If implementation-relevant drift makes classifications stale:

```text
BASELINE_DRIFT_REQUIRES_REASSESSMENT
```

Do not audit old classifications against a materially different repository
without explicitly treating them as stale. Continue the audit when the current
authority and repository can be compared. Reconstruct the affected inventory
against the current state and emit `BASELINE_REASSESSMENT_PROOF` as required by
the shared contract; do not turn a completed reassessment into an audit
blocker.

Set the shared state explicitly:

```text
BASELINE_DRIFT_STATUS = NO_DRIFT | DRIFT_UNASSESSED | DRIFT_ASSESSED
REASSESSMENT_COMPLETE = YES | NO
FINDINGS_ARE_ACTIONABLE = YES | NO
BASELINE_REMEDIATION_READINESS = READY | BLOCKED_INSUFFICIENT_REASSESSMENT
AUDIT_BASIS_FINGERPRINT = <authority revisions/digests + repository commit/content fingerprint>
```

When drift exists, persist this complete proof before selecting the verdict:

```text
BASELINE_REASSESSMENT_PROOF
OLD_AUTHORITY_BASELINE
CURRENT_AUTHORITY_BASELINE
OLD_REPOSITORY_BASELINE
CURRENT_REPOSITORY_BASELINE
AUTHORITY_DRIFT_CLASSIFICATION
REPOSITORY_DRIFT_CLASSIFICATION
REQUIREMENTS_PRESERVED
REQUIREMENTS_ADDED
REQUIREMENTS_REMOVED
GAPS_PRESERVED
GAPS_RECLASSIFIED
GAPS_OBSOLETE
GAPS_NEWLY_REQUIRED
DEPENDENCY_RECORDS_PRESERVED
DEPENDENCY_RECORDS_ADDED
DEPENDENCY_RECORDS_RECLASSIFIED
EVIDENCE_STALE
EVIDENCE_CURRENT
METRICS_BEFORE
METRICS_AFTER
REMEDIATION_SCOPE
REVALIDATION_CRITERIA
REASSESSMENT_COMPLETE = YES | NO
```

`DRIFT_UNASSESSED` is reserved for unavailable or indeterminate current
authority, source/repository baseline, affected classifications, preserved or
obsolete records, correction scope, or required evidence. If all required
comparisons and classifications are complete, set `DRIFT_ASSESSED` and
`REASSESSMENT_COMPLETE = YES`, even when the final audit verdict remains
`BASELINE_DRIFT_REQUIRES_REASSESSMENT`.

## 4. Independent normative requirement reconstruction

Read the complete conformant component SPEC independently.

Do not begin from the Gap Matrix inventory.

For each implementation-relevant normative requirement record:

```text
Requirement ID
Portfolio Obligation ID
ADR Authority
ADR Section
Ownership Role
Normative Statement
Expected Observable Behavior
Dependencies
Failure Semantics
Compatibility Role
```

Ownership role:

```text
CANONICAL_OWNER
CONSUMER
TRANSPORT_MAPPING
DERIVED_PROJECTION
OPERATIONAL_PROJECTION
LOCAL_COMPOSITION
```

Calculate:

```text
SPEC_NORMATIVE_REQUIREMENTS
MATRIX_NORMATIVE_REQUIREMENTS
MISSING_FROM_MATRIX
EXTRA_IN_MATRIX
DUPLICATED_IN_MATRIX
```

Required:

```text
MISSING_FROM_MATRIX = 0
DUPLICATED_IN_MATRIX = 0
```

Invented matrix requirements must be reported.

## 5. ADR → Portfolio → SPEC traceability audit

For every reconstructed requirement independently validate:

```text
ADR Decision
    →
Portfolio Obligation
    →
Approved Component Role
    →
Component Requirement
```

Classify:

```text
TRACEABILITY_CONFIRMED
PORTFOLIO_OBLIGATION_MISMATCH
OWNERSHIP_ROLE_MISMATCH
ADR_AUTHORITY_MISMATCH
SOURCE_SPEC_CONFORMANCE_DRIFT
IDENTITY_AUTHORITY_GAPS
RECONSTRUCTION_AUTHORITY_GAPS
REHYDRATION_AUTHORITY_GAPS
LIFECYCLE_AUTHORITY_GAPS
PERSISTENCE_SEMANTICS_GAPS
CROSS_SPEC_AUTHORITY_GAPS
SPEC_IMPLEMENTABILITY_CHECK
AUTHORITY_NOT_DEFINED
AUTHORITY_DEFINED_BUT_NOT_CONSUMABLE
AUTHORITY_CONSUMPTION_GAPS
BLOCKED_BY_UPSTREAM_CONTRACT
TEMPORAL_AUTHORITY_GAPS
CALLER_SUPPLIED_AUTHORITY_BYPASS
```

If the conformant source SPEC no longer aligns with the approved portfolio or
ADRs due to baseline drift, report it.

Do not repair upstream authority inside this audit.

## 6. Audit every matrix classification

Allowed primary classifications:

```text
IMPLEMENTED
PARTIAL
MISSING
CONTRADICTORY
NOT_APPLICABLE
OWNED_BY_OTHER_SPEC
UNVERIFIED
```

For every row determine:

```text
CLAIMED_CLASSIFICATION
AUDITED_CLASSIFICATION
AUDIT_RESULT
```

Audit result:

```text
CONFIRMED
RECLASSIFICATION_REQUIRED
INSUFFICIENT_EVIDENCE
OWNERSHIP_ERROR
BASELINE_INVALID
```

Never preserve the claimed classification merely because its evidence looks
plausible.

## 7. IMPLEMENTED claim audit

Every `IMPLEMENTED` row is a positive claim.

Independently inspect the actual behavior.

Where applicable verify:

* canonical authority;
* domain/application behavior;
* persistence;
* mutation guards;
* lifecycle;
* identity;
* concurrency;
* idempotency;
* recovery;
* external effects;
* API wiring;
* authorization;
* UI/OPS projections;
* compatibility;
* tests.

If only a subset is present:

```text
PARTIAL
```

If behavior violates authority:

```text
CONTRADICTORY
```

If evidence is genuinely insufficient:

```text
UNVERIFIED
```

Do not infer implementation from names.

## 8. PARTIAL claim audit

Verify:

1. some local normative behavior exists;
2. at least one local obligation is incomplete;
3. exact delta is valid;
4. foreign obligations were not absorbed into the local delta;
5. evidence-only limitations were not mislabeled as behavioral gaps.

A PARTIAL row without a precise observable delta is invalid.

## 9. MISSING claim audit

Actively try to falsify every MISSING claim.

Search:

* alternate modules;
* differently named symbols;
* legacy paths;
* adapters;
* generated paths;
* runtime wiring;
* persistence;
* tests;
* compatibility layers.

MISSING is valid only after reasonable investigation proves no sufficient
implementation of the selected component's local obligation.

## 10. CONTRADICTORY claim audit

For every claimed CONTRADICTORY row prove:

```text
OBSERVED
REQUIRED
CONTRADICTION
```

Also determine:

```text
CAN_MUTATE_CANONICAL_STATE?
ALTERNATE_PRODUCTIVE_PATH?
HISTORICAL_NON_CONFORMANCE_RISK?
WRONG_OWNER_IMPLEMENTATION?
```

Independently search for contradictions the matrix failed to report.

Do not let PARTIAL hide a true contradiction.

## 11. NOT_APPLICABLE audit

Verify the requirement legitimately has no implementation obligation in the
assessed scope.

Reject when it really means:

```text
deferred
missing
not found
planned later
owned but absent
```

Every NOT_APPLICABLE requires scope/authority justification.

## 12. OWNED_BY_OTHER_SPEC audit

Before confirming:

```text
OWNED_BY_OTHER_SPEC
```

prove:

```text
LOCAL_IMPLEMENTATION_OBLIGATION = NONE
```

Verify:

```text
FOREIGN_OWNER
FOREIGN_REQUIREMENT
LOCAL_CONSUMER_EXPECTATION
LOCAL_INTEGRATION_OBLIGATION
```

Detect:

```text
FALSE_FOREIGN_OWNERSHIP
HIDDEN_LOCAL_INTEGRATION_GAP
```

A mixed-ownership requirement must not be classified wholly foreign.

## 13. Mixed-ownership audit

For every mixed requirement independently reconstruct:

```text
LOCAL_OBLIGATION
FOREIGN_OBLIGATION
FOREIGN_OWNER
LOCAL_INTEGRATION_EXPECTATION
```

Validate that the primary classification reflects the selected component's local
obligation.

The foreign implementation state may be recorded separately.

Do not turn foreign missing implementation into local MISSING unless local
integration itself fails.

## 14. Portfolio ownership audit

Compare:

```text
PORTFOLIO_APPROVED_OWNER
vs
MATRIX_OWNER
vs
REPOSITORY_ACTUAL_AUTHORITY
```

Classify:

```text
OWNERSHIP_CONFORMANT
IMPLEMENTATION_LOCATION_CONCERN
WRONG_OWNER_IMPLEMENTATION
ALTERNATE_AUTHORITY_PRESENT
UNVERIFIED
```

Detect:

```text
PORTFOLIO_OWNERSHIP_VIOLATION
OWNERSHIP_FALSE_POSITIVE
OWNERSHIP_FALSE_NEGATIVE
```

### Implementation location concern

Use only when semantics remain correct and canonical authority is preserved.

### Wrong-owner implementation

Use when another component actually owns/mutates canonical behavior.

This normally requires:

```text
AUDITED_CLASSIFICATION = CONTRADICTORY
```

## 15. Failure ownership audit

Use the approved portfolio failure registry.

For every relevant failure compare:

```text
Failure
Portfolio Semantic Owner
Component Role
Matrix Treatment
Repository Semantic Owner
Audit Result
```

Audit result:

```text
SATISFIED
PARTIAL
MISSING
WRONG_OWNER
SEMANTICALLY_CONTRADICTORY
UNVERIFIED
```

Verify transport/UI/log mappings do not alter:

* trigger;
* canonical meaning;
* retryability;
* terminality;
* recovery;
* state implication.

Detect:

```text
WRONG_FAILURE_OWNER
FAILURE_SEMANTIC_REDEFINITION
FAILURE_MAPPING_PROMOTED_TO_CANONICAL
```

## 16. Compatibility/cutover ownership audit

Use the approved portfolio compatibility registry.

For:

```text
NEW_CANONICAL_PATH
LEGACY_COMPATIBILITY
HISTORICAL_REPLAY
CUTOVER
RETIREMENT
```

compare:

```text
APPROVED_ROLE
MATRIX_TREATMENT
REPOSITORY_BEHAVIOR
```

Approved role:

```text
OWNER
CONSUMER
NOT_APPLICABLE
```

Detect:

```text
WRONG_COMPATIBILITY_OWNER
DUAL_CANONICAL_PATH_MISSED
LEGACY_BYPASS_MISSED
MISSING_REPLAY_GAP
MISSING_CUTOVER_GAP
MISSING_RETIREMENT_GAP
```

Do not assign foreign compatibility implementation to the selected component.

## 17. Dependency audit

Use the approved portfolio dependency registry.

For each dependency determine:

```text
PORTFOLIO_APPROVED?
DIRECTION
TYPE
REQUIRED?
MATRIX_TREATMENT
REPOSITORY_INTEGRATION
```

Detect:

```text
UNAPPROVED_DEPENDENCY
MISSING_REQUIRED_DEPENDENCY
DEPENDENCY_DIRECTION_ERROR
HIDDEN_FOREIGN_DEPENDENCY
FALSE_DEPENDENCY_BLOCKER
```

The matrix must preserve normative dependency direction.

## 18. Foreign implementation dependency audit

A conformant upstream SPEC may still lack implementation.

Verify the matrix distinguishes:

```text
FOREIGN_IMPLEMENTATION_MISSING
```

from:

```text
LOCAL_IMPLEMENTATION_GAP
```

A missing foreign capability may be a planning dependency blocker.

It must not silently become local implementation scope.

## 19. Projection authority audit

Inspect matrix treatment of:

```text
backend
API
OPS
UI
reports
read models
caches
```

Verify canonical versus projection semantics.

Detect matrix omissions where repository behavior creates:

```text
BACKEND_SECOND_AUTHORITY
OPS_SECOND_AUTHORITY
UI_SECOND_AUTHORITY
REPORT_SECOND_AUTHORITY
PROJECTION_BECOMES_AUTHORITY
```

Such behavior must not be classified IMPLEMENTED merely because projections
work.

## 20. Responsibility leakage audit

Search independently for:

```text
selected-spec behavior implemented under foreign authority
foreign-spec behavior absorbed locally
duplicate canonical path
consumer mutating owner state
```

Distinguish:

```text
IMPLEMENTATION_LOCATION_CONCERN
```

from:

```text
WRONG_OWNER_IMPLEMENTATION
```

Do not treat directory aesthetics as normative.

## 21. Evidence quality audit

For every row independently assess:

```text
IMPLEMENTATION_EVIDENCE
TEST_EXISTENCE_EVIDENCE
TEST_EXECUTION_EVIDENCE
```

Evidence strength:

```text
STRONG
SUFFICIENT
WEAK
ABSENT
CONTRADICTORY
```

An IMPLEMENTED row cannot pass with absent implementation evidence.

An IMPLEMENTED row may still have weak test evidence.

## 22. Test evidence audit

Verify cited tests actually prove the claimed behavior.

Reject test evidence where:

* assertions do not cover the requirement;
* only mock behavior is proven;
* tests exercise non-production paths;
* only a subset is tested;
* tests encode behavior contrary to authority;
* only test names are cited.

Tests are evidence, not authority.

## 23. Test execution evidence audit

Verify matrix treatment distinguishes:

```text
TEST_EXISTS
```

from:

```text
TEST_EXECUTED_SUCCESSFULLY
```

If tests could not execute for environment/tooling reasons:

* preserve implementation classification if independently supported;
* mark execution evidence appropriately;
* do not invent MISSING behavior.

## 24. Exact delta audit

For every:

```text
PARTIAL
MISSING
CONTRADICTORY
```

verify the matrix contains:

```text
OBSERVED
REQUIRED
DELTA
```

The delta must:

* describe WHAT differs;
* be specific enough for downstream planning;
* exclude implementation design.

Flag:

```text
DELTA_TOO_VAGUE
DELTA_CONTAINS_IMPLEMENTATION_DESIGN
DELTA_INCLUDES_FOREIGN_SCOPE
```

## 25. UNVERIFIED audit

Verify every UNVERIFIED row contains:

```text
POSSIBLE_STATE
VERIFICATION_BLOCKER
EVIDENCE_NEEDED
```

Reject UNVERIFIED when reasonable repository investigation could determine the
state.

## 26. Gap identity audit

Preserve:

```text
REQUIREMENT != GAP
```

Independently determine whether each Gap ID represents one distinct underlying
implementation delta.

Detect:

```text
FALSE_GAP_SPLIT
FALSE_GAP_MERGE
ORPHAN_GAP
ORPHAN_REQUIREMENT_GAP_REFERENCE
DUPLICATE_GAP_IDENTITY
```

## 27. False gap split

Report when two or more Gap IDs represent the same underlying delta.

Example:

```text
REQ-A → GAP-001
REQ-B → GAP-002
```

when both require closure of one shared missing capability.

Planning impact:

* artificial ticket fragmentation;
* duplicate implementation work;
* misleading severity metrics.

## 28. False gap merge

Report when one Gap groups materially independent deltas.

Do not group if they differ by:

* owner;
* dependency;
* canonical authority;
* independently closable behavior;
* compatibility transition;
* failure semantic;
* repository productive path.

Planning impact:

* over-coupled implementation units;
* hidden dependency structure;
* incorrect ownership.

## 29. Gap Detail Record audit

For every distinct Gap verify exactly one detail record contains:

```text
Gap ID
Affected Requirements
Portfolio Obligations
Gap Category
Severity
Normative Expectation
Current Repository Behavior
Repository Evidence
Test Existence Evidence
Test Execution Evidence
Exact Delta
Ownership Boundary
Dependencies
Observed Repository Boundary
Acceptance Evidence Needed
```

For mixed ownership also require:

```text
LOCAL_OBLIGATION
FOREIGN_OBLIGATION
FOREIGN_OWNER
LOCAL_INTEGRATION_EXPECTATION
```

Do not require or accept implementation solution design here.

## 30. Implementation-plan leakage audit

Flag when the matrix starts deciding HOW to fix the gap.

Examples:

```text
create class X
add table Y
introduce module Z
split into ticket A/B
perform migration phase 1/2
refactor using pattern Q
```

unless directly mandated by normative authority.

Use:

```text
IMPLEMENTATION_PLAN_LEAKAGE
```

The Gap Matrix may identify:

```text
Observed Repository Boundary
```

It must not prescribe the correction surface.

## 31. Gap category audit

Allowed categories:

```text
BEHAVIOR_MISSING
BEHAVIOR_PARTIAL
BEHAVIOR_CONTRADICTORY
PORTFOLIO_OWNERSHIP_VIOLATION
FAILURE_SEMANTIC_VIOLATION
COMPATIBILITY_VIOLATION
DEPENDENCY_INTEGRATION_GAP
EVIDENCE_GAP
```

Verify category matches actual delta.

Detect:

```text
GAP_CATEGORY_MISCLASSIFIED
```

## 32. Gap severity audit

Allowed:

```text
BLOCKER
MAJOR
MINOR
EVIDENCE_ONLY
```

Severity must reflect semantic/planning impact, not estimated implementation
effort.

Detect:

```text
SEVERITY_INFLATED
SEVERITY_UNDERSTATED
EVIDENCE_ONLY_MISUSED
```

## 33. Existing implementation inventory audit

Verify inventory is sufficient to prevent false gaps or redundant future work.

Check only component-relevant areas.

Report omitted existing capability when omission materially distorts:

* classification;
* exact delta;
* owner;
* gap identity.

## 34. Contradiction audit

Independently search for contradictions not captured by the matrix.

For each record:

```text
Requirement
Portfolio Obligation
Repository Location
Observed Behavior
Required Behavior
Wrong Owner?
Alternate Productive Path?
Canonical State Mutation?
Historical Risk?
```

Detect:

```text
MISSED_CONTRADICTION
```

## 35. False positive / false negative analysis

Explicitly report:

### False Positive Gap

Matrix claims a delta that repository evidence disproves.

### False Negative Gap

Matrix claims implementation is conformant or omits a gap, but material
normative behavior is missing/partial/contradictory.

### Ownership False Positive

Matrix assigns foreign work locally.

### Ownership False Negative

Matrix hides local integration responsibility behind another SPEC.

### Evidence False Positive

Matrix claims implementation proof that does not prove the requirement.

These are planning-critical by default.

## 36. Coverage metric audit

Recalculate independently:

```text
TOTAL_NORMATIVE_REQUIREMENTS
IMPLEMENTED
PARTIAL
MISSING
CONTRADICTORY
NOT_APPLICABLE
OWNED_BY_OTHER_SPEC
UNVERIFIED
```

Calculate owned-scope implementation coverage.

Mixed-ownership requirements remain in the denominator.

Pure foreign requirements may be excluded.

Compare:

```text
MATRIX_REPORTED_COVERAGE
AUDITED_COVERAGE
```

Report discrepancies.

## 37. Gap severity metric audit

Recalculate from distinct Gap Detail Records:

```text
TOTAL_DISTINCT_GAPS
BLOCKER_GAPS
MAJOR_GAPS
MINOR_GAPS
EVIDENCE_ONLY_GAPS
```

Do not count one grouped Gap multiple times because several requirements
reference it.

## 38. Portfolio-specific metrics

Calculate:

```text
PORTFOLIO_OBLIGATIONS_AUDITED
PORTFOLIO_OWNERSHIP_ERRORS
WRONG_OWNER_IMPLEMENTATIONS
FAILURE_OWNER_ERRORS
COMPATIBILITY_OWNER_ERRORS
```

## 39. Gap grouping metrics

Calculate:

```text
FALSE_GAP_SPLITS
FALSE_GAP_MERGES
ORPHAN_GAPS
ORPHAN_REQUIREMENT_REFERENCES
```

## 40. Baseline drift metrics

Calculate:

```text
PORTFOLIO_BASELINE_DRIFT
COMPONENT_SPEC_BASELINE_DRIFT
UPSTREAM_SPEC_BASELINE_DRIFT
REPOSITORY_BASELINE_DRIFT
```

Any material drift must be reflected in verdict/readiness.

## 41. Material reliability checks

Independently calculate:

```text
UNCLASSIFIED_REQUIREMENTS
UNAUDITED_REQUIREMENTS
UNRESOLVED_OWNERSHIP
UNRESOLVED_MATERIAL_DELTA
UNSUPPORTED_IMPLEMENTED_CLAIMS
KNOWN_FALSE_POSITIVE_GAPS
KNOWN_FALSE_NEGATIVE_GAPS
SPECIFICATION_AMBIGUITY
ARCHITECTURAL_AUTHORITY_GAP
PORTFOLIO_AUTHORITY_GAP
SOURCE_SPEC_CONFORMANCE_DRIFT
```

Additionally:

```text
FALSE_GAP_SPLITS
FALSE_GAP_MERGES
PLANNING_CRITICAL_EVIDENCE_ERRORS
```

These determine whether planning can trust the matrix.

## 42. Planning-blocking classification

For every audit finding classify:

```text
PLANNING_BLOCKING
NON_BLOCKING
```

This is separate from audit severity.

### Planning blocking

A defect can cause downstream planning to:

* omit required work;
* create unnecessary work;
* assign wrong owner;
* miss dependency;
* rely on false IMPLEMENTED claim;
* miss contradiction;
* duplicate one gap into several units;
* merge independent gaps incorrectly;
* plan from unresolved delta;
* use stale baseline.

### Non-blocking

Examples:

* prose quality;
* secondary formatting;
* informational observation;
* non-material evidence presentation issue.

Judge impact, not cosmetics.

## 43. Audit finding IDs

Use:

```text
CGMA-CRITICAL-###
CGMA-MAJOR-###
CGMA-MINOR-###
CGMA-INFO-###
```

## 44. Audit finding severity

Use:

```text
CRITICAL
MAJOR
MINOR
INFO
```

Do not reuse Gap Severity labels as audit severity.

### CRITICAL

Examples:

* systemic false negative gaps;
* missing or failed SPEC identity, reconstruction, lifecycle, persistence, or
  cross-SPEC authority proof;
* wrong-owner implementation omitted;
* major baseline invalidity;
* portfolio authority violation hidden by matrix;
* source SPEC/portfolio conformance drift making matrix unsafe.

### MAJOR

Examples:

* false positive gap;
* false gap split/merge affecting planning;
* unsupported IMPLEMENTED claim;
* missing requirement;
* hidden local integration gap;
* incorrect exact delta;
* severity materially understated;
* failure/compatibility owner error.

### MINOR

Non-material issue that should be corrected but does not corrupt planning.

### INFO

Improvement only.

## 45. Finding format

Every CRITICAL, MAJOR and MINOR finding must contain:

```text
## <ID> — <title>

Severity:
Planning impact:
Category:

### Matrix location

### Requirement
Requirement ID:
Portfolio Obligation:
Approved Owner:

### Matrix claim
Classification:
Gap ID:
Severity:

### Independent audit result
Audited classification:
Audited owner:
Audited gap identity:

### Authority
ADR:
Portfolio:
Component SPEC:
Upstream SPEC, if applicable:

### Repository evidence

### Problem

### Why this matters for planning

### Minimum matrix correction required

### Revalidation
```

Do not prescribe implementation solution.

## 46. Allowed remediation types

Use:

```text
ADD_MISSING_REQUIREMENT_ROW
REMOVE_EXTRA_REQUIREMENT_ROW
RECLASSIFY_REQUIREMENT
CORRECT_EVIDENCE
CORRECT_EXACT_DELTA
CORRECT_OWNERSHIP
RESTORE_LOCAL_INTEGRATION_OBLIGATION
CORRECT_FAILURE_OWNERSHIP
CORRECT_COMPATIBILITY_OWNERSHIP
CORRECT_DEPENDENCY
MERGE_DUPLICATE_GAPS
SPLIT_FALSELY_MERGED_GAP
CORRECT_GAP_CATEGORY
CORRECT_GAP_SEVERITY
CORRECT_METRICS
REMOVE_IMPLEMENTATION_PLAN_LEAKAGE
REASSESS_BASELINE
SPEC_REMEDIATION_REQUIRED
PORTFOLIO_REMEDIATION_REQUIRED
ADR_CLARIFICATION_REQUIRED
```

Report only.

Do not perform remediation.

## 47. Audit dimensions

Report:

```text
REQUIREMENT_COMPLETENESS
CLASSIFICATION_ACCURACY
EVIDENCE_RELIABILITY
PORTFOLIO_OWNERSHIP_CONFORMANCE
DEPENDENCY_CONFORMANCE
FAILURE_OWNERSHIP_CONFORMANCE
COMPATIBILITY_CONFORMANCE
GAP_IDENTITY_CONFORMANCE
METRIC_ACCURACY
BASELINE_VALIDITY
PLANNING_RELIABILITY
SPEC_IMPLEMENTABILITY_AUTHORITY
AUTHORITY_CONSUMPTION_CONFORMANCE
```

Each:

```text
PASS
FAIL
BLOCKED
```

Overall conformance requires every material dimension to PASS.

## 48. Audit verdicts

Use exactly one:

```text
GAP_MATRIX_CONFORMANT
GAP_MATRIX_REMEDIATION_REQUIRED
GAP_MATRIX_REBUILD_REQUIRED
BLOCKED_BY_SPECIFICATION_AMBIGUITY
GAP_MATRIX_BLOCKED_BY_SPEC_AUTHORITY_GAP
BLOCKED_BY_ARCHITECTURAL_AUTHORITY
BLOCKED_BY_PORTFOLIO_AUTHORITY
BASELINE_DRIFT_REQUIRES_REASSESSMENT
AUDIT_BLOCKED_PORTFOLIO_NOT_APPROVED
AUDIT_BLOCKED_COMPONENT_SPEC_NOT_CONFORMANT
AUDIT_BLOCKED_UPSTREAM_SPEC_NOT_CONFORMANT
```

## 49. GAP_MATRIX_CONFORMANT

Use only when:

```text
AUTHORITY_NOT_DEFINED = 0
AUTHORITY_CONSUMPTION_PROOFS_UNCLASSIFIED = 0
PRODUCER_CONSUMER_CONTRACT_PROOFS_UNCLASSIFIED = 0
```

```text
MISSING_FROM_MATRIX = 0
DUPLICATED_IN_MATRIX = 0
UNCLASSIFIED_REQUIREMENTS = 0
UNAUDITED_REQUIREMENTS = 0

UNRESOLVED_OWNERSHIP = 0
UNRESOLVED_MATERIAL_DELTA = 0

UNSUPPORTED_IMPLEMENTED_CLAIMS = 0
KNOWN_FALSE_POSITIVE_GAPS = 0
KNOWN_FALSE_NEGATIVE_GAPS = 0

IDENTITY_AUTHORITY_GAPS = 0
RECONSTRUCTION_AUTHORITY_GAPS = 0
REHYDRATION_AUTHORITY_GAPS = 0
LIFECYCLE_AUTHORITY_GAPS = 0
PERSISTENCE_SEMANTICS_GAPS = 0
CROSS_SPEC_AUTHORITY_GAPS = 0
SPEC_IMPLEMENTABILITY_CHECK = PASS
AUTHORITY_NOT_DEFINED = 0
CAPABILITY_AVAILABILITY_RECORDS = <n>
CAPABILITY_AVAILABILITY_CLASSIFICATION_ERRORS = 0
LOCAL_TESTABLE_CAPABILITIES = <n>
PRODUCTIVELY_AVAILABLE_CAPABILITIES = <n>
DOWNSTREAM_PROMOTION_WITHOUT_NEW_EVIDENCE = 0
READY_CLAIMS_WITH_UNAVAILABLE_CONTRACT = 0
IMPLEMENTER_DECISION_CHECK_FAILURES = 0
TEMPORAL_AUTHORITY_GAPS = 0
CALLER_SUPPLIED_AUTHORITY_BYPASS = 0

PORTFOLIO_OWNERSHIP_ERRORS = 0
FAILURE_OWNER_ERRORS = 0
COMPATIBILITY_OWNER_ERRORS = 0

FALSE_GAP_SPLITS = 0
FALSE_GAP_MERGES = 0

SPECIFICATION_AMBIGUITY = 0
ARCHITECTURAL_AUTHORITY_GAP = 0
PORTFOLIO_AUTHORITY_GAP = 0
SOURCE_SPEC_CONFORMANCE_DRIFT = 0

PLANNING_BLOCKING_FINDINGS = 0
```

Minor non-blocking findings may exist.

Prefer zero findings.

## 50. GAP_MATRIX_REMEDIATION_REQUIRED

Use when the matrix remains structurally trustworthy enough for surgical
correction, but planning-critical defects remain.

Examples:

* a few misclassifications;
* incorrect evidence;
* isolated false gaps;
* wrong severity;
* incorrect grouping;
* ownership row errors;
* metrics inconsistent.

Planning readiness:

```text
NOT_READY_FOR_IMPLEMENTATION_PLAN
```

## 51. GAP_MATRIX_REBUILD_REQUIRED

Use when defects are systemic.

Examples:

* major requirement inventory incompleteness;
* classification methodology unreliable;
* many unsupported IMPLEMENTED claims;
* ownership systematically incorrect;
* grouping fundamentally broken;
* matrix generated from wrong/stale source authority;
* repository baseline invalid.

Do not ask for surgical remediation when rebuilding is safer.

## 52. Authority blockers

### Specification ambiguity

```text
BLOCKED_BY_SPECIFICATION_AMBIGUITY
```

when required behavior cannot be determined from the conformant SPEC.

### Architectural authority

```text
BLOCKED_BY_ARCHITECTURAL_AUTHORITY
```

when a new architecture decision is required.

### Portfolio authority

```text
BLOCKED_BY_PORTFOLIO_AUTHORITY
```

when ownership/dependency allocation is insufficient or contradictory.

Do not convert these into matrix defects.

## 53. Baseline drift verdict

Read the shared baseline/remediation contract before applying this verdict.

Use:

```text
BASELINE_DRIFT_REQUIRES_REASSESSMENT
```

when matrix classifications are materially stale due to changed:

* portfolio;
* component SPEC;
* upstream SPEC;
* repository implementation.

The verdict records that the matrix's original basis drifted. It does not by
itself block remediation. Emit the complete `BASELINE_REASSESSMENT_PROOF` with
old/current authority and repository baselines, preserved/obsolete/reclassified
and newly required records, stale/current evidence, before/after metrics,
remediation scope, and revalidation criteria. Then:

```text
complete proof + actionable findings
  => BASELINE_DRIFT_STATUS = DRIFT_ASSESSED
  => REASSESSMENT_COMPLETE = YES
  => BASELINE_REMEDIATION_READINESS = READY
  => REMEDIATION_ENTRY_STATE = READY_FOR_BASELINE_RECONCILIATION_REMEDIATION

missing or indeterminate proof
  => BASELINE_DRIFT_STATUS = DRIFT_UNASSESSED
  => REASSESSMENT_COMPLETE = NO
  => BASELINE_REMEDIATION_READINESS = BLOCKED_INSUFFICIENT_REASSESSMENT
```

The proper action for assessed drift is surgical baseline reconciliation, not
patching stale rows blindly. Preserve the originally audited baseline as the
old basis and fingerprint the current basis exactly.

## 54. Implementation Plan readiness

Report exactly:

```text
READY_FOR_IMPLEMENTATION_PLAN
```

or:

```text
NOT_READY_FOR_IMPLEMENTATION_PLAN
```

A matrix may contain many legitimate implementation gaps and still be ready.

Readiness depends on the reliability of the matrix, not on zero implementation
gaps.

## 55. READY_FOR_IMPLEMENTATION_PLAN

Allowed only when:

```text
VERDICT = GAP_MATRIX_CONFORMANT
```

or, if governance explicitly allows it:

```text
NO_IMPLEMENTATION_GAPS
```

No planning-blocking finding may remain.

## 56. Required audit artifact

Create:

```text
docs/specs/gap-matrices/audits/<SPEC-ID>-implementation-gap-matrix-audit.md
```

or repository-equivalent convention.

Required sections:

```text
1. Audit Verdict
2. Audit Mode
3. Subject
4. Frozen Baseline Validation
5. Authority Reconstruction
6. Independent Requirement Inventory
7. ADR / Portfolio / SPEC Traceability
8. Requirement Inventory Reconciliation
9. Classification Audit
10. Portfolio Ownership Audit
11. Mixed Ownership Audit
12. Failure Ownership Audit
13. Compatibility / Cutover Audit
14. Dependency Audit
15. Projection / Responsibility Leakage Audit
16. Evidence Audit
17. Test Evidence Audit
18. Exact Delta Audit
19. Gap Identity / Grouping Audit
20. Gap Detail Record Audit
21. Contradiction Audit
22. False Positive / False Negative Analysis
23. Gap Category / Severity Audit
24. Coverage / Metric Recalculation
25. Baseline Drift Assessment
26. Findings
27. Authority Escalations
28. Remediation Requirements
29. Material Reliability Checks
30. Implementation Plan Readiness
31. Closure Gate
32. Completeness Proof
```

## 57. Completion metrics

Report:

```text
SPEC_NORMATIVE_REQUIREMENTS
MATRIX_NORMATIVE_REQUIREMENTS
MISSING_FROM_MATRIX
EXTRA_IN_MATRIX
DUPLICATED_IN_MATRIX

AUDITED_REQUIREMENTS
UNCLASSIFIED_REQUIREMENTS
UNAUDITED_REQUIREMENTS

CONFIRMED_CLASSIFICATIONS
RECLASSIFICATION_REQUIRED
INSUFFICIENT_EVIDENCE
OWNERSHIP_ERRORS

FALSE_POSITIVE_GAPS
FALSE_NEGATIVE_GAPS

PORTFOLIO_OBLIGATIONS_AUDITED
PORTFOLIO_OWNERSHIP_ERRORS
WRONG_OWNER_IMPLEMENTATIONS

FAILURE_OWNER_ERRORS
COMPATIBILITY_OWNER_ERRORS

FALSE_GAP_SPLITS
FALSE_GAP_MERGES
ORPHAN_GAPS
ORPHAN_REQUIREMENT_REFERENCES

UNSUPPORTED_IMPLEMENTED_CLAIMS
UNRESOLVED_OWNERSHIP
UNRESOLVED_MATERIAL_DELTA

BLOCKER_GAPS
MAJOR_GAPS
MINOR_GAPS
EVIDENCE_ONLY_GAPS

CRITICAL_FINDINGS
MAJOR_FINDINGS
MINOR_FINDINGS
INFO_FINDINGS

PLANNING_BLOCKING_FINDINGS
NON_BLOCKING_FINDINGS

PORTFOLIO_BASELINE_DRIFT
COMPONENT_SPEC_BASELINE_DRIFT
UPSTREAM_SPEC_BASELINE_DRIFT
REPOSITORY_BASELINE_DRIFT
BASELINE_DRIFT_STATUS
REASSESSMENT_COMPLETE
BASELINE_REMEDIATION_READINESS
AUDIT_BASIS_FINGERPRINT

SPECIFICATION_AMBIGUITY
ARCHITECTURAL_AUTHORITY_GAP
PORTFOLIO_AUTHORITY_GAP
SOURCE_SPEC_CONFORMANCE_DRIFT
```

## 58. Mandatory checks

Report each:

```text
PASS
FAIL
BLOCKED
NOT_APPLICABLE
```

Checks:

```text
CHECK-01 Portfolio baseline is approved and stable.
CHECK-02 Component SPEC baseline is conformant and stable.
CHECK-03 Upstream SPEC authority is conformant.
CHECK-04 Every normative requirement is represented.
CHECK-05 No matrix requirement is invented/duplicated.
CHECK-06 ADR → Portfolio → SPEC traceability is correct.
CHECK-07 Every requirement classification is independently verified.
CHECK-08 Every IMPLEMENTED claim has sufficient proof.
CHECK-09 Every PARTIAL/MISSING/CONTRADICTORY row has exact delta.
CHECK-10 Mixed ownership is correctly decomposed.
CHECK-11 Portfolio ownership is preserved.
CHECK-12 No wrong-owner implementation is hidden.
CHECK-13 Failure semantic ownership is preserved.
CHECK-14 Compatibility/cutover ownership is preserved.
CHECK-15 Dependencies match the approved portfolio.
CHECK-16 Foreign implementation gaps are not absorbed locally.
CHECK-17 Projections do not become canonical authority.
CHECK-18 Test existence/execution evidence are separated.
CHECK-19 Gap IDs represent distinct implementation deltas.
CHECK-20 No false gap split exists.
CHECK-21 No false gap merge exists.
CHECK-22 Gap categories are correct.
CHECK-23 Gap severities are defensible.
CHECK-24 Metrics independently reconcile.
CHECK-25 No false positive gap remains.
CHECK-26 No false negative gap remains.
CHECK-27 No Implementation Plan leakage exists.
CHECK-28 Baseline drift does not invalidate conclusions.
CHECK-29 No unresolved SPEC ambiguity remains.
CHECK-30 No unresolved architectural authority gap remains.
CHECK-31 No unresolved portfolio authority gap remains.
CHECK-32 Matrix is materially reliable for planning.
CHECK-33 Upstream SPEC_IMPLEMENTABILITY_CHECK is PASS and current.
CHECK-34 Aggregate identity/reconstruction proofs remain complete.
CHECK-35 Lifecycle, persistence, and cross-SPEC authority remain complete.
CHECK-36 No authority gap is represented as an implementation Gap.
CHECK-37 Authority consumption distinguishes existence from consumability.
CHECK-38 Producer/consumer contract availability is evidenced.
CHECK-39 Temporal authority is protected where applicable.
CHECK-40 Caller-supplied canonical authority is rejected.
```

## 59. Final console response

Use:

```text
COMPONENT_IMPLEMENTATION_GAP_MATRIX_AUDIT_COMPLETE

SPEC: <SPEC-ID>
PORTFOLIO: <PORTFOLIO-ID>
MATRIX: <path>

BASELINE_REASSESSMENT:
- BASELINE_DRIFT_STATUS: <NO_DRIFT|DRIFT_UNASSESSED|DRIFT_ASSESSED>
- REASSESSMENT_COMPLETE: <YES|NO>
- FINDINGS_ARE_ACTIONABLE: <YES|NO>
- BASELINE_REMEDIATION_READINESS: <READY|BLOCKED_INSUFFICIENT_REASSESSMENT>
- AUDIT_BASIS_FINGERPRINT: <authority revisions/digests + repository commit/content fingerprint>
- BASELINE_REASSESSMENT_PROOF: <path or inline section>

DIMENSIONS:
- REQUIREMENT_COMPLETENESS: <PASS|FAIL|BLOCKED>
- CLASSIFICATION_ACCURACY: <PASS|FAIL|BLOCKED>
- EVIDENCE_RELIABILITY: <PASS|FAIL|BLOCKED>
- PORTFOLIO_OWNERSHIP_CONFORMANCE: <PASS|FAIL|BLOCKED>
- DEPENDENCY_CONFORMANCE: <PASS|FAIL|BLOCKED>
- FAILURE_OWNERSHIP_CONFORMANCE: <PASS|FAIL|BLOCKED>
- COMPATIBILITY_CONFORMANCE: <PASS|FAIL|BLOCKED>
- GAP_IDENTITY_CONFORMANCE: <PASS|FAIL|BLOCKED>
- METRIC_ACCURACY: <PASS|FAIL|BLOCKED>
- BASELINE_VALIDITY: <PASS|FAIL|BLOCKED>
- PLANNING_RELIABILITY: <PASS|FAIL|BLOCKED>
- SPEC_IMPLEMENTABILITY_AUTHORITY: <PASS|FAIL|BLOCKED>
- AUTHORITY_CONSUMPTION_CONFORMANCE: <PASS|FAIL|BLOCKED>

REQUIREMENTS:
- SPEC_TOTAL: <n>
- MATRIX_TOTAL: <n>
- MISSING_FROM_MATRIX: <n>
- DUPLICATED: <n>
- RECLASSIFICATION_REQUIRED: <n>

GAPS:
- FALSE_POSITIVE: <n>
- FALSE_NEGATIVE: <n>
- FALSE_SPLIT: <n>
- FALSE_MERGE: <n>

OWNERSHIP:
- PORTFOLIO_ERRORS: <n>
- WRONG_OWNER_IMPLEMENTATIONS: <n>
- FAILURE_OWNER_ERRORS: <n>
- COMPATIBILITY_OWNER_ERRORS: <n>

RELIABILITY:
- UNSUPPORTED_IMPLEMENTED_CLAIMS: <n>
- UNRESOLVED_OWNERSHIP: <n>
- UNRESOLVED_MATERIAL_DELTA: <n>
- SPEC_AUTHORITY_GAPS: <n>
- SPEC_IMPLEMENTABILITY_CHECK: PASS|FAIL|BLOCKED
- PLANNING_BLOCKING_FINDINGS: <n>

FINDINGS:
- CRITICAL: <n>
- MAJOR: <n>
- MINOR: <n>
- INFO: <n>

VERDICT:
<verdict>

IMPLEMENTATION_PLAN_READINESS:
<READY_FOR_IMPLEMENTATION_PLAN |
NOT_READY_FOR_IMPLEMENTATION_PLAN>

REPORT:
<path>
```

## Anti-patterns

Do not:

* trust the Gap Matrix's own conclusions;
* regenerate the matrix instead of auditing it;
* modify Gap Matrix;
* modify code/tests;
* rewrite SPEC;
* rewrite portfolio;
* create Implementation Plan;
* create tickets;
* solve gaps;
* infer authority from code location;
* infer missing behavior from filenames;
* classify foreign missing implementation locally;
* hide mixed ownership;
* hide contradictions under PARTIAL;
* accept test names as proof;
* equate test execution failure with missing implementation;
* ignore false gap splits;
* ignore false gap merges;
* allow wrong-owner implementation because behavior “works”;
* treat implementation design as Exact Delta;
* use cosmetic findings to block planning;
* ignore material baseline drift.

## Core completion invariant

The audit is complete only when it can independently support:

> The Gap Matrix contains every normative requirement of the conformant component
> SPEC exactly once; each requirement traces through the approved portfolio to
> accepted ADR authority; every classification matches independently inspected
> repository behavior; every IMPLEMENTED claim is positively evidenced; every
> PARTIAL, MISSING and CONTRADICTORY classification has a precise observable
> delta; local and foreign ownership are correctly separated; wrong-owner
> implementation, failure semantic drift, compatibility drift and projection
> authority violations are visible; Gap IDs represent real distinct
> implementation deltas without false splitting or false merging; metrics are
> mechanically correct; baselines are valid; and no material defect remains
> that could corrupt downstream Implementation Planning.

When this invariant holds:

```text
GAP_MATRIX_CONFORMANT
READY_FOR_IMPLEMENTATION_PLAN
```
