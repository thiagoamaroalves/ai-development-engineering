---
name: design-ticket-implementation
description: >
  Produce a bounded, implementation-ready code design for one conformant implementation ticket before production coding begins. Translate frozen ticket behavior into a concrete code-level decomposition guided by Domain-Driven Design, SOLID, Clean Code, explicit dependency direction, cohesive responsibility boundaries, invariant placement, aggregate consistency, persistence boundaries, cross-spec integration, failure and recovery semantics, and testability while preserving accepted architecture and repository conventions. Use to prevent implementation-time architectural improvisation, anemic domain models, fat application services, god classes or modules, infrastructure leakage, primitive obsession, duplicated domain rules, premature abstractions, and repeated structural redesign during implementation audit. This skill does not implement code, change ticket scope, modify upstream artifacts, introduce new architecture, or create new tickets.
---

# Design Ticket Implementation

## Purpose

Determine how one conformant implementation ticket should be expressed in code before production implementation begins.

Workflow:

~~~text
Conformant Implementation Ticket
        ↓
design-ticket-implementation
        ↓
Bounded Implementation Design
        ↓
IMPLEMENTATION_DESIGN_READY
        ↓
Implementation
        ↓
Independent Implementation Audit
~~~

Answer only:

~~~text
How should this ticket be implemented inside the accepted architecture?
~~~

Upstream authority already defines what must be true, who owns it, what the ticket implements, and what the ticket must not implement. This skill determines how responsibilities should be expressed in code without changing upstream semantics.

Read `../_shared/authority-completeness-gates.md` and
`../_shared/authority-provenance-anti-forgery-contract.md`. The design may
consume and structure upstream authority, but it must not repair an incomplete
identity, lifecycle, reconstruction, persistence, recovery, ownership, or
cross-SPEC contract.

## Operating mode

~~~text
TICKET_SCOPED
ADR_FIRST
PORTFOLIO_GOVERNED
SPEC_PRESERVING
TICKET_PRESERVING
REPOSITORY_AWARE
DDD_FIRST
SOLID_BY_DEFAULT
DOMAIN_BEHAVIOR_FIRST
COHESION_FIRST
DEPENDENCY_DIRECTION_AWARE
TESTABILITY_FIRST
CLEAN_CODE_REQUIRED
OWNERSHIP_PRESERVING
MINIMAL_DESIGN
NO_PREMATURE_ABSTRACTION
NO_SCOPE_EXPANSION
NO_ARCHITECTURE_REDESIGN
NO_PRODUCTION_IMPLEMENTATION
NO_TEST_IMPLEMENTATION
NO_NEW_TICKETS
~~~

## Design philosophy

Use four design-quality pillars:

~~~text
DDD
+
SOLID
+
Clean Code
+
Repository Architecture Conformance
~~~

Apply them in this order:

~~~text
Frozen domain semantics
        ↓
DDD responsibility placement
        ↓
SOLID component boundaries
        ↓
Clean Code constraints
        ↓
Repository-compatible implementation structure
~~~

DDD and SOLID are design-quality constraints, not authority to introduce a new architectural style. Do not transform the repository into Clean Architecture, Hexagonal Architecture, CQRS, Event Sourcing, layered architecture, or another pattern merely because it appears theoretically cleaner. Follow accepted architecture and repository conventions unless they conflict with higher normative authority.

Apply these principles:

~~~text
DOMAIN_BEHAVIOR_FIRST
RICH_DOMAIN_MODEL_WHEN_DOMAIN_RULES_EXIST
APPLICATION_ORCHESTRATES_DOMAIN
INFRASTRUCTURE_DEPENDS_INWARD
DEPENDENCY_INVERSION_WHERE_ARCHITECTURAL_BOUNDARY_EXISTS
NO_ANEMIC_DOMAIN_BY_DEFAULT
NO_GOD_SERVICE
NO_GENERIC_SERVICE_BUCKET
NO_GENERIC_UTIL_BUCKET
NO_DUPLICATED_DOMAIN_RULES
NO_HIDDEN_LIFECYCLE_MUTATION
NO_PREMATURE_EXTENSIBILITY
NO_CEREMONIAL_ABSTRACTIONS
~~~

Do not enforce patterns mechanically. Every abstraction must have a real responsibility, consumer, or architectural boundary.

## 1. Preconditions

Run only for a conformant implementation ticket eligible for design. Normally the ticket has:

~~~text
STATUS = READY
~~~

or another explicitly documented pre-implementation state that permits design.

Before designing:

- follow repository-local AGENTS.md, CLAUDE.md, or equivalent instructions;
- inspect the ticket;
- inspect only the upstream authority relevant to this ticket;
- inspect directly relevant repository implementation and tests;
- confirm the ticket's local closure and acceptance contract;
- load the latest independent component ticket-set audit and its remediation
  handoff, when present;
- verify the ticket-set audit is current for the live repository state and
  explicitly reports `IMPLEMENTATION_TICKETS_CONFORMANT` with
  `IMPLEMENTATION_GATE = READY_FOR_IMPLEMENTATION`;
- verify no ticket-set remediation is pending and no
  `READY_FOR_INDEPENDENT_TICKET_REAUDIT` handoff remains;
- verify the selected primary ticket is `STATUS = READY`,
  `EXECUTION_READY = TRUE`, and `BLOCKED_BY = NONE`.

