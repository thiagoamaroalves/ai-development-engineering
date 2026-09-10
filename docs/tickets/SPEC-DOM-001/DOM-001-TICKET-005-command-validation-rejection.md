# DOM-001-TICKET-005 — Canonical commands and failure semantics

## 1. Status

`STATUS: BLOCKED`  
`ISSUE_DECOMPOSITION_READINESS: ISSUE_READY`  
`INITIAL_DAG_STATE: BLOCKED`  
`BLOCKED_BY: DOM-001-TICKET-001, DOM-001-TICKET-004`
`DEPENDS_ON: DOM-001-TICKET-001, DOM-001-TICKET-004`  
`UNBLOCKS: DOM-001-TICKET-006, DOM-001-TICKET-007, DOM-001-TICKET-008, DOM-001-TICKET-012`

## 2. Source Traceability

- Accepted ADR authority: `ADR-0002` revision 3, SHA-256 `EF9289C6FCA4BBA73FCA53CA38C71DD19110EB1CFE948358A7CCA1FE14E177D9` — command preconditions, canonical rejection, and no-effect transitions.
- Portfolio: `docs/specs/SPEC-PORTFOLIO-001-organization.md` — O-011.
- Component SPEC: `docs/specs/SPEC-DOM-001-workflow-authority-and-governance.md` — DOM-CMD-001.
- Gap Matrix: `docs/specs/gap-matrices/SPEC-DOM-001-implementation-gap-matrix.md` — GAP-011, GAP-012.
- Gap Matrix Audit: `docs/specs/gap-matrices/audits/SPEC-DOM-001-implementation-gap-matrix-audit.md`.
- Implementation Plan: `docs/specs/implementation-plans/SPEC-DOM-001-implementation-plan.md` — DOM-IMP-05.
- Plan Audit: `docs/specs/implementation-plans/audits/SPEC-DOM-001-implementation-plan-audit.md`.

## 3. Authority / Scope

Approved owner: DOM `CANONICAL_OWNER`. Primary owning specification/domain: `SPEC-DOM-001`. Local ownership covers identity, revision, state, dependency, verdict preconditions and canonical rejection semantics. Foreign capabilities consumed: PLAT evidence correlation and BACKEND/UI result mapping, non-blocking.

## 4. Portfolio Obligation Coverage

`O-011` precondition validation, rejection registration, and no-transition/no-effect semantics.

## 5. Gap / Requirement / Acceptance Coverage

Gaps: `GAP-011`, `GAP-012`. Requirement: `DOM-CMD-001`. Local acceptance: `AC-DOM-011`. Integrated contribution: `AC-DOM-052`; final owner TICKET-012.

## 6. Implementation Unit

`DOM-IMP-05 — Canonical commands and failure semantics`. Formation reason: `SHARED_COMMAND_BOUNDARY`. No split or merge.

## 7. Goal

Provide canonical command precondition validation, recorded rejection, stale revision handling, and no-state/no-effect semantics.

## 8. Validated Implementation Delta

`OBSERVED`: mock request/advance loop only.  
`REQUIRED`: productive validation, recorded rejection, and no transition/effect on rejection.  
`DELTA`: no canonical command boundary exists.

## 9. Required Behavior

Validate all DOM preconditions, return exact canonical rejection reasons (`UNKNOWN_SPEC`, `INELIGIBLE_REVISION`, `INVALID_DEPENDENCY_CLOSURE`, `INVALID_COMMAND_BASIS`, `STALE_REVISION`), and leave canonical state/effect unchanged when invalid.

## 10. Does Not Implement

PLAT journal/effect persistence, BACKEND/UI envelopes, adapter retries, or foreign failure families.

## 11. Repository Evidence

`src/application/pipeline.ts`, `src/domain/pipeline.ts`, and current productive command tests. Extend the existing precondition path with canonical rejection recording and no-effect witnesses.

## 12. Expected Repository Impact

Production code: command handlers and rejection boundary.  
Persistence/schema: rejection/effect correlation seam only.  
Integration: BACKEND/UI mapping contract and PLAT correlation.  
Tests: precondition, stale, idempotency, atomic no-effect, and regression tests.  
Legacy/cutover: new canonical path.  
Generated contracts: canonical reason/result contract.

## 13. Dependencies

Internal: `DOM-001-TICKET-001`, `DOM-001-TICKET-004`. Cross-SPEC: PLAT-001 and BACKEND-001/UI-001 mappings, all non-blocking locally.

## 14. Blocking Conditions

Blocked until identity and state-machine tickets complete. No foreign blocker exists.

## 14a. Authority Consumption Proof

