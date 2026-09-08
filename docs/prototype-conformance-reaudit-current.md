# Independent current-state prototype conformance reaudit

**Audit date:** 2026-09-04  
**Mode:** `READ_ONLY / INDEPENDENT / ADVERSARIAL / ADR_FIRST`  
**Audited path:** `C:\Users\taalves\OneDrive - Octave\Documents 1\pessoal\ai-engineering-development`

## 1. Formal verdict

`PROTOTYPE_REMEDIATION_REQUIRED`

The prototype is materially auditable and the latest remediation corrected explicit activity completion, local lease release, command lifecycle, divergence intervention, onboarding segregation, and the UI evidence path. It is not conformant in the current state because:

- `START_RUN` does not revalidate frozen ADR authority or frozen snapshot inputs after lock;
- the PR path can confirm remote publication after post-merge candidate drift;
- capacity is per `MockState`, not a shared pool across executions/repositories, and its queue counters are not reconciled to queue membership;
- `SET_PRIORITY` changes only a field/event and has no scheduling consequence;
- recovery accepts an arbitrary checkpoint without a safe-checkpoint guard.

No audit blocker prevented judgment of these material behaviors.

## 2. Audit independence and method

This was a fresh audit of the files present on 2026-09-04. Previous audit and remediation conclusions were treated as historical evidence only. I re-read the current ADR portfolio, approval/remediation records, project plan, traceability, coverage, original audit, previous reaudit, and latest remediation report; inspected current source and tests; executed the required commands in the audited prototype directory; ran independent TypeScript probes; mounted the real React application in the connected in-app browser; and performed static integration-leakage and regression scans.

No prototype source, test, dependency, ADR, plan, traceability, coverage, previous report, or remediation report was modified. Only this authorized report was created.

## 3. Authority and precedence

Authority was applied in this order:

1. accepted ADR-0001 through ADR-0014;
2. approved ADR portfolio records;
3. normative project documentation;
4. plan, traceability, and coverage artifacts;
5. previous audits and remediation reports as historical evidence only;
6. current implementation, tests, probes, and browser behavior.

The applicable normative requirements include snapshot immutability and identity (ADR-0001), separate state machines and confirmed transitions (ADR-0002), assignment/session/cycle segregation (ADR-0004), shared capacity, priority, fairness, leases, and no dispatch without capacity (ADR-0005), journal/recovery/idempotency (ADR-0006), DAG and publication lineage (ADR-0007), publication gates and remote confirmation (ADR-0008), independent audit/remediation (ADR-0009), onboarding (ADR-0010), backend/frontend authority separation (ADR-0011), and the frontend operational contract (ADR-0014).

## 4. Current repository baseline

- Branch: `main`.
- `HEAD`: `4ae336c7f6a1dae468a23e1e9cbfe1fb95b63386`.
- `origin/main`: `4ae336c7f6a1dae468a23e1e9cbfe1fb95b63386`.
- No staged changes and no tracked unstaged diff.
- The prototype, prior reports, plan, traceability, and coverage files are untracked in this worktree. `git ls-files prototype` returns no entries.
- Existing untracked items also include the Draw.io installer and the earlier audit artifacts. They were not attributed to any remediator because Git provides no historical attribution.
- Because the prototype is untracked, an exact historical implementation diff is unavailable. The current hashes below are the baseline for this audit.
- Applicable repository instructions: no `AGENTS.md` was found.
- `prototype/package.json` and `prototype/package-lock.json` are present but untracked. The ignored dependency directory was available when the required commands ran; no install, upgrade, or dependency mutation was performed.

### Required current SHA-256 hashes

