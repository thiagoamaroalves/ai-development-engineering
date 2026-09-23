# EXEC-001-TICKET-002 — Architecture Boundaries Specialist Audit

## 1. Audit identity and basis

```text
AUDIT_SKILL = audit-architecture-boundaries
SPECIALIST = ARCHITECTURE_BOUNDARIES
AUDIT_MODE = READ_ONLY; INDEPENDENT; ADVERSARIAL; ARCHITECTURE_FIRST
TICKET_ID = EXEC-001-TICKET-002
IMPLEMENTATION_UNIT = EXEC-IMP-02
TICKET_PATH = docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-version-registry-catalogs-capabilities.md
IMPLEMENTATION_DESIGN_PATH = docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-implementation-design.md
TICKET_SET_AUDIT_PATH = docs/tickets/SPEC-EXEC-001/implementation-ticket-audit.md
IMPLEMENTATION_BASELINE = d4216ad6f4a87fe7142ccd45d3fd099ef1b92955
CURRENT_HEAD = d4216ad6f4a87fe7142ccd45d3fd099ef1b92955
AUDIT_TARGET_HEAD = d4216ad6f4a87fe7142ccd45d3fd099ef1b92955
AUDIT_TARGET_STATE_FINGERPRINT = 4ae3e359d87e354024c62f86fca4eba759e78335f78696185277e0e37a3e0bf4
TARGET_HEAD_VERIFIED = YES
TARGET_OVERLAY_VERIFIED = YES
TARGET_OVERLAY_STABLE_DURING_AUDIT = YES
TICKET_STATUS_AT_AUDIT = VALIDATION_REQUIRED
IMPLEMENTATION_STATUS = IMPLEMENTED
```

The target HEAD was verified with `git rev-parse HEAD`. The implementation is a
working-tree overlay over that HEAD; the target source/test/design paths were
absent from the pinned commit and were inspected at the supplied pinned state
fingerprint. This audit did not read a sibling specialist audit artifact.

### Changed implementation and evidence surface inspected

Production implementation overlay:

- `src/domain/exec-registry.ts`
- `src/application/exec-registry.ts`
- `src/application/exec-registry-ports.ts`
- `src/composition/exec-registry.ts`

Tests and evidence:

- `tests/exec-001-ticket-002.test.ts`
- `docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/AC-EXEC-003-semver.md`
- `docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/AC-EXEC-005-registry-contribution.md`
- `docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/AC-EXEC-007-registry-contribution.md`
- `docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/AC-EXEC-008-deterministic-resolution.md`
- `docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/AC-EXEC-009-catalog-isolation.md`
- `docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/AC-EXEC-010-bootstrap-allowlist.md`
- `docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/AC-EXEC-011-failure-distinction.md`
- `docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/AC-EXEC-012-registry-extensibility.md`

The requested audit artifact is excluded from the audited implementation state.
Other unrelated working-tree dirtiness was not treated as implementation scope.

### Executed checks

```text
FOCUSED_TICKET_TEST_COMMAND = node --experimental-strip-types --test tests/exec-001-ticket-002.test.ts
FOCUSED_TICKET_TEST_RESULT = 10 passed; 0 failed; 0 skipped
TARGET_SOURCE_TYPECHECK = PASS
ARCHITECTURE_GUARD_TEST_CASES_RUN = 1
ARCHITECTURE_GUARD_TEST_RESULT = PASS (text/path import guard only)
```

The passing behavior tests prove local happy-path and immutable-value behavior;
they do not prove producer provenance, caller-injection rejection, stale-source
rejection, or alternate-adapter substitutability.

## 2. Authority precedence and reconstructed contract

Authority was applied in this order:

```text
Accepted ADR
↓ Canonical component/upstream SPEC
↓ Explicit cross-SPEC ownership contract
↓ Validated Gap Matrix
↓ Implementation Plan
↓ Ticket and approved Implementation Design
↓ Repository implementation and tests
```

The implementation/design claims were treated as evidence, not as authority.

### Local owner

`SPEC-EXEC-001 / EXEC-001 / CANONICAL_OWNER` owns:

- semantic-version meaning and exact supported-set compatibility;
- deterministic versioned registry mapping;
- canonical `UNKNOWN_CAPABILITY`, `INCOMPATIBLE_CAPABILITY` and
  `CONTRACT_INVALID` capability/basis outcomes;
