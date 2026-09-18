# EXEC-001-TICKET-001 — Implementation Behavior Audit

## 1. Audit identity and pinned subject

```text
TICKET_ID = EXEC-001-TICKET-001
TICKET_PATH = docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-001-envelope-schema-contract.md
IMPLEMENTATION_UNIT = EXEC-IMP-01 — Envelope and schema contract
REQUIREMENT_IDS = EXEC-ENVELOPE-001, EXEC-ENVELOPE-002
ACCEPTANCE_IDS = AC-EXEC-001, AC-EXEC-002
SPEC_PATH = docs/specs/SPEC-EXEC-001-skill-contracts-and-capability-registry.md
GAP_MATRIX_PATH = docs/specs/gap-matrices/SPEC-EXEC-001-implementation-gap-matrix.md
IMPLEMENTATION_PLAN_PATH = docs/specs/implementation-plans/SPEC-EXEC-001-implementation-plan.md
IMPLEMENTATION_BASELINE = pinned HEAD 381218d5fbf8d969ee5ae5349b8f65c4cd5af7f9; no productive EXEC implementation or ticket test exists at the baseline
CURRENT_HEAD = 381218d5fbf8d969ee5ae5349b8f65c4cd5af7f9
AUDIT_TARGET_HEAD = 381218d5fbf8d969ee5ae5349b8f65c4cd5af7f9
AUDIT_TARGET_STATE_FINGERPRINT = 2e77021139ed96e08980a98b792164c6b9ce2c5f86043b0fcad3f9dbda1c2db8
TICKET_STATUS = VALIDATION_REQUIRED
DESIGN_VERDICT = IMPLEMENTATION_DESIGN_READY
DESIGN_GATE = IMPLEMENTATION_DESIGN_GATE: READY_FOR_IMPLEMENTATION
```

The implementation is an uncommitted working-tree overlay. The target state was
independently verified with the orchestrator semantic snapshot algorithm:
SHA-256 over sorted path/content rows, excluding `.pi/`, `skills/`, `.codex/`,
and the five authorized specialist/canonical audit artifacts. It covered 440
semantic files and produced the pinned fingerprint exactly. The repository
HEAD remained unchanged during the audit.

### Actual implementation and test overlay

```text
CHANGED_PRODUCTION_FILES =
  src/domain/exec-contract.ts
  src/domain/exec-schema.ts
  src/domain/exec-validation-evidence-internal.ts
  src/application/exec-contract.ts
  src/composition/exec-contract.ts
  src/infrastructure/exec-schema-validator.ts
CHANGED_TEST_FILES =
  tests/exec-001-ticket-001.test.ts
RELEVANT_TEST_SUITES =
  node --experimental-strip-types --test tests/exec-001-ticket-001.test.ts
  npm test
  focused strict TypeScript compilation for the six production modules and ticket test
  npm run typecheck (supplementary package scope)
```

The ticket's recorded changed-file names `exec-validation-authority.ts` and
`exec-validation-authority-internal.ts` do not exist in the current overlay;
the actual support module is `exec-validation-evidence-internal.ts`. This did
not prevent independent execution because the actual implementation graph was
available and typechecked.

## 2. Authority and behavioral contract

The authority chain was reconstructed as:

```text
ADR-0003 revision 3 ACCEPTED
  → SPEC-EXEC-001 revision 3
  → GAP-001 / EXEC-ENVELOPE-001, EXEC-ENVELOPE-002
  → EXEC-IMP-01 in the implementation plan
  → this ticket and approved implementation design
  → repository implementation and executable tests
```

Relevant authority is `docs/adrs/ADR-0003-versioned-skill-contracts.md`,
`docs/specs/SPEC-EXEC-001-skill-contracts-and-capability-registry.md`, the
validated Gap Matrix `GAP-001`, and Plan unit `EXEC-IMP-01`. The ticket owns
identifiable envelope/payload schema shape and the fail-closed validation
result. DOM identity/lifecycle, registry/version resolution, persistence,
recovery, transport, external effects, and downstream mappings remain outside
this ticket.

### Authority capability records

`AUTHORITY_CONSUMPTION_PROOF = ACP-EXEC-01` and
`PRODUCER_CONSUMER_CONTRACT_PROOF = PCP-EXEC-01` were reconciled without
promotion:

```text
CAPABILITY_ID = UNIT-EXEC-SCHEMA-HARNESS
AUTHORITY_OWNER = SPEC-EXEC-001 / EXEC-001
PRODUCER = ticket-owned schema definition and validation boundary
CONSUMER = ValidateExecContract and later EXEC consumers
CONTRACT = identifiable envelope/payload validation result and structured fields
AUTHORITY_STATUS = DEFINED
CONTRACT_STATUS = DEFINED
SEMANTIC_STATUS = DEFINED
LOCAL_TESTABILITY = YES
PRODUCTIVE_AVAILABILITY = NO (a local fixture/harness is not a productive foreign producer)
CAPABILITY_SUMMARY_STATUS = CONTRACT_TESTABLE_LOCALLY
DEPENDENCY_CLASS = INFORMATIONAL
AVAILABILITY_EVIDENCE = direct schema operations at the consumer execution point
BLOCKING_EFFECT = NONE for capability availability
RESULT = authority is defined and locally testable; productive availability is not claimed
```

No foreign capability is required for local closure. The absent productive
availability therefore is not a local capability blocker, but it is not
reported as `AUTHORITY_CONSUMABLE`; fixture evidence is not productive
availability evidence.

`TEMPORAL_AUTHORITY_PROOF = NOT_APPLICABLE`: the operation reads immutable
*ticket-owned* schema definitions and performs no external mutable-authority
observation followed by an effect. `CALLER_AS_AUTHORITY_CHECK` passes for
schema identity and human text on the concrete composition path, but the
adversarial caller-supplied adapter path is reported in BEH-MAJOR-001 below.

## 3. Behavioral applicability matrix

| Dimension | Classification | Evidence / reason |
|---|---|---|
| `UNIT_BEHAVIOR` | REQUIRED | The ticket directly owns schema identity, required structured fields, pair validation and the `CONTRACT_INVALID` result. |
| `INTEGRATION_BEHAVIOR` | AFFECTED | The existing generic delegation consumer must not promote text-only output to canonical completion or effects. |
| `PERSISTENCE` | NOT_APPLICABLE | No repository, durable record, serializer, index or persisted identity is introduced. |
| `CONCURRENCY` | NOT_APPLICABLE | Validation creates no shared mutable state and performs no concurrent mutation or compare-and-set operation. |
| `STALE_STATE` | NOT_APPLICABLE | There is no revision, mutable authority basis, predecessor or stale-state transition in this ticket. |
| `IDEMPOTENCY` | NOT_APPLICABLE | This is a side-effect-free validation query, not a command that creates canonical state or an external effect. |
| `DURABILITY` | NOT_APPLICABLE | No completion or dependent observation is reported from durable state. |
| `RECOVERY` | NOT_APPLICABLE | No interrupted operation, restart, replay or recovery record exists in scope. |
| `COMPATIBILITY` | AFFECTED | This is `NEW_CANONICAL_PATH`; human text, prototype shapes and generic consumer output must not become alternate EXEC authority. |
| `MIGRATION_BEHAVIOR` | NOT_APPLICABLE | The ticket declares no legacy migration, conversion or retirement operation. |
| `NEGATIVE_PATHS` | REQUIRED | Invalid schema, missing fields, text-only input, unproven adapter results, thrown adapter errors and one-sided invalid pairs must fail closed. |

## 4. Production semantics audit

### Canonical productive path

`src/domain/exec-schema.ts:80-130` defines deeply frozen identifiable
JSON Schema 2020-12 documents. The envelope requires schema identity,
contract version, execution/activity/assignment/cycle/attempt identities,
round/status/verdict, checkpoints, artifacts, evidence, findings, requested
effects and errors. The payload requires schema identity, schema version,
capability identity and structured data. `ExecContractSchemaDefinitions` keeps
canonical reference/document object identity, and
`isCanonicalExecSchemaDefinition` rejects copied or caller-substituted schema
documents.

`src/infrastructure/exec-schema-validator.ts:20-51` compiles only those
canonical definitions and returns explicit evidence only after the compiled
validator accepts the exact input/reference pair. Invalid, malformed or
exceptional adapter paths return `valid: false` with issues.

