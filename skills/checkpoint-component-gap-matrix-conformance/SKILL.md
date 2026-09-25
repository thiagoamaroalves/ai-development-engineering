---
name: checkpoint-component-gap-matrix-conformance
description: Create a guarded local checkpoint for a conformant Gap Matrix audit before Implementation Plan generation.
metadata:
  short-description: Preserve conformant Gap Matrix audit before planning
---

# Checkpoint Component Gap Matrix Conformance

Read `../_shared/phase-checkpoint-contract.md`,
`../_shared/phase-manifest-contract.md`, and
`../_shared/interrupted-artifact-production-recovery-contract.md` completely.
Use only after the current Gap Matrix audit is complete and conformant.

## Phase manifest and candidate

Require `PHASE_MANIFEST_PATH` derived from the conformant Gap Matrix audit,
current HEAD, and actual candidate. Interrupted Plan output may remain
unstaged only when explicitly represented as an untrusted candidate in the
manifest. Validate:

```text
node tools/verify-phase-manifest.mjs --manifest <PHASE_MANIFEST_PATH>
```

Any dirty path outside the manifest's effective set blocks. Do not generate the
Plan here and do not embed project-specific paths in this skill.

## Completion

Capture parent, verify the current conformant audit, basis, metrics and
readiness, validate the phase manifest, write its declared marker, stage
exactly its effective path set, run cached checks, and create exactly the
manifest's `commitMessage`.

Return:

```text
CHECKPOINT_COMPLETE
PHASE_CHECKPOINT_COMPLETE
COMPONENT_GAP_MATRIX_CONFORMANCE_CHECKPOINT_COMPLETE
NEXT_AUTHORIZED_OPERATION = plan-component-implementation
```

Failures return `COMPONENT_GAP_MATRIX_CONFORMANCE_CHECKPOINT_BLOCKED` and create
no commit.
