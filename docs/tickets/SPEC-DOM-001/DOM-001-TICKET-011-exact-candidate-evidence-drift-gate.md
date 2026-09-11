# DOM-001-TICKET-011 — Exact candidate evidence and drift gate

## 1. Status

`STATUS: BLOCKED`  
`ISSUE_DECOMPOSITION_READINESS: ISSUE_READY`  
`INITIAL_DAG_STATE: BLOCKED`  
`BLOCKED_BY: DOM-001-TICKET-007`
`CURRENT_DAG_STATE: BLOCKED`
`DEPENDS_ON: DOM-001-TICKET-001, DOM-001-TICKET-007`  
`UNBLOCKS: DOM-001-TICKET-012`

## 2. Source Traceability

- Accepted ADR authority: `ADR-0009` revision 3, SHA-256 `4AB502AEA4F09AFE2C5FA33BFB6C5EE0D11E2D8F9AF65F244209CE1FAC935761` — exact candidate basis, hash-linked evidence, and pre-publication drift rejection.
- Portfolio: `docs/specs/SPEC-PORTFOLIO-001-organization.md` — O-054.
- Component SPEC: `docs/specs/SPEC-DOM-001-workflow-authority-and-governance.md` — DOM-AUDIT-006.
- Gap Matrix: `docs/specs/gap-matrices/SPEC-DOM-001-implementation-gap-matrix.md` — GAP-022.
- Gap Matrix Audit: `docs/specs/gap-matrices/audits/SPEC-DOM-001-implementation-gap-matrix-audit.md`.
- Implementation Plan: `docs/specs/implementation-plans/SPEC-DOM-001-implementation-plan.md` — DOM-IMP-11.
- Plan Audit: `docs/specs/implementation-plans/audits/SPEC-DOM-001-implementation-plan-audit.md`.

## 3. Authority / Scope

Approved owner: DOM `CANONICAL_OWNER`. Primary owning specification/domain: `SPEC-DOM-001`. Local ownership covers candidate identity, semantic evidence binding, and drift-invalidating gate. Foreign capabilities consumed: GIT evidence production and PLAT/OPS physical preservation/replay, all non-blocking locally.

## 4. Portfolio Obligation Coverage

`O-054` exact base/head/tree binding, hash-linked evidence, and invalidation on drift before publication.

## 5. Gap / Requirement / Acceptance Coverage

Gap: `GAP-022`. Requirement: `DOM-AUDIT-006`. Local acceptance: `AC-DOM-054`. Integrated contribution: `AC-DOM-052`; final owner TICKET-012.

## 6. Implementation Unit

`DOM-IMP-11 — Exact candidate evidence and drift gate`. Formation reason: `SHARED_INTEGRATION_SEAM + SHARED_CUTOVER`. No split or merge.

## 7. Goal

Bind canonical publication/conformance identity to exact base, head, tree, and hash-linked evidence, invalidating authorization on drift.

## 8. Validated Implementation Delta

`OBSERVED`: deterministic mock hashes/evidence IDs.  
`REQUIRED`: productive exact candidate identity, hash-linked semantic binding, and drift-invalidating gate.  
`DELTA`: no productive DOM evidence boundary exists.

## 9. Required Behavior

Bind candidate approval to exact base/head/tree, conformance run, and correlated evidence; reject or invalidate any drift before publication; retain identity links; consume GIT evidence without executing Git.

## 10. Does Not Implement

Git/GitHub operations, remote evidence generation, PLAT journal/storage/replay, OPS export/projection, or publication transport.

## 11. Repository Evidence

No productive exact-candidate symbols; prototype publication ledger is non-authoritative. Add the exact-basis gate and integration seams.

## 12. Expected Repository Impact

Production code: candidate/conformance gate and evidence binding boundary.  
Persistence/schema: hash-linked preservation seam.  
Integration: GIT evidence and PLAT/OPS reference mapping.  
Tests: exact binding, each drift dimension, evidence identity, stale, idempotency, compatibility, conformance, and regression tests.  
Legacy/cutover: historical replay and cutover.  
Generated contracts: candidate/evidence gate result.

