# DOM-001-TICKET-004 — Architecture Boundaries Audit

## 1. Audit identity and pinned target

```text
AUDIT_TYPE: INDEPENDENT_SPECIALIST_ARCHITECTURE_BOUNDARIES
AUDIT_ROUND: INITIAL
AUDIT_MODE: READ_ONLY INDEPENDENT ADVERSARIAL ARCHITECTURE_FIRST
           OWNERSHIP_PRESERVING AUTHORITY_PRESERVING CROSS_SPEC_AWARE
           IDENTITY_AWARE LEGACY_TRANSITION_AWARE EXHAUSTIVE_WITHIN_DOMAIN
TICKET_ID: DOM-001-TICKET-004
IMPLEMENTATION_UNIT: DOM-IMP-04 — Pipeline and aggregate state machines
TICKET_STATUS: VALIDATION_REQUIRED
REPOSITORY_ROOT: C:\Users\taalves\OneDrive - Octave\Documents 1\pessoal\ai-engineering-development
IMPLEMENTATION_BASELINE: a58ce959f9b34f3c1c83ed41c01b058d31bf3366
CURRENT_HEAD: a58ce959f9b34f3c1c83ed41c01b058d31bf3366
AUDIT_TARGET: current uncommitted working-tree implementation layered on CURRENT_HEAD
DOMAIN_AUDIT_COMPLETE: YES
```

The baseline/current HEAD contains no ticket-local productive pipeline files;
the audited implementation is an uncommitted working-tree addition. The
working tree was not changed during the audit except for creation of this
artifact.

## 2. Required audit inputs

| Input | Value |
|---|---|
| `TICKET_ID` | `DOM-001-TICKET-004` |
| `IMPLEMENTATION_UNIT` | `DOM-IMP-04 — Pipeline and aggregate state machines` |
| `TICKET_PATH` | `docs/tickets/SPEC-DOM-001/DOM-001-TICKET-004-pipeline-state-machines.md` |
| `TICKET_FOLDER` | `docs/tickets/SPEC-DOM-001/` |
| `SPEC_PATH` | `docs/specs/SPEC-DOM-001-workflow-authority-and-governance.md` |
| `ADR_PATHS` | `docs/adrs/ADR-0001-workflow-domain-and-identity.md`; `docs/adrs/ADR-0002-pipeline-state-machines-and-transitions.md`; `docs/adrs/ADR-0006-persistence-journal-idempotency-and-recovery.md`; `docs/adrs/ADR-0009-audit-remediation-and-final-conformance.md`; `docs/adrs/ADR-0010-repository-configuration-and-legacy-migration.md` |
| `CROSS_SPEC_REFERENCES` | `docs/specs/SPEC-PORTFOLIO-001-organization.md`; `docs/specs/SPEC-EXEC-002-agent-sessions-and-scheduler.md`; `docs/specs/SPEC-PLAT-001-persistence-effects-and-recovery.md`; `docs/specs/SPEC-GIT-001-worktrees-waves-and-publication.md`; `docs/specs/SPEC-BACKEND-001-local-api-security-and-notifications.md`; `docs/specs/SPEC-OPS-001-observability-retention-backup-and-export.md`; `docs/specs/SPEC-UI-001-frontend-operational-client.md` |
| `GAP_IDS` | `GAP-009`, `GAP-010` |
| `REQUIREMENT_IDS` | `DOM-PIPE-001`, `DOM-STATE-001` |
| `ACCEPTANCE_IDS` | `AC-DOM-009`, `AC-DOM-010`; contribution to `AC-DOM-052` |
| `IMPLEMENTATION_PLAN_PATH` | `docs/specs/implementation-plans/SPEC-DOM-001-implementation-plan.md` — `DOM-IMP-04` |
| `PLAN_AUDIT_PATH` | `docs/specs/implementation-plans/audits/SPEC-DOM-001-implementation-plan-audit.md` |
| `GAP_MATRIX_PATH` | `docs/specs/gap-matrices/SPEC-DOM-001-implementation-gap-matrix.md` |
| `GAP_MATRIX_AUDIT_PATH` | `docs/specs/gap-matrices/audits/SPEC-DOM-001-implementation-gap-matrix-audit.md` |
| `TICKET_SET_AUDIT_PATH` | `docs/tickets/SPEC-DOM-001/implementation-ticket-audit.md` |
| `IMPLEMENTATION_DESIGN_PATH` | `docs/tickets/SPEC-DOM-001/DOM-001-TICKET-004-implementation-design.md` |
| `CHANGED_FILES` | `src/domain/pipeline.ts`; `src/application/pipeline.ts`; `tests/dom-001-ticket-004.test.ts` |
| `IMPLEMENTATION_STATUS` | `IMPLEMENTED`; ticket status is `VALIDATION_REQUIRED` |

