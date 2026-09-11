# DOM-001-TICKET-008 — Audit-cycle identity and structured verdict closure

## 1. Status

`STATUS: BLOCKED`  
`ISSUE_DECOMPOSITION_READINESS: ISSUE_READY`  
`INITIAL_DAG_STATE: BLOCKED`  
`BLOCKED_BY: DOM-001-TICKET-005`
`CURRENT_DAG_STATE: BLOCKED`
`DEPENDS_ON: DOM-001-TICKET-001, DOM-001-TICKET-005`  
`UNBLOCKS: DOM-001-TICKET-009, DOM-001-TICKET-012`

## 2. Source Traceability

- Accepted ADR authority: `ADR-0009` revision 3, SHA-256 `4AB502AEA4F09AFE2C5FA33BFB6C5EE0D11E2D8F9AF65F244209CE1FAC935761` — formal audit-cycle identity and structured verdict closure.
- Portfolio: `docs/specs/SPEC-PORTFOLIO-001-organization.md` — O-049, O-050.
- Component SPEC: `docs/specs/SPEC-DOM-001-workflow-authority-and-governance.md` — DOM-AUDIT-001, DOM-AUDIT-002.
- Gap Matrix: `docs/specs/gap-matrices/SPEC-DOM-001-implementation-gap-matrix.md` — GAP-017, GAP-018.
- Gap Matrix Audit: `docs/specs/gap-matrices/audits/SPEC-DOM-001-implementation-gap-matrix-audit.md`.
- Implementation Plan: `docs/specs/implementation-plans/SPEC-DOM-001-implementation-plan.md` — DOM-IMP-08.
- Plan Audit: `docs/specs/implementation-plans/audits/SPEC-DOM-001-implementation-plan-audit.md`.

## 3. Authority / Scope

Approved owner: DOM `CANONICAL_OWNER`. Primary owning specification/domain: `SPEC-DOM-001`. Local ownership covers artifact/cycle/round identity, structured verdict semantics, and closure authority. Foreign capabilities consumed: assignment/session and physical persistence contracts, non-blocking.

## 4. Portfolio Obligation Coverage

`O-049` formal artifact audit cycles; `O-050` structured-verdict-only closure.

## 5. Gap / Requirement / Acceptance Coverage

Gaps: `GAP-017`, `GAP-018`. Requirements: `DOM-AUDIT-001`, `DOM-AUDIT-002`. Local acceptance: `AC-DOM-049`, `AC-DOM-050`. Integrated contribution: `AC-DOM-052`; final owner TICKET-012.

## 6. Implementation Unit

`DOM-IMP-08 — Audit-cycle identity and structured verdict closure`. Formation reason: `SHARED_AUTHORITY + SHARED_COMMAND_BOUNDARY`. No split or merge.

## 7. Goal

Create explicit artifact/cycle/round identity and make only a structured verdict capable of closing an audit cycle.

## 8. Validated Implementation Delta

`OBSERVED`: mock cycle/round fields and finding commands.  
`REQUIRED`: unique cycle identity for every governed artifact and structured-verdict closure.  
`DELTA`: no productive audit-cycle authority.

## 9. Required Behavior

Identify artifact/cycle/round without implicit reuse; reject cycle closure from remediation, empty findings, or process termination; accept only a structured verdict; provide the audit basis for round policy, conformance, and invalidation.

## 10. Does Not Implement

Agent/session assignment, auditor/remediator execution, physical persistence, OPS projection, or final conformance evaluation.

## 11. Repository Evidence

No productive cycle registry or structured verdict closure was found; prototype audit/remediation scenarios are non-authoritative. Add explicit cycle identity and verdict closure commands.

## 12. Expected Repository Impact

Production code: audit-cycle aggregate and verdict command/event boundary.  
Persistence/schema: identity/evidence persistence seam only.  
Integration: round and final-conformance consumers.  
Tests: cycle identity, verdict structure, prohibited reuse, remediation rejection, replay, and regression tests.  
Legacy/cutover: new canonical path preserving historical cycles.  
Generated contracts: structured verdict contract.

## 13. Dependencies

Internal: `DOM-001-TICKET-001`, `DOM-001-TICKET-005`. Cross-SPEC assignment/session remains foreign and non-blocking.

## 14. Blocking Conditions

Blocked until command validation completes. No external blocker exists.

## 14a. Authority Consumption Proof

| Field | Proof |
|---|---|
| Proof ID / authority existence | `ACP-DOM-08`; `YES` — `ADR-0009` revision 3, SHA-256 `4AB502AEA4F09AFE2C5FA33BFB6C5EE0D11E2D8F9AF65F244209CE1FAC935761`. |
| Scoped decision / truth owner | `ADR0009-D001`, `ADR0009-D002`; DOM owns artifact/cycle/round identity and structured verdict closure. |
| Semantic source | `DOM-AUDIT-001`, `DOM-AUDIT-002`; `GAP-017`, `GAP-018`. |
| Consumed interface / returned data | Cycle registration/verdict command port; returns exact artifact/revision/cycle identity and structured closure outcome. |
| Revision/version transport | Artifact ID, revision, cycle ID, round ID, and verdict schema version are bound in the closure record. |
| Failure / not-found / stale semantics | Reused identity, wrong artifact/revision, empty/remediation-only verdict, or process termination rejects closure. |
| Productive availability / evidence | `YES` for local cycle/verdict aggregate and EXEC evidence fixture; external activity/session production is non-blocking. Evidence: `T8-AC1`–`T8-AC2`. |
| Result | `AUTHORITY_CONSUMABLE`. |

