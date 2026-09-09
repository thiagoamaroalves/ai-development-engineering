# SPEC-DOM-001 — Implementation Plan Remediation

## 1. Remediation Verdict

`COMPONENT_IMPLEMENTATION_PLAN_REMEDIATION_COMPLETE`

All three confirmed plan-local CIPA findings were remediated with minimal
changes. This artifact does not approve the Implementation Plan; the required
next gate is a fresh independent component Implementation Plan audit.

## 2. Remediation Mode

`WRITE_ALLOWED`, `AUDIT_DRIVEN`, `FINDING_DRIVEN`, `MINIMAL_CHANGE`,
`ADR_FIRST`, `PORTFOLIO_GOVERNED`, `SPEC_PRESERVING`,
`GAP_MATRIX_PRESERVING`, `OWNERSHIP_PRESERVING`, `DEPENDENCY_PRESERVING`,
`LOCAL_CLOSURE_AWARE`, `PROOF_OWNERSHIP_AWARE`, `DAG_AWARE`,
`ISSUE_DECOMPOSITION_AWARE`, `NO_ARCHITECTURE_INVENTION`,
`NO_SCOPE_EXPANSION`, `NO_IMPLEMENTATION`, `NO_TICKET_CREATION`.

## 3. Subject

| Item | Value |
|---|---|
| Specification | `SPEC-DOM-001` |
| Portfolio | `SPEC-PORTFOLIO-001`, revision 2 |
| Validated Gap Matrix | `docs/specs/gap-matrices/SPEC-DOM-001-implementation-gap-matrix.md` |
| Implementation Plan | `docs/specs/implementation-plans/SPEC-DOM-001-implementation-plan.md` |
| Source audit | `docs/specs/implementation-plans/audits/SPEC-DOM-001-implementation-plan-audit.md` |
| Source audit verdict | `IMPLEMENTATION_PLAN_REMEDIATION_REQUIRED` |
| Audit HEAD | `8c7860a915fa1906127bff0e799407a64568a035` |
| Remediation HEAD | `8c7860a915fa1906127bff0e799407a64568a035` (working-tree plan changes) |
| Remediation mode | Plan-only, finding-driven, no implementation changes |

## 4. Source Audit

The source audit is the independent `audit-component-implementation-plan`
report. It contains three active findings:

```text
CIPA-MAJOR-001
CIPA-MINOR-001
CIPA-MINOR-002
```

The source audit remains unchanged. Its SHA-256 is
`06be7cc3fdc341c44c367d242b855a28af295727547fbb091cc7da78ed488c9d`.

## 5. Baseline Validation

The portfolio, component SPEC, Gap Matrix and their independent audits remain
hash-stable and valid. DOM remains the approved portfolio DAG root, with no
upstream normative component dependency.

| Baseline | Result |
|---|---|
| Portfolio | revision 2; SHA-256 `c449388972279d8add520564a9614cfa236f87b6c8932a70d5bc2d28eef6be86` |
| Component SPEC | revision 2; SHA-256 `768937f1454fb63becd955780212468dbf4f2887a41eeebaad9a18d362716d98` |
| Gap Matrix | SHA-256 `e1bbbeaf31cb61d45befc428d79816175bd2aeb7c9faebed5be697234bdd7fed` |
| Repository baseline | `5318663b03b9d873261475dbd97702d77d2d3efc` |
| Repository drift | `NON_SEMANTIC_DOCUMENTARY_DRIFT` only |
| Plan before remediation | Untracked working-tree artifact; source-audit SHA recorded in section 4 |
| Plan after remediation | SHA-256 `3436f03c4786a52998ac6ea13c05f85a386bdd916bca33a9f984758cee7bc551` |
| Current HEAD | `8c7860a915fa1906127bff0e799407a64568a035` |

No authority or implementation drift requires escalation. The validated Gap
Matrix is not changed or reclassified.

## 6. Authority Context

Accepted ADRs remain authoritative for architecture; the approved portfolio
remains authoritative for ownership and normative direction; the conformant
component SPEC remains authoritative for behavior; and the validated Gap Matrix
remains authoritative for implementation delta. The source audit identifies
only defects in the plan translation.

The corrections preserve:

- DOM ownership of semantic invalidation in `DOM-IMP-10`;
- the existing `DOM-IMP-05 → DOM-IMP-08` implementation prerequisite already
  declared by the unit and closure matrix;
