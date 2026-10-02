# Repository workflow orchestrator

This project-local Pi extension coordinates the engineering process whose authority
remains in `skills/*/SKILL.md`, `skills/_shared/*`, and the canonical artifacts those
skills define. Normal workflow edges are encoded once in
`skills/_shared/workflow-transitions.json`; skills still own their semantic verdicts.

## End-to-end process discovered

The repository defines this gated progression, with audit/remediation loops at each
quality boundary:

1. audit and, when authorized, remediate portfolio decomposition;
2. generate component SPECs, audit each SPEC, and remediate findings;
3. audit cross-SPEC portfolio conformance;
4. generate, audit, and remediate the implementation Gap Matrix;
5. generate, audit, and remediate the implementation plan;
6. decompose, audit, and remediate implementation tickets;
7. design ticket implementation;
8. implement ready tickets and perform structural review;
9. independently audit implemented tickets, consolidate findings, remediate when
   required, and re-audit;
10. finalize a ticket only when its canonical audit gate authorizes finalization.

The initial portfolio decomposition is an input: no skill in this repository creates
it. The repository defines no branch allocation, worktree integration, merge,
or push authority. Local commits are authorized only through the dedicated
checkpoint operation. The orchestrator runs authorized work in the active
checkout from which it was invoked, whether that is the primary checkout or an
already-existing linked worktree. `executionIsolation = main` means no
additional worktree is allocated; it does not require the repository's primary
worktree or `main` branch. The orchestrator never switches branches or creates,
moves, removes, or selects another worktree without explicit authority.

## Runtime topology

`workflow_orchestrate` asks a fresh, read-only `workflow-controller` once at intake to
select the entry operation. Every controller-selected operation must provide a
structured entry basis: either a persisted source gate that routes to the selected
operation, or direct evidence for an operation explicitly declared as an intake route.
Recovery is limited in code to a declared resumable retry, a catalog ancestor of the
failed operation with its own valid entry gate, or the explicit governance recovery
entry. The deterministic ticket-set checkpoints use failure-atomic rollback and
may retry only themselves; a failed checkpoint cannot dispatch its upstream audit
or remediation operation again. Before each operation, the extension validates the local skill and, when
delegating, its agent; it also validates cited paths, pinned HEAD, bounded input,
and—on a normal transition—the previous operation's
current `WORKFLOW_RESULT_V2` lineage leaf, persisted gate, exact subject, and catalog
edge. Result records form one append-only chain per operation and subject; ambiguous
branches and legacy unversioned transition artifacts stop before dispatch. Legacy
lineage has two explicit recovery routes. Implemented-ticket migration verifies the
current approved ticket-set generation and conformance checkpoints before the ticket
checkpoint, so a reused ticket ID cannot inherit a retired revision's lineage. It then
verifies the ticket checkpoint marker, phase manifest, commit, parent, committed paths,
and source digests, records any committed descendant changes to preserved paths, and
requires a new normal checkpoint to reanchor HEAD before the audit. Ticket-set audit
migration verifies the current generation, conformance audit, and one current ready-
ticket design, then writes a separate V2 migration report that can route only to a
fresh independent ticket-set audit. Neither route backfills V2 into historical
artifacts.
A separate read-only
`workflow-preflight` handles semantic prerequisites that code cannot decide,
except for the read-only component implementation-ticket audit and the two
implementation-ticket-set checkpoint operations. The ticket audit runs its own
Section 1 semantic preconditions and receives advisory static observations for
mechanically decidable ticket inventory, identity, index, status, dependency,
blocker, reciprocity, and cycle checks; the independent auditor still executes
all 54 checks. The checkpoint operations are owned by an extension-side
deterministic driver: it validates the current
audit/remediation lineage and phase-specific evidence, derives the allowlist,
runs checkpoint checks, and commits without an LLM checkpoint agent. The
extension delegates other exact skills, requires their receipt gate to be persisted in
the cited canonical artifact, checks changed paths, and follows the deterministic
transition catalog. For the ticket-set audit, the extension also appends the
validated terminal `WORKFLOW_RESULT_V2` block while preserving the audit skill's
report content. The controller is called again only when a failure or semantic
blocker needs recovery, or a gate explicitly routes to recovery. Explicit human gates
stop before another skill starts; unrecoverable blockers stop after one recovery
decision.

