# DOM-001-TICKET-001 — Implementation Design

## 1. Design Verdict

```text
IMPLEMENTATION_DESIGN_READY
```

The ticket has a coherent identity/lineage boundary, complete upstream
authority, explicit ownership, locally available contract fixtures, and direct
test surfaces. The design reuses the existing domain model and repository ports,
adds only the missing canonical Stage-reference boundary and rehydration seam,
and does not redesign the repository architecture or expand ticket scope.

## 2. Ticket

```text
Ticket ID: DOM-001-TICKET-001
Ticket path: docs/tickets/SPEC-DOM-001/DOM-001-TICKET-001-canonical-identity-lineage.md
Implementation Unit: DOM-IMP-01 — Canonical identity and lineage authority
Portfolio Obligations: O-001, O-005
Requirements: DOM-ID-001, DOM-LINEAGE-001
Gap IDs: GAP-001, GAP-006
Historical note: GAP-002 is retained only as obsolete evidence for the removed
parallel PipelineId authority and is not a live implementation Gap.
Acceptance IDs: AC-DOM-001, AC-DOM-005
Status: READY
```

The ticket audit is conformant with `IMPLEMENTATION_TICKETS_CONFORMANT` and
`READY_FOR_IMPLEMENTATION`; its audit SHA is the current ticket-audit baseline
recorded in the ticket folder. The ticket has no internal or external blocker.

## 3. Implementation Responsibility

Implement the DOM-owned canonical identity and independent ADR↔SPEC lineage
boundary, including immutable revisioned records, exact resolution,
many-to-many progress, and the PLAT persistence/recovery contract without
retaining `PipelineId` as a parallel authority.

## 4. Repository Architecture Context

The repository is a small TypeScript domain/application codebase with no
productive infrastructure or persistence adapter currently present.

```text
src/domain
  identity.ts, lineage.ts, pipeline.ts, snapshot.ts
  value objects, immutable domain records, domain policies, repository ports

src/application
  thin command handlers that resolve identity and invoke domain boundaries

PLAT integration boundary
  consumed repository/recovery contracts; physical storage remains SPEC-PLAT-001

tests
  node:test + tsx-compatible executable tests using deterministic in-memory
  contract fixtures; tests/dom-001-ticket-001.test.ts is the local surface

prototype
  disposable scenario/UI evidence only; never imported by productive code
```

`src/domain` is the semantic boundary. `src/application` coordinates commands
and repository calls. Persistence, journal, physical CAS, recovery durability,
and external correlation are foreign integration responsibilities. No new
framework, layer, transport, database, schema, or event bus is authorized by
this ticket.

## 5. Existing Repository Context

| Existing Component | Classification | Current Responsibility | Design Use |
|---|---|---|---|
| `IdentityScope` in `src/domain/identity.ts` | REUSE | Validated immutable scope value | Use as the `ExecutionId` scope of a canonical Stage reference |
| `Revision` in `src/domain/identity.ts` | REUSE | Positive immutable identity revision | Preserve exact identity revision and predecessor ordering |
| `CanonicalIdentity` | EXTEND_WITHIN_TICKET | Generic kind/scope/value identity with canonical key | Keep generic identity semantics; narrow WorkflowPipeline creation through a Stage-specific factory |
| `CanonicalIdentityReference` | REUSE | Identity plus exact revision | Transport the canonical reference through commands, repositories, and rehydration |
| `CanonicalIdentityRecord` | EXTEND_WITHIN_TICKET | Immutable persisted identity record | Add an explicit validated rehydration constructor; preserve immutable creation |
| `CanonicalIdentityCatalog` | REUSE / EXTEND_WITHIN_TICKET | Creates and resolves records through repository and generator | Keep as the identity registry/application boundary; do not move invariants into handlers |
| `CanonicalIdentityRepository` | REUSE | `reserve` and exact `find` contract | Preserve atomic duplicate reservation and exact historical lookup |
| `AdrSpecLineage` | REUSE / EXTEND_WITHIN_TICKET | Immutable ADR↔SPEC relation and progress behavior | Keep endpoint validation, independent progress, and immutable `advance` |
| `AdrSpecLineageRepository` | REUSE | Reserve, CAS progress, find, and endpoint queries | Use pair key for uniqueness and expected-progress CAS for stale rejection |
| `CreateCanonicalIdentityHandler` / `ResolveCanonicalIdentityHandler` | REUSE | Thin identity command/query coordination | Keep as application entry points over `CanonicalIdentityCatalog` |
| `RegisterAdrSpecLineageHandler` / `AdvanceAdrSpecLineageHandler` | REUSE | Resolve endpoints, create relation, reserve/advance | Keep orchestration thin and preserve domain ownership |
| `WorkflowPipeline` in `src/domain/pipeline.ts` | REFACTOR_WITHIN_TICKET | Currently stores `PipelineId` as its identity | Replace only the identity authority with the canonical Stage reference; require DOM authority resolution for creation and accepted provenance authority for rehydration; leave pipeline transitions to TICKET-004 |
| `PipelineId` | REPLACE_BY_TICKET | Parallel local pipeline identity | Remove from canonical lookup/persistence paths; retain no productive authority |
| `tests/dom-001-ticket-001.test.ts` | EXTEND_WITHIN_TICKET | Deterministic identity/lineage and architecture tests | Add direct Stage-reference, persistence-contract, rehydration, and no-parallel-authority witnesses |
| `prototype/src/mockDomain.ts` | DO_NOT_TOUCH | Disposable UI scenario model | It is not productive authority or implementation evidence |

