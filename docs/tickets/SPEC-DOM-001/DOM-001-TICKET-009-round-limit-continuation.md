# DOM-001-TICKET-009 — Round limit and continuation authorization

## 1. Status

`STATUS: BLOCKED`  
`ISSUE_DECOMPOSITION_READINESS: ISSUE_READY`  
`INITIAL_DAG_STATE: BLOCKED`  
`BLOCKED_BY: DOM-001-TICKET-008`  
`DEPENDS_ON: DOM-001-TICKET-008`  
`UNBLOCKS: DOM-001-TICKET-012`

## 2. Source Traceability

- Accepted ADR authority: `ADR-0009` revision 3, SHA-256 `4AB502AEA4F09AFE2C5FA33BFB6C5EE0D11E2D8F9AF65F244209CE1FAC935761` — configurable round limit, affected-unit pause, and explicit continuation.
- Portfolio: `docs/specs/SPEC-PORTFOLIO-001-organization.md` — O-051.
- Component SPEC: `docs/specs/SPEC-DOM-001-workflow-authority-and-governance.md` — DOM-AUDIT-003.
- Gap Matrix: `docs/specs/gap-matrices/SPEC-DOM-001-implementation-gap-matrix.md` — GAP-019.
- Gap Matrix Audit: `docs/specs/gap-matrices/audits/SPEC-DOM-001-implementation-gap-matrix-audit.md`.
- Implementation Plan: `docs/specs/implementation-plans/SPEC-DOM-001-implementation-plan.md` — DOM-IMP-09.
- Plan Audit: `docs/specs/implementation-plans/audits/SPEC-DOM-001-implementation-plan-audit.md`.

## 3. Authority / Scope

Approved owner: DOM `CANONICAL_OWNER`. Primary owning specification/domain: `SPEC-DOM-001`. Local ownership covers configurable round limit, affected-unit pause, and explicit continuation authorization. Foreign capabilities consumed: execution, scheduling, assignment, and transport contracts, non-blocking.

## 4. Portfolio Obligation Coverage

`O-051` configurable ten-round limit, local pause, and explicit continuation authorization.

## 5. Gap / Requirement / Acceptance Coverage

Gap: `GAP-019`. Requirement: `DOM-AUDIT-003`. Local acceptance: `AC-DOM-051`. Integrated contribution: `AC-DOM-052`; final owner TICKET-012.

## 6. Implementation Unit

`DOM-IMP-09 — Round limit and continuation authorization`. Formation reason: `SHARED_INVARIANT`. No split or merge.

## 7. Goal

Enforce the configurable ten-round limit, affected-unit pause, and explicit authorization for the next round.

## 8. Validated Implementation Delta

`OBSERVED`: mock round 10 and authorization command.  
`REQUIRED`: productive configurable limit, local pause, and one explicit continuation record.  
`DELTA`: no productive round policy.

## 9. Required Behavior

Pause only the affected unit at the limit and reject the next round until explicit authorization. Provide a deterministic gate to execution/scheduling.

## 10. Does Not Implement

Scheduler capacity, assignment/session creation, audit execution, or transport.

## 11. Repository Evidence

No productive round symbols; prototype round scenarios are non-authoritative references. Add the local round policy and continuation command.

## 12. Expected Repository Impact

Production code: audit-cycle policy and command boundary.  
Persistence/schema: authorization record seam only.  
Integration: deterministic execution/scheduling gate.  
Tests: tenth-round, isolation, duplicate authorization, recovery/restart, concurrency, and regression tests.  
Legacy/cutover: new canonical path preserving round history.  
Generated contracts: continuation authorization record.

## 13. Dependencies

Internal: `DOM-001-TICKET-008`. Cross-SPEC scheduler/execution contracts are non-blocking.

## 14. Blocking Conditions

Blocked until TICKET-008 provides explicit cycle/verdict identity. No external blocker exists.

## 14a. Authority Consumption Proof

