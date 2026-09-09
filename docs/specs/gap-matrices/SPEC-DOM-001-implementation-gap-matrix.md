# SPEC-DOM-001 — Component Implementation Gap Matrix

Assessment timestamp: 2026-09-09T17:33:21-03:00 (America/Sao_Paulo).
This is a read-only authority-to-repository comparison. Only this matrix
artifact was replaced.

## 1. Executive Summary

The governing portfolio and target component audit gates pass. The current
working tree contains a productive TypeScript domain/application slice for
identity, snapshot, ADR-SPEC lineage, separated state inputs, pipeline ordering,
and stale-write rejection. It does not contain durable persistence, concrete
repositories/adapters, the remaining ticket/publication/audit lifecycle models,
or a productive runtime host.

Twenty-one requirements were classified: 0 IMPLEMENTED, 3 PARTIAL, 6
CONTRADICTORY, and 12 MISSING. The active contradictions are caller-supplied
snapshot authority, PipelineId as a parallel pipeline identity, scalar
pipeline rehydration without provenance, and advancement without a formal
verdict. There are 22 distinct MAJOR gaps and no authority or completeness
blocker. Result: READY_FOR_IMPLEMENTATION_PLAN.

## 2. Assessment Subject

| Item | Value |
| --- | --- |
| Target SPEC | SPEC-DOM-001 |
| SPEC path | docs/specs/SPEC-DOM-001-workflow-authority-and-governance.md |
| SPEC revision/status | 3 / PROPOSED |
| Component audit | docs/specs/audits/SPEC-DOM-001-component-conformance-audit.md |
| Component verdict | PASS — COMPONENT_SPEC_CONFORMANT |
| Governing portfolio | SPEC-PORTFOLIO-001, revision 2, PROPOSED |
| Portfolio audit | docs/specs/SPEC-PORTFOLIO-001-decomposition-audit.md |
| Portfolio verdict | PORTFOLIO_DECOMPOSITION_APPROVED |
| Accepted ADR authority | ADR-0001 revision 3, ADR-0002 revision 3, ADR-0009 revision 3 |
| Normative upstream SPECs | none; DOM is the approved DAG root |
| Repository commit | 5ec37e1bdf13250ae93e59ce24ef3c4b4c43a220 |

## 3. Frozen Baselines

| Baseline | Frozen value |
| --- | --- |
| COMPONENT_SPEC_BASELINE | SPEC revision 3; SHA-1 3fb90c4c100db38f66602ad6683231613eec07d2 |
| PORTFOLIO_BASELINE | Portfolio revision 2; organization SHA-1 f405fd39663f4fb78bd963a9215cb39b4c3ce398; audit SHA-1 cc1d6b84c261498532b1d3b73e4ecb490b43e1b9 |
| UPSTREAM_SPEC_BASELINES | none |
| REPOSITORY_BASELINE | HEAD 5ec37e1bdf13250ae93e59ce24ef3c4b4c43a220; dirty tree with 2 status entries, 1 matrix change and 1 unstaged .gitignore change |
| DOCUMENTATION_BASELINE | Component audit SHA-1 e5b181effdf4adac5231d175077e204348295d04; ADR-0001 ff987fbffdf5a9bd43c33743b617c0fa78a5a0eb; ADR-0002 dcc2f778c5c35c0c8e6f6607b7f492cd38455664; ADR-0009 6bf4631e789ebb44ce31e100203969a841ee8b45 |

The staged changes include the current src/, tests/, and DOM ticket/audit
artifacts. They are evidence in the assessed tree, not a clean commit
baseline. Existing matrices, plans, tickets, prototypes, and historical
reports were supporting/navigation evidence only.

## 4. Authority and Ownership Context

Authority order: accepted ADR, approved portfolio decomposition, conformant
component SPEC, conformant upstream SPECs, repository, tests, prototype,
historical evidence.

| Context | Approved value |
| --- | --- |
| OWNED_PORTFOLIO_OBLIGATIONS | O-001–O-015 and O-049–O-054 |
| CONSUMED_PORTFOLIO_OBLIGATIONS | EXEC-001, PLAT-001, GIT-001, BACKEND-001, OPS-001, UI-001 reference-only contracts; no upstream DOM edge |
| NORMATIVE_DEPENDENCIES | none |
| FAILURE_SEMANTICS_OWNED | UNKNOWN_SPEC, INELIGIBLE_REVISION, INVALID_DEPENDENCY_CLOSURE, INVALID_COMMAND_BASIS, STALE_REVISION |
| FAILURE_SEMANTICS_CONSUMED | repository, capability, session, capacity, effect/reconciliation, publication, and legacy failures from approved owners |
| COMPATIBILITY_OWNERSHIP | DOM owns new canonical path, historical replay, and normative cutover; REPO owns legacy adaptation and retirement |
| PROJECTION_ROLE | canonical state/verdict/lineage source; backend, operations, UI, logs, and reports are mappings/projections |

SPEC_IMPLEMENTABILITY_CHECK = PASS was confirmed in the latest component
audit. The audit records complete identity and reconstruction proofs for
WorkflowPipeline, lifecycle, persistence, cross-SPEC authority, authority
consumption, and temporal-authority applicability. No authority gap was
converted into an implementation gap.

## 5. Normative Requirement Inventory

Each requirement is anchored once to its portfolio obligation. All 21 have
valid ADR and portfolio authority and use CANONICAL_OWNER.

| Requirement ID | Portfolio Obligation ID | ADR / section | Role | SPEC section | Normative statement and observable behavior | Dependencies | Failure semantics | Compatibility role |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| DOM-ID-001 | O-001 | ADR-0001 / Decisão | CANONICAL_OWNER | §13 | Stable persistent identity, lineage, revision, historical resolution, distinct kinds; canonical STAGE identity for WorkflowPipeline. | downstream references | UNKNOWN_SPEC, INELIGIBLE_REVISION | OWNER new path/replay |
| DOM-INGEST-001 | O-002 | ADR-0001 / Invariantes | CANONICAL_OWNER | §13 | Processing starts only from explicit manual governed-artifact input. | none | INVALID_COMMAND_BASIS | OWNER new path |
| DOM-SNAPSHOT-001 | O-003 | ADR-0001 / Decisão | CANONICAL_OWNER | §13 | Immutable pre-execution snapshot contains eligible ADRs/hashes, base, configuration, and exact versions. | EXEC-001; PLAT | INVALID_COMMAND_BASIS, STALE_REVISION | OWNER new path/replay |
| DOM-ELIG-001 | O-004 | ADR-0001 / Invariantes | CANONICAL_OWNER | §13 | Only accepted ADRs and eligible revisions enter the snapshot; others fail closed. | ADR/revision authority | INELIGIBLE_REVISION | OWNER new path |
| DOM-LINEAGE-001 | O-005 | ADR-0001 / Decisão | CANONICAL_OWNER | §13 | Explicit, verifiable, many-to-many ADR-SPEC lineage with independent progress. | none | INVALID_COMMAND_BASIS | OWNER new path |
| DOM-LIFE-001 | O-006 | ADR-0001 / Invariantes | CANONICAL_OWNER | §13 | Decision and realization lifecycles are separate and cannot silently mutate one another. | realization consumers | INVALID_COMMAND_BASIS | OWNER new path |
| DOM-REV-001 | O-007 | ADR-0001 / Invariantes | CANONICAL_OWNER | §13 | ADR remediation creates a revision, preserves lineage, and invalidates prior eligibility. | downstream mappings | INELIGIBLE_REVISION | OWNER cutover |
| DOM-IMMUT-001 | O-008 | ADR-0001 / Decisão/Invariantes | CANONICAL_OWNER | §13 | Implemented ADRs are immutable; succession is reciprocal; operational metadata is persistent-record data. | PLAT, REPO | INELIGIBLE_REVISION | OWNER replay |
| DOM-PIPE-001 | O-009 | ADR-0002 / Decisão | CANONICAL_OWNER | §13 | Canonical phase order is enforced and later restoration needs complete immediate-transition provenance. | PLAT provenance/replay | INVALID_DEPENDENCY_CLOSURE, STALE_REVISION | OWNER new path/replay |
| DOM-STATE-001 | O-010 | ADR-0002 / Decisão | CANONICAL_OWNER | §13 | Aggregate state machines remain separate; derived state is not a second authority; provenance is immutable. | PLAT provenance/replay | INVALID_COMMAND_BASIS | OWNER new path/replay |
| DOM-CMD-001 | O-011 | ADR-0002 / Regras | CANONICAL_OWNER | §13 | Commands validate canonical preconditions, reject and record invalid transitions, and cause no effect. | PLAT, BACKEND | INVALID_COMMAND_BASIS, STALE_REVISION | OWNER new path |
| DOM-TICKET-001 | O-012 | ADR-0002 / Transições | CANONICAL_OWNER | §13 | Exactly six ticket functional states; completed/cancelled are terminal. | none | INVALID_COMMAND_BASIS | OWNER new path |
| DOM-TICKET-002 | O-013 | ADR-0002 / Transições | CANONICAL_OWNER | §13 | Exactly eight valid ticket transitions; all others reject and record. | none | INVALID_COMMAND_BASIS | OWNER new path |
| DOM-PUB-001 | O-014 | ADR-0002 / Vocabulário | CANONICAL_OWNER | §13 | Candidate, approval, integration, PR merge, and remote confirmation remain distinct; Git execution is foreign. | GIT evidence | INVALID_COMMAND_BASIS, STALE_REVISION | OWNER new path/cutover |
| DOM-ADV-001 | O-015 | ADR-0002 / Regras | CANONICAL_OWNER | §13 | No auditable advance without formal verdict; independent progress and cooperative cancellation remain distinct. | EXEC, PLAT, GIT | INVALID_DEPENDENCY_CLOSURE, INVALID_COMMAND_BASIS | OWNER new path |
| DOM-AUDIT-001 | O-049 | ADR-0009 / Decisão | CANONICAL_OWNER | §13 | Every governed artifact has distinct artifact, cycle, and round identities. | EXEC references | INVALID_COMMAND_BASIS | OWNER new path |
| DOM-AUDIT-002 | O-050 | ADR-0009 / Decisão | CANONICAL_OWNER | §13 | Only a structured verdict for the exact cycle closes it. | audit consumers | INVALID_COMMAND_BASIS | OWNER new path |
| DOM-AUDIT-003 | O-051 | ADR-0009 / Decisão | CANONICAL_OWNER | §13 | Ten-round initial limit is configurable; affected unit pauses; continuation is explicit. | EXEC | INVALID_COMMAND_BASIS | OWNER cutover |
| DOM-AUDIT-004 | O-052 | ADR-0009 / Decisão | CANONICAL_OWNER | §13 | Final conformance checks adherence, coverage, integration, regressions, tests, omissions, extrapolations. | all evidence | INVALID_COMMAND_BASIS | OWNER new path |
| DOM-AUDIT-005 | O-053 | ADR-0009 / Decisão | CANONICAL_OWNER | §13 | Normative change invalidates affected approvals, preserves history, and creates linked adjustment without reopening completed tickets. | PLAT, GIT, EXEC | STALE_REVISION, INVALID_COMMAND_BASIS | OWNER cutover |
| DOM-AUDIT-006 | O-054 | ADR-0009 / Decisão | CANONICAL_OWNER | §13 | Exact base/head/tree and hash-linked evidence are required; drift invalidates authorization. | GIT, PLAT, OPS | STALE_REVISION, INVALID_COMMAND_BASIS | OWNER replay |

