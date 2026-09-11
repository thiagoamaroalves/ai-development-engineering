# DOM-001-TICKET-004 — Pipeline state machines and provenance reconstruction

## 1. Status

`STATUS: VALIDATION_REQUIRED`
`ISSUE_DECOMPOSITION_READINESS: ISSUE_READY`  
`INITIAL_DAG_STATE: BLOCKED`  
`BLOCKED_BY: NONE`
`CURRENT_DAG_STATE: READY`
`DEPENDS_ON: DOM-001-TICKET-001`  
`UNBLOCKS: DOM-001-TICKET-005, DOM-001-TICKET-006, DOM-001-TICKET-007, DOM-001-TICKET-012`

## 2. Source Traceability

- Accepted ADR authority: `ADR-0002` revision 3, SHA-256 `EF9289C6FCA4BBA73FCA53CA38C71DD19110EB1CFE948358A7CCA1FE14E177D9` — canonical pipeline order, separate state machines, and provenance reconstruction.
- Portfolio: `docs/specs/SPEC-PORTFOLIO-001-organization.md` — O-009, O-010.
- Component SPEC: `docs/specs/SPEC-DOM-001-workflow-authority-and-governance.md` — DOM-PIPE-001, DOM-STATE-001.
- Gap Matrix: `docs/specs/gap-matrices/SPEC-DOM-001-implementation-gap-matrix.md` — GAP-010.
- Gap Matrix Audit: `docs/specs/gap-matrices/audits/SPEC-DOM-001-implementation-gap-matrix-audit.md`.
- Implementation Plan: `docs/specs/implementation-plans/SPEC-DOM-001-implementation-plan.md` — DOM-IMP-04.
- Plan Audit: `docs/specs/implementation-plans/audits/SPEC-DOM-001-implementation-plan-audit.md`.

## 3. Authority / Scope

Approved owner: DOM `CANONICAL_OWNER`. Primary owning specification/domain: `SPEC-DOM-001`. Local ownership covers pipeline ordering, separate aggregate state machines, derivation, and projection boundaries. Foreign capabilities consumed: downstream state mappings only; no foreign operational state is implemented.

## 4. Portfolio Obligation Coverage

`O-009` canonical pipeline ordering; `O-010` separate state machines and derived higher states.

## 5. Gap / Requirement / Acceptance Coverage

Gap: `GAP-010`. Requirements: `DOM-PIPE-001`, `DOM-STATE-001`. Local acceptance: `AC-DOM-009`, `AC-DOM-010`. Integrated contribution: `AC-DOM-052`; final owner TICKET-012.

## 6. Implementation Unit

`DOM-IMP-04 — Pipeline state machines and provenance reconstruction`. Formation reason: `SHARED_INVARIANT + SHARED_PERSISTENCE_BOUNDARY`. No split or merge.

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

`src/domain/pipeline.ts`, `src/application/pipeline.ts`, and `tests/dom-001-ticket-004.test.ts`. Reuse ordered pipeline/CAS semantics; replace scalar later-state rehydration.

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

`DOM-001-TICKET-001` is completed and the canonical identity contract is available. No external blocker exists.

## 14a. Authority Consumption Proof

| Field | Proof |
|---|---|
| Proof ID / authority existence | `ACP-DOM-04`; `YES` — `ADR-0002` revision 3, SHA-256 `EF9289C6FCA4BBA73FCA53CA38C71DD19110EB1CFE948358A7CCA1FE14E177D9`. |
| Scoped decision / truth owner | `ADR0002-D001`, `ADR0002-D002`; DOM owns phase order, state-machine separation, and reconstruction meaning. |
| Semantic source | `DOM-PIPE-001`, `DOM-STATE-001`; `GAP-010`. |
| Consumed interface / returned data | Ordered transition/replay port; returns canonical stage state and complete predecessor/revision provenance. |
| Revision/version transport | Each transition carries predecessor identity, revision, order, and immutable provenance. |
| Failure / stale semantics | Skip, duplicate/out-of-order, forged predecessor, revision divergence, missing predecessor, or snapshot mismatch rejects with no mutation. |
| Productive availability / evidence | `YES` for local state-machine/reconstruction boundary and deterministic replay fixture; PLAT physical replay remains a non-blocking integration seam. Evidence: `T4-AC1`–`T4-AC3`. |
| Result | `AUTHORITY_CONSUMABLE`. |

## 14b. Producer / Consumer Contract Proof

| Field | Proof |
|---|---|
| Contract / producer / consumer | `PCP-PLAT-04`; PLAT produces ordered append-only records and integrity/replay results; DOM consumes them and validates semantic continuity. |
| Interface / input / returned data | Replay/provenance interface; input is ordered transition record plus expected predecessor/revision; output is reconstructed state or canonical rejection. |
| Revision/version transport | Record order, predecessor identity, stage identity, and revision are carried unchanged through replay. |
| Failure / not-found / stale | Missing record, skip, duplicate, out-of-order, forged predecessor, revision divergence, and final snapshot mismatch reject without mutation. |
| Availability / local proof boundary | Local replay fixture and state-machine contract are available for execution; physical PLAT replay is an integration checkpoint. |
| Evidence / result | `T4-AC1`–`T4-AC3` direct recovery, negative, isolation, and concurrency/recovery witnesses; PRODUCER_CONSUMER_CONTRACT: PROVEN_LOCAL_FIXTURE, RESULT: CONTRACT_DEFINED_LOCAL_WITNESS_ONLY. |

### Capability Availability Reconciliation