A merely `ISSUE_READY` ticket, a README/index projection, an auxiliary or
untracked design that predates the current design operation, or a satisfied
predecessor edge does not authorize entering this design operation by itself.
If the ticket-set audit is stale, remediation-required, contradictory, or
awaiting re-audit, return `IMPLEMENTATION_DESIGN_BLOCKED` and require the
independent ticket-set audit/reconciliation first. If any upstream artifact is
stale or non-conformant, do not redesign it here.

This skill owns approval of the design artifact it creates. A successful
artifact with `IMPLEMENTATION_DESIGN_READY` and
`IMPLEMENTATION_DESIGN_GATE: READY_FOR_IMPLEMENTATION` is current process
proof for `implement-ready-tickets` when its ticket identity and ticket-set
audit target/basis match. It does not require a separate design audit or a
prior Git commit; the implementation checkpoint later commits it through the
exact allowlist.

## 2. Stop conditions

Return IMPLEMENTATION_DESIGN_BLOCKED when any of the following applies:

~~~text
TICKET_DEFINITION_INCONSISTENT
SPECIFICATION_GAP
ARCHITECTURAL_AUTHORITY_REQUIRED
TICKET_SCOPE_NOT_COHERENT
CROSS_SPEC_CONTRACT_MISSING
TICKET_LOCAL_CLOSURE_NOT_PRESERVABLE
IMPLEMENTATION_DESIGN_BLOCKED_BY_UPSTREAM_AUTHORITY
~~~

Use:

~~~text
IMPLEMENTATION_DESIGN_BLOCKED
reason = <reason>
~~~

Do not repair ADRs, the portfolio, SPECs, the Gap Matrix, the Implementation Plan, or the ticket.

## 3. Required inputs

Identify:

- the ticket file;
- the approved portfolio authority relevant to the ticket;
- the conformant component SPEC;
- the validated Gap Matrix;
- the conformant Implementation Plan;
- the current conformant ticket-set audit and its target/basis fingerprint;
- any ticket-set remediation artifact and its re-audit handoff;
- relevant accepted ADRs;
- the repository root and current repository baseline;
- directly relevant production code and tests;
- explicit cross-spec contracts;
- current SPEC `AGGREGATE_IDENTITY_PROOF` and applicable
  `AGGREGATE_RECONSTRUCTION_PROOF`;
- current `SPEC_IMPLEMENTABILITY_CHECK = PASS` and its revision;
- repository architectural conventions.

Reconcile every cross-SPEC capability with the shared independent dimensions
and dependency class. `LOCAL_TESTABILITY = YES` is not productive availability.
If the ticket's local Acceptance Criteria or Completion Evidence requires a
capability with `PRODUCTIVE_AVAILABILITY = NO` and class
`REQUIRED_FOR_LOCAL_EXECUTION` or `REQUIRED_FOR_LOCAL_CLOSURE`, return
`IMPLEMENTATION_DESIGN_BLOCKED` with
`reason = TICKET_LOCAL_CLOSURE_NOT_PRESERVABLE` or
`CROSS_SPEC_CONTRACT_MISSING`; do not design around the gap.

## 4. Authority precedence

Use:

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
Current Repository
~~~

Repository structure influences implementation design. It does not redefine normative behavior.

## 4a. UPSTREAM_AUTHORITY_PRECONDITIONS

Before proposing components, explicitly record and cite the upstream proof for:

```text
identity
lifecycle
persistence/recovery
rehydration
concurrency
idempotency
ownership
cross-SPEC dependencies
```

For each external authority, also cite its `AUTHORITY_CONSUMPTION_PROOF` and
`PRODUCER_CONSUMER_CONTRACT_PROOF`, including the concrete port/interface,
producer, consumer, returned data, version/revision, failure semantics, and
authority status, contract status, semantic status, local testability, productive
availability, dependency class, availability evidence, and blocking effect. For
mutable authority, cite
`TEMPORAL_AUTHORITY_PROOF` and show the independent second observation,
drift detection, fail-closed behavior, semantic validation owner, and physical
CAS/integrity role. For every authority-bearing result, receipt, adapter, or
proof, also record `PROOF_ISSUER_OWNER`, `PROOF_SCOPE`,
`PROOF_IDENTITY_OR_BRAND`, `CONSUMER_VERIFICATION_RULE`,
`STALE_OR_MUTATION_POLICY`, and direct forged/caller-injection negative tests
from the shared provenance contract. The design must not invent these
contracts.

For each Aggregate Root include the identity proof fields; for each
persistible later state include the reconstruction proof fields. Mark each as
`COMPLETE`, `NOT_APPLICABLE`, or `BLOCKED` with authority and revision. If any
applicable item is `BLOCKED` or absent, return:

```text
IMPLEMENTATION_DESIGN_BLOCKED_BY_UPSTREAM_AUTHORITY
```

Do not resolve it through a code-level choice or add it to the ticket's
responsibility.

Authority-gap categories include `IDENTITY_AUTHORITY_GAP`,
`REHYDRATION_AUTHORITY_GAP`, `LIFECYCLE_AUTHORITY_GAP`,
`PERSISTENCE_SEMANTICS_GAP`, and `CROSS_SPEC_AUTHORITY_GAP`.

Distinguish in the design:

```text
LEGITIMATE_DESIGN_DECISION
    file/module placement, naming, local decomposition, adapter mechanics,
    and other technical choices already authorized upstream

PROHIBITED_NORMATIVE_DECISION
    canonical identity, lifecycle meaning, progression provenance,
    reconstruction validity, ownership, recovery semantics, persistence
    meaning, or a missing domain invariant
```

The second category must be empty. If not, use
`IMPLEMENTATION_DESIGN_BLOCKED_BY_UPSTREAM_AUTHORITY`.

