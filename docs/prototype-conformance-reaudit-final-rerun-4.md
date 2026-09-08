# Independent Final Prototype Conformance Reaudit — Final Rerun 4

## 1. Formal verdict

PROTOTYPE_REMEDIATION_REQUIRED

The remediation report at `docs/prototype-conformance-remediation-final-rerun-3.md` was treated as a claim only. Independent static inspection, fresh TypeScript probes, a real browser smoke test, and the required verification commands show that PCA-MAJOR-027 and PCA-MAJOR-028 remain OPEN, PCA-MAJOR-006 remains PARTIALLY_CLOSED, PCA-MAJOR-029 is CLOSED, and PCA-MAJOR-021 has regressed in the real UI start path. The prototype cannot receive PROTOTYPE_CONFORMANT.

## 2. Independence and method

Mode: READ_ONLY / INDEPENDENT / ADVERSARIAL / ADR_FIRST.

I inspected the current repository, ADRs, prototype source, tests, package lock, prior audit, and remediation report directly. Prior reports and `prototype/fresh-adversarial-probe.ts` were used as historical context and one probe data point, not as proof. Additional one-off TypeScript probes were constructed and executed without writing files. A local Vite server was started temporarily for browser validation and stopped after the smoke test.

No prototype source, tests, package files, ADRs, planning artifacts, traceability, coverage, remediation reports, or previous audit reports were modified. The only authorized repository write is this report.

## 3. Authority and precedence

The applied precedence was:

1. ADR-0001 through ADR-0014.
2. Approved ADR portfolio records.
3. Normative project documentation.
4. Plan, traceability, and coverage artifacts.
5. Prior independent audits.
6. Remediation reports as claims only.
7. Implementation, tests, and fresh runtime evidence.

The controlling authority requires persistent identity and immutable snapshots (ADR-0001), guarded and separate state machines (ADR-0002), session/assignment/cycle segregation (ADR-0004), one global bounded fair lease pool (ADR-0005), journal/idempotency/recovery (ADR-0006), and a frontend that consumes backend/domain projections rather than becoming authority (ADR-0014).

## 4. Repository baseline

| Item | Fresh result |
| --- | --- |
| Repository | `C:\Users\taalves\OneDrive - Octave\Documents 1\pessoal\ai-engineering-development` |
| Branch | `main` |
| HEAD | `4ae336c7f6a1dae468a23e1e9cbfe1fb95b63386` |
| `origin/main` | `4ae336c7f6a1dae468a23e1e9cbfe1fb95b63386` |
| Staged changes | none |
| Tracked unstaged changes | none |
| Prototype tracked by Git | no; `git ls-files prototype` returned no entries |
| Historical implementation diff | unavailable; prototype is untracked |
| Node/npm | `v22.17.0` / `11.7.0` |
| Dependencies | installed; `npm ls --depth=0` resolved all declared packages |
| Other untracked material | prior reports/plans and `docs/adrs/draw.io-31.3.2-windows-installer.exe` |

The untracked prototype means Git cannot independently identify the remediator's implementation diff. The baseline is therefore the current filesystem state, with fresh hashes below.

## 5. Fresh hashes

