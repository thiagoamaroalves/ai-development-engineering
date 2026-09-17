# DOM-001-TICKET-006 — Ticket states and functional transitions

## 1. Status

`STATUS: DONE`
`ISSUE_DECOMPOSITION_READINESS: ISSUE_READY`  
`INITIAL_DAG_STATE: BLOCKED`  
`BLOCKED_BY: NONE`
`CURRENT_DAG_STATE: DONE`
`DEPENDS_ON: DOM-001-TICKET-004, DOM-001-TICKET-005`  
`UNBLOCKS: DOM-001-TICKET-010, DOM-001-TICKET-012`

### Implementation execution record

```text
INITIAL_STATUS: READY
FINAL_STATUS: DONE
IMPLEMENTATION_STATUS: IMPLEMENTED
IMPLEMENTATION_BASELINE: 6b31bcee1591c8b2e6499a434950664077b2be01 plus assessed dirty worktree
CURRENT_HEAD: 6b31bcee1591c8b2e6499a434950664077b2be01
TICKET_AUDIT_HEAD: 6b31bcee1591c8b2e6499a434950664077b2be01 plus remediated T006 worktree
DESIGN_ARTIFACT: docs/tickets/SPEC-DOM-001/DOM-001-TICKET-006-implementation-design.md
DESIGN_GATE: IMPLEMENTATION_DESIGN_READY / READY_FOR_IMPLEMENTATION
CHANGED_FILES: src/domain/ticket.ts; src/application/ticket.ts; tests/dom-001-ticket-006.test.ts; docs/tickets/SPEC-DOM-001/evidence/TICKET-006/*
TESTS_RUN: T006 focused (4); combined root ticket suite (11); full root productive suite (114); strict source typecheck
TESTS_PASSED: 4 focused; 11 combined; 114 full; typecheck PASS
TESTS_FAILED: 0
TESTS_SKIPPED: 0
ENVIRONMENTAL_FAILURES: 0
ACCEPTANCE_CRITERIA: AC-DOM-012 SATISFIED; AC-DOM-013 SATISFIED
COMPLETION_EVIDENCE: PRESENT and current locally; foreign EXEC/PLAT mappings remain integrated-only
IMPLEMENTATION_TIME_REMAINING_BLOCKERS: NONE for local ticket closure; integrated EXEC/PLAT proof remains downstream and TICKET-012 remained blocked by other predecessors
REMEDIATION_ARTIFACT: docs/tickets/SPEC-DOM-001/DOM-001-TICKET-006-implementation-remediation.md
REMEDIATION_STATUS: COMPLETE; independent audit passed
FINALIZATION_ARTIFACT: docs/tickets/SPEC-DOM-001/evidence/TICKET-006/finalization-2026-09-16.md
IMPLEMENTATION_STRUCTURAL_SELF_CHECK: PASS
STRUCTURAL_REVIEW_STATUS: PASS
STRUCTURAL_REVIEW_FINDINGS: 0
DOMAIN_MODEL_CONFORMANT: YES
AGGREGATE_BOUNDARIES_CONFORMANT: YES
INVARIANT_PLACEMENT_CONFORMANT: YES
COMPONENT_BOUNDARIES_CONFORMANT: YES
SOLID_CONFORMANT: YES
DEPENDENCY_DIRECTION_CONFORMANT: YES
CLEAN_CODE_STRUCTURALLY_ACCEPTABLE: YES
CROSS_SPEC_BOUNDARY_CONFORMANT: YES
CRITICAL_INVARIANTS_WITH_TESTS: ALL
REQUIRED_TEST_SURFACES_IMPLEMENTED: YES
TESTABILITY_REGRESSIONS: 0
```

## 2. Source Traceability

- Accepted ADR authority: `ADR-0002` revision 3, SHA-256 `EF9289C6FCA4BBA73FCA53CA38C71DD19110EB1CFE948358A7CCA1FE14E177D9` — ticket states, transition table, terminality, and continuation linkage.
- Portfolio: `docs/specs/SPEC-PORTFOLIO-001-organization.md` — O-012, O-013.
- Component SPEC: `docs/specs/SPEC-DOM-001-workflow-authority-and-governance.md` — DOM-TICKET-001, DOM-TICKET-002.
- Gap Matrix: `docs/specs/gap-matrices/SPEC-DOM-001-implementation-gap-matrix.md` — GAP-014, GAP-015.
- Gap Matrix Audit: `docs/specs/gap-matrices/audits/SPEC-DOM-001-implementation-gap-matrix-audit.md`.
- Implementation Plan: `docs/specs/implementation-plans/SPEC-DOM-001-implementation-plan.md` — SHA-256 `C57D24FEC7CF69BED3EC354C4334DE698AFC54722FD7EDA6F2D3D6353FF35C33`; DOM-IMP-06.
- Plan Audit: `docs/specs/implementation-plans/audits/SPEC-DOM-001-implementation-plan-audit-2026-09-11-reaudit-002.md` — SHA-256 `474E33C3FD17F8790FBB2CD2A39C9670A33D0830FF851C8D06DE31CA6BFB9695`; `READY_FOR_ISSUE_DECOMPOSITION`.

