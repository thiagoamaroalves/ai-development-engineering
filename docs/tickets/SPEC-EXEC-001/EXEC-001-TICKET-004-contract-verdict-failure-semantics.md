# EXEC-001-TICKET-004 — Contract verdict and failure semantics

## 1. Status

`STATUS: BLOCKED`

```text
ISSUE_DECOMPOSITION_READINESS: ISSUE_READY
INITIAL_DAG_STATE: BLOCKED
EXECUTION_READY: FALSE
BLOCKED_BY: EXEC-001-TICKET-001, EXEC-001-TICKET-002
DEPENDS_ON: EXEC-001-TICKET-001, EXEC-001-TICKET-002
UNBLOCKS: NONE
```

## 2. Source Traceability

ADR `ADR-0003` revision 3 accepted; Portfolio `O-019`; SPEC `EXEC-CONTRACT-001/002`, `EXEC-FAILURE-001`; Gap Matrix `GAP-002`, `GAP-003`, `GAP-016`; Plan `EXEC-IMP-04`; Plan Audit `IMPLEMENTATION_PLAN_CONFORMANT`. Upstream source paths and audit baselines are recorded in `docs/tickets/SPEC-EXEC-001/README.md` §2.

## 3. Authority / Scope

`EXEC-001 / CANONICAL_OWNER` owns `CONTRACT_INVALID`, `VERDICT_UNKNOWN`, structured failure fields, non-success semantics, basis preservation and retry meaning. DOM owns lifecycle advancement; BACKEND/OPS/UI map/project; PLAT owns effect confirmation.

## 4. Portfolio Obligation Coverage

`O-019` — fail-closed contract/verdict and structured failure semantics.

## 5. Gap / Requirement / Acceptance Coverage

`GAP-002`, `GAP-003`, `GAP-016`; `EXEC-CONTRACT-001`, `EXEC-CONTRACT-002`, `EXEC-FAILURE-001`; `AC-EXEC-006`, `AC-EXEC-007`, `AC-EXEC-017`, contributor to `AC-EXEC-018`; final proof owner for AC-006, AC-007, AC-017.

## 6. Implementation Unit

`EXEC-IMP-04 — Contract verdict and failure semantics`; 1:1, no split/merge.

## 7. Goal

Make invalid contracts and unknown verdicts structured, fail closed and meaning-preserving without assigning lifecycle or effect ownership to EXEC.

## 8. Validated Implementation Delta

`OBSERVED`: no productive EXEC failure result or mapping contract. `REQUIRED`: canonical codes/family/basis/cause/processing state with no success/effect implication. `DELTA`: failure emission and mapping contract is absent.

## 9. Required Behavior

1. Invalid JSON/schema yields `CONTRACT_INVALID`; absent/unknown verdict yields `VERDICT_UNKNOWN`; neither implies approval, checkpoint or effect.
2. Structured failure preserves code/family, contract/version/basis, cause and processing state; retry cannot convert a basis or confirm an effect.

## 10. Does Not Implement

DOM lifecycle transitions; transport status choice; logging/UI presentation implementation; effect execution/intent/evidence/confirmation; retry scheduler.

## 11. Repository Evidence

No productive EXEC failure surface exists. Generic delegation is a consumer seam, not a failure authority; DOM rejection behavior remains foreign.

## 12. Expected Repository Impact

Production: canonical failure result boundary. Persistence/schema: structured failure fields. Integration: BACKEND/OPS/UI/PLAT mapping seams. Tests: malformed/unknown schema, unknown verdict, fields/no-success/no-effect, retry basis and mapping preservation. Legacy/cutover: `NEW_CANONICAL_PATH`. Generated contracts: failure envelope/result schema.

## 13. Dependencies

Internal: TICKET-001 and TICKET-002. Foreign BACKEND/OPS/UI mapping capabilities are integrated-proof-only. DOM lifecycle and PLAT effect ownership remain excluded boundaries, not ticket capability records. No downstream ticket is unblocked by this unit.

## 14. Blocking Conditions

Blocked only by unresolved TICKET-001 and TICKET-002. Integrated-only mapping availability does not create a local blocker.

## 14a. Authority Consumption Proof

