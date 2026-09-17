# DOM-001-TICKET-005 — Canonical commands and failure semantics

## 1. Status

`STATUS: DONE`

### Implementation execution record

```text
INITIAL_STATUS: READY
FINAL_STATUS: DONE
TICKET_AUDIT_HEAD: 6b31bcee1591c8b2e6499a434950664077b2be01
IMPLEMENTATION_BASELINE: 6b31bcee1591c8b2e6499a434950664077b2be01 plus the assessed dirty worktree
CURRENT_HEAD: 6b31bcee1591c8b2e6499a434950664077b2be01
BASELINE_DRIFT: LOCALIZED_IMPLEMENTATION_DRIFT
DESIGN_DEVIATIONS: none in the promoted producer handoff; independent T005 implementation audit complete
IMPLEMENTATION_STRUCTURAL_SELF_CHECK: PASS
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
CHANGED_FILES: src/domain/command.ts; src/application/command.ts; src/application/pipeline.ts; src/application/command-authority.ts; src/application/composition.ts; tests/dom-001-ticket-001.test.ts; tests/dom-001-ticket-004.test.ts; tests/dom-001-ticket-005.test.ts; tests/dom-001-ticket-013.test.ts; docs/tickets/SPEC-DOM-001/evidence/TICKET-005/*
TESTS_RUN: focused T005 suite (14); focused T013 suite (12); full productive suite (103); strict source typecheck; prototype lint/build
TESTS_PASSED: 14 T005 focused; 12 T013 focused; 103 full; all type/lint/build checks PASS
TESTS_FAILED: 0
TESTS_SKIPPED: 0
ENVIRONMENTAL_FAILURES: 0
ACCEPTANCE_CRITERIA: AC-DOM-011 contract witnesses PASS; promoted productive authority is available; independent consumer audit PASS; local gate READY_FOR_DONE
COMPLETION_EVIDENCE: contract evidence PRESENT; productive authority composition and promotion PRESENT; canonical T005 implementation audit and local finalization PRESENT; integrated PLAT proof remains pending
REMAINING_BLOCKERS: NONE for local ticket closure; IMA-MAJOR-002 remains open for integrated CP-DOM-02; downstream ticket states are unchanged
```
`ISSUE_DECOMPOSITION_READINESS: ISSUE_READY`
`INITIAL_DAG_STATE: BLOCKED`
`BLOCKED_BY: NONE`
`CURRENT_DAG_STATE: DONE`
`DEPENDS_ON: DOM-001-TICKET-001, DOM-001-TICKET-004, DOM-001-TICKET-013`
`UNBLOCKS: DOM-001-TICKET-006, DOM-001-TICKET-007, DOM-001-TICKET-008, DOM-001-TICKET-012`

## 2. Source Traceability

- Accepted ADR authority: `ADR-0002` revision 3, SHA-256 `EF9289C6FCA4BBA73FCA53CA38C71DD19110EB1CFE948358A7CCA1FE14E177D9` — command preconditions, canonical rejection, and no-effect transitions.
- Portfolio: `docs/specs/SPEC-PORTFOLIO-001-organization.md` — O-011.
- Component SPEC: `docs/specs/SPEC-DOM-001-workflow-authority-and-governance.md` — DOM-CMD-001.
- Gap Matrix: `docs/specs/gap-matrices/SPEC-DOM-001-implementation-gap-matrix.md` — GAP-011, GAP-012.
- Gap Matrix Audit: `docs/specs/gap-matrices/audits/SPEC-DOM-001-implementation-gap-matrix-audit.md`.
- Implementation Plan: `docs/specs/implementation-plans/SPEC-DOM-001-implementation-plan.md` — SHA-256 `388F5F0797C291887E3C0005845CCDFD0E2DBF83DDD5EAA38385121F98D9184F`; DOM-IMP-05, producer DOM-IMP-13.
- Producer Plan Unit: `DOM-IMP-13` / `DOM-001-TICKET-013` produces `CAP-DOM-COMMAND-AUTHORITY-OBSERVATION`.
- Prior Plan Audit: `docs/specs/implementation-plans/audits/SPEC-DOM-001-implementation-plan-audit-2026-09-15-reaudit-003.md`; its unresolved-producer verdict is historical and superseded by fresh audit evidence.

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

Internal: `DOM-001-TICKET-001`, `DOM-001-TICKET-004`, and producer `DOM-001-TICKET-013`. Cross-SPEC: PLAT-001 and BACKEND-001/UI-001 mappings, all non-blocking locally.

