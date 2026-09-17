# DOM-001-TICKET-005 — Implementation Design

## 1. Design Verdict

```text
IMPLEMENTATION_DESIGN_READY
```

The ticket's frozen command semantics have a bounded implementation design
inside the accepted DOM domain/application/port architecture. TICKET-001 and
TICKET-004 provide the canonical identity and pipeline boundaries, and
DOM-IMP-13/TICKET-013 now provides the productively available
`CommandAuthorityReader` capability through its audited composition and
`PROMO-DOM-COMMAND-AUTHORITY-01`. Fresh independent T005 implementation
validation remains a downstream audit step; it is not a design blocker.

## 2. Ticket

| Field | Value |
|---|---|
| Ticket ID | `DOM-001-TICKET-005` |
| Ticket path | `docs/tickets/SPEC-DOM-001/DOM-001-TICKET-005-command-validation-rejection.md` |
| Implementation Unit | `DOM-IMP-05 — Canonical commands and failure semantics` |
| Portfolio Obligations | `O-011` |
| Requirements | `DOM-CMD-001` |
| Gap IDs | `GAP-011`, `GAP-012` |
| Acceptance IDs | `AC-DOM-011`; contributor to `AC-DOM-052` |
| Status | `VALIDATION_REQUIRED`; `CURRENT_DAG_STATE = VALIDATION_REQUIRED` |
| Dependencies | TICKET-001, TICKET-004, and TICKET-013 satisfied for the local design; fresh T005 implementation validation remains pending; PLAT/BACKEND/UI remain integrated-only consumers |

## 3. Implementation Responsibility

Define and enforce the DOM canonical command boundary that validates identity,
revision, state, dependency, and verdict preconditions, records exact DOM
rejections through a persistence port, and guarantees unchanged state/effects
for every rejected or stale command.

## 4. Repository Architecture Context

The productive repository is a small TypeScript domain/application codebase:

- **Domain boundary:** `src/domain/*.ts` contains immutable value objects,
  aggregates, domain policies, typed domain errors, and narrow ports. DOM owns
  command meaning and canonical failure semantics.
- **Application boundary:** `src/application/*.ts` contains handlers that
  resolve canonical inputs, load aggregates, invoke domain behavior, call
  repository ports, and return command results. It must not decide the
  meaning of a failure or perform transport mapping.
- **Persistence boundary:** current productive code exposes repository ports;
  no physical infrastructure implementation is present in this repository.
  PLAT owns journal, durable rejection/effect recording, physical atomicity,
  and recovery at the integrated checkpoint.
- **Integration boundary:** typed command/result and rejection-record seams
  are consumed by PLAT and projected by BACKEND, OPS, and UI. Those consumers
  may change representation but not canonical failure meaning.
- **Public API boundary:** no HTTP or UI endpoint is present in the productive
  tree. Transport envelopes and routes remain outside this ticket.
- **Test boundary:** `tests/*.test.ts` exercises productive source through
  `tsx`; `prototype/**` is disposable reference material and is not an
  authority or import target.

The design follows the existing domain/application/port convention. It does
not add a framework, infrastructure layer, event bus, CQRS split, schema, or
second command authority.

### Design eligibility reconciliation

The implementation currently wires `CommandAuthorityReader` into the
productive command path. The required capability is
`CAP-DOM-COMMAND-AUTHORITY-OBSERVATION`, not
`CAP-DOM-ADR-AUTHORITY-READ-OBSERVATION`. T003/DOM-IMP-03 therefore cannot
fulfil this design dependency. DOM-IMP-13/TICKET-013 is the authorized
producer, and its implementation, composition, independent audit, and
promotion record are present. The remaining gate is fresh independent T005
consumer validation; no capability blocker remains.

## 5. Existing Repository Context

| Existing Component | Classification | Current Responsibility | Design Use |
|---|---|---|---|
| `CanonicalIdentityReference` / `CanonicalIdentityCatalog` | REUSE | Canonical identity and exact revision resolution | Resolve command identity; caller labels and filenames remain non-authoritative |
| `WorkflowPipeline`, `PipelineStage`, `PipelineRevision`, `PipelineOrder` | EXTEND_WITHIN_TICKET / REUSE | Immutable stage aggregate, immediate-successor rule, and state revision | Existing aggregate command path; retain TICKET-004 invariants and expose canonical outcome at the command seam |
| `PipelineRepository` | REUSE | Aggregate lookup and expected-revision guarded advance | Commit/CAS boundary; no business rule or failure taxonomy is moved into the repository |
| `AdvancePipelineHandler` | REFACTOR_WITHIN_TICKET | Resolves identity, loads pipeline, advances, and maps stale/not-found errors | Adapt the productive pipeline command path to the shared basis/result/rejection contract |
| `PipelineDomainError` / `SnapshotDomainError` | INTEGRATE | Existing aggregate-specific failure values | Remain internal to their owning aggregate path; only semantically matching DOM command failures cross the canonical command boundary |
| `src/domain/snapshot.ts` and `src/application/snapshot.ts` | POSSIBLE_MODIFY | TICKET-002 snapshot command and immutable basis | Only route command-precondition failures through the shared contract if required; do not change snapshot eligibility, immutability, or persistence meaning |
| `tests/dom-001-ticket-001.test.ts` through `tests/dom-001-ticket-004.test.ts` | REUSE / REGRESSION | Completed identity, ADR, snapshot, and pipeline evidence | Preserve the completed ticket contracts while adding TICKET-005 direct witnesses |
| `prototype/**` | DO_NOT_TOUCH | Disposable UI/mock scenarios | Never import, promote, or use as productive command authority |

## 6. Domain Model Assessment

### Domain concepts

- `CommandBasis`: immutable command input containing the canonical aggregate
  reference, expected aggregate revision, correlation, and the authoritative
  precondition evidence required by the command.
- `CommandCorrelation`: immutable operational correlation carried into accepted
  results and rejection records; it is not aggregate identity.
- `CanonicalFailureFamily` and `CanonicalFailureCode`: the closed DOM-owned
  taxonomy: `SPEC_REVISION`/`UNKNOWN_SPEC` and `INELIGIBLE_REVISION`,
  `DEPENDENCY_CLOSURE`/`INVALID_DEPENDENCY_CLOSURE`, and
  `COMMAND_BASIS`/`INVALID_COMMAND_BASIS` and `STALE_REVISION`.
- `CanonicalCommandRejection`: immutable semantic rejection containing the
  exact family/code, command basis, correlation, and no-effect outcome.
- `CommandRejectionRecord`: the immutable record passed to the physical
  recording port. It is evidence of rejection, not a second aggregate state.
- `CanonicalCommandOutcome<T>`: a discriminated accepted/rejected result used
  by command consumers; transport-specific envelopes are outside DOM.
- `CommandPreconditionEvidence`: typed evidence supplied by the canonical
  resolver/aggregate/foreign contract, never caller-asserted authority.
- Existing `WorkflowPipeline`, `CanonicalIdentityReference`, and
  `PipelineRevision`: the relevant existing aggregate and value contracts.

`CommandPreconditionPolicy` is the only new domain policy. It owns the
canonical interpretation of the five DOM failure codes, while each aggregate
continues to own its own transition rules. No new entity, aggregate root,
domain event, or generic utility is justified.

`ANEMIC_DOMAIN_MODEL_RISK = LOW`: canonical failure meaning and precondition
acceptance are domain behavior. `FAT_APPLICATION_SERVICE_RISK = LOW`: the
application boundary coordinates resolution, validation, recording, and
commit but does not decide lifecycle meaning.

### Identity, lifecycle, and reconstruction use

TICKET-005 introduces no identity-bearing aggregate. It consumes the existing
`WorkflowPipeline` identity and TICKET-004 reconstruction contract. A command
must carry the canonical reference; a caller-provided display ID, filename,
stage label, persistence revision, or correlation cannot substitute for it.
Rehydration remains owned by the existing aggregate/repository boundary and is
not reimplemented here.

