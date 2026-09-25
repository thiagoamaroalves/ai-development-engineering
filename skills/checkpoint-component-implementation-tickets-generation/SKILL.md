---
name: checkpoint-component-implementation-tickets-generation
description: Create a guarded local checkpoint for complete ticket decomposition before independent ticket-set audit.
metadata:
  short-description: Preserve generated implementation tickets before audit
---

# Checkpoint Component Implementation Tickets Generation

Read `../_shared/phase-checkpoint-contract.md`,
`../_shared/phase-manifest-contract.md`, and
`../_shared/interrupted-artifact-production-recovery-contract.md` completely.
Use only after the ticket-decomposition producer returns its complete result
and ticket-audit readiness gate.

## Phase manifest

Do not embed repository, component, ticket, or filename paths in this skill.
Require `PHASE_MANIFEST_PATH` derived from the conformant Plan checkpoint, the
complete decomposition result, current HEAD, and actual candidate. The
manifest must explicitly distinguish preserved files from authorized
historical deletions. Validate:

```text
node tools/verify-phase-manifest.mjs --manifest <PHASE_MANIFEST_PATH>
```

Reject every dirty path outside the manifest's effective path set. A complete
producer result without a valid manifest is not checkpointable.

## Completion

Capture parent, verify all ticket identities, DAG, metrics and readiness,
validate the phase manifest, write its declared marker, stage exactly its
effective path set, run cached checks, and create exactly the manifest's
`commitMessage`.

Return:

```text
CHECKPOINT_COMPLETE
PHASE_CHECKPOINT_COMPLETE
COMPONENT_IMPLEMENTATION_TICKETS_GENERATION_CHECKPOINT_COMPLETE
NEXT_AUTHORIZED_OPERATION = audit-component-implementation-tickets
```

Failures return `COMPONENT_IMPLEMENTATION_TICKETS_GENERATION_CHECKPOINT_BLOCKED`.
