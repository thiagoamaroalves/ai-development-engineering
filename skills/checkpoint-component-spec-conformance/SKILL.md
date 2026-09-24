---
name: checkpoint-component-spec-conformance
description: Create a guarded local checkpoint for a PASS component SPEC conformance audit before Gap Matrix generation.
metadata:
  short-description: Preserve conformant SPEC audit before Gap Matrix generation
---

# Checkpoint Component SPEC Conformance

Read `../_shared/phase-checkpoint-contract.md` and
`../_shared/interrupted-artifact-production-recovery-contract.md` completely.
Use only after the current independent component SPEC audit returns
`PASS — COMPONENT_SPEC_CONFORMANT` and `READY_FOR_GAP_MATRIX: YES`.

## Allowlist and recovery candidate

Stage only:

```text
docs/specs/audits/SPEC-EXEC-001-component-conformance-audit.md
docs/workflow-checkpoints/SPEC-EXEC-001-component-spec-conformance.md
```

If Gap Matrix generation was interrupted, this exact output may remain
explicitly preserved **unstaged**:

```text
docs/specs/gap-matrices/SPEC-EXEC-001-implementation-gap-matrix.md
```

It is an untrusted candidate and is not included in this commit. Any other
path blocks. Verify the audit is current, its source authority is unchanged,
and no production/test/upstream path is changed.

## Protocol

Capture `PARENT_HEAD`; verify PASS verdict, implementability PASS, fingerprint,
metrics and readiness; write the marker; stage only the audit and marker; run
cached checks; create exactly:

```text
checkpoint(SPEC-EXEC-001): preserve conformant component SPEC audit
```

Verify the exact parent. Do not generate Gap Matrix in this operation.

## Completion

Return:

```text
CHECKPOINT_COMPLETE
PHASE_CHECKPOINT_COMPLETE
COMPONENT_SPEC_CONFORMANCE_CHECKPOINT_COMPLETE
NEXT_AUTHORIZED_OPERATION = generate-component-implementation-gap-matrix
```

Any failure returns `COMPONENT_SPEC_CONFORMANCE_CHECKPOINT_BLOCKED` and creates
no commit.
