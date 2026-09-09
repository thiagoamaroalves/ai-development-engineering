# DOM-001-TICKET-002 — Implementation Design

## 1. Design Verdict

`IMPLEMENTATION_DESIGN_READY`

The ticket has one bounded responsibility: accept an explicit manual authority
submission, admit only eligible ADR revisions, and create an immutable
pre-execution snapshot. The design does not implement ADR lifecycle
transitions, physical persistence/recovery, file discovery, scheduler state, or
execution.

## 2. Ticket

| Field | Value |
|---|---|
| Ticket ID | `DOM-001-TICKET-002` |
| Ticket path | `docs/tickets/SPEC-DOM-001/DOM-001-TICKET-002-manual-entry-snapshot-eligibility.md` |
| Implementation Unit | `DOM-IMP-02` |
| Portfolio Obligations | `O-002`, `O-003`, `O-004` |
| Requirements | `DOM-INGEST-001`, `DOM-SNAPSHOT-001`, `DOM-ELIG-001` |
| Gap IDs | `GAP-002`, `GAP-003`, `GAP-004` |
| Acceptance IDs | `AC-DOM-002`, `AC-DOM-003`, `AC-DOM-004` |
| Status | `READY` |
| Dependency | `DOM-001-TICKET-001` completed |
| Ticket audit | `IMPLEMENTATION_TICKETS_CONFORMANT`; `READY_FOR_IMPLEMENTATION` |

Authority inputs: accepted `ADR-0001`; approved `SPEC-PORTFOLIO-001`; conformant
`SPEC-DOM-001`; validated Gap Matrix and Implementation Plan; conformant Plan
Audit and Ticket Audit; approved identity design from `DOM-001-TICKET-001`.
The prototype is evidence only and is not extended.

## 3. Implementation Responsibility

Accept one explicit manual submission, validate accepted ADR authority, and
produce a durable-boundary-ready immutable execution snapshot that cannot be
silently changed or populated through discovery or fallback.

## 4. Repository Architecture Context

The productive repository currently has `src/domain` and `src/application`
identity/lineage modules only. No productive snapshot, API, infrastructure
adapter, or persistence implementation exists.

| Boundary | Repository reality | Design consequence |
|---|---|---|
| Domain | `src/domain/identity.ts` owns canonical identity/value rules | Reuse identity resolution; place eligibility and snapshot invariants in a new domain module |
| Application | `src/application/identity.ts` contains thin handlers | Add one explicit manual-submission handler; it coordinates and does not decide eligibility |
| Persistence | No concrete adapter; PLAT owns physical storage/recovery | Define a narrow immutable snapshot repository port; do not define schema or recovery mechanics |
| Integration | EXEC-001 and PLAT-001 are foreign owners | Map exact version metadata and persistence records at explicit seams; do not recreate foreign authority |
| Public API | No productive transport/controller | No HTTP, UI, or filesystem trigger is added |
| Test | `tests/dom-001-ticket-001.test.ts` covers the completed identity ticket | Add productive ticket-scoped tests; prototype tests remain regression evidence |

The design uses the existing flat source convention (`src/domain/*.ts`,
`src/application/*.ts`, `tests/*.test.ts`) and does not introduce a new
architectural layer.

## 5. Existing Repository Context

| Existing Component | Classification | Current Responsibility | Design Use |
|---|---|---|---|
| `src/domain/identity.ts` — `CanonicalIdentityCatalog` | `REUSE` | Creates and resolves immutable canonical identity records | Resolve submitted ADR references; do not add snapshot state to the catalog |
| `src/domain/identity.ts` — `CanonicalIdentityRecord` / reference VOs | `REUSE` | Own identity, scope, revision, kind, and historical resolution | Supply immutable ADR identity/revision inputs to eligibility and snapshot entry |
| `src/application/identity.ts` — `ResolveCanonicalIdentityHandler` | `REUSE` | Coordinates exact identity resolution | Reuse only if the composition boundary needs a handler; no duplicate resolution rules |
| `prototype/src/mockDomain.ts` snapshot helpers | `DO_NOT_TOUCH` | Simulate cloneable snapshot and eligibility state | Vocabulary and negative-path reference only |
| `prototype/src/App.tsx` manual controls | `DO_NOT_TOUCH` | Presents mock commands | No productive trigger authority |
| Productive snapshot components | `NEW` | None currently exists | Add only the domain aggregate, application handler, and repository seam required by this ticket |

## 6. Domain Model Assessment

### Domain concepts

