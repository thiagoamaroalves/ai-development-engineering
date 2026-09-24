# SPEC-EXEC-001 — Component SPEC Remediation

## 1. Remediation mode

```text
WRITE_ALLOWED AUDIT_DRIVEN ADR_FIRST PORTFOLIO_GOVERNED
UPSTREAM_CONTRACT_PRESERVING COMPONENT_SCOPED MINIMAL_SCOPE
NO_ARCHITECTURE_INVENTION NO_PORTFOLIO_REDESIGN
NO_IMPLEMENTATION_PLAN NO_TICKET_DECOMPOSITION
NO_PRODUCTION_IMPLEMENTATION NO_SELF_APPROVAL
REMEDIATION_RECOVERY_MODE = RESUME_OR_RECONCILE
INTERRUPTED_ATTEMPT_DETECTED = YES
CANDIDATE_STATE_CLASSIFICATION = COMPLETE_CLAIM_UNVERIFIED
CANDIDATE_PATHS = docs/specs/SPEC-EXEC-001-skill-contracts-and-capability-registry.md; docs/specs/remediations/SPEC-EXEC-001-component-spec-remediation.md
```

This is a recovery/reconciliation run for the owning component-SPEC
remediator. The source audit remains the defect authority. The candidate was
not treated as proof of completion; every current source finding was
revalidated against the accepted authority, approved portfolio, conformant
upstream contract and candidate content. No reset, clean, stash, discard,
checkpoint, independent re-audit or downstream phase was performed.

## 2. Baseline

| Field | Value |
|---|---|
| COMPONENT_SPEC | `docs/specs/SPEC-EXEC-001-skill-contracts-and-capability-registry.md` |
| SOURCE_AUDIT | `docs/specs/audits/SPEC-EXEC-001-component-conformance-audit.md` |
| SOURCE_AUDIT_VERDICT | `FAIL — COMPONENT_SPEC_NON_CONFORMANT` |
| SOURCE_AUDIT_COMPONENT_REVISION | `3` |
| COMPONENT_REVISION_BEFORE | `4` (untrusted candidate) |
| COMPONENT_REVISION_BEFORE_RECONCILIATION | `4` (untrusted candidate) |
| COMPONENT_REVISION_AFTER_RECONCILIATION | `4` |
| COMPONENT_STATUS | `PROPOSED` |
| SOURCE_AUDIT_TARGET_SHA256 | `b55e106c3b2e239f28e3ba3d2a0e75fbb9c840a3697acc2d1f540777b284b053` |
| REMEDIATION_CANDIDATE_FINGERPRINT | `aa3c79e21fb2cf807e713b13b51d28b4e298643b3aa965b4936296826309ac82` (SHA-256 of normalized candidate SPEC content) |
| COMPONENT_SHA256_AFTER_RECONCILIATION | `aa3c79e21fb2cf807e713b13b51d28b4e298643b3aa965b4936296826309ac82` |
| PORTFOLIO_ID / REVISION | `SPEC-PORTFOLIO-001` / `2` |
| PORTFOLIO_VERDICT | `PORTFOLIO_DECOMPOSITION_APPROVED` |
| PRIMARY_ADRS | `ADR-0003` revision `3`, `ACCEPTED` |
| RELATED_ADRS | `ADR-0001`, `ADR-0002`, `ADR-0006`, `ADR-0009`, `ADR-0010`, `ADR-0011`, all revision `3`, `ACCEPTED` |
| UPSTREAM_SPECS | `SPEC-DOM-001` revision `4`; latest audit `PASS — COMPONENT_SPEC_CONFORMANT` |
| REPOSITORY_HEAD | `e75fb654a2d18b3614861f404f198e86747ce259` |
| WORKING_TREE_STATE | At recovery intake, the declared component SPEC target and remediation evidence were dirty: ` M docs/specs/SPEC-EXEC-001-skill-contracts-and-capability-registry.md`; ` M docs/specs/remediations/SPEC-EXEC-001-component-spec-remediation.md` |
| VALIDATED_FINDINGS | `CSC-MAJOR-002` |
| BASELINE_DRIFT_STATUS | `DRIFT_ASSESSED` |
| REASSESSMENT_COMPLETE | `YES` |
| FINDINGS_ARE_ACTIONABLE | `YES` |
| BASELINE_REMEDIATION_READINESS | `READY` |
| AUDIT_BASIS_FINGERPRINT | `dc89de3547fb59d18197fd9384d00f5a71e582a4c4ac834e137de374adf2febd` |
| AUDIT_BASIS_STALE | `NO` under the interrupted-candidate exception; accepted authority and source audit are unchanged |
| BASELINE_REASSESSMENT_PROOF | source audit §3, `BASELINE_REASSESSMENT_PROOF` |
| SOURCE_AUDIT_IDENTITY | path above; `AUDIT_ROUND = FRESH_INDEPENDENT_REVALIDATION`; verdict and fingerprint above |
| SOURCE_AUDIT_UNMODIFIED | `YES` |
| ACCEPTED_AUTHORITY_UNMODIFIED | `YES` |
| DIRTY_PATHS_SUBSET_OF_REMEDIATION_WRITE_BOUNDARY | `YES` |
| NO_UNAUTHORIZED_PRODUCTION_OR_TEST_CHANGE | `YES` |
| CANDIDATE_PATHS | `docs/specs/SPEC-EXEC-001-skill-contracts-and-capability-registry.md`; `docs/specs/remediations/SPEC-EXEC-001-component-spec-remediation.md` |

