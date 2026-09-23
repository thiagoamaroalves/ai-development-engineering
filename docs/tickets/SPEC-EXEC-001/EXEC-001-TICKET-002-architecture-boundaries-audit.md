# EXEC-001-TICKET-002 — Architecture Boundaries Specialist Audit

## 1. Audit identity and target

```text
AUDIT_SKILL = audit-architecture-boundaries
SPECIALIST = ARCHITECTURE_BOUNDARIES
AUDIT_MODE = READ_ONLY INDEPENDENT ADVERSARIAL ARCHITECTURE_FIRST
OWNERSHIP_PRESERVING = YES
AUTHORITY_PRESERVING = YES
CROSS_SPEC_AWARE = YES
IDENTITY_AWARE = YES
LEGACY_TRANSITION_AWARE = YES
EXHAUSTIVE_WITHIN_DOMAIN = YES

TICKET_ID = EXEC-001-TICKET-002
TICKET_PATH = docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-version-registry-catalogs-capabilities.md
IMPLEMENTATION_UNIT = EXEC-IMP-02 — Version, registry resolution, catalogs and capability extensibility
IMPLEMENTATION_DESIGN_PATH = docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-implementation-design.md
TICKET_SET_AUDIT_PATH = docs/tickets/SPEC-EXEC-001/implementation-ticket-audit.md
IMPLEMENTATION_BASELINE = d4216ad6f4a87fe7142ccd45d3fd099ef1b92955
AUDIT_TARGET_HEAD = 8b6fe86b0f6370094e630b7272c98a490518cfac
CURRENT_HEAD = 8b6fe86b0f6370094e630b7272c98a490518cfac
AUDIT_TARGET_STATE_FINGERPRINT = b61bd4448910d5260c149cc29396e6b67eb3b1f623b7d81b15e9f9802baf0bab
TICKET_STATUS = VALIDATION_REQUIRED

TARGET_HEAD_VERIFIED = YES
TARGET_SOURCE_TEST_STATE_STABLE = YES
WORKTREE_OVERLAY_PRESENT = YES; unrelated documentary and tooling changes excluded
WORKTREE_SEMANTIC_OVERLAY = NONE
```

The pinned HEAD resolves to the requested checkpoint. The implementation source
and test files have no working-tree delta relative to that HEAD. Existing
working-tree changes in unrelated ticket documents, README, `.gitignore`,
`skills/`, and `tools/` were not used as implementation evidence and were not
modified by this audit.

### Changed target files

The target checkpoint changes the following ticket implementation surfaces:

```text
docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-checkpoints/EXEC-001-TICKET-002-remediation-checkpoint-round-3.md
docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-implementation-remediation.md
src/application/exec-registry-ports.ts
src/application/exec-registry.ts
src/composition/exec-registry.ts
src/domain/exec-registry.ts
tests/exec-001-ticket-002.test.ts
```

The implementation baseline also contains the ticket's approved design and
local completion evidence under `docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/`.
Those documentary claims were treated as claims and checked against source and
executable tests.

### Direct executable evidence run during this audit

```text
node --experimental-strip-types --test tests/exec-001-ticket-002.test.ts = 17 passed, 0 failed
npm test = 65 passed, 0 failed
npm run typecheck = PASS
```

The focused architecture tests include a source import scan and a dynamic import
of the real registry graph. They do not test the public fixture-factory path as
an attempted productive authority source, nor do they guard the production
`resolveBeforeWork` effect boundary.

## 2. Source precedence and reconstructed contract

### Source precedence

1. `docs/adrs/ADR-0003-versioned-skill-contracts.md`, ADR-0003 revision 3,
   `ACCEPTED`: explicit semantic versioning, supported versions, frozen
   execution basis, registry mapping, independent NORMAL/BOOTSTRAP catalogs,
   and bootstrap allowlist.
2. `docs/adrs/ADR-0010-repository-configuration-and-legacy-migration.md`,
   ADR-0010 revision 3, `ACCEPTED`: enabled repository configuration, system
   bootstrap onboarding, explicit migration, and no silent legacy promotion.
3. `docs/specs/SPEC-PORTFOLIO-001-organization.md`: O-017 and O-020 assigned
   to `SPEC-EXEC-001` as `CANONICAL_OWNER`; DOM remains identity authority and
   REPO remains configuration/enablement authority.
4. `docs/specs/SPEC-EXEC-001-skill-contracts-and-capability-registry.md`,
   revision 3, as validated by its conformant component audit: §§12.1,
   12.3–12.4, `EXEC-VERSION-001/002`, `EXEC-REGISTRY-001/002/003`, and
   `EXEC-CAPABILITY-001/002`.
5. Cross-spec contracts cited by the ticket/design: `DOM-EXEC-IDENTITY-SNAPSHOT`
   and `REPO-EXEC-NORMAL-CATALOG`, with authority and contract defined but
   productive availability `NO`, dependency class
   `REQUIRED_FOR_INTEGRATED_PROOF`.
6. Validated Gap Matrix and Implementation Plan: `GAP-004`, `GAP-006`,
   `GAP-008`, `GAP-009`, `GAP-010`, `GAP-011`, and `EXEC-IMP-02`.
7. Approved Implementation Design: implementation realization guidance only;
   it cannot transfer ownership or close a missing producer proof.
8. Ticket and repository implementation: evidence of behavior, not authority.

### Reconstructed architectural contract

