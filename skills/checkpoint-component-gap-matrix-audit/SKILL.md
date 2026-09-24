---
name: checkpoint-component-gap-matrix-audit
description: Create a guarded local checkpoint for a validated component Gap Matrix and its independent audit before Gap Matrix remediation.
metadata:
  short-description: Preserve Gap Matrix audit baseline before remediation
---

# Checkpoint Component Gap Matrix Audit

Read `../_shared/phase-checkpoint-contract.md` completely before acting.
Use only after `audit-component-implementation-gap-matrix` returns a complete
current audit. This checkpoint preserves the Gap Matrix audit baseline and
never edits the Matrix, audit, SPEC, Plan, tickets, code, or tests.

## Preconditions and allowlist

Require `GAP_MATRIX_CONFORMANT` or the exact actionable remediation verdict,
complete baseline reassessment, and no production/test changes. For
`SPEC-EXEC-001`, the allowlist is:

```text
docs/specs/gap-matrices/SPEC-EXEC-001-implementation-gap-matrix.md
docs/specs/gap-matrices/audits/SPEC-EXEC-001-implementation-gap-matrix-audit.md
docs/workflow-checkpoints/SPEC-EXEC-001-component-gap-matrix-audit.md
```

The marker is created by this operation. Reject ADRs, portfolio, component or
upstream SPECs, Plan, tickets, code, tests, runtime, mirrors, and unrelated
paths. Verify all dirty paths against the allowlist before staging.

## Protocol

Capture `PARENT_HEAD`; verify the audit verdict, fingerprint, drift proof and
next remediation route; run phase validation and whitespace checks (intentional
two-space Markdown breaks in audit reports are allowed); write the marker;
stage only the allowlist; run cached checks; create exactly:

```text
checkpoint(SPEC-EXEC-001): preserve component Gap Matrix audit baseline
```

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
