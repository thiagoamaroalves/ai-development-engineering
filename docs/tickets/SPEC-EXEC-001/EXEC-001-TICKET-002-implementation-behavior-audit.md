# EXEC-001-TICKET-002 — Implementation Behavior Audit

Audit: `docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-implementation-behavior-audit.md`

Specialist: `IMPLEMENTATION_BEHAVIOR`

## 1. Audit basis and required inputs

| Input | Observed value |
|---|---|
| `TICKET_ID` | `EXEC-001-TICKET-002` |
| `TICKET_PATH` | `docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-version-registry-catalogs-capabilities.md` |
| `IMPLEMENTATION_UNIT` | `EXEC-IMP-02 — Version, registry resolution, catalogs and capability extensibility` |
| `REQUIREMENT_IDS` | `EXEC-VERSION-001`, `EXEC-VERSION-002`, `EXEC-REGISTRY-001`, `EXEC-REGISTRY-002`, `EXEC-REGISTRY-003`, `EXEC-CAPABILITY-001`, `EXEC-CAPABILITY-002` |
| `ACCEPTANCE_IDS` | `AC-EXEC-003`, `AC-EXEC-004`, `AC-EXEC-008`, `AC-EXEC-009`, `AC-EXEC-010`, `AC-EXEC-011`, `AC-EXEC-012`; local contributions to `AC-EXEC-005` and `AC-EXEC-007` |
| `ADR_PATH` | `docs/adrs/ADR-0003-versioned-skill-contracts.md` (accepted, revision 3) |
| `SPEC_PATH` | `docs/specs/SPEC-EXEC-001-skill-contracts-and-capability-registry.md` |
| `GAP_MATRIX_PATH` | `docs/specs/gap-matrices/SPEC-EXEC-001-implementation-gap-matrix.md` |
| `IMPLEMENTATION_PLAN_PATH` | `docs/specs/implementation-plans/SPEC-EXEC-001-implementation-plan.md` |
| `TICKET_SET_AUDIT_PATH` | `docs/tickets/SPEC-EXEC-001/implementation-ticket-audit.md` |
| `IMPLEMENTATION_BASELINE` | `d4216ad6f4a87fe7142ccd45d3fd099ef1b92955` (no prior TICKET-002 implementation at the pinned HEAD) |
| `CURRENT_HEAD` | `d4216ad6f4a87fe7142ccd45d3fd099ef1b92955` |
| `AUDIT_TARGET_HEAD` | `d4216ad6f4a87fe7142ccd45d3fd099ef1b92955` |
| `AUDIT_TARGET_STATE_FINGERPRINT` | `4ae3e359d87e354024c62f86fca4eba759e78335f78696185277e0e37a3e0bf4` |
| `CHANGED_PRODUCTION_FILES` | `src/domain/exec-registry.ts`; `src/application/exec-registry.ts`; `src/application/exec-registry-ports.ts`; `src/composition/exec-registry.ts` |
| `CHANGED_TEST_FILES` | `tests/exec-001-ticket-002.test.ts` |
| `RELEVANT_TEST_SUITES` | TICKET-002 direct tests; TICKET-001 regression; root `.pi` test suite; TypeScript typecheck; skill-mirror and audit-governance guards; broad `tests/*.test.ts` discovery run |

The target HEAD was verified directly. The implementation and evidence are an
uncommitted working-tree overlay; the exact overlay was included in the supplied
semantic fingerprint. The fingerprint was independently recomputed using the
repository workspace snapshot algorithm, excluding `.pi/`, `skills/`, `.codex/`
and the permitted audit artifacts, and matched exactly. The target pair remained
unchanged after test execution. No sibling specialist audit artifact was used.

## 2. Authority-chain reconstruction

The behavioral contract was reconstructed in the required order:

```text
ADR-0003 revision 3 ACCEPTED
  → Portfolio O-017/O-020
  → SPEC-EXEC-001 EXEC-VERSION-001/002,
    EXEC-REGISTRY-001/002/003,
    EXEC-CAPABILITY-001/002
  → validated GAP-004/GAP-006/GAP-008/GAP-009/GAP-010/GAP-011
  → EXEC-IMP-02 in the implementation plan
  → approved TICKET-002 and its acceptance witness matrix
  → repository implementation and executable tests
```

The authorized local behavior is explicit semver/support-set classification,
deterministic complete-entry resolution against a frozen in-process basis,
NORMAL/BOOTSTRAP separation, bootstrap allowlisting, distinct unknown versus
incompatible outcomes, and registry-only synthetic extensibility without
mutating an old basis. DOM identity, REPO enablement, physical persistence,
reconstruction, CAS, recovery and effects are not local TICKET-002 behavior.

## 3. Behavioral applicability matrix

| Dimension | Classification | Audit result / reason |
|---|---|---|
| `UNIT_BEHAVIOR` | REQUIRED | Semver, entries, immutable bases, resolver outcomes and registration are the ticket's core behavior. |
| `INTEGRATION_BEHAVIOR` | AFFECTED | DOM/REPO consumer ports exist; productive producers are explicitly integrated-proof dependencies, not local closure inputs. |
| `PERSISTENCE` | NOT_APPLICABLE | TICKET-002 uses immutable in-process bases only; semantic reconstruction is TICKET-003 and physical persistence is PLAT-owned. |
| `CONCURRENCY` | AFFECTED | Local create-only operations are immutable, but physical concurrent publication/CAS is an integrated contract not implemented here. |
| `STALE_STATE` | NOT_APPLICABLE | No persisted rehydration or mutable external observation is implemented; stale material belongs to TICKET-003/PLAT. |
| `IDEMPOTENCY` | REQUIRED | Duplicate registration must reject without changing the prior basis. |
| `DURABILITY` | NOT_APPLICABLE | No durability claim or storage boundary is implemented in this ticket. |
| `RECOVERY` | NOT_APPLICABLE | No external effect, restart, replay or recovery path is implemented in this ticket. |
| `COMPATIBILITY` | REQUIRED | Semver meaning and explicit supported-set compatibility are acceptance-owned behavior. |
| `MIGRATION_BEHAVIOR` | AFFECTED | Bootstrap category policy includes migration capability classification, while actual REPO migration remains foreign. |
| `NEGATIVE_PATHS` | REQUIRED | Unsupported, unknown, duplicate/conflicting, wrong-scope and disallowed-bootstrap requests must fail closed. |

All required and affected rows were inspected. The local immutable behavior is
not sufficient evidence for the integrated concurrent producer, physical
recovery, or foreign-source provenance obligations.

## 4. Production behavior classifications