| Dimension | Contract and owner | Evidence anchor |
|---|---|---|
| `LOCAL_OWNER` | EXEC-001 owns semantic-version meaning/classification, explicit supported-set resolution, complete registry-entry semantics, immutable local catalog-basis publication, deterministic outcomes, NORMAL/BOOTSTRAP separation, bootstrap allowlist, and registry-only extensibility. | SPEC §§12.1, 12.3, 13; O-017/O-020; ticket §§3, 8–10, 15 |
| `LOCAL_AUTHORITIES` | `SemanticVersion`, `SupportedVersionSet`, `RegistryEntry`, `CatalogBasis`, `VersionCompatibilityPolicy`, `BootstrapAllowlistPolicy`, and `RegistryResolutionService` are the local semantic owners. | Implementation Design §§6, 9, 10, 13 |
| `FOREIGN_OWNERS` | DOM owns canonical `RepositoryId` and execution/snapshot basis; REPO owns enabled NORMAL catalog/configuration and enablement; PLAT owns physical storage, integrity, ordering, CAS, recovery, and reconstruction material. | ADR-0010; SPEC §§12.1, 12.4; ticket §10 |
| `FOREIGN_CAPABILITIES_CONSUMED` | DOM execution basis and REPO NORMAL catalog are consumed through explicit application ports. Bootstrap is an independent system source. | Ticket §§14a–14b; Design §§7, 16 |
| `CANONICAL_IDENTITIES` | NORMAL: `(CatalogScope=NORMAL, RepositoryId, SkillContractId, CapabilityId, SchemaId, SemanticVersion)`; BOOTSTRAP: `(CatalogScope=BOOTSTRAP, SkillContractId, CapabilityId, SchemaId, SemanticVersion)`. `CatalogRevision` is a distinct frozen-basis revision. | SPEC §§12.1, 12.3 |
| `IMMUTABILITY_RULES` | An absent complete key registers into a new basis; duplicate/conflicting registration fails without mutation; existing bases and entries remain frozen. | SPEC §§12.1, 12.4; source `CatalogBasis.register` |
| `LINEAGE_RULES` | Catalog revisions remain distinct from semantic versions; persisted continuity, digest, ordering, and reconstruction belong to EXEC-001/TICKET-003 with PLAT physical support. | SPEC §12.4; Design §§14–15 |
| `LEGACY_AUTHORITY_RULES` | REPO owns legacy compatibility/migration. EXEC adds a new canonical registry path and does not silently convert or write legacy authority. | ADR-0010; ticket §21; Plan `EXEC-IMP-02` |
| `CUTOVER_RULES` | A semantic change requires a new semantic version; a catalog change publishes a new basis/revision and does not rewrite frozen execution history. | SPEC §12.1; ticket §§15, 21 |
| `MIGRATION_AUTHORITY` | No migration implementation in this ticket. Bootstrap category `MIGRATION` is an allowlisted capability category, not ownership of repository migration state. REPO/PLAT retain migration and persistence authority. | ADR-0010; ticket §10 |
| `SECURITY_BOUNDARIES` | Source provenance, scope, revision, and no-work-before-allowlist are architecture-sensitive authority boundaries. User authorization, session lifecycle, enablement, and external effects remain foreign. | SPEC §§12.1, 13; Design §§7, 16–18 |
| `DOES_NOT_IMPLEMENT` | DOM identity/lifecycle, REPO enablement/configuration, physical persistence/recovery, session/scheduler, effects, transport/UI/OPS mapping, and downstream final proof. | Ticket §10; Design §§4, 16–18 |

## 3. Applicability matrix

| Dimension | Classification | Reason/evidence |
|---|---|---|
| OWNERSHIP | REQUIRED | New domain/application/composition registry behavior and source seams are introduced. |
| CANONICAL_AUTHORITY | REQUIRED | Registry resolution and registration publish/return authority-bearing basis and entry outcomes. |
| CROSS_SPEC_INTEGRATION | AFFECTED | DOM and REPO authority-bearing capabilities are explicit consumers, but their productive producers are integrated-only and unavailable at the target. |
| IDENTITY | REQUIRED | The registry entry and NORMAL/BOOTSTRAP scope keys are canonical identity obligations. |
| IMMUTABILITY | REQUIRED | Basis registration creates a new frozen value and must preserve prior history. |
| LINEAGE | AFFECTED | Local `CatalogRevision` progression is present; durable digest, continuity, reconstruction, and recovery are explicitly TICKET-003/PLAT work. |
| LEGACY_TRANSITION | AFFECTED | The ticket declares `NEW_CANONICAL_PATH`, `CUTOVER`, and REPO-owned `LEGACY_COMPATIBILITY`; alternate legacy writers must not be created. |
| DESTRUCTIVE_TRANSITION | NOT_APPLICABLE | No deletion, retirement, destructive migration, or irreversible legacy-writer removal is implemented here; the transition adds a new path. |
| MIGRATION_AUTHORITY | NOT_APPLICABLE | No repository migration or persistent migration state is implemented; the `MIGRATION` category is only part of the bootstrap allowlist. |
| SECURITY_AUTHORIZATION | AFFECTED | The code gates authority-bearing source material and can invoke a caller callback after resolution, although user/session authorization is outside this ticket. |

All required and affected dimensions were run. The two integrated-only producer
gaps do not prevent completion of the local architecture audit; they remain
explicitly unproven rather than promoted from fixture evidence.

## 4. Ownership and canonical-authority audit

### Ownership result

