# Implementation Behavior Audit — EXEC-001-TICKET-002

Audit: `.pi/runtime/workflow-audits/cf3f4999-1f37-481b-a706-8ccc94dc7358/behavior-EXEC-001-TICKET-002-implementation-behavior-audit.md`

Specialist:
IMPLEMENTATION_BEHAVIOR

## 1. Audit basis and required inputs

| Field | Observed value |
|---|---|
| TICKET_ID | `EXEC-001-TICKET-002` |
| TICKET_PATH | `docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-version-registry-catalogs-capabilities.md` |
| IMPLEMENTATION_UNIT | `EXEC-IMP-02 — Version, registry resolution, catalogs and capability extensibility` |
| REQUIREMENT_IDS | `EXEC-VERSION-001/002`, `EXEC-REGISTRY-001/002/003`, `EXEC-CAPABILITY-001/002` |
| ACCEPTANCE_IDS | `AC-EXEC-003`, `AC-EXEC-004`, `AC-EXEC-008`, `AC-EXEC-009`, `AC-EXEC-010`, `AC-EXEC-011`, `AC-EXEC-012`; local contributions to `AC-EXEC-005` and `AC-EXEC-007` |
| ADR / authority chain | `docs/adrs/ADR-0003-versioned-skill-contracts.md` revision 3; portfolio O-017/O-020 |
| SPEC_PATH | `docs/specs/SPEC-EXEC-001-skill-contracts-and-capability-registry.md` |
| GAP_MATRIX_PATH | `docs/specs/gap-matrices/SPEC-EXEC-001-implementation-gap-matrix.md` |
| IMPLEMENTATION_PLAN_PATH | `docs/specs/implementation-plans/SPEC-EXEC-001-implementation-plan.md` |
| TICKET_SET_AUDIT | `docs/tickets/SPEC-EXEC-001/implementation-ticket-audit.md` |
| IMPLEMENTATION_BASELINE | `d4216ad6f4a87fe7142ccd45d3fd099ef1b92955` |
| CURRENT_HEAD | `8b6fe86b0f6370094e630b7272c98a490518cfac` |
| AUDIT_TARGET_HEAD | `8b6fe86b0f6370094e630b7272c98a490518cfac` |
| AUDIT_TARGET_STATE_FINGERPRINT | `b61bd4448910d5260c149cc29396e6b67eb3b1f623b7d81b15e9f9802baf0bab` |
| AUDIT_WAVE_ID | `cf3f4999-1f37-481b-a706-8ccc94dc7358` |
| CHANGED_PRODUCTION_FILES | `src/domain/exec-registry.ts`; `src/application/exec-registry.ts`; `src/application/exec-registry-ports.ts`; `src/composition/exec-registry.ts`; shared `src/domain/exec-contract.ts` authentication export |
| CHANGED_TEST_FILES | `tests/exec-001-ticket-002.test.ts` |
| Changed evidence files | Eight files under `docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/` |
| RELEVANT_TEST_SUITES | Ticket-specific registry tests; TICKET-001 regression; `.pi` root regression; typecheck; governance/skill guards; direct DOM cross-spec test attempt |

The target commit and current `HEAD` match. The working tree has documentary and
workflow-tool overlays, but no production or test overlay relative to the pinned
implementation target. No sibling specialist audit artifact was used.

The authority chain reconstructs as follows: ADR-0003 defines semantic version,
explicit registry and independent bootstrap behavior; SPEC-EXEC-001 owns
requirements and canonical outcomes; GAP-004/006/008/009/010/011 identify the
missing behavior; Plan unit EXEC-IMP-02 allocates local fixtures and direct
witnesses; the ticket and approved design preserve that scope; repository code
and independently executed tests are the behavioral evidence.

## 2. Reconstructed behavioral contract

1. Parse and expose Semantic Version major/minor/patch meaning and resolve only
   explicit supported versions; do not approximate, alias, or silently convert.
2. Resolve a complete registry entry deterministically from a frozen catalog
   basis, preserving stage, capability, schemas, artifacts, verdicts, roles and
   version.
3. Keep NORMAL repository scope and BOOTSTRAP system scope independent; verify
   producer-issued source, scope and requested catalog revision.
4. Reject a normal capability in BOOTSTRAP with `INCOMPATIBLE_CAPABILITY` before
   work; allow only the five bootstrap categories.
5. Preserve `UNKNOWN_CAPABILITY` versus `INCOMPATIBLE_CAPABILITY` and fail closed
   with no approval/no mutation.
6. Register schema-authenticated synthetic capabilities through the same path and
   publish a new immutable basis without changing an old basis.
7. Consume authority-bearing source material only through authenticated receipts;
   callers cannot inject a basis, schema, support set, source, repository or
   resolution authority.
8. Invalid application resolution input must produce a structured
   `CONTRACT_INVALID` result rather than an uncaught exception.
9. Integrated DOM/REPO productive availability is not supplied by this ticket;
   local fixtures prove only contract-level behavior and do not promote productive
   availability.

### Behavioral applicability matrix

