---
name: generate-component-implementation-gap-matrix
description: >
  Build an evidence-backed implementation Gap Matrix for one conformant
  component specification governed by an approved SPEC portfolio. Compare
  every normative component requirement with the current repository, first
  proving SPEC implementability authority, preserve ownership and upstream
  boundaries, classify implementation state, identify exact deltas, and
  produce a reliable baseline for downstream planning. Use
  only after PORTFOLIO_DECOMPOSITION_APPROVED and PASS — COMPONENT_SPEC_CONFORMANT.
---

# Generate Component Implementation Gap Matrix

Read `../_shared/interrupted-artifact-production-recovery-contract.md` before
acting. If the Gap Matrix output is dirty because an external failure
interrupted a prior generation, treat it as an untrusted candidate and rerun
this producer after validating the unchanged SPEC audit; do not block merely
because its authorized output is dirty, and do not checkpoint or plan from a
completion-looking candidate.

Build exactly one evidence-backed implementation Gap Matrix for the selected
component SPEC. The artifact compares the approved authority and ownership
contracts with the current repository. It records what is true, what must be
true, and the smallest observable delta between them.

This skill is `READ_ONLY`, `PORTFOLIO_GOVERNED`, `SPEC_FIRST`,
`IMPLEMENTATION_AWARE`, `EVIDENCE_REQUIRED`, `OWNERSHIP_PRESERVING`, and
`ADVERSARIAL`. It creates only the requested Gap Matrix artifact. It does not
modify ADRs, portfolio artifacts, SPECs, code, tests, migrations,
configuration, plans, tickets, or audits, and it does not produce an
Implementation Plan or ticket decomposition.

## Authority and stopping gates

Use this authority order exactly:

```text
accepted ADR
    > approved SPEC portfolio decomposition
    > conformant component SPEC under assessment
    > conformant upstream component SPECs
    > repository implementation
    > tests
    > prototype
    > historical evidence
```

The ADR defines architecture, the portfolio defines ownership, the component
SPEC defines the owner's required behavior, and the repository shows current
behavior. Do not let code, tests, prior matrices, or historical documents
rewrite authority.

Before inspecting implementation, locate and verify:

1. The latest governing portfolio audit states exactly
   `PORTFOLIO_DECOMPOSITION_APPROVED`. Otherwise stop with
   `BLOCKED — PORTFOLIO DECOMPOSITION NOT APPROVED`.
2. The latest independent target component audit states exactly
   `PASS — COMPONENT_SPEC_CONFORMANT`. Otherwise stop with
   `BLOCKED — COMPONENT SPEC NOT CONFORMANT`.
3. Every normative upstream component SPEC required by the target is
   conformant. Otherwise stop with `BLOCKED — UPSTREAM SPEC NOT CONFORMANT`.

An upstream implementation may be missing without blocking this matrix; record
that condition as a foreign implementation dependency. A non-conformant
upstream contract does block the matrix.

Read `../_shared/authority-completeness-gates.md`. Before inspecting repository
implementation, require the latest SPEC audit to contain
`SPEC_IMPLEMENTABILITY_CHECK = PASS` and the applicable identity,
reconstruction, lifecycle, persistence, and cross-SPEC proofs. If the proofs
are missing, failed, stale, or contradictory, stop with exactly:

```text
GAP_MATRIX_BLOCKED_BY_SPEC_AUTHORITY_GAP
```

Do not convert the missing authority into an implementation Gap.

Also require the SPEC handoff to contain a completed Implementation Decision
Simulation for every critical requirement. Re-run the simulation defensively
for any requirement whose repository delta touches identity, reconstruction,
rehydration, lifecycle, persistence, recovery, concurrency, stale behavior,
authorization, external effects, or cross-SPEC consumption. A `NO` or
`UNKNOWN` normative answer remains `GAP_MATRIX_BLOCKED_BY_SPEC_AUTHORITY_GAP`;
the Gap Matrix may not turn it into a plan-worthy implementation task.

## Inputs and frozen baselines

Identify and record the target SPEC ID, path, revision and status; component
conformance audit; governing portfolio ID, revision and audit; accepted ADR;
portfolio obligation, dependency, failure-ownership and compatibility/cutover
registries; conformant upstream SPECs; repository commit SHA; working-tree
state; documentation baseline; and assessment timestamp.

Freeze and label these baselines separately:

```text
COMPONENT_SPEC_BASELINE
PORTFOLIO_BASELINE
UPSTREAM_SPEC_BASELINES
REPOSITORY_BASELINE
DOCUMENTATION_BASELINE
```

Record relevant uncommitted changes explicitly. Never silently treat an
unstable tree as a clean baseline. Previous Gap Matrices, implementation
audits, prototypes, and historical evidence are navigation/supporting
evidence only; independently classify the current baseline.

## Load portfolio ownership context

Extract the target component's approved:

```text
OWNED_PORTFOLIO_OBLIGATIONS
CONSUMED_PORTFOLIO_OBLIGATIONS
NORMATIVE_DEPENDENCIES
FAILURE_SEMANTICS_OWNED
FAILURE_SEMANTICS_CONSUMED
COMPATIBILITY_OWNERSHIP
PROJECTION_ROLE
```

Do not rediscover, reassign, or simplify these decisions from repository
layout. Verify repository behavior against them.

## Build the normative inventory

Read the complete conformant component SPEC and extract every
implementation-relevant normative requirement. Preserve canonical requirement
IDs; do not invent replacement IDs. For each requirement record:

```text
Requirement ID
Portfolio Obligation ID
ADR Authority
ADR Section
Ownership Role
SPEC Section
Normative Statement
Expected Observable Behavior
Dependencies
Failure Semantics
Compatibility Role
```

Use only these ownership roles:

```text
CANONICAL_OWNER
CONSUMER
TRANSPORT_MAPPING
DERIVED_PROJECTION
OPERATIONAL_PROJECTION
LOCAL_COMPOSITION
```

If a normative requirement has no valid ADR or portfolio authority despite the
source audit, flag `SOURCE_SPEC_CONFORMANCE_DRIFT`; if material, stop with
`BLOCKED — SOURCE SPEC CONFORMANCE DRIFT` rather than interpreting it locally.

Every normative requirement appears exactly once as the canonical matrix
traceability anchor. Internal clause analysis may inform one row or several
independently closable Gap IDs, but must not create new normative IDs.

### SPEC_IMPLEMENTABILITY_CHECK

Confirm the upstream SPEC audit's proof IDs, revision, applicability, and
result. Confirm defensively that every Aggregate Root, Entity, persistible
lifecycle, and state machine in the inventory has the required
`AGGREGATE_IDENTITY_PROOF` and, where applicable,
`AGGREGATE_RECONSTRUCTION_PROOF`. Confirm that no implementation Gap is being
used to invent identity, lifecycle, provenance, ownership, recovery meaning,
or persistence semantics. This is a handoff check, not a second full SPEC
audit. Any failure emits `GAP_MATRIX_BLOCKED_BY_SPEC_AUTHORITY_GAP`.

### Authority consumption and producer/consumer intake

For every external authority used by a requirement, produce an
`AUTHORITY_CONSUMPTION_PROOF` and `PRODUCER_CONSUMER_CONTRACT_PROOF`. Inspect
actual productive repository surfaces, not only type declarations. Record truth
owner, semantic source, consumer port/query/reader, producer, returned data,
version/revision and failure/not-found/stale semantics, availability condition,
and dependency edge, plus `CAPABILITY_ID`, `AUTHORITY_STATUS`,
`CONTRACT_STATUS`, `SEMANTIC_STATUS`, `LOCAL_TESTABILITY`,
`PRODUCTIVE_AVAILABILITY`, derived `CAPABILITY_SUMMARY_STATUS` when used,
`DEPENDENCY_CLASS`, `AVAILABILITY_EVIDENCE`, and `BLOCKING_EFFECT`.

Classify separately in the independent dimensions:

```text
AUTHORITY_STATUS
CONTRACT_STATUS
LOCAL_TESTABILITY
PRODUCTIVE_AVAILABILITY
DEPENDENCY_CLASS
```