| Field | Proof |
|---|---|
| Proof ID / authority existence | `ACP-DOM-09`; `YES` — `ADR-0009` revision 3, SHA-256 `4AB502AEA4F09AFE2C5FA33BFB6C5EE0D11E2D8F9AF65F244209CE1FAC935761`. |
| Scoped decision / truth owner | `ADR0009-D003`; DOM owns the configurable limit, affected-unit pause, and explicit continuation authorization. |
| Semantic source | `DOM-AUDIT-003`; `GAP-019`. |
| Consumed interface / returned data | Round record/continuation command port; returns affected-unit pause or exact authorized next-round identity. |
| Revision/version transport | Cycle, unit, round number, and continuation authorization revision are correlated and single-use. |
| Failure / not-found / stale semantics | Wrong cycle/unit, implicit continuation, duplicate authorization, stale authorization, or unrelated-unit pause rejects. |
| Productive availability / evidence | `YES` for local round policy and deterministic scheduler consumer fixture; EXEC scheduling is foreign and non-blocking. Evidence: `T9-AC1`–`T9-AC2`. |
| Result | `AUTHORITY_CONSUMABLE`. |

## 14b. Producer / Consumer Contract Proof

| Field | Proof |
|---|---|
| Contract / producer / consumer | `PCP-EXEC-05`; DOM produces pause/continuation decision; EXEC-002 consumes it for scheduling and cannot create round authority. |
| Interface / input / returned data | Scheduling handoff interface; input is canonical unit/cycle/round decision; output is acknowledgment or execution outcome, never a new authorization. |
| Revision/version transport | Round and authorization IDs are preserved through the scheduling handoff. |
| Failure / not-found / stale | Missing, duplicate, stale, wrong-unit, or wrong-cycle authorization is rejected and cannot start another round. |
| Availability / local proof boundary | Local policy and deterministic scheduler fixture are available; live scheduler is not a prerequisite for local closure. |
| Evidence / result | `T9-AC1`–`T9-AC2` tenth-round, isolation, recovery, and concurrency witnesses; PRODUCER_CONSUMER_CONTRACT: PROVEN_LOCAL_FIXTURE, RESULT: CONTRACT_DEFINED_LOCAL_WITNESS_ONLY. |

### Capability Availability Reconciliation

APPLICABLE_SHARED_CAPABILITY_RECORDS: NONE.
RECONCILIATION_SOURCE: README section 11.1 and current Plan section 12.1.
AUTHORITY_STATUS = DEFINED; CONTRACT_STATUS = DEFINED; LOCAL_TESTABILITY = NO;
PRODUCTIVE_AVAILABILITY = NO; DEPENDENCY_CLASS = REQUIRED_FOR_INTEGRATED_PROOF.
BLOCKING_EFFECT: no local execution or local-closure block; integrated proof
only. Local fixture evidence is contract-level only. Complete owner, producer,
consumer, contract, failure semantics, version transport, and availability
evidence are preserved in README section 11.1. For NONE, no shared capability
record is required by the current Plan for this ticket's local closure.
NO_DOWNSTREAM_CAPABILITY_PROMOTION_WITHOUT_NEW_EVIDENCE = TRUE.

## 14c. ACCEPTANCE_WITNESS_MATRIX
`PRODUCER_CONSUMER_CONTRACT_PROOF_FIELDS`: `PRODUCER = SPEC-EXEC-002`;
`PRODUCED_CONTRACT = scheduling acknowledgment and execution outcome`;
`AUTHORITY_OWNER = SPEC-DOM-001`; `CONSUMER = TICKET-009`;
`CONSUMED_CAPABILITY = pause/continuation scheduling handoff`;
`AVAILABILITY_CONDITION = local policy and deterministic scheduler fixture
available; live scheduler is foreign`; `DEPENDENCY_EDGE = TICKET-009 pause/
continuation decision → EXEC-002 scheduler`; `PROOF_EVIDENCE =
docs/tickets/SPEC-DOM-001/evidence/TICKET-009/AC-DOM-051-rounds.md`.

