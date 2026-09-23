---
name: audit-spec-portfolio-decomposition
description: >
  Independently and adversarially audit a SPEC portfolio decomposition that
  translates accepted ADR authority into component specifications. Verify
  ownership completeness, absence of normative overlap, dependency acyclicity,
  authority preservation, traceability, boundary correctness, downstream
  independence, prototype separation, and readiness for component SPEC
  generation. Use after composing a SPEC portfolio and before generating
  component SPECs, a Gap Matrix, an Implementation Plan, tickets, or code.
  This skill is strictly read-only and does not remediate the portfolio,
  modify ADRs, or generate component specifications.
---

# Audit Spec Portfolio Decomposition

## Purpose and operating mode

Determine whether a proposed SPEC portfolio is safe to use as the normative
decomposition of accepted ADR authority:

```text
ACCEPTED ADR PORTFOLIO
        |
SPEC PORTFOLIO COMPOSITION
        |
INDEPENDENT DECOMPOSITION AUDIT
        |
PORTFOLIO_DECOMPOSITION_APPROVED
        |
COMPONENT SPEC GENERATION
```

Run in:

```text
READ_ONLY / INDEPENDENT / ADVERSARIAL / ADR_FIRST / PORTFOLIO_FIRST
NO_REMEDIATION / NO_ARCHITECTURE_INVENTION / NO_IMPLEMENTATION_ASSUMPTIONS
```

The portfolio is a normative decomposition contract, not merely an index. It
determines ownership, consumers, permitted dependencies, transversal
contracts, downstream requirement locations, and later gap classifications.
Audit the decomposition before allowing it to propagate into component SPECs.

Do not modify files, ADRs, specifications, portfolio composition, prototype,
production code, tests, or governance state. Do not create component SPECs,
Gap Matrices, Implementation Plans, tickets, or remediation. Report ambiguity
and root cause instead of silently resolving it.

## Inputs and authority

Required inputs:

1. the SPEC portfolio composition under audit;
2. every ADR declared authoritative by that portfolio;
3. the current accepted revision of each ADR;
4. the latest authoritative ADR portfolio audit/remediation evidence, when it
   exists.

Optional evidence includes ADR/architecture indexes, prototype reports,
repository documentation, prior drafts, and repository structure. Supporting
evidence never overrides accepted authority.

Use this precedence:

```text
accepted ADR
  > accepted ADR addendum or superseding ADR
  > explicit normative architecture index governed by those ADRs
  > portfolio under audit
  > prototype
  > implementation
  > tests
  > historical reports
  > comments and inferred intent
```

If accepted ADRs conflict, stop the affected analysis and report an architecture
finding. Do not choose a preferred interpretation. A referenced ADR that is
not accepted is not authority.

## Verdicts and severity

Use exactly one final verdict:

```text
PORTFOLIO_DECOMPOSITION_APPROVED
PORTFOLIO_DECOMPOSITION_REMEDIATION_REQUIRED
PORTFOLIO_DECOMPOSITION_AUDIT_BLOCKED
```

`PORTFOLIO_DECOMPOSITION_APPROVED` requires complete obligation accounting,
exactly one owner per normative behavior, no orphan or collision, an acyclic
and directionally valid dependency graph, no downstream authority dependency,
no invented architecture, and a decomposition precise enough to generate
independently auditable component SPECs.

Use `PORTFOLIO_DECOMPOSITION_REMEDIATION_REQUIRED` for correctable composition,
traceability, ownership, dependency, readiness, or auditability defects. Use
`PORTFOLIO_DECOMPOSITION_AUDIT_BLOCKED` only when accepted authority is
missing, conflicting, unaccepted, or insufficient to make a safe architectural
choice.

Finding severities:

* `CRITICAL`: systematic downstream authority corruption, missing or duplicated
  canonical authority, ADR contradiction, dependency cycle, or promotion of
  implementation/prototype above ADR authority.
* `MAJOR`: material overlap, orphan, wrong dependency direction, missing
  consumer contract, non-independent component, or circular readiness gate.
* `MINOR`: localized terminology, traceability, diagram, or consistency defect
  that cannot change authority, ownership, dependency direction, or generated
  SPEC content.

Do not downgrade ownership ambiguity to MINOR.

## Audit procedure

Perform every phase below. Record exact file paths and sections as evidence.
Treat claims in the portfolio as claims to verify, not evidence merely because
they are detailed.

