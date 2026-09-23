# AC-EXEC-008 — Deterministic registry resolution

```text
STATUS = SATISFIED
TEST = tests/exec-001-ticket-002.test.ts
COMMAND = node --experimental-strip-types --test tests/exec-001-ticket-002.test.ts
EXECUTED_OUTPUT = 23 tests, 23 passed, 0 failed, 0 skipped
REMEDIATION_START_HEAD = 8f62b283b1dbf487911c7c459db95cadc25ff101
CANONICAL_AUDIT_TARGET_HEAD = cc3fe3210eaebf8e0f577f7f5e1e48b97ed175bb
EXECUTION_STATE = uncommitted remediation working tree; independent re-audit target required
ASSERTIONS = complete stage/skill/capability/version/input-schema/output-schema/artifact/verdict/role mapping; exact multi-version selection in both registration orders; source-bound basis retention; duplicate/conflict rejection; prior-basis immutability
RESULT = PASS
```

Resolution identifies the registered capability and exact requested version before applying the entry-owned compatibility policy, returning a complete mapping from the frozen basis. Duplicate/conflicting registration fails closed without publishing or mutating the prior basis.
