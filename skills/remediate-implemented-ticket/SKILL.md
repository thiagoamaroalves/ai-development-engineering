---
name: remediate-implemented-ticket
description: >
  Remediate an implemented ticket from the canonical IMA finding set produced by consolidate-implementation-audit. Revalidate every canonical finding, reconstruct shared root causes and affected implementation radius, group related findings into atomic remediation units, and correct production code and tests while preserving frozen ticket scope, accepted authority, the approved Implementation Design, DDD responsibility placement, aggregate and invariant boundaries, SOLID constraints, dependency direction, Clean Code structural quality, ownership, cross-spec boundaries, and completion evidence. Prove canonical finding and root-cause closure, independently self-check structural design preservation, detect remediation-introduced regressions before re-audit, and return the ticket to VALIDATION_REQUIRED. This skill may modify implementation and tests but must not modify upstream authority, redesign the ticket, expand scope, mark DONE, or self-certify final conformance.
metadata:
  short-description: Root-cause remediation of audited ticket implementations
---

# Remediate Implemented Ticket

Read `skills/_shared/interrupted-remediation-recovery-contract.md` before acting.
A dirty implementation left by an interrupted attempt is an untrusted candidate;
resume and reconcile it against the current canonical audit before checkpointing.

For baseline/source drift, read
`skills/_shared/baseline-drift-remediation-contract.md`. A complete actionable
reassessment is consumable remediation authority; drift alone is not a blocker,
but any post-audit change makes the audit basis stale.

Also read `skills/_shared/finding-completion-readiness-contract.md`. Remediate
only findings whose `BLOCKS_TICKET_DONE = YES` when the objective is local
ticket closure.

Also read:

- `skills/_shared/root-cause-campaign-contract.md`;
- `skills/_shared/audit-convergence-contract.md`;
- `skills/_shared/authority-provenance-anti-forgery-contract.md`;
- `skills/_shared/remediation-preflight-contract.md`;
- `skills/_shared/audit-report-structure-contract.md`.

Read `skills/_shared/workflow-execution-topology-contract.md` before mutating
code or tests. This repository's authorized ticket remediation runs in the
guarded main working tree with the contract's single-writer, stable-HEAD,
scope, and no-commit safeguards; it must not invent a worktree protocol. An open integrated-only finding remains in the canonical set,
keeps its upstream route, and receives downstream checkpoint/owner handoff; it
is not resolved by consumer changes or by promoting productive availability.
Plan/Ticket dependency classification is completion-scope authority. This skill
must preserve `LOCAL_CLOSURE_BLOCKING = NO` for an independently audited
integrated dependency unless explicit local Acceptance Criterion or Completion
Evidence proves reclassification. Any such reclassification routes to
`PLAN_OR_TICKET_REVALIDATION`, not normal implementation remediation.

## Purpose

Correct implementation defects discovered by the independent specialist-audit pipeline while preserving frozen authority, scope, and the approved structural design.

Workflow:

~~~text
IMPLEMENTATION
        ↓
VALIDATION_REQUIRED
        ↓
audit-implemented-ticket
        ↓
specialists:
  conformance
  behavior
  design conformance
  architecture when required
        ↓
consolidate-implementation-audit
        ↓
TICKET_IMPLEMENTATION_REMEDIATION_REQUIRED
        ↓
canonical IMA finding set
        ↓
remediate-implemented-ticket
        ↓
root-cause remediation
        ↓
behavioral + structural self-check
        ↓
VALIDATION_REQUIRED
        ↓
audit-implemented-ticket
~~~

Primary objective:

~~~text
CLOSE_ALL_CANONICAL_BLOCKING_FINDINGS
+
REMOVE_THEIR_ROOT_CAUSES
+
PRESERVE_APPROVED_IMPLEMENTATION_DESIGN
+
AVOID_REMEDIATION_REGRESSIONS
~~~

Optimize for MINIMUM_COMPLETE_CORRECTION, not MINIMUM_LINE_CHANGE. A local patch is insufficient when evidence proves a systemic root cause.

## Operating mode

~~~text
ROOT_CAUSE_DRIVEN
CANONICAL_FINDING_DRIVEN
SYSTEMIC_WHERE_REQUIRED
TICKET_SCOPED
DESIGN_PRESERVING
DDD_PRESERVING
SOLID_PRESERVING
DEPENDENCY_DIRECTION_PRESERVING
CLEAN_CODE_REQUIRED
INVARIANT_PRESERVING
AGGREGATE_BOUNDARY_PRESERVING
CODE_AND_TEST_REMEDIATION
OWNERSHIP_PRESERVING
CROSS_SPEC_BOUNDARY_PRESERVING
REGRESSION_AWARE
EVIDENCE_REQUIRED
NO_SCOPE_EXPANSION
NO_ARCHITECTURE_REDESIGN
NO_UNAUTHORIZED_DESIGN_CHANGE
NO_SELF_CERTIFICATION
REAUDIT_REQUIRED
~~~

## 1. Authority precedence

Use:

~~~text
Accepted ADR authority
    >
Approved SPEC Portfolio
    >
Conformant Component Specification
    >
