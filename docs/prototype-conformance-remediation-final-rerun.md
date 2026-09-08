# Prototype Conformance Remediation — Final Rerun

## Status

`PROTOTYPE_REMEDIATION_COMPLETE`

This remediation addresses the open findings recorded by the independent final rerun in `docs/prototype-conformance-reaudit-final-rerun.md`. The implementation is now ready for a fresh independent audit. This document is a remediation record, not an independent re-audit.

## Scope and authority

Remediation was limited to the prototype scheduler, execution identity handling, read-side purity, and regression tests. ADRs, the canonical specification, prior audit reports, plans, traceability, coverage, UI styling, package manifests, and unrelated prototype behavior were preserved.

Changed implementation files:

- `prototype/src/mockDomain.ts`
- `prototype/tests/mockDomain.test.ts`

Authorized output created:

- `docs/prototype-conformance-remediation-final-rerun.md`

## Remediation performed

### PCA-MAJOR-006 and PCA-MAJOR-026 — shared scheduler lifecycle safety

- Added canonical scheduler execution registrations containing snapshot status, functional/operational lifecycle state, activity identity mappings, activity state, and assignment eligibility.
- Global candidate selection now requires the registered target execution to have a confirmed snapshot, active functional state, dispatchable operational state, dispatchable activity state, eligible assignment, and no existing lease for that activity.
- Foreign unstarted, paused, cancelled, and otherwise lifecycle-ineligible executions remain queued or ineligible and cannot receive a lease during another execution’s dispatch.
- Explicit lifecycle operations update the scheduler registration; read-side guards do not register or overwrite executions.
- System capacity occupants are registered as canonical scheduler-owned capacity entries so lease ownership assertions remain complete.

### PCA-MAJOR-027 — scheduler mutation and capacity boundaries

- Queue insertion rejects unregistered execution/activity/assignment identities.
- Lease acquisition requires sequence plus exact execution, activity, assignment, and canonical queue-member identity agreement; it creates the lease from the canonical queue member, not caller-supplied fields.
- Lease release requires the complete lease identity, not only a lease number.
- Known capacity requires a non-negative integer maximum; lease assignment overflow is rejected before any scheduler mutation.
- Capacity coherence now validates lease owners against registered execution/activity/assignment mappings as well as queue ownership and counter invariants.
- Ordinary command effects cannot rewrite canonical scheduler identity mappings from a forged local projection. New activity/assignment creation paths use explicit identity-registration updates.

### PCA-MAJOR-028 — shared execution identity isolation

- Shared-scheduler scenario creation allocates a distinct execution number.
- Concurrent shared executions receive distinct run, snapshot, activity, assignment, session, artifact-cycle, idempotency, and event/publication correlation identities.
- Retry behavior continues to allocate a new assignment and session while retaining the activity idempotency key.
- Independent factory calls without a shared scheduler remain deterministic; shared execution identity uniqueness is asserted explicitly.

### PCA-MINOR-007 — read-side purity

- `canExecute` no longer calls scheduler projection synchronization, registration, queue repair, or revision-changing logic.
- Command advancement also avoids read-side scheduler synchronization before validation.
- Queue reason repair remains behind explicit canonical operations such as scheduler reevaluation, capacity reconciliation, and dispatch effects.
- Pure validation reads canonical scheduler capacity directly, so forged or stale local capacity projections cannot authorize unsafe dispatch or reconciliation.

## Regression evidence

New public-seam tests cover:

- global dispatch with three shared executions where only one execution has started;
- no new lease for paused or cancelled executions;
- forged execution, activity, assignment, and release identities;
- unregistered queue candidates;
- capacity overflow and pre-mutation rejection;
- command attempts to rewrite registration through a forged local projection;
- distinct shared run/activity/assignment/session identities;
- read-only `canExecute` preserving scheduler revision and stale queue state until explicit reevaluation.

Existing scheduler fairness, UNKNOWN-capacity, capacity restoration, cross-execution release, cancellation, retry, recovery, identity segregation, UI, publication, onboarding, ADR-integrity, and deterministic scenario tests remain green.

## Verification results

Executed from `prototype/`:

| Check | Result |
| --- | --- |
| `npm test` | PASS — 73 tests, 73 passed, 0 failed |
| `npm run lint` | PASS — TypeScript no-emit check |
| `npm run build` | PASS — Vite production build |
| Browser normal flow | PASS — snapshot validation and confirmed `RUNNING` dispatch |
| Browser capacity flow | PASS — `UNKNOWN` and `WAITING_CAPACITY` visible |
| Browser recovery flow | PASS — `RECOVERING` state visible |
| Browser console | PASS — no warning/error logs during smoke checks |
| Runtime integration scan | PASS — no executable fetch/axios/WebSocket/EventSource/process/Git integration found |

The browser smoke test used the existing local Vite server at `http://localhost:4173`; no external service or repository integration was introduced.

## Integrity and non-regression record

The prior independent rerun report was not modified. Its SHA-256 remains:

`docs/prototype-conformance-reaudit-final-rerun.md` — `7df8ba69e5b194d50dd51828cba5b8476d5667f3914b0518177890968d0aaff3`

Current SHA-256 values for the changed implementation/test surfaces are:

| File | SHA-256 |
| --- | --- |
| `prototype/src/mockDomain.ts` | `754375967a72ea889b59c11bbb6df790bc71e8a8cd8254b4c1df8828f1db15f8` |
| `prototype/tests/mockDomain.test.ts` | `b68234add3cb169a5274fc7e431c98054ad7470e039cc28aa033a1ac0466dbe2` |

Untouched reference surfaces retained their prior hashes:

| File | SHA-256 |
| --- | --- |
| `prototype/src/App.tsx` | `e8b8817618872e530a96d7c549b5be16bbe98837a2b12e28fe6077ee55f7265a` |
| `prototype/src/styles.css` | `e4c71d6d4aeed2cc582cff05f8709dcdbe2bc44c7190e68f2f6ad5624e5738bd` |
| `prototype/package.json` | `19057e64bff0a1e94d35233a8e926e52a48be3ee43f03100944a6e1d2dd42b25` |
| `prototype/package-lock.json` | `feb34da40e37b5075dffa3b9d9f77a95df26ebd01a26eadef53cb506fd301064` |

## Handoff

Remediation is complete. The next action is a fresh independent audit of the current implementation state. No audit result or ticket transition is asserted by this report.
