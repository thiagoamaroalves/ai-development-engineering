---
name: checkpoint-component-implementation-tickets-audit
description: Create a guarded local checkpoint for a complete component implementation-ticket audit before ticket-set remediation.
metadata:
  short-description: Preserve implementation-ticket audit baseline before remediation
---

# Checkpoint Component Implementation Tickets Audit

Read `../_shared/phase-checkpoint-contract.md` and
`../_shared/phase-manifest-contract.md` completely before acting. Use only
after the independent ticket-set audit completes. Preserve the current audit
and exact baseline; do not remediate or change ticket status.

## Phase manifest and preconditions

Require a complete current ticket-set audit, actionable reassessment when
findings exist, and `PHASE_MANIFEST_PATH`. The manifest must be derived from
the audited ticket set, source authority, current HEAD, and actual candidate.
Validate:

```text
node tools/verify-phase-manifest.mjs --manifest <PHASE_MANIFEST_PATH>
```

The manifest alone authorizes changed ticket documents. Reject every dirty path
outside its effective path set; do not embed project-specific paths.

## Protocol and completion

Capture parent; verify verdict, DAG/baseline evidence and next route;
validate the phase manifest; run required validation and whitespace checks;
write its declared marker; stage exactly its effective path set; run cached
checks; and create exactly the manifest's `commitMessage`.

Verify the exact parent and do not remediate or implement. Return:

```text
CHECKPOINT_COMPLETE
PHASE_CHECKPOINT_COMPLETE
COMPONENT_IMPLEMENTATION_TICKETS_AUDIT_CHECKPOINT_COMPLETE
NEXT_AUTHORIZED_OPERATION = remediate-component-implementation-tickets
```

Any failure returns `COMPONENT_IMPLEMENTATION_TICKETS_AUDIT_CHECKPOINT_BLOCKED`
and creates no commit.
