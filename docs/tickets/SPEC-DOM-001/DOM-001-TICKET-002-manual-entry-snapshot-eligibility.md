# DOM-001-TICKET-002 — Manual entry, snapshot, and eligibility boundary

## 1. Status

`STATUS: BLOCKED`
`ISSUE_DECOMPOSITION_READINESS: ISSUE_READY`  
`INITIAL_DAG_STATE: BLOCKED`  
`BLOCKED_BY: DOM-001-TICKET-001`
`DEPENDS_ON: DOM-001-TICKET-001`  
`UNBLOCKS: DOM-001-TICKET-003, DOM-001-TICKET-012`

## 2. Source Traceability

- Accepted ADR authority: `ADR-0001` revision 3, SHA-256 `33705082B9D2F46E638CD93BDF27CA676CFC6181A2684AD583E4501F5D06D50D` — manual entry, immutable snapshot, eligibility, and exact revision basis.
- Portfolio: `docs/specs/SPEC-PORTFOLIO-001-organization.md` — O-002, O-003, O-004.
- Component SPEC: `docs/specs/SPEC-DOM-001-workflow-authority-and-governance.md` — DOM-INGEST-001, DOM-SNAPSHOT-001, DOM-ELIG-001.
- Gap Matrix: `docs/specs/gap-matrices/SPEC-DOM-001-implementation-gap-matrix.md` — GAP-003, GAP-004, GAP-005.
- Gap Matrix Audit: `docs/specs/gap-matrices/audits/SPEC-DOM-001-implementation-gap-matrix-audit.md`.
- Implementation Plan: `docs/specs/implementation-plans/SPEC-DOM-001-implementation-plan.md` — DOM-IMP-02.
- Plan Audit: `docs/specs/implementation-plans/audits/SPEC-DOM-001-implementation-plan-audit.md`.

## 3. Authority / Scope

Approved owner: DOM `CANONICAL_OWNER`. Primary owning specification/domain: `SPEC-DOM-001`. Local ownership covers explicit entry, eligibility, snapshot identity, frozen hashes/base/configuration/version semantics, and drift rejection. Foreign capabilities consumed: exact version metadata from EXEC-001 and physical persistence/recovery from PLAT-001, both non-blocking.

## 4. Portfolio Obligation Coverage

`O-002` manual entry; `O-003` immutable execution snapshot; `O-004` accepted-only ADR eligibility.

## 5. Gap / Requirement / Acceptance Coverage

Gaps: `GAP-003`, `GAP-004`, `GAP-005`. Requirements: `DOM-INGEST-001`, `DOM-SNAPSHOT-001`, `DOM-ELIG-001`. Local acceptance: `AC-DOM-002`, `AC-DOM-003`, `AC-DOM-004`. Integrated contribution: `AC-DOM-052`; final proof owner is TICKET-012.

## 6. Implementation Unit

`DOM-IMP-02 — Manual entry, snapshot, and eligibility boundary`. Formation reason: `SHARED_AUTHORITY + SHARED_INTEGRATION_SEAM`. No split siblings; no merge.

## 7. Goal

Make manual submission the only processing trigger and produce an immutable, fail-closed pre-execution authority snapshot.

## 8. Validated Implementation Delta

`OBSERVED`: buttons, mock snapshots, and in-memory eligibility helpers simulate the flow.  
`REQUIRED`: explicit manual trigger, immutable exact snapshot, and accepted-only eligibility.  
`DELTA`: no productive gate exists.

## 9. Required Behavior

Accept explicit manual submission; evaluate only `ACCEPTED`, eligible revisions; freeze ADR hashes, base, configuration, and exact version metadata; reject later authority drift without fallback. Provide the authority basis consumed by execution and persistence owners.

## 10. Does Not Implement

EXEC version capability semantics, PLAT physical persistence/recovery, file discovery, scheduler/session lifecycle, backend/UI transport, or downstream execution.

## 11. Repository Evidence

`src/application/snapshot.ts`, `src/domain/snapshot.ts`, and `tests/dom-001-ticket-002.test.ts`. Reuse immutable value objects; extend the canonical reader and manual-trigger boundary.

## 12. Expected Repository Impact

Production code: submission, snapshot, and eligibility boundary.  
Persistence/schema: explicit mapping seam to PLAT-owned persistence.  
Integration: EXEC exact metadata and consumer mapping.  
Tests: manual trigger, lock, drift, eligibility, and regression tests.  
Legacy/cutover: canonical path with preserved legacy reads.  
Generated contracts: exact metadata mapping contract.

## 13. Dependencies

Internal: `DOM-001-TICKET-001`. Cross-SPEC: `SPEC-EXEC-001` exact version metadata and `SPEC-PLAT-001` physical snapshot persistence/recovery; both are non-blocking for local closure.

## 14. Blocking Conditions

Blocked until `DOM-001-TICKET-001` is completed and its identity contract is available. No unresolved foreign blocker exists.

