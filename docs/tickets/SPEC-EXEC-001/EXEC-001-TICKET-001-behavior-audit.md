# EXEC-001-TICKET-001 — Implementation behavior audit

## Audit inputs and target

| Field | Value |
|---|---|
| `TICKET_ID` | `EXEC-001-TICKET-001` |
| `TICKET_PATH` | `docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-001-envelope-schema-contract.md` |
| `IMPLEMENTATION_UNIT` | `EXEC-IMP-01 — Envelope and schema contract` |
| `REQUIREMENT_IDS` | `EXEC-ENVELOPE-001`, `EXEC-ENVELOPE-002`; affected fail-closed boundary `EXEC-CONTRACT-001` |
| `ACCEPTANCE_IDS` | `AC-EXEC-001`, `AC-EXEC-002` |
| `SPEC_PATH` | `docs/specs/SPEC-EXEC-001-skill-contracts-and-capability-registry.md` (revision 3) |
| `GAP_MATRIX_PATH` | `docs/specs/gap-matrices/SPEC-EXEC-001-implementation-gap-matrix.md` (`GAP-001`) |
| `IMPLEMENTATION_PLAN_PATH` | `docs/specs/implementation-plans/SPEC-EXEC-001-implementation-plan.md` (`EXEC-IMP-01`) |
| `IMPLEMENTATION_BASELINE` | `381218d5fbf8d969ee5ae5349b8f65c4cd5af7f9` |
| `CURRENT_HEAD` | `e83bc09150f9b0d7b7f4c26434926578723fef1a` |
| `AUDIT_TARGET_HEAD` | `e83bc09150f9b0d7b7f4c26434926578723fef1a` |
| `AUDIT_TARGET_STATE_FINGERPRINT` | `7f68eea870da956f4d8552cb155a9cc5bcfb38c048fe2f494f12f2fbdfbbba79` |
| `CHANGED_PRODUCTION_FILES` | `src/application/exec-contract.ts`; `src/composition/exec-contract.ts`; `src/domain/exec-contract.ts`; `src/domain/exec-schema.ts`; `src/domain/exec-validation-evidence-internal.ts`; `src/infrastructure/exec-schema-validator.ts` |
| `CHANGED_TEST_FILES` | `tests/exec-001-ticket-001.test.ts` |
| `RELEVANT_TEST_SUITES` | Ticket-specific EXEC test; generic delegation consumer regression; strict touched-source typecheck; package typecheck |

The target commit is the current HEAD. The working tree was documentation-dirty only; no production or test semantic overlay changed during this audit. The behavior was reconstructed independently from `ADR-0003` (accepted, revision 3) → portfolio obligation `O-016` → `SPEC-EXEC-001` requirements → validated `GAP-001` → `EXEC-IMP-01` → ticket/design → repository implementation → executable tests. The ticket's `ACP-EXEC-01` and `PCP-EXEC-01` are preserved as `AUTHORITY_STATUS=DEFINED`, `CONTRACT_STATUS=DEFINED`, `LOCAL_TESTABILITY=YES`, `PRODUCTIVE_AVAILABILITY=NO`, `DEPENDENCY_CLASS=INFORMATIONAL`; the local harness is not promoted to a productive foreign producer. `TEMPORAL_AUTHORITY_PROOF` is `NOT_APPLICABLE` because this operation observes no mutable external authority before committing an effect.

## Reconstructed behavioral contract

1. A complete envelope and capability payload are accepted only after validation against the two identifiable, ticket-owned schemas.
2. The common envelope carries all required structured execution/result fields; omitted fields cannot be supplied by human text.
3. Invalid, incomplete, text-only, or schema-incompatible input returns `CONTRACT_INVALID` and cannot imply approval, checkpoint confirmation, or effect.
4. Successful consumption returns an immutable structured pair with the canonical schema references.

## Behavioral applicability matrix