## 6. Domain Model Assessment

### Domain concepts

- `CanonicalIdentity`: immutable kind/scope/value identity without operational
  aliases.
- `CanonicalIdentityReference`: exact identity plus positive revision.
- `CanonicalIdentityRecord`: immutable historical record for one reference.
- `CanonicalStageReference`: a new narrow factory/value boundary over
  `CanonicalIdentityReference` that requires `kind = STAGE`, scope = the
  execution identity, and value = the StageId. It is not a second identity
  system and persists the existing generic reference shape.
- `IdentityScope`: validated execution scope.
- `Revision`: immutable identity revision.
- `AdrSpecLineage`: an independently mutable relation between one ADR reference
  and one SPEC reference.
- `LineageProgress`: immutable non-negative progress value.

### Aggregate roots and entities

- `WorkflowPipeline` remains the existing aggregate root for pipeline behavior;
  this ticket changes only its canonical identity slot and identity creation
  boundary. Pipeline stage transitions remain owned by TICKET-004.
- `AdrSpecLineage` is an independently closable relation consistency boundary;
  its pair key is the identity of the relation and its progress is immutable
  per transition.
- `CanonicalIdentityRecord` is an immutable historical entity managed by the
  identity catalog; it has no public mutation operation.

### Services, policies, ports, and events

- `CanonicalIdentityCatalog` is a cohesive domain registry/coordinator for
  create and exact resolve operations.
- Existing private identity validation functions and lineage endpoint rules are
  domain policies; keep them near the concepts they protect.
- `CanonicalIdentityRepository` and `AdrSpecLineageRepository` are the stable
  domain ports.
- No domain event is required. The ticket has no event-delivery boundary and
  should not introduce event-driven architecture.
- No anti-corruption layer is required for PLAT persistence: PLAT supplies a
  physical contract, while DOM concepts remain unchanged. A DTO mapper, if
  required by the future PLAT implementation, belongs to that integration
  owner, not to this ticket's domain model.

`ANEMIC_DOMAIN_MODEL_RISK = LOW`: identity and lineage invariants already live
in immutable value objects, records, and relation behavior. `FAT_APPLICATION_SERVICE_RISK = LOW`:
handlers remain thin and do not decide domain meaning.

## 7. UPSTREAM_AUTHORITY_PRECONDITIONS

All applicable upstream proofs are complete at ADR-0001 revision 3 and the
conformant Plan/Plan Audit baselines. No design decision below creates missing
normative authority.

| Concern | Proof / authority | Status | Design consequence |
|---|---|---|---|
| Identity | `ACP-DOM-01`; ADR-0001 `ADR0001-D001`, `ADR0001-D003`; SPEC `DOM-ID-001`; Plan `AGGREGATE_IDENTITY_PROOF` for `WorkflowPipeline` | COMPLETE | Use `CanonicalIdentityReference(kind=STAGE, scope=ExecutionId, value=StageId)` as the sole pipeline identity; `PipelineId` is not canonical |
| Lifecycle | ADR-0001 revision/succession boundary; TICKET-001 owns identity revision continuity only | COMPLETE | Preserve identity revision/predecessor rules; pipeline and decision lifecycle transitions remain outside this ticket |
| Persistence / recovery | `PCP-PLAT-01`; PLAT produces durable identity/lineage records, revision transport, and recovery result | COMPLETE | DOM exposes/consumes repository ports; PLAT owns physical durability, journal, and recovery mechanics |
| Rehydration | Plan `AGGREGATE_RECONSTRUCTION_PROOF = complete`; identity record and lineage endpoint/progress fields are explicit | COMPLETE | Add/use validated `CanonicalIdentityRecord.rehydrate`; require DOM identity authority for Stage creation and lineage endpoint resolution, an accepted lineage-history authority for progress, and an accepted provenance-history authority for pipeline rehydration; reject missing, invalid, or corrupted references without mutation |
| Concurrency | ADR-0001 identity uniqueness and lineage independence; repository reserve and expected-progress CAS contracts | COMPLETE | Atomic reserve has one winner; lineage advance uses expected progress and returns stale without mutation |
| Idempotency | `ACP-DOM-01`, ticket failure semantics, duplicate reservation contracts | COMPLETE | Repeated create/register does not create a second record or relation; no new idempotency key semantics are invented |
| Ownership | Portfolio O-001/O-005 assign `SPEC-DOM-001` as `CANONICAL_OWNER`; PLAT owns physical storage | COMPLETE | Domain decides identity/lineage meaning; persistence adapter never decides lifecycle or identity |
| Cross-SPEC dependency | Ticket `PCP-PLAT-01`; producer `SPEC-PLAT-001`, consumer `DOM-IMP-01`, local fixture available | COMPLETE | Consume only the explicit persistence/recovery boundary; do not duplicate PLAT capabilities |
| Temporal authority | Ticket `TEMPORAL_AUTHORITY_PROOF: NOT_APPLICABLE`; Plan classifies DOM-IMP-01 as having no external effect | NOT_APPLICABLE | No mutable external authority is observed and later effected here; stale identity/lineage revisions still fail closed through exact lookup/CAS |

