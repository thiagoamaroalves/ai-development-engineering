# EXEC-001-TICKET-001 — Implementation Design

## 1. Design Verdict

```text
IMPLEMENTATION_DESIGN_READY
```

This refreshed design is based on the current conformant ticket-set audit, the
frozen `EXEC-IMP-01` unit, current SPEC-EXEC-001 revision 5 authority, and the
repository at the pinned design HEAD. It preserves the ticket boundary: schema
identity/selection and fail-closed validation are in scope; registry
resolution, DOM authority, persistence, transport, runtime effects, and
foreign mappings are not.

## 2. Ticket

```text
Ticket ID: EXEC-001-TICKET-001
Ticket path: docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-001-capability-specific-envelope-and-payload-schemas.md
DESIGN_INPUT_TICKET_STATE: READY
TICKET_SET_AUDIT_VERDICT: IMPLEMENTATION_TICKETS_CONFORMANT
TICKET_SET_IMPLEMENTATION_GATE: READY_FOR_IMPLEMENTATION
TICKET_SET_AUDIT_TARGET_HEAD: fcb67adc357e049dca79e16fc1dceb81026f63b1
TICKET_SET_AUDIT_BASIS_FINGERPRINT: HEAD:fcb67adc357e049dca79e16fc1dceb81026f63b1; semanticFingerprint:09d7c5dc3a47f90a60612eb5b31384ad1b73c81b252ec640e15a6b87d683ae57
Implementation Unit: EXEC-IMP-01 — Capability-specific envelope and payload schemas
Portfolio Obligations: O-016 (CANONICAL_OWNER: SPEC-EXEC-001)
Requirements: EXEC-ENVELOPE-001, EXEC-ENVELOPE-002
Gap IDs: GAP-018
Acceptance IDs: AC-EXEC-001, AC-EXEC-002
Final Proof Role: FINAL_PROOF_OWNER and LOCAL_ACCEPTANCE_OWNER for AC-EXEC-001 and AC-EXEC-002
Dependencies: DEPENDS_ON NONE; BLOCKED_BY NONE; UNBLOCKS EXEC-001-TICKET-002, EXEC-001-TICKET-003, EXEC-001-TICKET-007
Cross-SPEC Dependencies: NONE required for local execution or local closure; downstream mappings are integrated-proof-only
Required Tests: direct capability-schema positive/negative, structured-minimum, text-only, provenance, stale, no-effect and architecture-boundary witnesses
Completion Evidence: direct C-EXEC-001/002 witness reports, schema identity/selection evidence, generic-payload rejection, retained regression output and scope/ownership trace
Does Not Implement: DOM identity/lifecycle/snapshot, registry resolution/publication, persistence/recovery, runtime/session, transport, external effects, UI/OPS/BACKEND mapping, or final cross-SPEC conformance
Design input repository HEAD: 8cf79cd37ebb02d0657c1fb191cea1d194b71f89
```

The audit is current for the live repository basis and explicitly selects this
READY ticket. No ticket-set remediation or independent ticket-set re-audit is
pending. The older design's path, authority revisions, and ticket-audit target
are replaced by this artifact; no upstream artifact is changed.

## 3. Implementation Responsibility

Implement the EXEC-owned validation boundary that selects an identifiable
registered schema for the envelope and capability payload, accepts only a
complete structured pair, and returns fail-closed `CONTRACT_INVALID` without
approval, checkpoint, or effect semantics when either schema or required field
is invalid.

## 4. Repository Architecture Context

The repository is a small TypeScript codebase with these actual boundaries:

```text
src/domain          immutable EXEC contract values, schema identity and failure meaning
src/application     thin validation orchestration (`ValidateExecContract`)
src/infrastructure  JSON Schema mechanics (`JsonSchemaExecValidator`)
src/composition     productive adapter wiring
tests               node:test direct witnesses and architecture guards
prototype/.pi       non-authoritative scenario/delegation surfaces; forbidden production dependencies
```

The existing schema adapter already isolates TypeBox/JSON Schema mechanics from
EXEC semantic values. This design extends that seam rather than introducing a
new layered architecture, persistence layer, event bus, transport handler, or
registry implementation.

The ticket-owned schema authority is an immutable set of identifiable schema
definitions used for this contract operation. Selection is limited to that
set and its capability/schema identity relationship. Dynamic registry
registration, versioned catalog resolution, source publication, and catalog
persistence remain later EXEC units and are not introduced here.

## 5. Existing Repository Context

| Existing Component | Classification | Current Responsibility | Design Use |
| --- | --- | --- | --- |
| `src/domain/exec-contract.ts` (`SchemaReference`, structured values, failure result) | REUSE / EXTEND | Immutable schema references, authenticated construction, structured envelope/payload and `CONTRACT_INVALID` | Preserve brands, identity checks, immutability and no-success/no-effect failure fields; extend payload association only where required for selected schema identity |
| `src/domain/exec-schema.ts` (`ExecContractSchemaDefinitions`) | EXTEND | Canonical envelope and one generic capability-payload schema | Retain envelope/minimum fields; replace the generic payload acceptance path with an immutable identifiable capability-schema set and selection operation |
| `src/application/exec-contract.ts` (`ValidateExecContract`) | EXTEND | Authenticated envelope/payload validation and pair construction | Orchestrate canonical schema selection, two validations, complete-pair construction and fail-closed aggregation; do not own schema-engine rules |
| `src/infrastructure/exec-schema-validator.ts` | REUSE / MINIMAL EXTEND | Compile and execute the selected JSON Schema definition; issue authenticated validation evidence | Validate whichever ticket-owned definition is selected; preserve input identity, content fingerprint and stale-mutation rejection |
| `src/domain/exec-validation-evidence-internal.ts` and `AuthenticatedExecSchemaValidationPort` | REUSE | Non-caller-mintable validation evidence boundary | Preserve producer-issued result branding and consumer verification; no public registration or caller authority escape |
| `src/composition/exec-contract.ts` | EXTEND only if wiring is needed | Wires the productive validator into the application operation | Supply the ticket-owned immutable schema authority without exposing a caller-selected schema source |
| `tests/exec-001-ticket-001.test.ts` | EXTEND | Existing generic-schema, provenance, fail-closed, immutability and import-graph witnesses | Add direct capability-specific selection/rejection, schema-identity mismatch, missing-field/text-only and no-effect witnesses while retaining current regressions |
| `src/domain/exec-registry.ts`, `src/application/exec-registry.ts` | DO_NOT_TOUCH | Future registry semantics and source-bound catalog behavior | No dynamic registry resolution or catalog mutation is needed for this ticket |
| `src/application/snapshot.ts`, `src/domain/snapshot.ts` | DO_NOT_TOUCH | DOM-owned exact snapshot path; current caller-basis gap belongs elsewhere | No DOM identity, lifecycle, snapshot, or caller-basis decision is made here |
| `prototype/**`, `.pi/**` | DO_NOT_TOUCH | Non-authoritative scenario/delegation surfaces | Never import, parse as authority, or use as a schema source |

