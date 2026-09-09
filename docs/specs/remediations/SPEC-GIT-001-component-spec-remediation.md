---
schema_version: "1.0.0"
id: SPEC-GIT-001-COMPONENT-SPEC-REMEDIATION
status: EVIDENCE
component: SPEC-GIT-001
source_audit: docs/specs/audits/SPEC-GIT-001-component-conformance-audit.md
source_verdict: FAIL — COMPONENT_SPEC_NON_CONFORMANT
result: COMPONENT_SPEC_REMEDIATION_COMPLETE
portfolio: SPEC-PORTFOLIO-001
portfolio_revision: 2
---

# SPEC-GIT-001 — Component SPEC Remediation

## 1. Remediation mode

```text
WRITE_ALLOWED
AUDIT_DRIVEN
ADR_FIRST
PORTFOLIO_GOVERNED
UPSTREAM_CONTRACT_PRESERVING
COMPONENT_SCOPED
MINIMAL_SCOPE
NO_ARCHITECTURE_INVENTION
NO_PORTFOLIO_REDESIGN
NO_IMPLEMENTATION_PLAN
NO_TICKET_DECOMPOSITION
NO_PRODUCTION_IMPLEMENTATION
NO_SELF_APPROVAL
```

This remediation applies only the three validated findings from the latest
independent component SPEC conformance audit. It does not approve the SPEC.
Independent re-audit remains mandatory.

## 2. Baseline

| Item | Value |
|---|---|
| Component SPEC | `docs/specs/SPEC-GIT-001-worktrees-waves-and-publication.md` |
| Component revision before | `1` / `PROPOSED` |
| Component revision after | `2` / `PROPOSED` |
| Portfolio | `SPEC-PORTFOLIO-001`, revision `2` |
| Portfolio verdict | `PORTFOLIO_DECOMPOSITION_APPROVED` |
| Primary ADRs | `ADR-0007`, `ADR-0008`, accepted revision `3` |
| Upstream SPECs | DOM-001 rev. 2, PLAT-001 rev. 1, REPO-001 rev. 2 |
| Repository HEAD | `115607e4d0dc51f509b4fdf78ce4f873f46c3230` |
| Working tree before remediation | untracked `.codex/`, target SPEC, source audit |
| Working tree after remediation | target SPEC, source audit, this report, pre-existing `.codex/`, and an untracked `docs/tickets/` directory observed after the remediation writes; the ticket directory was not created or modified by this workflow |
| Authority cutoff | accepted ADRs, approved portfolio revision 2, conformant upstream audits and source audit findings available on `2026-09-09` |

## 3. Source audit

Source:

```text
docs/specs/audits/SPEC-GIT-001-component-conformance-audit.md
```

Source verdict:

```text
FAIL — COMPONENT_SPEC_NON_CONFORMANT
```

Validated findings:

- `CSC-MAJOR-001`: wave cancellation and next-wave approved-base invariants
  were incomplete.
- `CSC-MAJOR-002`: exact commit milestones and documentary file-scope rules
  were incomplete.
- `CSC-MAJOR-003`: direct-push local merge into main was not normative.

No ADR clarification, portfolio remediation or upstream remediation was
required by the source audit.

## 4. Authority used

| Authority | Use |
|---|---|
| `ADR-0007` / Decisão and Proteção do candidato documental | wave cancellation/base progression, commit milestones, documentary scope, candidate hash and retention |
| `ADR-0008` / Decisão | direct-push queue, fetch, local merge, controlled idempotent push and confirmation |
| `SPEC-PORTFOLIO-001` O-041, O-043, O-044, O-046 | approved GIT ownership and traceability |
| `SPEC-DOM-001` | canonical identity, publication vocabulary and audit-basis contracts |
| `SPEC-PLAT-001` | durable intent/evidence/idempotency/reconciliation contracts |
| `SPEC-REPO-001` | enabled repository and configured publication mode |
| source independent audit | validated defect evidence and required remediation types |

## 5. Findings ledger

| Finding | Before | Remediation | Authority | Local proof | Status |
|---|---|---|---|---|---|
| `CSC-MAJOR-001` | `GIT-WAVE-001` covered approved complete waves but omitted audited cancellation review and the integrated approved base for the next wave | extended `GIT-WAVE-001`; added `AC-GIT-017` and `C-GIT-030` | ADR-0007, O-041 | requirement now requires DAG review, exclusive conflict resolver plus independent audit, and approved-base progression | `REMEDIATED` |
| `CSC-MAJOR-002` | `GIT-COMMIT-001` used broad milestone categories; `GIT-CANDIDATE-001` did not exclude every outside-SPEC file | added exact five-step milestone sequence, READY placement, audit evidence and documentary scope prohibition; added `AC-GIT-018/019` and `C-GIT-031/032` | ADR-0007, O-043/O-044 | requirements now reject invalid milestone/scope paths | `REMEDIATED` |
| `CSC-MAJOR-003` | `GIT-APPROVAL-001` required queue/fetch/idempotent push but local merge into main appeared only in the behavioral model | made local merge into main an ordered normative precondition; added `AC-GIT-020` and `C-GIT-033` | ADR-0008, O-046 | direct-push publication now fails unless local merge follows basis validation and precedes push | `REMEDIATED` |

