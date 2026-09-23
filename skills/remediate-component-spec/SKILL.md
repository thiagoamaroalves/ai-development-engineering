---
name: remediate-component-spec
description: >
  Remediate one component specification after an independent
  audit-component-spec-conformance verdict of FAIL — COMPONENT_SPEC_NON_CONFORMANT.
  Resolve validated CSC findings while preserving accepted ADR authority, the
  approved SPEC portfolio decomposition, conformant upstream contracts,
  ownership boundaries, dependency direction, failure and compatibility
  ownership, and implementation independence. Use before independent
  component SPEC re-audit and before Gap Matrix generation. Modify only the
  component SPEC and narrowly related consistency documentation; never modify
  ADRs, the approved portfolio, upstream SPECs, downstream planning artifacts,
  production code, or tests.
---

# Remediate Component SPEC

For baseline/source drift, read
`skills/_shared/baseline-drift-remediation-contract.md`. A complete actionable
reassessment is a valid remediation input; only unassessed drift or a stale
audit basis requires blocking.

## Purpose and operating boundary

Remediate one component SPEC from validated findings in the latest independent
`audit-component-spec-conformance` report:

```text
FAIL — COMPONENT_SPEC_NON_CONFORMANT
        ↓
component SPEC remediation
        ↓
READY_FOR_INDEPENDENT_COMPONENT_SPEC_REAUDIT
        ↓
audit-component-spec-conformance
```

The remediation makes the SPEC eligible for re-audit; it does not approve the
SPEC. Only the independent auditor may emit:

```text
PASS — COMPONENT_SPEC_CONFORMANT
```

Operate in:

```text
WRITE_ALLOWED AUDIT_DRIVEN ADR_FIRST PORTFOLIO_GOVERNED
UPSTREAM_CONTRACT_PRESERVING COMPONENT_SCOPED MINIMAL_SCOPE
NO_ARCHITECTURE_INVENTION NO_PORTFOLIO_REDESIGN
NO_IMPLEMENTATION_PLAN NO_TICKET_DECOMPOSITION
NO_PRODUCTION_IMPLEMENTATION NO_SELF_APPROVAL
```

The allowed write set is the audited component SPEC, its local traceability,
acceptance and conformance material, and narrowly related documentation or
remediation evidence needed for internal consistency. Never modify accepted
ADRs, the approved portfolio or its registries, conformant upstream SPECs,
Gap Matrices, Implementation Plans, tickets, production code, tests, or prior
audit reports.

## Authority and evidence

Use this precedence exactly:

```text
accepted ADR
  > approved SPEC portfolio decomposition
  > conformant upstream component SPEC
  > validated independent component audit
  > component SPEC being remediated
  > repository implementation
  > tests
  > prototype
  > historical evidence
```

The audit proves the defect inventory. It does not authorize a solution.
ADRs, the portfolio and conformant upstream SPECs constrain every correction.
Do not infer authority from implementation intuition, tests, prototypes, or
historical wording.

Required inputs:

1. target component SPEC;
2. latest component conformance audit;
3. approved portfolio and latest portfolio decomposition audit;
4. accepted relevant ADRs;
5. portfolio obligation and dependency registries;
6. failure ownership and compatibility/cutover registries where applicable;
7. conformant upstream component SPECs and their latest evidence.

Implementation, tests, prototypes, prior drafts and prior Gap Matrices are
supporting evidence only. Record the exact authority cutoff used by the audit.

## Preconditions and baseline

The latest component audit must be exactly:

```text
FAIL — COMPONENT_SPEC_NON_CONFORMANT
```

If it is already conformant, do not remediate. Return
`COMPONENT_SPEC_REMEDIATION_NOT_REQUIRED` with reason
`SPEC_ALREADY_CONFORMANT`.

If the audit is blocked, or the portfolio or an upstream contract is not
usable, do not perform normal remediation. Return the applicable blocker:

```text
ADR_CLARIFICATION_REQUIRED
PORTFOLIO_REMEDIATION_REQUIRED
UPSTREAM_REMEDIATION_REQUIRED
REMEDIATION_BLOCKED
```

Before editing, record:

```text
COMPONENT_SPEC
COMPONENT_REVISION_BEFORE
COMPONENT_STATUS
SOURCE_AUDIT
SOURCE_AUDIT_VERDICT
PORTFOLIO_ID
PORTFOLIO_REVISION
PORTFOLIO_VERDICT
PRIMARY_ADRS
RELATED_ADRS
UPSTREAM_SPECS
REPOSITORY_HEAD
WORKING_TREE_STATE
VALIDATED_FINDINGS
BASELINE_DRIFT_STATUS
REASSESSMENT_COMPLETE
BASELINE_REMEDIATION_READINESS
AUDIT_BASIS_FINGERPRINT
BASELINE_REASSESSMENT_PROOF
```

Check for relevant drift from the audited baseline and consume the audit's
`BASELINE_REASSESSMENT_PROOF`. For changed component content, revalidate each
finding as `STILL_VALID`, `ALREADY_RESOLVED_BY_NEWER_STATE`, `MODIFIED_BY_DRIFT`,
or `INVALIDATED_BY_DRIFT`; never apply stale remediation blindly. If the audit
completed the proof with actionable findings and the live fingerprint still
matches, reconcile the recorded old/current authority rather than requiring a
duplicate audit. Unassessed or post-audit authority/source drift blocks with
`BLOCKED_INSUFFICIENT_REASSESSMENT` or `STALE_AUDIT_BASIS` respectively.

## Finding ledger and root cause

Read the complete audit, including evidence, authority, ownership, matrices,
acceptance coverage and required remediation types. Build this ledger before
editing:

| Finding | Severity | Category | Authority | Root cause | Target section | Planned correction | Validation |
|---|---|---|---|---|---|---|---|

Classify every finding as exactly one of:

```text
REMEDIATE
ALREADY_RESOLVED_BY_NEWER_STATE
PORTFOLIO_REMEDIATION_REQUIRED
ADR_CLARIFICATION_REQUIRED
UPSTREAM_REMEDIATION_REQUIRED
BLOCKED
```

Assign one root cause:

```text
ADR_TRANSLATION_DEFECT
PORTFOLIO_CONFORMANCE_DEFECT
UPSTREAM_COMPOSITION_DEFECT
SPEC_COMPLETENESS_DEFECT
SPEC_TESTABILITY_DEFECT
TRACEABILITY_DEFECT
ACCEPTANCE_DEFECT
IMPLEMENTATION_PLAN_LEAKAGE
```

If the actual defect is a portfolio defect, ADR gap, or upstream SPEC defect,
escalate it. Do not repair it locally or silently downgrade it.

## Targeted remediation rules

Apply the smallest correct semantic correction for each validated finding.
Preserve conformant requirements and avoid style rewrites or opportunistic
scope expansion. Every changed or added requirement must be:

```text
IDENTIFIABLE AUTHORITY_BACKED OBSERVABLE UNAMBIGUOUS TESTABLE
IMPLEMENTATION_INDEPENDENT COMPONENT_SCOPED OWNERSHIP_SAFE
```

Record for each changed requirement:

```text
Requirement ID
Portfolio obligation ID
ADR authority and section
Owned/consumed role
Normative behavior
Acceptance mapping
Conformance mapping
```

Use observable `Given / When / Then` semantics when useful, including the
forbidden alternative. Do not freeze database technology, routes, DTOs,
classes, modules, providers, libraries, schemas, or file plans unless accepted
authority explicitly requires them.

### Obligation coverage and authority

For `MISSING_OWNED_OBLIGATION`, add a requirement. For
`PARTIAL_OBLIGATION_COVERAGE`, extend the existing requirement. Derive only
from the portfolio obligation registry and preserve the approved owner.

For `UNBACKED_NORMATIVE_REQUIREMENT` or
`ARCHITECTURAL_DECISION_HIDDEN_IN_SPEC`, classify the statement as legitimate
SPEC elaboration, local mapping/projection, or unauthorized architecture.
Keep legitimate elaboration implementation-neutral and trace it to portfolio
obligation plus ADR. Remove unnecessary unauthorized text; if the behavior is
needed but lacks authority, block with `ADR_CLARIFICATION_REQUIRED`.

For contradictions, ADR authority wins and portfolio decomposition wins over
local prose. Do not merge incompatible semantics or weaken accepted authority.

### Consumed upstream contracts and ownership

For `CONSUMER_REDEFINES_OWNER`, `DUPLICATED_CONTRACT`, or duplicated authority:

1. identify the canonical upstream owner;
2. remove the local canonical definition;
3. reference the upstream contract explicitly;
4. retain only local validation, application/transport mapping, projection,
   correlation, propagation, or presentation behavior that this component
   actually owns;
