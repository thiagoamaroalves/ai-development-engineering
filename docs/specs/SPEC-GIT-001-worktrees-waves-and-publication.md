---
schema_version: "1.0.0"
id: SPEC-GIT-001
title: Worktrees, Waves and Publication
status: PROPOSED
revision: 2
date: 2026-09-09
spec_scope: git-integration-and-publication
portfolio: SPEC-PORTFOLIO-001
portfolio_revision: 2
portfolio_verdict: PORTFOLIO_DECOMPOSITION_APPROVED
portfolio_audit: docs/specs/SPEC-PORTFOLIO-001-decomposition-audit.md
remediation_source_audit: docs/specs/audits/SPEC-GIT-001-component-conformance-audit.md
remediation_report: docs/specs/remediations/SPEC-GIT-001-component-spec-remediation.md
authoritative_adrs: [ADR-0007, ADR-0008]
related_adrs: [ADR-0001, ADR-0002, ADR-0005, ADR-0006, ADR-0009, ADR-0010, ADR-0011, ADR-0012]
upstream_dependencies: [SPEC-DOM-001, SPEC-PLAT-001, SPEC-REPO-001]
supersedes: []
superseded_by: null
---

# SPEC-GIT-001 — Worktrees, Waves and Publication

## 1. Status

`PROPOSED` — remediated from the approved portfolio decomposition and ready
for fresh independent component SPEC re-audit.

Generation baseline:

| Item | Value |
|---|---|
| Target component | `SPEC-GIT-001` |
| Governing portfolio | `SPEC-PORTFOLIO-001`, revision `2` |
| Portfolio audit | `docs/specs/SPEC-PORTFOLIO-001-decomposition-audit.md` |
| Portfolio verdict | `PORTFOLIO_DECOMPOSITION_APPROVED` |
| Primary ADRs | `ADR-0007`, `ADR-0008`, revision `3`, `ACCEPTED` |
| Related ADRs inspected | `ADR-0001`, `ADR-0002`, `ADR-0005`, `ADR-0006`, `ADR-0009`, `ADR-0010`, `ADR-0011`, `ADR-0012` |
| Upstream normative SPECs | `SPEC-DOM-001` rev. 2; `SPEC-PLAT-001` rev. 1; `SPEC-REPO-001` rev. 2 |
| Upstream audit evidence | DOM, PLAT and REPO latest audits report `PASS — COMPONENT_SPEC_CONFORMANT` |
| Repository HEAD inspected | `115607e4d0dc51f509b4fdf78ce4f873f46c3230` |
| Existing target draft | none found |
| Prior Gap Matrix | none found for this component |
| Source conformance audit | `docs/specs/audits/SPEC-GIT-001-component-conformance-audit.md`; `FAIL — COMPONENT_SPEC_NON_CONFORMANT` |
| Working tree note | pre-existing untracked `.codex/` was preserved and is not target implementation evidence |
| Gate | `READY_FOR_INDEPENDENT_COMPONENT_SPEC_REAUDIT` after finding-driven remediation |

This specification materializes ownership already assigned by the approved
portfolio and does not redefine portfolio boundaries. It is not a Gap Matrix,
Implementation Plan, ticket set or production implementation.

## 2. Ownership

### Owns

This component is the single normative owner of:

- the integration branch and isolated ticket worktree/branch boundary;
- audited waves of parallel-ready ticket integration;
- serial integration of the main branch into a SPEC branch without automatic
  rebase or force-push;
- SPEC-scoped commits and milestone commit eligibility;
- protection and revalidation of the exact document candidate tree;
- repository-configured direct-push versus Pull Request publication execution;
- human approval binding, serial publication admission and publication evidence;
- PR protocol validation, remote publication confirmation and post-confirmation
  cleanup.

These are exactly portfolio obligations `O-039` through `O-048`.

### Consumes

- canonical identity, lifecycle, state, publication vocabulary, formal audit
  verdict and exact-basis/conformance contracts from `SPEC-DOM-001`;
- durable intent, evidence, confirmation, idempotency, reconciliation,
  recovery and bounded-attempt contracts from `SPEC-PLAT-001`;
- repository identity, active configuration, publication mode, repository
  enablement and legacy-adapter contracts from `SPEC-REPO-001`;
- application/transport mappings from `SPEC-BACKEND-001` and operational/UI
  projections from their respective owners, without creating a normative
  dependency on those downstream components.

### Does not own

- ticket states, ticket transition semantics, pipeline ordering, publication
  vocabulary or domain approval meaning owned by `SPEC-DOM-001`;
- database, journal, outbox, effect-intent, idempotency-key, reconciliation
  result or restart-recovery semantics owned by `SPEC-PLAT-001`;
- repository configuration, onboarding, enablement, legacy classification or
  repository identity owned by `SPEC-REPO-001`;
- local authentication, API envelopes, frontend controls, operational logs or
  notification behavior;
- implementation classes, modules, commands, routes, storage technology,
  process libraries, branch naming syntax or ticket decomposition.

## 3. Portfolio Authority

| Authority | Revision/status | Use |
|---|---|---|
| `SPEC-PORTFOLIO-001` | revision 2; decomposition audit approved | canonical ownership, dependency and failure/compatibility allocation |
| `O-039…O-048` | portfolio obligation registry | complete owned normative boundary |
| `SPEC-PORTFOLIO-001` section 8.3 | approved DAG | direct dependencies `GIT → DOM`, `GIT → PLAT`, `GIT → REPO` |
| portfolio section 15 | approved failure registry | publication failure ownership and local mappings |
| portfolio section 16 | approved compatibility registry | new path, legacy, replay, cutover and retirement roles |

Authority precedence remains:

```text
accepted ADR
    > approved SPEC portfolio decomposition
    > conformant upstream component SPEC
    > this component SPEC
    > repository implementation
    > tests
    > prototype
    > historical evidence
```

## 4. ADR Authority

### Primary accepted ADRs

| ADR | Relevant sections | Local consequence |
|---|---|---|
| `ADR-0007` | Decisão; Proteção do candidato documental; Consequências | isolated branches/worktrees, parallel work, audited waves, SPEC-scoped commits, main-to-SPEC merge, exact candidate-tree protection, preservation before remote confirmation |
| `ADR-0008` | Decisão; Consequências | configured push/PR mode, human approval, exclusive serial queue, fetch/base validation, idempotent direct push, PR protocol, remote confirmation and cleanup gate |

