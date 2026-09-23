---
name: audit-implementation-design-conformance
description: >
  Independently audit whether an implemented ticket preserves its approved Implementation Design and structural quality constraints. Verify DDD responsibility placement, aggregate boundaries, domain invariants, SOLID principles, dependency direction, component boundaries, cross-spec integration seams, persistence and lifecycle authority, Clean Code structural quality, testability, design deviations, and implementation structural self-check claims against the actual repository code. Use as a specialist audit inside audit-implemented-ticket for every implemented ticket with an approved Implementation Design. This skill is read-only. It does not remediate code, modify tests, redesign the ticket, alter upstream artifacts, approve the ticket, or produce the canonical implementation verdict.
---

# Audit Implementation Design Conformance

## Purpose

Independently determine whether an implemented ticket preserves the code structure and structural quality constraints defined by its approved Implementation Design.

This specialist answers only:

~~~text
Did the actual implementation preserve the approved design quality and structural boundaries?
~~~

It does not decide whether the entire ticket acceptance is satisfied, whether runtime behavior is semantically correct, whether the ticket may move to DONE, or whether global architecture is conformant. Those responsibilities belong to other specialists and canonical consolidation.

## Specialist position

~~~text
VALIDATION_REQUIRED
        ↓
audit-implemented-ticket
        ↓
audit-ticket-conformance
audit-implementation-behavior
audit-implementation-design-conformance
audit-architecture-boundaries
        ↓
consolidate-implementation-audit
~~~

Produce specialist evidence only. Never produce TICKET_IMPLEMENTATION_CONFORMANT, READY_FOR_DONE, or DONE.

## Core principles

1. The approved Implementation Design is the structural blueprint.
2. ADR, portfolio, SPEC, contracts, Gap Matrix, Plan, and ticket authority override the design when they conflict.
3. Actual code and tests, not implementation claims, are the audit subject.
4. The implementation structural self-check is evidence, not authority.
5. DDD is evaluated semantically, not ceremonially.
6. SOLID is evaluated materially, not by class or interface count.
7. Clean Code is evaluated structurally, not through arbitrary size limits.
8. Repository architecture remains authoritative over textbook patterns.
9. A locally different implementation may conform when responsibility, ownership, dependency direction, invariant placement, and testability are preserved.
10. A design deviation is not automatically a defect; an unjustified material deviation is.
11. Do not reward abstraction for its own sake.
12. Do not punish simple code for avoiding unnecessary patterns.
13. Do not redesign while auditing.
14. Complete the full audit even after a major finding.

Read `../_shared/authority-completeness-gates.md`. This specialist confirms
that the approved design preserved upstream authority; it does not repair an
authority gap discovered in implementation. If implementation exposes such an
escape, classify it using the shared authority-gap category and identify the
earliest responsible artifact.

Also read `../_shared/finding-completion-readiness-contract.md`. Classify the
timing and ownership of each design finding separately from its severity. An
integrated-proof availability defect can remain open without blocking local
ticket DONE when local acceptance does not require it.

Also read `../_shared/authority-provenance-anti-forgery-contract.md`. For every
authority-bearing result, receipt, adapter, or proof named by the design,
verify issuer ownership, identity/brand, consumer-side verification, stale or
mutation handling, forged-input rejection, caller-injection rejection, and
alternate-adapter contract evidence.

## Operating mode

~~~text
READ_ONLY
INDEPENDENT
ADVERSARIAL
DESIGN_FIRST
REPOSITORY_AWARE
DDD_AWARE
SOLID_AWARE
CLEAN_CODE_AWARE
DEPENDENCY_DIRECTION_AWARE
INVARIANT_AWARE
TESTABILITY_AWARE
EVIDENCE_REQUIRED
NO_REMEDIATION
NO_ARCHITECTURE_REDESIGN
NO_CODE_CHANGES
NO_TEST_CHANGES
NO_SELF_APPROVAL
~~~

## Authority precedence

~~~text
Accepted ADRs
    >
Approved SPEC Portfolio
    >
Conformant Component SPEC
    >
Explicit Cross-Spec Contracts
    >
Validated Gap Matrix
    >
Conformant Implementation Plan
    >
Conformant Implementation Ticket
    >
Approved Implementation Design
    >
Actual Repository Implementation
    >
Implementation Structural Self-Check
~~~

The Implementation Design governs structure only within upstream authority. If it conflicts with upstream authority and meaningful judgment is impossible, return:

~~~text
SPECIALIST_AUDIT_BLOCKED
reason = IMPLEMENTATION_DESIGN_AUTHORITY_CONFLICT
~~~

## Preconditions

Require:

~~~text
TICKET_STATUS = VALIDATION_REQUIRED
~~~

or the repository-equivalent implemented state pending independent validation.

Require an approved design artifact containing:

~~~text
IMPLEMENTATION_DESIGN_READY
IMPLEMENTATION_DESIGN_GATE: READY_FOR_IMPLEMENTATION
UPSTREAM_AUTHORITY_PRECONDITIONS
~~~

Require the implementation to be pinned to the orchestrator's semantic target pair:

```text
AUDIT_TARGET_HEAD = base commit
AUDIT_TARGET_STATE_FINGERPRINT = base commit plus relevant working-tree overlay
```

