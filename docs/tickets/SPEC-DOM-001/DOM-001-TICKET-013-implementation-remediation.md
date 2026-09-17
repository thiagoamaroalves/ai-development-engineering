# DOM-001-TICKET-013 — Implementation Remediation

## 1. Remediation Verdict

```text
TICKET_IMPLEMENTATION_REMEDIATION_COMPLETE
TICKET_GATE = READY_FOR_REAUDIT
FINAL_STATUS = VALIDATION_REQUIRED
```

All four canonical findings with `BLOCKS_TICKET_DONE = YES` were revalidated
and remediated. `IMA-INFO-001` remains open as an integrated-only downstream
handoff with `BLOCKS_TICKET_DONE = NO`; it was not resolved or promoted by this
remediation.

## 2. Ticket

```text
TICKET_ID = DOM-001-TICKET-013
TICKET_PATH = docs/tickets/SPEC-DOM-001/DOM-001-TICKET-013-command-authority-observation.md
TICKET_FOLDER = docs/tickets/SPEC-DOM-001
IMPLEMENTATION_UNIT = DOM-IMP-13
CAPABILITY = CAP-DOM-COMMAND-AUTHORITY-OBSERVATION
IMPLEMENTATION_DESIGN_PATH = docs/tickets/SPEC-DOM-001/DOM-001-TICKET-013-implementation-design.md
CANONICAL_AUDIT_PATH = docs/tickets/SPEC-DOM-001/DOM-001-TICKET-013-implementation-audit.md
AUDIT_ROUND = INITIAL_AUDIT
AUDIT_HEAD = 6b31bcee1591c8b2e6499a434950664077b2be01
```

The approved ticket, design, upstream authority, T005 policy, pipeline
mutation/CAS, persistence, and downstream capability classification were not
redesigned or promoted.

## 3. Baseline Validation

```text
REMEDIATION_START_HEAD = 6b31bcee1591c8b2e6499a434950664077b2be01
CURRENT_HEAD = 6b31bcee1591c8b2e6499a434950664077b2be01
BASELINE_DRIFT_STATUS = DRIFT_ASSESSED
REASSESSMENT_COMPLETE = YES
FINDINGS_ARE_ACTIONABLE = YES
BASELINE_REMEDIATION_READINESS = READY
AUDIT_BASIS_FINGERPRINT = 61691C40E7E9F7757F266686752CA0186BEC1EE3479ACA0B68FF87D4C5EF92EA
AUDIT_BASIS_STALE_AT_ENTRY = NO
```

The canonical reassessment proof was consumed before editing. It preserved the
accepted ADR/SPEC/Gap Matrix/Plan authority, `GAP-011`, `GAP-012`,
`DOM-CMD-001`, `T13-AC1..T13-AC5`, and `PCP-DOM-13→05`. The post-entry source
fingerprint necessarily differs because the authorized remediation changed the
implementation and tests; this is the expected remediation delta, not a stale
audit basis or authority change.

## 4. Canonical Findings Received

| Finding | Severity | Local effect | Entry classification | Result |
|---|---:|---|---|---|
| `IMA-MAJOR-001` | MAJOR | `BLOCKS_TICKET_DONE=YES` | CONFIRMED | VALIDATED_AND_REMEDIATED |
| `IMA-MAJOR-002` | MAJOR | `BLOCKS_TICKET_DONE=YES` | CONFIRMED | VALIDATED_AND_REMEDIATED |
| `IMA-MAJOR-003` | MAJOR | `BLOCKS_TICKET_DONE=YES` | CONFIRMED | VALIDATED_AND_REMEDIATED |
| `IMA-MAJOR-004` | MAJOR | `BLOCKS_TICKET_DONE=YES` | CONFIRMED | VALIDATED_AND_REMEDIATED |
| `IMA-INFO-001` | INFO | `BLOCKS_TICKET_DONE=NO`, integrated proof only | CONFIRMED / HANDOFF | OPEN, PRESERVED |

