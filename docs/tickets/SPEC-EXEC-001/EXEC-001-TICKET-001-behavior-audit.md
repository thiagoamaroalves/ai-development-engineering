# EXEC-001-TICKET-001 — Implementation Behavior Audit

Audit: `.pi/runtime/workflow-audits/c4a46405-1314-4c2a-9af5-048cea009662/behavior-EXEC-001-TICKET-001-behavior-audit.md`
Specialist: `IMPLEMENTATION_BEHAVIOR`
Audit mode: `READ_ONLY · INDEPENDENT · ADVERSARIAL · BEHAVIOR_FIRST · TEST_ASSERTION_AWARE · NEGATIVE_PATH_AWARE`
Audit wave: `c4a46405-1314-4c2a-9af5-048cea009662`
Specialist attempt: `1/3`

## 1. Required inputs and audit basis

```text
TICKET_ID = EXEC-001-TICKET-001
TICKET_PATH = docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-001-capability-specific-envelope-and-payload-schemas.md
IMPLEMENTATION_UNIT = EXEC-IMP-01 — Capability-specific envelope and payload schemas
REQUIREMENT_IDS = EXEC-ENVELOPE-001; EXEC-ENVELOPE-002
AFFECTED_FAILURE_REQUIREMENT = EXEC-CONTRACT-001 (fail-closed behavior is an affected contract facet, not a separately owned ticket requirement)
ACCEPTANCE_IDS = AC-EXEC-001; AC-EXEC-002
SPEC_PATH = docs/specs/SPEC-EXEC-001-skill-contracts-and-capability-registry.md
GAP_MATRIX_PATH = docs/specs/gap-matrices/SPEC-EXEC-001-implementation-gap-matrix.md
IMPLEMENTATION_PLAN_PATH = docs/specs/implementation-plans/SPEC-EXEC-001-implementation-plan.md
IMPLEMENTATION_DESIGN_PATH = docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-001-implementation-design.md
TICKET_SET_AUDIT_PATH = docs/tickets/SPEC-EXEC-001/implementation-ticket-audit.md
IMPLEMENTATION_BASELINE = 8cf79cd37ebb02d0657c1fb191cea1d194b71f89
CURRENT_HEAD = b68eb87d8afc21b5683e89f4ecd3aee8d8238306
AUDIT_TARGET_HEAD = b68eb87d8afc21b5683e89f4ecd3aee8d8238306
AUDIT_TARGET_STATE_FINGERPRINT = 70f7ea178eabee7cef5e588756b093c1de366d85ce9171e05e2235e091996675

IMPLEMENTATION_CHANGED_PRODUCTION_FILES =
src/application/exec-contract.ts
src/domain/exec-contract.ts
src/domain/exec-schema.ts
src/domain/exec-validation-evidence-internal.ts
src/infrastructure/exec-schema-validator.ts

IMPLEMENTATION_CHANGED_TEST_FILES =
tests/exec-001-ticket-001.test.ts

TARGET_OVERLAY_FILES_OUTSIDE_THIS_TICKET =
README.md
package.json
package-lock.json
tests/exec-001-ticket-002.test.ts

RELEVANT_TEST_SUITES =
tests/exec-001-ticket-001.test.ts
npm test (.pi/extensions/workflow-orchestrator/test/*.test.ts, tests/exec-001-ticket-001.test.ts, tests/exec-001-ticket-002.test.ts)
focused strict tsc command for the TICKET-001 source/test graph
npm run typecheck
npm run verify:audit-governance
npm run verify:canonical-consistency
TICKET-001 productive import-graph architecture guard
```

The target HEAD matched the pinned HEAD at intake and after execution. The
working-tree overlay was pre-existing and remained unchanged; its exact pinned
state fingerprint is recorded above. No production source, test, ticket,
upstream authority, Git state, commit, branch, remote, or publication state was
changed by this audit. The only audit write is this artifact.

Authority reconstructed in order: accepted `ADR-0003-versioned-skill-contracts`,
`SPEC-EXEC-001` revision 5 (`O-016`, `EXEC-ENVELOPE-001/002`, and the
fail-closed `EXEC-CONTRACT-001` facet), `GAP-018`, `EXEC-IMP-01`, the ticket,
the approved implementation design, and the repository implementation/tests.
The ticket and design explicitly exclude registry publication, DOM lifecycle,
persistence, recovery, transport, external effects, and foreign mappings.

## 2. Normative behavioral contract

