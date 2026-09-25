# Implementation behavior audit — EXEC-001-TICKET-001

## Audit posture and target

```text
READ_ONLY = YES
INDEPENDENT = YES
ADVERSARIAL = YES
BEHAVIOR_FIRST = YES
TEST_ASSERTION_AWARE = YES
NEGATIVE_PATH_AWARE = YES
REGRESSION_AWARE = YES
FAILURE_SEMANTICS_AWARE = YES
NO_REMEDIATION = YES
```

The implementation and tests were audited from the pinned target. `CURRENT_HEAD`
and `AUDIT_TARGET_HEAD` both resolve to the supplied target commit. The working
tree had one pre-existing modification to an implementation-design audit
artifact; no production or test implementation path had a working-tree overlay.
That documentary artifact was not used as implementation evidence and is outside
the semantic implementation subject.

## Required inputs

| Field | Value |
|---|---|
| TICKET_ID | `EXEC-001-TICKET-001` |
| TICKET_PATH | `docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-001-capability-specific-envelope-and-payload-schemas.md` |
| IMPLEMENTATION_UNIT | `EXEC-IMP-01 — Capability-specific envelope and payload schemas` |
| REQUIREMENT_IDS | `EXEC-ENVELOPE-001`, `EXEC-ENVELOPE-002` |
| ACCEPTANCE_IDS | `AC-EXEC-001`, `AC-EXEC-002` |
| SPEC_PATH | `docs/specs/SPEC-EXEC-001-skill-contracts-and-capability-registry.md` (revision 5) |
| GAP_MATRIX_PATH | `docs/specs/gap-matrices/SPEC-EXEC-001-implementation-gap-matrix.md` (`GAP-018`) |
| IMPLEMENTATION_PLAN_PATH | `docs/specs/implementation-plans/SPEC-EXEC-001-implementation-plan.md` |
| APPROVED_DESIGN_PATH | `docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-001-implementation-design.md` |
| TICKET_SET_AUDIT_PATH | `docs/tickets/SPEC-EXEC-001/implementation-ticket-audit.md` |
| IMPLEMENTATION_BASELINE | `8cf79cd37ebb02d0657c1fb191cea1d194b71f89` |
| CURRENT_HEAD | `543033de8484c9104c28fa60d5228027d170c103` |
| AUDIT_TARGET_HEAD | `543033de8484c9104c28fa60d5228027d170c103` |
| AUDIT_TARGET_STATE_FINGERPRINT | `48adbeb1d4917fabba5cde69f45f28f189f99f86b19098434fabcadc9c042350` |
| CHANGED_PRODUCTION_FILES | `src/application/exec-contract.ts`; `src/domain/exec-contract.ts`; `src/domain/exec-schema.ts`; `src/domain/exec-validation-evidence-internal.ts`; `src/infrastructure/exec-schema-validator.ts` |
| CHANGED_TEST_FILES | `tests/exec-001-ticket-001.test.ts` |
| CHANGED_EVIDENCE_FILES | `docs/tickets/SPEC-EXEC-001/evidence/TICKET-001/AC-EXEC-001-envelope-schema.md`; `AC-EXEC-001-structured-consumption.md`; `AC-EXEC-002-fail-closed.md`; `AC-EXEC-002-required-fields.md` |
| RELEVANT_TEST_SUITES | `tests/exec-001-ticket-001.test.ts`; `tests/exec-001-ticket-002.test.ts`; `.pi/extensions/workflow-orchestrator/test/*.test.ts`; `npm run typecheck`; governance, skill-mirror and canonical-consistency guards |

## Authority-chain reconstruction

The accepted chain is:

```text
ADR-0003 (ACCEPTED, revision 3)
  -> SPEC-EXEC-001 revision 5, O-016
  -> GAP-018 / EXEC-ENVELOPE-001
  -> EXEC-IMP-01 in the conformant Implementation Plan
  -> EXEC-001-TICKET-001 and its approved implementation design
  -> repository implementation and executable tests
```

The governing contract requires a common identifiable envelope and a
capability-specific identifiable payload before consumption, structured minimum
fields, and non-authoritative human text. This ticket does not own registry
publication/resolution, DOM identity/lifecycle, persistence, transport,
external effects, or downstream mappings.

### Authority and capability handoff reconciliation