Before the intake call, startup checks that every local workflow skill is registered
or is an internal ticket-audit specialist, validates all required agents and core
shared contracts, and loads the semantic fingerprint policy and checkpoint verifier.
Missing or inconsistent process authority stops before a workflow skill runs.

Every routed gate must exist in its cited artifact; a value present only in an agent
response cannot advance the workflow. Each operation persists its result identity and
predecessor and its direct basis beside the gate. The extension resolves the lineage leaf
and checks upstream result IDs recursively, plus selected identity, revision, round,
audit-target, and gate fields from source documents. This catches replaced upstream
results and declared revision changes without hashing prose or the workspace. Filenames
and timestamps do not select the lineage leaf. The main loop compares only Git-visible
paths touched by the current operation; it does not SHA-fingerprint the whole workspace
to decide whether a gate progressed. The specialized implemented-ticket audit keeps its
separate semantic fingerprint, which pins the exact implementation state shared by
independent auditors. Checkpoint phase manifests and parent/commit checks also remain
in force.

For a ticket-set re-audit, the new result can supersede historical ticket-audit
ancestors in the exact entry-basis chain captured before dispatch. The extension
still validates the current checkpoint and remediation chain, so the new audit
does not invalidate itself after replacing the old report.

`audit-implemented-ticket` is the specialized parallel stage. Conformance, behavior,
design, and conditionally architecture auditors run in fresh contexts against the same
pinned HEAD. Their artifacts are not shared before all specialists join. A separate
consolidator then creates the canonical audit. No failed specialist is replaced by an
inline fallback, and the implementer never certifies its own work.

Canonical process state lives only in repository artifacts. Local session logs are
diagnostic metadata, never workflow authority or evidence. Runtime captures execution
IDs, subagent run IDs, step records, timestamps, and operational errors.

## Pi entry points

- Tool `workflow_orchestrate`: advance the complete repository-authorized workflow.
- Tool `workflow_audit_implemented_ticket`: execute the independently audited vertical
  slice directly when its skill-derived profile and paths are already known.
- Command `/workflow-status`: confirm that the project-local extension loaded.

The project pins `pi-subagents@0.68.0` in `.pi/settings.json`. Delegation uses its
structured event API with `context: "fresh"`, result schemas, cancellation propagation,
and explicit join before consolidation.

## Local run logs

The extension appends metadata-only JSONL events to `.pi/session-logs/`, with one
file per workflow execution ID. Events cover workflow start/finish, controller
decisions, ticket-set static-analysis summaries, operation routing and stops, and
delegated-agent start/finish with elapsed time and run ID. Prompts, agent
responses, and artifact contents are not logged. Error summaries are bounded
and common credential patterns are redacted.

Token usage is recorded per agent only when the subagent response includes
provider-reported usage; otherwise the event marks usage as unavailable. The
extension does not estimate token counts. Logging is best-effort and does not
change workflow outcomes if the local log cannot be written. `.pi/session-logs/`
is excluded from Git.

## Fail-closed boundaries

Execution stops on missing skill/agent/authority/evidence, failed preflight,
unsatisfied dependencies, incomplete or contradictory results, controller mutation,
HEAD drift, undeclared operation changes, subagent failure, human gates, unsupported
requirements for an additional allocated worktree, or the bounded step limit.
It never commits outside an authorized checkpoint skill/driver, merges, pushes,
publishes, deletes branches, stages recovery paths, or converts an unknown outcome
into success.

## Validation

Run:

```sh
npm test
npm run typecheck
pi --mode rpc --approve --no-session
```

In RPC mode, `get_commands` must include `workflow-status`. The tests exercise the
external orchestration boundary with temporary Git repositories and delegated-agent
fakes, including one-time controller intake, catalog-routed multi-step flow, early
semantic preflight stops, entry and recovery authorization, subject-bound gate
lineage for each workflow family, missing startup authority, subagent failure, drift,
unmet dependency, human gates, changed intake revisions, and stale downstream bases.
