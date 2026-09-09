---
schema_version: "1.0.0"
id: SPEC-REPO-001
title: Repository Onboarding and Legacy Migration
status: PROPOSED
revision: 2
date: 2026-09-09
spec_scope: repositories
portfolio: SPEC-PORTFOLIO-001
portfolio_revision: 2
portfolio_verdict: PORTFOLIO_DECOMPOSITION_APPROVED
portfolio_audit: docs/specs/SPEC-PORTFOLIO-001-decomposition-audit.md
authoritative_adrs: [ADR-0010]
related_adrs: [ADR-0001, ADR-0003, ADR-0006, ADR-0009, ADR-0011]
upstream_dependencies: [SPEC-DOM-001, SPEC-EXEC-001, SPEC-PLAT-001]
---

# SPEC-REPO-001 — Repository Onboarding and Legacy Migration

## 1. Status

`PROPOSED` — revisão 2, com as correções da remediação dirigida pela auditoria;
pronta para nova validação independente da SPEC.

Generation baseline:

| Item | Value |
|---|---|
| Target component | `SPEC-REPO-001` |
| Governing portfolio | `SPEC-PORTFOLIO-001`, revision `2` |
| Portfolio audit | `docs/specs/SPEC-PORTFOLIO-001-decomposition-audit.md` |
| Portfolio verdict | `PORTFOLIO_DECOMPOSITION_APPROVED` |
| Primary ADR | `ADR-0010`, revision `3`, `decision_status: ACCEPTED` |
| Upstream normative SPECs | `SPEC-DOM-001` revision `2`; `SPEC-EXEC-001` revision `1`; `SPEC-PLAT-001` revision `1` |
| Upstream audits | DOM, EXEC-001 and PLAT-001 audits all report `PASS — COMPONENT_SPEC_CONFORMANT` |
| Repository HEAD inspected | `8c7860a915fa1906127bff0e799407a64568a035` |
| Existing target draft | none found before generation |
| Prior Gap Matrix | none found for this component |
| Working tree note | pre-existing untracked `.codex/` and `docs/specs/implementation-plans/` were preserved and not treated as target evidence |

This specification materializes ownership already assigned by the approved
portfolio and does not redefine portfolio boundaries. It is not an
Implementation Plan, ticket set or production implementation.

## 2. Ownership

### Owns

This component is the single normative owner of:

- explicit, versioned repository configuration and its registration boundary;
- registration-time validation of repository cleanliness, exact local/remote
  alignment and configured paths, schemas, commands and policies;
- explicit legacy migration before normal enablement;
- the bootstrap catalog boundary, candidate configuration and isolated
  migration workspace;
- the onboarding lifecycle from discovery through atomic promotion to
  `ENABLED`;
- preservation and recovery semantics for onboarding failure, pause and
  cancellation; and
- the invariant that one execution belongs to exactly one repository and that
  cross-repository dependencies are outside the initial scope.

These limits correspond exactly to portfolio obligations `O-055…O-059`.

### Consumes

- `SPEC-DOM-001`: canonical `RepositoryId`, repository enablement references,
  ADR/SPEC revision eligibility, immutable snapshot and domain lifecycle
  contracts;
- `SPEC-EXEC-001`: versioned skill/capability registry, bootstrap allowlist,
  exact contract versions, manifest and checkpoint contracts;
- `SPEC-PLAT-001`: durable candidate/workspace effect intent, evidence,
  idempotency, reconciliation, restart recovery and bounded operational retry;
- formal audit/remediation verdict semantics from `SPEC-DOM-001`/ADR-0009;
  REPO applies those verdicts to onboarding without redefining audit authority.

### Does not own

This component does not own:

- canonical aggregate identities, ADR eligibility semantics, general workflow
  state machines, ticket transitions, publication vocabulary or audit verdict
  semantics owned by `SPEC-DOM-001`;
- skill schemas, semantic versioning, normal capability contracts or general
  manifest semantics owned by `SPEC-EXEC-001`;
- database/journal/outbox primitives, generic effect reconciliation or
  physical recovery mechanics owned by `SPEC-PLAT-001`;
- normal execution of skills after enablement;
- branches, worktrees, commits, waves, GitHub publication or remote
  confirmation owned by `SPEC-GIT-001`;
- API envelopes, local authentication, notifications or UI presentation owned
  by `SPEC-BACKEND-001`/`SPEC-UI-001`;
- observability retention, backup and export policy owned by `SPEC-OPS-001`;
- repository-to-repository orchestration, heuristically inferred conventions,
  implementation phases, classes, modules, routes, tables or libraries.

## 3. Portfolio Authority

This specification materializes ownership already assigned by the approved
portfolio and does not redefine portfolio boundaries.

| Evidence | Use |
|---|---|
| `docs/specs/SPEC-PORTFOLIO-001-organization.md` | canonical obligation registry, owner/consumer roles, failure ownership, compatibility registry and dependency DAG |
| `docs/specs/SPEC-PORTFOLIO-001-decomposition-audit.md` | latest independent Gate A approval: `PORTFOLIO_DECOMPOSITION_APPROVED` |
| `docs/specs/SPEC-PORTFOLIO-001-decomposition-remediation.md` | historical remediation evidence only; not an approval source |

The portfolio allocates `O-055…O-059` to `SPEC-REPO-001`, declares direct
normative edges `REPO → DOM`, `REPO → EXEC-001` and `REPO → PLAT-001`, and
lists `SPEC-GIT-001` and `SPEC-BACKEND-001` as downstream consumers rather
than upstream authorities.

## 4. ADR Authority

### Primary accepted ADR

| ADR | Revision/status | Sections used | Local consequence |
|---|---:|---|---|
| `ADR-0010` | `3` / `ACCEPTED`, `UNPROCESSED` | Decisão, Bootstrap de onboarding, Consequências, Alternativas rejeitadas | explicit versioned configuration; clean/exact-aligned registration; explicit legacy migration; isolated bootstrap/candidate/workspace; formal audited promotion to `ENABLED`; one repository per execution |

### Related accepted ADRs

| ADR | Relation kept without moving ownership |
|---|---|
| `ADR-0001` | supplies canonical repository identity, snapshots and accepted-revision handling; DOM remains owner |
| `ADR-0003` | supplies versioned skill/capability registry and bootstrap/normal catalog distinction; EXEC-001 remains owner |
| `ADR-0006` | supplies intent/evidence/idempotency/recovery boundary for onboarding effects; PLAT remains owner |
| `ADR-0009` | supplies formal audit/remediation cycles and structured verdict closure; DOM remains semantic owner |
| `ADR-0011` | allows backend onboarding mode before `ENABLED`; BACKEND remains owner of service/API behavior |

All inspected ADRs have `decision_status: ACCEPTED`, revision `3`,
`implementation_status: UNPROCESSED`, and no effective successor. No repository
evidence overrides these decisions.