File hashes recorded for the audited working-tree target:

| File | SHA-256 |
|---|---|
| `src/domain/pipeline.ts` | `A53A6E7E4D75BC040BC5C3CB8761B82CA408235E9F6F28F0BC9AEB773311CF63` |
| `src/application/pipeline.ts` | `B87776F97D264C1C0EBBF1D0ED8BE586DC968C987D95ADC24ABA42F437FA5669` |
| `tests/dom-001-ticket-004.test.ts` | `40E812A4DD3C3138DE5374AF5B7E93866BCECE9EB11D19A15439013DCF63BE44` |

## 3. Authority precedence and reconstructed architectural contract

The effective precedence used was:

```text
Accepted ADR authority
↓ Canonical SPEC-DOM-001
↓ Explicit portfolio and cross-SPEC ownership contracts
↓ Validated Gap Matrix
↓ Implementation Plan
↓ Ticket and approved Implementation Design
↓ Repository implementation and tests
```

Relevant authority anchors:

| Authority | Anchors used |
|---|---|
| `ADR-0001` | accepted revision 3; persistent aggregate identity, immutable historical basis and identity/lineage invariants |
| `ADR-0002` | accepted revision 3; canonical pipeline order, separate aggregate state machines, invalid-transition rejection and derived higher states |
| `ADR-0006` | accepted revision 3; durable persistence, journal/outbox, evidence-first recovery and no silent last-write-wins reconciliation |
| `ADR-0009` | accepted revision 3; formal lifecycle/evidence ownership remains DOM-owned where applicable |
| `ADR-0010` | accepted revision 3; legacy paths are explicit adapters and migration is not silent |
| `SPEC-DOM-001` | ownership §§2/4; identity table §12; `DOM-PIPE-001` §§9/13; `DOM-STATE-001` §§9/13; commands/events/queries §14; compatibility/projection §§17–18 |
| Portfolio | `O-009` and `O-010` at `docs/specs/SPEC-PORTFOLIO-001-organization.md:225-226` |
| Gap Matrix | `GAP-009` and `GAP-010` at `.../SPEC-DOM-001-implementation-gap-matrix.md:440-482` |
| Plan | `DOM-IMP-04` at `.../SPEC-DOM-001-implementation-plan.md:470-570` |
| Ticket/design | ticket §§3, 8–22; design §§7–18 and §§22–23 |

Reconstructed contract:

| Dimension | Authority-preserving contract |
|---|---|
| `LOCAL_OWNER` | DOM / `SPEC-DOM-001` owns canonical pipeline ordering, independent aggregate state machines, state derivation and projection boundary. |
| `LOCAL_AUTHORITIES` | One DOM-owned pipeline transition decision; one controlled derivation boundary; application handlers coordinate only; repository port enforces persistence/CAS. |
| `FOREIGN_OWNERS` | EXEC owns execution/session/assignment/lease state; PLAT owns physical persistence, journal, outbox, evidence and recovery; GIT owns Git/publication execution and confirmation; BACKEND, OPS and UI transport/project. REPO owns legacy compatibility/migration. |
| `FOREIGN_CAPABILITIES_CONSUMED` | Only contract-shaped, read-only state snapshots may be consumed; no foreign lifecycle or operational state may be recreated locally. |
| `CANONICAL_IDENTITIES` | DOM-owned aggregate identities are stable, scoped, resolvable and revision-qualified. The SPEC identity table names `StageId` for pipeline stages; labels and arbitrary local strings are not canonical identity substitutes. |
| `IMMUTABILITY_RULES` | Accepted transition results are new immutable values; rejected/stale operations do not mutate current state; projections cannot write source state. |
| `LINEAGE_RULES` | Canonical ordered advancement must retain valid predecessor semantics; a rehydrated later state must not fabricate a current authority without valid persisted provenance. |
| `LEGACY_AUTHORITY_RULES` | Prototype/mock is evidence only; a new canonical path may be added without leaving a productive alternate writer. |
| `CUTOVER_RULES` | No destructive cutover is owned here; any future consumer/adaptor must preserve DOM authority and historical identity. |
| `MIGRATION_AUTHORITY` | No migration is implemented; REPO owns compatibility/bootstrap migration. |
| `SECURITY_BOUNDARIES` | No transport, authentication, authorization, credential or protected execution surface is introduced by this ticket. |
| `DOES_NOT_IMPLEMENT` | Scheduler capacity/leases, ticket/publication/audit/migration lifecycle owners, Git, backend transport, OPS/UI projection, physical persistence and foreign operational state. |

