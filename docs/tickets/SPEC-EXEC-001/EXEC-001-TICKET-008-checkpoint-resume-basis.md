# EXEC-001-TICKET-008 — Safe checkpoint and resume-basis declaration

## 1. Status

`STATUS: BLOCKED`

```text
ISSUE_DECOMPOSITION_READINESS: ISSUE_READY
INITIAL_DAG_STATE: BLOCKED
EXECUTION_READY: FALSE
BLOCKED_BY: EXEC-001-TICKET-006
DEPENDS_ON: EXEC-001-TICKET-006
UNBLOCKS: NONE
```

## 2. Source Traceability

ADR `ADR-0003`; Portfolio `O-021`; SPEC `EXEC-MANIFEST-002`; Gap Matrix `GAP-013`; Plan `EXEC-IMP-08`; Plan Audit `IMPLEMENTATION_PLAN_CONFORMANT`. Baseline paths/hashes are in README §2.

## 3. Authority / Scope

`EXEC-001 / CANONICAL_OWNER` owns safe checkpoint declaration and exact resume-basis contract. `SPEC-EXEC-002` applies context; `SPEC-PLAT-001` persists/replays physically. No session or recovery ownership transfers here.

## 4. Portfolio Obligation Coverage

`O-021` — safe checkpoint and resumable basis declaration.

## 5. Gap / Requirement / Acceptance Coverage

`GAP-013`; `EXEC-MANIFEST-002`; `AC-EXEC-014`; final proof owner: this ticket.

## 6. Implementation Unit

`EXEC-IMP-08 — Safe checkpoint and resume-basis declaration`; 1:1; no split/merge.

## 7. Goal

Make safe checkpoints and exact resume basis explicit while preserving EXEC-002 context and PLAT replay ownership.

## 8. Validated Implementation Delta

`OBSERVED`: no productive checkpoint declaration or resume-basis surface; prototype data is transient. `REQUIRED`: declared checkpoint and basis, with absent basis unable to authorize resume. `DELTA`: declaration contract is absent.

## 9. Required Behavior

1. Declare a safe checkpoint and exact resume basis in the manifest/contract.
2. Reject resume authorization when declaration or basis is absent; do not treat transient text/session memory as authority.

## 10. Does Not Implement

Session/assignment creation; scheduler; physical persistence/recovery; retry policy; lifecycle transitions; effects; UI/OPS mapping.

## 11. Repository Evidence

Only prototype checkpoint-shaped data exists. No productive checkpoint contract or recovery surface is present.

## 12. Expected Repository Impact

Production: checkpoint/resume declaration boundary. Persistence/schema: basis contract seam; no physical mechanism. Integration: EXEC-002 context and PLAT replay. Tests: declaration, complete basis, absent declaration/basis, transient-text rejection and handoff contract. Legacy/cutover: `HISTORICAL_REPLAY`; changed basis requires new attempt. Generated contracts: checkpoint/basis fields.

## 13. Dependencies

Internal: TICKET-006. Foreign `EXEC2-EXEC-RESUME-CONTEXT` is `REQUIRED_FOR_INTEGRATED_PROOF`, not a local blocker. PLAT physical replay remains a downstream integrated checkpoint boundary and is not a capability consumed by this declaration ticket.

## 14. Blocking Conditions

Blocked only by TICKET-006. Foreign context/replay availability is integrated-only.

## 14a. Authority Consumption Proof

```text
PROOF_ID = ACP-EXEC-08
AUTHORITY_EXISTENCE = YES; EXEC-MANIFEST-002 and O-025/PLAT boundary
TRUTH_OWNER = EXEC-001 for declaration; EXEC-002 for context; PLAT for physical replay
CONSUMER_CONTRACT = safe checkpoint and exact resume basis
LOCAL_TESTABILITY = YES via local declaration fixture
PRODUCTIVE_AVAILABILITY = NO for foreign producers
DEPENDENCY_CLASS = REQUIRED_FOR_INTEGRATED_PROOF
BLOCKING_EFFECT = integrated proof only; TICKET-006 is local blocker
CAPABILITY_SUMMARY_STATUS = CONTRACT_DEFINED for unavailable EXEC-002 producer; local declaration fixture is contract-testable
RESULT = AUTHORITY_CONSUMPTION_GAP for unavailable productive EXEC-002 producer; local fixture proves declaration semantics only
```

## 14b. Producer / Consumer Contract Proof

| Capability | Producer/owner | Consumer | Contract | Dimensions | Class | Failure/version behavior |
|---|---|---|---|---|---|---|
| EXEC2-EXEC-RESUME-CONTEXT | EXEC-002 context applicator | T008 | applies declared basis between sessions | DEFINED/DEFINED/NO/NO | REQUIRED_FOR_INTEGRATED_PROOF | missing/stale basis cannot authorize context |
| UNIT-EXEC-CHECKPOINT-FIXTURE | local fixture / EXEC-001 | T008 | declaration and rejection inputs | DEFINED/DEFINED/YES/NO | INFORMATIONAL | local contract evidence only |