| Dimension | Classification | Evidence / reason |
|---|---|---|
| `UNIT_BEHAVIOR` | REQUIRED | Domain semver, support-set, entry, basis and outcome rules are owned here. |
| `INTEGRATION_BEHAVIOR` | AFFECTED | DOM execution-basis and REPO NORMAL source seams are implemented; productive producers are integrated-only. |
| `PERSISTENCE` | NOT_APPLICABLE | This ticket explicitly uses immutable in-process bases; physical persistence/reconstruction belongs to TICKET-003/PLAT. |
| `CONCURRENCY` | AFFECTED | Local create-only publication is immutable; physical CAS/one-winner behavior is an integrated producer obligation. |
| `STALE_STATE` | REQUIRED | Requested catalog revision and source basis revision are checked; stale/detached material must fail closed. |
| `IDEMPOTENCY` | REQUIRED | Duplicate/conflicting registration must reject without changing the prior basis. |
| `DURABILITY` | NOT_APPLICABLE | No durable write or completion claim is made by this ticket. |
| `RECOVERY` | NOT_APPLICABLE | Restart, replay and physical recovery are outside the immutable local scope. |
| `COMPATIBILITY` | REQUIRED | Semver component meaning and exact supported-set behavior are acceptance obligations. |
| `MIGRATION_BEHAVIOR` | NOT_APPLICABLE | `MIGRATION` is only a bootstrap category here; migration execution/state transition is not implemented. |
| `NEGATIVE_PATHS` | REQUIRED | Unsupported, unknown, duplicate, wrong-scope, forged, stale and bootstrap-incompatible inputs are normative. |

## 3. Production behavior classification

| Behavior | Classification | Production evidence and observed semantics |
|---|---|---|
| Semantic version parsing/comparison | `IMPLEMENTED_CORRECTLY` | `src/domain/exec-registry.ts:92-167` preserves decimal components without unsafe numeric coercion, compares prerelease values, and classifies major/minor/patch changes. |
| Explicit supported versions | `IMPLEMENTED_CORRECTLY` | `:169-207`, `:323-352`, and `:486-494` authenticate `SupportedVersionSet` and use exact membership only. |
| Complete deterministic mapping | `IMPLEMENTED_CORRECTLY` | `:279-391` validates complete entries; `:505-556` filters by capability, stage, schema and requested version, with deterministic ordering and canonical outcomes. |
| Immutable basis and duplicate/conflict rejection | `IMPLEMENTED_CORRECTLY` | `:401-440` freezes scope, entries and basis values; existing immutable identity rejects registration without publishing a replacement. |
| NORMAL/BOOTSTRAP isolation | `IMPLEMENTED_CORRECTLY` locally; integrated availability remains open | `src/application/exec-registry.ts:73-148` selects source by scope and checks authenticated receipt, exact scope, revision and source kind. |
| Bootstrap allowlist and fail-before-work | `IMPLEMENTED_CORRECTLY` locally | `src/domain/exec-registry.ts:498-503,539-545` enforces the allowlist; `src/application/exec-registry.ts:67-70` invokes work only after a resolved result. |
| Unknown/incompatible distinction | `IMPLEMENTED_CORRECTLY` | `:517-538` returns `UNKNOWN_CAPABILITY` only for absent identity and `INCOMPATIBLE_CAPABILITY` for known stage/schema/version/role mismatch. |
| Registry-only extensibility | `IMPLEMENTED_CORRECTLY` locally | `CatalogBasis.register` and `RegisterExecCapability` use the same entry/basis path for synthetic entries; old bases are frozen. |
| Source receipt provenance | `IMPLEMENTED_CORRECTLY` for source receipts | `src/application/exec-registry-ports.ts:43-126` uses module-private issuer/receipt ledgers; matching shapes, copied receipts, wrong source kinds and untrusted material are rejected. |
| Authority-bearing resolution-result consumption | `UNSAFE_FAILURE_BEHAVIOR` | `ResolveExecCapability` accepts an injectable resolver (`src/application/exec-registry.ts:39-48`) and `resolveBeforeWork` trusts only `result.status` (`:67-70`). It does not authenticate the result or bind it back to the request before invoking work. See BEH-CRITICAL-001. |
| Invalid application input failure mapping | `UNSAFE_FAILURE_BEHAVIOR` | `resolve` catches selection errors but calls `failureBasis(input)`; `failureBasis` dereferences `input.scope` at `src/application/exec-registry.ts:151-153`. `null` and `undefined` therefore escape as `TypeError` instead of structured `CONTRACT_INVALID`. See BEH-MAJOR-001. |
| Physical productive authority | `PARTIAL` by planned scope | Only abstract source ports and explicitly local fixture issuers exist. DOM/REPO productive producers are not present at the target; local fixtures are not productive evidence. See BEH-MAJOR-002. |

## 4. Acceptance witness audit

The approved design/ticket witness matrix has nine rows (the seven owned
acceptance behaviors plus the two local contribution rows). All nine have direct
local positive and negative/isolation tests. Two additional shared-contract
behaviors—result provenance before work and malformed application-input failure—
are not operationalized by the implementation tests.

