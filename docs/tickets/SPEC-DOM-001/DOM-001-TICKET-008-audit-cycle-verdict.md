# DOM-001-TICKET-008 — Audit-cycle identity and structured verdict closure

## 1. Status

`STATUS: BLOCKED`  
`ISSUE_DECOMPOSITION_READINESS: ISSUE_READY`  
`INITIAL_DAG_STATE: BLOCKED`  
`BLOCKED_BY: DOM-001-TICKET-001, DOM-001-TICKET-005`  
`DEPENDS_ON: DOM-001-TICKET-001, DOM-001-TICKET-005`  
`UNBLOCKS: DOM-001-TICKET-009, DOM-001-TICKET-012`

## 2. Source Traceability

- Portfolio: `docs/specs/SPEC-PORTFOLIO-001-organization.md` — O-049, O-050.
- Component SPEC: `docs/specs/SPEC-DOM-001-workflow-authority-and-governance.md` — DOM-AUDIT-001, DOM-AUDIT-002.
- Gap Matrix: `docs/specs/gap-matrices/SPEC-DOM-001-implementation-gap-matrix.md` — GAP-016, GAP-017.
- Gap Matrix Audit: `docs/specs/gap-matrices/audits/SPEC-DOM-001-implementation-gap-matrix-audit.md`.
- Implementation Plan: `docs/specs/implementation-plans/SPEC-DOM-001-implementation-plan.md` — DOM-IMP-08.
- Plan Audit: `docs/specs/implementation-plans/audits/SPEC-DOM-001-implementation-plan-audit.md`.

## 3. Authority / Scope

Approved owner: DOM `CANONICAL_OWNER`. Primary owning specification/domain: `SPEC-DOM-001`. Local ownership covers artifact/cycle/round identity, structured verdict semantics, and closure authority. Foreign capabilities consumed: assignment/session and physical persistence contracts, non-blocking.

## 4. Portfolio Obligation Coverage

`O-049` formal artifact audit cycles; `O-050` structured-verdict-only closure.

## 5. Gap / Requirement / Acceptance Coverage

Gaps: `GAP-016`, `GAP-017`. Requirements: `DOM-AUDIT-001`, `DOM-AUDIT-002`. Local acceptance: `AC-DOM-049`, `AC-DOM-050`. Integrated contribution: `AC-DOM-052`; final owner TICKET-012.

## 6. Implementation Unit

`DOM-IMP-08 — Audit-cycle identity and structured verdict closure`. Formation reason: `SHARED_AUTHORITY`. No split or merge.

## 7. Goal

Create explicit artifact/cycle/round identity and make only a structured verdict capable of closing an audit cycle.

## 8. Validated Implementation Delta

`OBSERVED`: mock cycle/round fields and finding commands.  
`REQUIRED`: unique cycle identity for every governed artifact and structured-verdict closure.  
`DELTA`: no productive audit-cycle authority.

## 9. Required Behavior

Identify artifact/cycle/round without implicit reuse; reject cycle closure from remediation, empty findings, or process termination; accept only a structured verdict; provide the audit basis for round policy, conformance, and invalidation.

## 10. Does Not Implement

Agent/session assignment, auditor/remediator execution, physical persistence, OPS projection, or final conformance evaluation.

## 11. Repository Evidence

`prototype/src/mockDomain.ts:32, :713-716, :886-928`; audit/remediation tests. Replace mock cycle state; extend cycle/verdict tests.

## 12. Expected Repository Impact

Production code: audit-cycle aggregate and verdict command/event boundary.  
Persistence/schema: identity/evidence persistence seam only.  
Integration: round and final-conformance consumers.  
Tests: cycle identity, verdict structure, prohibited reuse, remediation rejection, replay, and regression tests.  
Legacy/cutover: new canonical path preserving historical cycles.  
Generated contracts: structured verdict contract.

## 13. Dependencies

Internal: `DOM-001-TICKET-001`, `DOM-001-TICKET-005`. Cross-SPEC assignment/session remains foreign and non-blocking.

## 14. Blocking Conditions

Blocked until identity and command validation complete. No external blocker exists.

## 15. Implementation Constraints

Cycle identity is explicit and non-reusable; remediation never approves; structured verdict is the sole closure authority.

## 16. Acceptance Criteria

- [ ] Every governed artifact receives identifiable cycle/round records.
- [ ] Only structured verdict closes a cycle; remediation alone cannot approve.
- [ ] `LOCAL_PROVABILITY = YES` after TICKET-001/005.

All criteria are `TESTABLE: YES` and `LOCALLY_PROVABLE: YES` after prerequisites.

## 17. Acceptance / Proof Role

`CONTRIBUTOR: YES` to AC-DOM-052. `LOCAL_ACCEPTANCE_OWNER: YES` and `FINAL_PROOF_OWNER: YES` for AC-DOM-049 and AC-DOM-050. Not final owner of AC-DOM-052.

## 18. Required Tests

Unit, domain-invariant, command, historical-replay, and regression tests for cycle identity, prohibited reuse, verdict structure, and remediation rejection.

## 19. Completion Evidence

Cycle/verdict authority; structured closure evidence; and negative remediation tests.

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

`NEW_CANONICAL_PATH`; preserve historical cycles.

## 22. Risks

Implicit cycle reuse or process completion treated as approval. Mitigation: identity and closure-gate tests.

## 23. Implementation Wave

`WAVE: 4`.

## 24. Parallelization

`SAFE_WITH_COORDINATION`; blocked by TICKET-001/005 and unblocks TICKET-009/012.

## 25. Handoff After Completion

Independent ticket audit may validate this ticket; TICKET-009 consumes its cycle and round identity.

## 26. Ticket Local Closure

`TICKET_LOCAL_CLOSURE = YES`.
