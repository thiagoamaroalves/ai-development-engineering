---
name: audit-implemented-ticket
description: >
  Orchestrate the complete independent audit of one implemented ticket in
  VALIDATION_REQUIRED. Determine the required audit profile, pin one semantic
  implementation state, dispatch independent specialist audits for ticket
  conformance, implementation behavior, implementation-design conformance, and
  architecture boundaries where applicable, require complete specialist
  execution against the same implementation state, consolidate all specialist
  evidence into one canonical implementation audit, preserve finding lineage
  across re-audits, and return the authoritative ticket implementation verdict.
  This skill is an audit orchestrator only. It does not perform specialist
  auditing itself, remediate defects, modify production code or tests, redesign
  the implementation, modify upstream authority, transition the ticket to DONE,
  merge, commit, or publish.
---

# Audit Implemented Ticket

## Purpose

Orchestrate the complete independent audit protocol for an implemented ticket.

```text
IMPLEMENTED TICKET
        ↓
VALIDATION_REQUIRED
        ↓
Determine Audit Profile
        ├─ audit-ticket-conformance
        ├─ audit-implementation-behavior
        ├─ audit-implementation-design-conformance
        └─ audit-architecture-boundaries (when REQUIRED)
        ↓
consolidate-implementation-audit
        ↓
TICKET_IMPLEMENTATION_CONFORMANT
or TICKET_IMPLEMENTATION_REMEDIATION_REQUIRED
or TICKET_IMPLEMENTATION_AUDIT_BLOCKED
        ↓
READY_FOR_DONE or NOT_READY_FOR_DONE
```

This skill owns `AUDIT_ORCHESTRATION`.

Read `../_shared/authority-completeness-gates.md` from the workspace skill
root. The orchestrator must ensure the final specialist wave covers authority
consumption, producer/consumer availability, temporal revalidation,
caller-as-authority bypasses, alternate local authority, and invented
identity/lifecycle/provenance. It must not repair upstream gaps.

Also read `../_shared/finding-completion-readiness-contract.md`. The
orchestrator must validate that consolidation derives finding-level
`DEPENDENCY_CLASS` and all `BLOCKS_*` fields before accepting a ticket gate.
An open integrated-only finding is handed to its downstream checkpoint and does
not invalidate local DONE solely because its severity is CRITICAL or MAJOR.

Also read `../_shared/implementation-audit-routing-contract.md`. A valid
canonical remediation-required audit routes to
`remediate-implemented-ticket`; it must not be re-audited merely because the
ticket remains `VALIDATION_REQUIRED`.

It does not own specialist audit execution logic, remediation, or the DONE
transition.

## Core principles

1. Specialist auditors are independent.
2. Run required specialists in parallel when agent capacity permits.
3. All specialists inspect the same semantic implementation state.
4. No specialist individually approves the ticket.
5. The consolidator produces the canonical finding set.
6. Only canonical consolidation produces the implementation verdict.
7. A failed specialist does not stop remaining specialists.
8. Prefer complete evidence over early failure.
9. Re-audits preserve canonical finding lineage.
10. Never weaken audit rigor to reduce cycle count.
11. Design quality must be independently verified after implementation.
12. The implementation structural self-check is evidence, not authority.
13. Operational specialist failure is not specialist PASS.
14. A specialist finding is not an audit-basis failure.
15. Audit-basis invalidation is the only normal reason to stop the specialist wave early.

## Preconditions

The target ticket normally has:

```text
STATUS: VALIDATION_REQUIRED
```

or repository-equivalent `STATUS: IMPLEMENTED` with independent validation
pending.

The latest ticket-set audit must establish:

```text
IMPLEMENTATION_TICKETS_CONFORMANT
READY_FOR_IMPLEMENTATION
```

The implementation must originate from an authorized implementation workflow.

If the target status is `READY`, `BLOCKED`, or `IN_PROGRESS`, return:

```text
TICKET_IMPLEMENTATION_AUDIT_BLOCKED
reason = TICKET_NOT_IMPLEMENTED
```

If the ticket is already `DONE`, return:

```text
TICKET_IMPLEMENTATION_AUDIT_BLOCKED
reason = TICKET_ALREADY_DONE
```

unless a historical re-audit was explicitly requested.

## Phase 1 — Audit subject resolution

