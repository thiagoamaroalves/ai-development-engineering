# SPEC-DOM-001 — Independent Implementation Plan Re-audit 003

## 1. Audit Verdict

```text
VERDICT = IMPLEMENTATION_PLAN_BLOCKED_BY_UPSTREAM_AUTHORITY
ISSUE_DECOMPOSITION_GATE = NOT_READY_FOR_ISSUE_DECOMPOSITION
```

The Plan is materially safer than its prior state because T005 is no longer
represented as locally closable. It cannot be declared conformant: the
productive consumer contract requires `CAP-DOM-COMMAND-AUTHORITY-OBSERVATION`,
but the accepted authority chain does not identify a producer Unit/Ticket for
the complete observation.

## 2. Audit Mode and Baseline

```text
MODE = INDEPENDENT / READ_ONLY / ADR_FIRST / GAP_DRIVEN / DAG_AWARE
AUDIT_HEAD = 6b31bcee1591c8b2e6499a434950664077b2be01
CURRENT_HEAD = 6b31bcee1591c8b2e6499a434950664077b2be01
WORKING_TREE = DIRTY; current Plan, T005 ticket/design/index, source, tests, and evidence inspected
PLAN_SHA256 = ACE17E6B50BC0F52604B64402DFB58730715F2D41D202C1DBB1282551B8D4DE0
TICKET_005_SHA256 = 2596B877D3A03414926FCF393DB61BDF8978EA3B817D8073FB9EA35859C95392
BASELINE_DRIFT_STATUS = DRIFT_ASSESSED
REASSESSMENT_COMPLETE = YES
FINDINGS_ARE_ACTIONABLE = YES
```

The accepted ADRs, approved portfolio, component SPEC, and validated Gap
Matrix were re-read and no normative owner or dependency change was found.
The relevant repository drift is the dirty T005 implementation that consumes
`CommandAuthorityReader`.

## 3. Authority Reconstruction

```text
ADR-0002 → O-011 → DOM-CMD-001 → GAP-011/GAP-012 → DOM-IMP-05 → TICKET-005
CANONICAL_OWNER = SPEC-DOM-001 / DOM
```

`DOM-IMP-03/TICKET-003` is the producer only for
`CAP-DOM-ADR-AUTHORITY-READ-OBSERVATION` consumed by T002. Its evidence returns
ADR reference/lifecycle/revision/hash observations. It does not return command
SPEC/revision eligibility, dependency closure, verdict compatibility, or the
freshness tokens required by T005.

## 4. Capability Availability Audit

| Capability | Contract | Local testability | Productive implementation | Productive composition | Integrated proof | Class | Result |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `CAP-DOM-ADR-AUTHORITY-READ-OBSERVATION` | YES | YES | YES for ADR reader | YES for T003→T002 | producer evidence exists | REQUIRED_FOR_LOCAL_EXECUTION | valid only for T002 |
| `CAP-DOM-COMMAND-AUTHORITY-OBSERVATION` | YES | YES | NO | NO | NO | REQUIRED_FOR_LOCAL_EXECUTION | `BLOCKED_BY_UPSTREAM_CONTRACT` |

The command capability producer is `UNRESOLVED`; no Unit/Ticket may be named
from the current normative artifacts. A test double cannot promote it.

## 5. Gap and Plan Coverage Audit

`GAP-011` and `GAP-012` remain covered by DOM-IMP-05. No Gap identity or
classification changed. The defect is in the Plan's representation of the
producer/consumer and closure boundary: the previous Plan said T005 had no
required producer and was locally closable, while the implemented consumer
requires canonical observation evidence.

Classification:

```text
GAP_COVERAGE = PARTIALLY_REPRESENTED
AUTHORITY_CONSUMPTION_CONFORMANCE = FAIL
LOCAL_CLOSURE_CONFORMANCE = FAIL for DOM-IMP-05
ISSUE_DECOMPOSITION_READINESS = FAIL for DOM-IMP-05
```

## 6. Unit / Ownership Audit

DOM remains the sole semantic owner. No foreign lifecycle or authority was
assigned locally. `DOM-IMP-03` is not relabeled and no duplicate authority is
authorized. DOM-IMP-04 supplies pipeline state/revision material but is not
shown by the authority chain to own the complete command precondition,
dependency-closure, verdict, and freshness composition.

```text
OWNERSHIP_CONFORMANCE = PASS
CANONICAL_AUTHORITY_DUPLICATION = NO
WRONG_OWNER = NO
PRODUCER_ASSIGNMENT = UNRESOLVED
```

## 7. Acceptance / Local Closure Audit

The T005 command witnesses require the command-authority capability. They are
testable with doubles, but not locally provable at closure while productive
availability is `NO`.

```text
DOM-IMP-05_LOCAL_CLOSURE = NO
DOM-IMP-05_ISSUE_READINESS = PLAN_BLOCKED
WITNESSES_NOT_EXECUTABLE_AT_LOCAL_CLOSURE = 7
LOCAL_ACCEPTANCE_REQUIRES_PRODUCTIVE_CAPABILITY = YES
```

The normative acceptance criteria themselves were not weakened or removed.

## 8. Dependency / DAG Audit

The existing `DOM-IMP-04 → DOM-IMP-05` edge is necessary but insufficient.
Adding `DOM-IMP-03 → DOM-IMP-05` would be wrong because it would claim ADR
authority as command authority. The Plan now represents the unresolved
capability as an upstream blocker without creating a fake producer Unit/Ticket.

