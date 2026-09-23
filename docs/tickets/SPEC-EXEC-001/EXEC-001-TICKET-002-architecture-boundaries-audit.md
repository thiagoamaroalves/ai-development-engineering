# Architecture Boundaries Audit — EXEC-001-TICKET-002

## Audit identity

```text
TICKET_ID = EXEC-001-TICKET-002
TICKET_PATH = docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-version-registry-catalogs-capabilities.md
IMPLEMENTATION_UNIT = EXEC-IMP-02
IMPLEMENTATION_DESIGN = docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-implementation-design.md
TICKET_SET_AUDIT = docs/tickets/SPEC-EXEC-001/implementation-ticket-audit.md
IMPLEMENTATION_BASELINE = 8f62b283b1dbf487911c7c459db95cadc25ff101
AUDIT_TARGET_HEAD = c450df1c4523a841484cbf1acb8cd1ab57621017
CURRENT_HEAD = c450df1c4523a841484cbf1acb8cd1ab57621017
AUDIT_TARGET_STATE_FINGERPRINT = d91db0e8d277c66499d9d4fd5dc0a05818aeb7d39faf1303876abc8e6d165192
AUDIT_WAVE_ID = 72e54edf-031a-436b-9c04-82f31bc2a04b
WORKTREE_AT_AUDIT = CLEAN
AUDIT_MODE = READ_ONLY; INDEPENDENT; ADVERSARIAL; ARCHITECTURE_FIRST; OWNERSHIP_PRESERVING; CROSS_SPEC_AWARE; IDENTITY_AWARE; LEGACY_TRANSITION_AWARE
```

Changed files at the target commit:

- `docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-checkpoints/EXEC-001-TICKET-002-remediation-checkpoint-round-5.md`
- `docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-implementation-remediation.md`
- `docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-version-registry-catalogs-capabilities.md`
- `docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/AC-EXEC-003-semver.md`
- `docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/AC-EXEC-005-registry-contribution.md`
- `docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/AC-EXEC-007-registry-contribution.md`
- `docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/AC-EXEC-008-deterministic-resolution.md`
- `docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/AC-EXEC-009-catalog-isolation.md`
- `docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/AC-EXEC-010-bootstrap-allowlist.md`
- `docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/AC-EXEC-011-failure-distinction.md`
- `docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/AC-EXEC-012-registry-extensibility.md`
- `src/application/exec-registry.ts`
- `src/domain/exec-registry.ts`
- `tests/exec-001-ticket-002.test.ts`
- `tests/exec-registry-import-boundary-loader.mjs`
- `tests/fixtures/exec-registry-forbidden-import.mjs`

## Source precedence and reconstructed contract

Authority was read and applied in this order:

```text
ADR-0003 / related accepted ADRs
↓ SPEC-PORTFOLIO-001 ownership and dependency contracts
↓ SPEC-EXEC-001 revision 3 and its conformant audit
↓ validated Gap Matrix and audited Implementation Plan
↓ approved ticket and implementation design
↓ repository implementation and tests
```

Normative sources:

- `docs/adrs/ADR-0003-versioned-skill-contracts.md`, revision 3, `ACCEPTED`.
- `docs/adrs/ADR-0010-repository-configuration-and-legacy-migration.md`, revision 3, `ACCEPTED`.
- `docs/adrs/ADR-0001-workflow-domain-and-identity.md`, revision 3, `ACCEPTED`.
- `docs/specs/SPEC-PORTFOLIO-001-organization.md`, O-017 and O-020.
- `docs/specs/SPEC-EXEC-001-skill-contracts-and-capability-registry.md`, especially §§2, 10, 12.1, 12.3–12.4, 13–18, 20–23.
- `docs/specs/SPEC-DOM-001-workflow-authority-and-governance.md`, `DOM-ID-001` and `DOM-SNAPSHOT-001`.
- `docs/specs/implementation-plans/SPEC-EXEC-001-implementation-plan.md`, `EXEC-IMP-02`.
- Ticket §14a–§14c and implementation design §§7, 16–18, 20–22.

Reconstructed contract:

```text
LOCAL_OWNER = EXEC-001
LOCAL_AUTHORITIES = semver/support-set meaning; versioned registry mapping;
  NORMAL/BOOTSTRAP catalog semantic separation; bootstrap allowlist;
  UNKNOWN_CAPABILITY versus INCOMPATIBLE_CAPABILITY; common registry extensibility
FOREIGN_OWNERS = DOM (RepositoryId and execution/snapshot identity);
  REPO (enabled NORMAL configuration/catalog and legacy migration);
  PLAT (physical persistence, integrity, ordering and recovery)
FOREIGN_CAPABILITIES_CONSUMED = DOM-EXEC-IDENTITY-SNAPSHOT;
  REPO-EXEC-NORMAL-CATALOG
CANONICAL_IDENTITIES = NORMAL entry key is
  (CatalogScope=NORMAL, DOM RepositoryId, SkillContractId, CapabilityId,
   SchemaId, SemanticVersion); BOOTSTRAP is system-scoped without RepositoryId
IMMUTABILITY_RULES = registration creates a new basis; frozen bases and entries
  are never edited; duplicate/conflict registration fails without mutation
LINEAGE_RULES = SemanticVersion and CatalogRevision are distinct; physical and
  semantic reconstruction/continuity belong to TICKET-003/PLAT and are not
  closed by this ticket
LEGACY_AUTHORITY_RULES = REPO owns legacy compatibility/migration; no legacy
  registry writer is introduced
CUTOVER_RULES = incompatible semantic/catalog change requires a new version or
  basis; existing frozen execution bases are not rewritten
MIGRATION_AUTHORITY = bootstrap is limited to onboarding categories; REPO owns
  enablement and migration lifecycle
SECURITY_BOUNDARIES = no authentication/authorization obligation is allocated
  to EXEC-001; provenance and anti-forgery remain required architecture guards
DOES_NOT_IMPLEMENT = DOM identity/lifecycle, REPO enablement, sessions,
  persistence/recovery, effects, transport/UI/OPS mappings
```

## Applicability matrix

| Dimension | Result | Evidence/reason |
|---|---|---|
| OWNERSHIP | REQUIRED | EXEC owns registry/version/catalog meaning; DOM, REPO and PLAT are explicit foreign owners. |
| CANONICAL_AUTHORITY | REQUIRED | Registry resolution and canonical capability outcomes are EXEC-owned. |
| CROSS_SPEC_INTEGRATION | AFFECTED | DOM and REPO ports are present, but their productive producers are integrated-proof-only and unavailable at this target. |
| IDENTITY | REQUIRED | NORMAL/BOOTSTRAP scope, RepositoryId, registry key and CatalogRevision affect lookup identity. |
| IMMUTABILITY | REQUIRED | `CatalogBasis.register` must not mutate a frozen basis or entry. |
| LINEAGE | AFFECTED | CatalogRevision is carried and incremented; semantic reconstruction/digest continuity is explicitly TICKET-003/PLAT scope. |
| LEGACY_TRANSITION | AFFECTED | New canonical registry path is introduced; REPO remains the legacy compatibility owner. |
| DESTRUCTIVE_TRANSITION | NOT_APPLICABLE | No delete, overwrite, retirement, irreversible migration or in-place replacement is implemented. |
| MIGRATION_AUTHORITY | AFFECTED | Bootstrap onboarding categories are enforced, while repository enablement/migration remains REPO-owned. |
| SECURITY_AUTHORIZATION | NOT_APPLICABLE | SPEC-EXEC-001 §20 allocates no auth or secret obligation; this audit still evaluates provenance/authority, which is distinct from authorization. |

## Ownership and canonical authority audit

The domain/application/composition split is an authorized realization. `SemanticVersion`, `SupportedVersionSet`, `CatalogScope`, `RegistryEntry`, `CatalogBasis`, compatibility and allowlist policies are located in `src/domain/exec-registry.ts`; use-case coordination and source selection are in `src/application/exec-registry.ts`; source ports are in `src/application/exec-registry-ports.ts`; wiring is in `src/composition/exec-registry.ts`. No DOM lifecycle, REPO enablement or PLAT persistence decision is duplicated.

The local immutable behavior is conformant: `CatalogBasis.register` checks authenticated entries, rejects an existing immutable identity, increments a branded `CatalogRevision`, returns a new basis and leaves the old basis unchanged (`src/domain/exec-registry.ts:461-467`). The focused suite directly verifies duplicate/conflict rejection and prior-basis identity preservation.