| File | SHA-256 |
|---|---|
| `prototype/src/mockDomain.ts` | `485014F348A2DF9CD0EA3084B369CE98E24100852ABEFE2BF54FD684CD388EAC` |
| `prototype/src/App.tsx` | `E8B8817618872E530A96D7C549B5BE16BBE98837A2B12E28FE6077EE55F7265A` |
| `prototype/src/styles.css` | `E4C71D6D4AEED2CC582CFF05F8709DCDBE2BC44C7190E68F2F6AD5624E5738BD` |
| `prototype/tests/mockDomain.test.ts` | `CAB6A313F5DE89D2A4713BCCC6EC5A0146C84D972CCDE0DBC4EE4E24FCBC7955` |
| `prototype/tests/ui.test.ts` | `02FF04DC628E7881EAF1124620C5EC63CF8EFF19C3868E5543372E32A4E20ACE` |
| `prototype/package.json` | `19057E64BFF0A1E94D35233A8E926E52A48BE3EE43F03100944A6E1D2DD42B25` |
| `prototype/package-lock.json` | `FEB34DA40E37B5075DFFA3B9D9F77A95DF26EBD01A26EADEF53CB506FD301064` |

## 5. ADR integrity

All 14 current ADRs report `decision_status: ACCEPTED`, `implementation_status: UNPROCESSED`, and `revision: 3`. Hashes were normalized from CRLF to LF before hashing, matching the approved portfolio record.

| ADR | Current normalized SHA-256 | Expected approved SHA-256 | Result |
|---|---|---|---|
| ADR-0001 | `33705082b9d2f46e638cd93bdf27ca676cfc6181a2684ad583e4501f5d06d50d` | same | PASS |
| ADR-0002 | `ef9289c6fca4bba73fca53ca38c71dd19110eb1cfe948358a7cca1fe14e177d9` | same | PASS |
| ADR-0003 | `6325234bb9c927a6d2b38886206119c643a05718f6db8cce8df5625653260073` | same | PASS |
| ADR-0004 | `5b2454da004f5ca0f7c0b6dd36c35aeeae642dbc139b5c11e1295e0db62a1e4c` | same | PASS |
| ADR-0005 | `c1a9aaef50599f06afb979edbe8ac1084bde3eada4b2d1bbf87c3d5be886917d` | same | PASS |
| ADR-0006 | `ab39573f39849d9d9016683096126a63b037d763f09b4f00293500fd8fbcc6b2` | same | PASS |
| ADR-0007 | `ee4d22de0ff3e71f325bbf4f702c5c20221303db141f1d873c4e9cc438d38428` | same | PASS |
| ADR-0008 | `f887895fac13c0236b2f34cc5db9c3e43ef97bcd8e3e8b537db2fc8fa0f94947` | same | PASS |
| ADR-0009 | `4ab502aea4f09afe2c5fa33bfb6c5ee0d11e2d8f9af65f244209ce1fac935761` | same | PASS |
| ADR-0010 | `874b77ac7f1f19fe0b22a95705721905ae861feecd1e043a956c5c1bbfdac186` | same | PASS |
| ADR-0011 | `f17a2f90f8c7d8058bb927786dadfeabbe112e5fd898fc50115d37c9d02b3971` | same | PASS |
| ADR-0012 | `f73cf9dd962be0a0a45b0f69aa6e22bd3f5c0ac713fa9cae23fa8d285e4a4d88` | same | PASS |
| ADR-0013 | `377b712c1544d07e3c4e1990b84c124afceec984e54ef8c1ba6fadba14a5f218` | same | PASS |
| ADR-0014 | `3ac6d6c75e05bd65b2d90cc754ffdc4885f36cd98eb7a87c6bfb8395f044c642` | same | PASS |

No ADR divergence was found.

## 6. Result of original findings

