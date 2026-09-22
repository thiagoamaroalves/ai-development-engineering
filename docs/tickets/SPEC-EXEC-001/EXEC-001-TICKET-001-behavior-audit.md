Audit: docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-001-behavior-audit.md

Specialist:
IMPLEMENTATION_BEHAVIOR

## 1. Audit inputs and pinned target

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
CURRENT_HEAD = c3375bf9675629262ed500857b41a9636971efc0
AUDIT_TARGET_HEAD = c3375bf9675629262ed500857b41a9636971efc0
AUDIT_TARGET_STATE_FINGERPRINT = 8a923cb179405b34582cd6dfafe168750ce897d3b75e4fddb0c00c04d22d8740
```

The authority chain was reconstructed as accepted ADR-0003 revision 3 →
Portfolio O-016 → SPEC-EXEC-001 revision 3 → validated GAP-001 →
Implementation Plan unit EXEC-IMP-01 → the approved ticket and implementation
design → repository implementation and executable tests. The ticket-set audit
was used for the ticket's local-closure and witness allocation. Specialist
behavior conclusions below are based on the pinned repository implementation
and independently executed probes and suites.

The target was independently checked with `git rev-parse HEAD`; it equals the
pinned target. The working tree was clean before this artifact write. The
workflow workspace fingerprint algorithm, excluding the allowed audit
artifacts and `.pi/`, `skills/`, and `.codex/`, independently produced the
pinned state fingerprint above.

### Changed implementation surface

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
```

### Relevant executable suites

```text
TICKET_SUITE = node --experimental-strip-types --test tests/exec-001-ticket-001.test.ts
REGRESSION_SUITE = npm test
FOCUSED_SOURCE_TYPECHECK = npx tsc --noEmit --strict --target ES2023 --module NodeNext --moduleResolution NodeNext --allowImportingTsExtensions --skipLibCheck --types node src/domain/exec-contract.ts src/domain/exec-schema.ts src/domain/exec-validation-evidence-internal.ts src/application/exec-contract.ts src/infrastructure/exec-schema-validator.ts src/composition/exec-contract.ts tests/exec-001-ticket-001.test.ts
PACKAGE_TYPECHECK = npm run typecheck (does not include src/**)
```

## 2. Reconstructed behavioral contract

The applicable local contract is:

1. A valid envelope and capability payload are accepted only when both
   ticket-owned, identifiable schemas validate.
2. The envelope carries the structured minimum fields required by
   EXEC-ENVELOPE-002, and the payload carries its identifiable schema and
   structured data.
3. Human text is descriptive only; it cannot provide omitted structured
   authority.
4. Missing, malformed, text-only, schema-incompatible, or otherwise unproven
   input returns an immutable `CONTRACT_INVALID` result with no validated pair,
   approval, checkpoint, or effect signal.
5. Successful consumption returns an immutable structured pair with canonical
   schema references. Schema mechanics stay behind the validation port and no
   prototype, `.pi`, transport, registry, persistence, or lifecycle authority
   is used.
6. Evidence from a validation operation must be tied to the exact current
   input and canonical schema reference. This is an implementation-level
   authority guard explicitly exercised by the ticket's tests and design.

The local ticket has no aggregate, lifecycle mutation, persistence, external
side effect, retry command, or recovery record. It does have an affected
freshness/stale-evidence concern because the implementation carries validation
receipts and rejects evidence after input content changes.

## 3. Behavioral applicability matrix

