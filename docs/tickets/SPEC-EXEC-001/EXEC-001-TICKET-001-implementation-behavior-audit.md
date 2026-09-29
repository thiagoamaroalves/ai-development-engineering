# Implementation Behavior Audit — EXEC-001-TICKET-001

## Audit basis and identified inputs

```text
TICKET_ID = EXEC-001-TICKET-001
TICKET_PATH = docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-001-capability-specific-envelope-and-payload-schemas.md
IMPLEMENTATION_UNIT = EXEC-IMP-01 — Capability-specific envelope and payload schemas
REQUIREMENT_IDS = EXEC-ENVELOPE-001, EXEC-ENVELOPE-002
ACCEPTANCE_IDS = AC-EXEC-001, AC-EXEC-002
SPEC_PATH = docs/specs/SPEC-EXEC-001-skill-contracts-and-capability-registry.md
GAP_MATRIX_PATH = docs/specs/gap-matrices/SPEC-EXEC-001-implementation-gap-matrix.md
IMPLEMENTATION_PLAN_PATH = docs/specs/implementation-plans/SPEC-EXEC-001-implementation-plan.md
IMPLEMENTATION_DESIGN_PATH = docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-001-implementation-design.md
TICKET_SET_AUDIT_PATH = docs/tickets/SPEC-EXEC-001/implementation-ticket-audit.md
ACCEPTED_ADR = docs/adrs/ADR-0003-versioned-skill-contracts.md
IMPLEMENTATION_BASELINE = 8cf79cd37ebb02d0657c1fb191cea1d194b71f89
CURRENT_HEAD = 1f27b0fe187325398524e351f56cacfc61eea1e4
AUDIT_TARGET_HEAD = 1f27b0fe187325398524e351f56cacfc61eea1e4
AUDIT_TARGET_STATE_FINGERPRINT = c21d52859837764cd3bd22cc3c2cef5df7f8aeeba733724040eaec4d10cd2f3e
AUDIT_WAVE_ID = 047b2eae-25bd-4a37-8955-bfd39bfa26b0
```

The pinned HEAD was verified. The semantic workspace fingerprint was independently
recalculated as `c21d52859837764cd3bd22cc3c2cef5df7f8aeeba733724040eaec4d10cd2f3e`
using the repository semantic-fingerprint policy and the workflow/audit-artifact
exclusions. No production or ticket-specific test overlay exists beyond the
pinned target. Existing dirty documentation, package/tooling, and audit paths
are outside the semantic implementation subject under the pinned fingerprint.

### Changed implementation subject

Relative to `IMPLEMENTATION_BASELINE`, the production files are:

- `src/application/exec-contract.ts`
- `src/domain/exec-contract.ts`
- `src/domain/exec-schema.ts`
- `src/domain/exec-validation-evidence-internal.ts`
- `src/infrastructure/exec-schema-validator.ts`

The changed test file is:

- `tests/exec-001-ticket-001.test.ts`

The ticket's embedded implementation-state metadata still names the older
8cf working-tree state; this audit uses the explicitly pinned HEAD and verified
semantic fingerprint, not that documentary claim.

## Authority and behavioral contract reconstruction

The accepted ADR, conformant SPEC, validated Gap Matrix, approved Plan, ticket,
and approved design consistently authorize this bounded behavior:

1. Select an identifiable ticket-owned schema for the capability payload.
2. Validate both envelope and selected capability payload before construction.
3. Preserve the structured envelope minimum and schema identity/version.
4. Reject a structurally generic but capability-invalid payload with
   `CONTRACT_INVALID`.
5. Reject missing structured fields and text-only input; human text is never
   authority and cannot imply approval, checkpoint, completion, or effect.
6. Expose either one complete immutable validated pair or one structured failure;
   never expose a partial pair.
7. Preserve issuer-bound validation evidence, exact input binding,
   schema-reference binding, content-fingerprint/stale rejection, and fail-closed
   behavior for forged, malformed, or throwing adapter results.
8. Keep registry resolution, persistence, lifecycle, transport, external
   effects, and foreign integration outside this ticket.

The implementation has one ticket-owned capability definition (`capability-001`,
`exec-capability-001-payload@1.0.0`). This is an identifiable immutable local
schema set; dynamic registry publication is explicitly deferred to later units.

## Behavioral applicability matrix

