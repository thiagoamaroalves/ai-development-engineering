---
name: review-implemented-ticket-structure
description: >
  Review the actual code of a completed ticket against its approved Implementation Design and upstream authority, then minimally correct local DDD, SOLID, Clean Code, boundary, dependency, rehydration, concurrency, and testability defects. Use when implementation is complete and structural ownership must be verified. Do not redesign upstream artifacts or perform broad aesthetic refactoring.
---

# Review Implemented Ticket Structure

## Purpose

Critically review the completed implementation of one ticket from the perspective of Domain-Driven Design, SOLID, Clean Code, dependency direction, aggregate boundaries, rehydration, concurrency, cross-spec boundaries, and testability.

The review subject is the actual code produced. The plan, ticket, and Implementation Design are authorities against which the code is checked; they are not substitutes for inspecting the code.

The workflow has two explicit phases:

1. reconstruct and report the structural state before edits;
2. apply only safe local corrections, then revalidate the complete structural gate.

Do not optimize for the number of classes, files, interfaces, layers, or patterns. Optimize for correct ownership, cohesion, explicit invariants, valid dependency direction, clear code, testability, and the minimum necessary complexity.

## Authority and operating mode

Use this precedence:

```text
Accepted ADRs
>
Approved Portfolio
>
Conformant Component SPEC
>
Validated Gap Matrix
>
Conformant Implementation Plan
>
Conformant Ticket
>
Approved Implementation Design
>
Current Implementation
>
Tests
```

The implementation must conform to the approved design and upstream authority. Never alter an upstream artifact merely to justify the current implementation. Never make a local change that silently changes public contracts, ticket scope, ownership, lifecycle semantics, persistence authority, or accepted architecture.

Operate as:

```text
ACTUAL_CODE_FIRST
DESIGN_AWARE
UPSTREAM_AUTHORITY_AWARE
DDD_AWARE
SOLID_AWARE
CLEAN_CODE_AWARE
DEPENDENCY_DIRECTION_AWARE
INVARIANT_AWARE
REHYDRATION_AWARE
CONCURRENCY_AWARE
CROSS_SPEC_AWARE
TESTABILITY_AWARE
MINIMUM_CORRECTION
NO_BROAD_REFACTORING
NO_UPSTREAM_CHANGES
```

## Preconditions and blocking

Require, where the repository supports them:

- an implemented/completed ticket;
- the approved Implementation Design;
- the relevant ticket, plan, validated Gap Matrix, SPEC, portfolio, ADRs, and cross-spec contracts;
- the actual implementation and tests;
- a usable baseline or implementation diff.

If the Implementation Design is missing, materially conflicts with upstream authority, or cannot be connected to the implementation, do not invent a design. Report:

```text
STRUCTURAL_REVIEW_BLOCKED
reason = IMPLEMENTATION_DESIGN_REVALIDATION_REQUIRED
```

Use `ARCHITECTURAL_AUTHORITY_REQUIRED` when the proposed correction would establish new architecture, ownership, lifecycle, persistence authority, or cross-spec dependency. Use `SPECIFICATION_GAP` when the required behavior is not defined by the available authority.

A missing test is a finding, not automatically a blocker. A missing authority decision that prevents a safe correction is a blocker.

## Phase 1 — Pin the review subject

Before changing files, record:

```text
TICKET_ID
TICKET_PATH
IMPLEMENTATION_DESIGN_PATH
IMPLEMENTATION_PLAN_PATH
GAP_MATRIX_PATH
SPEC_PATH
ADR_PATHS
REVIEW_BASELINE
IMPLEMENTATION_HEAD
IMPLEMENTATION_DIFF
```

Inspect the real repository diff and relevant surrounding code with repository-native tools. Do not rely on a ticket file's claimed file list. Separate ticket changes from unrelated pre-existing changes and preserve unrelated user work.

## Phase 2 — Reconstruct the implemented design

Before modifications, identify from the current code:

```text
DOMAIN_CONCEPTS
AGGREGATE_ROOTS
ENTITIES
VALUE_OBJECTS
DOMAIN_SERVICES
DOMAIN_POLICIES
APPLICATION_SERVICES
REPOSITORIES
PORTS
ADAPTERS
ANTI_CORRUPTION_BOUNDARIES
PERSISTENCE_BOUNDARIES
INTEGRATION_BOUNDARIES
```

