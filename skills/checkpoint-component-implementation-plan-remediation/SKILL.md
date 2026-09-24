---
name: checkpoint-component-implementation-plan-remediation
description: Create a guarded local checkpoint for a completed Implementation Plan remediation before independent plan re-audit.
metadata:
  short-description: Preserve remediated Implementation Plan before re-audit
---

# Checkpoint Component Implementation Plan Remediation

Read `../_shared/phase-checkpoint-contract.md` and
`../_shared/canonical-artifact-consistency-contract.md` completely before
acting. Run `npm run verify:canonical-consistency` before staging. The command
must pass; its result is part of the checkpoint evidence.
Use only after `remediate-component-implementation-plan` returns its independent
plan re-audit readiness gate. This operation preserves the plan remediation and
never audits, creates tickets, or implements code.

## Allowlist and preconditions

Require complete actionable remediation and zero production/test changes:

```text
docs/specs/implementation-plans/SPEC-EXEC-001-implementation-plan.md
docs/specs/implementation-plans/remediations/SPEC-EXEC-001-implementation-plan-remediation.md
docs/workflow-checkpoints/SPEC-EXEC-001-component-implementation-plan-remediation.md
```

Stage only these paths. Reject ADRs, portfolio, SPECs, Gap Matrix, audits,
tickets, code, tests, runtime, mirrors, and unrelated paths.

## Protocol and completion

Capture parent; verify the exact remediation gate and basis; run required
validation, canonical artifact consistency, and whitespace checks; write the
marker only after consistency passes; stage only the allowlist; run cached
checks; create exactly:

```text
checkpoint(SPEC-EXEC-001): preserve component Implementation Plan remediation
```

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
