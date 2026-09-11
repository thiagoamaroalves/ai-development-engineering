# SPEC-DOM-001 — Implementation Plan Remediation

## 1. Remediation Verdict

```text
COMPONENT_IMPLEMENTATION_PLAN_REMEDIATION_COMPLETE
READY_FOR_INDEPENDENT_IMPLEMENTATION_PLAN_REAUDIT
```

This remediation corrects the confirmed structural blocker
`T002-AUTHORITY-READER-001`. It does not approve the Plan; the independent
plan re-audit remains mandatory.

## 2. Remediation Mode

```text
WRITE_ALLOWED / AUDIT_DRIVEN / FINDING_DRIVEN / MINIMAL_CHANGE
ADR_FIRST / PORTFOLIO_GOVERNED / SPEC_PRESERVING / GAP_MATRIX_PRESERVING
OWNERSHIP_PRESERVING / DEPENDENCY_PRESERVING / LOCAL_CLOSURE_AWARE
PROOF_OWNERSHIP_AWARE / DAG_AWARE / ISSUE_DECOMPOSITION_AWARE
NO_ARCHITECTURE_INVENTION / NO_SCOPE_EXPANSION / NO_IMPLEMENTATION
NO_TICKET_CREATION / NO_SELF_APPROVAL
```

## 3. Subject

| Item | Value |
| --- | --- |
| SPEC | `SPEC-DOM-001` |
| Portfolio | `SPEC-PORTFOLIO-001` |
| Implementation Plan | `docs/specs/implementation-plans/SPEC-DOM-001-implementation-plan.md` |
| Source audit | `docs/specs/implementation-plans/audits/SPEC-DOM-001-implementation-plan-audit.md` |
| Source audit recorded verdict | `IMPLEMENTATION_PLAN_AUDIT_BLOCKED` with active CIPA-MAJOR-001 and CIPA-MAJOR-002 |
| Remediation trigger | latest independent Implementation Plan audit findings |

The latest audit is the actionable plan-local finding input. CIPA-INFO-001 is
non-blocking and is outside this requested two-finding remediation scope.

## 4. Source Audit

```text
SOURCE_AUDIT_VERDICT = IMPLEMENTATION_PLAN_AUDIT_BLOCKED
ACTIVE_FINDINGS = CIPA-MAJOR-001, CIPA-MAJOR-002
NON_BLOCKING_FINDING_EXCLUDED = CIPA-INFO-001
FINDING_SOURCE = docs/specs/implementation-plans/audits/SPEC-DOM-001-implementation-plan-audit.md
FINDING_STATUS = confirmed, plan-remediable
ROOT_CAUSE = IMPLEMENTATION_PLAN
```

## 5. Baseline Validation

The accepted ADR authority, approved portfolio, conformant component SPEC,
conformant Gap Matrix, Gap identities, ownership, and normative dependency
direction were rechecked. No authority artifact changed. The current T002
design evidence confirms a localized producer/consumer and closure defect in
the Plan.

```text
PORTFOLIO_BASELINE = revision 2; SHA-256 C449388972279D8ADD520564A9614CFA236F87B6C8932A70D5BC2D28EEF6BE86
COMPONENT_SPEC_BASELINE = revision 4; SHA-256 CB4A21924D9619B8349D6CC239D7998633C402D7EA3D7461C2D4D8498F9A014C
GAP_MATRIX_BASELINE = SHA-256 8D8401903F5558C129FCB516F699D7DB40DDFCBF83D52B136AE22CA95976675C
AUDIT_HEAD = baa2a189bd71b85ba9fcc62840e52f091fc2e77e
CURRENT_HEAD = cc4aa3b0ed31e03e0c0ef644944564d9d5f644b7
WORKING_TREE_STATE = dirty; current ticket/code/test changes preserved and not modified
BASELINE_DRIFT_STATUS = DRIFT_ASSESSED
REASSESSMENT_COMPLETE = YES
FINDINGS_ARE_ACTIONABLE = YES
BASELINE_REMEDIATION_READINESS = READY
AUDIT_BASIS_STALE = NO for the adopted plan-relevant reassessment basis
```

### Baseline reassessment proof

