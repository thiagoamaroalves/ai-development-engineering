# Architecture Boundaries Audit — EXEC-001-TICKET-002

## Audit identity

```text
AUDIT_SKILL = audit-architecture-boundaries
SPECIALIST = ARCHITECTURE_BOUNDARIES
AUDIT_MODE = READ_ONLY INDEPENDENT ADVERSARIAL ARCHITECTURE_FIRST OWNERSHIP_PRESERVING AUTHORITY_PRESERVING CROSS_SPEC_AWARE IDENTITY_AWARE LEGACY_TRANSITION_AWARE
TICKET_ID = EXEC-001-TICKET-002
TICKET_PATH = docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-version-registry-catalogs-capabilities.md
IMPLEMENTATION_UNIT = EXEC-IMP-02
IMPLEMENTATION_DESIGN_PATH = docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-implementation-design.md
TICKET_SET_AUDIT_PATH = docs/tickets/SPEC-EXEC-001/implementation-ticket-audit.md
IMPLEMENTATION_BASELINE = 8f62b283b1dbf487911c7c459db95cadc25ff101
CURRENT_HEAD = 6dbff481eaf9bf21ac1aa7ae61f06a32f6dabfa8
CURRENT_HEAD_MATCHES_AUDIT_TARGET = YES
TICKET_STATUS_AT_TARGET = VALIDATION_REQUIRED
IMPLEMENTATION_STATUS = IMPLEMENTED; independent audit required
AUDIT_TARGET_STATE_FINGERPRINT = ef07d1b9a20b8529b47f6ace6430da84da76e05ec35d2cb0bdea678314fd481a
AUDIT_WAVE_ID = f9d5894f-5fd6-4ae4-9f40-a6989b38fd96
```

The supplied target fingerprint is retained exactly in the machine-readable
fields at the end of this artifact. The target worktree was clean during the
audit. The semantic implementation surface under audit is:

```text
src/domain/exec-registry.ts
src/application/exec-registry.ts
src/application/exec-registry-ports.ts
src/composition/exec-registry.ts
tests/exec-001-ticket-002.test.ts
tests/exec-registry-import-boundary-loader.mjs
tests/fixtures/exec-registry-forbidden-import.mjs
docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/*
```

The target checkpoint commit itself contains the round-7 remediation checkpoint,
remediation record, the deterministic-resolution evidence update, the domain
change, and the direct test update. No production code, tests, ticket state,
upstream authority, or Git state was changed by this audit.

## Authority precedence and reconstructed contract

The authority chain used was:

```text
ADR-0003 revision 3 ACCEPTED
  > SPEC-PORTFOLIO-001 O-017/O-020 and approved decomposition
  > SPEC-EXEC-001 revision 3 and its cited conformant component audit
  > validated Gap Matrix GAP-004/GAP-006/GAP-008/GAP-009/GAP-010/GAP-011
  > Implementation Plan EXEC-IMP-02 and its cited conformant plan audit
  > ticket and approved implementation design
  > repository implementation and tests
```

The accepted primary architectural source is
`docs/adrs/ADR-0003-versioned-skill-contracts.md`. Relevant component authority
is `docs/specs/SPEC-EXEC-001-skill-contracts-and-capability-registry.md`,
requirements `EXEC-VERSION-001/002`, `EXEC-REGISTRY-001/002/003`, and
`EXEC-CAPABILITY-001/002`, with acceptance criteria `AC-EXEC-003`,
`AC-EXEC-004`, `AC-EXEC-008`, `AC-EXEC-009`, `AC-EXEC-010`, `AC-EXEC-011`, and
`AC-EXEC-012`.

```text
LOCAL_OWNER = SPEC-EXEC-001 / EXEC-001
LOCAL_AUTHORITIES = semver meaning; explicit support sets; registry entry and
  frozen-basis resolution; NORMAL/BOOTSTRAP separation; bootstrap allowlist;
  UNKNOWN_CAPABILITY versus INCOMPATIBLE_CAPABILITY; common registry
  extensibility; local fail-closed registry outcomes
FOREIGN_OWNERS = SPEC-DOM-001 owns canonical RepositoryId and execution/snapshot
  basis; SPEC-REPO-001 owns enabled NORMAL catalog configuration and legacy
  compatibility; SPEC-PLAT-001 owns physical persistence, integrity, ordering,
  CAS and recovery
FOREIGN_CAPABILITIES_CONSUMED = DOM-EXEC-IDENTITY-SNAPSHOT and
  REPO-EXEC-NORMAL-CATALOG, both REQUIRED_FOR_INTEGRATED_PROOF
CANONICAL_IDENTITIES = NORMAL registry key is
  (CatalogScope=NORMAL, DOM RepositoryId, SkillContractId, CapabilityId,
  SchemaId, SemanticVersion); BOOTSTRAP omits RepositoryId and is system-scoped
IMMUTABILITY_RULES = CatalogBasis and RegistryEntry are immutable; registration
  returns a new basis; duplicate/conflict failure does not mutate the old basis
LINEAGE_RULES = CatalogRevision is distinct from SemanticVersion; physical and
  semantic reconstruction/continuity remain TICKET-003/PLAT scope
LEGACY_AUTHORITY_RULES = REPO remains legacy/configuration owner; no legacy
  registry writer is permitted in this ticket
CUTOVER_RULES = new semantic version or catalog basis for changed semantics;
  existing frozen bases are not rewritten; no silent alias/conversion
MIGRATION_AUTHORITY = REPO owns migration; EXEC only classifies MIGRATION as an
  allowed bootstrap category and does not implement migration
SECURITY_BOUNDARIES = no EXEC authentication/authorization obligation; backend
  and DOM own applicable security/lifecycle authorization
DOES_NOT_IMPLEMENT = DOM identity/lifecycle; REPO enablement/configuration or
  migration; sessions/scheduler; physical persistence/recovery/CAS; effects;
  transport/UI/OPS mappings
```

