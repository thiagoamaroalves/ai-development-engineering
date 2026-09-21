# EXEC-001-TICKET-001 — Implementation Behavior Audit

## 1. Audit identity and inputs

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
IMPLEMENTATION_BASELINE = 381218d5fbf8d969ee5ae5349b8f65c4cd5af7f9
CURRENT_HEAD = 2306d92defaf315c5b3daf7639164445fc5dc281
AUDIT_TARGET_HEAD = 2306d92defaf315c5b3daf7639164445fc5dc281
AUDIT_TARGET_STATE_FINGERPRINT = badcdee7af12b3df3c97732d2eb79e8bb73d3b69f9b8c024ff06fbe154f113f9
```

The target HEAD was independently confirmed with `git rev-parse HEAD`. The
working tree had a documentation-only overlay outside the production and test
subject; no production/test target drift was observed during this audit. The
pinned semantic state fingerprint is recorded unchanged above.

### Changed implementation subject

The baseline had no EXEC ticket implementation or ticket-specific test. The
implementation delta at the pinned target contains these production files:

```text
src/domain/exec-contract.ts
src/domain/exec-schema.ts
src/domain/exec-validation-evidence-internal.ts
src/application/exec-contract.ts
src/infrastructure/exec-schema-validator.ts
src/composition/exec-contract.ts
```

Changed test file:

```text
tests/exec-001-ticket-001.test.ts
```

The ticket's historical changed-file list names seven production files and an
older `exec-validation-authority*` path; the pinned repository actually has
six production files and `exec-validation-evidence-internal.ts`. The audit uses
repository content, not that stale list.

### Relevant executable suites

```text
TICKET_SUITE = node --experimental-strip-types --test tests/exec-001-ticket-001.test.ts
REGRESSION_SUITE = npm test
FOCUSED_STRICT_TYPECHECK = npx tsc --noEmit --strict --target ES2023 --module NodeNext --moduleResolution NodeNext --allowImportingTsExtensions --skipLibCheck --types node [six production files + ticket test]
PACKAGE_TYPECHECK = npm run typecheck
```

The focused suite directly imports the productive EXEC boundary and also
exercises the existing generic delegation consumer regression. `npm test`
exercises the repository's existing workflow-orchestrator regression suite.

## 2. Authority reconstruction

The applicable authority chain is:

```text
ADR-0003 revision 3, ACCEPTED
  → SPEC-PORTFOLIO-001 O-016
  → SPEC-EXEC-001 EXEC-ENVELOPE-001/002
  → GAP-001
  → EXEC-IMP-01 in the Implementation Plan
  → ticket AC-EXEC-001/002 and witness matrix
  → approved Implementation Design
  → pinned repository implementation and executable tests
