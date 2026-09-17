# T010 — AC-DOM-053 Adjustment and Terminality Evidence

```text
EVIDENCE_ID: T10-AC2
TICKET: DOM-001-TICKET-010
BEHAVIOR: link a new adjustment without reopening completed tickets
IMPLEMENTATION: src/domain/normative-change.ts; src/application/normative-change.ts
DIRECT_TEST: tests/dom-001-ticket-010.test.ts — terminality, lineage, retry and recovery
RESULT: PASS
FOCUSED_TESTS: 5/5 PASS
```

`AdjustmentLineage` binds source revision, target revision, affected approvals,
affected canonical ticket references and return stage. The handler reads T6
`Ticket` authority and issues no ticket transition; the completed ticket
remains `COMPLETED` at the same revision. Exact retry does not append another
adjustment.

```text
LOCAL_ACCEPTANCE: SATISFIED
WITNESS_EXECUTABLE_AT_LOCAL_CLOSURE: YES
COMPLETED_TICKET_REOPENED: NO
ADJUSTMENT_DUPLICATES: 0
RECOVERY: PASS
CONCURRENCY: PASS; one winner
```