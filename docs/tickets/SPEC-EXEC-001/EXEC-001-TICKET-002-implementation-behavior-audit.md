# Implementation behavior audit — EXEC-001-TICKET-002

Audit: `docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-version-registry-catalogs-capabilities.md`

Specialist: `IMPLEMENTATION_BEHAVIOR`

## Audit inputs and target

| Field | Value |
|---|---|
| TICKET_ID | `EXEC-001-TICKET-002` |
| TICKET_PATH | `docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-version-registry-catalogs-capabilities.md` |
| IMPLEMENTATION_UNIT | `EXEC-IMP-02 — Version, registry resolution, catalogs and capability extensibility` |
| REQUIREMENT_IDS | `EXEC-VERSION-001/002`, `EXEC-REGISTRY-001/002/003`, `EXEC-CAPABILITY-001/002` |
| ACCEPTANCE_IDS | `AC-EXEC-003`, `004`, `008`, `009`, `010`, `011`, `012` |
| SPEC_PATH | `docs/specs/SPEC-EXEC-001-skill-contracts-and-capability-registry.md` |
| GAP_MATRIX_PATH | `docs/specs/gap-matrices/SPEC-EXEC-001-implementation-gap-matrix.md` |
| IMPLEMENTATION_PLAN_PATH | `docs/specs/implementation-plans/SPEC-EXEC-001-implementation-plan.md` |
| IMPLEMENTATION_BASELINE | `d4216ad6f4a87fe7142ccd45d3fd099ef1b92955` (ticket-recorded baseline) |
| CURRENT_HEAD | `c450df1c4523a841484cbf1acb8cd1ab57621017` |
| AUDIT_TARGET_HEAD | `c450df1c4523a841484cbf1acb8cd1ab57621017` |
| AUDIT_TARGET_STATE_FINGERPRINT | `d91db0e8d277c66499d9d4fd5dc0a05818aeb7d39faf1303876abc8e6d165192` |
| Working tree | Clean before this artifact; HEAD verified directly. |
| CHANGED_PRODUCTION_FILES | `src/domain/exec-registry.ts`; `src/application/exec-registry.ts`; `src/application/exec-registry-ports.ts`; `src/composition/exec-registry.ts` |
| CHANGED_TEST_FILES | `tests/exec-001-ticket-002.test.ts`; `tests/exec-registry-import-boundary-loader.mjs`; `tests/fixtures/exec-registry-forbidden-import.mjs` |
| RELEVANT_TEST_SUITES | focused TICKET-002 tests; TICKET-001 regression; package test suite; typecheck; architecture/import guard; governance and skill-mirror guards |

The implementation baseline was a pre-checkpoint remediation state. The audited
semantic state is the pinned `c450df1` commit, not the ticket's historical
implementation-report claims.

## Authority and capability records

The accepted authority chain is ADR-0003 revision 3, approved portfolio
O-017/O-020, conformant SPEC-EXEC-001 revision 3, validated GAP-004/006/008/009/010/011,
plan unit EXEC-IMP-02, this ticket/design, repository implementation, and the
executed tests. DOM identity/execution basis and REPO enabled NORMAL catalog
remain foreign integrated-proof capabilities.

| Capability | Authority / producer | Contract | Local testability | Productive availability | Dependency class | Evidence timing / effect |
|---|---|---|---|---|---|---|
| `UNIT-EXEC-REGISTRY-FIXTURE` | EXEC local test support | Defined | YES | NO (fixture only) | INFORMATIONAL | Current local contract evidence; no productive claim |
| `DOM-EXEC-IDENTITY-SNAPSHOT` | SPEC-DOM-001 / DOM canonical resolver | Defined | NO | NO | REQUIRED_FOR_INTEGRATED_PROOF | No productive producer or integrated execution at target |
| `REPO-EXEC-NORMAL-CATALOG` | SPEC-REPO-001 / enabled REPO configuration | Defined | NO | NO | REQUIRED_FOR_INTEGRATED_PROOF | No productive producer or integrated execution at target |

