---
name: audit-spec-portfolio-conformance
description: >
  Independently and adversarially audit a materialized SPEC portfolio against
  its approved portfolio decomposition and accepted ADR authority. Verify
  ownership, obligations, dependency direction, cross-SPEC contracts,
  traceability, independence, projection boundaries, compatibility semantics
  and architectural authority. Detect ownership drift, duplicated normative
  behavior, missing obligations, hidden reverse dependencies, cycles,
  consumer-to-owner promotion, architecture invention and decomposition
  divergence. Use only after all component SPECs exist and have completed their
  individual specification audits. Strictly read-only: do not remediate SPECs,
  modify ADRs, regenerate portfolios, create Gap Matrices, Plans, tickets or
  production code.
---

# Audit SPEC Portfolio Conformance

## Purpose

Independently determine whether the materialized component SPEC portfolio
conforms to:

1. accepted ADR authority;
2. the approved SPEC portfolio decomposition;
3. the approved ownership and dependency model.

The audited transition is:

~~~text
ACCEPTED ADR PORTFOLIO
        ↓
APPROVED SPEC PORTFOLIO DECOMPOSITION
        ↓
COMPONENT SPEC GENERATION
        ↓
INDIVIDUAL SPEC AUDITS
        ↓
SPEC PORTFOLIO CONFORMANCE AUDIT
        ↓
SPEC_PORTFOLIO_CONFORMANT
        ↓
GAP MATRIX
~~~

Individual component approval is necessary but not sufficient. This is a
cross-SPEC gate whose job is to detect globally inconsistent but locally
plausible specifications.

## Operating mode and boundaries

Operate in:

~~~text
READ_ONLY
INDEPENDENT
ADVERSARIAL
ADR_FIRST
PORTFOLIO_FIRST
CROSS_SPEC
NO_REMEDIATION
NO_ARCHITECTURE_INVENTION
NO_IMPLEMENTATION_ASSUMPTIONS
~~~

Do not modify files, ADRs, decompositions, component SPECs, audits, prototypes,
Gap Matrices, Plans, tickets, tests or production code. Do not silently reconcile
contradictory authority. Record the contradiction and route it.

Implementation, tests and prototypes are evidence only and never override
accepted ADRs or the approved decomposition.

## Required inputs and preconditions

Required:

1. accepted ADR portfolio and current effective ADR revisions;
2. approved SPEC portfolio decomposition;
3. independent decomposition audit whose verdict is
   PORTFOLIO_DECOMPOSITION_APPROVED;
4. every component SPEC declared by that decomposition;
5. current independent audit for every component SPEC.

Optional evidence includes ADR remediation reports, prior revisions, prototypes,
architecture/repository indexes and historical reports. Optional evidence never
overrides accepted authority.

Before semantic analysis, verify that the decomposition is approved, every
expected SPEC exists, and every individual audit is current and accepted. An
audit may be accepted as SPEC_CONFORMANT, SPECIFICATION_CONFORMANT, APPROVED or
an equivalent repository verdict.

Missing, stale, blocked, remediation-required or superseded component evidence
normally blocks the portfolio audit. Do not perform the missing component audit
inside this skill.

## Authority precedence

~~~text
accepted ADR
    >
accepted superseding ADR or addendum
    >
approved SPEC portfolio decomposition
    >
component SPEC
    >
component SPEC audit
    >
prototype
    >
implementation
    >
tests
    >
historical reports
~~~

The decomposition governs where authority belongs. ADRs govern what authority
exists. A decomposition or component SPEC cannot override an accepted ADR.

## Fundamental invariants

~~~text
ADR_OBLIGATION_COUNT = COMPLETE
OWNER_COUNT(each normative obligation) = 1
APPROVED_OWNER = MATERIALIZED_OWNER
APPROVED_DEPENDENCY_DIRECTION = MATERIALIZED_DEPENDENCY_DIRECTION
CROSS_SPEC_DEPENDENCY_GRAPH = ACYCLIC
CONSUMER != CANONICAL_OWNER
NO_NEW_ARCHITECTURAL_AUTHORITY
~~~

The consumer exception requires explicit approval.

## Verdicts

Use exactly one:

~~~text
SPEC_PORTFOLIO_CONFORMANT
SPEC_PORTFOLIO_REMEDIATION_REQUIRED
SPEC_PORTFOLIO_AUDIT_BLOCKED
~~~

