---
name: audit-component-spec-conformance
description: >
  Perform an independent, adversarial, read-only conformance audit of one
  component specification against accepted ADR authority, the approved SPEC
  portfolio decomposition, conformant upstream component contracts, and the
  component's own completeness requirements. Verify ADR-to-portfolio-to-
  requirement-to-acceptance traceability, ownership boundaries, dependency
  direction, failure and compatibility ownership, lifecycle, identity,
  aggregate reconstruction, persistence, concurrency, idempotency,
  authorization, recovery, projection boundaries, and cross-SPEC isolation.
  Use after
  generate-component-spec-from-portfolio and before Gap Matrix generation.
  This skill never remediates or modifies the specification.
---

# Audit Component SPEC Conformance

## Purpose

Independently determine whether a generated component SPEC correctly
materializes its approved architectural boundary. A component SPEC is
conformant only when all four dimensions pass:

```text
A. ADR CONFORMANCE
B. PORTFOLIO CONFORMANCE
C. UPSTREAM CONTRACT CONFORMANCE
D. SPEC INTERNAL COMPLETENESS
```

Answer whether the SPEC completely and correctly translates effective accepted
ADR authority and approved portfolio obligations into a testable normative
contract while preserving ownership, dependency direction, transversal
contracts, failure semantics, compatibility boundaries, and upstream authority.

Read `../_shared/authority-completeness-gates.md` before auditing. This audit
owns the complete authority proof; later phases may only confirm its artifact,
revision, and applicability.

## Operating mode and write boundary

Operate in:

```text
READ_ONLY INDEPENDENT ADVERSARIAL ADR_FIRST PORTFOLIO_GOVERNED
COMPONENT_SCOPED IMPLEMENTATION_INDEPENDENT NO_REMEDIATION
NO_ARCHITECTURE_INVENTION
```

Do not modify ADRs, portfolio decomposition, any SPEC, Gap Matrix,
Implementation Plan, tickets, code, tests, or previous audit reports. The only
permitted write is the audit report itself.

Use this authority precedence exactly:

```text
accepted ADR > approved SPEC portfolio decomposition >
conformant upstream component SPEC > component SPEC under audit >
repository implementation > tests > prototype > historical evidence
```

ADR defines product architecture. The approved portfolio defines decomposition
authority, including canonical owners, consumers, normative dependency
direction, cross-cutting ownership, failure semantic ownership,
compatibility/cutover ownership, and projection boundaries. Upstream SPECs may
refine only contracts they legitimately own. The audited component must
preserve both ADR and portfolio authority.

## Required inputs and preconditions

Require:

1. target component SPEC;
2. governing SPEC portfolio;
3. latest portfolio decomposition audit;
4. evidence of verdict `PORTFOLIO_DECOMPOSITION_APPROVED`;
5. accepted, effective, available, non-superseded ADRs relevant to the target;
6. portfolio architectural obligation registry;
7. portfolio dependency registry;
8. failure ownership registry when applicable;
9. compatibility/cutover registry when applicable;
10. conformant upstream component SPECs and their latest audit evidence.

Optional repository implementation, tests, prototype, historical audits, prior
drafts, or prior Gap Matrix are supporting evidence only and cannot override
accepted authority.

Implementation may be cited as evidence that a missing decision surfaced, but
must never be used as the source that fills the decision.

Before auditing:

* If the latest portfolio verdict is not exactly
  `PORTFOLIO_DECOMPOSITION_APPROVED`, stop with
  `AUDIT_BLOCKED_PORTFOLIO_NOT_APPROVED`.
* If component identity is ambiguous, stop with
  `AUDIT_BLOCKED_SPECIFICATION_IDENTITY`.
* If ADR authority is insufficient, stop with
  `BLOCKED — ADR_CLARIFICATION_REQUIRED`.
* For each normative upstream dependency, require an approved portfolio entry,
  an identifiable required revision, an existing upstream SPEC, and a
  conformant latest upstream audit. Otherwise stop with
  `AUDIT_BLOCKED_UPSTREAM_SPEC_NOT_CONFORMANT`.
* If an approved portfolio obligation is materially defective and safe
  validation is impossible, stop with `BLOCKED — PORTFOLIO DECOMPOSITION DEFECT`.

Do not invent missing architecture, reconstruct a missing upstream contract, or
silently reinterpret the portfolio.

## Audit baseline

