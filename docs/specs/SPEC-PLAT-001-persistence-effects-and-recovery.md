---
schema_version: "1.0.0"
id: SPEC-PLAT-001
title: Persistence, Effects and Recovery
status: PROPOSED
revision: 1
date: 2026-09-09
spec_scope: component
authoritative_adrs: [ADR-0006]
supersedes: []
superseded_by: null
upstream_dependencies: [SPEC-DOM-001, SPEC-EXEC-001]
related: [ADR-0001, ADR-0002, ADR-0003, ADR-0007, ADR-0011, ADR-0013]
---

# SPEC-PLAT-001 — Persistence, Effects and Recovery

## 1. Status

`PROPOSED` — generated from the approved portfolio decomposition and ready for
independent component SPEC validation.

Baseline:

| Item | Value |
|---|---|
| Target component | `SPEC-PLAT-001` |
| Governing portfolio | `SPEC-PORTFOLIO-001`, revision `2` |
| Portfolio audit | `docs/specs/SPEC-PORTFOLIO-001-decomposition-audit.md` |
| Portfolio verdict | `PORTFOLIO_DECOMPOSITION_APPROVED` |
| Primary ADR | `ADR-0006`, revision `3`, `ACCEPTED` |
| Upstream normative SPECs | `SPEC-DOM-001` revision `2`; `SPEC-EXEC-001` revision `1` |
| Upstream audits | `docs/specs/audits/SPEC-DOM-001-component-conformance-audit.md` and `docs/specs/audits/SPEC-EXEC-001-component-conformance-audit.md`; both `PASS — COMPONENT_SPEC_CONFORMANT` |
| Repository HEAD inspected | `8c01d34cdf58881ec1f87d885e23a6ec167f3cb1` |
| Existing target draft | none found before generation |

This specification materializes ownership already assigned by the approved
portfolio and does not redefine portfolio boundaries.

## 2. Ownership

### Owns

- durable local persistence of operational state through a database, an
  append-only journal and an outbox;
- effect intent before external execution and evidence/confirmation after it;
- deterministic idempotency keys and their reuse across attempts;
- reconciliation of pending effects and equivalent Git/database functional
  state;
- the four approved effect-reconciliation results;
- physical restart recovery from persisted records and a safe checkpoint; and
- bounded, cooperative operational retry, pause, cancellation and shutdown
  behavior at the persistence/effect boundary.

### Consumes

- canonical identities, lifecycle states, commands, publication vocabulary and
  exact-basis rules from `SPEC-DOM-001`;
- skill manifest, schema, version, checkpoint and historical-basis contracts
  from `SPEC-EXEC-001`;
- effect-specific execution/evidence contracts from `SPEC-GIT-001` and other
  effect owners;
- application/transport mapping from `SPEC-BACKEND-001`; and
- operational projection, retention, backup and export behavior from
  `SPEC-OPS-001`.

### Does not own

- canonical domain identities, aggregate state machines, command preconditions,
  audit verdicts or publication terminal states;
- Git, GitHub, branch, worktree, commit, merge, push or PR semantics;
- skill/capability registry, manifest schema or assignment/session lifecycle;
- API routes, transport envelopes, authentication or UI presentation; or
- retention, deletion, backup/export policy and operational telemetry as
  canonical products.

## 3. Portfolio Authority

The governing decomposition is the approved registry in
`docs/specs/SPEC-PORTFOLIO-001-organization.md`, revision `2`. The independent
audit concludes `PORTFOLIO_DECOMPOSITION_APPROVED` and reports zero unresolved
ownership, dependency or architecture findings.

Portfolio allocation for this component:

| Portfolio item | Allocation |
|---|---|
| Owned obligations | `O-032` through `O-038` |
| Failure family owned | Effect reconciliation: `EXPECTED_INCOMPLETE_EFFECT`, `MISSING_EFFECT`, `SEMANTIC_DIVERGENCE`, `CONFLICTING_EFFECT` |
| New canonical path | owner of `O-032`/`O-033` |
| Legacy compatibility | consumer of `SPEC-REPO-001`/`SPEC-GIT-001` |
| Historical replay | owner of `O-037`/`O-038` |
| Cutover | owner of `O-035` |
| Retirement | not applicable; record deletion is `SPEC-OPS-001` authority |
| Direct dependencies | `SPEC-DOM-001`, `SPEC-EXEC-001` |

The portfolio remains authoritative for ownership, dependency direction,
failure ownership, compatibility and projection boundaries.

## 4. ADR Authority

### Primary accepted ADR

| ADR | Status | Relevant decision |
|---|---|---|
| `ADR-0006` | `ACCEPTED`, revision `3` | database plus append-only journal/outbox; intent before effect; evidence after effect; deterministic idempotency; evidence-first reconciliation; four reconciliation classes; restart recovery; at most ten cooperative operational attempts |

### Related accepted ADRs

| ADR | Contract consumed locally |
|---|---|
| `ADR-0001` | canonical identity, immutable snapshots and lineage remain DOM-owned |
| `ADR-0002` | state/command transitions and publication vocabulary remain DOM/GIT-owned |
| `ADR-0003` | exact manifest, version and safe-checkpoint basis remains EXEC-owned |
| `ADR-0007` | Git/worktree/commit execution and evidence remain GIT-owned |
| `ADR-0011` | backend maps and transports records/events without redefining their semantics |
| `ADR-0013` | operational projection, retention, backup and export remain OPS-owned |

