# Implementation Behavior Audit — EXEC-001-TICKET-002

Audit mode: `READ_ONLY · INDEPENDENT · ADVERSARIAL · BEHAVIOR_FIRST · TEST_ASSERTION_AWARE · NEGATIVE_PATH_AWARE · REGRESSION_AWARE`

## 1. Inputs and audit basis

```text
TICKET_ID: EXEC-001-TICKET-002
TICKET_PATH: docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-version-registry-catalogs-capabilities.md
IMPLEMENTATION_UNIT: EXEC-IMP-02 — Version, registry resolution, catalogs and capability extensibility
REQUIREMENT_IDS: EXEC-VERSION-001, EXEC-VERSION-002, EXEC-REGISTRY-001, EXEC-REGISTRY-002, EXEC-REGISTRY-003, EXEC-CAPABILITY-001, EXEC-CAPABILITY-002
ACCEPTANCE_IDS: AC-EXEC-003, AC-EXEC-004, AC-EXEC-008, AC-EXEC-009, AC-EXEC-010, AC-EXEC-011, AC-EXEC-012
SPEC_PATH: docs/specs/SPEC-EXEC-001-skill-contracts-and-capability-registry.md
GAP_MATRIX_PATH: docs/specs/gap-matrices/SPEC-EXEC-001-implementation-gap-matrix.md
IMPLEMENTATION_PLAN_PATH: docs/specs/implementation-plans/SPEC-EXEC-001-implementation-plan.md
IMPLEMENTATION_BASELINE: 8f62b283b1dbf487911c7c459db95cadc25ff101
CURRENT_HEAD: 6dbff481eaf9bf21ac1aa7ae61f06a32f6dabfa8
AUDIT_TARGET_HEAD: 6dbff481eaf9bf21ac1aa7ae61f06a32f6dabfa8
AUDIT_TARGET_STATE_FINGERPRINT: ef07d1b9a20b8529b47f6ace6430da84da76e05ec35d2cb0bdea678314fd481a
WORKTREE_AT_AUDIT: clean; AUDIT_TARGET_HEAD = CURRENT_HEAD
```

Authority chain reconstructed from the accepted ADR, SPEC, validated Gap Matrix,
Plan, ticket, Design, repository code, and executable tests. The approved local
scope is immutable in-process version/registry/catalog behavior. DOM and REPO
producer capabilities are explicitly `REQUIRED_FOR_INTEGRATED_PROOF`, not local
closure dependencies. No sibling specialist audit artifact was used.

### Changed scope and relevant suites

Ticket-declared production files:

- `src/domain/exec-registry.ts`
- `src/application/exec-registry.ts`
- `src/application/exec-registry-ports.ts`
- `src/composition/exec-registry.ts`

Ticket-declared test files:

- `tests/exec-001-ticket-002.test.ts`
- `tests/exec-registry-import-boundary-loader.mjs`
- `tests/fixtures/exec-registry-forbidden-import.mjs`

Relevant evidence files are under `docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/`.

## 2. Behavioral contract reconstruction

The ticket owns explicit semver/support-set resolution, complete deterministic
entry mapping, independent NORMAL/BOOTSTRAP catalog scope, bootstrap allowlisting,
canonical unknown/incompatible outcomes, and common-path synthetic registration.
It contributes frozen-basis and failure-classification evidence to downstream
owners. It does not own DOM identity/lifecycle, REPO enablement, physical
persistence/CAS, restart recovery, or external effects.

| Dimension | Classification | Required inspection and result |
|---|---|---|
| UNIT_BEHAVIOR | REQUIRED | Domain values, policies, registration and resolution inspected. Local semantics conform. |
| INTEGRATION_BEHAVIOR | AFFECTED | Application source/provenance seam inspected; no productive DOM/REPO producer exists at target. |
| PERSISTENCE | AFFECTED | Immutable basis publication inspected; durable storage/reconstruction is outside this ticket. |
| CONCURRENCY | AFFECTED | Local create-only branching inspected; physical one-winner CAS is integrated-only and unproven. |
| STALE_STATE | AFFECTED | Scope/revision/source mismatch rejection inspected at application seam. Persistent stale reconstruction is outside this ticket. |
| IDEMPOTENCY | REQUIRED | Duplicate/conflicting registration and old-basis preservation directly tested. |
| DURABILITY | NOT_APPLICABLE | No durable operation or completion claim is implemented in this ticket. |
| RECOVERY | NOT_APPLICABLE | Restart/replay/recovery is explicitly PLAT/TICKET-003 or later scope. |
| COMPATIBILITY | REQUIRED | Exact support membership, no alias/conversion, and frozen-basis compatibility inspected. |
| MIGRATION_BEHAVIOR | AFFECTED | Bootstrap migration category is represented by the allowlist; migration execution is foreign. |
| NEGATIVE_PATHS | REQUIRED | Invalid, unknown, incompatible, duplicate, forged, stale, wrong-source and no-mutation paths inspected. |

