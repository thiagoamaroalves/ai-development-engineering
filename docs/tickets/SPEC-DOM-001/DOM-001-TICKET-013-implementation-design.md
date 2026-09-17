# DOM-001-TICKET-013 — Implementation Design

## 1. Design Verdict

```text
IMPLEMENTATION_DESIGN_READY
```

The ticket is a cohesive producer/composition slice. It can be implemented by
reusing the canonical identity and pipeline boundaries, composing the already
defined DOM command-authority facts through one explicit read seam, and wiring
that producer into the existing command boundary. No production implementation,
test implementation, or upstream artifact is created by this design.

## 2. Ticket

| Field | Value |
|---|---|
| Ticket ID | `DOM-001-TICKET-013` |
| Ticket path | `docs/tickets/SPEC-DOM-001/DOM-001-TICKET-013-command-authority-observation.md` |
| Implementation Unit | `DOM-IMP-13` — Canonical command-authority observation |
| Portfolio Obligations | `O-011` |
| Requirements | `DOM-CMD-001` |
| Gap IDs | `GAP-011`, `GAP-012` producer slice |
| Acceptance IDs | `T13-AC1`, `T13-AC2`, `T13-AC3`, `T13-AC4`, `T13-AC5`; producer contribution to `AC-DOM-011` |
| Status | `READY` |
| Current repository baseline | `HEAD 6b31bcee1591c8b2e6499a434950664077b2be01`; working tree dirty and preserved |
| Relevant source baseline | current working-tree fingerprints recorded below in Existing Repository Context |

Upstream authority is the accepted `ADR-0002` revision 3, approved portfolio
revision 2, conformant `SPEC-DOM-001` revision 4, validated Gap Matrix, current
Implementation Plan, fresh Plan audit
`docs/specs/implementation-plans/audits/SPEC-DOM-001-implementation-plan-audit-2026-09-15-command-authority-producer.md`,
and conformant ticket audit
`docs/tickets/SPEC-DOM-001/implementation-ticket-audit-2026-09-15-command-authority-producer.md`.

## 3. Implementation Responsibility

Produce the sole non-test DOM implementation of `CommandAuthorityReader` that resolves a canonical STAGE, reads current pipeline state and complete canonical command-authority facts independently on every call, returns one immutable observation or no observation, and is wired into the existing command boundary without owning command policy or commit behavior.

## 4. Repository Architecture Context

The repository has a small TypeScript domain/application core under `src` and
test-only adapters under `tests`; it does not yet have a separate productive
infrastructure implementation or a root runtime package.

| Boundary | Current repository expression | T013 design consequence |
|---|---|---|
| Domain | `src/domain/identity.ts`, `src/domain/pipeline.ts`, `src/domain/command.ts` contain immutable values, aggregates, policies, and narrow ports | Keep identity, pipeline, command evidence, and failure meanings in these existing contracts |
| Application | `src/application/command.ts` and `src/application/pipeline.ts` coordinate command execution and CAS | Add only the observation adapter and a specific composition factory; leave `CanonicalCommandBoundary` and `AdvancePipelineHandler` semantics with T005 |
| Infrastructure / persistence | No productive adapter is present; repository interfaces are the boundary and in-memory implementations are in tests | T013 performs no writes, serialization, journal, recovery, or CAS; `PipelineRepository.find` is consumed as a read port |
| Integration | No productive external integration exists in the current `src` tree | No foreign integration is required for T013 local closure; PLAT/BACKEND contracts remain downstream T005 concerns |
| Public API | No root package/index or HTTP boundary is present | The factory is an application composition seam, not a new transport API |
| Test | `tests/*.test.ts`, executed through `prototype/node_modules/tsx` | Add a focused T013 suite and rerun the affected T005 suite; test doubles remain test-only |
| Prototype | `prototype/src` and `prototype/tests` | Must not be imported, registered, or treated as authority |

The accepted dependency direction is:

```text
src/domain values, aggregates, policies, and ports
        ↑
src/application observation adapter and composition factory
        ↑
runtime composition caller / command entry point
```

The diagram denotes imports from application toward domain; domain does not
depend on application, infrastructure, transport, or prototype code.

## 5. Existing Repository Context

| Existing Component | Classification | Current Responsibility | Design Use |
|---|---|---|---|
| `CommandAuthorityReader` in `src/domain/command.ts` | REUSE | Consumer-facing `observe(CanonicalIdentityReference) -> CommandAuthorityObservation \| undefined` contract | Remains the only productive command-authority output port |
| `CommandAuthorityObservation` | REUSE | Shape carrying identity, `PipelineRevision`, stage, four precondition statuses, and two freshness tokens | Preserve the exact output shape; do not add caller fields or a parallel result |
| `CommandPreconditionEvidence` | REUSE | Validates complete SPEC/revision/closure/verdict evidence and freezes it | Construct only from the canonical state source; never from command claims |
| `CommandAuthorityFreshness` | REUSE | Validates and freezes dependency/verdict freshness tokens | Copy source tokens on every observation; never cache them |
| `CanonicalIdentityCatalog` / `CanonicalIdentityReconstructionAuthority` | INTEGRATE | Resolves exact canonical identity and historical continuity | Resolve the requested reference and require exact `STAGE` attachment before pipeline access |
| `WorkflowPipeline` | INTEGRATE | Immutable aggregate owning canonical stage and aggregate revision | Read current stage/revision; do not advance or reconstruct in T013 |
| `PipelineRepository` | INTEGRATE | Exact identity lookup and guarded pipeline advancement port | Use only `find` in T013; CAS remains T005/PLAT-owned |
| `AdvancePipelineHandler` | INTEGRATE | Existing command consumer; observes authority, checks drift, proposes, and CAS-advances | Receive the productive reader from the new composition factory; no handler policy rewrite |
| `CanonicalCommandBoundary` / `CommandPreconditionPolicy` | DO_NOT_TOUCH | Caller-shape validation, canonical precondition evaluation, drift detection, rejection mapping | Remain T005 owners; T013 supplies facts only |
| `tests/dom-001-ticket-005.test.ts` readers | DO_NOT_TOUCH as authority | `InMemoryCommandAuthorityReader` and `SequenceCommandAuthorityReader` prove local T005 contract behavior | Remain fixtures and regression support; never register them in `src` |
| `src/application/command.ts` | REUSE | Application-level command boundary | Import graph remains inward; no productive reader is added here unless the factory needs a type-only dependency |
| `prototype/**` | DO_NOT_TOUCH | Disposable scenario model and test harness | Not implementation evidence or authority |

Relevant current working-tree SHA-256 fingerprints are:

```text
src/domain/command.ts       BA0EFFCBA5994886D36629D06D194100DA2EC29BE086A49D6038EBA6C72B2E97
src/application/command.ts  0B2547C5935A8DE16A325F0FB12864F47AF29A3DE08392C47CC112EB39635F85
src/domain/identity.ts      B1D2157480B63EC245E4A465A7805A43A82C4D091C6E231F6EAF17C6BCC73E96
src/domain/pipeline.ts      E02D4765A9FE4B38C6DF873220FC2F1DEA34FC0F2ED10C9B5A9639D3D6EB605F
src/application/pipeline.ts 5150038AFA296B173D4C13E086AD1B276E139257F8B5E500E5820967A059057B
tests/dom-001-ticket-005.test.ts 761C8384DBC2B5B23B95A87CB363F59A319B6A8D258831128EE59555BB2B9B6B
```

The current full local baseline is `90 passed, 0 failed, 0 skipped` from
`node prototype/node_modules/tsx/dist/cli.mjs --test tests/*.test.ts`.

## 6. Domain Model Assessment

### Relevant domain concepts

- `CanonicalIdentityReference` identifies the requested `STAGE` and remains the
  only identity authority.
- `WorkflowPipeline` is the referenced aggregate root whose current
  `PipelineStage` and `PipelineRevision` are observed.
