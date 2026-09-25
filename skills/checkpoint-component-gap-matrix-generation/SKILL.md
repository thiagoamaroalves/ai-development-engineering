---
name: checkpoint-component-gap-matrix-generation
description: Create a guarded local checkpoint for a complete Gap Matrix generation before independent Gap Matrix audit.
metadata:
  short-description: Preserve generated Gap Matrix before audit
---

# Checkpoint Component Gap Matrix Generation

Read `../_shared/phase-checkpoint-contract.md`,
`../_shared/phase-manifest-contract.md`, and
`../_shared/interrupted-artifact-production-recovery-contract.md` completely.
Use only after the Gap Matrix producer returns a complete result with a valid
readiness gate.

## Phase manifest

Require `PHASE_MANIFEST_PATH` generated from the conformant SPEC authority,
producer result, current HEAD, and actual candidate. Validate:

```text
node tools/verify-phase-manifest.mjs --manifest <PHASE_MANIFEST_PATH>
```

The manifest is the only path authority. Reject every dirty path outside its
effective set; do not embed project, component, or filename paths in this
skill.

## Protocol and completion

Capture parent; verify the complete matrix result, source authority identity,
repository baseline, metrics and readiness; validate the phase manifest; write
its declared marker; stage exactly its effective path set; run cached checks;
and create exactly the manifest's `commitMessage`.

Verify the exact parent and do not audit or plan in this operation. Return:

```text
CHECKPOINT_COMPLETE
PHASE_CHECKPOINT_COMPLETE
COMPONENT_GAP_MATRIX_GENERATION_CHECKPOINT_COMPLETE
NEXT_AUTHORIZED_OPERATION = audit-component-implementation-gap-matrix
```

Failures return `COMPONENT_GAP_MATRIX_GENERATION_CHECKPOINT_BLOCKED` and create
no commit.
