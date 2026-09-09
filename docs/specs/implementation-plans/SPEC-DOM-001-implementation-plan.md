# SPEC-DOM-001 — Implementation Plan

Status: PROPOSED  
Planning source: validated component Implementation Gap Matrix

Remediation status: `COMPONENT_IMPLEMENTATION_PLAN_REMEDIATION_COMPLETE`  
Next gate: `READY_FOR_INDEPENDENT_IMPLEMENTATION_PLAN_REAUDIT`

## 1. Status

This plan is ready for independent implementation-plan audit. It converts the
validated DOM implementation delta into dependency-ordered implementation
units. It does not approve implementation, create tickets, or change any
authority artifact.

## 2. Planning Authority

Authority is applied in this order:

```text
accepted ADRs > approved portfolio decomposition > conformant component SPEC
> conformant upstream SPECs > validated Gap Matrix > repository implementation
> tests > prototype/historical evidence
```

Portfolio: `SPEC-PORTFOLIO-001`, revision 2  
Portfolio audit: `docs/specs/SPEC-PORTFOLIO-001-decomposition-audit.md`  
Component SPEC: `docs/specs/SPEC-DOM-001-workflow-authority-and-governance.md`, revision 2  
Component SPEC audit: `docs/specs/audits/SPEC-DOM-001-component-conformance-audit.md`  
Validated Gap Matrix: `docs/specs/gap-matrices/SPEC-DOM-001-implementation-gap-matrix.md`  
Gap Matrix audit: `docs/specs/gap-matrices/audits/SPEC-DOM-001-implementation-gap-matrix-audit.md`  
Repository baseline: `5318663b03b9d873261475dbd97702d77d2d3efc`  
Current HEAD: `8c01d34cdf58881ec1f87d885e23a6ec167f3cb1`  
Baseline drift: `NON_SEMANTIC_DOCUMENTARY_DRIFT`

The portfolio audit is `PORTFOLIO_DECOMPOSITION_APPROVED`; the component
audit is `PASS — COMPONENT_SPEC_CONFORMANT`; and the independent Gap Matrix
audit is `GAP_MATRIX_CONFORMANT` with `READY_FOR_IMPLEMENTATION_PLAN`.

This plan does not redefine ADR, portfolio, SPEC, or Gap Matrix authority.

## 3. Frozen Baselines

| Artifact | Revision / digest |
|---|---|
| Portfolio | revision 2; SHA-256 `c449388972279d8add520564a9614cfa236f87b6c8932a70d5bc2d28eef6be86` |
| Portfolio audit | SHA-256 `120f22d0080ac0640ebbdad7c460df5de2745788cfaea83a1859f2c577168104` |
| Component SPEC | revision 2; SHA-256 `768937f1454fb63becd955780212468dbf4f2887a41eeebaad9a18d362716d98` |
| Component SPEC audit | SHA-256 `12dc0461b57cf8074b1215c9147d480558bf738773b6c00a5da4700dc58a5414` |
| Gap Matrix | SHA-256 `e1bbbeaf31cb61d45befc428d79816175bd2aeb7c9faebed5be697234bdd7fed` |
| Gap Matrix audit | current SHA-256 `e98c03ace6c2fb4b03d2b90b3c86787c93f0d5bb2e444508cd555ee7d54d49a3` |
| Repository | matrix baseline `5318663…`; current `8c01d34…` |

Working tree state at planning: `main...origin/main [ahead 4]`; untracked
`.codex/` skill files and downstream/support SPEC artifacts are preserved and
are outside the DOM implementation baseline.

## 4. Baseline Drift Assessment

`AUTHORITY_DRIFT = NONE`. Accepted ADR content, portfolio ownership and
dependencies, DOM SPEC semantics, failure ownership, and compatibility/cutover
ownership match the validated baseline.

`IMPLEMENTATION_DRIFT = NONE`. The repository still contains no productive DOM
runtime, durable domain store, service boundary, or productive test suite.
HEAD changes since the matrix baseline are documentation-only downstream or
support artifacts. All `GAP-001` through `GAP-021` therefore have status
`UNCHANGED`; the Gap Matrix is not regenerated or mutated.

## 5. Validated Gap Intake

All 21 active gaps are `MISSING`, `MAJOR`, owned by `SPEC-DOM-001`, and trace
one-to-one to the following requirements and obligations:

| Gap IDs | Requirements | Obligations | Validated local delta |
|---|---|---|---|
| GAP-001–005 | DOM-ID-001, DOM-INGEST-001, DOM-SNAPSHOT-001, DOM-ELIG-001, DOM-LINEAGE-001 | O-001–O-005 | Productive identity, manual-entry, snapshot, eligibility, and lineage authority is absent; only prototype state exists. |
| GAP-006–008 | DOM-LIFE-001, DOM-REV-001, DOM-IMMUT-001 | O-006–O-008 | Productive lifecycle separation, revision cutover, immutability, and reciprocal succession are absent. |
| GAP-009–011 | DOM-PIPE-001, DOM-STATE-001, DOM-CMD-001 | O-009–O-011 | Productive pipeline/state-machine authority and command rejection/no-transition semantics are absent. |
| GAP-012–015 | DOM-TICKET-001, DOM-TICKET-002, DOM-PUB-001, DOM-ADV-001 | O-012–O-015 | Productive ticket, publication vocabulary, verdict-gate, pause, and cancellation authority is absent. |
| GAP-016–018 | DOM-AUDIT-001, DOM-AUDIT-002, DOM-AUDIT-003 | O-049–O-051 | Productive artifact-cycle identity, structured verdict closure, round limit, and continuation authorization are absent. |
| GAP-019–021 | DOM-AUDIT-004, DOM-AUDIT-005, DOM-AUDIT-006 | O-052–O-054 | Productive final conformance, normative-change invalidation, and exact evidence/drift gate are absent. |

The four mixed boundary gaps retain their local DOM work and foreign scope:
`GAP-003` consumes EXEC version metadata and PLAT persistence/recovery;
`GAP-008` exposes semantic succession/evidence identity to PLAT and OPS;
`GAP-011` exposes command outcomes to PLAT/BACKEND/UI; and `GAP-021` accepts
GIT evidence while PLAT/OPS preserve it. No foreign lifecycle is planned
locally.

## 6. Planning Ownership Classification

| Planning type | Gaps | Treatment |
|---|---|---|
| `LOCAL_IMPLEMENTATION_WORK` | GAP-001, 002, 004–007, 009, 010, 012–020 | Implement DOM-owned canonical behavior. |
| `INTEGRATION_OR_CONVERGENCE_WORK` | GAP-003, 008, 011, 021 | Implement DOM-owned boundary and mapping behavior; consume foreign outcomes without redefining them. |
| `CROSS_SPEC_DEPENDENCY` | None as a pure gap | Foreign contracts are explicit prerequisites/references, not local lifecycle work. |
| `PREEXISTING_FOREIGN_CAPABILITY` | None | No productive foreign capability exists to reuse as a completed implementation. |
| `TEST_OR_CONFORMANCE_WORK` | None as a primary gap type | Tests are closure evidence for the behavior units; no artificial evidence-only unit is created. |
| `NO_LOCAL_WORK` | None | Every validated gap has local DOM work. |

## 7. Repository Planning Evidence

The only implementation-shaped surface is the disposable prototype:

| Evidence | Planning interpretation |
|---|---|
| `prototype/src/mockDomain.ts:1-124` | Mock types model identities, snapshots, tickets, activities, publication, events, and recovery-shaped records; reusable vocabulary only. |
| `prototype/src/mockDomain.ts:749-758`, `:826-940` | Mock eligibility, transitions, commands, and scenario advancement are behavior references, not productive seams. |
| `prototype/src/App.tsx:52-75` | UI renders and requests mock state; it is not canonical authority. |
| `prototype/tests/mockDomain.test.ts`, `prototype/tests/ui.test.ts` | 92 passing prototype tests identify needed positive/negative assertions; they must not be promoted to productive proof. |
| `prototype/fresh-adversarial-probe.ts` | Independent mock probe vocabulary; not implementation evidence. |
| `prototype/README.md:24-39` | Explicitly states Git, GitHub, Codex CLI, database, email, and backend are in-memory simulations. |
| `prototype/package.json` | Available prototype commands are `npm test`, `npm run lint`, and `npm run build`; no productive application command exists. |

No productive domain, persistence, API, adapter, migration, or integration
surface was found. Expected file/module impact below is consequently guidance
for later design and implementation, not frozen internal architecture.

## 8. Reuse Assessment

