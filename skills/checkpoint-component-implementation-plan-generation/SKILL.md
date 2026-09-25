---
name: checkpoint-component-implementation-plan-generation
description: Create a guarded local checkpoint for a complete Implementation Plan generation before independent Plan audit.
metadata:
  short-description: Preserve generated Implementation Plan before audit
---

# Checkpoint Component Implementation Plan Generation

Read `../_shared/phase-checkpoint-contract.md`,
`../_shared/phase-manifest-contract.md`, and
`../_shared/interrupted-artifact-production-recovery-contract.md` completely.
Use only after the producer returns its complete result and the declared
readiness gate for independent Plan audit.

## Phase manifest

Do not embed repository, component, or filename paths in this skill. Require
`PHASE_MANIFEST_PATH` from the controller and verify that the manifest was
derived from the conformant upstream checkpoint, the complete Plan result, the
current HEAD, and the actual candidate. Run:

```text
node tools/verify-phase-manifest.mjs --manifest <PHASE_MANIFEST_PATH>
```

The manifest must authorize only the generated Plan, its phase marker, and any
producer-declared evidence. Reject every dirty path outside its effective path
set; do not broaden it or treat an incomplete candidate as complete.

## Completion

Capture parent, verify the complete producer result and readiness, validate
the phase manifest, write its declared marker, stage exactly its effective path
set, run cached checks, and create exactly the manifest's `commitMessage`.

Return:

```text
CHECKPOINT_COMPLETE
PHASE_CHECKPOINT_COMPLETE
COMPONENT_IMPLEMENTATION_PLAN_GENERATION_CHECKPOINT_COMPLETE
NEXT_AUTHORIZED_OPERATION = audit-component-implementation-plan
```

Failures return `COMPONENT_IMPLEMENTATION_PLAN_GENERATION_CHECKPOINT_BLOCKED`.
