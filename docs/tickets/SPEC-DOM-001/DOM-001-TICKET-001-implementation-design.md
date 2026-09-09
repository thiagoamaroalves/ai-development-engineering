# DOM-001-TICKET-001 — Implementation Design

## 1. Design Verdict

`IMPLEMENTATION_DESIGN_READY`

The ticket has one coherent responsibility: establish the DOM-owned canonical
identity and ADR↔SPEC lineage boundary. The design preserves the ticket scope,
accepted architecture, foreign ownership, historical resolution, and local
closure. No production code or test code is created by this artifact.

## 2. Ticket

| Field | Value |
|---|---|
| Ticket ID | `DOM-001-TICKET-001` |
| Ticket path | `docs/tickets/SPEC-DOM-001/DOM-001-TICKET-001-canonical-identity-lineage.md` |
| Implementation Unit | `DOM-IMP-01` |
| Portfolio Obligations | `O-001`, `O-005` |
| Requirements | `DOM-ID-001`, `DOM-LINEAGE-001` |
| Gap IDs | `GAP-001`, `GAP-005` |
| Acceptance IDs | `AC-DOM-001`, `AC-DOM-005` |
| Status | `READY` |
| Ticket audit | `IMPLEMENTATION_TICKETS_CONFORMANT`; `READY_FOR_IMPLEMENTATION` |

Authority inputs used: accepted `ADR-0001`; approved
`SPEC-PORTFOLIO-001`; conformant `SPEC-DOM-001`; validated Gap Matrix and
Plan; conformant Plan Audit and Ticket Audit. The prototype is evidence only.

## 3. Implementation Responsibility

Implement the DOM-owned identity catalog and independent ADR↔SPEC lineage
boundary that creates, validates, uniquely resolves, and historically retains
canonical identities without owning foreign execution, persistence, or
projection semantics.

## 4. Repository Architecture Context

The repository currently contains a disposable TypeScript/React prototype and
no productive domain, application, infrastructure, persistence, public API,
or integration implementation. The productive boundary therefore needs to be
introduced narrowly for this ticket; it must not be retrofitted into the mock.

| Boundary | Current repository reality | Design consequence |
|---|---|---|
| Domain | `prototype/src/mockDomain.ts` is centralized mock authority, not production | Create a small productive identity/lineage domain module; do not extend the mock |
| Application | No productive command/query use-case boundary exists | Add thin identity command/query handlers only for this ticket |
| Infrastructure | No productive adapter or runtime integration exists | Keep technology behind ports; physical adapters remain outside this ticket |
| Persistence | No durable store is present; PLAT owns physical persistence | Define semantic repository contracts and atomic uniqueness expectations, not schema |
| Integration | No productive consumers exist | Expose typed DOM identity values; consumers correlate without becoming authoritative |
| Public API | No productive API/controller exists | No controller, transport envelope, or authorization layer is added |
| Test | Prototype tests exercise mock scenarios | Add productive domain/application contract tests under the product test root; retain prototype tests as historical references |

The expected logical source root below is `src/` and test root `tests/`; if the
productive host establishes an equivalent root, the implementation may use that
repository convention without changing the design or ticket scope.

## 5. Existing Repository Context

| Existing Component | Classification | Current Responsibility | Design Use |
|---|---|---|---|
| `prototype/src/mockDomain.ts:30-43, :700-744` | `REPLACE_BY_TICKET` | In-memory IDs, hashes, and relationship arrays | Vocabulary and scenario reference only; its authority is replaced, not extended |
| `prototype/tests/mockDomain.test.ts` identity/lineage cases | `REUSE` | Tests of disposable mock behavior | Translate relevant scenarios into productive tests; do not treat them as productive proof |
| `prototype/src/App.tsx:52-75` | `DO_NOT_TOUCH` | UI rendering/requesting of mock state | Confirms that presentation is not canonical identity authority |
| `prototype/README.md:24-39` | `DO_NOT_TOUCH` | Documents in-memory simulation | Evidence for the boundary; no implementation dependency |
| Productive identity/persistence/API components | `INTEGRATE` | None currently present | Ports and composition points are new; PLAT/consumers integrate later |

