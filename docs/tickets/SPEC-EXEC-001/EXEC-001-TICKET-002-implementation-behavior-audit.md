# EXEC-001-TICKET-002 — Implementation behavior audit

## Audit identity and pinned target

```text
TICKET_ID = EXEC-001-TICKET-002
TICKET_PATH = docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-version-registry-catalogs-capabilities.md
IMPLEMENTATION_UNIT = EXEC-IMP-02 — Version, registry resolution, catalogs and capability extensibility
REQUIREMENT_IDS = EXEC-VERSION-001, EXEC-VERSION-002, EXEC-REGISTRY-001, EXEC-REGISTRY-002, EXEC-REGISTRY-003, EXEC-CAPABILITY-001, EXEC-CAPABILITY-002
ACCEPTANCE_IDS = AC-EXEC-003, AC-EXEC-004, AC-EXEC-008, AC-EXEC-009, AC-EXEC-010, AC-EXEC-011, AC-EXEC-012
SPEC_PATH = docs/specs/SPEC-EXEC-001-skill-contracts-and-capability-registry.md
GAP_MATRIX_PATH = docs/specs/gap-matrices/SPEC-EXEC-001-implementation-gap-matrix.md
IMPLEMENTATION_PLAN_PATH = docs/specs/implementation-plans/SPEC-EXEC-001-implementation-plan.md
IMPLEMENTATION_BASELINE = 8f62b283b1dbf487911c7c459db95cadc25ff101 (ticket execution record; later target includes subsequent remediation checkpoints)
CURRENT_HEAD = 49b4448ba10ee9aa9d3ce7d47b139de474a482ba
AUDIT_TARGET_HEAD = 49b4448ba10ee9aa9d3ce7d47b139de474a482ba
AUDIT_TARGET_STATE_FINGERPRINT = 7983511cf1e9833261f61e43cdb252de0ed59fb330fcef75d6c03755f24f9a4d
WORKTREE_STATE = clean at audit start; no overlay used
```

### Changed implementation and test surfaces

```text
CHANGED_PRODUCTION_FILES =
src/domain/exec-registry.ts
src/application/exec-registry.ts
src/application/exec-registry-ports.ts
src/composition/exec-registry.ts

CHANGED_TEST_FILES =
tests/exec-001-ticket-002.test.ts
tests/exec-registry-import-boundary-loader.mjs
tests/fixtures/exec-registry-forbidden-import.mjs

RELEVANT_TEST_SUITES =
node --experimental-strip-types --test tests/exec-001-ticket-002.test.ts
node --experimental-strip-types --test tests/exec-001-ticket-001.test.ts
node --experimental-strip-types --test .pi/extensions/workflow-orchestrator/test/*.test.ts
npm test
npm run typecheck
npm run verify:audit-governance
npm run verify:skill-mirror
```

The approved ticket, design and ticket-set audit identify DOM execution-basis
and REPO normal-catalog producers as `REQUIRED_FOR_INTEGRATED_PROOF`, not local
closure dependencies. Their `AUTHORITY_STATUS` and `CONTRACT_STATUS` are
`DEFINED`, while `LOCAL_TESTABILITY = NO` and `PRODUCTIVE_AVAILABILITY = NO` at
this target. The local registry fixture is contract evidence only and is not
promoted to productive availability.

## Authority and behavioral contract reconstruction

The accepted ADR, conformant SPEC, validated Gap Matrix, approved plan, ticket,
and implementation design establish these observable obligations:

1. Parse and classify semantic versions with observable major/minor/patch
   meaning; resolve only explicit supported versions and reject unsupported
   versions as `INCOMPATIBLE_CAPABILITY` without aliasing or conversion.
2. Resolve a complete stage/capability mapping deterministically against a
   frozen basis, including schemas, artifacts, verdicts and role restrictions.
3. Keep NORMAL catalogs repository-scoped and BOOTSTRAP catalogs independent and
   system-scoped; reject a normal capability in BOOTSTRAP before work.
4. Preserve distinct `UNKNOWN_CAPABILITY`, `INCOMPATIBLE_CAPABILITY` and
   `CONTRACT_INVALID` outcomes, with no approval and no mutation on failures.
5. Register a schema-authenticated synthetic capability through the common
   registry path and publish a new immutable basis without changing an older
   basis.
6. At the integrated boundary, consume producer-issued DOM/REPO authority,
   exact scope and frozen catalog revision, and reject forged, copied, stale,
   detached or substituted source material. This is an integrated proof
   obligation, not a local closure blocker for this ticket.

### Applicability matrix

