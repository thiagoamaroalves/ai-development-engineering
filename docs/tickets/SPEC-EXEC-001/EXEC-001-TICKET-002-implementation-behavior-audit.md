# Implementation behavior audit — EXEC-001-TICKET-002

## Audit identity and required inputs

| Field | Value |
|---|---|
| TICKET_ID | `EXEC-001-TICKET-002` |
| TICKET_PATH | `docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-version-registry-catalogs-capabilities.md` |
| IMPLEMENTATION_UNIT | `EXEC-IMP-02 — Version, registry resolution, catalogs and capability extensibility` |
| REQUIREMENT_IDS | `EXEC-VERSION-001`, `EXEC-VERSION-002`, `EXEC-REGISTRY-001`, `EXEC-REGISTRY-002`, `EXEC-REGISTRY-003`, `EXEC-CAPABILITY-001`, `EXEC-CAPABILITY-002` |
| ACCEPTANCE_IDS | `AC-EXEC-003`, `AC-EXEC-004`, `AC-EXEC-005` (contribution), `AC-EXEC-007` (contribution), `AC-EXEC-008`, `AC-EXEC-009`, `AC-EXEC-010`, `AC-EXEC-011`, `AC-EXEC-012` |
| SPEC_PATH | `docs/specs/SPEC-EXEC-001-skill-contracts-and-capability-registry.md` |
| GAP_MATRIX_PATH | `docs/specs/gap-matrices/SPEC-EXEC-001-implementation-gap-matrix.md` |
| IMPLEMENTATION_PLAN_PATH | `docs/specs/implementation-plans/SPEC-EXEC-001-implementation-plan.md` |
| TICKET_SET_AUDIT_PATH | `docs/tickets/SPEC-EXEC-001/implementation-ticket-audit.md` |
| APPROVED_DESIGN_PATH | `docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-implementation-design.md` |
| IMPLEMENTATION_BASELINE | `d4216ad6f4a87fe7142ccd45d3fd099ef1b92955` (ticket-recorded semantic baseline) |
| CURRENT_HEAD | `cc3fe3210eaebf8e0f577f7f5e1e48b97ed175bb` |
| AUDIT_TARGET_HEAD | `cc3fe3210eaebf8e0f577f7f5e1e48b97ed175bb` |
| AUDIT_TARGET_STATE_FINGERPRINT | `d9da64d8a9ae6a490737bc93789929e656559d2463d06916d4704439d2d20c22` |
| CHANGED_PRODUCTION_FILES | `src/domain/exec-contract.ts`; `src/domain/exec-registry.ts`; `src/application/exec-registry.ts`; `src/application/exec-registry-ports.ts`; `src/composition/exec-registry.ts` |
| CHANGED_TEST_FILES | `tests/exec-001-ticket-002.test.ts` |
| RELEVANT_TEST_SUITES | focused TICKET-002 suite; TICKET-001 direct regression; package suite (`.pi` workflow tests plus TICKET-001/TICKET-002); TypeScript typecheck; audit-governance guard |

The pinned commit was present and the working tree was clean before execution. No implementation, test, ticket, authority, or Git state was changed by this audit. The supplied state fingerprint is used as the pinned semantic state basis.

## Authority-chain reconstruction

The contract reconstructed in order is:

`ADR-0003 revision 3 accepted → SPEC-EXEC-001 → GAP-004/GAP-006/GAP-008/GAP-009/GAP-010/GAP-011 → EXEC-IMP-02 → TICKET-002 → approved design → repository implementation/tests`.

The SPEC defines exact semver meaning and explicit support sets, deterministic complete registry entries, repository-scoped NORMAL versus independent BOOTSTRAP catalogs, bootstrap allowlist rejection, distinct `UNKNOWN_CAPABILITY`/`INCOMPATIBLE_CAPABILITY`, and common-path synthetic registration. It expressly excludes physical persistence/CAS/recovery and leaves DOM identity and REPO enabled-catalog producers to integrated proof. The ticket and design classify `DOM-EXEC-IDENTITY-SNAPSHOT` and `REPO-EXEC-NORMAL-CATALOG` as `REQUIRED_FOR_INTEGRATED_PROOF`, with `AUTHORITY_STATUS=DEFINED`, `CONTRACT_STATUS=DEFINED`, `LOCAL_TESTABILITY=NO`, and `PRODUCTIVE_AVAILABILITY=NO`. That classification is preserved below; no fixture is promoted to productive availability.

## Behavioral contract and applicability matrix

| Dimension | Classification | Contract and audit result |
|---|---|---|
| UNIT_BEHAVIOR | REQUIRED | Semver, explicit membership, complete entry mapping, canonical outcomes and immutable basis operations are ticket-owned. |
| INTEGRATION_BEHAVIOR | AFFECTED | DOM/REPO source ports and producer provenance are required at the integrated checkpoint, but are not locally available. |
| PERSISTENCE | NOT_APPLICABLE | This ticket uses immutable in-process bases; physical storage and semantic reconstruction are TICKET-003/PLAT scope. |
| CONCURRENCY | AFFECTED | Local duplicate/create-only semantics are relevant; physical CAS and concurrent producer winning are integrated-only. |
| STALE_STATE | AFFECTED | Requested catalog revision, scope and producer receipt must be checked; mutable external revalidation is not required for this no-effect local operation. |
| IDEMPOTENCY | REQUIRED | Duplicate/conflicting registration must fail without mutating the prior basis. |
| DURABILITY | NOT_APPLICABLE | No durable completion or external effect is claimed by this ticket. |
| RECOVERY | NOT_APPLICABLE | No restart, persisted replay, or interrupted external operation exists in this implementation unit. |
| COMPATIBILITY | REQUIRED | Semver comparison, exact supported sets, schema/role compatibility and canonical unknown/incompatible results are owned here. |
| MIGRATION_BEHAVIOR | NOT_APPLICABLE | `MIGRATION` is only an allowlist category in this ticket; migration execution is not implemented. |
| NEGATIVE_PATHS | REQUIRED | Invalid/forged inputs, unavailable or untrusted sources, duplicate/conflicting keys, stale basis and bootstrap leakage must fail closed. |

## Acceptance witness matrix recalculation

The design's nine rows were recalculated, including the two explicit contributor rows for AC-EXEC-005 and AC-EXEC-007.

