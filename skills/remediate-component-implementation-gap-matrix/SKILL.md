---
name: remediate-component-implementation-gap-matrix
description: >
  Remediate one component Implementation Gap Matrix after an independent
  audit-component-implementation-gap-matrix verdict of
  GAP_MATRIX_REMEDIATION_REQUIRED. Apply only finding-driven, evidence-backed
  corrections to the Gap Matrix while preserving accepted ADR authority, the
  approved SPEC portfolio decomposition, the conformant component SPEC,
  conformant upstream component contracts, repository evidence, approved
  ownership boundaries, failure semantic ownership, compatibility/cutover
  ownership, dependency direction, and valid existing Gap identities. Correct
  classifications, evidence, exact deltas, ownership treatment, dependency
  treatment, false gap splits/merges, severities, and metrics without modifying
  implementation or designing the Implementation Plan. Successful remediation
  ends only at READY_FOR_INDEPENDENT_GAP_MATRIX_REAUDIT.
---

# Remediate Component Implementation Gap Matrix

Before any baseline gate, read
`skills/_shared/baseline-drift-remediation-contract.md`. It is the shared
auditor/remediator contract for reassessment proof, actionable findings, and
stale-after-audit detection.

## Purpose

Remediate validated defects in a component Implementation Gap Matrix after:

```text
generate-component-implementation-gap-matrix
        ↓
audit-component-implementation-gap-matrix
        ↓
GAP_MATRIX_REMEDIATION_REQUIRED
```

The objective is to correct the Gap Matrix as a trustworthy implementation-delta
artifact.

This skill does not:

* implement gaps;
* redesign architecture;
* modify portfolio ownership;
* modify the component SPEC;
* modify upstream SPECs;
* create the Implementation Plan;
* create tickets;
* approve the Gap Matrix.

Successful remediation produces:

```text
READY_FOR_INDEPENDENT_GAP_MATRIX_REAUDIT
```

Only an independent audit may later produce:

```text
GAP_MATRIX_CONFORMANT
READY_FOR_IMPLEMENTATION_PLAN
```

## Operating mode

Operate in:

```text
WRITE_ALLOWED
AUDIT_DRIVEN
TARGETED
SURGICAL
ADR_FIRST
PORTFOLIO_GOVERNED
SPEC_FIRST
EVIDENCE_BACKED
OWNERSHIP_PRESERVING
GAP_IDENTITY_PRESERVING
METRIC_RECONCILING
NO_ARCHITECTURE_INVENTION
NO_SCOPE_EXPANSION
NO_IMPLEMENTATION
NO_IMPLEMENTATION_PLAN
NO_TICKET_DECOMPOSITION
NO_SELF_APPROVAL
```

## Core remediation model

Use:

```text
validated CGMA finding
        ↓
accepted ADR
+
approved portfolio
+
conformant component SPEC
+
conformant upstream contracts
+
repository evidence
        ↓
minimal Gap Matrix correction
        ↓
mechanical reconciliation
        ↓
independent re-audit
```

The audit identifies the defect.

Authority determines the correction.

The repository proves implementation state.

The Gap Matrix is only the artifact being corrected.

## 1. Authority order

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
current repository implementation
    >
tests
    >
validated independent Gap Matrix audit findings
    >
Gap Matrix being remediated
    >
