---
name: checkpoint-component-spec-audit
description: >
  Create a guarded local Git checkpoint preserving one independently audited
  component SPEC baseline and its explicit revalidation handoff before SPEC
  remediation. Use only after a current component SPEC conformance audit and
  before remediate-component-spec.
metadata:
  short-description: Preserve the component SPEC audit baseline before remediation
---

# Checkpoint Component SPEC Audit

Read `../_shared/phase-checkpoint-contract.md` and
`../_shared/phase-manifest-contract.md` completely before acting.

Create one local checkpoint for the exact current component-SPEC audit baseline.
This operation preserves audit authority and routing evidence; it does not
remediate the SPEC, select missing semantics, modify downstream planning, or
change ticket state.

## Preconditions

Require all:

```text
CURRENT_COMPONENT_SPEC_AUDIT = FAIL — COMPONENT_SPEC_NON_CONFORMANT
READY_FOR_GAP_MATRIX = NO
BASELINE_DRIFT_REASSESSMENT_COMPLETE = YES
FINDINGS_ARE_ACTIONABLE = YES
NO_PRODUCTION_OR_TEST_MUTATION_IN_SCOPE = YES
HEAD_STABLE_AT_INTAKE = YES
SINGLE_WRITER = YES
```

The audit report, handoff, and blocked prior remediation evidence must be
preserved exactly as the current baseline. Never discard, reset, clean, stash,
or rewrite an unexpected path.

## Phase manifest

Do not embed project, component, ticket, audit, handoff, or marker paths in this
skill. Require `PHASE_MANIFEST_PATH` derived from the current SPEC audit,
revalidation handoff, baseline, current HEAD, and actual candidate. The
manifest must authorize the audit baseline, explicit handoff/evidence, and
marker for this phase only. Validate before staging:

```text
node tools/verify-phase-manifest.mjs --manifest <PHASE_MANIFEST_PATH>
```

Every dirty path must be in the manifest's effective path set. A missing,
ambiguous, or project-specific hand-maintained path list blocks the checkpoint.

## Checkpoint protocol

1. Capture `PARENT_HEAD = git rev-parse HEAD`.
2. Read the complete current audit and verify the exact FAIL verdict,
   `READY_FOR_GAP_MATRIX: NO`, actionable finding state, and complete baseline
   reassessment.
3. Read the handoff and blocked remediation evidence. Confirm the handoff routes
   to SPEC revalidation and the remediation has not changed production/tests.
4. Run `git diff --check` and the repository validation checks required by the
   active workflow before staging. Intentional two-space Markdown hard breaks
   in the independent audit report are permitted; any other trailing
   whitespace is a blocker and must not be normalized by this checkpoint.
5. Write the marker declared by the manifest with the complete audit verdict,
   handoff, parent, validation results, and zero production/test changes.
6. Validate the phase manifest and stage exactly its effective path set. Never
   use `git add .` or `git add -A`.
7. Run `git diff --cached --check`; intentional audit-report hard breaks may be
   allowed only when declared by the manifest policy.
8. Create exactly one local commit using the manifest's `commitMessage`.
9. Verify the new commit has the captured parent and only manifest paths.
10. Do not push, merge, publish, reset, clean, stash, remediate, or re-audit in
    this operation.

## Completion

Return:

```text
CHECKPOINT_COMPLETE
COMPONENT_SPEC_AUDIT_CHECKPOINT_COMPLETE
CHECKPOINT_HEAD = <new commit>
PARENT_HEAD = <parent>
PRESERVED_PATHS = <count>
PRODUCTION_FILES_CHANGED = 0
TEST_FILES_CHANGED = 0
NEXT_AUTHORIZED_OPERATION = remediate-component-spec
```

If any precondition, path, content, check, or parent verification fails, return
`COMPONENT_SPEC_AUDIT_CHECKPOINT_BLOCKED` with the exact blocker and do not
create a commit.