- `CommandPreconditionEvidence` is the immutable complete set of
  `KNOWN/UNKNOWN`, `ELIGIBLE/INELIGIBLE`, `CLOSED/OPEN/INVALID`, and
  `COMPATIBLE/INCOMPATIBLE/MISSING` values.
- `CommandAuthorityFreshness` is the immutable pair of dependency and verdict
  freshness tokens.
- `CommandAuthorityObservation` is an immutable consumer-boundary result, not
  an aggregate or a second state machine.
- `CommandAuthorityReader` is the existing consumer-facing port.
- `CanonicalCommandAuthorityStateReader` is the proposed narrow input port for
  the already-defined DOM-owned command-authority facts. It is a read seam,
  not an authority owner, registry, projection, or caller-controlled setter.

### Aggregates, entities, and policies

No aggregate, entity, domain service, domain policy, domain event, or lifecycle
transition is introduced by T013. `WorkflowPipeline` is the one referenced
aggregate root; its transition and reconstruction semantics remain T004-owned.
No domain event is required because T013 produces a synchronous read result and
the repository has no event-delivery boundary for this concern.

### Application use case and repository abstractions

`CanonicalCommandAuthorityReader` is a specific application adapter that
composes three canonical reads into the existing reader contract. The runtime
factory is a composition component. `CanonicalIdentityReconstructionAuthority`
and `PipelineRepository` remain existing domain ports. The new state-reader port
is limited to complete command precondition/freshness facts and does not expose
mutation, lifecycle transitions, persistence, or transport.

### ACL boundary

No foreign model enters T013. An ACL is `NOT_APPLICABLE` locally; PLAT and
BACKEND are downstream consumers of T005 and are not consumed by this producer.

`ANEMIC_DOMAIN_MODEL_RISK = LOW`: T013 does not move domain decisions into a
service; it reuses the existing immutable values and keeps decision ownership
with the canonical DOM state sources and T005 policy.

## 7. UPSTREAM_AUTHORITY_PRECONDITIONS

The following records are copied from the accepted authority chain and the
fresh producer decomposition; this design does not complete or reinterpret
them.

| Concern | Proof / authority and revision | Status | Design consequence |
|---|---|---|---|
| Identity | `AGGREGATE_IDENTITY_PROOF = COMPLETE`, SPEC audit §17; `ADR-0001` rev3 / `ADR0001-D001`; SPEC §12.1/§12.2; T001 `ACP-DOM-01`; T004 `ACP-DOM-04` | `COMPLETE` | Resolve exact `CanonicalIdentityReference(kind=STAGE, scope=ExecutionId, value=StageId)` and reject unknown, detached, wrong-kind, or mismatched references |
| Lifecycle | `ADR-0002` rev3 / `ADR0002-D003`; `O-011`; `DOM-CMD-001`; ticket §7 | `COMPLETE` | Observe canonical stage and command-authority statuses; do not decide or execute a command transition |
| Persistence / recovery | `PERSISTENCE_SEMANTICS_MATRIX = COMPLETE`, SPEC audit §20; T004 `PCP-PLAT-04`; T005 `PCP-PLAT-05` | `COMPLETE` as a referenced boundary | Use already-resolved pipeline material; perform no persistence/recovery work. PLAT command/rejection durability remains T005 integrated-only |
| Rehydration | `AGGREGATE_RECONSTRUCTION_PROOF = COMPLETE`, SPEC audit §18; SPEC §13; T004 reconstruction contract and audit | `COMPLETE` | Consume a `WorkflowPipeline` returned by its validated repository boundary; never materialize persisted stage/revision directly in the reader |
| Concurrency | `CONCURRENCY_SEMANTICS_GAPS = 0`, SPEC audit §26; T004 expected-revision CAS contract; T005 temporal precondition | `COMPLETE` | Return current `PipelineRevision` and freshness tokens; T005 performs semantic drift detection and CAS at commit |
| Idempotency | SPEC §16; T005 command boundary and PLAT `PCP-PLAT-05` | `COMPLETE` for the handoff; `NOT_APPLICABLE` to T013 writes | `observe` is side-effect-free and uncached; rejection idempotency and effect retry remain outside T013 |
| Ownership | `O-011`, `DOM-CMD-001`, Plan DOM-IMP-13, ticket §4 | `COMPLETE` | DOM owns command-authority meaning; T013 owns observation composition; T005 owns policy/rejection/no-effect; PLAT owns physical recording |
| Cross-SPEC dependencies | Plan §12.2 and §12.3 `PCP-DOM-13→05`; PLAT/BACKEND mappings are downstream | `COMPLETE` for local T013 closure | No foreign capability is required for T013 local execution or closure; no capability is promoted here |

### WorkflowPipeline identity proof

```text
AGGREGATE_ROOT = WorkflowPipeline
CANONICAL_IDENTITY = CanonicalIdentityReference(kind=STAGE, scope=ExecutionId, value=StageId, revision=identity revision)
IDENTITY_AUTHORITY_SOURCE = DOM CanonicalIdentityReconstructionAuthority / TICKET-001
IDENTITY_KIND_OR_TYPE = STAGE reference
IDENTITY_SCOPE = canonical ExecutionId
STABLE_CORRELATION_FIELDS = RepositoryId, ExecutionId, StageId
CREATION_RULE = WorkflowPipeline.create resolves the registered canonical STAGE reference and starts at the initial stage/revision
COMMAND_REPRESENTATION = canonical reference + expected PipelineRevision + operational correlation
REPOSITORY_LOOKUP_REPRESENTATION = PipelineRepository.find(canonical reference)
PERSISTED_REPRESENTATION = full canonical reference and identity revision, separate aggregate revision, stage, and accepted provenance
REHYDRATED_REPRESENTATION = validated WorkflowPipeline returned by T004 identity/provenance reconstruction
EQUALITY_AND_CONTINUITY_SEMANTICS = CanonicalIdentityReference.equals; stage/revision continuity is validated by WorkflowPipeline
REVISION_RELATIONSHIP = identity revision is distinct from aggregate PipelineRevision and physical persistence revision
ALIASES_LOCAL_IDS_DERIVED_IDS = PipelineId, stage label, filename, request correlation, and persistence revision
ALIAS_AUTHORITY_AND_FORBIDDEN_SUBSTITUTIONS = aliases cannot establish identity or replace the canonical reference
PROOF_RESULT = COMPLETE
```

### WorkflowPipeline reconstruction proof