The accepted ADR authority is not replaced by repository behavior, prototype
behavior or a local implementation choice.

## 5. Problem Statement

The accepted architecture crosses durable local state with effects in Git,
filesystem, Codex, GitHub and other services without a distributed
transaction. A request can therefore be accepted before its effect is
confirmed, a process can stop between external execution and local recording,
or Git and the database can describe incompatible functional state.

The repository currently contains an in-memory prototype that displays command
journals, idempotency keys, reconciliation scenarios and recovery fixtures, but
does not provide durable database/journal/outbox behavior or production effect
adapters. Without this boundary, a retry could duplicate an effect, a saved
status could be mistaken for completion, or one side of a Git/database
divergence could silently become authoritative.

This SPEC defines the observable persistence, effect, reconciliation and
recovery contract that permits interruption and restart without fabricating
success or losing the canonical basis of the operation.

## 6. Goals

- Every external effect has durable intent before execution and correlated
  evidence before confirmation.
- Repeating one intent reuses its deterministic key and first reconciles
  existing evidence.
- The four approved reconciliation classes have distinct automatic or human
  outcomes.
- Restart reconstructs state from durable records and a safe checkpoint rather
  than from transient session memory or an isolated status field.
- Operational attempts are bounded and cooperative; pause, cancellation and
  shutdown do not report completion before a safe state is confirmed.
- Consumers can project journal/evidence data without becoming canonical
  owners of effect state or failure meaning.

## 7. Non-Goals

- Choosing a database engine, schema migration tool, queue library or event
  transport;
- defining domain commands, aggregate transitions, audit verdicts or
  publication semantics owned by other SPECs;
- defining Git/GitHub adapter behavior or deciding Git/database authority in a
  way that bypasses the approved human-intervention contract;
- defining API routes, frontend controls, operational retention or export
  formats;
- defining implementation classes, modules, files, deployment phases or
  tickets; or
- generating a Gap Matrix, Implementation Plan or production implementation.

## 8. Current Repository State

| Area | Current behavior | Target behavior | Classification |
|---|---|---|---|
| Target component artifact | No `SPEC-PLAT-001` draft existed before this generation | Normative persistence/effect/recovery boundary is materialized here | `SPECIFICATION_GAP` closed by this generation; independent audit pending |
| Durable database, journal and outbox | No production persistence layer; prototype state is held in memory | Durable state, append-only journal and replayable outbox | `IMPLEMENTATION_GAP` |
| Effect intent/evidence/confirmation | `prototype/src/mockDomain.ts` models command/effect fields and fixtures only | Durable intent before adapter invocation and evidence-bound confirmation | `IMPLEMENTATION_GAP` |
| Idempotency/reconciliation | Prototype has scenario fields and mock assertions; no production external-effect adapter or evidence store | Deterministic-key reuse and four-class reconciliation | `IMPLEMENTATION_GAP` |
| Restart recovery | Prototype contains a recovery fixture and tests; no process restart or durable replay implementation | Rebuild/reconcile from journal, persisted artifacts/results and safe checkpoint | `IMPLEMENTATION_GAP` |
| Retry/pause/cancel/shutdown | Mock lifecycle exposes bounded-looking fields and cooperative scenarios | Enforced production attempt bound and safe checkpoint behavior | `IMPLEMENTATION_GAP` |
| `SPEC-DOM-001` and `SPEC-EXEC-001` contracts | Current component documents and independent audits are conformant | Consume canonical IDs, state, manifest, version and checkpoint basis | `ALREADY_CONFORMANT` |
| Prototype and tests | `prototype/src/*` and `prototype/tests/*` exercise mock/UI behavior | Evidence only; no prototype behavior becomes authority | `PROTOTYPE_ONLY` |
| Architecture and portfolio ownership | Approved decomposition and ADR-0006 allocate this boundary completely | No new architectural decision required | `NON_GAP` |

The repository evidence informs implementation-gap classification only. It does
not change ADR authority or portfolio ownership.

## 9. Owned Architectural Obligations

| Portfolio obligation | ADR authority | Source section | Local treatment |
|---|---|---|---|
| `O-032` | `ADR-0006` | `Decisão` | Database, append-only journal and outbox are durable persistence primitives; `PLAT-PERSIST-001/002` |
| `O-033` | `ADR-0006` | `Decisão` | Intent precedes external execution; evidence and confirmation follow it; `PLAT-EFFECT-001/002` |
| `O-034` | `ADR-0006` | `Decisão` | Deterministic idempotency key is reused by every retry of one intent; `PLAT-IDEMP-001` |
| `O-035` | `ADR-0006` | `Decisão` | Evidence is reconciled before repetition; Git/database divergence blocks for human decision; `PLAT-RECON-001/002` |
| `O-036` | `ADR-0006` | `Decisão` | Four reconciliation results are distinct and observable; `PLAT-RECON-003` |
| `O-037` | `ADR-0006` | `Decisão` | Restart rebuilds and reconciles from the last safe checkpoint; `PLAT-RECOVERY-001/002` |
| `O-038` | `ADR-0006` | `Decisão` | Operational attempts are bounded/cooperative and effects require evidence and key; `PLAT-RETRY-001/002` |

All seven owned obligations are represented by normative requirements,
acceptance criteria and conformance tests below.

## 10. Consumed Contracts