| Dimension | Classification | Reason / inspection result |
|---|---|---|
| `UNIT_BEHAVIOR` | `REQUIRED` | Core schema validation, structured values, and failure result are ticket-owned. |
| `INTEGRATION_BEHAVIOR` | `AFFECTED` | The existing generic delegation consumer must not promote text-only output; the ticket contributes the structured boundary but not downstream mapping. |
| `PERSISTENCE` | `NOT_APPLICABLE` | No durable record, repository, serialization, or rehydration exists in this unit. |
| `CONCURRENCY` | `NOT_APPLICABLE` | No mutable shared state, command, reservation, or concurrent mutation is owned here. |
| `STALE_STATE` | `NOT_APPLICABLE` | No revision/CAS/predecessor state is observed or mutated. |
| `IDEMPOTENCY` | `NOT_APPLICABLE` | Validation has no business effect or durable command; effect idempotency is outside this unit. |
| `DURABILITY` | `NOT_APPLICABLE` | No completion or dependent observation is reported from durable state. |
| `RECOVERY` | `NOT_APPLICABLE` | No interrupted operation, replay, retry identity, or restart behavior is implemented. |
| `COMPATIBILITY` | `AFFECTED` | This is a `NEW_CANONICAL_PATH`; prototype, historical, and text formats must not become alternate authority. |
| `MIGRATION_BEHAVIOR` | `NOT_APPLICABLE` | No migration or cutover conversion is implemented. |
| `NEGATIVE_PATHS` | `REQUIRED` | Invalid schema, missing fields, text-only input, malformed adapter output, and failure/no-effect semantics are normative. |

## Production semantics and classifications

| Required behavior | Production evidence | Classification |
|---|---|---|
| Both identifiable schemas validate before consumption | `src/domain/exec-schema.ts:80-131` defines frozen `$id`/`$schema` documents and required fields; `src/infrastructure/exec-schema-validator.ts:53-82` compiles only canonical definitions and issues evidence; `src/application/exec-contract.ts:98-125` invokes both validators before constructing the pair. A caller-importable evidence issuer permits bypassing that path (finding below). | `PARTIAL` |
| Minimum structured envelope fields are required and text is non-authoritative | `src/domain/exec-contract.ts:326-383` requires schema identity, contract version, opaque IDs, status/verdict and all six structured arrays; `humanText` is not read by the application. On the canonical adapter path this is correct, but forged internal evidence can bypass the adapter's own-enumerable required-field check. | `PARTIAL` |
| Valid input is consumed as an immutable structured pair | `StructuredExecutionEnvelope`, `StructuredCapabilityPayload`, and `ValidatedExecContract` are branded/frozen (`src/domain/exec-contract.ts:346-386`, `425-457`); focused tests observe schema references and structured fields. The same result can be reached with forged evidence from the internal module. | `PARTIAL` |
| Invalid input fails closed without approval, checkpoint, effect, or partial pair | `src/application/exec-contract.ts:105-128` returns `CONTRACT_INVALID` for invalid/malformed/throwing validation paths; `ContractInvalidFailure` sets `noApproval`, `noCheckpoint`, and `noEffect` (`src/domain/exec-contract.ts:459-482`). The authority-bypass probe can instead produce `VALID` for an input the canonical adapter would reject. | `UNSAFE_FAILURE_BEHAVIOR` |

### Acceptance witness audit

The ticket/design witness matrix has four normative rows. The repository tests execute the production composition boundary for positive structured consumption, missing/text-only rejection, one-side invalid isolation, and no-success/no-effect failure assertions. Thus `REQUIRED_BEHAVIORS_TOTAL=4` and `DIRECT_BEHAVIOR_WITNESSES=4`; none is proxy-only. There are no lifecycle state transitions and no concurrency contract in scope. The architecture/import guard is real for forbidden dependency paths, but it does not guard the caller-reachable evidence issuer; therefore `MISSING_ARCHITECTURE_GUARDS=1`.

Every ticket witness is executable at local closure for the contract-level behavior. No fixture is being used to claim persistence, restart/recovery, physical CAS, foreign integration, productive availability, or external effects.

## Authority-consumption and caller-authority audit