- independent NORMAL and BOOTSTRAP catalog semantics and the bootstrap
  allowlist; and
- common registry extensibility without frozen-basis mutation.

Sources: `ADR-0003` revision 3, `Decisão`; portfolio `O-017` and `O-020`;
`SPEC-EXEC-001` §§2, 9, 12.1, 12.3, 12.4, 13
(`EXEC-VERSION-001/002`, `EXEC-REGISTRY-001/002/003/004`,
`EXEC-CAPABILITY-001/002`), 14, 15, 17, 21 and 22.

### Foreign owners and capabilities consumed

- **DOM / SPEC-DOM-001:** canonical `RepositoryId`, execution/snapshot basis,
  identity, revision, lifecycle and snapshot authority. `DOM-ID-001` and
  `DOM-SNAPSHOT-001` remain foreign authority; EXEC consumes them.
- **REPO / SPEC-REPO-001:** enabled repository-scoped NORMAL catalog material,
  onboarding and enablement. `REPO-BOOTSTRAP-001` confirms the system-owned
  bootstrap boundary; REPO does not own EXEC registry meaning.
- **PLAT / later TICKET-003 boundary:** physical persistence, integrity,
  ordering, CAS, recovery and semantic reconstruction material.
- **EXEC-002, BACKEND, OPS and UI:** downstream context application or mapping;
  none is a registry authority.

The ticket records these cross-SPEC capabilities as:

```text
DOM-EXEC-IDENTITY-SNAPSHOT: AUTHORITY_STATUS=DEFINED; CONTRACT_STATUS=DEFINED;
  LOCAL_TESTABILITY=NO; PRODUCTIVE_AVAILABILITY=NO;
  DEPENDENCY_CLASS=REQUIRED_FOR_INTEGRATED_PROOF
REPO-EXEC-NORMAL-CATALOG: AUTHORITY_STATUS=DEFINED; CONTRACT_STATUS=DEFINED;
  LOCAL_TESTABILITY=NO; PRODUCTIVE_AVAILABILITY=NO;
  DEPENDENCY_CLASS=REQUIRED_FOR_INTEGRATED_PROOF
UNIT-EXEC-REGISTRY-FIXTURE: AUTHORITY_STATUS=DEFINED; CONTRACT_STATUS=DEFINED;
  LOCAL_TESTABILITY=YES; PRODUCTIVE_AVAILABILITY=NO;
  DEPENDENCY_CLASS=INFORMATIONAL
```

The two `PRODUCTIVE_AVAILABILITY=NO` values are integrated-proof gaps and do
not block this ticket's local closure. They do prevent an integrated authority
consumption claim.

### Canonical identities

For a NORMAL entry, the accepted identity is the complete immutable tuple
`(CatalogScope=NORMAL, DOM RepositoryId, SkillContractId, CapabilityId,
SchemaId, SemanticVersion)`. For BOOTSTRAP, identity is the independent system
scope plus `(SkillContractId, CapabilityId, SchemaId, SemanticVersion)`;
`RepositoryId` is absent. `CatalogRevision` is a separate frozen catalog-basis
revision and cannot replace the domain identity or be caller-selected as an
alternative basis.

Sources: `SPEC-EXEC-001` §§12.1, 12.3 and 12.4; `EXEC-REGISTRY-004`; DOM
`DOM-ID-001`; ADR-0010 bootstrap decision.

### Immutability and lineage rules

A registry entry and local catalog basis are immutable values. Registration is
create-only for an absent key, returns a new basis, and must leave the prior
basis unchanged on duplicate/conflict. Existing snapshots/manifests cannot be
rewritten by a later registry basis. Durable digest, predecessor continuity,
semantic reconstruction and physical recovery are owned by TICKET-003/PLAT,
not this ticket.

### Legacy, cutover and does-not-implement rules

The local transition is `NEW_CANONICAL_PATH` with `CUTOVER`: semantic change
requires a new semantic version/basis. REPO remains the sole legacy-compatibility
consumer; no legacy registry writer or adapter is implemented here. The ticket
does not implement DOM identity/lifecycle, REPO enablement, session/scheduler,
physical persistence/recovery, external effects, transport/UI/OPS mappings or
migration.