prototype / historical evidence
```

The audit is authoritative about the validated defect.

It is not architectural authority.

## 2. Required inputs

Required:

1. target component Implementation Gap Matrix;
2. latest independent Gap Matrix audit;
3. conformant target component SPEC;
4. latest component SPEC conformance audit;
5. approved governing portfolio;
6. latest portfolio decomposition audit;
7. accepted ADR authority;
8. portfolio obligation registry;
9. portfolio dependency registry;
10. portfolio failure ownership registry;
11. portfolio compatibility/cutover registry;
12. conformant upstream component SPECs;
13. repository baseline assessed by the matrix;
14. current repository HEAD.

Supporting evidence:

* production implementation;
* tests;
* migrations;
* schemas;
* adapters;
* configuration;
* prototype;
* prior Gap Matrices;
* historical execution reports.

## 3. Preconditions

Run normal remediation only when latest audit verdict is:

```text
GAP_MATRIX_REMEDIATION_REQUIRED
```

If:

```text
GAP_MATRIX_CONFORMANT
```

return:

```text
REMEDIATION_NOT_REQUIRED
reason = GAP_MATRIX_ALREADY_CONFORMANT
```

If:

```text
GAP_MATRIX_REBUILD_REQUIRED
```

return:

```text
GAP_MATRIX_REMEDIATION_BLOCKED
reason = GAP_MATRIX_REBUILD_REQUIRED
```

Do not perform surgical remediation on a systemically invalid matrix.

## 4. Upstream blockers

Do not remediate locally when the audit verdict is:

```text
BLOCKED_BY_SPECIFICATION_AMBIGUITY
BLOCKED_BY_ARCHITECTURAL_AUTHORITY
BLOCKED_BY_PORTFOLIO_AUTHORITY
AUDIT_BLOCKED_PORTFOLIO_NOT_APPROVED
AUDIT_BLOCKED_COMPONENT_SPEC_NOT_CONFORMANT
AUDIT_BLOCKED_UPSTREAM_SPEC_NOT_CONFORMANT
```

Return the exact upstream blocker.

Do not convert an upstream authority defect into a Gap Matrix correction.

Do not promote a capability during remediation merely because a fixture, mock,
fake, interface, contract test, or in-memory repository exists. Preserve the
independent authority, contract, local-testability, and productive-availability
dimensions; promote productive availability only with the complete
`NO_DOWNSTREAM_CAPABILITY_PROMOTION_WITHOUT_NEW_EVIDENCE` record and new
concrete producer/integration evidence.

## 5. Baseline drift and reassessment gate

Read and validate the audit's persisted `BASELINE_REASSESSMENT_PROOF`, not only
its top-level verdict. `BASELINE_DRIFT_REQUIRES_REASSESSMENT` means that drift
was detected; it does not mean reassessment was omitted.

For the exact audited basis, require:

```text
BASELINE_DRIFT_STATUS
REASSESSMENT_COMPLETE
FINDINGS_ARE_ACTIONABLE
BASELINE_REMEDIATION_READINESS
AUDIT_BASIS_FINGERPRINT
```

If the audit reports `DRIFT_ASSESSED`, the proof is complete, findings are
actionable, and the live authority/source/repository fingerprint equals the
persisted audit fingerprint, enter:

```text
BASELINE_REMEDIATION_READINESS = READY
REMEDIATION_ENTRY_STATE = READY_FOR_BASELINE_RECONCILIATION_REMEDIATION
```

Use that reassessment as the authority for surgical reconciliation. Preserve the
old matrix/audit baseline, record the current adopted baseline, reconcile
preserved, obsolete, reclassified, and newly required records, update evidence
and metrics, and require an independent re-audit afterward.

Block for baseline only when:

```text
BASELINE_DRIFT_STATUS = DRIFT_UNASSESSED
OR REASSESSMENT_COMPLETE = NO
OR required proof fields are missing/indeterminate
```

Return:

```text
GAP_MATRIX_REMEDIATION_BLOCKED
reason = BLOCKED_INSUFFICIENT_REASSESSMENT
```

If the live fingerprint differs from the audit fingerprint, including a
repository or SPEC change made after a complete reassessment, return:

```text
GAP_MATRIX_REMEDIATION_BLOCKED
reason = STALE_AUDIT_BASIS
```

Never ask for another audit merely because the consumed audit identified drift.

## 6. Establish remediation baseline

Record:

```text
MATRIX_PATH
SOURCE_AUDIT
SOURCE_AUDIT_VERDICT

PORTFOLIO_ID
PORTFOLIO_REVISION
PORTFOLIO_VERDICT

COMPONENT_SPEC_ID
COMPONENT_SPEC_REVISION
COMPONENT_SPEC_VERDICT

UPSTREAM_SPEC_BASELINES

MATRIX_REPOSITORY_BASELINE
AUDITED_REPOSITORY_BASELINE
CURRENT_REPOSITORY_HEAD