| Finding | Normative requirement and original problem | Current evidence, associated tests, and independent probe | Closure criterion | Current classification |
|---|---|---|---|---|
| `PCA-CRITICAL-001` | Frontend must not fabricate acceptance, confirmation, or effects. Original UI performed state-like effects locally. | `requestCommand` and `advanceCommand` implement requested → accepted/rejected → confirmed; `App.tsx:40` routes UI actions through the domain. Tests cover rejected transitions and command lifecycle; browser showed requested and confirmed toasts. | All mutation must pass the domain lifecycle and rejected commands must not mutate functional state. | `CLOSED` |
| `PCA-MAJOR-001` | Snapshot must contain eligible ADRs and frozen hashes/inputs; post-lock mutation/drift must prevent start. Original snapshot was static. | Pre-lock integrity is implemented and 14 hashes are present. However, after `VALIDATE_SNAPSHOT`, independently mutating ADR content hash, ADR implementation eligibility, base SHA, config version, skill version, repository clean state, or repository alignment leaves `canExecute(START_RUN)` allowed; the command confirms and enters `RUNNING/WAITING_CAPACITY`. Tests cover pre-lock mutation but not this post-lock start path. | `START_RUN` must revalidate every frozen authority/input (ADR hash/eligibility, base, config, skill versions, repository identity) and reject stale snapshots without dispatch or rewriting frozen evidence. | `PARTIALLY_CLOSED` |
| `PCA-MAJOR-002` | Functional and operational state machines must be distinct and transitions/terminality/cooperative pause/cancel must be valid. Original implementation had only coarse states. | Separate types, guards, requested states, `assertCoherentState`, explicit `COMPLETE_ACTIVITY`, and terminal publication gates are present. Tests cover invalid transitions, pause/cancel, failed/recovery states, waiting completion rejection, and publication gating. | No invalid or fabricated state transition; pending work cannot become terminal. | `CLOSED` |
| `PCA-MAJOR-003` | Scenario families must demonstrate meaningful initial, positive, negative, evidence, final, reset, and isolation behavior. Original scenarios were labels. | Twelve deterministic factories and a deterministic domain journey exist; an independent probe created each twice and all pairs were equal and coherent. The browser loaded all 12 scenario overview routes. Full manual traversal of every action in every scenario was not performed. | Each scenario needs an executable, isolated route with meaningful guards, events, final state, and deterministic reset. | `CLOSED` for the prototype’s deterministic domain demonstrability; visual limitation is recorded below. |
| `PCA-MAJOR-004` | Direct push and PR must be separate, with stale identity invalidation and remote confirmation before completion. Original publication flows were mixed. | Mode-specific command visibility and guards pass; direct push requires local integration and PR requires merge. Independent probe found `CONFIRM_REMOTE` only checks all activities completed, mode, and `PR_MERGED`; after a valid PR merge, changing `currentHeadSha` to `tampered` still allowed confirmation and produced terminal `REMOTE_PUBLICATION_CONFIRMED`. | Remote confirmation must validate the approved base/head/tree, merge result, checks/mergeability, queue, and remote evidence at confirmation time. | `PARTIALLY_CLOSED` |
| `PCA-MAJOR-005` | DAG, waves, dependencies, conflict resolution, integration audit, and functional ticket cancellation must be coherent. Original graph and table diverged. | Graph and inspector read `state.tickets`; `recalculateDag` derives READY/BLOCKED and `lastUnblockedBy`; conflict → audit → integration and cancellation gates are enforced. Tests cover conflict, audit, cancellation, recalculation, and no silent dependency release. | One ticket source must drive graph/table/guards; no integration or dependency release without required gates. | `CLOSED` |
| `PCA-MAJOR-006` | Agent segregation and capacity must be verifiable, shared, bounded, fair, and lease-backed. Original IDs/capacity were decorative. | Assignment/session/cycle history and local lease lifecycle now work; explicit completion releases a lease and dispatches the next activity. Remaining defects are material: each `MockState` owns its own capacity pool, so two independent executions can each report the same five-slot pool and start independently; queue counters also start at `2/1` with no waiting activities and become `6/1` after start with only four waiting activities. | One shared scheduler/pool must arbitrate all executions, counters must reconcile to queue membership, and leases must account for actual active work globally. | `PARTIALLY_CLOSED` |
| `PCA-MAJOR-007` | Legacy onboarding must bootstrap before enablement and promote only after an independent formal audit. Original UI suggested readiness despite dirty/diverged state. | Onboarding guards require inspection, clean/aligned workspace, bootstrap, migration, verification, independent audit, and approval. Tests cover the happy journey and assignment reuse rejection. | Dirty/diverged onboarding cannot reach READY_TO_ENABLE or ENABLED; bootstrap must precede enablement. | `CLOSED` |
| `PCA-MAJOR-008` | Normative controls need real handlers, guards, rejection/effect evidence, and coherent visibility. Original buttons were inert. | `ActionButton` calls `canExecute` and `onSubmit`; domain/UI tests cover publication, interventions, retry, rounds, priority, cancellation, onboarding, export, and reset. Browser actions produced observable command status. | Every normative control has a causal handler, guard, and visible result. | `CLOSED` |
| `PCA-MINOR-001` | Controls need accessible names, focus visibility, announced dynamic state, and sufficient contrast. Original icon controls lacked names. | All 30 tested view/variant combinations had named buttons; variant B navigation names were accessible. CSS contains `:focus-visible`; progress bars have ARIA labels; toast uses `role=status`/`aria-live`; history uses `role=log`. The narrow browser screenshot shows horizontal overflow, but the plan contains no explicit breakpoint requirement. | Controls remain named and state changes announced, with usable focus and contrast in the adopted target viewport. | `CLOSED` with responsive/manual assistive-technology limits noted. |