## 5. Problem Statement

`ADR-0010` requires each repository to have an explicit, versioned policy for
paths and conventions of ADRs, SPECs, Gap Matrices, plans and tickets; the
main branch; mandatory build/test/lint commands; publication strategy; and
supported policies. Registration must reject a dirty or locally/remotely
diverged repository without stash, commit, discard or automatic correction.

Legacy repositories must be migrated explicitly before normal processing can
be enabled. The accepted bootstrap decision removes the circularity by giving
onboarding its own system-owned catalog, candidate configuration and isolated
workspace. A formal audit verdict, not the existence of files or a UI status,
promotes the candidate atomically to active configuration and `ENABLED`.

The current repository contains only an in-memory React/TypeScript prototype.
It demonstrates an onboarding scenario and command journey, but has no
production registry, validator, durable candidate workspace, Git/`gh`
integration or backend. Without this boundary, normal runtime behavior could
be inferred from an unvalidated repository or a legacy layout could silently
become a second canonical path.

Satisfying this SPEC enables a repository to enter the normal orchestrator
workflow only after its configuration and legacy migration evidence are
validated, audited and promoted under the approved authority boundaries.

## 6. Goals

- A repository cannot be registered for normal processing without an explicit
  versioned configuration and a clean, exactly aligned local/remote basis.
- The configuration records all repository-specific paths, conventions,
  mandatory commands, publication strategy and supported policies required by
  `ADR-0010`.
- A legacy repository is migrated in a candidate workspace by bootstrap
  capabilities before it can become `ENABLED`.
- Migration, audit and remediation are separate activities and a migration
  result cannot audit or approve itself.
- Failure, pause and cancellation preserve the candidate workspace and leave
  the active configuration and repository disabled.
- Only a formal approved audit verdict permits atomic promotion; an active
  configuration is not mutated during onboarding.
- Every execution has one canonical repository identity, and no initial
  execution depends on another repository.

## 7. Non-Goals

- Defining domain identities, general state machines, audit verdict schemas or
  the semantics of accepted ADR revisions.
- Defining JSON Schema, semver or normal capability behavior beyond local use
  of the EXEC-001 bootstrap contract.
- Defining the database, journal, outbox, effect reconciliation algorithm or
  physical workspace storage technology.
- Defining normal skill execution, scheduling, Git publication, API routes,
  authentication, notifications, retention or frontend interaction.
- Choosing path names, file formats beyond the accepted Markdown front matter
  contract, database technology, transport, process model or adapter library
  where no ADR freezes them.
- Creating a Gap Matrix, implementation plan, tickets, migration phases or
  production code.

## 8. Current Repository State

| Area | Current behavior | Target behavior | Classification |
|---|---|---|---|
| ADR authority | `docs/adrs/ADR-0010-repository-configuration-and-legacy-migration.md` is accepted, revision 3 | accepted ADR authority is consumed by onboarding | `ALREADY_CONFORMANT` |
| Portfolio allocation | approved audit assigns `O-055…O-059` and three direct upstream edges | REPO boundary follows the approved registry and DAG | `ALREADY_CONFORMANT` |
| Production repository registry/configuration | no production registry or versioned repository configuration exists | explicit validated versioned configuration | `IMPLEMENTATION_GAP` |
| Git cleanliness/alignment checks | no production Git/remote validator or `gh` integration exists | registration fails closed unless clean and exactly aligned | `IMPLEMENTATION_GAP` |
| Bootstrap catalog | no production skill/capability catalog exists | system-owned bootstrap catalog consumes EXEC-001 allowlist | `IMPLEMENTATION_GAP` |
| Legacy onboarding | `prototype/src/mockDomain.ts:27` models onboarding states; commands at `:918–926` simulate migration and enablement in memory | isolated candidate workspace and audited atomic promotion | `PROTOTYPE_ONLY` |
| Onboarding tests | `prototype/tests/mockDomain.test.ts:793–820` and `:1107–1115` exercise the happy path and assignment separation in the mock | independent production conformance with real persistence/effects | `PROTOTYPE_ONLY` |
| Durable candidate workspace/evidence | no backend, database, journal, outbox or external effect adapter exists | consume PLAT intent/evidence/recovery without redefining PLAT | `IMPLEMENTATION_GAP` |
| Backend onboarding mode | no .NET backend exists | backend may expose onboarding before `ENABLED`, without becoming repository authority | `IMPLEMENTATION_GAP` |
| Target component SPEC | absent before this generation | auditable component SPEC with complete authority traceability | `SPECIFICATION_GAP` |
| Technology/layout choices | no implementation technology is frozen by the governing ADRs | retain implementation freedom within the normative contracts | `UNFROZEN_IMPLEMENTATION_DETAIL` |
| Architecture/ownership | approved decomposition and accepted ADRs allocate this boundary; no contradiction found | preserve allocation; no new decision required | `NON_GAP` |

Prototype behavior is supporting evidence only. It does not prove durable
configuration, real Git alignment, external migration, atomic promotion or
production security.

## 9. Owned Architectural Obligations

| Portfolio obligation | ADR authority | Source section | Local treatment |
|---|---|---|---|
| `O-055` | `ADR-0010` | Decisão | explicit versioned repository configuration and registration contract; `REPO-CONFIG-001/002` |
| `O-056` | `ADR-0010` | Decisão; Consequências | clean-tree and exact local/remote alignment validation with no destructive correction; `REPO-VALIDATE-001/002` |
| `O-057` | `ADR-0010` | Decisão; Bootstrap de onboarding | explicit legacy migration, separated migration/audit/remediation, legacy compatibility and retirement; `REPO-MIGRATE-001/002`, `REPO-CUTOVER-001`, `REPO-FAILURE-001` |
| `O-058` | `ADR-0010` | Bootstrap de onboarding | bootstrap catalog, candidate configuration, isolated workspace, onboarding lifecycle, preservation and atomic promotion to `ENABLED`; `REPO-BOOTSTRAP-001/002/003`, `REPO-ENABLE-001/002`, `REPO-RECOVERY-001`, `REPO-FAILURE-001` |
| `O-059` | `ADR-0010` | Decisão | one repository per execution and no initial cross-repository dependency; `REPO-SCOPE-001` |

All five owned obligations are represented by normative requirements,
acceptance criteria and conformance tests below.

## 10. Consumed Contracts

