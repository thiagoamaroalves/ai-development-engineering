# Prototype Conformance Remediation — Current State

Status: `PROTOTYPE_REMEDIATION_COMPLETE`

Scope: remediation and validation only; no independent re-audit was performed.

## 1. Audited baseline / HEAD

- Baseline HEAD: `4ae336c7f6a1dae468a23e1e9cbfe1fb95b63386`
- `origin/main`: `4ae336c7f6a1dae468a23e1e9cbfe1fb95b63386`
- Protected current re-audit: `docs/prototype-conformance-reaudit-current.md`, SHA-256 `71EAD742D589B55E1909C0361C6004D2A9470B85B9B65F1C84350CA46E3B6AC7` after validation.

## 2. Files changed

- `prototype/src/mockDomain.ts`
- `prototype/tests/mockDomain.test.ts`
- `docs/prototype-conformance-remediation-current.md`

No ADR, current re-audit, or unrelated prototype file was changed.

## 3. Root cause of PCA-MAJOR-001

`START_RUN` previously checked only `snapshot.status` and functional readiness. Snapshot freshness was validated at `VALIDATE_SNAPSHOT` but not at the command boundary immediately before acceptance.

## 4. Atomic START_RUN revalidation

`START_RUN` now requires `READY_TO_START`, a still-`READY` run, valid complete ADR integrity, the same eligible ADR set and hashes captured in the snapshot, matching base/config/skill inputs, and clean/aligned repository state. The validation runs before acceptance; rejected commands cannot lock, dispatch, or acquire leases.

## 5. Stale inputs covered

Regression tests individually cover ADR content hash, ADR eligibility, base SHA, configuration version, skill version, repository cleanliness, and repository alignment. Every case asserts rejection, an unstarted run, unchanged lease count, and no `run.started` evidence. An unchanged snapshot still starts successfully.

Finding classification: `PCA-MAJOR-001 — REMEDIATED`.

## 6. Root cause of PCA-MAJOR-004

`CONFIRM_REMOTE` previously treated `PR_MERGED` as sufficient and did not bind confirmation to the identity/evidence recorded by the merge transition.

## 7. PR confirmation freshness rules

`MERGE_PR` records candidate ID, PR number, approved base/head/tree, conformance-run ID, and merge remote evidence. `CONFIRM_REMOTE` now requires those values to match current publication state, plus queue position/ownership, approval and conformance freshness, passing checks, mergeability, and current base/head/tree equality. Drift remains `PR_MERGED` and cannot complete the run.

## 8. Root cause of PCA-MAJOR-006

Capacity and leases were maintained as mutable per-state counters, allowing independently-created executions to model overlapping pools and allowing decorative queue counts to diverge from membership.

## 9. Shared capacity model

Added a deterministic in-memory `MockScheduler` authority. It owns global status, total/used/available capacity, leases, queue candidates, execution registration, revisions, and dispatch fairness. `MockState.capacity` is a projection of that authority; leases are globally counted and execution-owned for release/completion. Revisioned projections prevent stale execution views from overwriting newer scheduler authority.

## 10. Queue accounting model

Queue candidates carry execution, activity, assignment, priority, sequence, and reason (`READY`, `CAPACITY`, or `ELIGIBILITY`). `queuedByCapacity` and `queuedByEligibility` are derived from actual scheduler members. Stable-state assertions compare the projection with the canonical scheduler and validate candidate/activity state consistency.

## 11. Root cause and remediation of PCA-MAJOR-023

`SET_PRIORITY` previously changed only `run.priority`. It now updates the priority of that execution's queued scheduler candidates, so subsequent selection changes materially while already-running work is not preempted.

Finding classification: `PCA-MAJOR-006 — REMEDIATED`; `PCA-MAJOR-023 — REMEDIATED`.

## 12. Priority / fairness algorithm

The scheduler selects highest priority, then earliest enqueue sequence. A bounded fairness rule prevents the same execution from winning more than two consecutive dispatches when another execution is queued; the next selection excludes the previous execution. The rule is deterministic, explainable, and has no randomness.

## 13. Anti-starvation proof

The regression test repeatedly releases a one-slot scheduler after high-priority execution A wins twice. The third selection is eligible lower-priority execution B (`A, A, B`). Shared execution tests also prove independent executions receive distinct leases from one global pool, and release makes the next queued execution eligible.

## 14. Root cause and remediation of PCA-MAJOR-024