## 14b. Producer / Consumer Contract Proof

| Field | Proof |
|---|---|
| Contract / producer / consumer | `PCP-EXEC-04`; EXEC-002 produces activity/session evidence; DOM consumes the reference and retains cycle/verdict authority. |
| Interface / input / returned data | Evidence-reference interface; input is exact artifact/revision/cycle reference; output is correlated evidence or structured rejection. |
| Revision/version transport | Cycle, round, artifact, and revision identifiers are returned unchanged with evidence references. |
| Failure / not-found / stale | Missing or mismatched evidence, reused cycle, or non-structured verdict cannot close the cycle. |
| Availability / local proof boundary | Deterministic EXEC evidence fixture is available for local closure; runtime execution remains foreign. |
| Evidence / result | `T8-AC1`–`T8-AC2` identity and verdict witnesses; PRODUCER_CONSUMER_CONTRACT: PROVEN_LOCAL_FIXTURE, RESULT: CONTRACT_DEFINED_LOCAL_WITNESS_ONLY. |

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
`PRODUCER_CONSUMER_CONTRACT_PROOF_FIELDS`: `PRODUCER = SPEC-EXEC-002`;
`PRODUCED_CONTRACT = activity/session evidence reference`;
`AUTHORITY_OWNER = SPEC-DOM-001`; `CONSUMER = TICKET-008`;
`CONSUMED_CAPABILITY = exact cycle evidence reference`;
`AVAILABILITY_CONDITION = deterministic EXEC evidence fixture available;
runtime activity production is foreign`; `DEPENDENCY_EDGE = EXEC evidence →
TICKET-008 structured verdict closure`; `PROOF_EVIDENCE =
docs/tickets/SPEC-DOM-001/evidence/TICKET-008/AC-DOM-050-verdict.md`.

## 14c. ACCEPTANCE_WITNESS_MATRIX

| AC | Normative behavior / verb | Concrete operation | State/transition | Direct positive test | Direct negative/isolation test | Expected evidence | Acceptance owner |
|---|---|---|---|---|---|---|---|
| AC-DOM-049 | Create distinct artifact/cycle/round identity | cycle create/register command | audit cycle identity | `T8-AC1-P` distinct identity for each artifact/revision/round | `T8-AC1-N` implicit reuse or wrong artifact/revision rejects | `docs/tickets/SPEC-DOM-001/evidence/TICKET-008/AC-DOM-049-cycle.md` | TICKET-008 |
| AC-DOM-050 | Close only with structured verdict | verdict close command | cycle closure | `T8-AC2-P` exact structured verdict closes exact cycle | `T8-AC2-N` empty findings, remediation-only result, or process termination cannot close | `docs/tickets/SPEC-DOM-001/evidence/TICKET-008/AC-DOM-050-verdict.md` | TICKET-008 |

### Temporal Authority Proof

`TEMPORAL_AUTHORITY_PROOF: PRESERVED_FROM_PLAN`; source: Plan `DOM-IMP-08`
Temporal Authority Preconditions. Initial observation is exact
artifact revision and cycle identity; the mutation window ends at closure; the
commit point revalidates both; mismatch fails closed and preserves cycle state.
DOM owns semantic closure and EXEC owns production of foreign activity evidence.
Evidence: `docs/tickets/SPEC-DOM-001/evidence/TICKET-008/temporal-authority.md`.

## 15. Implementation Constraints

Cycle identity is explicit and non-reusable; remediation never approves; structured verdict is the sole closure authority.

## 16. Acceptance Criteria

1. Independent cycles for distinct artifacts/revisions never reuse identity.
2. Only an exact structured verdict closes a cycle; remediation or missing
   findings cannot close it. `LOCAL_PROVABILITY = YES`.

All criteria are `TESTABLE: YES` and `LOCALLY_PROVABLE: YES` after prerequisites.

## 17. Acceptance / Proof Role

`CONTRIBUTOR: YES` to AC-DOM-052. `LOCAL_ACCEPTANCE_OWNER: YES` and `FINAL_PROOF_OWNER: YES` for AC-DOM-049 and AC-DOM-050. Not final owner of AC-DOM-052.

## 18. Required Tests

`LOCAL_TEST_EVIDENCE`: unit/domain/command tests for cycle identity, prohibited reuse, verdict structure, remediation rejection, and historical replay. `RECOVERY_EVIDENCE`: exact artifact/revision/cycle identity survives rehydration and cannot be silently reused.

## 19. Completion Evidence

Cycle/verdict authority; structured closure evidence; and negative remediation tests. `EXPECTED_EVIDENCE_FILES`: `docs/tickets/SPEC-DOM-001/evidence/TICKET-008/AC-DOM-049-cycle.md`, `AC-DOM-050-verdict.md`, `temporal-authority.md`.

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

`NEW_CANONICAL_PATH`; preserve historical cycles.

## 22. Risks

Implicit cycle reuse or process completion treated as approval. Mitigation: identity and closure-gate tests.

## 23. Implementation Wave

`WAVE: 4`.

## 24. Parallelization

`SAFE_WITH_COORDINATION`; blocked by TICKET-001/005 and unblocks TICKET-009/012.

## 25. Handoff After Completion

Independent ticket audit may validate this ticket; TICKET-009 consumes its cycle and round identity.

## 26. Ticket Local Closure

`TICKET_LOCAL_CLOSURE = YES`.
