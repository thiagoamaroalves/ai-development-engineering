# EXEC-001-TICKET-007 — Manifest identity, reconstruction and retry lineage

## 1. Status

`STATUS: BLOCKED`

```text
ISSUE_DECOMPOSITION_READINESS: ISSUE_READY
INITIAL_DAG_STATE: BLOCKED
EXECUTION_READY: FALSE
BLOCKED_BY: EXEC-001-TICKET-003, EXEC-001-TICKET-006
DEPENDS_ON: EXEC-001-TICKET-003, EXEC-001-TICKET-006
UNBLOCKS: EXEC-001-TICKET-009
```

## 2. Source Traceability

ADR `ADR-0003`, `ADR-0001`, `ADR-0006`; Portfolio `O-018`, `O-021`; SPEC `EXEC-MANIFEST-004`; Gap Matrix `GAP-014`; Plan `EXEC-IMP-07`; Plan Audit `IMPLEMENTATION_PLAN_CONFORMANT`. Baseline paths and hashes are in the ticket index §2.

## 3. Authority / Scope

`EXEC-001 / CANONICAL_OWNER` owns manifest identity, tuple attachment, content revision/digest validation, semantic reconstruction and retry lineage. DOM resolves identity; PLAT supplies physical integrity/recovery.

## 4. Portfolio Obligation Coverage

`O-018` exact basis and `O-021` immutable manifest/replay contract.

## 5. Gap / Requirement / Acceptance Coverage

`GAP-014`; `EXEC-MANIFEST-004`; `AC-EXEC-020`; contributor to `AC-EXEC-018`; final proof owner for AC-EXEC-018 and AC-EXEC-020.

## 6. Implementation Unit

`EXEC-IMP-07 — Manifest identity, reconstruction and retry lineage`; 1:1; no split/merge.

## 7. Goal

Make exactly one identity-bound immutable manifest per DOM tuple semantically reconstructable and retry-distinct.

## 8. Validated Implementation Delta

`OBSERVED`: no productive manifest identity, digest, attachment validator or semantic rehydration/retry path. `REQUIRED`: tuple identity, validated rehydration, no mutation on failure and new AttemptId on retry. `DELTA`: manifest identity/reconstruction authority is absent.

## 9. Required Behavior

1. Create/rehydrate exactly one manifest for the canonical `(ExecutionId, ActivityId, AttemptId)` tuple with `ManifestContentRevision=1`, basis and digest.
2. Reject detached, stale, corrupt, duplicate or cross-attempt material without mutation; retry creates a new AttemptId and manifest while preserving the original basis.
3. Rehydration explicitly rejects stale snapshot/catalog basis material before mutation; current-registry values cannot reinterpret the historical manifest basis.

## 10. Does Not Implement

DOM identity creation; PLAT serialization/durability/recovery; EXEC-002 sessions; replay orchestration; effects; UI/OPS mapping.

## 11. Repository Evidence

No productive manifest persistence/reconstruction exists; prototype is in-memory and non-authoritative.

## 12. Expected Repository Impact

Production: manifest identity/rehydration/retry boundary. Persistence/schema: typed PLAT material/integrity seam, mechanism unfrozen. Integration: DOM tuple and PLAT recovery. Tests: exact tuple uniqueness, attachment/cardinality, digest/basis/revision, stale/corrupt/duplicate rejection, no mutation and retry identity. Legacy/cutover: `HISTORICAL_REPLAY`, `CUTOVER`. Generated contracts: manifest reconstruction result.

## 13. Dependencies

Internal: TICKET-003 and TICKET-006. Foreign DOM/PLAT capabilities are integrated-only. `UNBLOCKS` TICKET-009.

## 14. Blocking Conditions

Blocked only by TICKET-003 and TICKET-006. Foreign physical material availability does not block local semantic closure.

## 14a. Authority Consumption Proof