Read `skills/_shared/baseline-drift-remediation-contract.md` before assessing
drift. If the current authority or repository differs from the frozen basis,
persist `BASELINE_REASSESSMENT_PROOF` and emit the shared
`BASELINE_DRIFT_STATUS`, `REASSESSMENT_COMPLETE`,
`BASELINE_REMEDIATION_READINESS`, `FINDINGS_ARE_ACTIONABLE`, and exact
`AUDIT_BASIS_FINGERPRINT` fields. Complete assessed drift is a valid input to
`remediate-component-spec`; only incomplete/indeterminate reassessment blocks.

Record:

```text
TARGET_COMPONENT
PORTFOLIO_ID PORTFOLIO_REVISION PORTFOLIO_AUDIT PORTFOLIO_VERDICT
COMPONENT_REVISION COMPONENT_STATUS REPOSITORY_HEAD
PRIMARY_ADRS RELATED_ADRS UPSTREAM_SPECS
OWNED_PORTFOLIO_OBLIGATIONS CONSUMED_PORTFOLIO_OBLIGATIONS
BASELINE_DRIFT_STATUS REASSESSMENT_COMPLETE FINDINGS_ARE_ACTIONABLE
BASELINE_REMEDIATION_READINESS AUDIT_BASIS_FINGERPRINT
```

Also record files consulted, working-tree state, and audit timestamp. Confirm
that no file except the audit artifact is modified.

## Independent audit procedure

Read the accepted ADRs independently before trusting the SPEC. Build an ADR
Decision Register with stable IDs such as `ADR0001-D001`, recording source ADR
and section, effective state, normative obligation, architectural owner, and
identity, lifecycle, persistence, command, query/projection, failure,
authorization, concurrency, idempotency, recovery, audit/provenance,
compatibility, and conformance implications. Effective decision states are:

```text
ACTIVE REFINED PARTIALLY_SUPERSEDED FULLY_SUPERSEDED ADR_SUFFICIENT
```

Audit only effective portions.

### ADR and portfolio

Map every effective ADR decision to the approved portfolio registry and classify:

```text
FULLY_REPRESENTED_IN_PORTFOLIO
PARTIALLY_REPRESENTED_IN_PORTFOLIO
NOT_REPRESENTED_IN_PORTFOLIO
PORTFOLIO_OVERREACH
ADR_SUFFICIENT
```

Record `PORTFOLIO_OBLIGATION_DEFECT` rather than reinterpreting authority.

### Ownership and obligations

For every relevant obligation identify the approved role:

```text
CANONICAL_OWNER CONSUMER TRANSPORT_MAPPING DERIVED_PROJECTION
OPERATIONAL_PROJECTION UNRELATED
```

For every owned obligation identify all normative requirements and classify
`FULLY_COVERED`, `PARTIALLY_COVERED`, or `NOT_COVERED`. Full coverage means the
complete observable semantic consequence, not merely a citation. For each
consumed obligation verify reference to the canonical owner and preservation of
canonical identity, failure, lifecycle, compatibility, and non-redefinition.
Classify consumed use as:

```text
VALID_REFERENCE VALID_LOCAL_MAPPING VALID_PROJECTION
DUPLICATED_CONTRACT SEMANTIC_REDEFINITION MISSING_DEPENDENCY
```

Detect `PORTFOLIO_OWNERSHIP_VIOLATION`, `CONSUMER_REDEFINES_OWNER`,
`MISSING_OWNED_OBLIGATION`, `EXCESS_NORMATIVE_OWNERSHIP`, and
`PROJECTION_BECOMES_AUTHORITY`.

### Requirement authority and quality

Reverse-audit every normative requirement. Classify it as:

```text
DIRECT_ADR_DERIVED PORTFOLIO_OBLIGATION_DERIVED
LEGITIMATE_SPEC_ELABORATION UPSTREAM_CONTRACT_DERIVED LOCAL_MAPPING
LOCAL_PROJECTION UNBACKED_NORMATIVE_REQUIREMENT CONTRADICTS_ADR
CONTRADICTS_PORTFOLIO ARCHITECTURAL_DECISION_HIDDEN_IN_SPEC
```

Legitimate elaboration may make accepted behavior testable, but may not add a
canonical identity, lifecycle, owner, state machine, persistence authority,
concurrency guarantee, authorization boundary, publication semantic,
compatibility policy, or cutover policy.

Every requirement must be identifiable, unambiguous, observable, testable,
implementation-independent, and authority-backed. Treat vague words such as
`should`, `appropriate`, `as needed`, `generally`, `normally`, `where possible`,
`relevant`, or `correct behavior` as defects unless deterministic behavior
follows. Classify testability as `TESTABLE`, `PARTIALLY_TESTABLE`, or
`UNTESTABLE`.

### Acceptance and conformance

