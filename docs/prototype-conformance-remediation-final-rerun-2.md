# Prototype Conformance Remediation — Final Rerun 2

## Remediation Verdict

`PROTOTYPE_REMEDIATION_COMPLETE`

The three remaining findings from the final independent rerun were remediated:
`PCA-MAJOR-027`, `PCA-MAJOR-028`, and `PCA-MINOR-007`. The residual portion of
`PCA-MAJOR-006` is therefore closed by the same bounded correction. This is a
remediation result, not an independent final conformance certification.

## Scope and Authority

- Canonical prototype: `prototype/`
- Final conformance audit baseline: `docs/prototype-conformance-reaudit-final-rerun-2.md`
- Audit HEAD and remediation start HEAD: `4ae336c7f6a1dae468a23e1e9cbfe1fb95b63386`
- Current HEAD: `4ae336c7f6a1dae468a23e1e9cbfe1fb95b63386` (working-tree remediation)
- ADRs, canonical authority, and the independent audit report were not modified.
- No unrelated redesign, new lifecycle authority, or ticket-history rewrite was performed.

## Findings Received and Validation

| Finding | Baseline validation | Remediation | Closure result |
|---|---|---|---|
| `PCA-MAJOR-006` residual | Scheduler authority and identity obligations remained partially open because the three findings below were open. | Closed the residual through the canonical scheduler and identity-boundary corrections. | `CLOSED` |
| `PCA-MAJOR-027` | Valid: registration overwrite, forged reconciliation assignments, and malformed factory capacity were accepted. | Added scheduler-scoped capability validation; made registration creation-only and idempotent; added explicit lifecycle update; validated capacity/reservation inputs; reconciliation preserves only canonical leases and is atomic on rejection. | `REMEDIATED` |
| `PCA-MAJOR-028` | Valid: shared executions collided in onboarding, event, command, and other persisted traceability identities. | Added execution-scoped remapping for onboarding activities/assignments/sessions/cycles/workspace, events, artifacts, publication evidence, and recovery evidence. Command IDs and correlation IDs are now execution-scoped. | `REMEDIATED` |
| `PCA-MINOR-007` | Valid: missing scheduler lookup created a new scheduler and `SYSTEM` registration during a read/guard path. | Scheduler lookup now fails closed; `canExecute` returns a denial for missing authority; no read path creates or registers scheduler state. | `REMEDIATED` |

## Files Changed

### Production

- `prototype/src/mockDomain.ts`

### Required tests

- `prototype/tests/mockDomain.test.ts`

### Remediation evidence

- `docs/prototype-conformance-remediation-final-rerun-2.md`

No migration or generated artifact was required. `prototype/dist/` remains build
output and is not part of the source remediation.

## Gap Remediation

The scheduler/identity gap was closed at the shared domain boundary rather than
by patching individual UI paths:

1. `createMockScheduler` rejects non-integer/negative known capacity, invalid
   initial reservations, duplicate system reservations, and known-capacity
   inputs on an `UNKNOWN` scheduler.
2. Registration requires the scheduler's canonical capability, validates
   identity uniqueness, is idempotent only for the same complete registration,
   and rejects overwrite or identity replacement.
3. Lifecycle changes use `updateSchedulerExecutionRegistration`; terminal and
   snapshot regressions are rejected, and canonical mutations advance the
   scheduler revision.
4. Capacity reconciliation requires the same capability, rejects noncanonical
   lease assignments before mutation, preserves the existing lease set, and
   validates the resulting counters.
5. Missing scheduler lookup no longer calls the scheduler constructor.

## Requirement and Acceptance Remediation

The implementation now demonstrates the required positive and negative paths:

- valid canonical registration succeeds once and repeated identical
  registration is a no-op;
- forged capability, run identity, assignment replacement, and activity
  replacement are rejected;
- malformed scheduler capacity and system reservation input is rejected;
- forged reconciliation assignments are rejected without changing the snapshot;
- shared execution instances have disjoint execution, activity, assignment,
  session, cycle, onboarding, event, artifact, publication, recovery, command,
  and correlation identity domains;
- an unknown scheduler denies guards and throws only at the explicit internal
  lookup seam, without creating authority;
- existing shared scheduling, fairness, lease, retry, publication, recovery,
  onboarding, and UI behavior remains green.

## Ownership / Authority Remediation

Scheduler registration and capacity mutation have one canonical productive
authority. The scheduler-scoped capability is held in a `WeakMap`, so a caller
cannot forge it by reproducing its public shape. The exported mutation seams
require that capability. Projections and guards only read the registry; they do
not create missing scheduler authority.

## Cross-Spec and Legacy / Contradictory Path Remediation

No cross-spec ownership boundary, migration path, or legacy productive writer
was changed. The correction removes the contradictory read-to-create fallback
and the caller-controlled lease-materialization path while preserving existing
historical and compatibility data shapes.

## Concurrency / Idempotency / Recovery

Canonical registration is idempotent only for an identical existing record;
identity-changing writes require the explicit update/retry path. Revision
increments accompany real registration/lifecycle mutations. Reconciliation
does not replace existing leases or manufacture assignments. Recovery evidence,
publication evidence, event IDs, command IDs, and command correlation IDs are
execution-scoped when executions share a scheduler.

## Regression Remediation

- Original failure: public registration could overwrite canonical mappings and
  reconciliation could manufacture a lease for an arbitrary assignment.
  Regression: `registro do scheduler preserva autoridade e identidade após a criação`
  and `reconciliação só preserva leases canônicos e rejeita assignment inventado`.
- Original failure: shared execution identity inventory contained collisions.
  Regression: `execuções compartilhadas isolam todo identificador persistente aplicável`.
- Original failure: missing scheduler reads created scheduler authority.
  Regression: `scheduler ausente nega guardas sem criar autoridade durante leitura`.

## Tests and Executable Evidence

| Check | Result |
|---|---|
| `npm test` | PASS — 78 tests, 78 passed, 0 failed, 0 skipped |
| `npm run lint` | PASS — `tsc --noEmit` |
| `npm run build` | PASS — TypeScript build and Vite production bundle |
| Local UI smoke check | PASS — `http://127.0.0.1:4173/` returned HTTP 200, HTML content type, and `id="root"` |
| Interactive browser connector | Not available in this session |
| Static integration scan | PASS — no read-side scheduler creation fallback; one canonical registration writer plus explicit retry replacement; no lease-set replacement writer |

## Ticket Local Validation Impact

This prototype remediation has no implementation-ticket artifacts in scope.
Ticket-local revalidation required: `0`.

## Remaining Findings

No remaining `CRITICAL`, `MAJOR`, or blocking `MINOR` findings from the named
final rerun baseline.

## Upstream Gaps

None identified. Final independent conformance re-audit remains required before
any final conformance certification.

## Remediation Gate

`PROTOTYPE_REMEDIATION_COMPLETE`

Next required governance action: run the independent final prototype conformance
re-audit against this working-tree state.
