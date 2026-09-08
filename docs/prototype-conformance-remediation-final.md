# Final Prototype Conformance Remediation Report

## Status

`PROTOTYPE_REMEDIATION_COMPLETE`

All three actionable findings from
`docs/prototype-conformance-reaudit-final.md` are remediated, the existing
closed findings remain covered, and the repository is ready for a new
independent conformance audit. This report records remediation evidence only;
it does not replace or modify the independent re-audit.

## 1. Baseline and authority

- Repository: `ai-engineering-development`
- Branch: `main`
- HEAD: `4ae336c7f6a1dae468a23e1e9cbfe1fb95b63386`
- ADR authority: ADR-0001 through ADR-0014 and the approved portfolio records;
  no ADR was modified.
- Final independent re-audit: read-only; no changes made.
- Prototype remains the local in-memory React/TypeScript mock described by the
  project documentation. No external integration was introduced.

## 2. Files changed

- `prototype/src/mockDomain.ts`
  - canonical scheduler authority and projection boundary;
  - global queue reason reevaluation and restoration;
  - authoritative recovery-evidence validation/preservation.
- `prototype/tests/mockDomain.test.ts`
  - failing-first regressions and expanded scheduler/recovery coverage.
- `docs/prototype-conformance-remediation-final.md`
  - this remediation record.

`prototype/package.json` and `prototype/package-lock.json` were not changed.

## 3. PCA-MAJOR-025 — scheduler projection authority

### Root cause

`reconcileDirectCapacityMutation` treated equal scheduler/projection revisions
as permission to copy `MockState.capacity` back into `MockScheduler`. The
copy could fabricate leases, capacity, and queue changes from a run-local
projection.

### Remediation

- Removed projection-to-scheduler reconciliation and the
  `resetSchedulerFromCapacity` backdoor.
- `MockState.capacity` is refreshed only from the canonical scheduler through
  `syncSchedulerProjection`/`syncCapacityProjection`.
- Same-revision and stale-revision projection edits are ignored by domain
  evaluation and overwritten by canonical projection data.
- Added explicit canonical `reconcileSchedulerCapacity` for capacity-authority
  transitions and `reevaluateScheduler` for global queue reason maintenance.
- Canonical scheduler operations remain the only authority mutations for
  leases, capacity, queue membership, reasons, fairness, and revision.
- Scheduler revision is a freshness/projection marker; equality never grants
  write authority.

### Classification

`PCA-MAJOR-025: REMEDIATED`

## 4. PCA-MAJOR-006 — global queue and capacity restoration

### Root causes

- Duplicate queue insertion did not refresh an existing candidate’s reason.
- Capacity restoration cleared the canonical queue and rebuilt only the local
  execution’s candidate.
- Dispatch selection stopped when the next candidate belonged to another
  execution.

### Remediation

- Queue reasons are normalized centrally from canonical global capacity:
  `READY`, `CAPACITY`, and `ELIGIBILITY` remain consistent with the current
  scheduler condition.
- Queue counters are derived from canonical queue membership. The exposed
  `queuedByCapacity` and `queuedByEligibility` values are global scheduler
  counts; `fairQueue` remains the execution-local queue view.
- Capacity restoration preserves every registered execution and candidate,
  reevaluates all reasons, and dispatches globally up to available capacity.
- Completion/release in one execution can acquire the next candidate from a
  different execution.
- Cancellation filters only the cancelling execution’s candidates and leaves
  unrelated queue members intact.
- Added registered execution/activity metadata and reusable
  `assertCapacityCoherent` checks for registration, existence, reason, counter,
  duplicate, lease/queue, and waiting-activity invariants.

### Classification

`PCA-MAJOR-006: REMEDIATED`

## 5. PCA-MAJOR-024 — recovery evidence identity

### Root cause

Recovery validation ignored `recoveryEvidenceId`, and the recovery effect
replaced it with a hard-coded value.

### Remediation

- Recovery fixtures now carry the authoritative persisted/mock-persisted
  evidence identity `RECOVERY-EVIDENCE-2026-0831-01`.
