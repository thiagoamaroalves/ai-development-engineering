# DOM-001-TICKET-007 — Implementation Design

## 1. Design Verdict

```text
IMPLEMENTATION_DESIGN_READY
```

## 2. Ticket

```text
Ticket ID: DOM-001-TICKET-007
Ticket path: docs/tickets/SPEC-DOM-001/DOM-001-TICKET-007-publication-advancement-gates.md
Implementation Unit: DOM-IMP-07 — Publication vocabulary and advancement gates
Portfolio Obligations: O-014, O-015
Requirements: DOM-ADV-001, DOM-PUB-001
Gap IDs: GAP-013, GAP-016
Acceptance IDs: AC-DOM-014, AC-DOM-015
```

## 3. Implementation Responsibility

Implement the DOM-owned publication vocabulary, verdict/dependency-gated local
advancement, independent unit progress, cooperative pause/cancel semantics,
and fail-closed mapping of foreign publication evidence.

## 4. Repository Architecture Context

Domain modules own publication state, gate invariants, candidate identity, and
semantic rejection. Application modules orchestrate commands and map GIT
records through a narrow boundary. GIT execution, remote confirmation, and
transport remain foreign. Existing `src/domain/pipeline.ts` supplies immutable
stage/revision patterns but is not the publication lifecycle authority.

## 5. Existing Repository Context

| Existing Component | Classification | Current Responsibility | Design Use |
|---|---|---|---|
| `WorkflowPipeline` | INTEGRATE | immutable stage/revision transition | preserve candidate stage correlation |
| `PipelineRevision` | REUSE | expected revision value object | publication aggregate concurrency token precedent |
| `CanonicalIdentityReference` | REUSE | canonical identity attachment | bind publication/candidate identity |
| `AdvancePipelineHandler` | INTEGRATE | application command orchestration | consume publication gate result; do not add Git behavior |
| prototype publication state | DO_NOT_TOUCH | non-authoritative scenario | direct test inspiration only |

## 6. Domain Model Assessment

```text
DOMAIN_CONCEPTS = Publication, PublicationId, CandidateBasis, PublicationState,
  PublicationVerdict, DependencyClosure, UnitProgress, CancellationRequest
AGGREGATE_ROOTS = 1 (Publication)
ENTITIES = 1 (UnitProgress)
VALUE_OBJECTS = 4 (PublicationId, CandidateBasis, PublicationEvidenceId, PublicationRevision)
DOMAIN_SERVICES = 0
DOMAIN_POLICIES = 2 (PublicationStatePolicy, AdvancementGatePolicy)
DOMAIN_EVENTS = 1 optional publication-state transition record
APPLICATION_USE_CASES = 1 (PublicationCommandHandler)
REPOSITORY_ABSTRACTIONS = 1 (PublicationRepository)
ANTI_CORRUPTION_BOUNDARIES = 1 (GitPublicationEvidenceMapper)
```

The publication aggregate owns semantic state distinctions and never infers a
remote effect from a local command invocation or merge label.

## 7. UPSTREAM_AUTHORITY_PRECONDITIONS

```text
IDENTITY = COMPLETE; SPEC publication/effect identity and ADR-0002
LIFECYCLE = COMPLETE; DOM-PUB-001 and DOM-ADV-001; eight publication states remain distinct
PERSISTENCE_RECOVERY = COMPLETE boundary; PLAT stores material, DOM validates semantic state
REHYDRATION = COMPLETE; candidate/evidence identity and state must be attached before use
CONCURRENCY = COMPLETE; candidate basis and publication revision revalidate before advance
IDEMPOTENCY = COMPLETE; repeated accepted/rejected gate commands do not duplicate transitions
OWNERSHIP = COMPLETE; DOM owns vocabulary/gates, GIT owns push/PR/merge/remote confirmation
CROSS_SPEC_DEPENDENCIES = COMPLETE; PCP-GIT-01 is integrated-only and non-blocking locally
AUTHORITY_CONSUMPTION_PROOFS = ACP-DOM-07 and ticket §14a
PRODUCER_CONSUMER_CONTRACT_PROOFS = PCP-GIT-01 and ticket §14b
TEMPORAL_AUTHORITY_PROOF = preserved from Plan DOM-IMP-07; evidence/basis revalidated at advance
SPEC_IMPLEMENTABILITY_CHECK = PASS
PROHIBITED_NORMATIVE_DECISIONS = NONE
```