`src/application/exec-contract.ts:93-130` invokes envelope and payload
validation, rejects malformed results, requires both valid results, constructs
both structured values, and catches construction/adapter failures as
`CONTRACT_INVALID`. `humanText` is not read as an authority source.

`src/domain/exec-contract.ts:346-409` and `420-457` enforce typed fields,
semantic-version syntax, opaque non-empty identities, structured arrays/data,
canonical schema references, explicit successful validation evidence and
immutable values. `ValidatedExecContract` accepts only branded validated values.
`ContractInvalidFailure` exposes `CONTRACT_INVALID`, immutable expected and
observed contract references, and `noApproval`, `noCheckpoint` and `noEffect`
flags.

### Production classifications

| Required behavior | Classification | Observed semantics |
|---|---|---|
| Accept a valid pair only through identifiable envelope and payload schemas | `PARTIAL` | The normal composition path returns an immutable structured pair, but inherited required fields can satisfy the compiled schema and an exported internal evidence issuer also permits a caller-controlled alternate port; see BEH-MAJOR-001. |
| Reject missing minimum structured fields and text-only input as `CONTRACT_INVALID` | `PARTIAL` | Ordinary missing/text-only inputs are rejected, but an inherited missing field is accepted when supplied through `Object.prototype` or the caller-minted evidence path. |
| Consume valid input as structured fields; human text cannot supply omitted authority | `PARTIAL` | Canonical execution returns typed structured fields and ignores `humanText`; inherited values and the direct factory/application evidence path can bypass the required-own-field boundary. |
| Fail closed without approval, checkpoint, effect or partial validated pair | `PARTIAL` | Ordinary invalid, malformed and thrown-adapter paths fail closed and the generic consumer regression prevents text-only completion; the inherited-field path exposes `VALID` for schema-invalid input. |

### Acceptance witness audit

| Required behavior | Direct positive witness | Direct negative/isolation witness | Local witness result |
|---|---|---|---|
| Envelope and payload are schema-validatable | `accepts a valid identifiable envelope and capability payload as structured values`; `uses canonical JSON Schema documents...` | `rejects text-only and malformed input...`; caller/custom-schema and one-side-invalid tests | Direct and executable; canonical path passes. |
| Minimum structured fields are required | Valid pair test and compiled required-field schema | `rejects missing structured fields and never infers them from human text`; malformed/non-JSON tests | Direct and executable; canonical path passes, bypass finding remains. |
| Valid input is consumed as a structured contract | Valid pair and structured field assertions | Missing field plus human text; caller-selected schema and unproven adapter tests | Direct and executable; canonical path passes, bypass finding remains. |
| Invalid contract fails closed | Valid result remains a structured pair only after both validations | Text-only, invalid schema, malformed/throwing adapter, one-side-invalid and no-success-signal tests | Direct and executable; concrete path passes, bypass path is not closed. |

```text
REQUIRED_BEHAVIORS_TOTAL = 4
DIRECT_BEHAVIOR_WITNESSES = 4
PROXY_ONLY_BEHAVIORS = 0
UNTESTED_STATE_TRANSITIONS = 0
UNPROVEN_CONCURRENCY_CONTRACTS = 0
MISSING_ARCHITECTURE_GUARDS = 1 (no guard against caller use of the exported internal evidence issuer)
WITNESS_EXECUTABLE_AT_LOCAL_CLOSURE = YES for all four matrix rows
```

The generic delegation test is a direct integration/conformance witness, not a
proxy: it executes `runFullWorkflow`, returns text-only child output, asserts
`INCOMPLETE_CANONICAL_RESULT`, and asserts that no canonical file/effect is
created.

## 5. Required test inventory and assertion quality