`SPEC-EXEC-001` §20 allocates no authentication or domain authorization
obligation to EXEC-001. Role restrictions in a registry entry are contract
compatibility, not security authorization.

## 3. Applicability matrix

| Dimension | Classification | Result and reason |
|---|---|---|
| OWNERSHIP | REQUIRED | The implementation creates the EXEC registry boundary and consumes DOM/REPO authority. |
| CANONICAL_AUTHORITY | REQUIRED | Registry resolution and capability outcomes are canonical EXEC decisions. |
| CROSS_SPEC_INTEGRATION | AFFECTED | DOM identity/snapshot and REPO NORMAL catalog are named consumer seams, but no productive producers exist at the target. |
| IDENTITY | REQUIRED | NORMAL registry keys include the foreign DOM `RepositoryId`; BOOTSTRAP has an independent system scope. |
| IMMUTABILITY | REQUIRED | Frozen bases and duplicate/no-mutation registration are local acceptance behavior. |
| LINEAGE | AFFECTED | New basis/catalog revision publication affects historical basis identity; durable predecessor/digest/reconstruction is explicitly TICKET-003/PLAT scope. |
| LEGACY_TRANSITION | AFFECTED | Ticket declares `NEW_CANONICAL_PATH`, `CUTOVER` and REPO-owned legacy compatibility. |
| DESTRUCTIVE_TRANSITION | NOT_APPLICABLE | No in-place basis replacement, deletion, irreversible migration or destructive writer is implemented; registration returns a new value. |
| MIGRATION_AUTHORITY | NOT_APPLICABLE | No migration or onboarding promotion operation is implemented; REPO owns that authority. |
| SECURITY_AUTHORIZATION | NOT_APPLICABLE | The component SPEC allocates authentication/domain authorization elsewhere and this unit performs no external effect or authorization transition. |

## 4. Dimension results

### Ownership and canonical authority

The local semver, entry, basis, allowlist and resolution rules remain in the
EXEC domain. No DOM lifecycle, REPO enablement, PLAT persistence or generic
workflow authority was duplicated.

```text
OWNERSHIP_CLASSIFICATION = OWNERSHIP_LEAKAGE
FOREIGN_CAPABILITY_DUPLICATION = 0
REPOSITORY_SEMANTIC_AUTHORITY = NO
AUTHORITY_CLASSIFICATION = ALTERNATE_AUTHORITY_INTRODUCED
DUAL_AUTHORITY = NO
PROJECTION_USED_AS_AUTHORITY = NO
```

The leakage is at the boundary, not in a duplicated foreign state machine:
`CatalogScope.normal` accepts any caller string as the canonical NORMAL
repository scope, and the application accepts a caller-supplied `CatalogBasis`
without requiring a DOM/REPO-issued authority proof. This creates a second
way to establish repository/basis authority alongside the approved DOM/REPO
consumer seams.

The immutable local value behavior itself is conformant: `CatalogBasis.register`
creates a new basis and duplicate registration leaves the old basis unchanged.
That does not authenticate which basis may be used as canonical input.

### Cross-SPEC integration and authority consumption

```text
CROSS_SPEC_CLASSIFICATION = PARTIAL
INTEGRATION_RESULT = INTEGRATION_NOT_PROVEN
```

The declared DOM and REPO contracts exist in the authority documents, but the
working-tree ports are only raw structural seams:

- `src/application/exec-registry-ports.ts:7-15` exposes `read()` and
  `read(repositoryId: string): CatalogBasis`, with no issuer identity, proof
  brand, requested execution/snapshot basis, source authority, stale result or
  failure contract.
- `src/application/exec-registry.ts:44-53` verifies only scope equality after
  reading a basis. It does not verify the producer, source, exact snapshot or
  catalog basis revision.
- No productive DOM or REPO producer/runtime is available at the target, as
  already recorded by the ticket's PCP/ACP records.

This is not a local-readiness blocker because both foreign capabilities are
classified `REQUIRED_FOR_INTEGRATED_PROOF`, but it is not proof of productive
authority consumption.

### Authority provenance and anti-forgery proof