```text
OLD_AUTHORITY_BASELINE = ADR-0001/0002/0009 revision 3; portfolio revision 2; SPEC revision 4; validated Matrix 8D840190
CURRENT_AUTHORITY_BASELINE = unchanged from OLD_AUTHORITY_BASELINE
OLD_REPOSITORY_BASELINE = plan audit HEAD baa2a189 and plan-local closure claims
CURRENT_REPOSITORY_BASELINE = HEAD cc4aa3b with T002 design evidence identifying the missing producer handoff
AUTHORITY_DRIFT_CLASSIFICATION = NONE
REPOSITORY_DRIFT_CLASSIFICATION = LOCALIZED_PLAN_RELEVANT_EVIDENCE_DRIFT
REQUIREMENTS_PRESERVED = 21
REQUIREMENTS_ADDED = 0
REQUIREMENTS_REMOVED = 0
GAPS_PRESERVED = 21 live gaps; GAP-005 remains owned by DOM-IMP-02
GAPS_RECLASSIFIED = none
GAPS_OBSOLETE = GAP-002 remains historical only
GAPS_NEWLY_REQUIRED = 0
DEPENDENCY_RECORDS_PRESERVED = all approved cross-SPEC records
DEPENDENCY_RECORDS_ADDED = one internal DOM producer/consumer contract record
DEPENDENCY_RECORDS_RECLASSIFIED = DOM-IMP-02/DOM-IMP-03 internal edge direction
EVIDENCE_STALE = prior claim that T002 was locally closable without its producer
EVIDENCE_CURRENT = T002 design blocker and current authority-reader responsibility assessment
REMEDIATION_SCOPE = plan-local units, contracts, closure, witnesses, DAG, waves, metrics, and downstream handoff report
REVALIDATION_CRITERIA = producer-before-consumer, no caller authority, independent re-observation, zero DAG cycles, no local closure without producer
```

## 6. Authority Context

The SPEC and portfolio make DOM the canonical owner of ADR identity, lifecycle,
revision, eligibility, and immutable history. DOM-IMP-03 already owns the
lifecycle/revision/immutability authority boundary. The minimum reader needed
by T002 is therefore part of that same authority boundary, not a new canonical
store or an external capability.

The Plan selects decomposition A:

```text
SELECTED_DECOMPOSITION = A — existing DOM-IMP-03 authority producer → DOM-IMP-02 consumer
AUTHORITY_PRODUCER_UNIT = DOM-IMP-03
T002_DEPENDENCY = DOM-IMP-01, DOM-IMP-03
T003_DEPENDENCY = DOM-IMP-01
DOM-IMP-03 → DOM-IMP-02
```

The reader returns canonical ADR reference, lifecycle/status, revision, content
hash, and an independently re-observable basis. T002 consumes those observations
for eligibility and snapshot locking. Caller, snapshot, PLAT, REPO, fixture,
mock, and prototype values remain forbidden as authority.

## 7. Finding Intake

| Finding | Validation | Root cause category | Result |
| --- | --- | --- | --- |
| `CIPA-MAJOR-001` | CONFIRMED | `ISSUE_DECOMPOSITION_READINESS`, `BASELINE_METADATA` | REMEDIATED |
| `CIPA-MAJOR-002` | CONFIRMED | `NORMATIVE_DEPENDENCY`, `LOCAL_CLOSURE`, `AUTHORITY_CONSUMPTION`, `METRICS` | REMEDIATED |

## 8. Finding Remediation Ledger

| Finding | Plan-only correction | Evidence | State |
| --- | --- | --- | --- |
| `CIPA-MAJOR-001` | Set the exact audit-entry gate to `IMPLEMENTATION_PLAN_GATE: READY_FOR_IMPLEMENTATION_PLAN_AUDIT`; preserved non-conformant/non-issue-decomposition status | Plan §24; audit §32 finding | REMEDIATED |
| `CIPA-MAJOR-002` | Replaced the invalid compound class with `REQUIRED_FOR_LOCAL_EXECUTION`; added all capability dimensions, staged availability, explicit evidence IDs, closure/readiness/witness/producer-consumer/metrics/ticket-handoff reconciliation | Plan §12.2, §19, §20; audit §32 finding | REMEDIATED |

## 9. Gap Coverage Changes

No validated Gap changed identity, classification, severity, exact delta, or
approved owner. `GAP-005` remains covered by DOM-IMP-02. DOM-IMP-03 receives
supporting producer work required for that consumer contract; this is not new
Gap coverage and does not transfer GAP-005 ownership.

```text
GAPS_WITHOUT_PLAN_COVERAGE = 0
UNITS_WITHOUT_GAP_OR_SUPPORTING_AUTHORITY = 0
```

## 10. Ownership / Dependency Changes

```text
AUTHORITY_PRODUCER_UNIT = DOM-IMP-03
T002_CONSUMER_UNIT = DOM-IMP-02
PRODUCER_BEFORE_CONSUMER = YES
CALLER_SUPPLIED_AUTHORITY = FORBIDDEN
SECOND_INDEPENDENT_OBSERVATION_SUPPORTED = YES
UNAPPROVED_NORMATIVE_DEPENDENCIES = 0
CROSS_SPEC_DEPENDENCY_CHANGES = 0
INTERNAL_PRODUCER_CONTRACTS = 1
```

