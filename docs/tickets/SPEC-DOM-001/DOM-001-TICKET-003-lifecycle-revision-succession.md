# DOM-001-TICKET-003 — Decision lifecycle, revision, and immutability

## 1. Status

`STATUS: BLOCKED`  
`ISSUE_DECOMPOSITION_READINESS: ISSUE_READY`  
`INITIAL_DAG_STATE: BLOCKED`  
`BLOCKED_BY: DOM-001-TICKET-002`
`CURRENT_DAG_STATE: BLOCKED`
`DEPENDS_ON: DOM-001-TICKET-001, DOM-001-TICKET-002`  
`UNBLOCKS: DOM-001-TICKET-010, DOM-001-TICKET-012`

## 2. Source Traceability

- Accepted ADR authority: `ADR-0001` revision 3, SHA-256 `33705082B9D2F46E638CD93BDF27CA676CFC6181A2684AD583E4501F5D06D50D` — separate lifecycles, revision succession, and immutability.
- Portfolio: `docs/specs/SPEC-PORTFOLIO-001-organization.md` — O-006, O-007, O-008.
- Component SPEC: `docs/specs/SPEC-DOM-001-workflow-authority-and-governance.md` — DOM-LIFE-001, DOM-REV-001, DOM-IMMUT-001.
- Gap Matrix: `docs/specs/gap-matrices/SPEC-DOM-001-implementation-gap-matrix.md` — GAP-007, GAP-008, GAP-009.
- Gap Matrix Audit: `docs/specs/gap-matrices/audits/SPEC-DOM-001-implementation-gap-matrix-audit.md`.
- Implementation Plan: `docs/specs/implementation-plans/SPEC-DOM-001-implementation-plan.md` — DOM-IMP-03.
- Plan Audit: `docs/specs/implementation-plans/audits/SPEC-DOM-001-implementation-plan-audit.md`.

## 3. Authority / Scope

Approved owner: DOM `CANONICAL_OWNER`. Primary owning specification/domain: `SPEC-DOM-001`. Local ownership covers lifecycle separation, revision, reciprocal succession, semantic history, and derived eligibility invalidation. Foreign capabilities consumed: PLAT evidence reference and OPS historical projection, both non-blocking.

## 4. Portfolio Obligation Coverage

`O-006` separate decision/realization lifecycles; `O-007` revision on remediation; `O-008` implemented ADR immutability and succession.

## 5. Gap / Requirement / Acceptance Coverage

Gaps: `GAP-007`, `GAP-008`, `GAP-009`. Requirements: `DOM-LIFE-001`, `DOM-REV-001`, `DOM-IMMUT-001`. Local acceptance: `AC-DOM-006`, `AC-DOM-007`, `AC-DOM-008`. Integrated contribution: `AC-DOM-052`; final owner TICKET-012.

## 6. Implementation Unit

`DOM-IMP-03 — Decision lifecycle, revision, and immutability`. Formation reason: `SHARED_CUTOVER + SHARED_INVARIANT`. No split or merge.

## 7. Goal

Implement separate decision/realization lifecycles and revision/immutability rules for remediation and implemented ADR succession.

## 8. Validated Implementation Delta

`OBSERVED`: prototype statuses and reversible mutation scenarios only.  
`REQUIRED`: independent lifecycles, new revision on remediation, immutable implemented ADR, and reciprocal successor relation.  
`DELTA`: no productive authority transition.

## 9. Required Behavior

Prevent cross-lifecycle mutation; create a successor revision on normative remediation; invalidate prior derived eligibility; reject silent rewrite/reprocessing of implemented ADRs; supply stable history to downstream plans, evidence, and projections.

## 10. Does Not Implement

PLAT evidence persistence, OPS projection, repository migration, foreign compatibility retirement, or downstream invalidation registry, which is owned by TICKET-010.

## 11. Repository Evidence

`src/domain/identity.ts` revision primitives are reusable supporting semantics only; no productive ADR lifecycle exists. Prototype succession tests remain scenario references.

## 12. Expected Repository Impact