### 1. Establish the immutable baseline

Read `skills/_shared/baseline-drift-remediation-contract.md`. If repository,
ADR, or portfolio state drifts, persist the complete old/current
`BASELINE_REASSESSMENT_PROOF` and shared readiness fields. Assessed actionable
drift must be consumable by `remediate-spec-portfolio-decomposition`; emit an
incomplete state only when the comparison or required evidence cannot be
completed.

Record portfolio path, ID, revision, status, declared ADRs, repository HEAD
when available, ADR revisions/hashes, audit timestamp, and all files consulted.
Confirm READ_ONLY operation and confirm no file was modified. If repository
state changes and affects evidence, report the drift and persist the shared
`BASELINE_REASSESSMENT_PROOF`, `BASELINE_DRIFT_STATUS`,
`REASSESSMENT_COMPLETE`, `FINDINGS_ARE_ACTIONABLE`,
`BASELINE_REMEDIATION_READINESS`, and exact `AUDIT_BASIS_FINGERPRINT` fields.

### 2. Validate ADR eligibility

For every declared ADR verify existence, identifier, effective revision,
normative decision state, supersession/addenda handling, and inclusion of all
relevant successors. Reject reliance on `PROPOSED`, `DRAFT`, `REJECTED`,
unhandled `SUPERSEDED`, or `UNVERIFIED` authority unless governance explicitly
defines an equivalent accepted state. Produce one `ADR_AUTHORITY_CHECK` row per
ADR.

### 3. Extract all architectural obligations

Read ADR content, not only titles. Build an obligation inventory with:

```text
Obligation ID | Source ADR | Source section | Normative subject
Required behavior | Authority type | Expected owner domain
Explicit consumers | Cross-cutting yes/no
```

Include identity, lifecycle, scheduler eligibility, artifacts, idempotency,
persistence, external effects, approval, Git, publication, security, retention,
recovery, audit independence, and every other normative obligation actually
present. One ADR may yield many obligations.

### 4. Build the mechanical ownership matrix

Map every obligation to proposed owner and consumers. Classify each as exactly
one of `OWNED_ONCE`, `MULTIPLE_OWNERS`, `NO_OWNER`, `OWNER_UNCLEAR`, or
`INVALID_OWNER`. Enforce:

```text
OWNER_COUNT(normative_obligation) = 1
```

Consumers, "all specs," "transversal," backend-by-default, prototypes, and
future implementation owners do not count as normative ownership.

### 5. Detect ownership collisions

Compare boundaries pairwise for duplicated identity, state transitions, audit
and ticket lifecycle, scheduler semantics, eligibility, capability contracts,
idempotency, journal/effect confirmation, repository enablement, Git,
publication, approval, authorization, observability authority, and frontend
state. Classify each relationship as `TRUE_DUPLICATION`, `REFERENCE_ONLY`,
`SHARED_VOCABULARY`, `DERIVED_PROJECTION`, or `AMBIGUOUS`. Only the latter
three non-authoritative forms can be conformant; ambiguous possible redefinition
is a finding.

### 6. Detect normative orphans

Find obligations with no owner, only consumers, only prototype evidence, only
backend default ownership, only a transversal label, or only a future
implementation owner. Every obligation must land in one coherent SPEC.

### 7. Audit boundary cohesion

Classify every component `COHESIVE`, `BROAD_BUT_ACCEPTABLE`, `OVERLOADED`,
`FRAGMENTED`, or `MIXED_AUTHORITY`. Look for mega-SPECs combining unrelated
state machines, domain governance, transport, infrastructure, canonical state,
projection, execution, persistence, or unrelated ADR families. Also flag
over-fragmentation when acceptance needs constant co-editing, shared invariants
are split, or a component is only a naming wrapper.

### 8. Audit transversal authority placement

For identity, immutability, basis/snapshot, audit lifecycle, conformance,
versioned contracts, idempotency, recovery, evidence, and publication vocabulary
verify one owner, consumer references, no consumer redefinition, coherent owner,
and independent downstream auditability.

### 9. Audit ADR-to-SPEC allocation

For each ADR report `PRIMARY_OWNER`, `SECONDARY_CONSUMERS`,
`UNACCOUNTED_OBLIGATIONS`, `MISPLACED_OBLIGATIONS`, and coverage
`FULL`, `PARTIAL`, `NONE`, or `AMBIGUOUS`. Approval requires FULL coverage for
every ADR and every obligation within it.

