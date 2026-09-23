# EXEC-001-TICKET-002 — Architecture Boundaries Audit

## 1. Audit identity and preflight

```text
AUDIT_SKILL = audit-architecture-boundaries
AUDIT_MODE = READ_ONLY INDEPENDENT ADVERSARIAL ARCHITECTURE_FIRST
TICKET_ID = EXEC-001-TICKET-002
TICKET_PATH = docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-version-registry-catalogs-capabilities.md
IMPLEMENTATION_UNIT = EXEC-IMP-02 — Version, registry resolution, catalogs and capability extensibility
IMPLEMENTATION_DESIGN_PATH = docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-implementation-design.md
TICKET_SET_AUDIT_PATH = docs/tickets/SPEC-EXEC-001/implementation-ticket-audit.md
TICKET_STATUS_AT_AUDIT = VALIDATION_REQUIRED
IMPLEMENTATION_STATUS = IMPLEMENTED
IMPLEMENTATION_BASELINE = 3905726b592fad1eadf155f797bf0289be7bec43
CURRENT_HEAD = 36ac11c08d6e7b9416e41662646c2686fcfef677
AUDIT_TARGET_HEAD = 36ac11c08d6e7b9416e41662646c2686fcfef677
AUDIT_TARGET_STATE_FINGERPRINT = 191ca7c9d2f15f71bc48ee2e17059438ed01efba281c261ad329e41532be6714
TARGET_HEAD_VERIFIED = YES
TARGET_STATE_STABLE_DURING_AUDIT = YES
TARGET_OVERLAY = No production/test overlay; unrelated documentary, skill and tool working-tree dirtiness is outside the supplied semantic fingerprint
```

The target commit is the remediation checkpoint. The implementation and direct
registry tests are present at the pinned target. The target pair remained stable
through the focused test, full test, typecheck, governance-guard, and skill-mirror
runs.

### Target changed files

The pinned checkpoint changed these implementation, test, evidence and workflow
support files:

```text
docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-checkpoints/EXEC-001-TICKET-002-remediation-checkpoint-round-1.md
docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-implementation-remediation.md
docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/AC-EXEC-003-semver.md
docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/AC-EXEC-005-registry-contribution.md
docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/AC-EXEC-007-registry-contribution.md
docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/AC-EXEC-008-deterministic-resolution.md
docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/AC-EXEC-009-catalog-isolation.md
docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/AC-EXEC-010-bootstrap-allowlist.md
docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/AC-EXEC-011-failure-distinction.md
docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/AC-EXEC-012-registry-extensibility.md
package.json
src/application/exec-registry-ports.ts
src/application/exec-registry.ts
src/domain/exec-contract.ts
src/domain/exec-registry.ts
tests/exec-001-ticket-002.test.ts
tsconfig.json
```

### Executed evidence

```text
node --experimental-strip-types --test tests/exec-001-ticket-002.test.ts = 12 passed, 0 failed
npm test = 60 passed, 0 failed
npm run typecheck = PASS
npm run verify:audit-governance = PASS
npm run verify:skill-mirror = PASS
```

The focused test contains one executable import/dependency architecture guard
at `tests/exec-001-ticket-002.test.ts:295-310`. It does not exercise issuer
provenance, caller-selected repository identity, caller-selected support sets,
or alternate registration authority.

## 2. Authority precedence and reconstructed architectural contract

Authority was reconstructed before implementation assessment using:

```text
Accepted ADR
→ Canonical component SPEC
→ Explicit cross-SPEC ownership contracts
→ Validated Gap Matrix
→ Implementation Plan
→ Ticket and approved Implementation Design
→ Repository implementation and tests as behavioral evidence
```

### Authority sources

| Source | Relevant authority |
|---|---|
| `docs/adrs/ADR-0003-versioned-skill-contracts.md`, revision 3, `ACCEPTED` | Semver semantics, explicit supported versions, exact frozen basis, explicit registry, independent NORMAL/BOOTSTRAP catalogs, bootstrap allowlist, and non-authority of text. |
| `docs/specs/SPEC-EXEC-001-skill-contracts-and-capability-registry.md`, revision 3 | EXEC-001 ownership, canonical registry identity, reconstruction contract, canonical outcomes, cross-SPEC limits, and requirements `EXEC-VERSION-001/002`, `EXEC-REGISTRY-001/002/003`, `EXEC-CAPABILITY-001/002`. |
| `docs/specs/SPEC-EXEC-001-skill-contracts-and-capability-registry.md:227-373` | NORMAL identity includes DOM-owned `RepositoryId`; BOOTSTRAP is an independent system catalog; source, digest, revision, attachment and continuity cannot be replaced by caller or detached material. |
| `docs/specs/SPEC-EXEC-001-skill-contracts-and-capability-registry.md:428-477` | Registry requirements: explicit deterministic mapping, independent catalogs, and bootstrap rejection before normal work. |
| `docs/specs/gap-matrices/SPEC-EXEC-001-implementation-gap-matrix.md` | Validated gaps `GAP-004`, `GAP-006`, `GAP-008`, `GAP-009`, `GAP-010`, `GAP-011`; EXEC is canonical owner, DOM identity and REPO configuration remain foreign. |
| `docs/specs/implementation-plans/SPEC-EXEC-001-implementation-plan.md`, `EXEC-IMP-02` | Local semantic registry work; DOM/REPO producers are `REQUIRED_FOR_INTEGRATED_PROOF`; no local foreign lifecycle or enablement ownership. |
| `docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-implementation-design.md:127-179` | Required authority consumption/provenance records, caller-as-authority check, and integrated-only DOM/REPO availability. |
| `docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-implementation-design.md:353-377` | DOM and REPO ACLs, consumer-side provenance verification, stale rejection, forged/caller negative tests, and alternate-adapter contract tests. |

