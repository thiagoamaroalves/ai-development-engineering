---
schema_version: "1.0.0"
id: SPEC-BACKEND-001
title: Local API, Security and Notifications
status: PROPOSED
revision: 3
date: 2026-09-09
spec_scope: local-application-boundary
portfolio: SPEC-PORTFOLIO-001
portfolio_revision: 2
portfolio_verdict: PORTFOLIO_DECOMPOSITION_APPROVED
portfolio_audit: docs/specs/SPEC-PORTFOLIO-001-decomposition-audit.md
remediation_source_audit: docs/specs/audits/SPEC-BACKEND-001-component-conformance-audit.md
remediation_report: docs/specs/remediations/SPEC-BACKEND-001-component-spec-remediation.md
authoritative_adrs: [ADR-0011, ADR-0012]
related_adrs: [ADR-0001, ADR-0002, ADR-0003, ADR-0004, ADR-0005, ADR-0006, ADR-0007, ADR-0008, ADR-0009, ADR-0010, ADR-0013, ADR-0014]
upstream_dependencies: [SPEC-DOM-001, SPEC-EXEC-001, SPEC-EXEC-002, SPEC-PLAT-001, SPEC-REPO-001, SPEC-GIT-001]
supersedes: []
superseded_by: null
---

# SPEC-BACKEND-001 — Local API, Security and Notifications

## 1. Status

`PROPOSED` — revision 3, remediated against the validated findings in the
latest independent component conformance audit. This specification is ready
for fresh independent component SPEC re-audit; it is not an implementation
plan and does not authorize production code.

Generation baseline:

| Item | Value |
|---|---|
| Target component | `SPEC-BACKEND-001` |
| Governing portfolio | `SPEC-PORTFOLIO-001`, revision `2` |
| Portfolio audit | `docs/specs/SPEC-PORTFOLIO-001-decomposition-audit.md` |
| Portfolio verdict | `PORTFOLIO_DECOMPOSITION_APPROVED` |
| Primary ADRs | `ADR-0011`, `ADR-0012`, revision `3`, `ACCEPTED` |
| Upstream normative SPECs | `SPEC-DOM-001`, `SPEC-EXEC-001`, `SPEC-EXEC-002`, `SPEC-PLAT-001`, `SPEC-REPO-001`, `SPEC-GIT-001` |
| Upstream audit evidence | Latest component audits for all six dependencies report `PASS — COMPONENT_SPEC_CONFORMANT` |
| Repository HEAD inspected | `a58ce959f9b34f3c1c83ed41c01b058d31bf3366` |
| Existing target draft | revision 2, remediated in place |
| Prior Gap Matrix | none found for this component |
| Source component audit | `docs/specs/audits/SPEC-BACKEND-001-component-conformance-audit.md`; `FAIL — COMPONENT_SPEC_NON_CONFORMANT` |
| Remediation state | validated findings addressed; independent re-audit required |

This specification materializes ownership already assigned by the approved
portfolio and does not redefine portfolio boundaries.

## 2. Ownership

### Owns

- the autonomous native Windows C#/.NET application boundary;
- local application-command, query, correlation and realtime transport
  mappings;
- transport replay and reconnection behavior;
- the pre-`ENABLED` onboarding application mode;
- isolated Codex process/session invocation and capture at the backend boundary;
- separation between domain, application, adapters, persistence and API
  responsibilities;
- localhost binding, ephemeral local-session authentication and single-user
  scope;
- reuse of the existing `gh` authentication boundary without copying its
  credentials; and
- intervention-only notification policy, idempotent/auditable delivery and
  intervention records.

These are exactly portfolio obligations `O-060` through `O-068`. This revision
does not change the approved ownership boundary.

### Consumes

- canonical identity, state, command, audit, publication and failure contracts
  from `SPEC-DOM-001`;
- versioned envelopes, manifests, checkpoints, capability registry and
  contract-failure semantics from `SPEC-EXEC-001`;
- session, assignment, capacity, lease, queue and dispatch contracts from
  `SPEC-EXEC-002`;
- durable intent/evidence, idempotency, reconciliation and recovery contracts
  from `SPEC-PLAT-001`;
- enabled-repository, bootstrap, legacy and configuration contracts from
  `SPEC-REPO-001`; and
- Git/GitHub publication, remote-confirmation and publication-failure
  contracts from `SPEC-GIT-001`.

### Does not own

- canonical identities, domain aggregate state machines, command
  preconditions, audit verdicts, findings or publication vocabulary;
- skill schemas, capability registration, assignment eligibility, capacity,
  lease ownership, queue fairness or scheduler state;
- database/journal/outbox semantics, effect idempotency, reconciliation result
  ownership or physical recovery;
- repository configuration, migration, enablement or legacy canonical-path
  semantics;
- Git branches, worktrees, commits, waves, merge, push, PR or remote
  publication confirmation semantics;
- operational retention, backup, export or telemetry authority; or
- frontend navigation, presentation, optimistic state or client authority.

## 3. Portfolio Authority

The governing authority is
`docs/specs/SPEC-PORTFOLIO-001-organization.md`, revision `2`. Its independent
decomposition audit concludes `PORTFOLIO_DECOMPOSITION_APPROVED` with no
unresolved ownership, dependency or architecture finding.

| Portfolio allocation | BACKEND treatment |
|---|---|
| Owned obligations | `O-060` through `O-068` |
| Failure family owned | Local session: `UNAUTHORIZED_LOCAL_SESSION` |
| Transport mapping owner | BACKEND for all consumed failure families |
| New canonical path | owner of `O-060`/`O-061` |
| Legacy compatibility | consumer of REPO, PLAT and GIT owners |
| Historical replay | owner of `O-061` transport replay/reconnect mapping |
| Cutover | consumer of DOM, REPO and GIT owner semantics |
| Retirement | not applicable; backend is not canonical data-retention authority |
| Direct dependencies | DOM, EXEC-001, EXEC-002, PLAT, REPO and GIT |

The portfolio remains authoritative for ownership, dependency direction,
failure ownership, compatibility and projection boundaries.

## 4. ADR Authority

### Primary accepted ADRs

| ADR | Status | Relevant decision |
|---|---|---|
| `ADR-0011` | `ACCEPTED`, revision `3` | autonomous native Windows C#/.NET backend; local API and realtime stream; commands, acceptance/rejection, correlation, snapshots and events; onboarding before `ENABLED`; isolated Codex processes/sessions; cooperative checkpoints; separated domain/application/adapters/persistence/API boundaries |
| `ADR-0012` | `ACCEPTED`, revision `3` | localhost-only API; ephemeral local token; single-user scope; reuse `gh` authentication; protected separate email configuration; intervention-only, idempotent and auditable notifications; intervention records |

### Related accepted ADRs

| ADR | Contract consumed locally |
|---|---|
| `ADR-0001` | canonical identity, immutable snapshot, accepted-revision eligibility and lineage remain DOM-owned |
| `ADR-0002` | domain commands, preconditions, state transitions and publication vocabulary remain owner contracts |
| `ADR-0003` | versioned envelopes, exact snapshots, manifests, checkpoints and fail-closed contract results remain EXEC-001-owned |
| `ADR-0004` | new session/assignment and role segregation remain EXEC-002-owned |
| `ADR-0005` | capacity, leases, queues and dispatch remain EXEC-002-owned |
| `ADR-0006` | intent/evidence/confirmation, idempotency and recovery remain PLAT-owned |
| `ADR-0007` | Git/worktree/commit execution remains GIT-owned |
| `ADR-0008` | GitHub/`gh`, approval and remote publication confirmation remain GIT-owned |
| `ADR-0009` | formal audit verdicts and round limits remain DOM-owned |
| `ADR-0010` | repository configuration, bootstrap and migration remain REPO-owned |
| `ADR-0013` | operational projection, retention, backup and export remain OPS-owned |
| `ADR-0014` | the frontend is a non-authoritative client of backend snapshots, commands and events |