| Required behavior | Direct production operation | Positive/negative evidence | Witness result |
|---|---|---|---|
| AC-EXEC-003 semver meaning | `SemanticVersion.parse` / `classifySemanticVersionChange` | Focused tests assert components and major/minor/patch/build semantics. | DIRECT; pass. |
| AC-EXEC-004 explicit support set | `SupportedVersionSet.has` and resolver | Supported, unsupported, malformed and duplicate versions are asserted. | DIRECT; pass. |
| AC-EXEC-008 deterministic complete mapping | `CatalogBasis.register` / `RegistryResolutionService.resolve` | Complete fields, registration-order independence, duplicate/conflict no-mutation. | DIRECT; pass locally. |
| AC-EXEC-009 catalog isolation | `CatalogScope` and `ResolveExecCapability.selectBasis` | NORMAL repository separation and source/scope substitution rejection. | DIRECT locally; productive integration unavailable. |
| AC-EXEC-010 bootstrap allowlist | `BootstrapAllowlistPolicy` in resolver | Normal category rejects; discovery category resolves. Ordering before a work effect is not directly exercised. | RESULT DIRECT; BEFORE-WORK ORDERING PROXY ONLY. |
| AC-EXEC-011 outcome distinction | Resolver identity lookup and compatibility filtering | Unknown, version-incompatible and schema-incompatible codes asserted distinctly. | DIRECT; pass. |
| AC-EXEC-012 common extensibility | `CatalogBasis.register` followed by common resolver | Synthetic schema-authenticated entry resolves and old basis remains unchanged. | DIRECT locally; productive source path unavailable. |
| AC-EXEC-005 contribution | New-basis publication and old-basis retention | Frozen-basis identity/entry assertions and duplicate rejection. | DIRECT local contribution; final DOM proof is downstream. |
| AC-EXEC-007 contribution | Resolver failure classification | Incompatible and source failures preserve fail-closed fields. | DIRECT local contribution; final failure mapping is downstream. |

`REQUIRED_BEHAVIORS_TOTAL=9`; `DIRECT_BEHAVIOR_WITNESSES=8`; `PROXY_ONLY_BEHAVIORS=1` (the AC-EXEC-010 before-work ordering claim); `UNTESTED_STATE_TRANSITIONS=1` (successful `RegisterExecCapability` publication from a productive producer source); `UNPROVEN_CONCURRENCY_CONTRACTS=1` (physical concurrent winner/CAS at the integrated boundary); `MISSING_ARCHITECTURE_GUARDS=1` (the only guard is test-time source-text inspection, not an enforced import boundary).

## Production semantics classification

- **Semver and support-set behavior — IMPLEMENTED_CORRECTLY locally.** `SemanticVersion` preserves exact decimal components, compares without unsafe numeric coercion, ignores build metadata for precedence, and `SupportedVersionSet` requires authenticated explicit membership. No range, alias, major-only approximation, or conversion path was observed.
- **Complete deterministic resolution — IMPLEMENTED_CORRECTLY locally.** `RegistryEntry.create` validates schema references, explicit support, artifacts, verdicts and roles. `CatalogBasis.register` returns a new basis and rejects duplicate immutable identities. The resolver orders candidates deterministically and returns a complete entry/result for a frozen local basis.
- **NORMAL/BOOTSTRAP separation and stale source checks — IMPLEMENTED_CORRECTLY at the local consumer boundary.** The application rejects caller basis injection, forged/copy receipts, wrong source kind, mismatched scope, mismatched revision and fixture use at the productive boundary. There is no productive DOM/REPO source implementation at this target.
- **Bootstrap allowlist — PARTIAL.** The domain result is correct (`INCOMPATIBLE_CAPABILITY`, `noApproval=true`, `noMutation=true`), but no work/enablement callback or effect boundary exists in this unit, so the “before work” ordering is not directly observable. The app-level test also rejects the local fixture before reading it, rather than exercising a producer-backed positive bootstrap resolution.
- **Unknown/incompatible outcomes — IMPLEMENTED_CORRECTLY for the exercised resolver.** Valid unknown identity yields `UNKNOWN_CAPABILITY`; known incompatible version/schema/stage/role yields `INCOMPATIBLE_CAPABILITY`; malformed request/source yields `CONTRACT_INVALID`.
- **Common extensibility — IMPLEMENTED_CORRECTLY only for local contract fixtures.** Synthetic registration uses the same domain path and preserves the old basis. `RegisterExecCapability` cannot publish a productive result from the only available local source type, by design.
- **Authority-bearing result guards — UNSAFE_FAILURE_BEHAVIOR.** `isRegistryResolution` and `isRegistryFailure` at `src/domain/exec-registry.ts:595-601` classify any plain object by `status`, while `isAuthenticatedRegistryResolutionResult` correctly rejects the same objects at `:628-630`. A caller-injected copied/forged result can therefore pass the public type guards even though it was not emitted by the resolver.
- **Registry entry input validation — UNSAFE_FAILURE_BEHAVIOR.** `RegistryEntry.create` at `:330-352` validates category with `String(category)` and stores the original value. An object whose `toString()` returns `NORMAL` is accepted and can resolve as a NORMAL capability, even though its category is not a valid category token.
- **Revision arithmetic — PARTIAL.** `CatalogBasis.createFixture` validates safe positive revisions, but `register` at `:442` increments `Number.MAX_SAFE_INTEGER` to an unsafe integer and publishes it without rejection.

## Authority consumption, provenance and temporal checks

| Capability | Authority | Contract | Local testability | Productive availability | Dependency class | Derived result |
|---|---|---|---|---|---|---|
| `UNIT-EXEC-REGISTRY-FIXTURE` | EXEC-001 local contract fixture | Authenticated immutable basis and result semantics | YES | NO | INFORMATIONAL | `CONTRACT_TESTABLE_LOCALLY`; not consumable productive authority. |
| `DOM-EXEC-IDENTITY-SNAPSHOT` | SPEC-DOM-001 / DOM canonical resolver | Scope, RepositoryId, frozen execution basis and revision | NO | NO | REQUIRED_FOR_INTEGRATED_PROOF | `DEFINED_BUT_NOT_CONSUMABLE` at this target; integrated follow-up required. |
| `REPO-EXEC-NORMAL-CATALOG` | SPEC-REPO-001 / enabled REPO configuration | Repository-scoped NORMAL material and exact basis revision | NO | NO | REQUIRED_FOR_INTEGRATED_PROOF | `DEFINED_BUT_NOT_CONSUMABLE` at this target; integrated follow-up required. |