## 6. Existing Implementation Inventory

| Surface | Material evidence | Assessment |
| --- | --- | --- |
| Domain identity | src/domain/identity.ts:1-372; application handler src/application/identity.ts:1-34 | Immutable canonical identity/reference/record and revision catalog ports; no concrete durable repository. |
| Snapshot/eligibility | src/domain/snapshot.ts:1-363; src/application/snapshot.ts:1-83 | Immutable in-memory basis and explicit command; caller status/hash accepted; no durable store. |
| Lineage | src/domain/lineage.ts:1-150; src/application/lineage.ts:1-58 | Immutable relation/progress and repository ports; no concrete durable many-to-many repository. |
| Pipeline/state | src/domain/pipeline.ts:1-384; src/application/pipeline.ts:1-66 | Immediate order, separate state inputs, derivation, and CAS-backed advance; scalar rehydration and PipelineId conflict with SPEC. |
| Tickets/publication/audit | No productive symbols/files under src/ | Missing; prototype only. |
| Persistence/recovery | No database, migration, journal, outbox, checkpoint, concrete repository, or durable evidence implementation. | Missing; interfaces do not prove availability. |
| Runtime/API/security/operations/UI | No productive host/API/auth/Git/operations/UI under src/; UI is prototype/src. | Foreign/downstream surfaces absent or prototype-only. |
| Tests | tests/dom-001-ticket-001.test.ts:122-514; ticket-002:96-215; ticket-004:67-192 | Productive slice tests exist; execution is separate below. |
| Prototype | prototype/README.md states all domain, backend, database, Git, email, and GitHub behavior is in-memory simulation. | Supporting evidence only. |

## 7. Implementation Gap Matrix

Test existence and test execution remain separate dimensions in this table.