For each normative requirement classify acceptance as
`ACCEPTANCE_COMPLETE`, `ACCEPTANCE_PARTIAL`, `ACCEPTANCE_MISSING`, or
`NOT_APPLICABLE`. Check applicable happy and invalid paths, missing input,
stale revision/basis, unauthorized access, duplicate and idempotent replay,
concurrency, partial failure, retry, recovery, restart, terminal behavior,
historical reads, lineage, provenance, compatibility, ambiguous/conflicting
state, and unsupported capability. Material requirements may not have missing
acceptance.

### Dependencies and cross-SPEC boundaries

Load the approved dependency graph. Classify each declared dependency as:

```text
APPROVED_NORMATIVE_DEPENDENCY APPROVED_TRANSITIVE_REFERENCE
IMPLEMENTATION_DEPENDENCY PROJECTION_DEPENDENCY EVIDENCE_DEPENDENCY
UNAPPROVED_NORMATIVE_DEPENDENCY REVERSED_DEPENDENCY
```

Detect `UNAPPROVED_NORMATIVE_DEPENDENCY`, `MISSING_PORTFOLIO_DEPENDENCY`,
`DEPENDENCY_DIRECTION_VIOLATION`, `CIRCULAR_NORMATIVE_DEPENDENCY`, and
`DOWNSTREAM_AUTHORITY_DEPENDENCY`. For every concept classify the component as
`PRODUCES`, `OWNS`, `CONSUMES`, `REFERENCES`, `MAPS`, `PROJECTS`, or
`DOES_NOT_OWN`; detect boundary leaks, duplicated authority/lifecycle, consumer
redefinition, missing composition, and projection ownership.

### Lifecycle, identity, persistence

For every lifecycle entity owned by the component verify creation, initial
state, valid and invalid transitions, terminal and immutable state, retry,
recovery, historical visibility, replacement, cancellation, and retention or
deletion where applicable. Detect missing state/transition, undefined invalid or
terminal behavior, undefined recovery, and contradiction. Do not require
lifecycle behavior owned elsewhere; verify composition instead.

For every identity verify canonical owner, uniqueness, creation, immutability,
revision relation, parent/child and execution relation, digest/content identity,
presentation identity, provenance, lineage, and historical resolution. Detect
unauthorized collapse such as `logical ID = execution ID`, `revision = save
counter`, `display label = canonical ID`, or `digest = navigation ID`.

Classify relevant state as `CANONICAL_STATE`, `IMMUTABLE_ARTIFACT`,
`APPEND_ONLY_RECORD`, `MUTABLE_PROJECTION`, `CACHE`, or `DERIVED_STATE`; verify
authority, rebuild behavior, retention, deletion, and mutation rules. A cache
or projection must not become canonical authority.

### Authority completeness gates

Run the shared gates for every Aggregate Root, Entity, persistible lifecycle,
and state machine that is introduced, required, referenced, or implicitly
needed by the SPEC. Produce:

```text
AGGREGATE_IDENTITY_PROOF
AGGREGATE_RECONSTRUCTION_PROOF
LIFECYCLE_AUTHORITY_MATRIX
PERSISTENCE_SEMANTICS_MATRIX
CROSS_SPEC_AUTHORITY_MATRIX
```

Identity proofs must concretely cover canonical identity, owner, kind/type,
scope, stable correlation, creation, command form, repository lookup,
persistence, rehydration, equality/continuity, revision relation, and aliases.
Reconstruction proofs must distinguish create from rehydrate and specify
progression evidence, continuity validation, skip/inconsistency/fabrication
rejection, domain versus adapter responsibility, and fail-closed behavior.
Enumerated states, a CAS revision, or mapper/repository behavior are not
sufficient without explicit normative authority.

For every external authority dependency, also produce
`AUTHORITY_CONSUMPTION_PROOF` and `PRODUCER_CONSUMER_CONTRACT_PROOF`. Verify
truth owner, semantic source, owner domain, consumer contract/port/query,
producer, returned data, version/revision transport, failure/not-found/stale
semantics, and productive availability. Classify missing semantic definition as
`AUTHORITY_NOT_DEFINED`; if the semantic definition and normative contract
exist but productive availability is not yet evidenced, record
`CONTRACT_STATUS = DEFINED`, with `LOCAL_TESTABILITY = NO` or `YES`, and
`PRODUCTIVE_AVAILABILITY = NO`; emit the corresponding
`CAPABILITY_SUMMARY_STATUS` only as a derived summary.

