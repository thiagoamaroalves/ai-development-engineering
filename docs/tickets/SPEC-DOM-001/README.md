# SPEC-DOM-001 — Implementation Tickets

## 1. Authority

This index converts the conformant `SPEC-DOM-001` Implementation Plan into
execution artifacts. Authority chain: accepted ADRs → approved portfolio →
conformant component SPEC → validated Gap Matrix → conformant Implementation
Plan → independent Plan Audit → tickets. Tickets preserve scope and do not
approve, redesign, or implement the work.

Gates: `PORTFOLIO_DECOMPOSITION_APPROVED`, `PASS — COMPONENT_SPEC_CONFORMANT`,
`GAP_MATRIX_CONFORMANT`, `IMPLEMENTATION_PLAN_CONFORMANT`,
`READY_FOR_ISSUE_DECOMPOSITION`.

## 2. Baselines

| Artifact | Path | SHA-256 / result |
|---|---|---|
| Portfolio | `docs/specs/SPEC-PORTFOLIO-001-organization.md` | `C449388972279D8ADD520564A9614CFA236F87B6C8932A70D5BC2D28EEF6BE86` |
| Portfolio audit | `docs/specs/SPEC-PORTFOLIO-001-decomposition-audit.md` | `120F22D0080AC0640EBBDAD7C460DF5DE2745788CFAEA83A1859F2C577168104` |
| Component SPEC | `docs/specs/SPEC-DOM-001-workflow-authority-and-governance.md` | `CB4A21924D9619B8349D6CC239D7998633C402D7EA3D7461C2D4D8498F9A014C` |
| Component SPEC audit | `docs/specs/audits/SPEC-DOM-001-component-conformance-audit.md` | `9BBEA969820F3705354EE6CA76110039F747D9AA60C84E1A19CAE49F01158C15` |
| Gap Matrix | `docs/specs/gap-matrices/SPEC-DOM-001-implementation-gap-matrix.md` | `8D8401903F5558C129FCB516F699D7DB40DDFCBF83D52B136AE22CA95976675C` |
| Gap Matrix audit | `docs/specs/gap-matrices/audits/SPEC-DOM-001-implementation-gap-matrix-audit.md` | `445755D48204567770A663A58D23EBCD61C3029653CD3463BD4E34860C517510` |
| Implementation Plan | `docs/specs/implementation-plans/SPEC-DOM-001-implementation-plan.md` | `056BB6182FE8BC526EDD38909B2F6E6D3AF9F201CD55397AB001108E9C90C7D1` |
| Plan Audit | `docs/specs/implementation-plans/audits/SPEC-DOM-001-implementation-plan-audit.md` | `F580DD9328A76929D329F7786A5B424AFE23E74B916FEA39C7C22FB269F69E12` / `IMPLEMENTATION_PLAN_CONFORMANT` |
| Current HEAD | repository | `cbd5fb94a5eb27f059944e19bc479b3f7587de27` |

`TICKET_DECOMPOSITION_BASELINE` (captured from the audited set before this
remediation):

| Artifact | Pre-remediation SHA-256 |
|---|---|
| Ticket index (`README.md`) | `AF8F26C38E1D0D5A2746CA34157562841FF4329D73FF359D20CDE87064035148` |
| TICKET-001 | `947E16E7809A03F699CBFC38167793533EAA9E78A6D5EB310E5706FFF3EE4578` |
| TICKET-002 | `C6FB6AD669DA76EC853901EFE3EC13C26B9A7746AD7C2024BA297E772860905B` |
| TICKET-003 | `12EE603BF6B7AC6B5C6112FA94AFEBE086CDB133DD13B705A2408A69339E10A5` |
| TICKET-004 | `69046BD72412C4E93389ADE296063A0278C6C932E574D09B3C1C5698EA843738` |
| TICKET-005 | `657D24AB75422938093BB7331E073156419E07017579FCF149DE9DB47AAF2F7F` |
| TICKET-006 | `9B18DEA6E1AB5197208CC7CFB03D5FBC013FC4CBC4F92F82C1A84CB2F36646A0` |
| TICKET-007 | `ECD65E4D7DF247513F4DA3E865F2F6A9BB09AD1347E57FBB924B1AD8F71F9639` |
| TICKET-008 | `FD0A1DB549D92A26E7B32F8FB6DBBC8FB730A3DD3ED179E6921D3E5DC3C11D58` |
| TICKET-009 | `C8F956893EDAE9380512EEFE78168303559A4CAA9F25EB447F8F4C4378410BEF` |
| TICKET-010 | `1BA7703411A97CA2B1EF22F4C60B8991F86B6A3DD0C732694EA5A42098A0C256` |
| TICKET-011 | `E56C34FF18EA19649FCF5AF60B5CB4C6C0503DDD5B188A56CF147C50B26DBA65` |
| TICKET-012 | `0D7A87B336986BB58CF4E871F7B7B857B291825F706DC92BB2149DFBA8A560D8` |

