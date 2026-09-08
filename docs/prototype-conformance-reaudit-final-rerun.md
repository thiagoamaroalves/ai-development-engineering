# Final Prototype Conformance Reaudit — Remediation Rerun

**Audit date:** 2026-09-04  
**Mode:** `READ_ONLY / INDEPENDENT / ADVERSARIAL / ADR_FIRST`  
**Repository:** `C:\Users\taalves\OneDrive - Octave\Documents 1\pessoal\ai-engineering-development`  
**Subject:** current untracked `prototype/`

## 1. Formal verdict

`PROTOTYPE_REMEDIATION_REQUIRED`

The remediation claim `PROTOTYPE_REMEDIATION_COMPLETE` is not sufficient for
conformance. `PCA-MAJOR-024` and the capacity-projection portion of
`PCA-MAJOR-025` independently close, but `PCA-MAJOR-006` remains
`PARTIALLY_CLOSED` and four distinct scheduler findings remain open:

- `PCA-MAJOR-026`: global dispatch can lease work for an execution that has
  not started;
- `PCA-MAJOR-027`: public scheduler mutation operations accept forged identity
  and capacity-overflow inputs;
- `PCA-MAJOR-028`: shared executions reuse run, activity, and assignment IDs;
- `PCA-MINOR-007`: a read-only guard can mutate canonical queue reason and
  scheduler revision while repairing a stale queue member.

No material audit blocker prevented judgment.

## 2. Independence and method

Previous audits and remediation reports were treated as claims and regression
leads only. I independently inspected the current files, accepted ADRs,
approved ADR baseline hashes, source, tests, deterministic domain probes, and
the running React application.

The audit used fresh probes for same-revision and stale projection mutation,
global one-slot and multi-slot scheduling, three-execution registration and
dispatch, queue reasons/counters, fairness, forged scheduler inputs, capacity
overflow, recovery evidence identity, recovery races, recovery determinism and
idempotency, all twelve scenario families, and representative browser routes.

No source, test, dependency, ADR, plan, traceability, coverage, historical
report, or remediation report was modified. The only authorized write is this
report.

## 3. Authority and precedence

Authority was applied in this order:

1. accepted ADR-0001 through ADR-0014;
2. approved ADR portfolio records;
3. normative project documentation;
4. prototype plan, traceability, and coverage;
5. historical audit reports;
6. remediation reports as claims;
7. current implementation, tests, probes, and browser behavior as evidence.

Relevant authority requires: immutable snapshots and identities (ADR-0001),
separate guarded state machines (ADR-0002), isolated assignment/session/cycle
identity (ADR-0004), one global capacity pool with bounded leases, fair
priority, distinct queue reasons, and no dispatch without confirmed capacity
and lease (ADR-0005), authoritative journal/checkpoint recovery (ADR-0006),
and a client that only projects domain authority (ADR-0014).

## 4. Current repository baseline

| Item | Result |
| --- | --- |
| Repository path | `C:\Users\taalves\OneDrive - Octave\Documents 1\pessoal\ai-engineering-development` |
| Branch | `main` |
| HEAD | `4ae336c7f6a1dae468a23e1e9cbfe1fb95b63386` |
| `origin/main` | `4ae336c7f6a1dae468a23e1e9cbfe1fb95b63386` |
| Staged changes | none |
| Tracked unstaged changes | none |
| `AGENTS.md` | none found |
| Node/npm | `v22.17.0` / `11.7.0` |
| Prototype tracked by Git | no; `git ls-files prototype` returned zero entries |
| Historical implementation diff | unavailable; prototype and reports are untracked |
| Dependencies | available in `prototype/node_modules`; no install performed |

Untracked items include `prototype/`, prior prototype reports, plan,
traceability, coverage, and the Draw.io installer. They were not attributed to
a remediator because Git provides no implementation history.

### Required pre-audit SHA-256