Both ADRs are `decision_status: ACCEPTED`, revision `3`, and
`implementation_status: UNPROCESSED`. No proposed or superseded ADR is used as
normative authority.

### Related accepted ADRs

| ADR | Consumed boundary |
|---|---|
| `ADR-0001` | canonical identity, immutable snapshots and exact basis remain DOM-owned |
| `ADR-0002` | ticket/state/publication vocabulary and advancement remain DOM-owned |
| `ADR-0005` | serial final merge/publication queue and distinct dependency/file-conflict semantics |
| `ADR-0006` | intent/evidence/idempotency/reconciliation remain PLAT-owned |
| `ADR-0009` | independent audit verdicts and exact conformance basis |
| `ADR-0010` | repository-configured publication mode and enabled repository basis |
| `ADR-0011` | application/transport mapping remains BACKEND-owned |
| `ADR-0012` | `gh` authentication is reused; credentials are not copied into persistence |

## 5. Problem Statement

The accepted architecture requires parallel ticket work to converge through
isolated worktrees and audited waves, then requires a conformant SPEC candidate
to reach the remote repository through a controlled, human-approved and serial
publication protocol. The candidate must remain bound to the exact base, head,
tree and conformance evidence on which approval was issued.

The repository currently contains Git metadata and a disposable React/TypeScript
prototype, but no productive worktree manager, wave integrator, Git adapter,
`gh` integration, publication queue or remote-evidence reconciler. The
prototype models publication scenarios and guards in memory; it does not prove
real branch isolation, concurrent integration, remote state, idempotent push,
PR merge protocol or cleanup safety.

Without this boundary, a stale approval could publish a different tree, a PR
could be treated as completion before remote confirmation, parallel waves could
integrate incomplete work, or a failed push could trigger destructive recovery.
Satisfying this SPEC enables exact, auditable integration and publication while
leaving canonical domain state, durable effect semantics and repository
enablement with their approved owners.

## 6. Goals

- Every SPEC has one integration branch and every ticket has one isolated
  branch/worktree identity.
- Parallel-ready work is admitted only through complete, independently audited
  waves; file conflicts remain distinct from dependency, capacity and cycle
  blocking.
- The SPEC branch is updated from the current main branch by merge, preserving
  audited commit identity and without automatic rebase or force-push.
- Every commit is attributable to exactly one SPEC and satisfies the applicable
  milestone rule.
- Publication approval is bound to the exact candidate identity, base/head/tree
  and conformance evidence, with drift failing closed.
- Direct-push and Pull Request modes both use an exclusive serial queue and
  complete only after `REMOTE_PUBLICATION_CONFIRMED`.
- Failed, paused or unconfirmed publication preserves recoverable resources;
  cleanup occurs only after remote confirmation.

## 7. Non-Goals

- Defining domain ticket state machines, publication vocabulary or approval
  meaning; those are consumed from `SPEC-DOM-001`.
- Defining durable intent, outbox, idempotency, reconciliation classes or
  restart recovery; those are consumed from `SPEC-PLAT-001`.
- Defining repository registration, enablement, legacy migration or repository
  identity; those are consumed from `SPEC-REPO-001`.
- Defining backend routes/envelopes, UI behavior, operational retention,
  notifications or security policy.
- Choosing Git/`gh` libraries, process orchestration, storage technology,
  branch-name syntax, directory layout or cleanup implementation.
- Defining implementation phases, tickets, commits for this SPEC or a future
  Gap Matrix/Implementation Plan.

## 8. Current Repository State

| Area | Current behavior | Target behavior | Classification |
|---|---|---|---|
| ADR and portfolio authority | ADR-0007/0008 are accepted; Gate A audit approves the portfolio | Consume accepted authority and O-039…O-048 without reallocation | `ALREADY_CONFORMANT` |
| Upstream component contracts | DOM, PLAT and REPO documents exist and their latest audits pass | Consume their canonical contracts without redefining them | `ALREADY_CONFORMANT` |
| Target component SPEC | No `SPEC-GIT-001` file existed before this generation | Independently auditable GIT boundary | `SPECIFICATION_GAP` |
| Productive worktree/branch isolation | No orchestrator worktree or branch adapter exists | Enforced per-SPEC and per-ticket isolation | `IMPLEMENTATION_GAP` |
| Waves and integration | Prototype models a conflict scenario and wave transitions in memory | Audited complete waves with explicit admission and conflict handling | `PROTOTYPE_ONLY` / `IMPLEMENTATION_GAP` |
| SPEC-scoped commits | No productive commit policy enforcer exists | Commit scope and milestone eligibility are checked before commit | `IMPLEMENTATION_GAP` |
| Candidate tree protection | Prototype stores candidate/base/head/tree fields and tests drift guards | Exact candidate hash is revalidated before documentary commit and publication | `PROTOTYPE_ONLY` / `IMPLEMENTATION_GAP` |
| Direct push and PR publication | Prototype simulates both modes; no GitHub/`gh` adapter exists | Configured mode executes through serial queue with evidence and confirmation | `PROTOTYPE_ONLY` / `IMPLEMENTATION_GAP` |
| Upstream persistence/effect boundary | No productive database, journal, outbox or effect adapter exists | Consume PLAT intent/evidence/idempotency/reconciliation contracts | `IMPLEMENTATION_GAP` |
| Repository configuration boundary | No productive repository registry or publication-mode validator exists | Consume REPO active configuration and enabled-repository basis | `IMPLEMENTATION_GAP` |
| Prototype tests | `prototype/tests/*` exercise deterministic mock publication and UI guards | Independent conformance against productive adapters and remote evidence | `PROTOTYPE_ONLY` |
| Architecture/ownership | Approved portfolio and ADRs allocate the boundary; no contradiction found | Preserve the allocation | `NON_GAP` |

The prototype is supporting evidence only. Its publication state and tests do
not establish production Git/GitHub integration, durable evidence,
concurrency, security or authority.

## 9. Owned Architectural Obligations

