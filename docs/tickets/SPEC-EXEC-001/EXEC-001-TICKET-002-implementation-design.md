# EXEC-001-TICKET-002 — Implementation Design

## 1. Design Verdict

```text
IMPLEMENTATION_DESIGN_READY
```

## 2. Ticket

```text
Ticket ID: EXEC-001-TICKET-002
Ticket path: docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-version-registry-catalogs-capabilities.md
DESIGN_INPUT_TICKET_STATE: READY
TICKET_SET_AUDIT_VERDICT: IMPLEMENTATION_TICKETS_CONFORMANT
TICKET_SET_IMPLEMENTATION_GATE: READY_FOR_IMPLEMENTATION
TICKET_SET_AUDIT_TARGET_HEAD: d4216ad6f4a87fe7142ccd45d3fd099ef1b92955
TICKET_SET_AUDIT_BASIS_FINGERPRINT: 61bd0f612ba5b154d0f69e9a68a54f0375a44fe9e73a7e7debed6909ba3535e5
Implementation Unit: EXEC-IMP-02 — Version, registry resolution, catalogs and capability extensibility
Portfolio Obligations: O-017, O-020
Requirements: EXEC-VERSION-001, EXEC-VERSION-002, EXEC-REGISTRY-001, EXEC-REGISTRY-002, EXEC-REGISTRY-003, EXEC-CAPABILITY-001, EXEC-CAPABILITY-002
Gap IDs: GAP-004, GAP-006, GAP-008, GAP-009, GAP-010, GAP-011
Acceptance IDs: AC-EXEC-003, AC-EXEC-004, AC-EXEC-008, AC-EXEC-009, AC-EXEC-010, AC-EXEC-011, AC-EXEC-012
```

Frozen scope is the ticket's local version, registry-resolution, catalog-separation,
bootstrap-allowlist and common extensibility behavior. TICKET-001 is complete;
TICKET-002 has `EXECUTION_READY = TRUE`, `BLOCKED_BY = NONE`, and local closure
is available. DOM and REPO capabilities remain `REQUIRED_FOR_INTEGRATED_PROOF`
with `PRODUCTIVE_AVAILABILITY = NO`; they are not local blockers.

## 3. Implementation Responsibility

Implement the EXEC-owned semantic-version/support-set resolver and immutable,
scope-separated registry basis that deterministically resolves complete entries,
rejects bootstrap-incompatible requests, preserves `UNKNOWN_CAPABILITY` versus
`INCOMPATIBLE_CAPABILITY`, and admits schema-valid capabilities through one
common registry path without changing a frozen basis.

## 4. Repository Architecture Context

- **Domain boundary:** `src/domain/` owns immutable value objects, domain
  invariants and canonical outcomes. Reuse `src/domain/exec-contract.ts` for
  the existing semver predicate and `SchemaReference`; do not put registry
  policy in the envelope module.
- **Application boundary:** `src/application/` owns use-case orchestration and
  narrow source ports. Registry resolution/registration calls domain behavior
  and maps source failures; it does not own registry rules.
- **Infrastructure boundary:** `src/infrastructure/` owns external adapters.
  The existing schema validator is not a registry authority and remains
  untouched.
- **Composition boundary:** `src/composition/` wires the registry use cases and
  future adapters, following the existing EXEC contract composition pattern.
- **Integration boundary:** DOM supplies canonical `RepositoryId`/execution
  basis and REPO supplies enabled NORMAL catalog material at future seams.
  This ticket consumes those contracts and does not implement either producer.
- **Persistence boundary:** TICKET-002 uses immutable in-process bases only.
  Physical storage, integrity, ordering, CAS, recovery and semantic registry
  reconstruction remain PLAT/TICKET-003 concerns.
- **Test boundary:** direct ticket tests live under `tests/`; prototype and
  `.pi` tests remain non-authoritative regression/scenario evidence. An import
  guard is required because this creates the first productive registry owner.

No new architectural style, framework, event bus, generic service bucket,
transport API or persistence technology is introduced.

## 5. Existing Repository Context

| Existing Component | Classification | Current Responsibility | Design Use |
| --- | --- | --- | --- |
| `src/domain/exec-contract.ts` | REUSE | Canonical envelope/payload contract, `isSemanticVersion`, `SchemaReference`, `CONTRACT_INVALID` | Reuse existing semver syntax and schema-reference types; keep registry rules separate. |
| `src/domain/exec-schema.ts` | REUSE | Schema definitions and schema-validation port | Carry schema references in registry entries; do not alter schema authority. |
| `src/application/exec-contract.ts` | DO_NOT_TOUCH | TICKET-001 envelope/payload orchestration | Preserve its boundary; TICKET-004 owns failure-surface completion. |
| `src/infrastructure/exec-schema-validator.ts` | DO_NOT_TOUCH | JSON Schema adapter | Never become registry or capability authority. |
| `src/composition/exec-contract.ts` | DO_NOT_TOUCH | Existing composition root | Follow its narrow composition convention in a separate registry root. |
| `src/application/snapshot.ts` | DO_NOT_TOUCH | DOM snapshot consumer with the documented caller-version contradiction | TICKET-005 owns exact-basis convergence. |
| `.pi/extensions/workflow-orchestrator/*` | DO_NOT_TOUCH | Generic delegation runtime | Not a registry, schema or capability authority. |
| `prototype/src/mockDomain.ts`, `prototype/tests/*` | DO_NOT_TOUCH | In-memory scenario/UI simulation | No production behavior is copied or promoted. |
| `tests/exec-001-ticket-001.test.ts` | REUSE | Direct TICKET-001 contract witnesses | Keep as regression coverage; add a separate TICKET-002 surface. |

No productive registry, catalog source, support-set resolver or bootstrap
allowlist currently exists. The new local boundary is therefore an EXEC domain
boundary, not an extension of DOM or generic delegation code.

## 6. Domain Model Assessment

### Concepts and responsibility placement

- `SemanticVersion` — immutable parsed version with semantic major/minor/patch
  comparison and canonical representation. Reuse the existing syntax rule;
  do not use prefix or major-only approximation.
- `SupportedVersionSet` — immutable explicit set; exact membership is the only
  compatibility rule. No aliases, ranges or silent conversion.
- `CatalogScope` — immutable `NORMAL` or `BOOTSTRAP` scope. `NORMAL` carries an
  opaque DOM-owned `RepositoryId`; `BOOTSTRAP` is system-scoped and has none.