## 7. UPSTREAM_AUTHORITY_PRECONDITIONS

The following records are consumed from the accepted authority chain and are
not re-decided by this design.

| Concern | Proof / authority and revision | Status | Design consequence |
|---|---|---|---|
| Identity | ADR-0001 rev. 3; `DOM-ID-001`; `ACP-DOM-01`; TICKET-001 identity proof; SPEC §12.1 and current Component SPEC Audit §17 | `COMPLETE` | Use `CanonicalIdentityReference(kind=STAGE, scope=ExecutionId, value=StageId)` for the existing pipeline; identity revision remains distinct from aggregate revision |
| Lifecycle / command meaning | ADR-0002 rev. 3, `ADR0002-D003`; `DOM-CMD-001`; `ACP-DOM-05` | `COMPLETE` | Validate canonical preconditions, reject invalid/stale bases, record the reason, and produce no transition/effect |
| Persistence / recovery | ADR-0006 rev. 3; SPEC persistence matrix; `PCP-PLAT-05` | `COMPLETE` as boundary contract; PLAT producer integrated-only | DOM supplies semantic rejection material through a port; PLAT owns journal, physical atomicity, durable replay, and recovery |
| Rehydration | Component SPEC Audit §18; TICKET-004 reconstruction proof and accepted provenance authority | `COMPLETE`; no new T005 reconstruction | Load current canonical state through existing ports; do not materialize or repair detached state in the command boundary |
| Concurrency | TICKET-004 expected-revision/CAS contract; TICKET-005 temporal-authority proof preserved from Plan `DOM-IMP-05` | `COMPLETE` | Commit uses the observed command basis and physical CAS; stale commit maps to `STALE_REVISION` with no last-write-wins |
| Idempotency | TICKET-005 §14c rejection retry contract; ADR-0006 replay/idempotency boundary | `COMPLETE` for local command contract | Exact same rejected basis/correlation replays the same rejection record; a changed basis is a new command and is revalidated |
| Ownership | Portfolio `O-011`; SPEC failure-semantics table; Component SPEC Audit §§28–29 | `COMPLETE` | DOM owns five semantic codes; PLAT records, BACKEND maps, OPS logs, and UI presents |
| Cross-SPEC dependencies | `PCP-PLAT-05`, `PCP-BACKEND-01`; Plan §12.1/§12.3; ticket §14b | `COMPLETE` | PLAT/BACKEND/UI availability is not required for local closure because the dependency is integrated-proof only |
| Implementability | Plan Audit `IMPLEMENTATION_PLAN_CONFORMANT`; Component SPEC Audit `SPEC_IMPLEMENTABILITY_CHECK = PASS`; Gap Matrix Audit `SPEC_IMPLEMENTABILITY_CHECK = PASS` | `PASS` | No upstream identity, lifecycle, persistence, reconstruction, or cross-SPEC gap is delegated to code design |

### Existing aggregate identity proof consumed by T005

```text
AGGREGATE_ROOT = WorkflowPipeline
CANONICAL_IDENTITY = CanonicalIdentityReference(kind=STAGE, scope=ExecutionId, value=StageId)
IDENTITY_AUTHORITY_SOURCE = ADR-0001 rev3; SPEC-DOM-001 §12.1; ACP-DOM-01; TICKET-001
IDENTITY_KIND_OR_TYPE = STAGE
IDENTITY_SCOPE = canonical ExecutionId
STABLE_CORRELATION_FIELDS = RepositoryId, ExecutionId, StageId; request correlation is transient
CREATION_RULE = TICKET-004 creates the canonical initial stage through TICKET-001 authority
COMMAND_REPRESENTATION = command basis carries the full canonical reference and expected aggregate revision
REPOSITORY_LOOKUP_REPRESENTATION = full CanonicalIdentityReference, never a local PipelineId
PERSISTED_REPRESENTATION = canonical reference, identity revision, stage, PipelineRevision, and accepted provenance
REHYDRATED_REPRESENTATION = immutable WorkflowPipeline after identity/provenance validation
EQUALITY_AND_CONTINUITY_SEMANTICS = reference equality plus aggregate revision/CAS; revision is not causal proof
REVISION_RELATIONSHIP = identity revision, PipelineRevision, and persistence revision remain distinct
ALIASES_LOCAL_IDS_DERIVED_IDS = PipelineId, stage label, filename, status, persistence revision, correlation
ALIAS_AUTHORITY_AND_FORBIDDEN_SUBSTITUTIONS = aliases cannot establish identity or current state
PROOF_EVIDENCE = SPEC §12.1/§12.2; Component SPEC Audit §17; TICKET-001 and TICKET-004 designs
IDENTITY_RESULT = COMPLETE
```

### Existing reconstruction proof consumed by T005

```text
AGGREGATE_OR_ENTITY = WorkflowPipeline
WHAT_PERSISTED_MATERIAL_IS_ACCEPTED = canonical reference, stage, PipelineRevision, and ordered accepted provenance
WHO_VALIDATES_PERSISTED_MATERIAL = WorkflowPipeline plus identity/provenance authorities; PLAT validates physical material
CREATE_SEMANTICS = initial stage/revision only; no history fabricated
REHYDRATE_SEMANTICS = later state materializes only after identity and complete accepted-chain validation
REHYDRATABLE_STATES = initial or later canonical stages supported by the complete chain
CURRENT_STATE_EVIDENCE = repository state plus accepted provenance ending at the exact stage/revision
CANONICAL_IDENTITY_RESOLUTION = CanonicalIdentityReconstructionAuthority
REFERENCE_ATTACHMENT_VALIDATION = exact STAGE kind, ExecutionId scope, and StageId resolution
VERSION_OR_REVISION_VALIDATION = continuous aggregate revision; persistence revision remains separate
CAN_UNTRUSTED_OR_DETACHED_PERSISTED_MATERIAL_BE_MATERIALIZED_DIRECTLY_AS_VALID_DOMAIN_STATE? = NO
RECONSTRUCTION_VALIDATOR_OR_RESOLVER_OWNER = DOM WorkflowPipeline and accepted provenance authority
PREDECESSOR_SUCCESSOR_OR_PROGRESSION_PROVENANCE = immediate ordered stage chain
CAUSAL_SEQUENCE_OR_EQUIVALENT_CONTINUITY_EVIDENCE = accepted provenance records, not scalar revision alone
CONTINUITY_VALIDATION = identity, predecessor, immediate successor, order, and final snapshot match
STALE_STATE_BEHAVIOR = explicit stale rejection; no mutation
UNKNOWN_REFERENCE_BEHAVIOR = identity/reconstruction failure; no materialized aggregate
DETACHED_REFERENCE_BEHAVIOR = reject before command execution
CORRUPTED_MATERIAL_BEHAVIOR = fail closed; no command effect
SKIPPED_STATE_BEHAVIOR = reject
FORGED_LATER_STATE_BEHAVIOR = reject
STATE_SKIP_REJECTION = YES
STATE_EVIDENCE_INCONSISTENCY_REJECTION = YES
FORGED_LATER_STATE_REJECTION = YES
DOMAIN_VALIDATION_OWNER = WorkflowPipeline
PERSISTENCE_ADAPTER_RESPONSIBILITY = storage, serialization, physical CAS, and recovery only
FAIL_CLOSED_RESULT = no aggregate transition or effect
MUTATION_ON_FAILURE = NO
INVARIANTS_REVALIDATED = identity, current revision, state, and accepted transition basis
PROOF_EVIDENCE = SPEC §13 pipeline provenance; Component SPEC Audit §18; TICKET-004
RECONSTRUCTION_RESULT = COMPLETE
```

### External authority consumption proof: PLAT

