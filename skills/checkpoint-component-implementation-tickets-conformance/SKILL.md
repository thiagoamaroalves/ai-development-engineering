---
name: checkpoint-component-implementation-tickets-conformance
description: Create a guarded local checkpoint for a conformant implementation-ticket audit before design or implementation.
metadata:
  short-description: Preserve conformant ticket audit before implementation
---

# Checkpoint Component Implementation Tickets Conformance

Read `../_shared/phase-checkpoint-contract.md` completely. Use only after the
current ticket-set audit is conformant and emits
`IMPLEMENTATION_GATE = READY_FOR_IMPLEMENTATION`.

## Allowlist and candidate

Stage only:

```text
docs/tickets/SPEC-EXEC-001/README.md
docs/tickets/SPEC-EXEC-001/implementation-ticket-audit.md
docs/workflow-checkpoints/SPEC-EXEC-001-component-implementation-tickets-conformance.md
```

If design/implementation was interrupted, the exact selected ticket design,
implementation, tests and evidence must be separately authorized by the
implemented-ticket checkpoint; do not include them here. Any other dirty path
blocks.

## Completion

Capture parent, verify current conformant ticket audit, basis, DAG, metrics and
gate, write marker, stage only the allowlist, run cached checks, create exactly:

```text
checkpoint(SPEC-EXEC-001): preserve conformant implementation-tickets audit
```

Return:

```text
CHECKPOINT_COMPLETE
PHASE_CHECKPOINT_COMPLETE
COMPONENT_IMPLEMENTATION_TICKETS_CONFORMANCE_CHECKPOINT_COMPLETE
NEXT_AUTHORIZED_OPERATION = design-ticket-implementation
```

Failures return `COMPONENT_IMPLEMENTATION_TICKETS_CONFORMANCE_CHECKPOINT_BLOCKED`
and create no commit.
