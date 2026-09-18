# SPEC-EXEC-001 — Component SPEC Remediation

## 1. Remediation mode

```text
WRITE_ALLOWED AUDIT_DRIVEN ADR_FIRST PORTFOLIO_GOVERNED
UPSTREAM_CONTRACT_PRESERVING COMPONENT_SCOPED MINIMAL_SCOPE
NO_ARCHITECTURE_INVENTION NO_PORTFOLIO_REDESIGN
NO_IMPLEMENTATION_PLAN NO_TICKET_DECOMPOSITION
NO_PRODUCTION_IMPLEMENTATION NO_SELF_APPROVAL
```

This run consumes the latest independent component conformance audit and
corrects only the validated finding in the audited component SPEC. It does not
approve the SPEC. The next phase is an independent component SPEC re-audit.

## 2. Baseline

| Field | Value before remediation |
|---|---|
| COMPONENT_SPEC | `docs/specs/SPEC-EXEC-001-skill-contracts-and-capability-registry.md` |
| COMPONENT_REVISION_BEFORE | `2` |
| COMPONENT_STATUS | `PROPOSED` |
| COMPONENT_SHA256_BEFORE | `368c19bd9f03c09361b508c72e705efe9363d40618d76cb9841b2c11a98c3cbc` |
| COMPONENT_SHA256_AFTER | `b55e106c3b2e239f28e3ba3d2a0e75fbb9c840a3697acc2d1f540777b284b053` |
| SOURCE_AUDIT | `docs/specs/audits/SPEC-EXEC-001-component-conformance-audit.md` |
| SOURCE_AUDIT_VERDICT | `FAIL — COMPONENT_SPEC_NON_CONFORMANT` |
| PORTFOLIO_ID / REVISION | `SPEC-PORTFOLIO-001` / `2` |
| PORTFOLIO_VERDICT | `PORTFOLIO_DECOMPOSITION_APPROVED` |
| PRIMARY_ADRS | `ADR-0003` revision `3`, `ACCEPTED` |
| RELATED_ADRS | `ADR-0001`, `ADR-0002`, `ADR-0006`, `ADR-0009`, `ADR-0010`, `ADR-0011` |
| UPSTREAM_SPECS | `SPEC-DOM-001` revision `4`; latest audit `PASS — COMPONENT_SPEC_CONFORMANT` |
| REPOSITORY_HEAD | `381218d5fbf8d969ee5ae5349b8f65c4cd5af7f9` |
| WORKING_TREE_STATE | before edits: target SPEC, source audit and prior remediation evidence were modified relative to HEAD; no authority, production or test path was changed by this run |
| VALIDATED_FINDINGS | `CSC-MAJOR-001` |
| BASELINE_DRIFT_STATUS | `DRIFT_ASSESSED` |
| REASSESSMENT_COMPLETE | `YES` |
| FINDINGS_ARE_ACTIONABLE | `YES` |
| BASELINE_REMEDIATION_READINESS | `READY` |
| AUDIT_BASIS_FINGERPRINT | `84f7b2b38070a135c2c90081fac087bf9c59ee7f54b5bcbc2d4f0e28431f7c7b` |
| BASELINE_REASSESSMENT_PROOF | source audit §3, `BASELINE_REASSESSMENT_PROOF` |
| AUTHORITY_CUTOFF_HASHES | portfolio `c449388972279d8add520564a9614cfa236f87b6c8932a70d5bc2d28eef6be86`; portfolio audit `120f22d0080ac0640ebbdad7c460df5de2745788cfaea83a1859f2c577168104`; ADR-0003 `6325234bb9c927a6d2b38886206119c643a05718f6db8cce8df5625653260073`; DOM SPEC `cb4a21924d9619b8349d6cc239d7998633c402d7ea3d7461c2d4d8498f9a014c`; DOM audit `9bbea969820f3705354ee6ca76110039f747d9aa60c84e1a19cae49f01158c15` |

The live authority and source state were compared to the persisted current
baseline before editing. The portfolio, portfolio audit, ADR-0003, DOM SPEC,
and DOM audit matched the source audit's current hashes; HEAD matched the
pinned repository baseline; the target and prior remediation hashes matched the
source audit's current repository baseline. Therefore the assessed drift is
consumable and no stale-audit blocker applies.

## 3. Source audit

The complete source audit at
`docs/specs/audits/SPEC-EXEC-001-component-conformance-audit.md` is the latest
independent audit. Its exact verdict is `FAIL — COMPONENT_SPEC_NON_CONFORMANT`.
It reports one actionable MAJOR finding, `CSC-MAJOR-001`, with
`SPEC_IMPLEMENTABILITY_CHECK = FAIL` and `READY_FOR_GAP_MATRIX: NO`.