The source audit's authority cutoff was rechecked: portfolio SHA-256
`c449388972279d8add520564a9614cfa236f87b6c8932a70d5bc2d28eef6be86`, portfolio
audit SHA-256 `120f22d0080ac0640ebbdad7c460df5de2745788cfaea83a1859f2c577168104`,
ADR-0003 SHA-256 `6325234bb9c927a6d2b38886206119c643a05718f6db8cce8df5625653260073`,
DOM SPEC SHA-256 `cb4a21924d9619b8349d6cc239d7998633c402d7ea3d7461c2d4d8498f9a014c`,
and DOM audit SHA-256
`9bbea969820f3705354ee6ca76110039f747d9aa60c84e1a19cae49f01158c15` all match
the audited current authority. The candidate fingerprint is an authorized
remediation overlay and is not promoted to a new audit basis.

## 3. Source audit

The complete current source audit is
`docs/specs/audits/SPEC-EXEC-001-component-conformance-audit.md`. Its exact
verdict is `FAIL — COMPONENT_SPEC_NON_CONFORMANT`, with one actionable MAJOR
finding, `CSC-MAJOR-002`, and `READY_FOR_GAP_MATRIX: NO`.

The source audit records `BASELINE_DRIFT_STATUS = DRIFT_ASSESSED`,
`REASSESSMENT_COMPLETE = YES`, `FINDINGS_ARE_ACTIONABLE = YES`,
`BASELINE_REMEDIATION_READINESS = READY`, and `AUDIT_BASIS_STALE = NO`. Its
reassessment preserves the accepted ADR authority, six owned obligations
`O-016`–`O-021`, one approved normative dependency to `SPEC-DOM-001` revision
4, and 19 existing normative requirements. The prior remediation report's
`CSC-MAJOR-001` basis is stale/contradictory evidence for this source audit;
it is preserved as historical lineage but is not a current finding.

## 4. Authority used

Authority precedence was preserved exactly:

```text
accepted ADR > approved SPEC portfolio decomposition > conformant upstream SPEC
> validated independent component audit > component SPEC > repository evidence
```

