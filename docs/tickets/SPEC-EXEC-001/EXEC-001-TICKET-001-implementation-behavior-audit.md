# EXEC-001-TICKET-001 — Implementation Behavior Audit

## Inputs and pinned subject

| Input | Value |
|---|---|
| `TICKET_ID` | `EXEC-001-TICKET-001` |
| `TICKET_PATH` | `docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-001-capability-specific-envelope-and-payload-schemas.md` |
| `IMPLEMENTATION_UNIT` | `EXEC-IMP-01 — Capability-specific envelope and payload schemas` |
| `REQUIREMENT_IDS` | `EXEC-ENVELOPE-001`, `EXEC-ENVELOPE-002` |
| `ACCEPTANCE_IDS` | `AC-EXEC-001`, `AC-EXEC-002` |
| `SPEC_PATH` | `docs/specs/SPEC-EXEC-001-skill-contracts-and-capability-registry.md` (rev. 5) |
| `GAP_MATRIX_PATH` | `docs/specs/gap-matrices/SPEC-EXEC-001-implementation-gap-matrix.md` (`GAP-018`) |
| `IMPLEMENTATION_PLAN_PATH` | `docs/specs/implementation-plans/SPEC-EXEC-001-implementation-plan.md` (`EXEC-IMP-01`) |
| `IMPLEMENTATION_BASELINE` | `8cf79cd37ebb02d0657c1fb191cea1d194b71f89` |
| `CURRENT_HEAD` / `AUDIT_TARGET_HEAD` | `13b4b70b37b9e3f84df21fe7db8381427fa2f95c` |
| `AUDIT_TARGET_STATE_FINGERPRINT` | `b10a12b6eced00572c29b12d381cedb9dc9886687fd6f5fd86d0051c1fcd4928` |
| `AUDIT_WAVE_ID` | `3636d2d2-5c89-40ce-9e40-5aff9abdae17` |
| `CHANGED_PRODUCTION_FILES` | `src/application/exec-contract.ts`; `src/domain/exec-contract.ts`; `src/domain/exec-schema.ts`; `src/domain/exec-validation-evidence-internal.ts`; `src/infrastructure/exec-schema-validator.ts` |
| `CHANGED_TEST_FILES` | `tests/exec-001-ticket-001.test.ts` |
| `RELEVANT_TEST_SUITES` | Focused `tests/exec-001-ticket-001.test.ts`; full `npm test` suite (workflow-orchestrator tests, TICKET-001 tests, TICKET-002 regression tests) |

The HEAD was checked directly. I recalculated the semantic fingerprint with the repository `.pi/extensions/workflow-orchestrator/git-state.ts` `workspaceSnapshot` helper and `skills/_shared/semantic-fingerprint-policy.json`, ignoring exactly the five supplied audit-artifact exclusions. The calculated fingerprint matches the pin. There was no semantic working-tree overlay (`workspaceSnapshot.files` was empty); policy exclusions exclude `.pi/**`, including runtime staging. Git worktree was clean before this report was written.

The authority chain was reconstructed in order: accepted `ADR-0003` rev. 3 requires JSON Schema validation, common envelope plus capability-specific payload, structured minimum fields, and non-authority of human text; SPEC-EXEC-001 rev. 5 assigns `EXEC-ENVELOPE-001/002` to O-016; the validated matrix identifies `GAP-018` as the missing capability-specific schema selection while treating the already-implemented envelope minimum as regression scope; Plan `EXEC-IMP-01` and the ticket bound closure to the local schema/contract operation. No registry, DOM authority, persistence, cross-component mapping, or external-effect work is part of this ticket.

## Behavioral contract and applicability

Expected success: `ValidateExecContract.validate` selects a ticket-owned identifiable schema matching the payload capability/schema/version, validates both envelope and payload, and returns one immutable structured pair with canonical schema references. Expected failure: unknown/mismatched schema or capability, generic-but-capability-invalid payload, malformed/non-JSON input, missing structured minimum, or text-only input returns `INVALID` / `CONTRACT_INVALID`; it must not expose a partial value or imply approval, checkpoint, or effect.