- `RegistryEntry` — immutable complete contract/capability mapping, including
  stage, skill/capability, semantic version, schema references, accepted and
  produced artifacts, allowed verdicts and role restrictions required by
  `EXEC-REGISTRY-001`.
- `CatalogBasis` — immutable scope-specific collection and frozen basis
  reference. Registration returns a new basis; it never edits an old basis.
- `VersionCompatibilityPolicy` — exact supported-set compatibility rule.
- `BootstrapAllowlistPolicy` — onboarding-only capability rule for BOOTSTRAP.
- `RegistryResolutionService` — domain coordination of complete-key lookup,
  scope/allowlist checks, compatibility and canonical outcome classification.
- `ResolveExecCapability` / `RegisterExecCapability` — application use cases
  that obtain or publish a basis and invoke domain behavior; they do not decide
  domain invariants.

### Aggregates, entities and value objects

`REGISTRY_ENTRY` is the upstream aggregate root and canonical owner of its
entry invariants. `CatalogBasis` is an immutable consistency collection, not a
second identity authority. `SemanticVersion`, `SupportedVersionSet`,
`CatalogScope` and the catalog-revision reference are value concepts. The
complete NORMAL identity tuple remains upstream authority; TICKET-002 does not
create `RepositoryId`, persistence identity, lifecycle meaning or reconstruction
semantics.

`ANEMIC_DOMAIN_MODEL_RISK = LOW`: real rules live in entry/basis methods and
named policies. `FAT_APPLICATION_SERVICE_RISK = LOW`: use cases only load,
coordinate, invoke and return.

Domain events are `NOT_APPLICABLE`: no event-delivery or external-effect
boundary is required by this ticket.

## 7. UPSTREAM_AUTHORITY_PRECONDITIONS

The following are copied as consumption records from SPEC-EXEC-001 revision 3
and its conformant audit; they are not redesigned here.

| Dimension | Authority / proof | Result and revision | Design consequence |
| --- | --- | --- | --- |
| Identity | `AGGREGATE_IDENTITY_PROOF`, SPEC §12.3; component audit §17 | `IDENTITY_CONTRACT_COMPLETE`, SPEC rev 3, audit basis `d0eea5fc93afcc254d022512b6a8ed9902fe152a885ccfd7f2ac51e609a9a6f1` | Preserve NORMAL `(CatalogScope, RepositoryId, SkillContractId, CapabilityId, SchemaId, SemanticVersion)` and independent BOOTSTRAP key. |
| Lifecycle | SPEC §§12.1, 14–16; component audit §§15, 19 | `LIFECYCLE_AUTHORITY_MATRIX = COMPLETE` | Register only an absent key; semantic change requires a new version/basis; no local lifecycle machine. |
| Persistence/recovery | `AGGREGATE_RECONSTRUCTION_PROOF`, SPEC §12.4; audit §§18, 20 | `RECONSTRUCTION_CONTRACT_COMPLETE`; physical storage/recovery remains PLAT | Only immutable local bases are handled here; physical integrity, ordering, CAS and recovery are not claimed. |
| Rehydration | SPEC §12.4; audit §18 | Complete, with untrusted/detached material forbidden from direct valid materialization | Semantic reconstruction is TICKET-003; TICKET-002 does not add a rehydration path. |
| Concurrency/idempotency | Component audit §26; Plan §17 | Duplicate/conflicting registration rejects without mutation; physical CAS is integrated-only | Local tests prove deterministic no-mutation behavior, not physical concurrent winning. |
| Ownership | ADR-0003 rev 3, portfolio O-017/O-020, SPEC §§2, 9, 13 | EXEC-001 `CANONICAL_OWNER`; DOM owns `RepositoryId`; REPO owns enablement | Keep foreign identity/configuration behind consumer seams. |
| Cross-SPEC dependencies | SPEC audit §§21–23; ticket §14a–§14b | DOM/REPO authority and contracts defined, productive availability `NO`, class `REQUIRED_FOR_INTEGRATED_PROOF` | No local closure blocker or downstream promotion. |

```text
SPEC_IMPLEMENTABILITY_CHECK = PASS
SPEC_IMPLEMENTABILITY_CHECK_REVISION = SPEC-EXEC-001 revision 3
IDENTITY_AUTHORITY_GAPS = 0
RECONSTRUCTION_AUTHORITY_GAPS = 0
LIFECYCLE_AUTHORITY_GAPS = 0
PERSISTENCE_SEMANTICS_GAPS = 0
CROSS_SPEC_AUTHORITY_GAPS = 0
PROHIBITED_NORMATIVE_DECISIONS = NONE
```

### Authority consumption and producer/consumer proofs

`ACP-EXEC-02` (ticket §14a; component audit §22) is consumed unchanged.
For every authority-bearing result the following provenance requirements apply:

| Capability | Authority consumption proof | Producer/consumer proof | Provenance and verification |
| --- | --- | --- | --- |
| `DOM-EXEC-IDENTITY-SNAPSHOT` | Truth owner `SPEC-DOM-001`; producer canonical DOM resolver; consumer EXEC-001/TICKET-002; returned `RepositoryId`, execution/snapshot basis and revisions; authority/contract `DEFINED/DEFINED`; local/productive `NO/NO`; class `REQUIRED_FOR_INTEGRATED_PROOF`; failure unknown, detached, stale, corrupt or mismatched material fails closed. | `PCP-DOM-EXEC-01`; edge `EXEC → DOM`; semantic status `DEFINED`; integrated proof only. | `PROOF_ISSUER_OWNER=SPEC-DOM-001`; `PROOF_SCOPE=RepositoryId and exact execution snapshot basis`; `PROOF_IDENTITY_OR_BRAND=canonical DOM identity/reference`; `CONSUMER_VERIFICATION_RULE=resolve and compare complete reference, scope and revision before use`; `STALE_OR_MUTATION_POLICY=reject without mutation`; forged/caller-injected RepositoryId negative test and alternate-adapter contract test required. |
| `REPO-EXEC-NORMAL-CATALOG` | Truth owner `SPEC-REPO-001`; producer enabled REPO configuration; consumer EXEC-001/TICKET-002; returned repository-scoped NORMAL catalog material and basis; authority/contract `DEFINED/DEFINED`; local/productive `NO/NO`; class `REQUIRED_FOR_INTEGRATED_PROOF`; wrong source/repository/basis fails closed. | `PCP-REPO-EXEC-01`; edge `REPO → EXEC consumer`; semantic status `DEFINED`; integrated proof only. | `PROOF_ISSUER_OWNER=SPEC-REPO-001`; `PROOF_SCOPE=authorized NORMAL catalog material for the requested DOM RepositoryId`; `PROOF_IDENTITY_OR_BRAND=producer-issued repository/basis reference`; `CONSUMER_VERIFICATION_RULE=verify producer provenance, scope, RepositoryId and frozen basis before resolution`; `STALE_OR_MUTATION_POLICY=reject stale or detached material`; forged/caller-injected catalog negative test and alternate-source contract test required. |
| `UNIT-EXEC-REGISTRY-FIXTURE` | Local fixture is contract evidence only; `AUTHORITY_STATUS=DEFINED`, `CONTRACT_STATUS=DEFINED`, `LOCAL_TESTABILITY=YES`, `PRODUCTIVE_AVAILABILITY=NO`, summary `CONTRACT_TESTABLE_LOCALLY`, class `INFORMATIONAL`. | Local test producer → local registry tests; no productive claim. | `PROOF_ISSUER_OWNER=EXEC-001 test support`; `PROOF_SCOPE=local semantic behavior only`; `PROOF_IDENTITY_OR_BRAND=fixture-controlled immutable basis`; consumer verifies exact fixture identity and rejects caller replacement; stale/mutation and forged fixture tests are required. |