| Field | Proof |
|---|---|
| Proof ID / authority existence | `ACP-DOM-05`; `YES` — `ADR-0002` revision 3, SHA-256 `EF9289C6FCA4BBA73FCA53CA38C71DD19110EB1CFE948358A7CCA1FE14E177D9`. |
| Scoped decision / truth owner | `ADR0002-D003`; DOM owns command preconditions, canonical failure codes, and no-effect semantics. |
| Semantic source | `DOM-CMD-001`; `GAP-011`, `GAP-012`. |
| Consumed interface / returned data | Canonical command dispatch port; returns accepted transition or structured failure family/code and correlation. |
| Revision/version transport | Command basis carries canonical identity, dependency closure, verdict, and `RevisionId`; stale basis is not rewritten. |
| Failure / stale semantics | `UNKNOWN_SPEC`, `INELIGIBLE_REVISION`, `INVALID_DEPENDENCY_CLOSURE`, `INVALID_COMMAND_BASIS`, and `STALE_REVISION` fail closed and record no effect. |
| Productive availability / evidence | `YES` for local command/rejection boundary and deterministic correlation fixture; BACKEND/PLAT mappings are non-blocking integration consumers. Evidence: `T5-AC1`–`T5-AC3`. |
| Result | `AUTHORITY_CONSUMABLE`. |

## 14b. Producer / Consumer Contract Proof

| Field | Proof |
|---|---|
| Contracts / producers / consumer | `PCP-PLAT-05` records command/rejection correlation; `PCP-BACKEND-01` maps canonical results; DOM remains semantic owner. |
| Interface / input / returned data | Command/result boundary; input is canonical command and basis; output is accepted transition or exact failure family/code, correlation, and unchanged state. |
| Revision/version transport | Command basis revision and correlation ID are preserved in the recorded rejection/result. |
| Failure / not-found / stale | Each five canonical failure families is deterministic, recorded, and has no state/effect mutation; missing correlation is itself a contract failure. |
| Availability / local proof boundary | Local command and correlation fixtures are available; physical journal and transport mapping are later integration evidence, not hidden blockers. |
| Evidence / result | `T5-AC1`–`T5-AC3` direct failure-family and no-effect tests; PRODUCER_CONSUMER_CONTRACT: PROVEN_LOCAL_FIXTURE, RESULT: CONTRACT_DEFINED_LOCAL_WITNESS_ONLY. |

### Capability Availability Reconciliation