APPLICABLE_SHARED_CAPABILITY_RECORDS: CAP-PLAT-SNAPSHOT-PIPELINE-PROVENANCE.
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
`PRODUCER_CONSUMER_CONTRACT_PROOF_FIELDS`: `PRODUCER = SPEC-PLAT-001`;
`PRODUCED_CONTRACT = ordered append-only transition records and integrity/replay
result`; `AUTHORITY_OWNER = SPEC-DOM-001`; `CONSUMER = TICKET-004`;
`CONSUMED_CAPABILITY = replay/provenance input and integrity result`;
`AVAILABILITY_CONDITION = local replay fixture available; physical PLAT replay
is an integration checkpoint`; `DEPENDENCY_EDGE = PLAT provenance/replay →
TICKET-004 reconstruction`; `PROOF_EVIDENCE =
docs/tickets/SPEC-DOM-001/evidence/TICKET-004/AC-DOM-009-provenance.md`.

## 14c. ACCEPTANCE_WITNESS_MATRIX

| AC | Normative behavior / verb | Concrete operation | State/transition | Direct positive test | Direct negative/isolation test | Expected evidence | Acceptance owner |
|---|---|---|---|---|---|---|---|
| AC-DOM-009 | Enforce canonical phase order and initial creation | pipeline create/advance command | ordered pipeline stage | `T4-AC1-P` valid initial creation and next-stage advance | `T4-AC1-N` later-stage creation or phase skip rejects with unchanged state | `docs/tickets/SPEC-DOM-001/evidence/TICKET-004/AC-DOM-009-order.md` | TICKET-004 |
| AC-DOM-009 | Rehydrate complete immediate-transition provenance | pipeline rehydrate command | ordered stage chain recovery | `T4-AC2-P` valid chain recovers exact later state | `T4-AC2-N` missing predecessor, skip, duplicate/order, forged predecessor, revision or snapshot mismatch rejects | `docs/tickets/SPEC-DOM-001/evidence/TICKET-004/AC-DOM-009-rehydration.md` | TICKET-004 |
| AC-DOM-010 | Keep aggregate state machines separate | state transition/query command | independent aggregate states | `T4-AC3-P` independent derivation and concurrent queries | `T4-AC3-N` combined-state or cross-aggregate mutation rejects; restart preserves separation | `docs/tickets/SPEC-DOM-001/evidence/TICKET-004/AC-DOM-010-isolation.md` | TICKET-004 |

`TEMPORAL_AUTHORITY_PROOF: NOT_APPLICABLE` — Plan `DOM-IMP-04` classifies the
rehydration input as a single immutable candidate. The ticket independently
validates the complete chain and final snapshot before materialization and
fails closed on inconsistency; no mutable external authority is committed.

## 15. Implementation Constraints

No stage may declare a later stage complete; projections/transports cannot create canonical transitions; aggregate states remain separate.

## 16. Acceptance Criteria

1. Valid chain rehydrates the exact later state.
2. Missing predecessor, skip, duplicate/out-of-order, revision divergence,
   identity mismatch, and forged later state are rejected with no mutation.
3. Separate aggregate state machines cannot be combined into an implicit
   transition. `LOCAL_PROVABILITY = YES`.

All criteria are `TESTABLE: YES` and `LOCALLY_PROVABLE: YES` after prerequisite.

## 17. Acceptance / Proof Role

`CONTRIBUTOR: YES` to AC-DOM-052. `LOCAL_ACCEPTANCE_OWNER: YES` and `FINAL_PROOF_OWNER: YES` for AC-DOM-009 and AC-DOM-010. Not final owner of AC-DOM-052.

## 18. Required Tests

`LOCAL_TEST_EVIDENCE`: unit/state-machine/application tests for stage boundaries, prohibited bypass, independent transitions, derivation, and stale projection commands. `CONCURRENCY_EVIDENCE`: concurrent independent aggregate queries/transitions prove no combined state. `RECOVERY_EVIDENCE`: valid-chain restart plus missing/forged/divergent provenance rejection.

## 19. Completion Evidence

Executable ordered pipeline/state authority and negative tests for bypass and implicit combined states. `EXPECTED_EVIDENCE_FILES`: `docs/tickets/SPEC-DOM-001/evidence/TICKET-004/AC-DOM-009-order.md`, `AC-DOM-009-rehydration.md`, `AC-DOM-010-isolation.md`.

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

## 27. Implementation Execution

```text
INITIAL_STATUS: READY
FINAL_STATUS: VALIDATION_REQUIRED
IMPLEMENTATION_VERDICT: IMPLEMENTATION_BATCH_COMPLETE
IMPLEMENTATION_BASELINE: 646f5c67ffe0cdd9e0abeb9df0489ecb4f4a3b24
PRODUCTION_IMPLEMENTATION_PRESENT_AT_BASELINE: YES
PRODUCTION_FILES_MODIFIED_THIS_BATCH: 0
TEST_FILES_MODIFIED_THIS_BATCH: 1
EVIDENCE_FILES_ADDED_THIS_BATCH: 3
```

The production implementation was present in the authorized repository
baseline. This execution completed the local implementation evidence for
T004, including direct concurrency coverage in the repository fixture and
the three acceptance-evidence records:

- `evidence/TICKET-004/AC-DOM-009-order.md`
- `evidence/TICKET-004/AC-DOM-009-rehydration.md`
- `evidence/TICKET-004/AC-DOM-010-isolation.md`

Validation commands and results:

```text
prototype/node_modules/.bin/tsx.cmd --test tests/dom-001-ticket-004.test.ts
11 passed, 0 failed

prototype/node_modules/.bin/tsx.cmd --test tests/dom-001-ticket-001.test.ts tests/dom-001-ticket-002.test.ts
31 passed, 0 failed
```

The next gate is the independent structural review followed by the
independent implementation audit. No `DONE` transition is asserted here.