| Authority | Revision/evidence | Use |
|---|---|---|
| `ADR-0003` | revision `3`, `ACCEPTED`, `Decisão` | envelope, semver, explicit supported versions, exact basis, fail-closed contract behavior, registry and manifest |
| `ADR-0001` | revision `3`, `ACCEPTED` | canonical DOM identity, immutable snapshot and revision references |
| `ADR-0002` | revision `3`, `ACCEPTED` | domain lifecycle and advancement remain DOM-owned |
| `ADR-0006` | revision `3`, `ACCEPTED` | physical persistence, idempotency and recovery remain PLAT-owned |
| `ADR-0009` | revision `3`, `ACCEPTED` | structured audit/remediation and conformance-cycle boundaries |
| `ADR-0010` | revision `3`, `ACCEPTED` | repository configuration and independent bootstrap boundary |
| `ADR-0011` | revision `3`, `ACCEPTED` | application/transport mapping boundary |
| `SPEC-PORTFOLIO-001` | revision `2`, approved decomposition | ownership `O-016`–`O-021`, failure/compatibility allocation and DAG |
| `SPEC-PORTFOLIO-001-decomposition-audit` | approved | portfolio authority and ownership conformance |
| `SPEC-DOM-001` | revision `4`, conformant audit | consumed `RepositoryId`, snapshot, activity/attempt and lifecycle contracts |

The overlap correction is a component-scoped SPEC elaboration under the
already-approved EXEC ownership of O-017/O-020. It rejects overlapping
supported-version sets rather than introducing a new owner, ADR, dependency,
storage technology or implementation design. No accepted ADR, portfolio,
upstream SPEC or audit report was modified.

## 5. Findings ledger

| Finding | Severity | Category | Authority | Root cause | Target section | Planned correction | Validation |
|---|---|---|---|---|---|---|---|
| `CSC-MAJOR-002` | MAJOR | `SPECIFICATION_GAP` / `FAILURE_SEMANTICS_GAP` / `SPEC_IMPLEMENTABILITY_FAILED` | ADR-0003/O-017/O-020; approved portfolio; EXEC-owned registry boundary; consumed DOM identity/basis contracts | `SPEC_COMPLETENESS_DEFECT` | §11, §12.1, §12.3–§12.4, `EXEC-VERSION-002`, `EXEC-REGISTRY-001`, `EXEC-REGISTRY-004`, `EXEC-CAPABILITY-001`, §§14–17, C-EXEC-021, AC-EXEC-004/008/011/019/020 | Reconcile the candidate's authority-backed rejection rule: overlapping sets invalidate the catalog/basis with `CONTRACT_INVALID`; no selection, precedence, registration-order dependence, mutation, new revision or historical reinterpretation; valid disjoint bases resolve one complete entry identity | direct positive/negative witnesses for overlap, non-overlap, order permutations, canonical failure, no mutation, frozen basis and replay; affected requirement simulations all pass |

Recovery classification for this finding was `ALREADY_RESOLVED_BY_CURRENT_CANDIDATE`.
The candidate correction was nevertheless revalidated rather than trusted. Final
remediation status is recorded as `REMEDIATED` below. No current source finding
is classified as portfolio, ADR or upstream remediation.

| Finding | Before | Remediation | Authority | Local proof | Status |
|---|---|---|---|---|---|
| `CSC-MAJOR-002` | Revision 3 required deterministic resolution but did not define the result for overlapping supported-version sets; `EXEC-VERSION-002`, `EXEC-REGISTRY-001` and `EXEC-CAPABILITY-001` were only partially testable. | Revision 4 defines disjoint supported sets for each resolution tuple; overlap rejects registration or catalog-basis construction with `CONTRACT_INVALID`, creates no identity/revision/snapshot/manifest and preserves the previous basis; valid disjoint sets resolve exactly one complete entry identity, independent of registration order. | `O-017`, `O-020`, ADR-0003 Decisão; DOM snapshot/identity contracts consumed without redefinition | §§11–17; `C-EXEC-004`, `C-EXEC-021`; `AC-EXEC-004`, `AC-EXEC-008`, `AC-EXEC-011`, `AC-EXEC-019`, `AC-EXEC-020`; traceability rows for the three affected requirements | `REMEDIATED` |