| Behavior | Classification | Production evidence and observed semantics |
|---|---|---|
| Semver parsing and normal major/minor/patch classification | `IMPLEMENTED_CORRECTLY` for ordinary values; `PARTIAL` at numeric edge values | `SemanticVersion.parse` and `changeFrom` are in `src/domain/exec-registry.ts:78-146`; ordinary explicit versions parse and classify correctly. Numeric components are converted with `Number`, which loses distinctions above `Number.MAX_SAFE_INTEGER` (see `BEH-MINOR-001`). |
| Explicit supported-set membership | `IMPLEMENTED_CORRECTLY` for valid `SupportedVersionSet` instances | `src/domain/exec-registry.ts:148-185` uses exact version-string membership and does not alias, range-match, approximate major versions or silently convert. |
| Complete registry entry creation | `PARTIAL` | `RegistryEntry.create` validates the normal fields and schema-reference instances (`src/domain/exec-registry.ts:299-325`), but accepts any object with a callable `has` method as `supportedVersions` instead of requiring a genuine `SupportedVersionSet` instance at line 308. |
| Immutable basis registration and duplicate rejection | `IMPLEMENTED_CORRECTLY` locally | `CatalogBasis.register` creates a new basis and leaves the old entries unchanged (`src/domain/exec-registry.ts:402-409`); duplicate identity rejects before publication. Physical atomic winner semantics are not claimed. |
| Deterministic complete-entry lookup | `PARTIAL` | `RegistryResolutionService.resolve` performs stage, capability, schema and version filtering (`src/domain/exec-registry.ts:466-494`). It returns the registered entry on the normal path, but schema filtering occurs before known-capability classification, producing the wrong code for a known capability with an incompatible schema (`BEH-MAJOR-001`). |
| NORMAL/BOOTSTRAP scope isolation | `CONTRADICTORY` at the application boundary | The domain basis carries scope, but `ResolveExecCapability.selectBasis` returns caller-supplied `input.basis` before checking `input.scope` (`src/application/exec-registry.ts:35-46`). A bootstrap basis can therefore be resolved for a NORMAL request. |
| Bootstrap allowlist | `PARTIAL` | `BootstrapAllowlistPolicy` correctly rejects `NORMAL` category entries when the actual basis scope is BOOTSTRAP (`src/domain/exec-registry.ts:459-464`, `488-490`). The application basis-substitution path can bypass the expected scope and therefore bypass the intended context guard. |
| Unknown versus incompatible outcomes | `PARTIAL` | Unknown capability and unsupported version are distinct on tested paths (`src/domain/exec-registry.ts:478-487`), but schema incompatibility is misclassified as unknown. |
| Synthetic registry extensibility and frozen-basis preservation | `IMPLEMENTED_CORRECTLY` locally | `CatalogBasis.register` and `RegisterExecCapability` use the same immutable registration path (`src/application/exec-registry.ts:60-63`, `src/domain/exec-registry.ts:402-409`). Existing bases are not mutated. The negative provenance/anti-forgery path is not implemented. |
| Application source failure behavior | `UNSAFE_FAILURE_BEHAVIOR` | Missing source configuration or a source exception is thrown from `selectBasis` (`src/application/exec-registry.ts:42-56`) before the domain failure mapper runs. The application does not return a structured `CONTRACT_INVALID` result for this failure path (`BEH-MAJOR-003`). |

Normal success flow is therefore observable as:

```text
valid entry → CatalogBasis.register → new immutable basis
→ RegistryResolutionService.resolve
→ candidate/stage/exact supported version/allowlist/role checks
→ RESOLVED result retaining basis and entry
```

The principal unsafe paths are caller basis substitution, unbranded source
material, schema-before-identity classification, and thrown source failures.

## 5. Acceptance witness audit

The nine acceptance and contribution behaviors are the seven local acceptance
criteria plus the two explicitly recorded local contributions to AC-EXEC-005
and AC-EXEC-007. A witness is counted direct only when the test executes the
operation and asserts the required semantic result, including the relevant
negative or immutability behavior.

| Required behavior | Acceptance reference | Direct executed witness | Result |
|---|---|---|---|
| Semver major/minor/patch meaning | `EXEC-VERSION-001`, `AC-EXEC-003` | TICKET-002 test lines 70-81 | Direct positive/negative witness for ordinary semver values; large-number edge remains untested. |
| Explicit support-set rejection without alias/conversion | `EXEC-VERSION-002`, `AC-EXEC-004` | TICKET-002 test lines 83-90 | Direct witness; exact membership and duplicate-set rejection are asserted. |
| Complete deterministic registered mapping and duplicate/conflict rejection | `EXEC-REGISTRY-001`, `AC-EXEC-008` | TICKET-002 tests lines 92-119 | Proxy-only for the complete contract: the positive test omits assertions for output schema, semantic version, supported versions and category; only a same-key duplicate, not a distinct conflict, is exercised. |
| NORMAL/BOOTSTRAP independent source and scope authority | `EXEC-REGISTRY-002`, `AC-EXEC-009` | TICKET-002 tests lines 121-133 | Proxy-only: two independent successful bases are checked, but cross-scope/cross-repository substitution is not rejected. The ad hoc negative probe instead demonstrated a resolution bypass. |
| Bootstrap allowlist rejects normal work before work | `EXEC-REGISTRY-003`, `AC-EXEC-010` | TICKET-002 tests lines 135-152 | Direct local policy witness for actual BOOTSTRAP basis; no executable work callback exists in this ticket. |
| Unknown and incompatible outcomes remain distinct | `EXEC-CAPABILITY-001`, `AC-EXEC-011` | TICKET-002 tests lines 154-166 | Direct witness for unknown capability and unsupported version, but no schema-incompatibility assertion and no no-mutation/no-approval assertions on this test. |
| Schema-valid synthetic capability uses the common registry | `EXEC-CAPABILITY-002`, `AC-EXEC-012` | TICKET-002 tests lines 168-182 | Direct positive and frozen-old-basis witness; category-bypass/forged-input negative witness is absent. |
| Frozen-basis contribution | `AC-EXEC-005` contribution | TICKET-002 tests lines 92-110 and 168-181 | Direct local contribution; full DOM snapshot binding remains outside this ticket. |
| Failure-classification contribution | `AC-EXEC-007` contribution | TICKET-002 tests lines 154-166 | Proxy-only for the claimed no-approval/no-mutation contribution because those properties are not asserted on the incompatible result. |

The direct and proxy metrics are:

```text
REQUIRED_BEHAVIORS_TOTAL = 9
DIRECT_BEHAVIOR_WITNESSES = 6
PROXY_ONLY_BEHAVIORS = 3
UNTESTED_STATE_TRANSITIONS = 3
  (cross-scope substitution; distinct conflict; source-failure mapping)
UNPROVEN_CONCURRENCY_CONTRACTS = 1
MISSING_ARCHITECTURE_GUARDS = 0
```