The implementation may be uncommitted when the overlay is included in the
fingerprint and remains unchanged during the audit. Do not reject an otherwise
present implementation merely because it is absent from the base commit.

If no approved design exists:

~~~text
SPECIALIST_AUDIT_BLOCKED
reason = IMPLEMENTATION_DESIGN_MISSING
~~~

If the target implementation or its overlay fingerprint differs from the
pinned semantic state:

~~~text
SPECIALIST_AUDIT_BLOCKED
reason = AUDIT_TARGET_MISMATCH
~~~

If implementation is unavailable in both the base commit and the pinned
working-tree overlay:

~~~text
SPECIALIST_AUDIT_BLOCKED
reason = IMPLEMENTATION_NOT_AVAILABLE
~~~

If the design lacks current, applicable upstream authority proofs or its
`UPSTREAM_AUTHORITY_PRECONDITIONS` is blocked, return:

```text
SPECIALIST_AUDIT_BLOCKED
reason = IMPLEMENTATION_DESIGN_BLOCKED_BY_UPSTREAM_AUTHORITY
```

## Required inputs

Identify:

- ticket;
- approved Implementation Design;
- ticket Implementation Unit;
- relevant portfolio authority;
- conformant component SPEC;
- relevant accepted ADRs;
- relevant cross-spec contracts;
- implementation baseline;
- pinned audit target HEAD and state fingerprint;
- actual changed implementation files;
- actual changed tests;
- implementation notes;
- recorded design deviations;
- implementation structural self-check;
- relevant repository architecture conventions.

## Phase 1 — Audit subject and baseline

Record:

~~~text
TICKET_ID
TICKET_PATH
IMPLEMENTATION_DESIGN_PATH
IMPLEMENTATION_UNIT
AUDIT_TARGET_HEAD
AUDIT_TARGET_STATE_FINGERPRINT
IMPLEMENTATION_BASELINE
IMPLEMENTATION_HEAD
IMPLEMENTATION_STATE_FINGERPRINT
IMPLEMENTATION_DIFF
DESIGN_VERDICT
DESIGN_GATE
DESIGN_BASELINE
~~~

Do not audit a moving or ambiguous subject.

## Phase 2 — Load the complete approved design

Extract:

~~~text
IMPLEMENTATION_RESPONSIBILITY
REPOSITORY_ARCHITECTURE_CONTEXT
DOMAIN_MODEL_ASSESSMENT
AGGREGATE_BOUNDARIES
ENTITIES
VALUE_OBJECTS
DOMAIN_SERVICES
DOMAIN_POLICIES
DOMAIN_EVENTS
ANTI_CORRUPTION_BOUNDARIES
RESPONSIBILITY_DECOMPOSITION
PROPOSED_COMPONENTS
SOLID_ASSESSMENT
DEPENDENCY_DIRECTION
INVARIANT_PLACEMENT
PERSISTENCE_DESIGN
LIFECYCLE_DESIGN
CROSS_SPEC_INTEGRATION
MAIN_INTERACTION_FLOW
FAILURE_RECOVERY_FLOW
CLEAN_CODE_ASSESSMENT
TEST_DESIGN
STRUCTURAL_RISK_ASSESSMENT
IMPLEMENTATION_SEQUENCE
EXPECTED_FILES
UPSTREAM_AUTHORITY_PRECONDITIONS
~~~

Do not audit from the design summary only.

### Upstream authority defense

For each provenance record, independently confirm:

```text
ISSUER_IS_AUTHORIZED = YES
PROOF_SCOPE_IS_EXACT = YES
CONSUMER_VERIFIES_PROVENANCE = YES
FORGERY_PATH_REJECTED = YES
CALLER_INJECTION_REJECTED = YES
ALTERNATE_ADAPTER_CONTRACT = PASS | NOT_APPLICABLE with reason
```

A public constructor, copied shape, caller-provided boolean, or passing happy
path is not provenance proof.

Confirm, by proof ID and revision, the upstream `SPEC_IMPLEMENTABILITY_CHECK`
and applicable `AGGREGATE_IDENTITY_PROOF`, `AGGREGATE_RECONSTRUCTION_PROOF`,
lifecycle, persistence, and cross-SPEC evidence. Check only for stale,
contradictory, missing, or newly exposed authority. Do not repeat the full SPEC
audit. A design or implementation that invents canonical identity, lifecycle,
progression provenance, ownership, recovery semantics, persistence meaning, or
missing domain invariants is non-conformant and must not be locally approved.
Classify such escapes as `IDENTITY_AUTHORITY_GAP`,
`REHYDRATION_AUTHORITY_GAP`, `LIFECYCLE_AUTHORITY_GAP`,
`PERSISTENCE_SEMANTICS_GAP`, or `CROSS_SPEC_AUTHORITY_GAP`, and do not treat
them as ordinary design deviations.

