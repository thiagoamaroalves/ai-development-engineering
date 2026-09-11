# DOM-001-TICKET-004 — Implementation Design

## 1. Design Verdict

```text
IMPLEMENTATION_DESIGN_READY
```

Revalidation against the current post-TICKET-001 repository confirms that the
pipeline uses the canonical `STAGE` identity, validates immediate progression,
keeps state inputs separate, and requires an accepted provenance authority for
later-state rehydration. The design remains within DOM-IMP-04 and introduces no
new architecture or foreign lifecycle ownership.

## 2. Ticket

| Field | Value |
|---|---|
| Ticket ID | `DOM-001-TICKET-004` |
| Ticket path | `docs/tickets/SPEC-DOM-001/DOM-001-TICKET-004-pipeline-state-machines.md` |
| Implementation Unit | `DOM-IMP-04` |
| Portfolio Obligations | `O-009`, `O-010` |
| Requirements | `DOM-PIPE-001`, `DOM-STATE-001` |
| Gap IDs | `GAP-010` |
| Acceptance IDs | `AC-DOM-009`, `AC-DOM-010` |
| Status | `READY` |
| Design baseline | `646f5c67ffe0cdd9e0abeb9df0489ecb4f4a3b24` |

## 3. Implementation Responsibility

Enforce canonical immediate pipeline progression, preserve separate aggregate
state machines, and rehydrate later pipeline stages only from validated,
identity-bound, complete transition provenance.

## 4. Repository Architecture Context

`src/domain/pipeline.ts` contains immutable pipeline values, the
`WorkflowPipeline` aggregate, derivation policy, and narrow repository/state
ports. `src/application/pipeline.ts` contains thin command/query handlers.
TICKET-001 owns canonical identity reconstruction; PLAT owns physical journal,
replay, and CAS. Other state machines remain owned by their later DOM tickets.
The prototype is not imported or used as authority.

## 5. Existing Repository Context

| Existing Component | Classification | Current Responsibility | Design Use |
|---|---|---|---|
| `CanonicalStageReference` / identity authority | REUSE | Canonical STAGE identity resolution | Required identity input for create/rehydrate |
| `PipelineStage` / `PipelineOrder` | PRESERVED | Closed stage vocabulary and immediate successor rule | Sole order decision owner |
| `WorkflowPipeline` | PRESERVED/EXTENDED | Aggregate stage and revision transition | Own advance and provenance validation |
| `PipelineStateInputs` | PRESERVED | Frozen independent machine inputs | Read-only composition boundary |
| `DerivedWorkflowState` | PRESERVED | Validated read-only projection | Cannot be directly constructed without derivation proof |
| `PipelineRepository` | PRESERVED | Find and CAS advance port | Persistence boundary only |
| `PipelineStateReader` | PRESERVED | Reads independent states | No transition or mutation authority |
| `AdvancePipelineHandler` | PRESERVED | Coordinates command and CAS | No duplicated domain rules |
| `GetPipelineStateHandler` | PRESERVED | Coordinates read derivation | Query-only |
| `tests/dom-001-ticket-004.test.ts` | PRESERVED/EXTENDED | Direct ordering, provenance, isolation, CAS, architecture tests | Local acceptance and regression evidence |

## 6. Domain Model Assessment

Domain concepts are `WorkflowPipeline` (aggregate root), `PipelineStage`,
`PipelineRevision`, `PipelineMachineState`, `PipelineStateInputs`,
`DerivedWorkflowState`, `PipelineOrder`, and `PipelineStateDerivationPolicy`.
The pipeline aggregate owns stage transitions; independent machine snapshots are
read-only inputs and never become a combined mutation aggregate. Provenance is
evidence of accepted transitions, not a second state machine.

`DOMAIN_SERVICES = 0`; `DOMAIN_POLICIES = 2`; `ANEMIC_DOMAIN_MODEL_RISK = LOW`.

## 7. UPSTREAM_AUTHORITY_PRECONDITIONS