### Reconstructed boundary contract

```text
LOCAL_OWNER = SPEC-EXEC-001 / EXEC-001
LOCAL_AUTHORITIES = semver meaning; explicit support sets; REGISTRY_ENTRY mapping;
                    deterministic frozen-basis resolution; NORMAL/BOOTSTRAP separation;
                    bootstrap allowlist; UNKNOWN_CAPABILITY and
                    INCOMPATIBLE_CAPABILITY outcomes; common registry extensibility
FOREIGN_OWNERS = SPEC-DOM-001 for RepositoryId, execution identity, snapshot and lifecycle;
                SPEC-REPO-001 for enabled NORMAL catalog/configuration;
                SPEC-PLAT-001 for physical persistence, integrity, ordering, CAS and recovery
FOREIGN_CAPABILITIES_CONSUMED = DOM-EXEC-IDENTITY-SNAPSHOT;
                                REPO-EXEC-NORMAL-CATALOG
CANONICAL_IDENTITIES = NORMAL:
  (CatalogScope=NORMAL, DOM RepositoryId, SkillContractId, CapabilityId, SchemaId, SemanticVersion)
  BOOTSTRAP:
  (CatalogScope=BOOTSTRAP, SkillContractId, CapabilityId, SchemaId, SemanticVersion)
IMMUTABILITY_RULES = entry key and frozen catalog basis are append-only; registration returns a new basis;
                     duplicate/conflicting registration and resolution failure do not mutate prior basis
LINEAGE_RULES = CatalogRevision is distinct from semantic version; source/revision/basis continuity
                cannot be reinterpreted across repository or catalog scope; physical reconstruction is TICKET-003/PLAT
LEGACY_AUTHORITY_RULES = REPO remains legacy/configuration consumer; no legacy registry writer or silent conversion
CUTOVER_RULES = NEW_CANONICAL_PATH and CUTOVER use a new semantic version/catalog basis; existing frozen basis is retained
MIGRATION_AUTHORITY = no migration operation is implemented here; MIGRATION is only an allowlisted bootstrap category
SECURITY_BOUNDARIES = backend/consumer must not elevate capability possession into authority; source issuer,
                     scope, repository binding and basis provenance must be verified by EXEC consumer
DOES_NOT_IMPLEMENT = DOM identity/lifecycle; REPO enablement/discovery/migration; PLAT persistence/recovery;
                     session/scheduler/effects/transport/UI/OPS mappings
```

The implementation preserves the local semver, entry, immutable-basis and
canonical-outcome concepts, but does not preserve the required issuer and
caller-authority boundary at the application source seams.

## 3. Applicability matrix

| Dimension | Classification | Reason and audit result |
|---|---|---|
| OWNERSHIP | REQUIRED | Registry semantics are EXEC-owned, while DOM identity and REPO configuration must remain foreign. A bootstrap source-owner inversion and unverified source identity are present. |
| CANONICAL_AUTHORITY | REQUIRED | This ticket creates a registry authority. Public source strings, caller scope, caller support sets and unrestricted registration create alternate authority paths. |
| CROSS_SPEC_INTEGRATION | AFFECTED | DOM and REPO contracts are declared integrated-only, but their consumer ports do not carry independently verifiable issuer provenance and the DOM port is used as a bootstrap catalog source. |
| IDENTITY | REQUIRED | NORMAL lookup depends on DOM-owned `RepositoryId`; the implementation accepts a raw caller-created `CatalogScope.normal(repositoryId)`. |
| IMMUTABILITY | REQUIRED | `CatalogBasis` and entries are frozen and registration returns a new value. No local history mutation was found. |
| LINEAGE | AFFECTED | Local `CatalogRevision` increments on new bases, but source identity and productive revision/digest continuity are not proven; physical reconstruction is explicitly downstream. |
| LEGACY_TRANSITION | AFFECTED | The ticket declares `NEW_CANONICAL_PATH`, `CUTOVER`, and REPO legacy compatibility. No legacy writer was found, but the new source authority is not fully established. |
| DESTRUCTIVE_TRANSITION | NOT_APPLICABLE | No delete, replacement-in-place, irreversible cutover, migration write, or destructive state transition is implemented in this ticket. |
| MIGRATION_AUTHORITY | NOT_APPLICABLE | The implementation does not execute migration or own migration state; `MIGRATION` is only one bootstrap allowlist category. |
| SECURITY_AUTHORIZATION | AFFECTED | This is not an actor-authentication implementation, but capability source, scope and bootstrap authority are authorization-sensitive boundaries and are not independently verified. |

