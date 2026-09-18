# EXEC-001-TICKET-003 — Registry entry identity and semantic reconstruction

## 1. Status

`STATUS: BLOCKED`

```text
ISSUE_DECOMPOSITION_READINESS: ISSUE_READY
INITIAL_DAG_STATE: BLOCKED
EXECUTION_READY: FALSE
BLOCKED_BY: EXEC-001-TICKET-002
DEPENDS_ON: EXEC-001-TICKET-002
UNBLOCKS: EXEC-001-TICKET-007, EXEC-001-TICKET-009
```

## 2. Source Traceability

ADR `ADR-0003`, `ADR-0010`, and consumed `DOM-ID-001`; Portfolio `O-020`; SPEC `EXEC-REGISTRY-004`; Gap Matrix `GAP-007`; Plan `EXEC-IMP-03`; Plan Audit `IMPLEMENTATION_PLAN_CONFORMANT`. Authority paths are the canonical Portfolio, SPEC, Gap Matrix, Gap Matrix Audit, Plan and Plan Audit listed in the ticket index.

## 3. Authority / Scope

`EXEC-001 / CANONICAL_OWNER` owns semantic registry identity, scoped key validation, references, revision continuity, rehydration and fail-closed invalid-material behavior. DOM owns `RepositoryId`; PLAT owns physical storage/integrity/order/recovery.

## 4. Portfolio Obligation Coverage

`O-020` — versioned registry, identity/reconstruction and catalog authority.

## 5. Gap / Requirement / Acceptance Coverage

`GAP-007`; `EXEC-REGISTRY-004`; `AC-EXEC-019`; conformance `C-EXEC-018`, `C-EXEC-020`; this ticket is Final Proof Owner.

## 6. Implementation Unit

`EXEC-IMP-03 — Registry entry identity and semantic reconstruction`; 1:1; no split/merge.

## 7. Goal

Make NORMAL/BOOTSTRAP registry entry identity, attachment, continuity and fail-closed semantic reconstruction locally provable without owning physical storage.

## 8. Validated Implementation Delta

`OBSERVED`: no productive REGISTRY_ENTRY, scoped catalog basis or semantic rehydration validator; prototype is in-memory. `REQUIRED`: canonical scope/key, continuity, references and no-mutation rejection. `DELTA`: registry semantic identity/reconstruction authority is absent.

## 9. Required Behavior

1. Resolve NORMAL entries only by the complete key including DOM `RepositoryId`; keep BOOTSTRAP independently system-scoped.
2. Rehydrate only validated material and reject duplicate, detached, corrupt, stale, cross-repository, skipped or inconsistent material without mutation.
3. Preserve the canonical distinction between an unknown capability (`UNKNOWN_CAPABILITY`) and a known but incompatible capability/basis (`INCOMPATIBLE_CAPABILITY`); invalid registry material remains `CONTRACT_INVALID`.

## 10. Does Not Implement

DOM identity creation/resolution; PLAT serialization, database, integrity, ordering or recovery; REPO enablement; registry retirement; downstream mappings.

## 11. Repository Evidence

No productive registry persistence or validator exists. Prototype in-memory data cannot prove persistence, reconstruction or scope isolation.

## 12. Expected Repository Impact

Production: semantic registry-entry/reconstruction boundary. Persistence/schema: typed physical-material seam; mechanism unfrozen. Integration: DOM `RepositoryId` and PLAT material. Tests: two-repository isolation, NORMAL/BOOTSTRAP scope, continuity, digest/reference/attachment and no-mutation rejection. Legacy/cutover: `HISTORICAL_REPLAY`; frozen basis preserved. Generated contracts: registry material/validation result.

## 13. Dependencies

Internal: TICKET-002. Cross-SPEC `DOM-EXEC-IDENTITY-SNAPSHOT` and `PLAT-EXEC-PERSISTED-MATERIAL` are `REQUIRED_FOR_INTEGRATED_PROOF` only. `UNBLOCKS` as in §1.

## 14. Blocking Conditions

Blocked solely by TICKET-002. Foreign physical availability does not block local semantic closure.

## 14a. Authority Consumption Proof

```text
PROOF_ID = ACP-EXEC-03
AUTHORITY_EXISTENCE = YES; EXEC-REGISTRY-004, DOM-ID-001 and PLAT boundary
TRUTH_OWNER = EXEC-001 for semantics; DOM for RepositoryId; PLAT for physical material
CONSUMER_CONTRACT = scoped registry key, CatalogRevision, source/digest/reference/continuity validation
LOCAL_TESTABILITY = YES via deterministic semantic reconstruction fixture
PRODUCTIVE_AVAILABILITY = NO for foreign DOM/PLAT producers
DEPENDENCY_CLASS = REQUIRED_FOR_INTEGRATED_PROOF
BLOCKING_EFFECT = integrated proof only; TICKET-002 is the current internal blocker
CAPABILITY_SUMMARY_STATUS = CONTRACT_DEFINED for unavailable foreign producers; local reconstruction fixture is contract-testable
RESULT = AUTHORITY_CONSUMPTION_GAP for unavailable productive DOM/PLAT producers; local fixture proves semantic behavior only
```

