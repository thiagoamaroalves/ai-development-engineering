# SPEC-OPS-001 — Component SPEC Remediation

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
| Component SPEC | `docs/specs/SPEC-OPS-001-observability-retention-backup-and-export.md` |
| Component revision before | `1` |
| Component status before | `PROPOSED` |
| Component revision after | `2` |
| Component status after | `PROPOSED` |
| Portfolio | `SPEC-PORTFOLIO-001`, revision `2` |
| Portfolio verdict | `PORTFOLIO_DECOMPOSITION_APPROVED` |
| Owned obligations | `O-069` through `O-072` |
| Repository HEAD | `a58ce959f9b34f3c1c83ed41c01b058d31bf3366` |
| Working tree state | Pre-existing modifications and untracked artifacts were present; they were preserved. Only the target SPEC was modified by this remediation. |
| Relevant drift | None observed from the audited baseline before editing. ADR, portfolio, upstream SPEC, audit verdict and repository HEAD remained at the referenced revisions. |

## 3. Source audit

| Item | Value |
|---|---|
| Source audit | `docs/specs/audits/SPEC-OPS-001-component-conformance-audit.md` |
| Source verdict | `FAIL — COMPONENT_SPEC_NON_CONFORMANT` |
| Source audit SHA-256 at remediation | `FFE96773568E4CD9D29E6C54CB10F53D0DEE54398382893101FF822FD7D5B739` |
| Validated findings | `CSC-MAJOR-001`, `CSC-MAJOR-002`, `CSC-MAJOR-003`, `CSC-MINOR-001` |
| Source audit modification | None; the audit report remains unchanged. |

Each finding was revalidated as `STILL_VALID` against the unchanged revision 1
component content before remediation. No finding was applied from stale or
superseded evidence.

## 4. Authority used

| Authority | Use in remediation |
|---|---|
| `ADR-0013`, revision `3`, `ACCEPTED` | operational record, external report placement, retention, deletion, backup, restore, export, correlation and measurement |
| `ADR-0001`, revision `3`, `ACCEPTED` | single-owner canonical identities and lineage |
| `ADR-0006`, revision `3`, `ACCEPTED` | durable preservation, evidence-first recovery and append-only source history |
| `ADR-0007`, revision `3`, `ACCEPTED` | Git evidence remains GIT-owned and operational reports do not become Git authority |
| `ADR-0009`, revision `3`, `ACCEPTED` | exact conformance base and external hash-linked reports/evidence |
| `ADR-0012`, revision `3`, `ACCEPTED` | authenticated intervention request and auditable intervention boundary |
| `SPEC-PORTFOLIO-001`, revision `2` | approved ownership, obligation registry and dependency DAG |
| `SPEC-DOM-001` and `SPEC-REPO-001` | canonical identity ownership and distinct repository candidate/workspace references |
| `SPEC-PLAT-001`, revision `1` | durable basis, journal, evidence, reconciliation and recovery contract; latest audit `PASS — COMPONENT_SPEC_CONFORMANT` |
| `SPEC-BACKEND-001`, revision `3` | authenticated application/intervention boundary and transport/session capture; latest audit `PASS — COMPONENT_SPEC_CONFORMANT` |

The accepted ADRs, approved portfolio decomposition and conformant upstream
contracts constrain every correction. Repository, prototype and test evidence
were not used as normative authority.

## 5. Findings ledger

| Finding | Severity | Category | Authority | Root cause | Target section | Planned correction | Validation |
|---|---|---|---|---|---|---|---|
| `CSC-MAJOR-001` | `MAJOR` | ADR translation / upstream composition / projection boundary | `ADR-0013` `Decisão`; `O-054`, `O-069`, `O-071`; DOM/GIT report contracts | `ADR_TRANSLATION_DEFECT` | `§10`, `OPS-OBS-002`, new `OPS-OBS-006`, `§18`, `§19`, `§26`, `§21`, `§22`, `§23` | Require operational reports outside Git and exact audited-content hash linkage, with explicit incomplete behavior | `AC-OPS-019`, `CT-OPS-027`, projection row, traceability row |
| `CSC-MAJOR-002` | `MAJOR` | portfolio conformance / identity | `ADR-0001` `Decisão`/`Invariantes`; `O-001`; DOM `§12` | `PORTFOLIO_CONFORMANCE_DEFECT` | `§12`, `§21`, `§22`, `§23`, `§29`, `§31` | Name DOM as the sole canonical owner for the six aggregate identities and separate REPO/EXEC/PLAT local references | `AC-OPS-020`, `CT-OPS-028`, explicit identity table |
| `CSC-MAJOR-003` | `MAJOR` | SPEC completeness / lifecycle / concurrency / recovery | `ADR-0013` `Decisão`; `O-070`, `O-071`; consumed ADR-0006/0012 and PLAT/BACKEND contracts | `SPEC_COMPLETENESS_DEFECT` | `OPS-RET-002`, new `OPS-RET-004`, `§14`, `§19`, `§21`, `§22`, `§23`, `§26`, `§29`, `§31` | Define deletion states/transitions, basis binding, stale/duplicate/overlap/cancel/partial/retry semantics and atomic minimum-record preservation | `AC-OPS-021/022`, `CT-OPS-029/030/031`, lifecycle requirement |
| `CSC-MINOR-001` | `MINOR` | failure/recovery precision | `ADR-0006`, `ADR-0013`; `O-071`; PLAT recovery ownership | `SPEC_COMPLETENESS_DEFECT` | `§19`, `§22`, `§26`, `§31` | Replace vague recovery wording with deterministic PLAT/GIT/BACKEND or explicit OPS incomplete/operator-intervention routing | `AC-OPS-023`, `CT-OPS-032`, external-effects table |

