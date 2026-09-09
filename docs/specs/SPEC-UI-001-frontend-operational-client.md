---
schema_version: "1.0.0"
id: SPEC-UI-001
title: Frontend Operational Client
status: PROPOSED
revision: 2
date: 2026-09-09
spec_scope: frontend-client-projection-and-interaction
portfolio: SPEC-PORTFOLIO-001
portfolio_revision: 2
portfolio_verdict: PORTFOLIO_DECOMPOSITION_APPROVED
portfolio_audit: docs/specs/SPEC-PORTFOLIO-001-decomposition-audit.md
remediation_source_audit: docs/specs/audits/SPEC-UI-001-component-conformance-audit.md
remediation_report: docs/specs/remediations/SPEC-UI-001-component-spec-remediation.md
authoritative_adrs: [ADR-0014]
related_adrs: [ADR-0002, ADR-0005, ADR-0008, ADR-0011, ADR-0013]
upstream_dependencies: [SPEC-BACKEND-001, SPEC-OPS-001]
supersedes: []
superseded_by: null
---

# SPEC-UI-001 — Frontend Operational Client

## 1. Status

`PROPOSED` — revision 2. This specification materializes the approved UI
boundary and has been remediated against the source conformance audit. A fresh
independent component SPEC re-audit is required. It is not an implementation
plan and does not authorize production frontend code.

Generation baseline:

| Item | Value |
|---|---|
| Target component | `SPEC-UI-001` |
| Governing portfolio | `SPEC-PORTFOLIO-001`, revision `2` |
| Portfolio audit | `docs/specs/SPEC-PORTFOLIO-001-decomposition-audit.md` |
| Portfolio verdict | `PORTFOLIO_DECOMPOSITION_APPROVED` |
| Primary ADR | `ADR-0014`, revision `3`, `ACCEPTED` |
| Related accepted ADRs | `ADR-0002`, `ADR-0005`, `ADR-0008`, `ADR-0011`, `ADR-0013`, revision `3` |
| Normative upstream SPECs | `SPEC-BACKEND-001` revision `3`; `SPEC-OPS-001` revision `2` |
| Upstream audit evidence | Both latest audits report `PASS — COMPONENT_SPEC_CONFORMANT` and permit Gap Matrix generation |
| Repository HEAD inspected | `a58ce959f9b34f3c1c83ed41c01b058d31bf3366` |
| Existing target draft | revision 1; remediated in place to revision 2 |
| Prior Gap Matrix | None found for this component |
| Source conformance audit | `docs/specs/audits/SPEC-UI-001-component-conformance-audit.md`; `FAIL — COMPONENT_SPEC_NON_CONFORMANT` |
| Remediation evidence | `docs/specs/remediations/SPEC-UI-001-component-spec-remediation.md` |

This specification materializes ownership already assigned by the approved
portfolio and does not redefine portfolio boundaries.

## 2. Ownership

### Owns

- the local web client contract for consuming backend snapshots, commands and
  events;
- navigation and presentation of the operational model;
- client controls that submit requests for execution, intervention,
  reconciliation, evidence and publication;
- client display of requested, accepted/rejected and confirmed outcomes;
- client projection of publication vocabulary and terminal completion; and
- complete operational follow-up in the interface, with email remaining an
  intervention alert only.

These are exactly portfolio obligations `O-073` through `O-078`.

### Consumes

- authenticated application commands, queries, snapshots, transport events,
  correlation and replay from `SPEC-BACKEND-001`;
- operational records, dashboards, replay, export records and availability
  markers from `SPEC-OPS-001`;
- canonical domain identity, lifecycle, state, findings, verdict and
  publication vocabulary from `SPEC-DOM-001` through backend mappings;
- capacity, queue and eligibility records from `SPEC-EXEC-002`;
- effect and reconciliation evidence from `SPEC-PLAT-001`; and
- publication evidence and remote confirmation from `SPEC-GIT-001`.

### Does not own

- canonical identity, domain state, command preconditions, audit verdicts,
  findings, capability eligibility, capacity, leases or scheduler decisions;
- application command semantics, transport authentication, snapshots/events
  as a source, or replay durability;
- persistence, effect intent/evidence, reconciliation, recovery, retention,
  backup or export authority;
- repository onboarding, Git branches/worktrees/commits, publication,
  approval, merge or remote confirmation;
- email eligibility, delivery, notification evidence or intervention record
  authority; or
- any production process, adapter, database, API route, event wire protocol
  or frontend technology choice not frozen by accepted authority.

## 3. Portfolio Authority

The governing authority is
`docs/specs/SPEC-PORTFOLIO-001-organization.md`, revision `2`. Its latest
independent audit concludes `PORTFOLIO_DECOMPOSITION_APPROVED` with no
unresolved ownership, dependency or architecture finding.

| Portfolio allocation | UI treatment |
|---|---|
| Owned obligations | `O-073` through `O-078` |
| Failure role | UI presentation owner for all approved failure families; no canonical failure family owned |
| New canonical path | owner of client consumption and interaction contract (`O-073`, `O-077`) |
| Historical replay | owner of client recovery from backend snapshot/replay (`O-073`) |
| Legacy compatibility | consumer of BACKEND/OPS adaptation; no second client authority |
| Cutover | consumer of DOM/GIT/BACKEND source semantics |
| Retirement | `NOT_APPLICABLE`; presentation follows source-owner retirement |
| Direct dependencies | `SPEC-BACKEND-001`, `SPEC-OPS-001` |

The approved portfolio remains authoritative for ownership, dependency
direction, failure ownership, compatibility and projection boundaries.

## 4. ADR Authority

### Primary accepted ADR

| ADR | Status | Relevant decision |
|---|---|---|
| `ADR-0014` | `ACCEPTED`, revision `3` | local web client; snapshots, commands and events from backend; operational views and controls; publication vocabulary; confirmed-state display; requested/accepted/rejected/confirmed distinction; cooperative pause/cancel display; email as intervention alert only |