## 5. Reconstruct ticket responsibility

Extract:

~~~text
TICKET_ID
GOAL
PORTFOLIO_OBLIGATIONS
REQUIREMENTS
GAPS
ACCEPTANCE
REQUIRED_BEHAVIOR
DOES_NOT_IMPLEMENT
OWNERSHIP
DEPENDENCIES
CROSS_SPEC_DEPENDENCIES
REQUIRED_TESTS
COMPLETION_EVIDENCE
FINAL_PROOF_ROLE
~~~

Produce one concise sentence named IMPLEMENTATION_RESPONSIBILITY. If it requires several unrelated “and also” clauses, reassess ticket coherence and stop if the scope cannot be designed as one bounded responsibility.

## 6. Repository architecture assessment

Determine the repository's actual boundaries:

~~~text
DOMAIN_BOUNDARY
APPLICATION_BOUNDARY
INFRASTRUCTURE_BOUNDARY
INTEGRATION_BOUNDARY
PERSISTENCE_BOUNDARY
PUBLIC_API_BOUNDARY
TEST_BOUNDARY
~~~

Use repository-specific names when these boundaries are implicit. Do not invent missing layers to satisfy textbook architecture.

Inspect relevant domain types, entities, value objects, aggregates, services, policies, handlers, commands, queries, use cases, repositories, stores, registries, state machines, adapters, serializers, validators, persistence, concurrency, recovery, reconciliation, and tests.

Classify relevant existing components:

~~~text
REUSE
EXTEND
INTEGRATE
REFACTOR_WITHIN_TICKET
REPLACE_BY_TICKET
DO_NOT_TOUCH
~~~

Prefer reuse when existing design is semantically correct and structurally healthy. Improve bad structure only when the ticket already requires touching it and the improvement remains ticket-scoped.

## 7. Domain model assessment

Reconstruct only concepts relevant to the ticket:

~~~text
DOMAIN_CONCEPTS
AGGREGATE_ROOTS
ENTITIES
VALUE_OBJECTS
DOMAIN_INVARIANTS
DOMAIN_SERVICES
DOMAIN_POLICIES
DOMAIN_EVENTS
REPOSITORY_ABSTRACTIONS
APPLICATION_USE_CASES
ANTI_CORRUPTION_BOUNDARIES
~~~

For every significant concept ask whether it has identity, lifecycle, invariant, validation, canonical comparison, or domain behavior. Explicitly model meaningful concepts rather than hiding them in strings, dictionaries, generic DTOs, controllers, generic services, or utilities.

### Value objects

Prefer a value object when a primitive carries domain identity, validation, canonicalization, comparison, units, range restrictions, or format invariants. Examples such as SchedulerId, ExecutionId, Revision, Capacity, ArtifactCycleId, or AgentAssignmentId are valid only when the ticket domain actually contains those concepts.

Do not wrap primitives ceremonially. Report PRIMITIVE_OBSESSION_RISK when meaningful domain semantics remain represented as raw primitives.

### Aggregates and consistency boundaries

For every mutable consistency boundary identify:

~~~text
AGGREGATE
AGGREGATE_ROOT
INVARIANTS_PROTECTED
CONSISTENCY_BOUNDARY
TRANSACTION_BOUNDARY
EXTERNAL_REFERENCES
~~~

Use the smallest boundary that protects required invariants. The Aggregate Root is the mutation authority for the invariants it protects. Controllers, handlers, repositories, adapters, and serializers must not independently perform equivalent domain transitions.

### Rich domain behavior

Rules representing domain invariants, valid state transitions, canonical decisions, or domain-specific acceptance/rejection normally belong to an Entity, Aggregate Root, Value Object, Domain Service, or Domain Policy. They do not normally belong in a controller, repository, infrastructure adapter, generic application service, or utility.

Assess:

~~~text
ANEMIC_DOMAIN_MODEL_RISK:
LOW | MEDIUM | HIGH
~~~

A HIGH risk involving real domain behavior requires mitigation before readiness. Do not force rich entities for CRUD-only data with no meaningful domain rules.

### Domain and application services

Use a Domain Service only for genuine domain behavior that does not naturally belong to one Entity, Value Object, or Aggregate and that coordinates domain concepts without becoming application orchestration.

Application Services normally load state, coordinate a use case, invoke domain behavior, call external dependencies, persist results, and publish or integrate outcomes. They should not own domain invariants, lifecycle rules, aggregate decisions, or large business conditional trees.

Assess:

~~~text
FAT_APPLICATION_SERVICE_RISK:
LOW | MEDIUM | HIGH
~~~

### Domain events

Use a Domain Event only when a meaningful domain fact must be communicated and the repository architecture already supports that boundary. If applicable, record:

~~~text
EVENT
PRODUCER
SEMANTIC_MEANING
CONSUMERS
DELIVERY_EXPECTATION
~~~

Do not introduce event-driven architecture merely to avoid direct local calls.

### Cross-spec and external boundaries

For each foreign dependency record:

~~~text
FOREIGN_OWNER
CONTRACT_CONSUMED
LOCAL_INTEGRATION_POINT
IDENTITY_PRESERVED
FAILURE_SEMANTICS_PRESERVED
ANTI_CORRUPTION_LAYER
LOCAL_BEHAVIOR_FORBIDDEN
~~~

Use an Anti-Corruption Layer or explicit mapping when foreign concepts must not enter the local domain directly. Consume foreign authority; do not recreate it.

## 8. Responsibility decomposition

