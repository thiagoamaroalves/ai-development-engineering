# DOM-001-TICKET-002 — Implementation Remediation

## 1. Remediation Verdict

```text
TICKET_IMPLEMENTATION_REMEDIATION_BLOCKED
TICKET_GATE: BLOCKED
```

The three canonical MAJOR findings were revalidated directly against the
current implementation. Complete correction is blocked because the approved
authoritative ADR lifecycle/revision reader and the approved independent
current-authority observation seam are not present in the productive
repository. T002 cannot create either authority locally without violating
ownership, the approved design boundary, and the explicit remediation
constraints.

No production or test correction was retained. This artifact is the current
remediation evidence; the archived artifact was consulted only historically.

## 2. Ticket

| Field | Value |
|---|---|
| Ticket | `DOM-001-TICKET-002` |
| Implementation Unit | `DOM-IMP-02 — Manual entry, snapshot, and eligibility boundary` |
| Ticket path | `docs/tickets/SPEC-DOM-001/DOM-001-TICKET-002-manual-entry-snapshot-eligibility.md` |
| Approved design | `docs/tickets/SPEC-DOM-001/DOM-001-TICKET-002-implementation-design.md` |
| Canonical audit | `docs/tickets/SPEC-DOM-001/DOM-001-TICKET-002-implementation-audit.md` |
| Audit round | `RE_AUDIT` |
| Initial status | `VALIDATION_REQUIRED` |
| Final remediation status | `VALIDATION_REQUIRED` — unchanged; remediation blocked |

The ticket was not marked `DONE` and no independent conformance was
self-certified.

## 3. Baseline Validation

```text
AUDIT_HEAD: a58ce959f9b34f3c1c83ed41c01b058d31bf3366
REMEDIATION_START_HEAD: a58ce959f9b34f3c1c83ed41c01b058d31bf3366
CURRENT_HEAD: a58ce959f9b34f3c1c83ed41c01b058d31bf3366
BASELINE_DRIFT: NO_RELEVANT_DRIFT
IMPLEMENTATION_WORKTREE_DRIFT: NONE_IN_TICKET_IMPLEMENTATION
```

The repository already contained unrelated and other-ticket worktree changes;
they were preserved and not attributed to T002. The audited T002
implementation and tests were unchanged before this remediation run.

## 4. Canonical Findings Received

The canonical audit is the only defect authority. No parallel backlog was
created from specialist findings.

```text
CANONICAL_FINDINGS_RECEIVED: 3
BLOCKING_FINDINGS_RECEIVED: 3
```

- `IMA-MAJOR-001` — Snapshot eligibility trusts caller-supplied lifecycle and revision claims.
- `IMA-MAJOR-002` — Snapshot lock confirmation self-compares instead of revalidating the current authority basis.
- `IMA-MAJOR-003` — Required negative-path and state-preservation evidence is incomplete.

All three findings remain current and are classified `VALIDATED_AND_STILL_PRESENT`.

## 5. Root Cause Analysis

| Root Cause | Canonical Findings | Affected Radius | Result |
|---|---|---|---|
| `RC-001` — No productive seam exposes authoritative ADR decision lifecycle and revision eligibility to T002 | `IMA-MAJOR-001` | `src/application/snapshot.ts`, `src/domain/snapshot.ts`, the identity/lifecycle boundary, and T002 eligibility tests | Open; correction requires the approved authoritative owner/read contract |
| `RC-002` — The handler has no independently obtained current authority basis between reservation and confirmation | `IMA-MAJOR-002` | `src/application/snapshot.ts`, `ExecutionSnapshot.confirm`, repository confirmation fixture, and lock/drift tests | Open; correction requires an approved current-authority observation seam |
| `RC-003` — The productive failure/state matrix is incomplete | `IMA-MAJOR-003` | `tests/dom-001-ticket-002.test.ts` and the locally applicable domain/application/repository boundaries | Open; required proof depends on the unresolved authority and lock seams |

`RC-001` and `RC-002` are systemic root causes. `RC-003` is an evidence
root cause. No independent new defect was added to scope.

## 6. Affected Radius

The full T002-scoped radius was inspected:

| Area | Finding-driven manifestation | Classification |
|---|---|---|
| `src/application/snapshot.ts` | Caller `decisionStatus` is copied into the snapshot; `draft.confirm(draft)` makes lock comparison tautological | Canonical findings / same root causes |
| `src/domain/snapshot.ts` | Eligibility policy has the accepted-only predicate, but no authoritative lifecycle/revision input; aggregate comparison itself can reject a distinct basis | Canonical findings / existing valid owner |
| `src/domain/identity.ts` | `CanonicalIdentityCatalog.resolve` proves identity/reference existence only; design marks this file `MUST_NOT_MODIFY` | Missing upstream authority; outside valid T002 correction |
| `tests/dom-001-ticket-002.test.ts` | Five tests cover selected happy/negative paths but omit the required complete matrix | Canonical evidence finding |
| `ExecutionSnapshotRepository` and its in-memory test double | Persistence outcomes exist; repository is not an authority owner | Existing persistence enforcement; must remain persistence-only |
| T003 lifecycle/revision implementation | No productive lifecycle/revision reader is present; T003 remains `STATUS: BLOCKED` | Unavailable upstream authority |
| `prototype/**` | Contains mock behavior only | Outside T002 productive remediation scope; untouched |

No additional same-root manifestation was safely fixable without first
obtaining the missing authority contracts. No independent new defect was
silently added.

## 7. Remediation Units

| Unit | Root Cause | Findings | Intended correction | Required tests | Result |
|---|---|---|---|---|---|
| `RU-001` | `RC-001` | `IMA-MAJOR-001` | Consume the authoritative ADR lifecycle/revision eligibility result at the submission boundary and map it into the existing domain policy; remove caller status as authority | Accepted/ineligible/unknown/revision-mismatch tests with no reservation | `BLOCKED` — approved productive authority reader unavailable |
| `RU-002` | `RC-002` | `IMA-MAJOR-002` | Obtain a distinct current authority basis after reservation and pass it to `ExecutionSnapshot.confirm`; preserve repository CAS/durable enforcement only | Hash, base, configuration, exact-version, eligibility, and handler-time drift tests with no mutation | `BLOCKED` — approved current-authority observation seam unavailable |
| `RU-003` | `RC-003` | `IMA-MAJOR-003` | Add the minimum productive negative/state-preservation matrix once RU-001 and RU-002 contracts exist | Duplicate, confirmed-lock, stale/not-found, malformed rehydration, full drift, and stored-state preservation tests | `BLOCKED` — complete proof cannot be validly wired without RU-001/RU-002 |

Ordering is `RU-001` and `RU-002` foundational authority seams, followed by
`RU-003` evidence. No unit was partially applied.

## 8. Finding Closure

| Finding | Root Cause | Remediation Unit | Closure | Evidence |
|---|---|---|---|---|
| `IMA-MAJOR-001` | `RC-001` | `RU-001` | `BLOCKED` | Current code still accepts `decisionStatus` in `SubmitManualExecutionCommand`; `CanonicalIdentityCatalog.resolve` exposes no lifecycle/revision eligibility. Adding local state would create an alternate authority. |
| `IMA-MAJOR-002` | `RC-002` | `RU-002` | `BLOCKED` | Current code still calls `draft.confirm(draft)`. The aggregate comparator is valid for a distinct basis, but no approved current-basis reader exists for the handler. |
| `IMA-MAJOR-003` | `RC-003` | `RU-003` | `BLOCKED` | Current T002 tests remain the five baseline tests and do not prove the required full matrix. Adding tests that depend on invented authority seams would not be valid closure evidence. |

```text
FINDINGS_REMEDIATED: 0
FINDINGS_ALREADY_RESOLVED: 0
FINDINGS_REJECTED_BY_NEW_EVIDENCE: 0
FINDINGS_PARTIALLY_REMEDIATED: 0
FINDINGS_BLOCKED: 3
```

## 9. Root Cause Closure

| Root Cause | Removed | Radius Checked | Known Manifestations Closed | Systemic Test Evidence |
|---|---|---|---|---|
| `RC-001` | `NO` | `YES` | `NO` | `MISSING` — no authoritative lifecycle/revision reader is available |
| `RC-002` | `NO` | `YES` | `NO` | `MISSING` — no approved independent current-basis observation seam is available |
| `RC-003` | `NO` | `YES` | `NO` | `MISSING` — the required productive matrix was not added because its authority dependencies are unresolved |

No blocking root cause is claimed closed.

## 10. Acceptance Revalidation

