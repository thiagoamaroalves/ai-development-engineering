---
name: consolidate-implementation-audit
description: >
  Consolidate independent ticket-conformance, implementation-behavior, implementation-design-conformance, and architecture-boundary audits for one implemented ticket into a single canonical implementation-audit result. Reconcile, deduplicate, severity-normalize, causally classify, preserve lineage, classify finding origin and audit escapes, detect remediation regressions, determine remediation routing, and produce the authoritative IMA finding set and ticket implementation verdict. Use only after all required specialist domains have completed against the same pinned semantic implementation state. This skill is read-only and does not re-audit code, remediate defects, modify implementation or upstream authority, transition ticket state, or perform finalization.
---

# Consolidate Implementation Audit

## Purpose

Produce the single canonical implementation-audit result from all required independent specialist evidence.

Read `../_shared/finding-completion-readiness-contract.md` together with the
authority gates. This skill is the sole owner of canonical finding-level
completion classification and must derive the local ticket gate from the
obligation and evidence timing, never from severity alone.

Also read `../_shared/implementation-audit-routing-contract.md`. The canonical
artifact must carry the next authorized operation derived from its verdict,
ticket gate, finding completeness, and semantic target validity.

Also read:

- `../_shared/root-cause-campaign-contract.md`;
- `../_shared/audit-convergence-contract.md`;
- `../_shared/authority-provenance-anti-forgery-contract.md`;
- `../_shared/audit-report-structure-contract.md`.

Apply these contracts without merging independent obligations or weakening the
canonical finding gate.

Workflow:

~~~text
Implemented Ticket
        ↓
audit-implemented-ticket
        ↓
ticket conformance + behavior + design + architecture when required
        ↓
consolidate-implementation-audit
        ↓
Canonical IMA-* finding set
        ↓
TICKET_IMPLEMENTATION_CONFORMANT
or TICKET_IMPLEMENTATION_REMEDIATION_REQUIRED
or TICKET_IMPLEMENTATION_AUDIT_BLOCKED
~~~

Architecture is required only when the parent audit profile requires it.

Specialists produce independent evidence. They do not own canonical finding identity, severity, root cause, remediation route, lineage, verdict, or ticket completion gate. This skill owns those canonical judgments.

## Operating mode

~~~text
READ_ONLY
CONSOLIDATION_ONLY
SPECIALIST_EVIDENCE_DRIVEN
CANONICAL_FINDING_AUTHORITY
SAME_TARGET_REQUIRED
CAUSAL_RECONCILIATION
SEVERITY_NORMALIZATION
LINEAGE_PRESERVING
ROOT_CAUSE_CAMPAIGN_AWARE
CONVERGENCE_GATE_AWARE
REPORT_DELTA_AND_LEDGER_AWARE
PROVENANCE_AND_ANTI_FORGERY_AWARE
AUDIT_ESCAPE_AWARE
REMEDIATION_REGRESSION_AWARE
DESIGN_CONFORMANCE_AWARE
NO_NEW_FULL_CODE_AUDIT
NO_REMEDIATION
NO_IMPLEMENTATION
NO_TICKET_STATE_CHANGE
NO_UPSTREAM_AUTHORITY_CHANGE
~~~

Create only the canonical implementation-audit artifact. Do not modify production code, tests, ticket files, ticket index, ADRs, portfolio, SPEC, Gap Matrix, Plan, Implementation Design, or specialist artifacts.

## Authority model

~~~text
Accepted ADR authority
    >
Approved SPEC Portfolio
    >
Conformant Component SPEC
    >
Explicit Cross-Spec Contracts
    >
Validated Gap Matrix
    >
Conformant Implementation Plan
    >
Conformant Ticket Set
    >
Approved Implementation Design
    >
Pinned Actual Implementation
    >
Independent Specialist Evidence
    >
Canonical Consolidated Audit
~~~

Upstream authority defines required semantics and ownership. The Implementation Design defines the approved structural blueprint. Actual code is the audit subject. Specialists provide domain evidence. The consolidator produces the canonical defect model and verdict. Do not independently redesign or re-audit the technical subject.

## 1. Required inputs

Read `skills/_shared/baseline-drift-remediation-contract.md`. The canonical
consolidated audit must carry the shared reassessment proof and exact audit-basis
fingerprint whenever any specialist detects baseline/source drift. Its assessed
actionable result is a valid input to `remediate-implemented-ticket`; an
incomplete proof or later divergence is a baseline blocker.

Identify:

~~~text
TICKET_ID
TICKET_PATH
TICKET_FOLDER
AUDIT_ROUND
AUDIT_TARGET_HEAD
CURRENT_HEAD
IMPLEMENTATION_BASELINE
AUDIT_PROFILE
BASELINE_DRIFT_STATUS
REASSESSMENT_COMPLETE
FINDINGS_ARE_ACTIONABLE
BASELINE_REMEDIATION_READINESS
AUDIT_BASIS_FINGERPRINT
BASE_REPORT_PATH
ROUND_DELTA_PATH
FINDING_LINEAGE_LEDGER_PATH
CONFORMANCE_AUDIT_PATH
BEHAVIOR_AUDIT_PATH
DESIGN_CONFORMANCE_AUDIT_PATH
ARCHITECTURE_AUDIT_PATH
IMPLEMENTATION_DESIGN_PATH
~~~

For RE_AUDIT also identify:

~~~text
PREVIOUS_CANONICAL_AUDIT_PATH
PREVIOUS_AUDIT_TARGET_HEAD
PREVIOUS_CANONICAL_FINDINGS
REMEDIATION_BASELINE
REMEDIATION_HEAD
REMEDIATION_DELTA
REMEDIATION_CHANGED_FILES
~~~

Read every required persisted specialist artifact, not summary output alone.

## 2. Required profile and result contracts

The parent orchestrator supplies:

~~~text
CONFORMANCE = REQUIRED
BEHAVIOR = REQUIRED
DESIGN_CONFORMANCE = REQUIRED
ARCHITECTURE = REQUIRED | NOT_REQUIRED
~~~

Design conformance is mandatory in the current workflow. Do not retroactively mark a missing design audit NOT_REQUIRED.

Require exactly one result for each required domain:

~~~text
Conformance:
SPECIALIST_CONFORMANCE_PASS
SPECIALIST_CONFORMANCE_FINDINGS
SPECIALIST_AUDIT_BLOCKED

Behavior:
SPECIALIST_BEHAVIOR_PASS
SPECIALIST_BEHAVIOR_FINDINGS
SPECIALIST_AUDIT_BLOCKED

Design:
SPECIALIST_DESIGN_PASS
SPECIALIST_DESIGN_FINDINGS
SPECIALIST_AUDIT_BLOCKED

Architecture:
SPECIALIST_ARCHITECTURE_PASS
SPECIALIST_ARCHITECTURE_FINDINGS
SPECIALIST_AUDIT_BLOCKED
~~~

When architecture is not required, use ARCHITECTURE_RESULT = NOT_REQUIRED. PASS and FINDINGS require DOMAIN_AUDIT_COMPLETE = YES.

## 3. Specialist artifact validation

For every required specialist verify:

~~~text
artifact exists
Ticket ID matches
audit round matches
AUDIT_TARGET_HEAD matches
specialist result valid
DOMAIN_AUDIT_COMPLETE valid
finding structure valid
artifact is complete
~~~

Block with one exact reason when needed:

~~~text
REQUIRED_SPECIALIST_MISSING
SPECIALIST_AUDIT_BLOCKED
SPECIALIST_AUDIT_INCOMPLETE
SPECIALIST_RESULT_INVALID
SPECIALIST_ARTIFACT_INVALID
SPECIALIST_SUBJECT_MISMATCH
~~~

Do not treat incomplete execution as PASS.

## 4. Same-target validation

Collect:

~~~text
CONFORMANCE_HEAD
BEHAVIOR_HEAD
DESIGN_HEAD
ARCHITECTURE_HEAD when required
AUDIT_TARGET_HEAD
~~~

Require every specialist head to equal AUDIT_TARGET_HEAD. Do not use a later working-tree HEAD as semantic authority merely because audit documents changed.

Classify:

~~~text
SPECIALIST_STATE_CONSISTENT
NON_SEMANTIC_ARTIFACT_DRIFT
MATERIAL_STATE_DIVERGENCE
~~~

If implementation or test semantics differ between specialist audits:

~~~text
TICKET_IMPLEMENTATION_AUDIT_BLOCKED
reason = SPECIALIST_STATE_DIVERGENCE
~~~

## 5. Implementation Design context

Read the approved Implementation Design only as context for interpreting design evidence. Verify:

~~~text
IMPLEMENTATION_DESIGN_READY
IMPLEMENTATION_DESIGN_GATE = READY_FOR_IMPLEMENTATION
~~~

If a specialist used a different design revision:

~~~text
TICKET_IMPLEMENTATION_AUDIT_BLOCKED
reason = IMPLEMENTATION_DESIGN_BASELINE_MISMATCH
~~~

The consolidator does not re-audit DDD or SOLID; it reconciles the design specialist's evidence.

## 6. Complete source finding inventory

Collect every finding from specialist namespaces such as CONF, BEH, IDC, and ARCH. For each source finding record:

~~~text
SOURCE_SPECIALIST
SOURCE_FINDING_ID
SOURCE_SEVERITY
TICKET_ID
IMPLEMENTATION_UNIT
GAP_IDS
REQUIREMENT_IDS
ACCEPTANCE_IDS
NORMATIVE_AUTHORITY
AFFECTED_BEHAVIOR
AFFECTED_RESPONSIBILITY
AFFECTED_COMPONENT
AFFECTED_BOUNDARY
AFFECTED_INVARIANT
REPOSITORY_EVIDENCE
TEST_EVIDENCE
PROBLEM
IMPACT
MINIMUM_CORRECTION
SYSTEMIC_PATTERN
RELATED_LOCATIONS
~~~

Report source counts:

~~~text
CONFORMANCE_SOURCE_FINDINGS
BEHAVIOR_SOURCE_FINDINGS
DESIGN_SOURCE_FINDINGS
ARCHITECTURE_SOURCE_FINDINGS
SOURCE_FINDINGS_TOTAL
~~~

Classify source domain as TICKET_CONFORMANCE, IMPLEMENTATION_BEHAVIOR, IMPLEMENTATION_DESIGN, or ARCHITECTURE_BOUNDARY. Provenance is not necessarily canonical root cause.

## 7. Finding relationship reconciliation

Compare findings by:

~~~text
normative obligation
causal defect
authority
runtime manifestation
structural manifestation
remediation obligation
~~~

Classify relationships:

~~~text
SAME_DEFECT
SAME_ROOT_CAUSE_DIFFERENT_MANIFESTATION
RELATED_BUT_INDEPENDENT
INDEPENDENT
CONTRADICTORY_SPECIALIST_INTERPRETATION
~~~

### Same defect

Create one canonical finding and preserve every source specialist ID, source finding ID, evidence location, manifestation, and affected obligation.

### Same root cause, different manifestation

Merge only when one causal defect and one coherent correction obligation would resolve all manifestations.

Example: design finds an invariant moved to an application service, behavior finds the invariant bypass at runtime, and conformance finds the promised ownership was not implemented. These may merge only when restoring canonical invariant ownership resolves all three.

### Do not over-merge

Keep findings separate when remediation obligations differ, such as an application-service ownership defect and an independent concurrency atomicity defect.

Do not automatically merge structural design and runtime semantic findings. Ask whether one correction necessarily resolves both.

## 8. Source-finding accounting

Every source finding maps to exactly one:

~~~text
<IMA-ID>
NON_BLOCKING_OBSERVATION
REJECTED_AS_INVALID
~~~

A rejection requires evidence-based justification. Require:

~~~text
SOURCE_FINDINGS_ACCOUNTED_FOR = YES
~~~

When specialists disagree, resolve using evidence and authority precedence; do not average opinions. If resolution requires new substantive investigation:

~~~text
TICKET_IMPLEMENTATION_AUDIT_BLOCKED
reason = SPECIALIST_CONTRADICTION_REQUIRES_REAUDIT
~~~

## 9. Canonical root cause and severity

Every canonical finding receives a stable root-cause campaign reference and
must be reconciled through the shared campaign matrix. Preserve separate
findings when obligations differ, even when they share one campaign.

~~~text
ROOT_CAUSE_CAMPAIGN_ID = <stable campaign id>
CAMPAIGN_MATRIX_COMPLETE = YES | NO
ALL_SURFACE_ROWS_COVERED = YES | NO
ALL_NEGATIVE_WITNESSES_PASS = YES | NO
EXPANDED_RADIUS_REQUIRED = YES | NO
ROOT_CAUSE_DOMAIN =
TICKET_CONFORMANCE
IMPLEMENTATION_BEHAVIOR
IMPLEMENTATION_DESIGN
ARCHITECTURE_BOUNDARY
CROSS_DOMAIN
UPSTREAM_AUTHORITY
~~~

Optionally use:

~~~text
ROOT_CAUSE_CATEGORY =
SCOPE_INCOMPLETE
ACCEPTANCE_INCOMPLETE
BEHAVIORAL_SEMANTIC_ERROR
CONCURRENCY_ERROR
RECOVERY_ERROR
DOMAIN_MODEL_DRIFT
AGGREGATE_BOUNDARY_VIOLATION
INVARIANT_PLACEMENT_DRIFT
RESPONSIBILITY_MIXING
SOLID_VIOLATION
DEPENDENCY_DIRECTION_VIOLATION
INFRASTRUCTURE_LEAKAGE
DOMAIN_RULE_DUPLICATION
TESTABILITY_REGRESSION
CROSS_SPEC_OWNERSHIP_VIOLATION
CANONICAL_AUTHORITY_VIOLATION
MIGRATION_CUTOVER_VIOLATION
SECURITY_BOUNDARY_VIOLATION
UPSTREAM_AUTHORITY_GAP
RECONSTRUCTION_AUTHORITY_GAP
REHYDRATION_AUTHORITY_GAP
CAPABILITY_AVAILABILITY_CONTRADICTION
READINESS_HANDOFF_CONTRADICTION
DOWNSTREAM_PROMOTION_WITHOUT_NEW_EVIDENCE
OTHER
~~~