`MISSING_ARCHITECTURE_GUARDS = 0` reflects that the ticket test has an
executable source/import guard. Its assertion quality is weak for complete
architecture provenance because it scans source text rather than exercising an
alternate adapter contract; that limitation is retained in the assertion and
campaign sections below.

## 6. Test inventory

| Category | Classification | Evidence and scope |
|---|---|---|
| `UNIT` | `REQUIRED_TEST_PRESENT` | TICKET-002 tests semver, support set, scopes, entries and resolver. |
| `INVARIANT` | `REQUIRED_TEST_PRESENT` | Duplicate rejection, immutability and complete-entry fields are partially asserted. |
| `PERSISTENCE` | `TEST_CATEGORY_NOT_APPLICABLE` | No local persistence is in scope. |
| `INTEGRATION` | `REQUIRED_TEST_MISSING` (integrated-only) | DOM/REPO productive producers are unavailable; only local source-seam construction is tested. This is not a local-closure blocker under the approved dependency class. |
| `CROSS_SPEC` | `REQUIRED_TEST_MISSING` (integrated-only) | No productive DOM/REPO adapter or provenance contract test exists at this target. |
| `CONCURRENCY` | `REQUIRED_TEST_MISSING` (integrated-only) | No physical concurrent registration/CAS or one-winner witness exists; local immutable sequential duplicate behavior is not a concurrency witness. |
| `STALE` | `TEST_CATEGORY_NOT_APPLICABLE` | Stale persisted material belongs to TICKET-003/PLAT. |
| `IDEMPOTENCY` | `REQUIRED_TEST_PRESENT` | Sequential duplicate registration rejects and preserves the prior basis. Physical replay idempotency is outside scope. |
| `RECOVERY` | `TEST_CATEGORY_NOT_APPLICABLE` | No recovery/effect path exists locally. |
| `COMPATIBILITY` | `REQUIRED_TEST_PRESENT` | Exact semver/support-set tests and the root regression suite pass. |
| `MIGRATION` | `REQUIRED_TEST_PRESENT` for the local allowlist classification | Bootstrap category allowlist includes migration and rejects NORMAL category; actual REPO migration is outside scope. |
| `NEGATIVE_PATH` | `REQUIRED_TEST_PRESENT` but incomplete | Unsupported, unknown, duplicate and bootstrap negatives exist; forged basis, wrong-schema, conflict and source-failure negatives are missing. |
| `ARCHITECTURE_GUARD` | `REQUIRED_TEST_PRESENT` but weak | The import/dependency source guard executes; it does not prove alternate-adapter provenance. |
| `CONFORMANCE` | `REQUIRED_TEST_PRESENT` | `npm run verify:audit-governance` passes and typecheck passes. |

The three integrated-only missing categories preserve the upstream dependency
classification `REQUIRED_FOR_INTEGRATED_PROOF`; they are not silently promoted
to local blockers.

## 7. Assertion-quality assessment

| Evidence | Quality | Assessment |
|---|---|---|
| Semver and exact-set tests | `STRONG` | Assert parsed components, change class, exact support membership and unsupported versions. |
| Normal resolution test | `WEAK` | It executes resolution but does not assert every required complete mapping field. |
| Duplicate/no-mutation test | `SUFFICIENT` | Prior basis identity and entry count are asserted, although a distinct conflicting payload is not exercised. |
| Repository isolation test | `MISLEADING` | Different bases resolve successfully and have different identities, but the test does not prove a foreign basis is rejected for a requested repository. |
| Bootstrap test | `SUFFICIENT` locally | Canonical incompatible code, `noApproval` and `noMutation` are asserted for an actual bootstrap basis. No external work callback exists in scope. |
| Failure distinction test | `WEAK` | Codes are distinct, but no failure-state/no-approval/no-mutation assertions are made and schema incompatibility is omitted. |
| Synthetic registration test | `SUFFICIENT` for local positive behavior | Common registration and old-basis immutability are observed; anti-forgery and alternate-adapter proof are absent. |
| Import guard | `WEAK` | It is an executable text scan, not a runtime/import-graph or alternate-adapter contract witness. |
| Evidence markdown files | `MISLEADING` as standalone proof | They report pass/results but do not add executable assertions beyond the test file. |

## 8. Negative and failure behavior

| Case | Expected result | Observed result |
|---|---|---|
| Unsupported explicit version | `INCOMPATIBLE_CAPABILITY`, no alias/conversion, no mutation/approval | Correct on TICKET-002 test lines 154-166 and resolver lines 482-487. The test does not assert the no-mutation/no-approval fields. |
| Unknown capability | `UNKNOWN_CAPABILITY`, no fallback | Correct for an absent capability ID on the tested schema/stage. |
| Known capability with incompatible schema | `INCOMPATIBLE_CAPABILITY` under the ticket's producer/consumer proof and capability semantics | `UNKNOWN_CAPABILITY`; `findCandidates` filters the schema before deciding whether the capability is known. Independently executed probe: `wrong-schema FAILED UNKNOWN_CAPABILITY`. |
| Normal capability in BOOTSTRAP | `INCOMPATIBLE_CAPABILITY` before work | Correct when the supplied basis is actually BOOTSTRAP. |
| Caller-supplied basis with mismatched requested scope | Reject the mismatch, preserve scope authority and do no work | `RESOLVED` from the supplied BOOTSTRAP basis for a NORMAL request. Independently executed probe: `scope-bypass RESOLVED RESOLVED BOOTSTRAP`. |
| Duplicate registration | `CONTRACT_INVALID`, prior basis unchanged | Duplicate throws `ExecRegistryDomainError`; old basis remains unchanged. The application does not normalize this thrown registration exception to a result object. |
| Source unavailable | Structured fail-closed failure, expected by the application responsibility to map source failures | `ExecRegistryDomainError` is thrown by `selectBasis`; independently executed probe: `missing-source THREW CONTRACT_INVALID`. |
| Forged supported-set object at entry creation | Reject non-domain supported-set material | A plain object with `has()` is accepted. Independently executed probe: `forged-support-set true function` for an unsupported version. |

The unsupported/unknown/duplicate happy-negative paths are not enough to close
the provenance and scope negative obligations. No durable partial mutation was
observed in the local immutable basis, but caller substitution can change the
basis from which a capability is resolved.

## 9. Authority, provenance and temporal checks

### 9.1 Capability records

| Capability | Authority status | Contract status | Local testability | Productive availability | Dependency class | Consumer result |
|---|---|---|---|---|---|---|
| `UNIT-EXEC-REGISTRY-FIXTURE` | `DEFINED` | `DEFINED` | `YES` | `NO` | `INFORMATIONAL` | Local semantic tests are consumable; the fixture is not productive availability. |
| `DOM-EXEC-IDENTITY-SNAPSHOT` | `DEFINED` | `DEFINED` | `NO` | `NO` | `REQUIRED_FOR_INTEGRATED_PROOF` | Contract is defined but not consumable from a productive producer at this target. |
| `REPO-EXEC-NORMAL-CATALOG` | `DEFINED` | `DEFINED` | `NO` | `NO` | `REQUIRED_FOR_INTEGRATED_PROOF` | Contract is defined but not consumable from a productive producer at this target. |

