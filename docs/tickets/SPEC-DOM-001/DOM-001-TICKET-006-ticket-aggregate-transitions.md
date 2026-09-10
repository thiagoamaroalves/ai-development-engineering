# DOM-001-TICKET-006 — Ticket states and functional transitions

## 1. Status

`STATUS: BLOCKED`  
`ISSUE_DECOMPOSITION_READINESS: ISSUE_READY`  
`INITIAL_DAG_STATE: BLOCKED`  
`BLOCKED_BY: DOM-001-TICKET-004, DOM-001-TICKET-005`  
`DEPENDS_ON: DOM-001-TICKET-004, DOM-001-TICKET-005`  
`UNBLOCKS: DOM-001-TICKET-010, DOM-001-TICKET-012`

## 2. Source Traceability

- Accepted ADR authority: `ADR-0002` revision 3, SHA-256 `EF9289C6FCA4BBA73FCA53CA38C71DD19110EB1CFE948358A7CCA1FE14E177D9` — ticket states, transition table, terminality, and continuation linkage.
- Portfolio: `docs/specs/SPEC-PORTFOLIO-001-organization.md` — O-012, O-013.
- Component SPEC: `docs/specs/SPEC-DOM-001-workflow-authority-and-governance.md` — DOM-TICKET-001, DOM-TICKET-002.
- Gap Matrix: `docs/specs/gap-matrices/SPEC-DOM-001-implementation-gap-matrix.md` — GAP-014, GAP-015.
- Gap Matrix Audit: `docs/specs/gap-matrices/audits/SPEC-DOM-001-implementation-gap-matrix-audit.md`.
- Implementation Plan: `docs/specs/implementation-plans/SPEC-DOM-001-implementation-plan.md` — DOM-IMP-06.
- Plan Audit: `docs/specs/implementation-plans/audits/SPEC-DOM-001-implementation-plan-audit.md`.

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

No productive ticket aggregate was found; prototype ticket/DAG scenarios are non-authoritative references. Add the productive six-state aggregate and complete transition/rejection tests.

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

## 14a. Authority Consumption Proof

| Field | Proof |
|---|---|
| Proof ID / authority existence | `ACP-DOM-06`; `YES` — `ADR-0002` revision 3, SHA-256 `EF9289C6FCA4BBA73FCA53CA38C71DD19110EB1CFE948358A7CCA1FE14E177D9`. |
| Scoped decision / truth owner | `ADR0002-D004`; DOM owns six ticket states, eight valid transitions, terminality, and rejection. |
| Semantic source | `DOM-TICKET-001`, `DOM-TICKET-002`; `GAP-014`, `GAP-015`. |
| Consumed interface / returned data | Ticket aggregate transition port; returns state, valid transition result, terminality, and linked continuation reference. |
| Revision/version transport | Ticket identity, predecessor state, transition ID, and aggregate revision are recorded atomically. |
| Failure / stale semantics | Invalid edge, unknown state, terminal mutation, missing continuation, duplicate, or stale revision rejects without partial transition. |
| Productive availability / evidence | `YES` for local aggregate and transition matrix; EXEC outcome mapping is a non-blocking consumer. Evidence: `T6-AC1`–`T6-AC3`. |
| Result | `AUTHORITY_CONSUMABLE`. |

## 14b. Producer / Consumer Contract Proof

| Field | Proof |
|---|---|
| Contract / producer / consumer | `PCP-EXEC-02`; DOM produces canonical ticket state, EXEC-002 consumes it and returns execution outcomes without lifecycle authority. |
| Interface / input / returned data | Ticket transition interface; input is current state plus command/revision; output is next canonical state or rejection. |
| Revision/version transport | Aggregate revision and transition correlation are returned with execution outcome. |
| Failure / not-found / stale | Unknown ticket/state, invalid edge, terminal mutation, duplicate, or stale revision is rejected and recorded with no effect. |
| Availability / local proof boundary | Local aggregate contract and EXEC deterministic consumer fixture are available; EXEC runtime is not a prerequisite for local closure. |
| Evidence / result | `T6-AC1`–`T6-AC3` direct transition, terminality, and concurrency/idempotency witnesses; PRODUCER_CONSUMER_CONTRACT: PROVEN_LOCAL_FIXTURE, RESULT: CONTRACT_DEFINED_LOCAL_WITNESS_ONLY. |

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

## 14c. ACCEPTANCE_WITNESS_MATRIX
`PRODUCER_CONSUMER_CONTRACT_PROOF_FIELDS`: `PRODUCER = SPEC-EXEC-002`;
`PRODUCED_CONTRACT = execution outcome consumption without lifecycle authority`;
`AUTHORITY_OWNER = SPEC-DOM-001`; `CONSUMER = TICKET-006`;
`CONSUMED_CAPABILITY = canonical ticket state and transition result`;
`AVAILABILITY_CONDITION = local aggregate and deterministic EXEC consumer fixture
available`; `DEPENDENCY_EDGE = TICKET-006 canonical state → EXEC-002 outcome
consumer`; `PROOF_EVIDENCE = docs/tickets/SPEC-DOM-001/evidence/TICKET-006/AC-DOM-012-states.md`.

## 14c. ACCEPTANCE_WITNESS_MATRIX

| AC | Normative behavior / verb | Concrete operation | State/transition | Direct positive test | Direct negative/isolation test | Expected evidence | Acceptance owner |
|---|---|---|---|---|---|---|---|
| AC-DOM-012 | Accept exact six-state ticket aggregate | ticket create/rehydrate command | ticket lifecycle state | `T6-AC1-P` all six valid state fixtures rehydrate | `T6-AC1-N` unknown/forged state rejects | `docs/tickets/SPEC-DOM-001/evidence/TICKET-006/AC-DOM-012-states.md` | TICKET-006 |
| AC-DOM-013 | Execute exactly eight transitions | ticket transition command | allowed transition edge | `T6-AC2-P` complete eight-edge matrix | `T6-AC2-N` invalid edge, duplicate, or stale transition rejects | `docs/tickets/SPEC-DOM-001/evidence/TICKET-006/AC-DOM-013-transitions.md` | TICKET-006 |
| AC-DOM-012 / AC-DOM-013 | Require linked continuation; reject terminal mutation | continuation/transition command | terminal and successor state | `T6-AC3-P` linked continuation succeeds and concurrent valid work remains independent | `T6-AC3-N` completed/cancelled mutation or unlinked continuation rejects; retry is idempotent | `docs/tickets/SPEC-DOM-001/evidence/TICKET-006/AC-DOM-012-terminality.md` | TICKET-006 |

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

`LOCAL_TEST_EVIDENCE`: unit/state-machine/command tests covering the full transition matrix, terminality, continuation links, and rejection. `CONCURRENCY_EVIDENCE`: concurrent valid work remains independent and duplicate transition/retry is idempotent. `RECOVERY_EVIDENCE`: terminal and linked-continuation records rehydrate without reopening.

## 19. Completion Evidence

Executable ticket aggregate and complete transition test matrix with terminal and linked-continuation evidence. `EXPECTED_EVIDENCE_FILES`: `docs/tickets/SPEC-DOM-001/evidence/TICKET-006/AC-DOM-012-states.md`, `AC-DOM-013-transitions.md`, `AC-DOM-012-terminality.md`, `temporal-authority.md`.

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
