# AC-DOM-013 — Ticket transition evidence

```text
TICKET = DOM-001-TICKET-006
IMPLEMENTATION = src/domain/ticket.ts
OPERATION = Ticket.transition
RESULT = PASS
```

The transition policy recognizes the eight ADR-0002 transitions and rejects
unlisted edges. `READY -> IMPLEMENTED` requires both a formal implementation
verdict and approved commit. Each accepted transition creates a new immutable
revision and records its transition identity and authorization. An arbitrary
reopen from `COMPLETED` is rejected.

Witness: `tests/dom-001-ticket-006.test.ts`, `T6-AC2`; 4 focused tests pass.
