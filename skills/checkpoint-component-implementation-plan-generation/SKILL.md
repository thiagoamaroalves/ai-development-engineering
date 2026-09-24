---
name: checkpoint-component-implementation-plan-generation
description: Create a guarded local checkpoint for a complete Implementation Plan generation before independent Plan audit.
metadata:
  short-description: Preserve generated Implementation Plan before audit
---

# Checkpoint Component Implementation Plan Generation

Read `../_shared/phase-checkpoint-contract.md` and
`../_shared/interrupted-artifact-production-recovery-contract.md` completely.
Use only after `plan-component-implementation` returns
`COMPONENT_IMPLEMENTATION_PLAN_COMPLETE` and `READY_FOR_IMPLEMENTATION_PLAN_AUDIT`.

## Allowlist

```text
docs/specs/implementation-plans/SPEC-EXEC-001-implementation-plan.md
docs/workflow-checkpoints/SPEC-EXEC-001-component-implementation-plan-generation.md
```

Verify the conformant Gap Matrix checkpoint and Plan baselines match. Reject
other authority, audits, tickets, code, tests and unrelated paths.

## Completion

Capture parent, verify complete plan result and readiness, write marker, stage
only the allowlist, run cached checks, and create exactly:

```text
checkpoint(SPEC-EXEC-001): preserve generated component Implementation Plan
```

Return:

```text
CHECKPOINT_COMPLETE
PHASE_CHECKPOINT_COMPLETE
COMPONENT_IMPLEMENTATION_PLAN_GENERATION_CHECKPOINT_COMPLETE
NEXT_AUTHORIZED_OPERATION = audit-component-implementation-plan
```

Failures return `COMPONENT_IMPLEMENTATION_PLAN_GENERATION_CHECKPOINT_BLOCKED`.