The authority boundary is not fully preserved. `CatalogBasis.createFixture` is implemented in the production domain module and is publicly exported through `createCatalogBasisFixture` (`src/domain/exec-registry.ts:448-458, 646-654`). It accepts caller-supplied scope, source and authenticated entries, brands the resulting basis as an authenticated `CatalogBasis`, and `RegistryResolutionService.resolve` accepts any such branded basis (`src/domain/exec-registry.ts:578-580, 689-690`). The application layer rejects fixture sources (`src/application/exec-registry.ts:86, 102-105, 185-190`), but the public domain resolver path bypasses that control.

Independent direct witness at the pinned target:

```text
callerBasis = createCatalogBasisFixture({ scope: CatalogScope.normal('caller'), source: 'CALLER' }).register(validEntry)
new RegistryResolutionService().resolve(callerBasis, validRequest)
OBSERVED = directFixtureBasisSource=CALLER; directResult=true; directResultBasisSource=CALLER
```

Thus a caller can manufacture an authenticated-looking catalog basis and obtain a `RESOLVED` result without a DOM/REPO producer or frozen execution source. This is a caller-supplied authority bypass and an alternate authority path, not merely an unavailable integrated producer. The same root cause is visible in the synthetic `failureBasis` path (`src/application/exec-registry.ts:156-166`), which places a caller-derived scope in a branded `CatalogBasis` with source `EXEC_FAILURE_CONTEXT` when no authoritative source is available.

Classification:

```text
OWNERSHIP = OWNERSHIP_LEAKAGE (public fixture/consumer path can act as a second registry issuer)
CANONICAL_AUTHORITY = ALTERNATE_AUTHORITY_INTRODUCED
FOREIGN_CAPABILITY_DUPLICATED = 0
AUTHORITY_RECOMPUTED_LOCALLY = 0
REPOSITORY_SEMANTIC_AUTHORITY = NO
```

`RegisterExecCapability` does not currently publish to a productive source: the port is read-only and local fixture sources are rejected (`src/application/exec-registry.ts:174-203`). It therefore does not falsely establish productive availability at this target, but its `REGISTERED` result is a candidate basis rather than proof of canonical source publication. This remains an integrated/source-publication boundary to be closed by the authorized producer/persistence work, not a local closure promotion.

## Cross-spec authority consumption and producer/consumer proof

| Capability | Truth owner / producer | Consumer and contract | Authority / contract | Local / productive | Class | Result |
|---|---|---|---|---|---|---|
| `DOM-EXEC-IDENTITY-SNAPSHOT` | DOM canonical resolver | T002 source reader; exact RepositoryId, execution basis and CatalogRevision | DEFINED / DEFINED | NO / NO | REQUIRED_FOR_INTEGRATED_PROOF | `AUTHORITY_CONSUMPTION_GAP` for integrated proof only; no local closure blocker |
| `REPO-EXEC-NORMAL-CATALOG` | enabled REPO configuration | T002 normal source; repository-scoped NORMAL basis and revision | DEFINED / DEFINED | NO / NO | REQUIRED_FOR_INTEGRATED_PROOF | `AUTHORITY_CONSUMPTION_GAP` for integrated proof only; no local closure blocker |
| `UNIT-EXEC-REGISTRY-FIXTURE` | EXEC test support | direct local contract tests; deterministic basis/result only | DEFINED / DEFINED | YES / NO | INFORMATIONAL | `CONTRACT_TESTABLE_LOCALLY`; never productive availability |

The source-port code provides source-kind and receipt checks (`src/application/exec-registry-ports.ts:109-138`), and the focused tests reject raw sources, copied receipts, matching-source forgery, DOM substitution, stale revisions and wrong source labels. However, no productive issuer is available at the target and the exported port module exposes no productive receipt-issuance operation; therefore the external capabilities remain `INTEGRATION_NOT_PROVEN`. This is consistent with the ticket's explicit integrated-only dependency class and does not block local closure. A fixture is not counted as a productive producer.

`AUTHORITY_CONSUMPTION_PROOF = PARTIAL_FOR_INTEGRATION; COMPLETE_FOR_LOCAL_SEMANTICS`
`PRODUCER_CONSUMER_CONTRACT_PROOF = CONTRACT_DEFINED; PRODUCTIVE_AVAILABILITY_NOT_PROVEN`

