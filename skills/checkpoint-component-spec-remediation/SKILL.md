---
name: checkpoint-component-spec-remediation
description: Create a guarded local checkpoint for a completed component SPEC remediation before independent SPEC re-audit.
metadata:
  short-description: Preserve remediated component SPEC before re-audit
---

# Checkpoint Component SPEC Remediation

Read `../_shared/phase-checkpoint-contract.md` completely before acting.

Use only after `remediate-component-spec` returns
`READY_FOR_INDEPENDENT_COMPONENT_SPEC_REAUDIT`. This checkpoint preserves the
SPEC and remediation evidence; it does not audit, approve, generate a Gap
Matrix, or modify downstream artifacts.

## Preconditions

Require:

```text
COMPONENT_SPEC_REMEDIATION_COMPLETE = YES
READY_FOR_INDEPENDENT_COMPONENT_SPEC_REAUDIT = YES
PRODUCTION_FILES_CHANGED = 0
TEST_FILES_CHANGED = 0
```

For the current component:

```text
docs/specs/SPEC-EXEC-001-skill-contracts-and-capability-registry.md
docs/specs/remediations/SPEC-EXEC-001-component-spec-remediation.md
docs/workflow-checkpoints/SPEC-EXEC-001-component-spec-remediation.md
```

The marker is created by this operation. Stage only the SPEC, its remediation
evidence, and the marker. Reject ADRs, portfolio, upstream SPECs, Gap Matrix,
Plan, tickets, code, tests, `.pi/`, `.codex/`, and unrelated paths.

## Protocol

1. Capture `PARENT_HEAD`.
2. Verify the remediation result and exact re-audit gate.
3. Verify every dirty path is in the allowlist or is the marker.
4. Run phase-required validation and inspect whitespace. Intentional two-space
   Markdown hard breaks in audit artifacts are allowed.
5. Write the marker with `CHECKPOINT_KIND = COMPONENT_SPEC_REMEDIATION_CHECKPOINT`,
   source remediation, parent, validation results, and zero production/test
   changes.
6. Stage only the allowlist; run cached whitespace validation.
7. Create exactly:

```text
checkpoint(SPEC-EXEC-001): preserve component SPEC remediation
```

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
