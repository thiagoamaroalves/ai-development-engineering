# EXEC-001-TICKET-001 — Implementation behavior audit

## Audit basis and identified inputs

```text
TICKET_ID = EXEC-001-TICKET-001
TICKET_PATH = docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-001-envelope-schema-contract.md
IMPLEMENTATION_UNIT = EXEC-IMP-01 — Envelope and schema contract
REQUIREMENT_IDS = EXEC-ENVELOPE-001, EXEC-ENVELOPE-002
ACCEPTANCE_IDS = AC-EXEC-001, AC-EXEC-002
SPEC_PATH = docs/specs/SPEC-EXEC-001-skill-contracts-and-capability-registry.md
GAP_MATRIX_PATH = docs/specs/gap-matrices/SPEC-EXEC-001-implementation-gap-matrix.md
IMPLEMENTATION_PLAN_PATH = docs/specs/implementation-plans/SPEC-EXEC-001-implementation-plan.md
IMPLEMENTATION_DESIGN_PATH = docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-001-implementation-design.md
TICKET_SET_AUDIT_PATH = docs/tickets/SPEC-EXEC-001/implementation-ticket-audit.md
IMPLEMENTATION_BASELINE = 381218d5fbf8d969ee5ae5349b8f65c4cd5af7f9
CURRENT_HEAD = 7bee020a59b0c44baebce8f73125672d5f87e920
AUDIT_TARGET_HEAD = 7bee020a59b0c44baebce8f73125672d5f87e920
AUDIT_TARGET_STATE_FINGERPRINT = e6328873c6f215a522d11911417c7fc64e74ab380fa67e56d2fa6423e347a5c7
WORKING_TREE_OVERLAY_AT_AUDIT_START = NONE
```

`HEAD` matched the pinned target and the working tree had no implementation or
 test overlay at the start of the audit. The implementation baseline contains
no EXEC ticket source; the target adds the six production modules and one
focused test listed below.

```text
CHANGED_PRODUCTION_FILES =
  src/application/exec-contract.ts
  src/composition/exec-contract.ts
  src/domain/exec-contract.ts
  src/domain/exec-schema.ts
  src/domain/exec-validation-evidence-internal.ts
  src/infrastructure/exec-schema-validator.ts
CHANGED_TEST_FILES =
  tests/exec-001-ticket-001.test.ts
RELEVANT_TEST_SUITES =
  node --experimental-strip-types --test tests/exec-001-ticket-001.test.ts
  npm test
  focused strict TypeScript compilation of the six production modules and ticket test
  npm run typecheck (repository package scope; does not include ticket source)
```

## Authority-chain reconstruction

The applicable chain is:

```text
ADR-0003 revision 3, ACCEPTED
  → Portfolio O-016
  → SPEC-EXEC-001 EXEC-ENVELOPE-001 / EXEC-ENVELOPE-002
  → GAP-001
  → EXEC-IMP-01
  → this ticket and approved implementation design
  → target repository implementation and executable tests
```

The authority requires an identifiable JSON-Schema envelope and capability
payload, structured minimum envelope fields, and no human-text authority. The
ticket explicitly excludes registry/version resolution, lifecycle, persistence,
recovery, transport, external effects, and downstream integrated conformance.
The unit-owned schema harness is `INFORMATIONAL`; no foreign productive
capability is required for local closure.

## Behavioral contract and applicability matrix

| Dimension | Classification | Evidence/reason |
|---|---|---|
| `UNIT_BEHAVIOR` | REQUIRED | This ticket owns schema definitions, validation, structured values, and the fail-closed result. |
| `INTEGRATION_BEHAVIOR` | AFFECTED | The composition boundary is productive and the existing generic delegation consumer must not promote text. |
| `PERSISTENCE` | NOT_APPLICABLE | No durable state, repository, journal, manifest, or storage operation exists. |
| `CONCURRENCY` | NOT_APPLICABLE | Validation has no mutable shared state or concurrent mutation contract. |
| `STALE_STATE` | NOT_APPLICABLE | No revision, predecessor, external basis, or compare-and-set operation is in scope. |
| `IDEMPOTENCY` | NOT_APPLICABLE | This is a side-effect-free validation call, not a durable command or effect. |
| `DURABILITY` | NOT_APPLICABLE | No completion or dependent observation is reported from persistence. |
| `RECOVERY` | NOT_APPLICABLE | There is no interrupted operation, restart, replay, or recovery record. |
| `COMPATIBILITY` | AFFECTED | The ticket is a `NEW_CANONICAL_PATH` and explicitly requires the generic text-only consumer regression boundary. |
| `MIGRATION_BEHAVIOR` | NOT_APPLICABLE | The ticket declares no legacy EXEC authority or conversion/cutover migration. |
| `NEGATIVE_PATHS` | REQUIRED | Text-only, missing-field, invalid-schema, malformed-adapter, forged-authority, and one-side-invalid inputs are required to fail closed. |

