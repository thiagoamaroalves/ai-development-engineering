# AC-EXEC-009 — NORMAL and BOOTSTRAP catalog isolation

```text
STATUS = SATISFIED
TEST = tests/exec-001-ticket-002.test.ts
ASSERTIONS = two NORMAL RepositoryId scopes remain distinct; BOOTSTRAP has independent system scope
RESULT = PASS
FOCUSED_TICKET_TESTS = 10/10
```

Catalog scope is explicit. NORMAL bases bind to their own opaque `RepositoryId`; BOOTSTRAP has no repository identity and cannot be substituted for a NORMAL basis.