## 7. Result of historical follow-up findings

| Finding | Previous known state | Current evidence and associated tests/probes | Current classification |
|---|---|---|---|
| `PCA-MAJOR-018` | Remediation declared assignment reuse fixed. | Fresh direct reuse attempt made the second finding’s remediator equal the first participant; `canExecute(REMEDIATE_FINDING)` rejected it. Retry and reauditor tests also prove new assignments/sessions and cycle history. | `CLOSED` |
| `PCA-MAJOR-019` | Remediation declared semantic divergence separated from resolution. | Classification is constrained to the evidence result; classification leads to `AWAITING_DECISION`, decision to `AWAITING_EFFECT`, and only a compatible corrective effect reaches `RESOLVED`. Domain and DOM tests pass. | `CLOSED` |
| `PCA-MAJOR-020` | Remediation declared onboarding role segregation fixed. | Bootstrap, migration, remediation, and audit have separate identities and roles; direct migration-assignment reuse for audit is rejected. Full onboarding test reaches `ENABLED` only after approval. | `CLOSED` |
| `PCA-MINOR-003` | Remediation declared real UI mounting and causal handlers added. | React/jsdom test mounts `App`; browser mounted all 30 view/variant routes and exercised snapshot, PR, divergence, reset, and guards. | `CLOSED` |
| `PCA-MAJOR-021` | Remediation declared start/retry now respect scheduler, capacity, eligibility, and leases. | `START_RUN` dispatches only within known capacity; UNKNOWN leaves work waiting; retry creates a new lease-backed assignment. This finding’s local start/lease criterion passes. Post-lock snapshot freshness is retained under `PCA-MAJOR-001`. | `CLOSED` |
| `PCA-MINOR-004` | Variant B navigation names were previously missing. | Browser and UI test found accessible names for navigation controls in variant B. | `CLOSED` |
| `PCA-MINOR-005` | Text/status contrast was previously insufficient. | Current computed colors remain dark against their backgrounds; no color-only status dependence was found. Responsive visual limitations are separate. | `CLOSED` |
| `PCA-MAJOR-022` | Normal advance previously fabricated completion and leaked leases. | `ADVANCE_NORMAL` now requires all activities completed; waiting activity completion is rejected; explicit completion of five activities produced five completed activities and released their activity leases; terminal push reset capacity to `used=0`, `available=5`, `leases=[]`. | `CLOSED` |
| `PCA-MINOR-006` | Previous report count was stale. | Current report’s 51/51 claim matches the audited command: 51 tests, 51 pass, 0 fail, 0 skipped, 0 todo. | `CLOSED` |

## 8. Snapshot/authority audit

Pre-lock validation is strong: the ADR set is closed at 14, hashes are full SHA-256 values, decision/implementation status is checked, repository cleanliness/alignment and base/config/skill inputs are checked, and ADR mutation blocks validation. The unchanged path validates normally.

