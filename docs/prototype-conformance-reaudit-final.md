# Final Independent Prototype Conformance Re-audit

**Audit date:** 2026-09-04  
**Mode:** `READ_ONLY / INDEPENDENT / ADVERSARIAL / ADR_FIRST`  
**Audited repository:** `C:\Users\taalves\OneDrive - Octave\Documents 1\pessoal\ai-engineering-development`  
**Audited prototype:** `prototype/`

## 1. Formal verdict

`PROTOTYPE_REMEDIATION_REQUIRED`

The remediation claim `PROTOTYPE_REMEDIATION_COMPLETE` is not sufficient for
conformance. Fresh evidence independently closes `PCA-MAJOR-001`,
`PCA-MAJOR-004`, and `PCA-MAJOR-023`, but material scheduler and recovery gaps
remain:

- `PCA-MAJOR-006` is `PARTIALLY_CLOSED`: a shared scheduler and global leases
  exist, but cross-execution queue reasons/counters are not consistently
  reconciled and capacity restoration can remove another execution's queued
  work.
- `PCA-MAJOR-024` is `PARTIALLY_CLOSED`: safe checkpoint and journal-shape
  checks work, but an incompatible `recoveryEvidenceId` is accepted and the
  effect fabricates the evidence identity.
- `PCA-MAJOR-025` is a new `OPEN` major finding: a same-revision mutated
  execution projection can overwrite canonical scheduler capacity and leases.

No audit blocker prevented judgment. The final recommendation is not approval
as conformant.

## 2. Independence and audit method

The current repository was audited from its working tree. Historical audits,
the current re-audit, and remediation reports were treated as claims and
regression evidence only, never as normative authority or proof of closure.

The audit included:

- baseline Git/state inspection and SHA-256 capture;
- complete reading of ADR-0001 through ADR-0014 and approved portfolio records;
- independent normalized ADR hash verification;
- source and test inspection;
- `npm test`, `npm run lint`, and `npm run build` from the exact `prototype`
  directory;
- independent in-memory probes for authority freshness, PR freshness, shared
  scheduling, queue accounting, fairness, stale projections, recovery validity,
  determinism, idempotency, and command races;
- independent execution of the 12 scenario families;
- real React application browser checks, including PR, recovery, reset,
  accessibility, and console state;
- static scan for prohibited executable integrations.

No prototype source, tests, dependencies, ADR, plan, traceability, coverage
report, historical audit, or remediation report was modified. The only
authorized audit artifact created by this task is this report.

## 3. Authority and precedence

Authority was applied in this order:

1. accepted ADR-0001 through ADR-0014;
2. approved ADR portfolio remediation records;
3. normative project documentation;
4. prototype plan, traceability, and coverage;
5. historical audits;
6. remediation reports as claims to verify;
7. implementation, tests, probes, and browser behavior as evidence.

The controlling requirements relevant to the findings are:

- ADR-0001: immutable execution snapshot containing eligible ADRs, hashes,
  base, configuration, and skill versions; support for multiple executions;
- ADR-0002: separate aggregate state machines, guarded transitions, and
  terminal publication vocabulary;
- ADR-0003/0004: versioned manifests, isolated assignments, and cycle-scoped
  eligibility;
- ADR-0005: one global capacity pool across executions/repositories, priority,
  fair distribution, persisted leases, distinct queue reasons, and no dispatch
  without known capacity and a lease;
- ADR-0006: append-only journal/outbox, idempotent effects, authoritative safe
  checkpoint recovery, and no completion proof from saved status alone;
- ADR-0008/0009: serial publication, exact base/head/tree/candidate binding,
  remote confirmation, and repeated conformance after drift;
- ADR-0011/0014: backend/domain authority and UI command lifecycle evidence.

## 4. Current repository baseline

- Repository path: `C:\Users\taalves\OneDrive - Octave\Documents 1\pessoal\ai-engineering-development`
- Branch: `main`
- `HEAD`: `4ae336c7f6a1dae468a23e1e9cbfe1fb95b63386`
- `origin/main`: `4ae336c7f6a1dae468a23e1e9cbfe1fb95b63386`
- staged changes: none;
- tracked unstaged changes: none;
- `git ls-files prototype`: no entries; the prototype remains untracked;
- no reliable Git implementation diff exists because the prototype and audit
  artifacts are untracked;
- no `AGENTS.md` was found;
- Node.js: `v22.17.0`;
- npm: `11.7.0`;
- `prototype/node_modules` was already present; no install or dependency
  mutation was performed;