| Dimension | Classification | Evidence/reason |
|---|---|---|
| `UNIT_BEHAVIOR` | REQUIRED | Schema selection, capability-specific payload validation, envelope minimums, and structured failure are the ticket's direct behavior. |
| `INTEGRATION_BEHAVIOR` | AFFECTED | The composition root must expose the same local contract path without prototype, transport, or second authority imports. |
| `PERSISTENCE` | NOT_APPLICABLE | No record, repository, snapshot, journal, durable identity, or persistence boundary exists in this unit. |
| `CONCURRENCY` | NOT_APPLICABLE | Validation is synchronous and side-effect-free; no mutable aggregate, mutation command, CAS, or concurrent successor contract is owned here. |
| `STALE_STATE` | AFFECTED | Authenticated validation receipts bind current input content; mutation and inherited-field substitution must fail closed. |
| `IDEMPOTENCY` | NOT_APPLICABLE | There is no external or durable effect to duplicate; repeated validation does not create canonical state. |
| `DURABILITY` | NOT_APPLICABLE | No completion or dependent observation is reported as durable state. |
| `RECOVERY` | NOT_APPLICABLE | No interrupted operation, restart, replay, retry lineage, or recovery record is implemented. |
| `COMPATIBILITY` | AFFECTED | The generic payload path is intentionally retired in favor of the new canonical schema identity; no silent conversion is allowed. |
| `MIGRATION_BEHAVIOR` | NOT_APPLICABLE | This is a new canonical path with no persisted historical material or migration reader. |
| `NEGATIVE_PATHS` | REQUIRED | Unknown/mismatched capability, generic-invalid data, missing fields, text-only input, forged evidence, malformed adapter output, and stale input are required rejection paths. |

## Production behavior classifications

| Behavior | Classification | Production evidence and observed semantics |
|---|---|---|
| Capability-specific identifiable schema authority | `IMPLEMENTED_CORRECTLY` | `src/domain/exec-schema.ts:136-174` defines frozen envelope/payload documents and an immutable `payloadDefinitions` set. The payload document binds schema ID, version, capability ID, and a required structured `data.result`; `selectPayload` (`:177-183`) returns only an exact ticket-owned association. |
| Selection before payload consumption | `IMPLEMENTED_CORRECTLY` | `src/application/exec-contract.ts:101-114` fails closed when selection has no exact match and passes the selected definition to the validator. There is no generic fallback. |
| Envelope and payload schema validation | `IMPLEMENTED_CORRECTLY` | `ValidateExecContract.validate` invokes the canonical envelope and selected payload definitions, normalizes both results, and rejects malformed or invalid results before value construction (`:107-121`). |
| Structured envelope minimum | `IMPLEMENTED_CORRECTLY` | The envelope schema required list and value boundary cover schema identity/version, contract/execution identities, status/verdict, checkpoints, artifacts, evidence, findings, requested effects, and errors (`src/domain/exec-schema.ts:103-134`, `src/domain/exec-contract.ts:495-504`). |
| Capability payload minimum and identity | `IMPLEMENTED_CORRECTLY` | `StructuredCapabilityPayload.create` independently checks canonical payload reference, own required fields, exact schema identity, `capability-001`, and non-empty own `data.result` (`src/domain/exec-contract.ts:532-562`). |
| Generic-but-capability-invalid payload rejection | `IMPLEMENTED_CORRECTLY` | A payload with arbitrary `data` but no required `result`, an unknown capability, or the old generic schema ID is rejected before a validated value is returned. |
| Text non-authority and fail-closed failure | `IMPLEMENTED_CORRECTLY` | `humanText` is not read for validation. `invalidContract` returns frozen `CONTRACT_INVALID` failure with `noApproval`, `noCheckpoint`, and `noEffect` all true. |
| Atomic complete-pair exposure | `IMPLEMENTED_CORRECTLY` | Both results are checked before `StructuredExecutionEnvelope.create`, `StructuredCapabilityPayload.create`, and `ValidatedExecContract.create`; catch/failure paths expose no partial `value`. |
| Provenance and anti-forgery | `IMPLEMENTED_CORRECTLY` | `src/infrastructure/exec-schema-validator.ts:28-104,136-231` issues private-brand, exact-producer results only for canonical definitions and bound inputs. `src/domain/exec-validation-evidence-internal.ts:14-39` verifies private result identity, prototype, and producer identity. Caller-shaped results, copied results, wrappers, subclasses, custom definitions, and runtime references are rejected. |
| Stale/mutation protection | `IMPLEMENTED_CORRECTLY` | Canonical results bind exact input identity and `structuredContentFingerprint`; the adapter rechecks current schema validity and own required fields, while value construction recomputes the fingerprint (`src/infrastructure/exec-schema-validator.ts:147-221`, `src/domain/exec-contract.ts:391-415`). |
| Owner-authorized alternate transport | `IMPLEMENTED_CORRECTLY` | `createReceiptReplayPort` accepts only genuine canonical receipts and explicitly authorizes the frozen replay port (`src/infrastructure/exec-schema-validator.ts:159-187`). It cannot mint new validation authority and stale/current-input checks remain at the consumer. |
| Malformed/throwing adapter failure | `IMPLEMENTED_CORRECTLY` | `normalizedValidationResult` and `safeThrownIssue` in `src/application/exec-contract.ts:18-75` normalize malformed results and thrown values to a structured fail-closed result. |
| Immutability and JSON boundary | `IMPLEMENTED_CORRECTLY` | Schema documents and definitions are deeply frozen; value construction clones/freezes structured values and rejects accessors, sparse arrays, non-JSON values, inherited required fields, and unsupported schema references. |
| Local composition boundary | `IMPLEMENTED_CORRECTLY` | `src/composition/exec-contract.ts` wires only `ValidateExecContract` and `JsonSchemaExecValidator`; the executable import-graph test confirms the six-file productive graph and forbids prototype, `.pi`, transport, filesystem, database, and unrelated bare dependencies. |
| Persistence, lifecycle, recovery, and external effects | `NOT_APPLICABLE` | No implementation path exists or is required for this ticket; the ticket explicitly excludes these owners and boundaries. |