| Witness row | Direct production operation | Positive witness | Negative/isolation witness | Executable at local closure | Result |
|---|---|---|---|---|---|
| Semver (`AC-EXEC-003`) | `SemanticVersion.parse` / `classifySemanticVersionChange` | `tests/exec-001-ticket-002.test.ts:124-144` | unsupported/large/invalid-set cases at `:146-157` | YES | Direct, strong |
| Explicit support (`AC-EXEC-004`) | `SupportedVersionSet` and resolver | `:146-157,198-234` | unsupported version and no alias/approximation | YES | Direct, strong |
| Deterministic mapping (`AC-EXEC-008`) | `CatalogBasis.register` / `RegistryResolutionService.resolve` | `:172-196,198-234` | duplicate/conflict and unsupported mapping `:219-242` | YES | Direct, strong |
| Catalog isolation (`AC-EXEC-009`) | source-selected NORMAL/BOOTSTRAP basis | `:245-268` | cross-repository/source substitution and forged receipts `:363-407` | YES for contract level | Direct, strong |
| Bootstrap allowlist (`AC-EXEC-010`) | `resolveBeforeWork` | `:270-300` allowlisted DISCOVERY | NORMAL category rejected and callback count remains zero | YES | Direct, strong |
| Outcome distinction (`AC-EXEC-011`) | resolver failure classification | `:302-318` known entry resolves in adjacent tests | unknown/version/schema results asserted distinct | YES | Direct, strong |
| Common extensibility (`AC-EXEC-012`) | `RegisterExecCapability.register` then resolve | `:320-339` | forged entry/basis and untrusted source `:428-467` | YES | Direct, strong |
| Frozen-basis contribution (`AC-EXEC-005`) | new-basis publication | `:172-196,236-243,320-339` | old basis identity/entries unchanged | YES as local contribution | Direct, strong |
| Failure classification contribution (`AC-EXEC-007`) | canonical result codes | `:198-234,302-318` | no approval/no mutation and source failures `:445-467` | YES as local contribution | Direct, strong |
| Result provenance before work | consumer validation of resolution receipt/result | no direct test | no forged/injected resolver-result witness | NO | Missing direct witness; blocking local finding |
| Invalid application input | `ResolveExecCapability.resolve(null/undefined)` | no direct test | audit execution throws `TypeError` | NO | Missing direct witness; blocking local finding |

```text
ACCEPTANCE_WITNESS_MATRIX = COMPLETE_FOR_APPROVED_9_ROWS
REQUIRED_BEHAVIORS_TOTAL = 11
DIRECT_BEHAVIOR_WITNESSES = 9
PROXY_ONLY_BEHAVIORS = 0
UNTESTED_STATE_TRANSITIONS = 2
UNPROVEN_CONCURRENCY_CONTRACTS = 0_LOCAL; INTEGRATED_CAS_OUTSIDE_TICKET
MISSING_ARCHITECTURE_GUARDS = 0
```

The independent import-graph traversal reached seven registry/domain files and
found no forbidden infrastructure, transport, prototype or external-effect
imports. This supplements the repository's direct-file architecture assertions;
the architecture guard itself is therefore witnessed, while the missing result
provenance witness remains a separate consumer-boundary defect.

## 5. Test inventory and assertion quality

| Category | Classification | Evidence |
|---|---|---|
| `UNIT` | `REQUIRED_TEST_PRESENT` | 17 direct ticket tests; domain value and application seam behavior asserted. |
| `INVARIANT` | `REQUIRED_TEST_PRESENT` | Complete entry, identity uniqueness, frozen basis and no-mutation assertions. |
| `PERSISTENCE` | `TEST_CATEGORY_NOT_APPLICABLE` | No physical persistence in this ticket. |
| `INTEGRATION` | `REQUIRED_TEST_PRESENT` at contract level | DOM/REPO consumer-shaped fixture seams are exercised; productive integrated execution is not available. |
| `CROSS_SPEC` | `REQUIRED_TEST_PRESENT` at local contract level | NORMAL/BOOTSTRAP and source-boundary isolation are exercised; foreign productive producers remain pending. |
| `CONCURRENCY` | `TEST_CATEGORY_NOT_APPLICABLE` locally | No mutable local shared state; physical CAS/one-winner proof is explicitly integrated-only. |
| `STALE` | `REQUIRED_TEST_PRESENT` | Receipt revision mismatch is tested; an independent normal-scope stale probe also returned `CONTRACT_INVALID` with no mutation. |
| `IDEMPOTENCY` | `REQUIRED_TEST_PRESENT` | Duplicate/conflicting registration preserves prior basis. |
| `RECOVERY` | `TEST_CATEGORY_NOT_APPLICABLE` | Restart/replay belongs to TICKET-003/PLAT. |
| `COMPATIBILITY` | `REQUIRED_TEST_PRESENT` | Semver and exact supported-set assertions. |
| `MIGRATION` | `TEST_CATEGORY_NOT_APPLICABLE` | No migration operation is owned here. |
| `NEGATIVE_PATH` | `REQUIRED_TEST_PRESENT`, incomplete | Forgery, stale, duplicate, unknown and incompatibility paths pass; null/undefined application input and injected resolver result are untested and fail under independent probes. |
| `ARCHITECTURE_GUARD` | `REQUIRED_TEST_PRESENT` | Direct guard plus independent transitive graph traversal and real-module import/common-path execution. |
| `CONFORMANCE` | `REQUIRED_TEST_PRESENT` | Full configured suite, typecheck and repository governance/skill guards pass. |

```text
REQUIRED_TESTS_TOTAL = 10
REQUIRED_TESTS_MISSING = 2 direct contract witnesses (categories present)
```

Assertion quality for the covered ticket behaviors is `STRONG`: tests assert
semantic result codes, complete returned fields, basis identity, no-approval,
no-mutation, callback count, and source provenance rather than merely absence of
exceptions. Fixture evidence is used only for local contract semantics and does
not prove durable persistence or productive DOM/REPO availability. The two
uncovered behaviors are not closed by the green suite.