| Concern | Proof / authority | Status | Design consequence |
|---|---|---|---|
| Identity | `ACP-DOM-04`, TICKET-001 identity contract, SPEC §12.1 | COMPLETE | Use `CanonicalIdentityReference(kind=STAGE, scope=ExecutionId, value=StageId)` |
| Lifecycle/order | ADR-0002, `DOM-PIPE-001` | COMPLETE | Only immediate listed successor is valid |
| State separation | ADR-0002, `DOM-STATE-001` | COMPLETE | Separate machine inputs and owners; no implicit combined transition |
| Reconstruction | SPEC §12.1/DOM-PIPE-001, `PCP-PLAT-04` | COMPLETE | Later state requires complete accepted provenance and final match |
| Persistence/recovery | `PCP-PLAT-04` | COMPLETE as foreign contract | PLAT supplies records/integrity; DOM validates semantics |
| Concurrency | Plan CAS contract | COMPLETE | Expected `PipelineRevision` is a concurrency token, not provenance |
| Idempotency | ticket stale/duplicate contract | COMPLETE | stale and invalid attempts do not mutate state |
| Ownership | O-009/O-010 | COMPLETE | DOM owns progression/separation; PLAT owns physical mechanisms |
| Cross-SPEC dependency | PLAT provenance/replay | Integrated-only | Does not block local semantic closure |

`SPEC_IMPLEMENTABILITY_CHECK = PASS`; no prohibited normative decision is
introduced by this design.

## 8. Aggregate / Consistency Boundaries

| Aggregate | Root | Invariants | Transaction / Consistency Boundary | External References |
|---|---|---|---|---|
| Canonical pipeline | `WorkflowPipeline` | canonical identity, known stage, immediate successor, continuous aggregate revision | one advance guarded by expected revision/CAS | accepted provenance and independent state snapshots |
| Independent machines | owning aggregates outside T004 | each machine remains independently authoritative | separate owning transitions | read-only `PipelineStateInputs` |

## 9. Responsibility Decomposition

| Responsibility | Authority | State Owned | Expected Test Surface |
|---|---|---|---|
| Stage vocabulary/order | `DOM-PIPE-001` | ordered stage list | immediate successor and bypass tests |
| Pipeline mutation | `WorkflowPipeline` | current stage/revision | valid/invalid transition tests |
| Provenance reconstruction | `WorkflowPipeline` + accepted authority port | transition chain | missing/skip/duplicate/forged/divergent tests |
| Machine separation/derivation | `PipelineStateInputs` and derivation policy | read-only snapshots/result | isolation and no-construction-bypass tests |
| Durable stale enforcement | `PipelineRepository`/PLAT | stored pipeline revision | CAS stale/no-last-write-wins tests |
| Command/query orchestration | application handlers | none | side-effect and missing-state tests |

## 10. Proposed Components

| Component | Type | Responsibility | Existing/New | Expected Location | Size |
|---|---|---|---|---|---|
| `PipelineStage` | VALUE_OBJECT | Validate canonical stage | Existing | `src/domain/pipeline.ts` | SMALL |
| `PipelineOrder` | DOMAIN_POLICY | Decide immediate successor | Existing | `src/domain/pipeline.ts` | SMALL |
| `PipelineRevision` | VALUE_OBJECT | Expected revision/CAS token | Existing | `src/domain/pipeline.ts` | SMALL |
| `WorkflowPipeline` | AGGREGATE_ROOT | Own stage transition and reconstruction validation | Existing | `src/domain/pipeline.ts` | MEDIUM |
| `PipelineProvenanceReconstructionAuthority` | PORT | Supply accepted transition history | Existing | `src/domain/pipeline.ts` | SMALL |
| `PipelineStateInputs` | VALUE_OBJECT | Freeze separate machine inputs | Existing | `src/domain/pipeline.ts` | MEDIUM |
| `DerivedWorkflowState` | OTHER/value result | Expose validated read-only derivation | Existing | `src/domain/pipeline.ts` | SMALL |
| `PipelineStateDerivationPolicy` | DOMAIN_POLICY | Build result only through proof seam | Existing | `src/domain/pipeline.ts` | SMALL |
| `PipelineRepository` / `PipelineStateReader` | PORT | Persistence and independent reads | Existing | `src/domain/pipeline.ts` | SMALL |
| Application handlers | COMMAND/QUERY_HANDLER | Coordinate ports and domain methods | Existing | `src/application/pipeline.ts` | SMALL |