For the two external capabilities, `AUTHORITY_CONSUMPTION_RESULT` remains
`AUTHORITY_CONSUMPTION_GAP` for productive integration only; this does not block
local execution or closure. Their `AVAILABILITY_EVIDENCE` is the conformant
DOM/REPO contract and audit record at the pinned basis, with no integrated
producer/runtime; their `BLOCKING_EFFECT` is integrated proof only. No fixture,
mock or repeated citation promotes `PRODUCTIVE_AVAILABILITY`.

`TEMPORAL_AUTHORITY_PROOF = NOT_APPLICABLE` because this ticket reads an
immutable local basis and commits no external effect. Any future
mutable-authority observation followed by an effect must provide the
independent second observation, drift detection, fail-closed behavior,
semantic owner and physical CAS/integrity role at its owning boundary.

`CALLER_AS_AUTHORITY_CHECK = PASS`; caller input cannot create `RepositoryId`,
replace a frozen `CatalogRevision`, supply the authoritative support set, or
substitute a producer-issued basis/result.

## 8. Aggregate / Consistency Boundaries

| Aggregate | Root | Invariants | Transaction / Consistency Boundary | External References |
| --- | --- | --- | --- | --- |
| Registry catalog basis | `REGISTRY_ENTRY` | Complete scoped key, entry completeness, exact supported versions, unique key, NORMAL/BOOTSTRAP isolation, bootstrap allowlist, immutable frozen basis | One register/resolve operation over an immutable `CatalogBasis`; failure publishes no new basis. Physical transaction/CAS is outside this ticket. | Opaque DOM `RepositoryId` for NORMAL; REPO source; schema/artifact/verdict/role references; system scope for BOOTSTRAP |

The domain computes a candidate next basis and exposes it only after all local
invariants pass. Existing basis values and caller inputs are never mutated.

## 9. Responsibility Decomposition

| Responsibility | Authority | State Owned | Expected Test Surface |
| --- | --- | --- | --- |
| Parse/compare semantic versions | EXEC-VERSION-001 / O-017 | Parsed version components | Syntax, canonical comparison and major/minor/patch tests |
| Resolve explicit support sets | EXEC-VERSION-002 / O-017 | Immutable set membership | Compatible and unsupported direct resolution; no alias/conversion |
| Validate complete registry entries | EXEC-REGISTRY-001 / O-020 | Mapping metadata and references | Complete/incomplete construction and schema-reference tests |
| Maintain immutable catalog basis | EXEC-REGISTRY-001/002 / O-020 | Scope, repository binding, entries and basis revision | Deterministic lookup, duplicate/conflict no-mutation and frozen-basis regression |
| Enforce catalog separation | EXEC-REGISTRY-002 / O-020 | NORMAL/BOOTSTRAP scope relation | Cross-scope and two-repository isolation |
| Enforce bootstrap allowlist | EXEC-REGISTRY-003 / O-020 | Allowed onboarding categories | Allowlisted positive and normal-capability negative before-work test |
| Classify resolution outcomes | EXEC-CAPABILITY-001 / O-020 | Canonical result and basis context | Unknown/incompatible distinction and fail-closed tests |
| Common capability registration | EXEC-CAPABILITY-002 / O-020 | New immutable basis value | Synthetic registration/resolution and frozen-basis preservation |
| Orchestrate sources and domain | Ticket PCPs; EXEC-IMP-02 | No domain state; request/result coordination | Application port calls, mapping and failure propagation |

`RESPONSIBILITY_MIXING_RISK = LOW`.

## 10. Proposed Components

| Component | Type | Responsibility | Existing/New | Expected Location | Size |
| --- | --- | --- | --- | --- | --- |
| `SemanticVersion` | VALUE_OBJECT | Parse, compare and expose semver components | New | `src/domain/exec-registry.ts` or cohesive adjacent domain module | SMALL |
| `SupportedVersionSet` | VALUE_OBJECT | Exact explicit support membership | New | Same domain module | SMALL |
| `CatalogScope` | VALUE_OBJECT | Represent NORMAL or BOOTSTRAP scope | New | Same domain module | SMALL |
| `RegistryEntry` | AGGREGATE_ROOT | Hold one complete immutable mapping and key | New | Same domain module | MEDIUM |
| `CatalogBasis` | OTHER immutable domain collection | Hold frozen scoped entries and basis reference | New | Same domain module | MEDIUM |
| `VersionCompatibilityPolicy` | DOMAIN_POLICY | Apply explicit support-set rules | New | Same domain module | SMALL |
| `BootstrapAllowlistPolicy` | DOMAIN_POLICY | Reject normal work in bootstrap | New | Same domain module | SMALL |
| `RegistryResolutionService` | DOMAIN_SERVICE | Coordinate lookup, scope, compatibility and outcomes | New | Same domain module | MEDIUM |
| `ResolveExecCapability` | APPLICATION_SERVICE | Load an authorized basis and invoke resolution | New | `src/application/exec-registry.ts` | SMALL |
| `RegisterExecCapability` | APPLICATION_SERVICE | Validate/register an entry through the common path | New | `src/application/exec-registry.ts` | SMALL |
| `ExecutionCatalogBasisReader` | PORT | Consume DOM execution-basis material | New | `src/application/exec-registry-ports.ts` | SMALL |
| `NormalCatalogSource` | PORT | Consume REPO NORMAL catalog material | New | `src/application/exec-registry-ports.ts` | SMALL |
| Registry composition root | OTHER | Wire use cases and approved ports | New | `src/composition/exec-registry.ts` | SMALL |
| TICKET-002 fixture | TEST_SUPPORT | Create controlled immutable local bases | New | `tests/exec-001-ticket-002.test.ts` | MEDIUM |

