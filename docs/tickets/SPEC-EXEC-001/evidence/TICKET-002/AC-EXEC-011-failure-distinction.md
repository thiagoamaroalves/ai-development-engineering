# AC-EXEC-011 — Unknown versus incompatible capability

```text
STATUS = SATISFIED
TEST = tests/exec-001-ticket-002.test.ts
COMMAND = node --experimental-strip-types --test tests/exec-001-ticket-002.test.ts
EXECUTED_OUTPUT = 12 tests, 12 passed, 0 failed, 0 skipped
ASSERTIONS = absent capability => UNKNOWN_CAPABILITY; known unsupported version => INCOMPATIBLE_CAPABILITY; known incompatible schema => INCOMPATIBLE_CAPABILITY; incompatible failures carry noApproval=true and noMutation=true
RESULT = PASS
```

Identity lookup precedes schema/version compatibility filtering, preserving canonical unknown versus incompatible outcomes without fallback or silent conversion.