5. update traceability and boundary-isolation evidence.

Never redefine an upstream identity, lifecycle, failure, precondition,
transition, revision, retry policy, or canonical outcome.

If portfolio ownership is violated, restore the approved relationship. Do not
move ownership locally. If no approved owner exists, return
`PORTFOLIO_REMEDIATION_REQUIRED`.

### Lifecycle, identity, lineage and concurrency

For lifecycle findings, add only missing semantics owned by this component:
creation, initial state, valid/invalid transitions, terminality,
immutability, retry, recovery, history, replacement, cancellation, and
retention/deletion where applicable. Reference upstream lifecycle semantics.

For identity and lineage findings, state canonical owner, creation authority,
immutability, scope, revision relationship, parent/child and execution
relationships, provenance, lineage and historical resolution. Do not invent an
identifier or collapse logical, revision, execution, digest, presentation,
parent, predecessor, successor, root or ordinal identity.

Where this component owns mutation semantics, clarify expected revision, stale
basis, duplicate request, idempotency key, atomicity, ordering, retry,
partial-application prevention and recovery. If concurrency is owned elsewhere,
reference the upstream contract rather than assuming generic platform behavior.

### Failure and recovery

Use the approved failure ownership registry. For an owned failure specify:

```text
trigger
canonical meaning
retryability
state implication
recovery implication
required evidence
```

For a consumed failure retain only propagation, transport representation, UI
presentation, operational projection, or local reconciliation. A mapping must
not alter trigger, meaning, retryability, terminality, recovery, or authority.
For `WRONG_FAILURE_OWNER` or `SEMANTIC_REDEFINITION`, remove the local
canonical definition and reference the owner.

Where applicable clarify failure state, retryability, resume basis, checkpoint,
duplicate prevention, restart behavior, operator intervention and recovery
evidence. Do not redefine upstream recovery.

### Compatibility, cutover and legacy behavior

Use the compatibility registry and preserve the approved role for:

```text
NEW_CANONICAL_PATH
LEGACY_COMPATIBILITY
HISTORICAL_REPLAY
CUTOVER
RETIREMENT
```

An owner SPEC must state applicable preservation requirements, cutover
invariant, retirement condition, replay behavior and conformance evidence. A
consumer must reference the owner. If `LEGACY_BECOMES_CANONICAL` was found,
make the new canonical path, legacy adaptation, historical-only behavior,
cutover rule and retirement rule explicit. Legacy support is not a second
permanent source of truth.

### Dependencies and projection boundaries

Compare declared dependencies with the approved portfolio DAG. Remove an
unapproved normative edge, add a required approved edge, and restore direction
when reversed. Label implementation, projection and evidence dependencies as
non-normative. A genuinely new normative edge requires
`PORTFOLIO_REMEDIATION_REQUIRED`.

For backend, API, OPS, UI, report, read-model and cache boundaries state:

```text
canonical owner
projection source
local projection/mapping semantics
staleness behavior
replay/rebuild behavior
authority limit
```

Classify commands, queries and events as canonical domain, application,
transport, query, canonical domain event, integration event, projection event,
or transport event. Only the canonical owner defines canonical semantics.

When external effects matter, preserve the distinction:

```text
REQUEST → INTENT → EXTERNAL_EXECUTION → EVIDENCE
        → CONFIRMATION → RECONCILIATION → PROJECTION
```

Do not equate adapter success with canonical confirmation without accepted
authority.

### Authorization and security

Separate authentication, authorization, server-side enforcement, projection
filtering, secret handling and session presentation. Frontend hiding is not
authorization. Define only this component's approved boundary and reference
upstream security contracts otherwise.

### Acceptance, conformance and traceability

Every material requirement needs binary acceptance or conformance evidence.
Cover applicable positive, negative, boundary-isolation, dependency, failure,
recovery, compatibility and synthetic-extensibility cases. Include invalid
input, stale revision, duplicate request, unsupported capability, conflict,
unauthorized, recovery, historical compatibility and terminal-state paths
where relevant.

The conformance suite must attempt to falsify the SPEC and prove:

```text
this component cannot redefine upstream authority
a consumer cannot become owner
a projection cannot become canonical
a local failure mapping cannot change canonical meaning
a downstream dependency cannot define upstream semantics
repository behavior cannot override accepted authority
```

Rebuild the traceability matrix:

| Requirement | Portfolio Obligation | ADR | ADR Section | Ownership Role | Acceptance/Test |
|---|---|---|---|---|---|