Required/affected behavioral dimensions inspected: **9**.

## 3. Production behavior classification

| Behavior | Production evidence | Classification | Observed semantics |
|---|---|---|---|
| Semver parsing, comparison and change classification | `src/domain/exec-registry.ts:99-176`; reuse of strict `isSemanticVersion` | IMPLEMENTED_CORRECTLY | Exact decimal components, prerelease ordering, build-only `NONE`, and major/minor/patch classification are implemented without numeric precision loss. |
| Explicit support sets | `src/domain/exec-registry.ts:178-217,635-644` | IMPLEMENTED_CORRECTLY | Only authenticated exact members resolve; duplicates, malformed versions, ranges and approximation are rejected/absent. |
| Complete deterministic entry mapping | `src/domain/exec-registry.ts:365-435,690-736` | IMPLEMENTED_CORRECTLY locally | Stage, skill, capability, schema, version, artifacts, verdicts and roles are selected deterministically from an immutable basis. |
| Immutable basis registration | `src/domain/exec-registry.ts:445-519` | IMPLEMENTED_CORRECTLY locally | Registration creates a new revision/basis; duplicate/conflicting keys and unsafe revision progression do not mutate the prior basis. |
| NORMAL/BOOTSTRAP separation | `CatalogScope`, `CatalogBasis`, application source selection at `src/application/exec-registry.ts:78-160` | IMPLEMENTED_CORRECTLY locally; PARTIAL integrated | Scope, source, repository and revision are checked. A productive source is unavailable at the pinned target. |
| Bootstrap allowlist and pre-work rejection | `BootstrapAllowlistPolicy` at `src/domain/exec-registry.ts:647-651`; application gate at `src/application/exec-registry.ts:91-103` | IMPLEMENTED_CORRECTLY for local semantic decision | Allowed categories resolve and NORMAL is incompatible in BOOTSTRAP. The application test's no-read assertion is source-fixture isolation, not a productive enablement witness. |
| Unknown/incompatible distinction | `src/domain/exec-registry.ts:703-729` | IMPLEMENTED_CORRECTLY locally | Unknown identity returns `UNKNOWN_CAPABILITY`; known stage/schema/version/role mismatch returns `INCOMPATIBLE_CAPABILITY`; failures carry no-approval/no-mutation flags. |
| Synthetic common-path extensibility | `CatalogBasis.register` and one resolver path | IMPLEMENTED_CORRECTLY locally | A schema-authenticated synthetic entry resolves through the same entry/basis path and leaves the old basis unchanged. |
| Caller/provenance resistance | Private domain token and instance ledgers at `src/domain/exec-registry.ts:7-13,86-95,521-632`; application receipt checks at `src/application/exec-registry-ports.ts:43-139` | IMPLEMENTED_CORRECTLY locally | Caller-created constructors, fixture proofs, copied receipts, fake sources, direct basis injection and public failure authority are rejected or remain untrusted. |
| Owner-issued productive authority | `src/application/exec-registry-ports.ts:43-73`; only local fixture issuers are available; application rejects fixtures at `src/application/exec-registry.ts:108-112,191-196` | MISSING at integrated checkpoint | No productive DOM/REPO source can issue the required owner-bound receipt/basis at this target. This is an accepted integrated-only availability gap, not a local fixture promotion. |
| Durable persistence/physical CAS | `CatalogBasis` is immutable in-process only; no storage or CAS path in the changed unit | PARTIAL | Local no-mutation behavior is present. Durable identity, restart, physical one-winner registration and recovery are not executable here. |

## 4. Acceptance witness audit

The ticket matrix has six primary rows; the approved Design expands this to nine
rows by retaining AC-EXEC-005 and AC-EXEC-007 contribution witnesses. All nine
local semantic operations have direct executable assertions. Fixture results are
correctly treated as local contract evidence, not durable or productive proof.