| Portfolio obligation | ADR authority | Source section | Local treatment |
|---|---|---|---|
| `O-039` | `ADR-0007` | Decisão | `GIT-BRANCH-001`: one integration branch per SPEC |
| `O-040` | `ADR-0007` | Decisão | `GIT-WORKTREE-001`: one isolated branch/worktree per ticket |
| `O-041` | `ADR-0007` | Decisão | `GIT-WAVE-001`: parallel-ready tickets integrate only in audited waves |
| `O-042` | `ADR-0007` | Decisão | `GIT-INTEGRATION-001`: merge main into SPEC branch; no automatic rebase/force-push |
| `O-043` | `ADR-0007` | Decisão | `GIT-COMMIT-001`: one-SPEC commit ownership and milestone rules |
| `O-044` | `ADR-0007` | Proteção do candidato documental | `GIT-CANDIDATE-001`: protect/revalidate candidate tree and retain resources |
| `O-045` | `ADR-0008` | Decisão | `GIT-MODE-001`: repository-configured direct-push or PR mode |
| `O-046` | `ADR-0008` | Decisão | `GIT-APPROVAL-001`: exact human approval and serial idempotent push |
| `O-047` | `ADR-0008` | Decisão | `GIT-PR-001`: exact PR base/head/mergeability/check/tree protocol |
| `O-048` | `ADR-0008` | Decisão | `GIT-CONFIRM-001`: merged/remote confirmation and cleanup gate |

Every owned obligation is represented by a normative requirement, acceptance
criterion and conformance coverage below.

## 10. Consumed Contracts

| Owner SPEC | Contract / requirement | Why consumed | Local rule |
|---|---|---|---|
| `SPEC-DOM-001` | `DOM-ID-001`, `DOM-SNAPSHOT-001` | candidate, SPEC, ticket, wave, commit and publication identities require canonical lineage and immutable execution basis | reference canonical IDs and snapshot values; do not derive authority from paths, labels or mutable status |
| `SPEC-DOM-001` | `DOM-PUB-001`, `DOM-ADV-001` | publication states and advancement gates are domain-owned | execute only the allowed domain command/state contract; GIT supplies execution evidence, not vocabulary or approval meaning |
| `SPEC-DOM-001` | `DOM-AUDIT-002`, `DOM-AUDIT-006` | structured audit verdict and exact basis authorize publication | accept only the formal verdict and exact base/head/tree/conformance binding; no process exit or UI state substitutes for it |
| `SPEC-PLAT-001` | `PLAT-EFFECT-001`, `PLAT-EFFECT-002` | Git/push/PR effects need durable intent before execution and evidence before confirmation | emit effect requests/evidence through PLAT; GIT does not create a second persistence or confirmation authority |
| `SPEC-PLAT-001` | `PLAT-IDEMP-001`, `PLAT-RECON-001/002/003` | retries and Git/database divergence need deterministic replay and approved reconciliation | reuse the same effect key, reconcile evidence first and surface human decisions without translating PLAT results into publication success |
| `SPEC-PLAT-001` | `PLAT-RECOVERY-001/002`, `PLAT-RETRY-001/002` | interruption, restart, pause and cancellation must preserve safe publication state | resume from persisted checkpoint/evidence and bounded cooperative attempts; status alone is never completion |
| `SPEC-REPO-001` | `REPO-CONFIG-001/002`, `REPO-VALIDATE-001/002` | publication strategy and repository basis are configuration-owned | consume the active enabled repository configuration; reject absent, stale, dirty or diverged basis and do not correct it destructively |
| `SPEC-REPO-001` | `REPO-ENABLE-001/002`, `REPO-FAILURE-001`, `REPO-CUTOVER-001` | publication may run only for an enabled repository and legacy path remains an adapter | preserve repository failure semantics and legacy mapping; do not enable, migrate or retire repository state locally |

Consumed failures retain their canonical owners:

| Failure | Canonical owner | GIT behavior |
|---|---|---|
| `UNKNOWN_REPOSITORY`, `REPOSITORY_NOT_ENABLED` | `SPEC-REPO-001` | propagate unchanged to the application mapping; do not start Git effects |
| `UNKNOWN_SPEC`, `INELIGIBLE_REVISION`, `STALE_REVISION` | `SPEC-DOM-001` | reject the candidate and preserve evidence; do not create a publication candidate |
| `INVALID_DEPENDENCY_CLOSURE` | `SPEC-DOM-001` | keep the wave/publication blocked; do not reinterpret it as a file conflict |
| `EXPECTED_INCOMPLETE_EFFECT`, `MISSING_EFFECT`, `SEMANTIC_DIVERGENCE`, `CONFLICTING_EFFECT` | `SPEC-PLAT-001` | enter the PLAT reconciliation path; do not silently retry or mark publication confirmed |
| `UNAUTHORIZED_LOCAL_SESSION` | `SPEC-BACKEND-001` | propagate the mapped failure; do not copy or persist credentials |

## 11. Target Behavioral Model

```text
enabled repository configuration + canonical SPEC/ticket snapshot
    ↓
isolated ticket branches/worktrees + SPEC integration branch
    ↓
ready-ticket set + dependency/conflict/capacity checks
    ↓
audited complete wave → serial integration candidate
    ↓
main merged into SPEC branch → exact conformance/candidate evidence
    ↓
human approval → exclusive publication queue
    ├─ direct-push mode: local merge → controlled idempotent push
    └─ PR mode: create/update PR → validate → remote merge
    ↓
publication evidence + remote confirmation
    ↓
domain state advances and resources may be cleaned up
```

The local GIT behavior produces and verifies integration/publication evidence.
DOM owns the domain state transition; PLAT owns durable effect intent,
evidence, confirmation and reconciliation; REPO supplies the enabled
configuration and publication mode.

## 12. Identity and Authority Rules