## 14a. Authority Consumption Proof

| Field | Proof |
|---|---|
| Proof ID / authority existence | `ACP-DOM-02`; `YES` — `ADR-0001` revision 3, SHA-256 `33705082B9D2F46E638CD93BDF27CA676CFC6181A2684AD583E4501F5D06D50D`. |
| Scoped decision / truth owner | `ADR0001-D002`, `ADR0001-D003`; DOM / `SPEC-DOM-001` owns manual initiation, snapshot basis, and eligibility. |
| Semantic source | `DOM-INGEST-001`, `DOM-SNAPSHOT-001`, `DOM-ELIG-001`; `GAP-003`–`GAP-005`. |
| Consumed interface / returned data | Canonical ADR catalog and snapshot command port; returns accepted ADR IDs, hashes, base, configuration, and exact version metadata. |
| Revision/version transport | ADR revision, skill/contract version, base, and configuration hash are frozen in the snapshot. |
| Failure / stale semantics | Automatic start, non-accepted revision, false caller status/hash, drift, corruption, or missing material fail closed with no fallback. |
| Productive availability / evidence | `YES` for the local catalog/snapshot contract and deterministic foreign-contract fixtures; EXEC/PLAT runtime integration is not required to start this ticket. Evidence: rows `T2-AC1`–`T2-AC3`. |
| Result | `AUTHORITY_CONSUMABLE`. |

## 14b. Producer / Consumer Contract Proof

| Field | Proof |
|---|---|
| Contracts / producers / consumer | `PCP-EXEC-01` (EXEC-001 exact metadata), `PCP-PLAT-02` (PLAT snapshot/recovery), `PCP-REPO-01` (REPO legacy mapping); DOM consumes all mappings without transferring authority. |
| Interface / input / returned data | Snapshot and metadata mapping interfaces; input is explicit manual command and canonical accepted ADR; output is immutable exact basis plus mapping result. |
| Revision/version transport | ADR revision, ADR/SPEC hashes, base, configuration, and EXEC skill/contract versions are transported as snapshot fields. |
| Failure / not-found / stale | Missing metadata/material, non-accepted revision, false caller fields, corruption, or later drift yields canonical rejection and no snapshot mutation. |
| Availability / local proof boundary | Contract schemas and deterministic fixtures are available locally; foreign runtime integration remains a later checkpoint and is not a hidden blocker. |
| Evidence / result | Direct snapshot, mutation, corruption, and mapping witnesses `T2-AC1`–`T2-AC3`; PRODUCER_CONSUMER_CONTRACT: PROVEN_LOCAL_FIXTURE, RESULT: CONTRACT_DEFINED_LOCAL_WITNESS_ONLY. |

### Capability Availability Reconciliation

APPLICABLE_SHARED_CAPABILITY_RECORDS: CAP-EXEC-EXACT-VERSION-BASIS, CAP-PLAT-SNAPSHOT-PIPELINE-PROVENANCE.
RECONCILIATION_SOURCE: README section 11.1 and current Plan section 12.1.
AUTHORITY_STATUS = DEFINED; CONTRACT_STATUS = DEFINED; LOCAL_TESTABILITY = NO;
PRODUCTIVE_AVAILABILITY = NO; DEPENDENCY_CLASS = REQUIRED_FOR_INTEGRATED_PROOF.
BLOCKING_EFFECT: no local execution or local-closure block; integrated proof
only. Local fixture evidence is contract-level only. Complete owner, producer,
consumer, contract, failure semantics, version transport, and availability
evidence are preserved in README section 11.1. For NONE, no shared capability
record is required by the current Plan for this ticket's local closure.
NO_DOWNSTREAM_CAPABILITY_PROMOTION_WITHOUT_NEW_EVIDENCE = TRUE.

## 14c. ACCEPTANCE_WITNESS_MATRIX
`PRODUCER_CONSUMER_CONTRACT_PROOF_FIELDS`: `PRODUCER = SPEC-EXEC-001,
SPEC-PLAT-001, SPEC-REPO-001`; `PRODUCED_CONTRACT = exact version metadata,
durable snapshot/recovery material, and explicit legacy mapping`;
`AUTHORITY_OWNER = SPEC-DOM-001`; `CONSUMER = TICKET-002`;
`CONSUMED_CAPABILITY = canonical snapshot and eligibility mapping interfaces`;
`AVAILABILITY_CONDITION = local catalog, mapping contracts, and deterministic
fixtures available; runtime integration is a later checkpoint`;
`DEPENDENCY_EDGE = EXEC/PLAT/REPO contract → TICKET-002 snapshot boundary`;
`PROOF_EVIDENCE = docs/tickets/SPEC-DOM-001/evidence/TICKET-002/AC-DOM-003-snapshot.md`.

## 14c. ACCEPTANCE_WITNESS_MATRIX