| Category | Classification | Evidence quality/result |
|---|---|---|
| `UNIT` | `REQUIRED_TEST_PRESENT` | Strong direct application-boundary assertions. |
| `INVARIANT` | `REQUIRED_TEST_PRESENT` | Strong assertions for schema identity, required fields, immutability, JSON shape and pair completeness. |
| `INTEGRATION` | `REQUIRED_TEST_PRESENT` | Sufficient direct generic delegation consumer regression. |
| `CROSS_SPEC` | `TEST_CATEGORY_NOT_APPLICABLE` | No foreign contract is required for local closure. |
| `PERSISTENCE` | `TEST_CATEGORY_NOT_APPLICABLE` | No persistence behavior exists. |
| `CONCURRENCY` | `TEST_CATEGORY_NOT_APPLICABLE` | No concurrent mutation contract exists. |
| `STALE` | `TEST_CATEGORY_NOT_APPLICABLE` | No stale revision behavior exists. |
| `IDEMPOTENCY` | `TEST_CATEGORY_NOT_APPLICABLE` | No command/effect or durable canonical state exists. |
| `RECOVERY` | `TEST_CATEGORY_NOT_APPLICABLE` | No restart/replay/recovery behavior exists. |
| `COMPATIBILITY` | `REQUIRED_TEST_PRESENT` | Generic consumer and forbidden-authority/import checks exercise the new canonical boundary. |
| `MIGRATION` | `TEST_CATEGORY_NOT_APPLICABLE` | No migration/cutover operation is in scope. |
| `NEGATIVE_PATH` | `REQUIRED_TEST_PRESENT` | Strong direct rejection assertions for invalid, missing, text-only, malformed and unproven results. |
| `ARCHITECTURE_GUARD` | `REQUIRED_TEST_PRESENT` | The executable import-graph guard is present, but it does not cover the caller-mintable internal evidence issuer; this is the missing guard counted above. |
| `CONFORMANCE` | `REQUIRED_TEST_PRESENT` | Direct schema identity and generic delegation conformance witnesses pass on the canonical path. |

The focused tests assert semantic status, canonical failure code, expected and
observed references, no-approval/no-checkpoint/no-effect flags, no partial
value, immutable results, schema identity and the generic consumer's canonical
stop. They do not merely assert non-null values or absence of exceptions.
The issuer bypass is an assertion-coverage and production-authority defect,
not a green-test inference.

## 6. Independent test execution

Execution was performed independently of the ticket's recorded execution
claims.

```text
TEST_COMMAND_1 = node --experimental-strip-types --test tests/exec-001-ticket-001.test.ts
TEST_RESULT_1 = PASS; 20 passed, 0 failed, 0 skipped

TEST_COMMAND_2 = npm test
TEST_RESULT_2 = PASS; 24 passed, 0 failed, 0 skipped

TEST_COMMAND_3 = npx tsc --noEmit --strict --allowImportingTsExtensions --target ES2022 --module NodeNext --moduleResolution NodeNext --skipLibCheck src/domain/exec-contract.ts src/domain/exec-schema.ts src/domain/exec-validation-evidence-internal.ts src/application/exec-contract.ts src/infrastructure/exec-schema-validator.ts src/composition/exec-contract.ts tests/exec-001-ticket-001.test.ts
TEST_RESULT_3 = PASS; no diagnostics

TEST_COMMAND_4 = npm run typecheck
TEST_RESULT_4 = PASS; supplementary package scope only (.pi/extensions/**/*.ts)

ADVERSARIAL_RUNTIME_PROBE = PASS (defect reproduced): with
functionalVerdict absent as an own property but present on Object.prototype,
the concrete createExecContractValidator path returned VALID and the returned
structured object had no own functionalVerdict property. A second probe
imported the exported issueSchemaValidationEvidence helper and injected an
alternate port, reproducing the same VALID result.

TESTS_RUN = 44
TESTS_PASSED = 44
TESTS_FAILED = 0
TESTS_SKIPPED = 0
ENVIRONMENTAL_FAILURES = 0
```

The ticket's embedded execution record says `17/17` and `23/23`; those counts
are stale relative to the current overlay. Independent execution is the
accepted evidence: 20 focused tests and 24 repository regression tests.

## 7. Negative and failure behavior