The unit-owned record is `EXEC-SCHEMA-CAPABILITY-PAYLOAD`:

```text
AUTHORITY_OWNER = EXEC-001
PRODUCER = ticket-owned EXEC schema authority/definition set
CONSUMER = ValidateExecContract and structured contract values
AUTHORITY_STATUS = DEFINED
CONTRACT_STATUS = DEFINED
LOCAL_TESTABILITY = YES
PRODUCTIVE_AVAILABILITY = NO for the approved fixture/harness handoff
CAPABILITY_SUMMARY_STATUS = CONTRACT_TESTABLE_LOCALLY
DEPENDENCY_CLASS = INFORMATIONAL
FOREIGN_PRODUCER_REQUIRED_FOR_LOCAL_EXECUTION = NO
FOREIGN_PRODUCER_REQUIRED_FOR_LOCAL_CLOSURE = NO
```

The actual composition root executes the local canonical adapter, so local
implementation behavior is executable. The `PRODUCTIVE_AVAILABILITY = NO`
record is preserved for the approved fixture/harness capability handoff; it is
not promoted to productive foreign availability by this audit. Under the shared
authority gate, the capability is therefore `DEFINED_BUT_NOT_CONSUMABLE` as a
cross-boundary availability classification, while that fact has no blocking
effect because the dependency class is `INFORMATIONAL` and the authority is
unit-owned.

`AUTHORITY_CONSUMPTION_PROOF` and
`PRODUCER_CONSUMER_CONTRACT_PROOF` are defined for the bounded local contract,
but the provenance negative witness below exposes a consumer/issuer proof defect.
`TEMPORAL_AUTHORITY_PROOF = NOT_APPLICABLE`: the operation validates immutable
local schema definitions and commits no external effect. Input mutation and
stale validation receipts are nevertheless covered as local provenance/staleness
behavior, not as revalidation of mutable external authority.

## Behavioral contract and applicability matrix

### Observable behaviors

1. A complete envelope and a capability-appropriate payload select the
   ticket-owned identifiable schema definitions and return one complete,
   immutable validated pair.
2. A generic-but-capability-invalid payload, unknown capability, old generic
   schema identity, schema mismatch, malformed input, or missing minimum field
   returns `CONTRACT_INVALID`; no partial pair, approval, checkpoint, or effect
   signal is exposed.
3. Human text is descriptive only and cannot supply a missing structured field
   or authority.
4. Validation evidence is bound to the canonical schema reference, exact input
   identity and current content; stale/mutated evidence must fail closed.
5. Equivalent validation is side-effect free and repeatable. The ticket does
   not create durable state or execute effects.
6. The generic payload path is intentionally retired as a new canonical path;
   rejection of the old schema identity is expected cutover behavior.

| Behavioral dimension | Applicability | Reason and inspection result |
|---|---|---|
| `UNIT_BEHAVIOR` | REQUIRED | Core schema selection, validation, value construction and failure semantics are owned by this ticket. |
| `INTEGRATION_BEHAVIOR` | AFFECTED | The productive composition boundary is in scope; foreign downstream integration is explicitly excluded and remains a handoff. |
| `PERSISTENCE` | NOT_APPLICABLE | No repository, journal, durable record, snapshot, manifest or storage write exists in this unit. |
| `CONCURRENCY` | NOT_APPLICABLE | There is no mutable shared domain state or concurrent mutation command; adapter `WeakMap` caches are private implementation caches, not a semantic concurrency contract. |
| `STALE_STATE` | AFFECTED | A validation receipt can be reused after envelope/payload mutation; current-content and own-field rejection are required. |
| `IDEMPOTENCY` | AFFECTED | Repeated equivalent validation must remain side-effect free and semantically repeatable, although no external-effect idempotency is owned here. |
| `DURABILITY` | NOT_APPLICABLE | No completion or effect is reported as durable by this operation. |
| `RECOVERY` | NOT_APPLICABLE | Restart, replay, retry reconciliation and durable identity belong to later units/owners and no recovery operation is implemented here. |
| `COMPATIBILITY` | AFFECTED | The generic payload schema is deliberately retired and the new identifiable capability path must reject the old identity without fallback. |
| `MIGRATION_BEHAVIOR` | NOT_APPLICABLE | No persisted historical material or migration is read or rewritten. |
| `NEGATIVE_PATHS` | REQUIRED | Invalid schema, missing field, text-only, forged result, malformed adapter, stale input and no-effect failures are required contract behavior. |

