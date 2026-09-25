# EXEC-001-TICKET-004 â€” Source-bound NORMAL/BOOTSTRAP catalog consumption

## 1. Status

```text
STATUS: BLOCKED
ISSUE_DECOMPOSITION_READINESS: ISSUE_READY
INITIAL_DAG_STATE: BLOCKED
EXECUTION_READY: FALSE until internal prerequisites close
BLOCKED_BY: EXEC-001-TICKET-003
DEPENDS_ON: EXEC-001-TICKET-003
UNBLOCKS: EXEC-001-TICKET-005, EXEC-001-TICKET-006, EXEC-001-TICKET-008, EXEC-001-TICKET-009
```

`STATUS` is derived from the Plan's initial DAG state and the shared `EXECUTION_READY` predicate. Integrated-only unavailable capabilities are not local blockers.

## 2. Source Traceability

- Portfolio: `docs/specs/SPEC-PORTFOLIO-001-organization.md` â€” rev2; SHA-256 `c449388972279d8add520564a9614cfa236f87b6c8932a70d5bc2d28eef6be86`
- Portfolio audit: `docs/specs/SPEC-PORTFOLIO-001-decomposition-audit.md` â€” `PORTFOLIO_DECOMPOSITION_APPROVED`; SHA-256 `120f22d0080ac0640ebbdad7c460df5de2745788cfaea83a1859f2c577168104`
- Component SPEC: `docs/specs/SPEC-EXEC-001-skill-contracts-and-capability-registry.md` â€” rev5; SHA-256 `556f4b5ad0b1c8f10d4fd00964d84e1af5bb959724d023eed9bda12a282411b2`
- Component SPEC audit: `docs/specs/audits/SPEC-EXEC-001-component-conformance-audit.md` â€” `PASS â€” COMPONENT_SPEC_CONFORMANT`; SHA-256 `fae060d0595ceecf81daa56b7a5a9a597d503f974d20bdcd8eb3e6d1fc4add2e`
- Upstream SPEC: `docs/specs/SPEC-DOM-001-workflow-authority-and-governance.md` â€” rev4; SHA-256 `cb4a21924d9619b8349d6cc239d7998633c402d7ea3d7461c2d4d8498f9a014c`
- Gap Matrix: `docs/specs/gap-matrices/SPEC-EXEC-001-implementation-gap-matrix.md` â€” 18 active gaps; SHA-256 `1497c11cb68f15806c505d21e85c5ddc1ae5edc76ae126315958aa4f5d2c19de`
- Gap Matrix audit: `docs/specs/gap-matrices/audits/SPEC-EXEC-001-implementation-gap-matrix-audit.md` â€” `GAP_MATRIX_CONFORMANT`; SHA-256 `d83f85266ca47560b9efb34190d2da2569f7957a0ecae5941c4e1bd3cef11b80`
- Implementation Plan: `docs/specs/implementation-plans/SPEC-EXEC-001-implementation-plan.md` â€” SHA-256 `c7248bc0cc496c662a49fd40a56aafe2869ca795bb717d1b4ac9d625fd79b47f`
- Plan audit: `docs/specs/implementation-plans/audits/SPEC-EXEC-001-implementation-plan-audit.md` â€” `IMPLEMENTATION_PLAN_CONFORMANT`; SHA-256 `5a3869bf5fbc0ac22db03cf0837c847ecbee96441c1ad270b345413f5828ac80`
- Plan conformance checkpoint: `docs/workflow-checkpoints/SPEC-EXEC-001-component-implementation-plan-conformance.md` â€” `READY_FOR_ISSUE_DECOMPOSITION`
- Current HEAD: `afa5d48c50cccc2f2f42cdc9549c3db3a34a6611`

- Exact Implementation Unit: `EXEC-IMP-04` in Plan Â§9.
- Plan Final Proof Owner(s) preserved: `AC-EXEC-009, AC-EXEC-010`.

## 3. Authority / Scope

This ticket converts exactly one conformant Implementation Unit into one execution artifact. It consumes the approved authority chain above and does not redefine ADRs, portfolio ownership, SPEC behavior, Gap identity, cross-SPEC contract, Plan scope, or Final Proof Ownership. `SPEC-EXEC-001 / EXEC-001 / CANONICAL_OWNER` remains the local semantic owner; DOM, source, PLAT, EXEC-002, BACKEND, OPS and UI retain foreign ownership stated by the Plan.

