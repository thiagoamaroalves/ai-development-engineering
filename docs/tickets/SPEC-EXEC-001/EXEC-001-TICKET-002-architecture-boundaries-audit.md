# Architecture Boundaries Audit — EXEC-001-TICKET-002

## 1. Audit identity and basis

| Field | Value |
|---|---|
| Ticket | `EXEC-001-TICKET-002` |
| Ticket path | `docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-version-registry-catalogs-capabilities.md` |
| Approved design | `docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-implementation-design.md` |
| Ticket-set audit | `docs/tickets/SPEC-EXEC-001/implementation-ticket-audit.md` |
| Audit artifact | `.pi/runtime/workflow-audits/dac96179-dd62-47f9-8c9d-901fc1dd3e76/architecture-EXEC-001-TICKET-002-architecture-boundaries-audit.md` |
| Ticket status at target | `VALIDATION_REQUIRED`; implementation record says `IMPLEMENTED` |
| Implementation unit | `EXEC-IMP-02 — Version, registry resolution, catalogs and capability extensibility` |
| Implementation baseline | `d4216ad6f4a87fe7142ccd45d3fd099ef1b92955` (ticket §27 semantic baseline) |
| Audit target HEAD | `cc3fe3210eaebf8e0f577f7f5e1e48b97ed175bb` |
| Current HEAD | `cc3fe3210eaebf8e0f577f7f5e1e48b97ed175bb` |
| Target state fingerprint | `d9da64d8a9ae6a490737bc93789929e656559d2463d06916d4704439d2d20c22` |
| Working-tree overlay | None; `git status --short` was clean |
| Audit mode | `READ_ONLY INDEPENDENT ADVERSARIAL ARCHITECTURE_FIRST OWNERSHIP_PRESERVING AUTHORITY_PRESERVING CROSS_SPEC_AWARE IDENTITY_AWARE LEGACY_TRANSITION_AWARE` |

The target is a remediation checkpoint after the implementation baseline. The
implementation and direct test paths were inspected at the pinned target, not at
the ticket's older execution-record counts. The target-to-baseline semantic
paths are:

- `src/domain/exec-registry.ts`
- `src/domain/exec-contract.ts` (authenticated schema-reference export)
- `src/application/exec-registry.ts`
- `src/application/exec-registry-ports.ts`
- `src/composition/exec-registry.ts`
- `tests/exec-001-ticket-002.test.ts`
- `docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/AC-EXEC-003-semver.md`
- `docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/AC-EXEC-005-registry-contribution.md`
- `docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/AC-EXEC-007-registry-contribution.md`
- `docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/AC-EXEC-008-deterministic-resolution.md`
- `docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/AC-EXEC-009-catalog-isolation.md`
- `docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/AC-EXEC-010-bootstrap-allowlist.md`
- `docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/AC-EXEC-011-failure-distinction.md`
- `docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/AC-EXEC-012-registry-extensibility.md`

The target also contains the round-4 remediation/checkpoint documentary paths;
those were read only as implementation claims and not treated as authority.
No sibling specialist audit artifact was read.

Executed evidence at the pinned target:

- `node --experimental-strip-types --test tests/exec-001-ticket-002.test.ts`: 20 passed, 0 failed, 0 skipped.
- `npm run typecheck`: pass.
- `git diff --check <target>^ <target>`: pass.
- The two architecture-oriented tests in the focused suite loaded the real
  graph, scanned forbidden dependency imports, and exercised the composition
  path. They do not prove a productive DOM/REPO producer.
- An additional read-only adversarial probe constructed a prototype-shaped
  `SchemaReference` with the same `schemaId`/`version` as the valid input and
  evaluated `isRegistryResolutionBoundToRequest` against a valid result. It
  returned `true`; this is direct evidence for `ARCH-CRITICAL-001` below.

## 2. Source precedence and reconstructed architectural contract

Authority was applied in this order:

1. Accepted `docs/adrs/ADR-0003-versioned-skill-contracts.md` revision 3.
2. Accepted/conformant component contract
   `docs/specs/SPEC-EXEC-001-skill-contracts-and-capability-registry.md`.
3. Explicit DOM/REPO ownership contracts, including
   `docs/specs/SPEC-DOM-001-workflow-authority-and-governance.md` and
   `docs/adrs/ADR-0010-repository-configuration-and-legacy-migration.md`.
4. Validated Gap Matrix and its audit.
5. Implementation Plan and Plan Audit.
6. Ticket and approved Implementation Design.
7. Repository implementation and tests as behavioral evidence only.

### Contract reconstruction

