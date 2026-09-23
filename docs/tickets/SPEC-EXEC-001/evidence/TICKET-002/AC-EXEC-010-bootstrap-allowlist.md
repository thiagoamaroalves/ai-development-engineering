# AC-EXEC-010 — Bootstrap allowlist

```text
STATUS = SATISFIED
TEST = tests/exec-001-ticket-002.test.ts
ASSERTIONS = NORMAL capability in BOOTSTRAP returns INCOMPATIBLE_CAPABILITY; DISCOVERY capability resolves
RESULT = PASS
FOCUSED_TICKET_TESTS = 10/10
```

`BootstrapAllowlistPolicy` permits only DISCOVERY, VALIDATION, MIGRATION, AUDIT and REMEDIATION categories. A NORMAL category requested from BOOTSTRAP fails before resolution success and carries no-approval/no-mutation markers.