At this phase, prove the normative contract and record the four independent
capability dimensions. Do not use `PENDING_GAP_MATRIX` as a status. Do not
claim final `AUTHORITY_CONSUMABLE` from conceptual authority or local
testability; the Gap Matrix may promote only with a complete productive-
availability promotion record.
If no approved normative consumer contract exists, it is a
`CROSS_SPEC_AUTHORITY_GAP`/`AUTHORITY_NOT_DEFINED`, not merely a pending
implementation capability.

When mutable authority is observed and later used for an effect, require a
`TEMPORAL_AUTHORITY_PROOF` covering independent re-observation, drift
detection, fail-closed behavior, semantic validation owner, and the distinct
physical CAS/integrity role. A reused snapshot, self-comparison, caller value,
or CAS alone is insufficient.

Ask the shared authority-completeness questions. A failed implementability
answer or multiple plausible implementations with a normative semantic
difference is a blocking finding. Record the smallest root-cause stage rather
than promoting every gap to ADR.

Run the shared `IMPLEMENTER_DECISION_CHECK` for every material behavior,
including identity, creation, rehydration/reconstruction, lifecycle, state
transition, concurrency, stale/duplicate behavior, recovery, persistence,
cross-SPEC consumption, authorization, external effects, and cutover. A `NO` or
`UNKNOWN` answer is a blocking finding even when proof IDs and conformance
tests exist. Record the concrete operation, authoritative source for each
input, validation owner, state-load path, identity/reference proof, rejection
semantics, state after failure, required capabilities, and availability status.

Emit `SPEC_IMPLEMENTABILITY_CHECK = PASS | FAIL | BLOCKED`. PASS requires all
applicable authority-gap counts to be zero. Use the shared categories
`IDENTITY_AUTHORITY_GAP`, `REHYDRATION_AUTHORITY_GAP`,
`RECONSTRUCTION_AUTHORITY_GAP`, `LIFECYCLE_AUTHORITY_GAP`,
`PERSISTENCE_SEMANTICS_GAP`, `CROSS_SPEC_AUTHORITY_GAP`,
`FAILURE_SEMANTICS_GAP`, and `CONCURRENCY_SEMANTICS_GAP`.

When the adversarial implementability question is `NO`, also emit
`SPEC_IMPLEMENTABILITY_FAILED`; this is a blocking SPEC finding and forces
`READY_FOR_GAP_MATRIX: NO`.

### Concurrency, security, failure, recovery

For owned mutations verify expected revision, stale behavior, optimistic
concurrency, duplicate request and idempotency-key semantics, retry, atomicity,
partial-application prevention, and ordering. Do not assume a generic operation
layer solves domain concurrency.

For owned or consumed security contracts verify authentication, authorization
boundary, server-side enforcement, projection filtering, denied-command
semantics, information leakage, and secret handling. Frontend hiding is never
authorization.

Use the approved failure ownership registry. For every relevant failure record
canonical semantic owner, component role, local mapping, and local projection;
classify behavior as:

```text
VALID_CANONICAL_OWNER VALID_CONSUMER VALID_TRANSPORT_MAPPING
VALID_UI_PRESENTATION VALID_OPERATIONAL_PROJECTION
SEMANTIC_REDEFINITION WRONG_FAILURE_OWNER UNMAPPED_FAILURE
```

Local representation must not change trigger, meaning, retryability, terminality,
recovery, or state implication. For failures owned by the component verify typed
failure, preconditions, state after failure, retryability, recovery/resumption,
duplicate prevention, stale handling, evidence, and read/projection behavior.

### Compatibility, projections, commands, effects, provenance

Use the approved compatibility registry. Classify each applicable concern as
`NEW_CANONICAL_PATH`, `LEGACY_COMPATIBILITY`, `HISTORICAL_REPLAY`, `CUTOVER`, or
`RETIREMENT`, with role `OWNER`, `CONSUMER`, or `NOT_APPLICABLE`. Detect
compatibility-owner violation, unowned cutover, legacy becoming canonical,
missing retirement criteria, and historical replay gap.

Classify representations as `CANONICAL`, `APPLICATION_MAPPING`, `TRANSPORT`,
`OPERATIONAL_PROJECTION`, `READ_MODEL`, or `UI_PROJECTION`; detect backend, OPS,
UI, report, or transport second authorities. Classify commands, queries, and
events as canonical domain, application, transport, query, integration,
projection, or transport forms. Define canonical semantics only when assigned
ownership; envelopes and dispatch do not redefine domain semantics.

When relevant distinguish `REQUEST`, `INTENT`, `EXTERNAL_EXECUTION`, `EVIDENCE`,
`CONFIRMATION`, `RECONCILIATION`, and `PROJECTION`, and verify correct ownership
of each stage. Verify source, basis, revision, producer, causal relation,
immutable evidence, audit-report semantics, and operation correlation. Technical
logs and operational exports do not replace canonical audit artifacts.