The cross-SPEC contracts confirm the same boundary: EXEC-002 must not redefine
DOM transitions (`SPEC-EXEC-002...md:229-235,638-641`); PLAT persists received
state and must not create a second state machine (`SPEC-PLAT-001...md:206-206`);
BACKEND must reference DOM IDs/revisions and not create a backend state machine
(`SPEC-BACKEND-001...md:254-258`); GIT queries consume DOM publication meaning
(`SPEC-GIT-001...md:437-447`); OPS and UI remain projections
(`SPEC-OPS-001...md:81-87`, `SPEC-UI-001...md:285-286`).

## 4. Applicability matrix

| Dimension | Classification | Result and reason |
|---|---|---|
| `OWNERSHIP` | `REQUIRED` | The ticket creates the productive pipeline/state boundary and must keep foreign lifecycle owners separate. |
| `CANONICAL_AUTHORITY` | `REQUIRED` | DOM must be the only authority for ordered advancement and controlled derived state. |
| `CROSS_SPEC_INTEGRATION` | `AFFECTED` | The state-reader seam consumes snapshots from independent owners; downstream mappings must remain non-authoritative. |
| `IDENTITY` | `REQUIRED` | Pipeline/stage state is exposed through an identity-bearing aggregate and the DOM identity contract applies. |
| `IMMUTABILITY` | `REQUIRED` | Transition, state-input and derived-state values cross persistence/query boundaries and must not be rewritten. |
| `LINEAGE` | `AFFECTED` | Pipeline order and rehydration must preserve predecessor/provenance semantics; explicit ADR↔SPEC lineage is outside this ticket. |
| `LEGACY_TRANSITION` | `AFFECTED` | The ticket declares `NEW_CANONICAL_PATH` while the prototype/mock remains in the repository as historical evidence. |
| `DESTRUCTIVE_TRANSITION` | `NOT_APPLICABLE` | No deletion, irreversible writer retirement, destructive migration or remote transition is implemented. |
| `MIGRATION_AUTHORITY` | `NOT_APPLICABLE` | No migration, bootstrap, legacy adapter or persisted-state conversion is implemented; REPO owns that boundary. |
| `SECURITY_AUTHORIZATION` | `NOT_APPLICABLE` | No API, transport, credential, authentication, authorization or protected execution path is introduced. |

All required and affected dimensions were audited. The two not-applicable
dimensions have no changed behavior in the target files, and their owners are
explicitly outside this ticket.

## 5. Actual implementation and boundary inventory