```text
CANONICAL_FINDINGS_RECEIVED = 5
BLOCKING_FINDINGS_RECEIVED = 4
FINDINGS_REMEDIATED = 4
FINDINGS_ALREADY_RESOLVED = 0
FINDINGS_REJECTED_BY_NEW_EVIDENCE = 0
FINDINGS_PARTIALLY_REMEDIATED = 0
FINDINGS_BLOCKED = 0
```

## 5. Root Cause Analysis

### RC-001 — Missing concrete productive source

```text
ROOT_CAUSE_ID = RC-001
ROOT_CAUSE_CATEGORY = CAPABILITY_AVAILABILITY / COMPONENT_BOUNDARY
CANONICAL_FINDINGS = IMA-MAJOR-001
AFFECTED_COMPONENTS = command-authority source, observation adapter, composition factory
AFFECTED_PATHS = src/domain/command.ts; src/application/command-authority.ts; src/application/composition.ts
AFFECTED_TESTS = T013 complete-observation and composition witnesses
DESIGN_BOUNDARIES_AFFECTED = productive source boundary and runtime composition only
INVARIANTS_AFFECTED = complete source facts, identity binding, fail-closed evidence
DEPENDENCY_BOUNDARIES_AFFECTED = T013 source-to-reader seam; T005 remains consumer
SYSTEMIC_PATTERN = YES
```

The implementation stopped at the interface and adapter seam. The affected
radius search found no second productive command-authority source or alternate
authority path in `src`; test readers remained test-only fixtures.

### RC-002 — Producer and consumer temporal witnesses were disconnected

```text
ROOT_CAUSE_ID = RC-002
ROOT_CAUSE_CATEGORY = TEMPORAL_AUTHORITY / TEST_COVERAGE
CANONICAL_FINDINGS = IMA-MAJOR-002
AFFECTED_COMPONENTS = state source, factory, T005 consumer path
AFFECTED_PATHS = src/application/command-authority.ts; src/application/composition.ts; tests/dom-001-ticket-013.test.ts
AFFECTED_TESTS = T013 factory-backed same-status freshness test; T005 regression suite
DESIGN_BOUNDARIES_AFFECTED = temporal reread handoff only
INVARIANTS_AFFECTED = changed freshness rejects before advance and preserves stage/revision
DEPENDENCY_BOUNDARIES_AFFECTED = T013 producer to T005 consumer
SYSTEMIC_PATTERN = YES
```

The existing producer and consumer proxy halves were both green, but no one
test connected the factory-created reader to same-status freshness rejection.

### RC-003 — Source lifecycle causes were collapsed into generic output tests

```text
ROOT_CAUSE_ID = RC-003
ROOT_CAUSE_CATEGORY = LIFECYCLE / TESTABILITY
CANONICAL_FINDINGS = IMA-MAJOR-003
AFFECTED_COMPONENTS = source lifecycle mapping and immutable observation evidence
AFFECTED_PATHS = src/domain/command.ts; src/application/command-authority.ts; tests/dom-001-ticket-013.test.ts
AFFECTED_TESTS = named proposed/superseded/revoked/invalidated cases and mutation attempts
DESIGN_BOUNDARIES_AFFECTED = source-facing lifecycle vocabulary; existing consumer status contract preserved
INVARIANTS_AFFECTED = fail-closed ineligibility and immutable output
DEPENDENCY_BOUNDARIES_AFFECTED = none beyond T013 source boundary
SYSTEMIC_PATTERN = NO
```

The source-facing lifecycle vocabulary was not represented directly, and the
test only exercised generic output combinations. The correction maps every
named non-eligible lifecycle state to existing `INELIGIBLE` semantics without
adding a new failure family or consumer rule.

### RC-004 — Architecture proof relied on source text inspection

