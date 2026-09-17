# DOM-001-TICKET-006 — Implementation Design

## 1. Design Verdict

```text
IMPLEMENTATION_DESIGN_READY
```

## 2. Ticket

```text
Ticket ID: DOM-001-TICKET-006
Ticket path: docs/tickets/SPEC-DOM-001/DOM-001-TICKET-006-ticket-aggregate-transitions.md
Implementation Unit: DOM-IMP-06 — Ticket states and functional transitions
Portfolio Obligations: O-012, O-013
Requirements: DOM-TICKET-001, DOM-TICKET-002
Gap IDs: GAP-014, GAP-015
Acceptance IDs: AC-DOM-012, AC-DOM-013
```

## 3. Implementation Responsibility

Implement the DOM-owned ticket aggregate that validates the six functional
states, exactly eight authorized transitions, terminality, linked continuation,
stale revisions, and no-effect rejection.

## 4. Repository Architecture Context

`src/domain` owns value objects, aggregate invariants, lifecycle decisions, and
canonical rejection semantics. `src/application` loads aggregates, coordinates
commands, invokes domain transitions, and persists through ports. No concrete
persistence or foreign execution dependency exists in the productive source;
`tests` supplies contract fixtures and direct behavior evidence.

## 5. Existing Repository Context

| Existing Component | Classification | Current Responsibility | Design Use |
|---|---|---|---|
| `CanonicalIdentityReference` | REUSE | canonical identity and revision attachment | `TicketId` uses the same identity boundary |
| `PipelineRevision` | REUSE | non-negative aggregate concurrency revision | ticket revision may use an equivalent ticket-specific value object |
| `WorkflowPipeline` transition pattern | REUSE | immutable proposed transition with expected revision | structural precedent, not shared lifecycle authority |
| `PipelineRepository` port pattern | REUSE | load and CAS-style persistence contract | define ticket repository port locally |
| `CanonicalCommandBoundary` | INTEGRATE | command correlation, rejection recording, policy orchestration | optional application command seam; no ticket rules moved into it |
| prototype ticket scenarios | DO_NOT_TOUCH | non-authoritative scenario reference | test inspiration only |

## 6. Domain Model Assessment

```text
DOMAIN_CONCEPTS = Ticket, TicketId, TicketFunctionalState, TicketTransition,
  TicketTransitionAuthorization, TicketTransitionRecord, TicketRevision
AGGREGATE_ROOTS = 1 (Ticket)
ENTITIES = 0 beyond Ticket root
VALUE_OBJECTS = 4 (TicketId, TicketRevision, TransitionId, ContinuationTicketId)
DOMAIN_SERVICES = 0
DOMAIN_POLICIES = 1 (TicketTransitionPolicy)
DOMAIN_EVENTS = 1 optional accepted transition/rejection record boundary
APPLICATION_USE_CASES = 1 (TicketTransitionHandler)
REPOSITORY_ABSTRACTIONS = 1 (TicketRepository)
ANTI_CORRUPTION_BOUNDARIES = 1 for non-DOM execution outcome mapping
```

The aggregate is behavior-rich: callers cannot assign functional state, reopen a
terminal ticket, skip a transition, or bypass the expected revision.

## 7. UPSTREAM_AUTHORITY_PRECONDITIONS

```text
IDENTITY = COMPLETE; Component SPEC §12.2 and ADR-0001; TicketId is scoped to the DOM ticket aggregate
LIFECYCLE = COMPLETE; ADR-0002 ticket table and SPEC DOM-TICKET-001/002
PERSISTENCE_RECOVERY = COMPLETE boundary; DOM validates meaning, PLAT stores/replays accepted material
REHYDRATION = COMPLETE; persisted state requires canonical identity and accepted transition provenance
CONCURRENCY = COMPLETE; expected functional revision and stale rejection are required by TICKET-006
IDEMPOTENCY = COMPLETE; duplicate transition/retry preserves the accepted result and state
OWNERSHIP = COMPLETE; DOM owns functional ticket state; EXEC operational state remains foreign
CROSS_SPEC_DEPENDENCIES = COMPLETE; EXEC outcome mapping is integrated-only and cannot create ticket lifecycle
AUTHORITY_CONSUMPTION_PROOFS = ACP-DOM-06 and ticket §14a
PRODUCER_CONSUMER_CONTRACT_PROOFS = PCP-EXEC-02 and ticket §14b
TEMPORAL_AUTHORITY_PROOF = preserved from Plan DOM-IMP-06; revalidate ticket state/revision at commit
SPEC_IMPLEMENTABILITY_CHECK = PASS
PROHIBITED_NORMATIVE_DECISIONS = NONE
```