| Dimension | Classification | Applicability/evidence |
|---|---|---|
| `UNIT_BEHAVIOR` | REQUIRED | Ticket-owned schema selection, envelope/payload validation, immutable result and fail-closed output. |
| `INTEGRATION_BEHAVIOR` | AFFECTED | Local flow spans composition, application, domain values, and the TypeBox infrastructure adapter; the direct test invokes the production composition. No foreign integration is required. |
| `PERSISTENCE` | NOT_APPLICABLE | Validation creates no persisted state or durable identity. |
| `CONCURRENCY` | NOT_APPLICABLE | No shared aggregate, mutation command, or externally observable concurrent state transition exists. |
| `STALE_STATE` | AFFECTED | A validation receipt must remain bound to the exact input/reference/content; mutation and inherited-field substitution are exercised. This is receipt staleness, not mutable external-authority revalidation. |
| `IDEMPOTENCY` | NOT_APPLICABLE | This is a side-effect-free validation query, not an effect command or state mutation with retry/idempotency semantics. |
| `DURABILITY` | NOT_APPLICABLE | No durable result or dependent observation is reported. |
| `RECOVERY` | NOT_APPLICABLE | No partial execution, durable operation, or external effect needs restart/replay recovery. |
| `COMPATIBILITY` | AFFECTED | Cutover retires the prior generic-payload acceptance path; direct rejection and retained authenticated-validation regressions are tested. |
| `MIGRATION_BEHAVIOR` | NOT_APPLICABLE | No legacy persisted material or migration/read-write conversion is in scope. |
| `NEGATIVE_PATHS` | REQUIRED | Invalid schema, unknown capability, text-only/missing fields, forgery, stale input, malformed/throwing adapter, and no-partial/no-success behavior are required. |

### Acceptance witness matrix recalculation

| Normative behavior / verb | Concrete operation and expected result | Direct executed positive witness | Direct executed negative/isolation witness | Closure/capability record | Classification |
|---|---|---|---|---|---|
| `AC-EXEC-001`, `EXEC-ENVELOPE-001`: validate with identifiable capability schema | `createExecContractValidator().validate(input)`; return a complete pair bound to the selected envelope and capability payload schema | `accepts a valid identifiable envelope and capability payload as structured values`; `selects an identifiable capability schema and rejects generic or unknown payloads` | The latter rejects generic-invalid data, unknown capability and generic schema identity; caller-selected identity, custom definition and getter-backed substitution tests also reject | `EXEC-SCHEMA-CAPABILITY-PAYLOAD`; authority/contract `DEFINED/DEFINED`; local testability `YES`; fixture/harness productive availability `NO`; dependency `INFORMATIONAL`; `WITNESS_EXECUTABLE_AT_LOCAL_CLOSURE=YES`; `LOCAL_TEST_EVIDENCE` | Direct |
| `AC-EXEC-002`, `EXEC-ENVELOPE-002`: reject missing structured minimum and text-only authority | Same validation operation; complete pair succeeds; missing required field/text-only input gives `CONTRACT_INVALID`, no success/effect meaning | Valid complete pair test | `rejects text-only and malformed input as CONTRACT_INVALID without success signals`; `rejects missing structured fields and never infers them from human text`; one-side-invalid test proves no partial pair | Same local informational capability; `WITNESS_EXECUTABLE_AT_LOCAL_CLOSURE=YES`; `LOCAL_TEST_EVIDENCE` | Direct |

`REQUIRED_BEHAVIORS_TOTAL=2`; `DIRECT_BEHAVIOR_WITNESSES=2`; `PROXY_ONLY_BEHAVIORS=0`; `UNTESTED_STATE_TRANSITIONS=0` (no domain state transitions exist); `UNPROVEN_CONCURRENCY_CONTRACTS=0` (none applies); `MISSING_ARCHITECTURE_GUARDS=0`.

## Production semantics and failure audit

