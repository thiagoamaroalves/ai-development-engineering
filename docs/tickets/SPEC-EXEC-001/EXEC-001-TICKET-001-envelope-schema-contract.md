# EXEC-001-TICKET-001 — Envelope and schema contract

## 1. Status

`STATUS: VALIDATION_REQUIRED`

```text
ISSUE_DECOMPOSITION_READINESS: ISSUE_READY
INITIAL_DAG_STATE: READY
EXECUTION_READY: FALSE
BLOCKED_BY: NONE
DEPENDS_ON: NONE
```

## 2. Source Traceability

- ADR: `ADR-0003`, revision 3, accepted.
- Portfolio: `docs/specs/SPEC-PORTFOLIO-001-organization.md`, obligation `O-016`.
- Component SPEC: `docs/specs/SPEC-EXEC-001-skill-contracts-and-capability-registry.md`, `EXEC-ENVELOPE-001/002`.
- Gap Matrix: `docs/specs/gap-matrices/SPEC-EXEC-001-implementation-gap-matrix.md`, `GAP-001`.
- Gap Matrix Audit: `docs/specs/gap-matrices/audits/SPEC-EXEC-001-implementation-gap-matrix-audit.md`, `GAP_MATRIX_CONFORMANT`.
- Implementation Plan: `docs/specs/implementation-plans/SPEC-EXEC-001-implementation-plan.md`, `EXEC-IMP-01`.
- Plan Audit: `docs/specs/implementation-plans/audits/SPEC-EXEC-001-implementation-plan-audit.md`, `IMPLEMENTATION_PLAN_CONFORMANT`.

## 3. Authority / Scope

Approved owner: `EXEC-001 / CANONICAL_OWNER`. Primary owning specification/domain: `SPEC-EXEC-001`. Local ownership is identifiable envelope/payload schema shape and fail-closed validation result. No foreign capability is required for local closure.

## 4. Portfolio Obligation Coverage

`O-016` — common JSON envelope and capability payload validated by identifiable schemas.

## 5. Gap / Requirement / Acceptance Coverage

`GAP-001`; `EXEC-ENVELOPE-001`, `EXEC-ENVELOPE-002`; `AC-EXEC-001`, `AC-EXEC-002`; final proof owner: this ticket. Integrated consumers are contributors only at later checkpoints.

## 6. Implementation Unit

`EXEC-IMP-01 — Envelope and schema contract`. 1:1 mapping; no split siblings; no merge.

## 7. Goal

Make the common envelope and capability payload validatable through identifiable structured schemas while keeping human text non-authoritative.

## 8. Validated Implementation Delta

`OBSERVED`: no productive EXEC schema, payload or validator; prototype shapes are non-authoritative. `REQUIRED`: identifiable schemas, required structured fields and fail-closed validation. `DELTA`: productive EXEC contract boundary is absent.

## 9. Required Behavior

1. Accept a valid envelope/payload pair only when both identifiable schemas validate.
2. Reject missing minimum fields and text-only input as `CONTRACT_INVALID` without implying approval, checkpoint or effect.

## 10. Does Not Implement

Version/registry resolution; DOM identity or lifecycle; persistence/recovery; runtime/session execution; external effects; transport, UI or OPS mappings; downstream integrated conformance.

## 11. Repository Evidence

No productive EXEC schema/runtime was found. `prototype/src/mockDomain.ts` and prototype tests are scenario evidence only; generic delegation is a consumer seam, not schema authority.

## 12. Expected Repository Impact

- Production code: EXEC envelope/payload validation boundary.
- Persistence/schema: identifiable contract schemas; physical format remains unfrozen.
- Integration: downstream structured-contract consumption seam.
- Tests: direct valid, invalid, missing-field and text-only rejection witnesses.
- Legacy/cutover: `NEW_CANONICAL_PATH`; no legacy EXEC authority.
- Generated contracts: none mandated beyond the validated schemas.

## 13. Dependencies