| File | SHA-256 |
| --- | --- |
| `prototype/src/mockDomain.ts` | `325e8a1927c3ab9a43f442129756d8678dc20c5ff6bad55c91582a69e2eb474e` |
| `prototype/src/App.tsx` | `e8b8817618872e530a96d7c549b5be16bbe98837a2b12e28fe6077ee55f7265a` |
| `prototype/src/styles.css` | `e4c71d6d4aeed2cc582cff05f8709dcdbe2bc44c7190e68f2f6ad5624e5738bd` |
| `prototype/tests/mockDomain.test.ts` | `d170ea33b7303181eaf1124620c5ec63cf8eff19c3868e5543372e32a4e20ace` |
| `prototype/tests/ui.test.ts` | `02ff04dc628e7881eaf1124620c5ec63cf8eff19c3868e5543372e32a4e20ace` |
| `prototype/package.json` | `19057e64bff0a1e94d35233a8e926e52a48be3ee43f03100944a6e1d2dd42b25` |
| `prototype/package-lock.json` | `feb34da40e37b5075dffa3b9d9f77a95df26ebd01a26eadef53cb506fd301064` |
| `docs/prototype-conformance-remediation-final.md` | `afed44c80835645ecc4f90c9d17a83d2b1f61a218dd5ca1c8b1a8159a909d8bb` |
| `docs/prototype-conformance-reaudit-final.md` | `86b114f11b675073dedeb1264943b8694c8a880fda5888a719dd9288019eff1e` |

## 5. ADR integrity

All 14 individual ADR files matched the approved normalized SHA-256 baseline
in `ADR-0001-0014-portfolio-remediation-ASC-MAJOR-002-2026-08-28.md`. Every
file has `decision_status: ACCEPTED`, `implementation_status: UNPROCESSED`,
`revision: 3`, and the continuous expected ID.

| ADR | Normalized SHA-256 | Result |
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

## 6. PCA-MAJOR-025 — scheduler projection authority

**Current state: `CLOSED` for the target finding.**

The old `reconcileDirectCapacityMutation` path is absent. `MockState.capacity`
is overwritten from scheduler state by `syncCapacityProjection`; no remaining
source assignment copies capacity, leases, queue, or fairness projection data
back into scheduler authority.

Fresh same-revision attack: mutating `used`, `available`, `maximum`, leases,
fair queue, queue counters, and status to fake values, then calling
`canExecute`, left the scheduler unchanged and restored the projection.

Fresh stale-revision attack: a heavily mutated old projection after a current
start left the scheduler unchanged and the canonical scheduler retained its
lease and queue state. Equality of the projection revision does not grant a
write path because no projection reconciliation path remains.

The target is nevertheless surrounded by the new read-only and mutation-boundary
findings below; those are not reclassified as this target because they have
different root causes.

## 7. Scheduler canonical mutation inventory

| Scheduler mutation | Canonical operation? | Revision controlled? | Cross-execution safe? |
| --- | --- | --- | --- |
| Queue reason refresh | internal refresh | yes, but reachable from `canExecute` | mostly; read-only mutation finding remains |
| Capacity/status/leases reconciliation | `reconcileSchedulerCapacity` | yes | global, but input overflow is not rejected |
| Candidate enqueue/update | `enqueueSchedulerCandidate` | yes | no registration validation at API boundary |
| Lease acquisition | `acquireSchedulerLease` | yes | no candidate identity validation at API boundary |
| Lease release | `releaseSchedulerLease` | yes | lease ID only; owner/activity is not validated |
| Queue member removal | internal `removeFromFairQueue` | yes | scoped by execution/activity |
| Terminal release/queue cleanup | internal `releaseAllCapacity` | yes | preserves unrelated execution queue members |
| Priority update | `SET_PRIORITY` effect | yes | updates current execution’s queued candidates |
| Execution registration | `registerSchedulerExecution` | no | can be rewritten from local activity data during read-only sync |

## 8. PCA-MAJOR-006 — shared global scheduler

**Current state: `PARTIALLY_CLOSED`.**

The scheduler registry is shared by scheduler ID, capacity and leases are
global, queue reasons/counters are derived from canonical queue members, and
cross-execution completion/release can select another execution. One-slot and
two-slot probes maintained `used + available == maximum`, lease count equality,
unique lease IDs, bounded dispatch, and preserved unrelated queue members.

The target cannot be closed because global dispatch is not gated by the
execution lifecycle. This is `PCA-MAJOR-026` below. Queue restoration and
cross-execution release pass their narrow probes, but the shared pool is not
safe for arbitrary execution ordering.

## 9. Shared-pool probes

