# DOM-001-TICKET-007 — Publication vocabulary and advancement gates

## 1. Status

`STATUS: DONE`
`ISSUE_DECOMPOSITION_READINESS: ISSUE_READY`  
`INITIAL_DAG_STATE: BLOCKED`  
`BLOCKED_BY: NONE`
`CURRENT_DAG_STATE: DONE`
`DEPENDS_ON: DOM-001-TICKET-004, DOM-001-TICKET-005`  
`UNBLOCKS: DOM-001-TICKET-010, DOM-001-TICKET-011, DOM-001-TICKET-012`

### Implementation execution record

```text
INITIAL_STATUS: READY
FINAL_STATUS: DONE
IMPLEMENTATION_STATUS: IMPLEMENTED
IMPLEMENTATION_BASELINE: 6b31bcee1591c8b2e6499a434950664077b2be01 plus assessed dirty worktree
CURRENT_HEAD: 6b31bcee1591c8b2e6499a434950664077b2be01
TICKET_AUDIT_HEAD: 6b31bcee1591c8b2e6499a434950664077b2be01 plus remediated T007 worktree
DESIGN_ARTIFACT: docs/tickets/SPEC-DOM-001/DOM-001-TICKET-007-implementation-design.md
DESIGN_GATE: IMPLEMENTATION_DESIGN_READY / READY_FOR_IMPLEMENTATION
CHANGED_FILES: src/domain/publication.ts; src/application/publication.ts; tests/dom-001-ticket-007.test.ts; docs/tickets/SPEC-DOM-001/evidence/TICKET-007/*
TESTS_RUN: T007 focused (4); combined root ticket suite (10); full root productive suite (115); strict source typecheck
TESTS_PASSED: 4 focused; 10 combined; 115 full; typecheck PASS
TESTS_FAILED: 0
TESTS_SKIPPED: 0
ENVIRONMENTAL_FAILURES: 0
ACCEPTANCE_CRITERIA: AC-DOM-014 SATISFIED; AC-DOM-015 SATISFIED
COMPLETION_EVIDENCE: PRESENT and current locally; foreign GIT/EXEC/PLAT mappings remain integrated-only
IMPLEMENTATION_TIME_REMAINING_BLOCKERS: NONE for local ticket closure; integrated GIT/PLAT proof remains downstream and TICKET-012 remained blocked by other predecessors
REMEDIATION_ARTIFACT: docs/tickets/SPEC-DOM-001/DOM-001-TICKET-007-implementation-remediation.md
REMEDIATION_STATUS: COMPLETE; independent audit passed
FINALIZATION_ARTIFACT: docs/tickets/SPEC-DOM-001/evidence/TICKET-007/finalization-2026-09-16.md
AUDIT_REMEDIATION_SCOPE: accepted reconstruction, exact replay, candidate basis, mapper, identity and concurrency
IMPLEMENTATION_STRUCTURAL_SELF_CHECK: PASS
STRUCTURAL_REVIEW_STATUS: PASS
STRUCTURAL_REVIEW_FINDINGS: 0
DOMAIN_MODEL_CONFORMANT: YES
AGGREGATE_BOUNDARIES_CONFORMANT: YES
INVARIANT_PLACEMENT_CONFORMANT: YES
COMPONENT_BOUNDARIES_CONFORMANT: YES
SOLID_CONFORMANT: YES
DEPENDENCY_DIRECTION_CONFORMANT: YES
CLEAN_CODE_STRUCTURALLY_ACCEPTABLE: YES
CROSS_SPEC_BOUNDARY_CONFORMANT: YES
CRITICAL_INVARIANTS_WITH_TESTS: ALL
REQUIRED_TEST_SURFACES_IMPLEMENTED: YES
TESTABILITY_REGRESSIONS: 0
```

## 2. Source Traceability