| Owner SPEC | Contract / requirement | Why consumed | Local rule |
|---|---|---|---|
| `SPEC-DOM-001` | `DOM-ID-001` | repository and execution records require canonical identity | reference `RepositoryId`/`ExecutionId`; do not create a competing identity or infer identity from a path/name |
| `SPEC-DOM-001` | `DOM-ELIG-001`, `DOM-SNAPSHOT-001`, `DOM-LIFE-001` | onboarding must reject ineligible revisions and bind its active basis | validate against the supplied DOM contract; do not redefine ADR eligibility, snapshot immutability or general lifecycle semantics |
| `SPEC-DOM-001` | `DOM-AUDIT-001/002/003` | migration approval is a formal audited result | consume structured verdict, role separation and round-limit semantics; REPO cannot self-approve or redefine the audit cycle |
| `SPEC-EXEC-001` | `EXEC-REGISTRY-001/002/003`, `EXEC-CAPABILITY-001` | bootstrap must resolve only registered bootstrap capabilities | use the system-owned bootstrap catalog and its allowlist; normal capability semantics remain EXEC-owned |
| `SPEC-EXEC-001` | `EXEC-SNAPSHOT-001`, `EXEC-MANIFEST-001/002/003`, `EXEC-HISTORY-001` | onboarding activities need exact skill/version/checkpoint basis and historical replay | persist/reference the received basis; no current registry may reinterpret a prior migration |
| `SPEC-PLAT-001` | `PLAT-PERSIST-001/002`, `PLAT-EFFECT-001/002`, `PLAT-IDEMP-001` | candidate configuration promotion and migration effects must be durable and idempotent | request/evidence/confirmation use PLAT’s boundary; do not claim promotion from a request or process exit alone |
| `SPEC-PLAT-001` | `PLAT-RECON-001/003`, `PLAT-RECOVERY-001/002`, `PLAT-RETRY-001/002` | failure, pause, cancellation and restart must preserve candidate state and converge safely | classify and propagate PLAT results; do not collapse reconciliation outcomes or create a second retry/recovery authority |

The three listed SPECs are exactly the approved normative upstream dependencies.
`SPEC-BACKEND-001`, `SPEC-GIT-001`, `SPEC-OPS-001` and `SPEC-UI-001` are
downstream consumers or mappings, not new upstream dependencies. No consumed
contract is redefined.

## 11. Target Behavioral Model

```text
repository target + explicit registration command
        ↓
system bootstrap catalog + candidate configuration + isolated workspace
        ↓
validate paths/schemas/commands/Git basis
        ↓
bootstrap → explicit migration → verification → independent audit
        ↓ approved structured verdict
candidate configuration/evidence promoted atomically
        ↓
RepositoryId becomes ENABLED for normal runtime consumption
```

The active configuration remains unchanged throughout discovery, validation,
bootstrap, migration, verification, audit and remediation. A failed or
cancelled candidate remains available for recovery/audit and does not enable
normal processing. DOM supplies canonical identity and eligibility; EXEC
supplies bootstrap contracts; PLAT supplies durable effects and recovery.

## 12. Identity and Authority Rules

| Identity/data | Canonical owner | Reference identity | Local correlation | Derived projection |
|---|---|---|---|---|
| `RepositoryId` | `SPEC-DOM-001` | target repository for onboarding/execution | onboarding correlation | repository name/path shown to users |
| `ExecutionId` | `SPEC-DOM-001` | exactly one `RepositoryId` | command/activity correlation | execution status |
| candidate configuration revision | `SPEC-REPO-001` within `O-055/O-058` | candidate basis before promotion | onboarding/candidate correlation | displayed configuration version |
| migration workspace identity | `SPEC-REPO-001` for onboarding scope; durable mechanics consumed from PLAT | isolated candidate workspace | activity/effect correlation | workspace path/label |
| bootstrap skill/version/manifest | `SPEC-EXEC-001` | exact registered contract basis | activity/attempt correlation | capability label |
| migration evidence and promotion effect | `SPEC-PLAT-001` for persistence/effect evidence; REPO owns enablement meaning | candidate/configuration identity | effect correlation | audit/progress view |

`RepositoryId` is not replaced by a filesystem path, remote URL, branch name or
display label. Candidate configuration and workspace identities are not
alternative domain repository identities. A transport, UI or operational
projection cannot authorize enablement.

## 13. Normative Requirements

### REPO-CONFIG-001 — Explicit versioned repository configuration

Every repository registration MUST reference an explicit versioned
configuration. The configuration MUST declare the paths and conventions for
ADRs, SPECs, Gap Matrices, Implementation Plans and tickets; the main branch;
mandatory build, test and lint commands; publication strategy; and supported
repository-specific policies. A missing, unversioned or partially declared
configuration MUST NOT be used as the active configuration.

Authority: `O-055`, `ADR-0010`, `Decisão`.

### REPO-CONFIG-002 — Configuration basis and history

An accepted configuration revision MUST be identifiable as a candidate or
active basis and MUST remain immutable for any execution that has already
started. A later configuration change MUST produce a new candidate/revision
and MUST NOT silently alter an existing execution’s snapshot or reinterpret
its history. Configuration content MUST use the repository’s accepted
front-matter and validation contracts where applicable.

Authority: `O-055`, `ADR-0010`, `Decisão`; consumes `DOM-SNAPSHOT-001` and
`EXEC-SNAPSHOT-001`.

### REPO-VALIDATE-001 — Clean and exactly aligned registration basis

Before a repository is registered for normal processing, validation MUST
confirm a clean working tree and exact alignment between the configured local
main branch and its remote counterpart after the required fetch/inspection.
The validation MUST preserve the observed commit/base evidence. A dirty tree,
missing remote, diverged branch or unverifiable alignment MUST fail closed and
MUST NOT produce an enabled repository.

Authority: `O-056`, `ADR-0010`, `Decisão`.

### REPO-VALIDATE-002 — No destructive or heuristic correction

Registration and onboarding MUST NOT stash, commit, discard, reset, force-push
or otherwise correct repository divergence automatically. It MUST validate
the configured paths, front matter/schema contracts, required commands,
publication strategy and the required Git and `gh` tools as onboarding
prerequisites. Missing or incompatible Git/`gh`, paths, schemas, commands or
publication policy MUST produce structured rejection evidence rather than
heuristic discovery or silent fallback to a convention.

Authority: `O-056`, `ADR-0010`, `Decisão` and `Consequências`.

### REPO-MIGRATE-001 — Explicit legacy migration before enablement

A repository whose existing artifacts do not satisfy the active configuration
MUST enter an explicit legacy-migration path before normal enablement. The
system MUST NOT migrate silently during first normal processing, infer a
replacement structure heuristically, or treat legacy artifacts as already
conformant. Until migration is approved and promoted, normal execution MUST
remain unavailable.

Authority: `O-057`, `ADR-0010`, `Decisão` and `Alternativas rejeitadas`.

### REPO-MIGRATE-002 — Segregated migration, audit and remediation

Migration, audit and remediation MUST be separate onboarding activities with
distinct activity identities and role provenance. The migration activity MUST
NOT audit or approve its own output; the audit activity MUST emit the
structured verdict owned by the formal audit contract; remediation MUST return
the candidate to audit. The configured audit round limit and continuation
authorization remain those of `DOM-AUDIT-003`; REPO MUST NOT redefine them.

