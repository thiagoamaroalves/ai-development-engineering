# Architecture Boundaries Audit — EXEC-001-TICKET-002

## 1. Audit identity and target

```text
AUDIT_SKILL = audit-architecture-boundaries
AUDIT_MODE = READ_ONLY; INDEPENDENT; ADVERSARIAL; ARCHITECTURE_FIRST
TICKET_ID = EXEC-001-TICKET-002
TICKET_PATH = docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-version-registry-catalogs-capabilities.md
IMPLEMENTATION_UNIT = EXEC-IMP-02
IMPLEMENTATION_BASELINE = 8f62b283b1dbf487911c7c459db95cadc25ff101
CURRENT_HEAD = 6f8ea7170f21f94d36f30893cc5622040fa4ba5b
AUDIT_TARGET_HEAD = 6f8ea7170f21f94d36f30893cc5622040fa4ba5b
AUDIT_TARGET_STATE_FINGERPRINT = 732a233bb6949d3b9da4192284f83e31564828ba5962ba43c2f25eff1ee66668
AUDIT_WAVE_ID = 8afcffa6-75bd-4fb1-a141-5abda712aaf2
TICKET_STATUS = VALIDATION_REQUIRED
WORKTREE_STATUS = clean before and after inspection
```

The pinned HEAD was verified. The supplied target fingerprint is used as the
semantic audit pin. No production code, tests, ticket/planning/authority file,
Git state, commit, branch, remote, or publication state was changed.

### Changed subject and checkpoint files

The implementation subject is present in `src/domain/exec-registry.ts`,
`src/application/exec-registry.ts`, `src/application/exec-registry-ports.ts`,
`src/composition/exec-registry.ts`, `tests/exec-001-ticket-002.test.ts`, the
import-boundary loader/fixture, and the eight TICKET-002 evidence files. The
baseline-to-target checkpoint delta additionally contains:

- `docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-implementation-remediation.md`
- `docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-checkpoints/EXEC-001-TICKET-002-audit-checkpoint-round-6.md`
- `docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-checkpoints/EXEC-001-TICKET-002-remediation-checkpoint-round-5.md`
- `docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-checkpoints/EXEC-001-TICKET-002-remediation-checkpoint-round-6.md`
- the TICKET-002 implementation/evidence files listed above.

## 2. Authority reconstruction

### Source precedence

```text
ADR-0003 revision 3, ACCEPTED
↓ ADR-0010 revision 3, ACCEPTED; related DOM identity authority
↓ SPEC-EXEC-001 revision 3 and conformant component audit
↓ SPEC-DOM-001 revision 4 for RepositoryId/execution basis
↓ validated Gap Matrix and conformant Implementation Plan/audit
↓ approved TICKET-002 implementation design
↓ TICKET-002
↓ repository implementation and tests
```

Repository code and execution records were treated as evidence, not authority.

### Contract

| Boundary | Canonical authority and obligation |
|---|---|
| Local owner | EXEC-001 owns semver meaning, explicit supported sets, registry-entry semantics, deterministic resolution, independent NORMAL/BOOTSTRAP catalog semantics, bootstrap allowlist, canonical unknown/incompatible outcomes, and common registry extensibility. |
| Foreign owners | DOM owns `RepositoryId`, execution identity and exact execution/snapshot basis; REPO owns enabled NORMAL catalog configuration; PLAT owns physical persistence, integrity, ordering, CAS and recovery. |
| Canonical identity | NORMAL: `(CatalogScope=NORMAL, RepositoryId, SkillContractId, CapabilityId, SchemaId, SemanticVersion)`. BOOTSTRAP: system-scoped `(CatalogScope=BOOTSTRAP, SkillContractId, CapabilityId, SchemaId, SemanticVersion)`. `CatalogRevision` is distinct from semantic version. |
| Immutability | Duplicate/conflicting registration fails closed; registration returns a new basis; an existing frozen basis and its entries are not edited. |
| Lineage | Local registration advances `CatalogRevision`; persisted digest, continuity and reconstruction are owned by the later persistence/integration boundary. |
| Authority provenance | A successful authoritative resolution must consume owner-issued, scope/revision-bound material. A fixture, copied shape, caller value, public constructor or local result cannot mint canonical authority. |
| Legacy/cutover | `NEW_CANONICAL_PATH` with `CUTOVER`; REPO retains legacy compatibility/migration authority. No legacy registry writer is owned here. |
| Migration | No migration operation is implemented; migration authority remains outside this ticket. |
| Security-sensitive boundary | Source provenance, caller injection, scope binding and result verification must fail closed. No user/session authorization policy is owned here. |
| Does not implement | DOM identity/lifecycle, REPO enablement, session/scheduler, physical persistence/recovery/effects, transport/UI/OPS mappings, or legacy migration. |