`SPEC_IMPLEMENTABILITY_CHECK = PASS` and
`IMPLEMENTATION_UNIT_AUTHORITY_CHECK = PASS` at the Plan Audit baseline.

The only legitimate design choices are module placement, a Stage-specific
reference factory, explicit rehydration entry points, and the narrow
`WorkflowPipeline` identity seam. Canonical identity meaning, ownership,
revision semantics, persistence meaning, and lineage rules are not design
choices and remain fixed by upstream authority.

## 8. Aggregate / Consistency Boundaries

| Aggregate | Root | Invariants | Transaction / Consistency Boundary | External References |
|---|---|---|---|---|
| Workflow pipeline identity portion | `WorkflowPipeline` | canonical Stage kind; execution scope; StageId value; no `PipelineId` authority; identity revision is distinct from pipeline state revision | identity construction and exact repository reservation; pipeline state transition transaction remains TICKET-004 | `RepositoryId` and operational correlation remain foreign references; `ExecutionId` is represented as identity scope |
| ADR↔SPEC relation | `AdrSpecLineage` | endpoint kinds are exactly ADR and SPEC; pair uniqueness; progress advances from expected stored progress; one relation cannot mutate another | `reserve(pair)` and `advance(pair, expectedProgress)`; each returned object is immutable | ADR/SPEC canonical references, including their exact revisions |
| Identity catalog | `CanonicalIdentityCatalog` registry boundary | known kind, valid scope/value/revision, predecessor continuity, immutable historical resolution, duplicate rejection | repository reserve/find boundary; no update/delete operation | PLAT persistence contract only |

The identity catalog is a registry/coordinator rather than a generic mutable
bag. The relation aggregate is kept separate from identity records so
many-to-many progress cannot leak across pairs. No aggregate may be mutated by
an adapter, serializer, or caller-supplied `PipelineId`.

## 9. Responsibility Decomposition

| Responsibility | Authority | State Owned | Expected Test Surface |
|---|---|---|---|
| Validate canonical kind, scope, value, and revision | `SPEC-DOM-001`, DOM-ID-001 | `IdentityScope`, `Revision`, `CanonicalIdentity` | unit/domain invalid-input tests |
| Construct a canonical Stage reference | `SPEC-DOM-001`, DOM-ID-001 | Stage identity kind/scope/value/revision | direct positive and alternate-identity negative tests |
| Preserve identity revision continuity | ADR-0001, DOM-ID-001 | immutable `CanonicalIdentityRecord` history | predecessor, missing, stale, fork, and rehydration tests |
| Generate or accept an explicit identity value | DOM identity contract | identity value before reservation | deterministic generator and explicit-value tests |
| Reserve unique identity records | `CanonicalIdentityRepository` contract; PLAT physical owner | repository record key | one-winner duplicate/concurrency fixture |
| Resolve exact historical identity | DOM catalog contract | exact canonical key including revision | exact lookup, unknown reference, and historical lookup tests |
| Validate ADR↔SPEC endpoint kinds | DOM-LINEAGE-001 | `AdrSpecLineage` endpoints | endpoint inversion and unknown endpoint tests |
| Register a unique relation | DOM-LINEAGE-001 | relation pair key | duplicate isolation and many-to-many registration tests |
| Advance one relation | DOM-LINEAGE-001 | relation progress | independent progress, stale CAS, and idempotent retry tests |
| Persist/rehydrate identity and lineage | `PCP-PLAT-01` | serialized contract records; physical storage belongs to PLAT | deterministic persistence/recovery contract fixture |
| Remove parallel pipeline identity | DOM-ID-001 / historical GAP-002 evidence | `WorkflowPipeline.identity` canonical reference | executable API boundary and no-`PipelineId` authority test |

`RESPONSIBILITY_MIXING_RISK = LOW`. Domain decisions remain in domain types;
handlers coordinate; ports describe persistence; no component owns unrelated
transport, storage, scheduling, or presentation behavior.

## 10. Proposed Components

| Component | Type | Responsibility | Existing/New | Expected Location | Size |
|---|---|---|---|---|---|
| `IdentityScope` | VALUE_OBJECT | Validate and compare identity scope | Existing / reuse | `src/domain/identity.ts` | SMALL |
| `Revision` | VALUE_OBJECT | Validate and compare identity revision | Existing / reuse | `src/domain/identity.ts` | SMALL |
| `CanonicalIdentity` | VALUE_OBJECT | Validate kind/scope/value and produce canonical key | Existing / extend only as needed | `src/domain/identity.ts` | SMALL |
| `CanonicalStageReference` | VALUE_OBJECT / FACTORY | Narrow generic reference to `STAGE` + execution scope + StageId | New, same module | `src/domain/identity.ts` | SMALL |
| `CanonicalIdentityReference` | VALUE_OBJECT | Carry exact identity revision | Existing / reuse | `src/domain/identity.ts` | SMALL |
| `CanonicalIdentityRecord` | ENTITY | Immutable historical record and validated rehydration | Existing / extend | `src/domain/identity.ts` | SMALL |
| `CanonicalIdentityCatalog` | REGISTRY | Coordinate create, predecessor validation, reservation, and exact resolve | Existing / reuse and extend | `src/domain/identity.ts` | MEDIUM |
| `CanonicalIdentityRepository` | PORT | Reserve and find identity records | Existing / reuse | `src/domain/identity.ts` | SMALL |
| `AdrSpecLineage` | AGGREGATE_ROOT | Own endpoint validation and independent immutable progress | Existing / reuse and extend | `src/domain/lineage.ts` | SMALL |
| `AdrSpecLineageRepository` | PORT | Reserve, query, and expected-progress CAS | Existing / reuse | `src/domain/lineage.ts` | SMALL |
| Identity/lineage handlers | APPLICATION_SERVICE / COMMAND_HANDLER | Coordinate catalog/repository calls | Existing / reuse | `src/application/identity.ts`, `src/application/lineage.ts` | SMALL |
| `WorkflowPipeline` identity seam | AGGREGATE_ROOT | Consume canonical Stage reference without changing pipeline transitions | Existing / narrow refactor | `src/domain/pipeline.ts` | MEDIUM |