`AUTHORITY_NOT_DEFINED` is a source authority defect and must block with
`GAP_MATRIX_BLOCKED_BY_SPEC_AUTHORITY_GAP`; it must not become a local
implementation Gap. A defined contract with `PRODUCTIVE_AVAILABILITY = NO` is
an availability Gap when its dependency class is
`REQUIRED_FOR_LOCAL_EXECUTION` or `REQUIRED_FOR_LOCAL_CLOSURE`, and must be
recorded as `AUTHORITY_CONSUMPTION_GAP` or `BLOCKED_BY_UPSTREAM_CONTRACT`, with
producer/consumer evidence. A local fixture may set
`LOCAL_TESTABILITY = YES`, never `PRODUCTIVE_AVAILABILITY = YES`. A consumer
with a local execution/closure dependency cannot be execution-ready or locally
closable until that capability is productive and available. A capability
classified only `REQUIRED_FOR_INTEGRATED_PROOF` or `INFORMATIONAL` is carried
forward without blocking local readiness.

The matrix must mechanically reconcile every upstream capability record. A
productive-availability promotion requires the complete
`NO_DOWNSTREAM_CAPABILITY_PROMOTION_WITHOUT_NEW_EVIDENCE` record; otherwise
emit `DOWNSTREAM_PROMOTION_WITHOUT_NEW_EVIDENCE` and stop the affected local
readiness gate.

When mutable external authority is read and later used for an effect, record
the implementation evidence for `TEMPORAL_AUTHORITY_PROOF`: initial basis,
mutation window, independent second observation, drift detection, fail-closed
behavior, semantic validation owner, and the distinct CAS/integrity role. A
self-comparison, reused snapshot, caller value, or CAS alone is not proof.

## Investigate repository behavior

For every requirement inspect actual behavior across all relevant surfaces,
including domain and application code, scheduler/runtime, persistence and
migrations, repositories, journals/outboxes, external/Git adapters, APIs and
commands, queries/events, authentication/authorization, UI and operational
projections, backup/export, retries, idempotency, recovery, compatibility
paths, fixtures, generated clients, and tests. Search by behavior and inspect
the implementation; filenames, symbol names, interfaces, TODOs, and test names
alone do not prove conformance.

For requirements involving authority, identity, lifecycle, mutation,
immutability, eligibility, scheduler capacity, concurrency, persistence,
publication, idempotency, authorization, or compatibility, explicitly search
for alternate productive paths. A canonical path plus a bypass is not
conformant.

Keep these evidence dimensions separate for every requirement:

```text
IMPLEMENTATION_EVIDENCE
TEST_EXISTENCE_EVIDENCE
TEST_EXECUTION_EVIDENCE
```

Test existence requires inspecting assertions, not just names. Test execution
must identify command, baseline/environment, and pass/fail/blocked result. A
test execution limitation does not by itself change implementation
classification. Historical execution is historical unless independently
reproduced against the assessed baseline.

For each requirement, also assign an independent conformance-evidence status:

```text
PROVEN
WEAKLY_PROVEN
UNTESTED
EXECUTION_UNVERIFIED
NOT_IMPLEMENTED
NOT_APPLICABLE
```

Implementation classification and proof status are separate dimensions. Valid
combinations include `IMPLEMENTED / UNTESTED`, `PARTIAL / PROVEN`, and
`IMPLEMENTED / EXECUTION_UNVERIFIED`. Missing tests do not automatically mean
missing implementation; create an `EVIDENCE_ONLY` Gap only when the absent
proof is material to downstream conformance.

## Classify each requirement

Assign exactly one primary classification:

```text
IMPLEMENTED
PARTIAL
MISSING
CONTRADICTORY
NOT_APPLICABLE
OWNED_BY_OTHER_SPEC
UNVERIFIED
```

### Classification rules

- `IMPLEMENTED`: the selected component's full local obligation and required
  foreign interactions are evidenced as conformant. Behavioral resemblance is
  insufficient.
- `PARTIAL`: local behavior exists but one or more clauses, enforcement paths,
  integrations, or material proofs are incomplete. State exactly what exists
  and what is absent.
- `MISSING`: no sufficient local implementation exists, after proving the
  obligation is locally owned. Missing foreign capability is not local MISSING.
- `CONTRADICTORY`: repository behavior actively violates accepted semantics,
  such as a bypass, mutable state where immutable is required, wrong lifecycle
  authority, stale overwrite, premature publication completion, forged lease,
  or consumer-redefined failure semantics. Do not hide this under PARTIAL.
- `NOT_APPLICABLE`: no obligation applies to the assessed repository scope;
  provide a precise justification.
- `OWNED_BY_OTHER_SPEC`: use only when `LOCAL_IMPLEMENTATION_OBLIGATION = NONE`.
  Record foreign owner, foreign requirement, and local consumer expectation.
