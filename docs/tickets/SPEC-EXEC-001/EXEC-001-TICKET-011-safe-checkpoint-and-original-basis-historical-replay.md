# EXEC-001-TICKET-011 â€” Safe checkpoint and original-basis historical replay

## 1. Status

```text
STATUS: BLOCKED
ISSUE_DECOMPOSITION_READINESS: ISSUE_READY
INITIAL_DAG_STATE: BLOCKED
EXECUTION_READY: FALSE until internal prerequisites close
BLOCKED_BY: EXEC-001-TICKET-007, EXEC-001-TICKET-010
DEPENDS_ON: EXEC-001-TICKET-007, EXEC-001-TICKET-010
UNBLOCKS: NONE
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
- Current HEAD: `6588536e1551044c7a3c83a5d451a063144e3b93`

- Exact Implementation Unit: `EXEC-IMP-11` in Plan Â§9.
- Plan Final Proof Owner(s) preserved: `AC-EXEC-014, AC-EXEC-016, AC-EXEC-018` (AC-EXEC-018 final ownership is reconciled from Plan §11; this unit is the final proof owner after CP-EXEC-04).

## 3. Authority / Scope

This ticket converts exactly one conformant Implementation Unit into one execution artifact. It consumes the approved authority chain above and does not redefine ADRs, portfolio ownership, SPEC behavior, Gap identity, cross-SPEC contract, Plan scope, or Final Proof Ownership. `SPEC-EXEC-001 / EXEC-001 / CANONICAL_OWNER` remains the local semantic owner; DOM, source, PLAT, EXEC-002, BACKEND, OPS and UI retain foreign ownership stated by the Plan.

## 4. Portfolio Obligation Coverage

The approved obligation(s), owner role, foreign capabilities, and local ownership are copied from the exact Unit record below. No repository location is treated as a new owner.

## 5. Gap / Requirement / Acceptance Coverage

The exact Gap, Requirement and Acceptance IDs are preserved from the Unit record below. Local criteria are bounded to this unit's contribution; integrated proof stays with the named Final Proof Owner and checkpoint.

## 6. Implementation Unit

The following is the conformant Plan Unit record and is the complete ticket scope. It is quoted to preserve goal, authority, delta, required behavior, exclusions, evidence, impact, prerequisites, acceptance, tests, closure, cutover, completion evidence, readiness, DAG state, proof and capability records without reinterpretation.

### EXEC-IMP-11 â€” Safe checkpoint and original-basis historical replay

`UNIT_FORMATION_REASON = SHARED_AUTHORITY + SHARED_PERSISTENCE_BOUNDARY + SHARED_CUTOVER + SHARED_CONFORMANCE`

#### Goal

Declare safe checkpoint/resume basis and preserve original manifest/catalog interpretation during historical replay, without owning session application or physical replay.

#### Authority and Ownership

- Requirements: `EXEC-MANIFEST-002`, `EXEC-HISTORY-001`; obligation `O-021`; `CANONICAL_OWNER`.
- Local ownership: checkpoint declaration, resume-basis contract and original-basis replay guard.
- Foreign ownership: EXEC-002 context application and PLAT physical replay.
- Authority proofs: target SPEC Â§Â§12.2â€“Â§12.4 and current upstream capability records.

#### Gap Matrix Coverage

`GAP-010`, `GAP-013`; acceptance `AC-EXEC-014`, `AC-EXEC-016` and contribution to `AC-EXEC-018`.

#### Portfolio Obligation Coverage

`O-021`; `CANONICAL_OWNER`.

#### Validated Delta

```text
OBSERVED: no productive checkpoint declaration, resume-basis surface or original-basis replay path exists.
REQUIRED: absent declaration cannot authorize resume; historical replay uses its original frozen basis even when the current registry differs.
DELTA: add local declaration and replay-protection semantics while preserving EXEC-002/PLAT ownership.
```

#### Required Behavior

`LOCAL_BEHAVIOR`: validate the EXEC-owned checkpoint declaration and original-basis guard against supplied contract material; reject absent basis and current-registry reinterpretation without local mutation. This local contribution does not claim EXEC-002 context application or durable replay.

`END_TO_END_CONTRIBUTION`: productive EXEC-002/PLAT evidence proves safe resume and durable historical replay from the original basis. The complete `AC-EXEC-014` and `AC-EXEC-016` obligations are integrated proof, and this unit is their final proof contributor.

#### Does Not Implement

Session/assignment/scheduler; physical persistence/recovery; retry scheduler; DOM lifecycle; external effect; UI/OPS.

#### Repository Evidence

Only prototype checkpoint/history-shaped values exist. Use new semantic declaration/replay guard with PLAT/EXEC-002 integration seams.

#### Expected Repository Impact

Manifest checkpoint/replay contract and direct divergence tests; no session or physical storage mechanism is frozen. Expected Repository Impact is planning guidance, not normative design authority.

#### Implementation Constraints

No resume without declared basis; transient text/session memory is not authority; current registry cannot reinterpret history; no historical mutation.

#### Internal Prerequisites

`EXEC-IMP-07`, `EXEC-IMP-10`.

#### Cross-Spec Prerequisites

| Owner | Required capability | Implementation state | Blocking? |
|---|---|---|---|
| SPEC-EXEC-002 | apply declared resume context | defined; productive availability `NO` | No for local contribution; integrated proof only |
| SPEC-PLAT-001 | durable replay/recovery material | defined; productive availability `NO` | No for local contribution; integrated proof only |

#### Producer / Consumer Contract Proof

`CAPABILITY_ID = EXEC-RESUME-HISTORICAL-BASIS`; authority owner EXEC; producer manifest/basis semantics; produced contract safe checkpoint and original-basis replay guard; consumers EXEC-002/PLAT; semantic status defined; local testability yes; productive availability no for foreign producers; dependency class integrated-proof-only; blocking effect integrated-only.

#### Capability Availability and Blocking Effect

The local declaration/original-basis guard is executable against supplied contract values. EXEC-002 context application and PLAT durable replay remain `REQUIRED_FOR_INTEGRATED_PROOF`; they do not block the local contribution, but they are required before the plan-level `AC-EXEC-014`/`AC-EXEC-016` proof can close.

#### Temporal Authority Preconditions

`NOT_APPLICABLE` to historical interpretation; no observe-then-commit effect is owned here.

#### Acceptance Criteria

1. **Local contribution to `AC-EXEC-014`:** the checkpoint contract requires an explicit exact resume basis and rejects an absent declaration without local authorization (`LOCAL_PROVABILITY = YES`).
2. **Local contribution to `AC-EXEC-016`:** the replay guard preserves the supplied original basis and rejects current-registry reinterpretation without local mutation (`LOCAL_PROVABILITY = YES`).
3. **Plan-level `AC-EXEC-014`/`AC-EXEC-016`:** productive EXEC-002/PLAT evidence proves safe resume and durable original-basis historical replay (`LOCAL_PROVABILITY = NO`; `FINAL_PROOF_OWNER = EXEC-IMP-11`; `INTEGRATION_PROOF_STAGE = CP-EXEC-04`).

#### ACCEPTANCE_WITNESS_MATRIX

| Normative behavior | Verb | Concrete operation | State affected | Direct positive | Direct negative/isolation | Expected evidence | Acceptance owner | Required capability | Authority | Contract | Local testability | Productive availability | Dependency class | Witness executable at local closure | Evidence type |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Checkpoint declaration guard (local contribution to `AC-EXEC-014`) | declare/reject | `C-EXEC-017` / `AC-EXEC-014` local contribution | EXEC checkpoint contract | exact supplied basis declaration accepted | absent basis cannot authorize local resume | local checkpoint-guard report | EXEC-IMP-11 | unit-owned checkpoint contract | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |
| Original-basis replay guard (local contribution to `AC-EXEC-016`) | replay/reject | `C-EXEC-016` / `AC-EXEC-016` local contribution | EXEC replay contract | supplied original basis is preserved | current registry divergence cannot reinterpret it | local replay-guard report | EXEC-IMP-11 | unit-owned replay contract | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |
| Safe resume (plan-level `AC-EXEC-014`) | declare/apply | `C-EXEC-017` / `AC-EXEC-014` integrated proof | durable manifest basis | EXEC-002 applies a declared exact basis | absent or mismatched durable basis cannot resume | integrated resume evidence | EXEC-IMP-11 | EXEC2-EXEC-RESUME-CONTEXT + PLAT-EXEC-PERSISTED-MATERIAL | DEFINED | DEFINED | NO | NO | REQUIRED_FOR_INTEGRATED_PROOF | NO | INTEGRATION_TEST_EVIDENCE |
| Historical replay (plan-level `AC-EXEC-016`) | replay/resolve | `C-EXEC-016` / `AC-EXEC-016` integrated proof | durable historical manifest/catalog | PLAT replays the original basis | current registry cannot reinterpret or convert history | integrated historical replay evidence | EXEC-IMP-11 | PLAT-EXEC-PERSISTED-MATERIAL | DEFINED | DEFINED | NO | NO | REQUIRED_FOR_INTEGRATED_PROOF | NO | INTEGRATION_TEST_EVIDENCE |

#### Local Closure

`LOCAL_CLOSURE = YES`; `LOCAL_CLOSURE_SCOPE = EXEC_CHECKPOINT_AND_REPLAY_GUARD_CONTRIBUTION_ONLY`. The complete plan-level `AC-EXEC-014` and `AC-EXEC-016` obligations close only at `CP-EXEC-04`; integrated evidence is not local Completion Evidence.

#### Work Can Start

`WORK_CAN_START = NO` until IMP-07 and IMP-10 complete.

#### Shared Closure Boundary

`SHARED_CLOSURE_BOUNDARY = YES`: both gaps operate on the same immutable manifest basis, use the same local fixture-level readiness (`AUTHORITY_STATUS=DEFINED`, `CONTRACT_STATUS=DEFINED`, `LOCAL_TESTABILITY=YES`, `PRODUCTIVE_AVAILABILITY=NO`), have compatible `REQUIRED_FOR_INTEGRATED_PROOF` foreign handoffs, and close with the same local declaration/basis evidence. Physical recovery and session application remain foreign.

#### Required Tests

Local absent-basis, transient-text and current-registry-divergence guard tests. At `CP-EXEC-04`, integrated EXEC-002 context application, durable checkpoint and historical replay tests are required; those tests are not local closure evidence.

#### Legacy / Cutover Impact

`HISTORICAL_REPLAY`; original manifest/catalog basis is retained; changed basis is a new attempt.

#### Completion Evidence

Local: checkpoint-declaration and original-basis guard reports. Integrated: `CP-EXEC-04` safe-resume and durable historical-replay evidence for plan-level `AC-EXEC-014`/`AC-EXEC-016`; `CP-EXEC-05` consumes this evidence for `AC-EXEC-018` final proof.

#### Risks

Transient memory as authority, current-registry reinterpretation and PLAT recovery meaning leakage.

#### Issue Decomposition Readiness

`ISSUE_READY`; `VALIDATED_GAP_BACKING = YES`; `INDEPENDENT_CLOSURE = YES` for the local contribution; the plan-level integrated witnesses remain explicit checkpoint handoffs.

#### Initial DAG State

`BLOCKED`; `BLOCKED_BY = EXEC-IMP-07, EXEC-IMP-10`.

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

Internal ticket dependencies are `EXEC-001-TICKET-007, EXEC-001-TICKET-010` and preserve the Plan DAG. Cross-SPEC dependencies remain foreign capability handoffs. `DEPENDS_ON` and `BLOCKED_BY` are both retained; a satisfied prerequisite is removed from blockers only by authorized workflow state transition.

## 14. Blocking Conditions

```text
BLOCKED_BY_UPSTREAM_AUTHORITY = NONE
BLOCKED_BY_UPSTREAM_CONTRACT = NONE for local closure; foreign integrated-only capabilities remain unavailable without blocking this ticket
INTERNAL_PREREQUISITES = EXEC-001-TICKET-007, EXEC-001-TICKET-010
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
| `EXEC2-EXEC-RESUME-CONTEXT` | EXEC-002 | context applicator | safe checkpoint basis application | this ticket | DEFINED | DEFINED | DEFINED | NO | NO | Plan §12 / conformant contract | integrated producer condition | REQUIRED_FOR_INTEGRATED_PROOF | approved handoff edge | integrated proof only |
| `PLAT-EXEC-PERSISTED-MATERIAL` | PLAT | PLAT material reader | physical material/integrity/replay | this ticket | DEFINED | DEFINED | DEFINED | NO | NO | Plan §12 / conformant contract | integrated producer condition | REQUIRED_FOR_INTEGRATED_PROOF | approved handoff edge | integrated proof only |