Decompose only responsibilities actually required by the ticket, such as domain state, domain invariants, domain transitions, application orchestration, persistence, serialization, registry/index, integration, mapping, recovery, reconciliation, compatibility, migration, archival, or observability.

For each responsibility record:

~~~text
RESPONSIBILITY
BEHAVIOR_OWNED
AUTHORITY_SOURCE
STATE_OWNED
DEPENDENCIES
EXPECTED_TEST_SURFACE
~~~

Avoid one component owning unrelated combinations of domain decisions, orchestration, persistence, serialization, external integration, recovery, and formatting unless existing architecture requires it and the combination remains cohesive.

Assess RESPONSIBILITY_MIXING_RISK.

## 9. Proposed components

Map responsibilities to the smallest coherent component set. For each significant component record:

~~~text
COMPONENT
TYPE
RESPONSIBILITY
OWNS
COLLABORATES_WITH
MUST_NOT_OWN
EXISTING_OR_NEW
EXPECTED_LOCATION
SIZE
~~~

Allowed types include:

~~~text
AGGREGATE_ROOT
DOMAIN_ENTITY
VALUE_OBJECT
DOMAIN_SERVICE
DOMAIN_POLICY
DOMAIN_EVENT
APPLICATION_SERVICE
COMMAND_HANDLER
QUERY_HANDLER
PORT
REPOSITORY
STORE
REGISTRY
ADAPTER
ANTI_CORRUPTION_LAYER
SERIALIZER
VALIDATOR
STATE_MACHINE
RECOVERY_COMPONENT
INTEGRATION_COMPONENT
TEST_SUPPORT
OTHER
~~~

Every component must answer:

- What is its one-sentence responsibility?
- What is its primary reason to change?

If either answer needs unrelated clauses, decompose further. Do not create artificial micro-components merely to satisfy SRP.

## 10. SOLID assessment

Evaluate every significant proposed or materially modified component. Record actual risks, not ceremonial prose.

- SRP: one coherent reason to change. Detect SRP_VIOLATION for domain plus persistence, orchestration plus mapping plus retry policy, lifecycle plus presentation, repository plus business decision, or registry plus serialization plus recovery.
- OCP: introduce extensibility only for a real, known variation axis. Do not add Strategy, Factory, Provider, Plugin, or base-class structures for hypothetical requirements. Detect PREMATURE_EXTENSIBILITY.
- LSP: when polymorphism or inheritance is proposed, verify behavioral substitutability. Detect LSP_RISK and prefer composition when substitutability is weak.
- ISP: consumers depend only on cohesive capabilities they need. Detect FAT_INTERFACE_RISK. Do not create one-method interfaces without a genuine boundary.
- DIP: domain must not depend directly on database, filesystem, HTTP, SDK, or serialization technology where a stable boundary exists. Application should depend on stable ports where repository architecture defines such seams, and infrastructure should implement them. Detect DEPENDENCY_INVERSION_VIOLATION.

Record:

~~~text
SRP_VIOLATIONS
OCP_VIOLATIONS
LSP_VIOLATIONS
ISP_VIOLATIONS
DIP_VIOLATIONS
UNJUSTIFIED_SOLID_VIOLATIONS
~~~

An intentional deviation is acceptable only when explicitly documented as JUSTIFIED_SOLID_DEVIATION and consistent with repository architecture.

## 11. Dependency direction

Document actual dependency direction. Conceptually, when applicable:

~~~text
Domain
  ↑
Application
  ↑
Infrastructure / Adapters
~~~

Use repository-specific equivalents. Report:

~~~text
DEPENDENCY_DIRECTION_VIOLATIONS = <n>
INFRASTRUCTURE_LEAKAGE_POINTS = <n>
~~~

Readiness requires zero unjustified dependency-direction violations.

## 12. Persistence design

When applicable assign:

~~~text
AGGREGATE_STORAGE_BOUNDARY
SERIALIZATION_BOUNDARY
CONCURRENCY_REVISION_MECHANISM
ATOMICITY_BOUNDARY
REGISTRY_INDEX_RELATIONSHIP
DURABLE_INVARIANT_PROTECTION
INTEGRITY_VALIDATION
RECOVERY_BEHAVIOR
ARCHIVAL_BEHAVIOR
~~~

A Repository normally loads, persists, and queries according to contract. It does not normally decide domain lifecycle, reimplement aggregate invariants, own canonical business decisions, or hide application orchestration.

Separate domain semantic rules from durable enforcement mechanisms. Ask whether persistence or a generic mutation API can bypass domain invariants. If yes, design an appropriate durable enforcement or mutation boundary. Do not mandate schema changes not required by the ticket.

## 13. Lifecycle and invariant placement

When lifecycle applies, define:

~~~text
STATES
TRANSITIONS
TRANSITION_OWNER
INVALID_TRANSITIONS
RECOVERY_TRANSITIONS
TERMINAL_TRANSITIONS
PERSISTENCE_GUARD
BYPASS_PATHS_FORBIDDEN
~~~

Prefer one semantic transition authority.

For every important invariant record:

~~~text
INVARIANT
DOMAIN_ENFORCEMENT
DURABLE_ENFORCEMENT
APPLICATION_GUARD
TEST_SURFACE
~~~

Detect UNPLACED_DOMAIN_INVARIANT when a critical rule survives only in comments, caller convention, or scattered repeated conditions. Readiness requires:

~~~text
UNPLACED_DOMAIN_INVARIANTS = 0
~~~

## 14. Interaction and failure/recovery design

