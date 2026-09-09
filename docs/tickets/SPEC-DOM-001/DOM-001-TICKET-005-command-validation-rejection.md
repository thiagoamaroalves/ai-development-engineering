# DOM-001-TICKET-005 — Canonical command validation and rejection

## 1. Status

`STATUS: BLOCKED`  
`ISSUE_DECOMPOSITION_READINESS: ISSUE_READY`  
`INITIAL_DAG_STATE: BLOCKED`  
`BLOCKED_BY: DOM-001-TICKET-004`  
`DEPENDS_ON: DOM-001-TICKET-001, DOM-001-TICKET-004`  
`UNBLOCKS: DOM-001-TICKET-006, DOM-001-TICKET-007, DOM-001-TICKET-008, DOM-001-TICKET-012`

## 2. Source Traceability

- Portfolio: `docs/specs/SPEC-PORTFOLIO-001-organization.md` — O-011.
- Component SPEC: `docs/specs/SPEC-DOM-001-workflow-authority-and-governance.md` — DOM-CMD-001.
- Gap Matrix: `docs/specs/gap-matrices/SPEC-DOM-001-implementation-gap-matrix.md` — GAP-011.
- Gap Matrix Audit: `docs/specs/gap-matrices/audits/SPEC-DOM-001-implementation-gap-matrix-audit.md`.
- Implementation Plan: `docs/specs/implementation-plans/SPEC-DOM-001-implementation-plan.md` — DOM-IMP-05.
- Plan Audit: `docs/specs/implementation-plans/audits/SPEC-DOM-001-implementation-plan-audit.md`.

## 3. Authority / Scope

Approved owner: DOM `CANONICAL_OWNER`. Primary owning specification/domain: `SPEC-DOM-001`. Local ownership covers identity, revision, state, dependency, verdict preconditions and canonical rejection semantics. Foreign capabilities consumed: PLAT evidence correlation and BACKEND/UI result mapping, non-blocking.

## 4. Portfolio Obligation Coverage

`O-011` precondition validation, rejection registration, and no-transition/no-effect semantics.

## 5. Gap / Requirement / Acceptance Coverage

Gap: `GAP-011`. Requirement: `DOM-CMD-001`. Local acceptance: `AC-DOM-011`. Integrated contribution: `AC-DOM-052`; final owner TICKET-012.

## 6. Implementation Unit

`DOM-IMP-05 — Canonical command validation and rejection`. Formation reason: `SHARED_COMMAND_BOUNDARY`. No split or merge.

## 7. Goal

Provide canonical command precondition validation, recorded rejection, stale revision handling, and no-state/no-effect semantics.

## 8. Validated Implementation Delta

`OBSERVED`: mock request/advance loop only.  
`REQUIRED`: productive validation, recorded rejection, and no transition/effect on rejection.  
`DELTA`: no canonical command boundary exists.

## 9. Required Behavior

Validate all DOM preconditions, return exact canonical rejection reasons (`UNKNOWN_SPEC`, `INELIGIBLE_REVISION`, `INVALID_DEPENDENCY_CLOSURE`, `INVALID_COMMAND_BASIS`, `STALE_REVISION`), and leave canonical state/effect unchanged when invalid.

## 10. Does Not Implement

PLAT journal/effect persistence, BACKEND/UI envelopes, adapter retries, or foreign failure families.

## 11. Repository Evidence

`prototype/src/mockDomain.ts:938-940`; invalid, stale, and no-effect tests. Replace mock command mutation; extend positive/negative command tests.

## 12. Expected Repository Impact

Production code: command handlers and rejection boundary.  
Persistence/schema: rejection/effect correlation seam only.  
Integration: BACKEND/UI mapping contract and PLAT correlation.  
Tests: precondition, stale, idempotency, atomic no-effect, and regression tests.  
Legacy/cutover: new canonical path.  
Generated contracts: canonical reason/result contract.

## 13. Dependencies

Internal: `DOM-001-TICKET-001`, `DOM-001-TICKET-004`. Cross-SPEC: PLAT-001 and BACKEND-001/UI-001 mappings, all non-blocking locally.

## 14. Blocking Conditions

Blocked until identity and state-machine tickets complete. No foreign blocker exists.

## 15. Implementation Constraints

Fail closed; reject stale or invalid basis atomically; never rename DOM failure families or produce partial state/effect.

## 16. Acceptance Criteria

- [ ] Invalid identity, revision, state, dependency, and verdict commands are rejected with canonical reason.
- [ ] Rejected command leaves state and effect unchanged.
- [ ] `LOCAL_PROVABILITY = YES`; no physical journal proof is placed in local AC.

All criteria are `TESTABLE: YES` and `LOCALLY_PROVABLE: YES` after prerequisites.

## 17. Acceptance / Proof Role

`CONTRIBUTOR: YES` to AC-DOM-052. `LOCAL_ACCEPTANCE_OWNER: YES` and `FINAL_PROOF_OWNER: YES` for AC-DOM-011. Not final owner of AC-DOM-052.

## 18. Required Tests

Unit, stale-protection, idempotency/no-duplicate-transition, application, and regression tests for every precondition and atomic no-effect rejection.

## 19. Completion Evidence

Command boundary; canonical reason records; unchanged-state assertions; and correlated result contract.

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

`NEW_CANONICAL_PATH`; no legacy writer retirement.

## 22. Risks

Partial mutation before validation or transport-level semantic renaming. Mitigation: atomic negative tests and mapping contract tests.

## 23. Implementation Wave

`WAVE: 3`.

## 24. Parallelization

`SAFE_WITH_COORDINATION`; blocked by TICKET-001/004 and unblocks TICKET-006/007/008/012.

## 25. Handoff After Completion

Independent ticket audit may validate this ticket; ticket, publication, and audit-cycle tickets consume its canonical rejection contract.

## 26. Ticket Local Closure

`TICKET_LOCAL_CLOSURE = YES`.
