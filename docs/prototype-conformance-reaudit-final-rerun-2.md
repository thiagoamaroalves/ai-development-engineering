# Independent Final Prototype Conformance Reaudit — Scheduler/Identity Remediation

## 1. Formal verdict

`PROTOTYPE_REMEDIATION_REQUIRED`

The remediation claim `PROTOTYPE_REMEDIATION_COMPLETE` is not evidence of
conformance. This fresh audit closes `PCA-MAJOR-026` and confirms that the
previously closed findings remain closed, but material residual defects remain
in `PCA-MAJOR-027`, `PCA-MAJOR-028`, and `PCA-MINOR-007`. Consequently the full
`PCA-MAJOR-006` contract is only `PARTIALLY_CLOSED`.

## 2. Independence and method

Audit mode:

`READ_ONLY / INDEPENDENT / ADVERSARIAL / ADR_FIRST`

The remediation report and previous audits were treated as claims and test
leads only. The current files were inspected directly, the public scheduler
functions were exercised through fresh one-off probes, the current tests/lint/
build were run from the exact `prototype/` directory, and the repository state
was checked before this report was created. No source, test, dependency, ADR,
plan, traceability, coverage, or prior report was modified.

## 3. Authority and precedence

The audit used this precedence:

1. ADR-0001 through ADR-0014;
2. approved ADR portfolio records;
3. normative project documentation;
4. prototype plan, traceability, and coverage;
5. prior audit reports;
6. remediation reports as claims only;
7. current implementation, tests, probes, and runtime evidence.

The controlling requirements are persistent execution/activity/assignment
identity and immutable snapshots (ADR-0001), separated guarded state machines
(ADR-0002), assignment/session/cycle segregation (ADR-0004), one global bounded
capacity pool with fair priority and lease-backed dispatch (ADR-0005),
journal/checkpoint recovery (ADR-0006), and a frontend that only projects
domain authority (ADR-0014).

## 4. Current repository baseline and hashes

| Item | Independent result |
| --- | --- |
| Repository | `C:\Users\taalves\OneDrive - Octave\Documents 1\pessoal\ai-engineering-development` |
| Branch | `main` |
| HEAD | `4ae336c7f6a1dae468a23e1e9cbfe1fb95b63386` |
| `origin/main` | `4ae336c7f6a1dae468a23e1e9cbfe1fb95b63386` |
| Staged changes | none |
| Tracked unstaged changes | none |
| Applicable `AGENTS.md` | none found |
| Node/npm | `v22.17.0` / `11.7.0` |
| Prototype tracked by Git | no; `git ls-files prototype` returned zero entries |
| Exact historical implementation diff | unavailable; prototype and prior prototype reports are untracked |
| Dependencies | available in `prototype/node_modules`; `npm ls --depth=0` reported all declared packages present |
| Baseline untracked scope | `prototype/`, prior prototype reports, plan/traceability/coverage documents, and `docs/adrs/draw.io-31.3.2-windows-installer.exe` |

No change was attributed to a remediator because Git contains no historical
implementation diff for the untracked prototype.

Required SHA-256 values captured before writing this report:

| File | SHA-256 |
| --- | --- |
| `prototype/src/mockDomain.ts` | `754375967a72ea889b59c11bbb6df790bc71e8a8cd8254b4c1df8828f1db15f8` |
| `prototype/src/App.tsx` | `e8b8817618872e530a96d7c549b5be16bbe98837a2b12e28fe6077ee55f7265a` |
| `prototype/src/styles.css` | `e4c71d6d4aeed2cc582cff05f8709dcdbe2bc44c7190e68f2f6ad5624e5738bd` |
| `prototype/tests/mockDomain.test.ts` | `b68234add3cb169a5274fc7e431c98054ad7470e039cc28aa033a1ac0466dbe2` |
| `prototype/tests/ui.test.ts` | `02ff04dc628e7881eaf1124620c5ec63cf8eff19c3868e5543372e32a4e20ace` |
| `prototype/package.json` | `19057e64bff0a1e94d35233a8e926e52a48be3ee43f03100944a6e1d2dd42b25` |
| `prototype/package-lock.json` | `feb34da40e37b5075dffa3b9d9f77a95df26ebd01a26eadef53cb506fd301064` |
| `docs/prototype-conformance-remediation-final-rerun.md` | `c661d736c1238849cd8b60c5cdfbf69acd18e32d05cf5b8bcffaa311b888e6b0` |
| `docs/prototype-conformance-reaudit-final-rerun.md` | `7df8ba69e5b194d50dd51828cba5b8476d5667f3914b0518177890968d0aaff3` |