The stale-authority path fails after validation/lock. `validation(START_RUN)` at `prototype/src/mockDomain.ts:283` checks only `snapshot.status === READY_TO_START` and functional `READY`. It does not call `validateAdrIntegrity`, compare current ADR authority against the frozen hashes, compare snapshot current inputs, or verify repository/base/config/skill identity. The independent probe mutated each applicable category—ADR content hash, ADR eligibility, base SHA, configuration version, skill version, repository cleanliness, and repository alignment—and `START_RUN` remained allowed in all seven cases. The command confirmed and entered `RUNNING/WAITING_CAPACITY`. Frozen snapshot fields were not rewritten, but execution was incorrectly admitted.

## 9. Scheduler/priority/fairness audit

Capacity-bounded local dispatch is real: known capacity and a fresh eligible assignment are required; UNKNOWN prevents dispatch; an explicit completion releases the lease and redispatches the next queued activity. However, `SET_PRIORITY` validation accepts a value and `applyEffect` only writes `run.priority` and records `priority.changed` (`mockDomain.ts:357`). A comparison with priorities `0` and `100` produced the same fair queue and the same next candidate after completion. No priority weight/order algorithm exists, and no deterministic anti-starvation behavior is demonstrated.

This is new finding `PCA-MAJOR-023`.

## 10. Shared-capacity/concurrency audit

`Capacity` is a field of `MockState` (`mockDomain.ts:35`), and `createScenarioState` constructs the same five-slot values independently for each state. Two independent executions therefore do not compete: each reports `maximum=5`, `used=4`, `available=1`, and the same lease identifiers. Starting them independently does not affect the other state. There is no global pool identity, cross-execution scheduler, or global occupied-lease reconciliation.

The local invariants `used + available == maximum` and lease-count equality hold for known capacity at stable points, but queue counters do not: the normal initial state reports `queuedByCapacity=2` and `queuedByEligibility=1` while no activity is waiting; after start it reports six capacity-queued items while four activities are waiting. This residual is included in `PCA-MAJOR-006`, not duplicated as a new finding.

## 11. Lease/completion lifecycle audit

The corrected explicit lifecycle passes for one state: `WAITING_CAPACITY` cannot be completed; `RUNNING` requires a matching lease; completion marks the activity complete, releases its activity lease, emits `lease.released` and `activity.completed`, and dispatches the next eligible waiting activity. Publication is blocked while activities are not all completed. Direct and PR terminal effects release remaining capacity.

The lifecycle therefore closes `PCA-MAJOR-022`; the global accounting and priority gaps remain under sections 9–10.

## 12. State-machine audit

Functional and operational state types are separate. Negative tests cover invalid advance, retry over limit, second round extension, invalid publication stages, incompatible divergence choices, dispatch without capacity, completion without a lease, and assignment reuse. Pause and cancellation expose requested states before confirmed effects, while cancellation preserves ticket functional states.

No command-driven path was found that fabricates normal completion from pending work after the remediation. Recovery is the exception addressed by new `PCA-MAJOR-024`: its guard does not validate the checkpoint itself.

## 13. Agent segregation audit

Activities carry assignment, logical identity, session, role, skill/version, artifact cycle, round, attempt, idempotency key, and checkpoint. Participation makes an assignment ineligible. Retry creates a new assignment/session while preserving the idempotency key. Remediator and reauditor assignments are distinct; direct reuse is rejected. Onboarding and conflict resolver identities are separated in the fixture and guards reject prohibited reuse paths.

The prototype demonstrates segregation in its mock scope; it does not execute real Codex sessions, which is an explicit prototype boundary.

## 14. DAG/ticket audit

The graph and table use `state.tickets`. `recalculateDag` derives dependency readiness, preserves terminal tickets, records `lastUnblockedBy`, increments the DAG revision, and does not silently release a dependent after cancellation. Conflict resolution, independent integration audit, wave integration, and functional ticket cancellation are command-gated. Tests cover valid and invalid paths, conflict handling, integration gating, cancellation, and recalculation.

No new DAG/ticket finding was identified.

## 15. Reconciliation/recovery audit

Semantic divergence is correctly progressive: evidence classification alone yields `AWAITING_DECISION`; an explicit human authority decision yields `AWAITING_EFFECT`; only the compatible corrective effect yields `RESOLVED`. Incompatible classification and effect choices are rejected, and events are retained.