The following invariants must hold for local completion:

```text
OWNED_OBLIGATIONS_WITHOUT_REQUIREMENT = 0
REQUIREMENTS_WITHOUT_PORTFOLIO_AUTHORITY = 0
REQUIREMENTS_WITHOUT_ADR_AUTHORITY = 0
```

The SPEC may describe known gap classifications but must not generate or
complete the downstream formal Gap Matrix. Remove implementation-plan leakage:
phases, files, classes, commit groups, tickets, worktree assignments,
implementation units or development sequencing, unless the sequence itself is
normatively required by accepted architecture.

Only implementation-detail questions may remain open. Architectural,
portfolio-ownership, or upstream-contract questions require the corresponding
blocker.

Re-run the shared Implementation Decision Simulation for every critical
requirement. A `NO` or `UNKNOWN` answer remains a SPEC authority failure even
when a proof ID, fixture, constructor, `rehydrate(...)`, or conformance test
exists. For each cross-SPEC capability preserve the independent authority,
contract, local-testability, and productive-availability dimensions, the
dependency class, and the full producer/consumer evidence; local testability
must not be promoted to productive availability without the complete
`NO_DOWNSTREAM_CAPABILITY_PROMOTION_WITHOUT_NEW_EVIDENCE` record.

## Reconciliation and local validation

Cross-check ownership, ADR authority, obligations, consumed contracts,
requirements, failures, recovery, compatibility, dependencies, acceptance,
conformance suite, traceability, gap summary, risks and Definition of Done.
Correct contradictory representations throughout the component SPEC; do not
fix one table while leaving conflicting prose.

Calculate and report:

```text
PORTFOLIO_OBLIGATIONS_OWNED
PORTFOLIO_OBLIGATIONS_COVERED
OWNED_OBLIGATIONS_UNCOVERED
OWNED_OBLIGATIONS_PARTIAL
NORMATIVE_REQUIREMENTS
REQUIREMENTS_WITHOUT_AUTHORITY
IMPLEMENTER_DECISION_CHECK_FAILURES
CAPABILITY_AVAILABILITY_CLASSIFICATION_ERRORS
DOWNSTREAM_PROMOTION_WITHOUT_NEW_EVIDENCE
CONSUMED_CONTRACTS
CONSUMED_CONTRACTS_REDEFINED
UNTESTABLE_REQUIREMENTS
ACCEPTANCE_GAPS
NORMATIVE_DEPENDENCIES
UNAPPROVED_DEPENDENCIES
MISSING_REQUIRED_DEPENDENCIES
DEPENDENCY_DIRECTION_VIOLATIONS
FAILURE_OWNER_VIOLATIONS
COMPATIBILITY_OWNER_VIOLATIONS
ARCHITECTURE_GAPS
PORTFOLIO_GAPS
UPSTREAM_CONTRACT_GAPS
IMPLEMENTATION_PLAN_LEAKS
REMEDIATED_FINDINGS
PARTIAL_FINDINGS
BLOCKED_FINDINGS
```

To declare complete, all required invariants must be zero:

```text
OWNED_OBLIGATIONS_UNCOVERED = 0
OWNED_OBLIGATIONS_PARTIAL = 0
REQUIREMENTS_WITHOUT_AUTHORITY = 0
CONSUMED_CONTRACTS_REDEFINED = 0
UNTESTABLE_REQUIREMENTS = 0
ACCEPTANCE_GAPS = 0
UNAPPROVED_DEPENDENCIES = 0
MISSING_REQUIRED_DEPENDENCIES = 0
DEPENDENCY_DIRECTION_VIOLATIONS = 0
FAILURE_OWNER_VIOLATIONS = 0
COMPATIBILITY_OWNER_VIOLATIONS = 0
ARCHITECTURE_GAPS = 0
PORTFOLIO_GAPS = 0
UPSTREAM_CONTRACT_GAPS = 0
IMPLEMENTATION_PLAN_LEAKS = 0
```

Do not self-close findings. The report may use only:

```text
REMEDIATED
PARTIALLY_REMEDIATED
BLOCKED
```

Never use `CLOSED`, `APPROVED`, or `CONFORMANT` for a remediation result.

## Result states and evidence artifact

Use exactly one result:

```text
COMPONENT_SPEC_REMEDIATION_COMPLETE
COMPONENT_SPEC_REMEDIATION_PARTIAL
COMPONENT_SPEC_REMEDIATION_BLOCKED
```