## 4. Ownership and canonical authority audit

### Ownership

The domain does not duplicate DOM lifecycle, REPO enablement, PLAT persistence,
scheduler, effects or transport behavior. The import guard and source inspection
show no infrastructure, prototype, transport or generic-bucket dependency in the
new registry graph. Therefore:

```text
FOREIGN_CAPABILITY_DUPLICATED = 0
FOREIGN_LIFECYCLE_DUPLICATED = 0
DOMAIN_RULE_DUPLICATION = 0
```

However, `ResolveExecCapability.selectBasis` (`src/application/exec-registry.ts:54-80`)
uses a caller-supplied `CatalogScope` and its raw `repositoryId` to select the
REPO source, and the BOOTSTRAP branch (`:64-70`) requires a source named
`DOM_EXECUTION_BASIS`. DOM owns identity/snapshot material, not the independent
bootstrap catalog. This creates ownership leakage at the source boundary:

```text
OWNERSHIP = OWNERSHIP_LEAKAGE
OWNERSHIP_ERRORS = 1
```

### Canonical authority

The domain's value objects, explicit membership, immutable basis publication,
allowlist and result code classification are locally placed. The application
also rejects an input property named `basis` (`:58-60`) and checks runtime
instance membership. Those are useful local integrity checks, but they are not
issuer provenance.

The following paths remain alternate authority routes:

* `CatalogScope.normal` publicly authenticates any caller-provided string as a
  NORMAL repository identity (`src/domain/exec-registry.ts:210-232`).
* `ResolveExecCapability` passes that caller-selected identifier to
  `NormalCatalogSource.read` (`src/application/exec-registry.ts:61-79`).
* `RegistryResolutionRequest.supportedVersions` is caller-provided and is used
  by `VersionCompatibilityPolicy.resolve` (`src/domain/exec-registry.ts:456-489`,
  `:518`), although the supported set is canonical compatibility authority.
* `CatalogBasis.create` accepts any public `source` string (`:419-429`), while
  `assertAuthorizedBasis` treats the matching strings
  `DOM_EXECUTION_BASIS`/`REPO_NORMAL_CATALOG` as issuer proof
  (`src/application/exec-registry.ts:83-92`). A caller or alternate adapter can
  construct a genuine `CatalogBasis` with either expected string.
* `RegisterExecCapability.register` accepts an arbitrary caller-provided basis
  and entry (`src/application/exec-registry.ts:101-104`), so a new canonical-
  looking basis can be created without an authorized producer route.

This is not a second implementation of foreign behavior; it is a competing
input authority and an unproven source-authority seam:

```text
AUTHORITY = ALTERNATE_AUTHORITY_INTRODUCED
REPOSITORY_SEMANTIC_AUTHORITY = NO
CALLER_AS_AUTHORITY_CHECK = FAIL
CALLER_SUPPLIED_AUTHORITY_BYPASSES = 3
```

## 5. Cross-SPEC integration and authority consumption

### Capability records

| Capability | Authority / producer contract | Consumer implementation | Four-dimensional status | Result |
|---|---|---|---|---|
| `DOM-EXEC-IDENTITY-SNAPSHOT` | `SPEC-DOM-001`; canonical DOM resolver; exact RepositoryId/execution snapshot basis/revisions; forged, stale, detached and mismatched material must fail closed. | `ExecutionCatalogBasisReader.read(): CatalogBasis` (`src/application/exec-registry-ports.ts:7-13`), used only for BOOTSTRAP selection (`src/application/exec-registry.ts:64-70`). No issuer brand, exact DOM identity record, snapshot revision or digest is transported. | `AUTHORITY_STATUS=DEFINED`; `CONTRACT_STATUS=DEFINED`; `LOCAL_TESTABILITY=NO`; `PRODUCTIVE_AVAILABILITY=NO`; `DEPENDENCY_CLASS=REQUIRED_FOR_INTEGRATED_PROOF`. | `AUTHORITY_CONSUMPTION_GAP`; `INTEGRATION_NOT_PROVEN`. |
| `REPO-EXEC-NORMAL-CATALOG` | `SPEC-REPO-001`; enabled REPO configuration; repository-scoped NORMAL material and basis; producer-issued repository/basis reference and stale/detached rejection required. | `NormalCatalogSource.read(repositoryId: string): CatalogBasis` (`src/application/exec-registry-ports.ts:15-20`), with caller-selected `repositoryId` (`src/application/exec-registry.ts:72-79`). No producer brand, source proof, revision/digest or independent DOM binding is transported. | `AUTHORITY_STATUS=DEFINED`; `CONTRACT_STATUS=DEFINED`; `LOCAL_TESTABILITY=NO`; `PRODUCTIVE_AVAILABILITY=NO`; `DEPENDENCY_CLASS=REQUIRED_FOR_INTEGRATED_PROOF`. | `AUTHORITY_CONSUMPTION_GAP`; `INTEGRATION_NOT_PROVEN`. |
| `UNIT-EXEC-REGISTRY-FIXTURE` | Local contract fixture only; it may prove deterministic domain behavior, not productive authority. | Tests construct public `CatalogScope`, `CatalogBasis` and source strings directly (`tests/exec-001-ticket-002.test.ts:120-230`, `:279-293`). | `AUTHORITY_STATUS=DEFINED`; `CONTRACT_STATUS=DEFINED`; `LOCAL_TESTABILITY=YES`; `PRODUCTIVE_AVAILABILITY=NO`; `DEPENDENCY_CLASS=INFORMATIONAL`; derived summary `CONTRACT_TESTABLE_LOCALLY`. | Local semantic tests pass; fixture is not a productive producer and cannot close the two external gaps. |