For every external dependency, verify the design's
`AUTHORITY_CONSUMPTION_PROOF` and `PRODUCER_CONSUMER_CONTRACT_PROOF` preserve a
real consumer seam, producer, returned data, version/revision, failure
semantics, independent authority/contract/local-testability/productive-
availability dimensions, dependency class, availability evidence, and blocking
effect. A fixture/mock/fake
is never productive availability. For mutable authority, verify
`TEMPORAL_AUTHORITY_PROOF`; flag reused observations, self-comparison, caller
trust, or CAS-only revalidation. Run `CALLER_AS_AUTHORITY_CHECK` and report
`CALLER_SUPPLIED_AUTHORITY_BYPASS` when applicable.

Recalculate `EXECUTION_READY`, `LOCAL_CLOSURE`, and every witness row. If a
design claims local closure while a capability classified
`REQUIRED_FOR_LOCAL_EXECUTION` or `REQUIRED_FOR_LOCAL_CLOSURE` has
`PRODUCTIVE_AVAILABILITY = NO`, or a witness is not executable at closure,
report a blocking design finding and do not approve the design.

## Phase 3 — Load implementation claims

Capture and independently verify:

~~~text
DESIGN_DEVIATIONS
DOMAIN_MODEL_CONFORMANT
AGGREGATE_BOUNDARIES_CONFORMANT
INVARIANT_PLACEMENT_CONFORMANT
COMPONENT_BOUNDARIES_CONFORMANT
SOLID_CONFORMANT
DEPENDENCY_DIRECTION_CONFORMANT
CLEAN_CODE_STRUCTURALLY_ACCEPTABLE
CROSS_SPEC_BOUNDARY_CONFORMANT
STRUCTURAL_SELF_CHECK
~~~

Every claim is evidence to test, not authority.

## Phase 4 — Reconstruct the repository diff

Inspect actual code and tests changed by the ticket. Do not rely solely on implementation-reported file lists.

Classify each changed file:

~~~text
DESIGN_EXPECTED
TICKET_REQUIRED_ADDITION
LOCAL_IMPLEMENTATION_ADAPTATION
TEST_SUPPORT
UNPLANNED_STRUCTURAL_CHANGE
UNRELATED_CHANGE
~~~

Use repository evidence to distinguish necessary support from scope drift.

## Phase 5 — Responsibility conformance

For every designed responsibility prove there is one clear actual implementation home.

Use:

| Responsibility | Designed Home | Actual Home | Result |
| --- | --- | --- | --- |

Classify:

~~~text
PRESERVED
LOCALLY_ADAPTED
COLLAPSED
SCATTERED
MISSING
MOVED_TO_WRONG_LAYER
MOVED_TO_WRONG_OWNER
~~~

Required targets:

~~~text
MISSING_RESPONSIBILITIES = 0
WRONG_RESPONSIBILITY_PLACEMENTS = 0
~~~

## Phase 6 — Component conformance

Compare every significant designed component:

| Designed Component | Intended Responsibility | Actual Implementation | Result |
| --- | --- | --- | --- |

Classify:

~~~text
PRESERVED
LOCALLY_ADAPTED
COLLAPSED
UNJUSTIFIED_SPLIT
MISSING
UNPLANNED_COMPONENT
~~~

LOCALLY_ADAPTED is acceptable only when semantic responsibility, domain ownership, invariant placement, dependency direction, and testability remain intact.

### Material collapse

Report UNJUSTIFIED_COMPONENT_COLLAPSE when distinct designed responsibilities gain unrelated reasons to change, such as:

- Aggregate behavior combined with application orchestration;
- domain decision combined with repository persistence;
- orchestration combined with serialization, recovery, and integration;
- foreign mapping combined with local lifecycle authority.

Do not flag a harmless private implementation merge as structural collapse.

## Phase 7 — DDD domain model audit

Independently inspect the approved domain model and actual implementation:

~~~text
DOMAIN_CONCEPTS
AGGREGATE_ROOTS
ENTITIES
VALUE_OBJECTS
DOMAIN_SERVICES
DOMAIN_POLICIES
DOMAIN_EVENTS
ANTI_CORRUPTION_BOUNDARIES
~~~

Do not require categories the approved design did not require.

### Aggregate boundaries

For each designed Aggregate verify:

~~~text
AGGREGATE_ROOT
INVARIANTS_PROTECTED
MUTATION_ENTRY_POINTS
CONSISTENCY_BOUNDARY
TRANSACTION_BOUNDARY
DURABLE_ENFORCEMENT
~~~

Detect:

~~~text
AGGREGATE_BOUNDARY_VIOLATION
AGGREGATE_INTERNAL_MUTATION_BYPASS
MULTIPLE_TRANSITION_AUTHORITIES
INVALID_TRANSACTION_BOUNDARY
~~~

Require:

~~~text
AGGREGATE_BOUNDARY_VIOLATIONS = 0
~~~

### Anemic domain model

Determine whether meaningful approved domain behavior moved into generic services, handlers, controllers, repositories, infrastructure, or external callers.

~~~text
ANEMIC_DOMAIN_MODEL_INTRODUCED = YES | NO
~~~

Use YES only where the design contains meaningful domain rules. Do not penalize simple data structures with no domain behavior.

### Invariant placement

For every approved invariant use:

| Invariant | Designed Enforcement | Actual Enforcement | Durable Enforcement | Actual Test | Result |
| --- | --- | --- | --- | --- | --- |

Classify:

~~~text
PRESERVED
LOCALLY_ADAPTED
MOVED
DUPLICATED
BYPASSABLE
UNENFORCED
~~~

Require:

~~~text
UNENFORCED_INVARIANTS = 0
DOMAIN_INVARIANT_BYPASSES = 0
~~~

### Domain rule duplication

Search for independent implementations of the same domain rule, including lifecycle, stale revision, eligibility, or foreign outcome interpretation. Report DOMAIN_RULE_DUPLICATION. Do not confuse duplicated mechanical validation with duplicate canonical domain authority unless semantics are actually duplicated.

### Value objects

Where the design introduced meaningful Value Objects, verify that identity, validation, canonicalization, and comparison semantics remain inside them. Detect:

~~~text
VALUE_OBJECT_COLLAPSED_TO_PRIMITIVE
VALUE_OBJECT_SEMANTICS_DUPLICATED_EXTERNALLY
PRIMITIVE_OBSESSION_REGRESSION
~~~

Do not demand Value Objects absent from the design unless the actual code makes explicit required semantics structurally impossible.

### Domain Services

Verify approved Domain Services contain domain behavior and do not become application orchestration or generic rule buckets. Detect DOMAIN_SERVICE_SCOPE_LEAK and GENERIC_DOMAIN_SERVICE_BUCKET.

### Application Services

Verify Application Services primarily load, coordinate, invoke domain behavior, call dependencies, persist, and integrate. Detect FAT_APPLICATION_SERVICE when a service materially owns domain invariants, lifecycle decisions, persistence semantics, mapping, recovery, integration, or unrelated rule sets.

~~~text
FAT_APPLICATION_SERVICE_INTRODUCED = YES | NO
~~~

### Repository and persistence authority

Repositories and infrastructure may enforce durable constraints but must not absorb canonical semantic decisions unless explicitly designed.

Distinguish:

~~~text
durable enforcement
business-rule authority
~~~

## Phase 8 — Cross-spec and ACL audit

For each designed ACL or integration seam verify:

~~~text
FOREIGN_MODEL
LOCAL_MODEL
TRANSLATION_BOUNDARY
IDENTITY_PRESERVATION
FAILURE_PRESERVATION
~~~

Detect:

~~~text
FOREIGN_MODEL_LEAKAGE
FOREIGN_AUTHORITY_REIMPLEMENTED
ACL_BYPASSED
DESIGN_BOUNDARY_VIOLATED
~~~

This specialist audits structural seam preservation only. Broader architecture or ownership judgments are supporting evidence for the architecture specialist and consolidator.

## Phase 9 — SOLID audit

Evaluate actual code semantically:

~~~text
SRP
OCP
LSP
ISP
DIP
~~~

Only material violations are findings.

### SRP

Ask whether each significant component has one coherent reason to change. Detect SRP_VIOLATION, RESPONSIBILITY_MIXING, and GOD_COMPONENT. Do not split cohesive Aggregate behavior merely because a class is large.

### OCP

Evaluate actual approved variation points. Detect OCP_VIOLATION when an established variation boundary is repeatedly forced through central logic. Detect PREMATURE_EXTENSIBILITY for unnecessary factories, strategies, providers, extension points, or plugins.

### LSP

Where polymorphism exists, verify behavioral substitutability. Detect LSP_VIOLATION when a subtype changes semantic meaning, rejects valid base behavior, or requires concrete-type knowledge.

### ISP

Inspect consumer-facing interfaces. Detect FAT_INTERFACE or ISP_VIOLATION when consumers depend on unrelated capabilities. Interface method count alone is not evidence.

### DIP and dependency direction

Compare the actual graph with approved direction. Detect DIP_VIOLATION and DEPENDENCY_INVERSION_VIOLATION when higher-level behavior depends on infrastructure despite an approved inversion seam.

Report:

~~~text
DEPENDENCY_DIRECTION_VIOLATIONS
INFRASTRUCTURE_LEAKAGE_POINTS
~~~

Suspicious examples when forbidden by design include Domain → ORM, filesystem, HTTP client, serializer framework, or concrete infrastructure adapter. Do not add an abstraction merely to zero a metric when no boundary exists.

## Phase 10 — Persistence, lifecycle, and recovery

### Persistence

When persistence design exists, verify:

~~~text
AGGREGATE_STORAGE_BOUNDARY
REPOSITORY_PORT
SERIALIZATION_BOUNDARY
CONCURRENCY_MECHANISM
ATOMICITY_BOUNDARY
DURABLE_INVARIANT_PROTECTION
REGISTRY_INDEX_RELATIONSHIP
RECOVERY_BEHAVIOR
~~~

Classify:

~~~text
PERSISTENCE_DESIGN_PRESERVED
PERSISTENCE_DESIGN_LOCALLY_ADAPTED
PERSISTENCE_BOUNDARY_VIOLATED
~~~

### Lifecycle

When lifecycle exists, verify:

~~~text
TRANSITION_OWNER
VALID_TRANSITIONS
INVALID_TRANSITIONS
RECOVERY_TRANSITIONS
TERMINAL_TRANSITIONS
FORBIDDEN_BYPASS_PATHS
~~~