| Required behavior | Direct operation/test evidence | Negative/isolation evidence | Witness result |
|---|---|---|---|
| Semver/support set (`AC-EXEC-003/004`) | `tests/exec-001-ticket-002.test.ts:130-183,225-259` | Unsupported exact version, malformed set, duplicate set, no alias/range | DIRECT; local fixture/contract evidence |
| Complete deterministic mapping (`AC-EXEC-008`) | `:198-223,225-259` | Incomplete entry, duplicate/conflict, registration-order independence | DIRECT; local fixture/contract evidence |
| Catalog isolation (`AC-EXEC-009`) | `:282-305,406-450` | Two repositories, copied receipt, matching-source forgery, DOM substitute | DIRECT; local fixture/contract evidence |
| Bootstrap allowlist (`AC-EXEC-010`) | `:307-347` and direct allowlist policy | NORMAL category incompatible; application does not reach normal source | DIRECT for semantic rejection; application no-work aspect is integrated-only |
| Unknown/incompatible distinction (`AC-EXEC-011`) | `:349-368` | Unknown identity, unsupported version, incompatible schema | DIRECT; local fixture/contract evidence |
| Common extensibility (`AC-EXEC-012`) | `:370-382` | Forged entry/basis and frozen-basis mutation rejection | DIRECT; local fixture/contract evidence |
| Frozen-basis contribution (`AC-EXEC-005`) | `:263-280,370-382,471-487` | Duplicate/conflict and forged registration no mutation | DIRECT contribution; final proof remains downstream |
| Failure-classification contribution (`AC-EXEC-007`) | `:349-368,536-577` | No approval/no mutation and source failures | DIRECT contribution; final proof remains downstream |
| Architecture/import boundary | `:610-675` plus loader/forbidden fixture | Forbidden infrastructure/prototype/transport import rejected | DIRECT architecture guard |

```text
ACCEPTANCE_WITNESS_MATRIX_ROWS_RECONSTRUCTED = 9
REQUIRED_BEHAVIORS_TOTAL = 9
DIRECT_BEHAVIOR_WITNESSES = 9
PROXY_ONLY_BEHAVIORS = 0
UNTESTED_STATE_TRANSITIONS = 0 local
UNPROVEN_CONCURRENCY_CONTRACTS = 1 integrated physical one-winner/CAS contract
MISSING_ARCHITECTURE_GUARDS = 0
WITNESS_EXECUTABLE_AT_LOCAL_CLOSURE = YES for all nine local rows
```

The bootstrap application test does not prove a productive REPO enablement side
effect: local fixture sources are intentionally rejected before reading. The
allowlist code/result itself is directly asserted; productive pre-enable proof
belongs to the integrated checkpoint.

## 5. Required test inventory

| Category | Classification | Evidence/justification |
|---|---|---|
| UNIT | REQUIRED_TEST_PRESENT | Focused 25-test suite directly exercises values, policies and outcomes. |
| INVARIANT | REQUIRED_TEST_PRESENT | Complete-entry, unique-key, exact-support and immutable-basis assertions. |
| PERSISTENCE | REQUIRED_TEST_MISSING — integrated-only deferral | Physical persistence and reconstruction are outside this ticket; local in-memory evidence cannot prove them. |
| INTEGRATION | REQUIRED_TEST_MISSING — integrated-only deferral | No productive DOM/REPO producer exists at target; source receipt positive path is unavailable. |
| CROSS_SPEC | REQUIRED_TEST_MISSING — integrated-only deferral | DOM identity and REPO catalog producer witnesses remain downstream integrated checkpoints. |
| CONCURRENCY | REQUIRED_TEST_MISSING — integrated-only deferral | Local immutable branches were probed; physical CAS/one-winner evidence is absent. |
| STALE | REQUIRED_TEST_PRESENT | Scope, source and catalog revision mismatch are rejected in focused tests. |
| IDEMPOTENCY | REQUIRED_TEST_PRESENT | Duplicate/conflicting registration preserves the prior basis. |
| RECOVERY | TEST_CATEGORY_NOT_APPLICABLE | No durable/restart/replay behavior is owned here. |
| COMPATIBILITY | REQUIRED_TEST_PRESENT | Exact support membership and no conversion/alias behavior are asserted. |
| MIGRATION | REQUIRED_TEST_PRESENT | Bootstrap allowlist data and allowed/normal category outcomes are exercised; execution remains foreign. |
| NEGATIVE_PATH | REQUIRED_TEST_PRESENT | Invalid, forged, stale, wrong-source, duplicate and unavailable paths are asserted. |
| ARCHITECTURE_GUARD | REQUIRED_TEST_PRESENT | Static and loader guards execute against the real graph and forbidden fixture. |
| CONFORMANCE | REQUIRED_TEST_PRESENT | `verify:audit-governance` and `verify:skill-mirror` pass. |

Required test categories counted: **13**. Required test categories missing at
this target: **4**, all with accepted integrated-only justification and no local
closure block.

## 6. Assertion-quality assessment

Focused assertions are **STRONG**: they assert semantic fields and canonical
codes, compare old/new basis identity, verify no-approval/no-mutation flags,
exercise forged/caller-injected inputs, and execute the real import graph. They
do not rely on non-null, HTTP success, absence of exceptions, or duplicated
implementation logic as the sole correctness claim.

