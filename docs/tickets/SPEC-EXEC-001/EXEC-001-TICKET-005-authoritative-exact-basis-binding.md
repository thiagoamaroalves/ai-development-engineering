# EXEC-001-TICKET-005 — Authoritative exact-basis binding at the DOM snapshot boundary

## 1. Status

`STATUS: BLOCKED`

```text
ISSUE_DECOMPOSITION_READINESS: ISSUE_READY
INITIAL_DAG_STATE: BLOCKED
EXECUTION_READY: FALSE
BLOCKED_BY: EXEC-001-TICKET-002
DEPENDS_ON: EXEC-001-TICKET-002
UNBLOCKS: NONE
```

## 2. Source Traceability

ADR `ADR-0003`; Portfolio `O-018`; SPEC `EXEC-SNAPSHOT-001` consuming `DOM-SNAPSHOT-001`; Gap Matrix `GAP-005`; Plan `EXEC-IMP-05`; independent Plan Audit `IMPLEMENTATION_PLAN_CONFORMANT`. All source paths and frozen hashes are in the ticket index §2.

## 3. Authority / Scope

`EXEC-001 / CANONICAL_OWNER` supplies and validates exact EXEC contract/skill basis. DOM owns snapshot identity, immutability and lifecycle. This ticket rejects caller-established basis without absorbing DOM authority.

## 4. Portfolio Obligation Coverage

`O-018` — exact contract/version basis frozen by execution.

## 5. Gap / Requirement / Acceptance Coverage

`GAP-005`; `EXEC-SNAPSHOT-001`; `AC-EXEC-005`; conformance `C-EXEC-005`, `C-EXEC-012`, `C-EXEC-016`; final proof owner: this ticket.

## 6. Implementation Unit

`EXEC-IMP-05 — Authoritative exact-basis binding at the DOM snapshot boundary`; 1:1; no split/merge.

## 7. Goal

Ensure exact versions come from the authoritative EXEC basis and are bound to the immutable DOM snapshot/manifest; caller values cannot establish canonical basis.

## 8. Validated Implementation Delta

`OBSERVED`: productive DOM snapshot path accepts caller `versions` after non-empty-string validation; no EXEC registry observation. `REQUIRED`: authority-backed exact basis and mismatch/stale rejection. `DELTA`: caller-authority bypass and missing EXEC binding coexist.

## 9. Required Behavior

1. Obtain exact versions from the authority-backed EXEC basis and bind them to the snapshot/manifest contribution.
2. Treat caller values as assertions only; mismatch, arbitrary version or post-start registry mutation cannot establish/change frozen basis.

## 10. Does Not Implement

DOM snapshot aggregate/identity/lifecycle; registry semantic authority (TICKET-002); manifest persistence/reconstruction (TICKET-006/007); PLAT storage; REPO configuration; transport.

## 11. Repository Evidence

`src/application/snapshot.ts:19-25,36-43,59-71` accepts caller versions; `src/domain/snapshot.ts:124-143` checks only non-empty strings. No productive EXEC resolver is present. This is the validated `GAP-005` contradiction.

## 12. Expected Repository Impact

Production: EXEC-to-DOM exact-basis consumption seam and caller-authority rejection. Persistence/schema: no physical storage change. Integration: DOM snapshot/attempt and registry boundary. Tests: authority-backed binding, mismatch, arbitrary caller values, registry mutation and no-mutation rejection. Legacy/cutover: `CUTOVER`; changed basis requires new DOM attempt. Generated contracts: exact-basis binding contract.

## 13. Dependencies

Internal: TICKET-002. Cross-SPEC `DOM-EXEC-IDENTITY-SNAPSHOT` is `REQUIRED_FOR_INTEGRATED_PROOF`, not a local blocker. No tickets unblocked directly.

## 14. Blocking Conditions

Blocked only by TICKET-002. Integrated DOM producer availability remains non-blocking for local closure because local contract fixture is explicitly limited to the EXEC contribution.

## 14a. Authority Consumption Proof

