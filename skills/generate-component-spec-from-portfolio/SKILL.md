---
name: generate-component-spec-from-portfolio
description: >
  Generate one component specification from an approved SPEC portfolio
  decomposition and its accepted ADR authority. Materialize the component's
  pre-approved normative boundary into complete, testable behavioral
  requirements without rediscovering ownership, inventing architecture,
  duplicating cross-SPEC authority, or leaking implementation planning into the
  specification. Use only after the governing portfolio decomposition is
  independently approved and before Gap Matrix generation, Implementation
  Planning, ticket decomposition, or implementation.
---

# Generate Component SPEC from Approved Portfolio

## Purpose

Generate one normative component SPEC from:

```text
ACCEPTED ADR AUTHORITY
        +
APPROVED SPEC PORTFOLIO DECOMPOSITION
        +
CONFORMANT UPSTREAM COMPONENT CONTRACTS
        +
CURRENT REPOSITORY EVIDENCE
```

The task of this skill is not to decide how the architecture should be
decomposed.

That decision has already been made by the approved portfolio.

The task is to materialize one approved component boundary into:

* complete normative behavior;
* precise ownership;
* explicit consumed contracts;
* observable requirements;
* failure semantics;
* compatibility requirements;
* conformance tests;
* binary acceptance criteria;
* traceability from ADR obligations to SPEC requirements.

The resulting SPEC must be ready for independent SPEC validation.

Before drafting and before returning the artifact, read
`../_shared/authority-completeness-gates.md`. The SPEC generator must
materialize its applicable proofs from accepted ADR/portfolio authority; it
must stop rather than invent a missing identity, lifecycle, provenance,
reconstruction, persistence, recovery, or cross-SPEC decision.

For every cross-component capability, persist the four independent authority,
contract, local-testability, and productive-availability dimensions, the
dependency class, and all handoff fields. A fixture/mock/fake may set
`LOCAL_TESTABILITY = YES`, never `PRODUCTIVE_AVAILABILITY = YES`. Run the shared
Implementation Decision
Simulation for every critical behavior before emitting any implementability
claim.

It must not yet become an Implementation Plan.

---

# Operating mode

Operate in:

```text
WRITE_ALLOWED
ADR_FIRST
PORTFOLIO_GOVERNED
COMPONENT_SCOPED
REPOSITORY_GROUNDED
NO_ARCHITECTURE_INVENTION
NO_OWNERSHIP_REDISCOVERY
NO_IMPLEMENTATION_PLAN
NO_TICKET_DECOMPOSITION
NO_PRODUCTION_IMPLEMENTATION
```

---

# Core principle

A component SPEC is not allowed to discover its normative boundary.

Its normative boundary is supplied by the approved SPEC portfolio.

Therefore:

```text
ADR
    defines architectural authority

Portfolio
    allocates normative ownership and dependencies

Component SPEC
    materializes owned obligations into complete behavior

Repository
    informs current-state and gap classification

Gap Matrix
    later proves repository divergence

Implementation Plan
    later defines how to close those divergences
```

Do not collapse these layers.

---

# 1. Required inputs

Required:

1. governing SPEC portfolio;
2. latest independent portfolio decomposition audit;
3. evidence that the portfolio verdict is:

```text
PORTFOLIO_DECOMPOSITION_APPROVED
```

4. target component SPEC identifier;
5. all accepted ADRs associated with that component;
6. the portfolio obligation registry;
7. the portfolio dependency registry;
8. portfolio failure ownership registry, when applicable;
9. portfolio compatibility/cutover registry, when applicable.

Required when materialized:

10. all upstream component SPECs on which the target component has normative
    dependencies;
11. their latest conformant audit evidence.

Supporting:

* repository source;
* tests;
* prototype;
* historical audit reports;
* prior component drafts;
* prior Gap Matrix when this is a revision/remediation cycle.

---

# 2. Authority order

Use exactly this authority precedence:

```text
accepted ADR
    >
approved SPEC portfolio decomposition
    >
conformant upstream component SPEC
    >
target component SPEC being generated
    >
repository implementation
    >
tests
    >
prototype
    >
historical evidence
```

Accepted ADR authority remains architecturally supreme.

The approved portfolio is authoritative for decomposition concerns including:

* which component owns each obligation;
* which components consume the contract;
* dependency direction;
* transversal contract ownership;
* failure semantic ownership;
* compatibility/cutover ownership;
* projection boundaries.