| Probe | Result |
| --- | --- |
| Two executions, one slot | one lease, one active execution, other candidate canonically queued with `CAPACITY` |
| Three executions, two slots | two unique leases; third candidate queued |
| UNKNOWN capacity | no lease acquired; candidates remain queued |
| UNKNOWN → KNOWN, two executions | registrations and candidates preserved; global reasons/counters recomputed |
| UNKNOWN → KNOWN, three candidates, two slots | two leases and one remaining `CAPACITY` candidate |
| Release in A | freed capacity selected queued work from another execution |
| Cancellation in A | A queue members removed while B queue membership remained |
| Priority | queued priority changed and next selection changed |
| Six fairness opportunities | deterministic `A, A, B, A, A, B`; lower priority did not starve |

## 10. Queue membership, reason, and counter audit

Canonical snapshots derive `queuedByCapacity` and `queuedByEligibility` from
actual scheduler queue members. Stable probes after enqueue, acquisition,
release, priority change, cancellation, restoration, and terminal release
matched those canonical members. The suite’s counter assertions inspect actual
queue arrays in the scheduler, not only exposed projection counters.

The limitation is lifecycle context: a candidate may be canonical in the
global queue while the owning execution is still `READY_TO_START`; the
dispatch/lifecycle defect is reported as `PCA-MAJOR-026`. The current
`assertCapacityCoherent` guard also validates queue ownership but does not
validate lease ownership/activity registration, covered by `PCA-MAJOR-027`.

## 11. Capacity restoration audit

`reconcileSchedulerCapacity` preserves existing queue members and reevaluates
capacity reasons globally. Two-execution and three-candidate probes retained
all registrations, dispatched only available slots, and kept remaining work at
`CAPACITY`. Cross-execution release preserved unrelated members.

The restoration command is safe for its fixed modeled input, but the exported
canonical operation accepts invalid arbitrary inputs that can violate capacity
invariants; see `PCA-MAJOR-027`.

## 12. Priority/fairness regression

`SET_PRIORITY` updates queued candidates in the scheduler and increments its
revision. It does not preempt running work. Fresh repeated scheduling produced
`A, A, B, A, A, B` under a two-consecutive-dispatch fairness bound. Three
execution registration was also exercised. No starvation or fairness-state
contamination was observed in valid probes.

## 13. PCA-MAJOR-024 — recovery evidence identity

**Current state: `CLOSED`.**

`recoveryEvidenceMatches` now requires checkpoint identity, safety, valid
inclusive interval, journal position, exact contiguous journal positions,
projection identity, replay key, and the authoritative modeled
`recoveryEvidenceId`. The effect captures the validated input and does not
replace it.

Fresh valid recovery produced replay count `3`, preserved
`RECOVERY-EVIDENCE-2026-0831-01`, and emitted one confirmation. Wrong and
missing IDs were rejected with `NEEDS_RECOVERY`, zero replayed events, and no
confirmation. Identity mutation before acceptance and before confirmation was
rejected. Unsafe/unknown checkpoint, missing/incomplete/stale journal,
projection mismatch, replay-key mismatch, invalid range, duplicate positions,
and missing positions were rejected. Repeating confirmed recovery was rejected
without duplicate replay or confirmation.

## 14. Recovery evidence binding

The valid fixture is internally consistent across checkpoint, safe flag,
journal position, replay range, exact positions, projection hash, replay key,
and evidence identity. Two identical fresh fixtures produced equivalent
recovery state and confirmation evidence. The modeled prototype has metadata
for the journal rather than a real append-only journal collection; this limits
the proof to the prototype’s mock persistence boundary.

## 15. Recovery determinism/idempotency

Valid recovery: `RECOVERED`, replay count `3`, one `recovery.confirmed` event.
Two independent valid fixtures matched on replay range, count, checkpoint,
journal positions, projection identity, replay identity, evidence identity,
final state, and confirmation count. A repeated command was rejected with the
original evidence and single confirmation intact.

## 16. Command lifecycle races

The two-stage command implementation revalidates at request/acceptance and
again before confirmation. Fresh recovery identity mutations at both stages
were rejected. START_RUN authority/input mutations and PR publication identity
mutations remained rejected in the current suite and source guards. No
confirmed effect was observed after those invalidations.

## 17. New findings

### PCA-MAJOR-026 — global dispatch ignores execution lifecycle

