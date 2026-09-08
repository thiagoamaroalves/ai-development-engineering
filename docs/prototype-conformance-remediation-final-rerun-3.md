# Prototype Conformance Remediation — Final Rerun 3

## 1. Result

**PROTOTYPE_REMEDIATION_COMPLETE**

PCA-MAJOR-027, PCA-MAJOR-028, and PCA-MAJOR-029 are remediated. PCA-MAJOR-006 is no longer blocked by those scheduler defects. Final handoff: **READY_FOR_INDEPENDENT_PROTOTYPE_REAUDIT**. This is remediation evidence, not prototype approval.

## 2. Baseline and environment

- Baseline HEAD: `4ae336c7f6a1dae468a23e1e9cbfe1fb95b63386`
- Node `v22.17.0`; npm `11.7.0`; package `orquestrador-prototype@0.1.0`
- Authority: ADR-0001 through ADR-0014. No ADR was modified.
- Existing untracked audit/remediation artifacts and the ADR installer were not modified.

## 3. Files changed

- `prototype/src/mockDomain.ts` — scheduler authority, encapsulation, validation, lifecycle, queue completeness, SYSTEM reservations, revision, publication identity.
- `prototype/tests/mockDomain.test.ts` — direct causal regressions.
- `prototype/fresh-adversarial-probe.ts` — standalone adversarial probes.
- This report.

Prior audits, prior remediation reports, accepted ADRs, and unrelated planning artifacts were not modified.

## 4. Root causes and fixes

### PCA-MAJOR-027 — canonical scheduler authority boundary

Root cause: canonical arrays/maps were exposed; enqueue/acquire/release/reevaluate could be called without proving ownership of the scheduler capability; registration lifecycle and identity validation trusted runtime input; SYSTEM leases were treated as ordinary leases; and revision coverage was incomplete.

Fix evidence:

- Canonical state is held in a `WeakMap`; the returned scheduler is a frozen deep read-only projection (`prototype/src/mockDomain.ts:125-156`).
- A frozen capability is held in a second `WeakMap`; shape-forged and cross-scheduler capabilities fail (`:152-153`).
- Every productive exported seam requires the exact capability: reevaluate `:217`, registration `:225`, lifecycle `:279`, reconciliation `:328`, enqueue `:346`, acquire `:368`, release `:387`.
- Runtime registration validation covers all lifecycle enums, canonical activity/assignment/execution identity forms, role/cycle ownership fields, duplicates, cross-execution collisions, and SYSTEM invariants (`:248-270`). Rejection occurs before writes.
- Legal lifecycle graphs are explicit (`:272-277`); queue reasons refresh inside lifecycle mutation (`:279-326`). RUNNING→READY is rejected.
- SYSTEM reservations use canonical `SYSTEM-RESERVATION-*` identities, ordinary release returns false, and terminal cleanup filters only user leases (`:159-180`, `:387-405`, `:542-555`).
- Constructor/reconciliation validates known/unknown capacity, fairness bounds, reservation uniqueness, and ceiling input (`:159-180`, `:328-345`).
- Material mutations advance revision; exact no-ops and exact registration replays do not (`:225-246`, `:279-326`, `:328-406`).

### PCA-MAJOR-028 — persistent publication identity uniqueness

Root cause: display PR number `184` was effectively the persistent identity, with only local suffixing for evidence.

Fix: `PersistentPublicationIdentity` binds provider, repository, scheduler, execution, candidate, display PR number, and a composite canonical ID (`mockDomain.ts:38`, `:121`). Merge and remote evidence are derived from this ID (`:122`, `:849-851`); post-merge validation requires identity and evidence equality (`:748`); shared execution remapping updates the publication identity (`:720-731`). A concurrent execution cannot satisfy another execution's evidence.

### PCA-MAJOR-029 — queue completeness under valid multi-slot capacity

Root cause: startup seeded one candidate and populated remaining work only after capacity exhaustion.

Fix: all dispatchable activities are enqueued before lease selection (`mockDomain.ts:508-534`). Queue representation is independent from leasing: one candidate receives a lease, remaining eligible work remains canonically represented with READY/CAPACITY/ELIGIBILITY reason. Completion releases and redispatches through the same path (`:457-466`, `:508-555`). The exact max=5/initialUsed=2 probe now yields used=3, available=2, one RUNNING activity, and four READY queue entries; the normal run reaches terminal publication.

## 5. Mutation inventory after remediation

| Seam | Capability | Canonical effect | Revision |
|---|---|---|---|
| `registerSchedulerExecution` | exact scheduler capability | create immutable registration | +1; exact replay no-op |
| `updateSchedulerExecutionRegistration` | exact scheduler capability | explicit legal lifecycle transition | +1 on change; queue refresh |
| `reconcileSchedulerCapacity` | exact scheduler capability | status/max/ceiling/counters from canonical leases | +1 on material change |
| `enqueueSchedulerCandidate` | exact scheduler capability | insert/update one candidate | +1 on material change |
| `acquireSchedulerLease` | exact scheduler capability | remove candidate/create lease/update capacity/fairness | +1 |
| `releaseSchedulerLease` | exact scheduler capability | release matching non-SYSTEM lease | +1; SYSTEM no-op false |
| `reevaluateScheduler` | exact scheduler capability | refresh all queue reasons | +1 only if changed |
| internal registration/cleanup/priority | canonical authority obtained internally | no public alternate mutation seam | +1 on material change |
| reads/snapshots | none | frozen deep projection only | never |

