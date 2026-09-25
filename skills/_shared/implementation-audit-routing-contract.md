# Implementation Audit Routing Contract

This contract is the single routing authority after an implemented-ticket audit.
The workflow controller must read it before selecting the next operation. It
must not re-audit a ticket whose latest canonical implementation audit is valid,
complete, current, and actionable.

## Canonical inputs

Use the latest canonical artifact:

```text
<TICKET-ID>-implementation-audit.md
```

Supporting specialist artifacts are evidence only. They never independently
select the next operation.

The canonical audit is current only when its target HEAD and semantic state
fingerprint match the live repository state and its finding-completeness gate
is `PASS`.

## Routing rules

Apply the first matching rule:

| Canonical condition | Next authorized operation |
|---|---|
| No canonical audit exists, or the latest audit is stale/invalid | `audit-implemented-ticket` |
| `TICKET_IMPLEMENTATION_AUDIT_BLOCKED` or finding completeness is not `PASS` | human gate / workflow blocker; do not remediate or re-audit implicitly |
| Valid current canonical audit has no matching audit checkpoint marker | `checkpoint-implemented-ticket` |
| `TICKET_IMPLEMENTATION_REMEDIATION_REQUIRED` and `TICKET_GATE = NOT_READY_FOR_DONE`, after its audit checkpoint | `remediate-implemented-ticket` |
| `TICKET_IMPLEMENTATION_REMEDIATION_REQUIRED` and `TICKET_GATE = READY_FOR_DONE`, with only integrated-only findings open, after its audit checkpoint | `finalize-implemented-ticket` |
| `TICKET_IMPLEMENTATION_CONFORMANT` and `TICKET_GATE = READY_FOR_DONE`, after its audit checkpoint | `finalize-implemented-ticket` |
| Remediation is complete and has no matching remediation checkpoint | `checkpoint-implemented-ticket` |
| Remediation checkpoint is complete and status is `VALIDATION_REQUIRED` | `audit-implemented-ticket` |

A valid, actionable canonical audit with
`TICKET_IMPLEMENTATION_REMEDIATION_REQUIRED` must never route back to
`audit-implemented-ticket` before its audit checkpoint and remediation. Re-audit
is authorized only after `remediate-implemented-ticket` returns the ticket to
`VALIDATION_REQUIRED` and its remediation checkpoint is complete, or when the
audit is stale, invalid, or explicitly blocked by its own basis. A checkpoint
must never change ticket semantics or substitute for audit/remediation.

## Post-finalization ticket-set reconciliation

A finalization checkpoint is a local completion event, not downstream execution
authority. When its finalization artifact records
`DOWNSTREAM_RECONCILIATION_REQUIRED = YES`, `TICKETS_NEWLY_UNBLOCKED`, or a
released dependency edge with `DOWNSTREAM_TICKET_STATE_MUTATIONS = 0`, the
controller must route the ticket-set audit **unless** a later, current,
conformant ticket-set audit has already consumed that handoff against the same
post-finalization repository state.

The required one-time sequence is:

```text
audit-component-implementation-tickets
        ↓
remediate-component-implementation-tickets (when findings require it)
        ↓
audit-component-implementation-tickets
        ↓
design-ticket-implementation
        ↓
implement-ready-tickets
```

A historical finalization flag is not a perpetual audit trigger. Once the
current ticket-set audit is `IMPLEMENTATION_TICKETS_CONFORMANT`,
`IMPLEMENTATION_GATE = READY_FOR_IMPLEMENTATION`, its basis matches the live
state, and the selected primary ticket is current, the finalization handoff is
consumed and routing may proceed to design or implementation. Before
`design-ticket-implementation` or `implement-ready-tickets`, require a current
conformant ticket-set audit, a primary ticket whose `STATUS`,
`EXECUTION_READY`, and `BLOCKED_BY` satisfy the shared readiness predicate, an
index that matches ticket truth, and an approved Implementation Design for the
selected ticket. A finalization README/index projection cannot override a
contradictory primary ticket artifact.

