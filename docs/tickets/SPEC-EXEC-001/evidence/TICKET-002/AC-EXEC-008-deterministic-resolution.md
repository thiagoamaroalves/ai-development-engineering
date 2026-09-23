# AC-EXEC-008 — Deterministic registry resolution

```text
STATUS = SATISFIED
TEST = tests/exec-001-ticket-002.test.ts
COMMAND = node --experimental-strip-types --test tests/exec-001-ticket-002.test.ts
EXECUTED_OUTPUT = 12 tests, 12 passed, 0 failed, 0 skipped
ASSERTIONS = complete stage/skill/capability/version/schema/artifact/verdict/role mapping; source-bound basis retention; duplicate and distinct conflict rejection; prior-basis immutability
RESULT = PASS
```

Resolution identifies the registered capability before compatibility filtering and returns a complete mapping from the frozen basis. Duplicate/conflicting registration fails closed without publishing or mutating the prior basis.