`AUTHORITY_CONSUMPTION_PROOF` is locally consumable for the EXEC domain
contract, but the foreign productive capabilities are **DEFINED_BUT_NOT_CONSUMABLE**.
This preserves the ticket's upstream classification and does not convert either
capability into a local blocker. No fixture was promoted to productive
availability.

`PRODUCER_CONSUMER_CONTRACT_PROOF`: `ResolveExecCapability` verifies producer
receipt identity, expected source kind, scope, source marker and exact
`CatalogRevision`; direct basis injection, copied receipts, wrong-source and
cross-scope substitution are rejected. `RegisterExecCapability` similarly
requires an authenticated source receipt and rejects local fixtures.

`TEMPORAL_AUTHORITY_PROOF`: `NOT_APPLICABLE` for this unit's local operation.
Resolution reads a frozen basis and commits no external effect; physical CAS,
durability and mutable producer revalidation remain integrated/PLAT concerns.
`CALLER_AS_AUTHORITY_CHECK`: PASS for this unit; caller input cannot supply a
basis, producer receipt, canonical scope, catalog revision or support set.

## Behavioral applicability matrix

| Dimension | Classification | Reason and audit result |
|---|---|---|
| UNIT_BEHAVIOR | REQUIRED | Semver, explicit support, complete mapping, scope, allowlist, outcomes and common registration are implemented and exercised. |
| INTEGRATION_BEHAVIOR | AFFECTED | DOM/REPO source ports are present and fail closed, but no productive foreign producer exists at this target; integrated proof remains open. |
| PERSISTENCE | NOT_APPLICABLE | Ticket deliberately uses immutable in-process bases; physical persistence is TICKET-003/PLAT scope. |
| CONCURRENCY | NOT_APPLICABLE | There is no shared mutable local store or physical winner claim; local registration is pure new-basis publication. Physical CAS is explicitly integrated-only. |
| STALE_STATE | REQUIRED | Exact catalog revision, source, scope and receipt checks are required and tested. |
| IDEMPOTENCY | REQUIRED | Duplicate/conflicting registration must leave the prior basis unchanged. |
| DURABILITY | NOT_APPLICABLE | No durable publication is implemented by this ticket. |
| RECOVERY | NOT_APPLICABLE | Restart, rehydration and physical recovery are outside this unit. |
| COMPATIBILITY | REQUIRED | SemVer classification and exact supported-set compatibility are the core behavior; no silent conversion is allowed. |
| MIGRATION_BEHAVIOR | NOT_APPLICABLE | Migration is only an allowlisted category here; migration execution/legacy ownership belongs to REPO. |
| NEGATIVE_PATHS | REQUIRED | Invalid input, unknown/incompatible requests, duplicate/conflicting entries, stale/copy/forged authority and unavailable sources are required failures. |

## Production behavior classification