```text
ROOT_CAUSE_ID = RC-004
ROOT_CAUSE_CATEGORY = ARCHITECTURE_GUARD / TEST_COVERAGE
CANONICAL_FINDINGS = IMA-MAJOR-004
AFFECTED_COMPONENTS = composition import graph and architecture witness
AFFECTED_PATHS = src/application/composition.ts -> src/application/command-authority.ts -> src/domain/*; tests/dom-001-ticket-013.test.ts
AFFECTED_TESTS = T13-AC5 architecture guard
DESIGN_BOUNDARIES_AFFECTED = productive graph exclusion and runtime registration evidence
INVARIANTS_AFFECTED = no test/prototype/infrastructure authority path; no alternate reader registration
DEPENDENCY_BOUNDARIES_AFFECTED = application-to-domain graph
SYSTEMIC_PATTERN = NO
```

The direct source-only assertions did not traverse imports. The correction adds
an executable graph walk rooted at the composition entry point and retains the
runtime conflicting-caller witness.

```text
ROOT_CAUSES_IDENTIFIED = 4
ROOT_CAUSES_CLOSED = 4
SYSTEMIC_ROOT_CAUSES = 2
ADDITIONAL_SAME_ROOT_MANIFESTATIONS_FIXED = 0
NEW_INDEPENDENT_DEFECTS_FOUND = 0
OUTSIDE_SCOPE_MANIFESTATIONS = 0
```

## 6. Affected Radius

The complete ticket-scoped radius was checked across source ports, application
handlers, composition, pipeline reads, test readers, lifecycle mappings,
failure/no-effect paths, identity binding, persistence/CAS calls, and
productive import guards.

| Manifestation checked | Classification | Action |
|---|---|---|
| No concrete source under `src` | Canonical finding | Fixed by `CanonicalCommandAuthorityStateSource` |
| Existing T005 test-only readers | Outside producer authority / regression surface | Preserved as fixtures; not registered in `src` |
| Same-status freshness through factory | Canonical finding | Added direct T013 witness; T005 policy unchanged |
| Generic lifecycle status tests | Canonical finding | Added named lifecycle state mapping and direct cases |
| Source-only composition scan | Canonical finding | Replaced with transitive productive graph guard |
| Identity, pipeline, policy, rejection, CAS, persistence, transport, or cross-SPEC paths | Already conformant / outside ticket ownership | Inspected and left unchanged |

No independent new defect, upstream readiness contradiction, foreign authority
change, or scope expansion was found.

## 7. Remediation Units

### RU-001 — Materialize the productive state source

```text
REMEDIATION_UNIT_ID = RU-001
ROOT_CAUSE_IDS = RC-001
CANONICAL_FINDINGS = IMA-MAJOR-001
BEHAVIOR_TO_CORRECT = complete source facts are available through a concrete non-test source
STRUCTURE_TO_CORRECT = source lifecycle mapping remains separate from observation composition and T005 policy
FILES_EXPECTED = src/domain/command.ts; src/application/command-authority.ts; src/application/composition.ts; tests/dom-001-ticket-013.test.ts
TESTS_REQUIRED = complete observation, identity/incomplete/mismatch negatives, factory composition
DESIGN_BOUNDARIES_TO_PRESERVE = T001 identity, T004 pipeline, T005 policy/CAS, read-only T013 producer
OWNERSHIP_CONSTRAINTS = DOM owns command-authority meaning; no ADR/pipeline/persistence owner introduced
DEPENDENCY_CONSTRAINTS = application consumes domain port; no test/prototype/infrastructure import
REGRESSION_RISKS = caller authority, partial source acceptance, alternate reader registration
COMPLETION_PROOF = T013 12/12, strict source typecheck, graph guard
```

### RU-002 — Connect factory reread to same-status freshness rejection

