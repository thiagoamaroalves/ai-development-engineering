# AC-DOM-006 — Independent ADR lifecycles

```text
TICKET: DOM-001-TICKET-003
ACCEPTANCE: AC-DOM-006
NORMATIVE_BEHAVIOR: decision and realization lifecycles remain independent
DIRECT_WITNESS: T3-AC1-P/N
```

`tests/dom-001-ticket-003.test.ts` transitions `PROPOSED → ACCEPTED` and
`UNPROCESSED → PROCESSING` through separate aggregate operations, then
attempts an unauthorized decision transition. The decision rejection leaves
the realization state unchanged. Result: `SATISFIED`.

```text
TEST_COMMAND: prototype/node_modules/.bin/tsx.cmd --test tests/dom-001-ticket-003.test.ts
RESULT: PASS
```