| Required behavior | Production evidence and observed result | Classification |
|---|---|---|
| SemVer major/minor/patch and explicit support | `SemanticVersion` parses canonical versions and compares decimal components without unsafe numeric coercion. `SupportedVersionSet` is authenticated and exact; unsupported versions do not alias or convert. | `IMPLEMENTED_CORRECTLY` locally |
| Complete deterministic registry mapping | `RegistryEntry.create` validates authenticated input/output schemas, artifacts, verdicts, roles and supported versions. `CatalogBasis.register` returns a new immutable basis; resolution is registration-order independent and returns the complete entry. | `IMPLEMENTED_CORRECTLY` locally; one negative test witness is missing (BEH-MAJOR-001) |
| NORMAL/BOOTSTRAP separation | `CatalogScope` preserves NORMAL repository scope versus system BOOTSTRAP. The application checks source kind, scope and exact revision; local fixture sources are deliberately rejected at the productive boundary. | `IMPLEMENTED_CORRECTLY` locally; integrated producer path unavailable |
| Bootstrap allowlist before work | `BootstrapAllowlistPolicy` permits only DISCOVERY, VALIDATION, MIGRATION, AUDIT and REMEDIATION. A NORMAL category in BOOTSTRAP yields `INCOMPATIBLE_CAPABILITY`, `noApproval=true`, `noMutation=true`; the application does not read the NORMAL source. | `IMPLEMENTED_CORRECTLY` locally |
| Unknown/incompatible distinction | Lookup miss yields `UNKNOWN_CAPABILITY`; known stage/schema/version/role incompatibility yields `INCOMPATIBLE_CAPABILITY`; malformed request/source yields `CONTRACT_INVALID`. | `IMPLEMENTED_CORRECTLY` locally |
| Common synthetic capability path and frozen-basis immutability | Synthetic schema-authenticated entry uses the same `RegistryEntry`/`CatalogBasis`/resolver path. Registration returns a new basis and the old basis remains unchanged. | `IMPLEMENTED_CORRECTLY` locally |
| Productive source consumption/publication | `src/application/exec-registry-ports.ts` has a private receipt ledger used by local fixture constructors. `ResolveExecCapability` and `RegisterExecCapability` reject those fixtures, and no productive DOM/REPO adapter or receipt issuer exists under `src/`. | `PARTIAL` at integrated boundary; explicitly integrated-only, reported as BEH-INFO-001 |

## Acceptance witness audit

The ticket's six witness rows were expanded into nine observable behaviors by
separating support-set rejection, duplicate/conflict registration and the two
contributor obligations. The repository tests directly witness the positive
and negative behavior for eight rows. The incomplete-entry negative operation is
not directly exercised by a checked-in test.

| Behavior | Direct operation and assertion | Witness |
|---|---|---|
| SemVer classification | `SemanticVersion.parse` and `classifySemanticVersionChange`; exact components, large decimals, build-only `NONE`, PATCH/MINOR/MAJOR assertions | DIRECT; pass |
| Explicit support-set rejection | `SupportedVersionSet.has/resolve`; exact supported, unsupported, malformed and duplicate assertions; resolver returns incompatible | DIRECT; pass |
| Complete deterministic mapping | `CatalogBasis.register` and `RegistryResolutionService.resolve`; complete fields and both registration orders | DIRECT; pass |
| Duplicate/conflict no mutation | repeated/conflicting `CatalogBasis.register`; prior identity and entry count unchanged | DIRECT; pass |
| NORMAL/BOOTSTRAP isolation | independent repository bases, source/scope substitution and bootstrap source-kind checks | DIRECT; pass locally |
| Bootstrap allowlist/no normal-source work | normal category rejected in bootstrap; allowlisted DISCOVERY resolves; application does not read NORMAL source | DIRECT; pass locally |
| Unknown/incompatible distinction | unknown capability, unsupported version and incompatible schema assertions | DIRECT; pass |
| Common synthetic extensibility/frozen basis | synthetic registration and resolution through common path; old basis unchanged | DIRECT; pass |
| Incomplete entry rejection | production `RegistryEntry.create` has required-field/schema guards; an auditor one-off probe passed, but no repository test removes a required field and asserts `CONTRACT_INVALID`/no mutation | UNTESTED checked-in transition; BEH-MAJOR-001 |

```text
REQUIRED_BEHAVIORS_TOTAL = 9
DIRECT_BEHAVIOR_WITNESSES = 8
PROXY_ONLY_BEHAVIORS = 0
UNTESTED_STATE_TRANSITIONS = 1
UNPROVEN_CONCURRENCY_CONTRACTS = 0
MISSING_ARCHITECTURE_GUARDS = 0
ACCEPTANCE_WITNESS_MATRIX_ROWS = 6 (ticket); 9 (expanded implementation-design rows)
WITNESS_EXECUTABLE_AT_LOCAL_CLOSURE = YES for all local rows except the missing checked-in incomplete-entry witness
```

The one-off auditor probe was:
`node --experimental-strip-types --input-type=module` with an assertion that
`RegistryEntry.create` rejects a missing `allowedRoles` field; it passed. This
confirms runtime rejection but is not a repository completion test and does not
close the missing witness.