| Scope | Assessment |
|---|---|
| Prototype identity, snapshot, lifecycle, state, command, audit, and publication helpers | `REUSE_AND_EXTEND` only for vocabulary and scenario-derived test cases; replace as productive authority. |
| Prototype centralized `mockDomain.ts` state | `REPLACE_CONTRADICTORY_PATH` is not applicable because it is non-productive; do not extend it into production authority. |
| Prototype UI and reports | `REUSE_UNCHANGED` as disposable exploratory evidence only; no productive DOM writes. |
| Productive persistence/journal/outbox/recovery | `ADD_INTEGRATION_SEAM` to PLAT-owned contracts; DOM does not implement physical persistence. |
| Productive publication execution/evidence | `ADD_INTEGRATION_SEAM` to GIT-owned execution/evidence; DOM owns vocabulary and gate semantics only. |
| Legacy adapter and operational/UI projections | `ADD_INTEGRATION_SEAM`; REPO/BACKEND/OPS/UI retain their approved roles. |

## 9. Implementation Units

## DOM-IMP-01 — Canonical identity and lineage authority

### Goal

Provide productive, persistent-resolution semantics for DOM aggregate identities
and explicit independent ADR↔SPEC lineage.

### Authority and Ownership

Primary component SPEC: DOM-ID-001 and DOM-LINEAGE-001. Portfolio obligations:
O-001, O-005. Approved ownership role: DOM `CANONICAL_OWNER`. Local ownership
includes identity creation, uniqueness, scope, revision/lineage, historical
resolution, and lineage independence. Foreign execution, assignment/session,
persistence, projection, and transport identities remain distinct.

### Gap Matrix Coverage

`GAP-001` / `DOM-ID-001`; `GAP-005` / `DOM-LINEAGE-001`. Acceptance: AC-DOM-001,
AC-DOM-005.

### Portfolio Obligation Coverage

`O-001`, `O-005`.

### Validated Delta

OBSERVED: only in-memory IDs and relationship arrays exist in the prototype.  
REQUIRED: stable, resolvable, immutable canonical identities and explicit
many-to-many lineage.  
DELTA: no productive identity or lineage authority exists.

### Required Behavior

LOCAL_BEHAVIOR: create and resolve canonical identities; reject unresolved or
invalid-revision references; preserve identity distinctions and independent
ADR/SPEC progress. END_TO_END_CONTRIBUTION: downstream consumers can correlate
records without creating a second identity authority.

### Does Not Implement

Foreign persistence mechanics, assignment/session lifecycle, effect/publication
execution, backend/API authorization, UI/OPS projections, or downstream final
conformance.

### Repository Evidence

Use the prototype catalog and tests as vocabulary/test-case evidence only:
`prototype/src/mockDomain.ts:30-43, :700-744` and the identity/lineage tests.
`REPLACE` mock authority with a productive boundary; `EXTEND` test coverage.

### Expected Repository Impact

Likely domain identity/lineage model, canonical command/query boundary, and
productive unit tests. Expected Repository Impact is planning guidance, not
normative design authority.

### Implementation Constraints

Preserve canonical identity, scope, immutability, historical resolution,
AgentId/assignment/session distinction, ExternalEffectId/PublicationId
distinction, and many-to-many lineage independence.

### Internal Prerequisites

None.

### Cross-Spec Prerequisites

None; consumer correlation is a later integration concern and is non-blocking.

### Acceptance Criteria

1. Productive tests prove creation, uniqueness, immutability, scope, lineage,
   historical resolution, and invalid-reference rejection.
2. Independent ADR↔SPEC relationships can progress without mutating another
   relationship.
3. `LOCAL_PROVABILITY = YES`; no downstream behavior is required.

### Local Closure

`LOCAL_CLOSURE = YES`. Identity/lineage tests and completion evidence are
executable at this unit's closure point.

### Required Tests

Unit and domain-invariant tests for identity uniqueness, immutable revision,
historical lookup, invalid references, many-to-many lineage, and independent
progress; regression cases derived from prototype identity tests.

### Legacy / Cutover Impact

`NEW_CANONICAL_PATH`; historical identity resolution is preserved. No legacy
write retirement is owned here.

### Completion Evidence

Productive identity/lineage code path, executable positive/negative tests,
immutable historical lookup evidence, and no duplicate consumer authority.

### Risks

Identity collapse with assignment/session or presentation IDs; mitigated by
explicit distinction tests and boundary review.

### Issue Decomposition Readiness

`ISSUE_READY`; `VALIDATED_GAP_BACKING = YES`; `UNIT_FORMATION_REASON =
SHARED_AUTHORITY`; `INDEPENDENT_CLOSURE = YES`.

### Initial DAG State

`READY`.

## DOM-IMP-02 — Manual entry, snapshot, and eligibility boundary

### Goal

Make manual submission the only processing trigger and produce an immutable,
fail-closed pre-execution authority snapshot.

### Authority and Ownership

Primary component SPEC: DOM-INGEST-001, DOM-SNAPSHOT-001, DOM-ELIG-001.
Portfolio obligations: O-002–O-004. Approved ownership role: DOM
`CANONICAL_OWNER`. DOM owns entry, eligibility, snapshot identity, frozen
hash/base/configuration/version semantics, and drift rejection.

### Gap Matrix Coverage

`GAP-002`, `GAP-003`, `GAP-004`; requirements DOM-INGEST-001,
DOM-SNAPSHOT-001, DOM-ELIG-001; acceptance AC-DOM-002–004.

### Portfolio Obligation Coverage

`O-002`, `O-003`, `O-004`.

### Validated Delta

OBSERVED: buttons, mock snapshots, and in-memory eligibility helpers simulate
the flow. REQUIRED: explicit manual trigger, immutable exact snapshot, and
accepted-only eligibility. DELTA: no productive gate exists.

### Required Behavior

LOCAL_BEHAVIOR: accept an explicit manual submission; evaluate only ACCEPTED,
eligible revisions; freeze ADR hashes, base, configuration, and exact version
metadata; reject later authority drift without fallback. END_TO_END_CONTRIBUTION:
provides the authority basis consumed by execution and persistence owners.

### Does Not Implement

EXEC version capability semantics, PLAT physical persistence/recovery, file
discovery, scheduler/session lifecycle, backend/UI transport, or downstream
execution.

### Repository Evidence

`prototype/src/mockDomain.ts:31, :749-758, :938-940` and snapshot/eligibility
tests. `REPLACE` in-memory authority; `EXTEND` negative-path test cases.

### Expected Repository Impact

Domain submission/snapshot/eligibility boundary and tests; optional consumer
mapping seam for exact metadata. Expected Repository Impact is planning
guidance, not normative design authority.

### Implementation Constraints

Manual entry is required; non-ACCEPTED or inelegible revisions fail closed;
locked snapshots cannot be overwritten; exact metadata and hashes remain
historical and drift-sensitive.

### Internal Prerequisites

`DOM-IMP-01`.

### Cross-Spec Prerequisites

| Owner SPEC | Required capability | Implementation state | Blocking? |
|---|---|---|---|
| SPEC-EXEC-001 | Exact version/contract metadata reference | Downstream consumer contract; productive implementation not present | No; DOM accepts explicit metadata boundary |
| SPEC-PLAT-001 | Physical snapshot persistence/recovery | Downstream owner; implementation not present | No; not local DOM closure |

### Acceptance Criteria

1. Automatic discovery, absent SPEC, and session state cannot initiate work.
2. Snapshot creation and lock preserve hashes/base/configuration/versions and
   reject mutation or drift.
3. Ineligible ADRs are rejected with no transition or fallback.
4. All criteria are locally provable using IMP-01 and boundary fixtures;
   `LOCAL_PROVABILITY = YES`.

### Local Closure

`LOCAL_CLOSURE = YES`; the foreign physical persistence and recovery proof is
not copied into local ACs.

### Required Tests

Unit, domain-invariant, stale-protection, compatibility, and regression tests
for manual-only initiation, each eligibility state, snapshot lock, hash/base/
configuration/version drift, and no-fallback rejection.

### Legacy / Cutover Impact

`NEW_CANONICAL_PATH` plus `PRESERVE_LEGACY_READS` where an adapter later
exposes historical snapshots. No legacy writer is retired here.

### Completion Evidence

Productive boundary, immutable snapshot evidence, fail-closed rejection tests,
and explicit metadata mapping contract.

### Risks

Snapshot mutation or accidental automatic trigger; mitigated by immutable
tests and negative trigger tests.

### Issue Decomposition Readiness

`ISSUE_READY`; `VALIDATED_GAP_BACKING = YES`; `UNIT_FORMATION_REASON =
SHARED_PERSISTENCE_BOUNDARY`; `INDEPENDENT_CLOSURE = YES`.

### Initial DAG State

`BLOCKED`; `BLOCKED_BY = DOM-IMP-01`.

## DOM-IMP-03 — Lifecycle revision and ADR succession

### Goal

Implement separate decision/realization lifecycles and revision/immutability
rules for remediation and implemented ADR succession.

### Authority and Ownership

Primary component SPEC: DOM-LIFE-001, DOM-REV-001, DOM-IMMUT-001. Obligations:
O-006–O-008. DOM owns lifecycle separation, revision, reciprocal succession,
and semantic historical linkage.

### Gap Matrix Coverage