## 3. Authority / Scope

Approved owner: DOM `CANONICAL_OWNER`. Primary owning specification/domain: `SPEC-DOM-001`. Local ownership covers functional ticket state, terminality, linked continuation, exact transition meaning, and rejection. Foreign capabilities consumed: execution, operational, Git, transport, and UI mappings; none are implemented here.

## 4. Portfolio Obligation Coverage

`O-012` functional ticket states and terminality; `O-013` complete functional transition table.

## 5. Gap / Requirement / Acceptance Coverage

Gaps: `GAP-014`, `GAP-015`. Requirements: `DOM-TICKET-001`, `DOM-TICKET-002`. Local acceptance: `AC-DOM-012`, `AC-DOM-013`. Integrated contribution: `AC-DOM-052`; final owner TICKET-012.

## 6. Implementation Unit

`DOM-IMP-06 — Ticket states and functional transitions`. Formation reason: `SHARED_INVARIANT + SHARED_COMMAND_BOUNDARY`. No split or merge.

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

Productive ticket aggregate, transition/rejection boundary, and accepted-provenance checks are implemented in `src/domain/ticket.ts` and `src/application/ticket.ts`; direct state, transition, terminality, stale, idempotency, authorization and concurrency evidence is recorded under `evidence/TICKET-006/`.

## 12. Expected Repository Impact

Production code: ticket aggregate and transition boundary.  
Persistence/schema: semantic transition history seam only.  
Integration: execution and operational mappings.  
Tests: full eight-transition matrix, formal-verdict gate, terminality, continuation, rejection recording, stale, idempotency, accepted rehydration and concurrency tests.
Legacy/cutover: new canonical path preserving terminal history.  
Generated contracts: functional state/transition vocabulary.

## 13. Dependencies

Internal: `DOM-001-TICKET-004`, `DOM-001-TICKET-005`. Cross-SPEC execution and operational states remain separate, non-blocking consumers.

## 14. Blocking Conditions

TICKET-005 is complete and its dependency edge is satisfied. TICKET-004 is complete and remains only in `DEPENDS_ON` for lineage. No current internal or external blocker exists.

## 14a. Authority Consumption Proof

| Field | Proof |
|---|---|
| Proof ID / authority existence | `ACP-DOM-06`; `YES` — `ADR-0002` revision 3, SHA-256 `EF9289C6FCA4BBA73FCA53CA38C71DD19110EB1CFE948358A7CCA1FE14E177D9`. |
| Scoped decision / truth owner | `ADR0002-D004`; DOM owns six ticket states, eight valid transitions, terminality, and rejection. |
| Semantic source | `DOM-TICKET-001`, `DOM-TICKET-002`; `GAP-014`, `GAP-015`. |
| Consumed interface / returned data | Ticket aggregate transition port; returns state, valid transition result, terminality, and linked continuation reference. |
| Revision/version transport | Ticket identity, predecessor state, transition ID, and aggregate revision are recorded atomically. |
| Failure / stale semantics | Invalid edge, unknown state, terminal mutation, missing continuation, duplicate, or stale revision rejects without partial transition. |
| Productive availability / evidence | `YES` for local aggregate and transition matrix; EXEC outcome mapping is a non-blocking consumer. Evidence: `T6-AC1`–`T6-AC4`. |
| Result | `AUTHORITY_DEFINED_BUT_NOT_CONSUMABLE` for integrated-only EXEC/PLAT mappings; local contract witness only. |

## 14b. Producer / Consumer Contract Proof

| Field | Proof |
|---|---|
| Contract / producer / consumer | `PCP-EXEC-02`; DOM produces canonical ticket state, EXEC-002 consumes it and returns execution outcomes without lifecycle authority. |
| Interface / input / returned data | Ticket transition interface; input is current state plus command/revision; output is next canonical state or rejection. |
| Revision/version transport | Aggregate revision and transition correlation are returned with execution outcome. |
| Failure / not-found / stale | Unknown ticket/state, invalid edge, terminal mutation, duplicate, or stale revision is rejected and recorded with no effect. |
| Availability / local proof boundary | Local aggregate contract and EXEC deterministic consumer fixture are available; EXEC runtime is not a prerequisite for local closure. |
| Evidence / result | `T6-AC1`–`T6-AC4` direct transition, terminality, recorded rejection, concurrency/idempotency and reconstruction witnesses; PRODUCER_CONSUMER_CONTRACT: PROVEN_LOCAL_FIXTURE, RESULT: CONTRACT_DEFINED_LOCAL_WITNESS_ONLY. |