Failure/not-found/stale semantics, version transport, availability evidence and ownership are preserved from the Plan. No foreign capability is required for local execution or local closure.

## 14c. ACCEPTANCE_WITNESS_MATRIX

`ACCEPTANCE_WITNESS_MATRIX: REQUIRED`

The exact Unit `ACCEPTANCE_WITNESS_MATRIX` above is preserved as the authoritative matrix. It has a row for every Required Behavior and normative Acceptance Criterion, including operation, affected state, direct positive test, direct negative/isolation test, expected evidence, producer/capability, independent availability dimensions, dependency class, evidence type, and `WITNESS_EXECUTABLE_AT_LOCAL_CLOSURE`. Local rows are executable at ticket closure; integrated-only rows remain explicitly `NO` and are not falsely closed here.

## 15. Implementation Constraints

Preserve the Unit's constraints exactly. Do not invent identity, lifecycle, provenance, persistence, failure, compatibility, concurrency, recovery, ownership, dependency direction or architecture. Do not promote caller, fixture, mock, source inspection or downstream artifacts to authority/productive availability.

## 16. Acceptance Criteria

The exact Unit Acceptance Criteria and Plan Â§11 Acceptance â†’ Plan traceability are preserved above. Every criterion is testable and locally provable for the bounded unit contribution; complete integrated obligations remain with the Plan's Final Proof Owner and checkpoint.