| File | SHA-256 |
| --- | --- |
| `prototype/src/mockDomain.ts` | `4ea3aea62ca2b6f92496683b7eb706003e9dd2ac91e0c95a39220e48700aace1` |
| `prototype/src/App.tsx` | `e8b8817618872e530a96d7c549b5be16bbe98837a2b12e28fe6077ee55f7265a` |
| `prototype/src/main.tsx` | `77aaa85d0a532963cd63d1c6171a833f73b608dd83b4085f855b279dbe922939` |
| `prototype/src/styles.css` | `e4c71d6d4aeed2cc582cff05f8709dcdbe2bc44c7190e68f2f6ad5624e5738bd` |
| `prototype/tests/mockDomain.test.ts` | `9e3a30071931b10703bc096c9355a56c65b9dd1bb6042f382e748937384062fe` |
| `prototype/tests/ui.test.ts` | `02ff04dc628e7881eaf1124620c5ec63cf8eff19c3868e5543372e32a4e20ace` |
| `prototype/fresh-adversarial-probe.ts` | `b30582b0acdd10dcbb4094422eaaab28c17942f0275c95fc75a82b7460bb362e` |
| `prototype/package.json` | `19057e64bff0a1e94d35233a8e926e52a48be3ee43f03100944a6e1d2dd42b25` |
| `prototype/package-lock.json` | `feb34da40e37b5075dffa3b9d9f77a95df26ebd01a26eadef53cb506fd301064` |
| `docs/prototype-conformance-remediation-final-rerun-3.md` | `40728b534474798c512c0aaf8725f9fbfe2771b2f3a680711edb009640412733` |

The current source/test hashes are newly computed and were not copied from the remediation report.

## 6. ADR integrity

The approved rev3 portfolio record is `docs/adrs/ADR-0001-0014-portfolio-remediation-ASC-MAJOR-002-2026-08-28.md`, whose rev3 hash table was compared with fresh hashes. All 14 ADRs match. Each current front matter independently reports `decision_status: ACCEPTED`, `implementation_status: UNPROCESSED`, and `revision: 3`; no unexpected ADR mutation was found.

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

## 7. PCA-MAJOR-027 — canonical scheduler authority boundary

Result: OPEN.

Positive evidence remains: canonical state and the capability are kept in `WeakMap`s (`prototype/src/mockDomain.ts:124-127`); projections are cloned/deep-frozen (`:129-149`); and the guarded seams call `requireSchedulerAuthority` (`:217`, `:224-225`, `:279-280`, `:328-329`, `:346-347`, `:368-369`, `:387-388`). Fresh forged and cross-scheduler capability probes failed closed. Fresh projection mutation attempts did not change revision or canonical snapshot.

The boundary is nevertheless not conformant:

1. Registration validation is syntactic rather than domain-owned. `validateSchedulerRegistration` validates ID shapes, enums, uniqueness, and optional role/cycle shapes (`:248-270`), but it does not prove that the registered activity, assignment, role, or cycle belongs to the registering execution. A fresh registration with `EXEC-OWN`, `ACT-OWN`, `ASN-OWN`, role `AUDITOR`, and unrelated cycle `AC-UNRELATED` was accepted, enqueued, and leased using the legitimate scheduler capability. This violates the required mismatched ownership/relationship probes.
2. Scheduler IDs are not unique or protected at the registry boundary. `schedulerRegistry.set` overwrites an existing ID (`:127`, `:177`, `:635`), and `schedulerFor` resolves state by that mutable string key (`:180-183`). Two independent `createScenarioState('normal')` calls both produced `SCHEDULER-normal`, and both states subsequently resolved to the second scheduler object. This is an authority/identity collision, not merely a display issue.
3. Reconciliation accepts an incoherent conservative ceiling: `reconcileSchedulerCapacity` checks only non-negative integer shape (`:330-332`). A fresh `KNOWN maximum: 1, conservativeCeiling: 99` call succeeded and set the canonical ceiling to 99 (`:338-343`). The constructor clamps its default, but the productive reconciliation seam permits an out-of-bound value.
4. The real browser path exposes a non-atomic integration failure. `main.tsx:7` renders `StrictMode`, while `App.tsx:40` schedules domain-mutating `advanceCommand` calls inside React state updaters. Clicking “Confirmar e iniciar” in the built dev app caused the current source invariant at `mockDomain.ts:607` to throw (`scheduler queue member ACT-8F12 has an inconsistent state in normal`), blanking the page. This is separately tracked as a regression of PCA-MAJOR-021 below, but it also prevents the frontend from reliably consuming canonical scheduler state.

## 8. Complete scheduler mutation inventory

