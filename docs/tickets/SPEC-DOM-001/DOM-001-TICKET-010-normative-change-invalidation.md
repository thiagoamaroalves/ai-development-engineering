# DOM-001-TICKET-010 — Normative-change invalidation and adjustment lineage

## 1. Status

`STATUS: BLOCKED`  
`ISSUE_DECOMPOSITION_READINESS: ISSUE_READY`  
`INITIAL_DAG_STATE: BLOCKED`  
`BLOCKED_BY: DOM-001-TICKET-003, DOM-001-TICKET-006`  
`DEPENDS_ON: DOM-001-TICKET-003, DOM-001-TICKET-006`  
`UNBLOCKS: DOM-001-TICKET-012`

## 2. Source Traceability

- Accepted ADR authority: `ADR-0009` revision 3, SHA-256 `4AB502AEA4F09AFE2C5FA33BFB6C5EE0D11E2D8F9AF65F244209CE1FAC935761` — downstream invalidation, adjustment lineage, and terminal-ticket preservation.
- Portfolio: `docs/specs/SPEC-PORTFOLIO-001-organization.md` — O-053.
- Component SPEC: `docs/specs/SPEC-DOM-001-workflow-authority-and-governance.md` — DOM-AUDIT-005.
- Gap Matrix: `docs/specs/gap-matrices/SPEC-DOM-001-implementation-gap-matrix.md` — GAP-021.
- Gap Matrix Audit: `docs/specs/gap-matrices/audits/SPEC-DOM-001-implementation-gap-matrix-audit.md`.
- Implementation Plan: `docs/specs/implementation-plans/SPEC-DOM-001-implementation-plan.md` — DOM-IMP-10.
- Plan Audit: `docs/specs/implementation-plans/audits/SPEC-DOM-001-implementation-plan-audit.md`.

## 3. Authority / Scope

Approved owner: DOM `CANONICAL_OWNER`. Primary owning specification/domain: `SPEC-DOM-001`. Local ownership covers normative-change detection, selective invalidation, stage return, adjustment/substitution lineage, and preservation of terminal history. Foreign capabilities consumed: downstream projections only; no foreign lifecycle is implemented.

## 4. Portfolio Obligation Coverage

`O-053` selective downstream invalidation after normative change without reopening completed tickets.

## 5. Gap / Requirement / Acceptance Coverage

Gap: `GAP-021`. Requirement: `DOM-AUDIT-005`. Local acceptance: `AC-DOM-053`. Integrated contribution: `AC-DOM-052`; final owner TICKET-012.

## 6. Implementation Unit

`DOM-IMP-10 — Normative-change invalidation and adjustment lineage`. Formation reason: `SHARED_CUTOVER + SHARED_INTEGRATION_SEAM`. No split or merge.

## 7. Goal

Invalidate only affected downstream approvals after normative change, preserve history, return to the appropriate documentation stage, and create linked adjustment/substitution work without reopening completed tickets.

## 8. Validated Implementation Delta

`OBSERVED`: mock drift/mutation changes in-memory state.  
`REQUIRED`: productive approval registry, selective invalidation, preserved terminal ticket history, and linked adjustment/substitution history.  
`DELTA`: no productive cutover path.

## 9. Required Behavior

Detect normative change; invalidate affected approvals; preserve unaffected and completed history; return the affected unit to the proper documentation stage; link new adjustment/substitution records; make stale approvals unavailable to later advancement.

## 10. Does Not Implement

Rewriting ADR documents, physical evidence migration, downstream execution, legacy adapter retirement, or reopening completed tickets.

## 11. Repository Evidence

No productive invalidation/cutover symbols; prototype drift scenarios are non-authoritative references. Add selective invalidation and adjustment lineage commands.

## 12. Expected Repository Impact

Production code: approval/invalidation registry, adjustment lineage, and stage commands.  
Persistence/schema: semantic history reference seam.  
Integration: downstream invalidation result mapping.  
Tests: selective invalidation, terminality, stage return, lineage, stale, compatibility, migration-history, and regression tests.  
Legacy/cutover: cutover with preserved reads.  
Generated contracts: invalidation/adjustment result contract.

## 13. Dependencies

Internal: `DOM-001-TICKET-003`, `DOM-001-TICKET-006`. Cross-SPEC downstream projections consume the result and are non-blocking.

## 14. Blocking Conditions

Blocked until lifecycle/succession and ticket aggregate contracts complete. No external blocker exists.

## 14a. Authority Consumption Proof

| Field | Proof |
|---|---|
| Proof ID / authority existence | `ACP-DOM-10`; `YES` — `ADR-0009` revision 3, SHA-256 `4AB502AEA4F09AFE2C5FA33BFB6C5EE0D11E2D8F9AF65F244209CE1FAC935761`. |
| Scoped decision / truth owner | `ADR0009-D005`; DOM owns selective invalidation, adjustment linkage, history, and terminality. |
| Semantic source | `DOM-AUDIT-005`; `GAP-021`. |
| Consumed interface / returned data | Normative-change command/registry port; returns affected approval invalidation and linked adjustment lineage. |
| Revision/version transport | Normative revision, affected approval IDs, adjustment ID, and historical lineage are hash/correlation linked. |
| Failure / not-found / stale semantics | Unrelated approval, missing adjustment, stale revision, or completed-ticket reopen rejects without destructive mutation. |
| Productive availability / evidence | `YES` for local registry/adjustment boundary and deterministic foreign-record fixtures; PLAT/GIT/EXEC projections are non-blocking consumers. Evidence: `T10-AC1`–`T10-AC2`. |
| Result | `AUTHORITY_CONSUMABLE`. |

## 14b. Producer / Consumer Contract Proof