```text
AUTHORITY_CONSUMPTION_PROOF = ACP-DOM-05 / PCP-PLAT-05
CAPABILITY_ID = CAP-PLAT-SNAPSHOT-PIPELINE-PROVENANCE
AUTHORITY_EXISTENCE = SPEC-PLAT-001 approved journal/checkpoint contract
TRUTH_OWNER = SPEC-PLAT-001 for physical rejection/journal material; DOM remains semantic owner
AUTHORITY_SEMANTIC_SOURCE = ADR-0006 and the PLAT producer contract
OWNER_DOMAIN_OR_BOUNDED_CONTEXT = PLAT
CONSUMPTION_CONTRACT = CommandRejectionRecorder/PLAT journal seam records canonical rejection correlation and basis
PORT_INTERFACE_QUERY_RESOLVER_OR_READER = typed rejection-recording port at the DOM application boundary
CONTRACT_PRODUCER = PLAT journal/checkpoint writer/reader at integrated checkpoint
CONTRACT_CONSUMER = TICKET-005 canonical command boundary
RETURNED_DATA = rejection correlation, canonical family/code, canonical identity, basis revision, and recording result
VERSION_REVISION_TRANSPORT = command identity/revision and correlation are preserved unchanged; persistence revision is separate
FAILURE_NOT_FOUND_STALE_SEMANTICS = missing, duplicate-conflicting, stale, corrupt, or detached record fails closed; no command effect is inferred
AUTHORITY_STATUS = DEFINED
CONTRACT_STATUS = DEFINED
SEMANTIC_STATUS = DEFINED_BY_PLAT_CONTRACT_WITH_DOM_SEMANTIC_VALIDATION
LOCAL_TESTABILITY = NO for the physical PLAT capability; the local recording-port fixture is a separate local DOM contract seam
PRODUCTIVE_AVAILABILITY = NO in the current repository
CAPABILITY_SUMMARY_STATUS = CONTRACT_DEFINED
DEPENDENCY_CLASS = REQUIRED_FOR_INTEGRATED_PROOF
AVAILABILITY_EVIDENCE = Plan §12.1/§12.3 and README §11.1; no productive PLAT journal adapter is present
BLOCKING_EFFECT = does not block local execution or local closure; blocks integrated durable-record proof
PROOF_EVIDENCE = ticket `PCP-PLAT-05`, Plan Audit cross-SPEC audit, and TICKET-005 temporal evidence
RESULT = AUTHORITY_DEFINED_BUT_NOT_CONSUMABLE for the integrated physical producer; local contract remains designable
```

### Producer/consumer proof: command authority observation

```text
CAPABILITY_ID = CAP-DOM-COMMAND-AUTHORITY-OBSERVATION
AUTHORITY_OWNER = SPEC-DOM-001 / DOM
PRODUCER = DOM-IMP-13 / DOM-001-TICKET-013
CONSUMER = DOM-IMP-05 / DOM-001-TICKET-005
PRODUCED_CONTRACT = CommandAuthorityReader.observe → complete immutable CommandAuthorityObservation
CONSUMED_FIELDS = canonical STAGE identity, aggregate revision, stage, four precondition statuses, dependency/verdict freshness
AUTHORITY_STATUS = DEFINED
CONTRACT_STATUS = DEFINED
LOCAL_TESTABILITY = YES through direct contract witnesses and the promoted producer
DEPENDENCY_CLASS = REQUIRED_FOR_LOCAL_EXECUTION
PRODUCTIVE_AVAILABILITY = YES after TICKET-013 implementation, runtime composition, independent audit, and PROMO-DOM-COMMAND-AUTHORITY-01
CAPABILITY_SUMMARY_STATUS = CONTRACT_PRODUCTIVELY_AVAILABLE
FAILURE_NOT_FOUND_STALE_SEMANTICS = missing, unknown, stale, superseded, revoked, invalidated, or inconsistent authority fails closed; no default or caller authority
TEMPORAL_REQUIREMENT = T005 independently re-reads the productive observation before commit
DOM-IMP-03_ROLE = ADR authority only; not a producer substitute
BLOCKING_EFFECT = no capability block remains; fresh independent T005 consumer validation gates downstream execution
RESULT = PROMOTED_PRODUCER_AVAILABLE / T005_CONSUMER_VALIDATION_PENDING
```

### Producer/consumer proof: DOM result to BACKEND/OPS/UI

```text
PRODUCER_CONSUMER_CONTRACT_PROOF = PCP-BACKEND-01
CAPABILITY_ID = CAP-DOM-CANONICAL-COMMAND-RESULT
AUTHORITY_OWNER = SPEC-DOM-001
PRODUCER = TICKET-005 DOM command boundary
PRODUCED_CONTRACT = accepted/rejected result with exact family/code, correlation, basis revision, and unchanged-state meaning
CONSUMER = SPEC-BACKEND-001 transport mapping; SPEC-OPS-001 logging; SPEC-UI-001 presentation
CONSUMED_CAPABILITY = representation of the canonical result without semantic change
SEMANTIC_STATUS = DEFINED_AND_DOM_OWNED
AUTHORITY_STATUS = DEFINED
CONTRACT_STATUS = DEFINED
LOCAL_TESTABILITY = YES through deterministic mapping contract fixtures
PRODUCTIVE_AVAILABILITY = NO for foreign transport/logging/presentation in this repository
CAPABILITY_SUMMARY_STATUS = CONTRACT_TESTABLE_LOCALLY
AVAILABILITY_EVIDENCE = ticket §14b and local mapping fixtures; no foreign runtime is required for local closure
AVAILABILITY_CONDITION = mappings are verified at the integrated consumer checkpoint
DEPENDENCY_CLASS = REQUIRED_FOR_INTEGRATED_PROOF
DEPENDENCY_EDGE = DOM canonical result → BACKEND/OPS/UI mapping consumers
PROOF_EVIDENCE = `PCP-BACKEND-01`, TICKET-005 §14b, and mapping witnesses
BLOCKING_EFFECT = no local execution or local-closure block; integrated mapping proof remains downstream
AUTHORITY_CONSUMPTION_PROOF = NOT_APPLICABLE_AS_FOREIGN_AUTHORITY; DOM produces the semantic authority consumed by these adapters
```

### Temporal and caller-authority preconditions

```text
TEMPORAL_AUTHORITY_PROOF = PRESERVED_FROM_PLAN (DOM-IMP-05); source TICKET-005 §14c
and Plan DOM-IMP-05 Temporal Authority Preconditions
INITIAL_OBSERVATION = canonical identity, current aggregate revision/state, dependency closure, verdict basis, and command correlation
VERSION_REVISION_HASH_OR_CORRELATION = canonical identity revision, expected aggregate revision, dependency/verdict revisions, and correlation
MUTATION_WINDOW = after initial validation and before rejection recording or accepted aggregate commit
RELEVANT_COMMIT_POINT = repository/PLAT guarded command commit and rejection-record reservation
INDEPENDENT_SECOND_OBSERVATION = current identity/state/dependency basis is re-read at the commit boundary; repository CAS independently checks expected revision
DRIFT_DETECTION = changed identity, revision, state, dependency closure, verdict, or conflicting rejection basis
FAIL_CLOSED_BEHAVIOR = return `STALE_REVISION` or the applicable canonical rejection, record it, and do not invoke the effect/transition writer
STATE_PRESERVATION = aggregate/effect snapshots remain byte-equivalent on rejected or stale paths
SEMANTIC_VALIDATION_OWNER = DOM command policy and aggregate owner
CAS_OR_PHYSICAL_INTEGRITY_ROLE = repository/PLAT enforces physical CAS and durable integrity; CAS does not define failure meaning
PROOF_EVIDENCE = `docs/tickets/SPEC-DOM-001/evidence/TICKET-005/temporal-authority.md`
TEMPORAL_AUTHORITY_RESULT = TEMPORAL_AUTHORITY_PROTECTED
CALLER_AS_AUTHORITY_CHECK = PASS
CALLER_SUPPLIED_AUTHORITY_BYPASS = 0
```