`ACP-EXEC-02`, `PCP-DOM-EXEC-01` and `PCP-REPO-EXEC-01` are the applicable
baselines. The local fixture proves only EXEC-owned in-process semantics. No
fixture, mock, port declaration or evidence markdown is promoted to productive
DOM/REPO availability.

### 9.2 Authority provenance surfaces

The intended issuer is the EXEC registry/basis owner. The intended consumer is
`RegistryResolutionService` through the application use case. The actual
boundary has these gaps:

- `ResolveExecCapabilityInput.basis` is caller-provided and is accepted before
  scope verification (`src/application/exec-registry.ts:14-18,35-46`).
- `ExecutionCatalogBasisReader` and `NormalCatalogSource` return an unbranded
  `CatalogBasis` without producer identity, digest, revision provenance or
  alternate-adapter contract (`src/application/exec-registry-ports.ts:1-15`).
- `RegistryEntry.create` accepts a duck-typed `supportedVersions` object at
  `src/domain/exec-registry.ts:308-324`.
- The only source test is a successful fixture read; there is no direct forged,
  caller-injected, stale/mutated, or alternate-adapter negative witness.

Therefore:

```text
AUTHORITY_CONSUMPTION_PROOF = PARTIAL
ISSUER_IS_AUTHORIZED = YES for the local EXEC fixture; NOT_PROVEN for foreign adapters
PROOF_SCOPE_IS_EXACT = NO for caller-supplied basis injection
CONSUMER_VERIFIES_PROVENANCE = NO for basis issuer/brand
INPUT_OR_REFERENCE_BINDING = PARTIAL (scope equality only on source-selected path)
MUTATION_OR_STALE_REJECTION = NO for source material provenance
FORGERY_PATH_REJECTED = NO
CALLER_INJECTION_REJECTED = NO
ALTERNATE_ADAPTER_CONTRACT = NOT_PROVEN
```

### 9.3 Temporal authority

`TEMPORAL_AUTHORITY_PROOF = NOT_APPLICABLE` for the local operation: it reads
an immutable in-process value and commits no external effect. This does not cure
the caller-as-authority bypass; it means that no mutable observation/effect
race is claimed in this ticket. Any future source observation followed by
publication must add independent revalidation, drift detection and physical CAS
at its owning boundary.

`CALLER_AS_AUTHORITY_CHECK = FAIL` for current/frozen basis and scope because a
caller can provide a basis that does not match the requested scope.

## 10. Idempotency, concurrency, persistence, recovery and compatibility

- **Idempotency: `CONFORMANT` locally.** Repeated equivalent registration on
  the same immutable basis rejects the second registration without changing the
  original basis. This is sequential local evidence only.
- **Concurrency: `NON_CONFORMANT` for the affected integrated contract.** The
  local values are immutable and synchronous, but no concurrent equivalent
  registration against a physical producer, one-winner rule or CAS is tested.
  The approved plan classifies that producer capability as integrated-only, so
  this remains an integrated follow-up rather than a local capability promotion.
- **Stale behavior: `NOT_APPLICABLE`.** No persisted/reconstructed or mutable
  external basis is handled here; the scope is explicitly assigned to
  TICKET-003/PLAT.
- **Persistence/durability: `NOT_APPLICABLE`.** `CatalogBasis` is an in-process
  immutable value and makes no durable-success claim.
- **Recovery: `NOT_APPLICABLE`.** There is no external effect, restart or replay
  path in the implementation.
- **Compatibility: `PARTIAL`.** Ordinary semver and exact support-set behavior
  is correct, but valid large numeric identifiers are rounded and classified
  incorrectly (`BEH-MINOR-001`). No legacy registry route exists; cutover is
  represented only by new immutable local bases.
- **Migration: `PARTIAL` local policy.** Bootstrap category classification is
  present, but REPO-owned migration and productive onboarding are not available
  at this target.

## 11. Regression and execution record

### 11.1 Commands and results

| Command/check | Result |
|---|---|
| `node --experimental-strip-types --test tests/exec-001-ticket-002.test.ts` | 10/10 passed |
| `node --experimental-strip-types --test tests/exec-001-ticket-001.test.ts` | 21/21 passed |
| `npm test` | 27/27 passed |
| `npm run typecheck` | PASS |
| `npm run verify:skill-mirror` | PASS; 67 canonical source files synchronized |
| `npm run verify:audit-governance` | PASS |
| `node --experimental-strip-types --test tests/*.test.ts` | 31 individual tests passed and 13 DOM test-file entries failed before execution due Node strip-only unsupported parameter-property syntax or `.js` module resolution; environmental failures, not TICKET-002 regressions |
| Independent behavioral probes | Executed wrong-schema, scope-substitution, missing-source, forged-supported-set and large-semver probes; results are recorded in §§8 and 10. |

Unique executable test accounting, including the broad discovery run and root
suite, is:

```text
TESTS_RUN = 71
TESTS_PASSED = 58
TESTS_FAILED = 13
TESTS_SKIPPED = 0
ENVIRONMENTAL_FAILURES = 13
IMPLEMENTATION_FAILURES = 0 in the focused and directly affected suites
PREEXISTING_REGRESSIONS = 0 discovered in relevant regression suites
CROSS_SPEC_FAILURES = 0 executable integrated suites available
```

The 13 broad-run failures are environmental loader/module-resolution failures
in unrelated DOM tests. They do not terminate this audit and are not counted as
implementation regressions.

### 11.2 Regression result

`REGRESSION_RESULT = NO_REGRESSION` for the affected executable contracts:
TICKET-001, the root workflow suite, typecheck and governance guards all pass.
The broad `tests/*.test.ts` command is not a valid regression baseline in this
Node strip-only environment and is classified as environmental rather than a
TICKET-002 failure.

## 12. Root-cause campaigns and surface matrices

### 12.1 `RCC-EXEC-REGISTRY-UNTRUSTED-BASIS-001`

```text
ROOT_CAUSE_ID = unverified caller/source material is allowed to act as frozen registry authority
CAMPAIGN_STATUS = OPEN
CAMPAIGN_SCOPE = EXEC-001-TICKET-002 local registry/application boundary
CANONICAL_FINDINGS = BEH-CRITICAL-001, BEH-MAJOR-002, BEH-MAJOR-003
CAMPAIGN_MATRIX_COMPLETE = YES
ALL_SURFACE_ROWS_COVERED = NO (negative witnesses are missing)
ROOT_CAUSE_REMOVED = NO
KNOWN_MANIFESTATIONS_CLOSED = NO
SYSTEMIC_TEST_EVIDENCE = PRESENT but incomplete
```