Accepted ADR authority is not replaced by repository behavior, prototype
behavior or an implementation choice.

## 5. Problem Statement

The accepted architecture requires a local backend that continues activities
independently of browser navigation, exposes a protected application boundary,
and carries canonical domain/execution/effect records to clients without
becoming a second domain authority. It must also provide the local security
boundary and deliver only intervention-worthy email alerts.

The repository currently has no C#/.NET backend, API, realtime stream,
localhost session mechanism, `gh` adapter, Codex process supervisor, protected
email configuration or notification delivery implementation. The prototype
contains an in-memory central model and UI flows that simulate command
acceptance, event updates, onboarding, recovery and publication, but it does
not prove a production backend, persistence, authentication, external process
execution or delivery.

Without this boundary, the frontend could become the process owner, transport
could fabricate canonical state, a disconnected client could duplicate a
command, secrets could be exposed, or repeated intervention alerts could be
sent without durable evidence.

This SPEC defines the observable local application, transport, security,
process-capture and notification contract that allows the canonical upstream
owners to be used safely by a headless backend and non-authoritative clients.

## 6. Goals

- The backend remains operational when no frontend page is open (`O-060`).
- Valid application requests expose requested, accepted/rejected and
  confirmed outcomes with stable correlation, snapshots and replayable events
  without redefining domain semantics (`O-061`).
- Onboarding can execute against candidate configuration, bootstrap catalog and
  migration workspace before a repository is `ENABLED` (`O-062`).
- Each activity uses an isolated Codex process/session and captures structured
  output, events, exit, duration and available metrics while respecting
  cooperative checkpoints (`O-063`).
- Localhost-only, ephemeral-token, single-user authentication prevents an
  unauthenticated request from reaching a command or adapter (`O-065`).
- Existing `gh` authentication is reused without copying its credentials into
  the database (`O-066`).
- Email is emitted only for defined intervention events, with idempotent
  delivery and auditable intervention records (`O-067`, `O-068`).

## 7. Non-Goals

- defining domain commands, state transitions, aggregate identity, audit
  verdicts, findings or publication completion;
- defining skill/capability schemas, scheduler eligibility, capacity or lease
  semantics;
- defining database schema, journal/outbox semantics, effect reconciliation or
  recovery classifications;
- defining repository migration/enablement rules or Git/GitHub publication
  rules;
- selecting HTTP routes, stream protocol, token issuance mechanism, email
  provider, template format, database technology or class/module layout;
- defining frontend presentation or operational retention/export policy;
- defining implementation phases, work units, tickets or deployment steps; or
- generating a Gap Matrix, Implementation Plan or production implementation.

## 8. Current Repository State

| Area | Current behavior | Target behavior | Classification |
|---|---|---|---|
| Target component artifact | No `SPEC-BACKEND-001` draft existed before this generation | This normative backend boundary is materialized and ready for independent audit | `SPECIFICATION_GAP` |
| Native .NET backend | No `.cs`, `.csproj` or `.sln` backend artifacts exist | Autonomous native Windows C#/.NET service | `IMPLEMENTATION_GAP` |
| API and realtime transport | No production API, stream or replay transport exists | Local authenticated API and replayable realtime event contract | `IMPLEMENTATION_GAP` |
| Domain/application seams | `src/domain/*` and `src/application/*` contain partial TypeScript identity/lineage work | Backend preserves distinct domain, application, adapter, persistence and API boundaries | `IMPLEMENTATION_GAP` |
| Codex process/session capture | No process supervisor or Codex adapter exists | Isolated process/session per activity with structured capture and cooperative stop | `IMPLEMENTATION_GAP` |
| Onboarding mode | Only prototype onboarding scenarios exist | Candidate-config/bootstrap/workspace mode before `ENABLED` | `IMPLEMENTATION_GAP` |
| Local authentication | No token/session implementation exists | Localhost-only ephemeral token per user session, fail closed | `IMPLEMENTATION_GAP` |
| GitHub credentials | No production `gh` adapter exists | Reuse existing `gh` authentication; no credential copy to database | `IMPLEMENTATION_GAP` |
| Email security and notifications | No email configuration or delivery adapter exists | Protected separate configuration; intervention-only idempotent/auditable alerts | `IMPLEMENTATION_GAP` |
| Prototype | `prototype/src/mockDomain.ts` simulates backend-like commands, events, recovery, onboarding and publication in memory | Evidence only; production backend remains authoritative for transport behavior | `PROTOTYPE_ONLY` |
| Tests | TypeScript identity/lineage tests and prototype tests exist; no backend integration/security/stream tests | Independent positive, negative, replay, isolation and delivery conformance | `IMPLEMENTATION_GAP` |
| Architecture and ownership | Approved portfolio and accepted ADRs fully allocate this boundary | No new architectural decision required | `NON_GAP` |

Repository evidence informs current-state classification only; it does not
change ADR authority, portfolio ownership or dependency direction.

## 9. Owned Architectural Obligations

| Portfolio obligation | ADR authority | Source section | Local treatment |
|---|---|---|---|
| `O-060` | `ADR-0011` | `Decisão` | autonomous native Windows C#/.NET service independent of frontend; `BACKEND-HOST-001` |
| `O-061` | `ADR-0011` | `Decisão` | API/stream mapping for commands, acceptance/rejection, correlation, snapshots, events and replay; `BACKEND-API-001` through `BACKEND-API-004` |
| `O-062` | `ADR-0011` | `Decisão` | pre-`ENABLED` onboarding application mode using candidate configuration, bootstrap catalog and migration workspace; `BACKEND-BOOTSTRAP-001/002` |
| `O-063` | `ADR-0011` | `Decisão` | isolated Codex process/session, structured capture, exit/session/duration/metrics and cooperative checkpoints; `BACKEND-CODEX-001/002` |
| `O-064` | `ADR-0011` | `Decisão` | domain/application/adapters/persistence/API remain separate boundaries; `BACKEND-BOUNDARY-001` |
| `O-065` | `ADR-0012` | `Decisão` | localhost-only, ephemeral-token, single-user local session; `BACKEND-AUTH-001/002` |
| `O-066` | `ADR-0012` | `Decisão` | reuse `gh` authentication without copying credentials to database; `BACKEND-GH-001` |
| `O-067` | `ADR-0012` | `Decisão` | protected separate email configuration and intervention-only message policy; `BACKEND-NOTIFY-001` |
| `O-068` | `ADR-0012` | `Decisão` | idempotent/auditable delivery and intervention record contents; `BACKEND-NOTIFY-002`, `BACKEND-INTERVENTION-001` |

All nine owned obligations are represented by normative requirements,
acceptance criteria and conformance tests below.

## 10. Consumed Contracts

