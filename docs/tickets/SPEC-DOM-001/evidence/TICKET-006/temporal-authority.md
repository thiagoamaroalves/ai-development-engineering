# TICKET-006 — Temporal authority evidence

```text
INITIAL_OBSERVATION = ticket identity, functional state, and revision
MUTATION_WINDOW = transition request through repository persistence
COMMIT_POINT = TicketRepository.advance(proposed, expectedRevision)
INDEPENDENT_SECOND_OBSERVATION = repository compares current revision at advance
DRIFT_DETECTION = expected revision mismatch
FAIL_CLOSED_BEHAVIOR = return TICKET_STALE; no proposed state is persisted
STATE_PRESERVATION = YES
SEMANTIC_VALIDATION_OWNER = DOM Ticket aggregate/policy
CAS_OR_PHYSICAL_INTEGRITY_ROLE = repository/PLAT boundary
RESULT = PASS
```

Witness: `tests/dom-001-ticket-006.test.ts`, T6-AC3 stale/retry and T6-AC4 barrier-controlled concurrent assertions; 4 focused tests pass.
