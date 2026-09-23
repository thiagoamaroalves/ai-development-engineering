# AC-EXEC-003 — Semantic version semantics

```text
STATUS = SATISFIED
TEST = tests/exec-001-ticket-002.test.ts
COMMAND = node --experimental-strip-types --test tests/exec-001-ticket-002.test.ts
EXECUTED_OUTPUT = 16 tests, 16 passed, 0 failed, 0 skipped
ASSERTIONS = major/minor/patch components, exact large numeric comparison, build-only NONE, NONE/PATCH/MINOR/MAJOR classification
RESULT = PASS
REPOSITORY_GATE = npm test = 64 passed, 0 failed
TYPECHECK = npm run typecheck = PASS
```

The value object preserves exact decimal comparison for large components and treats SemVer build-only changes as `NONE`. Supported-version membership remains an explicit exact set with no range, alias, approximation, or conversion.
