# AC-EXEC-012 — Registry-only extensibility

```text
STATUS = SATISFIED
TEST = tests/exec-001-ticket-002.test.ts
COMMAND = node --experimental-strip-types --test tests/exec-001-ticket-002.test.ts
EXECUTED_OUTPUT = 23 tests, 23 passed, 0 failed, 0 skipped
REMEDIATION_START_HEAD = 8f62b283b1dbf487911c7c459db95cadc25ff101
CANONICAL_AUDIT_TARGET_HEAD = cc3fe3210eaebf8e0f577f7f5e1e48b97ed175bb
EXECUTION_STATE = uncommitted remediation working tree; independent re-audit target required
ASSERTIONS = schema-authenticated synthetic capability registers and resolves through the common RegistryEntry/CatalogBasis path; old basis remains unchanged; forged entry/basis, copied receipt and untrusted adapter material are rejected
RESULT = PASS
```

No category-specific registry or alternate authority is introduced. Registration returns a new immutable basis, and application resolution consumes only a source-issued receipt with the expected independent source kind.