| Surface class | Location | Current behavior | Expected behavior | Coverage / negative witness |
|---|---|---|---|---|
| `ISSUER` | `CatalogBasis.create`; future DOM/REPO producers | No producer-issued brand or authority receipt exists on a basis | Issuer and exact scope/revision must be independently verifiable | `MISSING`; no forged issuer witness |
| `REGISTRAR` | `RegisterExecCapability`, `registerRegistryEntry`, `RegistryEntry.create` | Caller-created entry and duck-typed support set can enter the basis | Registration validates domain value provenance and complete schema contract | `MISSING`; forged support-set probe fails |
| `CONSUMER` | `ResolveExecCapability.resolve`, lines 35-37 | Caller `basis` is accepted before scope/provider selection | Consumer must use an authorized provider and verify basis scope/provenance | `MISSING`; `scope-bypass` negative probe |
| `ALTERNATE_AUTHORITY_PATH` | Direct `RegistryResolutionService.resolve` | Any `CatalogBasis` is accepted; expected request scope is not part of the domain request | Direct and application paths must enforce the same authority binding | `MISSING`; no direct expected-scope negative test |
| `INJECTION_POINT` | `ResolveExecCapabilityInput.basis/scope/repositoryId`; `RegistryResolutionRequest.supportedVersions` | Caller selects basis/context and supported set participates in classification | Caller values may request but cannot establish canonical basis/support authority | `MISSING`; caller injection not rejected |
| `MUTATION_PATH` | `CatalogBasis.register` | Old basis is immutable and duplicate local registration is rejected | Preserve this no-mutation invariant for all failure paths | `COVERED` locally; no physical CAS |
| `STALE_PATH` | TICKET-003/PLAT boundary | No local stale-material path | Rehydrate/revalidate stale material at owning boundary | `OUTSIDE_SCOPE`; owner TICKET-003/PLAT |
| `PORT_SUBSTITUTION_PATH` | `ExecutionCatalogBasisReader`, `NormalCatalogSource` | Ports return unbranded basis values; alternate adapters are not contract-tested | All adapters must preserve the producer/consumer proof | `MISSING`; no alternate adapter witness |
| `PUBLIC_EXPORT` | Exported domain classes/functions and composition root | Public API exposes direct basis injection and registration inputs | Public API must not expose caller-mintable authority | `MISSING`; direct public path is the defect |
| `PERSISTENCE` | No TICKET-002 persistence adapter | Not implemented | Physical integrity/ordering/CAS belongs to PLAT/TICKET-003 | `OUTSIDE_SCOPE` with owner/route |
| `RETRY_RECOVERY` | No TICKET-002 effect/retry path | Not implemented | Retry/recovery must preserve basis and identity at owning downstream boundary | `OUTSIDE_SCOPE` with owner/route |
| `LEGACY_ROUTE` | No legacy registry writer | No alternate legacy registry route found | REPO may adapt legacy material without a second authority | `NOT_APPLICABLE` locally; REPO route |
| `ARCHITECTURE_GUARD` | TICKET-002 import/source guard | Static forbidden-token scan exists | Guard must also preserve alternate-adapter authority contract | `COVERED` for import boundary; provenance negative missing |
| `TEST` | `tests/exec-001-ticket-002.test.ts` | Positive fixture tests exist; forged/scope/source negatives are absent | Direct positive and negative witnesses for every authority surface | `MISSING`; contributes BEH-MAJOR-002 |

### 12.2 `RCC-EXEC-REGISTRY-OUTCOME-CLASSIFICATION-001`

```text
ROOT_CAUSE_ID = resolver filters incompatible known material as unknown before canonical outcome classification
CAMPAIGN_STATUS = OPEN
CAMPAIGN_SCOPE = EXEC-001-TICKET-002 resolution result boundary
CANONICAL_FINDINGS = BEH-MAJOR-001
CAMPAIGN_MATRIX_COMPLETE = YES
ALL_SURFACE_ROWS_COVERED = NO (schema-incompatibility negative witness missing)
ROOT_CAUSE_REMOVED = NO
KNOWN_MANIFESTATIONS_CLOSED = NO
SYSTEMIC_TEST_EVIDENCE = PRESENT for version/unknown cases only
```

| Surface class | Location | Current behavior | Expected behavior | Coverage / negative witness |
|---|---|---|---|---|
| `ISSUER` | `RegistryEntry` / catalog basis | Known capability is present with its schema authority | Entry identity must remain discoverable before compatibility classification | `COVERED` on normal registration; schema variant not covered |
| `REGISTRAR` | `CatalogBasis.findCandidates`, lines 415-419 | Schema is part of the first candidate filter | First establish known capability, then classify schema incompatibility | `MISSING`; wrong-schema probe returned UNKNOWN |
| `CONSUMER` | `RegistryResolutionService.resolve`, lines 478-484 | No candidates yields `UNKNOWN_CAPABILITY` | Known-but-incompatible schema yields `INCOMPATIBLE_CAPABILITY` | `MISSING` |
| `ALTERNATE_AUTHORITY_PATH` | Direct resolver and application resolver | Both use the same incorrect filtering path | All paths must preserve canonical outcome meaning | `COVERED` as common code path, defect shared |
| `INJECTION_POINT` | `RegistryResolutionRequest.schema` | Caller can submit a schema reference; result code depends on filter order | Input schema is validated against known entry and incompatibility is explicit | `MISSING` |
| `MUTATION_PATH` | Failure result creation | Failure does not mutate local basis | Preserve no-mutation/no-approval properties for corrected code | `PARTIAL`; properties exist but wrong code test absent |
| `STALE_PATH` | TICKET-003/PLAT reconstruction | Not local | Reconstructed stale material remains `CONTRACT_INVALID` | `OUTSIDE_SCOPE`; owner TICKET-003/PLAT |
| `PORT_SUBSTITUTION_PATH` | Application source ports | Source selection precedes common resolver | All adapters must feed the same corrected classification | `MISSING` integrated adapter |
| `PUBLIC_EXPORT` | `RegistryResolutionService`, `isRegistryFailure` | Public consumers receive incorrect code for wrong schema | Public result contract must preserve known/incompatible distinction | `MISSING` |
| `PERSISTENCE` | No local persistence | Not local | Persisted result semantics remain owner-specific | `OUTSIDE_SCOPE` |
| `RETRY_RECOVERY` | No local retry | Not local | Retry must not turn incompatible into unknown/success | `OUTSIDE_SCOPE` |
| `LEGACY_ROUTE` | No local legacy route | Not local | REPO compatibility route preserves canonical code | `NOT_APPLICABLE` locally |
| `ARCHITECTURE_GUARD` | Common resolver path | Common path exists | Guard must include canonical outcome conformance | `MISSING` semantic guard |
| `TEST` | TICKET-002 tests lines 154-166 | Unknown and version-incompatible only | Direct wrong-schema known-incompatible assertion required | `MISSING` |

