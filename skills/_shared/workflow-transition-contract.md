# Workflow Transition Contract

This contract defines deterministic routing between repository workflow
operations. The machine-readable transition table in
`workflow-transitions.json` version 3 is the sole source for normal operation
edges and declares the root where workflow-result lineage is stored.
Skills remain authoritative for their domain verdicts and gates; the extension
validates those values and applies the declared edge.

## Operation result

Every top-level workflow operation returns a structured receipt:

```text
operation       exact selected skill name
subject         current canonical subject identifier
status          COMPLETE | BLOCKED | HUMAN_REQUIRED | PARTIAL | ERROR
artifactPaths   repository-relative canonical result paths
gateArtifactPath one canonical result path that owns the routed gate
gateField       field configured for this operation, or $marker
gateValue       exact current value from the canonical result
changedPaths    exact repository-relative paths changed by this operation
reason          short explanation for non-COMPLETE results
```

Every routed gate must be persisted in `gateArtifactPath`. For a configured
field, the extension reads its latest occurrence and requires it to equal
`gateValue`. A `$marker` gate uses its literal marker as `gateValue` and must
appear in the cited artifact. A receipt cannot introduce a gate that exists
only in an agent response.

## Persisted result lineage

Every operation persists one terminal block in its `gateArtifactPath`. The
selected skill or deterministic checkpoint driver normally appends it. For
`audit-component-implementation-tickets` only, the workflow extension appends
the block after it validates the complete audit receipt, exact persisted gate,
and unchanged predecessor. This keeps report content under the audit skill's
ownership while making the process metadata deterministic.

The block format is:

```text
<!-- WORKFLOW_RESULT_V2
OPERATION = <exact selected operation>
SUBJECT_ID = <exact canonical subject>
RESULT_ID = <value supplied by the extension>
SUPERSEDES_RESULT_ID = <previous current result ID supplied by the extension, or NONE>
GATE_FIELD = <configured gate field>
GATE_VALUE = <exact persisted gate value>
BASIS = <single-line JSON basis supplied by the extension>
-->
```

Copy the operation, subject, result ID, predecessor ID, gate field, and complete
`BASIS` JSON supplied by the extension exactly. Write the block in the same
Markdown artifact as the persisted gate. Preserve earlier `WORKFLOW_RESULT_V2`
blocks when updating that artifact; never rewrite or remove lineage history.
Place the block after the canonical gate so it is the artifact's terminal
workflow record.

For the ticket-set audit exception, the extension preserves the complete
existing artifact bytes and appends only this block. On an idempotent retry it
may normalize redundant line terminators after that exact extension-owned
terminal block; it does not rewrite report content before the block.

The extension resolves records by the exact `(OPERATION, SUBJECT_ID)` pair.
`SUPERSEDES_RESULT_ID` forms a single linked chain: it must identify the prior
current result, and the chain must have one root, no forks, no cycles, and one
leaf. The leaf's artifact path and gate must match the controller's cited
basis. Each result also records its direct basis: either an upstream result
identity and source fields, or the exact intake artifacts and their selected
identity/revision fields. The extension recursively confirms that each upstream
result is still current and that captured source fields have not changed.
Concurrent, stale, or disconnected results stop before dispatch. Filenames,
timestamps, and workspace-wide hashes do not select the leaf. The source-field
snapshot covers declared subject, required, and revision fields plus recognized
machine fields for identity, revision, round, version, audit target, and gate;
it does not hash prose or unrelated workspace files.

When a current `audit-component-implementation-tickets` operation creates its
successor, that new result may supersede an earlier ticket-set audit already
captured in its valid entry-basis chain. The extension accepts only those exact
historical audit result IDs while validating that successor, because the new
audit output replaces the old report. It continues to validate the current
checkpoint/remediation source chain and all other source snapshots. This rule
does not authorize entry from a stale audit result.

Transition artifacts without a valid result block cannot establish currentness
and are rejected before semantic preflight. Direct intake artifacts are source
inputs rather than operation results; their catalog entry declares exact
`subjectFields` that must bind the selected subject. Intake entries may also
declare `revisionFields`; these are recorded with required fields so edits to
the selected entry basis stop later operations.

A `COMPLETE` status means the skill produced its full canonical result; the
result may still carry a blocked domain gate that routes to an upstream skill
or exceptional recovery in the table. `BLOCKED` means no complete result was
produced and stops the workflow. `HUMAN_REQUIRED` also stops. `PARTIAL` and
`ERROR` enter exceptional recovery.

A receipt cannot choose a next operation. The extension resolves the next
edge from the transition table. `changedPaths` must exactly match the
Git-visible changes observed during the operation (except local checkpoint
operations, which are validated against their committed path manifest).

A complete result with an unknown, contradictory, missing, or stale gate
enters exceptional recovery. Recovery may resume an interrupted authorized
operation or select a catalog-authorized upstream prerequisite; it cannot
skip or override a canonical blocker.