The application-level bootstrap no-read assertion is limited: it proves that a
fixture is rejected before source access, not that a productive REPO enablement
operation is prevented by the allowlist. This limitation is recorded as the
integrated-only handoff above, not promoted to a local fixture claim.

## 7. Negative and failure behavior

| Input/failure | Expected | Observed |
|---|---|---|
| Malformed/incomplete entry | Contract-invalid rejection, no basis mutation | `ExecRegistryDomainError` with `CONTRACT_INVALID`; prior basis unchanged. |
| Unsupported explicit version | `INCOMPATIBLE_CAPABILITY`, no alias/conversion | Observed with no approval/no mutation. |
| Unknown capability | `UNKNOWN_CAPABILITY` | Distinct code observed. |
| Known wrong stage/schema/role | `INCOMPATIBLE_CAPABILITY` | Distinct code observed. |
| Duplicate/conflicting key | `CONTRACT_INVALID`, no mutation | Domain exception code and unchanged basis observed. |
| NORMAL/BOOTSTRAP substitution | Fail closed, no source/basis substitution | `CONTRACT_INVALID` on fake/copy/wrong source and scope mismatch. |
| Stale catalog revision | Fail closed, no mutation | `CONTRACT_INVALID` from application source-bound revision check. |
| Caller basis/support-set injection | Caller cannot supply canonical authority | Direct basis rejected; caller support-set field is ignored. |
| Runtime constructor/proof forgery | No authenticated authority | Private-token and producer-membership checks reject forged construction/proof. |
| Retry/recovery after partial durable publication | Requires durable owner evidence | Not applicable locally; integrated physical recovery remains unproven. |

Malformed requested semver is currently classified as
`INCOMPATIBLE_CAPABILITY` by `src/domain/exec-registry.ts:709-714`. The accepted
contract clearly requires fail-closed behavior but does not assign a separate
canonical code for malformed version syntax; this is retained as an observation,
not a new finding.

## 8. Test execution record

Commands independently executed against the pinned target:

```text
node --experimental-strip-types --test tests/exec-001-ticket-002.test.ts
  25 tests, 25 passed, 0 failed, 0 skipped
node --experimental-strip-types --test tests/exec-001-ticket-001.test.ts
  21 tests, 21 passed, 0 failed, 0 skipped
npm test
  73 tests, 73 passed, 0 failed, 0 skipped
npm run typecheck
  PASS
npm run verify:audit-governance
  PASS
npm run verify:skill-mirror
  PASS
```

```text
TESTS_RUN = 73 unique tests in the full suite
TESTS_PASSED = 73
TESTS_FAILED = 0
TESTS_SKIPPED = 0
ENVIRONMENTAL_FAILURES = 0
FOCUSED_TICKET_TESTS = 25/25
TICKET-001_REGRESSION = 21/21
FULL_PACKAGE_SUITE = 73/73
```

The ticket implementation record and several older AC evidence files report
23 focused/71 full tests and older remediation heads. AC-EXEC-008 was refreshed
to 25/73, but the other records remain historical/stale relative to the pinned
implementation target. The independently executed current commands above are
the authoritative test evidence for this audit.

## 9. Regression result

`NO_REGRESSION` for the inspected implementation baseline. The focused suite,
TICKET-001 regression, full package suite, typecheck, governance guard and skill
mirror guard all pass. The target's additional authority hardening does not
weaken the local semantic assertions; it intentionally makes fixture results and
public failure construction non-authoritative.

## 10. Conditional runtime dimensions

```text
CONCURRENCY = PARTIAL
  Local immutable create-only branches are deterministic. Physical concurrent
  publication/CAS and one-winner behavior are unavailable and require integrated
  proof; Promise.all probing produced independent revision-2 branches rather than
  a shared durable winner.

STALE_BEHAVIOR = CONFORMANT locally
  Application checks source kind, scope and exact CatalogRevision; persistent
  stale/continuity reconstruction remains outside this ticket.

IDEMPOTENCY = CONFORMANT locally
  Duplicate/conflicting registration rejects and preserves the prior basis.

PERSISTENCE = PARTIAL
  Immutable in-process basis publication is correct; no durable identity,
  serialization, restart or physical CAS evidence exists.

DURABILITY = NOT_APPLICABLE locally
RECOVERY = NOT_APPLICABLE locally
COMPATIBILITY = CONFORMANT locally
  Explicit support sets reject unsupported versions without conversion or aliasing.
MIGRATION = CONFORMANT locally for allowlist classification
```

### Authority consumption and temporal validation

