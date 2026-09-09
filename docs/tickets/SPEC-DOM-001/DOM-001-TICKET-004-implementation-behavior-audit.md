# DOM-001-TICKET-004 — Implementation Behavior Audit

```text
AUDIT_MODE: READ_ONLY | INDEPENDENT | ADVERSARIAL | BEHAVIOR_FIRST
AUDIT_TARGET_HEAD: a58ce959f9b34f3c1c83ed41c01b058d31bf3366
CURRENT_IMPLEMENTATION_STATE: working-tree implementation unchanged during audit
DOMAIN_AUDIT_COMPLETE: YES
```

## 1. Audit subject and authority

| Input | Value |
|---|---|
| Ticket ID | `DOM-001-TICKET-004` |
| Ticket path | `docs/tickets/SPEC-DOM-001/DOM-001-TICKET-004-pipeline-state-machines.md` |
| Implementation unit | `DOM-IMP-04 — Pipeline and aggregate state machines` |
| Requirements | `DOM-PIPE-001`, `DOM-STATE-001` |
| Acceptance | `AC-DOM-009`, `AC-DOM-010` |
| SPEC | `docs/specs/SPEC-DOM-001-workflow-authority-and-governance.md` |
| Gap Matrix | `docs/specs/gap-matrices/SPEC-DOM-001-implementation-gap-matrix.md` |
| Implementation Plan | `docs/specs/implementation-plans/SPEC-DOM-001-implementation-plan.md` |
| Implementation Design | `docs/tickets/SPEC-DOM-001/DOM-001-TICKET-004-implementation-design.md` |
| Implementation baseline | `a58ce959f9b34f3c1c83ed41c01b058d31bf3366` |
| Current HEAD | `a58ce959f9b34f3c1c83ed41c01b058d31bf3366` |
| Semantic target | Pinned commit plus unchanged working-tree implementation |
| Changed production files | `src/domain/pipeline.ts`, `src/application/pipeline.ts` |
| Changed test files | `tests/dom-001-ticket-004.test.ts` |
| Local ticket status | `VALIDATION_REQUIRED` |

The authority chain requires canonical ordered advancement, rejection of phase
bypass, separate execution/SPEC/stage/activity/cycle/wave/ticket/migration/
publication machines, and read-only derivation without a second transition
authority. Physical persistence, recovery, scheduler, transport, Git, and
foreign operational state remain outside this ticket.

## 2. Behavioral applicability matrix

| Dimension | Applicability | Reason and inspection result |
|---|---|---|
| `UNIT_BEHAVIOR` | REQUIRED | Domain stage order, immutable aggregate transition, and validation are local responsibilities. Implemented, with a rehydration boundary finding. |
| `INTEGRATION_BEHAVIOR` | AFFECTED | Application handlers coordinate repository/state-reader ports. Handler paths were executed with test adapters. |
| `PERSISTENCE` | AFFECTED | The repository port defines the advance/CAS seam; no physical adapter is owned by this ticket. Local in-memory CAS behavior was exercised. |
| `CONCURRENCY` | REQUIRED | `expectedRevision` is the required compare-and-set precondition. The injected repository adapter was exercised. |
| `STALE_STATE` | REQUIRED | Stale rejection and no last-write-wins behavior are explicit ticket behavior. Passed in the executable adapter path. |
| `IDEMPOTENCY` | AFFECTED | The design defines identity plus expected revision as the retry boundary. No duplicate state was observed, but exact replay evidence is incomplete. |
| `DURABILITY` | NOT_APPLICABLE | Physical durable storage and transaction mechanics belong to the PLAT boundary and are explicitly excluded. |
| `RECOVERY` | NOT_APPLICABLE | Physical replay/recovery belongs to PLAT and is explicitly excluded. |
| `COMPATIBILITY` | REQUIRED | Rehydration is the serialized-state entry seam. Valid vocabulary and invalid stage/revision paths were tested; fabricated later-state provenance is not protected. |
| `MIGRATION_BEHAVIOR` | NOT_APPLICABLE | No migration or legacy cutover is owned by this ticket. |
| `NEGATIVE_PATHS` | REQUIRED | Bypass, incompatible state input, missing state, invalid stage/revision, and stale paths are required. |

Required behavioral dimensions inspected: `5`. Affected behavioral dimensions
inspected: `4`. Not-applicable dimensions were explicitly excluded only where
the authority assigns ownership outside this ticket.

## 3. Production behavior classification

