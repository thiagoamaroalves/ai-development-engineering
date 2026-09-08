# SPEC-DOM-001 — Component SPEC Remediation

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

## 2. Baseline

| Field | Value |
|---|---|
| Component SPEC | `SPEC-DOM-001` |
| Revision before | `1` |
| Revision after | `2` |
| Status | `PROPOSED` |
| Portfolio | `SPEC-PORTFOLIO-001`, revision `2` |
| Portfolio verdict | `PORTFOLIO_DECOMPOSITION_APPROVED` |
| Repository HEAD | `b1c2c4ab81ba716ccd079f80f187f6b773e0655f` |
| Working tree | Existing untracked target SPEC and audit directory preserved; no unrelated files modified |
| Upstream normative SPECs | none; DOM is the approved DAG root |

The source SPEC declared generation HEAD
`d42a2dbe4d9e40dc7f139df920eb0a134c085aaf`; the source audit records the
current repository HEAD above. This documentary baseline drift does not alter
the accepted ADR or portfolio authority used here.

## 3. Source audit

| Field | Value |
|---|---|
| Source audit | `docs/specs/audits/SPEC-DOM-001-component-conformance-audit.md` |
| Source verdict | `FAIL — COMPONENT_SPEC_NON_CONFORMANT` |
| Audit findings | `CSC-CRITICAL-001`, `CSC-MAJOR-001`, `CSC-MINOR-001` |
| Audit date | `2026-09-08` |
| Required next gate | independent component SPEC re-audit |

The source audit explicitly confirms the portfolio approval, sufficient ADR
authority, zero upstream normative dependencies, and three locally remediable
findings.

## 4. Authority used

Authority was applied in this order:

```text
accepted ADR
  > approved SPEC portfolio decomposition
  > conformant upstream component SPEC
  > validated independent component audit
  > component SPEC
  > repository implementation
  > tests
  > prototype
  > historical evidence
```

Primary authority:

| Authority | Use |
|---|---|
| `docs/adrs/ADR-0001-workflow-domain-and-identity.md` | persistent identity, agent identity, lineage and identity authority |
| `docs/adrs/ADR-0002-pipeline-state-machines-and-transitions.md` | pipeline, state and command semantics |
| `docs/adrs/ADR-0009-audit-remediation-and-final-conformance.md` | audit cycles and conformance semantics |
| `docs/specs/SPEC-PORTFOLIO-001-organization.md` | O-001 ownership and approved dependency graph |
| `docs/specs/SPEC-PORTFOLIO-001-decomposition-audit.md` | portfolio approval evidence |
| source component audit | validated defect inventory and revalidation conditions |

No ADR, portfolio, upstream SPEC, audit report, Gap Matrix, Implementation Plan,
ticket, production code or test was modified.

## 5. Findings ledger

| Finding | Severity | Category | Authority | Root cause | Target section | Planned correction | Validation |
|---|---|---|---|---|---|---|---|
| `CSC-CRITICAL-001` | CRITICAL | portfolio ownership / identity authority | ADR-0001; O-001 | `PORTFOLIO_CONFORMANCE_DEFECT` | Identity and Authority Rules | Restore DOM as canonical owner of `ExternalEffectId` and `PublicationId`; retain PLAT/GIT execution responsibilities | identity table has DOM owner and explicit owner split |
| `CSC-MAJOR-001` | MAJOR | identity completeness / lineage | ADR-0001; O-001 | `SPEC_COMPLETENESS_DEFECT` | Identity and Authority Rules; DOM-ID-001; AC-DOM-001 | Add explicit `AgentId` identity and its assignment/session lineage constraints | `AgentId` row, acceptance and C-24 |
| `CSC-MINOR-001` | MINOR | traceability / acceptance auditability | ADR-0001/0002/0009; O-002/O-009/O-010/O-011/O-012/O-013/O-049/O-052 | `TRACEABILITY_DEFECT` | Traceability; Conformance Suite | Align requirement-to-proof cells with directly relevant AC/C evidence | every declared proof directly describes the mapped requirement |

All three findings were revalidated as still present before editing. None
required ADR, portfolio or upstream remediation.

## 6. Files changed

Changed:

- `docs/specs/SPEC-DOM-001-workflow-authority-and-governance.md`
- `docs/specs/remediations/SPEC-DOM-001-component-spec-remediation.md`

Explicit no-change flags:

| Artifact | Changed? |
|---|---|
| Accepted ADRs | NO |
| Approved portfolio and registries | NO |
| Conformant upstream SPECs | NO; none required |
| Source audit | NO |
| Gap Matrix | NO |
| Implementation Plan | NO |
| Tickets | NO |
| Production code | NO |
| Tests | NO |

## 7. Owned obligation remediation

O-001 remains owned by `SPEC-DOM-001` and is now fully represented. The
identity catalog explicitly includes `AgentId`, `ExternalEffectId` and
`PublicationId` under DOM canonical identity authority. The catalog separately
states that assignment/session, persistence/reconciliation and
execution/confirmation remain the responsibilities of EXEC, PLAT and GIT.

The other 20 owned obligations were preserved without semantic changes.

## 8. Upstream contract remediation

There are no upstream normative component SPECs for the DOM root. No upstream
contract was changed or copied. Downstream relationships remain mappings or
projections and do not create DOM normative dependencies.

## 9. Requirement authority remediation