```text
PROOF_ID = ACP-EXEC-04
AUTHORITY_EXISTENCE = YES; ADR-0003/O-019 and EXEC failure requirements
TRUTH_OWNER = EXEC-001 for canonical failure meaning
CONSUMER_CONTRACT = structured failure code/family/basis/cause/state
LOCAL_TESTABILITY = YES via local failure fixture
PRODUCTIVE_AVAILABILITY = NO for foreign mappings; integrated-only
DEPENDENCY_CLASS = REQUIRED_FOR_INTEGRATED_PROOF for foreign boundaries
AVAILABILITY_EVIDENCE = approved mapping contracts; no productive integrated mappings at baseline
BLOCKING_EFFECT = integrated proof only; internal ticket prerequisites block execution
CAPABILITY_SUMMARY_STATUS = CONTRACT_TESTABLE_LOCALLY for local failure semantics; foreign mapping contracts remain CONTRACT_DEFINED
RESULT = AUTHORITY_CONSUMPTION_GAP for unavailable productive mapping producers; local fixture proves failure semantics only
```

## 14b. Producer / Consumer Contract Proof

| Capability | Owner/producer | Consumer | Contract | Semantic | Authority/contract | Local/productive | Class | Failure and version transport |
|---|---|---|---|---|---|---|---|---|
| BACKEND-EXEC-FAILURE-MAPPING | BACKEND-001 / mapping boundary | T004 | code/family/basis/state mapping | DEFINED | DEFINED/DEFINED | NO/NO | REQUIRED_FOR_INTEGRATED_PROOF | no renaming/softening |
| OPS-EXEC-FAILURE-PROJECTION | OPS-001 / projection | T004 | operational projection preserving meaning | DEFINED | DEFINED/DEFINED | NO/NO | REQUIRED_FOR_INTEGRATED_PROOF | retryability/state preserved |
| UI-EXEC-FAILURE-PROJECTION | UI-001 / projection | T004 | presentation preserving meaning | DEFINED | DEFINED/DEFINED | NO/NO | REQUIRED_FOR_INTEGRATED_PROOF | no approval fallback |

`AVAILABILITY_CONDITION = integrated producer/mapping exists at its consumer execution point`; `AVAILABILITY_EVIDENCE = approved boundary contracts and no productive producer at pinned HEAD`; `BLOCKING_EFFECT = integrated proof only`; `DEPENDENCY_EDGE = approved foreign producer → T004`; `FAILURE_SEMANTICS = missing, stale or incompatible capability fails closed and never implies success`.

`PCP_CANONICAL_FIELDS = AUTHORITY_OWNER, PRODUCER, PRODUCED_CONTRACT, CONSUMER, CONSUMED_CAPABILITY, SEMANTIC_STATUS, LOCAL_TESTABILITY, PRODUCTIVE_AVAILABILITY, AVAILABILITY_EVIDENCE, AVAILABILITY_CONDITION, DEPENDENCY_CLASS, DEPENDENCY_EDGE, BLOCKING_EFFECT`; each Plan-aligned mapping boundary is represented above; DOM lifecycle and PLAT effect semantics remain excluded ownership boundaries.

## 14c. ACCEPTANCE_WITNESS_MATRIX