## 6. Independent test execution

Primary execution and regression record:

| Command | Result |
|---|---|
| `node --experimental-strip-types --test tests/exec-001-ticket-002.test.ts` | 17 passed, 0 failed, 0 skipped |
| `node --experimental-strip-types --test tests/exec-001-ticket-001.test.ts` | 21 passed, 0 failed, 0 skipped |
| `node --experimental-strip-types --test .pi/extensions/workflow-orchestrator/test/*.test.ts` | 27 passed, 0 failed, 0 skipped |
| `npm test` | 65 passed, 0 failed, 0 skipped |
| `npm run typecheck` | PASS |
| `npm run verify:audit-governance` | PASS |
| `npm run verify:skill-mirror` | PASS |
| `node --experimental-strip-types --test tests/dom-001-ticket-002.test.ts` | Environmental failure before test collection: Node strip-only mode does not support a TypeScript parameter property (`ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX`); not an implementation failure |
| Audit probe: `ResolveExecCapability.resolve(null)` and `.resolve(undefined)` | Uncaught `TypeError` for both inputs |
| Audit probe: injected resolver returns forged `RESOLVED` result | `resolveBeforeWork` invoked work (`work=1`) for a mismatched request |
| Audit probe: stale NORMAL source revision | Structured `FAILED/CONTRACT_INVALID`, no resolution, no mutation |

```text
TESTS_RUN = 65 unique configured cases
TESTS_PASSED = 65
TESTS_FAILED = 0 in configured suites
TESTS_SKIPPED = 0
ENVIRONMENTAL_FAILURES = 1 additional direct DOM-suite attempt
IMPLEMENTATION_FAILURES = 0 in configured suites; 2 audit probes exposed behavior defects
PREEXISTING_REGRESSIONS = 0
CROSS_SPEC_FAILURES = 0; productive foreign producer was unavailable, not falsely promoted
```

The direct DOM test attempt is classified `ENVIRONMENTAL_FAILURE`, not a
production regression, because Node's strip-only TypeScript loader rejects syntax
before importing the tested implementation. It was not part of `npm test`.

## 7. Regression safety

`NO_REGRESSION` is supported for the affected executable baseline. The complete
configured suite passes, including all 21 TICKET-001 tests and all 27 workflow
root tests. The shared `exec-contract.ts` change is a narrow authenticated schema
reference export and the affected contract tests pass. No regression count was
discovered.

```text
REGRESSION_RESULT = NO_REGRESSION
REGRESSIONS = 0
```

## 8. Conditional runtime dimensions

### Concurrency

`NOT_APPLICABLE` for local productive behavior: basis registration is synchronous,
create-only and immutable, and no physical repository/CAS is implemented. The
local duplicate/no-mutation invariant is directly tested. Physical concurrent
one-winner behavior remains an integrated producer/TICKET-003 concern and is not
silently promoted by the fixtures.

### Stale state

`CONFORMANT` for the implemented local contract. Requested revision is checked
against each authenticated source receipt; wrong scope, wrong source, copied
receipt and stale revision fail closed. Both bootstrap and an independently
executed NORMAL stale probe preserved no-mutation behavior.

### Idempotency

`CONFORMANT` for local immutable registration/resolution. Duplicate and conflicting
keys reject; repeated resolution is read-only; a successful registration returns a
new basis and leaves the prior basis unchanged. Physical durable idempotency is
outside this ticket.

### Durability and persistence

`NOT_APPLICABLE`: no durable identity, physical CAS, serialization or restart
claim is made by this ticket.

### Recovery

`NOT_APPLICABLE`: interrupted operations, replay and restart reconstruction belong
to later implementation units.

### Compatibility and migration

Semver compatibility is conformant for exact explicit sets. Migration execution is
not applicable; the bootstrap migration label is only an allowlist category.

### Authority consumption and provenance

The following handoff records were independently reconciled:

| Capability | Authority / producer | Consumer and contract | Authority / contract | Local testability / productive availability | Dependency class |
|---|---|---|---|---|---|
| `DOM-EXEC-IDENTITY-SNAPSHOT` | `SPEC-DOM-001` / canonical DOM resolver, no productive producer at target | T002 `ExecutionCatalogBasisReader`; canonical repository/snapshot basis and revision | `DEFINED / DEFINED` | `NO / NO` | `REQUIRED_FOR_INTEGRATED_PROOF` |
| `REPO-EXEC-NORMAL-CATALOG` | `SPEC-REPO-001` / enabled REPO configuration, no productive producer at target | T002 `NormalCatalogSource`; repository-scoped NORMAL catalog and revision | `DEFINED / DEFINED` | `NO / NO` | `REQUIRED_FOR_INTEGRATED_PROOF` |
| `UNIT-EXEC-REGISTRY-FIXTURE` | EXEC test support fixture | Local registry tests only; immutable contract semantics | `DEFINED / DEFINED` | `YES / NO` | `INFORMATIONAL` |

The resulting authority summary is `DEFINED_BUT_NOT_CONSUMABLE`: the two foreign
productive capabilities are contract-defined but no productive producer/runtime
is available. Fixture/mock evidence is not productive availability and is not
promoted. The source receipt itself has issuer, source-kind, scope and revision
checks. The resolution-result consumer does not have an equivalent authenticity
check; that gap is BEH-CRITICAL-001.