## Acceptance witness audit

### Reconstructed `ACCEPTANCE_WITNESS_MATRIX`

| Required behavior | Normative verb | Concrete operation | Direct positive witness | Direct negative/isolation witness | Witness executable at local closure | Result |
|---|---|---|---|---|---|---|
| Capability payload schema selection and validation | validate | `ValidateExecContract.validate` / `C-EXEC-001` / `AC-EXEC-001` | `tests/exec-001-ticket-001.test.ts:89-97` validates a complete pair and asserts canonical envelope/payload schema identities and structured data. | `:99-132` rejects generic data, unknown capability, and old generic schema ID with `CONTRACT_INVALID`; `:190-217`, `:439-624` cover caller/forgery isolation. | YES | `IMPLEMENTED_CORRECTLY`; direct positive and negative semantics are asserted. |
| Structured envelope minimum and text non-authority | reject | `ValidateExecContract.validate` / `C-EXEC-002` / `AC-EXEC-002` | `:89-97`, `:841-857` cover complete structured input. | `:841-875` rejects text-only and missing fields with `CONTRACT_INVALID` and no success signals; `:877-886` rejects one-sided/partial input. | YES | `IMPLEMENTED_CORRECTLY`; direct positive and negative semantics are asserted. |

```text
REQUIRED_BEHAVIORS_TOTAL = 2
DIRECT_BEHAVIOR_WITNESSES = 2
PROXY_ONLY_BEHAVIORS = 0
UNTESTED_STATE_TRANSITIONS = 0
UNPROVEN_CONCURRENCY_CONTRACTS = 0
MISSING_ARCHITECTURE_GUARDS = 0
```

The witness operations execute the named validation boundary and assert semantic
results. Registration/listing is not used as a progress proxy. The local schema
harness is valid evidence for this local contract-level behavior; no fixture is
used to claim persistence, restart, productive foreign integration, physical CAS,
or an external effect.

## Authority, provenance, and capability records

### Authority consumption proof