## 4. Portfolio Obligation Coverage

The approved obligation(s), owner role, foreign capabilities, and local ownership are copied from the exact Unit record below. No repository location is treated as a new owner.

## 5. Gap / Requirement / Acceptance Coverage

The exact Gap, Requirement and Acceptance IDs are preserved from the Unit record below. Local criteria are bounded to this unit's contribution; integrated proof stays with the named Final Proof Owner and checkpoint.

## 6. Implementation Unit

The following is the conformant Plan Unit record and is the complete ticket scope. It is quoted to preserve goal, authority, delta, required behavior, exclusions, evidence, impact, prerequisites, acceptance, tests, closure, cutover, completion evidence, readiness, DAG state, proof and capability records without reinterpretation.

### EXEC-IMP-04 â€” Source-bound NORMAL/BOOTSTRAP catalog consumption

`UNIT_FORMATION_REASON = SHARED_INTEGRATION_SEAM + SHARED_AUTHORITY + SHARED_CONFORMANCE`

#### Goal

Consume only owner-issued NORMAL and BOOTSTRAP catalog/basis material, preserving scope, source, exact revision and productive-availability distinctions.

#### Authority and Ownership

- Primary requirements: `EXEC-REGISTRY-001/002/004`, `EXEC-CAPABILITY-001`.
- Portfolio obligation: `O-020`; `CANONICAL_OWNER`.
- Local ownership: source verification, scope/revision binding and consumption rejection; DOM/REPO/system sources retain material ownership.
- Authority Consumption Proofs: `DOM-EXEC-IDENTITY-SNAPSHOT`, `EXEC-NORMAL-CATALOG-SOURCE-PROGRESSION`, `EXEC-BOOTSTRAP-CATALOG-SOURCE-PROGRESSION` from current audits.
- Authority consumption result: contract defined and locally testable where fixtures exist; productive availability remains `NO` and integrated-only.

#### Gap Matrix Coverage

`GAP-006`, `GAP-007`, `GAP-016`; acceptance contributions to `AC-EXEC-005`, `AC-EXEC-008`, `AC-EXEC-009`, `AC-EXEC-011`, `AC-EXEC-019`, `AC-EXEC-021`.

#### Portfolio Obligation Coverage

`O-020`; `CANONICAL_OWNER`.

#### Validated Delta

```text
OBSERVED: local fixtures issue receipts, productive seams reject fixtures, and no productive DOM/REPO/BOOTSTRAP issuer is available.
REQUIRED: exact owner-issued scoped material is consumed; fixtures never become productive authority.
DELTA: complete the source-bound consumer contract and preserve integrated-only availability.
```

#### Required Behavior

`LOCAL_BEHAVIOR`: reject caller/fixture/unverified/detached/wrong-source/wrong-scope/stale basis and accept only a producer-issued basis whose scope and revision match the request. `END_TO_END_CONTRIBUTION`: productive DOM, REPO and BOOTSTRAP producers can later supply evidence without changing EXEC meaning.

#### Does Not Implement

DOM identity/source; REPO enablement/configuration; system bootstrap production; PLAT persistence; registry semantic ownership beyond consumption validation; scheduler or mappings.

#### Repository Evidence

`src/application/exec-registry.ts`, `src/application/exec-registry-ports.ts`, `src/composition/exec-registry.ts`; fixture rejection is already explicit. Extend source-bound contract tests without promoting fixtures.

#### Expected Repository Impact

Source ports/receipts, exact scope/revision binding, consumer validation and integrated handoff tests. Expected Repository Impact is planning guidance, not normative design authority.

#### Implementation Constraints

Preserve `AUTHORITY_STATUS`, `CONTRACT_STATUS`, `LOCAL_TESTABILITY`, `PRODUCTIVE_AVAILABILITY` as independent dimensions. No downstream promotion without new producer evidence.

#### Internal Prerequisites

`EXEC-IMP-03`.

#### Cross-Spec Prerequisites

| Owner / source | Required capability | Implementation state | Blocking? |
|---|---|---|---|
| SPEC-DOM-001 | execution identity/snapshot basis | defined; productive availability `NO` | No for local closure; yes for integrated proof |
| SPEC-REPO-001 | NORMAL enabled catalog source | defined boundary; productive availability `NO` | No for local closure; yes for integrated proof |
| Independent system source | BOOTSTRAP catalog | defined boundary; productive availability `NO` | No for local closure; yes for integrated proof |