```text
AGGREGATE_OR_ENTITY = WorkflowPipeline
WHAT_PERSISTED_MATERIAL_IS_ACCEPTED = canonical STAGE reference, identity revision, current stage, aggregate PipelineRevision, and ordered accepted transition provenance
WHO_VALIDATES_PERSISTED_MATERIAL = DOM identity authority and WorkflowPipeline semantic validator; PLAT only supplies/validates physical material
CREATE_SEMANTICS = initial stage and aggregate revision zero only
REHYDRATE_SEMANTICS = later state only after identity attachment and complete accepted immediate-transition provenance
REHYDRATABLE_STATES = initial state or a state terminating at the exact validated provenance record
CURRENT_STATE_EVIDENCE = current stage and PipelineRevision match the last accepted provenance record
CANONICAL_IDENTITY_RESOLUTION = T001 identity authority resolves the exact reference
REFERENCE_ATTACHMENT_VALIDATION = wrong kind, scope, value, revision, or detached identity rejects
VERSION_OR_REVISION_VALIDATION = identity revision, continuous aggregate revisions, and final snapshot revision are checked separately
CAN_UNTRUSTED_OR_DETACHED_PERSISTED_MATERIAL_BE_MATERIALIZED_DIRECTLY_AS_VALID_DOMAIN_STATE? = NO
RECONSTRUCTION_VALIDATOR_OR_RESOLVER_OWNER = WorkflowPipeline plus identity/provenance authorities from T001/T004
PREDECESSOR_SUCCESSOR_OR_PROGRESSION_PROVENANCE = complete immediate predecessor/successor chain
CAUSAL_SEQUENCE_OR_EQUIVALENT_CONTINUITY_EVIDENCE = ordered append-only provenance with continuous revisions
CONTINUITY_VALIDATION = T004 chain validator and accepted authority comparison
STALE_STATE_BEHAVIOR = T005 semantic drift/CAS rejects before effect; T013 only returns current read or undefined
UNKNOWN_REFERENCE_BEHAVIOR = no observation
DETACHED_REFERENCE_BEHAVIOR = no observation
CORRUPTED_MATERIAL_BEHAVIOR = upstream reconstruction rejects before this reader receives a valid aggregate
SKIPPED_STATE_BEHAVIOR = upstream reconstruction rejects; no observation from invalid state
FORGED_LATER_STATE_BEHAVIOR = upstream reconstruction rejects; no observation from fabricated state
STATE_SKIP_REJECTION = COMPLETE upstream
STATE_EVIDENCE_INCONSISTENCY_REJECTION = COMPLETE upstream
FORGED_LATER_STATE_REJECTION = COMPLETE upstream
DOMAIN_VALIDATION_OWNER = DOM / WorkflowPipeline
PERSISTENCE_ADAPTER_RESPONSIBILITY = PLAT supplies material and physical integrity only
FAIL_CLOSED_FAILURES = unknown, detached, corrupt, duplicate, skipped, stale, or inconsistent material
FAIL_CLOSED_RESULT = no valid observation and no mutation
MUTATION_ON_FAILURE = NO
PERSISTED_IDENTITY_STATE_VERSION = canonical identity revision plus aggregate PipelineRevision; persistence revision remains distinct
INVARIANTS_REVALIDATED = identity attachment, stage vocabulary, continuity, final stage/revision match
EXTERNAL_REFERENCES_REQUIRED = canonical identity and accepted provenance authority
INVALID_PERSISTENCE_BEHAVIOR = never infer a valid observation from scalar state, checkpoint, caller input, or projection
INCOMPLETE_HISTORY_BEHAVIOR = no valid aggregate reaches T013
STALE_STATE_BEHAVIOR = no valid command basis is produced for a stale read; T005 reobserves before commit
PROOF_RESULT = COMPLETE
```

### Authority consumption and producer/consumer records

`ACP-DOM-01` and `ACP-DOM-04` are the cited internal authority-consumption
proofs for the T001 identity and T004 pipeline inputs. Their upstream facts are
preserved as follows:

| Capability / edge | Authority / producer | Consumer | Returned data | Version / failure semantics | Authority | Contract | Local testability | Productive availability at design baseline | Dependency class | Blocking effect |
|---|---|---|---|---|---|---|---|---|---|---|
| T001 canonical identity boundary | DOM / `CanonicalIdentityCatalog` | `CanonicalCommandAuthorityReader` | exact canonical STAGE reference and resolved record | identity revision is exact; unknown, detached, wrong-kind, or mismatched reference fails closed | `DEFINED` | `DEFINED` | `YES` | `YES` for the local DOM boundary | `REQUIRED_FOR_LOCAL_EXECUTION` input | none for T013 |
| T004 current pipeline boundary | DOM / `PipelineRepository` and `WorkflowPipeline` | `CanonicalCommandAuthorityReader` | canonical identity, current stage, aggregate `PipelineRevision` | lookup is exact; missing state returns no state; reconstruction and CAS meanings remain T004/PLAT-owned | `DEFINED` | `DEFINED` | `YES` | `YES` for the local DOM boundary | `REQUIRED_FOR_LOCAL_EXECUTION` input | none for T013 |
| `CAP-DOM-COMMAND-AUTHORITY-OBSERVATION` / `PCP-DOM-13→05` | DOM-IMP-13 | T005 / DOM-IMP-05 | immutable canonical STAGE identity, aggregate revision, stage, four precondition statuses, two freshness tokens | missing/unknown/stale/superseded/revoked/invalidated/inconsistent source returns no valid observation; no default or caller substitution | `DEFINED` | `DEFINED` | `YES` after producer tests | `NO` before T013 implementation and promotion | `REQUIRED_FOR_LOCAL_EXECUTION` for T005 | blocks T005 only; does not block T013 design or local work |

The output capability remains `PRODUCTIVE_AVAILABILITY = NO` and
`CAPABILITY_SUMMARY_STATUS = CONTRACT_TESTABLE_LOCALLY` until the implementation,
runtime composition, producer audit, and `PROMO-DOM-COMMAND-AUTHORITY-01` are
complete. This design makes no downstream availability promotion.

For the canonical command-authority facts, the proposed
`CanonicalCommandAuthorityStateReader` is a local read port owned by DOM-IMP-13
only as a composition seam. Its producer must be a non-test runtime source of
the already-authoritative four statuses and two freshness values. It may not be
implemented as a caller setter, default, projection, ADR-only reader, or
cache. This is a legitimate technical boundary; it does not decide new
meaning, lifecycle, ownership, or failure taxonomy.

`AUTHORITY_CONSUMPTION_PROOFS = 3` (T001, T004, and the DOM-IMP-13 handoff).
`PRODUCER_CONSUMER_CONTRACT_PROOFS = 3` (T001→T013, T004→T013, and
`PCP-DOM-13→05`). No external SPEC capability is required for T013 local
closure. The downstream `PCP-PLAT-05` record remains an integrated-only T005
contract: PLAT produces durable command/rejection records, T005 consumes them,
and T013 does not invoke or implement that boundary.

## 8. Aggregate / Consistency Boundaries

| Aggregate | Root | Invariants | Transaction / Consistency Boundary | External References |
|---|---|---|---|---|
| Existing workflow stage aggregate | `WorkflowPipeline` | canonical STAGE identity, known current stage, aggregate revision, and T004-validated provenance | read-only `PipelineRepository.find` within T013; transition/CAS transaction remains T005/T004/PLAT-owned | canonical identity reference and accepted provenance, already resolved before observation |
| Command-authority observation | none; immutable boundary result | identity attachment, complete statuses, freshness pair, no source defaults, no mutable returned object | one side-effect-free observation call; no transaction or mutation | canonical identity and current pipeline state |

`T013 does not introduce a new aggregate or consistency boundary.` The reader
must not own a setter, registry mutation, aggregate transition, or repository
write. The command-authority state input is a read contract, not an additional
canonical state machine.

## 9. Responsibility Decomposition

| Responsibility | Authority | State Owned | Expected Test Surface |
|---|---|---|---|
| Resolve and attach the requested canonical STAGE | T001 identity authority; SPEC §12.1/§12.2 | no new state; resolved identity reference | unit/negative identity tests |
| Read current pipeline stage and aggregate revision | T004 `WorkflowPipeline` and `PipelineRepository` contract | current aggregate read result only | application/integration read tests |
| Consume complete command-authority facts | `O-011`, `DOM-CMD-001`, Plan §12.2, ticket §6–7 | four precondition statuses and two freshness tokens supplied by canonical source | direct source completeness and missing/inconsistent-source tests |
| Compose the immutable `CommandAuthorityObservation` | T013 output contract / `PCP-DOM-13→05` | one frozen observation per call | positive complete-observation and immutability tests |
| Preserve independent re-observation | T005 temporal precondition; ticket T13-AC3 | no cache; each call reads identity, pipeline, and source anew | sequence/mutation-between-reads and T005 no-effect regression |
| Wire the productive reader | ticket T13-AC4; Plan DOM-IMP-13 | composition object graph only | runtime factory test and import-boundary guard |
| Preserve ownership and forbidden paths | `O-011`, ticket §8 | no caller authority, default, projection, ADR-only substitution, or policy logic | boundary-negative and architecture tests |

`RESPONSIBILITY_MIXING_RISK = LOW`: the adapter has one reason to change—the
DOM command-observation contract or its input composition—and the factory has
one reason to change—the runtime dependency graph. Policy, commit, persistence,
and transport have separate existing owners.

