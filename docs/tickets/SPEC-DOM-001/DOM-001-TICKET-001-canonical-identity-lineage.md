# DOM-001-TICKET-001 — Canonical identity and lineage authority

## 1. Status

`STATUS: VALIDATION_REQUIRED`
`ISSUE_DECOMPOSITION_READINESS: ISSUE_READY`  
`INITIAL_DAG_STATE: READY`  
`BLOCKED_BY: NONE`  
`DEPENDS_ON: NONE`  
`UNBLOCKS: DOM-001-TICKET-002, DOM-001-TICKET-003, DOM-001-TICKET-004, DOM-001-TICKET-005, DOM-001-TICKET-008, DOM-001-TICKET-011, DOM-001-TICKET-012`

`IMPLEMENTATION_DESIGN: docs/tickets/SPEC-DOM-001/DOM-001-TICKET-001-implementation-design.md`
`IMPLEMENTATION_DESIGN_VERDICT: IMPLEMENTATION_DESIGN_READY`
`IMPLEMENTATION_DESIGN_GATE: READY_FOR_IMPLEMENTATION`
`IMPLEMENTATION_BASELINE: baa2a189bd71b85ba9fcc62840e52f091fc2e77e`
`IMPLEMENTATION_HEAD: baa2a189bd71b85ba9fcc62840e52f091fc2e77e (uncommitted working-tree snapshot)`

## 2. Source Traceability

- Accepted ADR authority: `ADR-0001` revision 3, SHA-256 `33705082B9D2F46E638CD93BDF27CA676CFC6181A2684AD583E4501F5D06D50D` — persistent identity and explicit ADR↔SPEC lineage.
- Portfolio: `docs/specs/SPEC-PORTFOLIO-001-organization.md` — O-001, O-005.
- Component SPEC: `docs/specs/SPEC-DOM-001-workflow-authority-and-governance.md` — DOM-ID-001, DOM-LINEAGE-001.
- Gap Matrix: `docs/specs/gap-matrices/SPEC-DOM-001-implementation-gap-matrix.md` — GAP-001, GAP-006.
- Gap Matrix Audit: `docs/specs/gap-matrices/audits/SPEC-DOM-001-implementation-gap-matrix-audit.md` — conformant validation.
- Implementation Plan: `docs/specs/implementation-plans/SPEC-DOM-001-implementation-plan.md` — DOM-IMP-01.
- Plan Audit: `docs/specs/implementation-plans/audits/SPEC-DOM-001-implementation-plan-audit.md` — `IMPLEMENTATION_PLAN_CONFORMANT`.

## 3. Authority / Scope

Approved owner: DOM `CANONICAL_OWNER`. Primary owning specification/domain: `SPEC-DOM-001`. Local ownership covers identity meaning, canonical `STAGE` reference, lineage meaning, and progress. Foreign capability consumed: PLAT physical persistence and recovery only; consumer correlation must not create another authority.

## 4. Portfolio Obligation Coverage

`O-001` persistent aggregate identities; `O-005` explicit many-to-many ADR↔SPEC lineage.

## 5. Gap / Requirement / Acceptance Coverage

Gaps: `GAP-001`, `GAP-006`. GAP-002 is preserved only as obsolete historical
evidence and is not a live implementation scope. Requirements: `DOM-ID-001`,
`DOM-LINEAGE-001`. Local acceptance: `AC-DOM-001`, `AC-DOM-005`. Integrated
contribution: evidence to `AC-DOM-052`; final proof owner for that acceptance is TICKET-012.

## 6. Implementation Unit

`DOM-IMP-01 — Canonical identity and lineage authority`. Formation reason: `SHARED_AUTHORITY + SHARED_PERSISTENCE_BOUNDARY`. No split siblings; no merge. `UNIT_SCOPE_LOST_BY_SPLIT: 0`.

## 7. Goal

Provide productive, persistent-resolution semantics for DOM aggregate identities and explicit independent ADR↔SPEC lineage.

## 8. Validated Implementation Delta

`OBSERVED`: only in-memory IDs and relationship arrays exist in the prototype.  
`REQUIRED`: stable, resolvable, immutable canonical identities and explicit many-to-many lineage.  
`DELTA`: no productive identity or lineage authority exists.

## 9. Required Behavior

Create and resolve canonical identities; reject unresolved or invalid-revision references; preserve identity distinctions and independent ADR/SPEC progress. Downstream consumers may correlate records but may not create a second identity authority.

## 10. Does Not Implement