The preceding digest table is historical input. The current reconciled ticket
set digest is recorded by the remediation report and must be independently
recomputed by the next ticket audit.

Working tree includes the audited plan/audit changes and unrelated documentary
changes. No authority artifact, code, test, migration, or upstream plan was
modified by ticket decomposition. Superseded ticket artifacts are preserved at
`.history/tickets/SPEC-DOM-001-2026-09-09`.

## 3. Ticket Status Summary

| Ticket | Unit | Status | Wave | Blocked by |
|---|---|---|---:|---|
| DOM-001-TICKET-001 | DOM-IMP-01 | COMPLETED | 1 | NONE |
| DOM-001-TICKET-002 | DOM-IMP-02 | READY | 2 | NONE |
| DOM-001-TICKET-003 | DOM-IMP-03 | BLOCKED | 3 | TICKET-002 |
| DOM-001-TICKET-004 | DOM-IMP-04 | READY | 2 | NONE |
| DOM-001-TICKET-005 | DOM-IMP-05 | BLOCKED | 3 | TICKET-004 |
| DOM-001-TICKET-006 | DOM-IMP-06 | BLOCKED | 4 | TICKET-004, TICKET-005 |
| DOM-001-TICKET-007 | DOM-IMP-07 | BLOCKED | 4 | TICKET-004, TICKET-005 |
| DOM-001-TICKET-008 | DOM-IMP-08 | BLOCKED | 4 | TICKET-005 |
| DOM-001-TICKET-009 | DOM-IMP-09 | BLOCKED | 5 | TICKET-008 |
| DOM-001-TICKET-010 | DOM-IMP-10 | BLOCKED | 5 | TICKET-003, TICKET-006 |
| DOM-001-TICKET-011 | DOM-IMP-11 | BLOCKED | 5 | TICKET-007 |
| DOM-001-TICKET-012 | DOM-IMP-12 | BLOCKED | 6 | TICKET-002 through TICKET-011 |

## 4. Implementation Unit → Ticket Traceability

| Unit | Ticket | Mapping | Readiness | Initial DAG state |
|---|---|---|---|---|
| DOM-IMP-01 | TICKET-001 | 1:1 | ISSUE_READY | READY |
| DOM-IMP-02 | TICKET-002 | 1:1 | ISSUE_READY | BLOCKED |
| DOM-IMP-03 | TICKET-003 | 1:1 | ISSUE_READY | BLOCKED |
| DOM-IMP-04 | TICKET-004 | 1:1 | ISSUE_READY | BLOCKED |
| DOM-IMP-05 | TICKET-005 | 1:1 | ISSUE_READY | BLOCKED |
| DOM-IMP-06 | TICKET-006 | 1:1 | ISSUE_READY | BLOCKED |
| DOM-IMP-07 | TICKET-007 | 1:1 | ISSUE_READY | BLOCKED |
| DOM-IMP-08 | TICKET-008 | 1:1 | ISSUE_READY | BLOCKED |
| DOM-IMP-09 | TICKET-009 | 1:1 | ISSUE_READY | BLOCKED |
| DOM-IMP-10 | TICKET-010 | 1:1 | ISSUE_READY | BLOCKED |
| DOM-IMP-11 | TICKET-011 | 1:1 | ISSUE_READY | BLOCKED |
| DOM-IMP-12 | TICKET-012 | 1:1 | ISSUE_READY | BLOCKED |