- `prototype/package.json` and `prototype/package-lock.json` are present and
  untracked;
- existing untracked items include `prototype/`, the Draw.io installer, and
  prior audit/plan/coverage/remediation artifacts. They were not attributed to
  a remediator because Git provides no implementation history.

### Required current SHA-256

| File | SHA-256 |
| --- | --- |
| `prototype/src/mockDomain.ts` | `07a8ae76ac568da1110b8e3b959be567fa728c6611602eb7855812d796efec11` |
| `prototype/src/App.tsx` | `e8b8817618872e530a96d7c549b5be16bbe98837a2b12e28fe6077ee55f7265a` |
| `prototype/src/styles.css` | `e4c71d6d4aeed2cc582cff05f8709dcdbe2bc44c7190e68f2f6ad5624e5738bd` |
| `prototype/tests/mockDomain.test.ts` | `1f0f0a20519e70e70de645b751a802a9e585294cacdb31cc9229b0a322305fe4` |
| `prototype/tests/ui.test.ts` | `02ff04dc628e7881eaf1124620c5ec63cf8eff19c3868e5543372e32a4e20ace` |
| `prototype/package.json` | `19057e64bff0a1e94d35233a8e926e52a48be3ee43f03100944a6e1d2dd42b25` |
| `prototype/package-lock.json` | `feb34da40e37b5075dffa3b9d9f77a95df26ebd01a26eadef53cb506fd301064` |
| `docs/prototype-conformance-remediation-current.md` | `7b0707c9b5c7988b22824feab5de1fccb61f17c36a436364a57ee1ff5b1c2cf1` |
| `docs/prototype-conformance-reaudit-current.md` | `71ead742d589b55e1909c0361c6004d2a9470b85b9b65f1c84350ca46e3b6ac7` |

The required commands generated or refreshed only ignored build outputs under
`prototype/dist` and `prototype/tsconfig.tsbuildinfo`; no source, test,
dependency, authority, or tracked working-tree change was observed.

## 5. ADR integrity

The approved expected hashes were taken from the approved
`ADR-0001-0014-portfolio-remediation-ASC-MAJOR-002-2026-08-28.md` record.
Each ADR was normalized from CRLF to LF before hashing. All 14 records matched
the approved hash and had the expected front matter:

- `decision_status: ACCEPTED`;
- `implementation_status: UNPROCESSED`;
- `revision: 3`;
- 14 continuous IDs, `ADR-0001` through `ADR-0014`.

The normalized hashes were independently verified as follows:

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

No unexplained ADR divergence was found.

## 6. PCA-MAJOR-001 — atomic START_RUN authority freshness

**Normative requirement.** `START_RUN` must use the locked snapshot and
revalidate every frozen authority/input immediately before acceptance and again
before its confirmed effect. Stale authority must not start a run, dispatch an
activity, acquire a lease, emit `run.started`, or rewrite frozen evidence.

**Previous defect.** The previous implementation checked snapshot state and
functional readiness but did not revalidate post-lock ADR authority and frozen
inputs at the `START_RUN` command boundary.

**Remediation claim.** The current remediation says `START_RUN` revalidates
complete ADR integrity, eligible IDs/hashes, base/config/skill inputs, and
repository clean/aligned state.

**Current source evidence.** `startInputsMatch` in
`prototype/src/mockDomain.ts:375-380` compares current eligible IDs and hashes,
ADR integrity, snapshot inputs, clean state, and alignment. The `START_RUN`
guard at `prototype/src/mockDomain.ts:391` calls it. `advanceCommand` at
`prototype/src/mockDomain.ts:512` validates both requested → accepted and
accepted → confirmed stages.

**Test evidence.** The current suite has the seven post-validation mutation
cases in test 46 and the unchanged snapshot case in test 47. The suite also
passes command lifecycle tests.

**Independent positive probe.** A freshly validated, unchanged snapshot was
accepted and confirmed; the run became `RUNNING`, with the snapshot frozen and
the expected `run.started` event.

**Independent adversarial probe.** Separate fresh fixtures mutated each of:
ADR content hash, ADR implementation eligibility, ADR decision status, base
SHA, configuration version, skill version, repository cleanliness, and
repository alignment. Every case returned `canExecute(START_RUN) = false`,
then `requested → rejected`; the run remained `READY/IDLE`, no `run.started`
event was emitted, and lease count did not increase.

**Race probe.** Mutating authority after request but before acceptance rejected
the request. Mutating the base after acceptance but before confirmation also
rejected it; no run-start event or functional start occurred.