The implementation does preserve the local domain/application direction and
keeps DOM and REPO as named seams. It does not, however, provide a productive
owner-issued source path at the pinned target; local fixtures are deliberately
non-authoritative and rejected by the application authority path.

## Applicability matrix

| Dimension | Classification | Audit result and reason |
|---|---|---|
| OWNERSHIP | REQUIRED | Registry/version/catalog semantics are changed; DOM identity and REPO enablement must remain foreign. |
| CANONICAL_AUTHORITY | REQUIRED | The ticket creates the EXEC canonical registry decision and failure paths. |
| CROSS_SPEC_INTEGRATION | AFFECTED | DOM and REPO source ports are consumed, but their productive producers are integrated-only dependencies. |
| IDENTITY | REQUIRED | NORMAL identity includes a DOM-owned RepositoryId; scope is used in basis keys and source binding. |
| IMMUTABILITY | REQUIRED | Frozen bases and append-only local registration are the central behavior. |
| LINEAGE | AFFECTED | CatalogRevision progression is implemented locally; persistence/reconstruction and historical continuity are delegated to TICKET-003/PLAT. |
| LEGACY_TRANSITION | AFFECTED | This is a NEW_CANONICAL_PATH/CUTOVER boundary and REPO remains the LEGACY_COMPATIBILITY owner. |
| DESTRUCTIVE_TRANSITION | NOT_APPLICABLE | No deletion, destructive rewrite, irreversible retirement, or destructive migration is implemented. |
| MIGRATION_AUTHORITY | AFFECTED | Bootstrap permits the migration category, but no migration lifecycle or state is implemented; REPO remains owner. |
| SECURITY_AUTHORIZATION | NOT_APPLICABLE | SPEC-EXEC-001 §20 assigns no authentication/authorization obligation to EXEC-001 and this unit has no user/effect route. |

## Ownership and canonical authority audit

### Local ownership

The domain module owns the semantic version value, explicit support set,
scoped entry identity, immutable basis, bootstrap allowlist, deterministic
resolution, and canonical local outcome classification. The application module
selects a producer-bound source, checks source kind/scope/revision, and
orchestrates the domain resolver. The composition root only wires these
components. No DOM lifecycle, repository enablement, persistence, or external
effect logic was duplicated.

```text
OWNERSHIP_CLASSIFICATION = OWNERSHIP_PRESERVED
FOREIGN_CAPABILITY_DUPLICATED = 0
FOREIGN_LIFECYCLE_OWNERSHIP = 0
REPOSITORY_SEMANTIC_AUTHORITY = 0
```

### Canonical authority

The fixture path is explicitly separated from the authority path: local
fixtures produce frozen but unbranded results; `RegistryResolutionService.resolve`
requires a producer-bound proof; `ResolveExecCapability` rejects local fixture
sources. The normal and bootstrap sources are not treated as interchangeable.
This preserves the intended owner boundary locally, but productive authority
consumption is not proven because no non-fixture producer can issue the required
basis/proof at this target.

```text
LOCAL_AUTHORITY_CLASSIFICATION = AUTHORITY_PRESERVED
PRODUCTIVE_AUTHORITY_STATUS = INTEGRATION_NOT_PROVEN
DUAL_AUTHORITY = NOT_FOUND IN LOCAL IMPLEMENTATION
ALTERNATE_AUTHORITY_INTRODUCED = NOT_FOUND AS A SECOND OWNER
PROJECTION_USED_AS_AUTHORITY = NO
```

The absence of a productive producer is recorded as an integrated handoff gap,
not promoted to local productive availability. The target ticket/design records
both foreign capabilities as `AUTHORITY_STATUS=DEFINED`,
`CONTRACT_STATUS=DEFINED`, `PRODUCTIVE_AVAILABILITY=NO`, and
`DEPENDENCY_CLASS=REQUIRED_FOR_INTEGRATED_PROOF`; that classification does not
block this ticket's local closure, but it cannot be used as productive proof.

## Cross-spec authority consumption and provenance

### Capability records

| Capability | Owner / producer | Consumer | Authority / contract | Local testability | Productive availability | Class | Result |
|---|---|---|---|---|---|---|---|
| `DOM-EXEC-IDENTITY-SNAPSHOT` | DOM canonical resolver | TICKET-002 / EXEC registry boundary | DEFINED / DEFINED | NO | NO | REQUIRED_FOR_INTEGRATED_PROOF | `AUTHORITY_CONSUMPTION_GAP` for integrated proof; no local blocker |
| `REPO-EXEC-NORMAL-CATALOG` | enabled REPO configuration | TICKET-002 / EXEC registry boundary | DEFINED / DEFINED | NO | NO | REQUIRED_FOR_INTEGRATED_PROOF | `AUTHORITY_CONSUMPTION_GAP` for integrated proof; no local blocker |
| `UNIT-EXEC-REGISTRY-FIXTURE` | local test support | direct local tests only | DEFINED / DEFINED | YES | NO | INFORMATIONAL | `CONTRACT_TESTABLE_LOCALLY`; never productive authority |

The producer/consumer contract records are semantically defined and directionally
correct (`EXEC -> DOM`, `REPO -> EXEC`), so no separate producer/consumer
contract-shape error was counted. They do not contain productive runtime
availability evidence. The implementation's source port has only a no-argument
`read()` and a module-private receipt ledger. Its exported source factories are
all explicitly local fixture factories, and all are rejected by the productive
application path. This is the basis of `ARCH-MAJOR-001` below.