**State: `OPEN`.** In `mockDomain.ts:265-289`, global dispatch acquires a lease
for a candidate belonging to another execution without checking that
execution’s snapshot is confirmed, functional state is `RUNNING`, or its
activity is eligible. A fresh scheduler with three executions, all only at
`READY_TO_START`, then starting only execution A produced leases for A and B;
B remained `READY/IDLE` with a `READY_TO_START` snapshot. In a different valid
ordering, validating A and starting it before validating B caused B’s later
validation to throw `incoherent READY execution` after its activity was
projected `RUNNING` by the foreign lease.

**Actionable closure criterion:** global selection must inspect authoritative
execution lifecycle and activity eligibility before leasing another execution;
unstarted executions must remain unleased and canonically queued.

### PCA-MAJOR-027 — scheduler mutation boundary accepts forged identity/overflow

**State: `OPEN`.** `acquireSchedulerLease` matches only a queue `sequence` and
then copies the caller-supplied execution/activity/assignment fields into the
lease. A forged candidate with a valid sequence acquired a lease for
`FORGED-EXEC/FORGED-ACT/FORGED-ASN`; `assertCoherentState` did not reject it.
`enqueueSchedulerCandidate` accepts an unregistered execution/activity, and
`reconcileSchedulerCapacity` accepted `maximum=0` with two lease assignments,
leaving `used=2`, `available=-2`. These are canonical scheduler mutations that
violate registration and capacity invariants.

**Actionable closure criterion:** validate candidate identity against the
canonical queued member, validate lease owners against registered execution /
activity / assignment records, reject unregistered queue members, and reject
capacity reconciliation where leases exceed known maximum.

### PCA-MAJOR-028 — shared executions reuse persistent identities

**State: `OPEN`.** Two states created with one shared scheduler received unique
`schedulerExecutionId` values but identical `run.id`, all activity IDs, and all
assignment IDs. ADR-0001 requires persistent identity for execution, activity,
and assignment; ADR-0004 requires a new `AgentAssignmentId` per activity.
This makes cross-execution event targets and assignment evidence ambiguous even
though the scheduler’s composite execution key separates queue entries.

**Actionable closure criterion:** allocate unique execution/run, activity,
assignment, and event-correlation identities for each execution while retaining
composite ownership references where needed.

### PCA-MINOR-007 — read-only guard mutates canonical scheduler revision

**State: `OPEN`.** `canExecute` calls `syncSchedulerProjection`, which calls
`refreshSchedulerQueueReasons`. After a queue member’s reason was made stale,
a read-only `canExecute` changed the scheduler revision from `12` to `13` and
rewrote the reason to `CAPACITY`. The same path also rewrites scheduler
execution registration from local activity data without incrementing revision.
This violates the explicit revision/read-only contract and makes guard calls
stateful under malformed or stale canonical inputs.

**Actionable closure criterion:** separate pure guard evaluation from canonical
repair; only an explicit scheduler operation may change queue reasons,
registration, or scheduler revision.

## 18. Regression of all previously closed findings

Fresh current inspection and the 67-test suite found no reopening of the
previously closed findings. Their current classifications are:

| Finding | Current state | Current evidence |
| --- | --- | --- |
| `PCA-CRITICAL-001` | CLOSED | UI commands route through request/accept/confirm domain lifecycle |
| `PCA-MAJOR-001` | CLOSED | START_RUN revalidates ADR/input authority and races |
| `PCA-MAJOR-002` | CLOSED | separate functional/operational guards and explicit activity completion |
| `PCA-MAJOR-003` | CLOSED | twelve deterministic scenario factories and journeys |
| `PCA-MAJOR-004` | CLOSED | PR identity/hash/check/merge evidence revalidation |
| `PCA-MAJOR-005` | CLOSED | shared ticket source, conflict/audit/integration DAG guards |
| `PCA-MAJOR-007` | CLOSED | bootstrap/migration/audit/approval precede enablement |
| `PCA-MAJOR-008` | CLOSED | normative controls have handlers, guards, and evidence |
| `PCA-MINOR-001` | CLOSED | names, ARIA, live status, focus CSS, and status semantics |
| `PCA-MAJOR-018` | CLOSED | assignment reuse rejected; retries/reaudits isolated |
| `PCA-MAJOR-019` | CLOSED | divergence classification, decision, compatible effect |
| `PCA-MAJOR-020` | CLOSED | onboarding roles, sessions, assignments, cycles segregated |
| `PCA-MINOR-003` | CLOSED | real React/jsdom mount and causal UI actions |
| `PCA-MAJOR-021` | CLOSED locally | known capacity/lease guard for local start/retry; global exception is 026 |
| `PCA-MINOR-004` | CLOSED | variant B accessible navigation names |
| `PCA-MINOR-005` | CLOSED | current color/status semantics within inspected viewport |
| `PCA-MAJOR-022` | CLOSED | waiting work cannot complete; completion releases lease |
| `PCA-MINOR-006` | CLOSED | current test count independently verified as 67/67 |
| `PCA-MAJOR-023` | CLOSED | priority changes queue selection; fairness remains bounded |