**Closure criterion.** All frozen authority/input mutations must be rejected at
the authoritative effect boundary without dispatch, lease, start evidence, or
snapshot rewriting.

**Classification: `CLOSED`.**

## 7. PCA-MAJOR-004 — PR publication freshness

**Normative requirement.** PR publication must remain bound to the approved
candidate, PR/merge identity, conformance run, base/head/tree, checks,
mergeability, serial queue position, and merge evidence. Any post-merge drift
must reject `CONFIRM_REMOTE` and preserve the non-terminal state.

**Previous defect.** `PR_MERGED` was previously treated as sufficient for remote
confirmation; post-merge candidate drift could fabricate terminal publication.

**Remediation claim.** The current remediation says merge records the approved
candidate, PR, SHAs, conformance run, and merge evidence, and confirmation
rechecks these values and current publication inputs.

**Current source evidence.** `mergedPublicationEvidenceMatches` at
`prototype/src/mockDomain.ts:382-383` compares current base/head/tree, queue
position, candidate, PR number, merged identity, conformance run, merge
evidence, approval, checks, and mergeability. The guard is at line 418. The
merge effect binds evidence at line 485 and confirmation is only applied at
line 486 after the guard.

**Test evidence.** Current test 20 covers post-merge base, head, tree,
candidate, approval, checks, mergeability, conformance-run, and merge-evidence
mutations, plus the unchanged path.

**Independent positive probe.** Fresh `PR_OPEN → approval → PR_MERGED →
CONFIRM_REMOTE` completed and ended in `REMOTE_PUBLICATION_CONFIRMED` with the
run terminal only after confirmation.

**Independent adversarial probe.** Separate post-merge mutations of current
base/head/tree, candidate ID, PR number, approval, conformance-run identity,
checks, mergeability, queue position, merged candidate identity, and merged
remote evidence all returned `canExecute(CONFIRM_REMOTE) = false` and
`requested → rejected`. The publication remained `PR_MERGED`; the run was not
completed; and no remote confirmation event was added.

**Race probe.** Mutating head after request but before acceptance, and tree
after acceptance but before confirmation, both rejected the command.

**Closure criterion.** Confirmation must be accepted only for the exact
candidate/merge/evidence that was approved and merged.

**Classification: `CLOSED`.**

## 8. PCA-MAJOR-006 — real shared capacity authority

**Normative requirement.** All executions and repositories in scope share one
global scheduler/pool. Capacity, leases, queue membership, queue reason, and
fairness are canonical scheduler authority; projections must be derived from
that authority and capacity restoration must reevaluate all affected work.

**Previous defect.** Capacity was maintained per `MockState`; independent
executions could each appear to own the same one-slot pool, and decorative
queue counters could diverge from actual waiting work.

**Remediation claim.** The remediation claims a registry-backed `MockScheduler`
with shared leases, global counters, execution registration, queue candidates,
revisioned projections, queue-reason derivation, priority, and fairness.

**Current source evidence.** The scheduler registry and lease/candidate
operations are at `prototype/src/mockDomain.ts:75-142`. Shared execution IDs
are allocated at lines 312-315. State capacity is projected from scheduler
queue membership at lines 86-89, and invariants are checked at lines 283-299.
However, `enqueueSchedulerCandidate` rejects an existing execution/activity
pair without updating its reason (`prototype/src/mockDomain.ts:106-109`), and
`RELEASE_CAPACITY` clears the entire scheduler queue before reenqueuing only
one local waiting activity (`prototype/src/mockDomain.ts:469`).

**Test evidence.** Current tests 21-25 prove direct scheduler fairness,
synthetic queue reason counters, two shared executions with two slots,
priority updates, and UNKNOWN capacity. They do not cover cross-execution
waiting-state reason relabeling or multi-execution capacity restoration.

**Independent shared-pool probe.** With one common scheduler and
`maximum=1, initialUsed=0`, two normal executions registered distinct execution
IDs. Starting both left exactly one global lease, not two independent leases;
the other execution remained waiting. With `maximum=2`, three executions
resulted in exactly two leases, unique lease IDs, and the third execution
waiting. Lease release made a valid next execution dispatchable. Known-capacity
invariants held: `used + available = maximum` and `used = lease count`.