| Failure/input | Expected | Observed on concrete path | Result |
|---|---|---|---|
| Text-only envelope/payload | `CONTRACT_INVALID`; no success, approval, checkpoint or effect | `INVALID`, canonical code and all three no-* flags true | Conformant. |
| Missing required structured field with human text | `CONTRACT_INVALID`; text cannot fill the field | `INVALID`; issue names the missing field; no validated value | Conformant on concrete path. |
| Invalid schema identity/custom schema | Reject without caller authority | `INVALID`; canonical definitions and references remain ticket-owned | Conformant on concrete path. |
| One side valid and one side invalid | No partial pair | `INVALID`; no `value` member | Conformant. |
| Malformed adapter result | Fail closed | `INVALID` with structured failure | Conformant. |
| Adapter throws | Fail closed; no effect signal | `INVALID`, no approval/checkpoint/effect | Conformant. |
| Always-true/unproven adapter | Must not mint success | `INVALID` when evidence is absent/forged structurally | Conformant only until the exported issuer is used. |
| Missing own required field supplied only through `Object.prototype` | `CONTRACT_INVALID` | `VALID` from the concrete production probe | **Non-conformant; BEH-MAJOR-001.** |
| Caller-minted issued evidence plus the same schema-invalid shape | `CONTRACT_INVALID` | `VALID` from the alternate-port probe | **Non-conformant; BEH-MAJOR-001.** |
| Unavailable dependency, unauthorized action, stale state, duplicate command, persistence failure, partial execution, retry after failure | Not applicable | No such dependency/state/effect exists in this ticket | Not applicable. |

## 8. Conditional runtime dimensions

### Concurrency

`NOT_APPLICABLE`. There is no mutable aggregate, repository write,
reservation, duplicate creation or competing mutation. No concurrency contract
is authorized by the ticket.

### Stale state

`NOT_APPLICABLE`. Schema references are ticket-owned immutable definitions;
there is no external revision or compare-and-set behavior.

### Idempotency

`NOT_APPLICABLE`. Repeated validation has no authorized business effect or
durable state transition. Effect idempotency belongs to PLAT/GIT and is outside
this ticket.

### Durability and persistence

`NOT_APPLICABLE`. The implementation returns immutable in-memory values and
failure results; it does not report durable completion or persist identity.

### Recovery

`NOT_APPLICABLE`. There is no interrupted operation, restart, replay, recovery
record or physical persistence boundary.

### Compatibility and migration

The new canonical path is compatible with the stated boundary: human text and
prototype/historical shapes are not imported or promoted, and the generic
consumer rejects text-only canonical completion. No legacy EXEC reader or
migration is owned here. The compatibility witness passes for the concrete
path; the caller-mintable evidence defect remains a local authority-boundary
finding rather than a migration issue.

## 9. Regression result

```text
IMPLEMENTATION_BASELINE = pinned HEAD without the seven EXEC production files or ticket test
REGRESSION_SUITE = npm test (generic workflow-orchestrator suite)
REGRESSIONS = 0
REGRESSION_RESULT = NO_REGRESSION
```

The baseline contains no prior EXEC behavior to compare semantically. The
existing generic workflow suite remains green, and the focused architecture
and consumer witnesses show that the new source graph does not import
prototype, `.pi`, transport, filesystem, database or UI dependencies. This is
`NO_REGRESSION` for the directly affected existing consumer boundary; it does
not erase the new-path authority defect.

## 10. Findings

### BEH-MAJOR-001 — Caller can mint schema-validation evidence through the exported internal issuer

```text
SEVERITY = MAJOR
TICKET = EXEC-001-TICKET-001
REQUIREMENTS = EXEC-ENVELOPE-001, EXEC-ENVELOPE-002
ACCEPTANCE_REFERENCES = AC-EXEC-001, AC-EXEC-002
FINDING_CATEGORY = CALLER_SUPPLIED_AUTHORITY_BYPASS
CAPABILITY = UNIT-EXEC-SCHEMA-HARNESS / EXEC schema-validation authority
DEPENDENCY_CLASS = INFORMATIONAL
LOCAL_CLOSURE_BLOCKING = YES
LOCAL_ACCEPTANCE_REQUIRES_PRODUCTIVE_CAPABILITY = NO
CLOSURE_OWNERSHIP = LOCAL_TICKET
EVIDENCE_TIMING = LOCAL_TICKET_CLOSURE
DEPENDENCY_CLASS_RECLASSIFICATION_REQUIRED = NO
UPSTREAM_DEPENDENCY_CLASSIFICATION_PRESERVED = YES
BLOCKS_LOCAL_EXECUTION = YES
BLOCKS_LOCAL_CLOSURE = YES
BLOCKS_TICKET_DONE = YES
BLOCKS_INTEGRATED_PROOF = YES
BLOCKS_SPEC_FINAL_CONFORMANCE = YES
PRIMARY_ROUTE = IMPLEMENTATION_REMEDIATION
DOWNSTREAM_CHECKPOINT = independent implementation behavior re-audit
DOWNSTREAM_OWNER = implementation remediation/audit workflow
Systemic pattern = YES (the inherited-property acceptance applies across required envelope and payload fields; the evidence issuer is the same boundary escape)
```

