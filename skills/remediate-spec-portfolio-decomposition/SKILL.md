---
name: remediate-spec-portfolio-decomposition
description: >
  Remediate a SPEC portfolio decomposition after an independent
  audit-spec-portfolio-decomposition verdict of
  PORTFOLIO_DECOMPOSITION_REMEDIATION_REQUIRED. Resolve validated SPD findings
  by correcting ownership, ADR obligation traceability, cross-SPEC authority,
  dependency representations, failure semantic ownership, compatibility and
  cutover allocation, projection boundaries, repository-state synchronization,
  readiness criteria, and auditability. Use before component SPEC generation.
  This skill may modify the portfolio decomposition and directly affected
  non-authoritative component drafts only when required to eliminate
  contradiction with the portfolio. It must not modify accepted ADRs, invent
  architectural decisions, create downstream Gap Matrices, Implementation
  Plans, tickets, or production code.
---

# Remediate SPEC Portfolio Decomposition

Before baseline validation, read
`skills/_shared/baseline-drift-remediation-contract.md`. Portfolio drift may be
reconciled from a complete actionable audit reassessment; only unassessed drift
or a stale audit basis blocks.

## Purpose

Remediate validated findings produced by:

```text
audit-spec-portfolio-decomposition
```

so that an audited SPEC portfolio composition can safely transition from:

```text
PORTFOLIO_DECOMPOSITION_REMEDIATION_REQUIRED
        v
portfolio remediation
        v
READY_FOR_INDEPENDENT_DECOMPOSITION_REAUDIT
        v
audit-spec-portfolio-decomposition
```

The goal is not to make the document appear complete.

The goal is to make the decomposition mechanically provable.

The remediation must establish:

> Every accepted architectural obligation has exactly one coherent normative
> SPEC owner, consumer relationships are explicitly non-authoritative,
> dependency direction is unambiguous and acyclic, transversal contracts have
> unique owners, compatibility and failure semantics are allocated, projections
> cannot become canonical authority, and the approved decomposition can safely
> govern generation of component SPECs.

---

# Operating mode

Operate in:

```text
WRITE_ALLOWED
AUDIT_DRIVEN
ADR_FIRST
PORTFOLIO_FIRST
MINIMAL_SCOPE
NO_ARCHITECTURE_INVENTION
NO_DOWNSTREAM_GENERATION
NO_IMPLEMENTATION
NO_FINDING_SELF_CLOSURE
```

The remediation may modify:

1. the audited SPEC portfolio composition;
2. directly related organizational/index documentation when required;
3. already materialized but non-authoritative component drafts only when they
   directly contradict the portfolio and would otherwise contaminate future
   generation;
4. remediation evidence required by repository conventions.

The remediation must not modify:

* accepted ADR decisions;
* accepted ADR semantics;
* prototype behavior;
* production code;
* tests unrelated to portfolio validation;
* Gap Matrix;
* Implementation Plan;
* tickets;
* implementation artifacts;
* historical audit reports.

Historical audit reports are immutable evidence.

Never rewrite the original decomposition audit to make findings disappear.

---

# Required inputs

Required:

1. the SPEC portfolio composition;
2. the latest independent decomposition audit;
3. all accepted ADRs referenced by the portfolio;
4. any component drafts explicitly referenced by validated findings.

Supporting:

* ADR governance/index;
* previous ADR portfolio audit/remediation evidence;
* repository inventory;
* prototype documentation where the audit finding refers to prototype
  authority;
* repository conventions for SPEC metadata.

---

# Authority order

During remediation use:

```text
accepted ADR
    >
accepted ADR addendum/successor
    >
validated independent decomposition audit findings
    >
SPEC portfolio being remediated
    >
non-authoritative component drafts
    >
prototype
    >
implementation
```

The audit determines what defect was proven.

The ADRs determine what the correct architectural result may be.

The remediation must not override either.

---

# Core remediation rule

For every validated finding:

```text
FINDING
    v
source ADR authority
    v
root cause
    v
minimal portfolio correction
    v
mechanical proof
```

Do not remediate by prose only when the finding requires mechanical structure.

Examples:

Bad:

```text
Every behavior has one owner.
```

Good:

```text
O-032 | ADR-0006 SectionDecision | external effect intent |
SPEC-PLAT-001 | GIT, REPO, BACKEND | CANONICAL_OWNER
```

The portfolio should increasingly function as machine-checkable governance,
not explanatory prose alone.

---

# Finding eligibility

Remediate only findings from the latest valid audit with classification:

```text
PORTFOLIO_COMPOSITION_DEFECT
AUDITABILITY_GAP
EVIDENCE_GAP
```

Do not silently remediate an ARCHITECTURE_GAP.

If remediation reveals that an apparent portfolio defect actually requires a
new product or architectural decision, stop that finding with:

```text
ARCHITECTURE_DECISION_REQUIRED
```

Do not choose between architectural alternatives.

---

# Required remediation result

The remediation may finish with exactly one result:

```text
PORTFOLIO_DECOMPOSITION_REMEDIATION_COMPLETE
PORTFOLIO_DECOMPOSITION_REMEDIATION_PARTIAL
PORTFOLIO_DECOMPOSITION_REMEDIATION_BLOCKED
```

## COMPLETE

Use only when every validated remediable finding has been addressed and all
mechanical checks pass locally.

This does not mean the portfolio is approved.

Only the independent audit may approve it.

## PARTIAL

Use when one or more findings remain unresolved but no architecture decision is
required.

## BLOCKED

Use when:

* accepted ADR authority is contradictory;
* remediation requires a new ADR/addendum;
* the source audit evidence is unavailable or invalid;
* repository state prevents safe correction;
* a finding cannot be remediated without modifying authoritative architecture.

---

# Required remediation workflow

Perform every phase below.

---

## Phase 1 - Establish remediation baseline

Record:

```text
PORTFOLIO
AUDIT_REPORT
AUDIT_VERDICT
REPOSITORY_HEAD
WORKING_TREE_STATE
PORTFOLIO_REVISION_BEFORE
COMPONENT_DRAFTS_PRESENT
VALIDATED_FINDINGS
BASELINE_DRIFT_STATUS
REASSESSMENT_COMPLETE
BASELINE_REMEDIATION_READINESS
AUDIT_BASIS_FINGERPRINT
BASELINE_REASSESSMENT_PROOF
```

Confirm the audit verdict is:

```text
PORTFOLIO_DECOMPOSITION_REMEDIATION_REQUIRED
```

If the latest valid audit already says:

```text
PORTFOLIO_DECOMPOSITION_APPROVED
```

do not remediate.

If repository state has changed substantially since the audit, identify whether
the findings are still applicable before editing.

Consume `BASELINE_REASSESSMENT_PROOF` when the audit identified drift. Record
both the originally audited and currently adopted authority/repository baselines
and compare the live fingerprint before editing:

```text
DRIFT_ASSESSED + REASSESSMENT_COMPLETE = YES + live basis equal
  => BASELINE_REMEDIATION_READINESS = READY
  => REMEDIATION_ENTRY_STATE = PORTFOLIO_REMEDIATION_REQUIRED

DRIFT_UNASSESSED or REASSESSMENT_COMPLETE = NO
  => BASELINE_REMEDIATION_READINESS = BLOCKED_INSUFFICIENT_REASSESSMENT

live basis differs after audit
  => BASELINE_REMEDIATION_READINESS = BLOCKED_INSUFFICIENT_REASSESSMENT
  => reason = STALE_AUDIT_BASIS
```

Do not assume drift disappeared, and do not request a duplicate audit merely
because the existing audit reported drift.

---

## Phase 2 - Build finding remediation ledger

Create an internal ledger:

| Finding | Severity | Root cause | Target artifact | ADR authority | Planned correction | Validation |
| ------- | -------- | ---------- | --------------- | ------------- | ------------------ | ---------- |

Each finding must be classified:

```text
REMEDIATE
ALREADY_RESOLVED_BY_NEWER_STATE
ARCHITECTURE_DECISION_REQUIRED
INVALIDATED_BY_BASELINE_CHANGE
BLOCKED
```

ALREADY_RESOLVED_BY_NEWER_STATE requires mechanical evidence.

Do not merely state that text "looks corrected".

---

# Mandatory remediation for obligation ownership

## Phase 3 - Create canonical architectural obligation inventory

If the audit extracted obligation IDs, reuse them.

Do not renumber unless necessary.