Component ownership map:

| Component | OWNS | COLLABORATES_WITH | MUST_NOT_OWN |
| --- | --- | --- | --- |
| `SemanticVersion` | Parsing, canonical components and comparison | `SupportedVersionSet`, registry-entry validation | Registry lookup, scope, schema, repository or lifecycle |
| `SupportedVersionSet` | Exact explicit membership | `SemanticVersion`, compatibility policy | Aliases, ranges, conversion or catalog persistence |
| `CatalogScope` | NORMAL/BOOTSTRAP scope representation | `CatalogBasis`, resolution service | Repository enablement, DOM identity creation or lifecycle |
| `RegistryEntry` | Complete entry data and scoped-key invariants | `SchemaReference`, `CatalogBasis`, resolver | Database/filesystem, transport, execution or physical reconstruction |
| `CatalogBasis` | Immutable entry collection and new-basis publication | `RegistryEntry`, policies, application use cases | Untrusted rehydration, physical recovery or historical overwrite |
| `VersionCompatibilityPolicy` | Support-set classification | `SemanticVersion`, `SupportedVersionSet`, resolver | Generic policy behavior or persistence |
| `BootstrapAllowlistPolicy` | Bootstrap capability allowlist decision | `CatalogScope`, resolver | Repository enablement, scheduler or normal execution |
| `RegistryResolutionService` | Complete-key lookup and canonical resolution outcomes | Basis, scope, both policies | Retry, persistence, transport mapping or DOM transitions |
| `ResolveExecCapability` | Resolution use-case orchestration | Source ports, resolver, result types | Domain invariants, retries or external effects |
| `RegisterExecCapability` | Registration use-case orchestration | Basis, entry validation, source/basis ports | Identity invention, persistence or category-specific bypass |
| `ExecutionCatalogBasisReader` | DOM execution-basis consumer seam | DOM ACL mapping and resolution use case | DOM identity/lifecycle authority or catalog semantics |
| `NormalCatalogSource` | REPO NORMAL-catalog consumer seam | REPO ACL mapping and resolution use case | Configuration/enablement authority or BOOTSTRAP semantics |
| Registry composition root | Wiring of approved implementations | Application services and adapters/fixtures | Business rules, infrastructure semantics or alternate authority |
| TICKET-002 fixture | Deterministic local contract evidence | Domain/application components under test | Productive availability, authority promotion or hidden behavior |

The following constraints govern the table: `SemanticVersion` owns parsing and
comparison only; `SupportedVersionSet` performs no aliasing, ranges or
conversion; `CatalogBasis` never mutates a frozen basis; policies are not
 generic utility buckets; application services do not duplicate domain rules;
and ports are narrow approved DOM/REPO boundaries. The fixture is never a
productive producer.

## 11. SOLID Assessment

| Component | SRP | OCP | LSP | ISP | DIP | Result |
| --- | --- | --- | --- | --- | --- | --- |
| `SemanticVersion` / `SupportedVersionSet` | PASS | PASS; explicit set is the known variation | NOT_APPLICABLE | NOT_APPLICABLE | PASS | PASS |
| `CatalogScope` / `RegistryEntry` | PASS; value/entry invariants only | PASS; data-driven entries, no subclasses | NOT_APPLICABLE | NOT_APPLICABLE | PASS | PASS |
| `CatalogBasis` / `RegistryResolutionService` | PASS; collection and decision responsibilities are separate | PASS; synthetic entries use the same data path | NOT_APPLICABLE | NOT_APPLICABLE | PASS | PASS |
| `VersionCompatibilityPolicy` | PASS | PASS; no hypothetical strategy | NOT_APPLICABLE | NOT_APPLICABLE | PASS | PASS |
| `BootstrapAllowlistPolicy` | PASS | PASS; allowlist data is the known variation | NOT_APPLICABLE | NOT_APPLICABLE | PASS | PASS |
| `ResolveExecCapability` / `RegisterExecCapability` | PASS; one use case each | PASS | NOT_APPLICABLE | NOT_APPLICABLE | PASS; narrow ports only | PASS |
| `ExecutionCatalogBasisReader` / `NormalCatalogSource` | PASS | PASS | NOT_APPLICABLE | PASS; cohesive source capabilities | PASS | PASS |

```text
SRP_VIOLATIONS = 0
OCP_VIOLATIONS = 0
LSP_VIOLATIONS = 0
ISP_VIOLATIONS = 0
DIP_VIOLATIONS = 0
UNJUSTIFIED_SOLID_VIOLATIONS = 0
```

No inheritance hierarchy, plugin framework, strategy registry or ceremonial
interface is justified.

## 12. Dependency Direction

```text
Domain: SemanticVersion, RegistryEntry, CatalogBasis, policies, resolution
  ↑ no infrastructure, transport, prototype or foreign SDK dependency
Application: Resolve/Register use cases and narrow source ports
  ↑ depends on domain contracts and approved ports
Composition: registry wiring and adapter selection
  ↑ future DOM/REPO/PLAT adapters and local fixtures
```

```text
DEPENDENCY_DIRECTION_VIOLATIONS = 0
INFRASTRUCTURE_LEAKAGE_POINTS = 0
```

Foreign concepts enter only through explicit application mapping; domain code
must not import `src/infrastructure`, `.pi`, `prototype`, filesystem, HTTP or
schema-engine implementation.

## 13. Invariant Placement