| Path | Actual role | Boundary result |
|---|---|---|
| `src/domain/pipeline.ts:1-14` | Closed pipeline stage vocabulary | Ordered labels match the twelve-step ADR-0002 sequence. |
| `src/domain/pipeline.ts:16-26` | Nine machine labels | Names are separated and tagged, but state values remain unconstrained strings. |
| `src/domain/pipeline.ts:63-78` | Local `PipelineId` value object | Does not use `CanonicalIdentity`/`CanonicalIdentityReference`; see `ARCH-CRITICAL-001`. |
| `src/domain/pipeline.ts:85-135` | Stage and revision values | Immutable and validated locally. |
| `src/domain/pipeline.ts:141-227` | Machine-state and read-only input boundary | Freezes values and validates machine ownership; missing members raise a native `TypeError`, see `ARCH-MINOR-001`. |
| `src/domain/pipeline.ts:245-267` | Derived read model and derivation policy | Public constructor accepts arbitrary stage/state combinations, see `ARCH-MAJOR-001`. |
| `src/domain/pipeline.ts:286-334` | Pipeline aggregate, creation, rehydration and ordered advance | Advancement is guarded; rehydration bypasses predecessor/provenance checks, see `ARCH-MAJOR-002`. |
| `src/domain/pipeline.ts:354-360` | Repository and state-reader ports | Narrow direction is correct; no physical adapter exists in this ticket. |
| `src/application/pipeline.ts:21-43` | Command orchestration and CAS outcome mapping | No direct foreign writer or rebase path; relies on repository adapter for atomicity. |
| `src/application/pipeline.ts:51-64` | Read-only query orchestration | Does not persist derived state; it exposes the public derived-state construction weakness. |
| `tests/dom-001-ticket-004.test.ts:21-175` | Test-only in-memory adapters and six focused tests | Test adapters are not production authority; tests do not close the identified public bypasses. |
| `prototype/src/App.tsx`, `prototype/src/mockDomain.ts` | Historical/mock authority | No productive import path into `src`; no ticket-local legacy writer was found. |

No production worker, controller, migration, adapter, database schema, route,
projection or alternate writer references the new pipeline types. The only
`PipelineRepository` implementation is the test-local `Map` adapter.

## 6. Ownership and canonical authority audit

### Ownership

The local ordering decision is placed in `PipelineOrder` and
`WorkflowPipeline.advanceTo`; application handlers do not implement a second
ordering rule. `PipelineStateReader` has a read-only method and does not own
foreign transitions. No EXEC, ticket, publication, Git, scheduler, migration
or OPS lifecycle is persisted or mutated by the productive target files.

However, `PipelineId` is introduced as a separate identity vocabulary and is
used as the key for the pipeline repository. The canonical SPEC identity table
(`SPEC-DOM-001...md:254-268`) assigns DOM identities including `StageId`, while
`DOM-ID-001` (`...md:279-289`) requires stable, scoped, resolvable canonical
identities. `PipelineId.create` accepts only a locally formatted string
(`src/domain/pipeline.ts:63-78`); it does not resolve or retain a canonical DOM
identity, scope, revision-qualified reference or owner correlation. This is an
identity-bearing state authority path, not merely a display label.

Classification:

```text
OWNERSHIP: OWNERSHIP_LEAKAGE at the pipeline identity/state boundary
CANONICAL_AUTHORITY: ALTERNATE_AUTHORITY_INTRODUCED
```

### Canonical writes and decisions

`WorkflowPipeline.advanceTo` is the sole productive transition decision path
found, and `GetPipelineStateHandler` has no write path. The CAS port is the
intended persistence seam, but there is no production adapter in the assessed
repository. The test adapter compares the stored revision before replacement;
that proves the local fixture behavior only, not a physical PLAT atomicity
implementation. No competing production writer was found.

## 7. Cross-SPEC integration audit

| Foreign boundary | Expected rule | Actual result |
|---|---|---|
| EXEC-002 execution/scheduler state | Consume read-only canonical snapshots; never dispatch or redefine DOM transitions | `PARTIAL`: no runtime EXEC adapter is implemented, and the local input carries only a machine label/free-form state, without source identity or revision provenance. No foreign lifecycle writer was found. |
| PLAT persistence/CAS/recovery | PLAT owns physical durability and atomic CAS; DOM owns semantic transition | `INTEGRATION_NOT_PROVEN` but not a local ownership violation: only a port and test `Map` adapter exist; physical persistence is explicitly outside ticket scope. |
| GIT publication/waves | Consume publication/integration evidence; do not own DOM pipeline order | `CROSS_SPEC_CONFORMANT` within current scope: no GIT code or publication writer is present. |
| BACKEND transport | Preserve identity, revision, rejection and source meaning; no second state machine | `CROSS_SPEC_CONFORMANT` within current scope: no backend or transport path is present. |
| OPS/UI projections | Read/project source state only | `CROSS_SPEC_CONFORMANT` within current scope: no production projection path is present; the query handler itself is read-only. |
| REPO legacy/migration | Adapt historical data without becoming DOM authority | `NOT_APPLICABLE` to current implementation; no adapter or migration path exists. |