| Capability | Authority/contract | Local testability | Productive availability | Dependency class | Result |
|---|---|---:|---:|---|---|
| `DOM-EXEC-IDENTITY-SNAPSHOT` | SPEC-DOM-001 producer-bound execution basis consumed by `ResolveExecCapability` | NO | NO | REQUIRED_FOR_INTEGRATED_PROOF | DEFINED_BUT_NOT_CONSUMABLE at integrated checkpoint |
| `REPO-EXEC-NORMAL-CATALOG` | SPEC-REPO-001 enabled NORMAL catalog consumed by `ResolveExecCapability` | NO | NO | REQUIRED_FOR_INTEGRATED_PROOF | DEFINED_BUT_NOT_CONSUMABLE at integrated checkpoint |
| `UNIT-EXEC-REGISTRY-FIXTURE` | EXEC local fixture, direct `resolveContractFixture` only | YES | NO | INFORMATIONAL | CONTRACT_TESTABLE_LOCALLY; never productive authority |

`AUTHORITY_CONSUMPTION_PROOF = ACP-EXEC-02` with producer/consumer records
`PCP-DOM-EXEC-01` and `PCP-REPO-EXEC-01`. The source port ledger at
`src/application/exec-registry-ports.ts:43-139` can authenticate only its local
fixture issuance at this target; the application correctly rejects those
fixtures for productive resolution. No downstream productive-availability
promotion was made.

`TEMPORAL_AUTHORITY_PROOF = NOT_APPLICABLE` for local behavior: no mutable
external observation is followed by a committed effect. Scope/revision/source
checks protect the local source boundary. A future integrated producer and
physical publication path must supply independent revalidation/CAS evidence.

`CALLER_AS_AUTHORITY_CHECK = PASS` locally. Caller scope/revision are assertions,
not source authority; caller basis, support set, receipt, result, and forged
schema/scope substitutions are rejected or ignored.

## 11. Findings

### BEH-MAJOR-001 — Integrated authority source is not consumable at the target

```text
FINDING_STATUS = OPEN
FINDING_CATEGORY = CAPABILITY_AVAILABILITY_CONTRADICTION / AUTHORITY_CONSUMPTION_GAP
SEVERITY = MAJOR
TICKET = EXEC-001-TICKET-002
REQUIREMENTS = EXEC-REGISTRY-001, EXEC-REGISTRY-002, EXEC-CAPABILITY-001, EXEC-CAPABILITY-002
ACCEPTANCE = AC-EXEC-008, AC-EXEC-009, AC-EXEC-011, AC-EXEC-012
CAPABILITY = DOM-EXEC-IDENTITY-SNAPSHOT; REPO-EXEC-NORMAL-CATALOG
DEPENDENCY_CLASS = REQUIRED_FOR_INTEGRATED_PROOF
LOCAL_CLOSURE_BLOCKING = NO
LOCAL_ACCEPTANCE_REQUIRES_PRODUCTIVE_CAPABILITY = NO
CLOSURE_OWNERSHIP = INTEGRATED_CHECKPOINT
DEPENDENCY_CLASS_RECLASSIFICATION_REQUIRED = NO
UPSTREAM_DEPENDENCY_CLASSIFICATION_PRESERVED = YES
BLOCKS_LOCAL_EXECUTION = NO
BLOCKS_LOCAL_CLOSURE = NO
BLOCKS_TICKET_DONE = NO
BLOCKS_INTEGRATED_PROOF = YES
BLOCKS_SPEC_FINAL_CONFORMANCE = YES
PRIMARY_ROUTE = IMPLEMENTATION_PLAN_REVALIDATION
DOWNSTREAM_CHECKPOINT = integrated DOM/REPO producer-consumer proof
DOWNSTREAM_OWNER = SPEC-DOM-001 and SPEC-REPO-001 producers with EXEC consumer
ROOT_CAUSE_CAMPAIGN_ID = RCC-EXEC-T002-INTEGRATED-AUTHORITY-001
SYSTEMIC_PATTERN = YES
```

**Required behavior:** the integrated resolver must consume owner-issued DOM
execution-basis and REPO NORMAL-catalog material, verify provenance/scope/revision,
and produce a canonical request-bound result.

**Production evidence:** `src/application/exec-registry-ports.ts:43-73` exposes
only the local fixture registration/receipt issuer; no productive producer-issued
basis/receipt factory is present. `src/application/exec-registry.ts:108-112`
rejects local fixture sources, while `src/domain/exec-registry.ts:526-530`
rejects every fixture basis from producer proof issuance. The current target has
no productive DOM/REPO producer.

**Test evidence:** 25/25 focused tests pass, including forged/copy/stale/wrong-
source rejection. Direct fixture resolutions deliberately report unbranded,
untrusted results; the direct probe `createProducerBoundCatalogBasisProof(localBasis)`
rejects. No productive positive resolution witness can execute at this target.

**Observed result:** local contract semantics work and anti-forgery behavior is
fail-closed, but no integrated authority-bearing result can be consumed. The
application's local fixture path fails closed before productive resolution.

