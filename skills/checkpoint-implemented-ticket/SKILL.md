---
name: checkpoint-implemented-ticket
description: >
  Create a guarded local Git checkpoint for one authorized implemented-ticket
  workflow state. Commit only an allowlisted implementation, test, evidence,
  audit, remediation, or ticket-state slice, preserve the canonical target and
  lineage, and never push, merge, publish, mark DONE, or broaden scope.
metadata:
  short-description: Create an allowlisted local workflow checkpoint commit
---

# Checkpoint Implemented Ticket

Create one local, auditable Git checkpoint without changing ticket semantics.
This skill is the only workflow operation authorized to create a commit.

Read completely:

- `skills/_shared/workflow-execution-topology-contract.md`;
- `skills/_shared/implementation-audit-routing-contract.md`;
- `skills/_shared/baseline-drift-remediation-contract.md`;
- `skills/_shared/remediation-preflight-contract.md`;
- the target ticket and index;
- the latest canonical implementation audit, when present;
- the latest implementation-remediation artifact, when present.

## Operating mode

```text
CHECKPOINT_ONLY
MAIN_WORKTREE_ONLY
ALLOWLIST_REQUIRED
SINGLE_WRITER
LINEAGE_PRESERVING
NO_SCOPE_EXPANSION
NO_UPSTREAM_AUTHORITY_CHANGE
NO_PUSH
NO_MERGE
NO_PUBLISH
NO_DONE_TRANSITION
```

## Preconditions

Require:

```text
executionIsolation = main
HEAD is stable at intake
one target ticket is identified
no unresolved unrelated working-tree change is included
```

Stop with `CHECKPOINT_BLOCKED` when the target, scope, allowlist, or parent
state cannot be determined. Never commit a mixed or ambiguous working tree.

## Checkpoint kinds

Select exactly one kind from the current canonical state:

```text
IMPLEMENTATION_CHECKPOINT
AUDIT_CHECKPOINT
REMEDIATION_CHECKPOINT
FINALIZATION_CHECKPOINT
```

- `IMPLEMENTATION_CHECKPOINT`: implementation, required tests, ticket-local
  evidence, and authorized ticket/index state are ready before the first
  independent audit.
- `AUDIT_CHECKPOINT`: a complete current canonical implementation audit and its
  specialist evidence are ready to preserve together with the exact production
  and test implementation state that was audited. This creates the immutable
  Git target for the next phase; do not omit audited implementation files.
- `REMEDIATION_CHECKPOINT`: finding-driven production/test remediation,
  remediation evidence, and the required `VALIDATION_REQUIRED` state are ready
  before re-audit.
- `FINALIZATION_CHECKPOINT`: only the finalization skill may authorize this
  kind; this skill never changes a ticket to `DONE`.

For a `FINALIZATION_CHECKPOINT`, consume the finalization artifact's
`DOWNSTREAM_RECONCILIATION_REQUIRED` field. When it is `YES`, the checkpoint
must record `NEXT_AUTHORIZED_OPERATION = audit-component-implementation-tickets`
and must reject `design-ticket-implementation` or `implement-ready-tickets` as
the next operation. The checkpoint preserves the finalization handoff; it does
not promote downstream ticket state.

For `REMEDIATION_CHECKPOINT`, missing, `NO`, `MISSING`, or unresolved
preflight fields are a checkpoint blocker:

```text
REMEDIATION_PREFLIGHT = BLOCKED
REMEDIATION_CHECKPOINT = NOT_AUTHORIZED
NO_COMMIT = YES
```

The checkpoint kind and exact path allowlist must be recorded in the checkpoint
marker before committing.

## Allowlist rules

Build an exact path allowlist from the ticket and current canonical artifact.
At minimum:

- include only the target ticket's implementation, tests, evidence, audit,
  remediation, checkpoint marker, and explicitly derived index paths
  appropriate to the checkpoint kind;
- when the current workflow created or updated the target ticket's approved
  Implementation Design, include that exact design artifact in the allowlist;
  its being untracked before this checkpoint is expected and is not a design
  approval failure;