### Capability Availability Reconciliation

APPLICABLE_SHARED_CAPABILITY_RECORDS: NONE.
RECONCILIATION_SOURCE: README section 11.1 and current Plan section 12.1.
AUTHORITY_STATUS = DEFINED; CONTRACT_STATUS = DEFINED; LOCAL_TESTABILITY = NO;
PRODUCTIVE_AVAILABILITY = NO; DEPENDENCY_CLASS = REQUIRED_FOR_INTEGRATED_PROOF.
BLOCKING_EFFECT: no local execution or local-closure block; integrated proof
only. Local fixture evidence is contract-level only. Complete owner, producer,
consumer, contract, failure semantics, version transport, and availability
evidence are preserved in README section 11.1. For NONE, no shared capability
record is required by the current Plan for this ticket's local closure.
NO_DOWNSTREAM_CAPABILITY_PROMOTION_WITHOUT_NEW_EVIDENCE = TRUE.

### Acceptance witness context
`PRODUCER_CONSUMER_CONTRACT_PROOF_FIELDS`: `PRODUCER = SPEC-EXEC-002`;
`PRODUCED_CONTRACT = execution outcome consumption without lifecycle authority`;
`AUTHORITY_OWNER = SPEC-DOM-001`; `CONSUMER = TICKET-006`;
`CONSUMED_CAPABILITY = canonical ticket state and transition result`;
`AVAILABILITY_CONDITION = local aggregate and deterministic EXEC consumer fixture
available`; `DEPENDENCY_EDGE = TICKET-006 canonical state → EXEC-002 outcome
consumer`; `PROOF_EVIDENCE = docs/tickets/SPEC-DOM-001/evidence/TICKET-006/AC-DOM-012-states.md`.

## 14c. ACCEPTANCE_WITNESS_MATRIX

| NORMATIVE_BEHAVIOR | NORMATIVE_VERB | CONCRETE_OPERATION_COMMAND_OR_QUERY | STATE_OR_TRANSITION_AFFECTED | DIRECT_POSITIVE_TEST | DIRECT_NEGATIVE_OR_ISOLATION_TEST | EXPECTED_EVIDENCE_FILE | EVIDENCE_TYPE | ACCEPTANCE_OWNER | REQUIRED_PRODUCER_OR_CAPABILITY | AUTHORITY_STATUS | CONTRACT_STATUS | LOCAL_TESTABILITY | PRODUCTIVE_AVAILABILITY | CAPABILITY_SUMMARY_STATUS | DEPENDENCY_CLASS | WITNESS_EXECUTABLE_AT_LOCAL_CLOSURE |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Six-state aggregate | accepts exact states | ticket create/rehydrate command | ticket lifecycle state | `T6-AC1-P` six valid state fixtures rehydrate | `T6-AC1-N` unknown/forged state rejects | `docs/tickets/SPEC-DOM-001/evidence/TICKET-006/AC-DOM-012-states.md` | LOCAL_TEST_EVIDENCE | TICKET-006 | none — local DOM ticket aggregate | DEFINED | DEFINED | YES | YES | CONTRACT_PRODUCTIVELY_AVAILABLE | REQUIRED_FOR_LOCAL_CLOSURE | YES |
| Eight transitions | executes exactly | ticket transition command | allowed transition edge | `T6-AC2-P` complete eight-edge matrix | `T6-AC2-N` invalid edge, duplicate, or stale transition rejects | `docs/tickets/SPEC-DOM-001/evidence/TICKET-006/AC-DOM-013-transitions.md` | LOCAL_TEST_EVIDENCE | TICKET-006 | none — local DOM ticket aggregate | DEFINED | DEFINED | YES | YES | CONTRACT_PRODUCTIVELY_AVAILABLE | REQUIRED_FOR_LOCAL_CLOSURE | YES |
| Continuation and terminality | requires linked continuation and rejects mutation | continuation/transition command | terminal and successor state | `T6-AC3-P` linked continuation succeeds and concurrent work remains independent | `T6-AC3-N` terminal mutation/unlinked continuation rejects; retry idempotent | `docs/tickets/SPEC-DOM-001/evidence/TICKET-006/AC-DOM-012-terminality.md` | LOCAL_TEST_EVIDENCE | TICKET-006 | none — local DOM ticket aggregate | DEFINED | DEFINED | YES | YES | CONTRACT_PRODUCTIVELY_AVAILABLE | REQUIRED_FOR_LOCAL_CLOSURE | YES |

