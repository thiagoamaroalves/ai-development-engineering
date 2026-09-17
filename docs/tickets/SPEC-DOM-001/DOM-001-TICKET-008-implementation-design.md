# DOM-001-TICKET-008 — Implementation Design

## 1. Design Verdict

```text
IMPLEMENTATION_DESIGN_READY
```

## 2. Ticket

```text
Ticket ID: DOM-001-TICKET-008
Ticket path: docs/tickets/SPEC-DOM-001/DOM-001-TICKET-008-audit-cycle-verdict.md
Implementation Unit: DOM-IMP-08 — Audit-cycle identity and structured verdict closure
Portfolio Obligations: O-049, O-050
Requirements: DOM-AUDIT-001, DOM-AUDIT-002
Gap IDs: GAP-017, GAP-018
Acceptance IDs: AC-DOM-049, AC-DOM-050
```

## 3. Implementation Responsibility

Implement the DOM-owned artifact/cycle/round identity and structured-verdict
closure boundary, rejecting implicit reuse, skipped or duplicate rounds,
remediation-only closure, empty findings, and process termination as approval.

## 4. Repository Architecture Context

`src/domain` owns audit-cycle identity, round ordering, structured verdict
meaning, and fail-closed closure rules. `src/application` coordinates cycle and
verdict commands through repository ports. EXEC owns agent/session/assignment
lifecycle; PLAT owns durable journal/replay. No process exit or operational
assignment is a DOM approval signal.

## 5. Existing Repository Context

| Existing Component | Classification | Current Responsibility | Design Use |
|---|---|---|---|
| `CanonicalIdentityReference` | REUSE | canonical identity and revision | cycle/artifact identity attachment |
| `PipelineRevision` | REUSE | immutable revision comparison | cycle revision/concurrency precedent |
| `CanonicalCommandBoundary` | INTEGRATE | correlation and rejection recording | application command seam only |
| `WorkflowPipeline` rehydration proof | REUSE PATTERN | accepted provenance validation | cycle history validation precedent |
| prototype audit scenarios | DO_NOT_TOUCH | non-authoritative examples | direct test inspiration only |

## 6. Domain Model Assessment

```text
DOMAIN_CONCEPTS = ArtifactCycle, ArtifactCycleId, AuditRound, StructuredVerdict,
  AuditEvidenceReference, AuditAssignmentReference
AGGREGATE_ROOTS = 1 (ArtifactCycle)
ENTITIES = 1 (AuditRound)
VALUE_OBJECTS = 5 (ArtifactCycleId, ArtifactRevision, RoundOrdinal, VerdictId, EvidenceReference)
DOMAIN_SERVICES = 0
DOMAIN_POLICIES = 2 (RoundSequencePolicy, StructuredVerdictPolicy)
DOMAIN_EVENTS = 1 cycle-closed/round-recorded fact boundary
APPLICATION_USE_CASES = 1 (AuditCycleCommandHandler)
REPOSITORY_ABSTRACTIONS = 1 (AuditCycleRepository)
ANTI_CORRUPTION_BOUNDARIES = 1 for EXEC activity/session evidence
```

The cycle aggregate owns exact artifact/revision attachment and structured
closure; it does not own execution assignments, remediation execution, or
physical persistence.

## 7. UPSTREAM_AUTHORITY_PRECONDITIONS

```text
IDENTITY = COMPLETE; ADR-0009 and SPEC audit-cycle identity contract
LIFECYCLE = COMPLETE; DOM-AUDIT-001/002; explicit cycle and structured verdict closure
PERSISTENCE_RECOVERY = COMPLETE boundary; PLAT preserves records, DOM validates semantic history
REHYDRATION = COMPLETE; cycle/artifact/revision/round history must be attached and ordered
CONCURRENCY = COMPLETE; cycle revision and round identity revalidate at closure
IDEMPOTENCY = COMPLETE; duplicate round/verdict command cannot create a second closure
OWNERSHIP = COMPLETE; DOM owns cycle/verdict meaning; EXEC owns activity/session/assignment
CROSS_SPEC_DEPENDENCIES = COMPLETE; PCP-EXEC-04 activity/session evidence is integrated-only
AUTHORITY_CONSUMPTION_PROOFS = ACP-DOM-08 and ticket §14a
PRODUCER_CONSUMER_CONTRACT_PROOFS = PCP-EXEC-04 and ticket §14b
TEMPORAL_AUTHORITY_PROOF = preserved from Plan DOM-IMP-08; artifact/revision/cycle is revalidated at closure
SPEC_IMPLEMENTABILITY_CHECK = PASS
PROHIBITED_NORMATIVE_DECISIONS = NONE
```