Foreign persistence mechanics, assignment/session lifecycle, effect or publication execution, backend/API authorization, UI/OPS projections, or downstream final conformance.

## 11. Repository Evidence

`src/domain/identity.ts`, `src/domain/lineage.ts`, `src/application/lineage.ts`, and `tests/dom-001-ticket-001.test.ts`. Reuse value semantics and extend the persistence seam; remove `PipelineId` as authority.

## 12. Expected Repository Impact

Production code: domain identity/lineage model and canonical command/query boundary.  
Persistence/schema: identity-resolution persistence contract only; physical mechanics remain foreign.  
Integration: consumer correlation seam.  
Tests: identity, lineage, historical-resolution, and regression tests.  
Legacy/cutover: new canonical path with historical reads.  
Generated contracts: none locally required.

## 13. Dependencies

Internal ticket dependencies: none. Cross-SPEC dependencies: none blocking; AgentId, assignment/session, ExternalEffectId, and PublicationId remain distinct foreign concepts.

## 14. Blocking Conditions

The ticket began with INITIAL_STATUS READY and INITIAL_DAG_STATE READY. Its
current status is VALIDATION_REQUIRED after implementation evidence; it is not
a new current READY claim.

## 14a. Authority Consumption Proof

| Field | Proof |
|---|---|
| Proof ID / authority existence | `ACP-DOM-01`; `YES` — `ADR-0001` revision 3, SHA-256 `33705082B9D2F46E638CD93BDF27CA676CFC6181A2684AD583E4501F5D06D50D`. |
| Scoped decision / truth owner | `ADR0001-D001`, `ADR0001-D003`; DOM / `SPEC-DOM-001` is the canonical semantic owner. |
| Semantic source | `DOM-ID-001`, `DOM-LINEAGE-001`; validated `GAP-001`, `GAP-006`. GAP-002 is historical obsolete only. |
| Consumed interface / returned data | `CanonicalIdentityReference` and lineage command/query port; returns canonical identity, scope, revision, and independent relation progress. |
| Revision/version transport | Identity and lineage records carry `RevisionId` and exact ADR/SPEC references; no caller-supplied alternate identity is accepted. |
| Failure / stale semantics | Unknown kind/scope/revision, duplicate relation, stale revision, and alternate `PipelineId` authority fail closed with no mutation. |
| Productive availability / evidence | Local contract witness is available; PLAT productive availability is NO and the capability is REQUIRED_FOR_INTEGRATED_PROOF. PLAT physical recovery is an integrated checkpoint, not a start prerequisite. Evidence: witness rows `T1-AC1`–`T1-AC3`. |
| Result | CONTRACT_DEFINED_LOCAL_WITNESS_ONLY; not AUTHORITY_CONSUMABLE. |

## 14b. Producer / Consumer Contract Proof

| Field | Proof |
|---|---|
| Contract / producer / consumer | `PCP-PLAT-01`; `SPEC-PLAT-001` produces durable identity/lineage records; DOM consumes the port contract and owns meaning. |
| Interface / input / returned data | Identity/lineage persistence and rehydration port; input is canonical reference plus revision; output is the same reference, lineage, and correlation data. |
| Revision/version transport | `RevisionId`, ADR/SPEC identity, and lineage relation identifiers are persisted and returned unchanged. |
| Failure / not-found / stale | Unknown identity, missing record, duplicate relation, and stale revision return canonical failure and preserve prior state. |
| Availability / local proof boundary | Local port plus deterministic contract fixture is available for implementation and closure; physical PLAT runtime is required only at the planned integrated checkpoint. |
| Evidence / result | `tests/dom-001-ticket-001.test.ts` direct round-trip, isolation, and rehydration witnesses; PRODUCER_CONSUMER_CONTRACT: PROVEN_LOCAL_FIXTURE, RESULT: CONTRACT_DEFINED_LOCAL_WITNESS_ONLY. |

`PRODUCER_CONSUMER_CONTRACT_PROOF_FIELDS`: `PRODUCER = SPEC-PLAT-001`;
`PRODUCED_CONTRACT = durable identity/lineage records, revision transport, and
recovery result`; `AUTHORITY_OWNER = SPEC-DOM-001`; `CONSUMER = TICKET-001`;
`CONSUMED_CAPABILITY = identity/lineage persistence and rehydration port`;
`AVAILABILITY_CONDITION = local port and deterministic fixture available at
execution; PLAT runtime required at integrated durability checkpoint`;
`DEPENDENCY_EDGE = PLAT persistence contract → TICKET-001 rehydration`;
`PROOF_EVIDENCE = docs/tickets/SPEC-DOM-001/evidence/TICKET-001/AC-DOM-001-identity.md`.

