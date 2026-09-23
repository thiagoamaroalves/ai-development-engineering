# EXEC-001-TICKET-002 — Version, registry, catalogs and capability extensibility

## 1. Status

`STATUS: VALIDATION_REQUIRED`

```text
ISSUE_DECOMPOSITION_READINESS: ISSUE_READY
INITIAL_DAG_STATE: BLOCKED
EXECUTION_READY: FALSE
BLOCKED_BY: NONE
DEPENDS_ON: EXEC-001-TICKET-001
UNBLOCKS: EXEC-001-TICKET-003, EXEC-001-TICKET-004, EXEC-001-TICKET-005, EXEC-001-TICKET-006
```

## 2. Source Traceability

ADR `ADR-0003` revision 3 accepted; Portfolio `O-017`, `O-020`; SPEC requirements `EXEC-VERSION-001/002`, `EXEC-REGISTRY-001/002/003`, `EXEC-CAPABILITY-001/002`; Gap Matrix `GAP-004`, `GAP-006`, `GAP-008`, `GAP-009`, `GAP-010`, `GAP-011`; Plan `EXEC-IMP-02`; Plan Audit `IMPLEMENTATION_PLAN_CONFORMANT`. Canonical paths: `docs/specs/SPEC-PORTFOLIO-001-organization.md`, `docs/specs/SPEC-EXEC-001-skill-contracts-and-capability-registry.md`, `docs/specs/gap-matrices/SPEC-EXEC-001-implementation-gap-matrix.md`, `docs/specs/gap-matrices/audits/SPEC-EXEC-001-implementation-gap-matrix-audit.md`, `docs/specs/implementation-plans/SPEC-EXEC-001-implementation-plan.md`, `docs/specs/implementation-plans/audits/SPEC-EXEC-001-implementation-plan-audit.md`.

## 3. Authority / Scope

`SPEC-EXEC-001 / EXEC-001 / CANONICAL_OWNER` owns semver meaning, supported-set resolution, deterministic registry mapping, catalog separation, bootstrap allowlist, canonical unknown/incompatible outcomes and common registry extensibility. DOM identity and REPO enablement remain foreign.

## 4. Portfolio Obligation Coverage

`O-017` and `O-020`, approved role `CANONICAL_OWNER`.

## 5. Gap / Requirement / Acceptance Coverage

`GAP-004/006/008/009/010/011`; requirements `EXEC-VERSION-001/002`, `EXEC-REGISTRY-001/002/003`, `EXEC-CAPABILITY-001/002`; ACs `AC-EXEC-003`, `004`, `008`, `009`, `010`, `011`, `012`; contributor to `AC-EXEC-005` and `AC-EXEC-007`; final proof owner: this ticket.

## 6. Implementation Unit

`EXEC-IMP-02 — Version, registry resolution, catalogs and capability extensibility`; 1:1 mapping, no split/merge.

## 7. Goal

Make version compatibility and deterministic frozen-basis registry/catalog resolution locally true, with independent NORMAL/BOOTSTRAP scope and registry-only extensibility.

## 8. Validated Implementation Delta

`OBSERVED`: no productive semver authority, registry/catalog resolver, bootstrap allowlist or extensibility path. `REQUIRED`: explicit support sets, deterministic mapping, independent catalogs and canonical outcomes. `DELTA`: EXEC registry authority is absent.

## 9. Required Behavior

1. Classify semver and resolve only explicit supported sets; unsupported versions yield `INCOMPATIBLE_CAPABILITY` without alias/conversion.
2. Resolve a complete registered entry deterministically for the frozen basis.
3. Keep NORMAL repository-scoped and BOOTSTRAP system-scoped; reject normal capability in bootstrap before work.
4. Preserve distinct unknown/incompatible outcomes and register a synthetic schema-valid capability without mutating a frozen basis.

## 10. Does Not Implement

DOM `RepositoryId` or lifecycle; REPO configuration/enablement; session/scheduler; physical persistence/recovery; effects; transport/UI/OPS mappings.

## 11. Repository Evidence

No productive registry, catalog or semver resolver exists. Prototype catalogs and generic delegation are non-authoritative. DOM and REPO are integration seams only.

## 12. Expected Repository Impact

Production: version/registry/catalog boundary. Persistence/schema: catalog basis seam, technology unfrozen. Integration: DOM identity and REPO NORMAL source. Tests: semver, support set, deterministic map, duplicate/conflict, catalog isolation, allowlist, unknown/incompatible and synthetic registration. Legacy/cutover: `NEW_CANONICAL_PATH`, `CUTOVER`, `LEGACY_COMPATIBILITY` consumer boundary. Generated contracts: registry entry/result schemas.

## 13. Dependencies