| Seam/operation | Current authority | Current effect | Atomic/revision assessment |
| --- | --- | --- | --- |
| `createMockScheduler` | constructor; registry keyed by string ID | creates canonical scheduler, SYSTEM leases, SYSTEM registration | validates most capacity inputs; ID uniqueness and reconciliation ceiling boundary are missing |
| `registerSchedulerExecution` | exact scheduler capability | adds immutable execution registration | pre-write validation; +1; exact replay no-op |
| `updateSchedulerExecutionRegistration` | exact scheduler capability | legal execution lifecycle and activity/eligibility update | pre-write transition guard; +1 on change; refreshes reasons |
| `reconcileSchedulerCapacity` | exact scheduler capability | status, maximum, ceiling, counters, canonical lease reconciliation | pre-write checks; +1 on material change; ceiling bound incomplete |
| `enqueueSchedulerCandidate` | exact scheduler capability | queue insert/update and sequence allocation | +1 on material change; registration ownership insufficient |
| `selectNextSchedulerCandidate` | read-only projection | fair priority/sequence selection | no mutation |
| `acquireSchedulerLease` | exact scheduler capability | queue removal, lease creation, used/available/fairness update | +1; accepts the forged-but-registered ownership case |
| `releaseSchedulerLease` | exact scheduler capability | non-SYSTEM lease removal and capacity release | SYSTEM release is guarded; +1 on real release |
| `reevaluateScheduler` | exact scheduler capability | queue reason refresh | +1 only when reason changes |
| internal `removeFromFairQueue` / cleanup | scheduler state obtained internally | queue removal for completion/cancel/terminal paths | +1 on removal; scope depends on state registry identity |
| internal dispatch/allocation | canonical capability obtained internally | enqueues all eligible work and allocates leases | bounded in direct domain probes; browser updater integration is non-idempotent |
| priority/fairness mutation | internal canonical state in `applyEffect` | queue priority and fairness cursor changes | material mutation advances revision |
| sequence, lease, execution allocation | internal canonical state | allocates persistent scheduler numbers/IDs | advances via containing mutation; duplicate scheduler IDs can collide across instances |
| reads/snapshots | no productive authority | cloned frozen projections | direct and nested projection mutation did not alter canonical state |

No unguarded productive exported seam was found after remediation; the remaining defect is that exact capability possession does not establish domain ownership of registration contents, and the registry can alias separate scheduler instances.

## 9. Registration, lifecycle, authority, and projection probes

Fresh results:

| Probe | Result |
| --- | --- |
| shape-forged capability | rejected |
| copied/frozen equivalent capability | rejected |
| scheduler A capability against scheduler B | rejected |
| missing capability at productive seam | rejected |
| nested projection mutation | rejected by freeze / no canonical change |
| malformed lifecycle registration | rejected atomically; revision and snapshot unchanged |
| exact complete replay | no-op in current implementation/tests |
| altered same-identity replay | rejected |
| `RUNNING → READY` | rejected with no revision/state change |
| pause transition | accepted; queue reason immediately became `ELIGIBILITY` |
| malformed ownership role/cycle relationship | accepted when shape-valid; OPEN defect under PCA-MAJOR-027 |
| terminal/cancelled/unstarted lease eligibility | no valid lease in fresh direct probes |

The immediate queue refresh path works for the exercised pause case. The browser failure demonstrates that the same invariants are not robust under the actual React execution path.

## 10. SYSTEM reservation evidence

Fresh normal start/cancel evidence preserved all four canonical SYSTEM leases (`SYSTEM-RESERVATION-044`, `039`, `041`, `028`) while releasing user leases. Ordinary release of a SYSTEM lease returned `false`; cancellation cleanup retained SYSTEM leases; capacity remained `used=4`, `available=1`, `maximum=5`. Constructor probes rejected arbitrary, duplicate, malformed, and cross-capacity reservation inputs. Valid `KNOWN 0`, `KNOWN 1`, UNKNOWN, and valid reservation cases constructed successfully.