Describe the main interaction flow using actual repository components. A handler → application use case → aggregate → repository port → infrastructure repository flow is an example, not a mandated structure.

When failure or recovery applies, identify:

~~~text
FAILURE_POINT
DETECTION
DURABLE_EVIDENCE
FAILURE_OWNER
RETRY_OWNER
IDEMPOTENCY_BOUNDARY
RECOVERY_PATH
RECONCILIATION_PATH
TERMINAL_FAILURE_RULE
~~~

Do not write vague guidance such as “handle errors appropriately.” Preserve canonical failure ownership. Technical exceptions must not silently become new domain semantics.

## 15. Clean Code assessment

Assess:

~~~text
CLEAR_DOMAIN_NAMING
SMALL_COHESIVE_METHODS
EXPLICIT_SIDE_EFFECTS
EXPLICIT_MUTATION_BOUNDARIES
NO_BOOLEAN_PARAMETER_EXPLOSION
NO_LONG_PARAMETER_LISTS
NO_PRIMITIVE_OBSESSION_WHERE_DOMAIN_TYPE_EXISTS
NO_MAGIC_VALUES
NO_GENERIC_UTIL_BUCKETS
NO_GENERIC_SERVICE_BUCKETS
NO_DUPLICATED_DOMAIN_RULES
NO_DEEP_NESTING_BY_DESIGN
NO_COMMENT_DEPENDENT_CORRECTNESS
NO_HIDDEN_TEMPORAL_COUPLING
NO_UNNECESSARY_MUTABILITY
~~~

Use domain language, ticket terminology, SPEC terminology, and existing repository vocabulary. Avoid vague names such as Manager, Processor, Helper, Util, GenericService, or CommonService when a specific name exists. Handler is acceptable where repository conventions provide semantic context.

Prefer methods that express one meaningful operation, expose domain intent, avoid boolean mode switches and unrelated optional parameters, make failure semantics explicit, and preserve invariants internally.

Distinguish code duplication, domain-rule duplication, concept duplication, and foreign-authority duplication. Domain-rule and foreign-authority duplication are materially serious. Do not DRY distinct concepts merely because their code looks similar.

Every abstraction must answer:

~~~text
What variation or boundary does it protect?
Who consumes it?
Why is it needed now?
~~~

Otherwise report PREMATURE_ABSTRACTION_RISK. Also assess OVERENGINEERING_RISK for unnecessary factories, wrappers, event buses, policy hierarchies, or generic frameworks.

## 16. Test design

Design tests before production implementation and map every row of the ticket's
`ACCEPTANCE_WITNESS_MATRIX` to an executable test. A direct test must execute
the normative verb and assert its semantic result. Proxy tests are not
substitutes: register/list does not prove progress, sequential duplicate does
not prove concurrency, and source inspection does not prove an architecture
guard.

For every row also verify `WITNESS_EXECUTABLE_AT_LOCAL_CLOSURE = YES` and record
the required capability, independent dimensions, and dependency class. A fixture may prove
only local/contract-level semantics; it cannot satisfy durable, restart,
physical-CAS, foreign-integration, productive-recovery, or external-effect
witnesses.

For lifecycle or progress behavior, the design must declare:

```text
STATE_SET
INITIAL_STATE
ALLOWED_TRANSITIONS
REJECTED_TRANSITIONS
MUTATION_AUTHORITY
REPOSITORY_CONTRACT
ISOLATION_INVARIANT
STATE_TRANSITION_TEST
```

For atomicity or concurrency behavior, it must declare:

```text
CONCURRENCY_CONTRACT
ONE_WINNER_EXPECTATION
DUPLICATE_STATE_EXPECTATION
DETERMINISTIC_INTERLEAVING_OR_ADAPTER_TEST
```

Architecture tests are required when the ticket creates the first productive
authority, can import `prototype/`, can leak infrastructure into the domain,
or can introduce a second canonical authority. Source inspection is not an
architecture guard witness.

Design tests before production implementation and map each behavior or invariant to an appropriate surface:

~~~text
UNIT
DOMAIN_INVARIANT
STATE_TRANSITION
PERSISTENCE
CONCURRENCY
STALE_PROTECTION
IDEMPOTENCY
RECOVERY
RECONCILIATION
INTEGRATION
CROSS_SPEC
COMPATIBILITY
MIGRATION
ARCHIVAL
NEGATIVE_BEHAVIOR
ARCHITECTURE_CONFORMANCE
~~~

Domain invariants should be testable without unnecessary infrastructure. Application tests prove orchestration, dependency coordination, persistence calls, integration mapping, and failure propagation. Infrastructure tests prove persistence, serialization, concurrency, atomicity, external mapping, and recovery durability; they must not redefine domain semantics.

Use architecture tests only when useful to enforce dependency direction, forbidden references, foreign ownership, legacy-path retirement, or duplicate canonical implementations.

Emit:

```text
DESIGN_TEST_COVERAGE_GATE: PASS
```

only when every normative behavior has a direct executable test, every
applicable state transition and concurrency obligation is covered, and every
required architecture guard has an executable target and expected evidence.
Otherwise emit `DESIGN_TEST_COVERAGE_GATE: BLOCKED` and identify the missing
direct witness, `PROXY_ONLY_BEHAVIORS`, `UNTESTED_STATE_TRANSITIONS`,
`UNPROVEN_CONCURRENCY_CONTRACTS`, or `MISSING_ARCHITECTURE_GUARDS`. If the
authority itself is missing, return `SPECIFICATION_GAP` rather than inventing
a testable meaning.