Read `skills/_shared/baseline-drift-remediation-contract.md`. If the
implementation/design/authority basis changed, persist the complete
reassessment proof and shared readiness fields. `remediate-implemented-ticket`
must be able to consume assessed actionable drift, while any post-audit
fingerprint change remains `STALE_AUDIT_BASIS`.

Also read `skills/_shared/audit-convergence-contract.md` and
`skills/_shared/audit-report-structure-contract.md`. Every re-audit must carry
persistence/convergence metrics, campaign references, and separate base,
round-delta, and lineage-ledger paths. A non-converging finding must be routed
to expanded-radius remediation before another narrow remediation attempt.

Identify and record:

```text
TICKET_ID
TICKET_PATH
TICKET_FOLDER
TICKET_STATUS
IMPLEMENTATION_UNIT
SPEC_PATH
GAP_MATRIX_PATH
IMPLEMENTATION_PLAN_PATH
PLAN_AUDIT_PATH
TICKET_AUDIT_PATH
IMPLEMENTATION_BASELINE
CURRENT_HEAD
BASELINE_DRIFT_STATUS
REASSESSMENT_COMPLETE
FINDINGS_ARE_ACTIONABLE
BASELINE_REMEDIATION_READINESS
AUDIT_BASIS_FINGERPRINT
```

Determine `AUDIT_ROUND` as `INITIAL_AUDIT` or `RE_AUDIT`.

For a re-audit, identify:

```text
PREVIOUS_CANONICAL_AUDIT
PREVIOUS_AUDIT_HEAD
REMEDIATION_BASELINE
REMEDIATION_HEAD
```

## Phase 2 — Upstream audit eligibility

Verify that:

- ticket traceability remains valid;
- specification authority remains valid;
- the Gap Matrix remains validated;
- the Implementation Plan remains conformant;
- the ticket set remains conformant;
- the implementation baseline remains auditable;
- no material upstream authority drift invalidates the implementation.

Also verify current `SPEC_IMPLEMENTABILITY_CHECK` and the applicable
`AGGREGATE_IDENTITY_PROOF`, `AGGREGATE_RECONSTRUCTION_PROOF`,
`AUTHORITY_CONSUMPTION_PROOF`, `PRODUCER_CONSUMER_CONTRACT_PROOF`, and
`TEMPORAL_AUTHORITY_PROOF`. Reconcile the independent
`AUTHORITY_STATUS`, `CONTRACT_STATUS`, `LOCAL_TESTABILITY`, and
`PRODUCTIVE_AVAILABILITY` dimensions plus dependency class. If authority is
undefined, record `AUTHORITY_NOT_DEFINED`; `AUTHORITY_CONSUMABLE` is valid only
when `PRODUCTIVE_AVAILABILITY = YES`. Do not let a lower dimension state be
treated as implementation authority.

Before dispatching implementation specialists, reconcile the shared handoff
records and invariants: a capability with `PRODUCTIVE_AVAILABILITY = NO` and
class `REQUIRED_FOR_LOCAL_EXECUTION` or `REQUIRED_FOR_LOCAL_CLOSURE`,
`BLOCKED_BY_UPSTREAM_CONTRACT`, or a local witness not executable at closure
invalidates any upstream READY/local-closure claim. Record the earliest
upstream gate that should have stopped the flow.
For `REQUIRED_FOR_INTEGRATED_PROOF`, preserve the unavailable capability as an
open integrated finding and do not convert it into a local ticket blocker when
local acceptance does not require productive availability.
This is a defense check and must not be the first intended detector when the
upstream artifact was determinable.

If any condition invalidates the audit basis, return
`TICKET_IMPLEMENTATION_AUDIT_BLOCKED`. Do not dispatch specialist audits against
an invalid basis.

## Phase 3 — Audit profile determination

Always require:

```text
TICKET_CONFORMANCE = REQUIRED
IMPLEMENTATION_BEHAVIOR = REQUIRED
```

Set `ARCHITECTURE_BOUNDARIES` to `REQUIRED` when ticket authority or
implementation may materially affect:

- ownership;
- canonical authority;
- foreign capability consumption;
- cross-spec integration;
- identity;
- immutability;
- lineage;
- legacy behavior;
- authority transition;
- destructive transition;
- migration;
- authorization or security boundaries.

Always require the relevant final-defense checks when implementation can read
mutable authority or cross a component boundary:

```text
CALLER_AS_AUTHORITY_CHECK
TEMPORAL_AUTHORITY_PROOF
AUTHORITY_CONSUMPTION_PROOF
PRODUCER_CONSUMER_CONTRACT_PROOF
```

