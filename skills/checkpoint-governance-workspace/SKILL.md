---
name: checkpoint-governance-workspace
description: >
  Create one guarded local Git checkpoint for an explicitly human-authorized
  preservation of repository workflow/process changes that block a ticket-local
  operation. Use only to reconcile a dirty workspace without deleting or
  silently mixing changes into an implemented-ticket checkpoint.
metadata:
  short-description: Preserve an explicitly authorized workflow governance slice
---

# Checkpoint Governance Workspace

Create one local checkpoint for the exact preserved governance/reconciliation
slice selected by the human. This operation exists only to remove an
unrelated-workspace topology blocker; it does not implement, remediate, audit,
finalize, or change ticket lifecycle state.

## Preconditions

Require all:

```text
HUMAN_PRESERVATION_AUTHORIZATION = YES
PRESERVATION_SCOPE = EXPLICIT
HEAD_STABLE_AT_INTAKE = YES
NO_PRODUCTION_OR_TEST_MUTATION_IN_SCOPE = YES
NO_UPSTREAM_AUTHORITY_MUTATION_IN_SCOPE = YES
SINGLE_WRITER = YES
```

The workflow controller must cite the current dirty-path inventory and this
skill. Never infer preservation from a dirty workspace. Never discard, reset,
clean, stash, or rewrite a path that is not explicitly in the phase manifest.
An interrupted remediation candidate may be explicitly preserved unstaged in
`paths.unstagedRecovery`; it must never be included in this governance commit.

## Phase manifest and human authorization

Do not embed repository, project, component, ticket, or filename paths in this
skill. Require `HUMAN_PRESERVATION_AUTHORIZATION = YES` and a controller-
supplied `PHASE_MANIFEST_PATH`. The manifest must be derived from the current
dirty inventory, explicitly authorized governance scope, current HEAD, and any
untrusted recovery candidates. It must separate `paths.preserve`/`delete`
from `paths.unstagedRecovery`; recovery candidates remain untouched and
unstaged.

Validate the manifest before staging:

```text
node tools/verify-phase-manifest.mjs --manifest <PHASE_MANIFEST_PATH>
```

Only the manifest's effective path set may be staged. Every recovery candidate
must be explicitly authorized, remain unstaged, and be represented in the
manifest. Any other dirty path blocks. The manifest itself is the durable
record of the human-approved scope; the skill must remain project-independent.

## Checkpoint protocol

1. Capture `PARENT_HEAD = git rev-parse HEAD`.
2. Re-read the complete current dirty-path inventory.
3. Run `npm test`, `npm run typecheck`, `npm run verify:audit-governance`,
   `npm run verify:skill-mirror`, and the phase-manifest verifier.
4. Write the reconciliation marker declared by the manifest with:

```text
CHECKPOINT_KIND = GOVERNANCE_RECONCILIATION_CHECKPOINT
PARENT_HEAD = <parent>
PRESERVED_UNSTAGED_RECOVERY_CANDIDATES = <exact explicitly permitted candidates>
HUMAN_PRESERVATION_AUTHORIZATION = YES
PRESERVATION_SCOPE = EXPLICIT
PHASE_MANIFEST = <manifest path>
PRESERVED_PATHS = <one derived path per line>
UNSTAGED_RECOVERY_PATHS = <one derived path per line>
EXCLUDED_DIRS = .pi/; .codex/; node_modules/
TICKET_STATE_MUTATIONS = 0
PRODUCTION_FILES_CHANGED = 0
TEST_FILES_CHANGED = 0
CHECKS = PASS
CHECKPOINT_COMMIT_MESSAGE = checkpoint(governance): preserve workflow reconciliation
```

5. Stage exactly the manifest's effective path set. Never stage any
   `unstagedRecovery` candidate. Never use `git add .` or `git add -A`.
6. Verify staged paths equal the manifest's effective path set and recovery
   candidates remain unstaged.
7. Run `git diff --cached --check`.
8. Create exactly one local commit using the manifest's `commitMessage`.
9. Verify the new commit has the captured parent and only manifest paths.
10. Do not push, merge, publish, reset, clean, stash, mark DONE, or start the
    ticket remediation in this operation.

## Completion

Return:

```text
CHECKPOINT_COMPLETE
GOVERNANCE_CHECKPOINT_COMPLETE
CHECKPOINT_HEAD = <new commit>
PARENT_HEAD = <parent>
PRESERVED_PATHS = <count>
TICKET_STATE_MUTATIONS = 0
PRODUCTION_FILES_CHANGED = 0
TEST_FILES_CHANGED = 0
NEXT_AUTHORIZED_OPERATION = workflow-controller-replan
```

If any precondition, check, path, or parent verification fails, return
`GOVERNANCE_CHECKPOINT_BLOCKED` with the exact blocker and do not create a
commit.