| Behavioral dimension | Classification | Reason and inspection result |
|---|---|---|
| `UNIT_BEHAVIOR` | REQUIRED | Version objects, explicit support sets, entries, basis and resolver are the local implementation unit; directly exercised. |
| `INTEGRATION_BEHAVIOR` | AFFECTED | The application consumes DOM and REPO source ports. No productive foreign producer exists at the target, so only fail-closed seams can be exercised locally. |
| `PERSISTENCE` | NOT_APPLICABLE | Physical persistence, serialized material and semantic reconstruction are TICKET-003/PLAT scope; this ticket owns in-process immutable bases only. |
| `CONCURRENCY` | AFFECTED | Duplicate/create-only behavior is local, while physical concurrent publication/CAS is explicitly integrated-only and is not proven here. |
| `STALE_STATE` | AFFECTED | Application checks exact source catalog revision, but a productive source-issued stale-basis witness is unavailable. |
| `IDEMPOTENCY` | REQUIRED | Duplicate/conflicting registration must fail without mutating the prior basis; direct tests execute this. |
| `DURABILITY` | NOT_APPLICABLE | No durable write or completion claim is made by this ticket. |
| `RECOVERY` | NOT_APPLICABLE | Restart, replay and physical recovery belong to PLAT/TICKET-003 and are not implemented here. |
| `COMPATIBILITY` | REQUIRED | Semver, explicit support sets, catalog scope and canonical failure outcomes are owned by this ticket; direct tests execute them. |
| `MIGRATION_BEHAVIOR` | NOT_APPLICABLE | The allowlist names migration as an admissible bootstrap category, but migration execution and legacy adaptation are not implemented by this ticket. |
| `NEGATIVE_PATHS` | REQUIRED | Invalid entries, duplicate/conflicting entries, unsupported versions, unknown capability, wrong scope, bootstrap leakage, forged inputs and unavailable sources are required fail-closed paths. |

## Production semantic audit

### Local behavior classifications

| Required behavior | Classification | Production evidence and observed semantics |
|---|---|---|
| Semantic version parsing/comparison and change classification | `IMPLEMENTED_CORRECTLY` locally | `src/domain/exec-registry.ts:105-171` parses exact SemVer components, compares large decimal components without numeric coercion, handles prerelease precedence, and treats build-only comparison as equal. `SupportedVersionSet` at `178-215` requires authenticated explicit exact members. |
| Complete immutable registry entry | `IMPLEMENTED_CORRECTLY` locally | `RegistryEntry.create` at `365-395` authenticates both schema references, validates category/version support and all required mapping fields, freezes arrays and the entry. |
| Frozen-basis deterministic resolution | `IMPLEMENTED_CORRECTLY` locally | `CatalogBasis.register` at `489-504` returns a new basis and rejects an existing immutable identity. `RegistryResolutionService.resolveInternal` at `697-735` filters capability, stage, schema and explicit version, then returns the complete entry or canonical failure. Candidate ordering is deterministic at `715-724`. |
| NORMAL/BOOTSTRAP separation | `PARTIAL` | `CatalogScope` at `249-284` represents repository-scoped NORMAL and system-scoped BOOTSTRAP. `ResolveExecCapability` verifies source kind, source label, scope and revision at `91-159`; however, only local fixture sources are available in this repository and they are intentionally rejected by the productive application path. |
| Bootstrap allowlist before normal work | `IMPLEMENTED_CORRECTLY` locally | `BootstrapAllowlistPolicy` at `647-652` permits only the five declared onboarding categories; resolver rejection at `725-727` returns `INCOMPATIBLE_CAPABILITY`. The application selects only the bootstrap source for BOOTSTRAP and does not read the normal source at `91-103`. |
| Unknown/incompatible distinction and fail-closed results | `IMPLEMENTED_CORRECTLY` locally | `resolveInternal` returns `UNKNOWN_CAPABILITY` before compatibility filtering for a missing capability at `703-704`, and `INCOMPATIBLE_CAPABILITY` for stage/schema/version/role mismatch at `705-729`; failures carry `noMutation=true` and `noApproval=true` at `773-785`. Local failure results are intentionally non-authoritative fixture results. |
| Common-path synthetic extensibility and old-basis preservation | `IMPLEMENTED_CORRECTLY` locally | `CatalogBasis.register` uses the same `RegistryEntry` path for a synthetic capability and freezes/preserves the original entry list. The productive registration use case at `176-212` consumes a source-issued basis, but no productive source issuer exists at this target. |
| Productive authority consumption | `MISSING` for integrated proof, not a local closure failure | `src/application/exec-registry-ports.ts:48-73` can issue only receipts created by the local fixture helper; `82-106` exposes only local fixture constructors. `ResolveExecCapability` rejects local fixtures at `91-111`, and `RegisterExecCapability` rejects them at `191-193`. `createProducerBoundCatalogBasisProof` at `526-534` requires a producer-marked basis, but this repository has no productive producer issuance path. |

### Acceptance witness audit

The nine rows below are the approved design witness rows: seven primary local
acceptance behaviors plus the two explicitly owned contribution rows for
AC-EXEC-005 and AC-EXEC-007.