## 6. Domain Model Assessment

### Domain concepts

- **Schema reference:** immutable `SchemaId` plus semantic schema version. It is
  a contract identity, not a DOM identity, capability registry entry, or
  persistence revision.
- **Envelope contract:** immutable structured execution envelope with the
  minimum fields required by `EXEC-ENVELOPE-002`.
- **Capability payload contract:** immutable payload tied to the selected
  capability-specific schema reference and carrying structured data.
- **Validated EXEC contract:** immutable pair of one validated envelope and one
  validated capability payload.
- **Contract-invalid failure:** structured `CONTRACT_INVALID` result that
  carries expected/observed references and explicitly forbids approval,
  checkpoint, and effect interpretation.

### Aggregates, entities, values, services, and boundaries

- Aggregate roots/entities: `NOT_APPLICABLE`. The operation creates no mutable
  aggregate, entity lifecycle, or persisted later state.
- Value objects: existing `SchemaReference`, `StructuredExecutionEnvelope`,
  `StructuredCapabilityPayload`, and `ValidatedExecContract` remain justified
  by identity, validation, immutability, and complete-pair semantics.
- Domain service/policy: `NOT_APPLICABLE`. Schema selection is a bounded
  contract-authority operation, not cross-aggregate business behavior.
- Application use case: existing `ValidateExecContract`, kept thin; it
  coordinates selection, validation and construction but owns no schema rule.
- Repository abstraction: `NOT_APPLICABLE`; no durable state is loaded or
  stored.
- Domain event: `NOT_APPLICABLE`; validation emits a synchronous result only.
- Anti-corruption layer: `NOT_APPLICABLE`; no foreign semantic model crosses
  this ticket boundary. The infrastructure adapter is technical translation,
  not a foreign-domain mapper.

```text
ANEMIC_DOMAIN_MODEL_RISK = LOW
FAT_APPLICATION_SERVICE_RISK = LOW
```

Meaningful behavior remains in schema/value boundaries: schema identity,
required structured fields, complete-pair construction, immutability, and
fail-closed result meaning.

## 7. UPSTREAM_AUTHORITY_PRECONDITIONS

These records cite authority; they do not add missing authority or redefine
foreign semantics.

| Concern | Proof / authority and revision | Applicability | Design consequence |
| --- | --- | --- | --- |
| Identity | `SPEC-EXEC-001` rev5 §12.3; component audit §17: `AGGREGATE_IDENTITY_PROOF = COMPLETE`; DOM `DOM-ID-001` rev4 is conformant | No Aggregate Root or canonical DOM identity is created by this ticket | `SchemaReference` is only an EXEC contract identity. Do not create `ExecutionId`, `ActivityId`, `AttemptId`, registry-entry, manifest, or DOM identity here |
| Lifecycle | `SPEC-EXEC-001` rev5 §13 (`EXEC-ENVELOPE-001/002` and fail-closed requirements); component audit §19: lifecycle complete; DOM `DOM-LIFE-001`/`DOM-CMD-001` rev4 | No lifecycle transition occurs | Invalid input returns a result and cannot approve, checkpoint, resume, or advance DOM |
| Persistence/recovery | `SPEC-EXEC-001` rev5 §§12.4, 13, 16–18; component audit §20; ADR-0006 rev3 | Not applicable: no durable record or external effect | No repository, storage, journal, restart, CAS, recovery, or replay code is designed |
| Rehydration | `SPEC-EXEC-001` rev5 §12.4; component audit §18: `AGGREGATE_RECONSTRUCTION_PROOF = COMPLETE` | Not applicable: raw input is validated, not persisted state | Do not add `rehydrate`/`fromPersisted` behavior or treat schema-valid input as reconstructed domain state |
| Concurrency | `SPEC-EXEC-001` rev5 §§12.1, 13; component audit §19; registry concurrency belongs to `EXEC-REGISTRY-001` and later units | Not applicable: no mutable shared state or mutation command | No CAS, expected revision, one-successor, overlap publication, or concurrent mutation semantics are added |
| Idempotency | ADR-0006 rev3; `SPEC-EXEC-001` rev5 §12.1 and registry requirements | Not applicable to external effects; validation is side-effect free | Repeated validation has no external effect, but effect idempotency remains PLAT-owned and out of scope |
| Ownership | ADR-0003 rev3; portfolio rev2 O-016; SPEC-EXEC-001 rev5 §§2, 9, 13 | Complete | EXEC-001 owns schema contract identity, selection, structured validation result, and minimum fields; DOM, registry publication, PLAT, runtime and mappings remain foreign |
| Cross-SPEC dependencies | Approved normative edge `SPEC-EXEC-001 → SPEC-DOM-001`; ticket §13–§14b and Plan §9 `EXEC-IMP-01` | No foreign capability is required for local execution or closure | Opaque DOM IDs remain data; no DOM resolver is called. Downstream consumers receive the contract only after local validation |