| Capability | Issuer owner | Required consumer verification | Actual target result |
|---|---|---|---|
| `DOM-EXEC-IDENTITY-SNAPSHOT` | `SPEC-DOM-001` canonical resolver | Verify producer provenance, exact DOM `RepositoryId`, execution/snapshot basis, revision and stale/detached failure before resolution. | `PROOF_ISSUER_OWNER` is documented, but no issuer brand/result is transported. Only `CatalogScope.equals` is checked; caller basis and caller scope are accepted. `CONSUMER_VERIFIES_PROVENANCE=NO`. |
| `REPO-EXEC-NORMAL-CATALOG` | `SPEC-REPO-001` enabled configuration | Verify authorized REPO source, requested `RepositoryId`, frozen basis/revision and stale/detached failure. | Raw `CatalogBasis` is accepted from a structurally substitutable adapter and its arbitrary `source` is not verified. `CONSUMER_VERIFIES_PROVENANCE=NO`. |
| `UNIT-EXEC-REGISTRY-FIXTURE` | EXEC test support only | Keep fixture identity explicit and reject caller replacement; fixture proves local semantics only. | Tests directly construct and inject a basis; there is no fixture brand or caller-replacement negative witness. `CALLER_INJECTION_REJECTED=NO`. |

For all three, the target has no direct executable forgery, caller-injection,
stale/mutation, or alternate-adapter contract witness. Immutable arrays and
old-basis preservation prove mutation safety, not provenance.

### Identity, immutability and lineage

```text
IDENTITY_RESULT = VIOLATED
IMMUTABILITY_RESULT = CONFORMANT (local in-process scope)
LINEAGE_RESULT = PARTIAL (deferred semantic reconstruction boundary; no local
  historical mutation was observed)
```

The identity violation is the unverified NORMAL `RepositoryId` and basis route,
not accidental regeneration of a valid DOM ID. The implementation's
`CatalogScope.normal(repositoryId: unknown)` turns arbitrary input into the
scope used in the canonical key. `ResolveExecCapabilityInput.basis` can then
return a basis whose scope is different from the requested scope.

The local immutable behavior is supported by:

- `src/domain/exec-registry.ts:377-386` freezing entries and basis arrays;
- `src/domain/exec-registry.ts:402-408` returning a new basis for registration;
- `tests/exec-001-ticket-002.test.ts:113-119` duplicate/no-mutation witness; and
- `tests/exec-001-ticket-002.test.ts:168-181` synthetic common-path witness.

Catalog digest, persisted predecessor continuity, rehydration and historical
reconstruction are not silently claimed; they are TICKET-003/PLAT scope.

### Legacy/cutover and destructive-transition safety

```text
LEGACY_TRANSITION_RESULT = TRANSITION_CONFORMANT (local scope)
DESTRUCTIVE_TRANSITION = NOT_APPLICABLE
REPLACEMENT_PROVEN = NOT_APPLICABLE
CUTOVER_AUTHORIZED = YES for the declared new immutable basis path
PRE_TRANSITION_GATES_SATISFIED = NOT_APPLICABLE
POST_TRANSITION_GUARDS_PRESENT = NOT_APPLICABLE
ROLLBACK_OR_ROLL_FORWARD_SEMANTICS_DEFINED = NOT_APPLICABLE
```

No legacy writer, silent conversion, in-place basis overwrite, destructive
migration or irreversible replacement was found in the changed implementation.
The integrated cutover/replay proof remains outside this ticket.

### Migration and security boundaries

```text
MIGRATION_RESULT = NOT_APPLICABLE
AUTHORIZATION_RESULT = NOT_APPLICABLE
```

No migration authority or security authorization path is implemented. The
`allowedRoles` check is a registry-contract restriction and does not elevate or
replace domain authorization.

## 5. Caller-as-authority and temporal checks

```text
CALLER_AS_AUTHORITY_CHECK = FAIL
CALLER_SUPPLIED_AUTHORITY_BYPASSES = 3
TEMPORAL_AUTHORITY_PROOF = NOT_APPLICABLE
TEMPORAL_AUTHORITY_GAPS = 0
```

The three observed caller-controlled authority routes are:

1. `ResolveExecCapabilityInput.basis` is selected first and returned without
   comparing it with `scope` or `repositoryId` (`src/application/exec-registry.ts:14-17,40-41`).
2. `CatalogScope.normal` and the application `repositoryId` path treat a raw
   caller string as the DOM-owned repository identity
   (`src/domain/exec-registry.ts:199-218`; application lines 47-53).