## 6. Files changed

| File | Change |
|---|---|
| `docs/specs/SPEC-EXEC-001-skill-contracts-and-capability-registry.md` | Preserved and reconciled the interrupted revision-4 candidate; added/retained the complete overlap contract, failure semantics, identity/reconstruction implications, acceptance and conformance witnesses, traceability and metrics. |
| `docs/specs/remediations/SPEC-EXEC-001-component-spec-remediation.md` | Replaced stale CSC-MAJOR-001 evidence with this current recovery report, current source-audit identity, candidate fingerprint, finding ledger, mechanical validation and handoff. |

The source audit, accepted ADRs, approved portfolio, portfolio audit, upstream
SPEC/audit, production code, tests, Gap Matrices, Plans and tickets were not
modified by this run.

## 7. Owned obligation remediation

Ownership remains exactly the approved six obligations `O-016`–`O-021`, with
`SPEC-EXEC-001` as canonical owner. O-017 now fully states explicit supported
versions and the invalid overlap condition. O-020 now fully states unique
resolution, no precedence/registration-order selection, canonical failure and
catalog identity/reconstruction behavior. O-016, O-018, O-019 and O-021 retain
their approved meanings and boundaries.

```text
PORTFOLIO_OBLIGATIONS_OWNED = 6
PORTFOLIO_OBLIGATIONS_COVERED = 6
OWNED_OBLIGATIONS_UNCOVERED = 0
OWNED_OBLIGATIONS_PARTIAL = 0
```

## 8. Upstream contract remediation

No upstream contract was changed. `SPEC-DOM-001` revision 4 remains the
conformant upstream contract. EXEC-001 consumes DOM `RepositoryId`, execution,
activity, attempt, snapshot and lifecycle references; it does not create a
DOM identity, lifecycle or verdict. REPO remains the source/owner of enabled
repository configuration and bootstrap operation, PLAT remains the physical
persistence/recovery owner, EXEC-002 remains the context/session consumer, and
BACKEND remains a mapping/transport consumer.

```text
CONSUMED_CONTRACTS = 2
CONSUMED_CONTRACTS_REDEFINED = 0
UPSTREAM_CONTRACT_GAPS = 0
```

## 9. Requirement authority remediation

The candidate extends the existing authority-backed requirements
`EXEC-VERSION-002`, `EXEC-REGISTRY-001`, `EXEC-REGISTRY-004` and
`EXEC-CAPABILITY-001`; it does not add an unsupported owner or an implementation
plan. The rejection rule is a legitimate component-SPEC elaboration of the
already-assigned explicit-version, deterministic-registry and fail-closed
contract family. Its authority and role are recorded as follows:

| Requirement IDs | Portfolio obligation | ADR authority | Owned/consumed role | Normative behavior | Acceptance/conformance |
|---|---|---|---|---|---|
| `EXEC-VERSION-002` | `O-017` | ADR-0003, `Decisão` | EXEC canonical owner | explicit sets are disjoint; overlap is `CONTRACT_INVALID`; valid out-of-set request is `INCOMPATIBLE_CAPABILITY` | AC-EXEC-004; C-EXEC-003/021 |
| `EXEC-REGISTRY-001` | `O-020` | ADR-0003, `Decisão` | EXEC canonical owner | valid basis has at most one supporting entry; no ordering or consumer chooses a candidate | AC-EXEC-008; C-EXEC-004/021 |
| `EXEC-REGISTRY-004` | `O-020` | ADR-0003, ADR-0001, ADR-0010 and consumed DOM contracts | EXEC canonical owner; DOM identity consumed | scoped identity, catalog revision, rejection and reconstruction preserve the frozen basis | AC-EXEC-019; C-EXEC-018/020/021 |
| `EXEC-CAPABILITY-001` | `O-020` | ADR-0003, `Decisão` | EXEC canonical owner | unknown, incompatible and invalid-overlap outcomes remain distinct and fail closed | AC-EXEC-011; C-EXEC-010/021 |