**Independent queue-accounting probe.** After execution A acquired the only
slot, starting execution B left nine actual `WAITING_CAPACITY` activities across
the two executions, but the canonical queue contained eight `CAPACITY` members
and one B candidate still labeled `READY`. B's projection reported
`queuedByCapacity=8`. The candidate's activity state and queue reason therefore
diverged; the counter was not the count of actual capacity-waiting candidates.

**Independent UNKNOWN probe.** A common UNKNOWN scheduler with multiple queued
executions acquired zero leases and fabricated no running work. This part
passes.

**Independent restoration probe.** Two executions in UNKNOWN capacity each had
one `CAPACITY` queue member. Executing `RELEASE_CAPACITY` on A changed the global
pool to known capacity, cleared the queue, and re-added only A's local activity.
B's activity remained `WAITING_CAPACITY` with no canonical queue member and
could not dispatch. Restoration therefore does not reevaluate all executions.

**Closure criterion.** A single canonical pool must preserve all execution
queue members, update queue reasons atomically with activity state, derive all
queue counters from current membership, and reevaluate every queued execution
after capacity status changes.

**Classification: `PARTIALLY_CLOSED`.** The common scheduler and lease
accounting are real, but the cross-execution queue and restoration defects are
material and remain actionable under this finding.

## 9. Scheduler stale-projection protection

**Normative requirement.** An older execution projection must not overwrite
newer canonical scheduler capacity, leases, queue membership, priority,
fairness, or revision.

**Current source evidence.** `MockState.schedulerRevision` is synchronized from
the scheduler at `prototype/src/mockDomain.ts:86-89`. The direct mutation
reconciliation path at lines 504-508 avoids resetting the scheduler when the
state revision differs from the canonical revision. That is sufficient for a
projection at revision N after canonical authority has advanced to N+1.

**Independent newer-revision probe.** Execution A retained revision 1. The
canonical scheduler advanced to revision 2 and held a lease. Mutating A's old
capacity projection and invoking `canExecute` left canonical capacity, lease,
queue, and revision unchanged. This path passed.

**Residual same-revision probe.** A state at the same revision as the canonical
scheduler was mutated to `used=1`, `available=0`, and a fake lease. Calling
`canExecute` triggered `resetSchedulerFromCapacity` and changed canonical
authority from zero leases to a fabricated `SYSTEM-1` lease with assignment
`FAKE`. The scheduler queue was also cleared. The public domain reconciliation
path therefore permits a projection-originated overwrite whenever the revision
matches.

## 10. PCA-MAJOR-023 — priority has actual scheduling consequence

**Normative requirement.** `SET_PRIORITY` must affect future shared scheduling
selection while not bypassing capacity, eligibility, DAG readiness, or lease
constraints. Fairness must prevent starvation.

**Previous defect.** Priority previously changed only a run field/event and had
no scheduling consequence.

**Remediation claim.** The current implementation updates queued candidate
priorities and applies a deterministic bounded-fairness selector.

**Current source evidence.** `SET_PRIORITY` updates the execution's queued
candidates at `prototype/src/mockDomain.ts:465`. Candidate selection sorts by
priority and sequence at lines 111-116, with the consecutive-dispatch bound.

**Test evidence.** Current test 24 proves two shared execution candidates are
updated and the higher-priority one is selected. Tests 21 and 23 cover direct
shared scheduling and fairness.

**Independent priority probe.** With three executions competing for one slot,
raising B from 50 to 100 changed all of B's queued candidate priorities and made
B the next selected execution after the current lease was released. In a fresh
comparison where C was raised to 100 and B lowered to 0, C became the selected
execution. The real `SET_PRIORITY` command completed as
`requested → accepted → confirmed`.

**Independent fairness probe.** Repeated deterministic releases with high
priority A and low priority B produced `A, A, B, A, A, B`. Priority resumed
after the intervention, B did not starve, and A was not permanently suppressed.

**Closure criterion.** Future selection changes causally with priority and
fairness without bypassing capacity or eligibility.

**Classification: `CLOSED`.**

## 11. PCA-MAJOR-024 — safe checkpoint recovery

**Normative requirement.** Recovery requires authoritative safe-checkpoint,
journal interval, exact journal positions, projection identity, replay identity,
and recovery-evidence identity. Invalid evidence must remain `NEEDS_RECOVERY`;
valid replay must derive its count and be idempotent.

**Previous defect.** Recovery previously accepted any `NEEDS_RECOVERY` state and
used a hard-coded replay count.

**Remediation claim.** The remediation claims modeled safe checkpoint and
journal evidence, interval-derived replay count, rejection of invalid inputs,
and one-time recovery evidence.