## 6. Authority and projection model

The scheduler object is a frozen view. Canonical mutable state and capability are `WeakMap`-owned. Validity is identity equality, not object shape. Arrays/maps/records returned by properties and `getSchedulerSnapshot` are deep-frozen copies. Direct projection mutation cannot mutate scheduler authority.

## 7. Registration validation matrix

| Input | Result | Atomicity |
|---|---|---|
| invalid snapshot, functional, operational, or activity state | reject | revision/state unchanged |
| arbitrary activity or assignment identity | reject | revision/state unchanged |
| invalid role/cycle ownership | reject | revision/state unchanged |
| duplicate/cross-execution identity | reject | revision/state unchanged |
| exact complete replay | no-op | revision unchanged |
| altered same-identity replay or identity substitution | reject | prior record retained |

Tests: `prototype/tests/mockDomain.test.ts:93-115`; standalone probe `prototype/fresh-adversarial-probe.ts:27-39`.

## 8. Lifecycle and queue policy

Snapshot, functional, and operational transitions use explicit legal graphs (`mockDomain.ts:272-277`). Terminal states have no outgoing transitions except self-state. A lifecycle operation refreshes affected queue reasons before returning. Thus pause/fail/cancel/terminal states cannot retain a canonical READY queue reason. Queue population is driven by dispatchability, not available capacity; leasing remains the separate capacity invariant.

## 9. SYSTEM reservation invariants

SYSTEM identities are canonical and unique; SYSTEM registration remains confirmed/running/processing; ordinary release cannot remove SYSTEM leases; user completion/cancellation/cleanup preserves them; reconciliation derives capacity from the actual lease set. Coherence checks enforce integer known capacity, non-negative counters, `used + available == maximum`, and `used == canonical lease count` (`mockDomain.ts:586-599`). UNKNOWN capacity exposes no exact max/available.

## 10. Revision mutation matrix

Registration, lifecycle, eligibility, queue insert/update/remove/reason refresh, lease acquire/release, capacity status/max/ceiling/counters, sequence allocation, execution allocation, fairness cursor, priority, and terminal cleanup each advance revision when materially changed. Exact registration replay, no-op reconciliation, unchanged reason refresh, and rejected SYSTEM release do not.

## 11. Publication identity model

Canonical identity:

`github : repository : schedulerId : executionId : candidateId : pr-<display-number>`

The display PR number remains a projection value only. Merge and remote evidence contain the canonical ID; `CONFIRM_REMOTE` requires the merged publication identity and merge evidence to match the current identity. Retries/recovery of the same publication preserve that identity; a concurrent publication receives a different execution/candidate-bound identity.

## 12. Tests added

Direct regressions cover capability forgery and cross-scheduler capability, immutable projections, malformed registration and atomicity, exact replay/substitution, RUNNING→READY and queue refresh, SYSTEM identity/duplicate/release/cleanup, invalid capacity/fairness options, ceiling revision/no-op revision, exact partially occupied multi-slot queue completion, concurrent PR identity/evidence isolation, and retry confirmation.

## 13. Fresh adversarial probes

Executed independently of the test runner:

```text
npx tsx fresh-adversarial-probe.ts
FRESH_ADVERSARIAL_PROBE_PASS
```

The probe exercises capability forgery, malformed registration, lifecycle regression and queue refresh, capacity combinations 0/1/full/partial, revision, SYSTEM protection, shared A/B/C scheduler registration, missing scheduler reads, multi-slot normal completion, and concurrent PR evidence isolation.

## 14. Verification

Executed from `prototype/` after final changes:

- `npm test` — PASS, 87 tests, 0 failures.
- `npm run lint` — PASS (`tsc --noEmit`).
- `npm run build` — PASS (`tsc -b` and Vite production build).
- `npx tsx fresh-adversarial-probe.ts` — PASS.

## 15. Closed findings and residual limitations

PCA-MAJOR-024, PCA-MAJOR-025, PCA-MAJOR-026, and PCA-MINOR-007 were not intentionally reopened or redesigned. Shared scheduler paths necessarily changed, but the full existing suite remains green. No material invariant from PCA-MAJOR-027/028/029 remains unresolved in prototype scope. This remains a mock domain prototype, not a claim of production persistence or a real GitHub provider.

## 16. Exact final status

| Finding | Status |
|---|---|
| PCA-MAJOR-027 | REMEDIATED; ready for independent adversarial reaudit |
| PCA-MAJOR-028 | REMEDIATED; ready for independent adversarial reaudit |
| PCA-MAJOR-029 | REMEDIATED; ready for independent adversarial reaudit |
| PCA-MAJOR-006 | Unblocked by 027/028/029; ready for scheduler-contract reaudit |

**PROTOTYPE_REMEDIATION_COMPLETE**

**READY_FOR_INDEPENDENT_PROTOTYPE_REAUDIT**
