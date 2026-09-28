# Repository workflow orchestrator

This project-local Pi extension coordinates the engineering process whose authority
remains in `skills/*/SKILL.md`, `skills/_shared/*`, and the canonical artifacts those
skills define. It does not own a duplicate transition table.

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
checkpoint operation. Authorized ticket-scoped implementation, remediation, and
structural review therefore run in the guarded main working tree under
`skills/_shared/workflow-execution-topology-contract.md`; the orchestrator still
stops rather than inventing a worktree protocol and never commits elsewhere.

## Runtime topology

`workflow_orchestrate` asks a fresh, read-only `workflow-controller` subagent to inspect
the current canonical repository state and choose exactly one authorized skill. The
extension validates the selected skill and every cited authority/evidence path, then
delegates the operation to a project-local execution identity with the exact canonical
skill attached. It verifies stable HEAD, guarded main-tree scope, and requires a
canonical workspace state change before replanning. Completion, blockers, and human
gates are derived again from
the resulting artifacts.

`audit-implemented-ticket` is the specialized parallel stage. Conformance, behavior,
design, and conditionally architecture auditors run in fresh contexts against the same
pinned HEAD. Their artifacts are not shared before all specialists join. A separate
consolidator then creates the canonical audit. No failed specialist is replaced by an
inline fallback, and the implementer never certifies its own work.

Canonical process state lives only in repository artifacts. Runtime state is limited
to execution IDs, subagent run IDs, step records, timestamps, and operational errors.

## Pi entry points

- Tool `workflow_orchestrate`: advance the complete repository-authorized workflow.
- Tool `workflow_audit_implemented_ticket`: execute the independently audited vertical
  slice directly when its skill-derived profile and paths are already known.
- Command `/workflow-status`: confirm that the project-local extension loaded.

The project pins `pi-subagents@0.68.0` in `.pi/settings.json`. Delegation uses its
structured event API with `context: "fresh"`, result schemas, cancellation propagation,
and explicit join before consolidation.

## Fail-closed boundaries

Execution stops on unknown or repeated state, missing skill/agent/authority/evidence,
unsatisfied dependencies, incomplete results, controller mutation, HEAD or workspace
drift, subagent failure, human gates, unsupported worktree requirements, or the bounded
step limit. It never commits, merges, pushes, publishes, deletes branches, or converts
an unknown outcome into success.

## Validation

Run:

```sh
npm test
npm run typecheck
pi --mode rpc --approve --no-session
```

In RPC mode, `get_commands` must include `workflow-status`. The tests exercise the
external orchestration boundary with temporary Git repositories and delegated-agent
fakes, including happy path, blocked/unknown state, missing authority/skill/agent,
subagent failure, incomplete result, drift, unmet dependency, and human gate.
