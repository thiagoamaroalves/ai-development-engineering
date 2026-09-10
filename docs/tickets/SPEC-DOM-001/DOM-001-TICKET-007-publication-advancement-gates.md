# DOM-001-TICKET-007 — Publication vocabulary and advancement gates

## 1. Status

`STATUS: BLOCKED`  
`ISSUE_DECOMPOSITION_READINESS: ISSUE_READY`  
`INITIAL_DAG_STATE: BLOCKED`  
`BLOCKED_BY: DOM-001-TICKET-004, DOM-001-TICKET-005`  
`DEPENDS_ON: DOM-001-TICKET-004, DOM-001-TICKET-005`  
`UNBLOCKS: DOM-001-TICKET-010, DOM-001-TICKET-011, DOM-001-TICKET-012`

## 2. Source Traceability

- Accepted ADR authority: `ADR-0002` revision 3, SHA-256 `EF9289C6FCA4BBA73FCA53CA38C71DD19110EB1CFE948358A7CCA1FE14E177D9` — publication vocabulary, advancement gates, and cooperative cancellation.
- Portfolio: `docs/specs/SPEC-PORTFOLIO-001-organization.md` — O-014, O-015.
- Component SPEC: `docs/specs/SPEC-DOM-001-workflow-authority-and-governance.md` — DOM-PUB-001, DOM-ADV-001.
- Gap Matrix: `docs/specs/gap-matrices/SPEC-DOM-001-implementation-gap-matrix.md` — GAP-013, GAP-016.
- Gap Matrix Audit: `docs/specs/gap-matrices/audits/SPEC-DOM-001-implementation-gap-matrix-audit.md`.
- Implementation Plan: `docs/specs/implementation-plans/SPEC-DOM-001-implementation-plan.md` — DOM-IMP-07.
- Plan Audit: `docs/specs/implementation-plans/audits/SPEC-DOM-001-implementation-plan-audit.md`.

## 3. Authority / Scope

Approved owner: DOM `CANONICAL_OWNER`. Primary owning specification/domain: `SPEC-DOM-001`. Local ownership covers publication vocabulary, formal verdict gates, pause/cancel semantics, independent progress, and remote-effect distinction. Foreign capability consumed: GIT publication execution/evidence/confirmation, non-blocking.

## 4. Portfolio Obligation Coverage

`O-014` distinct publication vocabulary; `O-015` verdict-gated independent advancement and cooperative cancellation.

## 5. Gap / Requirement / Acceptance Coverage

Gaps: `GAP-013`, `GAP-016`. Requirements: `DOM-ADV-001`, `DOM-PUB-001`. Local acceptance: `AC-DOM-014`, `AC-DOM-015`. Integrated contribution: `AC-DOM-052`; final owner TICKET-012.

## 6. Implementation Unit

`DOM-IMP-07 — Publication vocabulary and advancement gates`. Formation reason: `SHARED_AUTHORITY + SHARED_INTEGRATION_SEAM`. No split or merge.

## 7. Goal

Implement canonical publication vocabulary and formal-verdict-gated, independent, cooperative advancement semantics.

## 8. Validated Implementation Delta

`OBSERVED`: mock publication states and advancement guards.  
`REQUIRED`: productive candidate/approval/integration/PR/merge/remote-confirmation distinction and verdict-gated advancement.  
`DELTA`: no productive boundary exists.

## 9. Required Behavior

Keep `PR_MERGED` distinct from `REMOTE_PUBLICATION_CONFIRMED`; reject advancement without verdict or closed dependency; model independent progress and cooperative pause/cancel without reverting remote effects; accept foreign publication evidence without executing Git.

## 10. Does Not Implement

Git/GitHub execution, push/PR/merge, remote confirmation evidence, scheduler capacity, or UI/OPS presentation.

## 11. Repository Evidence

No productive publication/advancement authority was found; prototype publication states are scenario evidence only. Add the DOM vocabulary/gate boundary and direct gate tests.

## 12. Expected Repository Impact

Production code: publication/advancement state and command/event boundary.  
Persistence/schema: semantic evidence mapping only.  
Integration: GIT evidence consumption.  
Tests: vocabulary, verdict gates, independent progress, pause/cancel, remote-effect preservation, idempotency, and regression tests.  
Legacy/cutover: new canonical path.  
Generated contracts: publication vocabulary and gate result contract.