`GAP-006`, `GAP-007`, `GAP-008`; requirements DOM-LIFE-001, DOM-REV-001,
DOM-IMMUT-001; acceptance AC-DOM-006–008.

### Portfolio Obligation Coverage

`O-006`, `O-007`, `O-008`.

### Validated Delta

OBSERVED: prototype statuses and reversible mutation scenarios only. REQUIRED:
independent lifecycles, new revision on remediation, immutable implemented ADR,
and reciprocal successor relation. DELTA: no productive authority transition.

### Required Behavior

LOCAL_BEHAVIOR: prevent cross-lifecycle mutation; create successor revision on
normative remediation; invalidate prior derived eligibility; reject silent
rewrite/reprocessing of implemented ADRs. END_TO_END_CONTRIBUTION: supplies
stable history for downstream plans, evidence, and projections.

### Does Not Implement

PLAT evidence persistence, OPS projection, repository migration, foreign
compatibility retirement, or downstream invalidation registry (IMP-10 owns
that DOM behavior).

### Repository Evidence

`prototype/src/mockDomain.ts:27-40, :737, :927` and ADR mutation/hash tests.
`REPLACE` reversible mock authority; `EXTEND` negative and successor tests.

### Expected Repository Impact

Domain lifecycle/revision records and command/event/query tests. Expected
Repository Impact is planning guidance, not normative design authority.

### Implementation Constraints

Preserve historical lineage, reciprocal succession, immutable implemented
records, eligibility invalidation, and separate decision versus realization
state.

### Internal Prerequisites

`DOM-IMP-01`, `DOM-IMP-02`.

### Cross-Spec Prerequisites

| Owner SPEC | Required capability | Implementation state | Blocking? |
|---|---|---|---|
| SPEC-PLAT-001 | Durable operational evidence reference | Foreign/downstream owner; not present | No; semantic record closes locally |
| SPEC-OPS-001 | Historical evidence projection | Foreign/downstream owner; not present | No |

### Acceptance Criteria

1. Decision and realization lifecycle transitions can be exercised separately.
2. Remediation creates a new revision and preserves history.
3. Implemented ADR mutation is rejected and succession is reciprocal.
4. `LOCAL_PROVABILITY = YES` after IMP-01/02; no foreign physical evidence is
   required.

### Local Closure

`LOCAL_CLOSURE = YES`.

### Required Tests

Domain invariant, stale-protection, compatibility, historical-replay, and
regression tests for lifecycle independence, revision invalidation, silent
rewrite rejection, and reciprocal links.

### Legacy / Cutover Impact

`CUTOVER` and `HISTORICAL_REPLAY`; old semantic records remain readable and
prior eligibility is invalidated. Physical evidence migration remains foreign.

### Completion Evidence

Revision/succession code path, immutable record proof, historical relation
fixtures, and fail-closed mutation tests.

### Risks

Silent rewrite or loss of history; mitigated by immutable storage boundary and
successor-link assertions.

### Issue Decomposition Readiness

`ISSUE_READY`; `VALIDATED_GAP_BACKING = YES`; `UNIT_FORMATION_REASON =
SHARED_CUTOVER`; `INDEPENDENT_CLOSURE = YES`.

### Initial DAG State

`BLOCKED`; `BLOCKED_BY = DOM-IMP-01, DOM-IMP-02`.

## DOM-IMP-04 — Pipeline and aggregate state machines

### Goal

Enforce canonical pipeline ordering and maintain separate aggregate state
machines with controlled derivation.

### Authority and Ownership

Primary component SPEC: DOM-PIPE-001 and DOM-STATE-001. Obligations O-009,
O-010. DOM owns ordering, aggregate state, derivation, and projection boundary.

### Gap Matrix Coverage

`GAP-009`, `GAP-010`; requirements DOM-PIPE-001, DOM-STATE-001; acceptance
AC-DOM-009, AC-DOM-010.

### Portfolio Obligation Coverage

`O-009`, `O-010`.

### Validated Delta

OBSERVED: labels, enums, and scenario advancement in mock code. REQUIRED:
productive enforcement against bypass and implicit combined transitions. DELTA:
no pipeline/state authority.

### Required Behavior

LOCAL_BEHAVIOR: reject phase bypass; keep execution, SPEC, stage, activity,
cycle, wave, ticket, migration, and publication machines distinct; derive
higher states only through approved rules. END_TO_END_CONTRIBUTION: provides
canonical state inputs to commands and advancement.

### Does Not Implement

Scheduler capacity/leases, Git integration, backend transport, OPS/UI
projection, or foreign operational states.

### Repository Evidence

`prototype/src/App.tsx:52-62` and `prototype/src/mockDomain.ts:15-23,
:863-884`. `REPLACE` mock transition authority; `EXTEND` bypass/derivation
tests.

### Expected Repository Impact

Domain aggregate/state model, pipeline guard, events/queries, and tests.
Expected Repository Impact is planning guidance, not normative design authority.

### Implementation Constraints

No stage may declare a later stage complete; projections/transports cannot
create canonical transitions; aggregate states remain separate.

### Internal Prerequisites

`DOM-IMP-01`.

### Cross-Spec Prerequisites

None blocking; consumer state mappings are downstream.

### Acceptance Criteria

1. Every prohibited bypass is rejected.
2. Combining aggregate machines or fabricating a higher state is rejected.
3. `LOCAL_PROVABILITY = YES` with only IMP-01 as completed prerequisite.

### Local Closure

`LOCAL_CLOSURE = YES`.

### Required Tests

Unit, state-machine, application, projection-boundary, and regression tests for
all stage boundaries, prohibited bypass, independent transitions, derivation,
and stale projection commands.

### Legacy / Cutover Impact

`NEW_CANONICAL_PATH`; no legacy writes or migration are owned.

### Completion Evidence

Executable ordered pipeline/state authority and negative tests for bypass and
implicit combined states.

### Risks

Consumer projection becoming a second state authority; mitigated by boundary
tests and read-only query assertions.

### Issue Decomposition Readiness

`ISSUE_READY`; `VALIDATED_GAP_BACKING = YES`; `UNIT_FORMATION_REASON =
SHARED_INVARIANT`; `INDEPENDENT_CLOSURE = YES`.

### Initial DAG State

`BLOCKED`; `BLOCKED_BY = DOM-IMP-01`.

## DOM-IMP-05 — Canonical command validation and rejection

### Goal

Provide canonical command precondition validation, recorded rejection, stale
revision handling, and no-state/no-effect semantics.

### Authority and Ownership

Primary component SPEC: DOM-CMD-001; obligation O-011. DOM owns identity,
revision, state, dependency, verdict preconditions and canonical failure
semantics (`UNKNOWN_SPEC`, `INELIGIBLE_REVISION`, `INVALID_DEPENDENCY_CLOSURE`,
`INVALID_COMMAND_BASIS`, `STALE_REVISION`).

### Gap Matrix Coverage

`GAP-011` / DOM-CMD-001; acceptance AC-DOM-011.

### Portfolio Obligation Coverage

`O-011`.

### Validated Delta

OBSERVED: mock request/advance loop only. REQUIRED: productive validation,
recorded rejection, and no transition/effect on rejection. DELTA: no canonical
command boundary exists.

### Required Behavior

LOCAL_BEHAVIOR: validate all DOM preconditions, return exact rejection reason,
and leave canonical state/effect unchanged when invalid. END_TO_END_CONTRIBUTION:
transport and PLAT can correlate the result without changing its meaning.

### Does Not Implement

PLAT journal/effect persistence, BACKEND/UI envelopes, adapter retries, or
foreign failure families.

### Repository Evidence

`prototype/src/mockDomain.ts:938-940` and invalid/stale/no-effect tests.
`REPLACE` mock command mutation; `EXTEND` positive/negative command tests.

### Expected Repository Impact

Domain command handlers, rejection events/queries, and unit/application tests.
Expected Repository Impact is planning guidance, not normative design authority.

### Implementation Constraints

Fail closed; reject stale or invalid basis atomically; never rename DOM failure
families or produce partial state/effect.

### Internal Prerequisites

`DOM-IMP-01`, `DOM-IMP-04`.

### Cross-Spec Prerequisites

| Owner SPEC | Required capability | Implementation state | Blocking? |
|---|---|---|---|
| SPEC-PLAT-001 | Durable rejection/effect evidence correlation | Foreign/downstream owner; absent | No; local rejection closes with boundary fixture |
| SPEC-BACKEND-001 / SPEC-UI-001 | Result mapping | Consumer mappings; absent | No |

### Acceptance Criteria

1. Invalid identity, revision, state, dependency, and verdict commands are
   rejected with canonical reason.
2. Rejected command leaves state and effect unchanged.
3. `LOCAL_PROVABILITY = YES`; no physical journal proof is placed in local AC.

### Local Closure

`LOCAL_CLOSURE = YES`.

### Required Tests

Unit, stale-protection, idempotency/no-duplicate-transition, application, and
regression tests for every precondition and atomic no-effect rejection.

### Legacy / Cutover Impact

