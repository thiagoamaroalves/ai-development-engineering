---
schema_version: "1.0.0"
id: SPEC-REPO-001-COMPONENT-SPEC-REMEDIATION
title: Component SPEC Remediation — Repository Onboarding and Legacy Migration
status: EVIDENCE
date: 2026-09-09
component: SPEC-REPO-001
source_audit: docs/specs/audits/SPEC-REPO-001-component-conformance-audit.md
source_verdict: FAIL — COMPONENT_SPEC_NON_CONFORMANT
result: COMPONENT_SPEC_REMEDIATION_COMPLETE
---

# SPEC-REPO-001 — Component SPEC Remediation

## 1. Remediation mode

`COMPONENT_SPEC_REMEDIATION_COMPLETE` under `AUDIT_DRIVEN`, `ADR_FIRST`, `PORTFOLIO_GOVERNED`,
`UPSTREAM_CONTRACT_PRESERVING`, `COMPONENT_SCOPED` and `MINIMAL_SCOPE` mode.
Only the audited target component SPEC and this narrow remediation evidence
artifact were changed. No authority source, upstream SPEC, audit report,
implementation artifact or planning artifact was changed.

## 2. Baseline

Baseline was captured before remediation:

- target: `docs/specs/SPEC-REPO-001-repository-onboarding-and-legacy-migration.md`;
- target revision/status: `revision 1 / PROPOSED`;
- source audit: `docs/specs/audits/SPEC-REPO-001-component-conformance-audit.md`;
- source audit timestamp: `2026-09-09T06:33:37-03:00`;
- repository HEAD: `8c7860a915fa1906127bff0e799407a64568a035`;
- pre-remediation target state: unchanged since the source audit;
- pre-existing worktree state: the target SPEC, source audit, `.codex/` and
  `docs/specs/implementation-plans/` were untracked; these were preserved.

No material authority drift was detected between the source audit and this
remediation. The source audit and all authority artifacts remained unchanged.

## 3. Source audit

The source audit is the latest independent audit of this target and has the
required verdict:

```text
FAIL — COMPONENT_SPEC_NON_CONFORMANT
READY_FOR_GAP_MATRIX: NO
```

Its validated finding set was:

| Finding | Severity | Finding summary |
|---|---|---|
| `CSC-MAJOR-001` | MAJOR | unauthorized externally visible onboarding lifecycle states |
| `CSC-MAJOR-002` | MAJOR | conditional `gh` validation weakened an ADR-required prerequisite |
| `CSC-MAJOR-003` | MAJOR | assignment/session semantics introduced an unapproved composition edge |
| `CSC-MAJOR-004` | MAJOR | owned failures lacked deterministic retry/recovery semantics |
| `CSC-MAJOR-005` | MAJOR | concurrent promotion behavior was unspecified |

## 4. Authority used

Remediation used the following authority, without changing it:

- accepted `ADR-0010-repository-configuration-and-legacy-migration.md`,
  including its decision, consequences, rejected alternatives and bootstrap
  sections;
- the approved `SPEC-PORTFOLIO-001` decomposition and its independent
  `PORTFOLIO_DECOMPOSITION_APPROVED` audit result;
- conformant upstream contracts `SPEC-DOM-001`, `SPEC-EXEC-001` and
  `SPEC-PLAT-001`, including their independent audit results;
- the source component conformance audit as the defect inventory and finding
  authority for this remediation.

The repository and prototype remained evidence for implementation-gap
classification only. No implementation behavior was inferred into the SPEC.

## 5. Findings ledger

| Finding | Before | Remediation | Authority | Local proof | Status |
|---|---|---|---|---|---|
| `CSC-MAJOR-001` | target permitted intermediate inspection/verification lifecycle states | `REPO-BOOTSTRAP-003`, `AC-REPO-009`, `C-REPO-003` and lifecycle event semantics now expose exactly the ADR lifecycle; inspection/verification is non-authoritative activity only | ADR-0010 bootstrap lifecycle; `DOM-LIFE-001` | exact lifecycle string, invalid-transition rule and lifecycle conformance test present in target | `REMEDIATED` |
| `CSC-MAJOR-002` | Git/`gh` validation was conditional on local policy | `REPO-VALIDATE-002`, `AC-REPO-004` and `C-REPO-009` now require Git and `gh` as onboarding prerequisites and fail closed on absence/incompatibility | ADR-0010 consequences and `O-056` | unconditional prerequisite language and negative test present in target | `REMEDIATED` |
| `CSC-MAJOR-003` | `REPO-MIGRATE-002` prescribed distinct assignment/session semantics without an approved REPO composition edge | requirement narrowed to separate activity identities and role provenance; upstream assignment/session semantics remain upstream-owned and no `EXEC-002` edge was added | ADR-0010 bootstrap; `O-057`; approved dependency set | no `EXEC-002`, no forbidden assignment/session requirement, dependency count remains three | `REMEDIATED` |
| `CSC-MAJOR-004` | the three REPO-owned failures shared vague recovery language | `REPO-FAILURE-001` now has a normative per-code matrix for trigger, state, retryability, recovery and evidence; `AC-REPO-015` and `C-REPO-023` cover it | ADR-0010 decision/bootstrap; `O-055/O-057/O-058` | all three owned codes have deterministic matrix rows and binary coverage | `REMEDIATED` |
| `CSC-MAJOR-005` | promotion atomicity did not define races, stale losers or duplicates | added ADR-backed `REPO-ENABLE-002` for serialized/idempotent promotion, plus `AC-REPO-016`, `C-REPO-024` and traceability | ADR-0010 bootstrap; `O-058`; PLAT effect/idempotency contract | candidate/basis comparison, stale rejection, duplicate confirmation and incomplete-effect behavior are explicit | `REMEDIATED` |