Normalize severity independently:

~~~text
CRITICAL
MAJOR
MINOR
INFO
~~~

Do not mechanically choose the maximum source severity.

For every campaign with `EXPANDED_RADIUS_REQUIRED = YES`, consolidation must
preserve the campaign-level blocker and require the remediation preflight before
any remediation checkpoint. A campaign cannot be marked closed when its surface
matrix or negative witnesses are incomplete.

CRITICAL covers canonical authority, identity/history corruption, destructive safety, critical invariant bypass, unauthorized foreign ownership, security boundary, or irreversible incorrect transition. It does not by itself select a completion gate.

MAJOR covers material defects such as anemic-domain regression, god component, fat application service, aggregate violation, invariant drift, DIP or dependency-direction violation, infrastructure leakage, domain-rule duplication, testability regression, or undeclared material design deviation. A MAJOR finding may block local DONE or only integrated proof; derive that effect from the finding-completion contract. Happy-path tests do not downgrade a material design defect.

MINOR covers localized issues that do not materially alter domain ownership, invariant enforcement, responsibility boundaries, dependency direction, runtime semantics, completion evidence, or auditability.

INFO is non-blocking observation only. Do not report style preference as a finding.

Structural quality is part of the approved implementation contract. Do not automatically downgrade IDC findings to MINOR.

## 10. Canonical IDs and schema

Initial audit IDs are monotonic per severity:

~~~text
IMA-CRITICAL-001
IMA-MAJOR-001
IMA-MINOR-001
IMA-INFO-001
~~~

On re-audit preserve the prior canonical ID when the underlying normative defect remains the same. Do not assign a new ID because wording, evidence location, severity, specialist, or manifestation changed.

Every canonical finding contains:

~~~text
Finding ID
Severity
Title
Root cause domain
Root cause category
Source specialists
Source finding IDs
Ticket
Implementation Unit
Gap IDs
Requirement IDs
Acceptance IDs
Normative authority
Repository evidence
Test evidence
Expected result
Audited result
Problem
Root cause
Impact
Structural impact
Behavioral impact
Architecture impact
Systemic pattern
Related locations
Minimum correction required
Remediation route
Finding status
Capability
Dependency class
Local closure blocking
Local acceptance requires productive capability
Closure ownership
Dependency class reclassification required
Upstream dependency classification preserved
Blocks local execution
Blocks local closure
Blocks ticket done
Blocks integrated proof
Blocks SPEC final conformance
Downstream checkpoint
Downstream owner
~~~

Use NOT_APPLICABLE where an impact dimension does not apply.

## 11. Remediation route

Every blocking canonical finding gets one primary route:

~~~text
IMPLEMENTATION_REMEDIATION
IMPLEMENTATION_DESIGN_REVALIDATION
TICKET_REVALIDATION
PLAN_OR_TICKET_REVALIDATION
IMPLEMENTATION_PLAN_REVALIDATION
GAP_MATRIX_REVALIDATION
SPEC_REVALIDATION
PORTFOLIO_REVALIDATION
ADR_REVALIDATION
~~~

Use IMPLEMENTATION_REMEDIATION when correction fits approved ticket semantics and design. Use IMPLEMENTATION_DESIGN_REVALIDATION only when repository evidence proves the approved design itself must materially change. Use `GAP_MATRIX_REVALIDATION`, `SPEC_REVALIDATION`, or `IMPLEMENTATION_PLAN_REVALIDATION` when the finding shows that a capability availability, implementability, reconstruction, rehydration, local-closure, or READY predicate was determinable upstream. A fixture-only promotion is never an implementation fix. Use upstream routes only when correction cannot be made within downstream authority.

## 11a. Finding completion classification

For every canonical finding, derive and persist all fields required by the
shared finding-completion contract. In particular, a
`CAPABILITY_AVAILABILITY_CONTRADICTION` with
`DEPENDENCY_CLASS = REQUIRED_FOR_INTEGRATED_PROOF` and no local productive
capability requirement has:

```text
FINDING_STATUS = OPEN
BLOCKS_LOCAL_EXECUTION = NO
BLOCKS_LOCAL_CLOSURE = NO
BLOCKS_TICKET_DONE = NO
BLOCKS_INTEGRATED_PROOF = YES
```

When the Plan/Ticket capability record was independently audited with
`LOCAL_CLOSURE_BLOCKING = NO`, preserve that completion scope. Producer
unavailability alone is not a reclassification. Emit:

```text
UPSTREAM_DEPENDENCY_CLASSIFICATION_PRESERVED = YES
DEPENDENCY_CLASS_RECLASSIFICATION_REQUIRED = NO
```

Only explicit evidence that a local Acceptance Criterion or Completion Evidence
requires productive capability may change the class/effect. In that case emit
`DEPENDENCY_CLASS_RECLASSIFICATION_REQUIRED = YES`, identify the evidence, and
route to `PLAN_OR_TICKET_REVALIDATION`; never silently promote the finding into
the local blocker set.

Preserve its primary upstream route and explicit downstream checkpoint/owner.
Do not resolve it, promote availability, or move producer responsibility to the
consumer. Conversely, any finding required by local execution or local closure
must have `BLOCKS_TICKET_DONE = YES` while open. Record
`FINDING_SEVERITY_USED_AS_SOLE_COMPLETION_GATE = 0`.

## 12. Re-audit lineage and origin

For RE_AUDIT reconcile every previous canonical finding as:

~~~text
RESOLVED
STILL_PRESENT
REGRESSED
SUPERSEDED
~~~

RESOLVED requires current evidence that the defect is absent. STILL_PRESENT means the same underlying defect remains. REGRESSED means remediation attempted or temporarily resolved the obligation but the current state violates it. SUPERSEDED means another IMA finding now represents the same obligation; record SUPERSEDED_BY = <IMA-ID>.

No previous blocking finding may disappear silently:

~~~text
PREVIOUS_FINDINGS_RECONCILED = YES
~~~

Each current canonical finding without a previous identity receives:

~~~text
NEW_PREEXISTING
NEW_INTRODUCED_BY_REMEDIATION
NEWLY_APPLICABLE
UNKNOWN_ORIGIN
~~~

Use NEW_PREEXISTING only when evidence shows it existed before remediation and was reasonably observable. Use NEW_INTRODUCED_BY_REMEDIATION only when history shows remediation introduced it. Use NEWLY_APPLICABLE when remediation introduced or activated an obligation. Use UNKNOWN_ORIGIN when history cannot support more.

For NEW_PREEXISTING findings classify:

~~~text
CONFORMANCE_ESCAPE
BEHAVIOR_ESCAPE
DESIGN_ESCAPE
ARCHITECTURE_ESCAPE
CROSS_DOMAIN_ESCAPE
UNCLASSIFIED_ESCAPE
~~~

A DESIGN_ESCAPE includes a preexisting god component, invariant-placement drift, dependency-direction violation, anemic-domain regression, or material unrecorded design deviation that the prior design audit should reasonably have detected.

For remediation-introduced findings classify:

~~~text
DIRECT_REMEDIATION_REGRESSION
COLLATERAL_REMEDIATION_REGRESSION
SYSTEMIC_REMEDIATION_REGRESSION
~~~

Count STRUCTURAL_REGRESSIONS for new design/structural defects.

## 13. Consolidated completeness gate

Before a non-blocked verdict require:

~~~text
ALL_REQUIRED_SPECIALISTS_COMPLETE = YES
CONFORMANCE_DOMAIN_COMPLETE = YES
BEHAVIOR_DOMAIN_COMPLETE = YES
DESIGN_DOMAIN_COMPLETE = YES
ARCHITECTURE_DOMAIN_COMPLETE = YES | NOT_REQUIRED
SPECIALIST_STATE_CONSISTENT = YES
SOURCE_FINDINGS_ACCOUNTED_FOR = YES
PREVIOUS_FINDINGS_RECONCILED = YES | NOT_APPLICABLE
NEW_FINDING_ORIGINS_CLASSIFIED = YES | NOT_APPLICABLE
CANONICAL_FINDING_ROUTES_CLASSIFIED = YES
BASELINE_DRIFT_STATUS = NO_DRIFT | DRIFT_ASSESSED
BASELINE_REMEDIATION_READINESS = READY
AUDIT_BASIS_STALE = NO
~~~

If any fails, return TICKET_IMPLEMENTATION_AUDIT_BLOCKED.

If baseline drift was observed, require the complete shared
`BASELINE_REASSESSMENT_PROOF` and carry its old/current baselines into the
canonical report. `DRIFT_ASSESSED` with actionable findings remains
`TICKET_IMPLEMENTATION_REMEDIATION_REQUIRED`; only incomplete reassessment or
a changed live fingerprint produces `TICKET_IMPLEMENTATION_AUDIT_BLOCKED`.

## 14. Verdicts and ticket gate

Return exactly one:

~~~text
TICKET_IMPLEMENTATION_CONFORMANT
TICKET_IMPLEMENTATION_REMEDIATION_REQUIRED
TICKET_IMPLEMENTATION_AUDIT_BLOCKED
~~~