```text
PROOF_ID = ACP-EXEC-07
AUTHORITY_EXISTENCE = YES; EXEC-MANIFEST-004 and DOM/PLAT reconstruction boundaries
TRUTH_OWNER = EXEC-001 for semantic manifest; DOM for tuple; PLAT for physical material
CONSUMER_CONTRACT = tuple identity, content revision/digest, attachment, rehydrate and retry
LOCAL_TESTABILITY = YES via deterministic local reconstruction fixture
PRODUCTIVE_AVAILABILITY = NO for foreign producers
DEPENDENCY_CLASS = REQUIRED_FOR_INTEGRATED_PROOF
BLOCKING_EFFECT = integrated proof only; TICKET-003/006 block execution
CAPABILITY_SUMMARY_STATUS = CONTRACT_TESTABLE_LOCALLY for the local reconstruction fixture; foreign producers remain CONTRACT_DEFINED
RESULT = AUTHORITY_CONSUMPTION_GAP for unavailable productive DOM/PLAT producers; local fixture proves semantic reconstruction only
```

## 14b. Producer / Consumer Contract Proof

| Capability | Producer / owner | Consumer | Contract | Dimensions | Class | Failure semantics |
|---|---|---|---|---|---|---|
| DOM-EXEC-IDENTITY-SNAPSHOT | DOM resolver / DOM-001 | T007 | Execution/Activity/Attempt/ArtifactCycle identity and snapshot refs | DEFINED/DEFINED/NO/NO | REQUIRED_FOR_INTEGRATED_PROOF | detached/unknown/stale fails closed |
| PLAT-EXEC-PERSISTED-MATERIAL | PLAT reader / PLAT-001 | T007 | integrity-checked physical manifest material | DEFINED/DEFINED/NO/NO | REQUIRED_FOR_INTEGRATED_PROOF | corrupt/missing/order mismatch fails closed |
| UNIT-EXEC-MANIFEST-RECONSTRUCTION | local fixture / EXEC-001 | T007 | semantic identity/reconstruction/retry inputs | DEFINED/DEFINED/YES/NO | INFORMATIONAL | direct contract evidence only |

Exact tuple, basis, revision and digest transport is preserved unchanged; no fixture promotes productive availability. `AVAILABILITY_CONDITION = DOM identity and PLAT material are available at integrated reconstruction`; `AVAILABILITY_EVIDENCE = conformant boundaries, no productive foreign runtime`; `BLOCKING_EFFECT = integrated proof only`; `DEPENDENCY_EDGE = DOM/PLAT producers → T007`.

`PCP_CANONICAL_FIELDS = AUTHORITY_OWNER, PRODUCER, PRODUCED_CONTRACT, CONSUMER, CONSUMED_CAPABILITY, SEMANTIC_STATUS, LOCAL_TESTABILITY, PRODUCTIVE_AVAILABILITY, AVAILABILITY_EVIDENCE, AVAILABILITY_CONDITION, DEPENDENCY_CLASS, DEPENDENCY_EDGE, BLOCKING_EFFECT`; DOM, PLAT and local fixture records are reconciled above.

## 14c. ACCEPTANCE_WITNESS_MATRIX