- `UNIT-EXEC-SCHEMA-HARNESS`: `AUTHORITY_STATUS=DEFINED`; `CONTRACT_STATUS=DEFINED`; `LOCAL_TESTABILITY=YES`; `PRODUCTIVE_AVAILABILITY=NO`; summary `CONTRACT_TESTABLE_LOCALLY`; `DEPENDENCY_CLASS=INFORMATIONAL`; local closure is not blocked by productive foreign availability. The local canonical adapter does execute the ticket-owned schema contract, but the declared harness record is not a productive external producer.
- `AUTHORITY_CONSUMPTION_PROOF`: `DEFINED_BUT_NOT_CONSUMABLE` for the declared capability record, not `CONSUMABLE`, because productive availability is explicitly `NO`. This is not an availability defect for this ticket's local closure.
- `PRODUCER_CONSUMER_CONTRACT_PROOF`: `PCP-EXEC-01`; ticket-owned schema definitions/adapter produce the structured validation result consumed by `ValidateExecContract` and later EXEC consumers. The dependency class remains `INFORMATIONAL`.
- `CALLER_AS_AUTHORITY_CHECK`: failed. A caller can import `src/domain/exec-validation-evidence-internal.ts` and call its exported `recordCanonicalValidationEvidence` with a fake `{ hasValidated: () => true }` receipt. This manufactures the opaque evidence accepted by `isSchemaValidationEvidence`, so caller-supplied evidence becomes canonical validation authority.
- `CALLER_SUPPLIED_AUTHORITY_BYPASS=1`.
- No temporal revalidation or external authority effect applies; `TEMPORAL_AUTHORITY=NOT_APPLICABLE`.

## Findings

### BEH-CRITICAL-001 — Caller-mintable schema-validation authority bypass

- **Severity:** `CRITICAL`
- **Ticket:** `EXEC-001-TICKET-001`
- **Requirement references:** `EXEC-ENVELOPE-001`, `EXEC-ENVELOPE-002`, affected `EXEC-CONTRACT-001`
- **Acceptance references:** `AC-EXEC-001`, `AC-EXEC-002`
- **Finding category:** `CALLER_SUPPLIED_AUTHORITY_BYPASS`
- **Capability:** `UNIT-EXEC-SCHEMA-HARNESS`
- **Dependency class:** `INFORMATIONAL`
- **Local-acceptance dependency:** No productive capability is required; the local acceptance directly requires genuine schema-validation authority. `LOCAL_ACCEPTANCE_REQUIRES_PRODUCTIVE_CAPABILITY=NO`.
- **Evidence timing:** local ticket closure; the direct validation/no-effect witness must be valid before closure.
- **Required behavior:** only a successful execution of the canonical schema adapter for the exact input/reference pair may establish evidence that permits structured contract consumption.
- **Production evidence:** `src/domain/exec-validation-evidence-internal.ts:11-27` exposes `SchemaValidationAdapterReceipt` and exports `recordCanonicalValidationEvidence`. Its only authority check is caller-supplied `adapter.hasValidated(...)`; a caller can provide an object whose method returns `true`. `src/domain/exec-contract.ts:309-323` accepts any evidence object present in the module WeakSet, and `src/application/exec-contract.ts:98-125` trusts the returned evidence when constructing both values. The intended adapter path is otherwise sound at `src/infrastructure/exec-schema-validator.ts:53-82`.
- **Test evidence:** the focused suite passes 20/20, including forged structural evidence rejection at `tests/exec-001-ticket-001.test.ts:264-321`, but that test never imports/calls the current `recordCanonicalValidationEvidence` export. The export guard at `:239-261` checks absence of `issueSchemaValidationEvidence` and `registerSchemaValidationAdapter`, not the current issuer. Independent adversarial execution directly imported the issuer, used `hasValidated: () => true`, and returned `VALID` without running the JSON Schema engine. A second probe omitted `executionId` as an own property, supplied it only through `Object.prototype`, and received `VALID` with `executionId='inherited'`; the canonical adapter rejects the same input.
- **Observed result:** a caller-reachable fake receipt mints WeakSet-accepted evidence and allows a custom validation port to produce a `VALID` `ValidatedExecContract`; schema-invalid/inherited input can be consumed as canonical structured data.
- **Expected result:** evidence issuance must be unforgeable to callers and must attest to the actual canonical schema-engine check of the exact input/reference pair. The same adversarial calls must return `CONTRACT_INVALID`, with no validated pair or effect signals.
- **Problem:** the internal module's export surface contradicts its “callers cannot issue evidence” comment. Structural forged evidence is rejected, but the current issuer is callable and delegates authority to an untrusted receipt implementation.
- **Impact:** a consumer can receive a successful contract without JSON Schema validation, defeating the central `EXEC-ENVELOPE-001` boundary and potentially allowing malformed or inherited fields to reach downstream approval/checkpoint/effect consumers. This is a fundamental authority bypass.
- **Minimum correction required:** remove caller access to the evidence issuer and ensure only the canonical adapter-controlled mechanism can mint accepted evidence; add a direct negative witness for importing/current-issuer forgery and for own-enumerability bypass. Preserve the ticket's no-text/no-effect and canonical-schema semantics.
- **Systemic pattern:** `NO`; the observed defect is localized to the evidence issuance seam. No second analogous ticket path was found in the inspected production import graph.
- **Related locations:** `src/domain/exec-validation-evidence-internal.ts:11-41`; `src/infrastructure/exec-schema-validator.ts:37-82`; `src/domain/exec-contract.ts:309-324,346-386,389-423`; `src/application/exec-contract.ts:93-128`; `tests/exec-001-ticket-001.test.ts:239-321,594-645`; evidence files `AC-EXEC-001-envelope-schema.md`, `AC-EXEC-001-structured-consumption.md`, `AC-EXEC-002-fail-closed.md` claim the issuer is not caller-facing but do not test the current export.