Use SPEC_PORTFOLIO_CONFORMANT only when every expected SPEC and exact current
audit is present; all ADR obligations are represented by exactly one approved
owner; no drift, collision, orphan, duplicated authority, hidden dependency,
cycle, consumer promotion, unsupported architecture or contradiction exists;
transversal contracts have one canonical definition; compatibility and basis
semantics are coherent; and the portfolio is safe input for Gap Matrix
generation.

Use SPEC_PORTFOLIO_REMEDIATION_REQUIRED when authority is sufficient but
materialized SPECs violate the approved decomposition.

Use SPEC_PORTFOLIO_AUDIT_BLOCKED when the baseline cannot be established,
including invalid decomposition approval, missing or nonconformant component
audit, material ADR change after decomposition, authoritative conflict or an
architecture decision requiring recomposition.

## Severity

Use CRITICAL, MAJOR or MINOR.

CRITICAL includes multiple canonical owners, disappeared ADR obligations,
projection/API/UI becoming authority, ADR contradiction, dependency cycles,
silent architecture invention, approved owner replacement or mutually
contradictory individually approved contracts.

MAJOR includes partial ownership drift, duplicated transversal semantics, hidden
downstream dependency, omitted or reversed dependency, divergent failure
semantics, split compatibility ownership, overloaded boundaries, incomplete
traceability or a materially divergent consumer contract.

MINOR is limited to non-semantic stale references, terminology, secondary
consumer omission or diagram mismatch. Authority ambiguity is never MINOR.

## Audit procedure

Perform every phase and preserve evidence.

### Phase 1 — Baseline

Record repository HEAD, portfolio ID and revision, decomposition path and
verdict, baseline/hash, component SPEC IDs and revisions, component audit paths
and verdicts, effective ADR revisions and audit timestamp. If material authority
changes, record AUDIT_BASELINE_CHANGED and stop auditing moving inputs.

### Phase 2 — Decomposition authority

Confirm the portfolio ID/revision, approved verdict, component list, owner
assignments, dependency graph, ADR mapping and closed findings. Build only from
the approved decomposition:

~~~text
APPROVED_COMPONENTS
APPROVED_OWNERS
APPROVED_CONSUMERS
APPROVED_DEPENDENCIES
APPROVED_TRANSVERSAL_CONTRACTS
APPROVED_ADR_MAPPING
~~~

### Phase 3 — Membership drift

Compare approved and actual component lists. Classify every component:

~~~text
EXPECTED_PRESENT
EXPECTED_MISSING
UNAPPROVED_ADDITION
RENAMED_WITH_TRACEABILITY
SUPERSEDED_VALIDLY
AMBIGUOUS
~~~

An addition is safe only when it is documentation restructuring or an
already-approved extraction with no semantic, ownership or dependency change.

### Phase 4 — Current ADR obligations

Independently extract effective ADR obligations into
CURRENT_ADR_OBLIGATION_INVENTORY. Classify each ADR:

~~~text
UNCHANGED
REVISED_EQUIVALENT
SUPERSEDED
NEW_ACCEPTED_AUTHORITY
REMOVED_FROM_EFFECTIVE_SET
~~~

If ownership, lifecycle, identity, dependency, compatibility, publication,
persistence, security, scheduler or audit authority materially changed after
decomposition approval, block with gate PORTFOLIO_RECOMPOSITION_REQUIRED unless
no decomposition impact can be mechanically proven.

### Phase 5 — Materialized requirements

Read every component SPEC and capture every normative requirement, not only
ownership sections:

~~~text
SPEC
requirement ID
normative subject and behavior
source ADR
declared owner
upstream references
downstream consumers
failure semantics
state/lifecycle impact
compatibility impact
~~~

Search MUST/SHALL language, required transitions, acceptance criteria,
conformance tests, failure/state definitions, commands, events and compatibility
rules.

### Phase 6 — Ownership reconstruction

Map each architectural obligation to materialized owner(s):

~~~text
OWNER_MATCH
OWNER_DRIFT
MULTIPLE_MATERIALIZED_OWNERS
MATERIALIZED_ORPHAN
OWNER_AMBIGUOUS
~~~