Compare each planned component and responsibility with its actual semantic home. Do not require literal file or class-name equality. Evaluate responsibility, ownership, invariant protection, dependency direction, and testability.

Classify every designed component as exactly one of:

```text
PRESERVED
LOCALLY_ADAPTED
COLLAPSED
UNJUSTIFIED_SPLIT
MISSING
UNPLANNED_COMPONENT
```

`LOCALLY_ADAPTED` is acceptable only when responsibility, ownership, invariants, dependency direction, and testability are preserved. A private implementation merge is not automatically a component collapse. Report `UNJUSTIFIED_COMPONENT_COLLAPSE` only when distinct designed responsibilities now share unrelated reasons to change or one boundary has lost its semantic owner.

## Phase 3 — Mandatory pre-change report

Emit this report before modifying any code. Keep assessments evidence-backed and concise; include paths and symbols where useful.

```text
STRUCTURAL_REVIEW

DOMAIN_MODEL:
<assessment>

AGGREGATES:
<assessment>

INVARIANT_PLACEMENT:
<assessment>

APPLICATION_SERVICES:
<assessment>

REPOSITORIES:
<assessment>

DEPENDENCY_DIRECTION:
<assessment>

SOLID:
<assessment>

CLEAN_CODE:
<assessment>

CONCURRENCY:
<assessment>

REHYDRATION:
<assessment>

CROSS_SPEC_BOUNDARIES:
<assessment>

FINDINGS:
<list>
```

Do not conceal a finding because it may later be corrected. Do not claim PASS before revalidation.

## Phase 4 — DDD and aggregate audit

### Domain model

Verify that the implementation still expresses domain behavior. Check that:

- invariants live in the correct domain owner;
- Aggregate Roots control their own mutations;
- Entities with behavior are not reduced to property bags;
- Value Objects encapsulate meaningful validation, equality, canonicalization, unit, identity, revision, or lifecycle semantics;
- Domain Services exist only when behavior does not naturally belong to an Entity, Aggregate, or Value Object;
- Application Services coordinate use cases instead of owning domain rules;
- repositories do not decide business rules;
- adapters do not become domain authority.

Detect:

```text
ANEMIC_DOMAIN_MODEL
DOMAIN_INVARIANT_OUTSIDE_OWNER
AGGREGATE_BOUNDARY_VIOLATION
DOMAIN_MUTATION_BYPASS
DUPLICATED_DOMAIN_RULE
FOREIGN_DOMAIN_AUTHORITY_DUPLICATION
```

Do not report an anemic model for a deliberately simple, rule-free data structure. Do not require ceremonial DDD constructs absent from the approved design.

### Aggregate boundaries

For every relevant Aggregate, determine:

```text
AGGREGATE_ROOT
STATE_OWNED
INVARIANTS_PROTECTED
MUTATION_ENTRY_POINTS
CONSISTENCY_BOUNDARY
TRANSACTION_BOUNDARY
```

Verify that callers cannot change owned state through alternate setters, exposed collections, mutable persistence records, public fields, bypass constructors, or direct adapter access. Target:

```text
AGGREGATE_BOUNDARY_VIOLATIONS = 0
DOMAIN_INVARIANT_BYPASSES = 0
```

### Invariant placement

For every important invariant, produce:

| Invariant | Expected Owner | Actual Owner | Durable Enforcement | Test | Result |
| --- | --- | --- | --- | --- | --- |
| <invariant> | <owner> | <owner> | <mechanism or N/A> | <test> | <result> |

Use only these results:

```text
PRESERVED
LOCALLY_ADAPTED
MOVED_WITHOUT_JUSTIFICATION
BYPASSED
MISSING
```

Target:

```text
UNENFORCED_INVARIANTS = 0
INVARIANT_PLACEMENT_DEVIATIONS = 0
```

Durable enforcement may be implemented by infrastructure, but semantic authority must remain with the domain/application owner defined by the design.

## Phase 5 — Application services and repositories

An Application Service should normally:

```text
load state
coordinate use case
invoke domain behavior
coordinate external dependencies
persist result
publish/integrate
```

It should not normally own domain invariants, lifecycle decisions, business-state machines, duplicated Aggregate behavior, persistence semantics, or the whole domain model. Detect `FAT_APPLICATION_SERVICE` when those responsibilities materially accumulate.

Repositories should normally load, persist, query, and perform durable atomic enforcement where required. They must not become the semantic owner of domain lifecycle, business validation, canonical decisions, or domain state transitions unless explicitly authorized.

For optimistic concurrency, distinguish:

```text
Domain/Application:
defines expected concurrency semantics

Repository/Infrastructure:
performs durable atomic enforcement
```

Do not let infrastructure become the authority for a domain decision.

## Phase 6 — SOLID and dependency direction

Evaluate the five SOLID principles materially, not ceremonially.

### SRP

Ask whether each component has one coherent reason to change. Detect:

```text
SRP_VIOLATION
GOD_COMPONENT
RESPONSIBILITY_MIXING
```

Do not split cohesive Aggregate behavior merely because a component is large.

### OCP

Evaluate only real variation points. Detect `PREMATURE_EXTENSIBILITY` when the implementation introduces Strategy, Factory, Provider, plugin, or extension machinery without current variation or a boundary required by authority.

### LSP

Where inheritance or polymorphism exists, verify behavioral substitutability. Detect `LSP_VIOLATION` when a subtype changes semantic meaning, rejects valid base behavior, or requires callers to know concrete types.

### ISP

Detect `FAT_INTERFACE` when consumers depend on unrelated capabilities. Do not create tiny interfaces without a real consumer or boundary.

### DIP and dependency direction

Compare actual references with the approved design. Detect:

```text
DEPENDENCY_INVERSION_VIOLATION
DOMAIN_TO_INFRASTRUCTURE
APPLICATION_TO_CONCRETE_INFRASTRUCTURE
FOREIGN_MODEL_LEAKAGE
FORBIDDEN_DEPENDENCY
```

Examples that are suspicious when not authorized include Domain → ORM, filesystem, HTTP, serializer, GitHub SDK, or concrete database adapter. Do not create an artificial abstraction solely to make a metric zero.

Targets:

```text
DEPENDENCY_DIRECTION_VIOLATIONS = 0
INFRASTRUCTURE_LEAKAGE_POINTS = 0
```

## Phase 7 — Clean Code, primitives, and abstractions

Inspect changed code for:

```text
CLEAR_DOMAIN_NAMING
SMALL_COHESIVE_METHODS
EXPLICIT_SIDE_EFFECTS
EXPLICIT_MUTATION_BOUNDARIES
NO_BOOLEAN_PARAMETER_EXPLOSION
NO_LONG_PARAMETER_LISTS
NO_GENERIC_SERVICE_BUCKETS
NO_GENERIC_UTIL_BUCKETS
NO_DUPLICATED_DOMAIN_RULES
NO_HIDDEN_TEMPORAL_COUPLING
NO_UNNECESSARY_MUTABILITY
NO_COMMENT_DEPENDENT_CORRECTNESS
```

Do not impose arbitrary line limits. Evaluate semantic cohesion, clarity, mutation visibility, and reasons to change.

For important concepts reduced to `string`, `number`, GUID, dictionary, tuple, or unstructured record, ask whether there is meaningful validation, equality, canonicalization, unit, identity, lifecycle, revision, or version semantics. Detect `PRIMITIVE_OBSESSION` only when a Value Object or equivalent boundary is justified by current domain meaning. Do not create ceremonial wrappers.

For every materially altered abstraction answer:

```text
What boundary does this abstraction protect?
Who consumes it?
Why does it need to exist now?
```

If there is no concrete answer, detect `PREMATURE_ABSTRACTION`. Detect `OVERENGINEERING` for unnecessary interfaces, layers, factories, policy hierarchies, local event buses, wrapper chains, or framework-like indirection. Prefer the simplest design that preserves the approved responsibilities.

## Phase 8 — Rehydration, concurrency, and external boundaries

### Rehydration

For persisted Aggregates and Entities, verify that the rehydration boundary:

- preserves invariants;
- accepts valid persisted state;
- prevents arbitrary setters or mutation;
- distinguishes creation from rehydration;
- cannot construct impossible state.

Detect:

```text
UNSAFE_REHYDRATION
REHYDRATION_INVARIANT_BYPASS
```

### Concurrency, stale state, and idempotency

When applicable, verify:

```text
expected version/revision/progress
atomic compare-and-set
stale rejection
no mutation on stale
no last-write-wins
idempotent replay
retry semantics
```

Distinguish the semantic concurrency contract from its durable enforcement. Detect:

```text
CONCURRENCY_BYPASS
LAST_WRITE_WINS_PATH
AMBIGUOUS_CONCURRENCY_TOKEN
```

Do not treat a CAS operation, a sequential duplicate test, or a registry lookup as proof of the complete semantic contract.

### Cross-spec and external boundaries

Verify that foreign authority is consumed through the approved mapping or Anti-Corruption Layer. Detect:

```text
FOREIGN_LIFECYCLE_DUPLICATION
FOREIGN_IDENTITY_DUPLICATION
FOREIGN_FAILURE_SEMANTIC_REDEFINITION
FOREIGN_MODEL_LEAKAGE
```

Preserve the local model, local ownership, foreign model mapping, identity semantics, and failure semantics defined by the design.

## Phase 9 — Testability

Verify that every relevant invariant and structural boundary has an appropriate test surface. Each layer should prove the responsibility it owns; do not duplicate the same assertion across every layer.

Identify:

```text
DOMAIN_INVARIANT_TEST_GAP
PERSISTENCE_TEST_GAP
CONCURRENCY_TEST_GAP
NEGATIVE_BEHAVIOR_TEST_GAP
ARCHITECTURE_GUARD_GAP
```

When applicable, require focused evidence for:

```text
aggregate invariants
state transitions
negative/rejection behavior
persistence boundary
stale/concurrency rejection
idempotent replay
rehydration
ACL/mapping behavior
dependency direction
```

Do not use broad integration tests as a substitute for a missing domain invariant test when the invariant should be independently testable. Do not require architecture guards when the repository has no relevant forbidden dependency or structural boundary, but do require them when the approved design or existing convention depends on one.

## Phase 10 — Findings

Classify findings as:

```text
STRUCT-CRITICAL-###
STRUCT-MAJOR-###
STRUCT-MINOR-###
STRUCT-INFO-###
```

Every finding must contain:

```text
ID
Severity
Category
Component
Expected Design
Actual Implementation
Problem
Why It Matters
Minimum Correction
```

Severity guidance:

- `CRITICAL`: wrong domain authority, critical invariant bypass, duplicate lifecycle authority, corrupted consistency boundary, foreign authority reimplementation, material dependency/ownership violation, or exposed upstream identity, rehydration, lifecycle, persistence, or cross-spec authority gap.
- `MAJOR`: anemic-domain regression, god component, fat application service, missing designed component, unjustified collapse, dependency-direction violation, invariant-placement drift, domain-rule duplication, material testability regression, or undeclared material design deviation.
- `MINOR`: localized structural defect that does not materially invalidate authority or ownership, such as localized premature abstraction, minor ISP issue, localized primitive obsession, or materially obscuring naming.
- `INFO`: non-blocking observation.

Do not create findings for formatting preferences or for complexity required by domain semantics.

## Phase 11 — Correction decision

Correct automatically only when the correction is local, evidence-backed, and preserves:

```text
behavior
ticket scope
public contracts
ownership
upstream architecture
```

Permitted examples include:

```text
move a domain rule to its correct owner
extract a cohesive domain policy
reduce a fat application service
centralize a duplicated invariant
restore an Aggregate mutation boundary
correct dependency direction
add a safe rehydration factory
replace a primitive with a justified Value Object
remove premature abstraction
simplify unnecessary indirection
improve domain naming
add or adjust focused tests that prove the correction
```

Do not automatically correct a finding when doing so requires:

```text
new architecture
new domain semantics
new lifecycle
new ownership
new public contract
new persistence authority
new cross-spec dependency
ticket scope expansion
```

In those cases, do not patch around the problem. Report:

```text
STRUCTURAL_REVIEW_BLOCKED
reason = IMPLEMENTATION_DESIGN_REVALIDATION_REQUIRED
```

or the more specific `ARCHITECTURAL_AUTHORITY_REQUIRED` or `SPECIFICATION_GAP` reason.

Apply the smallest change sufficient to close a finding. Do not reorganize the project, perform opportunistic refactoring, replace healthy components, or rewrite valid tests.

## Phase 12 — Revalidation

After permitted corrections:

1. reinspect every altered component and its callers;
2. rerun the invariant placement table;
3. rerun the component classification;
4. inspect affected tests and execute relevant focused tests;
5. execute affected regression tests;
6. execute architecture/conformance tests when they exist;
7. inspect the final diff for scope drift;
8. recalculate every structural finding and metric.

A correction is not complete until the code, tests, dependency graph, and authority chain still agree. If a test or architecture guard is required to prove the correction and cannot be added within scope, keep the finding or block rather than claiming PASS.

## Structural gate

Return `STRUCTURAL_REVIEW_RESULT: PASS` only when all of the following are true:

```text
CRITICAL_FINDINGS = 0
MAJOR_FINDINGS = 0

AGGREGATE_BOUNDARY_VIOLATIONS = 0
DOMAIN_INVARIANT_BYPASSES = 0
UNENFORCED_INVARIANTS = 0
INVARIANT_PLACEMENT_DEVIATIONS = 0

ANEMIC_DOMAIN_MODELS = 0
FAT_APPLICATION_SERVICES = 0
GOD_COMPONENTS = 0

UNJUSTIFIED_SOLID_VIOLATIONS = 0

DEPENDENCY_DIRECTION_VIOLATIONS = 0
INFRASTRUCTURE_LEAKAGE_POINTS = 0

DOMAIN_RULE_DUPLICATIONS = 0
UNSAFE_REHYDRATION_PATHS = 0
CONCURRENCY_BYPASSES = 0
LAST_WRITE_WINS_PATHS = 0

UNJUSTIFIED_COMPONENT_COLLAPSES = 0
PREMATURE_ABSTRACTIONS = 0

REQUIRED_STRUCTURAL_TESTS_PASS = YES
```

Minor findings may remain only when they are clearly non-material, explicitly listed, and do not compromise ownership, invariants, boundaries, dependency direction, or testability. Never call a blocked review PASS.

## Required final report

```text
STRUCTURAL_REVIEW_COMPLETE

FILES_CHANGED:
<paths>

FINDINGS:
- CRITICAL: <n>
- MAJOR: <n>
- MINOR: <n>
- INFO: <n>

DDD:
- Anemic domain models: <n>
- Aggregate boundary violations: <n>
- Domain invariant bypasses: <n>
- Unenforced invariants: <n>

SOLID:
- SRP violations: <n>
- OCP violations: <n>
- LSP violations: <n>
- ISP violations: <n>
- DIP violations: <n>
- Unjustified SOLID violations: <n>

DEPENDENCIES:
- Dependency direction violations: <n>
- Infrastructure leakage points: <n>

CLEAN_CODE:
- God components: <n>
- Fat application services: <n>
- Fat interfaces: <n>
- Domain rule duplications: <n>
- Primitive obsession findings: <n>
- Premature abstractions: <n>
- Overengineering findings: <n>

DOMAIN_SAFETY:
- Unsafe rehydration paths: <n>
- Concurrency bypasses: <n>
- Last-write-wins paths: <n>
- Ambiguous concurrency tokens: <n>

DESIGN:
- Unjustified component collapses: <n>
- Unplanned structural components: <n>

TESTS:
<commands and results>

STRUCTURAL_REVIEW_RESULT:
PASS
|
REQUIRES_FURTHER_REFINEMENT
|
BLOCKED_BY_IMPLEMENTATION_DESIGN
|
BLOCKED_BY_ARCHITECTURE
```

If the review is blocked, use the same report where possible, state the exact blocking reason, and do not imply that unreviewed code is conformant.

## Critical rule

The goal is not to make the code look like DDD. The goal is to make the domain model and code responsibilities structurally correct while preserving behavior, normative contracts, ownership, ticket scope, and accepted architecture.
