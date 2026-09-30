---
name: checkpoint-component-implementation-tickets-conformance
description: Create a guarded local checkpoint for a conformant implementation-ticket audit before design or implementation.
metadata:
  short-description: Preserve conformant ticket audit before implementation
---

# Checkpoint Component Implementation Tickets Conformance

Read `../_shared/phase-checkpoint-contract.md` and
`../_shared/phase-manifest-contract.md` completely. Use only after the current
ticket-set audit is conformant and emits its implementation readiness gate.

## Phase manifest and candidate

Require `PHASE_MANIFEST_PATH` derived from the conformant ticket audit, current
HEAD, and actual candidate. If design or implementation was interrupted, its
paths must be represented as untrusted candidates in the manifest and remain
outside this checkpoint's preserved set. Validate:

```text
node tools/verify-phase-manifest.mjs --manifest <PHASE_MANIFEST_PATH>
```

Any dirty path outside the manifest's effective set blocks. Do not embed
project-specific paths in this skill.

## Completion

Capture parent, verify the current conformant ticket audit, basis, DAG,
metrics and gate, validate the phase manifest, write its declared marker, stage
exactly its effective path set, run cached checks, and create exactly the
manifest's `commitMessage`.

Return:

```text
CHECKPOINT_COMPLETE
PHASE_CHECKPOINT_COMPLETE
COMPONENT_IMPLEMENTATION_TICKETS_CONFORMANCE_CHECKPOINT_COMPLETE
NEXT_AUTHORIZED_OPERATION = <one exact operation derived below>
```

Derive the next operation from the current ticket-set audit's
`NEXT_TICKET_SET_OPERATION` under
`skills/_shared/implementation-audit-routing-contract.md`. Preserve the
selected READY ticket's design gate: use `design-ticket-implementation` when
no current approved design exists; otherwise use `implement-ready-tickets`.

Failures return `COMPONENT_IMPLEMENTATION_TICKETS_CONFORMANCE_CHECKPOINT_BLOCKED`
and create no commit.