Internal: none. Cross-SPEC: none for local closure; downstream BACKEND/OPS/UI mappings are integrated-proof-only. `UNBLOCKS: EXEC-001-TICKET-002`.

## 14. Blocking Conditions

No unresolved local blocker. A fixture/harness is sufficient only for this local contract-level witness; it is not claimed as productive foreign availability.

## 14a. Authority Consumption Proof

```text
PROOF_ID = ACP-EXEC-01
AUTHORITY_EXISTENCE = YES; ADR-0003/O-016 and EXEC-ENVELOPE-001/002
TRUTH_OWNER = SPEC-EXEC-001 / EXEC-001
CONSUMER_CONTRACT = identifiable envelope and payload schemas
LOCAL_TESTABILITY = YES
PRODUCTIVE_AVAILABILITY = NO for the unit-owned fixture; no external producer is required
DEPENDENCY_CLASS = INFORMATIONAL
AVAILABILITY_EVIDENCE = direct unit contract harness at execution point
BLOCKING_EFFECT = NONE
CAPABILITY_SUMMARY_STATUS = CONTRACT_TESTABLE_LOCALLY
RESULT = AUTHORITY_CONSUMPTION_GAP for productive availability; local fixture proves contract semantics only
```

## 14b. Producer / Consumer Contract Proof

| Field | Proof |
|---|---|
| `CAPABILITY_ID` | `UNIT-EXEC-SCHEMA-HARNESS` |
| `AUTHORITY_OWNER` | `SPEC-EXEC-001` |
| `PRODUCER` | ticket-owned schema validation boundary |
| `PRODUCED_CONTRACT` | identifiable common envelope and capability payload validation result |
| `CONSUMER` | EXEC failure/verdict and registry units; downstream mappings |
| `CONSUMED_CAPABILITY` | structured validated envelope/payload |
| `SEMANTIC_STATUS` | DEFINED |
| `AUTHORITY_STATUS / CONTRACT_STATUS` | DEFINED / DEFINED |
| `LOCAL_TESTABILITY / PRODUCTIVE_AVAILABILITY` | YES / NO (fixture is not a producer) |
| `AVAILABILITY_EVIDENCE` | local positive/negative schema operations |
| `AVAILABILITY_CONDITION` | unit harness available at local closure |
| `DEPENDENCY_CLASS / EDGE` | INFORMATIONAL / TICKET-001 → local consumers |
| `PROOF_EVIDENCE` | C-EXEC-001/002 witness files |

`AVAILABILITY_CONDITION = unit-owned schema harness is executable at local closure`; `BLOCKING_EFFECT = NONE`; `DEPENDENCY_EDGE = local contract → EXEC consumers`.

`PCP_CANONICAL_FIELDS = AUTHORITY_OWNER, PRODUCER, PRODUCED_CONTRACT, CONSUMER, CONSUMED_CAPABILITY, SEMANTIC_STATUS, LOCAL_TESTABILITY, PRODUCTIVE_AVAILABILITY, AVAILABILITY_EVIDENCE, AVAILABILITY_CONDITION, DEPENDENCY_CLASS, DEPENDENCY_EDGE, BLOCKING_EFFECT`; the local schema record above is complete.

`PCP_CANONICAL_FIELDS` are complete above.

## 14c. ACCEPTANCE_WITNESS_MATRIX