### 10. Validate the dependency graph

Construct the directed graph from normative dependency declarations, not prose
intuition. Distinguish `NORMATIVE_DEPENDENCY`, `IMPLEMENTATION_DEPENDENCY`,
`EVIDENCE_DEPENDENCY`, and `PROJECTION_DEPENDENCY`; only normative edges belong
in the architecture graph unless explicitly governed otherwise. Check no
self-dependency, direct cycle, transitive cycle, hidden reverse dependency, or
contradictory table/diagram/prose interpretation.

### 11. Detect hidden downstream authority

For every component ask whether it can be specified and audited without a
downstream component defining its contract. Flag patterns such as domain
identity requiring backend DTOs, platform journal semantics requiring UI
events, Git publication requiring backend state definition, or execution
identity requiring an operations schema. Downstream consumers may consume
upstream contracts but cannot define them.

### 12. Audit projection boundaries

Backend, API, frontend, observability, reports, fixtures, and prototypes may
project or map. They may not become canonical owners of identity, lifecycle,
eligibility, approval, publication, completion, effect confirmation, scheduler
lease state, or architecture. Search for authority language such as "UI
decides," "API owns state," "report defines," "prototype proves," or "frontend
confirms."

### 13. Separate prototype evidence

Classify prototype use as `UX_REFERENCE`, `SCENARIO_REFERENCE`,
`INTERACTION_REFERENCE`, `NON_NORMATIVE_BEHAVIORAL_PROBE`, or
`HISTORICAL_EVIDENCE`. Prototype is not authority for persistence, concurrency,
security, Git/GitHub, production runtime, or architecture. Existing mock
behavior cannot fill an ADR gap.

### 14. Audit implementation leakage and architecture invention

Classify implementation details as `ARCHITECTURALLY_REQUIRED`,
`VALID_UNFROZEN_DETAIL`, or `INVALID_PREMATURE_FREEZE`. Check databases, table
names, classes, routes, frameworks, providers, polling intervals, token
libraries, and modules. For every significant portfolio requirement classify it
as `DIRECTLY_DERIVED`, `NECESSARY_DECOMPOSITION_CONSTRAINT`,
`IMPLEMENTATION_DETAIL`, or `UNSUPPORTED_ARCHITECTURE`. New lifecycle,
approval, persistence, security, scheduler, or publication semantics require
ADR support; do not resolve an architecture gap.

### 15. Audit failure semantics and transitions

For every failure code/class record semantic owner, source authority, consumers,
frozen/provisional naming, and whether duplicate semantics are possible.
Distinguish `CANONICAL_FAILURE_SEMANTIC`, `TRANSPORT_MAPPING`,
`UI_PRESENTATION`, and `LOG_CLASSIFICATION`. For stored data, lifecycle,
effects, repository, Git, integration, or legacy artifacts verify ownership of
`NEW_CANONICAL_PATH`, `LEGACY_COMPATIBILITY`, `HISTORICAL_REPLAY`, `CUTOVER`,
and `RETIREMENT`.

### 16. Audit the component-SPEC contract and independence

Verify the required template supports explicit authority and ownership, stable
requirement IDs, testable acceptance criteria and failures, compatibility,
dependencies, traceability, conformance tests, and readiness without requiring
an Implementation Plan. Classify each component `INDEPENDENT`,
`CONDITIONALLY_INDEPENDENT`, `DOWNSTREAM_COUPLED`, or `CIRCULARLY_COUPLED`.

### 17. Audit readiness, DoD, self-certification, and traceability

Separate the decomposition approval gate from future materialized portfolio
conformance. Reject temporal circularity where approval requires generated
SPECs while generation requires approval. Detect self-certification claims such
as "complete," "conformant," or "no architecture gap" being used as proof.

Validate the chain:

```text
ADR -> architectural obligation -> SPEC owner -> SPEC consumers
```

Report mechanical totals and do not accept ADR-to-SPEC-only traceability.

### 18. Validate claimed gap classifications

Check `SPECIFICATION_GAP`, `IMPLEMENTATION_GAP`, `ARCHITECTURE_GAP`,
`NON_GAP`, `PROTOTYPE_ONLY`, and `UNFROZEN_IMPLEMENTATION_DETAIL`. A missing
product decision is not an implementation gap; missing implementation is not an
architecture gap; prototype behavior is not production conformance. If accepted
authority is insufficient to classify safely, block the audit.