## Production-semantics audit

| Behavior | Production evidence | Classification |
|---|---|---|
| Immutable identifiable envelope definition | `src/domain/exec-schema.ts:86-126,146-163` defines the frozen envelope document and required structured fields. | `IMPLEMENTED_CORRECTLY` |
| Capability-specific schema definition and selection | `src/domain/exec-schema.ts:128-170` binds `capability-001` to `exec-capability-001-payload@1.0.0`, requires `data.result`, freezes the definition set, and selects only an exact capability/schema/version tuple. | `IMPLEMENTED_CORRECTLY` for the single ticket-owned capability scope. |
| Application validation flow | `src/application/exec-contract.ts:96-140` selects the payload definition, validates both sides, aggregates issues, constructs both structured values only after success, and exposes no partial result. | `IMPLEMENTED_CORRECTLY` |
| Canonical schema mechanics | `src/infrastructure/exec-schema-validator.ts:117-155` rejects non-canonical definitions, compiles the frozen document, checks required own-enumerable fields, rechecks current input and issues a frozen result. | `IMPLEMENTED_CORRECTLY` for the canonical adapter. |
| Envelope/payload semantic construction | `src/domain/exec-contract.ts:480-562` requires authenticated success evidence, exact canonical references, current own data fields, capability identity and non-empty `data.result`; cloning/freezing prevents mutable returned values. | `IMPLEMENTED_CORRECTLY` |
| Invalid/failure result | `src/domain/exec-contract.ts:594-633` emits frozen `CONTRACT_INVALID` failures with expected/observed references and `noApproval`, `noCheckpoint`, `noEffect` flags; application catches malformed/throwing adapter behavior. | `IMPLEMENTED_CORRECTLY` |
| Generic/legacy cutover | The old `exec-capability-payload` identity is not selected; `src/domain/exec-schema.ts:165-170` requires the new exact identity and the application has no generic fallback. | `IMPLEMENTED_CORRECTLY`; intentional authorized cutover, not a regression. |
| Stale/mutation protection | `src/infrastructure/exec-schema-validator.ts:105-145` rechecks the current schema input; `src/domain/exec-contract.ts:391-415,495-503,547-560` binds exact input/reference/fingerprint and rechecks current own data. | `IMPLEMENTED_CORRECTLY` for canonical receipts. |
| Authority provenance/anti-forgery | `src/domain/exec-validation-evidence-internal.ts:11-35` accepts any frozen result whose caller-controlled `canonicalResultType` prototype has a verifier returning `true`; the `_producer` parameter is ignored. | `CONTRADICTORY`; see `BEH-CRITICAL-001`. |
| Repeatability/no external effect | The operation only returns frozen values/failures and updates private validator caches. Three equivalent calls returned `VALID` without changing input or creating external state. | `IMPLEMENTED_CORRECTLY` |

## Acceptance witness audit

The authoritative matrix has two local rows. Both rows were directly exercised
through `ValidateExecContract.validate` and the composition root, not by
registration/listing or a sequential proxy.

| Normative behavior | Concrete operation | Direct positive witness | Direct negative/isolation witness | Executable at local closure | Result |
|---|---|---|---|---|---|
| Capability-specific payload schema selection | `C-EXEC-001 / AC-EXEC-001` through `ValidateExecContract.validate` | `accepts a valid identifiable envelope and capability payload as structured values` (test lines 89-97); exact selected schema values are asserted. | `selects an identifiable capability schema and rejects generic or unknown payloads` (lines 99-132) rejects unrelated data, unknown capability and old generic schema identity with `CONTRACT_INVALID`. | YES | Direct witness present. |
| Structured envelope minimum and text non-authority | `C-EXEC-002 / AC-EXEC-002` through `ValidateExecContract.validate` | Complete structured input is accepted by the positive test above. | `rejects text-only and malformed input...` (lines 677-693), `rejects missing structured fields...` (lines 695-711), and partial-pair test (lines 713-722) assert `CONTRACT_INVALID`, no-success and no-effect flags. | YES | Direct witness present. |