| Owner SPEC | Contract / requirement | Why consumed | Local rule |
|---|---|---|---|
| `SPEC-DOM-001` | `DOM-ID-001`, `DOM-SNAPSHOT-001`, `DOM-LIFE-001`, `DOM-STATE-001` | request, snapshot, event and process records need canonical identity and exact basis | reference canonical IDs/revisions; do not create a backend identity or state machine |
| `SPEC-DOM-001` | `DOM-CMD-001`, `DOM-ADV-001`, `DOM-PUB-001`, `DOM-AUDIT-002/003/006` | API commands and confirmations must preserve domain guards, verdicts, round limits and exact publication basis | map and propagate; never turn an accepted transport request into domain approval or completion |
| `SPEC-EXEC-001` | `EXEC-ENVELOPE-001/002`, `EXEC-VERSION-001/002`, `EXEC-SNAPSHOT-001`, `EXEC-MANIFEST-001/002/003`, `EXEC-CONTRACT-001/002`, `EXEC-HISTORY-001` | backend carries and starts versioned skill activity and replays exact historical results | validate/use registered contracts; preserve fail-closed meanings and historical basis |
| `SPEC-EXEC-002` | `EXEC-SESSION-001/002`, `EXEC-ELIGIBILITY-001`, `EXEC-CYCLE-001`, `EXEC-RESUME-001/002`, `EXEC-DISPATCH-001`, `EXEC-LEASE-001/002`, `EXEC-QUEUE-001` | process dispatch and activity lifecycle require scheduler-owned assignment/session/lease decisions | request/observe dispatch through owner contract; backend cannot create an implicit eligible agent or lease |
| `SPEC-PLAT-001` | `PLAT-PERSIST-001/002`, `PLAT-EFFECT-001/002`, `PLAT-IDEMP-001`, `PLAT-RECON-001/002/003`, `PLAT-RECOVERY-001/002`, `PLAT-RETRY-001/002` | commands, process effects, notifications and recovery need durable intent/evidence and bounded retry | use the PLAT contract; transport replay or process exit never confirms an effect |
| `SPEC-REPO-001` | `REPO-CONFIG-001/002`, `REPO-VALIDATE-001/002`, `REPO-BOOTSTRAP-001/002/003`, `REPO-ENABLE-001/002`, `REPO-FAILURE-001`, `REPO-CUTOVER-001` | backend must expose pre-enable onboarding and normal enabled-repository operations | preserve repository identity, candidate configuration, lifecycle and legacy failure semantics |
| `SPEC-GIT-001` | `GIT-MODE-001`, `GIT-APPROVAL-001`, `GIT-PR-001`, `GIT-CONFIRM-001` | backend transports publication requests and remote evidence | preserve candidate, approval, merge and remote-confirmation distinctions; no backend publication authority |
| `SPEC-OPS-001` | `O-069` through `O-072` operational projection contract | backend emits correlation-rich records for operational observation | provide source events/correlation; OPS owns projection, retention, backup and export |
| `SPEC-UI-001` | `O-073` through `O-078` client contract | browser is a non-authoritative consumer of this boundary | expose requests and confirmed events; never require UI state to continue work |

The first six rows are the six direct normative upstream dependencies required
by the approved DAG. OPS and UI are downstream consumers, not new upstream
dependencies.

## 11. Target Behavioral Model

```text
local client / system trigger
        |
        v
localhost session authentication
        |
        v
application request + correlation
        |
        +--> canonical upstream command/query contract
        |          |
        |          +--> accepted/rejected mapping
        |          +--> durable intent/effect contract where applicable
        |          +--> confirmed canonical event/state mapping
        |
        +--> candidate bootstrap/onboarding path before ENABLED
        +--> isolated Codex process/session adapter and structured capture
        +--> intervention notification policy and delivery record
        |
        v
snapshot / requested-accepted-rejected-confirmed event stream
        |
        +--> replay from durable event basis after reconnect
        +--> OPS/UI projections without authority transfer
```

The backend may coordinate these flows, but canonical identity, domain state,
assignment/lease, persistence/effect, repository, publication and operational
projection meanings remain with their owners.

## 12. Identity and Authority Rules

| Identity / record | Canonical owner | Reference identity | Local correlation | Derived projection |
|---|---|---|---|---|
| `RepositoryId`, `ExecutionId`, `SpecId`, `ActivityId`, `AttemptId`, `SessionId`, `AssignmentId` | DOM/EXEC owners as applicable | request, process and event references | request correlation and stream cursor | labels and client rows |
| Domain command and command result | `SPEC-DOM-001` | canonical command identity and revision | transport request/correlation ID | requested/accepted/rejected/confirmed view |
| `EffectIntentId`, `EffectEvidenceId`, idempotency key | `SPEC-PLAT-001` | effect reference supplied by owner | adapter/process/notification correlation | pending/confirmed delivery/effect row |
| Publication candidate and remote evidence | `SPEC-GIT-001` | candidate/publication identity | API request and stream correlation | publication status projection |
| Local session token | BACKEND transport boundary | opaque reference to current local session | session/request correlation; secret never logged | authenticated/unauthenticated presentation |
| Notification delivery record | BACKEND policy/effect mapping, persisted via PLAT | source intervention event and canonical correlation | delivery-attempt correlation | sent/pending/blocked notification view |
| Event stream cursor | BACKEND transport mapping | durable source event position/basis | reconnect cursor | replay progress indicator |

Backend-local request IDs, stream cursors and delivery keys do not replace
canonical aggregate identities, command IDs, effect identities or publication
identities. Labels, routes and UI status text are projections.

The BACKEND-owned local-session lifecycle is limited to transport security:
`ESTABLISHING → ACTIVE → RENEWING → ACTIVE` on a valid protected handoff, and
`ACTIVE/RENEWING → INVALID` when the session is expired, revoked or otherwise
fails current-token validation. The concrete token lifetime and protected
handoff mechanism remain unfrozen. An `INVALID` session cannot access protected
API or stream operations and must establish a new protected session.

## 13. Normative Requirements

### BACKEND-HOST-001 — Autonomous manually initiated native service

The backend MUST run as an autonomous native Windows C#/.NET service that is
initiated manually and can continue accepted activities when no frontend page
is open. Starting, stopping or reconnecting a browser MUST NOT be required for
activity progress. The backend MUST expose its application boundary
independently of the frontend and MUST NOT impose a rigid domain limit merely
because the first-version deployment targets small local scale. The concrete
manual hosting/start mechanism remains unfrozen.

Authority: `O-060`, `ADR-0011`, `Decisão`.

### BACKEND-API-001 — Application command and query boundary

The backend MUST expose an application boundary that accepts authenticated
commands and queries, maps them to the relevant canonical owner contracts, and
returns a correlation reference. A transport command MUST NOT redefine a
canonical domain command, state, precondition, approval or terminality rule.
Queries MUST return snapshots or owner-supplied records and MUST NOT authorize
an action merely because a snapshot displays an eligible-looking value.

Authority: `O-061`, `ADR-0011`, `Decisão`; consumes `DOM-CMD-001`,
`DOM-STATE-001` and `DOM-ADV-001`.

### BACKEND-API-002 — Requested, accepted/rejected and confirmed outcomes

For every mutating application request, the backend MUST make the request
correlation and the following distinctions observable when applicable:
`requested`, `accepted`, `rejected`, and owner-confirmed outcome. Rejection
MUST preserve the canonical failure meaning and MUST NOT be represented as
accepted, successful or confirmed. Acceptance MUST NOT be represented as
effect or domain confirmation.

Authority: `O-061`, `ADR-0011`, `Decisão`; consumes `DOM-CMD-001`,
`PLAT-EFFECT-001/002` and `EXEC-FAILURE-001`.

### BACKEND-API-003 — Snapshots and realtime event stream

The backend MUST expose snapshots and a realtime event stream carrying
correlated owner records and transport mappings. A stream event MUST identify
the relevant canonical reference, correlation and source/basis sufficient for a
consumer to distinguish a state update, an acceptance/rejection, an effect
result, a process observation and an operational projection. A stream event
MUST NOT imply a confirmation that its canonical source has not emitted.

Authority: `O-061`, `ADR-0011`, `Decisão`; consumes `DOM-SNAPSHOT-001`,
`EXEC-MANIFEST-001`, `PLAT-EFFECT-002` and `GIT-CONFIRM-001`.

### BACKEND-API-004 — Replay and reconnection preserve history

After a client disconnects or presents a stale stream cursor, the backend MUST
replay from the durable source basis or require a fresh snapshot before
continuing the stream. Replay MUST preserve event order/basis, canonical IDs,
failure meaning and confirmed/unconfirmed distinction. Reconnection MUST NOT
reissue a domain command, repeat an external effect, create a new publication
candidate or confirm an effect.

Authority: `O-061`, `ADR-0011`, `Decisão`; consumes `DOM-SNAPSHOT-001`,
`EXEC-HISTORY-001`, `PLAT-RECOVERY-001/002` and `GIT-CONFIRM-001`.

