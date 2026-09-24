---
name: checkpoint-component-implementation-plan-audit
description: Create a guarded local checkpoint for a conformant component Implementation Plan and its audit before plan remediation.
metadata:
  short-description: Preserve Implementation Plan audit baseline before remediation
---

# Checkpoint Component Implementation Plan Audit

Read `../_shared/phase-checkpoint-contract.md` completely before acting.
Use only after `audit-component-implementation-plan` completes. Preserve the
exact plan/audit baseline and do not alter planning authority in this operation.

## Allowlist and preconditions

Require a complete current plan audit, actionable reassessment when findings
exist, and no production/test changes. For `SPEC-EXEC-001`:

```text
docs/specs/implementation-plans/SPEC-EXEC-001-implementation-plan.md
docs/specs/implementation-plans/audits/SPEC-EXEC-001-implementation-plan-audit.md
docs/workflow-checkpoints/SPEC-EXEC-001-component-implementation-plan-audit.md
```

Reject ADRs, portfolio, SPECs, Gap Matrix, tickets, code, tests, runtime,
mirrors, and unrelated paths. Verify all dirty paths before staging.

## Protocol and completion

Capture parent; verify audit verdict, basis and routing; run required validation
and whitespace checks; write the marker; stage only the allowlist; run cached
checks; create exactly:

```text
checkpoint(SPEC-EXEC-001): preserve component Implementation Plan audit baseline
```

Verify the exact parent and do not remediate or re-audit. Return:

```text
CHECKPOINT_COMPLETE
PHASE_CHECKPOINT_COMPLETE
COMPONENT_IMPLEMENTATION_PLAN_AUDIT_CHECKPOINT_COMPLETE
NEXT_AUTHORIZED_OPERATION = remediate-component-implementation-plan
```

Any failure returns `COMPONENT_IMPLEMENTATION_PLAN_AUDIT_CHECKPOINT_BLOCKED`
and creates no commit.