### Repository, gaps, and leakage

Only after normative auditing, inspect implementation if useful. Classify
suspicious requirements as `ADR_DERIVED`, `PORTFOLIO_DERIVED`,
`LEGITIMATE_ELABORATION`, `IMPLEMENTATION_DERIVED_BUT_VALID`,
`IMPLEMENTATION_DERIVED_UNBACKED`, `PROTOTYPE_DERIVED`, or `LEGACY_DERIVED`.
Implementation existence does not prove architectural validity.

Validate current-state/gap classifications:

```text
ALREADY_CONFORMANT SPECIFICATION_GAP IMPLEMENTATION_GAP
LEGACY_COMPATIBILITY PROTOTYPE_ONLY NON_GAP UNFROZEN_IMPLEMENTATION_DETAIL
ARCHITECTURE_GAP
```

Detect premature gap closure, implementation-plan leakage, and misclassified
architecture gaps. Reject unsupported freezing of file-by-file work,
implementation phases, commits, tickets, implementation units, class/module
names, exact storage technology, routes, or library choices, unless accepted
authority requires it. Classify valid normative sequence, valid unfrozen detail,
implementation-plan leakage, and unsupported implementation freeze.

## Findings

Use IDs `CSC-CRITICAL-###`, `CSC-MAJOR-###`, `CSC-MINOR-###`, and
`CSC-INFO-###`. Severity:

* CRITICAL: accepted-ADR contradiction, approved ownership violation, second
  canonical authority, canonical identity/lifecycle change, unauthorized
  architecture, or downstream authority defining upstream behavior.
* MAJOR: partial/missing owned obligation, redefined consumed contract, failure
  or compatibility ownership violation, untestable material requirement,
  missing lifecycle/failure/recovery semantics, or unapproved dependency.
* MINOR: incomplete traceability, terminology inconsistency, missing
  non-material edge case, stale cross-reference, or non-material auditability
  issue.
* INFO: improvement only.

Every CRITICAL, MAJOR, and MINOR finding must contain:

```text
## <ID> — <title>
Severity:
Category:

### Authority
ADR:
Portfolio obligation:
Owner SPEC:
Upstream contract, if applicable:

### Evidence
Exact file and section references.

### Expected
What accepted authority requires.

### Observed
What the component SPEC states.

### Gap
Exact divergence.

### Why this matters
Authority, implementation or conformance risk.

### Root cause
ADR translation / portfolio conformance / upstream composition /
SPEC completeness.

### Required remediation type
<enum>

### Revalidation
Exact mechanical condition for closure.
```

Allowed remediation types are:

```text
ADD_REQUIREMENT EXTEND_REQUIREMENT REMOVE_UNBACKED_REQUIREMENT
RESTORE_PORTFOLIO_OWNERSHIP REFERENCE_UPSTREAM_OWNER
REMOVE_DUPLICATED_AUTHORITY ADD_ACCEPTANCE_CRITERIA CLARIFY_LIFECYCLE
CLARIFY_IDENTITY CLARIFY_FAILURE CLARIFY_COMPATIBILITY
REMOVE_UNAPPROVED_DEPENDENCY ADD_REQUIRED_DEPENDENCY
REMOVE_IMPLEMENTATION_PLAN_LEAKAGE PORTFOLIO_REMEDIATION_REQUIRED
ADR_CLARIFICATION_REQUIRED
```

Do not perform remediation.

## Mandatory coverage matrices

Produce every matrix below, with exactly these columns:

### Matrix A — ADR Decision → Portfolio Obligation

`ADR Decision ID | Source ADR | Effective obligation | Portfolio obligation ID | Portfolio owner | Mapping result | Finding IDs`

### Matrix B — Portfolio Obligation → Component Requirement

`Portfolio obligation | Approved role | Requirement IDs | Coverage | Acceptance IDs | Finding IDs`

### Matrix C — Requirement → Authority

`Requirement ID | Normative requirement | Portfolio obligation | ADR decision | Authority classification | Testability | Acceptance coverage | Finding IDs`

### Matrix D — Cross-SPEC Ownership

`Concept | Approved canonical owner | Component behavior | Relationship | Status | Finding IDs`

### Matrix E — Dependency Conformance

`Dependency | Portfolio-approved? | Direction | Type | Required? | Component declaration | Status | Finding IDs`

### Matrix F — Lifecycle / Failure / Compatibility

`Concept | Lifecycle | Failure | Recovery | Compatibility | Cutover | History | Coverage | Finding IDs`