```text
REQUIRED_BEHAVIORS_TOTAL = 2
DIRECT_BEHAVIOR_WITNESSES = 2
PROXY_ONLY_BEHAVIORS = 0
UNTESTED_STATE_TRANSITIONS = 0
UNPROVEN_CONCURRENCY_CONTRACTS = 0
MISSING_ARCHITECTURE_GUARDS = 1
```

The missing architecture/provenance guard is not a missing acceptance-row
operation; it is the specific forged-result negative witness described below.
The existing acceptance rows remain directly witnessed.

## Required test inventory

| Test category | Classification | Evidence |
|---|---|---|
| `UNIT` | `REQUIRED_TEST_PRESENT` | 23 ticket-specific tests exercise the production application, domain values and adapter. |
| `INVARIANT` | `REQUIRED_TEST_PRESENT` | Required fields, schema identity, immutable values, JSON shape and complete-pair assertions are direct. |
| `INTEGRATION` | `REQUIRED_TEST_PRESENT` | Composition-root validation and the generic delegation consumer regression execute the productive boundary; no foreign integrated capability is claimed. |
| `STALE` | `REQUIRED_TEST_PRESENT` | Genuine stale envelope/payload receipts, changed current fields and inherited-field cases are exercised at test lines 485-560. |
| `IDEMPOTENCY` | `TEST_CATEGORY_NOT_APPLICABLE` | No external effect or durable command exists; an audit repeat probe still verified equivalent calls and no input mutation. |
| `COMPATIBILITY` | `REQUIRED_TEST_PRESENT` | The old generic schema identity is directly rejected and the target regression suite passes. |
| `ARCHITECTURE_GUARD` | `REQUIRED_TEST_MISSING` | Import-graph, custom-definition, copied-result and plain always-true guards exist, but no test rejects a frozen result using a caller-created verifier class. |
| `CONFORMANCE` | `REQUIRED_TEST_PRESENT` | Direct AC witnesses and repository conformance/consistency guards pass. |
| `PERSISTENCE` | `TEST_CATEGORY_NOT_APPLICABLE` | No persistence behavior. |
| `CONCURRENCY` | `TEST_CATEGORY_NOT_APPLICABLE` | No concurrency contract. |
| `RECOVERY` | `TEST_CATEGORY_NOT_APPLICABLE` | No recovery behavior. |
| `MIGRATION` | `TEST_CATEGORY_NOT_APPLICABLE` | No durable migration. |
| `NEGATIVE_PATH` | `REQUIRED_TEST_PRESENT` | Invalid payload, text-only, missing fields, malformed/throwing adapter, stale and ordinary forgery paths are exercised; the specific forged-verifier path remains missing. |

## Assertion-quality assessment

- **STRONG:** Valid/invalid status, selected schema identity, `CONTRACT_INVALID`,
  no-approval/checkpoint/effect flags, absence of partial `value`, immutable
  returned values, malformed/throwing adapter normalization and stale receipt
  rejection are asserted semantically.
- **SUFFICIENT:** Frozen schema documents, old-schema rejection and the
  productive import graph are checked directly.
- **WEAK/MISLEADING for provenance:** The tests at lines 272-329 reject a
  caller-created subtype that returns a plain result, and lines 365-483 reject
  copied/plain results, but they do not test the exact structural predicate in
  `isProducerIssuedValidationResult`. A caller-created class with the expected
  method is accepted, so the apparent private-brand guard is not an
  unforgeable authority witness.
- **NON_ASSERTIVE:** None of the ticket-specific tests rely only on status 200,
  non-null construction, absence of exceptions, or a test name.

## Independent test execution

Commands were executed against the pinned implementation paths without changing
production code, tests, Git state, or ticket state.

| Command/suite | Result |
|---|---|
| `node --experimental-strip-types --test tests/exec-001-ticket-001.test.ts` | PASS, 23/23 |
| `node --experimental-strip-types --test tests/exec-001-ticket-002.test.ts` | PASS, 25/25 |
| `node --experimental-strip-types --test .pi/extensions/workflow-orchestrator/test/*.test.ts` | PASS, 33/33 |
| `npm test` | PASS, 81/81 total |
| `npm run typecheck` | PASS |
| `npm run verify:audit-governance` | PASS |
| `npm run verify:skill-mirror` | PASS |
| `npm run verify:canonical-consistency` | PASS |

Additional read-only audit probes:

- Generic invalid payload, missing field and text-only inputs each returned
  `INVALID/CONTRACT_INVALID`, all three no-success/no-effect flags, and left the
  input object unchanged.
- Three equivalent valid calls returned `VALID` and left the input unchanged.
- A forged frozen result with five expected enumerable fields, exact canonical
  reference/input/fingerprint, and a caller-defined `isCanonicalValidationResult`
  verifier was accepted. `new ValidateExecContract(fakePort).validate(validInput())`
  returned `VALID`; direct `StructuredExecutionEnvelope.create` also accepted the
  same forged result without a producer. This is the negative witness failure in
  `BEH-CRITICAL-001`.

```text
TESTS_RUN = 81 repository test cases plus read-only audit probes
TESTS_PASSED = 81 repository test cases
TESTS_FAILED = 0
TESTS_SKIPPED = 0
ENVIRONMENTAL_FAILURES = 0
```

## Failure and negative-path audit

| Case | Expected | Observed |
|---|---|---|
| Valid envelope and selected capability payload | Complete immutable `VALID` pair | Correct `VALID` pair with canonical refs. |
| Generic-but-capability-invalid `data` | `CONTRACT_INVALID`, no effect | Correct rejection and no-effect flag. |
| Unknown capability or old generic schema identity | `CONTRACT_INVALID`, no fallback | Selection fails closed before consumption. |
| Missing structured field or text-only input | `CONTRACT_INVALID`; text cannot fill fields | Correct rejection, no approval/checkpoint/effect. |
| Malformed/throwing validator output | Structured `CONTRACT_INVALID` | Correct normalization and safe thrown-message handling. |
| Input mutation after genuine receipt | Stale rejection and no value | Correct rejection for changed values, missing own fields and inherited substitution. |
| Plain/copy/subtype forged validation result | Reject as untrusted | Correct rejection for tested plain/copy/subtype cases. |
| Caller-defined verifier-shaped result | Reject as untrusted | **Incorrect: accepted as `VALID`**; see `BEH-CRITICAL-001`. |
| Persistence failure, partial durable execution, restart/recovery | Not applicable | No persistence/effect/recovery path exists. |

## Conditional dimensions

### Concurrency

`NOT_APPLICABLE`. The operation has no aggregate, mutable revision, shared
catalog, publication command, or external effect. No concurrency contract is
silently inferred from sequential validation.

### Stale state and mutation

`CONFORMANT` for the canonical adapter. The receipt is tied to the exact input
object, canonical schema reference, content fingerprint and current schema
check. Mutation and inherited-property probes fail closed. This does not cure
the independent issuer-verifier forgery defect.

### Idempotency

`CONFORMANT` for the applicable side-effect-free operation. Repeating the same
input produces equivalent valid results, does not mutate the input and does not
publish a second business effect. Durable command idempotency is not applicable.

### Durability/persistence

`NOT_APPLICABLE`. No durable identity, transaction, repository, CAS, journal,
manifest or completion-before-persistence claim is made.

### Recovery

`NOT_APPLICABLE`. Restart, replay, retry-after-partial-failure and physical
recovery belong to later units and have no implementation path here.

### Compatibility/cutover

`CONFORMANT` for the authorized scope. The baseline generic payload path is
replaced by an exact capability/schema identity; old `exec-capability-payload`
input is rejected rather than silently converted. Related ticket-002 and
workflow regression tests pass.

### Authority consumption and caller-as-authority check

The local schema authority is defined and locally testable. The approved
cross-boundary record remains `CONTRACT_TESTABLE_LOCALLY` with no foreign
productive producer claim. The application correctly rejects plain caller
results and caller-selected schema documents, but the verifier predicate lets a
caller supply an authority-shaped frozen result. Therefore:

```text
CALLER_AS_AUTHORITY_CHECK = FAIL for the forged-result path
CALLER_SUPPLIED_AUTHORITY_BYPASS = 1
PROOF_ISSUER_OWNER = not independently enforced by the consumer
CONSUMER_VERIFIES_PROVENANCE = PARTIAL
INPUT_OR_REFERENCE_BINDING = YES for the forged probe (which is why it passes)
MUTATION_OR_STALE_REJECTION = YES for canonical receipts
FORGERY_PATH_REJECTED = NO
CALLER_INJECTION_REJECTED = NO for the forged verifier-shaped result
ALTERNATE_ADAPTER_CONTRACT = PARTIAL
```