#### Producer / Consumer Contract Proof

For `DOM-EXEC-IDENTITY-SNAPSHOT`: authority owner DOM, producer DOM canonical resolver, produced contract canonical identities/snapshot/exact basis, consumer IMP-04/06, status defined, local testability `NO`, productive availability `NO`, class `REQUIRED_FOR_INTEGRATED_PROOF`, edge `EXEC-001 â†’ DOM-001`, integrated-only blocking.

For `EXEC-CATALOG-SOURCE-PROGRESSION`: authority owner EXEC semantic boundary with NORMAL/BOOTSTRAP producer, produced contract scoped predecessor/successor/digest/SourceSequence material, consumer IMP-04/08/09, local testability `YES` only through fixtures, productive availability `NO`, class `REQUIRED_FOR_INTEGRATED_PROOF`, fixture evidence is not promotion evidence.

#### Capability Availability and Blocking Effect

All external capabilities are defined, contract-defined, and unavailable productively. Their dependency class is `REQUIRED_FOR_INTEGRATED_PROOF`; therefore local execution and local closure are not blocked.

#### Temporal Authority Preconditions

Use the already-authorized `TEMPORAL_AUTHORITY_PROOF` for source observation before mutation. This unit does not invent source revalidation semantics.

#### Acceptance Criteria

1. NORMAL and BOOTSTRAP requests consume only matching owner-issued scope/source/revision material; fixture or caller material is rejected (`LOCAL_PROVABILITY = YES`).
2. A source-bound basis is required for valid resolution; no foreign producer is silently promoted (`LOCAL_PROVABILITY = YES`; integrated availability remains a separate proof).

#### ACCEPTANCE_WITNESS_MATRIX

| Normative behavior | Verb | Concrete operation | State affected | Direct positive | Direct negative/isolation | Expected evidence | Acceptance owner | Required capability | Authority | Contract | Local testability | Productive availability | Dependency class | Witness executable at local closure | Evidence type |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Catalog isolation | isolate/resolve | `C-EXEC-005` / `AC-EXEC-009` | catalog basis | NORMAL/BOOTSTRAP scopes remain distinct | wrong scope/source/fixture rejected | source-bound witness | EXEC-IMP-04 | contract fixture | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |
| Source-bound resolution | resolve | `C-EXEC-010/018` / `AC-EXEC-008/011/019` | resolution basis | matching owner-issued basis accepted | detached/stale/wrong-source basis rejected | source contract witness | EXEC-IMP-04 | source fixture | DEFINED | DEFINED | YES | NO | REQUIRED_FOR_INTEGRATED_PROOF | YES | LOCAL_TEST_EVIDENCE |

#### Local Closure

`LOCAL_CLOSURE = YES` for source-contract consumption and negative witnesses. Productive source integration is an integrated checkpoint obligation, not a local closure dependency.

#### Work Can Start

`WORK_CAN_START = NO` until `EXEC-IMP-03` completes; `EXECUTION_READY = TRUE` after that prerequisite for local contract work.

#### Shared Closure Boundary

`SHARED_CLOSURE_BOUNDARY = YES` for the source/scope/revision consumption seam. Registration publication authority is split into IMP-05 because it has a different issuer/result closure.

#### Required Tests

NORMAL/BOOTSTRAP isolation, fixture rejection, wrong-source/scope/revision, detached/foreign/stale basis, source progression contract and no productive promotion without evidence.

#### Legacy / Cutover Impact

`NEW_CANONICAL_PATH` and `LEGACY_COMPATIBILITY` as a REPO consumer; no fixture or legacy source is a second authority.

#### Completion Evidence

Source-bound contract witness report, independent capability dimensions, explicit fixture-versus-productive record and integrated handoff record.

#### Risks

Fixture promotion, source/scope mismatch, DOM identity substitution and hidden producer dependency.

#### Issue Decomposition Readiness

`ISSUE_READY`; `VALIDATED_GAP_BACKING = YES`; `INDEPENDENT_CLOSURE = YES`.

#### Initial DAG State

`BLOCKED`; `BLOCKED_BY = EXEC-IMP-03`.

---

## 7. Goal

See the exact Unit `Goal` above. The ticket goal is narrow, Gap-backed, and does not add architecture or foreign work.

## 8. Validated Implementation Delta