Require approved owner equals materialized owner unless an explicitly approved
successor changed the decomposition.

### Phase 7 — Ownership drift

Detect a component defining another owner's behavior, omitting its own assigned
behavior, converting a dependency into authority, absorbing a bounded
responsibility, delegating its canonical rule to a consumer or creating a new
canonical owner. Report approved owner, materialized owner, affected
requirements and propagation risk.

### Phase 8 — Normative duplication

Compare requirements semantically across SPECs. Classify overlap:

~~~text
VALID_REFERENCE
VALID_REFINEMENT
VALID_PROJECTION
DUPLICATED_NORMATIVE_AUTHORITY
CONTRADICTORY_DUPLICATION
~~~

References, local refinements and projections may repeat vocabulary but not
upstream authority. The last two classifications require findings.

### Phase 9 — Normative orphans

Compare ADR obligations with materialized requirements:

~~~text
FULLY_MATERIALIZED
PARTIALLY_MATERIALIZED
NOT_MATERIALIZED
AMBIGUOUS
~~~

A prose mention or consumer reference does not close an owner omission.

### Phase 10 — Consumers

For each approved owner/consumer relationship verify reference, basis/version,
terminology, failure semantics and acceptance criteria. Classify:

~~~text
VALID_CONSUMPTION
MISSING_REFERENCE
CONSUMER_REDEFINITION
CONSUMER_CONTRADICTION
CONSUMER_PROMOTED_TO_OWNER
~~~

### Phase 11 — Transversal contracts

Reconstruct canonical definition, references, refinements and projections for
identity, immutability, execution basis, snapshots, state/audit lifecycle,
conformance, skill contract versioning, agent identity, idempotency, journals,
external-effect confirmation, publication vocabulary, correlation and evidence.
Require exactly one canonical definition per transversal contract.

### Phase 12 — Dependency graph

Produce DECLARED_DEPENDENCY_GRAPH and INFERRED_NORMATIVE_DEPENDENCY_GRAPH and
compare both to the approved graph. Detect:

~~~text
MISSING_DECLARED_DEPENDENCY
UNAPPROVED_DEPENDENCY
REVERSED_DEPENDENCY
HIDDEN_DEPENDENCY
SELF_DEPENDENCY
DIRECT_CYCLE
TRANSITIVE_CYCLE
~~~

Use mechanical cycle detection where possible. Approval requires zero cycles.

### Phase 13 — Reverse dependencies

For each component ask whether its normative contract can be understood using
only approved upstream dependencies. Classify:

~~~text
NO_REVERSE_DEPENDENCY
IMPLEMENTATION_ONLY_REFERENCE
HIDDEN_REVERSE_NORMATIVE_DEPENDENCY
CIRCULAR_AUTHORITY
~~~

### Phase 14 — Independence

Classify each component as INDEPENDENT,
UPSTREAM_DEPENDENT_AS_APPROVED, DOWNSTREAM_COUPLED or MUTUALLY_COUPLED.
Approved upstream dependencies are valid; downstream components must not define
upstream behavior.

### Phase 15 — Boundary cohesion

Compare actual normative contents with the approved boundary:

~~~text
BOUNDARY_PRESERVED
BOUNDARY_EXPANDED
BOUNDARY_SHRUNK
BOUNDARY_MIXED
BOUNDARY_FRAGMENTED
~~~

Raise findings for normative expansion, shrinkage, mixing or fragmentation.

### Phase 16 — State machines

Collect every state and transition and build:

~~~text
STATE_MACHINE
OWNER
STATES
TRANSITIONS
GUARDS
TERMINAL_STATES
FAILURES
CONSUMERS
~~~

Check domain, execution, scheduler, repository, Git/publication, backend and
UI. No canonical state machine may acquire two owners; a projection must remain
a projection.

### Phase 17 — Identities

For every identity, including RepositoryId, SpecId, SpecRevision, ExecutionId,
ArtifactCycleId, ActivityId, AgentAssignmentId, TicketId, WaveId, EffectId and
PublicationId, verify canonical owner, creation authority, immutability,
equality semantics, lifecycle, persistence and projection usage. Consumers carry
canonical identity; they do not independently recreate it.

### Phase 18 — Commands, queries and events