Authority: `O-057`, `ADR-0010`, `Bootstrap de onboarding`; consumes
`DOM-AUDIT-001/002/003` and the applicable activity/manifest contracts of
`SPEC-EXEC-001`. Assignment/session semantics, if needed by runtime dispatch,
remain owned by their upstream contract and are not defined here.

### REPO-BOOTSTRAP-001 — System-owned bootstrap catalog

Onboarding before `ENABLED` MUST resolve discovery, validation, migration,
audit and remediation capabilities from a system-owned bootstrap catalog that
is independent of the repository’s active configuration and normal runtime
catalog. A capability not allowed for bootstrap MUST be rejected as an
incompatible bootstrap capability and MUST NOT enable the repository or run
normal work.

Authority: `O-058`, `ADR-0010`, `Bootstrap de onboarding`; consumes
`EXEC-REGISTRY-002/003` and `EXEC-CAPABILITY-001`.

### REPO-BOOTSTRAP-002 — Isolated candidate configuration and workspace

Bootstrap and migration MUST operate on a candidate configuration and a
dedicated workspace isolated from the active configuration and normal
execution workspace. The active configuration MUST NOT be mutated by
discovery, migration, remediation, audit or failed promotion. Candidate
artifacts, their exact basis and their evidence MUST remain correlated to the
canonical `RepositoryId` and onboarding identity.

Authority: `O-058`, `ADR-0010`, `Bootstrap de onboarding`; consumes
`DOM-ID-001`, `EXEC-MANIFEST-001/003` and `PLAT-PERSIST-001`.

### REPO-BOOTSTRAP-003 — Onboarding lifecycle and gates

The externally authoritative onboarding lifecycle MUST expose exactly these
ordered states:

```text
DISCOVERED → VALIDATING → MIGRATING → AUDITING ↔ REMEDIATING
           → READY_TO_ENABLE → ENABLED
```

Inspection and verification work MAY be recorded as non-authoritative activity
details, but MUST NOT be exposed as onboarding lifecycle states, enablement
evidence or gate transitions. Any state skip or transition other than the
listed forward transitions and `AUDITING ↔ REMEDIATING` MUST be rejected.
`READY_TO_ENABLE` requires a valid candidate, successful required validation,
completed migration/verification evidence and an approved formal audit verdict.
`ENABLED` requires the atomic promotion defined by `REPO-ENABLE-001` and
`REPO-ENABLE-002`.

Authority: `O-058`, `ADR-0010`, `Bootstrap de onboarding`; consumes
`DOM-LIFE-001` and `DOM-AUDIT-002`.

### REPO-ENABLE-001 — Atomic audited promotion

Promotion MUST atomically make the audited candidate configuration active and
transition the repository to `ENABLED`. Promotion MUST be rejected when the
candidate basis, repository basis, migration evidence or formal audit verdict
does not match the candidate being promoted. A request, an accepted command,
a process exit, a UI status or a partial file copy MUST NOT be treated as
enablement confirmation without compatible durable evidence from the PLAT
effect boundary.

Authority: `O-058`, `ADR-0010`, `Bootstrap de onboarding`; consumes
`PLAT-EFFECT-001/002`, `PLAT-IDEMP-001`, `DOM-AUDIT-002`.

### REPO-ENABLE-002 — Serialized and idempotent promotion decision

For one canonical `RepositoryId`, promotion MUST compare the requested
candidate revision, exact candidate/repository basis and approved audit
verdict with the current promotion candidate. Concurrent requests MUST be
serialized so that only the request matching the current candidate and basis
can change active configuration and transition the repository to `ENABLED`.
A stale or losing request MUST be rejected without mutation. A duplicate
request for an already confirmed candidate MUST return the existing compatible
confirmation and evidence without a second activation. A different candidate
or revision MUST be rejected until a new onboarding candidate is explicitly
created and audited.

The active-configuration change and `ENABLED` transition MUST remain one
atomic promotion decision. If the effect is incomplete or its evidence is
missing or divergent, the repository MUST remain not enabled and the candidate
and pending effect evidence MUST remain recoverable under `REPO-RECOVERY-001`.

Authority: `O-058`, `ADR-0010`, `Bootstrap de onboarding`; consumes
`PLAT-EFFECT-001/002`, `PLAT-IDEMP-001` and `DOM-AUDIT-002`.

### REPO-RECOVERY-001 — Preserve candidate on failure, pause or cancellation

Failure, pause, cancellation or shutdown during onboarding MUST preserve the
candidate workspace, active configuration, migration evidence and incomplete
effect records needed for audit or recovery. The repository MUST remain not
enabled until a later validated and audited promotion succeeds. Restart MUST
reconstruct onboarding from durable records and the exact manifest/basis; it
MUST NOT resume from an in-memory flag or claim enablement from an isolated
saved status.

Authority: `O-058`, `ADR-0010`, `Bootstrap de onboarding`; consumes
`PLAT-PERSIST-002`, `PLAT-RECOVERY-001/002` and `PLAT-RETRY-002`.

### REPO-SCOPE-001 — One repository per execution

Each execution MUST reference exactly one canonical `RepositoryId`. An
execution MUST reject a command or dependency that targets a second repository
or requires cross-repository ordering. Repository-to-repository dependencies
MUST remain outside this initial component contract and MUST NOT be invented
as an onboarding workaround.

Authority: `O-059`, `ADR-0010`, `Decisão`; consumes `DOM-ID-001`.

### REPO-FAILURE-001 — Canonical repository and legacy failures

The component MUST preserve these owned canonical failure meanings and the
deterministic state/retry/recovery rules below:

| Failure | Trigger | Canonical state after rejection | Retryability and recovery | Required evidence / projection |
|---|---|---|---|---|
| `UNKNOWN_REPOSITORY` | target cannot resolve to a canonical `RepositoryId` | no onboarding aggregate or candidate is created; no enablement is implied | retry is allowed only after explicit target/configuration registration; repeating the same unresolved request does not imply success | record target, correlation and resolution failure; projection remains non-enabled and failure-only |
| `REPOSITORY_NOT_ENABLED` | normal runtime work is requested before audited promotion | candidate, if present, and active configuration are unchanged; repository remains not enabled | retry is allowed only after validated bootstrap promotion; the same request remains an idempotent rejection until then | record `RepositoryId`, request and rejection basis; projection cannot report normal processing or enablement |
| `LEGACY_COMPATIBILITY_ONLY` | a legacy path is presented as a canonical active path or used outside explicit migration/replay | candidate and active configuration are unchanged; legacy artifact remains migration/replay-only | retry is allowed only through explicit migration/replay with the original basis; duplicate legacy processing is rejected | record legacy basis/path/hash and mapping; projection remains legacy-only and cannot authorize normal work |

These failures MUST remain distinguishable, typed, fail closed and correlated
to the repository/onboarding identity. The matrix is normative for the
post-rejection state, retry condition, recovery path and evidence projection.
Backend, UI and OPS may map or present them, but MUST NOT translate them into
success or into another canonical failure.