- `UNVERIFIED`: reasonable investigation cannot safely distinguish the other
  states. Record the possible state, blocker, and exact evidence needed; do not
  use it as a shortcut for investigation.

## Mixed ownership and boundary checks

Before classifying a mixed requirement record:

```text
LOCAL_OBLIGATION
FOREIGN_OBLIGATION
FOREIGN_OWNER
LOCAL_INTEGRATION_EXPECTATION
```

Classify based on the selected component's local obligation. Foreign
implementation absence becomes a local gap only when the local integration
obligation is absent or impossible. Pure foreign requirements may be
`OWNED_BY_OTHER_SPEC`; mixed requirements may not.

Compare approved portfolio owner with the repository's actual authority and
record one secondary result:

```text
OWNERSHIP_CONFORMANT
IMPLEMENTATION_LOCATION_CONCERN
WRONG_OWNER_IMPLEMENTATION
ALTERNATE_AUTHORITY_PRESENT
UNVERIFIED
```

An unexpected location that preserves canonical authority is a location
concern, not automatically a gap. Wrong semantic ownership or an alternate
authority is normally `CONTRADICTORY` with category
`PORTFOLIO_OWNERSHIP_VIOLATION`.

Inspect backend, API, operations, UI, reports, read models, and caches to prove
that they remain mappings or projections where the portfolio assigns canonical
ownership. A projection becoming authority is a contradiction.

## Failure and compatibility ownership

Using the approved failure registry, record for each relevant failure:

```text
Failure
Portfolio Semantic Owner
Component Role
Repository Implementation Location
Repository Semantic Owner
Result
```

Use `SATISFIED`, `PARTIAL`, `MISSING`, `WRONG_OWNER`,
`SEMANTICALLY_CONTRADICTORY`, or `UNVERIFIED`. Verify that transport, UI, or
logging mappings do not alter trigger, meaning, retryability, terminality,
recovery meaning, or canonical-state implication. A wrong semantic owner is a
gap.

Using the compatibility registry, inspect each applicable dimension:

```text
NEW_CANONICAL_PATH
LEGACY_COMPATIBILITY
HISTORICAL_REPLAY
CUTOVER
RETIREMENT
```

Record whether the component is `OWNER`, `CONSUMER`, or `NOT_APPLICABLE`, then
detect dual canonical paths, legacy bypasses, missing replay/cutover/
retirement support, and wrong compatibility ownership. Only local obligations
become selected-spec gaps.

## Exact deltas and gap identity

Requirements and Gaps are different. A Gap ID identifies one distinct,
independently meaningful repository delta. Group requirements only when they
share the same underlying delta, owner, authority, dependency, failure
semantic, and compatibility transition. Split when deltas can be closed
independently or differ materially in those dimensions.

Use sequential IDs `GAP-001`, `GAP-002`, and so on. Preserve every affected
Requirement ID in grouped records. One requirement may list multiple Gap IDs
only when its deltas are materially independent.

Use exactly one category per Gap:

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

Use exactly one severity per Gap:

```text
BLOCKER
MAJOR
MINOR
EVIDENCE_ONLY
```

`BLOCKER` means planning cannot safely proceed because authority, dependency,
baseline, or the material delta is indeterminate. Size alone is not a
blocker. `MAJOR` covers material ownership, lifecycle, identity, persistence,
recovery, external-effect, scheduler, publication, integration, or
compatibility defects. `MINOR` is localized normative incompleteness.
`EVIDENCE_ONLY` means implementation is materially present but proof is
insufficient or unreproducible.

For every `PARTIAL`, `MISSING`, and `CONTRADICTORY` row write:

```text
OBSERVED:
<current repository behavior>

REQUIRED:
<component SPEC behavior>

DELTA:
<smallest material behavioral difference>
```

For `UNVERIFIED`, write:

```text
POSSIBLE_STATE:
<what current evidence suggests>

VERIFICATION_BLOCKER:
<why classification is unsafe>

EVIDENCE_NEEDED:
<what would resolve it>
```

Describe where the delta is observed, not how a planner should implement it.
Do not prescribe classes, modules, schemas, algorithms, refactors, tickets,
implementation units, or sequence.

## Required artifact

Create only:

```text
docs/specs/gap-matrices/<SPEC-ID>-implementation-gap-matrix.md
```

