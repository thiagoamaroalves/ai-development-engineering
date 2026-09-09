# DOM-001-TICKET-002 — Implementation Behavior Audit

## 1. Audit basis and target pin

| Input | Value |
|---|---|
| `TICKET_ID` | `DOM-001-TICKET-002` |
| `TICKET_PATH` | `docs/tickets/SPEC-DOM-001/DOM-001-TICKET-002-manual-entry-snapshot-eligibility.md` |
| `IMPLEMENTATION_UNIT` | `DOM-IMP-02` |
| `REQUIREMENT_IDS` | `DOM-INGEST-001`, `DOM-SNAPSHOT-001`, `DOM-ELIG-001` |
| `ACCEPTANCE_IDS` | `AC-DOM-002`, `AC-DOM-003`, `AC-DOM-004` |
| `SPEC_PATH` | `docs/specs/SPEC-DOM-001-workflow-authority-and-governance.md` |
| `GAP_MATRIX_PATH` | `docs/specs/gap-matrices/SPEC-DOM-001-implementation-gap-matrix.md` |
| `IMPLEMENTATION_PLAN_PATH` | `docs/specs/implementation-plans/SPEC-DOM-001-implementation-plan.md` (`DOM-IMP-02`) |
| `IMPLEMENTATION_BASELINE` | `HEAD a58ce959f9b34f3c1c83ed41c01b058d31bf3366` plus the unchanged working-tree implementation supplied for this reaudit |
| `CURRENT_HEAD` | `a58ce959f9b34f3c1c83ed41c01b058d31bf3366` |
| `TARGET_SEMANTIC_STATE` | Requested `HEAD` plus the unchanged implementation working tree; no production/test/ticket/upstream file was changed by this audit |
| `CHANGED_PRODUCTION_FILES` | `src/domain/snapshot.ts`; `src/application/snapshot.ts` |
| `RELATED_IMPLEMENTATION_DEPENDENCIES` | `src/domain/identity.ts`; `src/application/identity.ts` |
| `CHANGED_TEST_FILES` | `tests/dom-001-ticket-002.test.ts` |
| `RELATED_TEST_FILES` | `tests/dom-001-ticket-001.test.ts`; `tests/dom-001-ticket-004.test.ts` |
| `RELEVANT_TEST_SUITES` | Ticket-specific productive tests; related DOM productive tests; complete productive suite; prototype regression suite; TypeScript lint/build |

The requested HEAD pin matched exactly. The source/test files used for this
audit are untracked in the supplied working tree and are therefore recorded by
content hash below; this is target-state evidence, not a reason to change them.

| File | SHA-256 |
|---|---|
| `src/domain/snapshot.ts` | `BADB782ECDFCAE8430991A23ED7F41AD3F27DA96E317DB899DF4CE79A3BB6E17` |
| `src/application/snapshot.ts` | `FBFDBA10142C5E4D7504AF52C90A05C5CEE92F06D1204A932245B5AE4943CB25` |
| `src/domain/identity.ts` | `2B12123B98D46539E2861C6833ED91B3ECB9189164CFF2F72D3A00B86EA1440C` |
| `src/application/identity.ts` | `999EE9EF1027BDA7392A495B7BC4A4C916E6AE251D2790C6C4462B734344BCB0` |
| `tests/dom-001-ticket-002.test.ts` | `83326D0EC993F410DC321869ACCF23E8C9DEA86688BFE3F438F97D1D94ED3520` |
| `tests/dom-001-ticket-001.test.ts` | `52096BC80832C1BF17E2E10E656AAB43B0981C3F494DEACD4EEC67EA2A22D922` |
| `tests/dom-001-ticket-004.test.ts` | `15DE4983880DE05886B5F7DA4FA3D7012BAD11D3FDEEA79A91346E4F7D474D62` |

The prior behavior-audit artifact at
`docs/tickets/SPEC-DOM-001/.history/DOM-001-TICKET-002-implementation-behavior-audit.md`
was consulted only as historical context. Its findings were independently
rechecked; it is not current evidence and is not used as an authority source.

## 2. Reconstructed behavioral contract