Verify semantic owner, mutation owner, projection owner, producer, consumer and
confirmation semantics. Transport may refine representation but cannot change
canonical semantics.

### Phase 19 — Failure semantics

Build a global failure inventory with canonical owner/meaning, producer,
consumers, transport mapping, UI representation and recovery. Detect same-name
different-meaning, different-name same-meaning, broadened semantics, swallowed
distinctions and invalid state collapse.

### Phase 20 — Audit lifecycle

Verify one owner for cycle semantics, verdict vocabulary, downstream
invalidation and audit independence. Component SPECs reference rather than
redefine shared audit terms. Ticket completion never implies conformance.

### Phase 21 — Persistence and effects

Cross-check intent-before-effect, journal, outbox, idempotency key, evidence,
confirmation, recovery, reconciliation, partial failure and replay. Conflicting
local retry/replay variants are portfolio defects.

### Phase 22 — Repository/Git/publication

Trace:

~~~text
repository enablement
    ↓
execution eligibility
    ↓
worktree / branch
    ↓
wave
    ↓
integration
    ↓
publication candidate
    ↓
human approval
    ↓
push or PR
    ↓
remote confirmation
~~~

Verify one owner per transition. REPO does not own publication, GIT does not
redefine onboarding, BACKEND does not own approval, UI does not own completion,
and PLAT provides effect durability without taking Git semantics.

### Phase 23 — Scheduler/execution

Trace capability, activity, assignment, eligibility, capacity, lease, session,
result and audit cycle. Capability semantics must not be duplicated in
scheduler specs; adapters do not define fairness; UI does not own leases; OPS
does not become assignment authority.

### Phase 24 — Backend leakage

Classify backend requirements as application orchestration, domain authority,
transport authority, security authority or projection. Accepted
application/security ownership is valid; absorption of DOM, EXEC, PLAT, REPO or
GIT authority is not.

### Phase 25 — Frontend leakage

Check local state authority, optimistic completion, approvals, identity,
leases, publication, onboarding, retries and failure reinterpretation. Frontend
may request, display, filter, navigate, render, project, reconnect and replay.
It may not approve, confirm external effects, allocate leases, complete
publication, mutate canonical lifecycle or invent canonical identity.

### Phase 26 — Operations leakage

Verify logs, reports, metrics, exports and backups remain observations or
projections, not canonical state, transitions or lifecycle ownership.

### Phase 27 — Prototype leakage

Classify prototype references:

~~~text
VALID_UX_EVIDENCE
VALID_SCENARIO_EVIDENCE
VALID_NON_NORMATIVE_REFERENCE
INVALID_ARCHITECTURAL_SOURCE
INVALID_IMPLEMENTATION_PROOF
~~~

### Phase 28 — Architecture invention

Classify every untraced requirement:

~~~text
ADR_DERIVED
OWNER_LOCAL_REFINEMENT
NECESSARY_SPECIFICATION_DETAIL
IMPLEMENTATION_DETAIL
UNSUPPORTED_ARCHITECTURE
~~~

Unsupported architecture requires a finding. If it requires a human choice,
block with ARCHITECTURE_DECISION_REQUIRED. Do not invent the decision.

### Phase 29 — Refinement compatibility

For every refinement verify preserved ADR semantics, approved owner boundary,
no new downstream authority, no altered owner contract, no new externally
observable lifecycle and no unjustified overconstraint. Classify:

~~~text
SAFE_REFINEMENT
OVERCONSTRAINT
CROSS_OWNER_REFINEMENT
ARCHITECTURE_EXTENSION
~~~

Only SAFE_REFINEMENT is automatically conformant.

### Phase 30 — Compatibility and cutover

Trace canonical/legacy paths, replay, migration, cutover, retirement,
historical identity and evidence. Detect separately defined cutovers, second
canonical lifecycles, forbidden historical rewrites and indefinite compatibility
without required retirement semantics.

### Phase 31 — Version and basis

Verify common treatment of ADR/SPEC revisions, execution basis, configuration,
skill, schema, repository and Git basis. Detect frozen-vs-latest mismatch and
incompatible schema range/upgrade behavior.

### Phase 32 — Conformance suite composition

Inspect all component suites collectively for positive/negative behavior,
boundary isolation, cross-SPEC integration, failure semantics, compatibility,
extensibility and authority preservation. Identify untested seams; require
specification-level seam scenarios even though implementation tests are not yet
required.