| Behavior | Production evidence | Expected vs observed | Classification |
|---|---|---|---|
| Capability/schema selection | `src/domain/exec-schema.ts:140-187` defines an identifiable payload schema with capability association and selects only an exact capability ID, schema ID, and version match from the frozen definition set. `src/application/exec-contract.ts:107-118` selects before validation. | Known capability-001 selects its registered identifiable payload definition. Unknown/mismatched input has no fallback and returns `CONTRACT_INVALID`. | `IMPLEMENTED_CORRECTLY` |
| Envelope and payload validation as an all-or-nothing pair | `src/application/exec-contract.ts:112-143`; `src/infrastructure/exec-schema-validator.ts:56-100`; structured-value constructors in `src/domain/exec-contract.ts`. | Both selected schemas must pass authenticated validation and current-content checks before the pair is constructed. Either-side failure produces one invalid result, never a partial `value`. | `IMPLEMENTED_CORRECTLY` |
| Minimum structured fields and text non-authority | Schema `required` fields: `src/domain/exec-schema.ts:98-156`; immutable/domain checks: `src/domain/exec-contract.ts:336-389,456-474,480-...`. | Required envelope/payload structure and capability `data.result` are checked. Human text is not used to fill fields. Invalid input returns `CONTRACT_INVALID`. | `IMPLEMENTED_CORRECTLY` |
| Forgery, caller substitution, stale receipt and failure behavior | `src/application/exec-contract.ts:23-59,97-145`; `src/domain/exec-validation-evidence-internal.ts`; `src/infrastructure/exec-schema-validator.ts:36-90`. | Consumer requires producer-issued evidence bound to exact schema reference and input/fingerprint. Unauthenticated/copy/wrapper/custom-definition/stale evidence and malformed or throwing adapters fail closed; no success value is exposed. | `IMPLEMENTED_CORRECTLY` |
| Persistence, effect commit, lifecycle, recovery | No such operation is in the ticket boundary. `ContractInvalidFailure` carries `noApproval`, `noCheckpoint`, and `noEffect` flags. | No durable or external effect is attempted or claimed. | `NOT_APPLICABLE` |

Failure cases exercised include invalid JSON/non-JSON values, absent own fields, generic data lacking required capability data, unknown capability, mismatched/caller-selected schema identities, text-only input, forged/copied/self-described validation evidence, custom/getter-backed definitions, untrusted/copy/wrapper adapters, stale mutated envelope/payload, malformed result, thrown adapter and one-side-invalid pair. Each fails closed; the negative-result tests assert `CONTRACT_INVALID`, absence of a value where applicable, and no-approval/no-checkpoint/no-effect flags. There is no silent fallback or partial pair. `BUSINESS_MUTATION_ON_FAILURE=NO`: no domain/persisted state or external effect is changed; the adapter may initialize its private compiled-schema cache. The returned failure is structured and frozen.

## Authority/provenance and availability surfaces

The only authority used is the unit-owned, immutable EXEC schema definition set; there is no external authority consumer, foreign producer, mutable authority read followed by effect, or capability dependency required for closure. The local capability record is preserved as `AUTHORITY_STATUS=DEFINED`, `CONTRACT_STATUS=DEFINED`, `LOCAL_TESTABILITY=YES`, `PRODUCTIVE_AVAILABILITY=NO` for the fixture/harness (summary `CONTRACT_TESTABLE_LOCALLY`), `DEPENDENCY_CLASS=INFORMATIONAL`. The actual production composition uses `JsonSchemaExecValidator`; executing it proves local behavior, not a foreign/integrated producer promotion. No local-closure blocker follows from this informational classification. `AUTHORITY_CONSUMPTION_PROOF` and `TEMPORAL_AUTHORITY_PROOF` are `NOT_APPLICABLE` because no external authority is consumed and no mutable external authority precedes an effect.

| Required surface | Owner/operation and direct negative witness | Result |
|---|---|---|
| Issuer | Ticket-owned `ExecContractSchemaDefinitions` and `JsonSchemaExecValidator`; valid real-composition witness, plus forged-result/runtime-reference negatives. | Covered |
| Registrar / authority-definition source | Fixed immutable definitions, no dynamic registrar in this unit. Attempted custom/getter-backed schema definitions are rejected. | Registrar `NOT_APPLICABLE`; definition source covered |
| Consumer | `ValidateExecContract` checks authenticated port/result, exact reference/input/fingerprint; domain construction rechecks required own fields and payload minimum. | Covered by caller evidence, no-partial, stale, malformed-result and throwing-adapter tests |
| Alternate authority path | No generic fallback or caller-selected schema source; unknown/generic schema tests fail. An explicit independently implemented authenticated adapter has direct valid and invalid-payload witnesses. | Covered within the approved adapter seam |
| Injection | Caller-provided schema identity, custom definition, raw/copy/self-described result and cold-start caller port are exercised and rejected. | Covered |
| Mutation / stale | Receipt replay after envelope/payload mutation and inherited-property substitution are rejected. | Covered |
| Port substitution | Untrusted wrapper and copied adapter cannot relay/forge canonical evidence; independent authenticated adapter follows the explicit contract. | Covered |
| Public exports | Tests inspect `exec-schema`/evidence exports, verify no public registration/record-issuer helpers, and exercise forged-result/runtime-created-reference rejection. The authenticated adapter base is an intentional adapter seam; production composition is fixed to `JsonSchemaExecValidator`. | Covered; no observed caller-data route to select another producer |