## 6. Files changed

Changed within the allowed write set:

- `docs/specs/SPEC-REPO-001-repository-onboarding-and-legacy-migration.md`;
- `docs/specs/remediations/SPEC-REPO-001-component-spec-remediation.md`.

Not changed: ADRs, the approved portfolio, portfolio registries, upstream
SPECs, source audit, Gap Matrices, Implementation Plans, tickets, production
code and tests. The source audit remains an independent historical record.

## 7. Owned obligation remediation

All five REPO-owned portfolio obligations remain owned by this component:
`O-055`, `O-056`, `O-057`, `O-058` and `O-059`.

Coverage remains complete: `O-055…O-059` are all represented by normative
requirements. The promotion concurrency correction is attached to `O-058`
and `ADR-0010` bootstrap authority; it does not create a new portfolio
obligation or alter ownership.

## 8. Upstream contract remediation

No consumed contract was redefined. `SPEC-DOM-001`, `SPEC-EXEC-001` and
`SPEC-PLAT-001` remain the three approved upstream edges. The migration
requirement now consumes only the applicable DOM audit and EXEC activity/
manifest contracts while leaving assignment/session semantics to their owner.
No dependency on `SPEC-EXEC-002` was introduced.

The new promotion requirement consumes PLAT effect/idempotency evidence and
DOM audit evidence; it does not create a second journal, idempotency authority,
reconciliation authority or audit state machine.

## 9. Requirement authority remediation

`REPO-VALIDATE-002` now directly reflects the ADR-0010 onboarding consequence
that Git and `gh`, paths, schemas, commands and publication policy are
validated prerequisites. `REPO-MIGRATE-002` no longer adds unsupported
assignment/session semantics. `REPO-ENABLE-002` is explicitly grounded in
`O-058`, ADR-0010 bootstrap authority and the consumed PLAT/DOM contracts.

The target traceability table was updated so all 15 requirements have a
portfolio obligation, accepted ADR section, ownership role, acceptance
criterion and conformance-test coverage.

## 10. Lifecycle/identity remediation

The externally authoritative lifecycle is now exactly:

```text
DISCOVERED → VALIDATING → MIGRATING → AUDITING ↔ REMEDIATING
           → READY_TO_ENABLE → ENABLED
```

Inspection and verification may be recorded as activity details but cannot be
canonical lifecycle states, enablement evidence or gate transitions. Invalid
skips and transitions are rejected. Candidate, repository and promotion-basis
identity remain correlated to the canonical `RepositoryId`; no competing
identity or state machine was introduced.

## 11. Failure/recovery remediation

`UNKNOWN_REPOSITORY`, `REPOSITORY_NOT_ENABLED` and
`LEGACY_COMPATIBILITY_ONLY` now each specify:

- the exact trigger;
- the canonical state after rejection;
- the permitted retry and recovery condition;
- the required correlated evidence and projection behavior.

The matrix preserves fail-closed behavior, leaves active configuration
unchanged on rejection and prevents duplicate/stale requests from becoming
success. PLAT remains the owner of physical effect retry, idempotency and
reconciliation mechanics; REPO owns only the onboarding-visible meaning.

## 12. Compatibility/cutover remediation

No ownership or cutover rule was changed. The target continues to require
explicit legacy migration/replay, a single new canonical configuration,
preserved historical basis/evidence and audited promotion before normal
processing. `REPO-CUTOVER-001` remains migration/replay-only for legacy input
and preserves retirement evidence.

## 13. Dependency remediation

The approved dependency set remains exactly:

```text
SPEC-DOM-001 → SPEC-REPO-001
SPEC-EXEC-001 → SPEC-REPO-001
SPEC-PLAT-001 → SPEC-REPO-001
```

The latent `SPEC-EXEC-002` composition edge was removed from the requirement
boundary rather than added to the portfolio. No cycle, downstream dependency,
direction violation or unapproved edge remains.

## 14. Projection boundary remediation

Projection ownership was reconfirmed rather than expanded. Lifecycle events,
candidate/effect evidence and status/history remain REPO-boundary semantics;
BACKEND, OPS and UI may request or display them but cannot promote, confirm or
mutate active configuration. Inspection/verification activity details cannot
be projected as canonical lifecycle states.

## 15. Acceptance/conformance remediation

Acceptance and conformance material was extended only where required to make
the five findings binary and auditable:

- `AC-REPO-009` and `C-REPO-003`: exact lifecycle and non-authoritative
  inspection/verification;
- `AC-REPO-004` and `C-REPO-009`: unconditional Git/`gh` prerequisites;
- `AC-REPO-006` and `C-REPO-011`: separate activity identity and role
  provenance without assignment/session redefinition;
- `AC-REPO-015` and `C-REPO-023`: per-code failure/recovery matrix;
- `AC-REPO-016` and `C-REPO-024`: serialized/idempotent promotion races.

The target now contains 16 acceptance criteria and 24 conformance tests for
15 normative requirements.

## 16. Traceability remediation

The traceability matrix was synchronized with the corrected requirement set.
In particular, `REPO-ENABLE-002` is mapped to `O-058`/ADR-0010 and its PLAT
and DOM consumption, while `REPO-FAILURE-001` maps both acceptance criteria
and all code-specific conformance coverage. No requirement is left without
portfolio or accepted ADR authority.

## 17. Gap classification remediation

This remediation does not create a Gap Matrix and does not classify new
implementation work. The target continues to report zero known specification
gaps and five known implementation gaps: production repository
configuration/registry, Git validation, bootstrap catalog/candidate runtime,
durable migration/promotion effects/recovery and production cutover history.
The prototype remains `PROTOTYPE_ONLY` evidence.

## 18. Implementation-plan leakage remediation

No implementation plan, ticket, technology choice, database schema, workspace
mechanism, concurrency primitive, retry algorithm or production implementation
was added. `REPO-ENABLE-002` specifies observable serialized/idempotent
behavior and evidence outcomes only; PLAT remains the physical mechanism
owner.

## 19. Mechanical validation

The remediated target was mechanically checked for exact requirement,
acceptance and conformance identifiers, authority/dependency references,
failure coverage and removal of the audited unsupported phrases.

```text
PORTFOLIO_OBLIGATIONS_OWNED = 5
PORTFOLIO_OBLIGATIONS_COVERED = 5
OWNED_OBLIGATIONS_UNCOVERED = 0
OWNED_OBLIGATIONS_PARTIAL = 0
NORMATIVE_REQUIREMENTS = 15
REQUIREMENTS_WITHOUT_AUTHORITY = 0
REQUIREMENTS_WITHOUT_PORTFOLIO_AUTHORITY = 0
REQUIREMENTS_WITHOUT_ADR_AUTHORITY = 0
CONSUMED_CONTRACTS = 7 contract groups
CONSUMED_CONTRACTS_REDEFINED = 0
UNTESTABLE_REQUIREMENTS = 0
ACCEPTANCE_GAPS = 0
NORMATIVE_DEPENDENCIES = 3
UNAPPROVED_DEPENDENCIES = 0
MISSING_REQUIRED_DEPENDENCIES = 0
DEPENDENCY_DIRECTION_VIOLATIONS = 0
FAILURE_OWNER_VIOLATIONS = 0
COMPATIBILITY_OWNER_VIOLATIONS = 0
ARCHITECTURE_GAPS = 0
PORTFOLIO_GAPS = 0
UPSTREAM_CONTRACT_GAPS = 0
IMPLEMENTATION_PLAN_LEAKS = 0
ACCEPTANCE_CRITERIA = 16
CONFORMANCE_TESTS = 24
REMEDIATED_FINDINGS = 5
PARTIAL_FINDINGS = 0
BLOCKED_FINDINGS = 0
```

## 20. Remaining blockers

No architecture, portfolio or upstream blocker remains for an independent
component SPEC re-audit. The target is not self-approved by this remediation;
the independent audit gate is still required before downstream Gap Matrix
work may begin.

## 21. Reaudit readiness

```text
READY_FOR_INDEPENDENT_COMPONENT_SPEC_REAUDIT
```

The next authorized action is a fresh independent
`audit-component-spec-conformance` run against the remediated target and the
unchanged authority chain.
