---
schema_version: "1.0.0"
id: SPEC-OPS-001
title: Observability, Retention, Backup and Export
status: PROPOSED
revision: 2
date: 2026-09-09
spec_scope: operational-projection-and-preservation
portfolio: SPEC-PORTFOLIO-001
portfolio_revision: 2
portfolio_verdict: PORTFOLIO_DECOMPOSITION_APPROVED
portfolio_audit: docs/specs/SPEC-PORTFOLIO-001-decomposition-audit.md
authoritative_adrs: [ADR-0013]
related_adrs: [ADR-0001, ADR-0002, ADR-0003, ADR-0006, ADR-0007, ADR-0009, ADR-0011, ADR-0012, ADR-0014]
upstream_dependencies: [SPEC-PLAT-001, SPEC-BACKEND-001]
supersedes: []
superseded_by: null
---

# SPEC-OPS-001 — Observability, Retention, Backup and Export

## 1. Status

`PROPOSED` — revision 2, remediated from the independent component SPEC audit
and ready for fresh independent component SPEC re-audit. This document is a
component specification; it is not an Implementation Plan, ticket set or
authorization to write production code.

Generation baseline:

| Item | Value |
|---|---|
| Target component | `SPEC-OPS-001` |
| Governing portfolio | `SPEC-PORTFOLIO-001`, revision `2` |
| Portfolio audit | `docs/specs/SPEC-PORTFOLIO-001-decomposition-audit.md` |
| Portfolio verdict | `PORTFOLIO_DECOMPOSITION_APPROVED` |
| Primary ADR | `ADR-0013`, revision `3`, `ACCEPTED` |
| Related accepted ADRs inspected | `ADR-0001`, `ADR-0002`, `ADR-0003`, `ADR-0006`, `ADR-0007`, `ADR-0011`, `ADR-0012`, `ADR-0014`, all revision `3` |
| Owned obligations | `O-069` through `O-072` |
| Normative upstream SPECs | `SPEC-PLAT-001` revision `1`; `SPEC-BACKEND-001` revision `3` |
| Upstream audit evidence | `docs/specs/audits/SPEC-PLAT-001-component-conformance-audit.md` and `docs/specs/audits/SPEC-BACKEND-001-component-conformance-audit.md`; both `PASS — COMPONENT_SPEC_CONFORMANT` |
| Repository HEAD inspected | `a58ce959f9b34f3c1c83ed41c01b058d31bf3366` |
| Existing target draft | none found before generation |
| Prior target Gap Matrix | none found |

This specification materializes ownership already assigned by the approved
portfolio and does not redefine portfolio boundaries.

## 2. Ownership

### Owns

- the operational projection of execution and workflow activity;
- operational correlation across repository, execution, SPEC, activity, agent
  and external effect identities;
- operational duration and consumption measurements, without imposing a
  budget;
- retention of logs, events, reports and intermediate artifacts until manual
  deletion;
- automatic backup of the operational database and associated external files;
- restore and export operations that preserve enough evidence to reconstruct an
  execution history; and
- the minimal, auditable record of manually deleted operational material.

These are exactly the portfolio-owned obligations `O-069` through `O-072`.

### Consumes

- durable database, append-only journal, outbox, effect evidence and recovery
  basis from `SPEC-PLAT-001`;
- authenticated application requests, snapshots, replayable transport events
  and correlation from `SPEC-BACKEND-001`;
- canonical identity, lifecycle, state, findings, verdict, publication and
  artifact semantics from their respective owners, carried through the
  approved source contracts;
- exact activity, agent, skill, version, attempt, round, DAG and checkpoint
  records from the EXEC contracts; and
- authenticated application requests mapped by `SPEC-BACKEND-001`; the UI is
  a downstream consumer, not an OPS dependency.

OPS may project, correlate, retain, back up, restore and export consumed
contracts. It may not redefine their canonical meaning.

### Does not own

- canonical domain identities, aggregate state machines, commands,
  preconditions, findings, verdicts or functional completion;
- journal, database, outbox, effect intent, idempotency, reconciliation result
  or physical effect-recovery semantics owned by `SPEC-PLAT-001`;
- API routes, authentication, authorization policy, transport envelopes or
  realtime stream semantics owned by `SPEC-BACKEND-001`;
- agent/session assignment, capability, skill, scheduler, capacity, lease or
  queue semantics owned by EXEC components;
- repository, Git, GitHub, branch, commit, merge, push or publication meaning;
- frontend navigation, interaction, optimistic state or presentation; or
- any retention or export policy for unrelated user data outside the approved
  operational record boundary.

## 3. Portfolio Authority

The governing decomposition is the approved registry in
`docs/specs/SPEC-PORTFOLIO-001-organization.md`, revision `2`. Its independent
audit reports `PORTFOLIO_DECOMPOSITION_APPROVED`, zero unresolved ownership
gaps, zero architecture gaps and an acyclic dependency graph.

| Portfolio allocation | OPS treatment |
|---|---|
| Owned obligations | `O-069`, `O-070`, `O-071`, `O-072` |
| Operational projection | owner of `O-069`; derived from canonical source records |
| Retention | owner of `O-070`; indefinite until manual deletion |
| Backup/export/reconstruction/deletion record | owner of `O-071` |
| Correlation and consumption measurement | owner of `O-072` |
| Legacy compatibility | consumer of `SPEC-REPO-001`, `SPEC-PLAT-001` and `SPEC-GIT-001` owner semantics |
| Historical replay | owner of operational reconstruction/preservation in `O-071`; consumer of canonical replay basis |
| Cutover | `NOT_APPLICABLE`; ADR-0013 defines projection and preservation, not a second canonical path |
| Retirement | owner of `O-070`/`O-071` manual-deletion and preservation records |
| Direct normative dependencies | `SPEC-PLAT-001`, `SPEC-BACKEND-001` |

The portfolio remains authoritative for ownership, failure semantics,
compatibility, projection boundaries and dependency direction.

## 4. ADR Authority

### Primary accepted ADR

| ADR | Status | Relevant decision |
|---|---|---|
| `ADR-0013` | `ACCEPTED`, revision `3` | operational records include state, events, durations, agents, skills, versions, attempts, rounds, consumption, DAG, blocks, Git, verdicts, findings and artifacts; records remain until manual deletion; backups and exports cover reconstructible history; deletion leaves a minimum record; correlation spans repository/execution/SPEC/activity/agent/effect; consumption is measured without a budget |

### Related accepted ADRs

| ADR | Local consumed consequence |
|---|---|
| `ADR-0001` | canonical identities, immutable snapshots and lineage remain source authority; OPS preserves references and basis |
| `ADR-0002` | functional state, command rejection and publication vocabulary remain canonical upstream semantics |
| `ADR-0003` | exact skill/schema/version/manifest/checkpoint basis is preserved for activity history and reconstruction |
| `ADR-0006` | PLAT owns durable database/journal/outbox, intent/evidence, idempotency, reconciliation and restart basis; OPS projects and preserves it |
| `ADR-0007` | Git/worktree/commit history and evidence retain their GIT meaning when operationally projected |
| `ADR-0009` | exact conformance base and externally hash-linked reports/evidence remain part of the audit boundary |
| `ADR-0011` | BACKEND supplies captured session/process/output/duration/metric records and transport replay without transferring authority |
| `ADR-0012` | local session enforcement, credential ownership, intervention semantics and secret redaction remain BACKEND-owned |
| `ADR-0014` | UI consumes operational snapshots/events and requests inspection/export; UI does not become source authority |

Accepted ADR authority is not replaced by repository behavior, prototype
behavior or an implementation choice.

## 5. Problem Statement

The accepted architecture requires an operator to understand long-running
executions after they have completed, failed, been interrupted or crossed
multiple external systems. That requires one correlated operational view of
canonical records, durable preservation, automatic backups and exports that
can reconstruct an execution history.