- Accepted ADR authority: `ADR-0002` revision 3, SHA-256 `EF9289C6FCA4BBA73FCA53CA38C71DD19110EB1CFE948358A7CCA1FE14E177D9` — publication vocabulary, advancement gates, and cooperative cancellation.
- Portfolio: `docs/specs/SPEC-PORTFOLIO-001-organization.md` — O-014, O-015.
- Component SPEC: `docs/specs/SPEC-DOM-001-workflow-authority-and-governance.md` — DOM-PUB-001, DOM-ADV-001.
- Gap Matrix: `docs/specs/gap-matrices/SPEC-DOM-001-implementation-gap-matrix.md` — GAP-013, GAP-016.
- Gap Matrix Audit: `docs/specs/gap-matrices/audits/SPEC-DOM-001-implementation-gap-matrix-audit.md`.
- Implementation Plan: `docs/specs/implementation-plans/SPEC-DOM-001-implementation-plan.md` — SHA-256 `C57D24FEC7CF69BED3EC354C4334DE698AFC54722FD7EDA6F2D3D6353FF35C33`; DOM-IMP-07.
- Plan Audit: `docs/specs/implementation-plans/audits/SPEC-DOM-001-implementation-plan-audit-2026-09-11-reaudit-002.md` — SHA-256 `474E33C3FD17F8790FBB2CD2A39C9670A33D0830FF851C8D06DE31CA6BFB9695`; `READY_FOR_ISSUE_DECOMPOSITION`.

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

Productive publication vocabulary, gate policy, unit progress, application identity boundary, exact replay and accepted-history reconstruction are implemented in `src/domain/publication.ts` and `src/application/publication.ts`; direct evidence is recorded under `evidence/TICKET-007/`.

## 12. Expected Repository Impact

Production code: publication/advancement state and command/event boundary.  
Persistence/schema: semantic evidence mapping only.  
Integration: GIT evidence consumption.  
Tests: vocabulary, verdict gates, independent progress, pause/cancel, remote-effect preservation, exact idempotency, accepted rehydration, identity and concurrency regression tests.
Legacy/cutover: new canonical path.  
Generated contracts: publication vocabulary and gate result contract.

## 13. Dependencies

Internal: `DOM-001-TICKET-004`, `DOM-001-TICKET-005`. Cross-SPEC: `SPEC-GIT-001` executes publication and supplies evidence; non-blocking locally.

## 14. Blocking Conditions

TICKET-005 is complete and its dependency edge is satisfied. TICKET-004 is complete and remains only in `DEPENDS_ON` for lineage. No current internal or foreign blocker exists.

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
| Result | `AUTHORITY_DEFINED_BUT_NOT_CONSUMABLE` for integrated-only GIT/EXEC capabilities; local contract witness only. |

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

### Acceptance witness context
`PRODUCER_CONSUMER_CONTRACT_PROOF_FIELDS`: `PRODUCER = SPEC-GIT-001`;
`PRODUCED_CONTRACT = candidate, PR, merge, and remote-confirmation evidence`;
`AUTHORITY_OWNER = SPEC-DOM-001`; `CONSUMER = TICKET-007`;
`CONSUMED_CAPABILITY = publication evidence mapping and advancement gate`;
`AVAILABILITY_CONDITION = deterministic GIT evidence fixture and local gate
available; remote execution remains foreign`; `DEPENDENCY_EDGE = GIT evidence
→ TICKET-007 publication gate`; `PROOF_EVIDENCE =
docs/tickets/SPEC-DOM-001/evidence/TICKET-007/AC-DOM-014-publication.md`.

## 14c. ACCEPTANCE_WITNESS_MATRIX