`CALLER_AS_AUTHORITY_CHECK`: payload identity values are only lookup assertions against the immutable owner definition; unknown/mismatch is rejected. Human text and caller-supplied receipt/schema authority cannot establish canonical validity. `CALLER_SUPPLIED_AUTHORITY_BYPASS=0`. No systemic defect was found; no root-cause campaign is opened.

## Test inventory and assertion quality

| Category | Classification | Evidence / reason |
|---|---|---|
| `UNIT` | `REQUIRED_TEST_PRESENT` | Direct positive and negative `ValidateExecContract` behavior tests. |
| `INVARIANT` | `REQUIRED_TEST_PRESENT` | Canonical schema identity, immutable values, exact pair, own structured fields and result flags. |
| `PERSISTENCE` | `TEST_CATEGORY_NOT_APPLICABLE` | No persistence boundary. |
| `INTEGRATION` | `REQUIRED_TEST_PRESENT` | Real local composition through application, domain and TypeBox adapter. |
| `CROSS_SPEC` | `TEST_CATEGORY_NOT_APPLICABLE` | No foreign capability is consumed for local closure. |
| `CONCURRENCY` | `TEST_CATEGORY_NOT_APPLICABLE` | No concurrent mutation contract. |
| `STALE` | `REQUIRED_TEST_PRESENT` | Direct receipt/input mutation and inherited-field stale negatives. |
| `IDEMPOTENCY` | `TEST_CATEGORY_NOT_APPLICABLE` | No mutating command/effect. |
| `RECOVERY` | `TEST_CATEGORY_NOT_APPLICABLE` | No durable or partial operation to recover. |
| `COMPATIBILITY` | `REQUIRED_TEST_PRESENT` | Generic-payload acceptance is intentionally retired; direct generic rejection and existing authenticated validation regressions run. |
| `MIGRATION` | `TEST_CATEGORY_NOT_APPLICABLE` | No stored legacy data or migration. |
| `NEGATIVE_PATH` | `REQUIRED_TEST_PRESENT` | Invalid, forged, stale, missing, unknown, malformed and thrown-input tests. |
| `ARCHITECTURE_GUARD` | `REQUIRED_TEST_PRESENT` | Executed import-graph guard checks reachable production imports and allowed dependency boundary. |
| `CONFORMANCE` | `REQUIRED_TEST_PRESENT` | Direct schema identity/selection and structured contract witnesses; canonical artifact consistency check also passed. |

Eight required categories are present; zero required test categories are missing. Positive assertions check `VALID`, exact canonical schema references and semantic structured data. Negative assertions check `INVALID`/`CONTRACT_INVALID`, missing `value`, failure flags and observed references. Forgery/stale tests assert semantic rejection, not merely exception absence. The import-graph guard traverses the productive graph and asserts its exact allowed source set. Evidence quality is `STRONG` for local contract behavior. No fixture is used as proof of persistence, recovery, CAS, foreign integration, external effects, or productive foreign availability.

## Test execution and regression safety

The configured Node binary is v22.22.1 but was built without TypeScript support: the package's raw `node --experimental-strip-types` command reports `ERR_NO_TYPESCRIPT`. To execute the required tests without changing repository files, I used the installed TypeScript 5.9 transpiler via an inline ESM loader and inherited it through `NODE_OPTIONS` for test-spawned child processes. A focused attempt without inheriting the loader failed only in its nested child-process probe; the inherited-loader rerun and full suite passed. Type checking separately passed.

