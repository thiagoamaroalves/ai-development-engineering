# DOM-001-TICKET-005 — Implementation Behavior Audit / Re-audit 007

## 1. Specialist Result

```text
SPECIALIST_RESULT = SPECIALIST_BEHAVIOR_PASS
DOMAIN_AUDIT_COMPLETE = YES
AUDIT_MODE = READ_ONLY; INDEPENDENT; ADVERSARIAL; BEHAVIOR_FIRST; NEGATIVE_PATH_AWARE; REGRESSION_AWARE
```

## 2. Audit Inputs

```text
TICKET_ID = DOM-001-TICKET-005
AUDIT_ROUND = RE_AUDIT / 7
TICKET_PATH = docs/tickets/SPEC-DOM-001/DOM-001-TICKET-005-command-validation-rejection.md
IMPLEMENTATION_UNIT = DOM-IMP-05
REQUIREMENT_IDS = DOM-CMD-001
ACCEPTANCE_IDS = AC-DOM-011; T5-AC1..T5-AC7; contribution to AC-DOM-052
SPEC_PATH = docs/specs/SPEC-DOM-001-workflow-authority-and-governance.md
GAP_MATRIX_PATH = docs/specs/gap-matrices/SPEC-DOM-001-implementation-gap-matrix.md
IMPLEMENTATION_PLAN_PATH = docs/specs/implementation-plans/SPEC-DOM-001-implementation-plan.md
IMPLEMENTATION_DESIGN_PATH = docs/tickets/SPEC-DOM-001/DOM-001-TICKET-005-implementation-design.md
IMPLEMENTATION_BASELINE = HEAD 6b31bcee1591c8b2e6499a434950664077b2be01 plus assessed dirty worktree
CURRENT_HEAD = 6b31bcee1591c8b2e6499a434950664077b2be01
AUDIT_TARGET_HEAD = 6b31bcee1591c8b2e6499a434950664077b2be01 plus current assessed dirty worktree
AUDIT_BASIS_FINGERPRINT = 01978373A7C917D5872D093A1ADFA49A71F031DAB38B673F219A1FA35DD38E04
BASELINE_DRIFT_STATUS = DRIFT_ASSESSED
REASSESSMENT_COMPLETE = YES
FINDINGS_ARE_ACTIONABLE = YES
BASELINE_REMEDIATION_READINESS = READY
AUDIT_BASIS_STALE = NO
CHANGED_PRODUCTION_FILES = src/domain/command.ts; src/application/command.ts; src/application/pipeline.ts; src/application/command-authority.ts; src/application/composition.ts
CHANGED_TEST_FILES = tests/dom-001-ticket-005.test.ts; tests/dom-001-ticket-013.test.ts
RELEVANT_TEST_SUITES = tests/dom-001-ticket-005.test.ts; tests/dom-001-ticket-013.test.ts; tests/*.test.ts
```

## 3. Behavioral Applicability Matrix

| Dimension | Classification | Reason / result |
|---|---|---|
| `UNIT_BEHAVIOR` | `REQUIRED` | basis, policy, exact rejection, outcome and no-effect semantics are ticket-owned; conformant |
| `INTEGRATION_BEHAVIOR` | `AFFECTED` | T013 productive catalog/factory must feed T005; direct factory witness passes |
| `PERSISTENCE` | `AFFECTED` | local recorder port and rejection correlation are tested; physical PLAT persistence is downstream |
| `CONCURRENCY` | `REQUIRED` | expected-revision one-winner command contract; direct concurrent witness passes |
| `STALE_STATE` | `REQUIRED` | stale aggregate and semantic freshness drift must fail closed; direct witnesses pass |
| `IDEMPOTENCY` | `REQUIRED` | exact rejected replay cannot duplicate transition/effect; direct witness passes |
| `DURABILITY` | `AFFECTED` | PLAT durable journal/recovery is an integrated checkpoint and is not present locally |
| `RECOVERY` | `NOT_APPLICABLE` locally | restart/replay durability is owned by PLAT/CP-DOM-02; T005 local contract tests recorder idempotency only |
| `COMPATIBILITY` | `AFFECTED` | exact DOM family/code/no-effect meaning must remain stable for mappings; direct mapping witness passes |
| `MIGRATION_BEHAVIOR` | `NOT_APPLICABLE` | ticket declares a new canonical path and no legacy writer retirement |
| `NEGATIVE_PATHS` | `REQUIRED` | unknown, lifecycle, closure, verdict, malformed, stale, missing and source-disappearance cases are covered |