The application verifies source identity, issued receipt identity, expected source kind, scope, source label and exact revision. Direct basis injection, copied receipts, caller-created sources and fixture sources at the productive application boundary are rejected. However, `exec-registry-ports.ts:43-72` keeps the only source registration and receipt issuance mechanism private, and the only exported constructors (`createLocal*Fixture`) mark sources as local fixtures (`:63-65`, `:115-124`). No productive DOM/REPO adapter can issue a receipt accepted by `isProducerIssuedCatalogBasisReceipt`; therefore productive authority consumption and its direct integrated witness are absent, as expressly classified `REQUIRED_FOR_INTEGRATED_PROOF`.

`TEMPORAL_AUTHORITY_PROOF=NOT_APPLICABLE` for the local operation: a frozen basis is read and no external effect is committed. The implementation does not claim mutable-authority revalidation or physical CAS. `CALLER_AS_AUTHORITY_CHECK` passes at the intended application seam for basis, repository, support-set and result injection, except for the public unverified result guards identified in BEH-CRITICAL-001. Caller-as-authority bypass count is therefore `1` public result-guard surface.

## Test inventory and assertion quality

| Category | Classification | Evidence |
|---|---|---|
| UNIT | REQUIRED_TEST_PRESENT | 20 focused TICKET-002 cases pass. |
| INVARIANT | REQUIRED_TEST_PRESENT | Entry completeness, duplicate rejection, immutable basis and result binding are asserted. |
| PERSISTENCE | TEST_CATEGORY_NOT_APPLICABLE | Physical persistence is outside this unit. |
| INTEGRATION | REQUIRED_TEST_MISSING | No productive DOM/REPO producer exists at the target. |
| CROSS_SPEC | REQUIRED_TEST_MISSING | No integrated producer/consumer execution witness exists. |
| CONCURRENCY | REQUIRED_TEST_MISSING | Sequential duplicate testing does not prove physical concurrent winner/CAS semantics. |
| STALE | REQUIRED_TEST_PRESENT | Exact revision, scope and copied/stale receipt negatives pass at the local consumer seam. |
| IDEMPOTENCY | REQUIRED_TEST_PRESENT | Duplicate/conflict failures preserve the old basis. |
| RECOVERY | TEST_CATEGORY_NOT_APPLICABLE | Recovery is PLAT/TICKET-003 scope. |
| COMPATIBILITY | REQUIRED_TEST_PRESENT | Semver, supported-set and unknown/incompatible tests pass. |
| MIGRATION | TEST_CATEGORY_NOT_APPLICABLE | Only category allowlisting is local. |
| NEGATIVE_PATH | REQUIRED_TEST_PRESENT | Forgery, malformed input, source failure, duplicate, stale and bootstrap leakage tests pass. |
| ARCHITECTURE_GUARD | REQUIRED_TEST_MISSING | The test reads source text with regexes; the skill does not accept source inspection alone as an enforced architecture guard. |
| CONFORMANCE | REQUIRED_TEST_PRESENT | `npm run typecheck` and `npm run verify:audit-governance` pass. |

Assertion quality is **STRONG** for direct semver, mapping, failure-code, immutability and application provenance assertions. It is **WEAK/PROXY_ONLY** for `assert.equal('resolveBeforeWork' in useCase, false)` at `tests/exec-001-ticket-002.test.ts:285`, which does not observe work ordering, and for the regex source-text architecture check. The six TICKET-002 evidence files are **MISLEADING as execution records** because each reports 16 tests although the pinned test file executes 20 cases; the ticket execution record also reports 31 total and focused 10/10, which does not match the target.

## Test execution record

| Command | Result |
|---|---|
| `node --experimental-strip-types --test tests/exec-001-ticket-002.test.ts` | 20 passed, 0 failed, 0 skipped. |
| `node --experimental-strip-types --test tests/exec-001-ticket-001.test.ts` | 21 passed, 0 failed, 0 skipped. |
| `npm test -- --test-name-pattern='.'` | 68 passed, 0 failed, 0 skipped (27 workflow tests, 21 TICKET-001, 20 TICKET-002). |
| `npm run typecheck` | PASS. |
| `npm run verify:audit-governance` | PASS. |

`TESTS_RUN=68` configured package test cases; `TESTS_PASSED=68`; `TESTS_FAILED=0`; `TESTS_SKIPPED=0`; `ENVIRONMENTAL_FAILURES=0`. The focused and package suites were independently executed, not inferred from ticket claims.

## Regression result

`REGRESSION_RESULT=NO_REGRESSION` for the affected baseline contracts: TICKET-001 direct regression passes 21/21 and the complete configured package suite passes 68/68. The TICKET-002 production surface is new relative to the ticket-recorded `d4216ad...` baseline, so no pre-existing TICKET-002 behavior was available for comparison. The stale documentary execution counts are evidence-integrity findings, not a runtime regression.

## Conditional dimensions

- **Concurrency: PARTIAL / summary `NON_CONFORMANT`.** Local create-only duplicate rejection is deterministic, but no concurrent productive producer, physical CAS, or one-winner witness exists. This is integrated-only and does not become a local closure blocker under the ticket's dependency classification.
- **Stale behavior: CONFORMANT locally.** Exact scope/revision and producer-receipt checks reject stale, copied, detached or mismatched material without mutation. External mutable-authority drift is not claimed.
- **Idempotency: CONFORMANT locally.** Re-registering an immutable key fails `CONTRACT_INVALID` and preserves the original basis; registration returns a new basis rather than mutating the prior one.
- **Durability/persistence: NOT_APPLICABLE.** No physical durability is implemented or claimed.
- **Recovery: NOT_APPLICABLE.** No restart or persisted recovery path exists in scope.
- **Compatibility: CONFORMANT for local semver/support/schema/role behavior.**

## Root-cause campaigns and surface matrices

### `ROOT_CAUSE_CAMPAIGN_ID=RCC-EXEC-REGISTRY-AUTHORITY-SURFACE`

`CAMPAIGN_STATUS=OPEN`; `CAMPAIGN_SCOPE=EXEC-001-TICKET-002 authority-bearing registry results and entry inputs`.