| Contract item | Reconstructed authority and consequence |
|---|---|
| Local owner | `SPEC-EXEC-001 / EXEC-001 / CANONICAL_OWNER` owns semantic-version meaning, explicit supported sets, deterministic registry mapping, independent catalog semantics, bootstrap allowlist, canonical unknown/incompatible results and common registry extensibility. Sources: SPEC §§12.1, 13, 14; requirements `EXEC-VERSION-001/002`, `EXEC-REGISTRY-001/002/003`, `EXEC-CAPABILITY-001/002`; Portfolio O-017/O-020. |
| Local authorities | `SemanticVersion`, `SupportedVersionSet`, `CatalogScope`, `RegistryEntry`, immutable `CatalogBasis`, compatibility/allowlist policies and `RegistryResolutionService` may own these local semantic decisions. Application use cases may orchestrate and fail closed; they may not redefine the decisions. |
| Foreign owners | DOM owns canonical `RepositoryId`, execution identity, snapshot/frozen execution basis and lifecycle. REPO owns enabled repository configuration, NORMAL catalog source, onboarding and legacy compatibility/enablement. PLAT owns physical storage, integrity, ordering, persistence and reconstruction. EXEC-002/downstream owners own sessions, work and effects. Sources: SPEC EXEC-REGISTRY-004, DOM §12, ADR-0010, Plan PCP-DOM-EXEC-01/PCP-REPO-EXEC-01. |
| Foreign capabilities consumed | `DOM-EXEC-IDENTITY-SNAPSHOT` and `REPO-EXEC-NORMAL-CATALOG`, both `AUTHORITY_STATUS=DEFINED`, `CONTRACT_STATUS=DEFINED`, `LOCAL_TESTABILITY=NO`, `PRODUCTIVE_AVAILABILITY=NO`, `REQUIRED_FOR_INTEGRATED_PROOF`. `UNIT-EXEC-REGISTRY-FIXTURE` is local contract evidence only: `DEFINED/DEFINED/YES/NO`, `INFORMATIONAL`. |
| Canonical identities | NORMAL entry identity is `(CatalogScope=NORMAL, RepositoryId, SkillContractId, CapabilityId, SchemaId, SemanticVersion)` where `RepositoryId` is DOM-canonical. BOOTSTRAP identity is independent system scope plus `(SkillContractId, CapabilityId, SchemaId, SemanticVersion)`. `CatalogRevision` is a frozen basis/revision and is not a substitute for domain identity. Source: SPEC EXEC-REGISTRY-004 and AC-EXEC-019. |
| Immutability | Semver/support sets, authenticated schema references, entries and local catalog bases are frozen. Registration is create-only: it returns a new basis and leaves the prior basis unchanged. Duplicate/conflicting registration is `CONTRACT_INVALID` with no mutation. Source: SPEC EXEC-REGISTRY-004/002, AC-EXEC-009/012, ticket §15. |
| Lineage | A resolved result must remain bound to the source basis, scope and exact requested version. Full persisted digest, continuity, reconstruction, stale/corrupt material and physical history belong to TICKET-003/PLAT. This ticket may not reinterpret historical snapshots/manifests. |
| Legacy authority | NORMAL catalog configuration and legacy compatibility remain REPO-owned. BOOTSTRAP is a separate system catalog, not an alias or extension of NORMAL. No silent version conversion or legacy registry writer is authorized. Sources: ADR-0003, ADR-0010, SPEC EXEC-REGISTRY-002/003 and ticket §21. |
| Cutover rules | A semantic change requires a new semantic version and basis; frozen bases and started snapshots/manifests are not rewritten. This ticket introduces a new canonical path but does not retire a foreign legacy writer. |
| Migration authority | REPO owns migration/onboarding lifecycle. EXEC may classify `MIGRATION` as an allowed BOOTSTRAP category, but does not implement migration, enablement or candidate configuration promotion. |
| Security/authority boundary | Source material must be owner-issued, scope-bound, revision-bound and fail closed when unknown, stale, detached, forged or mismatched. No caller-supplied basis, support set, schema proof or source substitution may become canonical authority. The registry returns a resolution; it does not execute work/effects. |
| Does not implement | DOM identity/lifecycle/snapshot production, REPO configuration/enablement/migration, physical persistence/recovery/CAS, sessions/scheduling, external effects, transport/UI/OPS mappings. Sources: ticket §§10, 15 and Design §§4, 16. |

## 3. Applicability matrix

| Dimension | Classification | Evidence/reason |
|---|---|---|
| OWNERSHIP | REQUIRED | New EXEC semantic authority and explicit DOM/REPO seams are implemented. |
| CANONICAL_AUTHORITY | REQUIRED | Registry resolution and canonical outcome decisions are the ticket's primary responsibility. |
| CROSS_SPEC_INTEGRATION | AFFECTED | DOM and REPO basis/catalog contracts are consumed at the application boundary, although integrated producers are explicitly deferred. |
| IDENTITY | REQUIRED | Registry entry identity includes a DOM-owned `RepositoryId` for NORMAL and authenticated schema/source references. |
| IMMUTABILITY | REQUIRED | Frozen basis, entry and support-set behavior is acceptance-critical. |
| LINEAGE | AFFECTED | Basis/revision/result binding is local; durable reconstruction and historical continuity are explicitly later scope. |
| LEGACY_TRANSITION | AFFECTED | NORMAL/BOOTSTRAP cutover and REPO legacy compatibility are explicit ticket impacts, even though no legacy writer is changed here. |
| DESTRUCTIVE_TRANSITION | NOT_APPLICABLE | No deletion, retirement, destructive migration or irreversible writer cutover is implemented; registration creates a new in-memory basis. |
| MIGRATION_AUTHORITY | AFFECTED | BOOTSTRAP admits only the migration/onboarding category set, but migration lifecycle remains REPO-owned and is not implemented here. |
| SECURITY_AUTHORIZATION | AFFECTED | Source receipts, schema references, basis/revision checks and caller-injection rejection are authority-sensitive boundaries. This is not a penetration test. |