| Dimension | Classification | Audit basis and result |
|---|---|---|
| UNIT_BEHAVIOR | REQUIRED | Direct schema validation, structured construction, immutable result, and fail-closed result are owned here. Inspected through the default composition boundary and domain values. |
| INTEGRATION_BEHAVIOR | AFFECTED | The ticket contributes a structured contract to later consumers and requires the existing generic delegation consumer to reject text as canonical completion. The local consumer regression was executed; foreign EXEC integrations are outside scope. |
| PERSISTENCE | NOT_APPLICABLE | No durable state, repository, journal, serialized record, or persistence ordering is introduced. |
| CONCURRENCY | NOT_APPLICABLE | Validation is synchronous and side-effect free; no mutable shared domain state or concurrent mutation contract exists. |
| STALE_STATE | AFFECTED | Validation evidence is explicitly tied to current input content. Mutation and inherited-field stale cases were directly executed and rejected. |
| IDEMPOTENCY | NOT_APPLICABLE | There is no command, durable identity, business effect, or external mutation to repeat or reconcile. Repeated pure validation is not an operational idempotency contract. |
| DURABILITY | NOT_APPLICABLE | No completion or dependent observation is reported from a durable write. |
| RECOVERY | NOT_APPLICABLE | No interrupted operation, restart, replay, or recovery state exists in this unit. |
| COMPATIBILITY | NOT_APPLICABLE | This is `NEW_CANONICAL_PATH`; no legacy reader or compatibility mapping is in scope. Schema identity/version rejection is covered as unit negative behavior, not migration compatibility. |
| MIGRATION_BEHAVIOR | NOT_APPLICABLE | The ticket explicitly forbids legacy conversion and does not implement a cutover or migration. |
| NEGATIVE_PATHS | REQUIRED | Text-only, missing fields, invalid schema values, malformed adapter results, thrown adapter errors, stale evidence, inherited fields, and no-success/no-effect outcomes are owned or materially affected. |

## 4. Production semantics audit

| Required/affected behavior | Classification | Observed execution and evidence |
|---|---|---|
| Canonical identifiable schema definitions | IMPLEMENTED_CORRECTLY on the default composition path | `ExecContractSchemaDefinitions` exposes frozen envelope and payload documents and canonical `SchemaReference` objects. `JsonSchemaExecValidator` rejects non-canonical definition object identity before compilation (`src/infrastructure/exec-schema-validator.ts:106-109`). |
| Both envelope and payload must validate before success | PARTIAL / CONTRADICTORY under the public application port | `ValidateExecContract.validate` invokes both port operations and constructs the pair only after both normalized results are `valid` (`src/application/exec-contract.ts:98-126`). The default adapter supplies genuine evidence. However, the application accepts any caller-supplied `ExecSchemaValidationPort`, and the evidence recognizer can be forged by a same-named caller class; see BEH-CRITICAL-001. |
| Minimum structured fields and schema identity | IMPLEMENTED_CORRECTLY for the default path | JSON Schema required properties are checked by the compiled adapter and own-enumerable guard (`src/infrastructure/exec-schema-validator.ts:19-24,116-132`). Domain construction additionally checks canonical schema references, current own data fields, identities, semver, arrays, and JSON-shaped payload data (`src/domain/exec-contract.ts:356-454`). |
| Human text is non-authoritative | IMPLEMENTED_CORRECTLY for the default path | `humanText` is not consumed by the application service. Text-only and omitted-field inputs return invalid results; direct assertions are in `tests/exec-001-ticket-001.test.ts:606-640`. The untrusted adapter authority route remains unsafe under BEH-CRITICAL-001. |
| Invalid input fails closed | IMPLEMENTED_CORRECTLY for exercised default failures; UNSAFE_FAILURE_BEHAVIOR for forged evidence | Default invalid paths return `ContractInvalidFailure` with `CONTRACT_INVALID`, immutable references, `noApproval`, `noCheckpoint`, and `noEffect` (`src/domain/exec-contract.ts:546-590`; tests `:606-650`). A forged evidence object can instead reach `VALID` without a canonical schema-engine call, violating the same fail-closed authority invariant. |
| Structured success is immutable and complete | IMPLEMENTED_CORRECTLY after accepted evidence | Domain values clone/freeze structured content and validated pair construction requires branded value instances (`src/domain/exec-contract.ts:95-143,406-498,501-544`). Focused tests assert frozen outputs and structured fields. |
| Evidence freshness after content mutation | IMPLEMENTED_CORRECTLY for genuine adapter evidence | The adapter fingerprints the exact input and domain evidence validation recomputes the fingerprint. The stale genuine-evidence tests for envelope and payload mutation and inherited replacement pass (`tests/exec-001-ticket-001.test.ts:411-485`). |
| No forbidden productive dependency path | IMPLEMENTED_CORRECTLY for the tested import graph | The executable graph guard traverses the composition boundary and asserts the exact six-file productive graph, allowing only `typebox` as a bare dependency (`tests/exec-001-ticket-001.test.ts:786-831`). This guard does not establish evidence-brand authenticity, which is the separate critical defect. |