APPLICABLE_SHARED_CAPABILITY_RECORDS: CAP-PLAT-SNAPSHOT-PIPELINE-PROVENANCE.
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
SPEC-BACKEND-001`; `PRODUCED_CONTRACT = rejection correlation and canonical
result mapping`; `AUTHORITY_OWNER = SPEC-DOM-001`; `CONSUMER = TICKET-005`;
`CONSUMED_CAPABILITY = command/result boundary and correlation mapping`;
`AVAILABILITY_CONDITION = local command and correlation fixtures available;
physical journal/transport are integration evidence`; `DEPENDENCY_EDGE =
TICKET-005 rejection contract → PLAT/BACKEND mapping consumers`;
`PROOF_EVIDENCE = docs/tickets/SPEC-DOM-001/evidence/TICKET-005/AC-DOM-011-failures.md`.

## 14c. ACCEPTANCE_WITNESS_MATRIX

| AC | Normative behavior / verb | Concrete operation | State/transition | Direct positive test | Direct negative/isolation test | Expected evidence | Acceptance owner |
|---|---|---|---|---|---|---|---|
| AC-DOM-011 | Accept a valid command deterministically | command dispatch | command accepted | `T5-AC1-P` valid command returns canonical success | `T5-AC1-N` malformed command is rejected before dispatch | `docs/tickets/SPEC-DOM-001/evidence/TICKET-005/AC-DOM-011-valid.md` | TICKET-005 |
| AC-DOM-011 | Reject `UNKNOWN_SPEC` | command dispatch | command rejected/no transition | `T5-AC2-P` valid known SPEC baseline remains accepted | `T5-AC2-N` unknown SPEC returns exact family/code and no effect | `docs/tickets/SPEC-DOM-001/evidence/TICKET-005/AC-DOM-011-unknown-spec.md` | TICKET-005 |
| AC-DOM-011 | Reject `INELIGIBLE_REVISION` | command precondition check | command rejected/no transition | `T5-AC3-P` eligible revision command succeeds | `T5-AC3-N` proposed/superseded revision returns exact family/code and no effect | `docs/tickets/SPEC-DOM-001/evidence/TICKET-005/AC-DOM-011-ineligible-revision.md` | TICKET-005 |
| AC-DOM-011 | Reject `INVALID_DEPENDENCY_CLOSURE` | dependency gate | command rejected/no transition | `T5-AC4-P` closed DAG baseline advances | `T5-AC4-N` open/invalid dependency closure returns exact family/code and no effect | `docs/tickets/SPEC-DOM-001/evidence/TICKET-005/AC-DOM-011-dependency-closure.md` | TICKET-005 |
| AC-DOM-011 | Reject `INVALID_COMMAND_BASIS` | basis validation | command rejected/no transition | `T5-AC5-P` canonical basis succeeds | `T5-AC5-N` invalid identity/basis/verdict returns exact family/code and no effect | `docs/tickets/SPEC-DOM-001/evidence/TICKET-005/AC-DOM-011-command-basis.md` | TICKET-005 |
| AC-DOM-011 | Reject `STALE_REVISION` | revision guard | command rejected/no transition | `T5-AC6-P` current revision succeeds | `T5-AC6-N` obsolete revision returns exact family/code and no effect | `docs/tickets/SPEC-DOM-001/evidence/TICKET-005/AC-DOM-011-stale.md` | TICKET-005 |
| AC-DOM-011 | Record rejection atomically without state/effect | rejected command | no state/effect transition | `T5-AC7-P` rejection record has correlation | `T5-AC7-N` state/effect snapshots remain byte-equivalent; retry is idempotent | `docs/tickets/SPEC-DOM-001/evidence/TICKET-005/AC-DOM-011-no-effect.md` | TICKET-005 |

### Temporal Authority Proof

`TEMPORAL_AUTHORITY_PROOF: PRESERVED_FROM_PLAN`; source: Plan `DOM-IMP-05`
Temporal Authority Preconditions. Initial observation is canonical identity/revision/state and
dependency version; the mutation window ends at command commit; the commit
point revalidates the basis; changed or stale basis fails closed with no effect
and prior state is preserved. DOM owns semantic validation; PLAT owns physical
CAS/journal integrity. Evidence: `docs/tickets/SPEC-DOM-001/evidence/TICKET-005/temporal-authority.md`.

## 15. Implementation Constraints

Fail closed; reject stale or invalid basis atomically; never rename DOM failure families or produce partial state/effect.

## 16. Acceptance Criteria

1. Valid and invalid commands return deterministic canonical outcomes.
2. Invalid, stale, dependency-closed, and verdict-incompatible commands create
   no state/effect mutation and expose a canonical reason.
3. All five DOM-owned failure families map without semantic change.
   `LOCAL_PROVABILITY = YES`.

All criteria are `TESTABLE: YES` and `LOCALLY_PROVABLE: YES` after prerequisites.

## 17. Acceptance / Proof Role

`CONTRIBUTOR: YES` to AC-DOM-052. `LOCAL_ACCEPTANCE_OWNER: YES` and `FINAL_PROOF_OWNER: YES` for AC-DOM-011. Not final owner of AC-DOM-052.

## 18. Required Tests

`LOCAL_TEST_EVIDENCE`: unit/application tests for valid dispatch and each canonical failure family (`UNKNOWN_SPEC`, `INELIGIBLE_REVISION`, `INVALID_DEPENDENCY_CLOSURE`, `INVALID_COMMAND_BASIS`, `STALE_REVISION`). `ATOMICITY_EVIDENCE`: unchanged state/effect snapshots and rejection correlation. `CONCURRENCY_EVIDENCE`: stale concurrent command and retry/idempotency tests; mapping regressions remain integration evidence.

## 19. Completion Evidence

Command boundary; canonical reason records; unchanged-state assertions; and correlated result contract. `EXPECTED_EVIDENCE_FILES`: `docs/tickets/SPEC-DOM-001/evidence/TICKET-005/AC-DOM-011-valid.md`, `AC-DOM-011-unknown-spec.md`, `AC-DOM-011-ineligible-revision.md`, `AC-DOM-011-dependency-closure.md`, `AC-DOM-011-command-basis.md`, `AC-DOM-011-stale.md`, `AC-DOM-011-no-effect.md`, `temporal-authority.md`.

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

`NEW_CANONICAL_PATH`; no legacy writer retirement.

## 22. Risks

Partial mutation before validation or transport-level semantic renaming. Mitigation: atomic negative tests and mapping contract tests.

## 23. Implementation Wave

`WAVE: 3`.

## 24. Parallelization

`SAFE_WITH_COORDINATION`; blocked by TICKET-001/004 and unblocks TICKET-006/007/008/012.

## 25. Handoff After Completion

Independent ticket audit may validate this ticket; ticket, publication, and audit-cycle tickets consume its canonical rejection contract.

## 26. Ticket Local Closure

`TICKET_LOCAL_CLOSURE = YES`.
