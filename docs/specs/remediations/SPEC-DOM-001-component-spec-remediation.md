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
| Revision before | `3` |
| Revision after | `4` |
| Status | `PROPOSED` |
| Portfolio | `SPEC-PORTFOLIO-001`, revision `2` |
| Portfolio verdict | `PORTFOLIO_DECOMPOSITION_APPROVED` |
| Repository HEAD | `baa2a189bd71b85ba9fcc62840e52f091fc2e77e` |
| Target SPEC SHA before | `E0CF434C97C67019536D8376EA0960E8224FE42DE8E0CB6F1091EB243126F4C6` |
| Working tree | 63 pre-existing changed/untracked paths preserved; only target SPEC and this remediation report changed by this run |
| Upstream normative SPECs | none; DOM is the approved DAG root |

The source SPEC declared generation HEAD
`d42a2dbe4d9e40dc7f139df920eb0a134c085aaf`; the source audit was rerun against
the current repository HEAD above. No accepted ADR, portfolio registry or
upstream contract drift was found. The target SPEC hash matched the audited
revision before this remediation.

## 3. Source audit

| Field | Value |
|---|---|
| Source audit | `docs/specs/audits/SPEC-DOM-001-component-conformance-audit.md` |
| Source verdict | `FAIL — COMPONENT_SPEC_NON_CONFORMANT` |
| Audit findings | `CSC-MAJOR-001` through `CSC-MAJOR-007` |
| Audit date | `2026-09-10` |
| Required next gate | independent component SPEC re-audit |

The source audit explicitly confirms the portfolio approval, eligible ADR
authority and zero approved upstream normative edges. All seven findings are
local SPEC completeness/composition findings; none requires ADR, portfolio or
upstream remediation.

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

| Finding | Before | Remediation | Authority | Local proof | Status |
|---|---|---|---|---|---|
| `CSC-MAJOR-001` | Identity proof was complete only for `WorkflowPipeline`; the remaining roots/entities lacked a uniform proof of owner, scope, correlation, persistence and rehydration. Root cause: `SPEC_COMPLETENESS_DEFECT`. | Added the complete §12.2 `Aggregate Identity Authority Matrix`, covering all DOM roots/entities and explicitly separating DOM identity from EXEC/PLAT/GIT lifecycle, persistence and external execution ownership. | ADR-0001; O-001; approved portfolio O-001 | `DOM-ID-001`, AC-DOM-001, C-01/C-24/C-25 and 21-row acceptance witness matrix. | `REMEDIATED` |
| `CSC-MAJOR-002` | Reconstruction authority was materially specified only for `WorkflowPipeline`; other persistible aggregates had no explicit create/rehydrate contract. Root cause: `SPEC_COMPLETENESS_DEFECT`. | Added §13 authority-completeness proofs for execution/snapshot, lineage artifacts, tickets, audit cycles and publication/effect evidence, including detached/untrusted rejection and owner split. | ADR-0001; ADR-0002; ADR-0006; ADR-0009; O-003/O-009/O-010/O-049/O-054 | AC-DOM-009, AC-DOM-010, AC-DOM-049, AC-DOM-054 and the reconstruction matrix. | `REMEDIATED` |
| `CSC-MAJOR-003` | Publication, audit-cycle/round and realization lifecycle semantics were not closed as explicit state-machine contracts. Root cause: `SPEC_COMPLETENESS_DEFECT`. | Added the §13 `Lifecycle Authority Matrix`, preserving separate decision/realization, pipeline, ticket, audit and publication machines with terminal, replay and recovery rules. | ADR-0001; ADR-0002; ADR-0009; O-006/O-010/O-014/O-049/O-050/O-051/O-052 | `DOM-LIFE-001`, `DOM-STATE-001`, `DOM-PUB-001`, `DOM-AUDIT-001…006`, AC-DOM-006/010/014/049…054. | `REMEDIATED` |
| `CSC-MAJOR-004` | Persistence semantics were incomplete beyond the pipeline journal: canonical state, snapshots, history, revisions and recovery ownership were not uniformly stated. Root cause: `UPSTREAM_COMPOSITION_DEFECT`. | Added the §13 `Persistence Semantics Matrix`, distinguishing domain identity/revision from persistence revision and assigning physical serialization/recovery to PLAT while retaining DOM semantic validation. | ADR-0001; ADR-0006; O-003/O-007/O-009/O-010/O-049/O-054 | AC-DOM-003, AC-DOM-009, AC-DOM-010, AC-DOM-049 and AC-DOM-054; persistence matrix. | `REMEDIATED` |
| `CSC-MAJOR-005` | Consumption of EXEC, PLAT and GIT authority was named but not concretely closed as producer/consumer contracts. Root cause: `UPSTREAM_COMPOSITION_DEFECT`. | Added §10.1 contracts for exact EXEC version basis, PLAT snapshot/provenance material and GIT candidate-bound remote confirmation, including version/result/failure semantics and productive-availability classification. | ADR-0001; ADR-0002; ADR-0006; ADR-0008; ADR-0009; approved portfolio dependency registry | `CONTRACT_DEFINED` rows, no contract redefinition, no new DAG edge, and integrated witness rows for snapshot, pipeline, publication and audit behavior. | `REMEDIATED` |
| `CSC-MAJOR-006` | Material operations could not all be decided from the SPEC alone; the source audit recorded five implementer decision-check failures. Root cause: `SPEC_TESTABILITY_DEFECT`. | Added direct positive/negative witnesses for all 21 requirements and made every missing decision explicit through identity, reconstruction, lifecycle, persistence and temporal matrices. | ADR-0001; ADR-0002; ADR-0006; ADR-0008; ADR-0009; O-001…O-015/O-049…O-054 | `ACCEPTANCE_WITNESS_MATRIX = 21/21`; `IMPLEMENTER_DECISION_CHECK_FAILURES = 0`; no implementation technology or plan was introduced. | `REMEDIATED` |
| `CSC-MAJOR-007` | `REMOTE_PUBLICATION_CONFIRMED` lacked a temporal proof requiring fresh, candidate-bound independent observation. Root cause: `UPSTREAM_COMPOSITION_DEFECT`. | Added §13 `Temporal Authority Proof` and aligned DOM-PUB-001, AC-DOM-014 and AC-DOM-054 so GIT re-observes after basis fixation and DOM rejects stale/drifted/conflicting evidence without mutation. | ADR-0002; ADR-0008; O-014/O-054 | Candidate-bound base/head/tree relation, observation revision/correlation, negative drift witness and no-promotion-without-new-evidence rule. | `REMEDIATED` |