DOM-IMP-03 owns lifecycle/status, canonical ADR reference, revision, content
hash, and the independent temporal re-observation capability. DOM-IMP-02 owns
manual entry, eligibility decision, snapshot construction, exact basis binding,
and fail-closed consumer behavior. No lifecycle authority moved to T002.

## 11. Unit Boundary Changes

No new Implementation Unit was created. No unit was merged or split. The
existing DOM-IMP-03 boundary is broadened only by the supporting authority
reader contract that is necessary to make its already-owned lifecycle authority
consumable by DOM-IMP-02.

```text
NEW_UNITS = none
UNITS_CHANGED = 2
UNIT_BOUNDARY_CHANGES = 0
FALSE_UNIT_SPLITS = 0
FALSE_UNIT_MERGES = 0
```

## 12. Local Acceptance / Closure Changes

T002 remains `ISSUE_READY`, but its local closure is conditional on completed
DOM-IMP-03 authority production. T003 remains independently locally closable
without T002.

```text
T002_LOCAL_CLOSURE_WITHOUT_AUTHORITY_PRODUCER = NO
LOCAL_CLOSURE_CHANGES = 2
LOCAL_AC_REQUIRING_DOWNSTREAM = 0
LOCAL_AC_CONTRADICTING_DOES_NOT_IMPLEMENT = 0
LOCAL_AC_REQUIRING_UNAVAILABLE_FOREIGN_CAPABILITY = 0
WITNESSES_NOT_EXECUTABLE_AT_LOCAL_CLOSURE = 0
```

## 13. Issue Decomposition Readiness Changes

```text
DOM-IMP-03 = ISSUE_READY; INITIAL_DAG_STATE = BLOCKED by DOM-IMP-01
DOM-IMP-02 = ISSUE_READY; INITIAL_DAG_STATE = BLOCKED by DOM-IMP-01 and DOM-IMP-03
ISSUE_READINESS_CHANGES = 0 unit-level; readiness remains distinct from DAG state
```

The Plan is not marked `READY_FOR_ISSUE_DECOMPOSITION`; the required next gate
is independent plan re-audit.

## 14. Initial DAG State Changes

The state labels remain `READY`/`BLOCKED` as previously classified, but the
semantic blocker identities and edge direction are corrected.

```text
INITIAL_DAG_STATE_CHANGES = 0 labels; 2 blocker/dependency records reconciled
INITIAL_READY_UNITS = 1
INITIAL_BLOCKED_UNITS = 11
DAG_CYCLE_DETECTED = NO
```

## 15. Acceptance / Final Proof Ownership Changes

AC-DOM-003 and AC-DOM-004 now explicitly list DOM-IMP-03 as a producer
contributor and retain DOM-IMP-02 as the sole local/final proof owner. No
acceptance obligation was deleted or moved downstream.

```text
ACCEPTANCE_ALLOCATION_CHANGES = 2 producer-witness dependencies
FINAL_PROOF_OWNER_CHANGES = 0
ACCEPTANCE_OBLIGATIONS = 21
ACCEPTANCE_WITH_FINAL_PROOF_OWNER = 21
UNRESOLVED_FINAL_PROOF_OWNERS = 0
```

## 16. Test / Completion Evidence Changes

DOM-IMP-03 now produces local authority-reader evidence for canonical reference,
status, revision, content hash, and independent second observation. DOM-IMP-02
retains local consumer evidence for caller-authority rejection, accepted-only
eligibility, snapshot freeze, drift rejection, and rehydration. Physical PLAT
durability remains integration evidence and is not promoted to authority.

```text
LOCAL_AC_REQUIRING_UNAVAILABLE_FOREIGN_CAPABILITY = 0
LOCAL_CLOSURE_WITH_UNAVAILABLE_REQUIRED_CAPABILITY = 0
DOWNSTREAM_PROMOTION_WITHOUT_NEW_EVIDENCE = 0
```

## 17. Failure / Compatibility / Cutover Changes

Caller-supplied lifecycle/status/hash is rejected. There is no fallback, local
lifecycle store, duplicate canonical authority, or snapshot authority. Legacy
records remain evidence only; the canonical reader is produced by DOM-IMP-03
and consumed by DOM-IMP-02 before snapshot confirmation.

## 18. DAG / Wave / Checkpoint Changes

### Before

```text
DOM-IMP-01 → DOM-IMP-02 → DOM-IMP-03
```

### After