Explicit Cross-Spec Contracts
    >
Validated Gap Matrix
    >
Conformant Implementation Plan
    >
Conformant Ticket
    >
Approved Implementation Design
    >
Canonical Implementation Audit
    >
Canonical IMA Findings
    >
Supporting Specialist Evidence
    >
Repository Implementation
    >
Tests
    >
Remediation Claims
~~~

Canonical IMA findings define what defect must be remediated. The approved Implementation Design constrains how structural remediation may be performed inside the frozen ticket. Neither authorizes architecture redesign.

## 2. Canonical defect authority

The only authoritative defect set is the canonical implementation audit produced by consolidate-implementation-audit:

~~~text
<TICKET-ID>-implementation-audit.md
~~~

Supporting specialist artifacts are evidence only. If specialist evidence conflicts with canonical IMA semantics, canonical findings control. If the contradiction prevents safe remediation:

~~~text
IMPLEMENTATION_REMEDIATION_BLOCKED
reason = CANONICAL_FINDING_REQUIRES_REAUDIT
~~~

Do not build a competing remediation backlog from CONF, BEH, IDC, or ARCH findings.

## 3. Preconditions

Run local code/test remediation only when the latest canonical audit reports:

~~~text
TICKET_IMPLEMENTATION_REMEDIATION_REQUIRED
TICKET_GATE: NOT_READY_FOR_DONE
~~~

When `TICKET_IMPLEMENTATION_REMEDIATION_REQUIRED` is paired with
`TICKET_GATE: READY_FOR_DONE`, first inspect the finding-level fields. If every
open finding has `BLOCKS_TICKET_DONE = NO`, no local remediation is authorized
by this skill; preserve the integrated-only findings and return the explicit
local-ticket handoff result below.

If the canonical result is TICKET_IMPLEMENTATION_CONFORMANT, return:

~~~text
IMPLEMENTATION_REMEDIATION_NOT_REQUIRED
reason = TICKET_ALREADY_CONFORMANT
~~~

If `TICKET_GATE = READY_FOR_DONE` and every open finding has
`BLOCKS_TICKET_DONE = NO`, return:

```text
IMPLEMENTATION_REMEDIATION_NOT_REQUIRED_FOR_LOCAL_TICKET
reason = INTEGRATED_ONLY_FINDINGS_REMAIN_OPEN
```

Preserve and route those findings to their downstream checkpoint; do not mark
them `RESOLVED`.

If it is TICKET_IMPLEMENTATION_AUDIT_BLOCKED, return:

~~~text
IMPLEMENTATION_REMEDIATION_BLOCKED
reason = IMPLEMENTATION_AUDIT_BLOCKED
~~~

If the canonical audit is absent:

~~~text
IMPLEMENTATION_REMEDIATION_BLOCKED
reason = CANONICAL_IMPLEMENTATION_AUDIT_MISSING
~~~

If upstream authority materially changed:

~~~text
IMPLEMENTATION_REMEDIATION_BLOCKED
reason = UPSTREAM_REVALIDATION_REQUIRED
~~~

## 4. Required inputs

Identify:

~~~text
TICKET_ID
TICKET_PATH
TICKET_FOLDER
IMPLEMENTATION_UNIT
IMPLEMENTATION_DESIGN_PATH
CANONICAL_AUDIT_PATH
AUDIT_ROUND
AUDIT_HEAD
CANONICAL_FINDINGS
ADR_PATHS
PORTFOLIO_PATH
SPEC_PATH
GAP_MATRIX_PATH
IMPLEMENTATION_PLAN_PATH
TICKET_AUDIT_PATH
REPOSITORY_ROOT
REMEDIATION_START_HEAD
CURRENT_HEAD
~~~

Also capture `BASELINE_DRIFT_STATUS`, `REASSESSMENT_COMPLETE`,
`FINDINGS_ARE_ACTIONABLE`, `BASELINE_REMEDIATION_READINESS`,
`AUDIT_BASIS_FINGERPRINT`, and `BASELINE_REASSESSMENT_PROOF` when drift is
present.

When useful inspect conformance, behavior, design-conformance, and architecture specialist artifacts. Inspect the repository directly; do not remediate from summaries alone.

## 5. Load approved Implementation Design

Read the complete design and capture:

~~~text
IMPLEMENTATION_RESPONSIBILITY
REPOSITORY_ARCHITECTURE_CONTEXT
DOMAIN_MODEL_ASSESSMENT
AGGREGATE_BOUNDARIES
ENTITIES
VALUE_OBJECTS
DOMAIN_SERVICES
DOMAIN_POLICIES
ANTI_CORRUPTION_BOUNDARIES
RESPONSIBILITY_DECOMPOSITION
PROPOSED_COMPONENTS
SOLID_ASSESSMENT
DEPENDENCY_DIRECTION
INVARIANT_PLACEMENT
PERSISTENCE_DESIGN
LIFECYCLE_DESIGN
CROSS_SPEC_INTEGRATION
FAILURE_RECOVERY_FLOW
CLEAN_CODE_ASSESSMENT
TEST_DESIGN
STRUCTURAL_RISKS
~~~