## 13. Dependencies

Internal: `DOM-001-TICKET-004`, `DOM-001-TICKET-005`. Cross-SPEC: `SPEC-GIT-001` executes publication and supplies evidence; non-blocking locally.

## 14. Blocking Conditions

Blocked until state and command boundaries complete. No foreign blocker exists.

## 14a. Authority Consumption Proof

| Field | Proof |
|---|---|
| Proof ID / authority existence | `ACP-DOM-07`; `YES` — `ADR-0002` revision 3, SHA-256 `EF9289C6FCA4BBA73FCA53CA38C71DD19110EB1CFE948358A7CCA1FE14E177D9`. |
| Scoped decision / truth owner | `ADR0002-D005`, `ADR0002-D006`; DOM owns publication states, verdict gates, independence, and cancellation meaning. |
| Semantic source | `DOM-PUB-001`, `DOM-ADV-001`; `GAP-013`, `GAP-016`. |
| Consumed interface / returned data | Publication/advancement command port; returns distinct state or canonical rejection with verdict/dependency reason. |
| Revision/version transport | Candidate, verdict, dependency closure, and publication evidence carry exact artifact/revision correlation. |
| Failure / stale semantics | Missing verdict/closure, state conflation, non-cooperative cancellation, stale candidate, or remote rollback attempt rejects without local advance. |
| Productive availability / evidence | `YES` for local publication vocabulary/gate boundary and GIT evidence fixture; remote Git execution remains foreign. Evidence: `T7-AC1`–`T7-AC2`. |
| Result | `AUTHORITY_CONSUMABLE`. |

## 14b. Producer / Consumer Contract Proof

| Field | Proof |
|---|---|
| Contract / producer / consumer | `PCP-GIT-01`; GIT produces candidate/PR/merge/remote-confirmation evidence; DOM consumes it and gates advancement. |
| Interface / input / returned data | Evidence mapping interface; input is exact publication evidence and verdict/closure; output is canonical publication state or rejection. |
| Revision/version transport | Candidate base/head/tree and artifact/revision correlation are carried unchanged. |
| Failure / not-found / stale | Missing evidence, stale candidate, conflated merge/remote confirmation, or invalid closure rejects with no local transition. |
| Availability / local proof boundary | Deterministic GIT evidence fixture and local gate are available; DOM never claims Git execution or remote confirmation. |
| Evidence / result | `T7-AC1`–`T7-AC2` vocabulary, gate, cancellation, and idempotency witnesses; PRODUCER_CONSUMER_CONTRACT: PROVEN_LOCAL_FIXTURE, RESULT: CONTRACT_DEFINED_LOCAL_WITNESS_ONLY. |

### Capability Availability Reconciliation

APPLICABLE_SHARED_CAPABILITY_RECORDS: CAP-EXEC-EXACT-VERSION-BASIS, CAP-PLAT-SNAPSHOT-PIPELINE-PROVENANCE, CAP-GIT-CANDIDATE-REMOTE-CONFIRMATION.
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
`PRODUCER_CONSUMER_CONTRACT_PROOF_FIELDS`: `PRODUCER = SPEC-GIT-001`;
`PRODUCED_CONTRACT = candidate, PR, merge, and remote-confirmation evidence`;
`AUTHORITY_OWNER = SPEC-DOM-001`; `CONSUMER = TICKET-007`;
`CONSUMED_CAPABILITY = publication evidence mapping and advancement gate`;
`AVAILABILITY_CONDITION = deterministic GIT evidence fixture and local gate
available; remote execution remains foreign`; `DEPENDENCY_EDGE = GIT evidence
→ TICKET-007 publication gate`; `PROOF_EVIDENCE =
docs/tickets/SPEC-DOM-001/evidence/TICKET-007/AC-DOM-014-publication.md`.

## 14c. ACCEPTANCE_WITNESS_MATRIX

