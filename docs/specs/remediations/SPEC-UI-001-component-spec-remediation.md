# SPEC-UI-001 — Component SPEC Remediation

## 1. Remediation mode

```text
WRITE_ALLOWED AUDIT_DRIVEN ADR_FIRST PORTFOLIO_GOVERNED
UPSTREAM_CONTRACT_PRESERVING COMPONENT_SCOPED MINIMAL_SCOPE
NO_ARCHITECTURE_INVENTION NO_PORTFOLIO_REDESIGN
NO_IMPLEMENTATION_PLAN NO_TICKET_DECOMPOSITION
NO_PRODUCTION_IMPLEMENTATION NO_SELF_APPROVAL
```

This artifact records targeted remediation of the latest independent component
SPEC audit. It does not approve the component SPEC. A fresh independent
`audit-component-spec-conformance` run remains mandatory.

## 2. Baseline

| Item | Value |
|---|---|
| Component SPEC | `docs/specs/SPEC-UI-001-frontend-operational-client.md` |
| Component revision before | `1` |
| Component status before | `PROPOSED` |
| Component revision after | `2` |
| Component status after | `PROPOSED` |
| Portfolio | `SPEC-PORTFOLIO-001`, revision `2` |
| Portfolio verdict | `PORTFOLIO_DECOMPOSITION_APPROVED` |
| Owned obligations | `O-073` through `O-078` |
| Repository HEAD | `a58ce959f9b34f3c1c83ed41c01b058d31bf3366` |
| Working tree state | Pre-existing modifications and untracked artifacts were present; they were preserved. The target SPEC and this remediation evidence were the only files written by this remediation. |
| Relevant drift | None observed from the audited baseline before editing. Accepted ADRs, portfolio, upstream SPECs, source audit and referenced repository HEAD remained at the audited revisions. |

## 3. Source audit

| Item | Value |
|---|---|
| Source audit | `docs/specs/audits/SPEC-UI-001-component-conformance-audit.md` |
| Source verdict | `FAIL — COMPONENT_SPEC_NON_CONFORMANT` |
| Source audit SHA-256 at remediation | `40011AA17D2308BAEBD217442183B5028B5CA6C50A2981539754B7114C298E1E` |
| Validated findings | `CSC-MAJOR-001` |
| Source audit modification | None; the audit report remains unchanged. |

The finding was revalidated as `STILL_VALID` against the unchanged revision 1
component content before remediation. No finding was applied from stale or
superseded evidence.

## 4. Authority used

| Authority | Use in remediation |
|---|---|
| `ADR-0014`, revision `3`, `ACCEPTED` | local web client contract, operational views and complete operational follow-up |
| `ADR-0013`, revision `3`, `ACCEPTED` | operational records, logs, correlation, replay, retention, backup and export projections |
| `ADR-0011`, revision `3`, `ACCEPTED` | autonomous backend, authenticated application boundary, snapshots, events and replay |
| `ADR-0002`, revision `3`, `ACCEPTED` | state distinctions, command rejection and publication vocabulary |
| `ADR-0005`, revision `3`, `ACCEPTED` | capacity, queue and scheduling projections |
| `ADR-0008`, revision `3`, `ACCEPTED` | candidate, approval, integration, PR and remote-confirmation distinctions |
| `SPEC-PORTFOLIO-001`, revision `2` | approved ownership, obligation registry and dependency DAG |
| `SPEC-BACKEND-001`, revision `3` | authenticated snapshots, commands, events, replay and source correlation; latest audit `PASS — COMPONENT_SPEC_CONFORMANT` |
| `SPEC-OPS-001`, revision `2` | operational records, logs, provenance, availability, replay and export; latest audit `PASS — COMPONENT_SPEC_CONFORMANT` |

Accepted ADRs, approved portfolio decomposition and conformant upstream
contracts constrain the correction. Repository and prototype evidence were used
only as implementation-gap context, not as normative authority.

## 5. Findings ledger

| Finding | Severity | Category | Authority | Root cause | Target section | Planned correction | Validation |
|---|---|---|---|---|---|---|---|
| `CSC-MAJOR-001` | `MAJOR` | ADR translation / SPEC completeness / projection boundary | `ADR-0014` `Decisão`; `O-078`; `SPEC-OPS-001` operational-record and availability contracts | `ADR_TRANSLATION_DEFECT` | `UI-NAV-001`, `UI-FOLLOW-001`, `C-UI-004`, `AC-UI-004`, current-state navigation, gate | Explicitly require operational log inspection and preserve source identity, correlation, provenance and availability/staleness markers. | Updated requirement text, acceptance criterion, conformance test and traceability evidence |

