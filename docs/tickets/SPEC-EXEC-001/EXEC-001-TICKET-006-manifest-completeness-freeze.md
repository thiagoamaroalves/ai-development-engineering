# EXEC-001-TICKET-006 — Complete manifest and started-basis freeze

## 1. Status

`STATUS: BLOCKED`

```text
ISSUE_DECOMPOSITION_READINESS: ISSUE_READY
INITIAL_DAG_STATE: BLOCKED
EXECUTION_READY: FALSE
BLOCKED_BY: EXEC-001-TICKET-002
DEPENDS_ON: EXEC-001-TICKET-001, EXEC-001-TICKET-002
UNBLOCKS: EXEC-001-TICKET-007, EXEC-001-TICKET-008
```

## 2. Source Traceability

ADR `ADR-0003`, `ADR-0001`; Portfolio `O-018`, `O-021`; SPEC `EXEC-MANIFEST-001/003`; Gap Matrix `GAP-012`, `GAP-017`; Plan `EXEC-IMP-06`; Plan Audit `IMPLEMENTATION_PLAN_CONFORMANT`. Full baseline paths/hashes: ticket index §2.

## 3. Authority / Scope

`EXEC-001 / CANONICAL_OWNER` owns manifest semantic fields, exact schema/version basis, pre-start completeness, post-start immutability and cutover contract. DOM owns identities/lifecycle; PLAT owns physical durability.

## 4. Portfolio Obligation Coverage

`O-018` exact basis and `O-021` complete immutable activity manifest/checkpoint basis.

## 5. Gap / Requirement / Acceptance Coverage

`GAP-012`, `GAP-017`; `EXEC-MANIFEST-001`, `EXEC-MANIFEST-003`; `AC-EXEC-013`, `AC-EXEC-015`; contributor to `AC-EXEC-014` and `AC-EXEC-020`; final proof owner for AC-EXEC-013 and AC-EXEC-015.

## 6. Implementation Unit

`EXEC-IMP-06 — Complete manifest and started-basis freeze`; 1:1, no split/merge.

## 7. Goal

Make a complete activity-attempt manifest contract and immutable started schema/version/basis, with changed basis requiring a new attempt.

## 8. Validated Implementation Delta

`OBSERVED`: no productive complete manifest, expected-schema freeze or exact-version manifest binding. `REQUIRED`: complete pre-start manifest and immutable started basis. `DELTA`: manifest completeness and cutover contract are absent.

## 9. Required Behavior

1. Construct one complete manifest before start with paths, hashes, commits, basis, dependencies, findings, round/attempt, config, workdir, expected schema, exact versions and DOM references.
2. Reject missing fields and post-start mutation; changed schema/version/basis creates a new attempt/manifest and preserves history.

## 10. Does Not Implement

DOM identity/lifecycle; registry reconstruction (TICKET-003); physical persistence/recovery; session context application; effects; consumer projections.

## 11. Repository Evidence

No productive manifest surface exists; prototype fields are non-authoritative. This ticket adds semantic contract capability and typed foreign seams without fixing internal layout.

## 12. Expected Repository Impact

Production: manifest semantic boundary and freeze/cutover guard. Persistence/schema: PLAT physical seam, no mechanism selected. Integration: DOM tuple and PLAT durability. Tests: completeness, missing fields, attachment contract, post-start mutation, new attempt and history preservation. Legacy/cutover: `CUTOVER`, `HISTORICAL_REPLAY`. Generated contracts: manifest schema/contract.

## 13. Dependencies

Internal: TICKET-001 and TICKET-002. Foreign DOM/PLAT material is `REQUIRED_FOR_INTEGRATED_PROOF` only. `UNBLOCKS` TICKET-007 and TICKET-008.

## 14. Blocking Conditions

Blocked only by TICKET-001 and TICKET-002. Local manifest fixture proves semantic contract only; durable PLAT proof remains integrated-only.

## 14a. Authority Consumption Proof

```text
PROOF_ID = ACP-EXEC-06
AUTHORITY_EXISTENCE = YES; O-018/O-021 and EXEC-MANIFEST-001/003
TRUTH_OWNER = EXEC-001 for manifest meaning; DOM for referenced identity; PLAT for durability
CONSUMER_CONTRACT = complete manifest and started-basis freeze
LOCAL_TESTABILITY = YES via local manifest fixture
PRODUCTIVE_AVAILABILITY = NO for DOM/PLAT foreign producers
DEPENDENCY_CLASS = REQUIRED_FOR_INTEGRATED_PROOF
BLOCKING_EFFECT = integrated proof only; internal prerequisites are local blockers
CAPABILITY_SUMMARY_STATUS = CONTRACT_TESTABLE_LOCALLY for the local manifest fixture; foreign producers remain CONTRACT_DEFINED
RESULT = AUTHORITY_CONSUMPTION_GAP for unavailable productive DOM/PLAT producers; local fixture proves semantic contract only
```

## 14b. Producer / Consumer Contract Proof

| Capability | Producer/owner | Consumer | Contract | Status dimensions | Class | Evidence / failure |
|---|---|---|---|---|---|---|
| DOM-EXEC-IDENTITY-SNAPSHOT | DOM resolver / DOM-001 | T006 | activity/attempt/cycle and snapshot references | DEFINED/DEFINED/NO/NO | REQUIRED_FOR_INTEGRATED_PROOF | conformant DOM contract; detached/stale fails closed |
| PLAT-EXEC-PERSISTED-MATERIAL | PLAT reader / PLAT-001 | T006 | durable manifest material/integrity/recovery | DEFINED/DEFINED/NO/NO | REQUIRED_FOR_INTEGRATED_PROOF | no productive producer at baseline; corrupt/missing fails closed |
| UNIT-EXEC-MANIFEST-FIXTURE | local fixture / EXEC-001 | T006 | complete semantic manifest/freeze input | DEFINED/DEFINED/YES/NO | INFORMATIONAL | local direct witnesses only |

