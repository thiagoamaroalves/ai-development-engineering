# Prototype Conformance Remediation — Final Rerun 4

## 1. Result

The three actionable root causes were remediated in the prototype implementation and covered by causal tests and fresh adversarial probes. No accepted ADR, prior audit, prior remediation report, or unrelated planning artifact was modified.

## 2. Baseline and environment

The controlling input was `docs/prototype-conformance-reaudit-final-rerun-4.md`, which reported PCA-MAJOR-021 reopened, PCA-MAJOR-027 open, PCA-MAJOR-028 open, and PCA-MAJOR-006 partially closed. The pre-remediation baseline was the existing 87-test suite with the browser start regression. Validation ran on 2026-09-08 in the local prototype at `http://localhost:4173/`, Node/npm with the repository's existing toolchain, and React StrictMode remained enabled.

## 3. Files changed

- `prototype/src/mockDomain.ts` — canonical registration provenance, collision-safe scheduler identity, capacity invariant, and publication identity lifecycle.
- `prototype/src/App.tsx` — pure React state projection and single command ownership.
- `prototype/tests/mockDomain.test.ts` — causal ownership, registry, capacity, identity, stale-evidence, and regression tests.
- `prototype/tests/ui.test.ts` — production-facing StrictMode UI flow test.
- `prototype/fresh-adversarial-probe.ts` — fresh independent probe suite, including shared A/B/C scheduling.
- `docs/prototype-conformance-remediation-final-rerun-4.md` — this report.

## 4. PCA-MAJOR-021 root cause and fix

The root cause was a productive `advanceCommand` call inside a React state updater, allowing StrictMode updater replay to mutate canonical scheduler state twice. `App.tsx:32` now executes `requestCommand` and each delayed `advanceCommand` outside `setState`; the setter receives only the already-produced authoritative projection.

## 5. UI command execution model after remediation

`App.tsx:32` uses `stateRef` to read the latest authoritative projection, issues one request, stores that result, and schedules accepted/confirmed effects by command ID. Timer callbacks read the current ref, execute the domain effect once, then publish the returned projection. `App.tsx:33-35` cleans timers and synchronizes inspection state without performing productive domain mutations. No command path is invoked from render or a state-updater callback.

## 6. StrictMode and browser evidence

`prototype/tests/ui.test.ts:108-139` renders the real `App` under `StrictMode`, prepares and validates the snapshot, starts the run, asserts the rendered `RUNNING` state, rejects the prior scheduler-inconsistency text, and counts one `run.started` event. The real browser smoke at `http://localhost:4173/` completed the same flow without blanking; the browser error log was empty.

## 7. PCA-MAJOR-027 root cause and fix

Registration no longer relies on identifier shape alone. Scheduler creation now rejects an existing ID at `prototype/src/mockDomain.ts:187-203`; scheduler state is held by canonical instance-backed state and lookup remains bound to the original instance. Reconciliation validates ceiling bounds before mutation at `prototype/src/mockDomain.ts:394-410`.

## 8. Canonical registration ownership model

`prototype/src/mockDomain.ts:161-182` creates an opaque, domain-issued provenance value tied to the scheduler and full registration fingerprint. `createCanonicalSchedulerExecutionRegistration` validates activity-to-assignment session, role, and artifact-cycle relationships before issuing provenance (`:273-287`). `validateSchedulerRegistration` requires the complete relationship fields and verifies the opaque provenance (`:310-333`). Thus a forged object reproducing valid-looking IDs cannot acquire ownership.

## 9. Scheduler identity and registry model

`createMockScheduler` generates a monotonic canonical ID when no ID is supplied and rejects duplicate explicit IDs before registry insertion (`prototype/src/mockDomain.ts:187-203`). `createScenarioState` no longer derives persistent scheduler identity from the scenario label (`:703`); independent same-scenario states receive distinct scheduler and execution identities. The registry cannot silently overwrite authority.

## 10. Scheduler mutation inventory

The exact scheduler mutation seams remain capability-gated through `requireSchedulerAuthority` (`prototype/src/mockDomain.ts:156-159`). Registration, lifecycle update, queue insertion, lease acquisition/release, dispatch, and capacity reconciliation continue to require the exact authority capability. Read projections are deep-cloned/frozen by `schedulerView` (`:147-153`), and registration replay is compared as a complete canonical record (`:295-308`).

## 11. Capacity ceiling invariant

For `KNOWN` capacity, `0 <= conservativeCeiling <= maximum`; the same invariant is enforced by reconciliation before mutation (`prototype/src/mockDomain.ts:394-410`) and by coherent-state assertion (`:650-666`). Invalid `maximum = 1, conservativeCeiling = 99` leaves revision and capacity unchanged. A valid ceiling-only change increments revision; an exact no-op does not.

## 12. PCA-MAJOR-028 root cause and fix

Publication identity previously survived a genuine head/tree candidate change. The implementation now computes candidate identity from repository, scheduler, execution, base, head, and tree (`prototype/src/mockDomain.ts:122-124`) and creates a new persistent publication identity whenever the canonical candidate changes (`:911` onward).