## Mandatory checks

Report each as `PASS`, `FAIL`, `BLOCKED`, or `NOT_APPLICABLE`:

```text
CHECK-01 Portfolio is approved.
CHECK-02 ADR authority is eligible.
CHECK-03 Upstream normative dependencies are conformant.
CHECK-04 ADR decisions map consistently to portfolio obligations.
CHECK-05 Every owned portfolio obligation is fully covered.
CHECK-06 No consumed contract is redefined.
CHECK-07 Every normative requirement has authority.
CHECK-08 No hidden architectural decision exists.
CHECK-09 All material requirements are testable.
CHECK-10 Acceptance coverage is complete.
CHECK-11 Dependency graph matches approved portfolio.
CHECK-12 No downstream authority dependency exists.
CHECK-13 Cross-SPEC ownership remains isolated.
CHECK-14 Lifecycle semantics are complete.
CHECK-15 Identity/lineage semantics are complete.
CHECK-16 Concurrency/idempotency semantics are complete where applicable.
CHECK-17 Authorization semantics are complete where applicable.
CHECK-18 Failure semantic ownership is preserved.
CHECK-19 Recovery semantics are complete where applicable.
CHECK-20 Compatibility/cutover ownership is preserved.
CHECK-21 Projection layers remain non-authoritative.
CHECK-22 Repository behavior did not become architectural authority.
CHECK-23 Gap classification is semantically correct.
CHECK-24 No Implementation Plan leakage exists.
CHECK-25 No architecture gap remains unresolved.
CHECK-26 No portfolio ownership gap remains unresolved.
CHECK-27 Aggregate Identity Proof is complete for every applicable aggregate.
CHECK-28 Aggregate Reconstruction Proof is complete for every applicable
         persistible aggregate/entity.
CHECK-29 Lifecycle authority is complete, including invalid/recovery/replay
         behavior.
CHECK-30 Persistence semantics distinguish snapshot, provenance, and revision.
CHECK-31 Domain/infra ownership and cross-SPEC boundary are sufficient.
CHECK-32 SPEC_IMPLEMENTABILITY_CHECK passes.
CHECK-33 External authority consumption is concretely contract-backed.
CHECK-34 Producer/consumer contracts are identified and available where
         required.
CHECK-35 Temporal authority is independently revalidated before effects.
CHECK-36 Caller values do not bypass canonical authority.
CHECK-37 Every critical behavior passes the Implementation Decision Simulation.
CHECK-38 Every capability records independent authority, contract, local-
         testability, and productive-availability dimensions; any summary is
         derived only.
CHECK-39 Local testability is not promoted to productive availability.
CHECK-40 No downstream readiness claim lacks new productive availability evidence.
```

## Completion metrics

Calculate and report:

```text
ADRS_INSPECTED EFFECTIVE_ADR_DECISIONS
PORTFOLIO_OBLIGATIONS_ASSIGNED PORTFOLIO_OBLIGATIONS_OWNED
PORTFOLIO_OBLIGATIONS_FULLY_COVERED PORTFOLIO_OBLIGATIONS_PARTIAL
PORTFOLIO_OBLIGATIONS_UNCOVERED
NORMATIVE_REQUIREMENTS DIRECT_ADR_REQUIREMENTS
PORTFOLIO_DERIVED_REQUIREMENTS LEGITIMATE_ELABORATIONS
UPSTREAM_DERIVED_REQUIREMENTS UNBACKED_REQUIREMENTS CONTRADICTORY_REQUIREMENTS
CONSUMED_CONTRACTS CONSUMED_CONTRACTS_REDEFINED
TESTABLE_REQUIREMENTS PARTIALLY_TESTABLE_REQUIREMENTS UNTESTABLE_REQUIREMENTS
ACCEPTANCE_COMPLETE ACCEPTANCE_PARTIAL ACCEPTANCE_MISSING
NORMATIVE_DEPENDENCIES UNAPPROVED_DEPENDENCIES
MISSING_REQUIRED_DEPENDENCIES DEPENDENCY_DIRECTION_VIOLATIONS
FAILURES_AUDITED FAILURE_OWNER_VIOLATIONS
COMPATIBILITY_OBLIGATIONS COMPATIBILITY_OWNER_VIOLATIONS
CRITICAL_FINDINGS MAJOR_FINDINGS MINOR_FINDINGS INFO_FINDINGS
ARCHITECTURE_CLARIFICATIONS_REQUIRED PORTFOLIO_REMEDIATION_REQUIRED
UNRESOLVED_ITEMS
IDENTITY_AUTHORITY_GAPS RECONSTRUCTION_AUTHORITY_GAPS
LIFECYCLE_AUTHORITY_GAPS PERSISTENCE_SEMANTICS_GAPS
CROSS_SPEC_AUTHORITY_GAPS
SPEC_IMPLEMENTABILITY_CHECK
AUTHORITY_CONSUMPTION_PROOFS
AUTHORITY_CONSUMPTION_GAPS
TEMPORAL_AUTHORITY_PROOFS
TEMPORAL_AUTHORITY_GAPS
PRODUCER_CONSUMER_CONTRACT_PROOFS
BLOCKED_BY_UPSTREAM_CONTRACT
AUTHORITY_NOT_DEFINED
AUTHORITY_DEFINED_BUT_NOT_CONSUMABLE
CAPABILITY_AVAILABILITY_RECORDS
LOCAL_TESTABLE_CAPABILITIES
PRODUCTIVELY_AVAILABLE_CAPABILITIES
IMPLEMENTER_DECISION_CHECKS
IMPLEMENTER_DECISION_CHECK_FAILURES
DOWNSTREAM_PROMOTION_WITHOUT_NEW_EVIDENCE
```