```

The authority requires an identifiable JSON envelope and capability payload,
validation before structured consumption, all minimum envelope fields as
structured values, human text without operational authority, and
`CONTRACT_INVALID` fail-closed behavior. The ticket explicitly excludes
registry resolution, DOM identity/lifecycle, persistence, recovery, transport,
external effects, and downstream mappings. No foreign capability is required
for local closure; the unit-owned schema harness is `INFORMATIONAL` and
contract-testable locally.

## 3. Behavioral contract and applicability matrix

| Dimension | Classification | Contract and audit reason |
|---|---|---|
| `UNIT_BEHAVIOR` | REQUIRED | The ticket directly owns schema definitions, pair validation, minimum fields, structured consumption, and fail-closed result semantics. |
| `INTEGRATION_BEHAVIOR` | AFFECTED | The existing generic delegation consumer must not promote text-only output; the ticket includes a direct regression witness for that boundary. |
| `PERSISTENCE` | NOT_APPLICABLE | Validation creates no durable record, repository state, journal, or persisted identity. |
| `CONCURRENCY` | NOT_APPLICABLE | There is no mutable shared state, command reservation, or concurrent mutation in this unit. |
| `STALE_STATE` | NOT_APPLICABLE | No external revision or mutable authority is observed. |
| `IDEMPOTENCY` | NOT_APPLICABLE | Validation is side-effect free and is not a durable command or externally effective operation. |
| `DURABILITY` | NOT_APPLICABLE | There is no persistence boundary or completion claim dependent on durable state. |
| `RECOVERY` | NOT_APPLICABLE | No interrupted operation, replay, retry identity, or restart state is implemented. |
| `COMPATIBILITY` | AFFECTED | This is the `NEW_CANONICAL_PATH`; prototype/historical text remains non-authoritative and the generic consumer must reject text-only completion. |
| `MIGRATION_BEHAVIOR` | NOT_APPLICABLE | No migration, conversion, legacy write, or cutover operation is implemented. |
| `NEGATIVE_PATHS` | REQUIRED | Invalid schemas, missing fields, text-only input, malformed adapter results, thrown adapter failures, and partial pairs must fail closed. |

Required/affected dimensions inspected: `4` (unit, integration, compatibility,
and negative paths).

## 4. Acceptance witness matrix recalculation

The ticket's four normative witness rows were mapped to actual operations and
executed tests as follows:

| # | Required behavior / operation | Direct positive witness | Direct negative or isolation witness | Observed evidence | Local closure |
|---:|---|---|---|---|---|
| 1 | Validate both envelope and payload against identifiable schemas. | `accepts a valid identifiable envelope and capability payload as structured values`; `uses canonical JSON Schema documents through the compiled validation adapter`. | `rejects text-only and malformed input`; `rejects caller-selected schema authority`; `does not let a custom schema document mint canonical validation authority`. | `VALID` returns a pair carrying `exec-envelope@1.0.0` and `exec-capability-payload@1.0.0`; invalid inputs return `CONTRACT_INVALID`. | YES |
| 2 | Require the structured minimum fields. | Valid fixture contains and exposes all required envelope fields. | `rejects missing structured fields and never infers them from human text`; inherited/non-JSON/sparse values are also rejected. | Missing `functionalVerdict` returns `CONTRACT_INVALID` with a diagnostic issue; text is ignored. | YES |
| 3 | Consume valid input as a structured contract, not prose. | Valid result exposes typed schema references, envelope fields, payload identity, and structured data. | Text-only and omitted-field cases do not produce a `value`; the generic consumer regression does not generate a canonical output from text. | Structured result is immutable and no human text is consulted for omitted authority. | YES |
| 4 | Fail closed without approval, checkpoint, or effect implication. | A valid pair remains consumable only after both validations and value construction succeed. | One-side-invalid, malformed-result, thrown-adapter, forged-evidence, and text-only cases assert `CONTRACT_INVALID`, no partial `value`, and no-success flags; generic consumer asserts no generated effect artifact. | Normal failure paths are closed, but the exported evidence-registration seam permits an independently forged success path; see `BEH-CRITICAL-001`. | YES for the tested path; NO for the exposed authority-bypass variant |

```text
REQUIRED_BEHAVIORS_TOTAL = 4
DIRECT_BEHAVIOR_WITNESSES = 4
PROXY_ONLY_BEHAVIORS = 0
UNTESTED_STATE_TRANSITIONS = 0
UNPROVEN_CONCURRENCY_CONTRACTS = 0
MISSING_ARCHITECTURE_GUARDS = 1
```

The four rows have direct executable witnesses. The missing guard is not a
missing normative row; it is the untested and exploitable caller path through
the exported evidence registration hook. Source/import graph inspection alone
does not close that guard.

## 5. Production behavior audit

### 5.1 Positive and normal paths

- `ExecContractSchemaDefinitions` exposes deeply frozen, identifiable
  `exec-envelope@1.0.0` and `exec-capability-payload@1.0.0` JSON Schema
  documents (`src/domain/exec-schema.ts:35-116`).
- `JsonSchemaExecValidator.validate` rejects non-canonical definition objects,
  compiles the ticket-owned document, checks the exact input, requires own
  enumerable required properties, and issues evidence for the exact input and
  canonical reference (`src/infrastructure/exec-schema-validator.ts:94-125`).
- `ValidateExecContract.validate` invokes both validations, aggregates issues,
  constructs the structured values only after both results are valid, and
  returns one immutable validated pair (`src/application/exec-contract.ts:93-126`).
- `StructuredExecutionEnvelope` and `StructuredCapabilityPayload` enforce the
  schema identity, semver/identity/array/object constraints, JSON-only values,
  and immutable copies (`src/domain/exec-contract.ts:346-457`).
- The composition root wires the production application boundary to the JSON
  Schema adapter (`src/composition/exec-contract.ts:1-10`).

Normal valid behavior is `IMPLEMENTED_CORRECTLY` for the canonical composition
path. The schema-authority behavior as a whole is `PARTIAL`, because the
provenance check can be satisfied without the schema adapter through the
exported registration function described below.

### 5.2 Failure and negative paths

| Behavior | Classification | Observed semantics |
|---|---|---|
| Missing envelope/payload or non-object input | IMPLEMENTED_CORRECTLY | Application returns immutable `CONTRACT_INVALID`; no validated pair is exposed. |
| Invalid schema, unknown/custom definition, or wrong schema identity | IMPLEMENTED_CORRECTLY | Canonical definitions and references are enforced; custom definition substitution fails. |
| Missing minimum field or human-text fallback | IMPLEMENTED_CORRECTLY on canonical path | Schema and domain construction reject omission; `humanText` is never used to fill fields. |
| Invalid JSON-like value, inherited required property, sparse array, function, or bigint | IMPLEMENTED_CORRECTLY | Adapter/domain boundary returns `CONTRACT_INVALID`; own enumerable and JSON-only checks are exercised. |
| One side of pair invalid | IMPLEMENTED_CORRECTLY | Both validations are performed, but no partial `ValidatedExecContract` is returned. |
| Malformed adapter result or thrown adapter value | IMPLEMENTED_CORRECTLY | Normalization and catch boundary convert malformed/throwing adapters to a closed invalid result. |
| Forged/copy/prototype evidence | IMPLEMENTED_CORRECTLY for the tested shapes | WeakSet object identity rejects copied and prototype-shaped evidence. It does not reject a caller who can first call the exported registration hook. |
| Invalid result's approval/checkpoint/effect semantics | PARTIAL | Flags and discriminated result prevent those signals on normal failures; no direct effect API exists in this unit, and the authority-bypass path can produce `VALID` without schema execution. |
| Immutability and structured result | IMPLEMENTED_CORRECTLY | Returned pair, values, schema documents, and nested structured data are frozen or defensively cloned. |

### 5.3 Caller-as-authority and authority-issuer escape

`CALLER_AS_AUTHORITY_CHECK = FAIL`.

`src/domain/exec-validation-evidence-internal.ts:15-18` exports
`registerIssuedSchemaValidationEvidence(value)`. It accepts any object and adds
that object to the module's `WeakSet`; it does not authenticate that the
infrastructure adapter issued it or that a schema engine validated the exact
input. `src/domain/exec-contract.ts:314-323` treats membership in that set as
sufficient evidence, and `src/application/exec-contract.ts:113-125` trusts the
resulting evidence to construct a valid pair.

An independent runtime probe imported the registration function, created
lookalike evidence with the canonical schema references and exact input
objects, registered both objects, supplied an adapter returning those objects,
and called `ValidateExecContract.validate`. The result was:

```text
forged adapter result VALID e
```

No `JsonSchemaExecValidator` schema-engine operation was involved in that
successful call. The existing test only checks that several differently named
registration exports are absent (`tests/exec-001-ticket-001.test.ts:239-265`);
it does not check the actual exported `registerIssuedSchemaValidationEvidence`
function. This is a `CALLER_SUPPLIED_AUTHORITY_BYPASS`, not merely a weak test.

## 6. Authority, producer/consumer, and temporal proofs

### 6.1 Authority consumption proof

```text
CAPABILITY_ID = UNIT-EXEC-SCHEMA-HARNESS
AUTHORITY_EXISTENCE = YES; ADR-0003/O-016 and EXEC-ENVELOPE-001/002
TRUTH_OWNER = SPEC-EXEC-001 / EXEC-001
AUTHORITY_SEMANTIC_SOURCE = ADR-0003 JSON Schema envelope/payload decision and SPEC-EXEC-001 requirements
OWNER_DOMAIN_OR_BOUNDARY = EXEC-001
CONSUMPTION_CONTRACT = identifiable envelope/payload schemas and closed validation result
PORT_INTERFACE = ExecSchemaValidationPort
CONTRACT_PRODUCER = ticket-owned schema definitions plus JsonSchemaExecValidator
CONTRACT_CONSUMER = ValidateExecContract and later EXEC consumers
RETURNED_DATA = valid/invalid result, diagnostics, canonical schema reference, and structured contract values
VERSION_REVISION_TRANSPORT = schema references carry exec schema IDs and 1.0.0; contract-version support is outside this ticket
FAILURE_NOT_FOUND_STALE_SEMANTICS = invalid/unknown/custom schema and malformed input fail CONTRACT_INVALID; no stale authority applies
AUTHORITY_STATUS = DEFINED
CONTRACT_STATUS = DEFINED
SEMANTIC_STATUS = DEFINED
LOCAL_TESTABILITY = YES
PRODUCTIVE_AVAILABILITY = NO for the unit-owned local harness; this is not a foreign producer
CAPABILITY_SUMMARY_STATUS = CONTRACT_TESTABLE_LOCALLY
DEPENDENCY_CLASS = INFORMATIONAL
AVAILABILITY_EVIDENCE = focused direct schema operations at the consumer execution point
BLOCKING_EFFECT = NONE for local closure; no downstream capability promotion is claimed
PROOF_RESULT = AUTHORITY_CONSUMPTION_GAP for productive availability, with local contract semantics testable
```

Under the shared authority rules, `AUTHORITY_CONSUMABLE` is not valid when
`PRODUCTIVE_AVAILABILITY = NO`; the summary field is therefore
`DEFINED_BUT_NOT_CONSUMABLE`, not a behavioral pass. This does not block this
local ticket because the plan/ticket classify the unit-owned capability as
`INFORMATIONAL` and the local witness is explicitly contract-level. It does
not excuse the caller-mintable authority defect.

### 6.2 Producer/consumer contract proof

The producer/consumer contract is locally defined and testable, with no
foreign productive dependency. The productive composition producer is the
schema adapter, while the registration function is an unsafe additional issuer
that contradicts the intended single producer boundary:

```text
CAPABILITY_ID = UNIT-EXEC-SCHEMA-HARNESS
AUTHORITY_OWNER = SPEC-EXEC-001 / EXEC-001
INTENDED_PRODUCER = ticket-owned definitions + JsonSchemaExecValidator
UNAUTHORIZED_PRODUCER = any caller able to import registerIssuedSchemaValidationEvidence
PRODUCED_CONTRACT = canonical schema validation result and structured pair
CONSUMER = ValidateExecContract
SEMANTIC_STATUS = DEFINED, with issuer-boundary contradiction
LOCAL_TESTABILITY = YES
PRODUCTIVE_AVAILABILITY = NO for foreign/integrated producer
AVAILABILITY_CONDITION = local contract harness executable at closure
DEPENDENCY_CLASS = INFORMATIONAL
DEPENDENCY_EDGE = local schema contract → EXEC consumers
BLOCKING_EFFECT = NONE for capability availability; YES for the local behavioral authority invariant
```

### 6.3 Temporal authority

```text
TEMPORAL_AUTHORITY_PROOF = NOT_APPLICABLE
INITIAL_OBSERVATION = no mutable external authority
INDEPENDENT_SECOND_OBSERVATION = not applicable
DRIFT_DETECTION = not applicable
FAIL_CLOSED_BEHAVIOR = applicable only to input/schema validation, audited above
```

No caller-supplied lifecycle, ownership, canonical revision, or external
mutable-state value is used by the normal composition path. The failure above
is issuer provenance, not a temporal revalidation gap.

## 7. Test inventory and assertion quality

### 7.1 Required test categories

| Category | Classification | Evidence |
|---|---|---|
| `UNIT` | REQUIRED_TEST_PRESENT | 20 focused tests invoke the productive validation boundary. |
| `INVARIANT` | REQUIRED_TEST_PRESENT | Schema identity, minimum fields, immutable values, JSON-only values, and no-partial-result assertions. |
| `INTEGRATION` | REQUIRED_TEST_PRESENT | Generic delegation consumer regression is exercised in the focused ticket test. |
| `CROSS_SPEC` | TEST_CATEGORY_NOT_APPLICABLE | No foreign capability is required for local closure. |
| `CONCURRENCY` | TEST_CATEGORY_NOT_APPLICABLE | No mutable concurrent command or state exists. |
| `STALE` | TEST_CATEGORY_NOT_APPLICABLE | No external revision/stale-state operation exists. |
| `IDEMPOTENCY` | TEST_CATEGORY_NOT_APPLICABLE | Validation has no durable/external effect. |
| `RECOVERY` | TEST_CATEGORY_NOT_APPLICABLE | Restart/replay/recovery is explicitly outside scope. |
| `COMPATIBILITY` | REQUIRED_TEST_PRESENT | New canonical path and generic text-only consumer behavior are exercised. |
| `MIGRATION` | TEST_CATEGORY_NOT_APPLICABLE | No migration or conversion is implemented. |
| `NEGATIVE_PATH` | REQUIRED_TEST_PRESENT | Missing, malformed, text-only, forged, thrown, inherited, sparse, and one-side-invalid paths are executed. |
| `ARCHITECTURE_GUARD` | REQUIRED_TEST_PRESENT, INCOMPLETE | Import graph and prototype/copy attacks are guarded, but the exported registration issuer is not attacked. This yields `MISSING_ARCHITECTURE_GUARDS = 1`. |
| `CONFORMANCE` | REQUIRED_TEST_PRESENT | Generic delegation consumer does not turn text-only output into a generated canonical artifact. |

```text
REQUIRED_TEST_CATEGORIES = 7
REQUIRED_TESTS_MISSING = 0
```

The category is present where the authority requires it, but the architecture
guard is not complete against the actual public module surface.

### 7.2 Assertion-quality assessment

| Evidence | Quality | Reason |
|---|---|---|
| Valid structured pair tests | STRONG | Assert status, schema references, structured fields, and payload data through the productive boundary. |
| Missing/text-only/invalid tests | STRONG | Assert `CONTRACT_INVALID`, diagnostic issue/code, no `value`, and no approval/checkpoint/effect flags. |
| One-side-invalid and adapter failure tests | STRONG | Assert no partial validated result and normalized failure behavior. |
| Immutability/value tests | STRONG | Assert frozen result/value/data and defensive JSON handling. |
| Generic consumer regression | SUFFICIENT | Executes the consumer and asserts no generated canonical artifact; it is direct for that consumer behavior, not a schema-authority witness. |
| Import graph guard | SUFFICIENT | Executes the production composition path and traverses its imports, but source/import absence cannot prove all runtime authority paths. |
| Existing evidence prose | WEAK for the issuer claim | It states registration is private, while the actual module exports `registerIssuedSchemaValidationEvidence`; prose is contradicted by runtime behavior. |
| Ticket execution record | WEAK | Ticket claims `17/17`; the focused executable run and evidence files report 20/20. |

No required behavior is accepted solely from a test name or non-null assertion.
The canonical positive/negative operation tests are direct; the authority
issuer escape remains untested by the committed suite and was found by the
independent runtime probe.

## 8. Independent test execution record

### Focused ticket suite

```text
COMMAND = node --experimental-strip-types --test tests/exec-001-ticket-001.test.ts
TESTS_RUN = 20
TESTS_PASSED = 20
TESTS_FAILED = 0
TESTS_SKIPPED = 0
ENVIRONMENTAL_FAILURES = 0
```

### Repository regression suite

```text
COMMAND = npm test
TESTS_RUN = 25
TESTS_PASSED = 25
TESTS_FAILED = 0
TESTS_SKIPPED = 0
ENVIRONMENTAL_FAILURES = 0
```

### Static checks

```text
FOCUSED_STRICT_TYPECHECK = PASS; all six changed production files and the ticket test included
PACKAGE_TYPECHECK = PASS; repository script scope is .pi/extensions/**/*.ts and excludes ticket source
```

The independent authority-bypass probe was also executed outside the committed
suite and returned `VALID` after caller registration of lookalike evidence. It
is recorded as a failed behavioral security probe, not counted as a passing
suite test.

```text
TOTAL_SUITE_TESTS_RUN = 45
TOTAL_SUITE_TESTS_PASSED = 45
TOTAL_SUITE_TESTS_FAILED = 0
TOTAL_SUITE_TESTS_SKIPPED = 0
```

## 9. Negative and failure semantics

| Input/failure | Expected | Observed |
|---|---|---|
| Text-only envelope/payload | `CONTRACT_INVALID`; no approval, checkpoint, or effect implication | Correct on canonical path; direct test passes. |
| Missing minimum structured field with explanatory text | `CONTRACT_INVALID`; text cannot fill field | Correct; missing `functionalVerdict` is rejected. |
| Unknown/custom schema definition or caller schema identity | `CONTRACT_INVALID`; canonical schema cannot be substituted | Correct in tested composition and adapter paths. |
| Malformed validator result | `CONTRACT_INVALID`; no partial success | Correct. |
| Validator throws arbitrary/malformed value | `CONTRACT_INVALID`; no partial success | Correct. |
| Envelope valid but payload invalid | `CONTRACT_INVALID`; no partial pair | Correct. |
| Forged prototype/copied evidence | `CONTRACT_INVALID` | Correct for unregistered objects. |
| Caller imports and invokes exported evidence registration | Must still require actual schema validation | **Contradictory**: caller can register lookalike evidence and receive `VALID`; `BEH-CRITICAL-001`. |

There is no persistence mutation, external effect invocation, retry operation,
or recovery state in this unit. The failure path is therefore evaluated at the
validation/result boundary rather than a durable transaction boundary.

## 10. Regression, concurrency, stale, idempotency, durability, recovery,
and compatibility results

- **Regression:** `NO_REGRESSION` against the implementation baseline. The
  baseline had no EXEC production surface; the 25-test existing regression suite
  passed, and the generic delegation consumer remains unable to promote text
  into a generated canonical artifact.
- **Concurrency:** `NOT_APPLICABLE`. No mutable shared state or concurrent
  mutation is owned here.
- **Stale behavior:** `NOT_APPLICABLE`. No revision/CAS/stale-state contract is
  implemented.
- **Idempotency:** `NOT_APPLICABLE`. Repeated validation has no durable or
  external effect; command idempotency belongs outside the ticket.
- **Durability/persistence:** `NOT_APPLICABLE`. No state is persisted.
- **Recovery:** `NOT_APPLICABLE`. No restart, replay, or interrupted operation
  is implemented.
- **Compatibility:** `PARTIAL`. The canonical new path and generic consumer
  regression pass, but the authority issuer escape means the runtime boundary
  is not fully closed against alternate callers.

## 11. Findings

### BEH-CRITICAL-001 — Caller can mint schema-validation evidence through exported internal registration

```text
FINDING_ID = BEH-CRITICAL-001
SEVERITY = CRITICAL
FINDING_STATUS = OPEN
FINDING_CATEGORY = CALLER_SUPPLIED_AUTHORITY_BYPASS
TICKET = EXEC-001-TICKET-001
REQUIREMENTS = EXEC-ENVELOPE-001, EXEC-ENVELOPE-002
ACCEPTANCE_REFERENCES = AC-EXEC-001, AC-EXEC-002
CAPABILITY = UNIT-EXEC-SCHEMA-HARNESS
DEPENDENCY_CLASS = INFORMATIONAL
LOCAL_ACCEPTANCE_DEPENDENCY = YES; local acceptance requires schema-validation authority to be established only by the approved producer
LOCAL_ACCEPTANCE_REQUIRES_PRODUCTIVE_CAPABILITY = NO
EVIDENCE_TIMING = LOCAL_CLOSURE
LOCAL_CLOSURE_BLOCKING = YES
CLOSURE_OWNERSHIP = LOCAL_TICKET
DEPENDENCY_CLASS_RECLASSIFICATION_REQUIRED = NO
UPSTREAM_DEPENDENCY_CLASSIFICATION_PRESERVED = YES
BLOCKS_LOCAL_EXECUTION = YES
BLOCKS_LOCAL_CLOSURE = YES
BLOCKS_TICKET_DONE = YES
BLOCKS_INTEGRATED_PROOF = YES
BLOCKS_SPEC_FINAL_CONFORMANCE = YES
PRIMARY_ROUTE = IMPLEMENTATION_REMEDIATION
DOWNSTREAM_CHECKPOINT = independent implementation behavior re-audit
DOWNSTREAM_OWNER = implementation remediation and canonical ticket audit
SYSTEMIC_PATTERN = NO
```

**Required behavior:** Both envelope and payload must be validated by the
identifiable ticket-owned schemas before they are consumed as a contract. Only
the approved schema producer may establish successful validation authority;
caller input or caller-controlled proof cannot substitute for that authority.

**Production evidence:**

- `src/domain/exec-validation-evidence-internal.ts:15-18` exports
  `registerIssuedSchemaValidationEvidence` and adds any supplied object to the
  trusted `WeakSet` without verifying producer identity or schema execution.
- `src/domain/exec-contract.ts:314-323` accepts WeakSet membership as the
  evidence provenance check.
- `src/application/exec-contract.ts:113-125` constructs a valid pair from
  that evidence after the injected port returns it.

**Test evidence:** The committed tests reject unregistered forged objects and
an always-true adapter (`tests/exec-001-ticket-001.test.ts:205-345`), but the
claimed authority-boundary test (`:239-265`) checks different export names and
does not exercise the actual exported registration function. An independent
runtime probe imported the actual function, registered lookalike evidence for
the exact canonical references and input objects, supplied an adapter returning
those objects, and observed `status = VALID` without executing the JSON Schema
adapter.

**Observed result:** A caller can establish the trusted evidence bit and obtain
a successful `ValidatedExecContract` without schema-engine validation. The
normal composition root remains correct, but the application service's public
port is not fail-closed against this reachable authority issuer.

**Expected result:** Caller-created evidence, caller-selected adapters, copied
objects, prototypes, and arbitrary registration attempts must not establish
canonical schema-validation authority. A path without a real successful
schema validation must return `CONTRACT_INVALID` and no validated pair.

**Problem:** The registration hook is described as internal but is an exported
runtime function in a source module reachable by callers. Its only protection
is the TypeScript type annotation, which is erased at runtime; the function
accepts a structurally forged receipt and marks it trusted.

**Impact:** This bypasses the core `EXEC-ENVELOPE-001` authority invariant and
can make unvalidated contract data consumable as a valid result. The current
constructor checks duplicate many schema constraints, but that does not prove
or preserve the required schema-validation authority and would not protect
future schema rules. Downstream consumers can therefore receive a false valid
contract through the alternate port path.

**Minimum correction required:** Make evidence issuance unreachable to an
untrusted caller and bind successful evidence to the actual approved schema
validation execution/producer. Add a direct executable negative witness that
imports the real public productive surface, attempts the actual registration
path (or equivalent caller-controlled issuer), and proves `CONTRACT_INVALID`
without schema execution. Reconcile the completion evidence that currently
states issuance is private.

**Related locations:**

```text
src/domain/exec-validation-evidence-internal.ts:8-18
src/domain/exec-contract.ts:309-323
src/application/exec-contract.ts:98-126
tests/exec-001-ticket-001.test.ts:239-265, 267-345
docs/tickets/SPEC-EXEC-001/evidence/TICKET-001/AC-EXEC-001-structured-consumption.md
docs/tickets/SPEC-EXEC-001/evidence/TICKET-001/AC-EXEC-002-required-fields.md
docs/tickets/SPEC-EXEC-001/evidence/TICKET-001/AC-EXEC-002-fail-closed.md
```

Suggested completion effects are local and integrated blocking because the
same schema-authority invariant is required at local closure and by downstream
contract consumers. No dependency-class promotion is made; the upstream
`INFORMATIONAL` classification is preserved.

### BEH-MINOR-001 — Ticket execution bookkeeping undercounts the focused suite

```text
FINDING_ID = BEH-MINOR-001
SEVERITY = MINOR
FINDING_STATUS = OPEN
FINDING_CATEGORY = TEST_EVIDENCE_INTEGRITY
TICKET = EXEC-001-TICKET-001
REQUIREMENTS = EXEC-ENVELOPE-001, EXEC-ENVELOPE-002
ACCEPTANCE_REFERENCES = AC-EXEC-001, AC-EXEC-002
CAPABILITY = UNIT-EXEC-SCHEMA-HARNESS
DEPENDENCY_CLASS = INFORMATIONAL
LOCAL_ACCEPTANCE_DEPENDENCY = NO; executable evidence exists despite the stale scalar
LOCAL_ACCEPTANCE_REQUIRES_PRODUCTIVE_CAPABILITY = NO
EVIDENCE_TIMING = LOCAL_CLOSURE
LOCAL_CLOSURE_BLOCKING = NO
CLOSURE_OWNERSHIP = LOCAL_TICKET
DEPENDENCY_CLASS_RECLASSIFICATION_REQUIRED = NO
UPSTREAM_DEPENDENCY_CLASSIFICATION_PRESERVED = YES
BLOCKS_LOCAL_EXECUTION = NO
BLOCKS_LOCAL_CLOSURE = NO
BLOCKS_TICKET_DONE = NO
BLOCKS_INTEGRATED_PROOF = NO
BLOCKS_SPEC_FINAL_CONFORMANCE = NO
PRIMARY_ROUTE = TICKET_ARTIFACT_RECONCILIATION
DOWNSTREAM_CHECKPOINT = next canonical ticket-artifact re-audit
DOWNSTREAM_OWNER = ticket implementation audit owner
SYSTEMIC_PATTERN = NO
```

**Required behavior:** Completion evidence and execution records must report the
actual executable evidence accurately.

**Production evidence:** No production behavior is defective; this is a ticket
record/evidence defect.

**Test evidence:** The independent command
`node --experimental-strip-types --test tests/exec-001-ticket-001.test.ts`
reported 20 passing tests. The four evidence files also report `20/20`, while
the ticket's implementation execution record states `FOCUSED_TICKET_TEST = PASS
(17/17)`. The package regression suite independently reported 25/25.

**Observed result:** Runtime evidence is stronger than the stale ticket scalar,
but the ticket record does not mechanically reconcile with it.

**Expected result:** Ticket execution metrics should state 20/20 and preserve the
same command/result across the completion record and evidence files.

**Problem and impact:** Consumers of the ticket record can underestimate the
executed witness set and receive contradictory closure metadata. This does not
change the observed pass/fail result or create a local behavior blocker.

**Minimum correction required:** Reconcile the ticket execution record and any
linked completion metrics with the independently observed 20-test focused run;
do not alter production behavior.

**Related locations:**

```text
docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-001-envelope-schema-contract.md:27
  (Implementation Execution Record)
docs/tickets/SPEC-EXEC-001/evidence/TICKET-001/AC-EXEC-001-envelope-schema.md
docs/tickets/SPEC-EXEC-001/evidence/TICKET-001/AC-EXEC-001-structured-consumption.md
docs/tickets/SPEC-EXEC-001/evidence/TICKET-001/AC-EXEC-002-required-fields.md
docs/tickets/SPEC-EXEC-001/evidence/TICKET-001/AC-EXEC-002-fail-closed.md
```

## 12. Audit summary

Audit: `docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-001-behavior-audit.md`

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
MINOR=1
INFO=0

Domain audit complete:
YES

Specialist result:
SPECIALIST_BEHAVIOR_FINDINGS

AUDIT_TARGET_HEAD: 2306d92defaf315c5b3daf7639164445fc5dc281
AUDIT_TARGET_STATE_FINGERPRINT: badcdee7af12b3df3c97732d2eb79e8bb73d3b69f9b8c024ff06fbe154f113f9
DOMAIN_AUDIT_COMPLETE: YES
SPECIALIST_RESULT: SPECIALIST_BEHAVIOR_FINDINGS