## 13. Publication identity lifecycle

The initial identity is content-bound and includes canonical execution context (`prototype/src/mockDomain.ts:720`). Retry, recovery, replay, and equivalent approval replay do not alter the candidate content or identity. A changed candidate recomputes the candidate ID and rolls the publication identity; display PR number remains a non-authoritative projection.

## 14. Identity rollover semantics

`CHANGE_CANDIDATE` changes the current head/tree, derives a new candidate/publication identity, clears merge/remote evidence, and invalidates approval, conformance, state, and queue evidence (`prototype/src/mockDomain.ts:911`). `REVALIDATE_PUBLICATION` binds evidence to the current base/head/tree and only preserves identity when that canonical candidate remains unchanged.

## 15. Stale evidence behavior

Rollover clears old evidence, and `mergedPublicationEvidenceMatches` requires the merged identity, candidate, base, head, tree, conformance run, and evidence ID to match the current identity. The new tests explicitly inject old merge evidence into the new candidate and assert `CONFIRM_REMOTE` is rejected (`prototype/tests/mockDomain.test.ts:1394-1408`; fresh probe `prototype/fresh-adversarial-probe.ts:121-126`). Cross-execution evidence and stale remote evidence are also rejected by the existing identity inventory tests.

## 16. Independent fixture uniqueness evidence

Two independent `createScenarioState('pr')` fixtures now have distinct scheduler IDs, execution IDs, candidate IDs, and publication canonical IDs. Two concurrent PR executions on one scheduler retain distinct persistent identities even when their display PR number is the same. Coverage is in `prototype/tests/mockDomain.test.ts:1320-1347` and the fresh probe at `prototype/fresh-adversarial-probe.ts:106-130`.

## 17. PCA-MAJOR-029 regression evidence

Queue completeness and bounded leases remain covered by the existing multi-slot and shared-scheduler tests, including maximum 5 with initialUsed 2 and completion through all activities. The fresh probe repeats maximum 5/initialUsed 2 (`prototype/fresh-adversarial-probe.ts:46-57`) and shared A/B/C scheduling with bounded leases and a complete fair queue (`:89-101`). No queue representation is conditioned on capacity exhaustion.

## 18. PCA-MAJOR-006 aggregate readiness

The scheduler authority is singular per instance, IDs cannot alias, registration ownership is provenance-backed, ceiling overflow is rejected atomically, queue completeness and lease bounds remain tested, and the browser no longer duplicates productive commands. PCA-MAJOR-006 was not directly edited or declared independently closed; its previously blocked dimensions are now ready for independent integrated reaudit.

## 19. Tests added

`prototype/tests/mockDomain.test.ts:1349-1408` adds direct tests for foreign/forged registration ownership, relationship tampering, duplicate scheduler IDs, independent scheduler resolution, atomic ceiling rejection, valid/no-op reconciliation, candidate rollover, stale evidence, and same-publication retry. `prototype/tests/ui.test.ts:108-139` adds the real production UI StrictMode path without mocking scheduler behavior.

## 20. Fresh adversarial probes

`prototype/fresh-adversarial-probe.ts` independently covers shape-valid foreign registration, duplicate IDs, same-scenario isolation, out-of-bound ceiling, max 5/initialUsed 2 queue completeness, shared A/B/C capacity and lease bounds, concurrent PR identity separation, changed-candidate identity, stale merge evidence, and independent PR fixture uniqueness. It completed with `FRESH_ADVERSARIAL_PROBE_PASS`.

## 21. Twelve-scenario regression

The deterministic journey test `as doze famílias executam jornadas determinísticas completas no domínio` at `prototype/tests/mockDomain.test.ts:1063` covers normal, audit, capacity, retry, rounds, conflict, divergence, recovery, drift, PR, migration, and ADR mutation. It passed after the remediation, alongside the aggregate coherence test at `:1050`.

## 22. npm test result

`npm test` passed: 92 tests, 92 passed, 0 failed, 0 skipped.

## 23. lint result

`npm run lint` passed (`tsc --noEmit`).

## 24. build result

`npm run build` passed: TypeScript build and Vite production build completed successfully.

## 25. Browser result

Real browser smoke passed at `http://localhost:4173/`: load, normal scenario, prepare snapshot, validate, confirm/start, rendered `RUNNING`, visible scheduler advance, completion of `ACT-8F12`, navigation to Artefatos and back, and empty browser error log. The ledger showed exactly 2 `command.requested`, 2 `command.accepted`, and 1 `run.started` for the exercised flow.

## 26. Residual limitations

This remains a local mock-domain prototype; the validation proves the prototype's canonical authority and UI integration contracts, not a production backend deployment. Independent reauditing is still required. No unresolved invariant was found in the requested remediation scope.

## 27. Exact final status

PROTOTYPE_REMEDIATION_COMPLETE

READY_FOR_INDEPENDENT_PROTOTYPE_REAUDIT

This report does not approve the prototype and does not directly close PCA-MAJOR-006.