## 4. Authority consumption and producer/consumer proofs

### DOM execution identity/snapshot basis

- `CAPABILITY_ID`: `DOM-EXEC-IDENTITY-SNAPSHOT`.
- `TRUTH_OWNER`/semantic source: `SPEC-DOM-001`; canonical DOM resolver and
  snapshot owner.
- `CONSUMER`: `ResolveExecCapability` through
  `ExecutionCatalogBasisReader`; expected source kind is `DOM_EXECUTION_BASIS`.
- `RETURNED_DATA`: canonical repository-scoped execution basis, including
  `RepositoryId`/NORMAL scope and frozen `CatalogRevision`.
- `FAILURE/STALE`: unissued, detached, wrong-scope, stale, corrupt or
  mismatched material must fail closed without mutation.
- `AUTHORITY_STATUS=DEFINED`; `CONTRACT_STATUS=DEFINED`; `SEMANTIC_STATUS=DEFINED`.
- `LOCAL_TESTABILITY=NO`; `PRODUCTIVE_AVAILABILITY=NO`; derived summary
  `CONTRACT_DEFINED`; `DEPENDENCY_CLASS=REQUIRED_FOR_INTEGRATED_PROOF`.
- `AVAILABILITY_EVIDENCE`: accepted DOM contract and Plan PCP-DOM-EXEC-01;
  no productive producer at the pinned target.
- Result: `AUTHORITY_CONSUMPTION_GAP` for integrated proof only. The local
  fixture is not productive availability.

### REPO NORMAL catalog

- `CAPABILITY_ID`: `REPO-EXEC-NORMAL-CATALOG`.
- `TRUTH_OWNER`/semantic source: `SPEC-REPO-001`; enabled repository
  configuration source.
- `CONSUMER`: `ResolveExecCapability` through `NormalCatalogSource`; expected
  source kind is `REPO_NORMAL_CATALOG`.
- `RETURNED_DATA`: enabled, repository-scoped NORMAL catalog basis bound to the
  DOM execution basis and exact `CatalogRevision`.
- `FAILURE/STALE`: wrong repository/source/basis, unissued, detached or stale
  material must fail closed without mutation.
- `AUTHORITY_STATUS=DEFINED`; `CONTRACT_STATUS=DEFINED`; `SEMANTIC_STATUS=DEFINED`.
- `LOCAL_TESTABILITY=NO`; `PRODUCTIVE_AVAILABILITY=NO`; derived summary
  `CONTRACT_DEFINED`; `DEPENDENCY_CLASS=REQUIRED_FOR_INTEGRATED_PROOF`.
- `AVAILABILITY_EVIDENCE`: accepted REPO contract and Plan PCP-REPO-EXEC-01;
  no productive producer at the pinned target.
- Result: `AUTHORITY_CONSUMPTION_GAP` for integrated proof only. The local
  fixture is not productive availability.

### Local fixture

`UNIT-EXEC-REGISTRY-FIXTURE` has defined local contract semantics and direct
negative witnesses, but `PRODUCTIVE_AVAILABILITY=NO`. The implementation
correctly attempts to prevent local fixtures from crossing the productive
application/registration boundary. It must not be used as authority or as a
promotion of either foreign capability.

The intended consumer contract is therefore conceptually defined, but the
implemented source-port provenance mechanism has no constructible productive
issuer: `issue`, `AUTHENTICATED_SOURCE_INSTANCES`, `ISSUED_RECEIPTS` and
`SOURCE_KINDS` are module-private, while the only exported issuer factories are
`createLocal*CatalogFixture`; `ResolveExecCapability` and
`RegisterExecCapability` explicitly reject those fixtures. This is the concrete
cross-spec seam defect in `ARCH-MAJOR-001`, not a claim that local fixture tests
prove productive availability.

## 5. Ownership and canonical authority audit

### Ownership

Result: `OWNERSHIP_PRESERVED` for local semantics; no foreign lifecycle or
configuration behavior is duplicated. `RegistryResolutionService` owns
semver, entry lookup, explicit support membership, scope/allowlist decisions
and canonical resolution outcomes. `ResolveExecCapability` and
`RegisterExecCapability` orchestrate, authenticate and fail closed. The code
contains no DOM lifecycle, REPO enablement, PLAT persistence or effect path.

The boundary is nevertheless incomplete for productive cross-spec use: the
EXEC port module owns the only runtime receipt ledger, but it exposes no
producer-owned issuance path to DOM or REPO. This is reported as a cross-spec
integration finding, not as foreign ownership leakage.

### Canonical authority

Result: `AUTHORITY_PRESERVED` for direct local domain behavior; no dual
canonical registry writer or second category-specific registry was introduced.
`CatalogBasis.register` returns a new immutable basis and does not mutate a
frozen basis. Application resolution requires source material rather than
accepting a caller-supplied basis.