For the current portfolio this means preserving IDs such as:

```text
O-001
...
O-078
```

Create a normative portfolio matrix with at least:

```text
Obligation ID
Source ADR
Source section
Normative obligation
Owner SPEC
Consumer SPECs
Authority type
Cross-cutting
Failure family, if any
Compatibility class, if any
Notes
```

Recommended authority types:

```text
CANONICAL_OWNER
CONSUMER
TRANSPORT_MAPPING
DERIVED_PROJECTION
OPERATIONAL_PROJECTION
EXTERNAL_ADAPTER
```

Only one row/owner may have:

```text
CANONICAL_OWNER
```

for a given normative obligation.

Consumers may be many.

---

## Phase 4 - Enforce owner cardinality

For every obligation enforce:

```text
OWNER_COUNT(obligation) = 1
```

Reject:

```text
0 owners
>1 owners
"all specs"
"backend by default"
"implementation"
"future spec"
"transversal"
```

as normative ownership values.

Cross-cutting behavior still requires exactly one owner.

Consumers may be many.

---

## Phase 5 - Reconcile ADR-level and obligation-level traceability

The portfolio must contain or reference a mechanically consistent chain:

```text
ADR
    v
obligation
    v
owner SPEC
    v
consumer SPECs
```

The ADR-level summary table may remain for readability.

It must be treated as derived/summary data.

The obligation-level matrix is authoritative for decomposition.

For each ADR compute:

```text
TOTAL_OBLIGATIONS
OWNED
UNOWNED
AMBIGUOUS
CONSUMERS
```

Approval target:

```text
UNOWNED = 0
AMBIGUOUS = 0
```

---

# Mandatory remediation for projection boundaries

## Phase 6 - Clarify canonical versus projected authority

Explicitly separate:

```text
canonical semantic ownership
application orchestration
transport
projection
presentation
operational evidence
```

The portfolio must state that a lower-level technical surface does not become
canonical authority merely because it carries a command/event/finding.

At minimum define:

### Domain

May own:

* canonical identities;
* lifecycle/state transitions;
* domain command semantics;
* command preconditions;
* canonical domain events;
* audit/conformance semantics where authorized by ADRs.

### Backend

May own:

* application dispatch;
* API command envelopes;
* query contracts;
* event transport;
* correlation;
* replay/reconnection protocol;
* local authentication;
* local authorization;
* intervention notifications.

Backend must not redefine:

* canonical state transitions;
* domain command semantics;
* audit verdict semantics;
* publication semantics;
* scheduler eligibility;
* canonical effect confirmation.

### OPS

May own:

* operational projection;
* telemetry;
* retention;
* correlation;
* logs;
* backup/export;
* reconstructable operational history.

OPS must not redefine:

* canonical audit findings;
* domain events;
* effect confirmation;
* lifecycle transitions.

### UI

May own:

* user interaction;
* presentation;
* navigation;
* local view behavior.

UI must never own canonical operational state.

---

## Phase 7 - Resolve command/event ambiguity

Every command/event family referenced by BACKEND must be classified.

Use:

```text
CANONICAL_DOMAIN_COMMAND
APPLICATION_COMMAND_ENVELOPE
TRANSPORT_COMMAND
CANONICAL_DOMAIN_EVENT
INTEGRATION_EVENT
TRANSPORT_EVENT
PROJECTION_EVENT
```

The portfolio must identify which SPEC owns each canonical semantic.

Do not allow SPEC-BACKEND-001 owns commands/events as an unqualified
statement.

Replace broad ownership wording with precise transport/application ownership.

---

## Phase 8 - Resolve findings/evidence ambiguity

Separate at minimum:

```text
CANONICAL_AUDIT_FINDING
AUDIT_REPORT
OPERATIONAL_EVENT
EFFECT_EVIDENCE
PUBLICATION_EVIDENCE
EXPORT_RECORD
UI_PROJECTION
```

Assign one semantic owner to each canonical class.

Consumers may persist, correlate, export or render them.

They must not redefine their meaning.

---

# Mandatory remediation for failure semantics

## Phase 9 - Build failure ownership matrix

Create a normative table with:

```text
Failure code/family
Source ADR
Canonical semantic owner
Consumer specs
Transport mapping owner
UI presentation owner
Log/observability owner
Name stability
Recovery semantics owner
```