| Surface row | Class/location | Current behavior | Expected behavior | Coverage / negative witness |
|---|---|---|---|---|
| RAS-01 | ISSUER — `RegistryResolutionService.resolve`, `:555-570` | Issues frozen branded results and records them in a private WeakSet. | Only issuer-created results are consumable. | COVERED; `isAuthenticatedRegistryResolutionResult` negative is present. |
| RAS-02 | REGISTRAR — `RegistryEntry.create`, `:330-352` | Coerces category for validation but stores an untrusted object. | Invalid category material is rejected. | MISSING; forged `toString` category witness observed. |
| RAS-03 | CONSUMER — `isRegistryResolution`/`isRegistryFailure`, `:595-601` | Accepts any plain object with matching status. | Consumer-side provenance must be verified. | MISSING; forged plain result witness observed. |
| RAS-04 | ALTERNATE_AUTHORITY_PATH — direct exported domain resolver/fixture | Local fixture can resolve through the domain service by direct call. | Productive consumers must use owner-issued source material; local fixture remains contract-only. | OUTSIDE productive path; application boundary negative covered. |
| RAS-05 | INJECTION_POINT — caller-created result/category | Forged result passes public status guards; forged category can be registered. | Caller injection rejected. | MISSING; direct negative witnesses above. |
| RAS-06 | MUTATION/STALE — copied result and stale receipt | Bound-result helper rejects copied result; source seam rejects stale receipt. | All public authority checks reject copies/stale material. | PARTIAL; simple guards remain unsafe. |
| RAS-07 | PORT_SUBSTITUTION_PATH — `isProducerIssuedCatalogBasisReceipt`, `:126-139` | Unissued/cross-kind/copy receipts are rejected. | Alternate adapters satisfy the same provenance contract. | COVERED locally; no productive adapter exists. |
| RAS-08 | PUBLIC_EXPORT — domain result guards and policies | Public helpers expose status-only guards. | Exported authority guards must be authenticated or private. | MISSING. |
| RAS-09 | PERSISTENCE | No physical persistence in this ticket. | PLAT/TICKET-003 owns durable material. | NOT_APPLICABLE with explicit owner/route. |
| RAS-10 | RETRY_RECOVERY | No local retry/recovery operation. | Later PLAT/TICKET-003 proof. | OUTSIDE_SCOPE with explicit owner/route. |
| RAS-11 | ARCHITECTURE_GUARD — focused test source regex | Static source check exists but is not an enforced import boundary. | A direct architecture guard must fail on forbidden dependency introduction. | MISSING. |
| RAS-12 | TEST — `tests/exec-001-ticket-002.test.ts` | Tests app-level forgery but not raw helper forgery/category coercion. | Direct negative witness for every public authority surface. | MISSING. |

### `ROOT_CAUSE_CAMPAIGN_ID=RCC-EXEC-REGISTRY-INTEGRATED-CONSUMPTION`

`CAMPAIGN_STATUS=OPEN`; `CAMPAIGN_SCOPE=DOM/REPO producer consumption and integrated registry proof`.

| Surface row | Class/location | Current behavior | Expected behavior | Coverage / negative witness |
|---|---|---|---|---|
| RIC-01 | ISSUER — DOM producer | No productive producer/receipt issuer at target. | DOM issues exact owner-bound basis receipts. | MISSING; integrated checkpoint owner DOM. |
| RIC-02 | ISSUER — REPO producer | No productive producer/receipt issuer at target. | REPO issues repository-bound NORMAL catalog receipts. | MISSING; integrated checkpoint owner REPO. |
| RIC-03 | CONSUMER — `ResolveExecCapability.selectBasis`, `:76-141` | Verifies receipts if they exist; rejects fixtures. | Consume productive owner-issued basis. | PARTIAL; local negative only. |
| RIC-04 | PORT_SUBSTITUTION_PATH | Abstract ports have no producer extension point outside private fixture ledger. | Alternate productive adapter must satisfy the same contract. | MISSING; integrated contract design required. |
| RIC-05 | MUTATION/STALE | Exact revision checked once for each received basis. | Integrated producer/runtime must prove drift and physical integrity where required. | OUTSIDE local scope; downstream checkpoint. |
| RIC-06 | TEST | No productive DOM/REPO integration or concurrent producer test. | Direct integrated producer/consumer witnesses. | MISSING; `REQUIRED_FOR_INTEGRATED_PROOF`. |

Campaign closure gates are not met: `CAMPAIGN_MATRIX_COMPLETE=YES`, but `ALL_NEGATIVE_WITNESSES_PASS=NO`, `NO_UNEXPLAINED_PUBLIC_AUTHORITY_PATH=NO`, `ROOT_CAUSE_REMOVED=NO`, and `SYSTEMIC_TEST_EVIDENCE=PARTIAL`.

## Findings

### BEH-CRITICAL-001 — Public result guards accept caller-injected authority

