# DOM-001-TICKET-002 — Implementation Design

## 1. Design Verdict

```text
IMPLEMENTATION_DESIGN_READY
```

The ticket is a coherent DOM-IMP-02 unit. Its formerly blocking DOM authority
reader is now supplied by DOM-IMP-03 and is productively available at the local
consumer point under `PROMO-DOM-ADR-01`. The design keeps ADR lifecycle
authority in TICKET-003, snapshot meaning in `ExecutionSnapshot`, orchestration
in the manual handler, and physical persistence/recovery in PLAT.

## 2. Ticket

| Field | Value |
|---|---|
| Ticket ID | `DOM-001-TICKET-002` |
| Ticket path | `docs/tickets/SPEC-DOM-001/DOM-001-TICKET-002-manual-entry-snapshot-eligibility.md` |
| Implementation Unit | `DOM-IMP-02 — Manual entry, snapshot, and eligibility boundary` |
| Portfolio Obligations | `O-002`, `O-003`, `O-004` |
| Requirements | `DOM-INGEST-001`, `DOM-SNAPSHOT-001`, `DOM-ELIG-001` |
| Gap IDs | `GAP-003`, `GAP-004`, `GAP-005` |
| Acceptance IDs | `AC-DOM-002`, `AC-DOM-003`, `AC-DOM-004` |
| Current execution basis | TICKET-003 local finalization, `EV-DOM-IMP-03-AUTHORITY-READER-COMPLETE`, `PROMO-DOM-ADR-01`, current Plan/index `CURRENT_DAG_STATE = READY` |

The ticket file retains historical `STATUS: BLOCKED` text from before the
TICKET-003 release. This design does not mutate the ticket; its readiness
decision uses the current derived handoff and current TICKET-003 audit proof,
not that stale derived header.

## 3. Implementation Responsibility

Accept one explicit manual submission, resolve canonical accepted ADR authority, and produce an immutable pre-execution snapshot whose basis is independently revalidated before confirmation.

## 4. Repository Architecture Context

The repository is a small TypeScript domain/application codebase:

- `src/domain/identity.ts` owns canonical identity value objects and the DOM
  identity catalog port.
- `src/domain/adr.ts` now owns the productive DOM ADR lifecycle, authority
  observation, succession, and reconstruction boundary delivered by TICKET-003.
- `src/domain/snapshot.ts` owns snapshot values, eligibility behavior,
  immutable basis comparison, and the `DRAFT`/`CONFIRMED` snapshot boundary.
- `src/application/snapshot.ts` owns the manual command handler and foreign
  metadata mapping. It coordinates; it does not decide ADR lifecycle.
- Persistence is represented locally by `ExecutionSnapshotRepository`. No
  concrete database, journal, serialization adapter, or runtime host exists in
  this repository. PLAT owns those physical capabilities at the integrated
  checkpoint.
- Integration boundaries are typed DOM ports and explicit mapping functions.
  EXEC supplies exact version metadata, PLAT supplies durable snapshot/recovery
  material, and REPO supplies historical compatibility mapping.
- `tests/dom-001-ticket-002.test.ts` is the productive local test boundary.
  `prototype/**` remains non-authoritative and must not be imported.

No new framework, application layer, event bus, CQRS boundary, schema, or
runtime architecture is required.

## 5. Existing Repository Context

| Existing Component | Classification | Current Responsibility | Design Use |
|---|---|---|---|
| `CanonicalIdentityCatalog` | REUSE | Resolves exact canonical identity records | Resolve the SPEC endpoint; never infer identity from filenames or caller labels |
| `AdrAuthorityCatalog` | INTEGRATE | TICKET-003 productive DOM ADR authority and reconstruction catalog | Producer of the existing `AdrAuthorityReader` contract; do not recreate or move lifecycle rules |
| `AdrAuthorityReader` | REUSE | Returns canonical ADR reference, decision/realization status, and content hash | Inject into the snapshot handler for initial and independent second observations |
| `AdrRecordReconstructionAuthority` | REUSE | Resolves exact ADR records and validates reciprocal history | Supply the semantic rehydration path when persisted snapshot entries are checked |
| `ExecutionSnapshot` | EXTEND_WITHIN_TICKET | Immutable snapshot basis and draft confirmation | Own eligibility-bearing basis, exact comparison, and immutability |
| `AdrEligibilityPolicy` | EXTEND_WITHIN_TICKET | Checks ADR kind and accepted decision status | Consume authoritative observation, not caller-supplied status |
| `ExecutionSnapshotRepository` | REUSE / CONTRACT EXTENSION IF REQUIRED | Reserve, confirm, and find snapshot records | Preserve duplicate, stale, missing, and atomicity semantics; PLAT owns physical implementation |
| `SubmitManualExecutionHandler` | REFACTOR_WITHIN_TICKET | Maps command values and currently confirms a draft against itself | Coordinate canonical resolution, two observations, reservation, and confirmation |
| `mapExecExactVersionMetadata` / `ExactVersionSet` | REUSE | Maps and freezes exact skill/contract version fields | Preserve exact values without importing EXEC lifecycle semantics |
| `tests/dom-001-ticket-002.test.ts` | EXTEND_WITHIN_TICKET | Existing manual, eligibility, immutability, and rehydration tests | Add direct authority-consumption, temporal drift, lock, recovery, and architecture witnesses |
| `prototype/**` | DO_NOT_TOUCH | Disposable scenario/UI model | Never use as productive authority or import target |

## 6. Domain Model Assessment

### Domain concepts

- `ExecutionSnapshot` is the single aggregate root for the pre-execution basis.
- `SnapshotId`, `SnapshotBase`, `ConfigurationVersion`, `AdrContentHash`, and
  `ExactVersionSet` are immutable value objects with validation and equality.
- `CanonicalIdentityReference` is the existing canonical reference value for
  SPEC and ADR endpoints.
- `AdrSnapshotEntry` is an immutable value object contained by the snapshot;
  it is not an independent aggregate or identity authority.
- `AdrAuthorityObservation` is the read contract supplied by TICKET-003. It is
  an observation, not a caller command model and not a second ADR authority.
- `AdrEligibilityPolicy` owns the local accepted-only admission rule once the
  canonical observation has been obtained.
- `SubmitManualExecutionCommand` is an application input record. Its explicit
  command shape is not itself canonical ADR truth.

### Aggregates and behavior

`ExecutionSnapshot` owns the meaningful domain behavior: accepted-entry
admission, exact basis comparison, immutable state, and the only semantic
`DRAFT → CONFIRMED` transition. The manual handler owns ordering and dependency
coordination. `AdrAuthorityCatalog` owns ADR lifecycle and canonical
reconstruction outside this ticket. No domain service or domain event is
needed.

`ANEMIC_DOMAIN_MODEL_RISK = LOW`: the snapshot aggregate and eligibility policy
carry real rules. `FAT_APPLICATION_SERVICE_RISK = LOW`: the handler remains a
thin coordinator and does not decide ADR lifecycle or persistence meaning.

### Repository and ACL boundaries

`AdrAuthorityReader`, `AdrRecordReconstructionAuthority`, and
`ExecutionSnapshotRepository` are stable domain-facing ports. EXEC, PLAT, and
REPO concepts are translated at the application/persistence boundary and do
not enter the snapshot domain as foreign authority models.

## 7. UPSTREAM_AUTHORITY_PRECONDITIONS

The following is the required authority handoff record. It cites the current
authority and proof artifacts; it does not redefine them.