### Phase 33 — Acceptance conflicts

Compare acceptance criteria and classify pairs as compatible, overlapping,
duplicated, contradictory or order-dependent. Any contradiction is a finding.

### Phase 34 — Dependency closure

For each component produce:

~~~text
SPEC
DIRECT_DEPS
TRANSITIVE_DEPS
HIDDEN_DEPS
INVALID_DEPS
~~~

Verify sufficient closure, no downstream component in upstream closure, resolved
references and no undefined contracts.

### Phase 35 — Terminology

Build a glossary for execution, activity, assignment, cycle, status, state,
enabled, accepted, completed, confirmed, published, integrated and recovered.
Same words may differ only with explicit scope; different words must not create
divergent behavior.

### Phase 36 — Terminal states

Collect terminal and completion concepts. Do not collapse DONE, COMPLETED,
FINALIZED, INTEGRATED, PUBLISHED, MERGED, CONFIRMED or CANCELLED unless ADR
authority explicitly equates them.

### Phase 37 — Extensibility

Run a synthetic scenario in which a new SPEC uses only registered capabilities
and existing contracts. Detect hard-coded SPEC types, reviewer/UI/lifecycle
enums, fallback ownership and assumptions requiring architecture changes.

### Phase 38 — Recovery scenarios

Run at least:

1. crash before external effect;
2. crash after external effect before confirmation;
3. duplicate command;
4. stale basis;
5. agent unavailable;
6. audit remediation;
7. external PR merge;
8. repository onboarding failure.

For each, identify owners of intent, persistence, effect, confirmation,
recovery and projection. Any ambiguity is a cross-SPEC defect.

### Phase 39 — Projection/replay/recovery

Trace canonical state through journal/events, API, UI/OPS projection,
disconnect, snapshot/replay and recovered projection. Projections must recover
without becoming authority; replay must have a coherent owner.

### Phase 40 — Individual audit closure

For every component audit inspect verdict, open/blocked findings, waivers,
baseline and revision. Classify:

~~~text
AUDIT_CURRENT
AUDIT_STALE
AUDIT_MISSING
AUDIT_NONCONFORMANT
~~~

The verdict must apply to the exact revision audited here.

### Phase 41 — Audit blind spots

Compare all audit scopes. Identify seams where every local auditor assumed
another SPEC validated the relationship. Record CROSS_SPEC_AUDIT_BLIND_SPOT.

### Phase 42 — Re-run decomposition invariants

Re-run ownership completeness, one owner, no collisions/orphans, acyclic graph,
no reverse dependency, no projection authority and no architecture invention
against materialized SPECs. The historical decomposition result is not proof
after materialization.

### Phase 43 — Approved/materialized delta

Produce a delta matrix for membership, ADR ownership, normative ownership,
transversal contracts, dependency graph, failure semantics, state machines,
compatibility, projection boundaries, audit lifecycle, extensibility and
architecture gaps. Classify each MATCH, SAFE_REFINEMENT, DRIFT, CONTRADICTION or
BLOCKED. Approval permits only MATCH and SAFE_REFINEMENT.

### Phase 44 — Root cause

For every finding classify:

~~~text
ADR
PORTFOLIO_DECOMPOSITION
COMPONENT_SPEC
COMPONENT_AUDIT
CROSS_SPEC_INTEGRATION
EVIDENCE
~~~

Distinguish defective mapping, generation defect, missed local audit,
incompatible seam and authority/evidence problems.

### Phase 45 — Remediation routing

For each finding specify:

~~~text
NEW_ADR_OR_ADDENDUM_REQUIRED
RECOMPOSE_PORTFOLIO_REQUIRED
REMEDIATE_COMPONENT_SPEC
REPEAT_COMPONENT_SPEC_AUDIT
REMEDIATE_MULTIPLE_COMPONENT_SPECS
REPEAT_PORTFOLIO_CONFORMANCE_AUDIT
~~~

Do not perform remediation or prescribe code.

## Mandatory checks

Report every check with PASS, FAIL, BLOCKED or NOT_APPLICABLE. Explain every
NOT_APPLICABLE.