The generic state-input shape and unrestricted derived-state constructor are
the local risks at the consumer boundary. They do not currently duplicate a
foreign lifecycle, but they permit caller-provided state to appear as a
combined derived view without canonical source provenance.

## 8. Identity, immutability and lineage audit

### Identity — `VIOLATED`

`PipelineId` is stable only as a local string and is frozen as an object, but it
is not a canonical DOM identity reference. The repository and handlers accept
it as the identity of the state authority (`src/domain/pipeline.ts:276-318`,
`src/application/pipeline.ts:21-32`). There is no link to `CanonicalIdentity`,
`CanonicalIdentityCatalog`, `StageId`, execution scope or a persisted identity
record. This is an alternate identity path for canonical pipeline state.

### Immutability — `CONFORMANT_WITH_BOUNDARY_EXCEPTIONS`

`PipelineId`, `PipelineStage`, `PipelineRevision`, machine states,
`PipelineStateInputs`, `DerivedWorkflowState` and `WorkflowPipeline` are
shallowly frozen; accepted transitions return a new aggregate
(`src/domain/pipeline.ts:291-334`). The query does not write back a projection
(`src/application/pipeline.ts:51-64`). No direct mutation of current stage or
revision was found. The public constructors below nevertheless allow invalid
authority/provenance to be created immutably, so immutability alone does not
make those values canonical.

### Lineage — `PARTIAL`

Immediate successor advancement preserves the predecessor object in
`PipelineTransition` and increments the revision
(`src/domain/pipeline.ts:321-334`). But `WorkflowPipeline.rehydrate` accepts a
later stage with any non-negative revision and no predecessor or transition
evidence (`src/domain/pipeline.ts:306-318`). A direct runtime probe succeeded
with `stage: 'MAIN_UPDATE_AND_PUBLICATION', revision: 0`. That permits a
rehydrated canonical-looking state without ordered predecessor provenance.

## 9. Legacy, cutover, destructive transition, migration and security audit

### Legacy/cutover — `TRANSITION_CONFORMANT_WITHIN_SCOPE`

The ticket declares `NEW_CANONICAL_PATH`. The productive modules do not import
`prototype/`, and repository search found no production legacy writer,
projection, route or migration that can write the pipeline. Prototype state
remains a separate historical/mock application and was not modified. No
`PRESERVE_LEGACY_READS` or `RETIRE_LEGACY_WRITES` obligation is assigned here.

### Destructive transition — `NOT_APPLICABLE`

No destructive operation is implemented. `REPLACEMENT_PROVEN`,
`CUTOVER_AUTHORIZED`, pre/post gates and rollback/roll-forward semantics are
therefore not applicable.

### Migration authority — `NOT_APPLICABLE`

No migration or compatibility adapter exists in the target scope. Physical
state migration remains with REPO/PLAT owners.

### Security/authorization — `NOT_APPLICABLE`

No endpoint, capability, token, credential, authentication or authorization
decision is introduced. No capability is treated as authorization, and no
alternate protected execution path exists to audit.

## 10. Persistence, concurrency/CAS and stale semantics

`PipelineRepository.advance(proposed, expectedRevision)` is a narrow port with
an explicit stale result (`src/domain/pipeline.ts:337-356`). The application
handler maps `STALE` to `PIPELINE_STALE` without retry, rebase or last-write-
wins (`src/application/pipeline.ts:30-43`). The test adapter performs a
revision comparison before replacing its `Map` record
(`tests/dom-001-ticket-004.test.ts:33-40`), and the focused stale test confirms
that the stored stage/revision remain unchanged (`:146-164`).

This is conformant as a local semantic seam. There is no production database,
journal, outbox or physical CAS adapter to inspect; the ticket and design
explicitly defer that boundary to PLAT. Consequently, durable atomicity and
recovery are `INTEGRATION_NOT_PROVEN`, not silently treated as implemented.
The stale path itself is authority-preserving in the available fixture.

## 11. Architectural scope and systemic boundary expansion