| Concept | Type | Semantic reason |
|---|---|---|
| `ExecutionSnapshot` | Aggregate Root / Entity | Owns the immutable authority basis used before execution and its lock transition |
| `SnapshotId` | Value Object | Identifies one submitted snapshot without using a filename or mutable request identity |
| `AdrSnapshotEntry` | Value Object | Binds one canonical ADR reference, accepted decision state, and exact content hash |
| `SnapshotBase` | Value Object | Represents the exact commit base frozen by the snapshot |
| `ConfigurationVersion` | Value Object | Preserves the exact configuration basis without allowing later replacement |
| `ExactVersionSet` | Value Object | Preserves exact applicable skill/contract versions received from EXEC-001 |
| `AdrEligibilityPolicy` | Domain Policy | Applies the single accepted-only eligibility rule without owning ADR lifecycle transitions |
| `SnapshotStatus` | Closed domain vocabulary | Distinguishes draft construction from confirmed/locked use |

`ExecutionSnapshot` is the only new aggregate root. `AdrEligibilityPolicy`
consumes the canonical ADR decision state; it does not create, transition, or
persist ADR lifecycle state owned by `DOM-001-TICKET-003`.

`DOMAIN_SERVICES = 0`; the eligibility rule has a clear policy owner and does
not need a service bucket. `DOMAIN_EVENTS = NOT_APPLICABLE`: no productive event
boundary exists and this ticket does not introduce an event bus. `ANEMIC_DOMAIN_MODEL_RISK: LOW`.

## 7. Aggregate / Consistency Boundaries

| Aggregate | Root | Invariants | Transaction / Consistency Boundary | External References |
|---|---|---|---|---|
| Pre-execution authority snapshot | `ExecutionSnapshot` | Explicit manual basis, accepted-only ADR entries, exact hashes/base/configuration/versions, immutable contents, no drift absorption | Create or confirm one snapshot; persistence must not expose a generic mutable update | Canonical ADR references; opaque EXEC version metadata; PLAT persistence identity |

ADR lifecycle remains outside this aggregate. The snapshot stores a historical
authority reference and its exact evidence, not a second ADR lifecycle or a
mutable mirror of the catalog.

## 8. Responsibility Decomposition

| Responsibility | Authority | State Owned | Expected Test Surface |
|---|---|---|---|
| Require explicit manual submission | `DOM-INGEST-001`, O-002 | Submission command boundary | Application negative tests for discovery, absent SPEC, and session-only triggers |
| Resolve submitted canonical ADR references | `DOM-ID-001`, TICKET-001 | Read-only identity lookup | Application and historical-resolution contract tests |
| Decide ADR eligibility | `DOM-ELIG-001`, O-004 | Eligibility decision only | Domain invariant tests for `ACCEPTED`, proposed, rejected, superseded, unknown, and invalid revision |
| Construct immutable snapshot | `DOM-SNAPSHOT-001`, O-003 | Snapshot aggregate state | Aggregate creation, deep immutability, exact metadata, and no-overwrite tests |
| Lock/confirm snapshot authority | `DOM-SNAPSHOT-001` | Snapshot status transition | State-transition and drift rejection tests |
| Persist/resolve snapshot records | PLAT integration contract | Durable snapshot record | Repository/serialization/integration tests; no domain rule redefinition |
| Map EXEC exact versions | SPEC-EXEC-001 contract | Local exact-version value | Contract mapping test; no automatic discovery |

`RESPONSIBILITY_MIXING_RISK: LOW`. Manual triggering is application boundary
behavior; eligibility and immutability remain domain behavior; persistence is a
port/adapter concern.

## 9. Proposed Components

| Component | Type | Responsibility | Existing/New | Expected Location | Size |
|---|---|---|---|---|---|
| `CanonicalIdentityCatalog` | AGGREGATE_ROOT | Resolve canonical ADR records | Existing reused | `src/domain/identity.ts` | MEDIUM |
| `AdrEligibilityPolicy` | DOMAIN_POLICY | Accept only ADR decision state `ACCEPTED` at an eligible revision | New | `src/domain/snapshot.ts` | SMALL |
| `ExecutionSnapshot` | AGGREGATE_ROOT | Create, confirm, compare, and expose immutable snapshot authority | New | `src/domain/snapshot.ts` | MEDIUM |
| `SnapshotId`, `SnapshotBase`, `ConfigurationVersion`, `ExactVersionSet` | VALUE_OBJECT | Validate and compare exact snapshot identifiers/metadata | New | `src/domain/snapshot.ts` | SMALL |
| `ExecutionSnapshotRepository` | PORT | Persist and resolve immutable snapshots through the PLAT seam | New | `src/domain/snapshot.ts` | SMALL |
| `SubmitManualExecutionHandler` | COMMAND_HANDLER | Require explicit command, resolve ADRs, invoke domain policy/aggregate, and persist | New | `src/application/snapshot.ts` | SMALL |
| EXEC version mapping seam | ANTI_CORRUPTION_LAYER | Convert foreign exact version metadata into `ExactVersionSet` | New seam; no foreign implementation | `src/application/snapshot.ts` or host integration boundary | SMALL |