The finding is classified `REMEDIATE`. It does not require ADR, portfolio or
upstream remediation.

| Finding | Before | Remediation | Authority | Local proof | Status |
|---|---|---|---|---|---|
| `CSC-MAJOR-001` | Operational follow-up named states, events, durations and other records but did not explicitly name log inspection, despite the accepted UI obligation to show logs. | Added `logs` to complete operational navigation and follow-up; required source identity, correlation, provenance and availability/staleness markers; expanded the linked acceptance and conformance evidence. | `ADR-0014` `Decisão`; `O-078`; `SPEC-OPS-001` operational record contracts | target `UI-NAV-001`, `UI-FOLLOW-001`, `C-UI-004`, `AC-UI-004`, `§23` | `REMEDIATED` |

## 6. Files changed

| File | Change |
|---|---|
| `docs/specs/SPEC-UI-001-frontend-operational-client.md` | Modified from revision 1 to revision 2 with only finding-driven requirement, acceptance, conformance, metadata and gate corrections |
| `docs/specs/remediations/SPEC-UI-001-component-spec-remediation.md` | Created as this remediation evidence artifact |

The source audit, accepted ADRs, approved portfolio, upstream SPECs, upstream
audits, Gap Matrices, Implementation Plans, tickets, production code and tests
were not modified.

## 7. Owned obligation remediation

The approved owner of `O-073` through `O-078` remains `SPEC-UI-001`. No
obligation was moved, duplicated or newly invented.

| Obligation | Remediation evidence |
|---|---|
| `O-073` | Backend snapshot, command, event and replay requirements remain covered by `UI-CLIENT-001/002`. |
| `O-074` | Complete source-faithful navigation remains covered by `UI-NAV-001/002`; `UI-NAV-001` now explicitly includes logs. |
| `O-075` | Owner-routed execution, intervention, evidence and publication controls remain covered by `UI-ACTION-001/002`. |
| `O-076` | Canonical publication vocabulary and remote-confirmed completion remain covered by `UI-PUB-001/002`. |
| `O-077` | Requested/accepted/rejected/confirmed and checkpoint-gated pause/cancellation display remain covered by `UI-STATE-001/002`. |
| `O-078` | Complete operational follow-up, including log inspection, and email-as-alert-only remain covered by `UI-FOLLOW-001/002`. |

All six owned obligations are fully covered after remediation. There are no
uncovered or partial owned obligations.

## 8. Upstream contract remediation

No upstream contract was changed. The target SPEC now consumes the existing
BACKEND and OPS records without redefining their ownership:

- `SPEC-BACKEND-001` remains the source of authenticated snapshots, commands,
  correlated events and replay.
- `SPEC-OPS-001` remains the source of operational records, logs, provenance,
  correlation, availability/staleness and export/replay records.
- The UI remains a non-authoritative projection and does not create, infer,
  confirm or complete a canonical operation.

The two approved normative dependencies remain exactly
`SPEC-BACKEND-001` and `SPEC-OPS-001`.

## 9. Requirement authority remediation

No new requirement was introduced. `UI-NAV-001` and `UI-FOLLOW-001` were
extended within the existing `O-074` and `O-078` boundary to translate the
accepted requirement that the interface show logs and provide complete
operational follow-up. The correction is directly grounded in `ADR-0014`
`Decisão` and the approved portfolio.

The revised wording is component-scoped, implementation-neutral, observable and
testable. No requirement lacks portfolio or ADR authority.

## 10. Lifecycle/identity remediation

No canonical lifecycle or identity rule was changed. The correction requires
log inspection to retain the source identity, correlation, provenance and
availability/staleness marker supplied by the owner contract. It therefore
strengthens source-faithful projection without creating a client-side log
authority, state machine or confirmation rule.

## 11. Failure/recovery remediation

No canonical failure family or recovery owner was changed. Missing, unavailable
or stale log records continue to follow the existing `UI-NAV-002` source-faithful
behavior: show the condition or request refresh, never fabricate a successful,
current or confirmed value.

## 12. Compatibility/cutover remediation