Normative anchors: ADR-0003 Decisão; ADR-0010 Bootstrap; SPEC-EXEC-001 §§12.1,
12.3, 12.4, 13 (`EXEC-VERSION-001/002`, `EXEC-REGISTRY-001/002/003/004`,
`EXEC-CAPABILITY-001/002`), 14–18, 21–23; TICKET-002 §§3, 7, 9, 13–15, 21;
approved design §§7–8, 14, 16–18.

## 3. Applicability matrix

| Dimension | Classification | Result and reason |
|---|---|---|
| OWNERSHIP | REQUIRED | Registry semantics are EXEC-owned while DOM/REPO source ownership must remain foreign. |
| CANONICAL_AUTHORITY | REQUIRED | Resolution and registration paths can produce capability/version outcomes. |
| CROSS_SPEC_INTEGRATION | AFFECTED | DOM and REPO basis/source contracts are consumed for integrated proof. |
| IDENTITY | REQUIRED | Scope, RepositoryId, entry key, schema and semantic version form canonical identity. |
| IMMUTABILITY | REQUIRED | Frozen entries/bases and no-mutation-on-failure are explicit local behavior. |
| LINEAGE | AFFECTED | Local `CatalogRevision` progression is present; physical history/reconstruction is deferred to TICKET-003/PLAT. |
| LEGACY_TRANSITION | AFFECTED | This is a new canonical registry path and must not create legacy or dual writers. |
| DESTRUCTIVE_TRANSITION | NOT_APPLICABLE | No retirement, deletion, irreversible migration or destructive cutover is performed here. |
| MIGRATION_AUTHORITY | NOT_APPLICABLE | No migration state or migration command is implemented; REPO/BOOTSTRAP owners remain authoritative. |
| SECURITY_AUTHORIZATION | AFFECTED | Producer provenance and caller-injection rejection are authority-sensitive authorization boundaries, although user authorization is out of scope. |

## 4. Ownership and authority audit

### Ownership

`OWNERSHIP_LEAKAGE` and `ALTERNATE_AUTHORITY_INTRODUCED` are present in the
runtime authority boundary. The valid static factory path marks fixture bases
as local and the application rejects fixture sources, but the exported domain
classes expose runtime-callable constructors despite TypeScript `private`
constructors. The constructors add caller-created objects to the same private
WeakSets used as authentication evidence. A caller can therefore create a
non-local-looking `CatalogBasis`, obtain a producer-bound proof, and resolve a
capability without DOM or REPO issuance.

The pure `CatalogBasis.register` operation is immutable and domain-owned, but
its derived basis inherits the non-local marker whenever its parent is
non-local. It is not separately marked as an owner-published basis. The
`RegisterExecCapability` result also says `REGISTERED` while the source port is
read-only and no owner publication receipt is created. These are related
provenance risks on the same authority boundary.

### Canonical authority

`AUTHORITY_PRESERVED` for valid factory-created local fixtures and the
application's intended producer-receipt path. `ALTERNATE_AUTHORITY_INTRODUCED`
for runtime constructor/proof/failure paths. `RegistryResolutionService.resolve`
checks a WeakMap proof, but the caller can populate that proof with an exported
runtime-callable `CatalogBasis` constructor and the exported proof factory.
`RegistryResolutionService.failure` is public and can issue an authenticated
failure result directly, including from a local fixture. `resolveContractFixture`
returns the canonical result shape (although it deliberately omits the result
brand); it remains a public production-domain alternate path and must never be
used as business truth.

### Direct exploit evidence

The following read-only Node probes were executed against the pinned target:

```text
new CatalogBasis(scope, revision, source, [entry], false)
→ isAuthenticatedCatalogBasis = true; isLocalCatalogBasis = false
createProducerBoundCatalogBasisProof(forgedBasis)
→ succeeds
RegistryResolutionService.resolve(forgedBasis, request, proof)
→ { status: "RESOLVED", code: "RESOLVED" }
```