The audit records `BASELINE_DRIFT_STATUS = DRIFT_ASSESSED`,
`REASSESSMENT_COMPLETE = YES`, `FINDINGS_ARE_ACTIONABLE = YES`,
`BASELINE_REMEDIATION_READINESS = READY`, and `AUDIT_BASIS_STALE = NO`.
The audit's reassessment preserves the accepted authority, the six owned
obligations O-016–O-021, the single approved normative dependency to
`SPEC-DOM-001` revision 4, and all 19 existing normative requirements.

## 4. Authority used

Authority precedence was preserved:

```text
accepted ADR > approved SPEC portfolio decomposition > conformant upstream SPEC
> validated independent component audit > component SPEC > repository evidence
```

| Authority | Revision/evidence | Use |
|---|---|---|
| `ADR-0003` | revision `3`, `ACCEPTED`, `Decisão` | envelope, semver, exact basis, failure, registry and manifest |
| `ADR-0001` | revision `3`, `ACCEPTED` | canonical DOM identity and immutable snapshot references |
| `ADR-0002` | revision `3`, `ACCEPTED` | domain lifecycle and advancement remain DOM-owned |
| `ADR-0006` | revision `3`, `ACCEPTED` | physical persistence/recovery remains PLAT-owned |
| `ADR-0009` | revision `3`, `ACCEPTED` | structured verdict and audit-cycle boundaries |
| `ADR-0010` | revision `3`, `ACCEPTED` | repository-specific enabled configuration and independent bootstrap |
| `ADR-0011` | revision `3`, `ACCEPTED` | application/transport mapping boundary |
| `SPEC-PORTFOLIO-001` | revision `2`, approved decomposition | O-016–O-021 ownership, failure, compatibility and DAG |
| `SPEC-DOM-001` | revision `4`, conformant audit | `RepositoryId`, DOM identity/snapshot contracts consumed by EXEC |

No ADR, portfolio, or upstream contract was changed. The correction uses the
already-authorized DOM `RepositoryId` to bind the NORMAL catalog to the
repository-specific configuration required by ADR-0010. It does not transfer
repository enablement to EXEC-001 and does not select storage, schema
technology, route, class, module, or other implementation structure.

## 5. Findings ledger

| Finding | Severity | Category | Authority | Root cause | Target section | Planned correction | Validation |
|---|---|---|---|---|---|---|---|
| `CSC-MAJOR-001` | MAJOR | `IDENTITY_AUTHORITY_GAP` / `RECONSTRUCTION_AUTHORITY_GAP` / `PERSISTENCE_SEMANTICS_GAP` | ADR-0003/O-020; ADR-0010; DOM `DOM-ID-001`/`DOM-SNAPSHOT-001` consumed contracts | `SPEC_COMPLETENESS_DEFECT` | §12.1, §12.3–§12.4, `EXEC-REGISTRY-004`, §21–§23, §26 | bind NORMAL entry/catalog identity, lookup, persistence, rehydration, attachment and continuity to DOM `RepositoryId`; retain BOOTSTRAP as independent system scope | direct two-repository isolation and invalid cross-repository witnesses in C-EXEC-018/020 and AC-EXEC-019 |

All findings are classified `REMEDIATE`. No finding is escalated to ADR,
portfolio, or upstream remediation. The finding remains open to the
independent auditor; this report records remediation status only.

| Finding | Before | Remediation | Authority | Local proof | Status |
|---|---|---|---|---|---|
| `CSC-MAJOR-001` | NORMAL entries used only `(CatalogScope, SkillContractId, CapabilityId, SchemaId, SemanticVersion)` and did not identify which repository-specific catalog owned the key or persisted basis. | NORMAL entries now require `RepositoryId` from DOM in canonical identity, scope, lookup, persisted/rehydrated material, attachment and revision continuity; BOOTSTRAP remains independently system-scoped. Cross-catalog positive/negative witnesses were added and all direct proofs were reconciled. | ADR-0003/O-020; ADR-0010; DOM `DOM-ID-001`/`DOM-SNAPSHOT-001` | target §12.1, §12.3–§12.4, `EXEC-REGISTRY-004`, C-EXEC-018/020, AC-EXEC-019 | `REMEDIATED` |

## 6. Files changed

| File | Change |
|---|---|
| `docs/specs/SPEC-EXEC-001-skill-contracts-and-capability-registry.md` | revision 3; finding-driven NORMAL catalog identity, reconstruction, persistence, acceptance and traceability correction |
| `docs/specs/remediations/SPEC-EXEC-001-component-spec-remediation.md` | replaced stale prior evidence with this run's baseline, ledger, proof and re-audit handoff |