Recovery accepts any state with `recovery.status === NEEDS_RECOVERY` (`mockDomain.ts:303`). An independent probe changed `recovery.checkpoint` from `event-contract-written` to `unsafe-checkpoint`; `RECOVER_CHECKPOINT` remained allowed and confirmed `RECOVERED`, set `replayedEvents=3`, and emitted `recovery.confirmed` for the unsafe checkpoint. No safe-checkpoint identity or journal evidence guard exists.

This is new finding `PCA-MAJOR-024`.

## 16. Publication audit

Direct push is separately modeled as candidate → approval → local integration → controlled push → remote confirmation. Base/head/tree drift blocks approval or push. PR is separately modeled as PR open → approval/merge → remote confirmation, and direct-only local integration is not rendered in PR mode. Tests and browser interactions cover both modes and stale direct publication inputs.

The residual PR defect is concrete: after valid approval and `MERGE_PR`, mutating `publication.currentHeadSha` still leaves `CONFIRM_REMOTE` allowed because its guard at `mockDomain.ts:310` does not check hashes, approval, queue, checks, mergeability, or remote evidence. The effect at line 378 then fabricates remote confirmation and terminal run completion. This partially reopens `PCA-MAJOR-004`.

## 17. Onboarding audit

The full command journey was executed: `DISCOVERED → INSPECTING → VALIDATING → BOOTSTRAPPING → MIGRATING → VERIFYING → AUDITING → READY_TO_ENABLE → ENABLED`. Bootstrap is allowed before enablement. Initial dirty/diverged state cannot be validated until remediation. Promotion requires an approved completed audit, and migration/audit assignment reuse is rejected.

No onboarding regression was found.

## 18. 12-scenario coverage

All 12 factories were independently created twice, compared for deterministic equality, and checked with `assertCoherentState`. All 12 overview routes loaded in the browser; representative positive/negative journeys were exercised in the domain and UI.

| Scenario | Positive/negative behavior and final/reset evidence |
|---|---|
| `normal` | Snapshot/start, explicit completion, publication; advance before completion rejected; reset recreates READY/IDLE. |
| `audit` | Remediation and independent reaudit approve findings; reaudit/reuse guards reject invalid paths. |
| `capacity` | UNKNOWN blocks dispatch; capacity reconciliation then dispatches; reset preserves UNKNOWN waiting state. |
| `retry` | Failed activity retries with a new assignment/session and same idempotency key; over-limit retry rejected. |
| `rounds` | Round 10 pauses and explicit authorization reaches round 11; second extension rejected. |
| `conflict` | Conflict resolution then integration audit then wave integration; integration before gates rejected. |
| `divergence` | Compatible classification → authority decision → corrective effect → resolved; incompatible options rejected; browser journey confirmed this. |
| `recovery` | Recovery rebuild path is deterministic and lease-aware, but unsafe-checkpoint acceptance remains `PCA-MAJOR-024`. |
| `drift` | Main/candidate drift invalidates approval; revalidation is required before publication. |
| `pr` | PR mode omits local integration, requires merge before remote confirmation; stale post-merge confirmation is `PCA-MAJOR-004`. |
| `migration` | Full onboarding reaches ENABLED only after independent audit/approval; dirty initial state is guarded. |
| `adr-mutation` | Implemented ADR hash divergence blocks processing; restore returns to a draft/revalidation path. |

Scenario switching reconstructs state, clears UI timers/selection/hash, and was exercised in the browser. Full manual interactive traversal of all controls in all 12 families was not performed.

## 19. Tests executed

Executed from the exact audited `prototype` directory:

- `npm test`: PASS — 51 tests, 51 pass, 0 fail, 0 skipped, 0 todo.
- `npm run lint`: PASS — `tsc --noEmit`.
- `npm run build`: PASS — `tsc -b && vite build`; Vite produced the production bundle.

No equivalent-checkout evidence was used. The commands ran against the current prototype files whose hashes are listed in section 4.

## 20. Test-quality assessment

The suite is materially better than the original: it uses behavioral assertions and covers command lifecycle, negative guards, explicit completion, local lease release/redispatch, UNKNOWN capacity, retry identity, round limits, DAG, publication, divergence, onboarding, deterministic factories, and real React mounting.