The repository currently provides only an in-memory React prototype. It shows
mock journal entries, durations, findings, artifacts and an export button, but
it does not provide a production operational projection, database backup,
restore validation, retention service or reconstructible export. The
prototype README explicitly classifies database and backend behavior as
in-memory simulation, and `prototype/src/App.tsx` delegates export to the
mock-domain `EXPORT_EVIDENCE` command.

Without this boundary, operational dashboards can lose lineage, stale views
can be mistaken for current canonical state, automatic cleanup can destroy
audit history, and an export can look complete while omitting the evidence
needed to reconstruct an execution.

This SPEC defines the bounded operational projection and preservation contract
that makes observation, retention, backup, restore and export independently
auditable while preserving canonical ownership elsewhere.

## 6. Goals

- An operational record exposes the complete approved observation set for an
  execution without inventing values or changing source semantics.
- Every material operational record is correlated by repository, execution,
  SPEC, activity, agent and effect identity when the source contract defines
  that dimension.
- Durations and available consumption are measurable and distinguish unknown or
  unavailable measurements from zero; no OPS rule imposes a budget.
- Logs, events, reports and intermediate artifacts remain available until an
  explicitly confirmed manual deletion is recorded.
- Automatic backups and exports include the operational database and associated
  external files needed to reconstruct an execution history.
- Restore and projection replay fail closed on missing, corrupt or incomplete
  evidence and never turn a projection into canonical state.

Each goal is covered by one or more requirements in section 13.

## 7. Non-Goals

- defining domain state, aggregate transitions, command preconditions,
  findings, verdicts or publication completion;
- replacing PLAT's database, journal, outbox, effect or recovery contract;
- redefining BACKEND's API, authentication, authorization, correlation or
  realtime transport contract;
- choosing database, filesystem, archive, compression, serialization, backup
  schedule, route, event-wire, storage or frontend technology;
- defining implementation classes, modules, tables, endpoints, jobs, deployment
  phases, tickets or an Implementation Plan;
- adding a retention period, automatic deletion policy or storage budget not
  authorized by ADR-0013; or
- generating a Gap Matrix or implementing production code.

## 8. Current Repository State

| Area | Current behavior | Target behavior | Classification |
|---|---|---|---|
| Target component SPEC | No OPS component draft existed before this generation | This bounded normative contract is materialized here; independent audit remains pending | `SPECIFICATION_GAP` |
| Production operational projection | No production OPS service or durable operational projection found | Correlated state, events, durations, consumption, DAG, blocks, Git, findings and artifacts are projected from canonical sources | `IMPLEMENTATION_GAP` |
| Database/journal/backup/restore | No production database, journal, outbox, automatic backup or restore implementation found | PLAT-owned durable basis is backed up with associated external files and restorable with integrity evidence | `IMPLEMENTATION_GAP` |
| Export | Prototype `Artifacts` view calls mock `EXPORT_EVIDENCE`; no production export/reconstruction path exists | Export is complete, hash-linked and sufficient to reconstruct one execution history or explicitly reports incompleteness | `IMPLEMENTATION_GAP` |
| Retention/deletion | Prototype marks mock artifacts as retained; no deletion policy or minimum deletion record exists | No automatic expiry; manual deletion is confirmed, bounded and minimally recorded | `IMPLEMENTATION_GAP` |
| Correlation/measurements | Prototype has mock IDs, event text, durations and scenario fields; no durable cross-source correlation contract exists | Stable source identities and measured durations/consumption are preserved with unknown values explicit | `IMPLEMENTATION_GAP` |
| Upstream PLAT and BACKEND contracts | Component SPECs exist at required revisions and their latest independent audits pass | Consume their canonical journal/effect/recovery and transport/replay/auth contracts | `ALREADY_CONFORMANT` |
| Prototype and tests | `prototype/src/mockDomain.ts` and `prototype/tests/*` exercise deterministic in-memory scenarios | Supporting evidence only; no prototype state becomes production authority | `PROTOTYPE_ONLY` |
| Architecture and portfolio ownership | Approved portfolio allocates O-069…O-072 completely to OPS | No new architectural decision or ownership allocation is required | `NON_GAP` |

Repository evidence informs current-state classification only. It cannot alter
ADR authority, portfolio ownership or dependency direction.

## 9. Owned Architectural Obligations

| Portfolio obligation | ADR authority | Source section | Local treatment |
|---|---|---|---|
| `O-069` | `ADR-0013` | `Decisão` | Define the complete operational record and derived projection for state, events, durations, agents, skills, versions, attempts, rounds, consumption, DAG, blocks, Git, verdicts, findings and artifacts |
| `O-070` | `ADR-0013` | `Decisão` | Retain logs, events, reports and intermediate artifacts indefinitely until explicitly confirmed manual deletion |
| `O-071` | `ADR-0013` | `Decisão` and `Consequências` | Provide automatic backup and reconstructible export; include database and associated external files; preserve a minimum deletion record |
| `O-072` | `ADR-0013` | `Decisão` | Correlate repository, execution, SPEC, activity, agent and effect; measure consumption without imposing a budget |

All four owned obligations are represented by normative requirements,
acceptance criteria and conformance tests below.

## 10. Consumed Contracts

| Owner SPEC | Contract / requirement | Why consumed | Local rule |
|---|---|---|---|
| `SPEC-PLAT-001` | `PLAT-PERSIST-001`, `PLAT-PERSIST-002` | operational records originate in durable database, journal and outbox | project journal/effect records without rewriting or deleting source history |
| `SPEC-PLAT-001` | `PLAT-EFFECT-002`, `PLAT-RECON-003`, `PLAT-RECOVERY-001/002` | effect evidence, reconciliation and recovery status must be observable | preserve the four result meanings, evidence and recovery basis; never report completion from a projection alone |
| `SPEC-BACKEND-001` | `BACKEND-API-003`, `BACKEND-API-004` | clients need snapshots, realtime updates, replay and reconnection | consume transport records/events and expose operational projections without changing their semantics |
| `SPEC-BACKEND-001` | `BACKEND-AUTH-001/002`, `BACKEND-INTERVENTION-001` | export, restore and deletion requests cross the local session boundary | require the owner-controlled authenticated request and preserve intervention evidence |
| `SPEC-DOM-001` | canonical identity, state, finding, verdict, publication and `O-054` external report/evidence contracts | the operational view includes these source values and hash-linked conformance evidence | retain exact IDs and labels as derived values; keep operational reports outside Git and linked to audited content by hash; do not define lifecycle or completion |
| `SPEC-EXEC-001` / `SPEC-EXEC-002` | manifest, skill/version, agent/session, attempt, round, DAG and checkpoint contracts | these dimensions are required by O-069 and O-072 | project exact received values and preserve distinction between attempts, rounds, sessions and checkpoints |
| `SPEC-GIT-001` | branch/worktree/commit/publication evidence | Git activity is part of the operational record | project GIT-owned meaning and evidence; do not declare publication complete |

Only `SPEC-PLAT-001` and `SPEC-BACKEND-001` are normative upstream dependencies
in the approved portfolio DAG. The other rows are canonical source or
downstream consumption contracts and do not add dependency edges.

## 11. Target Behavioral Model

```text
canonical owner records + PLAT journal/evidence + BACKEND transport/replay
                                |
                                v
                  validate source basis and correlation
                                |
                                v
          OPS operational projection and measured record
                                |
          +---------------------+----------------------+
          |                     |                      |
          v                     v                      v
  live/replayed view       retention/deletion     backup/restore/export
          |                     |                      |
          +---------------------+----------------------+
                                v
              hash-linked, non-authoritative evidence
```

The projection MUST carry source identity, revision/basis and provenance.
Where a source value is unavailable, it MUST remain explicitly unavailable;
OPS MUST NOT infer a successful state from a missing event, process exit,
transport acknowledgement or stale projection.

## 12. Identity and Authority Rules