| Concern | Proof / authority and revision | Status | Design consequence |
|---|---|---|---|
| Identity | `ADR-0001` rev. 3; `DOM-ID-001`; `ACP-DOM-02`; TICKET-001 identity proof and finalization evidence | `COMPLETE` | Use explicit `SnapshotId` for this aggregate and exact canonical SPEC/ADR references; filename, hash, or correlation is never identity |
| Lifecycle / eligibility | `ADR-0001` rev. 3; `DOM-ELIG-001`; `ACP-DOM-02`; TICKET-003 `ACP-DOM-03` and current round-12 audit | `COMPLETE` | Consume TICKET-003's `AdrAuthorityReader`; do not create an ADR lifecycle or trust caller status |
| Persistence / recovery | `DOM-SNAPSHOT-001`; SPEC-DOM-001 §12.2 persistence/reconstruction matrix; `PCP-PLAT-02` | `COMPLETE` as contract; PLAT physical producer is integrated-only | Keep a repository port and validated reconstruction path; do not implement physical storage here |
| Rehydration | `AGGREGATE_RECONSTRUCTION_PROOF = COMPLETE` in the current component SPEC audit; `AC-DOM-004`; `AdrRecordReconstructionAuthority` | `COMPLETE` | Create and rehydrate remain distinct; persisted material is validated before becoming a snapshot |
| Concurrency / temporal authority | `TAP-02` for DOM-IMP-02; TICKET-003 `TAP-03` and `EV-DOM-IMP-03-AUTHORITY-READER-COMPLETE` for the producer | `COMPLETE` | Make two independent ADR observations and confirm only after exact basis comparison; physical CAS remains PLAT-owned |
| Idempotency | Ticket §14c and `ExecutionSnapshotRepository` reserve/confirm contract; ADR-0006 rev. 3 for physical replay boundaries | `COMPLETE` for local snapshot contract | Duplicate identity and stale confirmation are explicit outcomes; no fallback or implicit retry creates a new basis |
| Ownership | `ADR-0001` rev. 3; SPEC-DOM-001 ownership and persistence matrices | `COMPLETE` | DOM owns trigger, eligibility, snapshot meaning, and semantic rejection; PLAT owns storage/recovery; EXEC owns versions |
| Cross-SPEC dependencies | `PCP-EXEC-01`, `PCP-PLAT-02`, `PCP-REPO-01`; current Plan §12.1 | `COMPLETE` | Foreign capabilities remain integrated-only and do not block local closure |

### Aggregate identity proof

```text
AGGREGATE_ROOT = ExecutionSnapshot
CANONICAL_IDENTITY = SnapshotId.value for the local snapshot aggregate
IDENTITY_AUTHORITY_SOURCE = ADR-0001 rev3; SPEC-DOM-001 §12.2; DOM-IMP-02 ticket contract
IDENTITY_KIND_OR_TYPE = explicit SnapshotId value object; nested endpoints retain canonical SPEC/ADR kinds
IDENTITY_SCOPE = snapshot command/execution boundary; no filename or session scope is authoritative
STABLE_CORRELATION_FIELDS = SnapshotId, canonical SPEC reference, ordered ADR references
CREATION_RULE = explicit manual command creates one DRAFT snapshot
COMMAND_REPRESENTATION = SubmitManualExecutionCommand.snapshotId, canonical SPEC reference, and ADR reference inputs
REPOSITORY_LOOKUP_REPRESENTATION = SnapshotId.value through ExecutionSnapshotRepository
PERSISTED_REPRESENTATION = SnapshotId, status, exact SPEC/ADR references, hashes, base, configuration, and exact versions
REHYDRATED_REPRESENTATION = immutable ExecutionSnapshot returned only after semantic reconstruction validation
EQUALITY_AND_CONTINUITY_SEMANTICS = SnapshotId identifies the aggregate; exact basis equality governs confirmation
REVISION_RELATIONSHIP = snapshot status transition is distinct from persistence revision and ADR identity revision
ALIASES_LOCAL_IDS_DERIVED_IDS = none authoritative
ALIAS_AUTHORITY_AND_FORBIDDEN_SUBSTITUTIONS = filename, title, content hash alone, request correlation, session state, or persistence revision
PROOF_EVIDENCE = TICKET-001 identity evidence; SPEC-DOM-001 §12.2; current snapshot domain contract
IDENTITY_RESULT = COMPLETE
```

### Aggregate reconstruction proof

```text
AGGREGATE_OR_ENTITY = ExecutionSnapshot
WHAT_PERSISTED_MATERIAL_IS_ACCEPTED = exact SnapshotId, DRAFT/CONFIRMED status, canonical SPEC reference, ADR references/content hashes, base, configuration, and ExactVersionSet fields
WHO_VALIDATES_PERSISTED_MATERIAL = ExecutionSnapshot domain construction plus DOM canonical identity/ADR reconstruction authorities; PLAT validates physical material only
CREATE_SEMANTICS = manual command, authoritative accepted ADR observations, and exact basis create DRAFT
REHYDRATE_SEMANTICS = persisted material is mapped into validated value objects and aggregate state; no raw constructor or detached material bypass
REHYDRATABLE_STATES = DRAFT and CONFIRMED, subject to the repository's accepted snapshot record contract
CURRENT_STATE_EVIDENCE = repository record plus exact canonical ADR reference/hash observations and persisted snapshot status
CANONICAL_IDENTITY_RESOLUTION = SnapshotId lookup; nested SPEC through CanonicalIdentityCatalog; nested ADR through AdrAuthorityReader/AdrRecordReconstructionAuthority
REFERENCE_ATTACHMENT_VALIDATION = SPEC kind is SPEC, ADR kind is ADR, references are canonical, and each recorded ADR content basis is attached to the exact revision
VERSION_OR_REVISION_VALIDATION = positive identity revisions and non-empty exact skill/contract versions; storage revision remains distinct
CAN_UNTRUSTED_OR_DETACHED_PERSISTED_MATERIAL_BE_MATERIALIZED_DIRECTLY_AS_VALID_DOMAIN_STATE? = NO
RECONSTRUCTION_VALIDATOR_OR_RESOLVER_OWNER = DOM ExecutionSnapshot construction with CanonicalIdentityCatalog and TICKET-003 ADR reconstruction authority
PREDECESSOR_SUCCESSOR_OR_PROGRESSION_PROVENANCE = DRAFT reservation followed by one conditional CONFIRMED transition; no later ADR is merged into a confirmed snapshot
CAUSAL_SEQUENCE_OR_EQUIVALENT_CONTINUITY_EVIDENCE = exact snapshot identity/basis and accepted repository transition result
CONTINUITY_VALIDATION = exact field comparison, canonical reference attachment, status validation, and immutable nested values
STALE_STATE_BEHAVIOR = SNAPSHOT_AUTHORITY_DRIFT or SNAPSHOT_STALE; no confirmation mutation
UNKNOWN_REFERENCE_BEHAVIOR = ADR_AUTHORITY_NOT_FOUND, SNAPSHOT_NOT_FOUND, or the owning canonical identity error
DETACHED_REFERENCE_BEHAVIOR = reject before returning a snapshot; no fallback to filename or caller shape
CORRUPTED_MATERIAL_BEHAVIOR = INVALID_SNAPSHOT_VALUE / INVALID_SNAPSHOT_ENTRY / rehydration mismatch; no state returned
SKIPPED_STATE_BEHAVIOR = no fabricated CONFIRMED state; only the declared DRAFT → CONFIRMED transition is valid
FORGED_LATER_STATE_BEHAVIOR = reject material whose exact references, hashes, status, or basis do not match the accepted record
STATE_SKIP_REJECTION = YES
STATE_EVIDENCE_INCONSISTENCY_REJECTION = YES
FORGED_LATER_STATE_REJECTION = YES
DOMAIN_VALIDATION_OWNER = ExecutionSnapshot and AdrEligibilityPolicy
PERSISTENCE_ADAPTER_RESPONSIBILITY = storage, serialization, atomic reservation/CAS, and physical recovery only
FAIL_CLOSED_FAILURES = YES
FAIL_CLOSED_RESULT = no confirmed transition and no overwrite when material, authority, or basis is invalid
MUTATION_ON_FAILURE = NO for the aggregate; a reserved DRAFT remains unchanged when confirmation fails
PERSISTED_IDENTITY_STATE_VERSION = SnapshotId plus nested canonical identity revisions; distinct from PLAT persistence revision
INVARIANTS_REVALIDATED = identity, endpoint kinds, accepted-at-capture eligibility, exact hashes/base/configuration/versions, status, and immutability
EXTERNAL_REFERENCES_REQUIRED = DOM ADR authority; EXEC exact version basis; PLAT durable material at integrated proof
INVALID_PERSISTENCE_BEHAVIOR = reject; caller-shaped or detached material never becomes valid domain state
INCOMPLETE_HISTORY_BEHAVIOR = fail closed for missing/corrupt snapshot or detached ADR reference
STALE_STATE_BEHAVIOR = preserve existing DRAFT/CONFIRMED record and return explicit stale/drift failure
PROOF_EVIDENCE = SPEC-DOM-001 §12.2; `AC-DOM-004`; `TICKET-003` reconstruction proof; local T002 recovery witnesses
RECONSTRUCTION_RESULT = COMPLETE
```