```text
DOM-IMP-01 → DOM-IMP-03 → DOM-IMP-02
```

The corrected waves are:

```text
Wave 1: DOM-IMP-01
Wave 2: DOM-IMP-03, DOM-IMP-04
Wave 3: DOM-IMP-02, DOM-IMP-05
```

CP-DOM-01 now observes `IMP-01, IMP-03, IMP-02` in producer-before-consumer
order. The remaining DAG, checkpoints, and final proof ownership remain
acyclic and unchanged in meaning.

```text
DAG_CYCLES = 0
```

## 19. Traceability Reconciliation

| Concern | Producer | Consumer | Owner / proof |
| --- | --- | --- | --- |
| ADR canonical reference | DOM-IMP-03 | DOM-IMP-02 | DOM-IMP-03 authority; T002 consumes |
| Lifecycle/status | DOM-IMP-03 | DOM-IMP-02 | DOM-IMP-03 authority; T002 eligibility |
| Revision/content hash | DOM-IMP-03 | DOM-IMP-02 | DOM-IMP-03 authority; T002 snapshot basis |
| Independent temporal re-observation | DOM-IMP-03 | DOM-IMP-02 | DOM-IMP-03 observation; T002 drift decision |
| GAP-005 | supporting producer DOM-IMP-03 | DOM-IMP-02 | DOM-IMP-02 remains Gap owner |

## 20. Metric Recalculation

```text
VALIDATED_GAPS = 21
LOCAL_IMPLEMENTATION_GAPS = 12
IMPLEMENTATION_UNITS = 12
LOCALLY_CLOSABLE_UNITS = 12
NON_LOCALLY_CLOSABLE_UNITS = 0
ISSUE_DECOMPOSITION_READY_UNITS = 12
INTERNAL_ONLY_UNITS = 0
PLAN_BLOCKED_UNITS = 0
INITIAL_READY_UNITS = 1
INITIAL_BLOCKED_UNITS = 11
GAPS_WITH_PLAN_COVERAGE = 21
GAPS_WITHOUT_PLAN_COVERAGE = 0
UNITS_WITHOUT_GAP_OR_SUPPORTING_AUTHORITY = 0
FALSE_UNIT_SPLITS = 0
FALSE_UNIT_MERGES = 0
ACCEPTANCE_OBLIGATIONS = 21
ACCEPTANCE_WITH_FINAL_PROOF_OWNER = 21
UNRESOLVED_FINAL_PROOF_OWNERS = 0
LOCAL_AC_REQUIRING_DOWNSTREAM = 0
LOCAL_AC_CONTRADICTING_DOES_NOT_IMPLEMENT = 0
LOCAL_AC_REQUIRING_UNAVAILABLE_FOREIGN_CAPABILITY = 0
UNAPPROVED_NORMATIVE_DEPENDENCIES = 0
SPECIFICATION_GAPS = 0
ARCHITECTURE_GAPS = 0
PORTFOLIO_GAPS = 0
UPSTREAM_CONTRACT_GAPS = 0
CAPABILITY_AVAILABILITY_RECORDS = 3 foreign integrated-proof records
INTERNAL_CAPABILITY_CONTRACTS = 1
PRODUCER_BEFORE_CONSUMER = YES
CALLER_SUPPLIED_AUTHORITY = FORBIDDEN
SECOND_INDEPENDENT_OBSERVATION_SUPPORTED = YES
T002_LOCAL_CLOSURE_WITHOUT_AUTHORITY_PRODUCER = NO
DAG_CYCLE_DETECTED = NO
```

## 21. Upstream Escalations

```text
SPEC_REMEDIATION_REQUIRED = NO
ADR_CLARIFICATION_REQUIRED = NO
PORTFOLIO_REMEDIATION_REQUIRED = NO
PORTFOLIO_DEPENDENCY_CHANGE_REQUIRED = NO
UPSTREAM_SPEC_REMEDIATION_REQUIRED = NO
GAP_MATRIX_REVALIDATION_REQUIRED = NO
UPSTREAM_ESCALATIONS = NONE
```

## 22. Files Changed

```text
docs/specs/implementation-plans/SPEC-DOM-001-implementation-plan.md
docs/specs/implementation-plans/remediations/SPEC-DOM-001-implementation-plan-remediation.md
```

No tickets, code, tests, ADRs, portfolio, SPEC, Gap Matrix, or prior audit were
modified.

## 23. Reaudit Readiness

```text
READY_FOR_INDEPENDENT_IMPLEMENTATION_PLAN_REAUDIT
```

### Downstream ticket impact

These artifacts are not modified by this remediation:

```text
TICKETS_REQUIRING_REMEDIATION = DOM-001-TICKET-002, DOM-001-TICKET-003
TICKETS_REQUIRING_REGENERATION = DOM-001-TICKET-001 edge projection,
                                 DOM-001-TICKET-002, DOM-001-TICKET-003,
                                 DOM-001-TICKET-010 dependency projection,
                                 DOM-001-TICKET-012 dependency projection,
                                 ticket index/README/audit derived from the Plan
```

Required downstream corrections are: T002 must depend on T003 and consume its
authority contract; T003 must no longer depend on T002 and must expose the
producer contract; T001/T010/T012 and derived indexes must reconcile their
dependency projections after ticket regeneration. No ticket is ready for
implementation approval until regenerated and independently audited.

### Change-boundary proof

```text
ADRS_CHANGED = NO
PORTFOLIO_CHANGED = NO
COMPONENT_SPEC_CHANGED = NO
UPSTREAM_SPECS_CHANGED = NO
GAP_MATRIX_CHANGED = NO
PRODUCTION_CODE_CHANGED = NO
TESTS_CHANGED = NO
TICKETS_CHANGED = NO
```

### Final remediation metrics

```text
FINDINGS_RECEIVED = 2
FINDINGS_CONFIRMED = 2
FINDINGS_REMEDIATED = 2
FINDINGS_ALREADY_REMEDIATED = 0
FINDINGS_REJECTED_BY_VALID_EVIDENCE = 0
FINDINGS_PARTIAL = 0
FINDINGS_BLOCKED = 0
UNITS_CHANGED = 2
UNIT_BOUNDARY_CHANGES = 0
LOCAL_CLOSURE_CHANGES = 2
ISSUE_READINESS_CHANGES = 0
INITIAL_DAG_STATE_CHANGES = 0 labels; 2 blocker records reconciled
CROSS_SPEC_DEPENDENCY_CHANGES = 0
ACCEPTANCE_ALLOCATION_CHANGES = 2 producer-witness dependencies
FINAL_PROOF_OWNER_CHANGES = 0
FALSE_UNIT_SPLITS = 0
FALSE_UNIT_MERGES = 0
UNCOVERED_LOCAL_GAPS = 0
UNRESOLVED_FINAL_PROOF_OWNERS = 0
LOCAL_AC_REQUIRING_DOWNSTREAM = 0
LOCAL_AC_CONTRADICTING_DOES_NOT_IMPLEMENT = 0
LOCAL_AC_REQUIRING_UNAVAILABLE_FOREIGN_CAPABILITY = 0
UNAPPROVED_NORMATIVE_DEPENDENCIES = 0
DAG_CYCLE_DETECTED = NO
SPECIFICATION_GAPS = 0
ARCHITECTURE_GAPS = 0
PORTFOLIO_GAPS = 0
UPSTREAM_CONTRACT_GAPS = 0
```

## 24. Current Two-Finding Closure

```text
CIPA_MAJOR_001 = RESOLVED
CIPA_MAJOR_002 = RESOLVED
IMPLEMENTATION_PLAN_GATE = READY_FOR_IMPLEMENTATION_PLAN_AUDIT
CAPABILITY_ID = CAP-DOM-ADR-AUTHORITY-READ-OBSERVATION
CAPABILITY_DEPENDENCY_CLASS = REQUIRED_FOR_LOCAL_EXECUTION
PRODUCER = DOM-IMP-03
CONSUMER = DOM-IMP-02
PRODUCER_BEFORE_CONSUMER = YES
CALLER_SUPPLIED_AUTHORITY = FORBIDDEN
SECOND_INDEPENDENT_OBSERVATION_SUPPORTED = YES
PRODUCTIVE_AVAILABILITY_BEFORE_PRODUCER = NO
PRODUCTIVE_AVAILABILITY_AFTER_PRODUCER = CONDITIONAL_YES
PRODUCTIVE_AVAILABILITY_AFTER_PRODUCER_EVIDENCE = EV-DOM-IMP-03-AUTHORITY-READER-COMPLETE; PCP-DOM-03→02; TAP-03; CP-DOM-01
T002_EXECUTION_BLOCKED_BEFORE_PRODUCER = YES
T002_LOCAL_CLOSURE_WITHOUT_AUTHORITY_PRODUCER = NO
DAG = DOM-IMP-01 → DOM-IMP-03 → DOM-IMP-02
DAG_CYCLES = 0
READY_FOR_INDEPENDENT_PLAN_AUDIT = YES
```

The Plan is not marked conformant and does not emit
`READY_FOR_ISSUE_DECOMPOSITION`; the next step is a fresh independent audit.