| Identity / record | Canonical owner | Reference identity | Local correlation | Derived projection |
|---|---|---|---|---|
| `RepositoryId` | `SPEC-DOM-001` | repository scope for every applicable record | repository correlation dimension | repository name/path label |
| `ExecutionId` | `SPEC-DOM-001` | execution source reference | execution correlation key | operational row/filter |
| `ActivityId` | `SPEC-DOM-001` | activity source reference | activity correlation key | operational row/filter |
| `AttemptId` | `SPEC-DOM-001` | attempt source reference | attempt correlation key | operational row/filter |
| `AgentId` | `SPEC-DOM-001` | agent source reference | agent correlation key | operational row/filter |
| `ExternalEffectId` | `SPEC-DOM-001` | effect source reference; PLAT persists and reconciles the effect record | effect correlation key | operational row/filter |
| `SPEC` identity and revision | `SPEC-DOM-001` | exact SPEC/revision basis | SPEC correlation dimension | displayed title/status |
| functional state, finding, verdict, publication state | canonical source owner | exact state/evidence reference | event/effect correlation | operational status cell |
| operational record identity | `SPEC-OPS-001` | source identities plus projection basis | record/export/backup correlation | dashboard or report row |
| operational event identity | `SPEC-OPS-001` as projection record | source event identity and journal position | correlation dimensions above | timeline entry |
| backup/export artifact identity and hash | `SPEC-OPS-001` as preservation record | capture basis and included-source references | backup/export request correlation | downloadable artifact metadata |
| deletion record identity | `SPEC-OPS-001` | target scope and deletion confirmation | actor/request/time correlation | retention audit entry |
| `RepositoryCandidateId` / `MigrationWorkspaceId` | `SPEC-REPO-001` | candidate configuration/workspace reference | onboarding correlation | operational label only |
| `AgentAssignmentId` / `SessionId` | `SPEC-EXEC-002` | assignment/session reference | dispatch correlation | operational label only |
| journal position / recovery record | `SPEC-PLAT-001` | durable sequence/checkpoint reference | replay correlation | operational recovery evidence |

OPS-local record, backup, export and deletion identities do not replace
canonical domain identities, do not authorize transitions and do not become
the source of functional truth. Mutable labels are never identity substitutes.

## 13. Normative Requirements

### OPS-OBS-001 — Complete operational record coverage

For each observable execution, OPS MUST provide a correlated operational record
covering, when applicable, current state, events, total/active/queued duration,
agents, skills, exact versions, attempts, audit rounds, available consumption,
DAG, blocks, branches/worktrees/commits, verdicts, findings and artifacts. A
field that is not applicable or not available MUST be represented as such and
MUST NOT be fabricated.

Authority: `O-069`, `ADR-0013`, `Decisão`.

### OPS-OBS-002 — Source fidelity and non-authoritative projection

OPS MUST preserve the source identity, revision/basis, value, provenance and
availability of every projected canonical record. A projection, report or
export MUST NOT change a source trigger, meaning, retryability, terminality,
recovery result or authority merely because it is easier to display or store.

Authority: `O-069`, `ADR-0013`, `Decisão`; consumes the source-owner contracts
listed in section 10.

### OPS-OBS-006 — External report placement and audited-content linkage

When OPS stores, projects or exports an operational report or conformance
evidence, the report MUST remain outside Git and MUST preserve a stable hash
relation to the exact audited content that it describes. The operational record,
export or preservation record MUST carry that relation, or MUST explicitly mark
the relation unavailable or invalid and remain incomplete. OPS MUST NOT make the
report a Git-managed canonical source or change the DOM/GIT meaning of the
audited content; DOM remains the canonical owner of conformance-report semantics.

Authority: `O-054`, `O-069`, `O-071`, `ADR-0009`, `Decisão`, and `ADR-0013`,
`Decisão`; consumes the DOM and GIT evidence contracts.

### OPS-OBS-003 — Duration and consumption measurement

OPS MUST expose total, active and queued duration when their source timestamps
are available, and MUST expose available Codex/agent consumption measurements
without imposing a budget. Unknown, unavailable and zero MUST remain
distinguishable. A missing measurement MUST NOT be converted to zero.

Authority: `O-069`, `O-072`, `ADR-0013`, `Decisão`; consumes `BACKEND-CODEX-001`
and the execution activity contracts.

### OPS-OBS-004 — Required correlation dimensions

Every operational event, measurement, finding/evidence projection, backup,
export and deletion record MUST carry the applicable exact correlation for
repository, execution, SPEC, activity, agent and external effect. If a source
does not define one dimension, the record MUST mark that dimension not
applicable rather than substituting a mutable label or unrelated ID.

Authority: `O-072`, `ADR-0013`, `Decisão`.

### OPS-OBS-005 — Ordered and replayable operational history

OPS MUST preserve event ordering and source journal position/basis where
available, and MUST rebuild the operational projection from the durable source
records after replay or reconnection. Replaying the same source history MUST
not create conflicting operational state or duplicate a canonical event.

Authority: `O-069`, `ADR-0013`, `Decisão`; consumes `PLAT-PERSIST-002`,
`PLAT-RECOVERY-001/002` and `BACKEND-API-004`.

### OPS-RET-001 — Indefinite retention until manual deletion

Logs, events, reports and intermediate artifacts within the approved
operational record boundary MUST remain retained indefinitely unless an
explicit manual deletion operation is confirmed. OPS MUST NOT apply a fixed
automatic expiry, silently compact required history or delete source-linked
material as a side effect of projection refresh.

Authority: `O-070`, `ADR-0013`, `Decisão`.

### OPS-RET-002 — Confirmed manual deletion

Manual deletion MUST require an explicit authenticated request, explicit
confirmation, a bounded target scope, a stable expected target basis and a
correlation to the operator and request. The request MUST bind that scope and
basis before destructive application. If the target basis is stale or cannot be
validated, OPS MUST reject the request without deleting material and require a
new explicit request. Before destructive deletion is reported as confirmed, OPS
MUST record the deletion result and minimum evidence of what was removed,
including target scope, expected basis, time, actor/request correlation and
retained counts or hashes when available.

Authority: `O-070`, `O-071`, `ADR-0013`, `Decisão`; consumes
`BACKEND-AUTH-001/002` and `BACKEND-INTERVENTION-001`.

### OPS-RET-003 — Deletion does not rewrite canonical history

Manual deletion MUST NOT rewrite a retained canonical journal entry, alter the
meaning of a domain/effect/publication record or make a previously unconfirmed
operation appear confirmed. The minimum deletion record remains available
after the targeted operational material is removed, subject to the same
approved retention boundary.

Authority: `O-070`, `O-071`, `ADR-0013`, `Decisão`; consumes
`PLAT-PERSIST-002` and source-owner contracts.

### OPS-RET-004 — Deletion lifecycle and destructive concurrency

OPS MUST expose the logical lifecycle of each manual deletion request as
`REQUESTED`, `CONFIRMATION_REQUIRED`, `REJECTED`, `CANCELLED`, `IN_PROGRESS`,
`CONFIRMED`, `PARTIAL` or `FAILED`. A request MUST NOT remove target material
before its authenticated scope, explicit confirmation, expected basis and
minimum deletion record are accepted. `CONFIRMED` is permitted only when the
bound target scope is fully removed or explicitly proven absent and the
minimum deletion record remains retrievable.

Valid transitions are `REQUESTED` to `CONFIRMATION_REQUIRED` or `REJECTED`,
`CONFIRMATION_REQUIRED` to `IN_PROGRESS`, `CANCELLED` or `REJECTED`,
`IN_PROGRESS` to `CONFIRMED`, `PARTIAL` or `FAILED`, and `PARTIAL` or `FAILED`
back to `IN_PROGRESS` only for recovery of the same request and basis.
`CONFIRMED`, `CANCELLED` and `REJECTED` are terminal states.