```text
LOCAL_SEMANTIC_OWNERSHIP = PRESERVED
FOREIGN_LIFECYCLE_OWNERSHIP = NOT_ABSORBED
FOREIGN_CAPABILITY_DUPLICATION = 0
REPOSITORY_SEMANTIC_AUTHORITY = NO
OWNERSHIP_LEAKAGE = YES — source fixture issuance is exposed from a production module and can be supplied to the productive application seam
```

The domain keeps version, scope, entry, catalog, compatibility, allowlist, and
outcome rules. The application selects sources and maps failures. No DOM
lifecycle, REPO enablement, PLAT persistence, or foreign state machine is
reimplemented. The ownership defect is the exported local fixture source path,
not duplication of foreign lifecycle logic.

### Canonical authority result

```text
CANONICAL_SEMANTIC_DECISIONS = PRESERVED
CANONICAL_WRITE_PATH = CatalogBasis.register, returning a new basis
DUAL_AUTHORITY = NO within the intended EXEC semantic domain
ALTERNATE_AUTHORITY_INTRODUCED = YES — exported fixture factory can issue accepted receipts for caller-created bases
PROJECTION_USED_AS_AUTHORITY = NO
AUTHORITY_RESULT = PARTIAL
```

`isProducerIssuedCatalogBasisReceipt` verifies local module ledger membership,
source kind, and a frozen authenticated basis. It does not verify that the
issuer is the canonical DOM resolver, enabled REPO configuration, or system
bootstrap owner. The public `createLocal*Fixture` functions call the same
module-private `issue` path, so a caller can create an authenticated fixture
basis and then obtain a receipt accepted by the application. A direct runtime
probe at the target returned:

```text
accepted = true
scope = caller-owned
source = REPO_NORMAL_CATALOG
```

This is distinct from the correctly rejected hand-built fake, copied receipt,
or caller-defined subclass in the focused tests. The local ledger proves
construction by this module, not canonical producer ownership.

### Canonical identity proof

```text
AGGREGATE_ROOT = REGISTRY_ENTRY
CANONICAL_IDENTITY =
  NORMAL: (CatalogScope=NORMAL, RepositoryId, SkillContractId, CapabilityId, SchemaId, SemanticVersion)
  BOOTSTRAP: (CatalogScope=BOOTSTRAP, SkillContractId, CapabilityId, SchemaId, SemanticVersion)
IDENTITY_AUTHORITY_SOURCE = EXEC-001 registry; NORMAL RepositoryId must be DOM-owned; BOOTSTRAP is system-owned
IDENTITY_KIND_OR_TYPE = REGISTRY_ENTRY
IDENTITY_SCOPE = NORMAL repository scope or independent BOOTSTRAP system scope
STABLE_CORRELATION_FIELDS = RepositoryId when NORMAL, stage, capability, catalog revision, schema and artifact metadata
CREATION_RULE = register one absent complete scoped key
COMMAND_REPRESENTATION = RegistryEntry registration/new immutable CatalogBasis
REPOSITORY_LOOKUP_REPRESENTATION = Complete scoped key plus requested CatalogRevision
PERSISTED_REPRESENTATION = OUTSIDE THIS TICKET; TICKET-003/PLAT
REHYDRATED_REPRESENTATION = OUTSIDE THIS TICKET; TICKET-003/PLAT
EQUALITY_AND_CONTINUITY_SEMANTICS = Same scoped key/version identifies the same immutable entry; basis revisions remain distinct
REVISION_RELATIONSHIP = SemanticVersion is contract revision; CatalogRevision is basis revision
ALIASES_LOCAL_IDS_DERIVED_IDS = labels, paths, URLs, branches, digests, and category are not identity
ALIAS_AUTHORITY_AND_FORBIDDEN_SUBSTITUTIONS = caller/source must not replace DOM RepositoryId or producer basis
PROOF_EVIDENCE = SPEC §§12.1, 12.3; source `RegistryEntry.identity`, `CatalogScope`, and `CatalogBasis`
IDENTITY_RESULT = PARTIAL — tuple shape is conformant, but NORMAL producer provenance is not independently established
```

The local identity shape, equality, and opaque RepositoryId transport are
conformant. The `PARTIAL` result is due to the source-provenance finding, not a
new local identifier or display-field substitution.

### Authority provenance and anti-forgery proof

| Capability | Issuer owner required | Consumer check at target | Result |
|---|---|---|---|
| `DOM-EXEC-IDENTITY-SNAPSHOT` | Canonical DOM resolver / SPEC-DOM-001 | Local receipt ledger, expected kind, exact scope, exact requested revision, and frozen basis; no independent DOM issuer proof | `AUTHORITY_STATUS=DEFINED`, `CONTRACT_STATUS=DEFINED`, `LOCAL_TESTABILITY=YES`, `PRODUCTIVE_AVAILABILITY=NO`; productive provenance `NOT_PROVEN` |
| `REPO-EXEC-NORMAL-CATALOG` | Enabled REPO configuration / SPEC-REPO-001 | Local receipt ledger, expected kind/source, exact DOM scope/revision binding, frozen basis; no independent REPO issuer proof | `AUTHORITY_STATUS=DEFINED`, `CONTRACT_STATUS=DEFINED`, `LOCAL_TESTABILITY=YES`, `PRODUCTIVE_AVAILABILITY=NO`; productive provenance `NOT_PROVEN` |
| `UNIT-EXEC-REGISTRY-FIXTURE` | EXEC test support only | Fixture receipt identity, scope, revision, frozen basis | `AUTHORITY_STATUS=DEFINED`, `CONTRACT_STATUS=DEFINED`, `LOCAL_TESTABILITY=YES`, `PRODUCTIVE_AVAILABILITY=NO`; valid local evidence only |