`NEW_CANONICAL_PATH`; no legacy writer retirement.

### Completion Evidence

Command boundary, canonical reason records, unchanged-state assertions, and
correlated result contract.

### Risks

Partial mutation before validation or transport-level semantic renaming;
mitigated by atomic negative tests and mapping contract tests.

### Issue Decomposition Readiness

`ISSUE_READY`; `VALIDATED_GAP_BACKING = YES`; `UNIT_FORMATION_REASON =
SHARED_COMMAND_BOUNDARY`; `INDEPENDENT_CLOSURE = YES`.

### Initial DAG State

`BLOCKED`; `BLOCKED_BY = DOM-IMP-01, DOM-IMP-04`.

## DOM-IMP-06 — Ticket aggregate and functional transitions

### Goal

Enforce the six canonical ticket functional states, terminality, linked-ticket
continuation, and exactly the eight valid functional transitions.

### Authority and Ownership

Primary component SPEC: DOM-TICKET-001 and DOM-TICKET-002. Obligations O-012,
O-013. DOM owns functional ticket state and transition meaning; operational
execution/audit states remain foreign or separate.

### Gap Matrix Coverage

`GAP-012`, `GAP-013`; requirements DOM-TICKET-001, DOM-TICKET-002; acceptance
AC-DOM-012, AC-DOM-013.

### Portfolio Obligation Coverage

`O-012`, `O-013`.

### Validated Delta

OBSERVED: mock labels and scenario-specific guards. REQUIRED: productive ticket
aggregate, terminality, linked continuation, exact transition table, and
recorded rejection. DELTA: no productive ticket authority exists.

### Required Behavior

LOCAL_BEHAVIOR: accept only the six states and eight specified transitions;
reject all other transitions; keep completed/cancelled tickets terminal and
require a new linked ticket for continuation. END_TO_END_CONTRIBUTION: exposes
functional ticket basis to execution, Git, and UI mappings.

### Does Not Implement

Ticket branches/worktrees, scheduler operational state, Git integration,
transport/UI, or final conformance.

### Repository Evidence

`prototype/src/mockDomain.ts:17-18, :826-845, :886-928` and ticket/DAG tests.
`REPLACE` scenario guards; `EXTEND` all-valid/all-invalid transition matrix.

### Expected Repository Impact

Ticket aggregate, transition command/event boundary, and domain/application
tests. Expected Repository Impact is planning guidance, not normative design authority.

### Implementation Constraints

Preserve six-state vocabulary, terminality, exact eight transitions, rejection
recording, and linked-ticket history.

### Internal Prerequisites

`DOM-IMP-04`, `DOM-IMP-05`.

### Cross-Spec Prerequisites

None blocking; execution and operational states remain separate consumers.

### Acceptance Criteria

1. Only the six functional states are accepted and terminals cannot reopen.
2. All eight valid transitions pass and every other transition is rejected.
3. `LOCAL_PROVABILITY = YES` after IMP-04/05.

### Local Closure

`LOCAL_CLOSURE = YES`.

### Required Tests

Unit, state-machine, command, regression, and stale/idempotency tests covering
the full transition matrix, terminality, continuation links, and rejection.

### Legacy / Cutover Impact

`NEW_CANONICAL_PATH`; preserve terminal history and do not reopen completed
tickets.

### Completion Evidence

Executable ticket aggregate and complete transition test matrix with terminal
and linked-continuation evidence.

### Risks

Operational state leaking into functional state; mitigated by separate-state
tests and transition-table proof.

### Issue Decomposition Readiness

`ISSUE_READY`; `VALIDATED_GAP_BACKING = YES`; `UNIT_FORMATION_REASON =
SHARED_INVARIANT`; `INDEPENDENT_CLOSURE = YES`.

### Initial DAG State

`BLOCKED`; `BLOCKED_BY = DOM-IMP-04, DOM-IMP-05`.

## DOM-IMP-07 — Publication vocabulary and advancement gates

### Goal

Implement canonical publication vocabulary and formal-verdict-gated,
independent, cooperative advancement semantics.

### Authority and Ownership

Primary component SPEC: DOM-PUB-001 and DOM-ADV-001. Obligations O-014, O-015.
DOM owns vocabulary, gates, pause/cancel semantics, and preservation of remote
effect distinctions; GIT owns publication execution and confirmation.

### Gap Matrix Coverage

`GAP-014`, `GAP-015`; requirements DOM-PUB-001, DOM-ADV-001; acceptance
AC-DOM-014, AC-DOM-015.

### Portfolio Obligation Coverage

`O-014`, `O-015`.

### Validated Delta

OBSERVED: mock publication states and advancement guards. REQUIRED: productive
candidate/approval/integration/PR/merge/remote-confirmation distinction and
verdict-gated advancement. DELTA: no productive boundary exists.

### Required Behavior

LOCAL_BEHAVIOR: keep `PR_MERGED` distinct from
`REMOTE_PUBLICATION_CONFIRMED`; reject advancement without verdict or closed
dependency; model independent progress and cooperative pause/cancel without
reverting remote effects. END_TO_END_CONTRIBUTION: accepts foreign publication
evidence without executing Git.

### Does Not Implement

Git/GitHub execution, push/PR/merge, remote confirmation evidence, scheduler
capacity, or UI/OPS presentation.

### Repository Evidence

`prototype/src/mockDomain.ts:22, :720, :910-917` and publication/drift/PR
tests. `REPLACE` mock effects; `EXTEND` vocabulary and gate tests.

### Expected Repository Impact

Domain publication/advancement state and command/event boundary, with tests.
Expected Repository Impact is planning guidance, not normative design authority.

### Implementation Constraints

Preserve requested/accepted/rejected/confirmed distinction, formal verdict
gating, independent progress, cooperative cancellation, and foreign execution
ownership.

### Internal Prerequisites

`DOM-IMP-04`, `DOM-IMP-05`.

### Cross-Spec Prerequisites

| Owner SPEC | Required capability | Implementation state | Blocking? |
|---|---|---|---|
| SPEC-GIT-001 | Publication execution/evidence/remote confirmation | Foreign/downstream owner; absent | No; DOM gate closes with evidence fixture |

### Acceptance Criteria

1. Publication states distinguish PR merge from remote confirmation.
2. No-verdict, closed-dependency, and non-cooperative cancellation paths are
   rejected; remote effects are not reverted.
3. `LOCAL_PROVABILITY = YES` after IMP-04/05.

### Local Closure

`LOCAL_CLOSURE = YES`.

### Required Tests

Unit, state-machine, application, compatibility, idempotency, and regression
tests for publication vocabulary, verdict gates, independent progress,
pause/cancel requests, and remote-effect preservation.

### Legacy / Cutover Impact

`NEW_CANONICAL_PATH`; legacy publication adapters remain foreign-owned.

### Completion Evidence

Canonical publication state model, gate/rejection evidence, and mapping tests
proving no Git execution or confirmation is locally claimed.

### Risks

Equating merge with confirmation or cancellation with rollback; mitigated by
explicit state and negative-path tests.

### Issue Decomposition Readiness

`ISSUE_READY`; `VALIDATED_GAP_BACKING = YES`; `UNIT_FORMATION_REASON =
SHARED_COMMAND_BOUNDARY`; `INDEPENDENT_CLOSURE = YES`.

### Initial DAG State

`BLOCKED`; `BLOCKED_BY = DOM-IMP-04, DOM-IMP-05`.

## DOM-IMP-08 — Audit-cycle identity and structured verdict closure

### Goal

Create explicit artifact/cycle/round identity and make only a structured
verdict capable of closing an audit cycle.

### Authority and Ownership

Primary component SPEC: DOM-AUDIT-001 and DOM-AUDIT-002. Obligations O-049,
O-050. DOM owns cycle identity, verdict semantics, and closure authority.

### Gap Matrix Coverage

`GAP-016`, `GAP-017`; requirements DOM-AUDIT-001, DOM-AUDIT-002; acceptance
AC-DOM-049, AC-DOM-050.

### Portfolio Obligation Coverage

`O-049`, `O-050`.

### Validated Delta

OBSERVED: mock cycle/round fields and finding commands. REQUIRED: unique cycle
identity for every governed artifact and structured-verdict closure. DELTA: no
productive audit-cycle authority.

### Required Behavior

LOCAL_BEHAVIOR: identify artifact/cycle/round without implicit reuse; reject
cycle closure from remediation, empty findings, or process termination; accept
only a structured verdict. END_TO_END_CONTRIBUTION: provides audit basis for
round policy, conformance, and invalidation.

### Does Not Implement

Agent/session assignment, auditor/remediator execution, physical persistence,
OPS projection, or final conformance evaluation.

### Repository Evidence

`prototype/src/mockDomain.ts:32, :713-716, :886-928` and audit/remediation
tests. `REPLACE` mock cycle state; `EXTEND` cycle/verdict tests.

### Expected Repository Impact

Audit-cycle aggregate, verdict command/event boundary, and tests. Expected
Repository Impact is planning guidance, not normative design authority.