| Owner SPEC | Contract / requirement | Why consumed | Local rule |
|---|---|---|---|
| `SPEC-DOM-001` | `DOM-ID-001`, `DOM-SNAPSHOT-001`, `DOM-LIFE-001`, `DOM-STATE-001` | persistence records must attach to canonical aggregate identity, immutable basis and state lifecycle | persist references and state evidence; never create a second domain identity or state machine |
| `SPEC-DOM-001` | `DOM-CMD-001`, `DOM-ADV-001`, `DOM-PUB-001` | an effect may be requested only from a valid domain basis and its evidence may be consumed by domain gates | preserve preconditions, rejection and terminality; confirmation of an effect is not domain approval by itself |
| `SPEC-EXEC-001` | `EXEC-SNAPSHOT-001`, `EXEC-MANIFEST-001`, `EXEC-MANIFEST-002`, `EXEC-MANIFEST-003`, `EXEC-HISTORY-001` | recovery needs exact skill/schema/version basis and declared safe checkpoints | persist and replay the received basis; do not redefine manifest or checkpoint semantics |
| `SPEC-GIT-001` | effect-specific Git/publication intent and evidence | PLAT persists/reconciles Git effects while GIT owns their functional meaning and adapter execution | correlate and verify GIT evidence; never define branch, commit, merge, push or remote-publication rules |
| `SPEC-BACKEND-001` | application/transport mapping and local session boundary | backend exposes records and events to clients | preserve canonical codes, correlation and confirmation state; transport is not authority |
| `SPEC-OPS-001` | journal/evidence operational projection, retention, backup and export | operations observes and preserves the history | expose a derived projection; do not let retention/export rewrite canonical journal or effect meaning |

The first three rows are the two direct normative upstream dependencies. The
remaining rows are downstream or adjacent consumers and do not create new
upstream dependencies for this component.

## 11. Target Behavioral Model

```text
canonical owner request + canonical IDs + exact basis
        |
        v
validate local correlation and persist effect intent
        |
        +--> database state + append-only journal + outbox entry
        |
        v
external adapter executes with deterministic idempotency key
        |
        v
collect correlated evidence and compare with expected basis/content
        |
        +--> compatible evidence: confirm
        +--> no evidence: classify MISSING_EFFECT and retry under policy
        +--> incompatible state/evidence: block for reconciliation
        |
        v
persist confirmation/reconciliation evidence and project to consumers
        |
        v
restart: rebuild from durable records, reconcile, and resume safe checkpoint
```

`PLAT` owns the durable effect lifecycle and reconciliation. The originating
domain command, the adapter's effect semantics, the transport representation
and the operational/UI projection remain under their approved owners.

## 12. Identity and Authority Rules

| Identity / record | Canonical owner | Reference identity | Local correlation | Derived projection |
|---|---|---|---|---|
| `RepositoryId`, `ExecutionId`, `ActivityId`, `AttemptId`, `TicketId` | `SPEC-DOM-001` | effect intent and journal references | request/effect correlation | labels/statuses |
| `ExternalEffectId` | `SPEC-DOM-001` | target effect referenced by PLAT | intent/evidence correlation | operational effect row |
| `EffectIntent` record | `SPEC-PLAT-001` as persistence record | canonical effect identity plus basis | outbox/journal correlation | pending/confirmed view |
| Deterministic idempotency key | `SPEC-PLAT-001` as effect-control key | derived from the same intent, target and expected basis | adapter/retry correlation | key fingerprint only |
| `EffectEvidenceId` and evidence hash | `SPEC-PLAT-001` for evidence contract | adapter/provider evidence reference | confirmation/reconciliation correlation | evidence projection |
| Manifest, schema/version basis and safe checkpoint | `SPEC-EXEC-001` | exact activity/attempt reference | replay correlation | checkpoint summary |
| Journal position and recovery record | `SPEC-PLAT-001` | durable sequence/checkpoint reference | replay correlation | recovery status |

PLAT-local record identifiers and keys do not replace DOM canonical identities,
do not become user-facing aggregate identities and do not authorize a domain
transition. Labels, route parameters and UI status text are projections.

## 13. Normative Requirements

### PLAT-PERSIST-001 — Durable persistence primitives

For every owned operational state or effect lifecycle, the implementation MUST
persist the relevant record in a local database, append the immutable journal
entry, and represent pending external work in an outbox. A caller MUST NOT be
told that the intent was durably accepted when these records are unavailable.

Authority: `O-032`, `ADR-0006`, `Decisão`.

### PLAT-PERSIST-002 — Append-only history and replayable outbox

Journal history MUST be append-only: a later result may append evidence,
confirmation or reconciliation records but MUST NOT rewrite or delete the
prior intent/history to make an outcome appear successful. An outbox entry MUST
remain correlated to its intent until confirmed, reconciled or explicitly
blocked with evidence.

Authority: `O-032`, `ADR-0006`, `Decisão`.

### PLAT-EFFECT-001 — Intent precedes external execution

Before invoking any external effect, PLAT MUST durably record the canonical
effect reference, target, expected basis/content, deterministic idempotency key,
attempt context and pending state. If intent persistence fails, external
execution MUST NOT begin.

Authority: `O-033`, `ADR-0006`, `Decisão`.

### PLAT-EFFECT-002 — Evidence precedes confirmation

After external execution, PLAT MUST persist correlated evidence and only then
record effect confirmation. A requested, accepted, process-exited or
transport-successful operation without compatible external evidence MUST NOT be
reported as a confirmed effect.

