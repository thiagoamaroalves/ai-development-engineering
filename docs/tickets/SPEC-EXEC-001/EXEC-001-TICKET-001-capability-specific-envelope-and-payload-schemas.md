# EXEC-001-TICKET-001 â€” Capability-specific envelope and payload schemas

## 1. Status

```text
STATUS: READY
ISSUE_DECOMPOSITION_READINESS: ISSUE_READY
INITIAL_DAG_STATE: READY
EXECUTION_READY: TRUE
BLOCKED_BY: NONE
DEPENDS_ON: NONE
UNBLOCKS: EXEC-001-TICKET-002, EXEC-001-TICKET-003, EXEC-001-TICKET-007
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

- Exact Implementation Unit: `EXEC-IMP-01` in Plan Â§9.
- Plan Final Proof Owner(s) preserved: `AC-EXEC-001, AC-EXEC-002`.

## 3. Authority / Scope

This ticket converts exactly one conformant Implementation Unit into one execution artifact. It consumes the approved authority chain above and does not redefine ADRs, portfolio ownership, SPEC behavior, Gap identity, cross-SPEC contract, Plan scope, or Final Proof Ownership. `SPEC-EXEC-001 / EXEC-001 / CANONICAL_OWNER` remains the local semantic owner; DOM, source, PLAT, EXEC-002, BACKEND, OPS and UI retain foreign ownership stated by the Plan.

## 4. Portfolio Obligation Coverage

The approved obligation(s), owner role, foreign capabilities, and local ownership are copied from the exact Unit record below. No repository location is treated as a new owner.

## 5. Gap / Requirement / Acceptance Coverage

The exact Gap, Requirement and Acceptance IDs are preserved from the Unit record below. Local criteria are bounded to this unit's contribution; integrated proof stays with the named Final Proof Owner and checkpoint.

## 6. Implementation Unit

The following is the conformant Plan Unit record and is the complete ticket scope. It is quoted to preserve goal, authority, delta, required behavior, exclusions, evidence, impact, prerequisites, acceptance, tests, closure, cutover, completion evidence, readiness, DAG state, proof and capability records without reinterpretation.

### EXEC-IMP-01 â€” Capability-specific envelope and payload schemas

`UNIT_FORMATION_REASON = SHARED_AUTHORITY + SHARED_COMMAND_BOUNDARY + SHARED_CONFORMANCE`

#### Goal

Make the envelope and capability payload validation select identifiable capability-appropriate schema authority, while preserving structured minimum fields and non-authority of human text.

#### Authority and Ownership

- Primary component SPEC: `SPEC-EXEC-001`, `EXEC-ENVELOPE-001/002`.
- Portfolio obligation: `O-016`; approved role `CANONICAL_OWNER`.
- Local ownership: envelope/payload schema identity, capability-specific schema selection, validation result and structured-field requirements.
- Cross-spec dependencies: downstream consumers map this contract only.
- Foreign capabilities consumed: none required for local closure.
- Authority Consumption Proof: target SPEC audit Â§12 and Â§17â€“Â§18; `SPEC_IMPLEMENTABILITY_CHECK = PASS`.
- Authority consumption result: `AUTHORITY_CONSUMABLE` for local contract semantics.
- Availability condition: unit-owned contract harness is executable locally; fixture status is not productive availability.

#### Gap Matrix Coverage

`GAP-018`; requirement `EXEC-ENVELOPE-001`; regression coverage for implemented `EXEC-ENVELOPE-002`; acceptance `AC-EXEC-001`, `AC-EXEC-002`.

#### Portfolio Obligation Coverage

`O-016`; `CANONICAL_OWNER`.

#### Validated Delta

```text
OBSERVED: fixed generic payload schema accepts capabilityId plus arbitrary object data.
REQUIRED: capability payload is validated against an identifiable capability-appropriate schema before consumption; minimum envelope remains structured.
DELTA: add capability-specific schema authority and selection without freezing a mechanism.
```

#### Required Behavior

`LOCAL_BEHAVIOR`: valid envelope and capability payload use registered identifiable schemas; a structurally generic but capability-invalid payload is rejected as `CONTRACT_INVALID`. `END_TO_END_CONTRIBUTION`: consumers receive a contract whose payload meaning is not inferred from text or generic shape.

#### Does Not Implement

DOM identity/lifecycle; registry resolution; source publication; physical persistence; execution/session runtime; external effects; transport routes; UI/OPS presentation; final cross-SPEC conformance.

#### Repository Evidence

`src/domain/exec-schema.ts`, `src/application/exec-contract.ts`, `src/infrastructure/exec-schema-validator.ts`, and `tests/exec-001-ticket-001.test.ts`. Reuse the authenticated validation/result boundary; replace only the generic capability-payload path.

#### Expected Repository Impact

EXEC schema definitions, contract validation application seam and direct schema tests. Expected Repository Impact is planning guidance, not normative design authority.

#### Implementation Constraints

Preserve identifiable schemas, structured minimum fields, fail-closed invalid payload behavior and text non-authority. Do not choose schema library or physical format here.

#### Internal Prerequisites

None.

#### Cross-Spec Prerequisites

None for local closure. Downstream mappings are `REQUIRED_FOR_INTEGRATED_PROOF` only.

#### Producer / Consumer Contract Proof

`CAPABILITY_ID = EXEC-SCHEMA-CAPABILITY-PAYLOAD`; `AUTHORITY_OWNER = EXEC-001`; `PRODUCER = EXEC schema authority`; `PRODUCED_CONTRACT = identifiable capability-specific payload schema`; `CONSUMER = EXEC contract validator`; `CONSUMED_CAPABILITY = capability-specific payload validation`; `SEMANTIC_STATUS = DEFINED`; `LOCAL_TESTABILITY = YES`; `PRODUCTIVE_AVAILABILITY = NO` for the fixture harness; `CAPABILITY_SUMMARY_STATUS = CONTRACT_TESTABLE_LOCALLY`; `AVAILABILITY_EVIDENCE = direct schema harness`; `AVAILABILITY_CONDITION = local contract execution`; `DEPENDENCY_CLASS = INFORMATIONAL`; `DEPENDENCY_EDGE = unit-owned`; `PROOF_EVIDENCE = SPEC-EXEC-001 EXEC-ENVELOPE-001 and audit Â§12`.

#### Capability Availability and Blocking Effect

The local harness is testable but is not a productive foreign producer. It has no blocking effect because it is an informational local witness capability.

#### Temporal Authority Preconditions

`NOT_APPLICABLE`; this unit validates immutable contract input and does not observe mutable external authority before committing an effect.

#### Acceptance Criteria

1. A valid envelope and capability-specific payload pass their identifiable schemas; a generic payload with capability-invalid data is rejected (`LOCAL_PROVABILITY = YES`).
2. Missing minimum structured fields or text-only authority produce `CONTRACT_INVALID` and cannot imply approval, checkpoint or effect (`LOCAL_PROVABILITY = YES`).

#### ACCEPTANCE_WITNESS_MATRIX

| Normative behavior | Verb | Concrete operation | State affected | Direct positive | Direct negative/isolation | Expected evidence | Acceptance owner | Required capability | Authority | Contract | Local testability | Productive availability | Dependency class | Witness executable at local closure | Evidence type |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Capability payload schema selection | validate | `C-EXEC-001` / `AC-EXEC-001` | result contract | valid capability schema accepted | generic-but-capability-invalid payload rejected | schema witness | EXEC-IMP-01 | local schema harness | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |
| Structured envelope minimum | reject | `C-EXEC-002` / `AC-EXEC-002` | result contract | complete fields accepted | missing/text-only input â†’ `CONTRACT_INVALID` | minimum-field witness | EXEC-IMP-01 | local schema harness | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |

#### Local Closure

`LOCAL_CLOSURE = YES`. All local criteria and completion evidence are executable with the local contract harness; no downstream unit or unavailable foreign capability is required.

#### Work Can Start

`WORK_CAN_START = YES`; `EXECUTION_READY = TRUE` for this unit.

#### Shared Closure Boundary

`SHARED_CLOSURE_BOUNDARY = YES` for the schema and structured-envelope facets; no registry or manifest behavior is merged.

#### Required Tests

Direct capability-specific schema positive/negative tests, missing-field tests, text-only rejection, schema identity mismatch, no-approval/no-effect assertions and regression of existing authenticated validation.

#### Legacy / Cutover Impact

`NEW_CANONICAL_PATH`; generic payload acceptance is retired as a contradictory local authority path. No legacy schema is silently converted.

#### Completion Evidence

Direct `C-EXEC-001/002` witness report, schema identity/selection evidence, generic-payload rejection and passing retained regression tests.

#### Risks

Generic payload fallback, schema identity omission and transport/prototype shape promotion.

#### Issue Decomposition Readiness

`ISSUE_READY`; `VALIDATED_GAP_BACKING = YES`; `INDEPENDENT_CLOSURE = YES`.

#### Initial DAG State

`READY`; `BLOCKED_BY = NONE`.

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

Internal ticket dependencies are `NONE` and preserve the Plan DAG. Cross-SPEC dependencies remain foreign capability handoffs. `DEPENDS_ON` and `BLOCKED_BY` are both retained; a satisfied prerequisite is removed from blockers only by authorized workflow state transition.

## 14. Blocking Conditions

```text
BLOCKED_BY_UPSTREAM_AUTHORITY = NONE
BLOCKED_BY_UPSTREAM_CONTRACT = NONE for local closure; foreign integrated-only capabilities remain unavailable without blocking this ticket
INTERNAL_PREREQUISITES = NONE
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


