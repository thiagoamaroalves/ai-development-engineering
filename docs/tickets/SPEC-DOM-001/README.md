# SPEC-DOM-001 — Implementation Tickets

## 1. Authority

Component: `SPEC-DOM-001`  
Portfolio: `SPEC-PORTFOLIO-001`, approved decomposition revision 2.  
Approved owner: DOM `CANONICAL_OWNER`.  
Governing gates: `PORTFOLIO_DECOMPOSITION_APPROVED`, `PASS — COMPONENT_SPEC_CONFORMANT`, `GAP_MATRIX_CONFORMANT`, `IMPLEMENTATION_PLAN_CONFORMANT`, and `READY_FOR_ISSUE_DECOMPOSITION`.

Authority chain: accepted ADRs → approved portfolio → conformant component SPEC → validated Gap Matrix → conformant Implementation Plan → independent Plan Audit → these tickets.

## 2. Baselines

| Artifact | Path | SHA-256 / value |
|---|---|---|
| Portfolio | `docs/specs/SPEC-PORTFOLIO-001-organization.md` | `c449388972279d8add520564a9614cfa236f87b6c8932a70d5bc2d28eef6be86` |
| Portfolio audit | `docs/specs/SPEC-PORTFOLIO-001-decomposition-audit.md` | `120f22d0080ac0640ebbdad7c460df5de2745788cfaea83a1859f2c577168104` |
| Component SPEC | `docs/specs/SPEC-DOM-001-workflow-authority-and-governance.md` | `768937f1454fb63becd955780212468dbf4f2887a41eeebaad9a18d362716d98` |
| Component SPEC audit | `docs/specs/audits/SPEC-DOM-001-component-conformance-audit.md` | `12dc0461b57cf8074b1215c9147d480558bf738773b6c00a5da4700dc58a5414` |
| Gap Matrix | `docs/specs/gap-matrices/SPEC-DOM-001-implementation-gap-matrix.md` | `e1bbbeaf31cb61d45befc428d79816175bd2aeb7c9faebed5be697234bdd7fed` |
| Gap Matrix audit | `docs/specs/gap-matrices/audits/SPEC-DOM-001-implementation-gap-matrix-audit.md` | `e98c03ace6c2fb4b03d2b90b3c86787c93f0d5bb2e444508cd555ee7d54d49a3` |
| Implementation Plan | `docs/specs/implementation-plans/SPEC-DOM-001-implementation-plan.md` | `3436f03c4786a52998ac6ea13c05f85a386bdd916bca33a9f984758cee7bc551` |
| Plan Audit | `docs/specs/implementation-plans/audits/SPEC-DOM-001-implementation-plan-audit.md` | `70090dec23ae32bebe4b9d86632ac9370364c305009e7a3acdb346ca7dd55195` |
| Current HEAD | repository | `115607e4d0dc51f509b4fdf78ce4f873f46c3230` |

Current HEAD moved after the Plan Audit through documentary/support changes only; authority and plan baselines remain unchanged.

## 3. Ticket Status Summary

| Ticket | Unit | Status | Wave | Blocked by |
|---|---|---|---:|---|
| `DOM-001-TICKET-001` | DOM-IMP-01 | DONE | 1 | NONE |
| `DOM-001-TICKET-002` | DOM-IMP-02 | VALIDATION_REQUIRED | 2 | NONE |
| `DOM-001-TICKET-003` | DOM-IMP-03 | BLOCKED | 3 | TICKET-002 |
| `DOM-001-TICKET-004` | DOM-IMP-04 | VALIDATION_REQUIRED | 2 | NONE |
| `DOM-001-TICKET-005` | DOM-IMP-05 | BLOCKED | 3 | TICKET-004 |
| `DOM-001-TICKET-006` | DOM-IMP-06 | BLOCKED | 4 | TICKET-004, TICKET-005 |
| `DOM-001-TICKET-007` | DOM-IMP-07 | BLOCKED | 4 | TICKET-004, TICKET-005 |
| `DOM-001-TICKET-008` | DOM-IMP-08 | BLOCKED | 4 | TICKET-005 |
| `DOM-001-TICKET-009` | DOM-IMP-09 | BLOCKED | 5 | TICKET-008 |
| `DOM-001-TICKET-010` | DOM-IMP-10 | BLOCKED | 5 | TICKET-003, TICKET-006 |
| `DOM-001-TICKET-011` | DOM-IMP-11 | BLOCKED | 5 | TICKET-007 |
| `DOM-001-TICKET-012` | DOM-IMP-12 | BLOCKED | 6 | TICKET-002 through TICKET-011 |