### Temporal Authority Proof

`TEMPORAL_AUTHORITY_PROOF: PRESERVED_FROM_PLAN`; source: Plan `DOM-IMP-06`
Temporal Authority Preconditions. Initial observation is
ticket state/revision and dependency preconditions; the mutation window ends at
transition commit; current state is revalidated there; stale state fails closed
without reopening or mutating the ticket. DOM owns semantics and the physical
CAS/journal owner remains foreign. Evidence: `docs/tickets/SPEC-DOM-001/evidence/TICKET-006/temporal-authority.md`.

## 15. Implementation Constraints

Preserve six-state vocabulary, terminality, exact eight transitions, rejection recording, and linked-ticket history. Never reopen completed tickets.

## 16. Acceptance Criteria

1. Only the six specified states can be created or restored.
2. All eight specified transitions succeed under their conditions.
3. Every other transition, including terminal reopen, rejects and records with
   no state change. `LOCAL_PROVABILITY = YES`.

All criteria are `TESTABLE: YES` and `LOCALLY_PROVABLE: YES` after prerequisites.

## 17. Acceptance / Proof Role

`CONTRIBUTOR: YES` to AC-DOM-052. `LOCAL_ACCEPTANCE_OWNER: YES` and `FINAL_PROOF_OWNER: YES` for AC-DOM-012 and AC-DOM-013. Not final owner of AC-DOM-052.

## 18. Required Tests

`LOCAL_TEST_EVIDENCE`: unit/state-machine/command tests covering the full transition matrix, formal verdict, terminality, continuation links, and recorded rejection. `CONCURRENCY_EVIDENCE`: barrier-controlled concurrent commands produce one winner and one stale loser while duplicate retry is idempotent. `RECOVERY_EVIDENCE`: accepted transition records rehydrate without reopening and forged authorization is rejected.

## 19. Completion Evidence

Executable ticket aggregate and complete transition test matrix with terminal, linked-continuation, stale, recorded-rejection, formal-verdict, accepted-rehydration, concurrency and temporal evidence. `EXPECTED_EVIDENCE_FILES`: `docs/tickets/SPEC-DOM-001/evidence/TICKET-006/AC-DOM-012-states.md`, `AC-DOM-013-transitions.md`, `AC-DOM-012-terminality.md`, `temporal-authority.md`.

## 20. Completion Gate

```text
COMPLETION_GATE:
  production_code: REQUIRED
  automated_tests: REQUIRED
  local_completion_evidence: REQUIRED
  integration_evidence: REQUIRED_AS_LOCAL_CONTRACT_CONTRIBUTION; FOREIGN_PRODUCTIVE_CHECKPOINT_DEFERRED
  legacy_transition_evidence: REQUIRED_FOR_LOCAL_SCOPE; FOREIGN_RETIREMENT_DEFERRED
  conformance_evidence: REQUIRED_FOR_LOCAL_CONTRIBUTION; FINAL_CONFORMANCE_DEFERRED_TO_TICKET-012
  local_closure_boundary: local aggregate and transition evidence is required; foreign mappings are integrated-only
```

## 21. Legacy / Cutover Impact

`NEW_CANONICAL_PATH`; preserve terminal history and do not reopen completed tickets.

## 22. Risks

Operational state leaking into functional state. Mitigation: separate-state tests and transition-table proof.

## 23. Implementation Wave

`WAVE: 5`.

## 24. Parallelization

`SAFE_WITH_COORDINATION`; ready after TICKET-005 and unblocks TICKET-010/012.

## 25. Handoff After Completion

Independent ticket audit may validate this ticket; invalidation and final conformance consume the terminality and transition evidence.

```text
CURRENT_REMAINING_BLOCKERS: NONE locally; structural review, independent implementation audit, and finalization are complete; TICKET-012 is DONE
```

## 26. Ticket Local Closure

`TICKET_LOCAL_CLOSURE = YES`.

## 27. Local Finalization

`FINALIZATION_VERDICT = TICKET_FINALIZED_LOCALLY`.
`FINALIZATION_DATE = 2026-09-16`.
`FINALIZATION_AUTHORITY = docs/tickets/SPEC-DOM-001/DOM-001-TICKET-006-implementation-audit.md`.
`TICKET_STATUS_BEFORE = VALIDATION_REQUIRED`.
`TICKET_STATUS_AFTER = DONE`.