See the exact Unit `Validated Delta` above. The ticket implements only the Plan's `OBSERVED / REQUIRED / DELTA` record.

## 9. Required Behavior

See the exact Unit `Required Behavior` and its acceptance witness rows above. Every normative verb has a direct positive and negative/isolation witness; no registration/listing proxy proves progress and no sequential duplicate substitutes for concurrency proof.

## 10. Does Not Implement

See the exact Unit `Does Not Implement` above. In particular, this ticket does not implement foreign lifecycle, canonical identity, physical persistence/recovery, external effects, mappings, or any downstream integrated proof.

## 11. Repository Evidence

See the exact Unit `Repository Evidence` above and the validated Gap Matrix evidence it cites. Fixtures, mocks, in-memory repositories, source inspection and prototype/history are not productive availability evidence.

## 12. Expected Repository Impact

See the exact Unit `Expected Repository Impact` above. Impact is orientation, not an implementation design freeze.

## 13. Dependencies

Internal ticket dependencies are `EXEC-001-TICKET-003` and preserve the Plan DAG. Cross-SPEC dependencies remain foreign capability handoffs. `DEPENDS_ON` and `BLOCKED_BY` are both retained; a satisfied prerequisite is removed from blockers only by authorized workflow state transition.

## 14. Blocking Conditions

```text
BLOCKED_BY_UPSTREAM_AUTHORITY = NONE
BLOCKED_BY_UPSTREAM_CONTRACT = NONE for local closure; foreign integrated-only capabilities remain unavailable without blocking this ticket
INTERNAL_PREREQUISITES = EXEC-001-TICKET-003
STATUS_BLOCKER_CONSISTENCY = PASS
TICKET_LOCAL_CLOSURE = YES
```

## 14a. Authority Consumption Proof

```text
AUTHORITY_CONSUMPTION_PROOF = AUTHORITY_CONSUMABLE for the bounded local semantic contract
AUTHORITY_STATUS = DEFINED
CONTRACT_STATUS = DEFINED
LOCAL_TESTABILITY = YES for local witness harness/contract evidence
PRODUCTIVE_AVAILABILITY = YES for unit-owned local execution after prerequisites; foreign integrated producers remain NO
DEPENDENCY_CLASSES = preserved exactly from Unit/Plan; no downstream promotion
BLOCKING_EFFECT = internal prerequisites block execution; REQUIRED_FOR_INTEGRATED_PROOF blocks only integrated proof
CALLER_SUPPLIED_AUTHORITY_BYPASS = 0
```

## 14b. Producer / Consumer Contract Proof

Every external capability captured by this ticket is normalized below; the complete Plan §12 record remains authoritative.

| CAPABILITY_ID | AUTHORITY_OWNER | PRODUCER | PRODUCED_CONTRACT | CONSUMER | AUTHORITY_STATUS | CONTRACT_STATUS | SEMANTIC_STATUS | LOCAL_TESTABILITY | PRODUCTIVE_AVAILABILITY | AVAILABILITY_EVIDENCE | AVAILABILITY_CONDITION | DEPENDENCY_CLASS | DEPENDENCY_EDGE | BLOCKING_EFFECT |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `DOM-EXEC-IDENTITY-SNAPSHOT` | DOM | DOM canonical resolver | canonical identity/snapshot/exact basis | this ticket | DEFINED | DEFINED | DEFINED | NO | NO | Plan §12 / conformant contract | integrated producer condition | REQUIRED_FOR_INTEGRATED_PROOF | approved handoff edge | integrated proof only |
| `EXEC-NORMAL-CATALOG-SOURCE-PROGRESSION` | EXEC/REPO | enabled NORMAL source | scoped source progression | this ticket | DEFINED | DEFINED | DEFINED | YES (fixture) | NO | Plan §12 / conformant contract | integrated producer condition | REQUIRED_FOR_INTEGRATED_PROOF | approved handoff edge | integrated proof only |
| `EXEC-BOOTSTRAP-CATALOG-SOURCE-PROGRESSION` | EXEC/system | independent BOOTSTRAP source | system-scoped progression | this ticket | DEFINED | DEFINED | DEFINED | YES (fixture) | NO | Plan §12 / conformant contract | integrated producer condition | REQUIRED_FOR_INTEGRATED_PROOF | approved handoff edge | integrated proof only |

Failure/not-found/stale semantics, version transport, availability evidence and ownership are preserved from the Plan. No foreign capability is required for local execution or local closure.