| AC | Normative behavior / verb | Concrete operation | State/transition | Direct positive test | Direct negative/isolation test | Expected evidence | Acceptance owner |
|---|---|---|---|---|---|---|---|
| AC-DOM-014 | Represent distinct publication states | publication state command | candidate/approval/integration/PR/merge/remote confirmation | `T7-AC1-P` seven-state vocabulary test | `T7-AC1-N` `PR_MERGED` is not remote confirmation | `docs/tickets/SPEC-DOM-001/evidence/TICKET-007/AC-DOM-014-publication.md` | TICKET-007 |
| AC-DOM-015 | Advance only with verdict and dependency closure | advancement command | workflow progression | `T7-AC2-P` closed-verdict advancement | `T7-AC2-N` missing verdict/dependency, stale basis, or cancelled unit rejects without transition | `docs/tickets/SPEC-DOM-001/evidence/TICKET-007/AC-DOM-015-advance.md` | TICKET-007 |
| AC-DOM-015 | Pause/cancel cooperatively without reverting effects | pause/cancel command | independent progress | `T7-AC3-P` affected-unit pause/cancel request | `T7-AC3-N` global pause or remote-effect rollback is rejected; unrelated unit progresses | `docs/tickets/SPEC-DOM-001/evidence/TICKET-007/AC-DOM-015-cancellation.md` | TICKET-007 |

### Temporal Authority Proof

`TEMPORAL_AUTHORITY_PROOF: PRESERVED_FROM_PLAN`; source: Plan `DOM-IMP-07`
Temporal Authority Preconditions. Initial observation is
verdict, dependency closure, revision, and exact evidence references; the
mutation window ends at advance authorization; an independent commit-point
revalidation detects drift and fails closed without local advance. GIT/PLAT own
physical effect integrity and DOM owns semantic gate validity. Evidence:
`docs/tickets/SPEC-DOM-001/evidence/TICKET-007/temporal-authority.md`.

## 15. Implementation Constraints

Preserve requested/accepted/rejected/confirmed distinction, formal verdict gating, independent progress, cooperative cancellation, and foreign execution ownership.

## 16. Acceptance Criteria

1. All publication states are distinct, especially `PR_MERGED` and
   `REMOTE_PUBLICATION_CONFIRMED`.
2. Advance without verdict/closure or with non-cooperative cancellation rejects
   with no local transition. `LOCAL_PROVABILITY = YES`.

All criteria are `TESTABLE: YES` and `LOCALLY_PROVABLE: YES` after prerequisites.

## 17. Acceptance / Proof Role

`CONTRIBUTOR: YES` to AC-DOM-052. `LOCAL_ACCEPTANCE_OWNER: YES` and `FINAL_PROOF_OWNER: YES` for AC-DOM-014 and AC-DOM-015. Not final owner of AC-DOM-052.

## 18. Required Tests

`LOCAL_TEST_EVIDENCE`: unit/state-machine/application tests for publication vocabulary, verdict gates, independent progress, pause/cancel requests, and remote-effect preservation. `CONCURRENCY_EVIDENCE`: independent progress and idempotent gate retries. `INTEGRATION_TEST_EVIDENCE`: GIT mapping is verified separately and cannot claim execution locally.

## 19. Completion Evidence

Canonical publication state model; gate/rejection evidence; and mapping tests proving no Git execution or confirmation is locally claimed. `EXPECTED_EVIDENCE_FILES`: `docs/tickets/SPEC-DOM-001/evidence/TICKET-007/AC-DOM-014-publication.md`, `AC-DOM-015-advance.md`, `AC-DOM-015-cancellation.md`, `temporal-authority.md`.

## 20. Completion Gate

```text
COMPLETION_GATE:
  production_code: REQUIRED
  automated_tests: REQUIRED
  integration_evidence: REQUIRED
  legacy_transition_evidence: NOT_APPLICABLE
  conformance_evidence: REQUIRED
```

## 21. Legacy / Cutover Impact

`NEW_CANONICAL_PATH`; legacy publication adapters remain foreign-owned.

## 22. Risks

Equating merge with confirmation or cancellation with rollback. Mitigation: explicit state and negative-path tests.

## 23. Implementation Wave

`WAVE: 4`.

## 24. Parallelization

`SAFE_WITH_COORDINATION`; blocked by TICKET-004/005 and unblocks TICKET-010/011/012.

## 25. Handoff After Completion

Independent ticket audit may validate this ticket; exact publication evidence is consumed by TICKET-011 and the final evaluator.

## 26. Ticket Local Closure

`TICKET_LOCAL_CLOSURE = YES`; GIT execution and confirmation remain foreign.