Each source finding was classified as a local specification correction and
revalidated against the edited target. No finding was classified as requiring
ADR, portfolio or upstream remediation. The statuses above are remediation
statuses only; the independent component audit remains authoritative for the
final conformance verdict.

## 6. Files changed

Changed in this remediation run:

- `docs/specs/SPEC-DOM-001-workflow-authority-and-governance.md`
- `docs/specs/remediations/SPEC-DOM-001-component-spec-remediation.md`

The source audit was read-only evidence and remains unchanged. No new file was
created; the existing remediation report was overwritten in place.

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

All 21 obligations owned by `SPEC-DOM-001` remain present and covered. The
previously partial obligations O-001, O-009, O-010, O-014, O-049 and O-054 now
have direct normative materialization through the identity, reconstruction,
lifecycle, persistence, producer/consumer and temporal proofs. The other
owned obligations were preserved without semantic ownership changes.

No obligation was moved to another component, and no downstream obligation was
made normative in DOM.

## 8. Upstream contract remediation

There are no upstream normative component SPECs for the DOM root. No upstream
contract was changed or copied. The EXEC, PLAT and GIT boundaries are now
explicitly consumed as producer/consumer contracts in §10.1, but they remain
cross-component authority references rather than new DOM dependencies. Their
productive availability is intentionally `NO` until independently evidenced;
this does not weaken the local semantic contract or claim productive
implementation.

## 9. Requirement authority remediation

All 21 requirement IDs remain tied to their existing portfolio obligations and
accepted ADR authority. The edited requirements materialize existing decisions
about identity, transition order, audit cycles, exact candidate basis and
evidence freshness; they do not introduce a new owner, state machine or
architectural decision. No requirement is left without ADR or portfolio
authority.

## 10. Lifecycle/identity remediation

The §12.2 identity matrix closes identity proof for every listed root/entity,
including `AgentId`, `ExternalEffectId`, `PublicationId`, audit cycle, ticket,
wave and activity/attempt. The §13 reconstruction matrix separates `create`
from `rehydrate`; the lifecycle matrix preserves independent machines and
terminal/replay semantics; the persistence matrix distinguishes domain and
storage revisions; and the temporal proof binds remote confirmation to a fresh
candidate observation. DOM retains semantic authority while EXEC, PLAT and GIT
retain their approved operational boundaries.

## 11. Failure/recovery remediation

The corrected contracts fail closed for unknown, stale, detached, corrupt,
duplicated, omitted, skipped, out-of-order or conflicting material. The last
valid state is preserved and no transition or external effect is produced on
failure. PLAT remains owner of physical persistence, journal replay and
recovery mechanics; GIT remains owner of remote observation and effect
execution; DOM remains owner of semantic acceptance. No failure owner changed.

## 12. Compatibility/cutover remediation

No compatibility or cutover ownership changed. Legacy behavior remains an
adapter/consumer path, historical replay remains governed by the canonical
identity and lineage rules, and no second canonical path or silent migration
was introduced. Existing downstream invalidation and terminal-state rules
remain applicable.