```text
REQUIRED_BEHAVIORAL_DIMENSIONS = 9
AFFECTED_BEHAVIORAL_DIMENSIONS = 2
NOT_APPLICABLE_DIMENSIONS = 2
```

## 4. Production Behavior Audit

| Required behavior | Production evidence | Classification |
|---|---|---|
| Build immutable canonical basis and reject malformed correlation/evidence | `src/domain/command.ts` `CommandBasis`, `CommandCorrelation`, `CommandPreconditionEvidence` | `IMPLEMENTED_CORRECTLY` |
| Obtain authority from the productive DOM producer, not caller precondition claims | `CanonicalCommandAuthorityStateCatalog`; `CanonicalCommandAuthorityStateSource`; `createAdvancePipelineHandler` | `IMPLEMENTED_CORRECTLY` |
| Preserve identity, stage, aggregate revision, four statuses and two freshness tokens | `CanonicalCommandAuthorityReader.observe` | `IMPLEMENTED_CORRECTLY` |
| Select exact five canonical failure codes/families | `CommandPreconditionPolicy`; `mapPipelineError` | `IMPLEMENTED_CORRECTLY` |
| Record rejection and preserve no state/effect mutation | `CanonicalCommandBoundary.reject`; `CommandRejectionRecorder` port | `IMPLEMENTED_CORRECTLY` at the local contract boundary |
| Re-observe authority before commit and reject semantic drift | `AdvancePipelineHandler.advance`; `detectDrift` | `IMPLEMENTED_CORRECTLY` |
| Preserve one-winner stale/CAS behavior | `PipelineRepository.advance` contract and T005 concurrent test | `IMPLEMENTED_CORRECTLY` at local repository contract |
| Preserve exact rejected replay semantics | rejection idempotency key and recorder behavior | `IMPLEMENTED_CORRECTLY` at local contract boundary |
| Consume a non-test productive source at runtime | factory requires `CanonicalCommandAuthorityStateCatalog`; T013 runtime tests exercise `src` catalog | `IMPLEMENTED_CORRECTLY` |

The physical PLAT journal, durable rejection record, restart/recovery and
physical CAS evidence remain an explicitly open integrated-only capability. It
is not a local T005 behavioral defect and is preserved for CP-DOM-02.

## 5. Acceptance Witness Audit

| Normative behavior | Direct operation | Direct witness | Result |
|---|---|---|---|
| Valid command | `AdvancePipelineHandler.handle` through `CanonicalCommandBoundary.execute` | T005 valid command test and T005 factory-source test | `DIRECT` |
| `UNKNOWN_SPEC` | source identity/status resolution and rejection path | T005 unknown identity, source-owned unknown and source-disappearance tests | `DIRECT` |
| `INELIGIBLE_REVISION` | catalog revision-state mapping and policy | T013 lifecycle negatives and T005 invalid-precondition matrix | `DIRECT` |
| `INVALID_DEPENDENCY_CLOSURE` | policy evidence evaluation | T005 invalid-closure and semantic-drift tests | `DIRECT` |
| `INVALID_COMMAND_BASIS` | basis validation, verdict mapping and invalid transition mapping | T005 malformed, invalid-target, verdict and mapping tests | `DIRECT` |
| `STALE_REVISION` | commit-time observation plus repository expected-revision CAS | T005 stale/concurrent and T013 pipeline-drift tests | `DIRECT` |
| Rejection record/no effect | `CanonicalCommandBoundary.reject` and recorder port | T005 no-effect/replay/recording tests | `DIRECT` |

```text
REQUIRED_BEHAVIORS_TOTAL = 7
DIRECT_BEHAVIOR_WITNESSES = 7
PROXY_ONLY_BEHAVIORS = 0
UNTESTED_STATE_TRANSITIONS = 0
UNPROVEN_CONCURRENCY_CONTRACTS = 0 for the local contract; physical PLAT CAS remains integrated-only
MISSING_ARCHITECTURE_GUARDS = 0
WITNESS_EXECUTABLE_AT_LOCAL_CLOSURE = YES for all seven local rows
```

