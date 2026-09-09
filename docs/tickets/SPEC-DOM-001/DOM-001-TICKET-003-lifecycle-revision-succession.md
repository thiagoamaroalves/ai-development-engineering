# DOM-001-TICKET-003 — Lifecycle revision and ADR succession

## 1. Status

`STATUS: BLOCKED`  
`ISSUE_DECOMPOSITION_READINESS: ISSUE_READY`  
`INITIAL_DAG_STATE: BLOCKED`  
`BLOCKED_BY: DOM-001-TICKET-001, DOM-001-TICKET-002`  
`DEPENDS_ON: DOM-001-TICKET-001, DOM-001-TICKET-002`  
`UNBLOCKS: DOM-001-TICKET-010, DOM-001-TICKET-012`

## 2. Source Traceability

- Portfolio: `docs/specs/SPEC-PORTFOLIO-001-organization.md` — O-006, O-007, O-008.
- Component SPEC: `docs/specs/SPEC-DOM-001-workflow-authority-and-governance.md` — DOM-LIFE-001, DOM-REV-001, DOM-IMMUT-001.
- Gap Matrix: `docs/specs/gap-matrices/SPEC-DOM-001-implementation-gap-matrix.md` — GAP-006, GAP-007, GAP-008.
- Gap Matrix Audit: `docs/specs/gap-matrices/audits/SPEC-DOM-001-implementation-gap-matrix-audit.md`.
- Implementation Plan: `docs/specs/implementation-plans/SPEC-DOM-001-implementation-plan.md` — DOM-IMP-03.
- Plan Audit: `docs/specs/implementation-plans/audits/SPEC-DOM-001-implementation-plan-audit.md`.

## 3. Authority / Scope

Approved owner: DOM `CANONICAL_OWNER`. Primary owning specification/domain: `SPEC-DOM-001`. Local ownership covers lifecycle separation, revision, reciprocal succession, semantic history, and derived eligibility invalidation. Foreign capabilities consumed: PLAT evidence reference and OPS historical projection, both non-blocking.

## 4. Portfolio Obligation Coverage

`O-006` separate decision/realization lifecycles; `O-007` revision on remediation; `O-008` implemented ADR immutability and succession.

## 5. Gap / Requirement / Acceptance Coverage

Gaps: `GAP-006`, `GAP-007`, `GAP-008`. Requirements: `DOM-LIFE-001`, `DOM-REV-001`, `DOM-IMMUT-001`. Local acceptance: `AC-DOM-006`, `AC-DOM-007`, `AC-DOM-008`. Integrated contribution: `AC-DOM-052`; final owner TICKET-012.

## 6. Implementation Unit

`DOM-IMP-03 — Lifecycle revision and ADR succession`. Formation reason: `SHARED_CUTOVER`. No split or merge.

## 7. Goal

Implement separate decision/realization lifecycles and revision/immutability rules for remediation and implemented ADR succession.

## 8. Validated Implementation Delta

`OBSERVED`: prototype statuses and reversible mutation scenarios only.  
`REQUIRED`: independent lifecycles, new revision on remediation, immutable implemented ADR, and reciprocal successor relation.  
`DELTA`: no productive authority transition.

## 9. Required Behavior

Prevent cross-lifecycle mutation; create a successor revision on normative remediation; invalidate prior derived eligibility; reject silent rewrite/reprocessing of implemented ADRs; supply stable history to downstream plans, evidence, and projections.

## 10. Does Not Implement

PLAT evidence persistence, OPS projection, repository migration, foreign compatibility retirement, or downstream invalidation registry, which is owned by TICKET-010.

## 11. Repository Evidence

`prototype/src/mockDomain.ts:27-40, :737, :927`; ADR mutation/hash tests. Replace reversible mock authority; extend negative and successor tests.

## 12. Expected Repository Impact

Production code: lifecycle/revision records and transition boundary.  
Persistence/schema: semantic history reference only.  
Integration: PLAT/OPS mapping seams.  
Tests: lifecycle, revision, succession, stale, replay, and regression tests.  
Legacy/cutover: preserved historical reads and invalidated prior eligibility.  
Generated contracts: none locally required.

## 13. Dependencies

Internal: `DOM-001-TICKET-001`, `DOM-001-TICKET-002`. Cross-SPEC: `SPEC-PLAT-001` durable evidence reference and `SPEC-OPS-001` historical projection; non-blocking.

## 14. Blocking Conditions

Blocked until TICKET-001 and TICKET-002 complete. No foreign blocker is unresolved.

## 15. Implementation Constraints

Preserve historical lineage, reciprocal succession, immutable implemented records, eligibility invalidation, and separate decision versus realization state.

## 16. Acceptance Criteria

- [ ] Decision and realization lifecycle transitions can be exercised separately.
- [ ] Remediation creates a new revision and preserves history.
- [ ] Implemented ADR mutation is rejected and succession is reciprocal.
- [ ] `LOCAL_PROVABILITY = YES` after TICKET-001/002.

All criteria are `TESTABLE: YES` and `LOCALLY_PROVABLE: YES` after prerequisites.

## 17. Acceptance / Proof Role

`CONTRIBUTOR: YES` to AC-DOM-052. `LOCAL_ACCEPTANCE_OWNER: YES` and `FINAL_PROOF_OWNER: YES` for AC-DOM-006–008. Not final owner of AC-DOM-052.

## 18. Required Tests

Domain-invariant, stale-protection, compatibility, historical-replay, and regression tests for lifecycle independence, revision invalidation, silent rewrite rejection, and reciprocal links.

## 19. Completion Evidence

Revision/succession code path; immutable record proof; historical relation fixtures; and fail-closed mutation tests.

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

`CUTOVER` and `HISTORICAL_REPLAY`; old semantic records remain readable and prior eligibility is invalidated. Physical evidence migration is foreign.

## 22. Risks

Silent rewrite or history loss. Mitigation: immutable boundary and successor-link assertions.

## 23. Implementation Wave

`WAVE: 3`.

## 24. Parallelization

`SAFE_WITH_COORDINATION`; blocked by TICKET-001/002 and unblocks TICKET-010/012.

## 25. Handoff After Completion

Independent ticket audit may validate this ticket; its revision/invalidation evidence is consumed by TICKET-010 and the final evaluator.

## 26. Ticket Local Closure

`TICKET_LOCAL_CLOSURE = YES`. Physical persistence and foreign projection are not required for local closure.