## 5. ADR integrity

All 14 individual ADR files independently matched the approved portfolio
baseline in `docs/adrs/ADR-0001-0014-portfolio-remediation-ASC-MAJOR-002-2026-08-28.md`.
Each has `decision_status: ACCEPTED`, `implementation_status: UNPROCESSED`,
and `revision: 3`. The raw file SHA-256 values equal the portfolio's
normalized values:

| ADR | SHA-256 | Result |
| --- | --- | --- |
| ADR-0001 | `33705082b9d2f46e638cd93bdf27ca676cfc6181a2684ad583e4501f5d06d50d` | PASS |
| ADR-0002 | `ef9289c6fca4bba73fca53ca38c71dd19110eb1cfe948358a7cca1fe14e177d9` | PASS |
| ADR-0003 | `6325234bb9c927a6d2b38886206119c643a05718f6db8cce8df5625653260073` | PASS |
| ADR-0004 | `5b2454da004f5ca0f7c0b6dd36c35aeeae642dbc139b5c11e1295e0db62a1e4c` | PASS |
| ADR-0005 | `c1a9aaef50599f06afb979edbe8ac1084bde3eada4b2d1bbf87c3d5be886917d` | PASS |
| ADR-0006 | `ab39573f39849d9d9016683096126a63b037d763f09b4f00293500fd8fbcc6b2` | PASS |
| ADR-0007 | `ee4d22de0ff3e71f325bbf4f702c5c20221303db141f1d873c4e9cc438d38428` | PASS |
| ADR-0008 | `f887895fac13c0236b2f34cc5db9c3e43ef97bcd8e3e8b537db2fc8fa0f94947` | PASS |
| ADR-0009 | `4ab502aea4f09afe2c5fa33bfb6c5ee0d11e2d8f9af65f244209ce1fac935761` | PASS |
| ADR-0010 | `874b77ac7f1f19fe0b22a95705721905ae861feecd1e043a956c5c1bbfdac186` | PASS |
| ADR-0011 | `f17a2f90f8c7d8058bb927786dadfeabbe112e5fd898fc50115d37c9d02b3971` | PASS |
| ADR-0012 | `f73cf9dd962be0a0a45b0f69aa6e22bd3f5c0ac713fa9cae23fa8d285e4a4d88` | PASS |
| ADR-0013 | `377b712c1544d07e3c4e1990b84c124afceec984e54ef8c1ba6fadba14a5f218` | PASS |
| ADR-0014 | `3ac6d6c75e05bd65b2d90cc754ffdc4885f36cd98eb7a87c6bfb8395f044c642` | PASS |

## 6. PCA-MAJOR-026 — lifecycle-aware global dispatch

Result: `CLOSED`.

Fresh shared-scheduler probes used three executions and a two-slot pool. A and
C were validly started while B remained unstarted. Only A/C acquired leases;
B remained `READY/IDLE`, its activity remained `READY`, and its canonical queue
member remained `ELIGIBILITY`. A second ordering left A unstarted and started B;
the unstarted execution did not receive a lease. With three executions and only
the middle execution started, only the middle execution was eligible.

The implementation evidence is the registered lifecycle predicate at
`prototype/src/mockDomain.ts:91-106`, canonical registration updates at
`prototype/src/mockDomain.ts:123-152`, and global selection/acquisition at
`prototype/src/mockDomain.ts:182-206`. The fresh probe also confirmed that a
valid later `START_RUN` changes the candidate from lifecycle-ineligible to
capacity-eligible; queued work is not lost.

The old failure mode—global selection leasing a candidate whose execution was
still `READY_TO_START`—was not reproduced through the current normal lifecycle
path. Public registration forgery remains a separate `PCA-MAJOR-027` boundary
defect, not a lifecycle regression.

## 7. Lifecycle matrix

The matrix below used registered canonical records and attempted enqueue plus
lease acquisition with known capacity.