| # | Acceptance / required behavior | Direct positive witness | Direct negative/isolation witness | Local executable at closure | Result |
|---:|---|---|---|---|---|
| 1 | `AC-EXEC-003` semver major/minor/patch semantics | `parses semantic versions and preserves exact change semantics` asserts components, large values and change classes. | Unsupported/invalid semver is rejected by value construction and explicit-set tests. | YES | Direct local witness. |
| 2 | `AC-EXEC-004` explicit supported set | `resolves only authenticated explicit supported versions...` and exact compatible resolution. | Unsupported minor/major, shorthand and forged support set are rejected/no match. | YES | Direct local witness. |
| 3 | `AC-EXEC-008` complete deterministic mapping | `resolves a complete registered mapping...` asserts stage, skill, capability, input/output schemas, artifacts, verdicts, role, basis and version. | Incomplete, duplicate and conflicting registration fail without mutation; registration order test proves deterministic selection. | YES | Direct local witness. |
| 4 | `AC-EXEC-009` catalog isolation | Two NORMAL repository bases resolve their own entries and preserve distinct identities. | Cross-scope source substitution, copied receipts, matching-source forgery and direct basis injection fail closed at the application boundary. | YES for local contract; NO for productive producer | Local contract direct; integrated producer proof missing. |
| 5 | `AC-EXEC-010` bootstrap allowlist | DISCOVERY category resolves through the domain path. | NORMAL category in BOOTSTRAP returns `INCOMPATIBLE_CAPABILITY`; application test observes no normal-source read. | YES for local contract; NO for productive producer | Direct local contract witness. |
| 6 | `AC-EXEC-011` outcome distinction | Known compatible entry resolves. | Missing capability is `UNKNOWN_CAPABILITY`; known unsupported version and schema are `INCOMPATIBLE_CAPABILITY`; invalid source/context is `CONTRACT_INVALID`. | YES | Direct local witness. |
| 7 | `AC-EXEC-012` common registry extensibility | Synthetic entry registers and resolves through `RegistryEntry`/`CatalogBasis`. | Frozen basis remains unchanged; forged entry/basis and fixture publication are rejected. | YES for local contract | Direct local witness; productive registration proof is integrated-only. |
| 8 | Contributor `AC-EXEC-005` frozen-basis contribution | Registration returns a new basis and retains the old basis unchanged. | Duplicate/conflict and forged material fail without publication. | YES | Direct local contribution witness; final proof remains TICKET-005. |
| 9 | Contributor `AC-EXEC-007` failure classification | Registry supplies incompatible classification for unsupported version/schema. | Unknown, source and authority failures do not become approval and carry no-mutation/no-approval flags. | YES | Direct local contribution witness; final proof remains TICKET-004. |

```text
REQUIRED_BEHAVIORS_TOTAL = 9
DIRECT_BEHAVIOR_WITNESSES = 9 (local contract semantics)
PROXY_ONLY_BEHAVIORS = 0 for the declared local acceptance rows
UNTESTED_STATE_TRANSITIONS = 1 (productive source-bound resolution/basis binding)
UNPROVEN_CONCURRENCY_CONTRACTS = 1 (physical concurrent publication/CAS)
MISSING_ARCHITECTURE_GUARDS = 0
```

The local fixture witnesses are valid only for local contract semantics. They do
not prove productive DOM/REPO availability, physical CAS, persistence,
restart/recovery or external effects.

## Authority consumption and provenance audit

| Capability | Authority status | Contract status | Local testability | Productive availability | Dependency class | Summary / owner / evidence |
|---|---|---|---|---|---|---|
| `DOM-EXEC-IDENTITY-SNAPSHOT` | DEFINED | DEFINED | NO | NO | `REQUIRED_FOR_INTEGRATED_PROOF` | `CONTRACT_DEFINED`; owner `SPEC-DOM-001`; no productive DOM producer/receipt at target. |
| `REPO-EXEC-NORMAL-CATALOG` | DEFINED | DEFINED | NO | NO | `REQUIRED_FOR_INTEGRATED_PROOF` | `CONTRACT_DEFINED`; owner `SPEC-REPO-001`; no productive REPO producer/receipt at target. |
| `UNIT-EXEC-REGISTRY-FIXTURE` | DEFINED | DEFINED | YES | NO | `INFORMATIONAL` | `CONTRACT_TESTABLE_LOCALLY`; fixture is explicitly non-authoritative and cannot be promoted. |

### Anti-forgery and caller-as-authority checks

- Issuer ownership: the target contains no productive DOM or REPO issuer. Local
  fixture receipts are issued by a private fixture ledger and are rejected by
  the productive application path.
- Scope: application-side source kind, expected source label, authenticated
  scope and exact `CatalogRevision` are checked at
  `src/application/exec-registry.ts:137-159`.
- Consumer provenance: `isProducerIssuedCatalogBasisReceipt` uses private
  source/receipt `WeakMap` state at `src/application/exec-registry-ports.ts:126-139`;
  copied receipts and shape-only sources are rejected by direct tests.
- Forgery and caller injection: direct tests reject injected `basis`, forged
  scope/schema objects, copied receipts, matching-source forgeries, caller
  repository selection and caller-provided support-set authority.
- Mutation/stale policy: immutable local bases and duplicate registration are
  directly tested. A true productive source-issued stale/mutated receipt is not
  executable at this target.
- Alternate adapter contract: no productive alternate adapter can be issued a
  trusted receipt at this target; the required alternate productive-adapter
  compatibility witness is therefore missing for the integrated checkpoint.
- Caller-as-authority bypasses: `0` observed in the local executable paths.
  Caller-supplied basis is explicitly rejected, caller-selected repository
  mismatch is rejected, and caller support-set data is ignored. The
  `catalogRevision` input is used only as a source-basis consistency check; it
  does not itself mint a producer receipt.

`TEMPORAL_AUTHORITY_PROOF = NOT_APPLICABLE` for local closure: resolution reads
an immutable basis and commits no external effect. The integrated source-bound
basis and stale/mutation proof remain due at the integrated checkpoint.

## Test inventory and assertion quality

