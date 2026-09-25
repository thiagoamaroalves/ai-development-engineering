---
name: checkpoint-component-gap-matrix-remediation
description: Create a guarded local checkpoint for a completed Gap Matrix remediation before independent Gap Matrix re-audit.
metadata:
  short-description: Preserve remediated Gap Matrix before re-audit
---

# Checkpoint Component Gap Matrix Remediation

Read `../_shared/phase-checkpoint-contract.md` and
`../_shared/phase-manifest-contract.md` completely before acting. Use only
after the Gap Matrix remediator returns its independent re-audit readiness
gate. This checkpoint preserves only the validated remediation slice.

## Phase manifest and preconditions

Require complete remediation, actionable reassessment, zero production/test
changes, and `PHASE_MANIFEST_PATH`. The manifest must be derived from the
remediated Matrix, remediation evidence, current HEAD, and candidate. Validate:

```text
node tools/verify-phase-manifest.mjs --manifest <PHASE_MANIFEST_PATH>
```

Stage only the manifest's effective path set. Reject every other dirty path and
do not embed project-specific paths in this skill.

## Protocol and completion

Capture parent, verify the exact remediation gate and fingerprints, validate
the phase manifest, run required validation and whitespace checks, write its
declared marker, stage exactly its effective path set, run cached checks, and
create exactly the manifest's `commitMessage`.

Verify the commit parent and do not audit in this operation. Return:

```text
CHECKPOINT_COMPLETE
PHASE_CHECKPOINT_COMPLETE
COMPONENT_GAP_MATRIX_REMEDIATION_CHECKPOINT_COMPLETE
NEXT_AUTHORIZED_OPERATION = audit-component-implementation-gap-matrix
```

Any failure returns `COMPONENT_GAP_MATRIX_REMEDIATION_CHECKPOINT_BLOCKED` and
creates no commit.