For every named failure from the portfolio, assign exactly one semantic owner.

Examples include:

```text
UNKNOWN_REPOSITORY
REPOSITORY_NOT_ENABLED
UNKNOWN_SPEC
INELIGIBLE_REVISION
UNKNOWN_CAPABILITY
INCOMPATIBLE_CAPABILITY
INVALID_DEPENDENCY_CLOSURE
INVALID_COMMAND_BASIS
STALE_REVISION
UNAUTHORIZED_LOCAL_SESSION
CAPACITY_UNKNOWN
CAPACITY_EXHAUSTED
AGENT_INELIGIBLE
CONTRACT_INVALID
VERDICT_UNKNOWN
EXPECTED_INCOMPLETE_EFFECT
MISSING_EFFECT
SEMANTIC_DIVERGENCE
CONFLICTING_EFFECT
PUBLICATION_DRIFT
MERGE_CONFLICT
REMOTE_PUBLICATION_UNCONFIRMED
LEGACY_COMPATIBILITY_ONLY
```

Do not infer owner based only on error name.

Resolve owner from accepted ADR authority.

If two plausible owners remain after ADR review, stop with:

```text
ARCHITECTURE_DECISION_REQUIRED
```

---

## Phase 10 - Preserve failure semantic hierarchy

Define:

```text
canonical failure semantic
    v
application mapping
    v
transport representation
    v
operational logging
    v
UI presentation
```

A consumer may change representation.

A consumer may not change:

* trigger conditions;
* semantic meaning;
* retryability;
* terminality;
* recovery meaning;
* authority implications.

---

# Mandatory compatibility and cutover remediation

## Phase 11 - Create compatibility ownership matrix

For every component evaluate:

```text
NEW_CANONICAL_PATH
LEGACY_COMPATIBILITY
HISTORICAL_REPLAY
CUTOVER
RETIREMENT
```

Use a table:

| SPEC | New path | Legacy | Replay | Cutover | Retirement |
| ---- | -------- | ------ | ------ | ------- | ---------- |

Each applicable cell must classify:

```text
OWNER
CONSUMER
NOT_APPLICABLE
```

If OWNER, identify the exact obligation/ADR.

If CONSUMER, identify the owning SPEC.

If NOT_APPLICABLE, justify.

---

## Phase 12 - Prevent dual canonical paths

The portfolio must establish that:

```text
legacy support != second canonical authority
```

Where compatibility exists, explicitly define:

```text
canonical new behavior
legacy interpretation/adaptation
migration/reconciliation
cutover condition
retirement condition
historical preservation
```

No component may treat legacy and new behavior as equally canonical unless an
ADR explicitly says so.

---

# Mandatory dependency remediation

## Phase 13 - Establish one canonical dependency edge list

Create one canonical table:

```text
From SPEC
To dependency SPEC
Dependency type
Reason
Source obligation
Direct or transitive
```

Dependency type must be one of:

```text
NORMATIVE
IMPLEMENTATION
PROJECTION
EVIDENCE
```

The portfolio's normative DAG must use only:

```text
NORMATIVE
```

unless governance explicitly requires otherwise.

---

## Phase 14 - Derive all visual representations from the edge list

The ASCII graph, summary table and recommended generation order must describe
the same dependency graph.

No manually shortened diagram may be presented as a complete graph unless
explicitly labeled:

```text
SIMPLIFIED_VIEW
```

Preferred rule:

```text
Canonical dependency table = source of truth.
Diagram = derived visualization.
```

Validate:

```text
SELF_EDGES = 0
DIRECT_CYCLES = 0
TRANSITIVE_CYCLES = 0
EDGE_SET_MISMATCH = 0
```

---

## Phase 15 - Eliminate reverse authority dependencies

A normative upstream SPEC must not depend on a downstream projection merely
because that downstream component consumes it.

Invalid:

```text
DOM -> BACKEND
DOM -> UI
DOM -> OPS
```

when the intended meaning is merely that those specs consume DOM.

Correct direction:

```text
BACKEND depends on DOM
OPS depends on BACKEND/PLAT/etc.
UI depends on BACKEND/OPS/DOM contracts
```

Dependency direction must mean:

> this component requires authoritative contracts from the dependency in order
> to define its own normative behavior.

---

# Current component draft handling

## Phase 16 - Inventory existing component drafts

Before generating or modifying component specs, list:

```text
docs/specs/SPEC-*.md
```

Classify each:

```text
ACCEPTED
PROPOSED
DRAFT
HISTORICAL
UNKNOWN
```

Reconcile the portfolio's repository-state section with reality.

Do not say:

```text
No component SPEC exists.
```

if a draft exists.

Prefer:

```text
No accepted canonical component SPEC exists.
One non-authoritative PROPOSED draft currently exists.
```

---

## Phase 17 - Handle pre-existing non-authoritative drafts

A non-authoritative draft may be changed only when:

1. a validated portfolio audit finding explicitly identifies it;
2. leaving it unchanged would create immediate ownership/dependency drift;
3. the correction is mechanical from accepted authority.

Permitted corrections include:

* dependency direction;
* owner reference;
* ADR traceability;
* status/inventory synchronization;
* explicit statement that it remains non-authoritative.

Do not expand the draft into a completed component SPEC during portfolio
remediation.

Do not add requirements unrelated to the finding.

The goal is:

```text
make the draft non-contradictory
```

not:

```text
finish the draft
```

---

# Mandatory readiness remediation

## Phase 18 - Separate decomposition approval from component conformance

The portfolio must define two independent gates.

### Gate A - decomposition

```text
PORTFOLIO_DECOMPOSITION_APPROVED
```

Proves:

* obligations accounted for;
* owners unique;
* DAG valid;
* boundaries coherent;
* no architecture invented;
* safe to generate components.

### Gate B - materialized portfolio

Future:

```text
SPEC_PORTFOLIO_CONFORMANT
```

Proves:

* generated component SPECs obey the approved decomposition;
* no ownership drift;
* no duplicate authority;
* no missing obligations;
* no new dependency cycles.

Do not require Gate B artifacts to approve Gate A.

---

## Phase 19 - Correct portfolio Definition of Done

The portfolio's decomposition DoD must not depend on generated component specs.

Replace circular or mixed readiness criteria with something equivalent to:

```text
The decomposition is ready for independent audit when:

- accepted ADR authority is frozen and identifiable;
- every architectural obligation is mapped to exactly one owner;
- consumers are explicitly non-authoritative;
- the dependency graph is complete and acyclic;
- failure semantic ownership is explicit;
- compatibility/cutover ownership is explicit;
- projection boundaries are explicit;
- repository-state inventory is current;
- no unsupported architectural decision was introduced.
```

After approval:

```text
component SPEC generation may begin.
```

Future component completion is a different gate.

---

# Mandatory gap-taxonomy remediation

## Phase 20 - Separate gap category from status and evidence

Do not mix these concepts.

Use separate fields:

```text
Gap ID
Gap subject
Gap category
Closure status
Evidence type
Owner
Next gate
```

Allowed gap categories:

```text
SPECIFICATION_GAP
IMPLEMENTATION_GAP
ARCHITECTURE_GAP
NON_GAP
PROTOTYPE_ONLY
UNFROZEN_IMPLEMENTATION_DETAIL
```

Suggested closure status:

```text
OPEN
PARTIALLY_CLOSED
CLOSED
NOT_APPLICABLE
```

Suggested evidence type:

```text
ARCHITECTURAL_AUTHORITY
SPECIFICATION
PROTOTYPE_EVIDENCE
HISTORICAL_EVIDENCE
IMPLEMENTATION_EVIDENCE
AUDIT_EVIDENCE
NONE
```

CLOSED_BY_SPEC is not a gap category.

HISTORICAL_EVIDENCE is not a gap category.

---

## Phase 21 - Remove premature closure/self-certification

Before independent re-audit, do not state:

```text
the organization gap is closed
the decomposition is conformant
no architecture gap exists
```

as a certified fact.

Allowed:

```text
No known architecture gap was identified during remediation.
Independent re-audit must validate this conclusion.
```

The remediation may report its local checks.

It may not emit the audit verdict.

---

# Mandatory relationship to accepted ADR evidence

## Phase 22 - Synchronize authoritative references

Check portfolio metadata and related links.

If a later authoritative ADR portfolio remediation/audit supersedes an earlier
supporting evidence record, update the related set or evidence references.

