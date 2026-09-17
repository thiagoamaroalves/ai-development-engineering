# T010 — AC-DOM-053 Selective Invalidation Evidence

```text
EVIDENCE_ID: T10-AC1
TICKET: DOM-001-TICKET-010
BEHAVIOR: invalidate only approvals affected by a normative change
IMPLEMENTATION: src/domain/normative-change.ts; src/application/normative-change.ts
DIRECT_TEST: tests/dom-001-ticket-010.test.ts — T10-AC1/T10-AC2 and negative cases
RESULT: PASS
FOCUSED_TESTS: 5/5 PASS
```

The change aggregate marks only the explicitly authoritative affected approval
obsolete. Unrelated approval records remain valid and history-bearing. The
handler validates the canonical initial and second observations before the
repository CAS; drift and unknown approvals produce no mutation.

```text
LOCAL_ACCEPTANCE: SATISFIED
WITNESS_EXECUTABLE_AT_LOCAL_CLOSURE: YES
SELECTIVE_SCOPE: PROVEN
HISTORY_PRESERVED: YES
FOREIGN_RUNTIME_RECORDS: INTEGRATED_PROOF_ONLY
```