Authority: `O-033`, `ADR-0006`, `Decisão`.

### PLAT-IDEMP-001 — Deterministic key reuse

For one canonical effect intent and unchanged expected basis, PLAT MUST derive
one deterministic idempotency key and reuse it for all operational retries,
restarts and historical replay. Reusing the key MUST be safe to detect and
avoid duplicating an already completed external effect. A materially new
canonical intent or basis requires a new owner-issued identity; a local retry
MUST NOT silently create one.

Authority: `O-034`, `ADR-0006`, `Decisão`.

### PLAT-RECON-001 — Evidence-first reconciliation

Before repeating an incomplete external effect, PLAT MUST inspect and compare
available evidence using the original intent, key and expected basis. Compatible
evidence MUST confirm without repeating; absence of evidence MAY permit a retry
under `PLAT-RETRY-001`; incompatible evidence or state MUST follow
`PLAT-RECON-003`.

Authority: `O-035`, `ADR-0006`, `Decisão`.

### PLAT-RECON-002 — Git/database divergence requires human decision

When Git and the database contain incompatible functional ticket state without
a safe, correlated reconciliation path, PLAT MUST block the affected unit and
record the conflicting identities, basis and evidence. It MUST NOT silently
choose Git, silently choose the database, overwrite one side, or confirm the
ticket. A human decision and a separately evidenced corrective effect are
required before resolution.

Authority: `O-035`, `ADR-0006`, `Decisão`.

### PLAT-RECON-003 — Four distinct reconciliation results

PLAT MUST classify and handle the approved results as follows:

| Result | Required condition | Required behavior |
|---|---|---|
| `EXPECTED_INCOMPLETE_EFFECT` | pending intent plus matching idempotent evidence | automatically append reconciliation/confirmation; do not repeat the external effect |
| `MISSING_EFFECT` | pending intent with no matching evidence | keep the intent pending and retry with the same key only under the bounded operational policy |
| `SEMANTIC_DIVERGENCE` | incompatible states without a correlated intent/evidence explanation | block and require human decision; no silent authority selection |
| `CONFLICTING_EFFECT` | evidence exists but content or hash differs from expected | block the effect/unit and preserve conflicting evidence; do not overwrite or confirm |

The four results MUST remain distinguishable in the canonical record and in
consumer mappings. A local transport, UI or operational label MUST NOT collapse
them into a different canonical failure or success.

Authority: `O-036`, `ADR-0006`, `Decisão`.

### PLAT-RECOVERY-001 — Restart reconstruction from safe checkpoint

After process or backend restart, PLAT MUST reconstruct projections and pending
work from the durable journal, database, outbox, persisted artifacts/results,
and the exact manifest/basis supplied by `SPEC-EXEC-001`. It MUST reconcile
database, Git/worktrees, processes and relevant external services before
resuming from the last declared safe checkpoint.

Authority: `O-037`, `ADR-0006`, `Decisão`; consumes `EXEC-MANIFEST-002` and
`EXEC-HISTORY-001`.

### PLAT-RECOVERY-002 — Status is not completion evidence

An isolated saved status, in-memory flag, process exit code or absence of an
error message MUST NOT prove effect completion or workflow completion. Recovery
MUST require the correlated intent, expected basis and compatible evidence;
otherwise it MUST leave the unit pending, retryable or blocked according to the
reconciliation result.

Authority: `O-037`, `ADR-0006`, `Decisão`.

### PLAT-RETRY-001 — Bounded operational attempts

Operational attempts for one intent MUST be limited by an explicit configured
maximum that is no greater than ten. Attempt count MUST remain distinct from
audit-round count, assignment identity and session identity. Reaching the
limit MUST produce a durable blocked/failed operational result and MUST NOT
create an unbounded automatic loop.

Authority: `O-038`, `ADR-0006`, `Decisão`.

### PLAT-RETRY-002 — Cooperative pause, cancellation and shutdown

Pause and cancellation MUST request a cooperative safe checkpoint and MUST NOT
claim completion until that checkpoint and any effect evidence are confirmed.
Backend shutdown MUST wait for a safe state or durably record an incomplete
intent for recovery. It MUST NOT discard pending journal/outbox records or
perform destructive rollback merely to reach a terminal-looking status.

Authority: `O-038`, `ADR-0006`, `Decisão`.

## 14. Commands / Queries / Events

PLAT defines persistence/effect operations and integration records, not domain
commands. The following semantic classes are in scope; concrete route names,
DTOs and transport protocols remain unfrozen.

| Interface | Classification | Rule |
|---|---|---|
| Record effect intent | `APPLICATION_COMMAND` / persistence operation | validates canonical reference and basis, persists intent before adapter execution |
| Execute pending outbox item | `APPLICATION_COMMAND` to an effect owner | uses the stored key and intent; does not create a new domain transition |
| Inspect/reconcile pending effect | `QUERY` plus canonical reconciliation operation | reads evidence first and yields one approved reconciliation result |
| Recover from safe checkpoint | `APPLICATION_COMMAND` / recovery operation | rebuilds from durable records and exact basis; status alone is insufficient |
| Intent/evidence/confirmation records | `INTEGRATION_EVENT` | PLAT owns their persistence/effect meaning; consumers correlate/project only |
| `EFFECT_RECONCILIATION_*` result | `INTEGRATION_EVENT` / canonical failure result | preserves one of the four approved semantics and its evidence |
| DOM command or transition | `CANONICAL_DOMAIN_COMMAND` | owned by `SPEC-DOM-001`; PLAT persists its effect context but does not redefine it |
| Git/publication execution | `INTEGRATION_EVENT` / external effect | semantics and adapter execution remain `SPEC-GIT-001` authority |