The source audit, ADRs, portfolio, portfolio audit, upstream SPEC/audit, Gap
Matrices, plans, tickets, production code and tests were not modified by this
run.

## 7. Owned obligation remediation

Ownership remains exactly O-016–O-021, with EXEC-001 as canonical owner. O-020's
registry materialization now distinguishes repository-local NORMAL catalogs by
the canonical DOM `RepositoryId` while preserving the independent BOOTSTRAP
catalog. No obligation was moved to REPO, DOM, PLAT, or any downstream consumer.
O-016–O-019 and O-021 remain unchanged in meaning.

## 8. Upstream contract remediation

No upstream contract was modified. `SPEC-DOM-001` revision 4 remains the
conformant upstream contract. EXEC-001 consumes its canonical `RepositoryId`
and does not create a repository identity, enable a repository, or redefine
DOM lifecycle. `SPEC-REPO-001` remains the owner of repository configuration
and enablement; it supplies the enabled configuration from which the NORMAL
catalog material is obtained.

## 9. Requirement authority remediation

`EXEC-REGISTRY-004` was extended, not replaced or newly invented. Its authority
is now explicitly traced to `O-020`, ADR-0003/ADR-0010, and the consumed DOM
identity/snapshot contracts. The requirement states the conditional canonical
identity:

- `NORMAL`: `(CatalogScope=NORMAL, RepositoryId, SkillContractId, CapabilityId, SchemaId, SemanticVersion)`;
- `BOOTSTRAP`: independent system-scoped `(CatalogScope=BOOTSTRAP, SkillContractId, CapabilityId, SchemaId, SemanticVersion)`.

This is a legitimate, implementation-independent materialization of the
repository-specific normal configuration and system bootstrap separation. No
new architecture, persistence technology, or owner was introduced.

## 10. Lifecycle/identity remediation

NORMAL registry identity is repository-scoped by the canonical DOM
`RepositoryId`; BOOTSTRAP remains the independent system catalog scope. The
repository binding is immutable and cannot be replaced by a name, path,
branch, URL, digest, label, or correlation value. The same scoped key/version
is one immutable entry; semantic change requires a new semantic version and a
new catalog basis within the same repository/catalog scope.

Creation, lookup, persistence and rehydration all carry the NORMAL
`RepositoryId`. Catalog revision continuity is checked within that same
repository/ scope. A basis from another repository, or a missing/mismatched
repository attachment, fails closed without mutation. Historical replay uses
the frozen repository-scoped basis, never a current or foreign catalog.

## 11. Failure/recovery remediation

Unknown and incompatible capabilities retain `UNKNOWN_CAPABILITY` and
`INCOMPATIBLE_CAPABILITY`. Missing, detached, corrupt, stale, duplicate,
out-of-order, inconsistent, or cross-repository registry material produces
`CONTRACT_INVALID` without partial mutation. Physical serialization, ordering
and recovery remain PLAT-owned; EXEC-001 validates semantic identity,
repository attachment, references, version and continuity. Retry and replay
cannot substitute another repository catalog or reinterpret a frozen basis.

## 12. Compatibility/cutover remediation

`NEW_CANONICAL_PATH`, `HISTORICAL_REPLAY`, and `CUTOVER` remain EXEC-001-owned;
legacy remains a REPO consumer. A changed repository catalog or contract basis
applies only to new resolutions in that scoped catalog. Existing snapshots and
manifests retain their exact repository, catalog and contract basis. BOOTSTRAP
is not a normal-catalog alias or fallback, and no second permanent source of
truth was introduced.

## 13. Dependency remediation

The sole normative dependency remains the approved direct edge
`SPEC-EXEC-001 → SPEC-DOM-001`. Using DOM `RepositoryId` is consumption of the
existing identity contract, not a new edge. REPO remains an evidence/source
boundary for enabled configuration and is not promoted to EXEC semantic owner.
The dependency graph remains acyclic and direction-preserving.

## 14. Projection boundary remediation

Registry entries and catalog bases remain canonical EXEC-001 contractual
material. Registry views, logs, transport events, and UI/OPS labels remain
projections. A projection, source adapter, digest, path, or caller cannot create
or replace the repository-scoped identity. Physical storage may preserve
material and integrity but cannot define catalog ownership or resolution
meaning.

## 15. Acceptance/conformance remediation

`C-EXEC-018` now directly exercises two distinct repository-scoped NORMAL
catalogs that contain the same five non-repository entry fields but different
material: each resolves only with its own `RepositoryId` and frozen
`CatalogRevision`. The negative witness rejects a foreign or mismatched
repository attachment with `CONTRACT_INVALID` and without mutation.