Important missing or non-causal assertions remain:

- no test mutates ADR authority or frozen base/config/skill inputs after snapshot validation and asserts `START_RUN` rejection;
- priority tests confirm only command acceptance, not queue reorder or selected-candidate consequences;
- no test creates two executions against one shared pool;
- no test reconciles queued counters against actual queue members;
- no test changes PR base/head/tree/checks after merge and requires remote confirmation to reject;
- no test rejects an unsafe recovery checkpoint or proves journal-derived replay evidence;
- no complete automated negative-action matrix exists for every scenario family;
- accessibility checks are DOM-focused, not a full assistive-technology, keyboard-order, or responsive visual audit.

Passing 51/51 is therefore insufficient for conformance.

## 21. Browser/UI assessment

The connected Codex in-app browser was available. I mounted all 10 main views × 3 variants (30 routes) and checked that each had a main heading, current navigation item, and named buttons. All 12 scenarios loaded from the overview route. Representative UI journeys covered snapshot validation/start, PR controls, divergence classification, intervention navigation, scenario reset, variant B navigation names, ARIA landmarks, and guard reasons.

No console warning or error was returned for the exercised tab. Buttons were named; the DOM contained progressbar semantics and the source contains focus-visible styling. A narrow-viewport screenshot showed horizontal overflow/clipping in variant B. The plan does not define a responsive breakpoint, so this is recorded as a visual limitation rather than a new conformance finding. Manual tab-order, actual assistive technology, and all-screen visual review remain unverified.

## 22. Integration-scope assessment

The prototype remains within the declared mock/local scope. No executable `fetch`, axios, WebSocket, EventSource, child process, Git/`gh`, Codex CLI invocation, database, SMTP, persistent browser storage, or external API call was found in `prototype/src`, `prototype/tests`, or `prototype/package.json`. Textual references such as the retry message “Codex CLI exit code 7” are mock evidence only.

## 23. New findings/regressions

### PCA-MAJOR-023 — priority has no scheduling consequence

- **Normative source:** ADR-0005, especially priority with fair distribution and anti-starvation.
- **Requirement:** Changing priority must change future scheduling weight/order without monopolizing the pool.
- **Evidence:** `SET_PRIORITY` only changes `run.priority` and emits `priority.changed`; `capacity.fairQueue` and dispatch selection are unchanged. Independent comparison at priority 0 and 100 produced the same queue and same next candidate.
- **Impact:** The UI exposes a command whose accepted effect does not affect scheduling; priority/fairness claims are not demonstrable and lower-priority work has no tested anti-starvation policy.
- **Correction criterion:** Implement a deterministic shared scheduler algorithm in which priority affects future selection and fairness bounds starvation; add multi-candidate and anti-starvation assertions.
- **Systemic:** Yes; scheduler-wide.
- **State:** `OPEN`.

### PCA-MAJOR-024 — recovery accepts an unsafe checkpoint

- **Normative source:** ADR-0006, especially recovery from the last safe checkpoint and the rule that saved status alone does not prove completion.
- **Requirement:** Recovery must verify a persisted safe checkpoint and replay/reconcile from authoritative evidence.
- **Evidence:** `validation(RECOVER_CHECKPOINT)` checks only `status === NEEDS_RECOVERY`. With `checkpoint='unsafe-checkpoint'`, the command confirmed, set `RECOVERED`, hard-coded `replayedEvents=3`, and emitted a confirmation event.
- **Impact:** An unsafe or fabricated checkpoint can be promoted to recovered state, potentially fabricating a deterministic projection or external effect.
- **Correction criterion:** Bind recovery to a validated safe checkpoint/journal position, prove replayed evidence and idempotency, reject unsafe/missing checkpoints, and assert no fabricated confirmation.
- **Systemic:** Yes; recovery-wide.
- **State:** `OPEN`.

No new CRITICAL or MINOR finding was necessary. Global capacity and queue-counter defects remain consolidated under the partially closed historical `PCA-MAJOR-006`; stale post-lock authority remains under `PCA-MAJOR-001`; stale PR confirmation remains under `PCA-MAJOR-004`.