All findings were revalidated against current target content before editing and
remained `STILL_VALID`. No finding was stale or invalidated by drift.

## 6. Files changed

| File | Change |
|---|---|
| `docs/specs/SPEC-GIT-001-worktrees-waves-and-publication.md` | revision 1→2; three finding-driven requirement extensions; four acceptance criteria; four conformance tests; traceability and counts synchronized |
| `docs/specs/remediations/SPEC-GIT-001-component-spec-remediation.md` | this remediation evidence report |

The source audit and all authority/upstream artifacts were not modified. The
untracked `docs/tickets/` directory was observed but not touched; it remains
outside this remediation's allowed write set.

## 7. Owned obligation remediation

### O-041 — Complete audited waves

`GIT-WAVE-001` now requires, in addition to individual approval, valid
dependency closure and integration audit:

- audited DAG review before ticket or wave cancellation is accepted;
- exclusive conflict resolution followed by independent audit; and
- the next wave to use only the prior integrated and approved base.

This preserves O-031/EXEC-002 blocking distinctions as consumed semantics and
does not move ticket lifecycle authority from DOM/EXEC.

### O-043/O-044 — Commit milestones and candidate scope

`GIT-COMMIT-001` now enumerates the ADR-0007 sequence: already-committed
accepted ADRs; documentary commit after the complete approved document set;
individual implementation commit after ticket audit; ticket-finalization
commit after wave integration/audit with READY changes attached to the
finalization removing the last blocker; and one final approved-remediation
commit. It also rejects files outside the owning SPEC boundary.

`GIT-CANDIDATE-001` now states that the protected documentary commit contains no
file outside the SPEC boundary, while retaining exact tree revalidation and
resource retention.

### O-046 — Direct-push sequence

`GIT-APPROVAL-001` now requires the ordered sequence:

```text
human approval
    → exclusive serial queue
    → fetch and main-basis validation
    → local merge of the validated SPEC branch into main
    → controlled idempotent push
```

Basis, local merge result or candidate drift still invalidates approval, and
failed push still preserves PLAT-reconcilable evidence without destructive
reset.

## 8. Upstream contract remediation

No upstream contract required remediation. DOM, PLAT and REPO contracts remain
referenced rather than redefined:

- DOM continues to own canonical identity, publication vocabulary and audit
  basis;
- PLAT continues to own durable effect intent, evidence, idempotency and
  reconciliation; and
- REPO continues to own repository configuration, enablement and publication
  mode.

`CONSUMED_CONTRACTS_REDEFINED = 0`.

## 9. Requirement authority remediation

No requirement changed authority owner or dependency direction. The existing
requirements remain directly derived from their approved ADR/portfolio
obligations:

| Requirement | Obligation | ADR | Authority result |
|---|---|---|---|
| `GIT-WAVE-001` | O-041 | ADR-0007 | authority preserved; semantic coverage extended |
| `GIT-COMMIT-001` | O-043 | ADR-0007 | authority preserved; exact milestone sequence added |
| `GIT-CANDIDATE-001` | O-044 | ADR-0007 | authority preserved; documentary scope added |
| `GIT-APPROVAL-001` | O-046 | ADR-0008 | authority preserved; local merge step added |

No unbacked normative requirement was introduced.

## 10. Lifecycle/identity remediation

The remediation completes the GIT-owned wave, commit and direct-push lifecycle
sequences without inventing a new canonical state machine:

- cancellation now has an audited-DAG precondition;
- wave progression now has an integrated-approved-base precondition;
- commit milestones now have explicit ordered admission conditions; and
- direct push now has an explicit local-merge-before-push transition.

Canonical `RepositoryId`, `SpecId`, `TicketId`, `WaveId` and `PublicationId`
remain DOM-owned. Branches, worktrees, commits and hashes remain local/evidence
identities and are not promoted to canonical domain identities.

## 11. Failure/recovery remediation

No failure owner changed. The existing publication failures remain GIT-owned:
`PUBLICATION_DRIFT`, `MERGE_CONFLICT` and
`REMOTE_PUBLICATION_UNCONFIRMED`. The new invalid paths preserve their existing
fail-closed behavior:

- cancellation without DAG review blocks;
- next-wave use of an unapproved base blocks;
- invalid commit milestone or outside-SPEC documentary content blocks; and
- direct push without local merge blocks.

PLAT still owns effect reconciliation and retry/recovery semantics. No local
failure mapping changes canonical meaning or retryability.

## 12. Compatibility/cutover remediation

No compatibility ownership changed. The existing GIT roles remain:

| Class | Role | Preservation |
|---|---|---|
| `NEW_CANONICAL_PATH` | owner | exact branch/wave/publication behavior |
| `LEGACY_COMPATIBILITY` | owner for GIT-side adaptation; REPO owns legacy repository meaning | adapter only; no second authority |
| `HISTORICAL_REPLAY` | owner | candidate/tree/evidence history is not rewritten |
| `CUTOVER` | owner | remote confirmation remains required |
| `RETIREMENT` | owner | cleanup remains after confirmation |