| Test category | Classification | Evidence |
|---|---|---|
| `UNIT` | `REQUIRED_TEST_PRESENT` | 25 focused ticket tests directly execute domain/application behavior. |
| `INVARIANT` | `REQUIRED_TEST_PRESENT` | Complete-entry, explicit-support, identity uniqueness, immutable basis and canonical outcome assertions. |
| `PERSISTENCE` | `TEST_CATEGORY_NOT_APPLICABLE` | Physical persistence/reconstruction is outside TICKET-002. |
| `INTEGRATION` | `REQUIRED_TEST_MISSING` | No productive DOM/REPO producer exists; local source fixtures are deliberately rejected. Integrated-only handoff remains open. |
| `CROSS_SPEC` | `REQUIRED_TEST_MISSING` | DOM/REPO authority, exact basis and alternate adapter proof cannot execute at this target. |
| `CONCURRENCY` | `REQUIRED_TEST_MISSING` | Sequential duplicate/no-mutation is present, but no physical concurrent publication/CAS witness exists; explicitly integrated-only. |
| `STALE` | `REQUIRED_TEST_MISSING` | Application code checks exact revision, but the available stale test fails at the local-fixture guard before exercising revision mismatch. |
| `IDEMPOTENCY` | `REQUIRED_TEST_PRESENT` | Duplicate/conflicting registration and old-basis preservation are directly asserted. |
| `RECOVERY` | `TEST_CATEGORY_NOT_APPLICABLE` | Restart/replay/recovery is outside this ticket. |
| `COMPATIBILITY` | `REQUIRED_TEST_PRESENT` | Semver, exact support sets, scope isolation and canonical outcome distinctions are directly asserted. |
| `MIGRATION` | `TEST_CATEGORY_NOT_APPLICABLE` | Bootstrap category data is tested only as an allowlist value; migration execution is outside scope. |
| `NEGATIVE_PATH` | `REQUIRED_TEST_PRESENT` | Forgery, invalid, unavailable, duplicate, unsupported, unknown, incompatible and bootstrap leakage paths are asserted. |
| `ARCHITECTURE_GUARD` | `REQUIRED_TEST_PRESENT` | Static import guard plus a child-process loader rejects forbidden infrastructure imports; real graph is loaded and exercised. |
| `CONFORMANCE` | `REQUIRED_TEST_PRESENT` | Direct registry graph guard, governance guard and typecheck pass. |

```text
REQUIRED_TEST_CATEGORIES_INSPECTED = 11
REQUIRED_TESTS_PRESENT = 7
REQUIRED_TESTS_MISSING = 4 (INTEGRATION, CROSS_SPEC, CONCURRENCY, STALE; integrated-only or unavailable producer justification)
```

### Assertion-quality assessment

- **STRONG:** focused tests assert semantic result codes, complete mapping
  fields, exact versions, source/scope identity, no-mutation and no-approval
  flags, immutable old bases, forged inputs and architecture-loader behavior.
- **SUFFICIENT:** the domain fixture path proves local version, registry,
  catalog and extensibility semantics; fixture results are intentionally not
  branded as canonical authority.
- **WEAK/MISLEADING:** the stale scenario in the matching-source-forgery test
  uses a local fixture source and is rejected before the requested-revision
  comparison. Its `CONTRACT_INVALID` result cannot prove productive stale
  rejection. Several documentary evidence files also report old test counts
  and old target heads; see `BEH-MINOR-001`.
- **NON_ASSERTIVE:** none among the 25 focused ticket tests; no test was
  credited solely from a test name or absence of an exception.

## Test execution record

```text
TESTS_RUN = 73 (npm test: 27 workflow tests + 21 TICKET-001 tests + 25 TICKET-002 tests)
TESTS_PASSED = 73
TESTS_FAILED = 0
TESTS_SKIPPED = 0
ENVIRONMENTAL_FAILURES = 0
FOCUSED_TICKET_TESTS = 25/25
TICKET-001_REGRESSION = 21/21
WORKFLOW_REGRESSION_SUITE = 27/27
TYPECHECK = PASS (npm run typecheck)
GOVERNANCE_GUARD = PASS (npm run verify:audit-governance)
SKILL_MIRROR_GUARD = PASS (npm run verify:skill-mirror)
DIFF_CHECK = PASS (git diff --check)
UNEXECUTED_INTEGRATED_PROOF = productive DOM/REPO source and alternate-adapter tests; no producer exists at target, not an environmental failure
```

## Regression safety

`IMPLEMENTATION_BASELINE` is the ticket's recorded implementation baseline
`8f62b283...`; the pinned target is the later audit checkpoint
`49b4448...`. The directly affected TICKET-001 suite remained 21/21, the
workflow regression suite remained 27/27, typecheck passed, and the complete
package test command passed 73/73. No regression was observed in the affected
existing contract or workflow surfaces.

```text
REGRESSION_RESULT = NO_REGRESSION
REGRESSIONS = 0
```

## Conditional dimensions

### Concurrency — `PARTIAL`

The immutable `CatalogBasis.register` operation and sequential duplicate/conflict
rejection are directly correct and leave the prior basis unchanged. The
implementation explicitly does not own physical concurrent publication or CAS,
and no interleaving/one-winner test can run without the integrated producer.
The physical contract is therefore unproven at the integrated checkpoint, not a
local closure blocker.

### Stale state — `PARTIAL`

`ResolveExecCapability.assertAuthorizedBasis` rejects a source basis whose
scope or `CatalogRevision` does not equal the requested execution context, and
checks expected source kind/label. However, no productive source exists to
exercise this branch, and the available stale-named test is rejected at the
local-fixture guard first. No silent local basis mutation was observed.

### Idempotency — `CONFORMANT` locally

Registration is create-only. Duplicate or conflicting registration throws a
`CONTRACT_INVALID` domain error, and the original basis identity and entry set
remain unchanged. Physical retry/winner behavior remains integrated-only.

### Durability/persistence — `NOT_APPLICABLE`

No durable identity or persistence completion claim is made by TICKET-002.