```text
SPEC_IMPLEMENTABILITY_CHECK = PASS
SPEC_IMPLEMENTABILITY_REVISION = SPEC-EXEC-001 revision 5; component audit PASS — COMPONENT_SPEC_CONFORMANT; Plan audit IMPLEMENTATION_PLAN_CONFORMANT
IDENTITY_AUTHORITY_GAPS = 0 applicable; no ticket aggregate
RECONSTRUCTION_AUTHORITY_GAPS = 0 applicable; no ticket persisted state
LIFECYCLE_AUTHORITY_GAPS = 0 applicable; no ticket transition
PERSISTENCE_SEMANTICS_GAPS = 0 applicable; no ticket persistence
CROSS_SPEC_AUTHORITY_GAPS = 0 for local closure; DOM is not consumed by this unit
PROHIBITED_NORMATIVE_DECISIONS = 0
```

### Authority consumption and producer/consumer proof

The only capability record used by this locally closed unit is the ticket-owned
schema contract. It is not a foreign productive producer and is intentionally
not promoted from a local harness to productive availability.

```text
CAPABILITY_ID = EXEC-SCHEMA-CAPABILITY-PAYLOAD
AUTHORITY_EXISTENCE = O-016 / EXEC-ENVELOPE-001 and EXEC-ENVELOPE-002 in SPEC-EXEC-001 revision 5
TRUTH_OWNER = SPEC-EXEC-001 / EXEC-001
AUTHORITY_SEMANTIC_SOURCE = identifiable envelope and capability-payload schema contract
OWNER_DOMAIN_OR_BOUNDED_CONTEXT = EXEC-001
CONSUMPTION_CONTRACT = ValidateExecContract consumes the ticket-owned immutable schema definition set
PORT_INTERFACE_QUERY_RESOLVER_OR_READER = ExecSchemaDefinition selection boundary; ExecSchemaValidationPort validates the selected definition
CONTRACT_PRODUCER = ticket-owned EXEC schema authority/definition set
CONTRACT_CONSUMER = ValidateExecContract and its structured domain values
RETURNED_DATA = selected schema reference, capability association, validation result, validated input and content fingerprint
VERSION_REVISION_TRANSPORT = SchemaReference carries SchemaId and semantic schema version; registry/catalog revision is not selected here
FAILURE_NOT_FOUND_STALE_SEMANTICS = absent/unknown/mismatched capability schema, invalid payload, stale input or malformed evidence returns CONTRACT_INVALID; no partial pair
AUTHORITY_STATUS = DEFINED
CONTRACT_STATUS = DEFINED
SEMANTIC_STATUS = DEFINED
LOCAL_TESTABILITY = YES
PRODUCTIVE_AVAILABILITY = NO for the fixture/harness record; it is not a foreign producer
CAPABILITY_SUMMARY_STATUS = CONTRACT_TESTABLE_LOCALLY
DEPENDENCY_CLASS = INFORMATIONAL
AVAILABILITY_EVIDENCE = direct C-EXEC-001/C-EXEC-002 schema operations through ValidateExecContract
AVAILABILITY_CONDITION = local contract harness executes at ticket closure
BLOCKING_EFFECT = NONE
DEPENDENCY_EDGE = unit-owned schema authority → contract validator
PROOF_EVIDENCE = ticket §14a–§14c; Plan §9 EXEC-IMP-01; component SPEC audit §§12, 17–18
RESULT = CONTRACT_TESTABLE_LOCALLY; bounded local semantic contract is complete, with no productive foreign availability claim
```

### Authority provenance / anti-forgery record

```text
PROOF_ISSUER_OWNER = SPEC-EXEC-001 / EXEC-001 schema contract boundary
PROOF_SCOPE = exact selected envelope or capability-payload schema definition and the exact input validated against it
PROOF_IDENTITY_OR_BRAND = canonical SchemaReference object identity plus authenticated producer-issued validation result; existing internal evidence brand is retained
CONSUMER_VERIFICATION_RULE = ValidateExecContract requires the authenticated port and producer-issued result, exact selected schema reference/definition identity, exact validated input identity, and matching content fingerprint before constructing values
STALE_OR_MUTATION_POLICY = a changed input, changed required own field, detached definition, copied result, or stale receipt is rejected as CONTRACT_INVALID; no validated value is constructed
FORGERY_NEGATIVE_TEST = direct forged-result, copied-adapter, custom-definition, runtime-reference and always-true-adapter tests in tests/exec-001-ticket-001.test.ts, retained and extended for selected capability schemas
CALLER_INJECTION_NEGATIVE_TEST = direct caller-selected schema identity/text-only/generic-but-capability-invalid input test through ValidateExecContract; no caller schema source is accepted
ALTERNATE_ADAPTER_CONTRACT_TEST = authenticated independent adapter contract test is retained; an adapter that cannot issue the authenticated result is rejected
ISSUER_IS_AUTHORIZED = YES; only the ticket-owned schema boundary/AuthenticatedExecSchemaValidationPort can issue consumable evidence
PROOF_SCOPE_IS_EXACT = YES
CONSUMER_VERIFIES_PROVENANCE = YES
INPUT_OR_REFERENCE_BINDING = YES
MUTATION_OR_STALE_REJECTION = YES
FORGERY_PATH_REJECTED = YES
CALLER_INJECTION_REJECTED = YES
ALTERNATE_ADAPTER_CONTRACT = PASS for the existing explicit producer contract
```

`TEMPORAL_AUTHORITY_PROOF = NOT_APPLICABLE`: the operation validates
immutable ticket-owned definitions and commits no effect. Input mutation between
validation and value construction is nevertheless rejected by the existing
content-fingerprint/current-input checks; this is provenance/staleness
protection, not mutable external authority revalidation.

## 8. Aggregate / Consistency Boundaries

| Aggregate | Root | Invariants | Transaction / Consistency Boundary | External References |
| --- | --- | --- | --- | --- |
| None | NOT_APPLICABLE | No mutable aggregate; a call returns either one complete validated pair or one structured failure | One synchronous, side-effect-free validation result; no persistence transaction | Opaque execution/activity/capability IDs remain payload fields and are not resolved or owned |

The pair boundary is atomic at the result surface: if envelope or payload
validation fails, no partial validated contract is exposed.