```text
REMEDIATION_UNIT_ID = RU-002
ROOT_CAUSE_IDS = RC-002
CANONICAL_FINDINGS = IMA-MAJOR-002
BEHAVIOR_TO_CORRECT = changed freshness token rejects before advance with exact failure and unchanged state
STRUCTURE_TO_CORRECT = no policy or commit responsibility moved from T005
FILES_EXPECTED = tests/dom-001-ticket-013.test.ts
TESTS_REQUIRED = factory-created handler with unchanged statuses and changed freshness
DESIGN_BOUNDARIES_TO_PRESERVE = T013 supplies observations; T005 owns detectDrift/no-effect/CAS
OWNERSHIP_CONSTRAINTS = no duplicate command policy
DEPENDENCY_CONSTRAINTS = producer/consumer handoff remains explicit
REGRESSION_RISKS = false acceptance, advance on drift, stage/revision mutation
COMPLETION_PROOF = direct T013 same-status test plus T005 13/13 regression
```

### RU-003 — Cover named lifecycle negatives and mutation attempts

```text
REMEDIATION_UNIT_ID = RU-003
ROOT_CAUSE_IDS = RC-003
CANONICAL_FINDINGS = IMA-MAJOR-003
BEHAVIOR_TO_CORRECT = proposed/superseded/revoked/invalidated map to INELIGIBLE; frozen values reject mutation
STRUCTURE_TO_CORRECT = source lifecycle vocabulary is explicit; existing output/failure meanings remain unchanged
FILES_EXPECTED = src/domain/command.ts; src/application/command-authority.ts; tests/dom-001-ticket-013.test.ts
TESTS_REQUIRED = four named lifecycle cases and Reflect.set mutation attempts
DESIGN_BOUNDARIES_TO_PRESERVE = no new domain policy or lifecycle transition
OWNERSHIP_CONSTRAINTS = T013 observes; T005 evaluates
DEPENDENCY_CONSTRAINTS = no fallback/default/source substitution
REGRESSION_RISKS = lifecycle upgrade to eligible/compatible, mutable evidence
COMPLETION_PROOF = T013 named-negative and frozen-boundary tests pass
```

### RU-004 — Replace source-only architecture guard

```text
REMEDIATION_UNIT_ID = RU-004
ROOT_CAUSE_IDS = RC-004
CANONICAL_FINDINGS = IMA-MAJOR-004
BEHAVIOR_TO_CORRECT = productive graph and runtime composition are executable witnesses
STRUCTURE_TO_CORRECT = traverse every relative productive import from composition root and reject forbidden paths
FILES_EXPECTED = tests/dom-001-ticket-013.test.ts
TESTS_REQUIRED = transitive graph resolution, source-root confinement, runtime factory witness
DESIGN_BOUNDARIES_TO_PRESERVE = approved application-to-domain dependency direction
OWNERSHIP_CONSTRAINTS = no alternate authority or foreign capability added
DEPENDENCY_CONSTRAINTS = no prototype/test/infrastructure imports
REGRESSION_RISKS = hidden transitive escape or caller-supplied reader
COMPLETION_PROOF = executable T13-AC5 guard pass and full 102/102 suite
```

## 8. Finding Closure

| Finding | Root cause | Remediation unit | Fixed files | Closure evidence | Classification |
|---|---|---|---|---|---|
| `IMA-MAJOR-001` | `RC-001` | `RU-001` | `src/domain/command.ts`, `src/application/command-authority.ts`, `src/application/composition.ts`, T013 tests | concrete source, factory wiring, complete direct observation, strict source typecheck | VALIDATED_AND_REMEDIATED |
| `IMA-MAJOR-002` | `RC-002` | `RU-002` | T013 tests | factory path rejects same-status freshness drift, zero advance, unchanged stage/revision | VALIDATED_AND_REMEDIATED |
| `IMA-MAJOR-003` | `RC-003` | `RU-003` | `src/domain/command.ts`, `src/application/command-authority.ts`, T013 tests | four named lifecycle negatives are INELIGIBLE; three frozen mutation attempts return false and values stay unchanged | VALIDATED_AND_REMEDIATED |
| `IMA-MAJOR-004` | `RC-004` | `RU-004` | T013 tests | transitive graph guard stays under `src`, resolves imports, excludes forbidden routes, and runtime factory witness passes | VALIDATED_AND_REMEDIATED |
| `IMA-INFO-001` | downstream sequencing | none | none | preserved plan/T005 handoff; no local source correction implied | OPEN_INTEGRATED_HANDOFF |

