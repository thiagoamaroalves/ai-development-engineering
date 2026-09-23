# Finding Completion and Readiness Contract

Shared normative contract for deriving completion effects from canonical
implementation findings. Read this with
[`authority-completeness-gates.md`](authority-completeness-gates.md) whenever an
audit, remediation, re-audit, or finalization workflow emits or consumes a
canonical finding.

## Purpose

Finding severity describes impact. It does not, by itself, decide which
checkpoint is blocked. Completion effects are derived from the finding
obligation, dependency class, local acceptance ownership, closure ownership,
and the point at which the evidence is due.

Every canonical finding MUST persist:

```text
FINDING_STATUS = OPEN | RESOLVED | SUPERSEDED | REJECTED_BY_EVIDENCE
FINDING_CATEGORY
CAPABILITY
DEPENDENCY_CLASS
LOCAL_CLOSURE_BLOCKING = YES | NO
LOCAL_ACCEPTANCE_REQUIRES_PRODUCTIVE_CAPABILITY = YES | NO
CLOSURE_OWNERSHIP = LOCAL_TICKET | INTEGRATED_CHECKPOINT | SPEC_FINAL_CONFORMANCE
DEPENDENCY_CLASS_RECLASSIFICATION_REQUIRED = YES | NO
UPSTREAM_DEPENDENCY_CLASSIFICATION_PRESERVED = YES | NO
BLOCKS_LOCAL_EXECUTION = YES | NO
BLOCKS_LOCAL_CLOSURE = YES | NO
BLOCKS_TICKET_DONE = YES | NO
BLOCKS_INTEGRATED_PROOF = YES | NO
BLOCKS_SPEC_FINAL_CONFORMANCE = YES | NO
PRIMARY_ROUTE
DOWNSTREAM_CHECKPOINT
DOWNSTREAM_OWNER
```

`DEPENDENCY_CLASS` MUST be one of:

```text
REQUIRED_FOR_LOCAL_EXECUTION
REQUIRED_FOR_LOCAL_CLOSURE
REQUIRED_FOR_INTEGRATED_PROOF
INFORMATIONAL
```

The canonical consolidator derives the five `BLOCKS_*` fields. Specialist
audits provide evidence for the derivation but do not assign the canonical
gate.

## Plan/Ticket completion-scope authority

The dependency classification made in the conformant Implementation Plan and
Ticket is authoritative for completion scope after independent audit. A
specialist or consolidator MUST preserve an independently audited capability
record containing:

```text
DEPENDENCY_CLASS = REQUIRED_FOR_INTEGRATED_PROOF
PRODUCTIVE_AVAILABILITY = NO
LOCAL_CLOSURE_BLOCKING = NO
```

Detecting that the producer is still unavailable is not evidence to silently
promote that capability to a local blocker. The downstream audit MUST emit:

```text
UPSTREAM_DEPENDENCY_CLASSIFICATION_PRESERVED = YES
```

and may keep the finding `OPEN` only as an integrated-proof blocker.

Changing the dependency class or blocking effect requires all of:

```text
DEPENDENCY_CLASS_RECLASSIFICATION_REQUIRED = YES
RECLASSIFICATION_EVIDENCE = <specific local Acceptance Criterion or Completion Evidence>
LOCAL_ACCEPTANCE_REQUIRES_PRODUCTIVE_CAPABILITY = YES
PRIMARY_ROUTE = PLAN_OR_TICKET_REVALIDATION
```

The evidence must show that productive capability is actually required at local
execution or closure. A normal implementation-remediation route cannot alter
the completion scope. Without this proof, preserve the upstream class and
route the open finding to integrated/plan revalidation.

## Mechanical derivation

First determine the obligation owner and evidence timing. Then apply:

```text
BLOCKS_LOCAL_EXECUTION = YES
  when the finding prevents an acceptance-owned local execution witness, or
  when an unavailable capability is REQUIRED_FOR_LOCAL_EXECUTION.

BLOCKS_LOCAL_CLOSURE = YES
  when the finding prevents a local Acceptance Criterion, local Completion
  Evidence item, or a witness required at local closure, or when an unavailable
  capability is REQUIRED_FOR_LOCAL_CLOSURE.

BLOCKS_TICKET_DONE = YES
  when BLOCKS_LOCAL_EXECUTION = YES
  OR BLOCKS_LOCAL_CLOSURE = YES
  OR an independently owned local completion obligation remains unsatisfied.

BLOCKS_INTEGRATED_PROOF = YES
  when the finding prevents evidence due at an integrated checkpoint, including
  an unavailable capability classified REQUIRED_FOR_INTEGRATED_PROOF.

BLOCKS_SPEC_FINAL_CONFORMANCE = YES
  when the unresolved obligation prevents final conformance of the governing
  specification, regardless of whether a local ticket can close.
```

`LOCAL_DONE_GATE_USES_LOCAL_CLOSURE_SCOPE = TRUE` and
`INTEGRATED_PROOF_GATE_USES_INTEGRATED_DEPENDENCY_SCOPE = TRUE`. The two gates
must not be collapsed into one availability test.

The following rule is mandatory:

```text
IF FINDING_CATEGORY = CAPABILITY_AVAILABILITY_CONTRADICTION
AND DEPENDENCY_CLASS = REQUIRED_FOR_INTEGRATED_PROOF
AND LOCAL_ACCEPTANCE_REQUIRES_PRODUCTIVE_CAPABILITY = NO
THEN
    BLOCKS_LOCAL_EXECUTION = NO
    BLOCKS_LOCAL_CLOSURE = NO
    BLOCKS_TICKET_DONE = NO
    BLOCKS_INTEGRATED_PROOF = YES
```

This rule preserves the finding as an open downstream/integrated blocker. It
does not resolve the finding, promote productive availability, or transfer
the producer's responsibility to the consumer. The canonical record MUST name
the downstream checkpoint and owner and retain the primary upstream route.

For `REQUIRED_FOR_LOCAL_EXECUTION` and `REQUIRED_FOR_LOCAL_CLOSURE`, an
unavailable productive capability remains a local blocker even when a fixture,
mock, fake, or in-memory repository makes local tests pass. Local acceptance
ownership is the deciding fact; severity is not.

## Local ticket gate

The local ticket gate is independent from the existence of open integrated
findings:

```text
LOCAL_TICKET_DONE_ALLOWED = YES
  when audit completeness is valid
  AND local acceptance and local completion evidence are satisfied
  AND no canonical finding has BLOCKS_TICKET_DONE = YES
  AND no local witness is non-executable at closure.

TICKET_GATE = READY_FOR_DONE
  when LOCAL_TICKET_DONE_ALLOWED = YES

TICKET_GATE = NOT_READY_FOR_DONE
  otherwise.
```

An open `REQUIRED_FOR_INTEGRATED_PROOF` finding may therefore coexist with
`TICKET_GATE = READY_FOR_DONE`. The canonical audit MUST report an explicit
`INTEGRATED_FOLLOWUP_REQUIRED`/downstream handoff in that case. An audit verdict
that says remediation is required describes the open canonical finding; it does
not override the independently derived local gate.

Never implement the following universal rule:

```text
CRITICAL or MAJOR finding => NOT_READY_FOR_DONE
```

## Routing matrix

| Finding obligation | Productive availability | Local acceptance depends on it | Local ticket gate | Integrated proof | Primary route |
|---|---:|---:|---:|---:|---|
| `REQUIRED_FOR_LOCAL_EXECUTION` capability | NO | YES | Blocked | May also block | Earliest owning upstream phase |
| `REQUIRED_FOR_LOCAL_CLOSURE` capability | NO | YES | Blocked | May also block | Earliest owning upstream phase |
| `REQUIRED_FOR_INTEGRATED_PROOF` capability | NO | NO | Not blocked | Blocked | `IMPLEMENTATION_PLAN_REVALIDATION` or canonical owner route |
| Local behavioral/acceptance defect | N/A | YES | Blocked | If applicable | `IMPLEMENTATION_REMEDIATION` |
| Integrated-only defect with no local obligation | N/A | NO | Not blocked | Blocked | Owning integrated checkpoint |
| Informational observation | N/A | NO | Not blocked | Not blocked | No remediation gate |

The route is selected from ownership and authority. It is never changed merely
to make the local gate pass, and severity never substitutes for route or
dependency class.

For a preserved integrated dependency, the route remains the canonical
integrated/plan route, such as `IMPLEMENTATION_PLAN_REVALIDATION`. If explicit
reclassification evidence exists, use `PLAN_OR_TICKET_REVALIDATION`; do not
apply ordinary implementation remediation to change the classification.

## Required traceability and invariants

For every open integrated-only finding, persist:

```text
OPEN_INTEGRATED_FINDING_TRACEABILITY = COMPLETE
DOWNSTREAM_CHECKPOINT
DOWNSTREAM_OWNER
PRIMARY_ROUTE
SOURCE_FINDING_IDS
CAPABILITY
DEPENDENCY_CLASS
```

The following invariants are mandatory audit metrics:

```text
INTEGRATED_ONLY_AVAILABILITY_BLOCKING_LOCAL_DONE = 0
LOCAL_CLOSURE_FINDINGS_NOT_BLOCKING_DONE = 0
FINDING_SEVERITY_USED_AS_SOLE_COMPLETION_GATE = 0
OPEN_INTEGRATED_FINDING_LOST_FROM_TRACEABILITY = 0
SPECIALIST_CANNOT_SILENTLY_PROMOTE_INTEGRATED_DEPENDENCY_TO_LOCAL_BLOCKER = TRUE
CONSOLIDATOR_CANNOT_DERIVE_LOCAL_BLOCKING_FROM_SEVERITY_ALONE = TRUE
LOCAL_DONE_GATE_USES_LOCAL_CLOSURE_SCOPE = TRUE
INTEGRATED_PROOF_GATE_USES_INTEGRATED_DEPENDENCY_SCOPE = TRUE
```

`LOCAL_CLOSURE_FINDINGS_NOT_BLOCKING_DONE` counts a finding whose obligation is
actually required for local closure but whose `BLOCKS_TICKET_DONE` is `NO`; it
does not count integrated-only findings.