A consumer-side authority verification defect remains: the exported
`isRegistryResolutionBoundToRequest` proof accepts a prototype-forged schema
object whose fields match a valid schema. It delegates to
`RegistryEntry.acceptsSchema`, which compares `schemaId`/`version` shape without
requiring `isAuthenticatedSchemaReference`. This is `ARCH-CRITICAL-001`.

## 6. Cross-spec integration audit

Result: `INTEGRATION_NOT_PROVEN` / `PARTIAL`.

Positive local domain behavior is present and direct tests prove explicit
semver, complete mapping, independent scope values, bootstrap allowlisting,
canonical unknown/incompatible outcomes, common-path synthetic registration
and frozen-basis no-mutation. The application rejects untrusted, copied,
wrong-kind, wrong-source, stale and local-fixture source material.

The required productive producer/consumer proof is absent. The public port
classes have `read(): CatalogBasisSourceReceipt`, but no productive owner can
issue a receipt through the exported API. A caller-defined structural source
cannot pass the private WeakSet checks, and a local fixture is intentionally
rejected. Consequently, integrated DOM/REPO resolution cannot succeed at this
HEAD. This preserves fail-closed behavior but does not establish productive
availability or a consumable integrated seam.

The implementation does not recompute DOM identity or REPO enablement, and it
does not promote `PRODUCTIVE_AVAILABILITY`. The integrated-only dependency is
not a local closure blocker under the approved `REQUIRED_FOR_INTEGRATED_PROOF`
classification.

## 7. Identity, immutability and lineage audit

### Identity

Result: `PARTIAL` at the integrated boundary; local entry-key behavior is
stable and duplicate-safe, but canonical identity/provenance is not complete.
The local `CatalogScope.normal(repositoryId: unknown)` stores an arbitrary
validated string, while the accepted contract requires a DOM-canonical
`RepositoryId`. The source receipt carries only `basis`; it has no separately
verifiable owner-issued identity reference. The application currently cannot
obtain productive source receipts, so this gap is not closed by local fixtures.

The direct schema-proof bypass is an identity/provenance violation and is
counted in `ARCH-CRITICAL-001`: a forged `SchemaReference` with matching fields
is accepted by `acceptsSchema` and the exported binding verifier. The regular
resolver's initial schema check rejects that forged request, but that upstream
guard does not make the public consumer verifier safe for every caller.

### Immutability

Result: `CONFORMANT` for local scope. `Object.freeze` protects values/results;
`CatalogBasis.register` publishes a new basis; duplicate/conflicting entries
fail without modifying the prior basis; tests compare prior basis identity and
entry count. Durable immutability/recovery is not claimed.

### Lineage

Result: `PARTIAL` by scope, not a local violation. Resolved results retain the
exact basis object and requested version, and source checks compare scope and
catalog revision. Persistent digest, ordered revision continuity,
reconstruction and historical replay are explicitly TICKET-003/PLAT concerns.
The absent productive source issuer means integrated lineage cannot yet be
proven, contributing to `ARCH-MAJOR-001`.

### Aggregate identity proof

- `AGGREGATE_ROOT`: `REGISTRY_ENTRY` within immutable `CatalogBasis`.
- `CANONICAL_IDENTITY`: NORMAL scope + DOM `RepositoryId` + skill contract +
  capability + input schema identity + semantic version; BOOTSTRAP independent
  system scope plus the remaining tuple.
- `IDENTITY_AUTHORITY_SOURCE`: EXEC owns registry meaning; DOM owns
  `RepositoryId`; REPO owns NORMAL material.
- `PERSISTED/REHYDRATED_REPRESENTATION`: not implemented in this ticket; PLAT/
  TICKET-003 owns it.
- `EQUALITY/CONTINUITY`: entry identity uses the complete local key and basis
  reference; old basis is never rewritten.
- `ALIASES/FORBIDDEN_SUBSTITUTIONS`: aliases, ranges, silent conversion,
  caller basis, copied source receipt and fixture promotion are rejected or
  forbidden.
- Result: local semantic identity is deterministic, but integrated identity
  proof is incomplete and schema-reference provenance has the critical verifier
  gap above.

## 8. Legacy, cutover, destructive transition and migration audit

### Legacy/cutover

Result: `TRANSITION_CONFORMANT` for the implemented local scope. NORMAL and
BOOTSTRAP are represented as distinct scopes and source kinds. No legacy writer,
REPO configuration mutation, silent conversion, historical rewrite or alternate
catalog authority was introduced. The implementation uses `NEW_CANONICAL_PATH`
and leaves `LEGACY_COMPATIBILITY` with REPO.

### Destructive transition

`NOT_APPLICABLE`: no destructive transition is executed. Therefore
`REPLACEMENT_PROVEN`, `CUTOVER_AUTHORIZED`, `PRE_TRANSITION_GATES_SATISFIED`,
`POST_TRANSITION_GUARDS_PRESENT` and rollback/roll-forward semantics are not
applicable to this target. The implementation only creates immutable local
basis values and returns fail-closed results.

### Migration authority

Result: `MIGRATION_AUTHORITY_PRESERVED`. The bootstrap allowlist includes
`MIGRATION` as an onboarding category, but no migration operation, candidate
configuration promotion or enablement transition is implemented. REPO remains
the migration/enablement owner.