## Routing authority

The `workflow-controller` selects the entry operation and objective scope at
intake and supplies an `entryBasis` for every selected operation. A transition
basis names its source operation, subject, artifact, gate field, and exact gate
value; the artifact must also be cited in `evidenceFiles`. The extension
rereads it, requires the artifact itself to contain the canonical subject, and
confirms the persisted gate authorizes the selected operation.
Direct intake evidence is permitted only for operations explicitly declared in
`controllerEntry.initial` or `controllerEntry.recovery`; it must exist inside
the repository, satisfy its subject binding rule, and contain any required
structured fields declared by the catalog. The governance checkpoint's direct
initial route is usable only when the current request explicitly authorizes the
preservation; its phase manifest must then record the exact approved paths and
target HEAD. A dirty workspace alone never supplies that authorization.

For normal completed operations, the extension validates the receipt, the
persisted result block, and its predecessor link, then follows
`workflow-transitions.json`. Before executing that successor, it rereads the
cited source artifact, resolves the current result-lineage leaf for the exact
operation and subject, and confirms the gate field/value and catalog edge.
On recovery, code permits only the failed
operation when `sameOperationResume` declares it resumable, a catalog ancestor
of the failed operation with its own valid entry basis, or a direct recovery
entry explicitly declared in the catalog. The controller is called again only
for an operational failure, a blocked preflight that may require an earlier
authorized step, an interrupted candidate, or a state the transition table
cannot safely represent.

Legacy implemented-ticket checkpoints are eligible for one explicit recovery
path: `reconcile-legacy-checkpoint-lineage`. The extension validates the
current generated ticket set and its independent conformance checkpoint,
including their manifests, commits, and source authority. The ticket ID must
resolve to exactly one artifact in that generated set, and the legacy ticket
checkpoint must descend from the conformance checkpoint while preserving that
exact ticket path. Its document digest is pinned at the migration target. A
reused ID from an earlier SPEC decomposition is historical and cannot establish
lineage for the current ticket. The extension
then validates the ticket checkpoint marker, its phase manifest, the exact
single-parent checkpoint commit and commit message, the manifest's complete
committed path set, source-authority digests, and the unchanged marker and
manifest at the pinned migration HEAD. Committed descendant changes to manifest-preserved or
deleted paths are captured with their old and migration-target Git tree entries;
the migration target must match the working tree. The migration records this
proof in its own V2 result and requires a new checkpoint to reanchor the current
HEAD before the original audit successor runs. That audit examines the complete
current implementation state, including any recorded descendant drift. The
normal `checkpoint-implemented-ticket` operation then commits the migration
report and a new checkpoint marker carrying the first V2 result for that exact
ticket and operation. The audit is dispatched only from that new persisted
checkpoint result. No agent may backfill V2 lineage into a historical
checkpoint marker by hand.

A current component ticket-set audit that predates V2 lineage has a separate
recovery route: `reconcile-legacy-ticket-set-audit-lineage`. The extension
validates the current generation and conformance checkpoints, their manifests,
commits, ancestry, source digests, the current conformant audit, and exactly one
current ready-ticket design bound to that audit. The migration report receives
its own V2 result and may route only to a fresh independent ticket-set audit.
It must not rewrite the historical audit or checkpoint, and must leave any
implemented-ticket audit result untouched.

Checkpoint operations retain their local commit authority and phase-manifest
protocol. Their `NEXT_AUTHORIZED_OPERATION` value is checked against the
configured edge before dispatch. The specialized implemented-ticket audit
retains its independently validated canonical `NEXT_AUTHORIZED_OPERATION` and
post-checkpoint handoff.

## Adding an operation

Add the operation, its current result field or marker, its accepted values,
and each normal successor to `workflow-transitions.json`. Every operation must
be reachable from a catalog edge or declared in `controllerEntry.initial` or
`controllerEntry.recovery`. Direct entries bind a cited artifact to the
selected subject; `requiredFields` declares exact machine-checkable values
such as explicit preservation authorization. Add operations that may resume
after an interruption to `controllerEntry.sameOperationResume`. Only the
deterministic component ticket-set audit and remediation checkpoints may resume
there, and only after their failure-atomic driver has removed its uncommitted
marker and manifest and restored the prior index. A failed ticket-set
checkpoint cannot route to an ancestor operation such as the audit that
produced its source; it must retry that same checkpoint or stop. Other
checkpoints cannot resume through the list. Every successor must be an existing
top-level workflow skill or one of `COMPLETE`, `HUMAN_REQUIRED`, and
`RECOVERY_CONTROLLER`. Internal specialist audits are not top-level operations.

Keep audit findings, authority sufficiency, root-cause analysis, remediation
content, and human decisions within their owning skills. Routing consumes their
canonical result; it does not recreate their judgment.