### Recovery — `NOT_APPLICABLE`

Restart, replay, interrupted operation and physical recovery are explicitly
owned by later PLAT/TICKET-003 work.

### Compatibility/migration

Semver and explicit support compatibility are conformant locally. Migration is
not an implemented behavior here; only its bootstrap category is allowlisted.

## Findings

### BEH-MAJOR-001 — Productive DOM/REPO authority path is unavailable at the consumer

```text
severity = MAJOR
ticket = EXEC-001-TICKET-002
requirements = EXEC-REGISTRY-001, EXEC-REGISTRY-002, EXEC-REGISTRY-003, EXEC-CAPABILITY-001, EXEC-CAPABILITY-002
acceptance = AC-EXEC-003, AC-EXEC-004, AC-EXEC-008, AC-EXEC-009, AC-EXEC-010, AC-EXEC-011, AC-EXEC-012 (integrated proof contribution)
category = CAPABILITY_AVAILABILITY_CONTRADICTION
capability = DOM-EXEC-IDENTITY-SNAPSHOT; REPO-EXEC-NORMAL-CATALOG
dependency_class = REQUIRED_FOR_INTEGRATED_PROOF
LOCAL_CLOSURE_BLOCKING = NO
LOCAL_ACCEPTANCE_REQUIRES_PRODUCTIVE_CAPABILITY = NO
DEPENDENCY_CLASS_RECLASSIFICATION_REQUIRED = NO
UPSTREAM_DEPENDENCY_CLASSIFICATION_PRESERVED = YES
BLOCKS_LOCAL_EXECUTION = NO
BLOCKS_LOCAL_CLOSURE = NO
BLOCKS_TICKET_DONE = NO
BLOCKS_INTEGRATED_PROOF = YES
BLOCKS_SPEC_FINAL_CONFORMANCE = YES
PRIMARY_ROUTE = IMPLEMENTATION_PLAN_REVALIDATION
DOWNSTREAM_CHECKPOINT = integrated DOM/REPO/EXEC registry proof
DOWNSTREAM_OWNER = SPEC-DOM-001 and SPEC-REPO-001 producers with the EXEC integration checkpoint
ROOT_CAUSE_CAMPAIGN_ID = RCC-EXEC-REGISTRY-PRODUCTIVE-AUTHORITY-001
Systemic pattern = YES
```

- **Required behavior:** A productive DOM execution-basis producer and
  productive REPO normal-catalog producer must issue owner-bound basis receipts
  consumable by `ResolveExecCapability`; local fixtures must not be promoted as
  those producers.
- **Production evidence:** `src/application/exec-registry-ports.ts:48-73`
  implements receipt issuance only inside `createLocalSourceFixture`; exported
  constructors at `82-106` mark sources local. The application rejects local
  sources at `src/application/exec-registry.ts:91-111`, while registration
  rejects them at `191-193`. The only producer proof constructor at
  `src/domain/exec-registry.ts:526-534` requires a producer-marked basis, but no
  productive source creates such a basis in the target.
- **Test evidence:** The 25 focused tests pass. Positive local domain tests use
  `resolveContractFixture`, whose results are intentionally unbranded; the
  application tests prove that local fixtures, copied receipts, matching-source
  forgeries and untrusted adapters are rejected. There is no positive
  productive DOM/REPO resolution test.
- **Observed result:** Local semantic behavior is executable and correct, but
  no source available in the repository can produce a successful canonical
  application resolution. Productive availability remains `NO`.
- **Expected result:** At the integrated checkpoint, owner-issued producer
  receipts and positive resolution must be executable, with direct forged,
  stale/mutated, caller-injection and alternate-adapter witnesses.
- **Problem:** Contract-level fixtures prove only local semantics. The
  integrated authority consumption contract cannot be consumed or verified at
  this target.
- **Impact:** Integrated proof of exact DOM/REPO authority and a canonical
  productive resolution result cannot complete. This does not block the local
  ticket gate because the approved dependency class is integrated-only.
- **Minimum correction required:** Add the owner-controlled productive
  issuance/adapter seam at its owning integration boundary, then execute
  positive and negative producer/consumer tests. Preserve the existing local
  fixture distinction and do not promote a fixture, mock or in-memory basis.

### BEH-MAJOR-002 — Normal catalog is checked by scope/revision, not exact frozen-basis identity

```text
severity = MAJOR
ticket = EXEC-001-TICKET-002
requirements = EXEC-REGISTRY-001, EXEC-REGISTRY-002, EXEC-CAPABILITY-001
acceptance = AC-EXEC-008, AC-EXEC-009, AC-EXEC-011
category = AUTHORITY_CONSUMPTION_GAP
capability = DOM-EXEC-IDENTITY-SNAPSHOT; REPO-EXEC-NORMAL-CATALOG
dependency_class = REQUIRED_FOR_INTEGRATED_PROOF
LOCAL_CLOSURE_BLOCKING = NO
LOCAL_ACCEPTANCE_REQUIRES_PRODUCTIVE_CAPABILITY = NO
DEPENDENCY_CLASS_RECLASSIFICATION_REQUIRED = NO
UPSTREAM_DEPENDENCY_CLASSIFICATION_PRESERVED = YES
BLOCKS_LOCAL_EXECUTION = NO
BLOCKS_LOCAL_CLOSURE = NO
BLOCKS_TICKET_DONE = NO
BLOCKS_INTEGRATED_PROOF = YES
BLOCKS_SPEC_FINAL_CONFORMANCE = YES
PRIMARY_ROUTE = IMPLEMENTATION_PLAN_REVALIDATION
DOWNSTREAM_CHECKPOINT = integrated exact-basis/source-binding proof
DOWNSTREAM_OWNER = EXEC integration owner with DOM and REPO producers
ROOT_CAUSE_CAMPAIGN_ID = RCC-EXEC-REGISTRY-PRODUCTIVE-AUTHORITY-001
Systemic pattern = YES
```

