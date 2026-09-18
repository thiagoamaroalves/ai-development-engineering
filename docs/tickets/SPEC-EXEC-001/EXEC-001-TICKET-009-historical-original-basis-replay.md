# EXEC-001-TICKET-009 — Historical original-basis replay protection

## 1. Status

`STATUS: BLOCKED`

```text
ISSUE_DECOMPOSITION_READINESS: ISSUE_READY
INITIAL_DAG_STATE: BLOCKED
EXECUTION_READY: FALSE
BLOCKED_BY: EXEC-001-TICKET-003, EXEC-001-TICKET-007
DEPENDS_ON: EXEC-001-TICKET-003, EXEC-001-TICKET-007
UNBLOCKS: NONE
```

## 2. Source Traceability

ADR `ADR-0003`; Portfolio `O-021`; SPEC `EXEC-HISTORY-001`; Gap Matrix `GAP-015`; Plan `EXEC-IMP-09`; Plan Audit `IMPLEMENTATION_PLAN_CONFORMANT`. Baseline paths/hashes are in README §2.

## 3. Authority / Scope

`EXEC-001 / CANONICAL_OWNER` owns original EXEC interpretation and frozen-basis replay protection. PLAT owns physical historical material/replay. Current registry cannot reinterpret an historical manifest.

## 4. Portfolio Obligation Coverage

`O-021` — historical replay preserves the original EXEC basis.

## 5. Gap / Requirement / Acceptance Coverage

`GAP-015`; `EXEC-HISTORY-001`; `AC-EXEC-016`; final proof owner: this ticket.

## 6. Implementation Unit

`EXEC-IMP-09 — Historical original-basis replay protection`; 1:1; no split/merge.

## 7. Goal

Preserve original repository/catalog/schema/version/hash/commit/result/checkpoint interpretation during historical replay despite current registry changes.

## 8. Validated Implementation Delta

`OBSERVED`: no productive manifest/catalog replay surface; prototype history is transient. `REQUIRED`: frozen original-basis replay guard, no silent conversion or reinterpretation. `DELTA`: historical preservation is absent.

## 9. Required Behavior

1. Replay/query uses stored original basis and reproduces historical interpretation.
2. Current or foreign registry substitution and silent conversion are rejected without historical mutation.

## 10. Does Not Implement

Physical replay/storage; registry construction (TICKET-002); manifest identity (TICKET-007); execution/session runtime; effects; UI/OPS projection.

## 11. Repository Evidence

No productive replay surface exists; prototype history is transient and cannot prove durable historical replay.

## 12. Expected Repository Impact

Production: original-basis replay guard. Persistence/schema: PLAT material seam, mechanism unfrozen. Integration: PLAT ordered history. Tests: original-basis replay, current-registry divergence, schema/version/hash/commit preservation and conversion rejection. Legacy/cutover: `HISTORICAL_REPLAY`; no historical rewrite. Generated contracts: replay basis/result.

## 13. Dependencies

Internal: TICKET-003 and TICKET-007. Cross-SPEC `PLAT-EXEC-PERSISTED-MATERIAL` is integrated-proof-only. No ticket unblocked.

## 14. Blocking Conditions

Blocked only by TICKET-003 and TICKET-007. PLAT durable replay availability is not a local blocker.

## 14a. Authority Consumption Proof

```text
PROOF_ID = ACP-EXEC-09
AUTHORITY_EXISTENCE = YES; EXEC-HISTORY-001 and PLAT replay boundary
TRUTH_OWNER = EXEC-001 for historical interpretation; PLAT for physical replay
CONSUMER_CONTRACT = original frozen manifest/catalog basis replay
LOCAL_TESTABILITY = YES via local frozen-basis fixture
PRODUCTIVE_AVAILABILITY = NO for PLAT producer
DEPENDENCY_CLASS = REQUIRED_FOR_INTEGRATED_PROOF
BLOCKING_EFFECT = integrated proof only; TICKET-003/007 are local blockers
CAPABILITY_SUMMARY_STATUS = CONTRACT_DEFINED for unavailable PLAT producer; local frozen-basis fixture is contract-testable
RESULT = AUTHORITY_CONSUMPTION_GAP for unavailable productive PLAT producer; local fixture proves replay protection only
```

## 14b. Producer / Consumer Contract Proof

| Field | Proof |
|---|---|
| `CAPABILITY_ID / AUTHORITY_OWNER` | `PLAT-EXEC-PERSISTED-MATERIAL` / SPEC-PLAT-001 |
| `PRODUCER / CONSUMER` | PLAT ordered durable historical reader / T009 |
| `PRODUCED_CONTRACT` | integrity-checked historical material carrying original basis |
| `SEMANTIC_STATUS` | DEFINED |
| `AUTHORITY_STATUS / CONTRACT_STATUS` | DEFINED / DEFINED |
| `LOCAL_TESTABILITY / PRODUCTIVE_AVAILABILITY` | NO / NO |
| `AVAILABILITY_EVIDENCE` | approved PLAT boundary; no productive producer at pinned HEAD |
| `FAILURE / VERSION TRANSPORT` | missing/stale/corrupt/mismatched history fails closed; original schema/version/hash/commit/basis unchanged |
| `DEPENDENCY_CLASS / EDGE` | REQUIRED_FOR_INTEGRATED_PROOF / PLAT→EXEC |