### Related accepted ADRs

| ADR | Contract consumed locally |
|---|---|
| `ADR-0002` | separate state machines, command rejection, publication vocabulary and `REMOTE_PUBLICATION_CONFIRMED` terminal publication meaning |
| `ADR-0005` | capacity, queue, eligibility and fair scheduling projections |
| `ADR-0008` | candidate, human approval, integration, PR and remote-confirmation distinctions |
| `ADR-0011` | autonomous backend, authenticated application boundary, snapshots, events and replay |
| `ADR-0013` | operational records, correlation, replay, retention, backup and export projections |

Accepted ADR authority is not replaced by repository behavior, prototype
behavior or a client-side state model.

## 5. Problem Statement

The accepted architecture requires a browser client that makes a long-running,
multi-stage workflow understandable and operable while remaining a
non-authoritative projection. The client must expose the operational model,
submit human requests through the backend, and show only outcomes confirmed by
the canonical owners.

The repository has no production frontend client. It contains a navigable React
prototype with views for overview, repositories, runs, SPEC detail, DAG and
waves, activity, interventions, publication, and artifacts. The prototype
centralizes a deterministic in-memory mock domain; its README explicitly says
that backend, database, Git/GitHub, Codex CLI and email are simulated and that
no external integration executes.

Without this boundary, the UI could become a second source of state, treat an
acknowledged request as completed work, hide a stale publication basis, or
make users depend on email instead of the complete operational record.
Satisfying this SPEC enables a headless backend to continue work while the
client disconnects, and enables an operator to inspect and request authorized
actions with clear source, basis and confirmation semantics.

## 6. Goals

- A client can load an authenticated snapshot and consume correlated backend
  events without owning continuation of the execution (`O-073`).
- An operator can navigate from repository and execution context to SPEC,
  stage, wave, ticket, activity, intervention, publication and evidence views
  while retaining canonical source references (`O-074`).
- Every supported control submits a request to its owning backend/domain,
  execution, persistence, repository or Git/publication contract and exposes
  its resulting lifecycle (`O-075`).
- Publication display distinguishes candidate, approval, integration, PR merge
  and remote confirmation, and never labels the work complete before
  `REMOTE_PUBLICATION_CONFIRMED` (`O-076`).
- The UI visibly separates `requested`, `accepted`, `rejected` and confirmed
  outcomes; pause and cancellation remain requested until a safe checkpoint is
  confirmed (`O-077`).
- The interface is the complete operational follow-up surface; email is shown
  as an intervention alert and is not required for monitoring or authority
  (`O-078`).

## 7. Non-Goals

- defining or implementing domain commands, state transitions, identity,
  eligibility, capacity, leases, audit verdicts or publication confirmation;
- defining backend routes, DTOs, stream protocol, authentication mechanism,
  event persistence or replay storage;
- defining operational retention, backup, export, deletion or telemetry
  semantics;
- executing Git, GitHub, Codex, database, email or other external effects from
  the browser;
- choosing a frontend framework, component library, route syntax, CSS system,
  client state library or module structure;
- defining implementation phases, work units, tickets or deployment steps; or
- generating a Gap Matrix, Implementation Plan or production implementation.

## 8. Current Repository State

| Area | Current behavior | Target behavior | Classification |
|---|---|---|---|
| Target component SPEC | No UI component SPEC existed before this generation | Approved UI boundary is materialized for independent validation | `SPECIFICATION_GAP` (closed by this generation) |
| Production frontend | No production frontend client exists outside the prototype | Local web client consumes the backend boundary | `IMPLEMENTATION_GAP` |
| Navigation and views | Prototype implements multiple navigable views and URL parameters in `prototype/src/App.tsx` | Production navigation preserves source identity and non-authoritative projection, including operational log inspection | `PROTOTYPE_ONLY` / `IMPLEMENTATION_GAP` |
| Commands and outcomes | Prototype simulates `requested` then timed acceptance/confirmation in memory | Backend request lifecycle and owner-confirmed events drive the UI | `PROTOTYPE_ONLY` / `IMPLEMENTATION_GAP` |
| Publication controls | Prototype renders direct-push and PR control sets and publication states | UI reflects GIT-owned vocabulary and confirmation evidence | `PROTOTYPE_ONLY` / `IMPLEMENTATION_GAP` |
| Snapshots and realtime stream | No production backend/API/event stream exists in the repository | Authenticated snapshots, correlated events and replay are consumed from BACKEND | `IMPLEMENTATION_GAP` |
| Operational dashboards and replay | Prototype renders capacity, queues, timelines, findings and artifacts from mock state | OPS-owned correlated projections and replay are displayed with availability/staleness | `IMPLEMENTATION_GAP` |
| Authentication/session | Prototype displays a mock local connection; no production session exists | UI uses BACKEND local-session handoff and fails closed on invalid session | `IMPLEMENTATION_GAP` |
| Export/evidence follow-up | Prototype offers mock evidence export controls | UI requests/receives OPS-owned export records and exposes incomplete results | `PROTOTYPE_ONLY` / `IMPLEMENTATION_GAP` |
| Repository tests | `prototype/tests/ui.test.ts` and `prototype/tests/mockDomain.test.ts` cover deterministic prototype behavior | Independent client-contract tests use backend/OPS test doubles and stale/replay cases | `IMPLEMENTATION_GAP` |
| Architecture and ownership | Approved portfolio and accepted ADRs allocate the boundary | No new architectural decision is required | `NON_GAP` |

Prototype behavior is evidence of UX and scenario coverage only. It does not
override accepted ADRs or upstream SPEC contracts.

## 9. Owned Architectural Obligations