WORKING_TREE_STATE
VALIDATED_FINDINGS
```

Also record digests/revisions when available.

## 7. Validate current baseline before editing

Compare:

```text
PORTFOLIO_BASELINE
COMPONENT_SPEC_BASELINE
UPSTREAM_SPEC_BASELINES
REPOSITORY_BASELINE
MATRIX_BASELINE
```

Classify drift:

```text
NO_RELEVANT_DRIFT
NON_SEMANTIC_DOCUMENTARY_DRIFT
LOCALIZED_MATRIX_DRIFT
MATERIAL_BASELINE_DRIFT
```

### NON_SEMANTIC_DOCUMENTARY_DRIFT

Examples:

* audit report added;
* unrelated docs changed;
* metadata changed without semantic authority impact.

Normal remediation may continue.

### LOCALIZED_MATRIX_DRIFT

Only Gap Matrix changed after audit.

Revalidate affected findings individually.

### MATERIAL_BASELINE_DRIFT

Any semantic change to:

* accepted ADR;
* approved portfolio;
* component SPEC;
* upstream SPEC;
* production implementation;
* relevant tests/evidence.

Use the shared contract. Assessed drift with complete actionable proof is
`DRIFT_ASSESSED` and remains an allowed remediation input. Only unassessed
drift, incomplete proof, or a live fingerprint different from the audited
fingerprint blocks remediation. Do not silently adopt a newer state without a
fresh audit basis.

## 8. Build complete finding ledger

Read the entire audit.

Inventory every:

```text
CGMA-CRITICAL-###
CGMA-MAJOR-###
CGMA-MINOR-###
CGMA-INFO-###
```

Capture:

```text
Finding ID
Severity
Planning impact
Category
Requirement ID
Portfolio Obligation
Approved Owner
Matrix classification
Audited classification
Gap ID
Matrix severity
Audited gap identity
Authority
Repository evidence
Minimum matrix correction
Revalidation condition
```

## 9. Revalidate each finding

Before editing classify every finding:

```text
VALIDATED_AND_STILL_PRESENT
VALIDATED_BUT_ALREADY_RESOLVED
REJECTED_BY_NEW_EVIDENCE
BLOCKED_BY_BASELINE_CHANGE
```

Reject a finding only with concrete evidence.

Do not reject because the requested correction is inconvenient.

If new evidence changes authority rather than implementation evidence, escalate.

## 10. Finding remediation states

Use only:

```text
REMEDIATED
ALREADY_RESOLVED
REJECTED_BY_VALID_EVIDENCE
PARTIALLY_REMEDIATED
BLOCKED
```

Do not use:

```text
CLOSED
APPROVED
CONFORMANT
```

Only the independent auditor may close findings.

## 11. Allowed change scope

Normally modify only:

```text
target Gap Matrix
```

Optionally create/update a repository-required remediation evidence artifact.

Do not modify:

* ADRs;
* portfolio;
* component SPEC;
* upstream SPEC;
* production code;
* tests;
* migrations;
* schemas;
* Implementation Plan;
* tickets;
* prior audits.

If a finding cannot be remediated without changing one of these, escalate.

## 12. Preserve normative inventory

The conformant component SPEC determines the requirement inventory.

Do not add/remove/rename requirement rows unless the audit explicitly proves:

```text
ADD_MISSING_REQUIREMENT_ROW
REMOVE_EXTRA_REQUIREMENT_ROW
```

Reconcile:

```text
SPEC_NORMATIVE_REQUIREMENTS
MATRIX_NORMATIVE_REQUIREMENTS
MISSING_FROM_MATRIX
EXTRA_IN_MATRIX
DUPLICATED_IN_MATRIX
```

Required target:

```text
MISSING_FROM_MATRIX = 0
DUPLICATED_IN_MATRIX = 0
```

## 13. Preserve ADR → Portfolio → Requirement traceability

Every requirement row must preserve:

```text
Requirement ID
Portfolio Obligation ID
ADR Authority
ADR Section
Ownership Role
```

Do not invent ownership from repository structure.

If an audit finding proves traceability is wrong, correct it from accepted
authority.

## 14. Classification remediation

Allowed classifications remain:

```text
IMPLEMENTED
PARTIAL
MISSING
CONTRADICTORY
NOT_APPLICABLE
OWNED_BY_OTHER_SPEC
UNVERIFIED
```

Correct only finding-affected classifications unless derived consistency
requires another row update.

## 15. IMPLEMENTED remediation

For:

```text
UNSUPPORTED_IMPLEMENTED_CLAIM
```

record:

```text
Requirement
Previous classification
Previous evidence
Actual repository behavior
Missing normative behavior
Corrected classification
Exact delta
Gap ID
Evidence status
```

Possible corrected results:

```text
PARTIAL
MISSING
CONTRADICTORY
UNVERIFIED
```

Do not preserve IMPLEMENTED merely to maintain coverage percentage.

## 16. PARTIAL remediation

PARTIAL requires both:

```text
existing conformant behavior
+
missing/incomplete local normative behavior
```

Correct the exact delta to state:

```text
OBSERVED
REQUIRED
DELTA
```

Do not include foreign missing behavior in local delta.

## 17. MISSING remediation

For false MISSING claims:

* independently verify implementation evidence;
* reclassify appropriately;
* remove only the false Gap relationship;
* preserve legitimate surrounding gaps.

Do not delete an entire grouped Gap because one requirement was a false
positive.

## 18. CONTRADICTORY remediation

Keep CONTRADICTORY when actual implementation violates accepted semantics.

Do not soften:

```text
CONTRADICTORY
→
PARTIAL
```

unless evidence proves the contradiction never exists on a productive path.

Ensure the Gap records:

```text
OBSERVED
REQUIRED
CONTRADICTION
CAN_MUTATE_CANONICAL_STATE
ALTERNATE_PRODUCTIVE_PATH
HISTORICAL_RISK
WRONG_OWNER_IMPLEMENTATION
```

where relevant.

## 19. NOT_APPLICABLE remediation

Correct false NOT_APPLICABLE claims.

It is valid only when there is truly no implementation obligation in the
assessed repository scope.

Do not use it for deferred work.

## 20. OWNED_BY_OTHER_SPEC remediation

Before preserving:

```text
OWNED_BY_OTHER_SPEC
```

prove:

```text
LOCAL_IMPLEMENTATION_OBLIGATION = NONE
```

If local integration exists, restore it.

For mixed ownership record:

```text
LOCAL_OBLIGATION
FOREIGN_OBLIGATION
FOREIGN_OWNER
LOCAL_INTEGRATION_EXPECTATION
```

## 21. Hidden local integration remediation

For:

```text
HIDDEN_LOCAL_INTEGRATION_GAP
FALSE_FOREIGN_OWNERSHIP
```

restore the selected component's actual local obligation without absorbing
foreign implementation scope.

The Gap must describe only the local missing integration behavior.

## 22. Portfolio ownership remediation

For:

```text
PORTFOLIO_OWNERSHIP_VIOLATION
OWNERSHIP_FALSE_POSITIVE
OWNERSHIP_FALSE_NEGATIVE
```

use the approved portfolio as authority.

Correct:

```text
approved owner
component role
repository actual authority
matrix treatment
```

Do not change portfolio ownership.

## 23. Wrong-owner implementation remediation

If the repository implements canonical behavior under the wrong authority and
the audit validated:

```text
WRONG_OWNER_IMPLEMENTATION
```

the matrix must normally state:

```text
Classification = CONTRADICTORY
Gap Category = PORTFOLIO_OWNERSHIP_VIOLATION
```

Exact Delta must describe the authority mismatch without prescribing code
movement.

## 24. Implementation location concern remediation

Do not convert a purely structural:

```text
IMPLEMENTATION_LOCATION_CONCERN
```

into an implementation gap unless authority is actually violated.

If semantic ownership remains valid, record it as non-gap observation or local
concern according to matrix convention.

## 25. Failure ownership remediation

Use the portfolio failure registry.

For findings such as:

```text
WRONG_FAILURE_OWNER
FAILURE_SEMANTIC_REDEFINITION
FAILURE_MAPPING_PROMOTED_TO_CANONICAL
```

correct the matrix to distinguish:

```text
CANONICAL_SEMANTIC_OWNER
COMPONENT_ROLE
REPOSITORY_SEMANTIC_OWNER
LOCAL_MAPPING
```

If implementation has wrong semantic authority, generate/preserve:

```text
Gap Category = FAILURE_SEMANTIC_VIOLATION
```

Do not assign the foreign owner's implementation to local scope.

## 26. Compatibility/cutover remediation

Use the approved portfolio role for:

```text
NEW_CANONICAL_PATH
LEGACY_COMPATIBILITY
HISTORICAL_REPLAY
CUTOVER
RETIREMENT
```

Correct matrix treatment for:

```text
WRONG_COMPATIBILITY_OWNER
DUAL_CANONICAL_PATH_MISSED
LEGACY_BYPASS_MISSED
MISSING_REPLAY_GAP
MISSING_CUTOVER_GAP
MISSING_RETIREMENT_GAP
```

Only locally owned obligations become local implementation gaps.

## 27. Dependency remediation

Correct:

```text
UNAPPROVED_DEPENDENCY
MISSING_REQUIRED_DEPENDENCY
DEPENDENCY_DIRECTION_ERROR
HIDDEN_FOREIGN_DEPENDENCY
FALSE_DEPENDENCY_BLOCKER
```

from the approved portfolio dependency graph.

Do not add new normative dependency edges.

If a genuinely necessary edge is not in portfolio authority:

```text
GAP_MATRIX_REMEDIATION_BLOCKED
reason = PORTFOLIO_REMEDIATION_REQUIRED
```

## 28. Foreign implementation dependency treatment

Preserve:

```text
FOREIGN_IMPLEMENTATION_MISSING
!=
LOCAL_IMPLEMENTATION_GAP
```

If a missing foreign implementation blocks local sequencing, record:

```text
DEPENDENCY_BLOCKER
```

without adding the foreign work into the local Gap.

## 29. Projection authority remediation

For validated projection authority defects, correct matrix representation of:

```text
BACKEND_SECOND_AUTHORITY
OPS_SECOND_AUTHORITY
UI_SECOND_AUTHORITY
REPORT_SECOND_AUTHORITY
PROJECTION_BECOMES_AUTHORITY
```

These must remain visible as contradictions when repository behavior truly
creates alternate authority.

Do not downgrade merely because read behavior works.

## 30. Exact delta remediation

For every actionable:

```text
PARTIAL
MISSING
CONTRADICTORY
```

ensure:

```text
OBSERVED:
<repository behavior>