- `RECOVER_CHECKPOINT` validates checkpoint, safety, journal position/range,
  exact journal positions, projection identity, replay key, and evidence ID.
- Missing or incompatible evidence is rejected before replay and leaves
  `NEEDS_RECOVERY`, zero replayed events, and no confirmation event.
- Request-stage and acceptance-stage identity mutations are revalidated and
  rejected.
- The effect captures and records the validated identity; it no longer
  manufactures or overwrites evidence identity.
- Valid recovery remains deterministic and idempotent.

### Classification

`PCA-MAJOR-024: REMEDIATED`

## 6. Tests added and evidence

Added regression coverage for:

- same- and stale-revision projection injection;
- fake lease, queue deletion, and capacity injection resistance;
- canonical READY/CAPACITY queue relabeling;
- UNKNOWN→KNOWN restoration across two executions;
- one-slot and multi-slot global restoration;
- cross-execution lease release/dispatch;
- cancellation preserving another execution’s queue;
- missing/incompatible recovery evidence;
- evidence mutation before acceptance and before confirmation;
- valid identity preservation and recovery idempotency.

The existing twelve scenario families remain present and deterministic:
normal, audit, capacity, retry, rounds, conflict, divergence, recovery, drift,
PR, migration, and ADR mutation.

## 7. Required commands

Run from `prototype/`:

```text
npm test
```

Result: exit code `0`; `67` tests, `67` passed, `0` failed, `0` skipped,
`0` todo, `0` cancelled.

```text
npm run lint
```

Result: `PASS`, exit code `0` (`tsc --noEmit`).

```text
npm run build
```

Result: `PASS`, exit code `0` (`tsc -b && vite build`); Vite transformed
`1820` modules and produced the production bundle.

## 8. Remediation probes

- Projection authority: same-revision mutation produced `NO CHANGE` in
  canonical revision, capacity, leases, and queue; no fake lease entered.
- Global restoration: two UNKNOWN-capacity executions retained canonical work;
  restoration produced system leases plus both execution candidates, with no
  dropped queue member.
- Cross-execution release: after execution A completed its leased activity,
  execution B acquired the available slot; remaining candidates stayed queued
  with `CAPACITY` reason when full.
- Recovery identity: valid evidence recovered with the same ID and replay count
  `3`; incompatible evidence and request-stage mutation were rejected with no
  replay or confirmation.

Cross-execution scheduler internals and evidence-ID mutation are domain-level
probes because those controls are not exposed as UI fields.

## 9. Browser regression

Final local browser smoke checks passed for:

- normal start lifecycle;
- UNKNOWN capacity projection and reconciliation control;
- priority control availability;
- PR approval, merge, and remote confirmation;
- recovery activity route;
- scenario reset through the scenario selector;
- accessibility baseline: one `main`, two progress bars, zero unnamed
  buttons, and a current `aria-current` page marker;
- console warnings/errors: none.

## 10. Previously closed findings

All previously closed findings remain closed and were not intentionally
regressed:

`PCA-CRITICAL-001`, `PCA-MAJOR-001`, `PCA-MAJOR-002`, `PCA-MAJOR-003`,
`PCA-MAJOR-004`, `PCA-MAJOR-005`, `PCA-MAJOR-007`, `PCA-MAJOR-008`,
`PCA-MINOR-001`, `PCA-MAJOR-018`, `PCA-MAJOR-019`, `PCA-MAJOR-020`,
`PCA-MINOR-003`, `PCA-MAJOR-021`, `PCA-MINOR-004`, `PCA-MINOR-005`,
`PCA-MAJOR-022`, `PCA-MINOR-006`, and `PCA-MAJOR-023`.

The preserved areas include START_RUN and PR freshness/race guards, global
lease uniqueness, priority/fairness, completion/release, UNKNOWN-capacity
conservatism, command lifecycle, assignment/session/cycle segregation,
divergence, onboarding, DAG behavior, and accessibility/UI behavior.

## 11. Handoff

Implementation remediation is complete. No independent re-audit was performed
as part of this remediation. The next step is a fresh independent audit against
the unchanged ADR authority and the current implementation state.