## 6. Domain Model Assessment

### Domain concepts

| Concept | Type | Semantic reason |
|---|---|---|
| `CanonicalIdentity` | Value Object | Validates the stable identifier, kind, scope, and canonical comparison |
| `AggregateKind` | Value Object / closed domain vocabulary | Prevents identity-kind collapse across repository, ADR, SPEC, activity, ticket, effect, and publication aggregates |
| `IdentityScope` | Value Object | Makes repository/aggregate scope explicit and comparable |
| `Revision` | Value Object | Validates positive revision and prevents unresolved revision references |
| `CanonicalIdentityRecord` | Entity | Retains immutable creation, scope, kind, revision, and historical-resolution data |
| `AdrSpecLineage` | Entity / relation aggregate | Represents one explicit ADR↔SPEC relation so each relation can progress independently |

### Aggregate roots

`CanonicalIdentityCatalog` is the identity creation/uniqueness root for one
scope. `AdrSpecLineage` is the root for one explicit ADR/SPEC relation. The
lineage root is intentionally per relation rather than one mutable graph, so a
relation cannot silently close or mutate another relation.

### Domain invariants

- Identity kind and scope are explicit and valid.
- A canonical identity is unique within its approved scope and kind.
- A created identity record is immutable; historical resolution returns the
  recorded revision rather than rewriting it.
- Unknown identities and invalid revisions are rejected.
- `AgentId`, assignment/session/activity IDs, `ExternalEffectId`, and
  `PublicationId` remain distinct identity kinds.
- Each ADR↔SPEC lineage relation is explicit, verifiable, and many-to-many
  across the catalog.
- Progress or mutation of one ADR↔SPEC relation cannot mutate another relation.

### Services, policies, events, and boundaries

`DOMAIN_SERVICES = 0` and `DOMAIN_POLICIES = 0`: the rules fit the value
objects and aggregate roots. `DOMAIN_EVENTS = NOT_APPLICABLE`: the current
repository has no productive event boundary, and this ticket does not create
an event bus. If a durable fact is later required, PLAT's approved boundary
owns its persistence and delivery semantics. Repository abstractions and
application use cases are listed in §9. `ANTI_CORRUPTION_BOUNDARIES = 0` for
this ticket because only DOM-owned typed identity values cross the boundary;
foreign lifecycle concepts are not imported.

`ANEMIC_DOMAIN_MODEL_RISK: LOW`. Identity creation, uniqueness, immutability,
reference validation, and relation independence remain domain behavior rather
than scattered handler conditionals.

## 7. Aggregate / Consistency Boundaries

| Aggregate | Root | Invariants | Transaction / Consistency Boundary | External References |
|---|---|---|---|---|
| Identity catalog | `CanonicalIdentityCatalog` | Kind/scope validity, uniqueness, immutable record creation, valid revision resolution | One scoped identity reservation/creation; no cross-aggregate transaction | Opaque consumer correlation only |
| ADR↔SPEC relation | `AdrSpecLineage` | Explicit pair, valid endpoint revisions, one relation's progress isolated from every other relation | One relation registration/update; no global lineage graph mutation | `ADRId` and `SPECId` reference canonical records |

The repository/port enforces the durable uniqueness constraint atomically, but
does not decide lifecycle or relation semantics. Identity resolution is a
read-only operation and never mutates the catalog. There is no transaction
that spans identity creation and unrelated consumer state.

## 8. Responsibility Decomposition