### Component ownership rules

- `CanonicalStageReference` owns only the Stage identity shape; it must not own
  persistence, pipeline transitions, or external correlation.
- `CanonicalIdentityRecord` owns immutability and rehydration validation; it
  must not mutate a predecessor or decide physical storage.
- `CanonicalIdentityCatalog` owns catalog orchestration and invariant ordering;
  it collaborates with the identity repository and generator and must not own
  HTTP, database, journal, retry, or projection concerns.
- `AdrSpecLineage` owns endpoint validity and progress transitions; it must not
  own identity creation or foreign lifecycle semantics.
- Handlers own request coordination only; they must not duplicate domain rules.
- `WorkflowPipeline` owns pipeline behavior already present; in this ticket it
  must not retain `PipelineId` as a lookup, persistence, or equality authority.
  Its public creation and rehydration seams must consume the approved DOM
  identity/provenance authorities before materializing canonical-looking state.
- PLAT owns physical storage, atomic durability, journal, and recovery mechanics;
  no PLAT implementation is created in the DOM ticket.

## 11. SOLID Assessment

| Component | SRP | OCP | LSP | ISP | DIP | Result |
|---|---|---|---|---|---|---|
| Identity value objects | PASS | NOT_APPLICABLE | NOT_APPLICABLE | NOT_APPLICABLE | PASS | PASS |
| `CanonicalStageReference` | PASS | NOT_APPLICABLE | NOT_APPLICABLE | NOT_APPLICABLE | PASS | PASS |
| `CanonicalIdentityCatalog` | PASS | PASS | NOT_APPLICABLE | PASS | PASS | PASS |
| `CanonicalIdentityRepository` | PASS | NOT_APPLICABLE | NOT_APPLICABLE | PASS | PASS | PASS |
| `AdrSpecLineage` | PASS | NOT_APPLICABLE | NOT_APPLICABLE | PASS | PASS | PASS |
| `AdrSpecLineageRepository` | PASS | NOT_APPLICABLE | NOT_APPLICABLE | PASS | PASS | PASS |
| Application handlers | PASS | NOT_APPLICABLE | NOT_APPLICABLE | PASS | PASS | PASS |
| `WorkflowPipeline` | PASS | NOT_APPLICABLE | NOT_APPLICABLE | PASS | PASS | PASS |

No Strategy, Factory hierarchy, generic service, base class, event bus, or
one-method ceremonial interface is needed. `UNJUSTIFIED_SOLID_VIOLATIONS = 0`.

## 12. Dependency Direction

```text
Domain value objects / records / aggregates
        ↑ depend on stable repository ports only
Application handlers / catalog coordination
        ↑ receive domain ports and invoke domain behavior
PLAT adapter and physical persistence (foreign owner)
        ↑ implements the repository/recovery contract without entering domain semantics
```

The existing repository uses direct domain ports rather than a separately
materialized infrastructure layer. Preserve that convention. The domain must
not import database, filesystem, HTTP, React, Vite, or prototype modules.

```text
DEPENDENCY_DIRECTION_VIOLATIONS = 0
INFRASTRUCTURE_LEAKAGE_POINTS = 0
```

## 13. Invariant Placement

| Invariant | Domain Enforcement | Durable Protection | Application Guard | Test |
|---|---|---|---|---|
| Known aggregate kind | `assertAggregateKind` / canonical Stage factory | Persist only validated record | Handler passes typed request; no alternate kind mapping | invalid kind and foreign assignment/session tests |
| Non-empty scoped identity value | `IdentityScope.create`, canonical identity validation | Record key stores kind/scope/value exactly | No filename-only input accepted | invalid scope/value and filename negative witness |
| Exact identity revision | `Revision.create`, reference equality | Repository key includes `revision` | Resolve exact reference only | historical and unknown-revision tests |
| Revision successor preserves identity | catalog predecessor compatibility policy | Reserve new immutable record; no overwrite | Catalog resolves predecessor before create | fork, wrong kind/scope, missing predecessor tests |
| Identity uniqueness | catalog + repository reservation result | PLAT atomic unique reserve | Handler maps duplicate to canonical failure | one-winner concurrent create fixture |
| Identity/record immutability | private constructors, frozen objects, no mutation API | Append/insert historical records; no rewrite | No update command exposed | frozen-object and rehydration tests |
| ADR↔SPEC endpoint direction | `AdrSpecLineage.createFromReferences` | Persist endpoint kinds and exact references | Register handler resolves both canonical endpoints | reversed endpoint negative witness |
| Relation uniqueness | pair `canonicalKey` and repository reserve | Atomic unique relation key | Register handler maps duplicate to canonical failure | duplicate isolation fixture |
| Independent relation progress | immutable `advance` on one relation | expected-progress CAS for that pair | Advance handler loads only requested pair | two relation isolation and stale CAS tests |
| No parallel `PipelineId` authority | Stage-reference construction and pipeline identity seam | Persist only canonical Stage reference | Application APIs accept canonical reference | executable no-alternate-authority guard |

