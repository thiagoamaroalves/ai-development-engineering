# SPEC-DOM-001 — Independent implementation-ticket audit: command-authority producer

## Verdict

```text
VERDICT = IMPLEMENTATION_TICKETS_CONFORMANT
TICKET_DECOMPOSITION_GATE = READY_FOR_IMPLEMENTATION_AUDIT
IMPLEMENTATION_EXECUTION_GATE = TICKET-013_READY / TICKET-005_BLOCKED
```

This audit independently checks the amended Plan handoff, the new producer
ticket, T005's updated dependency, the ticket index, and the affected DAG. It
does not implement code, promote a capability, close `IMA-MAJOR-004`, or
finalize T005.

## Baseline

```text
AUDIT_HEAD = 6b31bcee1591c8b2e6499a434950664077b2be01
WORKING_TREE = DIRTY; unrelated user changes preserved
PLAN_SHA256 = 388F5F0797C291887E3C0005845CCDFD0E2DBF83DDD5EAA38385121F98D9184F
TICKET_013 = DOM-001-TICKET-013-command-authority-observation.md
TICKET_005_STATUS = BLOCKED
```

Upstream Plan audit:
`docs/specs/implementation-plans/audits/SPEC-DOM-001-implementation-plan-audit-2026-09-15-command-authority-producer.md`,
verdict `IMPLEMENTATION_PLAN_CONFORMANT`.

## 1. Producer ticket conformance

TICKET-013 contains the required source traceability, objective, owner,
boundaries, produced contract, consumed boundaries, behavior, exclusions,
acceptance criteria, tests, evidence, promotion conditions, dependencies, and
handoff. Its scope is independently implementable and does not place command
validation inside the producer.

```text
TICKET-013_UNIT = DOM-IMP-13
TICKET-013_STATUS = READY
PRODUCES = CAP-DOM-COMMAND-AUTHORITY-OBSERVATION
DEPENDS_ON = TICKET-001, TICKET-004
PRECEDES = TICKET-005
TICKET-013_LOCAL_TESTABILITY = YES
TICKET-013_PRODUCTIVE_AVAILABILITY = NO before implementation
```

## 2. Authority and ownership

```text
CANONICAL_OWNER = SPEC-DOM-001 / DOM
NORMATIVE_SOURCE = ADR-0002 / O-011 / DOM-CMD-001
T003_COMMAND_PRODUCER = NO
T003_REMAINING_CAPABILITY = CAP-DOM-ADR-AUTHORITY-READ-OBSERVATION only
T005_REMAINING_ROLE = consumer/policy/rejection/no-effect semantics
```

The producer is a decomposition of the existing DOM-owned command authority
obligation. It does not add a normative portfolio dependency or transfer ADR,
pipeline, persistence, or transport ownership.

## 3. Capability handoff audit

| Dimension | Result |
| --- | --- |
| `CONTRACT_AVAILABLE` | YES |
| `LOCAL_TESTABILITY_AVAILABLE` | YES through contract tests only |
| `PRODUCTIVE_IMPLEMENTATION_AVAILABLE` | NO; T013 is not implemented |
| `PRODUCTIVE_COMPOSITION_AVAILABLE` | NO; no runtime implementation/registration exists yet |
| `INTEGRATED_PROOF_AVAILABLE` | NO |
| dependency class | `REQUIRED_FOR_LOCAL_EXECUTION` |
| local closure effect | T005 blocked |
| promotion record | `PROMO-DOM-COMMAND-AUTHORITY-01`, not yet created |

The index, T005, Plan, and T013 agree that fixtures and test readers cannot
promote this capability.

## 4. T005 audit handoff

```text
T005_STATUS = BLOCKED
T005_ISSUE_DECOMPOSITION_READINESS = ISSUE_READY
T005_LOCAL_CLOSURE = NO
T005_BLOCKED_BY = TICKET-013 capability promotion
IMA-MAJOR-004 = OPEN
T005_DOWNSTREAM_TICKETS = BLOCKED
```

T005 acceptance criteria are preserved. Their witness rows remain testable by
local doubles but not locally provable until the productive command-authority
capability is promoted. No acceptance criterion was weakened or removed.

## 5. Index and traceability audit

The new one-to-one mapping is present:

```text
DOM-IMP-13 → DOM-001-TICKET-013
GAP-011/GAP-012 → T013 producer slice + T005 semantic consumer
AC-DOM-011 → T013 producer evidence + T005 acceptance evidence
O-011 → T013 authority producer + T005 command semantics
```

The ticket index lists T013 in wave 3 as the next `READY` ticket and places
T005 in wave 4 behind the capability promotion gate. The pre-existing T003 →
T002 ADR edge is unchanged.

## 6. DAG audit

```text
TICKET-001 → TICKET-004 → TICKET-013 → TICKET-005 → TICKET-006/007/008
TICKET-003 → TICKET-002 remains separate
TICKET-003 → TICKET-005 = ABSENT
TICKET_GRAPH_CYCLE = NO
PRODUCER_BEFORE_CONSUMER = YES
READY_WITH_REQUIRED_CAPABILITY_UNAVAILABLE = NO
DOWNSTREAM_PROMOTION_WITHOUT_T005 = NO
```

The producer edge is capability-backed. T005 cannot be made ready merely by
the existence of T013; it requires the later promotion record and fresh
evidence.

## 7. Evidence audit

The producer ticket requires productive reader evidence, runtime composition,
complete observation, independent reread, stale/revoked/superseded/freshness
negative cases, producer audit, and a capability promotion record. The T005
handoff explicitly requires a fresh independent T005 audit after that evidence.

```text
PRODUCER_EVIDENCE_PRESENT = NO (ticket requirements only)
PROMOTION_EVIDENCE_PRESENT = NO
T005_REAUDIT_PRESENT = NO for the future promoted state
```

## 8. Findings

```text
CRITICAL_FINDINGS = 0
MAJOR_FINDINGS = 0
MINOR_FINDINGS = 0
TRACEABILITY_ERRORS = 0
WRONG_PRODUCER = 0
FALSE_TICKET_MERGE = 0
FALSE_TICKET_SPLIT = 0
HIDDEN_T005_BLOCKER = 0
PREMATURE_T005_READINESS = 0
```

The remaining blocker is intentional and explicit: implement and promote
TICKET-013 before executing T005.

## 9. Audit conclusion

The ticket decomposition is conformant for implementation-audit handoff. The
next execution step is TICKET-013. T005 remains `BLOCKED`,
`PRODUCTIVE_AVAILABILITY=NO`, and `IMA-MAJOR-004=OPEN`; no finalization is
authorized by this audit.