`AVAILABILITY_CONDITION = EXEC-002 context producer is required at the integrated resume proof; PLAT physical replay is a downstream checkpoint boundary`; `AVAILABILITY_EVIDENCE = approved EXEC-002 contract, no productive producer`; `BLOCKING_EFFECT = integrated proof only`; `DEPENDENCY_EDGE = EXEC-002 producer → T008`.

`PCP_CANONICAL_FIELDS = AUTHORITY_OWNER, PRODUCER, PRODUCED_CONTRACT, CONSUMER, CONSUMED_CAPABILITY, SEMANTIC_STATUS, LOCAL_TESTABILITY, PRODUCTIVE_AVAILABILITY, AVAILABILITY_EVIDENCE, AVAILABILITY_CONDITION, DEPENDENCY_CLASS, DEPENDENCY_EDGE, BLOCKING_EFFECT`; the Plan-aligned EXEC-002 record and local fixture are reconciled above; PLAT remains a downstream integrated checkpoint owner.

## 14c. ACCEPTANCE_WITNESS_MATRIX

| NORMATIVE_BEHAVIOR | NORMATIVE_VERB | CONCRETE_OPERATION_COMMAND_OR_QUERY | STATE_OR_TRANSITION_AFFECTED | DIRECT_POSITIVE_TEST | DIRECT_NEGATIVE_OR_ISOLATION_TEST | EXPECTED_EVIDENCE_FILE | ACCEPTANCE_OWNER | REQUIRED_PRODUCER_OR_CAPABILITY | AUTHORITY_STATUS | CONTRACT_STATUS | LOCAL_TESTABILITY | PRODUCTIVE_AVAILABILITY | DEPENDENCY_CLASS | WITNESS_EXECUTABLE_AT_LOCAL_CLOSURE | EVIDENCE_TYPE |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Safe checkpoint declaration | declare | C-EXEC-017 / AC-EXEC-014 | manifest basis | safe checkpoint and exact basis accepted | absent or incomplete safe-checkpoint declaration rejected | `docs/tickets/SPEC-EXEC-001/evidence/TICKET-008/AC-EXEC-014-checkpoint-declaration.md` | EXEC-001-TICKET-008 | local declaration fixture | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |
| Resume authorization boundary | reject/authorize | resume-basis operation | resume decision | complete declared basis is consumable | absent declaration OR absent exact basis cannot authorize resume | `docs/tickets/SPEC-EXEC-001/evidence/TICKET-008/AC-EXEC-014-resume-rejection.md` | EXEC-001-TICKET-008 | local declaration fixture | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |
| Owner-preserving handoff | expose | EXEC-002/PLAT contract | checkpoint handoff | basis returned for foreign owners | transient text/session memory cannot replace declared basis | `docs/tickets/SPEC-EXEC-001/evidence/TICKET-008/AC-EXEC-014-owner-handoff.md` | EXEC-001-TICKET-008 | local declaration fixture | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |

## 15. Implementation Constraints

No resume without declared safe checkpoint/basis; transient text/session memory is not authority; preserve EXEC-002 and PLAT ownership; do not implement recovery.

## 16. Acceptance Criteria

1. `AC-EXEC-014`: manifest declares safe checkpoint and exact resume basis; absence cannot authorize resume and foreign owners retain context/replay work.

`TESTABLE: YES`; `LOCALLY_PROVABLE: YES` after TICKET-006.

## 17. Acceptance / Proof Role

`LOCAL_ACCEPTANCE_OWNER: YES`; `FINAL_PROOF_OWNER: YES` for AC-EXEC-014. Contributes to CP-EXEC-03.

## 18. Required Tests

Safe checkpoint declaration; complete basis; absent declaration/basis rejection; transient-text rejection; owner-preserving EXEC-002/PLAT mapping contract.

## 19. Completion Evidence

Evidence files `docs/tickets/SPEC-EXEC-001/evidence/TICKET-008/AC-EXEC-014-checkpoint-declaration.md`, `AC-EXEC-014-resume-rejection.md` and `AC-EXEC-014-owner-handoff.md`, containing declaration/basis assertions, rejection evidence and executed tests. Local evidence is producible after TICKET-006.

## 20. Completion Gate

```text
COMPLETION_GATE:
  production_code: REQUIRED
  automated_tests: REQUIRED
  local_completion_evidence: REQUIRED
  integration_evidence: REQUIRED_AS_CONTRACT_CONTRIBUTION
  legacy_transition_evidence: REQUIRED_FOR_LOCAL_SCOPE
  conformance_evidence: REQUIRED
```

## 21. Legacy / Cutover Impact

`HISTORICAL_REPLAY`; original checkpoint/basis remains attached to its manifest; changed basis is a new attempt.

## 22. Risks

Transient session memory as authority, checkpoint without basis and EXEC ownership of context/recovery. Negative declaration tests mitigate these risks.

## 23. Implementation Wave

`WAVE: 3`.

## 24. Parallelization

`SAFE_WITH_COORDINATION` after TICKET-006.

## 25. Handoff After Completion

Independent ticket audit validates this ticket; checkpoint evidence proceeds to CP-EXEC-03 and foreign EXEC-002/PLAT integrated proof.

## 26. Ticket Local Closure

`TICKET_LOCAL_CLOSURE = YES`; declaration and negative authorization witnesses are locally executable after TICKET-006.