| Behavior | Success behavior | Failure/negative behavior | Production classification |
|---|---|---|---|
| Identifiable common envelope and capability payload | Both values validate against ticket-owned identifiable schemas and produce one complete structured pair. | Unknown/mismatched capability, schema identity, or capability-invalid payload returns `CONTRACT_INVALID`; no generic fallback. | `IMPLEMENTED_CORRECTLY` |
| Capability-specific selection | `ExecContractSchemaDefinitions.selectPayload` selects the immutable definition for the exact capability/schema tuple. | Unknown capability, legacy generic schema identity, or missing selection fails before consumption. | `IMPLEMENTED_CORRECTLY` |
| Structured envelope minimum | All required version, execution, activity, assignment, artifact/cycle, round/attempt, status, verdict, checkpoint, artifact, evidence, finding, effect, and error fields are present as own structured fields. | Missing/non-structured fields fail closed. | `IMPLEMENTED_CORRECTLY` |
| Text non-authority | `humanText` is ignored for contract construction. | Text-only or text-filled missing fields remain `CONTRACT_INVALID`. | `IMPLEMENTED_CORRECTLY` |
| Authenticated validation evidence | Canonical adapter evidence binds producer, selected definition, exact input, reference, and current content fingerprint. Approved alternate authenticated adapters can use the explicit producer contract. | Caller-shaped result, copied result/adapter, plain wrapper, custom/getter definition, or stale evidence cannot construct a value. | `IMPLEMENTED_CORRECTLY` for the approved variation boundary |
| Complete-pair/no-effect semantics | Only one immutable `ValidatedExecContract` is returned after both sides pass. | One-side failure returns no partial value and exposes `noApproval`, `noCheckpoint`, and `noEffect`. | `IMPLEMENTED_CORRECTLY` |
| Stale/mutated validation evidence | Current schema/input checks and content fingerprint reject ordinary post-receipt mutation. | A pre-mutation successful receipt supplied after mutation must fail closed. | `IMPLEMENTED_CORRECTLY`; repository consumer witness is missing/misleading (BEH-MAJOR-001) |
| Adapter failure semantics | Valid adapter result is normalized and consumed. | Malformed/throwing adapter output becomes `CONTRACT_INVALID`; technical failure cannot authorize an effect. | `IMPLEMENTED_CORRECTLY` |
| Compatibility/cutover | New capability-specific schema is the canonical path. | Former generic payload identity and generic-but-capability-invalid data are rejected rather than silently converted. | `IMPLEMENTED_CORRECTLY` |
| Repeat/concurrent calls | Validation is synchronous and side-effect free; repeated/concurrent equivalent calls have stable status and no external mutation. | No mutable command or durable effect is present to race or deduplicate. | `IMPLEMENTED_CORRECTLY`; concurrency/idempotency are not lifecycle obligations |

## 3. Behavioral applicability matrix

`REQUIRED` and `AFFECTED` dimensions were inspected. The validation operation
has no aggregate, durable state, external effect, or mutable authority owner.

| Dimension | Classification | Reason and inspection result |
|---|---|---|
| `UNIT_BEHAVIOR` | `REQUIRED` | The ticket owns schema selection, structured minimums, complete-pair construction, and failure meaning. |
| `INTEGRATION_BEHAVIOR` | `AFFECTED` | The composition root must wire `JsonSchemaExecValidator` to `ValidateExecContract`; no foreign integration is in scope. |
| `PERSISTENCE` | `NOT_APPLICABLE` | No repository, snapshot, journal, catalog, durable identity, or persisted result is created. |
| `CONCURRENCY` | `NOT_APPLICABLE` | There is no mutable command/effect or shared canonical state; the validator cache is private implementation memoization. A 100-call concurrent stress probe was nevertheless run. |
| `STALE_STATE` | `REQUIRED` | Producer receipts carry exact input/reference/fingerprint evidence and must not be consumed after ordinary input mutation. |
| `IDEMPOTENCY` | `NOT_APPLICABLE` | Validation has no business effect or canonical mutation; repeated-call stability was checked defensively but external-effect idempotency belongs outside this ticket. |
| `DURABILITY` | `NOT_APPLICABLE` | No completion or dependent observation is reported from durable state. |
| `RECOVERY` | `NOT_APPLICABLE` | There is no interrupted or persisted operation; malformed/throwing adapters fail closed and retry ownership is outside this ticket. |
| `COMPATIBILITY` | `AFFECTED` | The generic payload path is intentionally retired in favor of the new capability-specific canonical path. |
| `MIGRATION_BEHAVIOR` | `NOT_APPLICABLE` | No historical persisted material or migration is read or rewritten. |
| `NEGATIVE_PATHS` | `REQUIRED` | Invalid JSON-like values, missing fields, unknown/mismatched schemas, generic payloads, forged evidence, stale evidence, and adapter failure must reject safely. |

## 4. Authority and provenance audit

### Authority consumption

The only authority used by this unit is the unit-owned immutable schema
contract. No foreign authority is consumed, and no fixture is promoted to a
productive foreign producer.