## Identity, immutability and lineage

### Aggregate identity proof

```text
AGGREGATE_ROOT = REGISTRY_ENTRY
CANONICAL_IDENTITY = NORMAL:(CatalogScope=NORMAL, DOM RepositoryId,
  SkillContractId, CapabilityId, input SchemaId/version, SemanticVersion);
  BOOTSTRAP:(CatalogScope=BOOTSTRAP, SkillContractId, CapabilityId,
  input SchemaId/version, SemanticVersion)
IDENTITY_AUTHORITY_SOURCE = EXEC registry semantics; NORMAL RepositoryId must
  come from DOM; BOOTSTRAP is the independent system catalog
IDENTITY_KIND_OR_TYPE = REGISTRY_ENTRY
IDENTITY_SCOPE = NORMAL repository scope or BOOTSTRAP system scope
STABLE_CORRELATION_FIELDS = stage, output schema, artifacts, verdicts, roles,
  source and CatalogRevision; these are not substitutes for identity
CREATION_RULE = register only an absent authenticated complete key
COMMAND_REPRESENTATION = registration/new immutable basis operation
REPOSITORY_LOOKUP_REPRESENTATION = complete scoped key and requested frozen basis
PERSISTED_REPRESENTATION = NOT_APPLICABLE in T002; PLAT/TICKET-003 own material
REHYDRATED_REPRESENTATION = NOT_APPLICABLE in T002; semantic validator is T003
EQUALITY_AND_CONTINUITY_SEMANTICS = equal scoped key/version is one immutable
  entry; basis registration creates a successor value
REVISION_RELATIONSHIP = SemanticVersion is contract revision; CatalogRevision
  is basis revision and is distinct from persistence revision
ALIASES_LOCAL_IDS_DERIVED_IDS = names, labels, paths, branch, URL, digest and
  correlation are not identity
ALIAS_AUTHORITY_AND_FORBIDDEN_SUBSTITUTIONS = caller, fixture, projection,
  detached material and foreign source cannot replace the producer-bound basis
PROOF_EVIDENCE = SPEC-EXEC-001 §§12.1, 12.3; code and direct tests above
RESULT = PARTIAL: identity rules are correct on the application source path,
  but public fixture-to-domain resolution bypasses producer authority
```

Identity is therefore classified `VIOLATED` for the exposed direct path (one violation). The NORMAL/BOOTSTRAP scope values themselves are immutable and correctly separated when the approved application path is used.

### Immutability proof

`SemanticVersion`, `SupportedVersionSet`, `CatalogRevision`, `CatalogScope`, entries, bases and results are frozen or contain frozen collections. Registration is append-by-new-basis, duplicate/conflict failure does not mutate the predecessor, and the tests pass the no-mutation witnesses. `IMMUTABILITY = CONFORMANT` within the local in-process scope. The authority defect above is provenance/ownership, not an observed mutation of historical basis.

### Lineage and reconstruction proof

`CatalogRevision` is a branded value object and `register` advances it monotonically within a newly created local basis. The target does not implement persistence, digest validation, source reconstruction, skipped/out-of-order history validation or rehydration; those are explicitly owned by TICKET-003/PLAT. This is `LINEAGE = PARTIAL / DEFERRED_BY_APPROVED_SCOPE`, not a T002 lineage violation. A fixture basis must not be treated as a rehydrated canonical basis; the direct public path currently fails that boundary, as reported in `ARCH-CRITICAL-001`.

```text
AGGREGATE_RECONSTRUCTION_PROOF = NOT_CLOSED_IN_T002; approved owner TICKET-003
CAN_UNTRUSTED_OR_DETACHED_PERSISTED_MATERIAL_BE_MATERIALIZED_DIRECTLY_AS_VALID_DOMAIN_STATE? = NO on approved application path; direct fixture path is an authority escape
MUTATION_ON_FAILURE = NO for tested registration/resolution failures
```

## Legacy, cutover, destructive transition and migration audit