```text
CAPABILITY_ID = EXEC-SCHEMA-CAPABILITY-PAYLOAD
AUTHORITY_EXISTENCE = EXEC-ENVELOPE-001/002 in SPEC-EXEC-001 revision 5
TRUTH_OWNER = SPEC-EXEC-001 / EXEC-001
AUTHORITY_SEMANTIC_SOURCE = immutable identifiable envelope and capability-payload definitions
OWNER_DOMAIN_OR_BOUNDED_CONTEXT = EXEC-001
CONSUMPTION_CONTRACT = ValidateExecContract consumes the selected ticket-owned definition and canonical validator evidence
PORT_INTERFACE_QUERY_RESOLVER_OR_READER = ExecContractSchemaDefinitions.selectPayload + ExecSchemaValidationPort
CONTRACT_PRODUCER = ticket-owned ExecContractSchemaDefinitions and canonical JsonSchemaExecValidator
CONTRACT_CONSUMER = ValidateExecContract, StructuredExecutionEnvelope, StructuredCapabilityPayload
RETURNED_DATA = selected schema definition/reference, authenticated validation result, exact input binding, and content fingerprint
VERSION_REVISION_TRANSPORT = SchemaReference carries schema ID and semantic version 1.0.0
FAILURE_NOT_FOUND_STALE_SEMANTICS = unknown/mismatched selection, invalid payload, malformed evidence, thrown adapter, or stale input yields CONTRACT_INVALID with no partial pair
AUTHORITY_STATUS = DEFINED
CONTRACT_STATUS = DEFINED
SEMANTIC_STATUS = DEFINED
LOCAL_TESTABILITY = YES
PRODUCTIVE_AVAILABILITY = YES for the local production composition path; the separate fixture-only record remains NO and is not promoted
CAPABILITY_SUMMARY_STATUS = CONTRACT_PRODUCTIVELY_AVAILABLE for the local production path
DEPENDENCY_CLASS = INFORMATIONAL
AVAILABILITY_EVIDENCE = direct composition-path tests and independent pinned-target execution
BLOCKING_EFFECT = NONE
RESULT = AUTHORITY_CONSUMABLE for the local production path; fixture-only evidence remains DEFINED_BUT_NOT_CONSUMABLE and has no blocking effect
```

The informational capability is unit-owned rather than a required foreign producer;
therefore no unavailable foreign capability blocks local closure. No fixture, mock,
fake, or in-memory repository was promoted to productive foreign availability.

### Producer/consumer contract proof

The canonical producer owns schema documents, exact schema references, validation
receipts, input identity, and content fingerprints. The consumer verifies the
producer-issued result before constructing domain values. Invalid, unknown,
stale, malformed, or detached input is rejected; no consumer chooses a schema
source or infers authority from `humanText`.

### Temporal authority proof

`TEMPORAL_AUTHORITY_PROOF = NOT_APPLICABLE`: this operation observes immutable
unit-owned definitions and commits no external or durable effect. The separate
stale-input witness is still required and passes; it is provenance/current-input
protection, not revalidation of mutable external authority.

### Caller-as-authority check

```text
CALLER_AS_AUTHORITY_CHECK = PASS
CALLER_SUPPLIED_AUTHORITY_BYPASS = 0
```

Caller payload fields are only a candidate selector. A successful result still
requires the immutable ticket-owned definition, canonical validator, exact schema
reference, exact input identity, current fingerprint, and structured-value checks.
Caller schema IDs, custom definitions, copied evidence, text, or adapter wrappers
cannot become canonical truth.

## Negative and failure-path audit

| Failure/negative case | Expected | Observed evidence |
|---|---|---|
| Generic data under known capability | `CONTRACT_INVALID`, no partial/effect | Direct test `:99-115`; passes. |
| Unknown capability or old generic schema ID | Fail closed with `CONTRACT_INVALID` | Direct test `:117-132`; passes. |
| Missing envelope field or text-only input | `CONTRACT_INVALID`, no approval/checkpoint/effect | Direct tests `:841-875`; passes. |
| Missing payload side | `CONTRACT_INVALID`, no partial `value` | Direct test `:877-886`; passes. |
| Caller-selected schema/custom schema/getter-backed definition | Reject without reading substitute authority | Direct tests `:190-261`; passes. |
| Forged, copied, wrapper, subtype, or runtime-created validation evidence | Reject without success | Direct tests `:264-624`; passes. |
| Genuine evidence after schema-valid mutation or inherited-field substitution | `CONTRACT_INVALID`, no success signals | Direct test `:626-724`; passes. |
| Malformed result or thrown adapter value | Normalize to `CONTRACT_INVALID` | Direct test `:726-748`; passes. |
| Non-JSON, inherited, sparse, or accessor data | Reject, no unsafe materialization | Direct tests `:888-997`; passes. |
| Repeated equivalent validation | Same semantic outcome, no external mutation | Independent execution probe returned `VALID` on repeated calls with no external state; no durable/effect surface exists. |