| Responsibility | Authority | State Owned | Expected Test Surface |
|---|---|---|---|
| Validate canonical identity parts | `DOM-ID-001`, O-001 | Kind, scope, canonical value, revision | Value-object unit and invariant tests |
| Create and uniquely reserve identity | `DOM-ID-001`, O-001 | Immutable identity record | Aggregate and persistence-contract tests |
| Resolve current/historical identity | `DOM-ID-001`, O-001 | Read-only identity index | Positive, invalid-reference, and historical-resolution tests |
| Preserve identity distinctions | `ADR-0001`, `DOM-ID-001` | Aggregate-kind vocabulary | Domain invariant and architecture-boundary tests |
| Register explicit ADR↔SPEC relation | `DOM-LINEAGE-001`, O-005 | One relation entity and its endpoint revisions | Relation isolation and many-to-many tests |
| Orchestrate commands/queries | Ticket local application boundary | Request/result coordination only | Application handler tests with ports |

`RESPONSIBILITY_MIXING_RISK: LOW`. Persistence, transport, projection, and
foreign lifecycle decisions are not combined with the domain responsibilities.

## 9. Proposed Components

| Component | Type | Responsibility | Existing/New | Expected Location | Size |
|---|---|---|---|---|---|
| `CanonicalIdentity` | VALUE_OBJECT | Validate and compare one canonical identity | New | `src/domain/identity/CanonicalIdentity` | SMALL |
| `AggregateKind` | VALUE_OBJECT | Restrict identity-kind vocabulary | New | `src/domain/identity/AggregateKind` | SMALL |
| `IdentityScope` | VALUE_OBJECT | Validate and compare identity scope | New | `src/domain/identity/IdentityScope` | SMALL |
| `Revision` | VALUE_OBJECT | Validate positive revision and exact lookup key | New | `src/domain/identity/Revision` | SMALL |
| `CanonicalIdentityRecord` | DOMAIN_ENTITY | Hold immutable identity metadata and lineage references | New | `src/domain/identity/CanonicalIdentityRecord` | SMALL |
| `CanonicalIdentityCatalog` | AGGREGATE_ROOT | Create, reserve, and resolve identity records | New | `src/domain/identity/CanonicalIdentityCatalog` | MEDIUM |
| `AdrSpecLineage` | AGGREGATE_ROOT | Register one explicit ADR↔SPEC relation independently | New | `src/domain/lineage/AdrSpecLineage` | SMALL |
| `CanonicalIdentityRepository` | PORT | Load, reserve, and resolve durable identity records | New | `src/application/identity/CanonicalIdentityRepository` | SMALL |
| `AdrSpecLineageRepository` | PORT | Persist and query relation records | New | `src/application/lineage/AdrSpecLineageRepository` | SMALL |
| `CanonicalIdentityGenerator` | PORT | Supply a candidate system-assigned identity value | New | `src/application/identity/CanonicalIdentityGenerator` | SMALL |
| `CreateCanonicalIdentityHandler` | APPLICATION_SERVICE | Coordinate generation, domain creation, and repository reservation | New | `src/application/identity/CreateCanonicalIdentityHandler` | SMALL |
| `ResolveCanonicalIdentityHandler` | QUERY_HANDLER | Resolve an identity/revision without mutation | New | `src/application/identity/ResolveCanonicalIdentityHandler` | SMALL |
| `RegisterAdrSpecLineageHandler` | COMMAND_HANDLER | Resolve endpoints and persist one independent relation | New | `src/application/lineage/RegisterAdrSpecLineageHandler` | SMALL |

Component contracts:

- `CanonicalIdentity`, `AggregateKind`, `IdentityScope`, and `Revision` own
  validation, canonical comparison, and value equality. They collaborate with
  the aggregate roots and must not own persistence, transport, or generation.
- `CanonicalIdentityCatalog` owns identity creation/uniqueness decisions and
  immutable record construction. It collaborates with its repository port and
  must not own serialization, SQL/filesystem calls, or consumer state.
- `AdrSpecLineage` owns one relation's endpoint validation and independence. It
  collaborates with identity resolution and its repository port and must not
  own a global graph, SPEC progress, or foreign lifecycle.
- The three handlers own use-case coordination only. They collaborate with
  domain objects and ports and must not duplicate invariants or become generic
  `IdentityService`/`Manager` buckets.
- Repository ports own the persistence contract. They must not decide domain
  lifecycle, silently update immutable records, or expose a generic mutation
  API that bypasses the roots.

