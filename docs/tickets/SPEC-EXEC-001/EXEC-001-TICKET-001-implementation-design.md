# EXEC-001-TICKET-001 — Implementation Design

## 1. Design Verdict

```text
IMPLEMENTATION_DESIGN_READY
```

The ticket has frozen, coherent schema-validation behavior, complete upstream authority, no required foreign capability for local closure, and direct executable witnesses. The design adds only the EXEC contract boundary, preserves the repository's `src/domain`/`src/application` conventions, and does not implement registry resolution, persistence, transport, or downstream mappings.

## 2. Ticket

```text
Ticket ID: EXEC-001-TICKET-001
Ticket path: docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-001-envelope-schema-contract.md
Implementation Unit: EXEC-IMP-01 — Envelope and schema contract
Portfolio Obligations: O-016
Requirements: EXEC-ENVELOPE-001, EXEC-ENVELOPE-002
Gap IDs: GAP-001
Acceptance IDs: AC-EXEC-001, AC-EXEC-002
DESIGN_INPUT_TICKET_STATE: READY
Pinned starting HEAD: 381218d5fbf8d969ee5ae5349b8f65c4cd5af7f9
```

Authority and readiness are cited from the ticket audit (`IMPLEMENTATION_TICKETS_CONFORMANT`, `IMPLEMENTATION_GATE = READY_FOR_IMPLEMENTATION`) and the ticket's `EXECUTION_READY = TRUE`. `CITA-MINOR-001` is non-blocking and does not affect this ticket's scope or proof ownership.

## 3. Implementation Responsibility

Implement the EXEC-owned identifiable envelope/payload schema validation boundary that accepts only a complete structured pair and returns a fail-closed `CONTRACT_INVALID` result for invalid, incomplete, or text-only input without implying approval, checkpoint, or effect.

## 4. Repository Architecture Context

The productive repository is a small TypeScript domain/application codebase using immutable domain value objects, application handlers, explicit ports, and Node test fixtures. There is no productive EXEC implementation or established infrastructure layer.

```text
src/domain        semantic values, invariants, immutable contract results and ports
src/application   thin use-case/handler orchestration
src                no productive EXEC schema, registry, persistence or transport surface
tests              node:test executable fixtures; existing tests import productive src directly
prototype          non-authoritative scenario/UI evidence; never imported by production code
.pi                generic delegation runtime; consumer/integration evidence only
```

The design keeps schema technology behind a port. A schema adapter may depend on the selected schema mechanism, but domain code must not depend on a JSON-schema library, filesystem, HTTP, `.pi`, or `prototype`. No new Clean Architecture, event bus, persistence layer, transport, or framework is introduced.

## 5. Existing Repository Context

| Existing Component | Classification | Current Responsibility | Design Use |
| --- | --- | --- | --- |
| `src/domain/*` immutable value-object convention | REUSE | Domain concepts validate at construction and expose explicit equality/behavior | Place EXEC semantic contract values and failure meaning in the same convention |
| `src/application/*` handler convention | REUSE | Application handlers coordinate authority readers, domain objects, and repository ports | Place one thin validation use case at the application boundary |
| `tests/*.test.ts` with `node:test` | REUSE | Direct executable repository/domain tests using deterministic fixtures | Add the ticket's direct schema, missing-field, text-only, no-effect, and architecture witnesses |
| `src/application/snapshot.ts` caller-version path | DO_NOT_TOUCH | DOM-owned snapshot consumer; caller versions are the separate GAP-005 concern | Do not broaden this ticket into exact-basis binding or DOM remediation |
| `src/domain/snapshot.ts` and `src/domain/identity.ts` | DO_NOT_TOUCH | DOM identity/snapshot authority | Consume no DOM behavior in this locally closed schema ticket |
| `.pi/extensions/workflow-orchestrator/*` | DO_NOT_TOUCH | Generic delegation consumer | Regression boundary only; it is not schema authority |
| `prototype/src/*`, `prototype/tests/*` | DO_NOT_TOUCH | Scenario/UI evidence | Never promote prototype shapes or tests to production authority |

No existing EXEC component is semantically reusable: `EXISTING_REUSED = 0`, `EXISTING_EXTENDED = 0`. Repository conventions are reused without promoting an unrelated component.

## 6. Domain Model Assessment

### Domain concepts

- `SchemaReference`: immutable identifiable schema identity used for the envelope or capability-payload contract. It carries identity only; it does not classify semver or resolve a capability registry.
- `StructuredExecutionEnvelope`: immutable validated contract value containing the required structured execution/result categories from `EXEC-ENVELOPE-002`.
- `StructuredCapabilityPayload`: immutable validated payload value associated with its identifiable schema.
- `ValidatedExecContract`: immutable pair of the validated envelope and payload, including their schema references.
- `ContractInvalidFailure`: structured fail-closed result with canonical code `CONTRACT_INVALID` and diagnostic evidence; it is not an approval or lifecycle result.

### Aggregate roots, entities, value objects, services, policies and events

- Aggregate roots/entities: `NOT_APPLICABLE`. This ticket validates an input contract and creates no mutable aggregate, entity lifecycle, or persisted later state.
- Value objects: `SchemaReference`, `StructuredExecutionEnvelope`, `StructuredCapabilityPayload`, and `ValidatedExecContract` are justified by identity, validation, immutability, and comparison semantics.
- Domain services/policies: no standalone domain service is required. Required-field and structured-contract rules remain beside the contract values; schema-library mechanics remain behind a port.
- Application use case: one `ValidateExecContract` orchestration boundary coordinates the two schema validations and domain construction.
- Repository abstractions: `NOT_APPLICABLE`; no durable state is loaded or stored.
- Domain events: `NOT_APPLICABLE`; validation is a synchronous contract result and the repository has no event-delivery boundary for this ticket.
- Anti-corruption layer: `NOT_APPLICABLE` for local closure; no foreign domain model is consumed. The schema adapter is a technical adapter, not a foreign domain mapper.