The only legitimate design decisions are module placement, local naming, the
shape of the typed port, and adapter mechanics. Prohibited normative decisions
are empty: this design does not choose identity, lifecycle meaning, recovery
ownership, persistence meaning, or failure semantics.

## 8. Aggregate / Consistency Boundaries

| Aggregate | Root | Invariants | Transaction / Consistency Boundary | External References |
|---|---|---|---|---|
| Existing workflow stage aggregate | `WorkflowPipeline` | canonical identity, current stage, immediate successor, continuous aggregate revision, no last-write-wins | load → validate basis → create immutable proposal → guarded repository CAS; rejection recording never calls the transition/effect writer | canonical STAGE reference, accepted provenance, operational correlation |
| Command rejection evidence | None; not an aggregate | exact failure family/code, basis/correlation attachment, idempotent exact replay, no associated state/effect transition | `CommandRejectionRecorder` port; PLAT owns physical journal atomicity and recovery | canonical identity, command revision, correlation |

No new aggregate root or entity is introduced. A rejection record is evidence
of a command outcome, not a second state machine or an alternate authority.

## 9. Responsibility Decomposition

| Responsibility | Authority | State Owned | Expected Test Surface |
|---|---|---|---|
| Construct canonical command basis | `DOM-CMD-001`, identity and revision contracts | immutable identity/revision/correlation/precondition evidence | value-object validation and caller-authority negative tests |
| Interpret canonical failure taxonomy | ADR-0002 rev3; SPEC §15; `ACP-DOM-05` | five failure family/code meanings | direct one-failure-at-a-time positive/negative tests |
| Validate command preconditions | `DOM-CMD-001` | no durable state; validated evidence only | domain policy tests for identity, eligibility, closure, basis, and stale inputs |
| Coordinate command execution | application boundary and aggregate owner | no domain state; command/result correlation | application orchestration and no-side-effect tests |
| Apply aggregate transition | owning aggregate, currently `WorkflowPipeline` | proposed next aggregate state | TICKET-004 regression and valid command tests |
| Record rejection correlation | `PCP-PLAT-05` boundary | rejection record contract, physical state owned by PLAT | recording-port contract and failure propagation tests |
| Protect commit-time truth | TICKET-005 temporal-authority proof preserved from Plan DOM-IMP-05 and repository CAS contract | current revision/state observation | deterministic stale interleaving and one-winner tests |
| Preserve consumer meaning | `PCP-BACKEND-01`; DOM canonical result contract | no foreign state | mapping contract tests that reject rename/retry/terminality drift |

`RESPONSIBILITY_MIXING_RISK = LOW`: domain validation, application
coordination, aggregate mutation, physical recording, and transport mapping
remain separate.

## 10. Proposed Components

| Component | Type | Responsibility | Existing/New | Expected Location | Size |
|---|---|---|---|---|---|
| `CommandBasis` | VALUE_OBJECT | Freeze canonical command identity, expected aggregate revision, correlation, and precondition evidence | New | `src/domain/command.ts` | SMALL |
| `CanonicalCommandRejection` | VALUE_OBJECT | Represent exact DOM family/code and no-effect semantic result | New | `src/domain/command.ts` | SMALL |
| `CanonicalCommandOutcome<T>` | OTHER / result contract | Distinguish accepted and rejected command results without transport concerns | New | `src/domain/command.ts` | SMALL |
| `CommandPreconditionPolicy` | DOMAIN_POLICY | Validate canonical basis/evidence and select only the approved failure semantics | New | `src/domain/command.ts` | MEDIUM |
| `CommandRejectionRecorder` | PORT | Expose the narrow rejection-recording seam to PLAT | New | `src/domain/command.ts` | SMALL |
| `CanonicalCommandBoundary` | APPLICATION_SERVICE | Coordinate basis validation, rejection recording, accepted execution, and result creation | New | `src/application/command.ts` | MEDIUM |
| `AdvancePipelineHandler` | COMMAND_HANDLER | Adapt the existing pipeline command to the shared canonical boundary and existing CAS repository | Existing, extended | `src/application/pipeline.ts` | SMALL |

Component ownership details:

- `CommandBasis` owns immutable command input validation. It collaborates with
  `CanonicalIdentityReference`, aggregate revision values, and the precondition
  policy; it must not resolve authority or mutate an aggregate.
- `CanonicalCommandRejection` owns the stable five-code semantic contract. It
  collaborates with the recorder and outcome; it must not own persistence,
  retry scheduling, or UI wording.
- `CanonicalCommandOutcome<T>` owns the accepted/rejected result shape. It
  collaborates with handlers and mapping consumers; it must not expose a
  transport envelope or create a state transition.
- `CommandPreconditionPolicy` owns canonical validation decisions. It
  collaborates with typed observations/evidence; it must not load repositories,
  call PLAT, or execute effects.
- `CommandRejectionRecorder` owns only the stable port contract. PLAT owns its
  physical implementation; the port must not contain journal/schema logic.
- `CanonicalCommandBoundary` owns application sequencing and side-effect
  exclusion. It collaborates with the policy, aggregate-specific handler,
  repository, and recorder; it must not own aggregate invariants, transport
  projection, retry policy, or foreign lifecycle.
- `AdvancePipelineHandler` owns pipeline-specific loading and transition
  coordination. It collaborates with TICKET-001 identity authority,
  `WorkflowPipeline`, `PipelineRepository`, and the shared command contract;
  it must not become a generic service or define the five failure meanings.

## 11. SOLID Assessment

| Component | SRP | OCP | LSP | ISP | DIP | Result |
|---|---|---|---|---|---|---|
| `CommandBasis` / `CanonicalCommandRejection` | One validation/semantic value reason each | Closed vocabulary is normative; no plugin axis | No inheritance | Small value API | Depends on domain values only | PASS |
| `CommandPreconditionPolicy` | One reason to change: DOM command precondition semantics | No speculative strategies; add a code only through upstream authority | No inheritance | Consumes a cohesive evidence contract | Depends on typed domain observations | PASS |
| `CommandRejectionRecorder` | One physical boundary: record rejection evidence | Producer can vary behind the port | Implementations must preserve exact record semantics | Narrow recording capability | Inverts PLAT dependency at the boundary | PASS |
| `CanonicalCommandBoundary` | One reason to change: command sequencing/result protocol | No command registry or handler hierarchy | Uses composition | Depends only on the ports it orchestrates | Domain/application depend on ports, not PLAT | PASS |
| `AdvancePipelineHandler` | Pipeline command orchestration only | No hypothetical pipeline strategies | Existing concrete handler; no substitutability claim | Existing repository ports remain narrow | Uses domain and ports | PASS |

```text
SRP_VIOLATIONS = 0
OCP_VIOLATIONS = 0
LSP_VIOLATIONS = 0
ISP_VIOLATIONS = 0
DIP_VIOLATIONS = 0
UNJUSTIFIED_SOLID_VIOLATIONS = 0
```

## 12. Dependency Direction

```text
Canonical domain values/policy
        ↓ depends on
DOM aggregate and stable domain-facing ports
        ↓ consumed by
Application command boundary and aggregate-specific handlers
        ↓ implemented/mapped by
PLAT recording adapter and BACKEND/OPS/UI projection adapters
```

The domain does not import PLAT, database, journal, filesystem, HTTP, UI, or
prototype code. Adapters map the canonical result outward; they do not map
foreign meaning inward as a new DOM authority.

```text
DEPENDENCY_DIRECTION_VIOLATIONS = 0
INFRASTRUCTURE_LEAKAGE_POINTS = 0
```

## 13. Invariant Placement

