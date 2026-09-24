---
name: checkpoint-component-gap-matrix-remediation
description: Create a guarded local checkpoint for a completed Gap Matrix remediation before independent Gap Matrix re-audit.
metadata:
  short-description: Preserve remediated Gap Matrix before re-audit
---

# Checkpoint Component Gap Matrix Remediation

Read `../_shared/phase-checkpoint-contract.md` completely before acting.
Use only after `remediate-component-implementation-gap-matrix` returns
`READY_FOR_INDEPENDENT_GAP_MATRIX_REAUDIT`. This checkpoint preserves only the
validated Matrix remediation slice.

## Allowlist and preconditions

Require complete remediation, actionable reassessment, and zero production/test
changes. For `SPEC-EXEC-001`:

```text
docs/specs/gap-matrices/SPEC-EXEC-001-implementation-gap-matrix.md
docs/specs/gap-matrices/remediations/SPEC-EXEC-001-implementation-gap-matrix-remediation.md
docs/workflow-checkpoints/SPEC-EXEC-001-component-gap-matrix-remediation.md
```

Stage only these paths. Reject ADRs, portfolio, SPECs, audits, Plan, tickets,
code, tests, runtime, mirrors, and unrelated paths.

## Protocol and completion

Capture parent, verify the exact remediation gate and fingerprints, run required
validation and whitespace checks, write the marker, stage only the allowlist,
run cached checks, and create exactly:

```text
checkpoint(SPEC-EXEC-001): preserve component Gap Matrix remediation
```

Verify the commit parent and do not audit in this operation. Return:

```text
CHECKPOINT_COMPLETE
PHASE_CHECKPOINT_COMPLETE
COMPONENT_GAP_MATRIX_REMEDIATION_CHECKPOINT_COMPLETE
NEXT_AUTHORIZED_OPERATION = audit-component-implementation-gap-matrix
```

Any failure returns `COMPONENT_GAP_MATRIX_REMEDIATION_CHECKPOINT_BLOCKED` and
creates no commit.
