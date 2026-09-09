# DOM-001-TICKET-010 — Normative-change invalidation and adjustment lineage

## 1. Status

`STATUS: BLOCKED`  
`ISSUE_DECOMPOSITION_READINESS: ISSUE_READY`  
`INITIAL_DAG_STATE: BLOCKED`  
`BLOCKED_BY: DOM-001-TICKET-003, DOM-001-TICKET-006`  
`DEPENDS_ON: DOM-001-TICKET-003, DOM-001-TICKET-006`  
`UNBLOCKS: DOM-001-TICKET-012`

## 2. Source Traceability

- Portfolio: `docs/specs/SPEC-PORTFOLIO-001-organization.md` — O-053.
- Component SPEC: `docs/specs/SPEC-DOM-001-workflow-authority-and-governance.md` — DOM-AUDIT-005.
- Gap Matrix: `docs/specs/gap-matrices/SPEC-DOM-001-implementation-gap-matrix.md` — GAP-020.
- Gap Matrix Audit: `docs/specs/gap-matrices/audits/SPEC-DOM-001-implementation-gap-matrix-audit.md`.
- Implementation Plan: `docs/specs/implementation-plans/SPEC-DOM-001-implementation-plan.md` — DOM-IMP-10.
- Plan Audit: `docs/specs/implementation-plans/audits/SPEC-DOM-001-implementation-plan-audit.md`.

## 3. Authority / Scope

Approved owner: DOM `CANONICAL_OWNER`. Primary owning specification/domain: `SPEC-DOM-001`. Local ownership covers normative-change detection, selective invalidation, stage return, adjustment/substitution lineage, and preservation of terminal history. Foreign capabilities consumed: downstream projections only; no foreign lifecycle is implemented.

## 4. Portfolio Obligation Coverage

`O-053` selective downstream invalidation after normative change without reopening completed tickets.

## 5. Gap / Requirement / Acceptance Coverage

Gap: `GAP-020`. Requirement: `DOM-AUDIT-005`. Local acceptance: `AC-DOM-053`. Integrated contribution: `AC-DOM-052`; final owner TICKET-012.

## 6. Implementation Unit

`DOM-IMP-10 — Normative-change invalidation and adjustment lineage`. Formation reason: `SHARED_CUTOVER`. No split or merge.

## 7. Goal

Invalidate only affected downstream approvals after normative change, preserve history, return to the appropriate documentation stage, and create linked adjustment/substitution work without reopening completed tickets.

## 8. Validated Implementation Delta

`OBSERVED`: mock drift/mutation changes in-memory state.  
`REQUIRED`: productive approval registry, selective invalidation, preserved terminal ticket history, and linked adjustment/substitution history.  
`DELTA`: no productive cutover path.

## 9. Required Behavior

Detect normative change; invalidate affected approvals; preserve unaffected and completed history; return the affected unit to the proper documentation stage; link new adjustment/substitution records; make stale approvals unavailable to later advancement.

## 10. Does Not Implement

Rewriting ADR documents, physical evidence migration, downstream execution, legacy adapter retirement, or reopening completed tickets.

## 11. Repository Evidence

`prototype/src/mockDomain.ts:737, :910-912, :927`; drift/invalidation tests. Replace mock cutover; extend selective invalidation and history tests.

## 12. Expected Repository Impact

Production code: approval/invalidation registry, adjustment lineage, and stage commands.  
Persistence/schema: semantic history reference seam.  
Integration: downstream invalidation result mapping.  
Tests: selective invalidation, terminality, stage return, lineage, stale, compatibility, migration-history, and regression tests.  
Legacy/cutover: cutover with preserved reads.  
Generated contracts: invalidation/adjustment result contract.

## 13. Dependencies

Internal: `DOM-001-TICKET-003`, `DOM-001-TICKET-006`. Cross-SPEC downstream projections consume the result and are non-blocking.

## 14. Blocking Conditions

Blocked until lifecycle/succession and ticket aggregate contracts complete. No external blocker exists.

## 15. Implementation Constraints

Preserve completed ticket terminality, selective invalidation, historical lineage, and approved cutover ownership.

## 16. Acceptance Criteria

- [ ] Normative change makes only affected downstream approvals obsolete.
- [ ] Completed tickets remain historical and closed; a linked adjustment or substitution record is created.
- [ ] `LOCAL_PROVABILITY = YES` after TICKET-003/006.

All criteria are `TESTABLE: YES` and `LOCALLY_PROVABLE: YES` after prerequisites.

## 17. Acceptance / Proof Role

`CONTRIBUTOR: YES` to AC-DOM-052. `LOCAL_ACCEPTANCE_OWNER: YES` and `FINAL_PROOF_OWNER: YES` for AC-DOM-053. Not final owner of AC-DOM-052.

## 18. Required Tests

Unit, state-machine, stale-protection, compatibility, migration-history, and regression tests for selective invalidation, preserved terminal tickets, stage return, and linked adjustment lineage.

## 19. Completion Evidence

Approval registry; selective invalidation trace; unchanged completed-ticket records; and linked adjustment/substitution evidence.

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

`CUTOVER`; preserve historical reads and remove no foreign adapter authority.

## 22. Risks

Over-invalidation or reopening terminal work. Mitigation: selective fixtures and terminality assertions.

## 23. Implementation Wave

`WAVE: 5`.

## 24. Parallelization

`SAFE_WITH_COORDINATION`; blocked by TICKET-003/006 and unblocks TICKET-012.

## 25. Handoff After Completion

Independent ticket audit may validate this ticket; its invalidation evidence is consumed by final conformance and downstream projections.

## 26. Ticket Local Closure

`TICKET_LOCAL_CLOSURE = YES`.