Duplicate confirmation for the same request identity MUST return the existing
state and evidence without a second destructive application. Distinct requests
whose target scopes overlap MUST NOT be applied concurrently; an overlapping
request is rejected with an explicit conflict and cannot widen the earlier
scope. Cancellation is permitted before `IN_PROGRESS`; after destructive
application begins, cancellation MUST return the current state and MUST NOT
create an alternate terminal result. A partial or failed operation MUST remain
unconfirmed, preserve completed and remaining scope plus diagnostic evidence,
and be retryable using the original request identity and basis without repeating
completed removals. If the minimum deletion record cannot be preserved before
destructive application, no target material may be removed.

Authority: `O-070`, `O-071`, `ADR-0013`, `Decisão`; consumes
`ADR-0006` preservation and recovery semantics plus
`BACKEND-INTERVENTION-001`.

### OPS-BACKUP-001 — Automatic backup coverage

OPS MUST perform automatic backups of the operational database and the
associated retained external files required by the operational record. A
backup MUST identify its capture basis, scope, creation result and integrity
evidence. The exact schedule and storage technology remain unfrozen.

Authority: `O-071`, `ADR-0013`, `Decisão` and `Consequências`.

### OPS-BACKUP-002 — Backup includes reconstructive evidence

Each backup or restore source MUST include, or explicitly reference by stable
identity and integrity hash, the database records, append-only journal/outbox
history, effect/publication evidence, reports and external artifacts needed to
reconstruct an execution. A backup MUST NOT claim complete coverage when a
required associated file or source range is absent.

Authority: `O-071`, `ADR-0013`, `Decisão` and `Consequências`; consumes
`PLAT-PERSIST-001/002`, `PLAT-EFFECT-002` and GIT evidence contracts.

### OPS-BACKUP-003 — Fail-closed restore

Restore MUST validate the backup basis, integrity evidence, source references
and associated-file completeness before exposing a restored operational
projection as usable. On corruption, missing association, inconsistent hash or
incomplete source range, restore MUST reject or mark the projection
incomplete, preserve the diagnostic evidence and MUST NOT report execution or
effect completion solely because a partial restore succeeded.

Authority: `O-071`, `ADR-0013`, `Consequências`; consumes
`PLAT-RECOVERY-001/002` and the canonical source contracts.

### OPS-EXPORT-001 — Reconstructible execution export

An export for an execution MUST contain a self-describing, correlated history
of the applicable source records, ordered events, durations, agents, skills,
versions, attempts, rounds, consumption, DAG, blocks, Git evidence, verdicts,
findings and artifacts. An independent reader MUST be able to reconstruct the
execution timeline and distinguish requested, accepted, rejected, confirmed,
pending and blocked outcomes when those source states exist.

Authority: `O-071`, `O-069`, `ADR-0013`, `Decisão`.

### OPS-EXPORT-002 — Hash-linked export integrity

Every export MUST identify its capture basis, included records/files, source
references and integrity hashes. Exporting MUST preserve canonical IDs,
revisions and source provenance, and MUST NOT rewrite a source record to make
the exported history internally consistent.

Authority: `O-071`, `O-069`, `ADR-0013`, `Decisão`; consumes
`PLAT-PERSIST-002`, effect/publication evidence and `DOM-SNAPSHOT-001`.

### OPS-EXPORT-003 — Incomplete export is explicit

If any required source record, event range, associated artifact or integrity
check is unavailable, OPS MUST either reject the export or mark it explicitly
incomplete with the missing scope and diagnostic evidence. It MUST NOT label a
partial export as a reconstructible complete execution.

Authority: `O-071`, `ADR-0013`, `Decisão`; consumes `PLAT-RECOVERY-002` and
`BACKEND-API-004`.

### OPS-REPLAY-001 — Projection recovery and stale behavior

After restart, restore or transport reconnection, OPS MUST rebuild its
operational projection from the authoritative durable basis and source
contracts. A stale cursor, missing event or stale projection hash MUST cause
replay from the durable basis or an explicit incomplete/stale result; it MUST
NOT silently retain a value that conflicts with newer correlated evidence.

Authority: `O-069`, `O-071`, `ADR-0013`, `Decisão`; consumes
`PLAT-RECOVERY-001/002` and `BACKEND-API-004`.

### OPS-REPLAY-002 — Projection replay is idempotent

Replaying or re-importing the same backup/export/source range MUST be
idempotent for the OPS projection: it MUST preserve one logical operational
record per source identity and basis, retain provenance and MUST NOT duplicate
or mutate canonical source history. A materially different basis MUST remain
distinguishable as a new capture/projection basis.

Authority: `O-069`, `O-071`, `ADR-0013`, `Decisão`; consumes
`PLAT-PERSIST-002` and `BACKEND-API-004`.

### OPS-EXT-001 — Capability-neutral operational coverage

Operational projection and export MUST represent a newly registered capability
or activity using the same identity, correlation, duration, consumption,
attempt, event, artifact and failure-source rules when those source contracts
provide them. OPS MUST NOT require a category-specific branch, page or
canonical fallback to observe or export such a record.

Authority: `O-069`, `O-072`, `ADR-0013`, `Decisão`; consumes the versioned
capability and activity contracts from EXEC.

## 14. Commands / Queries / Events

OPS defines operational application operations and derived records, not domain
commands. Concrete routes, DTOs and wire protocols remain BACKEND-owned or
unfrozen.

| Interface | Classification | Rule |
|---|---|---|
| Read operational execution record | `QUERY` | returns a complete correlated projection with source basis and availability markers |
| Subscribe/replay operational history | `QUERY` / `PROJECTION_EVENT` | replays from durable source basis and preserves source ordering and provenance |
| Request automatic backup | `APPLICATION_COMMAND` | schedules or runs OPS-owned preservation; does not change functional state |
| Restore backup | `APPLICATION_COMMAND` | validates capture basis and associated files before publishing a usable projection |
| Export execution history | `APPLICATION_COMMAND` / `QUERY` | produces a hash-linked reconstructible export or explicit incomplete result |
| Request manual deletion | `APPLICATION_COMMAND` | creates a bounded, basis-bound request in the deletion lifecycle; does not delete before confirmation and minimum-record preservation |
| Confirm manual deletion | `APPLICATION_COMMAND` | requires BACKEND-owned authenticated request and explicit confirmation; leaves minimum deletion record |
| Operational record updated | `OPERATIONAL_EVENT` | derived OPS record; source semantic owners remain authoritative |
| Backup/export/deletion result | `INTEGRATION_EVENT` / `PROJECTION_EVENT` | reports the OPS preservation operation, lifecycle state and evidence, not a domain transition |
| Domain, effect, publication or transport event | `CANONICAL_DOMAIN_EVENT`, `INTEGRATION_EVENT` or `TRANSPORT_EVENT` according to source | OPS records/correlates/projects it without redefining its meaning |

## 15. Failure Semantics

OPS owns no canonical semantic failure family. It is the approved operational
logging and projection owner for the following consumed families. The source
owner remains responsible for trigger, meaning, retryability, terminality and
recovery.

| Failure family | Canonical owner | OPS local treatment |
|---|---|---|
| Repository: `UNKNOWN_REPOSITORY`, `REPOSITORY_NOT_ENABLED` | `SPEC-REPO-001` | preserve code, target and correlation in the operational record |
| SPEC/revision: `UNKNOWN_SPEC`, `INELIGIBLE_REVISION` | `SPEC-DOM-001` | project exact code and basis; do not infer a replacement revision |
| Capability: `UNKNOWN_CAPABILITY`, `INCOMPATIBLE_CAPABILITY` | `SPEC-EXEC-001` | project exact contract/version failure and availability |
| Dependency closure: `INVALID_DEPENDENCY_CLOSURE` | `SPEC-DOM-001` | record block and source evidence without creating a new failure meaning |
| Command basis: `INVALID_COMMAND_BASIS`, `STALE_REVISION` | `SPEC-DOM-001` | preserve rejection and stale basis; do not mark accepted or confirmed |
| Local session: `UNAUTHORIZED_LOCAL_SESSION` | `SPEC-BACKEND-001` | retain an operational diagnostic only when authorized by BACKEND; do not bypass auth |
| Capacity/eligibility: `CAPACITY_UNKNOWN`, `CAPACITY_EXHAUSTED`, `AGENT_INELIGIBLE` | `SPEC-EXEC-002` | project waiting/blocking meaning and source evidence |
| Contract/verdict: `CONTRACT_INVALID`, `VERDICT_UNKNOWN` | `SPEC-EXEC-001` | preserve fail-closed source result and exact contract basis |
| Effect reconciliation: `EXPECTED_INCOMPLETE_EFFECT`, `MISSING_EFFECT`, `SEMANTIC_DIVERGENCE`, `CONFLICTING_EFFECT` | `SPEC-PLAT-001` | project all four distinctly; never collapse them to success or one OPS failure |
| Publication: `PUBLICATION_DRIFT`, `MERGE_CONFLICT`, `REMOTE_PUBLICATION_UNCONFIRMED` | `SPEC-GIT-001` | preserve publication stage and remote evidence; never declare completion |
| Legacy compatibility: `LEGACY_COMPATIBILITY_ONLY` | `SPEC-REPO-001` | mark compatibility provenance and preserve owner semantics |