| NORMATIVE_BEHAVIOR | NORMATIVE_VERB | CONCRETE_OPERATION_COMMAND_OR_QUERY | STATE_OR_TRANSITION_AFFECTED | DIRECT_POSITIVE_TEST | DIRECT_NEGATIVE_OR_ISOLATION_TEST | EXPECTED_EVIDENCE_FILE | ACCEPTANCE_OWNER | REQUIRED_PRODUCER_OR_CAPABILITY | AUTHORITY_STATUS | CONTRACT_STATUS | LOCAL_TESTABILITY | PRODUCTIVE_AVAILABILITY | DEPENDENCY_CLASS | WITNESS_EXECUTABLE_AT_LOCAL_CLOSURE | EVIDENCE_TYPE |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Manifest identity/reconstruction | create/rehydrate | C-EXEC-019/020 / AC-EXEC-020 | immutable manifest | exact tuple creates exactly one manifest with `ManifestContentRevision=1`, attachment and digest, then rehydrates | duplicate/cardinality mismatch, detached or digest/basis mismatch → `CONTRACT_INVALID` | `docs/tickets/SPEC-EXEC-001/evidence/TICKET-007/AC-EXEC-020-identity-reconstruction.md` | EXEC-001-TICKET-007 | local reconstruction fixture | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |
| Stale manifest rehydration | rehydrate/reject | C-EXEC-020 / AC-EXEC-020 | immutable manifest basis | exact stored tuple and original basis rehydrate | stale snapshot/catalog basis or current-registry mismatch → `CONTRACT_INVALID`; no mutation | `docs/tickets/SPEC-EXEC-001/evidence/TICKET-007/AC-EXEC-020-stale-rehydration.md` | EXEC-001-TICKET-007 | local reconstruction fixture | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |
| Retry lineage | retry/recreate | C-EXEC-017/AC-EXEC-018 | attempt/manifest lineage | new AttemptId/new manifest retains basis | same manifest reuse or current-registry reinterpretation rejected | `docs/tickets/SPEC-EXEC-001/evidence/TICKET-007/AC-EXEC-018-retry-lineage.md` | EXEC-001-TICKET-007 | local reconstruction fixture | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |
| No mutation on failure | reject | invalid rehydrate/create | manifest state | valid record remains unchanged | stale/corrupt/cross-attempt input cannot mutate | `docs/tickets/SPEC-EXEC-001/evidence/TICKET-007/AC-EXEC-020-no-mutation.md` | EXEC-001-TICKET-007 | local reconstruction fixture | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |

## 15. Implementation Constraints

Canonical DOM tuple is identity; ManifestContentRevision=1 is distinct from domain/physical revision; untrusted material cannot become valid directly; failure has `MUTATION_ON_FAILURE = NO`; retry is a new AttemptId.

## 16. Acceptance Criteria

1. One manifest is created/reconstructed for the exact DOM tuple with content revision and digest; attachment/cardinality are validated.
2. Detached, stale, corrupt, duplicate or cross-attempt material fails closed without mutation; retry uses a new AttemptId/manifest.

Both are locally provable after TICKET-003/006.

## 17. Acceptance / Proof Role

`LOCAL_ACCEPTANCE_OWNER: YES`; `FINAL_PROOF_OWNER: YES` for AC-EXEC-018 and AC-EXEC-020. Contributes to CP-EXEC-02 and CP-EXEC-04.

## 18. Required Tests

Tuple uniqueness; one-manifest cardinality; attachment mismatch; duplicate creation; digest/schema/basis mismatch; explicit stale snapshot/catalog rehydration rejection; stale/current registry separation; no mutation; retry new identity; reconstruction equality.

## 19. Completion Evidence

Evidence files under `docs/tickets/SPEC-EXEC-001/evidence/TICKET-007/` for AC-EXEC-018 and AC-EXEC-020, containing identity/reconstruction proof, explicit stale-rehydration evidence, no-mutation evidence, new AttemptId evidence and executed tests. Local evidence is producible after prerequisites.

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

`HISTORICAL_REPLAY` and `CUTOVER`; original manifest remains immutable/replayable and changed basis is a new identity.

## 22. Risks

ManifestId invention, detached material acceptance, duplicate attachment and current-registry reinterpretation. Direct identity/reconstruction negatives mitigate these risks.

## 23. Implementation Wave

`WAVE: 4`.

## 24. Parallelization

`SAFE_WITH_COORDINATION` after TICKET-003 and TICKET-006; shared manifest identity boundary.

## 25. Handoff After Completion

Independent ticket audit validates this ticket; completion releases TICKET-009 and contributes retry/reconstruction evidence to CP-EXEC-02/04.

## 26. Ticket Local Closure

`TICKET_LOCAL_CLOSURE = YES`; semantic reconstruction, explicit stale-rehydration rejection and retry evidence are local after prerequisites. PLAT durable proof remains integrated-only.