| Execution state | Dispatch model | Queue reason | Lease acquired | Result |
| --- | --- | --- | --- | --- |
| `READY_TO_START` / `READY` / `IDLE` | not allowed | `ELIGIBILITY` | no | PASS |
| `RUNNING` / `PROCESSING` | allowed | `READY` | yes | PASS |
| `PAUSED` / `PAUSED` | not allowed | `ELIGIBILITY` | no | PASS |
| `RUNNING` / `WAITING_CAPACITY` | allowed when capacity is known | `READY` | yes | PASS |
| `RUNNING` / `FAILED` | not allowed | `ELIGIBILITY` | no | PASS |
| `RUNNING` / `RECOVERING` | allowed when recovery authority is valid | `READY` | yes | PASS |
| `CANCELLED` / `CANCELLED` | not allowed | `ELIGIBILITY` | no | PASS |
| `COMPLETED` / `COMPLETED` | not allowed | `ELIGIBILITY` | no | PASS |

Queue membership alone did not authorize dispatch in these probes.

## 8. PCA-MAJOR-027 — forged identity and mutation-boundary resistance

Result: `OPEN`.

The ordinary candidate and lease paths are improved: `enqueueSchedulerCandidate`
rejects an unregistered execution/activity/assignment at
`prototype/src/mockDomain.ts:169-180`; acquisition requires the exact queued
sequence and identity at `:190-206`; release requires all lease identity fields
to match at `:208-218`; and invalid capacity reconciliation with a negative,
non-integer, or too-small maximum rejects before mutation at `:154-167`.
Fresh forged enqueue/acquire/release probes left the scheduler snapshot and
revision unchanged.

The canonical boundary is still not safe:

1. The exported `registerSchedulerExecution` accepts arbitrary execution,
   run, activity, and assignment identities and overwrites an existing
   registration without validation or revision increment (`:123-135`). A
   fresh probe acquired a valid lease for `E/A/X`, then re-registered `E` with
   `FORGED-R` and no activities. The lease remained while its canonical activity
   mapping disappeared; the registration mutation did not advance revision.
2. `reconcileSchedulerCapacity` accepts arbitrary `leaseAssignments` and
   materializes them as `SYSTEM` leases (`:156-166`). A fresh call with
   `FORGED-ASSIGNMENT` changed an empty valid scheduler into a canonical lease
   for an unregistered owner.
3. `createMockScheduler` accepts invalid public options. A fresh
   `createMockScheduler({ maximum: -1 })` returned `maximum=-1`, `used=-1`,
   `available=0`, and three system leases. A
   `createMockScheduler({ maximum: 1.5, initialUsed: 1.5 })` returned a
   non-integer capacity with one lease. These invalid states are constructed
   without rejection or invariant validation.

These are canonical authority mutations, not caller-local projection changes.
They leave the implementation unable to prove that every lease resolves to the
canonical registered owner and that every accepted mutation preserves the
capacity invariant. The finding remains material even though the narrow forged
candidate and forged-release tests pass.

## 9. Scheduler mutation-boundary matrix

| Operation | Valid-path result | Adversarial result | Current classification |
| --- | --- | --- | --- |
| `registerSchedulerExecution` | Registers lifecycle/activity mapping | Arbitrary registration and overwrite accepted; revision unchanged | OPEN under PCA-MAJOR-027 |
| `enqueueSchedulerCandidate` | Registered composite identity required; duplicate upserted | Unregistered/foreign composite rejected atomically | CLOSED for this sub-boundary |
| `selectNextSchedulerCandidate` | Filters lifecycle, eligibility, capacity reason, fairness | Read-only selection does not mutate | CLOSED for this sub-boundary |
| `acquireSchedulerLease` | Exact canonical queued member becomes a lease | Forged execution/activity/assignment rejected | CLOSED for this sub-boundary |
| `releaseSchedulerLease` | Exact complete lease identity releases | Forged owner/unknown lease rejected | CLOSED for this sub-boundary |
| `reconcileSchedulerCapacity` | Invalid maximum/overflow rejected atomically | Arbitrary lease owner materialized; existing lease set can be replaced | OPEN under PCA-MAJOR-027 |
| `createMockScheduler` | Normal options create bounded pool | Negative/non-integer maximum accepted | OPEN under PCA-MAJOR-027 |
| `getSchedulerForState` | Existing scheduler is read | Missing scheduler ID creates/registers a scheduler | OPEN under PCA-MINOR-007 |

