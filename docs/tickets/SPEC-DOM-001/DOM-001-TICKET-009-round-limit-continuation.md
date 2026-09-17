# DOM-001-TICKET-009 — Round limit and continuation authorization

## 1. Status

`STATUS: DONE`
`ISSUE_DECOMPOSITION_READINESS: ISSUE_READY`
`INITIAL_DAG_STATE: BLOCKED`
`BLOCKED_BY: NONE`
`CURRENT_DAG_STATE: DONE`
`RELEASE_WAVE: WAVE-6 / 2026-09-16`
`DEPENDS_ON: DOM-001-TICKET-008`
`UNBLOCKS: DOM-001-TICKET-012`

## 2. Source Traceability

- Accepted ADR authority: `ADR-0009` revision 3, SHA-256 `4AB502AEA4F09AFE2C5FA33BFB6C5EE0D11E2D8F9AF65F244209CE1FAC935761` — configurable round limit, affected-unit pause, and explicit continuation.
- Portfolio: `docs/specs/SPEC-PORTFOLIO-001-organization.md` — O-051.
- Component SPEC: `docs/specs/SPEC-DOM-001-workflow-authority-and-governance.md` — DOM-AUDIT-003.
- Gap Matrix: `docs/specs/gap-matrices/SPEC-DOM-001-implementation-gap-matrix.md` — GAP-019.
- Gap Matrix Audit: `docs/specs/gap-matrices/audits/SPEC-DOM-001-implementation-gap-matrix-audit.md`.
- Implementation Plan: `docs/specs/implementation-plans/SPEC-DOM-001-implementation-plan.md` — SHA-256 `C57D24FEC7CF69BED3EC354C4334DE698AFC54722FD7EDA6F2D3D6353FF35C33`; DOM-IMP-09.
- Plan Audit: `docs/specs/implementation-plans/audits/SPEC-DOM-001-implementation-plan-audit-2026-09-11-reaudit-002.md` — SHA-256 `474E33C3FD17F8790FBB2CD2A39C9670A33D0830FF851C8D06DE31CA6BFB9695`; `READY_FOR_ISSUE_DECOMPOSITION`.

## 3. Authority / Scope

Approved owner: DOM `CANONICAL_OWNER`. Primary owning specification/domain: `SPEC-DOM-001`. Local ownership covers configurable round limit, affected-unit pause, and explicit continuation authorization. Foreign capabilities consumed: execution, scheduling, assignment, and transport contracts, non-blocking.

## 4. Portfolio Obligation Coverage

`O-051` configurable ten-round limit, local pause, and explicit continuation authorization.

## 5. Gap / Requirement / Acceptance Coverage

Gap: `GAP-019`. Requirement: `DOM-AUDIT-003`. Local acceptance: `AC-DOM-051`. Integrated contribution: `AC-DOM-052`; final owner TICKET-012.

## 6. Implementation Unit

`DOM-IMP-09 — Round limit and continuation authorization`. Formation reason: `SHARED_INVARIANT`. No split or merge.

## 7. Goal

Enforce the configurable ten-round limit, affected-unit pause, and explicit authorization for the next round.

## 8. Validated Implementation Delta

`OBSERVED`: mock round 10 and authorization command.  
`REQUIRED`: productive configurable limit, local pause, and one explicit continuation record.  
`DELTA`: no productive round policy.

## 9. Required Behavior

Pause only the affected unit at the limit and reject the next round until explicit authorization. Provide a deterministic gate to execution/scheduling.

## 10. Does Not Implement

Scheduler capacity, assignment/session creation, audit execution, or transport.

## 11. Repository Evidence

No productive round symbols; prototype round scenarios are non-authoritative references. Add the local round policy and continuation command.

## 12. Expected Repository Impact

Production code: audit-cycle policy and command boundary.  
Persistence/schema: authorization record seam only.  
Integration: deterministic execution/scheduling gate.  
Tests: tenth-round, isolation, duplicate authorization, recovery/restart, concurrency, and regression tests.  
Legacy/cutover: new canonical path preserving round history.  
Generated contracts: continuation authorization record.

## 13. Dependencies

Internal: `DOM-001-TICKET-008`. Cross-SPEC scheduler/execution contracts are non-blocking.

## 14. Blocking Conditions

Blocked until TICKET-008 provides explicit cycle/verdict identity. No external blocker exists.

