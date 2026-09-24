# Workflow Execution Topology Contract

This contract defines where repository-authorized workflow operations may mutate
files. It does not authorize commits, merges, pushes, publication, or scope
expansion.

## Repository topology

```text
WORKTREE_ALLOCATION_AUTHORITY = NONE
BRANCH_MERGE_AUTHORITY = NONE
COMMIT_AUTHORITY = LOCAL_CHECKPOINT_ONLY
MAIN_TREE_TICKET_MUTATION = AUTHORIZED_WITH_GUARDS
```

The repository has no worktree allocation or merge protocol. Therefore the
workflow must not select `worktree` for an otherwise authorized ticket-scoped
implementation, remediation, or structural review operation.

## Isolation selection

Use:

```text
main
```

for an authorized ticket-scoped mutation when the following guards hold:

- the current HEAD is stable before and after the operation;
- one workflow writer owns the working tree for the operation;
- the ticket scope, approved design, ownership, and dependency graph remain
  frozen;
- changed files remain within the ticket's authorized implementation/test and
  evidence surfaces;
- workspace drift or unrelated changes stop the operation;
- no merge, push, publication, branch deletion, or destructive repository
  operation is performed;
- commits occur only through the dedicated checkpoint skill, using its
  allowlist and checkpoint marker.

Use:

```text
worktree
```

only when a separate repository authority explicitly provides allocation,
branch/base selection, merge or supersession recording, conflict handling, and
cleanup. This repository currently provides none of those authorities.

Use:

```text
human_required
```

when the selected skill explicitly requires worktree isolation but no valid
worktree protocol exists. Never silently downgrade such a requirement.

An explicitly human-authorized preservation of unrelated workflow/process
changes may use `checkpoint-governance-workspace` before ticket-local mutation.
That operation has its own exact allowlist and local checkpoint protocol; it
must not be treated as permission to discard, stash, or mix unrelated changes
into a ticket checkpoint.

Phase-specific checkpoint skills preserve audited and remediated SPEC, Gap
Matrix, Implementation Plan, and ticket-set baselines before the next mutation
or independent re-audit. They are not interchangeable with
`checkpoint-implemented-ticket`; each exact allowlist and canonical next
operation must be evidenced.

## Controller rule

For `implement-ready-tickets`, `remediate-implemented-ticket`, and
`review-implemented-ticket-structure`, select `executionIsolation = main` when
the operation is authorized and the guards above are satisfied. The absence of
worktree authority is not permission to invent a worktree; it is the reason the
repository's guarded main-tree mode is used for these ticket-local operations.

For `checkpoint-implemented-ticket`, `executionIsolation = main` is required.
That skill is the only workflow operation allowed to create a local checkpoint
commit. It must not push, merge, or publish.