## 14. Blocking Conditions

TICKET-001 and TICKET-004 are complete and remain in `DEPENDS_ON` for lineage.
`DOM-IMP-13`/TICKET-013 is complete, its runtime composition has been
independently audited, and `PROMO-DOM-COMMAND-AUTHORITY-01` promotes
`CAP-DOM-COMMAND-AUTHORITY-OBSERVATION` for this consumer.
T005 has no active capability blocker. Its independent implementation audit
and local finalization are complete; the integrated PLAT handoff remains open.
`DOM-IMP-03`/TICKET-003 remains an invalid substitute because it produces
only the ADR authority observation capability.

## 14a. Authority Consumption Proof

| Field | Proof |
|---|---|
| Proof ID / authority existence | `ACP-DOM-05`; `YES` — `ADR-0002` revision 3, SHA-256 `EF9289C6FCA4BBA73FCA53CA38C71DD19110EB1CFE948358A7CCA1FE14E177D9`. |
| Scoped decision / truth owner | `ADR0002-D003`; DOM owns command preconditions, canonical failure codes, and no-effect semantics. |
| Semantic source | `DOM-CMD-001`; `GAP-011`, `GAP-012`. |
| Consumed interface / returned data | Canonical command dispatch port; returns accepted transition or structured failure family/code and correlation. |
| Revision/version transport | Command basis carries canonical identity, dependency closure, verdict, and `RevisionId`; stale basis is not rewritten. |
| Failure / stale semantics | `UNKNOWN_SPEC`, `INELIGIBLE_REVISION`, `INVALID_DEPENDENCY_CLOSURE`, `INVALID_COMMAND_BASIS`, and `STALE_REVISION` fail closed and record no effect. |
| Productive availability / evidence | `YES` for `CAP-DOM-COMMAND-AUTHORITY-OBSERVATION`; TICKET-013 implementation, runtime composition, independent producer audit, and `PROMO-DOM-COMMAND-AUTHORITY-01` are present. PLAT/BACKEND mappings remain integrated-only. |
| Result | `AUTHORITY_DEFINED_AND_PRODUCTIVELY_CONSUMABLE`; T005 local witnesses are executable, while fresh independent consumer validation remains pending. |

## 14b. Producer / Consumer Contract Proof

| Field | Proof |
|---|---|
| Contracts / producers / consumer | `PCP-PLAT-05` records command/rejection correlation; `PCP-BACKEND-01` maps canonical results; DOM remains semantic owner. |
| Interface / input / returned data | Command/result boundary; input is canonical command and basis; output is accepted transition or exact failure family/code, correlation, and unchanged state. |
| Revision/version transport | Command basis revision and correlation ID are preserved in the recorded rejection/result. |
| Failure / not-found / stale | Each five canonical failure families is deterministic, recorded, and has no state/effect mutation; missing correlation is itself a contract failure. |
| Availability / local proof boundary | `CAP-DOM-COMMAND-AUTHORITY-OBSERVATION` is productively available through TICKET-013 and `PROMO-DOM-COMMAND-AUTHORITY-01`; the productive observation and local command/correlation fixtures are available for T005 local witnesses. The physical `CAP-PLAT-SNAPSHOT-PIPELINE-PROVENANCE` journal capability and foreign transport mappings remain integrated-only evidence. |
| Evidence / result | `T5-AC1`–`T5-AC3` direct failure-family and no-effect tests; `PRODUCER_CONSUMER_CONTRACT: PROVEN_LOCAL_AND_PROMOTED_PRODUCER`, `RESULT: PRODUCTIVE_COMMAND_AUTHORITY_AVAILABLE`; fresh independent T005 consumer validation remains pending. |

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

### Acceptance witness context
`PRODUCER_CONSUMER_CONTRACT_PROOF_FIELDS`: `PRODUCER = SPEC-PLAT-001,
SPEC-BACKEND-001`; `PRODUCED_CONTRACT = rejection correlation and canonical
result mapping`; `AUTHORITY_OWNER = SPEC-DOM-001`; `CONSUMER = TICKET-005`;
`CONSUMED_CAPABILITY = command/result boundary and correlation mapping`;
`AVAILABILITY_CONDITION = local command and correlation fixtures available;
physical journal/transport are integration evidence`; `DEPENDENCY_EDGE =
TICKET-005 rejection contract → PLAT/BACKEND mapping consumers`;
`PROOF_EVIDENCE = docs/tickets/SPEC-DOM-001/evidence/TICKET-005/AC-DOM-011-failures.md`.