`AVAILABILITY_CONDITION = ordered durable PLAT history is available at integrated replay proof`; `AVAILABILITY_EVIDENCE = approved PLAT boundary, no productive producer`; `BLOCKING_EFFECT = integrated proof only`; `FAILURE_SEMANTICS = missing, stale, corrupt or incompatible history fails closed`; `VERSION_TRANSPORT = original basis preserved unchanged`.

`PCP_CANONICAL_FIELDS = AUTHORITY_OWNER, PRODUCER, PRODUCED_CONTRACT, CONSUMER, CONSUMED_CAPABILITY, SEMANTIC_STATUS, LOCAL_TESTABILITY, PRODUCTIVE_AVAILABILITY, AVAILABILITY_EVIDENCE, AVAILABILITY_CONDITION, DEPENDENCY_CLASS, DEPENDENCY_EDGE, BLOCKING_EFFECT`; the PLAT record above is complete.

## 14c. ACCEPTANCE_WITNESS_MATRIX

| NORMATIVE_BEHAVIOR | NORMATIVE_VERB | CONCRETE_OPERATION_COMMAND_OR_QUERY | STATE_OR_TRANSITION_AFFECTED | DIRECT_POSITIVE_TEST | DIRECT_NEGATIVE_OR_ISOLATION_TEST | EXPECTED_EVIDENCE_FILE | ACCEPTANCE_OWNER | REQUIRED_PRODUCER_OR_CAPABILITY | AUTHORITY_STATUS | CONTRACT_STATUS | LOCAL_TESTABILITY | PRODUCTIVE_AVAILABILITY | DEPENDENCY_CLASS | WITNESS_EXECUTABLE_AT_LOCAL_CLOSURE | EVIDENCE_TYPE |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Original-basis replay | replay/resolve | C-EXEC-016 / AC-EXEC-016 | historical manifest/catalog | original basis reproduced | current registry differs but cannot reinterpret | `docs/tickets/SPEC-EXEC-001/evidence/TICKET-009/AC-EXEC-016-original-basis.md` | EXEC-001-TICKET-009 | local replay fixture | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |
| Historical identity preservation | preserve | historical query | manifest/catalog history | original IDs/basis/results retained | foreign registry or current alias cannot substitute | `docs/tickets/SPEC-EXEC-001/evidence/TICKET-009/AC-EXEC-016-identity-preservation.md` | EXEC-001-TICKET-009 | local replay fixture | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |
| Silent conversion rejection | reject | replay with incompatible current basis | replay result | compatible historical basis reads | incompatible/current conversion rejected without mutation | `docs/tickets/SPEC-EXEC-001/evidence/TICKET-009/AC-EXEC-016-no-conversion.md` | EXEC-001-TICKET-009 | local replay fixture | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |

## 15. Implementation Constraints

Preserve original repository/catalog identity, schema, versions, hashes, commits, results and checkpoints; reject reinterpretation/conversion; never mutate history; do not implement PLAT replay.

## 16. Acceptance Criteria

1. `AC-EXEC-016`: replay reproduces the original basis even when current registry differs; no silent conversion or reinterpretation occurs.

`TESTABLE: YES`; `LOCALLY_PROVABLE: YES` after TICKET-003/007.

## 17. Acceptance / Proof Role

`LOCAL_ACCEPTANCE_OWNER: YES`; `FINAL_PROOF_OWNER: YES` for AC-EXEC-016. Contributes to CP-EXEC-03.

## 18. Required Tests

Original-basis replay; current-registry divergence; schema/version/hash/commit preservation; conversion rejection; historical immutability and no mutation on failure.

## 19. Completion Evidence

Evidence files `docs/tickets/SPEC-EXEC-001/evidence/TICKET-009/AC-EXEC-016-original-basis.md`, `AC-EXEC-016-identity-preservation.md` and `AC-EXEC-016-no-conversion.md`, containing original-basis/divergence assertions and executed test output. Local evidence is producible after internal prerequisites.

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

`HISTORICAL_REPLAY`; current registry never rewrites historical basis; no legacy retirement or silent conversion.

## 22. Risks

Current-registry reinterpretation, historical mutation and PLAT material mistaken for EXEC authority. Frozen-basis divergence tests mitigate these risks.

## 23. Implementation Wave

`WAVE: 5`.

## 24. Parallelization

`SAFE_WITH_COORDINATION` after TICKET-003 and TICKET-007.

## 25. Handoff After Completion

Independent ticket audit validates this ticket; replay evidence proceeds to CP-EXEC-03 and integrated PLAT proof.

## 26. Ticket Local Closure

`TICKET_LOCAL_CLOSURE = YES`; frozen-basis semantic replay protection is locally executable after prerequisites; durable replay remains integrated-only.