```text
PRODUCER_BEFORE_CONSUMER = NOT_PROVABLE
MISSING_PRODUCER_EDGE = YES, producer identity unresolved
WRONG_DOM-IMP-03_EDGE = AVOIDED
DAG_CYCLE_DETECTED = NO
T005_EXECUTION_READY = NO
T005_DOWNSTREAM_PROMOTION = NO
```

## 9. Integration Checkpoint / Evidence Audit

CP-DOM-02 cannot prove command convergence until the command-authority
composition is productively available. Existing local tests prove only the
contract boundary. There is no runtime registration, factory, adapter,
first-read/second-read evidence, freshness evidence from a productive source,
or capability promotion record for the command capability.

## 10. Repository Evidence / Reuse Audit

Read-only searches found:

```text
src/domain/command.ts: contract only
src/application/command.ts: consumer only
src/application/pipeline.ts: consumer only
tests/: InMemoryCommandAuthorityReader, SequenceCommandAuthorityReader
src: no implements CommandAuthorityReader, factory, registration, or composition
```

`EV-DOM-IMP-03-AUTHORITY-READER-COMPLETE` is not applicable to the command
capability and is not reused.

## 11. Findings

### CIPA-MAJOR-001 — T005 command-authority producer is absent from the decomposition

Severity: `MAJOR`  
Issue decomposition impact: `ISSUE_DECOMPOSITION_BLOCKING`  
Category: `UPSTREAM_CONTRACT / LOCAL_CLOSURE / DAG_STRUCTURE`

#### Authority

ADR: ADR-0002, command preconditions and no-effect rejection.  
Portfolio Obligation: O-011.  
Component Requirement: DOM-CMD-001.  
Gap: GAP-011, GAP-012.  
Approved Owner: SPEC-DOM-001 / DOM.

#### Plan location

Unit: DOM-IMP-05.  
Section: Authority/Ownership, Acceptance Witness Matrix, Local Closure,
Issue Decomposition Readiness, Capability Availability, DAG.

#### Plan claim

The former Plan treated command preconditions as a unit-owned seam with no
required producer and `LOCAL_CLOSURE=YES`.

#### Independent audit result

The productive implementation consumes `CommandAuthorityReader`; the only
implementations are test doubles. The complete command capability is defined
but not productively available. T005 must remain blocked.

#### Repository evidence

`src/domain/command.ts`, `src/application/command.ts`,
`src/application/pipeline.ts`, and the T005 authority-availability
reassessment evidence dated 2026-09-15.

#### Minimum correction required

Keep the capability explicit, preserve `REQUIRED_FOR_LOCAL_EXECUTION`, remove
the false local-closure/readiness claim, and obtain an upstream-authorized
producer Unit/Ticket before ticket execution. Do not assign DOM-IMP-03/T003,
promote fixtures, use defaults, or duplicate authority in T005.

#### Revalidation

Requires a fresh independent Plan audit after an authority-backed producer is
assigned and its productive composition evidence exists.

## 12. Dimensions

```text
AUTHORITY_CONFORMANCE = BLOCKED
AUTHORITY_CONSUMPTION_CONFORMANCE = FAIL
GAP_TO_PLAN_COVERAGE = FAIL
UNIT_JUSTIFICATION = BLOCKED
UNIT_GRANULARITY = PASS
OWNERSHIP_CONFORMANCE = PASS
DEPENDENCY_CONFORMANCE = BLOCKED
LOCAL_CLOSURE_CONFORMANCE = FAIL
ACCEPTANCE_ALLOCATION = FAIL
FINAL_PROOF_OWNERSHIP = PASS
TEST_STRATEGY = PASS for contract tests; BLOCKED for productive witness
COMPLETION_EVIDENCE = BLOCKED
DAG_CONFORMANCE = BLOCKED
ISSUE_DECOMPOSITION_READINESS = BLOCKED
```

## 13. Recalculated Metrics

```text
IMPLEMENTATION_UNITS = 12
LOCALLY_CLOSABLE_UNITS = 11
NON_LOCALLY_CLOSABLE_UNITS = 1
ISSUE_READY_UNITS = 11
PLAN_BLOCKED_UNITS = 1
INITIAL_READY_UNITS = 1
INITIAL_BLOCKED_UNITS = 11
LOCAL_CLOSURE_WITH_UNAVAILABLE_REQUIRED_CAPABILITY = 1
WITNESSES_NOT_EXECUTABLE_AT_LOCAL_CLOSURE = 7
UNREPRESENTED_UPSTREAM_CONTRACT_BLOCKERS = 1
READY_UNITS_WITH_UNAVAILABLE_CONTRACT = 0
UNAPPROVED_NORMATIVE_DEPENDENCIES = 0
FALSE_UNIT_SPLITS = 0
FALSE_UNIT_MERGES = 0
DAG_CYCLE_DETECTED = NO
CRITICAL_FINDINGS = 0
MAJOR_FINDINGS = 1
MINOR_FINDINGS = 0
INFO_FINDINGS = 0
```

## 14. Upstream Escalation

```text
BLOCKER = UPSTREAM_AUTHORITY_REVALIDATION_REQUIRED
CAPABILITY = CAP-DOM-COMMAND-AUTHORITY-OBSERVATION
PRODUCER = UNRESOLVED
PRODUCER_TICKET = UNRESOLVED
REQUIRED_ACTION = assign/authorize the canonical producer and productive composition, then produce independent runtime evidence
```

## 15. Completeness Proof

The audit distinguishes the ADR reader from the command reader, preserves
owner and failure semantics, proves local testability is not productive
availability, prevents an invalid producer edge, and leaves T005 and its
downstream tickets blocked. It does not claim Plan conformance or ticket
finalization.