- **Required behavior:** NORMAL resolution must consume the exact frozen
  catalog basis associated with the DOM execution basis; a different basis with
  the same repository scope and revision must fail closed rather than being
  substituted.
- **Production evidence:** `src/application/exec-registry.ts:114-159` obtains
  separate DOM and REPO receipts. The only cross-source binding at
  `130-132` compares `scope.equals(...)` and `catalogRevision.equals(...)`.
  `CatalogBasis` has no content digest or producer-issued basis-reference
  comparison in this path; source label is checked, but source label is not
  content identity.
- **Test evidence:** Local tests cover cross-scope substitution, copied
  receipts and source-kind forgery. No productive alternate source can be
  instantiated, and no test supplies two owner-issued bases with equal
  scope/revision but different content to verify rejection.
- **Observed result:** Static implementation evidence shows only scope and
  numeric revision are compared between DOM and REPO bases. The required
  same-scope/same-revision content-substitution behavior is unproven and the
  current consumer has no exact basis/digest binding check.
- **Expected result:** Producer-issued basis identity/content digest or an
  equivalent independently verified frozen-basis reference must be compared;
  same scope/revision with divergent content must return `CONTRACT_INVALID`
  without resolution or mutation.
- **Problem:** A future productive source could supply a distinct basis under
  the same scope and revision and pass the current application binding check.
- **Impact:** Integrated consumers could resolve against catalog material that
  is not the execution's frozen basis, undermining canonical version and
  capability authority.
- **Minimum correction required:** Define and consume an owner-issued exact
  basis identity/digest/reference at the integrated boundary, and add direct
  same-scope/same-revision divergent-basis, stale/mutation and alternate-source
  negative witnesses. This is an integrated-proof correction, not a local
  dependency reclassification.

### BEH-MAJOR-003 — Productive stale-revision behavior has no direct witness

```text
severity = MAJOR
ticket = EXEC-001-TICKET-002
requirements = EXEC-REGISTRY-001, EXEC-REGISTRY-002, EXEC-CAPABILITY-001
acceptance = AC-EXEC-008, AC-EXEC-009, AC-EXEC-011
category = REQUIRED_BEHAVIOR_UNPROVEN
capability = DOM-EXEC-IDENTITY-SNAPSHOT; REPO-EXEC-NORMAL-CATALOG
dependency_class = REQUIRED_FOR_INTEGRATED_PROOF
LOCAL_CLOSURE_BLOCKING = NO
LOCAL_ACCEPTANCE_REQUIRES_PRODUCTIVE_CAPABILITY = NO
DEPENDENCY_CLASS_RECLASSIFICATION_REQUIRED = NO
UPSTREAM_DEPENDENCY_CLASSIFICATION_PRESERVED = YES
BLOCKS_LOCAL_EXECUTION = NO
BLOCKS_LOCAL_CLOSURE = NO
BLOCKS_TICKET_DONE = NO
BLOCKS_INTEGRATED_PROOF = YES
BLOCKS_SPEC_FINAL_CONFORMANCE = YES
PRIMARY_ROUTE = IMPLEMENTATION_PLAN_REVALIDATION
DOWNSTREAM_CHECKPOINT = integrated stale/mutation source proof
DOWNSTREAM_OWNER = DOM/REPO producer owners with EXEC consumer validation
ROOT_CAUSE_CAMPAIGN_ID = RCC-EXEC-REGISTRY-PRODUCTIVE-AUTHORITY-001
Systemic pattern = YES
```

- **Required behavior:** A stale or mutated producer-issued basis must be
  rejected as `CONTRACT_INVALID` before resolution, with the prior frozen state
  unchanged.
- **Production evidence:** The comparison exists at
  `src/application/exec-registry.ts:152-154`, but it is reachable only after
  an authenticated productive receipt passes the source guard. At
  `91-111`, all available local fixture sources are rejected before their
  `read()` result can exercise this branch.
- **Test evidence:** The stale case in the matching-source-forgery test uses a
  local fixture source; the application returns `CONTRACT_INVALID` at the local
  fixture guard, not because the requested revision differs. No productive
  stale/mutation test ran because no productive source exists.
- **Observed result:** The implementation contains a fail-closed revision
  check, but the required productive stale transition is not directly
  witnessed. The available test is therefore insufficient for this behavior.
- **Expected result:** A genuine source-issued stale or mutated receipt reaches
  the revision/content validation and is rejected without changing the prior
  basis or producing a resolved result.
- **Problem:** The test result is a proxy for the stale contract and cannot
  distinguish fixture rejection from stale-state rejection.
- **Impact:** Integrated temporal/source correctness remains unproven; a stale
  producer path could regress without being caught by the current suite.
- **Minimum correction required:** Add a productive or owner-approved contract
  harness that issues a valid receipt for an older/mutated basis and directly
  asserts the stale rejection and state-preservation semantics.

### BEH-MINOR-001 — Completion evidence records are stale relative to the pinned target