The external authority contracts exist normatively, but the implementation does
not make them consumable. The absence of productive DOM/REPO producers is not a
local closure blocker because both dependencies are integrated-only; it remains
an integrated-proof blocker. Repeated local fixture success does not promote
`PRODUCTIVE_AVAILABILITY`.

### Authority provenance / anti-forgery proof

| Required proof field | Implemented result |
|---|---|
| `PROOF_ISSUER_OWNER` | Normatively DOM for `RepositoryId`/snapshot and REPO for NORMAL catalog; implementation accepts a source-label string rather than an issuer-issued proof. |
| `PROOF_SCOPE` | Required exact DOM identity/snapshot or authorized NORMAL catalog scope; implementation checks only `CatalogScope.equals` and the requested string. |
| `PROOF_IDENTITY_OR_BRAND` | Missing. WeakSet membership authenticates that a local factory created the object, not that the canonical DOM/REPO issuer created it. Matching source text is publicly forgeable. |
| `CONSUMER_VERIFICATION_RULE` | Partial only: `isAuthenticatedCatalogBasis`, scope equality and source-string equality (`src/application/exec-registry.ts:83-92`). No independent issuer, revision, digest, stale or source binding verification exists. |
| `STALE_OR_MUTATION_POLICY` | Local frozen basis prevents in-place mutation; productive stale/detached source rejection is not proven. |
| `FORGERY_NEGATIVE_TEST` | Prototype-shaped scope, schema and untrusted object tests pass (`tests/exec-001-ticket-002.test.ts:233-277`); no direct witness rejects a public basis carrying an expected source string. |
| `CALLER_INJECTION_NEGATIVE_TEST` | Direct `basis` property injection is rejected (`:237-242`), but caller-selected NORMAL repository identity, supported set and registration basis are not rejected. |
| `ALTERNATE_ADAPTER_CONTRACT_TEST` | Not present. The existing wrong-source test rejects a different string, not an alternate adapter that returns a genuine basis with the expected string. |

```text
ISSUER_IS_AUTHORIZED = NO
PROOF_SCOPE_IS_EXACT = PARTIAL
CONSUMER_VERIFIES_PROVENANCE = NO
INPUT_OR_REFERENCE_BINDING = PARTIAL
MUTATION_OR_STALE_REJECTION = PARTIAL
FORGERY_PATH_REJECTED = NO
CALLER_INJECTION_REJECTED = NO
ALTERNATE_ADAPTER_CONTRACT = FAIL
PRODUCER_CONSUMER_CONTRACT_ERRORS = 2
```

## 6. Identity, immutability and lineage

### Aggregate identity proof

```text
AGGREGATE_ROOT = REGISTRY_ENTRY
CANONICAL_IDENTITY = NORMAL (CatalogScope, RepositoryId, SkillContractId,
                   CapabilityId, input SchemaId/version, SemanticVersion);
                   BOOTSTRAP (CatalogScope, SkillContractId, CapabilityId,
                   input SchemaId/version, SemanticVersion)
IDENTITY_AUTHORITY_SOURCE = EXEC-001 for entry; DOM for NORMAL RepositoryId;
                            independent system bootstrap catalog for BOOTSTRAP
IDENTITY_KIND_OR_TYPE = REGISTRY_ENTRY
IDENTITY_SCOPE = CatalogScope; NORMAL repository-scoped; BOOTSTRAP system-scoped
STABLE_CORRELATION_FIELDS = stage, output schema, artifact lists, verdicts, roles, CatalogRevision
CREATION_RULE = register only an absent complete scoped key
REPOSITORY_LOOKUP = complete key through CatalogBasis and resolver
PERSISTED_REPRESENTATION = NOT_APPLICABLE in TICKET-002; TICKET-003/PLAT own physical persistence
REHYDRATED_REPRESENTATION = NOT_APPLICABLE in TICKET-002
EQUALITY_AND_CONTINUITY = immutable scoped key; new registration returns a new basis
ALIASES = names, paths, URLs, labels and raw source text are not canonical identity
IDENTITY_CONTRACT_RESULT = PARTIAL
IDENTITY_AUTHORITY_GAP = YES at implementation provenance boundary
```