```text
ACCEPTANCE_REFERENCED = AC-EXEC-014, AC-EXEC-016
TESTABLE = YES
LOCALLY_PROVABLE = YES for local contribution
```

## 17. Acceptance / Proof Role

`CONTRIBUTOR: YES`; `LOCAL_ACCEPTANCE_OWNER: YES`; `FINAL_PROOF_OWNER: YES` for `AC-EXEC-014, AC-EXEC-016, AC-EXEC-018`. No synthetic proof-only ticket exists and no downstream owner is promoted without new evidence.

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

`WAVE: 7`

## 24. Parallelization

`SAFE_WITH_COORDINATION` inherited unchanged from Plan Â§14. Wave does not make a blocked ticket READY; shared seams require the stated coordination/serial behavior.

## 25. Handoff After Completion

Independent ticket-set audit is mandatory. Completion may release only `NONE` through the authorized workflow. Integrated checkpoints and foreign producer evidence remain downstream handoffs; this decomposition does not approve or implement the ticket.

## 26. Ticket Local Closure

```text
TICKET_LOCAL_CLOSURE = YES
LOCAL_ACCEPTANCE_PROVABLE_NOW = YES at closure after internal prerequisites
LOCAL_COMPLETION_EVIDENCE_PRODUCIBLE_NOW = YES at closure
WITNESS_EXECUTABLE_AT_LOCAL_CLOSURE = YES for local rows; integrated-only rows remain NO
UNIT_SCOPE_LOST_BY_SPLIT = 0
```

This is an initialized execution artifact only. Later workflow owns implementation, audit, remediation, and state transitions.
