# AC-EXEC-008 — Deterministic registry resolution

```text
STATUS = SATISFIED
TEST = tests/exec-001-ticket-002.test.ts
ASSERTIONS = complete mapping resolution, scope/basis retention, duplicate rejection, prior-basis immutability
RESULT = PASS
FOCUSED_TICKET_TESTS = 10/10
```

A frozen `CatalogBasis` resolves a complete registered stage/capability mapping. Duplicate registration returns `CONTRACT_INVALID` through the domain error and leaves the prior basis unchanged.