### Authority-proof records

| Proof field | DOM capability | REPO capability | Local fixture |
|---|---|---|---|
| `PROOF_ISSUER_OWNER` | SPEC-DOM-001 canonical resolver | SPEC-REPO-001 enabled configuration | EXEC test support |
| `PROOF_SCOPE` | exact DOM RepositoryId and execution/snapshot basis | authorized NORMAL catalog for that RepositoryId and frozen revision | local semantic behavior only |
| `PROOF_IDENTITY_OR_BRAND` | required DOM-issued identity/reference | required owner-issued repository/basis reference | fixture-controlled EXEC basis marker |
| `CONSUMER_VERIFICATION_RULE` | source kind, receipt membership, scope and revision are checked | source kind, receipt membership, scope and revision are checked | fixture output is deliberately not authenticated |
| `STALE_OR_MUTATION_POLICY` | reject stale/detached basis without mutation | reject stale/wrong-source basis without mutation | old fixture basis remains frozen |
| `FORGERY_NEGATIVE_TEST` | no productive witness; fixture/copy/forged object paths reject | no productive witness; fixture/copy/wrong-source paths reject | direct fixture/prototype/receipt forgery tests pass |
| `CALLER_INJECTION_NEGATIVE_TEST` | direct basis injection and forged scope-prototype tests pass; caller-created scope provenance is not rejected | caller-selected repository mismatch and copied receipt tests pass | fixture cannot enter productive resolver |
| `ALTERNATE_ADAPTER_CONTRACT_TEST` | no productive alternate adapter exists at target | no productive alternate adapter exists at target | copied/matching-source fixture adapters reject |

Required provenance interpretation:

```text
ISSUER_IS_AUTHORIZED = NO for DOM/REPO productive paths (no issuer exists at
  target); YES for local fixture support only
PROOF_SCOPE_IS_EXACT = NO for productive runtime witness; local contract scope
  is explicit but non-authoritative
CONSUMER_VERIFIES_PROVENANCE = NO for productive path; module receipt membership
  is checked only for available local fixture receipts
INPUT_OR_REFERENCE_BINDING = NO for productive path; source basis scope/revision
  are compared to caller-provided context rather than receiving a producer-bound
  identity selector
MUTATION_OR_STALE_REJECTION = YES for source receipt revision mismatch and
  immutable local bases
FORGERY_PATH_REJECTED = YES for tested fixture/copy/prototype paths
CALLER_INJECTION_REJECTED = NO at the productive identity boundary; a
  caller-created CatalogScope is a valid authenticated EXEC value and has no DOM
  issuer distinction
ALTERNATE_ADAPTER_CONTRACT = NOT_APPLICABLE for local scope, with reason that
  no productive alternate adapter exists at the target
```

### Aggregate identity proof

```text
AGGREGATE_ROOT = REGISTRY_ENTRY / CatalogBasis
CANONICAL_IDENTITY = NORMAL (CatalogScope=NORMAL, RepositoryId,
  SkillContractId, CapabilityId, input SchemaId/version, SemanticVersion);
  BOOTSTRAP (CatalogScope=BOOTSTRAP, SkillContractId, CapabilityId,
  input SchemaId/version, SemanticVersion)
IDENTITY_AUTHORITY_SOURCE = EXEC registry for local entry semantics;
  DOM DOM-ID-001 for NORMAL RepositoryId; system catalog for BOOTSTRAP
IDENTITY_KIND_OR_TYPE = REGISTRY_ENTRY plus immutable CatalogBasis
IDENTITY_SCOPE = NORMAL repository-scoped; BOOTSTRAP independent system-scoped
STABLE_CORRELATION_FIELDS = scope, RepositoryId when NORMAL, stage, capability,
  schema, semantic version, CatalogRevision and source
CREATION_RULE = complete entry and absent scoped key only; duplicate/conflict rejects
COMMAND_REPRESENTATION = registration/new CatalogRevision command
REPOSITORY_LOOKUP_REPRESENTATION = complete scoped key plus requested frozen revision
PERSISTED_REPRESENTATION = not implemented in TICKET-002; reserved for TICKET-003/PLAT
REHYDRATED_REPRESENTATION = not implemented in TICKET-002; reserved for TICKET-003/PLAT
EQUALITY_AND_CONTINUITY_SEMANTICS = immutable scoped identity; old basis remains
  unchanged and a successful registration returns a new basis
REVISION_RELATIONSHIP = SemanticVersion is distinct from CatalogRevision
ALIASES_LOCAL_IDS_DERIVED_IDS = labels, path, URL, branch and correlation are not identity
ALIAS_AUTHORITY_AND_FORBIDDEN_SUBSTITUTIONS = caller values and projections cannot
  replace producer-issued RepositoryId/basis; current scope boundary is incomplete
PROOF_EVIDENCE = SPEC-EXEC-001 §§12.1, 12.3, 13.2, 14, 21-22; design §§7, 8, 16;
  src/domain/exec-registry.ts:251-284, 445-519; src/application/exec-registry.ts:88-159
IDENTITY_RESULT = PARTIAL; local key preservation passes, productive DOM identity
  provenance is not proven
```

The implementation's `CatalogScope.normal(repositoryId)` and
`CatalogScope.create(...)` accept any caller string and place the resulting
object in the authenticated `CATALOG_SCOPE_INSTANCES` set. The application
input also exposes `scope: CatalogScope` and only checks that internal marker.
A direct audit probe at the pinned target produced:

```text
CatalogScope.normal('caller-chosen-repository')
=> isAuthenticatedCatalogScope = true
=> repositoryId = caller-chosen-repository
```

The existing forged-prototype test is not equivalent: it rejects an object that
was not made by the factory, but it does not reject a legitimately factory-made
caller value. This matters because the normative RepositoryId is DOM-owned, not
an arbitrary EXEC string. It is recorded as `ARCH-CRITICAL-001`.

### Reconstruction, immutability and lineage

```text
RECONSTRUCTION_CONTRACT = DELEGATED; no rehydrate path is introduced here
CAN_UNTRUSTED_OR_DETACHED_PERSISTED_MATERIAL_BE_MATERIALIZED_DIRECTLY_AS_VALID_DOMAIN_STATE? = NO productive path exists here
RECONSTRUCTION_VALIDATOR_OR_RESOLVER_OWNER = TICKET-003 / EXEC-001 semantic
  validator; PLAT owns physical material and recovery
CURRENT_STATE_EVIDENCE = frozen CatalogBasis with immutable entries and revision
INVALID_PERSISTENCE_BEHAVIOR = outside TICKET-002; required later fail-closed
STALE_STATE_BEHAVIOR = source revision mismatch fails closed in application
STATE_SKIP_REJECTION = not implemented in this ticket; later reconstruction scope
MUTATION_ON_FAILURE = NO for local register/resolve paths
IMMUTABILITY_RESULT = CONFORMANT for local in-process bases
LINEAGE_RESULT = PARTIAL by bounded scope; no local history rewrite was found,
  but no persistence/reconstruction/continuity proof is claimed
```

The local append-only behavior is supported by direct duplicate/conflict,
MAX_SAFE_INTEGER, old-basis identity, and no-mutation tests. Physical CAS,
restart, durable ordering, and historical reconstruction are not silently
claimed.

## Resolution and authority decision audit

### Deterministic mapping

Complete entry construction, exact support-set membership, source/scope/revision
checks, NORMAL/BOOTSTRAP isolation, and synthetic common-path registration are
implemented in the intended local owner. However, overlapping explicit support
sets are accepted. The resolver sorts candidates by semantic version and chooses
the lowest candidate that supports the requested version after trying exact
semantic-version equality (`src/domain/exec-registry.ts:715-724`). No ADR, SPEC,
Gap Matrix, Plan, or Design rule states whether overlapping sets must be
rejected, or whether lowest, highest, newest, or another candidate wins.

A direct audit probe built two entries supporting `1.5.0` and resolved:

```text
entry 1.0.0 supports 1.5.0
entry 2.0.0 supports 1.5.0
implementation result = 1.0.0
```

This is deterministic but not authority-complete: multiple semantically
different canonical entries are plausible under the accepted text. It is
`ARCH-MAJOR-002` and sets `ARCHITECTURAL_AUTHORITY_GAP_DISCOVERED = YES`.

### Canonical failure outcome

A malformed requested semantic version is caught at
`src/domain/exec-registry.ts:709-714` and mapped to
`INCOMPATIBLE_CAPABILITY`. The normative version contract distinguishes a
version outside an explicit supported set from malformed contract input;
`EXEC-VERSION-002`, SPEC §15, and the design failure flow require invalid
semver/contract material to fail closed rather than be treated as a known
incompatibility. This is a localized canonical outcome risk and is recorded as
`ARCH-MINOR-001`. The unsupported but well-formed `2.0.0` path correctly returns
`INCOMPATIBLE_CAPABILITY`.

## Legacy, cutover, destructive transitions and migration

```text
PRESERVE_LEGACY_READS = NOT_APPLICABLE to EXEC local registry; REPO owns legacy reads
RETIRE_LEGACY_WRITES = CONFORMANT within scope; no legacy registry writer exists
REMOVE_ALTERNATE_AUTHORITY = PARTIAL pending productive DOM/REPO source integration
ADD_COMPATIBILITY_MAPPING = REPO-owned and not implemented here
MIGRATE_EXISTING_STATE = NOT_APPLICABLE; no persisted state or migration operation
TRANSITION_RESULT = TRANSITION_PARTIAL for integrated authority, otherwise
  conformant NEW_CANONICAL_PATH/CUTOVER local behavior
```

Destructive-transition fields are all `NOT_APPLICABLE`: there is no destructive
replacement/removal operation, no irreversible cutover, no pre-transition gate,
and no rollback/roll-forward transition implemented by this ticket. The local
cutover is value publication of a new immutable basis, not destructive state
replacement.

Migration authority is preserved: the bootstrap category allowlist includes
`MIGRATION`, but no migration decision, enablement, state transition, or legacy
conversion is performed by EXEC-001.

## Authorization boundary

`SECURITY_AUTHORIZATION = NOT_APPLICABLE` under SPEC-EXEC-001 §20. The source
receipt checks are architecture/provenance checks, not user authorization.
There is no alternate effect or backend route in this unit. The implementation
correctly does not treat possession of a capability or a fixture result as
authorization to advance lifecycle or confirm an effect.

## Root-cause campaigns and systemic boundary expansion

### Campaign RCC-EXEC-T002-PRODUCER-PROVENANCE-001

```text
ROOT_CAUSE_CAMPAIGN_ID = RCC-EXEC-T002-PRODUCER-PROVENANCE-001
ROOT_CAUSE_ID = productive owner-issued basis/provenance path is absent and
  caller-created scope identity is not distinguished from DOM identity
CAMPAIGN_STATUS = OPEN
CAMPAIGN_SCOPE = EXEC-001-TICKET-002 integrated DOM/REPO registry boundary
CANONICAL_FINDINGS = ARCH-CRITICAL-001, ARCH-MAJOR-001
```