The aggregate owns progression and semantic reconstruction. Ports own access
only. No component owns another aggregate's lifecycle, PLAT replay mechanics,
transport, or a generic state-machine framework.

## 11. SOLID Assessment

All existing components have cohesive reasons to change; no extension
machinery or inheritance is needed.

```text
SRP_VIOLATIONS = 0
OCP_VIOLATIONS = 0
LSP_VIOLATIONS = 0
ISP_VIOLATIONS = 0
DIP_VIOLATIONS = 0
UNJUSTIFIED_SOLID_VIOLATIONS = 0
```

## 12. Dependency Direction

```text
Domain values/policies/aggregate → DOM vocabulary and stable ports
Application handlers → domain and repository/state-reader ports
PLAT/transport adapters → implement/map ports; never define stage meaning
```

```text
DEPENDENCY_DIRECTION_VIOLATIONS = 0
INFRASTRUCTURE_LEAKAGE_POINTS = 0
```

## 13. Invariant Placement

| Invariant | Domain Enforcement | Durable Protection | Application Guard | Test |
|---|---|---|---|---|
| Canonical order | `PipelineStage` + `PipelineOrder` | stored accepted stage | handler delegates | direct successor/bypass |
| No stage skip | `WorkflowPipeline.advanceTo` | CAS persistence | no fallback/rebase | negative transition |
| Complete later-state provenance | aggregate chain validator + accepted authority | PLAT append-only records | rehydrate requires authorities | reconstruction matrix |
| State machines remain separate | `PipelineStateInputs` + pure derivation | independent records | query-only composition | isolation/projection boundary |
| No stale last-write-wins | repository CAS contract | atomic expected revision | stale error, no retry | stale concurrency test |

`UNPLACED_DOMAIN_INVARIANTS = 0`; current implementation has no material
unjustified deviation from this placement.

## 14. Persistence Design

`PipelineRepository` stores canonical identity, current stage, aggregate
revision, and accepted transition records through the PLAT boundary. `find`
and guarded `advance` are the only local mutation seam. Serialized material
must re-enter through canonical identity and provenance validation. A persistence
revision is used for CAS only; it cannot prove causal progression. Physical
journal/replay, integrity, durability, and recovery remain PLAT-owned.

## 15. Lifecycle Design

```text
ACCEPTED_ADRS → SPECS → SPEC_AUDIT_REMEDIATION → ... → MAIN_UPDATE_AND_PUBLICATION
```

Only the immediate successor is accepted. Any skip, duplicate, later-stage
shortcut, unknown stage, invalid revision, missing/forged/detached provenance,
or stale CAS rejects without mutation. `WorkflowPipeline` is the stage
transition owner; each other machine retains its own owner.

## 16. Cross-Spec Integration

| Foreign Owner | Contract | Local Integration Point | ACL | Forbidden Local Ownership |
|---|---|---|---|---|
| `SPEC-PLAT-001` | `PCP-PLAT-04` ordered append-only records, integrity/replay, physical CAS | provenance authority and repository ports | explicit record mapping | stage meaning, transition order, semantic reconstruction |
| `SPEC-EXEC/GIT/UI/BACKEND` | read-only state mappings where supplied | `PipelineStateInputs` / application seams | consumer mapping | foreign lifecycle, transport, or publication decisions |

`CAP-PLAT-SNAPSHOT-PIPELINE-PROVENANCE` is `AUTHORITY_STATUS=DEFINED`,
`CONTRACT_STATUS=DEFINED`, `LOCAL_TESTABILITY=NO`,
`PRODUCTIVE_AVAILABILITY=NO`, `DEPENDENCY_CLASS=REQUIRED_FOR_INTEGRATED_PROOF`;
it does not block local closure.

## 17. Main Interaction Flow

1. Resolve the canonical STAGE reference through TICKET-001 authority.
2. Load current `WorkflowPipeline`.
3. `advanceTo` validates the immediate successor and returns a new immutable
   proposal with expected revision.