## Test inventory and assertion quality

| Category | Classification | Evidence |
|---|---|---|
| UNIT | REQUIRED_TEST_PRESENT | Focused semver/value-object and resolver tests |
| INVARIANT | REQUIRED_TEST_PRESENT | Complete mapping, immutable basis, authenticated schemas/results and duplicate rejection |
| INTEGRATION | REQUIRED_TEST_MISSING at target | DOM/REPO productive producers are unavailable; accepted integrated-only follow-up, not a local closure blocker |
| STALE | REQUIRED_TEST_PRESENT | Stale revision, copied receipt, wrong source and cross-scope checks |
| IDEMPOTENCY | REQUIRED_TEST_PRESENT | Duplicate/conflict rejection and prior-basis no-mutation assertions |
| COMPATIBILITY | REQUIRED_TEST_PRESENT | Exact support set, major/minor/patch and no-alias assertions |
| NEGATIVE_PATH | REQUIRED_TEST_PRESENT | Malformed, unavailable, forged, injected, unknown and incompatible paths |
| ARCHITECTURE_GUARD | REQUIRED_TEST_PRESENT | Source import scan, experimental loader guard and real graph import/execution |
| CONFORMANCE | REQUIRED_TEST_PRESENT | Full package suite, typecheck and governance/skill guards |
| PERSISTENCE | TEST_CATEGORY_NOT_APPLICABLE | No physical persistence in scope |
| CONCURRENCY | TEST_CATEGORY_NOT_APPLICABLE | No local shared mutable or physical CAS contract claimed |
| RECOVERY | TEST_CATEGORY_NOT_APPLICABLE | TICKET-003/PLAT scope |
| MIGRATION | TEST_CATEGORY_NOT_APPLICABLE | Only category allowlisting is local |

Assertions are generally **STRONG**: tests assert exact status/code, complete
mapping fields, source/scope/revision identity, no approval, no mutation,
immutability and rejected forged/caller-provided values. They do not rely on
HTTP status, non-null checks, exception absence, duplicated implementation logic
or successful construction alone. The incomplete-entry state is a real
assertion-coverage gap even though the production guard itself is present.

## Failure and negative-path behavior

| Input/failure | Expected | Observed |
|---|---|---|
| Invalid/malformed resolution context or schema | `CONTRACT_INVALID`, no approval, no mutation | Observed and asserted, including nullish and throwing-getter contexts |
| Unknown capability | `UNKNOWN_CAPABILITY` | Observed and asserted |
| Known unsupported version/schema/stage/role | `INCOMPATIBLE_CAPABILITY` without alias/conversion | Observed and asserted |
| NORMAL capability in BOOTSTRAP | `INCOMPATIBLE_CAPABILITY` before normal work | Observed; NORMAL source read count remains zero |
| Duplicate/conflicting registration | `CONTRACT_INVALID` semantics and unchanged prior basis | `ExecRegistryDomainError.code` is `CONTRACT_INVALID`; direct tests assert throw and no mutation |
| Caller basis/support-set/repository injection | Reject caller authority | Observed as `CONTRACT_INVALID` or ignored caller field; no successful substitution |
| Forged/copy/stale receipt or wrong source | Fail closed | Observed as `CONTRACT_INVALID`; frozen material remains unchanged |
| Unavailable productive source | Fail closed, no success/approval | Observed as structured `CONTRACT_INVALID` failure for resolution; productive registration publication is not available |

No silent overwrite, partial basis mutation, fallback approval or retry-induced
duplicate local entry was observed. Physical persistence failure, restart and
recovery are not claimed by this unit.

## Test execution record

Commands independently executed at the pinned HEAD:

1. `node --experimental-strip-types --test tests/exec-001-ticket-002.test.ts` — 23 passed, 0 failed, 0 skipped.
2. `npm test` — 71 passed, 0 failed, 0 skipped; includes TICKET-001 regression and workflow regression tests.
3. `npm run typecheck` — pass.
4. `npm run verify:audit-governance` — pass.
5. `npm run verify:skill-mirror` — pass.
6. One-off incomplete-entry auditor probe — pass; not counted as repository test evidence.

```text
TESTS_RUN = 71 unique package tests (focused rerun = 23)
TESTS_PASSED = 71
TESTS_FAILED = 0
TESTS_SKIPPED = 0
ENVIRONMENTAL_FAILURES = 0
FOCUSED_TICKET_TESTS = 23/23
TICKET-001_REGRESSION = PASS (included in package result)
TYPECHECK = PASS
ARCHITECTURE_GUARD = PASS
```

## Regression result

`IMPLEMENTATION_BASELINE = d4216ad6f4a87fe7142ccd45d3fd099ef1b92955` had no
TICKET-002 productive registry behavior to preserve. The directly affected
TICKET-001 tests and package regression suite pass at the target. No regression
was discovered in the existing contract/import boundaries.

```text
REGRESSION_RESULT = NO_REGRESSION
REGRESSIONS = 0
```

## Conditional dimensions

- **Concurrency: NOT_APPLICABLE locally.** Immutable local bases cannot lose an
  update; physical CAS/one-winner semantics are explicitly outside this ticket.
- **Stale behavior: CONFORMANT locally.** Authenticated exact revisions,
  source kind, scope and receipt binding reject stale/cross-source material.
- **Idempotency: CONFORMANT locally.** Duplicate/conflicting keys fail without
  mutating the previous basis; equivalent local reads do not create duplicate
  entries.
- **Durability/persistence: NOT_APPLICABLE.** No durable identity or physical
  persistence claim is made.
- **Recovery: NOT_APPLICABLE.** Restart/replay/rehydration belongs to the next
  unit and PLAT.
- **Compatibility: CONFORMANT locally.** Explicit support sets and canonical
  unknown/incompatible outcomes are preserved without conversion.

## Authority provenance and anti-forgery surface matrix

| Surface class | Location / owner | Current behavior | Negative witness / status |
|---|---|---|---|
| ISSUER | private `issue` in `src/application/exec-registry-ports.ts`; local fixture support | Issues frozen receipts only for authenticated local fixture sources; productive DOM/REPO issuer absent | Local forged receipt/source tests pass; integrated issuer missing |
| REGISTRAR | `RegisterExecCapability` / `CatalogBasis.register` | Requires an authenticated source receipt; publishes a new immutable local basis only | Caller fixture publication rejected; covered locally |
| CONSUMER | `ResolveExecCapability.assertAuthorizedBasis` | Verifies receipt ledger, source kind, source marker, scope and exact revision before use | Direct/copy/wrong-source/stale tests pass |
| ALTERNATE_AUTHORITY_PATH | direct `CatalogBasis`/domain resolver and fixture constructors | Local semantic path exists; productive application rejects fixture authority | Productive boundary rejection covered; integrated positive path missing |
| INJECTION_POINT | request `basis`, caller repository, caller support set, resolver/source adapters | Basis/support-set/repository/result/source injection is rejected or ignored | Direct negative tests pass |
| MUTATION / STALE_PATH | frozen bases, `CatalogRevision`, result binding | Frozen basis and stale revisions cannot be silently substituted | No-mutation/stale tests pass |
| PORT_SUBSTITUTION_PATH | bootstrap vs DOM/REPO source kinds | Wrong source kind and copied receipt fail closed | Direct tests pass |
| PUBLIC_EXPORT | `CatalogBasisSourceReceipt`, abstract source ports, fixture constructors | Receipt shape is transportable but cannot mint authority; no productive receipt-issuance API is present | Integrated producer capability remains unavailable |
| RETRY / RECOVERY | physical persistence boundary | Not implemented by this ticket | NOT_APPLICABLE; downstream integrated checkpoint |