### BACKEND-BOOTSTRAP-001 — Pre-enable onboarding mode

The backend MUST provide an application mode in which onboarding can inspect,
validate and run explicitly allowed bootstrap/migration activities against a
candidate configuration and isolated migration workspace before the target
repository is `ENABLED`. Normal enabled-repository work MUST NOT be required to
start this mode, and a normal capability MUST NOT be silently substituted for
a bootstrap capability.

Authority: `O-062`, `ADR-0011`, `Decisão`; consumes `REPO-BOOTSTRAP-001/002/003`
and `EXEC-REGISTRY-002/003`.

### BACKEND-BOOTSTRAP-002 — Enablement remains owner-gated

The backend MUST route candidate onboarding through the REPO lifecycle and
formal audit/effect contracts. It MUST NOT report `ENABLED`, activate candidate
configuration, or start normal processing from a request, process exit,
transport response or UI state alone. Failed, paused, cancelled or restarted
onboarding MUST remain recoverable without mutating the active configuration.

Authority: `O-062`, `ADR-0011`, `Decisão`; consumes `REPO-ENABLE-001/002`,
`PLAT-EFFECT-002`, `PLAT-RECOVERY-001/002` and `DOM-AUDIT-002`.

### BACKEND-CODEX-001 — Isolated process/session capture

For each dispatched activity, the backend MUST start a new isolated local
Codex process/session as directed by the EXEC-002 assignment/session contract.
It MUST capture available structured output, emitted events, process exit code,
session reference, duration and available consumption metrics, correlated to
the canonical activity/attempt basis. A process exit or parseable output alone
MUST NOT become a domain, audit or effect confirmation.

Authority: `O-063`, `ADR-0011`, `Decisão`; consumes `EXEC-SESSION-001/002`,
`EXEC-DISPATCH-001`, `EXEC-MANIFEST-001` and `EXEC-FAILURE-001`.

### BACKEND-CODEX-002 — Cooperative stop and checkpoint capture

Pause, cancellation and shutdown requests MUST be delivered cooperatively to
the active process/session and MUST preserve the checkpoint and incomplete
effect evidence required by EXEC-001 and PLAT-001. The backend MUST NOT
terminate an active session arbitrarily, discard pending records, or report a
completed activity before the owner contract confirms a safe checkpoint and
any required effect evidence.

Authority: `O-063`, `ADR-0011`, `Decisão`; consumes `EXEC-RESUME-002`,
`PLAT-RETRY-002`, `PLAT-RECOVERY-002` and `DOM-ADV-001`.

### BACKEND-BOUNDARY-001 — Separated application boundaries

The backend MUST preserve distinct responsibility boundaries for canonical
domain behavior, application/orchestration mapping, external adapters,
persistence/effect records and API/transport. A backend mapping, adapter
result, persisted projection or API snapshot MUST NOT become a substitute for
the canonical owner of identity, state, eligibility, effect confirmation or
publication.

Authority: `O-064`, `ADR-0011`, `Decisão`.

### BACKEND-AUTH-001 — Localhost and ephemeral session token

The API and realtime stream MUST listen only on `localhost` and MUST require an
ephemeral token for each local user session. The first-version authorization
model MUST remain single-user: it MUST NOT infer or grant multi-user accounts,
roles or permissions. Session acquisition and renewal MUST use a protected
local handoff; the concrete mechanism and token lifetime remain unfrozen, but
protected handoff is not optional and MUST NOT broaden the single-user scope.
Acquisition MUST establish `ACTIVE`, renewal MUST preserve single-user scope
and return to `ACTIVE`, and invalid or revoked sessions MUST become `INVALID`
and require a new protected acquisition.

Authority: `O-065`, `ADR-0012`, `Decisão`.

### BACKEND-AUTH-002 — Fail-closed local session enforcement

When a request has no valid current local-session token, the backend MUST
return the canonical `UNAUTHORIZED_LOCAL_SESSION` failure mapping and MUST NOT
dispatch a domain command, start a Codex/Git/`gh`/email effect, expose a
protected snapshot, or advance a stream. Token values MUST NOT appear in logs,
events, exception text, notification content or ordinary persisted records.

Authority: `O-065`, `ADR-0012`, `Decisão`; local failure owner is BACKEND per
the portfolio failure registry.

### BACKEND-GH-001 — Reuse existing `gh` authentication

When a GitHub operation is requested, the backend MUST use the existing
authorized `gh` CLI authentication boundary through the GIT adapter contract.
It MUST NOT copy GitHub tokens, credentials or secrets into the application
database, repository configuration, journal, event payload, notification
record or operational projection. A missing or unusable provider session MUST
remain a provider/authentication failure and MUST NOT be reported as remote
publication confirmation.

Authority: `O-066`, `ADR-0012`, `Decisão`; consumes `GIT-APPROVAL-001`,
`GIT-CONFIRM-001` and `PLAT-EFFECT-002`.

### BACKEND-NOTIFY-001 — Protected intervention-only notifications

Email configuration MUST be stored and accessed separately from repository
configuration and protected locally. The backend MUST consider email eligible
only for intervention events: round-limit intervention, exhausted attempts,
blocks, divergences, publication approval, or governance violations. Routine
progress, ordinary state changes and UI refreshes MUST NOT cause email under
this contract. The interface remains the complete operational follow-up
surface; email is an alert, not a state authority.

Authority: `O-067`, `ADR-0012`, `Decisão`; consumes `DOM-AUDIT-003`,
`PLAT-RECON-003`, `GIT-APPROVAL-001` and `REPO-FAILURE-001`.

### BACKEND-NOTIFY-002 — Idempotent and auditable delivery

For one source intervention event, target user/session scope and notification
channel, the backend MUST derive and reuse one stable delivery identity across
retries and restarts. It MUST inspect existing delivery evidence before
retrying, MUST NOT send a duplicate successful delivery for the same identity,
and MUST record pending, delivered, failed or blocked outcomes with correlated
source and effect evidence. Concurrent delivery attempts for one identity MUST
be admitted by the BACKEND notification boundary so that at most one backend
delivery attempt is active for that identity within the running service; losing
attempts MUST wait for or observe the existing PLAT intent/evidence and MUST
NOT invoke the provider independently. PLAT remains the authority for durable
effect identity, evidence, confirmation and evidence-first retry; the backend
local admission rule does not redefine PLAT concurrency semantics. A provider
response without compatible evidence MUST NOT be treated as confirmed delivery.

Authority: `O-068`, `ADR-0012`, `Decisão`; consumes `PLAT-EFFECT-001/002`,
`PLAT-IDEMP-001`, `PLAT-RECON-001/003` and `PLAT-RECOVERY-001`.

### BACKEND-INTERVENTION-001 — Auditable intervention record

Every human intervention initiated through the backend MUST record the event
time, command/action, target, correlated canonical identity, state before,
state after and a non-empty justification. For the current BACKEND scope, every
such human intervention is rationale-applicable; the backend MUST reject or
leave unconfirmed an intervention that lacks the justification before it can
become a confirmed intervention record. A future approved canonical command or
decision contract may explicitly introduce a not-applicable rationale case,
but no current consumed command contract does so and the backend MUST NOT infer
one from a UI label or transport form. The backend MUST preserve the record
through replay and must not let a UI label, transport acknowledgement or email
delivery replace the canonical command/effect evidence.

Authority: `O-068`, `ADR-0012`, `Decisão`; consumes `DOM-CMD-001`,
`PLAT-EFFECT-002` and `OPS` correlation/record projection contracts.

## 14. Commands / Queries / Events

Concrete routes, DTO names and wire protocols remain unfrozen. The semantic
classes are normative:

| Interface | Classification | Backend rule |
|---|---|---|
| Request a domain operation | `APPLICATION_COMMAND` / transport command | authenticate, correlate and delegate to DOM; return requested/accepted/rejected mapping; do not define the domain transition |
| Request pause/resume/cancel/retry/round authorization | `APPLICATION_COMMAND` | map to the owning DOM/EXEC/PLAT contract; show requested state until confirmed evidence |
| Request onboarding inspection/validation/bootstrap/migration | `APPLICATION_COMMAND` | route through REPO bootstrap contracts before `ENABLED`; no normal-path fallback |
| Request publication approval or reconciliation | `APPLICATION_COMMAND` | route to DOM/GIT/PLAT owners; backend cannot approve or confirm on its own |
| Read execution/repository/operation snapshot | `QUERY` | return owner-supplied snapshot with basis and staleness information; query does not authorize action |
| Read event history/replay from cursor | `QUERY` | return durable source events or require fresh snapshot; preserve identity, order and basis |
| Command requested/accepted/rejected | `TRANSPORT_EVENT` | mapping only; canonical reason and correlation are preserved |
| Domain state/event, audit verdict, capacity/lease, effect, repository or publication event | `CANONICAL_EVENT` consumed and `TRANSPORT_EVENT` exposed | source owner supplies meaning; backend transports it without redefinition |
| Process output/exit/metric/checkpoint observation | `INTEGRATION_EVENT` / `TRANSPORT_EVENT` | correlate to activity/attempt/session; observation is not domain confirmation |
| Notification delivery status | `INTEGRATION_EVENT` / `TRANSPORT_EVENT` | expose delivery evidence; does not alter source intervention meaning |
| Operational dashboard item | `PROJECTION_EVENT` | derived for OPS/UI; never becomes canonical state |

## 15. Failure Semantics

### Owned canonical failure

| Failure | Trigger | Meaning | Retry/recovery | Required evidence |
|---|---|---|---|---|
| `UNAUTHORIZED_LOCAL_SESSION` | missing, invalid, expired or non-current local token, or a request outside the single-user local session | the backend cannot authorize the transport request | establish/renew a protected local session; do not retry the protected effect automatically | request correlation, session reference without secret, timestamp, operation class and redacted reason |

The failure is fail-closed: no protected snapshot, command dispatch, process or
external effect begins. The provisional label may receive a local alias during
implementation only if trigger, meaning, retryability, terminality and
redaction are preserved.

### Consumed failures and mappings

| Failure family | Canonical owner | Backend mapping rule |
|---|---|---|
| `UNKNOWN_REPOSITORY`, `REPOSITORY_NOT_ENABLED`, `LEGACY_COMPATIBILITY_ONLY` | `SPEC-REPO-001` | preserve repository meaning; map to transport status/envelope only |
| `UNKNOWN_SPEC`, `INELIGIBLE_REVISION`, `INVALID_COMMAND_BASIS`, `STALE_REVISION`, `INVALID_DEPENDENCY_CLOSURE` | `SPEC-DOM-001` | preserve precondition, basis and terminality; no success fallback |
| `UNKNOWN_CAPABILITY`, `INCOMPATIBLE_CAPABILITY`, `CONTRACT_INVALID`, `VERDICT_UNKNOWN` | `SPEC-EXEC-001` | fail closed and preserve contract/version/basis meaning |
| `CAPACITY_UNKNOWN`, `CAPACITY_EXHAUSTED`, `AGENT_INELIGIBLE` | `SPEC-EXEC-002` | expose queue/wait mapping; do not convert to unauthorized session or command success |
| `EXPECTED_INCOMPLETE_EFFECT`, `MISSING_EFFECT`, `SEMANTIC_DIVERGENCE`, `CONFLICTING_EFFECT` | `SPEC-PLAT-001` | preserve all four distinct results and evidence; transport replay cannot collapse them |
| `PUBLICATION_DRIFT`, `MERGE_CONFLICT`, `REMOTE_PUBLICATION_UNCONFIRMED` | `SPEC-GIT-001` | preserve publication meaning; `PR_MERGED` or process success is not remote confirmation |

The hierarchy is fixed: canonical semantic → application mapping → transport
representation → operational logging → UI presentation. Backend may change
representation, never meaning, retryability, terminality or recovery ownership.

## 16. Retry / Idempotency / Recovery

| Concern | Rule |
|---|---|
| Domain command retry | owner of the domain command decides whether a new request is valid; transport retry does not create a new domain transition implicitly |
| Transport replay | reconnect uses the same request correlation and cursor/basis; it does not reissue a command or effect |
| Codex process retry | EXEC/PLAT determine assignment, session, attempt, checkpoint and bounded retry; backend preserves those identities |
| External effect retry | PLAT/GIT/REPO owners provide deterministic effect keys and evidence-first reconciliation; backend never invents a new key for a transport retry |
| Notification retry | reuse the same notification delivery identity; BACKEND admission permits at most one active delivery attempt for that identity in the running service; inspect PLAT delivery evidence before retrying; bounded operational policy applies |
| Restart | reconstruct from PLAT durable records, EXEC manifest/checkpoint and source-owner evidence; in-memory session state alone is insufficient |
| Pause/cancel/shutdown | request cooperative checkpoint; preserve incomplete intent and evidence; do not report completion from process exit or transport acknowledgement |

Transport replay may append a projection/replay observation but cannot mutate
the original basis, duplicate a confirmed effect, authorize a domain
transition, or turn a stale snapshot into current state.

## 17. Compatibility / Cutover

| Class | BACKEND role | Normative rule |
|---|---|---|
| `NEW_CANONICAL_PATH` | `OWNER` (`O-060`, `O-061`) | new clients use the autonomous local application and transport boundary |
| `LEGACY_COMPATIBILITY` | `CONSUMER` of REPO/PLAT/GIT owners | legacy repository/effect/publication inputs may be mapped to owner contracts but never become a second API, security or state authority |
| `HISTORICAL_REPLAY` | `OWNER` for `O-061` transport replay/reconnect | historical source events, cursors and basis remain interpretable; replay never rewrites canonical history |
| `CUTOVER` | `CONSUMER` of DOM/REPO/GIT owners | backend exposes the source owner's cutover result; it cannot declare enablement or remote publication locally |
| `RETIREMENT` | `NOT_APPLICABLE` | backend owns no independent canonical data-retention retirement; OPS and source owners govern retirement |

Legacy support is an adapter to the new canonical path, not an indefinite
second canonical transport or security authority.

## 18. Projection Boundaries

| Canonical source | Backend projection | Refresh/replay/stale behavior | Authority limit |
|---|---|---|---|
| DOM/EXEC/PLAT/REPO/GIT records | authenticated snapshot and event envelope | refresh/replay from source basis; stale basis blocks action or requires fresh snapshot | transport cannot approve, dispatch, confirm or retire |
| PLAT journal/effect/evidence | effect/recovery event mapping | preserve pending/confirmed/blocked and four reconciliation results | event display cannot confirm an effect |
| Codex process output | correlated process observation | replay persisted output/metrics where available; missing metric remains unknown | output cannot become domain verdict or approval |
| notification delivery record | notification status projection | refresh/replay by delivery identity; stale status requires source evidence | email status cannot change source state |
| OPS operational projection | backend-consumed operational view where needed | stale projection is labeled/reloaded; OPS remains projection owner | backend does not become retention/export authority |

## 19. External Effects

| Semantic | Owner/rule |
|---|---|
| `REQUEST` | client/system request mapped by BACKEND; DOM/REPO/GIT/PLAT own canonical meaning as applicable |
| `INTENT` | PLAT persists intent, correlation and deterministic key before external execution |
| `EXTERNAL_EXECUTION` | BACKEND executes/observes isolated Codex process; GIT/REPO adapters own their external Git/process effects under their contracts; notification provider execution is a backend mapping using PLAT effect controls |
| `EVIDENCE` | process/provider/source owner supplies evidence; PLAT persists effect evidence; GIT owns publication evidence |
| `CONFIRMATION` | source owner/PLAT confirms according to its contract; backend only transports the confirmation |
| `RECONCILIATION` | PLAT owns effect reconciliation; backend reports the result and does not choose a source silently |
| `PROJECTION` | BACKEND exposes transport projections; OPS/UI own operational/client projections |