## 9. Responsibility Decomposition

| Responsibility | Authority | State Owned | Expected Test Surface |
| --- | --- | --- | --- |
| Own identifiable envelope schema definition | O-016; `EXEC-ENVELOPE-001/002` | Immutable envelope schema reference/document | complete envelope accepted; envelope identity mismatch rejected |
| Own capability-specific schema definitions and selection | O-016; `EXEC-ENVELOPE-001` | Immutable ticket-owned set of capability/schema references and documents | valid registered capability selected; unknown/mismatched/generic-invalid payload rejected |
| Validate selected envelope schema | `EXEC-ENVELOPE-001/002` | No mutable state; authenticated result only | direct positive and malformed/missing-field negatives |
| Validate selected capability payload schema | `EXEC-ENVELOPE-001` | No mutable state; authenticated result only | direct capability-specific positive/negative witnesses |
| Construct immutable structured values | `EXEC-ENVELOPE-002` | `StructuredExecutionEnvelope`, `StructuredCapabilityPayload`, complete pair | required-field, structured-data, identity and immutability tests |
| Orchestrate complete pair validation | ticket `EXEC-IMP-01`; AC-EXEC-001/002 | No durable state; discriminated result only | one-side-invalid/no-partial-result/no-effect tests |
| Preserve canonical failure meaning and authority provenance | `EXEC-CONTRACT-001` boundary and ticket constraints | `CONTRACT_INVALID` evidence and no-success flags | forged, caller-injected, stale, malformed-result and no-approval/checkpoint/effect tests |
| Keep schema mechanics outside semantic values | repository adapter convention; ticket constraint | Adapter-local compiled validators | independent adapter and architecture/import-graph guard |

```text
RESPONSIBILITY_MIXING_RISK = LOW
```

No component owns schema decisions, application orchestration, persistence,
foreign integration, recovery, and presentation together.

## 10. Proposed Components

| Component | Type | Responsibility | Existing/New | Expected Location | Size |
| --- | --- | --- | --- | --- | --- |
| `SchemaReference` | VALUE_OBJECT | Identify and compare a schema by `SchemaId` and semantic version | Existing, reuse | `src/domain/exec-contract.ts` | SMALL |
| `ExecContractSchemaDefinitions` | OTHER | Hold immutable envelope and capability-specific identifiable schema definitions and perform bounded selection | Existing, extend | `src/domain/exec-schema.ts` | MEDIUM |
| `StructuredExecutionEnvelope` | VALUE_OBJECT | Enforce complete structured envelope fields after authenticated schema validation | Existing, reuse | `src/domain/exec-contract.ts` | MEDIUM |
| `StructuredCapabilityPayload` | VALUE_OBJECT | Enforce selected schema identity and structured capability data after authenticated validation | Existing, extend | `src/domain/exec-contract.ts` | SMALL |
| `ValidatedExecContract` | VALUE_OBJECT | Pair the complete immutable envelope and payload | Existing, reuse | `src/domain/exec-contract.ts` | SMALL |
| `ExecSchemaValidationPort` / authenticated evidence boundary | PORT | Abstract schema mechanics while preserving issuer-bound validation evidence | Existing, reuse | `src/domain/exec-schema.ts` and internal evidence module | SMALL |
| `ValidateExecContract` | APPLICATION_SERVICE | Select canonical definitions, invoke both validations, construct complete result or failure | Existing, extend | `src/application/exec-contract.ts` | SMALL |
| `JsonSchemaExecValidator` | ADAPTER | Translate the existing JSON Schema engine result into authenticated port evidence | Existing, reuse/minimal extend | `src/infrastructure/exec-schema-validator.ts` | SMALL |
| Ticket direct witness suite | TEST_SUPPORT | Execute positive, negative, provenance, stale, no-effect and architecture-boundary tests | Existing, extend | `tests/exec-001-ticket-001.test.ts` | MEDIUM |

### Component ownership rules

- `SchemaReference` **OWNS** schema identity comparison. It collaborates with
  the canonical definitions and validated values. It **MUST_NOT_OWN** registry
  lookup, capability lifecycle, DOM identity, persistence, or semver
  compatibility policy beyond validating its own version shape.
- `ExecContractSchemaDefinitions` **OWNS** the immutable ticket-local schema
  definition set and bounded capability-to-schema selection. It collaborates
  with `SchemaReference`, `ValidateExecContract`, and the validation port. It
  **MUST_NOT_OWN** dynamic registry mutation, catalog revisions, source
  publication, DOM resolution, persistence, or transport.
- `StructuredExecutionEnvelope` **OWNS** structured minimum-field validation
  and immutable access. It collaborates with authenticated validation evidence.
  It **MUST_NOT_OWN** text interpretation, lifecycle, or registry behavior.
- `StructuredCapabilityPayload` **OWNS** selected schema association and
  structured payload value integrity. It **MUST_NOT_OWN** capability lookup,
  capability execution, or external effects.
- `ValidatedExecContract` **OWNS** complete-pair composition only. It
  **MUST_NOT_OWN** approval, checkpoint, event, persistence, or effect meaning.
- `ExecSchemaValidationPort` **OWNS** the inward schema-mechanics capability
  boundary and evidence protocol. It **MUST_NOT_OWN** EXEC semantic failure
  ownership or domain lifecycle.
- `ValidateExecContract` **OWNS** operation sequencing, all-or-nothing result
  exposure, and failure aggregation. It **MUST_NOT_OWN** schema rules,
  registry publication, retries, persistence, transport, or approval.
- `JsonSchemaExecValidator` **OWNS** adapter translation and authenticated
  receipt issuance. It **MUST_NOT_OWN** schema identity authority, capability
  registration, or domain meaning.
- Tests **OWNS** executable evidence only and **MUST_NOT_OWN** production
  authority or a substitute implementation.

## 11. SOLID Assessment