No split or merge was authorized: `FALSE_TICKET_SPLITS = 0` and
`FALSE_TICKET_MERGES = 0`.

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

All 21 locally owned obligations are mapped; `UNMAPPED_PORTFOLIO_OBLIGATIONS = 0`.

## 6. Gap → Ticket Traceability

| Gaps | Requirements | Ticket |
|---|---|---|
| GAP-001, GAP-006 | DOM-ID-001, DOM-LINEAGE-001 | TICKET-001 |
| GAP-003, GAP-004, GAP-005 | DOM-INGEST-001, DOM-SNAPSHOT-001, DOM-ELIG-001 | TICKET-002 |
| GAP-007, GAP-008, GAP-009 | DOM-LIFE-001, DOM-REV-001, DOM-IMMUT-001 | TICKET-003 |
| GAP-010 | DOM-PIPE-001, DOM-STATE-001 | TICKET-004 |
| GAP-011, GAP-012 | DOM-CMD-001 | TICKET-005 |
| GAP-014, GAP-015 | DOM-TICKET-001, DOM-TICKET-002 | TICKET-006 |
| GAP-013, GAP-016 | DOM-ADV-001, DOM-PUB-001 | TICKET-007 |
| GAP-017, GAP-018 | DOM-AUDIT-001, DOM-AUDIT-002 | TICKET-008 |
| GAP-019 | DOM-AUDIT-003 | TICKET-009 |
| GAP-021 | DOM-AUDIT-005 | TICKET-010 |
| GAP-022 | DOM-AUDIT-006 | TICKET-011 |
| GAP-020 | DOM-AUDIT-004 | TICKET-012 |

All 21 active local gaps are covered exactly once;
`UNMAPPED_LOCAL_GAPS = 0`.

## 7. Acceptance → Ticket Traceability

| Acceptance | Local proof owner | Contributor tickets |
|---|---|---|
| AC-DOM-001, AC-DOM-005 | TICKET-001 | TICKET-001 |
| AC-DOM-002–AC-DOM-004 | TICKET-002 | TICKET-002 |
| AC-DOM-006–AC-DOM-008 | TICKET-003 | TICKET-003 |
| AC-DOM-009, AC-DOM-010 | TICKET-004 | TICKET-004 |
| AC-DOM-011 | TICKET-005 | TICKET-005 |
| AC-DOM-012, AC-DOM-013 | TICKET-006 | TICKET-006 |
| AC-DOM-014, AC-DOM-015 | TICKET-007 | TICKET-007 |
| AC-DOM-049, AC-DOM-050 | TICKET-008 | TICKET-008 |
| AC-DOM-051 | TICKET-009 | TICKET-009 |
| AC-DOM-053 | TICKET-010 | TICKET-010 |
| AC-DOM-054 | TICKET-011 | TICKET-011 |
| AC-DOM-052 | TICKET-012 | TICKET-001–TICKET-011 |

`UNRESOLVED_TICKET_FINAL_PROOF_OWNERS = 0`; AC-DOM-052 has exactly one final
proof owner, TICKET-012.

## 8. Dependency / Blocker Graph

```text
TICKET-001
├── TICKET-002 ── TICKET-003 ──┐
├── TICKET-004 ── TICKET-005 ──┼── TICKET-006 ── TICKET-010 ──┐
│                              ├── TICKET-007 ── TICKET-011 ──┤
└──────────────────────────────└── TICKET-008 ── TICKET-009 ──┤
                                                              └── TICKET-012
```

Additional direct edges are preserved: TICKET-001 → TICKET-005 and TICKET-011;
TICKET-001 → TICKET-012; TICKET-007 → TICKET-010; and TICKET-001–TICKET-011
→ TICKET-012 where required by the Plan. `TICKET_BLOCKER_GRAPH_CYCLE = NO`.

