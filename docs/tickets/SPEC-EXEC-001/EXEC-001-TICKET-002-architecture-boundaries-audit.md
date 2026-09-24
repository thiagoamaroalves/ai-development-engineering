# Architecture Boundaries Specialist Audit

## Audit identity

```text
AUDIT_SKILL = audit-architecture-boundaries
SPECIALIST = ARCHITECTURE_BOUNDARIES
AUDIT_MODE = READ_ONLY INDEPENDENT ADVERSARIAL ARCHITECTURE_FIRST
OWNERSHIP_PRESERVING = YES
AUTHORITY_PRESERVING = YES
CROSS_SPEC_AWARE = YES
IDENTITY_AWARE = YES
LEGACY_TRANSITION_AWARE = YES
TARGET_WORKTREE = CLEAN
TARGET_HEAD_VERIFIED = YES
WORKING_TREE_OVERLAY = NONE
```

| Field | Value |
|---|---|
| Ticket | `EXEC-001-TICKET-002` |
| Ticket path | `docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-version-registry-catalogs-capabilities.md` |
| Implementation unit | `EXEC-IMP-02 — Version, registry resolution, catalogs and capability extensibility` |
| Approved design | `docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-implementation-design.md` |
| Ticket-set audit | `docs/tickets/SPEC-EXEC-001/implementation-ticket-audit.md` |
| Component SPEC | `docs/specs/SPEC-EXEC-001-skill-contracts-and-capability-registry.md`, revision 3 |
| Primary ADR | `docs/adrs/ADR-0003-versioned-skill-contracts.md`, accepted revision 3 |
| Portfolio authority | `docs/specs/SPEC-PORTFOLIO-001-organization.md` (`O-017`, `O-020`) |
| Gap Matrix | `docs/specs/gap-matrices/SPEC-EXEC-001-implementation-gap-matrix.md` (`GAP-004`, `GAP-006`, `GAP-008` through `GAP-011`) |
| Implementation Plan | `docs/specs/implementation-plans/SPEC-EXEC-001-implementation-plan.md` (`EXEC-IMP-02`) |
| Implementation baseline | `8f62b283b1dbf487911c7c459db95cadc25ff101` as recorded by the ticket execution record |
| Current HEAD | `49b4448ba10ee9aa9d3ce7d47b139de474a482ba` |
| Audit target HEAD | `49b4448ba10ee9aa9d3ce7d47b139de474a482ba` |
| Audit target state fingerprint | `7983511cf1e9833261f61e43cdb252de0ed59fb330fcef75d6c03755f24f9a4d` |
| Ticket status at target | `VALIDATION_REQUIRED` |
| Implementation status | `IMPLEMENTED; independent audit required` |
| Audit wave | `ad04b7aa-49bd-4936-953d-b2f673ece285` |

The target HEAD equals the requested HEAD. `git status --short --branch` was
clean before this artifact was written, and the semantic implementation/test
paths were unchanged at audit time. The supplied state fingerprint is retained
as the exact audit identity; no working-tree overlay was used.

## Changed implementation and evidence surface

The implementation subject at the pinned target consists of:

```text
src/domain/exec-contract.ts
src/domain/exec-registry.ts
src/application/exec-registry-ports.ts
src/application/exec-registry.ts
src/composition/exec-registry.ts
tests/exec-001-ticket-002.test.ts
tests/exec-registry-import-boundary-loader.mjs
tests/fixtures/exec-registry-forbidden-import.mjs
docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/AC-EXEC-003-semver.md
docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/AC-EXEC-005-registry-contribution.md
docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/AC-EXEC-007-registry-contribution.md
docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/AC-EXEC-008-deterministic-resolution.md
docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/AC-EXEC-009-catalog-isolation.md
docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/AC-EXEC-010-bootstrap-allowlist.md
docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/AC-EXEC-011-failure-distinction.md
docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/AC-EXEC-012-registry-extensibility.md
```

The checkpoint/audit documents changed by the pinned checkpoint are workflow
artifacts and are not treated as production architecture. No sibling specialist
artifact was used as evidence for this audit.

## Source precedence and reconstructed architectural contract

Authority was applied in this order:

```text
Accepted ADR
↓
Canonical SPEC
↓
Explicit cross-SPEC ownership contracts
↓
Validated Gap Matrix
↓
Implementation Plan
↓
Ticket and approved Design
↓
Repository implementation and tests
```

### Reconstructed contract