```text
PROOF_ISSUER_OWNER = DOM/REPO for integrated capabilities; EXEC test support for fixture
PROOF_SCOPE = exact execution scope, source, catalog revision, and frozen basis
PROOF_IDENTITY_OR_BRAND = module-private receipt identity plus authenticated basis
CONSUMER_VERIFICATION_RULE = receipt ledger, expected source kind, source marker, scope and revision comparison
STALE_OR_MUTATION_POLICY = stale requested revision and copied/unfrozen material fail locally; integrated mutation semantics unproven
FORGERY_NEGATIVE_TEST = direct fake/copy/subclass tests PASS; exported fixture-factory injection is not rejected
CALLER_INJECTION_NEGATIVE_TEST = direct basis/scope/support-set injection tests PASS; official fixture-factory injection remains accepted
ALTERNATE_ADAPTER_CONTRACT_TEST = fake and wrong-kind adapters rejected; no productive alternate adapter or producer contract execution
ISSUER_IS_AUTHORIZED = NO for productive DOM/REPO paths
PROOF_SCOPE_IS_EXACT = YES locally; integrated producer scope unavailable
CONSUMER_VERIFIES_PROVENANCE = PARTIAL
INPUT_OR_REFERENCE_BINDING = YES locally
MUTATION_OR_STALE_REJECTION = YES locally; integrated stale producer behavior NOT_PROVEN
FORGERY_PATH_REJECTED = PARTIAL
CALLER_INJECTION_REJECTED = NO overall because exported fixture creation is accepted
ALTERNATE_ADAPTER_CONTRACT = PARTIAL
```

The ticket correctly classifies the two foreign capabilities as
`REQUIRED_FOR_INTEGRATED_PROOF`, not local-closure blockers. That classification
is preserved. It does not turn the missing productive producer into a local
READY claim, and it does not make fixture evidence productive availability.

## 5. Cross-spec integration audit

```text
FOREIGN_OWNER_UNCHANGED = YES
DOM_IDENTITY_AND_OUTCOME_CONSUMED_INTACT = PARTIAL
LOCAL_OWNER_LOGIC_REPRODUCED = NO
UNAVAILABLE_OR_INVALID_OUTCOMES_FAIL_CLOSED = YES locally
LOCAL_PERSISTENCE_COMPETING_AUTHORITY = NO
INTENDED_BOUNDARY_USED = YES in application wiring
AUTHORITY_CONSUMPTION_PROOF = PARTIAL
PRODUCER_CONSUMER_CONTRACT_PROOF = DEFINED but not productively executable
PRODUCTIVE_AVAILABILITY_PROMOTION = NO
CROSS_SPEC_RESULT = INTEGRATION_NOT_PROVEN / PARTIAL
```

For NORMAL resolution, `ResolveExecCapability` reads the DOM execution basis,
then reads the REPO catalog and requires equal scope and revision. Bootstrap
uses an independent source and rejects normal category entries at resolution.
These are the intended boundaries. However, all local sources in the target are
fixture factories in `src/application/exec-registry-ports.ts`; no productive
DOM/REPO producer exists at the pinned target. The approved contract itself
records this as integrated-only, so it is a handoff gap rather than a silently
promoted capability.

The public fixture path is still a concrete alternate authority route: the
caller controls `readBasis`, the catalog entries, the scope, and the source
marker, then receives a receipt that the application considers producer-issued.
That route violates the issuer/registrar provenance boundary even though local
fake objects without the factory are rejected.

## 6. Immutability, lineage, legacy, migration, and security

### Immutability

```text
IMMUTABILITY_RESULT = CONFORMANT locally
```

`SemanticVersion`, `SupportedVersionSet`, `CatalogScope`, `RegistryEntry`, and
`CatalogBasis` freeze their values/arrays. `CatalogBasis.register` returns a new
basis and leaves the previous basis unchanged. Duplicate/conflicting entries
are rejected and no local partial mutation occurs. Schema references and entry
arrays are authenticated and frozen by their existing contract boundary.

### Lineage and reconstruction

```text
LINEAGE_RESULT = PARTIAL / OUTSIDE LOCAL PERSISTENCE SCOPE
RECONSTRUCTION_CONTRACT = TICKET-003/PLAT
MUTABLE_HISTORY_REWRITE = NO
LOCAL_PREDECESSOR_DIGEST_OR_DURABLE_CONTINUITY = NOT_IMPLEMENTED
```

The local basis has a monotone `catalogRevision` value and preserves old basis
objects, but it has no persisted digest, predecessor/successor record, ordering
proof, physical CAS, or rehydration validator. The accepted SPEC assigns those
obligations to the registry reconstruction unit and PLAT boundary. This audit
does not count the reserved work as a TICKET-002 violation; it remains an
integrated/downstream boundary that must not be claimed by this ticket.

### Legacy and cutover

```text
LEGACY_AUTHORITY_RESULT = TRANSITION_CONFORMANT within ticket scope
LEGACY_WRITES_STILL_ACTIVE = NO evidence in changed paths
DUAL_LEGACY_WRITERS = 0
ALTERNATE_LEGACY_AUTHORITY = NO
CUTOVER = new semantic version/catalog basis only
```

No legacy registry writer, silent conversion, or REPO migration logic was
introduced. REPO remains the owner of legacy compatibility and explicit
migration. The fixture authority issue is a source-provenance path, not a
legacy-writer transition.

### Destructive transition