## 10. Proposed Components

| Component | Type | Responsibility | Existing/New | Expected Location | Size |
|---|---|---|---|---|---|
| `CommandAuthorityReader` | PORT | Expose the consumer-facing immutable observation query | Existing / reuse | `src/domain/command.ts` | SMALL |
| `CanonicalCommandAuthorityStateReader` | PORT | Read the complete canonical command-authority facts bound to an exact STAGE | New local seam | `src/domain/command.ts` | SMALL |
| `CanonicalCommandAuthorityReader` | ADAPTER | Resolve identity, read pipeline, read command facts, validate binding/completeness, and assemble the observation | New | `src/application/command-authority.ts` | MEDIUM |
| `CommandAuthorityPreconditionState` input contract | OTHER / immutable input shape | Carry source identity, four precondition fields, and two freshness fields without duplicating pipeline state | New local contract; no new semantic authority | `src/domain/command.ts` | SMALL |
| `createAdvancePipelineHandler` | APPLICATION_SERVICE / composition factory | Construct the productive reader and inject it into the existing command handler | New | `src/application/composition.ts` | SMALL |
| `CommandPreconditionEvidence` / `CommandAuthorityFreshness` | VALUE_OBJECT | Validate and freeze source facts | Existing / reuse | `src/domain/command.ts` | SMALL |
| `WorkflowPipeline` / `PipelineRepository` | AGGREGATE_ROOT / PORT | Provide current canonical pipeline state | Existing / integrate | `src/domain/pipeline.ts` | Existing |
| `AdvancePipelineHandler` / `CanonicalCommandBoundary` | APPLICATION_SERVICE | Consume authority, apply policy, reobserve, and commit/reject | Existing / integrate only | `src/application/pipeline.ts`, `src/application/command.ts` | Existing |

### Component ownership details

`CommandAuthorityReader` owns the output shape only. It collaborates with the
application adapter and is not allowed to own a concrete source, policy,
persistence, or transport.

`CanonicalCommandAuthorityStateReader` owns one read capability: returning the
already-defined source facts for an exact identity. It collaborates with the
canonical state producer and the observation adapter. It must not own identity
creation, stage/revision calculation, lifecycle transitions, command
acceptance, defaults, fallback, or mutation.

`CanonicalCommandAuthorityReader` owns one composition operation. It
collaborates with `CanonicalIdentityReconstructionAuthority`,
`PipelineRepository`, and `CanonicalCommandAuthorityStateReader`. It must not
own command failure selection, rejection recording, CAS, persistence recovery,
or an independent identity authority. Every call performs fresh reads and
creates fresh immutable evidence values.

`createAdvancePipelineHandler` owns only runtime object-graph construction. It
collaborates with the existing handler, recorder, identity authority, pipeline
repository, and state source. It must not accept a `CommandAuthorityReader`
instance from callers, because that would permit a test-only reader to become
the productive authority; it accepts the narrower canonical state-source
contract and constructs the production reader itself.

`WorkflowPipeline`, `PipelineRepository`, `CanonicalCommandBoundary`, and
`AdvancePipelineHandler` retain their existing reasons to change. T013 does
not widen or duplicate them.

## 11. SOLID Assessment

| Component | SRP | OCP | LSP | ISP | DIP | Result |
|---|---|---|---|---|---|---|
| `CanonicalCommandAuthorityStateReader` | one cohesive canonical-facts read capability | no speculative extension axis | no inheritance | narrow consumer-specific port | stable domain-side boundary | PASS |
| `CanonicalCommandAuthorityReader` | one reason to change: observation composition | no strategy/factory hierarchy | no inheritance | depends only on the three narrow reads it needs | application depends on domain ports, not technology | PASS |
| `createAdvancePipelineHandler` | one reason to change: runtime composition graph | explicit constructor composition is the known variation | no polymorphism | accepts only required dependencies | injects stable ports and constructs the adapter | PASS |
| `AdvancePipelineHandler` | existing command orchestration remains cohesive | not modified for hypothetical variation | no inheritance | existing constructor dependencies remain explicit | existing domain/application port direction preserved | PASS |
| `CommandAuthorityObservation` and existing values | immutable data/validation responsibility | closed output contract is intentional | value equality is explicit | not applicable | no infrastructure dependency | PASS |

```text
SRP_VIOLATIONS = 0
OCP_VIOLATIONS = 0
LSP_VIOLATIONS = 0
ISP_VIOLATIONS = 0
DIP_VIOLATIONS = 0
UNJUSTIFIED_SOLID_VIOLATIONS = 0
```

The one-method source port is justified by the real authority boundary and
single consumer capability; it is not a ceremonial wrapper. No inheritance,
strategy registry, generic factory hierarchy, event bus, or provider framework
is introduced.

## 12. Dependency Direction

```text
CanonicalCommandAuthorityReader
  → CanonicalIdentityReconstructionAuthority
  → PipelineRepository / WorkflowPipeline
  → CanonicalCommandAuthorityStateReader
  → CommandAuthorityReader contract

createAdvancePipelineHandler
  → constructs the reader
  → injects it into AdvancePipelineHandler

Domain ← Application; no domain import from prototype, filesystem, HTTP,
database, ORM, transport, Git, or test code.
```

The state-source port is the inward-facing seam. Any concrete productive
provider is composed outside the domain contract and cannot leak infrastructure
types into the adapter or values.

```text
DEPENDENCY_DIRECTION_VIOLATIONS = 0
INFRASTRUCTURE_LEAKAGE_POINTS = 0
```

## 13. Invariant Placement

| Invariant | Domain Enforcement | Durable Protection | Application Guard | Test |
|---|---|---|---|---|
| Only the exact requested canonical STAGE can be observed | T001 canonical identity resolution and `CanonicalIdentityReference.equals` | persistence identity lookup remains T001/PLAT-owned | adapter resolves before pipeline/source access and rejects mismatch | unknown, detached, wrong-kind, and source-identity mismatch |
| Stage and aggregate revision come from the current pipeline | `WorkflowPipeline` immutable state | PLAT/T004 storage contract; no T013 write | adapter ignores caller claims and source stage/revision substitutes | exact stage/revision preservation |
| All four precondition statuses are present and valid | `CommandPreconditionEvidence.create` | source durability is outside T013; no default row is permitted | adapter rejects missing or invalid source data | missing/incomplete and every status family |
| Both freshness tokens are present and copied exactly | `CommandAuthorityFreshness.create` | physical version storage is owner-specific | adapter creates fresh tokens on every call; no cache | token equality and same-status freshness drift |
| Returned observation is immutable | existing frozen values plus `Object.freeze` on the assembled result | no persistence mutation in T013 | no mutable reference is exposed as authority | `Object.isFrozen` and mutation-attempt tests |
| A stale/superseded/revoked/invalidated/inconsistent source cannot become eligible/compatible | canonical source supplies typed status or absence; T013 never upgrades facts | physical source integrity remains source owner | adapter returns `undefined`; T005 maps/rejects fail-closed | all listed negative source states |
| A second read is independent | no semantic cache or self-comparison in adapter | T005 CAS remains physical integrity only | existing `CommandPreconditionPolicy.detectDrift` compares first/second reads | mutation between calls and same-status token drift |
| T013 cannot accept a caller/default/projection as authority | reader has no command-input parameter beyond canonical identity | none; no write path | factory does not accept a `CommandAuthorityReader` substitute | conflicting caller claims and missing-source no-fallback tests |

`UNPLACED_DOMAIN_INVARIANTS = 0`.

## 14. Persistence Design

T013 is read-only and has no aggregate storage boundary of its own.