3. `RegistryResolutionRequest.supportedVersions` is caller-provided and is
   used as the authoritative consumer set in resolution
   (`src/domain/exec-registry.ts:422-429,482-487`); no producer-issued or
   execution-frozen support-set authority is verified.

A read-before-effect temporal proof is not applicable to this local immutable
operation because no external effect is committed. That exemption does not
excuse provenance verification of the basis being read.

## 6. Architecture scope and architecture guard assessment

```text
ARCHITECTURE_SCOPE = UNAUTHORIZED_ARCHITECTURAL_EXPANSION
ARCHITECTURAL_AUTHORITY_GAP_DISCOVERED = NO
MISSING_ARCHITECTURE_GUARDS = 1
ARCHITECTURE_GUARD_TESTS_RUN = 1
```

The accepted architecture decision is complete; the defect is implementation
conformance, not an unresolved ADR/ownership question. The required architecture
guard is the test at `tests/exec-001-ticket-002.test.ts:199-211`. It ran and
passed, but only searches source text for forbidden words and checks source path
location. It does not execute a forbidden import, alternate authority route,
forged schema/basis, caller-injection path or alternate adapter and assert
rejection/preservation. It therefore cannot guard the authority boundary that
failed above.

## 7. Systemic boundary expansion

### Root-cause campaign

```text
ROOT_CAUSE_CAMPAIGN_ID = RCC-EXEC-T002-AUTHORITY-PROVENANCE-001
ROOT_CAUSE_ID = UNVERIFIED_AUTHORITY_BEARING_INPUTS_ENTER_CANONICAL_REGISTRY_RESOLUTION
CAMPAIGN_STATUS = OPEN
CAMPAIGN_SCOPE = EXEC-001-TICKET-002 version/registry/catalog/capability boundary
CANONICAL_FINDINGS = ARCH-CRITICAL-001, ARCH-MAJOR-001, ARCH-MINOR-001
```

The repeated pattern is acceptance of caller- or adapter-supplied authority-bearing
objects without an independently verifiable issuer, scope, revision or stale
policy. The campaign matrix accounts for every required surface class:

| Surface row | Class | Location | Owner | Expected behavior | Current behavior | Coverage | Negative witnesses |
|---|---|---|---|---|---|---|---|
| RCC-001 | ISSUER | `CatalogScope.normal/create`, domain `199-210` | EXEC consumer boundary; DOM owns RepositoryId | Only a DOM-issued canonical RepositoryId may establish NORMAL scope. | Any non-empty caller string establishes scope identity. | MISSING | NW-001 |
| RCC-002 | ISSUER | DOM canonical resolver capability | SPEC-DOM-001 | Issue exact identity/snapshot basis with verifiable provenance. | No productive producer at target; integrated proof unavailable. | OUTSIDE_SCOPE (integrated proof) | NW-005 |
| RCC-003 | ISSUER | REPO enabled configuration capability | SPEC-REPO-001 | Issue authorized NORMAL catalog material with source/basis proof. | No productive producer at target; integrated proof unavailable. | OUTSIDE_SCOPE (integrated proof) | NW-005 |
| RCC-004 | REGISTRAR | `RegisterExecCapability.register`, application `60-63`; `CatalogBasis.register`, domain `402-408` | EXEC-001 | Publish only complete entries into an authorized basis and preserve prior basis. | Caller supplies arbitrary basis/entry; old basis is preserved but authority of input is not verified. | MISSING | NW-001, NW-003 |
| RCC-005 | CONSUMER | `ResolveExecCapability.resolve/selectBasis`, application `35-56`; `RegistryResolutionService.resolve`, domain `466-503` | EXEC-001 | Verify issuer, scope, revision and request binding before canonical resolution. | Direct basis is accepted first; domain resolver trusts it. | MISSING | NW-001, NW-002 |
| RCC-006 | ALTERNATE_AUTHORITY_PATH | `ResolveExecCapabilityInput.basis`, application `14-17,40-41` | EXEC-001 | No caller bypass of DOM/REPO source authority. | A caller-selected basis bypasses source and requested scope. | MISSING | NW-001 |
| RCC-007 | INJECTION_POINT | `scope`, `repositoryId`, `supportedVersions`, `schema` request fields | EXEC-001 consumer | Caller values are requests only and cannot establish authority. | Raw repository/scope/support set and weak schema instance checks are accepted. | MISSING | NW-001, NW-003 |
| RCC-008 | MUTATION_PATH | `CatalogBasis.register`, domain `402-408`; tests `113-119,168-181` | EXEC-001 | Failed duplicate/conflict registration must not mutate frozen basis. | New-basis publication and no-mutation behavior pass locally. | COVERED | NW-004 |
| RCC-009 | STALE_PATH | `ExecutionCatalogBasisReader.read`, `NormalCatalogSource.read`, ports `7-15` | DOM/REPO producers; EXEC verifies | Stale/detached basis must fail closed before resolution. | No requested snapshot/basis revision, provenance or stale result is transported. | MISSING | NW-005 |
| RCC-010 | PORT_SUBSTITUTION_PATH | `src/application/exec-registry-ports.ts:7-15` | EXEC consumer boundary | Alternate adapters must satisfy the same issuer/provenance contract. | Any structural adapter returning `CatalogBasis` is accepted. | MISSING | NW-002, NW-005 |
| RCC-011 | PUBLIC_EXPORT | All public exports in `src/domain/exec-registry.ts`; composition root | EXEC-001 | Test support must not become a production authority injection path. | `CatalogScope`, `CatalogBasis`, `RegistryEntry` and direct basis input are public. | MISSING | NW-001, NW-003 |
| RCC-012 | PERSISTENCE | Semantic rehydration/digest/continuity | TICKET-003/PLAT | Validate persisted material before materialization. | Not implemented in this ticket by approved scope. | OUTSIDE_SCOPE with owner route TICKET-003/PLAT | NW-005 |
| RCC-013 | RETRY_RECOVERY | Replay/recovery of basis | TICKET-003/PLAT | Preserve original basis and reject stale reinterpretation. | Not implemented in this ticket by approved scope. | OUTSIDE_SCOPE with owner route TICKET-003/PLAT | NW-005 |
| RCC-014 | LEGACY_ROUTE | No legacy registry path in changed files | REPO consumer | No legacy writer or alternate legacy registry authority. | No legacy route observed. | NOT_APPLICABLE; REPO route owns compatibility | none |
| RCC-015 | ARCHITECTURE_GUARD | `tests/exec-001-ticket-002.test.ts:199-211` | EXEC-001 test boundary | Execute forbidden dependency/authority substitutions and assert rejection. | Text/path scan only; authority negative paths are untested. | MISSING | NW-006 |
| RCC-016 | TEST | All T002 direct witnesses | EXEC-001 test boundary | Include forged, caller-injected, stale and alternate-adapter negatives. | 10/10 tests pass but cover only positive injection through intended fixture and source happy path. | MISSING | NW-001, NW-002, NW-003, NW-005 |

Direct negative-witness results used by the matrix:

```text
NW-001 = FAIL: caller requested NORMAL:repo-b while supplying a NORMAL:repo-a
  basis; resolution returned RESOLVED with NORMAL:repo-a.
NW-002 = FAIL: a NormalCatalogSource returning a basis with source
  "untrusted-source" was accepted and resolved.
NW-003 = FAIL: Object.create(SchemaReference.prototype) with caller-set fields
  passed RegistryEntry.create; schema identity was not independently branded.
NW-004 = PASS: duplicate registration preserved the prior basis identity and
  entry collection.
NW-005 = MISSING: no productive producer-issued, stale, detached or alternate-
  adapter negative witness exists at the target.
NW-006 = INSUFFICIENT: the architecture guard performed textual/path scanning,
  not executable dependency/authority rejection.
```

`CAMPAIGN_MATRIX_COMPLETE = YES` for the affected T002 surface. The campaign
cannot close: `ALL_NEGATIVE_WITNESSES_PASS = NO`,
`NO_UNEXPLAINED_PUBLIC_AUTHORITY_PATH = NO`, `ROOT_CAUSE_REMOVED = NO`, and
`SYSTEMIC_TEST_EVIDENCE = INSUFFICIENT`.

## 8. Findings

### ARCH-CRITICAL-001 — Caller and unverified adapter can establish canonical registry authority