A component SPEC must not override those allocations.

---

# 3. Preconditions

Before writing the SPEC verify all of the following.

## 3.1 Portfolio approval

The governing portfolio must have the latest independent verdict:

```text
PORTFOLIO_DECOMPOSITION_APPROVED
```

Otherwise stop with:

```text
BLOCKED — PORTFOLIO DECOMPOSITION NOT APPROVED
```

Do not generate the component SPEC against a proposed or remediation-pending
portfolio.

---

## 3.2 ADR eligibility

Every ADR used as normative authority must be accepted and effective.

If a required ADR is proposed, conflicting, unavailable or superseded without
clear successor handling, stop.

Possible results:

```text
BLOCKED — PRIMARY ARCHITECTURAL AUTHORITY NOT ACCEPTED

BLOCKED — ADR CONTRADICTION

BLOCKED — ARCHITECTURAL DECISION REQUIRED
```

---

## 3.3 Component ownership exists

The target component must exist in the approved portfolio.

The portfolio must define:

* owned obligations;
* consumers;
* dependencies;
* boundary exclusions.

If a required obligation is not allocated or ownership is ambiguous:

```text
BLOCKED — PORTFOLIO OWNERSHIP GAP
```

Do not assign the obligation locally.

---

## 3.4 Upstream dependencies are eligible

For each normative upstream dependency:

* locate its component SPEC;
* verify its current authoritative revision;
* verify that its latest audit permits normative consumption.

If the upstream component is not yet conformant:

```text
BLOCKED — UPSTREAM SPEC NOT CONFORMANT
```

Do not recreate its contract locally to bypass the dependency.

---

# 4. Establish generation baseline

Record:

```text
TARGET_COMPONENT
PORTFOLIO_ID
PORTFOLIO_REVISION
PORTFOLIO_AUDIT
PORTFOLIO_VERDICT
PRIMARY_ADRS
RELATED_ADRS
OWNED_OBLIGATIONS
UPSTREAM_DEPENDENCIES
REPOSITORY_HEAD
EXISTING_COMPONENT_DRAFT
```

If an existing target draft exists, treat this task as reconciliation rather
than blind regeneration.

Preserve valid content where it conforms to approved authority.

Do not preserve conflicting content merely to reduce diff size.

---

# 5. Load component boundary from portfolio

Extract the target component's approved boundary.

Create an internal component ownership set:

```text
OWNED_OBLIGATIONS
CONSUMED_OBLIGATIONS
EXPLICIT_EXCLUSIONS
NORMATIVE_DEPENDENCIES
FAILURE_SEMANTICS_OWNED
FAILURE_SEMANTICS_CONSUMED
COMPATIBILITY_OWNERSHIP
PROJECTION_ROLE
```

The component may define normatively only:

```text
OWNED_OBLIGATIONS
```

For consumed obligations it may only:

* reference;
* constrain local use;
* define local mapping/projection behavior where authorized.

It must not redefine their canonical semantics.

---

# 6. Enforce portfolio ownership before drafting

For every proposed normative requirement ask:

```text
Is this behavior allocated to this component?
```

Classify:

```text
OWNED
CONSUMED
UNRELATED
UNMAPPED
```

Rules:

## OWNED

May be normatively specified.

## CONSUMED

Reference upstream owner.

May specify only local consumption behavior.

## UNRELATED

Remove from this SPEC.

## UNMAPPED

Stop affected scope with:

```text
BLOCKED — PORTFOLIO OWNERSHIP GAP
```

Never resolve unmapped behavior inside the component SPEC.

---

# 7. Inspect accepted ADR authority

Read every ADR relevant to:

* owned obligations;
* transversal constraints consumed by the component;
* compatibility;
* failure semantics;
* conformance.

For each owned portfolio obligation validate:

```text
PORTFOLIO_OBLIGATION
    →
SOURCE_ADR
    →
SOURCE_SECTION
    →
ARCHITECTURAL_CONSEQUENCE
```

Do not rely only on ADR title or portfolio summary.

The component requirement must preserve the actual accepted decision.

---

# 8. Inspect upstream component contracts

Read each conformant upstream SPEC only for contracts this component consumes.

Build an internal consumed-contract map:

```text
OWNER_SPEC
CONTRACT_ID
LOCAL_USE
LOCAL_MAPPING
FAILURE_PROPAGATION
VERSION/BASIS REQUIREMENT
```