The current tests prove several negative command paths but do not make the
exported registration operation an authenticated owner-only boundary.

## 10. PCA-MAJOR-028 — persistent identity uniqueness

Result: `OPEN`.

Two normal executions created against one shared scheduler receive unique
execution, run, snapshot, activity, assignment, activity-session, activity-cycle,
candidate, and conformance identities because `remapExecutionIdentity` is
applied at `prototype/src/mockDomain.ts:506-527`. That is only a partial
solution.

The fresh A/B identity probe found these collisions:

| Identity type | A | B | Collision |
| --- | --- | --- | --- |
| Run | `RUN-2026-0831-01-EXECUTION-normal-1` | `RUN-2026-0831-01-EXECUTION-normal-2` | no |
| Activity IDs | execution-suffixed | execution-suffixed | no |
| Activity assignments | execution-suffixed | execution-suffixed | no |
| Activity sessions | execution-suffixed | execution-suffixed | no |
| Activity artifact cycles | execution-suffixed | execution-suffixed | no |
| Candidate/conformance IDs | execution-suffixed | execution-suffixed | no |
| Onboarding activity IDs | `ONB-ACT-BOOTSTRAP`, etc. | same values | YES |
| Onboarding assignments | `ONB-ASN-BOOT`, etc. | same values | YES |
| Onboarding sessions | `ONB-SES-BOOT-01`, etc. | same values | YES |
| Onboarding artifact cycle | `ONB-LEGACY-2026-01` | same value | YES |
| Event IDs | `EVT-0001`, `EVT-0002` | same values | YES |
| Command IDs | `1` | `1` | YES if persistent/global |
| Artifact names | `execution-manifest.json`, etc. | same names | applicable identity absent |
| Lease IDs after valid shared dispatch | scheduler sequence | scheduler sequence | no |

The remapper only rewrites identities in `state.activities`, related assignment
records, findings, publication, and recovery evidence. It does not rewrite the
execution-specific onboarding aggregate or per-state event/command identities.
ADR-0001 requires persistent identity for execution, activity, agent assignment,
artifact cycle, and effect/evidence relationships; the shared scheduler key
alone does not close those collisions. Cross-execution onboarding evidence and
event targets therefore remain ambiguous.

Independent factory calls without a shared scheduler remain structurally
deterministic, and the suite distinguishes that fixture property from shared
execution identity allocation. That distinction is correct; it does not cure
the shared persistent collisions.

## 11. Identity and ownership matrix

| Relationship | Valid current path | Adversarial/current evidence | Result |
| --- | --- | --- | --- |
| Activity → execution | Scheduler composite mapping resolves current activities | Public registration can replace mapping after lease creation | PARTIAL |
| Assignment → activity/execution | Normal shared activity assignments are unique and remapped | Onboarding assignments collide across executions | OPEN |
| Activity → session/cycle | Activity records are execution-suffixed | Onboarding records are not remapped | OPEN |
| Lease → activity/assignment | Exact canonical queue member used on acquisition | Registration overwrite can leave a lease without canonical activity mapping | OPEN |
| Event → target execution | Normal event target remapped for base run | `EVT-0001`/`EVT-0002` collide across executions | OPEN |
| Retry | New assignment/session, same idempotency key relationship, next attempt | Current retry tests pass; no new collision found in remapped activity domain | CLOSED |
| Assignment segregation | Remediator/reauditor and onboarding roles are checked | No regression found in valid scenario paths | CLOSED |

## 12. PCA-MINOR-007 — read-side purity

Result: `OPEN`.

The normal stale-reason separation now works. A fresh stale queue fixture was
created, 150 repeated `canExecute` calls were made across dispatch, cancel, and
priority guards, and the scheduler revision and deep scheduler snapshot stayed
unchanged. `canExecute` also left the deliberately stale queue reason untouched.
The explicit `reevaluateScheduler` call then changed the reason and, where
required, the revision. This closes the prior incidental queue-repair behavior.