### Temporal authority

`NOT_APPLICABLE` to the local fixture operation because the selected basis is an
immutable frozen value and this ticket owns no productive external effect. Any
future mutable DOM/REPO source followed by an effect must supply an independent
second observation, semantic drift detection and fail-closed behavior at the
integrated effect boundary; no such future proof is claimed here.

### Caller-as-authority check

Caller scope, repository assertion, catalog revision, schema, source and support
set are not accepted as canonical authority on the normal source path; source
receipts bind the basis. However, the public resolver injection point allows a
caller-provided resolver to mint a success-shaped result that is trusted by
`resolveBeforeWork`. This is one caller-supplied authority bypass and is blocking
for local behavioral closure.

## 9. Findings

### BEH-CRITICAL-001 — Caller-injected resolver result can authorize work

- **Severity:** `CRITICAL`
- **Ticket:** `EXEC-001-TICKET-002`
- **Finding category:** `CALLER_SUPPLIED_AUTHORITY_BYPASS`
- **Requirements / acceptance:** `EXEC-CAPABILITY-001/002`, `EXEC-REGISTRY-003`; `AC-EXEC-010`, `AC-EXEC-011`, `AC-EXEC-012`; approved design §7 and §20 provenance obligations.
- **Required behavior:** The consumer must verify the issuer, scope, request binding and provenance of an authority-bearing resolution result. A forged or alternate resolver result must not authorize work.
- **Production evidence:** `src/application/exec-registry.ts:39-48` accepts any structurally compatible resolver; `:51-59` returns its result without verification; `:67-70` invokes the supplied work callback solely when `result.status === 'RESOLVED'`. Resolution results from `RegistryResolutionService` are plain frozen objects without a consumer-verifiable result brand.
- **Test evidence:** The 17 ticket tests authenticate source receipts, copied receipts, scopes, schemas and source kinds, but contain no forged/injected resolver-result negative witness or alternate resolver contract test. An independent runtime probe supplied a valid fixture source and a resolver whose `resolve` returned `{status:'RESOLVED', code:'RESOLVED', basis, entry, requestedVersion}` for a mismatched request; `resolveBeforeWork` returned `RESOLVED` and invoked the callback (`work=1`).
- **Observed result:** Caller-controlled resolver output is accepted as canonical success and can cross the before-work boundary.
- **Expected result:** The consumer rejects the injected/forged result with `CONTRACT_INVALID` or otherwise refuses work unless an authenticated producer-issued resolution is bound to the requested basis, scope, version, schema, capability and role.
- **Problem:** Source-receipt provenance is protected, but the next authority-bearing result boundary is not. Constructor injection is a public alternate authority path, and status-shape checking is not provenance verification.
- **Impact:** A caller or alternate adapter can authorize normal work, bypass the registry's compatibility and bootstrap rules, and violate the fundamental authority invariant. This is a critical caller-as-authority bypass even though the ordinary resolver path passes.
- **Minimum correction required:** Make the resolver authority non-substitutable at the productive boundary or authenticate and independently validate resolution results before returning/invoking work. Add direct positive and negative tests for an independently implemented adapter, forged result, caller-injected result, stale/mutated result and result/request binding.
- **Systemic pattern:** `YES`
- **Related locations:** `src/application/exec-registry.ts:39-70`; `src/domain/exec-registry.ts:505-556`; `tests/exec-001-ticket-002.test.ts:363-467` (source-only negative witnesses).
- **ROOT_CAUSE_CAMPAIGN_ID:** `RCC-EXEC-REGISTRY-RESULT-AUTHORITY-BOUNDARY`
- **CAPABILITY:** `UNIT-EXEC-REGISTRY-RESULT-AUTHORITY`
- **DEPENDENCY_CLASS:** `REQUIRED_FOR_LOCAL_CLOSURE`
- **LOCAL_CLOSURE_BLOCKING:** `YES`
- **LOCAL_ACCEPTANCE_REQUIRES_PRODUCTIVE_CAPABILITY:** `NO`
- **CLOSURE_OWNERSHIP:** `LOCAL_TICKET`
- **EVIDENCE_TIMING:** local closure; direct forged/caller-injection witness is executable now with fixture material.
- **DEPENDENCY_CLASS_RECLASSIFICATION_REQUIRED:** `NO`
- **UPSTREAM_DEPENDENCY_CLASSIFICATION_PRESERVED:** `YES`
- **BLOCKS_LOCAL_EXECUTION:** `YES`
- **BLOCKS_LOCAL_CLOSURE:** `YES`
- **BLOCKS_TICKET_DONE:** `YES`
- **BLOCKS_INTEGRATED_PROOF:** `YES`
- **BLOCKS_SPEC_FINAL_CONFORMANCE:** `YES`
- **PRIMARY_ROUTE:** `IMPLEMENTATION_REMEDIATION`
- **DOWNSTREAM_CHECKPOINT:** local ticket behavioral closure and subsequent integrated registry proof
- **DOWNSTREAM_OWNER:** EXEC-001 implementation/remediation owner; integrated consumer owner for final effect boundary

#### Root-cause surface matrix — RCC-EXEC-REGISTRY-RESULT-AUTHORITY-BOUNDARY

