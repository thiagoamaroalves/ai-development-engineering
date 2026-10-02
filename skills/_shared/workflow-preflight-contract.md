# Workflow Preflight Contract

Every delegated operation selected by `workflow_orchestrate` passes
deterministic checks and a short read-only semantic preflight before its full
skill execution, except the component implementation-ticket audit. That
read-only audit begins after deterministic extension checks and owns its own
semantic preconditions in Section 1; it can stop with its canonical blocked
outcome before auditing the ticket set. The two implementation-ticket-set
checkpoint operations are also exceptions: the extension's deterministic
checkpoint driver performs their complete machine-checkable preconditions and
path/lineage validation directly. Preflight is an intake gate, not a shortened
audit or remediation.

For component implementation-ticket audit and remediation, the extension may
provide a bounded static analysis of ticket inventory, IDs, index parity,
status fields, internal dependency/blocker targets, reciprocity, graph cycles,
and source fingerprints. This is advisory evidence only. `COMPLETE` means the
analysis inputs were parsed, not that the ticket set conforms. `INCOMPLETE`
means its observations are partial.

For the audit, this analysis is candidate evidence for the full 54-check
independent checklist; it does not replace any check or semantic judgment. For
remediation, it is only a pre-remediation snapshot. The remediation operation
still performs its semantic preflight, validates the current audit and baseline
before writing, revalidates every finding, and recomputes affected facts after
ticket or index changes. The initial snapshot never proves the result.

## Deterministic extension checks

Before semantic preflight or deterministic checkpoint execution, the extension
verifies the selected operation against the local catalog, validates cited
paths and bounded input,
pins the current HEAD, and checks that the operation's skill exists with the
matching declared name. For controller-selected entry and recovery operations,
it requires a structured `entryBasis`, resolves the current
`WORKFLOW_RESULT_V2` lineage leaf by exact operation and subject, verifies the
cited source gate and catalog edge, and requires the leaf to live in the cited
artifact. Direct intake binds identity through its catalog-declared exact
`subjectFields` and captures declared `revisionFields` plus required fields.
Recovery candidates must be the failed operation when its catalog policy
allows resumption, an ancestor on its deterministic workflow path, or an
explicitly declared direct recovery entry. For every
catalog-routed successor, it rereads the previous operation's cited gate
artifact, confirms the exact gate field/value and current result-lineage leaf,
and resolves the same successor from `workflow-transitions.json`. Branched,
disconnected, or legacy unversioned transition results stop before dispatch.
Each persisted result also carries a direct basis. Code follows upstream result
IDs recursively and compares selected identity, revision, round, audit-target,
and gate fields on the cited source artifacts. A changed or superseded upstream
basis stops before semantic preflight. This enforces declared artifact lineage
without a repository-wide content hash. When the component ticket-set audit
produces a current re-audit result, code allows that result to supersede only
historical ticket-set audit ancestors in the exact basis chain that was current
before dispatch. It still checks the captured checkpoint/remediation chain and
rejects stale audit entry bases.

An unversioned implemented-ticket checkpoint is not a transition basis. The
only migration entry is the declared recovery operation
`reconcile-legacy-checkpoint-lineage`; its code-validated basis binds the exact
current conformant ticket-set revision and one current ticket marker, phase
manifest, checkpoint commit, parent, committed path set, source digests, and
pinned migration HEAD. A marker from an earlier generated ticket set cannot be
migrated merely because its `TICKET_ID` was reused. It records committed
descendant changes to manifest-preserved or deleted paths and requires the
working tree to match that migration target. The migration operation writes a
canonical proof result. A new ordinary implemented-ticket checkpoint reanchors
the current HEAD and commits its first V2 result before the legacy handoff's
audit successor can run.

An unversioned component ticket-set audit has a distinct recovery migration,
`reconcile-legacy-ticket-set-audit-lineage`. Its code-validated basis must bind
the current generation and conformance checkpoint commits, the source audit,
the one current ready ticket and its implementation design, all source
digests, and the pinned migration HEAD. It refuses migration when a current V2
ticket-set audit result already exists. The migration report is a separate
artifact and routes only to a fresh independent ticket-set audit; it must not
modify any implemented-ticket audit result.

After an operation, the extension requires its structured receipt gate and
predecessor link to match the newly appended current result record in the cited
canonical artifact. It compares
the receipt's changed paths with Git-visible changes, validates checkpoint
parentage and manifests, and routes only through the transition catalog.

These checks fail before the next operation's semantic preflight or execution.
The controller is called again only when an error or semantic blocker requires
recovery from current canonical state.

## Semantic preflight

The preflight agent reads the selected skill's complete preconditions and only
the evidence whose meaning requires judgment to determine whether execution
can safely start. It returns one structured result for operations that use this
stage:

```json
{
  "status": "PASS | BLOCKED | HUMAN_REQUIRED",
  "operation": "<exact skill>",
  "subject": "<canonical subject>",
  "head": "<captured HEAD>",
  "checks": {
    "skillPreconditions": "PASS | BLOCKED | HUMAN_REQUIRED"
  },
  "blockers": ["<exact semantic prerequisite or decision; empty on PASS>"],
  "resolvedInputJson": "<validated bounded operation input>"
}
```

`status` must equal `checks.skillPreconditions`. Use `BLOCKED` for an unresolved
semantic prerequisite and `HUMAN_REQUIRED` for an architectural or human
choice. The extension validates object shape and requires the returned bounded
input to match the controller-pinned input. These outcomes stop before full
skill execution and before any repository write.

After `BLOCKED`, the orchestrator may make one read-only controller call to
select an authorized earlier prerequisite from current canonical state. The
controller cannot waive the failed check; the selected operation receives its
own preflight. `HUMAN_REQUIRED` stops immediately.

## Semantic judgments by phase

- **Audit:** semantic sufficiency of the selected authority and evidence for
  the audit profile; domain-specific proof obligations. The component
  implementation-ticket audit performs this gate within its own Section 1
  preconditions and still executes its complete independent checklist.
- **Remediation:** whether the source findings and baseline permit safe
  remediation, and whether an unresolved issue needs upstream judgment.
- **Artifact production:** whether approved source meaningfully supports the
  requested output and its scope.
- **Checkpoint:** whether the skill's canonical phase evidence permits the
  authorized local checkpoint. For the ticket-set audit and remediation
  checkpoints, the extension validates this evidence deterministically rather
  than delegating the decision to a preflight agent.
- **Implementation or review:** whether the approved design and ticket
  content are semantically ready for the selected work.
- **Finalization:** whether semantic completion criteria and explicit
  downstream handoffs are satisfied.

Audit dimensions, semantic adequacy, root causes, severity, correction design,
and conformance verdicts remain within the full skill.