The affected-surface matrix is complete for this boundary:

| Surface row | Class | Location | Owner | Current behavior | Expected behavior | Coverage | Negative witness |
|---|---|---|---|---|---|---|---|
| RCCP-001 | ISSUER | `src/application/exec-registry-ports.ts:23-40` | DOM/REPO producers | only abstract ports; no productive issuer implementation | owner issues canonical basis and identity-bound receipt | MISSING | NW-PROD-001 |
| RCCP-002 | REGISTRAR | `src/domain/exec-registry.ts:489-503`; `src/application/exec-registry.ts:176-210` | EXEC registry owner plus source owner | new basis derives locally; no owner publication/producer issuance seam | registration produces an owner-authorized published basis | MISSING | NW-PROD-002 |
| RCCP-003 | CONSUMER | `src/application/exec-registry.ts:114-159`; domain `:667-675` | EXEC consumer | verifies private receipt ledger, but no productive receipt can be issued | verify issuer, exact scope, revision and source at productive execution point | MISSING | NW-PROD-003 |
| RCCP-004 | ALTERNATE_AUTHORITY_PATH | public `createProducerBoundCatalogBasisProof` and direct `RegistryResolutionService.resolve` | EXEC | direct domain path is callable once a producer-marked basis is obtained; no source revalidation | only authorized owner-bound proof path can authorize canonical resolution | MISSING | NW-PROD-004 |
| RCCP-005 | INJECTION_POINT | `ResolveExecCapabilityInput.scope` and `CatalogScope.normal` | EXEC/DOM boundary | caller can construct an internally authenticated scope with arbitrary RepositoryId | caller context is non-authoritative; DOM-issued identity must be independently verified | MISSING | NW-ID-001 |
| RCCP-006 | MUTATION_PATH | `CatalogBasis.register` | EXEC | old basis is immutable, but productive producer issuance is not re-established for a derived basis | new basis must be owner-issued/published or explicitly remain a non-authoritative candidate | MISSING | NW-PROD-002 |
| RCCP-007 | STALE_PATH | `src/application/exec-registry.ts:152-155` | EXEC/DOM/REPO | one read/revision comparison; no productive source/revalidation witness | stale/detached owner material fails closed at the real producer seam | MISSING | NW-PROD-003 |
| RCCP-008 | PORT_SUBSTITUTION_PATH | `src/application/exec-registry-ports.ts:126-139` | EXEC consumer | copied/matching fixture receipts are rejected; productive alternate adapters absent | all adapters satisfy the same owner-issued receipt contract | OUTSIDE_SCOPE with integrated route | NW-PORT-001 |
| RCCP-009 | PUBLIC_EXPORT | `CatalogScope.normal/create`; `createProducerBoundCatalogBasisProof`; `CatalogBasis.register` | EXEC domain | public factories/operations expose internal value/proof paths | public API must not make foreign identity/proof caller-mintable | MISSING | NW-ID-001/NW-PROD-004 |
| RCCP-010 | PERSISTENCE | no persistence in target | PLAT/TICKET-003 | intentionally outside scope | physical source/recovery supplies validated ordered material | OUTSIDE_SCOPE with owner route | NW-PLAT-001 |
| RCCP-011 | RETRY_RECOVERY | no retry/recovery operation | EXEC-002/PLAT | not implemented here | retry preserves original basis and owner validation | NOT_APPLICABLE locally | NW-RET-001 |
| RCCP-012 | ARCHITECTURE_GUARD | `tests/exec-001-ticket-002.test.ts:610-675` | EXEC | import guard and fixture rejection run; no productive issuer guard | executable producer/identity provenance guard at the real seam | MISSING | NW-GUARD-001 |
| RCCP-013 | TEST | `tests/exec-001-ticket-002.test.ts` | EXEC | 25 focused tests cover fixture forgery/copy/prototype paths | direct productive issuer and caller-created RepositoryId negative/positive witnesses | MISSING | NW-TEST-001 |

`NW-PROD-*` are not claimed as passing witnesses: the target has no productive
producer, so the required positive/negative integrated evidence is absent. The
existing local fixture and copied-receipt negatives remain useful contract
witnesses only.

```text
CAMPAIGN_MATRIX_COMPLETE = YES
ALL_SURFACE_ROWS_COVERED = NO; productive issuer/consumer rows remain missing
ALL_NEGATIVE_WITNESSES_PASS = NO; only fixture-level negatives are executable
NO_UNEXPLAINED_PUBLIC_AUTHORITY_PATH = NO
NO_HIDDEN_CONCRETE_PROTOCOL = YES
ROOT_CAUSE_REMOVED = NO
KNOWN_MANIFESTATIONS_CLOSED = NO
SYSTEMIC_TEST_EVIDENCE = PARTIAL; local fixture evidence only
```

### Campaign RCC-EXEC-T002-RESOLUTION-SELECTION-001

```text
ROOT_CAUSE_CAMPAIGN_ID = RCC-EXEC-T002-RESOLUTION-SELECTION-001
ROOT_CAUSE_ID = overlapping explicit support sets have no accepted precedence or
  rejection rule
CAMPAIGN_STATUS = OPEN
CAMPAIGN_SCOPE = EXEC-001-TICKET-002 local registry resolution
CANONICAL_FINDINGS = ARCH-MAJOR-002
```