```text
severity = MINOR
ticket = EXEC-001-TICKET-002
requirements = EXEC-VERSION-001, EXEC-VERSION-002, EXEC-REGISTRY-001, EXEC-REGISTRY-002, EXEC-REGISTRY-003, EXEC-CAPABILITY-001, EXEC-CAPABILITY-002
acceptance = AC-EXEC-003, AC-EXEC-005, AC-EXEC-007, AC-EXEC-009, AC-EXEC-010, AC-EXEC-011, AC-EXEC-012
category = EXECUTABLE_EVIDENCE_TRACEABILITY
capability = UNIT-EXEC-REGISTRY-FIXTURE
dependency_class = INFORMATIONAL
LOCAL_CLOSURE_BLOCKING = NO
LOCAL_ACCEPTANCE_REQUIRES_PRODUCTIVE_CAPABILITY = NO
DEPENDENCY_CLASS_RECLASSIFICATION_REQUIRED = NO
UPSTREAM_DEPENDENCY_CLASSIFICATION_PRESERVED = YES
BLOCKS_LOCAL_EXECUTION = NO
BLOCKS_LOCAL_CLOSURE = NO
BLOCKS_TICKET_DONE = NO
BLOCKS_INTEGRATED_PROOF = NO
BLOCKS_SPEC_FINAL_CONFORMANCE = NO
PRIMARY_ROUTE = IMPLEMENTATION_REMEDIATION
DOWNSTREAM_CHECKPOINT = local completion-evidence refresh
DOWNSTREAM_OWNER = EXEC-001-TICKET-002 evidence owner
ROOT_CAUSE_CAMPAIGN_ID = NOT_APPLICABLE
Systemic pattern = NO
```

- **Required behavior:** Evidence records used for closure must identify the
  target and accurately report the executed focused and regression suites.
- **Production evidence:** No production semantic defect is implied by this
  finding; the pinned target code and tests execute successfully.
- **Test/evidence evidence:** The current target independently produced
  `25/25` focused TICKET-002 tests and `73/73` for `npm test`. The evidence
  files for AC-EXEC-003, AC-EXEC-005, AC-EXEC-007, AC-EXEC-009,
  AC-EXEC-010, AC-EXEC-011 and AC-EXEC-012 still report `23/23` focused and
  `71/71` full-suite output and reference older remediation/audit targets.
  AC-EXEC-008 contains the newer `25/25` and `73/73` counts but also records an
  older target basis.
- **Observed result:** The executable behavior passes at the pinned target,
  but several documentary evidence records are not a faithful snapshot of this
  target.
- **Expected result:** Each completion evidence file should be regenerated or
  explicitly superseded with the pinned target head/fingerprint and its actual
  command output.
- **Problem:** Stale counts and target lineage weaken independent traceability
  and can make a future audit consume the wrong execution record.
- **Impact:** Minor auditability/maintenance risk; independently rerun tests
  remove any claim that the implementation itself failed.
- **Minimum correction required:** Refresh the affected evidence records or
  attach an explicit target-scoped supersession record. No production-code
  correction is required for this finding.

## Root-cause campaign

```text
ROOT_CAUSE_CAMPAIGN_ID = RCC-EXEC-REGISTRY-PRODUCTIVE-AUTHORITY-001
ROOT_CAUSE_ID = productive owner-bound catalog authority and exact source-basis binding are not executable at the consumer target
CAMPAIGN_STATUS = OPEN
CAMPAIGN_SCOPE = EXEC-001-TICKET-002 integrated DOM/REPO registry-consumer proof
CANONICAL_FINDINGS = BEH-MAJOR-001, BEH-MAJOR-002, BEH-MAJOR-003
CAMPAIGN_MATRIX_COMPLETE = YES
ALL_SURFACE_ROWS_COVERED = YES
ALL_NEGATIVE_WITNESSES_PASS = NO (productive positive/stale witnesses unavailable)
NO_UNEXPLAINED_PUBLIC_AUTHORITY_PATH = YES for local paths; productive issuer path remains absent
NO_HIDDEN_CONCRETE_PROTOCOL = YES
ROOT_CAUSE_REMOVED = NO
KNOWN_MANIFESTATIONS_CLOSED = NO
SYSTEMIC_TEST_EVIDENCE = PARTIAL (local negative witnesses present; integrated producer witnesses absent)
```