```text
DESTRUCTIVE_TRANSITION = NOT_APPLICABLE
REPLACEMENT_PROVEN = NOT_APPLICABLE
CUTOVER_AUTHORIZED = NOT_APPLICABLE
PRE_TRANSITION_GATES_SATISFIED = NOT_APPLICABLE
POST_TRANSITION_GUARDS_PRESENT = NOT_APPLICABLE
ROLLBACK_OR_ROLL_FORWARD_SEMANTICS_DEFINED = NOT_APPLICABLE
```

There is no delete/retire/irreversible migration operation in this ticket.

### Migration and authorization boundaries

```text
MIGRATION_AUTHORITY_RESULT = MIGRATION_AUTHORITY_PRESERVED / NOT_APPLICABLE LOCALLY
SECURITY_AUTHORIZATION_RESULT = NON_CONFORMANT for source provenance and effect boundary; user authorization is outside scope
BACKEND_REMAINS_AUTHORITY = NOT_APPLICABLE to this registry-only unit
CAPABILITY_POSSESSION_USED_AS_USER_AUTHORIZATION = NO direct user-auth claim
LEGACY_ROUTE_BYPASS = NO
CROSS_SPEC_IMPLICIT_ELEVATION = YES risk through accepted fixture source and caller work callback
```

The source receipt path is an architecture-sensitive authorization/provenance
boundary. The application cannot distinguish a test helper-issued receipt from
an owner-issued receipt at runtime. Separately, `resolveBeforeWork` invokes an
arbitrary caller callback after a single basis observation, despite the design
stating that no execution, enablement, persistence, or external effect starts
in this unit. That is audited as a critical temporal/effect boundary below.

## 7. Caller-as-authority and temporal proof

```text
CALLER_AS_AUTHORITY_CHECK = FAIL for fixture-source authority path
CALLER_SUPPLIED_AUTHORITY_BYPASSES = 1
```

Direct caller-supplied `basis`, forged scope, and caller support-set fields are
rejected or ignored. The remaining bypass is stronger than those rejected
shapes: a caller can call the exported fixture factory with a caller-owned
basis and receive a valid source/receipt accepted by the application and
registration path. This is a caller-created authority path, not merely a
caller assertion.

```text
TEMPORAL_AUTHORITY_PROOF = FAIL for `resolveBeforeWork`
TEMPORAL_AUTHORITY_GAPS = 1
```

The approved design declares `TEMPORAL_AUTHORITY_PROOF = NOT_APPLICABLE` only
because the unit is supposed to commit no external effect. The implementation
adds `ResolveExecCapability.resolveBeforeWork`, which reads/validates a source
basis and then invokes a caller-supplied `work` callback when resolution is
successful. There is no second source observation, drift check, owner-bound
execution command, or physical CAS before that callback. The callback may
perform arbitrary work and is not owned by the registry boundary. The bootstrap
negative test proves only that one callback is not called on one rejected
request; it does not make the production callback an authorized effect owner.

## 8. Architecture scope and guards

### Architectural decision classification

| Decision | Classification | Result |
|---|---|---|
| Typed immutable local registry value objects and policies | AUTHORIZED_ARCHITECTURAL_REALIZATION | Preserves EXEC semantic ownership. |
| Separate DOM, REPO, and bootstrap application source ports | AUTHORIZED_ARCHITECTURAL_REALIZATION | Correct cross-spec direction, but productive producer proof is absent. |
| Module-private receipt ledger for local source evidence | IMPLEMENTATION_DETAIL | Useful local contract evidence, insufficient as external issuer proof. |
| Exporting fixture constructors from production source/domain modules | UNAUTHORIZED_ARCHITECTURAL_EXPANSION | Creates an accepted caller-controlled source/authority path. |
| `resolveBeforeWork` invoking a caller callback from the registry application | UNAUTHORIZED_ARCHITECTURAL_EXPANSION | Contradicts the design's no-effect boundary and leaves effect ownership/temporal proof unresolved. |
| Physical persistence, reconstruction, CAS, or migration | NOT_APPLICABLE / RESERVED | Correctly not implemented here. |

### Required architecture guards

```text
MISSING_ARCHITECTURE_GUARDS = 0 for the explicitly required import/common-path guard
ARCHITECTURE_GUARD_TESTS_RUN = 2
ARCHITECTURE_GUARD_EVIDENCE =
  1. `productive registry graph has no infrastructure, prototype, transport or generic bucket dependency`
     passed against source text.
  2. `exec registry architecture guard imports the real graph and exercises the common path`
     dynamically imported domain/application/ports/composition and resolved a real common-path capability.
```

The existing guard evidence is executable and directly runs. It does not cover
the newly identified public fixture-authority route or no-effect callback
boundary; those are findings and require direct negative/ownership witnesses
in their correction path, but they are not counted as a missing guard that the
approved design explicitly required.

## 9. Systemic boundary expansion

### Campaign A — authority provenance

```text
ROOT_CAUSE_CAMPAIGN_ID = RCC-EXEC-T002-AUTHORITY-PROVENANCE-002
ROOT_CAUSE_ID = PUBLIC_LOCAL_FIXTURE_CAN_MINT_ACCEPTED_FOREIGN_AUTHORITY_RECEIPTS
CAMPAIGN_STATUS = OPEN
CAMPAIGN_SCOPE = EXEC-001-TICKET-002 source, registry registration, NORMAL/BOOTSTRAP authority and local-to-integrated handoff
CANONICAL_FINDINGS = ARCH-MAJOR-001
CAMPAIGN_MATRIX_COMPLETE = YES
ALL_SURFACE_ROWS_COVERED = NO
ALL_NEGATIVE_WITNESSES_PASS = NO
NO_UNEXPLAINED_PUBLIC_AUTHORITY_PATH = NO
NO_HIDDEN_CONCRETE_PROTOCOL = NOT_APPLICABLE
ROOT_CAUSE_REMOVED = NO
KNOWN_MANIFESTATIONS_CLOSED = NO
SYSTEMIC_TEST_EVIDENCE = PRESENT_BUT_INCOMPLETE
```