The authority chain requires an explicit manual submission; resolution of
canonical SPEC/ADR references; accepted-only, eligible ADRs; an immutable
snapshot containing ADR hashes, commit base, configuration, and exact
skill/contract versions; fail-closed rejection of invalid or drifting basis;
and a repository seam that rejects duplicates, stale confirmation, and
overwrite of locked state. Physical PLAT persistence/recovery remains outside
this ticket's local closure, but the local port and its observable outcomes
are affected.

| Behavior | Expected success | Expected failure / negative behavior | Classification |
|---|---|---|---|
| Explicit manual entry | `SubmitManualExecutionHandler` accepts only the explicit command basis | Filename/discovery/session-only or absent-SPEC input cannot initiate work | `IMPLEMENTED_CORRECTLY` for the exercised boundary |
| Canonical endpoint resolution | SPEC and every ADR resolve through `CanonicalIdentityCatalog` | Unknown or invalid references fail before snapshot reservation | `IMPLEMENTED_CORRECTLY` on exercised paths |
| Accepted-only eligibility | An explicitly submitted `ACCEPTED` ADR with valid canonical reference enters the snapshot | `PROPOSED`, `REJECTED`, `SUPERSEDED`, unknown status, or ineligible revision fails closed with no transition/fallback | `PARTIAL`: status supplied by command is checked, but no authoritative ADR lifecycle/status reader exists in the implementation |
| Snapshot construction | Creates an immutable `DRAFT` with exact identity, ADR entries, hashes, base, configuration, and versions | Missing/invalid identity, endpoint, ADR set, exact metadata, or status is rejected | `IMPLEMENTED_CORRECTLY` on traced and exercised paths |
| Lock/confirmation | A complete unchanged basis becomes `CONFIRMED` and remains immutable | Any later basis drift leaves the draft unchanged and is rejected | `PARTIAL`: aggregate comparison works with a distinct basis, but the handler compares the draft with itself |
| Duplicate and locked state | Repository identity is unique; only one reservation can win | Duplicate or confirmed snapshot is not overwritten or reported as a new success | `PARTIAL`: explicit port/outcome mapping exists, but no productive adapter or ticket test proves the full path |
| Replay/rehydration | Persisted values re-enter through validated construction and remain immutable | Invalid endpoint, empty ADR authority, malformed status, or invalid metadata is rejected | `IMPLEMENTED_CORRECTLY` for the direct aggregate seam; durable adapter is out of scope |

## 3. Behavioral applicability matrix

| Dimension | Classification | Reason |
|---|---|---|
| `UNIT_BEHAVIOR` | `REQUIRED` | Value objects, eligibility, aggregate construction, confirmation, and immutability are locally owned. |
| `INTEGRATION_BEHAVIOR` | `AFFECTED` | The application handler composes identity resolution, version mapping, and snapshot repository outcomes. |
| `PERSISTENCE` | `AFFECTED` | The repository port exposes reservation/confirmation/resolve semantics; physical PLAT storage is foreign-owned. |
| `CONCURRENCY` | `AFFECTED` | Duplicate reservation and stale confirmation protect the immutable lock boundary. |
| `STALE_STATE` | `REQUIRED` | Authority drift and stale confirmation are explicit ticket behavior. |
| `IDEMPOTENCY` | `AFFECTED` | Snapshot identity must prevent duplicate canonical state on replay/retry. |
| `DURABILITY` | `NOT_APPLICABLE` | Physical durable storage and its commit point belong to PLAT-001 and are explicitly excluded from local closure. |
| `RECOVERY` | `NOT_APPLICABLE` | Physical restart/recovery is PLAT-owned; this ticket only provides validated rehydration. |
| `COMPATIBILITY` | `NOT_APPLICABLE` | No productive legacy snapshot adapter exists; legacy reads are deferred to the later adapter boundary. |
| `MIGRATION_BEHAVIOR` | `NOT_APPLICABLE` | This ticket introduces no migration or cutover operation. |
| `NEGATIVE_PATHS` | `REQUIRED` | Fail-closed eligibility, malformed triggers, endpoint errors, drift, duplicate, stale, and no-mutation behavior are material. |

Required/affected dimensions inspected: **7**.

## 4. Production behavior audit