### External authority consumption proofs

The internal DOM capability is recorded explicitly because it is required for
local execution. The three foreign capabilities are contract-defined but
integrated-only; local fixtures do not promote them.

```text
AUTHORITY_CONSUMPTION_PROOF: ACP-DOM-02 / PCP-DOM-03→02
CAPABILITY_ID = CAP-DOM-ADR-AUTHORITY-READ-OBSERVATION
AUTHORITY_EXISTENCE = ADR-0001 rev3 and SPEC-DOM-001 DOM-ELIG-001
TRUTH_OWNER = SPEC-DOM-001 / DOM-IMP-03
AUTHORITY_SEMANTIC_SOURCE = TICKET-003 AdrRecord/AdrAuthorityCatalog lifecycle and observation contract
OWNER_DOMAIN_OR_BOUNDED_CONTEXT = DOM
CONSUMPTION_CONTRACT = AdrAuthorityReader.observe(CanonicalIdentityReference)
CONTRACT_PRODUCER = AdrAuthorityCatalog / DOM-IMP-03 / TICKET-003
CONTRACT_CONSUMER = SubmitManualExecutionHandler / DOM-IMP-02 / TICKET-002
RETURNED_DATA = canonical ADR reference, decision status, realization status, and content hash
VERSION_REVISION_TRANSPORT = canonical reference revision and content hash; second observation is a new reader call
FAILURE_NOT_FOUND_STALE_SEMANTICS = missing, non-accepted, stale, mismatched, caller-supplied, fallback, self-compared, or corrupt authority fails closed without snapshot confirmation
AUTHORITY_STATUS = DEFINED
CONTRACT_STATUS = DEFINED
SEMANTIC_STATUS = DEFINED_AND_DOM_OWNED
LOCAL_TESTABILITY = YES
PRODUCTIVE_AVAILABILITY = YES after EV-DOM-IMP-03-AUTHORITY-READER-COMPLETE and PROMO-DOM-ADR-01
CAPABILITY_SUMMARY_STATUS = CONTRACT_PRODUCTIVELY_AVAILABLE
DEPENDENCY_CLASS = REQUIRED_FOR_LOCAL_EXECUTION
AVAILABILITY_EVIDENCE = current TICKET-003 round-12 architecture/behavior audits plus EV/PROMO handoff; stale historical execution counts are not used as evidence
BLOCKING_EFFECT = none after the promoted producer handoff; before promotion T002 was BLOCKED_BY_UPSTREAM_CONTRACT
PROOF_EVIDENCE = EV-DOM-IMP-03-AUTHORITY-READER-COMPLETE; PROMO-DOM-ADR-01; current TICKET-003 audit
```

```text
AUTHORITY_CONSUMPTION_PROOF: PCP-EXEC-01
CAPABILITY_ID = CAP-EXEC-EXACT-VERSION-BASIS
TRUTH_OWNER = SPEC-EXEC-001
CONSUMPTION_CONTRACT = exact skill/contract identity, version, revision, and compatibility basis mapped to ExactVersionSet
CONTRACT_PRODUCER = EXEC-001 registry
CONTRACT_CONSUMER = SubmitManualExecutionHandler / DOM-SNAPSHOT-001
RETURNED_DATA = exact skill and contract version metadata
VERSION_REVISION_TRANSPORT = stored unchanged in ExactVersionSet
FAILURE_NOT_FOUND_STALE_SEMANTICS = unknown, incompatible, missing, or stale basis fails closed; no fallback
AUTHORITY_STATUS = DEFINED
CONTRACT_STATUS = DEFINED
SEMANTIC_STATUS = DEFINED_BY_EXEC-001_CONTRACT
LOCAL_TESTABILITY = NO
PRODUCTIVE_AVAILABILITY = NO
CAPABILITY_SUMMARY_STATUS = CONTRACT_DEFINED
DEPENDENCY_CLASS = REQUIRED_FOR_INTEGRATED_PROOF
AVAILABILITY_EVIDENCE = no productive EXEC registry/adapter in this repository
BLOCKING_EFFECT = does not block local execution or local closure; blocks integrated exact-version proof
PROOF_EVIDENCE = Plan §12.1 and §12.3 `PCP-EXEC-01`
```

```text
AUTHORITY_CONSUMPTION_PROOF: PCP-PLAT-02
CAPABILITY_ID = CAP-PLAT-SNAPSHOT-PIPELINE-PROVENANCE
TRUTH_OWNER = SPEC-PLAT-001 for physical storage/recovery; DOM remains semantic owner
CONSUMPTION_CONTRACT = durable snapshot material and recovery result mapped back to DOM exact basis
CONTRACT_PRODUCER = PLAT journal/checkpoint reader
CONTRACT_CONSUMER = ExecutionSnapshotRepository / DOM-SNAPSHOT-001
RETURNED_DATA = canonical snapshot identity, status, exact basis, persistence revision, and recovery/integrity result
VERSION_REVISION_TRANSPORT = snapshot/ADR identity revisions and separate persistence revision are preserved
FAILURE_NOT_FOUND_STALE_SEMANTICS = missing, detached, stale, corrupt, duplicate, omitted, or inconsistent material fails closed
AUTHORITY_STATUS = DEFINED
CONTRACT_STATUS = DEFINED
SEMANTIC_STATUS = DEFINED_BY_PLAT_CONTRACT_WITH_DOM_SEMANTIC_VALIDATION
LOCAL_TESTABILITY = NO
PRODUCTIVE_AVAILABILITY = NO
CAPABILITY_SUMMARY_STATUS = CONTRACT_DEFINED
DEPENDENCY_CLASS = REQUIRED_FOR_INTEGRATED_PROOF
AVAILABILITY_EVIDENCE = no productive PLAT journal/checkpoint adapter in this repository
BLOCKING_EFFECT = does not block local semantic closure; blocks integrated durability/restart proof
PROOF_EVIDENCE = Plan §12.1 and TICKET-002 §14b `PCP-PLAT-02`
```

```text
AUTHORITY_CONSUMPTION_PROOF: PCP-REPO-01
CAPABILITY_ID = REPO-LEGACY-SNAPSHOT-INPUT-MAPPING
TRUTH_OWNER = SPEC-REPO-001 for legacy compatibility mechanics; DOM owns snapshot meaning
CONSUMPTION_CONTRACT = explicit historical-input mapping that preserves canonical references and never promotes legacy status/hash
CONTRACT_PRODUCER = REPO compatibility adapter
CONTRACT_CONSUMER = TICKET-002 application compatibility boundary
RETURNED_DATA = mapped historical input or explicit mapping failure
VERSION_REVISION_TRANSPORT = canonical identity/revision and retained historical fields are preserved
FAILURE_NOT_FOUND_STALE_SEMANTICS = missing, malformed, conflicting, or authority-bearing legacy fields fail closed
AUTHORITY_STATUS = DEFINED
CONTRACT_STATUS = DEFINED
SEMANTIC_STATUS = DEFINED_BY_REPO_CONTRACT
LOCAL_TESTABILITY = YES for deterministic mapping contract only
PRODUCTIVE_AVAILABILITY = NO
CAPABILITY_SUMMARY_STATUS = CONTRACT_TESTABLE_LOCALLY
DEPENDENCY_CLASS = REQUIRED_FOR_INTEGRATED_PROOF
AVAILABILITY_EVIDENCE = no productive REPO adapter in this repository
BLOCKING_EFFECT = no local semantic closure block; integrated compatibility evidence remains deferred
PROOF_EVIDENCE = TICKET-002 §14b `PCP-REPO-01` and Plan §12.3
```