| Surface | Location | Current behavior | Expected behavior | Coverage / negative witness |
|---|---|---|---|---|
| ISSUER | `RegistryResolutionService.resolve` | Issues plain result object; no result provenance identity | Issue an authenticated result or provide independently verifiable binding | `MISSING`; `NW-RESULT-001` |
| REGISTRAR | `ResolveExecCapability` constructor | Registers caller-supplied resolver as trusted | Restrict issuer or verify result independently | `MISSING`; `NW-RESULT-001` |
| CONSUMER | `resolveBeforeWork` | Checks only status | Verify producer, request, basis and semantic result before work | `MISSING`; `NW-RESULT-001` |
| ALTERNATE_AUTHORITY_PATH | Structural resolver substitution | Alternate resolver can return success shape | Alternate adapter must satisfy the same authority contract | `MISSING`; `NW-RESULT-002` |
| INJECTION_POINT | Constructor `resolver` parameter | Caller can inject resolver implementation | Reject caller authority injection or authenticate output | `MISSING`; `NW-RESULT-001` |
| MUTATION_PATH | Result/basis handoff | Real result is frozen, but forged result can be newly constructed | Mutation/forgery/stale result must fail closed | `MISSING`; `NW-RESULT-003` |
| STALE_PATH | Result after basis/request drift | No result freshness/request-binding check | Reject stale/mismatched result | `MISSING`; `NW-RESULT-003` |
| PORT_SUBSTITUTION_PATH | `exec-registry-ports.ts:113-126` source receipt check | Source kind and receipt identity are protected | Preserve this check and apply equivalent result check | `COVERED`; existing receipt forgery tests |
| PUBLIC_EXPORT | Exported `ResolveExecCapability` and `RegistryResolutionService` | Public construction exposes substitution path | Public API must preserve authority boundary | `MISSING`; `NW-RESULT-002` |
| ARCHITECTURE_GUARD | `tests/exec-001-ticket-002.test.ts:499-541` | Imports/common path guarded, result authority not guarded | Architecture guard includes trusted-result boundary | `MISSING`; `NW-RESULT-002` |
| TEST | Ticket test suite | Source receipt negatives only | Direct forged/caller-injected result negative witness | `MISSING`; `NW-RESULT-001` |

`CAMPAIGN_MATRIX_COMPLETE = NO`; `ALL_SURFACE_ROWS_COVERED = NO`; campaign remains
`OPEN` and cannot be closed by the current happy-path suite.

### BEH-MAJOR-001 — Null/undefined resolution context escapes as an exception

- **Severity:** `MAJOR`
- **Ticket:** `EXEC-001-TICKET-002`
- **Finding category:** `FAILURE_SEMANTICS_GAP`
- **Requirements / acceptance:** `EXEC-CAPABILITY-001`, `EXEC-REGISTRY-001`; `AC-EXEC-004`, `AC-EXEC-011`; ticket §14b failure semantics and design §18 malformed-input flow.
- **Required behavior:** Invalid resolution context must fail closed with a structured `CONTRACT_INVALID` result and no approval/no mutation.
- **Production evidence:** `src/application/exec-registry.ts:51-59` catches selection errors but calls `failureBasis(input)`; `:151-153` dereferences `input.scope` without checking whether `input` is null or undefined.
- **Test evidence:** `npm test` and the 17 ticket tests pass but have no null/undefined application-boundary case. Independent probes of `resolve(null)` and `resolve(undefined)` both threw `TypeError: Cannot read properties of null/undefined (reading 'scope')`.
- **Observed result:** Untrusted nullish context escapes the structured failure boundary; no canonical result is returned.
- **Expected result:** `FAILED`, `code=CONTRACT_INVALID`, `noApproval=true`, `noMutation=true`, with a safe failure context even when the input is absent.
- **Problem:** The domain resolver has an explicit invalid-request result path, but the application wrapper's recovery/failure mapper assumes the invalid object exists.
- **Impact:** A malformed caller request can crash the resolution boundary and bypass the required fail-closed result contract; callers cannot reliably distinguish a contract rejection from an application exception.
- **Minimum correction required:** Make failure-basis construction null-safe and add direct null, undefined, primitive, throwing-getter and malformed-object negative tests at the application boundary.
- **Systemic pattern:** `NO`
- **Related locations:** `src/application/exec-registry.ts:51-59,151-153`; missing test case in `tests/exec-001-ticket-002.test.ts`.
- **ROOT_CAUSE_CAMPAIGN_ID:** `RCC-EXEC-REGISTRY-FAILURE-MAPPING`
- **CAPABILITY:** `UNIT-EXEC-REGISTRY-FAILURE-SEMANTICS`
- **DEPENDENCY_CLASS:** `REQUIRED_FOR_LOCAL_CLOSURE`
- **LOCAL_CLOSURE_BLOCKING:** `YES`
- **LOCAL_ACCEPTANCE_REQUIRES_PRODUCTIVE_CAPABILITY:** `NO`
- **CLOSURE_OWNERSHIP:** `LOCAL_TICKET`
- **EVIDENCE_TIMING:** local closure; direct malformed-input witness is executable now.
- **DEPENDENCY_CLASS_RECLASSIFICATION_REQUIRED:** `NO`
- **UPSTREAM_DEPENDENCY_CLASSIFICATION_PRESERVED:** `YES`
- **BLOCKS_LOCAL_EXECUTION:** `YES`
- **BLOCKS_LOCAL_CLOSURE:** `YES`
- **BLOCKS_TICKET_DONE:** `YES`
- **BLOCKS_INTEGRATED_PROOF:** `YES`
- **BLOCKS_SPEC_FINAL_CONFORMANCE:** `YES`
- **PRIMARY_ROUTE:** `IMPLEMENTATION_REMEDIATION`
- **DOWNSTREAM_CHECKPOINT:** local ticket failure-semantics closure
- **DOWNSTREAM_OWNER:** EXEC-001 implementation/remediation owner

