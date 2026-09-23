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
clean, stash, or rewrite a path that is not explicitly in the allowlist.

## Authorized preservation scope for this repository

For the current governance reconciliation, the explicit allowlist is:

```text
.gitignore
README.md
docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-001-envelope-schema-contract.md
docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-003-registry-entry-reconstruction.md
docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-004-contract-verdict-failure-semantics.md
docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-006-manifest-completeness-freeze.md
docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-007-manifest-identity-reconstruction-retry.md
docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-009-historical-original-basis-replay.md
docs/tickets/SPEC-EXEC-001/README.md
docs/tickets/SPEC-EXEC-001/implementation-ticket-audit.md
docs/tickets/SPEC-EXEC-001/implementation-ticket-remediation.md
skills/**
tools/**
docs/workflow-checkpoints/SPEC-EXEC-001-governance-reconciliation.md
```

`skills/**` is the canonical versioned source. `.codex/`, `.pi/`,
`node_modules/`, production source, tests, and unrelated ticket paths are not
included. Codex mirror changes remain generated/ignored and are not committed
by this checkpoint.

Before staging, verify every current non-ignored dirty path is either in this
allowlist or the operation is blocked. A missing expected path is allowed only
when it is not currently dirty; an unexpected path is never silently omitted.

## Checkpoint protocol

1. Capture `PARENT_HEAD = git rev-parse HEAD`.
2. Re-read the complete current dirty-path inventory.
3. Run `npm test`, `npm run typecheck`, `npm run verify:audit-governance`, and
   `npm run verify:skill-mirror`.
4. Write the reconciliation marker at the exact allowlisted path above with:

```text
CHECKPOINT_KIND = GOVERNANCE_RECONCILIATION_CHECKPOINT
PARENT_HEAD = <parent>
HUMAN_PRESERVATION_AUTHORIZATION = YES
PRESERVATION_SCOPE = EXPLICIT
ALLOWLIST = <one path per line>
EXCLUDED_DIRS = .pi/; .codex/; node_modules/
TICKET_STATE_MUTATIONS = 0
PRODUCTION_FILES_CHANGED = 0
TEST_FILES_CHANGED = 0
CHECKS = PASS
CHECKPOINT_COMMIT_MESSAGE = checkpoint(governance): preserve workflow reconciliation
```

5. Stage only the exact allowlisted paths. Never use `git add .` or `git add
   -A`.
6. Verify staged paths are a subset of the allowlist and contain no source,
   test, `.pi/`, `.codex/`, `node_modules/`, or unrelated ticket path.
7. Run `git diff --cached --check`.
8. Create exactly one local commit:

```text
checkpoint(governance): preserve workflow reconciliation
```

9. Verify the new commit has the captured parent and only the allowlisted paths.
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