```text
AGGREGATE_STORAGE_BOUNDARY = NOT_APPLICABLE for T013 writes; read through PipelineRepository.find
SERIALIZATION_BOUNDARY = NOT_APPLICABLE; serialized material must already have passed T004 reconstruction
CONCURRENCY_REVISION_MECHANISM = PipelineRevision for current pipeline state; dependency/verdict freshness tokens for semantic reread
ATOMICITY_BOUNDARY = NOT_APPLICABLE in producer; T005 PipelineRepository.advance/CAS is the commit boundary
REGISTRY_INDEX_RELATIONSHIP = NOT_APPLICABLE; no new registry or index
DURABLE_INVARIANT_PROTECTION = T004/PLAT pipeline persistence contract and downstream T005/PLAT rejection contract; no T013 durable writer
INTEGRITY_VALIDATION = identity/pipeline authority checks plus source completeness/binding; physical integrity remains its owner
RECOVERY_BEHAVIOR = consume only a valid current WorkflowPipeline; do not rehydrate or infer from a scalar/checkpoint
ARCHIVAL_BEHAVIOR = NOT_APPLICABLE
```

The state-source contract is read-only and must not expose a generic mutation
API. If a runtime source cannot produce complete canonical facts, the adapter
returns no observation. It must not fill missing values from the command,
`AdrAuthorityReader`, projection, default, or prior observation. T013 does not
mandate a database, schema, serializer, journal, or migration.

## 15. Lifecycle Design

T013 observes lifecycle state but does not own a lifecycle transition.

```text
STATE_SET = PIPELINE_STAGES from T004 / WorkflowPipeline
INITIAL_STATE = ACCEPTED_ADRS at aggregate revision 0, established by WorkflowPipeline.create
ALLOWED_TRANSITIONS = WorkflowPipeline immediate-successor transitions, owned by T004
REJECTED_TRANSITIONS = unknown/skip/invalid pipeline transitions, rejected by WorkflowPipeline/T005
MUTATION_AUTHORITY = WorkflowPipeline through the existing command handler
REPOSITORY_CONTRACT = PipelineRepository.find for T013; PipelineRepository.advance/CAS is outside T013
ISOLATION_INVARIANT = observing command authority cannot change pipeline stage, revision, or any other machine
STATE_TRANSITION_TEST = NOT_APPLICABLE as a T013 mutation; T005 regression directly proves drift prevents advance
```

Invalid, terminal, recovery, and persistence bypass rules remain with their
existing owners. T013 forbids direct stage setters, scalar rehydration,
repository writes, status-derived transitions, and any command acceptance
branch. The reader returns current state or no observation; it never advances a
pipeline.

## 16. Cross-Spec Integration

```text
NOT_APPLICABLE for T013 local execution and closure: the producer consumes only
DOM-owned T001/T004 boundaries and the DOM-owned command-authority source.
```

The following downstream cross-SPEC proof is explicitly preserved but is not a
T013 integration seam:

| Foreign Owner | Contract | Local Integration Point | ACL | Forbidden Local Ownership |
|---|---|---|---|---|
| `SPEC-PLAT-001` | `PCP-PLAT-05`: PLAT produces durable command/rejection records with correlation and physical revision; T005 consumes them | T005 `CommandRejectionRecorder`, downstream of T013; not invoked by the producer | NOT_APPLICABLE to T013 | journal, persistence, CAS, retry, recovery, and physical rejection recording |
| `SPEC-BACKEND-001` | `PCP-BACKEND-01`: maps canonical T005 result without changing family/code/reason/state | T005 result mapping, downstream of T013; not invoked by the producer | NOT_APPLICABLE to T013 | transport, authentication, response mapping, and semantic reinterpretation |

For both records: `AUTHORITY_STATUS = DEFINED`, `CONTRACT_STATUS = DEFINED`,
`SEMANTIC_STATUS = DEFINED_BY_APPROVED_OWNER_CONTRACT`,
`LOCAL_TESTABILITY = NO` for the foreign productive producer,
`PRODUCTIVE_AVAILABILITY = NO` at this design baseline, and
`DEPENDENCY_CLASS = REQUIRED_FOR_INTEGRATED_PROOF`. Their unavailability does
not block T013 local closure and no downstream promotion is claimed.

## 17. Main Interaction Flow

1. The runtime calls `createAdvancePipelineHandler` with the canonical identity
   authority, pipeline repository, canonical command-authority state source,
   and rejection recorder.
2. The factory constructs one `CanonicalCommandAuthorityReader` and injects it
   into the existing `AdvancePipelineHandler`; it does not accept a prebuilt
   `CommandAuthorityReader` from the caller.
3. T005 calls `observe(requestedIdentity)` for the initial command basis.
4. The adapter resolves the exact canonical STAGE through T001. Failure or
   identity mismatch returns `undefined` before pipeline/source state is used.
5. The adapter reads the current `WorkflowPipeline` through T004's repository
   port and reads the canonical command-authority state through the explicit
   state-source port. Both reads are fresh for this call.
6. The adapter validates source identity binding, constructs fresh immutable
   precondition/freshness values, and freezes the complete observation.
7. T005 evaluates the observation and, immediately before commit, invokes the
   same productive reader again. T005 owns drift rejection, domain transition,
   rejection recording, and CAS.

No step derives authority from command input, an ADR-only observation, a
projection, a default, a prior observation, or a test-only implementation.

## 18. Failure / Recovery Flow

| Failure point | Detection | Durable evidence | Failure owner | Retry owner | Idempotency boundary | Recovery path | Reconciliation path | Terminal failure rule |
|---|---|---|---|---|---|---|---|---|
| Unknown/detached/wrong-kind identity | T001 resolution or exact equality check | none in read-only T013; T005 records canonical rejection if invoked | DOM identity authority / T005 mapping | T005/application caller under valid new basis | no producer mutation | re-resolve exact canonical reference; never fallback | T005 re-observes before commit | return no observation; no state/effect |
| Missing pipeline | `PipelineRepository.find` returns undefined | none in T013 | T004 repository boundary / T005 failure mapping | T005 | no producer mutation | reload through canonical repository | T005 maps to canonical unknown-spec semantics | no observation; no advance |
| Missing/incomplete/invalid/mismatched command state | state source returns undefined or adapter validation fails | source owner’s evidence, if any; no T013 write | DOM command-authority source / T013 boundary | source owner or T005, not an internal T013 retry loop | no cache and no mutation | obtain a fresh complete source read | T005 second read and typed policy evaluation | no eligible/compatible observation |
| Status/freshness drift between observations | T005 `detectDrift` sees changed stage/revision/token/status | T005 rejection record; physical durability is PLAT-owned | T005 semantic policy | T005/outer command orchestrator | command correlation and PLAT record, outside T013 | preserve accepted pipeline and reject | T005 reread plus PipelineRepository CAS | no effect/transition |
| Source technical exception | adapter does not convert an invalid read into valid authority; known authority absence is `undefined` | no T013 write | source/adapter boundary; T005 maps only according to existing error contract | owning application/adapter | no producer mutation | retry only through the owning source/application policy | T005 must obtain a new independent read | never default or self-compare |

### Temporal authority proof

```text
TEMPORAL_AUTHORITY_PROOF = COMPLETE_FOR_T013_HANDOFF; final evidence = EV-DOM-IMP-13-TEMPORAL-REOBSERVATION
INITIAL_OBSERVATION = T005 calls the productive CanonicalCommandAuthorityReader.observe for the exact canonical STAGE
VERSION_REVISION_HASH_OR_CORRELATION = canonical identity revision + PipelineRevision + dependencyRevision + verdictRevision + command correlation
MUTATION_WINDOW = initial observation through T005 action and PipelineRepository.advance commit
RELEVANT_COMMIT_POINT = T005 second productive observe followed by existing PipelineRepository.advance/CAS
INDEPENDENT_SECOND_OBSERVATION = the same production reader executes fresh identity, pipeline, and state-source reads; no cache or reused observation
DRIFT_DETECTION = existing CommandPreconditionPolicy.detectDrift compares identity, stage, aggregate revision, both freshness tokens, and all four statuses
FAIL_CLOSED_BEHAVIOR = changed/missing/inconsistent second read yields canonical rejection; advance is not called and state remains unchanged
STATE_PRESERVATION = existing T005 no-effect boundary and T004 aggregate immutability
SEMANTIC_VALIDATION_OWNER = DOM command policy in T005; T013 validates only completeness and identity binding
CAS_OR_PHYSICAL_INTEGRITY_ROLE = PipelineRepository/PLAT CAS protects physical last-write-wins; it is not semantic revalidation
PROOF_EVIDENCE = ticket §11 EV-DOM-IMP-13-TEMPORAL-REOBSERVATION plus affected T005 regression output
```