| Identity/value | Canonical owner | Reference identity | Local correlation | Derived projection |
|---|---|---|---|---|
| `RepositoryId` | `SPEC-DOM-001` | repository target | publication/effect correlation | name/path/remote display |
| `SpecId` and SPEC revision | `SPEC-DOM-001` | candidate scope | branch/worktree/effect correlation | label in operational views |
| `TicketId` | `SPEC-DOM-001` | isolated work item | ticket branch/worktree correlation | ticket row/status |
| `WaveId` | `SPEC-DOM-001` | canonical wave scope from the domain snapshot | integration correlation | wave dashboard |
| commit identity | Git provider/effect evidence, correlated by GIT | exact commit SHA | effect/queue correlation | abbreviated SHA |
| `DocumentCandidateTreeHash` | GIT for candidate protection, bound to DOM conformance evidence | exact candidate content | documentary/publication correlation | diff/hash display |
| `PublicationId` and publication vocabulary | `SPEC-DOM-001` | canonical publication lifecycle | GIT effect correlation | backend/UI publication view |
| publication evidence | `SPEC-GIT-001` | base/head/tree/PR/remote evidence | PLAT effect correlation | OPS/UI evidence projection |

GIT must not create a competing repository, SPEC, ticket, publication or
domain-state identity. A branch name, worktree path, PR number, remote ref,
commit message or UI label is only a reference or projection unless the owner
contract explicitly identifies it as evidence.

## 13. Normative Requirements

### GIT-BRANCH-001 — SPEC integration branch

For every eligible SPEC, the component MUST maintain one identifiable
integration branch associated with the canonical `SpecId` and execution basis.
Publication or ticket work MUST NOT use an unassociated branch as the SPEC
integration authority.

Authority: `O-039`, `ADR-0007`, `Decisão`.

### GIT-WORKTREE-001 — Isolated ticket workspaces

For every ticket admitted to work, the component MUST associate exactly one
ticket branch and isolated worktree with the canonical `TicketId` and SPEC
integration branch. Two tickets MUST NOT share an active worktree or branch
identity. Releasing either resource before remote integration confirmation is
forbidden.

Authority: `O-040`, `ADR-0007`, `Decisão`.

### GIT-WAVE-001 — Complete audited waves

The component MUST admit a wave only when every ticket required by that wave is
individually approved and its dependency closure is valid. Tickets may execute
in parallel, but wave integration MUST wait for the complete applicable set and
an independent integration audit. Cancellation of a ticket or wave MUST require
an audited review of the affected DAG before the cancellation is accepted. A
conflict MUST be resolved by an exclusive resolver and independently audited.
The next wave MUST use only the base produced by the previously integrated and
approved wave. Capacity, dependency, cycle and file-conflict blocking MUST
remain distinguishable.

Authority: `O-041`, `ADR-0007`, `Decisão`; consumes `DOM-ADV-001`.

### GIT-INTEGRATION-001 — Main-to-SPEC merge without destructive rewriting

Before final SPEC integration, the component MUST merge the validated current
main branch into the SPEC integration branch. It MUST preserve existing commit
hashes and MUST NOT automatically rebase, force-push, reset, discard or stash
to hide divergence. A conflict MUST enter the approved exclusive conflict
resolution and audit path; an unresolved conflict MUST block integration.

Authority: `O-042`, `ADR-0007`, `Decisão`; consumes `REPO-VALIDATE-002` and
`PLAT-RECON-001/002`.

### GIT-COMMIT-001 — SPEC-scoped commits and milestones

Every commit produced or accepted by this component MUST belong to exactly one
SPEC. The component MUST reject a commit whose changes mix SPEC ownership,
contain a file outside the owning SPEC boundary, or whose milestone is not
permitted by the applicable audited lifecycle. The exact milestone sequence is:
(1) accepted ADRs are already committed; (2) one documentary commit follows
approval of the SPEC, Gap Matrix, Implementation Plan and tickets; (3) each
individual implementation commit follows its ticket audit; (4) each ticket
finalization commit follows wave integration/audit, and READY changes whose
last blocker that finalization removes belong to that commit; and (5) one final
commit contains approved conformance remediations. No commit may claim a later
milestone without its required audit evidence.

Authority: `O-043`, `ADR-0007`, `Decisão`; consumes `DOM-AUDIT-002`.

### GIT-CANDIDATE-001 — Exact candidate protection and retention

The component MUST bind `DocumentCandidateTreeHash` and publication evidence
to the exact SPEC, Gap Matrix, Implementation Plan, tickets, approval basis and
commit/tree under evaluation. It MUST recalculate and compare the candidate
tree immediately before the protected documentary commit and before any
publication action. Any mismatch MUST invalidate the affected approval and
return the candidate to the applicable audit/conformance path. The protected
documentary commit MUST contain no file outside the SPEC boundary. Branches,
worktrees and other required resources MUST remain retained until remote
publication confirmation.

Authority: `O-044`, `ADR-0007`, `Proteção do candidato documental`; consumes
`DOM-AUDIT-006` and `PLAT-EFFECT-002`.

### GIT-MODE-001 — Configured publication mode

For an enabled repository, the component MUST use the publication strategy in
the active versioned repository configuration: controlled direct push or Pull
Request. It MUST NOT silently switch modes, invent a second canonical path or
treat legacy compatibility behavior as a second publication authority.

Authority: `O-045`, `ADR-0008`, `Decisão`; consumes `REPO-CONFIG-001/002` and
`REPO-ENABLE-001`.

### GIT-APPROVAL-001 — Exact human approval and serial direct push

Publication MUST require human approval bound to the exact conformant
candidate, base/head/tree, relevant checks and publication identity. After
approval, the component MUST acquire the exclusive serial publication queue,
fetch and revalidate the main basis, merge the validated SPEC branch locally
into main, and perform direct push as a controlled, idempotent operation only
when the validated basis remains current. If the basis, local merge result or
candidate changes, approval MUST be invalidated and publication MUST not
proceed. A failed push MUST preserve the local merge/effect evidence for PLAT
reconciliation and MUST NOT trigger destructive reset.

Authority: `O-046`, `ADR-0008`, `Decisão`; consumes `DOM-PUB-001`,
`DOM-AUDIT-006`, `PLAT-IDEMP-001` and `PLAT-RECON-001/002`.

### GIT-PR-001 — Pull Request protocol and drift invalidation

In Pull Request mode, before authorizing merge the component MUST, within the
exclusive serial queue, verify the expected base SHA, head SHA, mergeability,
required checks and candidate tree. If the main branch changes, the PR is
externally merged, the checks/basis drift, or the resulting tree differs from
the conformant candidate, the approval MUST become invalid and the component
MUST require reconciliation and renewed conformance. PR creation or a closed
PR without merge MUST NOT be treated as completion.