When uncertain, use `ARCHITECTURE_BOUNDARIES = REQUIRED`. Record the reason for
the profile and never omit it merely to save capacity.

Record the profile as:

~~~text
AUDIT_PROFILE:
  TICKET_CONFORMANCE: REQUIRED
  IMPLEMENTATION_BEHAVIOR: REQUIRED
  IMPLEMENTATION_DESIGN_CONFORMANCE: REQUIRED
  ARCHITECTURE_BOUNDARIES: REQUIRED | NOT_REQUIRED

ARCHITECTURE_PROFILE_REASON:
<reason>
~~~

## Phase 4 — Repository state pinning

## Mandatory implementation-design specialist

The normal current workflow always requires:

~~~text
TICKET_CONFORMANCE = REQUIRED
IMPLEMENTATION_BEHAVIOR = REQUIRED
IMPLEMENTATION_DESIGN_CONFORMANCE = REQUIRED
~~~

Require an approved Implementation Design with:

~~~text
IMPLEMENTATION_DESIGN_READY
IMPLEMENTATION_DESIGN_GATE: READY_FOR_IMPLEMENTATION
~~~

If the design is missing or no longer applicable, block with:

~~~text
TICKET_IMPLEMENTATION_AUDIT_BLOCKED
reason = IMPLEMENTATION_DESIGN_REQUIRED
~~~

Do not omit the design specialist because the implementation structural
self-check passed. The self-check is implementation-produced evidence, not
independent proof.

The design specialist owns structural judgment for:

~~~text
DDD responsibility placement
aggregate boundaries
domain invariant placement
component boundaries
SOLID
dependency direction
persistence and lifecycle structural authority
anti-corruption boundaries
Clean Code structural quality
testability
design deviations
structural self-check verification
authority consumption and temporal seam preservation
~~~

The orchestrator dispatches this specialist but does not perform its logic.

The consolidated audit must retain the semantic coverage metrics from the
behavior and architecture specialists. A proxy-only witness is a finding even
when all available tests are green; the audit cannot approve by inference.

Require the consolidated evidence to retain these final-defense results:

```text
CALLER_SUPPLIED_AUTHORITY_BYPASS
TEMPORAL_AUTHORITY_GAP
AUTHORITY_CONSUMPTION_GAP
ALTERNATE_AUTHORITY_INTRODUCED
REPOSITORY_SEMANTIC_AUTHORITY
INVENTED_LIFECYCLE_OR_IDENTITY_OR_PROVENANCE
```

Establish the semantic audit target as a pair:

```text
AUDIT_TARGET_HEAD = <base commit>
AUDIT_TARGET_STATE_FINGERPRINT = <hash of base commit plus relevant working-tree overlay>
```

The implementation may be present in the base commit, the working tree, or a
combination of both. The overlay is valid only when its exact paths and content
are included in `AUDIT_TARGET_STATE_FINGERPRINT`. Audit artifacts themselves
are excluded from that fingerprint and may be written during the audit.
Workflow machinery (`.pi/`, `skills/`, and `.codex/`) is excluded from the
semantic implementation fingerprint; changes there require reload/authority
validation but do not constitute implementation drift.

Every specialist must inspect this same semantic implementation state and
record both target fields. Production or test implementation changes during
specialist auditing invalidate the shared target. Cancel or invalidate affected
results and restart all required audits against the new target state.

## Phase 5 — Specialist dispatch

Dispatch:

```text
audit-ticket-conformance
audit-implementation-behavior
audit-implementation-design-conformance
```

Also dispatch `audit-architecture-boundaries` when required by the profile.

Use independent agents and prefer `PARALLEL` execution when sufficient agent
capacity exists. If capacity is unavailable, wait according to orchestration
policy; do not collapse specialist roles into the orchestrator and do not exceed
available capacity.

## Design specialist domain

The implementation-design specialist is mandatory for every current ticket with
an approved Implementation Design. Its question is:

~~~text
Did the actual implementation preserve the approved design quality and
structural boundaries?
~~~

It independently audits DDD responsibility placement, aggregate boundaries,
domain invariants, component boundaries, SOLID, dependency direction,
persistence and lifecycle authority, cross-spec seams, Clean Code structure,
testability, recorded and undeclared design deviations, and the implementation
structural self-check. The orchestrator must not perform this specialist logic
inline.