## 17. Structural risk assessment

Assess each as LOW, MEDIUM, or HIGH:

~~~text
GOD_COMPONENT_RISK
OVERSIZED_FILE_RISK
RESPONSIBILITY_MIXING_RISK
EXCESSIVE_DEPENDENCY_RISK
DUPLICATION_RISK
TESTABILITY_RISK
CROSS_SPEC_LEAKAGE_RISK
ARCHITECTURE_DRIFT_RISK
ANEMIC_DOMAIN_MODEL_RISK
FAT_APPLICATION_SERVICE_RISK
FAT_INTERFACE_RISK
PRIMITIVE_OBSESSION_RISK
DEPENDENCY_INVERSION_RISK
INFRASTRUCTURE_LEAKAGE_RISK
DOMAIN_RULE_DUPLICATION_RISK
PREMATURE_ABSTRACTION_RISK
OVERENGINEERING_RISK
~~~

For every MEDIUM or HIGH risk include a concrete mitigation. A HIGH risk must be mitigated or the design is blocked.

Classify component size as SMALL, MEDIUM, or LARGE. A LARGE component is acceptable only when its responsibility is cohesive and splitting would damage the domain boundary.

## 18. Implementation sequence

Provide ordered implementation guidance that reduces partially valid architecture. Adapt to the actual ticket:

~~~text
1. domain concepts and value contracts
2. aggregate invariants and lifecycle
3. application orchestration
4. persistence ports and infrastructure
5. integration or ACL mapping
6. recovery and reconciliation
7. compatibility and cutover
8. automated tests
9. regression and architecture conformance
~~~

For every step state what can be tested immediately. Do not create new tickets.

## 19. Files expected to change

Classify likely areas as:

~~~text
EXPECTED_CREATE
EXPECTED_MODIFY
POSSIBLE_MODIFY
MUST_NOT_MODIFY
~~~

This is implementation guidance, not a strict whitelist. A legitimate additional local file may be changed if it remains within ticket authority.

## 20. Open questions

List only genuine implementation blockers. Do not generate speculative questions about naming preferences, hypothetical scale, future extensions, or alternatives already decided upstream.

## 21. Design quality metrics

Report:

~~~text
RESPONSIBILITIES
DOMAIN_CONCEPTS
AGGREGATE_ROOTS
ENTITIES
VALUE_OBJECTS
DOMAIN_SERVICES
APPLICATION_SERVICES
PORTS
ADAPTERS
ANTI_CORRUPTION_LAYERS
PROPOSED_COMPONENTS
CRITICAL_INVARIANTS
UNPLACED_DOMAIN_INVARIANTS
TEST_SURFACES
UNJUSTIFIED_SOLID_VIOLATIONS
DEPENDENCY_DIRECTION_VIOLATIONS
HIGH_STRUCTURAL_RISKS
HIGH_DDD_RISKS
HIGH_SOLID_RISKS
HIGH_CLEAN_CODE_RISKS
SPEC_IMPLEMENTABILITY_CHECK
IDENTITY_AUTHORITY_GAPS
RECONSTRUCTION_AUTHORITY_GAPS
LIFECYCLE_AUTHORITY_GAPS
PERSISTENCE_SEMANTICS_GAPS
CROSS_SPEC_AUTHORITY_GAPS
PROHIBITED_NORMATIVE_DECISIONS
AUTHORITY_CONSUMPTION_PROOFS
PRODUCER_CONSUMER_CONTRACT_PROOFS
TEMPORAL_AUTHORITY_PROOFS
TEMPORAL_AUTHORITY_GAPS
CALLER_SUPPLIED_AUTHORITY_BYPASS
ACCEPTANCE_WITNESS_MATRIX_ROWS
DIRECT_BEHAVIOR_WITNESSES
PROXY_ONLY_BEHAVIORS
UNTESTED_STATE_TRANSITIONS
UNPROVEN_CONCURRENCY_CONTRACTS
MISSING_ARCHITECTURE_GUARDS
DESIGN_TEST_COVERAGE_GATE
~~~

## 22. Design readiness

IMPLEMENTATION_DESIGN_READY requires:

- ticket responsibility and scope are coherent and preserved;
- upstream authority and repository architecture are understood;
- every responsibility has an implementation home;
- domain behavior is placed correctly;
- aggregate boundaries, critical invariants, lifecycle authority, and persistence boundaries are explicit where required;
- application orchestration is separated from domain decisions;
- foreign ownership and cross-spec integration are preserved;
- UNPLACED_DOMAIN_INVARIANTS = 0;
- UNJUSTIFIED_SOLID_VIOLATIONS = 0;
- DEPENDENCY_DIRECTION_VIOLATIONS = 0;
- no HIGH anemic-domain, god-component, responsibility-mixing, fat-service, dependency-inversion, infrastructure-leakage, duplicated-domain-rule, premature-abstraction, or overengineering risk remains unmitigated;
- required tests, failure, recovery, compatibility, and persistence surfaces are identified;
- `SPEC_IMPLEMENTABILITY_CHECK = PASS` is current and all applicable upstream
  authority proofs are complete;
- authority provenance and anti-forgery negative tests are explicit;
- `UPSTREAM_AUTHORITY_PRECONDITIONS` explicitly cites identity, lifecycle,
  persistence/recovery, rehydration, concurrency, idempotency, ownership, and
  cross-SPEC dependencies;