| Surface row | Class | Location/owner | Normative obligation | Current behavior | Expected behavior | Coverage | Negative witness |
|---|---|---|---|---|---|---|---|
| A-01 | ISSUER | `src/application/exec-registry-ports.ts:47-70`, EXEC source boundary | Only DOM/REPO/system owner may issue authority-bearing source proof. | The module issues a receipt for any basis returned by a caller callback. | Issuer must be owner-bound, or fixture issuance must be test-only and non-productive. | MISSING | Official fixture factory injection is accepted. |
| A-02 | REGISTRAR | `src/application/exec-registry.ts:157-189`, EXEC registrar | Registration must consume authorized producer/registrar material. | `RegisterExecCapability` accepts any receipt accepted by the local ledger, including a public fixture receipt. | Caller-created bases cannot be published as canonical registry material. | MISSING | Hand-built basis is rejected, but factory-created basis is not. |
| A-03 | CONSUMER | `ResolveExecCapability.selectBasis/assertAuthorizedBasis`, EXEC consumer | Consumer verifies issuer provenance, scope, revision, and failure/stale semantics. | Scope/revision/source marker and local receipt identity are checked; canonical issuer owner is not. | Consumer must verify an independently issued DOM/REPO/system proof. | PARTIAL | Fake/copy/wrong-kind rejected; factory-issued caller basis accepted. |
| A-04 | ALTERNATE_AUTHORITY_PATH | `createCatalogBasisFixture` and `createLocal*Fixture` exports | Fixtures cannot become productive authority or alternate canonical source. | Caller can create a genuine local basis and source receipt through exported helpers. | Test fixtures must be isolated from productive composition or carry no accepted authority. | MISSING | No test rejects the official helper path. |
| A-05 | INJECTION_POINT | `createLocalSourceFixture(readBasis)` | Caller cannot inject authoritative scope/source/entries. | `readBasis` is caller-controlled and determines scope, source, and entries. | Productive source must obtain basis from its owner, not caller callback. | MISSING | Direct caller source subclass is rejected, but helper injection succeeds. |
| A-06 | MUTATION_PATH | `CatalogBasis`, source receipt | Frozen basis and source mutation must fail closed. | Basis and receipt are frozen; old basis remains unchanged. | Preserve local no-mutation behavior and add owner-bound source semantics. | COVERED locally | Duplicate/conflict and frozen-basis tests pass. |
| A-07 | STALE_PATH | `assertAuthorizedBasis` | Stale requested revision must fail closed without mutation. | Requested revision must equal returned basis revision. | Preserve and extend with producer-issued stale evidence. | COVERED locally / MISSING integrated | Stale revision test passes locally. |
| A-08 | PORT_SUBSTITUTION_PATH | `ExecutionCatalogBasisReader`, `NormalCatalogSource`, bootstrap port | Alternate adapters must satisfy the same provenance contract. | Hand-built/copy/wrong-kind adapters fail; factory-created adapter satisfies it. | Alternate adapters must prove owner issuance, not just helper membership. | PARTIAL | Wrong-kind and copied receipt tests pass; factory alternate passes. |
| A-09 | PUBLIC_EXPORT | `src/application/exec-registry-ports.ts:80-104`; `src/domain/exec-registry.ts:573-575` | Public product exports must not expose authority minting paths. | Fixture constructors are exported from included production modules. | Move to test support or make productive path reject fixture source type. | MISSING | No public-export negative guard. |
| A-10 | PERSISTENCE | TICKET-003/PLAT | Durable integrity/continuity remains with owning boundary. | No persistence/reconstruction implemented. | Keep outside TICKET-002 and preserve owner route. | OUTSIDE_SCOPE — owner/route recorded | N/A. |
| A-11 | RETRY_RECOVERY | TICKET-003/PLAT | Recovery cannot promote detached/stale material. | No local retry/recovery path. | Downstream validator must retain this boundary. | OUTSIDE_SCOPE — owner/route recorded | N/A. |
| A-12 | LEGACY_ROUTE | REPO legacy compatibility | Legacy reads/writes cannot regain EXEC authority. | No legacy route introduced. | Preserve REPO legacy owner and no silent conversion. | COVERED | No changed legacy writer. |
| A-13 | ARCHITECTURE_GUARD | `tests/exec-001-ticket-002.test.ts:500+` | Required graph guard must execute and reject forbidden dependencies. | Import/common-path guards run, but no fixture-authority negative. | Add direct guard for productive fixture use if fixture remains in source. | PARTIAL | Existing two guards pass; authority route unguarded. |
| A-14 | TEST | `tests/exec-001-ticket-002.test.ts:363-467` | Forgery, caller injection, stale, mutation, and alternate-adapter witnesses must be direct. | Fake/copy/subclass/stale witnesses exist. | Add official factory-injection negative and productive producer positive. | MISSING | Missing direct witness for public factory misuse. |

### Campaign B — effect ownership and temporal authority

