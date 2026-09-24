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

## Exact allowlist for the current SPEC-EXEC-001 revalidation

```text
docs/specs/audits/SPEC-EXEC-001-component-conformance-audit.md
docs/specs/SPEC-EXEC-001-IMA-MAJOR-013-spec-revalidation-handoff.md
docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-implementation-remediation.md
skills/checkpoint-component-spec-audit/SKILL.md
docs/workflow-checkpoints/SPEC-EXEC-001-component-spec-audit.md
```

The checkpoint skill itself is included because it is the newly introduced
repository authority required to preserve and continue this SPEC phase. No
other source, test, ADR, portfolio,
SPEC, Gap Matrix, Plan, ticket, `.pi/`, `.codex/`, `skills/`, `tools/`, or
unrelated path may be staged.

Before staging, verify every current non-ignored dirty path is either one of the
three existing allowlisted evidence paths, the checkpoint skill itself, or the
operation's marker. Any other path blocks the checkpoint.

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
5. Write the marker at the exact allowlisted path with:

```text
CHECKPOINT_KIND = COMPONENT_SPEC_AUDIT_CHECKPOINT
PARENT_HEAD = <parent>
COMPONENT_SPEC = SPEC-EXEC-001
SOURCE_AUDIT = docs/specs/audits/SPEC-EXEC-001-component-conformance-audit.md
SOURCE_VERDICT = FAIL — COMPONENT_SPEC_NON_CONFORMANT
READY_FOR_GAP_MATRIX = NO
HANDOFF = docs/specs/SPEC-EXEC-001-IMA-MAJOR-013-spec-revalidation-handoff.md
BLOCKED_PRIOR_REMEDIATION = docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-implementation-remediation.md
PRODUCTION_FILES_CHANGED = 0
TEST_FILES_CHANGED = 0
CHECKS = PASS
CHECKPOINT_COMMIT_MESSAGE = checkpoint(SPEC-EXEC-001): preserve component SPEC audit baseline
```

6. Stage only the exact allowlist. Never use `git add .` or `git add -A`.
7. Verify staged paths are a subset of the allowlist and contain no production
   code, tests, upstream authority, downstream planning, `.pi/`, `.codex/`,
   unrelated skills, or unrelated ticket path.
8. Run `git diff --cached --check`. Intentional two-space Markdown hard
   breaks in `docs/specs/audits/SPEC-EXEC-001-component-conformance-audit.md`
   may be reported by Git and are allowed; every other whitespace error blocks
   the checkpoint.
9. Create exactly one local commit:

```text
checkpoint(SPEC-EXEC-001): preserve component SPEC audit baseline
```

10. Verify the new commit has the captured parent and only the allowlisted paths.
11. Do not push, merge, publish, reset, clean, stash, remediate, or re-audit in
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