| Surface row | Class | Location | Current behavior | Expected behavior | Coverage |
|---|---|---|---|---|---|
| RCCS-001 | ISSUER | `RegistryEntry.create` | accepts overlapping supported sets | issuer contract defines uniqueness/precedence | MISSING |
| RCCS-002 | REGISTRAR | `CatalogBasis` constructor/register | checks same-key duplicates only | registrar rejects ambiguous basis or records authorized precedence | MISSING |
| RCCS-003 | CONSUMER | `RegistryResolutionService.resolveInternal` | lowest sorted supporting entry wins | consumer applies normative rule, not convenience sort | MISSING |
| RCCS-004 | ALTERNATE_AUTHORITY_PATH | `resolveContractFixture` versus `resolve` | both share same unqualified overlap rule | all paths use the same accepted authority | MISSING |
| RCCS-005 | INJECTION_POINT | request semanticVersion | valid request can hit overlap | ambiguous request/basis fails closed or uses specified precedence | MISSING |
| RCCS-006 | MUTATION_PATH | `CatalogBasis.register` | can introduce an overlapping entry into a new basis | mutation validates ambiguity before publication | MISSING |
| RCCS-007 | STALE_PATH | frozen basis resolution | stale/old basis uses same unspecified tie rule | historical basis has deterministic, normatively defined result | MISSING |
| RCCS-008 | PORT_SUBSTITUTION_PATH | source basis ports | no productive source witness | producer cannot change canonical selection semantics | OUTSIDE_SCOPE with integrated route |
| RCCS-009 | PUBLIC_EXPORT | `SupportedVersionSet.create`, `CatalogBasis.register` | public values permit overlap | public contract enforces authorized basis semantics | MISSING |
| RCCS-010 | PERSISTENCE | TICKET-003/PLAT | no durable ambiguity validation | persisted basis rejects/records overlap semantics | OUTSIDE_SCOPE with owner route |
| RCCS-011 | RETRY_RECOVERY | not implemented | no historical replay witness | retry/replay keeps original authorized selection | OUTSIDE_SCOPE |
| RCCS-012 | ARCHITECTURE_GUARD | no overlap guard in test suite | import guards do not cover semantic ambiguity | executable overlap negative witness | MISSING |
| RCCS-013 | TEST | `tests/exec-001-ticket-002.test.ts` | exact-order tests only | overlapping support-set witness required | MISSING |

```text
CAMPAIGN_MATRIX_COMPLETE = YES
ALL_SURFACE_ROWS_COVERED = NO; overlap registration/selection rows remain missing
ALL_NEGATIVE_WITNESSES_PASS = NO; no overlap witness exists
NO_UNEXPLAINED_PUBLIC_AUTHORITY_PATH = NO
NO_HIDDEN_CONCRETE_PROTOCOL = YES
ROOT_CAUSE_REMOVED = NO
KNOWN_MANIFESTATIONS_CLOSED = NO
SYSTEMIC_TEST_EVIDENCE = MISSING for overlap behavior
```

### Direct witness inventory

```text
NW-ID-001 = audit probe showed CatalogScope.normal('caller-chosen-repository')
  isAuthenticatedCatalogScope=true; no test rejects caller-created legitimate scope
NW-PROD-001 = no productive DOM/REPO issuer implementation or issuance API at target
NW-PROD-002 = producer marker is private; only createFixture sets local=true and
  producer=false; register propagates only an existing marker
NW-PROD-003 = application rejects local fixture sources and no non-fixture source
  can enter the private receipt ledger at target
NW-PROD-004 = direct proof/resolver exports require a producer marker, but no
  productive route can obtain or renew that proof
NW-PORT-001 = copied receipt, forged shape, matching-source, wrong-source and
  fixture-substitution tests pass as local negatives
NW-GUARD-001 = import/dependency guard passed but no productive identity issuer
  guard exists
NW-TEST-001 = focused test suite has 25 passing tests; productive positive proof
  remains absent
NW-SEL-001 = audit probe with two entries supporting 1.5.0 returned 1.0.0;
  no normative overlap rule or negative witness exists
NW-OUTCOME-001 = malformed requested semver follows the incompatible branch at
  `resolveInternal:709-714`; no direct malformed-semver outcome assertion exists
```

## Architecture guard execution

```text
ARCHITECTURE_GUARD_TESTS_RUN = 3
ARCHITECTURE_GUARD_TEST_NAMES =
  productive registry graph has no infrastructure, prototype, transport or
    generic bucket dependency;
  exec registry architecture boundary loader rejects forbidden dependency
    introduction;
  exec registry architecture guard imports the real graph and exercises the
    common path
ARCHITECTURE_GUARD_EVIDENCE = focused TICKET-002 suite 25/25; full package
  suite 73/73; loader guard executed and rejected the forbidden fixture; typecheck
  PASS; verify:audit-governance PASS; verify:skill-mirror PASS
MISSING_ARCHITECTURE_GUARDS = 1
MISSING_GUARD_REASON = no executable guard exercises a real producer-issued
  RepositoryId/basis, caller-created identity rejection, or productive
  producer receipt path; fixture-only negative coverage cannot close it
```

The import/dependency architecture guard is valid and passed. It does not prove
ownership, issuer provenance, productive availability, or cross-spec runtime
consumption.

## Findings

### ARCH-CRITICAL-001 — Caller-mintable NORMAL identity is accepted as an authenticated scope