## 9. Security/authorization-sensitive boundary audit

Result: `PARTIAL`.

The backend/application boundary does not treat an arbitrary caller basis,
source object, copied receipt, wrong source kind, stale revision or local
fixture as authoritative. It also no longer exposes a registry work callback.
These are direct negative witnesses in the focused suite.

The exported authority-binding verifier does accept a forged schema reference
with matching fields, as described in `ARCH-CRITICAL-001`. This is not a
network or authentication penetration issue; it is a consumer-side provenance
and identity verification failure. Capability possession must not substitute
for canonical schema-reference provenance.

## 10. Architectural scope and authority checks

| Decision/path | Classification | Result |
|---|---|---|
| Domain value objects, immutable basis and common registry path | AUTHORIZED_ARCHITECTURAL_REALIZATION | Preserves EXEC ownership and the approved no-storage local boundary. |
| Local fixture receipt ledger | IMPLEMENTATION_DETAIL | Acceptable only as contract-test support; application correctly rejects it as productive authority. |
| Module-private receipt issuance as the only possible productive issuer | ARCHITECTURE_DECISION_REQUIRED / unauthorized as a productive seam | DOM/REPO cannot implement the declared consumer contract through the public boundary; reported by ARCH-MAJOR-001. |
| Public exported binding verifier using structural schema comparison | UNAUTHORIZED_ARCHITECTURAL_EXPANSION | It creates an alternate proof path that accepts forged schema shape; reported by ARCH-CRITICAL-001. |
| No registry work/effect callback | AUTHORIZED_ARCHITECTURAL_REALIZATION | Preserves downstream execution/effect ownership. |

### Caller-as-authority check

- Caller-supplied catalog basis: rejected.
- Caller-supplied support set: ignored by resolution; entry-owned support set
  is used.
- Caller-selected source substitution: rejected by source receipt provenance,
  source kind and fixture rejection.
- Caller-supplied `scope`/`catalogRevision`: used only as requested binding
  checks against producer material in the application path; they are not
  sufficient canonical authority by themselves. Productive producer binding is
  unproven because the producer issuer path is absent.
- Caller-supplied forged schema in the exported result-binding verifier:
  accepted when shape matches; `CALLER_SUPPLIED_AUTHORITY_BYPASS = YES` and
  `ARCH-CRITICAL-001`.

### Temporal authority proof

`TEMPORAL_AUTHORITY_PROOF = NOT_APPLICABLE` for local behavior: the ticket
loads immutable in-process bases and commits no external effect. The integrated
source contract still requires exact frozen basis/revision and stale failure;
that productive proof is not present, but is an integrated availability gap,
not a local temporal-effect claim.

## 11. Architecture guards

`ARCHITECTURE_GUARD_TESTS_RUN = 2`:

1. `productive registry graph has no infrastructure, prototype, transport or
   generic bucket dependency` — scans all four production registry modules.
2. `exec registry architecture guard imports the real graph and exercises the
   common path` — dynamically imports domain/application/ports/composition and
   exercises the composition boundary with a local source fixture, which is
   correctly rejected as nonproductive.

`ARCHITECTURE_GUARD_EVIDENCE`: both passed in the focused 20-test run; no
forbidden production import or generic authority bucket was observed.

`MISSING_ARCHITECTURE_GUARDS = 0` for the guard required by the approved
Design. The missing forged-schema negative witness is a provenance-test gap in
ARCH-CRITICAL-001, not a missing import/dependency architecture guard.

## 12. Systemic boundary expansion and root-cause campaigns

The authority findings are expanded across the required issuer, registrar,
consumer, alternate-authority, injection, mutation/stale, port-substitution,
public-export and architecture-guard surfaces. The campaigns are not closed by
ordinary happy-path tests.

### Campaign A — schema-reference proof acceptance

`ROOT_CAUSE_CAMPAIGN_ID = RCC-EXEC-T002-SCHEMA-PROVENANCE-001`

`ROOT_CAUSE_ID = RC-EXEC-T002-SCHEMA-PROOF-VERIFIER-001`

`CAMPAIGN_STATUS = OPEN`; `CAMPAIGN_SCOPE = EXEC-001-TICKET-002`; canonical
finding `ARCH-CRITICAL-001`.