## 14b. Producer / Consumer Contract Proof

| Field | DOM-EXEC-IDENTITY-SNAPSHOT | PLAT-EXEC-PERSISTED-MATERIAL |
|---|---|---|
| Authority owner / producer | SPEC-DOM-001 / DOM canonical resolver | SPEC-PLAT-001 / journal/material reader |
| Produced contract / consumer | RepositoryId and identity references / T003 | ordered integrity-checked material / T003 |
| Semantic status | DEFINED | DEFINED |
| Authority/contract status | DEFINED/DEFINED | DEFINED/DEFINED |
| Local testability / productive availability | NO/NO | NO/NO |
| Failure semantics | unknown/detached/stale/mismatched fails closed | corrupt/missing/out-of-order/digest mismatch fails closed |
| Version/revision transport | RepositoryId and CatalogRevision unchanged | physical revision/digest/order unchanged; no semantic promotion |
| Class / edge | REQUIRED_FOR_INTEGRATED_PROOF / EXEC→DOM | REQUIRED_FOR_INTEGRATED_PROOF / PLAT→EXEC |
| Availability evidence | conformant DOM contract, no productive integrated runtime | approved PLAT boundary, no productive producer |

`AVAILABILITY_CONDITION = DOM identity and PLAT material are available at integrated reconstruction`; `BLOCKING_EFFECT = integrated proof only`; `DEPENDENCY_EDGE = DOM/PLAT producers → T003`; `FAILURE_SEMANTICS = detached, stale, corrupt, duplicate or out-of-order material fails closed without mutation`.

`PCP_CANONICAL_FIELDS = AUTHORITY_OWNER, PRODUCER, PRODUCED_CONTRACT, CONSUMER, CONSUMED_CAPABILITY, SEMANTIC_STATUS, LOCAL_TESTABILITY, PRODUCTIVE_AVAILABILITY, AVAILABILITY_EVIDENCE, AVAILABILITY_CONDITION, DEPENDENCY_CLASS, DEPENDENCY_EDGE, BLOCKING_EFFECT`; DOM and PLAT records above are the complete handoff.

## 14c. ACCEPTANCE_WITNESS_MATRIX

| NORMATIVE_BEHAVIOR | NORMATIVE_VERB | CONCRETE_OPERATION_COMMAND_OR_QUERY | STATE_OR_TRANSITION_AFFECTED | DIRECT_POSITIVE_TEST | DIRECT_NEGATIVE_OR_ISOLATION_TEST | EXPECTED_EVIDENCE_FILE | ACCEPTANCE_OWNER | REQUIRED_PRODUCER_OR_CAPABILITY | AUTHORITY_STATUS | CONTRACT_STATUS | LOCAL_TESTABILITY | PRODUCTIVE_AVAILABILITY | DEPENDENCY_CLASS | WITNESS_EXECUTABLE_AT_LOCAL_CLOSURE | EVIDENCE_TYPE |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Scoped registry identity | create/lookup/rehydrate | C-EXEC-018 / AC-EXEC-019 | catalog entry/basis | two NORMAL repositories resolve only locally; BOOTSTRAP independent | foreign RepositoryId/key substitution rejected | `docs/tickets/SPEC-EXEC-001/evidence/TICKET-003/AC-EXEC-019-scoped-identity.md` | EXEC-001-TICKET-003 | local reconstruction fixture | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |
| Semantic reconstruction | rehydrate | C-EXEC-020 | registry basis | valid source/digest/reference/revision material rehydrates | detached, corrupt, cross-repository or skipped/out-of-order material rejects `CONTRACT_INVALID`; no mutation | `docs/tickets/SPEC-EXEC-001/evidence/TICKET-003/AC-EXEC-020-reconstruction-rejection.md` | EXEC-001-TICKET-007 | local reconstruction fixture | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |
| Stale registry basis | rehydrate/reject | C-EXEC-020 / AC-EXEC-019 | registry basis | frozen `CatalogRevision` material rehydrates | current, newer or foreign-revision material presented for the frozen basis rejects `CONTRACT_INVALID`; no mutation | `docs/tickets/SPEC-EXEC-001/evidence/TICKET-003/AC-EXEC-019-stale-basis.md` | EXEC-001-TICKET-003 | local reconstruction fixture | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |
| Inconsistent registry material | rehydrate/reject | C-EXEC-020 / AC-EXEC-019 | registry basis | matching source, digest, references and revision rehydrate | source, digest, reference or revision inconsistency rejects `CONTRACT_INVALID`; no mutation | `docs/tickets/SPEC-EXEC-001/evidence/TICKET-003/AC-EXEC-019-inconsistent-material.md` | EXEC-001-TICKET-003 | local reconstruction fixture | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |
| Canonical capability outcomes | resolve/reject | C-EXEC-018/020 / AC-EXEC-019 | resolution result | known compatible material resolves | unknown capability yields `UNKNOWN_CAPABILITY`; known incompatible version/schema/role/basis yields `INCOMPATIBLE_CAPABILITY`; codes remain distinct | `docs/tickets/SPEC-EXEC-001/evidence/TICKET-003/AC-EXEC-019-capability-outcomes.md` | EXEC-001-TICKET-003 | local reconstruction fixture | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |
| Continuity and immutability | preserve/reject | catalog revision operation | scoped catalog basis | contiguous revision remains stable | duplicate/conflict/out-of-order cannot mutate existing basis | `docs/tickets/SPEC-EXEC-001/evidence/TICKET-003/AC-EXEC-020-continuity.md` | EXEC-001-TICKET-007 | local reconstruction fixture | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |
| Failure isolation | reject | invalid material path | registry state | valid material remains unchanged | partial mutation never occurs on rejection | `docs/tickets/SPEC-EXEC-001/evidence/TICKET-003/AC-EXEC-020-no-mutation.md` | EXEC-001-TICKET-007 | EXEC-001-TICKET-003 | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |

## 15. Implementation Constraints

Use complete scoped identity; distinguish create from rehydrate; validate attachment, source, digest, references and continuity; reject unknown/detached/corrupt material with no mutation. Physical CAS/recovery is not semantic proof.

## 16. Acceptance Criteria

1. `AC-EXEC-019`: NORMAL uses the complete key including DOM `RepositoryId`; BOOTSTRAP remains independently system-scoped and uses the frozen `CatalogRevision`.
2. `C-EXEC-020`/`AC-EXEC-019`: invalid, duplicate, detached, cross-repository, skipped and inconsistent material rejects `CONTRACT_INVALID` without mutation; an explicitly stale frozen-basis input is rejected the same way, while unknown and known-incompatible capability outcomes remain `UNKNOWN_CAPABILITY` and `INCOMPATIBLE_CAPABILITY` respectively.

Both are locally testable after TICKET-002.

## 17. Acceptance / Proof Role

`LOCAL_ACCEPTANCE_OWNER: YES`; `FINAL_PROOF_OWNER: YES` for AC-EXEC-019. Contributes reconstruction evidence to AC-EXEC-020 and CP-EXEC-02.

## 18. Required Tests

Two-RepositoryId isolation; NORMAL/BOOTSTRAP scope; duplicate create; wrong attachment; digest/source/schema/reference mismatch; explicit stale frozen-basis rejection; explicit inconsistent-material rejection; skipped/out-of-order revision; no-mutation-on-failure; distinct `UNKNOWN_CAPABILITY` versus `INCOMPATIBLE_CAPABILITY` outcomes; reconstruction continuity.

## 19. Completion Evidence

Evidence files under `docs/tickets/SPEC-EXEC-001/evidence/TICKET-003/` for AC-EXEC-019 reconstruction and AC-EXEC-020 rejection, stale-basis, inconsistent-material, capability-outcome, continuity and no-mutation witnesses, containing identity/reconstruction field assertions and executed tests. Local evidence is producible after TICKET-002.

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

`HISTORICAL_REPLAY`; frozen scoped catalog basis remains stable. No registry retirement or cross-repository conversion.

## 22. Risks

Repository identity collapse, direct untrusted materialization, physical revision mistaken for domain continuity and partial mutation. Negative reconstruction witnesses address each.

## 23. Implementation Wave

`WAVE: 3`.

## 24. Parallelization

`SAFE_WITH_COORDINATION` after TICKET-002; registry persistence seam is shared.

## 25. Handoff After Completion

Independent ticket audit may validate this ticket. Completion releases TICKET-007's prerequisite and contributes the TICKET-009 replay prerequisite.

## 26. Ticket Local Closure

`TICKET_LOCAL_CLOSURE = YES`; semantic identity/reconstruction evidence, explicit stale/inconsistent rejection and canonical capability-outcome witnesses are locally executable after TICKET-002. PLAT physical proof remains integrated-only.