These campaigns remain open. They are not claims that integrated-only
capabilities have become local blockers; they preserve the approved dependency
classes and downstream routes.

## 13. Findings

### BEH-CRITICAL-001 — Caller can substitute a frozen basis and forge support authority

- **Severity:** `CRITICAL`
- **Ticket:** `EXEC-001-TICKET-002`
- **Requirement / acceptance references:** `EXEC-REGISTRY-001`, `EXEC-REGISTRY-002`, `EXEC-REGISTRY-003`, `EXEC-CAPABILITY-002`; `AC-EXEC-009`, `AC-EXEC-010`, `AC-EXEC-012`
- **Capability:** `UNIT-EXEC-REGISTRY-FIXTURE` (`AUTHORITY_STATUS=DEFINED`, `CONTRACT_STATUS=DEFINED`, `LOCAL_TESTABILITY=YES`, `PRODUCTIVE_AVAILABILITY=NO`)
- **Dependency class:** `INFORMATIONAL`
- **Local acceptance dependency:** `YES`; this violates local scope/allowlist acceptance even though no productive foreign capability is required.
- **Evidence timing:** local closure; integrated provenance evidence remains due at the integrated checkpoint.
- **`LOCAL_CLOSURE_BLOCKING`:** `YES`
- **`DEPENDENCY_CLASS_RECLASSIFICATION_REQUIRED`:** `NO`
- **`UPSTREAM_DEPENDENCY_CLASSIFICATION_PRESERVED`:** `YES`
- **Systemic pattern:** `YES`
- **Root-cause campaign:** `RCC-EXEC-REGISTRY-UNTRUSTED-BASIS-001`
- **Required behavior:** The resolver must use an authorized frozen basis for the requested NORMAL/BOOTSTRAP scope. Caller input must not substitute a different catalog, bypass bootstrap allowlisting, or mint the supported-version authority.
- **Production evidence:** `ResolveExecCapabilityInput` publicly exposes `basis` (`src/application/exec-registry.ts:14-18`). `selectBasis` returns that basis immediately (`src/application/exec-registry.ts:35-42`) without comparing it with `scope`. The resolver request has no authoritative expected scope (`src/domain/exec-registry.ts:422-430`). `RegistryEntry.create` accepts `input.supportedVersions` after only invoking `.has` (`src/domain/exec-registry.ts:308-324`), so a plain `{ has: () => true }` object is retained as authority.
- **Test evidence:** The existing synthetic test injects `basis` directly into the resolution request (`tests/exec-001-ticket-002.test.ts:168-181`) and contains no mismatched-scope negative. The independent probe resolved a BOOTSTRAP basis for a NORMAL request: `scope-bypass RESOLVED RESOLVED BOOTSTRAP`. The forged support-set probe accepted an unsupported version: `forged-support-set true function`.
- **Observed result:** A caller can request NORMAL scope while supplying a BOOTSTRAP basis and receive `RESOLVED`; caller-created duck-typed supported-set material can assert support for a version not in a genuine explicit set.
- **Expected result:** Scope/provider mismatch and non-domain authority material must fail closed with a structured canonical failure and no work, approval or mutation. A local fixture may remain available through a trusted test composition/provider, but not as unverified request authority.
- **Problem:** The implementation treats a caller-selected object as the frozen catalog authority and does not enforce a genuine supported-set value boundary. The bootstrap guard only sees the substituted basis's scope, not the requested authority context.
- **Impact:** Wrong-repository or BOOTSTRAP/NORMAL substitution can resolve an entry under the wrong authority and bypass the intended bootstrap restriction. This is a caller-supplied authority bypass, explicitly critical under the behavior audit contract.
- **Minimum correction required:** Move fixture/source basis selection to trusted composition/provider injection; remove or authenticate request-level `basis`; require and verify the expected scope/repository and producer provenance before resolution; require `supportedVersions instanceof SupportedVersionSet` (or an independently verified producer-issued equivalent); add direct mismatch, forged, stale/mutated and alternate-adapter negative witnesses.
- **Suggested completion effects:** `SUGGESTED_BLOCKS_LOCAL_EXECUTION=YES`; `SUGGESTED_BLOCKS_LOCAL_CLOSURE=YES`; `SUGGESTED_BLOCKS_TICKET_DONE=YES`; `SUGGESTED_BLOCKS_INTEGRATED_PROOF=YES`; `SUGGESTED_BLOCKS_SPEC_FINAL_CONFORMANCE=YES`.
- **Related locations:** `src/application/exec-registry.ts:14-56`; `src/domain/exec-registry.ts:232-245,299-325,422-430`; `tests/exec-001-ticket-002.test.ts:168-181`.

### BEH-MAJOR-001 — Known schema incompatibility is reported as unknown capability

- **Severity:** `MAJOR`
- **Ticket:** `EXEC-001-TICKET-002`
- **Requirement / acceptance references:** `EXEC-CAPABILITY-001`, `EXEC-REGISTRY-001`; `AC-EXEC-008`, `AC-EXEC-011`
- **Capability:** `UNIT-EXEC-REGISTRY-FIXTURE` (`AUTHORITY_STATUS=DEFINED`, `CONTRACT_STATUS=DEFINED`, `LOCAL_TESTABILITY=YES`, `PRODUCTIVE_AVAILABILITY=NO`)
- **Dependency class:** `INFORMATIONAL`
- **Local acceptance dependency:** `YES`
- **Evidence timing:** local closure
- **`LOCAL_CLOSURE_BLOCKING`:** `YES`
- **`DEPENDENCY_CLASS_RECLASSIFICATION_REQUIRED`:** `NO`
- **`UPSTREAM_DEPENDENCY_CLASSIFICATION_PRESERVED`:** `YES`
- **Systemic pattern:** `YES`
- **Root-cause campaign:** `RCC-EXEC-REGISTRY-OUTCOME-CLASSIFICATION-001`
- **Required behavior:** A known capability that is incompatible by schema, version, role or basis must retain `INCOMPATIBLE_CAPABILITY`; only an absent capability is `UNKNOWN_CAPABILITY`.
- **Production evidence:** `CatalogBasis.findCandidates` filters by input schema before returning candidates (`src/domain/exec-registry.ts:415-419`). `RegistryResolutionService.resolve` then treats an empty list as unknown (`src/domain/exec-registry.ts:478-479`), so it cannot distinguish known capability/wrong schema from absent capability.
- **Test evidence:** Existing tests cover absent capability and unsupported version only (`tests/exec-001-ticket-002.test.ts:154-166`). The independently executed wrong-schema probe returned `wrong-schema FAILED UNKNOWN_CAPABILITY` for a registered capability.
- **Observed result:** Registered capability + incompatible schema is classified as `UNKNOWN_CAPABILITY`.
- **Expected result:** The known capability must be identified first, then schema incompatibility must return `INCOMPATIBLE_CAPABILITY` with `noMutation=true` and `noApproval=true`.
- **Problem:** Candidate filtering conflates identity lookup failure with compatibility failure.
- **Impact:** Consumers cannot safely distinguish “not registered” from “registered but incompatible,” undermining canonical retry, diagnostics and fail-closed routing.
- **Minimum correction required:** Resolve by stable capability identity before applying schema compatibility; classify schema/stage/version/role mismatch as incompatible where the entry is known; add direct positive/negative assertions for each incompatibility dimension and failure-state properties.
- **Suggested completion effects:** `SUGGESTED_BLOCKS_LOCAL_EXECUTION=YES`; `SUGGESTED_BLOCKS_LOCAL_CLOSURE=YES`; `SUGGESTED_BLOCKS_TICKET_DONE=YES`; `SUGGESTED_BLOCKS_INTEGRATED_PROOF=YES`; `SUGGESTED_BLOCKS_SPEC_FINAL_CONFORMANCE=YES`.
- **Related locations:** `src/domain/exec-registry.ts:415-419,466-494`; `tests/exec-001-ticket-002.test.ts:154-166`.