Authority: `O-047`, `ADR-0008`, `Decisão`; consumes `DOM-AUDIT-006`,
`PLAT-RECON-001/002` and `REPO-CONFIG-001`.

### GIT-CONFIRM-001 — Remote confirmation and cleanup gate

Publication MUST complete only after remote confirmation is correlated to the
same publication identity and exact candidate. In direct-push mode this means
the controlled push evidence plus `REMOTE_PUBLICATION_CONFIRMED`; in PR mode it
means both `PR_MERGED` and `REMOTE_PUBLICATION_CONFIRMED`. `PR_MERGED` alone
MUST NOT complete the SPEC. Branches, worktrees and publication resources MUST
be cleaned only after confirmation; an unconfirmed, failed or cancelled
operation MUST retain them for recovery/reconciliation.

Authority: `O-048`, `ADR-0008`, `Decisão`; consumes `DOM-PUB-001`,
`PLAT-EFFECT-002`, `PLAT-RECOVERY-001/002`.

## 14. Commands / Queries / Events

GIT does not own canonical domain commands. Its local integration boundary
accepts application requests mapped by BACKEND and validates them against
DOM-owned states and preconditions.

| Class | Local role | Authority rule |
|---|---|---|
| `APPLICATION_COMMAND` | request integration, approve publication, retry reconciliation or confirm remote evidence | request is mapped/authorized by BACKEND; GIT validates local publication contract without redefining domain meaning |
| `CANONICAL_DOMAIN_COMMAND` | consumed | `SPEC-DOM-001` owns trigger, preconditions, state and terminality |
| `INTEGRATION_EVENT` | owned when it records Git/publication evidence such as candidate invalidation, local integration, PR merge or remote confirmation | event meaning is GIT publication evidence; durable intent/effect record remains PLAT-owned |
| `TRANSPORT_EVENT` | consumed/mapped | BACKEND owns transport representation; transport visibility cannot confirm publication |
| `QUERY` | expose current correlated branch/worktree/wave/candidate/publication evidence | query is a projection of canonical/effect records and cannot authorize or complete publication |

## 15. Failure Semantics

### Owned canonical failures

| Failure | Trigger | Meaning | Retry/recovery | Required evidence |
|---|---|---|---|---|
| `PUBLICATION_DRIFT` | candidate base/head/tree, checks, approval or resulting tree differs from the bound candidate | the prior publication approval is no longer valid | no automatic publication; reconcile basis and require renewed conformance/approval | old/new base, head, tree, checks, candidate and conformance identities |
| `MERGE_CONFLICT` | required Git merge or wave integration cannot produce a valid candidate without conflict resolution | integration cannot proceed under the current basis | exclusive conflict resolver and independent audit; no silent skip or destructive reset | conflicting refs, affected wave/tickets, resolver identity, resulting tree and audit verdict |
| `REMOTE_PUBLICATION_UNCONFIRMED` | push/PR result cannot be correlated to the expected remote ref and candidate | remote completion is unknown, not successful | preserve local evidence/resources and use PLAT reconciliation; do not mark complete | provider response, expected/observed refs, candidate identity and effect key |

These meanings, terminality and recovery ownership are canonical. BACKEND may
map them for transport, OPS may log them, and UI may present them, but none may
translate them into a different canonical failure.

### Consumed failures

GIT propagates REPO, DOM, PLAT and BACKEND-owned failures listed in section 10.
In particular, `MISSING_EFFECT`, `SEMANTIC_DIVERGENCE` and
`CONFLICTING_EFFECT` remain PLAT reconciliation results, while
`INVALID_DEPENDENCY_CLOSURE` remains a DOM dependency failure rather than a
GIT merge conflict.

## 16. Retry / Idempotency / Recovery

- Canonical effect intent, deterministic key generation, evidence ordering and
  reconciliation remain PLAT-owned.
- GIT MUST reuse the same PLAT effect key for a retry of the same publication
  candidate; it MUST NOT create a new publication identity merely because a
  process restarted.
- Before retrying push, PR creation/update, merge or cleanup, GIT MUST
  reconcile available remote and local evidence. Unknown or divergent evidence
  follows PLAT reconciliation and may require a human decision.
- Operational retries are bounded and cooperative under
  `PLAT-RETRY-001/002`. Pause, cancellation and shutdown preserve the candidate,
  branch/worktree and durable evidence until a safe checkpoint is recorded.
- A status field, process exit, open PR or local merge is not confirmation.
  Confirmation requires the exact evidence described in `GIT-CONFIRM-001`.

## 17. Compatibility / Cutover

| Class | GIT role | Normative rule |
|---|---|---|
| `NEW_CANONICAL_PATH` | `OWNER` (`O-039`, `O-045`) | new worktree/integration/publication behavior is the sole canonical GIT path |
| `LEGACY_COMPATIBILITY` | `OWNER` for GIT-side adaptation (`O-044`, `O-045`); REPO remains owner of legacy repository semantics | legacy publication inputs may be adapted to the new path but never become a second authority |
| `HISTORICAL_REPLAY` | `OWNER` (`O-044`) | replay preserves historical candidate/tree/evidence identities and does not rewrite history |
| `CUTOVER` | `OWNER` (`O-048`) | cutover is complete only after remote confirmation bound to the exact candidate |
| `RETIREMENT` | `OWNER` (`O-044`, `O-048`) | branch/worktree/resource retirement waits for confirmation and preserved evidence |

No implementation phases are defined here. Historical artifacts remain
immutable; a changed candidate creates a new evidence/approval basis.

## 18. Projection Boundaries

| Item | Rule |
|---|---|
| Canonical source | GIT publication evidence is the source for Git/remote integration facts; DOM remains source for domain publication vocabulary/state; PLAT remains source for durable effect status |
| Projection | BACKEND, OPS and UI may project branch, wave, PR, evidence and confirmation records |
| Refresh/replay | projections refresh from correlated canonical/effect evidence and replay by identity; they do not synthesize missing confirmation |
| Stale behavior | stale base/head/tree/check/evidence is shown as stale and blocks action until revalidation |
| Authority limit | a query result, log, dashboard, PR display, local status or mock state cannot authorize, complete or retire publication |