| Behavior | Production evidence | Classification | Observed result |
|---|---|---|---|
| Immediate canonical successor is accepted | `src/domain/pipeline.ts:107-114,321-334` | `IMPLEMENTED_CORRECTLY` | `PipelineOrder` permits only the next entry and `WorkflowPipeline` returns a new immutable proposal. |
| Later/invalid stage bypass is rejected without source mutation | `src/domain/pipeline.ts:321-334` | `IMPLEMENTED_CORRECTLY` | Non-successor targets throw `INVALID_PIPELINE_TRANSITION`; the current aggregate is unchanged. A one-off runtime probe completed all 12 stages only through successive transitions. |
| Stage vocabulary and revision values are validated | `src/domain/pipeline.ts:85-101,116-135` | `IMPLEMENTED_CORRECTLY` | Unknown stages and negative/non-integer revisions are rejected. |
| Independent machine inputs remain machine-labelled and immutable | `src/domain/pipeline.ts:141-239` | `IMPLEMENTED_CORRECTLY` | Complete input sets are validated, frozen, and cannot directly mutate pipeline state. |
| Derived state is read-only and does not persist a projection | `src/domain/pipeline.ts:246-267`, `src/application/pipeline.ts:46-64` | `IMPLEMENTED_CORRECTLY` | Query reads pipeline and input snapshots and returns a frozen view; it has no write path. |
| CAS and stale semantics | `src/application/pipeline.ts:23-43`, repository contract at `src/domain/pipeline.ts:349-360` | `IMPLEMENTED_CORRECTLY` within the local port contract | The adapter compares persisted revision before replacing the record; the handler maps `STALE` and does not retry, rebase, or overwrite. |
| Rehydration of a later valid stage | `src/domain/pipeline.ts:306-318` | `PARTIAL` / unsafe boundary | `rehydrate({ stage: 'MAIN_UPDATE_AND_PUBLICATION', revision: 0 })` succeeds. The public boundary validates vocabulary and numeric revision, but does not validate provenance or evidence that the later stage was reached through canonical predecessors. |
| Missing machine input | `src/domain/pipeline.ts:217-227` | `UNSAFE_FAILURE_BEHAVIOR` | A missing member causes `TypeError: Cannot read properties of undefined (reading 'machine')`, rather than the domain's `INVALID_PIPELINE_STATE` rejection. It fails closed, but not through the explicit boundary failure contract. |

## 4. Required test inventory

| Category | Classification | Evidence |
|---|---|---|
| `UNIT` | `REQUIRED_TEST_PRESENT` | Six productive ticket tests exercise aggregate, value objects, handlers, and ports. |
| `INVARIANT` | `REQUIRED_TEST_PRESENT` | Immediate successor, no-mutation bypass, machine ownership, and immutability assertions. |
| `PERSISTENCE` | `REQUIRED_TEST_PRESENT` for local seam | Rehydration and in-memory repository CAS tests; physical durable adapter is outside local scope. |
| `INTEGRATION` | `REQUIRED_TEST_PRESENT` | `AdvancePipelineHandler` and `GetPipelineStateHandler` run against injected ports. |
| `CROSS_SPEC` | `TEST_CATEGORY_NOT_APPLICABLE` | No external SPEC runtime integration is implemented by this ticket. |
| `CONCURRENCY` | `REQUIRED_TEST_PRESENT` | Repository test adapter exercises revision comparison before replacement. |
| `STALE` | `REQUIRED_TEST_PRESENT` | Stale command is rejected and persisted stage/revision remain unchanged. |
| `IDEMPOTENCY` | `REQUIRED_TEST_MISSING` | No test submits the same command twice and asserts the second execution has no new effect. Production tracing indicates rejection, but the declared retry boundary is not directly proven. |
| `RECOVERY` | `TEST_CATEGORY_NOT_APPLICABLE` | PLAT-owned physical recovery is outside the ticket. |
| `COMPATIBILITY` | `REQUIRED_TEST_PRESENT` | Invalid rehydrated stage/revision paths are asserted. Later-state provenance is not asserted. |
| `MIGRATION` | `TEST_CATEGORY_NOT_APPLICABLE` | No migration behavior is owned. |
| `NEGATIVE_PATH` | `REQUIRED_TEST_PRESENT` | Bypass, incompatible machine, missing reader state, invalid stage/revision, and stale paths are covered, with the malformed-member weakness noted above. |
| `ARCHITECTURE_GUARD` | `REQUIRED_TEST_PRESENT` | Productive modules are checked for prototype and infrastructure imports. |
| `CONFORMANCE` | `REQUIRED_TEST_PRESENT` | Ticket-specific and productive regression suites passed. |

