---
name: audit-ticket-conformance
description: >
  Independently audit whether an implemented ticket conforms to its authorized
  functional and planning contract. Verify traceability from accepted ADRs,
  canonical specification, validated Gap Matrix, conformant Implementation
  Plan, ticket requirements, acceptance criteria, acceptance obligations,
  completion evidence, implementation scope, and repository changes. This is a
  read-only specialist audit. It reports domain findings but does not approve
  the ticket, remediate defects, or transition ticket state.
---

# Audit Ticket Conformance

## Purpose

Determine whether the implemented ticket delivered exactly the authorized work
defined by the upstream execution chain.

Primary question:

```text
DID_THE_IMPLEMENTATION_DELIVER_EXACTLY_THE_AUTHORIZED_TICKET_CONTRACT?
```

This skill audits traceability, ticket scope, Gap closure, requirement
conformance, acceptance criteria, acceptance obligations, completion evidence,
implementation scope, execution eligibility, and status accuracy.

It produces specialist evidence for:

```text
audit-implemented-ticket
        ↓
consolidate-implementation-audit
        ↓
GLOBAL TICKET VERDICT
```

It does not own the final ticket verdict.

Read `../_shared/finding-completion-readiness-contract.md` with the shared
authority gates. Provide evidence for dependency class, local acceptance
ownership, and completion-evidence timing; never turn severity into a local
completion gate.

## Authority and operating mode

Use this precedence order:

```text
Accepted ADR authority
        ↓
Canonical validated specification
        ↓
Validated Gap Matrix
        ↓
Conformant Implementation Plan
        ↓
Conformant Plan Audit
        ↓
Conformant Implementation Ticket
        ↓
Conformant Ticket Audit
        ↓
Repository implementation
        ↓
Tests and execution evidence
        ↓
Implementation claims
```

The skill runs as:

```text
READ_ONLY
INDEPENDENT
ADVERSARIAL
TICKET_SCOPED
SPEC_FIRST
GAP_MATRIX_AWARE
PLAN_AWARE
DIFF_AWARE
EVIDENCE_REQUIRED
EXHAUSTIVE_WITHIN_DOMAIN
```

Do not reinterpret upstream authority to make an implementation pass. Inspect
the repository directly; an implementation summary is supporting evidence only.

Do not modify code, tests, the ticket, ticket index, ADRs, specification, Gap
Matrix, Implementation Plan, or upstream audits.

## Preconditions and inputs

The target ticket normally has status `VALIDATION_REQUIRED`, or the repository
equivalent of an implemented state awaiting independent validation. Required
upstream gates must remain conformant.

If authority required to perform the audit is invalid or unavailable, return
`SPECIALIST_AUDIT_BLOCKED`. Missing authority is not an implementation finding.

Identify these inputs from the repository and record them in the audit:

```text
TICKET_ID
TICKET_PATH
TICKET_STATUS
IMPLEMENTATION_UNIT
GAP_IDS
REQUIREMENT_IDS
ACCEPTANCE_IDS
ADR_PATHS
SPEC_PATH
GAP_MATRIX_PATH
IMPLEMENTATION_PLAN_PATH
PLAN_AUDIT_PATH
TICKET_AUDIT_PATH
IMPLEMENTATION_BASELINE
CURRENT_HEAD
AUDIT_TARGET_HEAD
AUDIT_TARGET_STATE_FINGERPRINT
CHANGED_FILES
```

`AUDIT_TARGET_HEAD` identifies the base commit. The semantic implementation
subject may include a working-tree overlay only when its exact content is
covered by `AUDIT_TARGET_STATE_FINGERPRINT` and remains unchanged during the
audit.

## Audit procedure

Complete every applicable phase even after finding a blocking defect. The
objective is the complete observable finding set within this specialist domain.

### 1. Canonical subject and traceability

Verify the ticket identity and its upstream links. Confirm that:

- the ticket belongs to the expected specification;
- the Implementation Unit exists;
- Gap, Requirement, and Acceptance IDs are valid;
- upstream references resolve;
- upstream artifacts remain authoritative.

Classify traceability as `TRACEABILITY_CONFORMANT`, `TRACEABILITY_PARTIAL`, or
`TRACEABILITY_INVALID`. If invalid authority prevents a reliable audit, return
`SPECIALIST_AUDIT_BLOCKED`.

### 2. Execution eligibility

Verify that implementation was authorized when execution began. Check that the
ticket was `READY`, blockers were cleared, predecessors satisfied their gates,
the execution wave was eligible, and required external capabilities existed.

Recalculate the shared `EXECUTION_READY` predicate from the independent
capability dimensions and dependency class. `LOCAL_TESTABILITY = YES`, a
fixture/mock/fake, or an in-memory repository is not productive availability.
A ticket that started with `PRODUCTIVE_AVAILABILITY = NO` for a
`REQUIRED_FOR_LOCAL_EXECUTION` or `REQUIRED_FOR_LOCAL_CLOSURE` capability was
not execution-ready, even if the code later passes local tests.

Classify the result as:

```text
EXECUTION_ELIGIBILITY_CONFIRMED
IMPLEMENTED_WHILE_BLOCKED
PREMATURE_EXECUTION
MISSING_PREREQUISITE
```

Governance violations remain findings even when the implementation is
technically correct.

For every availability or acceptance contradiction, record:

```text
CAPABILITY
FINDING_CATEGORY
DEPENDENCY_CLASS
LOCAL_CLOSURE_BLOCKING
LOCAL_ACCEPTANCE_REQUIRES_PRODUCTIVE_CAPABILITY
CLOSURE_OWNERSHIP
COMPLETION_EVIDENCE_TIMING
DEPENDENCY_CLASS_RECLASSIFICATION_REQUIRED
UPSTREAM_DEPENDENCY_CLASSIFICATION_PRESERVED
```

An unavailable `REQUIRED_FOR_INTEGRATED_PROOF` capability with no local
acceptance dependency is an integrated-only candidate, not a local ticket
blocker.

Plan/Ticket classification is authority for this scope. If the audit proposes
changing it, require explicit local Acceptance Criterion or Completion Evidence
proof and emit `DEPENDENCY_CLASS_RECLASSIFICATION_REQUIRED = YES` with route
`PLAN_OR_TICKET_REVALIDATION`; otherwise emit
`UPSTREAM_DEPENDENCY_CLASSIFICATION_PRESERVED = YES`.

### 3. Authorized scope reconstruction

Reconstruct intended scope from the ticket and upstream authority, never from
the code under audit. Capture:

```text
REQUIRED_LOCAL_BEHAVIOR
INTEGRATION_BEHAVIOR
DOES_NOT_IMPLEMENT
EXPECTED_REPOSITORY_IMPACT
GAP_OBLIGATIONS
REQUIREMENTS
ACCEPTANCE_CRITERIA
ACCEPTANCE_OBLIGATIONS
COMPLETION_EVIDENCE
```

Use this as the canonical implementation contract for the remaining phases.

### 4. Repository scope audit

Inspect the implementation diff and classify every changed file as one of:

```text
DIRECT_TICKET_IMPLEMENTATION
REQUIRED_SHARED_SUPPORT
REQUIRED_TEST_CHANGE
REQUIRED_MIGRATION
AUTHORIZED_GENERATED_ARTIFACT
UNRELATED_CHANGE
SCOPE_EXPANSION
FOREIGN_SCOPE_CHANGE
```

Report `CHANGED_FILES_TOTAL`, `IN_SCOPE_FILES`, `UNRELATED_FILES`,
`SCOPE_EXPANSION_FILES`, and `FOREIGN_SCOPE_FILES`. Necessary internal
refactoring is in scope when it is required to deliver the authorized behavior.

### 5. Required behavior coverage

For every required ticket behavior, inspect executable behavior and classify it
as:

```text
IMPLEMENTED
PARTIAL
MISSING
CONTRADICTORY
IMPLEMENTED_WITH_SCOPE_LEAKAGE
```

Comments, names, TODO removal, checkboxes, and execution-report claims do not
prove behavior.

### 6. Gap closure

For every ticket-owned Gap, produce:

| Gap | Validated Delta | Implementation Evidence | Residual | Result |
|---|---|---|---|---|

Use exactly one result:

```text
GAP_CLOSED
GAP_PARTIALLY_CLOSED
GAP_NOT_CLOSED
GAP_CLOSED_WITH_NEW_CONTRADICTION
```

Every active ticket-owned Gap must be closed for specialist conformance.

### 7. Requirement conformance

For every Requirement ID, produce:

| Requirement | Required Behavior | Evidence | Result |
|---|---|---|---|

Use `CONFORMANT`, `PARTIAL`, `NON_CONFORMANT`, or `NOT_AFFECTED`.
Gap closure alone does not prove complete requirement conformance.

### 8. Acceptance criteria

Evaluate every ticket acceptance criterion independently using objective
repository or test evidence. Use:

```text
SATISFIED
PARTIALLY_SATISFIED
NOT_SATISFIED
UNSUPPORTED
BLOCKED
```

Checked boxes without evidence are unsupported claims.

### 9. Acceptance obligations

For every canonical Acceptance ID referenced or materially affected, produce:

| Acceptance | Implementation Evidence | Supporting Test Evidence | Result |
|---|---|---|---|

Use `DIRECTLY_CONFORMANT`, `CROSS_SPEC_CONFORMANT`, `PARTIAL`,
`NON_CONFORMANT`, or `REGRESSION_INDICATED`.

Detailed test correctness belongs to `audit-implementation-behavior`; this
skill must still confirm that evidence exists for each obligation.

### 10. Completion evidence

Verify every ticket-required completion-evidence item. Classify each as
`PRESENT_AND_VERIFIED`, `PRESENT_BUT_WEAK`, `ABSENT`, `BLOCKED`, or
`NOT_APPLICABLE`.

Report:

```text
COMPLETION_EVIDENCE_REQUIRED
COMPLETION_EVIDENCE_VERIFIED
COMPLETION_EVIDENCE_MISSING
```

### 11. Scope creep

