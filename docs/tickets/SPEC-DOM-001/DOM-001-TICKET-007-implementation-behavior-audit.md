# DOM-001-TICKET-007 — Implementation Behavior Audit / Re-audit 1

## 1. Subject and authority

```text
AUDIT_ROUND: RE_AUDIT / 1
AUDIT_MODE: READ_ONLY / INDEPENDENT / ADVERSARIAL / BEHAVIOR_FIRST / TEST_ASSERTION_AWARE / NEGATIVE_PATH_AWARE / FAILURE_SEMANTICS_AWARE
TICKET_ID: DOM-001-TICKET-007
TICKET_PATH: docs/tickets/SPEC-DOM-001/DOM-001-TICKET-007-publication-advancement-gates.md
TICKET_STATUS: VALIDATION_REQUIRED
IMPLEMENTATION_UNIT: DOM-IMP-07
REQUIREMENT_IDS: DOM-ADV-001, DOM-PUB-001
ACCEPTANCE_IDS: AC-DOM-014, AC-DOM-015
IMPLEMENTATION_BASELINE: initial T007 audited worktree
CURRENT_HEAD: 6b31bcee1591c8b2e6499a434950664077b2be01
AUDIT_TARGET_HEAD: 6b31bcee1591c8b2e6499a434950664077b2be01 plus remediated T007 worktree
PREVIOUS_CANONICAL_AUDIT: docs/tickets/SPEC-DOM-001/DOM-001-TICKET-007-implementation-audit.md
REMEDIATION_ARTIFACT: docs/tickets/SPEC-DOM-001/DOM-001-TICKET-007-implementation-remediation.md
CHANGED_PRODUCTION_FILES: src/domain/publication.ts; src/application/publication.ts
CHANGED_TEST_FILES: tests/dom-001-ticket-007.test.ts
```

```text
BASELINE_DRIFT_STATUS: DRIFT_ASSESSED
REASSESSMENT_COMPLETE: YES
FINDINGS_ARE_ACTIONABLE: NO
BASELINE_REMEDIATION_READINESS: READY
AUDIT_BASIS_STALE: NO
AUTHORITY_STATUS: DEFINED
CONTRACT_STATUS: DEFINED
LOCAL_TESTABILITY: YES for local publication semantics
PRODUCTIVE_AVAILABILITY: YES for local semantic boundary
FOREIGN_GIT_PLAT_PRODUCTIVE_AVAILABILITY: NO
FOREIGN_DEPENDENCY_CLASS: REQUIRED_FOR_INTEGRATED_PROOF
CALLER_AS_AUTHORITY_CHECK: PASS
TEMPORAL_AUTHORITY: PROTECTED for local CAS; remote observation remains foreign integrated proof
```

## 2. Behavioral applicability

| Dimension | Result |
|---|---|
| UNIT_BEHAVIOR | REQUIRED / PASS |
| INTEGRATION_BEHAVIOR | AFFECTED / PASS; mapper is explicit |
| PERSISTENCE | REQUIRED locally / PASS; accepted-history port and rehydrate |
| CONCURRENCY | REQUIRED / PASS; barrier-controlled commands |
| STALE_STATE | REQUIRED / PASS |
| IDEMPOTENCY | REQUIRED / PASS |
| DURABILITY | NOT_APPLICABLE locally; PLAT integrated-only |
| RECOVERY | REQUIRED locally / PASS |
| COMPATIBILITY | NOT_APPLICABLE; new canonical path |
| MIGRATION_BEHAVIOR | NOT_APPLICABLE |
| NEGATIVE_PATHS | REQUIRED / PASS |

## 3. Production semantics and acceptance witnesses

`PublicationState` exposes eight states. `PublicationStatePolicy` gates approval,
local integration, PR progression and remote confirmation. `CandidateBasis` and
`RemotePublicationConfirmation` now share candidateId, baseSha, headSha,
treeHash and conformanceRunId. `Publication.rehydrate` resolves accepted basis
and ordered transition history before materializing a later state. Transition
records preserve authorization semantics; progress records preserve unitState;
conflicting duplicate IDs reject. The application handler validates
`PUBLICATION` identity and maps GIT evidence through
`GitPublicationEvidenceMapper`.

| Required behavior | Direct witness | Result |
|---|---|---|
| Eight states and PR_MERGED distinction | T7-AC1 | PASS |
| Formal verdict/dependency/active-work gate | T7-AC2 | PASS |
| Exact candidate basis including conformance run | T7-AC1/T7-AC4 | PASS |
| Unit-local cooperative progress | T7-AC3 | PASS |
| Conflicting transition replay rejection | T7-AC4 | PASS |
| Conflicting unit-progress replay rejection | T7-AC3 | PASS |
| Accepted basis/history recovery | T7-AC4 | PASS |
| Wrong identity kind rejection | T7-AC4 | PASS |
| Concurrent one-winner/stale loser CAS | T7-AC4 Promise.all barrier | PASS |
| GIT mapper operation | T7-AC1 mapper assertion | PASS |