## 5. Acceptance witness audit

The ticket/design matrix contains four normative rows. Each has a direct
positive operation and a direct negative or isolation operation executed
through the production validation boundary. The witnesses are locally
executable contract-level evidence, not durability or foreign-integration
proof.

| Normative behavior | Direct positive witness | Direct negative/isolation witness | Witness result |
|---|---|---|---|
| Envelope and payload are schema-validatable (`EXEC-ENVELOPE-001`, `AC-EXEC-001`) | Valid pair through `createExecContractValidator().validate`, asserting `VALID` and both schema references (`tests:86-94`). | Text-only, invalid schema, custom schema substitution, and one-side-invalid tests assert `CONTRACT_INVALID` and no partial value (`tests:606-650`). | Direct witness executes and passes for canonical adapter; not sufficient against forged same-name evidence. |
| Minimum structured fields are required (`EXEC-ENVELOPE-002`, `AC-EXEC-002`) | Complete structured envelope/payload accepted through production boundary (`tests:86-94,624-640`). | Removed `functionalVerdict` plus text and removed payload `data` are rejected with `CONTRACT_INVALID` and no success/effect signals (`tests:624-650`). | Direct witness executes and passes. |
| Valid input is consumed as a structured contract (`AC-EXEC-001`) | Result exposes structured schema references/data and preserves opaque identities (`tests:86-115`). | Human text cannot fill omitted fields; alternate schema identity is rejected (`tests:152-183,624-640`). | Direct witness executes and passes for canonical path; authority provenance has the critical bypass below. |
| Invalid contract fails closed (`AC-EXEC-002`) | Valid result remains consumable and immutable (`tests:86-94,775-831`). | Default malformed/text/missing/inherited/non-JSON/adapter-error paths assert invalid code, no approval/checkpoint/effect, and no partial value (`tests:497-517,606-724`). | Direct witness executes and passes for covered paths, but the evidence guard itself is bypassable. |

```text
REQUIRED_BEHAVIORS_TOTAL = 4
DIRECT_BEHAVIOR_WITNESSES = 4
PROXY_ONLY_BEHAVIORS = 0
UNTESTED_STATE_TRANSITIONS = 0
UNPROVEN_CONCURRENCY_CONTRACTS = 0
MISSING_ARCHITECTURE_GUARDS = 1
WITNESS_EXECUTABLE_AT_LOCAL_CLOSURE = YES for all four matrix rows
```

The generic delegation test is a direct consumer-boundary regression witness,
not a proxy for schema validation: it executes the workflow and asserts the
incomplete canonical result stop and absence of a generated effect
(`tests/exec-001-ticket-001.test.ts:852-879`).

## 6. Authority consumption and caller-authority audit

### AUTHORITY_CONSUMPTION_PROOF: ACP-EXEC-01

The upstream handoff is preserved without promoting a local fixture to a
foreign productive producer:

```text
CAPABILITY_ID = UNIT-EXEC-SCHEMA-HARNESS
AUTHORITY_EXISTENCE = YES
TRUTH_OWNER = SPEC-EXEC-001 / EXEC-001
AUTHORITY_SEMANTIC_SOURCE = ADR-0003/O-016 and EXEC-ENVELOPE-001/002
OWNER_DOMAIN_OR_BOUNDED_CONTEXT = SPEC-EXEC-001
CONSUMPTION_CONTRACT = canonical identifiable envelope/payload schemas and validation result
PORT_INTERFACE_QUERY_RESOLVER_OR_READER = ExecSchemaValidationPort
CONTRACT_PRODUCER = ticket-owned schema definitions plus JsonSchemaExecValidator
CONTRACT_CONSUMER = ValidateExecContract and later EXEC consumers
RETURNED_DATA = valid/invalid result, structured fields after construction, schema references and failure meaning
VERSION_REVISION_TRANSPORT = schemaId and schemaVersion carry the ticket-owned 1.0.0 identity; registry/version resolution is out of scope
FAILURE_NOT_FOUND_STALE_SEMANTICS = invalid/unknown/missing/unproven input fails as CONTRACT_INVALID; genuine stale evidence is rejected
AUTHORITY_STATUS = DEFINED
CONTRACT_STATUS = DEFINED
SEMANTIC_STATUS = DEFINED
LOCAL_TESTABILITY = YES
PRODUCTIVE_AVAILABILITY = NO for the unit-owned fixture/harness handoff; it is not a foreign productive producer
CAPABILITY_SUMMARY_STATUS = CONTRACT_TESTABLE_LOCALLY
DEPENDENCY_CLASS = INFORMATIONAL
AVAILABILITY_EVIDENCE = default adapter execution and direct local contract tests
BLOCKING_EFFECT = NONE for capability availability; the local implementation defect is separately blocking
RESULT = AUTHORITY_CONSUMPTION_GAP for productive availability only
PROOF_EVIDENCE = ticket §14a–§14c; design §§7,16,20; direct execution above
```

The `PRODUCTIVE_AVAILABILITY = NO` record is not converted into a local
readiness blocker because its dependency class is `INFORMATIONAL`, and the
upstream classification is preserved. The implementation itself has a local
productive default adapter, but that does not promote the named fixture/harness
handoff to a foreign productive authority.

### PRODUCER_CONSUMER_CONTRACT_PROOF: PCP-EXEC-01

```text
CAPABILITY_ID = UNIT-EXEC-SCHEMA-HARNESS
AUTHORITY_OWNER = SPEC-EXEC-001 / EXEC-001
PRODUCER = ticket-owned schema definition and validation boundary
PRODUCED_CONTRACT = identifiable envelope/payload validation result with structured fields
CONSUMER = ValidateExecContract and later EXEC consumers
CONSUMED_CAPABILITY = validated structured envelope/payload pair
SEMANTIC_STATUS = DEFINED
LOCAL_TESTABILITY = YES
PRODUCTIVE_AVAILABILITY = NO for the fixture/harness record
CAPABILITY_SUMMARY_STATUS = CONTRACT_TESTABLE_LOCALLY
AVAILABILITY_EVIDENCE = default adapter and focused direct tests
AVAILABILITY_CONDITION = unit harness executable at local closure
DEPENDENCY_CLASS = INFORMATIONAL
DEPENDENCY_EDGE = TICKET-001 local schema contract → EXEC consumers
PROOF_EVIDENCE = ticket §14b–§14c; design §16; focused suite
```

### Temporal and caller checks

```text
TEMPORAL_AUTHORITY_PROOF = NOT_APPLICABLE
TEMPORAL_AUTHORITY_GAPS = 0
REASON = no mutable external authority is observed before an effect; this unit has no effect commit point
CALLER_AS_AUTHORITY_CHECK = FAIL
CALLER_SUPPLIED_AUTHORITY_BYPASS = 1
BYPASS = a caller-provided validation port can mint an object accepted as canonical validation evidence
```

The stale-input checks are a freshness guard, not a second observation of an
external authority before an effect. They do not cure the caller-supplied
evidence-recognition bypass.

## 7. Test inventory and assertion quality

### Required test-category inventory