| NORMATIVE_BEHAVIOR | NORMATIVE_VERB | CONCRETE_OPERATION_COMMAND_OR_QUERY | STATE_OR_TRANSITION_AFFECTED | DIRECT_POSITIVE_TEST | DIRECT_NEGATIVE_OR_ISOLATION_TEST | EXPECTED_EVIDENCE_FILE | ACCEPTANCE_OWNER | REQUIRED_PRODUCER_OR_CAPABILITY | AUTHORITY_STATUS | CONTRACT_STATUS | LOCAL_TESTABILITY | PRODUCTIVE_AVAILABILITY | DEPENDENCY_CLASS | WITNESS_EXECUTABLE_AT_LOCAL_CLOSURE | EVIDENCE_TYPE |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Envelope and payload are schema-validatable | validate | C-EXEC-001 / AC-EXEC-001 | result contract | valid pair accepted | text-only/invalid schema rejected | `docs/tickets/SPEC-EXEC-001/evidence/TICKET-001/AC-EXEC-001-envelope-schema.md` | EXEC-001-TICKET-001 | UNIT-EXEC-SCHEMA-HARNESS | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |
| Minimum structured fields are required | reject | C-EXEC-002 / AC-EXEC-002 | result contract | complete fields accepted | missing field → `CONTRACT_INVALID`; no success/effect | `docs/tickets/SPEC-EXEC-001/evidence/TICKET-001/AC-EXEC-002-required-fields.md` | EXEC-001-TICKET-001 | UNIT-EXEC-SCHEMA-HARNESS | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |
| Valid input is consumed as structured contract | consume | schema validation boundary | contract result | structured fields returned | human text cannot supply omitted authority | `docs/tickets/SPEC-EXEC-001/evidence/TICKET-001/AC-EXEC-001-structured-consumption.md` | EXEC-001-TICKET-001 | UNIT-EXEC-SCHEMA-HARNESS | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |
| Invalid contract fails closed | reject | invalid envelope/payload operation | processing result | valid result remains consumable | no approval, checkpoint or effect on rejection | `docs/tickets/SPEC-EXEC-001/evidence/TICKET-001/AC-EXEC-002-fail-closed.md` | EXEC-001-TICKET-001 | UNIT-EXEC-SCHEMA-HARNESS | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |

## 15. Implementation Constraints

Preserve structured minimum fields, identifiable schemas, fail-closed semantics and non-authority of text. Do not select a schema library, module layout, transport or physical representation.

## 16. Acceptance Criteria

1. Valid envelope and payload both pass registered identifiable schemas; text alone is never authoritative.
2. Missing minimum structured fields are rejected as `CONTRACT_INVALID` with no success, approval, checkpoint or effect.

Both are `TESTABLE: YES` and `LOCALLY_PROVABLE: YES`.

## 17. Acceptance / Proof Role

`CONTRIBUTOR: YES` to downstream integrated contract checkpoints. `LOCAL_ACCEPTANCE_OWNER: YES`; `FINAL_PROOF_OWNER: YES` for AC-EXEC-001 and AC-EXEC-002.

## 18. Required Tests

Unit/domain: valid schema pair, invalid schema, text-only, missing-field and no-effect assertions. Conformance/regression: existing generic delegation consumer remains unable to treat text as authority.

## 19. Completion Evidence

Evidence files `docs/tickets/SPEC-EXEC-001/evidence/TICKET-001/AC-EXEC-001-envelope-schema.md` and `docs/tickets/SPEC-EXEC-001/evidence/TICKET-001/AC-EXEC-002-required-fields.md`, containing schema-identifiable validation output, negative no-success/no-effect assertions and test execution output. Evidence is locally producible.

## 20. Completion Gate

```text
COMPLETION_GATE:
  production_code: REQUIRED
  automated_tests: REQUIRED
  local_completion_evidence: REQUIRED
  integration_evidence: REQUIRED_AS_CONTRACT_CONTRIBUTION
  legacy_transition_evidence: NOT_APPLICABLE
  conformance_evidence: REQUIRED
```

## 21. Legacy / Cutover Impact

`NEW_CANONICAL_PATH`; prototype/historical formats remain non-authoritative and are not silently converted.

## 22. Risks

Text fallback, omitted schema identity or prototype shape becoming authority. Mitigation: direct positive/negative schema witnesses and architecture guard.

## 23. Implementation Wave

`WAVE: 1`.

## 24. Parallelization

`SAFE`.

## 25. Handoff After Completion

Independent ticket audit may validate this ticket. Completion releases TICKET-002; later tickets consume this contract only through their declared dependencies.

## 26. Ticket Local Closure