## Phase 6 — Specialist independence

Each specialist receives the canonical ticket/upstream authority, the pinned
`AUDIT_TARGET_HEAD` plus `AUDIT_TARGET_STATE_FINGERPRINT` pair, and the inputs
required for its domain. Specialists may know the
profile, but must independently produce their own evidence and must not use
another specialist's findings as authority.

The behavior specialist owns executable checks for caller-supplied authority,
reused observations, stale external truth, and fail-closed temporal behavior.
The architecture specialist owns checks for alternate local authority,
repository semantic authority, foreign authority recomputation, and
cross-boundary producer/consumer preservation.

Use an independent audit agent/session from the implementation or remediation
agent where repository governance requires it. Prefer different specialist
agents for independent domains when capacity permits. The implementation agent
must not self-certify through a specialist role.

## Phase 7 — No early cancellation

If one specialist returns blocking findings, continue all other running required
specialists. A specialist finding is not an audit-basis failure.

The only exception is discovery of a condition proving the entire audit basis is
invalid, such as material upstream drift. In that case the orchestration may
block the audit.

## Phase 8 — Specialist completion gate

Require each specialist to return one valid domain result:

```text
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

Architecture when required:
SPECIALIST_ARCHITECTURE_PASS
SPECIALIST_ARCHITECTURE_FINDINGS
SPECIALIST_AUDIT_BLOCKED
```

Normal `PASS` and `FINDINGS` results also require:

```text
DOMAIN_AUDIT_COMPLETE = YES
```

If a specialist operationally fails, retry according to orchestration failure
policy using a new valid specialist execution. Never reinterpret operational
failure as specialist PASS.

## Phase 9 — Consolidation dispatch

After all required specialist audits complete, invoke
`consolidate-implementation-audit` with:

- ticket subject;
- audit round;
- pinned audit target;
- specialist artifacts;
- Implementation Design path and baseline;
- previous canonical audit for a re-audit;
- remediation baseline and delta references where applicable.

The consolidation result is the only canonical implementation audit for the
round.

Require one persisted artifact per required specialist, including:

~~~text
<TICKET-ID>-ticket-conformance-audit.md
<TICKET-ID>-implementation-behavior-audit.md
<TICKET-ID>-implementation-design-conformance-audit.md
<TICKET-ID>-architecture-boundaries-audit.md
~~~

The architecture artifact is required only when the recomputed profile requires
architecture coverage. Console output alone is insufficient when the specialist
contract requires a persisted artifact.

## Phase 10 — Canonical result validation

Require the consolidator to return exactly one of:

```text
TICKET_IMPLEMENTATION_CONFORMANT
TICKET_IMPLEMENTATION_REMEDIATION_REQUIRED
TICKET_IMPLEMENTATION_AUDIT_BLOCKED
```

and:

```text
TICKET_GATE: READY_FOR_DONE
TICKET_GATE: NOT_READY_FOR_DONE
```

Verify that this artifact exists:

```text
<TICKET-ID>-implementation-audit.md
```

Do not independently alter canonical findings.

Validate every canonical finding contains `DEPENDENCY_CLASS`,
`BLOCKS_LOCAL_EXECUTION`, `BLOCKS_LOCAL_CLOSURE`, `BLOCKS_TICKET_DONE`,
`BLOCKS_INTEGRATED_PROOF`, `BLOCKS_SPEC_FINAL_CONFORMANCE`, `PRIMARY_ROUTE`,
`DOWNSTREAM_CHECKPOINT`, and `DOWNSTREAM_OWNER`. Also validate
`LOCAL_CLOSURE_BLOCKING`, `DEPENDENCY_CLASS_RECLASSIFICATION_REQUIRED`, and
`UPSTREAM_DEPENDENCY_CLASSIFICATION_PRESERVED`. A downstream reclassification
requires explicit local Acceptance Criterion/Completion Evidence and route
`PLAN_OR_TICKET_REVALIDATION`; otherwise the Plan/Ticket classification is
preserved. Validate `TICKET_GATE` from the finding-level local gate, not from
severity or from the audit verdict alone.

## Phase 11 — Remediation routing

When the canonical result is `TICKET_IMPLEMENTATION_REMEDIATION_REQUIRED`, the
only authoritative remediation input is the canonical `IMA-*` finding set in
`<TICKET-ID>-implementation-audit.md`.

Do not send independent specialist finding lists as competing authorities.
Specialist artifacts remain supporting evidence referenced by canonical findings.

