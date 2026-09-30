---
name: reconcile-legacy-checkpoint-lineage
description: >
  Establish a controlled V2 workflow basis for one current implemented-ticket
  checkpoint created before persisted result lineage was introduced. Revalidate
  its ticket marker, phase manifest, commit, parent, and preserved state, then
  preserve the proof in a canonical migration result before the normal
  implemented-ticket checkpoint writes the first V2 checkpoint result.
metadata:
  short-description: Reconcile one verified legacy ticket checkpoint
---

# Reconcile Legacy Checkpoint Lineage

This operation is available only through the catalog's explicit recovery entry.
It does not perform the audit or create a checkpoint commit.

## Preconditions

Require all of the following from the extension's validated workflow basis:

```text
BASIS.type = legacy-checkpoint
BASIS.proof.subject = the selected ticket ID
BASIS.proof.nextOperation = audit-implemented-ticket
```

The subject is a `(SPEC, current approved ticket-set revision, TICKET_ID)`
identity. A marker with the same ID from a ticket set superseded by SPEC, Gap
Matrix, Plan, or ticket revalidation is historical and must not be migrated.
If the extension reports that the checkpoint predates the current conformance
checkpoint, stop without writing a migration artifact.

The extension has already verified the current approved ticket-set generation
and conformance checkpoints, including their manifests, commits, and source
authority. It binds the ticket ID to exactly one artifact in the generated
ticket set and requires the selected ticket checkpoint to descend from the
conformant ticket-set checkpoint while preserving that exact ticket path. It
pins the ticket document digest at the migration target. This
prevents a reused ticket ID from inheriting lineage from a retired ticket
revision. It has also verified the cited checkpoint marker against the current
Git tree, its unique checkpoint commit and parent, its committed phase
manifest, its exact committed path set, its source-authority digests, its
semantic fingerprint, and that the marker and manifest remain unchanged at the
migration target HEAD. A manifest-preserved or deleted path may differ at that
HEAD only when the difference is committed in the descendant history and the
working tree matches the migration target. The extension records each such
path with its exact old and migration-target Git tree entries. The source
authority artifacts must remain unchanged. Stop if the basis is missing or if
any source field disagrees.

Do not infer or supply a checkpoint commit, manifest digest, parent, ticket
identity, or next operation. Copy these values only from the validated basis.
Never add a `WORKFLOW_RESULT_V2` block to the historical checkpoint marker.

## Migration result

Create one canonical Markdown artifact under `docs/workflow-checkpoints/` using
this path pattern:

```text
<lowercase-ticket-id>-legacy-checkpoint-lineage-<checkpoint-commit-prefix>.md
```

The commit prefix is the first 12 characters of the validated source
checkpoint commit. Do not overwrite an artifact belonging to another ticket or
source checkpoint. On same-operation recovery, preserve every earlier
`WORKFLOW_RESULT_V2` block and append the new terminal result block supplied by
the extension.

Persist:

```text
MIGRATION_KIND = LEGACY_CHECKPOINT_LINEAGE_RECONCILIATION
TICKET_ID = <selected ticket ID>
SOURCE_CHECKPOINT_MARKER = <validated marker path>
SOURCE_CHECKPOINT_KIND = <validated checkpoint kind>
SOURCE_CHECKPOINT_COMMIT = <validated checkpoint commit>
SOURCE_CHECKPOINT_PARENT_HEAD = <validated parent commit>
SOURCE_CHECKPOINT_MARKER_SHA256 = <validated marker digest>
SOURCE_PHASE_MANIFEST = <validated manifest path>
SOURCE_PHASE_MANIFEST_SHA256 = <validated manifest digest>
SOURCE_CHECKPOINT_TARGET_HEAD = <pinned migration target HEAD>
SOURCE_CHECKPOINT_PRESERVED_PATH_DRIFT = <JSON copied from the validated basis>
SOURCE_CHECKPOINT_COMMIT_MESSAGE = <validated checkpoint commit message>
CURRENT_TICKET_GENERATION_MARKER = <validated current ticket-set generation marker>
CURRENT_TICKET_GENERATION_MANIFEST = <validated current ticket-set generation manifest>
CURRENT_TICKET_GENERATION_COMMIT = <validated generation checkpoint commit>
CURRENT_TICKET_SET_CONFORMANCE_MARKER = <validated current ticket-set conformance marker>
CURRENT_TICKET_SET_CONFORMANCE_MANIFEST = <validated current ticket-set conformance manifest>
CURRENT_TICKET_SET_CONFORMANCE_COMMIT = <validated conformance checkpoint commit>
CURRENT_TICKET_PATH = <exact ticket artifact in the current generated set>
CURRENT_TICKET_SHA256 = <ticket artifact digest at the migration target>
NEXT_AUTHORIZED_OPERATION = audit-implemented-ticket
MIGRATION_VALIDATION = PASS
MIGRATION_REBASE_REQUIRED = YES
MIGRATION_GATE = LEGACY_CHECKPOINT_VALIDATED
```

The persisted gate routes only to `checkpoint-implemented-ticket`. That normal
checkpoint operation commits this migration result and creates the first
`WORKFLOW_RESULT_V2` leaf for `checkpoint-implemented-ticket` and this ticket.
It reanchors the current migration target HEAD and the subsequent audit must
inspect that complete current implementation state. Recorded descendant drift
is evidence for rebasing and re-audit; it is not approval of those changes. The
audit is dispatched only from the persisted checkpoint result.

## Required receipt

Return a complete operation receipt with:

```text
operation = reconcile-legacy-checkpoint-lineage
status = COMPLETE
gateField = MIGRATION_GATE
gateValue = LEGACY_CHECKPOINT_VALIDATED
gateArtifactPath = the new migration artifact
```

List the migration artifact in both `artifactPaths` and `changedPaths`. Do not
modify the historical marker, phase manifest, ticket implementation, tests,
audit, or remediation artifacts. Do not commit, push, merge, publish, or mark
the ticket DONE.

If the source checkpoint cannot be proved exactly, return `BLOCKED` and make no
repository change.
