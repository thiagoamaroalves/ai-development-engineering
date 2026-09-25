---
name: checkpoint-component-implementation-plan-audit
description: Create a guarded local checkpoint for a conformant component Implementation Plan and its audit before plan remediation.
metadata:
  short-description: Preserve Implementation Plan audit baseline before remediation
---

# Checkpoint Component Implementation Plan Audit

Read `../_shared/phase-checkpoint-contract.md` and
`../_shared/phase-manifest-contract.md` completely before acting. Use only
after the independent Plan audit completes. Preserve the exact plan/audit
baseline and do not alter planning authority in this operation.

## Phase manifest and preconditions

Require a complete current audit, actionable reassessment when findings exist,
no production/test changes, and a controller-supplied `PHASE_MANIFEST_PATH`.
The manifest must be derived from the audited Plan, audit evidence, current
HEAD, and actual candidate. Validate it before staging:

```text
node tools/verify-phase-manifest.mjs --manifest <PHASE_MANIFEST_PATH>
```

Reject every dirty path outside the manifest's effective path set. The skill
must not contain repository-specific paths.

## Protocol and completion

Capture parent; verify audit verdict, basis and routing; validate the phase
manifest; run required validation and whitespace checks; write its declared
marker; stage exactly the manifest's effective path set; run cached checks; and
create exactly the manifest's `commitMessage`.

Verify the exact parent and do not remediate or re-audit. Return:

```text
CHECKPOINT_COMPLETE
PHASE_CHECKPOINT_COMPLETE
COMPONENT_IMPLEMENTATION_PLAN_AUDIT_CHECKPOINT_COMPLETE
NEXT_AUTHORIZED_OPERATION = remediate-component-implementation-plan
```

Any failure returns `COMPONENT_IMPLEMENTATION_PLAN_AUDIT_CHECKPOINT_BLOCKED`
and creates no commit.