All four findings are classified `REMEDIATE`. None is escalated to ADR,
portfolio or upstream remediation.

| Finding | Before | Remediation | Authority | Local proof | Status |
|---|---|---|---|---|---|
| `CSC-MAJOR-001` | Reports/hashes were required, but outside-Git placement and exact audited-content linkage were not deterministic. | Added `OPS-OBS-006`, updated consumed-contract and projection boundaries, and added acceptance/conformance evidence. | `ADR-0013` `Decisão`; `ADR-0009` `Decisão`; `O-054`, `O-069`, `O-071` | target `§10`, `OPS-OBS-006`, `§18`, `AC-OPS-019`, `CT-OPS-027`, `§23` | `REMEDIATED` |
| `CSC-MAJOR-002` | `RepositoryId` and several aggregate IDs permitted source-dependent or generic ownership. | Assigned all six canonical identities explicitly to DOM and separated REPO/EXEC/PLAT local references. | `ADR-0001` `Decisão`/`Invariantes`; `O-001`; DOM `§12` | target `§12`, `AC-OPS-020`, `CT-OPS-028`, `§23` | `REMEDIATED` |
| `CSC-MAJOR-003` | Deletion had authentication/confirmation and minimum evidence but no lifecycle, stale/duplicate/overlap/partial/concurrency/retry semantics. | Extended `OPS-RET-002`, added `OPS-RET-004` states/transitions and recovery rules, plus request command and tests. | `ADR-0013` `Decisão`; `ADR-0006`; `ADR-0012`; `O-070`, `O-071` | target `OPS-RET-002`, `OPS-RET-004`, `§14`, `AC-OPS-021/022`, `CT-OPS-029/030/031`, `§23` | `REMEDIATED` |
| `CSC-MINOR-001` | `§19` used the non-deterministic phrase “appropriate recovery decision.” | Named PLAT, GIT, BACKEND and explicit OPS incomplete/operator-intervention routes. | `ADR-0006`, `ADR-0013`; `O-071`; approved failure ownership registry | target `§19`, `AC-OPS-023`, `CT-OPS-032`, `§23` | `REMEDIATED` |

## 6. Files changed

| File | Change |
|---|---|
| `docs/specs/SPEC-OPS-001-observability-retention-backup-and-export.md` | Modified from revision 1 to revision 2 with only finding-driven SPEC, acceptance, conformance, traceability, validation and gate corrections |
| `docs/specs/remediations/SPEC-OPS-001-component-spec-remediation.md` | Created as this remediation evidence artifact |

The source audit, accepted ADRs, approved portfolio, upstream SPECs, upstream
audits, Gap Matrices, Implementation Plans, tickets, production code and tests
were not modified.

## 7. Owned obligation remediation

The approved owner of `O-069` through `O-072` remains `SPEC-OPS-001`. No
obligation was moved, duplicated or newly invented.

| Obligation | Remediation evidence |
|---|---|
| `O-069` | Operational record/source fidelity remains covered by `OPS-OBS-001` through `OPS-OBS-006`, including report linkage, with `AC-OPS-001/002/019` and corresponding conformance tests. |
| `O-070` | Indefinite retention and manual deletion remain covered by `OPS-RET-001` through `OPS-RET-004`, including lifecycle and concurrency, with `AC-OPS-006` through `AC-OPS-009/021/022`. |
| `O-071` | Backup, restore, export and minimum deletion record remain covered by existing backup/export requirements plus `OPS-OBS-006` and `OPS-RET-004`, with explicit incomplete and recovery evidence. |
| `O-072` | Exact six-dimension correlation and measurement remain covered; identity remediation clarifies that correlation uses DOM-owned canonical identities. |