`TICKET_LOCAL_CLOSURE = YES`. All local witnesses and completion evidence run at this ticket's closure point; no downstream behavior is required.

## 27. Implementation Execution Record

```text
STATUS_TRANSITIONS = READY → IN_PROGRESS → IMPLEMENTED → VALIDATION_REQUIRED
FINAL_STATUS = VALIDATION_REQUIRED
IMPLEMENTATION_STRUCTURAL_SELF_CHECK = PASS
DOMAIN_MODEL_CONFORMANT = YES
AGGREGATE_BOUNDARY_VIOLATIONS = 0
DOMAIN_INVARIANT_BYPASSES = 0
UNENFORCED_INVARIANTS = 0
INVARIANT_PLACEMENT_DEVIATIONS = 0
ANEMIC_DOMAIN_MODEL_INTRODUCED = NO
COMPONENT_BOUNDARIES_CONFORMANT = YES
SOLID_CONFORMANT = YES
DEPENDENCY_DIRECTION_CONFORMANT = YES
CLEAN_CODE_STRUCTURALLY_ACCEPTABLE = YES
CROSS_SPEC_BOUNDARY_CONFORMANT = YES
CRITICAL_INVARIANTS_WITH_TESTS = ALL
REQUIRED_TEST_SURFACES_IMPLEMENTED = YES
TESTABILITY_REGRESSIONS = 0
UNJUSTIFIED_COMPONENT_COLLAPSES = 0
UNPLANNED_STRUCTURAL_COMPONENTS = 0
MISSING_REQUIRED_COMPONENTS = 0
UNJUSTIFIED_SOLID_VIOLATIONS = 0
DEPENDENCY_DIRECTION_VIOLATIONS = 0
INFRASTRUCTURE_LEAKAGE_POINTS = 0
DOMAIN_RULE_DUPLICATION = 0
```

### Changed files

- `src/domain/exec-contract.ts`
- `src/domain/exec-schema.ts`
- `src/domain/exec-validation-authority.ts`
- `src/domain/exec-validation-authority-internal.ts`
- `src/application/exec-contract.ts`
- `src/infrastructure/exec-schema-validator.ts`
- `src/composition/exec-contract.ts`
- `tests/exec-001-ticket-001.test.ts`
- `docs/tickets/SPEC-EXEC-001/evidence/TICKET-001/AC-EXEC-001-envelope-schema.md`
- `docs/tickets/SPEC-EXEC-001/evidence/TICKET-001/AC-EXEC-001-structured-consumption.md`
- `docs/tickets/SPEC-EXEC-001/evidence/TICKET-001/AC-EXEC-002-required-fields.md`
- `docs/tickets/SPEC-EXEC-001/evidence/TICKET-001/AC-EXEC-002-fail-closed.md`

### Acceptance and completion evidence

```text
AC-EXEC-001 = SATISFIED
AC-EXEC-002 = SATISFIED
production_code = PRESENT
automated_tests = PRESENT
local_completion_evidence = PRESENT
integration_evidence = PRESENT_AS_CONTRACT_CONTRIBUTION
legacy_transition_evidence = NOT_APPLICABLE
conformance_evidence = PRESENT
```

### Test execution

```text
FOCUSED_TICKET_TEST = PASS (17/17; node --experimental-strip-types --test tests/exec-001-ticket-001.test.ts)
REPOSITORY_REGRESSION = PASS (npm test, 23/23; generic workflow-orchestrator suite only)
FOCUSED_SOURCE_TYPECHECK = PASS (explicit strict tsc includes tests/exec-001-ticket-001.test.ts and all seven touched production files)
PACKAGE_TYPECHECK = PASS (npm run typecheck; scope is .pi/extensions/**/*.ts and does not include this ticket source)
TESTS_RUN = 40
TESTS_PASSED = 40
TESTS_FAILED = 0
TESTS_SKIPPED = 0
ENVIRONMENTAL_FAILURES = 0
```

No design deviation was required. Independent validation remains the next gate; this ticket is not `DONE`.
