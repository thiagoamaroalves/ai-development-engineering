# EXEC-001-TICKET-001 — Implementation Behavior Audit

## 1. Audit identity and inputs

```text
TICKET_ID = EXEC-001-TICKET-001
TICKET_PATH = docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-001-envelope-schema-contract.md
IMPLEMENTATION_UNIT = EXEC-IMP-01 — Envelope and schema contract
REQUIREMENT_IDS = EXEC-ENVELOPE-001, EXEC-ENVELOPE-002
ACCEPTANCE_IDS = AC-EXEC-001, AC-EXEC-002
ADR_PATH = docs/adrs/ADR-0003-versioned-skill-contracts.md (revision 3, ACCEPTED)
SPEC_PATH = docs/specs/SPEC-EXEC-001-skill-contracts-and-capability-registry.md
GAP_MATRIX_PATH = docs/specs/gap-matrices/SPEC-EXEC-001-implementation-gap-matrix.md
IMPLEMENTATION_PLAN_PATH = docs/specs/implementation-plans/SPEC-EXEC-001-implementation-plan.md
TICKET_SET_AUDIT_PATH = docs/tickets/SPEC-EXEC-001/implementation-ticket-audit.md
IMPLEMENTATION_BASELINE = 381218d5fbf8d969ee5ae5349b8f65c4cd5af7f9
CURRENT_HEAD = abaad147510b1dc670f92a52adecc44ce914c057
AUDIT_TARGET_HEAD = abaad147510b1dc670f92a52adecc44ce914c057
AUDIT_TARGET_STATE_FINGERPRINT = cd087614cfd53496c8cdd404fdbec69b44e853851b0df13a2d624f83b752ec8f
WORKING_TREE_OVERLAY = audit-document edits only; no production/test semantic overlay
```

The authority chain resolves the local contract to `O-016`, `GAP-001`,
`EXEC-ENVELOPE-001/002`, and the two ticket Acceptance Criteria. The approved
scope is identifiable envelope/payload schema validation, structured minimum
fields, non-authoritative text, and fail-closed `CONTRACT_INVALID` results.
Registry/version resolution, DOM identity/lifecycle, persistence, recovery,
transport, external effects, and downstream mappings are outside this audit's
local behavior subject.

### Changed implementation subject

```text
CHANGED_PRODUCTION_FILES =
  src/domain/exec-contract.ts
  src/domain/exec-schema.ts
  src/domain/exec-validation-evidence-internal.ts
  src/application/exec-contract.ts
  src/infrastructure/exec-schema-validator.ts
  src/composition/exec-contract.ts

CHANGED_TEST_FILES =
  tests/exec-001-ticket-001.test.ts

RELEVANT_TEST_SUITES =
  node --experimental-strip-types --test tests/exec-001-ticket-001.test.ts
  npm test (workflow-orchestrator regression suite)
  explicit strict tsc over the six production files and ticket test
  npm run typecheck (repository package scope)
```

The pinned source and test subject is clean relative to `AUDIT_TARGET_HEAD`.
The ticket's historical changed-file names for `exec-validation-authority*`
do not exist in the pinned implementation; the actual six production files
above are the executable subject audited here. This bookkeeping discrepancy is
not a runtime behavior result.

## 2. Reconstructed behavioral contract