No finding is partially remediated, rejected by new evidence, or blocked.

## 9. Root Cause Closure

| Root cause | Removed | Radius checked | Known manifestations closed | Systemic test evidence | Structural boundary restored |
|---|---|---|---|---|---|
| `RC-001` | YES | YES | YES | PRESENT | YES |
| `RC-002` | YES | YES | YES | PRESENT | NOT_APPLICABLE |
| `RC-003` | YES | YES | YES | PRESENT | YES |
| `RC-004` | YES | YES | YES | PRESENT | YES |

```text
ROOT_CAUSE_REMOVED = YES for all four local root causes
AFFECTED_RADIUS_CHECKED = YES
KNOWN_MANIFESTATIONS_CLOSED = YES
```

## 10. Design Conformance Reconciliation

```text
DOMAIN_MODEL_CONFORMANT = YES
AGGREGATE_BOUNDARIES_CONFORMANT = YES
INVARIANT_PLACEMENT_CONFORMANT = YES
COMPONENT_BOUNDARIES_CONFORMANT = YES
SOLID_CONFORMANT = YES
DEPENDENCY_DIRECTION_CONFORMANT = YES
CLEAN_CODE_STRUCTURALLY_ACCEPTABLE = YES
CROSS_SPEC_BOUNDARY_CONFORMANT = YES
```

The source-facing lifecycle type is an input vocabulary only. Non-eligible
states map to the existing typed consumer evidence; no new command policy,
failure family, aggregate, lifecycle transition, persistence authority, or
foreign capability was introduced. T005 remains the sole policy, rejection,
no-effect, transition, and CAS consumer.

## 11. Files Changed

Production:

- `src/domain/command.ts` — source lifecycle vocabulary and complete source-state contract.
- `src/application/command-authority.ts` — concrete fail-closed state source and existing observation adapter.
- `src/application/composition.ts` — concrete source registration type at the runtime seam.

Tests:

- `tests/dom-001-ticket-013.test.ts` — concrete-source witnesses, named negatives, mutation attempts, same-status freshness, and transitive architecture guard.

Evidence:

- Four `docs/tickets/SPEC-DOM-001/evidence/TICKET-013/EV-DOM-IMP-13-*.md` records updated with current proof.
- This remediation artifact created.

No upstream ADR, SPEC, Gap Matrix, Plan, ticket scope, T005 implementation, or
capability-promotion record was changed.

## 12. Gap / Requirement / Acceptance Impact

```text
GAPS_PRESERVED = GAP-011,GAP-012
REQUIREMENTS_PRESERVED = DOM-CMD-001
ACCEPTANCE_CRITERIA_AFFECTED = T13-AC1,T13-AC2,T13-AC3,T13-AC4,T13-AC5
ACCEPTANCE_CRITERIA_SATISFIED = 5
ACCEPTANCE_CRITERIA_NOT_SATISFIED = 0
ACCEPTANCE_CRITERIA_BLOCKED = 0
```

The integrated `AC-DOM-011` / T005 productive-capability handoff remains open
under `IMA-INFO-001`; its dependency class and `BLOCKS_TICKET_DONE=NO` effect
are preserved.

## 13. Tests