Authority: `O-055/O-057/O-058`, `ADR-0010`, `Decisão` and `Bootstrap de
onboarding`; canonical failure owner per portfolio.

### REPO-CUTOVER-001 — Legacy compatibility, replay and retirement

Legacy compatibility MUST be an adapter into the new canonical configuration
and onboarding path, never a parallel canonical path. Historical replay MUST
retain the original repository/configuration basis and evidence and MUST NOT
reinterpret it using the current registry. After the candidate has been
audited and promoted, normal processing MUST use the active versioned
configuration; the legacy compatibility path remains only for explicitly
scoped migration or historical replay. Retirement of the legacy adapter
requires preserved migration evidence and a verified active basis; it MUST
NOT delete historical evidence or silently convert an incomplete migration
into enablement.

Authority: `O-057/O-058`, `ADR-0010`, `Decisão` and `Bootstrap de onboarding`;
consumes `EXEC-HISTORY-001`, `PLAT-RECOVERY-001/002`.

## 14. Commands / Queries / Events

This component defines the onboarding application boundary, not transport
routes and not the canonical domain command semantics owned by DOM.

| Item | Classification | Local semantics |
|---|---|---|
| register repository / submit configuration | `APPLICATION_COMMAND` | creates or evaluates a candidate basis; requires explicit target and versioned configuration |
| inspect repository | `APPLICATION_COMMAND` | records observed structure and Git basis without enabling or mutating the target |
| validate candidate | `APPLICATION_COMMAND` | validates configured paths, schemas, commands, tools and clean/exact alignment |
| run bootstrap/migration/remediation/audit | `APPLICATION_COMMAND` | invokes only the corresponding bootstrap capability and activity; each result remains separately evidenced |
| prepare enablement / promote candidate | `APPLICATION_COMMAND` | requests the REPO-owned promotion gate; does not imply confirmation until PLAT evidence is compatible |
| onboarding status/history | `QUERY` | returns a projection of canonical onboarding state, candidate basis, evidence and failures |
| onboarding lifecycle transition | `CANONICAL_EVENT` within the REPO boundary | records only the exact approved lifecycle state/evidence change; inspection/verification activity events are non-authoritative and cannot bypass DOM identity, EXEC contract or PLAT effect rules |
| candidate/effect evidence | `INTEGRATION_EVENT` | carries correlated evidence from the owner; it is not itself a domain approval or enablement decision |

Names are stable semantic labels for specification purposes; routes, DTOs and
wire formats remain unfrozen. Transport mappings belong to BACKEND and must
preserve command acceptance, failure meaning and confirmation state.

## 15. Failure Semantics

### Owned canonical failures

`REPO-FAILURE-001` owns `UNKNOWN_REPOSITORY`, `REPOSITORY_NOT_ENABLED` and
`LEGACY_COMPATIBILITY_ONLY`. Each code has the exact post-rejection state,
retryability, recovery condition and evidence obligation in the normative
failure matrix. None may change active configuration or authorize normal
processing on rejection; all must retain repository/candidate correlation and
must remain distinguishable in projections.

### Consumed failures

| Failure family/codes | Owner | REPO treatment |
|---|---|---|
| `UNKNOWN_SPEC`, `INELIGIBLE_REVISION` | `SPEC-DOM-001` | reject the candidate basis and propagate the canonical DOM meaning |
| `UNKNOWN_CAPABILITY`, `INCOMPATIBLE_CAPABILITY` | `SPEC-EXEC-001` | reject bootstrap resolution as specified; no normal fallback |
| `EXPECTED_INCOMPLETE_EFFECT`, `MISSING_EFFECT`, `SEMANTIC_DIVERGENCE`, `CONFLICTING_EFFECT` | `SPEC-PLAT-001` | preserve distinct reconciliation outcome; keep candidate disabled when required |

Failure counting in the mechanical report is by code: 3 owned codes and 8
consumed codes. No local mapping changes retryability, terminality, recovery
or canonical meaning.

## 16. Retry / Idempotency / Recovery

REPO owns the observable rule that onboarding remains recoverable and disabled
after an incomplete operation. PLAT owns the physical mechanism:

- candidate promotion and migration effects persist intent before external
  execution and evidence before confirmation;
- retries reuse the same deterministic key for the same intent and basis;
- compatible evidence confirms without repeating, missing evidence retries
  only within PLAT’s bound, and divergent/conflicting evidence blocks;
- pause, cancellation and shutdown request a safe checkpoint and preserve
  incomplete work;
- restart reconstructs from durable records and exact EXEC basis, never from a
  saved status alone.

REPO MUST NOT add a second retry counter, idempotency algorithm or recovery
source. Operational attempts remain distinct from DOM audit rounds and the
applicable upstream execution-attempt identity.

## 17. Compatibility / Cutover

| Compatibility class | REPO role | Normative rule |
|---|---|---|
| `NEW_CANONICAL_PATH` | `OWNER` (`O-055/O-058`) | active processing uses the explicit versioned configuration and audited enablement path |
| `LEGACY_COMPATIBILITY` | `OWNER` (`O-057`) | legacy structures enter explicit migration only and never become a second canonical authority |
| `HISTORICAL_REPLAY` | `CONSUMER` of DOM/PLAT/EXEC history contracts | original basis, evidence and identity remain intact; current configuration cannot rewrite history |
| `CUTOVER` | `OWNER` (`O-058`) | only approved candidate promotion changes the active configuration and enablement state |
| `RETIREMENT` | `OWNER` (`O-057`) | retire legacy handling only after migration evidence and active-basis verification; preserve history |

This section defines semantic conditions, not implementation phases.

## 18. Projection Boundaries

Onboarding status/history is a projection of REPO state plus consumed DOM,
EXEC and PLAT evidence:

| Boundary | Rule |
|---|---|
| Canonical source | REPO onboarding lifecycle and configuration basis, with DOM identity and PLAT confirmation evidence |
| Projection | status, candidate version, workspace label, validation findings, audit verdict and failure presentation |
| Refresh/replay | re-read canonical records and exact historical basis; replay cannot use current config to alter history |
| Stale behavior | stale status cannot authorize migration, promotion, enablement or normal execution; revalidation is required |
| Authority limit | backend, OPS and UI projections may request or display; they cannot promote, confirm or mutate active configuration |

## 19. External Effects

Applicable onboarding effects are separated as follows:

| Semantic | Owner/treatment |
|---|---|
| request to inspect, migrate or promote | REPO application boundary |
| migration/promotion intent | PLAT durable intent boundary, correlated to candidate and exact basis |
| external execution | the relevant bootstrap capability/adapter; REPO does not equate invocation with success |
| migration/promotion evidence | effect owner and PLAT evidence boundary |
| enablement confirmation | REPO-owned meaning only after compatible PLAT evidence and approved audit basis |
| reconciliation | PLAT canonical reconciliation result; REPO preserves candidate disabled on blocking divergence |
| operational/UI projection | BACKEND/OPS/UI mappings; non-authoritative |