`UNPLACED_DOMAIN_INVARIANTS = 0`. Durable protection is a PLAT contract
responsibility; DOM must ensure no public domain path bypasses the port.

## 14. Persistence Design

The ticket defines semantic persistence contracts, not physical storage.

- Identity records are serialized as the canonical kind, scope, value,
  revision, and creation timestamp. Rehydration validates the same invariant
  path and returns an immutable record.
- Lineage records carry both canonical endpoint references and progress. The
  pair key is stable and supports many-to-many queries by ADR or SPEC.
- `CanonicalIdentityRepository.reserve` must be an atomic uniqueness boundary;
  duplicate results are explicit and cannot overwrite existing history.
- `AdrSpecLineageRepository.advance` must compare the stored progress with the
  caller's expected progress before replacing the immutable relation value.
  A mismatch returns `STALE` and preserves stored state.
- Registry/list indexes are query aids, not alternate identity authority. Any
  physical index belongs to PLAT and must resolve back to the canonical key.
- No database schema, journal, outbox, migration, retry engine, or recovery
  implementation is introduced. The local tests use deterministic in-memory
  contract fixtures; integrated durability is the planned PLAT checkpoint.
- Corrupt, missing, wrong-kind, wrong-scope, wrong-revision, or detached
  lineage material fails closed before a new state is returned.
- Archival is `NOT_APPLICABLE` to this ticket; historical records must remain
  resolvable and immutable.

## 15. Lifecycle Design

The ticket does not define the pipeline or ticket state machines. Its bounded
identity/relation transitions are:

```text
Identity record: create revision 1 → reserve → resolve exact revision
Identity stream: resolve predecessor → create later revision preserving identity → reserve
Lineage relation: absent → register(progress 0) → advance(progress + 1)
```

Transition authority:

- `CanonicalIdentityCatalog` decides valid identity creation and revision
  continuity.
- `AdrSpecLineage` decides valid endpoint composition and progress transition.
- repositories persist/reserve, but never decide domain transitions.
- `WorkflowPipeline` keeps its existing stage-transition authority; only its
  identity input/equality/persistence reference changes here.

Invalid transitions include duplicate identity/relation, missing predecessor,
wrong kind/scope, non-positive or stale revisions, reversed ADR/SPEC endpoints,
cross-relation mutation, and attempts to use `PipelineId` as canonical lookup.
Recovery rehydrates only complete invariant-checked material. There are no
terminal transitions owned by this ticket.

## 16. Cross-Spec Integration

| Foreign Owner | Contract | Local Integration Point | ACL | Forbidden Local Ownership |
|---|---|---|---|---|
| `SPEC-PLAT-001` | `PCP-PLAT-01`: durable identity/lineage records, revision transport, atomic reservation/CAS, and recovery result | `CanonicalIdentityRepository` and `AdrSpecLineageRepository` ports in `src/domain` | NOT_APPLICABLE; persistence mapping must not import foreign domain semantics | physical database, journal, outbox, recovery engine, idempotency implementation, or storage-defined identity |

`ACP-DOM-01` proves DOM authority exists and is consumable. The PCP producer is
PLAT, the consumer is TICKET-001, the authority owner is DOM, returned data is
the same canonical identity/lineage reference plus revision/progress and
recovery result, and availability is a local deterministic contract fixture
for this ticket with physical PLAT durability deferred to the integration
checkpoint. Unknown, duplicate, missing, or stale records fail closed.

No foreign domain model crosses into the DOM aggregate. Repository DTO mapping,
if physically needed, is an adapter concern owned by PLAT and preserves the
canonical reference fields unchanged.

## 17. Main Interaction Flow

1. `CreateCanonicalIdentityHandler` receives explicit kind, execution scope,
   StageId/value, and optional revision/predecessor reference.
2. `CanonicalIdentityCatalog` validates kind/scope/value/revision. The
   Stage-specific creation path requires `STAGE` and uses the execution scope;
   `PipelineId` is not accepted as an identity source.
3. For revision 1, the catalog creates an immutable record. For a later
   revision, it resolves the predecessor, checks kind/scope/order and preserves
   the canonical identity value.
4. `CanonicalIdentityRepository.reserve` performs the unique reservation. A
   duplicate returns canonical `IDENTITY_ALREADY_EXISTS` without mutation.
5. `ResolveCanonicalIdentityHandler` constructs the exact reference and calls
   catalog resolution; missing history returns `IDENTITY_NOT_FOUND`.
