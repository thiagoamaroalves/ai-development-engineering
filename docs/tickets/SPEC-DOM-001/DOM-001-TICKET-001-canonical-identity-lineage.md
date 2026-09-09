# DOM-001-TICKET-001 — Canonical identity and lineage authority

## 1. Status

`STATUS: DONE`
`ISSUE_DECOMPOSITION_READINESS: ISSUE_READY`  
`INITIAL_DAG_STATE: READY`  
`BLOCKED_BY: NONE`  
`DEPENDS_ON: NONE`  
`UNBLOCKS: DOM-001-TICKET-002, DOM-001-TICKET-003, DOM-001-TICKET-004, DOM-001-TICKET-005, DOM-001-TICKET-008, DOM-001-TICKET-011, DOM-001-TICKET-012`

`IMPLEMENTATION_AUDIT: docs/tickets/SPEC-DOM-001/DOM-001-TICKET-001-implementation-audit.md`  
`IMPLEMENTATION_AUDIT_VERDICT: TICKET_IMPLEMENTATION_CONFORMANT`  
`COMPLETION_HEAD: a58ce959f9b34f3c1c83ed41c01b058d31bf3366 (uncommitted working-tree snapshot)`

## 2. Source Traceability

- Portfolio: `docs/specs/SPEC-PORTFOLIO-001-organization.md` — O-001, O-005.
- Component SPEC: `docs/specs/SPEC-DOM-001-workflow-authority-and-governance.md` — DOM-ID-001, DOM-LINEAGE-001.
- Gap Matrix: `docs/specs/gap-matrices/SPEC-DOM-001-implementation-gap-matrix.md` — GAP-001, GAP-005.
- Gap Matrix Audit: `docs/specs/gap-matrices/audits/SPEC-DOM-001-implementation-gap-matrix-audit.md` — conformant validation.
- Implementation Plan: `docs/specs/implementation-plans/SPEC-DOM-001-implementation-plan.md` — DOM-IMP-01.
- Plan Audit: `docs/specs/implementation-plans/audits/SPEC-DOM-001-implementation-plan-audit.md` — `IMPLEMENTATION_PLAN_CONFORMANT`.

## 3. Authority / Scope

Approved owner: DOM `CANONICAL_OWNER`. Primary owning specification/domain: `SPEC-DOM-001`. Local ownership covers canonical identity creation, uniqueness, scope, revision/lineage, historical resolution, and independent ADR↔SPEC progress. Foreign capabilities consumed: none; consumer correlation must not create another authority.

## 4. Portfolio Obligation Coverage

`O-001` persistent aggregate identities; `O-005` explicit many-to-many ADR↔SPEC lineage.

## 5. Gap / Requirement / Acceptance Coverage

Gaps: `GAP-001`, `GAP-005`. Requirements: `DOM-ID-001`, `DOM-LINEAGE-001`. Local acceptance: `AC-DOM-001`, `AC-DOM-005`. Integrated contribution: evidence to `AC-DOM-052`; final proof owner for that acceptance is TICKET-012.

## 6. Implementation Unit

`DOM-IMP-01 — Canonical identity and lineage authority`. Formation reason: `SHARED_AUTHORITY`. No split siblings; no merge. `UNIT_SCOPE_LOST_BY_SPLIT: 0`.

## 7. Goal

Provide productive, persistent-resolution semantics for DOM aggregate identities and explicit independent ADR↔SPEC lineage.

## 8. Validated Implementation Delta

`OBSERVED`: only in-memory IDs and relationship arrays exist in the prototype.  
`REQUIRED`: stable, resolvable, immutable canonical identities and explicit many-to-many lineage.  
`DELTA`: no productive identity or lineage authority exists.

## 9. Required Behavior

Create and resolve canonical identities; reject unresolved or invalid-revision references; preserve identity distinctions and independent ADR/SPEC progress. Downstream consumers may correlate records but may not create a second identity authority.

## 10. Does Not Implement

Foreign persistence mechanics, assignment/session lifecycle, effect or publication execution, backend/API authorization, UI/OPS projections, or downstream final conformance.

## 11. Repository Evidence

`prototype/src/mockDomain.ts:30-43, :700-744`; prototype identity/lineage tests. The mock authority is replaced with a productive boundary; tests are scenario references only.

## 12. Expected Repository Impact

Production code: domain identity/lineage model and canonical command/query boundary.  
Persistence/schema: identity-resolution persistence contract only; physical mechanics remain foreign.  
Integration: consumer correlation seam.  
Tests: identity, lineage, historical-resolution, and regression tests.  
Legacy/cutover: new canonical path with historical reads.  
Generated contracts: none locally required.