| Contract element | Reconstructed authority and result |
|---|---|
| `LOCAL_OWNER` | `SPEC-EXEC-001` / `EXEC-001` owns semantic-version meaning, explicit supported-set resolution, deterministic registry mapping, catalog scope separation, bootstrap allowlist, canonical unknown/incompatible outcomes, and common registry extensibility. `SPEC-EXEC-001` §13 (`EXEC-VERSION-001/002`, `EXEC-REGISTRY-001/002/003`, `EXEC-CAPABILITY-001/002`); Plan `EXEC-IMP-02`. |
| `LOCAL_AUTHORITIES` | `SemanticVersion`, `SupportedVersionSet`, `CatalogScope`, `RegistryEntry`, immutable `CatalogBasis`, compatibility/allowlist policies, `RegistryResolutionService`, and the application orchestration boundary are local EXEC semantics. |
| `FOREIGN_OWNERS` | DOM owns canonical `RepositoryId`, execution identity/snapshot basis and lifecycle (`DOM-ID-001`, `DOM-SNAPSHOT-001`, `DOM-LIFE-001`). REPO owns enabled NORMAL configuration and legacy adaptation. PLAT owns physical persistence, durability, integrity, ordering, CAS and recovery. |
| `FOREIGN_CAPABILITIES_CONSUMED` | `DOM-EXEC-IDENTITY-SNAPSHOT` and `REPO-EXEC-NORMAL-CATALOG`, both explicitly `REQUIRED_FOR_INTEGRATED_PROOF`, authority/contract `DEFINED/DEFINED`, local/productive `NO/NO`. They are not local-closure blockers. |
| `CANONICAL_IDENTITIES` | NORMAL registry entry: `(CatalogScope=NORMAL, RepositoryId, SkillContractId, CapabilityId, SchemaId, SemanticVersion)`. BOOTSTRAP entry: `(CatalogScope=BOOTSTRAP, SkillContractId, CapabilityId, SchemaId, SemanticVersion)`. `CatalogRevision` identifies a frozen catalog basis and is distinct from semantic version. SPEC §12.1/§12.3 and `EXEC-REGISTRY-004`. |
| `IMMUTABILITY_RULES` | Register only an absent complete key. Duplicate/conflicting registration fails closed without mutation. A new registration returns a new basis; an existing frozen basis is not edited. Semantic change requires a new semantic version and basis. ADR-0003; SPEC §12.1, `EXEC-REGISTRY-004`, `EXEC-CAPABILITY-002`. |
| `LINEAGE_RULES` | Catalog revisions must remain scoped and continuous when material is persisted/reconstructed. Physical persistence and semantic reconstruction are outside this ticket and belong to `EXEC-IMP-03`/PLAT; the local implementation only creates immutable in-process successor bases. |
| `LEGACY_AUTHORITY_RULES` | REPO remains the legacy-compatibility/configuration owner. Legacy material may be adapted into the canonical path but cannot become a second registry or semantic authority. SPEC §17 and Portfolio compatibility matrix. |
| `CUTOVER_RULES` | A changed basis/version is a new basis for new resolutions. Existing snapshots/manifests are not rewritten. No destructive retirement of a foreign owner is authorized here. |
| `MIGRATION_AUTHORITY` | Bootstrap may execute only discovery, validation, migration, audit and remediation categories; migration/enablement lifecycle remains foreign. `EXEC-REGISTRY-003`, ADR-0003. |
| `SECURITY_BOUNDARIES` | SPEC §20 assigns authentication/transport/session authorization to BACKEND and domain lifecycle authorization to DOM. This ticket has no session, authorization route, secret, or external-effect boundary; provenance/anti-forgery is nevertheless an architecture boundary and is audited below. |
| `DOES_NOT_IMPLEMENT` | DOM identity/lifecycle; REPO enablement/configuration and legacy migration; session/scheduler/dispatch; physical persistence/recovery/effects; transport/UI/OPS mappings; registry reconstruction and durable continuity. Ticket §§10, 15 and Design §§4, 14–18. |

### Authority consumption proof

The ticket's `ACP-EXEC-02` is normatively defined but not productively
consumable at this target. This is distinguished from local fixture
contract-testability.

| Capability | Authority / semantic owner | Intended producer | Consumer and contract | Returned authority | Failure/stale semantics | Authority / contract | Local / productive | Class and result |
|---|---|---|---|---|---|---|---|---|
| `DOM-EXEC-IDENTITY-SNAPSHOT` | `SPEC-DOM-001` / DOM canonical resolver | DOM resolver | `ExecutionCatalogBasisReader.read()` consumed by EXEC resolution | canonical NORMAL `RepositoryId`, execution/catalog basis and exact `CatalogRevision` | wrong scope, detached/untrusted receipt, stale revision or mutation fails `CONTRACT_INVALID` without mutation | `DEFINED / DEFINED` | `NO / NO` | `REQUIRED_FOR_INTEGRATED_PROOF`; `AUTHORITY_CONSUMPTION_GAP` for integrated use only |
| `REPO-EXEC-NORMAL-CATALOG` | `SPEC-REPO-001` / enabled repository configuration | REPO configuration | `NormalCatalogSource.read()` consumed by EXEC resolution/registration | repository-scoped NORMAL catalog material bound to the DOM basis and revision | wrong source, scope, repository, detached/copy receipt or stale basis fails `CONTRACT_INVALID` | `DEFINED / DEFINED` | `NO / NO` | `REQUIRED_FOR_INTEGRATED_PROOF`; `AUTHORITY_CONSUMPTION_GAP` for integrated use only |
| `UNIT-EXEC-REGISTRY-FIXTURE` | EXEC test support only | local fixture helper | direct domain tests | local immutable basis and result shape, never productive authority | fixture result is unbranded and rejected at application authority seam | `DEFINED / DEFINED` | `YES / NO` | `INFORMATIONAL`; `CONTRACT_TESTABLE_LOCALLY`, not consumable authority |

The two external capabilities are not counted as local blockers because the
validated Plan/Ticket dependency class is `REQUIRED_FOR_INTEGRATED_PROOF`.
The code does, however, introduce a material seam problem: the intended
productive issuer cannot issue a receipt accepted by the consumer. That issue
is `ARCH-MAJOR-001` below.

### Authority provenance proof record