| Field | Proof |
|---|---|
| Contracts / producers / consumer | `PCP-PLAT-07`, `PCP-GIT-02`, `PCP-EXEC-06` produce foreign records keyed by adjustment/revision; DOM consumes references and owns invalidation meaning. |
| Interface / input / returned data | Invalidation/adjustment mapping interface; input is exact normative revision and approval set; output is selective obsolete state plus linked adjustment. |
| Revision/version transport | Canonical adjustment/revision IDs and affected approval identities are returned unchanged across mappings. |
| Failure / not-found / stale | Missing or stale foreign record, unrelated approval, or terminal-ticket reopen is rejected and history remains unchanged. |
| Availability / local proof boundary | Local invalidation registry and deterministic producer fixtures are available; foreign runtime records are integrated later and are not hidden blockers. |
| Evidence / result | `T10-AC1`–`T10-AC2` selective, terminality, lineage, and recovery witnesses; PRODUCER_CONSUMER_CONTRACT: PROVEN_LOCAL_FIXTURE, RESULT: CONTRACT_DEFINED_LOCAL_WITNESS_ONLY. |

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
`PRODUCER_CONSUMER_CONTRACT_PROOF_FIELDS`: `PRODUCER = SPEC-PLAT-001,
SPEC-GIT-001, SPEC-EXEC-002`; `PRODUCED_CONTRACT = records keyed by canonical
adjustment/revision`; `AUTHORITY_OWNER = SPEC-DOM-001`; `CONSUMER = TICKET-010`;
`CONSUMED_CAPABILITY = invalidation/adjustment mapping and historical references`;
`AVAILABILITY_CONDITION = local registry and deterministic producer fixtures
available; foreign runtime records are integrated later`;
`DEPENDENCY_EDGE = normative revision → TICKET-010 invalidation → foreign
record mappings`; `PROOF_EVIDENCE = docs/tickets/SPEC-DOM-001/evidence/TICKET-010/AC-DOM-053-invalidation.md`.

## 14c. ACCEPTANCE_WITNESS_MATRIX

| AC | Normative behavior / verb | Concrete operation | State/transition | Direct positive test | Direct negative/isolation test | Expected evidence | Acceptance owner |
|---|---|---|---|---|---|---|---|
| AC-DOM-053 | Invalidate only affected approvals | apply normative revision command | approval obsolete state | `T10-AC1-P` selective affected-approval invalidation | `T10-AC1-N` unrelated approval remains valid; stale revision rejects; retry is idempotent | `docs/tickets/SPEC-DOM-001/evidence/TICKET-010/AC-DOM-053-invalidation.md` | TICKET-010 |
| AC-DOM-053 | Preserve terminal tickets and link adjustment | create adjustment command | linked adjustment/terminal ticket | `T10-AC2-P` adjustment links exact revision and history | `T10-AC2-N` `COMPLETED` ticket reopen or missing link rejects; recovery preserves terminality | `docs/tickets/SPEC-DOM-001/evidence/TICKET-010/AC-DOM-053-adjustment.md` | TICKET-010 |

### Temporal Authority Proof

`TEMPORAL_AUTHORITY_PROOF = TAP-10`; source: Plan `DOM-IMP-10` Temporal
Authority Preconditions. Initial observation is normative revision and affected
approvals; the mutation window ends at invalidation commit; independent
reobservation at commit detects drift; drift fails closed and prior records are
preserved. DOM owns semantic impact while foreign owners provide atomic
persistence/evidence. Evidence: `docs/tickets/SPEC-DOM-001/evidence/TICKET-010/temporal-authority.md`.

## 15. Implementation Constraints

Preserve completed ticket terminality, selective invalidation, historical lineage, and approved cutover ownership.

## 16. Acceptance Criteria

1. A normative change obsoletes only affected approvals and links a new
   adjustment while preserving history.
2. A `COMPLETED` ticket remains terminal and is not reopened. `LOCAL_PROVABILITY = YES`.

All criteria are `TESTABLE: YES` and `LOCALLY_PROVABLE: YES` after prerequisites.

## 17. Acceptance / Proof Role

`CONTRIBUTOR: YES` to AC-DOM-052. `LOCAL_ACCEPTANCE_OWNER: YES` and `FINAL_PROOF_OWNER: YES` for AC-DOM-053. Not final owner of AC-DOM-052.

## 18. Required Tests

`LOCAL_TEST_EVIDENCE`: unit/state-machine tests for selective invalidation, preserved terminal tickets, stage return, and linked adjustment lineage. `CONCURRENCY_EVIDENCE`: competing invalidation/retry is idempotent and cannot affect unrelated approvals. `RECOVERY_EVIDENCE`: adjustment and terminality survive rehydration; foreign migration-history evidence is integrated separately.

## 19. Completion Evidence

Approval registry; selective invalidation trace; unchanged completed-ticket records; and linked adjustment/substitution evidence. `EXPECTED_EVIDENCE_FILES`: `docs/tickets/SPEC-DOM-001/evidence/TICKET-010/AC-DOM-053-invalidation.md`, `AC-DOM-053-adjustment.md`, `temporal-authority.md`.

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

`CUTOVER`; preserve historical reads and remove no foreign adapter authority.

## 22. Risks

Over-invalidation or reopening terminal work. Mitigation: selective fixtures and terminality assertions.

## 23. Implementation Wave

`WAVE: 5`.

## 24. Parallelization

`SAFE_WITH_COORDINATION`; blocked by TICKET-003/006 and unblocks TICKET-012.

## 25. Handoff After Completion

Independent ticket audit may validate this ticket; its invalidation evidence is consumed by final conformance and downstream projections.

## 26. Ticket Local Closure

`TICKET_LOCAL_CLOSURE = YES`.