| Acceptance criterion | Result | Evidence |
|---|---|---|
| `AC-DOM-002` — explicit manual entry only | `SATISFIED` on unchanged baseline | Discovery-only/wrong-endpoint rejection and no repository-call evidence remain passing. |
| `AC-DOM-003` — exact snapshot lock and drift rejection | `BLOCKED` | Aggregate direct base-drift rejection exists, but productive handler-time current-authority comparison and full drift/state-preservation proof are absent. |
| `AC-DOM-004` — ineligible ADRs fail closed without fallback | `BLOCKED` | Caller labels are rejected, but canonical lifecycle/revision eligibility is not sourced from the authoritative boundary. |
| `LOCAL_PROVABILITY = YES` | `BLOCKED` | Local baseline tests pass, but the canonical authority and complete lock evidence required for local closure are unavailable. |

```text
ACCEPTANCE_CRITERIA_AFFECTED: 4
ACCEPTANCE_CRITERIA_SATISFIED: 1
ACCEPTANCE_CRITERIA_NOT_SATISFIED: 0
ACCEPTANCE_CRITERIA_BLOCKED: 3
```

## 11. Files Changed

| File | Classification | Change |
|---|---|---|
| `docs/tickets/SPEC-DOM-001/DOM-001-TICKET-002-implementation-remediation.md` | `TICKET_EVIDENCE` | Created as the current remediation artifact. |

```text
CHANGED_PRODUCTION_FILES: 0
CHANGED_TEST_FILES: 0
UPSTREAM_AUTHORITY_FILES_CHANGED: 0
UNRELATED_CHANGES: 0
```

The pre-existing worktree changes were preserved. No ADR, portfolio, SPEC,
Gap Matrix, Implementation Plan, ticket, T001 identity implementation, T003
artifact, prototype, or repository implementation was modified.

## 12. Tests

All requested baseline and relevant-suite checks completed. Because no code or
tests were changed, these are baseline proofs and do not close the canonical
findings.

| Command | Result |
|---|---|
| `prototype/node_modules/.bin/tsx.cmd --test tests/dom-001-ticket-002.test.ts` | `5 passed, 0 failed` |
| `prototype/node_modules/.bin/tsx.cmd --test tests/dom-001-ticket-001.test.ts tests/dom-001-ticket-004.test.ts` | `22 passed, 0 failed` |
| `prototype/node_modules/.bin/tsx.cmd --test tests/*.test.ts` | `27 passed, 0 failed` |
| `npm test` from `prototype` | `92 passed, 0 failed` |
| `npm run lint` from `prototype` | exit `0` |
| `npm run build` from `prototype` | exit `0`; Vite build completed |

```text
TEST_COMMANDS_RUN: 4
TEST_CASE_EXECUTIONS_REPORTED: 146 (overlapping suites)
TESTS_PASSED: 146
TESTS_FAILED: 0
TESTS_SKIPPED: 0
ENVIRONMENTAL_FAILURES: 0
NON-TEST_CHECKS_PASSED: lint, build
```

## 13. Regression Self-Check

```text
KNOWN_REMEDIATION_REGRESSIONS: 0
POSSIBLE_REMEDIATION_REGRESSIONS: 0
RESULT: NO_REMEDIATION_REGRESSION
```

No production/test behavior changed. The three canonical defects are
pre-existing and are not remediation regressions.

## 14. Ownership / Authority

```text
OWNERSHIP_ERRORS: 0
FOREIGN_CAPABILITY_DUPLICATION: 0
NEW_ALTERNATE_AUTHORITY: 0
IDENTITY_DRIFT: 0
LEGACY_DUAL_WRITER: 0
```

The repository remains responsible only for durable snapshot persistence and
enforcement outcomes. T002 did not create ADR lifecycle/revision state, did
not use caller labels as a newly asserted authority, and did not move
lifecycle ownership from the approved boundary.

## 15. Completion Evidence

| Required evidence | Result |
|---|---|
| Productive manual/snapshot boundary | Present on baseline; not sufficient to close all findings |
| Authoritative ADR lifecycle/revision eligibility read | Missing; required upstream boundary is unavailable |
| Independent current-authority observation before lock | Missing; required approved seam is unavailable |
| Immutable aggregate and direct drift guard | Present on baseline; productive handler proof remains missing |
| Complete productive negative/state-preservation matrix | Missing |
| Explicit EXEC exact-version mapping seam | Present on baseline |
| PLAT persistence port without semantic rule ownership | Present on baseline |