**Current source evidence.** `recoveryEvidenceMatches` at
`prototype/src/mockDomain.ts:385-387` checks checkpoint name/safety, replay
range, journal position, projection hash, replay key, and exact contiguous
journal positions. It does not check `recoveryEvidenceId`. The recovery effect
at line 478 calculates the count but then assigns the constant
`RECOVERY-EVIDENCE-2026-0831-01`, rather than requiring or preserving a
validated incoming recovery-evidence identity.

**Test evidence.** Current test 27 and tests 454 onward cover safe/unsafe,
unknown, missing, incomplete, stale, projection-mismatch, and idempotent
recovery. No test mutates `recoveryEvidenceId` to an incompatible value.

**Independent valid probe.** Fresh valid recovery derived `3` from the
inclusive interval 2..4, retained journal positions `[2,3,4]`, reached
`RECOVERED`, and emitted one `recovery.confirmed` event. Two fresh identical
fixtures produced identical replay range, event identity/order, projection
identity, evidence identity, and final recovery state.

**Independent invalid matrix.** Unknown checkpoint, unsafe checkpoint, missing
journal, incomplete interval, stale journal position, projection mismatch,
replay-key mismatch, invalid range, and duplicate positions all rejected and
remained `NEEDS_RECOVERY` with zero replayed events and no confirmation.

**Adversarial negative result.** Setting only `recoveryEvidenceId='other'`
returned `canExecute(RECOVER_CHECKPOINT) = true`; the command confirmed, changed
state to `RECOVERED`, emitted `recovery.confirmed`, and rewrote the evidence ID
to the hard-coded constant. This directly violates the evidence-identity
requirement.

**Race and idempotency probes.** Mutating journal positions after acceptance
but before confirmation rejected recovery. Repeating already-confirmed recovery
was rejected with one confirmation event and unchanged replay count/state.

**Closure criterion.** Recovery evidence identity must be modeled as required
input, compared to authoritative persisted evidence, and never fabricated by
the effect; conflicting identity must reject without promotion.

**Classification: `PARTIALLY_CLOSED`.** Most safe-checkpoint and replay guards
pass, but evidence identity remains a material open path.

## 12. New finding — PCA-MAJOR-025 stale same-revision projection can overwrite scheduler authority

**Severity:** MAJOR  
**State:** `OPEN`  
**Root cause:** `reconcileDirectCapacityMutation` treats a state projection as
authoritative when its `schedulerRevision` equals the scheduler's revision. It
does not authenticate the projection write or distinguish a canonical update
from stale/local state mutation.

**Evidence:** In a fresh common scheduler at revision 1 with no leases, mutating
one execution state's exported capacity projection to `used=1`, `available=0`,
and `leases=['FAKE']`, then invoking `canExecute`, changed canonical scheduler
state to `used=1` with fabricated lease `SYSTEM-1`/`FAKE`, cleared the queue,
and advanced the scheduler revision. The operation was not a command-authorized
capacity transition.

**Impact:** A run-local projection can fabricate global occupancy and erase
canonical queue work, violating scheduler authority, capacity safety, and
projection immutability. This is distinct from the cross-execution queue
accounting/restoration defect in `PCA-MAJOR-006`.

**Actionable closure criterion:** Scheduler authority must accept capacity,
lease, queue, and fairness changes only through a canonical revision-checked
write path. Same-revision projection data must not overwrite authority; stale
writes must be rejected or ignored with no fabricated lease/capacity.

## 13. Regression of previously closed findings

No previously `CLOSED` finding was reopened. Current status and evidence:

| Finding | Current classification | Fresh regression evidence |
| --- | --- | --- |
| `PCA-CRITICAL-001` | `CLOSED` | Domain/UI mutation path remains command-routed; browser showed requested/confirmed toasts and rejected controls remain disabled. |
| `PCA-MAJOR-002` | `CLOSED` | `assertCoherentState` passes all fresh factories; explicit activity completion is required and publication gates remain enforced. |
| `PCA-MAJOR-003` | `CLOSED` | All 12 factories are deterministic and current domain journeys complete with meaningful transitions. |
| `PCA-MAJOR-005` | `CLOSED` | DAG conflict/audit/integration guards and cancellation regression tests pass. |
| `PCA-MAJOR-007` | `CLOSED` | Onboarding journey reaches `ENABLED` only after bootstrap, migration, verification, audit, and approval. |
| `PCA-MAJOR-008` | `CLOSED` | Current UI controls have handlers, guards, disabled reasons, and confirmed events. |
| `PCA-MINOR-001` | `CLOSED` | Named controls, ARIA landmarks, progress semantics, focus styling, and text/icon status semantics pass available checks. |
| `PCA-MAJOR-018` | `CLOSED` | Assignment/session/cycle segregation and reuse rejection remain covered. |
| `PCA-MAJOR-019` | `CLOSED` | Divergence remains classification → decision → compatible effect → resolution. |
| `PCA-MAJOR-020` | `CLOSED` | Onboarding activities retain distinct assignments, sessions, roles, and cycle. |
| `PCA-MINOR-003` | `CLOSED` | Real React/jsdom mounting and causal UI actions pass. |
| `PCA-MAJOR-021` | `CLOSED` | Local start/retry dispatch uses capacity/eligibility/lease guards; residual global issues remain consolidated under 006. |
| `PCA-MINOR-004` | `CLOSED` | Variant B navigation buttons expose stable accessible names. |
| `PCA-MINOR-005` | `CLOSED` | Available browser color checks and source status semantics remain sufficient; no new material contrast finding. |
| `PCA-MAJOR-022` | `CLOSED` | Waiting work cannot be completed; explicit completion releases leases and publication remains blocked until all activities complete. |
| `PCA-MINOR-006` | `CLOSED` | Independent current suite count is 60/60, not the stale historical 51/51 count. |

The target findings are classified in the consolidated table below; they were
not counted as reopened previously closed findings where their prior state was
partial or newly introduced.

## 14. Command lifecycle revalidation

Representative command paths were independently checked:

| Command | Valid path | Invalid/race path | Result |
| --- | --- | --- | --- |
| `START_RUN` | validated unchanged snapshot | post-lock and request/confirmation authority drift | accepted/confirmed only when fresh; stale paths rejected |
| `SET_PRIORITY` | queued shared candidate priority update | invalid range/terminal execution remains guarded | requested → accepted → confirmed; selection changes |
| `CONFIRM_REMOTE` | exact approved/merged PR | all tested post-merge mutations and both races | exact unchanged path confirms; stale paths reject |
| `RECOVER_CHECKPOINT` | safe 2..4 journal interval | invalid evidence, journal mutations, repeat | valid path confirms once; invalid paths reject, except ignored evidence ID |

No direct authoritative mutation path was found for these commands outside the
domain lifecycle, but the scheduler projection reconciliation path described in
`PCA-MAJOR-025` is an unauthorized capacity-authority write mechanism.

## 15. Recovery, scheduler, and lifecycle cleanup

Fresh cleanup checks showed:

- normal explicit completion releases an activity lease and redispatches the
  next local candidate;
- direct and PR terminal publication releases the current execution's leases;
- cancellation releases leases and preserves ticket functional states;
- retry creates a new assignment/session and preserves the idempotency key;
- UNKNOWN capacity creates no lease or running activity;
- fairness state is deterministic within a scheduler;
- one-slot and two-slot lease IDs are unique and lease owners point to the
  correct execution/activity.

The residual cleanup issue is cross-execution capacity reconciliation: global
capacity restoration can clear another execution's queue member, leaving its
activity waiting without a canonical queue candidate. This is included in
`PCA-MAJOR-006`, not duplicated as another finding.

## 16. 12-scenario regression

Each current factory was created twice from a fresh fixture, checked with
`assertCoherentState`, and compared for deterministic initial state. Positive
journeys and relevant negative guards were independently exercised:

| Scenario | Independent result |
| --- | --- |
| `normal` | pre-start advance rejected; snapshot validation/start confirmed; run remains waiting for capacity until work completes |
| `audit` | reauditing before all remediations rejected; two remediations then independent reauditing confirmed both findings |
| `capacity` | dispatch before reconciliation rejected; capacity reconciliation confirmed and processing resumed |
| `retry` | failed activity retried with confirmed new attempt/assignment/session |
| `rounds` | authorization confirmed the permitted next round |
| `conflict` | conflict resolution → integration audit → wave integration confirmed |
| `divergence` | classification → human decision → compatible corrective effect resolved the divergence |
| `recovery` | valid safe recovery confirmed; invalid evidence matrix remains blocked as described above |
| `drift` | publication revalidation → approval → local integration → remote push confirmed |
| `pr` | approval → merge → remote confirmation completed; stale mutations rejected at domain level |
| `migration` | bootstrap/migration/verification/audit/approval reached `ENABLED` |
| `adr-mutation` | restore rejected mutation and returned snapshot to `DRAFT` |