```text
Severity = CRITICAL
Ticket = EXEC-001-TICKET-002
Normative authority = ADR-0003 Decisão; SPEC-EXEC-001 §§12.1, 12.3,
  EXEC-REGISTRY-004, AC-EXEC-019; authority-provenance contract
Owner = SPEC-DOM-001 for RepositoryId issuer; SPEC-EXEC-001 for consumer
Affected boundary = DOM canonical RepositoryId -> EXEC NORMAL CatalogScope and
  registry key/source binding
Repository evidence = src/domain/exec-registry.ts:251-275 publicly constructs
  CatalogScope.normal/create from arbitrary caller data and marks it in the
  authenticated CATALOG_SCOPE_INSTANCES set; src/application/exec-registry.ts:32-39
  accepts scope from the caller and :88-99/:114-150 treats that object as the
  requested canonical scope; no DOM-issued identity brand/reference is checked
Problem = DOM-owned RepositoryId is represented as a plain string inside an
  EXEC-created, caller-callable value. A caller-created scope is indistinguishable
  from a DOM-issued scope. The existing forged-prototype witness rejects only an
  unbranded object, not a legitimately factory-created caller value.
Impact = A caller can establish or assert the repository identity used to bind
  NORMAL catalog material without an independent DOM issuer proof. This breaks
  canonical identity/provenance at the cross-spec boundary and can enable
  cross-repository authority substitution when a producer path is added or a
  direct domain path is used.
Minimum correction required = Make the productive NORMAL scope/reference
  producer-issued by DOM (or independently verify a DOM-issued identity at the
  consumer), keep caller scope only as non-authoritative context, and add direct
  executable forged/caller-created RepositoryId witnesses. Do not promote the
  current string/factory brand as DOM authority.
Systemic pattern = YES
Related locations = src/domain/exec-registry.ts:251-284, 445-519;
  src/application/exec-registry.ts:32-39, 88-159;
  src/application/exec-registry-ports.ts:15-40, 126-139;
  tests/exec-001-ticket-002.test.ts:400-469, 489-523
Root-cause campaign = RCC-EXEC-T002-PRODUCER-PROVENANCE-001
```

### ARCH-MAJOR-001 — No productive owner-issued basis/receipt path exists

```text
Severity = MAJOR
Ticket = EXEC-001-TICKET-002
Normative authority = SPEC-EXEC-001 §§12.1, 12.4, 13
  EXEC-REGISTRY-001/004, AC-EXEC-008/009/011/012; ticket §§14a-14b;
  PCP-DOM-EXEC-01 and PCP-REPO-EXEC-01; authority-completeness gates
Owner = DOM/REPO producer owners for foreign material; EXEC-001 consumer
Affected boundary = productive DOM/REPO source -> EXEC resolver/registrar
Repository evidence = src/domain/exec-registry.ts:92, 445-486, 526-534;
  PRODUCER_CATALOG_BASIS_INSTANCES is module-private, createFixture always
  creates localFixture=true and producerIssued=false, and the only exported
  proof factory accepts only a basis carrying the unreachable producer marker.
  src/application/exec-registry-ports.ts:57-106 exports only local fixture
  source factories. src/application/exec-registry.ts:108-111 and :191-197
  reject local/unissued sources. No productive producer implementation or
  non-fixture issuance API exists at the target.
Problem = The canonical resolver requires an owner-bound basis/proof, but the
  implementation contains no productive path by which DOM or REPO can issue
  that basis/receipt. Local fixtures are correctly non-authoritative, so the
  only executable witnesses are explicitly unable to prove productive
  consumption.
Impact = Productive registry resolution, normal catalog consumption and
  owner-issued integrated provenance cannot be exercised. The ticket's
  integrated-only dependency classification remains accurate, but the
  implementation cannot be treated as an integrated canonical seam or as
  `PRODUCTIVE_AVAILABILITY=YES`.
Minimum correction required = At the approved DOM/REPO integration checkpoint,
  provide a real owner-issued source/receipt path with exact identity, source,
  scope, revision, stale/mutation, forged/caller-injection and alternate-adapter
  witnesses. Keep fixtures non-authoritative and record a productive-availability
  promotion only with new integrated evidence.
Systemic pattern = YES
Related locations = src/domain/exec-registry.ts:92, 445-535, 654-687;
  src/application/exec-registry-ports.ts:15-139;
  src/application/exec-registry.ts:78-159, 176-210;
  tests/exec-001-ticket-002.test.ts:432-450, 503-608
Root-cause campaign = RCC-EXEC-T002-PRODUCER-PROVENANCE-001
```

This finding is integrated-proof-only under the approved dependency class; it
does not convert the explicit local closure classification into a local blocker.
It does prevent an architecture pass that claims productive cross-spec
consumption.

### ARCH-MAJOR-002 — Overlapping supported-version sets lack canonical selection authority

```text
Severity = MAJOR
Ticket = EXEC-001-TICKET-002
Normative authority = ADR-0003 Decisão; SPEC-EXEC-001 §§13
  EXEC-VERSION-002, EXEC-REGISTRY-001, EXEC-CAPABILITY-001;
  AC-EXEC-008/011; design §§9, 20
Owner = SPEC-EXEC-001
Affected boundary = RegistryEntry supported-set registration -> frozen-basis
  resolution
Repository evidence = src/domain/exec-registry.ts:489-503 permits a new entry
  whenever the complete identity differs, without rejecting overlapping
  supported sets; :715-724 sorts candidates by semantic version and silently
  selects the lowest candidate supporting the request. Audit probe with entries
  1.0.0 and 2.0.0 both supporting 1.5.0 returned 1.0.0.
Problem = The accepted authority requires deterministic resolution but does not
  define whether overlap is invalid or whether lowest/highest/newest/other
  precedence is canonical. The implementation chooses a domain-observable
  outcome by convenience rather than an authorized rule.
Impact = Two valid frozen bases with the same requested capability/version can
  resolve to semantically different entries under equally plausible
  implementations; historical and integrated consumers cannot reconstruct the
  intended canonical mapping from authority alone.
Minimum correction required = Freeze an authority rule: reject overlapping
  support sets, or define and test an explicit precedence/identity rule. Add
  direct overlap positive/negative witnesses before treating the selection path
  as canonical.
Systemic pattern = NO
Related locations = src/domain/exec-registry.ts:178-216, 296-422, 489-518,
  690-737; tests/exec-001-ticket-002.test.ts:178-245
Root-cause campaign = RCC-EXEC-T002-RESOLUTION-SELECTION-001
```

