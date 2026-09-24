# Canonical Artifact Consistency Contract

A workflow artifact is not complete merely because one section, remediation
report, or checkpoint claims completion. Before a phase checkpoint or the next
phase, the effective state must be consistent across the source artifact, its
remediation evidence, its audit evidence, and the checkpoint marker.

## Singleton fields

Fields that determine routing are singleton fields. A canonical artifact must
not contain contradictory values for the same field. At minimum validate:

```text
STATUS
VERDICT
IMPLEMENTATION_PLAN_GATE
READY_FOR_GAP_MATRIX
READY_FOR_IMPLEMENTATION_PLAN
READY_FOR_IMPLEMENTATION_PLAN_AUDIT
READY_FOR_ISSUE_DECOMPOSITION
READY_FOR_TICKET_AUDIT
NEXT_AUTHORIZED_OPERATION
```

Repeated occurrences are valid only when all effective values are identical and
historical values are explicitly labeled as historical. A current field may not
be contradicted by a later section, remediation report, or checkpoint.

## Cross-artifact routing invariants

Before creating a phase checkpoint, reconcile:

```text
source artifact
remediation report, when applicable
audit report, when applicable
checkpoint marker
```

The checkpoint's `NEXT_AUTHORIZED_OPERATION` must be derivable from the source
artifact's current gate. Examples:

```text
Plan remediation complete
  => IMPLEMENTATION_PLAN_GATE = READY_FOR_IMPLEMENTATION_PLAN_AUDIT
  => NEXT_AUTHORIZED_OPERATION = audit-component-implementation-plan

SPEC conformant
  => READY_FOR_GAP_MATRIX = YES
  => NEXT_AUTHORIZED_OPERATION = generate-component-implementation-gap-matrix

Gap Matrix conformant
  => READY_FOR_IMPLEMENTATION_PLAN = YES
  => NEXT_AUTHORIZED_OPERATION = plan-component-implementation

Plan conformant
  => READY_FOR_ISSUE_DECOMPOSITION = YES
  => NEXT_AUTHORIZED_OPERATION = decompose-component-implementation-plan-into-tickets
```

A checkpoint claiming completion while the source artifact still contains a
pending, stale, or contradictory current gate is invalid. The checkpoint must
be blocked before commit. If an invalid checkpoint already exists, preserve it
as history, stop, and route to the owning remediation/reconciliation skill; do
not edit history or force the next audit.

## Mechanical proof

Checkpoint skills MUST perform a mechanical consistency check that reports:

```text
CANONICAL_ARTIFACT_CONSISTENCY = PASS | FAIL
CONSISTENCY_FIELDS_CHECKED = <fields>
CONSISTENCY_CONTRADICTIONS = <exact paths/lines/values>
ROUTING_DERIVATION = <source gate -> next operation>
```

The orchestrator MUST independently reject a checkpoint result when this proof
is absent, fails, or disagrees with the selected next operation. This contract
is orthogonal to semantic audit approval: consistency does not approve an
artifact; it only proves that the state and routing declarations do not
contradict one another.