| Proof field | DOM and REPO source seam at target |
|---|---|
| `PROOF_ISSUER_OWNER` | Intended issuers are the canonical DOM resolver and REPO enabled configuration; the only actual issuer helper in the repository is EXEC test support. |
| `PROOF_SCOPE` | Exact DOM execution/snapshot basis for the requested NORMAL repository, or exact system BOOTSTRAP catalog; scope and frozen `CatalogRevision` must match. |
| `PROOF_IDENTITY_OR_BRAND` | A private `ISSUED_RECEIPTS` `WeakMap` binds a receipt to a source object, and private domain `WeakSet`s brand bases/results. No productive issuer can access the receipt issuance operation. |
| `CONSUMER_VERIFICATION_RULE` | `ResolveExecCapability.assertAuthorizedBasis` verifies source/receipt binding, source kind, authenticated basis, exact scope, exact revision and expected source string; `RegistryResolutionService.resolve` additionally requires a producer-bound basis proof and binds the result to the request. |
| `STALE_OR_MUTATION_POLICY` | Stale/unexpected revisions and source/scope mismatch fail `CONTRACT_INVALID`; bases and failure paths do not mutate. |
| `FORGERY_NEGATIVE_TEST` | Direct source forgery, copied receipt, wrong source and DOM/bootstrap substitution are exercised in `tests/exec-001-ticket-002.test.ts:406-450`, with unavailable/untrusted/wrong-source cases at `555-577`. |
| `CALLER_INJECTION_NEGATIVE_TEST` | Direct basis injection, forged scope/schema and caller repository/support-set authority are tested at `384-404` and `452-469`. |
| `ALTERNATE_ADAPTER_CONTRACT_TEST` | Not proven for a productive alternate adapter. The only positive receipt issuer is a local fixture helper, which is deliberately rejected by the productive application boundary. |
| `PROVENANCE_RESULT` | Local negative witnesses pass; productive cross-SPEC consumption remains unproven and, due the missing productive issuance operation, is not currently consumable. |

### Producer/consumer contract proof

The application consumer exists (`ResolveExecCapability`), and the intended
producer identities are normatively specified, but the repository contains no
productive producer implementation and no public owner-bound receipt issuance
contract. This is not silently promoted from a fixture. The contract is
therefore `INTEGRATION_NOT_PROVEN` at the target while local behavior remains
contract-testable.

## Applicability matrix

| Dimension | Classification | Evidence and reason |
|---|---|---|
| `OWNERSHIP` | `REQUIRED` | Production behavior adds the first EXEC registry owner and consumes DOM/REPO authorities. |
| `CANONICAL_AUTHORITY` | `REQUIRED` | Registry resolution, basis selection, registration and canonical outcomes are changed. |
| `CROSS_SPEC_INTEGRATION` | `AFFECTED` | DOM and REPO source ports are introduced, but integrated producer availability is explicitly deferred. |
| `IDENTITY` | `REQUIRED` | NORMAL identity includes DOM-owned `RepositoryId`; registry entry identity and source binding are central behavior. |
| `IMMUTABILITY` | `REQUIRED` | New bases must preserve frozen historical bases and no-mutation-on-failure. |
| `LINEAGE` | `AFFECTED` | `CatalogRevision` successor behavior is implemented locally; durable continuity/reconstruction is expressly deferred to T003/PLAT. |
| `LEGACY_TRANSITION` | `AFFECTED` | Ticket declares `NEW_CANONICAL_PATH`, `CUTOVER` and REPO-owned `LEGACY_COMPATIBILITY`. |
| `DESTRUCTIVE_TRANSITION` | `NOT_APPLICABLE` | No delete, overwrite, retirement or irreversible cutover operation is introduced; registration publishes an immutable successor candidate. |
| `MIGRATION_AUTHORITY` | `NOT_APPLICABLE` | Bootstrap category data includes `MIGRATION`, but this implementation does not perform migration or enablement; REPO remains migration/configuration owner. |
| `SECURITY_AUTHORIZATION` | `NOT_APPLICABLE` | SPEC §20 assigns authentication/session and domain authorization elsewhere; no route, session, secret, permission or external effect is introduced. Provenance is audited separately as canonical authority. |

All required/affected dimensions were audited. The integrated-only unavailable
producers are recorded as evidence gaps, not used to block local domain
completion; therefore `DOMAIN_AUDIT_COMPLETE = YES`.

## Ownership and canonical authority audit

### Ownership result

```text
OWNERSHIP_RESULT = OWNERSHIP_PRESERVED
FOREIGN_CAPABILITY_DUPLICATION = 0
FOREIGN_LIFECYCLE_OWNERSHIP = 0
```

The implementation keeps semver, support sets, entry completeness, scoped
lookup, bootstrap allowlist and canonical capability outcomes in EXEC domain
code. It does not create DOM lifecycle/identity transitions, REPO enablement
state, PLAT durability/CAS/recovery, session state, effect state, or consumer
mapping logic. The two foreign source ports are consumer-shaped and the
application checks their source kind, scope and revision rather than deriving
foreign behavior locally.

A qualification is required for registration: the application returns an
apparently registered successor from a read-only source, without a producer
publication receipt or result proof. That is reported as `ARCH-MAJOR-002`, not
classified as foreign lifecycle ownership because no REPO or DOM lifecycle is
implemented locally.

### Canonical authority result

```text
RESOLUTION_AUTHORITY = AUTHORITY_PRESERVED for producer-bound resolution
REGISTRATION_RESULT_AUTHORITY = ALTERNATE_AUTHORITY_PATH / UNPROVEN
DUAL_AUTHORITY = NOT_ESTABLISHED in the local fixture path
ALTERNATE_AUTHORITY_INTRODUCED = YES for the unbranded registration result path
PROJECTION_USED_AS_AUTHORITY = NO
REPOSITORY_SEMANTIC_AUTHORITY = NO
```

Positive authority controls are substantial for resolution:

* `RegistryResolutionService.resolve` requires a private producer-bound proof;
  fixture resolution is explicitly separate and unbranded.
* `isRegistryResolutionBoundToRequest` checks result identity, exact basis and
  request binding.
* `ResolveExecCapability` refuses caller-supplied basis material and rejects
  fixture, copied, wrong-source, stale or forged source material.
* The domain uses private instance brands for scopes, revisions, entries,
  bases, resolver instances and canonical resolution results.

The registration path does not provide the equivalent proof. `RegistryRegistrationResult`
is a plain structural interface and `RegisterExecCapability` returns a frozen
object without an issuer/registrar brand, entry-to-successor binding, or
published-basis evidence. This is the authority defect described in
`ARCH-MAJOR-002`.