| Gap ID | Requirement ID | Portfolio Obligation ID | Ownership Role | Requirement Summary | Classification | Implementation Evidence | Test Evidence | Exact Delta / Verification Blocker | Owner | Dependencies | Confidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| GAP-001, GAP-002 | DOM-ID-001 | O-001 | CANONICAL_OWNER | Persistent identities and canonical pipeline identity | CONTRADICTORY | Generic catalog exists; PipelineId and no concrete persistence exist. | Productive identity/pipeline tests; command below 27/27 PASS. | OBSERVED: in-memory catalog and local PipelineId. REQUIRED: durable identity and canonical STAGE reference. DELTA: persistence absent and parallel authority active. | SPEC-DOM-001 | PLAT; downstream references | HIGH |
| GAP-003 | DOM-INGEST-001 | O-002 | CANONICAL_OWNER | Manual processing entry | PARTIAL | Explicit SubmitManualExecutionHandler exists; no host-wide trigger boundary. | Productive manual-entry negative test; 27/27 PASS; prototype separately 92/92. | OBSERVED: explicit handler only. REQUIRED: sole processing trigger. DELTA: runtime-wide enforcement absent. | SPEC-DOM-001 | none | HIGH |
| GAP-004, GAP-005 | DOM-SNAPSHOT-001 | O-003 | CANONICAL_OWNER | Immutable exact snapshot | CONTRADICTORY | Immutable in-memory snapshot; no durable store; basis comes from caller. | Productive snapshot tests; 27/27 PASS. | GAP-004 OBSERVED: no durable snapshot. REQUIRED: durable pre-execution basis. DELTA: persistence absent. GAP-005 OBSERVED: caller supplies status/hash. REQUIRED: current canonical authority. DELTA: caller authority bypass. | SPEC-DOM-001 | PLAT; EXEC-001 | HIGH |
| GAP-005 | DOM-ELIG-001 | O-004 | CANONICAL_OWNER | Accepted-only eligibility | CONTRADICTORY | Policy checks supplied status and kind, not canonical lifecycle/revision. | Supplied-status negatives; 27/27 PASS. | OBSERVED: supplied ACCEPTED is sufficient. REQUIRED: actual ADR lifecycle/revision authority. DELTA: eligibility bypass. | SPEC-DOM-001 | ADR authority catalog | HIGH |
| GAP-006 | DOM-LINEAGE-001 | O-005 | CANONICAL_OWNER | Independent many-to-many lineage | PARTIAL | Relation/progress and ports exist; no durable repository. | Productive lineage tests; 27/27 PASS. | OBSERVED: in-memory relation contract. REQUIRED: durable, independently queryable relation. DELTA: concrete storage absent. | SPEC-DOM-001 | none | HIGH |
| GAP-007 | DOM-LIFE-001 | O-006 | CANONICAL_OWNER | Separated lifecycles | MISSING | No productive decision/realization lifecycle model. | Prototype only; 92/92 PASS. | OBSERVED: no productive lifecycle authority. REQUIRED: separate lifecycles and authorized transitions. DELTA: model absent. | SPEC-DOM-001 | realization consumers | HIGH |
| GAP-008 | DOM-REV-001 | O-007 | CANONICAL_OWNER | Revision/remediation invalidation | MISSING | Generic identity revision is not ADR remediation or eligibility invalidation. | Prototype only; 92/92 PASS. | OBSERVED: no ADR remediation. REQUIRED: revision, lineage preservation, derived invalidation. DELTA: cutover behavior absent. | SPEC-DOM-001 | downstream mappings | HIGH |
| GAP-009 | DOM-IMMUT-001 | O-008 | CANONICAL_OWNER | Implemented ADR immutability/succession | MISSING | No ADR registry, implemented guard, reciprocal succession, or operational record. | Prototype only; 92/92 PASS. | OBSERVED: no productive immutability boundary. REQUIRED: immutable implemented ADR and successor relation. DELTA: behavior absent. | SPEC-DOM-001 | PLAT; REPO | HIGH |
| GAP-010 | DOM-PIPE-001, DOM-STATE-001 | O-009, O-010 | CANONICAL_OWNER | Ordered pipeline, separate machines, provenance rehydration | CONTRADICTORY | Ordering/derivation exists; rehydrate accepts scalar stage/revision with no chain. | Productive ordering/state tests; no chain witness; 27/27 PASS. | OBSERVED: later state materializes from scalars. REQUIRED: complete immediate-transition provenance. DELTA: forged/skipped later state accepted. | SPEC-DOM-001 | PLAT | HIGH |
| GAP-011 | DOM-CMD-001 | O-011 | CANONICAL_OWNER | Command preconditions/rejection/no effect | PARTIAL | Pipeline handler validates id/target/CAS; no generic command/rejection journal/verdict checks. | Productive invalid/stale tests; 27/27 PASS. | OBSERVED: one in-memory command path. REQUIRED: all command families reject/record canonical reasons. DELTA: enforcement incomplete. | SPEC-DOM-001 | PLAT; BACKEND | HIGH |
| GAP-012 | DOM-CMD-001 | O-011 | CANONICAL_OWNER | Canonical failure semantics | PARTIAL | Local errors use component-specific names and no durable semantic record. | Local error assertions; 27/27 PASS; no mapping execution. | OBSERVED: INELIGIBLE_ADR and PIPELINE_STALE are local labels. REQUIRED: approved DOM failure taxonomy and preserved meaning. DELTA: canonical failure boundary absent. | SPEC-DOM-001 | BACKEND; OPS; UI | HIGH |
| GAP-013 | DOM-ADV-001 | O-015 | CANONICAL_OWNER | Verdict-gated advancement/cancellation | CONTRADICTORY | Advance validates target/revision only; no verdict/dependency/cancellation model. | Prototype only; 92/92 PASS. | OBSERVED: advance can occur without formal verdict. REQUIRED: verdict and dependency gates plus cooperative cancellation. DELTA: premature advancement permitted. | SPEC-DOM-001 | EXEC; PLAT; GIT | HIGH |
| GAP-014 | DOM-TICKET-001 | O-012 | CANONICAL_OWNER | Ticket states/terminality | MISSING | No productive ticket aggregate. | Prototype only; 92/92 PASS. | OBSERVED: no productive ticket authority. REQUIRED: six functional states and terminal semantics. DELTA: state model absent. | SPEC-DOM-001 | none | HIGH |
| GAP-015 | DOM-TICKET-002 | O-013 | CANONICAL_OWNER | Ticket transition table | MISSING | No productive transition command/recorder. | Prototype only; 92/92 PASS. | OBSERVED: no productive transition table. REQUIRED: eight valid transitions and rejection of all others. DELTA: enforcement absent. | SPEC-DOM-001 | none | HIGH |
| GAP-016 | DOM-PUB-001 | O-014 | CANONICAL_OWNER | Publication vocabulary | MISSING | No productive publication model or DOM-GIT evidence boundary. | Prototype only; 92/92 PASS. | OBSERVED: publication exists only in mock. REQUIRED: distinct states and foreign Git execution. DELTA: productive vocabulary absent. | SPEC-DOM-001 | GIT | HIGH |
| GAP-017 | DOM-AUDIT-001 | O-049 | CANONICAL_OWNER | Artifact/cycle/round identities | MISSING | No productive audit-cycle identity registry. | Prototype only; 92/92 PASS. | OBSERVED: no productive cycle identity. REQUIRED: distinct identities without implicit reuse. DELTA: authority absent. | SPEC-DOM-001 | EXEC | HIGH |
| GAP-018 | DOM-AUDIT-002 | O-050 | CANONICAL_OWNER | Structured verdict closure | MISSING | No productive structured verdict/closure command. | Prototype only; 92/92 PASS. | OBSERVED: no productive closure. REQUIRED: exact structured verdict closes cycle. DELTA: remediation cannot be separated from approval. | SPEC-DOM-001 | audit consumers | HIGH |
| GAP-019 | DOM-AUDIT-003 | O-051 | CANONICAL_OWNER | Ten-round limit/continuation | MISSING | No productive round counter, pause, or authorization. | Prototype only; 92/92 PASS. | OBSERVED: no productive policy. REQUIRED: configurable limit and explicit affected-unit continuation. DELTA: enforcement absent. | SPEC-DOM-001 | EXEC | HIGH |
| GAP-020 | DOM-AUDIT-004 | O-052 | CANONICAL_OWNER | Final conformance evaluation | MISSING | No productive evaluator. | Prototype only; 92/92 PASS. | OBSERVED: no productive final conformance. REQUIRED: all named dimensions and remediation return. DELTA: evaluator absent. | SPEC-DOM-001 | all evidence | HIGH |
| GAP-021 | DOM-AUDIT-005 | O-053 | CANONICAL_OWNER | Normative-change invalidation | MISSING | No downstream approval registry or cutover path. | Prototype only; 92/92 PASS. | OBSERVED: no productive invalidation. REQUIRED: obsolete affected approvals, preserved history, linked new adjustment without reopening completed tickets. DELTA: cutover absent. | SPEC-DOM-001 | PLAT; GIT; EXEC | HIGH |
| GAP-022 | DOM-AUDIT-006 | O-054 | CANONICAL_OWNER | Exact candidate evidence/drift gate | MISSING | No productive base/head/tree binding or hash-linked evidence gate. | Prototype only; 92/92 PASS. | OBSERVED: mock fields only. REQUIRED: exact candidate revalidation and drift invalidation before publication. DELTA: gate absent. | SPEC-DOM-001 | GIT; PLAT; OPS | HIGH |

## 8. Detailed Gap Records

Each record below is exactly one distinct Gap ID. Deltas describe observed
behavior, not implementation prescriptions.

### GAP-001

- Affected Requirements: DOM-ID-001.
- Portfolio Obligations: O-001.
- Gap Category: BEHAVIOR_PARTIAL. Severity: MAJOR.
- Normative Expectation: durable, unique, immutable, scoped, revisioned identity and historical resolution.
- Current Repository Behavior: immutable identity value objects/catalog and repository ports exist; no durable repository.
- Repository Evidence: src/domain/identity.ts:108-367; tests/dom-001-ticket-001.test.ts:122-379.
- Test Existence Evidence: creation, uniqueness, revision, exact lookup, immutability, and filename-rejection assertions.
- Test Execution Evidence: productive command below, 27/27 PASS.
- Exact Delta: productive durable identity storage and historical resolution are absent.
- Ownership Boundary: DOM owns identity meaning; PLAT owns physical durability. LOCAL_OBLIGATION: identity semantics. FOREIGN_OBLIGATION: physical storage. FOREIGN_OWNER: SPEC-PLAT-001. LOCAL_INTEGRATION_EXPECTATION: rehydration preserves canonical identity.
- Dependencies: PLAT physical persistence.
- Observed Repository Boundary: domain ports only; no adapter.
- Acceptance Evidence Needed: durable creation, uniqueness, exact historical lookup, invalid-reference, and rehydration witnesses.

### GAP-002

- Affected Requirements: DOM-ID-001.
- Portfolio Obligations: O-001.
- Gap Category: BEHAVIOR_CONTRADICTORY. Severity: MAJOR.
- Normative Expectation: WorkflowPipeline uses CanonicalIdentityReference kind STAGE, scope ExecutionId, value StageId as its sole identity.
- Current Repository Behavior: WorkflowPipeline owns and resolves PipelineId.
- Repository Evidence: src/domain/pipeline.ts:63-83,309-343; src/application/pipeline.ts:16-24.
- Test Existence Evidence: tests assert PipelineId behavior, not the mandated Stage reference.
- Test Execution Evidence: productive command below, 27/27 PASS.
- Exact Delta: PipelineId is an alternate productive canonical authority.
- Ownership Boundary: DOM owns canonical identity. LOCAL_OBLIGATION: canonical pipeline identity. FOREIGN_OBLIGATION: none. FOREIGN_OWNER: none. LOCAL_INTEGRATION_EXPECTATION: consumers receive only the canonical Stage reference.
- Dependencies: none.
- Observed Repository Boundary: src/domain/pipeline.ts.
- Acceptance Evidence Needed: direct positive/negative witness that the Stage reference is the sole pipeline authority.

### GAP-003

- Affected Requirements: DOM-INGEST-001.
- Portfolio Obligations: O-002.
- Gap Category: BEHAVIOR_PARTIAL. Severity: MAJOR.
- Normative Expectation: only explicit manual governed-artifact input starts processing.
- Current Repository Behavior: SubmitManualExecutionHandler requires an explicit command; no runtime host proves the sole trigger.
- Repository Evidence: src/application/snapshot.ts:19-83; tests/dom-001-ticket-002.test.ts:141-157.
- Test Existence Evidence: discovery-only input and explicit command assertions.
- Test Execution Evidence: productive command below, 27/27 PASS; prototype command, 92/92 PASS, separately.
- Exact Delta: manual submission exists, but runtime-wide trigger enforcement is absent.
- Ownership Boundary: DOM owns the entry gate; BACKEND/UI are mappings. LOCAL_OBLIGATION: manual trigger. FOREIGN_OBLIGATION: transport invocation. FOREIGN_OWNER: BACKEND/UI. LOCAL_INTEGRATION_EXPECTATION: discovery/session state cannot start processing.
- Dependencies: none.
- Observed Repository Boundary: application handler without host.
- Acceptance Evidence Needed: runtime positive manual-start and negative discovery/session-start witnesses.