| Portfolio obligation | ADR authority | Source section | Local treatment |
|---|---|---|---|
| `O-073` | `ADR-0014` | `Decisão` | consume authenticated backend snapshots, commands and events; maintain client correlation and replay projection; `UI-CLIENT-001/002` |
| `O-074` | `ADR-0014` | `Decisão` | present the complete operational navigation and inspection surface; `UI-NAV-001/002` |
| `O-075` | `ADR-0014` | `Decisão` | expose controls as owner-routed requests for execution, intervention, evidence and publication; `UI-ACTION-001/002` |
| `O-076` | `ADR-0014` | `Decisão` | present canonical publication vocabulary and terminal completion rule; `UI-PUB-001/002` |
| `O-077` | `ADR-0014` | `Decisão` | render requested/accepted/rejected/confirmed outcomes and checkpoint-gated pause/cancellation; `UI-STATE-001/002` |
| `O-078` | `ADR-0014` | `Decisão` | provide complete operational follow-up and treat email as alert only; `UI-FOLLOW-001/002` |

All six owned obligations are represented by normative requirements, acceptance
criteria and conformance tests below.

## 10. Consumed Contracts

| Owner SPEC | Contract / requirement | Why consumed | Local rule |
|---|---|---|---|
| `SPEC-BACKEND-001` | `BACKEND-API-001/002/003/004` | authenticated commands/queries, outcome distinctions, snapshots, transport events and replay | consume and render owner-supplied records; do not create a client command, confirmation or durable source |
| `SPEC-BACKEND-001` | `BACKEND-AUTH-001/002` | protected localhost session and fail-closed access | use the protected handoff; on invalid session stop protected operations and show the backend failure mapping; never expose token values |
| `SPEC-BACKEND-001` | `BACKEND-INTERVENTION-001` and `BACKEND-NOTIFY-001/002` | intervention requests, rationale and alert status | collect/display required rationale and delivery evidence; do not own notification eligibility or delivery |
| `SPEC-OPS-001` | `OPS-OBS-001/002/003/004/005` | complete operational record, source fidelity, durations, correlation and replay | display exact values, provenance and unavailable/stale markers; never infer missing values or state |
| `SPEC-OPS-001` | `OPS-EXPORT-001/002/003` | evidence/export inspection and download | present reconstructibility, basis, hashes and incomplete status; export record remains OPS-owned |
| `SPEC-OPS-001` | `OPS-REPLAY-001/002`, `OPS-EXT-001` | recovery, idempotent projection replay and capability-neutral observation | refresh/replay from owner basis and use generic rendering; no category-specific authority or fallback |
| `SPEC-DOM-001` | `DOM-ID-001`, `DOM-SNAPSHOT-001`, `DOM-STATE-001`, `DOM-PUB-001`, `DOM-AUDIT-002/003/006` | identity, state, publication and verdict display | preserve exact IDs/revisions/basis and source meaning; client labels cannot authorize or complete work |
| `SPEC-EXEC-002`, `SPEC-PLAT-001`, `SPEC-GIT-001` | capacity/queue, effect/reconciliation and publication evidence contracts | operator inspection and action availability | show owner records and route requests to BACKEND; do not reproduce canonical transitions or effects |

The first two rows are the only direct normative upstream dependencies in the
approved portfolio DAG. The remaining rows are consumed source contracts
carried through those dependencies or referenced for presentation. No
consumed contract is redefined here.

## 11. Target Behavioral Model

```text
authenticated backend snapshot + OPS operational projection
                         |
                         v
          client projection store with source/basis/correlation
                         |
          +--------------+----------------+
          |                               |
          v                               v
navigation / inspection             operator control
          |                               |
          v                               v
derived presentation         backend application request + correlation
                                          |
                                          v
                           requested → accepted/rejected → owner-confirmed event
                                          |
                                          v
                                refresh/replay client projection
```

Client navigation, local selection, filters and presentation state may change
without changing canonical state. A disconnected client does not pause or
cancel backend work. Reconnect uses backend replay or a fresh snapshot and
does not reissue a command or external effect.

## 12. Identity and Authority Rules

| Identity / record | Canonical owner | Reference identity | Local correlation | Derived projection |
|---|---|---|---|---|
| `RepositoryId`, `ExecutionId`, `SpecId`, `ActivityId`, `AttemptId`, `AgentId` | DOM/EXEC owners | exact source ID and revision | backend request/event correlation | label, row, route parameter |
| functional state, audit verdict, finding and publication state | respective DOM/EXEC/GIT owner | source record and basis | event correlation | status badge, timeline, filter |
| capacity, queue, lease and duration measurement | EXEC/OPS owners | exact source reference and availability | operational correlation | dashboard metric/queue row |
| effect/reconciliation/publication evidence | PLAT/GIT owners | evidence identity, candidate and basis | request/effect correlation | intervention/publication detail |
| backend request and stream cursor | BACKEND transport mapping | request ID/cursor supplied by backend | local pending request map | requested/accepted/rejected indicator |
| OPS operational/export record | OPS projection owner | source identities plus projection/export basis | operation correlation | dashboard/export row |
| selected view, filter, route and anchor | UI-local presentation | source ID when present | browser navigation state | current page or focus |

UI-local route, selection, label, cache key and display status MUST NOT replace
canonical identity, create a second state machine or authorize a transition.
Mutable labels are never identity substitutes.

## 13. Normative Requirements

### UI-CLIENT-001 — Backend snapshot, command and event client

The UI MUST consume authenticated backend snapshots, application command
responses and correlated events. Each displayed source record MUST preserve
its canonical identity, source/basis information and correlation when supplied.
The UI MUST NOT require an open page for backend progress and MUST NOT make a
local state mutation stand in for a backend-confirmed result.

Authority: `O-073`, `ADR-0014`, `Decisão`; consumes `BACKEND-API-001/002/003`.

### UI-CLIENT-002 — Replay and disconnected-client recovery

After disconnect, stale cursor or browser restart, the UI MUST use
`BACKEND-API-004` replay or request a fresh snapshot before presenting the
client as current. Replay MUST preserve source order, identity, failure
meaning, basis and confirmed/unconfirmed distinction. Reconnection MUST NOT
reissue a command, repeat an effect, or infer completion from cached state.