`ROOT_CAUSE_CAMPAIGN_ID = RCC-EXEC-02-PRODUCTIVE-BASIS-RECEIPT`
`CAMPAIGN_STATUS = OPEN`
`CAMPAIGN_SCOPE = TICKET-002 DOM/REPO integrated proof`
The campaign is not a local closure blocker. Required surface coverage is:
issuer/registrar/consumer/alternate/injection/mutation-stale/port-substitution
covered or explicitly missing above; productive issuer and public issuance are
owned by the future DOM/REPO integrated checkpoint; persistence/recovery are
outside scope. The campaign cannot close until productive producers issue
owner-bound receipts and a positive integrated resolution/registration test,
plus forged/stale/alternate-adapter negatives, execute at the consumer point.

## Findings

### BEH-MAJOR-001 — Incomplete-entry negative witness is missing

- **Severity:** `MAJOR`
- **Ticket:** `EXEC-001-TICKET-002`
- **Requirement / acceptance:** `EXEC-REGISTRY-001`; `AC-EXEC-008`
- **Required behavior:** An incomplete registry entry must be rejected as
  `CONTRACT_INVALID` without publishing or mutating a catalog basis.
- **Production evidence:** `src/domain/exec-registry.ts`,
  `RegistryEntry.create` validates required stage/identity/semver/schema,
  artifacts, verdicts, roles and support-set authority; `CatalogBasis.register`
  rejects unauthenticated entries before publication.
- **Test evidence:** `tests/exec-001-ticket-002.test.ts` directly tests complete
  mapping, duplicate/conflict registration, forged schema/category/support set
  and forged entry rejection, but does not remove a required field from an
  otherwise attempted entry and assert the canonical failure/no-mutation
  result. The independent one-off probe passed but is not a repository test.
- **Observed result:** Runtime code fails closed, but the acceptance witness row
  for incomplete entry is not operationalized in the checked-in suite.
- **Expected result:** A ticket test must execute incomplete entry construction
  or registration and assert `CONTRACT_INVALID`, no new basis, no mutation and
  no success/approval.
- **Problem:** Required direct negative evidence is absent; source inspection
  and an auditor-only probe cannot close the witness.
- **Impact:** Local acceptance/completion evidence for the deterministic mapping
  row is incomplete despite a green suite.
- **Minimum correction required:** Add and execute a focused checked-in
  incomplete-entry negative test with canonical code and no-mutation assertions;
  update the AC-EXEC-008 evidence output at the target.
- **Systemic pattern:** `NO`
- **Related locations:** `RegistryEntry.create`, `CatalogBasis.register`,
  `tests/exec-001-ticket-002.test.ts`, AC-EXEC-008 evidence.
- **Capability:** `UNIT-EXEC-REGISTRY-FIXTURE`
- **Dependency class:** `INFORMATIONAL`
- **Local acceptance requires productive capability:** `NO`
- **Evidence timing:** Required at local closure; missing checked-in witness.
- **LOCAL_CLOSURE_BLOCKING:** `YES`
- **DEPENDENCY_CLASS_RECLASSIFICATION_REQUIRED:** `NO`
- **UPSTREAM_DEPENDENCY_CLASSIFICATION_PRESERVED:** `YES`
- **Suggested blocking effects:** `BLOCKS_LOCAL_EXECUTION=NO`; `BLOCKS_LOCAL_CLOSURE=YES`; `BLOCKS_TICKET_DONE=YES`; `BLOCKS_INTEGRATED_PROOF=NO`; `BLOCKS_SPEC_FINAL_CONFORMANCE=YES` for the owned acceptance witness.
- **Suggested route:** `PRIMARY_ROUTE=IMPLEMENTATION_REMEDIATION`; `CLOSURE_OWNERSHIP=LOCAL_TICKET`.

### BEH-INFO-001 — Productive DOM/REPO authority producers are unavailable

- **Severity:** `INFO`
- **Ticket:** `EXEC-001-TICKET-002`
- **Requirement / acceptance:** `EXEC-REGISTRY-001/002`; `AC-EXEC-008`, `AC-EXEC-009`,
  `AC-EXEC-010`, `AC-EXEC-012`