### GAP-004

- Affected Requirements: DOM-SNAPSHOT-001.
- Portfolio Obligations: O-003.
- Gap Category: BEHAVIOR_PARTIAL. Severity: MAJOR.
- Normative Expectation: snapshot basis is durably recorded before execution and replayable.
- Current Repository Behavior: immutable snapshot and persistence port exist, but no durable implementation.
- Repository Evidence: src/domain/snapshot.ts:211-326,328-363; src/application/snapshot.ts:55-83.
- Test Existence Evidence: immutable confirmation and rehydration tests/dom-001-ticket-002.test.ts:96-215.
- Test Execution Evidence: productive command below, 27/27 PASS; no durable execution witness.
- Exact Delta: concrete durable snapshot persistence/recovery is absent.
- Ownership Boundary: DOM owns snapshot meaning; PLAT owns storage/recovery. LOCAL_OBLIGATION: immutable basis. FOREIGN_OBLIGATION: durable storage. FOREIGN_OWNER: SPEC-PLAT-001. LOCAL_INTEGRATION_EXPECTATION: persisted material rehydrates unchanged.
- Dependencies: PLAT persistence/recovery.
- Observed Repository Boundary: ExecutionSnapshotRepository port only.
- Acceptance Evidence Needed: restart/replay witness for all fields and corrupt/missing material rejection.

### GAP-005

- Affected Requirements: DOM-SNAPSHOT-001, DOM-ELIG-001.
- Portfolio Obligations: O-003, O-004.
- Gap Category: BEHAVIOR_CONTRADICTORY. Severity: MAJOR.
- Normative Expectation: eligibility and snapshot hashes/statuses come from canonical ADR authority, not caller claims.
- Current Repository Behavior: handler resolves identity; policy accepts caller decisionStatus and contentHash.
- Repository Evidence: src/application/snapshot.ts:41-53; src/domain/snapshot.ts:139-201.
- Test Existence Evidence: tests reject supplied non-accepted statuses, but do not mutate canonical status and try false ACCEPTED.
- Test Execution Evidence: productive command below, 27/27 PASS.
- Exact Delta: caller can supply ACCEPTED and a hash without independent lifecycle/content validation.
- Ownership Boundary: DOM owns ADR eligibility/snapshot authority. LOCAL_OBLIGATION: canonical read/validation. FOREIGN_OBLIGATION: none. FOREIGN_OWNER: none. LOCAL_INTEGRATION_EXPECTATION: current ADR revision/status is resolved before freezing.
- Dependencies: canonical ADR lifecycle authority.
- Observed Repository Boundary: application command input into domain value objects.
- Acceptance Evidence Needed: mutation-window negative witness for false status/hash.

### GAP-006

- Affected Requirements: DOM-LINEAGE-001.
- Portfolio Obligations: O-005.
- Gap Category: BEHAVIOR_PARTIAL. Severity: MAJOR.
- Normative Expectation: explicit ADR-SPEC many-to-many relations are durable, independently progressing, and queryable.
- Current Repository Behavior: immutable relation/progress and ports exist; storage is absent.
- Repository Evidence: src/domain/lineage.ts:57-150; src/application/lineage.ts:1-58.
- Test Existence Evidence: productive independent relation, duplicate, progress, rehydration, and concurrency assertions.
- Test Execution Evidence: productive command below, 27/27 PASS.
- Exact Delta: no concrete durable lineage catalog.
- Ownership Boundary: DOM owns relation meaning/progress. LOCAL_OBLIGATION: lineage. FOREIGN_OBLIGATION: none. FOREIGN_OWNER: none. LOCAL_INTEGRATION_EXPECTATION: historical relations remain independently addressable.
- Dependencies: none.
- Observed Repository Boundary: AdrSpecLineageRepository interface only.
- Acceptance Evidence Needed: restart continuity and durable multiple-relation witnesses.

### GAP-007

- Affected Requirements: DOM-LIFE-001.
- Portfolio Obligations: O-006.
- Gap Category: BEHAVIOR_MISSING. Severity: MAJOR.
- Normative Expectation: decision and realization lifecycles are separate and only authorized transitions cross the boundary.
- Current Repository Behavior: no productive lifecycle model exists.
- Repository Evidence: no lifecycle symbols under src/; prototype/src/mockDomain.ts only.
- Test Existence Evidence: prototype lifecycle scenarios only.
- Test Execution Evidence: npm --prefix prototype test, 92/92 PASS; no productive direct test.
- Exact Delta: productive lifecycle authority is absent.
- Ownership Boundary: DOM owns semantic lifecycles; EXEC/GIT/PLAT provide realization contracts. LOCAL_OBLIGATION: lifecycle separation. FOREIGN_OBLIGATION: execution details. FOREIGN_OWNER: EXEC/GIT/PLAT. LOCAL_INTEGRATION_EXPECTATION: execution cannot mutate decision state implicitly.
- Dependencies: realization consumers.
- Observed Repository Boundary: prototype-only state.
- Acceptance Evidence Needed: lifecycle isolation and authorized-transition witnesses.

### GAP-008

- Affected Requirements: DOM-REV-001.
- Portfolio Obligations: O-007.
- Gap Category: COMPATIBILITY_VIOLATION. Severity: MAJOR.
- Normative Expectation: ADR remediation increments revision, preserves lineage/history, and invalidates derived eligibility.
- Current Repository Behavior: generic identity revision exists, but no ADR remediation/content invalidation.
- Repository Evidence: src/domain/identity.ts:206-280; no ADR lifecycle under src/.
- Test Existence Evidence: prototype mutation/restoration only.
- Test Execution Evidence: prototype command, 92/92 PASS; no productive direct test.
- Exact Delta: accepted-ADR cutover and prior-basis invalidation are absent.
- Ownership Boundary: DOM owns revision/cutover; REPO/BACKEND/OPS map it. LOCAL_OBLIGATION: revision/invalidation. FOREIGN_OBLIGATION: legacy adaptation/projection. FOREIGN_OWNER: REPO/BACKEND/OPS. LOCAL_INTEGRATION_EXPECTATION: stale derived eligibility is not reused.
- Dependencies: downstream approval records.
- Observed Repository Boundary: generic identity utility.
- Acceptance Evidence Needed: revision/cutover witness preserving historical lineage.

### GAP-009

- Affected Requirements: DOM-IMMUT-001.
- Portfolio Obligations: O-008.
- Gap Category: BEHAVIOR_MISSING. Severity: MAJOR.
- Normative Expectation: implemented ADR is immutable, succession reciprocal, and operational metadata is outside the ADR document.
- Current Repository Behavior: no productive ADR registry or implemented-state guard.
- Repository Evidence: no ADR/succession symbols under src/; prototype is non-authoritative.
- Test Existence Evidence: prototype hash/succession scenarios only.
- Test Execution Evidence: prototype command, 92/92 PASS.
- Exact Delta: productive immutability, succession, and record boundary are absent.
- Ownership Boundary: DOM owns immutability; PLAT stores operational evidence; REPO adapts legacy. LOCAL_OBLIGATION: ADR guard/succession. FOREIGN_OBLIGATION: physical evidence/legacy path. FOREIGN_OWNER: PLAT/REPO. LOCAL_INTEGRATION_EXPECTATION: consumers cannot rewrite implemented ADRs.
- Dependencies: PLAT evidence; REPO compatibility.
- Observed Repository Boundary: prototype mock.
- Acceptance Evidence Needed: mutation rejection, reciprocal succession, and document-metadata isolation witnesses.

### GAP-010

- Affected Requirements: DOM-PIPE-001, DOM-STATE-001.
- Portfolio Obligations: O-009, O-010.
- Gap Category: BEHAVIOR_CONTRADICTORY. Severity: MAJOR.
- Normative Expectation: later restoration requires canonical identity plus complete append-only immediate-transition provenance.
- Current Repository Behavior: order and state derivation exist; rehydrate accepts stage/revision scalars without provenance.
- Repository Evidence: src/domain/pipeline.ts:106-115,245-298,303-343; tests/dom-001-ticket-004.test.ts:67-156.
- Test Existence Evidence: ordering/state tests exist; no chain completeness/skip/forgery witness.
- Test Execution Evidence: productive command below, 27/27 PASS.
- Exact Delta: forged/skipped later state can materialize without creation record, predecessor chain, or final snapshot match.
- Ownership Boundary: DOM owns progression; PLAT stores/replays provenance. LOCAL_OBLIGATION: semantic reconstruction. FOREIGN_OBLIGATION: physical journal/replay. FOREIGN_OWNER: SPEC-PLAT-001. LOCAL_INTEGRATION_EXPECTATION: supplied chain is validated before materialization.
- Dependencies: PLAT provenance/replay.
- Observed Repository Boundary: scalar rehydration API.
- Acceptance Evidence Needed: valid-chain, skip, missing predecessor, duplicate/order, divergence, and forged-state witnesses.