The protected SYSTEM behavior is therefore CLOSED within the tested domain paths. The scheduler authority finding remains OPEN because ownership validation, registry identity, and reconciliation ceiling validation are not closed.

## 11. Revision evidence

Fresh direct probe of reconciliation showed:

| Operation | Revision result |
| --- | --- |
| real conservative-ceiling change `2 → 4` | `1 → 2` |
| exact no-op reconciliation | remained `2` |
| rejected malformed registration | unchanged |
| rejected lifecycle transition | unchanged |
| real queue insert/lease/release | advanced |

The prior ceiling-only revision omission is remediated for an in-bound change. The seam still accepts `maximum=1, conservativeCeiling=99`, so capacity configuration validation is not fully conformant.

## 12. PCA-MAJOR-028 — persistent publication identity

Result: OPEN.

The positive shared-scheduler case now separates concurrent PR publications. Two PR executions on the same scheduler/repository both used display number 184 but received distinct canonical IDs containing distinct execution and candidate IDs. Evidence copied from A to B did not make `CONFIRM_REMOTE` admissible.

The identity contract is still incomplete:

1. `CHANGE_CANDIDATE` changes the current head/tree (`mockDomain.ts:845`) and `REVALIDATE_PUBLICATION` updates hashes and conformance run (`:846`) but neither allocates a new candidate identity or publication identity. A fresh probe changed the candidate, revalidated it, and observed the exact same `publicationIdentity.canonicalId`. This fails the required genuinely-new-publication distinction.
2. Two independent `createScenarioState('pr')` calls use the same scheduler ID, execution ID, candidate ID, and PR number, producing identical canonical publication IDs. This is the registry collision described in PCA-MAJOR-027 and independently violates persistent publication uniqueness.

Retries and recovery of the same publication preserve identity in the direct model, and cross-evidence rejection passes. Those positives do not close the new-publication and independent-instance collisions.

## 13. Persistent publication identity inventory

| Identity | Current status |
| --- | --- |
| execution | distinct for shared scheduler executions; collides for separate same-scenario registry instances |
| candidate | distinct after shared execution remapping; unchanged by `CHANGE_CANDIDATE` |
| canonical publication identity | distinct for shared scheduler; identical for two independent `pr` fixtures with the same scheduler ID |
| display PR number | 184 in both concurrent shared executions; correctly non-authoritative only when canonical ID differs |
| provider/repository/scheduler | provider/repository fixed; scheduler string ID can alias separate schedulers |
| merge evidence | derived from canonical ID; cross-evidence probe rejected |
| remote confirmation evidence | derived from canonical ID; no cross-confirmation in tested shared case |
| event/command/correlation IDs | execution-scoped in shared fixtures; not independently unique across duplicate same-scenario fixtures |
| artifact/evidence IDs | scoped for shared execution; fixture identity collision remains possible through duplicate scheduler/execution identity |

## 14. PCA-MAJOR-029 — complete canonical queue population

Result: CLOSED.

The exact prior shape was independently reproduced with a shared scheduler configured as `maximum: 5, initialUsed: 2`. After `VALIDATE_SNAPSHOT` and `START_RUN`, the scheduler had `used=3`, `available=2`, one user RUNNING activity, and four remaining READY queue candidates. Eligible work remained represented independently of available lease capacity.

Fresh capacity matrix results for one registered eligible candidate:

| Maximum / initial used | Queue reason | Queue present |
| --- | --- | --- |
| 0 / 0 | CAPACITY | yes |
| 1 / 0 | READY | yes |
| 1 / 1 | CAPACITY | yes |
| 2 / 0 | READY | yes |
| 2 / 1 | READY | yes |
| 3 / 0 | READY | yes |
| 3 / 1 | READY | yes |
| 5 / 2 | READY | yes |