Do not copy upstream requirements wholesale.

Reference canonical IDs whenever possible.

Example:

```text
SPEC-EXEC-002 consumes DOM-TICKET-STATE-004.
```

Not:

```text
SPEC-EXEC-002 redefines the complete ticket transition table.
```

---

# 9. Repository inspection is mandatory

Inspect the actual repository.

Determine current behavior relevant to this component:

* existing code;
* domain/application seams;
* persistence seams;
* external adapters;
* API boundaries;
* frontend/projection behavior;
* configuration;
* legacy paths;
* tests;
* fixtures;
* prototype behavior;
* current gaps.

Repository evidence may refine:

```text
CURRENT_STATE
KNOWN_GAP
LEGACY_BEHAVIOR
ALREADY_IMPLEMENTED_BEHAVIOR
IMPLEMENTATION_EVIDENCE
```

Repository evidence must not modify:

```text
PORTFOLIO_OWNERSHIP
ADR_AUTHORITY
DEPENDENCY_DIRECTION
```

---

# 10. Existing SPEC overlap analysis

Search other component SPECs.

Classify overlapping behavior as:

```text
CANONICAL_UPSTREAM_CONTRACT
VALID_LOCAL_MAPPING
VALID_LOCAL_PROJECTION
DUPLICATE_AUTHORITY
UNRELATED
```

If duplicate normative ownership appears:

```text
BLOCKED — CROSS-SPEC OWNERSHIP CONFLICT
```

Do not decide locally which SPEC should keep the behavior.

That requires portfolio remediation.

---

# 11. Define SPEC ownership explicitly

The component SPEC must begin with:

```text
Owns
Consumes
Does not own
```

## Owns

List approved portfolio-owned behavior.

## Consumes

List upstream canonical contracts.

## Does not own

Explicitly exclude nearby domains likely to cause confusion.

Avoid generic ownership such as:

```text
owns execution
owns backend behavior
owns operations
```

Prefer specific bounded ownership.

---

# 12. Architectural authority section

List:

* governing portfolio;
* portfolio revision;
* approved decomposition audit;
* primary accepted ADRs;
* related accepted ADRs;
* conformant upstream SPECs.

State explicitly:

> This specification materializes ownership already assigned by the approved
> portfolio and does not redefine portfolio boundaries.

---

# 13. Problem statement

Explain:

1. what accepted architecture requires within this boundary;
2. what the repository currently does;
3. which behavior is absent, divergent or only simulated;
4. why that matters;
5. which capability becomes possible once this SPEC is satisfied.

Do not convert implementation absence into architecture ambiguity.

---

# 14. Goals

Goals must be observable.

Good:

```text
A scheduler cannot dispatch an activity unless a canonical eligible assignment
and capacity lease exist.
```

Bad:

```text
Improve scheduler architecture.
```

Every goal should be traceable to one or more owned obligations.

---

# 15. Non-goals

Explicitly exclude:

* behavior owned by other component SPECs;
* implementation planning;
* ticket structure;
* internal class/file decomposition;
* technology not frozen by ADR;
* future capabilities not needed to prove conformance;
* downstream projection details not owned here.

---

# 16. Current repository state

Produce:

| Area | Current behavior | Target behavior | Classification |
| ---- | ---------------- | --------------- | -------------- |

Allowed classifications:

```text
ALREADY_CONFORMANT
SPECIFICATION_GAP
IMPLEMENTATION_GAP
LEGACY_COMPATIBILITY
PROTOTYPE_ONLY
NON_GAP
UNFROZEN_IMPLEMENTATION_DETAIL
ARCHITECTURE_GAP
```

If `ARCHITECTURE_GAP` is material to owned scope:

```text
BLOCKED — ARCHITECTURAL DECISION REQUIRED
```

Do not continue by inventing the answer.

---

# 17. Owned architectural obligations

The SPEC must enumerate every portfolio obligation owned by this component.

Use:

| Portfolio obligation | ADR authority | Source section | Local treatment |
| -------------------- | ------------- | -------------- | --------------- |

Every owned obligation must result in at least one of:

```text
NORMATIVE_REQUIREMENT
EXPLICIT_INVARIANT
FAILURE_SEMANTIC
ACCEPTANCE_CRITERION
CONFORMANCE_TEST
```

No owned obligation may disappear into prose.

---

# 18. Consumed contracts

Create:

| Owner SPEC | Contract / requirement | Why consumed | Local rule |
| ---------- | ---------------------- | ------------ | ---------- |

The local rule may define:

* use;
* validation;
* propagation;
* mapping;
* projection.

It may not redefine canonical semantics.

For each external authority consumed by the component, include an
`AUTHORITY_CONSUMPTION_PROOF` and, for every inter-component dependency, a
`PRODUCER_CONSUMER_CONTRACT_PROOF` as defined in
`../_shared/authority-completeness-gates.md`. The SPEC must distinguish
`AUTHORITY_NOT_DEFINED` from `AUTHORITY_DEFINED_BUT_NOT_CONSUMABLE`; do not
describe a conceptual dependency as an available contract.

The proof must include `CAPABILITY_ID`, `AUTHORITY_OWNER`, `PRODUCER`,
`CONSUMER`, `CONTRACT`, `SEMANTIC_STATUS`, `LOCAL_TESTABILITY`,
`PRODUCTIVE_AVAILABILITY`, `AVAILABILITY_EVIDENCE`, and `BLOCKING_EFFECT`.
When the producer is not productively evidenced, record
`CONTRACT_STATUS = DEFINED` with `PRODUCTIVE_AVAILABILITY = NO`; never emit
`AUTHORITY_CONSUMABLE`.

---

# 19. Target behavioral model

Define only the target model inside this component boundary.

Show:

```text
inputs
    ↓
owned behavior
    ↓
state/effect/output
```

Include external owner interactions as referenced contracts.

Do not redraw the whole system unless necessary.

Do not imply ownership through diagram placement.

---

# 20. Identity and authority rules

Specify only identities relevant to this component.

For each identify:

```text
CANONICAL_OWNER
REFERENCE_IDENTITY
LOCAL_CORRELATION
DERIVED_PROJECTION
```

Do not introduce duplicate identity.

Mutable labels must not replace canonical IDs where accepted authority requires
exact identity.

For every Aggregate Root, Entity, persistible lifecycle, or state machine in
scope, include the applicable `AGGREGATE_IDENTITY_PROOF` and
`AGGREGATE_RECONSTRUCTION_PROOF` defined in the shared reference. Generic
identity claims are not sufficient. If accepted authority does not determine a
concrete identity or valid reconstruction contract, stop with:

```text
SPEC_GENERATION_BLOCKED_BY_AUTHORITY_GAP
category = IDENTITY_AUTHORITY_GAP | REHYDRATION_AUTHORITY_GAP |
           LIFECYCLE_AUTHORITY_GAP | PERSISTENCE_SEMANTICS_GAP |
           CROSS_SPEC_AUTHORITY_GAP
```

---

# 21. Normative requirements

Create stable component-local requirement IDs.

Recommended pattern:

```text
<COMPONENT>-<AREA>-###
```

Examples:

```text
DOM-STATE-001
EXEC-SCHED-004
PLAT-EFFECT-007
GIT-PUB-003
BACKEND-API-006
OPS-RET-002
UI-STATE-009
```

Every requirement must be:

* independently understandable;
* testable;
* explicitly traceable to portfolio obligation;
* traceable to accepted ADR authority;
* scoped to this component;
* explicit about negative behavior where relevant.

---

# 22. Requirement authority rule

Every normative requirement must contain or trace to:

```text
PORTFOLIO_OBLIGATION_ID
ADR_ID
ADR_SECTION
```

No orphan requirement is allowed.

If a useful requirement has no portfolio obligation:

1. determine whether it is merely a local specification detail;
2. if so, keep it non-architectural and explain why;
3. if it introduces product authority, stop with:

```text
BLOCKED — PORTFOLIO OWNERSHIP GAP
```

or:

```text
BLOCKED — ARCHITECTURAL DECISION REQUIRED
```

as appropriate.

---

# 23. Commands, queries and events

Include this section only where applicable.

For each classify:

```text
CANONICAL_DOMAIN_COMMAND
APPLICATION_COMMAND
TRANSPORT_COMMAND
CANONICAL_EVENT
INTEGRATION_EVENT
TRANSPORT_EVENT
PROJECTION_EVENT
QUERY
```

Specify canonical semantics only when owned by this component.

A backend SPEC, for example, may define:

* API envelope;
* correlation;
* dispatch;
* transport failure.

It may not redefine a domain command owned by DOM.

---

# 24. Failure semantics

Use the approved portfolio failure ownership registry.