## 14c. ACCEPTANCE_WITNESS_MATRIX

| NORMATIVE_BEHAVIOR | NORMATIVE_VERB | CONCRETE_OPERATION_COMMAND_OR_QUERY | STATE_OR_TRANSITION_AFFECTED | DIRECT_POSITIVE_TEST | DIRECT_NEGATIVE_OR_ISOLATION_TEST | EXPECTED_EVIDENCE_FILE | EVIDENCE_TYPE | ACCEPTANCE_OWNER | REQUIRED_PRODUCER_OR_CAPABILITY | AUTHORITY_STATUS | CONTRACT_STATUS | LOCAL_TESTABILITY | PRODUCTIVE_AVAILABILITY | CAPABILITY_SUMMARY_STATUS | DEPENDENCY_CLASS | WITNESS_EXECUTABLE_AT_LOCAL_CLOSURE |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Valid command | accepts deterministically | command dispatch | command accepted | `T5-AC1-P` valid command returns canonical success | `T5-AC1-N` malformed command rejected before dispatch | `docs/tickets/SPEC-DOM-001/evidence/TICKET-005/AC-DOM-011-valid.md` | LOCAL_TEST_EVIDENCE | TICKET-005 | `CAP-DOM-COMMAND-AUTHORITY-OBSERVATION`; TICKET-013 promotion record present; fresh T005 audit pending | DEFINED | DEFINED | YES | YES | CONTRACT_PRODUCTIVELY_AVAILABLE | REQUIRED_FOR_LOCAL_EXECUTION | YES |
| UNKNOWN_SPEC | rejects | command dispatch | rejected/no transition | `T5-AC2-P` known SPEC baseline accepted | `T5-AC2-N` unknown SPEC exact family/code and no effect | `docs/tickets/SPEC-DOM-001/evidence/TICKET-005/AC-DOM-011-unknown-spec.md` | LOCAL_TEST_EVIDENCE | TICKET-005 | `CAP-DOM-COMMAND-AUTHORITY-OBSERVATION`; TICKET-013 promotion record present; fresh T005 audit pending | DEFINED | DEFINED | YES | YES | CONTRACT_PRODUCTIVELY_AVAILABLE | REQUIRED_FOR_LOCAL_EXECUTION | YES |
| INELIGIBLE_REVISION | rejects | command precondition check | rejected/no transition | `T5-AC3-P` eligible revision succeeds | `T5-AC3-N` proposed/superseded revision exact family/code and no effect | `docs/tickets/SPEC-DOM-001/evidence/TICKET-005/AC-DOM-011-ineligible-revision.md` | LOCAL_TEST_EVIDENCE | TICKET-005 | `CAP-DOM-COMMAND-AUTHORITY-OBSERVATION`; TICKET-013 promotion record present; fresh T005 audit pending | DEFINED | DEFINED | YES | YES | CONTRACT_PRODUCTIVELY_AVAILABLE | REQUIRED_FOR_LOCAL_EXECUTION | YES |
| INVALID_DEPENDENCY_CLOSURE | rejects | dependency gate | rejected/no transition | `T5-AC4-P` closed DAG baseline advances | `T5-AC4-N` open/invalid closure exact family/code and no effect | `docs/tickets/SPEC-DOM-001/evidence/TICKET-005/AC-DOM-011-dependency-closure.md` | LOCAL_TEST_EVIDENCE | TICKET-005 | `CAP-DOM-COMMAND-AUTHORITY-OBSERVATION`; TICKET-013 promotion record present; fresh T005 audit pending | DEFINED | DEFINED | YES | YES | CONTRACT_PRODUCTIVELY_AVAILABLE | REQUIRED_FOR_LOCAL_EXECUTION | YES |
| INVALID_COMMAND_BASIS | rejects | basis validation | rejected/no transition | `T5-AC5-P` canonical basis succeeds | `T5-AC5-N` invalid identity/basis/verdict exact family/code and no effect | `docs/tickets/SPEC-DOM-001/evidence/TICKET-005/AC-DOM-011-command-basis.md` | LOCAL_TEST_EVIDENCE | TICKET-005 | `CAP-DOM-COMMAND-AUTHORITY-OBSERVATION`; TICKET-013 promotion record present; fresh T005 audit pending | DEFINED | DEFINED | YES | YES | CONTRACT_PRODUCTIVELY_AVAILABLE | REQUIRED_FOR_LOCAL_EXECUTION | YES |
| STALE_REVISION | rejects | revision guard | rejected/no transition | `T5-AC6-P` current revision succeeds | `T5-AC6-N` obsolete revision exact family/code and no effect | `docs/tickets/SPEC-DOM-001/evidence/TICKET-005/AC-DOM-011-stale.md` | LOCAL_TEST_EVIDENCE | TICKET-005 | `CAP-DOM-COMMAND-AUTHORITY-OBSERVATION`; physical CAS remains integrated PLAT evidence; TICKET-013 promotion record present | DEFINED | DEFINED | YES | YES | CONTRACT_PRODUCTIVELY_AVAILABLE | REQUIRED_FOR_LOCAL_EXECUTION | YES |
| Rejection record | records atomically without effect | rejected command | no state/effect transition | `T5-AC7-P` rejection record has correlation | `T5-AC7-N` state/effect byte-equivalent; retry idempotent | `docs/tickets/SPEC-DOM-001/evidence/TICKET-005/AC-DOM-011-no-effect.md` | LOCAL_TEST_EVIDENCE | TICKET-005 | `CAP-DOM-COMMAND-AUTHORITY-OBSERVATION`; PLAT durable record remains integrated evidence; TICKET-013 promotion record present | DEFINED | DEFINED | YES | YES | CONTRACT_PRODUCTIVELY_AVAILABLE | REQUIRED_FOR_LOCAL_EXECUTION | YES |

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
   `LOCAL_PROVABILITY = YES` after the promoted
   `CAP-DOM-COMMAND-AUTHORITY-OBSERVATION` handoff; independent audit and
   local finalization are now recorded.