- the existing `DOM-IMP-06` prerequisite for `DOM-IMP-10`;
- all Gap IDs, classifications, requirements, obligations and acceptance IDs.

## 7. Finding Intake

| Finding | Severity | Units | Status before | Revalidation |
|---|---|---|---|---|
| `CIPA-MAJOR-001` | MAJOR | `DOM-IMP-08` | Active | CONFIRMED |
| `CIPA-MINOR-001` | MINOR | `DOM-IMP-03`, `DOM-IMP-10`, `DOM-IMP-11` | Active | CONFIRMED |
| `CIPA-MINOR-002` | MINOR | `DOM-IMP-10`, `CP-DOM-01`, `CP-DOM-02` | Active | CONFIRMED |

No finding was superseded, invalidated by drift, or blocked by an authority
change. `OUT_OF_SCOPE_FINDINGS_IGNORED = 0`.

## 8. Finding Remediation Ledger

| Finding | Root cause | Plan correction | Result |
|---|---|---|---|
| `CIPA-MAJOR-001` | DAG representation omitted a prerequisite that was present in the unit table | Added explicit `DOM-IMP-05 → DOM-IMP-08` to the additional-edge inventory | REMEDIATED |
| `CIPA-MINOR-001` | `DOM-IMP-03` boundary prose named `IMP-11` instead of the invalidation owner | Changed the reference to `IMP-10` | REMEDIATED |
| `CIPA-MINOR-002` | CP-DOM-01 claimed to unlock IMP-10 before IMP-06 | Removed IMP-10 from CP-DOM-01 unlocks and stated that IMP-10 remains gated on CP-DOM-02 | REMEDIATED |

## 9. Gap Coverage Changes

No Gap coverage changed. All 21 validated local Gaps remain fully covered by
the same 12 justified units:

```text
GAPS_WITHOUT_PLAN_COVERAGE = 0
VALIDATED_GAP_CLASSIFICATIONS_CHANGED = 0
VALIDATED_GAP_OWNERS_CHANGED = 0
```

## 10. Ownership / Dependency Changes

Portfolio ownership did not change. The internal boundary reference now agrees
with the already-authoritative plan allocation: `DOM-IMP-10` owns
`DOM-AUDIT-005`/`GAP-020` invalidation behavior; `DOM-IMP-11` owns exact
candidate evidence and drift binding.

One implementation dependency was made explicit in the rendered DAG:
`DOM-IMP-05 → DOM-IMP-08`. No normative portfolio dependency was added.

## 11. Unit Boundary Changes

No unit was added, removed, merged, split, or broadened.

```text
UNIT_BOUNDARY_CHANGES = 0
FALSE_UNIT_SPLITS = 0
FALSE_UNIT_MERGES = 0
```

## 12. Local Acceptance / Closure Changes

No Acceptance Criterion, Required Test, Completion Evidence, or
`LOCAL_CLOSURE` declaration required changing. All 12 units remain locally
closable, and all local criteria remain locally provable without downstream
behavior or unavailable foreign capability.

## 13. Issue Decomposition Readiness Changes

The boundary correction removes the ambiguity that caused the source audit to
overrate `DOM-IMP-03`. Its final declaration remains `ISSUE_READY`, now
consistent with its corrected scope.

```text
ISSUE_READY_BEFORE_INDEPENDENT_AUDIT = 11 confirmed / 1 overrated
ISSUE_READY_AFTER_REMEDIATION = 12
INTERNAL_ONLY = 0
PLAN_BLOCKED = 0
```

This does not change runtime readiness: only `DOM-IMP-01` is initially READY;
the other 11 units remain initially BLOCKED by known prerequisites.

## 14. Initial DAG State Changes

No initial DAG state changed. The unit-level states and blockers were already
correct; only the rendered DAG edge inventory was reconciled.

```text
INITIAL_READY_UNITS = 1
INITIAL_BLOCKED_UNITS = 11
INITIAL_DAG_STATE_ERRORS = 0
```

## 15. Acceptance / Final Proof Ownership Changes

No acceptance allocation or final proof owner changed. All 21 obligations still
have exactly one valid final proof owner. `AC-DOM-052` remains owned by
`DOM-IMP-12`, `AC-DOM-053` by `DOM-IMP-10`, and `AC-DOM-054` by `DOM-IMP-11`.

## 16. Test / Completion Evidence Changes

No test or completion-evidence allocation changed. The corrected DAG and
checkpoint metadata now consistently place evidence after required
prerequisites. Prototype tests remain non-productive evidence only.