For each failure relevant to this component classify:

```text
OWNED_CANONICAL_FAILURE
CONSUMED_FAILURE
LOCAL_TRANSPORT_MAPPING
LOCAL_UI_PRESENTATION
LOCAL_OPERATIONAL_PROJECTION
```

For owned failures define:

* trigger;
* meaning;
* retryability where relevant;
* state/effect implications;
* recovery behavior;
* required evidence.

For consumed failures:

* preserve canonical semantics;
* define only local mapping if necessary.

Do not silently translate one failure into another canonical failure.

---

# 25. Retry, idempotency and recovery

Only define canonical retry/idempotency/recovery behavior when owned.

Otherwise reference the owner.

Separate:

```text
canonical retry semantics
local operational retry
transport replay
projection replay
```

Never let local transport retry change canonical command/effect semantics.

---

# 26. Compatibility and cutover

Use the approved portfolio compatibility registry.

For each applicable class:

```text
NEW_CANONICAL_PATH
LEGACY_COMPATIBILITY
HISTORICAL_REPLAY
CUTOVER
RETIREMENT
```

state whether this component is:

```text
OWNER
CONSUMER
NOT_APPLICABLE
```

If OWNER, define:

* preserved history;
* compatibility contract;
* cutover invariant;
* retirement condition;
* evidence required.

Do not define implementation phases here.

---

# 27. Projection boundaries

When this component exposes projections, state explicitly:

```text
CANONICAL_SOURCE
PROJECTION
REFRESH/REPLAY BEHAVIOR
STALE BEHAVIOR
AUTHORITY_LIMIT
```

A projection may be complete for consumers.

It must not become the source of canonical truth.

---

# 28. External effect boundary

Include only when relevant.

Distinguish:

```text
REQUEST
INTENT
EXTERNAL_EXECUTION
EVIDENCE
CONFIRMATION
RECONCILIATION
PROJECTION
```

Assign each semantic to its canonical owner.

A component that invokes an adapter does not automatically own persistence or
effect reconciliation.

---

# 29. Security and authorization

Include only requirements allocated to this component or consumed from a
security owner.

Distinguish:

```text
domain authorization
application authorization
transport authentication
secret storage
UI session behavior
```

Do not move authority between layers for convenience.

---

# 30. Conformance suite

The SPEC must define how independent conformance will be proven.

At minimum include:

## Positive

Expected valid behavior.

## Negative

Forbidden behavior and fail-closed behavior.

## Boundary isolation

Prove this component does not steal another component's authority.

## Dependency conformance

Prove upstream contracts are consumed without redefinition.

## Compatibility

When applicable.

## Recovery/retry

When applicable.

## Synthetic extensibility

When relevant to capability-driven architecture.

---

# 31. Mandatory ownership isolation tests

Always include tests equivalent to:

```text
The component cannot redefine an upstream canonical contract.

The component cannot require a downstream component to define its own
normative behavior.

A projection cannot become canonical state.

A transport mapping cannot change canonical failure semantics.

An implementation detail cannot become architecture merely because it exists
in the repository.
```

Adapt to component scope.

---

# 32. Acceptance criteria

Acceptance criteria must be binary whenever practical.

Each material requirement must map to:

```text
ACCEPTANCE_CRITERION
or
CONFORMANCE_TEST
```

Avoid:

```text
implementation is clean
architecture is flexible
behavior is robust
```

Prefer:

```text
Given X and Y, command Z is rejected and canonical state remains unchanged.
```

---

# 33. Traceability matrix

Produce:

| Requirement | Portfolio obligation | ADR | ADR section | Ownership role | Acceptance / test |
| ----------- | -------------------- | --- | ----------- | -------------- | ----------------- |

Every requirement must have a valid row.

Approval target:

```text
REQUIREMENTS_WITHOUT_PORTFOLIO_OBLIGATION = 0
OWNED_OBLIGATIONS_WITHOUT_REQUIREMENT = 0
```

Exceptions are permitted only for non-normative explanatory requirements and
must be justified.

---

# 34. Known gap summary

For a newly generated component SPEC, document known repository divergence
without attempting to generate the formal Gap Matrix.

Use:

| Gap subject | Classification | Related requirement | Evidence |
| ----------- | -------------- | ------------------- | -------- |

Do not assign future implementation units.

Do not create tickets.

Do not create a full repository gap closure plan.

The formal Gap Matrix remains downstream.