- every external authority has a concrete consumable contract and producer;
- every capability classified `REQUIRED_FOR_LOCAL_EXECUTION` or
  `REQUIRED_FOR_LOCAL_CLOSURE` is productively available at local closure, with
  the required promotion record rather than a fixture-only promotion;
- every mutable authority used before an effect has a complete temporal proof;
- `DESIGN_TEST_COVERAGE_GATE = PASS`;
- every Required Behavior and Acceptance Criterion has a direct witness, with
  no proxy-only behavior, untested transition, unproven concurrency obligation,
  or missing required architecture guard;
- the current ticket-set audit is `IMPLEMENTATION_TICKETS_CONFORMANT` with
  `IMPLEMENTATION_GATE = READY_FOR_IMPLEMENTATION` and a live matching basis;
- no ticket-set remediation or independent ticket-set re-audit is pending;
- no architecture redesign or scope expansion is required.

## Required artifact

Create:

~~~text
<ticket-folder>/<TICKET-ID>-implementation-design.md
~~~

This artifact is implementation guidance, not authority over ADR, portfolio, SPEC, Gap Matrix, Implementation Plan, or ticket. If it conflicts with upstream authority, upstream authority wins.

### Lifecycle status isolation

The ticket's lifecycle status is authoritative only in the primary ticket artifact.
The implementation-design artifact must not emit a bare `Status:`, `STATUS:`, or
`TICKET_STATUS:` lifecycle field. Its own lifecycle is represented only by the
required design verdict and design gate. If the design needs to preserve its
input precondition, use the qualified field:

```text
DESIGN_INPUT_TICKET_STATE: READY
```

Never update the design input state when implementation later moves the ticket
to `IMPLEMENTED` or `VALIDATION_REQUIRED`; implementation updates the ticket
and its derived index, not the design artifact.

Use exactly this section order:

~~~text
1. Design Verdict
2. Ticket
3. Implementation Responsibility
4. Repository Architecture Context
5. Existing Repository Context
6. Domain Model Assessment
7. UPSTREAM_AUTHORITY_PRECONDITIONS
8. Aggregate / Consistency Boundaries
9. Responsibility Decomposition
10. Proposed Components
11. SOLID Assessment
12. Dependency Direction
13. Invariant Placement
14. Persistence Design
15. Lifecycle Design
16. Cross-Spec Integration
17. Main Interaction Flow
18. Failure / Recovery Flow
19. Clean Code Assessment
20. Test Design
21. Structural Risk Assessment
22. Implementation Sequence
23. Files Expected to Change
24. Open Questions / Blockers
25. Design Metrics
26. Design Gate
~~~

Sections that do not apply must say NOT_APPLICABLE and explain why briefly.

### 1. Design Verdict

Use exactly:

~~~text
IMPLEMENTATION_DESIGN_READY
~~~

or:

~~~text
IMPLEMENTATION_DESIGN_BLOCKED
~~~

### 2. Ticket

Include:

~~~text
Ticket ID:
Ticket path:
TICKET_SET_AUDIT_VERDICT:
TICKET_SET_IMPLEMENTATION_GATE:
TICKET_SET_AUDIT_TARGET_HEAD:
TICKET_SET_AUDIT_BASIS_FINGERPRINT:
Implementation Unit:
Portfolio Obligations:
Requirements:
Gap IDs:
Acceptance IDs:
~~~

### 3. Implementation Responsibility

State one concise sentence.

### 4. Repository Architecture Context

Describe actual domain, application, infrastructure, persistence, and integration boundaries using repository terminology.

### 5. Existing Repository Context

Use:

| Existing Component | Classification | Current Responsibility | Design Use |
| --- | --- | --- | --- |

### 6. Domain Model Assessment

Report meaningful domain concepts, aggregates, entities, value objects, services, policies, events, application use cases, repository abstractions, and ACL boundaries.

### 7. UPSTREAM_AUTHORITY_PRECONDITIONS

Copy the precondition record from section 4a, including the proof IDs and
revision. Do not repeat authority in design prose; cite it.

### 8. Aggregate / Consistency Boundaries

Use:

| Aggregate | Root | Invariants | Transaction / Consistency Boundary | External References |
| --- | --- | --- | --- | --- |

### 9. Responsibility Decomposition

Use:

| Responsibility | Authority | State Owned | Expected Test Surface |
| --- | --- | --- | --- |

### 10. Proposed Components

Use:

| Component | Type | Responsibility | Existing/New | Expected Location | Size |
| --- | --- | --- | --- | --- | --- |

For every significant component also state OWNS, COLLABORATES_WITH, and MUST_NOT_OWN.

### 11. SOLID Assessment

Use:

| Component | SRP | OCP | LSP | ISP | DIP | Result |
| --- | --- | --- | --- | --- | --- | --- |

Allowed results: PASS, RISK, NOT_APPLICABLE, JUSTIFIED_DEVIATION. List only material details.

### 12. Dependency Direction

Show a concise diagram or text and report:

~~~text
DEPENDENCY_DIRECTION_VIOLATIONS = <n>
INFRASTRUCTURE_LEAKAGE_POINTS = <n>
~~~

### 13. Invariant Placement

Use:

| Invariant | Domain Enforcement | Durable Protection | Application Guard | Test |
| --- | --- | --- | --- | --- |

### 14. Persistence Design

When applicable cover aggregate storage, repository/port boundary, serialization, concurrency, atomicity, durable invariants, registry/index, integrity validation, recovery, and archival.

### 15. Lifecycle Design

When applicable cover states, transitions, transition owner, invalid/recovery/terminal transitions, forbidden bypass paths, and persistence guard.