```text
REQUIRED_BEHAVIORS_TOTAL: 10
DIRECT_BEHAVIOR_WITNESSES: 10
PROXY_ONLY_BEHAVIORS: 0
UNTESTED_STATE_TRANSITIONS: 0
UNPROVEN_CONCURRENCY_CONTRACTS: 0
MISSING_ARCHITECTURE_GUARDS: 0
WITNESS_EXECUTABLE_AT_LOCAL_CLOSURE: YES
```

## 4. Test inventory/assertion quality

```text
UNIT: REQUIRED_TEST_PRESENT
INVARIANT: REQUIRED_TEST_PRESENT
NEGATIVE_PATH: REQUIRED_TEST_PRESENT
PERSISTENCE: REQUIRED_TEST_PRESENT for local reconstruction contract
RECOVERY: REQUIRED_TEST_PRESENT
CONCURRENCY: REQUIRED_TEST_PRESENT
STALE: REQUIRED_TEST_PRESENT
IDEMPOTENCY: REQUIRED_TEST_PRESENT
CROSS_SPEC: AFFECTED_INTEGRATED_CHECKPOINT_DEFERRED for productive GIT
ARCHITECTURE_GUARD: TEST_CATEGORY_NOT_APPLICABLE; no dedicated guard required by design
REQUIRED_TESTS: 8
REQUIRED_TESTS_MISSING: 0
ASSERTION_QUALITY: STRONG
MISLEADING_OR_NON_ASSERTIVE_WITNESSES: 0
```

## 5. Failure/conditional dimensions

```text
CONCURRENCY: FULLY_CONFORMANT
STALE_BEHAVIOR: CONFORMANT
IDEMPOTENCY: CONFORMANT
RECOVERY: CONFORMANT locally
DURABILITY: NOT_APPLICABLE locally; PLAT integrated-only
COMPATIBILITY: NOT_APPLICABLE
MIGRATION: NOT_APPLICABLE
AUTHORITY_CONSUMPTION: CONSUMABLE locally; foreign GIT/PLAT DEFINED_BUT_NOT_CONSUMABLE
TEMPORAL_AUTHORITY: PROTECTED for local CAS; foreign remote reread deferred by dependency class
CALLER_SUPPLIED_AUTHORITY_BYPASSES: 0
REGRESSION_RESULT: NO_REGRESSION
```

## 6. Independent test execution

```text
prototype/node_modules/.bin/tsx.cmd --test tests/dom-001-ticket-007.test.ts
RESULT: 4 passed, 0 failed, 0 skipped

prototype/node_modules/.bin/tsx.cmd --test tests/*.test.ts
RESULT: 115 passed, 0 failed, 0 skipped

npm --prefix prototype test
RESULT: 92 passed, 0 failed, 0 skipped

prototype/node_modules/.bin/tsc.cmd --ignoreConfig --noEmit --strict --target ES2022 --module NodeNext --moduleResolution NodeNext src/domain/*.ts src/application/*.ts
RESULT: exit 0
```

```text
TESTS_RUN: 211 test-case executions
TESTS_PASSED: 211
TESTS_FAILED: 0
TESTS_SKIPPED: 0
ENVIRONMENTAL_FAILURES: 0
REGRESSIONS: 0
```

## 7. Re-audit reconciliation and result

```text
PREVIOUS_FINDINGS_TOTAL: 4
PREVIOUS_FINDINGS_RESOLVED: 4
PREVIOUS_FINDINGS_STILL_PRESENT: 0
PREVIOUS_FINDINGS_REGRESSED: 0
CURRENT_FINDINGS: 0
NEW_PREEXISTING_FINDINGS: 0
NEW_REMEDIATION_INTRODUCED_FINDINGS: 0
AUDIT_ESCAPE_COUNT: 0
DOMAIN_AUDIT_COMPLETE: YES
SPECIALIST_BEHAVIOR_RESULT: SPECIALIST_BEHAVIOR_PASS
```

```text
Audit: docs/tickets/SPEC-DOM-001/DOM-001-TICKET-007-implementation-behavior-audit.md

Specialist:
IMPLEMENTATION_BEHAVIOR

Ticket: DOM-001-TICKET-007

Required behavioral dimensions: 8

Required tests: 8

Required tests missing: 0

Required behaviors total: 10

Direct behavior witnesses: 10

Proxy-only behaviors: 0

Untested state transitions: 0

Unproven concurrency contracts: 0

Missing architecture guards: 0

Tests run: 211

Tests passed: 211

Tests failed: 0

Regressions: 0

Concurrency:
CONFORMANT

Stale behavior:
CONFORMANT

Idempotency:
CONFORMANT

Recovery:
CONFORMANT

Authority consumption:
CONSUMABLE locally; integrated GIT/PLAT remains DEFINED_BUT_NOT_CONSUMABLE

Temporal authority:
PROTECTED

Caller-as-authority bypasses: 0

Findings:
CRITICAL=0
MAJOR=0
MINOR=0
INFO=0

Domain audit complete:
YES

Specialist result:
SPECIALIST_BEHAVIOR_PASS
```