Compatibility ownership is unchanged. Historical or legacy log records remain
consumer-provided records with provenance and availability status; they do not
become a second canonical path. No cutover, retirement or legacy authority rule
was invented.

## 13. Dependency remediation

The approved dependency graph is unchanged:

```text
SPEC-UI-001 → SPEC-BACKEND-001
SPEC-UI-001 → SPEC-OPS-001
```

No new normative dependency, reversed edge, direction violation or missing
required dependency was introduced.

## 14. Projection boundary remediation

The target SPEC now explicitly identifies operational logs as source-backed
records available for UI inspection. The UI renders the owner-supplied source,
correlation, provenance and availability/staleness markers. It does not persist,
rewrite, infer, authorize or confirm log meaning or operational state.

## 15. Acceptance/conformance remediation

`AC-UI-004` now expressly requires reachable operational navigation and
inspection views that include log inspection with source identity, correlation
and availability/staleness markers. `C-UI-004` now exercises rendering of log
records alongside the existing operational records with source, correlation and
availability/staleness markers.

The suite remains at 12 binary acceptance criteria and 24 conformance tests.
Every normative requirement has acceptance and conformance evidence; the
validated acceptance gap is closed by explicit wording rather than by adding a
new requirement or test count.

## 16. Traceability remediation

The existing traceability row for `UI-FOLLOW-001` remains authoritative for
`O-078` and now points to the corrected requirement and evidence. The
`UI-NAV-001` row remains authoritative for `O-074`; its linked `AC-UI-004` and
`C-UI-004` now explicitly cover log inspection.

The local traceability invariants remain:

```text
REQUIREMENTS_WITHOUT_PORTFOLIO_OBLIGATION = 0
OWNED_OBLIGATIONS_WITHOUT_REQUIREMENT = 0
REQUIREMENTS_WITHOUT_ADR_AUTHORITY = 0
```

## 17. Gap classification remediation

The correction closes a SPEC-level translation defect only. The absence of a
production frontend, backend integration and OPS runtime remains an
`IMPLEMENTATION_GAP`; no production log viewer, API, projection store or test
implementation was created. No formal Gap Matrix, Implementation Plan or
ticket set was generated or completed.

## 18. Implementation-plan leakage remediation

No phases, files, classes, modules, routes, commit groups, tickets, worktree
assignments, implementation units or development sequencing were added. Log
inspection is a normative observable UI behavior; its implementation technology
and module boundaries remain intentionally unfrozen.

## 19. Mechanical validation

```text
PORTFOLIO_OBLIGATIONS_OWNED = 6
PORTFOLIO_OBLIGATIONS_COVERED = 6
OWNED_OBLIGATIONS_UNCOVERED = 0
OWNED_OBLIGATIONS_PARTIAL = 0
NORMATIVE_REQUIREMENTS = 12
REQUIREMENTS_WITHOUT_AUTHORITY = 0
UNTESTABLE_REQUIREMENTS = 0
ACCEPTANCE_GAPS = 0
CONSUMED_CONTRACTS = 8 contract groups
CONSUMED_CONTRACTS_REDEFINED = 0
NORMATIVE_DEPENDENCIES = 2
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
ACCEPTANCE_CRITERIA = 12
CONFORMANCE_TESTS = 24
```

The target SPEC mechanical validation and adversarial validation remain
consistent with these counts. The target revision is `2` and its final gate is
`READY_FOR_INDEPENDENT_COMPONENT_SPEC_REAUDIT`.

## 20. Remaining blockers

```text
ARCHITECTURE_BLOCKERS = 0
PORTFOLIO_BLOCKERS = 0
UPSTREAM_BLOCKERS = 0
IMPLEMENTATION_PLAN_BLOCKERS = 0
```

No remediation blocker remains. The independent audit verdict is intentionally
not self-closed by this artifact.

## 21. Reaudit readiness

```text
COMPONENT_SPEC_REMEDIATION_COMPLETE
SPEC: SPEC-UI-001
SOURCE_AUDIT: docs/specs/audits/SPEC-UI-001-component-conformance-audit.md
SOURCE_VERDICT: FAIL — COMPONENT_SPEC_NON_CONFORMANT
GATE: READY_FOR_INDEPENDENT_COMPONENT_SPEC_REAUDIT
```

The next mandatory action is a fresh independent
`audit-component-spec-conformance` run against revision `2`. Only that audit
may determine whether the component SPEC is conformant.
