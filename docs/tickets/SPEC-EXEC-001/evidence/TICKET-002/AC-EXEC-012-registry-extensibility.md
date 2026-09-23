# AC-EXEC-012 — Registry-only extensibility

```text
STATUS = SATISFIED
TEST = tests/exec-001-ticket-002.test.ts
ASSERTIONS = synthetic capability registers and resolves through common RegistryEntry/CatalogBasis path; old basis remains unchanged
RESULT = PASS
FOCUSED_TICKET_TESTS = 10/10
```

No category-specific registry or alternate authority is introduced. Registration returns a new immutable basis.