```text
PRODUCER_CONSUMER_CONTRACT_PROOFS = 4
TEMPORAL_AUTHORITY_PROOFS = TAP-02 plus producer TAP-03 handoff
TEMPORAL_AUTHORITY_GAPS = 0
CALLER_AS_AUTHORITY_CHECK = PASS
CALLER_SUPPLIED_AUTHORITY_BYPASS = 0
PROHIBITED_NORMATIVE_DECISIONS = 0
```

## 8. Aggregate / Consistency Boundaries

| Aggregate | Root | Invariants | Transaction / Consistency Boundary | External References |
|---|---|---|---|---|
| Pre-execution immutable snapshot | `ExecutionSnapshot` | explicit manual origin, canonical ADR eligibility, exact basis, immutable nested values, one-way confirmation, no authority drift | `reserve(DRAFT)` followed by conditional `confirm(CONFIRMED)` for one `SnapshotId`; PLAT supplies physical atomicity | canonical SPEC/ADR references, EXEC exact metadata, PLAT snapshot record |

The aggregate is deliberately smaller than the ADR lifecycle. It stores a
historical basis; it does not own ADR status transitions, revision succession,
or physical storage. External references are immutable values and are never
replaced by foreign IDs.

## 9. Responsibility Decomposition

| Responsibility | Authority | State Owned | Expected Test Surface |
|---|---|---|---|
| Manual trigger boundary | `DOM-INGEST-001`, `ADR-0001` | explicit submission command acceptance | application positive test and discovery/session negative test |
| Canonical ADR observation | `ACP-DOM-02`, `PCP-DOM-03→02`, TICKET-003 producer | initial and second ADR observations | authority-reader contract, not-found, false-caller, and drift tests |
| Accepted-only eligibility | `DOM-ELIG-001`, `O-004` | admission decision for each submitted ADR | domain invariant tests for accepted/proposed/rejected/superseded/unknown |
| Snapshot basis construction | `DOM-SNAPSHOT-001`, `O-003` | exact SPEC/ADR references, hashes, base, configuration, and versions | aggregate unit/invariant and exact-field tests |
| Temporal confirmation and lock | `TAP-02`, snapshot transition contract | DRAFT/CONFIRMED status and basis equality | state transition, stale protection, deterministic interleaving, and idempotency tests |
| Persistence/recovery and foreign mapping seam | `PCP-PLAT-02`, `PCP-EXEC-01`, `PCP-REPO-01` | repository record and mapped external fields | repository contract, rehydration, compatibility, and integrated checkpoint tests |

`RESPONSIBILITY_MIXING_RISK = LOW` in the proposed structure. Persistence
mechanics and foreign lifecycle decisions stay outside the domain aggregate.

## 10. Proposed Components

| Component | Type | Responsibility | Existing/New | Expected Location | Size |
|---|---|---|---|---|---|
| `CanonicalIdentityCatalog` | OTHER | Resolve the exact SPEC reference used by the snapshot | Existing / reuse | `src/domain/identity.ts` | SMALL |
| `AdrAuthorityCatalog` | INTEGRATION_COMPONENT | Provide TICKET-003's canonical ADR observations and reconstruction authority | Existing / integrate, do not duplicate | `src/domain/adr.ts` | MEDIUM |
| `AdrAuthorityReader` | PORT | Read the current canonical ADR observation | Existing / reuse | `src/domain/adr.ts` | SMALL |
| `AdrRecordReconstructionAuthority` | PORT | Validate exact ADR material and reciprocal history on rehydration | Existing / reuse | `src/domain/adr.ts` | SMALL |
| `AdrEligibilityPolicy` | DOMAIN_POLICY | Admit only authoritative `ADR` references with decision status `ACCEPTED` | Existing / extend | `src/domain/snapshot.ts` | SMALL |
| `AdrSnapshotEntry` | VALUE_OBJECT | Hold one immutable ADR reference/hash capture | Existing / extend | `src/domain/snapshot.ts` | SMALL |
| `ExecutionSnapshot` | AGGREGATE_ROOT | Own exact basis, immutable state, and DRAFT-to-CONFIRMED transition | Existing / extend | `src/domain/snapshot.ts` | MEDIUM |
| `ExecutionSnapshotRepository` | PORT | Reserve, conditionally confirm, find, and expose explicit repository outcomes | Existing / reuse; adapter contract may be extended only locally | `src/domain/snapshot.ts` | SMALL |
| `SubmitManualExecutionHandler` | COMMAND_HANDLER | Orchestrate explicit input, canonical reads, snapshot construction, and persistence outcomes | Existing / refactor within ticket | `src/application/snapshot.ts` | SMALL |
| `mapExecExactVersionMetadata` | ANTI_CORRUPTION_LAYER | Map exact EXEC fields without importing EXEC semantics | Existing / reuse | `src/application/snapshot.ts` | SMALL |

### Component ownership details

`CanonicalIdentityCatalog` owns SPEC identity lookup, collaborates with the
handler, and must not own snapshot eligibility or ADR lifecycle.

`AdrAuthorityCatalog`/`AdrAuthorityReader` own access to TICKET-003's canonical
ADR truth, collaborate through the reader port, and must not accept caller
status/hash as authority or decide snapshot persistence.

`AdrRecordReconstructionAuthority` owns canonical ADR reconstruction validation,
collaborates with snapshot rehydration, and must not rewrite historical
snapshot basis or own PLAT serialization.

`AdrEligibilityPolicy` owns accepted-only admission, collaborates with the
authoritative observation and `AdrSnapshotEntry`, and must not read storage,
perform I/O, or create ADR lifecycle state.

`AdrSnapshotEntry` owns immutable reference/hash capture, collaborates with
`ExecutionSnapshot`, and must not resolve authority or mutate itself.

`ExecutionSnapshot` owns its invariant-checked state, exact basis comparison,
and one-way confirmation. It collaborates with the eligibility policy and
repository boundary through the handler. It must not own ADR lifecycle,
foreign version semantics, physical persistence, or retry orchestration.

`ExecutionSnapshotRepository` owns persistence outcomes and physical atomicity
at its implementation boundary. It collaborates with the application handler
and PLAT adapter. It must not decide eligibility, lifecycle meaning, or
canonical authority.

`SubmitManualExecutionHandler` owns use-case sequencing and failure mapping. It
collaborates with the identity catalog, ADR reader, aggregate, mapper, and
repository. It must not become a generic service, reimplement domain rules, or
fall back to caller fields.

`mapExecExactVersionMetadata` owns explicit foreign field translation. It must
not validate or recreate the EXEC registry.

All components have one primary reason to change: the domain contract they
represent, the boundary contract they consume, or the repository mechanics
they implement.

## 11. SOLID Assessment

| Component | SRP | OCP | LSP | ISP | DIP | Result |
|---|---|---|---|---|---|---|
| `ExecutionSnapshot` | one snapshot invariant/state boundary | no hypothetical variation | not applicable; no inheritance | not applicable | depends only on domain values | PASS |
| `AdrEligibilityPolicy` | one eligibility rule | no artificial strategy hierarchy | not applicable | not applicable | pure domain input | PASS |
| `SubmitManualExecutionHandler` | one manual-submission use case | no speculative extension point | not applicable | depends on narrow ports | depends on identity/reader/repository contracts | PASS |
| `AdrAuthorityReader` | one observation capability | producer variation is a real boundary | implementations must return the same observation semantics | narrow one-operation consumer port | application depends on abstraction | PASS |
| `ExecutionSnapshotRepository` | snapshot storage contract only | result unions preserve known repository outcomes | implementations must preserve reserve/confirm semantics | no unrelated query/mutation methods | domain/application depend on port | PASS |
| `mapExecExactVersionMetadata` | one foreign mapping operation | no EXEC strategy introduced | not applicable | not applicable | mapping is outside domain semantics | PASS |
| `AdrAuthorityCatalog` | lifecycle/authority producer remains TICKET-003-owned | existing variation boundary only | existing implementations conform to reader contract | consumed through narrow reader/reconstruction ports | no snapshot dependency on concrete catalog | PASS |