## Required test inventory and assertion quality

| Test category | Classification | Evidence |
|---|---|---|
| `UNIT` | REQUIRED_TEST_PRESENT | 25 direct ticket tests; positive selected schema and structured values are asserted. |
| `INVARIANT` | REQUIRED_TEST_PRESENT | Required-field, exact identity, immutable value, complete-pair, JSON-boundary and no-partial assertions pass. |
| `INTEGRATION` | REQUIRED_TEST_PRESENT | Composition-root execution and generic consumer isolation test pass; this remains local integration, not foreign productive integration. |
| `STALE` | REQUIRED_TEST_PRESENT | Genuine receipt replay, current-content mutation, inherited-field substitution, and no-success assertions pass. |
| `COMPATIBILITY` | REQUIRED_TEST_PRESENT | Old generic schema ID/data path is rejected; canonical schema identity is explicit; no silent conversion is performed. |
| `NEGATIVE_PATH` | REQUIRED_TEST_PRESENT | Invalid, forged, malformed, throwing, stale, text-only, missing, inherited, and generic-invalid paths are directly asserted. |
| `ARCHITECTURE_GUARD` | REQUIRED_TEST_PRESENT | Executed import-graph guard and public authority-export guard pass; this is not source inspection alone. |
| `CONFORMANCE` | REQUIRED_TEST_PRESENT | Pinned-target typecheck, governance, canonical-consistency, and full test suite pass under the documented runtime adaptation. |
| `PERSISTENCE` | TEST_CATEGORY_NOT_APPLICABLE | No durable state. |
| `CONCURRENCY` | TEST_CATEGORY_NOT_APPLICABLE | No mutable shared state or concurrent mutation command. |
| `IDEMPOTENCY` | TEST_CATEGORY_NOT_APPLICABLE | No business effect or durable state can be duplicated. |
| `RECOVERY` | TEST_CATEGORY_NOT_APPLICABLE | No restart/replay/recovery behavior is in scope. |
| `MIGRATION` | TEST_CATEGORY_NOT_APPLICABLE | New canonical path; no persisted legacy material is read or migrated. |
| `CROSS_SPEC` | TEST_CATEGORY_NOT_APPLICABLE | No foreign capability is required for local closure. |

```text
REQUIRED_TEST_CATEGORIES = 8
REQUIRED_TEST_CATEGORIES_MISSING = 0
```

Assertions are `STRONG`: tests assert canonical status, schema identities, failure
codes, no-approval/no-checkpoint/no-effect flags, absence of partial values,
immutability, exact producer/input binding, stale rejection, and import/public
boundary behavior. They do not rely solely on HTTP success, non-null results,
absence of exceptions, registration/listing, or duplicated implementation logic.

## Independent test execution record

The pinned target's ticket-specific suite was executed using the available `tsx`
runtime adapter because this Node binary reports `ERR_NO_TYPESCRIPT` for the
repository's declared `node --experimental-strip-types` command. A clean archive
of the exact pinned commit was used; `NODE_OPTIONS=--import tsx` only supplies the
runtime TypeScript loader and does not alter production or test sources.

```text
TICKET_SPECIFIC_COMMAND = npx --no-install tsx --test tests/exec-001-ticket-001.test.ts
TICKET_SPECIFIC_RESULT = 25/25 passed, 0 failed, 0 skipped
PINNED_TARGET_COMMAND = NODE_OPTIONS='--import tsx' npm test (clean archive of 1f27b0f...)
PINNED_TARGET_RESULT = 83/83 passed, 0 failed, 0 skipped
TYPECHECK = PASS
VERIFY_AUDIT_GOVERNANCE = PASS
VERIFY_CANONICAL_CONSISTENCY = PASS
VERIFY_SKILL_MIRROR = PASS in the pinned workspace overlay (89 canonical source files synchronized)
TESTS_RUN = 83 full-suite tests, including 25 ticket-specific tests
TESTS_PASSED = 83
TESTS_FAILED = 0 implementation failures
TESTS_SKIPPED = 0
ENVIRONMENTAL_FAILURES = 2 runtime-adaptation observations
```