The direct 12-scenario probe found all initial factories coherent and the representative normal, capacity, retry, and recovery transitions coherent. A fresh shared A/B/C probe with capacity 3 acquired one lease per execution, completed A, retained B and C lease ownership, kept all remaining queue entries canonical, preserved `used + available = maximum`, and found no foreign lease. Completion/release did not strand the remaining represented work in that probe.

This finding is CLOSED subject to the residual scheduler-contract and browser integration findings; no queue-population defect was found in this reaudit.

## 15. Shared A/B/C scheduler probe

Fresh scenario: one scheduler, maximum 3, initial used 0, three independently remapped normal executions. After each snapshot validation and start:

- leases were owned by `EXECUTION-normal-1`, `EXECUTION-normal-2`, and `EXECUTION-normal-3`;
- `used=3`, `available=0`, and all 12 remaining activities were canonically queued with `CAPACITY` reason;
- after A completed, its lease was released and a new lease was allocated to A's next candidate while B and C leases remained owned by B and C;
- the queue still contained candidates from all three executions;
- no foreign lease existed and capacity remained bounded.

This probe passed. It does not cure the separate duplicate scheduler ID or candidate identity rollover failures.

## 16. PCA-MAJOR-006 — complete scheduler-contract assessment

Result: PARTIALLY_CLOSED.

The direct domain model now demonstrates a shared bounded pool, priority/sequence selection, capacity equations, lifecycle-aware eligibility, complete queue population, lease-backed dispatch, release, SYSTEM reservation protection, KNOWN/UNKNOWN handling, reconciliation, cancellation isolation, retry/recovery direct paths, projection isolation, and revision behavior for representative mutations.

The complete contract cannot close because:

- PCA-MAJOR-027 remains OPEN for domain-ownership validation, scheduler registry identity aliasing, and out-of-bound reconciliation ceiling input;
- PCA-MAJOR-028 remains OPEN for genuinely new publication identity and independent fixture collisions;
- PCA-MAJOR-021 has regressed in the actual browser start path, leaving a UI state updater able to trigger an invariant exception and blank the application.

No alternate unguarded productive scheduler seam was found in the current exports. The residual issues are sufficient to fail the complete scheduler and frontend/domain integration contract.

## 17. Regression of PCA-MAJOR-024 / 025 / 026 / PCA-MINOR-007

| Finding | Result | Evidence |
| --- | --- | --- |
| PCA-MAJOR-024 | CLOSED | fresh direct recovery evidence, safe checkpoint, journal interval, replay identity, race rejection, and idempotency checks passed |
| PCA-MAJOR-025 | CLOSED | projection/copy/stale-state mutation attempts did not change canonical scheduler state |
| PCA-MAJOR-026 | CLOSED | unstarted, paused, failed, cancelled, and terminal executions did not obtain valid leases in direct probes |
| PCA-MINOR-007 | CLOSED | missing scheduler reads failed closed; no authority was created by read-side access |

The remaining registration ownership gap is consolidated under PCA-MAJOR-027, not duplicated under PCA-MAJOR-025 or PCA-MAJOR-026.

## 18. Regression of other closed findings

PCA-MAJOR-021 is reopened: local direct start/retry behavior remains guarded, but the real browser's “Confirmar e iniciar” action blanked the app with the current source invariant at `prototype/src/mockDomain.ts:607`, invoked through the React updater at `prototype/src/App.tsx:40` under `prototype/src/main.tsx:7` StrictMode.

PCA-MAJOR-022, PCA-MAJOR-023, PCA-MAJOR-024, PCA-MAJOR-025, PCA-MAJOR-026, PCA-MINOR-007, PCA-MINOR-003, PCA-MINOR-004, PCA-MINOR-005, and the other previously closed scenario/state findings remained closed on their directly tested obligations. The browser regression is not duplicated into those findings.

Previously closed findings reopened: 1 (`PCA-MAJOR-021`).

## 19. Twelve scenario regression