Production code: lifecycle/revision records and transition boundary.  
Persistence/schema: semantic history reference only.  
Integration: PLAT/OPS mapping seams.  
Tests: lifecycle, revision, succession, stale, replay, and regression tests.  
Legacy/cutover: preserved historical reads and invalidated prior eligibility.  
Generated contracts: none locally required.

## 13. Dependencies

Internal: `DOM-001-TICKET-001`, `DOM-001-TICKET-002`. Cross-SPEC: `SPEC-PLAT-001` durable evidence reference and `SPEC-OPS-001` historical projection; non-blocking.

## 14. Blocking Conditions

Blocked until TICKET-002 completes. No foreign blocker is unresolved.

## 14a. Authority Consumption Proof

| Field | Proof |
|---|---|
| Proof ID / authority existence | `ACP-DOM-03`; `YES` — `ADR-0001` revision 3, SHA-256 `33705082B9D2F46E638CD93BDF27CA676CFC6181A2684AD583E4501F5D06D50D`. |
| Scoped decision / truth owner | `ADR0001-D004`; DOM owns decision/realization lifecycles, revision succession, and immutable implemented records. |
| Semantic source | `DOM-LIFE-001`, `DOM-REV-001`, `DOM-IMMUT-001`; `GAP-007`–`GAP-009`. |
| Consumed interface / returned data | Lifecycle and remediation command ports; returns independent state, successor/predecessor lineage, and immutable record outcome. |
| Revision/version transport | New revision carries reciprocal lineage and invalidates prior eligibility; implemented record hash remains stable. |
| Failure / stale semantics | Cross-lifecycle mutation, stale eligibility, missing reciprocal link, or implemented-record mutation rejects with no rewrite. |
| Productive availability / evidence | `YES` for local lifecycle/revision aggregates and explicit PLAT/OPS reference fixtures; foreign projection remains non-blocking. Evidence: `T3-AC1`–`T3-AC3`. |
| Result | `AUTHORITY_CONSUMABLE`. |

## 14b. Producer / Consumer Contract Proof

| Field | Proof |
|---|---|
| Contracts / producers / consumer | `PCP-PLAT-03` supplies operational evidence references and `PCP-REPO-01` legacy mapping; DOM consumes references and owns lifecycle meaning. |
| Interface / input / returned data | Lifecycle/revision reference port; input is canonical ADR revision and adjustment; output is successor lineage, status, and history reference. |
| Revision/version transport | Successor/predecessor revision IDs and reciprocal lineage are preserved in every returned record. |
| Failure / not-found / stale | Missing predecessor, stale revision, invalid eligibility, or mutation of implemented record returns canonical rejection without state loss. |
| Availability / local proof boundary | Local semantic aggregate and deterministic evidence/mapping fixtures are available; physical persistence/projection is foreign and non-blocking. |
| Evidence / result | Lifecycle independence, succession, replay, and immutability witnesses `T3-AC1`–`T3-AC3`; PRODUCER_CONSUMER_CONTRACT: PROVEN_LOCAL_FIXTURE, RESULT: CONTRACT_DEFINED_LOCAL_WITNESS_ONLY. |

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
`PRODUCER_CONSUMER_CONTRACT_PROOF_FIELDS`: `PRODUCER = SPEC-PLAT-001,
SPEC-REPO-001`; `PRODUCED_CONTRACT = operational evidence references and
explicit legacy mapping`; `AUTHORITY_OWNER = SPEC-DOM-001`; `CONSUMER = TICKET-003`;
`CONSUMED_CAPABILITY = lifecycle history and legacy-reference mapping`;
`AVAILABILITY_CONDITION = local semantic aggregate and deterministic reference
fixtures available; physical persistence/projection is non-blocking`;
`DEPENDENCY_EDGE = PLAT/REPO reference contract → TICKET-003 history boundary`;
`PROOF_EVIDENCE = docs/tickets/SPEC-DOM-001/evidence/TICKET-003/AC-DOM-007-revision.md`.

## 14c. ACCEPTANCE_WITNESS_MATRIX