| Behavior | Expected observable result | Production evidence | Classification |
|---|---|---|---|
| Both inputs are validated against identifiable ticket-owned schemas before consumption | A complete valid pair returns `VALID` with structured envelope and payload values | `ValidateExecContract.validate`; `ExecContractSchemaDefinitions`; `JsonSchemaExecValidator` | `IMPLEMENTED_CORRECTLY` |
| Required envelope fields are structured | Missing schema identity/version, contract version, execution/activity/assignment/cycle/attempt identity, round, status, verdict, checkpoints, artifacts, evidence, findings, requested effects, or errors is rejected | Envelope `required` list in `src/domain/exec-schema.ts`; domain constructors in `src/domain/exec-contract.ts` | `IMPLEMENTED_CORRECTLY` |
| Required payload fields are structured | Missing payload schema identity/version, capability identity, or object data is rejected | Payload `required` list and `StructuredCapabilityPayload.create` | `IMPLEMENTED_CORRECTLY` |
| Human text is not authority | Text-only input cannot produce a valid contract or success signal | `humanText` is not consumed by the application; focused text-only and generic-consumer tests | `IMPLEMENTED_CORRECTLY` |
| Invalid input fails closed | `CONTRACT_INVALID`, no validated pair, approval, checkpoint, or effect implication | `ContractInvalidFailure`, `invalidContract`, application normalization/catch path | `IMPLEMENTED_CORRECTLY` |
| Pair validation is complete | One valid side plus one invalid side cannot expose a partial result | Application constructs both values only after both results are valid; direct one-side-invalid test | `IMPLEMENTED_CORRECTLY` |
| Returned values are structured and immutable | Validated values preserve schema references and structured fields; mutation does not alter them | Deep clone/freeze in domain values and direct immutability assertions | `IMPLEMENTED_CORRECTLY` |
| Existing generic consumer does not promote prose | Text output does not become canonical completion or generated effect | Direct `.pi` consumer regression test | `IMPLEMENTED_CORRECTLY` |

## 3. Behavioral applicability matrix

`REQUIRED` and `AFFECTED` dimensions were inspected directly. Every
`NOT_APPLICABLE` row has a scope reason.

| Dimension | Applicability | Evidence / reason |
|---|---|---|
| `UNIT_BEHAVIOR` | `REQUIRED` | This ticket owns the synchronous schema/value/failure boundary. |
| `INTEGRATION_BEHAVIOR` | `AFFECTED` | The ticket contributes a structured result to consumers and includes the generic delegation consumer regression. |
| `PERSISTENCE` | `NOT_APPLICABLE` | No repository, storage, serialized record, durable identity, or persisted state is created or read. |
| `CONCURRENCY` | `NOT_APPLICABLE` | The operation has no shared mutable state, reservation, duplicate command, or concurrent mutation contract. |
| `STALE_STATE` | `NOT_APPLICABLE` | No mutable external authority, revision, predecessor, or compare-and-set state is observed. |
| `IDEMPOTENCY` | `NOT_APPLICABLE` | Validation is a side-effect-free operation, not a durable command or external effect. |
| `DURABILITY` | `NOT_APPLICABLE` | No completion or observation is reported from durable state. |
| `RECOVERY` | `NOT_APPLICABLE` | No interrupted operation, restart, replay, retry identity, or recovery record is introduced. |
| `COMPATIBILITY` | `AFFECTED` | This is a `NEW_CANONICAL_PATH`; prototype/text formats must not become alternate authority. |
| `MIGRATION_BEHAVIOR` | `NOT_APPLICABLE` | No legacy EXEC format is migrated or silently converted. |
| `NEGATIVE_PATHS` | `REQUIRED` | Invalid, missing, text-only, malformed, unproven, and one-side-invalid input must fail closed. |

## 4. Authority and capability proofs

### `AUTHORITY_CONSUMPTION_PROOF`