| Proof surface | Command | Run | Passed | Failed | Skipped |
|---|---|---:|---:|---:|---:|
| T013 focused | `node prototype/node_modules/tsx/dist/cli.mjs --test tests/dom-001-ticket-013.test.ts` | 12 | 12 | 0 | 0 |
| T005 affected regression | `node prototype/node_modules/tsx/dist/cli.mjs --test tests/dom-001-ticket-005.test.ts` | 13 | 13 | 0 | 0 |
| Full relevant suite | `node prototype/node_modules/tsx/dist/cli.mjs --test tests/*.test.ts` | 102 | 102 | 0 | 0 |
| Strict source typecheck | `node prototype/node_modules/typescript/bin/tsc --noEmit --strict --target ES2022 --module NodeNext --moduleResolution NodeNext <all src/*.ts>` | PASS | PASS | 0 | 0 |

The all-source-and-test strict typecheck was attempted and remains an
environmental baseline failure: this repository has no `@types/node`, and the
existing test tree contains unrelated typing errors. It produced no new T013
production-source error and did not fail any executable test proof.

```text
TESTS_RUN = 102 unique runtime tests (12 focused and 13 affected subsets rerun) plus source typecheck
TESTS_PASSED = 102 unique runtime tests plus source typecheck
TESTS_FAILED = 0 runtime tests; all-test typecheck environmental failure only
TESTS_SKIPPED = 0
ENVIRONMENTAL_FAILURES = 1 known all-source-and-test typecheck baseline
```

## 14. Behavioral Regression Self-Check

```text
BEHAVIORAL_SELF_CHECK = PASS
NO_REMEDIATION_REGRESSION = YES
ANEMIC_DOMAIN_REGRESSION = NO
GOD_COMPONENT_REGRESSION = NO
FAT_SERVICE_REGRESSION = NO
DIP_REGRESSION = NO
DEPENDENCY_DIRECTION_REGRESSION = NO
INVARIANT_PLACEMENT_REGRESSION = NO
DOMAIN_RULE_DUPLICATION_REGRESSION = NO
TESTABILITY_REGRESSION = NO
CROSS_SPEC_BOUNDARY_REGRESSION = NO
KNOWN_BEHAVIORAL_REMEDIATION_REGRESSIONS = 0
```

The complete diff was checked for unauthorized status upgrades, fallback
authority, mutation, pipeline advance on rejected reread, and altered T005
failure semantics. None was found.

## 15. Structural Regression Self-Check

```text
STRUCTURAL_SELF_CHECK = PASS
AGGREGATE_BOUNDARY_VIOLATIONS = 0
DOMAIN_INVARIANT_BYPASSES = 0
UNENFORCED_INVARIANTS = 0
DOMAIN_RULE_DUPLICATION = 0
ANEMIC_DOMAIN_MODEL_INTRODUCED = NO
FAT_APPLICATION_SERVICE_INTRODUCED = NO
GOD_COMPONENTS_INTRODUCED = 0
UNJUSTIFIED_SOLID_VIOLATIONS = 0
DEPENDENCY_DIRECTION_VIOLATIONS = 0
INFRASTRUCTURE_LEAKAGE_POINTS = 0
KNOWN_STRUCTURAL_REMEDIATION_REGRESSIONS = 0
UNJUSTIFIED_COMPONENT_COLLAPSES = 0
MISSING_REQUIRED_COMPONENTS = 0
```

The concrete source is a narrow source adapter; the reader remains an
observation adapter; the composition root only wires dependencies. No new
generic utility, strategy, factory framework, domain service, or alternate
authority was introduced.

## 16. Ownership / Authority

```text
OWNERSHIP_ERRORS = 0
FOREIGN_CAPABILITY_DUPLICATION = 0
NEW_ALTERNATE_AUTHORITY = 0
IDENTITY_DRIFT = 0
HISTORY_REWRITE = 0
LEGACY_DUAL_WRITER = 0
```

The concrete source remains DOM-owned and read-only. T001 owns identity,
T004 owns pipeline state and mutation, T005 owns policy/rejection/CAS, and
PLAT/BACKEND remain downstream. `PRODUCTIVE_AVAILABILITY` is not promoted by
this artifact; the integrated capability-promotion record and fresh T005 audit
remain downstream work.

## 17. Completion Evidence

