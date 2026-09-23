# AC-EXEC-010 — Bootstrap allowlist

```text
STATUS = SATISFIED
TEST = tests/exec-001-ticket-002.test.ts
COMMAND = node --experimental-strip-types --test tests/exec-001-ticket-002.test.ts
EXECUTED_OUTPUT = 16 tests, 16 passed, 0 failed, 0 skipped
ASSERTIONS = NORMAL capability in source-authorized BOOTSTRAP returns INCOMPATIBLE_CAPABILITY before the observable normal-work gate; DISCOVERY resolves; noApproval=true; noMutation=true; BOOTSTRAP source mismatch fails closed
RESULT = PASS
```

`BootstrapAllowlistPolicy` permits only DISCOVERY, VALIDATION, MIGRATION, AUDIT and REMEDIATION. Normal work cannot be substituted into the requested bootstrap context.