6. `RegisterAdrSpecLineageHandler` resolves both endpoint references through
   the catalog, constructs `AdrSpecLineage`, and reserves the pair.
7. `AdvanceAdrSpecLineageHandler` loads one pair, creates an immutable next
   progress value, and calls expected-progress CAS. A stale result becomes
   `LINEAGE_CONCURRENT_MODIFICATION` and leaves all relations unchanged.
8. `WorkflowPipeline.create` resolves the canonical Stage reference through the
   DOM authority before materializing the initial aggregate.
9. Persisted identity/lineage records re-enter through validated rehydration;
   lineage progress and pipeline provenance must match accepted history returned
   by their reconstruction authorities; integrated PLAT recovery supplies the
   same contract fields.

## 18. Failure / Recovery Flow

| Failure point | Detection | Durable evidence | Failure owner | Retry owner | Idempotency boundary | Recovery / reconciliation |
|---|---|---|---|---|---|---|
| Invalid kind/scope/value/revision | domain value constructor | none; no write occurs | DOM | caller/application | command input validation | retry only with corrected canonical input |
| Missing or incompatible predecessor | catalog exact lookup/compatibility policy | prior record remains unchanged | DOM | caller/application | predecessor reference and revision | resolve historical record; no fabricated revision |
| Duplicate identity reservation | repository `DUPLICATE` result | existing canonical record | DOM for semantic failure; PLAT for atomic storage | application retry only if semantically intended | canonical identity key | return existing history or reject; never overwrite |
| Missing exact identity on resolve | repository `find` returns empty | no new record | DOM | caller/application | exact kind/scope/value/revision | fail closed; no fallback to filename or PipelineId |
| Duplicate lineage reservation | repository `DUPLICATE` result | existing relation | DOM | application | ADR-reference → SPEC-reference pair | preserve both existing relation and unrelated relations |
| Stale lineage progress | expected-progress CAS returns `STALE` | stored relation/progress | DOM semantic stale rule; PLAT physical CAS | application | relation key + expected progress | reload current relation; retry only with fresh state |
| Corrupt or detached persisted material | rehydration invariant validation and accepted-history authority comparison | rejected recovery record | DOM semantic reconstruction; PLAT supplies material | PLAT recovery owner | exact record identity and accepted history | fail closed; preserve last valid record and evidence |

`CALLER_AS_AUTHORITY_CHECK = PASS`: caller values are input to validation only;
canonical identity is resolved from the catalog and `PipelineId` cannot bypass
the Stage reference. `TEMPORAL_AUTHORITY_PROOF = NOT_APPLICABLE` because this
ticket performs no external effect. The repository CAS still protects stale
lineage mutation and preserves state on failure.

## 19. Clean Code Assessment

| Check | Result | Design constraint |
|---|---|---|
| Clear domain naming | PASS | Use `CanonicalStageReference`, `CanonicalIdentityRecord`, and `AdrSpecLineage`; avoid Manager/Helper/Util names |
| Small cohesive methods | PASS | Keep validation helpers and catalog operations focused |
| Explicit side effects | PASS | Repository reserve/advance calls are visible at catalog/handler boundaries |
| Explicit mutation boundaries | PASS | Domain objects are immutable; only repository reserve/CAS changes stored state |
| No boolean parameter explosion | PASS | Use typed request objects and explicit result unions |
| No long parameter lists | PASS | Existing input records remain the boundary; do not add positional arguments |
| No unjustified primitive obsession | PASS | `IdentityScope`, `Revision`, canonical identity/reference, and lineage progress carry semantics |
| No magic values | PASS | Reuse known aggregate kinds and explicit error codes |
| No generic utility/service buckets | PASS | Place behavior beside identity or lineage concepts |
| No duplicated domain rules | PASS | Handlers delegate; one catalog validates identity continuity; one relation validates endpoints/progress |
| No deep nesting | PASS | Use early validation and discriminated repository results |
| No comment-dependent correctness | PASS | Invariants are enforced by constructors, keys, and CAS contracts |
| No hidden temporal coupling | PASS | Predecessor lookup and expected-progress CAS are explicit |
| No unnecessary mutability | PASS | Records, references, progress, and aggregate transitions return frozen values |

`PREMATURE_ABSTRACTION_RISK = LOW`; the only new abstraction is the real
Stage-identity boundary required to remove `PipelineId` authority.

## 20. Test Design