## Identity, immutability and lineage audit

### Aggregate identity proof

```text
AGGREGATE_ROOT = REGISTRY_ENTRY
CANONICAL_IDENTITY =
  NORMAL: (CatalogScope=NORMAL, RepositoryId, SkillContractId, CapabilityId, SchemaId, SemanticVersion)
  BOOTSTRAP: (CatalogScope=BOOTSTRAP, SkillContractId, CapabilityId, SchemaId, SemanticVersion)
IDENTITY_AUTHORITY_SOURCE = EXEC-001 registry; NORMAL RepositoryId is DOM-owned
IDENTITY_KIND_OR_TYPE = REGISTRY_ENTRY
IDENTITY_SCOPE = NORMAL repository scope or independent BOOTSTRAP system scope
STABLE_CORRELATION_FIELDS = stage, capability, skill contract, schema, catalog revision; correlation is not identity
CREATION_RULE = complete absent key only; duplicate/conflict rejects without mutation
COMMAND_REPRESENTATION = RegisterExecCapability / domain CatalogBasis.register
REPOSITORY_LOOKUP_REPRESENTATION = complete scoped key plus requested frozen CatalogRevision
PERSISTED_REPRESENTATION = deferred to T003/PLAT; no persisted material is accepted by T002
REHYDRATED_REPRESENTATION = deferred to T003/PLAT; no rehydration path in changed code
EQUALITY_AND_CONTINUITY_SEMANTICS = same scoped key/version is one immutable entry; a new basis is a successor
REVISION_RELATIONSHIP = SemanticVersion is entry contract revision; CatalogRevision is basis revision
ALIASES_LOCAL_IDS_DERIVED_IDS = labels, paths, category, digest and correlation cannot replace identity
ALIAS_AUTHORITY_AND_FORBIDDEN_SUBSTITUTIONS = caller, fixture, detached source or another repository cannot replace the complete key
PROOF_EVIDENCE = SPEC §§12.1, 12.3, 13, 14-18; src/domain/exec-registry.ts:365-435, 445-503; tests:263-305, 384-469
IDENTITY_RESULT = PARTIAL_FOR_INTEGRATED_NORMAL_SOURCE; no local identity violation, but productive DOM identity issuer is unavailable
```

The code's local `CatalogScope` and `CatalogBasis` values are authenticated by
private runtime brands, and application source material is independently
checked against the requested scope. This preserves identity in the tested
contract path. It does not create a DOM `RepositoryId`, and the local fixture
is correctly prohibited from becoming productive authority. The unresolved
productive issuer seam is covered by `ARCH-MAJOR-001`; it is not counted as a
canonical identity violation in the local implementation.

### Immutability result

```text
IMMUTABILITY_RESULT = CONFORMANT for local changed behavior
```

`CatalogBasis` and its entries are frozen; `register` copies entries and
increments a new `CatalogRevision`. Duplicate/conflicting entries, unsafe
revision overflow and malformed entries reject before mutation. Resolution
failures carry `noMutation = true` and `noApproval = true`. Direct witnesses
at `tests/exec-001-ticket-002.test.ts:160-170`, `263-280` and `370-382`
pass in the focused and full suites.

This result is limited to the local immutable basis. Physical immutability,
write atomicity and CAS are not claimed by T002 and remain integrated/PLAT
responsibilities.

### Lineage result

```text
LINEAGE_RESULT = PARTIAL_BY_EXPLICIT_SCOPE_BOUNDARY
LINEAGE_VIOLATIONS = 0
```

The local basis successor relation (`CatalogRevision.next()`) is explicit and
old bases remain unchanged. The code does not implement persisted digest,
source continuity, skipped/out-of-order revision rejection, semantic
rehydration, historical replay or restart recovery. Those are named foreign or
T003 responsibilities in the ticket/design and were not silently promoted into
this unit. No changed T002 path accepts persisted material or claims to
reconstruct it, so the omission is a bounded scope result rather than a local
lineage violation.

### Reconstruction proof boundary

```text
AGGREGATE_RECONSTRUCTION_PROOF = DEFERRED_TO_EXEC-IMP-03_AND_PLAT
WHAT_PERSISTED_MATERIAL_IS_ACCEPTED = none by T002
WHO_VALIDATES_PERSISTED_MATERIAL = EXEC-001 semantic validator in T003; PLAT physical integrity
CAN_UNTRUSTED_OR_DETACHED_PERSISTED_MATERIAL_BE_MATERIALIZED_DIRECTLY_AS_VALID_DOMAIN_STATE? = NO (normative contract; no T002 rehydration operation)
RECONSTRUCTION_VALIDATOR_OR_RESOLVER_OWNER = EXEC-001/T003
MUTATION_ON_FAILURE = NO
PROOF_EVIDENCE = SPEC §12.4; Design §§4, 7, 14-16; Ticket §10
```

This explicit deferral is why reconstruction is not marked as an omitted
required dimension for this ticket.

## Cross-spec integration audit

```text
CROSS_SPEC_RESULT = PARTIAL / INTEGRATION_NOT_PROVEN
```

The intended consumer boundary is correctly directed EXEC → DOM/REPO
producers. The consumer verifies:

1. source object and receipt were associated by the private receipt ledger;
2. source kind is the expected DOM, system bootstrap or REPO NORMAL kind;
3. basis is an authenticated domain basis;
4. scope equals the requested/canonical execution scope;
5. catalog revision equals the frozen requested revision;
6. source string matches the expected producer boundary; and
7. NORMAL catalog basis equals the DOM execution basis in scope and revision.

These checks are found in `src/application/exec-registry.ts:91-159` and
`src/domain/exec-registry.ts:667-735`. Direct negative tests cover copied
receipts, caller-defined sources, stale revisions, wrong sources, forged
scope/schema, local fixtures and DOM/bootstrap substitution.