```text
LEGACY_RESULT = TRANSITION_CONFORMANT
NEW_CANONICAL_PATH = EXEC registry/version/catalog resolver
LEGACY_COMPATIBILITY = REPO consumer; no legacy EXEC writer found
REMOVE_ALTERNATE_AUTHORITY = REQUIRED; the fixture direct path is the finding
MIGRATE_EXISTING_STATE = NOT_APPLICABLE to this in-process ticket
DESTRUCTIVE_TRANSITION = NOT_APPLICABLE; no irreversible state transition exists
REPLACEMENT_PROVEN = NOT_APPLICABLE
CUTOVER_AUTHORIZED = NOT_APPLICABLE
PRE_TRANSITION_GATES_SATISFIED = NOT_APPLICABLE
POST_TRANSITION_GUARDS_PRESENT = NOT_APPLICABLE
ROLLBACK_OR_ROLL_FORWARD_SEMANTICS_DEFINED = NOT_APPLICABLE
MIGRATION_AUTHORITY = PRESERVED; REPO retains onboarding/enablement and legacy migration
```

No legacy route, old registry writer, silent conversion or destructive cutover is introduced by the changed production files.

## Temporal authority, caller authority and authorization

```text
TEMPORAL_AUTHORITY_PROOF = NOT_APPLICABLE for local T002 operations: an
  immutable local basis is read and no external effect is committed
TEMPORAL_AUTHORITY_GAPS = 0
CALLER_AS_AUTHORITY_CHECK = FAIL for the direct exported fixture/domain route;
  PASS for the application source-selected path
CALLER_SUPPLIED_AUTHORITY_BYPASS = YES (one consolidated bypass)
SECURITY_AUTHORIZATION = NOT_APPLICABLE per SPEC-EXEC-001 §20
```

## Architecture guards and systemic boundary expansion

The target has two executable architecture guards with direct evidence:

1. `exec registry architecture boundary loader rejects forbidden dependency introduction` passed; the loader rejected `tests/fixtures/exec-registry-forbidden-import.mjs` and allowed the real composition import.
2. `exec registry architecture guard imports the real graph and exercises the common path` passed; it loaded domain/application/ports/composition and exercised the registry composition path.

The source-inspection import test also passed, but source inspection is not counted as executable architecture proof. No guard exercises the forbidden caller-created fixture basis through the direct domain resolver. The required import guard is present; the authority-route guard is missing.

```text
MISSING_ARCHITECTURE_GUARDS = 1 (public fixture-to-resolver alternate-authority route)
ARCHITECTURE_GUARD_TESTS_RUN = 2 executable guards
ARCHITECTURE_GUARD_EVIDENCE = focused target suite, 23/23 passed; root suite 71/71 passed
ARCHITECTURAL_AUTHORITY_GAP_DISCOVERED = NO; normative authority exists, but the implementation exposes an unauthorized path
```

### Root-cause campaign

```text
ROOT_CAUSE_CAMPAIGN_ID = RCC-EXEC-REGISTRY-PROVENANCE-001
ROOT_CAUSE_ID = EXEC-REGISTRY-AUTHORITY-PATH-UNSEALED
CAMPAIGN_STATUS = OPEN
CAMPAIGN_SCOPE = EXEC-001-TICKET-002 at AUDIT_TARGET_HEAD
CANONICAL_FINDINGS = ARCH-CRITICAL-001
```