## 19. Twelve-scenario regression

The current suite and fresh domain journey covered each scenario with reset and
isolation checks:

| Scenario | Result |
| --- | --- |
| normal | snapshot validation, start, explicit completion, publication confirmed |
| audit | remediations and independent reaudits confirmed; premature reaudit rejected |
| capacity | UNKNOWN blocks dispatch; reconciliation restores bounded dispatch |
| retry | new assignment/session, same idempotency key, next attempt |
| rounds | explicit authorization advances the allowed round only |
| conflict | resolve → integration audit → wave integration |
| divergence | classify → human decision → compatible corrective effect |
| recovery | valid recovery confirmed; adversarial matrix rejected |
| drift | invalidation → revalidation → direct publication |
| PR | approval → merge → remote confirmation |
| migration | bootstrap → migration → verify → audit → approval → enable |
| ADR mutation | mutation blocks processing; restore returns snapshot to draft |

Each factory is deterministic in the current tests. Shared-pool probes were
kept separate from the twelve single-execution scenario families.

## 20. Tests

Executed from the exact current directory:

`C:\Users\taalves\OneDrive - Octave\Documents 1\pessoal\ai-engineering-development\prototype`

```text
npm test
1..67
# tests 67
# pass 67
# fail 0
# cancelled 0
# skipped 0
# todo 0
exit code 0
```

## 21. Lint

```text
npm run lint
tsc --noEmit
exit code 0 — PASS
```

## 22. Build

```text
npm run build
tsc -b && vite build
vite v8.2.2
1820 modules transformed
exit code 0 — PASS
```

## 23. Test-quality assessment

The newly added tests are causal for capacity projection attacks, recovery
identity mismatch/races, queue reason relabeling, two-execution restoration,
cross-execution release, cancellation preservation, priority, and fairness.

They do not cover the newly found forged candidate/lease API path, capacity
overflow, read-only revision mutation, unique identities across shared
executions, or the ordering where global dispatch starts before another
execution’s snapshot/run lifecycle. The three-execution tests use standalone
scheduler candidates for restoration and therefore do not prove lifecycle
gating. Passing tests alone does not close those gaps.

## 24. Browser validation

The local Vite app was exercised in the Codex in-app browser at
`http://127.0.0.1:4173/`.

Observed results:

- normal overview → new execution → validate snapshot → confirm/start showed
  the expected lifecycle and `RUNNING` state;
- capacity route showed `UNKNOWN`, `WAITING_CAPACITY`, and an enabled
  reconciliation control;
- PR route showed `PR_OPEN` and `AWAITING_PR_MERGE` before the confirmation
  path;
- recovery route exposed the enabled `Recovery` command, then showed
  `recovery.confirmed` after navigation back to the overview;
- scenario selection reset the in-memory state and URL to a fresh scenario;
- inspected navigation had named controls, a main region, progress semantics,
  and no unnamed buttons;
- console diagnostics reported no warnings or errors on exercised routes.

Scheduler identity, cross-execution lifecycle, forged scheduler inputs, and
recovery evidence mutation are domain-only checks because the UI does not
expose those fields. No audit-blocked verdict is warranted.

## 25. Integration leakage scan

Static scan of prototype source, tests, and package metadata found no executable
`fetch`, axios, WebSocket, EventSource, child process, Git/gh invocation, Codex
CLI execution, database client, SMTP, external API, IndexedDB, localStorage, or
sessionStorage. Textual mentions were mock labels/messages only.

