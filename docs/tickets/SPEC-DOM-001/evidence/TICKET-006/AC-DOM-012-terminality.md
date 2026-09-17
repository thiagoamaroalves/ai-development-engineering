# AC-DOM-012 — Terminality and continuation evidence

```text
TICKET = DOM-001-TICKET-006
IMPLEMENTATION = src/domain/ticket.ts; src/application/ticket.ts
OPERATION = TicketTransitionHandler.handle / Ticket.transition
RESULT = PASS
```

Terminal mutation and cancellation without the required audited authorization
are rejected. An exact repeated transition identity returns the existing
accepted aggregate without another mutation. Rejected handler commands are
recorded through the injected recorder. A stale expected revision is rejected
and repository state remains unchanged.

Witness: `tests/dom-001-ticket-006.test.ts`, `T6-AC3`; 4 focused tests pass.