Internal: TICKET-001. Cross-SPEC capabilities `DOM-EXEC-IDENTITY-SNAPSHOT` and `REPO-EXEC-NORMAL-CATALOG` are `REQUIRED_FOR_INTEGRATED_PROOF`, not local blockers. `UNBLOCKS` as listed in §1.

## 14. Blocking Conditions

Blocked solely by unresolved internal prerequisite TICKET-001. No unavailable integrated-only capability is converted into a local blocker.

## 14a. Authority Consumption Proof

```text
PROOF_ID = ACP-EXEC-02
AUTHORITY_EXISTENCE = YES; ADR-0003/O-017/O-020 and EXEC requirements
TRUTH_OWNER = EXEC-001
CONSUMER_CONTRACT = frozen-basis registry/version/catalog contract
LOCAL_TESTABILITY = YES via deterministic registry fixture
PRODUCTIVE_AVAILABILITY = NO for DOM/REPO producers; integrated-only
DEPENDENCY_CLASS = REQUIRED_FOR_INTEGRATED_PROOF for foreign capabilities
AVAILABILITY_EVIDENCE = conformant contracts, no productive foreign producer at pinned HEAD
BLOCKING_EFFECT = integrated proof only; current local blocker is TICKET-001
CAPABILITY_SUMMARY_STATUS = CONTRACT_TESTABLE_LOCALLY for the local fixture; foreign capabilities remain CONTRACT_DEFINED
RESULT = AUTHORITY_CONSUMPTION_GAP for unavailable productive DOM/REPO producers; local fixture proves contract semantics only
```

## 14b. Producer / Consumer Contract Proof

| Capability | Authority owner | Producer | Produced contract | Consumer | Semantic | Authority/contract | Local/productive | Evidence | Class / edge |
|---|---|---|---|---|---|---|---|---|---|
| DOM-EXEC-IDENTITY-SNAPSHOT | SPEC-DOM-001 | DOM canonical resolver | RepositoryId and execution basis | T002 | DEFINED | DEFINED/DEFINED | NO/NO | DOM rev4/audit; no runtime | REQUIRED_FOR_INTEGRATED_PROOF / EXEC→DOM |
| REPO-EXEC-NORMAL-CATALOG | SPEC-REPO-001 | enabled REPO configuration | repository-scoped NORMAL catalog material | T002 | DEFINED | DEFINED/DEFINED | NO/NO | approved boundary; no producer | REQUIRED_FOR_INTEGRATED_PROOF / REPO→EXEC |
| UNIT-EXEC-REGISTRY-FIXTURE | EXEC-001 | local contract fixture | deterministic entry/version result | T002 | DEFINED | DEFINED/DEFINED | YES/NO | direct local tests | INFORMATIONAL / local |

Failure/not-found/stale semantics: unknown capability → `UNKNOWN_CAPABILITY`; known incompatible basis/version/schema/role → `INCOMPATIBLE_CAPABILITY`; corrupt/duplicate/conflicting material → `CONTRACT_INVALID`; no mutation. Version/revision transport preserves SemanticVersion and CatalogRevision exactly. `AVAILABILITY_CONDITION = productive DOM/REPO producers are required only at integrated proof`; `BLOCKING_EFFECT = integrated proof only`; `DEPENDENCY_EDGE = EXEC consumer → approved DOM/REPO producers`.

`PCP_CANONICAL_FIELDS = AUTHORITY_OWNER, PRODUCER, PRODUCED_CONTRACT, CONSUMER, CONSUMED_CAPABILITY, SEMANTIC_STATUS, LOCAL_TESTABILITY, PRODUCTIVE_AVAILABILITY, AVAILABILITY_EVIDENCE, AVAILABILITY_CONDITION, DEPENDENCY_CLASS, DEPENDENCY_EDGE, BLOCKING_EFFECT`; all fields are reconciled above for each capability.

## 14c. ACCEPTANCE_WITNESS_MATRIX