## Verdict and gates

Use exactly one verdict:

```text
PASS — COMPONENT_SPEC_CONFORMANT
FAIL — COMPONENT_SPEC_NON_CONFORMANT
BLOCKED — ADR_CLARIFICATION_REQUIRED
BLOCKED — PORTFOLIO_DECOMPOSITION_DEFECT
AUDIT_BLOCKED_PORTFOLIO_NOT_APPROVED
AUDIT_BLOCKED_UPSTREAM_SPEC_NOT_CONFORMANT
AUDIT_BLOCKED_SPECIFICATION_IDENTITY
```

Return `PASS — COMPONENT_SPEC_CONFORMANT` only if all four dimensions are
`PASS` and all of the following are zero:

```text
PORTFOLIO_OBLIGATIONS_PARTIAL PORTFOLIO_OBLIGATIONS_UNCOVERED
UNBACKED_REQUIREMENTS CONTRADICTORY_REQUIREMENTS
CONSUMED_CONTRACTS_REDEFINED UNTESTABLE_REQUIREMENTS
UNAPPROVED_DEPENDENCIES MISSING_REQUIRED_DEPENDENCIES
DEPENDENCY_DIRECTION_VIOLATIONS FAILURE_OWNER_VIOLATIONS
COMPATIBILITY_OWNER_VIOLATIONS CRITICAL_FINDINGS MAJOR_FINDINGS
ARCHITECTURE_CLARIFICATIONS_REQUIRED PORTFOLIO_REMEDIATION_REQUIRED
UNRESOLVED_ITEMS IDENTITY_AUTHORITY_GAPS RECONSTRUCTION_AUTHORITY_GAPS
LIFECYCLE_AUTHORITY_GAPS PERSISTENCE_SEMANTICS_GAPS
CROSS_SPEC_AUTHORITY_GAPS
AUTHORITY_NOT_DEFINED
```

Also require `SPEC_IMPLEMENTABILITY_CHECK = PASS`. Any applicable authority
gap produces `FAIL — COMPONENT_SPEC_NON_CONFORMANT` and
`READY_FOR_GAP_MATRIX: NO`.

Minor findings may remain only when they cannot affect deterministic
implementation or downstream Gap Matrix generation. Prefer zero findings.

For a passing verdict emit `READY_FOR_GAP_MATRIX: YES`; otherwise emit
`READY_FOR_GAP_MATRIX: NO`. Never emit `READY FOR IMPLEMENTATION AUDIT`; the
next phase is Gap Matrix generation.

## Audit artifact

Create only:

```text
docs/specs/audits/<SPEC-ID>-component-conformance-audit.md
```

The report must contain these sections:

```text
# <SPEC-ID> — Component SPEC Conformance Audit
## 1. Audit mode
## 2. Scope
## 3. Baseline
## 4. Authority hierarchy
## 5. ADR decision reconstruction
## 6. ADR → portfolio validation
## 7. Portfolio ownership validation
## 8. Owned obligation coverage
## 9. Consumed contract validation
## 10. Requirement authority
## 11. Requirement quality
## 12. Acceptance/conformance coverage
## 13. Dependency validation
## 14. Cross-SPEC boundary validation
## 15. Lifecycle validation
## 16. Identity/lineage validation
## 17. Aggregate Identity Authority Proof
## 18. Aggregate Reconstruction Authority Proof
## 19. Lifecycle Authority Validation
## 20. Persistence Semantics Validation
## 21. Cross-SPEC Authority Validation
## 22. Authority Consumption Proof
## 23. Producer/Consumer Contract Proof
## 24. Temporal Authority Proof
## 25. Caller-as-Authority Check
## 26. Concurrency/idempotency validation
## 27. Authorization validation
## 28. Failure semantic ownership
## 29. Failure/recovery validation
## 30. Compatibility/cutover validation
## 31. Projection boundary validation
## 32. Commands/queries/events validation
## 33. External effects validation
## 34. Provenance/auditability validation
## 35. Repository evidence check
## 36. Gap classification validation
## 37. Implementation-plan leakage
## 38. SPEC implementability check
## 39. Findings
## 40. Coverage matrices
## 41. Mandatory checks
## 42. Completion metrics
## 43. Final verdict
```