Failure/not-found/stale semantics, version transport, availability evidence and ownership are preserved from the Plan. No foreign capability is required for local execution or local closure.

## 14c. ACCEPTANCE_WITNESS_MATRIX

`ACCEPTANCE_WITNESS_MATRIX: REQUIRED`

The exact Unit `ACCEPTANCE_WITNESS_MATRIX` above is preserved as the authoritative matrix. It has a row for every Required Behavior and normative Acceptance Criterion, including operation, affected state, direct positive test, direct negative/isolation test, expected evidence, producer/capability, independent availability dimensions, dependency class, evidence type, and `WITNESS_EXECUTABLE_AT_LOCAL_CLOSURE`. Local rows are executable at ticket closure; integrated-only rows remain explicitly `NO` and are not falsely closed here.

## 15. Implementation Constraints

Preserve the Unit's constraints exactly. Do not invent identity, lifecycle, provenance, persistence, failure, compatibility, concurrency, recovery, ownership, dependency direction or architecture. Do not promote caller, fixture, mock, source inspection or downstream artifacts to authority/productive availability.

## 16. Acceptance Criteria

The exact Unit Acceptance Criteria and Plan Â§11 Acceptance â†’ Plan traceability are preserved above. Every criterion is testable and locally provable for the bounded unit contribution; complete integrated obligations remain with the Plan's Final Proof Owner and checkpoint.