| Surface row | Class | Location/owner | Current behavior | Expected behavior | Coverage |
|---|---|---|---|---|---|
| A-ISSUER | ISSUER | `src/domain/exec-contract.ts`; EXEC contract boundary | `SchemaReference.create` authenticates/freeze-locks canonical instances. | Only authenticated canonical schema references may satisfy authority proof. | COVERED for creation; consumer proof remains incomplete. |
| A-REGISTRAR | REGISTRAR | `RegistryEntry.create` / EXEC domain | Entry construction rejects forged schema references. | Registrar must preserve reference identity and reject forgery. | COVERED by tests. |
| A-CONSUMER | CONSUMER | `RegistryEntry.acceptsSchema`; `isRegistryResolutionBoundToRequest` | Compares `schemaId`/`version` shape without authentication. | Consumer must verify provenance/brand before treating the schema as bound. | MISSING; direct probe returned `true` for forged matching shape. |
| A-ALTERNATE | ALTERNATE_AUTHORITY_PATH | Exported `acceptsSchema` and binding helper | Public helper can serve as an alternate proof path. | No structural shape path may establish authority. | MISSING. |
| A-INJECT | INJECTION_POINT | Caller-provided `request.schema` to exported binding helper | Prototype-shaped schema can pass when fields match. | Caller-injected schema must fail closed. | MISSING negative witness. |
| A-MUTATE | MUTATION_PATH | `SchemaReference` instances | Canonical instances are frozen. | Mutation must not change proof identity. | COVERED; does not cure forged-shape acceptance. |
| A-STALE | STALE_PATH | Schema-reference comparison | Schema references are immutable; no temporal schema source exists in this ticket. | No mutable/stale schema authority is accepted. | NOT_APPLICABLE for temporal mutation; forgery remains applicable. |
| A-PORT | PORT_SUBSTITUTION_PATH | Schema reference/result binding boundary | No alternate schema adapter is used, but shape substitution is accepted by helper. | Alternate/copy/forged proof must fail. | MISSING. |
| A-EXPORT | PUBLIC_EXPORT | `isRegistryResolutionBoundToRequest`, `RegistryEntry.acceptsSchema` | Public consumers can invoke the unsafe proof path. | Exported proof helpers must enforce the same authentication rule. | MISSING. |
| A-GUARD | ARCHITECTURE_GUARD | `tests/exec-001-ticket-002.test.ts` | Import guard exists; no direct exported-verifier forgery guard. | Required direct forgery witness must run. | MISSING provenance guard; not counted as import-guard omission. |
| A-TEST | TEST | T002 focused suite | Tests cover forged schema at entry creation and forged result copies, not forged schema at binding verification. | Direct forged/caller-injected verifier negative test. | MISSING. |

### Campaign B — productive source-provenance seam

`ROOT_CAUSE_CAMPAIGN_ID = RCC-EXEC-T002-PRODUCER-SEAM-001`

`ROOT_CAUSE_ID = RC-EXEC-T002-NONCONSUMABLE-SOURCE-ISSUER-001`

`CAMPAIGN_STATUS = OPEN`; `CAMPAIGN_SCOPE = EXEC-001-TICKET-002 integrated
boundary`; canonical finding `ARCH-MAJOR-001`.

| Surface row | Class | Location/owner | Current behavior | Expected behavior | Coverage |
|---|---|---|---|---|---|
| B-ISSUER | ISSUER | `src/application/exec-registry-ports.ts`; future DOM/REPO owners | Only module-private `issue` can mint receipts; only local fixture factories call it. | Authorized DOM/REPO producers need an owner-bound issuance/adapter path. | MISSING. |
| B-REGISTRAR | REGISTRAR | `RegisterExecCapability` / EXEC | Accepts only a source-issued receipt, but rejects every local fixture and no productive issuer exists. | Register against producer-owned current basis and publish through authorized owner boundary. | MISSING productive path; local negative covered. |
| B-CONSUMER | CONSUMER | `ResolveExecCapability.selectBasis` / `assertAuthorizedBasis` | Correctly checks source, receipt, kind, scope, revision and source string, but no productive source can pass. | Consume exact owner-issued DOM/REPO basis. | PARTIAL. |
| B-ALTERNATE | ALTERNATE_AUTHORITY_PATH | `createCatalogBasisFixture`, direct domain `CatalogBasis.createFixture` | Local fixture/domain path proves semantics but is intentionally nonproductive; application rejects it. | Fixture cannot become integrated authority; productive source must be distinct. | COVERED locally; integrated path missing. |
| B-INJECT | INJECTION_POINT | Port constructors and receipt transport | Caller-defined structural source and copied receipt fail; no legitimate owner source can be injected. | Caller cannot mint proof, while authorized owner can issue proof. | PARTIAL: negative covered, positive productive path missing. |
| B-MUTATE | MUTATION_PATH | `CatalogBasis.register`, `RegisterExecCapability` | Old basis is frozen; registration returns a new basis but does not publish it to an owner store. | Candidate/new basis must be published only by canonical owner at integrated boundary. | COVERED locally; publication outside scope and unproven. |
| B-STALE | STALE_PATH | `ResolveExecCapability.assertAuthorizedBasis` | Requested revision is compared to returned basis; local stale negative passes. | Producer-issued snapshot/revision must be independently bound and stale must fail. | PARTIAL; no productive producer. |
| B-PORT | PORT_SUBSTITUTION_PATH | `ExecutionCatalogBasisReader`, `NormalCatalogSource`, `AuthenticatedBootstrapCatalogSource` | Abstract port subclasses can be declared, but cannot issue accepted receipts through public API. | Approved alternate adapters must satisfy the same provenance contract. | MISSING productive adapter contract. |
| B-EXPORT | PUBLIC_EXPORT | `createLocal*CatalogFixture`, source classes, `createExecRegistry` | Fixtures are exported but visibly local-only and rejected; composition accepts optional ports. | Public integration seam must expose an owner-authorized productive path without fixture promotion. | PARTIAL. |
| B-GUARD | ARCHITECTURE_GUARD | Focused import/common-path guards | Guards prove dependency direction and fixture rejection, not a productive producer. | Integrated positive producer and forged/copy/stale negatives must run at integration gate. | COVERED for local guard; integrated guard missing at this HEAD. |
| B-TEST | TEST | T002 focused suite and evidence | 20 local tests pass; unavailable/fixture/unissued/copy/stale negatives are present. | Productive DOM and REPO positive consumption witnesses. | MISSING integrated witness; correctly not local closure-blocking. |