- **Severity:** CRITICAL
- **Ticket:** `EXEC-001-TICKET-002`
- **Requirement / acceptance references:** `EXEC-CAPABILITY-001`, `EXEC-REGISTRY-001`; `AC-EXEC-008`, `AC-EXEC-011`, `AC-EXEC-007` contribution.
- **Category:** `CALLER_SUPPLIED_AUTHORITY_BYPASS`
- **Required behavior:** Every authority-bearing resolution result must be consumer-verified as resolver-issued, bound to the requested basis and request, and reject forged/copied/mutated results.
- **Production evidence:** `src/domain/exec-registry.ts:595-601` implements `isRegistryResolution` and `isRegistryFailure` as status-only checks. The same module's `:628-630` has the correct private-WeakSet-backed authentication predicate, but the exported convenience guards do not call it.
- **Test evidence:** `tests/exec-001-ticket-002.test.ts:327-346`, `349-389`, and `397-430` cover forged scope, schemas, sources, receipts and `isRegistryResolutionBoundToRequest`. No test passes a plain forged object to the public status guards. Independent witness: `{status:'RESOLVED',code:'RESOLVED'}` returns `true` from `isRegistryResolution`, and an analogous failed object returns `true` from `isRegistryFailure`, while `isAuthenticatedRegistryResolutionResult` returns `false` for both.
- **Observed result:** Caller-controlled plain objects are classified as canonical result variants by exported guards.
- **Expected result:** Forged, copied, stale and caller-injected result objects are rejected by every public consumer guard.
- **Problem:** A consumer using the exported guard can bypass the resolver's provenance boundary and treat an injected `RESOLVED` result as authoritative. `isRegistryResolutionBoundToRequest` is safer but does not repair the public status guards.
- **Impact:** A downstream consumer can accept false capability identity/version/schema/authority and potentially authorize work or completion. This is a fundamental authority/provenance invariant failure.
- **Minimum correction required:** Make both exported guards require `isAuthenticatedRegistryResolutionResult(value)` and preserve request/basis binding at consumer use; add direct forged, copied, stale and alternate-adapter negative tests for the exported surface.
- **Systemic pattern = YES**
- **Related locations:** `src/domain/exec-registry.ts:555-570`, `:595-601`, `:628-647`; `tests/exec-001-ticket-002.test.ts:397-430`; campaign `RCC-EXEC-REGISTRY-AUTHORITY-SURFACE`.
- **Capability:** `UNIT-EXEC-REGISTRY-FIXTURE` / authority-bearing registry result.
- **Dependency class:** `INFORMATIONAL` for local fixture semantics.
- **Local-acceptance dependency:** `LOCAL_ACCEPTANCE_REQUIRES_PRODUCTIVE_CAPABILITY=NO`.
- **Evidence timing:** Local closure.
- **LOCAL_CLOSURE_BLOCKING:** YES
- **DEPENDENCY_CLASS_RECLASSIFICATION_REQUIRED:** NO
- **UPSTREAM_DEPENDENCY_CLASSIFICATION_PRESERVED:** YES
- **Suggested canonical effects:** `BLOCKS_LOCAL_EXECUTION=YES`; `BLOCKS_LOCAL_CLOSURE=YES`; `BLOCKS_TICKET_DONE=YES`; `BLOCKS_INTEGRATED_PROOF=YES`; `BLOCKS_SPEC_FINAL_CONFORMANCE=YES`; `PRIMARY_ROUTE=IMPLEMENTATION_REMEDIATION`; `DOWNSTREAM_CHECKPOINT=none (local remediation required)`.

### BEH-MAJOR-001 — Non-string category is accepted as a valid registry entry

- **Severity:** MAJOR
- **Ticket:** `EXEC-001-TICKET-002`
- **Requirement / acceptance references:** `EXEC-REGISTRY-001`, `EXEC-REGISTRY-003`, `EXEC-CAPABILITY-002`; `AC-EXEC-008`, `AC-EXEC-010`, `AC-EXEC-012`.
- **Category:** `INPUT_VALIDATION_GAP`
- **Required behavior:** Schema-invalid registry material must fail closed; category must be one of the canonical string categories before entry registration/resolution.
- **Production evidence:** `src/domain/exec-registry.ts:330-333` validates `String(category)` but `:352` stores the original `category as BootstrapCapabilityCategory`.
- **Test evidence:** The focused suite tests unknown string categories only indirectly and tests forged entries at `tests/exec-001-ticket-002.test.ts:417-430`, but has no non-string category negative. Independent witness: `RegistryEntry.create({...validInput, category:{toString:()=> 'NORMAL'}})` succeeds; the resulting frozen entry has `typeof entry.category === 'object'` and resolves in a NORMAL basis as `RESOLVED`.
- **Observed result:** A malformed category object becomes an authenticated `RegistryEntry` and can produce a successful resolution.
- **Expected result:** Non-string or non-enumerated category input returns `CONTRACT_INVALID` before it can enter a basis.
- **Problem:** String coercion validates a representation while storing unvalidated authority-bearing material.
- **Impact:** Malformed or adversarial registry material can pass completeness and category checks, undermining bootstrap restriction and schema-valid extensibility guarantees.
- **Minimum correction required:** Require `typeof category === 'string'` and compare the original token to the allowlist; add normal and bootstrap forged-category negative tests and no-mutation assertions.
- **Systemic pattern = YES**
- **Related locations:** `src/domain/exec-registry.ts:325-354`; `tests/exec-001-ticket-002.test.ts:100-145`, `271-293`; campaign `RCC-EXEC-REGISTRY-AUTHORITY-SURFACE`.
- **Capability:** `UNIT-EXEC-REGISTRY-FIXTURE` / registry entry validation.
- **Dependency class:** `INFORMATIONAL`.
- **Local-acceptance dependency:** `LOCAL_ACCEPTANCE_REQUIRES_PRODUCTIVE_CAPABILITY=NO`.
- **Evidence timing:** Local closure.
- **LOCAL_CLOSURE_BLOCKING:** YES
- **DEPENDENCY_CLASS_RECLASSIFICATION_REQUIRED:** NO
- **UPSTREAM_DEPENDENCY_CLASSIFICATION_PRESERVED:** YES
- **Suggested canonical effects:** `BLOCKS_LOCAL_EXECUTION=YES`; `BLOCKS_LOCAL_CLOSURE=YES`; `BLOCKS_TICKET_DONE=YES`; `BLOCKS_INTEGRATED_PROOF=YES`; `BLOCKS_SPEC_FINAL_CONFORMANCE=YES`; `PRIMARY_ROUTE=IMPLEMENTATION_REMEDIATION`; `DOWNSTREAM_CHECKPOINT=none (local remediation required)`.

### BEH-MAJOR-002 — Productive DOM/REPO authority cannot be consumed or witnessed at the integrated boundary