The key fields and immutable publication are represented in
`src/domain/exec-registry.ts:354-378` and `:400-438`. The identity contract is
not conformant because the NORMAL `RepositoryId` is created from caller text
(`:221-232`) rather than resolved from a producer-issued DOM identity, and the
basis source is a forgeable string. This is an implementation authority
violation, not an unresolved upstream normative decision.

### Reconstruction, immutability and lineage

`CatalogBasis` and `RegistryEntry` are frozen; arrays and value objects are
frozen; duplicate/conflicting registration returns no new basis and leaves the
old basis unchanged. The direct tests at `tests/exec-001-ticket-002.test.ts:120-150`
and `:215-230` provide positive/no-mutation evidence. Therefore:

```text
IMMUTABILITY = CONFORMANT for the local in-process basis
LINEAGE = PARTIAL for the declared local boundary
IMMUTABILITY_OR_LINEAGE_VIOLATIONS = 0
```

The ticket does not implement persisted rehydration, physical integrity,
continuity or recovery. Those are explicitly TICKET-003/PLAT responsibilities.
At the integrated boundary, however, no producer-issued source, digest, stale
reference or CatalogRevision continuity proof is transported by the ports. The
result must remain an integrated authority-consumption gap, not be promoted to
local reconstruction conformance.

## 7. Legacy, cutover, destructive transition, migration and authorization

```text
LEGACY_ROLE = NEW_CANONICAL_PATH with CUTOVER
LEGACY_READS = no legacy read path in the ticket
LEGACY_WRITES = no legacy registry writer found
LEGACY_COMPATIBILITY_OWNER = REPO consumer, outside local ownership
TRANSITION_RESULT = TRANSITION_PARTIAL (local new path exists; source authority is not fully proven)
LEGACY_AUTHORITY_VIOLATIONS = 0
```

No destructive transition is applicable. There is no delete, in-place registry
replacement, irreversible migration, rollback claim, or physical cutover:

```text
REPLACEMENT_PROVEN = NOT_APPLICABLE
CUTOVER_AUTHORIZED = NOT_APPLICABLE
PRE_TRANSITION_GATES_SATISFIED = NOT_APPLICABLE
POST_TRANSITION_GUARDS_PRESENT = NOT_APPLICABLE
ROLLBACK_OR_ROLL_FORWARD_SEMANTICS_DEFINED = NOT_APPLICABLE
```

The security-sensitive source boundary is not conformant. The backend is not
replaced as an authority and no actor authorization implementation is claimed,
but possession of a caller-created scope, expected source label or basis can
select the material treated as canonical. This is an affected authorization
boundary, not a penetration-test result:

```text
SECURITY_AUTHORIZATION = NON_CONFORMANT at source/identity provenance boundary
```

## 8. Architectural scope and guard assessment

| Decision | Classification | Evidence |
|---|---|---|
| Immutable semver/support-set domain values and common registry path | AUTHORIZED_ARCHITECTURAL_REALIZATION | `src/domain/exec-registry.ts`; direct tests and approved design. |
| Domain/application/composition split with no infrastructure/prototype imports | AUTHORIZED_ARCHITECTURAL_REALIZATION | Source guard at `tests/exec-001-ticket-002.test.ts:295-310`, which ran and passed. |
| String constants as producer identity (`DOM_EXECUTION_BASIS`, `REPO_NORMAL_CATALOG`) | UNAUTHORIZED_ARCHITECTURAL_EXPANSION | Public `CatalogBasis.create` accepts the same strings and consumer treats equality as issuer proof. |
| Caller-supplied `CatalogScope`/NORMAL repository ID and support set as authority-bearing inputs | UNAUTHORIZED_ARCHITECTURAL_EXPANSION | `src/application/exec-registry.ts:61-79`; `src/domain/exec-registry.ts:456-489`. |
| DOM execution-basis port as BOOTSTRAP catalog authority | UNAUTHORIZED_ARCHITECTURAL_EXPANSION | `src/application/exec-registry.ts:64-70` conflicts with independent system-scoped BOOTSTRAP authority. |

```text
ARCHITECTURAL_AUTHORITY_GAP_DISCOVERED = NO
ARCHITECTURAL_AUTHORITY_GAPS = 0
MISSING_ARCHITECTURE_GUARDS = 1
ARCHITECTURE_GUARD_TESTS_RUN = 1
ARCHITECTURE_GUARD_EVIDENCE = focused TICKET-002 test 12/12 passed; import/dependency guard passed;
                            no executable provenance/alternate-authority guard exists
```

### Caller-as-authority and temporal checks

```text
CALLER_AS_AUTHORITY_CHECK = FAIL
CALLER_SUPPLIED_AUTHORITY_BYPASS = YES
BYPASS_1 = caller constructs CatalogScope.normal(raw RepositoryId) and selects REPO source
BYPASS_2 = caller supplies SupportedVersionSet used by compatibility policy
BYPASS_3 = caller supplies basis to RegisterExecCapability.register and can create a new basis

TEMPORAL_AUTHORITY_PROOF = NOT_APPLICABLE for the local operation
REASON = local resolution reads frozen in-process values and commits no external effect;
         integrated source stale/revision proof remains unavailable and must not be implied
```

## 9. Systemic boundary expansion campaign