`ANEMIC_DOMAIN_MODEL_RISK = LOW`: this is contract/value behavior rather than a stateful aggregate; schema identity, required fields, immutability, and fail-closed result semantics have explicit homes. `FAT_APPLICATION_SERVICE_RISK = LOW`: the application use case coordinates and does not own schema rules.

## 7. UPSTREAM_AUTHORITY_PRECONDITIONS

The following records cite the current accepted authority and the latest conformant implementation planning evidence. They are not redefined by this design.

| Concern | Proof / authority and revision | Status for this ticket | Design consequence |
| --- | --- | --- | --- |
| Identity | `SPEC-EXEC-001` revision 3 §§12.3, 12.4; component audit §§16–18; Plan §22 (`REGISTRY_ENTRY` and manifest proofs) | `NOT_APPLICABLE` to this ticket: no Aggregate Root or local canonical identity is created | Schema references are contract identities only; do not invent `ExecutionId`, `ActivityId`, `AttemptId`, registry-entry, or manifest identity |
| Lifecycle | `SPEC-EXEC-001` revision 3 §§13, 15–16; Plan §22; ticket §§9, 13 | `NOT_APPLICABLE`: validation produces no lifecycle transition | Invalid input returns a result only; no DOM approval, checkpoint, progression, or effect path is exposed |
| Persistence / recovery | `ADR-0003` revision 3; `ADR-0006` revision 3; `SPEC-EXEC-001` §§12.4, 16, 19; Plan §12 PCP-PLAT-EXEC-01 | `NOT_APPLICABLE` for local closure | No repository, storage, journal, restart, physical integrity, or recovery implementation is added |
| Rehydration | `SPEC-EXEC-001` revision 3 §12.4; Plan §22; registry/manifest reconstruction proofs | `NOT_APPLICABLE`: no persisted material is materialized | Do not add `fromPersisted`/rehydration behavior or treat schema-valid raw material as persisted domain state |
| Concurrency | `SPEC-EXEC-001` revision 3 §§12.1–12.2, 16; Plan §17; ticket acceptance matrix | `NOT_APPLICABLE`: no mutable state or concurrent mutation occurs | No CAS, reservation, duplicate state, or physical atomicity is designed here |
| Idempotency | `ADR-0006` revision 3; `SPEC-EXEC-001` §16; Plan §12 | `NOT_APPLICABLE`: validation has no external effect or durable command | Repeated validation is side-effect free; effect idempotency remains PLAT/GIT-owned |
| Ownership | ADR-0003 revision 3 `Decisão`; Portfolio revision 2 O-016; SPEC-EXEC-001 revision 3 §§2, 9, 13, 15 | `COMPLETE` — EXEC-001 / `CANONICAL_OWNER` owns envelope/payload schema shape and fail-closed contract result | Keep DOM identity/lifecycle, registry/version resolution, persistence, transport, and projections outside this ticket |
| Cross-SPEC dependencies | Ticket §13 `ACP-EXEC-01`; §14b `UNIT-EXEC-SCHEMA-HARNESS`; Plan §§12 and 22; component audit §§21–23 | `COMPLETE`, with no foreign capability required for local closure | The unit-owned schema harness is `INFORMATIONAL`, locally testable, and not claimed as productive foreign availability; downstream consumers are integrated-proof contributors only |
| Temporal authority | Shared authority-completeness gate; ticket §14a | `NOT_APPLICABLE`: no mutable external authority is observed before an effect | `CALLER_AS_AUTHORITY_CHECK = PASS`; schema definitions are ticket-owned and raw text cannot supply omitted authority |

```text
SPEC_IMPLEMENTABILITY_CHECK = PASS
SPEC_IMPLEMENTABILITY_REVISION = SPEC-EXEC-001 revision 3; component audit PASS — COMPONENT_SPEC_CONFORMANT; Plan Audit IMPLEMENTATION_PLAN_CONFORMANT
IDENTITY_AUTHORITY_GAPS = 0 applicable; no ticket aggregate
RECONSTRUCTION_AUTHORITY_GAPS = 0 applicable; no ticket persisted state
LIFECYCLE_AUTHORITY_GAPS = 0 applicable; no ticket transition
PERSISTENCE_SEMANTICS_GAPS = 0 applicable; no ticket persistence
CROSS_SPEC_AUTHORITY_GAPS = 0 local; integrated-only consumers remain explicitly downstream
PROHIBITED_NORMATIVE_DECISIONS = 0
```

### Authority consumption record

`ACP-EXEC-01` (ticket §14a) is consumed without reinterpretation:

```text
CAPABILITY_ID = UNIT-EXEC-SCHEMA-HARNESS
AUTHORITY_EXISTENCE = YES; ADR-0003/O-016 and EXEC-ENVELOPE-001/002
TRUTH_OWNER = SPEC-EXEC-001 / EXEC-001
PORT_INTERFACE_QUERY_RESOLVER_OR_READER = ticket-owned schema-validation boundary
CONTRACT_PRODUCER = ticket-owned schema definition/validation boundary
CONTRACT_CONSUMER = EXEC local contract consumer and later EXEC units
RETURNED_DATA = identifiable envelope/payload validation result and structured fields
VERSION_REVISION_TRANSPORT = schema identity is carried with the validated contract; semver resolution remains TICKET-002
FAILURE_NOT_FOUND_STALE_SEMANTICS = invalid/unknown schema or missing required structured field fails closed as CONTRACT_INVALID
AUTHORITY_STATUS = DEFINED
CONTRACT_STATUS = DEFINED
SEMANTIC_STATUS = DEFINED
LOCAL_TESTABILITY = YES
PRODUCTIVE_AVAILABILITY = NO (local fixture/harness is not a foreign producer)
CAPABILITY_SUMMARY_STATUS = CONTRACT_TESTABLE_LOCALLY
DEPENDENCY_CLASS = INFORMATIONAL
AVAILABILITY_EVIDENCE = ticket-owned direct schema operations at the consumer execution point
BLOCKING_EFFECT = NONE
RESULT = AUTHORITY_CONSUMPTION_GAP for productive availability only; no local blocker
PROOF_EVIDENCE = ticket §14a–§14c; Plan §9 EXEC-IMP-01; component audit §12
```

The record is not promoted to `AUTHORITY_CONSUMABLE` for productive availability. The capability is informational and therefore does not block local execution or closure.

## 8. Aggregate / Consistency Boundaries

| Aggregate | Root | Invariants | Transaction / Consistency Boundary | External References |
| --- | --- | --- | --- | --- |
| None | NOT_APPLICABLE | No mutable aggregate state; a validation call either returns one immutable validated pair or one structured failure | One synchronous validation operation; no persistence transaction | Optional foreign-looking IDs inside the structured envelope remain payload data and are not resolved or owned here |

The boundary is a contract-validation boundary, not an aggregate. The application operation must not expose a partial envelope, partial payload, approval, checkpoint, or effect result.

## 9. Responsibility Decomposition

| Responsibility | Authority | State Owned | Expected Test Surface |
| --- | --- | --- | --- |
| Define identifiable envelope schema contract | O-016; `EXEC-ENVELOPE-001/002` | Ticket-owned envelope schema identity/definition | direct valid pair and schema-identity tests |
| Define identifiable capability-payload schema contract | O-016; `EXEC-ENVELOPE-001/002` | Ticket-owned payload schema identity/definition | direct valid pair and invalid-payload tests |
| Validate raw envelope against its schema | `EXEC-ENVELOPE-001` | No mutable state; validation result only | positive schema validation and malformed/text-only negative tests |
| Validate raw payload against its schema | `EXEC-ENVELOPE-001` | No mutable state; validation result only | positive schema validation and malformed/missing-field negative tests |
| Enforce structured minimum fields and produce immutable values | `EXEC-ENVELOPE-002` | Validated envelope/payload value instances | required-field and structured-consumption tests |
| Orchestrate both validations atomically at the operation boundary | Ticket local scope; `AC-EXEC-001/002` | No durable state; returned discriminated result | no partial-result/no-effect tests |
| Preserve canonical failure semantics | `EXEC-CONTRACT-001`; `EXEC-FAILURE-001` boundary already authoritative downstream | Structured `CONTRACT_INVALID` diagnostic result | explicit code, no-success, no-approval, no-checkpoint, no-effect assertions |
| Prevent prototype/text/transport authority | ADR-0003; SPEC-EXEC-001 §§11, 13, 18–20 | No alternate authority | executable production-boundary and dependency-isolation guard |

`RESPONSIBILITY_MIXING_RISK = LOW`: schema mechanics, semantic contract values, orchestration, and failure mapping have distinct reasons to change.

## 10. Proposed Components

| Component | Type | Responsibility | Existing/New | Expected Location | Size |
| --- | --- | --- | --- | --- | --- |
| `SchemaReference` | VALUE_OBJECT | Validate and compare an identifiable envelope or payload schema reference | New | Existing `src/domain` contract area | SMALL |
| `ExecContractSchemaDefinitions` | OTHER | Expose the ticket-owned envelope and capability-payload schema definitions and their references; no dynamic capability registry | New | Existing `src/domain`/contract area, with physical representation left unfrozen | SMALL |
| `StructuredExecutionEnvelope` | VALUE_OBJECT | Hold the complete structured envelope after schema and minimum-field validation | New | Existing `src/domain` contract area | MEDIUM |
| `StructuredCapabilityPayload` | VALUE_OBJECT | Hold the schema-valid capability payload associated with its `SchemaReference` | New | Existing `src/domain` contract area | SMALL |
| `ValidatedExecContract` | VALUE_OBJECT | Pair the immutable validated envelope and payload for consumption | New | Existing `src/domain` contract area | SMALL |
| `ExecSchemaValidationPort` | PORT | Abstract schema-engine validation of raw values against ticket-owned identifiable schemas | New | Existing `src/domain` port convention | SMALL |
| `ValidateExecContract` | APPLICATION_SERVICE | Obtain ticket-owned definitions, invoke both validations, construct values, and return valid/fail-closed result | New | Existing `src/application` convention | SMALL |
| Schema validation adapter | ADAPTER | Translate the chosen schema mechanism into `ExecSchemaValidationPort` outcomes without owning EXEC meaning | New | Repository-compatible adapter boundary; exact module and library intentionally unfrozen | SMALL |
| Ticket contract test support | TEST_SUPPORT | Deterministic schema harness, raw fixtures, and no-effect recorder | New | `tests/exec-001-ticket-001.test.ts` local support | SMALL |

### Component ownership rules