Component contracts:

- `AdrEligibilityPolicy` **owns** only the accepted-only decision. It
  collaborates with canonical ADR records and `ExecutionSnapshot`; it **must
  not own** ADR lifecycle transitions, repository persistence, or fallback.
- `ExecutionSnapshot` **owns** invariant-preserving construction,
  confirmation, exact comparison, and immutable exposure. It collaborates with
  `AdrEligibilityPolicy` and typed value objects; it **must not own** file
  discovery, HTTP, EXEC version generation, PLAT recovery, or execution.
- `SubmitManualExecutionHandler` **owns** the explicit use-case boundary and
  side-effect ordering. It collaborates with identity resolution, the aggregate,
  the version mapping seam, and the repository; it **must not own** domain
  eligibility conditionals or snapshot mutation.
- `ExecutionSnapshotRepository` **owns** persistence mechanics at its port;
  its adapters **must not own** acceptance, eligibility, or drift semantics.
- The version mapping seam **owns** translation of the foreign EXEC contract;
  it **must not** discover versions or create EXEC authority locally.

No generic `SnapshotService`, `Manager`, `Factory`, strategy family, event bus,
or mutable DTO is proposed.

## 10. SOLID Assessment

| Component | SRP | OCP | LSP | ISP | DIP | Result |
|---|---|---|---|---|---|---|
| `AdrEligibilityPolicy` | PASS | PASS | NOT_APPLICABLE | PASS | PASS | PASS |
| `ExecutionSnapshot` | PASS | PASS | NOT_APPLICABLE | PASS | PASS | PASS |
| `SubmitManualExecutionHandler` | PASS | PASS | NOT_APPLICABLE | PASS | PASS | PASS |
| `ExecutionSnapshotRepository` | PASS | PASS | NOT_APPLICABLE | PASS | PASS | PASS |
| EXEC version mapping seam | PASS | NOT_APPLICABLE | NOT_APPLICABLE | PASS | PASS | PASS |

There is one real variation/boundary axis: foreign version mapping and physical
snapshot persistence. No hypothetical extensibility is introduced.

```text
SRP_VIOLATIONS = 0
OCP_VIOLATIONS = 0
LSP_VIOLATIONS = 0
ISP_VIOLATIONS = 0
DIP_VIOLATIONS = 0
UNJUSTIFIED_SOLID_VIOLATIONS = 0
```

## 11. Dependency Direction

```text
Snapshot value objects, policy, and aggregate
        ↑ depend only on DOM vocabulary and TICKET-001 identity types
Manual submission handler
        ↑ depends on domain objects and narrow repository/mapping seams
EXEC/PLAT adapters and transport consumers
        ↑ implement or map the seams; they do not redefine DOM semantics
```

The domain must not import filesystem, HTTP, ORM, serializer, EXEC SDK, or PLAT
types.

```text
DEPENDENCY_DIRECTION_VIOLATIONS = 0
INFRASTRUCTURE_LEAKAGE_POINTS = 0
```

## 12. Invariant Placement

| Invariant | Domain Enforcement | Durable Protection | Application Guard | Test |
|---|---|---|---|---|
| Processing begins only by explicit manual submission | `SubmitManualExecutionHandler` command boundary | Persist only accepted submission records | No discovery/session trigger dependency | Negative application tests |
| Only `ACCEPTED` ADRs at eligible revisions enter snapshot | `AdrEligibilityPolicy` and `ExecutionSnapshot` construction | Validate serialized decision state on load | Resolve exact canonical references first | Domain invariant tests |
| ADR hashes are frozen | `AdrSnapshotEntry` immutable value | Immutable/append-only snapshot record | No update command exposed | Mutation and replay tests |
| Base/configuration/exact versions are frozen | Snapshot value objects and confirmation comparison | Durable record retains exact values | Caller supplies one explicit basis | Drift/no-fallback tests |
| Confirmed snapshot cannot absorb later authority | `ExecutionSnapshot.confirm` rejects mismatch and returns no changed aggregate | Atomic immutable persistence transition | Caller maps rejection without fallback | Stale-protection tests |
| Snapshot identity is not a filename | `SnapshotId` and canonical ADR references | Identity-qualified storage key | Command requires identity references | Filename-only negative test |