## 13. Dependency remediation

No dependency correction was required. `SPEC-DOM-001` remains the approved DAG
root. The new §10.1 producer/consumer rows clarify consumed authority without
creating a normative edge to a downstream component SPEC:

```text
NORMATIVE_DEPENDENCIES = 0
UNAPPROVED_DEPENDENCIES = 0
MISSING_REQUIRED_DEPENDENCIES = 0
DEPENDENCY_DIRECTION_VIOLATIONS = 0
```

## 14. Projection boundary remediation

The owner split is explicit and unchanged: DOM owns canonical identity and
semantic acceptance; PLAT owns effect persistence/reconciliation and physical
recovery; GIT owns publication execution and remote observation. Backend, OPS
and UI remain transport or projection surfaces. None became canonical
authority, and no projection is accepted as evidence of causal progress.

## 15. Acceptance/conformance remediation

The 21-row `Acceptance Witness Matrix` provides one direct positive and one
negative/isolation witness per normative requirement. `AC-DOM-001`,
`AC-DOM-009`, `AC-DOM-010`, `AC-DOM-014`, `AC-DOM-049` and `AC-DOM-054` now
state the corrected identity, reconstruction, lifecycle, publication, cycle
and temporal obligations. Local contract fixtures are explicitly separated
from productive availability; no unavailable capability was represented as
implemented.

## 16. Traceability remediation

The ADR → obligation → requirement mappings remain complete for all 21 DOM
obligations. The requirement-to-proof cells now reference the identity,
reconstruction, lifecycle, persistence, producer/consumer and temporal
evidence that directly tests each mapped requirement. The six formerly partial
obligation mappings are explicitly represented in the revised traceability
matrix and acceptance witnesses.

```text
OWNED_OBLIGATIONS_WITHOUT_REQUIREMENT = 0
REQUIREMENTS_WITHOUT_PORTFOLIO_AUTHORITY = 0
REQUIREMENTS_WITHOUT_ADR_AUTHORITY = 0
```

## 17. Gap classification remediation

The seven source-audit normative gaps are recorded as remediated materialization
in this revision, subject to independent re-audit. Runtime, persistence,
API/integration and productive conformance gaps remain `IMPLEMENTATION_GAP`;
prototype evidence remains `PROTOTYPE_ONLY`. No downstream formal Gap Matrix
was generated and no implementation gap was reclassified as closed.

## 18. Implementation-plan leakage remediation

No implementation-plan leakage was found or introduced. Classes, files,
schemas, routes, libraries, implementation phases, commit groups, tickets and
development sequencing remain unfrozen. The normative pipeline order remains
only because accepted ADR-0002 requires it. The added matrices specify
semantic evidence and ownership, not implementation structure.

## 19. Mechanical validation

```text
PORTFOLIO_OBLIGATIONS_OWNED = 21
PORTFOLIO_OBLIGATIONS_COVERED = 21
OWNED_OBLIGATIONS_UNCOVERED = 0
OWNED_OBLIGATIONS_PARTIAL = 0

NORMATIVE_REQUIREMENTS = 21
REQUIREMENTS_WITHOUT_AUTHORITY = 0
IMPLEMENTER_DECISION_CHECK_FAILURES = 0
CAPABILITY_AVAILABILITY_CLASSIFICATION_ERRORS = 0
DOWNSTREAM_PROMOTION_WITHOUT_NEW_EVIDENCE = 0
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

REMEDIATED_FINDINGS = 7
PARTIAL_FINDINGS = 0
BLOCKED_FINDINGS = 0

IDENTITY_AUTHORITY_GAPS = 0
RECONSTRUCTION_AUTHORITY_GAPS = 0
LIFECYCLE_AUTHORITY_GAPS = 0
PERSISTENCE_SEMANTICS_GAPS = 0
CROSS_SPEC_AUTHORITY_GAPS = 0
TEMPORAL_AUTHORITY_GAPS = 0
```

All required local remediation invariants pass. The `NO` productive-
availability values in the target SPEC remain intentional for contract-level
capabilities and are not implementation claims. These are remediation checks,
not an independent conformance verdict.

## 20. Remaining blockers

```text
ARCHITECTURE = 0
PORTFOLIO = 0
UPSTREAM = 0
```

No blocker remains for independent component SPEC re-audit.

The independent audit itself is a mandatory gate, not a blocker or a
self-issued approval. No architecture, portfolio or upstream change is
required before that gate.

## 21. Reaudit readiness

```text
COMPONENT_SPEC_REMEDIATION_COMPLETE
GATE: READY_FOR_INDEPENDENT_COMPONENT_SPEC_REAUDIT
```

The independent `audit-component-spec-conformance` skill is the mandatory next
step. This report does not emit `PASS — COMPONENT_SPEC_CONFORMANT`, does not
self-approve the component SPEC and does not alter the source audit.