## 8. Aggregate / Consistency Boundaries

| Aggregate | Root | Invariants | Transaction / Consistency Boundary | External References |
|---|---|---|---|---|
| Artifact audit cycle | `ArtifactCycle` | exact artifact/revision attachment; unique ordered rounds; structured verdict only; no implicit approval | one cycle command/round append/close command with expected cycle revision | EXEC activity/session evidence reference, never cycle authority |
| Audit round | `AuditRound` within cycle | explicit ordinal, audit/remediation evidence relation, no skipped/duplicate round | append-only round record inside cycle | assignment/session IDs from EXEC are foreign references |

## 9. Responsibility Decomposition

| Responsibility | Authority | State Owned | Expected Test Surface |
|---|---|---|---|
| Cycle identity | DOM-AUDIT-001 | artifact/revision/cycle reference | distinct identity and attachment tests |
| Round sequence | DOM-AUDIT-001 | ordered round ordinal/history | skipped/duplicate/reuse negatives |
| Verdict structure | DOM-AUDIT-002 | structured result/evidence | exact verdict schema tests |
| Closure authority | DOM-AUDIT-002 | OPEN/CLOSED cycle state | remediation/empty/termination rejection |
| EXEC evidence mapping | PCP-EXEC-04 | activity/session reference | foreign mapping isolation |
| Persistence/recovery | PLAT boundary | accepted cycle history | rehydration/replay contract tests |

## 10. Proposed Components

| Component | Type | Responsibility | Existing/New | Expected Location | Size |
|---|---|---|---|---|---|
| `ArtifactCycleId` / `ArtifactRevision` | VALUE_OBJECT | exact artifact attachment | New | `src/domain/audit-cycle.ts` | SMALL |
| `RoundOrdinal` / `VerdictId` | VALUE_OBJECT | ordered round and verdict identity | New | `src/domain/audit-cycle.ts` | SMALL |
| `StructuredVerdict` | VALUE_OBJECT | validate structured closure result | New | `src/domain/audit-cycle.ts` | MEDIUM |
| `RoundSequencePolicy` | DOMAIN_POLICY | reject skipped/duplicate/reused rounds | New | `src/domain/audit-cycle.ts` | MEDIUM |
| `StructuredVerdictPolicy` | DOMAIN_POLICY | reject non-structured/empty/remediation-only closure | New | `src/domain/audit-cycle.ts` | MEDIUM |
| `ArtifactCycle` | AGGREGATE_ROOT | own rounds, evidence, state and closure | New | `src/domain/audit-cycle.ts` | LARGE/cohesive |
| `AuditCycleRepository` | REPOSITORY | load/append/close with expected revision | New | `src/domain/audit-cycle.ts` | SMALL |
| `AuditCycleCommandHandler` | APPLICATION_SERVICE | orchestrate cycle commands | New | `src/application/audit-cycle.ts` | MEDIUM |
| `ExecAuditEvidenceMapper` | ACL | map activity/session evidence without lifecycle transfer | New | `src/application/audit-cycle.ts` | SMALL |
| audit-cycle tests | TEST_SUPPORT | direct identity, round, verdict, recovery tests | New | `tests/dom-001-ticket-008.test.ts` | MEDIUM |

`ArtifactCycle` OWNS cycle/round/verdict semantics; collaborates with the two
policies and repository; must not own EXEC assignment/session lifecycle or
physical storage. `StructuredVerdictPolicy` must not decide audit execution
results. The handler owns orchestration only.

## 11. SOLID Assessment