Local backup/export/restore diagnostics such as incomplete scope, invalid
capture, missing file or integrity mismatch are operational results attached to
`O-071`; they do not replace a source canonical failure family. OPS MUST use
the hierarchy:

```text
canonical semantic → application mapping → transport representation
                   → operational projection/logging → UI presentation
```

`FAILURES_OWNED = 0`; the 11 families above are consumed for projection.

## 16. Retry / Idempotency / Recovery

OPS does not own domain-command retry, external-effect retry, effect
idempotency, reconciliation classification or safe-checkpoint declaration.
Those semantics remain with DOM, PLAT, EXEC and effect owners.

OPS does own the following operational preservation rules:

- repeating projection replay for the same source basis is idempotent under
  `OPS-REPLAY-002`;
- a backup/export retry MUST preserve the original capture/request correlation
  and MUST NOT alter canonical source records; a new capture basis is recorded
  as a distinct preservation record;
- restore MUST be evidence-first and fail closed under `OPS-BACKUP-003`; a
  partial restore is never completion evidence; and
- after restart or reconnect, OPS replays the durable source basis and marks
  missing/stale ranges rather than silently filling them.

Operational retries may be implemented with different scheduling or storage
mechanisms, provided these rules and source-owner recovery semantics remain
observable.

## 17. Compatibility / Cutover

| Compatibility class | OPS role | Normative rule |
|---|---|---|
| `NEW_CANONICAL_PATH` | `OWNER` for `O-069`, `O-072` | the OPS operational projection is the canonical operational record for its bounded view, but it remains derived from source owners |
| `LEGACY_COMPATIBILITY` | `CONSUMER` of REPO/PLAT/GIT owner rules | legacy records may be projected with provenance; legacy data cannot become a second canonical state or effect path |
| `HISTORICAL_REPLAY` | `OWNER` for `O-071`; consumer of PLAT/source replay basis | historical exports/backups preserve the original basis, IDs, hashes and source semantics; records are not rewritten |
| `CUTOVER` | `NOT_APPLICABLE` | ADR-0013 does not authorize an OPS functional-path cutover; source owners govern canonical transitions |
| `RETIREMENT` | `OWNER` for `O-070`/`O-071` | only confirmed manual deletion may remove approved operational material, and the minimum deletion record remains |

There is no implementation phase or retirement schedule in this SPEC. Legacy
support is an adapter/projection concern and never a second canonical path.

## 18. Projection Boundaries

| Projection | Canonical source | Refresh/replay behavior | Stale behavior | Authority limit |
|---|---|---|---|---|
| Functional state/lifecycle | DOM owner | consume exact source event/snapshot basis | reload/replay or mark stale | OPS cannot transition or approve |
| Findings/verdicts/conformance | DOM/EXEC owners | preserve finding/verdict identity and revision | show stale/unknown until refreshed | OPS cannot resolve or change verdict |
| Effect/reconciliation evidence | PLAT owner | consume journal/evidence and distinguish all four results | preserve pending/blocked/incomplete evidence | OPS cannot retry, confirm or reconcile |
| Git/publication evidence | GIT owner | consume branch/commit/remote evidence | preserve publication stage and unknown confirmation | OPS cannot declare remote publication |
| Transport acceptance/rejection | BACKEND mapping owner | consume replayable correlated events | reconnect/replay or show incomplete stream | OPS cannot change canonical failure meaning |
| Operational record/timeline | OPS owner | rebuild from all approved source records | explicit stale/incomplete projection | OPS is authoritative only for its operational record |
| Operational report/conformance evidence | DOM/GIT source owners | preserve external report and exact audited-content hash relation | missing or invalid relation is explicit incomplete evidence | OPS is a non-authoritative preservation/projection boundary |
| Backup/export/deletion record | OPS owner | validate capture and preserve hashes/provenance | reject or mark incomplete | preservation record cannot become functional state |

## 19. External Effects

OPS distinguishes preservation operations from the external effects whose
functional meaning is owned elsewhere:

| Stage | OPS treatment |
|---|---|
| Request | accept an authenticated application request mapped by BACKEND |
| Intent | record the backup/export/restore/deletion preservation intent and scope |
| External execution | invoke an unfrozen storage/archive/filesystem mechanism without redefining source effects |
| Evidence | record capture, file coverage, hashes, source range and provider/storage evidence |
| Confirmation | confirm only the OPS preservation operation after evidence validation |
| Reconciliation | mark incomplete/conflicting capture and route recovery deterministically: PLAT for database/journal/outbox/effect evidence, GIT for publication evidence, BACKEND for transport/session capture; otherwise retain an OPS `INCOMPLETE` result requiring operator intervention; do not silently overwrite source history |
| Projection | expose the preservation result as a derived operational record |

OPS does not own Git, GitHub, Codex, publication, repository or domain effects.
A successful backup/export operation is not a successful workflow or external
effect confirmation.

## 20. Security / Authorization

OPS consumes the local authenticated session and intervention contract from
`SPEC-BACKEND-001`. It MUST reject or leave unconfirmed any backup, restore,
export or deletion request that is not delivered through the owner-controlled
authenticated application boundary. It does not define token issuance,
localhost binding or multi-user roles.

OPS MUST preserve BACKEND's secret-redaction boundary: operational logs,
backups and exports MUST NOT expose raw local session tokens, GitHub
credentials or protected mail configuration. Redaction/credential ownership
remains BACKEND-owned; OPS applies the consumed rule to its preservation
records.

Deletion and restore are destructive or state-changing operational actions;
their actor, request correlation, scope, confirmation and result must be
recorded under `OPS-RET-002` and `BACKEND-INTERVENTION-001`.

## 21. Conformance Suite

The following tests are independent conformance tests, not implementation
tasks. They can be realized at any suitable boundary while preserving the
specified evidence.

### Positive

| ID | Scenario | Expected evidence |
|---|---|---|
| CT-OPS-001 | Project a complete execution with all available source records | all O-069 dimensions appear with exact IDs/provenance |
| CT-OPS-002 | Project a record with unavailable consumption | unavailable is distinct from zero and no budget is imposed |
| CT-OPS-003 | Correlate repository, execution, SPEC, activity, agent and effect records | one exact correlation chain is observable |
| CT-OPS-004 | Replay an ordered journal after reconnect | projection matches source order and basis |
| CT-OPS-005 | Retain logs/events/reports/artifacts without a time-based expiry | no automatic deletion occurs |
| CT-OPS-006 | Confirm bounded manual deletion | target, actor, time, correlation and minimum removal evidence remain |
| CT-OPS-007 | Create an automatic backup | database and associated external files are covered and hash-linked |
| CT-OPS-008 | Restore a complete backup | usable projection is exposed only after integrity/completeness checks |
| CT-OPS-009 | Export one execution | independent reader can reconstruct timeline and outcome distinctions |
| CT-OPS-010 | Re-import the same source basis twice | one logical OPS projection remains with preserved provenance |
| CT-OPS-011 | Add a synthetic capability/activity through EXEC contracts | observation/export works without category-specific OPS authority |