**Expected result:** at the integrated checkpoint, owner producers issue a
verifiable basis/receipt; EXEC consumes it, revalidates scope/revision/source and
returns a canonical result, with direct stale/forged/alternate-adapter negatives.

**Problem and impact:** integrated successful registry/catalog resolution cannot
be demonstrated. This is not a local closure defect because the approved ticket
classifies both capabilities as integrated-only and explicitly forbids promoting
a fixture.

**Minimum correction required:** add the owner-issued productive producer seams
and integrated positive/negative execution evidence. Do not make local fixtures
or caller-created values productive authority.

**Suggested blocking effect:** preserve the local gate as unblocked; keep the
finding open for integrated proof and plan/producer revalidation.

### BEH-MAJOR-002 — Physical durable publication and one-winner CAS remain unproven

```text
FINDING_STATUS = OPEN
FINDING_CATEGORY = CAPABILITY_AVAILABILITY_CONTRADICTION / PERSISTENCE_SEMANTICS_GAP
SEVERITY = MAJOR
TICKET = EXEC-001-TICKET-002
REQUIREMENTS = EXEC-REGISTRY-001, EXEC-REGISTRY-002, EXEC-CAPABILITY-002
ACCEPTANCE = AC-EXEC-008, AC-EXEC-009, AC-EXEC-012
CAPABILITY = PLAT-EXEC-PERSISTED-MATERIAL / physical catalog CAS
DEPENDENCY_CLASS = REQUIRED_FOR_INTEGRATED_PROOF
LOCAL_CLOSURE_BLOCKING = NO
LOCAL_ACCEPTANCE_REQUIRES_PRODUCTIVE_CAPABILITY = NO
CLOSURE_OWNERSHIP = INTEGRATED_CHECKPOINT
DEPENDENCY_CLASS_RECLASSIFICATION_REQUIRED = NO
UPSTREAM_DEPENDENCY_CLASSIFICATION_PRESERVED = YES
BLOCKS_LOCAL_EXECUTION = NO
BLOCKS_LOCAL_CLOSURE = NO
BLOCKS_TICKET_DONE = NO
BLOCKS_INTEGRATED_PROOF = YES
BLOCKS_SPEC_FINAL_CONFORMANCE = YES
PRIMARY_ROUTE = IMPLEMENTATION_PLAN_REVALIDATION
DOWNSTREAM_CHECKPOINT = PLAT/TICKET-003 physical persistence, CAS and reconstruction proof
DOWNSTREAM_OWNER = SPEC-PLAT-001 / TICKET-003 integration owner
ROOT_CAUSE_CAMPAIGN_ID = RCC-EXEC-T002-INTEGRATED-CAS-001
SYSTEMIC_PATTERN = YES
```

**Required behavior:** durable catalog publication must preserve identity and
revision, reject stale/conflicting registration atomically, and provide a
one-winner/recovery witness when physical concurrent publication is in scope.

**Production evidence:** `CatalogBasis.register` at
`src/domain/exec-registry.ts:489-503` creates independent immutable in-memory
bases. There is no durable storage, shared publication boundary, physical CAS,
restart/recovery or semantic rehydration implementation in this ticket.

**Test evidence:** sequential duplicate/no-mutation tests pass. An independent
`Promise.all` probe over one in-memory basis produced two independent revision-2
branches (`[a]` and `[b]`), not a shared durable winner. No physical persistence
or CAS suite is available at the target.

**Observed result:** local create-only semantics are correct, but physical
one-winner, durable identity, restart and recovery are unproven.

**Expected result:** PLAT/TICKET-003 integrated evidence must prove durable
publication, CAS/conflict behavior, stale rejection, restart/recovery and
identity preservation without transferring domain meaning to storage.

**Problem and impact:** the ticket cannot provide the physical integrated proof;
this is explicitly outside local closure and must not be represented as a local
pass or silently promoted capability.

**Minimum correction required:** execute the integrated PLAT producer/consumer
and CAS/recovery witnesses at the downstream checkpoint; retain the local
in-memory fixture as contract-only evidence.

**Suggested blocking effect:** integrated-only blocker; no local ticket gate
change.

### BEH-MINOR-001 — Historical completion-evidence metadata is stale