```text
CALLER_AS_AUTHORITY_CHECK = PASS
CALLER_SUPPLIED_AUTHORITY_BYPASS = 0
```

The caller supplies only the identity query to the reader. Command precondition
claims are not an input to the productive reader and cannot become canonical
authority. `TEMPORAL_AUTHORITY_GAPS = 0` for the defined T013→T005 handoff;
implementation evidence is still required before capability promotion.

## 19. Clean Code Assessment

| Check | Result | Evidence / constraint |
|---|---|---|
| `CLEAR_DOMAIN_NAMING` | PASS | `CanonicalCommandAuthorityReader`, `CanonicalCommandAuthorityStateReader`, and `createAdvancePipelineHandler` name concrete responsibilities |
| `SMALL_COHESIVE_METHODS` | PASS | `observe` performs one read/composition operation; validation helpers remain local and focused |
| `EXPLICIT_SIDE_EFFECTS` | PASS | observation is read-only; handler/CAS effects remain visible in existing T005 flow |
| `EXPLICIT_MUTATION_BOUNDARIES` | PASS | no mutation API on the source; pipeline mutation remains `advance`/CAS |
| `NO_BOOLEAN_PARAMETER_EXPLOSION` | PASS | no mode flags |
| `NO_LONG_PARAMETER_LISTS` | PASS | factory takes one named dependency object; adapter dependencies are the three required ports |
| `NO_PRIMITIVE_OBSESSION_WHERE_DOMAIN_TYPE_EXISTS` | PASS | canonical identity, `PipelineRevision`, precondition evidence, and freshness use existing domain types; output stage string is preserved because it is frozen by the existing port contract |
| `NO_MAGIC_VALUES` | PASS | no new status meanings or fallback constants; existing typed status constructors are reused |
| `NO_GENERIC_UTIL_BUCKETS` | PASS | no helper/util bucket is introduced |
| `NO_GENERIC_SERVICE_BUCKETS` | PASS | names are specific to command-authority observation and composition |
| `NO_DUPLICATED_DOMAIN_RULES` | PASS | identity, stage, command-policy, and failure decisions remain in existing owners |
| `NO_DEEP_NESTING_BY_DESIGN` | PASS | ordered fail-closed guards and focused construction path |
| `NO_COMMENT_DEPENDENT_CORRECTNESS` | PASS | source binding, required fields, and no-cache behavior are executable contracts |
| `NO_HIDDEN_TEMPORAL_COUPLING` | PASS | every observe call performs new reads; T005 owns the explicit second-read sequence |
| `NO_UNNECESSARY_MUTABILITY` | PASS | immutable values and frozen observation; no mutable cache |

The only intentional primitive boundary is `CommandAuthorityObservation.stage:
string`, which is part of the existing frozen consumer contract. The adapter
uses the canonical `PipelineStage` value internally and does not create a
parallel stage type or alter T005’s contract.

## 20. Test Design

### Required direct test surfaces

| Behavior / Invariant | Test Type | Target | Expected Proof |
|---|---|---|---|
| Complete productive observation | UNIT / APPLICATION / NEGATIVE_BEHAVIOR | `CanonicalCommandAuthorityReader.observe` through `src` implementation | exact identity, stage, aggregate revision, four statuses, and two freshness tokens; result and nested values frozen |
| Canonical identity attachment | DOMAIN_INVARIANT / NEGATIVE_BEHAVIOR | observation adapter with T001 authority and T004 repository | unknown, detached, wrong-kind, and mismatched source identity return no observation and do not read/advance pipeline |
| Complete source requirement | DOMAIN_INVARIANT / NEGATIVE_BEHAVIOR | `CanonicalCommandAuthorityStateReader` input boundary | missing/incomplete/invalid facts produce no observation; no default or projection fallback |
| Supersession/revocation/invalidation/freshness | NEGATIVE_BEHAVIOR / STALE_PROTECTION | source state plus adapter | typed ineligible/incompatible/missing facts remain non-eligible/non-compatible; same-status token drift is preserved exactly |
| Independent reread and no effect | TEMPORAL / STALE_PROTECTION / INTEGRATION | productive reader + existing `AdvancePipelineHandler` | mutation between first and second source reads is observed by T005; `PipelineRepository.advance` is not called and stage/revision remain unchanged |
| Runtime composition | INTEGRATION / ARCHITECTURE_CONFORMANCE | `createAdvancePipelineHandler` in non-test `src` | factory constructs the production reader, injects it, and a command exercises it; no test reader is registered |
| Boundary ownership | ARCHITECTURE_CONFORMANCE / NEGATIVE_BEHAVIOR | runtime factory and productive import graph | conflicting caller claims, ADR-only source, projection, default, fake, and self-comparison cannot establish authority; direct runtime behavior proves the boundary, import guard supplements it |
| T005 regression | INTEGRATION / CONCURRENCY / IDEMPOTENCY | existing T005 suite after composition | canonical acceptance/rejection, drift, no-effect, stale/CAS, replay, and concurrency behavior remain owned by T005/PLAT |

### ACCEPTANCE_WITNESS_MATRIX

