# Phase Checkpoint Contract

This contract governs local checkpoints between repository-authorized planning,
audit, remediation, and re-audit phases. It does not authorize a semantic
change, an ADR/portfolio/SPEC decision, implementation, merge, push, or
publication.

## Universal rules

A phase checkpoint MUST:

- run in the active Git worktree selected by the workflow invocation, whether
  that worktree is the repository's primary checkout or a linked worktree;
- keep one workflow writer in that active worktree and never switch, create,
  move, remove, or select a different worktree as part of the checkpoint;
- capture the active worktree root (`git rev-parse --show-toplevel`), Git
  directory (`git rev-parse --absolute-git-dir`), symbolic branch identity
  (`git rev-parse --symbolic-full-name HEAD`), and `PARENT_HEAD` at intake;
- verify that the active worktree root, Git directory, symbolic branch identity,
  and parent HEAD are unchanged before staging and before committing;
- capture one stable `PARENT_HEAD`;
- preserve the exact audited or remediated baseline and its lineage;
- for the deterministic ticket-set audit checkpoint only, remove redundant
  line terminators after the exact current extension-owned V2 result block
  before hashing and whitespace validation; leave the report body, gate, and
  lineage fields unchanged;
- read `../_shared/phase-manifest-contract.md` and use one generated phase
  manifest, never a repository-specific path list in the skill;
- run `node tools/verify-phase-manifest.mjs --manifest <manifest-path>` before
  staging;
- reject every staged path outside the manifest's effective path set;
- require every recovery path to remain unstaged and confirm the exact staged
  set matches the effective allowlist before commit;
- reject production/test/upstream/downstream files unless the phase skill
  explicitly lists them;
- run the phase-required validation and the canonical artifact consistency
  check for routing fields before staging;
- run `git diff --cached --check`;
- allow intentional two-space Markdown hard breaks only in independent audit
  Markdown artifacts;
- create exactly one local commit with the phase skill's marker and message;
- verify the new commit has exactly the captured parent;
- never reset, clean, stash, push, merge, publish, mark DONE, or start the
  next phase.

## Target transition

A checkpoint changes Git HEAD but must preserve the semantic basis. The
orchestrator MUST treat the checkpoint result as a successful state transition,
refresh the current HEAD, and replan from canonical artifacts before dispatching
the next operation. It MUST NOT reuse pre-checkpoint operation input or reject
the next phase merely because the non-semantic checkpoint overlay changed HEAD.

## Completion contract

Every phase checkpoint returns:

```text
CHECKPOINT_COMPLETE
PHASE_CHECKPOINT_COMPLETE
CHECKPOINT_HEAD = <new commit>
PARENT_HEAD = <parent>
PRESERVED_PATHS = <count>
CANONICAL_ARTIFACT_CONSISTENCY = PASS
NEXT_AUTHORIZED_OPERATION = <canonical next operation>
```

Any uncertainty about the manifest, parent, authority, semantic basis, or
validation is a blocker and creates no commit.

The `checkpoint-component-implementation-tickets-audit` and
`checkpoint-component-implementation-tickets-remediation` operations are
executed directly by the workflow extension's deterministic checkpoint driver.
The driver validates their canonical source lineage and phase-specific report
invariants, derives the manifest and exact path set, runs required checks, and
creates the local commit. It does not delegate these mechanical checkpoint
steps to a model. A V2 checkpoint result is published only after pre-stage
validation and is retained as an authorized transition only when the exact
checkpoint commit succeeds.