## Phase 12 — Local finalization routing

When the canonical audit reports `TICKET_GATE: READY_FOR_DONE`, route to the
separate finalization/state-transition workflow even if the audit verdict is
`TICKET_IMPLEMENTATION_REMEDIATION_REQUIRED` for open integrated-only
findings. Require the explicit downstream handoff before finalization.

This skill must not mark `DONE`, update downstream ticket states, commit
finalization state, merge, or push.

## Phase 13 — Re-audit routing

After remediation, rerun the entire orchestration:

```text
CONFORMANCE
+ BEHAVIOR
+ DESIGN
+ ARCHITECTURE when required by the recomputed profile
```

Do not invoke only the previously failing specialist. Remediation can affect
domains that previously passed. Specialists use current canonical authority and
implementation state, while remaining independently responsible for their
domains.

The consolidator performs previous-finding reconciliation, new-finding origin
classification, audit-escape analysis, remediation-regression analysis, and
convergence metrics.

## Phase 14 — Profile stability on re-audit

Recompute the audit profile after remediation. Architecture may become required
when remediation introduces architecture-sensitive changes. Do not reduce
specialist coverage automatically because a domain passed in an earlier round.

## Phase 15 — Convergence observation

After consolidation, record:

```text
AUDIT_ROUND
PREVIOUS_FINDINGS_TOTAL
PREVIOUS_FINDINGS_RESOLVED
PREVIOUS_FINDINGS_STILL_PRESENT
PREVIOUS_FINDINGS_REGRESSED
CONSECUTIVE_FINDING_PERSISTENCE
REMEDIATION_PROGRESS
CONVERGENCE_STATUS
NON_CONVERGENCE_REASON
EXPANDED_RADIUS_REQUIRED
NEW_PREEXISTING_FINDINGS
NEW_REMEDIATION_INTRODUCED_FINDINGS
NEWLY_APPLICABLE_FINDINGS
AUDIT_ESCAPE_COUNT
BASE_REPORT_PATH
ROUND_DELTA_PATH
FINDING_LINEAGE_LEDGER_PATH
BASE_REPORT_IMMUTABLE
ROUND_DELTA_COMPLETE
FINDING_LINEAGE_LEDGER_COMPLETE
```

These metrics are diagnostic for severity and findings, but the shared
non-convergence gate is process-authoritative: two consecutive unclosed
blocking re-audits require expanded-radius remediation.

## Parallelism rules

Preferred execution is one concurrent wave containing all required specialists.

If only two specialist agents are available:

```text
Wave 1: conformance + behavior
Wave 2: design-conformance + architecture, when required
Then: consolidate
```

If only one specialist agent is available, execute specialist roles serially.
Always preserve role separation and wait for capacity according to policy.

## Failure rules

```text
Operational specialist failure → retry according to policy
Audit-basis failure             → block the entire audit
Specialist finding              → continue other specialists
Consolidation failure           → do not remediate from unconsolidated findings
```

Exceptional recovery from consolidation failure requires explicit human
override; otherwise report the orchestration blocker.

## Required final response

Before the final response, record these orchestration metrics:

~~~text
AUDIT_ROUND
AUDIT_TARGET_HEAD
AUDIT_TARGET_STATE_FINGERPRINT

BASELINE_DRIFT_STATUS: <NO_DRIFT|DRIFT_UNASSESSED|DRIFT_ASSESSED>
REASSESSMENT_COMPLETE: <YES|NO>
FINDINGS_ARE_ACTIONABLE: <YES|NO>
BASELINE_REMEDIATION_READINESS: <READY|BLOCKED_INSUFFICIENT_REASSESSMENT>
AUDIT_BASIS_FINGERPRINT: <exact basis>
BASELINE_REASSESSMENT_PROOF: <path or inline section when drift exists>

SPECIALISTS_REQUIRED
SPECIALISTS_COMPLETED
SPECIALISTS_PASS
SPECIALISTS_FINDINGS
SPECIALISTS_BLOCKED
SPECIALISTS_OPERATIONAL_FAILURES
SPECIALISTS_RETRIED

CONFORMANCE_SOURCE_FINDINGS
BEHAVIOR_SOURCE_FINDINGS
DESIGN_SOURCE_FINDINGS
ARCHITECTURE_SOURCE_FINDINGS
SOURCE_FINDINGS_TOTAL
CANONICAL_FINDINGS_TOTAL