```text
FINDING_STATUS = OPEN
FINDING_CATEGORY = EVIDENCE_TRACEABILITY_DRIFT
SEVERITY = MINOR
TICKET = EXEC-001-TICKET-002
REQUIREMENTS = EXEC-VERSION-001/002, EXEC-REGISTRY-001/002/003, EXEC-CAPABILITY-001/002
ACCEPTANCE = AC-EXEC-003, AC-EXEC-004, AC-EXEC-008, AC-EXEC-009, AC-EXEC-010, AC-EXEC-011, AC-EXEC-012
CAPABILITY = TICKET-002-LOCAL-COMPLETION-EVIDENCE
DEPENDENCY_CLASS = INFORMATIONAL
LOCAL_CLOSURE_BLOCKING = NO
LOCAL_ACCEPTANCE_REQUIRES_PRODUCTIVE_CAPABILITY = NO
CLOSURE_OWNERSHIP = LOCAL_TICKET
DEPENDENCY_CLASS_RECLASSIFICATION_REQUIRED = NO
UPSTREAM_DEPENDENCY_CLASSIFICATION_PRESERVED = YES
BLOCKS_LOCAL_EXECUTION = NO
BLOCKS_LOCAL_CLOSURE = NO
BLOCKS_TICKET_DONE = NO
BLOCKS_INTEGRATED_PROOF = NO
BLOCKS_SPEC_FINAL_CONFORMANCE = NO
PRIMARY_ROUTE = IMPLEMENTATION_REMEDIATION / evidence refresh
DOWNSTREAM_CHECKPOINT = next canonical ticket finalization/re-audit
DOWNSTREAM_OWNER = ticket evidence owner
ROOT_CAUSE_CAMPAIGN_ID = RCC-EXEC-T002-EVIDENCE-TRACE-001
SYSTEMIC_PATTERN = YES
```

**Required behavior:** evidence records must identify the executed target and
truthful test counts.

**Evidence:** independent execution at `6dbff481...` produced focused 25/25,
TICKET-001 21/21 and full 73/73. AC-EXEC-008 records 25/73 from an older
post-remediation head; AC-EXEC-003, AC-EXEC-005, AC-EXEC-007, AC-EXEC-009,
AC-EXEC-010, AC-EXEC-011 and AC-EXEC-012 still record 23 focused/71 full and
older heads. The ticket's §27 execution record also still says 71/71. These are
historical metadata inconsistencies, not failed runtime assertions.

**Expected result:** all current completion evidence and the ticket execution
record should either be refreshed to the pinned target or explicitly labeled as
historical, with the independent current execution attached.

**Minimum correction required:** refresh stale evidence metadata; no production
behavior change is required.

## 12. Root-cause campaign surface matrices

### RCC-EXEC-T002-INTEGRATED-AUTHORITY-001

```text
ROOT_CAUSE_CAMPAIGN_ID = RCC-EXEC-T002-INTEGRATED-AUTHORITY-001
ROOT_CAUSE_ID = owner-issued productive catalog basis/receipt unavailable at consumer execution point
CAMPAIGN_STATUS = OPEN
CAMPAIGN_SCOPE = EXEC-001-TICKET-002 integrated DOM/REPO authority consumption
CANONICAL_FINDINGS = BEH-MAJOR-001
```

| Surface | Location | Current behavior | Expected | Coverage |
|---|---|---|---|---|
| ISSUER | DOM/REPO producers | No productive issuer at target | Owner-issued basis/receipt | MISSING; integrated owner route |
| REGISTRAR | `CatalogBasis.createFixture`; producer proof factory | Fixture only; producer marker cannot be caller-minted | Productive owner registrar | MISSING; integrated owner route |
| CONSUMER | `ResolveExecCapability.selectBasis/assertAuthorizedBasis` | Verifies receipt, kind, scope, revision and source; rejects fixtures | Consume valid productive receipt | COVERED locally; positive integrated witness missing |
| ALTERNATE_AUTHORITY_PATH | `resolveContractFixture`, public failure factory | Unbranded fixture results/public failures | Alternate path cannot mint authority | COVERED; direct negatives pass |
| INJECTION_POINT | caller `basis`, fake source/receipt/result | Rejected or ignored | Caller cannot establish truth | COVERED; direct negatives pass |
| MUTATION_PATH | `CatalogBasis.register` | New immutable basis; old basis preserved | No in-place mutation | COVERED locally |
| STALE_PATH | `assertAuthorizedBasis` | Scope/revision/source mismatch fails closed | Stale/foreign source rejected | COVERED locally; durable stale integrated |
| PORT_SUBSTITUTION_PATH | caller-defined source and resolver subclasses | Rejected; no productive adapter authorization path exists | Approved alternate producer contract | MISSING integrated positive; negative covered |
| PUBLIC_EXPORT | `createProducerBoundCatalogBasisProof`, fixture factories | Exported APIs cannot mint producer proof from fixture | Public API must preserve owner provenance | COVERED negatives |
| TEST | `tests/exec-001-ticket-002.test.ts` | 25/25 local negative/contract tests | Integrated positive plus negatives | MISSING integrated positive |
| ARCHITECTURE_GUARD | loader and source import checks | Pass | No hidden authority/import route | COVERED |