| AC | Normative behavior / verb | Concrete operation | State/transition | Direct positive test | Direct negative/isolation test | Expected evidence | Acceptance owner |
|---|---|---|---|---|---|---|---|
| AC-DOM-006 | Transition decision and realization lifecycles independently | lifecycle command | decision/realization state | `T3-AC1-P` independent transition test | `T3-AC1-N` cross-lifecycle mutation attempt | `docs/tickets/SPEC-DOM-001/evidence/TICKET-003/AC-DOM-006-lifecycle.md` | TICKET-003 |
| AC-DOM-007 | Remediate with new revision and reciprocal lineage | remediation command | revision succession | `T3-AC2-P` successor/history test | `T3-AC2-N` stale eligibility or missing reciprocal link | `docs/tickets/SPEC-DOM-001/evidence/TICKET-003/AC-DOM-007-revision.md` | TICKET-003 |
| AC-DOM-008 | Reject mutation of implemented ADR | immutable update command | implemented terminal record | `T3-AC3-P` terminal record remains stable | `T3-AC3-N` metadata/document mutation attempt | `docs/tickets/SPEC-DOM-001/evidence/TICKET-003/AC-DOM-008-immutability.md` | TICKET-003 |

### Temporal Authority Proof

`TEMPORAL_AUTHORITY_PROOF = TAP-03`; source: Plan `DOM-IMP-03` Temporal
Authority Preconditions. Initial observation is accepted ADR revision/content;
the mutation window ends at remediation commit; an independent reobservation
at commit detects changed revision/content; drift fails closed and preserves the
prior record. DOM owns semantic invalidation and PLAT owns atomic record
storage. Evidence: `docs/tickets/SPEC-DOM-001/evidence/TICKET-003/temporal-authority.md`.

## 15. Implementation Constraints

Preserve historical lineage, reciprocal succession, immutable implemented records, eligibility invalidation, and separate decision versus realization state.

## 16. Acceptance Criteria

1. Decision and realization lifecycle operations are independent and cannot
   silently mutate one another.
2. Remediation produces a new revision with reciprocal lineage and invalidates
   derived eligibility.
3. Implemented ADR mutation is rejected and operational fields remain in the
   persistent record boundary. `LOCAL_PROVABILITY = YES`.

All criteria are `TESTABLE: YES` and `LOCALLY_PROVABLE: YES` after prerequisites.

## 17. Acceptance / Proof Role

`CONTRIBUTOR: YES` to AC-DOM-052. `LOCAL_ACCEPTANCE_OWNER: YES` and `FINAL_PROOF_OWNER: YES` for AC-DOM-006–008. Not final owner of AC-DOM-052.

## 18. Required Tests

`LOCAL_TEST_EVIDENCE`: domain-invariant, stale-protection, compatibility, historical-replay, and regression tests for lifecycle independence, revision invalidation, silent rewrite rejection, and reciprocal links. `RECOVERY_EVIDENCE`: successor/history rehydration preserves reciprocal lineage and terminal immutability.

## 19. Completion Evidence

Revision/succession code path; immutable record proof; historical relation fixtures; and fail-closed mutation tests. `EXPECTED_EVIDENCE_FILES`: `docs/tickets/SPEC-DOM-001/evidence/TICKET-003/AC-DOM-006-lifecycle.md`, `AC-DOM-007-revision.md`, `AC-DOM-008-immutability.md`, `temporal-authority.md`.

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

`PRESERVE_LEGACY_READS`; `RETIRE_LEGACY_WRITES` for silent ADR mutation; old semantic records remain readable and prior eligibility is invalidated. Physical evidence migration is foreign-owned.

## 22. Risks

Silent rewrite or history loss. Mitigation: immutable boundary and successor-link assertions.

## 23. Implementation Wave

`WAVE: 3`.

## 24. Parallelization

`SAFE_WITH_COORDINATION`; blocked by TICKET-001/002 and unblocks TICKET-010/012.

## 25. Handoff After Completion

Independent ticket audit may validate this ticket; its revision/invalidation evidence is consumed by TICKET-010 and the final evaluator.

## 26. Ticket Local Closure

`TICKET_LOCAL_CLOSURE = YES`. Physical persistence and foreign projection are not required for local closure.
