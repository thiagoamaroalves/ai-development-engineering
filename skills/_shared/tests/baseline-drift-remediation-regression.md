# Baseline Drift → Remediation Regression Tests

These are synthetic contract tests. `DOM-001` is a test fixture name only; no
DOM-001 specification, matrix, audit, or other production artifact is read or
modified by these tests.

## Test harness contract

For each case, the harness supplies an audit report, a live repository/authority
snapshot, and a remediator. The remediator first compares the live snapshot to
`AUDIT_BASIS_FINGERPRINT`, then evaluates the shared contract. A passing case
must assert the exact state and entry result, not only that no exception occurs.

## REG-DOM-001-ASSESSED — assessed drift is actionable

### Synthetic input

```text
MATRIX_ID = DOM-001
OLD_AUTHORITY_BASELINE = SPEC revision 3
CURRENT_AUTHORITY_BASELINE = SPEC revision 4 (conformant)
OLD_REPOSITORY_BASELINE = repository-baseline-old
CURRENT_REPOSITORY_BASELINE = repository-baseline-current
AUTHORITY_DRIFT_CLASSIFICATION = REVISION_CHANGED_AND_REASSESSED
REPOSITORY_DRIFT_CLASSIFICATION = IMPLEMENTATION_BASELINE_CHANGED_AND_REASSESSED
REQUIREMENTS_PRESERVED = 21
REQUIREMENTS_ADDED = 0
REQUIREMENTS_REMOVED = 0
GAPS_PRESERVED = 21
GAPS_RECLASSIFIED = <explicit audited set>
GAPS_OBSOLETE = GAP-002
GAPS_NEWLY_REQUIRED = <explicit audited set>
DEPENDENCY_RECORDS_PRESERVED = <explicit audited set>
DEPENDENCY_RECORDS_ADDED = 3 capability availability records
DEPENDENCY_RECORDS_RECLASSIFIED = <explicit audited set>
EVIDENCE_STALE = <old evidence explicitly listed>
EVIDENCE_CURRENT = <current repository observations explicitly listed>
METRICS_BEFORE = <persisted>
METRICS_AFTER = <recalculated>
REMEDIATION_SCOPE = <complete surgical correction scope>
REVALIDATION_CRITERIA = <complete per-finding criteria>
REASSESSMENT_COMPLETE = YES
FINDINGS_ARE_ACTIONABLE = YES
AUDIT_BASIS_FINGERPRINT = (SPEC:r4, repo:repository-baseline-current, evidence:<digest>)
AUDIT_VERDICT = BASELINE_DRIFT_REQUIRES_REASSESSMENT
LIVE_FINGERPRINT = (SPEC:r4, repo:repository-baseline-current, evidence:<digest>)
```

### Expected result

```text
BASELINE_DRIFT_STATUS = DRIFT_ASSESSED
REASSESSMENT_COMPLETE = YES
BASELINE_REMEDIATION_READINESS = READY
REMEDIATION_ENTRY_STATE = READY_FOR_BASELINE_RECONCILIATION_REMEDIATION
AUDIT_BASIS_STALE = NO
```

`remediate-component-implementation-gap-matrix` MUST enter the surgical
remediation path, consume the persisted findings, preserve the old baseline,
record the current baseline, retain `GAP-002` as obsolete/history, reconcile the
21 preserved gaps and three capability records, update evidence/metrics, and
emit `READY_FOR_INDEPENDENT_GAP_MATRIX_REAUDIT`. It MUST NOT return
`BASELINE_REASSESSMENT_REQUIRED` or block merely because the audit verdict names
drift.

## REG-STALE-AFTER-AUDIT — complete reassessment is finite

Start with the exact passing input from `REG-DOM-001-ASSESSED`, then mutate the
live state after audit:

```text
REASSESSMENT_COMPLETE = YES
AUDIT_BASIS_FINGERPRINT = (SPEC:r4, repo:repository-baseline-current, evidence:<digest>)
LIVE_FINGERPRINT = (SPEC:r4, repo:repository-baseline-after-audit, evidence:<new-digest>)
```

Expected result:

```text
AUDIT_BASIS_STALE = YES
BASELINE_REMEDIATION_READINESS = BLOCKED_INSUFFICIENT_REASSESSMENT
REMEDIATION_RESULT = BLOCKED
REASON = STALE_AUDIT_BASIS
```

The same expected block applies if SPEC revision 5 becomes authoritative,
source state becomes indeterminate, relevant evidence changes, or a capability
authority changes after the completed reassessment.

## REG-INCOMPLETE-REASSESSMENT — genuine baseline blocker

Each input below must block remediation with
`BASELINE_REMEDIATION_READINESS = BLOCKED_INSUFFICIENT_REASSESSMENT` and
`REASSESSMENT_COMPLETE = NO`:

| Input condition | Required reason |
| --- | --- |
| Audit cannot access current baseline | `BLOCKED_INSUFFICIENT_REASSESSMENT` |
| Source state is indeterminate | `BLOCKED_INSUFFICIENT_REASSESSMENT` |
| Preserved/obsolete/reclassified records are not determined | `BLOCKED_INSUFFICIENT_REASSESSMENT` |
| Required evidence is absent | `BLOCKED_INSUFFICIENT_REASSESSMENT` |
| Audit explicitly marks reassessment incomplete | `BLOCKED_INSUFFICIENT_REASSESSMENT` |

## NO_AUDIT_REMEDIATION_DEADLOCK proof

For every remediable audit result, the following entry exists. The proof is
valid only when the live basis comparison is also performed.

| Audit result | Remediation | Assessed drift entry |
| --- | --- | --- |
| `PORTFOLIO_DECOMPOSITION_REMEDIATION_REQUIRED` | `remediate-spec-portfolio-decomposition` | `PORTFOLIO_REMEDIATION_REQUIRED` + reconciliation |
| `FAIL — COMPONENT_SPEC_NON_CONFORMANT` | `remediate-component-spec` | `COMPONENT_SPEC_REMEDIATION_ALLOWED` + reconciliation |
| `GAP_MATRIX_REMEDIATION_REQUIRED` or `BASELINE_DRIFT_REQUIRES_REASSESSMENT` | `remediate-component-implementation-gap-matrix` | `READY_FOR_BASELINE_RECONCILIATION_REMEDIATION` |
| `IMPLEMENTATION_PLAN_REMEDIATION_REQUIRED` | `remediate-component-implementation-plan` | `IMPLEMENTATION_PLAN_REMEDIATION_ALLOWED` + reconciliation |
| `IMPLEMENTATION_TICKETS_REMEDIATION_REQUIRED` | `remediate-component-implementation-tickets` | `COMPONENT_IMPLEMENTATION_TICKET_REMEDIATION_ALLOWED` + reconciliation |
| `TICKET_IMPLEMENTATION_REMEDIATION_REQUIRED` | `remediate-implemented-ticket` | `IMPLEMENTATION_REMEDIATION_ALLOWED` + reconciliation |

Assertions:

```text
NO_AUDIT_REMEDIATION_DEADLOCK = TRUE
FOR_EACH_REMEDIABLE_AUDIT_VERDICT:
  EXISTS_VALID_REMEDIATION_ENTRY_STATE = YES
```