The approved design is a structural constraint during remediation.

## 6. Baseline validation

Capture:

~~~text
AUDIT_HEAD
REMEDIATION_START_HEAD
CURRENT_HEAD
~~~

Classify:

~~~text
NO_RELEVANT_DRIFT
NON_SEMANTIC_DRIFT
LOCALIZED_IMPLEMENTATION_DRIFT
MATERIAL_IMPLEMENTATION_DRIFT
~~~

Consume `BASELINE_REASSESSMENT_PROOF` when the implementation audit detected
drift. Preserve the old implementation/design/authority baseline, record the
current fingerprint, and continue only when:

~~~text
BASELINE_DRIFT_STATUS = DRIFT_ASSESSED
REASSESSMENT_COMPLETE = YES
FINDINGS_ARE_ACTIONABLE = YES
BASELINE_REMEDIATION_READINESS = READY
live fingerprint = AUDIT_BASIS_FINGERPRINT
~~~

If drift is unassessed or the proof is incomplete, return
`IMPLEMENTATION_REMEDIATION_BLOCKED` with
`reason = BLOCKED_INSUFFICIENT_REASSESSMENT`. If the live implementation,
authority, or relevant evidence changed after the audit, return the same
result with `reason = STALE_AUDIT_BASIS`, including when reassessment had been
marked complete.

For localized drift, revalidate every canonical finding and classify it:

~~~text
VALIDATED_AND_STILL_PRESENT
ALREADY_RESOLVED
REJECTED_BY_NEW_EVIDENCE
INVALIDATED_BY_BASELINE_DRIFT
~~~

For material implementation drift without the complete, current reassessment,
use `IMPLEMENTATION_REAUDIT_REQUIRED` only as the requested upstream action;
the actual baseline gate is `BLOCKED_INSUFFICIENT_REASSESSMENT` or
`STALE_AUDIT_BASIS`. Do not reinterpret canonical scope silently.

## 7. Canonical finding intake and validity

Read every IMA-CRITICAL, IMA-MAJOR, IMA-MINOR, and IMA-INFO finding. Capture:

~~~text
FINDING_ID
SEVERITY
TITLE
SOURCE_SPECIALISTS
SOURCE_FINDINGS
GAP_IDS
REQUIREMENT_IDS
ACCEPTANCE_IDS
NORMATIVE_AUTHORITY
DESIGN_AUTHORITY
REPOSITORY_EVIDENCE
TEST_EVIDENCE
PROBLEM
ROOT_CAUSE
IMPACT
SYSTEMIC_PATTERN
RELATED_LOCATIONS
MINIMUM_CORRECTION_REQUIRED
LINEAGE
ORIGIN
~~~

Classify every blocking finding:

~~~text
CONFIRMED
ALREADY_RESOLVED
INVALIDATED_BY_NEW_EVIDENCE
BLOCKED_BY_BASELINE_CHANGE
~~~

Do not reject findings because remediation is difficult.

Classify finding importance:

- MUST_REMEDIATE: all CRITICAL, all MAJOR, and MINOR explicitly blocking correctness, design conformance, evidence, auditability, or governance.
- SHOULD_REMEDIATE: non-blocking MINOR findings safely correctable within the same authorized root cause.
- NON_BLOCKING: INFO and optional observations.

## 8. Root-cause reconstruction

Analyze all MUST_REMEDIATE findings together. Create root causes:

~~~text
RC-001
RC-002
...
~~~

For each record:

~~~text
ROOT_CAUSE_CAMPAIGN_ID
ROOT_CAUSE_ID
ROOT_CAUSE_DESCRIPTION
ROOT_CAUSE_CATEGORY
CANONICAL_FINDINGS
AFFECTED_COMPONENTS
AFFECTED_PATHS
AFFECTED_TESTS
DESIGN_BOUNDARIES_AFFECTED
INVARIANTS_AFFECTED
DEPENDENCY_BOUNDARIES_AFFECTED
ISSUERS
REGISTRARS
CONSUMERS
ALTERNATE_AUTHORITY_PATHS
INJECTION_POINTS
MUTATION_AND_STALE_PATHS
PORT_SUBSTITUTION_PATHS
PUBLIC_EXPORTS
CAMPAIGN_MATRIX_COMPLETE
ALL_SURFACE_ROWS_COVERED
NEGATIVE_WITNESS_MATRIX
~~~

Allowed categories include:

~~~text
BEHAVIOR
DOMAIN_MODEL
AGGREGATE_BOUNDARY
INVARIANT_PLACEMENT
COMPONENT_BOUNDARY
RESPONSIBILITY_MIXING
SRP
OCP
LSP
ISP
DIP
DEPENDENCY_DIRECTION
INFRASTRUCTURE_LEAKAGE
PERSISTENCE
LIFECYCLE
CONCURRENCY
STALE_STATE
IDEMPOTENCY
RECOVERY
DURABILITY
CROSS_SPEC_BOUNDARY
OWNERSHIP
IDENTITY_LINEAGE
RECONSTRUCTION_AUTHORITY
REHYDRATION_AUTHORITY
CAPABILITY_AVAILABILITY
READINESS_HANDOFF
COMPATIBILITY
MIGRATION
LEGACY_TRANSITION
TESTABILITY
TEST_COVERAGE
COMPLETION_EVIDENCE
CLEAN_CODE_STRUCTURAL
PREMATURE_ABSTRACTION
OVERENGINEERING
DOMAIN_RULE_DUPLICATION
~~~