| Invariant | Domain Enforcement | Durable Protection | Application Guard | Test |
| --- | --- | --- | --- | --- |
| Semver has canonical form/components | `SemanticVersion` | NOT_APPLICABLE locally | Reject invalid input before resolution | Positive/negative semver |
| Only explicit supported versions resolve | `SupportedVersionSet` and compatibility policy | NOT_APPLICABLE locally | Invoke domain policy; no fallback | Supported/unsupported direct result |
| Entry is complete for deterministic mapping | `RegistryEntry.create` | TICKET-003/PLAT for persisted material | Validate request completeness | Complete/incomplete entry |
| Scoped key is unique and duplicate is fail-closed | `CatalogBasis.register` | Physical uniqueness/CAS integrated-only | Publish returned basis only on success | Duplicate/conflict no-mutation |
| NORMAL/BOOTSTRAP are independent | `CatalogScope`, basis and resolver | Integrated source isolation | Select only authorized basis/source | Cross-scope and two-repository isolation |
| Bootstrap allowlist precedes work | `BootstrapAllowlistPolicy` | REPO enablement remains foreign | Do not invoke work/enablement after rejection | Before-work callback negative test |
| Unknown differs from incompatible | Resolution service | NOT_APPLICABLE locally | Preserve result code | Distinct outcome assertions |
| Synthetic capability uses common path | Basis registration/resolution | Frozen-basis durability integrated-only | No category-specific branch | Synthetic common-path test |
| Existing frozen basis is unchanged | Immutable basis/new-value publication | PLAT physical immutability integrated-only | Retain old basis reference | Old-basis regression |

```text
UNPLACED_DOMAIN_INVARIANTS = 0
```

## 14. Persistence Design

- **Aggregate storage boundary:** no productive storage is implemented. Local
  closure uses immutable `CatalogBasis` values.
- **Port boundary:** source ports supply authorized material; they do not decide
  EXEC meaning. Semantic reconstruction and physical material are later scope.
- **Serialization:** `NOT_APPLICABLE` locally; no schema or serializer
  technology is selected. Existing `SchemaReference` remains the identity
  contract.
- **Revision/concurrency:** semantic version and `CatalogRevision` stay
  distinct. Local registration is create-only and immutable; physical CAS and
  concurrent producer behavior are integrated-only.
- **Atomicity:** register either returns a complete new basis or a failure while
  the old basis remains unchanged.
- **Registry/index:** an implementation index may be used only as a derived
  lookup optimization keyed by the complete scoped identity; it is not a
  second authority.
- **Integrity/recovery/archival:** `NOT_APPLICABLE` to this ticket; TICKET-003
  and PLAT own semantic reconstruction, physical integrity and recovery.

## 15. Lifecycle Design

No mutable lifecycle state machine is introduced. The applicable immutable
operations are:

```text
STATES = immutable catalog basis values, not a mutable lifecycle machine
INITIAL_STATE = complete immutable basis
ALLOWED_TRANSITIONS = register absent complete key → new basis; resolve frozen basis → result
REJECTED_TRANSITIONS = duplicate/conflict, unsupported version, wrong scope, disallowed bootstrap capability
MUTATION_AUTHORITY = CatalogBasis / RegistryEntry domain boundary
RECOVERY_TRANSITIONS = NOT_APPLICABLE; physical recovery is PLAT and semantic reconstruction is TICKET-003
TERMINAL_TRANSITIONS = a frozen basis is never edited or replaced in place
PERSISTENCE_GUARD = no physical persistence in TICKET-002
BYPASS_PATHS_FORBIDDEN = direct map mutation, caller authority, alias/conversion fallback, prototype or infrastructure registry
```

Semantic change requires a new semantic version and catalog basis. Enablement,
execution lifecycle, retry scheduling and retirement are outside this ticket.

## 16. Cross-Spec Integration

| Foreign Owner | Contract | Local Integration Point | ACL | Forbidden Local Ownership |
| --- | --- | --- | --- | --- |
| `SPEC-DOM-001` | `DOM-ID-001`, `DOM-SNAPSHOT-001`, `DOM-LIFE-001`; capability `DOM-EXEC-IDENTITY-SNAPSHOT` | `ExecutionCatalogBasisReader` consumes canonical `RepositoryId` and exact basis at the integrated seam | `DomCatalogBasisMapper` maps foreign references only | DOM identity, snapshot authority, lifecycle, transitions or approvals |
| `SPEC-REPO-001` | `REPO-EXEC-NORMAL-CATALOG`; enabled configuration supplies repository-scoped NORMAL material | `NormalCatalogSource` supplies material to EXEC resolution | `RepoNormalCatalogMapper` maps source material only | discovery, enablement, migration, legacy authority or configuration |
| `SPEC-PLAT-001` | physical persisted material, integrity, ordering and CAS | `NOT_APPLICABLE` in this ticket; reserved for TICKET-003/integrated proof | None | storage, journal, durability, recovery or CAS semantics |

The DOM row consumes `ACP-EXEC-02` / `PCP-DOM-EXEC-01`; the REPO row consumes
`ACP-EXEC-02` / `PCP-REPO-EXEC-01`. Both retain `DEFINED/DEFINED`, `NO/NO`,
`REQUIRED_FOR_INTEGRATED_PROOF`, integrated-only blocking effect, exact version
transport and fail-closed stale/detached behavior. Their proof issuer, scope,
identity/brand, consumer verification, stale policy and direct forged/caller
negative tests are the records in Section 7. No productive availability is
promoted.

For each external proof, the consumer-side verification record is also
mechanical: `ISSUER_IS_AUTHORIZED = YES`, `PROOF_SCOPE_IS_EXACT = YES`,
`CONSUMER_VERIFIES_PROVENANCE = YES`, `INPUT_OR_REFERENCE_BINDING = YES`,
`MUTATION_OR_STALE_REJECTION = YES`, `FORGERY_PATH_REJECTED = YES`,
`CALLER_INJECTION_REJECTED = YES`, and
`ALTERNATE_ADAPTER_CONTRACT = REQUIRED_DIRECT_WITNESS`. The TICKET-002 test
surface must include those forged/caller-injected, stale/mutated and alternate
adapter negative/compatibility witnesses; source inspection alone is not
accepted as proof.

## 17. Main Interaction Flow

1. `ResolveExecCapability` receives a structured request and an authorized
   basis selector; caller input cannot establish canonical basis material.
2. The integrated DOM/REPO port supplies exact scope/basis; local closure uses
   the immutable fixture.
3. Scope and repository binding are checked without creating or rewriting DOM
   identity.
4. `RegistryResolutionService` performs complete-key lookup, explicit support
   membership and bootstrap allowlist checks, then returns a complete entry or
   canonical failure.
5. `RegisterExecCapability` validates a complete schema-referenced entry and
   returns a new basis only when the complete key is absent.
6. The use case returns a structured result; no execution, enablement,
   persistence or external effect starts.

