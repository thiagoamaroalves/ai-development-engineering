---
name: checkpoint-component-gap-matrix-audit
description: Create a guarded local checkpoint for a validated component Gap Matrix and its independent audit before Gap Matrix remediation.
metadata:
  short-description: Preserve Gap Matrix audit baseline before remediation
---

# Checkpoint Component Gap Matrix Audit

Read `../_shared/phase-checkpoint-contract.md` and
`../_shared/phase-manifest-contract.md` completely before acting. Use only
after the independent Gap Matrix audit returns a complete current audit. This
checkpoint preserves the audit baseline and never edits authority or code.

## Preconditions and phase manifest

Require the conformant or actionable-remediation verdict, complete baseline
reassessment, no production/test changes, and `PHASE_MANIFEST_PATH`. The
manifest must be derived from the current Gap Matrix audit, source authority,
HEAD, and candidate. Validate it before staging:

```text
node tools/verify-phase-manifest.mjs --manifest <PHASE_MANIFEST_PATH>
```

The manifest is the only path authority. Reject every dirty path outside its
effective set and never embed project-specific paths in this skill.

## Protocol

Capture `PARENT_HEAD`; verify the audit verdict, fingerprint, drift proof and
next remediation route; validate the phase manifest; run phase validation and
whitespace checks (intentional two-space Markdown breaks in audit reports are
allowed); write its declared marker; stage exactly its effective path set; run
cached checks; and create exactly the manifest's `commitMessage`.

Verify the new commit has exactly the captured parent. Do not remediate or
re-audit in this operation.

## Completion

Return:

```text
CHECKPOINT_COMPLETE
PHASE_CHECKPOINT_COMPLETE
COMPONENT_GAP_MATRIX_AUDIT_CHECKPOINT_COMPLETE
NEXT_AUTHORIZED_OPERATION = remediate-component-implementation-gap-matrix
```

Any uncertainty or unexpected path returns
`COMPONENT_GAP_MATRIX_AUDIT_CHECKPOINT_BLOCKED` and creates no commit.
