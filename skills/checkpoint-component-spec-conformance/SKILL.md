---
name: checkpoint-component-spec-conformance
description: Create a guarded local checkpoint for a PASS component SPEC conformance audit before cross-SPEC portfolio validation.
metadata:
  short-description: Preserve conformant SPEC audit before cross-SPEC validation
---

# Checkpoint Component SPEC Conformance

Read `../_shared/phase-checkpoint-contract.md`,
`../_shared/phase-manifest-contract.md`, and
`../_shared/interrupted-artifact-production-recovery-contract.md` completely.
Use only after the current independent component SPEC audit is conformant and
before the cross-SPEC portfolio conformance audit.

## Phase manifest and recovery candidate

Require `PHASE_MANIFEST_PATH` derived from the conformant SPEC audit, current
HEAD, and actual candidate. An interrupted Gap Matrix candidate may remain
unstaged only when represented as untrusted in the manifest. Validate:

```text
node tools/verify-phase-manifest.mjs --manifest <PHASE_MANIFEST_PATH>
```

The manifest is the only path authority. Any other dirty path blocks; do not
embed project-specific paths in this skill.

## Protocol

Capture `PARENT_HEAD`; verify PASS verdict, implementability, fingerprint,
metrics and readiness; validate the phase manifest; write its declared marker;
stage exactly its effective path set; run cached checks; and create exactly the
manifest's `commitMessage`.

Verify the exact parent. Do not generate Gap Matrix or run the cross-SPEC audit
in this operation.

## Completion

Return:

```text
CHECKPOINT_COMPLETE
PHASE_CHECKPOINT_COMPLETE
COMPONENT_SPEC_CONFORMANCE_CHECKPOINT_COMPLETE
NEXT_AUTHORIZED_OPERATION = audit-spec-portfolio-conformance
```

Any failure returns `COMPONENT_SPEC_CONFORMANCE_CHECKPOINT_BLOCKED` and creates
no commit.