## 18. Failure / Recovery Flow

| Failure point | Detection | Durable evidence | Failure owner | Retry owner | Idempotency boundary | Recovery/reconciliation |
| --- | --- | --- | --- | --- | --- | --- |
| Malformed semver/incomplete entry | Value object/entry validation | Local structured failure; no durable claim | EXEC-001 | External operational owner | Complete entry construction | Correct input and submit a new valid basis |
| Unsupported version | Explicit set membership | `INCOMPATIBLE_CAPABILITY` with basis context | EXEC-001 | Operational policy; no silent conversion | Request plus frozen basis | Retry only with explicitly supported basis |
| Unknown capability | Complete scoped lookup miss | `UNKNOWN_CAPABILITY` | EXEC-001 | Operational policy | Request plus frozen basis | Explicit authorized registration; no fallback |
| Normal capability in BOOTSTRAP | Allowlist before work | `INCOMPATIBLE_CAPABILITY`; no callback | EXEC-001 | REPO/onboarding owner | Scope plus request | Use an allowlisted bootstrap capability |
| Duplicate/conflict | Complete-key uniqueness | `CONTRACT_INVALID`; prior basis unchanged | EXEC-001 | Operational owner/new semantic version | Scoped registration key | Physical CAS/recovery remains PLAT |
| Wrong scope/repository material | Scope/source binding | `CONTRACT_INVALID`; no local mutation | EXEC-001 semantics; source owner truth | Source owner | Scope/source attachment | Integrated source reconciliation |

There is no local external-effect recovery path. `TEMPORAL_AUTHORITY_PROOF =
NOT_APPLICABLE` and `CALLER_AS_AUTHORITY_CHECK = PASS` for this flow.

## 19. Clean Code Assessment

| Check | Result | Evidence |
| --- | --- | --- |
| Clear domain naming | PASS | Registry, basis, scope, capability and semver vocabulary. |
| Small cohesive methods | PASS | Parse, membership, policy, lookup and orchestration are separate. |
| Explicit side effects/mutation | PASS | Ports expose reads; new-basis publication is explicit; values are immutable. |
| No boolean explosion/long parameter lists | PASS | Named immutable request/entry/basis records; no mode flags. |
| No primitive obsession/magic values | PASS | Typed semver, scope, support set and revision concepts; named outcomes. |
| No generic util/service buckets | PASS | Every policy/service has one domain name and reason to change. |
| No duplicated rules | PASS | One home each for compatibility, allowlist, scope and outcome classification. |
| No deep nesting/comment-dependent correctness | PASS | Guard clauses and executable invariants, not prose. |
| No hidden temporal coupling/unnecessary mutability | PASS | Basis selection is explicit; frozen bases and stateless use cases. |

## 20. Test Design

Tests execute the normative verb and directly assert the semantic result. Local
fixtures prove only contract-level semantics; they cannot prove productive DOM or
REPO availability, physical persistence, restart recovery, CAS or effects.

| Behavior / Invariant | Test Type | Target | Expected Proof |
| --- | --- | --- | --- |
| AC-EXEC-003 semver major/minor/patch meaning | UNIT / DOMAIN_INVARIANT | `SemanticVersion`, compatibility policy | Explicit compatible versions preserve components; unsupported major is rejected. |
| AC-EXEC-004 explicit support set | NEGATIVE_BEHAVIOR | `SupportedVersionSet.resolve` | Direct unsupported request returns `INCOMPATIBLE_CAPABILITY`, with no alias/conversion. |
| AC-EXEC-008 complete deterministic mapping | DOMAIN_INVARIANT / local contract | basis/resolution service | Direct resolve returns the complete registered mapping for the frozen basis. |
| Duplicate/conflict/incomplete registration | NEGATIVE_BEHAVIOR / IDEMPOTENCY | `CatalogBasis.register` | `CONTRACT_INVALID`; prior basis and entries remain unchanged. |
| AC-EXEC-009 NORMAL/BOOTSTRAP isolation | CROSS_SPEC / local contract | two scoped bases and resolver | Each basis resolves only its own entry; cross-scope/repository substitution fails. |
| AC-EXEC-010 bootstrap allowlist | STATE_TRANSITION / NEGATIVE_BEHAVIOR | resolver plus allowlist | Allowlisted onboarding resolves; normal request returns incompatible and invokes no work callback. |
| AC-EXEC-011 unknown/incompatible distinction | NEGATIVE_BEHAVIOR | resolution service | Missing key returns `UNKNOWN_CAPABILITY`; known unsupported key returns `INCOMPATIBLE_CAPABILITY`. |
| AC-EXEC-012 common extensibility | DOMAIN_INVARIANT / local contract | register then resolve synthetic entry | Synthetic schema-referenced entry uses the same path and cannot mutate old basis. |
| Contributor AC-EXEC-005 frozen-basis preservation | COMPATIBILITY / IDEMPOTENCY | old and returned new bases | Old basis remains unchanged; complete DOM snapshot proof remains TICKET-005-owned. |
| Contributor AC-EXEC-007 failure classification | CROSS_SPEC / NEGATIVE_BEHAVIOR | incompatible resolution result | Registry supplies incompatible classification without approval; full verdict-failure proof remains TICKET-004-owned. |
| First productive registry architecture guard | ARCHITECTURE_CONFORMANCE | import/source guard in ticket test | Domain has no prototype/`.pi`/infrastructure/transport imports; one common path serves synthetic and existing entries. |

### Lifecycle, atomicity and concurrency declarations

```text
STATE_SET = immutable catalog basis values, not a mutable lifecycle machine
INITIAL_STATE = complete frozen basis
ALLOWED_TRANSITIONS = register absent key → new basis; resolve frozen basis → result
REJECTED_TRANSITIONS = duplicate/conflict, unsupported, wrong scope, disallowed bootstrap capability
MUTATION_AUTHORITY = CatalogBasis
REPOSITORY_CONTRACT = NOT_APPLICABLE locally; PLAT/TICKET-003 integration
ISOLATION_INVARIANT = every result retains complete scope and frozen basis
STATE_TRANSITION_TEST = direct register/resolve and rejection tests
CONCURRENCY_CONTRACT = deterministic local create-only semantics; physical CAS is integrated-only
ONE_WINNER_EXPECTATION = NOT_APPLICABLE locally; integrated producer owns physical winner
DUPLICATE_STATE_EXPECTATION = duplicate returns CONTRACT_INVALID and leaves original basis unchanged
DETERMINISTIC_INTERLEAVING_OR_ADAPTER_TEST = deterministic duplicate/no-mutation test; no physical interleaving claim
```