REQUIRED:
<conformant component SPEC>

DELTA:
<smallest material behavioral difference>
```

The delta must describe WHAT.

It must not define HOW.

## 31. Remove Implementation Plan leakage

Remove or neutralize:

```text
create class X
create table Y
modify module Z
use algorithm A
refactor service B
ticket 1 / ticket 2
phase A / phase B
```

unless normative authority explicitly requires them.

Keep:

```text
Observed Repository Boundary
```

not:

```text
Implementation Surface To Change
```

## 32. UNVERIFIED remediation

Every UNVERIFIED entry must contain:

```text
POSSIBLE_STATE
VERIFICATION_BLOCKER
EVIDENCE_NEEDED
```

If current evidence now resolves the state, reclassify.

Do not keep UNVERIFIED merely to avoid a firm classification.

## 33. Gap identity preservation rule

Preserve:

```text
REQUIREMENT != GAP
```

Do not create one Gap automatically per requirement.

Do not preserve separate Gap IDs merely because they already exist.

Gap identity must reflect actual distinct implementation deltas.

## 34. False gap split remediation

For:

```text
FALSE_GAP_SPLIT
```

merge Gap IDs when they represent the same underlying delta.

Before merge verify:

```text
same owner
same semantic delta
same canonical authority
compatible dependencies
same closure condition
```

Choose one surviving Gap ID according to repository stability convention.

If none exists, prefer the earliest stable Gap ID.

Update every affected Requirement → Gap reference.

## 35. False gap merge remediation

For:

```text
FALSE_GAP_MERGE
```

split only when grouped deltas are materially independent.

Independent means different:

* owner;
* authority;
* dependency;
* canonical path;
* failure semantic;
* compatibility transition;
* closure condition.

Assign stable new Gap IDs only where required.

Preserve all traceability.

## 36. Orphan gap remediation

Correct:

```text
ORPHAN_GAP
ORPHAN_REQUIREMENT_GAP_REFERENCE
DUPLICATE_GAP_IDENTITY
```

Every active Gap must:

* affect at least one requirement;
* have one detail record;
* be referenced consistently.

Every gap-bearing requirement must point to an existing Gap.

## 37. Gap category remediation

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

Correct category from the actual delta.

Do not encode severity in category.

## 38. Gap severity remediation

Allowed:

```text
BLOCKER
MAJOR
MINOR
EVIDENCE_ONLY
```

Severity reflects semantic/planning impact, not implementation effort.

Correct:

```text
SEVERITY_INFLATED
SEVERITY_UNDERSTATED
EVIDENCE_ONLY_MISUSED
```

Do not reduce severity to obtain readiness.

## 39. Evidence remediation

Every claim must cite proportional evidence.

Distinguish:

```text
IMPLEMENTATION_EVIDENCE
TEST_EXISTENCE_EVIDENCE
TEST_EXECUTION_EVIDENCE
```

Do not replace missing implementation evidence with tests alone.

Do not replace missing test execution with MISSING implementation.

## 40. Evidence-only gap remediation

Use `EVIDENCE_ONLY` only when implementation appears materially correct and the
remaining delta is proof.

If implementation behavior itself is incomplete:

```text
EVIDENCE_ONLY
```

is invalid.

Reclassify the implementation and severity.

## 41. False positive gap remediation

For every validated false positive:

1. identify exact false delta;
2. prove current repository behavior;
3. correct classification;
4. remove only invalid Gap relationship;
5. preserve other affected requirements;
6. update Gap detail;
7. update metrics.

Do not delete unrelated work.

## 42. False negative gap remediation

For every validated false negative:

1. preserve Requirement ID;
2. correct classification;
3. create or attach correct Gap;
4. record exact observable delta;
5. preserve portfolio owner;
6. preserve foreign boundaries;
7. assign justified severity.

## 43. Contradiction remediation

Add missed contradictions validated by audit.

A contradiction must not be represented as merely:

```text
missing enhancement
```

when productive repository behavior actively violates authority.

## 44. Detailed Gap Record reconciliation

Every distinct active Gap must have exactly one record containing:

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

For mixed ownership:

```text
LOCAL_OBLIGATION
FOREIGN_OBLIGATION
FOREIGN_OWNER
LOCAL_INTEGRATION_EXPECTATION
```

## 45. Matrix row reconciliation

Every requirement row must include:

```text
Gap ID
Requirement ID
Portfolio Obligation ID
Ownership Role
Requirement Summary
Classification
Implementation Evidence
Test Evidence
Exact Delta / Verification Blocker
Owner
Dependencies
Confidence
```

All row data must match its Gap Detail Record.

## 46. Existing implementation inventory reconciliation

Update inventory only when an audit finding proves it materially incomplete or
incorrect.

Do not expand it opportunistically.

Its purpose is to prevent false gaps, not to document the whole repository.

## 47. Cross-SPEC dependency matrix reconciliation

For each affected dependency reconcile:

```text
Dependency SPEC
Portfolio Role
Foreign Ownership
Local Obligation
Repository Integration
Foreign Implementation State
CAPABILITY_ID
AUTHORITY_OWNER
PRODUCER
CONSUMER
CONTRACT
SEMANTIC_STATUS
LOCAL_TESTABILITY
PRODUCTIVE_AVAILABILITY
AVAILABILITY_EVIDENCE
BLOCKING_EFFECT
Result
```

Allowed Result:

```text
SATISFIED
PARTIAL
MISSING
UNVERIFIED
NOT_REQUIRED_FOR_CURRENT_GAPS
```

Do not confuse foreign implementation state with local matrix classification.

## 48. Conformance evidence reconciliation

For every affected requirement use:

```text
PROVEN
WEAKLY_PROVEN
UNTESTED
EXECUTION_UNVERIFIED
NOT_IMPLEMENTED
NOT_APPLICABLE
```

Ensure the evidence status matches final classification.

## 49. Recalculate classification metrics

Derive from final matrix rows:

```text
TOTAL_NORMATIVE_REQUIREMENTS
TOTAL_CLASSIFIED_REQUIREMENTS