- **Required behavior:** At integrated proof, DOM must provide the canonical
  execution identity/basis and REPO must provide the enabled repository-scoped
  NORMAL catalog; the consumer must verify and resolve their owner-bound
  material.
- **Production evidence:** `src/application/exec-registry-ports.ts` contains
  only local fixture receipt issuance through a private ledger. `ResolveExecCapability`
  and `RegisterExecCapability` explicitly reject fixture sources at the
  productive application boundary. No productive DOM/REPO producer or adapter
  exists in the audited target.
- **Test evidence:** 23/23 focused tests pass, including forged/copy/stale and
  fixture-rejection negatives. No positive productive producer test can run at
  this target.
- **Observed result:** Local EXEC semantics are correct, but productive
  integrated availability is `NO` for both foreign capabilities.
- **Expected result:** Integrated checkpoint supplies owner-bound receipts and
  runs positive plus forged/stale/alternate-adapter negative tests at the
  consumer point.
- **Problem:** Integrated proof cannot yet be executed. This is the ticket's
  declared `REQUIRED_FOR_INTEGRATED_PROOF` dependency, not a local closure
  defect and not a productive-availability promotion.
- **Impact:** Integrated registry/catalog resolution remains open downstream.
- **Minimum correction required:** DOM/REPO producers must issue verifiable
  owner-bound receipts through the approved seam; run integrated source,
  scope, revision, stale, forgery and alternate-adapter tests. Do not replace
  this with a fixture or mock.
- **Systemic pattern:** `NO` within this ticket; two distinct foreign owners
  remain responsible for the producer work.
- **Related locations:** `src/application/exec-registry-ports.ts`,
  `src/application/exec-registry.ts`, DOM/REPO integrated seam.
- **Capability:** `DOM-EXEC-IDENTITY-SNAPSHOT`; `REPO-EXEC-NORMAL-CATALOG`
- **Dependency class:** `REQUIRED_FOR_INTEGRATED_PROOF`
- **Local acceptance requires productive capability:** `NO`
- **Evidence timing:** Due at integrated checkpoint; unavailable at local target.
- **LOCAL_CLOSURE_BLOCKING:** `NO`
- **DEPENDENCY_CLASS_RECLASSIFICATION_REQUIRED:** `NO`
- **UPSTREAM_DEPENDENCY_CLASSIFICATION_PRESERVED:** `YES`
- **Suggested blocking effects:** `BLOCKS_LOCAL_EXECUTION=NO`; `BLOCKS_LOCAL_CLOSURE=NO`; `BLOCKS_TICKET_DONE=NO`; `BLOCKS_INTEGRATED_PROOF=YES`; `BLOCKS_SPEC_FINAL_CONFORMANCE=YES` until integrated evidence exists.
- **Suggested route:** `PRIMARY_ROUTE=IMPLEMENTATION_PLAN_REVALIDATION` / integrated producer owners; `CLOSURE_OWNERSHIP=INTEGRATED_CHECKPOINT`.

### BEH-MINOR-001 — Ticket evidence files are not target-pinned to c450df1

- **Severity:** `MINOR`
- **Ticket:** `EXEC-001-TICKET-002`
- **Requirement / acceptance:** all local AC evidence, especially `AC-EXEC-003`,
  `AC-EXEC-008`, `AC-EXEC-009`, `AC-EXEC-010`, `AC-EXEC-011`, `AC-EXEC-012`
- **Required behavior:** Completion evidence must identify the executed target
  and be traceable to the audited implementation state.
- **Production evidence:** Current implementation/test files are at
  `c450df1`; the evidence documents under
  `docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/` still identify
  `CANONICAL_AUDIT_TARGET_HEAD=cc3fe3210eaebf8e0f577f7f5e1e48b97ed175bb` and
  an uncommitted remediation state.
- **Test evidence:** Fresh current-target execution independently passed 23/23
  and 71/71, so runtime behavior is not being inferred from the stale documents.
