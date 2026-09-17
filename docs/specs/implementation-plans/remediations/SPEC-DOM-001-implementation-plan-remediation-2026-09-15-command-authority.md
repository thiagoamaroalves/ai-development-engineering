# SPEC-DOM-001 — Implementation Plan remediation: command authority blocker

## 1. Remediation Verdict

```text
VERDICT = COMPONENT_IMPLEMENTATION_PLAN_REMEDIATION_BLOCKED
REASON = UPSTREAM_AUTHORITY_REVALIDATION_REQUIRED
GATE = BLOCKED
```

This remediation makes the hidden dependency truthful but cannot assign a
producer that the accepted authority chain does not define.

## 2. Subject and Source Audit

```text
PLAN = docs/specs/implementation-plans/SPEC-DOM-001-implementation-plan.md
SOURCE_AUDIT = docs/specs/implementation-plans/audits/SPEC-DOM-001-implementation-plan-audit-2026-09-15-reaudit-003.md
SOURCE_FINDING = CIPA-MAJOR-001
CAPABILITY = CAP-DOM-COMMAND-AUTHORITY-OBSERVATION
CONSUMER = DOM-IMP-05 / DOM-001-TICKET-005
```

## 3. Authority Context

The owner is `SPEC-DOM-001 / DOM` through O-011 and DOM-CMD-001. The accepted
authority assigns DOM-IMP-03/T003 only to
`CAP-DOM-ADR-AUTHORITY-READ-OBSERVATION`. No accepted authority assigns a
producer for the complete command observation containing pipeline identity,
revision, stage, precondition evidence, and dependency/verdict freshness.

## 4. Finding Intake and Revalidation

| Finding | Validation | Result |
| --- | --- | --- |
| CIPA-MAJOR-001 | CONFIRMED by current source, ticket, and read-only search | PARTIALLY_REMEDIATED; Plan is truthful, upstream producer remains unresolved |

## 5. Plan Changes Applied

The Plan now:

- names `CAP-DOM-COMMAND-AUTHORITY-OBSERVATION` explicitly;
- records authority/contract/local-testability/productive-availability as
  separate dimensions;
- records `PRODUCTIVE_AVAILABILITY=NO` and
  `REQUIRED_FOR_LOCAL_EXECUTION`;
- marks both T005 witnesses non-executable at local closure;
- changes DOM-IMP-05 to `LOCAL_CLOSURE=NO` and `PLAN_BLOCKED`;
- preserves DOM-IMP-04 as a necessary predecessor but does not invent a
  producer edge;
- explicitly rejects DOM-IMP-03/T003 as the command producer;
- prevents capability promotion without a productive implementation,
  composition, first/second read evidence, and independent runtime evidence.

No acceptance obligation, Gap ID, owner, failure meaning, or normative
dependency was changed.

## 6. Upstream Escalation

```text
REQUIRED_UPSTREAM_ACTION = authorize the canonical producer/composition for CAP-DOM-COMMAND-AUTHORITY-OBSERVATION
DO_NOT = assign DOM-IMP-03/T003; promote InMemory/Sequence readers; use defaults; derive authority from caller claims; duplicate authority in T005
NEXT_GATE = fresh independent Plan audit after producer authority is resolved
```

## 7. Change Boundary Proof

```text
ADRS_CHANGED = NO
PORTFOLIO_CHANGED = NO
COMPONENT_SPEC_CHANGED = NO
UPSTREAM_SPECS_CHANGED = NO
GAP_MATRIX_CHANGED = NO
PRODUCTION_CODE_CHANGED_BY_THIS_REMEDIATION = NO
TESTS_CHANGED_BY_THIS_REMEDIATION = NO
TICKETS_CHANGED_BY_THIS_REMEDIATION = NO
```

The T005 ticket/index synchronization is recorded separately after this Plan
revalidation and does not claim to repair the missing producer.

## 8. Re-audit Readiness

The Plan is not ready for issue decomposition or producer-ticket creation.
The correct next action is upstream authority resolution, followed by a fresh
independent Plan audit and ticket-set audit. T005 remains blocked until those
gates produce a named producer and productive evidence.