---

# 35. Prior Gap Matrix handling

If this is a revision/remediation cycle and an earlier Gap Matrix exists:

* inspect it;
* preserve validated evidence;
* identify affected prior rows;
* do not silently invalidate it;
* state that formal Gap Matrix reconciliation is required downstream.

Do not rewrite the Gap Matrix as part of this skill unless explicitly governed
by another workflow.

---

# 36. Dependencies

The approved portfolio dependency graph is canonical.

Create a local dependency table:

| Dependency SPEC | Contract consumed | Blocking? | Evidence |
| --------------- | ----------------- | --------- | -------- |

The component SPEC must not:

* reverse a dependency;
* add a new normative upstream dependency silently;
* remove a required portfolio dependency;
* create a cycle.

If a new normative dependency appears necessary:

```text
BLOCKED — PORTFOLIO DECOMPOSITION CHANGE REQUIRED
```

---

# 37. Risks

List risks within this component boundary.

Examples:

* dual authority;
* stale basis;
* silent fallback;
* projection drift;
* failure semantic translation;
* legacy becoming second canonical path;
* cross-component policy leakage;
* retry duplicating effects;
* downstream dependency inversion.

Every material risk needs a mitigation or conformance test.

---

# 38. Implementation details intentionally unfrozen

Explicitly list implementation freedoms.

Examples:

* class names;
* module layout;
* database technology when not ADR-frozen;
* internal DTOs;
* HTTP paths when not externally normative;
* frontend framework;
* internal caches;
* adapter library.

This protects the distinction:

```text
SPEC != IMPLEMENTATION PLAN
```

---

# 39. Open questions

Separate:

```text
IMPLEMENTATION_DETAIL_QUESTION
```

from:

```text
ARCHITECTURAL_QUESTION
```

Implementation-detail questions may remain.

A material architectural question may not.

If one appears:

```text
BLOCKED — ARCHITECTURAL DECISION REQUIRED
```

If the architecture exists but the portfolio did not allocate it:

```text
BLOCKED — PORTFOLIO OWNERSHIP GAP
```

---

# 40. Definition of Done for the component SPEC

The SPEC is ready for independent SPEC validation only when:

* governing portfolio is approved;
* all required ADRs are accepted;
* all upstream normative dependencies are conformant;
* every owned portfolio obligation is represented;
* no consumed obligation is redefined;
* all normative requirements have authority;
* identity and authority boundaries are explicit;
* failures are explicit where applicable;
* compatibility/cutover behavior is explicit where applicable;
* conformance tests are defined;
* acceptance criteria are testable;
* requirement traceability is complete;
* repository state was inspected;
* known gaps are classified;
* no architecture gap remains;
* no portfolio ownership gap remains;
* every applicable Aggregate Identity Proof is complete;
* every applicable Aggregate Reconstruction Proof is complete;
* lifecycle and persistence semantics are complete, including negative paths;
* cross-boundary contracts preserve domain authority;
* every critical requirement passed the Implementation Decision Simulation with
  no `NO` or `UNKNOWN` normative answer;
* `SPEC_IMPLEMENTABILITY_CHECK = PASS`;
* no Implementation Plan or tickets were produced.

---

# 41. Required SPEC structure

Unless repository governance defines a stronger template, produce:

```text
1. Status
2. Ownership
3. Portfolio Authority
4. ADR Authority
5. Problem Statement
6. Goals
7. Non-Goals
8. Current Repository State
9. Owned Architectural Obligations
10. Consumed Contracts
11. Target Behavioral Model
12. Identity and Authority Rules
12a. AGGREGATE_IDENTITY_PROOF
12b. AGGREGATE_RECONSTRUCTION_PROOF
12c. AUTHORITY_CONSUMPTION_PROOF
12d. PRODUCER_CONSUMER_CONTRACT_PROOF
13. Normative Requirements
14. Commands / Queries / Events
15. Failure Semantics
16. Retry / Idempotency / Recovery
17. Compatibility / Cutover
18. Projection Boundaries
19. External Effects
20. Security / Authorization
21. Conformance Suite
22. Acceptance Criteria
23. ADR / Obligation / Requirement Traceability
24. Known Gap Summary
25. Dependencies
26. Risks
27. Implementation Details Intentionally Unfrozen
28. Open Questions
29. Definition of Done
```

Omit genuinely inapplicable sections.