| Decision/path | Classification | Evidence |
|---|---|---|
| Closed twelve-stage vocabulary | `AUTHORIZED_ARCHITECTURAL_REALIZATION` | `src/domain/pipeline.ts:1-14`; matches ADR-0002 canonical order |
| Separate machine labels and read-only input container | `AUTHORIZED_ARCHITECTURAL_REALIZATION` | `src/domain/pipeline.ts:16-26,193-243`; no foreign transition methods |
| Immediate-successor aggregate decision | `AUTHORIZED_ARCHITECTURAL_REALIZATION` | `src/domain/pipeline.ts:108-114,321-334` |
| `PipelineRepository`/`PipelineStateReader` ports | `AUTHORIZED_ARCHITECTURAL_REALIZATION` | `src/domain/pipeline.ts:354-360`; narrow dependency direction |
| `PipelineId` as repository identity | `UNAUTHORIZED_ARCHITECTURAL_EXPANSION` | `src/domain/pipeline.ts:63-78,276-318`; not tied to canonical DOM identity vocabulary |
| Public arbitrary `DerivedWorkflowState` construction | `UNAUTHORIZED_ARCHITECTURAL_EXPANSION` | `src/domain/pipeline.ts:245-267`; bypasses the derivation authority |
| Public later-stage rehydration without provenance | `UNAUTHORIZED_ARCHITECTURAL_EXPANSION` | `src/domain/pipeline.ts:306-318`; bypasses ordered authority at reconstruction boundary |
| Free-form machine state strings | `IMPLEMENTATION_DETAIL_WITH_INTEGRATION_RISK` | `src/domain/pipeline.ts:141-164`; no foreign lifecycle semantics are implemented, but source identity/basis is not retained |
| Physical persistence/recovery, adapters, migrations, API/UI/OPS/GIT | `OUTSIDE_TICKET_SCOPE` | Ticket §§10–12, 20–21 and cross-SPEC ownership contracts |

Equivalent paths were inspected in the domain/application modules, all source
and test references, prototype state/command paths, and repository search. No
second production transition writer or foreign lifecycle implementation was
found. The identity and derivation/provenance defects are localized to the
pipeline module; they are not repeated in identity, lineage or snapshot
modules.

```text
ARCHITECTURAL_AUTHORITY_GAP_DISCOVERED: NO
OWNERSHIP_CLASSIFICATION: OWNERSHIP_LEAKAGE
AUTHORITY_CLASSIFICATION: ALTERNATE_AUTHORITY_INTRODUCED
CROSS_SPEC_CLASSIFICATION: PARTIAL / INTEGRATION_NOT_PROVEN
```

## 12. Findings

### ARCH-CRITICAL-001

| Field | Detail |
|---|---|
| Severity | `CRITICAL` |
| Ticket | `DOM-001-TICKET-004` |
| Normative authority | `ADR-0001` accepted revision 3, Decision/Invariants; `SPEC-DOM-001` ownership §2, identity table §12, `DOM-ID-001`; `DOM-PIPE-001`/`DOM-STATE-001` require canonical DOM-owned state. |
| Owner | DOM canonical identity owner / `SPEC-DOM-001`; the pipeline state owner must consume that identity rather than minting a parallel identity vocabulary. |
| Affected boundary | Canonical stage/pipeline identity → pipeline aggregate and repository persistence key |
| Repository evidence | `src/domain/pipeline.ts:63-78` defines `PipelineId` independently of `src/domain/identity.ts`; `WorkflowPipelineCreationInput`, `WorkflowPipelineRehydrationInput` and `PipelineRepository` use `PipelineId` at `:276-318,354-356`; no `CanonicalIdentityReference`, scope or identity-catalog resolution is present. |
| Problem | A locally formatted string becomes the identity of canonical workflow state without being a DOM canonical identity or being tied to the SPEC-defined `StageId`/owning aggregate identity. The lower-level design's `PipelineId` cannot override the higher-priority identity contract. |
| Impact | State can be created, rehydrated, found and advanced under an identity that consumers cannot resolve through the canonical identity authority. This permits identity divergence across persistence, commands, projections and cross-SPEC correlation. Canonical identity violations are fundamental architecture failures. |
| Minimum correction required | Bind the pipeline/stage aggregate to the canonical DOM identity reference and required scope/revision correlation at its boundary, reusing the existing identity authority. If a distinct pipeline aggregate identity is required, obtain an accepted authority change before implementation; do not let a raw `PipelineId` remain an alternate canonical key. |
| Systemic pattern | `NO` — localized to the new pipeline aggregate identity seam. |
| Related locations | `src/domain/pipeline.ts:63-78,276-318,354-356`; `src/application/pipeline.ts:21-32,56-60`; `docs/specs/SPEC-DOM-001-workflow-authority-and-governance.md:254-289` |