Required test categories: `11`. Required categories missing: `1` exact replay
idempotency test. This is an evidence gap; no duplicate state was observed in
the executed paths.

## 5. Assertion-quality assessment

The ticket-specific assertions are generally `STRONG` or `SUFFICIENT`: they
assert stage, revision, error code, persisted state, immutability, and adapter
call count. The in-memory repository is an explicit test adapter that retains
the CAS invariant under test; it does not hide the relevant comparison.

The architecture guard is `SUFFICIENT` for forbidden imports but is not proof
of all consumer-side transport behavior, which is outside this ticket. The
rehydration test is insufficient for the valid-but-unproven later-stage case,
and no test directly proves an exact replay has no additional effect.

## 6. Negative, stale, and failure behavior

| Case | Expected | Observed | Result |
|---|---|---|---|
| Later stage requested directly | Reject and preserve current aggregate | `INVALID_PIPELINE_TRANSITION`; source remained at `ACCEPTED_ADRS`, revision `0` | Preserved |
| Incompatible machine label | Reject before deriving a view | `INVALID_PIPELINE_STATE` | Preserved |
| Missing state reader result | Reject without changing pipeline | `PIPELINE_NOT_FOUND`; pipeline remained unchanged | Preserved |
| Stale expected revision | Reject with no last-write-wins | `PIPELINE_STALE`; persisted stage/revision stayed `SPECS/1` | Preserved |
| Unknown rehydrated stage | Reject | `INVALID_PIPELINE_STAGE` | Preserved |
| Invalid rehydrated revision | Reject | `INVALID_PIPELINE_REVISION` | Preserved |
| Missing member inside state input | Reject through explicit domain boundary | Generic `TypeError` before domain error construction | Finding |
| Valid later stage fabricated through public rehydration | Must not fabricate a higher canonical state, or must require an authorized persisted-state proof | Later stage at revision `0` was constructed successfully | Finding / design-boundary risk |

No partial mutation, implicit rebase, or last-write-wins path was observed in
the executed advance path. Repository failures other than the explicit
`NOT_FOUND` outcome are delegated to the persistence owner and are not locally
implemented.

## 7. Test execution

| Command | Result |
|---|---|
| `prototype/node_modules/.bin/tsx.cmd --test tests/dom-001-ticket-004.test.ts` | `6/6` passed |
| `prototype/node_modules/.bin/tsx.cmd --test tests/*.test.ts` | `27/27` passed |
| `npm test` in `prototype` | `92/92` passed |
| Productive strict TypeScript check over domain/application modules | Passed |
| `npm run lint` in `prototype` | Passed |
| Runtime probe: successive transition through all 12 canonical stages | Passed; final stage `MAIN_UPDATE_AND_PUBLICATION`, revision `11` |
| Runtime probe: later-stage rehydration at revision `0` | Reproduced finding |
| Runtime probe: missing machine input | Reproduced `TypeError` finding |

`TESTS_RUN = 119` unique test cases (`27` productive and `92` prototype
regression tests). `TESTS_PASSED = 119`, `TESTS_FAILED = 0`,
`TESTS_SKIPPED = 0`, `ENVIRONMENTAL_FAILURES = 0`.

`git diff --check` reported pre-existing trailing whitespace in unrelated
modified documentation/ticket files. It did not affect runtime behavior and
was not changed under the read-only audit constraint.

## 8. Findings

### BEH-MAJOR-001

- Severity: `MAJOR`
- Ticket: `DOM-001-TICKET-004`
- Requirement / acceptance: `DOM-STATE-001`, `AC-DOM-010`
- Required behavior: a caller must not fabricate a higher canonical pipeline state; rehydration must preserve the valid persisted-state boundary.
- Production evidence: `src/domain/pipeline.ts:306-318` accepts any valid `PipelineStage` and any non-negative `PipelineRevision`; it does not require predecessor evidence, a transition record, or a stage/revision consistency proof.
- Test evidence: `tests/dom-001-ticket-004.test.ts:82-105` rejects only unknown stages, negative revisions, and missing scalar fields. The independent runtime probe constructed `MAIN_UPDATE_AND_PUBLICATION` at revision `0` successfully.
- Observed result: public `WorkflowPipeline.rehydrate` can produce a later-stage aggregate without passing through `advanceTo`.
- Expected result: a higher state must be either demonstrably valid persisted state or inaccessible through a caller-controlled fabrication path; the canonical path must remain the only way to advance.
- Problem: the boundary validates shape but not authorization/provenance of a later stage, leaving the “fabricate higher state” acceptance behavior unproven and bypassable through the public rehydration API.
- Impact: a storage/adapter caller can introduce a pipeline state that was never produced by the ordered transition path; downstream readers would observe a false higher state.
- Minimum correction: revalidate the approved rehydration contract and add a validated persisted-state proof (or another upstream-authorized provenance rule) before permitting later-stage rehydration. Do not infer a revision-to-stage formula without authority.
- Systemic pattern: `NO` within this ticket; the same public rehydration boundary is the affected path.
- Related locations: `src/domain/pipeline.ts:285-318`, `tests/dom-001-ticket-004.test.ts:82-105`.

