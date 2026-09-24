# Baseline Drift and Remediation Contract

Shared contract for every audit that can hand findings to a remediation skill.
It separates the fact that a baseline changed from the question of whether the
change was assessed sufficiently to remediate. A drift finding is not, by
itself, a remediation blocker.

## Canonical states

Every applicable audit report MUST emit these fields:

```text
BASELINE_DRIFT_STATUS = NO_DRIFT | DRIFT_UNASSESSED | DRIFT_ASSESSED
BASELINE_REMEDIATION_READINESS = READY | BLOCKED_INSUFFICIENT_REASSESSMENT
REASSESSMENT_COMPLETE = YES | NO
FINDINGS_ARE_ACTIONABLE = YES | NO
AUDIT_BASIS_FINGERPRINT
AUDIT_BASIS_STALE = YES | NO
```

Use `NO_DRIFT` only when the current authority, source/repository baseline and
relevant evidence equal the audited baseline. Use `DRIFT_UNASSESSED` when any
required comparison or evidence is unavailable, indeterminate, or incomplete.
Use `DRIFT_ASSESSED` only after the complete proof below is persisted.

The derived gate is:

```text
NO_DRIFT
  => REASSESSMENT_COMPLETE = YES
  AND BASELINE_REMEDIATION_READINESS = READY

DRIFT_UNASSESSED
  => REASSESSMENT_COMPLETE = NO
  AND BASELINE_REMEDIATION_READINESS = BLOCKED_INSUFFICIENT_REASSESSMENT

DRIFT_ASSESSED
  AND REASSESSMENT_COMPLETE = YES
  AND FINDINGS_ARE_ACTIONABLE = YES
  => BASELINE_REMEDIATION_READINESS = READY
  AND REMEDIATION_ENTRY_STATE = READY_FOR_BASELINE_RECONCILIATION_REMEDIATION
```

When assessed findings are not actionable, the report routes to the normal
non-remediation outcome; it must not invent a baseline blocker. A blocked audit,
missing authority, or indeterminate source state is `DRIFT_UNASSESSED` when
drift is present and remains a blocker for remediation.

## Baseline reassessment proof

When any material authority, source, repository, or evidence drift is found,
the audit MUST persist this complete record. Empty, unknown, or merely inherited
fields do not prove completion:

```text
BASELINE_REASSESSMENT_PROOF

OLD_AUTHORITY_BASELINE
CURRENT_AUTHORITY_BASELINE

OLD_REPOSITORY_BASELINE
CURRENT_REPOSITORY_BASELINE

AUTHORITY_DRIFT_CLASSIFICATION
REPOSITORY_DRIFT_CLASSIFICATION

REQUIREMENTS_PRESERVED
REQUIREMENTS_ADDED
REQUIREMENTS_REMOVED

GAPS_PRESERVED
GAPS_RECLASSIFIED
GAPS_OBSOLETE
GAPS_NEWLY_REQUIRED

DEPENDENCY_RECORDS_PRESERVED
DEPENDENCY_RECORDS_ADDED
DEPENDENCY_RECORDS_RECLASSIFIED

EVIDENCE_STALE
EVIDENCE_CURRENT

METRICS_BEFORE
METRICS_AFTER

REMEDIATION_SCOPE
REVALIDATION_CRITERIA

REASSESSMENT_COMPLETE = YES | NO
```

The proof MUST identify the exact authority revisions/digests and repository
commit or content fingerprint used for `CURRENT_*`. It MUST explain preserved,
obsolete, reclassified, and newly required records, including capability
availability records. The audit MUST preserve the originally audited baseline
as `OLD_*`; reassessment adopts `CURRENT_*` only as an explicit new basis.

## Remediator gate and stale-after-audit protection

Every remediator MUST read the persisted proof before editing and compare the
live authority, source state, relevant evidence, and repository fingerprint to
`CURRENT_*` and `AUDIT_BASIS_FINGERPRINT`.

```text
IF BASELINE_DRIFT_STATUS = DRIFT_UNASSESSED
   OR REASSESSMENT_COMPLETE = NO
THEN
  BASELINE_REMEDIATION_READINESS = BLOCKED_INSUFFICIENT_REASSESSMENT
  BLOCK remediation for baseline

IF BASELINE_DRIFT_STATUS = DRIFT_ASSESSED
   AND REASSESSMENT_COMPLETE = YES
   AND live fingerprint = AUDIT_BASIS_FINGERPRINT
   AND FINDINGS_ARE_ACTIONABLE = YES
THEN
  BASELINE_REMEDIATION_READINESS = READY
  consume the reassessment as the remediation authority

IF live fingerprint != AUDIT_BASIS_FINGERPRINT
THEN
  AUDIT_BASIS_STALE = YES
  BASELINE_REMEDIATION_READINESS = BLOCKED_INSUFFICIENT_REASSESSMENT
  block with STALE_AUDIT_BASIS
```

