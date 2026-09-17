# T009 — AC-DOM-051 Pause Evidence

```text
EVIDENCE_ID: T9-AC1
TICKET: DOM-001-TICKET-009
BEHAVIOR: configurable round limit pauses only the affected unit
IMPLEMENTATION: src/domain/round-continuation.ts; src/application/round-continuation.ts
DIRECT_TEST: tests/dom-001-ticket-009.test.ts — T9-AC1
RESULT: PASS
FOCUSED_TESTS: 5/5 PASS
```

`RoundLimitPolicy` defaults to ten, accepts a configured limit, returns a
unit-scoped `PAUSE_AFFECTED_UNIT` decision at round ten, and returns
`CONTINUE` for a different unit below the limit. The EXEC mapper carries only
the canonical cycle/unit/round decision; it does not own scheduling.

```text
LOCAL_ACCEPTANCE: SATISFIED
WITNESS_EXECUTABLE_AT_LOCAL_CLOSURE: YES
PRODUCTIVE_AVAILABILITY: YES for local DOM policy
FOREIGN_EXEC_AVAILABILITY: NO; REQUIRED_FOR_INTEGRATED_PROOF only
LOCAL_BLOCKER: NO
```