| NORMATIVE_BEHAVIOR | NORMATIVE_VERB | CONCRETE_OPERATION_COMMAND_OR_QUERY | STATE_OR_TRANSITION_AFFECTED | DIRECT_POSITIVE_TEST | DIRECT_NEGATIVE_OR_ISOLATION_TEST | EXPECTED_EVIDENCE_FILE | ACCEPTANCE_OWNER | REQUIRED_PRODUCER_OR_CAPABILITY | AUTHORITY_STATUS | CONTRACT_STATUS | LOCAL_TESTABILITY | PRODUCTIVE_AVAILABILITY | DEPENDENCY_CLASS | WITNESS_EXECUTABLE_AT_LOCAL_CLOSURE | EVIDENCE_TYPE |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Semver semantics | classify/resolve | C-EXEC-003/004 | registry basis | compatible minor/patch resolves | unsupported major → `INCOMPATIBLE_CAPABILITY` | `docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/AC-EXEC-003-semver.md` | EXEC-001-TICKET-002 | local registry fixture | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |
| Deterministic mapping | resolve | C-EXEC-004/008 | entry set | complete stage/capability entry returned | duplicate/conflict/incomplete entry rejected | `docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/AC-EXEC-008-deterministic-resolution.md` | EXEC-001-TICKET-002 | local registry fixture | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |
| Catalog isolation | isolate | C-EXEC-005/009 | NORMAL/BOOTSTRAP basis | independent bases resolve | cross-scope mutation/substitution rejected | `docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/AC-EXEC-009-catalog-isolation.md` | EXEC-001-TICKET-002 | local catalog fixture | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |
| Bootstrap allowlist | reject | C-EXEC-010/011 | bootstrap request | allowlisted onboarding resolves | normal capability → `INCOMPATIBLE_CAPABILITY` before work | `docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/AC-EXEC-010-bootstrap-allowlist.md` | EXEC-001-TICKET-002 | local catalog fixture | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |
| Capability extensibility | register/resolve | C-EXEC-006/012 | capability basis | synthetic schema-valid capability resolves | category-specific bypass or frozen-basis mutation rejected | `docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/AC-EXEC-012-registry-extensibility.md` | EXEC-001-TICKET-002 | local registry fixture | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |
| Unknown/incompatible distinction | resolve/reject | C-EXEC-010/011 | resolution result | known compatible entry resolves | unknown and incompatible retain distinct canonical codes | `docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/AC-EXEC-011-failure-distinction.md` | EXEC-001-TICKET-002 | local registry fixture | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |

## 15. Implementation Constraints

Preserve explicit support sets, semver meaning, complete scoped resolution, independent catalog authorities, bootstrap allowlist, immutable frozen bases and canonical failure codes. Do not choose storage or resolver technology.

## 16. Acceptance Criteria

1. `AC-EXEC-003`: semver major/minor/patch meaning is observable for compatible and incompatible cases.
2. `AC-EXEC-004`: unsupported capability version yields `INCOMPATIBLE_CAPABILITY` without alias or conversion.
3. `AC-EXEC-008`: a registered stage resolves deterministically to its complete entry.
4. `AC-EXEC-009`: NORMAL and BOOTSTRAP catalogs retain independent source/version authority.
5. `AC-EXEC-010`: a normal capability requested in bootstrap yields `INCOMPATIBLE_CAPABILITY` before work.
6. `AC-EXEC-011`: unknown and incompatible capabilities retain distinct canonical codes.
7. `AC-EXEC-012`: a schema-valid synthetic capability uses the common registry without mutating frozen bases.

All are `TESTABLE: YES`, `LOCALLY_PROVABLE: YES` after TICKET-001.

## 17. Acceptance / Proof Role

`CONTRIBUTOR: YES` to AC-EXEC-005 and AC-EXEC-007. `LOCAL_ACCEPTANCE_OWNER: YES`; `FINAL_PROOF_OWNER: YES` for AC-EXEC-003, 004, 008, 009, 010, 011 and 012. Contributes registry evidence to CP-EXEC-01.

## 18. Required Tests

Direct semver/support-set, mapping, duplicate/conflict, NORMAL/BOOTSTRAP isolation, bootstrap allowlist, unknown/incompatible and synthetic registry tests; frozen-basis no-mutation and regression tests.

## 19. Completion Evidence

Evidence files under `docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/` for AC-EXEC-003, AC-EXEC-008, AC-EXEC-009, AC-EXEC-010, AC-EXEC-011 and AC-EXEC-012, containing canonical result assertions, no-mutation evidence and executed test output. Locally producible after TICKET-001.

## 20. Completion Gate

```text
COMPLETION_GATE:
  production_code: REQUIRED
  automated_tests: REQUIRED
  local_completion_evidence: REQUIRED
  integration_evidence: REQUIRED_AS_CONTRACT_CONTRIBUTION
  legacy_transition_evidence: REQUIRED_FOR_LOCAL_SCOPE
  conformance_evidence: REQUIRED
```

## 21. Legacy / Cutover Impact

`NEW_CANONICAL_PATH`; `CUTOVER` creates a new semantic/catalog basis; `LEGACY_COMPATIBILITY` remains REPO-owned. No silent conversion or legacy registry write.

## 22. Risks

Version approximation, catalog authority collapse, bootstrap leakage, fallback unknown handling and frozen-basis mutation. Negative witnesses mitigate each risk.

## 23. Implementation Wave

`WAVE: 2`.

