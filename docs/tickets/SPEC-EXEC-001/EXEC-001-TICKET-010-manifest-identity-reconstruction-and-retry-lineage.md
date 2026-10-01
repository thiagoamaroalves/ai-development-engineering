# EXEC-001-TICKET-010 â€” Manifest identity, reconstruction and retry lineage

## 1. Status

```text
STATUS: BLOCKED
ISSUE_DECOMPOSITION_READINESS: ISSUE_READY
INITIAL_DAG_STATE: BLOCKED
EXECUTION_READY: FALSE until internal prerequisites close
BLOCKED_BY: EXEC-001-TICKET-007, EXEC-001-TICKET-008
DEPENDS_ON: EXEC-001-TICKET-007, EXEC-001-TICKET-008
UNBLOCKS: EXEC-001-TICKET-011
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

- Exact Implementation Unit: `EXEC-IMP-10` in Plan Â§9.
- Plan Final Proof Owner(s) preserved: `AC-EXEC-020`.

## 3. Authority / Scope

This ticket converts exactly one conformant Implementation Unit into one execution artifact. It consumes the approved authority chain above and does not redefine ADRs, portfolio ownership, SPEC behavior, Gap identity, cross-SPEC contract, Plan scope, or Final Proof Ownership. `SPEC-EXEC-001 / EXEC-001 / CANONICAL_OWNER` remains the local semantic owner; DOM, source, PLAT, EXEC-002, BACKEND, OPS and UI retain foreign ownership stated by the Plan.

## 4. Portfolio Obligation Coverage

The approved obligation(s), owner role, foreign capabilities, and local ownership are copied from the exact Unit record below. No repository location is treated as a new owner.

## 5. Gap / Requirement / Acceptance Coverage

The exact Gap, Requirement and Acceptance IDs are preserved from the Unit record below. Local criteria are bounded to this unit's contribution; integrated proof stays with the named Final Proof Owner and checkpoint.

## 6. Implementation Unit

The following is the conformant Plan Unit record and is the complete ticket scope. It is quoted to preserve goal, authority, delta, required behavior, exclusions, evidence, impact, prerequisites, acceptance, tests, closure, cutover, completion evidence, readiness, DAG state, proof and capability records without reinterpretation.

### EXEC-IMP-10 â€” Manifest identity, reconstruction and retry lineage

`UNIT_FORMATION_REASON = SHARED_AUTHORITY + SHARED_PERSISTENCE_BOUNDARY + SHARED_INVARIANT`

#### Goal

Make one immutable `ACTIVITY_ATTEMPT_MANIFEST` per DOM tuple semantically reconstructable, attachment-safe and retry-distinct.

#### Authority and Ownership

- Requirement: `EXEC-MANIFEST-004`; obligations `O-018`, `O-021`; `CANONICAL_OWNER`.
- Local ownership: tuple identity, attachment/cardinality, digest/basis validation, rehydration and retry lineage.
- Foreign ownership: DOM identity and PLAT physical integrity/recovery.
- Authority proofs: target SPEC audit Â§Â§17â€“Â§18 and DOM audit Â§Â§17â€“Â§23.

#### Gap Matrix Coverage

`GAP-012`; acceptance `AC-EXEC-018`, `AC-EXEC-020` and contribution to `AC-EXEC-014/016`.

#### Portfolio Obligation Coverage

`O-018`, `O-021`; `CANONICAL_OWNER`.

#### Validated Delta

```text
OBSERVED: no productive manifest identity, digest, attachment validator or semantic rehydration/retry path exists.
REQUIRED: exactly one immutable manifest per DOM tuple; detached/stale/corrupt/duplicate material fails closed; retry uses a new AttemptId.
DELTA: add local semantic identity/reconstruction and retry-lineage proof.
```

#### Required Behavior

`LOCAL_BEHAVIOR`: validate the EXEC-owned tuple, digest, cardinality and retry-lineage rules against supplied contract material; reject detached, corrupt, stale or duplicate values without local mutation and require a new AttemptId for retry. This local contribution does not claim canonical DOM attachment or durable rehydration.

`END_TO_END_CONTRIBUTION`: productive DOM/PLAT evidence proves one immutable manifest for the canonical DOM tuple and durable reconstruction. The complete `AC-EXEC-020` obligation is integrated proof; retry semantics contribute locally to `AC-EXEC-018`.

#### Does Not Implement

DOM identity creation; PLAT storage/recovery; EXEC-002 sessions; replay orchestration; external effects; UI/OPS.

#### Repository Evidence

No productive manifest persistence/reconstruction; prototype is transient. This is `ADD_NEW_CAPABILITY` with typed DOM/PLAT seams.

#### Expected Repository Impact

Manifest identity/rehydration semantic boundary and direct reconstruction/retry tests; no physical mechanism is frozen. Expected Repository Impact is planning guidance, not normative design authority.

#### Implementation Constraints

DOM tuple is authoritative; `ManifestContentRevision=1` is distinct from physical revision; untrusted material cannot become valid state; no mutation on failure.

#### Internal Prerequisites

`EXEC-IMP-07`, `EXEC-IMP-08`.

#### Cross-Spec Prerequisites

DOM tuple and PLAT physical material are defined, unavailable productively, `REQUIRED_FOR_INTEGRATED_PROOF`. They are not required for the local tuple/retry validator contribution, but are required for the complete `AC-EXEC-020` witness at `CP-EXEC-03` and the later recovery evidence.

#### Producer / Consumer Contract Proof

`CAPABILITY_ID = EXEC-MANIFEST-RECONSTRUCTION`; authority owner EXEC/DOM boundary; producers DOM identity and PLAT material; produced contract validated immutable tuple/basis/digest; consumer EXEC-IMP-10; status defined; local testability yes; productive availability no; integrated-only blocking.

#### Capability Availability and Blocking Effect

Foreign productive identity/material availability does not block local semantic closure.

#### Temporal Authority Preconditions

`NOT_APPLICABLE` to identity/reconstruction; retry lineage is semantic identity, not external effect authorization.

#### Acceptance Criteria

1. **Local contribution to `AC-EXEC-020`:** the EXEC validator accepts a supplied tuple/material contract only when identity, digest and cardinality rules hold; detached or corrupt values fail without local mutation (`LOCAL_PROVABILITY = YES`).
2. **Local contribution to `AC-EXEC-018`:** retry lineage requires a new AttemptId/manifest and rejects same-manifest reuse or current-basis reinterpretation (`LOCAL_PROVABILITY = YES`).
3. **Plan-level `AC-EXEC-020`:** productive DOM/PLAT evidence proves canonical tuple attachment and durable reconstruction (`LOCAL_PROVABILITY = NO`; `FINAL_PROOF_OWNER = EXEC-IMP-10`; `INTEGRATION_PROOF_STAGE = CP-EXEC-03`).

#### ACCEPTANCE_WITNESS_MATRIX

| Normative behavior | Verb | Concrete operation | State affected | Direct positive | Direct negative/isolation | Expected evidence | Acceptance owner | Required capability | Authority | Contract | Local testability | Productive availability | Dependency class | Witness executable at local closure | Evidence type |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Tuple/material validation (local contribution to `AC-EXEC-020`) | validate/rehydrate | `C-EXEC-019` / `AC-EXEC-020` local contribution | EXEC manifest contract | supplied tuple/material passes identity, digest and cardinality checks | detached/corrupt/stale/duplicate value fails with no local mutation | local manifest-validator report | EXEC-IMP-10 | unit-owned manifest validator | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |
| Retry lineage (local contribution to `AC-EXEC-018`) | retry/recreate | `C-EXEC-017` / `AC-EXEC-018` local contribution | attempt/manifest contract | new AttemptId preserves supplied basis | same-manifest reuse/current reinterpretation rejected | local retry-lineage report | EXEC-IMP-10 | unit-owned retry contract | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |
| Canonical tuple attachment/reconstruction (plan-level `AC-EXEC-020`) | create/rehydrate | `C-EXEC-019` / `AC-EXEC-020` integrated proof | immutable manifest | one canonical DOM tuple creates/rehydrates exactly one manifest | attachment, digest, basis or durable-material mismatch fails | integrated manifest reconstruction evidence | EXEC-IMP-10 | DOM-EXEC-IDENTITY-SNAPSHOT + PLAT-EXEC-PERSISTED-MATERIAL | DEFINED | DEFINED | NO | NO | REQUIRED_FOR_INTEGRATED_PROOF | NO | INTEGRATION_TEST_EVIDENCE |

#### Local Closure

`LOCAL_CLOSURE = YES`; `LOCAL_CLOSURE_SCOPE = EXEC_TUPLE_VALIDATION_AND_RETRY_CONTRIBUTION_ONLY`. The complete plan-level `AC-EXEC-020` closes only at `CP-EXEC-03`; integrated evidence is not local Completion Evidence.

#### Work Can Start

`WORK_CAN_START = NO` until IMP-07 and IMP-08 complete.

#### Shared Closure Boundary

`SHARED_CLOSURE_BOUNDARY = YES` for identity, attachment, reconstruction and retry lineage; checkpoint/replay declaration is separate.

#### Required Tests

Local tuple/digest/cardinality validation, no-mutation-on-failure and new-AttemptId retry tests. At `CP-EXEC-03`, integrated canonical DOM attachment and durable reconstruction tests are required; those tests are not local closure evidence.

#### Legacy / Cutover Impact

`HISTORICAL_REPLAY` and `CUTOVER`; retry/new basis is new identity and original manifest remains immutable.

#### Completion Evidence

Local: tuple-validator, no-mutation and retry-lineage reports. Integrated: `CP-EXEC-03` canonical attachment and durable reconstruction evidence for plan-level `AC-EXEC-020`.

#### Risks

Manifest identity invention, detached material acceptance and current-registry reinterpretation.

#### Issue Decomposition Readiness

`ISSUE_READY`; `VALIDATED_GAP_BACKING = YES`; `INDEPENDENT_CLOSURE = YES` for the local contribution; the plan-level integrated witness remains an explicit checkpoint handoff.

#### Initial DAG State

`BLOCKED`; `BLOCKED_BY = EXEC-IMP-07, EXEC-IMP-08`.

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

Internal ticket dependencies are `EXEC-001-TICKET-007, EXEC-001-TICKET-008` and preserve the Plan DAG. Cross-SPEC dependencies remain foreign capability handoffs. `DEPENDS_ON` and `BLOCKED_BY` are both retained; a satisfied prerequisite is removed from blockers only by authorized workflow state transition.

## 14. Blocking Conditions

```text
BLOCKED_BY_UPSTREAM_AUTHORITY = NONE
BLOCKED_BY_UPSTREAM_CONTRACT = NONE for local closure; foreign integrated-only capabilities remain unavailable without blocking this ticket
INTERNAL_PREREQUISITES = EXEC-001-TICKET-007, EXEC-001-TICKET-008
STATUS_BLOCKER_CONSISTENCY = PASS
TICKET_LOCAL_CLOSURE = YES
```

## 14a. Authority Consumption Proof

```text
AUTHORITY_CONSUMPTION_PROOF = no aggregate ticket-level result; see exact per-capability Unit/Plan evidence below; no downstream AUTHORITY_CONSUMABLE promotion is claimed
AUTHORITY_STATUS = DEFINED per capability; see exact Unit/Plan records in §6 and normalized records in §14b
CONTRACT_STATUS = DEFINED per capability; see exact Unit/Plan records in §6 and normalized records in §14b
LOCAL_TESTABILITY = per-capability values from the Unit/Plan and §14b; YES for a fixture/harness is contract-level evidence only
PRODUCTIVE_AVAILABILITY = NO for fixture/harness and unavailable integrated-producer records; no promotion is claimed
DEPENDENCY_CLASSES = preserve exact per-capability Unit/Plan values in §6/§14b; no downstream promotion
BLOCKING_EFFECT = per-capability Unit/Plan value; INFORMATIONAL and REQUIRED_FOR_INTEGRATED_PROOF do not block local closure
CALLER_SUPPLIED_AUTHORITY_BYPASS = 0
```

## 14b. Producer / Consumer Contract Proof

Every external capability captured by this ticket is normalized below; the complete Plan §12 record remains authoritative.

| CAPABILITY_ID | AUTHORITY_OWNER | PRODUCER | PRODUCED_CONTRACT | CONSUMER | AUTHORITY_STATUS | CONTRACT_STATUS | SEMANTIC_STATUS | LOCAL_TESTABILITY | PRODUCTIVE_AVAILABILITY | AVAILABILITY_EVIDENCE | AVAILABILITY_CONDITION | DEPENDENCY_CLASS | DEPENDENCY_EDGE | BLOCKING_EFFECT |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `DOM-EXEC-IDENTITY-SNAPSHOT` | DOM | DOM canonical resolver | canonical identity/snapshot/exact basis | this ticket | DEFINED | DEFINED | DEFINED | NO | NO | Plan §12 / conformant contract | integrated producer condition | REQUIRED_FOR_INTEGRATED_PROOF | approved handoff edge | integrated proof only |
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
ACCEPTANCE_REFERENCED = AC-EXEC-020
TESTABLE = YES
LOCALLY_PROVABLE = YES for local contribution
```