Scenario reset through the real browser selector changed the URL/state to a new
factory and cleared the prior in-memory journey. Shared scheduling was tested
separately with two and three executions because it is not naturally represented
by a single scenario factory.

## 17. Test execution

Executed from the exact audited directory:

```text
C:\Users\taalves\OneDrive - Octave\Documents 1\pessoal\ai-engineering-development\prototype
```

- `npm test`: **PASS**, 60 tests, 60 passed, 0 failed, 0 skipped, 0 todo.
- `npm run lint`: **PASS**, exit code 0, `tsc --noEmit`.
- `npm run build`: **PASS**, exit code 0, `tsc -b && vite build`; Vite 8.2.2
  transformed 1820 modules and produced the production bundle.

The suite count claim of 60/60 is independently confirmed. The historical
51/51 claim is stale, not the current result.

## 18. Test-quality assessment

The new tests are substantially causal in several areas:

- post-validation `START_RUN` mutations would fail if the freshness guard were
  removed;
- PR post-merge mutations would fail if the corresponding identity/hash/check
  predicates were removed;
- shared scheduler tests use one actual scheduler object, actual leases, and
  actual candidate selection rather than independent counters;
- priority tests inspect the queued candidate priority and selected execution;
- fairness tests use repeated release/selection cycles and assert the sequence;
- safe recovery tests mutate checkpoint/journal/projection inputs and assert
  rejection and no replay.

Important gaps remain:

- no test covers incompatible `recoveryEvidenceId`, which is why the defect was
  independently found;
- no test creates two state projections, mutates one at the same scheduler
  revision, and asserts canonical scheduler immutability;
- cross-execution state transitions do not assert queue-reason relabeling or
  queue-counter equality against all waiting activities;
- capacity restoration tests do not verify that all execution registrations and
  queue members survive reconciliation;
- recovery count is derived from modeled interval metadata, not from an actual
  exact journal-event collection; the metadata consistency checks pass, but the
  prototype does not contain a real append-only journal implementation;
- accessibility tests are DOM/ARIA-focused and do not constitute a full
  assistive-technology, keyboard-order, or responsive visual audit.

No source/test mutation testing was performed because this audit was strictly
read-only. The causal conclusions above are based on source predicates,
behavioral assertions, and independent adversarial probes.

## 19. Browser/UI validation

The local Vite application was served at `http://127.0.0.1:4173/` and tested in
the real Codex in-app browser.

Observed behavior:

- normal route mounted with `READY/IDLE`, disabled guards, and the snapshot
  preparation control;
- snapshot view displayed all 14 ADRs, revision 3, hashes, base/configuration,
  capacity, and `CLEAN` state;
- `Validar snapshot` showed confirmed lifecycle evidence and enabled start;
- `Confirmar e iniciar` showed confirmed lifecycle evidence, `RUNNING`, and
  capacity projection changes;
- activity view displayed assignment, session, role, skill, cycle, attempt,
  checkpoint, and lease-sensitive action guards;
- PR route initially disabled remote confirmation, then displayed
  `AWAITING_PR_MERGE`, `PR_MERGED`, and finally
  `REMOTE_PUBLICATION_CONFIRMED` only after the three command stages;
- recovery route exposed the enabled recovery intervention for the recovery
  scenario and displayed safe checkpoint metadata;
- scenario selector reset to a fresh PR fixture and updated the URL;
- variant B navigation controls had accessible names for all ten navigation
  items, including hidden-label presentation;
- the browser DOM contained one main region, one log region, progressbar
  semantics, and zero unnamed buttons on the inspected variant B route;
- no console warning or error was returned for exercised browser routes.

The browser cannot directly mutate hidden domain fields such as stale ADR
authority, shared scheduler identity, queue reason, or recovery evidence ID.
Those behaviors were therefore validated at domain level and are not claimed as
visual UI findings. The browser did validate the UI paths that expose their
normal guards and resulting status projections.

## 20. Integration-scope scan

The prototype remains mock/local. A static scan found no executable `fetch`,
axios, WebSocket, EventSource, child process, Git/`gh` invocation, Codex CLI
execution, database client, SMTP/e-mail sender, persistent browser storage, or
external API call in `prototype/src`, `prototype/tests`, or
`prototype/package.json`.

Textual matches were limited to the local README URL, mock messages such as
`Codex CLI exit code 7`, and domain strings describing Git/GitHub behavior. No
external integration finding was created.

## 21. Consolidated finding table

