# AC-DOM-007 — Revision succession and eligibility invalidation

```text
TICKET: DOM-001-TICKET-003
ACCEPTANCE: AC-DOM-007
NORMATIVE_BEHAVIOR: remediation creates a successor and invalidates prior eligibility
DIRECT_WITNESS: T3-AC2-P/N
```

The direct remediation test proves an immediate revision `1 → 2`, stable
canonical identity, reciprocal `supersedes` / `supersededBy` links, retained
predecessor history, and `INVALIDATED` predecessor eligibility. Negative
coverage proves implemented remediation, duplicate/replay, semantic conflict,
concurrent equivalent/conflicting reservations, and temporal drift at the
commit boundary are rejected without repository mutation. Result: `SATISFIED`.

```text
TEST_COMMAND: prototype/node_modules/.bin/tsx.cmd --test tests/dom-001-ticket-003.test.ts
RESULT: PASS
```