### Implementation Constraints

Cycle identity is explicit and non-reusable; remediation never approves;
structured verdict is the sole closure authority.

### Internal Prerequisites

`DOM-IMP-01`, `DOM-IMP-05`.

### Cross-Spec Prerequisites

None blocking; assignment/session contracts remain foreign.

### Acceptance Criteria

1. Every governed artifact receives identifiable cycle/round records.
2. Only structured verdict closes a cycle; remediation alone cannot approve.
3. `LOCAL_PROVABILITY = YES` after IMP-01/05.

### Local Closure

`LOCAL_CLOSURE = YES`.

### Required Tests

Unit, domain-invariant, command, historical-replay, and regression tests for
cycle identity, prohibited reuse, verdict structure, and remediation rejection.

### Legacy / Cutover Impact

`NEW_CANONICAL_PATH`; preserve historical cycles.

### Completion Evidence

Cycle/verdict authority, structured closure evidence, and negative remediation
tests.

### Risks

Implicit cycle reuse or process completion treated as approval; mitigated by
identity and closure-gate tests.

### Issue Decomposition Readiness

`ISSUE_READY`; `VALIDATED_GAP_BACKING = YES`; `UNIT_FORMATION_REASON =
SHARED_AUTHORITY`; `INDEPENDENT_CLOSURE = YES`.

### Initial DAG State

`BLOCKED`; `BLOCKED_BY = DOM-IMP-01, DOM-IMP-05`.

## DOM-IMP-09 — Round limit and continuation authorization

### Goal

Enforce the configurable ten-round limit, affected-unit pause, and explicit
authorization for the next round.

### Authority and Ownership

Primary component SPEC: DOM-AUDIT-003; obligation O-051. DOM owns round policy
and authorization semantics; execution only carries out an authorized round.

### Gap Matrix Coverage

`GAP-018` / DOM-AUDIT-003; acceptance AC-DOM-051.

### Portfolio Obligation Coverage

`O-051`.

### Validated Delta

OBSERVED: mock round 10 and authorization command. REQUIRED: productive
configurable limit, local pause, and one explicit continuation record. DELTA:
no productive round policy.

### Required Behavior

LOCAL_BEHAVIOR: pause only the affected unit at the limit and reject the next
round until explicit authorization. END_TO_END_CONTRIBUTION: supplies a
deterministic gate to execution/scheduling.

### Does Not Implement

Scheduler capacity, assignment/session creation, audit execution, or transport.

### Repository Evidence

`prototype/src/mockDomain.ts:730, :837, :901` and round-limit tests.
`REPLACE` simulated policy; `EXTEND` authorization and isolation tests.

### Expected Repository Impact

Audit-cycle policy/command boundary and tests. Expected Repository Impact is
planning guidance, not normative design authority.

### Implementation Constraints

Ten is the configurable initial limit; pause is unit-local; continuation is
explicit, singular, and auditable.

### Internal Prerequisites

`DOM-IMP-08`.

### Cross-Spec Prerequisites

None blocking.

### Acceptance Criteria

1. The tenth round pauses only the affected unit.
2. The following round requires one explicit authorization and cannot be
   inferred from process state.
3. `LOCAL_PROVABILITY = YES` after IMP-08.

### Local Closure

`LOCAL_CLOSURE = YES`.

### Required Tests

Unit, command, concurrency/isolation, recovery, and regression tests for tenth
round behavior, unrelated-unit progress, duplicate authorization, and restart
of an authorized round.

### Legacy / Cutover Impact

`NEW_CANONICAL_PATH`; preserve prior cycle/round history.

### Completion Evidence

Configurable policy, pause/authorization record, and isolation/duplicate tests.

### Risks

Global pause or implicit continuation; mitigated by unit-isolation and explicit
authorization assertions.

### Issue Decomposition Readiness

`ISSUE_READY`; `VALIDATED_GAP_BACKING = YES`; `UNIT_FORMATION_REASON =
SHARED_INVARIANT`; `INDEPENDENT_CLOSURE = YES`.

### Initial DAG State

`BLOCKED`; `BLOCKED_BY = DOM-IMP-08`.

## DOM-IMP-10 — Normative-change invalidation and adjustment lineage

### Goal

Invalidate only affected downstream approvals after normative change, preserve
history, return to the appropriate documentation stage, and create linked
adjustment/substitution work without reopening completed tickets.

### Authority and Ownership

Primary component SPEC: DOM-AUDIT-005; obligation O-053. DOM owns cutover and
invalidation; downstream components consume the result.

### Gap Matrix Coverage

`GAP-020` / DOM-AUDIT-005; acceptance AC-DOM-053.

### Portfolio Obligation Coverage

`O-053`.

### Validated Delta

OBSERVED: mock drift/mutation changes in-memory state. REQUIRED: productive
approval registry, selective invalidation, preserved terminal ticket history,
and linked adjustment/substitution history. DELTA: no productive cutover path.

### Required Behavior

LOCAL_BEHAVIOR: detect normative change, invalidate affected downstream
approvals, preserve unaffected and completed history, return the affected unit
to the proper documentation stage, and link new adjustment/substitution
records. END_TO_END_CONTRIBUTION: makes stale approvals unavailable to later
advancement.

### Does Not Implement

Rewriting ADR documents, physical evidence migration, downstream execution,
legacy adapter retirement, or reopening completed tickets.

### Repository Evidence

`prototype/src/mockDomain.ts:737, :910-912, :927` and drift/invalidation tests.
`REPLACE` mock cutover; `EXTEND` selective invalidation/history tests.

### Expected Repository Impact

Domain approval/invalidation registry, adjustment lineage, stage commands, and
tests. Expected Repository Impact is planning guidance, not normative design authority.

### Implementation Constraints

Preserve completed ticket terminality, selective invalidation, historical
lineage, and approved cutover ownership.

### Internal Prerequisites

`DOM-IMP-03`, `DOM-IMP-06`.

### Cross-Spec Prerequisites

None blocking; downstream projections consume the invalidation result.

### Acceptance Criteria

1. Normative change makes only affected downstream approvals obsolete.
2. Completed tickets remain historical and closed; a linked adjustment or
   substitution record is created.
3. `LOCAL_PROVABILITY = YES` after IMP-03/06.

### Local Closure

`LOCAL_CLOSURE = YES`.

### Required Tests

Unit, state-machine, stale-protection, compatibility, migration-history, and
regression tests for selective invalidation, preserved terminal tickets,
stage return, and linked adjustment lineage.

### Legacy / Cutover Impact

`CUTOVER`; preserve historical reads and remove no foreign adapter authority.

### Completion Evidence

Approval registry, selective invalidation trace, unchanged completed-ticket
records, and linked adjustment/substitution evidence.

### Risks

Over-invalidation or reopening terminal work; mitigated by selective fixture
tests and terminality assertions.

### Issue Decomposition Readiness

`ISSUE_READY`; `VALIDATED_GAP_BACKING = YES`; `UNIT_FORMATION_REASON =
SHARED_CUTOVER`; `INDEPENDENT_CLOSURE = YES`.

### Initial DAG State

`BLOCKED`; `BLOCKED_BY = DOM-IMP-03, DOM-IMP-06`.

## DOM-IMP-11 — Exact candidate evidence and drift gate

### Goal

Bind canonical publication/conformance identity to exact base, head, tree, and
hash-linked evidence, invalidating authorization on drift.

### Authority and Ownership

Primary component SPEC: DOM-AUDIT-006; obligation O-054. DOM owns candidate
identity, semantic evidence binding, and the gate. GIT owns publication
evidence production; PLAT/OPS own physical preservation/replay.

### Gap Matrix Coverage

`GAP-021` / DOM-AUDIT-006; acceptance AC-DOM-054.

### Portfolio Obligation Coverage

`O-054`.

### Validated Delta

OBSERVED: deterministic mock hashes/evidence IDs. REQUIRED: productive exact
candidate identity, hash-linked semantic binding, and drift-invalidating gate.
DELTA: no productive DOM evidence boundary exists.

### Required Behavior

LOCAL_BEHAVIOR: bind candidate approval to exact base/head/tree, conformance
run, and correlated evidence; reject/invalidate any drift before publication;
retain identity links. END_TO_END_CONTRIBUTION: consumes GIT evidence without
executing Git and exposes preservation references to PLAT/OPS.

### Does Not Implement

Git/GitHub operations, remote evidence generation, PLAT journal/storage/replay,
OPS export/projection, or publication transport.

### Repository Evidence

`prototype/src/mockDomain.ts:705, :720, :911-917` and publication/drift tests.
`REPLACE` mock candidate authority; `EXTEND` exact-binding and drift tests.

### Expected Repository Impact

Domain candidate/conformance gate and foreign-evidence mapping tests. Expected
Repository Impact is planning guidance, not normative design authority.

### Implementation Constraints

Exact base/head/tree and hash evidence are mandatory; drift invalidates
authorization; foreign evidence remains distinct from canonical identity.