```text
ROOT_CAUSE_CAMPAIGN_ID = RCC-EXEC-T002-ARCHITECTURE-PROVENANCE-001
ROOT_CAUSE_ID = RC-ARCH-001 — issuer provenance and caller authority are not independently bound
CAMPAIGN_STATUS = OPEN
CAMPAIGN_SCOPE = EXEC-001-TICKET-002 registry/catalog/source boundaries
CANONICAL_FINDINGS = ARCH-CRITICAL-001, ARCH-MAJOR-001
CAMPAIGN_MATRIX_COMPLETE = YES
ALL_SURFACE_ROWS_COVERED = NO (known missing witnesses remain open)
ALL_NEGATIVE_WITNESSES_PASS = NO
NO_UNEXPLAINED_PUBLIC_AUTHORITY_PATH = NO
NO_HIDDEN_CONCRETE_PROTOCOL = NOT_APPLICABLE
ROOT_CAUSE_REMOVED = NO
KNOWN_MANIFESTATIONS_CLOSED = NO
SYSTEMIC_TEST_EVIDENCE = PRESENT for local semantic/import behavior; absent for issuer/caller provenance
```

| Row | Surface class | Location | Owner | Normative obligation | Current behavior | Expected behavior | Related finding | Coverage | Negative witnesses |
|---|---|---|---|---|---|---|---|---|---|
| RCC-001 | ISSUER | `src/application/exec-registry-ports.ts:3-20` | DOM/REPO producer owners; EXEC consumer | Issuer must provide exact branded/verified identity or catalog basis. | Ports expose a plain `CatalogBasis`; source identity is a string constant. | Producer-issued provenance must be independently verifiable by consumer. | ARCH-CRITICAL-001, ARCH-MAJOR-001 | MISSING | NW-004, NW-007 |
| RCC-002 | REGISTRAR | `src/domain/exec-registry.ts:419-439`; `src/application/exec-registry.ts:101-104` | EXEC-001 | Only authorized registry owner publishes a canonical basis. | Public factories and registration accept caller-created scope/source/basis. | Registration must be attached to the authorized catalog owner and basis. | ARCH-CRITICAL-001 | MISSING | NW-006 |
| RCC-003 | CONSUMER | `src/application/exec-registry.ts:54-93` | EXEC-001 | Consumer verifies issuer, exact scope, reference binding and stale policy. | Checks local WeakSet, scope equality and matching text only. | Verify producer provenance, basis/revision/source binding and stale/detached rejection. | ARCH-CRITICAL-001 | MISSING | NW-004, NW-005, NW-007 |
| RCC-004 | ALTERNATE_AUTHORITY_PATH | `src/domain/exec-registry.ts:500-541`; `:587-588` | EXEC-001 | No direct resolver path may bypass authorized source selection. | Public resolver accepts any locally genuine `CatalogBasis`; composition exports it. | Direct domain path must remain internal or enforce the same authority contract. | ARCH-CRITICAL-001 | MISSING | NW-007 |
| RCC-005 | INJECTION_POINT | `src/application/exec-registry.ts:21-26,61-79`; `src/domain/exec-registry.ts:456-489` | EXEC-001 consumer | Caller cannot establish RepositoryId, basis or supported-set authority. | Caller supplies scope/repository and supported set. | Caller supplies request intent only; authority is loaded from owner. | ARCH-CRITICAL-001 | MISSING | NW-005, NW-006 |
| RCC-006 | MUTATION_PATH | `src/domain/exec-registry.ts:432-438` | EXEC-001 | New basis must not mutate frozen historical basis. | Old basis is preserved; source/provenance is copied unchanged. | Preserve immutability and carry verified lineage/provenance into new basis. | ARCH-CRITICAL-001 | COVERED for immutability; MISSING for provenance | NW-008 |
| RCC-007 | STALE_PATH | source ports; TICKET-003/PLAT boundary | DOM/REPO/PLAT with EXEC consumer | Stale, detached or mismatched basis must fail closed. | No productive revision/digest/issuer observation is transported. | Integrated source must provide stale/detached evidence and consumer rejection. | ARCH-CRITICAL-001 | OUTSIDE_SCOPE for physical persistence; MISSING for port contract | NW-009 |
| RCC-008 | PORT_SUBSTITUTION_PATH | `src/application/exec-registry-ports.ts:11-20` | DOM/REPO producer owners; EXEC consumer | Alternate adapters must satisfy the same provenance contract. | Any adapter can return a genuine basis with the expected source string. | Alternate adapters must be independently verified or rejected. | ARCH-CRITICAL-001 | MISSING | NW-007 |
| RCC-009 | PUBLIC_EXPORT | `src/domain/exec-registry.ts:210-242,393-454,587-588`; composition root | EXEC-001 | Public API must not expose a caller-mintable canonical authority route. | Scope, basis, resolver and registration are publicly constructible/exported. | Public entry points must preserve owner/issuer boundary. | ARCH-CRITICAL-001 | MISSING | NW-005, NW-006, NW-007 |
| RCC-010 | PERSISTENCE | TICKET-003/PLAT boundary; no TICKET-002 persistence | PLAT/TICKET-003 | Physical integrity and reconstruction remain foreign. | No local persistence implementation; no false durable claim. | Downstream persistence must preserve source, digest, revision and identity. | ARCH-CRITICAL-001 | OUTSIDE_SCOPE with owner/route | NW-009 |
| RCC-011 | RETRY_RECOVERY | TICKET-003/PLAT boundary | PLAT/TICKET-003 | Retry/recovery must not reinterpret a frozen basis. | No retry/recovery path exists here. | Downstream replay uses original basis and verified lineage. | none | NOT_APPLICABLE with downstream route | none |
| RCC-012 | LEGACY_ROUTE | No legacy registry route in target | REPO compatibility owner | Legacy reads cannot regain write authority. | No legacy writer or route observed. | Preserve new canonical path and retire alternate writers. | none | NOT_APPLICABLE; no legacy route | none |
| RCC-013 | ARCHITECTURE_GUARD | `tests/exec-001-ticket-002.test.ts:295-310` | EXEC-001 | Required forbidden dependency/import guard must execute. | Import/dependency guard exists and passed; no provenance ownership guard. | Guard forbidden alternate authority/source routes as required. | ARCH-CRITICAL-001 | PARTIAL | NW-004, NW-005, NW-006, NW-007 |
| RCC-014 | TEST | `tests/exec-001-ticket-002.test.ts:233-293` | EXEC-001 | Direct negative witnesses cover forgery, caller injection and adapters. | Prototype-shape and wrong-string negatives pass, but matching-source/caller routes are untested. | Add direct executable witnesses for public matching source, raw RepositoryId, support set and alternate adapter. | ARCH-CRITICAL-001 | MISSING | NW-004, NW-005, NW-006, NW-007 |