| Surface row | Class | Location/owner | Current behavior | Expected behavior | Coverage / negative witness |
|---|---|---|---|---|---|
| RCC-001 | ISSUER | DOM execution-basis producer; `SPEC-DOM-001` | No productive issuer available in target. | DOM issues owner-bound exact execution basis. | `MISSING`; NW-001 unavailable. |
| RCC-002 | ISSUER | REPO normal-catalog producer; `SPEC-REPO-001` | No productive issuer available in target. | REPO issues owner-bound NORMAL catalog material. | `MISSING`; NW-001 unavailable. |
| RCC-003 | REGISTRAR | `RegisterExecCapability`, `src/application/exec-registry.ts:176-212` | Consumes a source-issued receipt but cannot receive one from a productive target source. | Registration uses an owner-issued basis and publishes a verified new basis. | `MISSING` integrated; local fixture publication rejection covered by NW-002. |
| RCC-004 | CONSUMER | `ResolveExecCapability`, `src/application/exec-registry.ts:63-159` | Verifies source receipt, source kind, label, scope and revision; no exact content-basis binding. | Verify producer provenance and exact frozen basis identity/content. | `MISSING` exact binding; NW-003 local negative only. |
| RCC-005 | ALTERNATE_AUTHORITY_PATH | `resolveContractFixture`, `createCatalogBasisFixture` | Explicitly untrusted local contract path; cannot cross productive application seam. | Alternate adapters must satisfy the same producer proof. | `COVERED` local separation; NW-004. |
| RCC-006 | INJECTION_POINT | `ResolveExecCapability.resolve` input and source ports | Direct basis, forged scope/schema, copied receipt and caller source injection fail. | Caller values cannot mint authority. | `COVERED`; NW-005. |
| RCC-007 | MUTATION_PATH | `CatalogBasis.register`, `src/domain/exec-registry.ts:489-504` | New basis publication is immutable; duplicate/conflict leaves old basis unchanged. | No in-place frozen-basis mutation. | `COVERED`; NW-006. |
| RCC-008 | STALE_PATH | `assertAuthorizedBasis`, `src/application/exec-registry.ts:148-159` | Revision check exists but no productive stale receipt can reach it. | Stale/mutated producer material fails closed. | `MISSING` integrated; NW-007 is a proxy only. |
| RCC-009 | PORT_SUBSTITUTION_PATH | `exec-registry-ports.ts:126-139` | Shape-only/custom sources and copied receipts are rejected. | Alternate source must carry same proof contract. | `COVERED` negatives; NW-008. |
| RCC-010 | PUBLIC_EXPORT | exported fixture constructors and domain factories | Public local fixture factories are clearly non-authoritative; no productive issuer export exists. | Public surface must not expose caller-mintable authority; productive owner seam must be added at integration boundary. | `COVERED` local anti-forgery; integrated issuer `MISSING`; NW-009. |
| RCC-011 | PERSISTENCE | TICKET-003/PLAT boundary | Physical persistence intentionally outside TICKET-002. | Later owner proves durable basis/digest/reconstruction. | `OUTSIDE_SCOPE` with TICKET-003/PLAT route. |
| RCC-012 | RETRY_RECOVERY | TICKET-003/PLAT boundary | No recovery path in this ticket. | Later owner proves retry/restart identity preservation. | `OUTSIDE_SCOPE` with TICKET-003/PLAT route. |
| RCC-013 | LEGACY_ROUTE | REPO legacy compatibility boundary | No legacy registry write or silent conversion in this ticket. | Legacy remains a consumer, not authority. | `OUTSIDE_SCOPE` with REPO route. |
| RCC-014 | ARCHITECTURE_GUARD | `tests/exec-registry-import-boundary-loader.mjs`, focused tests | Forbidden import guard and real graph guard pass. | Registry graph remains free of infrastructure/prototype/transport authority. | `COVERED`; NW-010. |
| RCC-015 | TEST | `tests/exec-001-ticket-002.test.ts` | 25 local tests pass; no productive positive/stale source tests. | Integrated producer/consumer and stale tests at downstream checkpoint. | `MISSING` integrated; NW-011 local set passes. |

Negative witness notes: NW-001 = no productive issuer witness exists; NW-002 =
local fixture publication rejection; NW-003 = direct basis/source/caller injection
rejections; NW-004 = untrusted fixture results do not authenticate; NW-005 = forged
scope/schema and copied receipts reject; NW-006 = duplicate/conflict/no-mutation;
NW-007 = stale-named test only reaches local-fixture rejection; NW-008 = copied
receipt/custom source/DOM substitution rejection; NW-009 = public fixture is
non-authoritative; NW-010 = forbidden-import loader; NW-011 = focused local suite.

## Specialist conclusion

The local semantic implementation is behaviorally correct for the declared
contract-fixture scope, with strong negative-path and no-mutation assertions and
no observed regression. The integrated authority dimensions are not consumed
or directly proven: productive DOM/REPO issuer availability, exact cross-source
basis identity, productive stale rejection and physical concurrency remain open
at their approved integrated checkpoint. These findings preserve the upstream
`REQUIRED_FOR_INTEGRATED_PROOF` classification and do not silently convert it
into a local blocker. Documentary evidence count/lineage drift is a separate
minor finding.

Audit: `.pi/runtime/workflow-audits/ad04b7aa-49bd-4936-953d-b2f673ece285/behavior-EXEC-001-TICKET-002-implementation-behavior-audit.md`

Specialist:
IMPLEMENTATION_BEHAVIOR

Ticket: EXEC-001-TICKET-002

Required behavioral dimensions: 7

Required tests: 11

Required tests missing: 4

Required behaviors total: 9

Direct behavior witnesses: 9

Proxy-only behaviors: 0

Untested state transitions: 1

Unproven concurrency contracts: 1

Missing architecture guards: 0

Tests run: 73

Tests passed: 73

Tests failed: 0

Regressions: 0

Concurrency:
PARTIAL

Stale behavior:
PARTIAL

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
MAJOR=3
MINOR=1
INFO=0

Domain audit complete:
YES

Specialist result:
SPECIALIST_BEHAVIOR_FINDINGS

AUDIT_TARGET_HEAD: 49b4448ba10ee9aa9d3ce7d47b139de474a482ba
AUDIT_TARGET_STATE_FINGERPRINT: 7983511cf1e9833261f61e43cdb252de0ed59fb330fcef75d6c03755f24f9a4d
AUDIT_WAVE_ID: ad04b7aa-49bd-4936-953d-b2f673ece285
DOMAIN_AUDIT_COMPLETE: YES
SPECIALIST_RESULT: SPECIALIST_BEHAVIOR_FINDINGS