All 19 normative requirements retain portfolio and ADR authority:

```text
NORMATIVE_REQUIREMENTS = 19
REQUIREMENTS_WITHOUT_AUTHORITY = 0
```

## 10. Lifecycle/identity remediation

For each resolution tuple
`(CatalogScope, RepositoryId when NORMAL, StageId, SkillContractId,
CapabilityId, SchemaId)`, distinct entries must have disjoint explicit
supported-version sets. A non-empty intersection invalidates registration or
catalog-basis construction before a new `CatalogRevision`, snapshot or
manifest can be created. Both registration permutations produce the same
failure and preserve the prior valid basis.

A valid request supported by one entry resolves to that entry's complete
canonical identity and frozen `CatalogRevision`. A single entry may support
multiple versions. An unknown key is `UNKNOWN_CAPABILITY`; a known key with an
unsupported request in a valid basis is `INCOMPATIBLE_CAPABILITY`. No overlap
path selects an identity, creates a revision, mutates a snapshot/manifest or
reinterprets historical material. DOM-owned identity and lifecycle remain
consumed contracts.

```text
CONSUMED_CONTRACTS_REDEFINED = 0
```

## 11. Failure/recovery remediation

The overlap trigger is an invalid registry/catalog basis, not an incompatible
request. Its canonical failure is `CONTRACT_INVALID`, with no partial
materialization, selection, transition, effect, catalog revision or mutation.
The semantic owner is EXEC-001; transport, OPS and UI may only map or project
it. A valid basis retains the existing `UNKNOWN_CAPABILITY` and
`INCOMPATIBLE_CAPABILITY` meanings.

Retry has no implicit conversion or fallback and cannot bypass an overlap. A
policy-level retry must use an authorized conforming basis and preserve the
appropriate repository/catalog identity and exact version basis. Historical
replay uses the original valid frozen catalog/manifest basis and is never
reinterpreted through a later invalid or changed registry.

```text
FAILURE_OWNER_VIOLATIONS = 0
```

## 12. Compatibility/cutover remediation

The new canonical path remains EXEC-owned. Legacy input remains a REPO
consumer/adaptation concern and cannot become a second registry authority.
Historical replay preserves the original repository/catalog identity, version,
schema, hashes and manifest basis. A new catalog basis must retain disjoint
sets; a rejected overlapping basis cannot replace the previous valid basis or
alter existing snapshots/manifests.

```text
COMPATIBILITY_OWNER_VIOLATIONS = 0
```

## 13. Dependency remediation

The approved normative dependency remains exactly
`SPEC-EXEC-001 → SPEC-DOM-001`. The overlap rule is local EXEC semantics and
adds no dependency, reverse edge or consumer authority. PLAT, EXEC-002 and
REPO remain implementation/evidence/consumer boundaries as declared by the
portfolio and target SPEC.

```text
NORMATIVE_DEPENDENCIES = 1
UNAPPROVED_DEPENDENCIES = 0
MISSING_REQUIRED_DEPENDENCIES = 0
DEPENDENCY_DIRECTION_VIOLATIONS = 0
```

## 14. Projection boundary remediation

The registry, catalog basis and canonical failure are EXEC contractual
material. Physical storage supplies material/integrity only. DOM supplies
canonical identity and snapshot references. Backend, OPS, UI, logs, labels,
transport and capability views remain non-authoritative projections and cannot
choose precedence, create a capability, select an overlapping entry or turn
failure into success.

## 15. Acceptance/conformance remediation

The candidate's direct witnesses were reconciled against the source audit's
required criteria:

- `C-EXEC-021` uses two distinct entries in the same resolution tuple with an
  overlapping set and proves `CONTRACT_INVALID` in both registration orders,
  with no selected identity, catalog revision, snapshot, manifest or mutation;