```text
CAPABILITY_ID = UNIT-EXEC-SCHEMA-HARNESS
AUTHORITY_EXISTENCE = YES; ADR-0003/O-016 and EXEC-ENVELOPE-001/002
TRUTH_OWNER = SPEC-EXEC-001 / EXEC-001
AUTHORITY_SEMANTIC_SOURCE = ticket-owned identifiable envelope/payload schemas
CONSUMPTION_CONTRACT = ExecSchemaValidationPort plus structured result boundary
PORT_INTERFACE = ExecSchemaValidationPort.validate
CONTRACT_PRODUCER = ticket-owned schema definitions and local validation adapter
CONTRACT_CONSUMER = ValidateExecContract and later EXEC consumers
RETURNED_DATA = schema validation result, canonical references, structured values, or CONTRACT_INVALID
VERSION_REVISION_TRANSPORT = schema reference carries schema ID and 1.0.0 version; registry support resolution is out of scope
FAILURE_NOT_FOUND_STALE_SEMANTICS = invalid/missing/unproven input fails CONTRACT_INVALID; no external stale authority applies
AUTHORITY_STATUS = DEFINED
CONTRACT_STATUS = DEFINED
LOCAL_TESTABILITY = YES
PRODUCTIVE_AVAILABILITY = NO for the recorded unit harness; it is not a foreign producer
CAPABILITY_SUMMARY_STATUS = CONTRACT_TESTABLE_LOCALLY
DEPENDENCY_CLASS = INFORMATIONAL
AVAILABILITY_EVIDENCE = direct production-boundary operations and focused executable tests
BLOCKING_EFFECT = NONE
```

The capability record is deliberately not promoted to productive availability.
Under the shared authority gate this is `DEFINED_BUT_NOT_CONSUMABLE` for a
productive-availability claim, while local contract semantics are directly
executable and the informational dependency does not block local closure.
No fixture, mock, or in-memory surface was promoted to a productive foreign
producer.

### `PRODUCER_CONSUMER_CONTRACT_PROOF`

```text
CAPABILITY_ID = UNIT-EXEC-SCHEMA-HARNESS
AUTHORITY_OWNER = SPEC-EXEC-001 / EXEC-001
PRODUCER = ticket-owned schema definition and validation boundary
PRODUCED_CONTRACT = identifiable envelope/payload validation result with structured fields
CONSUMER = ValidateExecContract and later EXEC consumers
CONSUMED_CAPABILITY = complete structured validated envelope/payload pair
SEMANTIC_STATUS = DEFINED
LOCAL_TESTABILITY = YES
PRODUCTIVE_AVAILABILITY = NO for the unit harness record
AVAILABILITY_CONDITION = local contract harness and productive ticket boundary execute at local closure
DEPENDENCY_CLASS = INFORMATIONAL
DEPENDENCY_EDGE = TICKET-001 local schema contract → EXEC consumers
```

The application obtains its own immutable definitions; caller text, caller
schema IDs, and custom schema documents do not establish authority. Plain
forged evidence and an always-true unproven adapter are rejected, but the
current evidence predicate accepts a caller-created object whose prototype
provides `isCanonicalEvidence() { return true }`. Therefore
`CALLER_AS_AUTHORITY_CHECK = FAIL` and `CALLER_SUPPLIED_AUTHORITY_BYPASS = 1`.
This bypass is reproduced directly below and is not inferred from names or
types.

### Temporal authority

`TEMPORAL_AUTHORITY_PROOF = NOT_APPLICABLE`. This operation does not observe
mutable external truth and then commit an effect. The adapter nevertheless
rechecks the exact input/reference pair before issuing its private branded
validation evidence; invalid post-validation input is rejected by the adapter
and no contract value is produced.

## 5. Production semantic trace

### Success path

1. `ValidateExecContract.validate` receives raw envelope and payload values.
2. It uses its private `ExecContractSchemaDefinitions` rather than caller
   supplied schema definitions.
3. It invokes `ExecSchemaValidationPort.validate` for the envelope and payload.
4. The productive `JsonSchemaExecValidator` accepts only canonical definition
   object/document identity, compiles the frozen JSON Schema documents, checks
   the exact input, requires own enumerable required fields, and issues
   adapter-private branded evidence.
5. Only when both normalized results are valid,
   `StructuredExecutionEnvelope.create` and `StructuredCapabilityPayload.create`
   enforce canonical schema references, exact schema identity, explicit valid
   evidence, required field semantics, JSON-only values, and immutable copies.