```text
SRP_VIOLATIONS = 0
OCP_VIOLATIONS = 0
LSP_VIOLATIONS = 0
ISP_VIOLATIONS = 0
DIP_VIOLATIONS = 0
UNJUSTIFIED_SOLID_VIOLATIONS = 0
```

No Strategy, Factory, Provider, event bus, generic service, or generic utility
is justified by this ticket.

## 12. Dependency Direction

```text
src/application/snapshot.ts
    → domain snapshot values/aggregate
    → AdrAuthorityReader / AdrRecordReconstructionAuthority ports
    → ExecutionSnapshotRepository port

AdrAuthorityCatalog (TICKET-003) ─implements→ AdrAuthorityReader
PLAT adapter ─implements→ ExecutionSnapshotRepository
EXEC/REPO mappings ─enter through explicit application/persistence seams

src/domain/*  ─must not import→ database, filesystem, HTTP, SDK, prototype, or UI
```

```text
DEPENDENCY_DIRECTION_VIOLATIONS = 0
INFRASTRUCTURE_LEAKAGE_POINTS = 0
```

The architecture-conformance test must execute a productive boundary check for
the handler and import graph. A source comment or inspection-only assertion is
not sufficient evidence.

## 13. Invariant Placement

| Invariant | Domain Enforcement | Durable Protection | Application Guard | Test |
|---|---|---|---|---|
| Only explicit manual input starts the use case | command boundary and handler API | PLAT/BACKEND integration records the explicit command where applicable | no discovery/session invocation path | direct manual positive and discovery/session negative test |
| Only canonical ADR revisions with decision status `ACCEPTED` enter a new snapshot | `AdrAuthorityReader` supplies truth; `AdrEligibilityPolicy` rejects other observations | persisted entry retains exact reference/hash for later validation | resolve/observe before constructing the aggregate; never promote caller fields | accepted-only matrix and authority-bypass tests |
| Snapshot captures exact ADR hashes, base, configuration, and versions | immutable value objects and aggregate construction | PLAT stores exact fields without merge/overwrite | map EXEC fields explicitly and build once from the authoritative basis | exact-field and mutation tests |
| Confirmation accepts only an independently matching current basis | `ExecutionSnapshot.hasSameAuthorityBasis` and `confirm` | repository conditional confirm/CAS; physical atomicity belongs to PLAT | call reader again after reservation and before confirmation | deterministic drift and state-preservation tests |
| A confirmed snapshot cannot be overwritten | aggregate rejects confirmation from `CONFIRMED`; immutable values | unique reservation and conditional update | map duplicate/stale outcomes without fallback | duplicate, lock, one-winner, and isolation tests |
| Rehydration cannot materialize detached/corrupt material | validated constructors plus canonical identity/ADR reconstruction | PLAT integrity/recovery supplies material; it cannot bypass DOM validation | repository mapper invokes validated rehydration | exact round-trip, missing, corrupt, detached, and mismatch tests |

```text
UNPLACED_DOMAIN_INVARIANTS = 0
```

## 14. Persistence Design

- `ExecutionSnapshot` is the aggregate storage boundary, keyed by explicit
  `SnapshotId`. The repository port exposes `reserve`, `confirm`, and `find`
  result contracts; it does not decide domain eligibility.
- Serialization belongs to the PLAT adapter. The persisted record must retain
  the full canonical endpoint references, exact ADR content hashes, base,
  configuration, exact skill/contract versions, status, and the physical
  persistence revision required by PLAT. No field may be silently recomputed
  from a filename, current ADR list, or caller assertion.
- The local semantic transition is `DRAFT → CONFIRMED`. `reserve` creates or
  uniquely reserves the DRAFT record; `confirm` conditionally commits the
  matching confirmed basis. A duplicate, stale, missing, or mismatched result
  leaves the existing record unchanged. PLAT supplies physical CAS/atomicity;
  a persistence revision is not an ADR or snapshot-domain progression proof.
- There is no snapshot registry/index in the DOM ticket. Any physical index is
  a query aid owned by PLAT and must resolve back to `SnapshotId`.
- Integrity validation is split correctly: DOM validates meaning, canonical
  references, exact basis, and immutability; PLAT validates serialization,
  physical integrity, atomicity, and recovery material.
- Local tests use deterministic in-memory contract fixtures. They prove local
  semantics and rehydration behavior, not durable restart, physical CAS, or
  productive PLAT availability.
- Archival is `NOT_APPLICABLE`; immutable snapshot history must remain
  addressable, and no archive transition is introduced.

## 15. Lifecycle Design

```text
STATE_SET = { DRAFT, CONFIRMED }
INITIAL_STATE = DRAFT
ALLOWED_TRANSITIONS = explicit manual creation → DRAFT; matching independent basis → CONFIRMED
REJECTED_TRANSITIONS = automatic/discovery start; DRAFT confirmation with drift; CONFIRMED overwrite/reconfirm; duplicate reservation
MUTATION_AUTHORITY = ExecutionSnapshot aggregate for semantic state; repository for physical reservation/atomicity
REPOSITORY_CONTRACT = reserve(DRAFT), confirm(matching snapshot), find(SnapshotId), explicit ACCEPTED/DUPLICATE/CONFIRMED/STALE/NOT_FOUND outcomes
ISOLATION_INVARIANT = one SnapshotId cannot overwrite another snapshot or absorb a later ADR/configuration basis
STATE_TRANSITION_TEST = direct handler/aggregate test for DRAFT → CONFIRMED and every rejected transition
```

There are no ticket-specific recovery or terminal transitions beyond preserving
the immutable `CONFIRMED` state. An authority drift failure preserves the
existing DRAFT and does not silently retry or confirm it. Automatic discovery,
session state, caller status/hash, and repository-level semantic transitions
are forbidden bypass paths.

## 16. Cross-Spec Integration

| Foreign Owner | Contract | Local Integration Point | ACL | Forbidden Local Ownership |
|---|---|---|---|---|
| `SPEC-EXEC-001` | `PCP-EXEC-01`; exact skill/contract identity, version, revision, compatibility basis; unknown/incompatible/stale fails closed; `AUTHORITY_STATUS=DEFINED`, `CONTRACT_STATUS=DEFINED`, `LOCAL_TESTABILITY=NO`, `PRODUCTIVE_AVAILABILITY=NO`, `DEPENDENCY_CLASS=REQUIRED_FOR_INTEGRATED_PROOF` | `mapExecExactVersionMetadata` and `ExactVersionSet` at the manual snapshot application boundary | explicit field mapper | EXEC registry, capability semantics, version selection, or compatibility decision |
| `SPEC-PLAT-001` | `PCP-PLAT-02`; durable snapshot/recovery material, physical integrity/atomicity, persistence revision; missing/detached/stale/corrupt/inconsistent fails closed; `AUTHORITY_STATUS=DEFINED`, `CONTRACT_STATUS=DEFINED`, `LOCAL_TESTABILITY=NO`, `PRODUCTIVE_AVAILABILITY=NO`, `DEPENDENCY_CLASS=REQUIRED_FOR_INTEGRATED_PROOF` | `ExecutionSnapshotRepository` port and validated rehydration mapper | repository/serialization adapter boundary owned by PLAT | database, journal, schema, physical CAS implementation, recovery engine, or snapshot meaning |
| `SPEC-REPO-001` | `PCP-REPO-01`; explicit historical input mapping with no authority transfer; malformed/conflicting legacy material fails closed; `AUTHORITY_STATUS=DEFINED`, `CONTRACT_STATUS=DEFINED`, `LOCAL_TESTABILITY=YES` for mapping fixture, `PRODUCTIVE_AVAILABILITY=NO`, `DEPENDENCY_CLASS=REQUIRED_FOR_INTEGRATED_PROOF` | explicit compatibility mapping at the application input seam | legacy mapper | alternate snapshot/ADR authority, caller status/hash truth, or legacy write path |

The internal DOM row is not foreign and is already recorded in section 7:
`PCP-DOM-03→02`, `CAP-DOM-ADR-AUTHORITY-READ-OBSERVATION`, producer
DOM-IMP-03, consumer DOM-IMP-02, `PRODUCTIVE_AVAILABILITY=YES` after the
explicit promotion. No foreign capability is promoted by this design.