```text
AUTHORITY_CONSUMPTION_PROOF = ticket §14a–§14c; Plan EXEC-IMP-01; SPEC-EXEC-001 O-016/EXEC-ENVELOPE-001/002
CAPABILITY_ID = EXEC-SCHEMA-CAPABILITY-PAYLOAD
AUTHORITY_OWNER = SPEC-EXEC-001 / EXEC-001
PRODUCER = ticket-owned ExecContractSchemaDefinitions plus the selected authenticated validation adapter
CONSUMER = ValidateExecContract, StructuredExecutionEnvelope, StructuredCapabilityPayload
CONTRACT = immutable identifiable envelope/capability schema selection and validation evidence
RETURNED_DATA = selected reference, validation result, exact validated input, and content fingerprint
VERSION_TRANSPORT = SchemaReference schema ID plus semantic version
FAILURE_NOT_FOUND_STALE = CONTRACT_INVALID; no partial pair or effect
AUTHORITY_STATUS = DEFINED
CONTRACT_STATUS = DEFINED
SEMANTIC_STATUS = DEFINED
LOCAL_TESTABILITY = YES
PRODUCTIVE_AVAILABILITY = NO for the separately recorded fixture/harness capability
CAPABILITY_SUMMARY_STATUS = CONTRACT_TESTABLE_LOCALLY
DEPENDENCY_CLASS = INFORMATIONAL
AVAILABILITY_EVIDENCE = direct composition/schema operations and focused tests
BLOCKING_EFFECT = NONE for capability availability
```

Under the shared authority contract, the recorded fixture capability is not
reported as `AUTHORITY_CONSUMABLE`; the audit summary is therefore
`NOT_APPLICABLE` to foreign authority consumption. The actual local composition
path was executed, but that is not a downstream productive-availability
promotion for a foreign producer.

### Producer/consumer and temporal proof

- Canonical schema-definition membership is module-private `WeakSet` identity,
  registered before adapter field access. The getter-backed/custom-definition
  negative witness passes.
- Successful evidence membership is module-private producer/result identity;
  exact selected reference, exact input identity, current own-field shape, and
  content fingerprint are verified before domain construction.
- The plain forged port, copied result/adapter, caller-owned verifier metadata,
  custom definition, and untrusted wrapper are rejected. The authenticated
  alternate-adapter positive witness is an approved explicit variation point,
  not a user-payload authority source.
- `CALLER_AS_AUTHORITY_CHECK = PASS`: caller payload fields are compared with
  ticket-owned schema identity/selection; caller text, caller-selected schema
  IDs/documents, and caller-shaped result metadata do not establish canonical
  truth.
- `CALLER_SUPPLIED_AUTHORITY_BYPASS = 0`.
- `TEMPORAL_AUTHORITY_PROOF = NOT_APPLICABLE`: no mutable external authority is
  observed before committing an effect. Local receipt/input staleness is
  protected separately by the current validation and fingerprint checks.

## 5. Production path evidence

1. `ValidateExecContract.validate` obtains the ticket-owned immutable payload
   definition from `selectPayload`; it does not accept a caller schema source.
2. It validates the canonical envelope and selected payload through the narrow
   `ExecSchemaValidationPort`.
3. `normalizedValidationResult` rejects malformed or non-authenticated success
   results. Domain factories then require producer membership, exact reference,
   exact input, current content fingerprint, own enumerable required fields,
   capability identity, and payload `data.result`.
4. `StructuredExecutionEnvelope` and `StructuredCapabilityPayload` deep-copy and
   freeze structured values; `ValidatedExecContract` accepts only both branded
   values.
5. Any failure is normalized to one `ContractInvalidFailure` with
   `CONTRACT_INVALID`, `noApproval = true`, `noCheckpoint = true`, and
   `noEffect = true`. No persistence, approval, checkpoint, event, transport, or
   external effect is reachable from this operation.

Observed production locations:

- `src/domain/exec-schema.ts:140-179` — frozen envelope/payload documents,
  capability-specific `result` field, immutable definition set, and selection.
- `src/domain/exec-schema.ts:205-218` — exact canonical definition membership.
- `src/infrastructure/exec-schema-validator.ts:58-102` — JSON Schema compilation,
  own-field validation, receipt tracking, current recheck, and authenticated
  result issuance.
- `src/application/exec-contract.ts:96-141` — selection, both validations,
  normalization, complete-pair construction, and fail-closed aggregation.
- `src/domain/exec-contract.ts:391-415` — exact producer/input/reference/fingerprint
  checks; lines 480-562 — structured value guards and selected capability
  identity; lines 594-616 — immutable failure/no-effect result.
- `src/composition/exec-contract.ts:8-9` — productive composition wiring.

## 6. Acceptance witness audit

The ticket's authoritative `ACCEPTANCE_WITNESS_MATRIX` has two rows. Both
normative operations have direct positive and negative tests through the
application/composition boundary and are executable at local closure.

| Row | Direct positive witness | Direct negative/isolation witness | Local closure | Result |
|---|---|---|---:|---|
| Capability-specific schema selection/validation (`C-EXEC-001`, `AC-EXEC-001`) | `tests/exec-001-ticket-001.test.ts` valid identifiable pair and selected payload schema assertions (tests 1–2) | generic-but-capability-invalid data, unknown capability, legacy generic schema identity, forged/custom definitions and no-effect assertions | YES | Direct and strong |
| Structured minimum/text non-authority (`C-EXEC-002`, `AC-EXEC-002`) | complete structured pair test | missing field, text-only input, malformed/non-JSON/inherited values, one-side-invalid pair and fail-closed assertions (tests 19–23) | YES | Direct and strong |