This is an implementation provenance defect, not an upstream authority gap or a
foreign capability availability blocker.

## Regression result

```text
REGRESSION_RESULT = NO_REGRESSION
REGRESSIONS = 0
```

The baseline-to-target diff is limited to the approved capability-specific
schema cutover, validation-evidence boundary hardening, application selection,
domain semantic checks, adapter evidence issuance, direct tests and evidence
records. The old generic schema acceptance change is intentional `NEW_CANONICAL_PATH`
behavior covered by a direct rejection assertion. The related ticket-002 suite,
workflow suite, typecheck and repository guards pass. The provenance defect is
present in the target implementation itself and is reported as a current
behavior finding, not misclassified as a regression.

## Root-cause campaign

```text
ROOT_CAUSE_CAMPAIGN_ID = RCC-EXEC-SCHEMA-PROVENANCE-001
ROOT_CAUSE_ID = caller-forgeable schema-validation evidence verifier
CAMPAIGN_STATUS = OPEN
CAMPAIGN_SCOPE = EXEC-001-TICKET-001 validation authority and local consumer boundary
CANONICAL_FINDINGS = BEH-CRITICAL-001
```

The required surface matrix is:

| Surface row | Surface class | Location | Current behavior | Expected behavior | Coverage | Negative witness IDs |
|---|---|---|---|---|---|---|
| RCC-001 | ISSUER | `src/infrastructure/exec-schema-validator.ts:34-79` | Canonical result has a private field, but exposes its result-type constructor through a non-enumerable property. | Issuer identity and result brand must be unforgeable and owner-bound. | MISSING | `NW-BEH-001` |
| RCC-002 | REGISTRAR | `src/domain/exec-schema.ts:146-170,195-205` | Frozen ticket-owned definitions and exact selection are present; caller documents are rejected by the adapter. | Only immutable owner definitions may be selected. | COVERED | `NW-BEH-005` |
| RCC-003 | CONSUMER | `src/application/exec-contract.ts:22-58,101-137`; `src/domain/exec-contract.ts:391-415` | Consumer accepts any result satisfying the caller-controlled verifier shape. | Consumer must verify the canonical issuer, exact scope and result receipt. | MISSING | `NW-BEH-001` |
| RCC-004 | ALTERNATE_AUTHORITY_PATH | Injected `ExecSchemaValidationPort` and caller-defined verifier class | A caller can provide a port returning a verifier-shaped frozen result and obtain `VALID`. | Alternate adapters must be owner-authorized or unable to mint consumable proof. | MISSING | `NW-BEH-001` |
| RCC-005 | INJECTION_POINT | `src/application/exec-contract.ts:79-85` | Any runtime port object is stored; only result shape is checked later. | Injection must be constrained to a canonical/authorized producer boundary. | MISSING | `NW-BEH-001` |
| RCC-006 | MUTATION_PATH | `src/infrastructure/exec-schema-validator.ts:105-145` | Canonical receipts recheck current schema input and own fields. | Preserve current-content validation for every consumable producer. | COVERED for canonical issuer | `NW-BEH-004` |
| RCC-007 | STALE_PATH | `tests/exec-001-ticket-001.test.ts:485-560` | Genuine stale receipts fail closed; alternate producer proof is not independently bound. | Every consumable proof path must reject stale/mutated evidence. | PARTIAL | `NW-BEH-004`, `NW-BEH-001` |
| RCC-008 | PORT_SUBSTITUTION_PATH | `src/domain/exec-schema.ts:35-36` | Narrow port is substitutable, but the consumer cannot prove alternate issuer authorization. | Port substitution must preserve the same issuer/provenance contract. | MISSING | `NW-BEH-001` |
| RCC-009 | PUBLIC_EXPORT | `src/domain/exec-validation-evidence-internal.ts:11-35`; exported `JsonSchemaExecValidator` and result type | The verifier helper is exported from a directly importable module and accepts structural caller predicates. | Public boundary must not expose a caller-mintable authority protocol. | MISSING | `NW-BEH-001` |
| RCC-010 | PERSISTENCE | None in this ticket | No persistence path exists. | No storage adapter may mint schema proof. | NOT_APPLICABLE — no durable material | None |
| RCC-011 | RETRY_RECOVERY | None in this ticket | No retry/recovery operation exists. | Later retry/recovery must preserve owner-issued proof. | NOT_APPLICABLE — later owner/checkpoint | None |
| RCC-012 | LEGACY_ROUTE | `src/domain/exec-schema.ts:128-170`; ticket tests lines 125-131 | Old generic payload identity is rejected; no fallback conversion exists. | Generic path must not remain an authority route. | COVERED | `NW-BEH-006` |
| RCC-013 | ARCHITECTURE_GUARD | `tests/exec-001-ticket-001.test.ts:365-483,835-886` | Existing guards cover plain/copy/custom-definition/import paths, not caller-defined verifier classes. | Direct forged-issuer and alternate-adapter negative witness must fail. | MISSING | `NW-BEH-001` |
| RCC-014 | TEST | `tests/exec-001-ticket-001.test.ts:239-329,365-483` | Green tests cover near misses but not the exact structural forgery. | Systemic negative witness must be executable and assert `CONTRACT_INVALID`. | MISSING | `NW-BEH-001` |