## 8. Aggregate / Consistency Boundaries

| Aggregate | Root | Invariants | Transaction / Consistency Boundary | External References |
|---|---|---|---|---|
| Ticket | `Ticket` | six states; eight transitions; terminality; linked continuation; revision continuity | one transition command and one expected-revision persistence operation | optional execution outcome reference, never lifecycle authority |

`Ticket` returns an immutable proposed state plus transition provenance. The
repository performs durable atomic enforcement; it does not decide whether a
transition is meaningful.

## 9. Responsibility Decomposition

| Responsibility | Authority | State Owned | Expected Test Surface |
|---|---|---|---|
| Ticket identity/revision | ADR-0002/SPEC | `TicketId`, functional revision | identity and stale tests |
| State vocabulary | DOM-TICKET-001 | functional state | create/rehydrate negative tests |
| Transition policy | DOM-TICKET-002 | allowed edge and condition | complete eight-edge matrix |
| Aggregate mutation | Ticket root | proposed state/provenance | terminality, continuation, no-effect tests |
| Persistence coordination | application handler/repository port | CAS result | stale and idempotency adapter tests |
| Foreign outcome mapping | ACL/adapter boundary | external outcome reference only | mapping contract tests |

## 10. Proposed Components

| Component | Type | Responsibility | Existing/New | Expected Location | Size |
|---|---|---|---|---|---|
| `TicketId` | VALUE_OBJECT | validate canonical TICKET identity | New | `src/domain/ticket.ts` | SMALL |
| `TicketRevision` | VALUE_OBJECT | compare expected functional revision | New | `src/domain/ticket.ts` | SMALL |
| `TicketFunctionalState` | VALUE_OBJECT | expose six canonical states | New | `src/domain/ticket.ts` | SMALL |
| `TicketTransitionPolicy` | DOMAIN_POLICY | authorize exactly eight transitions | New | `src/domain/ticket.ts` | MEDIUM |
| `Ticket` | AGGREGATE_ROOT | enforce state, terminality, continuation, and immutable proposals | New | `src/domain/ticket.ts` | MEDIUM |
| `TicketRepository` | REPOSITORY | load and atomically persist accepted transition | New | `src/domain/ticket.ts` | SMALL |
| `TicketTransitionHandler` | APPLICATION_SERVICE | load, invoke, persist, map result | New | `src/application/ticket.ts` | MEDIUM |
| ticket transition tests | TEST_SUPPORT | direct matrix and negative evidence | New | `tests/dom-001-ticket-006.test.ts` | MEDIUM |

`Ticket` OWNS lifecycle invariants; COLLABORATES_WITH `TicketTransitionPolicy`
and `TicketRepository`; MUST_NOT_OWN persistence technology, EXEC state, or
transport. `TicketTransitionHandler` OWNS orchestration only; it MUST_NOT_OWN
transition rules. `TicketRepository` OWNS storage/CAS only; it MUST_NOT_OWN
semantic lifecycle decisions.

## 11. SOLID Assessment