```text
REQUIRED_BEHAVIORS_TOTAL = 2
DIRECT_BEHAVIOR_WITNESSES = 2
PROXY_ONLY_BEHAVIORS = 1 (stale-receipt consumer behavior is only represented by a proxy-like invalid result; see BEH-MAJOR-001)
UNTESTED_STATE_TRANSITIONS = 1 (pre-mutation authenticated receipt -> post-mutation consumer rejection)
UNPROVEN_CONCURRENCY_CONTRACTS = 0
MISSING_ARCHITECTURE_GUARDS = 0 for the acceptance rows; stale consumer guard is a test-evidence gap, not a missing production import guard
WITNESS_EXECUTABLE_AT_LOCAL_CLOSURE = YES for both acceptance rows
```

## 7. Required test inventory

| Category | Classification | Evidence |
|---|---|---|
| `UNIT` | `REQUIRED_TEST_PRESENT` | Focused TICKET-001 suite exercises definitions, application, values, and adapter. |
| `INVARIANT` | `REQUIRED_TEST_PRESENT` | Required fields, schema identity, immutability, complete-pair and no-effect assertions. |
| `INTEGRATION` | `REQUIRED_TEST_PRESENT` | Tests use `createExecContractValidator` and the productive composition/adapter path. |
| `STALE` | `REQUIRED_TEST_MISSING` | A named stale test exists, but its plain port is rejected for provenance before stale checks; it is not a direct stale-receipt witness. |
| `COMPATIBILITY` | `REQUIRED_TEST_PRESENT` | Generic legacy schema identity and generic-but-capability-invalid payload are rejected. |
| `NEGATIVE_PATH` | `REQUIRED_TEST_PRESENT` | Malformed, missing, text-only, forged, copied, inherited, non-JSON and thrown-adapter paths. |
| `ARCHITECTURE_GUARD` | `REQUIRED_TEST_PRESENT` | Productive import graph, definition membership, provenance and wrapper/forgery guards. |
| `CONFORMANCE` | `REQUIRED_TEST_PRESENT` | Identifiable JSON Schema IDs/version, selected references, strict focused typecheck. |
| `PERSISTENCE` | `TEST_CATEGORY_NOT_APPLICABLE` | No durable state. |
| `CROSS_SPEC` | `TEST_CATEGORY_NOT_APPLICABLE` | No foreign capability is required for local closure. |
| `CONCURRENCY` | `TEST_CATEGORY_NOT_APPLICABLE` | No mutable command or concurrent state contract. |
| `IDEMPOTENCY` | `TEST_CATEGORY_NOT_APPLICABLE` | No business effect or canonical mutation. |
| `RECOVERY` | `TEST_CATEGORY_NOT_APPLICABLE` | No interrupted/durable operation. |
| `MIGRATION` | `TEST_CATEGORY_NOT_APPLICABLE` | No persisted historical material. |

Required test categories: 8. Required category missing: 1 (the stale witness
is non-operational despite the test name).

## 8. Assertion-quality assessment

- **STRONG:** valid pair/schema identity; missing/text-only/no-effect failures;
  forged result and copied result rejection; custom/getter definition
  rejection; immutable values; import graph; malformed/throwing adapter
  normalization.
- **SUFFICIENT:** generic payload rejection and unknown/legacy selection
  failures. These assert status/code and at least a no-effect or failure
  invariant; other tests assert the complete no-success flag set.
- **MISLEADING:** `rejects stale genuine evidence after envelope or payload
  current-content mutation` (test lines 619–694). Its `stalePort` is a plain
  `ExecSchemaValidationPort`, so `normalizedValidationResult` rejects every
  returned success at application line 47 because it is not an authenticated
  producer. The mutation/fingerprint path at domain lines 411–415 is never
  reached by those application calls.
- **MISLEADING/non-blocking:** `preserves opaque identity references without
  normalization` (test lines 135–151) changes `capabilityId` to an unknown
  value at the same time as envelope IDs. Selection fails before the envelope
  values are consumed, so the test no longer proves the behavior named by the
  test. A direct runtime probe with the canonical capability and opaque envelope
  IDs returned `VALID` and preserved both values; the issue is evidence quality,
  not observed production failure.
- No test relies solely on HTTP success, non-null construction, or absence of an
  exception for the two acceptance rows.

## 9. Independent test execution

### Executed successfully

```text
npx tsx --test tests/exec-001-ticket-001.test.ts = PASS, 25/25
npm test = PASS, 83/83 (full distinct repository suite; includes the focused 25)
npx tsc --noEmit --strict --target ES2023 --module NodeNext --moduleResolution NodeNext --allowImportingTsExtensions --skipLibCheck --types node [TICKET-001 source/test graph] = PASS
npm run typecheck = PASS
npm run verify:audit-governance = PASS
npm run verify:canonical-consistency = PASS
```

Additional direct audit probes (not repository test modifications):

```text
100 repeated valid calls on one validator = all VALID
100 repeated generic-invalid calls on one validator = all INVALID
100 concurrent Promise.all calls = stable statuses, no observable mutation
17/17 missing envelope required fields = INVALID with all three no-success flags
authenticated stale-receipt test double after schema-valid executionId mutation = INVALID with noApproval/noCheckpoint/noEffect
```