Finding completion fields for canonical consolidation:

```text
FINDING_STATUS = OPEN
FINDING_CATEGORY = CALLER_SUPPLIED_AUTHORITY_BYPASS
CAPABILITY = UNIT-EXEC-SCHEMA-HARNESS
DEPENDENCY_CLASS = INFORMATIONAL
LOCAL_CLOSURE_BLOCKING = YES
LOCAL_ACCEPTANCE_REQUIRES_PRODUCTIVE_CAPABILITY = NO
CLOSURE_OWNERSHIP = LOCAL_TICKET
DEPENDENCY_CLASS_RECLASSIFICATION_REQUIRED = NO
UPSTREAM_DEPENDENCY_CLASSIFICATION_PRESERVED = YES
BLOCKS_LOCAL_EXECUTION = YES
BLOCKS_LOCAL_CLOSURE = YES
BLOCKS_TICKET_DONE = YES
BLOCKS_INTEGRATED_PROOF = YES
BLOCKS_SPEC_FINAL_CONFORMANCE = YES
PRIMARY_ROUTE = IMPLEMENTATION_REMEDIATION
DOWNSTREAM_CHECKPOINT = EXEC-001-TICKET-001 local closure and downstream EXEC contract conformance
DOWNSTREAM_OWNER = EXEC-001-TICKET-001 / canonical EXEC-001 consolidator
```

The local/integrated effect is a local ticket blocker because the acceptance-owned schema-validation witness is not safe against caller authority injection; it also remains an integrated-proof blocker because downstream consumers rely on this contract. No dependency-class reclassification is proposed, and the upstream `INFORMATIONAL` classification is preserved.

## Test inventory and assertion quality

| Category | Classification | Evidence quality / reason |
|---|---|---|
| `UNIT` | `REQUIRED_TEST_PRESENT` | Direct 20-test ticket suite invokes the production boundary. |
| `INVARIANT` | `REQUIRED_TEST_PRESENT` | Required fields, canonical schema identity, immutability, own-enumerability, JSON-only values and constructor guards are asserted. |
| `NEGATIVE_PATH` | `REQUIRED_TEST_PRESENT` | Text-only, missing, malformed, one-side-invalid, non-JSON, malformed adapter, thrown adapter, forged structural evidence and no-effect paths assert canonical failure. |
| `ARCHITECTURE_GUARD` | `REQUIRED_TEST_PRESENT` (incomplete) | Import graph guard is executable, but no guard covers the exported current evidence issuer; this is the finding's missing guard. |
| `CONFORMANCE` | `REQUIRED_TEST_PRESENT` | Generic delegation regression rejects text-only output as incomplete canonical result. |
| `INTEGRATION` | `TEST_CATEGORY_NOT_APPLICABLE` | No foreign productive capability or downstream mapping is required for local closure; the generic consumer regression is covered as conformance. |
| `PERSISTENCE`, `CONCURRENCY`, `STALE`, `IDEMPOTENCY`, `RECOVERY`, `MIGRATION` | `TEST_CATEGORY_NOT_APPLICABLE` | No corresponding state, durable boundary, retry/replay, CAS, migration, or concurrent mutation is owned or materially affected. |
| `CROSS_SPEC` | `TEST_CATEGORY_NOT_APPLICABLE` | Downstream consumers are integrated-proof contributors only; no foreign contract is required locally. |
| `COMPATIBILITY` | `TEST_CATEGORY_NOT_APPLICABLE` for separate compatibility testing | The new canonical path has no legacy EXEC reader/migration; non-authoritative text/prototype rejection is directly covered by negative/conformance tests. |