### Required behavioral operations

| Required behavior | Production operation and observed result | Classification |
|---|---|---|
| Both envelope and payload pass identifiable schemas before consumption | `ValidateExecContract.validate` invokes the two ticket-owned schema definitions through `ExecSchemaValidationPort`; the canonical adapter compiles and checks the frozen JSON Schemas, then construction requires both successful results. | `IMPLEMENTED_CORRECTLY` for the canonical adapter; evidence-provenance caveat is recorded in BEH-CRITICAL-001. |
| All minimum structured fields are required | `exec-schema.ts:80-131` declares all envelope/payload required fields; `StructuredExecutionEnvelope` and `StructuredCapabilityPayload` re-check structured values and reject missing or non-JSON values. | `IMPLEMENTED_CORRECTLY` for canonical validation. |
| Human text cannot supply omitted authority | `humanText` is not consumed by the application; text-only and missing-field inputs return `CONTRACT_INVALID`. | `IMPLEMENTED_CORRECTLY`. |
| Invalid input fails closed with no success, approval, checkpoint, or effect implication | `exec-contract.ts:489-527` emits an immutable `CONTRACT_INVALID` result with `noApproval`, `noCheckpoint`, and `noEffect`; application lines 105-128 expose no partial value. | `IMPLEMENTED_CORRECTLY` for canonical invalid inputs. |
| Validation evidence must prove canonical adapter execution | Domain recognition delegates to `isIssuedSchemaValidationEvidence`; its verifier accepts caller-defined evidence (see finding). | `UNSAFE_FAILURE_BEHAVIOR`. |

### Acceptance witness audit

The ticket's four normative witness rows were inspected against production
operations and executed tests. Each has a direct positive and negative witness;
registration/listing and source inspection were not counted as behavior proof.

```text
REQUIRED_BEHAVIORS_TOTAL = 4
DIRECT_BEHAVIOR_WITNESSES = 4
PROXY_ONLY_BEHAVIORS = 0
UNTESTED_STATE_TRANSITIONS = 0
UNPROVEN_CONCURRENCY_CONTRACTS = 0
MISSING_ARCHITECTURE_GUARDS = 1
```

| Witness row | Direct operation | Executed evidence | Result |
|---|---|---|---|
| Envelope and payload are schema-validatable | `ValidateExecContract.validate(validPair)` and invalid/text-only variants | Focused tests for valid pair, compiled documents, text-only, invalid schema, and one-side invalid | Direct witness; canonical path passes. |
| Minimum structured fields are required | Delete `functionalVerdict` or payload `data` before `validate` | Focused missing-field and partial-pair tests | Direct witness; `CONTRACT_INVALID`, no value. |
| Valid input is consumed as structured contract | Inspect returned schema references and structured fields | Focused valid-pair and structured-consumption assertions | Direct witness; immutable structured value returned. |
| Invalid contract fails closed | Invalid input through application boundary | Focused failure assertions and generic consumer regression | Direct witness; no success signals. |

The required architecture guard exists (productive import graph and forbidden
prototype/`.pi` dependency checks), but it does not cover a caller-defined
`evidenceType`/verifier. That missing adversarial guard is part of
`BEH-CRITICAL-001`, rather than a proxy for the four acceptance rows.

## Production semantic trace

### Success path

`src/composition/exec-contract.ts` selects `JsonSchemaExecValidator` and passes
it to `ValidateExecContract`. The application obtains immutable ticket-owned
definitions, validates the envelope and payload, aggregates both results, and
constructs the two structured values only after successful evidence checks.
`exec-schema.ts:80-163` supplies identifiable, deeply frozen documents with
`exec-envelope@1.0.0` and `exec-capability-payload@1.0.0`. The canonical adapter
at `exec-schema-validator.ts:103-145` compiles/checks those definitions. The
observable result is an immutable `ValidatedExecContract`; no persistence or
effect is performed.

### Failure paths

- Missing, text-only, malformed, schema-incompatible, non-JSON, inherited, or
  one-side-invalid input returns `INVALID`/`CONTRACT_INVALID`.