Inspect changed behavior for unauthorized product or domain behavior. Classify
it as `NECESSARY_INTERNAL_REFACTOR`, `REQUIRED_SHARED_SUPPORT`,
`UNAUTHORIZED_SCOPE_EXPANSION`, `SPECULATIVE_FEATURE`, or
`FOREIGN_SCOPE_IMPLEMENTATION`.

Do not call harmless implementation detail scope creep; report behavior that
changes authority, product scope, or another ticket's ownership.

### 12. Status accuracy

Verify that current ticket status reflects repository reality. Classify it as
`STATUS_CORRECT`, `PREMATURE_VALIDATION_REQUIRED`, `STALE_IMPLEMENTED`, or
`STATUS_INCONSISTENT_WITH_REPOSITORY`.

Do not modify status.

Also flag `STATUS_INCONSISTENT_WITH_AVAILABILITY` when `STATUS: READY`,
`BLOCKED_BY: NONE`, or `TICKET_LOCAL_CLOSURE = YES` contradicts the required
capability status or a non-executable acceptance witness.

## Cross-cutting audit rules

### Systemic findings

When one defect indicates equivalent manifestations within the authorized ticket
scope, inspect the reasonable impact radius and prefer one systemic finding with
all relevant evidence. Keep materially independent defects separate.

### Severity and finding IDs

Use:

```text
CRITICAL
MAJOR
MINOR
INFO
```

`CRITICAL` is a fundamental authority or traceability contradiction that makes
the ticket implementation invalid. `MAJOR` is a missing or partial Gap,
requirement, acceptance criterion, unauthorized scope, or materially incomplete
completion evidence. `MINOR` is a localized non-critical evidence or
traceability defect. `INFO` is a non-blocking observation.

Use specialist IDs only:

```text
CONF-CRITICAL-001
CONF-MAJOR-001
CONF-MINOR-001
CONF-INFO-001
```

Every finding must include:

- severity;
- ticket;
- Gap IDs;
- Requirement IDs;
- Acceptance IDs;
- normative authority;
- repository evidence;
- problem;
- impact;
- minimum correction required;
- `Systemic pattern = YES | NO`.
- capability, dependency class, local-acceptance dependency, and evidence timing;
- local closure blocking and upstream-classification preservation/reclassification
  fields;
- suggested local/integrated blocking effects for canonical consolidation (the
  consolidator owns final `BLOCKS_*` values).

Do not use global `IMA-*` IDs. A consolidation skill assigns canonical global
finding identity.

### Completion bar

Before finishing, verify that every applicable phase ran, every referenced Gap,
Requirement, Acceptance, criterion, and evidence obligation was evaluated, all
changed files were classified, execution eligibility was checked, and findings
are backed by repository evidence.

Set:

```text
DOMAIN_AUDIT_COMPLETE = YES | NO
```

Normal completion requires `YES`.

## Required audit artifact

Create:

```text
<TICKET-ID>-conformance-audit.md
```

inside the ticket audit workspace or folder according to repository convention.
Do not overwrite the ticket or any upstream artifact.

The artifact must contain:

1. Audit mode and ticket/upstream subject, including all required inputs.
2. Execution eligibility and traceability results.
3. Reconstructed canonical implementation contract.
4. Changed-file classification and scope counts.
5. Required behavior coverage.
6. Gap Closure table.
7. Requirement Conformance table.
8. Acceptance Criteria table.
9. Acceptance Obligations table.
10. Completion Evidence table and counts.
11. Scope-creep and status-accuracy results.
12. Findings with the required specialist IDs and evidence.
13. The required summary below.

## Specialist result

Return exactly one result:

```text
SPECIALIST_CONFORMANCE_PASS
SPECIALIST_CONFORMANCE_FINDINGS
SPECIALIST_AUDIT_BLOCKED
```

`SPECIALIST_CONFORMANCE_PASS` means zero blocking findings within this
specialist domain. It does not mean the ticket is `READY_FOR_DONE`.

Use `SPECIALIST_CONFORMANCE_FINDINGS` when any CRITICAL or MAJOR finding exists,
or when another finding materially prevents this domain from passing. Use
`SPECIALIST_AUDIT_BLOCKED` only when required authority or audit prerequisites
prevent a valid audit.

## Required final summary

After creating the artifact, return this structure and fill every value:

```text
Audit: <path>

Specialist:
TICKET_CONFORMANCE

Ticket: <ticket ID>

Changed files: <count>

Gaps: <count>

Gaps closed: <count>

Requirements: <count>

Requirements conformant: <count>

Acceptance criteria: <count>

Acceptance criteria satisfied: <count>

Completion evidence missing: <count>

Unauthorized scope expansion:
YES | NO

Findings:
CRITICAL=<count>
MAJOR=<count>
MINOR=<count>
INFO=<count>

Domain audit complete:
YES | NO

Specialist result:
SPECIALIST_CONFORMANCE_PASS
|
SPECIALIST_CONFORMANCE_FINDINGS
|
SPECIALIST_AUDIT_BLOCKED
```

Do not declare `READY_FOR_DONE`, modify implementation, or transition ticket
state.