A historical ticket-set remediation artifact is evidence, not a live routing
command. Its `READY_FOR_INDEPENDENT_TICKET_REAUDIT` or `NEXT_AUTHORITY` value
is actionable only when no later current conformant ticket-set audit has
consumed the same remediation handoff. The latest current conformant audit
wins over older remediation text; do not select
`audit-component-implementation-tickets` from a stale report alone.

For ticket-set audits, apply this route:

```text
IMPLEMENTATION_TICKETS_REMEDIATION_REQUIRED
    → remediate-component-implementation-tickets
remediation complete / READY_FOR_INDEPENDENT_TICKET_REAUDIT
    → audit-component-implementation-tickets
IMPLEMENTATION_TICKETS_CONFORMANT + no current ready design
    → design-ticket-implementation
IMPLEMENTATION_TICKETS_CONFORMANT + current ready design
    → implement-ready-tickets
```

A current ready Implementation Design is proven by the design artifact's own
`IMPLEMENTATION_DESIGN_READY` verdict and
`IMPLEMENTATION_DESIGN_GATE: READY_FOR_IMPLEMENTATION`, plus matching ticket
identity and ticket-set audit target/basis. It does not require an independent
design audit or an already committed Git object. The design skill is the owner
of this design gate; implementation checkpointing later commits the exact
allowlisted design artifact. A historical ticket-set audit may describe an
older design as auxiliary evidence, but that description cannot invalidate a
newer current design artifact.

The ticket-set audit must emit exactly one of these ticket-set next-operation
values so the controller does not infer a transition from prose:

```text
NEXT_TICKET_SET_OPERATION: remediate-component-implementation-tickets
NEXT_TICKET_SET_OPERATION: audit-component-implementation-tickets
NEXT_TICKET_SET_OPERATION: design-ticket-implementation
NEXT_TICKET_SET_OPERATION: implement-ready-tickets
NEXT_TICKET_SET_OPERATION: HUMAN_REQUIRED
```

A current `IMPLEMENTATION_TICKETS_CONFORMANT` audit must never emit
`audit-component-implementation-tickets` solely because a historical
remediation artifact contains `READY_FOR_INDEPENDENT_TICKET_REAUDIT`.

## Machine-readable handoff

New canonical audits must end with exactly one:

```text
NEXT_AUTHORIZED_OPERATION: checkpoint-implemented-ticket
NEXT_AUTHORIZED_OPERATION: audit-implemented-ticket
NEXT_AUTHORIZED_OPERATION: remediate-implemented-ticket
NEXT_AUTHORIZED_OPERATION: finalize-implemented-ticket
NEXT_AUTHORIZED_OPERATION: HUMAN_REQUIRED
```

The value must agree with the routing table and the canonical verdict/gate. For
an audit checkpoint, also emit:

```text
POST_CHECKPOINT_OPERATION: remediate-implemented-ticket
```

or the authorized `finalize-implemented-ticket` value. For a remediation
checkpoint, emit `POST_CHECKPOINT_OPERATION: audit-implemented-ticket`.
For historical canonical audits that predate this field, the controller may
derive the value from the canonical verdict, ticket gate, target fingerprint,
and finding-completeness fields without modifying the historical artifact.

## Safety invariants

- Never select remediation from specialist findings alone.
- Never select a second audit merely because the ticket remains
  `VALIDATION_REQUIRED` when a current canonical remediation-required audit
  exists.
- Never treat `UNKNOWN`, missing, stale, or contradictory routing fields as
  permission to proceed; stop for reconciliation or a human gate.
- The audit target is the base HEAD plus the stable semantic working-tree
  overlay fingerprint defined by the audit contract.
- The semantic implementation fingerprint is governed by
  `semantic-fingerprint-policy.json`, not by hardcoded extension logic. It
  excludes declared process-only workflow machinery (currently `.pi/`,
  `skills/`, `.codex/`, workflow verification tools, and only the declared
  verification-script keys in `package.json`). Product, dependency, build, or
  runtime changes remain semantic unless explicitly and safely classified.
  Process-authority changes require workflow reload/skill validation but must
  not create false implementation target drift during a specialist wave.