| Component | SRP | OCP | LSP | ISP | DIP | Result |
| --- | --- | --- | --- | --- | --- | --- |
| `SchemaReference` | PASS | NOT_APPLICABLE | NOT_APPLICABLE | NOT_APPLICABLE | PASS | PASS |
| `ExecContractSchemaDefinitions` | PASS — definition/selection boundary only | PASS — supports the real schema-definition variation without a strategy hierarchy | NOT_APPLICABLE | PASS | PASS | PASS |
| Structured contract values | PASS | NOT_APPLICABLE | NOT_APPLICABLE | NOT_APPLICABLE | PASS | PASS |
| `ExecSchemaValidationPort` | PASS | PASS — actual schema-engine boundary | NOT_APPLICABLE | PASS — one cohesive validation operation | PASS | PASS |
| `ValidateExecContract` | PASS — orchestration only | PASS — depends on the existing port, not hypothetical plugins | NOT_APPLICABLE | PASS | PASS | PASS |
| `JsonSchemaExecValidator` | PASS — adapter mechanics only | PASS | NOT_APPLICABLE | PASS | PASS | PASS |

```text
SRP_VIOLATIONS = 0
OCP_VIOLATIONS = 0
LSP_VIOLATIONS = 0
ISP_VIOLATIONS = 0
DIP_VIOLATIONS = 0
UNJUSTIFIED_SOLID_VIOLATIONS = 0
```

No inheritance hierarchy, factory, strategy family, generic service, or
one-method ceremonial abstraction is proposed.

## 12. Dependency Direction

```text
EXEC semantic values and failure result
        ↑ consumed by
ValidateExecContract application operation
        ↑ depends on
ExecSchemaValidationPort and canonical schema-definition boundary
        ↑ implemented by
JsonSchemaExecValidator / authenticated local adapter

Tests invoke the productive composition/application boundary.
No production path imports prototype, .pi, transport, filesystem, DOM, registry persistence, or external effects.
```

```text
DEPENDENCY_DIRECTION_VIOLATIONS = 0
INFRASTRUCTURE_LEAKAGE_POINTS = 0
```

The application depends on the stable schema-mechanics port; the infrastructure
adapter depends inward. Schema-library details do not enter domain values.

## 13. Invariant Placement

| Invariant | Domain Enforcement | Durable Protection | Application Guard | Test |
| --- | --- | --- | --- | --- |
| Envelope uses the canonical identifiable schema | Canonical definition/reference identity | NOT_APPLICABLE | Validator receives only ticket-owned definition | valid envelope and copied/custom schema rejection |
| Payload schema is capability-specific and identifiable | Immutable capability schema set and selected `SchemaReference` | NOT_APPLICABLE | Selection requires capability association and matching schema identity; no generic fallback | valid selected payload and generic-but-capability-invalid rejection |
| Both sides validate before consumption | `ValidatedExecContract` accepts only authenticated validated values | NOT_APPLICABLE | `ValidateExecContract` exposes no partial success | one-side-invalid/no-partial-result test |
| Minimum structured fields are present | Structured value constructors plus schema required fields | NOT_APPLICABLE | Success construction occurs only after validation | missing fields and text-only rejection |
| Text is non-authoritative | Values are constructed only from structured validated fields | NOT_APPLICABLE | `humanText` is never consulted to fill fields | text-only and omitted-field tests |
| Invalid input is `CONTRACT_INVALID` | `ContractInvalidFailure` | NOT_APPLICABLE | Invalid branch forbids approval/checkpoint/effect result | code and no-success/no-effect assertions |
| Authority evidence cannot be forged or made stale | Authenticated port/result identity, exact input and fingerprint checks | NOT_APPLICABLE | Consumer verification before value construction | forged/caller-injection/stale/mutation/alternate-adapter tests |
| No prototype or second authority path is consumable | Production import and definition boundary | NOT_APPLICABLE | No fallback source | executable import-graph and public-boundary guard |

```text
UNPLACED_DOMAIN_INVARIANTS = 0
```

## 14. Persistence Design

`NOT_APPLICABLE`. This ticket validates an in-memory input contract and creates
no aggregate snapshot, registry entry, catalog revision, manifest, journal,
outbox, durable revision, index, recovery record, or archive.

```text
AGGREGATE_STORAGE_BOUNDARY = NOT_APPLICABLE
SERIALIZATION_BOUNDARY = NOT_APPLICABLE; schema validation is not persistence
CONCURRENCY_REVISION_MECHANISM = NOT_APPLICABLE
ATOMICITY_BOUNDARY = one side-effect-free validation result
REGISTRY_INDEX_RELATIONSHIP = NOT_APPLICABLE
DURABLE_INVARIANT_PROTECTION = NOT_APPLICABLE
INTEGRITY_VALIDATION = adapter/schema input integrity only; no durable integrity claim
RECOVERY_BEHAVIOR = NOT_APPLICABLE
ARCHIVAL_BEHAVIOR = NOT_APPLICABLE
```

TICKET-002 owns dynamic registry/version selection; PLAT owns physical
persistence and recovery. Neither is pulled into this design.

## 15. Lifecycle Design

`NOT_APPLICABLE` to domain lifecycle. Validation is not a state transition.

```text
STATE_SET = NOT_APPLICABLE
INITIAL_STATE = NOT_APPLICABLE
ALLOWED_TRANSITIONS = NOT_APPLICABLE
REJECTED_TRANSITIONS = invalid input returns CONTRACT_INVALID; this is not a lifecycle transition
TRANSITION_OWNER = NONE
INVALID_TRANSITIONS = NOT_APPLICABLE
RECOVERY_TRANSITIONS = NOT_APPLICABLE
TERMINAL_TRANSITIONS = NOT_APPLICABLE
MUTATION_AUTHORITY = NONE
REPOSITORY_CONTRACT = NOT_APPLICABLE
ISOLATION_INVARIANT = one call cannot expose a partial pair or alter external state
STATE_TRANSITION_TEST = NOT_APPLICABLE
PERSISTENCE_GUARD = NOT_APPLICABLE
BYPASS_PATHS_FORBIDDEN = generic payload fallback, text fallback, caller schema source, custom-definition substitution, prototype/.pi authority
```

## 16. Cross-Spec Integration