A second probe constructed `new CatalogRevision(0)` and a runtime-callable
`new CatalogScope(...)`; the resulting basis was accepted as authenticated and
resolved successfully when the entry was bootstrap-allowlisted. A third probe
called `resolver.failure(localFixture, "CONTRACT_INVALID", "caller")`; the
returned object was recognized by `isAuthenticatedRegistryResolutionResult` and
`isRegistryFailure`. These are direct negative-witness failures, not source
inferences.

### Cross-SPEC authority consumption

The records are reconciled without promoting fixtures:

| Capability | Authority owner / producer | Consumer and contract | Authority / contract | Local / productive | Class and result |
|---|---|---|---|---|---|
| `DOM-EXEC-IDENTITY-SNAPSHOT` | SPEC-DOM-001 / DOM canonical resolver | TICKET-002; `DOM-ID-001`, `DOM-SNAPSHOT-001`; RepositoryId, execution basis and revision | DEFINED / DEFINED | NO / NO | `REQUIRED_FOR_INTEGRATED_PROOF`; `AUTHORITY_CONSUMPTION_GAP`, integrated-only |
| `REPO-EXEC-NORMAL-CATALOG` | SPEC-REPO-001 / enabled repository configuration | TICKET-002; repository-scoped NORMAL catalog and basis | DEFINED / DEFINED | NO / NO | `REQUIRED_FOR_INTEGRATED_PROOF`; `AUTHORITY_CONSUMPTION_GAP`, integrated-only |
| `UNIT-EXEC-REGISTRY-FIXTURE` | EXEC test support / local fixture | local semantic tests only | DEFINED / DEFINED | YES / NO | `INFORMATIONAL`; `CONTRACT_TESTABLE_LOCALLY`, never productive authority |

No productive DOM/REPO producer is present at the target. The application
correctly rejects the only local fixture issuers, so there is no valid
productive positive consumer witness. This is not converted into a local
closure blocker because the approved dependency class is integrated-proof-only,
but it is an open cross-spec consumption finding.

### Identity, immutability and lineage

- **Identity: VIOLATED at the public runtime boundary.** Valid static paths
  preserve the required tuple, but runtime-callable constructors can create
  invalid scope/revision values and pass them through the authentication
  WeakSets into canonical resolution.
- **Immutability: CONFORMANT for valid basis values.** Entries/results/bases
  are frozen and duplicate/failed registration does not mutate the old basis.
  The invalid constructor path bypasses creation invariants but does not mutate
  an already-frozen valid basis.
- **Lineage: PARTIAL.** Local sequential `CatalogRevision.next()` preserves
  append-only in-process progression. Persisted digest, continuity,
  reconstruction and physical CAS are explicitly outside this ticket. The
  forged `CatalogRevision(0)` path bypasses progression evidence and is part of
  ARCH-CRITICAL-001.

### Legacy, destructive transition and migration

`TRANSITION_PARTIAL` at the integrated boundary because productive source
cutover is not yet proven; locally there are no legacy writers or dual legacy
authority paths. No destructive transition is applicable, so replacement,
pre-transition, post-transition and rollback fields are not applicable. No
migration authority is implemented.

### Authorization and temporal checks

`CALLER_AS_AUTHORITY_CHECK = FAIL`: caller-created runtime objects can replace
producer provenance and canonical basis authority. `CALLER_SUPPLIED_AUTHORITY_BYPASS`
is therefore present.

`TEMPORAL_AUTHORITY_PROOF = NOT_APPLICABLE` for local resolution/registration:
there is no external effect after observing mutable authority. The application
checks DOM/REPO scope and revision bindings before resolution, but this does
not cure the direct domain bypass. No temporal gap is counted.

## 5. Authority provenance / anti-forgery matrix