```text
ROOT_CAUSE_CAMPAIGN_ID = RCC-EXEC-T002-EFFECT-BOUNDARY-001
ROOT_CAUSE_ID = REGISTRY_APPLICATION_INVOKES_CALLER_WORK_AFTER_SINGLE_AUTHORITY_OBSERVATION
CAMPAIGN_STATUS = OPEN
CAMPAIGN_SCOPE = EXEC-001-TICKET-002 resolution-to-work boundary
CANONICAL_FINDINGS = ARCH-CRITICAL-001
CAMPAIGN_MATRIX_COMPLETE = YES
ALL_SURFACE_ROWS_COVERED = YES for the applicable local scope
ALL_NEGATIVE_WITNESSES_PASS = NO
NO_UNEXPLAINED_PUBLIC_AUTHORITY_PATH = NO
NO_HIDDEN_CONCRETE_PROTOCOL = NOT_APPLICABLE
ROOT_CAUSE_REMOVED = NO
KNOWN_MANIFESTATIONS_CLOSED = NO
SYSTEMIC_TEST_EVIDENCE = PRESENT_BUT_INCOMPLETE
```

| Surface row | Class | Location/owner | Current behavior | Expected behavior | Coverage |
|---|---|---|---|---|---|
| B-01 | ISSUER | `RegistryResolutionService` / EXEC | Issues a local resolved result; result is valid local semantic evidence. | Effect owner must independently consume a result and bind it to execution authority. | OUTSIDE_SCOPE handoff for effect owner |
| B-02 | REGISTRAR | No registration in this path | Not applicable. | No registrar should be added to effect invocation. | NOT_APPLICABLE |
| B-03 | CONSUMER | `ResolveExecCapability.resolveBeforeWork:67-70` | Consumes result and immediately calls arbitrary callback. | Registry returns a result only; lifecycle/effect owner invokes work. | MISSING |
| B-04 | ALTERNATE_AUTHORITY_PATH | Public `resolveBeforeWork` | Provides an alternate resolution-to-work execution route. | No registry-owned work route. | MISSING |
| B-05 | INJECTION_POINT | `work: () => void` parameter | Caller supplies arbitrary work closure. | Work command belongs to authorized execution/session owner. | MISSING |
| B-06 | MUTATION_PATH | Source reads at `selectBasis:104-124`, then callback | No second observation or CAS before callback. | Freshness/drift/effect binding at owning boundary. | MISSING |
| B-07 | STALE_PATH | `resolveBeforeWork` | A valid result can be followed by callback after mutable source drift. | Fail closed or owner-bound atomic effect semantics. | MISSING |
| B-08 | PORT_SUBSTITUTION_PATH | Callback parameter and source ports | Any callback can be substituted. | No callback port in registry; explicit owner contract. | MISSING |
| B-09 | PUBLIC_EXPORT | `ResolveExecCapability` class and method | Method is publicly callable from production application module. | Public API exposes pure resolution only. | MISSING |
| B-10 | PERSISTENCE | No local persistence | Not applicable. | PLAT/TICKET-003 remains owner. | NOT_APPLICABLE |
| B-11 | RETRY_RECOVERY | No local retry/recovery | Not applicable. | Downstream owner handles effect retry. | NOT_APPLICABLE |
| B-12 | LEGACY_ROUTE | No legacy effect route | None introduced. | Preserve no legacy bypass. | COVERED |
| B-13 | ARCHITECTURE_GUARD | No explicit no-effect guard in ticket guard | Existing import/common-path guard does not assert no callback/effect. | If method remains, executable owner/no-effect guard is required; preferred correction removes method. | MISSING |
| B-14 | TEST | `tests/exec-001-ticket-002.test.ts:270-294` | Only rejected bootstrap callback is witnessed. | Pure result and downstream owner gate must be tested. | PARTIAL |

## 10. Findings

### ARCH-CRITICAL-001 — Registry resolution invokes a caller-supplied work effect without temporal authority proof

```text
Severity = CRITICAL
Ticket = EXEC-001-TICKET-002
Normative authority =
  ADR-0003 decision and consequences (EXEC contract/registry does not own execution effects);
  SPEC-EXEC-001 §10 Does Not Implement and §§12.1, 12.4, 13;
  approved Implementation Design §§4, 7, 17–18, especially §17 step 6:
  "no execution, enablement, persistence or external effect starts";
  authority-completeness temporal-authority contract
Owner = EXEC-001 for resolution semantics; DOM/EXEC-002/REPO/PLAT owners for execution, enablement, session and effects
Affected boundary = ResolveExecCapability → execution/lifecycle/effect owner
Repository evidence = src/application/exec-registry.ts:62-70 defines public `resolveBeforeWork(input, work)` and invokes `work()` whenever the resolver returns RESOLVED; source authority is observed in `selectBasis` at lines 104-124 only once before this callback.
Test evidence = tests/exec-001-ticket-002.test.ts:270-294 proves only that one caller callback is not invoked for one rejected BOOTSTRAP normal-capability request. It does not prove owner authorization, fresh authority observation, drift rejection, CAS, or that successful work remains outside this module.
Problem = The implementation adds an effect-execution path to a registry unit whose approved design explicitly returns a structured resolution result and starts no execution/effect. The caller supplies an arbitrary callback, and the path has no second observation, temporal drift check, session/lifecycle authorization, or effect-owner contract.
Impact = A caller can route a resolved capability directly into arbitrary work from the registry application boundary. If source authority changes after the single read, the callback may act on stale basis context. This is an unauthorized architectural expansion and a temporal authority gap, even though the bootstrap negative callback test passes.
Minimum correction required = Remove production callback invocation from the registry boundary and expose only the pure resolution result. The authorized execution/session/effect owner must consume that result and perform its own temporal authority proof and effect binding; if a local no-work witness is retained, keep it test-only and non-effectful.
Systemic pattern = NO
Related locations = src/application/exec-registry.ts:51-70; tests/exec-001-ticket-002.test.ts:270-294; Implementation Design §§4, 17–18; ticket §§10, 15, 18
ROOT_CAUSE_CAMPAIGN_ID = RCC-EXEC-T002-EFFECT-BOUNDARY-001
```