## 13. Dependencies

Internal: `DOM-001-TICKET-001`, `DOM-001-TICKET-007`. Cross-SPEC: GIT evidence and PLAT/OPS preservation/replay, non-blocking locally.

## 14. Blocking Conditions

Blocked until the publication gate contract completes. No external blocker exists.

## 14a. Authority Consumption Proof

| Field | Proof |
|---|---|
| Proof ID / authority existence | `ACP-DOM-11`; `YES` — `ADR-0009` revision 3, SHA-256 `4AB502AEA4F09AFE2C5FA33BFB6C5EE0D11E2D8F9AF65F244209CE1FAC935761`. |
| Scoped decision / truth owner | `ADR0009-D005`; DOM owns exact-basis authorization and semantic drift invalidation. |
| Semantic source | `DOM-AUDIT-006`; `GAP-022`. |
| Consumed interface / returned data | Candidate/evidence gate port; returns exact base/head/tree/hash binding and authorization or invalidation. |
| Revision/version transport | Candidate artifact/revision, base/head/tree, evidence hash, and observation timestamp are hash-linked. |
| Failure / not-found / stale semantics | Any basis/evidence drift, stale observation, self-comparison, or missing evidence rejects authorization without replacing the prior record. |
| Productive availability / evidence | `YES` for local exact-binding gate and deterministic GIT/PLAT/OPS fixtures; foreign evidence production is an integration seam, not a hidden blocker. Evidence: `T11-AC1`–`T11-AC2`. |
| Result | `AUTHORITY_CONSUMABLE`. |

## 14b. Producer / Consumer Contract Proof

| Field | Proof |
|---|---|
| Contracts / producers / consumer | `PCP-GIT-03` produces candidate evidence, `PCP-PLAT-08` preserves intent/evidence, and `PCP-OPS-01` projects records; DOM retains gate authority. |
| Interface / input / returned data | Evidence-binding interface; input is exact candidate and hash-linked evidence; output is correlated authorization or drift rejection. |
| Revision/version transport | Base/head/tree, artifact revision, evidence hash, and observation pair are returned unchanged and correlated. |
| Failure / not-found / stale | Missing evidence, any drift dimension, stale variable, self-comparison, or adapter-only success rejects authorization. |
| Availability / local proof boundary | Deterministic producer/projection fixtures and local gate are available; live GIT/PLAT/OPS systems are not required for local closure. |
| Evidence / result | `T11-AC1`–`T11-AC2` exact-binding, drift, concurrency, and recovery witnesses; PRODUCER_CONSUMER_CONTRACT: PROVEN_LOCAL_FIXTURE, RESULT: CONTRACT_DEFINED_LOCAL_WITNESS_ONLY. |

### Capability Availability Reconciliation

APPLICABLE_SHARED_CAPABILITY_RECORDS: CAP-PLAT-SNAPSHOT-PIPELINE-PROVENANCE, CAP-GIT-CANDIDATE-REMOTE-CONFIRMATION.
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
`PRODUCER_CONSUMER_CONTRACT_PROOF_FIELDS`: `PRODUCER = SPEC-GIT-001,
SPEC-PLAT-001, SPEC-OPS-001`; `PRODUCED_CONTRACT = candidate evidence,
preserved intent/evidence, and operational projection`; `AUTHORITY_OWNER =
SPEC-DOM-001`; `CONSUMER = TICKET-011`; `CONSUMED_CAPABILITY = exact evidence
binding and drift-gate inputs`; `AVAILABILITY_CONDITION = deterministic
producer/projection fixtures and local gate available; live systems are not
required for local closure`; `DEPENDENCY_EDGE = GIT/PLAT/OPS evidence →
TICKET-011 exact-basis gate`; `PROOF_EVIDENCE =
docs/tickets/SPEC-DOM-001/evidence/TICKET-011/AC-DOM-054-drift.md`.

## 14c. ACCEPTANCE_WITNESS_MATRIX