The catalog-backed T005 composition test directly exercises source-owned
`UNKNOWN` and `KNOWN` facts while conflicting caller claims are ignored. T013
also directly exercises complete output, source removal, freshness variation,
factory composition, and runtime boundary rejection. These are executable
witnesses, not registration/listing or source-inspection proxies.

## 6. Test Inventory

| Category | Classification | Evidence |
|---|---|---|
| `UNIT` | `REQUIRED_TEST_PRESENT` | T005 focused suite |
| `INVARIANT` | `REQUIRED_TEST_PRESENT` | immutable values, no-effect and exact code assertions |
| `INTEGRATION` | `REQUIRED_TEST_PRESENT` | factory-created handler consumes catalog-backed source |
| `PERSISTENCE` | `REQUIRED_TEST_PRESENT` for local recorder contract | recorder and unchanged-state assertions; durable PLAT deferred |
| `CONCURRENCY` | `REQUIRED_TEST_PRESENT` | concurrent same-revision one-winner test |
| `STALE` | `REQUIRED_TEST_PRESENT` | stale revision, pipeline drift and freshness drift tests |
| `IDEMPOTENCY` | `REQUIRED_TEST_PRESENT` | exact rejected replay test |
| `RECOVERY` | `TEST_CATEGORY_NOT_APPLICABLE` locally | CP-DOM-02 / PLAT owns restart and durable recovery |
| `COMPATIBILITY` | `REQUIRED_TEST_PRESENT` | exact family/code mapping test |
| `NEGATIVE_PATH` | `REQUIRED_TEST_PRESENT` | malformed, unknown, lifecycle, closure, verdict, source disappearance and stale tests |
| `ARCHITECTURE_GUARD` | `REQUIRED_TEST_PRESENT` | T005 and T013 executable import/factory guards |

```text
REQUIRED_TESTS = 10
REQUIRED_TESTS_MISSING = 0
```

## 7. Assertion Quality

```text
ASSERTION_QUALITY = STRONG
ASSERTIONS_COVER = status, exact family/code, correlation, basis, noEffect,
  aggregate stage/revision, recorder calls, replay identity, source facts,
  freshness changes, immutability, and concurrent winner count
MISLEADING_PROXY_ASSERTIONS = 0
NON_ASSERTIVE_REQUIRED_TESTS = 0
```

The local fixtures are used only to prove the local contract. They are not
claimed as evidence of PLAT durability, restart recovery, physical CAS, or
foreign transport execution.

## 8. Negative and Failure Semantics

| Failure | Expected | Observed |
|---|---|---|
| malformed identity/evidence | recorded `INVALID_COMMAND_BASIS`; no advance | conformant |
| missing correlation | domain error; no unsafe rejection record | conformant |
| unknown canonical identity/source | recorded `UNKNOWN_SPEC`; no advance | conformant |
| proposed/superseded/revoked/invalidated revision | `INELIGIBLE_REVISION`; no effect | conformant |
| open/invalid closure | `INVALID_DEPENDENCY_CLOSURE`; no effect | conformant |
| incompatible/missing verdict | `INVALID_COMMAND_BASIS`; no effect | conformant |
| semantic freshness drift | `INVALID_COMMAND_BASIS`; no advance | conformant |
| pipeline revision/stage drift | `STALE_REVISION`; no advance | conformant |
| repository stale conflict | `STALE_REVISION`; no last-write-wins | conformant |
| exact rejected replay | same rejection meaning/record; no transition duplication | conformant |
| productive source disappears between observations | fail closed as `UNKNOWN_SPEC`; no advance | conformant |

## 9. Conditional Runtime Dimensions

```text
CONCURRENCY = FULLY_CONFORMANT for local expected-revision/CAS contract
STALE_STATE = CONFORMANT
IDEMPOTENCY = CONFORMANT for exact rejected replay at local recorder boundary
DURABILITY = PARTIAL_BY_DESIGN; productive PLAT evidence is integrated-only
RECOVERY = NOT_APPLICABLE locally; CP-DOM-02 owns restart/recovery
COMPATIBILITY = CONFORMANT for the DOM result contract
```

### Authority consumption and temporal validation