Do not omit a relevant boundary merely to shorten the SPEC.

---

# 42. Mandatory adversarial validation

Before finishing, ask all applicable questions below.

## Ownership

1. Did this SPEC define anything not allocated to it by the portfolio?
2. Did it redefine an upstream contract?
3. Did a consumer become a normative owner?
4. Did any owned portfolio obligation remain uncovered?

## Dependency

5. Did the SPEC introduce a new normative dependency?
6. Does it require downstream authority to define upstream behavior?
7. Does it contradict the approved portfolio DAG?

## Authority

8. Did backend/API/UI/OPS become canonical authority accidentally?
9. Did repository behavior override accepted ADR authority?
10. Did prototype behavior become production authority?

## Failure

11. Did local transport or UI mapping alter canonical failure meaning?
12. Is any failure semantics owner ambiguous?

## Compatibility

13. Could legacy and new behavior both remain canonical indefinitely?
14. Are cutover and retirement semantics owned where required?

## Specification quality

15. Can an implementer satisfy the wording while violating an accepted ADR?
16. Can a requirement be implemented in two materially incompatible semantic
    ways because failure/precondition behavior is missing?
17. Is any requirement actually an implementation plan disguised as a SPEC?
18. Is any normative requirement unsupported by portfolio obligation + ADR?
19. Does every major requirement have acceptance/conformance coverage?
20. Are implementation details appropriately unfrozen?

21. For every Aggregate Root, is canonical identity concrete across creation,
    commands, lookup, persistence, rehydration, equality, and revision?
22. For every persistible later state, does persisted evidence prove legitimate
    progression and reject skips, inconsistency, fabrication, stale, and
    incomplete history fail-closed?
23. Are lifecycle transitions, recovery, persistence semantics, and cross-SPEC
    ownership fully authoritative rather than merely enumerated or implied?
24. Could two semantically different implementations both be plausible under
    this SPEC? If yes, is that only legitimate technical freedom?

25. For each critical requirement, did the Implementation Decision Simulation
    identify the concrete operation, every authoritative input, validation
    owner, existing-state load, identity/reference proof, failure state, and
    required capability without an implementation-time normative choice?

26. Does every cross-SPEC capability have independent authority, contract,
    local-testability, and productive-availability dimensions, dependency class,
    and explicit evidence proving whether it is merely testable locally or
    productively available?

If any answer exposes a defect, revise before returning.

If revision would require architectural or portfolio authority changes, stop
with the appropriate blocker instead.

---

# 43. Mechanical validation

Report at minimum:

```text
PORTFOLIO_OBLIGATIONS_OWNED
PORTFOLIO_OBLIGATIONS_COVERED
OWNED_OBLIGATIONS_UNCOVERED
NORMATIVE_REQUIREMENTS
REQUIREMENTS_WITHOUT_AUTHORITY
CONSUMED_CONTRACTS
CONSUMED_CONTRACTS_REDEFINED
FAILURES_OWNED
FAILURES_CONSUMED
AMBIGUOUS_FAILURE_OWNERS
NORMATIVE_DEPENDENCIES
NEW_UNAPPROVED_DEPENDENCIES
KNOWN_SPECIFICATION_GAPS
KNOWN_IMPLEMENTATION_GAPS
ARCHITECTURE_GAPS
PORTFOLIO_OWNERSHIP_GAPS
ACCEPTANCE_CRITERIA
CONFORMANCE_TESTS
AGGREGATE_IDENTITY_PROOFS
IDENTITY_AUTHORITY_GAPS
AGGREGATE_RECONSTRUCTION_PROOFS
RECONSTRUCTION_AUTHORITY_GAPS
LIFECYCLE_AUTHORITY_GAPS
PERSISTENCE_SEMANTICS_GAPS
CROSS_SPEC_AUTHORITY_GAPS
AUTHORITY_CONSUMPTION_PROOFS
AUTHORITY_CONSUMPTION_GAPS
NORMATIVE_AUTHORITY_CONSUMPTION_GAPS
PRODUCER_CONSUMER_CONTRACT_PROOFS
BLOCKED_BY_UPSTREAM_CONTRACT
CAPABILITIES_BELOW_PRODUCTIVE_AVAILABILITY
SPEC_IMPLEMENTABILITY_CHECK
IMPLEMENTER_DECISION_CHECKS
IMPLEMENTER_DECISION_CHECK_FAILURES
CAPABILITY_AVAILABILITY_RECORDS
LOCAL_TESTABLE_CAPABILITIES
PRODUCTIVELY_AVAILABLE_CAPABILITIES
DOWNSTREAM_PROMOTION_WITHOUT_NEW_EVIDENCE
```