- **Severity:** MAJOR
- **Ticket:** `EXEC-001-TICKET-002`
- **Requirement / acceptance references:** `EXEC-REGISTRY-001`, `EXEC-REGISTRY-002`, `EXEC-CAPABILITY-001`; `AC-EXEC-008`, `AC-EXEC-009`, `AC-EXEC-011`.
- **Category:** `AUTHORITY_CONSUMPTION_GAP`
- **Required behavior:** At the integrated checkpoint, EXEC must consume owner-issued DOM execution-basis and REPO NORMAL catalog material with exact scope, source, revision and failure semantics.
- **Production evidence:** `src/application/exec-registry-ports.ts:43-72` keeps source registration and receipt issuance private; only `createLocal*Fixture` is exported and marks sources as local at `:63-65`. `src/application/exec-registry.ts:76-141` explicitly rejects local fixtures and requires productive sources; no productive source exists at the target.
- **Test evidence:** `tests/exec-001-ticket-002.test.ts:349-430` directly proves forged/copy/wrong-kind/stale fixture rejection. No productive DOM/REPO adapter can issue an accepted receipt, and no integrated producer/consumer test ran. The target ticket itself records `PRODUCTIVE_AVAILABILITY=NO` for both foreign capabilities.
- **Observed result:** Local contract semantics are testable, but every available source is either absent or rejected as a fixture; productive authority consumption is not available.
- **Expected result:** A downstream integrated producer issues an owner-bound receipt and a direct test proves resolution from productive DOM/REPO material.
- **Problem:** The missing capability is required for integrated proof, and the port module exposes no producer-owned extension/issuance surface through which a real adapter can become consumable.
- **Impact:** Local tests cannot establish integrated registry/catalog behavior, source ownership, or foreign revision availability. This remains an integrated-only blocker, not a local ticket blocker under the approved dependency class.
- **Minimum correction required:** At the owning DOM/REPO integrated boundary, add producer-owned receipt issuance/adapter registration consistent with the contract, then execute direct productive positive and negative consumer witnesses. Do not promote fixtures or reclassify the dependency locally.
- **Systemic pattern = YES**
- **Related locations:** `src/application/exec-registry-ports.ts:43-139`; `src/application/exec-registry.ts:76-141`; campaign `RCC-EXEC-REGISTRY-INTEGRATED-CONSUMPTION`.
- **Capability:** `DOM-EXEC-IDENTITY-SNAPSHOT`; `REPO-EXEC-NORMAL-CATALOG`.
- **Dependency class:** `REQUIRED_FOR_INTEGRATED_PROOF`.
- **Local-acceptance dependency:** `LOCAL_ACCEPTANCE_REQUIRES_PRODUCTIVE_CAPABILITY=NO`.
- **Evidence timing:** Integrated checkpoint, not local closure.
- **LOCAL_CLOSURE_BLOCKING:** NO
- **DEPENDENCY_CLASS_RECLASSIFICATION_REQUIRED:** NO
- **UPSTREAM_DEPENDENCY_CLASSIFICATION_PRESERVED:** YES
- **Suggested canonical effects:** `BLOCKS_LOCAL_EXECUTION=NO`; `BLOCKS_LOCAL_CLOSURE=NO`; `BLOCKS_TICKET_DONE=NO`; `BLOCKS_INTEGRATED_PROOF=YES`; `BLOCKS_SPEC_FINAL_CONFORMANCE=YES`; `PRIMARY_ROUTE=IMPLEMENTATION_PLAN_REVALIDATION`; `DOWNSTREAM_CHECKPOINT=productive DOM/REPO integrated registry proof`; `DOWNSTREAM_OWNER=DOM-001 and REPO-001/owning integrated checkpoint`.

### BEH-MAJOR-003 — Bootstrap “before work” behavior is covered only by a proxy

- **Severity:** MAJOR
- **Ticket:** `EXEC-001-TICKET-002`
- **Requirement / acceptance references:** `EXEC-REGISTRY-003`; `AC-EXEC-010`.
- **Category:** `ACCEPTANCE_WITNESS_GAP`
- **Required behavior:** A normal capability requested in BOOTSTRAP must return `INCOMPATIBLE_CAPABILITY` before enablement or normal work, with no mutation or approval.
- **Production evidence:** `src/domain/exec-registry.ts:549-553` performs the allowlist check before returning `RESOLVED`; the unit has no enablement/work callback or effect boundary. `src/application/exec-registry.ts:76-99` rejects local fixture sources before any read, so its positive source-backed path is not exercised locally.
- **Test evidence:** `tests/exec-001-ticket-002.test.ts:271-293` asserts the failure code and flags, but `:285` only checks that the object lacks a property named `resolveBeforeWork`; it does not execute a work callback, assert callback non-invocation, or observe an effect boundary.
- **Observed result:** The canonical rejection result is directly asserted; ordering relative to work is not observed.
- **Expected result:** A direct test invokes the operation with an observable work/enablement spy or owner-backed integration boundary and asserts it was not called before/after rejection.
- **Problem:** The normative “before work” verb has no corresponding operation/effect witness in the local test; the test's property-absence assertion is non-assertive for ordering.
- **Impact:** A future caller could change ordering without this ticket test detecting it. This is a required acceptance witness gap even though current resolver code has no work effect.
- **Minimum correction required:** Provide a direct owner-bound work/enablement seam at the appropriate integrated boundary or explicitly operationalize the local negative callback witness; assert no callback/effect and preserve no-mutation/no-approval on rejection.
- **Systemic pattern = NO**
- **Related locations:** `src/domain/exec-registry.ts:549-553`; `src/application/exec-registry.ts:76-99`; `tests/exec-001-ticket-002.test.ts:271-293`.
- **Capability:** `UNIT-EXEC-REGISTRY-FIXTURE` locally; bootstrap execution boundary integrated later.
- **Dependency class:** `INFORMATIONAL` locally; integrated work owner downstream.
- **Local-acceptance dependency:** `LOCAL_ACCEPTANCE_REQUIRES_PRODUCTIVE_CAPABILITY=NO`.
- **Evidence timing:** Local acceptance for result; integrated checkpoint for before-work ordering.
- **LOCAL_CLOSURE_BLOCKING:** YES
- **DEPENDENCY_CLASS_RECLASSIFICATION_REQUIRED:** NO
- **UPSTREAM_DEPENDENCY_CLASSIFICATION_PRESERVED:** YES
- **Suggested canonical effects:** `BLOCKS_LOCAL_EXECUTION=YES`; `BLOCKS_LOCAL_CLOSURE=YES`; `BLOCKS_TICKET_DONE=YES`; `BLOCKS_INTEGRATED_PROOF=YES`; `BLOCKS_SPEC_FINAL_CONFORMANCE=YES`; `PRIMARY_ROUTE=IMPLEMENTATION_REMEDIATION`; `DOWNSTREAM_CHECKPOINT=bootstrap work-order integration`.

### BEH-MAJOR-004 — Required architecture guard is only source-text inspection