Repository Git inspection is validation evidence for `O-056`; final Git/GitHub
publication remains `SPEC-GIT-001` authority.

## 20. Security / Authorization

No independent authentication or secret-storage authority is allocated to
REPO. It consumes the authorized application request and records actor,
correlation, target, candidate basis and evidence required by the operational
contracts. A UI or transport request cannot write active configuration or
promote a repository by bypassing REPO/DOM/PLAT gates. Credentials used by
Git/`gh` remain governed by the backend/security and adapter contracts; they
must not be copied into candidate configuration, ordinary migration evidence
or projections.

## 21. Conformance Suite

The independent suite MUST run against the production onboarding boundary when
available. Prototype tests are supporting evidence only.

### Positive

- `C-REPO-001`: a complete versioned configuration registers with all required
  paths, commands, policies and publication strategy preserved.
- `C-REPO-002`: a clean repository with exact local/remote alignment produces
  a validated candidate with captured basis evidence.
- `C-REPO-003`: a legacy repository follows exactly the canonical lifecycle,
  with inspection/verification represented only as non-authoritative activity,
  and completes migration plus independent audit before reaching
  `READY_TO_ENABLE`.
- `C-REPO-004`: an approved candidate is promoted atomically and only then
  becomes `ENABLED` for normal runtime use.
- `C-REPO-005`: restart after an incomplete onboarding operation reconstructs
  the candidate and pending work from durable records and exact basis.
- `C-REPO-006`: two executions with different repository identities remain
  separately scoped and neither can depend on the other.

### Negative and fail-closed

- `C-REPO-007`: missing/unversioned configuration is rejected and cannot be
  activated.
- `C-REPO-008`: dirty, diverged or unverifiable local/remote state is rejected;
  no stash, commit, reset, discard or force-push occurs.
- `C-REPO-009`: missing Git/`gh` or required path/schema/command/policy failure
  rejects onboarding without heuristic fallback.
- `C-REPO-010`: normal capability requested from bootstrap is rejected and the
  repository remains not enabled.
- `C-REPO-011`: migration, audit and remediation remain separate activities
  with distinct identities/role provenance; migration cannot self-approve and
  remediation returns the candidate to formal audit.
- `C-REPO-012`: enablement is rejected for a missing, stale or incompatible
  audit verdict, candidate basis or PLAT evidence.
- `C-REPO-013`: pause, cancellation, shutdown or failure preserves the active
  configuration and candidate workspace and does not claim enablement.
- `C-REPO-014`: a stale projection, UI action, transport request or process
  exit cannot authorize enablement.
- `C-REPO-015`: unknown repository, not-enabled normal work and legacy-only
  use remain distinct canonical failures with their specified state, retry,
  recovery and evidence behavior.

### Boundary isolation and dependency conformance

- `C-REPO-016`: implementation consumes DOM identity/eligibility/lifecycle
  without creating a competing repository identity or state machine.
- `C-REPO-017`: implementation consumes EXEC bootstrap/version/manifest
  contracts without redefining normal capability semantics.
- `C-REPO-018`: implementation consumes PLAT intent/evidence/recovery without
  creating a second journal, idempotency or reconciliation authority.
- `C-REPO-019`: BACKEND, GIT, OPS and UI mappings cannot promote a repository,
  redefine a REPO failure or make a projection canonical.
- `C-REPO-020`: legacy compatibility adapts to the new canonical path and
  historical replay preserves original basis/evidence.

### Recovery and synthetic extensibility

- `C-REPO-021`: equivalent bootstrap capabilities registered under the same
  EXEC-001 contract are resolved by the bootstrap catalog without a second
  hard-coded category table.
- `C-REPO-022`: matching migration evidence confirms without duplicate
  external execution; missing evidence retries with the original PLAT key;
  conflicting evidence blocks without silent source selection.
- `C-REPO-023`: each owned failure code produces the exact matrix-defined
  post-rejection state, retry condition, recovery behavior and evidence, and
  repeated or stale requests cannot report success.
- `C-REPO-024`: two concurrent promotion requests for one repository produce
  one serialized winner; a stale loser is rejected without mutation, a
  duplicate confirmed request returns existing evidence, and incomplete
  effect evidence never reports `ENABLED`.

## 22. Acceptance Criteria

| ID | Binary acceptance criterion | Requirement |
|---|---|---|
| `AC-REPO-001` | Given a registration request, the stored configuration includes a version, all required paths/conventions, main branch, build/test/lint commands, publication strategy and policies, or registration is rejected. | `REPO-CONFIG-001` |
| `AC-REPO-002` | Given an execution that has started, changing the repository configuration does not alter its snapshot/basis or historical interpretation; a new basis has a new candidate/revision. | `REPO-CONFIG-002` |
| `AC-REPO-003` | Given a dirty or locally/remotely diverged repository, validation rejects it and records the observed basis without enabling it. | `REPO-VALIDATE-001` |
| `AC-REPO-004` | Given missing Git/`gh`, invalid paths/schemas/commands or unsupported publication policy, validation rejects onboarding and performs no stash, commit, discard, reset, force-push or heuristic correction. | `REPO-VALIDATE-002` |
| `AC-REPO-005` | Given legacy artifacts, normal processing is unavailable until explicit migration and formal approval complete. | `REPO-MIGRATE-001` |
| `AC-REPO-006` | Given migration output, the migration activity cannot be the audit/approval activity, and remediation returns the candidate to the formal audit contract. | `REPO-MIGRATE-002` |
| `AC-REPO-007` | Given a normal capability requested before enablement, bootstrap rejects it and the repository remains not enabled. | `REPO-BOOTSTRAP-001` |
| `AC-REPO-008` | Given onboarding activity, candidate configuration/workspace changes do not mutate active configuration and remain correlated to the canonical repository identity. | `REPO-BOOTSTRAP-002` |
| `AC-REPO-009` | Given any onboarding path, only `DISCOVERED → VALIDATING → MIGRATING → AUDITING ↔ REMEDIATING → READY_TO_ENABLE → ENABLED` is externally authoritative; no transition reaches `READY_TO_ENABLE` without validation, migration/verification evidence and an approved formal audit verdict. | `REPO-BOOTSTRAP-003` |
| `AC-REPO-010` | Given stale/mismatched candidate, audit or effect evidence, promotion is rejected and active configuration remains unchanged. | `REPO-ENABLE-001` |
| `AC-REPO-011` | Given pause, cancellation, shutdown, failure or restart, candidate records remain recoverable, the active configuration is preserved and the repository is not reported as enabled without compatible evidence. | `REPO-RECOVERY-001` |
| `AC-REPO-012` | Given an execution command targeting two repositories or a cross-repository dependency, the command is rejected before normal processing. | `REPO-SCOPE-001` |
| `AC-REPO-013` | Given unknown repository, pre-enable normal work or legacy canonical-path use, the system emits the corresponding distinct failure and does not report success. | `REPO-FAILURE-001` |
| `AC-REPO-014` | Given a legacy or historical artifact after cutover, only explicit migration/replay can consume it; active processing uses the promoted versioned configuration and historical evidence is preserved. | `REPO-CUTOVER-001` |
| `AC-REPO-015` | Given each owned failure code, the exact matrix-defined state remains after rejection, only its specified retry/recovery path is accepted, and correlated evidence remains distinguishable in every projection. | `REPO-FAILURE-001` |
| `AC-REPO-016` | Given concurrent promotion requests for one repository, exactly one current candidate/basis can activate; stale or losing requests do not mutate state, duplicates return existing confirmation, and incomplete effects leave the repository not enabled. | `REPO-ENABLE-002` |