One read-side authority mutation remains. `schedulerFor` at
`prototype/src/mockDomain.ts:88-90` falls back to `createMockScheduler()` when a
state contains an unknown scheduler ID. Because `canExecute` obtains a scheduler
snapshot during validation, a read against a stale/missing scheduler ID creates
and registers a new scheduler with a `SYSTEM` execution. A fresh probe observed
the newly created scheduler through the subsequent `getSchedulerForState` call.
That violates the requirement that read paths cannot create registration or
refresh canonical identity. It is localized but real, so the finding remains
open rather than closed.

## 13. Read-side purity evidence

| Probe | Expected | Observed |
| --- | --- | --- |
| 150 repeated guards on valid scheduler | no revision/state change | revision `1 → 1`; deep snapshot identical |
| stale queue reason + `canExecute` | no repair | stale reason unchanged |
| explicit `reevaluateScheduler` afterward | repair only here | reason recomputed; revision changed when reason changed |
| forged local `state.capacity` | no canonical overwrite | canonical scheduler unchanged |
| stale local projection | no authority change | canonical scheduler unchanged |
| fake local lease/queue projection | no lease/queue authority mutation | no canonical change observed |
| guard with missing scheduler ID | pure read | new `SCHEDULER-*` with `SYSTEM` registration created |

## 14. PCA-MAJOR-006 — complete shared scheduler contract

Result: `PARTIALLY_CLOSED`.

The following portions pass fresh tests or probes:

* one global scheduler object is shared by states created with the same
  scheduler;
* one-slot and two-slot bounds hold on valid inputs;
* `KNOWN`/`UNKNOWN` dispatch behavior is bounded;
* queue reasons and counters are derived from canonical queue members;
* valid lifecycle registration gates global dispatch;
* valid leases use canonical queue identities and release/redispatch works;
* cross-execution completion can cause another eligible execution to receive
  capacity;
* cancellation preserves unrelated shared-execution queue members;
* priority and anti-starvation fairness influence future selection;
* retry, recovery, assignment segregation, and read-side projection isolation
  pass their valid-path regressions.

The full contract cannot close because canonical registration/reconciliation
inputs can still create ownerless or structurally invalid capacity state
(`PCA-MAJOR-027`), and shared execution instances still collide on applicable
persistent identities (`PCA-MAJOR-028`). Read-side registration creation also
violates the no-projection-to-authority-write portion (`PCA-MINOR-007`).

## 15. Shared-pool probes

| Probe | Result |
| --- | --- |
| A/B/C, maximum 2 | two leases, third execution queued by capacity; no overcommit |
| A/B, maximum 1, B unstarted | A may lease; B remains `READY/IDLE` and lifecycle-ineligible |
| Valid later start of B | B registration changes to running; existing candidate remains and is reclassified according to capacity |
| Three executions, only middle started | only middle execution eligible for a lease |
| Release and global completion path | valid completion releases the current lease and global selection can dispatch another execution |
| `UNKNOWN` capacity | no new lease; candidates remain represented |
| `UNKNOWN → KNOWN` | valid registered candidates are preserved and bounded dispatch occurs |
| A/B/C cancellation isolation | cancellation removes only the cancelling execution's queue members in shared mode |

The direct low-level `releaseSchedulerLease` primitive only releases and
reevaluates reasons; the end-to-end completion path performs the subsequent
global dispatch. This distinction is consistent with the current API shape.

## 16. Priority and fairness regression

`PCA-MAJOR-023` remains `CLOSED`. The current suite's shared scheduler tests
exercise priority change, queue ordering, a two-consecutive-dispatch fairness
bound, and six dispatch opportunities. Fresh valid probes preserved bounded
capacity, selected higher priority when fairness permitted it, and prevented a
lower-priority execution from permanent starvation. No fairness history leak was
observed through valid execution removal/cancellation paths.

## 17. PCA-MAJOR-024 / PCA-MAJOR-025 regression

Both remain `CLOSED`.

`PCA-MAJOR-024`: recovery requires the known safe checkpoint, complete journal
positions, compatible replay interval, projection hash, replay key, and
authoritative evidence ID. Wrong evidence, missing evidence, evidence races
between request/accept/confirm, and repeated recovery are rejected without a
second recovery event (`prototype/tests/mockDomain.test.ts:584-633`).

`PCA-MAJOR-025`: same-revision and stale local capacity projections, fake local
leases, and local queue projections do not enter or erase scheduler authority.
The current guard reads canonical scheduler state rather than local capacity
projection state (`prototype/tests/mockDomain.test.ts:439-457` and fresh
projection probes). The remaining exported canonical registration seam is
classified under `PCA-MAJOR-027`, not reopened as a duplicate finding.