| AC | Normative behavior / verb | Concrete operation | State/transition | Direct positive test | Direct negative/isolation test | Expected evidence | Acceptance owner |
|---|---|---|---|---|---|---|---|
| AC-DOM-054 | Bind exact candidate basis and evidence | authorize candidate command | candidate authorization | `T11-AC1-P` exact base/head/tree/hash binding and restart recovery | `T11-AC1-N` changed basis or evidence hash rejects; prior record unchanged | `docs/tickets/SPEC-DOM-001/evidence/TICKET-011/AC-DOM-054-binding.md` | TICKET-011 |
| AC-DOM-054 | Independently revalidate and reject drift | pre-publication revalidation | authorization invalidation | `T11-AC2-P` independent unchanged second observation | `T11-AC2-N` base/head/tree/hash drift, self-comparison, stale variable, or adapter-only success rejects; concurrent retry is idempotent | `docs/tickets/SPEC-DOM-001/evidence/TICKET-011/AC-DOM-054-drift.md` | TICKET-011 |

### Temporal Authority Proof

`TEMPORAL_AUTHORITY_PROOF = TAP-11`; source: Plan `DOM-IMP-11` Temporal
Authority Preconditions. Initial observation captures base/head/tree/evidence;
the mutation window ends at the conformance/publication commit; an independent
second observation compares every binding; any drift fails closed and preserves
prior evidence. DOM is semantic owner and GIT is physical integrity owner; no
self-comparison or CAS-only proof is accepted. Evidence:
`docs/tickets/SPEC-DOM-001/evidence/TICKET-011/temporal-authority.md`.

## 15. Implementation Constraints

Exact base/head/tree and hash evidence are mandatory; drift invalidates authorization; foreign evidence remains distinct from canonical identity.

## 16. Acceptance Criteria

1. Candidate authorization records exact base/head/tree and hash-linked evidence.
2. Drift in any binding between observations rejects authorization and preserves
   the prior record. `LOCAL_PROVABILITY = YES`.

All criteria are `TESTABLE: YES` and `LOCALLY_PROVABLE: YES` after prerequisites.

## 17. Acceptance / Proof Role

`CONTRIBUTOR: YES` to AC-DOM-052. `LOCAL_ACCEPTANCE_OWNER: YES` and `FINAL_PROOF_OWNER: YES` for AC-DOM-054. Not final owner of AC-DOM-052.

## 18. Required Tests

`LOCAL_TEST_EVIDENCE`: unit/conformance tests for exact base/head/tree binding, evidence identity, and rejection of adapter-only success. `CONCURRENCY_EVIDENCE`: independent re-read and concurrent retry/idempotency tests. `RECOVERY_EVIDENCE`: exact binding and prior authorization survive restart; every base/head/tree/hash drift dimension rejects.

## 19. Completion Evidence

Candidate/evidence gate; exact-binding assertions; drift invalidation trace; and foreign mapping contract tests. `EXPECTED_EVIDENCE_FILES`: `docs/tickets/SPEC-DOM-001/evidence/TICKET-011/AC-DOM-054-binding.md`, `AC-DOM-054-drift.md`, `temporal-authority.md`.

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

`REMOVE_ALTERNATE_AUTHORITY`: prototype/local publication confirmation cannot authorize publication; `PRESERVE_LEGACY_READS` for old evidence references, which remain hash-linked. Foreign paths are not retired by DOM.

## 22. Risks

Identity mismatch or accepting stale evidence. Mitigation: base/head/tree matrix and hash-linked correlation assertions.

## 23. Implementation Wave

`WAVE: 5`.

## 24. Parallelization

`SAFE_WITH_COORDINATION`; blocked by TICKET-001/007 and unblocks TICKET-012.

## 25. Handoff After Completion

Independent ticket audit may validate this ticket; the final evaluator consumes exact candidate and drift evidence.

## 26. Ticket Local Closure

`TICKET_LOCAL_CLOSURE = YES`; integrated foreign preservation is outside local closure.
