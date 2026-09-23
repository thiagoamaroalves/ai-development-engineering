---
name: finalize-implemented-ticket
description: >
  Finalize an independently audited implemented ticket when its local
  completion gate is ready, preserving explicit downstream handoffs for open
  integrated-only findings. Use after audit-implemented-ticket; do not use to
  resolve findings, promote productive availability, or bypass local blockers.
  This workflow owns the local finalization/state transition only.
metadata:
  short-description: Finalize locally ready implemented tickets
---

# Finalize Implemented Ticket

Finalize the local ticket checkpoint from the canonical audit and shared
finding-completion contract. Local finalization is a state transition, not a
second audit and not a finding-resolution operation.

## Required inputs

Read:

- `../_shared/authority-completeness-gates.md`;
- `../_shared/finding-completion-readiness-contract.md`;
- the latest canonical `<TICKET-ID>-implementation-audit.md`;
- the ticket and its local acceptance/completion evidence;
- any canonical downstream handoff artifact.

Verify the audit target and ticket identity match. Do not finalize a stale or
ambiguous basis.

## Ownership and write boundary

Finalization owns only these responsibilities:

```text
LOCAL_TICKET_FINALIZATION
TICKET_STATE_TRANSITION
DAG_RELEASE
DOWNSTREAM_HANDOFF_PERSISTENCE
```

The following shared rule is mandatory:

```text
AUDIT_ARTIFACT_IMMUTABILITY = REQUIRED
ONLY_THE_CORRESPONDING_AUDIT_SKILL_MAY_CREATE_OR_UPDATE_AN_AUDIT_ARTIFACT
```

Audit artifacts are historical snapshots of the audit execution that produced
them. This skill may read and cite them, but it may not synchronize, rewrite,
update, append to, or otherwise mutate them. The same applies when a finding
routes upstream: preserve the finding in a handoff and leave the upstream
audit for the later audit/revalidation workflow.

The only permitted finalization write scope is:

```text
CURRENT_TICKET
TICKET_INDEX / DAG_PROJECTION
FINALIZATION_ARTIFACT
CANONICAL_DOWNSTREAM_HANDOFF_INDEX
```

No other write is authorized. In particular, `Do not edit the Implementation Plan or Implementation Plan Audit` is a hard rule. Finalization also must not change a Plan Audit verdict or finding set, add sections to a Plan Audit, or synchronize Plan Audit metrics.

The prohibited write scope is:

```text
ADR
PORTFOLIO
PORTFOLIO_AUDIT
COMPONENT_SPEC
COMPONENT_SPEC_AUDIT
GAP_MATRIX
GAP_MATRIX_AUDIT
IMPLEMENTATION_PLAN
IMPLEMENTATION_PLAN_AUDIT
TICKET_SET_AUDIT
IMPLEMENTATION_AUDIT
SPECIALIST_AUDITS
IMPLEMENTATION_DESIGN_AUDIT
```

Before any permitted write, capture the SHA-256 of every applicable existing
artifact in the prohibited scope. After finalization, compare every digest.
The following invariants must hold:

```text
UPSTREAM_AUDIT_ARTIFACTS_MODIFIED_BY_FINALIZATION = 0
UPSTREAM_AUTHORITY_ARTIFACTS_MODIFIED_BY_FINALIZATION = 0
```

Any unexpected digest change is a finalization failure; do not return
`TICKET_FINALIZED_LOCALLY`.

## Downstream DAG release and reconciliation boundary

`DAG_RELEASE` records that a prerequisite edge owned by the finalized ticket is
satisfied. It is not a downstream ticket-state transition and it must not be
used to claim that a downstream ticket is currently executable.

When finalization releases one or more downstream edges, it may persist only
the release/handoff facts:

```text
DEPENDENCY_SATISFIED_FOR = <ticket ids>
TICKETS_NEWLY_UNBLOCKED = <ticket ids>
DOWNSTREAM_TICKET_STATE_MUTATIONS = 0
DOWNSTREAM_RECONCILIATION_REQUIRED = YES
POST_FINALIZATION_NEXT_AUTHORIZED_OPERATION = audit-component-implementation-tickets
```

Until the independent ticket-set audit and any authorized ticket-set
remediation/re-audit complete, finalization must not update or claim any
downstream ticket's `STATUS`, `EXECUTION_READY`, `BLOCKED_BY`,
`CURRENT_DAG_STATE`, `CURRENT_READY_TICKETS`, or `NEXT_EXECUTION_WAVE`. The
historical `INITIAL_DAG_STATE` remains unchanged. The ticket-set audit owns the
recalculation of current downstream status, blocker, index, and readiness
projections; its remediation workflow owns any resulting ticket/index writes.

If no downstream edge is released, record
`DOWNSTREAM_RECONCILIATION_REQUIRED = NO` and do not invent a ticket-set
transition. In either case, a finalization checkpoint must not route directly
to downstream design or implementation when reconciliation is required.

## Local gate decision

Recalculate, do not copy, the canonical local gate:

```text
LOCAL_TICKET_DONE_ALLOWED = YES
  iff audit completeness is valid
  AND local acceptance is satisfied
  AND local completion evidence is current
  AND every local witness is executable at closure
  AND no canonical finding has BLOCKS_TICKET_DONE = YES
```

Then require:

```text
TICKET_GATE = READY_FOR_DONE
```

`CRITICAL` or `MAJOR` severity is not sufficient to reject local finalization.
If a finding is `OPEN`, `DEPENDENCY_CLASS = REQUIRED_FOR_INTEGRATED_PROOF`,
`LOCAL_CLOSURE_BLOCKING = NO`, and local acceptance does not require the
productive capability, it remains open and blocks integrated proof only. The
Plan/Ticket classification is authoritative here; do not silently promote it.
The ticket may finalize locally when all local predicates pass.

Reject finalization with `FINALIZATION_BLOCKED` when any local blocker exists:

```text
BLOCKS_LOCAL_EXECUTION = YES
OR BLOCKS_LOCAL_CLOSURE = YES
OR BLOCKS_TICKET_DONE = YES
OR local witness is not executable at closure
OR audit basis is stale/incomplete
```

## Integrated-only handoff

Before local finalization, every open integrated-only finding MUST have:

```text
FINDING_ID = <canonical finding id>
STATUS = OPEN
FINDING_STATUS = OPEN
BLOCKS_TICKET_DONE = NO
BLOCKS_INTEGRATED_PROOF = YES
BLOCKS_SPEC_FINAL_CONFORMANCE = <YES|NO>
PRIMARY_ROUTE = <canonical route>
DOWNSTREAM_CHECKPOINT = <named checkpoint>
DOWNSTREAM_OWNER = <owner>
DEPENDENCY_CLASS = <canonical dependency class>
SOURCE_AUDIT = <canonical audit artifact>
SOURCE_TICKET = <ticket id>
OPEN_INTEGRATED_FINDING_TRACEABILITY = COMPLETE
UPSTREAM_DEPENDENCY_CLASSIFICATION_PRESERVED = YES
```

Keep the finding in the canonical audit and traceability index. Do not mark it
`RESOLVED`, promote `PRODUCTIVE_AVAILABILITY`, or move producer responsibility
to the local consumer. `TICKET_IMPLEMENTATION_REMEDIATION_REQUIRED` may remain
the audit verdict while `TICKET_GATE = READY_FOR_DONE` permits local
finalization; the verdict describes open obligations and the gate describes the
current checkpoint.

When `PRIMARY_ROUTE = IMPLEMENTATION_PLAN_REVALIDATION`, persist only the
handoff above. Later orchestration invokes the appropriate Plan revalidation or
audit skill, and only that corresponding audit skill may update the
Implementation Plan Audit. Finalization does not execute an implicit audit or
revalidation.

## Required finalization result

Return exactly one:

```text
TICKET_FINALIZED_LOCALLY
FINALIZATION_BLOCKED
```

When finalized, record:

```text
LOCAL_TICKET_DONE_ALLOWED = YES
TICKET_GATE = READY_FOR_DONE
OPEN_INTEGRATED_FINDINGS = <count>
INTEGRATED_HANDOFFS_COMPLETE = YES
INTEGRATED_ONLY_AVAILABILITY_BLOCKING_LOCAL_DONE = 0
LOCAL_CLOSURE_FINDINGS_NOT_BLOCKING_DONE = 0
FINDING_SEVERITY_USED_AS_SOLE_COMPLETION_GATE = 0
OPEN_INTEGRATED_FINDING_LOST_FROM_TRACEABILITY = 0
SPECIALIST_CANNOT_SILENTLY_PROMOTE_INTEGRATED_DEPENDENCY_TO_LOCAL_BLOCKER = TRUE
CONSOLIDATOR_CANNOT_DERIVE_LOCAL_BLOCKING_FROM_SEVERITY_ALONE = TRUE
LOCAL_DONE_GATE_USES_LOCAL_CLOSURE_SCOPE = TRUE
INTEGRATED_PROOF_GATE_USES_INTEGRATED_DEPENDENCY_SCOPE = TRUE
AUDIT_ARTIFACT_IMMUTABILITY = REQUIRED
UPSTREAM_AUDIT_ARTIFACTS_MODIFIED_BY_FINALIZATION = 0
UPSTREAM_AUTHORITY_ARTIFACTS_MODIFIED_BY_FINALIZATION = 0
DAG_EDGES_RELEASED = <count>
DEPENDENCY_SATISFIED_FOR = <ticket ids or NONE>
TICKETS_NEWLY_UNBLOCKED = <ticket ids or NONE>
DOWNSTREAM_TICKET_STATE_MUTATIONS = 0
DOWNSTREAM_RECONCILIATION_REQUIRED = <YES|NO>
POST_FINALIZATION_NEXT_AUTHORIZED_OPERATION = <audit-component-implementation-tickets when YES>
```

This skill does not resolve downstream findings or claim final specification
conformance. The integrated checkpoint/owner must consume the handoff later.