## 9. Affected-radius analysis

For every root cause ask:

~~~text
WHERE_ELSE_CAN_THE_SAME_DEFECT_EXIST?
~~~

Inspect analogous domain methods, aggregate mutation paths, application services, handlers, repositories, adapters, persistence paths, retry/recovery paths, cross-spec adapters, legacy routes, tests, and architecture guards.

Classify each manifestation:

~~~text
ALREADY_COVERED_BY_CANONICAL_FINDING
SAME_ROOT_CAUSE_ADDITIONAL_MANIFESTATION
INDEPENDENT_NEW_DEFECT
OUTSIDE_TICKET_SCOPE
~~~

A SAME_ROOT_CAUSE_ADDITIONAL_MANIFESTATION may be fixed when it is inside ticket scope and the same accepted authority applies. An INDEPENDENT_NEW_DEFECT must not be silently added. If material:

~~~text
IMPLEMENTATION_REMEDIATION_BLOCKED
reason = NEW_INDEPENDENT_DEFECT_REQUIRES_AUDIT
~~~

For every campaign, complete the shared surface matrix and negative-witness
matrix. If `CONSECUTIVE_FINDING_PERSISTENCE >= 2` for a blocking finding, the
campaign must set `EXPANDED_RADIUS_REQUIRED = YES`; a narrow repeat correction
is not an eligible remediation. Record the expanded rows before creating any
Remediation Unit and route outside-scope manifestations to the owning phase.

If complete correction requires code or behavior outside ticket authority:

~~~text
IMPLEMENTATION_REMEDIATION_BLOCKED
reason = UPSTREAM_SCOPE_OR_AUTHORITY_REQUIRED
~~~

If the finding reveals that a SPEC implementability decision, reconstruction or
rehydration authority, capability producer contract, availability status,
`LOCAL_CLOSURE`, or `READY` predicate was wrong upstream, do not close it with a
test-only or adapter-only change. Return the ticket to the earliest owning
phase with:

~~~text
IMPLEMENTATION_REMEDIATION_BLOCKED
reason = UPSTREAM_READINESS_CONTRACT_REMEDIATION_REQUIRED
EARLIEST_OWNER = SPEC | GAP_MATRIX | IMPLEMENTATION_PLAN | TICKET_DECOMPOSITION
~~~

The implementation audit remains a final defense; it must not become the first
place where an upstream-determinable contract/availability contradiction is
considered acceptable.

## 10. Atomic remediation units

Group work by root cause, not by finding wording.

Create RU-001, RU-002, and so on. For each record:

~~~text
REMEDIATION_UNIT_ID
ROOT_CAUSE_IDS
CANONICAL_FINDINGS
BEHAVIOR_TO_CORRECT
STRUCTURE_TO_CORRECT
FILES_EXPECTED
TESTS_REQUIRED
DESIGN_BOUNDARIES_TO_PRESERVE
OWNERSHIP_CONSTRAINTS
DEPENDENCY_CONSTRAINTS
REGRESSION_RISKS
COMPLETION_PROOF
~~~

Apply foundational causes before symptoms using actual dependencies.

## 11. Frozen-scope guard

Before every material change ask:

~~~text
required by a canonical finding or same-root manifestation?
inside frozen ticket scope?
preserves Does Not Implement?
preserves ownership and cross-spec authority?
preserves accepted architecture?
preserves or restores approved Implementation Design?
avoids new product behavior?
~~~

If not, stop or narrow the correction.

## 12. Structural remediation

When findings concern design quality, restore approved responsibility boundaries rather than suppressing symptoms:

~~~text
God application service
    → restore domain/application/persistence responsibilities

Anemic aggregate
    → restore domain behavior to approved aggregate or policy

DIP violation
    → restore approved dependency inversion seam

Duplicated invariant
    → restore one canonical enforcement owner
~~~

The design may be locally adapted without revalidation only when responsibility, domain semantics, aggregate boundary, invariant ownership, dependency direction, persistence authority, lifecycle authority, cross-spec boundary, testability, and ticket scope remain unchanged. Filenames and private method shapes need not be identical.

If remediation requires material changes to domain model, aggregate boundary, responsibility decomposition, component boundaries, dependency direction, invariant ownership, persistence authority, lifecycle authority, cross-spec boundary, or recovery model:

~~~text
IMPLEMENTATION_REMEDIATION_BLOCKED
reason = IMPLEMENTATION_DESIGN_REVALIDATION_REQUIRED
~~~

## 13. DDD and aggregate remediation

Restore the approved repository-compatible interpretation:

~~~text
Domain objects and policies decide
Application services orchestrate
Repositories persist
Adapters translate
~~~

Do not impose textbook layering.

For aggregate findings restore:

~~~text
single mutation authority
protected invariants
valid consistency and transaction boundary
no direct internal mutation bypass
durable protection where required
~~~