- **Severity:** CRITICAL
- **Ticket:** EXEC-001-TICKET-002
- **Normative authority:** `ADR-0003` Decisão; `SPEC-EXEC-001` §§12.1, 12.3,
  12.4, `EXEC-REGISTRY-004`, `EXEC-CAPABILITY-001/002`; `SPEC-DOM-001`
  `DOM-ID-001`; authority-provenance anti-forgery contract. The approved design
  §7 explicitly requires `CALLER_AS_AUTHORITY_CHECK = PASS` and says caller
  input cannot create `RepositoryId`, supply the authoritative support set or
  substitute a producer-issued basis.
- **Owner:** EXEC-001 is the semantic registry owner and consumer of DOM/REPO
  authority; DOM remains owner of `RepositoryId` and REPO remains owner of
  enabled NORMAL catalog configuration.
- **Affected boundary:** NORMAL registry identity, DOM/REPO basis consumption,
  application resolution and public registry constructors.
- **Repository evidence:**
  - `src/application/exec-registry.ts:14-17,35-41` exposes a caller-supplied
    `basis` and returns it before checking `scope` or `repositoryId`.
  - `src/application/exec-registry.ts:47-53` accepts raw `repositoryId` and
    checks only value equality of the returned scope.
  - `src/domain/exec-registry.ts:189-218` constructs NORMAL scope from any
    non-empty string; there is no DOM-issued identity/provenance boundary.
  - `src/domain/exec-registry.ts:422-429,482-487` trusts caller-supplied
    `supportedVersions` for compatibility resolution.
  - `src/domain/exec-registry.ts:70-74,299-302` accepts `SchemaReference`
    using `instanceof` only, without the existing contract module's internal
    brand/instance verification.
  - `src/application/exec-registry-ports.ts:7-15` transports raw
    `CatalogBasis` without issuer, proof, requested basis or stale semantics.
  - Direct read-only witnesses NW-001, NW-002 and NW-003 demonstrated that a
    wrong-repository direct basis resolves, an untrusted adapter source
    resolves, and a forged schema prototype can be registered.
- **Problem:** The canonical resolver has an alternate authority path. A
  caller or structurally substitutable adapter can provide the basis, NORMAL
  repository identity and support set that the resolver treats as authoritative.
  Scope equality is not provenance, and immutability of a supplied object does
  not make its issuer authorized. The incomplete schema brand check also lets a
  forged authority-bearing schema shape enter entry identity and resolution.
- **Impact:** Cross-repository resolution, stale/detached/forged catalog use,
  exact-basis substitution and unsupported caller-selected compatibility can
  become successful canonical resolutions. DOM identity and REPO catalog
  ownership are bypassed, and historical/frozen basis meaning cannot be
  trusted. This is a caller-supplied authority bypass and a canonical identity
  boundary violation.
- **Minimum correction required:** Remove the productive direct-basis bypass or
  isolate it behind an explicitly test-only fixture boundary. Require a
  producer-issued, independently verifiable DOM/REPO basis/reference carrying
  exact scope and frozen revision; verify issuer, source, identity binding,
  stale/detached status and authoritative support set before resolution. Use an
  authenticated schema-reference boundary rather than `instanceof` alone.
  Reject caller/alternate-adapter injection as a structured canonical failure.
- **Systemic pattern:** YES
- **Related locations:** `src/domain/exec-registry.ts:66-74,189-218,
  299-349,371-419,422-494`; `src/application/exec-registry.ts:14-56`;
  `src/application/exec-registry-ports.ts:7-15`;
  `tests/exec-001-ticket-002.test.ts:168-196,199-211`;
  campaign rows RCC-001 through RCC-011 and RCC-015/RCC-016.

### ARCH-MAJOR-001 — Source failures bypass EXEC's canonical failure result

- **Severity:** MAJOR
- **Ticket:** EXEC-001-TICKET-002
- **Normative authority:** `SPEC-EXEC-001` §14 failure events, §15 failure
  semantics, `EXEC-REGISTRY-004`, `EXEC-CAPABILITY-001` and `EXEC-FAILURE-001`;
  ticket §14b source/stale failure semantics; approved design §4 application
  boundary (“maps source failures”) and §18 wrong-scope/source failure table.
- **Owner:** EXEC-001 owns canonical capability/basis failure meaning;
  DOM/REPO remain producers of foreign material and must not be bypassed by a
  caller-defined mapping.
- **Affected boundary:** `ResolveExecCapability` source selection to the
  structured `RegistryResolutionResult` failure surface.