`src/application/snapshot.ts:47-66` resolves the submitted SPEC and ADR
references, maps exact EXEC metadata, and constructs a validated draft.
`src/domain/snapshot.ts:239-279` validates the SPEC endpoint, requires a
non-empty ADR set, validates entries, applies `AdrEligibilityPolicy`, rejects
duplicate ADR revisions, validates exact versions, and freezes the aggregate
basis. `src/domain/snapshot.ts:282-325` returns a new confirmed aggregate for
an equal basis and rejects a distinct basis with
`SNAPSHOT_AUTHORITY_DRIFT` without mutating the draft.

The critical application path is `src/application/snapshot.ts:67-81`:

1. `reserve(draft)` is called.
2. A confirmed candidate is created by `draft.confirm(draft)`.
3. `confirm(confirmed)` is sent to the repository.
4. `STALE` and `NOT_FOUND` outcomes are mapped to explicit domain errors.

There is no second read of current ADR decision/hash, base, configuration, or
version authority between initial resolution and confirmation. Consequently,
the aggregate drift guard is effective only when a distinct basis is manually
provided; it is vacuous in the real handler path because the same draft is
passed as both sides of the comparison.

`src/domain/identity.ts:146-169` provides immutable exact references and
`src/domain/identity.ts:363-370` provides exact repository resolution. The
identity record contains no decision lifecycle/status, so the handler's
`decisionStatus` is caller-supplied rather than revalidated against an
authoritative ADR lifecycle owner. This is recorded as a limitation of local
eligibility proof, while lifecycle transitions remain owned by TICKET-003.

## 5. Test inventory and assertion quality

| Required test category / behavior | Classification | Assertion assessment |
|---|---|---|
| Unit and domain-invariant construction | `REQUIRED_TEST_PRESENT` | `STRONG`: values, errors, status, immutability, and persistence lookup are asserted. |
| Explicit manual-only boundary and no fallback | `REQUIRED_TEST_PRESENT` | `SUFFICIENT`: malformed discovery/session input, absent SPEC, invalid endpoint, and zero reservation calls are asserted. |
| Accepted, proposed, rejected, superseded eligibility | `REQUIRED_TEST_PRESENT` | `SUFFICIENT`: the four supplied decision-status values are exercised with positive/negative assertions. |
| Unknown/ineligible status or revision | `REQUIRED_TEST_MISSING` | `WEAK`: construction has a closed status check, but no productive test exercises unknown status or an authoritative ineligible revision. |
| Exact hash/base/configuration/version preservation and drift | `REQUIRED_TEST_MISSING` | `WEAK`: exact values and one changed base are checked; handler-time drift and changed hash/configuration/version cases are absent. |
| Snapshot lock, duplicate identity, confirmed overwrite protection | `REQUIRED_TEST_MISSING` | `WEAK`: the port declares outcomes, but the ticket suite does not repeat submission or invoke confirmation on a confirmed record. |
| Repository stale/not-found outcome and no mutation | `REQUIRED_TEST_MISSING` | `WEAK`: the fixture implements these branches, but no ticket test drives the handler through them and asserts state preservation. |
| Replay/rehydration through validated construction | `REQUIRED_TEST_PRESENT` | `SUFFICIENT`: confirmed rehydration and invalid endpoint/empty authority rejection are asserted; no physical adapter is claimed. |
| Identity/repository integration seam | `REQUIRED_TEST_PRESENT` | `SUFFICIENT`: the handler is exercised against injected in-memory implementations. |
| Relevant regression safety | `REQUIRED_TEST_PRESENT` | `STRONG`: related DOM tests and the complete prototype suite pass. |

Required tests: **9**. Required tests missing: **4** grouped gaps above.
The productive tests do not rely on HTTP success, non-null assertions, or
duplicated production logic as their primary correctness evidence.

## 6. Negative, stale, duplicate, no-mutation, replay, and retry results

- Invalid manual/discovery-only input, unresolved SPEC, wrong SPEC endpoint,
  and non-accepted supplied statuses reject before reservation in the ticket
  suite; `repository.reserveCalls` remains zero for those exercised cases.
- Direct aggregate drift for base rejects with `SNAPSHOT_AUTHORITY_DRIFT` and
  leaves the draft `DRAFT` with its original base. An independent inline probe
  repeated this for ADR hash, base, configuration, and exact skill version;
  all four rejected and the original basis remained unchanged.