## 8. Aggregate / Consistency Boundaries

| Aggregate | Root | Invariants | Transaction / Consistency Boundary | External References |
|---|---|---|---|---|
| Publication | `Publication` | distinct states; exact candidate basis; verdict/dependency gate; independent progress; cooperative cancellation | one semantic publication command and expected publication revision | GIT evidence reference, never local remote authority |
| Unit progress | `UnitProgress` within Publication | pause/cancel applies only to affected unit; unrelated units continue | atomic update inside publication consistency boundary | execution/unit identity reference |

## 9. Responsibility Decomposition

| Responsibility | Authority | State Owned | Expected Test Surface |
|---|---|---|---|
| Publication vocabulary | DOM-PUB-001 | eight states | state distinction tests |
| Candidate basis | DOM-PUB-001 / ADR-0009 | candidate/base/head/tree/evidence correlation | exact identity and stale tests |
| Advancement gate | DOM-ADV-001 | verdict, dependency closure, active progress | direct positive/negative gate tests |
| Independent progress | DOM-ADV-001 | unit-scoped progress | isolation/concurrency tests |
| Cooperative cancellation | ADR-0002 | requested/accepted effect semantics | pause/cancel/remote preservation tests |
| GIT mapping | PCP-GIT-01 | foreign evidence reference only | ACL mapping tests |

## 10. Proposed Components

| Component | Type | Responsibility | Existing/New | Expected Location | Size |
|---|---|---|---|---|---|
| `PublicationState` | VALUE_OBJECT | validate eight canonical states | New | `src/domain/publication.ts` | SMALL |
| `PublicationId` / `CandidateBasis` | VALUE_OBJECT | stable candidate/effect correlation | New | `src/domain/publication.ts` | SMALL |
| `PublicationStatePolicy` | DOMAIN_POLICY | validate state transitions/distinctions | New | `src/domain/publication.ts` | MEDIUM |
| `AdvancementGatePolicy` | DOMAIN_POLICY | require verdict/closed deps/no active work | New | `src/domain/publication.ts` | MEDIUM |
| `Publication` | AGGREGATE_ROOT | own state, progress, pause/cancel and immutable proposal | New | `src/domain/publication.ts` | LARGE/cohesive |
| `PublicationRepository` | REPOSITORY | load/persist with expected revision | New | `src/domain/publication.ts` | SMALL |
| `GitPublicationEvidenceMapper` | ACL | translate foreign evidence without authority transfer | New | `src/application/publication.ts` | SMALL |
| `PublicationCommandHandler` | APPLICATION_SERVICE | orchestrate commands and persistence | New | `src/application/publication.ts` | MEDIUM |
| publication tests | TEST_SUPPORT | direct gates and isolation | New | `tests/dom-001-ticket-007.test.ts` | MEDIUM |

`Publication` OWNS semantic publication and advancement state; collaborates with
both policies and the repository; must not own Git execution, remote confirmation,
transport, or UI. `AdvancementGatePolicy` owns no persistence. The handler owns
orchestration only.

## 11. SOLID Assessment