- for `AUDIT_CHECKPOINT`, include the exact implementation and test files
  represented by the audit target fingerprint plus the audit artifacts;
- exclude `.pi/`, `skills/`, `.codex/`, `node_modules/`, unrelated tickets,
  unrelated source/tests, and upstream ADR/SPEC/Gap Matrix/Plan authority;
- reject any staged or unstaged path outside the allowlist;
- reject path deletion unless the ticket's frozen scope explicitly authorizes
  it and replacement proof is present;
- do not use `git add .`, `git add -A`, or an equivalent broad staging command.

Use `git status --short`, `git diff --name-status`, and untracked-file
inspection to classify the complete working tree before staging. Existing
unrelated changes remain untouched and are not silently included.

## Checkpoint marker

Create one marker under:

```text
docs/tickets/<SPEC-ID>/<TICKET-ID>-checkpoints/
```

The marker must contain:

```text
CHECKPOINT_KIND = <kind>
TICKET_ID = <ticket>
PARENT_HEAD = <current HEAD>
CHECKPOINT_SCOPE = <frozen scope>
ALLOWLIST = <one path per line>
EXCLUDED_DIRS = .pi/; skills/; .codex/; node_modules/
SOURCE_AUDIT = <path or NOT_APPLICABLE>
SOURCE_REMEDIATION = <path or NOT_APPLICABLE>
NEXT_AUTHORIZED_OPERATION = <operation derived from canonical state>
DOWNSTREAM_RECONCILIATION_REQUIRED = <YES|NO for FINALIZATION_CHECKPOINT>
CHECKPOINT_COMMIT_MESSAGE = <exact message>
```

The marker is itself included in the allowlist and commit. Git history is the
source of truth for the resulting commit SHA; do not invent or self-certify a
post-commit SHA inside the pre-commit marker.

## Commit protocol

1. Capture `PARENT_HEAD = git rev-parse HEAD`.
2. Revalidate the ticket, canonical audit/remediation state, and allowlist.
3. Run required checks for the checkpoint kind:
   - implementation/remediation: required focused tests and typecheck;
   - remediation: additionally verify the complete
     `REMEDIATION_PREFLIGHT = PASS` record, campaign matrix, expanded-radius
     decision, negative-witness evidence, semantic progress, and regression
     self-checks before writing the marker;
   - audit-only: artifact completeness plus staged-path whitespace checking
     that excludes intentional Markdown hard breaks in audit artifacts;
   - finalization: only checks explicitly authorized by finalization.
4. Write the marker.
5. Stage only the exact allowlisted paths.
6. Verify staged paths against the allowlist and verify no staged authority,
   workflow-runtime, unrelated, or destructive path exists.
7. Run `git diff --cached --check` for implementation, test, checkpoint-marker,
   and non-audit evidence paths. Audit Markdown artifacts may contain
   intentional two-space Markdown hard breaks; do not rewrite or normalize
   independent audit evidence merely to satisfy this formatting check. Any
   trailing whitespace outside audit Markdown remains a checkpoint blocker.
8. Create exactly one local commit with the exact message:

```text
checkpoint(<SPEC-ID>/<TICKET-ID>): <checkpoint kind and round>
```

9. Verify the new commit has `PARENT_HEAD` as its single parent, record the new
   SHA in the execution result, and verify the committed path list.
10. Do not push, merge, publish, reset, clean, or alter another ticket.

## Completion contract

Return:

```text
CHECKPOINT_COMPLETE
CHECKPOINT_KIND = <kind>
TICKET_ID = <ticket>
PARENT_HEAD = <sha>
CHECKPOINT_HEAD = <sha>
COMMITTED_PATHS = <count and list>
EXCLUDED_UNRELATED_CHANGES = PRESERVED
NEXT_AUTHORIZED_OPERATION = <operation>
PUSHED = NO
MERGED = NO
DONE_TRANSITION = NO
```

On any failure return:

```text
CHECKPOINT_BLOCKED
REASON = <exact reason>
NO_COMMIT = YES
```

A successful checkpoint is historical evidence only. It does not approve the
implementation, replace an independent audit, remediate findings, or mark the
ticket `DONE`.
