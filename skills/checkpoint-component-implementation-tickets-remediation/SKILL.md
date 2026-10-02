---
name: checkpoint-component-implementation-tickets-remediation
description: Create a guarded local checkpoint for a completed component ticket-set remediation before independent ticket-set re-audit.
metadata:
  short-description: Preserve remediated implementation tickets before re-audit
---

# Checkpoint Component Implementation Tickets Remediation

For this checkpoint operation, the workflow extension derives and validates
the manifest, marker, candidate set, and commit directly in the active
worktree. Do not delegate checkpoint execution or Git staging/commit to an
agent. All semantic audit and remediation work remains owned by its respective
independent skill.

Read `../_shared/phase-checkpoint-contract.md` and
`../_shared/phase-manifest-contract.md` completely before acting. Use only
after the ticket-set remediator returns its independent re-audit readiness
gate. This operation preserves the exact remediation and does not implement
code or approve readiness.

## Phase manifest and preconditions

Require complete actionable remediation, zero production/test changes, and
`PHASE_MANIFEST_PATH`. The manifest must be derived from the remediated ticket
set, remediation evidence, current HEAD, and candidate. Validate:

```text
node tools/verify-phase-manifest.mjs --manifest <PHASE_MANIFEST_PATH>
```

Stage only the manifest's effective path set. Reject every other dirty path and
do not embed project-specific paths in this skill.

## Protocol and completion

Capture parent; verify the remediation gate, finding lineage and DAG evidence;
validate the phase manifest; run required validation and whitespace checks;
write its declared marker; stage exactly its effective path set; run cached
checks; and create exactly the manifest's `commitMessage`.

Verify the exact parent and do not audit or implement. Return:

```text
CHECKPOINT_COMPLETE
PHASE_CHECKPOINT_COMPLETE
COMPONENT_IMPLEMENTATION_TICKETS_REMEDIATION_CHECKPOINT_COMPLETE
NEXT_AUTHORIZED_OPERATION = audit-component-implementation-tickets
```

Any failure returns `COMPONENT_IMPLEMENTATION_TICKETS_REMEDIATION_CHECKPOINT_BLOCKED`
and creates no commit.
