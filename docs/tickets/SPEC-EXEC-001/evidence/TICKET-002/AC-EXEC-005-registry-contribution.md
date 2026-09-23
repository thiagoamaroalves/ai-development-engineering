# AC-EXEC-005 — Frozen-basis contribution

```text
STATUS = SATISFIED_AS_LOCAL_CONTRIBUTION
FINAL_PROOF_OWNER = EXEC-001-TICKET-005
TEST = tests/exec-001-ticket-002.test.ts
COMMAND = node --experimental-strip-types --test tests/exec-001-ticket-002.test.ts
EXECUTED_OUTPUT = 23 tests, 23 passed, 0 failed, 0 skipped
REMEDIATION_START_HEAD = 8f62b283b1dbf487911c7c459db95cadc25ff101
CANONICAL_AUDIT_TARGET_HEAD = cc3fe3210eaebf8e0f577f7f5e1e48b97ed175bb
EXECUTION_STATE = uncommitted remediation working tree; independent re-audit target required
ASSERTIONS = registration returns a new basis; prior basis identity and entries remain unchanged; duplicate/conflict and forged material failures publish no mutation
RESULT = PASS
```

The application no longer accepts a caller-supplied basis or raw source adapter. Resolution uses a source-issued, scope-bound receipt. Full DOM snapshot binding remains owned by TICKET-005; no productive DOM availability is claimed here.
