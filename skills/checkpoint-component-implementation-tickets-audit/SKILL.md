---
name: checkpoint-component-implementation-tickets-audit
description: Create a guarded local checkpoint for a complete component implementation-ticket audit before ticket-set remediation.
metadata:
  short-description: Preserve implementation-ticket audit baseline before remediation
---

# Checkpoint Component Implementation Tickets Audit

Read `../_shared/phase-checkpoint-contract.md` completely before acting.
Use only after `audit-component-implementation-tickets` completes. Preserve the
current ticket-set audit and its exact ticket-set baseline; do not remediate or
change ticket status in this operation.

## Allowlist and preconditions

Require a complete current ticket-set audit and actionable reassessment when
findings exist. For `SPEC-EXEC-001`, the ticket-set evidence surface is:

```text
docs/tickets/SPEC-EXEC-001/README.md
docs/tickets/SPEC-EXEC-001/implementation-ticket-audit.md
docs/workflow-checkpoints/SPEC-EXEC-001-component-implementation-tickets-audit.md
```

If the audit explicitly changed ticket documents in the same audited baseline,
those exact changed ticket paths may be cited in the operation allowlist; never
stage an unlisted ticket. Reject ADRs, portfolio, SPECs, Gap Matrix, Plan,
code, tests, runtime, mirrors, and unrelated paths.

## Protocol and completion

Capture parent; verify verdict, DAG/baseline evidence and next route; run
required validation and whitespace checks; write the marker; stage only the
explicit allowlist; run cached checks; create exactly:

```text
checkpoint(SPEC-EXEC-001): preserve component implementation-tickets audit baseline
```

Verify the exact parent and do not remediate or implement. Return:

```text
CHECKPOINT_COMPLETE
PHASE_CHECKPOINT_COMPLETE
COMPONENT_IMPLEMENTATION_TICKETS_AUDIT_CHECKPOINT_COMPLETE
NEXT_AUTHORIZED_OPERATION = remediate-component-implementation-tickets
```

Any failure returns `COMPONENT_IMPLEMENTATION_TICKETS_AUDIT_CHECKPOINT_BLOCKED`
and creates no commit.