### Capability Availability Reconciliation

APPLICABLE_SHARED_CAPABILITY_RECORDS: CAP-PLAT-SNAPSHOT-PIPELINE-PROVENANCE.
RECONCILIATION_SOURCE: README section 11.1 and current Plan section 12.1.
AUTHORITY_STATUS = DEFINED; CONTRACT_STATUS = DEFINED; LOCAL_TESTABILITY = NO;
PRODUCTIVE_AVAILABILITY = NO; DEPENDENCY_CLASS = REQUIRED_FOR_INTEGRATED_PROOF.
BLOCKING_EFFECT: no local execution or local-closure block; integrated proof
only. Local fixture evidence is contract-level only. The complete owner,
producer, consumer, contract, failure semantics, version transport, and
availability evidence are the shared record in README section 11.1.
NO_DOWNSTREAM_CAPABILITY_PROMOTION_WITHOUT_NEW_EVIDENCE = TRUE.

## 14c. ACCEPTANCE_WITNESS_MATRIX

| AC | Normative behavior / verb | Concrete operation | State/transition | Direct positive test | Direct negative/isolation test | Expected evidence | Acceptance owner |
|---|---|---|---|---|---|---|---|
| AC-DOM-001 | Create, lookup, persist, rehydrate, compare identity | identity create/lookup/rehydrate command | canonical identity continuity | `T1-AC1-P` identity round-trip and historical lookup | `T1-AC1-N` unknown kind/scope/revision; no filename-only identity | `docs/tickets/SPEC-DOM-001/evidence/TICKET-001/AC-DOM-001-identity.md` | TICKET-001 |
| AC-DOM-001 | Reject alternate `PipelineId` authority | identity lookup/persist command | canonical reference remains authoritative | `T1-AC1-P2` canonical reference lookup | `T1-AC1-N2` `PipelineId` substitution cannot create or retrieve identity | `docs/tickets/SPEC-DOM-001/evidence/TICKET-001/AC-DOM-001-alternate-authority.md` | TICKET-001 |
| AC-DOM-005 | Add, progress, and query lineage independently | lineage add/progress/query command | ADR↔SPEC relation progress | `T1-AC2-P` two independent relation transitions | `T1-AC2-N` duplicate and cross-relation mutation rejected | `docs/tickets/SPEC-DOM-001/evidence/TICKET-001/AC-DOM-005-lineage.md` | TICKET-001 |
| AC-DOM-001 / AC-DOM-005 | Rehydrate immutable identity and lineage | aggregate rehydration command | persisted canonical state restored | `T1-AC3-P` rehydration recovery | `T1-AC3-N` missing, stale, or corrupted record rejected without mutation | `docs/tickets/SPEC-DOM-001/evidence/TICKET-001/AC-DOM-001-rehydration.md` | TICKET-001 |

`TEMPORAL_AUTHORITY_PROOF: NOT_APPLICABLE` — Plan `DOM-IMP-01` explicitly
classifies this as no external effect. Identity and lineage revisions are
carried through lookup/CAS and stale references fail closed; no mutable
authority is observed and later committed by this ticket.

## 15. Implementation Constraints

Preserve canonical identity, scope, immutability, historical resolution, identity distinctions, and many-to-many lineage independence. Do not infer identity from a filename alone.

## 16. Acceptance Criteria

1. Canonical identity is created, looked up, persisted/retrieved through the
   port, compared, and rejected for unknown kind/scope/revision.
2. `PipelineId` cannot create an independent lookup or persisted identity.
3. Two ADR↔SPEC relations progress independently and remain queryable after
   rehydration. `LOCAL_PROVABILITY = YES` for each criterion.

All criteria are `TESTABLE: YES` and `LOCALLY_PROVABLE: YES`.

## 17. Acceptance / Proof Role

`CONTRIBUTOR: YES` to AC-DOM-052. `LOCAL_ACCEPTANCE_OWNER: YES` for AC-DOM-001 and AC-DOM-005. `FINAL_PROOF_OWNER: YES` for AC-DOM-001 and AC-DOM-005; `FINAL_PROOF_OWNER: NO` for AC-DOM-052.

## 18. Required Tests