No foreign capability is required for local execution or local closure. The
approved `SPEC-EXEC-001 → SPEC-DOM-001` edge remains authority context, but
this unit does not resolve or mutate DOM identities, lifecycle, snapshots, or
verdicts.

| Foreign Owner | Contract | Local Integration Point | ACL | Forbidden Local Ownership |
| --- | --- | --- | --- | --- |
| `NOT_APPLICABLE for local closure` | No foreign producer is consumed by AC-EXEC-001/002; opaque DOM references remain payload data | `ValidateExecContract` and the ticket-owned schema-definition boundary | NOT_APPLICABLE | DOM identity/lifecycle/snapshot, registry publication/resolution, PLAT persistence/recovery, transport, runtime effects and downstream mappings |

### Unit-owned producer/consumer proof

```text
AUTHORITY_CONSUMPTION_PROOF = the complete EXEC-SCHEMA-CAPABILITY-PAYLOAD record in §7
PRODUCER_CONSUMER_CONTRACT_PROOF = the complete EXEC-SCHEMA-CAPABILITY-PAYLOAD record in §7
FOREIGN_PRODUCER_REQUIRED_FOR_LOCAL_EXECUTION = NO
FOREIGN_PRODUCER_REQUIRED_FOR_LOCAL_CLOSURE = NO
PRODUCTIVE_AVAILABILITY_PROMOTION = NONE; local fixture/harness remains PRODUCTIVE_AVAILABILITY=NO
```

The validation adapter translates schema-engine output only. It does not
consume or mint DOM, registry, persistence, approval, or effect authority.

## 17. Main Interaction Flow

1. The caller supplies raw envelope/payload values and optional human text to
   `ValidateExecContract`; text is retained only as non-authoritative input.
2. The application obtains the immutable ticket-owned envelope and
   capability-schema definitions. Caller-supplied schema IDs/documents cannot
   replace them.
3. Selection binds the payload capability association to one identifiable
   ticket-owned schema reference. Unknown, absent, or mismatched selection is
   invalid; no generic payload fallback is used.
4. `ValidateExecContract` invokes `ExecSchemaValidationPort` for the envelope
   and selected capability payload.
5. The consumer verifies authenticated producer evidence, exact schema/input
   binding, and current content. If either side fails, it returns one
   `CONTRACT_INVALID` failure with no partial validated pair.
6. If both pass, structured value constructors enforce required fields and
   immutable structured data, then `ValidatedExecContract` returns the pair.
7. No registry mutation, lifecycle transition, persistence, event, transport,
   approval, checkpoint confirmation, or external effect occurs.

## 18. Failure / Recovery Flow

| Failure point | Detection | Durable evidence | Failure owner | Retry owner | Idempotency boundary | Recovery / reconciliation |
| --- | --- | --- | --- | --- | --- | --- |
| Missing/unknown capability-specific schema | Immutable definition selection cannot produce a matching identifiable definition | NONE | EXEC-001 | Caller/outer workflow, outside ticket | No external effect; repeat validation is side-effect free | Correct structured input/registered contract and validate again |
| Generic payload is structurally valid but capability-invalid | Selected capability schema rejects the payload | NONE | EXEC-001 | Caller/outer workflow | No external effect | Return `CONTRACT_INVALID`; never consume generic data |
| Envelope or payload schema identity mismatch | Required schema ID/version does not equal selected canonical reference | NONE | EXEC-001 | Caller/outer workflow | No external effect | Return `CONTRACT_INVALID`; no fallback or conversion |
| Missing structured minimum field or text-only input | Schema/value boundary detects absent own field or non-object input | NONE | EXEC-001 | Caller/outer workflow | No external effect | Return `CONTRACT_INVALID`; human text cannot fill fields |
| Forged/caller-injected validation result or custom definition | Authenticated port/evidence identity, exact object/reference and fingerprint checks | NONE | EXEC-001 | Caller/adapter owner | No external effect | Reject without constructing a validated value |
| Input mutates after a genuine validation receipt | Current schema check/content fingerprint/own-field check fails | NONE | EXEC-001 | Caller/outer workflow | No external effect | Return `CONTRACT_INVALID`; preserve no partial value |
| Adapter throws or returns malformed result | Result normalization and safe error handling | NONE | EXEC-001 contract boundary | Caller/adapter owner | No external effect | Normalize to `CONTRACT_INVALID`; technical exception gains no domain approval meaning |

```text
CALLER_AS_AUTHORITY_CHECK = PASS
CALLER_SUPPLIED_AUTHORITY_BYPASS = 0
TEMPORAL_AUTHORITY_PROOF = NOT_APPLICABLE
TEMPORAL_AUTHORITY_GAPS = 0
MUTATION_ON_FAILURE = NO
TERMINAL_FAILURE_RULE = invalid input cannot be converted to valid/approval/checkpoint/effect result
```

## 19. Clean Code Assessment

| Check | Result | Evidence / constraint |
| --- | --- | --- |
| Clear domain naming | PASS | Use schema, envelope, capability payload, validated contract, and contract-invalid vocabulary |
| Small cohesive methods | PASS | Separate definition selection, validation, construction, normalization and failure aggregation |
| Explicit side effects | PASS | There are no side effects; adapter calls are explicit |
| Explicit mutation boundaries | PASS | Immutable definitions, values and results; no repository mutation |
| No boolean parameter explosion | PASS | Typed inputs/results; no mode flags |
| No long parameter lists | PASS | Existing input records and schema definitions carry cohesive data |
| No primitive obsession where domain type exists | PASS | `SchemaReference` and validated values remain semantic types |
| No magic values | PASS | Named schema identities, references and `CONTRACT_INVALID` |
| No generic utility buckets | PASS | Rules remain with schema/value/result boundaries |
| No generic service buckets | PASS | `ValidateExecContract` is a specific application operation |
| No duplicated domain rules | PASS | One selection rule, one required-field boundary, one provenance check |
| No deep nesting by design | PASS | Early invalid results and discriminated outcomes |
| No comment-dependent correctness | PASS | Schema identity and validation are executable |
| No hidden temporal coupling | PASS | No mutable external observation/effect sequence; stale input is explicit |
| No unnecessary mutability | PASS | Deep-frozen definitions and returned values |