## 14a. Authority Consumption Proof

| Field | Proof |
|---|---|
| Proof ID / authority existence | `ACP-DOM-09`; `YES` — `ADR-0009` revision 3, SHA-256 `4AB502AEA4F09AFE2C5FA33BFB6C5EE0D11E2D8F9AF65F244209CE1FAC935761`. |
| Scoped decision / truth owner | `ADR0009-D003`; DOM owns the configurable limit, affected-unit pause, and explicit continuation authorization. |
| Semantic source | `DOM-AUDIT-003`; `GAP-019`. |
| Consumed interface / returned data | Round record/continuation command port; returns affected-unit pause or exact authorized next-round identity. |
| Revision/version transport | Cycle, unit, round number, and continuation authorization revision are correlated and single-use. |
| Failure / not-found / stale semantics | Wrong cycle/unit, implicit continuation, duplicate authorization, stale authorization, or unrelated-unit pause rejects. |
| Productive availability / evidence | `YES` for local round policy and deterministic scheduler consumer fixture; EXEC scheduling is foreign and non-blocking. Evidence: `T9-AC1`–`T9-AC2`. |
| Result | `AUTHORITY_DEFINED_BUT_NOT_CONSUMABLE` for integrated-only EXEC capability; local contract witness only. |

## 14b. Producer / Consumer Contract Proof

| Field | Proof |
|---|---|
| Contract / producer / consumer | `PCP-EXEC-05`; DOM produces pause/continuation decision; EXEC-002 consumes it for scheduling and cannot create round authority. |
| Interface / input / returned data | Scheduling handoff interface; input is canonical unit/cycle/round decision; output is acknowledgment or execution outcome, never a new authorization. |
| Revision/version transport | Round and authorization IDs are preserved through the scheduling handoff. |
| Failure / not-found / stale | Missing, duplicate, stale, wrong-unit, or wrong-cycle authorization is rejected and cannot start another round. |
| Availability / local proof boundary | Local policy and deterministic scheduler fixture are available; live scheduler is not a prerequisite for local closure. |
| Evidence / result | `T9-AC1`–`T9-AC2` tenth-round, isolation, recovery, and concurrency witnesses; PRODUCER_CONSUMER_CONTRACT: PROVEN_LOCAL_FIXTURE, RESULT: CONTRACT_DEFINED_LOCAL_WITNESS_ONLY. |

### Capability Availability Reconciliation

APPLICABLE_SHARED_CAPABILITY_RECORDS: CAP-EXEC-EXACT-VERSION-BASIS (PCP-EXEC-05).
RECONCILIATION_SOURCE: README section 11.1 and current Plan section 12.1.
AUTHORITY_STATUS = DEFINED; CONTRACT_STATUS = DEFINED; LOCAL_TESTABILITY = NO;
PRODUCTIVE_AVAILABILITY = NO; DEPENDENCY_CLASS = REQUIRED_FOR_INTEGRATED_PROOF.
BLOCKING_EFFECT: no local execution or local-closure block; integrated proof
only. Local fixture evidence is contract-level only. Complete owner, producer,
consumer, contract, failure semantics, version transport, and availability
evidence are preserved in README section 11.1. The listed shared capability is
required only for integrated proof and does not block local execution or local
closure.
NO_DOWNSTREAM_CAPABILITY_PROMOTION_WITHOUT_NEW_EVIDENCE = TRUE.

### Acceptance witness context
`PRODUCER_CONSUMER_CONTRACT_PROOF_FIELDS`: `PRODUCER = SPEC-EXEC-002`;
`PRODUCED_CONTRACT = scheduling acknowledgment and execution outcome`;
`AUTHORITY_OWNER = SPEC-DOM-001`; `CONSUMER = TICKET-009`;
`CONSUMED_CAPABILITY = pause/continuation scheduling handoff`;
`AVAILABILITY_CONDITION = local policy and deterministic scheduler fixture
available; live scheduler is foreign`; `DEPENDENCY_EDGE = TICKET-009 pause/
continuation decision → EXEC-002 scheduler`; `PROOF_EVIDENCE =
docs/tickets/SPEC-DOM-001/evidence/TICKET-009/AC-DOM-051-rounds.md`.

## 14c. ACCEPTANCE_WITNESS_MATRIX