## 17. Main Interaction Flow

1. `SubmitManualExecutionHandler` receives a typed, explicit manual command.
   There is no discovery/session command path in this boundary.
2. The handler resolves the SPEC reference through `CanonicalIdentityCatalog`.
3. For each submitted ADR reference, it obtains an initial observation from
   `AdrAuthorityReader`. The reader, not the command, supplies status, exact
   revision, and content hash.
4. If legacy command fields for status/hash are retained for compatibility,
   the handler may compare them to the observation and reject mismatches; it
   never uses them to construct authority.
5. `AdrEligibilityPolicy` admits only authoritative `ADR`/`ACCEPTED`
   observations. The handler creates `AdrSnapshotEntry` values from those
   observations, maps exact version fields, and creates an immutable DRAFT
   `ExecutionSnapshot`.
6. `ExecutionSnapshotRepository.reserve` reserves the DRAFT. A duplicate is
   returned as `SNAPSHOT_ALREADY_EXISTS` without overwrite or fallback.
7. After reservation, the handler makes a second, independent reader call for
   every ADR. It builds the current candidate basis from those observations
   and compares all exact fields against the draft.
8. `ExecutionSnapshot.confirm` rejects any drift. If the basis matches, the
   repository conditionally confirms the snapshot; stale/not-found outcomes
   are mapped explicitly and do not mutate prior state.
9. The confirmed snapshot is returned to downstream execution/persistence
   owners with exact fields intact. EXEC/PLAT/REPO remain consumers of their
   own contracts.

## 18. Failure / Recovery Flow

| Failure point | Detection | Durable evidence | Failure owner | Retry owner | Idempotency boundary | Recovery / reconciliation |
|---|---|---|---|---|---|---|
| Automatic/discovery/session input | typed command boundary rejects unknown shape | no snapshot write | DOM application boundary | caller with an explicit command | command invocation | no fallback to discovery or session state |
| Unknown SPEC or ADR reference | `CanonicalIdentityCatalog`/reader returns not found | existing state unchanged | owning DOM identity/ADR authority | caller/application with corrected canonical reference | exact canonical reference | fail closed; do not infer from filename/title |
| Proposed, rejected, superseded, or false caller status/hash | `AdrEligibilityPolicy` or explicit compatibility comparison | no reservation | DOM semantic owner | caller with fresh authoritative input | exact ADR reference/content basis | reject; no status/hash promotion and no fallback |
| ADR drift between observations | independent second reader observation differs by reference/status/revision/hash | reserved DRAFT remains unchanged; no CONFIRMED write | DOM snapshot boundary | application only after a fresh command/basis | SnapshotId plus exact authority basis | preserve DRAFT and return `SNAPSHOT_AUTHORITY_DRIFT` |
| Duplicate or stale reservation/confirmation | repository returns `DUPLICATE`, `STALE`, or `NOT_FOUND` | existing record is preserved | DOM maps semantic outcome; PLAT owns atomic result | application/caller with explicit fresh intent | SnapshotId and repository conditional update | no overwrite, no implicit retry, no new authority |
| Corrupt, detached, missing, or mismatched persisted material | validated rehydration and canonical reference/hash checks | rejected recovery record; last valid record preserved by storage owner | DOM semantic reconstruction; PLAT physical recovery | PLAT recovery owner, then DOM validation | exact SnapshotId and persisted basis | fail closed; do not materialize or confirm |
| EXEC/PLAT/REPO foreign capability unavailable | contract boundary reports unavailable/missing/stale | no integrated effect; local fixture evidence remains scoped | owning foreign adapter | owning foreign system | foreign contract correlation | local semantic tests remain local; integrated checkpoint stays open |

### Temporal authority proof

```text
TEMPORAL_AUTHORITY_PROOF = TAP-02
INITIAL_OBSERVATION = each canonical ADR reference, decision status, realization status, revision, and content hash from AdrAuthorityReader
VERSION_REVISION_HASH_OR_CORRELATION = CanonicalIdentityReference plus AdrContentHash for each ADR entry
MUTATION_WINDOW = initial observation and DRAFT reservation through confirmation commit
RELEVANT_COMMIT_POINT = ExecutionSnapshotRepository.confirm conditional write
INDEPENDENT_SECOND_OBSERVATION = fresh AdrAuthorityReader.observe call for every ADR after reservation, before confirmation
DRIFT_DETECTION = compare reference, decision status, revision, content hash, and full snapshot basis
FAIL_CLOSED_BEHAVIOR = reject with SNAPSHOT_AUTHORITY_DRIFT; do not confirm or overwrite
STATE_PRESERVATION = existing DRAFT/CONFIRMED state and exact prior basis remain unchanged
SEMANTIC_VALIDATION_OWNER = DOM AdrEligibilityPolicy and ExecutionSnapshot
CAS_OR_PHYSICAL_INTEGRITY_ROLE = PLAT/repository physical safeguard only; it is not semantic revalidation
PROOF_EVIDENCE = Plan TAP-02; TICKET-003 producer TAP-03; direct T002 sequence-reader/drift witness
TEMPORAL_AUTHORITY_RESULT = TEMPORAL_AUTHORITY_PROTECTED
```

```text
CALLER_AS_AUTHORITY_CHECK = PASS
CALLER_SUPPLIED_AUTHORITY_BYPASS = 0
```

Caller status, hash, current eligibility, and version values are not promoted
to canonical truth. A retained legacy value is only a consistency assertion;
the reader/owner supplies authority.

## 19. Clean Code Assessment

| Check | Result | Evidence / constraint |
|---|---|---|
| `CLEAR_DOMAIN_NAMING` | PASS | Use Snapshot, Authority, Eligibility, Basis, and Confirm terminology |
| `SMALL_COHESIVE_METHODS` | PASS | Keep observation, mapping, construction, and outcome mapping distinct within the handler |
| `EXPLICIT_SIDE_EFFECTS` | PASS | Repository reserve/confirm calls are visible and ordered |
| `EXPLICIT_MUTATION_BOUNDARIES` | PASS | Aggregate returns new immutable state; repository owns storage mutation |
| `NO_BOOLEAN_PARAMETER_EXPLOSION` | PASS | Use typed command/result records, not mode booleans |
| `NO_LONG_PARAMETER_LISTS` | PASS | Preserve input records and typed basis objects |
| `NO_PRIMITIVE_OBSESSION_WHERE_DOMAIN_TYPE_EXISTS` | PASS | Existing value objects carry IDs, hashes, bases, configuration, and versions |
| `NO_MAGIC_VALUES` | PASS | Reuse explicit status unions and error codes |
| `NO_GENERIC_UTIL_BUCKETS` | PASS | Mapping remains named and local to the EXEC boundary |
| `NO_GENERIC_SERVICE_BUCKETS` | PASS | The handler is a specific manual-submission command handler |
| `NO_DUPLICATED_DOMAIN_RULES` | PASS | Reader owns ADR truth, policy owns eligibility, aggregate owns snapshot invariants |
| `NO_DEEP_NESTING_BY_DESIGN` | PASS | Early rejection and discriminated repository results |
| `NO_COMMENT_DEPENDENT_CORRECTNESS` | PASS | Two reads, immutable values, and comparisons enforce behavior |
| `NO_HIDDEN_TEMPORAL_COUPLING` | PASS | Initial read, reservation, second read, and confirmation are explicit |
| `NO_UNNECESSARY_MUTABILITY` | PASS | Snapshot basis, entries, and value objects are frozen |

```text
PREMATURE_ABSTRACTION_RISK = LOW
OVERENGINEERING_RISK = LOW
```

## 20. Test Design

### Test surfaces

