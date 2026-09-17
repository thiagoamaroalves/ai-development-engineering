# AC-DOM-015 — Cooperative cancellation evidence

```text
TICKET = DOM-001-TICKET-007
IMPLEMENTATION = src/domain/publication.ts
OPERATION = Publication.changeUnitProgress
RESULT = PASS
```

Cancellation is represented as unit-scoped `CANCEL_REQUESTED` progress. The
unrelated unit remains active and no remote publication effect is rolled back.
A duplicate progress ID must retain the original unit target; a changed target
is rejected without mutation.

Witness: `tests/dom-001-ticket-007.test.ts`, `T7-AC3` and `T7-AC4`; 4 focused tests pass.