```text
ACCEPTANCE_REFERENCED = AC-EXEC-001, AC-EXEC-002
TESTABLE = YES
LOCALLY_PROVABLE = YES for local contribution
```

## 17. Acceptance / Proof Role

`CONTRIBUTOR: YES`; `LOCAL_ACCEPTANCE_OWNER: YES`; `FINAL_PROOF_OWNER: YES` for `AC-EXEC-001, AC-EXEC-002`. No synthetic proof-only ticket exists and no downstream owner is promoted without new evidence.

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

`WAVE: 1`

## 24. Parallelization

`SAFE` inherited unchanged from Plan Â§14. Wave does not make a blocked ticket READY; shared seams require the stated coordination/serial behavior.

## 25. Handoff After Completion

Independent ticket-set audit is mandatory. Completion may release only `EXEC-001-TICKET-002, EXEC-001-TICKET-003, EXEC-001-TICKET-007` through the authorized workflow. Integrated checkpoints and foreign producer evidence remain downstream handoffs; this decomposition does not approve or implement the ticket.

## 26. Ticket Local Closure

```text
TICKET_LOCAL_CLOSURE = YES
LOCAL_ACCEPTANCE_PROVABLE_NOW = YES at closure after internal prerequisites
LOCAL_COMPLETION_EVIDENCE_PRODUCIBLE_NOW = YES at closure
WITNESS_EXECUTABLE_AT_LOCAL_CLOSURE = YES for local rows; integrated-only rows remain NO
UNIT_SCOPE_LOST_BY_SPLIT = 0
```

This is an initialized execution artifact only. Later workflow owns implementation, audit, remediation, and state transitions.