- **Severity:** MAJOR
- **Ticket:** `EXEC-001-TICKET-002`
- **Requirement / acceptance references:** implementation design §20 architecture/conformance guard; `EXEC-REGISTRY-001/002`; `AC-EXEC-008`, `AC-EXEC-009`, `AC-EXEC-012`.
- **Category:** `ARCHITECTURE_GUARD_GAP`
- **Required behavior:** The productive registry graph must be prevented from importing infrastructure, prototype, transport or generic bucket dependencies, and the common path must remain the executable owner.
- **Production evidence:** The implementation imports no forbidden module in the current snapshot, but there is no compiler/linter/module-boundary enforcement. `tests/exec-001-ticket-002.test.ts:494-512` reads source files and applies regexes.
- **Test evidence:** The focused architecture checks pass, but they are source-text assertions. The second guard imports the graph and exercises a fixture rejection; neither directly enforces the boundary against future module changes.
- **Observed result:** Current source is clean; an architecture guard capable of enforcing the invariant is absent.
- **Expected result:** A direct architecture/conformance guard rejects forbidden dependency introduction independently of a descriptive source scan.
- **Problem:** The accepted design calls for an import guard, while the implemented evidence is a proxy source scan. Source inspection alone is not a direct architecture guard under this audit contract.
- **Impact:** Dependency-direction regressions can be introduced without a production-enforced boundary; current green tests do not prove the architecture invariant.
- **Minimum correction required:** Add an executable module/import boundary guard (or equivalent compiler/linter enforcement) and a negative witness that fails when a forbidden dependency is introduced; retain the current static scan as supplementary evidence only.
- **Systemic pattern = NO**
- **Related locations:** `tests/exec-001-ticket-002.test.ts:494-544`; `src/domain/exec-registry.ts`; `src/application/exec-registry.ts`; `src/application/exec-registry-ports.ts`; `src/composition/exec-registry.ts`.
- **Capability:** `UNIT-EXEC-REGISTRY-FIXTURE` / architecture guard.
- **Dependency class:** `INFORMATIONAL`.
- **Local-acceptance dependency:** `LOCAL_ACCEPTANCE_REQUIRES_PRODUCTIVE_CAPABILITY=NO`.
- **Evidence timing:** Local closure.
- **LOCAL_CLOSURE_BLOCKING:** YES
- **DEPENDENCY_CLASS_RECLASSIFICATION_REQUIRED:** NO
- **UPSTREAM_DEPENDENCY_CLASSIFICATION_PRESERVED:** YES
- **Suggested canonical effects:** `BLOCKS_LOCAL_EXECUTION=YES`; `BLOCKS_LOCAL_CLOSURE=YES`; `BLOCKS_TICKET_DONE=YES`; `BLOCKS_INTEGRATED_PROOF=YES`; `BLOCKS_SPEC_FINAL_CONFORMANCE=YES`; `PRIMARY_ROUTE=IMPLEMENTATION_REMEDIATION`.

### BEH-MAJOR-005 — Physical concurrency contract remains unproven at the integrated boundary

- **Severity:** MAJOR
- **Ticket:** `EXEC-001-TICKET-002`
- **Requirement / acceptance references:** `EXEC-REGISTRY-001`, `EXEC-REGISTRY-002`; design §14/§20 concurrency declaration; AC-EXEC-008, AC-EXEC-009, AC-EXEC-012.
- **Category:** `CONCURRENCY_SEMANTICS_GAP`
- **Required behavior:** Concurrent equivalent registration must preserve uniqueness/one-winner semantics and no lost update at the productive persistence/source boundary.
- **Production evidence:** `src/domain/exec-registry.ts:436-443` performs an immutable in-memory duplicate check and returns a new basis. There is no physical transaction, CAS or durable producer in this ticket.
- **Test evidence:** `tests/exec-001-ticket-002.test.ts:237-244` tests sequential duplicate/conflict rejection only. The design explicitly marks physical CAS and concurrent winning integrated-only; no concurrent test ran.
- **Observed result:** Local sequential idempotency passes; physical concurrency and one-winner behavior are unproven.
- **Expected result:** The integrated persistence/source checkpoint supplies a direct concurrent registration witness with observable no-duplicate/one-winner and no-mutation semantics.
- **Problem:** A sequential duplicate test is not evidence of a concurrent contract, and no productive producer exists at the pinned target.
- **Impact:** Concurrent catalog publication could lose updates or create duplicate authority unless the later physical boundary proves atomicity. This finding is integrated-only under the approved dependency class.
- **Minimum correction required:** At PLAT/registry integrated proof, exercise concurrent equivalent/conflicting registrations against the productive source and prove physical CAS/atomicity; preserve immutable local semantics.
- **Systemic pattern = NO**
- **Related locations:** `src/domain/exec-registry.ts:436-443`; `tests/exec-001-ticket-002.test.ts:237-244`; design §14 and §20.
- **Capability:** physical catalog persistence/CAS capability.
- **Dependency class:** `REQUIRED_FOR_INTEGRATED_PROOF`.
- **Local-acceptance dependency:** `LOCAL_ACCEPTANCE_REQUIRES_PRODUCTIVE_CAPABILITY=NO`.
- **Evidence timing:** Integrated checkpoint.
- **LOCAL_CLOSURE_BLOCKING:** NO
- **DEPENDENCY_CLASS_RECLASSIFICATION_REQUIRED:** NO
- **UPSTREAM_DEPENDENCY_CLASSIFICATION_PRESERVED:** YES
- **Suggested canonical effects:** `BLOCKS_LOCAL_EXECUTION=NO`; `BLOCKS_LOCAL_CLOSURE=NO`; `BLOCKS_TICKET_DONE=NO`; `BLOCKS_INTEGRATED_PROOF=YES`; `BLOCKS_SPEC_FINAL_CONFORMANCE=YES`; `PRIMARY_ROUTE=IMPLEMENTATION_PLAN_REVALIDATION`; `DOWNSTREAM_CHECKPOINT=productive registry persistence/CAS proof`; `DOWNSTREAM_OWNER=PLAT/registry integrated owner`.

### BEH-MINOR-001 — Registration can overflow a validated catalog revision

