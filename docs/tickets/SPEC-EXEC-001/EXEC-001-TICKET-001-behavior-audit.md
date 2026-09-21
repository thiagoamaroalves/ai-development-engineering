# EXEC-001-TICKET-001 — Implementation Behavior Audit

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
IMPLEMENTATION_BASELINE = 381218d5fbf8d969ee5ae5349b8f65c4cd5af7f9
CURRENT_HEAD = 71d73d96d7df69513894736214aa0a36d53a7736
AUDIT_TARGET_HEAD = 71d73d96d7df69513894736214aa0a36d53a7736
AUDIT_TARGET_STATE_FINGERPRINT = 73f7214519ab58d119929dfcd35b539caf2a81361fdf5a17333240cd748d4c03
```

The pinned HEAD is the current repository HEAD. The working tree had only
unrelated documentation changes in other audit artifacts; no production or
test overlay was present. The semantic implementation subject was therefore
audited at the pinned commit. No sibling specialist audit artifact was used.

### Changed production files at the target

- `src/domain/exec-contract.ts`
- `src/domain/exec-schema.ts`
- `src/domain/exec-validation-evidence-internal.ts`
- `src/application/exec-contract.ts`
- `src/infrastructure/exec-schema-validator.ts`
- `src/composition/exec-contract.ts`

### Changed test files at the target

- `tests/exec-001-ticket-001.test.ts`

### Relevant test suites

- Ticket-specific: `node --experimental-strip-types --test tests/exec-001-ticket-001.test.ts`
- Repository regression: `npm test`
- Focused strict static check over the six production modules and ticket test
- Repository package typecheck: `npm run typecheck`

## Authority reconstruction

The behavioral contract was reconstructed in this order:

1. Accepted `ADR-0003` revision 3: every skill result uses a common JSON
   envelope and capability payload validated by JSON Schema; human text is not
   operational authority; invalid JSON/schema is a contract failure.
2. `SPEC-EXEC-001`: `EXEC-ENVELOPE-001` requires identifiable schema validation
   before consumption and `EXEC-ENVELOPE-002` requires structured version,
   execution, activity, assignment, artifact/cycle, round/attempt, status,
   verdict, checkpoint, artifact, evidence, finding, requested-effect and error
   fields.
3. `GAP-001`: the productive schema/envelope/payload boundary was missing.
4. `EXEC-IMP-01`: local closure owns the schema identity, validation result and
   fail-closed contract boundary; registry resolution, lifecycle, persistence,
   effects and downstream mappings are out of scope.
5. The ticket and approved design: both sides must validate, text cannot fill
   missing fields, invalid input returns `CONTRACT_INVALID` without approval,
   checkpoint or effect, and the four acceptance-matrix rows are locally
   executable.

## Behavioral applicability matrix

| Dimension | Classification | Reason and inspection result |
|---|---|---|
| `UNIT_BEHAVIOR` | REQUIRED | The ticket introduces the productive envelope/payload validation operation. Inspected production execution and direct tests. |
| `INTEGRATION_BEHAVIOR` | AFFECTED | The contract is intended for downstream consumption and the generic delegation consumer is a regression boundary. The downstream integrated mapping itself is explicitly out of scope. |
| `PERSISTENCE` | NOT_APPLICABLE | The operation creates no durable state, repository record or persisted identity. |
| `CONCURRENCY` | NOT_APPLICABLE | Validation is synchronous and side-effect free; there is no mutable domain state or concurrent mutation contract. |
| `STALE_STATE` | NOT_APPLICABLE | No revision, predecessor, external mutable authority or compare-and-set operation is observed. |
| `IDEMPOTENCY` | NOT_APPLICABLE | This is not a business command and creates no external effect or durable completion. Repeated validation only uses internal caches. |
| `DURABILITY` | NOT_APPLICABLE | No completion or dependent observation is reported from durable state. |
| `RECOVERY` | NOT_APPLICABLE | There is no restart, rehydration, replay or interrupted operation in this unit. |
| `COMPATIBILITY` | NOT_APPLICABLE | Fixed schema identity is checked here; registry supported-version resolution and compatibility semantics belong to later EXEC units. |
| `MIGRATION_BEHAVIOR` | NOT_APPLICABLE | The ticket is `NEW_CANONICAL_PATH`; no legacy conversion is implemented. |
| `NEGATIVE_PATHS` | REQUIRED | Invalid schema/input, text-only input, missing fields, malformed adapter output, thrown adapter values and no-success/no-effect semantics are owned locally. |

## Acceptance witness audit

The ticket/design acceptance matrix has four normative behaviors. Every row has a
real operation through `ValidateExecContract.validate`, not merely registration
or source inspection, and every row is executable at local closure.

| Normative behavior | Direct operation and witness | Observed result | Witness executable at local closure |
|---|---|---|---|
| Envelope and payload are schema-validatable | `accepts a valid identifiable envelope and capability payload as structured values`; adapter compiles and checks both canonical definitions. | Valid pair returns `VALID` with both schema references and structured values. | YES |
| Minimum structured fields are required | `rejects missing structured fields and never infers them from human text`; canonical adapter rejects the omitted field. | `CONTRACT_INVALID`; human text does not supply `functionalVerdict`. | YES |
| Valid input is consumed as a structured contract | The valid-pair and opaque-identity tests inspect returned envelope/payload fields through the production boundary. | Structured fields are returned and preserved; prose is not consulted. | YES |
| Invalid contract fails closed | Text-only, one-side-invalid, malformed adapter, thrown adapter, forged evidence-object and custom-schema tests invoke the production boundary. | `CONTRACT_INVALID`, no `value`, and `noApproval`, `noCheckpoint`, `noEffect` are asserted. | YES |

```text
REQUIRED_BEHAVIORS_TOTAL = 4
DIRECT_BEHAVIOR_WITNESSES = 4
PROXY_ONLY_BEHAVIORS = 0
UNTESTED_STATE_TRANSITIONS = 0
UNPROVEN_CONCURRENCY_CONTRACTS = 0
MISSING_ARCHITECTURE_GUARDS = 1
```

The missing architecture guard is specifically the absence of a direct negative
witness for the currently exported `recordCanonicalValidationEvidence` issuance
function. The existing import-graph and retired-export-name checks do not prove
that the current evidence issuer is unavailable to a caller.

## Production behavior classifications

| Required behavior | Classification | Production evidence and observed semantics |
|---|---|---|
| Both canonical schemas validate before normal consumption | `PARTIAL` | `ExecContractSchemaDefinitions` exposes frozen canonical documents (`src/domain/exec-schema.ts:80-131`), `JsonSchemaExecValidator.validate` checks canonical definition identity and records exact-input evidence (`src/infrastructure/exec-schema-validator.ts:53-82`), and the application constructs the pair only after both results are valid (`src/application/exec-contract.ts:98-125`). However, the evidence issuer can be called by a caller with a fake receipt, so the provenance guarantee is bypassable. |
| Minimum structured fields are required and text cannot supply them | `IMPLEMENTED_CORRECTLY` on the canonical path | The schema lists all required fields (`src/domain/exec-schema.ts:101-119`), the domain values require the structured fields (`src/domain/exec-contract.ts:365-383`), and application input carries `humanText` but never uses it for authority (`src/application/exec-contract.ts:15-19, 93-126`). |
| Invalid input fails closed without approval, checkpoint or effect | `IMPLEMENTED_CORRECTLY` for ordinary invalid/unproven paths; `PARTIAL` for evidence-forged paths | Invalid results are normalized and return `CONTRACT_INVALID` (`src/application/exec-contract.ts:105-128`); `ContractInvalidFailure` exposes immutable no-success/no-effect flags (`src/domain/exec-contract.ts:488-529`). A caller that mints accepted evidence can instead reach `VALID`, which is the blocking exception. |
| Returned values are structured and immutable | `IMPLEMENTED_CORRECTLY` after canonical validation | Envelope/payload/pair construction is token-guarded, branded and frozen (`src/domain/exec-contract.ts:365-410, 426-471`); cloning rejects non-JSON values and preserves own structured keys. |

## Test inventory and assertion quality

| Required category | Classification | Assessment |
|---|---|---|
| `UNIT` | `REQUIRED_TEST_PRESENT` | Strong: direct calls through the production application boundary assert semantic status, schema identity and fields. |
| `INVARIANT` | `REQUIRED_TEST_PRESENT` | Strong: required fields, exact schema identity, immutability, JSON values, own-enumerable fields and no partial pair are asserted. |
| `NEGATIVE_PATH` | `REQUIRED_TEST_PRESENT` | Strong for ordinary invalid paths: missing/text-only/malformed/unknown/custom/one-side-invalid cases assert the canonical failure and no-success signals. |
| `ARCHITECTURE_GUARD` | `REQUIRED_TEST_PRESENT` but incomplete | The import-graph guard is executable, but the authority-export check only checks retired names (`tests/exec-001-ticket-001.test.ts:239-244`) and misses the current exported issuer. This is the missing guard recorded above. |
| `CONFORMANCE` | `REQUIRED_TEST_PRESENT` | Sufficient for the generic consumer regression: text output is not promoted to canonical completion/effect. It is not a substitute for the missing evidence-issuer guard. |
| `PERSISTENCE`, `INTEGRATION`, `CROSS_SPEC`, `CONCURRENCY`, `STALE`, `IDEMPOTENCY`, `RECOVERY`, `COMPATIBILITY`, `MIGRATION` | `TEST_CATEGORY_NOT_APPLICABLE` | These behaviors are not locally owned by this stateless contract-validation unit; downstream/integrated mapping is explicitly later proof. |

Normal positive and negative assertions are strong rather than name-based or
non-null-only. The authority-boundary assertion is misleadingly incomplete:
the test proves absence of `issueSchemaValidationEvidence` and
`registerSchemaValidationAdapter`, but does not inspect or exercise
`recordCanonicalValidationEvidence`.

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
| `node --experimental-strip-types --test tests/exec-001-ticket-001.test.ts` | 20 passed, 0 failed |
| `npm test` | 25 passed, 0 failed |
| Focused strict `tsc` over touched production modules, composition root and ticket test | PASS |
| `npm run typecheck` | PASS; package scope is `.pi/extensions/**/*.ts`, so the focused check is the relevant source typecheck |

The ticket/evidence prose contained an older `17/17` count; the independent
execution at the pinned target produced `20/20` and is the audit evidence.

## Failure and negative-path results

| Case | Expected | Observed |
|---|---|---|
| Valid envelope and payload | `VALID`, structured pair | Correct on canonical composition path. |
| Text-only input | `CONTRACT_INVALID`; no approval/checkpoint/effect | Correct; no `value`, all three no-success flags true. |
| Missing required field with text claiming the value | `CONTRACT_INVALID`; text cannot fill it | Correct; schema issue names the omitted field. |
| Unknown/caller-selected schema identity | `CONTRACT_INVALID` | Correct; canonical definition/reference checks reject it. |
| Malformed or throwing adapter result | `CONTRACT_INVALID` | Correct; malformed result normalization and catch path fail closed. |
| One valid side and one invalid side | No partial validated pair | Correct; result has no `value`. |
| Structurally forged evidence object | `CONTRACT_INVALID` | Correct; the internal issued-evidence `WeakSet` rejects a plain object. |
| Caller imports `recordCanonicalValidationEvidence` and supplies `{ hasValidated: () => true }` | Must not establish validation authority; expected `CONTRACT_INVALID` or inaccessible issuer | **Incorrect:** independent probe returned `{"recordExport":"function","status":"VALID","schemaCalls":0}`. The adapter performed no schema validation. |

## Authority, producer/consumer and temporal proof

### Authority consumption

The applicable ticket record is `ACP-EXEC-01` / `PCP-EXEC-01` for
`UNIT-EXEC-SCHEMA-HARNESS`:

```text
AUTHORITY_STATUS = DEFINED
CONTRACT_STATUS = DEFINED
LOCAL_TESTABILITY = YES
PRODUCTIVE_AVAILABILITY = NO (the unit-owned fixture/harness is not a foreign productive producer)
DEPENDENCY_CLASS = INFORMATIONAL
LOCAL_CLOSURE_BLOCKING = NO for capability availability
```

The local code itself is executable productive implementation, but the handoff
must not promote the fixture/informational capability record to productive
foreign availability. The capability is not required for a foreign integrated
producer, so this availability fact is not a local execution blocker. The
behavioral authority-provenance defect below is separate from productive
availability and does block local acceptance.

The producer/consumer path is otherwise direct: the composition root selects
`JsonSchemaExecValidator`, the application consumes the narrow port, and domain
values consume evidence tied to the exact input/reference pair. The current
exported recorder breaks the intended producer boundary because any importer
can provide the receipt implementation.

### Caller-as-authority check

```text
CALLER_AS_AUTHORITY_CHECK = FAIL
CALLER_SUPPLIED_AUTHORITY_BYPASS = 1
```

The raw caller does not normally select the canonical schema reference, and
human text is correctly treated as non-authoritative. Nevertheless,
`recordCanonicalValidationEvidence` is exported from
`src/domain/exec-validation-evidence-internal.ts:21-38`; it trusts a caller's
`hasValidated` method at line 26 and adds the resulting object to the private
issued-evidence set. The domain checks only membership in that set and exact
object/reference identity (`src/domain/exec-contract.ts:309-324`). A caller can
therefore mint the capability that the application treats as proof of schema
execution.

Independent runtime probe (no schema adapter call):

```text
node --experimental-strip-types --input-type=module ...
{"recordExport":"function","status":"VALID","schemaCalls":0}
```

This is a caller-supplied authority bypass, not a temporal revalidation issue.

### Temporal authority

```text
TEMPORAL_AUTHORITY_PROOF = NOT_APPLICABLE
```

The normal operation observes no mutable external authority before committing
an effect; it only validates immutable ticket-owned definitions. No stale-state
or second-observation proof is applicable. The evidence-forging defect is an
authority provenance defect and remains material without temporal drift.

## Conditional runtime dimensions

```text
CONCURRENCY = NOT_APPLICABLE
STALE_BEHAVIOR = NOT_APPLICABLE
IDEMPOTENCY = NOT_APPLICABLE
DURABILITY = NOT_APPLICABLE
RECOVERY = NOT_APPLICABLE
COMPATIBILITY = NOT_APPLICABLE
MIGRATION = NOT_APPLICABLE
```

The per-validator `WeakMap`/`WeakSet` caches do not represent business state,
are synchronous, and have no external effect. Persistence, restart, retry,
revision/CAS, historical replay and legacy mapping are all explicitly outside
this ticket.

## Regression result

```text
REGRESSION_RESULT = NO_REGRESSION
REGRESSIONS = 0
```

The focused ticket suite and the repository generic workflow suite both passed.
The implementation is additive relative to `IMPLEMENTATION_BASELINE`; no
existing production behavior was found regressed. This does not waive the new
authority-provenance defect in the ticket's own boundary.

## Finding

### BEH-CRITICAL-001 — Caller can mint schema-validation authority

```text
SEVERITY = CRITICAL
FINDING_STATUS = OPEN
FINDING_CATEGORY = CALLER_SUPPLIED_AUTHORITY_BYPASS
TICKET = EXEC-001-TICKET-001
REQUIREMENT_REFERENCES = EXEC-ENVELOPE-001, EXEC-ENVELOPE-002
ACCEPTANCE_REFERENCES = AC-EXEC-001, AC-EXEC-002
CAPABILITY = schema-validation-authority provenance / UNIT-EXEC-SCHEMA-HARNESS
DEPENDENCY_CLASS = INFORMATIONAL
LOCAL_ACCEPTANCE_REQUIRES_PRODUCTIVE_CAPABILITY = NO
CLOSURE_OWNERSHIP = LOCAL_TICKET
EVIDENCE_TIMING = LOCAL_CLOSURE
LOCAL_CLOSURE_BLOCKING = YES
DEPENDENCY_CLASS_RECLASSIFICATION_REQUIRED = NO
UPSTREAM_DEPENDENCY_CLASSIFICATION_PRESERVED = YES
BLOCKS_LOCAL_EXECUTION = NO
BLOCKS_LOCAL_CLOSURE = YES
BLOCKS_TICKET_DONE = YES
BLOCKS_INTEGRATED_PROOF = YES
BLOCKS_SPEC_FINAL_CONFORMANCE = YES
PRIMARY_ROUTE = IMPLEMENTATION_REMEDIATION
DOWNSTREAM_CHECKPOINT = EXEC-001-TICKET-001 local closure and later EXEC contract consumption
DOWNSTREAM_OWNER = EXEC-001 / CANONICAL_OWNER
```

- **Required behavior:** A pair is consumable only after both identifiable
  schemas have actually validated the exact input; a caller cannot mint
  validation authority or bypass the fail-closed boundary.
- **Production evidence:** `recordCanonicalValidationEvidence` is exported
  (`src/domain/exec-validation-evidence-internal.ts:21-38`) and accepts any
  object implementing `hasValidated`, with no registration, adapter identity or
  private capability check (`:26`). `StructuredExecutionEnvelope` and
  `StructuredCapabilityPayload` accept any evidence object that the exported
  function placed in the module-private `WeakSet`
  (`src/domain/exec-contract.ts:309-324, 389-409, 459-471`). The application
  then returns `VALID` after consuming that evidence
  (`src/application/exec-contract.ts:113-126`).
- **Test evidence:** The suite checks that retired issuer names are absent and
  that a plain forged evidence object is rejected
  (`tests/exec-001-ticket-001.test.ts:239-262, 264-321`), but it does not check
  the actual current recorder export. The independent probe imported that
  export, supplied `{ hasValidated: () => true }`, invoked the production
  `ValidateExecContract` boundary, and obtained `status: VALID` with zero
  schema calls.
- **Observed result:** A caller able to import the internal module can mint
  accepted validation evidence without executing a schema validator. The
  production boundary treats that result as a validated structured contract.
- **Expected result:** Issuance must be unreachable to callers or cryptographically/
  capability-bound to the canonical adapter; an unproven adapter or caller-made
  receipt must produce `CONTRACT_INVALID` and no consumable value.
- **Problem:** The implementation removed the old registration function but left
  a new exported recorder whose only trust decision is the caller-controlled
  `hasValidated` method. The test guard checks obsolete export names instead of
  the actual exported function.
- **Impact:** This is a direct authority bypass. Downstream consumers can receive
  a result marked `VALID` without schema validation and may use it as the
  structured basis for approval, checkpoint or effect decisions. It violates
  the ticket's schema-validation contract even though the normal composition
  path and all current tests are green.
- **Minimum correction required:** Make evidence issuance genuinely
  non-caller-mintable (for example, keep issuance in a private closure or use a
  capability/registration mechanism unavailable through the public module
  graph), preserve exact input/reference binding, and add a direct executable
  negative test that exercises the current issuer/bypass attempt and proves
  `CONTRACT_INVALID`/no `value`. Do not rely on a filename containing
  `internal` or on retired export names.
- **Systemic pattern:** YES — one shared evidence issuance boundary affects both
  envelope and payload validation and every consumer of `ValidatedExecContract`.
- **Related locations:** `src/domain/exec-validation-evidence-internal.ts:11-38`,
  `src/infrastructure/exec-schema-validator.ts:3-5, 37-82`,
  `src/domain/exec-contract.ts:309-324, 389-409, 459-471`,
  `src/application/exec-contract.ts:98-126`,
  `tests/exec-001-ticket-001.test.ts:239-321`.

The finding is local behavioral remediation, not a productive-availability
reclassification. The informational dependency class is preserved exactly; the
local closure effect is derived from the unsatisfied behavior, not from finding
severity alone.

## Summary

Audit: docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-001-behavior-audit.md

Specialist:
IMPLEMENTATION_BEHAVIOR

Ticket: EXEC-001-TICKET-001

Required behavioral dimensions: 3

Required tests: 5

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

AUDIT_TARGET_HEAD: 71d73d96d7df69513894736214aa0a36d53a7736
AUDIT_TARGET_STATE_FINGERPRINT: 73f7214519ab58d119929dfcd35b539caf2a81361fdf5a17333240cd748d4c03
DOMAIN_AUDIT_COMPLETE: YES
SPECIALIST_RESULT: SPECIALIST_BEHAVIOR_FINDINGS