## 20. Security / Authorization

| Security concern | Authority |
|---|---|
| Transport authentication and local session | BACKEND / `ADR-0012`; localhost and ephemeral token |
| Domain authorization and command preconditions | DOM and the relevant domain owner; backend delegates and preserves rejection |
| Application authorization | BACKEND verifies local session and routes only to allowed owner contracts; no multi-user role model is invented |
| GitHub provider authentication | existing `gh` session through GIT; credentials are not copied |
| Secret storage/redaction | local protected mechanism and redacted persistence/logging; exact storage technology remains unfrozen |
| UI session behavior | UI consumes token/session contract; UI is not an authentication or state authority |

Security tests MUST prove that authentication failure occurs before command
dispatch, process start, database mutation for the protected operation or
external provider call. Redaction applies to logs, events, snapshots,
notifications and audit records.

## 21. Conformance Suite

The independent suite MUST exercise a real headless backend boundary in the
eventual implementation. Current prototype and TypeScript tests are supporting
evidence only.

### Positive

- `C-BACKEND-001`: backend continues an accepted activity while the client is
  disconnected and exposes its confirmed events after reconnect;
- `C-BACKEND-031`: the backend is manually initiated, continues independently
  of browser lifecycle, and does not turn small local deployment scale into a
  rigid domain-limit rejection;
- `C-BACKEND-002`: authenticated command returns one correlation and visibly
  distinguishes requested, accepted/rejected and confirmed outcomes;
- `C-BACKEND-003`: query returns a canonical-basis snapshot and never grants
  authorization from a stale projection;
- `C-BACKEND-004`: onboarding runs through candidate/bootstrap/workspace mode
  before `ENABLED` and promotes only after REPO owner evidence;
- `C-BACKEND-005`: each activity has a distinct Codex process/session and its
  structured output, events, exit, duration and metrics are correlated;
- `C-BACKEND-006`: cooperative pause/cancel/shutdown preserves checkpoint and
  incomplete-effect evidence;
- `C-BACKEND-007`: valid intervention event produces one protected,
  intervention-only notification with an auditable delivery record;
- `C-BACKEND-008`: intervention record contains time, action, target,
  before/after state and required justification.

### Negative and fail-closed

- `C-BACKEND-009`: non-localhost binding or an unauthenticated API/stream
  request is rejected before any protected action;
- `C-BACKEND-010`: invalid/expired token returns `UNAUTHORIZED_LOCAL_SESSION`
  and starts no process or external effect;
- `C-BACKEND-032`: session acquisition and renewal cannot proceed through an
  unprotected mechanism; invalidation transitions the local session to
  `INVALID` and requires a new protected acquisition;
- `C-BACKEND-011`: a transport `accepted` response cannot be used as domain,
  effect, audit or publication confirmation;
- `C-BACKEND-012`: a stale cursor/snapshot cannot dispatch work and requires
  replay or refresh;
- `C-BACKEND-013`: a normal capability cannot run in pre-enable onboarding and
  a failed promotion cannot mutate active configuration;
- `C-BACKEND-014`: an active Codex session is not arbitrarily replaced and
  process exit alone cannot complete an activity;
- `C-BACKEND-015`: GitHub token-like material is rejected/redacted from
  database, journal, event, notification and log records;
- `C-BACKEND-016`: routine progress produces no email, while each defined
  intervention category is eligible exactly once;
- `C-BACKEND-017`: retry after delivery ambiguity reuses the same delivery
  identity and does not create duplicate confirmed email;
- `C-BACKEND-033`: simultaneous backend attempts for one notification delivery
  identity admit one active backend attempt; losing attempts observe the PLAT
  intent/evidence and do not invoke the provider independently;
- `C-BACKEND-018`: canonical failure mappings retain their source code,
  retryability, terminality and recovery meaning.

### Intervention auditability

- `C-BACKEND-034`: every current human intervention in the BACKEND scope is
  rejected or remains unconfirmed when its non-empty justification is absent;

### Boundary isolation

- `C-BACKEND-019`: backend cannot define or change a DOM transition, finding,
  verdict, capability, lease, effect-reconciliation result or publication
  confirmation;
- `C-BACKEND-020`: frontend disconnect, stale UI state or a prototype fixture
  cannot stop or authorize backend work;
- `C-BACKEND-021`: an event/snapshot projection cannot become canonical state or
  identity;
- `C-BACKEND-022`: transport replay cannot reissue a domain command or external
  effect;
- `C-BACKEND-023`: backend does not require OPS/UI to define missing upstream
  behavior and does not reverse the approved dependency DAG.

### Dependency and compatibility conformance

- `C-BACKEND-024`: six upstream contracts are consumed by reference and no
  upstream requirement is redefined locally;
- `C-BACKEND-025`: legacy repository/publication inputs adapt to owner
  contracts without creating a second canonical path;
- `C-BACKEND-026`: historical replay preserves source IDs, basis, order,
  failures and confirmation distinction;
- `C-BACKEND-027`: `gh` authentication is reused and remote publication is not
  confirmed without GIT/PLAT evidence.

### Recovery and synthetic extensibility

- `C-BACKEND-028`: restart/reconnect rebuilds from durable source records and
  declared checkpoints rather than transient memory;
- `C-BACKEND-029`: a synthetic registered capability and a synthetic
  intervention event use the same generic envelopes, stream, capture and
  notification paths without a category-specific backend branch;
- `C-BACKEND-030`: a notification provider failure remains a delivery/effect
  result and does not alter the source domain or operational state.

## 22. Acceptance Criteria

| ID | Binary acceptance criterion | Requirement |
|---|---|---|
| `AC-BACKEND-001` | After manual backend initiation and frontend closure, the backend continues the activity and later exposes the correlated confirmed result; browser lifecycle does not start or stop the activity. | `BACKEND-HOST-001` |
| `AC-BACKEND-002` | A valid mutating request returns one correlation and distinct requested/accepted/rejected/confirmed observations; accepted alone never equals confirmed. | `BACKEND-API-001/002` |
| `AC-BACKEND-003` | A disconnect followed by stale-cursor reconnect replays or requires a fresh snapshot without reissuing a command/effect. | `BACKEND-API-003/004` |
| `AC-BACKEND-004` | Pre-enable onboarding runs only through candidate/bootstrap/workspace contracts, and normal capability execution is rejected before enablement. | `BACKEND-BOOTSTRAP-001` |
| `AC-BACKEND-005` | A failed, paused or restarted promotion leaves active configuration unchanged and does not report `ENABLED` without REPO/PLAT evidence. | `BACKEND-BOOTSTRAP-002` |
| `AC-BACKEND-006` | Two activities produce distinct isolated Codex process/session observations with structured output, exit, duration and available metrics. | `BACKEND-CODEX-001` |
| `AC-BACKEND-007` | Pause/cancel/shutdown yields a cooperative checkpoint or durable incomplete intent and never confirms from process exit alone. | `BACKEND-CODEX-002` |
| `AC-BACKEND-008` | No API, adapter, persistence or projection path can replace the canonical owner of domain state, assignment/lease, effect confirmation or publication. | `BACKEND-BOUNDARY-001` |
| `AC-BACKEND-009` | A non-localhost bind, unprotected token acquisition/renewal, or missing/invalid/expired token is rejected with `UNAUTHORIZED_LOCAL_SESSION` before protected work begins and without secret leakage; only a protected handoff establishes or renews the session. | `BACKEND-AUTH-001/002` |
| `AC-BACKEND-010` | A GitHub operation uses existing `gh` authentication and no token/credential value appears in database, repository config, journal, event, notification or log output. | `BACKEND-GH-001` |
| `AC-BACKEND-011` | Routine progress sends no email, while each defined intervention category is eligible for an authenticated, protected notification. | `BACKEND-NOTIFY-001` |
| `AC-BACKEND-012` | Repeating one notification event after restart or concurrently reusing it from multiple backend workers uses one delivery identity, one active backend delivery attempt, PLAT evidence-first retry, and at most one confirmed delivery. | `BACKEND-NOTIFY-002` |
| `AC-BACKEND-013` | Every current human intervention record contains time, action, target, before/after state and a non-empty justification; absence is rejected or remains unconfirmed, and the record remains replayable. | `BACKEND-INTERVENTION-001` |
| `AC-BACKEND-014` | Each consumed canonical failure retains its source meaning and distinct retryability/terminality after API, stream, OPS or UI mapping. | `BACKEND-API-002/003`, failure rules |
| `AC-BACKEND-015` | A registered synthetic capability and intervention event use generic backend paths without a new category-specific branch or fallback. | `BACKEND-API-001`, `BACKEND-NOTIFY-001` |
| `AC-BACKEND-016` | Independent audit proves no downstream projection, transport acknowledgement, prototype fixture or process exit became canonical authority. | `BACKEND-BOUNDARY-001`, all isolation tests |