### ARCH-MINOR-001 — Malformed requested semver is classified as incompatibility

```text
Severity = MINOR
Ticket = EXEC-001-TICKET-002
Normative authority = SPEC-EXEC-001 EXEC-VERSION-002 and §15; ticket §14b;
  design §18 failure flow
Owner = SPEC-EXEC-001
Affected boundary = resolution request validation -> canonical capability failure
Repository evidence = src/domain/exec-registry.ts:709-714 catches SemanticVersion.parse
  failure and returns INCOMPATIBLE_CAPABILITY. A well-formed unsupported version
  correctly takes the same code, but malformed version input is invalid contract
  material rather than a known incompatible version.
Problem = The failure taxonomy collapses malformed version input with a valid
  version outside the explicit supported set.
Impact = Consumers cannot distinguish invalid request/contract material from a
  legitimate incompatibility; mappings and retry policy can apply the wrong
  canonical meaning.
Minimum correction required = Return CONTRACT_INVALID for malformed semver and
  add a direct malformed-semver negative witness while retaining
  INCOMPATIBLE_CAPABILITY for well-formed unsupported versions.
Systemic pattern = NO
Related locations = src/domain/exec-registry.ts:125-138, 709-724;
  tests/exec-001-ticket-002.test.ts:136-177
```

## Dimension results

```text
OWNERSHIP = OWNERSHIP_PRESERVED
CANONICAL_AUTHORITY = PARTIAL: local owner path is preserved; productive issuer
  consumption is not proven and caller-created scope identity is not DOM-bound
CROSS_SPEC_INTEGRATION = INTEGRATION_NOT_PROVEN
IDENTITY = VIOLATED at the NORMAL caller-scope provenance boundary; local key
  formation and fixture isolation otherwise preserve the tuple
IMMUTABILITY = CONFORMANT locally
LINEAGE = PARTIAL by bounded scope; physical/reconstruction proof delegated
LEGACY_TRANSITION = TRANSITION_PARTIAL pending productive source/cutover proof;
  no local legacy writer or dual catalog writer found
DESTRUCTIVE_TRANSITION = NOT_APPLICABLE
MIGRATION_AUTHORITY = MIGRATION_AUTHORITY_PRESERVED
SECURITY_AUTHORIZATION = NOT_APPLICABLE
ARCHITECTURAL_SCOPE = ARCHITECTURE_DECISION_REQUIRED for overlapping support-set
  selection; other local structures are AUTHORIZED_ARCHITECTURAL_REALIZATION
ARCHITECTURAL_AUTHORITY_GAP_DISCOVERED = YES
CALLER_AS_AUTHORITY_CHECK = CALLER_SUPPLIED_AUTHORITY_BYPASS for NORMAL scope
TEMPORAL_AUTHORITY_PROOF = NOT_APPLICABLE for immutable local basis/no external effect;
  productive source temporal proof remains unproven
```

## Executed evidence

```text
node --experimental-strip-types --test tests/exec-001-ticket-002.test.ts
  = 25 passed, 0 failed, 0 skipped
npm test
  = 73 passed, 0 failed, 0 skipped
npm run typecheck
  = PASS
npm run verify:audit-governance
  = PASS
npm run verify:skill-mirror
  = PASS
```

The passing suites prove local fixture semantics, immutable value behavior,
fail-closed fixture/source substitution, import/dependency boundaries, and
negative authority tests that were actually executable. They do not prove
productive DOM/REPO availability, owner-issued identity provenance, physical
persistence, reconstruction, or CAS.

## Specialist summary

Audit: `.pi/runtime/workflow-audits/f9d5894f-5fd6-4ae4-9f40-a6989b38fd96/architecture-EXEC-001-TICKET-002-architecture-boundaries-audit.md`

Specialist:
ARCHITECTURE_BOUNDARIES

Ticket: EXEC-001-TICKET-002

Ownership errors: 0

Foreign capability duplication: 0

Authority violations: 1

Identity violations: 1

Immutability/lineage violations: 0

Legacy authority violations: 0

Architectural authority gaps: 1
Authority consumption gaps: 2
Producer/consumer contract errors: 0
Temporal authority gaps: 0
Caller-supplied authority bypasses: 1
Missing architecture guards: 1
Architecture guard tests run: 3

Findings:
CRITICAL=1
MAJOR=2
MINOR=1
INFO=0

Domain audit complete:
YES

Specialist result:
SPECIALIST_ARCHITECTURE_FINDINGS

AUDIT_TARGET_HEAD: 6dbff481eaf9bf21ac1aa7ae61f06a32f6dabfa8
AUDIT_TARGET_STATE_FINGERPRINT: ef07d1b9a20b8529b47f6ace6430da84da76e05ec35d2cb0bdea678314fd481a
AUDIT_WAVE_ID: f9d5894f-5fd6-4ae4-9f40-a6989b38fd96
DOMAIN_AUDIT_COMPLETE: YES
SPECIALIST_RESULT: SPECIALIST_ARCHITECTURE_FINDINGS