| Component | SRP | OCP | LSP | ISP | DIP | Result |
|---|---|---|---|---|---|---|
| `ArtifactCycle` | one cycle lifecycle reason | fixed normative closure | N/A | N/A | domain-only | PASS |
| `RoundSequencePolicy` | round ordering only | no speculative extension | N/A | narrow | domain-only | PASS |
| `StructuredVerdictPolicy` | verdict shape/closure only | no plugin hierarchy | N/A | narrow | domain-only | PASS |
| `AuditCycleCommandHandler` | command orchestration | no hypothetical extension | N/A | narrow ports | depends on ports | PASS |
| `ExecAuditEvidenceMapper` | foreign mapping only | explicit contract | N/A | narrow | application boundary | PASS |

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
AuditCycleCommandHandler → AuditCycleRepository port
AuditCycleCommandHandler → ArtifactCycle/policies
ExecAuditEvidenceMapper → local evidence references
Audit-cycle domain → no EXEC session SDK, process control, or persistence technology
Infrastructure → repository port
```

```text
DEPENDENCY_DIRECTION_VIOLATIONS = 0
INFRASTRUCTURE_LEAKAGE_POINTS = 0
```

## 13. Invariant Placement

| Invariant | Domain Enforcement | Durable Protection | Application Guard | Test |
|---|---|---|---|---|
| exact artifact/revision/cycle attachment | identity value objects and aggregate | persisted identity/history | handler resolves canonical reference | identity attachment test |
| no implicit cycle reuse | `ArtifactCycleId`/aggregate | unique accepted cycle record | repository duplicate result | reuse negative |
| ordered non-duplicate rounds | `RoundSequencePolicy` | append-only history | command ordinal validation | skip/duplicate tests |
| structured verdict only | `StructuredVerdictPolicy` | verdict evidence record | mapper preserves structure | verdict schema test |
| remediation/empty/termination cannot approve | aggregate/policy | cycle remains open | handler requires verdict command | closure negative |

```text
UNPLACED_DOMAIN_INVARIANTS = 0
```

## 14. Persistence Design

`AuditCycleRepository` provides load, append-round, and close operations with an
expected cycle revision. Accepted round/verdict history is append-only and
replayed through the aggregate. The domain revision is separate from PLAT
storage revision. Rehydration rejects wrong artifact/revision, reused cycle,
skipped/duplicate round, detached evidence, missing structured verdict, or
closed-cycle mutation. EXEC assignment/session data remains a correlated
foreign reference; it cannot create or close the cycle.

## 15. Lifecycle Design

```text
STATES = OPEN, CLOSED
INITIAL_STATE = OPEN
TRANSITIONS = OPEN → OPEN for accepted round append; OPEN → CLOSED for valid structured verdict
TRANSITION_OWNER = ArtifactCycle and policies
INVALID_TRANSITIONS = skipped/duplicate/reused round, wrong artifact/revision, empty/remediation-only/non-structured closure
RECOVERY_TRANSITIONS = ordered accepted cycle history only
TERMINAL_TRANSITIONS = CLOSED cannot receive rounds or another verdict
PERSISTENCE_GUARD = artifact/revision/cycle identity and expected cycle revision
BYPASS_PATHS_FORBIDDEN = process termination as approval, remediation command as verdict, direct closed-state setter
```

Round-limit pause/continuation is owned by TICKET-009 and is not duplicated in
this ticket.

## 16. Cross-Spec Integration

| Foreign Owner | Contract | Local Integration Point | ACL | Forbidden Local Ownership |
|---|---|---|---|---|
| SPEC-EXEC-002 | `PCP-EXEC-04` activity/session evidence reference | `ExecAuditEvidenceMapper` | explicit evidence mapper | assignment/session lifecycle or auditor eligibility |
| SPEC-PLAT-001 | durable journal/replay record | repository adapter | persistence boundary | cycle meaning, verdict, or approval |

`ACP-DOM-08`, `PCP-EXEC-04`, and the temporal proof preserve exact producer,
consumer, evidence, versions, failure behavior, and integrated-only availability.

## 17. Main Interaction Flow

1. Handler resolves exact artifact/revision and cycle identity.
2. Repository loads cycle and accepted round history.
3. `RoundSequencePolicy` validates the next round and evidence references.
4. `StructuredVerdictPolicy` validates closure input and required findings.
5. Aggregate returns append/close proposal or rejection.
6. Repository persists against expected cycle revision.

## 18. Failure / Recovery Flow

Unknown or reused cycle, wrong artifact/revision, skipped/duplicate round,
detached activity evidence, empty/remediation-only/non-structured verdict, or
process termination is rejected without closure mutation. Exact replay is
idempotent. Recovery replays accepted round history and cannot reopen or
synthesize a verdict.

```text
CALLER_AS_AUTHORITY_CHECK = PASS; caller assignment/evidence claims are verified references only
TEMPORAL_AUTHORITY_PROOF = PASS; artifact/revision/cycle and round state revalidate before closure
FAILURE_OWNER = DOM for cycle/verdict meaning; EXEC/PLAT for foreign activity/storage effects
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
| cycle identity | DOMAIN_INVARIANT | `ArtifactCycle.create` | distinct artifact/revision cycles; wrong attachment rejects |
| round sequence | STATE_TRANSITION / RECOVERY | `ArtifactCycle.appendRound` | explicit ordered round; skip/duplicate/reuse rejects |
| structured closure | NEGATIVE_BEHAVIOR | `ArtifactCycle.close` | exact structured verdict closes; remediation/empty/termination rejects |
| EXEC mapping | CROSS_SPEC | evidence mapper | assignment/session reference cannot close cycle |