- **Severity:** MINOR
- **Ticket:** `EXEC-001-TICKET-002`
- **Requirement / acceptance references:** `EXEC-REGISTRY-001`, `EXEC-REGISTRY-002`; AC-EXEC-008, AC-EXEC-009.
- **Category:** `PERSISTENCE_SEMANTICS_GAP`
- **Required behavior:** Every published catalog basis must retain a safe positive catalog revision and preserve revision identity.
- **Production evidence:** `CatalogBasis.createFixture` validates safe positive integers at `src/domain/exec-registry.ts:427`, but `register` at `:442` blindly computes `this.catalogRevision + 1`.
- **Test evidence:** No boundary-value revision test exists. Independent witness: a basis at `Number.MAX_SAFE_INTEGER` registers an entry and produces `9007199254740992`, for which `Number.isSafeInteger` is false.
- **Observed result:** An invalid unsafe revision is published rather than failing closed.
- **Expected result:** Overflow is rejected with `CONTRACT_INVALID` and the previous basis remains unchanged.
- **Problem:** Revision validation is applied at creation but not at the state transition that publishes a new basis.
- **Impact:** A rare boundary can corrupt exact revision transport and later stale/continuity comparisons.
- **Minimum correction required:** Guard the increment against `Number.MAX_SAFE_INTEGER` (or use an exact revision representation) and add boundary/no-mutation tests.
- **Systemic pattern = NO**
- **Related locations:** `src/domain/exec-registry.ts:403-443`; `tests/exec-001-ticket-002.test.ts:237-244`.
- **Capability:** `UNIT-EXEC-REGISTRY-FIXTURE` / catalog revision.
- **Dependency class:** `INFORMATIONAL`.
- **Local-acceptance dependency:** `LOCAL_ACCEPTANCE_REQUIRES_PRODUCTIVE_CAPABILITY=NO`.
- **Evidence timing:** Local closure.
- **LOCAL_CLOSURE_BLOCKING:** YES
- **DEPENDENCY_CLASS_RECLASSIFICATION_REQUIRED:** NO
- **UPSTREAM_DEPENDENCY_CLASSIFICATION_PRESERVED:** YES
- **Suggested canonical effects:** `BLOCKS_LOCAL_EXECUTION=YES`; `BLOCKS_LOCAL_CLOSURE=YES`; `BLOCKS_TICKET_DONE=YES`; `BLOCKS_INTEGRATED_PROOF=YES`; `BLOCKS_SPEC_FINAL_CONFORMANCE=YES`; `PRIMARY_ROUTE=IMPLEMENTATION_REMEDIATION`.

### BEH-MINOR-002 — Persisted completion evidence reports stale test counts

- **Severity:** MINOR
- **Ticket:** `EXEC-001-TICKET-002`
- **Requirement / acceptance references:** ticket §19/§20 completion evidence; AC-EXEC-003, AC-EXEC-008, AC-EXEC-009, AC-EXEC-010, AC-EXEC-011, AC-EXEC-012.
- **Category:** `EVIDENCE_INTEGRITY_GAP`
- **Required behavior:** Completion evidence must record the command and output actually executed against the pinned target.
- **Production evidence:** No production semantic defect is required for this finding. The pinned `tests/exec-001-ticket-002.test.ts` contains 20 cases and the direct command ran 20/20.
- **Test evidence:** Each of the six primary TICKET-002 evidence files under `docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/` records `EXECUTED_OUTPUT = 16 tests, 16 passed`; the ticket execution record reports `TESTS_RUN=31`, `FOCUSED_TICKET_TESTS=10/10`. Independent runs at the pinned target report 20 focused, 21 TICKET-001, and 68 package cases.
- **Observed result:** The semantic tests are green, but the persisted evidence snapshot does not accurately identify its executed test count.
- **Expected result:** Evidence files and ticket execution fields must match the pinned command's output and distinguish focused from complete package counts.
- **Problem:** Stale counts weaken the audit trail and make the completion record non-reproducible as written.
- **Impact:** Reviewers can misjudge coverage and cannot rely on the recorded execution output without rerunning it.
- **Minimum correction required:** Regenerate the six evidence files and ticket execution record from the pinned target, recording 20 focused and 68 package cases (or the exact command-specific output) with no semantic claims beyond the executed assertions.
- **Systemic pattern = NO**
- **Related locations:** `docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/AC-EXEC-003-semver.md` and corresponding AC-EXEC-005/007/008/009/010/011/012 files; ticket §27.
- **Capability:** local completion evidence.
- **Dependency class:** `INFORMATIONAL`.
- **Local-acceptance dependency:** `LOCAL_ACCEPTANCE_REQUIRES_PRODUCTIVE_CAPABILITY=NO`.
- **Evidence timing:** Local closure evidence snapshot.
- **LOCAL_CLOSURE_BLOCKING:** YES
- **DEPENDENCY_CLASS_RECLASSIFICATION_REQUIRED:** NO
- **UPSTREAM_DEPENDENCY_CLASSIFICATION_PRESERVED:** YES
- **Suggested canonical effects:** `BLOCKS_LOCAL_EXECUTION=NO`; `BLOCKS_LOCAL_CLOSURE=YES`; `BLOCKS_TICKET_DONE=YES`; `BLOCKS_INTEGRATED_PROOF=NO`; `BLOCKS_SPEC_FINAL_CONFORMANCE=NO`; `PRIMARY_ROUTE=IMPLEMENTATION_REMEDIATION`.

## Summary

Audit: `.pi/runtime/workflow-audits/dac96179-dd62-47f9-8c9d-901fc1dd3e76/behavior-EXEC-001-TICKET-002-implementation-behavior-audit.md`

Specialist:
IMPLEMENTATION_BEHAVIOR

Ticket: EXEC-001-TICKET-002

Required behavioral dimensions: 7

Required tests: 11

Required tests missing: 4

Required behaviors total: 9

Direct behavior witnesses: 8

Proxy-only behaviors: 1

Untested state transitions: 1

Unproven concurrency contracts: 1

Missing architecture guards: 1

Tests run: 68

Tests passed: 68

Tests failed: 0

Regressions: 0

Concurrency:
NON_CONFORMANT

Stale behavior:
CONFORMANT

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
MAJOR=5
MINOR=2
INFO=0

Domain audit complete:
YES

Specialist result:
SPECIALIST_BEHAVIOR_FINDINGS

AUDIT_TARGET_HEAD: cc3fe3210eaebf8e0f577f7f5e1e48b97ed175bb
AUDIT_TARGET_STATE_FINGERPRINT: d9da64d8a9ae6a490737bc93789929e656559d2463d06916d4704439d2d20c22
AUDIT_WAVE_ID: dac96179-dd62-47f9-8c9d-901fc1dd3e76
DOMAIN_AUDIT_COMPLETE: YES
SPECIALIST_RESULT: SPECIALIST_BEHAVIOR_FINDINGS