`UNPLACED_DOMAIN_INVARIANTS = 0`. Persistence protects durability and atomicity;
it does not become the semantic owner.

## 13. Persistence Design

- `AGGREGATE_STORAGE_BOUNDARY`: one immutable record per `ExecutionSnapshot`;
  its ADR entries and exact authority basis are stored together.
- `REPOSITORY_PORT_BOUNDARY`: `ExecutionSnapshotRepository` exposes only
  create/confirm/resolve operations needed by the use case; no generic update
  or field mutation API.
- `SERIALIZATION_BOUNDARY`: an adapter maps persisted records into validated
  `SnapshotId`, ADR references, eligibility state, hashes, base, configuration,
  versions, and status before rehydration.
- `CONCURRENCY_REVISION_MECHANISM`: the adapter must atomically reject a stale
  confirmation against the current immutable snapshot record; the concrete
  storage mechanism remains PLAT-owned.
- `ATOMICITY_BOUNDARY`: one snapshot creation or confirmation; no transaction
  spans execution, scheduler, or foreign lifecycle.
- `DURABLE_INVARIANT_PROTECTION`: no overwrite of confirmed snapshot contents;
  unique snapshot identity and exact basis are retained.
- `INTEGRITY_VALIDATION`: malformed, unknown, non-accepted, or revision-mismatched
  records are rejected before entering the aggregate.
- `RECOVERY_BEHAVIOR`: physical replay/recovery belongs to PLAT-001; a recovered
  record must re-enter through the same validated snapshot construction seam.
- `ARCHIVAL_BEHAVIOR`: `NOT_APPLICABLE`; retention policy is outside this ticket.

No schema, ORM, filesystem, or concrete async/sync choice is frozen beyond the
repository's existing host convention; no productive adapter currently exists.

## 14. Lifecycle Design

```text
new manual authority basis → DRAFT
DRAFT + complete eligible exact basis → CONFIRMED
DRAFT or CONFIRMED + later drift/mismatch → reject, state unchanged
```

`ExecutionSnapshot.confirm(...)` is the transition owner. There is no implicit
`INVALIDATED` or fallback state introduced by this ticket; later lifecycle
invalidation semantics remain subject to their owning ticket.

Forbidden bypasses:

- automatic file discovery, absent SPEC, or session state cannot call the
  submission handler;
- callers cannot set snapshot status or replace contained values;
- repositories/adapters cannot accept a malformed or non-eligible snapshot by
  skipping the aggregate;
- a later authority basis cannot overwrite a confirmed snapshot.

## 15. Cross-Spec Integration

| Foreign Owner | Contract | Local Integration Point | ACL | Forbidden Local Ownership |
|---|---|---|---|---|
| `SPEC-EXEC-001` | Exact applicable skill/contract version metadata | `ExactVersionSet` mapping at manual submission seam | Explicit version mapper | EXEC lifecycle, version generation, or capability registry |
| `SPEC-PLAT-001` | Physical snapshot persistence/recovery | `ExecutionSnapshotRepository` port | Persistence adapter | SQL/filesystem/recovery semantics or snapshot business rules |
| `SPEC-REPO-001` | Historical compatibility reads, if later supplied | Snapshot resolution adapter | Foreign compatibility adapter | Second DOM snapshot authority |

Foreign concepts remain references or mapped values. No foreign lifecycle is
copied into the DOM snapshot aggregate.

## 16. Main Interaction Flow

1. `SubmitManualExecutionHandler` receives an explicit command containing
   canonical ADR references and the exact base/configuration/version basis.
2. The handler resolves every ADR through `CanonicalIdentityCatalog` without
   discovering files or selecting ADRs implicitly.
3. `AdrEligibilityPolicy` rejects any unknown, ineligible, or non-`ACCEPTED`
   revision; no snapshot is constructed or persisted on rejection.
4. `ExecutionSnapshot` constructs the immutable draft and confirms only the
   complete exact basis.
5. `ExecutionSnapshotRepository` persists/resolves the immutable record through
   the PLAT seam and returns explicit persistence outcomes.