### Internal Prerequisites

`DOM-IMP-01`, `DOM-IMP-07`.

### Cross-Spec Prerequisites

| Owner SPEC | Required capability | Implementation state | Blocking? |
|---|---|---|---|
| SPEC-GIT-001 | Publication evidence | Foreign/downstream owner; absent | No; contract fixture proves local gate |
| SPEC-PLAT-001 / SPEC-OPS-001 | Physical preservation/replay | Foreign/downstream owners; absent | No |

### Acceptance Criteria

1. Candidate identity is bound to exact base/head/tree and hash-linked evidence.
2. Base, head, or tree drift invalidates authorization before publication.
3. `LOCAL_PROVABILITY = YES` after IMP-01/07.

### Local Closure

`LOCAL_CLOSURE = YES`; integrated foreign preservation is a separate checkpoint.

### Required Tests

Unit, conformance, stale-protection, compatibility, idempotency, and
regression tests for exact binding, each drift dimension, evidence identity,
and no confirmation from adapter success alone.

### Legacy / Cutover Impact

`HISTORICAL_REPLAY` and `CUTOVER`; preserve old evidence references and do not
retire foreign paths.

### Completion Evidence

Candidate/evidence gate, exact-binding assertions, drift invalidation trace,
and foreign mapping contract tests.

### Risks

Identity mismatch or accepting stale evidence; mitigated by base/head/tree
matrix tests and hash-linked correlation assertions.

### Issue Decomposition Readiness

`ISSUE_READY`; `VALIDATED_GAP_BACKING = YES`; `UNIT_FORMATION_REASON =
SHARED_CONFORMANCE`; `INDEPENDENT_CLOSURE = YES`.

### Initial DAG State

`BLOCKED`; `BLOCKED_BY = DOM-IMP-01, DOM-IMP-07`.

## DOM-IMP-12 — Final conformance evaluator

### Goal

Provide the DOM-owned final conformance evaluator and structured outcome that
checks coverage, integration, regressions, tests, omissions, and extrapolations
after the required contributors are complete.

### Authority and Ownership

Primary component SPEC: DOM-AUDIT-004; obligation O-052. DOM owns the
conformance lifecycle and gate; implementation audits provide evidence but do
not redefine closure.

### Gap Matrix Coverage

`GAP-019` / DOM-AUDIT-004; acceptance AC-DOM-052.

### Portfolio Obligation Coverage

`O-052`.

### Validated Delta

OBSERVED: prototype stage/report only. REQUIRED: productive evaluator covering
all named final-conformance dimensions after ticket completion. DELTA: no
productive evaluator or structured final gate exists.

### Required Behavior

LOCAL_BEHAVIOR: evaluate supplied artifact/cycle/implementation evidence for
coverage, adherence, integration, regressions, tests, omissions, and
extrapolations; emit a structured conformance result and return to remediation
when it fails. END_TO_END_CONTRIBUTION: closes the DOM conformance lifecycle
once all contributor evidence is present.

### Does Not Implement

Individual ticket implementation, audit execution, PLAT/GIT evidence
production, OPS/UI projection, or foreign lifecycle semantics.

### Repository Evidence

`prototype/src/App.tsx:52-62`, `prototype/src/mockDomain.ts:711-712`, and
prototype journey/conformance tests. `REPLACE` simulated report gate; `EXTEND`
test fixtures for each dimension.

### Expected Repository Impact

Domain conformance evaluation boundary, structured outcome, and conformance
tests. Expected Repository Impact is planning guidance, not normative design authority.

### Implementation Constraints

Only structured verdict closes the cycle; evaluator must not treat missing,
omitted, or extrapolated work as complete and must preserve cycle identity.

### Internal Prerequisites

`DOM-IMP-01`, `DOM-IMP-02`, `DOM-IMP-03`, `DOM-IMP-04`, `DOM-IMP-05`,
`DOM-IMP-06`, `DOM-IMP-07`, `DOM-IMP-08`, `DOM-IMP-09`, `DOM-IMP-10`,
`DOM-IMP-11`.

### Cross-Spec Prerequisites

None blocking; foreign evidence is supplied through explicit contract fixtures.

### Acceptance Criteria

1. Final evaluation checks all six named dimensions and records a structured
   pass/fail result.
2. Failed conformance cannot close the cycle and returns to remediation.
3. `LOCAL_PROVABILITY = YES` once listed internal prerequisites are complete;
   no future unit is required for local closure.

### Local Closure

`LOCAL_CLOSURE = YES`; this unit owns final proof for AC-DOM-052 but not the
implementation of the contributing units.

### Required Tests

Unit and conformance tests for each dimension, missing/omission/extrapolation
negative paths, structured verdict identity, remediation return, and complete
integrated evidence fixture.

### Legacy / Cutover Impact

`NEW_CANONICAL_PATH` and `HISTORICAL_REPLAY`; preserve prior conformance
cycles and verdict evidence.

### Completion Evidence

Evaluator code path, structured result, dimension-by-dimension evidence,
failure/remediation trace, and integrated conformance test pass.

### Risks

Synthetic or incomplete final proof; mitigated by prerequisite DAG, explicit
evidence schema, and final-proof-owner audit.

### Issue Decomposition Readiness

`ISSUE_READY`; `VALIDATED_GAP_BACKING = YES`; `UNIT_FORMATION_REASON =
SHARED_CONFORMANCE`; `INDEPENDENT_CLOSURE = YES`.

### Initial DAG State

`BLOCKED`; `BLOCKED_BY = DOM-IMP-01..09, DOM-IMP-10, DOM-IMP-11`.

## 10. Gap → Plan Traceability

| Gap ID | Requirement | Portfolio Obligation | Classification | Severity | Planning Type | Implementation Unit(s) | Status |
|---|---|---|---|---|---|---|---|
| GAP-001 | DOM-ID-001 | O-001 | MISSING | MAJOR | LOCAL_IMPLEMENTATION_WORK | DOM-IMP-01 | COVERED |
| GAP-002 | DOM-INGEST-001 | O-002 | MISSING | MAJOR | LOCAL_IMPLEMENTATION_WORK | DOM-IMP-02 | COVERED |
| GAP-003 | DOM-SNAPSHOT-001 | O-003 | MISSING | MAJOR | INTEGRATION_OR_CONVERGENCE_WORK | DOM-IMP-02 | COVERED |
| GAP-004 | DOM-ELIG-001 | O-004 | MISSING | MAJOR | LOCAL_IMPLEMENTATION_WORK | DOM-IMP-02 | COVERED |
| GAP-005 | DOM-LINEAGE-001 | O-005 | MISSING | MAJOR | LOCAL_IMPLEMENTATION_WORK | DOM-IMP-01 | COVERED |
| GAP-006 | DOM-LIFE-001 | O-006 | MISSING | MAJOR | LOCAL_IMPLEMENTATION_WORK | DOM-IMP-03 | COVERED |
| GAP-007 | DOM-REV-001 | O-007 | MISSING | MAJOR | LOCAL_IMPLEMENTATION_WORK | DOM-IMP-03 | COVERED |
| GAP-008 | DOM-IMMUT-001 | O-008 | MISSING | MAJOR | INTEGRATION_OR_CONVERGENCE_WORK | DOM-IMP-03 | COVERED |
| GAP-009 | DOM-PIPE-001 | O-009 | MISSING | MAJOR | LOCAL_IMPLEMENTATION_WORK | DOM-IMP-04 | COVERED |
| GAP-010 | DOM-STATE-001 | O-010 | MISSING | MAJOR | LOCAL_IMPLEMENTATION_WORK | DOM-IMP-04 | COVERED |
| GAP-011 | DOM-CMD-001 | O-011 | MISSING | MAJOR | INTEGRATION_OR_CONVERGENCE_WORK | DOM-IMP-05 | COVERED |
| GAP-012 | DOM-TICKET-001 | O-012 | MISSING | MAJOR | LOCAL_IMPLEMENTATION_WORK | DOM-IMP-06 | COVERED |
| GAP-013 | DOM-TICKET-002 | O-013 | MISSING | MAJOR | LOCAL_IMPLEMENTATION_WORK | DOM-IMP-06 | COVERED |
| GAP-014 | DOM-PUB-001 | O-014 | MISSING | MAJOR | LOCAL_IMPLEMENTATION_WORK | DOM-IMP-07 | COVERED |
| GAP-015 | DOM-ADV-001 | O-015 | MISSING | MAJOR | LOCAL_IMPLEMENTATION_WORK | DOM-IMP-07 | COVERED |
| GAP-016 | DOM-AUDIT-001 | O-049 | MISSING | MAJOR | LOCAL_IMPLEMENTATION_WORK | DOM-IMP-08 | COVERED |
| GAP-017 | DOM-AUDIT-002 | O-050 | MISSING | MAJOR | LOCAL_IMPLEMENTATION_WORK | DOM-IMP-08 | COVERED |
| GAP-018 | DOM-AUDIT-003 | O-051 | MISSING | MAJOR | LOCAL_IMPLEMENTATION_WORK | DOM-IMP-09 | COVERED |
| GAP-019 | DOM-AUDIT-004 | O-052 | MISSING | MAJOR | LOCAL_IMPLEMENTATION_WORK | DOM-IMP-12 | COVERED |
| GAP-020 | DOM-AUDIT-005 | O-053 | MISSING | MAJOR | LOCAL_IMPLEMENTATION_WORK | DOM-IMP-10 | COVERED |
| GAP-021 | DOM-AUDIT-006 | O-054 | MISSING | MAJOR | INTEGRATION_OR_CONVERGENCE_WORK | DOM-IMP-11 | COVERED |