IMPLEMENTED
PARTIAL
MISSING
CONTRADICTORY
NOT_APPLICABLE
OWNED_BY_OTHER_SPEC
UNVERIFIED
```

Do not copy counts from previous audit.

## 50. Recalculate Gap metrics

Derive from distinct Gap Detail Records:

```text
TOTAL_DISTINCT_GAPS
BLOCKER_GAPS
MAJOR_GAPS
MINOR_GAPS
EVIDENCE_ONLY_GAPS
```

Do not count a grouped Gap once per requirement.

## 51. Recalculate portfolio-specific metrics

Derive:

```text
PORTFOLIO_OWNERSHIP_VIOLATION_GAPS
FAILURE_SEMANTIC_VIOLATION_GAPS
COMPATIBILITY_VIOLATION_GAPS
DEPENDENCY_INTEGRATION_GAPS

WRONG_OWNER_IMPLEMENTATIONS
IMPLEMENTATION_LOCATION_CONCERNS
```

## 52. Recalculate reliability metrics

Calculate:

```text
UNCLASSIFIED_REQUIREMENTS
UNRESOLVED_OWNERSHIP
UNRESOLVED_MATERIAL_DELTA
UNSUPPORTED_IMPLEMENTED_CLAIMS
KNOWN_FALSE_POSITIVE_GAPS
KNOWN_FALSE_NEGATIVE_GAPS