## 14c. ACCEPTANCE_WITNESS_MATRIX

`ACCEPTANCE_WITNESS_MATRIX: REQUIRED`

The exact Unit `ACCEPTANCE_WITNESS_MATRIX` above is preserved as the authoritative matrix. It has a row for every Required Behavior and normative Acceptance Criterion, including operation, affected state, direct positive test, direct negative/isolation test, expected evidence, producer/capability, independent availability dimensions, dependency class, evidence type, and `WITNESS_EXECUTABLE_AT_LOCAL_CLOSURE`. Local rows are executable at ticket closure; integrated-only rows remain explicitly `NO` and are not falsely closed here.

## 15. Implementation Constraints

Preserve the Unit's constraints exactly. Do not invent identity, lifecycle, provenance, persistence, failure, compatibility, concurrency, recovery, ownership, dependency direction or architecture. Do not promote caller, fixture, mock, source inspection or downstream artifacts to authority/productive availability.

## 16. Acceptance Criteria

The exact Unit Acceptance Criteria and Plan Â§11 Acceptance â†’ Plan traceability are preserved above. Every criterion is testable and locally provable for the bounded unit contribution; complete integrated obligations remain with the Plan's Final Proof Owner and checkpoint.

```text
ACCEPTANCE_REFERENCED = AC-EXEC-009, AC-EXEC-010
TESTABLE = YES
LOCALLY_PROVABLE = YES for local contribution
```

## 17. Acceptance / Proof Role

`CONTRIBUTOR: YES`; `LOCAL_ACCEPTANCE_OWNER: YES`; `FINAL_PROOF_OWNER: YES` for `AC-EXEC-009, AC-EXEC-010`. No synthetic proof-only ticket exists and no downstream owner is promoted without new evidence.

## 18. Required Tests

Execute every Required Test listed in the Unit record, including direct positive and negative/isolation witnesses, stale/no-mutation/idempotency/concurrency/identity/recovery tests where applicable. Durable, productive, physical-CAS, foreign-integration and external-effect evidence remains at the stated integrated checkpoint.

## 19. Completion Evidence

Produce the Unit's listed Completion Evidence, test output, direct witness assertions, scope/ownership trace, and no-mutation/failure evidence where applicable. Do not claim integrated productive availability or final component conformance from local evidence.

## 20. Completion Gate

```text
COMPLETION_GATE:
  production_code: REQUIRED
  automated_tests: REQUIRED
  local_completion_evidence: REQUIRED
  integration_evidence: REQUIRED_AS_HANDOFF_WHEN_UNIT_REQUIRES_IT
  legacy_transition_evidence: REQUIRED_WHEN_APPLICABLE
  conformance_evidence: REQUIRED
```

## 21. Legacy / Cutover Impact

Preserve the Unit's exact Legacy / Cutover value and ownership. No silent conversion, alternate authority, destructive migration, or historical rewrite is permitted.

## 22. Risks

Preserve the Unit's risks. Mitigate with direct operation witnesses, negative/isolation tests, no-mutation assertions, authority-bound inputs, and explicit foreign capability records; do not solve risks by broadening scope.

## 23. Implementation Wave

`WAVE: 3`

## 24. Parallelization

`SAFE_WITH_COORDINATION` inherited unchanged from Plan Â§14. Wave does not make a blocked ticket READY; shared seams require the stated coordination/serial behavior.

## 25. Handoff After Completion

Independent ticket-set audit is mandatory. Completion may release only `EXEC-001-TICKET-005, EXEC-001-TICKET-006, EXEC-001-TICKET-008, EXEC-001-TICKET-009` through the authorized workflow. Integrated checkpoints and foreign producer evidence remain downstream handoffs; this decomposition does not approve or implement the ticket.

## 26. Ticket Local Closure

```text
TICKET_LOCAL_CLOSURE = YES
LOCAL_ACCEPTANCE_PROVABLE_NOW = YES at closure after internal prerequisites
LOCAL_COMPLETION_EVIDENCE_PRODUCIBLE_NOW = YES at closure
WITNESS_EXECUTABLE_AT_LOCAL_CLOSURE = YES for local rows; integrated-only rows remain NO
UNIT_SCOPE_LOST_BY_SPLIT = 0
```

This is an initialized execution artifact only. Later workflow owns implementation, audit, remediation, and state transitions.