| Invariant | Domain Enforcement | Durable Protection | Application Guard | Test |
|---|---|---|---|---|
| Command identity is canonical | `CommandBasis` plus identity authority resolution | persisted reference remains full and typed | resolve before aggregate lookup | unknown/alias/filename rejection |
| Expected revision is the current aggregate basis | typed basis and aggregate revision contract | repository/PLAT CAS | pass expected revision unchanged; no rebase | stale interleaving |
| Only eligible/current command evidence is accepted | `CommandPreconditionPolicy` and aggregate owner | rejection record preserves evidence | load/reobserve before commit | each isolated invalid basis |
| Dependency closure and verdict compatibility are DOM meanings | policy validates supplied authoritative evidence | record basis/correlation; no foreign interpretation | no effect writer call on failure | open/invalid closure and incompatible verdict |
| Five failure codes remain stable | closed `CanonicalCommandRejection` taxonomy | durable record stores exact code/family | adapters receive result unchanged | mapping contract and exact-code assertions |
| Rejection has no transition/effect | validation precedes aggregate/repository/effect call | PLAT journal/outbox preserves no-effect correlation | recorder is called on rejection path only | byte-equivalent before/after snapshots |
| Rejection retry is idempotent | exact basis/correlation reconciliation | PLAT idempotent record contract | no duplicate transition/effect on replay | repeated and concurrent retry |
| Commit-time drift fails closed | policy plus repository CAS | physical atomic CAS/integrity | map stale result to `STALE_REVISION` | deterministic two-command race |

```text
UNPLACED_DOMAIN_INVARIANTS = 0
```

## 14. Persistence Design

- **Aggregate storage boundary:** existing aggregate repositories remain the
  only transition seams. `PipelineRepository.find` loads current state and
  `advance(proposed, expectedRevision)` is the guarded mutation seam.
- **Rejection-record port:** add a narrow `CommandRejectionRecorder` contract
  carrying the canonical rejection, full basis, and correlation. Its local
  fixture proves contract behavior; PLAT later supplies physical journal,
  idempotency, durability, and recovery.
- **Serialization:** serialize explicit canonical identity, aggregate/basis
  revision, family/code, correlation, and no-effect result. A serializer must
  not derive identity from filenames or reconstruct state from a status label.
- **Concurrency:** expected aggregate revision and the commit-point observation
  are preserved unchanged. Physical CAS belongs to the repository/PLAT adapter;
  persistence revision is never treated as domain progression or failure
  meaning.
- **Atomicity:** the application validates before invoking mutation/effect
  ports. The local contract asserts rejection recording and unchanged state;
  PLAT owns the physical atomic record/journal guarantee at integrated proof.
- **Durable invariant protection:** a generic persistence mutation path must
  not bypass the command boundary. Repository implementations accept only
  the proposed transition and expected revision supplied by the handler.
- **Registry/index relationship:** `NOT_APPLICABLE`; T005 introduces no new
  identity registry or query index.
- **Integrity validation:** canonical identity, revision, family/code,
  correlation, and basis attachment are validated before a record is accepted.
- **Recovery:** physical rejection records are replayed by PLAT and consumed as
  correlated evidence; replay cannot infer an accepted transition or create an
  effect. Detached/corrupt/conflicting evidence fails closed.
- **Archival:** `NOT_APPLICABLE`; retention/export belongs to OPS/PLAT.

No schema or physical journal implementation is required for local T005
closure. The PLAT integrated checkpoint remains explicit and is not silently
promoted by the local recorder fixture.

## 15. Lifecycle Design

The command-result lifecycle is deliberately smaller than the aggregate
lifecycle:

```text
REQUESTED
  ├── ACCEPTED → aggregate-specific transition/effect boundary
  └── REJECTED → canonical rejection record; no transition/effect
```

- **State set:** `REQUESTED`, `ACCEPTED`, `REJECTED`; `CONFIRMED` is a foreign
  effect/publication result and is not introduced here.
- **Initial state:** `REQUESTED` at command-boundary entry.
- **Allowed transitions:** one validated command may become `ACCEPTED`; one
  invalid/stale command may become `REJECTED`.
- **Rejected transitions:** invalid identity, ineligible revision, invalid
  dependency closure, invalid command basis, stale revision, and any
  aggregate-specific invalid transition that maps to the canonical contract.
- **Transition owner:** DOM command boundary owns result semantics; each
  aggregate root owns its accepted state transition; PLAT owns physical record
  durability.
- **Recovery transitions:** a rejected command is not implicitly retried or
  converted to accepted. A caller must submit a new/current basis; exact
  replay returns the same rejection contract without mutation.
- **Terminal transitions:** none are introduced for the command boundary;
  terminality remains owned by the aggregate-specific ticket/publication/audit
  tickets.
- **Persistence guard:** no repository/effect writer call occurs before all
  canonical preconditions pass and the commit basis is revalidated.
- **Forbidden bypass paths:** caller-supplied status, filename identity,
  scalar state, adapter-renamed error, direct repository mutation, implicit
  retry, or transport success may not establish an accepted command.

## 16. Cross-Spec Integration

| Foreign Owner | Contract | Local Integration Point | ACL | Forbidden Local Ownership |
|---|---|---|---|---|
| `SPEC-PLAT-001` | `PCP-PLAT-05`: durable command/rejection record with identity, basis revision, exact family/code, correlation, and failure/replay semantics | `CommandRejectionRecorder` port used by `CanonicalCommandBoundary` | typed rejection-record mapping at the PLAT adapter seam; `AUTHORITY_CONSUMPTION_PROOF = ACP-DOM-05/PCP-PLAT-05` as recorded in §7 | journal schema, physical CAS meaning, durable recovery, retry executor, or failure-code ownership |
| `SPEC-BACKEND-001`, `SPEC-OPS-001`, `SPEC-UI-001` | `PCP-BACKEND-01`: canonical accepted/rejected result projected without renaming family/code, retryability, terminality, or no-effect meaning | `CanonicalCommandOutcome<T>` consumer/mapping contract | transport/log/presentation mapping outside DOM; `AUTHORITY_CONSUMPTION_PROOF = NOT_APPLICABLE` because DOM produces the authority; PCP is recorded in §7 | HTTP envelope, UI wording, logging policy, transport status, or a second command authority |

Both rows are `AUTHORITY_STATUS = DEFINED` and `CONTRACT_STATUS = DEFINED`.
The PLAT capability has `LOCAL_TESTABILITY = NO` and
`PRODUCTIVE_AVAILABILITY = NO`; the local recorder fixture is a separate DOM
contract seam and never promotes PLAT. The dependency class is
`REQUIRED_FOR_INTEGRATED_PROOF`; BACKEND/
OPS/UI runtime mapping is likewise integrated-only. Neither blocks local
execution or local closure. No foreign lifecycle or failure family is copied
into DOM.

## 17. Main Interaction Flow

1. A command adapter receives the transport-shaped input and creates a
   `CommandBasis`; caller-provided status and state are treated as claims, not
   truth.
2. `CanonicalCommandBoundary` resolves the full canonical identity through the
   existing authority and loads the current aggregate through its repository
   port.
3. `CommandPreconditionPolicy` validates the canonical basis and typed
   dependency/verdict evidence. Aggregate-specific rules remain with the
   aggregate.
4. On rejection, `CanonicalCommandRejection` is created, the
   `CommandRejectionRecorder` is called once with the exact correlation/basis,
   and a `REJECTED` outcome is returned. No transition/effect port is called.
5. On success, the aggregate creates an immutable proposed transition and the
   repository performs the expected-revision guarded commit.
6. A commit-point stale result becomes `STALE_REVISION`, is recorded through
   the same no-effect path, and does not overwrite the accepted state.
7. The accepted/rejected result is exposed to downstream mapping consumers
   without changing its semantic fields.

## 18. Failure / Recovery Flow