Exact basis, schema/version and ManifestContentRevision transport is unchanged; fixtures never promote productive availability. `AVAILABILITY_CONDITION = DOM/PLAT producers available at integrated checkpoint`; `AVAILABILITY_EVIDENCE = conformant contracts, no productive foreign runtime`; `BLOCKING_EFFECT = integrated proof only`; `DEPENDENCY_EDGE = DOM/PLAT producers → T006`.

`PCP_CANONICAL_FIELDS = AUTHORITY_OWNER, PRODUCER, PRODUCED_CONTRACT, CONSUMER, CONSUMED_CAPABILITY, SEMANTIC_STATUS, LOCAL_TESTABILITY, PRODUCTIVE_AVAILABILITY, AVAILABILITY_EVIDENCE, AVAILABILITY_CONDITION, DEPENDENCY_CLASS, DEPENDENCY_EDGE, BLOCKING_EFFECT`; DOM, PLAT and local fixture records are reconciled above.

## 14c. ACCEPTANCE_WITNESS_MATRIX

| NORMATIVE_BEHAVIOR | NORMATIVE_VERB | CONCRETE_OPERATION_COMMAND_OR_QUERY | STATE_OR_TRANSITION_AFFECTED | DIRECT_POSITIVE_TEST | DIRECT_NEGATIVE_OR_ISOLATION_TEST | EXPECTED_EVIDENCE_FILE | ACCEPTANCE_OWNER | REQUIRED_PRODUCER_OR_CAPABILITY | AUTHORITY_STATUS | CONTRACT_STATUS | LOCAL_TESTABILITY | PRODUCTIVE_AVAILABILITY | DEPENDENCY_CLASS | WITNESS_EXECUTABLE_AT_LOCAL_CLOSURE | EVIDENCE_TYPE |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Complete manifest | create/freeze | C-EXEC-007 / AC-EXEC-013 | activity/attempt manifest | all required fields and exact refs accepted | missing field/identity rejected | `docs/tickets/SPEC-EXEC-001/evidence/TICKET-006/AC-EXEC-013-complete-manifest.md` | EXEC-001-TICKET-006 | local manifest fixture | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |
| Started basis immutability | preserve/reject | C-EXEC-012/015 / AC-EXEC-015 | started manifest | basis remains unchanged | post-start schema/version/manifest mutation rejected | `docs/tickets/SPEC-EXEC-001/evidence/TICKET-006/AC-EXEC-015-basis-freeze.md` | EXEC-001-TICKET-006 | local manifest fixture | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |
| New-attempt cutover | create | new basis operation | attempt lineage | changed basis gets new attempt/manifest | same started record cannot be rewritten | `docs/tickets/SPEC-EXEC-001/evidence/TICKET-006/new-attempt-cutover.md` | EXEC-001-TICKET-006 | local manifest fixture | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |
| History preservation | preserve/replay | historical manifest read | immutable history | original record remains readable | current basis cannot replace it | `docs/tickets/SPEC-EXEC-001/evidence/TICKET-006/historical-basis-preservation.md` | EXEC-001-TICKET-006 | local manifest fixture | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |

## 15. Implementation Constraints

Create complete manifest before start; freeze schema/version/basis after start; new basis means new attempt/identity; no path, digest, checkpoint or correlation is identity; do not implement physical persistence.

## 16. Acceptance Criteria

1. Every started activity has complete required manifest fields and exact schema/version references bound to DOM identity.
2. Started manifest/schema/versions cannot mutate; changed basis creates a new attempt/manifest and preserves history.

Both are locally testable after TICKET-001/002.

## 17. Acceptance / Proof Role

`CONTRIBUTOR: YES` to AC-EXEC-014 and AC-EXEC-020. `LOCAL_ACCEPTANCE_OWNER: YES`; `FINAL_PROOF_OWNER: YES` for AC-EXEC-013 and AC-EXEC-015. Contributes to CP-EXEC-02/03.

## 18. Required Tests

Manifest completeness; missing/duplicate fields; DOM tuple attachment contract; pre-start creation; post-start mutation; new-attempt cutover; basis immutability and history preservation.

## 19. Completion Evidence

Evidence files under `docs/tickets/SPEC-EXEC-001/evidence/TICKET-006/` for AC-EXEC-013 and AC-EXEC-015, containing complete-field assertions, mutation rejection, new-attempt and history evidence. Local evidence is producible after prerequisites.

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

`CUTOVER` and `HISTORICAL_REPLAY`; old started basis remains readable, changed basis is a new attempt, and no legacy manifest is silently rewritten.

## 22. Risks

Manifest mutation, basis drift, identity aliasing and physical persistence mistaken for semantic immutability. Direct freeze and no-mutation tests mitigate them.

## 23. Implementation Wave

`WAVE: 2`.

## 24. Parallelization

`SAFE_WITH_COORDINATION` after TICKET-001/002; shared manifest/schema/version surfaces require coordination.

## 25. Handoff After Completion

Independent ticket audit validates this ticket; completion releases TICKET-007 and TICKET-008, while PLAT/DOM integrated proof remains downstream.

## 26. Ticket Local Closure

`TICKET_LOCAL_CLOSURE = YES`; all semantic completeness/freeze evidence is local after internal prerequisites.