| Component | OWNS | COLLABORATES_WITH | MUST_NOT_OWN |
| --- | --- | --- | --- |
| `SchemaReference` | Identifiable schema identity and comparison | `ExecContractSchemaDefinitions`, validated contract values | Semver compatibility, capability lookup, transport, persistence |
| `ExecContractSchemaDefinitions` | The two ticket-local schema contracts and their identities | `SchemaReference`, `ValidateExecContract`, schema adapter | Dynamic versioned capability registry, downstream registration, transport |
| `StructuredExecutionEnvelope` | Structured minimum-field validation and immutable access | Schema validation result, `ValidatedExecContract` | Text inference, DOM lifecycle, registry resolution |
| `StructuredCapabilityPayload` | Payload shape/value integrity after schema validation | Schema validation result, `ValidatedExecContract` | Capability resolution, execution, external effects |
| `ValidatedExecContract` | The complete immutable envelope/payload pair | `ValidateExecContract`, later EXEC consumers | Event publication, lifecycle transition, effect confirmation |
| `ExecSchemaValidationPort` | The inward-facing schema-mechanics capability boundary | `ValidateExecContract`, schema adapter, local fixture | Semantic failure ownership, required-field policy, persistence |
| `ValidateExecContract` | Validation sequencing, pair completeness, and fail-closed result aggregation | Definitions, port, structured values, failure value | Registry lookup, retry policy, persistence, transport, approval |
| Schema validation adapter | Translation between the selected schema mechanism and the port outcome | `ExecSchemaValidationPort`, schema definitions | Human-text authority, canonical domain decisions, mutation |
| Ticket contract test support | Deterministic fixtures and no-effect observation | Production validation boundary | Production authority or implementation behavior |

Each component has one cohesive reason to change: schema identity, local schema definitions, envelope shape, payload shape, pair consumption, schema-engine integration, use-case sequencing, adapter mechanics, or executable evidence respectively. The only real abstraction protecting a boundary is `ExecSchemaValidationPort`: it keeps schema technology out of domain semantics and permits a deterministic local harness. No generic `Service`, `Manager`, `Util`, strategy hierarchy, or event bus is proposed.

## 11. SOLID Assessment

| Component | SRP | OCP | LSP | ISP | DIP | Result |
| --- | --- | --- | --- | --- | --- | --- |
| `SchemaReference` | PASS | NOT_APPLICABLE | NOT_APPLICABLE | NOT_APPLICABLE | PASS | PASS |
| `ExecContractSchemaDefinitions` | PASS | NOT_APPLICABLE | NOT_APPLICABLE | NOT_APPLICABLE | PASS | PASS |
| `StructuredExecutionEnvelope` | PASS | NOT_APPLICABLE | NOT_APPLICABLE | NOT_APPLICABLE | PASS | PASS |
| `StructuredCapabilityPayload` | PASS | NOT_APPLICABLE | NOT_APPLICABLE | NOT_APPLICABLE | PASS | PASS |
| `ValidatedExecContract` | PASS | NOT_APPLICABLE | NOT_APPLICABLE | NOT_APPLICABLE | PASS | PASS |
| `ExecSchemaValidationPort` | PASS | NOT_APPLICABLE | NOT_APPLICABLE | PASS | PASS | PASS |
| `ValidateExecContract` | PASS | PASS — only the real schema-mechanics seam varies | NOT_APPLICABLE | PASS | PASS | PASS |
| Schema validation adapter | PASS | PASS — schema-engine implementation is the existing boundary | NOT_APPLICABLE | PASS | PASS | PASS |

```text
SRP_VIOLATIONS = 0
OCP_VIOLATIONS = 0
LSP_VIOLATIONS = 0
ISP_VIOLATIONS = 0
DIP_VIOLATIONS = 0
UNJUSTIFIED_SOLID_VIOLATIONS = 0
```

No inheritance or polymorphic hierarchy is needed. OCP is limited to the actual schema-mechanics adapter boundary; no hypothetical extensibility is introduced.

## 12. Dependency Direction

```text
Structured EXEC contract values and failure semantics
        ↑ consumed by
ValidateExecContract application use case
        ↑ invokes
ExecSchemaValidationPort
        ↑ implemented by
schema-mechanics adapter / local contract fixture

Tests invoke the production application boundary.
prototype, .pi, transport, DOM, persistence and registry are not dependencies of this ticket.
```

The domain-facing port prevents schema-library or physical-format leakage into semantic contract values. The application depends on the stable port; the adapter depends inward on the port. This follows existing repository boundaries without inventing a new architectural layer.

```text
DEPENDENCY_DIRECTION_VIOLATIONS = 0
INFRASTRUCTURE_LEAKAGE_POINTS = 0
```

## 13. Invariant Placement

| Invariant | Domain Enforcement | Durable Protection | Application Guard | Test |
| --- | --- | --- | --- | --- |
| Envelope and payload each use an identifiable ticket-owned schema | `SchemaReference` and `ExecContractSchemaDefinitions` | NOT_APPLICABLE; no persistence | Validator receives only the ticket-owned definition set | valid pair, unknown/non-identifiable schema negative |
| Both envelope and payload must validate before consumption | `ValidatedExecContract` construction requires two successful validations | NOT_APPLICABLE | `ValidateExecContract` returns no partial success when either side fails | valid pair and one-side-invalid tests |
| Minimum structured fields cannot be omitted or inferred from text | `StructuredExecutionEnvelope` required-field construction | NOT_APPLICABLE | application never calls success constructor on failed validation | missing-field and text-only tests |
| Invalid input maps to `CONTRACT_INVALID` | `ContractInvalidFailure` canonical result type | NOT_APPLICABLE | failure branch prevents approval/checkpoint/effect outputs | code and no-success/no-effect assertions |
| Text is non-authoritative | structured values are built only from validated fields | NOT_APPLICABLE | optional text is ignored for missing authority | text-only and omitted-field tests |
| Validated values are immutable after return | private construction/immutable value objects | NOT_APPLICABLE | return only complete discriminated result | mutation/equality/consumption test |
| No second EXEC authority is introduced | ticket-owned boundary is the sole local schema authority | NOT_APPLICABLE | no registry, transport, or prototype fallback path | executable public-boundary architecture guard |