### GAP-011

- Affected Requirements: DOM-CMD-001.
- Portfolio Obligations: O-011.
- Gap Category: BEHAVIOR_PARTIAL. Severity: MAJOR.
- Normative Expectation: every command validates canonical preconditions, records rejection, and causes no state/effect mutation.
- Current Repository Behavior: one pipeline handler validates id/target/CAS; generic command/rejection journal/verdict checks are absent.
- Repository Evidence: src/application/pipeline.ts:16-40.
- Test Existence Evidence: productive invalid/stale/no-mutation tests; no all-command/rejection-record witness.
- Test Execution Evidence: productive command below, 27/27 PASS.
- Exact Delta: enforcement and recording cover only one in-memory path.
- Ownership Boundary: DOM owns command semantics; PLAT records; BACKEND maps. LOCAL_OBLIGATION: preconditions/no-effect. FOREIGN_OBLIGATION: journal/transport. FOREIGN_OWNER: PLAT/BACKEND. LOCAL_INTEGRATION_EXPECTATION: rejection meaning is preserved.
- Dependencies: PLAT journal; BACKEND mapping.
- Observed Repository Boundary: application handler and repository port.
- Acceptance Evidence Needed: command-family positive/negative/no-effect witnesses.

### GAP-012

- Affected Requirements: DOM-CMD-001.
- Portfolio Obligations: O-011.
- Gap Category: FAILURE_SEMANTIC_VIOLATION. Severity: MAJOR.
- Normative Expectation: DOM failure family/code meaning, retryability, terminality, and recovery semantics remain canonical.
- Current Repository Behavior: local codes include INELIGIBLE_ADR, PIPELINE_STALE, and PIPELINE_NOT_FOUND; no canonical registry/record.
- Repository Evidence: src/domain/snapshot.ts:9-19; src/domain/pipeline.ts:31-38.
- Test Existence Evidence: tests assert local codes only; no cross-layer mapping test.
- Test Execution Evidence: productive command below, 27/27 PASS.
- Exact Delta: productive boundary has not preserved the approved DOM failure taxonomy.
- Ownership Boundary: DOM owns semantic failures; BACKEND/OPS/UI map/log/present. LOCAL_OBLIGATION: canonical meaning. FOREIGN_OBLIGATION: mapping/logging. FOREIGN_OWNER: BACKEND/OPS/UI. LOCAL_INTEGRATION_EXPECTATION: mappings cannot rename meaning.
- Dependencies: mapping contracts.
- Observed Repository Boundary: domain error classes.
- Acceptance Evidence Needed: all five DOM-owned code mapping and negative retry/recovery witnesses.

### GAP-013

- Affected Requirements: DOM-ADV-001.
- Portfolio Obligations: O-015.
- Gap Category: BEHAVIOR_CONTRADICTORY. Severity: MAJOR.
- Normative Expectation: formal verdict and dependency closure gate every auditable advance; cancellation is cooperative.
- Current Repository Behavior: advance validates target/revision only; no verdict/dependency/cancellation model.
- Repository Evidence: src/application/pipeline.ts:16-40.
- Test Existence Evidence: prototype verdict/cancellation scenarios only.
- Test Execution Evidence: prototype command, 92/92 PASS; no productive direct test.
- Exact Delta: productive advance is possible without formal verdict.
- Ownership Boundary: DOM owns advancement/cancellation; EXEC/PLAT/GIT provide evidence/effects. LOCAL_OBLIGATION: gates/cooperative state. FOREIGN_OBLIGATION: execution/effects. FOREIGN_OWNER: EXEC/PLAT/GIT. LOCAL_INTEGRATION_EXPECTATION: foreign evidence does not redefine gates.
- Dependencies: EXEC/PLAT/GIT contracts.
- Observed Repository Boundary: pipeline application handler.
- Acceptance Evidence Needed: no-verdict, closed-dependency, and cooperative-cancellation witnesses.

### GAP-014

- Affected Requirements: DOM-TICKET-001.
- Portfolio Obligations: O-012.
- Gap Category: BEHAVIOR_MISSING. Severity: MAJOR.
- Normative Expectation: exactly six functional ticket states and terminal no-reopen semantics.
- Current Repository Behavior: no productive ticket aggregate/state model.
- Repository Evidence: no ticket symbols under src/; prototype only.
- Test Existence Evidence: prototype state assertions only.
- Test Execution Evidence: prototype command, 92/92 PASS.
- Exact Delta: productive ticket state authority is absent.
- Ownership Boundary: DOM owns ticket semantics; EXEC/GIT/BACKEND/UI map. LOCAL_OBLIGATION: ticket state. FOREIGN_OBLIGATION: execution/transport. FOREIGN_OWNER: EXEC/GIT/BACKEND/UI. LOCAL_INTEGRATION_EXPECTATION: operational states cannot become functional authority.
- Dependencies: none.
- Observed Repository Boundary: prototype mock.
- Acceptance Evidence Needed: six-state and terminal no-reopen witnesses.

### GAP-015

- Affected Requirements: DOM-TICKET-002.
- Portfolio Obligations: O-013.
- Gap Category: BEHAVIOR_MISSING. Severity: MAJOR.
- Normative Expectation: exactly eight valid ticket transitions; every other transition rejects and records.
- Current Repository Behavior: no productive ticket transition command/recorder.
- Repository Evidence: no ticket transition symbols under src/.
- Test Existence Evidence: prototype transition tests only.
- Test Execution Evidence: prototype command, 92/92 PASS.
- Exact Delta: productive transition enforcement is absent.
- Ownership Boundary: DOM owns transition validity. LOCAL_OBLIGATION: transition table. FOREIGN_OBLIGATION: none. FOREIGN_OWNER: none. LOCAL_INTEGRATION_EXPECTATION: invalid transitions do not mutate state.
- Dependencies: none.
- Observed Repository Boundary: prototype mock.
- Acceptance Evidence Needed: all eight positive and representative invalid/terminal witnesses.

### GAP-016

- Affected Requirements: DOM-PUB-001.
- Portfolio Obligations: O-014.
- Gap Category: BEHAVIOR_MISSING. Severity: MAJOR.
- Normative Expectation: publication candidate, approval, integration, PR merge, and remote confirmation are distinct; Git execution is GIT-owned.
- Current Repository Behavior: no productive publication model or DOM-GIT boundary.
- Repository Evidence: no publication symbols under src/; mock only.
- Test Existence Evidence: prototype publication/drift/remote tests only.
- Test Execution Evidence: prototype command, 92/92 PASS.
- Exact Delta: productive vocabulary and foreign-evidence consumption are absent.
- Ownership Boundary: DOM owns vocabulary/gates; GIT owns execution/confirmation. LOCAL_OBLIGATION: states. FOREIGN_OBLIGATION: push/PR/merge evidence. FOREIGN_OWNER: SPEC-GIT-001. LOCAL_INTEGRATION_EXPECTATION: PR_MERGED cannot become remote confirmation locally.
- Dependencies: GIT evidence.
- Observed Repository Boundary: prototype publication model.
- Acceptance Evidence Needed: state distinction and no-DOM-Git-execution witnesses.

### GAP-017

- Affected Requirements: DOM-AUDIT-001.
- Portfolio Obligations: O-049.
- Gap Category: BEHAVIOR_MISSING. Severity: MAJOR.
- Normative Expectation: each governed artifact has distinct artifact/cycle/round identity.
- Current Repository Behavior: no productive audit-cycle identity registry.
- Repository Evidence: no audit-cycle symbols under src/; prototype only.
- Test Existence Evidence: prototype audit/remediation/round tests only.
- Test Execution Evidence: prototype command, 92/92 PASS.
- Exact Delta: formal cycle identity and non-reuse are absent.
- Ownership Boundary: DOM owns cycle identity; EXEC supplies sessions/assignments. LOCAL_OBLIGATION: artifact/cycle/round identity. FOREIGN_OBLIGATION: session execution. FOREIGN_OWNER: SPEC-EXEC-002. LOCAL_INTEGRATION_EXPECTATION: session identity cannot replace cycle identity.
- Dependencies: EXEC references.
- Observed Repository Boundary: prototype mock.
- Acceptance Evidence Needed: distinct-cycle and non-reuse witnesses.