| Component | SRP | OCP | LSP | ISP | DIP | Result |
|---|---|---|---|---|---|---|
| `Ticket` | one lifecycle reason | no speculative extension | N/A | N/A | domain-only | PASS |
| `TicketTransitionPolicy` | transition authorization only | closed normative table is intentional | N/A | narrow | no infra | PASS |
| `TicketTransitionHandler` | orchestration only | no extension needed | N/A | narrow repository/mapper ports | depends on ports | PASS |
| `TicketRepository` | storage contract only | N/A | N/A | cohesive load/advance/rehydrate | inversion seam | PASS |

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
TicketTransitionHandler → TicketRepository port
TicketTransitionHandler → Ticket aggregate/policy
Ticket aggregate/policy → no application or infrastructure module
Infrastructure adapter → TicketRepository port
Foreign EXEC mapping → application boundary only
```

```text
DEPENDENCY_DIRECTION_VIOLATIONS = 0
INFRASTRUCTURE_LEAKAGE_POINTS = 0
```

## 13. Invariant Placement

| Invariant | Domain Enforcement | Durable Protection | Application Guard | Test |
|---|---|---|---|---|
| exactly six states | `TicketFunctionalState`/`Ticket` | persisted material validation | input normalization | state negative tests |
| exactly eight edges | `TicketTransitionPolicy` | accepted provenance/CAS | handler invokes aggregate only | full transition matrix |
| terminality | `Ticket` | immutable terminal record | no reopen command mapping | terminal negative test |
| linked continuation | `Ticket` and continuation value object | linked provenance | require reference in command | continuation test |
| stale/no-effect | expected revision and immutable proposal | atomic repository advance | map stale outcome | stale/concurrency test |

```text
UNPLACED_DOMAIN_INVARIANTS = 0
```

## 14. Persistence Design

Use a `TicketRepository` port with `find`, `advance(proposed, expectedRevision)`,
and an accepted transition-provenance read for rehydration. The domain revision
is separate from the physical storage revision. Durable CAS/journal integrity
is PLAT-owned. Rehydration validates canonical identity, state, revision, and
ordered accepted transition history before materializing a non-initial state.
No generic update/setter API is exposed. Recovery fails closed on unknown state,
missing predecessor, skipped edge, duplicate record, stale revision, or terminal
mutation.

## 15. Lifecycle Design

```text
STATES = DRAFT, READY, IMPLEMENTED, COMPLETED, BLOCKED, CANCELLED
INITIAL_STATE = DRAFT
TERMINAL_STATES = COMPLETED, CANCELLED
TRANSITIONS = exactly the eight rows in ADR-0002 / DOM-TICKET-002
TRANSITION_OWNER = Ticket aggregate and TicketTransitionPolicy
INVALID_TRANSITIONS = every unlisted edge; reject with no mutation
RECOVERY_TRANSITIONS = only accepted persisted provenance; no synthetic transition
TERMINAL_TRANSITIONS = none from COMPLETED/CANCELLED
PERSISTENCE_GUARD = expected ticket revision plus accepted provenance
BYPASS_PATHS_FORBIDDEN = setters, public mutable state, repository lifecycle decisions
```

## 16. Cross-Spec Integration

| Foreign Owner | Contract | Local Integration Point | ACL | Forbidden Local Ownership |
|---|---|---|---|---|
| SPEC-EXEC-002 | `PCP-EXEC-02` execution outcome consumes canonical ticket state | application outcome mapper | explicit outcome mapper | scheduler/session/operational lifecycle |
| SPEC-PLAT-001 | durable record/CAS boundary | repository adapter | persistence adapter | ticket meaning or transition validity |

`ACP-DOM-06`, `PCP-EXEC-02`, and the ticket's temporal proof preserve producer,
consumer, returned state, revision, failure, and availability semantics. Foreign
capabilities are integrated-only and non-blocking for local closure.

## 17. Main Interaction Flow

1. Handler parses ticket identity, command, correlation, and expected revision.
2. Repository resolves the aggregate and accepted provenance.
3. `TicketTransitionPolicy` validates the exact edge and command condition.
4. `Ticket` returns an immutable proposed aggregate and provenance record.
5. Repository atomically persists against expected revision.
6. Handler returns accepted state or canonical rejection without mutation.

## 18. Failure / Recovery Flow

Unknown identity, unknown state, invalid edge, terminal mutation, missing
continuation, duplicate transition, and stale revision are detected at the
aggregate/port boundary and return canonical rejection with unchanged state.
Retry uses the transition correlation/idempotency key. Recovery rehydrates only
from accepted ordered provenance. DOM owns failure meaning; PLAT owns durable
atomicity and replay.

```text
CALLER_AS_AUTHORITY_CHECK = PASS; caller state is a request, never canonical truth
TEMPORAL_AUTHORITY_PROOF = PASS; state/revision is revalidated at commit
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
| six states | DOMAIN_INVARIANT | `Ticket.create/rehydrate` | valid six states; unknown/forged state rejects |
| eight transitions | STATE_TRANSITION | `Ticket.transition` | all eight edges succeed; arbitrary edge rejects |
| terminality/continuation | NEGATIVE_BEHAVIOR | `Ticket.transition` | terminal mutation and unlinked continuation reject |
| stale/idempotency/concurrency | CONCURRENCY / IDEMPOTENCY | handler + repository port | one winner, stale loser, exact retry no extra transition |
| recovery | RECOVERY | rehydration authority | ordered history restores; skip/duplicate/detached state rejects |
| EXEC mapping | CROSS_SPEC | application mapper | outcome does not mutate ticket lifecycle |