### BEH-MAJOR-002 — Acceptance witnesses leave scope, conflict, provenance and failure transitions unproven

- **Severity:** `MAJOR`
- **Ticket:** `EXEC-001-TICKET-002`
- **Requirement / acceptance references:** `EXEC-REGISTRY-001`, `EXEC-REGISTRY-002`, `EXEC-REGISTRY-003`, `EXEC-CAPABILITY-001`, `EXEC-CAPABILITY-002`; `AC-EXEC-008`, `AC-EXEC-009`, `AC-EXEC-010`, `AC-EXEC-011`, `AC-EXEC-012`, contribution `AC-EXEC-007`
- **Capability:** `UNIT-EXEC-REGISTRY-FIXTURE` (`AUTHORITY_STATUS=DEFINED`, `CONTRACT_STATUS=DEFINED`, `LOCAL_TESTABILITY=YES`, `PRODUCTIVE_AVAILABILITY=NO`)
- **Dependency class:** `INFORMATIONAL`
- **Local acceptance dependency:** `YES`
- **Evidence timing:** local closure
- **`LOCAL_CLOSURE_BLOCKING`:** `YES`
- **`DEPENDENCY_CLASS_RECLASSIFICATION_REQUIRED`:** `NO`
- **`UPSTREAM_DEPENDENCY_CLASSIFICATION_PRESERVED`:** `YES`
- **Systemic pattern:** `YES`
- **Root-cause campaign:** `RCC-EXEC-REGISTRY-UNTRUSTED-BASIS-001`
- **Required behavior:** Every acceptance witness must directly exercise the normative operation and assert both the positive result and the relevant negative/isolation/no-mutation semantics.
- **Production evidence:** The implementation exposes multiple direct public paths (`ResolveExecCapability.resolve`, `RegistryResolutionService.resolve`, `CatalogBasis.register`) but no corresponding producer-verification guard. The normal basis test can therefore prove only the happy path, not the caller-substitution invariant.
- **Test evidence:** (1) complete mapping does not assert output schema, semantic version, supported set or category; (2) isolation tests two successful bases but never passes a foreign basis into a requested scope; (3) duplicate test does not construct a distinct conflict; (4) synthetic registration does not directly reject category-specific bypass or forged input; (5) incompatible distinction does not assert no-approval/no-mutation; (6) source-seam tests only a successful fixture read; (7) no wrong-schema or unavailable-source negative exists. These gaps are recorded by the three proxy-only rows and three untested transitions in §5.
- **Observed result:** Focused tests are green, but three required behaviors are proxy-only and three state/failure transitions have no direct executable witness. The direct negative probes found actual defects rather than merely hypothetical gaps.
- **Expected result:** Direct witness coverage must equal the nine required acceptance/contribution behaviors, with negative witnesses for caller injection, cross-scope substitution, conflict, schema incompatibility and source failure.
- **Problem:** Test names and pass counts overstate semantic coverage; available assertions do not prove the complete contract or authority boundary.
- **Impact:** A green local suite can approve a resolver that is vulnerable to basis substitution and emits incorrect canonical failures. This is a blocking local acceptance evidence defect independent of integrated-only availability.
- **Minimum correction required:** Add executable assertions for all missing fields and negative transitions; add forged/caller-injected basis and support-set tests, cross-scope and cross-repository substitution tests, conflict/no-mutation tests, wrong-schema incompatible-code tests, source failure mapping tests, and alternate-adapter contract tests. Keep fixture tests explicitly local-only.
- **Suggested completion effects:** `SUGGESTED_BLOCKS_LOCAL_EXECUTION=YES`; `SUGGESTED_BLOCKS_LOCAL_CLOSURE=YES`; `SUGGESTED_BLOCKS_TICKET_DONE=YES`; `SUGGESTED_BLOCKS_INTEGRATED_PROOF=YES`; `SUGGESTED_BLOCKS_SPEC_FINAL_CONFORMANCE=YES`.
- **Related locations:** `tests/exec-001-ticket-002.test.ts:92-212`; `src/application/exec-registry.ts:35-56`; `src/domain/exec-registry.ts:299-325,402-419,466-503`.

### BEH-MAJOR-003 — Application source failures escape as exceptions instead of structured fail-closed results