```text
PROOF_ID = ACP-DOM-EXEC-01
AUTHORITY_EXISTENCE = YES; DOM-SNAPSHOT-001 and EXEC-SNAPSHOT-001
TRUTH_OWNER = DOM for snapshot identity; EXEC for exact contract/version basis
CONSUMER_CONTRACT = exact version basis binding and mismatch rejection
LOCAL_TESTABILITY = YES via contract fixture
PRODUCTIVE_AVAILABILITY = NO for DOM integrated producer at pinned HEAD
DEPENDENCY_CLASS = REQUIRED_FOR_INTEGRATED_PROOF
AVAILABILITY_EVIDENCE = conformant DOM contract; no productive integrated runtime
BLOCKING_EFFECT = integrated proof only; TICKET-002 is the internal blocker
RESULT = AUTHORITY_CONSUMPTION_GAP for integrated producer; local contribution consumable
```

## 14b. Producer / Consumer Contract Proof

| Field | Proof |
|---|---|
| `CAPABILITY_ID` | `DOM-EXEC-IDENTITY-SNAPSHOT` |
| `AUTHORITY_OWNER / PRODUCER` | SPEC-DOM-001 / DOM canonical identity-snapshot resolver |
| `PRODUCED_CONTRACT / CONSUMER` | RepositoryId, DOM snapshot/attempt references, exact basis / T005 |
| `SEMANTIC_STATUS` | DEFINED |
| `AUTHORITY_STATUS / CONTRACT_STATUS` | DEFINED / DEFINED |
| `LOCAL_TESTABILITY / PRODUCTIVE_AVAILABILITY` | NO / NO |
| `AVAILABILITY_EVIDENCE` | DOM rev4 conformant contract; no productive integrated runtime |
| `AVAILABILITY_CONDITION` | integrated DOM producer at consumer execution point |
| `DEPENDENCY_CLASS / EDGE` | REQUIRED_FOR_INTEGRATED_PROOF / EXEC-001 → DOM-001 |
| `FAILURE / VERSION TRANSPORT` | stale/mismatched/detached fails closed; exact version and basis transported unchanged |

`AVAILABILITY_CONDITION = productive DOM resolver exists at integrated consumer execution point`; `BLOCKING_EFFECT = integrated proof only`; `DEPENDENCY_EDGE = DOM canonical resolver → T005`.
`PCP_CANONICAL_FIELDS = AUTHORITY_OWNER, PRODUCER, PRODUCED_CONTRACT, CONSUMER, CONSUMED_CAPABILITY, SEMANTIC_STATUS, LOCAL_TESTABILITY, PRODUCTIVE_AVAILABILITY, AVAILABILITY_EVIDENCE, AVAILABILITY_CONDITION, DEPENDENCY_CLASS, DEPENDENCY_EDGE, BLOCKING_EFFECT`.

## 14c. Caller Authority and Temporal Authority Proof

```text
CALLER_AS_AUTHORITY_CHECK = NO
CALLER_VALUES = assertions only; caller-selected versions cannot establish canonical basis
MISMATCH_BEHAVIOR = fail closed with no snapshot/manifest mutation
TEMPORAL_AUTHORITY_PROOF = TEMPORAL_AUTHORITY_PROTECTED
INITIAL_OBSERVATION = authority-backed EXEC registry returns the exact supported skill/contract basis before snapshot binding
VERSION_REVISION_HASH_OR_CORRELATION = exact version set, schema/contract revision, CatalogRevision and execution-attempt correlation
MUTATION_WINDOW = from initial registry observation through DOM snapshot/manifest binding
RELEVANT_COMMIT_POINT = atomic snapshot/manifest basis-binding commit
INDEPENDENT_SECOND_OBSERVATION = authority is queried independently immediately before commit; the first returned object is not self-compared or reused
DRIFT_DETECTION = compare the second authoritative version/revision/basis observation with the initial observation and caller assertion
FAIL_CLOSED_BEHAVIOR = any drift, stale basis, unsupported version or caller mismatch returns canonical failure and commits no snapshot/manifest basis
STATE_PRESERVATION = prior snapshot/manifest state and historical basis remain unchanged; changed basis requires a new attempt
SEMANTIC_VALIDATION_OWNER = EXEC-001
CAS_OR_PHYSICAL_INTEGRITY_ROLE = DOM/PLAT may provide physical atomicity/integrity only; CAS is not semantic authority
PROOF_EVIDENCE = docs/tickets/SPEC-EXEC-001/evidence/TICKET-005/AC-EXEC-005-authoritative-binding.md; docs/tickets/SPEC-EXEC-001/evidence/TICKET-005/temporal-authority.md
```