| Component | SRP | OCP | LSP | ISP | DIP | Result |
|---|---|---|---|---|---|---|
| `Publication` | cohesive publication lifecycle | fixed normative vocabulary | N/A | N/A | domain-only | PASS |
| `AdvancementGatePolicy` | gate decisions only | no speculative strategy | N/A | narrow | domain-only | PASS |
| `PublicationCommandHandler` | orchestration/mapping boundary | no hypothetical plugin | N/A | narrow ports | depends on ports | PASS |
| `GitPublicationEvidenceMapper` | foreign-to-local mapping only | explicit current contract | N/A | narrow evidence input | application boundary | PASS |

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
PublicationCommandHandler → PublicationRepository port
PublicationCommandHandler → Publication aggregate/policies
GitPublicationEvidenceMapper → local publication value objects
Publication domain → no Git SDK, HTTP, filesystem, or transport
Infrastructure → repository/mapping ports
```

```text
DEPENDENCY_DIRECTION_VIOLATIONS = 0
INFRASTRUCTURE_LEAKAGE_POINTS = 0
```

## 13. Invariant Placement

| Invariant | Domain Enforcement | Durable Protection | Application Guard | Test |
|---|---|---|---|---|
| eight states stay distinct | `PublicationState`/policy | persisted state validation | mapper rejects unknown/conflated state | vocabulary test |
| PR merge is not remote confirmation | `PublicationStatePolicy` | evidence relation retained | GIT mapper preserves state | negative mapping test |
| verdict and closed dependencies required | `AdvancementGatePolicy` | expected revision/evidence record | handler passes current basis | advancement gate test |
| active work blocks publication | aggregate progress policy | state/evidence history | handler loads current progress | running/waiting negative test |
| cancellation is cooperative/unit-local | `Publication`/`UnitProgress` | request/effect correlation | no remote rollback command | isolation/cancellation test |

```text
UNPLACED_DOMAIN_INVARIANTS = 0
```

## 14. Persistence Design

`PublicationRepository` loads an immutable aggregate snapshot and accepted
state/evidence history, then persists a proposed state with an expected
publication revision. Candidate basis, verdict, dependency closure, and foreign
evidence correlations are stored as semantic references. PLAT/GIT own durable
atomicity and remote effects. Rehydration rejects detached candidate evidence,
state conflation, stale basis, or a confirmation not attached to the exact
candidate. No generic state setter is exposed.

## 15. Lifecycle Design

```text
STATES = PUBLICATION_CANDIDATE_READY, AWAITING_PUBLICATION_APPROVAL,
  LOCAL_INTEGRATION_PENDING, LOCAL_INTEGRATION_COMPLETE, PR_OPEN,
  AWAITING_PR_MERGE, PR_MERGED, REMOTE_PUBLICATION_CONFIRMED