Negative witness definitions:

```text
NW-004 = public CatalogBasis.create({ source: 'DOM_EXECUTION_BASIS' }) returned by an alternate adapter is rejected
NW-005 = caller-created CatalogScope.normal('other-repository') cannot select canonical NORMAL authority
NW-006 = caller-supplied SupportedVersionSet cannot replace the consumer's canonical supported set
NW-007 = alternate adapter/registration path cannot mint or publish a canonical basis
NW-008 = duplicate/conflict registration leaves old basis and verified provenance unchanged
NW-009 = stale/detached source basis fails closed without mutation at integrated seam
```

The existing tests provide useful direct witnesses for malformed objects,
different source labels, direct basis-property injection and local immutability,
but they do not satisfy NW-004 through NW-007. The campaign therefore remains
open and must not be closed by the 12/12 focused tests or the 60/60 repository
suite.

## 10. Findings

### ARCH-CRITICAL-001 — Canonical registry authority can be supplied by caller or forgeable adapter

```text
Severity = CRITICAL
Ticket = EXEC-001-TICKET-002
Normative authority = ADR-0003 Decisão; SPEC-EXEC-001 §§12.1, 12.3, 13 EXEC-REGISTRY-001/004,
                      EXEC-CAPABILITY-001/002; approved design §§7, 16-17; authority-provenance contract
Owner = EXEC-001 consumer/registry owner; DOM owns NORMAL RepositoryId; REPO owns NORMAL catalog source
Affected boundary = ResolveExecCapability source selection; normal catalog identity; supported-version
                   compatibility; registration/public exports; DOM/REPO authority consumption
Classification = CALLER_SUPPLIED_AUTHORITY_BYPASS + IDENTITY_AUTHORITY_GAP at implementation boundary +
                AUTHORITY_CONSUMPTION_GAP
Systemic pattern = YES
```

**Repository evidence.** `CatalogScope.normal` constructs a locally
authenticated NORMAL scope from arbitrary caller text at
`src/domain/exec-registry.ts:210-232`. `ResolveExecCapability` accepts that
scope and calls `normalCatalog.read(input.scope.repositoryId)` at
`src/application/exec-registry.ts:61-79`. The request's
`SupportedVersionSet` is caller-provided at `src/domain/exec-registry.ts:456-462`
and is used by the compatibility policy at `:485-489` and `:518`. Public
`CatalogBasis.create` accepts arbitrary source labels at `:419-429`, while
`assertAuthorizedBasis` at `src/application/exec-registry.ts:83-92` recognizes
only matching text. `RegisterExecCapability.register` accepts an arbitrary
basis at `:101-104`.

**Problem.** WeakSet membership proves only that a local constructor created a
value. It does not prove that the canonical DOM or REPO issuer created the
value. A caller or alternate adapter can therefore create a genuine
`CatalogScope.normal('repo-x')`, a genuine `CatalogBasis` carrying
`REPO_NORMAL_CATALOG` or `DOM_EXECUTION_BASIS`, and a genuine support set, then
have the consumer treat those values as canonical. The direct test at
`tests/exec-001-ticket-002.test.ts:272-276` rejects a different source string,
not a public basis with the expected source string. The direct basis-property
negative test does not cover the separate public registration route.