6. `ValidatedExecContract.create` returns the complete immutable pair. No
   persistence, approval, checkpoint, event, transport, or effect operation is
   invoked.

### Failure paths

| Input/failure | Expected | Observed |
|---|---|---|
| Text-only envelope/payload | `CONTRACT_INVALID`; no success/approval/checkpoint/effect | Confirmed by focused direct test and generic-consumer regression. |
| Missing envelope field | `CONTRACT_INVALID`; human text cannot fill it | Confirmed for `functionalVerdict`, with schema issue evidence. |
| Missing payload field / one-side-invalid pair | `CONTRACT_INVALID`; no partial `value` | Confirmed for missing `data`; no partial result is exposed. |
| Caller-selected schema IDs or custom schema document | Reject canonical authority substitution | Confirmed at application and adapter boundaries. |
| Always-true or plain forged validation port | Fail closed because evidence is not adapter-issued | Confirmed by direct injected-port and plain forged-evidence tests. A forged evidence object with a caller-defined `isCanonicalEvidence()` prototype method is accepted; this is the blocking finding below. |
| Malformed adapter result | `CONTRACT_INVALID` | Confirmed by normalized-result test. |
| Adapter throw, including malformed thrown value | `CONTRACT_INVALID`; safe bounded diagnostic only | Confirmed by direct thrown-value test. |
| Invalid semver/whitespace/non-JSON/inherited/sparse input | `CONTRACT_INVALID` | Confirmed by direct negative tests and domain construction guards. |
| Persistence/partial external effect/retry failure | Not applicable | No persistence or external effect exists in this unit. |

## 6. Acceptance witness audit

The ticket/design matrix has four normative witness rows. Each row has a
production operation, direct positive evidence, and direct negative/isolation
evidence. Registration/listing and source claims are not used as the behavior
witness.

| # | Normative behavior | Concrete operation | Direct positive witness | Direct negative/isolation witness | Executable at local closure | Result |
|---:|---|---|---|---|---|---|
| 1 | Envelope and payload are schema-validatable | `ValidateExecContract.validate` | valid identifiable pair returns `VALID` and schema references | text-only, invalid schema, custom schema, and unproven adapter reject | YES | direct |
| 2 | Minimum structured fields are required | same application operation | complete structured fields accepted | missing field returns `CONTRACT_INVALID`; text cannot fill it | YES | direct |
| 3 | Valid input is consumed as a structured contract | validated result consumption | structured fields and references are directly inspected | omitted authority/text cannot supply fields | YES | direct |
| 4 | Invalid contract fails closed | invalid application operation | valid result remains consumable | no approval/checkpoint/effect flags and no partial pair on rejection | YES | direct |

```text
REQUIRED_BEHAVIORS_TOTAL = 4
DIRECT_BEHAVIOR_WITNESSES = 4
PROXY_ONLY_BEHAVIORS = 0
UNTESTED_STATE_TRANSITIONS = 0
UNPROVEN_CONCURRENCY_CONTRACTS = 0
MISSING_ARCHITECTURE_GUARDS = 1
```

The architecture/conformance guard also executes the production composition
boundary, checks the complete productive import graph, limits the bare
schema-library dependency to the adapter, and exercises the generic consumer.
This is supplemental architecture evidence; it is not substituted for the
four direct behavior witnesses.

## 7. Test inventory and assertion quality