| Obligation | Expected | Target evidence | Result |
|---|---|---|---|
| `PROOF_ISSUER_OWNER` | DOM/REPO producer for a source basis; EXEC verifies and consumes it | `createProducerBoundCatalogBasisProof` is public and accepts any authenticated non-local basis | FAIL on forged-basis path |
| `PROOF_SCOPE` | Exact scope, RepositoryId and CatalogRevision | Application validates receipt scope/revision; direct domain path accepts runtime-forged scope/revision | PARTIAL |
| `PROOF_IDENTITY_OR_BRAND` | Owner-bound producer identity, not shape/constructor membership | WeakSets prove only that a runtime constructor ran; they do not prove owner issuance | FAIL |
| `CONSUMER_VERIFICATION_RULE` | Consumer verifies issuer, source kind, scope, revision and basis binding | Application receipt ledger does this for available sources; domain proof only checks proof-to-basis WeakMap | PARTIAL |
| `STALE_OR_MUTATION_POLICY` | Reject stale/detached material; preserve frozen basis | Application checks source revision; valid local basis is immutable; direct forged revision is accepted | PARTIAL |
| `FORGERY_NEGATIVE_TEST` | Direct executable constructor/proof/failure forgery rejection | Existing `Object.create` and fixture tests pass, but direct `new CatalogBasis(..., false)` succeeds | FAIL; missing architecture guard |
| `CALLER_INJECTION_NEGATIVE_TEST` | Caller cannot inject a basis/result into the canonical path | Application rejects `input.basis`, fixture sources and copied receipts; domain constructor/proof path bypasses it | FAIL |
| `ALTERNATE_ADAPTER_CONTRACT_TEST` | Every productive adapter uses the same owner-issued proof | Plain fake/copy adapters are rejected; no productive adapter or positive alternate-adapter witness exists | NOT_PROVEN |

## 6. Systemic boundary expansion

### Root-cause campaigns

```text
ROOT_CAUSE_CAMPAIGN_ID = RCC-EXEC-T002-PUBLIC-AUTHORITY-MINT-001
ROOT_CAUSE_ID = CALLER_MINTABLE_REGISTRY_AUTHORITY
CAMPAIGN_STATUS = OPEN
CAMPAIGN_SCOPE = TICKET-002 public basis/value construction, proof/result issuance, registration-derived bases and canonical resolution
CANONICAL_FINDINGS = ARCH-CRITICAL-001
CAMPAIGN_MATRIX_COMPLETE = YES for applicable public-authority rows
ALL_SURFACE_ROWS_COVERED = YES for applicable public-authority rows
ALL_NEGATIVE_WITNESSES_PASS = NO
NO_UNEXPLAINED_PUBLIC_AUTHORITY_PATH = NO
NO_HIDDEN_CONCRETE_PROTOCOL = NOT_APPLICABLE
ROOT_CAUSE_REMOVED = NO
KNOWN_MANIFESTATIONS_CLOSED = NO
SYSTEMIC_TEST_EVIDENCE = PRESENT_BUT_INCOMPLETE
```

```text
ROOT_CAUSE_CAMPAIGN_ID = RCC-EXEC-T002-PRODUCER-SEAM-001
ROOT_CAUSE_ID = PRODUCER_ISSUANCE_SEAM_UNAVAILABLE
CAMPAIGN_STATUS = OPEN
CAMPAIGN_SCOPE = TICKET-002 DOM/REPO source receipts, port substitution and integrated authority consumption
CANONICAL_FINDINGS = ARCH-MAJOR-001
CAMPAIGN_MATRIX_COMPLETE = YES for applicable producer-seam rows
ALL_SURFACE_ROWS_COVERED = YES for applicable producer-seam rows
ALL_NEGATIVE_WITNESSES_PASS = NO
NO_UNEXPLAINED_PUBLIC_AUTHORITY_PATH = YES within producer-seam scope
NO_HIDDEN_CONCRETE_PROTOCOL = NO
ROOT_CAUSE_REMOVED = NO
KNOWN_MANIFESTATIONS_CLOSED = NO
SYSTEMIC_TEST_EVIDENCE = MISSING_PRODUCTIVE_POSITIVE_WITNESS
```

Rows R1–R7, R9 and R13–R14 below belong to
`RCC-EXEC-T002-PUBLIC-AUTHORITY-MINT-001`; rows R8 and R10 belong to
`RCC-EXEC-T002-PRODUCER-SEAM-001`. R11–R12 are explicit not-applicable rows
for both campaigns.

