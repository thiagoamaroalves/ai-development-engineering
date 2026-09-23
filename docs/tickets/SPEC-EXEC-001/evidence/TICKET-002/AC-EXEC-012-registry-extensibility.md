# AC-EXEC-012 — Registry-only extensibility

```text
STATUS = SATISFIED
TEST = tests/exec-001-ticket-002.test.ts
COMMAND = node --experimental-strip-types --test tests/exec-001-ticket-002.test.ts
EXECUTED_OUTPUT = 16 tests, 16 passed, 0 failed, 0 skipped
ASSERTIONS = schema-authenticated synthetic capability registers and resolves through the common RegistryEntry/CatalogBasis path; old basis remains unchanged; forged entry/basis, copied receipt and untrusted adapter material are rejected
RESULT = PASS
```

No category-specific registry or alternate authority is introduced. Registration returns a new immutable basis, and application resolution consumes only a source-issued receipt with the expected independent source kind.