All criteria remain `TESTABLE: YES` and `LOCALLY_PROVABLE: YES`. The integrated
PLAT durability/recovery proof remains a downstream checkpoint only.

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
  local_completion_evidence: REQUIRED
  integration_evidence: REQUIRED_AS_LOCAL_CONTRACT_CONTRIBUTION; FOREIGN_PRODUCTIVE_CHECKPOINT_DEFERRED
  legacy_transition_evidence: NOT_APPLICABLE_LOCALLY; FOREIGN_RETIREMENT_DEFERRED
  conformance_evidence: REQUIRED_FOR_LOCAL_CONTRIBUTION; FINAL_CONFORMANCE_DEFERRED_TO_TICKET-012
  local_closure_boundary: productive command-authority observation plus local rejection/correlation evidence are required; physical transport is not required for local closure
```

## 21. Legacy / Cutover Impact

`NEW_CANONICAL_PATH`; no legacy writer retirement.

## 22. Risks

Partial mutation before validation or transport-level semantic renaming. Mitigation: atomic negative tests and mapping contract tests.

## 23. Implementation Wave

`WAVE: 4`.

## 24. Parallelization

`SERIAL_REQUIRED`; depends on completed TICKET-001/004/013 and unblocks TICKET-006/007/008/012 after fresh T005 validation.

## 25. Handoff After Completion

Canonical implementation audit and local finalization are complete; ticket, publication, and audit-cycle tickets consume its canonical rejection contract.

## 26. Ticket Local Closure

`TICKET_LOCAL_CLOSURE = YES` — the promoted productive capability and all
local AC witnesses are present. The independent canonical implementation audit
records `TICKET_GATE = READY_FOR_DONE` and no local blocking finding remains.

## 27. Local Finalization

```text
FINALIZATION_VERDICT: TICKET_FINALIZED_LOCALLY
FINALIZATION_AUTHORITY: docs/tickets/SPEC-DOM-001/DOM-001-TICKET-005-implementation-audit.md
AUDIT_ROUND: RE_AUDIT
AUDIT_ROUND_NUMBER: 7
AUDIT_TARGET_HEAD: 6b31bcee1591c8b2e6499a434950664077b2be01
CURRENT_HEAD: 6b31bcee1591c8b2e6499a434950664077b2be01
AUDIT_BASIS_FINGERPRINT: 01978373A7C917D5872D093A1ADFA49A71F031DAB38B673F219A1FA35DD38E04
LOCAL_TICKET_DONE_ALLOWED: YES
TICKET_GATE: READY_FOR_DONE
LOCAL_TICKET_DONE_BLOCKERS: 0
LOCAL_CLOSURE_PERSISTED: YES
FINAL_TICKET_STATUS: DONE
OPEN_INTEGRATED_FINDINGS: 1
OPEN_INTEGRATED_FINDING_IDS: IMA-MAJOR-002
INTEGRATED_HANDOFFS_COMPLETE: YES
INTEGRATED_ONLY_AVAILABILITY_BLOCKING_LOCAL_DONE: 0
LOCAL_CLOSURE_FINDINGS_NOT_BLOCKING_DONE: 0
FINDING_SEVERITY_USED_AS_SOLE_COMPLETION_GATE: 0
OPEN_INTEGRATED_FINDING_LOST_FROM_TRACEABILITY: 0
SPECIALIST_CANNOT_SILENTLY_PROMOTE_INTEGRATED_DEPENDENCY_TO_LOCAL_BLOCKER: TRUE
CONSOLIDATOR_CANNOT_DERIVE_LOCAL_BLOCKING_FROM_SEVERITY_ALONE: TRUE
LOCAL_DONE_GATE_USES_LOCAL_CLOSURE_SCOPE: TRUE
INTEGRATED_PROOF_GATE_USES_INTEGRATED_DEPENDENCY_SCOPE: TRUE
AUDIT_ARTIFACT_IMMUTABILITY: REQUIRED
UPSTREAM_AUDIT_ARTIFACTS_MODIFIED_BY_FINALIZATION: 0
UPSTREAM_AUTHORITY_ARTIFACTS_MODIFIED_BY_FINALIZATION: 0
DOWNSTREAM_TICKET_STATE_MUTATIONS: 0
DAG_EDGES_RELEASED: 4
DEPENDENCY_SATISFIED_FOR: DOM-001-TICKET-006, DOM-001-TICKET-007, DOM-001-TICKET-008, DOM-001-TICKET-012
TICKETS_NEWLY_UNBLOCKED: DOM-001-TICKET-006, DOM-001-TICKET-007, DOM-001-TICKET-008
TICKETS_STILL_BLOCKED: DOM-001-TICKET-009, DOM-001-TICKET-010, DOM-001-TICKET-011, DOM-001-TICKET-012 by remaining prerequisites
DOWNSTREAM_CHECKPOINTS_PRESERVED: YES
SPEC_FINAL_CONFORMANCE_STATE: NOT_FINAL_CONFORMANT_YET
PRODUCTIVE_AVAILABILITY_PROMOTED: NO
INTEGRATED_PROOF_AUTO_APPROVED: NO
SPEC_FINALIZED: NO
```

### Canonical downstream handoff — IMA-MAJOR-002

```text
FINDING_ID: IMA-MAJOR-002
STATUS: OPEN
FINDING_STATUS: OPEN
CAPABILITY: CAP-PLAT-SNAPSHOT-PIPELINE-PROVENANCE / PCP-PLAT-05
DEPENDENCY_CLASS: REQUIRED_FOR_INTEGRATED_PROOF
LOCAL_CLOSURE_BLOCKING: NO
LOCAL_ACCEPTANCE_REQUIRES_PRODUCTIVE_CAPABILITY: NO
CLOSURE_OWNERSHIP: INTEGRATED_CHECKPOINT
DEPENDENCY_CLASS_RECLASSIFICATION_REQUIRED: NO
UPSTREAM_DEPENDENCY_CLASSIFICATION_PRESERVED: YES
BLOCKS_LOCAL_EXECUTION: NO
BLOCKS_LOCAL_CLOSURE: NO
BLOCKS_TICKET_DONE: NO
BLOCKS_INTEGRATED_PROOF: YES
BLOCKS_SPEC_FINAL_CONFORMANCE: YES
PRIMARY_ROUTE: IMPLEMENTATION_PLAN_REVALIDATION
DOWNSTREAM_CHECKPOINT: CP-DOM-02 integrated command/rejection durability and recovery
DOWNSTREAM_OWNER: SPEC-PLAT-001 / PLAT implementation owner
SOURCE_AUDIT: docs/tickets/SPEC-DOM-001/DOM-001-TICKET-005-implementation-audit.md
SOURCE_TICKET: DOM-001-TICKET-005
OPEN_INTEGRATED_FINDING_TRACEABILITY: COMPLETE
```

Local finalization changes only this ticket's state and its DAG projection.
`IMA-MAJOR-002` remains open and is not resolved, reclassified, promoted, or
transferred to DOM. Downstream ticket definitions are not transitioned here.