The productive path is not consumable: `src/application/exec-registry-ports.ts`
exposes only the receipt shape and abstract read ports, while its only receipt
issuer (`issue`) and source registration are module-private and used solely by
`createLocal*Fixture`. A real DOM/REPO adapter cannot obtain a receipt accepted
by `isProducerIssuedCatalogBasisReceipt`. The local fixture is deliberately
rejected by `ResolveExecCapability` and `RegisterExecCapability`, which is
correct for preventing fixture promotion but leaves no productive issuer.
This is the material cross-spec defect in `ARCH-MAJOR-001`.

## Legacy, cutover and destructive-transition audit

```text
LEGACY_RESULT = TRANSITION_CONFORMANT within T002 scope
LEGACY_WRITES_STILL_ACTIVE = NO evidence
DUAL_AUTHORITY_REMAINS = NO local legacy writer
ALTERNATE_AUTHORITY_REMAINS = YES only as the unproven registration-result seam (ARCH-MAJOR-002)
```

* The implementation is a new EXEC canonical path.
* No prototype or generic delegation registry is imported or promoted.
* REPO legacy/configuration ownership is not reimplemented.
* Frozen bases are not rewritten and no old basis is silently converted.
* There is no destructive deletion, retirement or irreversible foreign cutover;
  all destructive-transition fields are therefore not applicable.

The registration result must still be bound to a real producer publication
before it can represent canonical cutover state. That is an authority-result
problem, not a legacy writer finding.

## Migration-authority audit

```text
MIGRATION_AUTHORITY_RESULT = MIGRATION_AUTHORITY_PRESERVED / NOT_APPLICABLE_TO_EXECUTION
```

`MIGRATION` is one of the allowed bootstrap capability categories, but T002
only stores category metadata and enforces the bootstrap allowlist. It neither
performs migration nor decides REPO enablement/legacy conversion. A NORMAL
capability in BOOTSTRAP is rejected before normal work, and no migration writer
or alternate migration authority appears in changed code.

## Authorization and caller-authority audit

```text
SECURITY_AUTHORIZATION_RESULT = NOT_APPLICABLE per SPEC §20
CALLER_AS_AUTHORITY_CHECK = PASS
CALLER_SUPPLIED_AUTHORITY_BYPASSES = 0
```

The caller supplies a scope assertion, request fields and a requested frozen
revision, but cannot supply the catalog basis, source receipt, supported set,
canonical result, or producer proof. `ResolveExecCapability` independently
reads DOM/REPO sources and compares their authenticated material to the
caller assertion. Caller-selected wrong repository and caller-supplied support
set witnesses pass closed at tests `452-469`. No lifecycle authorization or
security route is introduced.

## Temporal authority audit

```text
TEMPORAL_AUTHORITY_PROOF = NOT_APPLICABLE to local resolution effect
TEMPORAL_AUTHORITY_GAPS = 0
```

Resolution reads an immutable producer-bound basis and returns a result; it
commits no external effect. Local registration constructs an immutable
successor value and does not persist or publish it to an external store. The
physical publication/CAS/revalidation contract is explicitly outside T002.
Any future source-backed publication must independently re-observe current
producer truth before commit; the current code does not prove that future
operation and must not be promoted as such.

## Architecture scope and guards

```text
IMPLEMENTATION_DETAILS = immutable arrays, WeakSet/WeakMap runtime brands, stable ordering
AUTHORIZED_ARCHITECTURAL_REALIZATION = EXEC domain/application/composition split; narrow source ports; fixture/productive separation; fail-closed source checks
UNAUTHORIZED_ARCHITECTURAL_EXPANSION = no foreign lifecycle, persistence, transport, prototype or generic registry expansion
ARCHITECTURE_DECISION_REQUIRED = NO upstream decision gap
```

### Architecture guards

Required guard evidence is present and was executed:

| Guard | Evidence | Result |
|---|---|---|
| Productive graph has no infrastructure/prototype/transport/generic bucket dependency | `tests/exec-001-ticket-002.test.ts:610-625` | PASS |
| Loader rejects a forbidden dependency and loads the real composition graph | `tests/exec-001-ticket-002.test.ts:627-646`; `tests/exec-registry-import-boundary-loader.mjs`; forbidden fixture | PASS |
| Real graph/common-path boundary guard | `tests/exec-001-ticket-002.test.ts:648-675` | PASS for fixture rejection and graph loading; it does not prove a productive issuer |

```text
MISSING_ARCHITECTURE_GUARDS = 0
ARCHITECTURE_GUARD_TESTS_RUN = 2 required architecture-guard test cases
ARCHITECTURE_GUARD_EVIDENCE = focused T002 suite 25/25; full package suite 73/73; typecheck PASS; governance guard PASS; skill-mirror guard PASS
```

The guards prove dependency direction and fixture non-promotion. They do not
close the authority-provenance findings because ordinary/import guards cannot
prove productive producer issuance or registration-result authenticity.

## Systemic boundary expansion

### Root-cause campaign

```text
ROOT_CAUSE_CAMPAIGN_ID = RCC-EXEC-T002-AUTHORITY-PROVENANCE-SEAM
ROOT_CAUSE_ID = authority-bearing catalog source/registration outputs lack a complete productive issuer-bound proof path
CAMPAIGN_STATUS = OPEN
CAMPAIGN_SCOPE = EXEC-001-TICKET-002 registry/catalog source, registration and resolution boundaries
CANONICAL_FINDINGS = ARCH-MAJOR-001, ARCH-MAJOR-002
```

The two findings are distinct obligations under one systemic provenance seam:
productive source issuance is not consumable, and the registration result has no
independent proof even when a source basis is available.

### Required surface matrix