| Behavior / Invariant | Test Type | Target | Expected Proof |
|---|---|---|---|
| Explicit manual-only initiation | APPLICATION + NEGATIVE_BEHAVIOR | `SubmitManualExecutionHandler` | explicit command creates a snapshot; discovery/session-shaped input cannot invoke processing |
| Accepted-only canonical eligibility | DOMAIN_INVARIANT + NEGATIVE_BEHAVIOR | `AdrEligibilityPolicy` with `AdrAuthorityReader`/`AdrAuthorityCatalog` | accepted ADR succeeds; proposed/rejected/superseded/unknown and false caller status/hash reject before reserve |
| Exact immutable basis | DOMAIN_INVARIANT + UNIT | `ExecutionSnapshot` and `AdrSnapshotEntry` | exact references, hashes, base, configuration, and versions are captured and cannot be mutated |
| Independent temporal lock | STATE_TRANSITION + STALE_PROTECTION + CONCURRENCY | handler, sequence reader, and repository fixture | second observation drift rejects and preserves DRAFT; matching observation confirms |
| Snapshot idempotency/isolation | IDEMPOTENCY + CONCURRENCY | `ExecutionSnapshotRepository` contract fixture | one winner for a duplicate SnapshotId; duplicate/confirmed snapshots cannot overwrite unrelated records |
| Rehydration and corruption rejection | RECOVERY + NEGATIVE_BEHAVIOR | validated snapshot rehydration plus canonical ADR reconstruction fixture | exact DRAFT/CONFIRMED basis round-trips; missing, detached, corrupt, mismatched, or forged material returns no state |
| Foreign field boundary | CROSS_SPEC + COMPATIBILITY | EXEC mapper and repository mapping seam | exact foreign fields are preserved; foreign lifecycle/storage meaning is not recreated locally |
| Architecture boundary | ARCHITECTURE_CONFORMANCE | productive handler/domain import graph | no prototype/infrastructure import and no alternate ADR authority path; executable guard, not source inspection only |

### Lifecycle and concurrency declarations

```text
STATE_SET = { DRAFT, CONFIRMED }
INITIAL_STATE = DRAFT
ALLOWED_TRANSITIONS = create/manual reserve → DRAFT; exact independently reobserved basis → CONFIRMED
REJECTED_TRANSITIONS = automatic start; invalid eligibility; basis drift; duplicate reserve; stale confirm; CONFIRMED overwrite
MUTATION_AUTHORITY = ExecutionSnapshot for semantic state; repository/PLAT for physical atomicity
REPOSITORY_CONTRACT = reserve, confirm, find with explicit duplicate/stale/not-found outcomes
ISOLATION_INVARIANT = exact SnapshotId and basis isolate one snapshot from another and from later ADR acceptance
STATE_TRANSITION_TEST = direct DRAFT → CONFIRMED plus negative transition matrix

CONCURRENCY_CONTRACT = unique SnapshotId reservation and conditional basis confirmation
ONE_WINNER_EXPECTATION = concurrent identical submissions produce exactly one accepted reservation
DUPLICATE_STATE_EXPECTATION = every losing submission returns DUPLICATE or explicit stale outcome; stored basis is unchanged
DETERMINISTIC_INTERLEAVING_OR_ADAPTER_TEST = barrier-controlled repository fixture interleaves two reserve/confirm attempts
```

### Complete `ACCEPTANCE_WITNESS_MATRIX`

The source ticket's legacy `LOCAL_IMPLEMENTATION` labels are represented here
by the canonical dependency taxonomy required by the shared gate. This is a
design mapping only; it does not modify the ticket artifact.

| NORMATIVE_BEHAVIOR | NORMATIVE_VERB | CONCRETE_OPERATION_COMMAND_OR_QUERY | STATE_OR_TRANSITION_AFFECTED | DIRECT_POSITIVE_TEST | DIRECT_NEGATIVE_OR_ISOLATION_TEST | EXPECTED_EVIDENCE_FILE | EVIDENCE_TYPE | ACCEPTANCE_OWNER | REQUIRED_PRODUCER_OR_CAPABILITY | AUTHORITY_STATUS | CONTRACT_STATUS | LOCAL_TESTABILITY | PRODUCTIVE_AVAILABILITY | CAPABILITY_SUMMARY_STATUS | DEPENDENCY_CLASS | WITNESS_EXECUTABLE_AT_LOCAL_CLOSURE |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Manual trigger | accepts | explicit `SubmitManualExecutionCommand` | manual submission accepted; discovery/session remains inert | `T2-AC1-P`: explicit command reaches handler and creates snapshot | `T2-AC1-N`: discovery/session-shaped input cannot start processing | `docs/tickets/SPEC-DOM-001/evidence/TICKET-002/AC-DOM-002-manual-entry.md` | `LOCAL_TEST_EVIDENCE` | TICKET-002 | none — local DOM boundary | DEFINED | DEFINED | YES | YES | CONTRACT_PRODUCTIVELY_AVAILABLE | `REQUIRED_FOR_LOCAL_CLOSURE` | YES |
| Canonical authority snapshot and eligibility | resolves, admits, and freezes | initial ADR reader observation → eligibility resolution → snapshot creation | accepted ADR basis enters DRAFT; non-accepted/false authority is rejected | `T2-AC2-P`: reader-backed accepted revision stores exact reference/hash basis | `T2-AC2-N`: proposed/rejected/superseded/unknown, false caller status/hash, fallback, self-comparison, or second-read drift rejects | `docs/tickets/SPEC-DOM-001/evidence/TICKET-002/AC-DOM-003-snapshot.md` | `LOCAL_TEST_EVIDENCE` | TICKET-002 | `CAP-DOM-ADR-AUTHORITY-READ-OBSERVATION` | DEFINED | DEFINED | YES | YES | CONTRACT_PRODUCTIVELY_AVAILABLE | `REQUIRED_FOR_LOCAL_EXECUTION` | YES |
| Immutable basis recovery | rehydrates and rejects | validated snapshot rehydrate → mutation/corruption attempt | exact DRAFT/CONFIRMED basis is restored without mutable aliasing | `T2-AC3-P`: exact fields round-trip and remain frozen | `T2-AC3-N`: mutation, missing, corrupt, detached, mismatched, or forged material returns no valid snapshot and preserves stored state | `docs/tickets/SPEC-DOM-001/evidence/TICKET-002/AC-DOM-004-rehydration.md` | `LOCAL_TEST_EVIDENCE` | TICKET-002 | `CAP-DOM-ADR-AUTHORITY-READ-OBSERVATION` for local semantic validation; `PCP-PLAT-02` remains integrated-only | DEFINED | DEFINED | YES | YES | CONTRACT_PRODUCTIVELY_AVAILABLE | `REQUIRED_FOR_LOCAL_CLOSURE` | YES |

### Direct witness gate

Each matrix row executes the normative operation and asserts both positive and
negative/isolation behavior. The concurrency declaration has a deterministic
adapter fixture, and the architecture boundary has an executable productive
guard. Foreign durable/restart/physical-CAS evidence remains correctly
classified as integrated-only and is not claimed by local fixtures.

```text
ACCEPTANCE_WITNESS_MATRIX_ROWS = 3
DIRECT_BEHAVIOR_WITNESSES = 3
PROXY_ONLY_BEHAVIORS = 0
UNTESTED_STATE_TRANSITIONS = 0
UNPROVEN_CONCURRENCY_CONTRACTS = 0
MISSING_ARCHITECTURE_GUARDS = 0
DESIGN_TEST_COVERAGE_GATE: PASS
```

## 21. Structural Risk Assessment

