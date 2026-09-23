# AC-EXEC-012 — Registry-only extensibility

```text
STATUS = SATISFIED
TEST = tests/exec-001-ticket-002.test.ts
COMMAND = node --experimental-strip-types --test tests/exec-001-ticket-002.test.ts
EXECUTED_OUTPUT = 12 tests, 12 passed, 0 failed, 0 skipped
ASSERTIONS = schema-authenticated synthetic capability registers and resolves through the common RegistryEntry/CatalogBasis path; old basis remains unchanged; forged schema/support-set and untrusted adapter material are rejected
RESULT = PASS
```

No category-specific registry or alternate authority is introduced. Registration returns a new immutable basis, and application resolution consumes only the source-selected basis with the expected producer source marker.
