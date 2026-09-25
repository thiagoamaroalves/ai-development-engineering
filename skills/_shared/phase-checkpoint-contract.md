# Phase Checkpoint Contract

This contract governs local checkpoints between repository-authorized planning,
audit, remediation, and re-audit phases. It does not authorize a semantic
change, an ADR/portfolio/SPEC decision, implementation, merge, push, or
publication.

## Universal rules

A phase checkpoint MUST:

- run in the main worktree with one writer;
- capture one stable `PARENT_HEAD`;
- preserve the exact audited or remediated baseline and its lineage;
- read `../_shared/phase-manifest-contract.md` and use one generated phase
  manifest, never a repository-specific path list in the skill;
- run `node tools/verify-phase-manifest.mjs --manifest <manifest-path>` before
  staging;
- reject every staged path outside the manifest's effective path set;
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