## 15. Failure Semantics

PLAT is the sole semantic owner of the portfolio effect-reconciliation family.
The four approved labels are provisional names only; their trigger, meaning,
retryability, terminality and recovery behavior are normative.

| Code | Trigger | Meaning | Retry/recovery |
|---|---|---|---|
| `EXPECTED_INCOMPLETE_EFFECT` | pending intent and compatible idempotent evidence | external effect already occurred but local confirmation was incomplete | automatic confirmation; no repeated effect |
| `MISSING_EFFECT` | pending intent and no correlated evidence | effect is not proven and may be safely retried with its original key | bounded retry after evidence inspection |
| `SEMANTIC_DIVERGENCE` | incompatible state with no explaining intent/evidence | canonical sources cannot be reconciled automatically | block; human decision and corrective effect required |
| `CONFLICTING_EFFECT` | evidence exists but content/hash conflicts with expectation | an effect occurred, but not the expected effect | block; preserve evidence; no automatic overwrite/retry |

Consumed failure families retain their owners: `INVALID_COMMAND_BASIS` and
`STALE_REVISION` remain DOM-owned; `CONTRACT_INVALID` and `VERDICT_UNKNOWN`
remain EXEC-owned; publication failures remain GIT-owned; repository and local
session failures remain REPO/BACKEND-owned. PLAT may record, propagate or map
these failures but cannot rename them or turn them into an effect-reconciliation
failure.

## 16. Retry / Idempotency / Recovery

The canonical boundary is:

| Concern | Owner/rule |
|---|---|
| Domain command retry and lifecycle transition | `SPEC-DOM-001`; PLAT cannot create a transition from a local retry |
| Skill manifest/checkpoint declaration | `SPEC-EXEC-001`; PLAT consumes exact basis and applies physical recovery |
| Physical effect retry and idempotency | `SPEC-PLAT-001`; same intent, same key, evidence-first |
| Git/publication adapter retry | `SPEC-GIT-001` using PLAT's persistence/evidence contract |
| Transport replay/reconnect | `SPEC-BACKEND-001`; replay does not confirm an effect |
| Operational projection replay | `SPEC-OPS-001`; projection replay does not rewrite canonical records |

Recovery is convergent: replay may append derived confirmation or reconciliation
records, but may not mutate the original basis, invent evidence, duplicate a
confirmed effect or let a current registry reinterpret historical records.

## 17. Compatibility / Cutover

| Class | PLAT role | Normative rule |
|---|---|---|
| `NEW_CANONICAL_PATH` | `OWNER` (`O-032`, `O-033`) | new operations use database/journal/outbox and intent/evidence/confirmation records |
| `LEGACY_COMPATIBILITY` | `CONSUMER` of REPO/GIT owners | legacy paths may adapt into the canonical contract but are never a second canonical persistence/effect authority |
| `HISTORICAL_REPLAY` | `OWNER` (`O-037`, `O-038`) | original journal, key, manifest/basis, evidence and attempt history remain interpretable and are not rewritten |
| `CUTOVER` | `OWNER` (`O-035`) | cutover requires reconciliation of pending evidence and blocks unresolved divergence; no silent source wins |
| `RETIREMENT` | `NOT_APPLICABLE` | deletion/retention retirement is `SPEC-OPS-001` authority; recovery preserves records |

No implementation phase or migration plan is defined here.

## 18. Projection Boundaries

| Canonical source | Projection/consumer | Refresh/replay/stale behavior | Authority limit |
|---|---|---|---|
| PLAT journal and effect records | `SPEC-OPS-001` operational history | replay preserves positions, IDs, keys, hashes and outcomes | projection cannot rewrite or approve an effect |
| PLAT effect/reconciliation result | `SPEC-BACKEND-001` event/API mapping | reconnect replays the recorded result; stale data requires refresh | transport cannot change code or terminality |
| PLAT evidence and recovery state | `SPEC-UI-001` intervention/status view | UI shows pending, confirmed or blocked from source records | UI cannot confirm, retry or choose authority by presentation |
| DOM/GIT canonical state | PLAT persistence/reconciliation record | local record references the source and records evidence | PLAT does not replace domain or publication authority |

A projection may be complete for a consumer but never becomes canonical state,
identity, evidence or failure meaning.

## 19. External Effects

| Semantic | Owner |
|---|---|
| `REQUEST` / domain command | `SPEC-DOM-001` |
| `INTENT` persistence, outbox and key | `SPEC-PLAT-001` |
| `EXTERNAL_EXECUTION` | effect-specific adapter owner, especially `SPEC-GIT-001` or `SPEC-BACKEND-001` |
| `EVIDENCE` and effect confirmation | `SPEC-PLAT-001` for the persistence/evidence contract; effect owner supplies provider evidence |
| `RECONCILIATION` | `SPEC-PLAT-001` |
| `PROJECTION` | `SPEC-BACKEND-001`, `SPEC-OPS-001` and `SPEC-UI-001` according to their contracts |

Invoking an adapter does not prove its effect. PLAT confirmation requires
correlated evidence compatible with the original expected basis. Provider
credentials and secrets are not persisted as effect evidence; their security
contract remains with the approved security/backend owner.

