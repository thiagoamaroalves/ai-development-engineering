# AC-EXEC-007 — Failure classification contribution

```text
STATUS = SATISFIED_AS_LOCAL_CONTRIBUTION
FINAL_PROOF_OWNER = EXEC-001-TICKET-004
TEST = tests/exec-001-ticket-002.test.ts
COMMAND = node --experimental-strip-types --test tests/exec-001-ticket-002.test.ts
EXECUTED_OUTPUT = 16 tests, 16 passed, 0 failed, 0 skipped
ASSERTIONS = unsupported version and known schema mismatch return INCOMPATIBLE_CAPABILITY; source, authority and alternate-adapter failures return CONTRACT_INVALID; all failures carry noApproval=true and noMutation=true
RESULT = PASS
```

TICKET-002 supplies the local canonical classification and fail-closed contribution. Full cross-spec structured failure mapping remains owned by TICKET-004; foreign producer availability remains integrated-only.