Environmental observations did not indicate implementation failures:

1. Direct `node --experimental-strip-types` cannot run in this Node build and
   fails with `ERR_NO_TYPESCRIPT` before loading the ticket test.
2. An archived Git-only tree omits the ignored `.codex/skills` mirror, so the
   mirror verifier cannot run from that archive; the verifier passes in the
   pinned workspace where the ignored mirror exists.

The exact target full suite passes when the available `tsx` loader is inherited
by the target command and its nested architecture-guard processes. The initial
runtime failures are therefore classified `ENVIRONMENTAL_FAILURE`, not
`IMPLEMENTATION_FAILURE` or `PREEXISTING_REGRESSION`.

## Regression result

```text
REGRESSION_RESULT = NO_REGRESSION
```

The generic payload acceptance behavior is intentionally retired by the approved
`NEW_CANONICAL_PATH` cutover and is directly rejected. The prior public
caller-mintable adapter-result mechanism is not treated as an authorized retained
contract under the shared provenance/anti-forgery rules; the current
owner-authorized receipt replay path is directly tested. All retained local
schema, failure, immutability, import-boundary, and generic-consumer behavior
passes against the pinned target. No unrelated repository-wide regression was
claimed.

## Conditional runtime dimensions

```text
CONCURRENCY = NOT_APPLICABLE
STALE_STATE = CONFORMANT
IDEMPOTENCY = NOT_APPLICABLE
DURABILITY = NOT_APPLICABLE
RECOVERY = NOT_APPLICABLE
COMPATIBILITY = CONFORMANT for the authorized new-canonical-path cutover
MIGRATION_BEHAVIOR = NOT_APPLICABLE
AUTHORITY_CONSUMPTION = CONSUMABLE for local production capability; fixture-only record is not consumable
TEMPORAL_AUTHORITY = NOT_APPLICABLE
CALLER_SUPPLIED_AUTHORITY_BYPASS = 0
```

No stateful aggregate, persistence boundary, recovery route, or external effect
exists in the ticket. Stale input/provenance is the only affected temporal-like
behavior and is directly covered.

## Findings and systemic campaign status

No material behavioral finding was established. The only apparent compatibility
difference from the implementation baseline—the removal of the caller-mintable
independent result issuer—is an anti-forgery correction: arbitrary result-shaped
or wrapper evidence is rejected, while an owner-authorized replay adapter remains
accepted. It is not a regression under the approved authority/provenance
contract.

```text
CRITICAL_FINDINGS = 0
MAJOR_FINDINGS = 0
MINOR_FINDINGS = 0
INFO_FINDINGS = 0
ROOT_CAUSE_CAMPAIGNS = NONE
LOCAL_CLOSURE_BLOCKING_FINDINGS = 0
INTEGRATED_ONLY_FINDINGS = 0
DEPENDENCY_CLASS_RECLASSIFICATION_REQUIRED = 0
UPSTREAM_DEPENDENCY_CLASSIFICATION_PRESERVED = YES
```

## Summary

Audit: `.pi/runtime/workflow-audits/047b2eae-25bd-4a37-8955-bfd39bfa26b0/behavior-EXEC-001-TICKET-001-implementation-behavior-audit.md`

Specialist:
IMPLEMENTATION_BEHAVIOR

Ticket: EXEC-001-TICKET-001

Required behavioral dimensions: 5

Required tests: 8

Required tests missing: 0

Required behaviors total: 2

Direct behavior witnesses: 2

Proxy-only behaviors: 0

Untested state transitions: 0

Unproven concurrency contracts: 0

Missing architecture guards: 0

Tests run: 83

Tests passed: 83

Tests failed: 0

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
CONSUMABLE

Temporal authority:
NOT_APPLICABLE

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

AUDIT_TARGET_HEAD: 1f27b0fe187325398524e351f56cacfc61eea1e4
AUDIT_TARGET_STATE_FINGERPRINT: c21d52859837764cd3bd22cc3c2cef5df7f8aeeba733724040eaec4d10cd2f3e
AUDIT_WAVE_ID: 047b2eae-25bd-4a37-8955-bfd39bfa26b0
DOMAIN_AUDIT_COMPLETE: YES
SPECIALIST_RESULT: SPECIALIST_BEHAVIOR_PASS