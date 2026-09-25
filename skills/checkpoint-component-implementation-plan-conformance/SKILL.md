---
name: checkpoint-component-implementation-plan-conformance
description: Create a guarded local checkpoint for a conformant Implementation Plan audit before ticket decomposition.
metadata:
  short-description: Preserve conformant Implementation Plan audit before tickets
---

# Checkpoint Component Implementation Plan Conformance

Read `../_shared/phase-checkpoint-contract.md`,
`../_shared/phase-manifest-contract.md`, and
`../_shared/interrupted-artifact-production-recovery-contract.md` completely.
Use only after the current Plan audit is conformant and emits its issue-
decomposition readiness gate.

## Phase manifest and candidate

Require `PHASE_MANIFEST_PATH`. The manifest must be derived from the conformant
Plan audit, current HEAD, and actual candidate. If downstream production was
interrupted, its paths must be represented as untrusted candidate paths in the
manifest and remain unstaged by this operation. Validate:

```text
node tools/verify-phase-manifest.mjs --manifest <PHASE_MANIFEST_PATH>
```

Any dirty path outside the manifest's effective path set blocks. Do not
produce downstream artifacts here; the skill must contain no project-specific
path literals.

## Completion

Capture parent, verify the current conformant Plan audit, basis, metrics and
gate, validate the phase manifest, write its declared marker, stage exactly its
effective path set, run cached checks, and create exactly the manifest's
`commitMessage`.

Return:

```text
CHECKPOINT_COMPLETE
PHASE_CHECKPOINT_COMPLETE
COMPONENT_IMPLEMENTATION_PLAN_CONFORMANCE_CHECKPOINT_COMPLETE
NEXT_AUTHORIZED_OPERATION = decompose-component-implementation-plan-into-tickets
```

Failures return `COMPONENT_IMPLEMENTATION_PLAN_CONFORMANCE_CHECKPOINT_BLOCKED`
and create no commit.