| Surface row | Class | Location | Owner | Normative obligation | Current behavior | Expected behavior | Related finding / AC | Coverage | Negative witnesses |
|---|---|---|---|---|---|---|---|---|---|
| `RCC-001-ISSUER-DOM` | `ISSUER` | `src/application/exec-registry-ports.ts:23-27` | DOM | DOM must issue exact execution identity/basis authority | Abstract read port exists, but no productive receipt issuer can issue accepted evidence | DOM producer issues an owner-bound receipt carrying exact basis/revision | `ARCH-MAJOR-001`; AC-EXEC-009/011 contribution | `MISSING` | `NW-001`, `NW-003` |
| `RCC-002-ISSUER-REPO` | `ISSUER` | `src/application/exec-registry-ports.ts:37-41` | REPO | REPO must issue enabled NORMAL catalog authority | Abstract read port exists, but no productive receipt issuer exists | REPO producer issues source-bound NORMAL basis receipt | `ARCH-MAJOR-001`; AC-EXEC-009/012 integration | `MISSING` | `NW-001`, `NW-003` |
| `RCC-003-REGISTRAR` | `REGISTRAR` | `src/application/exec-registry.ts:176-211` | EXEC registrar plus source owner | Registration must create absent key in the authorized basis and expose proof of publication | Read-only source is read, `basis.register(entry)` creates a successor and returns plain `REGISTERED` shape; no publication/issuer proof | Registrar returns an authenticated successor receipt bound to source, predecessor, entry and revision | `ARCH-MAJOR-002`; AC-EXEC-012 | `MISSING` | `NW-002`, `NW-008` |
| `RCC-004-CONSUMER-RESOLVE` | `CONSUMER` | `src/application/exec-registry.ts:63-159`; `src/domain/exec-registry.ts:667-735` | EXEC | Consumer verifies issuer, scope, revision, source and result binding | Resolution path performs these checks and rejects untrusted material | Same checks remain mandatory for productive source and registration result | `ARCH-MAJOR-001`; AC-EXEC-003/004/008/009/010/011/012 | `COVERED` | `NW-001`, `NW-003`, `NW-007` |
| `RCC-005-ALTERNATE-AUTHORITY` | `ALTERNATE_AUTHORITY_PATH` | `src/domain/exec-registry.ts:475-518, 678-687`; fixture helpers | EXEC test support | Fixtures may prove local contract semantics but cannot be canonical authority | Fixture results are unbranded and application rejects fixture sources | Preserve explicit fixture/productive split; no caller can promote fixture | AC-EXEC local witness | `COVERED` | `NW-002`, `NW-004` |
| `RCC-006-INJECTION` | `INJECTION_POINT` | `src/application/exec-registry.ts:82-90`; input `basis` rejection | EXEC consumer | Caller cannot inject basis or foreign source authority | Caller-supplied basis is rejected; scope/schema/proof are authenticated | Same | `ARCH-MAJOR-001`; AC-EXEC-009/011 | `COVERED` | `NW-004`, `NW-005` |
| `RCC-007-MUTATION` | `MUTATION_PATH` | `src/domain/exec-registry.ts:489-503` | EXEC domain | Registration must preserve frozen basis and fail without mutation | New basis is copied/frozen; duplicate/conflict/overflow reject | Same locally; productive publication must also bind successor to issuer/CAS owner | AC-EXEC-008/012 | `COVERED` locally; integrated publication `MISSING` | `NW-006` |
| `RCC-008-STALE` | `STALE_PATH` | `src/application/exec-registry.ts:152-159`; tests `432-444` | EXEC consumer/source owner | Stale basis/revision must fail closed | Exact requested `CatalogRevision` is checked; stale fixture case fails | Same for productive adapters and registration | `ARCH-MAJOR-001`; AC-EXEC-009 | `COVERED` | `NW-007` |
| `RCC-009-PORT-SUBSTITUTION` | `PORT_SUBSTITUTION_PATH` | `src/application/exec-registry-ports.ts:126-139` | DOM/REPO producer boundary | Alternate adapters must satisfy the same owner-bound proof contract | Plain/matching-source/copied receipts fail; no productive alternate adapter can issue a valid receipt | Every intended adapter has executable positive and negative contract evidence | `ARCH-MAJOR-001` | `MISSING` | `NW-001`, `NW-003`, no positive adapter witness |
| `RCC-010-PUBLIC-REGISTRATION-EXPORT` | `PUBLIC_EXPORT` | `src/domain/exec-registry.ts:789-793`; `src/application/exec-registry.ts:176-211` | EXEC consumer/registrar | Authority-bearing registration result must be independently verifiable | Plain `RegistryRegistrationResult`; no authenticated instance set/predicate and no entry/basis binding | Consumer validates issuer-bound registration receipt/result | `ARCH-MAJOR-002` | `MISSING` | `NW-008` |
| `RCC-011-PERSISTENCE` | `PERSISTENCE` | No T002 persistence path; T003/PLAT boundary | PLAT/T003 | Durable material must preserve identity, digest, continuity and source | Not implemented or claimed by T002 | T003/PLAT validate and reconstruct before materialization | Outside T002; EXEC-REGISTRY-004 | `OUTSIDE_SCOPE` | none applicable |
| `RCC-012-RETRY-RECOVERY` | `RETRY_RECOVERY` | No T002 retry/recovery path | PLAT/EXEC-002 | Retry/replay must preserve original basis | No retry/recovery operation in changed code | Later owner preserves original basis | Outside T002 | `OUTSIDE_SCOPE` | none applicable |
| `RCC-013-LEGACY-ROUTE` | `LEGACY_ROUTE` | No local legacy registry route; REPO owns legacy adaptation | REPO | Legacy path cannot regain registry write authority | No legacy writer/import or prototype promotion | REPO maps legacy material into canonical path only | Transition audit | `NOT_APPLICABLE` to changed T002 route | none applicable |
| `RCC-014-ARCHITECTURE-GUARD` | `ARCHITECTURE_GUARD` | `tests/exec-001-ticket-002.test.ts:610-675`; loader | EXEC | Forbidden dependencies and graph drift must be rejected | Guards run and pass | Maintain executable guard | Architecture guard requirement | `COVERED` | guard tests pass |
| `RCC-015-TEST` | `TEST` | `tests/exec-001-ticket-002.test.ts` | EXEC audit/test owner | Direct positive/negative provenance witnesses required | Local forgery/fixture negatives exist; no productive source positive or registration-result forgery consumer witness | Add direct productive issuer, alternate adapter and forged registration-result tests | `ARCH-MAJOR-001/002` | `MISSING` for those witnesses | `NW-008` |