## 4. Implementation Unit → Ticket Traceability

| Unit | Ticket | Mapping | Readiness | Initial DAG state |
|---|---|---|---|---|
| DOM-IMP-01 | DOM-001-TICKET-001 | 1:1 | ISSUE_READY | READY |
| DOM-IMP-02 | DOM-001-TICKET-002 | 1:1 | ISSUE_READY | BLOCKED |
| DOM-IMP-03 | DOM-001-TICKET-003 | 1:1 | ISSUE_READY | BLOCKED |
| DOM-IMP-04 | DOM-001-TICKET-004 | 1:1 | ISSUE_READY | BLOCKED |
| DOM-IMP-05 | DOM-001-TICKET-005 | 1:1 | ISSUE_READY | BLOCKED |
| DOM-IMP-06 | DOM-001-TICKET-006 | 1:1 | ISSUE_READY | BLOCKED |
| DOM-IMP-07 | DOM-001-TICKET-007 | 1:1 | ISSUE_READY | BLOCKED |
| DOM-IMP-08 | DOM-001-TICKET-008 | 1:1 | ISSUE_READY | BLOCKED |
| DOM-IMP-09 | DOM-001-TICKET-009 | 1:1 | ISSUE_READY | BLOCKED |
| DOM-IMP-10 | DOM-001-TICKET-010 | 1:1 | ISSUE_READY | BLOCKED |
| DOM-IMP-11 | DOM-001-TICKET-011 | 1:1 | ISSUE_READY | BLOCKED |
| DOM-IMP-12 | DOM-001-TICKET-012 | 1:1 | ISSUE_READY | BLOCKED |

No split or merge was authorized; each ticket retains one independently closable Unit.

## 5. Portfolio Obligation → Ticket Traceability

| Obligations | Ticket |
|---|---|
| O-001, O-005 | TICKET-001 |
| O-002, O-003, O-004 | TICKET-002 |
| O-006, O-007, O-008 | TICKET-003 |
| O-009, O-010 | TICKET-004 |
| O-011 | TICKET-005 |
| O-012, O-013 | TICKET-006 |
| O-014, O-015 | TICKET-007 |
| O-049, O-050 | TICKET-008 |
| O-051 | TICKET-009 |
| O-053 | TICKET-010 |
| O-054 | TICKET-011 |
| O-052 | TICKET-012 |

All 21 locally owned obligations are mapped; none are unmapped.

## 6. Gap → Ticket Traceability

| Gaps | Requirements | Ticket |
|---|---|---|
| GAP-001, GAP-005 | DOM-ID-001, DOM-LINEAGE-001 | TICKET-001 |
| GAP-002, GAP-003, GAP-004 | DOM-INGEST-001, DOM-SNAPSHOT-001, DOM-ELIG-001 | TICKET-002 |
| GAP-006, GAP-007, GAP-008 | DOM-LIFE-001, DOM-REV-001, DOM-IMMUT-001 | TICKET-003 |
| GAP-009, GAP-010 | DOM-PIPE-001, DOM-STATE-001 | TICKET-004 |
| GAP-011 | DOM-CMD-001 | TICKET-005 |
| GAP-012, GAP-013 | DOM-TICKET-001, DOM-TICKET-002 | TICKET-006 |
| GAP-014, GAP-015 | DOM-PUB-001, DOM-ADV-001 | TICKET-007 |
| GAP-016, GAP-017 | DOM-AUDIT-001, DOM-AUDIT-002 | TICKET-008 |
| GAP-018 | DOM-AUDIT-003 | TICKET-009 |
| GAP-020 | DOM-AUDIT-005 | TICKET-010 |
| GAP-021 | DOM-AUDIT-006 | TICKET-011 |
| GAP-019 | DOM-AUDIT-004 | TICKET-012 |