## 10. SOLID Assessment

| Component | SRP | OCP | LSP | ISP | DIP | Result |
|---|---|---|---|---|---|---|
| Value objects | PASS | NOT_APPLICABLE | NOT_APPLICABLE | NOT_APPLICABLE | PASS | PASS |
| `CanonicalIdentityCatalog` | PASS | PASS | NOT_APPLICABLE | PASS | PASS | PASS |
| `AdrSpecLineage` | PASS | PASS | NOT_APPLICABLE | PASS | PASS | PASS |
| Identity/lineage repository ports | PASS | PASS | NOT_APPLICABLE | PASS | PASS | PASS |
| Application handlers | PASS | PASS | NOT_APPLICABLE | PASS | PASS | PASS |

No inheritance hierarchy, strategy family, plugin system, or generic factory
is needed. `OCP_VIOLATIONS = 0`, `LSP_VIOLATIONS = 0`, `ISP_VIOLATIONS = 0`,
`DIP_VIOLATIONS = 0`, and `UNJUSTIFIED_SOLID_VIOLATIONS = 0`.

## 11. Dependency Direction

```text
Canonical identity value objects and aggregates
        ↑ depend only on domain vocabulary
Application handlers
        ↑ depend on domain objects and narrow repository/generator ports
PLAT-owned persistence and runtime adapters
        ↑ implement ports; consumer/API adapters map results without authority
```

The prototype is not part of this dependency graph. No domain type imports a
database, filesystem, HTTP SDK, serializer, or UI type.

```text
DEPENDENCY_DIRECTION_VIOLATIONS = 0
INFRASTRUCTURE_LEAKAGE_POINTS = 0
```

## 12. Invariant Placement

| Invariant | Domain Enforcement | Durable Protection | Application Guard | Test |
|---|---|---|---|---|
| Identity kind is valid | `AggregateKind` | Validate serialized kind on load | Reject malformed request before aggregate call | Value-object unit |
| Scope is explicit and valid | `IdentityScope` | Scoped key/index | Require scope in command | Domain invariant |
| Identity is unique in scope/kind | `CanonicalIdentityCatalog` | Atomic reserve/unique constraint in owning store | Translate collision to canonical rejection | Aggregate + persistence contract |
| Created record is immutable | `CanonicalIdentityRecord` and no update operation | Append-only/immutable storage contract owned by PLAT | No update command exposed | Mutation rejection + replay |
| Historical revision resolves | `Revision` and catalog lookup | Revision-qualified index/record retention | Require exact identity and revision | Historical lookup |
| Foreign identity kinds stay distinct | `AggregateKind` vocabulary | Persist kind with identity | Map only typed DOM identity | Architecture/conformance |
| ADR↔SPEC relation is explicit and independent | `AdrSpecLineage` per pair | Unique pair key and immutable endpoint revisions | Resolve both endpoints before registration | Many-to-many isolation |

`UNPLACED_DOMAIN_INVARIANTS = 0`. Durable protection is expressed as a
contract, not as a technology or schema decision in this ticket.

## 13. Persistence Design

- `AGGREGATE_STORAGE_BOUNDARY`: one scoped identity catalog record per
  canonical identity; one relation record per ADR↔SPEC pair.
- `REPOSITORY_PORT_BOUNDARY`: domain/application depend on
  `CanonicalIdentityRepository` and `AdrSpecLineageRepository`; physical
  database, journal, outbox, and recovery mechanics remain PLAT-owned.
- `SERIALIZATION_BOUNDARY`: adapters serialize typed records and validate kind,
  scope, revision, and endpoint identity on load; serialized DTOs do not become
  domain decision objects.
- `CONCURRENCY_REVISION_MECHANISM`: atomic create-if-absent/unique reservation
  for the scoped identity key and relation pair. The concrete mechanism is not
  frozen.
- `ATOMICITY_BOUNDARY`: one identity reservation or one lineage relation per
  operation. No cross-SPEC or consumer transaction is introduced.