### ACCEPTANCE_WITNESS_MATRIX

| NORMATIVE_BEHAVIOR | NORMATIVE_VERB | CONCRETE_OPERATION_COMMAND_OR_QUERY | STATE_OR_TRANSITION_AFFECTED | DIRECT_POSITIVE_TEST | DIRECT_NEGATIVE_OR_ISOLATION_TEST | EXPECTED_EVIDENCE_FILE | EVIDENCE_TYPE | ACCEPTANCE_OWNER | REQUIRED_PRODUCER_OR_CAPABILITY | AUTHORITY_STATUS | CONTRACT_STATUS | LOCAL_TESTABILITY | PRODUCTIVE_AVAILABILITY | CAPABILITY_SUMMARY_STATUS | DEPENDENCY_CLASS | WITNESS_EXECUTABLE_AT_LOCAL_CLOSURE |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Cycle identity | creates distinctly | cycle create/register command | artifact/revision/cycle identity | `T8-AC1-P` distinct exact identity | `T8-AC1-N` reuse/wrong artifact/revision rejects | `evidence/TICKET-008/AC-DOM-049-cycle.md` | LOCAL_TEST_EVIDENCE | TICKET-008 | local ArtifactCycle identity | DEFINED | DEFINED | YES | YES | CONTRACT_PRODUCTIVELY_AVAILABLE | LOCAL_IMPLEMENTATION | YES |
| Structured verdict closure | closes only with | verdict close command | cycle closure | `T8-AC2-P` exact structured verdict | `T8-AC2-N` empty/remediation/process termination rejects | `evidence/TICKET-008/AC-DOM-050-verdict.md` | LOCAL_TEST_EVIDENCE | TICKET-008 | local StructuredVerdictPolicy | DEFINED | DEFINED | YES | YES | CONTRACT_PRODUCTIVELY_AVAILABLE | LOCAL_IMPLEMENTATION | YES |

```text
DESIGN_TEST_COVERAGE_GATE = PASS
```

## 21. Structural Risk Assessment

```text
GOD_COMPONENT_RISK = LOW
OVERSIZED_FILE_RISK = MEDIUM; cohesive cycle aggregate with separate sequence/verdict policies
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

Mitigation for the medium file-size risk: keep cycle mutation cohesive while
isolating identity, sequence, and verdict policies; do not split the aggregate
or introduce an event bus.

## 22. Implementation Sequence

1. Add cycle/artifact/revision/round/verdict value objects; test exact identity.
2. Add ordered round policy and immutable append proposals; test skip/duplicate
   and rehydration failures.
3. Add structured verdict policy and closure boundary; test remediation/empty/
   termination negatives and terminality.
4. Add repository/application ports and EXEC evidence mapper; test session and
   assignment references cannot become cycle authority.
5. Run the full T008 suite and affected regressions.

## 23. Files Expected to Change

| Path / Area | Classification | Reason |
|---|---|---|
| `src/domain/audit-cycle.ts` | EXPECTED_CREATE | cycle aggregate, round/verdict policies, value objects, port |
| `src/application/audit-cycle.ts` | EXPECTED_CREATE | command orchestration and EXEC evidence mapping |
| `tests/dom-001-ticket-008.test.ts` | EXPECTED_CREATE | identity, round, verdict, recovery tests |
| EXEC/PLAT implementation | MUST_NOT_MODIFY | foreign ownership |
| ADR/SPEC/Gap/Plan/audits | MUST_NOT_MODIFY | upstream authority |
| `prototype/` | MUST_NOT_MODIFY | prototype boundary |

## 24. Open Questions / Blockers

```text
NONE
```

## 25. Design Metrics

```text
RESPONSIBILITIES = 6
DOMAIN_CONCEPTS = 7
AGGREGATE_ROOTS = 1
ENTITIES = 1
VALUE_OBJECTS = 5
DOMAIN_SERVICES = 0
APPLICATION_SERVICES = 1
PORTS = 1
ADAPTERS = 1
ANTI_CORRUPTION_LAYERS = 1
PROPOSED_COMPONENTS = 10
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