## 18. Other closed-finding regression

| Finding | Current state | Fresh evidence |
| --- | --- | --- |
| `PCA-CRITICAL-001` | CLOSED | UI commands still route through request/accept/confirm domain lifecycle |
| `PCA-MAJOR-001` | CLOSED | seven post-validation authority/input mutations reject `START_RUN` without start |
| `PCA-MAJOR-002` | CLOSED | separate functional/operational guards and explicit activity completion remain enforced |
| `PCA-MAJOR-003` | CLOSED | twelve deterministic scenario factories and domain journeys pass |
| `PCA-MAJOR-004` | CLOSED | PR confirmation revalidates base/head/tree/candidate/checks/merge evidence |
| `PCA-MAJOR-005` | CLOSED | shared ticket source, DAG recalculation, conflict/audit/integration/cancellation guards pass |
| `PCA-MAJOR-007` | CLOSED | onboarding bootstrap, migration, verification, audit, approval precede enablement |
| `PCA-MAJOR-008` | CLOSED | normative controls have handlers, guards, rejection/effect evidence |
| `PCA-MINOR-001` | CLOSED | accessible names, ARIA/live status/focus and status semantics remain present |
| `PCA-MAJOR-018` | CLOSED | assignment reuse rejection and retry/reauditor segregation pass |
| `PCA-MAJOR-019` | CLOSED | divergence remains classification → decision → compatible effect |
| `PCA-MAJOR-020` | CLOSED | onboarding roles, sessions, assignments, and cycles are segregated within an execution |
| `PCA-MINOR-003` | CLOSED | real React/jsdom mount and causal DOM interactions pass |
| `PCA-MAJOR-021` | CLOSED locally | local start/retry capacity and lease guards pass; global residual is 006/027/028 |
| `PCA-MINOR-004` | CLOSED | variant B navigation controls have accessible names |
| `PCA-MINOR-005` | CLOSED | current status/color semantics remain adequate in available checks |
| `PCA-MAJOR-022` | CLOSED | waiting work cannot complete; confirmed completion releases leases |
| `PCA-MINOR-006` | CLOSED | current suite count is independently 73/73 |
| `PCA-MAJOR-023` | CLOSED | priority and fairness behavior remains bounded and causal |
| `PCA-MAJOR-024` | CLOSED | recovery evidence and race/idempotency guards pass |
| `PCA-MAJOR-025` | CLOSED | local projection cannot mutate scheduler authority |

Previously closed findings reopened: `0`.

## 19. Twelve-scenario regression

The current `prototype/tests/mockDomain.test.ts:900-941` journey and the
deterministic factory test at `:677-681` cover all twelve scenario families,
with reset/isolation represented by fresh factory calls:

| Scenario | Independent result |
| --- | --- |
| normal | validate → start → complete activities → publish direct; pass |
| audit | remediator activities and independent reaudits; pass |
| capacity | `UNKNOWN` blocks dispatch, reconciliation restores bounded dispatch; pass |
| retry | failed activity gets new assignment/session and next attempt; pass |
| rounds | human authorization advances one allowed round extension; pass |
| conflict | resolve → integration audit → wave integration; pass |
| divergence | classify → human decision → compatible corrective effect; pass |
| recovery | valid checkpoint/evidence recovery and adversarial rejection; pass |
| drift | invalidation → revalidation → direct publication; pass |
| PR | approval → merge → remote confirmation; pass |
| migration | bootstrap → migration → verify → audit → approval → enable; pass |
| ADR mutation | mutated ADR blocks validation; restoration returns snapshot to draft; pass |

The tests prove deterministic domain journeys, not real persistence or real
concurrency. Shared identity probes were run separately and found the residual
028 collisions.

## 20. Tests, lint, and build

Executed from:

`C:\Users\taalves\OneDrive - Octave\Documents 1\pessoal\ai-engineering-development\prototype`

```text
npm test
1..73
# tests 73
# pass 73
# fail 0
# cancelled 0
# skipped 0
# todo 0
exit code 0
```

```text
npm run lint
tsc --noEmit
exit code 0 — PASS
```