Campaign closure is not claimed. The matrix has direct negative witnesses for
local forgery/mutation paths, but the productive issuer, valid consumer,
alternate owner adapter and integrated positive witness remain absent.

## 13. Findings

### ARCH-CRITICAL-001 — Exported result-binding proof accepts forged schema identity

- **Severity:** `CRITICAL`
- **Ticket:** `EXEC-001-TICKET-002`
- **Normative authority:** Accepted authority-provenance contract
  `skills/_shared/authority-provenance-anti-forgery-contract.md` requires the
  consumer to verify provenance and reject caller injection; SPEC
  `EXEC-REGISTRY-001`/`EXEC-CAPABILITY-001`; SPEC-DOM identity authority; Design
  §7 and §16 require authenticated schema/provenance checks.
- **Owner:** EXEC-001 consumer-side result/registry binding boundary; schema
  identity itself remains owned by the EXEC contract boundary.
- **Affected boundary:** `src/domain/exec-registry.ts` methods
  `RegistryEntry.acceptsSchema` and `isRegistryResolutionBoundToRequest`, plus
  application use `ResolveExecCapability.resolve`.
- **Repository evidence:** `acceptsSchema` at `src/domain/exec-registry.ts`
  compares `schemaKey(this.inputSchema) === schemaKey(schema)` without
  `isAuthenticatedSchemaReference`. The exported binding verifier invokes this
  method at its request-binding check. A read-only adversarial probe passed a
  prototype-created object with `{schemaId: 'exec-input', version: '1.0.0'}` as
  `request.schema` against a valid branded result and observed
  `isRegistryResolutionBoundToRequest(...) === true`. The focused suite's
  `rejects direct basis injection, forged scope and forged schema authority`
  test proves entry construction rejects the forged schema, but no test invokes
  the exported result-binding verifier with that forged shape.
- **Problem:** A caller-controlled object with matching text can satisfy an
  exported authority-bearing proof even though it was not issued by the
  canonical `SchemaReference` constructor. The resolver's earlier request guard
  rejects this object during normal application resolution, but consumers are
  allowed to use the exported binding verifier directly, so the guard is not a
  complete consumer-side provenance boundary.
- **Impact:** Caller-supplied schema shape can replace canonical schema identity
  in a proof path. This violates the no-forgery/consumer-verification contract
  and leaves an alternate authority path for downstream consumers. It is an
  identity/provenance violation even though matching field values often make
  the immediate resolution outcome look equivalent.
- **Minimum correction required:** Make every authority-bearing schema
  comparison authenticate the reference (or route through an equivalent
  canonical verifier) before comparison; ensure the exported binding helper
  rejects forged/copy schema objects; add direct forged, caller-injected and
  alternate-adapter negative witnesses. Do not rely on the resolver's earlier
  guard as proof for independent consumers.
- **Systemic pattern:** `YES` — `RCC-EXEC-T002-SCHEMA-PROVENANCE-001`.
- **Related locations:** `src/domain/exec-contract.ts` schema brand and
  `isAuthenticatedSchemaReference`; `src/domain/exec-registry.ts` lines
  391–392, 454–456, 521–532, 632–650; `src/application/exec-registry.ts`
  result verification; `tests/exec-001-ticket-002.test.ts` forged-schema and
  result-binding tests.

### ARCH-MAJOR-001 — Declared DOM/REPO source ports have no constructible productive issuer

- **Severity:** `MAJOR`
- **Ticket:** `EXEC-001-TICKET-002`
- **Normative authority:** SPEC `EXEC-REGISTRY-004`, `EXEC-REGISTRY-002/003`,
  `EXEC-CAPABILITY-001/002`, AC-EXEC-019 and AC-EXEC-009; Design §§7, 16 and
  17; Plan PCP-DOM-EXEC-01/PCP-REPO-EXEC-01; shared authority-completeness
  `AUTHORITY_CONSUMPTION_PROOF` and `PRODUCER_CONSUMER_CONTRACT_PROOF` rules.
- **Owner:** EXEC-001 owns the consumer seam and its verification contract;
  DOM owns the execution identity/snapshot producer and REPO owns the enabled
  NORMAL catalog producer.
- **Affected boundary:** `src/application/exec-registry-ports.ts`,
  `src/application/exec-registry.ts`, `src/composition/exec-registry.ts`, and
  the future DOM/REPO adapter boundary.