| Row | Surface class | Location / owner | Normative obligation | Current behavior | Expected behavior | Finding/AC | Coverage / witness |
|---|---|---|---|---|---|---|---|
| R1 | ISSUER | `src/domain/exec-registry.ts:436-467`; EXEC | Only authorized producer material may become a basis | Runtime `CatalogBasis` constructor is callable and accepts `localFixture=false` | Owner-issued basis factory/receipt only | ARCH-CRITICAL-001 | MISSING direct-constructor negative witness |
| R2 | REGISTRAR | `:470-482`; EXEC | Register absent complete key without alternate authority | Derived non-local basis inherits non-local status; no publication provenance | Derived candidate remains non-authoritative until owner publication | ARCH-CRITICAL-001 | MISSING derived-basis provenance guard |
| R3 | CONSUMER | `:644-652`; EXEC resolver | Canonical resolution consumes producer proof | WeakMap proof is accepted when caller minted the basis | Verify owner/source-bound issuer capability | ARCH-CRITICAL-001 | Exploit probe returns RESOLVED |
| R4 | ALTERNATE_AUTHORITY_PATH | `:660-665`, `:715-726`; EXEC resolver | Fixture/failure evidence cannot become canonical truth | Public fixture resolution has canonical result shape; public failure brands caller-created failure | Test-only distinct type and internal result issuer | ARCH-CRITICAL-001 | Fixture result unbranded, failure forge succeeds |
| R5 | INJECTION_POINT | exported `CatalogScope`, `CatalogRevision`, `SupportedVersionSet`, `RegistryEntry`, `CatalogBasis` classes | Runtime identity/progression guards must be unforgeable | TypeScript `private` is erased; constructors populate auth WeakSets | Runtime token/closure ownership boundary | ARCH-CRITICAL-001 | `new CatalogRevision(0)` and `new CatalogBasis(..., false)` succeed |
| R6 | MUTATION_PATH | `CatalogBasis.register`, `RegisterExecCapability` | New basis must not rewrite old basis or create unowned authority | Old basis stays frozen, but new basis is labelled as registered/non-local without owner publication | Immutable candidate plus explicit owner commit/publication | ARCH-CRITICAL-001 | No publication receipt on `REGISTERED` result |
| R7 | STALE_PATH | `CatalogRevision.create/next`, app `assertAuthorizedBasis` | Stale/out-of-order/foreign material fails closed | App checks productive receipt revision; direct basis can contain revision 0 or arbitrary scope | Semantic continuity checked at every authority entry | ARCH-CRITICAL-001 | Forged revision resolves |
| R8 | PORT_SUBSTITUTION_PATH | `src/application/exec-registry-ports.ts:43-139`; DOM/REPO | Alternate adapters satisfy the same provenance contract | Only local fixture issuer exists; app rejects it; no productive owner issuer exists | Owner adapters issue verifiable receipts and have positive/negative witnesses | ARCH-MAJOR-001 | Productive availability NO |
| R9 | PUBLIC_EXPORT | `src/domain/exec-registry.ts:167,207,238,306,430,505,660,715,743,826-827` | Public exports must not expose authority minting paths | Runtime constructors, proof factory, failure method and fixture resolver are public | Test support and owner-issued factories must be non-authoritative or non-public | ARCH-CRITICAL-001 | Missing public-export architecture guard |
| R10 | PERSISTENCE | TICKET-003/PLAT boundary | Physical persistence/CAS owns durable continuity | No physical implementation in this ticket | Later owner proves durable continuity; do not promote local basis | ARCH-MAJOR-001 (integrated route) | Correctly deferred, no local blocker |
| R11 | RETRY_RECOVERY | TICKET-003/PLAT | Historical basis cannot be reinterpreted | Not implemented here | Later semantic reconstruction/replay proof | NOT_APPLICABLE locally | Outside TICKET-002 scope |
| R12 | LEGACY_ROUTE | REPO legacy adapter boundary | No legacy writer/alternate registry authority | No legacy route in target | REPO remains legacy owner | NOT_APPLICABLE locally | No route found |
| R13 | ARCHITECTURE_GUARD | `tests/exec-001-ticket-002.test.ts:596-650` | Executable guard must reject authority/import escapes | Import-boundary guard runs; direct constructor/proof guard absent | Add direct runtime authority-escape guard | ARCH-CRITICAL-001 | Two guard tests run; one required guard missing |
| R14 | TEST | `tests/exec-001-ticket-002.test.ts:471-520` | Negative witnesses cover forged basis/result paths | Tests use `Object.create` and local fixtures but not runtime constructors/public failure | Direct `new`/derived-basis/failure negative witnesses | ARCH-CRITICAL-001 | 24/24 tests pass but coverage is incomplete |

The campaign is open because the public runtime issuer path and productive
source path remain available/unfinished; one corrected application boundary
cannot close the entire matrix.

