# AC-DOM-008 — Implemented ADR immutability

```text
TICKET: DOM-001-TICKET-003
ACCEPTANCE: AC-DOM-008
NORMATIVE_BEHAVIOR: implemented ADR content and lifecycle are immutable
DIRECT_WITNESS: T3-AC3-P/N
```

The direct test marks an accepted ADR implemented with operational metadata,
asserts the aggregate and operational record are frozen, rejects a second
implementation mutation, and proves caller-owned nested eligibility and
operational inputs cannot mutate the constructed record. Content replacement is rejected with
`IMPLEMENTED_ADR_IMMUTABLE`; operational metadata is kept in the operational
record boundary rather than the content hash/document fields. Result:
`SATISFIED`.

```text
TEST_COMMAND: prototype/node_modules/.bin/tsx.cmd --test tests/dom-001-ticket-003.test.ts
RESULT: PASS
```