Freshly constructed scenarios `normal`, `audit`, `capacity`, `retry`, `rounds`, `conflict`, `divergence`, `recovery`, `drift`, `pr`, `migration`, and `adr-mutation` all passed initial `assertCoherentState`. Representative direct transitions for normal, capacity reconciliation, retry, and recovery also passed coherence assertions. The required existing suite covered full deterministic journeys for all 12 scenario families and passed.

The browser normal-start journey is the exception: route and initial state loaded, but the confirmed start transition threw and blanked the page. Thus scenario-domain regression is green while end-to-end browser regression is not.

## 20. Tests, lint, and build

Executed from `prototype/`:

- `npm test` — PASS, 87 tests, 87 passed, 0 failed, 0 skipped.
- `npm run lint` — PASS (`tsc --noEmit`).
- `npm run build` — PASS (`tsc -b` and Vite production build; Vite 8.2.2).
- `npx tsx fresh-adversarial-probe.ts` — PASS (`FRESH_ADVERSARIAL_PROBE_PASS`).

Green tests are evidence only. They do not cover the actual StrictMode browser state-updater behavior, domain-ownership proof for shape-valid registrations, duplicate scheduler IDs, or new publication identity rollover.

## 21. Test-quality assessment

The current suite has materially improved causal coverage: exact scheduler capabilities, deep projection mutation, atomic registration rejection, lifecycle refresh, SYSTEM cleanup, constructor capacity validation, ceiling revision/no-op behavior, multi-slot queue population, shared leases, publication evidence isolation, and all 12 deterministic scenario families are directly exercised.

Remaining quality gaps are material:

- registration tests validate syntactic role/cycle fields but do not prove domain ownership or mismatched relationship rejection;
- constructor/reconciliation tests do not reject an out-of-bound conservative ceiling;
- no test prevents duplicate scheduler IDs from aliasing state;
- publication tests prove concurrent shared execution separation but do not require a new identity after a genuinely changed candidate;
- jsdom UI tests do not reproduce the browser's StrictMode/state-updater failure;
- the existing adversarial probe is useful but was created by the remediation agent and omits these newly discovered cases.

## 22. Browser/UI result

Browser capability was available and used. A temporary Vite server was exposed at `http://192.168.15.5:5173/` because the in-app browser could not reach loopback directly.

Passed browser observations:

- overview loaded;
- repository, executions, publication, and new-execution routes loaded;
- scenario selector displayed all 12 scenarios;
- snapshot preparation and validation changed the visible state from `DRAFT` to `READY_TO_START`;
- initial route projections showed scheduler state and capacity values.

Failed browser observation:

- clicking `Confirmar e iniciar` caused the application to render blank;
- browser console reported `Error: scheduler queue member ACT-8F12 has an inconsistent state in normal` at current source `prototype/src/mockDomain.ts:607`, through `assertCoherentState` and `advanceCommand`, with the React update path at `prototype/src/App.tsx:40`;
- React then reported an unhandled `<App>` error and recommended an error boundary.

Therefore Browser: FAIL, not BROWSER_UNAVAILABLE. No blocking console error was present before the start action; the start action itself created one.

## 23. Static integration scan

Fresh `rg` scan over `prototype/` found no executable `fetch`, axios, WebSocket, EventSource, child_process, Git/gh execution, database client, SMTP, or browser persistence API. Matches were mock/display strings, README statements, test URLs, CSS content, and scenario text. No unexpected executable external integration was found.

## 24. Fresh adversarial scan summary

The remediation-authored probe passed. Independent probes additionally established:

- exact scheduler capability forgery and cross-scheduler rejection;
- deep projection immutability;
- atomic malformed registration rejection and lifecycle rejection;
- immediate pause queue refresh;
- SYSTEM reservation preservation through cancellation;
- the complete capacity/queue matrix and exact 5/2 shape;
- shared A/B/C lease and queue behavior;
- cross-publication evidence rejection;
- changed-candidate identity retention;
- duplicate scheduler ID aliasing;
- shape-valid but domain-unowned registration accepted and leased;
- out-of-bound conservative ceiling accepted.