## 24. Parallelization

`SAFE_WITH_COORDINATION` after TICKET-001; shared registry/schema surfaces require coordination.

## 25. Handoff After Completion

Independent ticket audit validates this ticket; completion releases TICKET-003, TICKET-004, TICKET-005 and TICKET-006 while preserving integrated-only cross-SPEC handoffs.

## 26. Ticket Local Closure

`TICKET_LOCAL_CLOSURE = YES`; all local registry/version/catalog witnesses and evidence are executable after TICKET-001. Foreign producers remain integrated proof owners.

## 27. Implementation Execution Record

```text
IMPLEMENTATION_STATUS = IMPLEMENTED
IMPLEMENTATION_UNIT = EXEC-IMP-02
IMPLEMENTATION_HEAD = 8f62b283b1dbf487911c7c459db95cadc25ff101 (pinned remediation baseline; uncommitted remediation working tree)
REMEDIATION_STATE = VALIDATION_REQUIRED; independent re-audit required
DESIGN_DEVIATIONS = NONE
IMPLEMENTATION_STRUCTURAL_SELF_CHECK = PASS
DOMAIN_MODEL_CONFORMANT = YES
AGGREGATE_BOUNDARIES_CONFORMANT = YES
INVARIANT_PLACEMENT_CONFORMANT = YES
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
AGGREGATE_BOUNDARY_VIOLATIONS = 0
DOMAIN_INVARIANT_BYPASSES = 0
UNENFORCED_INVARIANTS = 0
INVARIANT_PLACEMENT_DEVIATIONS = 0
ANEMIC_DOMAIN_MODEL_INTRODUCED = NO
FAT_APPLICATION_SERVICE_INTRODUCED = NO
FOREIGN_AUTHORITY_DUPLICATION = 0
GOD_COMPONENT_INTRODUCED = 0
DOMAIN_PRIMITIVE_OBSESSION_REGRESSIONS = 0
PREMATURE_ABSTRACTIONS = 0
OVERENGINEERING_FINDINGS = 0
```

### Changed implementation and evidence files

- `src/domain/exec-registry.ts`
- `src/application/exec-registry.ts`
- `src/application/exec-registry-ports.ts`
- `src/composition/exec-registry.ts`
- `tests/exec-001-ticket-002.test.ts`
- `tests/exec-registry-import-boundary-loader.mjs`
- `tests/fixtures/exec-registry-forbidden-import.mjs`
- `docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/AC-EXEC-003-semver.md`
- `docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/AC-EXEC-005-registry-contribution.md`
- `docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/AC-EXEC-007-registry-contribution.md`
- `docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/AC-EXEC-008-deterministic-resolution.md`
- `docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/AC-EXEC-009-catalog-isolation.md`
- `docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/AC-EXEC-010-bootstrap-allowlist.md`
- `docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/AC-EXEC-011-failure-distinction.md`
- `docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/AC-EXEC-012-registry-extensibility.md`

### Acceptance and test record

```text
AC-EXEC-003 = SATISFIED
AC-EXEC-004 = SATISFIED
AC-EXEC-008 = SATISFIED
AC-EXEC-009 = SATISFIED
AC-EXEC-010 = SATISFIED
AC-EXEC-011 = SATISFIED
AC-EXEC-012 = SATISFIED
AC-EXEC-005 = SATISFIED_AS_LOCAL_CONTRIBUTION; FINAL_PROOF_OWNER = TICKET-005
AC-EXEC-007 = SATISFIED_AS_LOCAL_CONTRIBUTION; FINAL_PROOF_OWNER = TICKET-004
TESTS_RUN = 71
TESTS_PASSED = 71
TESTS_FAILED = 0
TESTS_SKIPPED = 0
ENVIRONMENTAL_FAILURES = 0
FOCUSED_TICKET_TESTS = 23/23
TICKET-001_REGRESSION = 21/21
ROOT_REGRESSION = 71/71
TYPECHECK = PASS
GOVERNANCE_GUARD = PASS
SKILL_MIRROR_GUARD = PASS
```

### Completion evidence

```text
production_code = PRESENT
automated_tests = PRESENT
local_completion_evidence = PRESENT
integration_evidence = PRESENT_AS_CONTRACT_CONTRIBUTION
legacy_transition_evidence = PRESENT_FOR_LOCAL_SCOPE
conformance_evidence = PRESENT
REMAINING_BLOCKERS = IMA-CRITICAL-001 and IMA-MAJOR-011 integrated-proof handoffs; independent re-audit required
NEXT_STATUS = VALIDATION_REQUIRED
VALIDATION_GATE = INDEPENDENT_TICKET_AUDIT_REQUIRED
```