## 17. Failure / Compatibility / Cutover Changes

No failure, compatibility, legacy, or cutover semantics changed. The
invalidation owner reference was corrected to match the existing DOM cutover
allocation; foreign adapter retirement, Git execution, PLAT persistence and
OPS/UI projections remain outside DOM ownership.

## 18. DAG / Wave / Checkpoint Changes

The DAG additional-edge inventory now includes:

```text
DOM-IMP-05 → DOM-IMP-08
```

The CP-DOM-01 unlock list now states that `IMP-10` remains gated on CP-DOM-02.
CP-DOM-02 remains the checkpoint that unlocks `IMP-10` and `IMP-11`; no wave
mode changed.

## 19. Traceability Reconciliation

No Gap → Plan or Acceptance → Plan row changed. The corrected text is
consistent with existing rows:

| Mapping | Result |
|---|---|
| `GAP-020 → DOM-IMP-10` | Preserved |
| `GAP-021 → DOM-IMP-11` | Preserved |
| `AC-DOM-053 → DOM-IMP-10` final proof | Preserved |
| `AC-DOM-054 → DOM-IMP-11` final proof | Preserved |
| `IMP-05 → IMP-08` prerequisite | Now represented in all dependency surfaces |

## 20. Metric Recalculation

```text
VALIDATED_GAPS = 21
LOCAL_IMPLEMENTATION_GAPS = 17
CROSS_SPEC_DEPENDENCIES = 7
PREEXISTING_FOREIGN_CAPABILITIES = 0
NO_LOCAL_WORK_GAPS = 0

IMPLEMENTATION_UNITS = 12
LOCALLY_CLOSABLE_UNITS = 12
NON_LOCALLY_CLOSABLE_UNITS = 0
ISSUE_DECOMPOSITION_READY_UNITS = 12
INTERNAL_ONLY_UNITS = 0
PLAN_BLOCKED_UNITS = 0
INITIAL_READY_UNITS = 1
INITIAL_BLOCKED_UNITS = 11

GAPS_WITH_PLAN_COVERAGE = 21
GAPS_WITHOUT_PLAN_COVERAGE = 0
UNITS_WITHOUT_GAP_OR_SUPPORTING_AUTHORITY = 0
FALSE_UNIT_SPLITS = 0
FALSE_UNIT_MERGES = 0

ACCEPTANCE_OBLIGATIONS = 21
ACCEPTANCE_WITH_FINAL_PROOF_OWNER = 21
UNRESOLVED_FINAL_PROOF_OWNERS = 0
LOCAL_AC_REQUIRING_DOWNSTREAM = 0
LOCAL_AC_CONTRADICTING_DOES_NOT_IMPLEMENT = 0
LOCAL_AC_REQUIRING_UNAVAILABLE_FOREIGN_CAPABILITY = 0

UNAPPROVED_NORMATIVE_DEPENDENCIES = 0
SPECIFICATION_GAPS = 0
ARCHITECTURE_GAPS = 0
PORTFOLIO_GAPS = 0
UPSTREAM_CONTRACT_GAPS = 0
DAG_CYCLE_DETECTED = NO
```

## 21. Upstream Escalations

None. No ADR, portfolio, component SPEC, upstream contract, or validated Gap
Matrix change was required.

## 22. Files Changed

| File | Change |
|---|---|
| `docs/specs/implementation-plans/SPEC-DOM-001-implementation-plan.md` | Corrected three plan-local metadata/scope statements |
| `docs/specs/implementation-plans/remediations/SPEC-DOM-001-implementation-plan-remediation.md` | Created this remediation record |

The source audit, ADRs, portfolio, SPECs, Gap Matrix, code, tests and tickets
were not modified.

## 23. Reaudit Readiness

```text
ADRS_CHANGED = NO
PORTFOLIO_CHANGED = NO
COMPONENT_SPEC_CHANGED = NO
UPSTREAM_SPECS_CHANGED = NO
GAP_MATRIX_CHANGED = NO
PRODUCTION_CODE_CHANGED = NO
TESTS_CHANGED = NO
TICKETS_CHANGED = NO
```

Final remediation gate:

```text
READY_FOR_INDEPENDENT_IMPLEMENTATION_PLAN_REAUDIT
```

The next action is a fresh `audit-component-implementation-plan` run. This
remediation record does not self-approve the plan or emit
`READY_FOR_ISSUE_DECOMPOSITION`.