## 23. ADR / Obligation / Requirement Traceability

| Requirement | Portfolio obligation | ADR | ADR section | Ownership role | Acceptance / test |
|---|---|---|---|---|---|
| `REPO-CONFIG-001` | `O-055` | `ADR-0010` | Decisão | canonical owner | `AC-REPO-001`; `C-REPO-001/007` |
| `REPO-CONFIG-002` | `O-055` | `ADR-0010` | Decisão | canonical owner; consumes DOM/EXEC basis | `AC-REPO-002`; `C-REPO-001/005/020` |
| `REPO-VALIDATE-001` | `O-056` | `ADR-0010` | Decisão | canonical owner | `AC-REPO-003`; `C-REPO-002/008` |
| `REPO-VALIDATE-002` | `O-056` | `ADR-0010` | Decisão / Consequências | canonical owner | `AC-REPO-004`; `C-REPO-008/009` |
| `REPO-MIGRATE-001` | `O-057` | `ADR-0010` | Decisão / Alternativas rejeitadas | canonical owner | `AC-REPO-005`; `C-REPO-003/007` |
| `REPO-MIGRATE-002` | `O-057` | `ADR-0010` | Decisão / Bootstrap de onboarding | canonical owner; consumes DOM/EXEC activity basis | `AC-REPO-006`; `C-REPO-003/011` |
| `REPO-BOOTSTRAP-001` | `O-058` | `ADR-0010` | Bootstrap de onboarding | canonical owner; consumes EXEC-001 | `AC-REPO-007`; `C-REPO-010/021` |
| `REPO-BOOTSTRAP-002` | `O-058` | `ADR-0010` | Bootstrap de onboarding | canonical owner; consumes DOM/EXEC/PLAT | `AC-REPO-008`; `C-REPO-005/016/017/018` |
| `REPO-BOOTSTRAP-003` | `O-058` | `ADR-0010` | Bootstrap de onboarding | canonical owner; consumes DOM audit | `AC-REPO-009`; `C-REPO-003/004/012` |
| `REPO-ENABLE-001` | `O-058` | `ADR-0010` | Bootstrap de onboarding | canonical owner; consumes PLAT effect evidence | `AC-REPO-010`; `C-REPO-004/012/014/022` |
| `REPO-ENABLE-002` | `O-058` | `ADR-0010` | Bootstrap de onboarding | canonical owner; consumes PLAT effect/idempotency evidence | `AC-REPO-016`; `C-REPO-004/012/024` |
| `REPO-RECOVERY-001` | `O-058` | `ADR-0010` | Bootstrap de onboarding | canonical owner; consumes PLAT recovery | `AC-REPO-011`; `C-REPO-005/013/022` |
| `REPO-SCOPE-001` | `O-059` | `ADR-0010` | Decisão | canonical owner; consumes DOM identity | `AC-REPO-012`; `C-REPO-006/016` |
| `REPO-FAILURE-001` | `O-055/O-057/O-058` | `ADR-0010` | Decisão / Bootstrap de onboarding | canonical failure owner | `AC-REPO-013/015`; `C-REPO-015/019/023` |
| `REPO-CUTOVER-001` | `O-057/O-058` | `ADR-0010` | Decisão / Bootstrap de onboarding | canonical owner; consumes EXEC/PLAT history | `AC-REPO-014`; `C-REPO-020/022` |

`REQUIREMENTS_WITHOUT_PORTFOLIO_OBLIGATION = 0` and
`OWNED_OBLIGATIONS_WITHOUT_REQUIREMENT = 0`.

## 24. Known Gap Summary

This table records repository divergence only; it is not the formal Gap
Matrix and assigns no future implementation unit or ticket.

| Gap subject | Classification | Related requirement | Evidence |
|---|---|---|---|
| Production versioned repository configuration/registry absent | `IMPLEMENTATION_GAP` | `REPO-CONFIG-001/002` | no production registry/configuration source found; only documentation and mock state |
| Production Git cleanliness/exact-alignment validation absent | `IMPLEMENTATION_GAP` | `REPO-VALIDATE-001/002` | no backend, Git adapter or `gh` integration found |
| Bootstrap catalog and candidate configuration absent | `IMPLEMENTATION_GAP` | `REPO-BOOTSTRAP-001/002` | no production EXEC catalog or bootstrap runtime found |
| Durable isolated migration workspace and promotion evidence absent | `IMPLEMENTATION_GAP` | `REPO-ENABLE-001`, `REPO-RECOVERY-001` | no database/journal/outbox/backend/effect adapter found |
| In-memory onboarding simulation | `PROTOTYPE_ONLY` | all onboarding requirements | `prototype/src/mockDomain.ts:27`, `:918–926`; `prototype/src/App.tsx:60` |
| Mock onboarding journey/tests | `PROTOTYPE_ONLY` | `REPO-MIGRATE-001/002`, `REPO-BOOTSTRAP-003` | `prototype/tests/mockDomain.test.ts:793–820`, `:1107–1115` |
| Target component specification | `NON_GAP` after generation | all requirements | this artifact is now materialized; independent SPEC audit remains downstream |
| Normal/legacy cutover history in production | `IMPLEMENTATION_GAP` | `REPO-CUTOVER-001` | no production migration/replay records found |
| Database, workspace storage, protocol, path layout and adapter choices | `UNFROZEN_IMPLEMENTATION_DETAIL` | all requirements | no accepted ADR freezes these implementation details |
| Architecture/portfolio ownership | `NON_GAP` | `O-055…O-059` | approved portfolio audit and accepted ADR-0010 provide complete allocation |

## 25. Dependencies