| Failure point | Detection | Durable evidence | Failure owner | Retry owner | Idempotency boundary | Recovery path | Reconciliation path |
|---|---|---|---|---|---|---|---|
| Unknown or ineligible SPEC/revision | canonical identity/lifecycle resolver | rejection record with exact basis/code | DOM | caller/application policy; no implicit retry | exact command basis + correlation | reload canonical authority and submit a new valid basis | PLAT replays record; DOM validates attachment |
| Invalid dependency closure | authoritative closure evidence | rejection record | DOM | caller/application policy | exact basis + correlation | close/repair dependency through its owner, then submit a new command | mapping consumers preserve `INVALID_DEPENDENCY_CLOSURE` |
| Invalid basis/state/verdict | domain policy/aggregate validation | rejection record | DOM | caller/application policy | exact basis + correlation | obtain current state/evidence; no mutation to recover | replay cannot convert rejection into acceptance |
| Stale revision at commit | independent second observation and repository CAS | stale rejection plus unchanged prior state | DOM semantic owner; PLAT/repository physical CAS owner | caller/application may retry with a fresh basis | expected aggregate revision and exact correlation | reload and revalidate; never rebase silently | conflicting record/evidence blocks rather than overwrites |
| Rejection-record persistence failure | recorder/PLAT result | physical failure evidence owned by PLAT | PLAT for physical failure; DOM result remains unaccepted | PLAT retry/recovery contract | PLAT’s approved journal/idempotency contract | recover journal before claiming durable rejection | integrated checkpoint only; local fixture asserts propagation |
| Detached/corrupt replayed rejection | PLAT integrity plus DOM semantic attachment validation | corrupt/detached record | PLAT detects physical issue; DOM rejects semantic material | PLAT/owner recovery | record identity and basis attachment | fail closed; no aggregate/effect mutation | human/integrated reconciliation, not local authority transfer |

The temporal proof preserved from Plan `DOM-IMP-05` in §7: the initial basis is independently
reobserved at commit, drift is detected, the prior state is preserved, DOM
owns semantic validation, and CAS is only physical integrity/concurrency
protection. `CALLER_AS_AUTHORITY_CHECK = PASS`; no caller-supplied state,
status, revision, or verdict bypass exists.

## 19. Clean Code Assessment

| Check | Result | Evidence / constraint |
|---|---|---|
| `CLEAR_DOMAIN_NAMING` | PASS | Names use command, basis, rejection, correlation, and canonical failure vocabulary |
| `SMALL_COHESIVE_METHODS` | PASS | Policy, recorder coordination, and aggregate execution remain separate operations |
| `EXPLICIT_SIDE_EFFECTS` | PASS | Recorder and repository calls are visible application boundaries |
| `EXPLICIT_MUTATION_BOUNDARIES` | PASS | Only aggregate/repository commit can mutate accepted state |
| `NO_BOOLEAN_PARAMETER_EXPLOSION` | PASS | Typed evidence/result objects replace mode flags |
| `NO_LONG_PARAMETER_LISTS` | PASS | Command basis and rejection records group related values |
| `NO_PRIMITIVE_OBSESSION_WHERE_DOMAIN_TYPE_EXISTS` | PASS | Use canonical references, revision values, failure codes, and correlation value objects |
| `NO_MAGIC_VALUES` | PASS | Failure family/code vocabulary is centralized and closed |
| `NO_GENERIC_UTIL_BUCKETS` | PASS | No helper/util module is proposed |
| `NO_GENERIC_SERVICE_BUCKETS` | PASS | Boundary and policy have specific command responsibilities |
| `NO_DUPLICATED_DOMAIN_RULES` | PASS | Canonical failure interpretation is centralized; aggregate rules remain local |
| `NO_DEEP_NESTING_BY_DESIGN` | PASS | Result branches are explicit and shallow |
| `NO_COMMENT_DEPENDENT_CORRECTNESS` | PASS | No-effect and stale semantics are enforced by ports/CAS/tests |
| `NO_HIDDEN_TEMPORAL_COUPLING` | PASS | Initial and commit-point observations are explicit |
| `NO_UNNECESSARY_MUTABILITY` | PASS | Basis, rejection, and outcome records are immutable |

## 20. Test Design

### Test surfaces

| Behavior / Invariant | Test Type | Target | Expected Proof |
|---|---|---|---|
| Canonical basis validates identity, revision, correlation, and required evidence | UNIT / DOMAIN_INVARIANT | `CommandBasis` and `CommandPreconditionPolicy` | valid basis accepted; malformed/detached/caller-authority basis rejected |
| Valid command returns deterministic accepted result | APPLICATION | `CanonicalCommandBoundary` and pipeline command handler | accepted result preserves identity, revision, and correlation |
| `UNKNOWN_SPEC` | NEGATIVE_BEHAVIOR | command dispatch with unknown SPEC reference | exact family/code, one rejection record, no transition/effect |
| `INELIGIBLE_REVISION` | NEGATIVE_BEHAVIOR | command dispatch with proposed/superseded revision | exact family/code and unchanged state/effect |
| `INVALID_DEPENDENCY_CLOSURE` | NEGATIVE_BEHAVIOR | command dispatch with open/invalid closure | exact family/code and no aggregate commit |
| `INVALID_COMMAND_BASIS` | NEGATIVE_BEHAVIOR | malformed identity/state/verdict/basis command | exact family/code and no repository/effect mutation |
| `STALE_REVISION` | STALE_PROTECTION / CONCURRENCY | two commands against one aggregate revision | one commit at most; stale command records exact code; no last-write-wins |
| Rejection recording and no-effect atomicity | PERSISTENCE / IDEMPOTENCY | `CommandRejectionRecorder` fixture plus state/effect spy | exact correlation; state/effect snapshots byte-equivalent; identical retry is idempotent |
| Five-code mapping | INTEGRATION / CROSS_SPEC | BACKEND/OPS/UI contract doubles | code/family/no-effect/retry/terminal meaning is unchanged; renamed mapping fails |
| Architecture boundary | ARCHITECTURE_CONFORMANCE | productive command modules/import graph | no prototype/infrastructure/transport imports and no second failure authority |
| Existing identity/pipeline behavior | REGRESSION | TICKET-001 and TICKET-004 suites | prior canonical identity, provenance, immediate successor, and CAS evidence remains green |

### Lifecycle and concurrency declarations

```text
STATE_SET = REQUESTED, ACCEPTED, REJECTED
INITIAL_STATE = REQUESTED
ALLOWED_TRANSITIONS = REQUESTED→ACCEPTED; REQUESTED→REJECTED
REJECTED_TRANSITIONS = rejected/stale→accepted without a new valid basis; any effect on rejection
MUTATION_AUTHORITY = aggregate root plus guarded repository commit; command boundary owns result semantics
REPOSITORY_CONTRACT = find current canonical state; commit proposed state with expected aggregate revision; recorder records exact rejection basis
ISOLATION_INVARIANT = rejected/stale command leaves aggregate and effect state byte-equivalent and invokes no effect writer
STATE_TRANSITION_TEST = T5-AC1-P/N, T5-AC7-P/N, and stale-concurrency witness

CONCURRENCY_CONTRACT = concurrent commands sharing one expected aggregate revision cannot both commit; stale basis fails closed
ONE_WINNER_EXPECTATION = at most one accepted aggregate transition; competing stale command is rejected
DUPLICATE_STATE_EXPECTATION = exact rejected retry returns/reuses the same rejection meaning and does not duplicate transition/effect
DETERMINISTIC_INTERLEAVING_OR_ADAPTER_TEST = pause two handlers after initial observation and release commit in a fixed order; assert CAS/stale and recorder calls
```

### Complete `ACCEPTANCE_WITNESS_MATRIX`

The repository contains direct fixture-level contract witnesses, and the
required productive authority capability is now available through TICKET-013's
implementation, composition, independent audit, and promotion record. Every
row below is therefore executable at local closure; fresh independent T005
consumer validation remains a separate audit gate.