After local finalization of TICKET-001, its seven satisfied blocker edges are
released. TICKET-002 and TICKET-004 are newly unblocked; TICKET-003, TICKET-005,
TICKET-008, TICKET-011, and TICKET-012 retain their other blockers. The
dependency edges remain in `DEPENDS_ON` for lineage and completion ordering.

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

Issue decomposition readiness is `ISSUE_READY` for all 12 units. Initial
execution state is separate: 1 ticket was initially `READY` and 11 were
`BLOCKED` by unresolved internal prerequisites. After local finalization, the
current execution state is 2 READY, 1 COMPLETED, and 9 BLOCKED. No ticket is
READY because of wave number alone.

Current execution state after TICKET-001 local finalization:

```text
READY_TICKETS = 2
VALIDATION_REQUIRED_TICKETS = 0
BLOCKED_TICKETS = 9
IMPLEMENTED_TICKETS = 0
DONE_TICKETS = 1
NEXT_GATE = DOWNSTREAM_IMPLEMENTATION
```

## 11. Cross-Spec Dependencies

| Foreign owner | Consumer tickets | Contract | Local blocker? |
|---|---|---|---|
| SPEC-EXEC-001 | TICKET-002 | exact skill/contract metadata | No |
| SPEC-EXEC-002 | TICKET-003, 006–010, 012 | session/activity/scheduling evidence | No |
| SPEC-PLAT-001 | TICKET-001, 002, 004, 005, 007, 010–012 | durable records, provenance, effects, recovery | No |
| SPEC-REPO-001 | TICKET-002, 003, 010, 011 | legacy mapping without authority transfer | No |
| SPEC-GIT-001 | TICKET-007, 010–012 | publication/integration evidence | No |
| SPEC-BACKEND-001 | TICKET-005–007, 012 | command/result mapping | No |
| SPEC-OPS-001 | TICKET-001, 003, 005, 010–012 | correlation and projections | No |
| SPEC-UI-001 | TICKET-002, 004–007, 012 | request/read projection | No |

Every dependency retains its `PRODUCER_CONSUMER_CONTRACT_PROOF`; no foreign
lifecycle or physical implementation is assigned to a DOM ticket.

### 11.1 Capability Availability Records

These are shared handoff records consumed from the validated Matrix and current
Plan. They do not create local DOM gaps, transfer ownership, or promote a
foreign producer. Local fixtures prove contract behavior only.

| CAPABILITY_ID | AUTHORITY_OWNER | PRODUCER | CONSUMER | CONTRACT | AUTHORITY_STATUS | CONTRACT_STATUS | LOCAL_TESTABILITY | PRODUCTIVE_AVAILABILITY | DEPENDENCY_CLASS | BLOCKING_EFFECT |
|---|---|---|---|---|---|---|---|---|---|---|
| CAP-EXEC-EXACT-VERSION-BASIS | SPEC-EXEC-001 | EXEC-001 registry | DOM-SNAPSHOT-001 / DOM-ADV-001 | exact skill/capability identity, version, revision, compatibility basis, returned result | DEFINED | DEFINED | NO | NO | REQUIRED_FOR_INTEGRATED_PROOF | does not block local execution or local closure; blocks integrated proof only |
| CAP-PLAT-SNAPSHOT-PIPELINE-PROVENANCE | SPEC-PLAT-001 | PLAT journal/checkpoint reader | DOM-SNAPSHOT-001 / DOM-PIPE-001 / DOM-STATE-001 | canonical identity/reference revisions, persistence revision, current state, ordered append-only provenance | DEFINED | DEFINED | NO | NO | REQUIRED_FOR_INTEGRATED_PROOF | does not block local execution or local closure; blocks integrated proof only |
| CAP-GIT-CANDIDATE-REMOTE-CONFIRMATION | SPEC-GIT-001 | GIT remote observation adapter | DOM-PUB-001 / DOM-AUDIT-006 | PublicationId, candidate base/head/tree, remote result, confirmation revision, independent observation | DEFINED | DEFINED | NO | NO | REQUIRED_FOR_INTEGRATED_PROOF | does not block local execution or local closure; blocks integrated proof only |