## 26. Consolidated finding table

| Finding | Previous state | Current state | Independent evidence |
| --- | --- | --- | --- |
| `PCA-CRITICAL-001` | OPEN | CLOSED | Domain-routed UI command lifecycle and confirmed events |
| `PCA-MAJOR-001` | PARTIAL | CLOSED | fresh authority/input mutation and race rejection |
| `PCA-MAJOR-002` | PARTIAL | CLOSED | explicit completion and state coherence guards |
| `PCA-MAJOR-003` | OPEN | CLOSED | twelve deterministic executable scenario families |
| `PCA-MAJOR-004` | PARTIAL | CLOSED | PR post-merge identity and hash checks |
| `PCA-MAJOR-005` | OPEN | CLOSED | DAG/conflict/integration/cancellation guards |
| `PCA-MAJOR-006` | PARTIAL | PARTIALLY_CLOSED | shared pool works, but lifecycle-unaware global dispatch remains |
| `PCA-MAJOR-007` | OPEN | CLOSED | bootstrap and audit precede enablement |
| `PCA-MAJOR-008` | OPEN | CLOSED | controls have causal handlers and guards |
| `PCA-MINOR-001` | OPEN | CLOSED | accessible names, ARIA, focus, and status semantics |
| `PCA-MAJOR-018` | REMEDIATED | CLOSED | assignment/session/cycle reuse rejection |
| `PCA-MAJOR-019` | REMEDIATED | CLOSED | compatible divergence reconciliation sequence |
| `PCA-MAJOR-020` | REMEDIATED | CLOSED | onboarding identity and role separation |
| `PCA-MINOR-003` | REMEDIATED | CLOSED | real UI mount and causal DOM journeys |
| `PCA-MAJOR-021` | REMEDIATED | CLOSED locally | local capacity/lease dispatch guards; global gap is 026 |
| `PCA-MINOR-004` | REMEDIATED | CLOSED | variant B accessible navigation |
| `PCA-MINOR-005` | REMEDIATED | CLOSED | current status/color semantics |
| `PCA-MAJOR-022` | REMEDIATED | CLOSED | waiting activities cannot complete |
| `PCA-MINOR-006` | REMEDIATED | CLOSED | 67/67 current test count |
| `PCA-MAJOR-023` | REMEDIATED | CLOSED | priority and six-opportunity fairness probe |
| `PCA-MAJOR-024` | PARTIAL | CLOSED | evidence ID required, preserved, raced, deterministic, idempotent |
| `PCA-MAJOR-025` | OPEN | CLOSED | same/stale capacity projection attacks produce no authority change |
| `PCA-MAJOR-026` | new | OPEN | foreign execution receives lease before its start |
| `PCA-MAJOR-027` | new | OPEN | forged lease and negative-capacity canonical states accepted |
| `PCA-MAJOR-028` | new | OPEN | run/activity/assignment IDs collide across executions |
| `PCA-MINOR-007` | new | OPEN | read-only guard increments scheduler revision |

Finding counts: previously closed findings reopened `0`; current known
findings `CLOSED=21`, `PARTIALLY_CLOSED=1`, `OPEN=4`, `AUDIT_BLOCKED=0`.
New findings: `CRITICAL=0`, `MAJOR=3`, `MINOR=1`, `INFO=0`.

## 27. Files modified

Only the authorized file was created:

`docs/prototype-conformance-reaudit-final-rerun.md`

The prototype, tests, dependencies, ADRs, plans, traceability, coverage, and
prior reports remained unchanged. Build outputs were ignored and did not appear
in `git status`.

## 28. Final recommendation

Do not approve `PROTOTYPE_CONFORMANT`.

Exact actionable remaining findings:

1. `PCA-MAJOR-006` / `PCA-MAJOR-026` — gate global cross-execution leasing on
   the target execution’s confirmed snapshot, active functional state, and
   activity eligibility.
2. `PCA-MAJOR-027` — harden every scheduler mutation boundary against forged
   candidate/lease identity, unregistered members, and capacity overflow.
3. `PCA-MAJOR-028` — allocate unique persistent identities across shared
   executions.
4. `PCA-MINOR-007` — make read-only guards pure and move queue repair and
   scheduler revision changes behind explicit canonical operations.

This report performs no remediation.