#### Root-cause surface matrix — RCC-EXEC-REGISTRY-FAILURE-MAPPING

| Surface | Location | Current behavior | Expected behavior | Coverage / negative witness |
|---|---|---|---|---|
| CONSUMER | `ResolveExecCapability.resolve` | Catch path calls unsafe failure mapper | Always return structured failure | `MISSING`; `NW-FAILURE-001` |
| INJECTION_POINT | Public `resolve(input)` | Nullish caller input reaches mapper | Reject all invalid shapes safely | `MISSING`; `NW-FAILURE-001` |
| PUBLIC_EXPORT | `ResolveExecCapability` | Public method can throw for nullish input | Public boundary fail closed | `MISSING`; `NW-FAILURE-001` |
| TEST | Ticket-specific tests | No null/undefined boundary witness | Direct malformed-input tests | `MISSING`; `NW-FAILURE-001` |
| ISSUER / REGISTRAR / ALTERNATE_AUTHORITY_PATH / MUTATION_PATH / STALE_PATH / PORT_SUBSTITUTION_PATH | Not implicated by this localized mapper defect | N/A | N/A | `NOT_APPLICABLE` with reason |

`CAMPAIGN_MATRIX_COMPLETE = NO`; campaign remains `OPEN` pending the local
failure-boundary correction and negative witnesses.

### BEH-MAJOR-002 — Productive DOM/REPO authority is unavailable for integrated proof

- **Severity:** `MAJOR`
- **Ticket:** `EXEC-001-TICKET-002`
- **Finding category:** `CAPABILITY_AVAILABILITY_CONTRADICTION`
- **Requirements / acceptance:** `EXEC-REGISTRY-001/002`, `EXEC-CAPABILITY-001`; `AC-EXEC-008`, `AC-EXEC-009`, and integrated contributions to `AC-EXEC-005`/`AC-EXEC-007`.
- **Required behavior:** Integrated execution must consume the approved productive DOM execution-basis producer and REPO NORMAL catalog producer, preserving their authority, source, scope and frozen revision.
- **Production evidence:** `src/application/exec-registry-ports.ts:23-41` contains only abstract consumer-shaped ports; `:74-104` exposes explicitly local fixture producers. `src/composition/exec-registry.ts` wires optional sources but implements no productive DOM or REPO adapter. The ticket/design records `PRODUCTIVE_AVAILABILITY=NO` for both foreign capabilities.
- **Test evidence:** All 17 ticket tests use local fixture sources. The fixture tests are valid local/contract witnesses but cannot prove productive availability, foreign integration, physical durability or integrated recovery. The direct DOM suite could not collect under the available Node strip-only loader and no productive DOM/REPO runtime exists at the target.
- **Observed result:** Local resolution works against an authenticated fixture, but the integrated consumer execution point has no productive authority producer; the capability is `DEFINED_BUT_NOT_CONSUMABLE`.
- **Expected result:** At the downstream integrated checkpoint, a productive DOM resolver and enabled REPO source issue consumable authority-bearing material and direct integration tests prove returned data, revision, not-found/stale/failure semantics and provenance.
- **Problem:** The local implementation correctly preserves the planned integrated-only dependency class, but productive integrated behavior remains absent. No fixture or local test can close this obligation.
- **Impact:** Integrated registry/catalog behavior and final cross-SPEC conformance cannot be proven at this target. This is not a local-closure blocker because the approved Plan/Ticket class is `REQUIRED_FOR_INTEGRATED_PROOF`.
- **Minimum correction required:** Provide new productive producer evidence at the integrated checkpoint; execute direct DOM/REPO consumer tests, including forged/caller-injected, stale/mutated, wrong-source and alternate-adapter negatives. Do not promote the local fixture.
- **Systemic pattern:** `NO` (planned cross-SPEC capability handoff, not a local implementation root cause)
- **Related locations:** `src/application/exec-registry-ports.ts:23-104`; `src/composition/exec-registry.ts:1-26`; ticket §14a-§14b; design §7 and §16.
- **CAPABILITY:** `DOM-EXEC-IDENTITY-SNAPSHOT`, `REPO-EXEC-NORMAL-CATALOG`
- **DEPENDENCY_CLASS:** `REQUIRED_FOR_INTEGRATED_PROOF`
- **LOCAL_CLOSURE_BLOCKING:** `NO`
- **LOCAL_ACCEPTANCE_REQUIRES_PRODUCTIVE_CAPABILITY:** `NO`
- **CLOSURE_OWNERSHIP:** `INTEGRATED_CHECKPOINT`
- **EVIDENCE_TIMING:** integrated proof checkpoint after productive DOM/REPO producers are available.
- **DEPENDENCY_CLASS_RECLASSIFICATION_REQUIRED:** `NO`
- **UPSTREAM_DEPENDENCY_CLASSIFICATION_PRESERVED:** `YES`
- **BLOCKS_LOCAL_EXECUTION:** `NO`
- **BLOCKS_LOCAL_CLOSURE:** `NO`
- **BLOCKS_TICKET_DONE:** `NO`
- **BLOCKS_INTEGRATED_PROOF:** `YES`
- **BLOCKS_SPEC_FINAL_CONFORMANCE:** `YES`
- **PRIMARY_ROUTE:** `IMPLEMENTATION_PLAN_REVALIDATION`
- **DOWNSTREAM_CHECKPOINT:** integrated DOM/REPO → EXEC registry/catalog proof
- **DOWNSTREAM_OWNER:** SPEC-DOM-001 canonical resolver; SPEC-REPO-001 enabled catalog producer; EXEC-001 integrated consumer owner