## 7. Findings

### ARCH-CRITICAL-001 — Runtime-callable constructors and public issuers mint canonical registry authority

- **Severity:** CRITICAL
- **Ticket:** EXEC-001-TICKET-002
- **Normative authority:** ADR-0003 Decisão; SPEC-EXEC-001 §§12.1, 12.3, 12.4, 13 (`EXEC-REGISTRY-001/004`, `EXEC-CAPABILITY-001/002`), 14–18; approved design §§7, 8, 14, 16–18; authority-provenance anti-forgery contract.
- **Owner:** EXEC-001 owns registry semantic validation; DOM/REPO own the producer identity and source authority.
- **Affected boundary:** Public domain construction, producer-proof issuance, registration-derived bases, canonical resolver, fixture resolver and canonical failure-result issuer.
- **Repository evidence:** `CatalogBasis`, `CatalogScope`, `CatalogRevision`, `SupportedVersionSet` and `RegistryEntry` use TypeScript `private` constructors but the emitted/runtime classes remain callable (`src/domain/exec-registry.ts:167-176, 207-214, 238-247, 306-348, 430-454`). Constructor-created objects are added directly to the authentication WeakSets. `createProducerBoundCatalogBasisProof` only checks authenticated/non-local membership (`:505-511`); `resolve` trusts that proof (`:644-652`). `CatalogBasis.register` propagates the non-local marker (`:476-482`). `failure` is public and brands results by default (`:715-726`).
- **Problem:** A caller can construct a basis with `localFixture=false`, mint the producer-bound proof, and obtain a canonical `RESOLVED` result without an owner-issued DOM/REPO basis. The same runtime boundary accepts invalid revisions/scopes. A caller can also mint an authenticated failure result from a local fixture. The existing `Object.create` and fixture rejection tests do not cover this runtime constructor path.
- **Impact:** Caller-supplied capability/version/schema/scope/revision material can cross the canonical registry boundary. This creates an alternate authority path, invalid identity/lineage evidence, and a forged canonical result/failure. It defeats the claimed owner/proof separation even though normal static factory tests are green.
- **Minimum correction required:** Enforce runtime-unforgeable construction/issuance (owner-held tokens or closures) for authenticated value/aggregate objects; keep derived registrations non-authoritative until an owner publication; make canonical result/failure issuance internal or require an owner-bound capability; move fixture resolution to test support or a distinct untrusted result type; add direct executable guards for every exported constructor, derived-basis path, public failure issuer and fixture result.
- **Systemic pattern:** YES
- **Related locations:** `src/domain/exec-registry.ts:167-186,207-270,306-380,430-518,631-726,764-827`; `src/application/exec-registry.ts:176-208`; `src/application/exec-registry-ports.ts:43-139`; `tests/exec-001-ticket-002.test.ts:471-520`.

### ARCH-MAJOR-001 — DOM/REPO authority consumption has no productive owner-issued seam at the target

- **Severity:** MAJOR
- **Ticket:** EXEC-001-TICKET-002
- **Normative authority:** SPEC-EXEC-001 §§12.1, 12.4 and `EXEC-REGISTRY-001/002/004`; approved design §§7, 16–18; ticket §§13–14b; authority-completeness gates for `AUTHORITY_CONSUMPTION_PROOF` and `PRODUCER_CONSUMER_CONTRACT_PROOF`.
- **Owner:** DOM-001 canonical resolver and REPO-001 enabled-catalog producer issue the foreign authority; EXEC-001 verifies and consumes it.
- **Affected boundary:** `src/application/exec-registry-ports.ts` source ports and `src/application/exec-registry.ts:91-159` basis selection/verification.
- **Repository evidence:** The only receipt issuer in `exec-registry-ports.ts:43-73` is the local fixture helper. The application deliberately rejects local fixture sources at `:91-111` and `:191-196`. No productive DOM, REPO or system bootstrap producer/adapter exists in `src`; focused tests prove rejection of fake/copied/stale fixtures but no productive positive source witness.
- **Problem:** `AUTHORITY_STATUS=DEFINED` and `CONTRACT_STATUS=DEFINED`, but `LOCAL_TESTABILITY=NO` and `PRODUCTIVE_AVAILABILITY=NO` for `DOM-EXEC-IDENTITY-SNAPSHOT` and `REPO-EXEC-NORMAL-CATALOG`. The consumer seam therefore cannot execute a productive owner-issued basis at the pinned target.
- **Impact:** Integrated registry/catalog authority consumption, alternate-adapter substitution, and integrated positive/stale/forgery proof remain unproven. This does not block the approved local closure because both dependencies are explicitly `REQUIRED_FOR_INTEGRATED_PROOF`, but it blocks integrated proof and SPEC final conformance.
- **Minimum correction required:** At the approved DOM/REPO owners, provide owner-issued productive source adapters/receipts with exact scope and revision binding, then run integrated positive, stale, detached, forged/caller-injected, wrong-source and alternate-adapter witnesses. Do not promote the local fixture.
- **Systemic pattern:** YES
- **Related locations:** `src/application/exec-registry-ports.ts:23-139`; `src/application/exec-registry.ts:91-159`; ticket §14a–14b; design §§7 and 16; DOM/REPO producer boundaries.

