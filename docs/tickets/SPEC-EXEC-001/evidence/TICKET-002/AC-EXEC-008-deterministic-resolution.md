# AC-EXEC-008 — Deterministic registry resolution

```text
STATUS = REMEDIATED_PENDING_INDEPENDENT_REAUDIT
TEST = tests/exec-001-ticket-002.test.ts
FOCUSED_COMMAND = node --experimental-strip-types --test tests/exec-001-ticket-002.test.ts
FOCUSED_EXECUTED_OUTPUT = 25 tests, 25 passed, 0 failed, 0 skipped
FULL_COMMAND = npm test
FULL_EXECUTED_OUTPUT = 73 tests, 73 passed, 0 failed, 0 skipped
TYPECHECK = npm run typecheck = PASS
AUDIT_GOVERNANCE = npm run verify:audit-governance = PASS
SKILL_MIRROR = npm run verify:skill-mirror = PASS
REMEDIATION_START_HEAD = 15f653441dbf6fb50579505f2ba10ffeb3cfd726
BASELINE_AUDIT_TARGET_HEAD = 6f8ea7170f21f94d36f30893cc5622040fa4ba5b
BASELINE_AUDIT_TARGET_STATE_FINGERPRINT = 732a233bb6949d3b9da4192284f83e31564828ba5962ba43c2f25eff1ee66668
POST_REMEDIATION_EXECUTION_HEAD = 15f653441dbf6fb50579505f2ba10ffeb3cfd726
POST_REMEDIATION_STATE = uncommitted remediation working tree; independent re-audit required
POST_REMEDIATION_STATE_FINGERPRINT = d4156f71b0214f3ec774fee6a38b3c79849cceb62f0a38ce53dce35cecc50e00
POST_REMEDIATION_FINGERPRINT_METHOD = SHA-256 over sorted allowlisted implementation/test paths as relative-path NUL content tuples
ASSERTIONS = complete stage/skill/capability/version/input-schema/output-schema/artifact/verdict/role mapping; exact multi-version selection in both registration orders; source-bound basis retention; duplicate/conflict rejection; prior-basis immutability; incomplete-entry CONTRACT_INVALID construction/registration rejection with no basis mutation; runtime constructor authority rejection; public failure remains non-authoritative; caller-created fixture rejection by the canonical resolver; fixture-only results remain untrusted
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
