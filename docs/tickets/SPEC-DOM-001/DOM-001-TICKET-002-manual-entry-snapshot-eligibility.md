# DOM-001-TICKET-002 — Manual entry, snapshot, and eligibility boundary

## 1. Status

`STATUS: BLOCKED`  
`ISSUE_DECOMPOSITION_READINESS: ISSUE_READY`  
`INITIAL_DAG_STATE: BLOCKED`  
`BLOCKED_BY: DOM-001-TICKET-001`  
`DEPENDS_ON: DOM-001-TICKET-001`  
`UNBLOCKS: DOM-001-TICKET-003, DOM-001-TICKET-012`

## 2. Source Traceability

- Portfolio: `docs/specs/SPEC-PORTFOLIO-001-organization.md` — O-002, O-003, O-004.
- Component SPEC: `docs/specs/SPEC-DOM-001-workflow-authority-and-governance.md` — DOM-INGEST-001, DOM-SNAPSHOT-001, DOM-ELIG-001.
- Gap Matrix: `docs/specs/gap-matrices/SPEC-DOM-001-implementation-gap-matrix.md` — GAP-002, GAP-003, GAP-004.
- Gap Matrix Audit: `docs/specs/gap-matrices/audits/SPEC-DOM-001-implementation-gap-matrix-audit.md`.
- Implementation Plan: `docs/specs/implementation-plans/SPEC-DOM-001-implementation-plan.md` — DOM-IMP-02.
- Plan Audit: `docs/specs/implementation-plans/audits/SPEC-DOM-001-implementation-plan-audit.md`.

## 3. Authority / Scope

Approved owner: DOM `CANONICAL_OWNER`. Primary owning specification/domain: `SPEC-DOM-001`. Local ownership covers explicit entry, eligibility, snapshot identity, frozen hashes/base/configuration/version semantics, and drift rejection. Foreign capabilities consumed: exact version metadata from EXEC-001 and physical persistence/recovery from PLAT-001, both non-blocking.

## 4. Portfolio Obligation Coverage

`O-002` manual entry; `O-003` immutable execution snapshot; `O-004` accepted-only ADR eligibility.

## 5. Gap / Requirement / Acceptance Coverage

Gaps: `GAP-002`, `GAP-003`, `GAP-004`. Requirements: `DOM-INGEST-001`, `DOM-SNAPSHOT-001`, `DOM-ELIG-001`. Local acceptance: `AC-DOM-002`, `AC-DOM-003`, `AC-DOM-004`. Integrated contribution: `AC-DOM-052`; final proof owner is TICKET-012.

## 6. Implementation Unit

`DOM-IMP-02 — Manual entry, snapshot, and eligibility boundary`. Formation reason: `SHARED_PERSISTENCE_BOUNDARY`. No split siblings; no merge.

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

`prototype/src/mockDomain.ts:31, :749-758, :938-940`; snapshot and eligibility tests. Replace in-memory authority; extend negative-path cases as productive tests.

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

## 15. Implementation Constraints

Manual entry is required; non-`ACCEPTED` or ineligible revisions fail closed; locked snapshots cannot be overwritten; exact metadata and hashes remain historical and drift-sensitive.

## 16. Acceptance Criteria

- [ ] Automatic discovery, absent SPEC, and session state cannot initiate work.
- [ ] Snapshot creation and lock preserve hashes/base/configuration/versions and reject mutation or drift.
- [ ] Ineligible ADRs are rejected with no transition or fallback.
- [ ] `LOCAL_PROVABILITY = YES` using TICKET-001 and boundary fixtures.

All criteria are `TESTABLE: YES` and `LOCALLY_PROVABLE: YES` after the internal prerequisite.

## 17. Acceptance / Proof Role

`CONTRIBUTOR: YES` to AC-DOM-052. `LOCAL_ACCEPTANCE_OWNER: YES` and `FINAL_PROOF_OWNER: YES` for AC-DOM-002, AC-DOM-003, and AC-DOM-004. Not final owner of AC-DOM-052.

## 18. Required Tests

Unit, domain-invariant, stale-protection, compatibility, and regression tests for manual-only initiation, each eligibility state, snapshot lock, hash/base/configuration/version drift, and no-fallback rejection.

## 19. Completion Evidence

Productive boundary; immutable snapshot evidence; fail-closed rejection tests; and explicit metadata mapping contract.

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

`NEW_CANONICAL_PATH` plus `PRESERVE_LEGACY_READS` where a later adapter exposes historical snapshots. No legacy writer retirement.

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