```text
UNPLACED_DOMAIN_INVARIANTS = 0
```

## 14. Persistence Design

`NOT_APPLICABLE` for this ticket. The operation is side-effect free and does not create a persistible aggregate, registry entry, manifest, journal record, outbox item, durable revision, index, recovery record, or archive. `AGGREGATE_STORAGE_BOUNDARY`, `SERIALIZATION_BOUNDARY`, `CONCURRENCY_REVISION_MECHANISM`, `ATOMICITY_BOUNDARY`, `REGISTRY_INDEX_RELATIONSHIP`, `DURABLE_INVARIANT_PROTECTION`, `INTEGRITY_VALIDATION`, `RECOVERY_BEHAVIOR`, and `ARCHIVAL_BEHAVIOR` are all `NOT_APPLICABLE`.

The schema adapter may parse a raw value, but parsing is not persistence or rehydration. TICKET-002 owns dynamic registry/version resolution; PLAT owns physical storage and recovery; neither is designed here.

## 15. Lifecycle Design

`NOT_APPLICABLE` to domain lifecycle. There is no state machine, initial/terminal state, transition, recovery transition, or lifecycle mutation in the ticket.

```text
STATE_SET = NOT_APPLICABLE
INITIAL_STATE = NOT_APPLICABLE
ALLOWED_TRANSITIONS = NOT_APPLICABLE
REJECTED_TRANSITIONS = invalid input returns CONTRACT_INVALID; this is validation failure, not lifecycle transition
MUTATION_AUTHORITY = NONE
REPOSITORY_CONTRACT = NOT_APPLICABLE
ISOLATION_INVARIANT = one validation call cannot expose a partial pair or alter external state
STATE_TRANSITION_TEST = NOT_APPLICABLE
PERSISTENCE_GUARD = NOT_APPLICABLE
BYPASS_PATHS_FORBIDDEN = text fallback, partial validation, schema-unknown acceptance, prototype/.pi authority
```

## 16. Cross-Spec Integration

No foreign capability is required for local execution or local closure. The unit's only explicit producer/consumer record is the ticket-owned `UNIT-EXEC-SCHEMA-HARNESS` from `ACP-EXEC-01` and `PCP-EXEC-01`; it is informational, contract-testable locally, and not a productive foreign producer.

| Foreign Owner | Contract | Local Integration Point | ACL | Forbidden Local Ownership |
| --- | --- | --- | --- | --- |
| `NOT_APPLICABLE` | No external contract is required for AC-EXEC-001/002 local closure | `ValidateExecContract` consumes the ticket-owned schema definition set through `ExecSchemaValidationPort` | NOT_APPLICABLE | Registry/version resolution, DOM identity/lifecycle, persistence/recovery, transport, UI/OPS/BACKEND mapping, and effect confirmation |

### Local producer/consumer proof

```text
CAPABILITY_ID = UNIT-EXEC-SCHEMA-HARNESS
AUTHORITY_OWNER = SPEC-EXEC-001 / EXEC-001
PRODUCER = ticket-owned schema definition and validation boundary
PRODUCED_CONTRACT = identifiable envelope/payload validation result with structured fields
CONSUMER = ValidateExecContract and later EXEC consumers
SEMANTIC_STATUS = DEFINED
LOCAL_TESTABILITY = YES
PRODUCTIVE_AVAILABILITY = NO (fixture is not a producer)
CAPABILITY_SUMMARY_STATUS = CONTRACT_TESTABLE_LOCALLY
AVAILABILITY_EVIDENCE = direct positive/negative schema operations
AVAILABILITY_CONDITION = unit harness executable at local closure
DEPENDENCY_CLASS = INFORMATIONAL
DEPENDENCY_EDGE = local schema contract → EXEC consumers
BLOCKING_EFFECT = NONE
PROOF_EVIDENCE = ticket §14b–§14c; Plan §9 EXEC-IMP-01; component audit §12
```

No anti-corruption mapping is required because no foreign semantic model crosses this boundary. Downstream EXEC registry, failure, and mapping units consume the validated contract without redefining it; their integrated proof remains downstream and outside this ticket.

## 17. Main Interaction Flow

1. A caller submits raw envelope and payload values to `ValidateExecContract`; optional human text is carried only as non-authoritative metadata.
2. The use case obtains the ticket-owned envelope and payload schema definitions and their `SchemaReference` values. Caller-supplied text or arbitrary schema identity cannot replace them.
3. The use case invokes `ExecSchemaValidationPort` once for the envelope and once for the payload.
4. If either result is invalid, unknown, or incomplete, the use case returns one structured `ContractInvalidFailure` with `CONTRACT_INVALID`; it does not construct a validated pair, approval, checkpoint, or effect result.
5. If both results are valid, `StructuredExecutionEnvelope` enforces the required structured minimum fields and `StructuredCapabilityPayload` is constructed.
6. The use case returns one immutable `ValidatedExecContract` containing both schema references and structured values. No persistence, event, transport, lifecycle, or effect call occurs.

## 18. Failure / Recovery Flow