Authority: `O-073`, `ADR-0014`, `Decisão`; consumes `BACKEND-API-004` and
`OPS-REPLAY-001/002`.

### UI-NAV-001 — Complete operational navigation

The UI MUST provide navigable inspection of repositories, executions, ADRs,
SPECs, stages, waves, tickets, functional and operational states, current
activity, agents, skills, rounds, attempts, durations, progress, DAGs,
capacity, queues, blocks, branches/worktrees/commits, logs, findings, verdicts,
artifacts and evidence when the owner contracts provide those records.

Authority: `O-074`, `ADR-0014`, `Decisão`; consumes `OPS-OBS-001/003/004`.

### UI-NAV-002 — Source-faithful inspection

Every operational detail view MUST identify the applicable source identity,
revision/basis and availability or staleness status. A missing, unavailable or
stale source value MUST be shown as unavailable/stale or cause refresh; it MUST
NOT be replaced with a guessed success, zero, current label or cached
confirmation.

Authority: `O-074`, `ADR-0014`, `Decisão`; consumes `BACKEND-API-003/004` and
`OPS-OBS-002/003/004/005`.

### UI-ACTION-001 — Owner-routed operational controls

The UI MUST expose controls for preparing and confirming execution; pausing and
resuming; retrying a failure; cancelling processing where permitted; changing
priority; authorizing additional rounds; requesting reconciliation; inspecting,
downloading or exporting evidence; and requesting individual or batch
publication approval when the consumed owner contracts expose those actions.
Each control MUST submit an application request through BACKEND with the
canonical target identity and MUST display availability/precondition feedback
without implementing the precondition locally as authority.

Authority: `O-075`, `ADR-0014`, `Decisão`; consumes `BACKEND-API-001/002`,
`DOM-CMD-001`, `DOM-ADV-001`, `EXEC-QUEUE-001`, `PLAT-RECON-001/002/003`,
`GIT-APPROVAL-001` and `OPS-EXPORT-001`.

### UI-ACTION-002 — Intervention request evidence

For a human intervention that requires rationale, the UI MUST require a
non-empty justification before submitting the request or must show the
backend rejection without presenting a confirmed intervention. The UI MUST
display the request correlation and owner-confirmed intervention record when
available. A button click, toast, local disabled state or email must not be
treated as confirmation.

Authority: `O-075`, `ADR-0014`, `Decisão`; consumes `BACKEND-INTERVENTION-001`.

### UI-PUB-001 — Publication vocabulary projection

The UI MUST distinguish the approved publication stages:
`PUBLICATION_CANDIDATE_READY`, `AWAITING_PUBLICATION_APPROVAL`,
`LOCAL_INTEGRATION_PENDING`, `LOCAL_INTEGRATION_COMPLETE`, `PR_OPEN`,
`AWAITING_PR_MERGE`, `PR_MERGED` and
`REMOTE_PUBLICATION_CONFIRMED`, according to the configured publication mode.
It MUST show candidate, approval, integration, merge and remote evidence as
separate source-backed facts and MUST preserve publication failure mappings.

Authority: `O-076`, `ADR-0014`, `Decisão`; consumes `DOM-PUB-001`,
`GIT-MODE-001`, `GIT-APPROVAL-001`, `GIT-PR-001` and `GIT-CONFIRM-001`.

### UI-PUB-002 — Confirmed publication completion

The UI MUST NOT display a SPEC or publication as complete based only on a
candidate, human approval, local integration, push response, open PR, PR merge,
process exit or local status. Completion MUST be displayed only after the
source contract emits `REMOTE_PUBLICATION_CONFIRMED` for the exact candidate
and basis. Drift, failed checks, unconfirmed remote state or result-tree
mismatch MUST remain visible and non-terminal.

Authority: `O-076`, `ADR-0014`, `Decisão`; consumes `DOM-PUB-001`,
`GIT-PR-001`, `GIT-CONFIRM-001` and `BACKEND-API-003`.

### UI-STATE-001 — Explicit request outcome states

For every mutating control, the UI MUST visibly distinguish `requested`,
`accepted`, `rejected` and owner-confirmed outcomes when those stages exist.
`rejected` MUST retain the canonical failure code/meaning and MUST NOT be
styled or described as accepted, successful or confirmed. `accepted` MUST NOT
be displayed as an effect, domain transition or completion.

Authority: `O-077`, `ADR-0014`, `Decisão`; consumes `BACKEND-API-002` and the
canonical source failure contracts.

### UI-STATE-002 — Checkpoint-gated pause and cancellation display

After a pause or cancellation request, the UI MUST display the requested state
until a source event confirms the cooperative checkpoint or terminal outcome.
It MUST NOT imply that an active session stopped, an effect was reversed, or a
functional state changed merely because the request was accepted or the
browser control was clicked.

Authority: `O-077`, `ADR-0014`, `Decisão`; consumes `BACKEND-CODEX-002`,
`DOM-ADV-001`, `EXEC-RESUME-002` and `BACKEND-API-003`.

### UI-FOLLOW-001 — Complete operational follow-up

The UI MUST provide the complete operational follow-up surface for available
state, events, durations, agents, skills, versions, attempts, rounds,
consumption, DAG, blocks, Git records, logs, findings, verdicts, artifacts,
reconciliation, replay status, export status and intervention status. It MUST
retain source and availability markers and MUST support inspection of the
evidence needed to understand a pending or failed operation. Log inspection
MUST preserve the applicable source identity, correlation, provenance and
availability or staleness marker.

Authority: `O-078`, `ADR-0014`, `Decisão`; consumes `OPS-OBS-001/002/003/004`,
`OPS-OBS-005`, `OPS-EXPORT-001/002/003` and `OPS-REPLAY-001`.

### UI-FOLLOW-002 — Email is an alert, not the operational source