- the same witness uses disjoint sets to prove each supported version resolves
  to the unique complete entry identity and frozen basis, and an unsupported
  request produces `INCOMPATIBLE_CAPABILITY`;
- `C-EXEC-004`, `AC-EXEC-004`, `AC-EXEC-008`, `AC-EXEC-011`, `AC-EXEC-019` and
  `AC-EXEC-020` carry the overlap, uniqueness, basis, no-mutation and replay
  semantics;
- the affected requirements' acceptance and conformance mappings are present
  in the traceability matrix, and no local testability claim promotes
  productive availability.

```text
UNTESTABLE_REQUIREMENTS = 0
ACCEPTANCE_GAPS = 0
CAPABILITY_AVAILABILITY_CLASSIFICATION_ERRORS = 0
DOWNSTREAM_PROMOTION_WITHOUT_NEW_EVIDENCE = 0
```

## 16. Traceability remediation

The ADR → portfolio obligation → requirement → acceptance/conformance chain is
complete. O-017 is represented by `EXEC-VERSION-001/002`; O-020 is represented
by the registry and capability requirements, including the overlap rule. The
three directly affected requirements now point to `C-EXEC-021` and the
corresponding binary acceptance rows. No requirement is unowned, unauthorised
or without an acceptance/conformance witness.

```text
OWNED_OBLIGATIONS_WITHOUT_REQUIREMENT = 0
REQUIREMENTS_WITHOUT_PORTFOLIO_AUTHORITY = 0
REQUIREMENTS_WITHOUT_ADR_AUTHORITY = 0
```

## 17. Gap classification remediation

The overlap-selection ambiguity is no longer a SPECIFICATION_GAP in the
candidate: it is a `NON_GAP` normative rule, while the absent productive
registry/runtime/schema/manifest implementation remains an
`IMPLEMENTATION_GAP`. Prototype and mock behavior remain `PROTOTYPE_ONLY`, and
unfrozen technology remains `UNFROZEN_IMPLEMENTATION_DETAIL`. No formal Gap
Matrix was created or completed by this remediation.

```text
ARCHITECTURE_GAPS = 0
PORTFOLIO_GAPS = 0
UPSTREAM_CONTRACT_GAPS = 0
```

## 18. Implementation-plan leakage remediation

No implementation phase, file/class/module plan, commit group, ticket,
worktree assignment, technology choice or development sequence was added.
Catalog identity, disjoint support sets, canonical failure, frozen basis and
replay are observable contract semantics required to close the finding, not
implementation instructions.

```text
IMPLEMENTATION_PLAN_LEAKS = 0
```

## 19. Mechanical validation

The candidate was mechanically reconciled after revalidating the source
finding. All required local invariants are zero:

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
CONFORMANCE_TESTS = 21
```

The candidate's target revision is 4, its normalized content fingerprint is
`aa3c79e21fb2cf807e713b13b51d28b4e298643b3aa965b4936296826309ac82`, and the
source audit basis fingerprint remains `dc89de3547fb59d18197fd9384d00f5a71e582a4c4ac834e137de374adf2febd`.
The latter is not replaced by the candidate fingerprint.

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

No authority drift, out-of-bound dirty path, unassessed baseline drift or
residual validated finding remains. This report does not emit an independent
SPEC audit verdict or approve the SPEC.

## 21. Reaudit readiness

The interrupted revision-4 candidate was reconciled against the unchanged
source audit and all required authority. The current remediation result is:

```text
COMPONENT_SPEC_REMEDIATION_COMPLETE
```

The authorized handoff is:

```text
READY_FOR_INDEPENDENT_COMPONENT_SPEC_REAUDIT
```

The corresponding remediation checkpoint remains mandatory before the fresh
independent `audit-component-spec-conformance` re-audit. This gate does not
emit `PASS — COMPONENT_SPEC_CONFORMANT` and does not authorize Gap Matrix,
Implementation Plan, ticket, production or test work.