### ACCEPTANCE_WITNESS_MATRIX

| NORMATIVE_BEHAVIOR | NORMATIVE_VERB | CONCRETE_OPERATION_COMMAND_OR_QUERY | STATE_OR_TRANSITION_AFFECTED | DIRECT_POSITIVE_TEST | DIRECT_NEGATIVE_OR_ISOLATION_TEST | EXPECTED_EVIDENCE_FILE | EVIDENCE_TYPE | ACCEPTANCE_OWNER | REQUIRED_PRODUCER_OR_CAPABILITY | AUTHORITY_STATUS | CONTRACT_STATUS | LOCAL_TESTABILITY | PRODUCTIVE_AVAILABILITY | CAPABILITY_SUMMARY_STATUS | DEPENDENCY_CLASS | WITNESS_EXECUTABLE_AT_LOCAL_CLOSURE |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Six-state aggregate | accepts exact states | ticket create/rehydrate | functional state | `T6-AC1-P` six state fixtures | `T6-AC1-N` unknown/forged state | `evidence/TICKET-006/AC-DOM-012-states.md` | LOCAL_TEST_EVIDENCE | TICKET-006 | local Ticket aggregate | DEFINED | DEFINED | YES | YES | CONTRACT_PRODUCTIVELY_AVAILABLE | LOCAL_IMPLEMENTATION | YES |
| Eight transitions | executes exactly | ticket transition command | transition edge | `T6-AC2-P` eight-edge matrix | `T6-AC2-N` invalid/duplicate/stale edge | `evidence/TICKET-006/AC-DOM-013-transitions.md` | LOCAL_TEST_EVIDENCE | TICKET-006 | local Ticket aggregate | DEFINED | DEFINED | YES | YES | CONTRACT_PRODUCTIVELY_AVAILABLE | LOCAL_IMPLEMENTATION | YES |
| Continuation/terminality | requires/rejects | continuation/transition command | terminal/successor state | `T6-AC3-P` linked continuation | `T6-AC3-N` terminal mutation/unlinked continuation | `evidence/TICKET-006/AC-DOM-012-terminality.md` | LOCAL_TEST_EVIDENCE | TICKET-006 | local Ticket aggregate | DEFINED | DEFINED | YES | YES | CONTRACT_PRODUCTIVELY_AVAILABLE | LOCAL_IMPLEMENTATION | YES |

```text
DESIGN_TEST_COVERAGE_GATE = PASS
```

## 21. Structural Risk Assessment

```text
GOD_COMPONENT_RISK = LOW
OVERSIZED_FILE_RISK = LOW
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

## 22. Implementation Sequence

1. Add ticket value objects and exact state vocabulary; test invalid shapes.
2. Add transition policy and immutable aggregate proposals; run all eight edge
   and terminality tests.
3. Add provenance/revision rehydration validation; run skip/duplicate/stale
   recovery tests.
4. Add repository/application ports and handler; run CAS, retry, and mapping
   tests.
5. Run the full T006 suite and affected regressions; no upstream or foreign
   lifecycle code is changed.

## 23. Files Expected to Change

| Path / Area | Classification | Reason |
|---|---|---|
| `src/domain/ticket.ts` | EXPECTED_CREATE | ticket aggregate, policy, value objects, ports |
| `src/application/ticket.ts` | EXPECTED_CREATE | application transition orchestration |
| `tests/dom-001-ticket-006.test.ts` | EXPECTED_CREATE | direct acceptance and negative tests |
| `src/domain/*` existing | MUST_NOT_MODIFY unless required local export support | preserve existing aggregates |
| ADR/SPEC/Gap/Plan/audits | MUST_NOT_MODIFY | upstream authority |
| `prototype/` | MUST_NOT_MODIFY | prototype owns its tooling |

## 24. Open Questions / Blockers

```text
NONE
```

## 25. Design Metrics

```text
RESPONSIBILITIES = 6
DOMAIN_CONCEPTS = 8
AGGREGATE_ROOTS = 1
ENTITIES = 0
VALUE_OBJECTS = 4
DOMAIN_SERVICES = 0
APPLICATION_SERVICES = 1
PORTS = 1
ADAPTERS = 1
ANTI_CORRUPTION_LAYERS = 1
PROPOSED_COMPONENTS = 8
CRITICAL_INVARIANTS = 5
UNPLACED_DOMAIN_INVARIANTS = 0
TEST_SURFACES = 6
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