For affected scope require:

~~~text
AGGREGATE_BOUNDARY_VIOLATIONS = 0
DOMAIN_INVARIANT_BYPASSES = 0
UNENFORCED_INVARIANTS = 0
~~~

For anemic-domain findings, move the actual decision or invariant back to its approved domain owner. Do not add a wrapper that leaves procedural authority in the service.

For fat application-service findings, restore responsibilities to approved homes. Do not split only to reduce line count or create a generic Domain Service.

## 14. SOLID and dependency remediation

Remediate SRP, OCP, LSP, ISP, and DIP findings semantically:

- restore coherent reasons to change without artificial micro-components;
- introduce variation seams only for real current variation;
- restore behavioral substitutability;
- reduce consumer dependency on unrelated capabilities;
- restore approved inversion boundaries.

Do not create ceremonial interfaces, factories, strategies, providers, plugins, or wrappers.

After changes recalculate:

~~~text
DEPENDENCY_DIRECTION_VIOLATIONS = 0
INFRASTRUCTURE_LEAKAGE_POINTS = 0
~~~

within affected ticket scope.

## 15. Persistence, lifecycle, and invariant remediation

Preserve the distinction between domain authority and durable enforcement.

Correct persistence findings without making storage the semantic owner of the business rule.

Restore one lifecycle transition authority. Remove generic setters, public mutable status, repository-driven business transitions, or alternate handlers only when contrary to approved design.

For every affected invariant define:

~~~text
CANONICAL_ENFORCEMENT
DURABLE_ENFORCEMENT
APPLICATION_GUARD
TEST_PROOF
~~~

Remove unauthorized duplicate or bypass implementations. Require DOMAIN_RULE_DUPLICATION = 0 for affected canonical rules.

## 16. Cross-spec remediation

Correct foreign-boundary findings by:

~~~text
CONSUME_OWNER_OUTPUT
PRESERVE_OWNER_IDENTITY
MAP_AT_APPROVED_BOUNDARY
PRESERVE_FAILURE_SEMANTICS
REMOVE_LOCAL_DUPLICATION
~~~

Never move foreign lifecycle locally. Restore an approved ACL when foreign models leak into the local domain without altering foreign semantics.

## 17. Clean Code remediation

Correct only material canonical/root-cause issues such as generic service or utility buckets, boolean mode switches, domain primitive obsession, duplicated domain rules, hidden side effects, hidden temporal coupling, unnecessary mutability, or comment-dependent correctness.

Remove premature abstraction when it lacks a real current consumer or boundary. Collapse overengineering only when responsibility boundaries, domain ownership, dependency direction, and testability remain intact. Do not perform unrelated cleanup.

## 18. Production and test changes

Modify only files required by authorized Remediation Units. Allowed categories include:

~~~text
PRODUCTION_BEHAVIOR_FIX
DOMAIN_MODEL_FIX
AGGREGATE_BOUNDARY_FIX
INVARIANT_FIX
COMPONENT_BOUNDARY_FIX
SOLID_FIX
DEPENDENCY_DIRECTION_FIX
PERSISTENCE_FIX
INTEGRATION_FIX
OWNERSHIP_FIX
IDENTITY_LINEAGE_FIX
CONCURRENCY_FIX
STALE_STATE_FIX
IDEMPOTENCY_FIX
DURABILITY_RECOVERY_FIX
LEGACY_TRANSITION_FIX
MIGRATION_FIX
COMPATIBILITY_FIX
REQUIRED_SHARED_SUPPORT
~~~

For every unit define proof with applicable:

~~~text
UNIT
DOMAIN_INVARIANT
STATE_TRANSITION
APPLICATION
PERSISTENCE
INTEGRATION
CROSS_SPEC
CONCURRENCY
STALE
IDEMPOTENCY
RECOVERY
COMPATIBILITY
MIGRATION
NEGATIVE_PATH
ARCHITECTURE_GUARD
DEPENDENCY_DIRECTION
REGRESSION
CONFORMANCE
~~~

Never weaken assertions to obtain green tests. After every RU run the narrowest reliable behavioral and structural proof set and record tests run, passed, and failed.

Reconcile the shared capability record and witness matrix after every
remediation. A fixture/mock/fake/in-memory repository is not productive
availability and cannot make `TICKET_LOCAL_CLOSURE = YES` or `STATUS = READY`
true.

## 19. Finding and root-cause closure proof

For every MUST_REMEDIATE finding record:

~~~text
FINDING_ID
ROOT_CAUSE_ID
REMEDIATION_UNIT_ID
FIXED_FILES
TESTS_ADDED_OR_CHANGED
BEHAVIORAL_CORRECTION
STRUCTURAL_CORRECTION
CLOSURE_EVIDENCE
~~~

Classify:

~~~text
VALIDATED_AND_REMEDIATED
ALREADY_RESOLVED
REJECTED_BY_NEW_EVIDENCE
PARTIALLY_REMEDIATED
BLOCKED
~~~

PARTIALLY_REMEDIATED is not closure.

For every root cause record:

~~~text
ROOT_CAUSE_REMOVED = YES | NO
AFFECTED_RADIUS_CHECKED = YES | NO
KNOWN_MANIFESTATIONS_CLOSED = YES | NO
SYSTEMIC_TEST_EVIDENCE = PRESENT | NOT_REQUIRED | MISSING
STRUCTURAL_BOUNDARY_RESTORED = YES | NOT_APPLICABLE | NO
~~~

Blocking root causes require ROOT_CAUSE_REMOVED = YES.

## 20. Post-remediation structural self-check

Compare implementation with the approved design again:

~~~text
DOMAIN_MODEL_CONFORMANT
AGGREGATE_BOUNDARIES_CONFORMANT
INVARIANT_PLACEMENT_CONFORMANT
COMPONENT_BOUNDARIES_CONFORMANT
SOLID_CONFORMANT
DEPENDENCY_DIRECTION_CONFORMANT
CLEAN_CODE_STRUCTURALLY_ACCEPTABLE
CROSS_SPEC_BOUNDARY_CONFORMANT
~~~

Require for affected scope:

~~~text
UNJUSTIFIED_COMPONENT_COLLAPSES = 0
MISSING_REQUIRED_COMPONENTS = 0
AGGREGATE_BOUNDARY_VIOLATIONS = 0
DOMAIN_INVARIANT_BYPASSES = 0
UNENFORCED_INVARIANTS = 0
DOMAIN_RULE_DUPLICATION = 0
ANEMIC_DOMAIN_MODEL_INTRODUCED = NO
FAT_APPLICATION_SERVICE_INTRODUCED = NO
GOD_COMPONENTS_INTRODUCED = 0
UNJUSTIFIED_SOLID_VIOLATIONS = 0
DEPENDENCY_DIRECTION_VIOLATIONS = 0
INFRASTRUCTURE_LEAKAGE_POINTS = 0
~~~

This is a self-check only and does not close findings.

## 21. Acceptance and test revalidation

Re-evaluate materially affected acceptance criteria:

~~~text
SATISFIED
NOT_SATISFIED
BLOCKED
~~~

Record:

~~~text
ACCEPTANCE_CRITERIA_AFFECTED
ACCEPTANCE_CRITERIA_SATISFIED
ACCEPTANCE_CRITERIA_NOT_SATISFIED
ACCEPTANCE_CRITERIA_BLOCKED
~~~

Run canonical closure tests, Remediation Unit proof, ticket tests, structural and architecture guards, affected regressions, cross-spec tests, and broader suites when radius warrants. Record:

~~~text
TESTS_RUN
TESTS_PASSED
TESTS_FAILED
TESTS_SKIPPED
ENVIRONMENTAL_FAILURES
~~~

## 22. Regression hunt

Inspect the complete remediation diff and ask what changed beyond the original defect. Check behavior, domain ownership, aggregate boundaries, invariant placement, dependency direction, persistence, lifecycle, tests, cross-spec boundaries, compatibility, and error paths.

Classify:

~~~text
NO_REMEDIATION_REGRESSION
REMEDIATION_REGRESSION_FOUND
POSSIBLE_REMEDIATION_REGRESSION
~~~

Explicitly check:

~~~text
ANEMIC_DOMAIN_REGRESSION
GOD_COMPONENT_REGRESSION
FAT_SERVICE_REGRESSION
DIP_REGRESSION
DEPENDENCY_DIRECTION_REGRESSION
INVARIANT_PLACEMENT_REGRESSION
DOMAIN_RULE_DUPLICATION_REGRESSION
TESTABILITY_REGRESSION
CROSS_SPEC_BOUNDARY_REGRESSION
~~~

Correct same-root regressions before returning. If an independent new defect appears:

~~~text
IMPLEMENTATION_REMEDIATION_BLOCKED
reason = NEW_INDEPENDENT_DEFECT_REQUIRES_AUDIT
~~~

## 23. Ownership, diff, and evidence discipline

Require:

~~~text
OWNERSHIP_ERRORS = 0
FOREIGN_CAPABILITY_DUPLICATION = 0
NEW_ALTERNATE_AUTHORITY = 0
UNRELATED_CHANGE = 0
~~~

Where applicable also require IDENTITY_DRIFT = 0, HISTORY_REWRITE = 0, and LEGACY_DUAL_WRITER = 0.

Preserve frozen Goal, scope, Gap coverage, Requirements, acceptance authority, Does Not Implement, ownership, and dependency semantics. Update only permitted evidence such as changed files, test results, implementation notes, acceptance evidence, completion evidence, and remediation reference.

## 24. Pre-reaudit gates and status

Before sending back to audit verify:

