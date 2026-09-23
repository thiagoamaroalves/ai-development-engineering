# AC-EXEC-011 — Unknown versus incompatible capability

```text
STATUS = SATISFIED
TEST = tests/exec-001-ticket-002.test.ts
COMMAND = node --experimental-strip-types --test tests/exec-001-ticket-002.test.ts
EXECUTED_OUTPUT = 23 tests, 23 passed, 0 failed, 0 skipped
REMEDIATION_START_HEAD = 8f62b283b1dbf487911c7c459db95cadc25ff101
CANONICAL_AUDIT_TARGET_HEAD = cc3fe3210eaebf8e0f577f7f5e1e48b97ed175bb
EXECUTION_STATE = uncommitted remediation working tree; independent re-audit target required
ASSERTIONS = absent capability => UNKNOWN_CAPABILITY; known unsupported version => INCOMPATIBLE_CAPABILITY; known incompatible schema => INCOMPATIBLE_CAPABILITY; incompatible and source failures carry noApproval=true and noMutation=true
RESULT = PASS
```

Identity lookup precedes schema/version compatibility filtering, preserving canonical unknown versus incompatible outcomes without fallback or silent conversion.