## Final console response

Use this exact shape:

```text
COMPONENT_SPEC_CONFORMANCE_AUDIT_COMPLETE

SPEC: <SPEC-ID>
PORTFOLIO: <PORTFOLIO-ID>

BASELINE_DRIFT_STATUS: <NO_DRIFT|DRIFT_UNASSESSED|DRIFT_ASSESSED>
REASSESSMENT_COMPLETE: <YES|NO>
FINDINGS_ARE_ACTIONABLE: <YES|NO>
BASELINE_REMEDIATION_READINESS: <READY|BLOCKED_INSUFFICIENT_REASSESSMENT>
AUDIT_BASIS_FINGERPRINT: <exact basis>
BASELINE_REASSESSMENT_PROOF: <path or inline section when drift exists>

DIMENSIONS:
- ADR_CONFORMANCE: <PASS|FAIL|BLOCKED>
- PORTFOLIO_CONFORMANCE: <PASS|FAIL|BLOCKED>
- UPSTREAM_CONTRACT_CONFORMANCE: <PASS|FAIL|BLOCKED>
- SPEC_INTERNAL_COMPLETENESS: <PASS|FAIL|BLOCKED>
- SPEC_IMPLEMENTABILITY_CHECK: <PASS|FAIL|BLOCKED>
- IDENTITY_AUTHORITY_GAPS: <n>
- RECONSTRUCTION_AUTHORITY_GAPS: <n>
- LIFECYCLE_AUTHORITY_GAPS: <n>
- PERSISTENCE_SEMANTICS_GAPS: <n>
- CROSS_SPEC_AUTHORITY_GAPS: <n>
- AUTHORITY_CONSUMPTION_GAPS: <n>
- TEMPORAL_AUTHORITY_GAPS: <n>
- BLOCKED_BY_UPSTREAM_CONTRACT: <n>

COVERAGE:
- PORTFOLIO_OBLIGATIONS_OWNED: <n>
- FULLY_COVERED: <n>
- PARTIAL: <n>
- UNCOVERED: <n>

REQUIREMENTS:
- TOTAL: <n>
- UNBACKED: <n>
- CONTRADICTORY: <n>
- UNTESTABLE: <n>

COMPOSITION:
- CONSUMED_CONTRACTS: <n>
- REDEFINED: <n>
- UNAPPROVED_DEPENDENCIES: <n>
- DEPENDENCY_DIRECTION_VIOLATIONS: <n>

FAILURES:
- OWNER_VIOLATIONS: <n>

COMPATIBILITY:
- OWNER_VIOLATIONS: <n>

FINDINGS:
- CRITICAL: <n>
- MAJOR: <n>
- MINOR: <n>
- INFO: <n>

VERDICT:
<verdict>

READY_FOR_GAP_MATRIX:
<YES|NO>

REPORT:
<path>
```

## Prohibited shortcuts and completion invariant

Do not approve merely because ADRs are cited, portfolio obligations appear by
name, requirements are numerous, tests exist, implementation works, a
prototype demonstrates behavior, another SPEC uses similar wording, the
portfolio was previously approved, or the component was generated by an
approved skill. The component SPEC itself must be proven conformant.

Completion requires independent support for all of the following: every
effective accepted ADR decision relevant to the component is correctly
represented in the approved portfolio; every assigned obligation is completely
materialized by testable requirements; every consumed contract preserves
upstream semantics; every normative requirement has valid ADR and portfolio
authority; dependency direction matches the portfolio; failure and compatibility
ownership are preserved; projections and transport remain non-authoritative;
lifecycle, identity, recovery, and conformance semantics are complete; no
implementation plan or hidden architecture leaked into the SPEC; and the
component can safely proceed to formal repository Gap Matrix generation.

When this invariant holds:

```text
PASS — COMPONENT_SPEC_CONFORMANT
READY_FOR_GAP_MATRIX: YES
```