### GAP-018

- Affected Requirements: DOM-AUDIT-002.
- Portfolio Obligations: O-050.
- Gap Category: BEHAVIOR_MISSING. Severity: MAJOR.
- Normative Expectation: only a structured verdict for the exact artifact/revision/cycle/round closes a cycle.
- Current Repository Behavior: no productive verdict/closure command.
- Repository Evidence: no verdict symbols under src/; prototype only.
- Test Existence Evidence: prototype verdict/remediation separation only.
- Test Execution Evidence: prototype command, 92/92 PASS.
- Exact Delta: productive closure cannot distinguish verdict from remediation/no findings.
- Ownership Boundary: DOM owns closure; audit consumers map. LOCAL_OBLIGATION: structured closure. FOREIGN_OBLIGATION: audit execution. FOREIGN_OWNER: EXEC/consumer auditors. LOCAL_INTEGRATION_EXPECTATION: omission cannot self-approve.
- Dependencies: audit records.
- Observed Repository Boundary: prototype mock.
- Acceptance Evidence Needed: structured-verdict positive and remediation-only negative witnesses.

### GAP-019

- Affected Requirements: DOM-AUDIT-003.
- Portfolio Obligations: O-051.
- Gap Category: BEHAVIOR_MISSING. Severity: MAJOR.
- Normative Expectation: configurable ten-round limit, affected-unit pause, and explicit continuation.
- Current Repository Behavior: no productive round counter/pause/authorization.
- Repository Evidence: no round-policy symbols under src/; prototype only.
- Test Existence Evidence: prototype round-limit tests only.
- Test Execution Evidence: prototype command, 92/92 PASS.
- Exact Delta: productive limit and continuation authorization are absent.
- Ownership Boundary: DOM owns round semantics; EXEC executes activities. LOCAL_OBLIGATION: limit/pause/authorization. FOREIGN_OBLIGATION: activity scheduling. FOREIGN_OWNER: SPEC-EXEC-002. LOCAL_INTEGRATION_EXPECTATION: no implicit approval or cross-unit pause.
- Dependencies: EXEC.
- Observed Repository Boundary: prototype mock.
- Acceptance Evidence Needed: tenth-round, unit isolation, and explicit continuation witnesses.

### GAP-020

- Affected Requirements: DOM-AUDIT-004.
- Portfolio Obligations: O-052.
- Gap Category: BEHAVIOR_MISSING. Severity: MAJOR.
- Normative Expectation: final conformance checks adherence, coverage, integration, regression, tests, omissions, and extrapolations.
- Current Repository Behavior: no productive evaluator.
- Repository Evidence: no evaluator symbols under src/; prototype report only.
- Test Existence Evidence: prototype end-to-end scenarios only.
- Test Execution Evidence: prototype command, 92/92 PASS.
- Exact Delta: required final checks and remediation return are absent.
- Ownership Boundary: DOM owns decision semantics; downstream components produce evidence. LOCAL_OBLIGATION: evaluation/closure. FOREIGN_OBLIGATION: evidence production. FOREIGN_OWNER: downstream components. LOCAL_INTEGRATION_EXPECTATION: missing evidence cannot pass.
- Dependencies: cross-component evidence.
- Observed Repository Boundary: prototype report.
- Acceptance Evidence Needed: direct witness for each named dimension and finding return.

### GAP-021

- Affected Requirements: DOM-AUDIT-005.
- Portfolio Obligations: O-053.
- Gap Category: COMPATIBILITY_VIOLATION. Severity: MAJOR.
- Normative Expectation: normative change obsoletes affected approvals, preserves history, and creates linked adjustment without reopening completed tickets.
- Current Repository Behavior: no downstream approval registry or cutover/invalidation.
- Repository Evidence: no invalidation/cutover symbols under src/; prototype only.
- Test Existence Evidence: prototype drift/invalidation tests only.
- Test Execution Evidence: prototype command, 92/92 PASS.
- Exact Delta: canonical cutover and historical downstream invalidation are absent.
- Ownership Boundary: DOM owns cutover; PLAT/GIT/EXEC preserve/consume records. LOCAL_OBLIGATION: invalidation/continuation. FOREIGN_OBLIGATION: evidence/publication records. FOREIGN_OWNER: PLAT/GIT/EXEC. LOCAL_INTEGRATION_EXPECTATION: completed tickets remain terminal.
- Dependencies: downstream approval/ticket records.
- Observed Repository Boundary: prototype mock.
- Acceptance Evidence Needed: selective invalidation, history preservation, and no-reopen witness.

### GAP-022

- Affected Requirements: DOM-AUDIT-006.
- Portfolio Obligations: O-054.
- Gap Category: COMPATIBILITY_VIOLATION. Severity: MAJOR.
- Normative Expectation: exact base/head/tree and hash-linked evidence bind candidate conformance; drift invalidates authorization.
- Current Repository Behavior: no productive candidate binding or drift gate.
- Repository Evidence: no exact-candidate symbols under src/; prototype fields only.
- Test Existence Evidence: prototype publication/evidence tests only.
- Test Execution Evidence: prototype command, 92/92 PASS.
- Exact Delta: productive exact evidence/revalidation before publication is absent.
- Ownership Boundary: DOM owns basis/invalidation; GIT produces evidence; PLAT/OPS preserve/project. LOCAL_OBLIGATION: exact-basis gate. FOREIGN_OBLIGATION: Git evidence/physical preservation. FOREIGN_OWNER: GIT/PLAT/OPS. LOCAL_INTEGRATION_EXPECTATION: drift cannot become approval.
- Dependencies: GIT/PLAT/OPS evidence.
- Observed Repository Boundary: prototype publication ledger.
- Acceptance Evidence Needed: base/head/tree drift and hash-linked retrieval witnesses.

## 9. Contradictory Implementation Findings

| Requirement | Gap ID | Portfolio Obligation | Repository Location | Observed Behavior | Required Behavior | Wrong Owner? | Alternate Productive Path? | Can Mutate Canonical State? | Historical Non-Conformance Risk? | Severity |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| DOM-ID-001 | GAP-002 | O-001 | src/domain/pipeline.ts:63-83,309-343 | PipelineId is pipeline identity. | Canonical STAGE reference only. | No | No | Yes, alternate lookup | Yes | MAJOR |
| DOM-SNAPSHOT-001 / DOM-ELIG-001 | GAP-005 | O-003/O-004 | src/application/snapshot.ts:41-53 | Caller status/hash drives basis. | Current ADR authority decides. | No | No | Yes, false basis | Yes | MAJOR |
| DOM-PIPE-001 / DOM-STATE-001 | GAP-010 | O-009/O-010 | src/domain/pipeline.ts:303-343 | Scalar later state rehydrates without chain. | Complete provenance required. | No | No | Yes, forged state | Yes | MAJOR |
| DOM-ADV-001 | GAP-013 | O-015 | src/application/pipeline.ts:16-40 | Advance needs target/revision only. | Formal verdict/dependency closure. | No | No | Yes, premature advance | Yes | MAJOR |

No wrong semantic owner was found in backend, operations, UI, or projection
surfaces because no productive versions exist. Prototype surfaces are
non-authoritative.

## 10. Responsibility Leakage Analysis

| Observation | Result | Reason |
| --- | --- | --- |
| src/domain and src/application contain the current domain slice. | OWNERSHIP_CONFORMANT | Location follows DOM boundary. |
| PipelineId is a semantic alternate authority. | WRONG_OWNER_IMPLEMENTATION / ALTERNATE_AUTHORITY_PRESENT | Semantic contradiction, not file-location concern. |
| Repository interfaces are ports without adapters. | IMPLEMENTATION_LOCATION_CONCERN, NON_BLOCKING | Ports preserve ownership; availability is absent. |
| Prototype UI/mock, reports, fixtures, and tests. | PROJECTION_OR_SUPPORT_ONLY | They cannot establish canonical authority. |
| Productive backend/OPS/UI/GIT leakage. | NOT_OBSERVED | No productive surfaces found. |

WRONG_OWNER_IMPLEMENTATIONS = 0.
IMPLEMENTATION_LOCATION_CONCERNS = 1.
PORTFOLIO_OWNERSHIP_VIOLATION_GAPS = 1, for GAP-002 alternate authority.

## 11. Failure Ownership Verification

