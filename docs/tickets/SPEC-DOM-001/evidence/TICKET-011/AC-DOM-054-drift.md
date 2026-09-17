# T011 — AC-DOM-054 Drift Evidence

```text
EVIDENCE_ID: T11-AC2
TICKET: DOM-001-TICKET-011
BEHAVIOR: independent pre-publication drift rejection
IMPLEMENTATION: src/domain/candidate-evidence.ts; src/application/candidate-evidence.ts
DIRECT_TEST: tests/dom-001-ticket-011.test.ts — all drift dimensions, self-comparison, stale and concurrency
RESULT: PASS
FOCUSED_TESTS: 6/6 PASS
```

The handler obtains two observations and rejects reused observation IDs. Tests
cover candidate, base, head, tree, conformance-run, evidence-ID and evidence-
hash drift. Rejection occurs before repository commit and leaves the previous
gate unchanged. Exact retry is idempotent; stale retry is rejected.

```text
LOCAL_ACCEPTANCE: SATISFIED
WITNESS_EXECUTABLE_AT_LOCAL_CLOSURE: YES
DRIFT_DIMENSIONS_PROVEN: 7
SELF_COMPARISON_ACCEPTED: NO
NO_EFFECT_ON_DRIFT: PROVEN
```