```text
npm run build
tsc -b && vite build
vite v8.2.2
1820 modules transformed
exit code 0 — PASS
```

## 21. Test-quality assessment

The added scheduler tests are causal for lifecycle gating, paused/cancelled
dispatch, forged candidate/lease release, capacity overflow rejection, shared
leases, identity remapping in the activity domain, stale queue reason purity,
and explicit reevaluation. The test suite also has real React/jsdom mounting and
causal UI actions.

Coverage limitations remain material to the audit rather than test failures:

* shared identity tests compare execution/run/activity/assignment/session values
  but do not enumerate onboarding, event, and command collisions;
* the helper used by several scheduler tests registers candidates through the
  same exported registration function whose trust boundary is under audit;
* read-purity tests cover stale reason repair separation but not the missing
  scheduler fallback that creates a `SYSTEM` registration;
* invalid factory options and arbitrary `leaseAssignments` are not asserted;
* no test independently validates globally unique persistent event/correlation
  identities across A/B/C.

## 22. Browser validation

No in-app browser control tool was available in this session, so visual browser
smoke testing, accessibility-tree inspection, and console diagnostics could not
be independently repeated. A non-browser HTTP smoke check against the already
running local Vite server returned `200 text/html` and contained the root mount
element. The UI/domain tests provide the available DOM evidence. Scheduler
lifecycle, mutation-boundary, identity, and read-side authority properties are
domain-only because the UI does not expose those internals.

Browser result: `UNAVAILABLE_FOR_INDEPENDENT_BROWSER_SMOKE`.

## 23. Static integration scan

Static scanning of prototype source, tests, and package metadata found no
executable `fetch`, axios, WebSocket, EventSource, child-process spawn/exec,
Git/gh invocation, Codex CLI execution, database client, SMTP, external API,
IndexedDB, localStorage, or sessionStorage. URLs in `package-lock.json` are
package-resolution metadata, not runtime integrations. Textual mentions of Git,
Codex CLI, and localhost are mock labels/messages only.

## 24. New findings in this rerun

No distinct finding beyond the carried-forward remediation targets was required:

```text
CRITICAL=0
MAJOR=0
MINOR=0
INFO=0
```

The target findings that remain actionable are listed below with current
evidence. They were not inherited as closed or accepted from the remediation
report.

### PCA-MAJOR-027 — canonical scheduler registration/reconciliation boundary remains forgeable

Affected contract: PCA-MAJOR-006, PCA-MAJOR-027; ADR-0001 and ADR-0005.

Minimum correction: validate registration ownership and identity relationships
before any canonical write; prevent registration overwrite while leases exist;
validate every reconciled lease against canonical execution/activity/assignment
records; reject invalid factory capacity options; preserve atomicity and advance
revision for actual canonical mutations.

### PCA-MAJOR-028 — execution-specific persistent identities still collide

Affected contract: PCA-MAJOR-006, PCA-MAJOR-028; ADR-0001 and ADR-0004.

Minimum correction: allocate globally unique identities for execution-specific
onboarding activities/assignments/sessions/cycles and persistent event/command
correlation records, while retaining deterministic fixture behavior only where
the identity scope is explicitly local and non-persistent.

### PCA-MINOR-007 — missing-scheduler read fallback mutates authority

Affected contract: PCA-MINOR-007, PCA-MAJOR-006; ADR-0014.

Minimum correction: make all read/query paths fail closed or return an explicit
unknown state for a missing scheduler; only an explicit canonical lifecycle or
reevaluation operation may create registration or increment scheduler revision.

## 25. Consolidated finding table