FALSE_GAP_SPLITS
FALSE_GAP_MERGES
ORPHAN_GAPS
ORPHAN_REQUIREMENT_REFERENCES

SPECIFICATION_AMBIGUITY
ARCHITECTURAL_AUTHORITY_GAP
PORTFOLIO_AUTHORITY_GAP
SOURCE_SPEC_CONFORMANCE_DRIFT
CAPABILITY_AVAILABILITY_CLASSIFICATION_ERRORS
DOWNSTREAM_PROMOTION_WITHOUT_NEW_EVIDENCE
READY_CLAIMS_WITH_UNAVAILABLE_CONTRACT
```

## 53. Implementation coverage

Calculate coverage using requirements wholly or partly owned by the selected
component.

Mixed ownership remains in scope.

Pure foreign requirements may be excluded.

Document the exact formula:

```text
IMPLEMENTATION_COVERAGE =
IMPLEMENTED_OWNED_REQUIREMENTS
/
ELIGIBLE_OWNED_REQUIREMENTS
```

If repository convention treats PARTIAL differently, state exact formula.

Do not manipulate denominator to increase coverage.

## 54. Planning-blocking defect reconciliation

Every CGMA finding must retain:

```text
PLANNING_BLOCKING
or
NON_BLOCKING
```

After remediation recompute:

```text
PLANNING_BLOCKING_FINDINGS_REMAINING
```

Successful remediation requires:

```text
PLANNING_BLOCKING_FINDINGS_REMAINING = 0
CAPABILITY_AVAILABILITY_CLASSIFICATION_ERRORS = 0
DOWNSTREAM_PROMOTION_WITHOUT_NEW_EVIDENCE = 0
READY_CLAIMS_WITH_UNAVAILABLE_CONTRACT = 0
```

## 55. Authority escalation detection

During remediation classify newly discovered issues:

```text
NO_ESCALATION
SPEC_REMEDIATION_REQUIRED
ADR_CLARIFICATION_REQUIRED
PORTFOLIO_REMEDIATION_REQUIRED
UPSTREAM_SPEC_REMEDIATION_REQUIRED
BLOCKED_INSUFFICIENT_REASSESSMENT
STALE_AUDIT_BASIS
```

Do not solve these locally.

## 56. Specification ambiguity escalation

If deterministic requirement behavior cannot be established from the conformant
component SPEC:

```text
GAP_MATRIX_REMEDIATION_BLOCKED
reason = SPEC_REMEDIATION_REQUIRED
```

Do not invent requirement semantics.

## 57. ADR escalation

If correction requires new architecture:

```text
GAP_MATRIX_REMEDIATION_BLOCKED
reason = ADR_CLARIFICATION_REQUIRED
```

## 58. Portfolio escalation

If correction requires changing:

* obligation owner;
* failure owner;
* compatibility owner;
* normative dependency edge;

return:

```text
GAP_MATRIX_REMEDIATION_BLOCKED
reason = PORTFOLIO_REMEDIATION_REQUIRED
```

## 59. Upstream SPEC escalation

If the issue is actually an incomplete/incorrect foreign contract:

```text
GAP_MATRIX_REMEDIATION_BLOCKED
reason = UPSTREAM_SPEC_REMEDIATION_REQUIRED
```

Do not absorb it locally.

## 60. Required local invariants

Successful local remediation requires:

```text
MISSING_FROM_MATRIX = 0
DUPLICATED_IN_MATRIX = 0

UNCLASSIFIED_REQUIREMENTS = 0

UNRESOLVED_OWNERSHIP = 0
UNRESOLVED_MATERIAL_DELTA = 0

UNSUPPORTED_IMPLEMENTED_CLAIMS = 0
KNOWN_FALSE_POSITIVE_GAPS = 0
KNOWN_FALSE_NEGATIVE_GAPS = 0

FALSE_GAP_SPLITS = 0
FALSE_GAP_MERGES = 0
ORPHAN_GAPS = 0
ORPHAN_REQUIREMENT_REFERENCES = 0

SPECIFICATION_AMBIGUITY = 0
ARCHITECTURAL_AUTHORITY_GAP = 0
PORTFOLIO_AUTHORITY_GAP = 0
SOURCE_SPEC_CONFORMANCE_DRIFT = 0