- A malformed adapter result or thrown adapter value is normalized to the same
  fail-closed result by `exec-contract.ts:21-55, 98-129`.
- The failure has immutable expected/observed references and explicit
  `noApproval`, `noCheckpoint`, and `noEffect` flags. No partial validated pair
  is exposed.
- Repeated validation, retry, durable identity, restart, and recovery behavior
  are not applicable because the operation has no external mutation.

### Production ownership and authority assessment

```text
AUTHORITY_CONSUMPTION_PROOF
CAPABILITY_ID = UNIT-EXEC-SCHEMA-HARNESS
AUTHORITY_OWNER = SPEC-EXEC-001 / EXEC-001
PRODUCER = ticket-owned schema definitions and validation boundary
CONSUMER = ValidateExecContract and later EXEC contract consumers
CONTRACT = identifiable envelope/payload schemas plus structured validation result
AUTHORITY_STATUS = DEFINED
CONTRACT_STATUS = DEFINED
SEMANTIC_STATUS = DEFINED
LOCAL_TESTABILITY = YES
PRODUCTIVE_AVAILABILITY = NO (the local harness/fixture is not a productive foreign producer)
CAPABILITY_SUMMARY_STATUS = CONTRACT_TESTABLE_LOCALLY
AUTHORITY_CONSUMPTION_RESULT = DEFINED_BUT_NOT_CONSUMABLE (productive-availability dimension)
AVAILABILITY_EVIDENCE = focused direct schema operations at the consumer execution point
DEPENDENCY_CLASS = INFORMATIONAL
LOCAL_CLOSURE_BLOCKING = NO for capability availability
LOCAL_ACCEPTANCE_REQUIRES_PRODUCTIVE_CAPABILITY = NO
UPSTREAM_DEPENDENCY_CLASSIFICATION_PRESERVED = YES
DEPENDENCY_CLASS_RECLASSIFICATION_REQUIRED = NO
```

Under the shared capability rule, the productive-availability dimension is not
promoted by the local harness. Accordingly, the summary result is
`DEFINED_BUT_NOT_CONSUMABLE` for that dimension, without making it a local
blocker because the Plan/Ticket class is `INFORMATIONAL` and local acceptance
uses the unit-owned contract operation.

```text
PRODUCER_CONSUMER_CONTRACT_PROOF = PRESENT for local contract semantics
TEMPORAL_AUTHORITY_PROOF = NOT_APPLICABLE
  initial authority basis = immutable ticket-owned schema definitions
  independent second observation = not required; no mutable authority precedes an effect
  drift detection/fail-closed = no external temporal basis in scope
CALLER_AS_AUTHORITY_CHECK = PASS for schema identity and human text; FAIL for evidence provenance
CALLER_SUPPLIED_AUTHORITY_BYPASS = 1
```

The caller cannot select an alternate schema identity through input: canonical
references and schema documents are fixed. Human text is ignored. However, the
public validation port can return caller-constructed evidence that the domain
recognizer incorrectly accepts; this is the authority bypass finding below.

## Test inventory and assertion-quality assessment

| Category | Classification | Evidence |
|---|---|---|
| `UNIT` | `REQUIRED_TEST_PRESENT` | Focused 20-test ticket suite exercises the production boundary. |
| `INVARIANT` | `REQUIRED_TEST_PRESENT` | Required fields, schema identity, immutability, JSON values, and complete-pair assertions. |
| `INTEGRATION` | `REQUIRED_TEST_PRESENT` | Generic delegation consumer regression is executed in the focused suite. |
| `COMPATIBILITY` | `REQUIRED_TEST_PRESENT` | New canonical path and text-only generic-consumer boundary are tested. |
| `NEGATIVE_PATH` | `REQUIRED_TEST_PRESENT` | Text-only, missing, malformed, inherited, non-JSON, adapter-failure, and partial-pair cases. |
| `ARCHITECTURE_GUARD` | `REQUIRED_TEST_PRESENT` but incomplete | Import-graph guard executes, but the caller-defined verifier case is not guarded. |
| `CONFORMANCE` | `REQUIRED_TEST_PRESENT` | Productive boundary and generic consumer assertions execute. |
| `CROSS_SPEC` | `TEST_CATEGORY_NOT_APPLICABLE` | No foreign capability is required for local closure. |
| `PERSISTENCE`, `CONCURRENCY`, `STALE`, `IDEMPOTENCY`, `RECOVERY`, `MIGRATION` | `TEST_CATEGORY_NOT_APPLICABLE` | Those runtime contracts are explicitly outside this unit. |

