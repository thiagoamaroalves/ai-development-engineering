---
name: workflow-checkpoint
description: Create one guarded local Git checkpoint from the canonical checkpoint skill.
tools: read, grep, find, ls, bash, write, edit
inheritProjectContext: true
inheritSkills: true
defaultContext: fresh
thinking: high
---

Execute exactly one checkpoint operation selected by the controller. The
operation must be either `checkpoint-implemented-ticket`, `checkpoint-governance-workspace`,
`checkpoint-component-spec-audit`, `checkpoint-component-spec-conformance`,
`checkpoint-component-spec-remediation`, `checkpoint-component-gap-matrix-generation`,
`checkpoint-component-gap-matrix-audit`,
`checkpoint-component-gap-matrix-conformance`,
`checkpoint-component-gap-matrix-remediation`,
`checkpoint-component-implementation-plan-generation`,
`checkpoint-component-implementation-plan-audit`,
`checkpoint-component-implementation-plan-conformance`,
`checkpoint-component-implementation-plan-remediation`,
`checkpoint-component-implementation-tickets-generation`,
`checkpoint-component-implementation-tickets-conformance`. Execute no other
operation. The ticket-set audit and remediation checkpoint operations are
executed directly by the workflow extension's deterministic driver and must not
be delegated to this agent. Read the complete
selected skill and every referenced shared contract, including the phase
manifest contract. A local commit is explicitly authorized only within that
skill and its phase manifest. If the controller-supplied manifest does not yet
exist, derive it from the canonical source, current HEAD, exact dirty inventory,
and operation scope before validation; never reuse a manifest from another HEAD
or operation and never overwrite historical evidence. Validate the parent
HEAD, manifest source digests, staged paths, checkpoint marker, and commit
parent. Permit intentional two-space Markdown hard breaks only inside
independent audit Markdown artifacts; reject trailing whitespace elsewhere.
When bounded operation input includes `preserveUnstagedRecoveryPaths`, include
that exact set in `paths.unstagedRecovery` and leave every listed path
unchanged and unstaged; do not add or omit recovery paths.
When bounded operation input includes `phaseMarkerPath`, use that exact path as
`paths.marker`; never overwrite a different historical marker.
Set the receipt's `gateArtifactPath` to that marker path and include the exact
same path in `artifactPaths`.
Run in the active Git worktree selected by the workflow invocation. A linked
worktree is valid; never require the repository's primary checkout or `main`
branch. At intake, record `git rev-parse --show-toplevel`,
`git rev-parse --absolute-git-dir`, `git rev-parse --symbolic-full-name HEAD`,
and `git rev-parse HEAD`; verify the same active worktree root, Git directory,
symbolic branch identity, and parent HEAD before staging and before committing.
Do not switch branches or create, move, remove, or select another worktree.
Never push, merge, publish, reset, clean, mark DONE, or include unrelated files.
If any manifest, lineage, test, or topology condition is uncertain, stop with
`CHECKPOINT_BLOCKED` and do not commit.

The active shell may resolve a different Node.js version than the Pi process.
This repository's `npm test` uses Node's native TypeScript stripping, which is
unavailable in the default Node.js 22.22.1 runtime. Before running checkpoint
checks, confirm the compatible runtime with
`npm exec --yes --package=node@24.21.0 -- node --version`, then run the required
test suite as `npm exec --yes --package=node@24.21.0 -- npm test`. If that runtime
cannot be provisioned or the test still fails, report the exact blocker and do
not commit.