## 20. Security / Authorization

PLAT does not own authentication or human authorization. It consumes the
authorized command/decision and persists actor, time, target, basis and
correlation metadata needed to audit the effect. A transport or UI request
cannot bypass DOM/GIT preconditions by writing directly to the journal/outbox.

Secret values and credentials MUST NOT be treated as canonical effect evidence
or copied into ordinary journal/projection records; redaction and local-session
authentication remain `SPEC-BACKEND-001`/ADR-0012 authority.

## 21. Conformance Suite

The independent conformance suite MUST prove behavior at the persistence and
effect boundary, using real durable behavior in the eventual implementation;
the current mock tests are supporting evidence only.

### Positive

- `C-PLAT-001`: intent, database state, append-only journal entry and outbox
  entry exist before an adapter is invoked.
- `C-PLAT-002`: compatible evidence confirms a pending effect without a
  second external invocation.
- `C-PLAT-003`: a missing effect is retried with the original deterministic
  key within the configured bound.
- `C-PLAT-004`: restart rebuilds the projection and resumes from a declared
  safe checkpoint using persisted records and exact basis.
- `C-PLAT-005`: pause/cancellation reaches a cooperative safe checkpoint and
  records confirmation before reporting the safe state.

### Negative and fail-closed

- `C-PLAT-006`: adapter invocation is rejected when intent persistence fails.
- `C-PLAT-007`: requested, accepted, process-exited or transport-successful
  without external evidence is not confirmed.
- `C-PLAT-008`: duplicate retry cannot create a second external effect for the
  same intent/key.
- `C-PLAT-009`: `SEMANTIC_DIVERGENCE` blocks without choosing Git or database.
- `C-PLAT-010`: `CONFLICTING_EFFECT` blocks and preserves divergent evidence.
- `C-PLAT-011`: a tenth-or-fewer configured limit is honored and an eleventh
  automatic attempt is rejected; audit-round count remains unchanged.
- `C-PLAT-012`: shutdown does not discard pending journal/outbox work or claim
  completion from a saved status.

### Boundary isolation

- `C-PLAT-013`: PLAT cannot alter a DOM command precondition, state transition,
  publication terminality or canonical aggregate identity.
- `C-PLAT-014`: PLAT cannot alter an EXEC manifest, schema/version basis or
  safe-checkpoint declaration.
- `C-PLAT-015`: an OPS/API/UI projection cannot mutate or confirm canonical
  effect records.
- `C-PLAT-016`: transport mapping preserves all four reconciliation results
  and does not replace them with a different canonical failure.

### Dependency conformance

- `C-PLAT-017`: persisted records reference the conformant DOM and EXEC
  contracts by canonical IDs and exact basis without copying their ownership.
- `C-PLAT-018`: Git evidence is consumed and correlated while branch, commit,
  merge, push and remote-publication semantics remain GIT-owned.

### Compatibility and recovery

- `C-PLAT-019`: a legacy path adapts to the new intent/journal/outbox contract
  without creating a second source of canonical truth.
- `C-PLAT-020`: historical replay preserves original key, basis, evidence and
  outcome even when current registry/configuration changes.

### Reconciliation matrix

- `C-PLAT-021`: an independent fixture proves all four reconciliation classes
  produce their specified distinct state, evidence and retry/intervention
  behavior.

## 22. Acceptance Criteria

| ID | Binary acceptance criterion | Requirement |
|---|---|---|
| `AC-PLAT-001` | Given a valid effect request, database, journal and outbox records are durable before the adapter call is observable. | `PLAT-PERSIST-001/002` |
| `AC-PLAT-002` | Given a persistence failure, no external adapter call occurs and no confirmation is emitted. | `PLAT-PERSIST-001`, `PLAT-EFFECT-001` |
| `AC-PLAT-003` | Given a pending intent, no effect is confirmed until compatible correlated evidence is stored. | `PLAT-EFFECT-002` |
| `AC-PLAT-004` | Given the same intent and basis across retry/restart, the idempotency key is byte-for-byte stable and the external effect is not duplicated. | `PLAT-IDEMP-001` |
| `AC-PLAT-005` | Given matching evidence after a crash, the system confirms automatically and invokes no second effect. | `PLAT-RECON-001`, `PLAT-RECON-003` |
| `AC-PLAT-006` | Given no evidence, the system retries only with the original key and only while the configured bound permits. | `PLAT-RECON-001`, `PLAT-RETRY-001` |
| `AC-PLAT-007` | Given semantic Git/database divergence, neither side is silently selected and the unit remains blocked pending human decision. | `PLAT-RECON-002/003` |
| `AC-PLAT-008` | Given conflicting content/hash evidence, the unit is blocked and the conflicting evidence remains available for audit. | `PLAT-RECON-003` |
| `AC-PLAT-009` | Given restart, state and pending work are reconstructed from durable records and a safe checkpoint; an isolated saved status cannot complete recovery. | `PLAT-RECOVERY-001/002` |
| `AC-PLAT-010` | Given ten configured maximum attempts, no eleventh automatic attempt occurs and attempts are not counted as audit rounds. | `PLAT-RETRY-001` |
| `AC-PLAT-011` | Given pause, cancellation or shutdown during work, the system records a safe checkpoint or incomplete intent and does not claim confirmed completion. | `PLAT-RETRY-002` |
| `AC-PLAT-012` | Given any consumer projection or transport mapping, the four canonical results, identities and terminality remain unchanged. | `PLAT-PERSIST-002`, `PLAT-RECON-003`, boundary rules |