### BEH-MINOR-001

- Severity: `MINOR`
- Ticket: `DOM-001-TICKET-004`
- Requirement / acceptance: `DOM-STATE-001`, `AC-DOM-010`; approved design section 19 requires malformed state input to fail closed at the boundary.
- Required behavior: malformed or missing machine input must be rejected as an explicit domain state-input failure before any transition or persistence call.
- Production evidence: `src/domain/pipeline.ts:217-227` dereferences `candidate.machine` before checking that `candidate` exists.
- Test evidence: the existing test covers an incompatible machine label and missing reader result, but not a missing member inside `PipelineStateInputSet`. The runtime probe reproduced a generic `TypeError`.
- Observed result: the input is rejected and no state is persisted, but the failure is not `PipelineDomainError('INVALID_PIPELINE_STATE', ...)`.
- Expected result: the state-input boundary should fail closed with its explicit domain error for missing and malformed members.
- Problem: adapter mistakes leak a generic JavaScript exception and make failure classification inconsistent.
- Impact: callers cannot reliably distinguish invalid state composition from an unexpected implementation error.
- Minimum correction: guard candidate existence/type before reading `machine`, returning the existing `INVALID_PIPELINE_STATE` domain failure; add one focused negative test.
- Systemic pattern: `NO`.
- Related locations: `src/domain/pipeline.ts:217-227`, `tests/dom-001-ticket-004.test.ts:122-143`.

### BEH-INFO-001

- Severity: `INFO`
- Ticket: `DOM-001-TICKET-004`
- Requirement / acceptance: approved design section 17 idempotency boundary; stale/CAS behavior remains the primary required safety property.
- Required behavior: an exact replay must not create a second pipeline transition or overwrite newer state.
- Production evidence: `AdvancePipelineHandler` invokes `advanceTo` against the current aggregate and the repository performs CAS, so an equivalent replay is rejected by stage order or stale revision.
- Test evidence: stale behavior is covered, but no test repeats the exact same command and asserts the second call has no additional effect.
- Observed result: no duplicate state was found; evidence is indirect.
- Expected result: one focused exact-replay assertion should make the retry boundary executable.
- Problem: test evidence does not directly prove the declared idempotency boundary.
- Impact: low; current executed paths show no duplicate transition.
- Minimum correction: add an exact replay test without changing production semantics.
- Systemic pattern: `NO`.
- Related locations: `src/application/pipeline.ts:23-43`, `tests/dom-001-ticket-004.test.ts:146-162`.

## 9. Regression and conditional results

`REGRESSION_RESULT: NO_REGRESSION`. The implementation baseline contains no
productive pipeline module; the full productive suite and the 92-test prototype
regression suite passed. No physical persistence, recovery, migration, or
foreign integration regression is locally provable because those boundaries
are explicitly outside this ticket.

```text
CONCURRENCY_RESULT: FULLY_CONFORMANT within the tested repository CAS seam
STALE_RESULT: CONFORMANT
IDEMPOTENCY_RESULT: CONFORMANT by execution trace; direct replay evidence incomplete
DURABILITY_RESULT: NOT_APPLICABLE
RECOVERY_RESULT: NOT_APPLICABLE
COMPATIBILITY_RESULT: PARTIAL
```

## 10. Specialist result

```text
Audit: docs/tickets/SPEC-DOM-001/DOM-001-TICKET-004-implementation-behavior-audit.md

Specialist:
IMPLEMENTATION_BEHAVIOR

Ticket: DOM-001-TICKET-004

Required behavioral dimensions: 5

Required tests: 11

Required tests missing: 1

Tests run: 119

Tests passed: 119

Tests failed: 0

Regressions: 0

Concurrency:
CONFORMANT

Stale behavior:
CONFORMANT

Idempotency:
CONFORMANT

Recovery:
NOT_APPLICABLE

Findings:
CRITICAL=0
MAJOR=1
MINOR=1
INFO=1

Domain audit complete:
YES

Specialist result:
SPECIALIST_BEHAVIOR_FINDINGS
```
