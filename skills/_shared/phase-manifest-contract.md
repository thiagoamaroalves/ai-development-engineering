# Phase Manifest Contract

A phase manifest is the machine-readable, phase-local authority for the paths
that a checkpoint may preserve. It replaces repository-specific path lists in
skills. A manifest is derived from the canonical producer result, the current
authority artifact, the pinned semantic baseline, and the actual working-tree
candidate. It is not an arbitrary operator-supplied allowlist.

## Required manifest shape

The manifest MUST be JSON with this shape:

```json
{
  "schemaVersion": 1,
  "manifestKind": "PHASE_CHECKPOINT",
  "phaseId": "<phase identifier>",
  "operation": "<canonical operation>",
  "subject": {
    "id": "<component or ticket identity>",
    "type": "<component|ticket|workspace>"
  },
  "sourceAuthority": [
    {
      "path": "<repository-relative canonical artifact>",
      "sha256": "<64 lowercase hex digest>"
    }
  ],
  "target": {
    "head": "<40 lowercase hex commit>",
    "semanticFingerprint": "<stable fingerprint>"
  },
  "paths": {
    "manifest": "<repository-relative manifest path>",
    "preserve": ["<repository-relative path>"],
    "delete": ["<repository-relative path>"],
    "unstagedRecovery": ["<repository-relative candidate path>"],
    "marker": "<repository-relative checkpoint marker path>"
  },
  "nextAuthorizedOperation": "<canonical operation>",
  "commitMessage": "<exact checkpoint commit message>"
}
```

All paths MUST be repository-relative, normalized with `/`, unique across all
path collections, and free of `..`, absolute prefixes, `.git/`, and control
characters. `manifest` and `marker` MUST be included in the effective path set.
`preserve` contains added or modified artifacts; `delete` contains only
explicitly authorized deletions. `unstagedRecovery` contains explicitly
permitted dirty candidates that this checkpoint must leave untouched and
unstaged. A path MUST NOT occur in more than one collection.

`sourceAuthority` MUST identify the canonical artifact(s) whose current content
and gate authorize the phase. Their SHA-256 digests MUST be recomputed at
checkpoint time. `target.head` MUST equal the captured `PARENT_HEAD`. The
manifest MUST record the producer's complete result and the exact next
operation; a candidate that lacks either is incomplete and cannot be
checkpointed.

## Derivation and validation

The producer or checkpoint operation MUST derive the manifest from canonical
artifacts and the current candidate. It MUST NOT hand-maintain a project-
specific list in a skill or accept a path list from prose. The controller passes
only the manifest path and phase identity; the manifest content is validated
against the source authority and current Git state. The manifest path may be
absent at operation intake; the owning checkpoint operation is authorized to
create it before validation, but it may not invent authority or broaden scope.

Before staging, run:

```text
node tools/verify-phase-manifest.mjs --manifest <manifest-path>
```

The verifier MUST use the active worktree containing the current workflow
invocation. `git rev-parse --show-toplevel` from that invocation resolves the
repository root for this run; do not substitute the repository's primary
worktree, common Git directory, another checkout, or a branch with the same
commit. The manifest and its dirty-path inventory are evaluated only against
this active worktree's files and index.

The verifier MUST:

1. load and schema-check the manifest;
2. resolve every path below the repository root;
3. verify `target.head` equals `git rev-parse HEAD`;
4. recompute every `sourceAuthority[].sha256`;
5. enumerate tracked changes relative to HEAD and non-ignored untracked files;
6. require the exact dirty-path set to equal the effective manifest path set
   plus `unstagedRecovery`;
7. require every recovery candidate to remain outside the staged effective set;
8. reject staged paths outside the effective set;
9. reject duplicate, missing, unexpected, or undeclared deletions; and
10. return `PHASE_MANIFEST_VALID = PASS` only when every check succeeds.

The checkpoint then stages exactly the manifest's effective path set, reruns
cached validation and `git diff --cached --check`, and creates the commit
specified by `commitMessage`. The manifest is committed as evidence. A
manifest mismatch is a blocker; do not broaden the set, omit a dirty path,
reset, clean, stash, or silently rewrite the candidate.

## Portability rule

Skills MUST describe phase policy, authority, and invariants only. They MUST
NOT contain project, component, ticket, filename, or directory literals for an
individual repository. Project-specific paths belong only in a generated phase
manifest and its canonical source artifacts.