```text
PRODUCTION_CODE = PRESENT
AUTOMATED_TESTS = PRESENT
INTEGRATION_EVIDENCE = PRESENT
ARCHITECTURE_GUARD = PRESENT_AND_EXECUTED
STRICT_SOURCE_TYPECHECK = PASS
T013_FOCUSED = 12/12
T005_AFFECTED = 13/13
FULL_RELEVANT_SUITE = 102/102
COMPLETION_EVIDENCE_MISSING = 0
```

## 18. Remaining Blockers

`IMA-INFO-001` remains open only as the required integrated handoff:

```text
FINDING_ID = IMA-INFO-001
FINDING_STATUS = OPEN
BLOCKS_TICKET_DONE = NO
BLOCKS_INTEGRATED_PROOF = YES
PRIMARY_ROUTE = IMPLEMENTATION_PLAN_REVALIDATION
DOWNSTREAM_CHECKPOINT = T005 productive-reader promotion and fresh T005 audit
DOWNSTREAM_OWNER = DOM-IMP-05 / T005 with capability-handoff owner
```

This is not a local remediation blocker and is not marked resolved here.

## 19. Pre-Reaudit Self-Check

```text
ALL_LOCAL_TICKET_BLOCKING_FINDINGS_CLOSED = YES
ALL_ROOT_CAUSES_CLOSED = YES
AFFECTED_RADIUS_CHECKED = YES
REQUIRED_TESTS_PASS = YES
AFFECTED_ACCEPTANCE_CRITERIA_PASS = YES
NO_KNOWN_MATERIAL_BEHAVIOR_REGRESSION = YES
BEHAVIORAL_SELF_CHECK = PASS
STRUCTURAL_SELF_CHECK = PASS
STATUS = VALIDATION_REQUIRED
```

The self-check is not independent conformance. The mandatory next step is the
complete four-domain `audit-implemented-ticket` route against the post-
remediation implementation state.

## 20. Remediation Gate

```text
AUDIT_ROUND = INITIAL_AUDIT
CANONICAL_FINDINGS_RECEIVED = 5
BLOCKING_FINDINGS_RECEIVED = 4
FINDINGS_REMEDIATED = 4
ROOT_CAUSES_IDENTIFIED = 4
ROOT_CAUSES_CLOSED = 4
SYSTEMIC_ROOT_CAUSES = 2
REMEDIATION_UNITS = 4
CHANGED_PRODUCTION_FILES = 3
CHANGED_TEST_FILES = 1
TESTS_RUN = 102 unique runtime tests (12 focused and 13 affected subsets rerun) plus source typecheck
TESTS_PASSED = 102 unique runtime tests plus source typecheck
TESTS_FAILED = 0 runtime tests
STRUCTURAL_FINDINGS_REMEDIATED = 2
AGGREGATE_BOUNDARY_VIOLATIONS = 0
DOMAIN_INVARIANT_BYPASSES = 0
UNENFORCED_INVARIANTS = 0
DOMAIN_RULE_DUPLICATION = 0
ANEMIC_DOMAIN_MODEL_INTRODUCED = NO
FAT_APPLICATION_SERVICE_INTRODUCED = NO
GOD_COMPONENTS_INTRODUCED = 0
UNJUSTIFIED_SOLID_VIOLATIONS = 0
DEPENDENCY_DIRECTION_VIOLATIONS = 0
INFRASTRUCTURE_LEAKAGE_POINTS = 0
KNOWN_BEHAVIORAL_REMEDIATION_REGRESSIONS = 0
KNOWN_STRUCTURAL_REMEDIATION_REGRESSIONS = 0
OWNERSHIP_ERRORS = 0
FOREIGN_CAPABILITY_DUPLICATION = 0
COMPLETION_EVIDENCE_MISSING = 0
STATUS = VALIDATION_REQUIRED
GATE = READY_FOR_REAUDIT
NEXT_ACTION = audit-implemented-ticket
```