The last four are unresolved findings/evidence, not remediation actions.

## 25. Consolidated finding table

| Finding | Prior status | Rerun 4 result | Consolidation |
| --- | --- | --- | --- |
| PCA-MAJOR-006 | PARTIALLY_CLOSED | PARTIALLY_CLOSED | residual 027/028 and browser 021 prevent closure |
| PCA-MAJOR-021 | CLOSED locally | OPEN / REOPENED | real browser start transition blanks app with scheduler invariant exception |
| PCA-MAJOR-022 | CLOSED | CLOSED | waiting/completion/release guards remain valid |
| PCA-MAJOR-023 | CLOSED | CLOSED | priority/fairness remains bounded in direct shared probe |
| PCA-MAJOR-024 | CLOSED | CLOSED | recovery evidence/race/idempotency remain guarded |
| PCA-MAJOR-025 | CLOSED | CLOSED | projections cannot mutate canonical authority |
| PCA-MAJOR-026 | CLOSED | CLOSED | ineligible lifecycle states do not receive leases |
| PCA-MINOR-007 | CLOSED | CLOSED | missing scheduler reads fail closed |
| PCA-MAJOR-027 | OPEN | OPEN | ownership proof, scheduler ID aliasing, ceiling validation remain incomplete |
| PCA-MAJOR-028 | OPEN | OPEN | new publication identity and duplicate independent fixture identities collide |
| PCA-MAJOR-029 | OPEN | CLOSED | exact 5/2 case and capacity matrix populate canonical queue completely |

No new PCA finding was created: the browser start defect is a regression of the previously closed local-start finding PCA-MAJOR-021; ownership/registry/ceiling defects consolidate under PCA-MAJOR-027; identity rollover/fixture collision consolidates under PCA-MAJOR-028.

## 26. New finding counts

CRITICAL=0
MAJOR=0 new; 1 previously closed MAJOR reopened (`PCA-MAJOR-021`)
MINOR=0
INFO=0

There are no new distinct findings in this rerun. Open residual major findings are PCA-MAJOR-006, PCA-MAJOR-027, and PCA-MAJOR-028; PCA-MAJOR-006 is the aggregate contract, not a new root cause.

## 27. Files modified

Authorized write:

- `docs/prototype-conformance-reaudit-final-rerun-4.md`

No other repository file was modified. The temporary Vite process was stopped. Build output remained ignored/untracked state did not change the baseline list.

## 28. Final recommendation

Do not approve `PROTOTYPE_CONFORMANT`.

Required remediation before a fresh approval gate:

1. Close PCA-MAJOR-027 by proving registration ownership/relationship, making scheduler identity allocation/registry collision-safe, and rejecting incoherent capacity ceiling inputs.
2. Close PCA-MAJOR-028 by allocating a distinct persistent identity for a genuinely new publication and preventing independent scheduler/execution fixture collisions.
3. Reopen and close PCA-MAJOR-021 by making the real browser/StrictMode command path idempotent and preserving the scheduler invariant after confirmed start.
4. Reaudit PCA-MAJOR-006 only after those residual findings and the browser regression are closed.

Final recommendation: `PROTOTYPE_REMEDIATION_REQUIRED`.

## 29. Machine-readable summary

FINAL_PROTOTYPE_REAUDIT_RERUN_4_COMPLETE

VERDICT: PROTOTYPE_REMEDIATION_REQUIRED

PCA-MAJOR-006: PARTIALLY_CLOSED
PCA-MAJOR-027: OPEN
PCA-MAJOR-028: OPEN
PCA-MAJOR-029: CLOSED

Previously closed findings reopened: PCA-MAJOR-021

New findings:
CRITICAL=0
MAJOR=0
MINOR=0
INFO=0

Tests: PASS (87/87)
Lint: PASS
Build: PASS
Browser: FAIL

Report:
docs/prototype-conformance-reaudit-final-rerun-4.md