### ACCEPTANCE_WITNESS_MATRIX

| Normative behavior | Normative verb | Concrete operation / command | State or transition affected | Direct positive test | Direct negative or isolation test | Expected evidence file | Acceptance owner | Required producer/capability | Authority status | Contract status | Local testability | Productive availability | Dependency class | Witness executable at local closure | Evidence type |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| AC-EXEC-003 semver meaning | classify/resolve | C-EXEC-003/004 via resolver | Registry basis | Compatible explicit minor/patch resolves with preserved components | Unsupported major/version returns incompatible without conversion | `docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/AC-EXEC-003-semver.md` | TICKET-002 | UNIT-EXEC-REGISTRY-FIXTURE | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |
| AC-EXEC-004 support set | reject | Resolution against explicit set | Registry basis | Supported version resolves | Unsupported version returns `INCOMPATIBLE_CAPABILITY` | Same as AC-EXEC-003 | TICKET-002 | UNIT-EXEC-REGISTRY-FIXTURE | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |
| AC-EXEC-008 deterministic mapping | resolve | C-EXEC-004/008 | Entry/basis selection | Complete entry returns all mapping data | Duplicate/conflict/incomplete entry returns `CONTRACT_INVALID`, no mutation | `docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/AC-EXEC-008-deterministic-resolution.md` | TICKET-002 | UNIT-EXEC-REGISTRY-FIXTURE | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |
| AC-EXEC-009 catalog isolation | isolate/resolve | C-EXEC-005/009 | NORMAL/BOOTSTRAP bases | Independent bases resolve own entries | Cross-scope/cross-repository substitution fails and neither basis changes | `docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/AC-EXEC-009-catalog-isolation.md` | TICKET-002 | UNIT-EXEC-REGISTRY-FIXTURE | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |
| AC-EXEC-010 bootstrap allowlist | reject/resolve | C-EXEC-005/010/011 | Bootstrap request before work | Allowlisted onboarding resolves | Normal capability returns incompatible and no work callback occurs | `docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/AC-EXEC-010-bootstrap-allowlist.md` | TICKET-002 | UNIT-EXEC-REGISTRY-FIXTURE | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |
| AC-EXEC-011 outcome distinction | resolve/reject | C-EXEC-010/011 | Resolution result | Known compatible entry resolves | Unknown returns `UNKNOWN_CAPABILITY`; known incompatible returns `INCOMPATIBLE_CAPABILITY` | `docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/AC-EXEC-011-failure-distinction.md` | TICKET-002 | UNIT-EXEC-REGISTRY-FIXTURE | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |
| AC-EXEC-012 registry extensibility | register/resolve | C-EXEC-006/012 | Capability basis | Synthetic schema-valid entry resolves through common path | Category-specific bypass/frozen-basis mutation is rejected or absent | `docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/AC-EXEC-012-registry-extensibility.md` | TICKET-002 | UNIT-EXEC-REGISTRY-FIXTURE | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |
| Contributor AC-EXEC-005 frozen basis | register/resolve | Register new entry, resolve old basis | Existing frozen basis | New basis contains new entry and old basis remains unchanged | In-place mutation/cross-basis substitution fails | `docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/AC-EXEC-005-registry-contribution.md` | TICKET-002 contributor; TICKET-005 final proof owner | UNIT-EXEC-REGISTRY-FIXTURE | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_CONTRIBUTION_EVIDENCE |
| Contributor AC-EXEC-007 failure classification | classify/reject | Known incompatible resolution | Resolution result | Registry supplies incompatible classification | Unknown/incompatible cannot become approval or fallback | `docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/AC-EXEC-007-registry-contribution.md` | TICKET-002 contributor; TICKET-004 final proof owner | UNIT-EXEC-REGISTRY-FIXTURE | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_CONTRIBUTION_EVIDENCE |

```text
ACCEPTANCE_WITNESS_MATRIX = COMPLETE
ACCEPTANCE_WITNESS_MATRIX_ROWS = 9
DIRECT_BEHAVIOR_WITNESSES = 9
PROXY_ONLY_BEHAVIORS = 0
UNTESTED_STATE_TRANSITIONS = 0
UNPROVEN_CONCURRENCY_CONTRACTS = 0
MISSING_ARCHITECTURE_GUARDS = 0
DESIGN_TEST_COVERAGE_GATE: PASS
```

## 21. Structural Risk Assessment

| Risk | Level | Mitigation |
| --- | --- | --- |
| GOD_COMPONENT_RISK | LOW | Keep value objects, policies, basis and use cases cohesive and separate. |
| OVERSIZED_FILE_RISK | LOW | One cohesive module is acceptable initially; split only on a real responsibility boundary. |
| RESPONSIBILITY_MIXING_RISK | LOW | Domain, orchestration, persistence and mapping are separate. |
| EXCESSIVE_DEPENDENCY_RISK | MEDIUM | Use only two narrow foreign ports and immutable records; no generic container. |
| DUPLICATION_RISK | MEDIUM | One semver parser, support policy, allowlist and outcome classifier; add duplicate-path regression tests. |
| CROSS_SPEC_LEAKAGE_RISK | MEDIUM | Preserve opaque DOM/REPO references and import guards; no foreign lifecycle/configuration logic. |
| ARCHITECTURE_DRIFT_RISK | MEDIUM | Composition only wires approved seams; no storage framework or alternate authority. |
| FAT_INTERFACE_RISK | MEDIUM | Keep DOM basis and REPO catalog ports independent and consumer-shaped. |
| PRIMITIVE_OBSESSION_RISK | MEDIUM | Use typed semver, scope, support set and revision; keep foreign `RepositoryId` opaque. |
| DOMAIN_RULE_DUPLICATION_RISK | MEDIUM | Centralize scope, bootstrap, support-set and result rules and test direct paths. |
| ANEMIC_DOMAIN_MODEL_RISK | LOW | Entry/basis/policies enforce the actual domain rules. |
| FAT_APPLICATION_SERVICE_RISK | LOW | Separate resolve/register use cases delegate decisions to domain. |
| DEPENDENCY_INVERSION_RISK | LOW | Domain has no infrastructure dependency; application uses approved ports. |
| INFRASTRUCTURE_LEAKAGE_RISK | LOW | No database, filesystem, HTTP, schema-engine or transport type enters domain. |
| PREMATURE_ABSTRACTION_RISK | LOW | Ports exist only for approved DOM/REPO boundaries; no hypothetical plugins. |
| OVERENGINEERING_RISK | LOW | Small immutable model; no event bus, factory hierarchy or generic framework. |