- **Severity:** `MAJOR`
- **Ticket:** `EXEC-001-TICKET-002`
- **Requirement / acceptance references:** `EXEC-REGISTRY-001`, `EXEC-REGISTRY-002`, `EXEC-REGISTRY-003`, `EXEC-CAPABILITY-001`; `AC-EXEC-008`, `AC-EXEC-009`, `AC-EXEC-010`, `AC-EXEC-011`
- **Capability:** `DOM-EXEC-IDENTITY-SNAPSHOT` / `REPO-EXEC-NORMAL-CATALOG` (`AUTHORITY_STATUS=DEFINED`, `CONTRACT_STATUS=DEFINED`, `LOCAL_TESTABILITY=NO`, `PRODUCTIVE_AVAILABILITY=NO`)
- **Dependency class:** `REQUIRED_FOR_INTEGRATED_PROOF`
- **Local acceptance dependency:** `NO`; the approved ticket explicitly classifies these foreign producers as integrated-only.
- **Evidence timing:** integrated checkpoint
- **`LOCAL_CLOSURE_BLOCKING`:** `NO`
- **`DEPENDENCY_CLASS_RECLASSIFICATION_REQUIRED`:** `NO`
- **`UPSTREAM_DEPENDENCY_CLASSIFICATION_PRESERVED`:** `YES`
- **Systemic pattern:** `YES`
- **Root-cause campaign:** `RCC-EXEC-REGISTRY-UNTRUSTED-BASIS-001`
- **Required behavior:** Application source not-found, unavailable, stale or thrown failures must be mapped into the canonical fail-closed registry result without implying resolution, approval or mutation.
- **Production evidence:** `ResolveExecCapability.resolve` calls `selectBasis` outside the resolver's failure-mapping `try` (`src/application/exec-registry.ts:35-37`). Missing source/read failures in `selectBasis` throw at lines 42-56. The domain's `CONTRACT_INVALID` result mapper is therefore bypassed.
- **Test evidence:** The only source-seam test is successful bootstrap read (`tests/exec-001-ticket-002.test.ts:184-197`). The independent missing-source probe observed `missing-source THREW CONTRACT_INVALID`, not a `FAILED` result.
- **Observed result:** A missing source dependency raises an exception to the caller; no structured basis/cause/no-approval result is returned.
- **Expected result:** The application must return a structured canonical failure preserving the failure family, basis/context and no-success/no-approval semantics. The producer's productive absence remains an integrated-only capability fact.
- **Problem:** Source failure propagation is not fail-closed at the application boundary.
- **Impact:** Integrated consumers can receive an exception instead of a canonical result, preventing deterministic classification and allowing adapter-specific failure semantics to leak across the EXEC boundary.
- **Minimum correction required:** Catch and normalize source read/not-found/stale exceptions at the application boundary into the approved registry failure result; preserve the approved dependency class and add producer failure, stale, detached and alternate-adapter tests at integrated proof.
- **Suggested completion effects:** `SUGGESTED_BLOCKS_LOCAL_EXECUTION=NO`; `SUGGESTED_BLOCKS_LOCAL_CLOSURE=NO`; `SUGGESTED_BLOCKS_TICKET_DONE=NO`; `SUGGESTED_BLOCKS_INTEGRATED_PROOF=YES`; `SUGGESTED_BLOCKS_SPEC_FINAL_CONFORMANCE=YES`.
- **Related locations:** `src/application/exec-registry.ts:20-56`; `src/application/exec-registry-ports.ts:1-15`; `tests/exec-001-ticket-002.test.ts:184-197`.

### BEH-MINOR-001 — Valid large semver numeric identifiers lose precision

- **Severity:** `MINOR`
- **Ticket:** `EXEC-001-TICKET-002`
- **Requirement / acceptance references:** `EXEC-VERSION-001`; `AC-EXEC-003`
- **Capability:** `UNIT-EXEC-REGISTRY-FIXTURE` (`AUTHORITY_STATUS=DEFINED`, `CONTRACT_STATUS=DEFINED`, `LOCAL_TESTABILITY=YES`, `PRODUCTIVE_AVAILABILITY=NO`)
- **Dependency class:** `INFORMATIONAL`
- **Local acceptance dependency:** `NO` for the currently exercised closure cases; the defect affects valid edge values beyond the focused witness.
- **Evidence timing:** local quality follow-up
- **`LOCAL_CLOSURE_BLOCKING`:** `NO`
- **`DEPENDENCY_CLASS_RECLASSIFICATION_REQUIRED`:** `NO`
- **`UPSTREAM_DEPENDENCY_CLASSIFICATION_PRESERVED`:** `YES`
- **Systemic pattern:** `NO`
- **Required behavior:** Semver major/minor/patch values must remain distinguishable for every accepted semantic-version numeric identifier.
- **Production evidence:** `SemanticVersion.parse` converts regex captures to JavaScript `Number` at `src/domain/exec-registry.ts:100-107`; comparison/classification uses those rounded numbers at lines 114-140.
- **Test evidence:** Independent probe parsed `1.9007199254740992.0` and `1.9007199254740993.0` to the same minor value, returned `compare=0`, and classified the change as `PATCH`. No focused test covers large numeric identifiers or build-metadata classification.
- **Observed result:** Two distinct valid semver strings can compare equal or receive the wrong change class.
- **Expected result:** Accepted numeric identifiers must compare exactly, or the parser must explicitly reject values it cannot represent according to the normative semver contract.
- **Problem:** Floating-point conversion silently loses semantic-version precision.
- **Impact:** Rare large-version inputs can produce incorrect compatibility/change classification; this is localized and does not affect ordinary tested values.
- **Minimum correction required:** Compare numeric identifiers using exact decimal strings/`BigInt` with an explicit supported range, and add boundary tests. Define whether build metadata changes are `NONE` for semantic classification.
- **Suggested completion effects:** `SUGGESTED_BLOCKS_LOCAL_EXECUTION=NO`; `SUGGESTED_BLOCKS_LOCAL_CLOSURE=NO`; `SUGGESTED_BLOCKS_TICKET_DONE=NO`; `SUGGESTED_BLOCKS_INTEGRATED_PROOF=NO`; `SUGGESTED_BLOCKS_SPEC_FINAL_CONFORMANCE=NO`.
- **Related locations:** `src/domain/exec-registry.ts:78-146`; `tests/exec-001-ticket-002.test.ts:70-90`.

## 14. Specialist summary

Audit: `docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-implementation-behavior-audit.md`

Specialist:
IMPLEMENTATION_BEHAVIOR

Ticket: `EXEC-001-TICKET-002`

Required behavioral dimensions: 7 (5 required and 2 affected)

Required tests: 10

Required tests missing: 3 (integrated-only `INTEGRATION`, `CROSS_SPEC`, `CONCURRENCY`)

Required behaviors total: 9

Direct behavior witnesses: 6

Proxy-only behaviors: 3

Untested state transitions: 3

Unproven concurrency contracts: 1

Missing architecture guards: 0

Tests run: 71

Tests passed: 58

Tests failed: 13

Regressions: 0

Concurrency:
NON_CONFORMANT

Stale behavior:
NOT_APPLICABLE

Idempotency:
CONFORMANT

Recovery:
NOT_APPLICABLE

Authority consumption:
DEFINED_BUT_NOT_CONSUMABLE

Temporal authority:
NOT_APPLICABLE

Caller-as-authority bypasses: 1

Findings:
CRITICAL=1
MAJOR=3
MINOR=1
INFO=0

Domain audit complete:
YES

Specialist result:
SPECIALIST_BEHAVIOR_FINDINGS

AUDIT_TARGET_HEAD: d4216ad6f4a87fe7142ccd45d3fd099ef1b92955
AUDIT_TARGET_STATE_FINGERPRINT: 4ae3e359d87e354024c62f86fca4eba759e78335f78696185277e0e37a3e0bf4
DOMAIN_AUDIT_COMPLETE: YES
SPECIALIST_RESULT: SPECIALIST_BEHAVIOR_FINDINGS