### ARCH-MAJOR-001 — Exported fixture factories can mint accepted source authority for caller-created catalog bases

```text
Severity = MAJOR
Ticket = EXEC-001-TICKET-002
Normative authority =
  ADR-0003 registry/bootstrap decision;
  SPEC-EXEC-001 §§12.1, 12.3–12.4, EXEC-REGISTRY-001/002/003 and EXEC-CAPABILITY-001/002;
  approved Implementation Design §§7, 10, 16–17;
  ticket §§10, 14a–14b, 15;
  authority-provenance anti-forgery contract
Owner = EXEC-001 for the consumer/registrar boundary; DOM owns NORMAL RepositoryId/execution basis; REPO owns enabled NORMAL catalog; system bootstrap owner owns BOOTSTRAP source
Affected boundary = source issuer → application consumer → registry registrar/publication → NORMAL/BOOTSTRAP canonical authority
Repository evidence =
  (1) src/domain/exec-registry.ts:420-431 and 573-575 publicly construct an authenticated `CatalogBasis` from caller-provided scope, source, revision and entries;
  (2) src/application/exec-registry-ports.ts:56-72 adds any `readBasis` callback's result to the module's authenticated source/receipt ledgers;
  (3) src/application/exec-registry-ports.ts:80-104 exports the local fixture factories from a production module;
  (4) src/application/exec-registry.ts:135-148 and 172-187 accept the resulting receipt as producer-issued for resolution and registration;
  (5) a direct target-state probe calling `createLocalNormalCatalogFixture(() => createCatalogBasisFixture({scope: CatalogScope.normal('caller-owned'), source: 'REPO_NORMAL_CATALOG'}))` produced `accepted=true`, `scope=caller-owned`, `source=REPO_NORMAL_CATALOG` from `isProducerIssuedCatalogBasisReceipt`.
Test evidence = tests/exec-001-ticket-002.test.ts:363-407 rejects hand-built fake/copy/wrong-kind sources, and lines 428-443 rejects a raw basis passed as the source. It does not reject a caller using the official exported fixture factory. The synthetic registration test at lines 320-338 uses exactly this accepted fixture-source path.
Problem = The local ledger proves that the module's fixture helper issued a receipt, not that the canonical DOM, REPO, or system producer issued the material. Because the helper is publicly exported from included production modules, a caller controls the basis scope, source marker, revision, and entries and can obtain a receipt accepted by both `ResolveExecCapability` and `RegisterExecCapability`.
Impact = Caller-created or test-created material can appear to be canonical registry authority, bypassing foreign identity/source ownership at the public source and registrar seam. The target's explicit `PRODUCTIVE_AVAILABILITY=NO` for DOM/REPO is preserved, but the local fixture cannot be treated as a productive consumer seam and the integrated authority handoff remains unproven.
Minimum correction required = Isolate fixture construction in test support or make fixture sources impossible to pass to productive composition/registration; require an owner-bound producer/registrar proof for integrated DOM/REPO/bootstrap sources; add a direct negative witness for official fixture-factory injection and a positive producer-issued witness. Do not promote productive availability from the local fixture.
Systemic pattern = YES
Related locations = src/domain/exec-registry.ts:401-431, 573-575; src/application/exec-registry-ports.ts:43-125; src/application/exec-registry.ts:73-189; src/composition/exec-registry.ts:1-26; tests/exec-001-ticket-002.test.ts:320-338, 363-467
ROOT_CAUSE_CAMPAIGN_ID = RCC-EXEC-T002-AUTHORITY-PROVENANCE-002
```

## 11. Final audit summary

```text
Audit: .pi/runtime/workflow-audits/cf3f4999-1f37-481b-a706-8ccc94dc7358/architecture-EXEC-001-TICKET-002-architecture-boundaries-audit.md

Specialist:
ARCHITECTURE_BOUNDARIES

Ticket: EXEC-001-TICKET-002

Ownership errors: 2

Foreign capability duplication: 0

Authority violations: 1

Identity violations: 0

Immutability/lineage violations: 0

Legacy authority violations: 0

Architectural authority gaps: 0
Authority consumption gaps: 2
Producer/consumer contract errors: 0
Temporal authority gaps: 1
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
```

The two authority-consumption gaps are the DOM and REPO integrated producer
handoffs. Their authority and contract are defined, local fixture testability is
present, and productive availability remains `NO`; they are not silently
converted into local blockers or productive claims. The architecture result is
findings because the public fixture route is an alternate authority path and the
production callback violates the no-effect/temporal boundary.

AUDIT_TARGET_HEAD: 8b6fe86b0f6370094e630b7272c98a490518cfac
AUDIT_TARGET_STATE_FINGERPRINT: b61bd4448910d5260c149cc29396e6b67eb3b1f623b7d81b15e9f9802baf0bab
AUDIT_WAVE_ID: cf3f4999-1f37-481b-a706-8ccc94dc7358
DOMAIN_AUDIT_COMPLETE: YES
SPECIALIST_RESULT: SPECIALIST_ARCHITECTURE_FINDINGS