Use TICKET_IMPLEMENTATION_CONFORMANT only when all required domains completed against the same target, all source findings are accounted for, previous findings are reconciled, new origins are classified, no unresolved material contradiction exists, and CRITICAL_FINDINGS = 0 and MAJOR_FINDINGS = 0. An open integrated-only finding remains visible and routed even when it does not block the local ticket gate.

Use TICKET_IMPLEMENTATION_REMEDIATION_REQUIRED when the audit is valid and complete but one or more canonical findings remain open. The canonical IMA set is then the sole authoritative remediation inventory. This verdict describes unresolved obligations; it does not by itself force `TICKET_GATE: NOT_READY_FOR_DONE`.

Use TICKET_IMPLEMENTATION_AUDIT_BLOCKED for missing/incomplete specialists, target divergence, invalid artifacts, unresolved contradiction requiring re-audit, or invalid audit basis. Do not use BLOCKED for ordinary implementation defects.

Return exactly one gate:

~~~text
TICKET_GATE: READY_FOR_DONE
TICKET_GATE: NOT_READY_FOR_DONE
~~~

Derive `TICKET_GATE` from `LOCAL_TICKET_DONE_ALLOWED` in the shared
finding-completion contract. `READY_FOR_DONE` requires valid local acceptance,
local completion evidence, no finding with `BLOCKS_TICKET_DONE = YES`, and no
non-executable local witness. Open integrated-only findings may coexist with
`READY_FOR_DONE`; they require an explicit downstream handoff. This skill never
transitions the ticket to DONE.

## 15. Canonical artifact

Create only:

~~~text
<TICKET-ID>-implementation-audit.md
~~~

inside the canonical ticket/audit location. Do not overwrite specialist evidence.

Use this section order:

~~~text
1. Audit Verdict
2. Ticket Subject
3. Audit Round
4. Audit Target HEAD
5. Specialist Audit Profile
6. Specialist Artifact Validation
7. Repository-State Consistency
8. Specialist Results
9. Source Finding Inventory
10. Finding Relationship / Deduplication Analysis
11. Canonical Root-Cause Analysis
12. Canonical Findings
13. Previous Finding Reconciliation
14. New Finding Origin Analysis
15. Audit Escape Analysis
16. Design Escape / Structural Regression Analysis
17. Remediation Regression Analysis
18. Remediation Routing
19. Canonical Metrics
20. Design Convergence Metrics
21. Overall Convergence Metrics
22. Finding Completeness Gate
23. Ticket Completion Gate
24. Completeness Proof
~~~

## 16. Required metrics

Report:

~~~text
AUDIT_ROUND
AUDIT_TARGET_HEAD

CONFORMANCE_RESULT
BEHAVIOR_RESULT
DESIGN_RESULT
ARCHITECTURE_RESULT

CONFORMANCE_SOURCE_FINDINGS
BEHAVIOR_SOURCE_FINDINGS
DESIGN_SOURCE_FINDINGS
ARCHITECTURE_SOURCE_FINDINGS
SOURCE_FINDINGS_TOTAL
CANONICAL_FINDINGS_TOTAL
DUPLICATE_REPRESENTATIONS_MERGED

REQUIRED_BEHAVIORS_TOTAL
DIRECT_BEHAVIOR_WITNESSES
PROXY_ONLY_BEHAVIORS
UNTESTED_STATE_TRANSITIONS
UNPROVEN_CONCURRENCY_CONTRACTS
MISSING_ARCHITECTURE_GUARDS

CRITICAL_FINDINGS
MAJOR_FINDINGS
MINOR_FINDINGS
INFO_FINDINGS

PREVIOUS_FINDINGS_TOTAL
PREVIOUS_FINDINGS_RESOLVED
PREVIOUS_FINDINGS_STILL_PRESENT
PREVIOUS_FINDINGS_REGRESSED
PREVIOUS_FINDINGS_SUPERSEDED
CONSECUTIVE_FINDING_PERSISTENCE
REMEDIATION_PROGRESS
CONVERGENCE_STATUS
NON_CONVERGENCE_REASON
EXPANDED_RADIUS_REQUIRED

NEW_FINDINGS_TOTAL
NEW_PREEXISTING_FINDINGS
NEW_REMEDIATION_INTRODUCED_FINDINGS
NEWLY_APPLICABLE_FINDINGS
UNKNOWN_ORIGIN_FINDINGS

AUDIT_ESCAPE_COUNT
CONFORMANCE_ESCAPES
BEHAVIOR_ESCAPES
DESIGN_ESCAPES
ARCHITECTURE_ESCAPES
CROSS_DOMAIN_ESCAPES
UNCLASSIFIED_ESCAPES
DESIGN_DEVIATION_ESCAPES

REMEDIATION_REGRESSION_COUNT
STRUCTURAL_REGRESSIONS

