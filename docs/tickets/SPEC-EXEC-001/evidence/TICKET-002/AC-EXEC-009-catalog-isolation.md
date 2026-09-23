# AC-EXEC-009 — NORMAL and BOOTSTRAP catalog isolation

```text
STATUS = SATISFIED
TEST = tests/exec-001-ticket-002.test.ts
COMMAND = node --experimental-strip-types --test tests/exec-001-ticket-002.test.ts
EXECUTED_OUTPUT = 16 tests, 16 passed, 0 failed, 0 skipped
ASSERTIONS = NORMAL repository scopes remain distinct; BOOTSTRAP uses an independent system source; cross-scope source substitution, matching-source forgery, copied receipts, DOM-source substitution and direct basis injection fail CONTRACT_INVALID with no success, approval, or mutation
RESULT = PASS
```

The application selects authenticated source receipts for the requested scope and verifies source kind, exact scope binding and basis metadata. DOM/REPO productive producers remain integrated-proof owners and are not promoted by the local fixture.