- `REGISTRY_INDEX_RELATIONSHIP`: identity lookup is keyed by canonical kind,
  scope, value, and revision; lineage lookup indexes both ADR and SPEC sides.
- `DURABLE_INVARIANT_PROTECTION`: the owning persistence implementation must
  prevent duplicate keys and mutation bypass; DOM retains the semantic rule.
- `INTEGRITY_VALIDATION`: reject malformed or unresolved records before they
  enter a domain aggregate.
- `RECOVERY_BEHAVIOR`: a failed reservation produces no accepted identity
  result; a retry resolves by the same canonical key and cannot create a
  duplicate. Physical replay/reconciliation belongs to PLAT.
- `ARCHIVAL_BEHAVIOR`: `NOT_APPLICABLE`; this ticket preserves historical
  records but does not define archival or retention policy.

## 14. Lifecycle Design

This ticket does not introduce a functional lifecycle state machine for an
identity. The normative lifecycle is creation plus immutable resolution:

```text
no canonical record → CREATED_AND_RESOLVABLE
CREATED_AND_RESOLVABLE → historical lookup of the same record/revision
```

`TRANSITION_OWNER`: `CanonicalIdentityCatalog` for creation and
`ResolveCanonicalIdentityHandler` for read-only lookup. There is no update,
reopen, retirement, or silent revision transition authorized here. A new
revision is a new record/lineage reference governed by the relevant upstream
revision workflow, not a mutation of an existing record.

Invalid transitions/operations: duplicate creation, mutation of a created
record, unresolved identity, invalid revision, or cross-kind reference.
Recovery transition: retry only after the repository reports whether the
reservation was accepted; never infer success from an exception or process
termination. Terminal behavior: created records remain historically resolvable.
`PERSISTENCE_GUARD`: no generic update path. `BYPASS_PATHS_FORBIDDEN`: direct
map/dictionary writes, filename-derived identity, consumer projection writes,
and handler-side duplicated identity mutation.

## 15. Cross-Spec Integration

There is no blocking cross-SPEC dependency for local closure. Consumer
correlation is an explicit future integration seam, not foreign work assigned
to this ticket.

| Foreign Owner | Contract | Local Integration Point | ACL | Forbidden Local Ownership |
|---|---|---|---|---|
| All DOM consumers | Consume stable typed DOM identity and revision references | Handler result/query contract | Not required; opaque typed references | Creating a second identity catalog |
| `SPEC-PLAT-001` | Physical persistence and evidence correlation | Repository port implementation boundary | Adapter mapping only | Database/journal/recovery mechanics in DOM |
| `SPEC-EXEC-001` / `SPEC-EXEC-002` | Assignment/session/skill identity remains distinct | Typed `AggregateKind` and correlation fields | Explicit mapping if needed later | Assignment/session lifecycle |
| `SPEC-GIT-001` | Publication/effect identity remains distinct | Typed external reference only | Explicit mapping if needed later | Git execution or publication confirmation |

For every foreign boundary: `IDENTITY_PRESERVED = YES`,
`FAILURE_SEMANTICS_PRESERVED = YES`, and `LOCAL_BEHAVIOR_FORBIDDEN` is the
foreign lifecycle or persistence mechanism. No foreign domain type is imported
into the identity aggregate.

## 16. Main Interaction Flow

1. `CreateCanonicalIdentityHandler` receives an explicit aggregate kind and
   scope; it does not infer either from a filename or consumer DTO.
2. `CanonicalIdentityGenerator` supplies a candidate system-assigned value;
   value objects validate kind, scope, and revision.
3. `CanonicalIdentityCatalog` creates the immutable record and asks
   `CanonicalIdentityRepository` to reserve it atomically.
4. The handler returns the canonical identity and revision only after the
   reservation result is accepted; collision or invalid input returns the
   canonical rejection without a state transition.
5. `ResolveCanonicalIdentityHandler` resolves exact identity/revision through
   the repository and returns historical data read-only.