DESIGN_FINDINGS_PREVIOUS
DESIGN_FINDINGS_RESOLVED
DESIGN_FINDINGS_STILL_PRESENT
DESIGN_FINDINGS_REGRESSED

IMPLEMENTATION_REMEDIATION_FINDINGS
IMPLEMENTATION_DESIGN_REVALIDATION_FINDINGS
TICKET_REVALIDATION_FINDINGS
PLAN_REVALIDATION_FINDINGS
GAP_MATRIX_REVALIDATION_FINDINGS
SPEC_REVALIDATION_FINDINGS
PORTFOLIO_REVALIDATION_FINDINGS
ADR_REVALIDATION_FINDINGS
PLAN_OR_TICKET_REVALIDATION_FINDINGS
OPEN_INTEGRATED_FINDINGS
LOCAL_TICKET_BLOCKING_FINDINGS
INTEGRATED_ONLY_AVAILABILITY_BLOCKING_LOCAL_DONE
LOCAL_CLOSURE_FINDINGS_NOT_BLOCKING_DONE
FINDING_SEVERITY_USED_AS_SOLE_COMPLETION_GATE
OPEN_INTEGRATED_FINDING_LOST_FROM_TRACEABILITY
SPECIALIST_CANNOT_SILENTLY_PROMOTE_INTEGRATED_DEPENDENCY_TO_LOCAL_BLOCKER
CONSOLIDATOR_CANNOT_DERIVE_LOCAL_BLOCKING_FROM_SEVERITY_ALONE
LOCAL_DONE_GATE_USES_LOCAL_CLOSURE_SCOPE
INTEGRATED_PROOF_GATE_USES_INTEGRATED_DEPENDENCY_SCOPE
~~~

Diagnostic rates may be calculated when denominators are non-zero:

~~~text
FINDING_RESOLUTION_RATE
PERSISTENCE_RATE
REMEDIATION_REGRESSION_RATE
AUDIT_ESCAPE_RATE
~~~

Also report:

~~~text
CAMPAIGNS_TOTAL
CAMPAIGNS_NON_CONVERGING
BASE_REPORT_PATH
ROUND_DELTA_PATH
FINDING_LINEAGE_LEDGER_PATH
BASE_REPORT_IMMUTABLE
ROUND_DELTA_COMPLETE
FINDING_LINEAGE_LEDGER_COMPLETE
~~~

Never use rates to weaken severity or verdict.

## 17. Remediation consumption

When remediation is required, the canonical artifact and IMA findings are the only authoritative remediation input. Do not send specialist findings as competing inventories. Specialist artifacts remain supporting evidence linked from canonical findings.

## Critical rules

1. Specialists produce evidence; they do not produce the canonical defect inventory.
2. Design conformance is a first-class mandatory audit domain in the current workflow.
3. Same semantic target is mandatory; never consolidate mixed implementation states.
4. Causality and remediation obligation beat wording similarity.
5. Structural defects can block DONE when their finding-level obligation is local.
6. Do not over-merge independent defects.
7. Do not re-audit specialist domains inside consolidation.
8. Preserve every source finding and canonical finding lineage.
9. Preserve canonical IDs across rounds when the underlying defect remains.
10. Audit escapes and remediation regressions remain visible.
11. Route implementation defects to implementation remediation and invalid approved design to design revalidation.
12. Canonical severity describes impact; finding obligation and dependency class control the gate.
13. Minor design smell is not automatically major.
14. Functional correctness does not excuse a material structural violation.
15. Read-only only: no code, tests, upstream artifacts, or ticket state changes.

## Core completion invariant

Consolidation is complete only when every required independent specialist domain has completely audited the same pinned implementation state; every artifact is validated; all source findings from conformance, behavior, design, and architecture domains are inventoried and accounted for; duplicate representations are reconciled by causal defect; structural, behavioral, and architectural manifestations are merged only when they share one correction obligation; canonical root cause and severity are normalized; material design defects cannot be downgraded merely because happy-path behavior works; every canonical finding has a remediation route; previous IMA identities remain traceable across re-audits; new defects have evidence-backed origins; audit escapes and remediation-introduced structural regressions remain observable; no blocking source finding disappears without justification; and exactly one canonical IMA finding set, verdict, and ticket gate is produced for the round.

## Required final response

Return:

~~~text
Audit:
<canonical audit path>

Ticket:
<ticket ID/path>

Audit round:
<INITIAL_AUDIT | RE_AUDIT>
<round number if applicable>

Audit target HEAD:
<commit>

Baseline drift status:
<NO_DRIFT | DRIFT_UNASSESSED | DRIFT_ASSESSED>

Reassessment complete:
<YES | NO>

Baseline remediation readiness:
<READY | BLOCKED_INSUFFICIENT_REASSESSMENT>