### Environmental/non-ticket command failures

```text
node --experimental-strip-types --test tests/exec-001-ticket-001.test.ts = ENVIRONMENTAL_FAILURE
  Node v22.22.1 in this image was built without embedded TypeScript support (ERR_NO_TYPESCRIPT).
  Equivalent npx tsx execution passed 25/25.

npm run verify:skill-mirror = ENVIRONMENTAL/REPOSITORY-SETUP_FAILURE
  .codex/skills is absent and the mirror reports missing mirror files; no TICKET-001
  production/test file was changed by this command.

npm run verify:phase-manifest = COMMAND_USAGE_FAILURE, NOT A REQUIRED TICKET-001 SUITE
  The script requires an explicit --manifest path; no manifest was supplied.
```

```text
TESTS_RUN = focused 25 cases; full 83 distinct cases; focused strict typecheck; repository typecheck; governance and canonical-consistency guards
TESTS_PASSED = 83 distinct cases plus all successful commands above
TESTS_FAILED = 0 implementation/test failures
TESTS_SKIPPED = 0
ENVIRONMENTAL_FAILURES = 3 command-level failures listed above
FAILURE_CLASSIFICATION = implementation failures 0; pre-existing regressions 0; cross-SPEC failures 0; environmental/usage failures 3
```

## 10. Regression result

`REGRESSION_RESULT = NO_REGRESSION` within the authorized ticket and directly
affected repository scope. The full 83-case suite passed, the focused TICKET-001
suite passed, and focused strict typecheck covered the TICKET-001 graph (the
repository `npm run typecheck` configuration itself does not include the T1
source/test list). The generic payload behavior changed from the baseline as an
intentional `NEW_CANONICAL_PATH` cutover and is rejected as required; no silent
conversion or unrelated behavior regression was observed.

## 11. Conditional runtime dimensions

### Concurrency

`NOT_APPLICABLE`. There is no mutable canonical state, command, durable record,
revision, or external effect. The private compiled-validator/receipt caches are
synchronous per-adapter memoization and the 100-call concurrent probe produced
stable results.

### Stale state

Production implementation is conformant for ordinary mutable input: the adapter
rechecks the current schema and own required fields, and the domain compares the
current content fingerprint to the producer receipt. An authenticated stale
producer test double was independently executed and returned `CONTRACT_INVALID`
with all no-success flags after mutation. The repository's named stale test is
not a direct witness, so the specialist evidence result is `PARTIAL` and the
local test gate is recorded as `NON_CONFORMANT` in the summary.

### Idempotency

`NOT_APPLICABLE` as a business/effect contract. Repeated equivalent calls were
also probed and did not create duplicate canonical state or effects.

### Durability/persistence

`NOT_APPLICABLE`; no state crosses a process/restart boundary.

### Recovery

`NOT_APPLICABLE`; thrown/malformed adapter results fail closed, but there is no
interrupted durable operation or recovery record in this unit.

### Compatibility/migration

Compatibility is conformant for the authorized cutover: old generic payload
identity and arbitrary generic data are rejected, while the canonical
capability-specific pair succeeds. Migration is not applicable because no
persisted historical material is read or rewritten.

## 12. Findings

### BEH-MAJOR-001 — Stale consumer state transition has no direct executable witness

```text
FINDING_STATUS = OPEN
FINDING_CATEGORY = REQUIRED_TEST_MISSING / STALE_STATE_WITNESS_GAP
SEVERITY = MAJOR
TICKET = EXEC-001-TICKET-001
REQUIREMENTS = EXEC-ENVELOPE-001; EXEC-ENVELOPE-002; affected EXEC-CONTRACT-001 facet
ACCEPTANCE_REFERENCES = AC-EXEC-001; AC-EXEC-002 completion-evidence/stale test obligation
CAPABILITY = EXEC-SCHEMA-CAPABILITY-PAYLOAD
DEPENDENCY_CLASS = INFORMATIONAL
LOCAL_CLOSURE_BLOCKING = YES
LOCAL_ACCEPTANCE_REQUIRES_PRODUCTIVE_CAPABILITY = NO
CLOSURE_OWNERSHIP = LOCAL_TICKET
EVIDENCE_TIMING = LOCAL_CLOSURE
DEPENDENCY_CLASS_RECLASSIFICATION_REQUIRED = NO
UPSTREAM_DEPENDENCY_CLASSIFICATION_PRESERVED = YES
SUGGESTED_BLOCKS_LOCAL_EXECUTION = NO
SUGGESTED_BLOCKS_LOCAL_CLOSURE = YES
SUGGESTED_BLOCKS_TICKET_DONE = YES
SUGGESTED_BLOCKS_INTEGRATED_PROOF = NO
SUGGESTED_BLOCKS_SPEC_FINAL_CONFORMANCE = NO
PRIMARY_ROUTE = IMPLEMENTATION_REMEDIATION
DOWNSTREAM_CHECKPOINT = local EXEC-001-TICKET-001 closure
DOWNSTREAM_OWNER = EXEC-001-TICKET-001
Systemic pattern = NO
```