4. `PipelineRepository.advance` performs guarded CAS; stale results reject.
5. Rehydration resolves accepted identity/provenance and validates the complete
   immediate chain before materialization.
6. Query handling reads independent machine inputs and creates only a frozen
   derived result through the derivation proof seam.

## 18. Failure / Recovery Flow

Unknown stage/revision, invalid order, missing state, missing/duplicate/
reordered/forged provenance, identity mismatch, snapshot divergence, and stale
CAS all fail closed. DOM owns semantic validation; PLAT owns physical record
integrity and CAS. Recovery never infers progression from a scalar stage or
revision. There is no external effect requiring a temporal second observation
inside T004.

```text
CALLER_AS_AUTHORITY_CHECK = PASS
TEMPORAL_AUTHORITY_PROOF = NOT_APPLICABLE (no external effect)
```

## 19. Clean Code Assessment

```text
CLEAR_DOMAIN_NAMING = PASS
SMALL_COHESIVE_METHODS = PASS
EXPLICIT_SIDE_EFFECTS = PASS
EXPLICIT_MUTATION_BOUNDARIES = PASS
NO_BOOLEAN_PARAMETER_EXPLOSION = PASS
NO_LONG_PARAMETER_LISTS = PASS
NO_PRIMITIVE_OBSESSION_WHERE_DOMAIN_TYPE_EXISTS = PASS
NO_MAGIC_VALUES = PASS
NO_GENERIC_UTIL_BUCKETS = PASS
NO_GENERIC_SERVICE_BUCKETS = PASS
NO_DUPLICATED_DOMAIN_RULES = PASS
NO_HIDDEN_TEMPORAL_COUPLING = PASS
NO_UNNECESSARY_MUTABILITY = PASS
```

## 20. Test Design

| Behavior / Invariant | Test Type | Target | Expected Proof |
|---|---|---|---|
| Immediate canonical order | DOMAIN_INVARIANT/STATE_TRANSITION | `WorkflowPipeline.advanceTo` | successor accepted; later/unknown rejected unchanged |
| Provenance reconstruction | RECOVERY/NEGATIVE | `WorkflowPipeline.rehydrate` | complete accepted chain restores exact stage/revision |
| Provenance integrity | NEGATIVE/ISOLATION | rehydration seam | missing, duplicate, reordered, forged, divergent, detached rejected |
| Canonical identity | ARCHITECTURE/NEGATIVE | create/rehydrate + T1 authority | aliases/unregistered STAGE cannot materialize |
| Separate machines | ARCHITECTURE/DOMAIN | state inputs and derivation | inputs are frozen and no combined transition or direct derived construction |
| CAS stale behavior | CONCURRENCY/STALE | `PipelineRepository` + handler | stale command loses, no last-write-wins, stored state unchanged |
| Read-only query | APPLICATION | `GetPipelineStateHandler` | missing input fails closed; query does not mutate |

The current ticket suite contains direct witnesses for all rows, including the
architecture import guard and negative construction paths.

```text
ACCEPTANCE_WITNESS_MATRIX_ROWS = 2
DIRECT_BEHAVIOR_WITNESSES = 2 normative rows with focused subtests
PROXY_ONLY_BEHAVIORS = 0
UNTESTED_STATE_TRANSITIONS = 0
UNPROVEN_CONCURRENCY_CONTRACTS = 0
MISSING_ARCHITECTURE_GUARDS = 0
DESIGN_TEST_COVERAGE_GATE: PASS
```

## 21. Structural Risk Assessment

| Risk | Level | Mitigation |
|---|---|---|
| God component | LOW | aggregate owns only pipeline stage/provenance rules |
| State-machine conflation | LOW | typed independent inputs and query-only derivation |
| Provenance treated as revision formula | MEDIUM | accepted authority port plus explicit chain validation |
| Cross-spec leakage | LOW | PLAT is consumed through ports; no infrastructure import |
| Premature abstraction | LOW | no generic state-machine framework or factory |

`HIGH_STRUCTURAL_RISKS = 0`, `HIGH_DDD_RISKS = 0`, `HIGH_SOLID_RISKS = 0`,
`HIGH_CLEAN_CODE_RISKS = 0`.