6. `RegisterAdrSpecLineageHandler` resolves both endpoint identities, creates
   one `AdrSpecLineage` relation, and persists only that relation. Another
   relation is neither closed nor changed.

## 17. Failure / Recovery Flow

| Failure point | Detection | Durable evidence | Failure owner | Retry owner | Idempotency boundary | Recovery / reconciliation |
|---|---|---|---|---|---|---|
| Malformed kind/scope/revision | Value object construction | None; command rejected | DOM | Caller may correct input | Validated command input | Re-submit corrected input |
| Duplicate identity reservation | Atomic repository result | Existing canonical key remains | DOM semantic rejection; PLAT stores technical outcome | Application boundary | Scoped kind/value key | Resolve existing record; no duplicate creation |
| Unknown identity/revision | Repository resolution | No new record | DOM invalid-reference rejection | Caller | Exact identity + revision | Use a valid historical reference |
| Duplicate/unresolved lineage endpoint | Relation aggregate/resolver | Existing relation/history retained | DOM | Application caller | ADR/SPEC endpoint pair + revisions | Resolve endpoints and retry only valid relation |
| Physical persistence failure | Port/adaptor error | PLAT-owned journal/error evidence | PLAT technical failure | PLAT/repository boundary | Reservation key | Replay/reconcile through PLAT; DOM does not invent success |

`DURABLE_EVIDENCE` for domain rejections is a later PLAT integration concern;
the local contract must expose the semantic result without renaming it.
There is no retry loop, event bus, or recovery service inside this ticket.

## 18. Clean Code Assessment

| Check | Result | Evidence / constraint |
|---|---|---|
| Clear domain naming | PASS | Uses `CanonicalIdentity`, `IdentityScope`, `Revision`, and `AdrSpecLineage` |
| Small cohesive methods | PASS | Value validation, aggregate decisions, and handler coordination stay separate |
| Explicit side effects | PASS | Repository reservation is visible at the handler/port boundary |
| Explicit mutation boundaries | PASS | Aggregate roots are the only domain mutation authorities |
| No boolean parameter explosion | PASS | Commands use named input objects/value contracts |
| No long parameter lists | PASS | Scope/kind/revision are cohesive request/value types |
| No unjustified primitive obsession | PASS | Meaningful identity, scope, kind, and revision are value objects |
| No magic values | PASS | Identity kinds and rejection results use named domain vocabulary |
| No generic utility bucket | PASS | No `IdentityHelper` or `CommonUtil` is proposed |
| No generic service bucket | PASS | Handlers are use-case-specific; no `IdentityService` catch-all |
| No duplicated domain rules | PASS | Validation and transitions live in value objects/roots |
| No deep nesting by design | PASS | Guard clauses and explicit result paths are required |
| No comment-dependent correctness | PASS | Invariants are executable in domain and persistence contracts |
| No hidden temporal coupling | PASS | Repository acceptance precedes the returned identity result |
| No unnecessary mutability | PASS | Records and lineage endpoints are immutable after creation |

## 19. Test Design

| Behavior / Invariant | Test Type | Target | Expected Proof |
|---|---|---|---|
| Kind/scope/revision validation | UNIT | Value objects | Invalid parts cannot construct canonical values |
| Identity creation and uniqueness | DOMAIN_INVARIANT | `CanonicalIdentityCatalog` | Valid creation succeeds; duplicate scoped key is rejected |
| Immutable identity record | DOMAIN_INVARIANT / NEGATIVE_BEHAVIOR | Record and aggregate | Mutation/update attempt leaves original record unchanged and is rejected |
| Historical resolution | UNIT / PERSISTENCE | Repository contract + resolver handler | Exact identity/revision resolves; unknown or invalid revision fails closed |
| Identity-kind separation | ARCHITECTURE_CONFORMANCE | Domain vocabulary | Agent, assignment/session, effect, publication, and canonical IDs cannot be collapsed |
| Many-to-many lineage | DOMAIN_INVARIANT | `AdrSpecLineage` | One ADR can relate to multiple SPECs and vice versa |
| Independent relation progress | DOMAIN_INVARIANT / STATE_TRANSITION | Relation root/repository | Updating one relation does not mutate another relation |
| Atomic reservation collision | PERSISTENCE / CONCURRENCY | Repository port contract | Concurrent same-key creation yields one accepted record and no duplicate |
| No filename-derived authority | NEGATIVE_BEHAVIOR | Handler boundary | Filename/name-only input cannot create or resolve identity |
| Consumer correlation boundary | INTEGRATION / CROSS_SPEC | Mapping contract fixture | Foreign consumers receive references without gaining write authority |
| Prototype regression scenarios | REGRESSION | Productive test fixtures | Relevant identity/lineage scenarios are preserved without importing mock authority |

