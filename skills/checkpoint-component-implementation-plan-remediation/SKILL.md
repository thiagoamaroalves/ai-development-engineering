---
name: checkpoint-component-implementation-plan-remediation
description: Create a guarded local checkpoint for a completed Implementation Plan remediation before independent plan re-audit.
metadata:
  short-description: Preserve remediated Implementation Plan before re-audit
---

# Checkpoint Component Implementation Plan Remediation

Read `../_shared/phase-checkpoint-contract.md`,
`../_shared/phase-manifest-contract.md`, and
`../_shared/canonical-artifact-consistency-contract.md` completely before
acting. Run `npm run verify:canonical-consistency` before staging; it must pass.
Use only after the Plan remediator returns its independent re-audit readiness
gate. This operation preserves Plan remediation and never audits, creates
tickets, or implements code.

## Phase manifest and preconditions

Require complete actionable remediation, zero production/test changes, and
`PHASE_MANIFEST_PATH`. The manifest must be derived from the remediated Plan,
remediation evidence, current HEAD, and candidate. Validate it before staging:

```text
node tools/verify-phase-manifest.mjs --manifest <PHASE_MANIFEST_PATH>
```

Stage only the manifest's effective path set. Reject every other dirty path and
do not embed project-specific paths in this skill.

## Protocol and completion

Capture parent; verify the exact remediation gate and basis; validate the
phase manifest; run required validation, canonical artifact consistency, and
whitespace checks; write its declared marker only after consistency passes;
stage exactly its effective path set; run cached checks; and create exactly
the manifest's `commitMessage`.

Verify the exact parent and do not audit or decompose tickets. Return:

```text
CHECKPOINT_COMPLETE
PHASE_CHECKPOINT_COMPLETE
COMPONENT_IMPLEMENTATION_PLAN_REMEDIATION_CHECKPOINT_COMPLETE
CANONICAL_ARTIFACT_CONSISTENCY = PASS
NEXT_AUTHORIZED_OPERATION = audit-component-implementation-plan
```

Any failure returns `COMPONENT_IMPLEMENTATION_PLAN_REMEDIATION_CHECKPOINT_BLOCKED`
and creates no commit.
