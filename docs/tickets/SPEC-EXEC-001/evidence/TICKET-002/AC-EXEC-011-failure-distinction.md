# AC-EXEC-011 — Unknown versus incompatible capability

```text
STATUS = SATISFIED
TEST = tests/exec-001-ticket-002.test.ts
ASSERTIONS = missing capability => UNKNOWN_CAPABILITY; known capability with unsupported version => INCOMPATIBLE_CAPABILITY
RESULT = PASS
FOCUSED_TICKET_TESTS = 10/10
```

Resolution preserves the canonical distinction and does not fall back to a different version or alias.