Assertions for the normal and negative acceptance paths are `STRONG`: they
assert discriminated status, schema identities, structured values, failure
code, absence of the success value, no-success signals, immutability, and
observable consumer behavior. The evidence files were reconciled to the
executed target commands rather than accepted as implementation claims. The
architecture guard is executable but `WEAK` for authority provenance because
its forged-evidence fixture only uses a hostile prototype without an
`evidenceType` verifier.

## Independent test execution

```text
TESTS_RUN = 45
TESTS_PASSED = 45
TESTS_FAILED = 0
TESTS_SKIPPED = 0
ENVIRONMENTAL_FAILURES = 0
```

| Command | Result |
|---|---|
| `node --experimental-strip-types --test tests/exec-001-ticket-001.test.ts` | 20 passed, 0 failed, 0 skipped |
| `npm test` | 25 passed, 0 failed, 0 skipped |
| Focused strict `tsc` over six production modules, composition root, and ticket test | PASS |
| `npm run typecheck` | PASS; package script scope is `.pi/extensions/**/*.ts`, not the ticket source |

The focused suite directly includes the generic consumer test and the
production import-graph guard. No required test category remained unexecuted.

## Regression result

```text
REGRESSION_RESULT = NO_REGRESSION
REGRESSIONS = 0
```

The implementation baseline had no EXEC source or focused test. The target
change is additive under `src/` and `tests/`; no existing production module was
modified. The directly affected generic delegation suite and the repository
regression suite both pass. This does not erase the local authority-provenance
finding.

## Conditional runtime dimensions

```text
CONCURRENCY = NOT_APPLICABLE
  No concurrent command or mutable shared state exists.
STALE_BEHAVIOR = NOT_APPLICABLE
  No revision/predecessor/CAS contract exists.
IDEMPOTENCY = NOT_APPLICABLE
  Validation has no durable command or external effect; repeated calls are not an idempotency contract.
PERSISTENCE = NOT_APPLICABLE
  No durable state or transaction boundary exists.
DURABILITY = NOT_APPLICABLE
  No completion is reported from a persistence operation.
RECOVERY = NOT_APPLICABLE
  No restart, replay, interrupted operation, or recovery identity exists.
COMPATIBILITY = CONFORMANT within scope
  New canonical source is additive and generic text-only consumption remains fail-closed.
MIGRATION = NOT_APPLICABLE
  No legacy EXEC authority or conversion is implemented.
TEMPORAL_AUTHORITY = NOT_APPLICABLE
```

## Findings

### BEH-CRITICAL-001 — Caller-defined validation verifier mints canonical evidence

```text
Severity = CRITICAL
Finding status = OPEN
Ticket = EXEC-001-TICKET-001
Requirement references = EXEC-ENVELOPE-001, EXEC-ENVELOPE-002
Acceptance references = AC-EXEC-001, AC-EXEC-002
Gap reference = GAP-001
Finding category = CALLER_SUPPLIED_AUTHORITY_BYPASS
Capability = UNIT-EXEC-SCHEMA-HARNESS / schema-validation authority
Dependency class = INFORMATIONAL
Local acceptance requires productive capability = NO
Closure ownership = LOCAL_TICKET
Evidence timing = LOCAL_TICKET_CLOSURE
LOCAL_CLOSURE_BLOCKING = YES
DEPENDENCY_CLASS_RECLASSIFICATION_REQUIRED = NO
UPSTREAM_DEPENDENCY_CLASSIFICATION_PRESERVED = YES
BLOCKS_LOCAL_EXECUTION = YES (the required authority-provenance witness is false)
BLOCKS_LOCAL_CLOSURE = YES
BLOCKS_TICKET_DONE = YES
BLOCKS_INTEGRATED_PROOF = YES
BLOCKS_SPEC_FINAL_CONFORMANCE = YES
PRIMARY_ROUTE = IMPLEMENTATION_REMEDIATION
DOWNSTREAM_CHECKPOINT = ticket local closure and downstream EXEC contract conformance
DOWNSTREAM_OWNER = SPEC-EXEC-001 / EXEC-001 canonical owner
Systemic pattern = NO
```

**Required behavior:** only evidence issued after successful canonical schema
validation for the exact input and canonical schema reference may construct a
consumable validated envelope/payload. A caller-provided port must not mint
that authority.

