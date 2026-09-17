# SPEC-DOM-001 — Independent Implementation Plan Audit: command-authority producer

## Verdict

```text
VERDICT = IMPLEMENTATION_PLAN_CONFORMANT
ISSUE_DECOMPOSITION_GATE = READY_FOR_ISSUE_DECOMPOSITION
AUDIT_MODE = INDEPENDENT / READ_ONLY / ADR_FIRST / GAP_DRIVEN / DAG_AWARE
```

The amended Plan introduces `DOM-IMP-13` as the legitimate productive
producer/composition unit for `CAP-DOM-COMMAND-AUTHORITY-OBSERVATION`. The
capability is not promoted by this audit. T005 remains execution-blocked while
the capability is unavailable.

## Baseline

```text
AUDIT_HEAD = 6b31bcee1591c8b2e6499a434950664077b2be01
WORKING_TREE = DIRTY; unrelated user changes preserved
PLAN_SHA256 = 388F5F0797C291887E3C0005845CCDFD0E2DBF83DDD5EAA38385121F98D9184F
CURRENT_PRODUCTIVE_COMMAND_READER = NOT_FOUND
TEST_DOUBLES = PRESENT_IN_TESTS_ONLY
```

The prior Plan audit `reaudit-003` correctly identified the unresolved
producer. This audit evaluates the corrected decomposition and does not reuse
the prior blocked verdict as evidence of conformance.

## 1. Normative authority reconstruction

```text
ADR-0002 → O-011 → DOM-CMD-001 → GAP-011/GAP-012
CANONICAL_OWNER = SPEC-DOM-001 / DOM
```

`DOM-CMD-001` requires validation against canonical identity, revision, and
state, with closed dependency and compatible verdict preconditions, and
fail-closed rejection. The SPEC makes DOM the semantic owner. It does not name
T003 or any ADR reader as the command producer.

## 2. Candidate unit audit

| Candidate | Normative scope | Complete command authority? | Decision |
| --- | --- | --- | --- |
| DOM-IMP-01 | canonical identity and lineage | identity only; no command precondition/freshness composition | not producer |
| DOM-IMP-02 | manual entry, snapshot, eligibility | snapshot/ADR eligibility consumer; not command reader | not producer |
| DOM-IMP-03 / T003 | ADR lifecycle, revision, immutability | ADR reference/status/revision/hash only | explicitly excluded |
| DOM-IMP-04 | pipeline state/provenance | stage/revision/provenance inputs only | input boundary |
| DOM-IMP-05 / T005 | command validation and failure meaning | consumer/policy; current code consumes the port | consumer |
| DOM-IMP-06–12 | ticket, publication, advancement, audit, conformance | later consumers or unrelated lifecycle | not producer |
| DOM-IMP-13 / T013 | productive command-authority observation composition | complete reader contract and freshness/re-read seam | producer |

No existing unit could absorb the complete capability without either false
scope expansion or authority duplication. DOM-IMP-13 is therefore a valid new
unit, not a merge into T003 and not an artificial T005 implementation.

## 3. Capability audit

```text
CAPABILITY = CAP-DOM-COMMAND-AUTHORITY-OBSERVATION
AUTHORITY_OWNER = SPEC-DOM-001 / DOM
PRODUCER = DOM-IMP-13 / DOM-001-TICKET-013
CONSUMER = DOM-IMP-05 / DOM-001-TICKET-005
CONTRACT = CommandAuthorityReader.observe → CommandAuthorityObservation | undefined
DEPENDENCY_CLASS = REQUIRED_FOR_LOCAL_EXECUTION
CONTRACT_AVAILABLE = YES
LOCAL_TESTABILITY_AVAILABLE = YES
PRODUCTIVE_IMPLEMENTATION_AVAILABLE = NO
PRODUCTIVE_COMPOSITION_AVAILABLE = NO
INTEGRATED_PROOF_AVAILABLE = NO
LOCAL_CLOSURE_BLOCKING = YES for T005
```

The contract requires canonical stage identity, aggregate revision/stage,
complete SPEC/revision/dependency/verdict evidence, and dependency/verdict
freshness. Unknown, missing, stale, superseded, revoked, invalidated, or
inconsistent evidence fails closed. No default, caller claim, fixture, mock,
fake, or ADR-only reader can satisfy the capability.

## 4. Unit and ticket decomposition audit

`DOM-IMP-13` has an independent objective, boundary, output capability,
acceptance criteria, tests, evidence, and promotion gate. Its only productive
predecessors are identity and pipeline-state boundaries represented by
DOM-IMP-01 and DOM-IMP-04. It does not own their semantics, ADR authority, or
T005 policy.

```text
DOM-IMP-13 = ISSUE_READY / execution READY
DOM-IMP-05 = ISSUE_READY / execution BLOCKED until promotion
TICKET-013 = READY
TICKET-005 = BLOCKED
```

The ticket is independently implementable, but its capability is deliberately
not marked productively available before its implementation, runtime wiring,
fresh reread evidence, independent audit, and promotion record.

## 5. DAG audit

```text
DOM-IMP-01 → DOM-IMP-04 → DOM-IMP-13 → DOM-IMP-05 → downstream command tickets
DOM-IMP-03 → DOM-IMP-02 remains the separate ADR-authority edge
DOM-IMP-03 → DOM-IMP-05 = FORBIDDEN / ABSENT
DAG_CYCLE_DETECTED = NO
PRODUCER_BEFORE_CONSUMER = YES
T005_EXECUTION_READY = NO
DOWNSTREAM_PROMOTION_THROUGH_T005 = NO
```

The new edge corresponds to a real consumed capability, not a topological
placeholder. Capability promotion is a separate gate from ticket creation.

## 6. Evidence and promotion audit

The Plan and T013 require:

- productive implementation evidence;
- non-test runtime composition evidence;
- complete first observation and independent second observation;
- stale, superseded, revoked, invalidated, dependency, verdict, and caller-
  authority negative evidence;
- producer audit at the exact implementation baseline;
- `PROMO-DOM-COMMAND-AUTHORITY-01` before T005 local closure;
- fresh T005 audit evidence after composition.

No downstream capability is promoted by this Plan audit.

## 7. Findings

```text
CRITICAL_FINDINGS = 0
MAJOR_FINDINGS = 0
MINOR_FINDINGS = 0
UNRESOLVED_PRODUCER_IDENTITY = 0
WRONG_OWNER_ASSIGNMENT = 0
FALSE_UNIT_MERGE = 0
FALSE_UNIT_SPLIT = 0
MISSING_PRODUCER_EDGE = 0
PREMATURE_T005_READINESS = 0
DOWNSTREAM_PROMOTION_WITHOUT_EVIDENCE = 0
```

The remaining state is an execution/promotion blocker, not a Plan
decomposition defect:

```text
REMAINING_BLOCKER = TICKET-013 implementation and capability promotion
T005_LOCAL_CLOSURE = NO
IMA-MAJOR-004 = OPEN until fresh T005 evidence exists
```

## 8. Audit conclusion

The Plan now correctly represents the producer → consumer relationship,
preserves T003's ADR-only responsibility, keeps T005 blocked while productive
availability is `NO`, and provides a decomposed producer ticket with an
evidence-backed promotion gate. The Plan is conformant for issue
decomposition; implementation and capability promotion remain outstanding.