### ARCH-MAJOR-001

| Field | Detail |
|---|---|
| Severity | `MAJOR` |
| Ticket | `DOM-001-TICKET-004` |
| Normative authority | Accepted `ADR-0002`, Decision; `SPEC-DOM-001` `DOM-STATE-001` and `AC-DOM-010`; ticket §§9, 15, 16, 18–19; approved design §§7–8 and §14. |
| Owner | DOM derivation authority / `PipelineStateDerivationPolicy` |
| Affected boundary | Independent machine snapshots → derived higher/read-only state |
| Repository evidence | `DerivedWorkflowState` has a public constructor accepting arbitrary `PipelineStage` and arbitrary `PipelineMachineState[]` at `src/domain/pipeline.ts:245-263`; `PipelineStateDerivationPolicy.derive` calls it at `:264-267`. A runtime probe constructed `MAIN_UPDATE_AND_PUBLICATION` with only one `TICKET` state and succeeded. |
| Problem | Callers can bypass the approved derivation policy and fabricate a combined/higher state with an arbitrary stage and incomplete machine set. Freezing the result does not restore derivation authority. |
| Impact | A projection or consumer can obtain a canonical-looking derived state that was never derived from the complete validated input boundary, creating an alternate state authority and leaving `GAP-010`/`DOM-STATE-001` only partially closed. |
| Minimum correction required | Make derived-result construction private or otherwise callable only through a validated derivation seam, validate the complete input set there, and add a negative test for direct fabricated construction. Do not introduce a second state machine. |
| Systemic pattern | `NO` — one localized exported construction bypass. |
| Related locations | `src/domain/pipeline.ts:193-267`; `src/application/pipeline.ts:51-64`; `tests/dom-001-ticket-004.test.ts:117-144` |

### ARCH-MAJOR-002

| Field | Detail |
|---|---|
| Severity | `MAJOR` |
| Ticket | `DOM-001-TICKET-004` |
| Normative authority | Accepted `ADR-0002`, Decision; `SPEC-DOM-001` `DOM-PIPE-001` (`:358-366`), `DOM-STATE-001` (`:368-376`); `ADR-0001` identity/history invariants; approved design §13 serialization boundary and §14 lifecycle design. |
| Owner | DOM pipeline aggregate/reconstruction authority; PLAT may persist and rehydrate but may not invent the domain state. |
| Affected boundary | Persisted pipeline record → canonical `WorkflowPipeline` reconstruction |
| Repository evidence | `WorkflowPipeline.rehydrate` accepts `stage` and `revision` and directly constructs the aggregate at `src/domain/pipeline.ts:306-318`. It does not require predecessor/transition evidence or enforce a stage/revision provenance relationship. Runtime probe: `rehydrate({ id: 'PIPELINE-FORGED', stage: 'MAIN_UPDATE_AND_PUBLICATION', revision: 0 })` returned successfully. |
| Problem | The reconstruction seam can materialize a later canonical stage without traversing immediate predecessors or proving a persisted accepted transition. It therefore bypasses the pipeline authority at the serialization boundary. |
| Impact | Corrupt, stale or fabricated persisted data can present a later stage as current without ordered lineage; downstream advancement and projections may rely on a state that was never canonically reached. This weakens historical reconstruction and the no-bypass invariant. |
| Minimum correction required | Require and validate persisted provenance sufficient to establish the stage's canonical predecessor/transition history (or reject records that cannot prove it) before constructing the aggregate. Keep physical storage/recovery in PLAT and do not add a second writer. Add a valid-later-stage and invalid-provenance negative test. |
| Systemic pattern | `NO` — localized to the public rehydration seam. |
| Related locations | `src/domain/pipeline.ts:276-318`; `tests/dom-001-ticket-004.test.ts:82-108`; `docs/tickets/SPEC-DOM-001/DOM-001-TICKET-004-implementation-behavior-audit.md` rehydration evidence |

### ARCH-MINOR-001

