# DOM-001-TICKET-004 — Pipeline and aggregate state machines

## 1. Status

`STATUS: VALIDATION_REQUIRED`  
`ISSUE_DECOMPOSITION_READINESS: ISSUE_READY`  
`INITIAL_DAG_STATE: BLOCKED`  
`BLOCKED_BY: NONE`  
`DEPENDS_ON: DOM-001-TICKET-001`  
`UNBLOCKS: DOM-001-TICKET-005, DOM-001-TICKET-006, DOM-001-TICKET-007, DOM-001-TICKET-012`

## 2. Source Traceability

- Portfolio: `docs/specs/SPEC-PORTFOLIO-001-organization.md` — O-009, O-010.
- Component SPEC: `docs/specs/SPEC-DOM-001-workflow-authority-and-governance.md` — DOM-PIPE-001, DOM-STATE-001.
- Gap Matrix: `docs/specs/gap-matrices/SPEC-DOM-001-implementation-gap-matrix.md` — GAP-009, GAP-010.
- Gap Matrix Audit: `docs/specs/gap-matrices/audits/SPEC-DOM-001-implementation-gap-matrix-audit.md`.
- Implementation Plan: `docs/specs/implementation-plans/SPEC-DOM-001-implementation-plan.md` — DOM-IMP-04.
- Plan Audit: `docs/specs/implementation-plans/audits/SPEC-DOM-001-implementation-plan-audit.md`.

## 3. Authority / Scope

Approved owner: DOM `CANONICAL_OWNER`. Primary owning specification/domain: `SPEC-DOM-001`. Local ownership covers pipeline ordering, separate aggregate state machines, derivation, and projection boundaries. Foreign capabilities consumed: downstream state mappings only; no foreign operational state is implemented.

## 4. Portfolio Obligation Coverage

`O-009` canonical pipeline ordering; `O-010` separate state machines and derived higher states.

## 5. Gap / Requirement / Acceptance Coverage

Gaps: `GAP-009`, `GAP-010`. Requirements: `DOM-PIPE-001`, `DOM-STATE-001`. Local acceptance: `AC-DOM-009`, `AC-DOM-010`. Integrated contribution: `AC-DOM-052`; final owner TICKET-012.

## 6. Implementation Unit

`DOM-IMP-04 — Pipeline and aggregate state machines`. Formation reason: `SHARED_INVARIANT`. No split or merge.

## 7. Goal

Enforce canonical pipeline ordering and maintain separate aggregate state machines with controlled derivation.

## 8. Validated Implementation Delta

`OBSERVED`: labels, enums, and scenario advancement in mock code.  
`REQUIRED`: productive enforcement against bypass and implicit combined transitions.  
`DELTA`: no pipeline/state authority.

## 9. Required Behavior

Reject phase bypass; keep execution, SPEC, stage, activity, cycle, wave, ticket, migration, and publication machines distinct; derive higher states only through approved rules; provide canonical state inputs to commands and advancement.

## 10. Does Not Implement

Scheduler capacity/leases, Git integration, backend transport, OPS/UI projection, or foreign operational states.

## 11. Repository Evidence

`prototype/src/App.tsx:52-62`; `prototype/src/mockDomain.ts:15-23, :863-884`. Replace mock transition authority; extend bypass and derivation tests.

## 12. Expected Repository Impact

Production code: aggregate/state model, pipeline guard, events, and queries.  
Persistence/schema: no physical persistence implementation.  
Integration: read-only consumer state mappings.  
Tests: state-machine, bypass, derivation, projection-boundary, and regression tests.  
Legacy/cutover: new canonical path.  
Generated contracts: none locally required.

## 13. Dependencies

Internal: `DOM-001-TICKET-001`. Cross-SPEC consumer state mappings are downstream and non-blocking.

## 14. Blocking Conditions

Blocked until TICKET-001 completes. No external blocker exists.

## 15. Implementation Constraints

No stage may declare a later stage complete; projections/transports cannot create canonical transitions; aggregate states remain separate.

## 16. Acceptance Criteria

- [ ] Every prohibited bypass is rejected.
- [ ] Combining aggregate machines or fabricating a higher state is rejected.
- [ ] `LOCAL_PROVABILITY = YES` with only TICKET-001 completed as prerequisite.

All criteria are `TESTABLE: YES` and `LOCALLY_PROVABLE: YES` after prerequisite.

## 17. Acceptance / Proof Role

`CONTRIBUTOR: YES` to AC-DOM-052. `LOCAL_ACCEPTANCE_OWNER: YES` and `FINAL_PROOF_OWNER: YES` for AC-DOM-009 and AC-DOM-010. Not final owner of AC-DOM-052.

## 18. Required Tests

Unit, state-machine, application, projection-boundary, and regression tests for stage boundaries, prohibited bypass, independent transitions, derivation, and stale projection commands.

## 19. Completion Evidence

Executable ordered pipeline/state authority and negative tests for bypass and implicit combined states.

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

`NEW_CANONICAL_PATH`; no legacy writes or migration are owned.

## 22. Risks

Consumer projection becoming a second state authority. Mitigation: boundary tests and read-only query assertions.

## 23. Implementation Wave

`WAVE: 2`.

## 24. Parallelization

`SAFE_WITH_COORDINATION`; blocked by TICKET-001 and unblocks TICKET-005/006/007/012.

## 25. Handoff After Completion

Independent ticket audit may validate this ticket; command, ticket, and publication tickets may proceed when their other prerequisites are also satisfied.

## 26. Ticket Local Closure

`TICKET_LOCAL_CLOSURE = YES`.

## 27. Implementation Evidence

`IMPLEMENTATION_STATUS: IMPLEMENTED`
`STATUS_TRANSITION: READY -> IN_PROGRESS -> IMPLEMENTED -> VALIDATION_REQUIRED`

Implemented the approved bounded design in:

- `src/domain/pipeline.ts`
- `src/application/pipeline.ts`
- `tests/dom-001-ticket-004.test.ts`

The domain owns the canonical ordered pipeline, immediate-successor
validation, immutable pipeline revision, independent machine-state input
boundary, and pure read-only derivation. The application handlers only
orchestrate repository/state-reader calls. The repository port owns persistence
and atomic compare-and-set using `expectedRevision`; stale results are mapped
without rebase or last-write-wins.

Local acceptance evidence:

- five ticket-scoped tests passed;
- later-stage bypasses are rejected without mutation;
- all nine aggregate state inputs require their own machine owner and are
  immutable;
- derived state is read-only and missing inputs fail closed;
- stale CAS preserves the persisted stage and revision.

`INDEPENDENT_VALIDATION: REQUIRED`