Audit basis fingerprint:
<exact basis>

Baseline reassessment proof:
<path or inline section when drift exists>

Conformance audit:
<path>

Conformance result:
<PASS | FINDINGS | BLOCKED>

Behavior audit:
<path>

Behavior result:
<PASS | FINDINGS | BLOCKED>

Design audit:
<path>

Design result:
<PASS | FINDINGS | BLOCKED>

Architecture audit:
<path | NOT_REQUIRED>

Architecture result:
<PASS | FINDINGS | BLOCKED | NOT_REQUIRED>

Source findings:
- Conformance: <n>
- Behavior: <n>
- Design: <n>
- Architecture: <n>
- Total: <n>

Canonical findings:
<n>

Semantic coverage:
- Required behaviors: <n>
- Direct behavior witnesses: <n>
- Proxy-only behaviors: <n>
- Untested state transitions: <n>
- Unproven concurrency contracts: <n>
- Missing architecture guards: <n>

Duplicates consolidated:
<n>

Findings:
- CRITICAL: <n>
- MAJOR: <n>
- MINOR: <n>
- INFO: <n>

Previous findings:
- Total: <n>
- Resolved: <n>
- Still present: <n>
- Regressed: <n>
- Superseded: <n>

New findings:
- Total: <n>
- Preexisting: <n>
- Remediation introduced: <n>
- Newly applicable: <n>
- Unknown origin: <n>

Audit escapes:
- Total: <n>
- Conformance: <n>
- Behavior: <n>
- Design: <n>
- Architecture: <n>
- Cross-domain: <n>
- Design deviation escapes: <n>

Remediation regressions:
- Total: <n>
- Structural: <n>

Design convergence:
- Previous: <n>
- Resolved: <n>
- Still present: <n>
- Regressed: <n>

Convergence:
- CONVERGENCE_STATUS: <CONVERGING|NON_CONVERGING|CLOSED|BLOCKED>
- NON_CONVERGENCE_FINDINGS: <ids or NONE>
- EXPANDED_RADIUS_REQUIRED: <YES|NO>
- CAMPAIGNS_TOTAL: <n>
- CAMPAIGNS_NON_CONVERGING: <n>

Report structure:
- BASE_REPORT_PATH: <path>
- ROUND_DELTA_PATH: <path>
- FINDING_LINEAGE_LEDGER_PATH: <path>
- BASE_REPORT_IMMUTABLE: <YES|NO>
- ROUND_DELTA_COMPLETE: <YES|NO>
- FINDING_LINEAGE_LEDGER_COMPLETE: <YES|NO>

Remediation routes:
- Implementation remediation: <n>
- Implementation design revalidation: <n>
- Ticket revalidation: <n>
- Plan revalidation: <n>
- Gap Matrix revalidation: <n>
- SPEC revalidation: <n>
- Portfolio revalidation: <n>
- ADR revalidation: <n>

Finding completeness:
PASS | FAIL

Audit verdict:
TICKET_IMPLEMENTATION_CONFORMANT
|
TICKET_IMPLEMENTATION_REMEDIATION_REQUIRED
|
TICKET_IMPLEMENTATION_AUDIT_BLOCKED

Next authorized operation:
checkpoint-implemented-ticket
|
audit-implemented-ticket
|
remediate-implemented-ticket
|
finalize-implemented-ticket
|
HUMAN_REQUIRED

Post-checkpoint operation:
remediate-implemented-ticket
|
finalize-implemented-ticket
|
audit-implemented-ticket
|
HUMAN_REQUIRED

Ticket gate:
READY_FOR_DONE
|
NOT_READY_FOR_DONE
~~~

When remediation is required, list only canonical findings:

~~~text
<IMA-ID> — <severity> — <title>
Root cause: <domain/category>
Route: <remediation route>
Lineage: <if re-audit>
Origin: <if applicable>
Status: <OPEN|RESOLVED|SUPERSEDED|REJECTED_BY_EVIDENCE>
Capability: <capability or NOT_APPLICABLE>
Dependency class: <class>
Blocks local execution: <YES|NO>
Blocks local closure: <YES|NO>
Blocks ticket done: <YES|NO>
Blocks integrated proof: <YES|NO>
Blocks SPEC final conformance: <YES|NO>
Dependency class reclassification required: <YES|NO>
Upstream dependency classification preserved: <YES|NO>
Downstream checkpoint/owner: <checkpoint> / <owner>
~~~

End the canonical artifact with exactly one machine-readable routing field:

```text
NEXT_AUTHORIZED_OPERATION: checkpoint-implemented-ticket
POST_CHECKPOINT_OPERATION: remediate-implemented-ticket
```

or the corresponding authorized values from the shared routing contract. Do
not list specialist findings as separate remediation instructions.