## 17. Acceptance / Proof Role

`CONTRIBUTOR: YES`; `LOCAL_ACCEPTANCE_OWNER: YES`; `FINAL_PROOF_OWNER: YES` for `AC-EXEC-020`. No synthetic proof-only ticket exists and no downstream owner is promoted without new evidence.

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

`WAVE: 6`

## 24. Parallelization

`SAFE_WITH_COORDINATION` inherited unchanged from Plan Â§14. Wave does not make a blocked ticket READY; shared seams require the stated coordination/serial behavior.

## 25. Handoff After Completion

Independent ticket-set audit is mandatory. Completion may release only `EXEC-001-TICKET-011` through the authorized workflow. Integrated checkpoints and foreign producer evidence remain downstream handoffs; this decomposition does not approve or implement the ticket.

## 26. Ticket Local Closure

```text
TICKET_LOCAL_CLOSURE = YES
LOCAL_ACCEPTANCE_PROVABLE_NOW = YES at closure after internal prerequisites
LOCAL_COMPLETION_EVIDENCE_PRODUCIBLE_NOW = YES at closure
WITNESS_EXECUTABLE_AT_LOCAL_CLOSURE = YES for local rows; integrated-only rows remain NO
UNIT_SCOPE_LOST_BY_SPLIT = 0
```

This is an initialized execution artifact only. Later workflow owns implementation, audit, remediation, and state transitions.