| Execution | Outcome |
|---|---|
| Raw `npm test` | Runner unavailable: 9 file-level failures at TS loading, all `ERR_NO_TYPESCRIPT`; no test body executed. |
| Focused TICKET-001 run with loader only in parent | 25/26 passed; one child-process probe failed at TS loading (`ERR_NO_TYPESCRIPT`). Environmental. |
| Focused TICKET-001 rerun with loader inherited via `NODE_OPTIONS` | 26/26 passed. |
| Full `npm test` rerun with loader inherited | 106/106 passed (workflow, TICKET-001, and TICKET-002 suites); zero skipped. |
| `npm run typecheck` | Passed. |
| `npm run verify:audit-governance` | Passed. |
| `npm run verify:canonical-consistency` | Passed. |
| `npm run verify:skill-mirror` | Failed: reports canonical/mirror skill differences and missing mirror files. This is outside the changed TICKET-001 production/test files and does not exercise ticket behavior; recorded as an out-of-scope repository verification failure, not a TICKET-001 regression. |

Counts include environmental failed attempts as reported by TAP: `TESTS_RUN=167`, `TESTS_PASSED=157`, `TESTS_FAILED=10`, `TESTS_SKIPPED=0`, `ENVIRONMENTAL_FAILURES=10`; implementation test failures after supported execution workaround: `0`. Failure classifications: `IMPLEMENTATION_FAILURE=0`, `PREEXISTING_REGRESSION=0` in ticket scope, `CROSS_SPEC_FAILURE=0`, `ENVIRONMENTAL_FAILURE=10`. The `verify:skill-mirror` check is tracked separately above and is not counted as a behavioral test case.

Regression assessment against `IMPLEMENTATION_BASELINE=8cf79cd...`: the generic payload behavior is deliberately retired by `GAP-018`; the direct generic-invalid negative verifies that cutover. The retained envelope minimum, authenticated evidence, immutability and fail-closed behavior all execute in the full suite. No material TICKET-001 behavior regression was found: `NO_REGRESSION` (`REGRESSIONS=0`). The unrelated mirror verification failure is not a regression in the audited production/test subject.

## Conditional dimensions

| Dimension | Result | Evidence |
|---|---|---|
| Concurrency | `NOT_APPLICABLE` | No shared lifecycle or mutation operation; no concurrent contract is authorized. |
| Stale behavior | `CONFORMANT` | Current input/reference/fingerprint and own-field checks reject stale receipt, mutation and inherited substitution. |
| Idempotency | `NOT_APPLICABLE` | No command or side effect; repeat/retry identity is outside scope. |
| Durability / persistence | `NOT_APPLICABLE` | No state is persisted. |
| Recovery | `NOT_APPLICABLE` | No durable/partial external operation exists. |
| Compatibility | `CONFORMANT` for affected behavior | Generic acceptance is rejected; no silent legacy conversion or persisted migration applies. |
| Authority consumption | `NOT_APPLICABLE` | No external authority is consumed. The unit-owned capability remains informational and fixture availability is not promoted. |
| Temporal authority | `NOT_APPLICABLE` | No mutable external authority is observed before committing an effect. Receipt staleness is separately tested. |

## Findings and specialist summary

No behavioral findings. No `LOCAL_CLOSURE_BLOCKING` defect, missing required witness, untested required transition, unproven concurrency obligation, authority bypass, or material regression was identified. Required local witnesses are executable now. The unrelated `verify:skill-mirror` failure is recorded but does not prevent completion of this behavioral audit.

Audit: `.pi/runtime/workflow-audits/3636d2d2-5c89-40ce-9e40-5aff9abdae17/behavior-EXEC-001-TICKET-001-implementation-behavior-audit.md`

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

Tests run: 167

Tests passed: 157

Tests failed: 10

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
NOT_APPLICABLE

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

AUDIT_TARGET_HEAD: 13b4b70b37b9e3f84df21fe7db8381427fa2f95c
AUDIT_TARGET_STATE_FINGERPRINT: b10a12b6eced00572c29b12d381cedb9dc9886687fd6f5fd86d0051c1fcd4928
AUDIT_WAVE_ID: 3636d2d2-5c89-40ce-9e40-5aff9abdae17
DOMAIN_AUDIT_COMPLETE: YES
SPECIALIST_RESULT: SPECIALIST_BEHAVIOR_PASS