- An inline repository probe showed the first submission is `CONFIRMED`, a
  repeated equivalent submission returns `SNAPSHOT_ALREADY_EXISTS`, and the
  stored snapshot remains `CONFIRMED`. This is correct duplicate rejection,
  but is not ticket-test evidence.
- The same probe forced a repository `STALE` outcome. The handler returned
  `SNAPSHOT_STALE` and the stored record remained `DRAFT`; this confirms the
  mapping in the fixture contract, not a productive durable adapter.
- Two concurrent equivalent submissions to the in-memory atomic reservation
  fixture produced one fulfilled confirmation and one
  `SNAPSHOT_ALREADY_EXISTS`, with one confirmed record. Durable concurrency
  remains unproven because no production adapter exists.
- Rehydration uses `ExecutionSnapshot.construct` and therefore re-applies
  endpoint, non-empty authority, status, entry, eligibility, duplicate, and
  exact-version validation. The resulting aggregate and entries are frozen.
- No automatic retry or rebase is introduced. A persistence exception after a
  successful reservation is not recovered by the handler; physical recovery
  remains PLAT-owned. The local implementation therefore does not provide
  evidence for restart or partial-failure recovery.

## 7. Regression and execution record

| Command / probe | Result |
|---|---|
| `prototype/node_modules/.bin/tsx.cmd --test tests/dom-001-ticket-002.test.ts` | PASS, 5/5 |
| `prototype/node_modules/.bin/tsx.cmd --test tests/dom-001-ticket-001.test.ts tests/dom-001-ticket-004.test.ts` | PASS, 22/22 |
| `prototype/node_modules/.bin/tsx.cmd --test tests/*.test.ts` | PASS, 27/27 |
| `Push-Location prototype; npm test` | PASS, 92/92 |
| `Push-Location prototype; npm run lint` | PASS |
| `Push-Location prototype; npm run build` | PASS |
| Inline drift probe for hash/base/configuration/version and no mutation | PASS, all four rejected |
| Inline duplicate/stale/concurrency probe | PASS, expected explicit outcomes observed |

`TESTS_RUN = 8` (six test/validation commands plus two executable probes);\
`TESTS_PASSED = 8`; `TESTS_FAILED = 0`; `TESTS_SKIPPED = 0`;\
`ENVIRONMENTAL_FAILURES = 0`.

Regression result: **`NO_REGRESSION`** in the executed related productive
tests and complete prototype suite. Passing regressions do not close the
ticket-specific drift, stale, duplicate, and lock-evidence gaps.

## 8. Conditional runtime dimensions

| Dimension | Result | Evidence |
|---|---|---|
| Concurrency | `NON_CONFORMANT` | In-memory reservation probe has one winner, but no productive adapter or ticket test proves atomic durable duplicate/stale protection. |
| Stale state | `NON_CONFORMANT` | Direct aggregate comparison is correct, but handler-time authority is not re-read and no ticket test exercises repository stale/no-mutation behavior. |
| Idempotency | `NON_CONFORMANT` | Duplicate identity is explicitly rejected by the handler, but repeated/retry behavior is not covered by the required productive test set and the reserve/confirm split leaves partial-failure recovery unspecified locally. |
| Durability | `NOT_APPLICABLE` | PLAT-owned physical persistence/recovery is outside local closure. |
| Recovery | `NOT_APPLICABLE` | PLAT-owned restart/recovery is outside this ticket. |
| Compatibility | `NOT_APPLICABLE` | No productive legacy adapter is present. |
| Migration | `NOT_APPLICABLE` | No migration operation is introduced. |

## 9. Findings

### BEH-MAJOR-001 — Handler confirmation does not revalidate current authority

- Severity: `MAJOR`
- Ticket: `DOM-001-TICKET-002`
- Requirement / acceptance: `DOM-SNAPSHOT-001`; `AC-DOM-003`
- Required behavior: reject later ADR/hash/base/configuration/version authority
  drift before the snapshot is locked, with no fallback, overwrite, or silent
  rebase.
- Production evidence: `src/application/snapshot.ts:47-73` resolves the
  authority once, reserves the draft, and calls `draft.confirm(draft)`;
  `src/domain/snapshot.ts:282-303` can only detect drift when supplied a
  distinct current basis.
- Test evidence: `tests/dom-001-ticket-002.test.ts:159-186` proves direct
  aggregate rejection for a manually changed base, but does not introduce a
  change between handler resolution and confirmation.