PLANNING_BLOCKING_FINDINGS_REMAINING = 0
```

These are local remediation invariants.

They do not prove Gap Matrix conformance.

## 61. Finding remediation ledger

Produce:

| Finding | Validation | Matrix correction | Local evidence | Result |
| ------- | ---------- | ----------------- | -------------- | ------ |

Allowed Result:

```text
REMEDIATED
ALREADY_RESOLVED
REJECTED_BY_VALID_EVIDENCE
PARTIALLY_REMEDIATED
BLOCKED
```

Every finding must appear exactly once.

## 62. Remediation verdicts

Use exactly one:

```text
COMPONENT_GAP_MATRIX_REMEDIATION_COMPLETE
COMPONENT_GAP_MATRIX_REMEDIATION_PARTIAL
COMPONENT_GAP_MATRIX_REMEDIATION_BLOCKED
REMEDIATION_NOT_REQUIRED
```

## 63. COMPLETE verdict

Use:

```text
COMPONENT_GAP_MATRIX_REMEDIATION_COMPLETE
```

only when:

* every validated planning-blocking finding is remediated;
* all local invariants pass;
* no upstream escalation remains;
* matrix metrics reconcile;
* Gap identities reconcile;
* evidence is internally consistent.

Then emit:

```text
READY_FOR_INDEPENDENT_GAP_MATRIX_REAUDIT
```

Never emit:

```text
GAP_MATRIX_CONFORMANT
READY_FOR_IMPLEMENTATION_PLAN
```

## 64. PARTIAL verdict

Use:

```text
COMPONENT_GAP_MATRIX_REMEDIATION_PARTIAL
```

when valid local remediation remains possible but some findings remain
unresolved.

Gate:

```text
REMEDIATION_INCOMPLETE
```

## 65. BLOCKED verdict

Use:

```text
COMPONENT_GAP_MATRIX_REMEDIATION_BLOCKED
```

with one exact reason:

```text
SPEC_REMEDIATION_REQUIRED
ADR_CLARIFICATION_REQUIRED
PORTFOLIO_REMEDIATION_REQUIRED
UPSTREAM_SPEC_REMEDIATION_REQUIRED
BLOCKED_INSUFFICIENT_REASSESSMENT
STALE_AUDIT_BASIS
GAP_MATRIX_REBUILD_REQUIRED
AUTHORITY_UNAVAILABLE
```

`BASELINE_REASSESSMENT_REQUIRED` is retained only as an upstream finding label
or legacy report value. It is not a block when the shared reassessment proof is
complete and actionable; use `BLOCKED_INSUFFICIENT_REASSESSMENT` or
`STALE_AUDIT_BASIS` for the two actual baseline blockers.

## 66. Artifact path

Modify the existing component Gap Matrix.

Optionally create remediation evidence at:

```text
docs/specs/gap-matrices/remediations/
<SPEC-ID>-implementation-gap-matrix-remediation.md
```

or repository-equivalent convention.

Do not create another competing Gap Matrix.

## 67. Required remediation report

The remediation evidence must contain:

```text
# <SPEC-ID> — Implementation Gap Matrix Remediation

## 1. Remediation Mode
## 2. Subject
## 3. Source Audit
## 4. Baseline Validation
## 4.1 Baseline reassessment state
BASELINE_DRIFT_STATUS: <NO_DRIFT|DRIFT_UNASSESSED|DRIFT_ASSESSED>
REASSESSMENT_COMPLETE: <YES|NO>
BASELINE_REMEDIATION_READINESS: <READY|BLOCKED_INSUFFICIENT_REASSESSMENT>
AUDIT_BASIS_FINGERPRINT: <exact audited basis>
OLD_AUTHORITY_BASELINE: <recorded>
CURRENT_AUTHORITY_BASELINE: <recorded>
OLD_REPOSITORY_BASELINE: <recorded>
CURRENT_REPOSITORY_BASELINE: <recorded>
REMEDIATION_SCOPE: <recorded>
REVALIDATION_CRITERIA: <recorded>
## 5. Authority Context
## 6. Finding Ledger
## 7. Requirement Inventory Reconciliation
## 8. Classification Corrections
## 9. Portfolio Ownership Corrections
## 10. Mixed Ownership Corrections
## 11. Failure Ownership Corrections
## 12. Compatibility / Cutover Corrections
## 13. Dependency Corrections
## 14. Evidence Corrections
## 15. Exact Delta Corrections
## 16. Gap Identity Corrections
## 17. Gap Category / Severity Corrections
## 18. Metric Reconciliation
## 19. Reliability Validation
## 20. Escalations
## 21. Files Changed
## 22. Reaudit Readiness
```

## 68. Required change-boundary proof

Report:

```text
ADRS_CHANGED = NO
PORTFOLIO_CHANGED = NO
COMPONENT_SPEC_CHANGED = NO
UPSTREAM_SPECS_CHANGED = NO
PRODUCTION_CODE_CHANGED = NO
TESTS_CHANGED = NO
IMPLEMENTATION_PLAN_CHANGED = NO
TICKETS_CHANGED = NO
```

Any exception means normal remediation boundary was violated unless explicitly
blocked/escalated before modification.

## 69. Final metrics

Report at minimum:

```text
NORMATIVE_REQUIREMENTS
IMPLEMENTED
PARTIAL
MISSING
CONTRADICTORY
NOT_APPLICABLE
OWNED_BY_OTHER_SPEC
UNVERIFIED

ACTIVE_GAPS
BLOCKER_GAPS
MAJOR_GAPS
MINOR_GAPS
EVIDENCE_ONLY_GAPS

FALSE_POSITIVE_GAPS
FALSE_NEGATIVE_GAPS