6. Execution and later consumers receive the snapshot as read-only authority;
   they cannot extend or rewrite it.

## 17. Failure / Recovery Flow

| Concern | Design |
|---|---|
| Failure point | Identity resolution, eligibility, incomplete basis, drift, or persistence conflict |
| Detection | Domain policy/aggregate for semantic failures; repository adapter for durable conflict |
| Durable evidence | Repository result and, when supported by PLAT, persisted rejection/transition evidence; no new event bus |
| Failure owner | Domain for invalid basis/eligibility; application for outcome mapping; PLAT for storage failure |
| Retry owner | Caller/application may explicitly resubmit a new command; no automatic retry or rebase is introduced |
| Idempotency boundary | Snapshot identity plus exact authority basis; duplicate creation is rejected/resolved by repository contract |
| Recovery path | PLAT rehydrates through validated `ExecutionSnapshot` construction |
| Reconciliation path | Explicit caller supplies a new manual basis; existing confirmed snapshot is unchanged |
| Terminal failure rule | Non-accepted/unknown/drifted basis fails closed with no transition or fallback |

## 18. Clean Code Assessment

| Check | Result | Evidence |
|---|---|---|
| Clear domain naming | PASS | Snapshot, eligibility, exact basis, and manual submission use ticket vocabulary |
| Small cohesive methods | PASS | Policy decides eligibility; aggregate constructs/confirms; handler coordinates |
| Explicit side effects | PASS | Repository calls are isolated in the application handler |
| Explicit mutation boundaries | PASS | Immutable values and aggregate methods return new/confirmed state |
| No boolean parameter explosion | PASS | Status/eligibility are typed domain concepts |
| No long parameter list | PASS | Group exact basis into value objects/records |
| No primitive obsession | PASS | Snapshot ID, base, hashes, configuration, and versions have semantic types |
| No magic values | PASS | `ACCEPTED`, `DRAFT`, and `CONFIRMED` are closed vocabularies |
| No generic buckets | PASS | No Manager/Helper/Util/GenericService proposed |
| No duplicated domain rules | PASS | Eligibility has one policy owner |
| No unnecessary mutability | PASS | Snapshot and contained values are immutable |
| No comment-dependent correctness | PASS | Boundaries and tests enforce the rules |

## 19. Test Design

| Behavior / Invariant | Test Type | Target | Expected Proof |
|---|---|---|---|
| Explicit manual command is required | NEGATIVE_BEHAVIOR / APPLICATION | `SubmitManualExecutionHandler` | Discovery, absent SPEC, and session-only requests are rejected with no repository call |
| Accepted ADR enters eligibility | DOMAIN_INVARIANT | `AdrEligibilityPolicy` | `ACCEPTED` eligible revision is accepted |
| Non-accepted/unknown/ineligible ADR fails closed | DOMAIN_INVARIANT / NEGATIVE_BEHAVIOR | Policy + handler | Proposed, rejected, superseded, unknown, and invalid revisions produce no snapshot |
| Exact ADR hashes/base/configuration/versions are frozen | DOMAIN_INVARIANT | `ExecutionSnapshot` | Values are preserved and cannot be externally mutated |
| Confirmed snapshot rejects later drift | STALE_PROTECTION / STATE_TRANSITION | `ExecutionSnapshot.confirm` | Rejection returns unchanged snapshot and no persistence overwrite |
| Snapshot rehydration preserves invariants | PERSISTENCE / COMPATIBILITY | Repository adapter seam | Persisted data enters through validated construction |
| Duplicate snapshot identity is handled explicitly | IDEMPOTENCY / PERSISTENCE | Repository port contract | No duplicate accepted record or silent replacement |
| EXEC exact version mapping preserves meaning | CROSS_SPEC / INTEGRATION | Mapping seam | Foreign metadata maps without becoming local EXEC authority |
| Productive boundary does not depend on prototype/infrastructure | ARCHITECTURE_CONFORMANCE | Source import checks | Forbidden imports/references are rejected |

## 20. Structural Risk Assessment