| NORMATIVE_BEHAVIOR | NORMATIVE_VERB | CONCRETE_OPERATION_COMMAND_OR_QUERY | STATE_OR_TRANSITION_AFFECTED | DIRECT_POSITIVE_TEST | DIRECT_NEGATIVE_OR_ISOLATION_TEST | EXPECTED_EVIDENCE_FILE | ACCEPTANCE_OWNER | REQUIRED_PRODUCER_OR_CAPABILITY | AUTHORITY_STATUS | CONTRACT_STATUS | LOCAL_TESTABILITY | PRODUCTIVE_AVAILABILITY | CAPABILITY_SUMMARY_STATUS | DEPENDENCY_CLASS | WITNESS_EXECUTABLE_AT_LOCAL_CLOSURE | EVIDENCE_TYPE |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `T13-AC1` complete productive observation | returns | `CanonicalCommandAuthorityReader.observe(knownCanonicalStage)` | read-only command-authority observation | focused T013 test executes the `src` reader and asserts exact identity, stage, aggregate revision, all four statuses, and both tokens | same test mutates the returned object/nested values and asserts immutable state; missing required field has no valid result | `docs/tickets/SPEC-DOM-001/evidence/TICKET-013/EV-DOM-IMP-13-AUTHORITY-READER-COMPLETE.md` | DOM-IMP-13 | T001 identity + T004 pipeline + DOM command-authority state source | `DEFINED` | `DEFINED` | `YES` | `YES` for the local producer implementation; output capability promotion remains pending | `CONTRACT_PRODUCTIVELY_AVAILABLE` for local producer behavior; downstream capability promotion not yet claimed | `REQUIRED_FOR_LOCAL_CLOSURE` for T013 producer evidence | `YES` | `LOCAL_TEST_EVIDENCE` |
| `T13-AC2` fail-closed source boundary | rejects / returns no observation | `observe` with unknown, detached, incomplete, stale, superseded, revoked, invalidated, or inconsistent source | no command transition; existing pipeline unchanged | known complete state control case returns the exact valid observation | each invalid source case executes `observe` and asserts `undefined`, no default, no caller substitution, and no repository advance | `docs/tickets/SPEC-DOM-001/evidence/TICKET-013/EV-DOM-IMP-13-BOUNDARY-NEGATIVE.md` | DOM-IMP-13 | canonical identity and command-authority state source | `DEFINED` | `DEFINED` | `YES` | `YES` for local producer evidence | `CONTRACT_PRODUCTIVELY_AVAILABLE` for local producer behavior; no T005 promotion | `REQUIRED_FOR_LOCAL_CLOSURE` | `YES` | `LOCAL_TEST_EVIDENCE` |
| `T13-AC3` freshness and independent reread | re-reads / exposes drift | two calls to the productive reader and the existing T005 command path | pipeline stage/revision and command-authority freshness/preconditions before commit | source spy records two independent reads and returns two observations with changed token/status; T005 sees the change | same-status freshness drift, stage/revision drift, and source disappearance each reject before `advance`; prior state remains unchanged | `docs/tickets/SPEC-DOM-001/evidence/TICKET-013/EV-DOM-IMP-13-TEMPORAL-REOBSERVATION.md` | DOM-IMP-13 producer plus T005 consumer regression | `CAP-DOM-COMMAND-AUTHORITY-OBSERVATION` from DOM-IMP-13 | `DEFINED` | `DEFINED` | `YES` | `YES` for the local reread witness; promotion still requires the record | `CONTRACT_PRODUCTIVELY_AVAILABLE` for producer evidence; downstream capability remains pending until promotion | `REQUIRED_FOR_LOCAL_CLOSURE` for T013 evidence; `REQUIRED_FOR_LOCAL_EXECUTION` at T005 handoff | `YES` | `LOCAL_TEST_EVIDENCE` plus affected T005 regression |
| `T13-AC4` runtime composition | wires / injects | `createAdvancePipelineHandler(dependencies).handle(command)` | command execution path and authority dependency graph | factory-created handler executes through the productive reader and source spy; command behavior reflects source facts | passing a test-only `CommandAuthorityReader` is impossible through the factory contract; runtime import graph and execution prove no test/prototype reader is registered | `docs/tickets/SPEC-DOM-001/evidence/TICKET-013/EV-DOM-IMP-13-COMPOSITION.md` | DOM-IMP-13 | productive `CanonicalCommandAuthorityReader` and factory | `DEFINED` | `DEFINED` | `YES` | `YES` for local composition evidence | `CONTRACT_PRODUCTIVELY_AVAILABLE` for local producer behavior; no unrecorded promotion | `REQUIRED_FOR_LOCAL_CLOSURE` | `YES` | `LOCAL_TEST_EVIDENCE` plus executable architecture guard |
| `T13-AC5` boundary ownership | forbids / preserves | productive reader and factory with conflicting caller claims, ADR-only reader, projection, default, fake, or self-comparison | canonical authority ownership and no-effect command boundary | valid source plus conflicting caller preconditions still yields source-derived observation/consumer result | absent command state returns no observation; ADR-only/projection/default/fake/self-comparison paths are not accepted; T005 state/effect remains unchanged on drift | `docs/tickets/SPEC-DOM-001/evidence/TICKET-013/EV-DOM-IMP-13-BOUNDARY-NEGATIVE.md` | DOM-IMP-13 | DOM-owned canonical source; T001/T004 inputs; T005 remains semantic consumer | `DEFINED` | `DEFINED` | `YES` | `YES` for local boundary evidence | `CONTRACT_PRODUCTIVELY_AVAILABLE` for local producer behavior; downstream promotion pending | `REQUIRED_FOR_LOCAL_CLOSURE` | `YES` | `LOCAL_TEST_EVIDENCE` plus architecture/runtime guard |

Lifecycle/progress declaration for the applicable T13-AC3 witness:

```text
STATE_SET = PIPELINE_STAGES
INITIAL_STATE = ACCEPTED_ADRS / PipelineRevision(0)
ALLOWED_TRANSITIONS = T004 WorkflowPipeline immediate successors only
REJECTED_TRANSITIONS = T004 invalid/skip/unknown transitions; T005 stale or authority drift
MUTATION_AUTHORITY = WorkflowPipeline through AdvancePipelineHandler
REPOSITORY_CONTRACT = PipelineRepository.find for observation; advance/CAS only after T005 validation
ISOLATION_INVARIANT = observation and failed reread do not mutate pipeline or other machines
STATE_TRANSITION_TEST = T005 regression directly asserts no advance on drift
```

Atomicity/concurrency declaration for the same witness:

```text
CONCURRENCY_CONTRACT = fresh semantic reread plus existing expected-revision CAS
ONE_WINNER_EXPECTATION = existing T005/T004 concurrent command path retains one CAS winner
DUPLICATE_STATE_EXPECTATION = duplicate/rejected command does not create a second pipeline transition
DETERMINISTIC_INTERLEAVING_OR_ADAPTER_TEST = source sequence/barrier test changes the state between first and second reads
```

The T013 acceptance rows all have direct operations, direct positive and
negative witnesses, executable local evidence paths, and local capabilities.
The producer output’s `PRODUCTIVE_AVAILABILITY = NO` is a downstream handoff
fact, not an unavailable prerequisite for T013’s own closure.

```text
ACCEPTANCE_WITNESS_MATRIX_ROWS = 5
DIRECT_BEHAVIOR_WITNESSES = 5
PROXY_ONLY_BEHAVIORS = 0
UNTESTED_STATE_TRANSITIONS = 0
UNPROVEN_CONCURRENCY_CONTRACTS = 0
MISSING_ARCHITECTURE_GUARDS = 0
DESIGN_TEST_COVERAGE_GATE: PASS
```

## 21. Structural Risk Assessment

| Risk | Level | Mitigation |
|---|---|---|
| `GOD_COMPONENT_RISK` | LOW | adapter composes three reads and one immutable output; policy and commit stay in T005 |
| `OVERSIZED_FILE_RISK` | LOW | use a dedicated `command-authority.ts`; do not enlarge the existing pipeline handler with source mechanics |
| `RESPONSIBILITY_MIXING_RISK` | LOW | separate source port, observation adapter, and composition factory |
| `EXCESSIVE_DEPENDENCY_RISK` | LOW | exactly identity authority, pipeline repository, and command-state source; no transport or persistence SDK |
| `DUPLICATION_RISK` | LOW | reuse existing identity, pipeline, evidence, freshness, and policy types |
| `TESTABILITY_RISK` | LOW | narrow synchronous ports and a source spy make first/second reads deterministic |
| `CROSS_SPEC_LEAKAGE_RISK` | LOW | no foreign capability is consumed; downstream PLAT/BACKEND contracts remain outside the adapter |
| `ARCHITECTURE_DRIFT_RISK` | LOW | runtime factory is specific and executable; architecture guard forbids prototype/test/infrastructure imports and reader substitution |
| `ANEMIC_DOMAIN_MODEL_RISK` | LOW | no new domain behavior is moved to an anemic service; aggregate/policy owners remain intact |
| `FAT_APPLICATION_SERVICE_RISK` | LOW | factory wires only; reader assembles only; `AdvancePipelineHandler` keeps existing orchestration |
| `FAT_INTERFACE_RISK` | LOW | the new state port exposes only one cohesive read capability |
| `PRIMITIVE_OBSESSION_RISK` | LOW | existing domain value objects are reused; stage string is retained solely for contract compatibility |
| `DEPENDENCY_INVERSION_RISK` | LOW | application consumes domain ports and no concrete technology |
| `INFRASTRUCTURE_LEAKAGE_RISK` | LOW | no serializer, database, HTTP, filesystem, or PLAT type enters the domain/application adapter |
| `DOMAIN_RULE_DUPLICATION_RISK` | LOW | T013 never evaluates command failures or pipeline transitions |
| `PREMATURE_ABSTRACTION_RISK` | LOW | one source port is required by the explicit producer/consumer boundary; no generic provider framework |
| `OVERENGINEERING_RISK` | LOW | one adapter and one factory are the minimum structure needed for a productive runtime seam |