**Required behavior:** A genuine successful validation receipt for an exact
pre-mutation input must be rejected when the same input has subsequently
changed, even if the changed input remains otherwise schema-valid. The consumer
must exercise the exact input/reference/fingerprint and current-schema guards,
not merely reject an unauthenticated adapter.

**Production evidence:** `src/application/exec-contract.ts:47-58` rejects
successes without producer membership; `src/domain/exec-contract.ts:397-415`
checks exact producer result, input identity, reference, and current content
fingerprint; `src/infrastructure/exec-schema-validator.ts:46-55,72-91`
rechecks current schema/own fields and issues the receipt. An independently run
authenticated stale test double confirmed the production result is `INVALID`
with `noApproval`, `noCheckpoint`, and `noEffect` after mutation.

**Test evidence:** `tests/exec-001-ticket-001.test.ts:619-694` calls the
application with `stalePort`, a plain object implementing only
`ExecSchemaValidationPort`. The port returns pre-mutation receipts, but
`normalizedValidationResult` rejects them at line 47 before the stale
fingerprint path is reached. Therefore the passing test (and the 25/25 and
83/83 suites) does not witness the required consumer stale transition. The
adapter-only mutation assertion at lines 440-442 is not a substitute: it tests
fresh adapter revalidation, not consumption of a previously issued receipt.

**Observed result:** Production behavior is correct under the independently run
authenticated stale probe, but the repository completion evidence is
non-operational for this required negative path. A future removal or regression
of the domain fingerprint comparison could leave the suite green.

**Expected result:** Use an authenticated test producer that issues an old
receipt through the approved producer boundary, mutate an input field while it
remains schema-valid, invoke `ValidateExecContract.validate`, and assert
`CONTRACT_INVALID`, no partial value, and all three no-success flags. Keep a
separate fresh adapter revalidation assertion if desired.

**Problem:** The test fixture's untrusted-port failure masks the stale-state
assertion. The required state transition is effectively proxy-only.

**Impact:** Local behavioral closure claims strong stale/mutation evidence that
is not actually present; this is a material regression-safety and acceptance-
evidence gap even though the current implementation happens to pass an
independent probe.

**Minimum correction required:** Replace or supplement `stalePort` with an
authenticated producer test double whose receipt is bound to the original
input/reference/fingerprint, mutate the input after receipt, and assert the
consumer-level rejection/no-effect semantics. Do not close the finding with
source inspection or the existing unauthenticated-port test.

**Related locations:**
`src/application/exec-contract.ts:47-58`,
`src/domain/exec-contract.ts:391-415`,
`src/infrastructure/exec-schema-validator.ts:46-91`,
`tests/exec-001-ticket-001.test.ts:619-694`.

### BEH-MINOR-001 — Opaque-identity regression test no longer exercises its named behavior

```text
FINDING_STATUS = OPEN
FINDING_CATEGORY = ASSERTION_QUALITY_GAP
SEVERITY = MINOR
TICKET = EXEC-001-TICKET-001
REQUIREMENTS = EXEC-ENVELOPE-002
ACCEPTANCE_REFERENCES = AC-EXEC-002 regression facet
CAPABILITY = EXEC-SCHEMA-CAPABILITY-PAYLOAD
DEPENDENCY_CLASS = INFORMATIONAL
LOCAL_CLOSURE_BLOCKING = NO
LOCAL_ACCEPTANCE_REQUIRES_PRODUCTIVE_CAPABILITY = NO
CLOSURE_OWNERSHIP = LOCAL_TICKET
EVIDENCE_TIMING = LOCAL_REGRESSION_SUITE
DEPENDENCY_CLASS_RECLASSIFICATION_REQUIRED = NO
UPSTREAM_DEPENDENCY_CLASSIFICATION_PRESERVED = YES
SUGGESTED_BLOCKS_LOCAL_EXECUTION = NO
SUGGESTED_BLOCKS_LOCAL_CLOSURE = NO
SUGGESTED_BLOCKS_TICKET_DONE = NO
SUGGESTED_BLOCKS_INTEGRATED_PROOF = NO
SUGGESTED_BLOCKS_SPEC_FINAL_CONFORMANCE = NO
PRIMARY_ROUTE = IMPLEMENTATION_REMEDIATION
DOWNSTREAM_CHECKPOINT = local regression evidence refresh
DOWNSTREAM_OWNER = EXEC-001-TICKET-001
Systemic pattern = NO
```

**Required behavior:** Existing structured envelope identity fields should remain
observable without normalization when a valid capability payload is supplied.

**Production evidence:** `requiredOpaqueIdentity` and the immutable structured
value preserve exact strings. A direct run with canonical `capability-001` and
opaque envelope IDs returned `VALID` and preserved both IDs.