| Failure | Portfolio semantic owner | Component role | Repository implementation location | Repository semantic owner | Result |
| --- | --- | --- | --- | --- | --- |
| UNKNOWN_REPOSITORY, REPOSITORY_NOT_ENABLED | SPEC-REPO-001 | CONSUMER | none | none | NOT_APPLICABLE |
| UNKNOWN_SPEC, INELIGIBLE_REVISION | SPEC-DOM-001 | OWNER | no canonical registry; supplied check in snapshot.ts:191-201 | local component check | MISSING |
| UNKNOWN_CAPABILITY, INCOMPATIBLE_CAPABILITY | SPEC-EXEC-001 | CONSUMER | none | none | NOT_APPLICABLE |
| INVALID_DEPENDENCY_CLOSURE | SPEC-DOM-001 | OWNER | no dependency/verdict model | none | MISSING |
| INVALID_COMMAND_BASIS, STALE_REVISION | SPEC-DOM-001 | OWNER | pipeline.ts:28-40; local PIPELINE_STALE | local handler, non-canonical label | PARTIAL |
| UNAUTHORIZED_LOCAL_SESSION | SPEC-BACKEND-001 | CONSUMER | none | none | NOT_APPLICABLE |
| CAPACITY_UNKNOWN, CAPACITY_EXHAUSTED, AGENT_INELIGIBLE | SPEC-EXEC-002 | CONSUMER | none | none | NOT_APPLICABLE |
| CONTRACT_INVALID, VERDICT_UNKNOWN | SPEC-EXEC-001 | CONSUMER | none | none | NOT_APPLICABLE |
| EXPECTED_INCOMPLETE_EFFECT, MISSING_EFFECT, SEMANTIC_DIVERGENCE, CONFLICTING_EFFECT | SPEC-PLAT-001 | CONSUMER | none | none | NOT_APPLICABLE |
| PUBLICATION_DRIFT, MERGE_CONFLICT, REMOTE_PUBLICATION_UNCONFIRMED | SPEC-GIT-001 | CONSUMER | none | none | NOT_APPLICABLE |
| LEGACY_COMPATIBILITY_ONLY | SPEC-REPO-001 | CONSUMER | none | none | NOT_APPLICABLE |

GAP-012 records the one local failure semantic violation. Mappings were not
used to manufacture a second local gap.

## 12. Compatibility / Cutover Verification

| Dimension | Approved DOM role | Repository observation | Result |
| --- | --- | --- | --- |
| NEW_CANONICAL_PATH | OWNER | Partial identity/snapshot/lineage/pipeline slice; remaining aggregates absent. | PARTIAL |
| LEGACY_COMPATIBILITY | CONSUMER of REPO | No productive legacy adapter or second authority. | NOT_APPLICABLE |
| HISTORICAL_REPLAY | OWNER | Scalar rehydration lacks provenance; durable replay absent. | MISSING, GAP-010/GAP-022 |
| CUTOVER | OWNER | No normative-change invalidation path. | MISSING, GAP-008/GAP-021 |
| RETIREMENT | NOT_APPLICABLE | Legacy retirement belongs to REPO. | NOT_APPLICABLE |

No dual productive canonical path was found besides the PipelineId violation
in GAP-002. Prototype drift/legacy scenarios are not productive support.

## 13. Cross-SPEC Dependency Matrix

DOM has no normative upstream dependencies. These approved downstream/consumed
contracts are listed to preserve boundaries; their absence is not a local DOM
gap.

| Dependency SPEC | Portfolio Role | Foreign Ownership | Local Obligation | Repository Integration | Foreign Implementation State | Result |
| --- | --- | --- | --- | --- | --- | --- |
| SPEC-EXEC-001 | downstream consumer | versions/capabilities | store exact reference | no productive integration | pending downstream | NOT_REQUIRED_FOR_CURRENT_GAPS |
| SPEC-EXEC-002 | downstream consumer | sessions/assignments/cycles/scheduler | preserve references | no productive integration | pending downstream | NOT_REQUIRED_FOR_CURRENT_GAPS |
| SPEC-PLAT-001 | downstream consumer | persistence/journal/outbox/recovery | durable snapshot/provenance material; DOM validates meaning | repository ports only | no concrete integration | PARTIAL |
| SPEC-REPO-001 | downstream consumer | repository/bootstrap/legacy adaptation | consume mapping without authority transfer | no productive integration | pending downstream | NOT_REQUIRED_FOR_CURRENT_GAPS |
| SPEC-GIT-001 | downstream consumer | Git/worktree/PR/remote confirmation | consume publication evidence | no productive integration | pending downstream | NOT_REQUIRED_FOR_CURRENT_GAPS |
| SPEC-BACKEND-001 | downstream consumer | application/transport/security | preserve command/failure semantics | no productive integration | pending downstream | NOT_REQUIRED_FOR_CURRENT_GAPS |
| SPEC-OPS-001 | downstream consumer | operational projection/retention/export | project canonical state/verdict/lineage | no productive integration | pending downstream | NOT_REQUIRED_FOR_CURRENT_GAPS |
| SPEC-UI-001 | downstream consumer | interaction/presentation | request/project, never confirm | prototype only | pending downstream | NOT_REQUIRED_FOR_CURRENT_GAPS |

AUTHORITY_CONSUMPTION_PROOFS = 0 for external upstream authorities.
AUTHORITY_NOT_DEFINED = 0.
AUTHORITY_DEFINED_BUT_NOT_CONSUMABLE = 0.
AUTHORITY_CONSUMPTION_GAPS = 0.
BLOCKED_BY_UPSTREAM_CONTRACT = 0.

## 14. Conformance Evidence Assessment

| Requirement | Implementation classification | Implementation evidence | Test-existence evidence | Test-execution evidence | Evidence status |
| --- | --- | --- | --- | --- | --- |
| DOM-ID-001 | CONTRADICTORY | generic catalog; no persistence; PipelineId authority | productive identity/pipeline tests | 27/27 PASS | WEAKLY_PROVEN |
| DOM-INGEST-001 | PARTIAL | explicit handler; no host-wide guard | productive manual negative | 27/27 PASS; prototype 92/92 separately | WEAKLY_PROVEN |
| DOM-SNAPSHOT-001 | CONTRADICTORY | immutable memory; no durable store; caller basis | productive snapshot tests | 27/27 PASS | WEAKLY_PROVEN |
| DOM-ELIG-001 | CONTRADICTORY | supplied status checked; canonical status not read | supplied-status negatives | 27/27 PASS | WEAKLY_PROVEN |
| DOM-LINEAGE-001 | PARTIAL | relation/ports; no durable repository | productive lineage tests | 27/27 PASS | WEAKLY_PROVEN |
| DOM-LIFE-001 | MISSING | no productive lifecycle | prototype only | 92/92 PASS | NOT_IMPLEMENTED |
| DOM-REV-001 | MISSING | no remediation/invalidation | prototype only | 92/92 PASS | NOT_IMPLEMENTED |
| DOM-IMMUT-001 | MISSING | no ADR immutability/succession | prototype only | 92/92 PASS | NOT_IMPLEMENTED |
| DOM-PIPE-001 | CONTRADICTORY | ordering exists; scalar rehydration violates provenance | ordering tests; no chain test | 27/27 PASS | WEAKLY_PROVEN |
| DOM-STATE-001 | CONTRADICTORY | separation exists; provenance absent | separation tests; no chain test | 27/27 PASS | WEAKLY_PROVEN |
| DOM-CMD-001 | PARTIAL | one handler; generic command/rejection absent | invalid/stale tests | 27/27 PASS | WEAKLY_PROVEN |
| DOM-TICKET-001 | MISSING | no productive model | prototype only | 92/92 PASS | NOT_IMPLEMENTED |
| DOM-TICKET-002 | MISSING | no productive table | prototype only | 92/92 PASS | NOT_IMPLEMENTED |
| DOM-PUB-001 | MISSING | no productive publication model | prototype only | 92/92 PASS | NOT_IMPLEMENTED |
| DOM-ADV-001 | CONTRADICTORY | no verdict/dependency/cancel gate | prototype only | 92/92 PASS | NOT_IMPLEMENTED |
| DOM-AUDIT-001 | MISSING | no cycle identity | prototype only | 92/92 PASS | NOT_IMPLEMENTED |
| DOM-AUDIT-002 | MISSING | no structured closure | prototype only | 92/92 PASS | NOT_IMPLEMENTED |
| DOM-AUDIT-003 | MISSING | no round policy | prototype only | 92/92 PASS | NOT_IMPLEMENTED |
| DOM-AUDIT-004 | MISSING | no final evaluator | prototype only | 92/92 PASS | NOT_IMPLEMENTED |
| DOM-AUDIT-005 | MISSING | no downstream invalidation | prototype only | 92/92 PASS | NOT_IMPLEMENTED |
| DOM-AUDIT-006 | MISSING | no exact candidate gate | prototype only | 92/92 PASS | NOT_IMPLEMENTED |