INITIAL_STATE = PUBLICATION_CANDIDATE_READY
TRANSITION_OWNER = PublicationStatePolicy and Publication aggregate
INVALID_TRANSITIONS = unlisted/conflated state transitions reject without mutation
RECOVERY_TRANSITIONS = accepted candidate/evidence history only
TERMINAL_TRANSITIONS = remote confirmation is the common completed publication state; no rollback inference
PERSISTENCE_GUARD = candidate identity, basis, publication revision, and evidence correlation
BYPASS_PATHS_FORBIDDEN = direct remote-confirmation assignment, merge-as-confirmation, global cancel, generic setters
```

The implementation does not execute Git or define remote confirmation truth.

## 16. Cross-Spec Integration

| Foreign Owner | Contract | Local Integration Point | ACL | Forbidden Local Ownership |
|---|---|---|---|---|
| SPEC-GIT-001 | `PCP-GIT-01` candidate/PR/merge/remote-confirmation evidence | `GitPublicationEvidenceMapper` | explicit evidence mapper | push, PR, merge, remote observation |
| SPEC-PLAT-001 | `PCP-PLAT-05` durable command/evidence record | repository adapter | persistence boundary | physical CAS/journal/recovery meaning |
| SPEC-EXEC-002 | execution completion/progress mapping | application gate input | outcome mapper | scheduler/session lifecycle |

The ticket's ACP/PCP records preserve authority owner, producer, consumer,
returned evidence, versions, failure/stale behavior, and
`REQUIRED_FOR_INTEGRATED_PROOF` classification. Foreign availability is
non-blocking for local semantic closure.

## 17. Main Interaction Flow

1. Handler resolves canonical publication/candidate identity and current state.
2. Mapper validates foreign evidence shape and preserves its identity.
3. Aggregate/policies validate requested vocabulary, verdict, dependencies, and
   unit-scoped progress.
4. Aggregate returns an immutable proposal or canonical rejection.
5. Repository persists by expected revision; handler emits local result.

## 18. Failure / Recovery Flow

Reject missing verdict/closure, stale candidate basis, active work, state
conflation, non-cooperative cancellation, remote rollback, or detached evidence
without mutation. Retry is idempotent by publication command correlation and
candidate identity. Recovery revalidates candidate/evidence attachments before
materialization.

```text
CALLER_AS_AUTHORITY_CHECK = PASS; caller evidence is mapped and verified, not truth
TEMPORAL_AUTHORITY_PROOF = PASS; candidate/evidence basis is independently revalidated before advance
FAILURE_OWNER = DOM for semantic gate; GIT/PLAT for physical/remote effects
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
NO_DEEP_NESTING_BY_DESIGN = PASS
NO_COMMENT_DEPENDENT_CORRECTNESS = PASS
NO_HIDDEN_TEMPORAL_COUPLING = PASS
NO_UNNECESSARY_MUTABILITY = PASS
```

## 20. Test Design

| Behavior / Invariant | Test Type | Target | Expected Proof |
|---|---|---|---|
| distinct publication states | DOMAIN_INVARIANT | `PublicationState` | all eight states; PR merge not remote confirmation |
| formal advancement gate | STATE_TRANSITION / NEGATIVE_BEHAVIOR | `Publication.advance` | closed verdict advances; missing/active/stale rejects |
| cooperative cancellation/progress | CONCURRENCY / ISOLATION | `Publication` unit progress | affected unit pauses/cancels; unrelated unit progresses; no remote rollback |
| GIT evidence mapping | CROSS_SPEC | mapper | evidence identity/failure semantics preserved |

### ACCEPTANCE_WITNESS_MATRIX

| NORMATIVE_BEHAVIOR | NORMATIVE_VERB | CONCRETE_OPERATION_COMMAND_OR_QUERY | STATE_OR_TRANSITION_AFFECTED | DIRECT_POSITIVE_TEST | DIRECT_NEGATIVE_OR_ISOLATION_TEST | EXPECTED_EVIDENCE_FILE | EVIDENCE_TYPE | ACCEPTANCE_OWNER | REQUIRED_PRODUCER_OR_CAPABILITY | AUTHORITY_STATUS | CONTRACT_STATUS | LOCAL_TESTABILITY | PRODUCTIVE_AVAILABILITY | CAPABILITY_SUMMARY_STATUS | DEPENDENCY_CLASS | WITNESS_EXECUTABLE_AT_LOCAL_CLOSURE |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Publication states | represents distinctly | publication state command | candidate/approval/integration/PR/remote confirmation | `T7-AC1-P` eight-state vocabulary | `T7-AC1-N` PR_MERGED is not remote confirmation | `evidence/TICKET-007/AC-DOM-014-publication.md` | LOCAL_TEST_EVIDENCE | TICKET-007 | local Publication aggregate | DEFINED | DEFINED | YES | YES | CONTRACT_PRODUCTIVELY_AVAILABLE | LOCAL_IMPLEMENTATION | YES |
| Advancement gate | advances only with closure | advancement command | workflow progression | `T7-AC2-P` closed-verdict advancement | `T7-AC2-N` missing verdict/dependency, active work, stale basis rejects | `evidence/TICKET-007/AC-DOM-015-advance.md` | LOCAL_TEST_EVIDENCE | TICKET-007 | local advancement policy | DEFINED | DEFINED | YES | YES | CONTRACT_PRODUCTIVELY_AVAILABLE | LOCAL_IMPLEMENTATION | YES |
| Cooperative cancellation | pauses/cancels cooperatively | pause/cancel command | unit-scoped progress | `T7-AC3-P` affected-unit pause/cancel | `T7-AC3-N` global pause/remote rollback rejected; unrelated progress preserved | `evidence/TICKET-007/AC-DOM-015-cancellation.md` | LOCAL_TEST_EVIDENCE | TICKET-007 | local unit-progress policy | DEFINED | DEFINED | YES | YES | CONTRACT_PRODUCTIVELY_AVAILABLE | LOCAL_IMPLEMENTATION | YES |

```text
DESIGN_TEST_COVERAGE_GATE = PASS
```

## 21. Structural Risk Assessment

```text
GOD_COMPONENT_RISK = LOW
OVERSIZED_FILE_RISK = MEDIUM; cohesive aggregate with explicit policy collaborators
RESPONSIBILITY_MIXING_RISK = LOW
EXCESSIVE_DEPENDENCY_RISK = LOW
DUPLICATION_RISK = LOW
TESTABILITY_RISK = LOW
CROSS_SPEC_LEAKAGE_RISK = LOW
ARCHITECTURE_DRIFT_RISK = LOW
ANEMIC_DOMAIN_MODEL_RISK = LOW
FAT_APPLICATION_SERVICE_RISK = LOW
FAT_INTERFACE_RISK = LOW
PRIMITIVE_OBSESSION_RISK = LOW
DEPENDENCY_INVERSION_RISK = LOW
INFRASTRUCTURE_LEAKAGE_RISK = LOW
DOMAIN_RULE_DUPLICATION_RISK = LOW
PREMATURE_ABSTRACTION_RISK = LOW
OVERENGINEERING_RISK = LOW
```

Mitigation for the medium file-size risk: keep state vocabulary, gate policy,
and aggregate methods cohesive but separate mapping/repository/handler code;
do not split the aggregate's invariant boundary artificially.

## 22. Implementation Sequence

1. Add publication value objects and the eight-state vocabulary; run state
   distinction negatives.
2. Add candidate basis/evidence correlation and publication policy; test exact
   identity and stale basis.
3. Add advancement gate and unit-scoped progress/cancellation behavior; run
   active-work, verdict, isolation, and retry tests.
4. Add repository/application ports and GIT evidence mapper; run mapping and
   no-remote-effect tests.
5. Run the full T007 suite and affected regressions; preserve foreign ownership.

## 23. Files Expected to Change

| Path / Area | Classification | Reason |
|---|---|---|
| `src/domain/publication.ts` | EXPECTED_CREATE | publication aggregate, states, policies, value objects |
| `src/application/publication.ts` | EXPECTED_CREATE | command orchestration and GIT mapping |
| `tests/dom-001-ticket-007.test.ts` | EXPECTED_CREATE | direct gate, vocabulary, isolation tests |
| existing pipeline modules | MUST_NOT_MODIFY unless local integration support is required | preserve pipeline authority |
| GIT/PLAT/EXEC code | MUST_NOT_MODIFY | foreign ownership |
| ADR/SPEC/Gap/Plan/audits | MUST_NOT_MODIFY | upstream authority |

## 24. Open Questions / Blockers

```text
NONE
```

## 25. Design Metrics

```text
RESPONSIBILITIES = 6
DOMAIN_CONCEPTS = 9
AGGREGATE_ROOTS = 1
ENTITIES = 1
VALUE_OBJECTS = 4
DOMAIN_SERVICES = 0
APPLICATION_SERVICES = 1
PORTS = 1
ADAPTERS = 1
ANTI_CORRUPTION_LAYERS = 1
PROPOSED_COMPONENTS = 9
CRITICAL_INVARIANTS = 5
UNPLACED_DOMAIN_INVARIANTS = 0
TEST_SURFACES = 4
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
TEMPORAL_AUTHORITY_PROOFS = 1
TEMPORAL_AUTHORITY_GAPS = 0
CALLER_SUPPLIED_AUTHORITY_BYPASS = 0
ACCEPTANCE_WITNESS_MATRIX_ROWS = 3
DIRECT_BEHAVIOR_WITNESSES = 3
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