- **Repository evidence:** `AUTHENTICATED_SOURCE_INSTANCES`,
  `ISSUED_RECEIPTS`, `SOURCE_KINDS` and `issue` are module-private in
  `exec-registry-ports.ts`. The only exported functions that add a source to
  those ledgers are `createLocalExecutionCatalogBasisFixture`,
  `createLocalBootstrapCatalogFixture` and `createLocalNormalCatalogFixture`.
  The application explicitly rejects `isLocalCatalogBasisFixture` for normal
  and bootstrap resolution/registration. No other producer or issuer exists
  in the target source tree. Focused tests confirm unavailable/untrusted
  sources become `CONTRACT_INVALID` and local fixtures are rejected before
  reads/registration.
- **Problem:** The declared ports cannot be productively implemented through
  the public boundary: legitimate DOM/REPO adapters cannot issue an accepted
  receipt, while the only available issuer is intentionally nonproductive.
  The private WeakMap protocol is therefore a hidden concrete integration
  mechanism rather than a consumable producer/consumer contract.
- **Impact:** Integrated resolution and productive registration cannot succeed
  at the target HEAD. The implementation fail-closes, which is correct for
  untrusted input, but it does not prove or provide productive consumption of
  the two integrated-only capabilities. Local fixture tests cannot promote
  `PRODUCTIVE_AVAILABILITY` and cannot close AC-EXEC-019's integrated portion.
  This is not a local execution blocker because the approved dependency class
  is `REQUIRED_FOR_INTEGRATED_PROOF`.
- **Minimum correction required:** Establish an approved owner-bound productive
  producer/issuer path (or an integrated adapter protocol) through which DOM and
  REPO can issue exact scope/basis/revision receipts, while retaining private
  provenance, source-kind separation, stale/detached/copy/forgery rejection and
  nonproductive fixture isolation. Add direct integrated positive and negative
  witnesses and the required availability promotion record; route productive
  availability through the owning cross-SPEC/Plan workflow rather than
  promoting it locally.
- **Systemic pattern:** `YES` — `RCC-EXEC-T002-PRODUCER-SEAM-001`.
- **Related locations:** `src/application/exec-registry-ports.ts` lines 42–138;
  `src/application/exec-registry.ts` source selection and registration lines
  54–193; `src/composition/exec-registry.ts`; focused tests for copied,
  untrusted, wrong-source, stale and local-fixture sources; DOM/REPO producer
  contracts in the Design and Plan.

## 14. Audit result metrics

- Ownership errors: `0`.
- Foreign capability duplication: `0`.
- Authority violations: `1` (forged schema proof path).
- Identity violations: `1` (schema-reference provenance accepted by the proof verifier).
- Immutability/lineage violations: `0` (local behavior conformant; integrated lineage partial but not falsely claimed).
- Legacy authority violations: `0`.
- Architectural authority gaps: `0` unresolved normative authority decisions; the findings are implementation/provenance and integrated-consumption defects, not missing ADR/SPEC authority.
- Authority consumption gaps: `2` integrated-only capabilities with `PRODUCTIVE_AVAILABILITY=NO` (`DOM-EXEC-IDENTITY-SNAPSHOT`, `REPO-EXEC-NORMAL-CATALOG`).
- Producer/consumer contract errors: `1` (declared producer/consumer seam is not productively consumable at the target).
- Temporal authority gaps: `0` for this no-effect immutable local operation.
- Caller-supplied authority bypasses: `1` (forged schema accepted by exported binding proof).
- Missing architecture guards: `0` for the approved import/common-path guard; the direct forged-schema witness is missing as a provenance test, not an import guard.
- Architecture guard tests run: `2`.
- Architecture classifications: local domain path `AUTHORIZED_ARCHITECTURAL_REALIZATION`; private fixture ledger `IMPLEMENTATION_DETAIL`; productive issuer seam `ARCHITECTURE_DECISION_REQUIRED`; public structural schema proof `UNAUTHORIZED_ARCHITECTURAL_EXPANSION`.

## 15. Specialist summary

Audit: `.pi/runtime/workflow-audits/dac96179-dd62-47f9-8c9d-901fc1dd3e76/architecture-EXEC-001-TICKET-002-architecture-boundaries-audit.md`

Specialist:
ARCHITECTURE_BOUNDARIES

Ticket: EXEC-001-TICKET-002

Ownership errors: 0

Foreign capability duplication: 0

Authority violations: 1

Identity violations: 1

Immutability/lineage violations: 0

Legacy authority violations: 0

Architectural authority gaps: 0
Authority consumption gaps: 2
Producer/consumer contract errors: 1
Temporal authority gaps: 0
Caller-supplied authority bypasses: 1
Missing architecture guards: 0
Architecture guard tests run: 2

Findings:
CRITICAL=1
MAJOR=1
MINOR=0
INFO=0

Domain audit complete:
YES

Specialist result:
SPECIALIST_ARCHITECTURE_FINDINGS

AUDIT_TARGET_HEAD: cc3fe3210eaebf8e0f577f7f5e1e48b97ed175bb
AUDIT_TARGET_STATE_FINGERPRINT: d9da64d8a9ae6a490737bc93789929e656559d2463d06916d4704439d2d20c22
AUDIT_WAVE_ID: dac96179-dd62-47f9-8c9d-901fc1dd3e76
DOMAIN_AUDIT_COMPLETE: YES
SPECIALIST_RESULT: SPECIALIST_ARCHITECTURE_FINDINGS