## 13. Dependency remediation

No dependency changed. The declared edges remain exactly the approved direct
normative dependencies:

```text
SPEC-GIT-001 → SPEC-DOM-001
SPEC-GIT-001 → SPEC-PLAT-001
SPEC-GIT-001 → SPEC-REPO-001
```

No downstream component is required to define GIT behavior, and no new
normative edge was introduced.

## 14. Projection boundary remediation

No projection ownership changed. GIT publication evidence remains canonical for
Git/remote facts; DOM remains canonical for domain publication state; PLAT
remains canonical for durable effect state. BACKEND, OPS and UI remain mappings
or projections and cannot authorize completion.

The new tests `C-GIT-030` through `C-GIT-033` are conformance evidence, not
implementation prescriptions or projection authority.

## 15. Acceptance/conformance remediation

Added binary acceptance criteria:

| ID | Coverage |
|---|---|
| `AC-GIT-017` | cancellation DAG review, conflict audit and next-wave approved base |
| `AC-GIT-018` | exact milestone sequence and READY placement |
| `AC-GIT-019` | documentary commit rejects outside-SPEC files |
| `AC-GIT-020` | direct push requires local merge into main before push |

Added falsification tests:

| ID | Coverage |
|---|---|
| `C-GIT-030` | rejects missing cancellation/conflict/base invariants |
| `C-GIT-031` | rejects invalid milestone sequence and READY placement |
| `C-GIT-032` | rejects outside-SPEC documentary content |
| `C-GIT-033` | rejects direct push without local merge |

Acceptance criteria total is now `20`; conformance tests total is now `33`.

## 16. Traceability remediation

The traceability matrix was updated without changing requirement IDs or owners:

| Requirement | Portfolio obligation | ADR | New acceptance/test coverage |
|---|---|---|---|
| `GIT-WAVE-001` | O-041 | ADR-0007 / Decisão | AC-GIT-017; C-GIT-030 |
| `GIT-COMMIT-001` | O-043 | ADR-0007 / Decisão | AC-GIT-018; C-GIT-031 |
| `GIT-CANDIDATE-001` | O-044 | ADR-0007 / Proteção do candidato documental | AC-GIT-019; C-GIT-032 |
| `GIT-APPROVAL-001` | O-046 | ADR-0008 / Decisão | AC-GIT-020; C-GIT-033 |

The local traceability invariants remain:

```text
OWNED_OBLIGATIONS_WITHOUT_REQUIREMENT = 0
REQUIREMENTS_WITHOUT_PORTFOLIO_AUTHORITY = 0
REQUIREMENTS_WITHOUT_ADR_AUTHORITY = 0
```

## 17. Gap classification remediation

No gap classification changed. The absence of productive Git/GitHub/worktree
integration remains an `IMPLEMENTATION_GAP`; prototype scenarios remain
`PROTOTYPE_ONLY`; accepted authority and upstream audits remain
`ALREADY_CONFORMANT`; and no architecture or portfolio gap was created.

The remediation did not create or update a formal Gap Matrix.

## 18. Implementation-plan leakage remediation

No implementation-plan leakage was introduced. The corrections specify
normative ordering and evidence conditions required by ADR-0007/0008, but do
not specify files, classes, modules, libraries, storage technology, routes,
implementation phases, tickets or worktree assignments.

## 19. Mechanical validation

```text
PORTFOLIO_OBLIGATIONS_OWNED = 10
PORTFOLIO_OBLIGATIONS_COVERED = 10
OWNED_OBLIGATIONS_UNCOVERED = 0
OWNED_OBLIGATIONS_PARTIAL = 0
NORMATIVE_REQUIREMENTS = 10
REQUIREMENTS_WITHOUT_AUTHORITY = 0
CONSUMED_CONTRACTS = 8
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
REMEDIATED_FINDINGS = 3
PARTIAL_FINDINGS = 0
BLOCKED_FINDINGS = 0
```

Validation performed:

- ten requirement headings and ten traceability rows remain present;
- all O-039…O-048 obligations remain represented;
- 20 acceptance criteria and 33 conformance tests are present;
- no `BLOCKED —` condition, architecture question or implementation-plan
  heading was introduced;
- source audit still records the original failure verdict and was not modified;
- only the target SPEC and this remediation report were written by the
  remediation workflow.

## 20. Remaining blockers

```text
ARCHITECTURE_BLOCKERS = 0
PORTFOLIO_BLOCKERS = 0
UPSTREAM_BLOCKERS = 0
REMEDIATION_BLOCKERS = 0
```

The SPEC is not declared conformant by this report. Independent re-audit is
required.

## 21. Reaudit readiness

All validated findings have been remediated with authority-backed, local
changes. The target SPEC is ready for a fresh independent
`audit-component-spec-conformance` run.

```text
COMPONENT_SPEC_REMEDIATION_COMPLETE
READY_FOR_INDEPENDENT_COMPONENT_SPEC_REAUDIT
```
