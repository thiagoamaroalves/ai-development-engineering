# DOM-001-TICKET-009 — Round limit and continuation authorization

## 1. Status

`STATUS: BLOCKED`  
`ISSUE_DECOMPOSITION_READINESS: ISSUE_READY`  
`INITIAL_DAG_STATE: BLOCKED`  
`BLOCKED_BY: DOM-001-TICKET-008`  
`DEPENDS_ON: DOM-001-TICKET-008`  
`UNBLOCKS: DOM-001-TICKET-012`

## 2. Source Traceability

- Portfolio: `docs/specs/SPEC-PORTFOLIO-001-organization.md` — O-051.
- Component SPEC: `docs/specs/SPEC-DOM-001-workflow-authority-and-governance.md` — DOM-AUDIT-003.
- Gap Matrix: `docs/specs/gap-matrices/SPEC-DOM-001-implementation-gap-matrix.md` — GAP-018.
- Gap Matrix Audit: `docs/specs/gap-matrices/audits/SPEC-DOM-001-implementation-gap-matrix-audit.md`.
- Implementation Plan: `docs/specs/implementation-plans/SPEC-DOM-001-implementation-plan.md` — DOM-IMP-09.
- Plan Audit: `docs/specs/implementation-plans/audits/SPEC-DOM-001-implementation-plan-audit.md`.

## 3. Authority / Scope

Approved owner: DOM `CANONICAL_OWNER`. Primary owning specification/domain: `SPEC-DOM-001`. Local ownership covers configurable round limit, affected-unit pause, and explicit continuation authorization. Foreign capabilities consumed: execution, scheduling, assignment, and transport contracts, non-blocking.

## 4. Portfolio Obligation Coverage

`O-051` configurable ten-round limit, local pause, and explicit continuation authorization.

## 5. Gap / Requirement / Acceptance Coverage

Gap: `GAP-018`. Requirement: `DOM-AUDIT-003`. Local acceptance: `AC-DOM-051`. Integrated contribution: `AC-DOM-052`; final owner TICKET-012.

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

`prototype/src/mockDomain.ts:730, :837, :901`; round-limit tests. Replace simulated policy; extend authorization and isolation tests.

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

## 15. Implementation Constraints

Ten is the configurable initial limit; pause is unit-local; continuation is explicit, singular, and auditable.

## 16. Acceptance Criteria

- [ ] The tenth round pauses only the affected unit.
- [ ] The following round requires one explicit authorization and cannot be inferred from process state.
- [ ] `LOCAL_PROVABILITY = YES` after TICKET-008.

All criteria are `TESTABLE: YES` and `LOCALLY_PROVABLE: YES` after prerequisite.

## 17. Acceptance / Proof Role

`CONTRIBUTOR: YES` to AC-DOM-052. `LOCAL_ACCEPTANCE_OWNER: YES` and `FINAL_PROOF_OWNER: YES` for AC-DOM-051. Not final owner of AC-DOM-052.

## 18. Required Tests

Unit, command, concurrency/isolation, recovery, and regression tests for tenth-round behavior, unrelated-unit progress, duplicate authorization, and restart of an authorized round.

## 19. Completion Evidence

Configurable policy; pause/authorization record; and isolation/duplicate tests.

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