The UI MUST remain sufficient to monitor and inspect an operation without
email. Email delivery status MAY be displayed as a correlated intervention
alert, but the UI MUST NOT treat email delivery as state, effect, publication,
approval or confirmation, and MUST NOT define which events are email-eligible.

Authority: `O-078`, `ADR-0014`, `Decisão`; consumes `BACKEND-NOTIFY-001/002`
and `OPS-OBS-004`.

## 14. Commands / Queries / Events

Concrete routes, DTO names and event-wire protocols remain BACKEND-owned or
unfrozen. The UI classifications are:

| Interface | Classification | UI rule |
|---|---|---|
| Prepare/confirm execution, pause/resume, retry, cancel, priority, rounds, reconciliation or publication approval | `APPLICATION_COMMAND` issued as transport command | submit canonical target and correlation through BACKEND; show requested and later source outcomes |
| Inspect repository, execution, SPEC, activity, queue, publication or evidence | `QUERY` | render owner snapshot with basis and availability; query does not authorize action |
| Subscribe to backend changes | `TRANSPORT_EVENT` | update projection only when source identity/basis and correlation are valid |
| Domain state, verdict, finding or publication event | `CANONICAL_DOMAIN_EVENT` consumed through `TRANSPORT_EVENT` | preserve owner meaning; UI cannot emit or mutate it |
| Effect, reconciliation, process or publication observation | `INTEGRATION_EVENT` consumed through `TRANSPORT_EVENT` | display evidence/observation; do not promote it to confirmation |
| Operational dashboard/timeline/export status | `PROJECTION_EVENT` | display OPS projection and provenance; projection remains non-canonical |
| Navigation, filter, selection and route changes | UI-local interaction | change presentation only; no canonical side effect |

## 15. Failure Semantics

The UI owns no canonical semantic failure family. It is the approved
presentation owner for the following consumed families. The source owner
remains responsible for trigger, meaning, retryability, terminality and
recovery; BACKEND owns transport mapping and OPS owns operational logging.

| Failure family / codes | Canonical owner | UI local treatment |
|---|---|---|
| Repository: `UNKNOWN_REPOSITORY`, `REPOSITORY_NOT_ENABLED` | `SPEC-REPO-001` | show target and remediation/retry affordance without inventing repository state |
| SPEC/revision: `UNKNOWN_SPEC`, `INELIGIBLE_REVISION` | `SPEC-DOM-001` | show exact revision/basis and block the affected action |
| Capability: `UNKNOWN_CAPABILITY`, `INCOMPATIBLE_CAPABILITY` | `SPEC-EXEC-001` | show fail-closed contract/version result; no fallback capability |
| Dependency closure: `INVALID_DEPENDENCY_CLOSURE` | `SPEC-DOM-001` | show dependency/cycle block distinctly from file conflict or capacity |
| Command basis: `INVALID_COMMAND_BASIS`, `STALE_REVISION` | `SPEC-DOM-001` | show rejected/stale basis and require fresh owner data |
| Local session: `UNAUTHORIZED_LOCAL_SESSION` | `SPEC-BACKEND-001` | stop protected actions/stream, show session-invalid state and request protected re-auth; never show secret values |
| Capacity/eligibility: `CAPACITY_UNKNOWN`, `CAPACITY_EXHAUSTED`, `AGENT_INELIGIBLE` | `SPEC-EXEC-002` | distinguish waiting capacity, waiting eligibility and unknown conservative capacity |
| Contract/verdict: `CONTRACT_INVALID`, `VERDICT_UNKNOWN` | `SPEC-EXEC-001` | preserve fail-closed result and do not show success or completion |
| Effect reconciliation: `EXPECTED_INCOMPLETE_EFFECT`, `MISSING_EFFECT`, `SEMANTIC_DIVERGENCE`, `CONFLICTING_EFFECT` | `SPEC-PLAT-001` | display all four distinctly and expose authorized reconciliation action only |
| Publication: `PUBLICATION_DRIFT`, `MERGE_CONFLICT`, `REMOTE_PUBLICATION_UNCONFIRMED` | `SPEC-GIT-001` | preserve stage/evidence and keep publication non-terminal |
| Legacy compatibility: `LEGACY_COMPATIBILITY_ONLY` | `SPEC-REPO-001` | mark compatibility provenance; do not present legacy as a second canonical path |

The UI MUST NOT silently translate one canonical failure into another. A color,
label, icon, disabled control or notification is presentation only.

## 16. Retry / Idempotency / Recovery

- Canonical retry, effect idempotency, reconciliation, checkpoint and recovery
  semantics remain DOM, EXEC, PLAT, REPO or GIT-owned as applicable.
- A user retry is a new application request only when the owner contract makes
  it available; the UI MUST show the prior evidence and request correlation
  before presenting the result.
- Reconnect, refresh and replay are not retries of commands or effects. The UI
  MUST use `BACKEND-API-004` and `OPS-REPLAY-001/002` and preserve one
  projection per source identity/basis.
- If the source is stale, incomplete or divergent, the UI MUST show that
  condition and request refresh/reconciliation; it MUST NOT resolve the
  condition by choosing a local cached value.

## 17. Compatibility / Cutover

| Class | UI role | Normative rule |
|---|---|---|
| `NEW_CANONICAL_PATH` | `OWNER` (`O-073`, `O-077`) | client consumes the current backend/OPS contracts as the sole operational client path; local mock state is not production authority |
| `LEGACY_COMPATIBILITY` | `CONSUMER` of BACKEND/OPS/REPO/GIT adaptation | legacy records may be displayed with provenance and source status, never as a second canonical state or command path |
| `HISTORICAL_REPLAY` | `OWNER` (`O-073`) | replay preserves historical identities, basis, ordering and confirmed/unconfirmed outcomes; no history rewrite |
| `CUTOVER` | `CONSUMER` of DOM/GIT/BACKEND owners | UI changes displayed source only after the owner emits the new confirmed contract; presentation alone cannot cut over state |
| `RETIREMENT` | `NOT_APPLICABLE` | UI presentation follows retirement of the source owner and does not delete or retire canonical records |