The last rule applies even when the report says
`REASSESSMENT_COMPLETE = YES`. A complete reassessment authorizes only the
exact current baseline it fingerprinted. It never silently replaces the old
baseline, changes accepted authority, or authorizes indefinite reuse.

### Interrupted remediation candidate exception

During recovery from an external interruption, the live semantic fingerprint
may differ from `AUDIT_BASIS_FINGERPRINT` because the owning remediation skill
has already changed an authorized target before failing. That difference is a
candidate overlay, not automatic stale-audit drift, only when all of these are
true:

```text
SOURCE_AUDIT_UNMODIFIED = YES
ACCEPTED_AUTHORITY_UNMODIFIED = YES
DIRTY_PATHS_SUBSET_OF_REMEDIATION_WRITE_BOUNDARY = YES
NO_UNAUTHORIZED_PRODUCTION_OR_TEST_CHANGE = YES
REMEDIATION_RECOVERY_MODE = RESUME_OR_RECONCILE
```

The remediator MUST record both `AUDIT_BASIS_FINGERPRINT` and
`REMEDIATION_CANDIDATE_FINGERPRINT`, classify the candidate as partial or
unverified, and revalidate every finding. It MUST NOT promote the candidate
fingerprint to a new audit basis or use it to skip independent re-audit. A
change to the source audit, accepted authority, upstream contract, or any path
outside the remediation write boundary remains `STALE_AUDIT_BASIS` or an exact
scope blocker.

For assessed drift, the remediator records the old and current baselines,
reconciles affected records, preserves obsolete/history status, updates
evidence and metrics, and emits the normal independent re-audit gate.

## Audit verdict to remediation entry matrix

The verdict remains the audit's classification; the readiness fields determine
whether its findings are consumable:

| Audit result | Proof/readiness | Valid remediation entry |
| --- | --- | --- |
| `BASELINE_DRIFT_REQUIRES_REASSESSMENT` | `DRIFT_ASSESSED`, complete, actionable, live basis equal | `READY_FOR_BASELINE_RECONCILIATION_REMEDIATION` |
| `BASELINE_DRIFT_REQUIRES_REASSESSMENT` | `DRIFT_UNASSESSED` or incomplete | `BLOCKED_INSUFFICIENT_REASSESSMENT` |
| Any ordinary `*_REMEDIATION_REQUIRED` verdict | `NO_DRIFT`, valid live basis | its normal remediation entry |
| Any ordinary `*_REMEDIATION_REQUIRED` verdict | `DRIFT_ASSESSED`, complete, actionable, live basis equal | its normal entry plus baseline reconciliation |
| Any remediation verdict | live basis differs from the persisted audit fingerprint | `BLOCKED_INSUFFICIENT_REASSESSMENT` with `STALE_AUDIT_BASIS` |
| Any audit-blocked verdict or missing/indeterminate authority | incomplete proof | `BLOCKED_INSUFFICIENT_REASSESSMENT` or the more specific authority blocker |

The concrete mapping is:

| Audit skill | Remediation skill | Valid assessed-drift entry |
| --- | --- | --- |
| `audit-spec-portfolio-decomposition` | `remediate-spec-portfolio-decomposition` | `PORTFOLIO_REMEDIATION_REQUIRED` + baseline reconciliation |
| `audit-component-spec-conformance` | `remediate-component-spec` | `COMPONENT_SPEC_REMEDIATION_ALLOWED` + baseline reconciliation |
| `audit-component-implementation-gap-matrix` | `remediate-component-implementation-gap-matrix` | `READY_FOR_BASELINE_RECONCILIATION_REMEDIATION` |
| `audit-component-implementation-plan` | `remediate-component-implementation-plan` | `IMPLEMENTATION_PLAN_REMEDIATION_ALLOWED` + baseline reconciliation |
| `audit-component-implementation-tickets` | `remediate-component-implementation-tickets` | `COMPONENT_IMPLEMENTATION_TICKET_REMEDIATION_ALLOWED` + baseline reconciliation |
| `audit-implemented-ticket` / `consolidate-implementation-audit` | `remediate-implemented-ticket` | `IMPLEMENTATION_REMEDIATION_ALLOWED` + baseline reconciliation |

`audit-implementation-design-conformance` is a specialist audit and has no
independent remediation entry; its findings are consumed by the canonical
implemented-ticket audit/consolidation route. `design-ticket-implementation`
is a design producer, not a remediation skill, so it has no direct entry.

## Deadlock invariant

```text
NO_AUDIT_REMEDIATION_DEADLOCK = TRUE

FOR_EACH_REMEDIABLE_AUDIT_VERDICT:
  EXISTS_VALID_REMEDIATION_ENTRY_STATE = YES
```

The only baseline reasons that block a remediator are inability to complete the
proof (`DRIFT_UNASSESSED` / `REASSESSMENT_COMPLETE = NO`) or a new divergence
after the audit (`STALE_AUDIT_BASIS`). Existing drift with complete actionable
proof is remediation input.