Create:

```text
docs/specs/remediations/<SPEC-ID>-component-spec-remediation.md
```

or the repository-equivalent convention. Do not modify the source audit. The
report must contain, in this order:

```text
# <SPEC-ID> — Component SPEC Remediation
## 1. Remediation mode
## 2. Baseline
## 3. Source audit
## 4. Authority used
## 5. Findings ledger
## 6. Files changed
## 7. Owned obligation remediation
## 8. Upstream contract remediation
## 9. Requirement authority remediation
## 10. Lifecycle/identity remediation
## 11. Failure/recovery remediation
## 12. Compatibility/cutover remediation
## 13. Dependency remediation
## 14. Projection boundary remediation
## 15. Acceptance/conformance remediation
## 16. Traceability remediation
## 17. Gap classification remediation
## 18. Implementation-plan leakage remediation
## 19. Mechanical validation
## 20. Remaining blockers
## 21. Reaudit readiness
```

Include this findings table:

| Finding | Before | Remediation | Authority | Local proof | Status |
|---|---|---|---|---|---|

Allowed status values are `REMEDIATED`, `PARTIALLY_REMEDIATED`, `BLOCKED`,
`ADR_CLARIFICATION_REQUIRED`, `PORTFOLIO_REMEDIATION_REQUIRED`, and
`UPSTREAM_REMEDIATION_REQUIRED`.

The component SPEC Definition of Done targets:

```text
READY_FOR_INDEPENDENT_COMPONENT_SPEC_REAUDIT
```

not implementation, tickets or code. A complete remediation emits that gate,
not the independent audit verdict. The next mandatory step is a fresh
`audit-component-spec-conformance` run.

## Final response format

For a complete run, use:

```text
COMPONENT_SPEC_REMEDIATION_COMPLETE

SPEC: <SPEC-ID>
SOURCE_AUDIT: <path>
SOURCE_VERDICT: FAIL — COMPONENT_SPEC_NON_CONFORMANT

FINDINGS:
- REMEDIATED: <n>
- PARTIAL: <n>
- BLOCKED: <n>

OWNED_OBLIGATIONS:
- TOTAL: <n>
- COVERED: <n>
- UNCOVERED: <n>
- PARTIAL: <n>

REQUIREMENTS:
- TOTAL: <n>
- WITHOUT_AUTHORITY: <n>
- UNTESTABLE: <n>
- ACCEPTANCE_GAPS: <n>

COMPOSITION:
- CONSUMED_CONTRACTS: <n>
- REDEFINED: <n>
- UNAPPROVED_DEPENDENCIES: <n>
- MISSING_REQUIRED_DEPENDENCIES: <n>
- DIRECTION_VIOLATIONS: <n>

FAILURES:
- OWNER_VIOLATIONS: <n>

COMPATIBILITY:
- OWNER_VIOLATIONS: <n>

BLOCKERS:
- ARCHITECTURE: <n>
- PORTFOLIO: <n>
- UPSTREAM: <n>

GATE:
READY_FOR_INDEPENDENT_COMPONENT_SPEC_REAUDIT

REMEDIATION_REPORT:
<path>
```

For partial remediation, use
`COMPONENT_SPEC_REMEDIATION_PARTIAL` and gate `REMEDIATION_INCOMPLETE`.
For blocked remediation, use `COMPONENT_SPEC_REMEDIATION_BLOCKED` and name
`ADR_CLARIFICATION_REQUIRED`, `PORTFOLIO_REMEDIATION_REQUIRED`,
`UPSTREAM_REMEDIATION_REQUIRED`, or `REMEDIATION_BLOCKED`.

## Completion invariant

Completion requires local evidence that every approved portfolio obligation
owned by this component is fully represented by authority-backed, testable
requirements; consumed upstream contracts are referenced without semantic
redefinition; requirements preserve ADR and portfolio authority; applicable
lifecycle, identity, failure, recovery, compatibility and dependency semantics
are complete; projections and transport remain non-authoritative; implementation
plan content did not leak into the SPEC; and every validated finding was
addressed without inventing an architectural, portfolio, or upstream decision.

Even when this invariant holds, the SPEC is not conformant. Return only:

```text
READY_FOR_INDEPENDENT_COMPONENT_SPEC_REAUDIT
```

and require the independent `audit-component-spec-conformance` re-audit.