## 23. ADR / Obligation / Requirement Traceability

| Requirement | Portfolio obligation | ADR | ADR section | Ownership role | Acceptance / test |
|---|---|---|---|---|---|
| `BACKEND-HOST-001` | `O-060` | `ADR-0011` | `Decisão` | canonical owner | `AC-BACKEND-001`; `C-BACKEND-001`, `C-BACKEND-031` |
| `BACKEND-API-001` | `O-061` | `ADR-0011` | `Decisão` | canonical owner; consumes DOM | `AC-BACKEND-002`; `C-BACKEND-002`, `C-BACKEND-019` |
| `BACKEND-API-002` | `O-061` | `ADR-0011` | `Decisão` | canonical owner; transport mapping | `AC-BACKEND-002`, `AC-BACKEND-014`; `C-BACKEND-011`, `C-BACKEND-018` |
| `BACKEND-API-003` | `O-061` | `ADR-0011` | `Decisão` | canonical owner; transport mapping | `AC-BACKEND-003`, `AC-BACKEND-014`; `C-BACKEND-003`, `C-BACKEND-018` |
| `BACKEND-API-004` | `O-061` | `ADR-0011` | `Decisão` | canonical owner; historical replay owner | `AC-BACKEND-003`; `C-BACKEND-022`, `C-BACKEND-026` |
| `BACKEND-BOOTSTRAP-001` | `O-062` | `ADR-0011` | `Decisão` | canonical owner; consumes REPO/EXEC | `AC-BACKEND-004`; `C-BACKEND-004`, `C-BACKEND-013` |
| `BACKEND-BOOTSTRAP-002` | `O-062` | `ADR-0011` | `Decisão` | canonical owner; consumes REPO/PLAT/DOM | `AC-BACKEND-005`; `C-BACKEND-004`, `C-BACKEND-028` |
| `BACKEND-CODEX-001` | `O-063` | `ADR-0011` | `Decisão` | canonical owner; consumes EXEC | `AC-BACKEND-006`; `C-BACKEND-005`, `C-BACKEND-014` |
| `BACKEND-CODEX-002` | `O-063` | `ADR-0011` | `Decisão` | canonical owner; consumes EXEC/PLAT | `AC-BACKEND-007`; `C-BACKEND-006`, `C-BACKEND-028` |
| `BACKEND-BOUNDARY-001` | `O-064` | `ADR-0011` | `Decisão` | canonical owner | `AC-BACKEND-008/016`; `C-BACKEND-019/021/023` |
| `BACKEND-AUTH-001` | `O-065` | `ADR-0012` | `Decisão` | canonical owner | `AC-BACKEND-009`; `C-BACKEND-009/010`, `C-BACKEND-032` |
| `BACKEND-AUTH-002` | `O-065` | `ADR-0012` | `Decisão` | canonical owner; canonical failure owner | `AC-BACKEND-009`; `C-BACKEND-010`, `C-BACKEND-018` |
| `BACKEND-GH-001` | `O-066` | `ADR-0012` | `Decisão` | canonical owner; consumes GIT/PLAT | `AC-BACKEND-010`; `C-BACKEND-015/027` |
| `BACKEND-NOTIFY-001` | `O-067` | `ADR-0012` | `Decisão` | canonical owner | `AC-BACKEND-011/015`; `C-BACKEND-007`, `C-BACKEND-016`, `C-BACKEND-029` |
| `BACKEND-NOTIFY-002` | `O-068` | `ADR-0012` | `Decisão` | canonical owner; consumes PLAT | `AC-BACKEND-012`; `C-BACKEND-017`, `C-BACKEND-030`, `C-BACKEND-033` |
| `BACKEND-INTERVENTION-001` | `O-068` | `ADR-0012` | `Decisão` | canonical owner; consumes DOM/PLAT/OPS | `AC-BACKEND-013`; `C-BACKEND-008`, `C-BACKEND-026`, `C-BACKEND-034` |

Every normative requirement has one or more explicit portfolio obligations and
accepted ADR authority. No requirement is authorized by repository behavior or
prototype behavior.

## 24. Known Gap Summary

| Gap subject | Classification | Related requirement | Evidence |
|---|---|---|---|
| Production native Windows C#/.NET backend absent | `IMPLEMENTATION_GAP` | `BACKEND-HOST-001`, `BACKEND-BOUNDARY-001` | no `.cs`, `.csproj` or `.sln` files in repository |
| Local API, realtime stream and replay transport absent | `IMPLEMENTATION_GAP` | `BACKEND-API-001` through `BACKEND-API-004` | no backend/API/stream implementation; prototype is in-memory |
| Onboarding application mode absent | `IMPLEMENTATION_GAP` | `BACKEND-BOOTSTRAP-001/002` | only simulated onboarding in `prototype/src/mockDomain.ts` |
| Codex process/session supervision and capture absent | `IMPLEMENTATION_GAP` | `BACKEND-CODEX-001/002` | no native process adapter or checkpoint supervisor |
| Localhost token/session enforcement absent | `IMPLEMENTATION_GAP` | `BACKEND-AUTH-001/002` | no token, local session or redaction implementation |
| `gh` credential boundary absent | `IMPLEMENTATION_GAP` | `BACKEND-GH-001` | no Git/GitHub adapter; ADR only |
| Protected email configuration and delivery absent | `IMPLEMENTATION_GAP` | `BACKEND-NOTIFY-001/002` | no email provider/configuration/delivery implementation |
| Intervention audit records absent | `IMPLEMENTATION_GAP` | `BACKEND-INTERVENTION-001` | prototype records mock events only; no durable backend record |
| Prototype flows and existing TypeScript tests | `PROTOTYPE_ONLY` | all backend requirements | `prototype/src/mockDomain.ts`, `prototype/tests/*`, `src/*`, `tests/*` |
| Component SPEC | `NON_GAP` after this generation | all requirements | this artifact; independent SPEC audit remains downstream |
| Architecture and portfolio ownership | `NON_GAP` | all requirements | approved portfolio audit and accepted ADR-0011/0012 |

This is a known-divergence summary, not the formal Gap Matrix. It assigns no
implementation unit, ticket or closure plan.

## 25. Dependencies