Detect LIFECYCLE_AUTHORITY_DUPLICATED, GENERIC_STATE_MUTATION_BYPASS, and TERMINAL_STATE_BYPASS.

### Failure and recovery

When recovery design exists, verify placement of:

~~~text
FAILURE_DETECTION
DURABLE_EVIDENCE
FAILURE_OWNER
RETRY_OWNER
IDEMPOTENCY_BOUNDARY
RECOVERY_PATH
RECONCILIATION_PATH
~~~

Detect RECOVERY_STRUCTURE_COLLAPSED, RETRY_OWNERSHIP_DRIFT, and IDEMPOTENCY_BOUNDARY_DRIFT. Runtime behavior correctness belongs primarily to the behavior specialist; this audit checks structural placement.

## Phase 11 — Clean Code structural audit

Inspect changed implementation for material:

~~~text
CLEAR_DOMAIN_NAMING
COHESIVE_METHODS
EXPLICIT_SIDE_EFFECTS
EXPLICIT_MUTATION_BOUNDARIES
BOOLEAN_MODE_SWITCH
LONG_PARAMETER_LIST
DOMAIN_PRIMITIVE_OBSESSION
MAGIC_VALUES
GENERIC_UTIL_BUCKETS
GENERIC_SERVICE_BUCKETS
DOMAIN_RULE_DUPLICATION
DEEP_NESTING
COMMENT_DEPENDENT_CORRECTNESS
HIDDEN_SIDE_EFFECT
HIDDEN_TEMPORAL_COUPLING
UNNECESSARY_MUTABILITY
~~~

Do not enforce arbitrary line limits or personal formatting preferences. Flag vague names such as Manager, Helper, Util, CommonService, GenericService, or Processor only when they materially obscure responsibility and are not repository-standard.

### Abstractions and overengineering

Every new abstraction should have a concrete:

~~~text
BOUNDARY
CONSUMER
CURRENT_REASON
~~~

Detect PREMATURE_ABSTRACTION and OVERENGINEERING for speculative factories, strategies, providers, wrapper chains, event infrastructure for local calls, or generic frameworks inside one ticket. Do not penalize complexity required by domain semantics.

## Phase 12 — Testability and structural test audit

Compare approved Test Design with actual structure. Verify critical behavior remains independently testable.

Detect TESTABILITY_REGRESSION when a separable rule now requires broad infrastructure because responsibilities were coupled.

For design-critical behavior verify applicable tests exist for:

~~~text
AGGREGATE_INVARIANT
STATE_TRANSITION
DEPENDENCY_DIRECTION
PERSISTENCE_BOUNDARY
CONCURRENCY_GUARD
IDEMPOTENCY
RECOVERY
ACL_MAPPING
LEGACY_BOUNDARY
~~~

Do not duplicate the behavior specialist's full runtime correctness audit. Focus on tests that protect structural and invariant boundaries.

When architecture guards were required, verify that they actually enforce dependency direction, forbidden references, authority duplication, legacy productive route, or foreign ownership boundary.

Also verify the approved `ACCEPTANCE_WITNESS_MATRIX` and
`DESIGN_TEST_COVERAGE_GATE`. Compare each normative verb with a direct test
target; register/list is not progress proof, sequential duplicate is not
concurrency proof, and source inspection is not architecture-guard proof.
Reconcile each row's required capability, independent capability dimensions,
dependency class, evidence type, and `WITNESS_EXECUTABLE_AT_LOCAL_CLOSURE`.
Record:

```text
DIRECT_BEHAVIOR_WITNESSES
PROXY_ONLY_BEHAVIORS
UNTESTED_STATE_TRANSITIONS
UNPROVEN_CONCURRENCY_CONTRACTS
MISSING_ARCHITECTURE_GUARDS
DESIGN_TEST_COVERAGE_GATE = PASS | BLOCKED
```

Do not repeat the behavior specialist's full runtime audit. Report only stale,
missing, contradictory, or structurally ineffective witness evidence here.

Classify:

~~~text
ARCHITECTURE_GUARD_PRESENT
ARCHITECTURE_GUARD_MISSING
ARCHITECTURE_GUARD_INEFFECTIVE
~~~

## Phase 13 — Design deviation audit

Inspect every recorded DESIGN_DEVIATION and classify independently:

~~~text
VALID_LOCAL_IMPLEMENTATION_DETAIL
VALID_REPOSITORY_REALITY_ADJUSTMENT
UNDECLARED_MATERIAL_DEVIATION
INVALID_COMPONENT_BOUNDARY_CHANGE
INVALID_DOMAIN_MODEL_CHANGE
INVALID_DEPENDENCY_DIRECTION_CHANGE
INVALID_INVARIANT_PLACEMENT_CHANGE
INVALID_PERSISTENCE_BOUNDARY_CHANGE
INVALID_LIFECYCLE_AUTHORITY_CHANGE
INVALID_CROSS_SPEC_BOUNDARY_CHANGE
INVALID_RECOVERY_MODEL_CHANGE
~~~

Do not trust the implementation's deviation list. Search the actual implementation for undisclosed structural differences. Material undeclared deviations target zero.

## Phase 14 — Structural self-check verification

Compare the implementation's self-check with independently calculated results:

~~~text
IMPLEMENTATION_STRUCTURAL_SELF_CHECK
~~~

Classify:

~~~text
SELF_CHECK_CONFIRMED
SELF_CHECK_FALSE_NEGATIVE
SELF_CHECK_FALSE_PASS
SELF_CHECK_INCOMPLETE
~~~

A PASS claim does not suppress findings.

## Phase 15 — Independent metrics

Calculate:

~~~text
DESIGNED_RESPONSIBILITIES
RESPONSIBILITIES_PRESERVED
RESPONSIBILITIES_LOCALLY_ADAPTED
RESPONSIBILITIES_MISSING
WRONG_RESPONSIBILITY_PLACEMENTS

DESIGNED_COMPONENTS
COMPONENTS_PRESERVED
COMPONENTS_LOCALLY_ADAPTED
UNJUSTIFIED_COMPONENT_COLLAPSES
UNJUSTIFIED_COMPONENT_SPLITS
MISSING_REQUIRED_COMPONENTS
UNPLANNED_STRUCTURAL_COMPONENTS

AGGREGATE_BOUNDARY_VIOLATIONS
DOMAIN_INVARIANT_BYPASSES
UNENFORCED_INVARIANTS
INVARIANT_PLACEMENT_DEVIATIONS
DOMAIN_RULE_DUPLICATION

ANEMIC_DOMAIN_MODEL_INTRODUCED
FAT_APPLICATION_SERVICE_INTRODUCED
FAT_INTERFACE_INTRODUCED
GOD_COMPONENTS_INTRODUCED

SRP_VIOLATIONS
OCP_VIOLATIONS
LSP_VIOLATIONS
ISP_VIOLATIONS
DIP_VIOLATIONS
UNJUSTIFIED_SOLID_VIOLATIONS

DEPENDENCY_DIRECTION_VIOLATIONS
INFRASTRUCTURE_LEAKAGE_POINTS

PRIMITIVE_OBSESSION_REGRESSIONS
GENERIC_SERVICE_BUCKETS
GENERIC_UTIL_BUCKETS
PREMATURE_ABSTRACTIONS
OVERENGINEERING_FINDINGS
HIDDEN_SIDE_EFFECTS
HIDDEN_TEMPORAL_COUPLINGS
IDENTITY_AUTHORITY_GAPS
RECONSTRUCTION_AUTHORITY_GAPS
LIFECYCLE_AUTHORITY_GAPS
PERSISTENCE_SEMANTICS_GAPS
CROSS_SPEC_AUTHORITY_GAPS
UPSTREAM_AUTHORITY_CONFORMANCE

TESTABILITY_REGRESSIONS
MISSING_STRUCTURAL_TESTS

RECORDED_DESIGN_DEVIATIONS
VALID_DESIGN_DEVIATIONS
INVALID_DESIGN_DEVIATIONS
UNDECLARED_DESIGN_DEVIATIONS
~~~

## Audit dimensions

Report each as PASS, FINDINGS, BLOCKED, or NOT_APPLICABLE:

~~~text
DOMAIN_MODEL_CONFORMANCE
AGGREGATE_BOUNDARY_CONFORMANCE
INVARIANT_PLACEMENT_CONFORMANCE
COMPONENT_BOUNDARY_CONFORMANCE
SRP_CONFORMANCE
OCP_CONFORMANCE
LSP_CONFORMANCE
ISP_CONFORMANCE
DIP_CONFORMANCE
DEPENDENCY_DIRECTION_CONFORMANCE
PERSISTENCE_BOUNDARY_CONFORMANCE
LIFECYCLE_DESIGN_CONFORMANCE
CROSS_SPEC_DESIGN_CONFORMANCE
UPSTREAM_AUTHORITY_CONFORMANCE
CLEAN_CODE_STRUCTURAL_CONFORMANCE
TESTABILITY_CONFORMANCE
DESIGN_DEVIATION_CONFORMANCE
STRUCTURAL_SELF_CHECK_CONFORMANCE
~~~

## Findings

Use IDs:

~~~text
IDC-CRITICAL-###
IDC-MAJOR-###
IDC-MINOR-###
IDC-INFO-###
~~~

### Severity

CRITICAL: wrong domain authority, bypass of a critical invariant, duplicate lifecycle authority, corrupted consistency boundary, foreign authority reimplementation, material dependency/ownership architecture violation, or implementation/design evidence exposing an upstream identity, rehydration, lifecycle, persistence, or cross-SPEC authority gap.

MAJOR: anemic-domain regression, god component, fat application service, missing designed component, unjustified collapse, DIP or dependency-direction violation, invariant-placement drift, domain-rule duplication, material testability regression, or undeclared material design deviation.

MINOR: localized structural defect that does not materially invalidate responsibility or authority, such as localized premature abstraction, minor ISP issue, localized primitive obsession, or materially obscuring naming.

INFO: non-blocking observation.

Do not create findings for style preference alone.

### Finding format

Every finding must include:

~~~text
## <IDC-ID> — <title>

Severity:
Category:

Ticket:
Implementation Design:
Audit Target HEAD:

Designed responsibility/component:

Approved design:
<what design required>

Actual implementation:
<what code does>