```text
CAP-DOM-COMMAND-AUTHORITY-OBSERVATION:
  AUTHORITY_STATUS = DEFINED
  CONTRACT_STATUS = DEFINED
  LOCAL_TESTABILITY = YES
  PRODUCTIVE_AVAILABILITY = YES
  DEPENDENCY_CLASS = REQUIRED_FOR_LOCAL_EXECUTION
  RESULT = AUTHORITY_CONSUMABLE locally

CAP-PLAT-SNAPSHOT-PIPELINE-PROVENANCE:
  AUTHORITY_STATUS = DEFINED
  CONTRACT_STATUS = DEFINED
  LOCAL_TESTABILITY = NO for physical capability
  PRODUCTIVE_AVAILABILITY = NO
  DEPENDENCY_CLASS = REQUIRED_FOR_INTEGRATED_PROOF
  RESULT = DEFINED_BUT_NOT_CONSUMABLE for integrated physical proof only
  BLOCKS_LOCAL_CLOSURE = NO
  DOWNSTREAM_CHECKPOINT = CP-DOM-02 / SPEC-PLAT-001

CALLER_AS_AUTHORITY_CHECK = PASS
CALLER_SUPPLIED_AUTHORITY_BYPASSES = 0
TEMPORAL_AUTHORITY_PROOF = PROTECTED for local DOM observation and T005 reread;
  physical PLAT integrity remains integrated-only
```

The command input's precondition fields are parsed/validated as request shape,
then discarded in favor of the catalog-backed observation. The current source
is re-read before the action and the repository independently checks the
expected aggregate revision. Neither CAS nor a local snapshot is treated as
semantic authority by itself.

## 10. Regression Audit

```text
REGRESSION_RESULT = NO_REGRESSION
BASELINE_COMPARISON = prior T005/T004 command and pipeline behavior preserved;
  remediation removed synthesized authority without changing canonical outcomes
PRODUCTIVE_TESTS = 103/103 PASS
T005_FOCUSED = 14/14 PASS
T013_FOCUSED = 12/12 PASS
STRICT_SOURCE_TYPECHECK = PASS
PROTOTYPE_LINT = PASS
PROTOTYPE_BUILD = PASS
TESTS_RUN = 129 executed test cases across focused and full commands
TESTS_PASSED = 129
TESTS_FAILED = 0
TESTS_SKIPPED = 0
ENVIRONMENTAL_FAILURES = 0
```

## 11. Findings

No current behavioral finding remains within the local T005 behavior domain.
The integrated PLAT durability/recovery limitation is preserved as the prior
canonical `IMA-MAJOR-002` finding; it is not reclassified as a local behavior
failure because its dependency class is `REQUIRED_FOR_INTEGRATED_PROOF`.

```text
CRITICAL_FINDINGS = 0
MAJOR_FINDINGS = 0
MINOR_FINDINGS = 0
INFO_FINDINGS = 0
```

## 12. Re-audit Reconciliation

```text
PREVIOUS_BEHAVIOR_PRODUCER_FINDING = RESOLVED
  Evidence: catalog-backed productive source, factory binding, source variation,
  source disappearance, and runtime negative-boundary tests.
PREVIOUS_INTEGRATED_PLAT_FINDING = PRESERVED_OPEN_CANONICAL_HANDOFF
  Evidence: no productive PLAT journal/recovery implementation exists; scope and
  integrated-only completion effects are unchanged.
REMEDIATION_REGRESSIONS = 0
NEW_BEHAVIOR_FINDINGS = 0
```

## 13. Specialist Summary

```text
Audit: docs/tickets/SPEC-DOM-001/DOM-001-TICKET-005-implementation-behavior-audit.md

Specialist:
IMPLEMENTATION_BEHAVIOR

Ticket: DOM-001-TICKET-005

Required behavioral dimensions: 9

Required tests: 10

Required tests missing: 0

Required behaviors total: 7

Direct behavior witnesses: 7

Proxy-only behaviors: 0

Untested state transitions: 0

Unproven concurrency contracts: 0

Missing architecture guards: 0

Tests run: 129

Tests passed: 129

Tests failed: 0

Regressions: 0

Concurrency:
CONFORMANT

Stale behavior:
CONFORMANT

Idempotency:
CONFORMANT

Recovery:
NOT_APPLICABLE

Authority consumption:
CONSUMABLE locally; PLAT integrated capability remains DEFINED_BUT_NOT_CONSUMABLE

Temporal authority:
PROTECTED locally

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
