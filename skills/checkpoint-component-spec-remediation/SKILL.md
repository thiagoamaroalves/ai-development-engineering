---
name: checkpoint-component-spec-remediation
description: Create a guarded local checkpoint for a completed component SPEC remediation before independent SPEC re-audit.
metadata:
  short-description: Preserve remediated component SPEC before re-audit
---

# Checkpoint Component SPEC Remediation

Read `../_shared/phase-checkpoint-contract.md` and
`../_shared/phase-manifest-contract.md` completely before acting.

Use only after the SPEC remediator returns its independent re-audit readiness
gate. This checkpoint preserves the SPEC and remediation evidence; it does not
audit, approve, generate a Gap Matrix, or modify downstream artifacts.

## Preconditions and phase manifest

Require complete remediation, the exact re-audit gate, zero production/test
changes, and `PHASE_MANIFEST_PATH`. The manifest must be derived from the
remediated SPEC, remediation evidence, current HEAD, and candidate. Validate:

```text
node tools/verify-phase-manifest.mjs --manifest <PHASE_MANIFEST_PATH>
```

Stage only the manifest's effective path set. Reject every other dirty path and
do not embed project-specific paths in this skill.

## Protocol

1. Capture `PARENT_HEAD`.
2. Verify the remediation result and exact re-audit gate.
3. Validate the phase manifest and its source digests.
4. Run phase-required validation and inspect whitespace. Intentional audit
   hard breaks are allowed only when declared by manifest policy.
5. Write the marker declared by the manifest with parent, validation results,
   and zero production/test changes.
6. Stage exactly the manifest's effective path set and run cached validation.
7. Create exactly one commit using the manifest's `commitMessage`.
8. Verify the commit has exactly `PARENT_HEAD` as parent. Do not begin audit.

## Completion

Return:

```text
CHECKPOINT_COMPLETE
PHASE_CHECKPOINT_COMPLETE
COMPONENT_SPEC_REMEDIATION_CHECKPOINT_COMPLETE
NEXT_AUTHORIZED_OPERATION = audit-component-spec-conformance
```

Any failed precondition or unexpected path returns
`COMPONENT_SPEC_REMEDIATION_CHECKPOINT_BLOCKED` and creates no commit.