Capability semantic and evidence fields:

| CAPABILITY_ID | SEMANTIC_STATUS | AVAILABILITY_EVIDENCE | FAILURE_NOT_FOUND_STALE_SEMANTICS | VERSION_REVISION_TRANSPORT |
|---|---|---|---|---|
| CAP-EXEC-EXACT-VERSION-BASIS | CONTRACT_DEFINED_NONPRODUCTIVE | no productive EXEC registry/adapter in current repository; authority and contract are defined by SPEC-EXEC-001 | unknown, incompatible, missing, or stale basis fails closed | producer returns exact version/revision; consumer stores and transports it unchanged |
| CAP-PLAT-SNAPSHOT-PIPELINE-PROVENANCE | CONTRACT_DEFINED_NONPRODUCTIVE | no productive PLAT journal/checkpoint reader or adapter in current repository; ports are not availability | missing, detached, stale, corrupt, duplicate, omitted, or inconsistent material fails closed | producer returns persistence/domain/identity revisions and provenance order; consumer preserves them |
| CAP-GIT-CANDIDATE-REMOTE-CONFIRMATION | CONTRACT_DEFINED_NONPRODUCTIVE | no productive GIT remote observation adapter in current repository; mock publication is not availability | merge-only, stale, drifted, mismatched, or missing confirmation fails closed | producer returns candidate-bound base/head/tree and confirmation revision; consumer binds exact candidate |

For every record, AVAILABILITY_EVIDENCE is the absence of a productive
producer/adapter in the current repository. Local fixture, mock, fake,
interface, and in-memory repository evidence is not productive availability.
FAILURE_NOT_FOUND_STALE_SEMANTICS and VERSION_REVISION_TRANSPORT are preserved
from the Plan capability records. NO_DOWNSTREAM_CAPABILITY_PROMOTION_WITHOUT_NEW_EVIDENCE
remains mandatory. Each ticket PCP section identifies its applicable
CAPABILITY_ID and reconciles to this table.

## 12. Parallelization Waves

Waves and modes are inherited from the Plan. Same-wave tickets use
`SAFE_WITH_COORDINATION`; shared domain/event vocabulary is coordinated and no
dependency is weakened for parallelism.

## 13. Final Proof Ownership

AC-DOM-001–AC-DOM-015 and AC-DOM-049–AC-DOM-051, AC-DOM-053–AC-DOM-054 are
owned by their corresponding local ticket. TICKET-001–TICKET-011 contribute to
AC-DOM-052; TICKET-012 is its sole final proof owner.

## 14. Ticket Split / Merge Ledger

| Units | Split | Merge | Reason |
|---|---:|---:|---|
| DOM-IMP-01–DOM-IMP-12 | 0 | 0 | each conformant, locally closable Unit maps 1:1 to one ticket |

## 15. Closure Metrics

```text
IMPLEMENTATION_UNITS_TOTAL = 12
ISSUE_READY_UNITS = 12
INTERNAL_ONLY_UNITS = 0
PLAN_BLOCKED_UNITS = 0
IMPLEMENTATION_UNITS_DECOMPOSED = 12
IMPLEMENTATION_UNITS_NOT_DECOMPOSED = 0
TICKETS_CREATED = 12
READY_TICKETS = 2
VALIDATION_REQUIRED_TICKETS = 0
IMPLEMENTED_TICKETS = 0
DONE_TICKETS = 1
BLOCKED_TICKETS = 9
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
READY_TICKETS_WITH_UNAVAILABLE_CONTRACT = 0
TICKET_VALIDATION_REQUIRED = 0
DAG_EDGES_RELEASED = 7
TICKETS_NEWLY_UNBLOCKED = 2
OPEN_INTEGRATED_FINDINGS = 1
DOWNSTREAM_CHECKPOINTS_PRESERVED = YES
SPEC_FINAL_CONFORMANCE_STATE = NOT_FINAL_CONFORMANT_YET
UPSTREAM_AUTHORITY_BLOCKER_MISMATCHES = 0
PRODUCER_CONSUMER_CONTRACT_ERRORS = 0
CAPABILITY_AVAILABILITY_RECORDS = 3
CAPABILITY_AVAILABILITY_CLASSIFICATION_ERRORS = 0
AUTHORITY_NOT_DEFINED = 0
AUTHORITY_DEFINED_BUT_NOT_CONSUMABLE = 3
DOWNSTREAM_PROMOTION_WITHOUT_NEW_EVIDENCE = 0
INDEX_STATUS_MISMATCHES = 0
INDEX_BLOCKER_MISMATCHES = 0
INDEX_COVERAGE_MISMATCHES = 0
INDEX_FINAL_PROOF_MISMATCHES = 0
INDEX_METRIC_MISMATCHES = 0
REQUIRED_BEHAVIORS_TOTAL = 29
ACCEPTANCE_CRITERIA_TOTAL = 21
DIRECT_BEHAVIOR_WITNESSES = 29
PROXY_ONLY_BEHAVIORS = 0
UNTESTED_STATE_TRANSITIONS = 0
UNPROVEN_CONCURRENCY_CONTRACTS = 0
MISSING_ARCHITECTURE_GUARDS = 0
```

