# AC-DOM-012 — Ticket state evidence

```text
TICKET = DOM-001-TICKET-006
IMPLEMENTATION = src/domain/ticket.ts
OPERATION = Ticket.create / Ticket.rehydrate
RESULT = PASS
```

`TicketFunctionalState` accepts exactly `DRAFT`, `READY`, `IMPLEMENTED`,
`COMPLETED`, `BLOCKED`, and `CANCELLED`. T6-AC1 directly reaches all six
functional states and restores a valid READY ticket from accepted transition
provenance. Unknown persisted state material is rejected before a ticket is
materialized; the aggregate keeps state immutable.

Witness: `tests/dom-001-ticket-006.test.ts`, `T6-AC1`; 4 focused tests pass.