| Failure point | Detection | Durable evidence | Failure owner | Retry owner | Idempotency boundary | Recovery / reconciliation |
| --- | --- | --- | --- | --- | --- | --- |
| Envelope schema missing/unknown/unidentifiable | schema definition/reference and adapter result | NONE; no write | EXEC-001 semantic contract boundary | Caller/operational policy, outside ticket | Side-effect-free validation call | Correct input and revalidate; no partial result |
| Payload schema missing/unknown/unidentifiable | schema definition/reference and adapter result | NONE; no write | EXEC-001 semantic contract boundary | Caller/operational policy, outside ticket | Side-effect-free validation call | Correct input and revalidate; no partial result |
| Malformed envelope or payload | adapter validation result | NONE; no write | EXEC-001 | Caller/operational policy, outside ticket | Side-effect-free validation call | Return `CONTRACT_INVALID`; no approval/checkpoint/effect |
| Missing structured minimum field | domain value construction | NONE; no write | EXEC-001 | Caller/operational policy, outside ticket | Side-effect-free validation call | Return `CONTRACT_INVALID`; text cannot fill the field |
| One side valid and the other invalid | application aggregation boundary | NONE; no write | EXEC-001 | Caller/operational policy, outside ticket | Pair validation is atomic at the result boundary | Discard partial local values; return one failure |
| Text-only input | absence of schema-valid structured values | NONE; no write | EXEC-001 | NONE implicit; corrected structured input required | No effect exists to retry | Reject as `CONTRACT_INVALID` |

```text
CALLER_AS_AUTHORITY_CHECK = PASS
CALLER_SUPPLIED_AUTHORITY_BYPASS = 0
TEMPORAL_AUTHORITY_PROOF = NOT_APPLICABLE
TEMPORAL_AUTHORITY_GAPS = 0
MUTATION_ON_FAILURE = NO
```

Technical adapter exceptions are translated to the canonical validation failure at this boundary; they do not become approval, success, checkpoint confirmation, or a new domain failure family. Durable recovery, retry policy, and effect reconciliation are explicitly outside scope.

## 19. Clean Code Assessment

| Check | Result | Evidence / constraint |
| --- | --- | --- |
| Clear domain naming | PASS | Use `SchemaReference`, `StructuredExecutionEnvelope`, `ValidatedExecContract`, and `ContractInvalidFailure`; avoid generic Manager/Helper/Util names |
| Small cohesive methods | PASS | Separate envelope validation, payload validation, and result construction |
| Explicit side effects | PASS | No side effects; adapter invocation is explicit at the application boundary |
| Explicit mutation boundaries | PASS | Immutable values; no repository or external mutation |
| No boolean parameter explosion | PASS | Use typed input/result objects rather than mode flags |
| No long parameter lists | PASS | Use cohesive input records for envelope/payload/schema definitions |
| No primitive obsession where a domain type exists | PASS | Schema identity and validated contract pair have semantic types |
| No magic values | PASS | `CONTRACT_INVALID` and schema roles are named contract values |
| No generic utility buckets | PASS | Validation behavior stays in the contract boundary |
| No generic service buckets | PASS | `ValidateExecContract` has one specific use-case responsibility |
| No duplicated domain rules | PASS | One required-field and one fail-closed ownership path |
| No deep nesting by design | PASS | Early invalid return and discriminated results |
| No comment-dependent correctness | PASS | Schema/field rules are executable through values and results |
| No hidden temporal coupling | PASS | No external mutable observation/effect sequence |
| No unnecessary mutability | PASS | Returned contract/failure values are immutable |

## 20. Test Design

| Behavior / Invariant | Test Type | Target | Expected Proof |
| --- | --- | --- | --- |
| Both identifiable schemas accept a valid envelope/payload pair | UNIT + DOMAIN_INVARIANT | `tests/exec-001-ticket-001.test.ts` through `ValidateExecContract` | Direct result is a validated structured pair carrying both schema references |
| Invalid schema or text-only input fails closed | NEGATIVE_BEHAVIOR + ARCHITECTURE_CONFORMANCE | same production boundary | Direct `CONTRACT_INVALID`; no validated pair, approval, checkpoint, or effect |
| Minimum structured fields are required | DOMAIN_INVARIANT + NEGATIVE_BEHAVIOR | `StructuredExecutionEnvelope` via production boundary | Complete structured input succeeds; omission fails `CONTRACT_INVALID`; text cannot fill it |
| Envelope and payload validation are both required | UNIT + ISOLATION | application use case with one-side-invalid fixtures | No partial success when either side fails |
| Failure is side-effect free | NEGATIVE_BEHAVIOR | injected no-effect recorder/observable downstream seam | No approval/checkpoint/effect call on invalid result |
| Schema technology is behind the boundary | ARCHITECTURE_CONFORMANCE | executable import/use of the production validation boundary with local adapter | Production contract boundary works without importing prototype or `.pi`; no text fallback path is consumable |
| Validated values remain immutable and structured | DOMAIN_INVARIANT | returned value objects | Caller mutation cannot alter fields or schema references |

### Complete `ACCEPTANCE_WITNESS_MATRIX`