| Test category | Classification | Evidence |
|---|---|---|
| `UNIT` | `REQUIRED_TEST_PRESENT` | 20 direct ticket tests exercise domain/application/adapter behavior. |
| `INVARIANT` | `REQUIRED_TEST_PRESENT` | Required fields, canonical references, JSON-only values, immutability, and no-partial-result assertions. |
| `INTEGRATION` | `REQUIRED_TEST_PRESENT` | Generic delegation consumer is executed and text-only output is rejected as canonical completion. |
| `CROSS_SPEC` | `TEST_CATEGORY_NOT_APPLICABLE` | No foreign capability is required for local closure; downstream mappings are explicitly outside scope. |
| `CONCURRENCY` | `TEST_CATEGORY_NOT_APPLICABLE` | No concurrent state mutation exists. |
| `STALE` | `TEST_CATEGORY_NOT_APPLICABLE` | No external revision/basis authority exists in this unit. |
| `IDEMPOTENCY` | `TEST_CATEGORY_NOT_APPLICABLE` | No command or external effect exists. |
| `PERSISTENCE` | `TEST_CATEGORY_NOT_APPLICABLE` | No durable state exists. |
| `RECOVERY` | `TEST_CATEGORY_NOT_APPLICABLE` | No restart/replay/recovery behavior exists. |
| `COMPATIBILITY` | `REQUIRED_TEST_PRESENT` | New canonical path and non-authoritative generic/prototype/text boundary are exercised. |
| `MIGRATION` | `TEST_CATEGORY_NOT_APPLICABLE` | No legacy conversion or cutover operation exists. |
| `NEGATIVE_PATH` | `REQUIRED_TEST_PRESENT` | Text-only, missing, malformed, caller-selected, forged, inherited, sparse, non-JSON, and thrown-result cases. |
| `ARCHITECTURE_GUARD` | `REQUIRED_TEST_PRESENT` | Executable productive import-graph and authority-isolation guard exists, but it misses the current caller-defined prototype forgery (see BEH-CRITICAL-001). |
| `CONFORMANCE` | `REQUIRED_TEST_PRESENT` | File-addressed evidence plus direct runtime and strict typecheck output. |

```text
REQUIRED_TEST_CATEGORIES = 7
REQUIRED_TESTS_MISSING = 0
```

Assertion quality is `STRONG` for semantic valid/invalid results, canonical
failure codes, absence of `value`, no-approval/no-checkpoint/no-effect flags,
structured fields, immutability, and generic-consumer outcomes. The import
and dependency guard is `SUFFICIENT` as supplemental architecture evidence
because it both invokes the production boundary and checks the resolved
productive graph. No required behavior relies only on a test name, HTTP
success, non-null assertion, absence of an exception, or a proxy registration.

## 8. Independent test execution

| Execution | Result | Classification |
|---|---|---|
| `node --experimental-strip-types --test tests/exec-001-ticket-001.test.ts` | 20 passed, 0 failed, 0 skipped | Required ticket suite; all direct witnesses passed. |
| `npm test` | 25 passed, 0 failed, 0 skipped | Relevant workflow-orchestrator regression suite passed. |
| Explicit strict `tsc` over all six changed production files and ticket test | PASS | Static evidence; no type error. |
| `npm run typecheck` | PASS | Package-configured scope; no type error. |

An additional broad command, `node --experimental-strip-types --test tests/*.test.ts`,
started 33 test files: the 20 EXEC tests passed, while 13 unrelated DOM test
files failed during startup because the repository's Node strip-only command
cannot transform parameter properties and several tests import unavailable
`.js` artifacts. A second transform-types attempt likewise failed on those
unrelated `.js` imports. These are `ENVIRONMENTAL_FAILURES`, not failures of
this implementation or its required suites.

Two additional direct adversarial probes exercised the current evidence
predicate with a caller-created prototype method that returns `true`: the
low-level envelope/payload factories accepted the forged evidence, and an
injected validation port returned `VALID` without a schema-engine invocation.
Those probes are direct behavioral failures and are counted as the finding
below, not as environmental test failures.