```text
CAMPAIGN_MATRIX_COMPLETE = YES
ALL_SURFACE_ROWS_COVERED = NO
ALL_NEGATIVE_WITNESSES_PASS = NO
NO_UNEXPLAINED_PUBLIC_AUTHORITY_PATH = NO
NO_HIDDEN_CONCRETE_PROTOCOL = NO
ROOT_CAUSE_REMOVED = NO
KNOWN_MANIFESTATIONS_CLOSED = NO
SYSTEMIC_TEST_EVIDENCE = PRESENT (green suite plus independent exploit probe)
```

## Findings

### BEH-CRITICAL-001 — Caller-supplied validation proof can be forged

```text
FINDING_STATUS = OPEN
FINDING_CATEGORY = CALLER_SUPPLIED_AUTHORITY_BYPASS
SEVERITY = CRITICAL
TICKET = EXEC-001-TICKET-001
REQUIREMENT_REFERENCES = EXEC-ENVELOPE-001; EXEC-ENVELOPE-002
ACCEPTANCE_REFERENCES = AC-EXEC-001; ticket provenance/architecture required tests
CAPABILITY = EXEC-SCHEMA-CAPABILITY-PAYLOAD
DEPENDENCY_CLASS = INFORMATIONAL
LOCAL_ACCEPTANCE_REQUIRES_PRODUCTIVE_CAPABILITY = NO
LOCAL_CLOSURE_BLOCKING = YES
CLOSURE_OWNERSHIP = LOCAL_TICKET
EVIDENCE_TIMING = LOCAL_CLOSURE
DEPENDENCY_CLASS_RECLASSIFICATION_REQUIRED = NO
UPSTREAM_DEPENDENCY_CLASSIFICATION_PRESERVED = YES
PRIMARY_ROUTE = IMPLEMENTATION_REMEDIATION
DOWNSTREAM_CHECKPOINT = EXEC-001-TICKET-001 local closure and later integrated schema conformance
DOWNSTREAM_OWNER = EXEC-001 / EXEC-IMP-01
SUGGESTED_BLOCKS_LOCAL_EXECUTION = YES
SUGGESTED_BLOCKS_LOCAL_CLOSURE = YES
SUGGESTED_BLOCKS_TICKET_DONE = YES
SUGGESTED_BLOCKS_INTEGRATED_PROOF = YES
SUGGESTED_BLOCKS_SPEC_FINAL_CONFORMANCE = YES
```

- **Required behavior:** Only an owner-issued, independently authenticated
  schema-validation result for the exact canonical schema and exact current
  input may permit construction of a consumable validated envelope/payload.
  Caller-injected or forged authority must return `CONTRACT_INVALID` with no
  validated value.
- **Production evidence:**
  `src/domain/exec-validation-evidence-internal.ts:11-35` ignores its
  `_producer` argument and treats a frozen object as producer-issued when its
  caller-controlled `canonicalResultType` points to a class whose
  `isCanonicalValidationResult` method returns `true`. The consumer calls this
  helper at `src/application/exec-contract.ts:47-58` and
  `src/domain/exec-contract.ts:391-415` before constructing values.
  `src/infrastructure/exec-schema-validator.ts:34-66` exposes the canonical
  result-type constructor on every result, which makes the structural protocol
  observable rather than a module-private issuer check.