```text
HIGH_STRUCTURAL_RISKS = 0
HIGH_DDD_RISKS = 0
HIGH_SOLID_RISKS = 0
HIGH_CLEAN_CODE_RISKS = 0
```

## 22. Implementation Sequence

1. **Freeze the input/output contracts.** Reuse the existing
   `CommandAuthorityReader`, `CommandPreconditionEvidence`,
   `CommandAuthorityFreshness`, `CanonicalIdentityReference`, and pipeline
   contracts. Add only the narrow state-source input contract if absent.
   Immediately test: type-level completeness, exact STAGE identity, and
   invalid source-shape rejection.
2. **Implement the observation adapter.** Resolve identity first, then read the
   current pipeline and canonical command-authority source. Validate source
   identity binding and complete fields, create fresh immutable values, and
   return a frozen observation or `undefined`. Immediately test: complete
   positive observation, every missing/invalid/detached negative, and frozen
   output.
3. **Make rereads genuinely independent.** Ensure `observe` performs no cache,
   memoization, source snapshot reuse, self-comparison, or fallback. Immediately
   test: state/freshness mutation between two calls changes the second result.
4. **Add the runtime composition factory.** Accept canonical ports and the
   canonical state-source port, construct the productive reader internally, and
   inject it into `AdvancePipelineHandler`. Immediately test: a factory-created
   handler exercises the production reader and no test reader is registered.
5. **Run the existing T005 consumer path.** Do not move policy, failure mapping,
   rejection recording, no-effect behavior, or CAS into T013. Immediately test:
   T005’s valid/invalid/stale/freshness/no-effect/replay/concurrency regression
   through the composed reader.
6. **Run architecture and dependency guards.** Traverse direct and transitive
   imports from the new runtime composition, execute the factory path, and
   verify no prototype/test/infrastructure/transport authority enters the
   productive graph. Immediately test: executable architecture guard and
   source-only-reader exclusion.
7. **Produce evidence and handoff.** Record the four required T013 evidence
   files, focused producer output, affected T005 output, exact source baseline,
   and independent producer audit. Immediately verify: every witness matrix row
   has direct evidence and no productive availability promotion is claimed.

No step changes ADRs, SPEC, Gap Matrix, Plan, ticket scope, PLAT persistence,
T005 policy ownership, or downstream ticket readiness.

## 23. Files Expected to Change

| Path / Area | Classification | Reason |
|---|---|---|
| `src/application/command-authority.ts` | EXPECTED_CREATE | productive `CanonicalCommandAuthorityReader` adapter and fail-closed composition |
| `src/application/composition.ts` | EXPECTED_CREATE | non-test factory that constructs and injects the productive reader |
| `src/domain/command.ts` | POSSIBLE_MODIFY | add only the narrow canonical state-source input/port contract if the existing command contract has no equivalent; preserve all existing output/failure semantics |
| `tests/dom-001-ticket-013.test.ts` | EXPECTED_CREATE | direct producer, negative, reread, composition, and architecture witnesses |
| `tests/dom-001-ticket-005.test.ts` | POSSIBLE_MODIFY | rerun or minimally adapt affected T005 regression to use the runtime composition; do not change T005 ownership or acceptance meaning |
| `docs/tickets/SPEC-DOM-001/evidence/TICKET-013/` | EXPECTED_CREATE_AT_COMPLETION | four required producer evidence records |
| `docs/tickets/SPEC-DOM-001/DOM-001-TICKET-013-implementation-design.md` | CREATED_NOW | this design artifact only |
| `src/domain/identity.ts` | MUST_NOT_MODIFY | T001 canonical identity authority |
| `src/domain/pipeline.ts` | MUST_NOT_MODIFY | T004 pipeline/provenance authority; T013 reads its contract |
| `src/application/pipeline.ts` | MUST_NOT_MODIFY unless a strictly local injection-preserving composition adjustment is required | T005 command policy/commit consumer |
| `src/application/command.ts` | MUST_NOT_MODIFY | T005 canonical command boundary and error orchestration |
| `prototype/**` | MUST_NOT_MODIFY | non-authoritative scenario model |
| `docs/adrs/**`, `docs/specs/**`, other ticket definitions and audit artifacts | MUST_NOT_MODIFY | frozen upstream authority and historical audit ownership |

## 24. Open Questions / Blockers

```text
NONE
```

The concrete implementation name and module placement are legitimate technical
choices already bounded here. The canonical statuses, freshness meanings,
identity, lifecycle, persistence meaning, failure taxonomy, and ownership are
not open design decisions. If implementation preflight cannot provide a
non-test source for the complete command-authority facts, it must stop and
report the capability as unavailable; it must not use a fixture, caller claim,
default, or a new local authority to bypass this design.

## 25. Design Metrics

```text
RESPONSIBILITIES = 7
DOMAIN_CONCEPTS = 7
AGGREGATE_ROOTS = 1 referenced / 0 introduced
ENTITIES = 0
VALUE_OBJECTS = 5 reused
DOMAIN_SERVICES = 0
DOMAIN_POLICIES = 0 introduced; existing T005 policy reused
APPLICATION_SERVICES = 1 composition factory
PORTS = 3 relevant (identity authority, pipeline repository, command-authority reader/state source; 1 new state-source port)
ADAPTERS = 1 new productive observation adapter
ANTI_CORRUPTION_LAYERS = 0
PROPOSED_COMPONENTS = 8 significant components
CRITICAL_INVARIANTS = 8
UNPLACED_DOMAIN_INVARIANTS = 0
TEST_SURFACES = 8
UNJUSTIFIED_SOLID_VIOLATIONS = 0
DEPENDENCY_DIRECTION_VIOLATIONS = 0
HIGH_STRUCTURAL_RISKS = 0
HIGH_DDD_RISKS = 0
HIGH_SOLID_RISKS = 0
HIGH_CLEAN_CODE_RISKS = 0
SPEC_IMPLEMENTABILITY_CHECK = PASS (SPEC audit §38; current Plan and fresh Plan audit preserve PASS)
IDENTITY_AUTHORITY_GAPS = 0
RECONSTRUCTION_AUTHORITY_GAPS = 0
LIFECYCLE_AUTHORITY_GAPS = 0
PERSISTENCE_SEMANTICS_GAPS = 0
CROSS_SPEC_AUTHORITY_GAPS = 0
PROHIBITED_NORMATIVE_DECISIONS = 0
AUTHORITY_CONSUMPTION_PROOFS = 3
PRODUCER_CONSUMER_CONTRACT_PROOFS = 3
TEMPORAL_AUTHORITY_PROOFS = 1 handoff proof
TEMPORAL_AUTHORITY_GAPS = 0
CALLER_SUPPLIED_AUTHORITY_BYPASS = 0
ACCEPTANCE_WITNESS_MATRIX_ROWS = 5
DIRECT_BEHAVIOR_WITNESSES = 5
PROXY_ONLY_BEHAVIORS = 0
UNTESTED_STATE_TRANSITIONS = 0
UNPROVEN_CONCURRENCY_CONTRACTS = 0
MISSING_ARCHITECTURE_GUARDS = 0
DESIGN_TEST_COVERAGE_GATE = PASS
```

Capability handoff status:

```text
CAPABILITY_ID = CAP-DOM-COMMAND-AUTHORITY-OBSERVATION
AUTHORITY_STATUS = DEFINED
CONTRACT_STATUS = DEFINED
LOCAL_TESTABILITY = YES after T013 producer tests
PRODUCTIVE_AVAILABILITY = NO before implementation/promotion
CAPABILITY_SUMMARY_STATUS = CONTRACT_TESTABLE_LOCALLY
DEPENDENCY_CLASS = REQUIRED_FOR_LOCAL_EXECUTION at T005 consumer
PROMOTION_RECORD = PROMO-DOM-COMMAND-AUTHORITY-01, not created by design
```

## 26. Design Gate

```text
IMPLEMENTATION_DESIGN_GATE: READY_FOR_IMPLEMENTATION
```