```text
GOD_COMPONENT_RISK = LOW
OVERSIZED_FILE_RISK = LOW
RESPONSIBILITY_MIXING_RISK = LOW
EXCESSIVE_DEPENDENCY_RISK = MEDIUM
DUPLICATION_RISK = MEDIUM
TESTABILITY_RISK = LOW
CROSS_SPEC_LEAKAGE_RISK = MEDIUM
ARCHITECTURE_DRIFT_RISK = MEDIUM
ANEMIC_DOMAIN_MODEL_RISK = LOW
FAT_APPLICATION_SERVICE_RISK = LOW
FAT_INTERFACE_RISK = MEDIUM
PRIMITIVE_OBSESSION_RISK = MEDIUM
DEPENDENCY_INVERSION_RISK = LOW
INFRASTRUCTURE_LEAKAGE_RISK = LOW
DOMAIN_RULE_DUPLICATION_RISK = MEDIUM
PREMATURE_ABSTRACTION_RISK = LOW
OVERENGINEERING_RISK = LOW
HIGH_STRUCTURAL_RISKS = 0
HIGH_DDD_RISKS = 0
HIGH_SOLID_RISKS = 0
HIGH_CLEAN_CODE_RISKS = 0
```

## 22. Implementation Sequence

1. Define/reuse domain value contracts for semver, explicit support sets,
   scope and opaque basis references. Immediately test syntax, comparison and
   exact membership.
2. Define immutable complete entries and catalog bases. Immediately test
   completeness, unique scoped keys, duplicate/conflict rejection and
   no-mutation of the prior basis.
3. Add compatibility and bootstrap policies plus canonical resolution results.
   Immediately test unknown/incompatible distinction and before-work bootstrap
   rejection.
4. Implement common registry resolution and registration for existing and
   synthetic capabilities. Immediately test deterministic mapping, isolation
   and frozen-basis preservation.
5. Add narrow application ports/use cases for authorized DOM/REPO sources.
   Immediately test orchestration, provenance checks and no work after a
   bootstrap rejection using local fixtures.
6. Add composition wiring without selecting storage, transport or adapter
   technology. Immediately run dependency/import architecture checks.
7. Produce the ticket evidence files only after direct tests execute; each must
   contain canonical assertions, no-mutation evidence and output.
8. Run TICKET-001 regression plus architecture/conformance checks and verify
   that no integrated-only capability is represented as productive.

Each step has an immediate local test surface. No step implements DOM, REPO,
PLAT, snapshot convergence, persistence, recovery, transport or another phase.

## 23. Files Expected to Change

| Path / Area | Classification | Reason |
| --- | --- | --- |
| `src/domain/exec-registry.ts` or one cohesive adjacent domain module | EXPECTED_CREATE | Semver, support set, scope, entries, immutable bases, policies and outcomes. |
| `src/application/exec-registry.ts` | EXPECTED_CREATE | Resolve/register orchestration and failure propagation. |
| `src/application/exec-registry-ports.ts` | EXPECTED_CREATE | Narrow DOM basis and REPO NORMAL source seams. |
| `src/composition/exec-registry.ts` | EXPECTED_CREATE | Composition-root wiring. |
| `tests/exec-001-ticket-002.test.ts` | EXPECTED_CREATE | Direct positive, negative, isolation, no-mutation and architecture witnesses. |
| `docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/*` | EXPECTED_CREATE during implementation completion | Ticket-local evidence named by the frozen ticket; not created by this design. |
| `src/domain/exec-contract.ts` | POSSIBLE_MODIFY | Only a narrow shared export if reuse requires it; no registry policy. |
| `src/domain/exec-schema.ts` | POSSIBLE_MODIFY | Only a shared type export if required; no schema authority change. |
| `src/application/snapshot.ts` | MUST_NOT_MODIFY | TICKET-005 owns the caller-basis contradiction. |
| `src/infrastructure/exec-schema-validator.ts` | MUST_NOT_MODIFY | Schema adapter is not registry authority. |
| `src/application/exec-contract.ts`, `src/composition/exec-contract.ts` | MUST_NOT_MODIFY | TICKET-001/TICKET-004 boundaries. |
| DOM modules, `.pi/*`, `prototype/*`, ADRs, portfolio, SPECs, Gap Matrix, Plan, ticket index and other tickets | MUST_NOT_MODIFY | Outside frozen scope and design write authority. |

This is implementation guidance, not a production whitelist or permission to
modify upstream artifacts.

## 24. Open Questions / Blockers

```text
NONE
```

Schema technology, physical catalog storage, adapter protocol and future
productive DOM/REPO availability are intentionally unfrozen or integrated-proof
concerns. No authority, ownership, lifecycle, persistence, reconstruction,
failure or local-closure blocker remains.

## 25. Design Metrics

```text
RESPONSIBILITIES = 9
DOMAIN_CONCEPTS = 9
AGGREGATE_ROOTS = 1
ENTITIES = 1
VALUE_OBJECTS = 4
DOMAIN_SERVICES = 1
DOMAIN_POLICIES = 2
APPLICATION_SERVICES = 2
PORTS = 2
ADAPTERS = 0 local; 2 future integrated mappings identified
ANTI_CORRUPTION_LAYERS = 2 identified (DOM and REPO mappings)
PROPOSED_COMPONENTS = 14
CRITICAL_INVARIANTS = 9
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
AUTHORITY_CONSUMPTION_PROOFS = 1 ticket-level proof (ACP-EXEC-02; DOM and REPO records)
PRODUCER_CONSUMER_CONTRACT_PROOFS = 3 (DOM, REPO and local fixture)
TEMPORAL_AUTHORITY_PROOFS = 0
TEMPORAL_AUTHORITY_GAPS = 0
CALLER_SUPPLIED_AUTHORITY_BYPASS = 0
ACCEPTANCE_WITNESS_MATRIX_ROWS = 9
DIRECT_BEHAVIOR_WITNESSES = 9
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

The bounded design preserves ticket scope, accepted ownership, authority
proofs, dependency classes, local closure, repository conventions and the
approved implementation ordering. It authorizes no production code or test
implementation; those belong to the separate implementation workflow.