| NORMATIVE_BEHAVIOR | NORMATIVE_VERB | CONCRETE_OPERATION_COMMAND_OR_QUERY | STATE_OR_TRANSITION_AFFECTED | DIRECT_POSITIVE_TEST | DIRECT_NEGATIVE_OR_ISOLATION_TEST | EXPECTED_EVIDENCE_FILE | ACCEPTANCE_OWNER | REQUIRED_PRODUCER_OR_CAPABILITY | AUTHORITY_STATUS | CONTRACT_STATUS | LOCAL_TESTABILITY | PRODUCTIVE_AVAILABILITY | DEPENDENCY_CLASS | WITNESS_EXECUTABLE_AT_LOCAL_CLOSURE | EVIDENCE_TYPE |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Invalid contract rejection | reject | C-EXEC-006 / AC-EXEC-006 | result processing | valid contract consumable | malformed/unknown schema → `CONTRACT_INVALID`; no effect | `docs/tickets/SPEC-EXEC-001/evidence/TICKET-004/AC-EXEC-006-invalid-contract.md` | EXEC-001-TICKET-004 | local failure fixture | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |
| Unknown verdict rejection | reject | C-EXEC-007 / AC-EXEC-007 | result processing | registered verdict accepted | absent/unknown → `VERDICT_UNKNOWN`; no approval | `docs/tickets/SPEC-EXEC-001/evidence/TICKET-004/AC-EXEC-007-unknown-verdict.md` | EXEC-001-TICKET-004 | local failure fixture | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |
| Structured failure | emit | C-EXEC-014 / AC-EXEC-017 | failure result | code/family/basis/cause/state preserved | missing field or text fallback rejected | `docs/tickets/SPEC-EXEC-001/evidence/TICKET-004/AC-EXEC-017-structured-failure.md` | EXEC-001-TICKET-004 | local failure fixture | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |
| Retry basis preservation | retry | C-EXEC-017 / AC-EXEC-018 | failure/attempt basis | explicit retry retains meaning | version conversion or effect confirmation rejected | `docs/tickets/SPEC-EXEC-001/evidence/TICKET-004/AC-EXEC-018-retry-contribution.md` | EXEC-001-TICKET-007 | local failure fixture | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |
| Mapping isolation | map/project | C-EXEC-014 | consumer representation | mapped failure retains semantics | BACKEND/OPS/UI cannot rename to success | `docs/tickets/SPEC-EXEC-001/evidence/TICKET-004/integrated-failure-mapping.md` | EXEC-001-TICKET-004 | BACKEND/OPS/UI mapping fixture | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |

## 15. Implementation Constraints

Fail closed; preserve canonical code/family/retryability/basis/non-success; unknown verdict cannot approve; requested effect is not confirmation. No transport or effect mechanism is frozen.

## 16. Acceptance Criteria

1. `AC-EXEC-006`: invalid JSON/schema produces `CONTRACT_INVALID` with no success, approval, checkpoint or effect.
2. `AC-EXEC-007`: absent/unknown verdict produces `VERDICT_UNKNOWN`, never approval.
3. `AC-EXEC-017`: structured failure preserves code/family, contract/version/basis, cause and processing state.

`AC-EXEC-018` is a contributor obligation only here; its final proof is owned by TICKET-007. The local criteria are provable after TICKET-001/002.

## 17. Acceptance / Proof Role

`LOCAL_ACCEPTANCE_OWNER: YES`; `FINAL_PROOF_OWNER: YES` for AC-EXEC-006, AC-EXEC-007 and AC-EXEC-017. `CONTRIBUTOR: YES` to AC-EXEC-018 and CP-EXEC-04; TICKET-007 owns final AC-EXEC-018 proof.

## 18. Required Tests

Malformed JSON/schema; unknown/absent verdict; structured code/family/basis/cause/state; no approval/checkpoint/effect; retry no-conversion; meaning-preserving mapping contract tests.

## 19. Completion Evidence

Evidence files under `docs/tickets/SPEC-EXEC-001/evidence/TICKET-004/` for AC-EXEC-006, AC-EXEC-007 and AC-EXEC-017, plus `integrated-failure-mapping.md`, containing explicit no-success/no-effect assertions, mapping contract evidence and test output. Local evidence is producible after prerequisites.

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

`NEW_CANONICAL_PATH`; incompatible bases require explicit compatible retry/new basis. No legacy failure format is authoritative.

## 22. Risks

Text fallback, unknown verdict as approval, failure-code renaming and requested effect as confirmation. Direct negative and mapping tests mitigate these risks.

## 23. Implementation Wave

`WAVE: 2`.

## 24. Parallelization

`SAFE_WITH_COORDINATION` after TICKET-001/002; shared schema and registry failure result surfaces require coordination.

## 25. Handoff After Completion

Independent ticket audit validates this ticket. Its failure/result evidence contributes to CP-EXEC-04; it does not release tickets with direct internal prerequisites.

## 26. Ticket Local Closure

`TICKET_LOCAL_CLOSURE = YES` after TICKET-001/002. Foreign Plan-aligned mappings remain integrated-only; DOM lifecycle and PLAT effect proof are outside this ticket capability record.