Repository evidence:
<exact code/test evidence>

Structural problem:

DDD impact:
SOLID impact:
Clean Code impact:
Dependency direction impact:
Invariant impact:
Testability impact:

Why this matters:

Minimum structural correction required:
Capability:
Dependency class:
Local closure blocking:
Local acceptance requires productive capability:
Completion evidence timing:
Dependency class reclassification required:
Upstream dependency classification preserved:
Suggested local/integrated blocking effects:
~~~

Do not prescribe a specific code patch unless authority permits only one correction. Do not remediate.

## Full-audit rule

Continue the complete domain, boundary, dependency, testability, and deviation audit after discovering findings. Do not stop after the first god class, DIP violation, or aggregate bypass. The consolidator needs complete evidence.

## Re-audit rules

On re-audit:

- inspect the current approved design;
- inspect the current implementation and remediation delta;
- rerun every relevant phase;
- reconcile previous IDC findings;
- search for remediation-introduced regressions.

Classify previous findings as RESOLVED, STILL_PRESENT, REGRESSED, or SUPERSEDED_BY_VALID_DESIGN_CHANGE. Classify new findings as PREEXISTING_AUDIT_ESCAPE, REMEDIATION_INTRODUCED, or NEWLY_APPLICABLE.

## Specialist result

Return exactly one:

~~~text
SPECIALIST_DESIGN_PASS
SPECIALIST_DESIGN_FINDINGS
SPECIALIST_AUDIT_BLOCKED
~~~

Also report:

~~~text
DOMAIN_AUDIT_COMPLETE = YES | NO
~~~

For PASS or FINDINGS, DOMAIN_AUDIT_COMPLETE must be YES.

Return SPECIALIST_DESIGN_PASS only when all applicable conformance dimensions pass and:

~~~text
CRITICAL_FINDINGS = 0
MAJOR_FINDINGS = 0
~~~

Material MINOR findings should normally produce SPECIALIST_DESIGN_FINDINGS.

Use SPECIALIST_AUDIT_BLOCKED only when meaningful audit cannot be completed because of:

~~~text
IMPLEMENTATION_DESIGN_MISSING
IMPLEMENTATION_DESIGN_AUTHORITY_CONFLICT
AUDIT_TARGET_MISMATCH
IMPLEMENTATION_NOT_AVAILABLE
REPOSITORY_STATE_UNAVAILABLE
MATERIAL_BASELINE_INVALIDATION
~~~

Do not use BLOCKED for ordinary code/design defects.

## Required artifact

Create:

~~~text
<TICKET-ID>-implementation-design-conformance-audit.md
~~~

or the repository-equivalent specialist audit location.

Use this section order:

~~~text
1. Specialist Result
2. Audit Subject
3. Audit Mode
4. Authority / Design Baseline
5. Implementation Diff
6. Responsibility Conformance
7. Component Conformance
8. Domain Model Conformance
9. Upstream Authority Preconditions Audit
10. Aggregate Boundary Audit
11. Invariant Placement Audit
12. Domain Rule Duplication Audit
13. Value Object / Primitive Audit
14. Domain Service Audit
15. Application Service Audit
16. Repository / Persistence Boundary Audit
17. Anti-Corruption / Cross-Spec Design Audit
18. SOLID Audit
19. Dependency Direction Audit
20. Lifecycle Design Audit
21. Failure / Recovery Structure Audit
22. Clean Code Structural Audit
23. Testability / Structural Test Audit
24. Design Deviation Audit
25. Structural Self-Check Verification
26. Findings
27. Metrics
28. Re-audit Reconciliation
29. Specialist Completeness Proof
~~~

## Required metrics report

Report:

~~~text
RESPONSIBILITIES:
- DESIGNED:
- PRESERVED:
- LOCALLY_ADAPTED:
- MISSING:
- WRONG_PLACEMENT:

COMPONENTS:
- DESIGNED:
- PRESERVED:
- LOCALLY_ADAPTED:
- COLLAPSED:
- UNJUSTIFIED_SPLITS:
- MISSING:
- UNPLANNED:

DDD:
- AGGREGATE_BOUNDARY_VIOLATIONS:
- DOMAIN_INVARIANT_BYPASSES:
- UNENFORCED_INVARIANTS:
- INVARIANT_PLACEMENT_DEVIATIONS:
- DOMAIN_RULE_DUPLICATION:
- ANEMIC_DOMAIN_MODEL_INTRODUCED: YES | NO
- FAT_APPLICATION_SERVICE_INTRODUCED: YES | NO

SOLID:
- SRP_VIOLATIONS:
- OCP_VIOLATIONS:
- LSP_VIOLATIONS:
- ISP_VIOLATIONS:
- DIP_VIOLATIONS:
- UNJUSTIFIED_SOLID_VIOLATIONS:

DEPENDENCIES:
- DEPENDENCY_DIRECTION_VIOLATIONS:
- INFRASTRUCTURE_LEAKAGE_POINTS:

UPSTREAM_AUTHORITY:
- SPEC_IMPLEMENTABILITY_CHECK: PASS | FAIL | BLOCKED
- IDENTITY_AUTHORITY_GAPS:
- RECONSTRUCTION_AUTHORITY_GAPS:
- LIFECYCLE_AUTHORITY_GAPS:
- PERSISTENCE_SEMANTICS_GAPS:
- CROSS_SPEC_AUTHORITY_GAPS:
- UPSTREAM_AUTHORITY_CONFORMANCE: PASS | FINDINGS | BLOCKED
- AUTHORITY_CONSUMPTION_GAPS:
- PRODUCER_CONSUMER_CONTRACT_ERRORS:
- CAPABILITY_AVAILABILITY_CLASSIFICATION_ERRORS:
- DOWNSTREAM_PROMOTION_WITHOUT_NEW_EVIDENCE:
- WITNESSES_NOT_EXECUTABLE_AT_LOCAL_CLOSURE:
- TEMPORAL_AUTHORITY_GAPS:
- CALLER_SUPPLIED_AUTHORITY_BYPASS:

CLEAN_CODE:
- GOD_COMPONENTS:
- FAT_INTERFACES:
- PRIMITIVE_OBSESSION_REGRESSIONS:
- GENERIC_SERVICE_BUCKETS:
- GENERIC_UTIL_BUCKETS:
- PREMATURE_ABSTRACTIONS:
- OVERENGINEERING_FINDINGS:
- HIDDEN_SIDE_EFFECTS:
- HIDDEN_TEMPORAL_COUPLINGS:

TESTABILITY:
- TESTABILITY_REGRESSIONS:
- MISSING_STRUCTURAL_TESTS:

DESIGN_DEVIATIONS:
- RECORDED:
- VALID:
- INVALID:
- UNDECLARED_MATERIAL:

SELF_CHECK:
- CLAIMED: PASS | FAIL | NOT_REPORTED
- AUDITED: CONFIRMED | FALSE_PASS | INCOMPLETE

FINDINGS:
- CRITICAL:
- MAJOR:
- MINOR:
- INFO:
~~~

## Critical rules

1. Audit actual code, not claims.
2. The approved design governs structure but cannot override upstream authority.
3. Do not require textbook DDD where domain semantics and approved design do not justify it.
4. Do not reward ceremonial SOLID.
5. SRP is about reasons to change, not line count.
6. Do not create false anemic-domain findings for rule-free data structures.
7. Domain invariants matter more than class arrangement.
8. Dependency direction is the actual code dependency graph, not folder names.
9. Persistence enforcement is not automatically semantic authority.
10. Report structural cross-spec evidence without duplicating the architecture specialist's full scope.
11. Clean Code means structural clarity, not formatting preference.
12. Do not punish complexity required by the domain.
13. Do not accept unnecessary complexity.
14. Self-check is not proof; recalculate structural claims.
15. This specialist is read-only and does not remediate.

## Core completion invariant

The specialist audit is complete only when actual implementation has been compared against the approved design responsibility by responsibility, component by component, invariant by invariant, and dependency boundary by dependency boundary; domain behavior remains in approved ownership; aggregate consistency boundaries and mutation authorities remain intact; no critical invariant is bypassable or duplicated; application services remain orchestration rather than domain authority; repositories and infrastructure do not absorb semantic authority; cross-spec integration preserves local and foreign boundaries; SOLID has been evaluated semantically; dependency direction matches approved repository-compatible design; no material god component, fat service, fat interface, anemic-domain regression, primitive obsession regression, premature abstraction, domain-rule duplication, infrastructure leak, hidden temporal coupling, or unjustified overengineering remains undiscovered; deviations have been independently classified; the structural self-check has been independently verified; and the full audit completed despite earlier findings.

## Required final response

Return:

~~~text
Design specialist artifact:
<path>

Ticket:
<TICKET-ID>

Audit target HEAD:
<commit>

Design:
<implementation-design path>

Design conformance:
- Domain model: PASS | FINDINGS | BLOCKED
- Aggregate boundaries: PASS | FINDINGS | BLOCKED | NOT_APPLICABLE
- Invariant placement: PASS | FINDINGS | BLOCKED
- Component boundaries: PASS | FINDINGS | BLOCKED
- SOLID: PASS | FINDINGS | BLOCKED
- Dependency direction: PASS | FINDINGS | BLOCKED
- Upstream authority: PASS | FINDINGS | BLOCKED
- Clean Code structure: PASS | FINDINGS | BLOCKED
- Testability: PASS | FINDINGS | BLOCKED
- Direct behavior witnesses: <count>
- Proxy-only behaviors: <count>
- Untested state transitions: <count>
- Unproven concurrency contracts: <count>
- Missing architecture guards: <count>
- Design test coverage gate: PASS | BLOCKED
- Design deviations: PASS | FINDINGS | BLOCKED

Findings:
- CRITICAL: <n>
- MAJOR: <n>
- MINOR: <n>
- INFO: <n>

Structural self-check:
CONFIRMED
|
FALSE_PASS
|
INCOMPLETE

Specialist result:
SPECIALIST_DESIGN_PASS
|
SPECIALIST_DESIGN_FINDINGS
|
SPECIALIST_AUDIT_BLOCKED

DOMAIN_AUDIT_COMPLETE:
YES | NO
~~~

Do not produce the canonical ticket implementation verdict. Do not remediate code or tests.