`LOCAL_TEST_EVIDENCE`: unit/domain identity, immutability, historical lookup, lineage isolation, duplicate rejection, and direct concurrency/idempotency tests. `RECOVERY_EVIDENCE`: persisted identity/lineage rehydration and stale-revision rejection. `INTEGRATION_TEST_EVIDENCE`: PLAT durability checkpoint is separate and does not replace local witnesses.

## 19. Completion Evidence

Canonical identity/lineage commands and ports, no parallel authority path, direct positive/negative tests, and a passing contract fixture report. `EXPECTED_EVIDENCE_FILES`: `docs/tickets/SPEC-DOM-001/evidence/TICKET-001/AC-DOM-001-identity.md`, `AC-DOM-001-alternate-authority.md`, `AC-DOM-005-lineage.md`, `AC-DOM-001-rehydration.md`.

### Implementation Execution Record

```text
INITIAL_STATUS: READY
FINAL_STATUS: VALIDATION_REQUIRED
AC-DOM-001: SATISFIED
AC-DOM-005: SATISFIED
AC-DOM-052: CONTRIBUTOR_EVIDENCE_PRESENT; FINAL_PROOF_OWNER = TICKET-012
```

Evidence status:

- `production_code: PRESENT` — `src/domain/identity.ts` adds the canonical
  `STAGE` reference boundary and validated identity-record rehydration.
- `automated_tests: PRESENT` — `tests/dom-001-ticket-001.test.ts` directly
  covers Stage identity shape, `PipelineId`-shaped input rejection, identity
  rehydration, immutable state, identity/lineage uniqueness, isolation,
  concurrency, stale progress, and recovery. The affected pipeline contract
  tests also verify that `WorkflowPipeline`, repository lookup, and application
  commands use only the canonical Stage reference.
- `persistence_schema: NOT_APPLICABLE` — physical persistence remains
  PLAT-owned; existing repository ports and deterministic fixtures preserve the
  contract.
- `integration_evidence: NOT_APPLICABLE` — no foreign implementation is
  required for local closure; PLAT durability remains an integrated checkpoint.
- `legacy_transition_evidence: PRESENT` — the canonical Stage boundary rejects
  PipelineId-shaped identity commands, and the productive WorkflowPipeline
  seam no longer exposes PipelineId as an identity or lookup authority; the
  prototype remains untouched.
- `conformance_evidence: PRESENT` — 31 relevant productive tests, 92 prototype
  regression tests, prototype lint, and prototype build passed.

```text
TESTS_RUN: 123
TESTS_PASSED: 123
TESTS_FAILED: 0
TESTS_SKIPPED: 0
ENVIRONMENTAL_FAILURES: 0
IMPLEMENTATION_STRUCTURAL_SELF_CHECK: PASS
STRUCTURAL_REVIEW_CORRECTION:
  finding: STRUCT-MAJOR-001 — WorkflowPipeline PipelineId identity seam was not wired to the approved canonical Stage reference
  classification: LOCAL_AUTHORITY_ALIGNMENT
  correction: WorkflowPipeline, pipeline repository/state-reader ports, and pipeline handlers now transport and resolve CanonicalIdentityReference(kind=STAGE, scope=ExecutionId, value=StageId); PipelineId was removed from productive identity authority
  scope: pipeline transitions remain unchanged and the prototype remains untouched
  result: RESOLVED
```

## 20. Completion Gate

```text
COMPLETION_GATE:
  production_code: REQUIRED
  automated_tests: REQUIRED
  integration_evidence: NOT_APPLICABLE
  legacy_transition_evidence: REQUIRED
  conformance_evidence: REQUIRED
```

## 21. Legacy / Cutover Impact

`REMOVE_ALTERNATE_AUTHORITY`: old local `PipelineId` writes/lookups are removed or mapped to the canonical reference; historical reads use explicit mapping.

## 22. Risks

Identity collapse with assignment/session or presentation IDs. Mitigation: explicit distinction tests and boundary review.

## 23. Implementation Wave

`WAVE: 1`.

## 24. Parallelization

`SERIAL_REQUIRED`. `UNBLOCKS: DOM-001-TICKET-002, DOM-001-TICKET-003, DOM-001-TICKET-004, DOM-001-TICKET-005, DOM-001-TICKET-008, DOM-001-TICKET-011, DOM-001-TICKET-012`.

## 25. Handoff After Completion

Independent ticket audit may validate this ticket. Completion unblocks its listed dependents; integrated proof remains at the plan checkpoints.

## 26. Ticket Local Closure

`TICKET_LOCAL_CLOSURE = YES`. Local acceptance, tests, and completion evidence are executable without future downstream behavior.