| AC | Normative behavior / verb | Concrete operation | State/transition | Direct positive test | Direct negative/isolation test | Expected evidence | Acceptance owner |
|---|---|---|---|---|---|---|---|
| AC-DOM-002 | Submit manually; reject automatic start | explicit submit command | pre-execution start | `T2-AC1-P` manual command starts processing | `T2-AC1-N` discovery/session state cannot start it | `docs/tickets/SPEC-DOM-001/evidence/TICKET-002/AC-DOM-002-manual-entry.md` | TICKET-002 |
| AC-DOM-003 / AC-DOM-004 | Resolve and freeze accepted canonical ADR | eligibility resolve/snapshot create | immutable snapshot basis | `T2-AC2-P` accepted revision snapshot with exact fields | `T2-AC2-N` proposed/superseded revision, false caller status/hash, and drift reject | `docs/tickets/SPEC-DOM-001/evidence/TICKET-002/AC-DOM-003-snapshot.md` | TICKET-002 |
| AC-DOM-003 / AC-DOM-004 | Rehydrate and reject mutation/drift/corruption | snapshot rehydrate command | snapshot lock/recovery | `T2-AC3-P` exact field round-trip after restart | `T2-AC3-N` mutation, corrupt, or missing record rejects without mutation | `docs/tickets/SPEC-DOM-001/evidence/TICKET-002/AC-DOM-004-rehydration.md` | TICKET-002 |

### Temporal Authority Proof

`TEMPORAL_AUTHORITY_PROOF = TAP-02`; source: Plan `DOM-IMP-02` Temporal
Authority Preconditions. Initial observation is ADR status/hash/revision and
canonical eligibility; the mutation window is before snapshot commit; the
commit point performs an independent second observation; drift detection
compares status/hash/revision and snapshot basis; failure is fail-closed with
prior snapshot state preserved. DOM owns semantic validation and PLAT owns
physical atomicity. Evidence: `docs/tickets/SPEC-DOM-001/evidence/TICKET-002/temporal-authority.md`.

## 15. Implementation Constraints

Manual entry is required; non-`ACCEPTED` or ineligible revisions fail closed; locked snapshots cannot be overwritten; exact metadata and hashes remain historical and drift-sensitive.

## 16. Acceptance Criteria

1. Only an explicit manual command starts processing; discovery and session
   state alone cannot start it.
2. Snapshot resolves current canonical accepted ADR data, stores exact required
   fields, and rejects false caller status/hash or later drift.
3. Rehydration returns the same immutable basis and rejects corrupt/missing
   material. `LOCAL_PROVABILITY = YES` using contract fixtures.

All criteria are `TESTABLE: YES` and `LOCALLY_PROVABLE: YES` after the internal prerequisite.

## 17. Acceptance / Proof Role

`CONTRIBUTOR: YES` to AC-DOM-052. `LOCAL_ACCEPTANCE_OWNER: YES` and `FINAL_PROOF_OWNER: YES` for AC-DOM-002, AC-DOM-003, and AC-DOM-004. Not final owner of AC-DOM-052.

## 18. Required Tests

`LOCAL_TEST_EVIDENCE`: unit/domain tests for manual-only initiation, each eligibility state, snapshot lock, hash/base/configuration/version drift, and no-fallback rejection. `RECOVERY_EVIDENCE`: exact snapshot field round-trip and corrupt/missing material rejection. `INTEGRATION_TEST_EVIDENCE`: EXEC/PLAT mapping is checkpointed separately.

## 19. Completion Evidence

Productive boundary; immutable snapshot evidence; fail-closed rejection tests; and explicit metadata mapping contract. `EXPECTED_EVIDENCE_FILES`: `docs/tickets/SPEC-DOM-001/evidence/TICKET-002/AC-DOM-002-manual-entry.md`, `AC-DOM-003-snapshot.md`, `AC-DOM-004-rehydration.md`, `temporal-authority.md`.

## 20. Completion Gate

```text
COMPLETION_GATE:
  production_code: REQUIRED
  automated_tests: REQUIRED
  integration_evidence: REQUIRED
  legacy_transition_evidence: REQUIRED
  conformance_evidence: REQUIRED
```

## 21. Legacy / Cutover Impact

`ADD_COMPATIBILITY_MAPPING` for historical input; `RETIRE_LEGACY_WRITES` for caller-supplied status/hash as authority. Legacy reads remain explicit.

## 22. Risks

Snapshot mutation or accidental automatic trigger. Mitigation: immutable tests and negative trigger tests.

## 23. Implementation Wave

`WAVE: 2`.

## 24. Parallelization

`SAFE_WITH_COORDINATION`; depends on TICKET-001 and unblocks TICKET-003 and TICKET-012.

## 25. Handoff After Completion

Independent ticket audit may validate this ticket; completion makes lifecycle revision work eligible and contributes snapshot evidence to integrated checkpoints.

## 26. Ticket Local Closure

`TICKET_LOCAL_CLOSURE = YES`. Foreign persistence and recovery proof is excluded from local acceptance.