### Negative and fail-closed

| ID | Scenario | Expected evidence |
|---|---|---|
| CT-OPS-012 | Missing source event or required artifact during export | export rejected or explicitly incomplete; never complete |
| CT-OPS-013 | Corrupt backup hash or missing associated file | restore rejected/incomplete with diagnostic evidence |
| CT-OPS-014 | Attempt automatic retention expiry | operation is refused; retained history is unchanged |
| CT-OPS-015 | Delete without authenticated request or explicit confirmation | no target material is deleted and no confirmed result is emitted |
| CT-OPS-016 | Replay stale cursor against newer source basis | durable replay or explicit stale/incomplete result, never silent stale success |
| CT-OPS-017 | Source reports `CONFLICTING_EFFECT` and projection receives it | exact PLAT meaning remains distinct and no success is shown |
| CT-OPS-018 | Export includes a secret-bearing source field | secret is redacted/excluded and source security evidence is preserved |
| CT-OPS-027 | Preserve an operational report for audited content | report remains outside Git and the preservation/projection record carries the exact audited-content hash relation; missing or invalid relation is incomplete |

### Boundary isolation

| ID | Scenario | Expected evidence |
|---|---|---|
| CT-OPS-019 | Try to change a DOM state, finding, verdict or GIT publication state through OPS | no canonical transition occurs; OPS remains a projection |
| CT-OPS-020 | Try to redefine a PLAT reconciliation result or BACKEND failure mapping in an OPS export | source contract and failure meaning remain unchanged |
| CT-OPS-021 | Try to make a projection or export the canonical source of truth | downstream consumer receives source reference/basis; no authority transfer occurs |
| CT-OPS-022 | Try to require UI or another downstream component to define OPS retention/export semantics | OPS contract remains complete and downstream remains consumer-only |

### Compatibility, recovery and preservation

| ID | Scenario | Expected evidence |
|---|---|---|
| CT-OPS-023 | Replay a legacy record through the approved adapter | provenance marks legacy compatibility; no second canonical path exists |
| CT-OPS-024 | Restore historical execution after newer records exist | original IDs, revisions, hashes and event order remain resolvable |
| CT-OPS-025 | Restart with partial source range | projection marks missing range and does not report complete history |
| CT-OPS-026 | Repeat backup/export request after an interrupted capture | request/capture correlation is preserved and canonical source is unchanged |
| CT-OPS-028 | Correlate canonical and local identities across a repository candidate, execution and effect | `RepositoryId`, `ExecutionId`, `ActivityId`, `AttemptId`, `AgentId` and `ExternalEffectId` resolve to `SPEC-DOM-001`; REPO/EXEC/PLAT local references cannot substitute |
| CT-OPS-029 | Cancel or partially fail a manual deletion request | lifecycle state is explicit, no deletion occurs before minimum-record preservation, and partial/failed results are never confirmed |
| CT-OPS-030 | Confirm the same deletion twice or submit overlapping/stale requests | duplicate confirmation is idempotent; overlap is rejected; stale basis is rejected; no scope is widened or applied twice |
| CT-OPS-031 | Retry a partially applied deletion after restart | original request/basis and deletion record are retained, completed targets are not repeated, remaining scope and diagnostics are explicit |
| CT-OPS-032 | Reconcile incomplete or conflicting preservation evidence | routing selects PLAT, GIT, BACKEND or the explicit OPS incomplete/operator-intervention result according to the affected evidence; no vague or silent route is used |

## 22. Acceptance Criteria

| ID | Given / When | Then | Requirement |
|---|---|---|---|
| AC-OPS-001 | Given a complete source execution | the operational record contains every applicable O-069 category and explicit availability markers | `OPS-OBS-001` |
| AC-OPS-002 | Given a source value with identity, revision and provenance | projection/export preserves all three and cannot change source meaning | `OPS-OBS-002` |
| AC-OPS-003 | Given timestamps and an unavailable consumption metric | total/active/queued duration is measurable and unavailable is not zero | `OPS-OBS-003` |
| AC-OPS-004 | Given records spanning all six correlation dimensions | every applicable record resolves to the exact source IDs or explicit N/A | `OPS-OBS-004` |
| AC-OPS-005 | Given the same durable history replayed twice | ordered projection is stable and canonical events are not duplicated | `OPS-OBS-005` |
| AC-OPS-006 | Given retained operational material and no manual deletion confirmation | material remains available with no TTL deletion | `OPS-RET-001` |
| AC-OPS-007 | Given a deletion request without confirmation | no deletion is confirmed and retained material is unchanged | `OPS-RET-002` |
| AC-OPS-008 | Given confirmed manual deletion | minimum target/actor/time/correlation/removal evidence remains | `OPS-RET-002` |
| AC-OPS-009 | Given a deletion operation | canonical journal/effect/publication meaning and completion status remain unchanged | `OPS-RET-003` |
| AC-OPS-010 | Given automatic backup execution | database and associated external files are included with capture integrity evidence | `OPS-BACKUP-001` |
| AC-OPS-011 | Given an associated file or journal range is missing | backup/restore cannot claim complete coverage | `OPS-BACKUP-002` |
| AC-OPS-012 | Given a corrupt or incomplete backup | restore rejects or marks incomplete and never proves completion from partial data | `OPS-BACKUP-003` |
| AC-OPS-013 | Given an export request for a complete execution | independent reader reconstructs the ordered history and outcome distinctions | `OPS-EXPORT-001` |
| AC-OPS-014 | Given an export with source records and files | capture basis, provenance and hashes are present; sources are not rewritten | `OPS-EXPORT-002` |
| AC-OPS-015 | Given any missing required export input | export is rejected or explicitly incomplete, never complete | `OPS-EXPORT-003` |
| AC-OPS-016 | Given restart/reconnect with a stale cursor | OPS replays durable basis or exposes stale/incomplete evidence | `OPS-REPLAY-001` |
| AC-OPS-017 | Given repeated import of one unchanged source basis | one logical projection remains and provenance is preserved | `OPS-REPLAY-002` |
| AC-OPS-018 | Given a newly registered capability/activity with normal source contracts | it is observable/exportable without a category-specific OPS branch | `OPS-EXT-001` |
| AC-OPS-019 | Given an operational report or conformance evidence for audited content | it remains outside Git and its OPS record carries the exact audited-content hash relation, or is explicitly incomplete when that relation is unavailable or invalid | `OPS-OBS-006` |
| AC-OPS-020 | Given canonical and local repository, execution, activity, attempt, agent and effect references | all six canonical identities resolve to DOM and REPO/EXEC/PLAT local references remain distinct non-substitutes | identity rules in section 12 |
| AC-OPS-021 | Given a manual deletion request | the logical lifecycle is observable and no destructive action occurs until authenticated scope, explicit confirmation, expected basis and minimum-record preservation are accepted | `OPS-RET-002`, `OPS-RET-004` |
| AC-OPS-022 | Given duplicate, overlapping, stale, cancelled or partially failed deletion requests | duplicate confirmation is idempotent, overlap/stale basis is rejected, cancellation and partial/failure states are explicit, and retry preserves the request/basis without repeating completed removals | `OPS-RET-002`, `OPS-RET-004` |
| AC-OPS-023 | Given incomplete or conflicting preservation evidence | recovery is routed to the named PLAT, GIT or BACKEND owner, or remains explicit OPS incomplete/operator-intervention evidence when no source owner applies | `OPS-BACKUP-003`, `OPS-EXPORT-003`, `OPS-REPLAY-001` |

## 23. ADR / Obligation / Requirement Traceability