### 16. Cross-Spec Integration

Use:

| Foreign Owner | Contract | Local Integration Point | ACL | Forbidden Local Ownership |
| --- | --- | --- | --- | --- |

For each row, include the corresponding
`AUTHORITY_CONSUMPTION_PROOF` and `PRODUCER_CONSUMER_CONTRACT_PROOF`. The
integration point must be a real consumer seam, not a conceptual dependency.

### 17. Main Interaction Flow

Give a short ordered flow using actual proposed components.

### 18. Failure / Recovery Flow

When applicable include failure point, detection, durable evidence, failure owner, retry owner, idempotency boundary, recovery path, and reconciliation path.

When authority can change between observation and effect, include the
`TEMPORAL_AUTHORITY_PROOF` and `CALLER_AS_AUTHORITY_CHECK` result.

### 19. Clean Code Assessment

Report the required Clean Code checks as PASS, RISK, or NOT_APPLICABLE, with concise evidence.

### 20. Test Design

Use:

| Behavior / Invariant | Test Type | Target | Expected Proof |
| --- | --- | --- | --- |

Include the complete `ACCEPTANCE_WITNESS_MATRIX` mapping and its
`DESIGN_TEST_COVERAGE_GATE`. A row is conformant only when its test executes
the required operation and directly asserts the required behavior.

### 21. Structural Risk Assessment

Report all structural and DDD/SOLID/Clean Code risks and mitigation for every MEDIUM/HIGH item.

### 22. Implementation Sequence

Give ordered design guidance and immediate validation for each step.

### 23. Files Expected to Change

Use:

| Path / Area | Classification | Reason |
| --- | --- | --- |

### 24. Open Questions / Blockers

List genuine blockers or NONE.

### 25. Design Metrics

Report the metrics from the design quality section.

### 26. Design Gate

Return exactly one:

~~~text
IMPLEMENTATION_DESIGN_GATE: READY_FOR_IMPLEMENTATION
~~~

or:

~~~text
IMPLEMENTATION_DESIGN_GATE: BLOCKED
~~~

## Critical rules

1. DDD places behavior; it does not redesign architecture.
2. Domain objects decide, application services orchestrate, repositories persist, and adapters translate, subject to repository conventions.
3. A ticket is not a class. One ticket may require many cohesive components.
4. Avoid anemic domain models when real rules exist; do not force rich objects onto rule-free CRUD.
5. Avoid god services and generic responsibility buckets.
6. Apply SOLID semantically, not ceremonially.
7. SRP means one coherent reason to change, not one method.
8. OCP requires a real variation axis.
9. DIP protects existing architectural boundaries.
10. Use value objects when domain semantics justify them, not for ceremonial wrapping.
11. Prefer ubiquitous language.
12. Do not DRY different concepts into one abstraction.
13. Every critical invariant needs an implementation home.
14. Every dependency needs an explicit direction.
15. Cross-spec models require intentional translation and preserved foreign ownership.
16. Tests are part of the design.
17. Clean Code means clarity and explicit behavior, not abstraction count.
18. High structural risks must be resolved before coding.
19. Keep design strictly ticket-scoped.
20. Do not implement production code, test code, migrations, or upstream artifacts.

## Core completion invariant

Implementation design is ready only when the ticket's frozen behavior has been mapped into a cohesive code structure compatible with accepted architecture; domain concepts, aggregates, entities, value objects, policies, and services are used only where their semantics justify them; domain invariants and lifecycle decisions have explicit ownership and durable protection where required; application services orchestrate rather than become the domain model; infrastructure does not leak into domain semantics; dependency direction is explicit and valid; SOLID principles are satisfied without ceremonial abstraction; no high-risk anemic model, god component, fat service, fat interface, primitive obsession, duplicated domain rule, dependency inversion violation, infrastructure leak, or premature abstraction remains unmitigated; cross-spec authority is consumed without duplication; persistence, failure, recovery, and compatibility boundaries are explicit; every critical behavior has a concrete automated test surface; and the design remains inside the conformant ticket scope and accepted architecture.

When this invariant holds:

~~~text
IMPLEMENTATION_DESIGN_READY
IMPLEMENTATION_DESIGN_GATE: READY_FOR_IMPLEMENTATION
~~~

## Required final response

Return:

~~~text
Implementation design verdict:
IMPLEMENTATION_DESIGN_READY
|
IMPLEMENTATION_DESIGN_BLOCKED

Ticket:
<TICKET-ID>

Design artifact:
<path>

DDD:
- Domain concepts: <n>
- Aggregate roots: <n>
- Entities: <n>
- Value objects: <n>
- Domain services/policies: <n>
- ACL boundaries: <n>

Components:
- Existing reused: <n>
- Existing extended/refactored: <n>
- New proposed: <n>
- Responsibilities: <n>

Quality:
- Unplaced invariants: <n>
- Unjustified SOLID violations: <n>
- Dependency direction violations: <n>
- High structural risks: <n>
- High DDD risks: <n>
- High SOLID risks: <n>
- High Clean Code risks: <n>

Testing:
- Critical invariants mapped: <n>
- Test surfaces: <n>

Authority:
- Architecture changes required: YES | NO
- Scope expansion required: YES | NO
- Cross-spec ownership violations: <n>

Gate:
READY_FOR_IMPLEMENTATION
|
BLOCKED
~~~

When blocked, list only:

~~~text
BLOCKER
AFFECTED_RESPONSIBILITY
REASON
REQUIRED_UPSTREAM_ACTION
~~~

Never implement production code or tests.
