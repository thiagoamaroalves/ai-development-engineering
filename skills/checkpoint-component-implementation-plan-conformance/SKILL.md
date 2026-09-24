---
name: checkpoint-component-implementation-plan-conformance
description: Create a guarded local checkpoint for a conformant Implementation Plan audit before ticket decomposition.
metadata:
  short-description: Preserve conformant Implementation Plan audit before tickets
---

# Checkpoint Component Implementation Plan Conformance

Read `../_shared/phase-checkpoint-contract.md` and
`../_shared/interrupted-artifact-production-recovery-contract.md` completely.
Use only after the current Implementation Plan audit is conformant and emits
`READY_FOR_ISSUE_DECOMPOSITION: YES`.

## Allowlist and candidate

Stage only:

```text
docs/specs/implementation-plans/SPEC-EXEC-001-implementation-plan.md
docs/specs/implementation-plans/audits/SPEC-EXEC-001-implementation-plan-audit.md
docs/workflow-checkpoints/SPEC-EXEC-001-component-implementation-plan-conformance.md
```

If ticket decomposition was interrupted, the exact ticket-set output may remain
unstaged as an untrusted candidate:

```text
docs/tickets/SPEC-EXEC-001/README.md
docs/tickets/SPEC-EXEC-001/implementation-ticket-audit.md
```

Any other path blocks. Do not decompose tickets here.

## Completion

Capture parent, verify current conformant Plan audit, basis, metrics and gate,
write marker, stage only the allowlist, run cached checks, create exactly:

```text
checkpoint(SPEC-EXEC-001): preserve conformant Implementation Plan audit
```

Return:

```text
CHECKPOINT_COMPLETE
PHASE_CHECKPOINT_COMPLETE
COMPONENT_IMPLEMENTATION_PLAN_CONFORMANCE_CHECKPOINT_COMPLETE
NEXT_AUTHORIZED_OPERATION = decompose-component-implementation-plan-into-tickets
```

Failures return `COMPONENT_IMPLEMENTATION_PLAN_CONFORMANCE_CHECKPOINT_BLOCKED`
and create no commit.