## 24. Files modified during audit

Only the authorized file was modified/created:

- `docs/prototype-conformance-reaudit-current.md`

No prototype source/test/dependency/ADR/planning/traceability/coverage/prior-report/remediation file was intentionally modified. Build outputs and dependencies are ignored by `prototype/.gitignore` and were not used as audit artifacts.

## 25. Final recommendation

Do not approve the prototype as conformant. Remediation is required for `PCA-MAJOR-001`, `PCA-MAJOR-004`, `PCA-MAJOR-006`, `PCA-MAJOR-023`, and `PCA-MAJOR-024`. The next audit should specifically prove post-lock start rejection, shared cross-execution capacity/fair scheduling, PR confirmation identity checks, and safe checkpoint recovery. No remediation was performed during this audit.

## Consolidated finding table

| Finding | Previous known state | Current state | Evidence |
|---|---|---|---|
| `PCA-CRITICAL-001` | Open in original audit | `CLOSED` | Domain command lifecycle and UI routing pass. |
| `PCA-MAJOR-001` | Closed in previous reaudit | `PARTIALLY_CLOSED` | Post-lock ADR/base drift still starts. |
| `PCA-MAJOR-002` | Partially closed in previous reaudit | `CLOSED` | Explicit completion and state guards remove prior fabricated completion path. |
| `PCA-MAJOR-003` | Closed | `CLOSED` | 12 deterministic factories, domain journeys, 30 UI routes. |
| `PCA-MAJOR-004` | Closed | `PARTIALLY_CLOSED` | PR remote confirmation lacks post-merge candidate identity checks. |
| `PCA-MAJOR-005` | Closed | `CLOSED` | Shared ticket source, DAG guards, conflict/audit/integration tests. |
| `PCA-MAJOR-006` | Partially closed | `PARTIALLY_CLOSED` | Local lease lifecycle passes; no shared global pool and queue counters drift. |
| `PCA-MAJOR-007` | Closed | `CLOSED` | Onboarding sequence and approval guard pass. |
| `PCA-MAJOR-008` | Closed | `CLOSED` | Controls have handlers, guards, and observable outcomes. |
| `PCA-MINOR-001` | Closed | `CLOSED` | Names, ARIA, focus CSS, and DOM evidence pass; visual limitations noted. |
| `PCA-MAJOR-018` | Remediated | `CLOSED` | Direct assignment reuse rejected; retry/reaudit segregation passes. |
| `PCA-MAJOR-019` | Remediated | `CLOSED` | Classification, decision, effect, and resolution remain separate. |
| `PCA-MAJOR-020` | Remediated | `CLOSED` | Onboarding identities/roles/cycle segregation pass. |
| `PCA-MINOR-003` | Remediated | `CLOSED` | Real React mount and causal UI journeys pass. |
| `PCA-MAJOR-021` | Remediated | `CLOSED` | Start/retry dispatch respects local capacity/lease guards. |
| `PCA-MINOR-004` | Remediated | `CLOSED` | Variant B navigation names pass. |
| `PCA-MINOR-005` | Remediated | `CLOSED` | Current colors and status semantics pass available checks. |
| `PCA-MAJOR-022` | Remediated | `CLOSED` | Waiting work cannot complete; explicit completion and terminal release pass. |
| `PCA-MINOR-006` | Remediated | `CLOSED` | Current report/test count is 51/51. |
| `PCA-MAJOR-023` | New | `OPEN` | Priority field/event does not affect queue or next dispatch. |
| `PCA-MAJOR-024` | New | `OPEN` | Unsafe recovery checkpoint is accepted and confirmed. |

### Finding counts

Original findings: `CLOSED=7`, `PARTIALLY_CLOSED=3`, `OPEN=0`, `AUDIT_BLOCKED=0`.  
Historical follow-up findings: `CLOSED=9`, `PARTIALLY_CLOSED=0`, `OPEN=0`, `AUDIT_BLOCKED=0`.  
New findings: `CRITICAL=0`, `MAJOR=2`, `MINOR=0`, `INFO=0`.