## 23. ADR / Obligation / Requirement Traceability

| Requirement | Portfolio obligation | ADR | ADR section | Ownership role | Acceptance / test |
|---|---|---|---|---|---|
| `PLAT-PERSIST-001` | `O-032` | `ADR-0006` | `Decisão` | canonical owner | `AC-PLAT-001/002`; `C-PLAT-001/006` |
| `PLAT-PERSIST-002` | `O-032` | `ADR-0006` | `Decisão` | canonical owner | `AC-PLAT-001/012`; `C-PLAT-001/012/015` |
| `PLAT-EFFECT-001` | `O-033` | `ADR-0006` | `Decisão` | canonical owner | `AC-PLAT-002`; `C-PLAT-001/006` |
| `PLAT-EFFECT-002` | `O-033` | `ADR-0006` | `Decisão` | canonical owner | `AC-PLAT-003`; `C-PLAT-002/007` |
| `PLAT-IDEMP-001` | `O-034` | `ADR-0006` | `Decisão` | canonical owner | `AC-PLAT-004`; `C-PLAT-003/008/020` |
| `PLAT-RECON-001` | `O-035` | `ADR-0006` | `Decisão` | canonical owner | `AC-PLAT-005/006`; `C-PLAT-002/003/021` |
| `PLAT-RECON-002` | `O-035` | `ADR-0006` | `Decisão` | canonical owner | `AC-PLAT-007`; `C-PLAT-009/018` |
| `PLAT-RECON-003` | `O-036` | `ADR-0006` | `Decisão` | canonical owner and failure owner | `AC-PLAT-005/007/008/012`; `C-PLAT-009/010/016/021` |
| `PLAT-RECOVERY-001` | `O-037` | `ADR-0006` | `Decisão` | canonical owner; consumes EXEC | `AC-PLAT-009`; `C-PLAT-004/017/020` |
| `PLAT-RECOVERY-002` | `O-037` | `ADR-0006` | `Decisão` | canonical owner | `AC-PLAT-003/009/011`; `C-PLAT-007/012` |
| `PLAT-RETRY-001` | `O-038` | `ADR-0006` | `Decisão` | canonical owner | `AC-PLAT-006/010`; `C-PLAT-003/011` |
| `PLAT-RETRY-002` | `O-038` | `ADR-0006` | `Decisão` | canonical owner | `AC-PLAT-011`; `C-PLAT-005/012` |

No normative requirement in this SPEC lacks a portfolio obligation and
accepted ADR authority.

## 24. Known Gap Summary

| Gap subject | Classification | Related requirement | Evidence |
|---|---|---|---|
| Production database, append-only journal and outbox absent | `IMPLEMENTATION_GAP` | `PLAT-PERSIST-001/002` | no persistence/runtime project outside `prototype/src/*`; prototype state is in memory |
| Durable intent/evidence/confirmation boundary absent | `IMPLEMENTATION_GAP` | `PLAT-EFFECT-001/002` | mock command lifecycle and scenario data only; no production effect adapter/evidence store |
| Production deterministic-key and evidence reconciliation absent | `IMPLEMENTATION_GAP` | `PLAT-IDEMP-001`, `PLAT-RECON-001/003` | prototype contains fixture keys/results; no durable external-effect reconciliation |
| Restart reconstruction and safe-checkpoint recovery absent | `IMPLEMENTATION_GAP` | `PLAT-RECOVERY-001/002` | mock recovery fixture/tests exist, but no restartable production process or durable replay |
| Bounded cooperative retry/pause/cancel/shutdown enforcement absent | `IMPLEMENTATION_GAP` | `PLAT-RETRY-001/002` | prototype exposes mock fields/actions; no production backend lifecycle |
| Prototype scenarios and tests | `PROTOTYPE_ONLY` | all requirements | `prototype/src/mockDomain.ts`, `prototype/tests/mockDomain.test.ts`, `prototype/src/App.tsx` |
| Component specification | `NON_GAP` after this generation | all requirements | this artifact; independent SPEC audit remains downstream |
| Architecture/ownership | `NON_GAP` | all requirements | approved portfolio audit and accepted ADR-0006 |

This is a known-divergence summary, not the formal Gap Matrix. No future
implementation unit or ticket is assigned here.

## 25. Dependencies

| Dependency SPEC | Contract consumed | Blocking? | Evidence |
|---|---|---|---|
| `SPEC-DOM-001` | `DOM-ID-001`, `DOM-SNAPSHOT-001`, `DOM-LIFE-001`, `DOM-STATE-001`, `DOM-CMD-001`, `DOM-ADV-001`, `DOM-PUB-001` | yes | approved portfolio DAG; audit `PASS — COMPONENT_SPEC_CONFORMANT` |
| `SPEC-EXEC-001` | `EXEC-SNAPSHOT-001`, `EXEC-MANIFEST-001/002/003`, `EXEC-HISTORY-001` | yes | approved portfolio DAG; audit `PASS — COMPONENT_SPEC_CONFORMANT` |

`SPEC-GIT-001`, `SPEC-BACKEND-001` and `SPEC-OPS-001` are consumers or
adjacent effect/projection owners, not new upstream dependencies. No dependency
was added beyond the approved portfolio graph.