```text
CAMPAIGN_MATRIX_COMPLETE = YES
ALL_SURFACE_ROWS_COVERED = NO (issuer/registrar/port-substitution/public-result proof remains missing)
ALL_NEGATIVE_WITNESSES_PASS = YES for implemented local witnesses; NW-008 is absent, not passing
NO_UNEXPLAINED_PUBLIC_AUTHORITY_PATH = NO (plain registration result is unexplained authority-bearing output)
NO_HIDDEN_CONCRETE_PROTOCOL = NO (productive receipt issuance relies on module-private ledger with no issuer API)
ROOT_CAUSE_REMOVED = NO
KNOWN_MANIFESTATIONS_CLOSED = NO
SYSTEMIC_TEST_EVIDENCE = PARTIAL
```

### Negative witness index

| ID | Witness | Result |
|---|---|---|
| `NW-001` | Matching-source forgery, copied receipt and DOM/bootstrap substitution (`tests/...:406-450`) | PASS: rejected as `CONTRACT_INVALID` |
| `NW-002` | Caller-created fixture used for productive registration (`tests/...:471-487`) | PASS: rejected; prior basis unchanged |
| `NW-003` | Missing, untrusted and wrong-source adapters (`tests/...:555-577`) | PASS: fail closed |
| `NW-004` | Direct basis injection, forged scope/schema (`tests/...:384-404`) | PASS: rejected |
| `NW-005` | Caller-selected repository and caller support-set authority (`tests/...:452-469`) | PASS: rejected/ignored |
| `NW-006` | Duplicate/conflict, revision overflow and synthetic basis immutability (`tests/...:263-280`, `370-382`) | PASS: old basis unchanged |
| `NW-007` | Stale source revision (`tests/...:432-437`) | PASS: rejected |
| `NW-008` | Forged `RegistryRegistrationResult` accepted by a consumer | MISSING: no authenticated result validator or direct executable consumer witness exists |

## Findings

### ARCH-MAJOR-001 — Productive DOM/REPO source receipt protocol has no issuer

- **Severity:** `MAJOR`
- **Ticket:** `EXEC-001-TICKET-002`
- **Normative authority:** `SPEC-EXEC-001` §§12.1, 12.3, 12.4, `EXEC-REGISTRY-004`; `ACP-EXEC-02`/`PCP-DOM-EXEC-01`/`PCP-REPO-EXEC-01` in the ticket and Design §§7/16; Authority Provenance and Anti-Forgery Contract (`PROOF_ISSUER_OWNER`, `CONSUMER_VERIFIES_PROVENANCE`, `ALTERNATE_ADAPTER_CONTRACT`).
- **Owner:** DOM canonical execution-basis producer and REPO enabled-catalog producer, with EXEC owning the consumer-side verification contract.
- **Affected boundary:** DOM execution basis → EXEC; REPO NORMAL catalog → EXEC; issuer, consumer, port-substitution, stale and public source boundaries.
- **Repository evidence:** `src/application/exec-registry-ports.ts:15-21` exposes only a structural receipt; `:43-55` keeps issuance in private `issue`; `:57-74` is the only source registration and is explicitly a local fixture; `:115-118` says integrated producers must issue their own receipts but provides no productive issuance operation. `src/application/exec-registry.ts:91-159` requires private-ledger receipt evidence and rejects local fixtures; `:191-205` applies the same restriction to registration. Tests `406-450`, `555-577` and `579-608` prove rejection of forged/untrusted/fixture sources, but there is no successful productive DOM/REPO producer path. The ticket itself records `PRODUCTIVE_AVAILABILITY = NO` and `AUTHORITY_CONSUMPTION_GAP` for the two integrated-only producers (§§14a-14b).
- **Problem:** A legitimate DOM or REPO adapter cannot produce a receipt accepted by `isProducerIssuedCatalogBasisReceipt`: the only function that populates `ISSUED_RECEIPTS` is private and is exposed only through local fixture helpers, while all such fixture sources are rejected at the application boundary. The source port therefore contains a hidden concrete protocol rather than a consumable producer contract. The known lack of an integrated producer is not itself the defect; the defect is that a future producer has no authorized way to issue the evidence the consumer requires.
- **Impact:** Productive authority consumption cannot be established. Integrated NORMAL/BOOTSTRAP resolution and registration cannot consume canonical DOM/REPO truth without changing this boundary. Local fixture tests can prove only contract shape and fail-closed rejection, not productive authority, alternate-adapter compatibility or integrated availability. This leaves the cross-SPEC contract `INTEGRATION_NOT_PROVEN` and prevents promotion of `PRODUCTIVE_AVAILABILITY`.
- **Minimum correction required:** Define an owner-issued, consumer-verifiable receipt/public producer contract for each intended DOM/REPO source (or an equivalent authenticated boundary), binding issuer, source kind, exact scope/identity, basis/revision and stale/mutation semantics. Add direct productive positive/negative witnesses, including forged/caller-injected, stale, copied and alternate-adapter cases. Do not promote the existing fixture helper or a copied structural receipt.
- **Systemic pattern =** `YES`
- **Related locations:** `src/application/exec-registry-ports.ts:15-21,43-139`; `src/application/exec-registry.ts:91-159,176-211`; `tests/exec-001-ticket-002.test.ts:406-450,555-608`; `ARCH-MAJOR-002`; `RCC-EXEC-T002-AUTHORITY-PROVENANCE-SEAM`.

