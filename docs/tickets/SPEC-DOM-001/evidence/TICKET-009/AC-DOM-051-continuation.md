# T009 — AC-DOM-051 Continuation Evidence

```text
EVIDENCE_ID: T9-AC2
TICKET: DOM-001-TICKET-009
BEHAVIOR: explicit continuation authorization for the next round
IMPLEMENTATION: src/domain/round-continuation.ts; src/application/round-continuation.ts
DIRECT_TEST: tests/dom-001-ticket-009.test.ts — T9-AC2 and negative/concurrency cases
RESULT: PASS
FOCUSED_TESTS: 5/5 PASS
```

An authorization is accepted only for the latest cycle round at the configured
limit, binds the exact cycle and activity identity, and authorizes exactly the
successor round. Below-limit, wrong-cycle and stale requests fail closed. Exact
retries are idempotent; competing different authorization IDs cannot both win
the repository revision.

```text
LOCAL_ACCEPTANCE: SATISFIED
WITNESS_EXECUTABLE_AT_LOCAL_CLOSURE: YES
NO_IMPLICIT_CONTINUATION: PROVEN
NO_CROSS_UNIT_AUTHORIZATION: PROVEN
CONCURRENCY: PASS; one winner
RECOVERY: PASS; exact authorization record is immutable/readable
```