All four owned obligations are fully covered after remediation. There are no
uncovered or partial owned obligations.

## 8. Upstream contract remediation

No upstream contract was changed. The target SPEC now references upstream
authority more precisely:

- `SPEC-DOM-001` remains the sole canonical owner of `RepositoryId`,
  `ExecutionId`, `ActivityId`, `AttemptId`, `AgentId` and `ExternalEffectId`.
- `SPEC-REPO-001` candidate/workspace references, `SPEC-EXEC-002`
  assignment/session references and `SPEC-PLAT-001` journal/recovery references
  are listed as local source references only; none substitutes for a DOM ID.
- PLAT remains the owner of durable journal/effect/recovery semantics and
  BACKEND remains the owner of authenticated intervention and transport/session
  semantics.

Consumed contracts remain referenced without semantic redefinition. The two
approved normative dependencies remain exactly `SPEC-PLAT-001` and
`SPEC-BACKEND-001`.

## 9. Requirement authority remediation

Added requirement `OPS-OBS-006` is a local OPS preservation/projection rule,
not a transfer of conformance-report authority. It is traced to `O-054`,
`O-069`, `O-071`, `ADR-0009` `Decisão` and `ADR-0013` `Decisão`. It requires
reports outside Git and exact audited-content hash relation, with explicit
unavailable/invalid handling.

Added requirement `OPS-RET-004` is a local deletion-preservation lifecycle
rule. It is traced to `O-070`, `O-071`, `ADR-0013` `Decisão`, and consumed
`ADR-0006` preservation/recovery and `BACKEND-INTERVENTION-001`. It does not
redefine domain lifecycle, effect reconciliation or authentication.

The revised requirements are identifiable, observable, implementation-neutral,
component-scoped and testable. No requirement lacks portfolio or ADR authority.

## 10. Lifecycle/identity remediation

Identity table `§12` now assigns exactly one canonical owner to each of the six
audited aggregate identities: `SPEC-DOM-001`. It separately identifies REPO
candidate/workspace, EXEC assignment/session and PLAT journal/recovery local
references. Labels, paths, assignments, sessions, journal positions and
projection records cannot replace canonical aggregate identities.

Deletion lifecycle `OPS-RET-004` now defines observable states, valid
transitions and terminality:

```text
REQUESTED → CONFIRMATION_REQUIRED | REJECTED
CONFIRMATION_REQUIRED → IN_PROGRESS | CANCELLED | REJECTED
IN_PROGRESS → CONFIRMED | PARTIAL | FAILED
PARTIAL | FAILED → IN_PROGRESS only for the same request and basis
CONFIRMED | CANCELLED | REJECTED = terminal
```

The request binds a bounded scope and expected basis. Stale basis is rejected;
duplicate confirmation is idempotent; overlapping distinct requests cannot be
applied concurrently; cancellation after destructive application cannot create
an alternate result; partial/failed recovery preserves completed and remaining
scope and does not repeat completed removals; and no deletion begins unless the
minimum deletion record is preservable.

## 11. Failure/recovery remediation

OPS still owns zero canonical failure families. The vague phrase “appropriate
recovery decision” was removed from `§19`. Recovery now has deterministic
routing:

| Affected evidence | Recovery owner/result |
|---|---|
| Database, journal, outbox or effect evidence | `SPEC-PLAT-001` reconciliation/recovery contract |
| Publication/Git evidence | `SPEC-GIT-001` publication/evidence contract |
| Transport or session capture | `SPEC-BACKEND-001` transport/session contract |
| No canonical source owner implicated | OPS `INCOMPLETE` preservation result requiring operator intervention |

OPS records the local preservation result and diagnostics but does not choose or
rewrite canonical source recovery semantics.

## 12. Compatibility/cutover remediation

Compatibility ownership is unchanged. OPS remains the owner for its approved
retention and historical replay preservation boundary, a consumer of REPO/PLAT/
GIT legacy rules, and `CUTOVER` remains not applicable to a functional OPS
path. External report placement and deletion lifecycle rules preserve historical
hashes, source identities and non-authoritative projection behavior. No legacy
path becomes canonical and no retirement rule was invented.

## 13. Dependency remediation

The approved dependency graph is unchanged:

```text
SPEC-OPS-001 → SPEC-PLAT-001
SPEC-OPS-001 → SPEC-BACKEND-001
```