### RCC-EXEC-T002-INTEGRATED-CAS-001

```text
ROOT_CAUSE_CAMPAIGN_ID = RCC-EXEC-T002-INTEGRATED-CAS-001
ROOT_CAUSE_ID = no durable shared publication/CAS witness for catalog registration
CAMPAIGN_STATUS = OPEN
CAMPAIGN_SCOPE = EXEC-001-TICKET-002 integrated persistence/CAS contribution
CANONICAL_FINDINGS = BEH-MAJOR-002
```

| Surface | Location | Current behavior | Expected | Coverage |
|---|---|---|---|---|
| ISSUER/REGISTRAR | `CatalogBasis.register` | In-memory immutable branch only | Durable owner publication | MISSING; PLAT route |
| CONSUMER | application registration/resolution | No durable source consumer exists | Consume durable basis/revision | MISSING integrated |
| ALTERNATE_AUTHORITY_PATH | fixture resolver | Contract-only untrusted result | Cannot substitute durability | COVERED |
| INJECTION_POINT | forged basis/entry/receipt | Rejected | No caller authority | COVERED |
| MUTATION_AND_STALE_PATHS | duplicate/revision checks | Local no-mutation and revision increment | Durable stale/CAS rejection | PARTIAL; integrated missing |
| PORT_SUBSTITUTION_PATH | source ports | Local fixture only; no productive source | PLAT/owner adapter contract | MISSING integrated |
| PUBLIC_EXPORT | basis/registration APIs | No persistence claim exposed | Durable identity not inferred | COVERED locally |
| PERSISTENCE | no storage adapter in scope | No durability/restart | Durable identity and integrity | MISSING; accepted integrated-only |
| RETRY_RECOVERY | no restart/replay path | Not applicable locally | Downstream recovery witness | MISSING; accepted integrated-only |
| TEST | focused duplicate/no-mutation tests | Sequential local evidence only | CAS/one-winner/recovery execution | MISSING integrated |

### RCC-EXEC-T002-EVIDENCE-TRACE-001

```text
ROOT_CAUSE_CAMPAIGN_ID = RCC-EXEC-T002-EVIDENCE-TRACE-001
ROOT_CAUSE_ID = evidence records were not refreshed uniformly after test/target changes
CAMPAIGN_STATUS = OPEN
CAMPAIGN_SCOPE = TICKET-002 local completion evidence metadata
CANONICAL_FINDINGS = BEH-MINOR-001
```

| Surface class | Applicability/result |
|---|---|
| ISSUER, REGISTRAR, CONSUMER, ALTERNATE_AUTHORITY_PATH, INJECTION_POINT, MUTATION_PATH, STALE_PATH, PORT_SUBSTITUTION_PATH, PUBLIC_EXPORT | NOT_APPLICABLE to documentary count drift; runtime campaigns are separate and covered above. |
| TEST | MISSING uniform current target/count metadata across seven AC evidence files and ticket §27. |
| PERSISTENCE, RETRY_RECOVERY, LEGACY_ROUTE, ARCHITECTURE_GUARD | NOT_APPLICABLE to this evidence-only root cause, with reasons recorded. |

## 13. Specialist summary

Audit: `.pi/runtime/workflow-audits/f9d5894f-5fd6-4ae4-9f40-a6989b38fd96/behavior-EXEC-001-TICKET-002-implementation-behavior-audit.md`

Specialist:
IMPLEMENTATION_BEHAVIOR

Ticket: EXEC-001-TICKET-002

Required behavioral dimensions: 9

Required tests: 13

Required tests missing: 4 (integrated-only, justified by dependency class)

Required behaviors total: 9

Direct behavior witnesses: 9

Proxy-only behaviors: 0

Untested state transitions: 0 local

Unproven concurrency contracts: 1 integrated physical contract

Missing architecture guards: 0

Tests run: 73

Tests passed: 73

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

Caller-as-authority bypasses: 0

Findings:
CRITICAL=0
MAJOR=2
MINOR=1
INFO=0

Domain audit complete:
YES

Specialist result:
SPECIALIST_BEHAVIOR_FINDINGS

AUDIT_TARGET_HEAD: 6dbff481eaf9bf21ac1aa7ae61f06a32f6dabfa8
AUDIT_TARGET_STATE_FINGERPRINT: ef07d1b9a20b8529b47f6ace6430da84da76e05ec35d2cb0bdea678314fd481a
AUDIT_WAVE_ID: f9d5894f-5fd6-4ae4-9f40-a6989b38fd96
DOMAIN_AUDIT_COMPLETE: YES
SPECIALIST_RESULT: SPECIALIST_BEHAVIOR_FINDINGS