## 20. Test Design

| Behavior / Invariant | Test Type | Target | Expected Proof |
| --- | --- | --- | --- |
| Valid envelope and capability-specific payload select identifiable schemas and pass | UNIT + DOMAIN_INVARIANT | `tests/exec-001-ticket-001.test.ts` through `ValidateExecContract` | `VALID` result contains structured envelope/payload with the selected canonical references; generic schema is not selected |
| Generic-but-capability-invalid payload is rejected | NEGATIVE_BEHAVIOR + ISOLATION | same production operation with a structurally generic payload violating the selected capability schema | `INVALID` with `CONTRACT_INVALID`; no partial value, approval, checkpoint or effect |
| Complete structured minimum fields are required | DOMAIN_INVARIANT + NEGATIVE_BEHAVIOR | same production operation | complete pair succeeds; omitted field fails directly with `CONTRACT_INVALID` |
| Text-only authority is rejected | NEGATIVE_BEHAVIOR | same production operation with human text and absent structured fields | `CONTRACT_INVALID`; text does not supply schema, identity, verdict, approval, checkpoint or effect |
| Schema identity/selection cannot be caller-forged | ARCHITECTURE_CONFORMANCE + NEGATIVE_BEHAVIOR | custom definition, caller schema IDs, copied reference and forged adapter evidence | production boundary rejects the input/evidence; no success result |
| Validation evidence is issuer-bound and stale input is rejected | PROVENANCE + STALE_PROTECTION | existing authenticated adapter, independent adapter, mutation and forged-result cases | direct positive/negative evidence for issuer, scope, binding, stale rejection and alternate-adapter contract |
| Production graph does not import prototype/.pi or schema authority from transport | ARCHITECTURE_CONFORMANCE | existing executable import-graph guard rooted at `src/composition/exec-contract.ts` | forbidden imports are rejected; productive boundary remains the sole semantic path |
| Returned contract/failure values are immutable and side-effect free | DOMAIN_INVARIANT + NEGATIVE_BEHAVIOR | result values and no-effect recorder | mutation cannot alter returned fields; invalid path records no approval/checkpoint/effect |

### Complete `ACCEPTANCE_WITNESS_MATRIX`

| NORMATIVE_BEHAVIOR | NORMATIVE_VERB | CONCRETE_OPERATION_COMMAND_OR_QUERY | STATE_OR_TRANSITION_AFFECTED | DIRECT_POSITIVE_TEST | DIRECT_NEGATIVE_OR_ISOLATION_TEST | EXPECTED_EVIDENCE_FILE | ACCEPTANCE_OWNER | REQUIRED_PRODUCER_OR_CAPABILITY | AUTHORITY_STATUS | CONTRACT_STATUS | LOCAL_TESTABILITY | PRODUCTIVE_AVAILABILITY | CAPABILITY_SUMMARY_STATUS | DEPENDENCY_CLASS | WITNESS_EXECUTABLE_AT_LOCAL_CLOSURE | EVIDENCE_TYPE |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Capability-specific envelope/payload schema selection and validation | validate | `C-EXEC-001 / AC-EXEC-001` via `ValidateExecContract.validate` | result contract | valid envelope plus payload for an identifiable registered capability returns a complete structured contract | structurally generic but capability-invalid payload, unknown/mismatched schema, or caller-selected schema returns `CONTRACT_INVALID` | `docs/tickets/SPEC-EXEC-001/evidence/TICKET-001/AC-EXEC-001-envelope-schema.md` | EXEC-001-TICKET-001 | `EXEC-SCHEMA-CAPABILITY-PAYLOAD` unit-owned schema authority | DEFINED | DEFINED | YES | NO for fixture/harness; no foreign producer | CONTRACT_TESTABLE_LOCALLY | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |
| Structured envelope minimum and text non-authority | reject | `C-EXEC-002 / AC-EXEC-002` via `ValidateExecContract.validate` | result contract | complete structured minimum fields are accepted | missing field or text-only input returns `CONTRACT_INVALID` and cannot imply approval, checkpoint, or effect | `docs/tickets/SPEC-EXEC-001/evidence/TICKET-001/AC-EXEC-002-required-fields.md` | EXEC-001-TICKET-001 | `EXEC-SCHEMA-CAPABILITY-PAYLOAD` unit-owned schema authority | DEFINED | DEFINED | YES | NO for fixture/harness; no foreign producer | CONTRACT_TESTABLE_LOCALLY | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |

```text
DESIGN_TEST_COVERAGE_GATE: PASS
PROXY_ONLY_BEHAVIORS = 0
UNTESTED_STATE_TRANSITIONS = 0
UNPROVEN_CONCURRENCY_CONTRACTS = 0; no concurrency obligation applies
MISSING_ARCHITECTURE_GUARDS = 0
```

Both ticket acceptance rows execute the named validation/rejection operation
and assert semantic results directly. The architecture and provenance tests
are executable guards, not source-inspection substitutes. Fixtures prove only
local contract behavior; they do not claim productive availability, durability,
restart, physical CAS, foreign integration, or external effects.

## 21. Structural Risk Assessment

