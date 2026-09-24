# SPEC-EXEC-001 — Upstream SPEC Revalidation Handoff

```text
HANDOFF_TYPE = UPSTREAM_SPEC_REVALIDATION
HANDOFF_STATUS = HUMAN_REQUIRED
SPEC = SPEC-EXEC-001
TICKET = EXEC-001-TICKET-002
IMPLEMENTATION_UNIT = EXEC-IMP-02
BLOCKING_FINDING = IMA-MAJOR-013
PRIMARY_ROUTE = SPEC_REVALIDATION
```

## Purpose

This handoff records why implementation of TICKET-002 cannot continue. The
implementation audit found a missing normative resolution-selection rule. The
next agent must return to the SPEC authority phase before changing production
code or tests.

## Current canonical state

```text
CURRENT_HEAD = 4dac9ad1e566893aae2c8f55cf8ece138f91546f
LATEST_TICKET_AUDIT = docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-implementation-audit.md
AUDIT_ROUND = 9
AUDIT_TARGET_HEAD = 49b4448ba10ee9aa9d3ce7d47b139de474a482ba
TICKET_IMPLEMENTATION_VERDICT = TICKET_IMPLEMENTATION_REMEDIATION_REQUIRED
TICKET_GATE = NOT_READY_FOR_DONE
REMEDIATION_VERDICT = TICKET_IMPLEMENTATION_REMEDIATION_BLOCKED
REMEDIATION_PREFLIGHT = BLOCKED
REQUIRED_UPSTREAM_ACTION = SPEC_REVALIDATION
```

The current remediation evidence is intentionally preserved at:

```text
docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-implementation-remediation.md
```

It is evidence of a blocked remediation attempt, not approval, completion, or
permission to implement a local workaround. Do not delete or reset it.

## Finding that requires upstream resolution

`IMA-MAJOR-013` establishes that distinct registry entries may contain
overlapping explicit supported-version sets, but the governing authority does
not define what the resolver must do in that case. The current implementation
and tests cannot establish an authorized canonical mapping merely by being
deterministic or registration-order independent.

The missing rule must be one of the following, or another explicitly justified
normative rule approved by the proper authority:

1. **Reject overlap:** registration/frozen-basis construction rejects
   overlapping supported sets with a canonical failure and preserves the
   immutable basis; or
2. **Define precedence/identity:** the authority defines an explicit,
   deterministic precedence and identity rule, including ties, ambiguity,
   registration-order independence, basis freezing, and the canonical failure
   when selection is not uniquely determined.

Do not choose between these alternatives in implementation code, tests, the
Implementation Design, or the ticket. That would invent normative authority.

## Required upstream work

The agent handling the review must:

1. Revalidate `docs/specs/SPEC-EXEC-001-skill-contracts-and-capability-registry.md`
   against accepted ADR-0003 and the approved portfolio boundary.
2. Decide whether the missing semantics require an ADR revision or can be
   normatively completed within the SPEC while preserving ADR authority.
3. Add complete, testable requirements for overlap behavior, identity,
   precedence/rejection, ambiguity, canonical outcomes, immutability, and
   registration-order independence.
4. Preserve EXEC ownership of version resolution and registry selection; do not
   transfer this rule to DOM, REPO, or an integrated-only producer.
5. Independently audit the revised SPEC before downstream artifacts are used.
6. Revalidate or regenerate affected Gap Matrix, Implementation Plan, ticket,
   and Implementation Design artifacts according to their canonical gates.
7. Only after those gates pass, return TICKET-002 to the implementation audit /
   remediation route.

## Explicit non-actions

Until upstream authority is accepted and independently audited:

- do not modify `src/domain/exec-registry.ts` to pick rejection or precedence;
- do not add an overlap test that assumes one of those semantics;
- do not mark TICKET-002 `DONE`;
- do not checkpoint the blocked remediation as a successful remediation;
- do not treat the integrated-only findings as local implementation blockers;
- do not erase the round-9 audit, remediation evidence, or finding lineage.

## Source evidence

```text
docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-implementation-audit.md
  - IMA-MAJOR-013
  - §§13–17 finding lineage and remediation route
  - PRIMARY_ROUTE = SPEC_REVALIDATION

docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-implementation-remediation.md
  - TICKET_IMPLEMENTATION_REMEDIATION_BLOCKED
  - REMEDIATION_PREFLIGHT = BLOCKED
  - REQUIRED_UPSTREAM_ACTION = SPEC_REVALIDATION

docs/specs/SPEC-EXEC-001-skill-contracts-and-capability-registry.md
  - current normative authority requiring revalidation
```

This document is a routing and context handoff. It does not introduce or
approve normative behavior.