| Requirement | Portfolio obligation | ADR | ADR section | Ownership role | Acceptance / test |
|---|---|---|---|---|---|
| `OPS-OBS-001` | `O-069` | `ADR-0013` | `Decisão` | `CANONICAL_OWNER` for operational projection | `AC-OPS-001`; `CT-OPS-001` |
| `OPS-OBS-002` | `O-069` | `ADR-0013` | `Decisão` | `CANONICAL_OWNER` for non-authoritative projection fidelity | `AC-OPS-002`; `CT-OPS-002`, `CT-OPS-019` |
| `OPS-OBS-006` | `O-054`, `O-069`, `O-071` | `ADR-0009`, `ADR-0013` | `Decisão` | `CANONICAL_OWNER` for local OPS preservation linkage; `CONSUMER` of DOM/GIT report/content authority | `AC-OPS-019`; `CT-OPS-027` |
| `OPS-OBS-003` | `O-069`, `O-072` | `ADR-0013` | `Decisão` | `CANONICAL_OWNER` for measurement projection | `AC-OPS-003`; `CT-OPS-002` |
| `OPS-OBS-004` | `O-072` | `ADR-0013` | `Decisão` | `CANONICAL_OWNER` for cross-record correlation | `AC-OPS-004`; `CT-OPS-003` |
| `OPS-OBS-005` | `O-069` | `ADR-0013` | `Decisão` | `CANONICAL_OWNER` for operational replay projection | `AC-OPS-005`; `CT-OPS-004` |
| `OPS-RET-001` | `O-070` | `ADR-0013` | `Decisão` | `CANONICAL_OWNER` for retention | `AC-OPS-006`; `CT-OPS-005`, `CT-OPS-014` |
| `OPS-RET-002` | `O-070`, `O-071` | `ADR-0013` | `Decisão` | `CANONICAL_OWNER` for manual deletion record | `AC-OPS-007/008/021`; `CT-OPS-006`, `CT-OPS-015`, `CT-OPS-030` |
| `OPS-RET-003` | `O-070`, `O-071` | `ADR-0013` | `Decisão` | `CANONICAL_OWNER` for deletion preservation boundary | `AC-OPS-009`; `CT-OPS-020`, `CT-OPS-021` |
| `OPS-RET-004` | `O-070`, `O-071` | `ADR-0006`, `ADR-0013` | `Decisão` | `CANONICAL_OWNER` for deletion request lifecycle and preservation recovery; PLAT/BACKEND retain source/request authority | `AC-OPS-021/022`; `CT-OPS-029/030/031` |
| `OPS-BACKUP-001` | `O-071` | `ADR-0013` | `Decisão`, `Consequências` | `CANONICAL_OWNER` for automatic backup | `AC-OPS-010`; `CT-OPS-007` |
| `OPS-BACKUP-002` | `O-071` | `ADR-0013` | `Decisão`, `Consequências` | `CANONICAL_OWNER` for reconstructive coverage | `AC-OPS-011`; `CT-OPS-007` |
| `OPS-BACKUP-003` | `O-071` | `ADR-0013` | `Consequências` | `CANONICAL_OWNER` for restore validation | `AC-OPS-012`; `CT-OPS-008`, `CT-OPS-013` |
| `OPS-EXPORT-001` | `O-069`, `O-071` | `ADR-0013` | `Decisão` | `CANONICAL_OWNER` for reconstructible export | `AC-OPS-013`; `CT-OPS-009` |
| `OPS-EXPORT-002` | `O-069`, `O-071` | `ADR-0013` | `Decisão` | `CANONICAL_OWNER` for export integrity | `AC-OPS-014`; `CT-OPS-009`, `CT-OPS-018` |
| `OPS-EXPORT-003` | `O-071` | `ADR-0013` | `Decisão` | `CANONICAL_OWNER` for incomplete export semantics | `AC-OPS-015`; `CT-OPS-012` |
| `OPS-REPLAY-001` | `O-069`, `O-071` | `ADR-0013` | `Decisão` | `CANONICAL_OWNER` for operational replay/preservation | `AC-OPS-016`; `CT-OPS-016`, `CT-OPS-025` |
| `OPS-REPLAY-002` | `O-069`, `O-071` | `ADR-0013` | `Decisão` | `CANONICAL_OWNER` for projection import idempotency | `AC-OPS-017`; `CT-OPS-010`, `CT-OPS-026` |
| `OPS-EXT-001` | `O-069`, `O-072` | `ADR-0013` | `Decisão` | `CANONICAL_OWNER` for capability-neutral operational coverage | `AC-OPS-018`; `CT-OPS-011` |

Traceability result:

```text
REQUIREMENTS_WITHOUT_PORTFOLIO_OBLIGATION = 0
OWNED_OBLIGATIONS_WITHOUT_REQUIREMENT = 0
```

## 24. Known Gap Summary

| Gap subject | Classification | Related requirement | Evidence |
|---|---|---|---|
| OPS component SPEC | `SPECIFICATION_GAP` | all OPS requirements | target artifact did not exist before this generation; independent validation is pending |
| Durable operational projection | `IMPLEMENTATION_GAP` | `OPS-OBS-001` through `OPS-OBS-005` | no production OPS service or durable operational projection found; prototype is in-memory |
| Retention and deletion record | `IMPLEMENTATION_GAP` | `OPS-RET-001` through `OPS-RET-003` | no production retention/deletion implementation; prototype only marks mock artifacts retained |
| Automatic backup and restore | `IMPLEMENTATION_GAP` | `OPS-BACKUP-001` through `OPS-BACKUP-003` | no production database, backup, associated-file capture or restore implementation found |
| Reconstructible export | `IMPLEMENTATION_GAP` | `OPS-EXPORT-001` through `OPS-EXPORT-003` | `prototype/src/App.tsx` and `prototype/src/mockDomain.ts` provide mock `EXPORT_EVIDENCE`, not a production export |
| Durable correlation/measurement | `IMPLEMENTATION_GAP` | `OPS-OBS-003/004`, `OPS-EXT-001` | prototype fields/events are deterministic in memory; no production cross-source ingestion found |
| Portfolio/architecture ownership | `NON_GAP` | all | portfolio audit reports unique O-069…O-072 ownership and no architecture gap |

No prior OPS Gap Matrix exists. Formal Gap Matrix generation and reconciliation
remain downstream work and are not performed here.

## 25. Dependencies

| Dependency SPEC | Contract consumed | Blocking? | Evidence |
|---|---|---|---|
| `SPEC-PLAT-001` | durable database/journal/outbox, effect evidence, reconciliation and recovery basis | Yes | `docs/specs/audits/SPEC-PLAT-001-component-conformance-audit.md`; `PASS — COMPONENT_SPEC_CONFORMANT`, revision `1` |
| `SPEC-BACKEND-001` | authenticated application requests, snapshots, realtime events, replay/reconnection and intervention mapping | Yes | `docs/specs/audits/SPEC-BACKEND-001-component-conformance-audit.md`; `PASS — COMPONENT_SPEC_CONFORMANT`, revision `3` |

The component does not add a normative dependency on DOM, EXEC or GIT. Their
canonical source contracts are consumed through the approved PLAT/BACKEND
composition and explicit non-authoritative projection references in section
10. No dependency is reversed, removed or newly introduced.

## 26. Risks

| Risk | Mitigation / conformance test |
|---|---|
| Operational projection becomes canonical functional state | explicit source/authority table and `CT-OPS-019`, `CT-OPS-021` |
| Stale or partial export appears complete | `OPS-EXPORT-003`, `OPS-REPLAY-001`, `CT-OPS-012`, `CT-OPS-016` |
| Retention cleanup silently destroys audit evidence | `OPS-RET-001/003`, `CT-OPS-005`, `CT-OPS-014` |
| Backup omits external files or source ranges | `OPS-BACKUP-002/003`, `CT-OPS-007`, `CT-OPS-013` |
| Failure mapping changes canonical meaning | consumed failure matrix and `CT-OPS-017`, `CT-OPS-020` |
| Replay duplicates records or loses provenance | `OPS-OBS-005`, `OPS-REPLAY-002`, `CT-OPS-004`, `CT-OPS-010` |
| Export or deletion bypasses local authorization or leaks secrets | section 20, `CT-OPS-015`, `CT-OPS-018` |
| Operational report becomes Git-managed authority or loses audited-content linkage | `OPS-OBS-006`, `CT-OPS-027` |
| Deletion race, stale basis or partial failure loses audit evidence | `OPS-RET-002/004`, `CT-OPS-029` through `CT-OPS-031` |
| Preservation failure is routed to an unspecified recovery owner | section 19, `AC-OPS-023`, `CT-OPS-032` |
| New capability requires OPS-specific architecture | `OPS-EXT-001`, `CT-OPS-011` |