```text
RELEVANT_TESTS_RUN = 45
RELEVANT_TESTS_PASSED = 45
RELEVANT_TESTS_FAILED = 0
RELEVANT_TESTS_SKIPPED = 0
ENVIRONMENTAL_FAILURES = 13 unrelated DOM test-file startup failures in broad exploratory scan
ADVERSARIAL_PROBES = 2
ADVERSARIAL_PROBE_FAILURES = 1 authority-bypass scenario (two observations of one root defect)
IMPLEMENTATION_FAILURES = 1
PREEXISTING_REGRESSIONS = 0
CROSS_SPEC_FAILURES = 0
```

## 9. Regression safety

The implementation baseline contained no productive EXEC schema/validator
surface. The pinned target adds only the authorized EXEC contract boundary and
its direct test/evidence files. The relevant existing workflow-orchestrator
suite passes 25/25, and the production import graph does not import DOM,
prototype, `.pi`, transport, persistence, or unrelated infrastructure.

```text
REGRESSION_RESULT = NO_REGRESSION
REGRESSIONS = 0
```

The unrelated DOM test startup failures do not exercise or import the changed
EXEC modules and are environmental/pre-existing for the attempted broad
command, not regressions attributable to this ticket.

## 10. Conditional runtime dimensions

| Dimension | Result | Evidence |
|---|---|---|
| Concurrency | `NOT_APPLICABLE` | No shared mutable state or concurrent mutation. |
| Stale state | `NOT_APPLICABLE` | No mutable external authority or domain revision is consumed. |
| Idempotency | `NOT_APPLICABLE` | Revalidation is side-effect-free and no durable command/effect is owned here. |
| Durability/persistence | `NOT_APPLICABLE` | No storage or durable completion claim. |
| Recovery | `NOT_APPLICABLE` | No restart, replay, partial-effect, or recovery record. |
| Compatibility | `CONFORMANT` | New canonical path rejects text and legacy/prototype formats as authority; generic consumer regression passes. The separate evidence-prototype bypass is reported as the local authority finding. |
| Authority consumption | `DEFINED_BUT_NOT_CONSUMABLE` | The recorded unit harness has local testability but productive availability `NO`; it is informational and not a local blocker. |
| Temporal authority | `NOT_APPLICABLE` | No observe-then-effect operation. |
| Caller-as-authority bypass | `1` | A caller-created prototype method can spoof the evidence predicate and reach structured consumption without schema-engine validation. |

One open behavioral finding is recorded below. The no-productive-availability
capability fact is preserved without silently promoting a fixture or converting
an informational dependency into a local blocker.

## 11. Findings

### BEH-CRITICAL-001 — Caller-defined evidence prototype can mint schema-validation authority

```text
FINDING_ID = BEH-CRITICAL-001
SEVERITY = CRITICAL
TICKET = EXEC-001-TICKET-001
REQUIREMENT_IDS = EXEC-ENVELOPE-001, EXEC-ENVELOPE-002
ACCEPTANCE_IDS = AC-EXEC-001, AC-EXEC-002
FINDING_CATEGORY = CALLER_SUPPLIED_AUTHORITY_BYPASS
CAPABILITY = UNIT-EXEC-SCHEMA-HARNESS
DEPENDENCY_CLASS = INFORMATIONAL
LOCAL_CLOSURE_BLOCKING = YES
LOCAL_ACCEPTANCE_REQUIRES_PRODUCTIVE_CAPABILITY = NO
CLOSURE_OWNERSHIP = LOCAL_TICKET
EVIDENCE_TIMING = LOCAL_CLOSURE
DEPENDENCY_CLASS_RECLASSIFICATION_REQUIRED = NO
UPSTREAM_DEPENDENCY_CLASSIFICATION_PRESERVED = YES
SUGGESTED_BLOCKS_LOCAL_EXECUTION = YES
SUGGESTED_BLOCKS_LOCAL_CLOSURE = YES
SUGGESTED_BLOCKS_TICKET_DONE = YES
SUGGESTED_BLOCKS_INTEGRATED_PROOF = YES
SUGGESTED_BLOCKS_SPEC_FINAL_CONFORMANCE = YES
PRIMARY_ROUTE = IMPLEMENTATION_REMEDIATION
DOWNSTREAM_CHECKPOINT = implementation remediation followed by independent behavior re-audit
DOWNSTREAM_OWNER = implementation-remediation owner and canonical implementation-audit workflow
SYSTEMIC_PATTERN = YES
FINDING_STATUS = OPEN
```