**Test evidence:** The test named `preserves opaque identity references without
normalization` changes `payload.capabilityId` to `' capability-opaque '` at
`tests/exec-001-ticket-001.test.ts:142-145`. `selectPayload` therefore fails
before the envelope is consumed; assertions at lines 146-151 only verify
`INVALID`/`noEffect`. The test does not assert preservation of either envelope
ID.

**Observed result:** No production regression was found, but the named test is
misleading and cannot protect that sub-behavior.

**Expected result:** Keep the canonical payload capability ID, vary only the
opaque envelope IDs, assert `VALID`, and assert exact preservation; retain a
separate unknown-capability rejection test for the cutover.

**Problem/impact:** A later identity trimming/normalization regression could
pass the current test suite. This is non-blocking because the ticket's two
primary acceptance rows remain directly witnessed and production behavior was
independently observed.

**Minimum correction required:** Split the test data so the identity-preservation
assertion reaches successful construction; separately name and assert unknown
capability rejection.

**Related locations:** `tests/exec-001-ticket-001.test.ts:135-151`,
`src/domain/exec-contract.ts:48-64,456-477`,
`src/application/exec-contract.ts:102-105`.

## 13. Root-cause campaign records

### RCC-EXEC-001-STALE-WITNESS-001

```text
ROOT_CAUSE_CAMPAIGN_ID = RCC-EXEC-001-STALE-WITNESS-001
ROOT_CAUSE_ID = RC-EXEC-001-STALE-CONSUMER-WITNESS
CAMPAIGN_STATUS = OPEN
CAMPAIGN_SCOPE = EXEC-001-TICKET-001 local stale receipt/mutation evidence
CANONICAL_FINDINGS = BEH-MAJOR-001
CAMPAIGN_MATRIX_COMPLETE = YES
ALL_SURFACE_ROWS_COVERED = NO
ALL_NEGATIVE_WITNESSES_PASS = NO
NO_UNEXPLAINED_PUBLIC_AUTHORITY_PATH = YES
NO_HIDDEN_CONCRETE_PROTOCOL = YES
ROOT_CAUSE_REMOVED = NO
KNOWN_MANIFESTATIONS_CLOSED = NO
SYSTEMIC_TEST_EVIDENCE = PARTIAL
```