Use the repository's equivalent convention if it is clearly established, and
record the actual path. The document must contain exactly these major sections:

```text
1. Executive Summary
2. Assessment Subject
3. Frozen Baselines
4. Authority and Ownership Context
5. Normative Requirement Inventory
6. Existing Implementation Inventory
7. Implementation Gap Matrix
8. Detailed Gap Records
9. Contradictory Implementation Findings
10. Responsibility Leakage Analysis
11. Failure Ownership Verification
12. Compatibility / Cutover Verification
13. Cross-SPEC Dependency Matrix
14. Conformance Evidence Assessment
15. Coverage and Severity Metrics
16. Material Reliability Checks
17. Implementation Readiness
18. Recommended Next Governance Step
19. Completeness Proof
```

### Primary matrix

Include one row for every normative requirement, with this schema:

| Gap ID | Requirement ID | Portfolio Obligation ID | Ownership Role | Requirement Summary | Classification | Implementation Evidence | Test Evidence | Exact Delta / Verification Blocker | Owner | Dependencies | Confidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

For `IMPLEMENTED`, `NOT_APPLICABLE`, and pure `OWNED_BY_OTHER_SPEC`, use
`Gap ID = —` unless a local integration or material evidence gap exists.
Keep implementation, test-existence, and test-execution evidence distinct in
the row or linked evidence section.

### Detailed Gap Records

Create exactly one record per distinct Gap ID, containing:

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

For mixed ownership, also include `LOCAL_OBLIGATION`, `FOREIGN_OBLIGATION`,
`FOREIGN_OWNER`, and `LOCAL_INTEGRATION_EXPECTATION`.

### Other required analyses

Keep the implementation inventory concise and limited to material evidence
across domain, execution, scheduler, persistence, repository integration,
Git/GitHub, backend/API, operations, UI, security, tests, and compatibility.

Add a dedicated contradiction table with:

```text
Requirement
Gap ID
Portfolio Obligation
Repository Location
Observed Behavior
Required Behavior
Wrong Owner?
Alternate Productive Path?
Can Mutate Canonical State?
Historical Non-Conformance Risk?
Severity
```

Add a responsibility leakage analysis that distinguishes structural location
concerns from semantic wrong-owner implementation. Add the failure ownership
and compatibility/cutover checks described above.

Add a conformance evidence assessment showing the independent implementation,
test-existence, test-execution, and evidence-status values for every
requirement. Record the exact command and result for executed tests, and keep
environment limitations separate from repository behavior.

Add this cross-SPEC dependency matrix:

| Capability ID | Dependency SPEC | Authority Status | Contract Status | Authority Owner | Producer | Consumer | Contract | Semantic Status | Local Testability | Productive Availability | Dependency Class | Availability Evidence | Promotion Record | Blocking Effect | Result |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

Use result values `SATISFIED`, `PARTIAL`, `MISSING`, `UNVERIFIED`, or
`NOT_REQUIRED_FOR_CURRENT_GAPS`. A missing foreign implementation is not a
local gap. It must be recorded as `BLOCKED_BY_UPSTREAM_CONTRACT` when local
closure or end-to-end acceptance cannot be safely determined without it.

## Metrics and reliability gates

Calculate and report:

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

TOTAL_DISTINCT_GAPS
BLOCKER_GAPS
MAJOR_GAPS
MINOR_GAPS
EVIDENCE_ONLY_GAPS

PORTFOLIO_OWNERSHIP_VIOLATION_GAPS
FAILURE_SEMANTIC_VIOLATION_GAPS
COMPATIBILITY_VIOLATION_GAPS
DEPENDENCY_INTEGRATION_GAPS

MIXED_OWNERSHIP_REQUIREMENTS
WRONG_OWNER_IMPLEMENTATIONS
IMPLEMENTATION_LOCATION_CONCERNS