## 13. Dependencies

Internal ticket dependencies: none. Cross-SPEC dependencies: none blocking; AgentId, assignment/session, ExternalEffectId, and PublicationId remain distinct foreign concepts.

## 14. Blocking Conditions

No unresolved blocker. The ticket is READY and may begin implementation.

## 15. Implementation Constraints

Preserve canonical identity, scope, immutability, historical resolution, identity distinctions, and many-to-many lineage independence. Do not infer identity from a filename alone.

## 16. Acceptance Criteria

- [x] Productive tests prove creation, uniqueness, immutability, scope, lineage, historical resolution, and invalid-reference rejection.
- [x] Independent ADR↔SPEC relationships progress without mutating another relationship.
- [x] `LOCAL_PROVABILITY = YES` with no downstream behavior required.

All criteria are `TESTABLE: YES` and `LOCALLY_PROVABLE: YES`.

## 17. Acceptance / Proof Role

`CONTRIBUTOR: YES` to AC-DOM-052. `LOCAL_ACCEPTANCE_OWNER: YES` for AC-DOM-001 and AC-DOM-005. `FINAL_PROOF_OWNER: YES` for AC-DOM-001 and AC-DOM-005; `FINAL_PROOF_OWNER: NO` for AC-DOM-052.

## 18. Required Tests

Unit and domain-invariant tests for identity uniqueness, immutable revision, historical lookup, invalid references, many-to-many lineage, independent progress, and prototype-derived regression cases.

## 19. Completion Evidence

Productive identity/lineage code path; executable positive and negative tests; immutable historical lookup evidence; and proof that consumers do not create duplicate authority.

Evidence status:

- `production_code: PRESENT` — `src/domain/identity.ts`, `src/domain/lineage.ts`, `src/application/identity.ts`, and `src/application/lineage.ts`.
- `automated_tests: PRESENT` — `tests/dom-001-ticket-001.test.ts` covers identity, scope, revision, immutable closed-kind vocabulary, historical resolution, invalid references, filename rejection, independent many-to-many lineage, and deterministic asynchronous one-winner reservation contracts for identity and lineage.
- `persistence_schema: NOT_APPLICABLE` — physical persistence remains PLAT-owned; repository ports define the atomic reserve and exact-resolution contract.
- `integration_evidence: NOT_APPLICABLE` — no foreign implementation is required for local closure.
- `legacy_transition_evidence: PRESENT` — the productive path is additive, historical revisions remain resolvable, and `prototype/` was not modified or promoted to authority.
- `conformance_evidence: PRESENT` — typecheck, ticket tests, prototype regression suite, lint, build, and adversarial probe passed; domain code has no infrastructure or foreign lifecycle imports.

Implementation validation record:

- `TESTS_RUN: 103` (`11` productive ticket tests + `92` prototype regression tests); `TESTS_PASSED: 103`; `TESTS_FAILED: 0`; `TESTS_SKIPPED: 0`; `ENVIRONMENTAL_FAILURES: 0`.
- `AC-DOM-001: SATISFIED`; `AC-DOM-005: SATISFIED`; `AC-DOM-052: CONTRIBUTOR_EVIDENCE_PRESENT`.
- `IMPLEMENTATION_STRUCTURAL_SELF_CHECK: PASS`.
- `DESIGN_DEVIATIONS: NONE`.

## 20. Completion Gate

```text
COMPLETION_GATE:
  production_code: REQUIRED
  automated_tests: REQUIRED
  integration_evidence: NOT_APPLICABLE
  legacy_transition_evidence: REQUIRED
  conformance_evidence: REQUIRED
```

## 21. Legacy / Cutover Impact

`NEW_CANONICAL_PATH`; preserve historical identity resolution. No legacy write retirement is owned here.

## 22. Risks

Identity collapse with assignment/session or presentation IDs. Mitigation: explicit distinction tests and boundary review.

## 23. Implementation Wave

`WAVE: 1`.

## 24. Parallelization

`SERIAL_REQUIRED`. `UNBLOCKS: DOM-001-TICKET-002, DOM-001-TICKET-003, DOM-001-TICKET-004, DOM-001-TICKET-005, DOM-001-TICKET-008, DOM-001-TICKET-011, DOM-001-TICKET-012`.

## 25. Handoff After Completion

Independent ticket audit may validate this ticket. Completion unblocks its listed dependents; integrated proof remains at the plan checkpoints.

## 26. Ticket Local Closure

`TICKET_LOCAL_CLOSURE = YES`. Local acceptance, tests, and completion evidence are executable without future downstream behavior.