| NORMATIVE_BEHAVIOR | NORMATIVE_VERB | CONCRETE_OPERATION_COMMAND_OR_QUERY | STATE_OR_TRANSITION_AFFECTED | DIRECT_POSITIVE_TEST | DIRECT_NEGATIVE_OR_ISOLATION_TEST | EXPECTED_EVIDENCE_FILE | ACCEPTANCE_OWNER | REQUIRED_PRODUCER_OR_CAPABILITY | AUTHORITY_STATUS | CONTRACT_STATUS | LOCAL_TESTABILITY | PRODUCTIVE_AVAILABILITY | CAPABILITY_SUMMARY_STATUS | DEPENDENCY_CLASS | WITNESS_EXECUTABLE_AT_LOCAL_CLOSURE | EVIDENCE_TYPE |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Envelope and payload are schema-validatable | validate | `C-EXEC-001 / AC-EXEC-001` through `ValidateExecContract.validate` | result contract | valid identifiable envelope/payload pair returns `ValidatedExecContract` | text-only or invalid envelope/payload returns `CONTRACT_INVALID` | `docs/tickets/SPEC-EXEC-001/evidence/TICKET-001/AC-EXEC-001-envelope-schema.md` | EXEC-001-TICKET-001 | `UNIT-EXEC-SCHEMA-HARNESS` | DEFINED | DEFINED | YES | NO | CONTRACT_TESTABLE_LOCALLY | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |
| Minimum structured fields are required | reject | `C-EXEC-002 / AC-EXEC-002` through `ValidateExecContract.validate` | result contract | complete structured fields are accepted | omitted field returns `CONTRACT_INVALID`; no success/effect | `docs/tickets/SPEC-EXEC-001/evidence/TICKET-001/AC-EXEC-002-required-fields.md` | EXEC-001-TICKET-001 | `UNIT-EXEC-SCHEMA-HARNESS` | DEFINED | DEFINED | YES | NO | CONTRACT_TESTABLE_LOCALLY | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |
| Valid input is consumed as a structured contract | consume | schema validation boundary | validated contract result | returned envelope/payload fields are structured and inspectable | human text cannot supply omitted authority | `docs/tickets/SPEC-EXEC-001/evidence/TICKET-001/AC-EXEC-001-structured-consumption.md` | EXEC-001-TICKET-001 | `UNIT-EXEC-SCHEMA-HARNESS` | DEFINED | DEFINED | YES | NO | CONTRACT_TESTABLE_LOCALLY | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |
| Invalid contract fails closed | reject | invalid envelope/payload operation | processing result | valid result remains consumable and no-effect recorder is untouched | invalid result cannot imply approval, checkpoint, or effect | `docs/tickets/SPEC-EXEC-001/evidence/TICKET-001/AC-EXEC-002-fail-closed.md` | EXEC-001-TICKET-001 | `UNIT-EXEC-SCHEMA-HARNESS` | DEFINED | DEFINED | YES | NO | CONTRACT_TESTABLE_LOCALLY | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |

The architecture guard executes the production validation boundary and asserts the non-authoritative input behavior; source inspection alone is not used as the witness. No lifecycle transition or concurrency obligation applies.

```text
DESIGN_TEST_COVERAGE_GATE: PASS
PROXY_ONLY_BEHAVIORS = 0
UNTESTED_STATE_TRANSITIONS = 0
UNPROVEN_CONCURRENCY_CONTRACTS = 0
MISSING_ARCHITECTURE_GUARDS = 0
```

## 21. Structural Risk Assessment

| Risk | Level | Mitigation / rationale |
| --- | --- | --- |
| GOD_COMPONENT_RISK | LOW | Semantic values, application orchestration, and adapter mechanics are separate |
| OVERSIZED_FILE_RISK | LOW | New contract vocabulary is cohesive; do not place registry, persistence, or transport in it |
| RESPONSIBILITY_MIXING_RISK | LOW | Schema definitions, validation, result construction, and orchestration have separate reasons to change |
| EXCESSIVE_DEPENDENCY_RISK | LOW | One narrow schema-validation port and no foreign domain dependency |
| DUPLICATION_RISK | LOW | One schema-definition set and one fail-closed result path |
| TESTABILITY_RISK | LOW | Deterministic local harness is explicitly allowed and all witnesses invoke the production boundary |
| CROSS_SPEC_LEAKAGE_RISK | LOW | No foreign capability is required; downstream consumers only receive structured results |
| ARCHITECTURE_DRIFT_RISK | MEDIUM | First productive EXEC authority could accidentally import prototype or generic delegation; mitigate with executable public-boundary architecture guard and forbidden imports by module ownership |
| ANEMIC_DOMAIN_MODEL_RISK | LOW | Contract values own identity, completeness, immutability, and structured consumption; no aggregate behavior is forced |
| FAT_APPLICATION_SERVICE_RISK | LOW | `ValidateExecContract` only sequences two validations and constructs the result |
| FAT_INTERFACE_RISK | LOW | One cohesive validation port with one semantic operation; no omnibus interface |
| PRIMITIVE_OBSESSION_RISK | LOW | `SchemaReference` and validated contract values represent meaningful concepts |
| DEPENDENCY_INVERSION_RISK | LOW | Domain-facing port isolates schema mechanism |
| INFRASTRUCTURE_LEAKAGE_RISK | LOW | Domain imports no schema library, filesystem, transport, `.pi`, or prototype |
| DOMAIN_RULE_DUPLICATION_RISK | LOW | Required-field and fail-closed rules have one implementation home |
| PREMATURE_ABSTRACTION_RISK | LOW | Port protects the actual schema-mechanics boundary; no hypothetical plugin hierarchy |
| OVERENGINEERING_RISK | LOW | No event bus, generic framework, persistence, registry, or speculative factory |

`ARCHITECTURE_DRIFT_RISK = MEDIUM` is mitigated before readiness by the direct executable architecture-conformance witness. All other risks are LOW; `HIGH_STRUCTURAL_RISKS = 0`.

## 22. Implementation Sequence

1. **Establish the contract vocabulary and schema identity.** Define immutable `SchemaReference`, the two ticket-owned schema definitions, and the structured envelope/payload value boundaries. Immediately test schema identity, valid structured values, and text-only rejection.
2. **Add the schema-validation port and adapter seam.** Keep the chosen schema mechanism behind `ExecSchemaValidationPort`; the adapter translates technical outcomes without defining domain failure meaning. Run isolated valid/invalid adapter contract fixtures.
3. **Implement fail-closed domain result construction.** Construct `ValidatedExecContract` only after both schema validations and minimum-field checks succeed; otherwise return immutable `ContractInvalidFailure`. Test one-side-invalid, missing-field, unknown-schema, and no-mutation behavior.
4. **Add the thin application operation.** `ValidateExecContract` obtains the ticket-owned definitions, invokes both validations, and returns the discriminated result. Test structured consumption, no partial result, and no approval/checkpoint/effect calls.
5. **Add the executable architecture guard.** Invoke the production boundary through the local harness, verify prototype/text cannot supply omitted authority, and verify the production contract path has no dependency on `.pi` or `prototype`. Do not use source inspection as the sole proof.
6. **Run ticket-local regression and evidence generation.** Execute all four direct witness rows, existing repository regression tests that remain applicable, type checking available for the touched production boundary, and produce the four file-addressed evidence records. Stop rather than adding registry, persistence, transport, or downstream mapping behavior.