| Finding | Previous state | Current state | Independent evidence |
| --- | --- | --- | --- |
| `PCA-CRITICAL-001` | OPEN | CLOSED | Request/accept/confirm domain lifecycle and UI routing remain causal |
| `PCA-MAJOR-001` | PARTIAL/CLOSED in prior reruns | CLOSED | Fresh post-lock ADR/base/config/skills/repository mutation matrix rejects start |
| `PCA-MAJOR-002` | PARTIAL | CLOSED | Explicit completion, state separation, and publication gates pass |
| `PCA-MAJOR-003` | OPEN | CLOSED | Twelve deterministic domain journeys pass |
| `PCA-MAJOR-004` | PARTIAL | CLOSED | PR post-merge identity/hash/evidence mutation matrix rejects stale confirmation |
| `PCA-MAJOR-005` | OPEN | CLOSED | Shared ticket source, DAG, conflict, audit, integration, cancellation paths pass |
| `PCA-MAJOR-006` | PARTIAL | PARTIALLY_CLOSED | Valid shared pool/lifecycle behavior passes; 027/028/007 prevent full contract closure |
| `PCA-MAJOR-007` | OPEN | CLOSED | Bootstrap, migration, verification, audit, and approval precede enablement |
| `PCA-MAJOR-008` | OPEN | CLOSED | Controls have guards, handlers, rejection/effect evidence |
| `PCA-MINOR-001` | OPEN | CLOSED | Names, ARIA, live status, focus, and status semantics remain present |
| `PCA-MAJOR-018` | REMEDIATED | CLOSED | Assignment reuse rejected; retry and reauditor isolation pass |
| `PCA-MAJOR-019` | REMEDIATED | CLOSED | Divergence classification, decision, and compatible effect remain separate |
| `PCA-MAJOR-020` | REMEDIATED | CLOSED | Onboarding role/session/assignment segregation passes |
| `PCA-MINOR-003` | REMEDIATED | CLOSED | Real React/jsdom mount and causal UI journey pass |
| `PCA-MAJOR-021` | REMEDIATED | CLOSED locally | Local start/retry lease guards pass; global residual remains under 006/027/028 |
| `PCA-MINOR-004` | REMEDIATED | CLOSED | Variant B navigation names pass |
| `PCA-MINOR-005` | REMEDIATED | CLOSED | Current status/color semantics pass available checks |
| `PCA-MAJOR-022` | REMEDIATED | CLOSED | Waiting work cannot complete; completion releases lease |
| `PCA-MINOR-006` | REMEDIATED | CLOSED | Independent current suite is 73/73 |
| `PCA-MAJOR-023` | REMEDIATED | CLOSED | Priority and fairness alter valid future selection without starvation |
| `PCA-MAJOR-024` | PARTIAL | CLOSED | Evidence identity, safe checkpoint, race rejection, and idempotency pass |
| `PCA-MAJOR-025` | OPEN | CLOSED | Local same/stale projections cannot mutate canonical scheduler |
| `PCA-MAJOR-026` | OPEN | CLOSED | Unstarted/paused/failed/cancelled/terminal executions receive no lease |
| `PCA-MAJOR-027` | OPEN | OPEN | Exported registration overwrite, forged reconciliation owner, and invalid factory capacity remain accepted |
| `PCA-MAJOR-028` | OPEN | OPEN | Shared A/B execution probe finds onboarding/event/command identity collisions |
| `PCA-MINOR-007` | OPEN | OPEN | Standard reads are pure, but missing scheduler read fallback creates `SYSTEM` registration |

Current finding counts by unresolved material result:

```text
CRITICAL=0
MAJOR=3  (PCA-MAJOR-006 residual contract, PCA-MAJOR-027, PCA-MAJOR-028)
MINOR=1 (PCA-MINOR-007)
INFO=0
```

For the final response's “new findings” field, the counts are zero because all
four unresolved items were already identified in the immediately preceding
rerun; the current audit independently revalidated their status rather than
creating duplicates.

## 26. Files modified

Authorized write:

`docs/prototype-conformance-reaudit-final-rerun-2.md`

No source, tests, dependencies, ADRs, plans, traceability, coverage, prior
reports, or remediation reports were modified. The build outputs under
`prototype/dist/` and `prototype/tsconfig.tsbuildinfo` are ignored artifacts and
were not included in the audited source change set.

## 27. Final recommendation

Do not approve `PROTOTYPE_CONFORMANT`.

Exact actionable remaining findings:

1. `PCA-MAJOR-027` — close the exported scheduler registration and capacity
   reconciliation authority boundary; reject forged/unregistered identities,
   invalid capacity construction, and overwrite of leased registrations while
   preserving atomicity and revision semantics.
2. `PCA-MAJOR-028` — allocate unique persistent onboarding and event/command
   correlation identities across shared executions; retain determinism only for
   explicitly local fixture scope.
3. `PCA-MINOR-007` — prevent missing-scheduler query paths from creating or
   registering canonical scheduler state; keep repair/revision changes explicit.

This report performs no remediation.