| Risk | Level | Mitigation / rationale |
|---|---|---|
| `GOD_COMPONENT_RISK` | LOW | Keep the handler as sequencing only and keep lifecycle/eligibility/physical storage in their owners |
| `OVERSIZED_FILE_RISK` | MEDIUM | `snapshot.ts` contains a cohesive snapshot vocabulary; do not add ADR lifecycle, PLAT adapters, or generic utilities to it |
| `RESPONSIBILITY_MIXING_RISK` | LOW | Separate reader, policy, aggregate, handler, mapper, and repository port |
| `EXCESSIVE_DEPENDENCY_RISK` | LOW | Handler uses only the identity, reader, mapper, and repository seams required by the use case |
| `DUPLICATION_RISK` | LOW | Reuse TICKET-003 authority and existing snapshot value objects; no second ADR catalog |
| `TESTABILITY_RISK` | MEDIUM | No PLAT producer exists locally; keep local semantic/recovery fixtures separate from integrated durable evidence and use deterministic reader/repository seams |
| `CROSS_SPEC_LEAKAGE_RISK` | MEDIUM | Use explicit EXEC/PLAT/REPO mapping rows and keep foreign capability classes integrated-only |
| `ARCHITECTURE_DRIFT_RISK` | MEDIUM | Add executable import/boundary guards and forbid prototype or concrete infrastructure dependencies |
| `ANEMIC_DOMAIN_MODEL_RISK` | LOW | `ExecutionSnapshot` and `AdrEligibilityPolicy` own real invariant decisions |
| `FAT_APPLICATION_SERVICE_RISK` | LOW | Handler has one use-case reason to change and delegates decisions |
| `FAT_INTERFACE_RISK` | LOW | Reader and repository ports are narrow, cohesive capabilities |
| `PRIMITIVE_OBSESSION_RISK` | LOW | Existing domain value objects cover all meaningful snapshot primitives |
| `DEPENDENCY_INVERSION_RISK` | LOW | Domain depends on ports, never PLAT/EXEC/REPO implementations |
| `INFRASTRUCTURE_LEAKAGE_RISK` | LOW | No database, serializer, HTTP, SDK, or prototype type crosses into domain |
| `DOMAIN_RULE_DUPLICATION_RISK` | LOW | ADR lifecycle stays in TICKET-003; snapshot eligibility and confirmation each have one owner |
| `PREMATURE_ABSTRACTION_RISK` | LOW | Reuse the existing TICKET-003 reader; add no speculative provider/factory hierarchy |
| `OVERENGINEERING_RISK` | LOW | The design requires only existing values, ports, aggregate, handler, mapper, and tests |

All MEDIUM risks are mitigated by explicit boundaries and test surfaces. No
HIGH structural, DDD, SOLID, or Clean Code risk remains.

## 22. Implementation Sequence

1. **Pin the current authority handoff.** Revalidate the current
   `CAP-DOM-ADR-AUTHORITY-READ-OBSERVATION` producer evidence against the
   implementation target and inject `AdrAuthorityReader`. Test the positive
   observation, not-found, and two-call contract immediately.
2. **Remove caller authority.** Change the manual handler's construction path
   so status/hash are sourced from the reader. If legacy fields remain,
   compare them only as assertions and reject mismatches. Test false status,
   false hash, fallback, and discovery-shaped input.
3. **Place eligibility in the domain.** Extend `AdrEligibilityPolicy` and
   `AdrSnapshotEntry` to accept canonical observations and construct immutable
   entries. Test every decision status and wrong endpoint kind before any
   repository reserve.
4. **Construct the aggregate basis.** Build `ExecutionSnapshot` from exact
   SPEC/ADR references, hashes, base, configuration, and mapped version
   values. Test exact field capture, value-object validation, and mutation
   attempts immediately.
5. **Implement the temporal confirmation sequence.** Reserve the DRAFT, make
   independent second reader observations, compare the full basis, and confirm
   only on a match. Test drift, stale/duplicate outcomes, state preservation,
   and barrier-controlled one-winner behavior.
6. **Close the rehydration seam.** Ensure repository mapping invokes validated
   snapshot reconstruction and canonical ADR/reference checks before returning
   state. Test exact round-trip, missing/corrupt/detached material, and no
   mutation on failure. Do not add physical PLAT persistence.
7. **Verify foreign mappings and compatibility.** Preserve exact EXEC fields,
   keep PLAT/REPO mappings explicit, and retain legacy reads without legacy
   authority-bearing writes. Test mapping contract behavior locally and record
   foreign productive checks as deferred integrated evidence.
8. **Run the complete direct witness and architecture suite.** Execute the
   T002 focused tests, productive regression suite, import/boundary guard, and
   evidence generation. Recheck the current target fingerprint before local
   closure; do not copy stale TICKET-003 execution counts.

## 23. Files Expected to Change

| Path / Area | Classification | Reason |
|---|---|---|
| `src/domain/snapshot.ts` | EXPECTED_MODIFY | authoritative eligibility input, immutable basis/rehydration validation, and semantic lock transition |
| `src/application/snapshot.ts` | EXPECTED_MODIFY | consume `AdrAuthorityReader`, perform two observations, map explicit outcomes, and remove caller authority |
| `tests/dom-001-ticket-002.test.ts` | EXPECTED_MODIFY | direct manual, eligibility, authority-bypass, drift, concurrency, recovery, and architecture witnesses |
| `docs/tickets/SPEC-DOM-001/evidence/TICKET-002/AC-DOM-002-manual-entry.md` | EXPECTED_CREATE_AT_COMPLETION | local manual-trigger evidence |
| `docs/tickets/SPEC-DOM-001/evidence/TICKET-002/AC-DOM-003-snapshot.md` | EXPECTED_CREATE_AT_COMPLETION | authority-backed exact snapshot evidence |
| `docs/tickets/SPEC-DOM-001/evidence/TICKET-002/AC-DOM-004-rehydration.md` | EXPECTED_CREATE_AT_COMPLETION | immutable local reconstruction evidence |
| `docs/tickets/SPEC-DOM-001/evidence/TICKET-002/temporal-authority.md` | EXPECTED_CREATE_AT_COMPLETION | TAP-02 evidence |
| `src/domain/adr.ts` / `src/application/adr.ts` | MUST_NOT_MODIFY | TICKET-003 authority producer is upstream and finalized; consume its contract |
| `src/domain/identity.ts` | MUST_NOT_MODIFY | TICKET-001 canonical identity authority is upstream and finalized |
| `prototype/**` | MUST_NOT_MODIFY | non-authoritative scenario/UI model |
| PLAT database/journal/schema/recovery implementation | MUST_NOT_MODIFY | foreign persistence owner and integrated checkpoint |
| ADRs, Portfolio, SPEC, Gap Matrix, Plan, ticket index, and audit artifacts | MUST_NOT_MODIFY | upstream authority and audit history are not changed by design or implementation |

## 24. Open Questions / Blockers

```text
NONE
```

The TICKET-003 audit retains two informational downstream handoffs about stale
target-linked execution metadata and a legacy witness dependency label. They
do not block this local design because the current producer semantics and
availability are independently evidenced, the promotion record exists, and
the design preserves the canonical dependency taxonomy. Implementation
preflight must pin current producer evidence and must not reuse stale counts.

## 25. Design Metrics

```text
RESPONSIBILITIES = 6
DOMAIN_CONCEPTS = 10
AGGREGATE_ROOTS = 1
ENTITIES = 0
VALUE_OBJECTS = 7
DOMAIN_SERVICES = 0
DOMAIN_POLICIES = 1
APPLICATION_SERVICES = 1
PORTS = 3
ADAPTERS = 0 new; foreign adapters remain outside this ticket
ANTI_CORRUPTION_LAYERS = 3
PROPOSED_COMPONENTS = 10
EXISTING_REUSED = 5
EXISTING_EXTENDED_OR_REFACTORED = 4
NEW_PROPOSED = 0
CRITICAL_INVARIANTS = 6
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
AUTHORITY_CONSUMPTION_PROOFS = 4 (1 DOM-internal, 3 foreign)
PRODUCER_CONSUMER_CONTRACT_PROOFS = 4
TEMPORAL_AUTHORITY_PROOFS = 1 local consumer proof; producer TAP-03 cited
TEMPORAL_AUTHORITY_GAPS = 0
CALLER_SUPPLIED_AUTHORITY_BYPASS = 0
ACCEPTANCE_WITNESS_MATRIX_ROWS = 3
DIRECT_BEHAVIOR_WITNESSES = 3
PROXY_ONLY_BEHAVIORS = 0
UNTESTED_STATE_TRANSITIONS = 0
UNPROVEN_CONCURRENCY_CONTRACTS = 0
MISSING_ARCHITECTURE_GUARDS = 0
DESIGN_TEST_COVERAGE_GATE = PASS
```

## 26. Design Gate

```text
IMPLEMENTATION_DESIGN_GATE: READY_FOR_IMPLEMENTATION
```