| Behavior / Invariant | Test Type | Target | Expected Proof |
|---|---|---|---|
| Create, lookup, persist-contract, rehydrate, and compare canonical identity | UNIT + DOMAIN_INVARIANT + PERSISTENCE + RECOVERY | `tests/dom-001-ticket-001.test.ts` with deterministic `CanonicalIdentityRepository` fixture | exact kind/scope/value/revision round-trip and historical lookup |
| Reject unknown kind/scope/revision, missing predecessor, fork, and filename-only input | NEGATIVE_BEHAVIOR + STALE_PROTECTION | same test surface and catalog boundary | canonical error code and unchanged repository state |
| `PipelineId` cannot create or resolve canonical identity | ARCHITECTURE_CONFORMANCE + NEGATIVE_BEHAVIOR | `WorkflowPipeline` canonical Stage-reference API and application boundary | no productive API path treats `PipelineId` as identity authority |
| Reserve duplicate identity with one winner under deterministic interleaving | CONCURRENCY + IDEMPOTENCY | repository contract fixture with barrier | exactly one accepted record; duplicates preserve one record |
| Register ADR↔SPEC relation and reject reversed/unknown endpoints | UNIT + DOMAIN_INVARIANT + NEGATIVE_BEHAVIOR | `RegisterAdrSpecLineageHandler` | only ADR→SPEC endpoint pair is accepted |
| Register multiple pairs independently | UNIT + ISOLATION | lineage repository fixture | many-to-many list/find results remain independent |
| Reject duplicate pair without altering another pair | IDEMPOTENCY + ISOLATION | lineage reserve fixture | duplicate error; unrelated relation unchanged |
| Advance one relation with expected-progress CAS | STATE_TRANSITION + CONCURRENCY + STALE_PROTECTION | `AdvanceAdrSpecLineageHandler` and repository fixture | one relation progresses; stale attempt returns canonical error and no mutation |
| Rehydrate lineage with exact endpoints/progress and reject corruption | RECOVERY + NEGATIVE_BEHAVIOR | `AdrSpecLineage.rehydrate` plus accepted lineage-history authority | immutable exact relation; fabricated progress, invalid endpoint, or mismatched accepted history rejected |
| Rehydrate pipeline provenance only from accepted history | RECOVERY + NEGATIVE_BEHAVIOR + ARCHITECTURE_CONFORMANCE | `WorkflowPipeline.rehydrate` plus accepted provenance-history authority | shape-valid but unregistered, stale, detached, or mismatched provenance rejected |

### Complete acceptance witness mapping

| AC / normative behavior | Concrete operation | Direct positive test | Direct negative/isolation test | Expected evidence |
|---|---|---|---|---|
| AC-DOM-001 — create, lookup, persist, rehydrate, compare identity | identity create/lookup/rehydrate command | `T1-AC1-P` | `T1-AC1-N`: unknown kind/scope/revision and filename-only identity | `docs/tickets/SPEC-DOM-001/evidence/TICKET-001/AC-DOM-001-identity.md` |
| AC-DOM-001 — reject alternate `PipelineId` authority | WorkflowPipeline canonical identity creation/resolution | `T1-AC1-P2` | `T1-AC1-N2`: PipelineId substitution cannot create/retrieve identity | `docs/tickets/SPEC-DOM-001/evidence/TICKET-001/AC-DOM-001-alternate-authority.md` |
| AC-DOM-005 — add, progress, and query lineage independently | lineage add/progress/query command | `T1-AC2-P` | `T1-AC2-N`: duplicate and cross-relation mutation rejected | `docs/tickets/SPEC-DOM-001/evidence/TICKET-001/AC-DOM-005-lineage.md` |
| AC-DOM-001 / AC-DOM-005 — rehydrate immutable identity and lineage | aggregate rehydration command | `T1-AC3-P` | `T1-AC3-N`: missing, stale, or corrupted record rejected without mutation | `docs/tickets/SPEC-DOM-001/evidence/TICKET-001/AC-DOM-001-rehydration.md` |

The architecture guard must execute the productive API/boundary behavior; source
inspection alone is insufficient. Local integration with physical PLAT is
`NOT_APPLICABLE` at this ticket's local closure and remains an integrated
checkpoint owned by PLAT.

```text
DESIGN_TEST_COVERAGE_GATE: PASS
PROXY_ONLY_BEHAVIORS = 0
UNTESTED_STATE_TRANSITIONS = 0
UNPROVEN_CONCURRENCY_CONTRACTS = 0
MISSING_ARCHITECTURE_GUARDS = 0
```

## 21. Structural Risk Assessment

| Risk | Level | Mitigation / rationale |
|---|---|---|
| GOD_COMPONENT_RISK | LOW | Keep catalog limited to identity create/resolve and predecessor coordination |
| OVERSIZED_FILE_RISK | MEDIUM | `identity.ts` already hosts the cohesive identity vocabulary; do not add persistence adapters or unrelated lifecycle rules |
| RESPONSIBILITY_MIXING_RISK | LOW | Separate domain records, catalog coordination, handlers, and ports |
| EXCESSIVE_DEPENDENCY_RISK | LOW | Catalog depends only on repository, generator, and clock |
| DUPLICATION_RISK | LOW | Reuse canonical key, validation, and relation behavior; no parallel identity model |
| TESTABILITY_RISK | LOW | Existing interfaces accept deterministic fixtures and explicit clock/generator |
| CROSS_SPEC_LEAKAGE_RISK | LOW | PLAT is consumed only through ports; foreign IDs stay distinct |
| ARCHITECTURE_DRIFT_RISK | LOW | Preserve `src/domain`/`src/application` convention and no prototype imports |
| ANEMIC_DOMAIN_MODEL_RISK | LOW | Value objects and `AdrSpecLineage.advance` own real rules |
| FAT_APPLICATION_SERVICE_RISK | LOW | Existing handlers remain thin |
| FAT_INTERFACE_RISK | LOW | Keep identity and lineage repository ports separate and cohesive |
| PRIMITIVE_OBSESSION_RISK | LOW | Semantic identity, scope, revision, and progress types already exist; Stage factory adds only the required narrowing |
| DEPENDENCY_INVERSION_RISK | LOW | Domain consumes stable repository ports rather than physical storage |
| INFRASTRUCTURE_LEAKAGE_RISK | LOW | No database/filesystem/HTTP types enter domain modules |
| DOMAIN_RULE_DUPLICATION_RISK | LOW | One enforcement location per identity/relation invariant |
| PREMATURE_ABSTRACTION_RISK | LOW | No hypothetical extensibility; one real canonical Stage boundary |
| OVERENGINEERING_RISK | LOW | No factories beyond the Stage-specific construction guard, no event bus, no generic framework |