DOM, EXEC and GIT remain source contracts consumed through approved
PLAT/BACKEND composition or non-normative projection references. No new
normative dependency, reversed edge or missing required dependency was
introduced.

## 14. Projection boundary remediation

The target SPEC now explicitly classifies operational reports/conformance
evidence as DOM/GIT source-owned and OPS-preserved non-authoritative material.
The local rule preserves an external report and exact audited-content hash
relation; missing or invalid relation is incomplete evidence. The target does
not make a report, export, backup, deletion record or projection a source of
functional state.

## 15. Acceptance/conformance remediation

Added binary acceptance criteria:

- `AC-OPS-019`: external report placement and exact audited-content hash
  linkage;
- `AC-OPS-020`: single-owner canonical identities and distinct local references;
- `AC-OPS-021`: deletion lifecycle and atomic minimum-record precondition;
- `AC-OPS-022`: duplicate, overlap, stale, cancellation, partial and retry
  behavior; and
- `AC-OPS-023`: deterministic preservation recovery routing.

Added conformance tests `CT-OPS-027` through `CT-OPS-032` falsify the four
validated defects and exercise positive, negative, boundary-isolation,
concurrency, recovery and preservation paths. The suite now contains 32 tests
and 23 acceptance criteria. Every normative requirement has binary acceptance
and conformance evidence.

## 16. Traceability remediation

The target traceability matrix now includes:

| Requirement | Portfolio obligation | ADR | Ownership role | Acceptance/test |
|---|---|---|---|---|
| `OPS-OBS-006` | `O-054`, `O-069`, `O-071` | `ADR-0009`, `ADR-0013`, `Decisão` | OPS local preservation owner; DOM/GIT consumer boundary | `AC-OPS-019`; `CT-OPS-027` |
| `OPS-RET-004` | `O-070`, `O-071` | `ADR-0006`, `ADR-0013`, `Decisão` | OPS deletion-preservation owner; PLAT/BACKEND source/request authority retained | `AC-OPS-021/022`; `CT-OPS-029/030/031` |

Existing deletion and projection rows were updated to reference the new
acceptance and conformance evidence. The local traceability invariants remain:

```text
REQUIREMENTS_WITHOUT_PORTFOLIO_OBLIGATION = 0
OWNED_OBLIGATIONS_WITHOUT_REQUIREMENT = 0
REQUIREMENTS_WITHOUT_ADR_AUTHORITY = 0
```

## 17. Gap classification remediation

The corrections are SPEC-level closure of validated conformance defects only.
Implementation gaps remain implementation gaps: no production OPS projection,
retention service, backup/restore implementation or reconstructible export was
created. No formal Gap Matrix was generated or completed. No architecture,
portfolio or upstream contract gap remains in the remediated SPEC boundary.

## 18. Implementation-plan leakage remediation

No phases, files, classes, modules, routes, commit groups, tickets, worktree
assignments, implementation units or development sequencing were added. The
logical deletion states and recovery outcomes are normative observable behavior,
not an implementation plan. Storage, scheduling, hashing library and
concurrency mechanism remain intentionally unfrozen in `§27`.

## 19. Mechanical validation

```text
PORTFOLIO_OBLIGATIONS_OWNED = 4
PORTFOLIO_OBLIGATIONS_COVERED = 4
OWNED_OBLIGATIONS_UNCOVERED = 0
OWNED_OBLIGATIONS_PARTIAL = 0
NORMATIVE_REQUIREMENTS = 19
REQUIREMENTS_WITHOUT_AUTHORITY = 0
CONSUMED_CONTRACTS = 7 contract groups
CONSUMED_CONTRACTS_REDEFINED = 0
UNTESTABLE_REQUIREMENTS = 0
ACCEPTANCE_GAPS = 0
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
REMEDIATED_FINDINGS = 4
PARTIAL_FINDINGS = 0
BLOCKED_FINDINGS = 0
ACCEPTANCE_CRITERIA = 23
CONFORMANCE_TESTS = 32
```

The target SPEC mechanical validation and adversarial validation sections were
updated consistently. The target revision is `2` and its final gate is
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
SPEC: SPEC-OPS-001
SOURCE_AUDIT: docs/specs/audits/SPEC-OPS-001-component-conformance-audit.md
SOURCE_VERDICT: FAIL — COMPONENT_SPEC_NON_CONFORMANT
GATE: READY_FOR_INDEPENDENT_COMPONENT_SPEC_REAUDIT
```

The next mandatory action is a fresh independent
`audit-component-spec-conformance` run against revision `2`. Only that audit
may determine whether the component SPEC is conformant.