| Field | Detail |
|---|---|
| Severity | `MINOR` |
| Ticket | `DOM-001-TICKET-004` |
| Normative authority | `SPEC-DOM-001` `DOM-STATE-001` and command/query boundary §14; ticket §9 and §18; approved design §§17 and 19 require missing/incompatible state input to fail closed through the domain boundary. |
| Owner | DOM state-input validation boundary |
| Affected boundary | Consumer/state-reader input → validated `PipelineStateInputs` |
| Repository evidence | `PipelineStateInputs.create` immediately reads `candidate.machine` for every expected member at `src/domain/pipeline.ts:217-227`. A runtime probe with only `execution` supplied raised native `TypeError: Cannot read properties of undefined (reading 'machine')`, rather than `PipelineDomainError('INVALID_PIPELINE_STATE', ...)`. |
| Problem | Missing state input fails closed with no transition, but escapes the explicit domain failure contract and can bypass consistent cross-boundary rejection mapping. |
| Impact | Callers cannot reliably preserve the canonical state-input failure meaning; backend/OPS/UI mappings may receive an implementation exception instead of the declared domain failure. This is localized and does not itself create a second writer. |
| Minimum correction required | Validate each member's presence and shape before reading it, raise the declared `INVALID_PIPELINE_STATE` domain error, and add a missing-member test. |
| Systemic pattern | `NO` |
| Related locations | `src/domain/pipeline.ts:217-227`; `tests/dom-001-ticket-004.test.ts:131-144` |

## 13. Audit metrics

```text
OWNERSHIP_ERRORS = 1
FOREIGN_CAPABILITY_DUPLICATION = 0
AUTHORITY_VIOLATIONS = 3
IDENTITY_VIOLATIONS = 1
IMMUTABILITY_VIOLATIONS = 0
LINEAGE_VIOLATIONS = 1
IMMUTABILITY_LINEAGE_VIOLATIONS = 1
LEGACY_AUTHORITY_VIOLATIONS = 0
ARCHITECTURAL_AUTHORITY_GAPS = 0
ALTERNATE_CANONICAL_WRITERS = 0
FOREIGN_LIFECYCLE_OWNERSHIP_PATHS = 0
PROJECTION_USED_AS_AUTHORITY_PATHS = 1
CONCURRENCY_CAS_BYPASSES = 0
LAST_WRITE_WINS_PATHS = 0
STALE_SEMANTIC_VIOLATIONS = 0
PERSISTENCE_BOUNDARY_VIOLATIONS = 0
MIGRATION_AUTHORITY_VIOLATIONS = 0
SECURITY_AUTHORIZATION_VIOLATIONS = 0
SYSTEMIC_BOUNDARY_EXPANSIONS = 0
```

Test/evidence execution:

| Evidence | Result |
|---|---|
| `prototype/node_modules/.bin/tsx.cmd --test tests/dom-001-ticket-004.test.ts` | PASS — 6/6 |
| Direct production TypeScript compile with strict NodeNext options | PASS for `src/domain/*` and `src/application/*`; test compilation is unavailable without root `@types/node`/tsconfig |
| Runtime forged derived-state probe | CONFIRMED — arbitrary later stage and one machine accepted |
| Runtime later-stage rehydration probe | CONFIRMED — `MAIN_UPDATE_AND_PUBLICATION` at revision `0` accepted |
| Runtime missing-input probe | CONFIRMED — native `TypeError`, not declared domain error |
| Repository search for production alternate writers/adapters/routes/migrations | NONE FOUND |
| Prototype import search from productive `src` | NONE FOUND |

## 14. Required summary

```text
Audit: docs/tickets/SPEC-DOM-001/DOM-001-TICKET-004-architecture-boundaries-audit.md

Specialist:
ARCHITECTURE_BOUNDARIES

Ticket: DOM-001-TICKET-004

Ownership errors: 1

Foreign capability duplication: 0

Authority violations: 3

Identity violations: 1

Immutability/lineage violations: 1

Legacy authority violations: 0

Architectural authority gaps: 0

Findings:
CRITICAL=1
MAJOR=2
MINOR=1
INFO=0

Domain audit complete:
YES

Specialist result:
SPECIALIST_ARCHITECTURE_FINDINGS
```

