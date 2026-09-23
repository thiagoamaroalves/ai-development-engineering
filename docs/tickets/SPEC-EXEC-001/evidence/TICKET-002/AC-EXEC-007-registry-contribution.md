# AC-EXEC-007 — Failure classification contribution

```text
STATUS = SATISFIED_AS_LOCAL_CONTRIBUTION
FINAL_PROOF_OWNER = EXEC-001-TICKET-004
TEST = tests/exec-001-ticket-002.test.ts
COMMAND = node --experimental-strip-types --test tests/exec-001-ticket-002.test.ts
EXECUTED_OUTPUT = 23 tests, 23 passed, 0 failed, 0 skipped
REMEDIATION_START_HEAD = 8f62b283b1dbf487911c7c459db95cadc25ff101
CANONICAL_AUDIT_TARGET_HEAD = cc3fe3210eaebf8e0f577f7f5e1e48b97ed175bb
EXECUTION_STATE = uncommitted remediation working tree; independent re-audit target required
ASSERTIONS = unsupported version and known schema mismatch return INCOMPATIBLE_CAPABILITY; source, authority and alternate-adapter failures return CONTRACT_INVALID; all failures carry noApproval=true and noMutation=true
RESULT = PASS
```

TICKET-002 supplies the local canonical classification and fail-closed contribution. Full cross-spec structured failure mapping remains owned by TICKET-004; foreign producer availability remains integrated-only.