| NORMATIVE_BEHAVIOR | NORMATIVE_VERB | CONCRETE_OPERATION_COMMAND_OR_QUERY | STATE_OR_TRANSITION_AFFECTED | DIRECT_POSITIVE_TEST | DIRECT_NEGATIVE_OR_ISOLATION_TEST | EXPECTED_EVIDENCE_FILE | EVIDENCE_TYPE | ACCEPTANCE_OWNER | REQUIRED_PRODUCER_OR_CAPABILITY | AUTHORITY_STATUS | CONTRACT_STATUS | LOCAL_TESTABILITY | PRODUCTIVE_AVAILABILITY | CAPABILITY_SUMMARY_STATUS | DEPENDENCY_CLASS | WITNESS_EXECUTABLE_AT_LOCAL_CLOSURE |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Round limit | counts and pauses at ten | record round command | affected-unit pause | `T9-AC1-P` tenth-round pause test | `T9-AC1-N` ninth/elevated round or cross-unit pause rejects; unrelated unit continues | `docs/tickets/SPEC-DOM-001/evidence/TICKET-009/AC-DOM-051-pause.md` | LOCAL_TEST_EVIDENCE | TICKET-009 | none — local DOM round policy | DEFINED | DEFINED | YES | YES | CONTRACT_PRODUCTIVELY_AVAILABLE | LOCAL_IMPLEMENTATION | YES |
| Continuation authorization | authorizes explicitly | continuation command | next-round authorization | `T9-AC2-P` explicit authorized continuation after recovery | `T9-AC2-N` implicit, duplicate, wrong-cycle, or stale authorization rejects; retry idempotent | `docs/tickets/SPEC-DOM-001/evidence/TICKET-009/AC-DOM-051-continuation.md` | LOCAL_TEST_EVIDENCE | TICKET-009 | none — local continuation authorization | DEFINED | DEFINED | YES | YES | CONTRACT_PRODUCTIVELY_AVAILABLE | LOCAL_IMPLEMENTATION | YES |

### Temporal Authority Proof

`TEMPORAL_AUTHORITY_PROOF: PRESERVED_FROM_PLAN`; source: Plan `DOM-IMP-09`
Temporal Authority Preconditions. Initial observation is exact
cycle/revision, round count, and continuation authorization; the mutation window
ends at resume; revalidation at resume detects mismatch and fails closed. DOM
owns the continuation decision and EXEC consumes it without creating authority.
Evidence: `docs/tickets/SPEC-DOM-001/evidence/TICKET-009/temporal-authority.md`.

## 15. Implementation Constraints

Ten is the configurable initial limit; pause is unit-local; continuation is explicit, singular, and auditable.

## 16. Acceptance Criteria

1. The tenth round pauses only its affected unit.
2. A following round requires explicit continuation authorization and cannot
   be inferred from process termination or an unrelated unit. `LOCAL_PROVABILITY = YES`.

All criteria are `TESTABLE: YES` and `LOCALLY_PROVABLE: YES` after prerequisite.

## 17. Acceptance / Proof Role

`CONTRIBUTOR: YES` to AC-DOM-052. `LOCAL_ACCEPTANCE_OWNER: YES` and `FINAL_PROOF_OWNER: YES` for AC-DOM-051. Not final owner of AC-DOM-052.

## 18. Required Tests

`LOCAL_TEST_EVIDENCE`: unit/command tests for configurable tenth-round pause and explicit continuation. `CONCURRENCY_EVIDENCE`: affected-unit pause does not pause unrelated units; duplicate authorization is idempotent. `RECOVERY_EVIDENCE`: authorized round restart preserves cycle/unit/round identity and rejects stale authorization.

## 19. Completion Evidence

Configurable policy; pause/authorization record; and isolation/duplicate tests. `EXPECTED_EVIDENCE_FILES`: `docs/tickets/SPEC-DOM-001/evidence/TICKET-009/AC-DOM-051-pause.md`, `AC-DOM-051-continuation.md`, `temporal-authority.md`.

## 20. Completion Gate