~~~text
CHECK-01  Approved decomposition exists and is current.
CHECK-02  All expected component SPECs exist.
CHECK-03  All component audits are current and conformant.
CHECK-04  Effective ADR authority has not materially changed.
CHECK-05  All ADR obligations are materialized.
CHECK-06  Approved owners remain materialized owners.
CHECK-07  No normative ownership collision exists.
CHECK-08  No normative orphan exists.
CHECK-09  No ownership drift exists.
CHECK-10  No consumer was promoted to canonical owner.
CHECK-11  Transversal contracts have exactly one canonical definition.
CHECK-12  Materialized dependency graph is acyclic.
CHECK-13  Declared and inferred dependency graphs agree.
CHECK-14  No hidden reverse dependency exists.
CHECK-15  Component boundaries remain cohesive.
CHECK-16  No canonical state machine is duplicated.
CHECK-17  Identity semantics are cross-SPEC consistent.
CHECK-18  Commands/queries/events preserve authority boundaries.
CHECK-19  Failure semantics are cross-SPEC consistent.
CHECK-20  Audit/remediation lifecycle is defined once.
CHECK-21  Persistence/effect semantics are defined once.
CHECK-22  Repository/Git/publication ownership is coherent.
CHECK-23  Scheduler/execution ownership is coherent.
CHECK-24  Backend has not absorbed upstream domain authority.
CHECK-25  Frontend remains non-authoritative.
CHECK-26  Observability remains non-authoritative.
CHECK-27  Prototype remains non-authoritative.
CHECK-28  No unsupported architecture was introduced.
CHECK-29  All refinements remain within approved ownership.
CHECK-30  Compatibility/cutover semantics are coherent.
CHECK-31  Version/basis semantics are consistent.
CHECK-32  Acceptance criteria do not contradict across SPECs.
CHECK-33  Dependency closure contains no hidden owner.
CHECK-34  Terminology does not create semantic divergence.
CHECK-35  Terminal/completion semantics are consistent.
CHECK-36  Synthetic extensibility remains possible.
CHECK-37  Recovery scenarios have unambiguous ownership.
CHECK-38  Projection/replay/recovery seams preserve authority.
CHECK-39  No cross-SPEC audit blind spot remains.
CHECK-40  Approved and materialized portfolio models match.
~~~

## Quantitative evidence

Report at minimum:

~~~text
Effective ADRs
ADR obligations
Approved component SPECs
Materialized component SPECs
Current conformant component audits
Stale component audits
Normative requirements
Approved ownership mappings
Ownership matches
Ownership drifts
Ownership collisions
Normative orphans
Transversal contracts
Duplicate canonical contracts
Declared dependencies
Inferred dependencies
Hidden dependencies
Dependency cycles
Cross-SPEC contradictions
Unsupported architecture additions
Architecture gaps
Critical findings
Major findings
Minor findings
~~~

Do not invent counts. If a count is unsupported, report it as unknown and treat
the ambiguity as a possible finding.

## Finding format

Use this format for every finding:

~~~markdown
## <ID> — <title>

Severity:
Classification:
Root cause stage:
Remediation target:

### Approved authority

What ADR/decomposition approved.

### Materialized evidence

What component SPECs actually define.

### Conflict

Exact mismatch.

### Why this matters

Global portfolio consequence.

### Downstream risk

Identify affected Gap Matrix, Implementation Plan, tickets, implementation,
conformance, publication and operations.

### Required remediation condition

What must become true. Do not implement the fix.

### Required reaudit

Which local and portfolio audits must rerun.

### Revalidation

Mechanical test for closure.
~~~

Use IDs SPC-CRITICAL-###, SPC-MAJOR-### and SPC-MINOR-###. Use these
classifications where applicable:

~~~text
OWNERSHIP_DRIFT
OWNERSHIP_COLLISION
NORMATIVE_ORPHAN
CONSUMER_REDEFINITION
CROSS_SPEC_CONTRADICTION
HIDDEN_REVERSE_DEPENDENCY
DEPENDENCY_CYCLE
BOUNDARY_DRIFT
TRANSVERSAL_DUPLICATION
ARCHITECTURE_INVENTION
ARCHITECTURE_GAP
PROJECTION_AUTHORITY_LEAK
COMPATIBILITY_DIVERGENCE
VERSION_BASIS_DIVERGENCE
AUDIT_BLIND_SPOT
STALE_COMPONENT_AUDIT
PORTFOLIO_BASELINE_STALE
~~~