This preserves the upstream dependency classification. It does not promote an
integrated-only finding to a local blocker and does not claim that the fixture is
a productive producer.

### BEH-MINOR-001 — Ticket evidence execution counts are stale

- **Severity:** `MINOR`
- **Ticket:** `EXEC-001-TICKET-002`
- **Requirements / acceptance:** `AC-EXEC-003`, `AC-EXEC-008`, `AC-EXEC-009`, `AC-EXEC-010`, `AC-EXEC-011`, `AC-EXEC-012` evidence records.
- **Required behavior:** Completion evidence must accurately report the executable command and its output.
- **Production evidence:** No production semantic defect; target test file contains 17 test cases.
- **Test evidence:** Each of the six evidence files reports `EXECUTED_OUTPUT = 16 tests, 16 passed`, while direct execution at the pinned target reports 17 passed. The implementation ticket also reports a focused `10/10` record that does not match the target file's 17 tests.
- **Observed result:** The semantic tests pass, but the persisted evidence snapshot does not accurately identify the executed test count.
- **Expected result:** Evidence records must match the pinned target command output and distinguish focused cases from the complete file.
- **Problem:** Stale counts weaken reproducibility and evidence traceability, although they do not change the observed semantic results.
- **Impact:** Reviewers may be unable to reconcile evidence claims with the executable target; this is non-blocking for the covered behavior but must be corrected in the appropriate evidence workflow.
- **Minimum correction required:** Re-execute the pinned command and update the affected evidence/implementation record through its owning audit/evidence workflow; do not alter production behavior to address this documentation discrepancy.
- **Systemic pattern:** `NO`
- **Related locations:** `docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/AC-EXEC-003-semver.md`; `AC-EXEC-008-deterministic-resolution.md`; `AC-EXEC-009-catalog-isolation.md`; `AC-EXEC-010-bootstrap-allowlist.md`; `AC-EXEC-011-failure-distinction.md`; `AC-EXEC-012-registry-extensibility.md`; ticket §27.
- **CAPABILITY:** `UNIT-EXEC-REGISTRY-FIXTURE`
- **DEPENDENCY_CLASS:** `INFORMATIONAL`
- **LOCAL_CLOSURE_BLOCKING:** `NO`
- **LOCAL_ACCEPTANCE_REQUIRES_PRODUCTIVE_CAPABILITY:** `NO`
- **CLOSURE_OWNERSHIP:** `LOCAL_TICKET`
- **EVIDENCE_TIMING:** local evidence snapshot; correction is documentary and does not promote productive availability.
- **DEPENDENCY_CLASS_RECLASSIFICATION_REQUIRED:** `NO`
- **UPSTREAM_DEPENDENCY_CLASSIFICATION_PRESERVED:** `YES`
- **BLOCKS_LOCAL_EXECUTION:** `NO`
- **BLOCKS_LOCAL_CLOSURE:** `NO`
- **BLOCKS_TICKET_DONE:** `NO`
- **BLOCKS_INTEGRATED_PROOF:** `NO`
- **BLOCKS_SPEC_FINAL_CONFORMANCE:** `NO`
- **PRIMARY_ROUTE:** `IMPLEMENTATION_REMEDIATION`
- **DOWNSTREAM_CHECKPOINT:** local evidence reconciliation
- **DOWNSTREAM_OWNER:** ticket evidence/audit owner

## 10. Summary

Audit: `docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-version-registry-catalogs-capabilities.md`

Specialist:
IMPLEMENTATION_BEHAVIOR

Ticket: EXEC-001-TICKET-002

Required behavioral dimensions: 7

Required tests: 10

Required tests missing: 2

Required behaviors total: 11

Direct behavior witnesses: 9

Proxy-only behaviors: 0

Untested state transitions: 2

Unproven concurrency contracts: 0 local; integrated physical CAS remains outside scope

Missing architecture guards: 0

Tests run: 65 unique configured cases

Tests passed: 65

Tests failed: 0 in configured suites

Regressions: 0

Concurrency:
NOT_APPLICABLE

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
MAJOR=2
MINOR=1
INFO=0

Domain audit complete:
YES

Specialist result:
SPECIALIST_BEHAVIOR_FINDINGS

AUDIT_TARGET_HEAD: 8b6fe86b0f6370094e630b7272c98a490518cfac
AUDIT_TARGET_STATE_FINGERPRINT: b61bd4448910d5260c149cc29396e6b67eb3b1f623b7d81b15e9f9802baf0bab
AUDIT_WAVE_ID: cf3f4999-1f37-481b-a706-8ccc94dc7358
DOMAIN_AUDIT_COMPLETE: YES
SPECIALIST_RESULT: SPECIALIST_BEHAVIOR_FINDINGS