| Dependency SPEC | Contract consumed | Blocking? | Evidence |
|---|---|---:|---|
| `SPEC-DOM-001` | `DOM-ID-001`, `DOM-ELIG-001`, `DOM-SNAPSHOT-001`, `DOM-LIFE-001`, `DOM-AUDIT-001/002/003` | yes | approved portfolio DAG; audit `PASS — COMPONENT_SPEC_CONFORMANT` |
| `SPEC-EXEC-001` | `EXEC-REGISTRY-001/002/003`, `EXEC-CAPABILITY-001`, `EXEC-SNAPSHOT-001`, `EXEC-MANIFEST-001/002/003`, `EXEC-HISTORY-001` | yes | approved portfolio DAG; audit `PASS — COMPONENT_SPEC_CONFORMANT` |
| `SPEC-PLAT-001` | `PLAT-PERSIST-001/002`, `PLAT-EFFECT-001/002`, `PLAT-IDEMP-001`, `PLAT-RECON-001/003`, `PLAT-RECOVERY-001/002`, `PLAT-RETRY-001/002` | yes | approved portfolio DAG; audit `PASS — COMPONENT_SPEC_CONFORMANT` |

These are exactly the three approved normative upstream edges. No new
unapproved dependency, reverse edge or cycle was introduced.

## 26. Risks

| Risk | Mitigation / conformance coverage |
|---|---|
| legacy format becomes a second canonical path | `REPO-MIGRATE-001`, `REPO-CUTOVER-001`, `C-REPO-020` |
| active configuration mutates during candidate work | `REPO-CONFIG-002`, `REPO-BOOTSTRAP-002`, `C-REPO-012/013` |
| dirty/diverged repository is silently corrected | `REPO-VALIDATE-001/002`, `C-REPO-008/009` |
| bootstrap catalog becomes normal runtime authority | `REPO-BOOTSTRAP-001`, `C-REPO-010/021` |
| migration approves its own output | `REPO-MIGRATE-002`, `C-REPO-011` |
| stale UI/transport status enables repository | `REPO-ENABLE-001`, projection limits, `C-REPO-014/019` |
| effect retry duplicates migration/promotion | PLAT consumed key/evidence contract, `REPO-RECOVERY-001`, `C-REPO-022` |
| concurrent promotion activates stale or multiple candidates | `REPO-ENABLE-002`, PLAT idempotency/effect evidence, `AC-REPO-016`, `C-REPO-024` |
| repository identity is inferred from path or label | DOM consumed identity contract, `REPO-SCOPE-001`, `C-REPO-016` |
| current registry reinterprets historical migration | `REPO-CONFIG-002`, `REPO-CUTOVER-001`, `C-REPO-020` |
| downstream backend/GIT/UI acquires repository authority | explicit ownership exclusions and `C-REPO-019` |

## 27. Implementation Details Intentionally Unfrozen

The following remain implementation freedoms unless a later accepted ADR says
otherwise:

- class, module, namespace, folder and project names;
- database, journal, outbox and workspace-storage technology;
- exact configuration serialization and internal DTOs, subject to accepted
  front matter/schema contracts;
- Git/`gh` invocation library, process isolation mechanism and remote polling
  strategy;
- exact bootstrap catalog storage, cache and deployment packaging;
- path names and route/protocol details not made externally normative;
- assignment/session implementation, provided consumed EXEC contracts hold;
- effect-adapter implementation, provided consumed PLAT intent/evidence rules
  hold;
- frontend framework, UI layout and operational status presentation.

These freedoms MUST NOT change the five owned obligations, failure meanings,
dependency direction, candidate isolation, atomic promotion or historical
preservation.

## 28. Open Questions

### IMPLEMENTATION_DETAIL_QUESTION

- Which local database/storage mechanism provides durable candidate state and
  replayable evidence?
- How does the supported Git/`gh` tooling expose exact branch/remote state and
  required checks?
- Which process/workspace isolation mechanism supports safe cleanup only after
  confirmation?
- Which transport carries replayable onboarding snapshots to consumers?

These questions do not alter ownership or architecture.

### ARCHITECTURAL_QUESTION

None identified. A question that changes repository ownership, onboarding
lifecycle, bootstrap authority, legacy cutover, failure meaning or dependency
direction requires portfolio/ADR governance before this SPEC is revised.

## 29. Definition of Done

This component SPEC is ready for independent SPEC validation when:

- the governing portfolio audit is `PORTFOLIO_DECOMPOSITION_APPROVED`;
- `ADR-0010` and all consumed ADR authority are accepted/effective;
- DOM, EXEC-001 and PLAT-001 upstream audits are conformant;
- `O-055…O-059` are all represented by requirements;
- no consumed contract is redefined and no downstream component is made
  canonical;
- configuration, validation, migration, bootstrap, enablement, failure,
  recovery, scope and cutover semantics are testable;
- all normative requirements trace to a portfolio obligation and accepted
  ADR section;
- acceptance criteria and conformance tests cover positive, negative,
  boundary, dependency, compatibility and recovery behavior;
- repository evidence and known gaps are classified without producing a Gap
  Matrix, Implementation Plan, tickets or production code;
- no architecture gap or portfolio ownership gap remains.

## 30. Mechanical Validation

```text
PORTFOLIO_OBLIGATIONS_OWNED = 5
PORTFOLIO_OBLIGATIONS_COVERED = 5
OWNED_OBLIGATIONS_UNCOVERED = 0
NORMATIVE_REQUIREMENTS = 15
REQUIREMENTS_WITHOUT_AUTHORITY = 0
CONSUMED_CONTRACTS = 7 contract groups
CONSUMED_CONTRACTS_REDEFINED = 0
FAILURES_OWNED = 3 codes
FAILURES_CONSUMED = 8 codes
AMBIGUOUS_FAILURE_OWNERS = 0
NORMATIVE_DEPENDENCIES = 3
NEW_UNAPPROVED_DEPENDENCIES = 0
KNOWN_SPECIFICATION_GAPS = 0
KNOWN_IMPLEMENTATION_GAPS = 5
ARCHITECTURE_GAPS = 0
PORTFOLIO_OWNERSHIP_GAPS = 0
ACCEPTANCE_CRITERIA = 16
CONFORMANCE_TESTS = 24
```

Required local invariants all hold:

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

- Ownership: all normative behavior is allocated to `O-055…O-059`; DOM,
  EXEC-001 and PLAT semantics are consumed, not reowned.
- Dependency: the three upstream edges exactly match the approved portfolio;
  no downstream authority or cycle was introduced.
- Authority: repository and prototype evidence informed classifications only;
  accepted ADR-0010 remains supreme.
- Failure: the three REPO failures have one owner; eight consumed failure codes
  retain their original owners and meanings.
- Compatibility: legacy behavior is migration/replay-only, the new path is
  canonical, cutover is audited and retirement preserves history.
- Projection: stale status, transport mapping and UI presentation cannot
  authorize enablement.
- Quality: each requirement is testable, authority-linked and free of
  implementation-plan prescriptions.
- Scope: no Gap Matrix, Implementation Plan, tickets, production code or new
  ADR was created.

## 32. Final Gate

```text
READY_FOR_SPEC_VALIDATION
```