## 19. External Effects

| Semantic | Owner/rule |
|---|---|
| Request | BACKEND maps an application request; DOM owns domain command meaning |
| Intent | PLAT persists intent and idempotency basis before Git/`gh` execution |
| External execution | GIT invokes the configured local Git/GitHub integration for branch, worktree, merge, push and PR operations |
| Evidence | GIT owns publication evidence for observed Git/remote facts; PLAT owns durable effect evidence records |
| Confirmation | GIT verifies remote confirmation and correlates it to the exact candidate; DOM consumes the resulting publication contract |
| Reconciliation | PLAT owns Git/database/effect divergence classification and recovery decision; GIT supplies observations and performs authorized corrective effects |
| Projection | BACKEND/OPS/UI expose mapped records without becoming authority |

An external command returning success is not, by itself, canonical publication
confirmation. An adapter may be replaced while preserving these semantics.

## 20. Security / Authorization

- Repository authorization and enabled-repository scope are consumed from
  `SPEC-REPO-001` and the local session boundary from `SPEC-BACKEND-001`.
- GIT MUST reuse the existing `gh` authentication boundary as authorized; it
  MUST NOT copy tokens, credentials or secrets into repository state, journal
  payloads or logs.
- Human publication approval is a distinct authorization event bound to the
  exact candidate; a UI click, API request or local process exit is not enough
  unless the owning authorization contract accepts and records it.
- GIT MUST fail closed when the repository is unknown/disabled, the local
  session is unauthorized, approval is stale, or candidate evidence is
  incomplete.

## 21. Conformance Suite

The independent audit must prove the following against productive adapters and
correlated evidence, not only the prototype.

### Positive

- `C-GIT-001`: one SPEC receives one integration branch and canonical lineage.
- `C-GIT-002`: two tickets receive distinct branches and worktrees.
- `C-GIT-003`: a complete approved wave integrates only after all applicable
  tickets and its integration audit are present.
- `C-GIT-030`: cancellation is rejected without audited DAG review, conflicts
  require an exclusive resolver plus independent audit, and a next wave is
  rejected unless its base is the prior integrated approved wave.
- `C-GIT-004`: main is merged into the SPEC branch with existing hashes
  preserved and no automatic rebase/force-push.
- `C-GIT-005`: a valid commit is attributed to exactly one SPEC and an allowed
  milestone.
- `C-GIT-006`: unchanged candidate tree passes immediate pre-commit and
  pre-publication revalidation.
- `C-GIT-007`: configured direct-push mode acquires the serial queue and
  reaches remote confirmation with the same candidate/effect identity.
- `C-GIT-008`: configured PR mode validates base/head/mergeability/check/tree,
  observes `PR_MERGED`, then confirms the remote publication.

### Negative and fail-closed

- `C-GIT-009`: a shared ticket worktree/branch is rejected.
- `C-GIT-010`: an incomplete wave or invalid dependency closure cannot integrate.
- `C-GIT-011`: unresolved file conflict cannot be silently skipped or reset.
- `C-GIT-012`: a mixed-SPEC commit is rejected.
- `C-GIT-031`: commit admission rejects an invalid milestone sequence,
  misplaces READY changes, or accepts a ticket finalization without its required
  audit evidence.
- `C-GIT-013`: candidate tree drift invalidates approval and blocks publication.
- `C-GIT-032`: the documentary commit is rejected when any file lies outside
  the owning SPEC boundary.
- `C-GIT-014`: changed main base invalidates direct-push approval.
- `C-GIT-015`: PR drift, failed checks, external merge or result-tree mismatch
  invalidates the verdict and requires renewed conformance.
- `C-GIT-016`: PR creation, PR closure without merge, local merge or process
  success does not complete publication.
- `C-GIT-017`: failed push preserves evidence and does not perform destructive
  reset, discard, stash or force-push.
- `C-GIT-033`: direct-push publication is rejected unless the validated SPEC
  branch is first merged locally into main inside the exclusive queue.
- `C-GIT-018`: unknown/disabled repository, unauthorized session or missing
  approval fails closed.

### Boundary isolation

- `C-GIT-019`: GIT does not redefine DOM ticket states, transition rules,
  publication vocabulary or approval meaning.
- `C-GIT-020`: GIT does not redefine PLAT intent, idempotency, reconciliation
  results or restart recovery.
- `C-GIT-021`: GIT does not redefine REPO identity, configuration, enablement or
  legacy classification.
- `C-GIT-022`: a projection, PR display, UI action, log or mock state cannot
  become canonical publication authority.
- `C-GIT-023`: a transport mapping cannot change `PUBLICATION_DRIFT`,
  `MERGE_CONFLICT` or `REMOTE_PUBLICATION_UNCONFIRMED` meaning.

### Dependency, compatibility and recovery

- `C-GIT-024`: all three normative edges match the approved portfolio DAG and
  no downstream component is required to define GIT behavior.
- `C-GIT-025`: legacy adaptation uses the new canonical path and historical
  candidate/evidence records are not rewritten.
- `C-GIT-026`: retry reuses the same PLAT effect key and reconciles evidence
  before executing again.
- `C-GIT-027`: pause, cancellation and restart retain recoverable resources
  until a safe checkpoint or remote confirmation exists.
- `C-GIT-028`: cleanup is impossible before remote confirmation.

### Synthetic extensibility

- `C-GIT-029`: a synthetic repository with the same configured direct-push/PR
  contract can be integrated without changing canonical publication semantics,
  while an unsupported mode fails closed rather than receiving a fallback.

## 22. Acceptance Criteria