## 14c. ACCEPTANCE_WITNESS_MATRIX

| AC | Normative behavior / verb | Concrete operation | State/transition | Direct positive test | Direct negative/isolation test | Expected evidence | Acceptance owner |
|---|---|---|---|---|---|---|---|
| AC-DOM-051 | Count and pause at the tenth round | record round command | affected-unit pause | `T9-AC1-P` tenth-round pause test | `T9-AC1-N` ninth/elevated round or cross-unit pause rejects; unrelated unit continues | `docs/tickets/SPEC-DOM-001/evidence/TICKET-009/AC-DOM-051-pause.md` | TICKET-009 |
| AC-DOM-051 | Authorize continuation explicitly | continuation command | next-round authorization | `T9-AC2-P` explicit authorized continuation after recovery | `T9-AC2-N` implicit, duplicate, wrong-cycle, or stale authorization rejects; concurrent retry is idempotent | `docs/tickets/SPEC-DOM-001/evidence/TICKET-009/AC-DOM-051-continuation.md` | TICKET-009 |

### Temporal Authority Proof

`TEMPORAL_AUTHORITY_PROOF: PRESERVED_FROM_PLAN`; source: Plan `DOM-IMP-09`
Temporal Authority Preconditions. Initial observation is exact
cycle/revision, round count, and continuation authorization; the mutation window
ends at resume; revalidation at resume detects mismatch and fails closed. DOM
owns the continuation decision and EXEC consumes it without creating authority.
Evidence: `docs/tickets/SPEC-DOM-001/evidence/TICKET-009/temporal-authority.md`.

## 15. Implementation Constraints

Ten is the configurable initial limit; pause is unit-local; continuation is explicit, singular, and auditable.

## 16. Acceptance Criteria

1. The tenth round pauses only its affected unit.
2. A following round requires explicit continuation authorization and cannot
   be inferred from process termination or an unrelated unit. `LOCAL_PROVABILITY = YES`.

All criteria are `TESTABLE: YES` and `LOCALLY_PROVABLE: YES` after prerequisite.

## 17. Acceptance / Proof Role

`CONTRIBUTOR: YES` to AC-DOM-052. `LOCAL_ACCEPTANCE_OWNER: YES` and `FINAL_PROOF_OWNER: YES` for AC-DOM-051. Not final owner of AC-DOM-052.

## 18. Required Tests

`LOCAL_TEST_EVIDENCE`: unit/command tests for configurable tenth-round pause and explicit continuation. `CONCURRENCY_EVIDENCE`: affected-unit pause does not pause unrelated units; duplicate authorization is idempotent. `RECOVERY_EVIDENCE`: authorized round restart preserves cycle/unit/round identity and rejects stale authorization.

## 19. Completion Evidence

Configurable policy; pause/authorization record; and isolation/duplicate tests. `EXPECTED_EVIDENCE_FILES`: `docs/tickets/SPEC-DOM-001/evidence/TICKET-009/AC-DOM-051-pause.md`, `AC-DOM-051-continuation.md`, `temporal-authority.md`.

## 20. Completion Gate

```text
COMPLETION_GATE:
  production_code: REQUIRED
  automated_tests: REQUIRED
  integration_evidence: REQUIRED
  legacy_transition_evidence: REQUIRED
  conformance_evidence: REQUIRED
```

## 21. Legacy / Cutover Impact

`NEW_CANONICAL_PATH`; preserve prior cycle/round history.

## 22. Risks

Global pause or implicit continuation. Mitigation: unit-isolation and explicit authorization assertions.

## 23. Implementation Wave

`WAVE: 5`.

## 24. Parallelization

`SAFE_WITH_COORDINATION`; blocked by TICKET-008 and unblocks TICKET-012.

## 25. Handoff After Completion

Independent ticket audit may validate this ticket; its round policy evidence is consumed by final conformance.

## 26. Ticket Local Closure

`TICKET_LOCAL_CLOSURE = YES`.