All 21 active local Gaps are covered exactly once.

## 7. Acceptance → Ticket Traceability

| Acceptance | Local ticket / contributors | Final proof owner |
|---|---|---|
| AC-DOM-001, AC-DOM-005 | TICKET-001 | TICKET-001 |
| AC-DOM-002, AC-DOM-003, AC-DOM-004 | TICKET-002 | TICKET-002 |
| AC-DOM-006, AC-DOM-007, AC-DOM-008 | TICKET-003 | TICKET-003 |
| AC-DOM-009, AC-DOM-010 | TICKET-004 | TICKET-004 |
| AC-DOM-011 | TICKET-005 | TICKET-005 |
| AC-DOM-012, AC-DOM-013 | TICKET-006 | TICKET-006 |
| AC-DOM-014, AC-DOM-015 | TICKET-007 | TICKET-007 |
| AC-DOM-049, AC-DOM-050 | TICKET-008 | TICKET-008 |
| AC-DOM-051 | TICKET-009 | TICKET-009 |
| AC-DOM-053 | TICKET-010 | TICKET-010 |
| AC-DOM-054 | TICKET-011 | TICKET-011 |
| AC-DOM-052 | TICKET-001–011 contributors | TICKET-012 |

## 8. Dependency / Blocker Graph

```text
TICKET-001
├── TICKET-002 ── TICKET-003 ──┐
├── TICKET-004 ── TICKET-005 ──┼── TICKET-006 ── TICKET-010 ──┐
│                              ├── TICKET-007 ── TICKET-011 ──┤
└──────────────────────────────└── TICKET-008 ── TICKET-009 ──┤
                                                              └── TICKET-012
```

Additional direct edges preserved from the Plan: TICKET-001 → TICKET-011, TICKET-005 → TICKET-008, and every TICKET-001–011 → TICKET-012. `TICKET_BLOCKER_GRAPH_CYCLE = NO`.

## 9. Execution Order

| Wave | Tickets | Mode |
|---:|---|---|
| 1 | TICKET-001 | SERIAL_REQUIRED |
| 2 | TICKET-002, TICKET-004 | SAFE_WITH_COORDINATION |
| 3 | TICKET-003, TICKET-005 | SAFE_WITH_COORDINATION |
| 4 | TICKET-006, TICKET-007, TICKET-008 | SAFE_WITH_COORDINATION |
| 5 | TICKET-009, TICKET-010, TICKET-011 | SAFE_WITH_COORDINATION |
| 6 | TICKET-012 | SERIAL_REQUIRED |

## 10. Initial READY / BLOCKED State

`ISSUE_DECOMPOSITION_READINESS` is `ISSUE_READY` for all 12 tickets. Initial execution status is derived separately from unresolved prerequisites: 1 `READY`, 11 `BLOCKED`. BLOCKED tickets retain `BLOCKED_BY`; no ticket is marked READY prematurely.

Current execution state after finalizing TICKET-001: TICKET-001 is `DONE`.
TICKET-002 and TICKET-004 are `READY` because their only blocker was satisfied.
The remaining 9 tickets stay `BLOCKED` because they retain other unresolved
dependency gates; no unrelated blocker was removed.

## 11. Cross-Spec Dependencies