## 27. Implementation Details Intentionally Unfrozen

The following remain implementation freedoms unless a later accepted authority
freezes them:

- database engine, journal schema, outbox schema and migration tool;
- archive/container format, compression, encryption mechanism and storage
  location;
- automatic backup schedule, retention implementation and cleanup mechanism,
  subject to no automatic expiry of approved operational history;
- filesystem/object-store/streaming adapter and transfer protocol;
- class, module, table, file and job names;
- HTTP paths, DTO shapes and event wire protocol;
- serialization, hashing library and indexing strategy;
- frontend framework, dashboard layout and presentation labels; and
- concurrency primitive, worker model and operational scheduling mechanism.

These freedoms cannot weaken the observable requirements, source authority,
retention decision, evidence coverage or failure behavior in this SPEC.

## 28. Open Questions

### IMPLEMENTATION_DETAIL_QUESTION

- Which local storage/archive mechanism provides the required backup and
  associated-file integrity evidence?
- Which export container and hash representation best support independent
  reconstruction at local scale?
- Which schedule and supervision mechanism triggers automatic backups?

These questions do not change ownership or architectural authority.

### ARCHITECTURAL_QUESTION

None. The accepted ADRs and approved portfolio allocate this boundary
completely; no architecture gap or portfolio ownership gap remains.

## 29. Definition of Done

This component SPEC is ready for independent SPEC validation when the validator
can prove that:

- the governing portfolio audit remains `PORTFOLIO_DECOMPOSITION_APPROVED`;
- ADR-0013 and all consumed ADRs remain accepted and effective;
- PLAT and BACKEND upstream SPECs remain at the referenced conformant
  revisions;
- O-069, O-070, O-071 and O-072 are all covered;
- no consumed contract is redefined and only the two approved normative
  upstream dependencies are used;
- all requirements have ADR and portfolio authority;
- canonical identity ownership is single-owner and local REPO/EXEC/PLAT
  references cannot substitute for DOM identities;
- operational report placement, audited-content hash linkage, source authority,
  failure and projection boundaries are explicit;
- retention, backup, restore, export, deletion lifecycle/concurrency and replay
  behavior are observable and fail closed where required;
- acceptance criteria and conformance tests cover positive, negative,
  boundary-isolation, dependency, compatibility and recovery behavior;
- repository evidence informed the known-gap classification without changing
  architecture; and
- no Implementation Plan, ticket decomposition, production implementation or
  new ADR was produced by this remediation.

## 30. Mechanical Validation

```text
PORTFOLIO_OBLIGATIONS_OWNED = 4
PORTFOLIO_OBLIGATIONS_COVERED = 4
OWNED_OBLIGATIONS_UNCOVERED = 0
NORMATIVE_REQUIREMENTS = 19
REQUIREMENTS_WITHOUT_AUTHORITY = 0
CONSUMED_CONTRACTS = 7 contract groups
CONSUMED_CONTRACTS_REDEFINED = 0
UNTESTABLE_REQUIREMENTS = 0
ACCEPTANCE_GAPS = 0
FAILURES_OWNED = 0
FAILURES_CONSUMED = 11 failure families
AMBIGUOUS_FAILURE_OWNERS = 0
NORMATIVE_DEPENDENCIES = 2
NEW_UNAPPROVED_DEPENDENCIES = 0
MISSING_REQUIRED_DEPENDENCIES = 0
DEPENDENCY_DIRECTION_VIOLATIONS = 0
FAILURE_OWNER_VIOLATIONS = 0
COMPATIBILITY_OWNER_VIOLATIONS = 0
KNOWN_SPECIFICATION_GAPS = 1
KNOWN_IMPLEMENTATION_GAPS = 5
ARCHITECTURE_GAPS = 0
PORTFOLIO_OWNERSHIP_GAPS = 0
UPSTREAM_CONTRACT_GAPS = 0
IMPLEMENTATION_PLAN_LEAKS = 0
ACCEPTANCE_CRITERIA = 23
CONFORMANCE_TESTS = 32
```

Required invariants all hold:

```text
OWNED_OBLIGATIONS_UNCOVERED = 0
OWNED_OBLIGATIONS_PARTIAL = 0
REQUIREMENTS_WITHOUT_AUTHORITY = 0
CONSUMED_CONTRACTS_REDEFINED = 0
UNTESTABLE_REQUIREMENTS = 0
ACCEPTANCE_GAPS = 0
AMBIGUOUS_FAILURE_OWNERS = 0
NEW_UNAPPROVED_DEPENDENCIES = 0
MISSING_REQUIRED_DEPENDENCIES = 0
DEPENDENCY_DIRECTION_VIOLATIONS = 0
FAILURE_OWNER_VIOLATIONS = 0
COMPATIBILITY_OWNER_VIOLATIONS = 0
ARCHITECTURE_GAPS = 0
PORTFOLIO_OWNERSHIP_GAPS = 0
UPSTREAM_CONTRACT_GAPS = 0
IMPLEMENTATION_PLAN_LEAKS = 0
```

## 31. Adversarial Validation

| Check | Result |
|---|---|
| Does the SPEC define only O-069…O-072-owned behavior or authorized local projection/preservation? | `PASS` |
| Does it avoid redefining PLAT journal/effect/recovery or BACKEND transport/auth semantics? | `PASS` |
| Can a projection, export, backup or UI view become canonical functional state? | `NO`; source and authority limits are explicit |
| Are all four owned obligations covered by requirements, acceptance and tests? | `PASS` |
| Are all normative requirements linked to a portfolio obligation and ADR section? | `PASS` |
| Are failure semantics consumed without collapsing canonical meaning? | `PASS`; 11 families, zero OPS-owned semantic failures |
| Could legacy and new behavior remain two canonical paths? | `NO`; legacy is consumer-only and historical basis is preserved |
| Could stale, partial or corrupt evidence be reported as complete? | `NO`; export/restore/replay fail closed |
| Does any requirement introduce a new normative dependency or reverse the DAG? | `NO` |
| Did repository or prototype behavior override accepted authority? | `NO`; evidence is classified only |
| Does any requirement prescribe an implementation plan? | `NO`; implementation details are explicitly unfrozen |
| Is synthetic extensibility covered? | `PASS`; `OPS-EXT-001` and `CT-OPS-011` |
| Are operational reports outside Git and hash-linked to exact audited content? | `PASS`; `OPS-OBS-006`, `AC-OPS-019`, `CT-OPS-027` |
| Does every canonical identity have one owner, with local source references separated? | `PASS`; section 12, `AC-OPS-020`, `CT-OPS-028` |
| Are deletion lifecycle, duplicate/overlap/stale handling and partial recovery deterministic? | `PASS`; `OPS-RET-002/004`, `AC-OPS-021/022`, `CT-OPS-029` through `CT-OPS-031` |
| Is incomplete/conflicting preservation recovery routed to a named owner or explicit OPS result? | `PASS`; section 19, `AC-OPS-023`, `CT-OPS-032` |

## 32. Final Gate

```text
COMPONENT_SPEC_REMEDIATION_COMPLETE
COMPONENT: SPEC-OPS-001
PORTFOLIO: SPEC-PORTFOLIO-001
PORTFOLIO_VERDICT: PORTFOLIO_DECOMPOSITION_APPROVED
GATE: READY_FOR_INDEPENDENT_COMPONENT_SPEC_REAUDIT
```

The next step is a fresh independent component SPEC conformance audit.
