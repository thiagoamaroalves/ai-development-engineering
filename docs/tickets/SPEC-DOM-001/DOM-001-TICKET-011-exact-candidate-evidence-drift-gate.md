# DOM-001-TICKET-011 — Exact candidate evidence and drift gate

## 1. Status

`STATUS: BLOCKED`  
`ISSUE_DECOMPOSITION_READINESS: ISSUE_READY`  
`INITIAL_DAG_STATE: BLOCKED`  
`BLOCKED_BY: DOM-001-TICKET-007`  
`DEPENDS_ON: DOM-001-TICKET-001, DOM-001-TICKET-007`  
`UNBLOCKS: DOM-001-TICKET-012`

## 2. Source Traceability

- Portfolio: `docs/specs/SPEC-PORTFOLIO-001-organization.md` — O-054.
- Component SPEC: `docs/specs/SPEC-DOM-001-workflow-authority-and-governance.md` — DOM-AUDIT-006.
- Gap Matrix: `docs/specs/gap-matrices/SPEC-DOM-001-implementation-gap-matrix.md` — GAP-021.
- Gap Matrix Audit: `docs/specs/gap-matrices/audits/SPEC-DOM-001-implementation-gap-matrix-audit.md`.
- Implementation Plan: `docs/specs/implementation-plans/SPEC-DOM-001-implementation-plan.md` — DOM-IMP-11.
- Plan Audit: `docs/specs/implementation-plans/audits/SPEC-DOM-001-implementation-plan-audit.md`.

## 3. Authority / Scope

Approved owner: DOM `CANONICAL_OWNER`. Primary owning specification/domain: `SPEC-DOM-001`. Local ownership covers candidate identity, semantic evidence binding, and drift-invalidating gate. Foreign capabilities consumed: GIT evidence production and PLAT/OPS physical preservation/replay, all non-blocking locally.

## 4. Portfolio Obligation Coverage

`O-054` exact base/head/tree binding, hash-linked evidence, and invalidation on drift before publication.

## 5. Gap / Requirement / Acceptance Coverage

Gap: `GAP-021`. Requirement: `DOM-AUDIT-006`. Local acceptance: `AC-DOM-054`. Integrated contribution: `AC-DOM-052`; final owner TICKET-012.

## 6. Implementation Unit

`DOM-IMP-11 — Exact candidate evidence and drift gate`. Formation reason: `SHARED_CONFORMANCE`. No split or merge.

## 7. Goal

Bind canonical publication/conformance identity to exact base, head, tree, and hash-linked evidence, invalidating authorization on drift.

## 8. Validated Implementation Delta

`OBSERVED`: deterministic mock hashes/evidence IDs.  
`REQUIRED`: productive exact candidate identity, hash-linked semantic binding, and drift-invalidating gate.  
`DELTA`: no productive DOM evidence boundary exists.

## 9. Required Behavior

Bind candidate approval to exact base/head/tree, conformance run, and correlated evidence; reject or invalidate any drift before publication; retain identity links; consume GIT evidence without executing Git.

## 10. Does Not Implement

Git/GitHub operations, remote evidence generation, PLAT journal/storage/replay, OPS export/projection, or publication transport.

## 11. Repository Evidence

`prototype/src/mockDomain.ts:705, :720, :911-917`; publication/drift tests. Replace mock candidate authority; extend exact-binding and drift tests.

## 12. Expected Repository Impact

Production code: candidate/conformance gate and evidence binding boundary.  
Persistence/schema: hash-linked preservation seam.  
Integration: GIT evidence and PLAT/OPS reference mapping.  
Tests: exact binding, each drift dimension, evidence identity, stale, idempotency, compatibility, conformance, and regression tests.  
Legacy/cutover: historical replay and cutover.  
Generated contracts: candidate/evidence gate result.

## 13. Dependencies

Internal: `DOM-001-TICKET-001`, `DOM-001-TICKET-007`. Cross-SPEC: GIT evidence and PLAT/OPS preservation/replay, non-blocking locally.

## 14. Blocking Conditions

Blocked until identity and publication gate contracts complete. No external blocker exists.

## 15. Implementation Constraints

Exact base/head/tree and hash evidence are mandatory; drift invalidates authorization; foreign evidence remains distinct from canonical identity.

## 16. Acceptance Criteria

- [ ] Candidate identity is bound to exact base/head/tree and hash-linked evidence.
- [ ] Base, head, or tree drift invalidates authorization before publication.
- [ ] `LOCAL_PROVABILITY = YES` after TICKET-001/007.

All criteria are `TESTABLE: YES` and `LOCALLY_PROVABLE: YES` after prerequisites.

## 17. Acceptance / Proof Role

`CONTRIBUTOR: YES` to AC-DOM-052. `LOCAL_ACCEPTANCE_OWNER: YES` and `FINAL_PROOF_OWNER: YES` for AC-DOM-054. Not final owner of AC-DOM-052.

## 18. Required Tests

Unit, conformance, stale-protection, compatibility, idempotency, and regression tests for exact binding, each drift dimension, evidence identity, and rejection of confirmation from adapter success alone.

## 19. Completion Evidence

Candidate/evidence gate; exact-binding assertions; drift invalidation trace; and foreign mapping contract tests.

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

`HISTORICAL_REPLAY` and `CUTOVER`; preserve old evidence references and do not retire foreign paths.

## 22. Risks

Identity mismatch or accepting stale evidence. Mitigation: base/head/tree matrix and hash-linked correlation assertions.

## 23. Implementation Wave

`WAVE: 5`.

## 24. Parallelization

`SAFE_WITH_COORDINATION`; blocked by TICKET-001/007 and unblocks TICKET-012.

## 25. Handoff After Completion

Independent ticket audit may validate this ticket; the final evaluator consumes exact candidate and drift evidence.

## 26. Ticket Local Closure

`TICKET_LOCAL_CLOSURE = YES`; integrated foreign preservation is outside local closure.