No implementation phases are defined here. A legacy or prototype view is an
adapter/evidence source, not a second production authority.

## 18. Projection Boundaries

| Item | Rule |
|---|---|
| Canonical source | DOM/EXEC/PLAT/REPO/GIT/BACKEND/OPS contracts according to the displayed fact |
| Projection | UI view model, status text, dashboard, timeline, route, filter and accessibility representation |
| Refresh/replay | refresh from authenticated snapshot or correlated event replay; retain source basis and provenance |
| Stale behavior | show stale/unavailable/incomplete and block or request refresh where the owner contract requires a fresh basis |
| Authority limit | no UI state, cached value, disabled button, toast, modal, route, chart, email or prototype mock can authorize, confirm, complete, reconcile or retire an operation |

## 19. External Effects

| Semantic | UI rule |
|---|---|
| Request | UI submits an application request through BACKEND with canonical target and correlation |
| Intent | PLAT/owner persists intent; UI may display its state but does not create or confirm it |
| External execution | backend adapters and owner components execute Git, Codex, repository or email effects; UI never invokes them directly |
| Evidence | PLAT/GIT/OPS source contracts supply evidence; UI renders identity, basis and availability |
| Confirmation | source owner emits confirmation; UI only displays it |
| Reconciliation | PLAT/GIT/REPO owners classify and resolve; UI requests or observes the operation |
| Projection | UI derives presentation and permits inspection/download through owner APIs |

## 20. Security / Authorization

- UI access MUST use the BACKEND local-session contract; it MUST NOT invent
  accounts, roles, domain permissions or publication authority.
- UI MUST NOT place local session tokens or other secrets in URLs, labels,
  ordinary client telemetry, exported view state or user-visible error text.
- A UI authorization control is only a request. Domain authorization,
  application authorization, human publication approval and effect
  confirmation remain with their canonical owners.
- When BACKEND returns `UNAUTHORIZED_LOCAL_SESSION`, the UI MUST fail closed
  for protected snapshots, commands and streams and MUST NOT retry an effect
  automatically.

## 21. Conformance Suite

Independent UI conformance must use backend and OPS contract doubles or a real
conformant boundary; prototype-only in-memory transitions are insufficient.

### Positive

- `C-UI-001`: authenticated snapshot renders canonical IDs, basis and available source records.
- `C-UI-002`: a valid control emits one correlated application request and displays requested, accepted and confirmed outcomes as emitted.
- `C-UI-003`: navigation reaches repository, execution, SPEC, stage, wave, ticket, activity, intervention, publication and evidence views.
- `C-UI-004`: capacity, queue, duration, agent, skill, round, DAG, Git record, log, finding, verdict and artifact records render with source, correlation and availability/staleness markers.
- `C-UI-005`: direct-push and PR publication modes render their distinct approved stage sequences.
- `C-UI-006`: a source `REMOTE_PUBLICATION_CONFIRMED` event for the exact candidate causes completion display.
- `C-UI-007`: export inspection shows basis, hashes, provenance and explicit incomplete status when provided by OPS.
- `C-UI-008`: a disconnected client reconnects through replay or fresh snapshot and becomes current without issuing a command.
- `C-UI-009`: an intervention form requires rationale and shows the correlated owner result.

### Negative and fail-closed

- `C-UI-010`: cached state, process exit, approval, local integration, push response, open PR or `PR_MERGED` cannot display publication completion.
- `C-UI-011`: a rejected command preserves its canonical failure and is not rendered as accepted, successful or confirmed.
- `C-UI-012`: pause/cancel remains requested until a cooperative checkpoint or terminal source event is received.
- `C-UI-013`: stale cursor, missing event, stale basis or unavailable measurement causes replay/refresh or explicit stale/incomplete display.
- `C-UI-014`: invalid local session blocks protected commands, snapshots and streams without exposing a token.
- `C-UI-015`: retry/reconnect does not duplicate a command, effect, publication candidate or canonical event.
- `C-UI-016`: the UI cannot invoke Git, GitHub, Codex, database or email directly from a client control.
- `C-UI-017`: an email delivery status cannot authorize, confirm or complete an operation.

### Boundary isolation

- `C-UI-018`: UI routes and labels cannot redefine DOM states, preconditions, findings, verdicts or publication vocabulary.
- `C-UI-019`: UI cannot redefine BACKEND transport, OPS retention/export, PLAT reconciliation, EXEC capacity or GIT confirmation semantics.
- `C-UI-020`: a projection, chart, cache, disabled button, toast or prototype mock cannot become canonical state.
- `C-UI-021`: UI consumes upstream contracts without requiring a downstream component to define UI or client authority.

### Compatibility, recovery and synthetic extensibility

- `C-UI-022`: legacy and historical records retain provenance and are displayed through the current source contract without a second canonical path.
- `C-UI-023`: replaying the same source history is idempotent for the client projection and preserves ordering/basis.
- `C-UI-024`: a synthetic registered capability/activity appears through generic operational rendering without a category-specific page, enum branch or fallback.

## 22. Acceptance Criteria

