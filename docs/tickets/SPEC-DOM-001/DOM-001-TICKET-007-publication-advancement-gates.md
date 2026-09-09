# DOM-001-TICKET-007 — Publication vocabulary and advancement gates

## 1. Status

`STATUS: BLOCKED`  
`ISSUE_DECOMPOSITION_READINESS: ISSUE_READY`  
`INITIAL_DAG_STATE: BLOCKED`  
`BLOCKED_BY: DOM-001-TICKET-004, DOM-001-TICKET-005`  
`DEPENDS_ON: DOM-001-TICKET-004, DOM-001-TICKET-005`  
`UNBLOCKS: DOM-001-TICKET-011, DOM-001-TICKET-012`

## 2. Source Traceability

- Portfolio: `docs/specs/SPEC-PORTFOLIO-001-organization.md` — O-014, O-015.
- Component SPEC: `docs/specs/SPEC-DOM-001-workflow-authority-and-governance.md` — DOM-PUB-001, DOM-ADV-001.
- Gap Matrix: `docs/specs/gap-matrices/SPEC-DOM-001-implementation-gap-matrix.md` — GAP-014, GAP-015.
- Gap Matrix Audit: `docs/specs/gap-matrices/audits/SPEC-DOM-001-implementation-gap-matrix-audit.md`.
- Implementation Plan: `docs/specs/implementation-plans/SPEC-DOM-001-implementation-plan.md` — DOM-IMP-07.
- Plan Audit: `docs/specs/implementation-plans/audits/SPEC-DOM-001-implementation-plan-audit.md`.

## 3. Authority / Scope

Approved owner: DOM `CANONICAL_OWNER`. Primary owning specification/domain: `SPEC-DOM-001`. Local ownership covers publication vocabulary, formal verdict gates, pause/cancel semantics, independent progress, and remote-effect distinction. Foreign capability consumed: GIT publication execution/evidence/confirmation, non-blocking.

## 4. Portfolio Obligation Coverage

`O-014` distinct publication vocabulary; `O-015` verdict-gated independent advancement and cooperative cancellation.

## 5. Gap / Requirement / Acceptance Coverage

Gaps: `GAP-014`, `GAP-015`. Requirements: `DOM-PUB-001`, `DOM-ADV-001`. Local acceptance: `AC-DOM-014`, `AC-DOM-015`. Integrated contribution: `AC-DOM-052`; final owner TICKET-012.

## 6. Implementation Unit

`DOM-IMP-07 — Publication vocabulary and advancement gates`. Formation reason: `SHARED_COMMAND_BOUNDARY`. No split or merge.

## 7. Goal

Implement canonical publication vocabulary and formal-verdict-gated, independent, cooperative advancement semantics.

## 8. Validated Implementation Delta

`OBSERVED`: mock publication states and advancement guards.  
`REQUIRED`: productive candidate/approval/integration/PR/merge/remote-confirmation distinction and verdict-gated advancement.  
`DELTA`: no productive boundary exists.

## 9. Required Behavior

Keep `PR_MERGED` distinct from `REMOTE_PUBLICATION_CONFIRMED`; reject advancement without verdict or closed dependency; model independent progress and cooperative pause/cancel without reverting remote effects; accept foreign publication evidence without executing Git.

## 10. Does Not Implement

Git/GitHub execution, push/PR/merge, remote confirmation evidence, scheduler capacity, or UI/OPS presentation.

## 11. Repository Evidence

`prototype/src/mockDomain.ts:22, :720, :910-917`; publication, drift, and PR tests. Replace mock effects; extend vocabulary and gate tests.

## 12. Expected Repository Impact

Production code: publication/advancement state and command/event boundary.  
Persistence/schema: semantic evidence mapping only.  
Integration: GIT evidence consumption.  
Tests: vocabulary, verdict gates, independent progress, pause/cancel, remote-effect preservation, idempotency, and regression tests.  
Legacy/cutover: new canonical path.  
Generated contracts: publication vocabulary and gate result contract.

## 13. Dependencies

Internal: `DOM-001-TICKET-004`, `DOM-001-TICKET-005`. Cross-SPEC: `SPEC-GIT-001` executes publication and supplies evidence; non-blocking locally.

## 14. Blocking Conditions

Blocked until state and command boundaries complete. No foreign blocker exists.

## 15. Implementation Constraints

Preserve requested/accepted/rejected/confirmed distinction, formal verdict gating, independent progress, cooperative cancellation, and foreign execution ownership.

## 16. Acceptance Criteria

- [ ] Publication states distinguish PR merge from remote confirmation.
- [ ] No-verdict, closed-dependency, and non-cooperative cancellation paths are rejected; remote effects are not reverted.
- [ ] `LOCAL_PROVABILITY = YES` after TICKET-004/005.

All criteria are `TESTABLE: YES` and `LOCALLY_PROVABLE: YES` after prerequisites.

## 17. Acceptance / Proof Role

`CONTRIBUTOR: YES` to AC-DOM-052. `LOCAL_ACCEPTANCE_OWNER: YES` and `FINAL_PROOF_OWNER: YES` for AC-DOM-014 and AC-DOM-015. Not final owner of AC-DOM-052.

## 18. Required Tests

Unit, state-machine, application, compatibility, idempotency, and regression tests for publication vocabulary, verdict gates, independent progress, pause/cancel requests, and remote-effect preservation.

## 19. Completion Evidence

Canonical publication state model; gate/rejection evidence; and mapping tests proving no Git execution or confirmation is locally claimed.

## 20. Completion Gate

```text
COMPLETION_GATE:
  production_code: REQUIRED
  automated_tests: REQUIRED
  integration_evidence: REQUIRED
  legacy_transition_evidence: NOT_APPLICABLE
  conformance_evidence: REQUIRED
```

## 21. Legacy / Cutover Impact

`NEW_CANONICAL_PATH`; legacy publication adapters remain foreign-owned.

## 22. Risks

Equating merge with confirmation or cancellation with rollback. Mitigation: explicit state and negative-path tests.

## 23. Implementation Wave

`WAVE: 4`.

## 24. Parallelization

`SAFE_WITH_COORDINATION`; blocked by TICKET-004/005 and unblocks TICKET-011/012.

## 25. Handoff After Completion

Independent ticket audit may validate this ticket; exact publication evidence is consumed by TICKET-011 and the final evaluator.

## 26. Ticket Local Closure

`TICKET_LOCAL_CLOSURE = YES`; GIT execution and confirmation remain foreign.