~~~text
ALL_LOCAL_TICKET_BLOCKING_FINDINGS_CLOSED
ALL_ROOT_CAUSES_CLOSED
AFFECTED_RADIUS_CHECKED
REQUIRED_TESTS_PASS
AFFECTED_ACCEPTANCE_CRITERIA_PASS
NO_KNOWN_MATERIAL_BEHAVIOR_REGRESSION
BEHAVIORAL_SELF_CHECK = PASS
STRUCTURAL_SELF_CHECK = PASS
CAMPAIGN_MATRIX_COMPLETE = YES
ALL_SURFACE_ROWS_COVERED = YES
ALL_NEGATIVE_WITNESSES_PASS = YES
NO_UNEXPLAINED_PUBLIC_AUTHORITY_PATH = YES
NO_HIDDEN_CONCRETE_PROTOCOL = YES | NOT_APPLICABLE
SEMANTIC_PROGRESS_PROVEN = YES
ROOT_CAUSE_CLOSURE_PROOF_COMPLETE = YES
NO_KNOWN_MATERIAL_BEHAVIOR_REGRESSION = YES
NO_KNOWN_STRUCTURAL_REMEDIATION_REGRESSION = YES
REMEDIATION_PREFLIGHT = PASS
STATUS = VALIDATION_REQUIRED
~~~

Allowed transitions:

~~~text
VALIDATION_REQUIRED → IN_PROGRESS
IMPLEMENTED         → IN_PROGRESS
BLOCKED             → IN_PROGRESS
IN_PROGRESS         → VALIDATION_REQUIRED
IN_PROGRESS         → BLOCKED
~~~

Never transition to DONE. Successful remediation ends at VALIDATION_REQUIRED and is ready only for independent re-audit.

## 25. Blocking conditions

Return IMPLEMENTATION_REMEDIATION_BLOCKED for:

~~~text
UPSTREAM_REVALIDATION_REQUIRED
IMPLEMENTATION_REAUDIT_REQUIRED
IMPLEMENTATION_DESIGN_REVALIDATION_REQUIRED
SPECIFICATION_OR_PLANNING_CHANGE_REQUIRED
NEW_INDEPENDENT_DEFECT_REQUIRES_AUDIT
CANONICAL_FINDING_REQUIRES_REAUDIT
FOREIGN_AUTHORITY_CHANGE_REQUIRED
ENVIRONMENT_PREVENTS_REQUIRED_PROOF
~~~

`IMPLEMENTATION_REAUDIT_REQUIRED` is a follow-up action for an incomplete or
stale audit basis, not a blocker caused solely by drift that the audit already
reassessed. Use `BLOCKED_INSUFFICIENT_REASSESSMENT` or `STALE_AUDIT_BASIS` for
the baseline gate.

## 26. Remediation artifact

Create or update:

~~~text
<TICKET-ID>-implementation-remediation.md
~~~

It is evidence, not authority. Use this section order:

~~~text
1. Remediation Verdict
2. Ticket
3. Baseline Validation
4. Canonical Findings Received
5. Root Cause Analysis
6. Affected Radius
7. Remediation Units
8. Finding Closure
9. Root Cause Closure
10. Design Conformance Reconciliation
11. Files Changed
12. Gap / Requirement / Acceptance Impact
13. Tests
14. Behavioral Regression Self-Check
15. Structural Regression Self-Check
16. Ownership / Authority
17. Completion Evidence
18. Remaining Blockers
19. Pre-Reaudit Self-Check
20. Remediation Gate
~~~

## 27. Remediation metrics

Report:

~~~text
AUDIT_ROUND
CANONICAL_FINDINGS_RECEIVED
BLOCKING_FINDINGS_RECEIVED
FINDINGS_REMEDIATED
FINDINGS_ALREADY_RESOLVED
FINDINGS_REJECTED_BY_NEW_EVIDENCE
FINDINGS_PARTIALLY_REMEDIATED
FINDINGS_BLOCKED
ROOT_CAUSES_IDENTIFIED
ROOT_CAUSES_CLOSED
SYSTEMIC_ROOT_CAUSES
CAMPAIGNS_TOTAL
CAMPAIGNS_NON_CONVERGING
CONVERGENCE_STATUS
EXPANDED_RADIUS_REQUIRED
REMEDIATION_PREFLIGHT
REMEDIATION_UNITS
ADDITIONAL_SAME_ROOT_MANIFESTATIONS_FIXED
CHANGED_PRODUCTION_FILES
CHANGED_TEST_FILES
TESTS_RUN
TESTS_PASSED
TESTS_FAILED
STRUCTURAL_FINDINGS_REMEDIATED
AGGREGATE_BOUNDARY_VIOLATIONS
DOMAIN_INVARIANT_BYPASSES
UNENFORCED_INVARIANTS
DOMAIN_RULE_DUPLICATION
ANEMIC_DOMAIN_MODEL_INTRODUCED
FAT_APPLICATION_SERVICE_INTRODUCED
GOD_COMPONENTS_INTRODUCED
UNJUSTIFIED_SOLID_VIOLATIONS
DEPENDENCY_DIRECTION_VIOLATIONS
INFRASTRUCTURE_LEAKAGE_POINTS
KNOWN_BEHAVIORAL_REMEDIATION_REGRESSIONS
KNOWN_STRUCTURAL_REMEDIATION_REGRESSIONS
OWNERSHIP_ERRORS
FOREIGN_CAPABILITY_DUPLICATION
COMPLETION_EVIDENCE_MISSING
BASE_REPORT_PATH
ROUND_DELTA_PATH
FINDING_LINEAGE_LEDGER_PATH
BASE_REPORT_IMMUTABLE
ROUND_DELTA_COMPLETE
FINDING_LINEAGE_LEDGER_COMPLETE
~~~