| Category | Classification | Evidence/result |
|---|---|---|
| UNIT | REQUIRED_TEST_PRESENT | 21 direct ticket tests execute the application/domain boundary. |
| INVARIANT | REQUIRED_TEST_PRESENT | Canonical schema identity, required fields, immutability, JSON-only values, and complete-pair invariants are asserted. |
| PERSISTENCE | TEST_CATEGORY_NOT_APPLICABLE | No persistence contract exists in this ticket. |
| INTEGRATION | TEST_CATEGORY_NOT_APPLICABLE | No foreign EXEC producer or downstream mapping is locally required; the generic consumer regression is recorded under CONFORMANCE. |
| CROSS_SPEC | TEST_CATEGORY_NOT_APPLICABLE | Ticket declares no cross-SPEC capability for local closure. |
| CONCURRENCY | TEST_CATEGORY_NOT_APPLICABLE | No mutable concurrent operation. |
| STALE | REQUIRED_TEST_PRESENT | Genuine stale evidence after envelope/payload mutation is executed and rejected. |
| IDEMPOTENCY | TEST_CATEGORY_NOT_APPLICABLE | No durable command/effect. |
| RECOVERY | TEST_CATEGORY_NOT_APPLICABLE | No restart/replay/recovery behavior. |
| COMPATIBILITY | TEST_CATEGORY_NOT_APPLICABLE | No legacy reader or migration mapping. |
| MIGRATION | TEST_CATEGORY_NOT_APPLICABLE | Explicit `NEW_CANONICAL_PATH`; no cutover. |
| NEGATIVE_PATH | REQUIRED_TEST_PRESENT | Invalid, text-only, missing-field, non-JSON, inherited, malformed-result, thrown-error, and no-signal paths are executed. |
| ARCHITECTURE_GUARD | REQUIRED_TEST_PRESENT, INCOMPLETE | Import graph and several forged-evidence guards execute, but the same-name evidence forgery is not covered and succeeds. |
| CONFORMANCE | REQUIRED_TEST_PRESENT | Generic delegation consumer rejects text-only completion/effect promotion. |

```text
REQUIRED_TEST_CATEGORIES = 6
REQUIRED_TESTS_MISSING = 0 category-level; the architecture guard is materially incomplete and is covered by BEH-CRITICAL-001
```

### Assertion-quality assessment

Canonical success/failure assertions are `STRONG`: they inspect discriminated
status, schema references, structured fields, exact failure code, no-success
signals, no partial value, immutability, and observed references. The generic
consumer regression is also `STRONG` because it asserts the stop code and
absence of the generated file/effect.

The forged-evidence guard is `MISLEADING` for the broader invariant it claims
to cover. `tests/exec-001-ticket-001.test.ts:271-405` uses a class named
`CallerDefinedEvidence`; the recognizer rejects it because its name is not
`CanonicalSchemaValidationEvidence`, but the test does not attempt a caller
class with the expected name. The green assertion therefore does not establish
that the adapter-private brand is unforgeable.

## 8. Direct adversarial execution and finding

### BEH-CRITICAL-001 — caller-supplied validation authority bypass

```text
FINDING_STATUS = OPEN
FINDING_CATEGORY = CALLER_SUPPLIED_AUTHORITY_BYPASS
SEVERITY = CRITICAL
TICKET = EXEC-001-TICKET-001
REQUIREMENT_REFERENCES = EXEC-ENVELOPE-001, EXEC-ENVELOPE-002
ACCEPTANCE_REFERENCES = AC-EXEC-001, AC-EXEC-002
CAPABILITY = UNIT-EXEC-SCHEMA-HARNESS
DEPENDENCY_CLASS = INFORMATIONAL
LOCAL_ACCEPTANCE_REQUIRES_PRODUCTIVE_CAPABILITY = NO
LOCAL_CLOSURE_BLOCKING = YES
DEPENDENCY_CLASS_RECLASSIFICATION_REQUIRED = NO
UPSTREAM_DEPENDENCY_CLASSIFICATION_PRESERVED = YES
CLOSURE_OWNERSHIP = LOCAL_TICKET
EVIDENCE_TIMING = LOCAL_TICKET_CLOSURE
PRIMARY_ROUTE = IMPLEMENTATION_REMEDIATION
DOWNSTREAM_CHECKPOINT = TICKET-001 local closure and EXEC contract conformance checkpoint
DOWNSTREAM_OWNER = EXEC-001 implementation owner
```

**Required behavior.** Only a successful execution of the canonical,
identifiable envelope and payload schemas may produce consumable structured
contract values. A caller-controlled adapter or receipt must not be able to
mint validation authority.