Each step is locally testable immediately; no later ticket is needed to satisfy this ticket's acceptance or completion evidence.

## 23. Files Expected to Change

| Path / Area | Classification | Reason |
| --- | --- | --- |
| Existing `src/domain` contract area | EXPECTED_CREATE | Add schema identity, immutable structured contract values, and fail-closed result semantics using repository domain conventions |
| Existing `src/application` contract area | EXPECTED_CREATE | Add the thin `ValidateExecContract` operation and port wiring; no transport handler |
| Schema definition assets colocated with the contract boundary | EXPECTED_CREATE | Add identifiable envelope and capability-payload schema definitions; physical representation and exact path remain intentionally unfrozen by the ticket |
| Schema-mechanics adapter boundary | EXPECTED_CREATE | Implement the chosen schema mechanism behind the domain-facing port; exact library/module remains unfrozen |
| `tests/exec-001-ticket-001.test.ts` | EXPECTED_CREATE | Direct positive, negative, no-effect, structured-consumption, immutability, and executable architecture witnesses |
| `docs/tickets/SPEC-EXEC-001/evidence/TICKET-001/*` | EXPECTED_CREATE_AT_COMPLETION | File-addressed completion evidence named by the ticket |
| `src/domain/snapshot.ts`, `src/application/snapshot.ts` | MUST_NOT_MODIFY | DOM snapshot and caller-authority contradiction belong to TICKET-005 / DOM boundary |
| `src/domain/identity.ts`, DOM lifecycle modules | MUST_NOT_MODIFY | Foreign DOM identity/lifecycle authority |
| `.pi/**`, `prototype/**` | MUST_NOT_MODIFY | Non-authoritative consumer/scenario surfaces |
| Registry/version, manifest, persistence, recovery, transport, UI/OPS/BACKEND mapping areas | MUST_NOT_MODIFY | Explicitly excluded by the ticket |
| `docs/specs/**`, ticket/index/audit/remediation/plan artifacts | MUST_NOT_MODIFY | Upstream authority and planning artifacts are frozen during design/implementation |
| Package/tooling configuration | MUST_NOT_MODIFY unless an existing test command demonstrably requires a narrowly local test-discovery adjustment | No scope-authorized tooling redesign; execute the ticket test through the repository's existing Node test convention |

## 24. Open Questions / Blockers

```text
NONE
```

Schema library, physical schema representation, and exact adapter module placement are intentionally unfrozen implementation details, not blockers. If implementation would require registry/version semantics, a DOM identity/lifecycle decision, persistence/recovery semantics, or a new transport/architecture boundary, stop and route the question upstream rather than deciding inside this ticket.

## 25. Design Metrics

```text
RESPONSIBILITIES = 8
DOMAIN_CONCEPTS = 5
AGGREGATE_ROOTS = 0
ENTITIES = 0
VALUE_OBJECTS = 4
DOMAIN_SERVICES = 0
APPLICATION_SERVICES = 1
PORTS = 1
ADAPTERS = 1
ANTI_CORRUPTION_LAYERS = 0
PROPOSED_COMPONENTS = 9
CRITICAL_INVARIANTS = 7
UNPLACED_DOMAIN_INVARIANTS = 0
TEST_SURFACES = 7
UNJUSTIFIED_SOLID_VIOLATIONS = 0
DEPENDENCY_DIRECTION_VIOLATIONS = 0
HIGH_STRUCTURAL_RISKS = 0
HIGH_DDD_RISKS = 0
HIGH_SOLID_RISKS = 0
HIGH_CLEAN_CODE_RISKS = 0
SPEC_IMPLEMENTABILITY_CHECK = PASS
IDENTITY_AUTHORITY_GAPS = 0
RECONSTRUCTION_AUTHORITY_GAPS = 0
LIFECYCLE_AUTHORITY_GAPS = 0
PERSISTENCE_SEMANTICS_GAPS = 0
CROSS_SPEC_AUTHORITY_GAPS = 0
PROHIBITED_NORMATIVE_DECISIONS = 0
AUTHORITY_CONSUMPTION_PROOFS = 1
PRODUCER_CONSUMER_CONTRACT_PROOFS = 1
TEMPORAL_AUTHORITY_PROOFS = 0
TEMPORAL_AUTHORITY_GAPS = 0
CALLER_SUPPLIED_AUTHORITY_BYPASS = 0
ACCEPTANCE_WITNESS_MATRIX_ROWS = 4
DIRECT_BEHAVIOR_WITNESSES = 4
PROXY_ONLY_BEHAVIORS = 0
UNTESTED_STATE_TRANSITIONS = 0
UNPROVEN_CONCURRENCY_CONTRACTS = 0
MISSING_ARCHITECTURE_GUARDS = 0
DESIGN_TEST_COVERAGE_GATE = PASS
```

## 26. Design Gate

```text
IMPLEMENTATION_DESIGN_READY
IMPLEMENTATION_DESIGN_GATE: READY_FOR_IMPLEMENTATION
```
