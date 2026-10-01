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
NO_PRODUCT_PRODUCTION_OR_TEST_MUTATION_IN_SCOPE = YES
NO_UPSTREAM_AUTHORITY_MUTATION_IN_SCOPE = YES
SINGLE_WRITER = YES
```

The governance checkpoint may include regression tests for the workflow
orchestrator only when they are directly required by an explicitly authorized
workflow-route change and are listed in the phase manifest. These tests must
remain under `.pi/extensions/workflow-orchestrator/test/`. Product tests and
tests outside that exact directory remain prohibited in this checkpoint.
`TEST_FILES_CHANGED` continues to mean product-test files; the separately
named workflow-orchestrator field records the explicitly permitted control-
plane regression tests.

The workflow controller must cite the current dirty-path inventory and this
skill. Never infer preservation from a dirty workspace. Never discard, reset,
clean, stash, or rewrite a path that is not explicitly in the phase manifest.
An interrupted remediation candidate or incomplete prior phase manifest may be
explicitly preserved unstaged in `paths.unstagedRecovery`; it must never be
included in this governance commit. If operation input supplies
`preserveUnstagedRecoveryPaths`, include those exact paths in
`paths.unstagedRecovery` without modifying them.

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
manifest. Any other dirty path blocks. An incomplete manifest from an earlier
attempt must not be overwritten; preserve it as an unstaged recovery candidate
and use the fresh manifest path supplied by the controller. The manifest itself
is the durable record of the human-approved scope; the skill must remain
project-independent.

## Checkpoint protocol

1. Capture `PARENT_HEAD = git rev-parse HEAD`.
2. Re-read the complete current dirty-path inventory.
3. Run `npm test`, `npm run typecheck`, `npm run verify:audit-governance`, and
   `npm run verify:skill-mirror`. Stop if any check fails.
4. Write the reconciliation marker declared by the manifest with
   `CHECKS = PENDING` and `PHASE_MANIFEST_VALID = PENDING`. This first write
   materializes the declared output path without claiming the manifest check
   has passed.
5. Run the phase-manifest verifier. It must pass before staging. Then update
   the marker to `CHECKS = PASS` and `PHASE_MANIFEST_VALID = PASS`, and rerun
   the verifier to confirm the final dirty-path set.

The final marker must contain:

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
WORKFLOW_ORCHESTRATOR_TEST_FILES_CHANGED = <exact count of manifested files under .pi/extensions/workflow-orchestrator/test/>
CHECKS = PASS
PHASE_MANIFEST_VALID = PASS
CHECKPOINT_COMMIT_MESSAGE = checkpoint(governance): preserve workflow reconciliation
```

6. Stage exactly the manifest's effective path set. Never stage any
   `unstagedRecovery` candidate. Never use `git add .` or `git add -A`.
7. Verify staged paths equal the manifest's effective path set and recovery
   candidates remain unstaged.
8. Run `git diff --cached --check`.
9. Create exactly one local commit using the manifest's `commitMessage`.
10. Verify the new commit has the captured parent and only manifest paths.
11. Do not push, merge, publish, reset, clean, stash, mark DONE, or start the
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
WORKFLOW_ORCHESTRATOR_TEST_FILES_CHANGED = <exact count of manifested files under .pi/extensions/workflow-orchestrator/test/>
NEXT_AUTHORIZED_OPERATION = workflow-controller-replan
```

If any precondition, check, path, or parent verification fails, return
`GOVERNANCE_CHECKPOINT_BLOCKED` with the exact blocker and do not create a
commit.