`HIGH_STRUCTURAL_RISKS = 0`, `HIGH_DDD_RISKS = 0`, `HIGH_SOLID_RISKS = 0`, and
`HIGH_CLEAN_CODE_RISKS = 0`. The one MEDIUM file-size risk is mitigated by
keeping all additions cohesive and refusing infrastructure concerns in the
identity module.

## 22. Implementation Sequence

1. **Freeze the canonical Stage-reference boundary.** Reuse
   `CanonicalIdentityReference`, add the narrow Stage factory/validator, and
   define the `WorkflowPipeline` input/equality slot without `PipelineId`.
   Validate immediately with positive Stage identity and alternate-authority
   negative tests.
2. **Make identity rehydration explicit.** Extend
   `CanonicalIdentityRecord` with a validated `rehydrate` entry point and keep
   creation separate from historical reconstruction. Validate exact revision,
   predecessor continuity, immutability, and missing/corrupt rejection.
3. **Preserve catalog reservation semantics.** Keep `CanonicalIdentityCatalog`
   as the single coordinator, ensure revision creation resolves the predecessor
   before reservation, and keep duplicate outcomes explicit. Run one-winner and
   historical lookup fixtures.
4. **Preserve lineage aggregate behavior.** Reuse endpoint validation and
   immutable `advance`; ensure registration resolves canonical endpoints and
   progress uses expected-progress CAS. Run many-to-many, duplicate, isolation,
   stale, and recovery fixtures.
5. **Verify port boundaries.** Confirm domain modules import no infrastructure
   or prototype code and that PLAT's contract fields are preserved. Run the
   executable architecture guard and contract-fixture checks.
6. **Run ticket-local regression and evidence generation.** Execute all direct
   acceptance witnesses, required negative/concurrency/recovery tests, and
   produce the four ticket-local evidence files. Integrated PLAT durability is
   recorded at its approved checkpoint, not fabricated locally.

## 23. Files Expected to Change

| Path / Area | Classification | Reason |
|---|---|---|
| `src/domain/identity.ts` | EXPECTED_MODIFY | Stage-reference narrowing, explicit record rehydration, and identity boundary refinements |
| `src/domain/lineage.ts` | POSSIBLE_MODIFY | Only if the implementation needs a small contract/rehydration refinement; preserve existing relation invariants |
| `src/application/identity.ts` | POSSIBLE_MODIFY | Wire explicit Stage-reference request without duplicating validation |
| `src/application/lineage.ts` | POSSIBLE_MODIFY | Preserve canonical endpoint resolution and thin handler orchestration |
| `src/domain/pipeline.ts` | EXPECTED_MODIFY | Replace `PipelineId` as canonical identity input/storage while leaving pipeline transitions unchanged |
| `tests/dom-001-ticket-001.test.ts` | EXPECTED_MODIFY | Add direct Stage-authority, rehydration, persistence-contract, and architecture witnesses |
| `docs/tickets/SPEC-DOM-001/evidence/TICKET-001/*` | EXPECTED_CREATE_AT_COMPLETION | Four acceptance/completion evidence artifacts named by the ticket |
| `prototype/**` | MUST_NOT_MODIFY | Disposable non-authoritative scenario/UI evidence |
| `docs/specs/**`, ticket/index/audit artifacts | MUST_NOT_MODIFY | Upstream authority and execution contracts are frozen during implementation |
| Physical PLAT database/journal/schema | MUST_NOT_MODIFY_BY_THIS_TICKET | Foreign persistence owner and later integrated checkpoint |

No new ticket, schema, migration, framework, transport, or production
infrastructure module is required by this design.

## 24. Open Questions / Blockers

```text
NONE
```

No implementation blocker remains. The only deferred item is physical PLAT
durability, explicitly documented as a foreign non-blocking local contract and
an integrated checkpoint. If implementation would require changing canonical
identity meaning, ownership, lifecycle semantics, or the PLAT contract, stop
and escalate upstream rather than deciding inside this ticket.

## 25. Design Metrics

```text
RESPONSIBILITIES = 11
DOMAIN_CONCEPTS = 8
AGGREGATE_ROOTS = 2
ENTITIES = 1
VALUE_OBJECTS = 6
DOMAIN_SERVICES = 0
APPLICATION_SERVICES = 4
PORTS = 2
ADAPTERS = 0
ANTI_CORRUPTION_LAYERS = 0
PROPOSED_COMPONENTS = 12
CRITICAL_INVARIANTS = 10
UNPLACED_DOMAIN_INVARIANTS = 0
TEST_SURFACES = 9
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
TEMPORAL_AUTHORITY_PROOFS = 1
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
