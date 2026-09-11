# DOM-001-TICKET-004 — Ticket conformance specialist audit (re-audit)

```text
AUDIT_ROUND: RE_AUDIT
AUDIT_MODE: READ_ONLY / INDEPENDENT / ADVERSARIAL / SPEC_FIRST / EVIDENCE_REQUIRED
TICKET_ID: DOM-001-TICKET-004
TICKET_STATUS: VALIDATION_REQUIRED
IMPLEMENTATION_UNIT: DOM-IMP-04
GAP_IDS: GAP-010
REQUIREMENT_IDS: DOM-PIPE-001, DOM-STATE-001
ACCEPTANCE_IDS: AC-DOM-009, AC-DOM-010
SPEC_PATH: docs/specs/SPEC-DOM-001-workflow-authority-and-governance.md
GAP_MATRIX_PATH: docs/specs/gap-matrices/SPEC-DOM-001-implementation-gap-matrix.md
IMPLEMENTATION_PLAN_PATH: docs/specs/implementation-plans/SPEC-DOM-001-implementation-plan.md
PLAN_AUDIT_PATH: docs/specs/implementation-plans/audits/SPEC-DOM-001-implementation-plan-audit.md
TICKET_AUDIT_PATH: docs/tickets/SPEC-DOM-001/implementation-ticket-audit.md
IMPLEMENTATION_BASELINE: 646f5c67ffe0cdd9e0abeb9df0489ecb4f4a3b24
CURRENT_HEAD: 646f5c67ffe0cdd9e0abeb9df0489ecb4f4a3b24
AUDIT_TARGET_HEAD: 646f5c67ffe0cdd9e0abeb9df0489ecb4f4a3b24 + semantic worktree state
AUDIT_BASIS_FINGERPRINT:
  src/domain/pipeline.ts=E02D4765A9FE4B38C6DF873220FC2F1DEA34FC0F2ED10C9B5A9639D3D6EB605F
  src/application/pipeline.ts=9B31182CB338C5B7E1904792E7748E84E5779F80D3CE05EE54F5B35AA5951E47
  tests/dom-001-ticket-004.test.ts=645DAC93DF4DB4912B3BCF09137F13FFA771A1B634C90CB9DCB3A822E2AE0E38
```

## Traceability and scope

The accepted ADR, SPEC, validated Gap Matrix, conformant Plan, and ticket
authorize immediate canonical pipeline order, complete accepted provenance for
later rehydration, separate machine inputs, and local CAS semantics. Current
production code consumes the canonical `STAGE` identity and accepted
provenance ports. No foreign lifecycle or physical PLAT implementation is in
scope.

| Obligation | Result | Evidence |
|---|---|---|
| GAP-010 | PARTIALLY EVIDENCED | production code is present; direct negative matrix is incomplete |
| DOM-PIPE-001 | PARTIALLY CONFORMANT | order and chain checks execute; several required negative cases lack direct tests |
| DOM-STATE-001 | PARTIALLY CONFORMANT | separation and construction guard execute; concurrent independent-state witness is absent |
| AC-DOM-009 | NOT FULLY EVIDENCED | direct suite covers order, valid chain, skip, and revision; duplicate/order/detached/authority-divergence witnesses are missing |
| AC-DOM-010 | PARTIALLY EVIDENCED | separation and CAS are tested; independent-machine concurrency/restart witness is not |

## Completion evidence audit

The three files listed in `EXPECTED_EVIDENCE_FILES` exist. However, the
`14c` producer/consumer proof explicitly references
`evidence/TICKET-004/AC-DOM-009-provenance.md`, which does not exist; the
available file is `AC-DOM-009-rehydration.md`. This is a traceability defect,
not silently treated as satisfied by the similarly named file.

## Acceptance witness gap

The current 11-test suite directly exercises canonical creation/order,
valid-chain rehydration, missing provenance, skip, revision divergence,
canonical identity rejection, accepted-authority absence, state-input
separation, derived-construction rejection, read-only query, stale CAS, and
same-pipeline concurrency. It does not directly execute and assert:

- duplicate provenance record rejection;
- reordered provenance record rejection;
- detached/mismatched provenance identity rejection;
- supplied provenance divergence from the accepted authority;
- concurrent independent machine query/transition separation and restart proof.

These are explicitly named by AC-DOM-009/010 and the ticket's required-test
section. Green tests do not close an unexecuted acceptance witness.

## Findings

### CONF-MAJOR-001 — Required acceptance witnesses are incomplete

The implementation contains validation branches for several cases, but the
ticket's direct evidence matrix does not execute all normative negative and
isolation behaviors. This prevents independent proof of local acceptance and
local closure.

```text
DEPENDENCY_CLASS: REQUIRED_FOR_LOCAL_CLOSURE
LOCAL_CLOSURE_BLOCKING: YES
LOCAL_ACCEPTANCE_REQUIRES_PRODUCTIVE_CAPABILITY: NO
UPSTREAM_DEPENDENCY_CLASSIFICATION_PRESERVED: YES
```

### CONF-MINOR-001 — Explicit evidence reference is missing

The ticket's `PROOF_EVIDENCE` points to a non-existent
`AC-DOM-009-provenance.md`; no canonical evidence record exists at that exact
path.

```text
DEPENDENCY_CLASS: REQUIRED_FOR_LOCAL_CLOSURE
LOCAL_CLOSURE_BLOCKING: YES
LOCAL_ACCEPTANCE_REQUIRES_PRODUCTIVE_CAPABILITY: NO
UPSTREAM_DEPENDENCY_CLASSIFICATION_PRESERVED: YES
```

```text
CHANGED_FILES_RELEVANT_TO_SUBJECT: 5 logical files (1 test, 3 evidence, 1 ticket handoff)
GAPS: 1
GAPS_CLOSED: 0 pending direct witness completion
REQUIREMENTS: 2
REQUIREMENTS_FULLY_CONFORMANT: 0
ACCEPTANCE_CRITERIA: 2
ACCEPTANCE_CRITERIA_FULLY_EVIDENCED: 0
COMPLETION_EVIDENCE_MISSING_OR_MISREFERENCED: 1
UNAUTHORIZED_SCOPE_EXPANSION: NO
FINDINGS: CRITICAL=0 MAJOR=1 MINOR=1 INFO=0
DOMAIN_AUDIT_COMPLETE: YES
SPECIALIST_CONFORMANCE_FINDINGS
```
