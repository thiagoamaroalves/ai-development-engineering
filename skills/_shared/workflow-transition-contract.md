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

Every operation appends one terminal block to its `gateArtifactPath`:

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
structured fields declared by the catalog.

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
after an interruption to `controllerEntry.sameOperationResume`; checkpoints
cannot resume through that list. Every successor must be an existing top-level
workflow skill or one of `COMPLETE`, `HUMAN_REQUIRED`, and
`RECOVERY_CONTROLLER`. Internal specialist audits are not top-level operations.

Keep audit findings, authority sufficiency, root-cause analysis, remediation
content, and human decisions within their owning skills. Routing consumes their
canonical result; it does not recreate their judgment.