Executed commands and results:

    node prototype/node_modules/tsx/dist/cli.mjs --test tests/*.test.ts
    PASS — 27 tests, 0 failures, assessed working tree.
    npm --prefix prototype test
    PASS — 92 tests, 0 failures, prototype-only.
    npm --prefix prototype run lint
    PASS — tsc --noEmit.
    npm --prefix prototype run build
    PASS — Vite production build.
    node prototype/node_modules/tsx/dist/cli.mjs prototype/fresh-adversarial-probe.ts
    PASS — FRESH_ADVERSARIAL_PROBE_PASS.
    npm test
    BLOCKED/NOT_AVAILABLE — root package.json is absent; environment limitation only.

## 15. Coverage and Severity Metrics

| Metric | Value |
| --- | ---: |
| TOTAL_NORMATIVE_REQUIREMENTS | 21 |
| TOTAL_CLASSIFIED_REQUIREMENTS | 21 |
| IMPLEMENTED | 0 |
| PARTIAL | 3 |
| MISSING | 12 |
| CONTRADICTORY | 6 |
| NOT_APPLICABLE | 0 |
| OWNED_BY_OTHER_SPEC | 0 |
| UNVERIFIED | 0 |
| TOTAL_DISTINCT_GAPS | 22 |
| BLOCKER_GAPS | 0 |
| MAJOR_GAPS | 22 |
| MINOR_GAPS | 0 |
| EVIDENCE_ONLY_GAPS | 0 |
| PORTFOLIO_OWNERSHIP_VIOLATION_GAPS | 1 |
| FAILURE_SEMANTIC_VIOLATION_GAPS | 1 |
| COMPATIBILITY_VIOLATION_GAPS | 3 |
| DEPENDENCY_INTEGRATION_GAPS | 0 |
| MIXED_OWNERSHIP_REQUIREMENTS | 9 |
| WRONG_OWNER_IMPLEMENTATIONS | 0 |
| IMPLEMENTATION_LOCATION_CONCERNS | 1 |
| UNRESOLVED_OWNERSHIP | 0 |
| UNRESOLVED_MATERIAL_DELTA | 0 |
| UNSUPPORTED_IMPLEMENTED_CLAIMS | 0 |
| KNOWN_FALSE_POSITIVE_GAPS | 0 |
| KNOWN_FALSE_NEGATIVE_GAPS | 0 |

Coverage denominator is the 21 locally owned requirements, including nine
mixed requirements (DOM-SNAPSHOT-001, DOM-IMMUT-001, DOM-PIPE-001,
DOM-STATE-001, DOM-CMD-001, DOM-PUB-001, DOM-ADV-001, DOM-AUDIT-005, and
DOM-AUDIT-006); no pure foreign rows exist. Formula:
IMPLEMENTED / locally or partly owned requirements = 0 / 21 = 0%.

## 16. Material Reliability Checks

| Check | Value | Gate impact |
| --- | --- | --- |
| UNCLASSIFIED_REQUIREMENTS | 0 | pass |
| UNRESOLVED_OWNERSHIP | 0 | pass |
| UNRESOLVED_MATERIAL_DELTA | 0 | pass |
| UNSUPPORTED_IMPLEMENTED_CLAIMS | 0 | pass |
| KNOWN_FALSE_POSITIVE_GAPS | 0 | pass |
| KNOWN_FALSE_NEGATIVE_GAPS | 0 | pass |
| SPECIFICATION_AMBIGUITY | 0 | pass |
| ARCHITECTURAL_AUTHORITY_GAP | 0 | pass |
| PORTFOLIO_AUTHORITY_GAP | 0 | pass |
| SOURCE_SPEC_CONFORMANCE_DRIFT | 0 | pass |
| IDENTITY_AUTHORITY_GAPS | 0 | pass; SPEC audit |
| RECONSTRUCTION_AUTHORITY_GAPS | 0 | pass; SPEC audit |
| REHYDRATION_AUTHORITY_GAPS | 0 | pass; implementation gap only |
| LIFECYCLE_AUTHORITY_GAPS | 0 | pass |
| PERSISTENCE_SEMANTICS_GAPS | 0 | pass; physical absence is implementation state |
| CROSS_SPEC_AUTHORITY_GAPS | 0 | pass |
| SPEC_IMPLEMENTABILITY_CHECK | PASS | pass |
| AUTHORITY_NOT_DEFINED | 0 | pass |
| AUTHORITY_DEFINED_BUT_NOT_CONSUMABLE | 0 | pass |
| AUTHORITY_CONSUMPTION_GAPS | 0 | pass |
| BLOCKED_BY_UPSTREAM_CONTRACT | 0 | pass |
| TEMPORAL_AUTHORITY_GAPS | 0 | pass; not applicable |

All matrix defects are NON_BLOCKING for planning because authority and deltas
are determinate. No PLANNING_BLOCKING matrix defect remains.

## 17. Implementation Readiness

| Gate | Result |
| --- | --- |
| Portfolio decomposition approval | PASS |
| Component SPEC conformance | PASS |
| Upstream SPEC conformance | PASS / not applicable; no upstream |
| SPEC implementability | PASS |
| Every requirement classified exactly once | PASS |
| Every material delta bounded | PASS |
| Ownership/boundary analysis complete | PASS |
| Failure and compatibility ownership checked | PASS |
| Authority consumption classified | PASS |
| Test limitations separated from behavior | PASS |

RESULT: READY_FOR_IMPLEMENTATION_PLAN

## 18. Recommended Next Governance Step

Proceed to the downstream Implementation Plan gate using this matrix as the
authority-to-repository baseline. The plan may decompose the 22 recorded gaps,
but must not reassign ownership or invent identity, lifecycle, provenance,
persistence, failure, or compatibility semantics.

## 19. Completeness Proof

| Proof obligation | Result |
| --- | --- |
| Every normative requirement inventoried | PASS — 21/21 from SPEC §13/§23 |
| Every requirement classified exactly once | PASS — 21/21; zero unclassified |
| Every IMPLEMENTED claim evidenced | PASS — zero IMPLEMENTED claims |
| Every PARTIAL/MISSING/CONTRADICTORY row has exact delta | PASS — linked OBSERVED/REQUIRED/DELTA |
| Every pure foreign row identifies owner | PASS — zero pure foreign rows |
| Every mixed row separates local and foreign obligations | PASS — nine mixed requirements are listed in section 15; boundary fields in records |
| Every Gap has exactly one detail record | PASS — GAP-001 through GAP-022 |
| Every detail record has exactly one severity | PASS — all MAJOR |
| Grouped gaps preserve affected requirements | PASS — GAP-005 and GAP-010 list all affected IDs |
| Severity metrics derive from distinct records | PASS — 0 + 22 + 0 + 0 = 22 |
| Failure ownership checked | PASS — 11 failure families |
| Compatibility ownership checked | PASS — five dimensions |
| Portfolio ownership checked | PASS |
| Test existence and execution distinct | PASS — section 14 |
| SPEC_IMPLEMENTABILITY_CHECK confirmed | PASS — component audit |
| Authority gaps not converted to implementation gaps | PASS |
| Authority consumption/producer-consumer classified | PASS |
| Temporal authority checked where applicable | PASS — not applicable |
| No implementation design introduced | PASS |
| No code/SPEC/portfolio modified | PASS — only matrix artifact |

    TOTAL_NORMATIVE_REQUIREMENTS = 21
    TOTAL_CLASSIFIED_REQUIREMENTS = 21
    UNCLASSIFIED_REQUIREMENTS = 0
    TOTAL_DISTINCT_GAPS = 22
    MIXED_OWNERSHIP_REQUIREMENTS = 9
    UNRESOLVED_OWNERSHIP = 0
    UNRESOLVED_MATERIAL_DELTA = 0
    UNSUPPORTED_IMPLEMENTED_CLAIMS = 0
    KNOWN_FALSE_POSITIVE_GAPS = 0
    KNOWN_FALSE_NEGATIVE_GAPS = 0
    BLOCKER_GAPS = 0
    MAJOR_GAPS = 22
    MINOR_GAPS = 0
    EVIDENCE_ONLY_GAPS = 0
    PORTFOLIO_AUTHORITY_GAP = 0
    ARCHITECTURAL_AUTHORITY_GAP = 0
    SPECIFICATION_AMBIGUITY = 0
    SOURCE_SPEC_CONFORMANCE_DRIFT = 0
    IDENTITY_AUTHORITY_GAPS = 0
    RECONSTRUCTION_AUTHORITY_GAPS = 0
    REHYDRATION_AUTHORITY_GAPS = 0
    LIFECYCLE_AUTHORITY_GAPS = 0
    PERSISTENCE_SEMANTICS_GAPS = 0
    CROSS_SPEC_AUTHORITY_GAPS = 0
    SPEC_IMPLEMENTABILITY_CHECK = PASS

Final readiness result:

    READY_FOR_IMPLEMENTATION_PLAN
