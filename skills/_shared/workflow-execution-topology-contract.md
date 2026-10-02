# Workflow Execution Topology Contract

This contract defines where repository-authorized workflow operations may mutate
files. It does not authorize commits, merges, pushes, publication, or scope
expansion.

## Repository topology

```text
WORKTREE_ALLOCATION_AUTHORITY = NONE
BRANCH_MERGE_AUTHORITY = NONE
COMMIT_AUTHORITY = LOCAL_CHECKPOINT_ONLY
ACTIVE_WORKTREE_TICKET_MUTATION = AUTHORIZED_WITH_GUARDS
```

The workflow operates in the active Git worktree from which it was invoked.
That worktree may be the repository's primary checkout or any already-existing
linked worktree. Lack of worktree-allocation authority does not prohibit using
the active linked worktree. The workflow must not switch branches or create,
move, remove, or select another worktree; those actions still require a separate
repository authority.

## Isolation selection

Use:

```text
main
```

for an authorized ticket-scoped mutation or checkpoint in the current active
worktree when the following guards hold. `executionIsolation = main` means
execute directly in the current workflow invocation's checkout; it does not
mean the repository's primary checkout or the `main` branch:

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

only when a separate repository authority explicitly requires the orchestrator
to allocate or select an additional worktree and provides branch/base selection,
merge or supersession recording, conflict handling, and cleanup. This repository
currently provides none of those authorities. An already-active linked worktree
does not require `executionIsolation = worktree` and is not a blocker.

Use:

```text
human_required
```

when the selected skill explicitly requires a separate allocated worktree but
no valid worktree protocol exists. Never silently downgrade such a requirement.

An explicitly human-authorized preservation of unrelated workflow/process
changes may use `checkpoint-governance-workspace` before ticket-local mutation.
That operation has its own exact allowlist and local checkpoint protocol; it
must not be treated as permission to discard, stash, or mix unrelated changes
into a ticket checkpoint.

Phase-specific checkpoint skills preserve audited and remediated SPEC, Gap
Matrix, Implementation Plan, and ticket-set baselines before the next mutation
or independent re-audit. They are not interchangeable with
`checkpoint-implemented-ticket`; each exact allowlist and canonical next
operation must be evidenced. Every such checkpoint runs in the active worktree
and validates its manifest, staged paths, parent, and resulting commit there.

The ticket-set audit and remediation checkpoints are executed by the
orchestrator's deterministic driver, not a delegated checkpoint agent. This
does not alter their authority or widen their allowlist; it only assigns the
mechanical validation, staging, and local commit to code with explicit guards.

## Controller rule

For `implement-ready-tickets`, `remediate-implemented-ticket`, and
`review-implemented-ticket-structure`, select `executionIsolation = main` when
the operation is authorized and the guards above are satisfied. The absence of
worktree-allocation authority means the workflow stays in the active checkout;
it does not require or imply the repository's primary worktree.

For `checkpoint-implemented-ticket`, `executionIsolation = main` is required.
That skill is the only workflow operation allowed to create a local checkpoint
commit. It must not push, merge, or publish.