`GAPS_WITHOUT_PLAN_COVERAGE = 0`.

## 11. Acceptance → Plan Traceability

| Acceptance ID | Requirement | Contributing Units | Final Proof Owner | Local Evidence | Final Evidence |
|---|---|---|---|---|---|
| AC-DOM-001 | DOM-ID-001 | DOM-IMP-01 | DOM-IMP-01 | Identity invariant tests | Same tests plus historical-resolution evidence |
| AC-DOM-002 | DOM-INGEST-001 | DOM-IMP-02 | DOM-IMP-02 | Manual-trigger negative tests | Productive command trace |
| AC-DOM-003 | DOM-SNAPSHOT-001 | DOM-IMP-02 | DOM-IMP-02 | Snapshot lock/drift tests | Immutable snapshot evidence |
| AC-DOM-004 | DOM-ELIG-001 | DOM-IMP-02 | DOM-IMP-02 | Eligibility matrix | Fail-closed rejection evidence |
| AC-DOM-005 | DOM-LINEAGE-001 | DOM-IMP-01 | DOM-IMP-01 | Lineage isolation tests | Verifiable many-to-many records |
| AC-DOM-006 | DOM-LIFE-001 | DOM-IMP-03 | DOM-IMP-03 | Independent lifecycle tests | Separate lifecycle trace |
| AC-DOM-007 | DOM-REV-001 | DOM-IMP-03 | DOM-IMP-03 | Successor/invalidation tests | Historical revision evidence |
| AC-DOM-008 | DOM-IMMUT-001 | DOM-IMP-03 | DOM-IMP-03 | Silent rewrite rejection | Reciprocal succession evidence |
| AC-DOM-009 | DOM-PIPE-001 | DOM-IMP-04 | DOM-IMP-04 | Bypass tests | Ordered pipeline trace |
| AC-DOM-010 | DOM-STATE-001 | DOM-IMP-04 | DOM-IMP-04 | Separate-state tests | Derivation/projection evidence |
| AC-DOM-011 | DOM-CMD-001 | DOM-IMP-05 | DOM-IMP-05 | Rejection/no-effect tests | Canonical reason/result evidence |
| AC-DOM-012 | DOM-TICKET-001 | DOM-IMP-06 | DOM-IMP-06 | State/terminality tests | Ticket aggregate evidence |
| AC-DOM-013 | DOM-TICKET-002 | DOM-IMP-06 | DOM-IMP-06 | Eight-transition matrix | Complete transition proof |
| AC-DOM-014 | DOM-PUB-001 | DOM-IMP-07 | DOM-IMP-07 | Publication vocabulary tests | Distinct merge/confirmation evidence |
| AC-DOM-015 | DOM-ADV-001 | DOM-IMP-07 | DOM-IMP-07 | Verdict/pause/cancel tests | Gate and remote-effect evidence |
| AC-DOM-049 | DOM-AUDIT-001 | DOM-IMP-08 | DOM-IMP-08 | Cycle identity tests | Complete artifact-cycle registry evidence |
| AC-DOM-050 | DOM-AUDIT-002 | DOM-IMP-08 | DOM-IMP-08 | Structured-verdict tests | Cycle closure evidence |
| AC-DOM-051 | DOM-AUDIT-003 | DOM-IMP-09 | DOM-IMP-09 | Tenth-round/isolation tests | Authorization trace |
| AC-DOM-052 | DOM-AUDIT-004 | DOM-IMP-01–09, DOM-IMP-10–11 | DOM-IMP-12 | Unit evidence from contributors | Integrated six-dimension conformance result |
| AC-DOM-053 | DOM-AUDIT-005 | DOM-IMP-03, DOM-IMP-06, DOM-IMP-10 | DOM-IMP-10 | Selective invalidation tests | Preserved terminal history and linked adjustment proof |
| AC-DOM-054 | DOM-AUDIT-006 | DOM-IMP-01, DOM-IMP-07, DOM-IMP-11 | DOM-IMP-11 | Exact-binding/drift tests | Hash-linked publication gate evidence |

Each acceptance has exactly one final proof owner. Integrated checkpoint proof
is not copied into earlier units' local acceptance criteria.

## 12. Cross-Spec Dependencies

These are consumer/integration relationships from the approved portfolio, not
new normative DOM dependencies. All are non-blocking for local DOM closure.

| Dependency | Portfolio owner | Consumer unit | Required contract | Foreign implementation state | Blocking? |
|---|---|---|---|---|---|
| Exact skill/contract version metadata | SPEC-EXEC-001 | DOM-IMP-02 | Consume exact version values in snapshot | Downstream implementation absent | No |
| Durable snapshot/evidence and journal correlation | SPEC-PLAT-001 | DOM-IMP-02, 03, 05, 11 | Preserve DOM identity/revision/evidence references | Downstream implementation absent | No |
| Operational evidence projection/preservation | SPEC-OPS-001 | DOM-IMP-03, 11 | Project hash-linked semantic records | Downstream implementation absent | No |
| Publication execution/evidence/confirmation | SPEC-GIT-001 | DOM-IMP-07, 11 | Supply foreign evidence; keep merge distinct from confirmation | Downstream implementation absent | No |
| Transport/security mapping | SPEC-BACKEND-001 | DOM-IMP-05 | Map canonical commands/rejections without semantic change | Downstream implementation absent | No |
| Client projection/request mapping | SPEC-UI-001 | DOM-IMP-02, 04, 05, 07 | Request/read only; never confirm or mutate authority | Downstream implementation absent | No |
| Legacy compatibility adapter | SPEC-REPO-001 | DOM-IMP-02, 03, 11 | Adapt historical paths without second DOM authority | Downstream implementation absent | No |

`UNAPPROVED_NORMATIVE_DEPENDENCIES = 0`; no foreign lifecycle implementation
is assigned to a DOM unit.

## 13. Dependency DAG

```text
DOM-IMP-01
├── DOM-IMP-02
│   └── DOM-IMP-03
├── DOM-IMP-04
│   └── DOM-IMP-05
│       ├── DOM-IMP-06
│       │   └── DOM-IMP-10
│       └── DOM-IMP-07
│           └── DOM-IMP-11
│               └──────────────┐
├── DOM-IMP-08 ── DOM-IMP-09 ─┤
└──────────────────────────────┴── DOM-IMP-12
```

Additional edges: `DOM-IMP-03 → DOM-IMP-10` and `DOM-IMP-06 → DOM-IMP-10`;
`DOM-IMP-05 → DOM-IMP-08`; `DOM-IMP-01 → DOM-IMP-11`;
`DOM-IMP-07 → DOM-IMP-11`; and all units
`DOM-IMP-01..09`, `DOM-IMP-10`, `DOM-IMP-11` → `DOM-IMP-12` as listed in
that unit's prerequisites. Every edge is an implementation dependency, not a
new normative portfolio edge. `DAG_CYCLE_DETECTED = NO`.

## 14. Parallelization Waves

| Wave | Units | Prerequisites | Collision risk | Execution mode |
|---|---|---|---|---|
| 1 | DOM-IMP-01 | None | Identity model is shared foundation | `SERIAL_REQUIRED` |
| 2 | DOM-IMP-02, DOM-IMP-04 | IMP-01 | Both may touch aggregate boundary vocabulary | `SAFE_WITH_COORDINATION` |
| 3 | DOM-IMP-03, DOM-IMP-05 | IMP-02/04 as applicable | Revision and command/state seams may overlap | `SAFE_WITH_COORDINATION` |
| 4 | DOM-IMP-06, DOM-IMP-07, DOM-IMP-08 | IMP-04/05; IMP-01/05 | Distinct aggregates but shared command/event conventions | `SAFE_WITH_COORDINATION` |
| 5 | DOM-IMP-09, DOM-IMP-10, DOM-IMP-11 | IMP-08; IMP-03/06; IMP-01/07 | Cutover/evidence tests may share conformance fixtures | `SAFE_WITH_COORDINATION` |
| 6 | DOM-IMP-12 | All prior units | Final evaluator consumes all evidence | `SERIAL_REQUIRED` |

## 15. Integration Checkpoints