| Normative behavior | Verb | Concrete operation | State/transition affected | Direct positive test | Direct negative/isolation test | Expected evidence file | Acceptance owner | Required producer/capability | Authority status | Contract status | Semantic status | Capability summary status | Local testability | Productive availability | Dependency class | Witness executable at local closure | Evidence type |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Valid command | accepts deterministically | command dispatch | command accepted | `T5-AC1-P` valid command returns canonical success | `T5-AC1-N` malformed command rejected before dispatch | `docs/tickets/SPEC-DOM-001/evidence/TICKET-005/AC-DOM-011-valid.md` | TICKET-005 | `CAP-DOM-COMMAND-AUTHORITY-OBSERVATION`; TICKET-013 promotion record present; fresh T005 audit pending | `DEFINED` | `DEFINED` | `DEFINED_AND_DOM_OWNED` | `CONTRACT_PRODUCTIVELY_AVAILABLE` | `YES` | `YES` | `REQUIRED_FOR_LOCAL_EXECUTION` | `YES` | `LOCAL_TEST_EVIDENCE` |
| `UNKNOWN_SPEC` | rejects | command dispatch | rejected/no transition | `T5-AC2-P` known SPEC baseline accepted | `T5-AC2-N` unknown SPEC exact family/code and no effect | `docs/tickets/SPEC-DOM-001/evidence/TICKET-005/AC-DOM-011-unknown-spec.md` | TICKET-005 | `CAP-DOM-COMMAND-AUTHORITY-OBSERVATION`; TICKET-013 promotion record present; fresh T005 audit pending | `DEFINED` | `DEFINED` | `DEFINED_AND_DOM_OWNED` | `CONTRACT_PRODUCTIVELY_AVAILABLE` | `YES` | `YES` | `REQUIRED_FOR_LOCAL_EXECUTION` | `YES` | `LOCAL_TEST_EVIDENCE` |
| `INELIGIBLE_REVISION` | rejects | command precondition check | rejected/no transition | `T5-AC3-P` eligible revision succeeds | `T5-AC3-N` proposed/superseded revision exact family/code and no effect | `docs/tickets/SPEC-DOM-001/evidence/TICKET-005/AC-DOM-011-ineligible-revision.md` | TICKET-005 | `CAP-DOM-COMMAND-AUTHORITY-OBSERVATION`; TICKET-013 promotion record present; fresh T005 audit pending | `DEFINED` | `DEFINED` | `DEFINED_AND_DOM_OWNED` | `CONTRACT_PRODUCTIVELY_AVAILABLE` | `YES` | `YES` | `REQUIRED_FOR_LOCAL_EXECUTION` | `YES` | `LOCAL_TEST_EVIDENCE` |
| `INVALID_DEPENDENCY_CLOSURE` | rejects | dependency gate | rejected/no transition | `T5-AC4-P` closed DAG baseline advances | `T5-AC4-N` open/invalid closure exact family/code and no effect | `docs/tickets/SPEC-DOM-001/evidence/TICKET-005/AC-DOM-011-dependency-closure.md` | TICKET-005 | `CAP-DOM-COMMAND-AUTHORITY-OBSERVATION`; TICKET-013 promotion record present; fresh T005 audit pending | `DEFINED` | `DEFINED` | `DEFINED_AND_DOM_OWNED` | `CONTRACT_PRODUCTIVELY_AVAILABLE` | `YES` | `YES` | `REQUIRED_FOR_LOCAL_EXECUTION` | `YES` | `LOCAL_TEST_EVIDENCE` |
| `INVALID_COMMAND_BASIS` | rejects | basis validation | rejected/no transition | `T5-AC5-P` canonical basis succeeds | `T5-AC5-N` invalid identity/basis/verdict exact family/code and no effect | `docs/tickets/SPEC-DOM-001/evidence/TICKET-005/AC-DOM-011-command-basis.md` | TICKET-005 | `CAP-DOM-COMMAND-AUTHORITY-OBSERVATION`; TICKET-013 promotion record present; fresh T005 audit pending | `DEFINED` | `DEFINED` | `DEFINED_AND_DOM_OWNED` | `CONTRACT_PRODUCTIVELY_AVAILABLE` | `YES` | `YES` | `REQUIRED_FOR_LOCAL_EXECUTION` | `YES` | `LOCAL_TEST_EVIDENCE` |
| `STALE_REVISION` | rejects | revision guard | rejected/no transition | `T5-AC6-P` current revision succeeds | `T5-AC6-N` obsolete revision exact family/code and no effect | `docs/tickets/SPEC-DOM-001/evidence/TICKET-005/AC-DOM-011-stale.md` | TICKET-005 | `CAP-DOM-COMMAND-AUTHORITY-OBSERVATION`; physical CAS remains integrated PLAT evidence; TICKET-013 promotion record present | `DEFINED` | `DEFINED` | `DEFINED_AND_DOM_OWNED` | `CONTRACT_PRODUCTIVELY_AVAILABLE` | `YES` | `YES` | `REQUIRED_FOR_LOCAL_EXECUTION` | `YES` | `LOCAL_TEST_EVIDENCE` |
| Rejection record | records atomically without effect | rejected command | no state/effect transition | `T5-AC7-P` rejection record has correlation | `T5-AC7-N` state/effect byte-equivalent; retry idempotent | `docs/tickets/SPEC-DOM-001/evidence/TICKET-005/AC-DOM-011-no-effect.md` | TICKET-005 | `CAP-DOM-COMMAND-AUTHORITY-OBSERVATION`; PLAT durable record remains integrated evidence; TICKET-013 promotion record present | `DEFINED` | `DEFINED` | `DEFINED_AND_DOM_OWNED` | `CONTRACT_PRODUCTIVELY_AVAILABLE` | `YES` | `YES` | `REQUIRED_FOR_LOCAL_EXECUTION` | `YES` | `LOCAL_TEST_EVIDENCE` |

All seven rows have direct fixture-level contract witnesses. They are not
registration/listing proxies, sequential-only duplicate proxies, or
source-inspection substitutes. The required productive DOM command-authority
observation is available through TICKET-013 and
`PROMO-DOM-COMMAND-AUTHORITY-01`, so every row is executable at local closure.
The physical PLAT journal capability remains integrated-only and is not required
for this local closure. The architecture guard is an executable
import/dependency test, not human source inspection.

```text
ACCEPTANCE_WITNESS_MATRIX_ROWS = 7
DIRECT_BEHAVIOR_WITNESSES = 7
PROXY_ONLY_BEHAVIORS = 0
UNTESTED_STATE_TRANSITIONS = 0
UNPROVEN_CONCURRENCY_CONTRACTS = 0
MISSING_ARCHITECTURE_GUARDS = 0
WITNESS_EXECUTABLE_AT_LOCAL_CLOSURE = 7 of 7
DESIGN_TEST_COVERAGE_GATE: PASS
```

## 21. Structural Risk Assessment

