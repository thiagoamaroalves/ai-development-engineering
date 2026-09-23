# AC-EXEC-010 — Bootstrap allowlist

```text
STATUS = SATISFIED
TEST = tests/exec-001-ticket-002.test.ts
COMMAND = node --experimental-strip-types --test tests/exec-001-ticket-002.test.ts
EXECUTED_OUTPUT = 23 tests, 23 passed, 0 failed, 0 skipped
REMEDIATION_START_HEAD = 8f62b283b1dbf487911c7c459db95cadc25ff101
CANONICAL_AUDIT_TARGET_HEAD = cc3fe3210eaebf8e0f577f7f5e1e48b97ed175bb
EXECUTION_STATE = uncommitted remediation working tree; independent re-audit target required
ASSERTIONS = NORMAL capability in source-authorized BOOTSTRAP returns INCOMPATIBLE_CAPABILITY before the observable normal-work gate; DISCOVERY resolves; noApproval=true; noMutation=true; BOOTSTRAP source mismatch fails closed
RESULT = PASS
```

`BootstrapAllowlistPolicy` permits only DISCOVERY, VALIDATION, MIGRATION, AUDIT and REMEDIATION. Normal work cannot be substituted into the requested bootstrap context.