- **Test evidence:** Existing tests reject plain forged results, copied results,
  custom documents and a caller-created always-true subtype
  (`tests/exec-001-ticket-001.test.ts:239-329,365-483`). They do not reject a
  frozen result with a caller-created verifier class. The independent
  read-only probe created exactly that result with the canonical reference,
  exact input identity and matching fingerprint. `ValidateExecContract` returned
  `VALID`, and direct `StructuredExecutionEnvelope.create` accepted it without
  a producer. This is `NW-BEH-001` and is a failed negative witness.
- **Observed result:** The caller can inject a result-shaped object that passes
  the apparent issuer proof and obtains a `ValidatedExecContract`/validated
  envelope. The current domain's duplicated field checks still reject ordinary
  malformed values, but the authority-bearing evidence boundary itself is
  forged successfully.
- **Expected result:** The same probe must be rejected as untrusted and produce
  `CONTRACT_INVALID`; no `VALID` result or validated value may be constructed.
- **Problem:** The consumer verifies a caller-controlled nominal/structural
  protocol instead of a module-private issuer brand bound to the authorized
  producer. This violates `CALLER_AS_AUTHORITY_CHECK`,
  `FORGERY_PATH_REJECTED`, and the required authority-provenance contract.
- **Impact:** Any caller or alternate adapter able to reach this port can mint
  accepted schema proof. A downstream consumer that trusts the validated
  contract can treat caller-supplied data as canonical contract authority; a
  later schema constraint or consumer path could therefore commit an effect
  from forged proof. The local operation has no effect of its own, but the
  returned success is precisely the authority-bearing handoff the ticket must
  protect.
- **Minimum correction required:** Replace the caller-controlled
  `canonicalResultType`/prototype test with a module-private, unforgeable
  result brand/WeakSet or equivalent owner-bound receipt, and bind acceptance
  to the authorized producer rather than ignoring `_producer`. Add a direct
  executable negative test for a caller-defined verifier class and an
  alternate-adapter substitution, asserting `CONTRACT_INVALID`, no partial
  value and no approval/checkpoint/effect signals. Preserve the existing exact
  schema/reference/input/fingerprint and stale checks.
- **Systemic pattern:** `YES` — issuer, consumer, injection, port
  substitution, public export and architecture-test surfaces share the same
  forgeable authority protocol.
- **Related locations:** `src/domain/exec-validation-evidence-internal.ts:11-35`; `src/application/exec-contract.ts:22-58,79-140`; `src/domain/exec-contract.ts:391-415,480-562`; `src/infrastructure/exec-schema-validator.ts:34-79,117-155`; `tests/exec-001-ticket-001.test.ts:239-329,365-483`.

This finding is local-closure blocking because the ticket's required
provenance/architecture witness is false even though the ordinary semantic
suite is green. It is not a request to reclassify the informational capability
or to promote a foreign productive dependency; the upstream dependency class is
preserved and the correction belongs to the implementation authority boundary.

## Specialist summary

Audit: `.pi/runtime/workflow-audits/7d0e508c-41b3-49c7-96ee-0062bab17b1a/behavior-EXEC-001-TICKET-001-behavior-audit.md`

Specialist:
IMPLEMENTATION_BEHAVIOR

Ticket: EXEC-001-TICKET-001

Required behavioral dimensions: 6

Required tests: 8

Required tests missing: 1

Required behaviors total: 2

Direct behavior witnesses: 2

Proxy-only behaviors: 0

Untested state transitions: 0

Unproven concurrency contracts: 0

Missing architecture guards: 1

Tests run: 81

Tests passed: 81

Tests failed: 0

Regressions: 0

Concurrency:
NOT_APPLICABLE

Stale behavior:
CONFORMANT

Idempotency:
CONFORMANT

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

AUDIT_TARGET_HEAD: 543033de8484c9104c28fa60d5228027d170c103
AUDIT_TARGET_STATE_FINGERPRINT: 48adbeb1d4917fabba5cde69f45f28f189f99f86b19098434fabcadc9c042350
AUDIT_WAVE_ID: 7d0e508c-41b3-49c7-96ee-0062bab17b1a
DOMAIN_AUDIT_COMPLETE: YES
SPECIALIST_RESULT: SPECIALIST_BEHAVIOR_FINDINGS