**Required behavior:** Only an approved canonical schema-validation operation
may issue consumable evidence for the exact ticket-owned schema/input pair;
forged evidence or an injected authority path must fail closed as
`CONTRACT_INVALID`.

**Production evidence:** `src/domain/exec-validation-evidence-internal.ts`
accepts any object with a prototype-own `isCanonicalEvidence` function and
returns that function's result. `src/domain/exec-contract.ts` then checks only
that result, `valid`, input identity, schema-reference identity, string issues,
and the four enumerable field names. It does not verify the actual adapter
prototype or an unforgeable private brand. A caller can therefore construct:

```ts
Object.assign(Object.create({ isCanonicalEvidence: () => true }), {
  valid: true,
  issues: [],
  validatedInput: input,
  schemaReference: canonicalReference,
})
```

The object is accepted by `StructuredExecutionEnvelope.create` and
`StructuredCapabilityPayload.create` without `JsonSchemaExecValidator`. The
same forged evidence returned by an injected `ExecSchemaValidationPort`
causes `ValidateExecContract.validate` to return `VALID` after two port calls,
without any schema-engine execution.

**Test evidence:** The focused ticket suite passes 20/20, but its forged-evidence
fixture uses an ordinary object with `Object.prototype` and therefore does not
exercise the current prototype predicate. Direct adversarial execution against
the pinned target accepted both forged low-level values and the forged
application result. The existing import/export guard checks former issuer names,
not this current caller-defined prototype route.

**Observed result:** Unvalidated material can be promoted to a structured
contract value and a `VALID` result through caller-created evidence. This
violates both schema validation before consumption and fail-closed rejection.

**Expected result:** Caller-created evidence, caller-defined prototype methods,
and all injected ports lacking proof from the approved schema adapter must be
rejected as `CONTRACT_INVALID` with no validated pair, approval, checkpoint, or
effect implication.

**Problem:** The predicate is presented as an adapter-private brand check, but
its only runtime trust decision is a caller-overridable method lookup. A
structural object can impersonate the adapter-issued evidence.

**Impact:** A caller can bypass canonical JSON Schema validation and establish
EXEC contract authority for downstream consumers. This is a direct
`CALLER_SUPPLIED_AUTHORITY_BYPASS` and a fundamental fail-closed invariant
violation.

**Minimum correction required:** Make evidence recognition depend on an
unforgeable adapter-owned brand or a closed exact-instance handoff that callers
cannot reproduce; verify the exact input/reference pair at the approved
adapter boundary; add a direct negative test using a caller-created prototype
method and assert `CONTRACT_INVALID`/no partial result through both domain and
application paths.

**Related locations:** `src/domain/exec-validation-evidence-internal.ts`,
`src/domain/exec-contract.ts`, `src/application/exec-contract.ts`,
`src/infrastructure/exec-schema-validator.ts`,
`tests/exec-001-ticket-001.test.ts`.

```text
CRITICAL_FINDINGS = 1
MAJOR_FINDINGS = 0
MINOR_FINDINGS = 0
INFO_FINDINGS = 0
```

## 12. Audit summary

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

AUDIT_TARGET_HEAD: abaad147510b1dc670f92a52adecc44ce914c057
AUDIT_TARGET_STATE_FINGERPRINT: cd087614cfd53496c8cdd404fdbec69b44e853851b0df13a2d624f83b752ec8f
DOMAIN_AUDIT_COMPLETE: YES
SPECIALIST_RESULT: SPECIALIST_BEHAVIOR_FINDINGS