| Risk | Level | Mitigation / rationale |
| --- | --- | --- |
| `GOD_COMPONENT_RISK` | LOW | Definitions, values, orchestration, adapter, and tests have separate responsibilities |
| `OVERSIZED_FILE_RISK` | LOW | Keep the schema-definition set cohesive; do not add registry, persistence, or transport code |
| `RESPONSIBILITY_MIXING_RISK` | LOW | Schema semantics remain separate from application sequencing and adapter mechanics |
| `EXCESSIVE_DEPENDENCY_RISK` | LOW | One narrow schema port and no foreign runtime dependency |
| `DUPLICATION_RISK` | LOW | One canonical definition set and one fail-closed path |
| `TESTABILITY_RISK` | LOW | Direct local harness invokes the productive application boundary |
| `CROSS_SPEC_LEAKAGE_RISK` | LOW | DOM fields remain opaque; no foreign semantic model is imported |
| `ARCHITECTURE_DRIFT_RISK` | MEDIUM | This is the first capability-specific authority path; retain executable import-graph, caller-injection, forged-result and no-fallback guards |
| `ANEMIC_DOMAIN_MODEL_RISK` | LOW | Contract values own identity, required fields, immutability and complete-pair construction |
| `FAT_APPLICATION_SERVICE_RISK` | LOW | Application operation only selects, sequences, constructs and aggregates results |
| `FAT_INTERFACE_RISK` | LOW | Validation port exposes one cohesive operation |
| `PRIMITIVE_OBSESSION_RISK` | LOW | SchemaReference and structured values already model meaningful concepts |
| `DEPENDENCY_INVERSION_RISK` | LOW | Schema engine remains behind the existing inward port |
| `INFRASTRUCTURE_LEAKAGE_RISK` | LOW | Domain/application do not import TypeBox mechanics, prototype, .pi, filesystem, transport, or persistence |
| `DOMAIN_RULE_DUPLICATION_RISK` | LOW | Selection, required-field, provenance and fail-closed rules each have one home |
| `PREMATURE_ABSTRACTION_RISK` | LOW | No dynamic plugin/strategy/factory; only the existing schema-mechanics boundary is used |
| `OVERENGINEERING_RISK` | LOW | No event bus, persistence, registry mutation, generic framework, or speculative compatibility layer |

```text
HIGH_STRUCTURAL_RISKS = 0
HIGH_DDD_RISKS = 0
HIGH_SOLID_RISKS = 0
HIGH_CLEAN_CODE_RISKS = 0
```

## 22. Implementation Sequence

1. **Freeze the ticket-local schema authority shape.** Extend the existing
   definitions boundary with an immutable capability-to-schema association and
   identifiable references, without implementing dynamic registry behavior.
   Immediately test definition identity, immutability, selected-schema
   matching, and caller/custom-definition rejection.
2. **Retain the schema-mechanics port and authenticated evidence.** Reuse the
   existing adapter and producer-issued evidence protocol. Test a valid
   selected capability schema, an independent authenticated adapter, forged
   results, copied references, and stale/mutated input.
3. **Replace generic payload acceptance.** Make payload validation use the
   selected capability schema and reject generic-but-capability-invalid data;
   preserve envelope required-field validation. Test both registration/selection
   identity and payload negative paths directly.
4. **Keep application orchestration thin and all-or-nothing.** Update
   `ValidateExecContract` to select definitions, validate both sides, construct
   immutable values, and return one failure when either side fails. Test no
   partial result, no approval/checkpoint/effect, malformed adapter output and
   thrown adapter errors.
5. **Preserve composition and production boundaries.** Wire only the
   ticket-owned schema definitions and existing adapter. Run the executable
   import-graph guard and verify no prototype/.pi/transport/registry/persistence
   path is reachable from the productive composition root.
6. **Generate local completion evidence and regression proof.** Execute
   `C-EXEC-001/002`, retained provenance/immutability/no-effect tests, typecheck,
   and applicable repository regressions. Produce the two file-addressed
   acceptance evidence records. Do not claim integrated source, registry,
   persistence, recovery, or final cross-SPEC conformance.

Each step has an immediate direct test surface. No later ticket is needed to
satisfy this ticket's local acceptance or completion evidence.

## 23. Files Expected to Change

| Path / Area | Classification | Reason |
| --- | --- | --- |
| `src/domain/exec-schema.ts` | EXPECTED_MODIFY | Extend canonical definitions with identifiable capability-schema selection while preserving immutable authority |
| `src/application/exec-contract.ts` | EXPECTED_MODIFY | Orchestrate selected schema validation and fail-closed complete-pair construction |
| `src/domain/exec-contract.ts` | POSSIBLE_MODIFY | Adjust payload value/selected-schema association only if needed; preserve existing brands and failure contract |
| `src/infrastructure/exec-schema-validator.ts` | POSSIBLE_MODIFY | Reuse the existing adapter; modify only if selected definitions require local adapter handling, never semantic ownership |
| `src/composition/exec-contract.ts` | POSSIBLE_MODIFY | Wire the ticket-owned immutable schema authority if the extension requires composition changes |
| `tests/exec-001-ticket-001.test.ts` | EXPECTED_MODIFY | Add direct capability-specific positive/negative, missing-field/text-only, provenance, stale, no-effect and architecture witnesses |
| `docs/tickets/SPEC-EXEC-001/evidence/TICKET-001/*` | EXPECTED_CREATE_AT_COMPLETION | Acceptance and completion evidence named by the ticket |
| `src/domain/exec-registry.ts`, `src/application/exec-registry.ts` | MUST_NOT_MODIFY | Dynamic registry, catalog, source and resolution semantics are outside this ticket |
| `src/application/snapshot.ts`, `src/domain/snapshot.ts` | MUST_NOT_MODIFY | DOM snapshot/caller-authority boundary is outside this ticket |
| `.pi/**`, `prototype/**` | MUST_NOT_MODIFY | Non-authoritative surfaces and forbidden production dependencies |
| `docs/specs/**`, ticket/index/audit/remediation/plan artifacts | MUST_NOT_MODIFY | Upstream authority and planning artifacts are frozen |
| package/tooling configuration | MUST_NOT_MODIFY unless an existing command demonstrably requires a narrowly local test-discovery adjustment | No tooling redesign is authorized |

## 24. Open Questions / Blockers

```text
NONE
```

Schema library mechanics, physical schema representation, and exact local file
placement remain legitimate implementation details already bounded by the
existing adapter and repository conventions. If implementation would require
registry publication/version resolution, DOM identity or lifecycle decisions,
persistence/recovery, transport, or a second authority path, stop and route it
upstream rather than deciding within this ticket.

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
CRITICAL_INVARIANTS = 8
UNPLACED_DOMAIN_INVARIANTS = 0
TEST_SURFACES = 8
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
ACCEPTANCE_WITNESS_MATRIX_ROWS = 2
DIRECT_BEHAVIOR_WITNESSES = 2
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