| Finding | Pre-remediation state | Current state | Independent evidence |
| --- | --- | --- | --- |
| `PCA-CRITICAL-001` | Open in original audit | `CLOSED` | Domain command lifecycle and UI handlers remain causal; browser requested/confirmed path passes. |
| `PCA-MAJOR-001` | Partial in previous current re-audit | `CLOSED` | Eight fresh post-lock mutation cases and two command-stage races reject without start. |
| `PCA-MAJOR-002` | Partial/targeted in previous audits | `CLOSED` | Coherence assertions, explicit completion, and publication gates pass. |
| `PCA-MAJOR-003` | Open in original audit | `CLOSED` | 12 fresh deterministic factories and positive/negative journeys pass. |
| `PCA-MAJOR-004` | Partial in previous current re-audit | `CLOSED` | 12 fresh PR mutation cases and two races reject; unchanged merge confirms. |
| `PCA-MAJOR-005` | Open in original audit | `CLOSED` | DAG conflict, audit, integration, cancellation, and recalculation paths pass. |
| `PCA-MAJOR-006` | Partial before this audit | `PARTIALLY_CLOSED` | Shared leases and slot limits pass; cross-execution queue reasons/counters and restoration fail. |
| `PCA-MAJOR-007` | Open in original audit | `CLOSED` | Full onboarding lifecycle and independent role guards pass. |
| `PCA-MAJOR-008` | Open in original audit | `CLOSED` | Controls are interactive, guarded, and event-backed. |
| `PCA-MINOR-001` | Open in original audit | `CLOSED` | Browser ARIA/name/contrast checks pass within available scope. |
| `PCA-MAJOR-018` | Remediation target | `CLOSED` | Assignment/session/cycle history and reuse rejection pass. |
| `PCA-MAJOR-019` | Remediation target | `CLOSED` | Divergence requires explicit decision and compatible effect. |
| `PCA-MAJOR-020` | Remediation target | `CLOSED` | Onboarding role and cycle segregation pass. |
| `PCA-MINOR-003` | Remediation target | `CLOSED` | Real React mount and causal DOM journey pass. |
| `PCA-MAJOR-021` | Remediation target | `CLOSED` | Local start/retry lease/capacity/eligibility behavior passes. |
| `PCA-MINOR-004` | Remediation target | `CLOSED` | Variant B accessible names pass. |
| `PCA-MINOR-005` | Remediation target | `CLOSED` | Available contrast/status semantics pass. |
| `PCA-MAJOR-022` | Remediation target | `CLOSED` | Waiting activities cannot complete; explicit completion releases leases. |
| `PCA-MINOR-006` | Remediation target | `CLOSED` | Current suite is independently 60/60. |
| `PCA-MAJOR-023` | New in prior current re-audit | `CLOSED` | Real priority command changes queued selection; fairness sequence is bounded. |
| `PCA-MAJOR-024` | New in prior current re-audit | `PARTIALLY_CLOSED` | Safe/journal guards pass, but incompatible recovery evidence identity is accepted. |
| `PCA-MAJOR-025` | New in this audit | `OPEN` | Same-revision projection mutation fabricated a canonical lease and changed capacity. |

### Finding counts

- previously closed findings reopened: `0`;
- current known findings: `CLOSED=19`, `PARTIALLY_CLOSED=2`, `OPEN=1`,
  `AUDIT_BLOCKED=0`;
- new findings from this audit: `CRITICAL=0`, `MAJOR=1`, `MINOR=0`, `INFO=0`.

## 22. Files modified during audit

Authorized audit output only:

- `docs/prototype-conformance-reaudit-final.md`

No prototype, test, dependency, ADR, plan, traceability, coverage, prior
report, or remediation report was intentionally modified. The required build
commands affected only ignored generated build outputs.

## 23. Final recommendation

Do not approve `PROTOTYPE_CONFORMANT`.

Exact actionable findings remaining:

1. `PCA-MAJOR-006` — complete the canonical shared-pool model so all
   cross-execution waiting activities have correct queue reasons/counters and
   capacity restoration reevaluates every registered execution without losing
   queue members.
2. `PCA-MAJOR-024` — require and validate the authoritative recovery evidence
   identity; reject incompatible evidence and do not fabricate the identity in
   the recovery effect.
3. `PCA-MAJOR-025` — make scheduler authority writes revision-checked and
   canonical; prevent same-revision or stale execution projections from
   changing leases, capacity, queue, or revision.

This report performs no remediation.