| Surface row | Surface class | Location/owner | Current behavior | Expected behavior | Coverage | Negative witness IDs |
|---|---|---|---|---|---|---|
| STALE-ISSUER | ISSUER | `JsonSchemaExecValidator.validate` / EXEC-001 | Fresh adapter rechecks current schema and issues bound receipt. | Receipt must bind the original input. | COVERED | adapter mutation assertion |
| STALE-REGISTRAR | REGISTRAR | `ExecContractSchemaDefinitions` | Immutable definition set has no mutable state. | No stale registrar state. | NOT_APPLICABLE — reason: no mutable registrar in scope | N/A |
| STALE-CONSUMER | CONSUMER | `ValidateExecContract` and structured values | Consumer fingerprint guard exists but no repository test reaches it with authenticated stale evidence. | Reject stale receipt at consumer boundary. | MISSING | NONE_DIRECT |
| STALE-ALTERNATE | ALTERNATE_AUTHORITY_PATH | `stalePort` test double | Plain stale port is rejected for wrong reason. | Authenticated stale port must be used for isolation. | MISSING | stale-port proxy |
| STALE-INJECTION | INJECTION_POINT | `ValidateExecContract` validator input | Plain/malformed/copy wrappers fail closed. | No injected result bypass. | COVERED | wrapper/forged-result tests |
| STALE-MUTATION | MUTATION_PATH | `structuredContentFingerprint` and current own-field checks | Production guard exists; adapter-only mutation is covered. | Consumer must compare against old receipt. | PARTIAL | adapter mutation only |
| STALE-PATH | STALE_PATH | domain receipt/value boundary | Independently probed authenticated stale input rejects. | Fail closed, preserve no effect. | PARTIAL | audit probe only |
| STALE-PORT | PORT_SUBSTITUTION_PATH | authenticated alternate adapter seam | Positive alternate adapter and plain wrapper negative exist; stale alternate is absent. | Same stale contract for alternate producer. | PARTIAL | no direct stale alternate |
| STALE-PUBLIC | PUBLIC_EXPORT | `exec-schema.ts` port contract | Explicit port is exported as designed. | Exported producer contract must have stale witness. | PARTIAL | no direct consumer stale test |
| STALE-PERSISTENCE | PERSISTENCE | none | No persistence path. | No stale durable state obligation. | OUTSIDE_SCOPE — no persistence in ticket | N/A |
| STALE-RECOVERY | RETRY_RECOVERY | none | No retry/recovery record. | No recovery stale path in ticket. | OUTSIDE_SCOPE — no interrupted operation | N/A |
| STALE-LEGACY | LEGACY_ROUTE | generic payload cutover | Legacy generic identity is rejected. | No legacy stale authority. | NOT_APPLICABLE — cutover has separate witness | legacy rejection |
| STALE-GUARD | ARCHITECTURE_GUARD | import/provenance tests | Architecture graph and forgery guards pass; stale consumer guard is not operationalized. | Guard the consumer stale transition. | PARTIAL | import/forgery guards |
| STALE-TEST | TEST | `tests/exec-001-ticket-001.test.ts` | Named stale test is proxy-only. | Direct authenticated stale witness. | MISSING | NONE_DIRECT |
```

### RCC-EXEC-001-IDENTITY-TEST-DATA-001

```text
ROOT_CAUSE_CAMPAIGN_ID = RCC-EXEC-001-IDENTITY-TEST-DATA-001
ROOT_CAUSE_ID = RC-EXEC-001-IDENTITY-REGRESSION-DATA-CONFLATION
CAMPAIGN_STATUS = OPEN
CAMPAIGN_SCOPE = TICKET-001 opaque envelope identity regression witness only
CANONICAL_FINDINGS = BEH-MINOR-001
CAMPAIGN_MATRIX_COMPLETE = YES
ALL_SURFACE_ROWS_COVERED = NO
ALL_NEGATIVE_WITNESSES_PASS = NO
NO_UNEXPLAINED_PUBLIC_AUTHORITY_PATH = YES
NO_HIDDEN_CONCRETE_PROTOCOL = YES
ROOT_CAUSE_REMOVED = NO
KNOWN_MANIFESTATIONS_CLOSED = NO
SYSTEMIC_TEST_EVIDENCE = MISSING
```

| Surface row | Surface class | Location/owner | Current behavior | Expected behavior | Coverage | Negative witness IDs |
|---|---|---|---|---|---|---|
| IDENTITY-CONSUMER | CONSUMER | TICKET-001 test data | Unknown capability prevents reaching envelope identity assertions. | Separate valid-identity and unknown-capability cases. | MISSING | NONE_DIRECT |
| IDENTITY-TEST | TEST | `tests/exec-001-ticket-001.test.ts:135-151` | Test name and fixture disagree. | Assert exact preserved IDs on a valid pair. | MISSING | misleading identity test |
| IDENTITY-ISSUER | ISSUER | domain structured value | Exact opaque strings are preserved. | No normalization. | COVERED | direct audit probe |
| IDENTITY-REGISTRAR | REGISTRAR | schema definitions | Not involved in opaque envelope IDs. | N/A. | NOT_APPLICABLE — no registrar identity decision | N/A |
| IDENTITY-CONSUMER-ALT | ALTERNATE_AUTHORITY_PATH | alternate adapter | No separate identity regression witness. | Same value semantics for approved adapter. | OUTSIDE_SCOPE — minor test-only observation | N/A |
| IDENTITY-INJECTION | INJECTION_POINT | caller input | Schema/field checks reject malformed values. | No text fallback. | COVERED | missing/text tests |
| IDENTITY-MUTATION | MUTATION_PATH | structured clone/freeze | Values are copied/frozen. | Returned identity remains stable. | COVERED | immutability tests |
| IDENTITY-STALE | STALE_PATH | input receipt | Separate major stale campaign. | N/A to this identity-only observation. | OUTSIDE_SCOPE — tracked by stale campaign | N/A |
| IDENTITY-PORT | PORT_SUBSTITUTION_PATH | validation adapter | Identity test does not reach adapter result. | N/A to production finding. | OUTSIDE_SCOPE — local test data only | N/A |
| IDENTITY-PUBLIC | PUBLIC_EXPORT | structured values | Public value exposes preserved IDs. | Exact values observable. | COVERED | direct audit probe |
```

## 14. Specialist summary

Audit: `.pi/runtime/workflow-audits/c4a46405-1314-4c2a-9af5-048cea009662/behavior-EXEC-001-TICKET-001-behavior-audit.md`

Specialist:
IMPLEMENTATION_BEHAVIOR

Ticket: EXEC-001-TICKET-001

Required behavioral dimensions: 5

Required tests: 8

Required tests missing: 1

Required behaviors total: 2

Direct behavior witnesses: 2

Proxy-only behaviors: 1

Untested state transitions: 1

Unproven concurrency contracts: 0

Missing architecture guards: 0

Tests run: 83

Tests passed: 83

Tests failed: 0

Regressions: 0

Concurrency:
NOT_APPLICABLE

Stale behavior:
NON_CONFORMANT

Idempotency:
NOT_APPLICABLE

Recovery:
NOT_APPLICABLE

Authority consumption:
NOT_APPLICABLE

Temporal authority:
NOT_APPLICABLE

Caller-as-authority bypasses: 0

Findings:
CRITICAL=0
MAJOR=1
MINOR=1
INFO=0

Domain audit complete:
YES

Specialist result:
SPECIALIST_BEHAVIOR_FINDINGS

AUDIT_TARGET_HEAD: b68eb87d8afc21b5683e89f4ecd3aee8d8238306
AUDIT_TARGET_STATE_FINGERPRINT: 70f7ea178eabee7cef5e588756b093c1de366d85ce9171e05e2235e091996675
AUDIT_WAVE_ID: c4a46405-1314-4c2a-9af5-048cea009662
DOMAIN_AUDIT_COMPLETE: YES
SPECIALIST_RESULT: SPECIALIST_BEHAVIOR_FINDINGS