Do not change accepted ADR content.

Do not copy audit status into ADR front matter unless governance requires it.

The portfolio should point to the current accepted authority evidence.

---

# Mandatory cross-representation reconciliation

## Phase 23 - Reconcile all representations

Compare and normalize:

```text
component catalog
obligation matrix
ADR summary matrix
failure matrix
compatibility matrix
dependency table
dependency diagram
component descriptions
gap table
acceptance criteria
Definition of Done
recommended order
current repository inventory
```

All must tell the same story.

For every contradiction, choose the representation supported by:

```text
accepted ADR
+
canonical obligation ownership matrix
```

Do not choose whichever wording is easier to preserve.

---

# Mandatory current-finding remediation mapping

When the latest audit contains the following findings, apply these minimum
remediations.

## SPD-MAJOR-001

Required:

```text
Add complete ADR obligation inventory and mechanical:
ADR -> obligation -> owner -> consumers mapping.
```

Closure invariant:

```text
NO_OWNER = 0
OWNER_UNCLEAR = 0
MULTIPLE_OWNERS = 0
INVALID_OWNER = 0
```

---

## SPD-MAJOR-002

Required:

```text
Add failure semantic ownership/mapping table.
```

Closure invariant:

```text
each failure family has exactly one canonical semantic owner
```

---

## SPD-MAJOR-003

Required:

```text
Add compatibility/cutover ownership matrix by component.
```

Closure invariant:

```text
all applicable NEW_PATH / LEGACY / REPLAY / CUTOVER / RETIREMENT
obligations have exactly one owner
```

---

## SPD-MAJOR-004

Required:

```text
Clarify BACKEND and OPS as application/transport/projection boundaries.
Assign canonical commands/events/findings/effect evidence to actual owners.
```

Closure invariant:

```text
backend/ops relationships classify as
REFERENCE_ONLY / TRANSPORT_MAPPING / DERIVED_PROJECTION
```

No ambiguous canonical ownership remains.

---

## SPD-MAJOR-005

Required:

```text
Create one canonical direct edge table and regenerate/align diagram,
prose and execution/specification order.
```

Closure invariant:

```text
EDGE_SET_MISMATCH = 0
CYCLES = 0
```

---

## SPD-MAJOR-006

Required:

```text
Synchronize repository inventory and reconcile the existing PROPOSED DOM draft
with the portfolio direction without treating it as accepted authority.
```

Closure invariant:

```text
portfolio inventory matches repository
DOM has no downstream normative dependency
ADR ownership references match portfolio
draft remains non-authoritative until its own audit
```

---

## SPD-MINOR-001

Required:

```text
Separate gap category, closure status and evidence type.
```

Closure invariant:

```text
every gap row uses governed enums in separate fields
```

---

# Phase 24 - Update portfolio acceptance criteria

Acceptance criteria must become mechanically testable.

At minimum include:

```text
[ ] All accepted ADRs are represented.
[ ] Every extracted architectural obligation has exactly one normative owner.
[ ] Every consumer is explicitly non-authoritative.
[ ] No normative obligation is orphaned.
[ ] No canonical ownership collision exists.
[ ] Every failure family has one semantic owner.
[ ] Compatibility/cutover ownership is explicit.
[ ] Canonical dependency graph has zero cycles.
[ ] Diagram/table/prose edge sets are consistent.
[ ] No upstream SPEC depends on downstream authority.
[ ] Prototype remains non-authoritative.
[ ] Backend/API/OPS/UI remain projections/mappings where applicable.
[ ] Gap taxonomy separates category/status/evidence.
[ ] Repository component inventory is current.
[ ] No unsupported architecture was introduced.
[ ] No downstream Gap Matrix, plan or tickets were generated.
```

Do not mark these as approved.

The remediation may mark local validation only.

---

# Phase 25 - Run mechanical validations

Run or implement local checks where feasible.

At minimum validate:

```text
ADR_COUNT
OBLIGATION_COUNT
OWNER_COUNT_PER_OBLIGATION
UNOWNED_OBLIGATIONS
AMBIGUOUS_OWNERS
MULTIPLE_OWNERS
FAILURE_FAMILIES_WITHOUT_OWNER
COMPATIBILITY_CELLS_WITHOUT_OWNER
DIRECT_DEPENDENCY_EDGES
DEPENDENCY_CYCLES
SELF_DEPENDENCIES
GRAPH_EDGE_MISMATCHES
COMPONENT_INVENTORY_MISMATCHES
INVALID_GAP_CATEGORIES
```