| ID | Binary criterion |
|---|---|
| `AC-UI-001` | Given a valid authenticated snapshot, the UI displays source IDs, basis/correlation and available values without fabrication. |
| `AC-UI-002` | Given a mutating control, exactly one owner-routed correlated request is submitted and its emitted lifecycle is displayed. |
| `AC-UI-003` | Given a disconnected or stale client, replay or fresh snapshot restores the projection without reissuing a command or effect. |
| `AC-UI-004` | Given any applicable source record, the required operational navigation and inspection views, including log inspection with source identity, correlation and availability/staleness markers, are reachable. |
| `AC-UI-005` | Given direct-push versus PR mode, the UI shows the correct distinct publication vocabulary. |
| `AC-UI-006` | Given any publication state before exact `REMOTE_PUBLICATION_CONFIRMED`, the UI does not display completion. |
| `AC-UI-007` | Given requested, accepted, rejected and confirmed backend outcomes, the UI displays them distinctly and preserves rejection meaning. |
| `AC-UI-008` | Given a pause/cancel request without checkpoint confirmation, the UI shows requested and not completed/stopped. |
| `AC-UI-009` | Given an invalid session, protected actions and data are unavailable and no token value is rendered or logged. |
| `AC-UI-010` | Given stale, missing, unavailable or incomplete evidence, the UI shows the condition or requests refresh and never substitutes success. |
| `AC-UI-011` | Given an intervention requiring rationale, an empty justification cannot produce a confirmed intervention. |
| `AC-UI-012` | Given an email delivery event, the operational UI remains complete and the email event cannot authorize or confirm any operation. |

## 23. ADR / Obligation / Requirement Traceability

| Requirement | Portfolio obligation | ADR | ADR section | Ownership role | Acceptance / test |
|---|---|---|---|---|---|
| `UI-CLIENT-001` | `O-073` | `ADR-0014` | Decisão | canonical owner | `AC-UI-001/002`; `C-UI-001/002` |
| `UI-CLIENT-002` | `O-073` | `ADR-0014` | Decisão | canonical owner | `AC-UI-003`; `C-UI-008`, `C-UI-015`, `C-UI-023` |
| `UI-NAV-001` | `O-074` | `ADR-0014` | Decisão | canonical owner | `AC-UI-004`; `C-UI-003/004` |
| `UI-NAV-002` | `O-074` | `ADR-0014` | Decisão | canonical owner | `AC-UI-001/010`; `C-UI-013` |
| `UI-ACTION-001` | `O-075` | `ADR-0014` | Decisão | canonical owner | `AC-UI-002`; `C-UI-002`, `C-UI-016` |
| `UI-ACTION-002` | `O-075` | `ADR-0014` | Decisão | canonical owner | `AC-UI-011`; `C-UI-009` |
| `UI-PUB-001` | `O-076` | `ADR-0014` | Decisão | canonical owner | `AC-UI-005`; `C-UI-005`, `C-UI-022` |
| `UI-PUB-002` | `O-076` | `ADR-0014` | Decisão | canonical owner | `AC-UI-006`; `C-UI-006`, `C-UI-010` |
| `UI-STATE-001` | `O-077` | `ADR-0014` | Decisão | canonical owner | `AC-UI-007`; `C-UI-011` |
| `UI-STATE-002` | `O-077` | `ADR-0014` | Decisão | canonical owner | `AC-UI-008`; `C-UI-012` |
| `UI-FOLLOW-001` | `O-078` | `ADR-0014` | Decisão | canonical owner | `AC-UI-004/010`; `C-UI-007`, `C-UI-013` |
| `UI-FOLLOW-002` | `O-078` | `ADR-0014` | Decisão | canonical owner | `AC-UI-012`; `C-UI-017` |

```text
REQUIREMENTS_WITHOUT_PORTFOLIO_OBLIGATION = 0
OWNED_OBLIGATIONS_WITHOUT_REQUIREMENT = 0
```

## 24. Known Gap Summary

| Gap subject | Classification | Related requirement | Evidence |
|---|---|---|---|
| UI component SPEC absent before this generation | `SPECIFICATION_GAP` (closed by this generation) | all `UI-*` | no target file existed in the generation baseline |
| Production frontend client absent | `IMPLEMENTATION_GAP` | all `UI-*` | portfolio repository inventory; no production frontend outside `prototype/` |
| Backend/API/realtime integration absent | `IMPLEMENTATION_GAP` | `UI-CLIENT-001/002`, `UI-STATE-*` | no production API or stream; prototype README states backend is simulated |
| OPS operational projection/replay/export integration absent | `IMPLEMENTATION_GAP` | `UI-NAV-002`, `UI-FOLLOW-*` | no production OPS runtime; prototype uses in-memory mock records |
| Local session/authenticated client integration absent | `IMPLEMENTATION_GAP` | `UI-CLIENT-001`, `UI-CLIENT-002`, `UI-PUB-002` | no production backend/session in repository |
| Real publication/effect/reconciliation integration absent | `IMPLEMENTATION_GAP` | `UI-ACTION-001`, `UI-PUB-*`, `UI-FOLLOW-001` | prototype scenarios only; no external integration executes |
| Prototype navigation, command timing and publication display | `PROTOTYPE_ONLY` | `UI-NAV-*`, `UI-ACTION-*`, `UI-PUB-*`, `UI-STATE-*` | `prototype/src/App.tsx:10-46,52-75`; `prototype/src/uiModel.ts:5-16`; `prototype/tests/ui.test.ts:65-130` |
| Prototype scenario/unit coverage | `PROTOTYPE_ONLY` | conformance baseline only | `prototype/tests/mockDomain.test.ts:215-253,399-405,460-506,872-995` |
| Upstream BACKEND and OPS component contracts | `ALREADY_CONFORMANT` | consumed contracts | latest independent audits pass; production implementation remains downstream |
| Architecture or portfolio ownership | `NON_GAP` | all | approved portfolio audit reports no architecture or ownership gap |

This is a known-divergence summary only. The formal Gap Matrix remains a
downstream artifact and is not generated here.

## 25. Dependencies

| Dependency SPEC | Contract consumed | Blocking? | Evidence |
|---|---|---|---|
| `SPEC-BACKEND-001` | authenticated commands/queries, requested/accepted/rejected/confirmed outcomes, snapshots, realtime events, replay/reconnection, local session and intervention mappings | Yes | approved portfolio edge `UI → BACKEND`; `docs/specs/audits/SPEC-BACKEND-001-component-conformance-audit.md` reports `PASS — COMPONENT_SPEC_CONFORMANT` for revision 3 |
| `SPEC-OPS-001` | operational records, source fidelity, correlation, durations, replay, export and availability/incomplete markers | Yes | approved portfolio edge `UI → OPS`; `docs/specs/audits/SPEC-OPS-001-component-conformance-audit.md` reports `PASS — COMPONENT_SPEC_CONFORMANT` for revision 2 |