FALSE_GAP_SPLITS
FALSE_GAP_MERGES

PORTFOLIO_OWNERSHIP_ERRORS
WRONG_OWNER_IMPLEMENTATIONS
FAILURE_OWNER_ERRORS
COMPATIBILITY_OWNER_ERRORS

UNSUPPORTED_IMPLEMENTED_CLAIMS
UNRESOLVED_OWNERSHIP
UNRESOLVED_MATERIAL_DELTA

IMPLEMENTATION_COVERAGE

PLANNING_BLOCKING_FINDINGS_REMAINING
```

## 70. Final console response

For successful remediation:

```text
COMPONENT_GAP_MATRIX_REMEDIATION_COMPLETE

SPEC: <SPEC-ID>
PORTFOLIO: <PORTFOLIO-ID>

MATRIX:
<path>

SOURCE_AUDIT:
<path>

BASELINE:
- MATRIX_REPOSITORY_HEAD: <sha>
- CURRENT_HEAD: <sha>
- DRIFT: <classification>

FINDINGS:
- TOTAL: <n>
- REMEDIATED: <n>
- ALREADY_RESOLVED: <n>
- REJECTED_BY_VALID_EVIDENCE: <n>
- PARTIAL: 0
- BLOCKED: 0

REQUIREMENTS:
- TOTAL: <n>
- IMPLEMENTED: <n>
- PARTIAL: <n>
- MISSING: <n>
- CONTRADICTORY: <n>
- NOT_APPLICABLE: <n>
- OWNED_BY_OTHER_SPEC: <n>
- UNVERIFIED: <n>

GAPS:
- TOTAL: <n>
- BLOCKER: <n>
- MAJOR: <n>
- MINOR: <n>
- EVIDENCE_ONLY: <n>
- FALSE_POSITIVE: 0
- FALSE_NEGATIVE: 0
- FALSE_SPLIT: 0
- FALSE_MERGE: 0

OWNERSHIP:
- PORTFOLIO_ERRORS: 0
- WRONG_OWNER_IMPLEMENTATIONS: <n>
- FAILURE_OWNER_ERRORS: 0
- COMPATIBILITY_OWNER_ERRORS: 0

RELIABILITY:
- UNSUPPORTED_IMPLEMENTED_CLAIMS: 0
- UNRESOLVED_OWNERSHIP: 0
- UNRESOLVED_MATERIAL_DELTA: 0
- PLANNING_BLOCKING_FINDINGS_REMAINING: 0

IMPLEMENTATION_COVERAGE:
<percentage>

GATE:
READY_FOR_INDEPENDENT_GAP_MATRIX_REAUDIT

REMEDIATION_REPORT:
<path>
```

## 71. Blocked console response

Use:

```text
COMPONENT_GAP_MATRIX_REMEDIATION_BLOCKED

SPEC: <SPEC-ID>
MATRIX: <path>

BLOCKER:
<exact reason>

AFFECTED_FINDING:
<CGMA-ID>

AFFECTED_MATRIX_LOCATION:
<location>

REQUIRED_UPSTREAM_ACTION:
<precise action category>

GATE:
BLOCKED
```

Do not continue remediating around the blocker.

## 72. Prohibited shortcuts

Do not:

* modify code;
* modify tests;
* modify ADRs;
* modify portfolio;
* modify component SPEC;
* modify upstream SPEC;
* implement identified gaps;
* generate the Implementation Plan;
* generate tickets;
* suppress gaps to improve coverage;
* classify foreign work as local;
* classify local integration as foreign;
* weaken CONTRADICTORY to PARTIAL without evidence;
* preserve unsupported IMPLEMENTED claims;
* create one Gap per Requirement automatically;
* ignore false gap splits;
* ignore false gap merges;
* retain stale baseline conclusions;
* prescribe implementation design inside Exact Delta;
* mark findings CLOSED;
* mark Gap Matrix CONFORMANT;
* emit READY_FOR_IMPLEMENTATION_PLAN.

## 73. Preferred remediation strategy

Prefer:

```text
minimum semantic correction
+
maximum authority preservation
+
exact repository evidence
+
stable Gap identity
+
mechanically derived metrics
```

The smallest correct semantic change is preferred over the smallest textual
change.

Do not rewrite a materially correct Gap Matrix merely for style.

## Completion invariant

Remediation is locally complete only when it can support:

> Every normative requirement remains anchored to the conformant component SPEC
> and its approved portfolio obligation; all validated classification,
> ownership, evidence, dependency, failure, compatibility, severity, metric and
> Gap identity defects have been corrected; no false positive or false negative
> implementation delta remains knowingly present; mixed ownership preserves
> local versus foreign obligations; false Gap splits and merges have been
> eliminated; every active Gap represents one real distinct implementation
> delta with precise observable evidence; no architecture, portfolio ownership,
> upstream contract, implementation design or downstream planning decision was
> invented; and all matrix-derived metrics reconcile mechanically.

Even when this invariant holds, the Gap Matrix is not yet approved.

The only successful gate is:

```text
READY_FOR_INDEPENDENT_GAP_MATRIX_REAUDIT
```

The mandatory next step is:

```text
audit-component-implementation-gap-matrix
```