UNRESOLVED_OWNERSHIP
UNRESOLVED_MATERIAL_DELTA
UNSUPPORTED_IMPLEMENTED_CLAIMS
KNOWN_FALSE_POSITIVE_GAPS
KNOWN_FALSE_NEGATIVE_GAPS
```

Implementation coverage is over requirements wholly or partly owned by the
selected component. Pure `OWNED_BY_OTHER_SPEC` requirements may be excluded;
mixed requirements remain in the denominator. State the formula and counts.

Before readiness, verify:

```text
UNCLASSIFIED_REQUIREMENTS = 0
UNRESOLVED_OWNERSHIP = 0
UNRESOLVED_MATERIAL_DELTA = 0
UNSUPPORTED_IMPLEMENTED_CLAIMS = 0
KNOWN_FALSE_POSITIVE_GAPS = 0
KNOWN_FALSE_NEGATIVE_GAPS = 0
SPECIFICATION_AMBIGUITY = 0
ARCHITECTURAL_AUTHORITY_GAP = 0
PORTFOLIO_AUTHORITY_GAP = 0
SOURCE_SPEC_CONFORMANCE_DRIFT = 0
IDENTITY_AUTHORITY_GAPS = 0
RECONSTRUCTION_AUTHORITY_GAPS = 0
REHYDRATION_AUTHORITY_GAPS = 0
LIFECYCLE_AUTHORITY_GAPS = 0
PERSISTENCE_SEMANTICS_GAPS = 0
CROSS_SPEC_AUTHORITY_GAPS = 0
SPEC_IMPLEMENTABILITY_CHECK = PASS
AUTHORITY_NOT_DEFINED = 0
CAPABILITY_AVAILABILITY_RECORDS = <n>
CAPABILITIES_BELOW_PRODUCTIVE_AVAILABILITY = <n>
LOCAL_TESTABLE_CAPABILITIES = <n>
PRODUCTIVELY_AVAILABLE_CAPABILITIES = <n>
AUTHORITY_CONSUMPTION_CLASSIFICATION_ERRORS = 0
DOWNSTREAM_PROMOTION_WITHOUT_NEW_EVIDENCE = 0
READY_CLAIMS_WITH_UNAVAILABLE_CONTRACT = 0
TEMPORAL_AUTHORITY_GAPS = 0
```

Label matrix defects as `PLANNING_BLOCKING` or `NON_BLOCKING`. A defect is
planning-blocking if it could omit work, create false work, assign the wrong
owner, miss a dependency or contradiction, rely on unsupported IMPLEMENTED,
or leave the delta indeterminate. Cosmetic prose, formatting, and inability to
rerun historical tests are non-blocking when current behavior is classifiable.

## Readiness result

End with exactly one result:

```text
READY_FOR_IMPLEMENTATION_PLAN
NO_IMPLEMENTATION_GAPS
BLOCKED_BY_SPECIFICATION_AMBIGUITY
GAP_MATRIX_BLOCKED_BY_SPEC_AUTHORITY_GAP
BLOCKED_BY_ARCHITECTURAL_AUTHORITY
BLOCKED_BY_PORTFOLIO_AUTHORITY
GAP_MATRIX_INCOMPLETE
```

Use `READY_FOR_IMPLEMENTATION_PLAN` only when both precondition verdicts pass
and every reliability gate above is zero. Capabilities with
`PRODUCTIVE_AVAILABILITY = NO` do not by themselves invalidate the Gap Matrix;
they must be carried forward with their dependency class as explicit blockers,
and may not be used to mark dependent local work execution-ready when the class
is `REQUIRED_FOR_LOCAL_EXECUTION` or `REQUIRED_FOR_LOCAL_CLOSURE`.
`NO_IMPLEMENTATION_GAPS` applies
when all local obligations are implemented and only not-applicable, pure
foreign, or non-material evidence observations remain. Do not use a blocking
result solely because tests cannot execute.

Use `BLOCKED_BY_SPECIFICATION_AMBIGUITY` only when the conformant SPEC no
longer determines conformance; `BLOCKED_BY_ARCHITECTURAL_AUTHORITY` when a new
architectural decision is required; `BLOCKED_BY_PORTFOLIO_AUTHORITY` when
ownership/dependency cannot be classified under the approved portfolio;
`GAP_MATRIX_BLOCKED_BY_SPEC_AUTHORITY_GAP` whenever the SPEC authority proof
is absent, failed, stale, or insufficient; and `GAP_MATRIX_INCOMPLETE` for
unclassified requirements, inaccessible material surfaces, unresolved
ownership, or indeterminate deltas.

The recommended next governance step is the narrowest truthful handoff: a
downstream Implementation Plan only when the result is
`READY_FOR_IMPLEMENTATION_PLAN`; otherwise identify the blocking authority,
evidence, or completeness condition. Do not turn this handoff into plan units,
tickets, owners, or execution waves.

## Completeness proof

The final section must prove:

```text
every normative requirement inventoried
every requirement classified exactly once
every IMPLEMENTED claim evidenced
every PARTIAL/MISSING/CONTRADICTORY row has an exact delta
every pure foreign row identifies its owner
every mixed row separates local and foreign obligations
every Gap has exactly one detail record
every detail record has exactly one severity
every grouped Gap preserves affected requirements
severity metrics derive from distinct Gap records
failure ownership was checked
compatibility ownership was checked
portfolio ownership was checked
test existence and execution evidence remain distinct
SPEC_IMPLEMENTABILITY_CHECK was confirmed
authority gaps were not converted into implementation gaps
authority consumption and producer/consumer contracts were classified
temporal authority was checked where applicable
no implementation design was introduced
no code/SPEC/portfolio was modified
```

Report at minimum:

```text
TOTAL_NORMATIVE_REQUIREMENTS
TOTAL_CLASSIFIED_REQUIREMENTS
UNCLASSIFIED_REQUIREMENTS
TOTAL_DISTINCT_GAPS
MIXED_OWNERSHIP_REQUIREMENTS
UNRESOLVED_OWNERSHIP
UNRESOLVED_MATERIAL_DELTA
UNSUPPORTED_IMPLEMENTED_CLAIMS
KNOWN_FALSE_POSITIVE_GAPS
KNOWN_FALSE_NEGATIVE_GAPS
BLOCKER_GAPS
MAJOR_GAPS
MINOR_GAPS
EVIDENCE_ONLY_GAPS
PORTFOLIO_AUTHORITY_GAP
ARCHITECTURAL_AUTHORITY_GAP
SPECIFICATION_AMBIGUITY
SOURCE_SPEC_CONFORMANCE_DRIFT
IDENTITY_AUTHORITY_GAPS
RECONSTRUCTION_AUTHORITY_GAPS
REHYDRATION_AUTHORITY_GAPS
LIFECYCLE_AUTHORITY_GAPS
PERSISTENCE_SEMANTICS_GAPS
CROSS_SPEC_AUTHORITY_GAPS
SPEC_IMPLEMENTABILITY_CHECK
```

`UNCLASSIFIED_REQUIREMENTS = 0` is mandatory for a complete matrix.

In section `19. Completeness Proof`, end the canonical matrix with exactly this
workflow field after proving the matrix is complete:

```text
WORKFLOW_GATE: COMPONENT_IMPLEMENTATION_GAP_MATRIX_COMPLETE
```

This field records the producer's completion gate for deterministic workflow
routing. Do not emit it for a blocked or incomplete matrix.

## Final console response

After creating the artifact, respond exactly in this shape, filling all
placeholders from the matrix:

```text
COMPONENT_IMPLEMENTATION_GAP_MATRIX_COMPLETE