**Production evidence:** `src/domain/exec-validation-evidence-internal.ts:9-20`
reads a caller-controlled `evidenceType`, requires its prototype, then invokes
the prototype's caller-controlled `isCanonicalEvidence` method. It does not
check the adapter's private `#brand`. `src/domain/exec-contract.ts:309-324`
uses this recognizer before constructing values, and
`src/application/exec-contract.ts:113-125` trusts the port's evidence for both
sides. The canonical adapter's private token/brand exists at
`src/infrastructure/exec-schema-validator.ts:31-73`, but the recognizer does
not establish possession of it.

**Independent test evidence:** the repository's forged-evidence test at
`tests/exec-001-ticket-001.test.ts:270-348` rejects a simple hostile prototype,
but does not reject a frozen caller-defined verifier. At the pinned target, an
adversarial runtime probe supplied a port returning a frozen object whose
prototype had `isCanonicalEvidence() { return true }` and whose non-enumerable
`evidenceType` pointed to that caller-defined class. The probe called
`new ValidateExecContract(port).validate(validInput())` and observed
`status === 'VALID'` (the expected result is `INVALID`). No production schema
adapter execution occurred. The essential probe shape was:

```text
class FakeEvidence { isCanonicalEvidence() { return true } }
// frozen own fields: valid=true, issues=[], validatedInput=value,
// schemaReference=schema.reference; non-enumerable evidenceType=FakeEvidence
port.validate = (schema, value) => ({ valid: true, issues: [], evidence: forged })
observed = new ValidateExecContract(port).validate(validInput()).status
observed = VALID
```

**Observed result:** caller-controlled evidence can pass the domain authority
recognizer and produce a `ValidatedExecContract`.

**Expected result:** the same forged evidence must be rejected as
`CONTRACT_INVALID`, with no validated value or success signal, just as the
existing unproven-adapter test expects.

**Problem:** the implementation's claimed unforgeable evidence boundary is
structural rather than module-private: a caller can provide
the verifier function that the recognizer invokes. The current domain field
checks reject many malformed values, but they do not prove the required schema
operation and do not make future schema constraints safe from this bypass.

**Impact:** canonical schema-validation authority is not fail-closed. Any
consumer using the injectable validation port can receive a successful result
without the registered JSON Schema having validated the input, and the
architecture/conformance guard is therefore not reliable.

**Minimum correction required:** recognize evidence using an identity that
callers cannot mint (for example, an adapter-owned module-private `WeakSet` or
private brand checked inside the adapter-owned closure), and do not invoke a
caller-supplied verifier/prototype as proof. Add a direct executable test for a
frozen caller-defined `evidenceType` verifier and for an injected port returning
that evidence; both envelope and payload must remain `CONTRACT_INVALID`.

**Related locations:**

```text
src/domain/exec-validation-evidence-internal.ts:9-20
src/domain/exec-contract.ts:309-324, 389-409, 437-457
src/application/exec-contract.ts:98-125
src/infrastructure/exec-schema-validator.ts:31-73
tests/exec-001-ticket-001.test.ts:270-348
```

## Summary

Audit: docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-001-behavior-audit.md

Specialist:
IMPLEMENTATION_BEHAVIOR

Ticket: EXEC-001-TICKET-001

Required behavioral dimensions: 4

Required tests: 7

Required tests missing: 0

Required behaviors total: 4

Direct behavior witnesses: 4

Proxy-only behaviors: 0

Untested state transitions: 0

Unproven concurrency contracts: 0

Missing architecture guards: 1

Tests run: 45

Tests passed: 45

Tests failed: 0

Regressions: 0

Concurrency:
NOT_APPLICABLE

Stale behavior:
NOT_APPLICABLE

Idempotency:
NOT_APPLICABLE

Recovery:
NOT_APPLICABLE

Authority consumption:
DEFINED_BUT_NOT_CONSUMABLE

Temporal authority:
NOT_APPLICABLE

Caller-as-authority bypasses: 1

Findings:
CRITICAL=1
MAJOR=0
MINOR=0
INFO=0

Domain audit complete:
YES

Specialist result:
SPECIALIST_BEHAVIOR_FINDINGS

AUDIT_TARGET_HEAD: 7bee020a59b0c44baebce8f73125672d5f87e920
AUDIT_TARGET_STATE_FINGERPRINT: e6328873c6f215a522d11911417c7fc64e74ab380fa67e56d2fa6423e347a5c7
DOMAIN_AUDIT_COMPLETE: YES
SPECIALIST_RESULT: SPECIALIST_BEHAVIOR_FINDINGS