| Dependency SPEC | Contract consumed | Blocking? | Evidence |
|---|---|---:|---|
| `SPEC-DOM-001` | canonical identity, snapshot, lifecycle, commands, states, audit verdicts, publication vocabulary and exact basis | yes | approved portfolio edge `BACKEND → DOM`; audit `PASS — COMPONENT_SPEC_CONFORMANT` |
| `SPEC-EXEC-001` | envelopes, versions, registry, manifests, checkpoints, contract failures and historical replay | yes | approved portfolio edge `BACKEND → EXEC-001`; audit `PASS — COMPONENT_SPEC_CONFORMANT` |
| `SPEC-EXEC-002` | sessions, assignments, cycles, eligibility, capacity, leases, dispatch and queue reasons | yes | approved portfolio edge `BACKEND → EXEC-002`; audit `PASS — COMPONENT_SPEC_CONFORMANT` |
| `SPEC-PLAT-001` | persistence/effect intent, evidence, idempotency, reconciliation, recovery and bounded retry | yes | approved portfolio edge `BACKEND → PLAT`; audit `PASS — COMPONENT_SPEC_CONFORMANT` |
| `SPEC-REPO-001` | enabled repository, bootstrap, configuration, validation, migration and legacy contracts | yes | approved portfolio edge `BACKEND → REPO`; audit `PASS — COMPONENT_SPEC_CONFORMANT` |
| `SPEC-GIT-001` | publication mode, approval, PR drift, remote confirmation and cleanup boundary | yes | approved portfolio edge `BACKEND → GIT`; audit `PASS — COMPONENT_SPEC_CONFORMANT` |

No dependency is added, removed, reversed or made downstream by this SPEC.
OPS and UI are consumers of BACKEND, not backend dependencies.

## 26. Risks

| Risk | Mitigation / conformance |
|---|---|
| Backend becomes a second domain/state authority | `BACKEND-BOUNDARY-001`; `C-BACKEND-019/021` |
| Accepted transport is mistaken for confirmed effect | `BACKEND-API-002/003`; `C-BACKEND-011`, `C-BACKEND-018` |
| Reconnect duplicates a command or effect | `BACKEND-API-004`; `C-BACKEND-003/022` |
| Frontend lifecycle controls backend progress | `BACKEND-HOST-001`; `C-BACKEND-001/020` |
| Pre-enable onboarding becomes circular or unsafe | `BACKEND-BOOTSTRAP-001/002`; `C-BACKEND-004/005/013` |
| Active Codex work is interrupted or silently replaced | `BACKEND-CODEX-001/002`; `C-BACKEND-005/006/014` |
| Token or GitHub credentials leak into records | `BACKEND-AUTH-002`, `BACKEND-GH-001`; `C-BACKEND-010/015` |
| Routine events cause alert fatigue | `BACKEND-NOTIFY-001`; `C-BACKEND-016` |
| Notification retry duplicates email | `BACKEND-NOTIFY-002`; `C-BACKEND-017/030` |
| Legacy/projection path becomes canonical | compatibility and projection rules; `C-BACKEND-020/025/026` |
| Prototype behavior is treated as production evidence | current-state classification; `C-BACKEND-020/023` |

## 27. Implementation Details Intentionally Unfrozen

The following remain implementation choices unless a later accepted ADR freezes
them:

- exact .NET hosting model, process supervision library and service startup
  mechanism, provided native Windows autonomy is preserved;
- HTTP, WebSocket, SSE or another local stream protocol; exact routes, DTOs,
  serialization and status-code vocabulary;
- token issuance, renewal, local handoff and protected storage mechanism;
- database engine, journal/outbox physical layout and event cursor encoding;
- internal classes, modules, namespaces, adapters, dependency injection and
  worker topology;
- exact Codex CLI invocation syntax and parser, provided structured capture and
  correlation requirements hold;
- email provider, SMTP/client library, templates and delivery backoff within
  PLAT's bounded retry/evidence contract;
- exact notification delivery-key encoding, provided equal source inputs yield
  equal identities; and
- frontend framework and client rendering details.

These freedoms cannot change ownership, canonical IDs, failure meanings,
localhost scope, token requirement, `gh` credential non-persistence,
intervention-only policy, evidence ordering or confirmation semantics.

## 28. Open Questions

### IMPLEMENTATION_DETAIL_QUESTION

- Which local stream protocol provides replay and cursor semantics with the
  selected persistence implementation?
- Which protected Windows mechanism delivers and renews the ephemeral local
  token without expanding network exposure?
- Which .NET process API captures the supported Codex structured output and
  metrics consistently?
- Which email provider/client and local secret store satisfy protected
  configuration and auditable delivery?

These questions do not block independent SPEC validation because the accepted
ADRs and portfolio already fix the required behavior and ownership.

### ARCHITECTURAL_QUESTION

None. If a future answer changes canonical ownership, failure meaning,
security scope, notification authority, compatibility, confirmation or the
approved dependency DAG, work MUST stop with `BLOCKED — ARCHITECTURAL DECISION
REQUIRED` or `BLOCKED — PORTFOLIO DECOMPOSITION CHANGE REQUIRED` and a new
approved basis.

## 29. Definition of Done

- portfolio revision `2` has independent verdict
  `PORTFOLIO_DECOMPOSITION_APPROVED`;
- `ADR-0011` and `ADR-0012` are accepted/effective at revision `3`;
- all six upstream normative SPECs have current conformant audit evidence;
- all nine owned obligations `O-060`–`O-068` have complete requirements;
- API, replay, onboarding, process capture, security, `gh`, notification and
  intervention boundaries are explicit;
- `UNAUTHORIZED_LOCAL_SESSION` is the only locally owned canonical failure and
  all consumed failures preserve their owners;
- compatibility, projection and external-effect semantics are explicit;
- every normative requirement has ADR/obligation traceability and binary
  acceptance/conformance coverage;
- repository evidence was inspected and known gaps were classified;
- no architecture gap, portfolio ownership gap, unapproved dependency or
  ambiguous failure owner remains; and
- no Gap Matrix, Implementation Plan, ticket, ADR or production code was
  generated.

## Mechanical Validation

```text
PORTFOLIO_OBLIGATIONS_OWNED = 9
PORTFOLIO_OBLIGATIONS_COVERED = 9
OWNED_OBLIGATIONS_UNCOVERED = 0
NORMATIVE_REQUIREMENTS = 16
REQUIREMENTS_WITHOUT_AUTHORITY = 0
CONSUMED_CONTRACTS = 8 contract groups; 6 normative upstream SPECs
CONSUMED_CONTRACTS_REDEFINED = 0
FAILURES_OWNED = 1 canonical local-session failure
FAILURES_CONSUMED = 10 failure families
AMBIGUOUS_FAILURE_OWNERS = 0
NORMATIVE_DEPENDENCIES = 6
NEW_UNAPPROVED_DEPENDENCIES = 0
KNOWN_SPECIFICATION_GAPS = 0
KNOWN_IMPLEMENTATION_GAPS = 8
ARCHITECTURE_GAPS = 0
PORTFOLIO_OWNERSHIP_GAPS = 0
ACCEPTANCE_CRITERIA = 16
CONFORMANCE_TESTS = 34
```

Required invariants:

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

The following checks were applied after finding-driven remediation:

| Check | Result |
|---|---|
| No behavior outside `O-060`–`O-068` is normatively owned here | PASS |
| No DOM, EXEC, PLAT, REPO or GIT contract is redefined | PASS |
| Backend/API/transport does not become canonical domain, effect or publication authority | PASS |
| No downstream UI/OPS authority is required to complete this SPEC | PASS |
| Dependency direction matches the approved 21-edge portfolio DAG | PASS |
| Local transport mapping preserves canonical failure meaning | PASS |
| Legacy compatibility remains adapter-only and replay preserves historical basis | PASS |
| Implementation details are not presented as requirements | PASS |
| Every owned obligation has a requirement, acceptance criterion and conformance coverage | PASS |
| Repository/prototype evidence did not override accepted ADR authority | PASS |
| Manual backend initiation and small-scale/no-rigid-domain-limit constraints are explicit | PASS |
| Protected token acquisition/renewal and invalidation are mandatory and testable | PASS |
| Notification delivery has a backend-owned concurrent admission and PLAT evidence/idempotency conformance path | PASS |
| Current intervention records require a non-empty justification deterministically | PASS |

## Final Gate

`READY_FOR_INDEPENDENT_COMPONENT_SPEC_REAUDIT`

The next step is a fresh independent component SPEC conformance audit.
