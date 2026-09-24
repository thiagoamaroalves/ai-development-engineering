---
name: checkpoint-component-gap-matrix-generation
description: Create a guarded local checkpoint for a complete Gap Matrix generation before independent Gap Matrix audit.
metadata:
  short-description: Preserve generated Gap Matrix before audit
---

# Checkpoint Component Gap Matrix Generation

Read `../_shared/phase-checkpoint-contract.md` and
`../_shared/interrupted-artifact-production-recovery-contract.md` completely.
Use only after `generate-component-implementation-gap-matrix` returns
`COMPONENT_IMPLEMENTATION_GAP_MATRIX_COMPLETE` with a valid readiness result.

## Allowlist

For `SPEC-EXEC-001`, stage only:

```text
docs/specs/gap-matrices/SPEC-EXEC-001-implementation-gap-matrix.md
docs/workflow-checkpoints/SPEC-EXEC-001-component-gap-matrix-generation.md
```

Verify the current conformant SPEC audit checkpoint and matrix baselines match.
Reject audits, ADRs, portfolio, SPECs, Plans, tickets, code, tests, runtime,
mirrors and unrelated paths.

## Protocol and completion

Capture parent; verify the complete matrix result, source authority identity,
repository baseline, metrics and `READY_FOR_IMPLEMENTATION_PLAN`; write marker;
stage only the allowlist; run cached checks; create exactly:

```text
checkpoint(SPEC-EXEC-001): preserve generated component Gap Matrix
```

Verify the exact parent and do not audit or plan in this operation. Return:

```text
CHECKPOINT_COMPLETE
PHASE_CHECKPOINT_COMPLETE
COMPONENT_GAP_MATRIX_GENERATION_CHECKPOINT_COMPLETE
NEXT_AUTHORIZED_OPERATION = audit-component-implementation-gap-matrix
```

Failures return `COMPONENT_GAP_MATRIX_GENERATION_CHECKPOINT_BLOCKED` and create
no commit.