## 26. Risks

| Risk | Mitigation / conformance |
|---|---|
| Retry duplicates an external effect | deterministic key, evidence-first reconciliation, `C-PLAT-003/008` |
| Accepted/transported is mistaken for confirmed | intent/evidence ordering, `C-PLAT-002/007` |
| Git or database silently becomes the winner | `PLAT-RECON-002/003`, `C-PLAT-009/018` |
| Journal history is rewritten during recovery | append-only rule, `C-PLAT-012/020` |
| Current registry/basis reinterprets history | exact EXEC basis and historical replay, `C-PLAT-017/020` |
| UI/API/OPS projection becomes canonical | projection isolation, `C-PLAT-015/016` |
| Pause/cancel/shutdown loses in-flight intent | cooperative checkpoint and durable outbox, `C-PLAT-005/012` |
| Legacy path remains a second canonical path | adapter-only compatibility, `C-PLAT-019` |

## 27. Implementation Details Intentionally Unfrozen

The following remain implementation choices unless a later accepted ADR freezes
them:

- database engine, physical schema, migration mechanism and transaction API;
- journal/outbox table or file layout and serialization format;
- event bus, queue, scheduler and replay transport;
- class, function, module, namespace and file names;
- adapter libraries and process invocation mechanism;
- exact deterministic-key encoding, provided equal inputs produce equal keys;
- retry delay/backoff and internal worker topology, within the normative bound;
- API routes, DTOs, frontend framework and UI wording; and
- storage layout for operational projections, backups and exports.

These freedoms cannot change IDs, ownership, ordering, evidence requirements,
failure meanings, retry bound or recovery invariants.

## 28. Open Questions

### IMPLEMENTATION_DETAIL_QUESTION

- Which local database and schema representation best supports durable journal
  append, outbox replay and testable backup/restore?
- Which adapter boundary exposes provider evidence and hashes consistently?
- Which internal replay mechanism rebuilds projections efficiently while
  preserving append-only history?

These questions do not block independent SPEC validation.

### ARCHITECTURAL_QUESTION

None. If a future answer changes ownership, canonical identity, failure
meaning, compatibility, recovery authority or the dependency DAG, work MUST
stop for `BLOCKED — ARCHITECTURAL DECISION REQUIRED` or
`BLOCKED — PORTFOLIO DECOMPOSITION CHANGE REQUIRED` and a new approved basis.

## 29. Definition of Done

- portfolio revision `2` has independent verdict
  `PORTFOLIO_DECOMPOSITION_APPROVED`;
- `ADR-0006` is accepted/effective at revision `3`;
- all seven owned obligations `O-032`–`O-038` have complete requirements;
- DOM and EXEC upstream contracts are consumed without redefinition;
- intent, evidence, confirmation, idempotency, four reconciliation classes,
  restart recovery and bounded cooperative retry are explicit;
- failure, compatibility, projection and external-effect boundaries are
  explicit;
- every normative requirement has ADR/obligation traceability and binary
  acceptance/conformance coverage;
- repository evidence was inspected and current gaps were classified;
- no architecture gap, portfolio ownership gap, unapproved dependency or
  ambiguous failure owner remains; and
- no Gap Matrix, Implementation Plan, ticket, ADR or production code was
  generated.

## 30. Mechanical Validation

```text
PORTFOLIO_OBLIGATIONS_OWNED = 7
PORTFOLIO_OBLIGATIONS_COVERED = 7
OWNED_OBLIGATIONS_UNCOVERED = 0
NORMATIVE_REQUIREMENTS = 12
REQUIREMENTS_WITHOUT_AUTHORITY = 0
CONSUMED_CONTRACTS = 6 contract groups; 2 normative upstream SPECs
CONSUMED_CONTRACTS_REDEFINED = 0
FAILURES_OWNED = 4 canonical reconciliation results
FAILURES_CONSUMED = 4 adjacent failure groups
AMBIGUOUS_FAILURE_OWNERS = 0
NORMATIVE_DEPENDENCIES = 2
NEW_UNAPPROVED_DEPENDENCIES = 0
KNOWN_SPECIFICATION_GAPS = 0
KNOWN_IMPLEMENTATION_GAPS = 5
ARCHITECTURE_GAPS = 0
PORTFOLIO_OWNERSHIP_GAPS = 0
ACCEPTANCE_CRITERIA = 12
CONFORMANCE_TESTS = 21
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

## 31. Adversarial Validation

- Ownership: every normative behavior is within `O-032`–`O-038`; DOM, EXEC,
  GIT, BACKEND and OPS behavior is referenced or locally mapped, not reowned.
- Dependency: the only normative upstream edges are the approved
  `PLAT → DOM` and `PLAT → EXEC-001` edges; no cycle or downstream dependency
  was introduced.
- Authority: repository and prototype behavior are evidence only; a journal
  projection, transport event or UI status cannot become canonical.
- Failure: all four PLAT results have one semantic owner; consumed failure
  families retain their original owner and meaning.
- Compatibility: legacy is an adapter, historical replay preserves the
  original basis, and unresolved cutover divergence blocks instead of silently
  selecting a source.
- Recovery: saved status, process exit and transport success are insufficient;
  intent, key, basis and evidence are required.
- Quality: requirements are independently testable, authority-linked and free
  of class/file/phase/ticket prescriptions.

## 32. Final Gate

```text
READY_FOR_SPEC_VALIDATION
```