**Production evidence.**

- `src/domain/exec-validation-evidence-internal.ts:16-22` recognizes evidence
  by the caller-readable string `evidenceType.name`, prototype equality to that
  supplied function, and a public method call. It does not compare the supplied
  constructor to the actual infrastructure constructor and does not verify the
  infrastructure private `#brand`.
- `src/infrastructure/exec-schema-validator.ts:34-65` has the real private
  `#brand`, but the recognizer does not require the real class identity.
- `src/application/exec-contract.ts:80-81,98-126` accepts a caller-supplied
  `ExecSchemaValidationPort`, trusts its normalized `valid/evidence` result,
  and passes the accepted receipt into domain construction.

**Direct test evidence.** The following independent probe was executed against
the pinned target. It defined a caller class literally named
`CanonicalSchemaValidationEvidence` with `isCanonicalEvidence() { return true }`,
constructed a frozen receipt containing the exact input, canonical schema
reference, and `structuredContentFingerprint`, and returned it from an adapter
that never invoked `JsonSchemaExecValidator`. The probe asserted the required
result `INVALID`:

```text
expected: INVALID (untrusted adapter cannot mint canonical evidence)
observed: VALID
process exit: 1
AssertionError: 'VALID' !== 'INVALID'
```

The same probe without the intentionally failing assertion printed `VALID e`,
where `e` was the envelope execution identity. Both envelope and payload
receipts were accepted. This is distinct from the existing test at
`tests/exec-001-ticket-001.test.ts:271-405`, whose caller class has a different
name and therefore does not exercise the bypass.

**Observed result.** An untrusted injected port can produce `VALID` and a
`ValidatedExecContract` without any canonical JSON Schema engine execution.
The exact-input fingerprint and schema-reference checks do not help because
the caller can calculate the public fingerprint and reuse canonical references
from `ExecContractSchemaDefinitions`.

**Expected result.** The forged evidence must be rejected as `CONTRACT_INVALID`
with no validated value, no approval/checkpoint/effect signal, regardless of the
caller-chosen class name or verifier implementation.

**Problem.** The purported adapter-private evidence check is nominal and
structural rather than identity-bound. A same-name caller class with the
expected prototype method satisfies `isIssuedSchemaValidationEvidence`; the
application's injectable port then becomes an authority source.

**Impact.** The contract boundary can accept a result whose schema validation
never occurred. Any downstream consumer that treats `ValidatedExecContract` as
proof of schema conformance can consume unvalidated authority and potentially
map it toward approval, checkpoint, or effect processing. This is a fundamental
caller-supplied-authority bypass, not merely a weak assertion or a missing edge
case.

**Minimum correction required.** Make evidence recognition depend on an
unforgeable identity owned by the actual canonical adapter (or remove the
caller-controlled authority handoff), and add a direct negative test using a
caller-defined class whose function name is exactly
`CanonicalSchemaValidationEvidence`. The corrected path must return
`CONTRACT_INVALID` and expose no validated pair.

```text
Systemic pattern = YES
Related locations =
  src/domain/exec-validation-evidence-internal.ts:9-22
  src/infrastructure/exec-schema-validator.ts:34-65
  src/application/exec-contract.ts:76-126
  tests/exec-001-ticket-001.test.ts:271-405
  tests/exec-001-ticket-001.test.ts:86-94 and 606-650 (the downstream success/failure witnesses)
```

### Finding blocking effects

The following are specialist evidence for canonical consolidation; they do not
replace canonical derivation of completion gates:

```text
SUGGESTED_BLOCKS_LOCAL_EXECUTION = YES
SUGGESTED_BLOCKS_LOCAL_CLOSURE = YES
SUGGESTED_BLOCKS_TICKET_DONE = YES
SUGGESTED_BLOCKS_INTEGRATED_PROOF = YES
SUGGESTED_BLOCKS_SPEC_FINAL_CONFORMANCE = YES
INTEGRATED_ONLY_AVAILABILITY_BLOCKING_LOCAL_DONE = 0
```

