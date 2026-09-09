# DOM-001-TICKET-006 — Ticket aggregate and functional transitions

## 1. Status

`STATUS: BLOCKED`  
`ISSUE_DECOMPOSITION_READINESS: ISSUE_READY`  
`INITIAL_DAG_STATE: BLOCKED`  
`BLOCKED_BY: DOM-001-TICKET-004, DOM-001-TICKET-005`  
`DEPENDS_ON: DOM-001-TICKET-004, DOM-001-TICKET-005`  
`UNBLOCKS: DOM-001-TICKET-010, DOM-001-TICKET-012`

## 2. Source Traceability

- Portfolio: `docs/specs/SPEC-PORTFOLIO-001-organization.md` — O-012, O-013.
- Component SPEC: `docs/specs/SPEC-DOM-001-workflow-authority-and-governance.md` — DOM-TICKET-001, DOM-TICKET-002.
- Gap Matrix: `docs/specs/gap-matrices/SPEC-DOM-001-implementation-gap-matrix.md` — GAP-012, GAP-013.
- Gap Matrix Audit: `docs/specs/gap-matrices/audits/SPEC-DOM-001-implementation-gap-matrix-audit.md`.
- Implementation Plan: `docs/specs/implementation-plans/SPEC-DOM-001-implementation-plan.md` — DOM-IMP-06.
- Plan Audit: `docs/specs/implementation-plans/audits/SPEC-DOM-001-implementation-plan-audit.md`.

## 3. Authority / Scope

Approved owner: DOM `CANONICAL_OWNER`. Primary owning specification/domain: `SPEC-DOM-001`. Local ownership covers functional ticket state, terminality, linked continuation, exact transition meaning, and rejection. Foreign capabilities consumed: execution, operational, Git, transport, and UI mappings; none are implemented here.

## 4. Portfolio Obligation Coverage

`O-012` functional ticket states and terminality; `O-013` complete functional transition table.

## 5. Gap / Requirement / Acceptance Coverage

Gaps: `GAP-012`, `GAP-013`. Requirements: `DOM-TICKET-001`, `DOM-TICKET-002`. Local acceptance: `AC-DOM-012`, `AC-DOM-013`. Integrated contribution: `AC-DOM-052`; final owner TICKET-012.

## 6. Implementation Unit

`DOM-IMP-06 — Ticket aggregate and functional transitions`. Formation reason: `SHARED_INVARIANT`. No split or merge.

## 7. Goal

Enforce the six canonical ticket functional states, terminality, linked-ticket continuation, and exactly the eight valid functional transitions.

## 8. Validated Implementation Delta

`OBSERVED`: mock labels and scenario-specific guards.  
`REQUIRED`: productive ticket aggregate, terminality, linked continuation, exact transition table, and recorded rejection.  
`DELTA`: no productive ticket authority exists.

## 9. Required Behavior

Accept only `DRAFT`, `READY`, `IMPLEMENTED`, `COMPLETED`, `BLOCKED`, and `CANCELLED`; accept exactly the eight specified transitions; reject all others; keep completed/cancelled terminal; require a new linked ticket for continuation.

## 10. Does Not Implement

Ticket branches/worktrees, scheduler operational state, Git integration, transport/UI, or final conformance.

## 11. Repository Evidence

`prototype/src/mockDomain.ts:17-18, :826-845, :886-928`; ticket/DAG tests. Replace scenario guards; extend the complete valid/invalid transition matrix.

## 12. Expected Repository Impact

Production code: ticket aggregate and transition boundary.  
Persistence/schema: semantic transition history seam only.  
Integration: execution and operational mappings.  
Tests: full eight-transition matrix, terminality, continuation, rejection, stale, and idempotency tests.  
Legacy/cutover: new canonical path preserving terminal history.  
Generated contracts: functional state/transition vocabulary.

## 13. Dependencies

Internal: `DOM-001-TICKET-004`, `DOM-001-TICKET-005`. Cross-SPEC execution and operational states remain separate, non-blocking consumers.

## 14. Blocking Conditions

Blocked until state-machine and command-validation tickets complete. No external blocker exists.

## 15. Implementation Constraints

Preserve six-state vocabulary, terminality, exact eight transitions, rejection recording, and linked-ticket history. Never reopen completed tickets.

## 16. Acceptance Criteria

- [ ] Only the six functional states are accepted and terminals cannot reopen.
- [ ] All eight valid transitions pass and every other transition is rejected.
- [ ] `LOCAL_PROVABILITY = YES` after TICKET-004/005.

All criteria are `TESTABLE: YES` and `LOCALLY_PROVABLE: YES` after prerequisites.

## 17. Acceptance / Proof Role

`CONTRIBUTOR: YES` to AC-DOM-052. `LOCAL_ACCEPTANCE_OWNER: YES` and `FINAL_PROOF_OWNER: YES` for AC-DOM-012 and AC-DOM-013. Not final owner of AC-DOM-052.

## 18. Required Tests

Unit, state-machine, command, regression, stale, and idempotency tests covering the full transition matrix, terminality, continuation links, and rejection.

## 19. Completion Evidence

Executable ticket aggregate and complete transition test matrix with terminal and linked-continuation evidence.

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

`NEW_CANONICAL_PATH`; preserve terminal history and do not reopen completed tickets.

## 22. Risks

Operational state leaking into functional state. Mitigation: separate-state tests and transition-table proof.

## 23. Implementation Wave

`WAVE: 4`.

## 24. Parallelization

`SAFE_WITH_COORDINATION`; blocked by TICKET-004/005 and unblocks TICKET-010/012.

## 25. Handoff After Completion

Independent ticket audit may validate this ticket; invalidation and final conformance consume the terminality and transition evidence.

## 26. Ticket Local Closure

`TICKET_LOCAL_CLOSURE = YES`.