Tests are designed before production implementation. Infrastructure-specific
durability/recovery tests remain with PLAT; this ticket tests the semantic port
contract and local no-duplicate/no-effect behavior.

## 20. Structural Risk Assessment

| Risk | Level | Mitigation |
|---|---|---|
| `GOD_COMPONENT_RISK` | LOW | Two small roots with separate identity and relation boundaries |
| `OVERSIZED_FILE_RISK` | LOW | Split value objects, roots, ports, and handlers by responsibility |
| `RESPONSIBILITY_MIXING_RISK` | LOW | Persistence and transport are outside domain roots |
| `EXCESSIVE_DEPENDENCY_RISK` | MEDIUM | Keep handlers dependent only on narrow ports and their root; no shared service bucket |
| `DUPLICATION_RISK` | LOW | Centralize validation/equality in value objects and roots |
| `TESTABILITY_RISK` | LOW | Domain behavior is executable without infrastructure; ports are contract-testable |
| `CROSS_SPEC_LEAKAGE_RISK` | MEDIUM | Use opaque typed references and explicit mapping; forbid foreign lifecycle imports |
| `ARCHITECTURE_DRIFT_RISK` | MEDIUM | Create a narrow productive boundary and leave `prototype/` untouched; add boundary tests |
| `ANEMIC_DOMAIN_MODEL_RISK` | LOW | Identity and lineage decisions live in roots/value objects |
| `FAT_APPLICATION_SERVICE_RISK` | LOW | Three use-case-specific handlers coordinate but do not decide invariants |
| `FAT_INTERFACE_RISK` | LOW | Ports expose only reserve/resolve or relation operations required now |
| `PRIMITIVE_OBSESSION_RISK` | LOW | Identity kind, scope, and revision have justified value objects |
| `DEPENDENCY_INVERSION_RISK` | LOW | Domain sees ports, never physical persistence |
| `INFRASTRUCTURE_LEAKAGE_RISK` | LOW | No database, filesystem, HTTP, or serializer type crosses inward |
| `DOMAIN_RULE_DUPLICATION_RISK` | LOW | One semantic owner per rule is explicit in §12 |
| `PREMATURE_ABSTRACTION_RISK` | LOW | No generic identity framework, event bus, strategy, or factory hierarchy |
| `OVERENGINEERING_RISK` | LOW | Component set is limited to current identity/lineage obligations |

`HIGH_STRUCTURAL_RISKS = 0`; `HIGH_DDD_RISKS = 0`;
`HIGH_SOLID_RISKS = 0`; `HIGH_CLEAN_CODE_RISKS = 0`. The three MEDIUM risks
are concrete design constraints and do not block readiness.

## 21. Implementation Sequence

1. Define `AggregateKind`, `IdentityScope`, `Revision`, and
   `CanonicalIdentity`. Immediately test format, scope, kind, revision, and
   canonical equality rules.
2. Implement `CanonicalIdentityRecord` and
   `CanonicalIdentityCatalog` with immutable creation and uniqueness decisions.
   Immediately test valid creation, duplicate rejection, identity-kind
   separation, and mutation rejection.
3. Define `CanonicalIdentityRepository` and
   `CanonicalIdentityGenerator` ports. Immediately run repository contract
   tests for atomic reservation and exact historical resolution.
