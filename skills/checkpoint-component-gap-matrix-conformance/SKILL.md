---
name: checkpoint-component-gap-matrix-conformance
description: Create a guarded local checkpoint for a conformant Gap Matrix audit before Implementation Plan generation.
metadata:
  short-description: Preserve conformant Gap Matrix audit before planning
---

# Checkpoint Component Gap Matrix Conformance

Read `../_shared/phase-checkpoint-contract.md` and
`../_shared/interrupted-artifact-production-recovery-contract.md` completely.
Use only after the current Gap Matrix audit is complete and conformant with
`READY_FOR_IMPLEMENTATION_PLAN: YES`.

## Allowlist and candidate

Stage only:

```text
docs/specs/gap-matrices/SPEC-EXEC-001-implementation-gap-matrix.md
docs/specs/gap-matrices/audits/SPEC-EXEC-001-implementation-gap-matrix-audit.md
docs/workflow-checkpoints/SPEC-EXEC-001-component-gap-matrix-conformance.md
```

If Plan generation was interrupted, the exact Plan output may remain unstaged
as an untrusted candidate:

```text
docs/specs/implementation-plans/SPEC-EXEC-001-implementation-plan.md
```

Any other path blocks. Do not generate the Plan here.

## Completion

Capture parent, verify current conformant audit, basis, metrics and readiness,
write marker, stage only the allowlist, run cached checks, create exactly:

```text
checkpoint(SPEC-EXEC-001): preserve conformant component Gap Matrix audit
```

Return:

```text
CHECKPOINT_COMPLETE
PHASE_CHECKPOINT_COMPLETE
COMPONENT_GAP_MATRIX_CONFORMANCE_CHECKPOINT_COMPLETE
NEXT_AUTHORIZED_OPERATION = plan-component-implementation
```

Failures return `COMPONENT_GAP_MATRIX_CONFORMANCE_CHECKPOINT_BLOCKED` and create
no commit.