| Checkpoint | Required units | Integrated behavior | Required evidence | Unlocks |
|---|---|---|---|---|
| CP-DOM-01 | IMP-01, IMP-02, IMP-03 | Canonical identity, snapshot, eligibility, revision, and historical basis converge | Identity/hash/revision replay and drift rejection | Downstream consumer mappings; IMP-10 remains gated on CP-DOM-02 |
| CP-DOM-02 | IMP-04, IMP-05, IMP-06, IMP-07 | Separate states, commands, ticket transitions, publication vocabulary, and gates converge | Full command/state negative matrix and no-second-authority proof | IMP-10, IMP-11 |
| CP-DOM-03 | IMP-08, IMP-09, IMP-10, IMP-11 | Audit cycles, rounds, invalidation, and exact evidence converge | Structured verdict, selective cutover, exact base/head/tree drift evidence | IMP-12 |
| CP-DOM-04 | IMP-01–11 | Complete DOM evidence is evaluated as one conformance boundary | Six final-conformance dimensions and remediation return | Final conformance/publication workflow |

Checkpoint evidence is integrated proof and is not a local AC for an earlier
unit.

## 16. Legacy / Authority Transition

| Current path | Target authority | Read behavior | Write behavior | Migration/mapping | Owning unit |
|---|---|---|---|---|---|
| Prototype/mock identity and lineage | DOM-IMP-01 | Prototype remains historical evidence only | No productive writes from prototype | Replace with canonical identity/lineage boundary | IMP-01 |
| In-memory snapshot/eligibility | DOM-IMP-02 | Historical records remain resolvable | Only explicit manual canonical entry | Map exact metadata; PLAT owns physical persistence | IMP-02 |
| Mutable/reversible ADR scenario | DOM-IMP-03 | Preserve old semantic revision history | Reject silent rewrite; create successor | Link revisions; physical evidence remains foreign | IMP-03 |
| Mock states/commands/tickets | DOM-IMP-04–06 | Preserve historical labels as evidence | Productive canonical commands only | Map operational/transport states without authority transfer | IMP-04–06 |
| Mock publication/effects | DOM-IMP-07, IMP-11 | Preserve candidate/evidence identity | DOM gates; GIT executes and confirms | Accept foreign evidence; no local Git writer | IMP-07, IMP-11 |
| Mock drift/approval/conformance | DOM-IMP-10–12 | Preserve cycles, terminal tickets, verdict history | Invalidate affected approvals; no reopen of completed tickets | Link adjustment/substitution and conformance records | IMP-10–12 |

No DOM `RETIREMENT` obligation is validated. Legacy adapter/data retirement
remains with the approved compatibility owner.

## 17. Test Strategy

`LOCAL_TEST_EVIDENCE` is assigned to each unit's executable unit/domain/
application/regression tests. Existing prototype tests are retained as
scenario references and remain explicitly non-productive.

`INTEGRATION_TEST_EVIDENCE` is assigned to CP-DOM-01 through CP-DOM-03 and
covers identity correlation, PLAT/GIT/OPS/BACKEND/UI mappings, stale commands,
publication evidence, compatibility, and preservation boundaries.

`FINAL_CONFORMANCE_EVIDENCE` is owned only by DOM-IMP-12 at CP-DOM-04 and
covers all six AC-DOM-052 dimensions, omissions, extrapolations, remediation
return, and regression results.

Required categories across the plan are: unit, domain invariant, persistence
boundary mapping, application, integration, concurrency/isolation, stale
protection, idempotency/no-duplicate-transition, recovery/round continuation,
compatibility/historical replay, migration-history, regression, conformance,
and API/UI contract mapping. Physical persistence, adapter retry, and external
effect tests execute under their owning SPECs; DOM tests assert only the local
semantic contract.

## 18. Risk Register

| Risk | Cause | Affected units | Mitigation / gate |
|---|---|---|---|
| Duplicate authority | Consumer/projection treated as canonical | IMP-01, 04, 05, 07, 11 | Boundary tests, read-only queries, CP-DOM-02 |
| Stale writes or evidence | Revision/base/head/tree drift accepted | IMP-02, 03, 05, 10, 11 | Atomic rejection and drift matrix tests |
| Identity mismatch | Agent/session/effect/publication IDs collapsed | IMP-01, 02, 11 | Identity catalog and correlation tests |
| Partial migration/history loss | Successor or invalidation overwrites history | IMP-03, 10, 12 | Historical replay fixtures and terminality assertions |
| Idempotency loss | Repeated commands create transitions/effects | IMP-05–07, 09, 11 | Duplicate-command and retry-boundary tests |
| Hidden lifecycle duplication | Operational state becomes functional state | IMP-04, 06, 07 | Separate state-machine proof |
| Compatibility regression | Legacy adapter becomes second authority | IMP-02, 03, 11 | Adapter mapping tests and owner review |
| Downstream-dependent local acceptance | Early AC references future integration | All | Local AC audit; integrated proof only at checkpoints |
| Parallel change collision | Shared domain/event conventions edited concurrently | Waves 2–5 | Coordination and serial checkpoint integration |
| Ambiguous final proof | Multiple units claim conformance closure | IMP-10–12 | AC-DOM-052 final proof owner fixed to IMP-12 |

## 19. Implementation Unit Closure Matrix

| Unit | Independently implementable | Local closure | Issue decomposition readiness | Initial DAG state | Blocked by |
|---|---|---|---|---|---|
| DOM-IMP-01 | YES | YES | ISSUE_READY | READY | — |
| DOM-IMP-02 | YES | YES | ISSUE_READY | BLOCKED | IMP-01 |
| DOM-IMP-03 | YES | YES | ISSUE_READY | BLOCKED | IMP-01, IMP-02 |
| DOM-IMP-04 | YES | YES | ISSUE_READY | BLOCKED | IMP-01 |
| DOM-IMP-05 | YES | YES | ISSUE_READY | BLOCKED | IMP-01, IMP-04 |
| DOM-IMP-06 | YES | YES | ISSUE_READY | BLOCKED | IMP-04, IMP-05 |
| DOM-IMP-07 | YES | YES | ISSUE_READY | BLOCKED | IMP-04, IMP-05 |
| DOM-IMP-08 | YES | YES | ISSUE_READY | BLOCKED | IMP-01, IMP-05 |
| DOM-IMP-09 | YES | YES | ISSUE_READY | BLOCKED | IMP-08 |
| DOM-IMP-10 | YES | YES | ISSUE_READY | BLOCKED | IMP-03, IMP-06 |
| DOM-IMP-11 | YES | YES | ISSUE_READY | BLOCKED | IMP-01, IMP-07 |
| DOM-IMP-12 | YES | YES | ISSUE_READY | BLOCKED | IMP-01–11 |

## 20. Plan Metrics

```text
VALIDATED_GAPS = 21
LOCAL_IMPLEMENTATION_GAPS = 17
CROSS_SPEC_DEPENDENCIES = 7
PREEXISTING_FOREIGN_CAPABILITIES = 0
NO_LOCAL_WORK_GAPS = 0

IMPLEMENTATION_UNITS = 12
LOCALLY_CLOSABLE_UNITS = 12
NON_LOCALLY_CLOSABLE_UNITS = 0

ISSUE_DECOMPOSITION_READY_UNITS = 12
INTERNAL_ONLY_UNITS = 0
PLAN_BLOCKED_UNITS = 0

INITIAL_READY_UNITS = 1
INITIAL_BLOCKED_UNITS = 11

GAPS_WITH_PLAN_COVERAGE = 21
GAPS_WITHOUT_PLAN_COVERAGE = 0

UNITS_WITHOUT_GAP_OR_SUPPORTING_AUTHORITY = 0
FALSE_UNIT_SPLITS = 0
FALSE_UNIT_MERGES = 0

ACCEPTANCE_OBLIGATIONS = 21
ACCEPTANCE_WITH_FINAL_PROOF_OWNER = 21
UNRESOLVED_FINAL_PROOF_OWNERS = 0

LOCAL_AC_REQUIRING_DOWNSTREAM = 0
LOCAL_AC_CONTRADICTING_DOES_NOT_IMPLEMENT = 0
LOCAL_AC_REQUIRING_UNAVAILABLE_FOREIGN_CAPABILITY = 0

UNAPPROVED_NORMATIVE_DEPENDENCIES = 0
SPECIFICATION_GAPS = 0
ARCHITECTURE_GAPS = 0
PORTFOLIO_GAPS = 0
UPSTREAM_CONTRACT_GAPS = 0
DAG_CYCLE_DETECTED = NO
SPECULATIVE_UNITS = 0
LOCAL_AC_SCOPE_CONTRADICTIONS = 0
```

## 21. Authority / Specification Escalations

None. Planning questions are implementation details only. No specification,
architecture, portfolio ownership/dependency, or upstream-contract gap was
discovered. DOM remains the approved DAG root; downstream references do not
become normative prerequisites.

## 22. Implementation Plan Gate

```text
IMPLEMENTATION_PLAN_GATE: READY_FOR_IMPLEMENTATION_PLAN_AUDIT
```

The mandatory next step is independent `audit-component-implementation-plan`.