## 8. Dimension results and guards

```text
OWNERSHIP_RESULT = OWNERSHIP_LEAKAGE; ALTERNATE_AUTHORITY_INTRODUCED
CANONICAL_AUTHORITY_RESULT = ALTERNATE_AUTHORITY_INTRODUCED
CROSS_SPEC_RESULT = INTEGRATION_NOT_PROVEN for DOM/REPO; local fixture contract only
IDENTITY_RESULT = VIOLATED at runtime authority boundary
IMMUTABILITY_RESULT = CONFORMANT for valid factories; invalid runtime construction bypasses invariants
LINEAGE_RESULT = PARTIAL; local progression only and forged revision path exists
LEGACY_RESULT = TRANSITION_PARTIAL integrated; no local legacy writer or dual writer
DESTRUCTIVE_TRANSITION = NOT_APPLICABLE
MIGRATION_AUTHORITY = NOT_APPLICABLE
AUTHORIZATION_RESULT = NON_CONFORMANT at caller/provenance boundary; user authorization N/A
ARCHITECTURAL_SCOPE = UNAUTHORIZED_ARCHITECTURAL_EXPANSION
ARCHITECTURAL_AUTHORITY_GAP_DISCOVERED = NO
REPOSITORY_SEMANTIC_AUTHORITY = NO; the domain owns local semantic rules, but provenance issuance is unsealed
CALLER_AS_AUTHORITY_CHECK = FAIL
TEMPORAL_AUTHORITY_PROOF = NOT_APPLICABLE
MISSING_ARCHITECTURE_GUARDS = 1
ARCHITECTURE_GUARD_TESTS_RUN = 2
ARCHITECTURE_GUARD_EVIDENCE = focused 24/24 pass; import-boundary loader and real-graph guard execute; no direct runtime-constructor/proof guard
```

The ordinary focused suite, typecheck, audit-governance guard and skill-mirror
guard were run successfully:

```text
node --experimental-strip-types --test tests/exec-001-ticket-002.test.ts = 24 passed, 0 failed
npm run typecheck = PASS
npm run verify:audit-governance = PASS
npm run verify:skill-mirror = PASS
```

The green suite does not close ARCH-CRITICAL-001 because its missing guard is
precisely the direct runtime construction/issuer escape described above.

## 9. Summary

Audit: `.pi/runtime/workflow-audits/8afcffa6-75bd-4fb1-a141-5abda712aaf2/architecture-EXEC-001-TICKET-002-architecture-boundaries-audit.md`

Specialist:
ARCHITECTURE_BOUNDARIES

Ticket: EXEC-001-TICKET-002

Ownership errors: 1

Foreign capability duplication: 0

Authority violations: 1

Identity violations: 1

Immutability/lineage violations: 1

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
MAJOR=1
MINOR=0
INFO=0

Domain audit complete:
YES

Specialist result:
SPECIALIST_ARCHITECTURE_FINDINGS

AUDIT_TARGET_HEAD: 6f8ea7170f21f94d36f30893cc5622040fa4ba5b
AUDIT_TARGET_STATE_FINGERPRINT: 732a233bb6949d3b9da4192284f83e31564828ba5962ba43c2f25eff1ee66668
AUDIT_WAVE_ID: 8afcffa6-75bd-4fb1-a141-5abda712aaf2
DOMAIN_AUDIT_COMPLETE: YES
SPECIALIST_RESULT: SPECIALIST_ARCHITECTURE_FINDINGS