| Row | Surface class | Location | Owner | Normative obligation | Current behavior | Expected behavior | Related finding / AC | Coverage | Negative witness |
|---|---|---|---|---|---|---|---|---|---|
| RCC-001 | ISSUER | `src/domain/exec-registry.ts:448-458,652-654` | EXEC-001 | Only producer-bound basis may establish registry authority | Public fixture accepts caller scope/source/entries and creates an authenticated basis | Fixture must be test-only or explicitly non-authoritative to every resolver | ARCH-CRITICAL-001 / AC-EXEC-012 | MISSING | NW-ARCH-001 |
| RCC-002 | REGISTRAR | `src/domain/exec-registry.ts:461-467`; `src/application/exec-registry.ts:174-203` | EXEC-001 with REPO/PLAT boundary | Registration publishes only through the authorized catalog owner | Local registration returns a successor basis; productive source is read-only and no publication occurs | Candidate basis must not be reported/consumed as canonical registration absent owner publication | ARCH-CRITICAL-001 / AC-EXEC-012 | MISSING | NW-ARCH-002 |
| RCC-003 | CONSUMER | `src/domain/exec-registry.ts:578-622` | EXEC-001 | Resolve against frozen producer-issued basis | Direct resolver accepts any branded fixture basis and returns `RESOLVED` | Resolver success requires producer-bound authority | ARCH-CRITICAL-001 / AC-EXEC-008 | MISSING | NW-ARCH-001 |
| RCC-004 | ALTERNATE_AUTHORITY_PATH | direct import of domain module | EXEC-001 | No second registry authority | Caller can bypass application source checks | Only approved application/composition route may consume canonical basis | ARCH-CRITICAL-001 | MISSING | NW-ARCH-001 |
| RCC-005 | INJECTION_POINT | `src/application/exec-registry.ts:156-166` | EXEC-001 | Failure context must not become canonical basis | Missing-source failure uses caller-derived scope in branded `CatalogBasis` | Use observed/non-authoritative context or an explicitly untrusted failure reference | ARCH-CRITICAL-001 | MISSING | NW-ARCH-003 |
| RCC-006 | MUTATION_PATH | `src/domain/exec-registry.ts:461-467` | EXEC-001 | Frozen basis/history must remain unchanged | New basis and frozen predecessor; duplicate failure is no mutation | Preserve current behavior | AC-EXEC-008/012 | COVERED | NW-ARCH-004 |
| RCC-007 | STALE_PATH | `src/application/exec-registry.ts:139-151` | EXEC-001/foreign producers | Stale source revision fails closed | Branded revision and exact source/scope checks reject stale material | Preserve and add productive producer evidence later | AC-EXEC-009 | COVERED | NW-ARCH-005 |
| RCC-008 | PORT_SUBSTITUTION_PATH | `src/application/exec-registry-ports.ts:126-138` | EXEC-001 | Alternate adapters cannot mint authority | Raw/copy/matching-source-forgery receipts are rejected | All productive adapters satisfy same proof protocol | AC-EXEC-009/012 | COVERED locally; integrated producer unavailable | NW-ARCH-006 |
| RCC-009 | PUBLIC_EXPORT | `src/domain/exec-registry.ts` exports fixture, resolver and aliases | EXEC-001 | Public exports cannot expose caller-mintable authority | Fixture factory and direct resolver are importable from production source | Remove fixture from production authority exports or gate it out of resolver | ARCH-CRITICAL-001 | MISSING | NW-ARCH-001 |
| RCC-010 | PERSISTENCE | TICKET-003 / PLAT, not changed here | EXEC-001/PLAT | Physical material cannot become semantic authority without validation | No T002 persistence path | Close under approved T003/PLAT work; do not infer closure here | T003 / C-EXEC-020 | OUTSIDE_SCOPE (owner/route recorded) | NW-ARCH-007 |
| RCC-011 | RETRY_RECOVERY | TICKET-003/TICKET-009/PLAT | EXEC-001/PLAT | Frozen basis/history survives retry/recovery | No T002 retry/recovery implementation | Preserve original basis under owning tickets | T003/T009 | OUTSIDE_SCOPE (owner/route recorded) | NW-ARCH-007 |
| RCC-012 | LEGACY_ROUTE | No legacy EXEC route in changed files | REPO | REPO owns legacy compatibility; no dual writer | No legacy writer or compatibility mapper introduced | Preserve no-legacy-writer state | §21 | NOT_APPLICABLE (no route exists) | NW-ARCH-008 |
| RCC-013 | ARCHITECTURE_GUARD | `tests/exec-registry-import-boundary-loader.mjs`; target suite | EXEC-001 | Executable guard for forbidden boundary/authority paths | Import guard exists; direct fixture-authority route is unguarded | Add direct route negative guard | ARCH-CRITICAL-001 | MISSING for authority route; import guard COVERED | NW-ARCH-009 |
| RCC-014 | TEST | `tests/exec-001-ticket-002.test.ts` | EXEC-001 | Direct positive and negative authority witnesses | Tests reject fixture at application source seam but directly use fixture for successful domain resolution; no production-route negative | Assert caller-created fixture cannot obtain a canonical resolution | ARCH-CRITICAL-001 | MISSING | NW-ARCH-001 |