| NORMATIVE_BEHAVIOR | NORMATIVE_VERB | CONCRETE_OPERATION_COMMAND_OR_QUERY | STATE_OR_TRANSITION_AFFECTED | DIRECT_POSITIVE_TEST | DIRECT_NEGATIVE_OR_ISOLATION_TEST | EXPECTED_EVIDENCE_FILE | EVIDENCE_TYPE | ACCEPTANCE_OWNER | REQUIRED_PRODUCER_OR_CAPABILITY | AUTHORITY_STATUS | CONTRACT_STATUS | LOCAL_TESTABILITY | PRODUCTIVE_AVAILABILITY | CAPABILITY_SUMMARY_STATUS | DEPENDENCY_CLASS | WITNESS_EXECUTABLE_AT_LOCAL_CLOSURE |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Publication states | represents distinctly | publication state command | candidate/approval/integration/PR/merge/remote confirmation | `T7-AC1-P` eight-state vocabulary test | `T7-AC1-N` `PR_MERGED` is not remote confirmation | `docs/tickets/SPEC-DOM-001/evidence/TICKET-007/AC-DOM-014-publication.md` | LOCAL_TEST_EVIDENCE | TICKET-007 | none — local publication vocabulary | DEFINED | DEFINED | YES | YES | CONTRACT_PRODUCTIVELY_AVAILABLE | REQUIRED_FOR_LOCAL_CLOSURE | YES |
| Advancement gate | advances only with closure | advancement command | workflow progression | `T7-AC2-P` closed-verdict advancement | `T7-AC2-N` missing verdict/dependency, stale basis, or cancelled unit rejects without transition | `docs/tickets/SPEC-DOM-001/evidence/TICKET-007/AC-DOM-015-advance.md` | LOCAL_TEST_EVIDENCE | TICKET-007 | none — local advancement contract | DEFINED | DEFINED | YES | YES | CONTRACT_PRODUCTIVELY_AVAILABLE | REQUIRED_FOR_LOCAL_CLOSURE | YES |
| Cooperative cancellation | pauses/cancels without rollback | pause/cancel command | independent progress | `T7-AC3-P` affected-unit pause/cancel request | `T7-AC3-N` global pause or remote-effect rollback rejected; unrelated unit progresses | `docs/tickets/SPEC-DOM-001/evidence/TICKET-007/AC-DOM-015-cancellation.md` | LOCAL_TEST_EVIDENCE | TICKET-007 | none — local DOM cancellation boundary | DEFINED | DEFINED | YES | YES | CONTRACT_PRODUCTIVELY_AVAILABLE | REQUIRED_FOR_LOCAL_CLOSURE | YES |

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

`LOCAL_TEST_EVIDENCE`: unit/state-machine/application tests for publication vocabulary, verdict gates, independent progress, pause/cancel requests, exact replay, accepted rehydration and remote-effect preservation. `CONCURRENCY_EVIDENCE`: barrier-controlled publication commands preserve one winner and one stale loser. `INTEGRATION_TEST_EVIDENCE`: GIT mapping remains a foreign contract and cannot claim execution locally.

## 19. Completion Evidence

Canonical publication state model; gate/rejection evidence; and mapping tests proving no Git execution or confirmation is locally claimed. `EXPECTED_EVIDENCE_FILES`: `docs/tickets/SPEC-DOM-001/evidence/TICKET-007/AC-DOM-014-publication.md`, `AC-DOM-015-advance.md`, `AC-DOM-015-cancellation.md`, `temporal-authority.md`.

## 20. Completion Gate

```text
COMPLETION_GATE:
  production_code: REQUIRED
  automated_tests: REQUIRED
  local_completion_evidence: REQUIRED
  integration_evidence: REQUIRED_AS_LOCAL_CONTRACT_CONTRIBUTION; FOREIGN_PRODUCTIVE_CHECKPOINT_DEFERRED
  legacy_transition_evidence: NOT_APPLICABLE_LOCALLY; FOREIGN_RETIREMENT_DEFERRED
  conformance_evidence: REQUIRED_FOR_LOCAL_CONTRIBUTION; FINAL_CONFORMANCE_DEFERRED_TO_TICKET-012
  local_closure_boundary: local vocabulary/gate/cancellation evidence is required; GIT execution and confirmation are integrated-only
```

## 21. Legacy / Cutover Impact

`NEW_CANONICAL_PATH`; legacy publication adapters remain foreign-owned.

## 22. Risks

Equating merge with confirmation or cancellation with rollback. Mitigation: explicit state and negative-path tests.

## 23. Implementation Wave

`WAVE: 5`.

## 24. Parallelization

`SAFE_WITH_COORDINATION`; ready after TICKET-005 and unblocks TICKET-010/011/012.

## 25. Handoff After Completion

Independent ticket audit may validate this ticket; exact publication evidence is consumed by TICKET-011 and the final evaluator.

```text
CURRENT_REMAINING_BLOCKERS: NONE locally; structural review, independent implementation audit, and finalization are complete; TICKET-012 is DONE
```

## 26. Ticket Local Closure

`TICKET_LOCAL_CLOSURE = YES`; GIT execution and confirmation remain foreign.

## 27. Local Finalization

`FINALIZATION_VERDICT = TICKET_FINALIZED_LOCALLY`.
`FINALIZATION_DATE = 2026-09-16`.
`FINALIZATION_AUTHORITY = docs/tickets/SPEC-DOM-001/DOM-001-TICKET-007-implementation-audit.md`.
`TICKET_STATUS_BEFORE = VALIDATION_REQUIRED`.
`TICKET_STATUS_AFTER = DONE`.