## 22. Implementation Sequence

1. Verify canonical STAGE identity resolution and immutable initial creation.
2. Preserve/verify the closed stage vocabulary and immediate successor policy.
3. Preserve aggregate transition and guarded CAS behavior; run stale tests.
4. Preserve accepted-authority provenance reconstruction and all fail-closed
   negative cases.
5. Preserve frozen independent state inputs and derivation proof boundary.
6. Run T004 focused tests, T001 regression tests, and architecture guards.

No upstream authority, foreign lifecycle, schema, or transport changes are
permitted.

## 23. Files Expected to Change

| Path / Area | Classification | Reason |
|---|---|---|
| `src/domain/pipeline.ts` | POSSIBLE_MODIFY | only local structural/testability correction within approved boundary |
| `src/application/pipeline.ts` | POSSIBLE_MODIFY | only local orchestration correction if evidence requires it |
| `tests/dom-001-ticket-004.test.ts` | EXPECTED_MODIFY | acceptance/regression evidence and focused structural guard |
| `docs/tickets/SPEC-DOM-001/evidence/TICKET-004/*` | EXPECTED_CREATE_AT_COMPLETION | local completion evidence |
| `src/domain/identity.ts` | MUST_NOT_MODIFY | TICKET-001 authority |
| `prototype/**` | MUST_NOT_MODIFY | non-authoritative |
| ADR/SPEC/Gap Matrix/Plan/tickets | MUST_NOT_MODIFY by implementation | frozen upstream authority |

## 24. Open Questions / Blockers

```text
NONE
```

Physical PLAT replay/durability remains an integrated-only downstream
checkpoint and is not a local T004 blocker.

## 25. Design Metrics

```text
RESPONSIBILITIES = 6
DOMAIN_CONCEPTS = 8
AGGREGATE_ROOTS = 1
ENTITIES = 1
VALUE_OBJECTS = 5
DOMAIN_SERVICES = 0
DOMAIN_POLICIES = 2
APPLICATION_SERVICES = 2
PORTS = 3
ADAPTERS = 0
ANTI_CORRUPTION_LAYERS = 0
PROPOSED_COMPONENTS = 10
CRITICAL_INVARIANTS = 5
UNPLACED_DOMAIN_INVARIANTS = 0
TEST_SURFACES = 7
UNJUSTIFIED_SOLID_VIOLATIONS = 0
DEPENDENCY_DIRECTION_VIOLATIONS = 0
HIGH_STRUCTURAL_RISKS = 0
HIGH_DDD_RISKS = 0
HIGH_SOLID_RISKS = 0
HIGH_CLEAN_CODE_RISKS = 0
SPEC_IMPLEMENTABILITY_CHECK = PASS
IDENTITY_AUTHORITY_GAPS = 0
RECONSTRUCTION_AUTHORITY_GAPS = 0
LIFECYCLE_AUTHORITY_GAPS = 0
PERSISTENCE_SEMANTICS_GAPS = 0
CROSS_SPEC_AUTHORITY_GAPS = 0
PROHIBITED_NORMATIVE_DECISIONS = 0
AUTHORITY_CONSUMPTION_PROOFS = 1
PRODUCER_CONSUMER_CONTRACT_PROOFS = 1
TEMPORAL_AUTHORITY_PROOFS = 0
TEMPORAL_AUTHORITY_GAPS = 0
CALLER_SUPPLIED_AUTHORITY_BYPASS = 0
ACCEPTANCE_WITNESS_MATRIX_ROWS = 2
DIRECT_BEHAVIOR_WITNESSES = 2
PROXY_ONLY_BEHAVIORS = 0
UNTESTED_STATE_TRANSITIONS = 0
UNPROVEN_CONCURRENCY_CONTRACTS = 0
MISSING_ARCHITECTURE_GUARDS = 0
DESIGN_TEST_COVERAGE_GATE = PASS
```

## 26. Design Gate

```text
IMPLEMENTATION_DESIGN_GATE: READY_FOR_IMPLEMENTATION
```