| ID | Binary criterion |
|---|---|
| `AC-GIT-001` | Given an eligible SPEC, exactly one associated integration branch is recorded and usable. |
| `AC-GIT-002` | Given two active tickets, their branch/worktree identities are distinct; sharing either is rejected. |
| `AC-GIT-003` | Given one unapproved or unresolved ticket in a wave, wave integration is rejected and no ticket is silently skipped. |
| `AC-GIT-017` | Given a cancellation without audited DAG review, a conflict without independent audit, or a next wave based on an unapproved integration, the operation is rejected. |
| `AC-GIT-004` | Given a current main branch, updating the SPEC branch preserves prior commit hashes and performs no automatic rebase, force-push, reset, discard or stash. |
| `AC-GIT-005` | Given a mixed-SPEC change set, commit admission is rejected. |
| `AC-GIT-018` | Given an invalid documentary, implementation, ticket-finalization or remediation milestone, including misplaced READY changes, commit admission is rejected. |
| `AC-GIT-019` | Given a documentary commit containing any file outside the owning SPEC boundary, commit admission is rejected. |
| `AC-GIT-006` | Given any candidate base/head/tree drift, the bound approval becomes invalid and publication is blocked. |
| `AC-GIT-007` | Given direct-push mode and unchanged exact basis, publication uses the exclusive queue and confirms the same candidate identity remotely. |
| `AC-GIT-020` | Given direct-push mode, publication is rejected unless the validated SPEC branch is merged locally into main after queue/basis validation and before push. |
| `AC-GIT-008` | Given PR mode, `PR_MERGED` without `REMOTE_PUBLICATION_CONFIRMED` leaves the SPEC incomplete. |
| `AC-GIT-009` | Given a failed push, local evidence and resources remain available for reconciliation and no destructive reset occurs. |
| `AC-GIT-010` | Given an unknown/disabled repository or unauthorized session, no Git/`gh` effect starts. |
| `AC-GIT-011` | Given a stale PR base/head/check/tree or result-tree mismatch, merge authorization is invalidated and renewed conformance is required. |
| `AC-GIT-012` | Given an unconfirmed or cancelled publication, branch/worktree cleanup is rejected. |
| `AC-GIT-013` | Given a retry of the same publication candidate, the PLAT effect key and publication identity are reused. |
| `AC-GIT-014` | Given a projection or transport mapping mutation, canonical publication failure meaning and completion state remain unchanged. |
| `AC-GIT-015` | Given a legacy publication input, it is adapted to the new canonical path without creating a second authority or rewriting historical evidence. |
| `AC-GIT-016` | Given an unsupported publication mode, the operation fails closed without silent fallback. |

## 23. ADR / Obligation / Requirement Traceability

| Requirement | Portfolio obligation | ADR | ADR section | Ownership role | Acceptance / test |
|---|---|---|---|---|---|
| `GIT-BRANCH-001` | `O-039` | `ADR-0007` | Decisão | canonical owner | `AC-GIT-001`; `C-GIT-001` |
| `GIT-WORKTREE-001` | `O-040` | `ADR-0007` | Decisão | canonical owner | `AC-GIT-002`; `C-GIT-002`, `C-GIT-028` |
| `GIT-WAVE-001` | `O-041` | `ADR-0007` | Decisão | canonical owner | `AC-GIT-003`, `AC-GIT-017`; `C-GIT-003`, `C-GIT-010`, `C-GIT-030` |
| `GIT-INTEGRATION-001` | `O-042` | `ADR-0007` | Decisão | canonical owner | `AC-GIT-004`; `C-GIT-004`, `C-GIT-011` |
| `GIT-COMMIT-001` | `O-043` | `ADR-0007` | Decisão | canonical owner | `AC-GIT-005`, `AC-GIT-018`; `C-GIT-005`, `C-GIT-012`, `C-GIT-031` |
| `GIT-CANDIDATE-001` | `O-044` | `ADR-0007` | Proteção do candidato documental | canonical owner | `AC-GIT-006`, `AC-GIT-019`; `C-GIT-006`, `C-GIT-013`, `C-GIT-025`, `C-GIT-032` |
| `GIT-MODE-001` | `O-045` | `ADR-0008` | Decisão | canonical owner | `AC-GIT-016`; `C-GIT-029` |
| `GIT-APPROVAL-001` | `O-046` | `ADR-0008` | Decisão | canonical owner | `AC-GIT-007`, `AC-GIT-009`, `AC-GIT-020`; `C-GIT-007`, `C-GIT-014`, `C-GIT-017`, `C-GIT-033` |
| `GIT-PR-001` | `O-047` | `ADR-0008` | Decisão | canonical owner | `AC-GIT-011`; `C-GIT-008`, `C-GIT-015` |
| `GIT-CONFIRM-001` | `O-048` | `ADR-0008` | Decisão | canonical owner | `AC-GIT-008`, `AC-GIT-012`; `C-GIT-016`, `C-GIT-028` |

```text
REQUIREMENTS_WITHOUT_PORTFOLIO_OBLIGATION = 0
OWNED_OBLIGATIONS_WITHOUT_REQUIREMENT = 0
```

## 24. Known Gap Summary

| Gap subject | Classification | Related requirement | Evidence |
|---|---|---|---|
| Target GIT component SPEC was absent before this generation | `SPECIFICATION_GAP` (closed by this generation) | all `GIT-*` | no target file existed before this generation |
| Productive branch/worktree and wave orchestration absent | `IMPLEMENTATION_GAP` | `GIT-BRANCH-001`, `GIT-WORKTREE-001`, `GIT-WAVE-001` | no production orchestrator source; only prototype scenarios |
| Productive commit-scope and candidate-hash enforcement absent | `IMPLEMENTATION_GAP` | `GIT-COMMIT-001`, `GIT-CANDIDATE-001` | no adapter/enforcer; prototype fields/tests are in-memory |
| Productive GitHub/`gh`, serial queue and remote confirmation absent | `IMPLEMENTATION_GAP` | `GIT-MODE-001`, `GIT-APPROVAL-001`, `GIT-PR-001`, `GIT-CONFIRM-001` | `prototype/README.md` states Git/GitHub are simulated and no external integration executes |
| Durable publication intent/evidence/reconciliation absent | `IMPLEMENTATION_GAP` | consumed PLAT contracts; `GIT-APPROVAL-001`, `GIT-CONFIRM-001` | no database, journal, outbox or effect adapter in repository |
| Prototype publication scenarios and tests | `PROTOTYPE_ONLY` | all publication requirements | `prototype/src/mockDomain.ts:910-917`; `prototype/tests/mockDomain.test.ts:452-503` |
| Upstream component contracts | `ALREADY_CONFORMANT` | consumed contracts | latest DOM, PLAT and REPO independent audits pass |
| Architecture gap | `NON_GAP` | all | accepted ADRs and approved portfolio allocate the boundary; no unresolved decision |