`AC-EXEC-019` now requires the conditional NORMAL/BOOTSTRAP identity and
explicitly rejects cross-repository lookup, invalid scope/attachment,
conflicting material, and continuity violations. `C-EXEC-020` includes
cross-repository registry material among fail-closed cases. Existing manifest,
version, bootstrap, failure, replay, projection, and dependency witnesses are
preserved.

## 16. Traceability remediation

The requirement-to-authority matrix now records ADR-0010 alongside ADR-0003
and ADR-0001 for `EXEC-REGISTRY-004`; its acceptance and conformance references
remain AC-EXEC-019 and C-EXEC-018/C-EXEC-020. O-020 remains fully covered and
all 19 requirements retain portfolio and ADR authority:

```text
OWNED_OBLIGATIONS_WITHOUT_REQUIREMENT = 0
REQUIREMENTS_WITHOUT_PORTFOLIO_AUTHORITY = 0
REQUIREMENTS_WITHOUT_ADR_AUTHORITY = 0
```

## 17. Gap classification remediation

No formal Gap Matrix was created. The absence of productive schemas, registry,
manifest persistence and runtime remains `IMPLEMENTATION_GAP`; prototype files
remain `PROTOTYPE_ONLY`; unfrozen technology remains
`UNFROZEN_IMPLEMENTATION_DETAIL`. The repository-catalog authority omission is
now represented by the SPEC contract and direct witnesses; only the independent
re-audit may validate that materialization.

## 18. Implementation-plan leakage remediation

No implementation plan, ticket, phase, file/class plan, commit grouping,
storage technology, schema library, route, or development sequence was
introduced. `RepositoryId`, scoped identity tuples, `CatalogRevision`, and
validation/failure outcomes are observable contract semantics backed by
accepted authority.

## 19. Mechanical validation

```text
PORTFOLIO_OBLIGATIONS_OWNED = 6
PORTFOLIO_OBLIGATIONS_COVERED = 6
OWNED_OBLIGATIONS_UNCOVERED = 0
OWNED_OBLIGATIONS_PARTIAL = 0
NORMATIVE_REQUIREMENTS = 19
REQUIREMENTS_WITHOUT_AUTHORITY = 0
IMPLEMENTER_DECISION_CHECK_FAILURES = 0
CAPABILITY_AVAILABILITY_CLASSIFICATION_ERRORS = 0
DOWNSTREAM_PROMOTION_WITHOUT_NEW_EVIDENCE = 0
CONSUMED_CONTRACTS = 2
CONSUMED_CONTRACTS_REDEFINED = 0
UNTESTABLE_REQUIREMENTS = 0
ACCEPTANCE_GAPS = 0
NORMATIVE_DEPENDENCIES = 1
UNAPPROVED_DEPENDENCIES = 0
MISSING_REQUIRED_DEPENDENCIES = 0
DEPENDENCY_DIRECTION_VIOLATIONS = 0
FAILURE_OWNER_VIOLATIONS = 0
COMPATIBILITY_OWNER_VIOLATIONS = 0
ARCHITECTURE_GAPS = 0
PORTFOLIO_GAPS = 0
UPSTREAM_CONTRACT_GAPS = 0
IMPLEMENTATION_PLAN_LEAKS = 0
REMEDIATED_FINDINGS = 1
PARTIAL_FINDINGS = 0
BLOCKED_FINDINGS = 0
ACCEPTANCE_CRITERIA = 20
CONFORMANCE_TESTS = 20
```

The required local invariants are zero. Productive availability is unchanged;
this SPEC remediation does not promote any capability or claim runtime
availability.

## 20. Remaining blockers

```text
ARCHITECTURE = 0
PORTFOLIO = 0
UPSTREAM = 0
ADR_CLARIFICATION_REQUIRED = 0
PORTFOLIO_REMEDIATION_REQUIRED = 0
UPSTREAM_REMEDIATION_REQUIRED = 0
REMEDIATION_BLOCKED = 0
```

The validated finding was remediated. This report does not emit an independent
audit verdict or approve the SPEC.

## 21. Reaudit readiness

The component SPEC advanced from revision 2 to revision 3 while preserving its
authority lineage and the pinned repository HEAD. The remediation result is:

```text
COMPONENT_SPEC_REMEDIATION_COMPLETE
```

The required handoff is:

```text
READY_FOR_INDEPENDENT_COMPONENT_SPEC_REAUDIT
```

The next mandatory phase is a fresh independent
`audit-component-spec-conformance` run against the updated SPEC. Gap Matrix
generation remains blocked until that independent re-audit authorizes it.