| Risk | Level | Mitigation |
|---|---|---|
| `GOD_COMPONENT_RISK` | LOW | Boundary coordinates only; aggregate, policy, recorder, and mapping remain separate |
| `OVERSIZED_FILE_RISK` | MEDIUM | Create dedicated `command.ts` modules; do not append the taxonomy to `pipeline.ts` or a generic service |
| `RESPONSIBILITY_MIXING_RISK` | MEDIUM | Keep physical recording and transport mapping behind ports; `CanonicalCommandBoundary` owns sequencing only |
| `EXCESSIVE_DEPENDENCY_RISK` | MEDIUM | Inject only identity, aggregate repository, command policy, and rejection recorder capabilities |
| `DUPLICATION_RISK` | MEDIUM | Centralize the five-code taxonomy; preserve aggregate-specific errors internally and map once at the canonical seam |
| `TESTABILITY_RISK` | MEDIUM | Use deterministic recorder/CAS doubles for local contract witnesses and label PLAT durability as integrated-only |
| `CROSS_SPEC_LEAKAGE_RISK` | LOW | Typed PLAT/BACKEND contract seams; no foreign models enter the domain |
| `ARCHITECTURE_DRIFT_RISK` | MEDIUM | Add executable import guard and forbid prototype/infrastructure/transport imports |
| `ANEMIC_DOMAIN_MODEL_RISK` | LOW | Policy and immutable rejection value own real command semantics |
| `FAT_APPLICATION_SERVICE_RISK` | MEDIUM | Keep aggregate decisions in roots and validation decisions in the domain policy; boundary contains no conditional lifecycle tree |
| `FAT_INTERFACE_RISK` | LOW | Recorder and repository ports expose only cohesive capabilities |
| `PRIMITIVE_OBSESSION_RISK` | MEDIUM | Use canonical identity, revision, correlation, failure family/code, and basis value types |
| `DEPENDENCY_INVERSION_RISK` | LOW | PLAT is reached only through a domain-facing recorder port |
| `INFRASTRUCTURE_LEAKAGE_RISK` | LOW | No journal/database/HTTP types in domain or application contracts |
| `DOMAIN_RULE_DUPLICATION_RISK` | MEDIUM | One command policy owns the canonical taxonomy; aggregate transition rules are not repeated |
| `PREMATURE_ABSTRACTION_RISK` | LOW | Shared contract has immediate T006/T007/T008/T012 consumers; no strategy/factory/plugin hierarchy |
| `OVERENGINEERING_RISK` | LOW | No event bus, generic command registry, schema, or framework is introduced |

```text
HIGH_STRUCTURAL_RISKS = 0
HIGH_DDD_RISKS = 0
HIGH_SOLID_RISKS = 0
HIGH_CLEAN_CODE_RISKS = 0
```

## 22. Implementation Sequence

1. **Freeze the shared domain contract.** Add the canonical family/code,
   immutable basis, rejection, record, and outcome types using existing
   identity/revision vocabulary. Immediately run unit tests for valid,
   malformed, detached, and caller-authority inputs.
2. **Place precondition behavior in the domain policy.** Implement the five
   approved failure meanings against typed observations, without repository or
   transport dependencies. Immediately run one direct positive/negative test
   for each family/code.
3. **Add the narrow recorder port.** Define the record contract and local
   fixture behavior; verify exact correlation, unchanged state/effect, and
   failure propagation when the recorder rejects.
4. **Adapt the current pipeline command path.** Extend
   `AdvancePipelineHandler`/the canonical command boundary to resolve identity,
   load state, validate, record rejection, and only then call the existing
   `WorkflowPipeline.advanceTo` and repository CAS. Run all TICKET-004 tests
   immediately after this step.
5. **Add stale and idempotency protection.** Exercise a deterministic
   interleaving and exact rejected replay; verify one winner, `STALE_REVISION`,
   no last-write-wins, and no duplicate effect.
6. **Add mapping contract witnesses.** Test the DOM result as consumed by
   BACKEND/OPS/UI doubles. Do not add their transport, logging, or presentation
   implementation.
7. **Add architecture conformance.** Execute the productive import guard and
   confirm no prototype/infrastructure dependency or second failure authority.
8. **Produce local evidence and regression proof.** Run the TICKET-005 suite,
   TICKET-001 through TICKET-004 regressions, strict TypeScript checks, and the
   required evidence assertions. Physical PLAT journal proof remains at its
   declared integrated checkpoint.

## 23. Files Expected to Change

| Path / Area | Classification | Reason |
|---|---|---|
| `src/domain/command.ts` | EXPECTED_CREATE | Canonical basis, five-code failure taxonomy, immutable result/record values, precondition policy, and recorder port |
| `src/application/command.ts` | EXPECTED_CREATE | Thin canonical command boundary coordinating validation, rejection recording, accepted execution, and outcomes |
| `src/application/pipeline.ts` | EXPECTED_MODIFY | Adapt the existing productive pipeline command path and preserve TICKET-004 CAS behavior |
| `src/domain/pipeline.ts` | POSSIBLE_MODIFY | Only a local typed-contract seam if the existing aggregate result needs adaptation; no new stage/lifecycle meaning |
| `src/domain/snapshot.ts` / `src/application/snapshot.ts` | POSSIBLE_MODIFY | Only to route command-precondition outcomes through the shared contract; preserve TICKET-002 snapshot semantics and local errors owned by other boundaries |
| `tests/dom-001-ticket-005.test.ts` | EXPECTED_CREATE | Direct positive/negative, no-effect, stale, idempotency, mapping, and architecture witnesses |
| `docs/tickets/SPEC-DOM-001/evidence/TICKET-005/*` | EXPECTED_CREATE_AT_COMPLETION | Eight local evidence artifacts named by the ticket, including temporal authority |
| `src/domain/identity.ts` | MUST_NOT_MODIFY | TICKET-001 canonical identity authority is complete and owned upstream |
| `src/domain/adr.ts` / `src/application/adr.ts` | MUST_NOT_MODIFY | TICKET-003 lifecycle/authority reader is complete; no ADR lifecycle redesign |
| `prototype/**` | MUST_NOT_MODIFY | Disposable, non-authoritative implementation |
| PLAT/BACKEND/OPS/UI adapters, schemas, transport, and journal | MUST_NOT_MODIFY | Foreign ownership and integrated checkpoints remain outside TICKET-005 |
| ADRs, Portfolio, SPEC, Gap Matrix, Plan, audits, and ticket files | MUST_NOT_MODIFY | Upstream artifacts are frozen authority and audit-owned records |

## 24. Open Questions / Blockers

NONE. Fresh independent T005 implementation validation is a downstream audit
gate, not an implementation-design blocker. The physical PLAT rejection
journal and foreign result mappings are `REQUIRED_FOR_INTEGRATED_PROOF` and are
therefore outside local design closure.


## 25. Design Metrics

```text
RESPONSIBILITIES = 8
DOMAIN_CONCEPTS = 8
AGGREGATE_ROOTS = 1 referenced (WorkflowPipeline); 0 introduced
ENTITIES = 0
VALUE_OBJECTS = 6 (4 new command values; 2 existing identity/revision values)
DOMAIN_SERVICES = 0
DOMAIN_POLICIES = 1
APPLICATION_SERVICES = 2 (1 new; 1 existing handler extended)
PORTS = 3 (identity authority, pipeline repository, rejection recorder)
ADAPTERS = 0 local
ANTI_CORRUPTION_LAYERS = 0 local implementations; 2 explicit foreign mapping seams
PROPOSED_COMPONENTS = 7
CRITICAL_INVARIANTS = 8
UNPLACED_DOMAIN_INVARIANTS = 0
TEST_SURFACES = 11
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
AUTHORITY_CONSUMPTION_PROOFS = 2 (ACP-DOM-05; PLAT PCP-05)
PRODUCER_CONSUMER_CONTRACT_PROOFS = 2 (PCP-PLAT-05; PCP-BACKEND-01)
TEMPORAL_AUTHORITY_PROOFS = 1 (TICKET-005 §14c / Plan DOM-IMP-05)
TEMPORAL_AUTHORITY_GAPS = 0
CALLER_SUPPLIED_AUTHORITY_BYPASS = 0
ACCEPTANCE_WITNESS_MATRIX_ROWS = 7
DIRECT_BEHAVIOR_WITNESSES = 7
PROXY_ONLY_BEHAVIORS = 0
UNTESTED_STATE_TRANSITIONS = 0
UNPROVEN_CONCURRENCY_CONTRACTS = 0
MISSING_ARCHITECTURE_GUARDS = 0
WITNESS_EXECUTABLE_AT_LOCAL_CLOSURE = 7 of 7
DESIGN_TEST_COVERAGE_GATE = PASS
```

## 26. Design Gate

```text
IMPLEMENTATION_DESIGN_GATE: READY_FOR_IMPLEMENTATION
```