```text
COMPLETION_EVIDENCE_REQUIRED: 7
COMPLETION_EVIDENCE_PRESENT: 3
COMPLETION_EVIDENCE_MISSING: 3
```

## 16. Remaining Blockers

```text
TICKET_IMPLEMENTATION_REMEDIATION_BLOCKED
reason = UPSTREAM_SCOPE_OR_AUTHORITY_REQUIRED
```

Exact blocker: the productive repository contains no approved authoritative
ADR lifecycle/revision eligibility reader and no approved independent
current-authority observation seam between reservation and snapshot
confirmation. `CanonicalIdentityCatalog` only resolves identity/reference
existence; T003 is still `STATUS: BLOCKED`; the approved T002 design marks the
identity implementation as `MUST_NOT_MODIFY`; and the repository is explicitly
not the semantic authority. Creating a local reader/store, accepting a caller
status/basis, or making the repository authoritative would be an unauthorized
architecture/ownership change.

Required upstream action: provide the approved authoritative lifecycle/revision
read contract and approved current-authority observation seam, then revalidate
the T002 implementation design/contract boundary before applying RU-001 through
RU-003. No authority is invented in this remediation.

## 17. Pre-Reaudit Self-Check

```text
ALL_BLOCKING_FINDINGS_CLOSED: NO
ALL_ROOT_CAUSES_CLOSED: NO
AFFECTED_RADIUS_CHECKED: YES
REQUIRED_TESTS_PASS: BASELINE_ONLY
AFFECTED_ACCEPTANCE_CRITERIA_PASS: NO
NO_KNOWN_MATERIAL_REGRESSION: YES
OWNERSHIP_PRESERVED: YES
NO_UNAUTHORIZED_SCOPE_EXPANSION: YES
COMPLETION_EVIDENCE_COMPLETE: NO
STATUS_READY_FOR_VALIDATION: NO
```

The self-check correctly prevents a re-audit-ready claim because all blocking
findings and root causes remain open.

## 18. Remediation Gate

```text
TICKET_IMPLEMENTATION_REMEDIATION_BLOCKED
TICKET_GATE: BLOCKED
```

The ticket remains `VALIDATION_REQUIRED`, but it is not ready for an
independent re-audit after remediation. It was not marked `DONE`.

## 19. Remediation Metrics

```text
AUDIT_ROUND: RE_AUDIT
CANONICAL_FINDINGS_RECEIVED: 3
BLOCKING_FINDINGS_RECEIVED: 3
FINDINGS_REMEDIATED: 0
FINDINGS_ALREADY_RESOLVED: 0
FINDINGS_REJECTED_BY_NEW_EVIDENCE: 0
FINDINGS_PARTIALLY_REMEDIATED: 0
FINDINGS_BLOCKED: 3

ROOT_CAUSES_IDENTIFIED: 3
ROOT_CAUSES_CLOSED: 0
SYSTEMIC_ROOT_CAUSES: 2

REMEDIATION_UNITS: 3
ADDITIONAL_SAME_ROOT_MANIFESTATIONS_FIXED: 0

CHANGED_PRODUCTION_FILES: 0
CHANGED_TEST_FILES: 0
TESTS_RUN: 4 commands / 146 overlapping case executions
TESTS_PASSED: 146
TESTS_FAILED: 0

KNOWN_REMEDIATION_REGRESSIONS: 0
OWNERSHIP_ERRORS: 0
FOREIGN_CAPABILITY_DUPLICATION: 0
COMPLETION_EVIDENCE_MISSING: 3
```

## 20. Final Status and Next Action

```text
FINAL_STATUS: VALIDATION_REQUIRED
REMEDIATION_VERDICT: TICKET_IMPLEMENTATION_REMEDIATION_BLOCKED
TICKET_GATE: BLOCKED
NEXT_ACTION: PROVIDE_APPROVED_UPSTREAM_AUTHORITY_AND_REVALIDATE_T002_BOUNDARY
```

This remediation cannot proceed until the exact upstream authority blocker is
resolved. After that prerequisite and any required design/contract
revalidation, rerun this remediation workflow; a successful future run must
end in `VALIDATION_REQUIRED` with `TICKET_GATE: READY_FOR_REAUDIT`, never
`DONE`.