Campaign closure is not claimed: the matrix is not fully covered, the root cause remains present, and no remediation was performed.

## Findings

### ARCH-CRITICAL-001 — Caller-created fixture basis is accepted as canonical registry authority

- **Severity:** CRITICAL
- **Ticket:** `EXEC-001-TICKET-002`
- **Normative authority:** ADR-0003 decision (versioned explicit registry and no silent alternate contract authority); SPEC-EXEC-001 §§2, 10, 12.1, 12.3, 13 (`EXEC-REGISTRY-001`, `EXEC-REGISTRY-004`), 14 and 21–23; `AUTHORITY_PROVENANCE_AND_ANTI_FORGERY_CONTRACT` requires consumer verification of issuer, scope, binding and forgery resistance.
- **Owner:** `SPEC-EXEC-001` / EXEC-001. DOM remains owner of `RepositoryId`; REPO remains owner of enabled NORMAL configuration.
- **Affected boundary:** Production domain registry resolver and public exports, between caller/test fixture construction and the application source-boundary.
- **Repository evidence:** `CatalogBasis.createFixture` accepts caller-provided scope/source/entries and adds the new basis to the authenticated `CATALOG_BASIS_INSTANCES` set (`src/domain/exec-registry.ts:448-458`). `createCatalogBasisFixture` exports this constructor from production code (`:646-654`). `RegistryResolutionService.resolve` trusts any member of that set (`:578-580`), while `isAuthenticatedCatalogBasis` is only the module-local brand check (`:689-690`). The application rejects local fixture sources, but direct domain callers are not required to traverse that application boundary (`src/application/exec-registry.ts:86,102-105`).
- **Problem:** A caller can create a basis with source `CALLER` and a caller-selected NORMAL RepositoryId, register an entry, and invoke the exported resolver to obtain an authenticated `RESOLVED` result. The basis has no DOM/REPO issuer, frozen execution attachment or producer provenance. The missing-source application path additionally creates a branded `EXEC_FAILURE_CONTEXT` basis from caller scope (`src/application/exec-registry.ts:156-166`).
- **Impact:** This introduces an alternate registry authority and a caller-supplied authority bypass. A consumer that accepts the branded result can resolve arbitrary caller-selected capability/version/schema data without the canonical DOM/REPO basis. It defeats the intended producer/consumer ownership boundary even though the ordinary application source path rejects fixtures.
- **Minimum correction required:** Keep local fixture construction in test support (or make it non-authoritative to all production resolvers) and require a producer-bound authority proof/token for any successful domain resolution; ensure failure context is represented as explicitly non-authoritative observed data rather than a canonical `CatalogBasis`. Add an executable negative architecture guard for the direct fixture-to-resolver route.
- **Systemic pattern:** YES
- **Related locations:** `src/domain/exec-registry.ts:448-458,578-622,646-726`; `src/application/exec-registry.ts:60-72,156-166,174-203`; `src/application/exec-registry-ports.ts:48-138`; `src/composition/exec-registry.ts:14-23`; `tests/exec-001-ticket-002.test.ts` fixture/domain resolution tests; `tests/exec-registry-import-boundary-loader.mjs` (import guard does not cover authority route).

## Audit summary

Audit: `.pi/runtime/workflow-audits/72e54edf-031a-436b-9c04-82f31bc2a04b/architecture-EXEC-001-TICKET-002-architecture-boundaries-audit.md`

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
Producer/consumer contract errors: 0
Temporal authority gaps: 0
Caller-supplied authority bypasses: 1
Missing architecture guards: 1
Architecture guard tests run: 2

Findings:
CRITICAL=1
MAJOR=0
MINOR=0
INFO=0

Domain audit complete:
YES

Specialist result:
SPECIALIST_ARCHITECTURE_FINDINGS

AUDIT_TARGET_HEAD: c450df1c4523a841484cbf1acb8cd1ab57621017
AUDIT_TARGET_STATE_FINGERPRINT: d91db0e8d277c66499d9d4fd5dc0a05818aeb7d39faf1303876abc8e6d165192
AUDIT_WAVE_ID: 72e54edf-031a-436b-9c04-82f31bc2a04b
DOMAIN_AUDIT_COMPLETE: YES
SPECIALIST_RESULT: SPECIALIST_ARCHITECTURE_FINDINGS