- **Repository evidence:**
  - `src/application/exec-registry.ts:42-56` throws `ExecRegistryDomainError`
    when a source is missing or a basis scope mismatches, before
    `RegistryResolutionService.resolve` is invoked.
  - `src/domain/exec-registry.ts:440-447,495-503` defines structured failures
    with code, basis, reason, `noMutation` and `noApproval`, but source-selection
    errors never reach that result path.
  - `src/application/exec-registry-ports.ts:7-15` has no typed unavailable,
    stale, detached or invalid-material outcome.
- **Problem:** An unavailable, substituted, wrong-scope or stale source can
  escape as an exception rather than the EXEC-owned structured
  `CONTRACT_INVALID`/capability failure with basis and no-approval/no-mutation
  semantics. The caller or adapter is left to decide how to map the error.
- **Impact:** Foreign producer failure meaning can be lost at the consumer
  boundary; downstream execution may receive an uncategorized exception rather
  than the canonical fail-closed result. This is a material producer/consumer
  contract defect even though productive DOM/REPO availability is correctly
  classified as integrated-only.
- **Minimum correction required:** Define a source result/error contract that
  carries issuer, scope, basis/revision and stale/detached failure semantics;
  map every source failure through the EXEC-owned structured result before it
  leaves the application boundary. Preserve `CONTRACT_INVALID`,
  `UNKNOWN_CAPABILITY` and `INCOMPATIBLE_CAPABILITY` meaning and no-approval/
  no-mutation guarantees.
- **Systemic pattern:** YES
- **Related locations:** `src/application/exec-registry.ts:35-56`;
  `src/application/exec-registry-ports.ts:7-15`;
  `src/domain/exec-registry.ts:440-503`; campaign rows RCC-005, RCC-007,
  RCC-009, RCC-010, RCC-016.

### ARCH-MINOR-001 — Required architecture guard does not guard authority substitution

- **Severity:** MINOR
- **Ticket:** EXEC-001-TICKET-002
- **Normative authority:** approved Implementation Design §4 and §20, which
  require the first productive registry architecture/import guard; architecture
  guard requirements in `audit-architecture-boundaries` and the authority-
  provenance anti-forgery contract.
- **Owner:** EXEC-001 test/conformance boundary.
- **Affected boundary:** architecture guard coverage for imports, alternate
  authority, forgery and caller injection.
- **Repository evidence:** `tests/exec-001-ticket-002.test.ts:199-211` only
  scans source text for forbidden words and verifies paths under `src`; it does
  not execute a forbidden dependency, forge a basis/schema, substitute an
  adapter or assert rejection. The guard ran once and passed, while NW-001,
  NW-002 and NW-003 demonstrated unguarded authority paths.
- **Problem:** The guard can remain green while the canonical authority bypass
  exists, so it is not executable evidence for the forbidden ownership route
  it was intended to protect.
- **Impact:** Future import/source substitution regressions have no direct
  negative witness and the current critical boundary defect was not caught by
  the required guard.
- **Minimum correction required:** Add executable negative/contract guards for
  direct basis injection, wrong-scope basis, forged schema/reference,
  stale/detached source and alternate adapter substitution, plus a real import
  dependency rejection/preservation assertion. Run and record those guards.
- **Systemic pattern:** NO
- **Related locations:** `tests/exec-001-ticket-002.test.ts:199-211`;
  campaign rows RCC-015 and RCC-016.

## 9. Specialist summary

Audit: `docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-architecture-boundaries-audit.md`

Specialist:
ARCHITECTURE_BOUNDARIES

Ticket: EXEC-001-TICKET-002

Ownership errors: 1

Foreign capability duplication: 0

Authority violations: 1

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
MINOR=1
INFO=0

Domain audit complete:
YES

Specialist result:
SPECIALIST_ARCHITECTURE_FINDINGS

AUDIT_TARGET_HEAD: d4216ad6f4a87fe7142ccd45d3fd099ef1b92955
AUDIT_TARGET_STATE_FINGERPRINT: 4ae3e359d87e354024c62f86fca4eba759e78335f78696185277e0e37a3e0bf4
DOMAIN_AUDIT_COMPLETE: YES
SPECIALIST_RESULT: SPECIALIST_ARCHITECTURE_FINDINGS