REQUIRED_BEHAVIORS_TOTAL
DIRECT_BEHAVIOR_WITNESSES
PROXY_ONLY_BEHAVIORS
UNTESTED_STATE_TRANSITIONS
UNPROVEN_CONCURRENCY_CONTRACTS
MISSING_ARCHITECTURE_GUARDS

PREVIOUS_FINDINGS_TOTAL
PREVIOUS_FINDINGS_RESOLVED
PREVIOUS_FINDINGS_STILL_PRESENT
PREVIOUS_FINDINGS_REGRESSED
NEW_PREEXISTING_FINDINGS
NEW_REMEDIATION_INTRODUCED_FINDINGS
NEWLY_APPLICABLE_FINDINGS
AUDIT_ESCAPE_COUNT

DESIGN_FINDINGS_PREVIOUS
DESIGN_FINDINGS_RESOLVED
DESIGN_FINDINGS_STILL_PRESENT
STRUCTURAL_REGRESSIONS
DESIGN_DEVIATION_ESCAPES

TARGET_MISMATCHES
~~~

Before consolidation, require:

~~~text
ALL_REQUIRED_SPECIALISTS_RETURNED = YES
ALL_REQUIRED_ARTIFACTS_EXIST = YES
ALL_REQUIRED_SPECIALISTS_TARGET_SAME_HEAD = YES
ALL_REQUIRED_SPECIALISTS_TARGET_SAME_STATE_FINGERPRINT = YES
CONFORMANCE_DOMAIN_COMPLETE = YES
BEHAVIOR_DOMAIN_COMPLETE = YES
DESIGN_DOMAIN_COMPLETE = YES
ARCHITECTURE_DOMAIN_COMPLETE = YES | NOT_REQUIRED
TARGET_MISMATCHES = 0
DIRECT_BEHAVIOR_WITNESSES = REQUIRED_BEHAVIORS_TOTAL
PROXY_ONLY_BEHAVIORS = 0
UNTESTED_STATE_TRANSITIONS = 0
UNPROVEN_CONCURRENCY_CONTRACTS = 0
MISSING_ARCHITECTURE_GUARDS = 0
~~~

If consolidation fails, retry according to orchestration policy. If retries are
exhausted, return TICKET_IMPLEMENTATION_AUDIT_BLOCKED with reason
CONSOLIDATION_FAILED. Do not remediate directly from unconsolidated findings.

Return:

```text
Canonical audit: <path>

Ticket:
<ticket ID/path>

Audit round: <number>

Audit target HEAD: <base commit>

Audit target state fingerprint: <hash>

Implementation Design:
<path>

Audit profile:
- Ticket conformance: REQUIRED
- Implementation behavior: REQUIRED
- Implementation design conformance: REQUIRED
- Architecture boundaries: REQUIRED | NOT_REQUIRED

Specialists required: <count>
Specialists completed: <count>
Specialists PASS: <count>
Specialists FINDINGS: <count>
Specialists BLOCKED: <count>

Conformance:
PASS | FINDINGS | BLOCKED

Behavior:
PASS | FINDINGS | BLOCKED

Design:
PASS | FINDINGS | BLOCKED

Architecture:
PASS | FINDINGS | BLOCKED | NOT_REQUIRED

Source findings: <count>

Canonical findings: <count>

Previous findings resolved: <count>

Previous findings still present: <count>

New preexisting findings: <count>

Remediation-introduced findings: <count>

Audit escapes: <count>

Convergence status: <CONVERGING|NON_CONVERGING|CLOSED|BLOCKED>
Consecutive finding persistence: <n>
Remediation progress: <NONE|PARTIAL|SUBSTANTIVE|CLOSED>
Expanded radius required: <YES|NO>

Report structure:
- Base report: <path>
- Round delta: <path>
- Finding lineage ledger: <path>

Audit verdict:
TICKET_IMPLEMENTATION_CONFORMANT
|
TICKET_IMPLEMENTATION_REMEDIATION_REQUIRED
|
TICKET_IMPLEMENTATION_AUDIT_BLOCKED

Ticket gate:
READY_FOR_DONE
|
NOT_READY_FOR_DONE

Next action:
CHECKPOINT_AUDIT
|
FINALIZE_TICKET
|
REMEDIATE_CANONICAL_FINDINGS
|
RESOLVE_AUDIT_BLOCKER
```

Do not modify implementation, tests, or ticket state.
