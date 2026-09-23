# AC-EXEC-005 — Frozen-basis contribution

```text
STATUS = SATISFIED_AS_LOCAL_CONTRIBUTION
FINAL_PROOF_OWNER = EXEC-001-TICKET-005
TEST = tests/exec-001-ticket-002.test.ts
COMMAND = node --experimental-strip-types --test tests/exec-001-ticket-002.test.ts
EXECUTED_OUTPUT = 12 tests, 12 passed, 0 failed, 0 skipped
ASSERTIONS = registration returns a new basis; prior basis identity and entries remain unchanged; duplicate/conflict failures set no mutation
RESULT = PASS
```

The application no longer accepts a caller-supplied basis. Resolution uses the source-selected, scope-bound fixture seam. Full DOM snapshot binding remains owned by TICKET-005; no productive DOM availability is claimed here.