4. Implement `AdrSpecLineage` and its repository port. Immediately test
   endpoint resolution, many-to-many relations, duplicate relations, and
   independent progress.
5. Add the three narrow application handlers. Immediately test accepted
   results, invalid references, no-effect rejection, and port coordination.
6. Add the productive integration/mapping contract fixture without importing
   foreign lifecycle types. Immediately run identity-boundary and
   no-second-authority tests.
7. Translate the relevant prototype scenarios into productive regression
   tests; keep the prototype unchanged. Immediately run the full ticket test
   set and verify local completion evidence.
8. Run architecture/conformance checks for forbidden `prototype` authority,
   infrastructure imports in domain code, identity-kind collapse, and complete
   acceptance coverage.

No step creates a new ticket or changes upstream authority.

## 22. Files Expected to Change

| Path / Area | Classification | Reason |
|---|---|---|
| Productive domain identity source root, e.g. `src/domain/identity/` | EXPECTED_CREATE | Value objects, immutable record, and identity catalog |
| Productive domain lineage source root, e.g. `src/domain/lineage/` | EXPECTED_CREATE | Independent ADR↔SPEC relation root |
| Productive application identity/lineage root, e.g. `src/application/identity/` and `src/application/lineage/` | EXPECTED_CREATE | Narrow handlers and repository/generator ports |
| Productive test root, e.g. `tests/domain/identity/`, `tests/domain/lineage/`, `tests/application/identity/` | EXPECTED_CREATE | Local unit, invariant, contract, and regression tests |
| Productive composition/registration file | POSSIBLE_MODIFY | Register the new boundary if the host runtime requires it |
| `prototype/src/mockDomain.ts` | MUST_NOT_MODIFY | Historical mock, never productive authority |
| `prototype/tests/*` | MUST_NOT_MODIFY | Historical scenarios; productive proof belongs in product tests |
| ADRs, portfolio, SPEC, Gap Matrix, Plan, audits, other SPECs | MUST_NOT_MODIFY | Upstream authority and foreign ownership are frozen |
| PLAT schema/journal/outbox/recovery and API/UI/GIT implementations | MUST_NOT_MODIFY | Foreign mechanics and lifecycles are outside ticket scope |

The paths are logical placement guidance because the repository has no
productive source root today; the design does not mandate a new architecture or
technology.

## 23. Open Questions / Blockers

`NONE`.

The absence of a productive source root is an implementation setup condition,
not an authority or semantic blocker. The host runtime may choose an equivalent
domain/application path while preserving the component boundaries and behavior
above. No SPECIFICATION_GAP, PORTFOLIO_GAP, or CROSS_SPEC_CONTRACT_MISSING was
found.

## 24. Design Metrics

```text
RESPONSIBILITIES = 6
DOMAIN_CONCEPTS = 6
AGGREGATE_ROOTS = 2
ENTITIES = 2
VALUE_OBJECTS = 4
DOMAIN_SERVICES = 0
DOMAIN_SERVICES_OR_POLICIES = 0
APPLICATION_SERVICES = 3
PORTS = 3
ADAPTERS = 0 in this ticket
ANTI_CORRUPTION_LAYERS = 0
PROPOSED_COMPONENTS = 13
CRITICAL_INVARIANTS = 7
UNPLACED_DOMAIN_INVARIANTS = 0
TEST_SURFACES = 6
UNJUSTIFIED_SOLID_VIOLATIONS = 0
DEPENDENCY_DIRECTION_VIOLATIONS = 0
HIGH_STRUCTURAL_RISKS = 0
HIGH_DDD_RISKS = 0
HIGH_SOLID_RISKS = 0
HIGH_CLEAN_CODE_RISKS = 0
```

## 25. Design Gate

```text
IMPLEMENTATION_DESIGN_GATE: READY_FOR_IMPLEMENTATION
```

This design is implementation guidance only. The ticket, SPEC, Plan, accepted
ADRs, and approved ownership remain authoritative if any conflict is found.
