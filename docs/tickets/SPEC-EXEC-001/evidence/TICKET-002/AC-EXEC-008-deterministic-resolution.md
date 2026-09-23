# AC-EXEC-008 — Deterministic registry resolution

```text
STATUS = REMEDIATED_PENDING_INDEPENDENT_REAUDIT
TEST = tests/exec-001-ticket-002.test.ts
FOCUSED_COMMAND = node --experimental-strip-types --test tests/exec-001-ticket-002.test.ts
FOCUSED_EXECUTED_OUTPUT = 24 tests, 24 passed, 0 failed, 0 skipped
FULL_COMMAND = npm test
FULL_EXECUTED_OUTPUT = 72 tests, 72 passed, 0 failed, 0 skipped
TYPECHECK = npm run typecheck = PASS
AUDIT_GOVERNANCE = npm run verify:audit-governance = PASS
SKILL_MIRROR = npm run verify:skill-mirror = PASS
REMEDIATION_START_HEAD = 96cb42d004e96b8e4bd17d3f0963542f4645dfb2
BASELINE_AUDIT_TARGET_HEAD = c450df1c4523a841484cbf1acb8cd1ab57621017
BASELINE_AUDIT_TARGET_STATE_FINGERPRINT = d91db0e8d277c66499d9d4fd5dc0a05818aeb7d39faf1303876abc8e6d165192
POST_REMEDIATION_EXECUTION_HEAD = 96cb42d004e96b8e4bd17d3f0963542f4645dfb2
POST_REMEDIATION_STATE = uncommitted remediation working tree; independent re-audit required
POST_REMEDIATION_STATE_FINGERPRINT = 2fafd3a1e03db9058c9ee963f33bccbe14bd78c5cf1ff95395abeb368eab93f6
ASSERTIONS = complete stage/skill/capability/version/input-schema/output-schema/artifact/verdict/role mapping; exact multi-version selection in both registration orders; source-bound basis retention; duplicate/conflict rejection; prior-basis immutability; incomplete-entry CONTRACT_INVALID construction/registration rejection with no basis mutation; caller-created fixture rejection by the canonical resolver; fixture-only results remain untrusted
RESULT = PASS_PENDING_REAUDIT
```

The domain resolver now requires a producer-bound proof for canonical results.
Caller-created catalog fixtures are restricted to explicit contract-only tests;
their structurally resolved values are frozen but are not authenticated
registry results. Failure paths carry a non-authoritative failure context.
Incomplete `RegistryEntry` construction and registration fail with
`CONTRACT_INVALID` before a basis can be published or mutated. The pinned
canonical audit target remains unchanged; this evidence records the
uncommitted remediation state and is not an independent re-audit verdict.