**Required behavior.** A valid result must be accepted only after both
identifiable canonical schemas validate the submitted raw values. Missing
structured fields must be rejected as `CONTRACT_INVALID`; caller input or an
alternate authority must not establish a valid contract.

**Production evidence.**

- `src/infrastructure/exec-schema-validator.ts:23-47` delegates required-field
  checking to the compiled TypeBox validator, which in the observed runtime
  treats a value inherited from `Object.prototype` as satisfying a JSON Schema
  `required` property.
- `src/domain/exec-contract.ts:309-324,389-409` verifies evidence provenance
  only by membership in the module WeakSet and checks own schema identity, but
  the required field reads at `365-383` do not require each required field to
  be an own property. The `structured` clone at line 383 consequently omits an
  inherited required field while the typed property still resolves it.
- `src/domain/exec-validation-evidence-internal.ts:10-22` exports
  `issueSchemaValidationEvidence`, so arbitrary code that can import the
  source module can create evidence accepted by the runtime WeakSet; together
  with `src/application/exec-contract.ts:80-82,98-125`, a caller-controlled
  alternate port can bypass the schema engine as well.

**Test evidence.** The focused suite passes 20/20 and includes structural
forged-evidence rejection at `tests/exec-001-ticket-001.test.ts:254-311`, and
an always-true adapter test at `205-231`. Its inherited-value test uses an
object with a non-standard prototype, which is rejected, but it does not test
an inherited required field supplied by `Object.prototype`. The independent
concrete-path probe removed `functionalVerdict` from the envelope's own
properties, supplied it only through `Object.prototype`, and observed:

```text
concrete status = VALID
concrete structured own functionalVerdict = false
concrete typed functionalVerdict = PASS
```

The second probe imported the issuer, injected an alternate port and observed
the same result. Both probes confirm an uncovered authority/schema boundary,
not a merely structural forged-evidence object.

**Expected result.** The same input must return `INVALID` with
`CONTRACT_INVALID`, no `value`, and no approval/checkpoint/effect signal,
regardless of an alternate adapter's ability to construct a caller-visible
looking receipt.

**Problem and impact.** The implementation's evidence mechanism is described
as opaque and adapter-issued, but the issuer is a normal exported function in
the productive source graph. A caller can therefore mint accepted evidence
and cause schema-invalid raw input to become a `ValidatedExecContract`. This
violates both acceptance criteria and is a caller-supplied authority bypass.
The immediate operation is side-effect-free, but downstream consumers can
receive an invalid structured contract and treat it as valid.

**Minimum correction required.** Make successful-validation evidence
unforgeable outside the concrete/approved validation adapter boundary (remove
caller access to the issuer or otherwise use a private capability that cannot
be imported through the production public graph), and enforce the schema
required-property boundary independently of inherited values. Add a direct
negative executable witness that exercises the alternate-port/public-boundary
path with a schema-invalid own-property shape and proves `CONTRACT_INVALID`
with no validated value. Do not close this finding by only changing the test or
by trusting the caller's adapter result.

**Related locations.**
`src/domain/exec-validation-evidence-internal.ts:8-25`;
`src/application/exec-contract.ts:76-128`;
`src/domain/exec-contract.ts:309-409`;
`src/infrastructure/exec-schema-validator.ts:20-51`;
`tests/exec-001-ticket-001.test.ts:205-311`.

## 11. Specialist summary

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

Tests run: 44

Tests passed: 44

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
CRITICAL=0
MAJOR=1
MINOR=0
INFO=0

Domain audit complete:
YES

Specialist result:
SPECIALIST_BEHAVIOR_FINDINGS

AUDIT_TARGET_HEAD: 381218d5fbf8d969ee5ae5349b8f65c4cd5af7f9
AUDIT_TARGET_STATE_FINGERPRINT: 2e77021139ed96e08980a98b792164c6b9ce2c5f86043b0fcad3f9dbda1c2db8
DOMAIN_AUDIT_COMPLETE: YES
SPECIALIST_RESULT: SPECIALIST_BEHAVIOR_FINDINGS