Assertions on direct behavior are `STRONG`: tests assert result discriminants, canonical code, absence of `value`, expected references, no-approval/no-checkpoint/no-effect flags, structured fields, immutability, and consumer stop codes. The architecture guard is `WEAK` for the current issuer because it tests former export names and forbidden imports rather than the actual caller-reachable issuer. The completion evidence is therefore `MISLEADING` on that specific claim, despite the normal-path assertions being strong.

## Test execution record

| Execution | Result |
|---|---|
| `node --experimental-strip-types --test tests/exec-001-ticket-001.test.ts` | 20 passed, 0 failed, 0 skipped |
| `npm test` (`.pi/extensions/workflow-orchestrator/test/*.test.ts`) | 25 passed, 0 failed, 0 skipped |
| Direct repeat: `node --experimental-strip-types --test .pi/extensions/workflow-orchestrator/test/*.test.ts` | 25 passed, 0 failed, 0 skipped; duplicate regression run, not counted twice in unique total |
| Focused strict typecheck over all six touched production files plus ticket test | PASS |
| `npm run typecheck` | PASS; package scope is `.pi/extensions/**/*.ts`, not the ticket source |
| Independent adversarial issuer probes | Reproduced `VALID` from forged issuer and inherited-field input; this is behavioral evidence, not a repository test |

```text
TESTS_RUN = 45 unique test cases (70 executions including the duplicate regression run)
TESTS_PASSED = 45 unique test cases
TESTS_FAILED = 0
TESTS_SKIPPED = 0
ENVIRONMENTAL_FAILURES = 0
```

## Regression and conditional dimensions

`REGRESSION_RESULT = NO_REGRESSION`; `REGRESSIONS = 0`. The implementation baseline had no EXEC production contract surface, and the directly affected generic delegation suite passed 25/25. The defect above is a local implementation authority defect, not a pre-existing regression in an existing EXEC contract.

```text
CONCURRENCY = NOT_APPLICABLE
STALE_BEHAVIOR = NOT_APPLICABLE
IDEMPOTENCY = NOT_APPLICABLE
DURABILITY = NOT_APPLICABLE
RECOVERY = NOT_APPLICABLE
COMPATIBILITY = CONFORMANT for the scoped NEW_CANONICAL_PATH; no legacy authority is accepted
PERSISTENCE = NOT_APPLICABLE
MIGRATION = NOT_APPLICABLE
AUTHORITY_CONSUMPTION = DEFINED_BUT_NOT_CONSUMABLE
TEMPORAL_AUTHORITY = NOT_APPLICABLE
CALLER_AS_AUTHORITY_BYPASSES = 1
```

## Required audit summary

Audit: `docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-001-behavior-audit.md`

Specialist:
IMPLEMENTATION_BEHAVIOR

Ticket: `EXEC-001-TICKET-001`

Required behavioral dimensions: 4 (2 REQUIRED, 2 AFFECTED)

Required tests: 5 categories

Required tests missing: 0 categories; the architecture category is present but its current-issuer negative witness is incomplete

Required behaviors total: 4

Direct behavior witnesses: 4

Proxy-only behaviors: 0

Untested state transitions: 0

Unproven concurrency contracts: 0

Missing architecture guards: 1

Tests run: 45 unique test cases

Tests passed: 45 unique test cases

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

AUDIT_TARGET_HEAD: e83bc09150f9b0d7b7f4c26434926578723fef1a
AUDIT_TARGET_STATE_FINGERPRINT: 7f68eea870da956f4d8552cb155a9cc5bcfb38c048fe2f494f12f2fbdfbbba79
DOMAIN_AUDIT_COMPLETE: YES
SPECIALIST_RESULT: SPECIALIST_BEHAVIOR_FINDINGS