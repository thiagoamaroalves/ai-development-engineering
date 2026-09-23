# AC-EXEC-003 — Semantic version semantics

```text
STATUS = SATISFIED
TEST = tests/exec-001-ticket-002.test.ts
COMMAND = node --experimental-strip-types --test tests/exec-001-ticket-002.test.ts
EXECUTED_OUTPUT = 23 tests, 23 passed, 0 failed, 0 skipped
REMEDIATION_START_HEAD = 8f62b283b1dbf487911c7c459db95cadc25ff101
CANONICAL_AUDIT_TARGET_HEAD = cc3fe3210eaebf8e0f577f7f5e1e48b97ed175bb
EXECUTION_STATE = uncommitted remediation working tree; independent re-audit target required
ASSERTIONS = major/minor/patch components, exact large numeric comparison, build-only NONE, NONE/PATCH/MINOR/MAJOR classification
RESULT = PASS
REPOSITORY_GATE = npm test = 71 passed, 0 failed, 0 skipped
TYPECHECK = npm run typecheck = PASS
```

The value object preserves exact decimal comparison for large components and treats SemVer build-only changes as `NONE`. Supported-version membership remains an explicit exact set with no range, alias, approximation, or conversion.