```text
COMPLETION_GATE:
  production_code: REQUIRED
  automated_tests: REQUIRED
  local_completion_evidence: REQUIRED
  integration_evidence: REQUIRED_AS_LOCAL_CONTRACT_CONTRIBUTION; FOREIGN_PRODUCTIVE_CHECKPOINT_DEFERRED
  legacy_transition_evidence: REQUIRED_FOR_LOCAL_SCOPE; FOREIGN_RETIREMENT_DEFERRED
  conformance_evidence: REQUIRED_FOR_LOCAL_CONTRIBUTION; FINAL_CONFORMANCE_DEFERRED_TO_TICKET-012
  local_closure_boundary: local round/continuation evidence is required; scheduler execution is integrated-only
```

## 21. Legacy / Cutover Impact

`NEW_CANONICAL_PATH`; preserve prior cycle/round history.

## 22. Risks

Global pause or implicit continuation. Mitigation: unit-isolation and explicit authorization assertions.

## 23. Implementation Wave

`WAVE: 6`.

## 24. Parallelization

`SAFE_WITH_COORDINATION`; blocked by TICKET-008 and unblocks TICKET-012.

## 25. Handoff After Completion

Independent ticket audit may validate this ticket; its round policy evidence is consumed by final conformance.

## 26. Ticket Local Closure

`TICKET_LOCAL_CLOSURE = YES`.

## 27. Implementation Execution Record

```text
INITIAL_STATUS: READY
FINAL_STATUS: DONE
IMPLEMENTATION_DESIGN: docs/tickets/SPEC-DOM-001/DOM-001-TICKET-009-implementation-design.md
IMPLEMENTATION_DESIGN_GATE: READY_FOR_IMPLEMENTATION
IMPLEMENTATION_STRUCTURAL_SELF_CHECK: PASS
ACCEPTANCE_CRITERIA: 2/2 SATISFIED
COMPLETION_EVIDENCE: PRESENT
CHANGED_PRODUCTION_FILES: src/domain/round-continuation.ts; src/application/round-continuation.ts
CHANGED_TEST_FILES: tests/dom-001-ticket-009.test.ts
CHANGED_EVIDENCE_FILES: docs/tickets/SPEC-DOM-001/evidence/TICKET-009/
FOCUSED_TESTS: 5 passed, 0 failed
FULL_PRODUCTIVE_SUITE_AFTER_BATCH: 132 passed, 0 failed
PROTOTYPE_SUITE_AFTER_BATCH: 92 passed, 0 failed
SOURCE_TYPECHECK: PASS
IMPLEMENTATION_TIME_REMAINING_BLOCKERS: NONE locally; independent structural review and implementation audit required
IMPLEMENTATION_TIME_UNBLOCKS: TICKET-012 remained gated until T009/T010/T011 were finalized
```

## 28. Structural Review Record

```text
CURRENT_REMAINING_BLOCKERS: NONE locally; structural review, independent implementation audit, and finalization are complete; TICKET-012 is DONE
CURRENT_UNBLOCKS: TICKET-012; finalization releases this prerequisite edge


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
UNJUSTIFIED_COMPONENT_COLLAPSES: 0
UNPLANNED_STRUCTURAL_COMPONENTS: 0
MISSING_REQUIRED_COMPONENTS: 0
UNJUSTIFIED_SOLID_VIOLATIONS: 0
DEPENDENCY_DIRECTION_VIOLATIONS: 0
INFRASTRUCTURE_LEAKAGE_POINTS: 0
DOMAIN_RULE_DUPLICATION: 0
IMPLEMENTATION_STRUCTURAL_SELF_CHECK: PASS
FOCUSED_STRUCTURAL_REVIEW_TESTS: 5 passed, 0 failed
REVIEW_CORRECTIONS: decision/action consistency; temporal second cycle observation; mapper pause authorization guard
```

## 29. Finalization Record

```text
FINALIZATION_VERDICT: TICKET_FINALIZED_LOCALLY
FINALIZATION_DATE: 2026-09-16
TICKET_STATUS_BEFORE: VALIDATION_REQUIRED
TICKET_STATUS_AFTER: DONE
LOCAL_TICKET_DONE_ALLOWED: YES
TICKET_GATE: READY_FOR_DONE
OPEN_INTEGRATED_FINDINGS: 0
INTEGRATED_HANDOFFS_COMPLETE: YES
AUDIT_ARTIFACT_IMMUTABILITY: REQUIRED
FINALIZATION_ARTIFACT: docs/tickets/SPEC-DOM-001/evidence/TICKET-009/finalization-2026-09-16.md
```