- **Observed result:** Historical evidence is substantively consistent with the
  current passing tests but lacks the pinned c450 target/fingerprint.
- **Expected result:** Evidence files should be regenerated or amended by the
  owning workflow with the c450 target and exact state fingerprint.
- **Problem:** Evidence timing/provenance is weaker than the current executable
  proof and cannot independently establish exact target identity.
- **Impact:** Traceability and audit handoff quality are reduced; no runtime
  regression was observed.
- **Minimum correction required:** Refresh the affected evidence records at the
  pinned target, without changing production behavior.
- **Systemic pattern:** `YES` — the same pre-checkpoint target metadata occurs
  across the ticket's evidence set.
- **Related locations:** all eight files under
  `docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/`.
- **Capability:** `UNIT-EXEC-REGISTRY-FIXTURE`
- **Dependency class:** `INFORMATIONAL`
- **Local acceptance requires productive capability:** `NO`
- **Evidence timing:** Historical/pre-checkpoint; current-target rerun available.
- **LOCAL_CLOSURE_BLOCKING:** `NO`
- **DEPENDENCY_CLASS_RECLASSIFICATION_REQUIRED:** `NO`
- **UPSTREAM_DEPENDENCY_CLASSIFICATION_PRESERVED:** `YES`
- **Suggested blocking effects:** `BLOCKS_LOCAL_EXECUTION=NO`; `BLOCKS_LOCAL_CLOSURE=NO`; `BLOCKS_TICKET_DONE=NO`; `BLOCKS_INTEGRATED_PROOF=NO`; `BLOCKS_SPEC_FINAL_CONFORMANCE=NO`.
- **Suggested route:** `PRIMARY_ROUTE=IMPLEMENTATION_REMEDIATION` or evidence-owner refresh; `CLOSURE_OWNERSHIP=LOCAL_TICKET`.

`ROOT_CAUSE_CAMPAIGN_ID = RCC-EXEC-02-EVIDENCE-TARGET-PROVENANCE`
`CAMPAIGN_STATUS = OPEN`
`CAMPAIGN_SCOPE = TICKET-002 local completion evidence`
Surface matrix: issuer/evidence generator = historical remediation run (stale
metadata); registrar/consumer = ticket completion handoff (consumes the files);
alternate authority = fresh independent test execution (covered); injection =
caller-provided target fields (must be rejected by downstream validation);
mutation/stale path = checkpoint changed HEAD after evidence generation
(missing current witness); port substitution/public export = NOT_APPLICABLE;
retry/recovery = evidence refresh route. Closure requires all affected evidence
files to carry current target metadata and direct test output.

## Summary

Audit: `docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-version-registry-catalogs-capabilities.md`

Specialist:
IMPLEMENTATION_BEHAVIOR

Ticket: EXEC-001-TICKET-002

Required behavioral dimensions: 6

Required tests: 9

Required tests missing: 1

Required behaviors total: 9

Direct behavior witnesses: 8

Proxy-only behaviors: 0

Untested state transitions: 1

Unproven concurrency contracts: 0

Missing architecture guards: 0

Tests run: 71

Tests passed: 71

Tests failed: 0

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

Caller-as-authority bypasses: 0

Findings:
CRITICAL=0
MAJOR=1
MINOR=1
INFO=1

Domain audit complete:
YES

Specialist result:
SPECIALIST_BEHAVIOR_FINDINGS

AUDIT_TARGET_HEAD: c450df1c4523a841484cbf1acb8cd1ab57621017
AUDIT_TARGET_STATE_FINGERPRINT: d91db0e8d277c66499d9d4fd5dc0a05818aeb7d39faf1303876abc8e6d165192
AUDIT_WAVE_ID: 72e54edf-031a-436b-9c04-82f31bc2a04b
DOMAIN_AUDIT_COMPLETE: YES
SPECIALIST_RESULT: SPECIALIST_BEHAVIOR_FINDINGS