This is a known-divergence summary only. The formal Gap Matrix remains a
downstream artifact and is not generated here.

## 25. Dependencies

| Dependency SPEC | Contract consumed | Blocking? | Evidence |
|---|---|---|---|
| `SPEC-DOM-001` | identity, immutable snapshot, publication vocabulary, audit verdict, exact conformance basis | Yes | approved portfolio edge `GIT → DOM`; audit `PASS — COMPONENT_SPEC_CONFORMANT` |
| `SPEC-PLAT-001` | intent/evidence/confirmation, deterministic idempotency, reconciliation, recovery and bounded retry | Yes | approved portfolio edge `GIT → PLAT`; audit `PASS — COMPONENT_SPEC_CONFORMANT` |
| `SPEC-REPO-001` | enabled repository configuration, publication mode, validation and legacy adaptation | Yes | approved portfolio edge `GIT → REPO`; audit `PASS — COMPONENT_SPEC_CONFORMANT` |

No new normative dependency is introduced. BACKEND, OPS and UI are consumers
or mappings only; no downstream authority is required to define this SPEC.

## 26. Risks

| Risk | Mitigation / conformance |
|---|---|
| stale candidate is published | `GIT-CANDIDATE-001`; `C-GIT-006`, `C-GIT-013`, `C-GIT-015` |
| direct push and PR become two canonical paths | `GIT-MODE-001`; `C-GIT-024`, `C-GIT-029` |
| PR merge or local status is mistaken for remote completion | `GIT-CONFIRM-001`; `C-GIT-008`, `C-GIT-016`, `C-GIT-028` |
| retry duplicates a Git effect | consume PLAT idempotency/reconciliation; `C-GIT-026` |
| file conflict is confused with dependency/capacity blocking | `GIT-WAVE-001`; `C-GIT-003`, `C-GIT-010`, `C-GIT-011` |
| destructive recovery loses audited resources | `GIT-INTEGRATION-001`, `GIT-APPROVAL-001`; `C-GIT-017`, `C-GIT-027` |
| backend/UI/OPS projection becomes publication authority | projection limits and `C-GIT-022`, `C-GIT-023` |
| legacy path becomes a second publication authority | compatibility table and `C-GIT-025` |

## 27. Implementation Details Intentionally Unfrozen

The following remain implementation choices unless a later accepted authority
freezes them:

- class, module, namespace and file names;
- Git/`gh` client library and process invocation mechanism;
- branch and worktree naming syntax and filesystem layout;
- queue, lock and polling implementation;
- database schema, journal/outbox storage and serialization format;
- API route, DTO and event-wire shape;
- PR polling versus webhook mechanism;
- hash library and internal evidence record layout;
- test framework, fixture layout and adapter composition;
- cleanup scheduling and local cache strategy.

These freedoms must preserve the normative identities, evidence, ordering,
failure semantics, retention and authority boundaries above.

## 28. Open Questions

### IMPLEMENTATION_DETAIL_QUESTION

- Which supported Git/`gh` invocation library and process timeout policy best
  fit the eventual local backend?
- Which durable store and schema represent the PLAT-owned effect records?
- Which polling/webhook mechanism observes remote confirmation without changing
  the canonical protocol?

There is no unresolved architectural question. Any answer that changes
ownership, dependency direction, publication meaning, failure meaning or
cutover authority requires portfolio/ADR governance before this SPEC changes.

## 29. Definition of Done

This component SPEC is ready for independent SPEC validation only when the
following are true:

- the portfolio decomposition audit is `PORTFOLIO_DECOMPOSITION_APPROVED`;
- ADR-0007 and ADR-0008 are accepted and effective;
- DOM, PLAT and REPO upstream audits permit normative consumption;
- all ten owned obligations O-039…O-048 are represented by requirements;
- no consumed contract is redefined;
- every normative requirement traces to an owned obligation and accepted ADR;
- identity, authority, failure, compatibility, replay, cutover and cleanup
  boundaries are explicit;
- conformance tests cover positive, negative, isolation, dependency,
  compatibility, recovery and synthetic extensibility behavior;
- acceptance criteria are binary and complete;
- repository evidence and known gaps are classified without creating a Gap
  Matrix or implementation plan;
- no architecture gap, portfolio ownership gap, unapproved dependency or
  downstream authority dependency remains;
- no production implementation, ticket decomposition or new ADR was created.

## Mechanical Validation

```text
PORTFOLIO_OBLIGATIONS_OWNED = 10
PORTFOLIO_OBLIGATIONS_COVERED = 10
OWNED_OBLIGATIONS_UNCOVERED = 0
NORMATIVE_REQUIREMENTS = 10
REQUIREMENTS_WITHOUT_AUTHORITY = 0
CONSUMED_CONTRACTS = 8 contract groups
CONSUMED_CONTRACTS_REDEFINED = 0
FAILURES_OWNED = 3
FAILURES_CONSUMED = 11 named codes/classes across approved families
AMBIGUOUS_FAILURE_OWNERS = 0
NORMATIVE_DEPENDENCIES = 3
NEW_UNAPPROVED_DEPENDENCIES = 0
KNOWN_SPECIFICATION_GAPS = 0
KNOWN_IMPLEMENTATION_GAPS = 4
ARCHITECTURE_GAPS = 0
PORTFOLIO_OWNERSHIP_GAPS = 0
ACCEPTANCE_CRITERIA = 20
CONFORMANCE_TESTS = 33
```

Required local invariants:

```text
OWNED_OBLIGATIONS_UNCOVERED = 0
REQUIREMENTS_WITHOUT_AUTHORITY = 0
CONSUMED_CONTRACTS_REDEFINED = 0
AMBIGUOUS_FAILURE_OWNERS = 0
NEW_UNAPPROVED_DEPENDENCIES = 0
ARCHITECTURE_GAPS = 0
PORTFOLIO_OWNERSHIP_GAPS = 0
```

No Gap Matrix, Implementation Plan, ticket set, implementation code, new ADR
or portfolio remediation was produced.