## 16. Ticket Decomposition Gate

```text
TICKET_DECOMPOSITION_GATE: READY_FOR_TICKET_AUDIT
```

Current execution gate:

```text
TICKET_EXECUTION_GATE: DOWNSTREAM_IMPLEMENTATION
NEWLY_READY_TICKETS: 2
```

All `ISSUE_READY` units are decomposed with complete traceability, preserved
ownership/dependencies, local closure, direct witness matrices, mechanical
status/blocker derivation, and acyclic graph. The mandatory next step is an
independent ticket audit. TICKET-001 is now locally finalized; the next
action is downstream implementation of TICKET-002 and TICKET-004, subject to
their own gates.

## 17. Local Finalization Handoff

```text
FINALIZATION_VERDICT: TICKET_FINALIZED_LOCALLY
FINAL_TICKET_STATUS: DOM-001-TICKET-001 = COMPLETED
LOCAL_CLOSURE_PERSISTED: YES
OPEN_INTEGRATED_FINDINGS: 1
OPEN_INTEGRATED_FINDING_IDS: IMA-MAJOR-002
IMA-MAJOR-002: OPEN_INTEGRATED_ONLY
IMA-MAJOR-002_BLOCKS_TICKET_DONE: NO
IMA-MAJOR-002_BLOCKS_INTEGRATED_PROOF: YES
IMA-MAJOR-002_BLOCKS_SPEC_FINAL_CONFORMANCE: YES
IMA-MAJOR-002_PRIMARY_ROUTE: IMPLEMENTATION_PLAN_REVALIDATION
IMA-MAJOR-002_OPEN_INTEGRATED_FINDING_TRACEABILITY: COMPLETE
DAG_EDGES_RELEASED: 7
DEPENDENCY_SATISFIED_FOR: DOM-001-TICKET-002, DOM-001-TICKET-003, DOM-001-TICKET-004, DOM-001-TICKET-005, DOM-001-TICKET-008, DOM-001-TICKET-011, DOM-001-TICKET-012
TICKETS_NEWLY_UNBLOCKED: DOM-001-TICKET-002, DOM-001-TICKET-004
TICKETS_STILL_BLOCKED: DOM-001-TICKET-003, DOM-001-TICKET-005, DOM-001-TICKET-006, DOM-001-TICKET-007, DOM-001-TICKET-008, DOM-001-TICKET-009, DOM-001-TICKET-010, DOM-001-TICKET-011, DOM-001-TICKET-012
DOWNSTREAM_CHECKPOINTS_PRESERVED: YES
SPEC_FINAL_CONFORMANCE_STATE: NOT_FINAL_CONFORMANT_YET
PLAT_IMPLEMENTED: NO
PRODUCTIVE_AVAILABILITY_PROMOTED: NO
INTEGRATED_PROOF_AUTO_APPROVED: NO
SPEC_FINALIZED: NO
```