### 19. Audit extensibility, security, evidence, and taxonomy

Where required by ADR authority, verify that capability-driven extensibility
does not force central modification for every new SPEC type and that boundaries
permit registered capabilities rather than hard-coded central branches. Place
domain authority, application security, secret storage, transport auth, and UI
session presentation coherently. Assign logs, audit reports, runtime evidence,
correlation, history, exports, backup, and recovery evidence without making
operational records architectural authority. Check prefixes and taxonomy for
misleading or duplicate domains without imposing style-only renames.

### 20. Run adversarial scenarios

Apply all scenarios and record affected owners and findings:

* new capability registration, schema, eligibility, execution, and UI rendering;
* exhausted scheduler capacity with competing executions;
* crash after external effect before local confirmation;
* externally merged GitHub PR;
* legacy repository onboarding and promotion;
* SPEC audit failure and remediation loop;
* frontend disconnected while execution continues;
* new SPEC category using existing capabilities.

Any ambiguous ownership, reverse authority, or duplicated semantics is a finding.

### 21. Cross-check every portfolio representation

Compare ownership table, ADR matrix, dependency table and diagram, component
descriptions, failure semantics, gap matrix, risks, acceptance criteria, DoD,
and recommendation/order. They must express one model. A diagram mismatch that
could alter dependency interpretation is substantive, not editorial.

### 22. Classify unresolved problems and determine the verdict

Classify each as `PORTFOLIO_COMPOSITION_DEFECT`, `ARCHITECTURE_GAP`,
`EVIDENCE_GAP`, or `AUDITABILITY_GAP`. Composition and auditability defects
normally require remediation. An architecture gap, unresolved ADR conflict,
unavailable accepted revision, or missing evidence that prevents safe analysis
blocks the audit. Never repair the architecture within this skill.

## Mandatory checks

Report every check with exactly `PASS`, `FAIL`, `BLOCKED`, or `NOT_APPLICABLE`
(the last requires justification):

```text
CHECK-01  All authoritative ADRs are eligible.
CHECK-02  All ADR obligations were extracted.
CHECK-03  Every normative obligation has exactly one owner.
CHECK-04  No normative ownership collision exists.
CHECK-05  No normative orphan exists.
CHECK-06  Dependency graph is acyclic.
CHECK-07  No hidden reverse dependency exists.
CHECK-08  No component depends on downstream authority.
CHECK-09  Transversal contracts have one owner.
CHECK-10  Prototype is non-authoritative.
CHECK-11  Implementation details were not prematurely frozen.
CHECK-12  No unsupported architecture was invented.
CHECK-13  Projection boundaries remain non-authoritative.
CHECK-14  Failure semantics have clear ownership.
CHECK-15  Compatibility/cutover ownership is explicit where required.
CHECK-16  Component SPEC contract is independently auditable.
CHECK-17  Portfolio DoD has no temporal circularity.
CHECK-18  Portfolio does not self-certify conformance.
CHECK-19  ADR -> obligation -> owner traceability is complete.
CHECK-20  Gap classifications are semantically correct.
CHECK-21  Portfolio representations are mutually consistent.
CHECK-22  No architecture gap remains hidden as implementation detail.
```

## Findings

Use IDs `SPD-CRITICAL-###`, `SPD-MAJOR-###`, and `SPD-MINOR-###`. Every
finding must use this structure:

```markdown
## <ID> - <title>

Severity: <CRITICAL|MAJOR|MINOR>
Classification: <PORTFOLIO_COMPOSITION_DEFECT|ARCHITECTURE_GAP|EVIDENCE_GAP|AUDITABILITY_GAP>

### Evidence
Exact files and sections.

### Expected
What accepted authority requires.

### Observed
What the portfolio declares.

### Why this matters
Propagation or authority risk.

### Root cause
Portfolio composition, accepted architecture, missing evidence, or auditability.

### Required remediation
What must become true; do not prescribe implementation unnecessarily.

### Revalidation
The exact mechanical check that closes the finding.
```

## Required audit artifact

Create the report only after the read-only audit is complete:

```text
docs/specs/<PORTFOLIO-ID>-decomposition-audit.md
```

Follow repository conventions if they require another audit directory. The
report must contain these sections, in order:

```text
# <PORTFOLIO-ID> - Decomposition Audit
## 1. Audit mode
## 2. Scope
## 3. Baseline
## 4. Authority reviewed
## 5. ADR eligibility
## 6. Architectural obligation inventory
## 7. Ownership matrix
## 8. Ownership collision analysis
## 9. Orphan analysis
## 10. Boundary cohesion analysis
## 11. Transversal contract analysis
## 12. ADR coverage
## 13. Dependency graph validation
## 14. Reverse-dependency analysis
## 15. Projection boundary validation
## 16. Prototype authority validation
## 17. Architecture-invention analysis
## 18. Failure ownership analysis
## 19. Compatibility/cutover ownership
## 20. Component independence
## 21. Portfolio readiness / DoD analysis
## 22. Traceability validation
## 23. Gap classification validation
## 24. Extensibility scenarios
## 25. Adversarial scenarios
## 26. Cross-representation consistency
## 27. Findings
## 28. Mandatory checks
## 29. Quantitative evidence
## 30. Final verdict
```

Include quantitative evidence without invented precision:

```text
Authoritative ADRs:
Architectural obligations extracted:
Component SPECs:
Normative owners:
Normative dependencies:
Dependency cycles:
Ownership collisions:
Normative orphans:
Unclear owners:
Architecture gaps:
Portfolio composition defects:
Critical findings:
Major findings:
Minor findings:
```

If the obligation count cannot be established because source authority is
ambiguous, report that as audit evidence and block or remediate as appropriate;
do not guess.

## Gate rules and completion invariant

Emit `READY_FOR_COMPONENT_SPEC_GENERATION` only with
`PORTFOLIO_DECOMPOSITION_APPROVED` and zero ownership collisions, normative
orphans, unclear owners, dependency cycles, architecture gaps, CRITICAL
findings, and MAJOR findings. Minor findings are acceptable only when they
cannot affect authority, ownership, dependency direction, traceability, or
generated SPEC content; prefer zero findings.

The audit is complete only when evidence supports:

> Every normative obligation in the accepted ADR portfolio has one and only
> one coherent SPEC owner; every consumer relationship is non-authoritative;
> the dependency graph is acyclic and directionally valid; no downstream
> component defines upstream authority; no implementation or prototype behavior
> was promoted to architecture; and the decomposition can generate
> independently auditable component specifications.

Keep this audit distinct from the future `audit-spec-portfolio-conformance`,
which compares the approved decomposition against generated component SPECs and
checks ownership drift, duplicated behavior, missing requirements, new cycles,
invented authority, consumer promotion, and divergence.

## Final console response

After writing the report, return only this concise machine-readable summary:

```text
SPEC_PORTFOLIO_DECOMPOSITION_AUDIT_COMPLETE

PORTFOLIO: <id>
AUDIT_MODE: READ_ONLY / INDEPENDENT / ADVERSARIAL / ADR_FIRST
VERDICT: <verdict>

BASELINE_DRIFT_STATUS: <NO_DRIFT|DRIFT_UNASSESSED|DRIFT_ASSESSED>
REASSESSMENT_COMPLETE: <YES|NO>
FINDINGS_ARE_ACTIONABLE: <YES|NO>
BASELINE_REMEDIATION_READINESS: <READY|BLOCKED_INSUFFICIENT_REASSESSMENT>
AUDIT_BASIS_FINGERPRINT: <exact basis>
BASELINE_REASSESSMENT_PROOF: <path or inline section when drift exists>

AUTHORITATIVE_ADRS: <n>
ARCHITECTURAL_OBLIGATIONS: <n>
COMPONENT_SPECS: <n>
OWNERSHIP_COLLISIONS: <n>
NORMATIVE_ORPHANS: <n>
UNCLEAR_OWNERS: <n>
DEPENDENCY_CYCLES: <n>
ARCHITECTURE_GAPS: <n>

FINDINGS:
- CRITICAL: <n>
- MAJOR: <n>
- MINOR: <n>

GATE:
<READY_FOR_COMPONENT_SPEC_GENERATION |
REMEDIATION_REQUIRED |
ARCHITECTURE_DECISION_REQUIRED |
AUDIT_BLOCKED>

REPORT:
<path>
```

Do not approve because ADRs merely appear in a table, descriptions exist, a
diagram looks plausible, a prototype exercises the flow, tests pass, a prior
audit exists, the author claims completeness, or the decomposition has a
convenient number of components. The decomposition itself must be proven.