- Observed result: the actual manual handler can confirm a snapshot using
  stale authority values if the ADR hash, base, configuration, or exact
  versions change after initial resolution, because confirmation compares the
  draft to itself.
- Expected result: the lock boundary must revalidate the current authority
  basis and reject drift without confirming or mutating the draft.
- Problem: the implemented handler makes the aggregate drift guard vacuous at
  the use-case boundary.
- Impact: a confirmed pre-execution snapshot can represent authority that was
  no longer current at lock time.
- Minimum correction required: add an authorized current-authority read and a
  distinct basis comparison at the lock boundary, or revise the approved
  contract explicitly if that revalidation belongs to a downstream owner. The
  repository must not become a second business-rule authority.
- `Systemic pattern = NO`
- Related locations: `src/application/snapshot.ts:47-73`;
  `src/domain/snapshot.ts:282-303`;
  `tests/dom-001-ticket-002.test.ts:159-186`.

### BEH-MAJOR-002 — Required duplicate/stale/full-drift behavior is not proven by productive tests

- Severity: `MAJOR`
- Ticket: `DOM-001-TICKET-002`
- Requirements / acceptance: `DOM-SNAPSHOT-001`, `DOM-ELIG-001`;
  `AC-DOM-003`, `AC-DOM-004`
- Required behavior: execute the complete fail-closed matrix for unknown or
  ineligible ADR input, all exact-basis drift dimensions, duplicate/locked
  snapshots, stale repository confirmation, replay, and no mutation on
  rejection.
- Production evidence: `src/domain/snapshot.ts:328-363` declares explicit
  `DUPLICATE`, `STALE`, and `NOT_FOUND` outcomes; `src/application/snapshot.ts:67-81`
  maps duplicate, stale, and not-found outcomes to explicit errors. There is no
  concrete productive adapter in the supplied repository.
- Test evidence: the five ticket tests at
  `tests/dom-001-ticket-002.test.ts:96-215` cover the positive immutable path,
  three non-accepted statuses, one direct base-drift path, and direct
  rehydration. They do not test changed hash/configuration/versions,
  unknown/ineligible revision, repeated submission, confirmed-lock overwrite,
  repository stale, or stale-state preservation at the ticket boundary.
- Observed result: inline probes show the simple in-memory fixture has the
  expected explicit outcomes, but the required productive evidence is absent;
  the fixture itself is not a production persistence proof.
- Expected result: focused productive tests must drive every required negative
  and replay/idempotency path through the authorized domain/application seam
  and assert that no canonical record or contained authority value changes.
- Problem: regressions in lock, duplicate, stale, or untested drift fields can
  pass the current ticket suite unnoticed.
- Impact: independent validation cannot establish complete behavioral closure
  for the ticket's explicit stale-protection and no-fallback obligations.
- Minimum correction required: add productive tests for unknown/ineligible
  status/revision, ADR hash/configuration/version drift, duplicate and
  confirmed-lock rejection, repository stale/not-found outcomes, repeated
  equivalent submission, and state-preservation assertions. Add adapter-backed
  concurrency/durability evidence under PLAT when that boundary exists.
- `Systemic pattern = NO`
- Related locations: `tests/dom-001-ticket-002.test.ts:96-215`;
  `src/domain/snapshot.ts:239-325,328-363`;
  `src/application/snapshot.ts:67-81`.

## 10. Summary

Audit: `docs/tickets/SPEC-DOM-001/DOM-001-TICKET-002-implementation-behavior-audit.md`

Specialist:
IMPLEMENTATION_BEHAVIOR

Ticket: DOM-001-TICKET-002

Required behavioral dimensions: 7

Required tests: 9

Required tests missing: 4

Tests run: 8

Tests passed: 8

Tests failed: 0

Regressions: 0

Concurrency:
NON_CONFORMANT

Stale behavior:
NON_CONFORMANT

Idempotency:
NON_CONFORMANT

Recovery:
NOT_APPLICABLE

Findings:
CRITICAL=0
MAJOR=2
MINOR=0
INFO=0

Domain audit complete:
YES

DOMAIN_AUDIT_COMPLETE=YES

Specialist result:
SPECIALIST_BEHAVIOR_FINDINGS

