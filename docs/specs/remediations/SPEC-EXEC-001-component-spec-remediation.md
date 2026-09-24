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
CANDIDATE_PATHS = docs/specs/SPEC-EXEC-001-skill-contracts-and-capability-registry.md
RESULT = COMPONENT_SPEC_REMEDIATION_COMPLETE
```

A prior authorized edit attempt was interrupted after modifying the target SPEC
and before current remediation evidence was reconciled. The target's
completion-looking marker was therefore treated as
`COMPLETE_CLAIM_UNVERIFIED`, not as completion. The source audit and accepted
authority remained unchanged; this run revalidated both findings against the
candidate, repaired the report/metrics/lineage and emits the gate only now.
The historical report in this path was stale for the current audit identity and
was replaced.

## 2. Baseline

| Field | Value |
|---|---|
| COMPONENT_SPEC | `docs/specs/SPEC-EXEC-001-skill-contracts-and-capability-registry.md` |
| COMPONENT_REVISION_BEFORE | `4` |
| COMPONENT_REVISION_AFTER | `5` |
| COMPONENT_STATUS | `PROPOSED` |
| SOURCE_AUDIT | `docs/specs/audits/SPEC-EXEC-001-component-conformance-audit.md` |
| SOURCE_AUDIT_VERDICT | `FAIL — COMPONENT_SPEC_NON_CONFORMANT` |
| SOURCE_AUDIT_COMPONENT_REVISION | `4` |
| SOURCE_AUDIT_CONTENT_SHA256 | `bf6e55d4e8647739508003258014daa2a41a94941c191cf4514f52eb347d2115` (LF-normalized) |
| COMPONENT_SHA256_BEFORE | `aa3c79e21fb2cf807e713b13b51d28b4e298643b3aa965b4936296826309ac82` (LF-normalized) |
| COMPONENT_SHA256_AFTER | `556f4b5ad0b1c8f10d4fd00964d84e1af5bb959724d023eed9bda12a282411b2` (LF-normalized) |
| PORTFOLIO_ID / REVISION | `SPEC-PORTFOLIO-001` / `2` |
| PORTFOLIO_VERDICT | `PORTFOLIO_DECOMPOSITION_APPROVED` |
| PRIMARY_ADRS | `ADR-0003` revision `3`, `ACCEPTED` |
| RELATED_ADRS | `ADR-0001`, `ADR-0002`, `ADR-0006`, `ADR-0009`, `ADR-0010`, `ADR-0011`, all revision `3`, `ACCEPTED` |
| UPSTREAM_SPECS | `SPEC-DOM-001` revision `4`; latest audit `PASS — COMPONENT_SPEC_CONFORMANT` |
| REPOSITORY_HEAD | `222ee327f46c9832ab61f6640d81bb9cf002b75e` |
| WORKING_TREE_STATE | authorized target candidate dirty at recovery entry; after reconciliation only the target SPEC and this report are dirty within the declared write boundary |
| VALIDATED_FINDINGS | `CSC-MAJOR-003`, `CSC-MAJOR-004` |
| BASELINE_DRIFT_STATUS | `DRIFT_ASSESSED` |
| REASSESSMENT_COMPLETE | `YES` |
| FINDINGS_ARE_ACTIONABLE | `YES` |
| BASELINE_REMEDIATION_READINESS | `READY` |
| AUDIT_BASIS_FINGERPRINT | `998d14f6c4188c217a645615f8f4de042318bec728ab56e6d14edd0bf3e19ddd` |
| AUDIT_BASIS_STALE | `NO` |
| BASELINE_REASSESSMENT_PROOF | source audit §3 `BASELINE_REASSESSMENT_PROOF` |
| SOURCE_AUDIT_UNMODIFIED | `YES` |
| ACCEPTED_AUTHORITY_UNMODIFIED | `YES` |
| REMEDIATION_RECOVERY_MODE | `RESUME_OR_RECONCILE` |
| INTERRUPTED_ATTEMPT_DETECTED | `YES` |
| CANDIDATE_STATE_CLASSIFICATION | `COMPLETE_CLAIM_UNVERIFIED` |
| CANDIDATE_PATHS | `docs/specs/SPEC-EXEC-001-skill-contracts-and-capability-registry.md` |
| REMEDIATION_CANDIDATE_FINGERPRINT | `556f4b5ad0b1c8f10d4fd00964d84e1af5bb959724d023eed9bda12a282411b2` (LF-normalized reconciled candidate) |

The source audit's assessed repository baseline was the pre-checkpoint semantic
state (`5f60edcbe7c42b7df5e8b72b7a6018ea1f7e57fd`). The current HEAD is the
completed audit-phase checkpoint and changed only the current audit/checkpoint
documentary handoff, not accepted authority, production code, tests or the
component SPEC baseline. This assessed checkpoint drift is consumed as the
current remediation handoff and does not make the source audit stale.

Recovery proof: the source audit remained unmodified, accepted authority
remained unmodified, the only candidate path was the declared component SPEC,
and no production or test path was dirty. The candidate was revalidated against
`CSC-MAJOR-003` and `CSC-MAJOR-004`; its completion marker was not trusted until
this report, target fingerprint, findings ledger, traceability, acceptance and
metrics were reconciled.

## 3. Source audit

The complete current source audit is
`docs/specs/audits/SPEC-EXEC-001-component-conformance-audit.md`. Its exact
verdict is `FAIL — COMPONENT_SPEC_NON_CONFORMANT`, with the two actionable
MAJOR findings `CSC-MAJOR-003` and `CSC-MAJOR-004`, and
`READY_FOR_GAP_MATRIX: NO`. The audit's baseline reassessment is complete and
actionable; no ADR, portfolio or upstream blocker is present.

Finding `CSC-MAJOR-002` is historical lineage only. The source audit explicitly
records that the revision-4 overlap rule is independently adequate and that the
current defects are newly exposed registry reconstruction progression and
registry mutation concurrency semantics. Both current findings were revalidated
against revision 4 before editing.

## 4. Authority used

Authority precedence was preserved exactly:

```text
accepted ADR > approved SPEC portfolio decomposition > conformant upstream SPEC
> validated independent component audit > component SPEC > repository evidence
```

| Authority | Revision/evidence | Use |
|---|---|---|
| `ADR-0003` | revision `3`, `ACCEPTED`; SHA-256 `6325234bb9c927a6d2b38886206119c643a05718f6db8cce8df5625653260073` | envelope, semantic versions, exact basis, fail-closed contracts, registry and manifest |
| `ADR-0001` | revision `3`, `ACCEPTED` | canonical DOM identity, revision, snapshot and lineage consumed without redefinition |
| `ADR-0002` | revision `3`, `ACCEPTED` | domain lifecycle, command preconditions and advancement remain DOM-owned |
| `ADR-0006` | revision `3`, `ACCEPTED` | physical persistence, CAS/storage mechanisms, effect idempotency and recovery remain PLAT-owned |
| `ADR-0009` | revision `3`, `ACCEPTED` | independent audit/remediation cycle boundary |
| `ADR-0010` | revision `3`, `ACCEPTED` | enabled NORMAL source and independent BOOTSTRAP boundary |
| `ADR-0011` | revision `3`, `ACCEPTED` | application and transport mapping boundary |
| `SPEC-PORTFOLIO-001` | revision `2`; portfolio audit `PORTFOLIO_DECOMPOSITION_APPROVED` | ownership `O-016`–`O-021`, failure/compatibility allocation and DAG |
| `SPEC-DOM-001` | revision `4`; latest audit `PASS — COMPONENT_SPEC_CONFORMANT` | consumed `RepositoryId`, snapshot, identity and lifecycle contracts |

No accepted ADR, portfolio, upstream SPEC, source audit or downstream planning
artifact was modified. The corrections are component-scoped elaborations of
EXEC-owned `O-020` and preserve the approved single normative edge
`SPEC-EXEC-001 → SPEC-DOM-001`.

## 5. Findings ledger

| Finding | Severity | Category | Authority | Root cause | Target section | Planned correction | Validation |
|---|---|---|---|---|---|---|---|
| `CSC-MAJOR-003` | MAJOR | `RECONSTRUCTION_AUTHORITY_GAP / SPEC_IMPLEMENTABILITY_FAILED` | ADR-0003/O-020; approved portfolio; consumed DOM identity/snapshot contracts | `SPEC_COMPLETENESS_DEFECT` | §§12.1, 12.3–12.4, `EXEC-REGISTRY-004`, C-EXEC-022, AC-EXEC-019/021 | Define source-backed `CatalogBasisProgression`, predecessor/successor relation, digests, source sequence, resolver ownership and fail-closed forged-later behavior | direct legitimate-successor and forged/skipped/detached/inconsistent witnesses; implementer simulation passes |
| `CSC-MAJOR-004` | MAJOR | `CONCURRENCY_SEMANTICS_GAP / SPEC_IMPLEMENTABILITY_FAILED` | ADR-0003/O-020; ADR-0006 physical boundary; approved portfolio | `SPEC_COMPLETENESS_DEFECT` | §§12.1, 12.3–12.4, `EXEC-REGISTRY-001`, `EXEC-REGISTRY-004`, C-EXEC-023, AC-EXEC-022 | Define expected catalog revision, stale/concurrent rejection, atomic semantic boundary, deterministic mutation key, duplicate retry and ambiguous-outcome reconciliation without freezing storage technology | direct concurrent/stale/idempotent/ambiguous-retry witnesses; implementer simulation passes |

Every source finding is classified `REMEDIATE`. No finding is classified as
portfolio, ADR or upstream remediation. The corrections use no new owner,
normative dependency, storage technology, route, class, module or plan.

| Finding | Before | Remediation | Authority | Local proof | Status |
|---|---|---|---|---|---|
| `CSC-MAJOR-003` | Revision 4 required numeric `CatalogRevision` continuity and claimed forged-later rejection, but did not define authoritative predecessor/successor evidence or how a self-consistent forged later basis is distinguished. | Revision 5 requires source-backed `CatalogBasisProgression` with explicit genesis/predecessor/successor, digests and `SourceSequence`; EXEC-001 validates it before rehydration and rejects absent, detached, skipped, divergent or forged-later material with `CONTRACT_INVALID` and no mutation. | ADR-0003/O-020; DOM `RepositoryId`/snapshot contracts; REPO/PLAT remain material/integrity providers | §§12.1, 12.3–12.4; AC-EXEC-019/021; C-EXEC-018/020/022; traceability row | `REMEDIATED` |
| `CSC-MAJOR-004` | Revision 4 defined duplicate/overlap no-mutation but did not define expected revision, stale concurrent writes, atomicity, competing successor ordering or duplicate/idempotent registry retry. | Revision 5 requires `ExpectedCatalogRevision`, deterministic `RegistryMutationKey`, one-successor-or-no-mutation atomic semantics, stale `CONTRACT_INVALID`/`STALE_CATALOG_BASIS`, no merge/last-writer-wins, original-result replay for identical retries and authority-first reconciliation after ambiguity. | ADR-0003/O-020; ADR-0006 physical boundary; EXEC-001 registry ownership | §§12.1, 12.3–12.4, 14–16; AC-EXEC-022; C-EXEC-023; traceability row | `REMEDIATED` |

## 6. Files changed

| File | Change |
|---|---|
| `docs/specs/SPEC-EXEC-001-skill-contracts-and-capability-registry.md` | Advanced revision 4 to revision 5; added the authority-backed catalog progression, reconstruction rejection, expected-revision concurrency, atomicity, idempotency, retry/reconciliation, acceptance and conformance evidence while preserving all existing ownership and boundaries. |
| `docs/specs/remediations/SPEC-EXEC-001-component-spec-remediation.md` | Replaced the stale prior-round report with this current source-audit identity, finding ledger, evidence, metrics and re-audit handoff. |

No ADR, portfolio, upstream SPEC, audit report, Gap Matrix, Implementation
Plan, ticket, production code or test was modified.

## 7. Owned obligation remediation

Ownership remains exactly the six approved EXEC obligations `O-016`–`O-021`.
`O-020` is now fully represented by authority-backed registry identity,
progression, reconstruction, mutation and retry semantics. No foreign
obligation was absorbed.

```text
PORTFOLIO_OBLIGATIONS_OWNED = 6
PORTFOLIO_OBLIGATIONS_COVERED = 6
OWNED_OBLIGATIONS_UNCOVERED = 0
OWNED_OBLIGATIONS_PARTIAL = 0
OWNED_OBLIGATIONS_WITHOUT_REQUIREMENT = 0
```

## 8. Upstream contract remediation

No upstream contract was changed. EXEC-001 continues to consume DOM
`RepositoryId`, snapshot and lifecycle/identity references. REPO supplies
NORMAL configuration material, the independent system source supplies
BOOTSTRAP material, and PLAT supplies physical persistence/integrity/order and
recovery. None can define EXEC registry progression or mutation meaning.

```text
CONSUMED_CONTRACTS = 2
CONSUMED_CONTRACTS_REDEFINED = 0
UPSTREAM_CONTRACT_GAPS = 0
```

## 9. Requirement authority remediation

The existing 19 requirements remain the normative inventory. The corrections
extend `EXEC-REGISTRY-001` and `EXEC-REGISTRY-004`; they do not add an
unsupported requirement or architecture. The new semantics are legitimate
SPEC elaborations of ADR-0003/O-020's explicit versioned registry and exact
basis, constrained by DOM identity and the PLAT physical boundary.

| Requirement ID | Portfolio obligation | ADR authority | Owned/consumed role | Normative correction | Acceptance/conformance |
|---|---|---|---|---|---|
| `EXEC-REGISTRY-001` | `O-020` | ADR-0003, `Decisão` | EXEC canonical owner | mutation carries expected revision and deterministic key; complete validation/publish is atomic; stale and conflicting retries fail or replay deterministically | AC-EXEC-008/022; C-EXEC-004/021/023 |
| `EXEC-REGISTRY-004` | `O-020` | ADR-0003, ADR-0010, consumed DOM contracts | EXEC canonical owner; DOM identity consumed; REPO/PLAT material boundaries preserved | persisted basis carries source-backed predecessor/successor progression, causal continuity and semantic rehydration/retry rejection | AC-EXEC-019/021/022; C-EXEC-018/020/022/023 |

```text
NORMATIVE_REQUIREMENTS = 19
REQUIREMENTS_WITHOUT_AUTHORITY = 0
REQUIREMENTS_WITHOUT_PORTFOLIO_AUTHORITY = 0
REQUIREMENTS_WITHOUT_ADR_AUTHORITY = 0
```

## 10. Lifecycle/identity remediation

A catalog basis now has explicit genesis and successor lifecycle. Genesis uses
`PredecessorCatalogRevision = NONE`; a successor must identify the accepted
predecessor, matching content digest, successor digest and source sequence.
Rehydration is distinct from creation and materializes only after EXEC-001
validates scope, identity, references, disjoint sets, source observation and
progression. A valid successor is accepted only from the current basis; a
forged, skipped, detached or inconsistent later basis preserves the last valid
basis and fails closed.

`CatalogRevision` remains basis revision; semantic version remains contract
revision; `ExpectedCatalogRevision` is a mutation concurrency precondition and
not identity. `RegistryMutationKey` is an idempotency key and not identity.
DOM `RepositoryId` remains canonical for NORMAL and BOOTSTRAP remains
system-scoped. No alias or downstream consumer becomes authority.

```text
CONSUMED_CONTRACTS_REDEFINED = 0
RECONSTRUCTION_AUTHORITY_GAPS = 0
LIFECYCLE_AUTHORITY_GAPS = 0
```

## 11. Failure/recovery remediation

The existing canonical failure family remains `CONTRACT_INVALID` for invalid
basis, missing/forged progression, stale expected revision, concurrent
successor loss, idempotency-key conflict and invalid material. Its semantic
reason may identify `STALE_CATALOG_BASIS`; no new failure owner or family is
introduced. Unknown and incompatible capability outcomes remain distinct.

A mutation validates the complete proposal, progression, overlap and key before
one semantic accept/reject decision. Success creates one complete successor;
failure creates no entry, revision, snapshot, manifest or partial state. An
ambiguous response is reconciled against the authoritative registry by
`RegistryMutationKey` before retry. An identical confirmed retry returns the
original structured outcome; an absent result may retry only while the expected
basis remains current; an advanced basis returns stale. Historical replay uses
its original basis and progression and is never reinterpreted by the current
registry.

```text
FAILURE_OWNER_VIOLATIONS = 0
CONCURRENCY_SEMANTICS_GAPS = 0
```

## 12. Compatibility/cutover remediation

`NEW_CANONICAL_PATH`, `HISTORICAL_REPLAY` and `CUTOVER` remain EXEC-owned;
legacy adaptation remains a REPO consumer. A new registry basis is a new
successor, and an invalid or stale basis cannot replace the prior valid basis
or rewrite existing snapshots/manifests. Historical replay preserves the
source-backed progression belonging to the original basis.

```text
COMPATIBILITY_OWNER_VIOLATIONS = 0
```

## 13. Dependency remediation

The approved normative dependency remains exactly:

```text
SPEC-EXEC-001 → SPEC-DOM-001
```

The source progression evidence is part of the EXEC contract and does not add a
reverse dependency or promote REPO/PLAT to semantic owner.

```text
NORMATIVE_DEPENDENCIES = 1
UNAPPROVED_DEPENDENCIES = 0
MISSING_REQUIRED_DEPENDENCIES = 0
DEPENDENCY_DIRECTION_VIOLATIONS = 0
```

## 14. Projection boundary remediation

Registry basis, progression, stale outcomes and idempotent mutation results
are canonical EXEC material. REPO, PLAT, BACKEND, OPS, UI, logs, labels and
transport may supply material, persist, map or project them, but cannot invent
predecessor relations, choose a concurrent successor, turn stale into success,
or replace the registry authority. Physical CAS/serialization/order remains a
PLAT mechanism and is not itself causal semantic proof.

## 15. Acceptance/conformance remediation

The affected witnesses are direct and implementation-independent:

- `C-EXEC-022` proves genesis and legitimate successor rehydration from
  source-returned predecessor/successor, digest, scope and `SourceSequence`
  evidence; it rejects self-consistent forged-later, skipped, detached,
  foreign and divergent material without mutation.
- `C-EXEC-023` proves expected-revision validation, atomic one-successor-or-no-
  mutation, stale concurrent rejection, no merge/last-writer-wins, identical
  idempotent replay, conflicting-key rejection and authority-first retry after
  an ambiguous response.
- `AC-EXEC-019`, `AC-EXEC-021` and `AC-EXEC-022` map these behaviors to
  `EXEC-REGISTRY-004` and `EXEC-REGISTRY-001` without promoting productive
  availability or foreign implementation evidence.

```text
UNTESTABLE_REQUIREMENTS = 0
ACCEPTANCE_GAPS = 0
CAPABILITY_AVAILABILITY_CLASSIFICATION_ERRORS = 0
DOWNSTREAM_PROMOTION_WITHOUT_NEW_EVIDENCE = 0
```

## 16. Traceability remediation

The complete chain remains intact:

```text
ADR-0003 → O-016…O-021 → 19 requirements → acceptance/conformance evidence
```

`O-020` now maps to the extended registry requirements and direct progression
and mutation witnesses. No requirement or owned obligation is orphaned.

```text
OWNED_OBLIGATIONS_WITHOUT_REQUIREMENT = 0
REQUIREMENTS_WITHOUT_PORTFOLIO_AUTHORITY = 0
REQUIREMENTS_WITHOUT_ADR_AUTHORITY = 0
```

## 17. Gap classification remediation

The two findings are no longer unresolved SPEC gaps in the remediated target.
They are normative `NON_GAP` contract rules; the absent productive registry,
schemas, manifest persistence and runtime remain implementation gaps for the
future downstream planning phase. No Gap Matrix was created, regenerated or
completed by this remediation.

```text
ARCHITECTURE_GAPS = 0
PORTFOLIO_GAPS = 0
UPSTREAM_CONTRACT_GAPS = 0
SPECIFICATION_GAPS = 0
```

## 18. Implementation-plan leakage remediation

No file, class, module, route, database, library, phase, commit group, ticket,
worktree assignment or implementation sequence was frozen. The progression
record, expected revision, idempotency key, failure behavior and atomic
semantic boundary are observable contract semantics; physical mechanism
remains intentionally unfrozen.

```text
IMPLEMENTATION_PLAN_LEAKS = 0
```

## 19. Mechanical validation

```text
PORTFOLIO_OBLIGATIONS_OWNED = 6
PORTFOLIO_OBLIGATIONS_COVERED = 6
OWNED_OBLIGATIONS_UNCOVERED = 0
OWNED_OBLIGATIONS_PARTIAL = 0
NORMATIVE_REQUIREMENTS = 19
REQUIREMENTS_WITHOUT_AUTHORITY = 0
IMPLEMENTER_DECISION_CHECKS = 19
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
RECONSTRUCTION_AUTHORITY_GAPS = 0
CONCURRENCY_SEMANTICS_GAPS = 0
LIFECYCLE_AUTHORITY_GAPS = 0
ARCHITECTURE_GAPS = 0
PORTFOLIO_GAPS = 0
UPSTREAM_CONTRACT_GAPS = 0
IMPLEMENTATION_PLAN_LEAKS = 0
REMEDIATED_FINDINGS = 2
PARTIAL_FINDINGS = 0
BLOCKED_FINDINGS = 0
ACCEPTANCE_CRITERIA = 22
CONFORMANCE_TESTS = 23
```

The 19 normative requirements, 22 acceptance criteria and 23 unique
conformance scenarios are mechanically reconciled in the target. The current
source audit's two implementer-decision failures are both addressed; no
authority-consumption availability dimension was promoted.

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

No source-audit finding remains partial or blocked. This report does not emit
an independent conformance verdict and does not authorize Gap Matrix,
Implementation Plan, ticket, production or test work.

## 21. Reaudit readiness

```text
COMPONENT_SPEC_REMEDIATION_COMPLETE
READY_FOR_INDEPENDENT_COMPONENT_SPEC_REAUDIT
```

The target SPEC and this current remediation report are ready for the mandatory
component-SPEC remediation checkpoint and then a fresh independent
`audit-component-spec-conformance` run. The independent auditor, not this
remediation, must determine whether the target is conformant.