## 28. Re-audit routing

Successful remediation returns to a checkpoint before audit. The orchestrator must run `checkpoint-implemented-ticket` and then rerun ticket conformance, implementation behavior, implementation-design conformance, and architecture boundaries when required. Do not request only the previously failing specialist.

## Critical rules

1. IMA is canonical; do not create a parallel backlog from specialist findings.
2. Fix root causes and inspect their reasonable ticket-scoped radius.
3. Preserve the approved Implementation Design.
4. Structural findings require structural correction.
5. DDD and SOLID are semantic, not ceremonial.
6. Aggregate invariants and lifecycle authorities must remain protected.
7. Dependency direction and foreign ownership must remain explicit.
8. Clean Code does not authorize unrelated refactoring.
9. Minimum complete correction is preferred over the smallest diff.
10. Tests are proof; never weaken assertions.
11. Hunt both behavioral and structural regressions.
12. Self-check is not independent proof.
13. Never mark DONE or claim final conformance.
14. Return to VALIDATION_REQUIRED only after all local gates pass.

## Core completion invariant

Implementation remediation is locally complete only when every canonical finding with `BLOCKS_TICKET_DONE = YES` has been revalidated and completely remediated, already resolved, or rejected by objective evidence; open integrated-only findings remain traceable and routed rather than being falsely closed; related findings are traced to actual root causes; each validated systemic root cause is removed across its reasonable ticket-scoped radius; all changes remain inside frozen authority; the approved Implementation Design remains structurally valid; domain behavior, aggregate boundaries, invariant placement, lifecycle authority, persistence responsibility, dependency direction, cross-spec boundaries, and ownership remain correct; no anemic-domain regression, god component, fat service, duplicate domain rule, unjustified SOLID violation, infrastructure leak, invariant bypass, premature workaround, or material testability degradation remains; every corrected behavior has automated proof; affected acceptance criteria pass; no unrelated changes exist; regression hunts find no known material regression; completion evidence is current; and the ticket returns to VALIDATION_REQUIRED solely for independent re-audit.

When this holds:

~~~text
TICKET_IMPLEMENTATION_REMEDIATION_COMPLETE
TICKET_GATE: READY_FOR_REAUDIT
~~~

The mandatory next action is checkpoint-implemented-ticket; its post-checkpoint operation is audit-implemented-ticket.

## Required final response

Return:

~~~text
Remediation:
<path>

Remediation verdict:
TICKET_IMPLEMENTATION_REMEDIATION_COMPLETE
|
TICKET_IMPLEMENTATION_REMEDIATION_BLOCKED

Ticket:
<TICKET-ID>

Implementation Unit:
<ID>

Audit round:
<number>

Canonical audit:
<path>

Repository baseline:
<commit>

Current HEAD:
<commit>

Canonical findings:
- Received: <n>
- Blocking: <n>
- Remediated: <n>
- Remaining: <n>

Root causes:
- Identified: <n>
- Closed: <n>
- Systemic: <n>
- Additional same-root manifestations fixed: <n>

Remediation units:
<count>

Files:
- Production changed: <n>
- Tests changed: <n>

Behavior:
- Tests run: <n>
- Tests passed: <n>
- Tests failed: <n>
- Acceptance satisfied: <n>/<n>
- Known remediation regressions: <n>

Design conformance:
- Aggregate boundary violations: <n>
- Domain invariant bypasses: <n>
- Unenforced invariants: <n>
- Domain rule duplications: <n>
- Anemic domain regressions: <n>
- Fat application services: <n>
- God components: <n>
- Unjustified SOLID violations: <n>
- Dependency direction violations: <n>
- Infrastructure leakage points: <n>
- Structural remediation regressions: <n>

Authority:
- Ownership errors: <n>
- Foreign capability duplication: <n>

Completion evidence missing:
<count>

Campaign / convergence:
- Campaigns total: <n>
- Campaigns non-converging: <n>
- Convergence status: <CONVERGING|NON_CONVERGING|CLOSED|BLOCKED>
- Expanded radius required: <YES|NO>
- Campaign matrix complete: <YES|NO>
- All surface rows covered: <YES|NO>
- All negative witnesses pass: <YES|NO>

Remediation preflight:
- Semantic progress proven: <YES|NO>
- Root-cause closure proof complete: <YES|NO>
- Behavioral regression self-check: <PASS|FAIL>
- Structural regression self-check: <PASS|FAIL>
- REMEDIATION_PREFLIGHT: <PASS|BLOCKED>

Report structure:
- Base report: <path>
- Round delta: <path>
- Finding lineage ledger: <path>

Final status:
VALIDATION_REQUIRED
|
BLOCKED

Gate:
READY_FOR_REAUDIT
|
BLOCKED

Next action:
checkpoint-implemented-ticket
|
audit-implemented-ticket
|
<required upstream action>
~~~

If blocked, list only:

~~~text
Blocker/finding ID
Reason
Required upstream action
~~~

Do not mark the ticket DONE.