Required local invariants:

```text
OWNED_OBLIGATIONS_UNCOVERED = 0
REQUIREMENTS_WITHOUT_AUTHORITY = 0
CONSUMED_CONTRACTS_REDEFINED = 0
AMBIGUOUS_FAILURE_OWNERS = 0
NEW_UNAPPROVED_DEPENDENCIES = 0
ARCHITECTURE_GAPS = 0
PORTFOLIO_OWNERSHIP_GAPS = 0
IDENTITY_AUTHORITY_GAPS = 0
RECONSTRUCTION_AUTHORITY_GAPS = 0
LIFECYCLE_AUTHORITY_GAPS = 0
PERSISTENCE_SEMANTICS_GAPS = 0
CROSS_SPEC_AUTHORITY_GAPS = 0
NORMATIVE_AUTHORITY_CONSUMPTION_GAPS = 0
IMPLEMENTER_DECISION_CHECK_FAILURES = 0
DOWNSTREAM_PROMOTION_WITHOUT_NEW_EVIDENCE = 0
SPEC_IMPLEMENTABILITY_CHECK = PASS
```

---

# 44. Output artifact

Write the target component SPEC using the canonical portfolio path/name.

Do not create:

* Gap Matrix;
* Implementation Plan;
* tickets;
* implementation code;
* new ADR;
* portfolio remediation.

If blocked, avoid creating a falsely complete SPEC.

A partial discovery report may be produced only if repository conventions
require evidence.

---

# 45. Final response

Return:

```text
COMPONENT_SPEC_GENERATION_COMPLETE

COMPONENT: <SPEC-ID>
PORTFOLIO: <PORTFOLIO-ID>
PORTFOLIO_VERDICT: PORTFOLIO_DECOMPOSITION_APPROVED

OWNED_OBLIGATIONS:
- TOTAL: <n>
- COVERED: <n>
- UNCOVERED: <n>

REQUIREMENTS:
- TOTAL: <n>
- WITHOUT_AUTHORITY: <n>

DEPENDENCIES:
- NORMATIVE: <n>
- NEW_UNAPPROVED: <n>

FAILURES:
- OWNED: <n>
- CONSUMED: <n>
- AMBIGUOUS_OWNER: <n>

GAPS:
- SPECIFICATION: <n>
- IMPLEMENTATION: <n>
- ARCHITECTURE: <n>
- PORTFOLIO_OWNERSHIP: <n>

CONFORMANCE_TESTS: <n>
ACCEPTANCE_CRITERIA: <n>

SPEC:
<path>

GATE:
READY_FOR_SPEC_VALIDATION
```

If blocked, replace the first line and gate with the precise blocker.

Allowed blockers:

```text
BLOCKED — PORTFOLIO DECOMPOSITION NOT APPROVED
BLOCKED — PRIMARY ARCHITECTURAL AUTHORITY NOT ACCEPTED
BLOCKED — ADR CONTRADICTION
BLOCKED — ARCHITECTURAL DECISION REQUIRED
BLOCKED — PORTFOLIO OWNERSHIP GAP
BLOCKED — PORTFOLIO DECOMPOSITION CHANGE REQUIRED
BLOCKED — UPSTREAM SPEC NOT CONFORMANT
BLOCKED — CROSS-SPEC OWNERSHIP CONFLICT
```

Do not emit `READY_FOR_SPEC_VALIDATION` when any blocker remains.

---

# Completion invariant

Generation is complete only when this statement can be proven:

> Every normative behavior defined by this component SPEC is either an
> architectural obligation explicitly owned by the component in the approved
> portfolio or a non-authoritative local consumption/mapping of a contract
> owned elsewhere; every owned portfolio obligation is represented by testable
> requirements; all requirements trace to accepted ADR authority; dependency
> direction matches the approved portfolio; no downstream or projection layer
> became canonical authority; compatibility and failure semantics preserve
> their assigned owners; repository evidence informed current-state
> classification without redefining architecture; and no implementation plan,
> ticket decomposition, or new architectural decision was introduced.

When that invariant holds, return:

```text
READY_FOR_SPEC_VALIDATION
```

The next step must be an independent SPEC audit.