If scripts are created only for validation and repository conventions permit
them, keep scope minimal.

Do not create a general framework unless necessary.

---

# Phase 26 - Validate against accepted ADR authority

After structural remediation, re-read every modified normative statement.

For each verify:

```text
SUPPORTED_BY_ACCEPTED_ADR
OR
NECESSARY_PORTFOLIO_DECOMPOSITION_RULE
```

No modified statement may classify:

```text
UNSUPPORTED_ARCHITECTURE
```

If one does:

```text
STOP
ARCHITECTURE_DECISION_REQUIRED
```

---

# Phase 27 - Validate no implementation leakage

Check that remediation did not accidentally freeze:

* database technology;
* DTO shape;
* HTTP routes;
* event transport technology;
* frontend framework;
* SMTP provider;
* specific GitHub polling;
* class/module layout;
* internal storage schema.

Keep implementation choices unfrozen unless an ADR already mandates them.

---

# Phase 28 - Validate no downstream artifact generation

Confirm no new:

```text
Gap Matrix
Implementation Plan
ticket
implementation branch
production code
```

was created as part of this remediation.

Component drafts may only be minimally reconciled under Phase 17.

---

# Phase 29 - Produce remediation evidence

Generate:

```text
docs/specs/<PORTFOLIO-ID>-decomposition-remediation.md
```

or repository-equivalent location.

The remediation report must contain:

```text
# <PORTFOLIO-ID> - Decomposition Remediation

## 1. Remediation mode
## 2. Baseline
## 3. Input audit
## 4. Findings remediated
## 5. Files changed
## 6. Obligation ownership remediation
## 7. Failure semantic ownership remediation
## 8. Compatibility/cutover remediation
## 9. Projection authority remediation
## 10. Dependency graph remediation
## 11. Repository-state synchronization
## 12. Gap taxonomy remediation
## 13. Acceptance/DoD remediation
## 14. Mechanical validation
## 15. ADR authority revalidation
## 16. Remaining issues
## 17. Reaudit readiness
```

Do not alter the audit report.

---

# Required finding remediation table

The report must contain:

| Finding | Before | Remediation | Mechanical evidence | Status |
| ------- | ------ | ----------- | ------------------- | ------ |

Allowed statuses:

```text
REMEDIATED
PARTIALLY_REMEDIATED
BLOCKED
ARCHITECTURE_DECISION_REQUIRED
```

Do not use:

```text
CLOSED
APPROVED
CONFORMANT
```

Only the independent auditor may close findings.

---

# Required quantitative evidence

Report:

```text
Authoritative ADRs:
Architectural obligations:
Component SPECs:
Obligations with exactly one owner:
Unowned obligations:
Ambiguous owners:
Multiple owners:
Failure families:
Failure families with one semantic owner:
Compatibility obligations:
Compatibility obligations with one owner:
Normative dependency edges:
Dependency cycles:
Graph representation mismatches:
Component inventory mismatches:
Invalid gap taxonomy rows:
Findings remediated:
Findings remaining:
```

---

# Required local gate checks

Before declaring remediation complete require:

```text
UNOWNED_OBLIGATIONS = 0
AMBIGUOUS_OWNERS = 0
MULTIPLE_OWNERS = 0
FAILURE_FAMILIES_WITHOUT_OWNER = 0
COMPATIBILITY_OWNER_GAPS = 0
DEPENDENCY_CYCLES = 0
GRAPH_EDGE_MISMATCHES = 0
COMPONENT_INVENTORY_MISMATCHES = 0
INVALID_GAP_TAXONOMY_ROWS = 0
```

And:

```text
ARCHITECTURE_DECISION_REQUIRED = 0
```

If any is nonzero:

```text
PORTFOLIO_DECOMPOSITION_REMEDIATION_PARTIAL
```

or:

```text
PORTFOLIO_DECOMPOSITION_REMEDIATION_BLOCKED
```

---

# Reaudit gate

The remediation may emit:

```text
READY_FOR_INDEPENDENT_DECOMPOSITION_REAUDIT
```

only if all validated findings are locally remediated.

This does not mean:

```text
PORTFOLIO_DECOMPOSITION_APPROVED
```

The next mandatory step is:

```text
audit-spec-portfolio-decomposition
```

with a fresh independent context.

Prefer a different agent/session from the remediator.

---

# Final console response format

Use exactly this structure:

```text
SPEC_PORTFOLIO_DECOMPOSITION_REMEDIATION_COMPLETE

PORTFOLIO: <id>
SOURCE_AUDIT: <path>
SOURCE_VERDICT: PORTFOLIO_DECOMPOSITION_REMEDIATION_REQUIRED

FINDINGS:
- REMEDIATED: <n>
- PARTIAL: <n>
- BLOCKED: <n>
- ARCHITECTURE_DECISION_REQUIRED: <n>

OWNERSHIP:
- ARCHITECTURAL_OBLIGATIONS: <n>
- UNIQUE_OWNER: <n>
- NO_OWNER: <n>
- OWNER_UNCLEAR: <n>
- MULTIPLE_OWNERS: <n>

FAILURE_SEMANTICS:
- FAMILIES: <n>
- UNIQUE_SEMANTIC_OWNER: <n>
- UNRESOLVED: <n>

COMPATIBILITY:
- OBLIGATIONS: <n>
- UNIQUE_OWNER: <n>
- UNRESOLVED: <n>

DEPENDENCIES:
- NORMATIVE_EDGES: <n>
- CYCLES: <n>
- REPRESENTATION_MISMATCHES: <n>

REPOSITORY_STATE:
- COMPONENT_DRAFTS: <n>
- INVENTORY_MISMATCHES: <n>

ARCHITECTURE_GAPS_FOUND_DURING_REMEDIATION: <n>

GATE:
<READY_FOR_INDEPENDENT_DECOMPOSITION_REAUDIT |
REMEDIATION_INCOMPLETE |
ARCHITECTURE_DECISION_REQUIRED |
REMEDIATION_BLOCKED>

REMEDIATION_REPORT:
<path>
```

If remediation is partial, change the first line to:

```text
SPEC_PORTFOLIO_DECOMPOSITION_REMEDIATION_PARTIAL
```

If blocked:

```text
SPEC_PORTFOLIO_DECOMPOSITION_REMEDIATION_BLOCKED
```

---

# Prohibited actions

Do not:

* modify accepted ADR semantics;
* make a new architectural choice;
* mark the portfolio approved;
* mark audit findings closed;
* rewrite the source audit;
* generate all component SPECs;
* generate Gap Matrix;
* generate Implementation Plan;
* generate tickets;
* write production code;
* use prototype behavior to resolve missing architecture;
* make BACKEND authoritative because it is executable;
* make OPS authoritative because it persists evidence;
* make UI authoritative because it initiates commands;
* silently choose an owner when ADR authority remains ambiguous;
* preserve contradictory text solely to minimize diff size.

---

# Preferred remediation strategy

Prefer:

```text
mechanical tables
+
explicit ownership enums
+
canonical edge list
+
derived summaries
```

over duplicated prose.

Where possible, organize the portfolio as:

```text
accepted ADR authority
        v
architectural obligation registry
        v
component ownership registry
        v
failure ownership registry
        v
compatibility registry
        v
dependency registry
        v
human-readable component descriptions
```

The human-readable sections should be consistent projections of those
registries.

This reduces future divergence during component SPEC generation.

---

# Completion invariant

The remediation is complete only when local evidence can support:

> Every accepted ADR obligation represented by this portfolio has exactly one
> normative SPEC owner; all consumer relationships are explicitly
> non-authoritative; canonical command, event, finding, failure, effect and
> publication semantics cannot be redefined by transport, operation or UI
> layers; compatibility and cutover responsibilities are allocated; the
> normative dependency graph has one canonical acyclic representation; existing
> component drafts do not contradict the portfolio; gap classifications are
> mechanically well-typed; and no new architectural decision was introduced.

Even when this invariant is satisfied, do not approve the portfolio.

Return:

```text
READY_FOR_INDEPENDENT_DECOMPOSITION_REAUDIT
```

and require a fresh independent audit.