This is a local implementation/acceptance defect, not a reason to reclassify
the upstream informational capability as a local productive dependency. The
upstream dependency classification remains preserved.

## 9. Negative/failure, stale, persistence, recovery, and compatibility results

```text
INVALID_INPUT = default adapter returns CONTRACT_INVALID; PASS
MISSING_FIELDS = default adapter returns CONTRACT_INVALID; PASS
TEXT_ONLY = default adapter returns CONTRACT_INVALID with noApproval/noCheckpoint/noEffect; PASS
ONE_SIDE_INVALID = no partial validated pair; PASS
MALFORMED_ADAPTER_RESULT = normalized to CONTRACT_INVALID; PASS
THROWN_ADAPTER_ERROR = normalized to CONTRACT_INVALID; PASS
STALE_GENUINE_EVIDENCE = mutated envelope/payload evidence rejected; PASS
FORGED_SAME_NAME_EVIDENCE = incorrectly returns VALID; FAIL (BEH-CRITICAL-001)
PERSISTENCE = NOT_APPLICABLE
RECOVERY = NOT_APPLICABLE
COMPATIBILITY/MIGRATION = NOT_APPLICABLE
```

No persistence, restart, durable identity, retry-after-partial-failure,
physical CAS, migration, or legacy-reader behavior is owned or affected by this
ticket. No such evidence is required or claimed.

## 10. Test execution record

Execution was independent of implementation-report claims:

| Command/evidence | Result | Classification |
|---|---|---|
| `node --experimental-strip-types --test tests/exec-001-ticket-001.test.ts` | 21 passed, 0 failed, 0 skipped | Focused ticket suite; all existing assertions green, including the incomplete forge guard. |
| `npm test` | 25 passed, 0 failed, 0 skipped | Relevant repository regression suite; no regression in generic workflow consumer behavior. |
| Focused strict `tsc` over six touched production files and ticket test | PASS | Static evidence; all touched source included. |
| `npm run typecheck` | PASS | Package typecheck only covers `.pi/extensions/**/*.ts`; not relied on for `src/**`. |
| Direct same-name forged-evidence assertion probe | 0 passed, 1 failed | `IMPLEMENTATION_FAILURE`: expected `INVALID`, observed `VALID`; this is the decisive adversarial behavior evidence. |

```text
TESTS_RUN = 47 executable cases/evidence assertions counted (21 focused + 25 regression + 1 adversarial assertion)
TESTS_PASSED = 46
TESTS_FAILED = 1
TESTS_SKIPPED = 0
ENVIRONMENTAL_FAILURES = 0
FAILURE_CLASSIFICATION = IMPLEMENTATION_FAILURE (BEH-CRITICAL-001)
```

## 11. Regression result

```text
REGRESSION_RESULT = NO_REGRESSION
REGRESSIONS = 0
BASELINE_COMPARISON = implementation baseline 381218d5... contained no productive EXEC contract surface; the existing generic workflow regression remains green
```

The critical result is a newly implemented behavior defect in the ticket's
contract boundary, not a pre-existing regression in an affected contract.

## 12. Specialist summary

Audit: docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-001-behavior-audit.md

Specialist:
IMPLEMENTATION_BEHAVIOR

Ticket: EXEC-001-TICKET-001

Required behavioral dimensions: 4

Required tests: 6

Required tests missing: 0

Required behaviors total: 4

Direct behavior witnesses: 4

Proxy-only behaviors: 0

Untested state transitions: 0

Unproven concurrency contracts: 0

Missing architecture guards: 1

Tests run: 47

Tests passed: 46

Tests failed: 1

Regressions: 0

Concurrency:
NOT_APPLICABLE

Stale behavior:
CONFORMANT

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

AUDIT_TARGET_HEAD: c3375bf9675629262ed500857b41a9636971efc0
AUDIT_TARGET_STATE_FINGERPRINT: 8a923cb179405b34582cd6dfafe168750ce897d3b75e4fddb0c00c04d22d8740
DOMAIN_AUDIT_COMPLETE: YES
SPECIALIST_RESULT: SPECIALIST_BEHAVIOR_FINDINGS