### ARCH-MAJOR-002 — Registration result claims authority without an issuer-bound proof

- **Severity:** `MAJOR`
- **Ticket:** `EXEC-001-TICKET-002`
- **Normative authority:** `SPEC-EXEC-001` §§12.1, 12.3, 13 (`EXEC-REGISTRY-004`), 14 (`EXEC-CAPABILITY-002`) and interface classification for registry-entry registration/publication; Design §§7, 8, 16, 20; Authority Provenance and Anti-Forgery Contract for authority-bearing results.
- **Owner:** EXEC registry registrar/consumer boundary, with the source owner responsible for publication authority.
- **Affected boundary:** `RegisterExecCapability` registrar output, public `RegistryRegistrationResult`, source publication and any downstream consumer of a `REGISTERED` result.
- **Repository evidence:** `src/domain/exec-registry.ts:789-793` defines `RegistryRegistrationResult` as a plain structural interface. There is no registration-result instance brand, issuer proof, binding predicate or authenticated result validator. `src/application/exec-registry.ts:176-211` reads a source and returns a frozen object `{status: 'REGISTERED', code: 'REGISTERED', basis: basis.register(entry), entry}`. The source is read-only; there is no source write/publication acknowledgement, predecessor binding, entry-to-basis proof or CAS/publication evidence. `CatalogBasis.register` at `src/domain/exec-registry.ts:489-503` creates a successor value, but that alone does not prove the producer committed or authorized that successor. The only registration tests (`tests/exec-001-ticket-002.test.ts:471-487`) reject local fixture use and forged basis input; no success-path or forged registration-result consumer witness exists. Repository search finds no consumer or validator for `RegistryRegistrationResult`.
- **Problem:** A caller can construct a matching `REGISTERED` object with an authenticated basis and an unrelated entry, and no consumer-side proof can distinguish it from a registrar-issued result. Even a genuine result does not prove that the source owner published or authorized the returned successor. The returned shape therefore creates an unverified alternate authority/publication path.
- **Impact:** A downstream consumer could accept a synthetic capability or new catalog basis that is absent from the source-owned NORMAL/BOOTSTRAP catalog, bypassing canonical publication, source ownership, duplicate/continuity checks and future persistence/CAS authority. This is latent at the target because no productive consumer exists, but it is a material architecture defect in the exposed registrar boundary and would become an authority bypass when integrated.
- **Minimum correction required:** Make registration return an issuer-bound authenticated proof/result that binds the source owner, predecessor basis, complete entry identity, successor `CatalogRevision`, publication/commit outcome and no-mutation-on-failure semantics. Provide consumer-side verification and direct negative tests for forged result, unrelated entry, stale predecessor, copied receipt and alternate adapter. A plain frozen object or the existence of `CatalogBasis.register` is not sufficient proof.
- **Systemic pattern =** `YES`
- **Related locations:** `src/domain/exec-registry.ts:489-503,521-541,789-793`; `src/application/exec-registry.ts:176-211`; `tests/exec-001-ticket-002.test.ts:471-487`; `RCC-EXEC-T002-AUTHORITY-PROVENANCE-SEAM`; `ARCH-MAJOR-001`.

## Test and verification evidence

Commands executed against the pinned target:

```text
node --experimental-strip-types --test tests/exec-001-ticket-002.test.ts
  25 passed, 0 failed

npm test
  73 passed, 0 failed

npm run typecheck
  PASS

npm run verify:audit-governance
  PASS: audit governance contracts and guards

npm run verify:skill-mirror
  PASS: skill mirror synchronized
```

The focused suite contains the two architecture guard cases and all local
negative witnesses listed above. Green tests do not close `ARCH-MAJOR-001` or
`ARCH-MAJOR-002`: they demonstrate fixture rejection and local domain
immutability, not productive issuer availability or authenticated registration
result consumption.

## Audit result summary

Audit: `.pi/runtime/workflow-audits/ad04b7aa-49bd-4936-953d-b2f673ece285/architecture-EXEC-001-TICKET-002-architecture-boundaries-audit.md`

Specialist:
ARCHITECTURE_BOUNDARIES

Ticket: EXEC-001-TICKET-002

Ownership errors: 0

Foreign capability duplication: 0

Authority violations: 1

Identity violations: 0

Immutability/lineage violations: 0

Legacy authority violations: 0

Architectural authority gaps: 0
Authority consumption gaps: 2
Producer/consumer contract errors: 1
Temporal authority gaps: 0
Caller-supplied authority bypasses: 0
Missing architecture guards: 0
Architecture guard tests run: 2

Findings:
CRITICAL=0
MAJOR=2
MINOR=0
INFO=0

Domain audit complete:
YES

Specialist result:
SPECIALIST_ARCHITECTURE_FINDINGS

AUDIT_TARGET_HEAD: 49b4448ba10ee9aa9d3ce7d47b139de474a482ba
AUDIT_TARGET_STATE_FINGERPRINT: 7983511cf1e9833261f61e43cdb252de0ed59fb330fcef75d6c03755f24f9a4d
AUDIT_WAVE_ID: ad04b7aa-49bd-4936-953d-b2f673ece285
DOMAIN_AUDIT_COMPLETE: YES
SPECIALIST_RESULT: SPECIALIST_ARCHITECTURE_FINDINGS