**Impact.** A caller can select a repository-scoped catalog without a
producer-issued DOM identity, expand or select compatibility authority through
a caller support set, or substitute an alternate adapter that returns
matching-text material. This can resolve a capability from the wrong catalog
or allow an independently created basis to become canonical-looking. It
violates canonical identity, authority provenance, and cross-spec consumer
ownership even though all ordinary behavior tests pass.

**Minimum correction required.** Preserve the authority boundary with
producer-issued or independently verifiable provenance for DOM/REPO material;
bind NORMAL selection to the canonical DOM identity rather than raw caller
text; ensure compatibility authority is loaded from the canonical registry
rather than caller-selected input; and prevent unrestricted registration or
alternate adapters from minting canonical basis authority. Add direct negative
witnesses NW-004 through NW-007, including a matching-source forged basis and
caller-selected repository/support-set cases. This is a minimum authority
correction, not a choice of implementation technology.

**Related locations.** `src/domain/exec-registry.ts:85-88,210-242,322-351,393-454,456-489,571-588`;
`src/application/exec-registry.ts:21-26,54-104`;
`src/application/exec-registry-ports.ts:3-20`;
`src/composition/exec-registry.ts:1-21`;
`tests/exec-001-ticket-002.test.ts:120-230,233-293`.

### ARCH-MAJOR-001 — DOM execution-basis seam is used as BOOTSTRAP catalog authority

```text
Severity = MAJOR
Ticket = EXEC-001-TICKET-002
Normative authority = ADR-0003 Decisão; SPEC-EXEC-001 §§6, 12.1, 12.3,
                      13 EXEC-REGISTRY-002/003; approved design §§4, 6, 16-17
Owner = EXEC-001 for bootstrap semantics; independent system/bootstrap catalog producer for bootstrap material;
        DOM remains owner of identity/snapshot and REPO remains owner of NORMAL configuration
Affected boundary = BOOTSTRAP catalog source, allowlist gate, DOM/EXEC ACL, system-scoped registry authority
Classification = OWNERSHIP_LEAKAGE + INTEGRATION_NOT_PROVEN
Systemic pattern = YES
```

**Repository evidence.** The BOOTSTRAP branch of
`src/application/exec-registry.ts:64-70` reads `ExecutionCatalogBasisReader`
and requires `EXECUTION_CATALOG_BASIS_SOURCE = 'DOM_EXECUTION_BASIS'` from
`src/application/exec-registry-ports.ts:3-12`. The direct tests construct
BOOTSTRAP catalog bases with that DOM source label at
`tests/exec-001-ticket-002.test.ts:178-194` and `:279-293`.

**Problem.** The accepted architecture requires BOOTSTRAP to be an independent
system-scoped catalog, available independently of NORMAL repository
configuration. The DOM capability contract supplies canonical identity and
execution/snapshot basis; it is not the owner of EXEC bootstrap catalog
entries. The implementation therefore maps a DOM-named source directly into
bootstrap catalog authority and has no independent bootstrap producer seam.

**Impact.** A DOM source or a caller-created adapter can become the effective
issuer for bootstrap entries, collapsing the independent BOOTSTRAP/NORMAL
authority boundary. The allowlist can still reject a `NORMAL` category, but it
cannot correct the wrong catalog owner or source provenance. Integrated
DOM/REPO producer proof is also absent, so this path is not consumable at the
pinned target.

**Minimum correction required.** Keep DOM consumption limited to the canonical
identity/snapshot contract, introduce or consume an independently owned
system/bootstrap catalog authority for BOOTSTRAP, and verify its producer
provenance and revision before allowlist resolution. Add a direct negative
witness that DOM/normal material cannot act as the bootstrap catalog source.

**Related locations.** `src/application/exec-registry.ts:28-40,64-80`;
`src/application/exec-registry-ports.ts:3-13`;
`src/domain/exec-registry.ts:493-498`;
`tests/exec-001-ticket-002.test.ts:178-195,279-293`.

## 11. Specialist summary

```text
Audit: docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-architecture-boundaries-audit.md

Specialist:
ARCHITECTURE_BOUNDARIES

Ticket: EXEC-001-TICKET-002

Ownership errors: 1

Foreign capability duplication: 0

Authority violations: 2

Identity violations: 1

Immutability/lineage violations: 0

Legacy authority violations: 0

Architectural authority gaps: 0
Authority consumption gaps: 2
Producer/consumer contract errors: 2
Temporal authority gaps: 0
Caller-supplied authority bypasses: 3
Missing architecture guards: 1
Architecture guard tests run: 1

Findings:
CRITICAL=1
MAJOR=1
MINOR=0
INFO=0

Domain audit complete:
YES

Specialist result:
SPECIALIST_ARCHITECTURE_FINDINGS
```

AUDIT_TARGET_HEAD: 36ac11c08d6e7b9416e41662646c2686fcfef677
AUDIT_TARGET_STATE_FINGERPRINT: 191ca7c9d2f15f71bc48ee2e17059438ed01efba281c261ad329e41532be6714
DOMAIN_AUDIT_COMPLETE: YES
SPECIALIST_RESULT: SPECIALIST_ARCHITECTURE_FINDINGS