## Required report

Generate:

~~~text
docs/specs/<PORTFOLIO-ID>-conformance-audit.md
~~~

or the repository-equivalent location, with exactly these sections:

~~~text
# <PORTFOLIO-ID> — SPEC Portfolio Conformance Audit

## 1. Audit mode
## 2. Scope
## 3. Portfolio baseline
## 4. Effective ADR authority
## 5. Approved decomposition
## 6. Component membership
## 7. Component audit eligibility
## 8. ADR obligation inventory
## 9. Materialized requirement inventory
## 10. Approved vs materialized ownership
## 11. Ownership drift
## 12. Ownership collisions
## 13. Normative orphans
## 14. Transversal contract analysis
## 15. Consumer contract validation
## 16. Boundary cohesion
## 17. Declared dependency graph
## 18. Inferred dependency graph
## 19. Dependency closure and cycle validation
## 20. Hidden reverse dependencies
## 21. State machine consistency
## 22. Identity consistency
## 23. Command/query/event boundaries
## 24. Failure semantic consistency
## 25. Audit lifecycle consistency
## 26. Persistence/effect consistency
## 27. Repository/Git/publication seam
## 28. Scheduler/execution seam
## 29. Backend authority analysis
## 30. Frontend authority analysis
## 31. Operations authority analysis
## 32. Prototype authority analysis
## 33. Architecture invention analysis
## 34. Refinement analysis
## 35. Compatibility and cutover
## 36. Version and basis consistency
## 37. Cross-SPEC acceptance analysis
## 38. Terminology analysis
## 39. Terminal-state consistency
## 40. Extensibility analysis
## 41. Recovery scenario analysis
## 42. Projection/replay/recovery analysis
## 43. Cross-SPEC audit blind spots
## 44. Approved vs materialized delta matrix
## 45. Root-cause analysis
## 46. Findings
## 47. Mandatory checks
## 48. Quantitative evidence
## 49. Final verdict
~~~

## Gates

Emit READY_FOR_GAP_MATRIX only when the verdict is
SPEC_PORTFOLIO_CONFORMANT and all of these are zero:

~~~text
missing_components
stale_component_audits
ownership_drifts
ownership_collisions
normative_orphans
duplicate_canonical_contracts
hidden_dependencies
dependency_cycles
cross_spec_contradictions
unsupported_architecture_additions
architecture_gaps
critical_findings
major_findings
~~~

Prefer zero MINOR findings. A remaining MINOR is allowed only when it cannot
affect normative meaning, ownership, dependency direction, traceability, Gap
Matrix generation or implementation scope.

For valid authority with incorrect materialization, emit:

~~~text
VERDICT: SPEC_PORTFOLIO_REMEDIATION_REQUIRED
GATE: CROSS_SPEC_REMEDIATION_REQUIRED
~~~

Identify exact SPECs, rerun affected individual audits, then rerun this full
portfolio audit. Do not incrementally approve repaired findings.

For a defective decomposition, emit PORTFOLIO_RECOMPOSITION_REQUIRED and route
through decomposition remediation, decomposition audit, SPEC remediation or
regeneration, individual audits and this full audit.

For insufficient ADR authority, emit ARCHITECTURE_DECISION_REQUIRED and stop at
architecture governance.

For a material ADR change after decomposition approval, emit
SPEC_PORTFOLIO_AUDIT_BLOCKED with gate PORTFOLIO_RECOMPOSITION_REQUIRED unless
no decomposition impact is mechanically proven.

## Mechanical conformance matrix

Produce one row per architectural obligation:

~~~markdown
| ADR obligation | Approved owner | Materialized owner | Consumers | Result |
~~~

Allowed results are MATCH, SAFE_REFINEMENT, DRIFT, DUPLICATED, ORPHAN,
CONTRADICTION and BLOCKED. Approval requires every row to be MATCH or
SAFE_REFINEMENT.

Also produce:

~~~markdown
| Producer SPEC | Contract | Consumer SPEC | Owner preserved | Semantics preserved | Result |
~~~

Cover these seams when present in the approved decomposition:

~~~text
DOM → EXEC
DOM → PLAT
DOM → GIT
EXEC-001 → EXEC-002
EXEC-001 → REPO
PLAT → REPO
PLAT → GIT
REPO → GIT
DOM/EXEC/PLAT/REPO/GIT → BACKEND
BACKEND → OPS
BACKEND/OPS/DOM → UI
~~~

Adapt to actual approved dependencies; never invent missing dependencies.

## Adversarial questions

Answer explicitly before approval:

1. Which normative concepts appear in more than one SPEC?
2. Which are valid references versus duplicated authority?
3. Which ADR obligations appear in no component?
4. Did any component acquire authority not assigned by the portfolio?
5. Did any owner delegate canonical behavior downstream?
6. Does the inferred graph differ from the declared graph?
7. Can any component only be understood using a downstream component?
8. Do two specs use the same state/failure term differently?
9. Can backend, frontend or OPS independently infer canonical completion?
10. Can an external effect be confirmed differently depending on the SPEC?
11. Does compatibility create a second canonical lifecycle?
12. Did authors introduce product decisions to make a SPEC easier to write?
13. Are individual verdicts tied to exact revisions used here?
14. Could a synthetic SPEC be added without changing architecture?
15. Is there a seam every individual auditor assumed someone else validated?

If any answer is ambiguous, do not approve.

## Approval completion invariant

Do not emit SPEC_PORTFOLIO_CONFORMANT unless evidence supports that every
effective architectural obligation has exactly one canonical component SPEC
owner matching the approved decomposition; consumers preserve rather than
redefine the owner contract; each transversal contract has one definition; the
materialized graph is acyclic and has no hidden reverse authority dependency; no
unsupported architecture was introduced; no projection, adapter or operations
surface became authority; all audits apply to exact revisions; and the complete
portfolio is safe normative input for the Gap Matrix.

## Prohibited shortcuts

Do not approve merely because all SPECs exist, all local audits passed, every
ADR appears somewhere, a diagram appears acyclic, terminology matches,
prototype/tests look correct, each SPEC is internally coherent, implementation
could resolve ambiguity, or the portfolio is close enough. Prove cross-SPEC
conformance explicitly.

## Final console response

Use:

~~~text
SPEC_PORTFOLIO_CONFORMANCE_AUDIT_COMPLETE

PORTFOLIO: <id>
AUDIT_MODE: READ_ONLY / INDEPENDENT / ADVERSARIAL / ADR_FIRST / CROSS_SPEC

VERDICT: <verdict>

EFFECTIVE_ADRS: <n>
ADR_OBLIGATIONS: <n>

APPROVED_COMPONENT_SPECS: <n>
MATERIALIZED_COMPONENT_SPECS: <n>
CURRENT_CONFORMANT_COMPONENT_AUDITS: <n>
STALE_OR_NONCONFORMANT_COMPONENT_AUDITS: <n>

OWNERSHIP_MATCHES: <n>
OWNERSHIP_DRIFTS: <n>
OWNERSHIP_COLLISIONS: <n>
NORMATIVE_ORPHANS: <n>

TRANSVERSAL_DUPLICATIONS: <n>
HIDDEN_DEPENDENCIES: <n>
DEPENDENCY_CYCLES: <n>
CROSS_SPEC_CONTRADICTIONS: <n>
UNSUPPORTED_ARCHITECTURE_ADDITIONS: <n>
ARCHITECTURE_GAPS: <n>

FINDINGS:
- CRITICAL: <n>
- MAJOR: <n>
- MINOR: <n>

ROOT_CAUSE_STAGE:
<ADR |
PORTFOLIO_DECOMPOSITION |
COMPONENT_SPEC |
COMPONENT_AUDIT |
CROSS_SPEC_INTEGRATION |
NONE>

GATE:
<READY_FOR_GAP_MATRIX |
CROSS_SPEC_REMEDIATION_REQUIRED |
PORTFOLIO_RECOMPOSITION_REQUIRED |
ARCHITECTURE_DECISION_REQUIRED |
AUDIT_BLOCKED>

REPORT:
<path>
~~~

After SPEC_PORTFOLIO_CONFORMANT, the only allowed next stage is Gap Matrix
generation from accepted ADR authority, approved decomposition, conformant
component portfolio and current repository evidence. Unresolved normative
conflicts must return to this audit stage rather than become implementation
gaps.