`DOM-ID-001` was extended only to materialize the O-001 identity consequences
already required by ADR-0001: creation, uniqueness, immutability, scope,
revision/lineage and historical resolution. The requirement now distinguishes
`AgentId` from assignment/activity/session and distinguishes effect/publication
identity from persistence/execution/confirmation mechanisms.

No new architectural decision or unbacked normative requirement was added.

## 10. Lifecycle/identity remediation

The identity table now contains an explicit `AgentId` row with DOM canonical
ownership and assignment/session correlation. `ExternalEffectId` and
`PublicationId` now have DOM canonical ownership while preserving PLAT and GIT
execution boundaries. The correction preserves distinct logical, execution,
assignment, session, persistence, provider and presentation identities.

## 11. Failure/recovery remediation

No failure or recovery ownership defect was reported. Existing DOM failure
families and the delegation of physical retry, journal replay, effect
reconciliation and publication recovery remain unchanged.

## 12. Compatibility/cutover remediation

No compatibility or cutover ownership defect was reported. Legacy behavior
remains a consumer/adapter path, historical replay remains DOM-owned where
approved, and no second canonical path was introduced.

## 13. Dependency remediation

No dependency correction was required. `SPEC-DOM-001` remains the approved DAG
root with:

```text
NORMATIVE_DEPENDENCIES = 0
UNAPPROVED_DEPENDENCIES = 0
MISSING_REQUIRED_DEPENDENCIES = 0
DEPENDENCY_DIRECTION_VIOLATIONS = 0
```

## 14. Projection boundary remediation

The owner split is explicit: DOM owns canonical identity, PLAT owns effect
persistence/reconciliation, and GIT owns publication execution/confirmation.
Backend, OPS and UI remain transport or projection surfaces. No projection or
transport surface became canonical authority.

## 15. Acceptance/conformance remediation

`AC-DOM-001` now covers the complete identity catalog, including assigned agent,
external effect and publication identity. A dedicated `C-24` adversarial probe
verifies owner preservation, lineage relations and the separation from
assignment/session, persistence, execution and confirmation.

The existing requirement-to-proof mappings were corrected:

| Requirement group | Correction |
|---|---|
| Snapshot | `DOM-SNAPSHOT-001` now points to `AC-DOM-003` and `C-08`, which cover snapshot integrity and divergence |
| Manual entry | `DOM-INGEST-001` now points to `AC-DOM-002` only |
| Lifecycle/immutability | `DOM-LIFE-001` and `DOM-IMMUT-001` point to their direct AC rows |
| Pipeline/state/command | `DOM-PIPE-001`, `DOM-STATE-001` and `DOM-CMD-001` point to their direct AC rows |
| Ticket states/transitions | `DOM-TICKET-001` points to `AC-DOM-012`; `DOM-TICKET-002` points to `AC-DOM-013`, `C-03`, `C-09` |
| Audit cycles/final conformance/evidence | `DOM-AUDIT-001`, `DOM-AUDIT-004` and `DOM-AUDIT-006` point to their direct AC rows |

## 16. Traceability remediation

The ADR → obligation → requirement mappings remain one-to-one for the 21 DOM
obligations. The requirement-to-proof cells now reference evidence whose stated
behavior directly tests the mapped requirement. O-001 maps to
`DOM-ID-001`, `AC-DOM-001`, `C-01` and `C-24`.

```text
OWNED_OBLIGATIONS_WITHOUT_REQUIREMENT = 0
REQUIREMENTS_WITHOUT_PORTFOLIO_AUTHORITY = 0
REQUIREMENTS_WITHOUT_ADR_AUTHORITY = 0
```

## 17. Gap classification remediation

The SPEC no longer describes the specification materialization as closed by the
artifact. It records the component materialization as a `SPECIFICATION_GAP`
with independent re-audit pending. Runtime, persistence, API/integration and
productive conformance gaps remain `IMPLEMENTATION_GAP`; prototype evidence
remains `PROTOTYPE_ONLY`. No downstream formal Gap Matrix was generated.

## 18. Implementation-plan leakage remediation

No implementation-plan leakage was found or introduced. Classes, files,
schemas, routes, libraries, implementation phases, commit groups, tickets and
development sequencing remain unfrozen. The normative pipeline order remains
only because accepted ADR-0002 requires it.

## 19. Mechanical validation

```text
PORTFOLIO_OBLIGATIONS_OWNED = 21
PORTFOLIO_OBLIGATIONS_COVERED = 21
OWNED_OBLIGATIONS_UNCOVERED = 0
OWNED_OBLIGATIONS_PARTIAL = 0

NORMATIVE_REQUIREMENTS = 21
REQUIREMENTS_WITHOUT_AUTHORITY = 0
UNTESTABLE_REQUIREMENTS = 0
ACCEPTANCE_GAPS = 0

CONSUMED_CONTRACTS = 6
CONSUMED_CONTRACTS_REDEFINED = 0
NORMATIVE_DEPENDENCIES = 0
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

All required local invariants pass. These are remediation checks, not an
independent conformance verdict.

## 20. Remaining blockers

```text
ARCHITECTURE = 0
PORTFOLIO = 0
UPSTREAM = 0
```

No blocker remains for independent component SPEC re-audit.

## 21. Reaudit readiness

```text
COMPONENT_SPEC_REMEDIATION_COMPLETE
GATE: READY_FOR_INDEPENDENT_COMPONENT_SPEC_REAUDIT
```

The independent `audit-component-spec-conformance` skill is the mandatory next
step. This report does not emit `PASS — COMPONENT_SPEC_CONFORMANT` and does not
self-approve the component SPEC.