`RECOVER_CHECKPOINT` previously accepted any `NEEDS_RECOVERY` state and hard-coded replay count `3`. It now requires validated checkpoint safety and compatible persisted evidence before acceptance.

## 15. Safe checkpoint model

Recovery models checkpoint identity/safety, journal position, replay start/end, exact journal positions, projection hash, replay identity, and recovery evidence ID. The guard rejects unknown, unsafe, missing, stale, or incompatible evidence. Valid replay derives the count from the inclusive journal interval and confirms exactly once.

## 16. Journal / replay evidence

The valid fixture uses checkpoint `event-contract-written`, journal position `5`, replay range `2..4`, positions `[2,3,4]`, projection `projection-recovery-v1`, and replay key `replay-recovery-v1`. Recovery evidence is `RECOVERY-EVIDENCE-2026-0831-01`; repeat recovery after `RECOVERED` is rejected without duplicate confirmation.

Finding classification: `PCA-MAJOR-024 — REMEDIATED`.

## 17. Tests added

Added regression coverage for all seven stale START_RUN inputs; PR post-merge base/head/tree/candidate/approval/checks/mergeability plus conformance/evidence drift; shared one-slot and multi-execution leases; release/redispatch; command-level priority changes; fairness; UNKNOWN capacity; queue reason derivation; and safe/unsafe/unknown/missing/stale/incompatible/idempotent recovery.

## 18. Actual final test count

`60` tests, `60` passed, `0` failed, `0` skipped, `0` todo.

## 19. npm test result

`npm test` — PASS (exit code 0).

## 20. Lint result

`npm run lint` — PASS (TypeScript `--noEmit`, exit code 0).

## 21. Build result

`npm run build` — PASS (`tsc -b && vite build`, exit code 0).

## 22. Independent probe results

- Probe A: valid start succeeds; all seven stale authority/input mutations return `allowed:false`, `rejected`, functional `READY`, and no new lease.
- Probe B: post-merge base/head/tree/candidate/approval/checks/mergeability drift all return `false`; unchanged merge confirms `REMOTE_PUBLICATION_CONFIRMED` and `COMPLETED`, with persisted merge evidence.
- Probe C: two executions share a two-slot scheduler and hold two distinct execution-owned leases; one-slot priority/fairness selection is `A, A, B`; UNKNOWN capacity leaves both candidates queued with zero leases.
- Probe D: unsafe, unknown, missing, stale, and projection-incompatible recovery all reject and remain `NEEDS_RECOVERY`; valid replay derives `3` events and the recovery evidence ID.

## 23. 12-scenario regression

All 12 existing families remain coherent and deterministic: normal, audit, capacity, retry, rounds, conflict, divergence, recovery, drift, PR, migration, and ADR mutation. Existing full-domain journey tests also pass, including normal completion, publication mode separation, recovery, onboarding, DAG, divergence, retry, and ADR restoration paths.

## 24. Browser validation

Using the available in-app browser against the local Vite build: PR approval → merge → remote confirmation reached `REMOTE_PUBLICATION_CONFIRMED`; merge and confirmation guards were enabled only at the correct transitions; recovery rendered `RECOVERING`; no unnamed buttons were found. Existing UI test coverage plus the browser smoke check preserved snapshot/start, priority, scheduler/queue visualization, publication, recovery, normal-flow, and accessible navigation behavior. Domain-only claims are identified separately in the probe/test sections.

## 25. Previously closed findings

All findings previously classified `CLOSED` remain preserved by the unchanged authority files and the passing regression suite: `PCA-CRITICAL-001`, `PCA-MAJOR-002`, `PCA-MAJOR-003`, `PCA-MAJOR-005`, `PCA-MAJOR-007`, `PCA-MAJOR-008`, `PCA-MINOR-001`, `PCA-MAJOR-018`, `PCA-MAJOR-019`, `PCA-MAJOR-020`, `PCA-MINOR-003`, `PCA-MAJOR-021`, `PCA-MINOR-004`, `PCA-MINOR-005`, `PCA-MAJOR-022`, and `PCA-MINOR-006`. No closed finding was weakened or reopened.

## Actionable finding summary

| Finding | Classification |
| --- | --- |
| PCA-MAJOR-001 | REMEDIATED |
| PCA-MAJOR-004 | REMEDIATED |
| PCA-MAJOR-006 | REMEDIATED |
| PCA-MAJOR-023 | REMEDIATED |
| PCA-MAJOR-024 | REMEDIATED |

The repository is left ready for a fresh independent auditor.