| Foreign owner | Consumer tickets | Contract consumed | Local blocker? |
|---|---|---|---|
| SPEC-EXEC-001 | TICKET-002 | Exact skill/contract version metadata | No |
| SPEC-PLAT-001 | TICKET-002, 003, 005, 011 | Persistence, evidence, journal, and replay correlation | No |
| SPEC-OPS-001 | TICKET-003, 011 | Hash-linked operational projections/preservation | No |
| SPEC-GIT-001 | TICKET-007, 011 | Publication execution/evidence/confirmation | No |
| SPEC-BACKEND-001 | TICKET-005 | Transport/security result mapping | No |
| SPEC-UI-001 | TICKET-002, 004, 005, 007 | Request/read projection mapping | No |
| SPEC-REPO-001 | TICKET-002, 003, 011 | Historical compatibility adapter | No |

No foreign lifecycle or external work was converted into a local ticket.

## 12. Parallelization Waves

Waves and modes are inherited mechanically from the conformant Plan. Tickets in the same `SAFE_WITH_COORDINATION` wave require coordination around shared domain/event conventions; no dependency is weakened for parallelism.

## 13. Final Proof Ownership

AC-DOM-001–AC-DOM-015 and AC-DOM-049–AC-DOM-051, AC-DOM-053–AC-DOM-054 are final-proof-owned by their corresponding local ticket. TICKET-001–011 contribute evidence to integrated AC-DOM-052; exactly one final proof owner exists: TICKET-012.

`UNRESOLVED_TICKET_FINAL_PROOF_OWNERS = 0`.

## 14. Ticket Split / Merge Ledger

| Unit | Split | Merge | Reason |
|---|---|---|---|
| DOM-IMP-01–12 | No | No | Default one coherent Unit to one ticket; each Unit is independently closable |

`FALSE_TICKET_SPLITS = 0`; `FALSE_TICKET_MERGES = 0`.

## 15. Closure Metrics

```text
IMPLEMENTATION_UNITS_TOTAL = 12
ISSUE_READY_UNITS = 12
INTERNAL_ONLY_UNITS = 0
PLAN_BLOCKED_UNITS = 0
IMPLEMENTATION_UNITS_DECOMPOSED = 12
IMPLEMENTATION_UNITS_NOT_DECOMPOSED = 0
TICKETS_CREATED = 12
READY_TICKETS = 0
BLOCKED_TICKETS = 9
IN_PROGRESS_TICKETS = 0
IMPLEMENTED_TICKETS = 0
VALIDATION_REQUIRED_TICKETS = 2
DONE_TICKETS = 1
PORTFOLIO_OBLIGATIONS_MAPPED = 21
UNMAPPED_PORTFOLIO_OBLIGATIONS = 0
ACTIVE_LOCAL_GAPS = 21
LOCAL_GAPS_COVERED = 21
UNMAPPED_LOCAL_GAPS = 0
ACCEPTANCE_OBLIGATIONS_REFERENCED = 21
UNRESOLVED_TICKET_FINAL_PROOF_OWNERS = 0
FALSE_TICKET_SPLITS = 0
FALSE_TICKET_MERGES = 0
TICKETS_WITH_LOCAL_CLOSURE_NO = 0
TICKETS_WITHOUT_ACCEPTANCE = 0
TICKETS_WITHOUT_TESTS_WHEN_REQUIRED = 0
TICKETS_WITHOUT_COMPLETION_EVIDENCE = 0
STATUS_BLOCKER_MISMATCHES = 0
DEPENDENCY_BLOCKER_MISMATCHES = 0
UNBLOCK_GRAPH_MISMATCHES = 0
UNRESOLVED_EXTERNAL_BLOCKERS = 0
TICKET_BLOCKER_GRAPH_CYCLE = NO
```

## 16. Ticket Decomposition Gate

```text
TICKET_DECOMPOSITION_GATE: READY_FOR_TICKET_AUDIT
CURRENT_IMPLEMENTATION_GATE: TICKET_VALIDATION_REQUIRED
```

The decomposition remains audited and conformant. TICKET-002 and TICKET-004
were implemented in the approved wave and now require independent validation.

```text
EXECUTION_GATE: INDEPENDENT_TICKET_AUDIT_REQUIRED
NEXT_ACTION: audit-implemented-ticket
```