No new normative dependency is introduced. DOM, EXEC, PLAT, REPO and GIT are
consumed source owners through the approved BACKEND/OPS contract chain; no
downstream component is required to define UI authority.

## 26. Risks

| Risk | Mitigation / conformance |
|---|---|
| optimistic UI becomes a second state authority | `UI-STATE-001/002`; `C-UI-010/011/012` |
| stale cache or cursor hides newer evidence | `UI-CLIENT-002`, `UI-NAV-002`; `C-UI-008/013/023` |
| publication approval, PR merge or local status appears complete | `UI-PUB-001/002`; `C-UI-005/006/010` |
| UI action bypasses backend/domain authorization | `UI-ACTION-001`; `C-UI-016/018/019` |
| transport failure mapping changes canonical meaning | failure table; `C-UI-011`, `C-UI-018/019` |
| email becomes the only operational record | `UI-FOLLOW-001/002`; `C-UI-007/017` |
| legacy/prototype becomes a second canonical path | compatibility table; `C-UI-022` |
| category-specific frontend branch blocks extensibility | `OPS-EXT-001` consumption; `C-UI-024` |
| disconnected client repeats an external action | `UI-CLIENT-002`; `C-UI-008/015` |

## 27. Implementation Details Intentionally Unfrozen

The following remain implementation choices unless later accepted authority
freezes them:

- frontend framework, build tool and component library;
- client state/cache implementation and module boundaries;
- route, URL, deep-link and browser-history syntax;
- API route names, DTOs, event-wire format and stream technology;
- visual design, colors, icons, responsive layout and accessibility library;
- polling versus push subscription details;
- local storage/session handoff mechanics within BACKEND's protected contract;
- test framework, fixture format and adapter composition; and
- exact labels or aliases for provisional failure codes, provided their
  meanings and provenance remain stable.

These freedoms must preserve canonical identity, source basis, correlation,
failure meaning, confirmation semantics, replay behavior and non-authority.

## 28. Open Questions

### IMPLEMENTATION_DETAIL_QUESTION

- Which frontend framework and client cache best fit the eventual local web
  client?
- Which presentation layout gives operators the clearest relationship between
  source evidence, current projection and requested actions?
- Which accessibility and offline/reconnect interaction details best fit the
  backend stream contract?

There is no unresolved architectural question. Any change to ownership,
dependency direction, canonical meaning, failure semantics or confirmation
authority requires ADR/portfolio governance before this SPEC changes.

## 29. Definition of Done

This component SPEC is ready for a fresh independent component SPEC re-audit only when:

- the portfolio decomposition audit is `PORTFOLIO_DECOMPOSITION_APPROVED`;
- ADR-0014 and all related ADRs used here are accepted and effective;
- BACKEND and OPS upstream audits permit normative consumption;
- all six owned obligations `O-073`–`O-078` are represented by requirements;
- no consumed contract is redefined;
- every normative requirement traces to an owned obligation and accepted ADR;
- identity, authority, projection, failure, replay and publication boundaries
  are explicit;
- conformance tests cover positive, negative, isolation, dependency,
  compatibility, recovery and synthetic extensibility behavior;
- acceptance criteria are binary and complete, including explicit operational log inspection;
- repository evidence and known gaps are classified without creating a Gap
  Matrix or implementation plan;
- no architecture gap, portfolio ownership gap, unapproved dependency or
  downstream authority dependency remains; and
- no production implementation, ticket decomposition or new ADR was created.

## Mechanical Validation

```text
PORTFOLIO_OBLIGATIONS_OWNED = 6
PORTFOLIO_OBLIGATIONS_COVERED = 6
OWNED_OBLIGATIONS_UNCOVERED = 0
NORMATIVE_REQUIREMENTS = 12
REQUIREMENTS_WITHOUT_AUTHORITY = 0
CONSUMED_CONTRACTS = 8 contract groups
CONSUMED_CONTRACTS_REDEFINED = 0
FAILURES_OWNED = 0
FAILURES_CONSUMED = 11 named families / 23 named codes/classes
AMBIGUOUS_FAILURE_OWNERS = 0
NORMATIVE_DEPENDENCIES = 2
NEW_UNAPPROVED_DEPENDENCIES = 0
KNOWN_SPECIFICATION_GAPS = 0 open (target artifact gap closed by this generation)
KNOWN_IMPLEMENTATION_GAPS = 6
ARCHITECTURE_GAPS = 0
PORTFOLIO_OWNERSHIP_GAPS = 0
ACCEPTANCE_CRITERIA = 12
CONFORMANCE_TESTS = 24
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

## Adversarial Validation

- No requirement defines behavior outside `O-073`–`O-078`; local mappings are
  explicitly non-authoritative.
- No upstream contract is copied as a competing source; BACKEND and OPS are
  referenced by stable requirement IDs.
- UI cannot redefine domain state, capacity, effects, publication, retention,
  authentication or email eligibility.
- Cached, optimistic, transport, email and prototype values cannot become
  canonical state or confirmation.
- Publication completion requires exact owner-emitted
  `REMOTE_PUBLICATION_CONFIRMED`.
- Failure presentation preserves all source families and does not silently
  translate canonical meaning.
- Replay, refresh and retry are separated; the client cannot repeat an effect
  merely because the browser reconnects.
- No new architectural question, dependency edge, implementation plan or
  ticket decomposition was introduced.

## Final Gate

```text
READY_FOR_INDEPENDENT_COMPONENT_SPEC_REAUDIT
```

The next step is a fresh independent component SPEC conformance re-audit against
the unchanged accepted authority and upstream contracts.