| Risk | Level | Mitigation |
|---|---|---|
| `GOD_COMPONENT_RISK` | LOW | Keep manual orchestration, policy, aggregate, and persistence separate |
| `OVERSIZED_FILE_RISK` | LOW | Use two focused productive modules; split only if a real boundary appears |
| `RESPONSIBILITY_MIXING_RISK` | LOW | Explicit ownership table and no persistence in domain |
| `EXCESSIVE_DEPENDENCY_RISK` | LOW | Handler receives narrow identity/repository/mapping seams |
| `DUPLICATION_RISK` | LOW | Reuse TICKET-001 identity resolution and one eligibility policy |
| `TESTABILITY_RISK` | LOW | Domain tests require no infrastructure; repository is injected |
| `CROSS_SPEC_LEAKAGE_RISK` | MEDIUM | Map EXEC/PLAT values at seams and retain foreign ownership |
| `ARCHITECTURE_DRIFT_RISK` | LOW | Do not touch prototype or add a new architectural layer |
| `ANEMIC_DOMAIN_MODEL_RISK` | LOW | Aggregate owns construction, confirmation, immutability, and drift rejection |
| `FAT_APPLICATION_SERVICE_RISK` | LOW | Handler only coordinates resolution, policy, aggregate, and repository |
| `FAT_INTERFACE_RISK` | LOW | Repository exposes only snapshot persistence/resolution operations |
| `PRIMITIVE_OBSESSION_RISK` | LOW | Use semantic value objects for exact authority fields |
| `DEPENDENCY_INVERSION_RISK` | LOW | Domain depends on no technology; adapters implement ports |
| `INFRASTRUCTURE_LEAKAGE_RISK` | LOW | PLAT/EXEC types do not enter domain directly |
| `DOMAIN_RULE_DUPLICATION_RISK` | LOW | Eligibility is centralized in `AdrEligibilityPolicy` |
| `PREMATURE_ABSTRACTION_RISK` | LOW | No strategies/factories/providers/event bus |
| `OVERENGINEERING_RISK` | LOW | Minimal aggregate, policy, handler, and repository seam |

## 21. Implementation Sequence

1. Add semantic value objects and closed vocabularies for snapshot identity and
   exact basis. Test validation, equality, and immutability immediately.
2. Add `AdrEligibilityPolicy` and the immutable `ExecutionSnapshot` aggregate.
   Test accepted-only admission, complete construction, confirmation,
   monotonic lifecycle, drift rejection, and no mutation.
3. Add the narrow `ExecutionSnapshotRepository` port and validated
   serialization/rehydration seam. Test duplicate, stale, and malformed-record
   outcomes without requiring a physical adapter.
4. Add `SubmitManualExecutionHandler`. Test explicit manual-only triggering,
   resolution ordering, no repository call on rejection, and outcome mapping.
5. Add the EXEC version mapping contract and integration tests. Verify that
   foreign metadata is consumed exactly and not recreated.
6. Run ticket tests, full regression, typecheck, lint/build, and architecture
   import checks. No prototype code is changed.

## 22. Files Expected to Change

| Path / Area | Classification | Reason |
|---|---|---|
| `src/domain/snapshot.ts` | `EXPECTED_CREATE` | Snapshot value objects, eligibility policy, aggregate, and repository port |
| `src/application/snapshot.ts` | `EXPECTED_CREATE` | Explicit manual submission orchestration and foreign-version mapping seam |
| `tests/dom-001-ticket-002.test.ts` | `EXPECTED_CREATE` | Productive domain/application/persistence-boundary tests |
| `src/domain/identity.ts` | `MUST_NOT_MODIFY` | Reuse completed identity authority; no adjacent refactor |
| `src/application/identity.ts` | `MUST_NOT_MODIFY` | Reuse existing resolver; no duplicate handler |
| `prototype/**` | `MUST_NOT_MODIFY` | Prototype is evidence only |
| ADRs, SPECs, Gap Matrix, Plan, tickets | `MUST_NOT_MODIFY` | Upstream authority and ticket scope are frozen |

## 23. Open Questions / Blockers

`NONE`.

Physical persistence method names and recovery mechanics remain host/PLAT
implementation details, not blockers for this design. The exact EXEC version
payload is consumed through the already declared cross-SPEC contract and does
not require a new authority decision.

## 24. Design Metrics

```text
RESPONSIBILITIES = 7
DOMAIN_CONCEPTS = 8
AGGREGATE_ROOTS = 1
ENTITIES = 1
VALUE_OBJECTS = 6
DOMAIN_SERVICES = 0
APPLICATION_SERVICES = 1
PORTS = 1
ADAPTERS = 0
ANTI_CORRUPTION_LAYERS = 1
PROPOSED_COMPONENTS = 7
CRITICAL_INVARIANTS = 6
UNPLACED_DOMAIN_INVARIANTS = 0
TEST_SURFACES = 9
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