SPEC: <SPEC-ID>
SPEC_VERDICT: PASS — COMPONENT_SPEC_CONFORMANT
PORTFOLIO: <PORTFOLIO-ID>
PORTFOLIO_VERDICT: PORTFOLIO_DECOMPOSITION_APPROVED
REPOSITORY_BASELINE: <sha>

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

OWNERSHIP:
- MIXED_REQUIREMENTS: <n>
- WRONG_OWNER_IMPLEMENTATIONS: <n>
- PORTFOLIO_OWNERSHIP_GAPS: <n>

RELIABILITY:
- UNCLASSIFIED_REQUIREMENTS: <n>
- UNRESOLVED_OWNERSHIP: <n>
- UNRESOLVED_MATERIAL_DELTA: <n>
- UNSUPPORTED_IMPLEMENTED_CLAIMS: <n>
- FALSE_POSITIVE_GAPS: <n>
- FALSE_NEGATIVE_GAPS: <n>

RESULT:
<readiness result>

MATRIX:
<path>
```

The core invariant is supportable only when every normative requirement has
been compared independently with the current repository, portfolio ownership
has been preserved, local and foreign obligations are separated, every claim
has concrete evidence, every non-conformant behavior has an observable delta,
wrong-owner/failure/compatibility/bypass conditions have been checked, Gap IDs
are stable, and the artifact is reliable enough for a planner to determine
how to close gaps without rediscovering authority, ownership, requirements, or
implementation state.