## 14d. ACCEPTANCE_WITNESS_MATRIX

| NORMATIVE_BEHAVIOR | NORMATIVE_VERB | CONCRETE_OPERATION_COMMAND_OR_QUERY | STATE_OR_TRANSITION_AFFECTED | DIRECT_POSITIVE_TEST | DIRECT_NEGATIVE_OR_ISOLATION_TEST | EXPECTED_EVIDENCE_FILE | ACCEPTANCE_OWNER | REQUIRED_PRODUCER_OR_CAPABILITY | AUTHORITY_STATUS | CONTRACT_STATUS | LOCAL_TESTABILITY | PRODUCTIVE_AVAILABILITY | DEPENDENCY_CLASS | WITNESS_EXECUTABLE_AT_LOCAL_CLOSURE | EVIDENCE_TYPE |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Exact authoritative binding | resolve/freeze | C-EXEC-005 / AC-EXEC-005 | snapshot/manifest basis | authority returns exact versions and frozen basis retained | arbitrary caller versions cannot establish basis | `docs/tickets/SPEC-EXEC-001/evidence/TICKET-005/AC-EXEC-005-authoritative-binding.md` | EXEC-001-TICKET-005 | local authority-binding fixture | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |
| Caller authority rejection | reject | snapshot submission boundary | snapshot state | assertion matching authority accepted | mismatch/non-empty arbitrary caller value rejected with no mutation | `docs/tickets/SPEC-EXEC-001/evidence/TICKET-005/AC-EXEC-005-caller-authority.md` | EXEC-001-TICKET-005 | local authority-binding fixture | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |
| Basis immutability and temporal drift | observe/freeze/reject | post-start registry mutation and pre-commit re-observation | started snapshot/manifest | independent second observation matches and basis commits | drift between observations fails closed; later registry cannot rewrite frozen basis | `docs/tickets/SPEC-EXEC-001/evidence/TICKET-005/temporal-authority.md` | EXEC-001-TICKET-005 | local authority-binding fixture | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |

## 15. Implementation Constraints

Caller values cannot become authority; preserve DOM identity/lifecycle; reject stale/mismatched basis without mutation; no silent version conversion. Do not design the DOM aggregate.

## 16. Acceptance Criteria

1. `AC-EXEC-005`: activity start obtains exact versions from the authority-backed EXEC basis; caller-selected values cannot establish snapshot state and later registry mutation cannot alter it.

`TESTABLE: YES`; `LOCALLY_PROVABLE: YES` for the EXEC binding contribution.

## 17. Acceptance / Proof Role

`LOCAL_ACCEPTANCE_OWNER: YES`; `FINAL_PROOF_OWNER: YES` for AC-EXEC-005. Contributes to CP-EXEC-04 and integrated DOM convergence.

## 18. Required Tests

Authority-backed binding; arbitrary/mismatched caller values; registry mutation after start; immutable basis; no snapshot mutation on rejection; direct contradiction regression in existing DOM consumer.

## 19. Completion Evidence

Evidence files `docs/tickets/SPEC-EXEC-001/evidence/TICKET-005/AC-EXEC-005-authoritative-binding.md`, `AC-EXEC-005-caller-authority.md` and `temporal-authority.md`, containing convergence, caller-authority negative evidence, no-mutation assertions and test output. Local evidence is producible after TICKET-002.

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

`CUTOVER`; changed/incompatible basis uses a new DOM attempt/identity. Existing historical snapshots remain unchanged; caller authority is retired at the seam.

## 22. Risks

Caller-authority bypass, current-registry reinterpretation and accidental DOM ownership transfer. Direct contradiction and boundary tests mitigate these risks.

## 23. Implementation Wave

`WAVE: 2`.

## 24. Parallelization

`SERIAL_REQUIRED` at the existing snapshot consumer seam after TICKET-002.

## 25. Handoff After Completion

Independent ticket audit validates this ticket; exact-basis evidence contributes to CP-EXEC-04 and integrated DOM snapshot proof.

## 26. Ticket Local Closure

`TICKET_LOCAL_CLOSURE = YES`; local EXEC binding witnesses close independently after TICKET-002. Productive DOM integration remains integrated proof.
