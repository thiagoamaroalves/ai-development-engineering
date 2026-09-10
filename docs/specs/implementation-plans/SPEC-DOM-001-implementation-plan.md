# SPEC-DOM-001 — Implementation Plan

Status: REMEDIATED_PENDING_INDEPENDENT_REAUDIT  
Planning source: validated component Implementation Gap Matrix

This plan defines implementation decomposition only. It does not redefine
ADR, portfolio, SPEC, Gap Matrix, ownership, failure semantics, compatibility
roles, or normative dependency direction. It does not implement code, modify
tests, modify authority artifacts, or create tickets.

## 1. Status

The current independent gates are satisfied:

```text
PORTFOLIO_DECOMPOSITION_APPROVED
PASS — COMPONENT_SPEC_CONFORMANT
GAP_MATRIX_CONFORMANT
READY_FOR_IMPLEMENTATION_PLAN
SPEC_IMPLEMENTABILITY_CHECK = PASS
```

The plan has consumed the latest actionable plan-audit reassessment and awaits
independent `audit-component-implementation-plan`. Future ticket decomposition
is downstream and is not performed here.

## 2. Planning Authority

Authority is applied in this order:

```text
accepted ADRs
  > approved SPEC portfolio decomposition
  > conformant component SPEC
  > conformant upstream component SPECs
  > validated component Implementation Gap Matrix
  > current repository implementation
  > tests
  > prototype / historical evidence
```

| Artifact | Path | Authority result |
| --- | --- | --- |
| Portfolio | `docs/specs/SPEC-PORTFOLIO-001-organization.md` | revision 2; approved decomposition |
| Portfolio audit | `docs/specs/SPEC-PORTFOLIO-001-decomposition-audit.md` | `PORTFOLIO_DECOMPOSITION_APPROVED` |
| Component SPEC | `docs/specs/SPEC-DOM-001-workflow-authority-and-governance.md` | revision 4; `PROPOSED` with conformant audit |
| Component SPEC audit | `docs/specs/audits/SPEC-DOM-001-component-conformance-audit.md` | `PASS — COMPONENT_SPEC_CONFORMANT` |
| Validated Gap Matrix | `docs/specs/gap-matrices/SPEC-DOM-001-implementation-gap-matrix.md` | 21 live gaps; 21 requirements; GAP-002 obsolete historical |
| Gap Matrix audit | `docs/specs/gap-matrices/audits/SPEC-DOM-001-implementation-gap-matrix-audit.md` | `GAP_MATRIX_CONFORMANT`; `READY_FOR_IMPLEMENTATION_PLAN` |

Primary accepted ADR authority is ADR-0001 for identity, ingestion, snapshot,
eligibility, lineage, lifecycle, revision, and immutability; ADR-0002 for
pipeline, state machines, commands, tickets, publication, and advancement;
and ADR-0009 for audit cycles, verdicts, rounds, conformance, invalidation,
and exact evidence. All are revision 3 and accepted. The SPEC also consumes
related accepted ADR-0006 revision 3 for PLAT journal/replay/checkpoint and
physical recovery semantics; it does not change DOM ownership.

## 3. Frozen Baselines

| Baseline | Frozen value |
| --- | --- |
| Portfolio | revision 2; SHA-256 `C449388972279D8ADD520564A9614CFA236F87B6C8932A70D5BC2D28EEF6BE86` |
| Portfolio audit | SHA-256 `120F22D0080AC0640EBBDAD7C460DF5DE2745788CFAEA83A1859F2C577168104` |
| Component SPEC | revision 4; SHA-256 `CB4A21924D9619B8349D6CC239D7998633C402D7EA3D7461C2D4D8498F9A014C` |
| Component SPEC audit | SHA-256 `9BBEA969820F3705354EE6CA76110039F747D9AA60C84E1A19CAE49F01158C15` |
| Accepted ADR-0001 | SHA-256 `33705082B9D2F46E638CD93BDF27CA676CFC6181A2684AD583E4501F5D06D50D` |
| Accepted ADR-0002 | SHA-256 `EF9289C6FCA4BBA73FCA53CA38C71DD19110EB1CFE948358A7CCA1FE14E177D9` |
| Accepted ADR-0009 | SHA-256 `4AB502AEA4F09AFE2C5FA33BFB6C5EE0D11E2D8F9AF65F244209CE1FAC935761` |
| Gap Matrix | SHA-256 `8D8401903F5558C129FCB516F699D7DB40DDFCBF83D52B136AE22CA95976675C` |
| Gap Matrix audit | SHA-256 `445755D48204567770A663A58D23EBCD61C3029653CD3463BD4E34860C517510` |
| Matrix repository baseline | HEAD `baa2a189bd71b85ba9fcc62840e52f091fc2e77e`; src/tests fingerprint `F4F18AB5AD103DC0D1C4B2E7077E69EA081EF5FC3258A4735E2E2A767269BB01` |
| Test execution baseline | `node prototype/node_modules/tsx/dist/cli.mjs --test tests/*.test.ts`; 33 tests, 0 failures |
| Current HEAD | `baa2a189bd71b85ba9fcc62840e52f091fc2e77e` |
| Working tree | dirty; current relevant `src/` and `tests/` content is the assessed evidence |

No normative upstream component SPEC is required by DOM: DOM is the approved
root of the normative component DAG. Downstream contracts are consumed at
integration boundaries and do not supply missing DOM authority.

## 4. Baseline Drift Assessment

```text
AUTHORITY_DRIFT = REASSESSED_AND_RECONCILED
IMPLEMENTATION_DRIFT = ASSESSED_AGAINST_CURRENT_MATRIX_BASELINE
PLANNING_DRIFT = RECONCILED_PENDING_INDEPENDENT_REAUDIT
BASELINE_DRIFT_STATUS = DRIFT_ASSESSED
REASSESSMENT_COMPLETE = YES
FINDINGS_ARE_ACTIONABLE = YES
BASELINE_REMEDIATION_READINESS = READY
AUDIT_BASIS_FINGERPRINT = A58E38A1153084122AA291763BABA40159D35671CE001487B5182B4BD55514DD
```

The plan adopted the current revision-4 SPEC, current conformant Gap Matrix,
current repository/test evidence, and the complete baseline reassessment from
the latest independent plan audit. The Gap Matrix was not regenerated or
modified during this remediation. GAP-002 remains historical only; GAP-001 and
DOM-ID-001 retain the current `PARTIAL` classification.

## 5. Validated Gap Intake

Every live Gap is listed exactly once below. Classification and severity are
reconciled to the current validated Matrix; GAP-002 is preserved separately as
historical only.

| Gap | Requirement(s) | Obligation(s) | Classification | Severity | Validated delta |
| --- | --- | --- | --- | --- | --- |
| GAP-001 | DOM-ID-001 | O-001 | PARTIAL | MAJOR | Generic catalog exists and current pipeline uses canonical STAGE reference; durable identity, persistence, and historical resolution remain absent. |
| GAP-003 | DOM-INGEST-001 | O-002 | PARTIAL | MAJOR | Explicit handler exists, but no host-wide guarantee prevents discovery/session initiation. |
| GAP-004 | DOM-SNAPSHOT-001 | O-003 | CONTRADICTORY | MAJOR | Snapshot is immutable in memory but has no durable persistence/recovery boundary. |
| GAP-005 | DOM-SNAPSHOT-001, DOM-ELIG-001 | O-003, O-004 | CONTRADICTORY | MAJOR | Caller-supplied status/hash can bypass canonical ADR lifecycle and content authority. |
| GAP-006 | DOM-LINEAGE-001 | O-005 | PARTIAL | MAJOR | Lineage relation and ports exist, but no concrete durable catalog exists. |
| GAP-007 | DOM-LIFE-001 | O-006 | MISSING | MAJOR | No productive separation of decision and realization lifecycles. |
| GAP-008 | DOM-REV-001 | O-007 | MISSING | MAJOR | No productive ADR remediation revision, lineage preservation, or derived invalidation. |
| GAP-009 | DOM-IMMUT-001 | O-008 | MISSING | MAJOR | No productive implemented-ADR immutability, reciprocal succession, or evidence-record boundary. |
| GAP-010 | DOM-PIPE-001, DOM-STATE-001 | O-009, O-010 | CONTRADICTORY | MAJOR | Scalar later-state rehydration bypasses complete immediate-transition provenance. |
| GAP-011 | DOM-CMD-001 | O-011 | PARTIAL | MAJOR | One pipeline handler has checks, but generic command coverage and rejection recording are absent. |
| GAP-012 | DOM-CMD-001 | O-011 | PARTIAL | MAJOR | Local failure codes are not yet the complete canonical DOM failure boundary. |
| GAP-013 | DOM-ADV-001 | O-015 | CONTRADICTORY | MAJOR | Advancement can occur without formal verdict, dependency closure, or cooperative cancellation. |
| GAP-014 | DOM-TICKET-001 | O-012 | MISSING | MAJOR | No productive six-state ticket aggregate. |
| GAP-015 | DOM-TICKET-002 | O-013 | MISSING | MAJOR | No productive eight-transition ticket table and rejection recorder. |
| GAP-016 | DOM-PUB-001 | O-014 | MISSING | MAJOR | No productive publication vocabulary or DOM/GIT evidence boundary. |
| GAP-017 | DOM-AUDIT-001 | O-049 | MISSING | MAJOR | No productive artifact/cycle/round identity registry. |
| GAP-018 | DOM-AUDIT-002 | O-050 | MISSING | MAJOR | No productive structured-verdict closure command. |
| GAP-019 | DOM-AUDIT-003 | O-051 | MISSING | MAJOR | No productive configurable ten-round limit, affected-unit pause, or explicit continuation. |
| GAP-020 | DOM-AUDIT-004 | O-052 | MISSING | MAJOR | No productive final conformance evaluator. |
| GAP-021 | DOM-AUDIT-005 | O-053 | MISSING | MAJOR | No productive selective downstream invalidation/cutover without reopening completed tickets. |
| GAP-022 | DOM-AUDIT-006 | O-054 | MISSING | MAJOR | No productive exact base/head/tree binding or hash-linked drift gate. |

`GAP-002` is preserved as `OBSOLETE_HISTORICAL` outside the live intake. Its
productive parallel `PipelineId` authority was removed before this plan
baseline; the ID is not reused, and that historical closure does not prove
durable identity, persistence, or historical resolution.

## 6. Planning Ownership Classification

| Planning type | Gaps | Treatment |
| --- | --- | --- |
| `LOCAL_IMPLEMENTATION_WORK` | GAP-001, GAP-003, GAP-005, GAP-007, GAP-009, GAP-011, GAP-012, GAP-014, GAP-015, GAP-017, GAP-018, GAP-019 | Implement DOM-owned meaning, invariants, commands, and lifecycle boundaries. |
| `INTEGRATION_OR_CONVERGENCE_WORK` | GAP-004, GAP-006, GAP-008, GAP-010, GAP-013, GAP-016, GAP-020, GAP-021, GAP-022 | Implement DOM-owned boundary behavior and consume foreign evidence without moving foreign ownership. |
| `CROSS_SPEC_DEPENDENCY` | None as a primary gap type | Foreign contracts are explicit prerequisites for integration, not local lifecycle work. |
| `PREEXISTING_FOREIGN_CAPABILITY` | None | No completed productive foreign capability was found. |
| `TEST_OR_CONFORMANCE_WORK` | None as a primary gap type | Tests and conformance are closure evidence for behavior units. |
| `NO_LOCAL_WORK` | None | All validated gaps have a local DOM contribution. |

## 7. Repository Planning Evidence

| Evidence | Planning interpretation | Action |
| --- | --- | --- |
| `src/domain/identity.ts` | Productive identity catalog/value objects and revision checks exist. | REUSE_AND_EXTEND; preserve the absence of a productive parallel authority. |
| `src/domain/snapshot.ts` | Productive immutable snapshot and eligibility policy exist in memory. | REUSE_AND_EXTEND; add canonical authority boundary. |
| `src/domain/lineage.ts` | Productive immutable relation/progress contract and ports exist. | REUSE_AND_EXTEND; connect durable owner contract. |
| `src/domain/pipeline.ts` | Productive ordered pipeline, state inputs, scalar rehydration, and CAS exist. | REFACTOR_IN_PLACE; replace contradictory rehydration authority. |
| `src/application/snapshot.ts`, `lineage.ts`, `pipeline.ts` | Application handlers expose the current productive slice. | EXTEND with canonical commands and boundary mapping. |
| `tests/dom-001-ticket-001.test.ts`, `dom-001-ticket-002.test.ts`, `dom-001-ticket-004.test.ts` | 33 productive tests prove the current slice, not full SPEC conformance. | RETAIN and extend with direct witnesses. |
| `prototype/src/mockDomain.ts`, prototype tests | In-memory scenario vocabulary; explicit README non-authority. | REUSE only as test-case inspiration; never as productive authority. |
| No productive persistence/API/adapter/migration/runtime host | Foreign physical capabilities are absent. | Add typed integration seams; do not implement foreign ownership in DOM. |

Expected Repository Impact is planning guidance, not normative design authority.
Likely areas are `src/domain`, `src/application`, productive tests, and typed
ports/adapters at DOM/PLAT/GIT/EXEC/BACKEND/OPS/UI boundaries. Concrete internal
layout remains for implementation design.

## 8. Reuse Assessment

| Surface | Assessment |
| --- | --- |
| Productive identity/snapshot/lineage/pipeline slice | `REUSE_AND_EXTEND` where behavior agrees with the SPEC; preserve immutable value semantics. |
| Historical `PipelineId` authority and scalar pipeline rehydration | Preserve the absence of the obsolete productive authority; replace contradictory scalar rehydration so it cannot bypass provenance. |
| Prototype centralized domain | `REUSE_UNCHANGED` as disposable evidence only; never promote it. |
| PLAT persistence/journal/recovery | `ADD_INTEGRATION_SEAM`; PLAT owns storage, ordering, physical integrity, and recovery mechanics. |
| EXEC sessions/assignments | `ADD_INTEGRATION_SEAM`; EXEC owns execution/session capability. |
| GIT publication evidence | `ADD_INTEGRATION_SEAM`; GIT owns push, PR, merge, and remote confirmation. |
| REPO legacy adaptation | `ADD_INTEGRATION_SEAM`; REPO owns legacy compatibility and retirement. |
| BACKEND/OPS/UI mappings | `ADD_INTEGRATION_SEAM`; mappings cannot become canonical authority. |

## 9. Implementation Units

The twelve stable units preserve coherent boundaries from the prior plan while
correcting current Gap IDs and classifications. `UNIT_FORMATION_REASON` is
shown for each unit; no unit is a synthetic proof-only unit.

## DOM-IMP-01 — Canonical identity and lineage authority

`UNIT_FORMATION_REASON = SHARED_AUTHORITY + SHARED_PERSISTENCE_BOUNDARY`.

### Goal

Make DOM canonical identity and ADR↔SPEC lineage locally authoritative,
stable, resolvable, immutable, and independently progressable.

### Authority and Ownership

- Primary component SPEC: `SPEC-DOM-001` §§12.1, 13 (`DOM-ID-001`, `DOM-LINEAGE-001`).
- Portfolio obligations: `O-001`, `O-005`; approved role `CANONICAL_OWNER`.
- Local ownership: identity meaning, canonical `STAGE` reference, lineage meaning and progress.
- Foreign capabilities: PLAT physical persistence and recovery only.
- Authority Consumption Proof: `ACP-DOM-01`; DOM authority is local and consumable from the conformant SPEC.
- Producer / Consumer Contract Proof: `PCP-PLAT-01`; PLAT produces durable identity/lineage storage contract for DOM consumption.
- Authority consumption result: `AUTHORITY_CONSUMABLE`; no upstream normative authority is missing.
- Availability condition: local semantic tests may use a contract fixture; durable integrated proof waits for the PLAT contract.

### Gap Matrix Coverage

`GAP-001`, `GAP-006`; requirements `DOM-ID-001`, `DOM-LINEAGE-001`;
acceptance `AC-DOM-001`, `AC-DOM-005`.

### Portfolio Obligation Coverage

`O-001`, `O-005`.

### Validated Delta

```text
OBSERVED: identity catalog/value objects and lineage ports exist in memory;
          canonical STAGE reference is already the productive pipeline identity;
          no durable catalog exists.
REQUIRED: canonical STAGE identity and explicit many-to-many lineage remain
          resolvable, immutable, historically addressable, and independently progressing.
DELTA:    add/extend the local canonical contract and expose the PLAT persistence
          seam; preserve the absence of a productive parallel PipelineId authority.
```

### Required Behavior

`LOCAL_BEHAVIOR`: commands, lookup, persistence representation, rehydration, and
equality use `CanonicalIdentityReference(kind=STAGE, scope=ExecutionId,
value=StageId)`; lineage relations are explicit and isolated.
`END_TO_END_CONTRIBUTION`: PLAT can persist/recover the same identity and
lineage without acquiring semantic ownership.

### Does Not Implement

Physical database, journal, indexes, recovery mechanics, agent/session identity,
or downstream projections.

### Repository Evidence

`src/domain/identity.ts`, `src/domain/lineage.ts`, `src/application/lineage.ts`,
and `tests/dom-001-ticket-001.test.ts`. REUSE identity/value semantics; EXTEND
lineage persistence contract; preserve the absence of a productive PipelineId
authority.

### Expected Repository Impact

`src/domain/identity.ts`, `src/domain/lineage.ts`, application commands, PLAT
port definitions, and productive identity/lineage tests.

### Implementation Constraints

Preserve identity kind/scope/revision, distinguish operational correlation,
reject unknown or incompatible references, preserve many-to-many progress, and
preserve the absence of a productive parallel `PipelineId` lookup or persistence
authority. Historical GAP-002 closure is not durable identity proof.

### Internal Prerequisites

None.

### Cross-Spec Prerequisites

| Owner SPEC | Required capability | Implementation state | Blocking? |
| --- | --- | --- | --- |
| SPEC-PLAT-001 | durable identity/lineage persistence and recovery | not yet productive | No for local contract closure; Yes for integrated durability proof |

### Producer / Consumer Contract Proof

`PCP-PLAT-01`: producer `SPEC-PLAT-001`; contract durable canonical identity,
lineage records, revision transport, and recovery result; authority owner DOM;
consumer this unit; availability is a productive PLAT repository plus contract
tests; dependency edge is `PLAT persistence → DOM rehydration`.

### Temporal Authority Preconditions

Not applicable to an external effect. Identity revision and lineage revision
must be carried through lookup and CAS; stale references fail closed.

### Acceptance Criteria

1. Canonical identity is created, looked up, persisted/retrieved through the
   port, compared, and rejected for unknown kind/scope/revision.
2. `PipelineId` cannot create an independent lookup or persisted identity.
3. Two ADR↔SPEC relations progress independently and remain queryable after
   rehydration. `LOCAL_PROVABILITY = YES` for each criterion.

### Acceptance Witness Matrix

| Normative behavior | Operation | Positive witness | Negative/isolation witness | Evidence | Owner |
| --- | --- | --- | --- | --- | --- |
| Canonical identity | create/lookup/rehydrate | `tests/dom-001-ticket-001.test.ts` extended | unknown kind, scope, revision, parallel `PipelineId` | productive identity test report | DOM-IMP-01 |
| Independent lineage | add/progress/query relation | lineage application command | duplicate relation and cross-SPEC progress isolation | productive lineage test report | DOM-IMP-01 |

### Local Closure

`LOCAL_CLOSURE = YES`; all criteria use the current domain seam and contract
fixtures, and no downstream unit is required to prove local identity meaning.

### Required Tests

Unit/domain identity, immutability, historical lookup, lineage isolation,
duplicate rejection, rehydration, stale revision, and concurrency/idempotency
tests. Integration evidence is checkpointed separately.

### Legacy / Cutover Impact

`PRESERVE_HISTORICAL_RECONCILIATION`: the removed productive `PipelineId`
authority remains historical evidence only; historical reads use explicit mapping
where required, and no new implementation Gap is created for GAP-002.

### Completion Evidence

Canonical identity/lineage commands and ports, no parallel authority path,
direct positive/negative tests, and a passing contract fixture report.

### Risks

Identity alias promotion, durable revision mismatch, and lineage progress
leaking across SPECs.

### Issue Decomposition Readiness

`ISSUE_READY`; `READINESS_CLASSIFICATION = READY`.

### Initial DAG State

`READY`.

## DOM-IMP-02 — Manual entry, snapshot, and eligibility boundary

`UNIT_FORMATION_REASON = SHARED_AUTHORITY + SHARED_INTEGRATION_SEAM`.

### Goal

Make explicit manual submission the only local processing trigger and freeze an
immutable snapshot from independently resolved canonical ADR authority.

### Authority and Ownership

- Primary SPEC: `SPEC-DOM-001` §§13 (`DOM-INGEST-001`, `DOM-SNAPSHOT-001`, `DOM-ELIG-001`).
- Obligations: `O-002`, `O-003`, `O-004`; role `CANONICAL_OWNER`.
- Local ownership: trigger, eligibility, snapshot meaning, exact version/hash binding.
- Foreign capabilities: EXEC contract versions, PLAT durable storage, REPO legacy input.
- Authority Consumption Proof: `ACP-DOM-02`; ADR lifecycle/revision authority is consumed through the DOM catalog, not caller fields.
- Producer / Consumer Contract Proof: `PCP-EXEC-01` for exact skill/contract metadata; `PCP-PLAT-02` for durable snapshot material.
- Authority consumption result: `AUTHORITY_CONSUMABLE`; availability is a known integration prerequisite, not a missing authority decision.

### Gap Matrix Coverage

`GAP-003`, `GAP-004`, `GAP-005`; requirements `DOM-INGEST-001`,
`DOM-SNAPSHOT-001`, `DOM-ELIG-001`; acceptance `AC-DOM-002`–`AC-DOM-004`.

### Portfolio Obligation Coverage

`O-002`, `O-003`, `O-004`.

### Validated Delta

```text
OBSERVED: explicit handler and immutable in-memory snapshot exist; caller can
          supply status/hash; durable snapshot and host-wide trigger guard absent.
REQUIRED: manual command is the sole start, canonical ACCEPTED ADR revisions are
          resolved, and exact immutable snapshot material survives recovery.
DELTA:    replace caller authority with canonical resolution and expose exact
          snapshot/version persistence contract.
```

### Required Behavior

`LOCAL_BEHAVIOR`: reject discovery/session starts; resolve ADR status/revision
from canonical authority; freeze hashes, base, configuration, and exact
versions; reject later authority drift.
`END_TO_END_CONTRIBUTION`: PLAT stores/recoveries the frozen record and EXEC
supplies exact version metadata.

### Does Not Implement

ADR registry ownership outside DOM, physical persistence/recovery, repository
bootstrap, scheduler/session execution, or UI trigger presentation.

### Repository Evidence

`src/application/snapshot.ts`, `src/domain/snapshot.ts`, and
`tests/dom-001-ticket-002.test.ts`. REUSE immutable value objects; EXTEND
canonical reader and manual-trigger boundary; RETIRE caller-authority path.

### Expected Repository Impact

Snapshot/eligibility domain and application commands, repository ports, and
manual/authority-drift tests.

### Implementation Constraints

Fail closed for unknown/non-accepted/inelegible revisions; snapshot is
immutable; caller values are never promoted to truth; no automatic discovery.

### Internal Prerequisites

`DOM-IMP-01`.

### Cross-Spec Prerequisites

| Owner SPEC | Required capability | Implementation state | Blocking? |
| --- | --- | --- | --- |
| SPEC-EXEC-001 | exact skill/contract version metadata | not yet productive | No for local contract closure; Yes for integrated snapshot proof |
| SPEC-PLAT-001 | durable snapshot, journal, and recovery | not yet productive | No for local contract closure; Yes for integrated durability proof |
| SPEC-REPO-001 | legacy/manual input mapping | not yet productive | No; mapping remains foreign |

### Producer / Consumer Contract Proof

`PCP-EXEC-01`: EXEC-001 produces exact version/capability values; DOM consumes
and stores them in the snapshot. `PCP-PLAT-02`: PLAT produces durable snapshot
and recovery material; DOM validates semantic immutability. Both are known
contracts with downstream implementation pending.

### Temporal Authority Preconditions

`TEMPORAL_AUTHORITY_PROOF = TAP-02`: initial ADR status/hash/revision
observation; mutation window before snapshot commit; independent second
observation; drift detection; fail-closed rejection; state preservation; DOM
owns semantic validation and PLAT owns physical atomicity.

### Acceptance Criteria

1. Only an explicit manual command starts processing; discovery and session
   state alone cannot start it.
2. Snapshot resolves current canonical accepted ADR data, stores exact required
   fields, and rejects false caller status/hash or later drift.
3. Rehydration returns the same immutable basis and rejects corrupt/missing
   material. `LOCAL_PROVABILITY = YES` using contract fixtures.

### Acceptance Witness Matrix

| Normative behavior | Operation | Positive witness | Negative/isolation witness | Evidence | Owner |
| --- | --- | --- | --- | --- | --- |
| Manual trigger | submit command | explicit submission test | discovery/session-start attempt | application test report | DOM-IMP-02 |
| Canonical eligibility | resolve/freeze snapshot | accepted revision snapshot | proposed, superseded, false caller status/hash | snapshot test report | DOM-IMP-02 |
| Immutable basis | rehydrate/mutate | exact field round-trip | mutation, drift, corrupt/missing record | persistence contract fixture | DOM-IMP-02 |

### Local Closure

`LOCAL_CLOSURE = YES`; local semantics and rejection behavior are proven with
approved port fixtures; physical PLAT proof is an integration checkpoint.

### Required Tests

Manual-entry negative tests, accepted-only matrix, caller-authority bypass,
mutation-window drift, immutable snapshot, exact version transport,
rehydration, corruption/missing material, idempotency, and stale revision.

### Legacy / Cutover Impact

`ADD_COMPATIBILITY_MAPPING` for historical input; `RETIRE_LEGACY_WRITES` for
caller-supplied status/hash as authority. Legacy reads remain explicit.

### Completion Evidence

Canonical snapshot command, authority reader/port, direct positive/negative
tests, and a contract fixture proving exact persisted fields.

### Risks

Caller authority bypass, snapshot drift, and confusing EXEC version metadata
with ADR lifecycle authority.

### Issue Decomposition Readiness

`ISSUE_READY`; `READINESS_CLASSIFICATION = READY`.

### Initial DAG State

`BLOCKED`; `BLOCKED_BY = DOM-IMP-01`.

## DOM-IMP-03 — Decision lifecycle, revision, and immutability

`UNIT_FORMATION_REASON = SHARED_CUTOVER + SHARED_INVARIANT`.

### Goal

Implement separate decision/realization lifecycle semantics, ADR remediation
revision, immutable implemented ADRs, reciprocal succession, and history-safe
cutover.

### Authority and Ownership

- Primary SPEC: `SPEC-DOM-001` §§13 (`DOM-LIFE-001`, `DOM-REV-001`, `DOM-IMMUT-001`).
- Obligations: `O-006`, `O-007`, `O-008`; role `CANONICAL_OWNER`.
- Local ownership: decision lifecycle, revision, succession, and invalidation meaning.
- Foreign capabilities: PLAT operational records; REPO legacy adaptation; downstream approval mappings.
- Authority Consumption Proof: `ACP-DOM-03`; authority is fully defined by ADR-0001/SPEC §§12–13.
- Producer / Consumer Contract Proof: `PCP-PLAT-03` for operational evidence; no foreign lifecycle is consumed as DOM authority.
- Authority consumption result: `AUTHORITY_CONSUMABLE`.

### Gap Matrix Coverage

`GAP-007`, `GAP-008`, `GAP-009`; requirements `DOM-LIFE-001`, `DOM-REV-001`,
`DOM-IMMUT-001`; acceptance `AC-DOM-006`–`AC-DOM-008`.

### Portfolio Obligation Coverage

`O-006`, `O-007`, `O-008`.

### Validated Delta

```text
OBSERVED: no productive ADR lifecycle, remediation revision, succession, or
          implemented immutability boundary exists.
REQUIRED: decision and realization lifecycles stay separate; changed accepted
          ADRs receive new revision/history; implemented ADRs cannot be rewritten.
DELTA:    add the DOM lifecycle/cutover authority and connect operational
          evidence without putting that evidence in the ADR document.
```

### Required Behavior

`LOCAL_BEHAVIOR`: authorized lifecycle transitions, revision/successor linkage,
derived eligibility invalidation, and mutation rejection are enforced.
`END_TO_END_CONTRIBUTION`: consumers observe linked history and obsolete
derived decisions without reopening completed work.

### Does Not Implement

Physical evidence storage, REPO migration mechanics, downstream approval
registries, execution lifecycle, Git publication, or ticket reopening.

### Repository Evidence

`src/domain/identity.ts` revision primitives are reusable only as supporting
value semantics; no ADR lifecycle exists. Prototype mutation/succession tests
are scenario references only. ADD_NEW_CAPABILITY in the productive domain.

### Expected Repository Impact

New/extended DOM lifecycle and revision modules, application commands, and
history/cutover tests; PLAT/REPO mapping ports.

### Implementation Constraints

No silent rewrite, reciprocal succession required, prior history preserved,
derived eligibility invalidated, operational metadata stays outside ADR text.

### Internal Prerequisites

`DOM-IMP-01`, `DOM-IMP-02`.

### Cross-Spec Prerequisites

| Owner SPEC | Required capability | Implementation state | Blocking? |
| --- | --- | --- | --- |
| SPEC-PLAT-001 | durable operational evidence | not yet productive | No for local semantic closure |
| SPEC-REPO-001 | legacy revision/adaptation | not yet productive | No; local cutover contract is deterministic |

### Producer / Consumer Contract Proof

`PCP-PLAT-03`: PLAT produces persistent operational evidence keyed by DOM
identity/revision; DOM consumes only the record reference. `PCP-REPO-01`:
REPO produces legacy mapping; DOM consumes mapped canonical references.

### Temporal Authority Preconditions

`TAP-03`: observe accepted ADR revision/content before remediation, reobserve
at commit, reject if revision/content changed, preserve prior state, and let
DOM own semantic invalidation while PLAT owns atomic record storage.

### Acceptance Criteria

1. Decision and realization lifecycle operations are independent and cannot
   silently mutate one another.
2. Remediation produces a new revision with reciprocal lineage and invalidates
   derived eligibility.
3. Implemented ADR mutation is rejected and operational fields remain in the
   persistent record boundary. `LOCAL_PROVABILITY = YES`.

### Acceptance Witness Matrix

| Normative behavior | Operation | Positive witness | Negative/isolation witness | Evidence | Owner |
| --- | --- | --- | --- | --- | --- |
| Separate lifecycles | decision/realization commands | independent transitions | execution attempting decision mutation | lifecycle test report | DOM-IMP-03 |
| Revision/cutover | remediate accepted ADR | successor/history result | stale eligibility and missing reciprocal link | revision test report | DOM-IMP-03 |
| Immutability | update implemented ADR | rejection record | document metadata mutation attempt | immutability test report | DOM-IMP-03 |

### Local Closure

`LOCAL_CLOSURE = YES`; all local transitions and invalidation semantics are
testable without a physical store or downstream approval implementation.

### Required Tests

Lifecycle isolation, valid/invalid transitions, revision lineage, eligibility
invalidation, reciprocal succession, immutable implemented ADR, metadata
boundary, stale replay, and idempotency tests.

### Legacy / Cutover Impact

`PRESERVE_LEGACY_READS`; `RETIRE_LEGACY_WRITES` for silent ADR mutation;
REPO-owned legacy adaptation remains external.

### Completion Evidence

Lifecycle/revision aggregate and commands, history-safe records, direct
positive/negative tests, and cutover mapping contract.

### Risks

Lifecycle conflation, history overwrite, and treating operational hashes as
normative ADR document content.

### Issue Decomposition Readiness

`ISSUE_READY`; `READINESS_CLASSIFICATION = READY`.

### Initial DAG State

`BLOCKED`; `BLOCKED_BY = DOM-IMP-01, DOM-IMP-02`.

## DOM-IMP-04 — Pipeline state machines and provenance reconstruction

`UNIT_FORMATION_REASON = SHARED_INVARIANT + SHARED_PERSISTENCE_BOUNDARY`.

### Goal

Enforce canonical pipeline order, separate state machines, and fail-closed
rehydration from a complete immediate-transition provenance chain.

### Authority and Ownership

- Primary SPEC: `SPEC-DOM-001` §§12.1, 13 (`DOM-PIPE-001`, `DOM-STATE-001`).
- Obligations: `O-009`, `O-010`; role `CANONICAL_OWNER`.
- Local ownership: progression semantics, state separation, reconstruction validity.
- Foreign capability: PLAT journal/replay and physical integrity.
- Authority Consumption Proof: `ACP-DOM-04`; identity and reconstruction proofs are complete in component audit §§17–18.
- Producer / Consumer Contract Proof: `PCP-PLAT-04`.
- Authority consumption result: `AUTHORITY_CONSUMABLE`; no semantic meaning is delegated to `PipelineRevision` alone.

### Gap Matrix Coverage

`GAP-010`; requirements `DOM-PIPE-001`, `DOM-STATE-001`; acceptance
`AC-DOM-009`, `AC-DOM-010`.

### Portfolio Obligation Coverage

`O-009`, `O-010`.

### Validated Delta

```text
OBSERVED: canonical ordering and state inputs exist, but scalar stage/revision
          rehydration accepts later state without creation/predecessor chain.
REQUIRED: every restored later state has complete immutable immediate-transition
          provenance, exact identity/revision continuity, and no skipped state.
DELTA:    replace scalar-authority restoration with semantic chain validation.
```

### Required Behavior

`LOCAL_BEHAVIOR`: create only at initial stage; rehydrate later stages only after
validating identity, predecessor, immediate successor, ordered chain, revision
continuity, and final snapshot match.
`END_TO_END_CONTRIBUTION`: PLAT supplies append-only records and detects physical
corruption; DOM decides semantic validity.

### Does Not Implement

PLAT journal/database/replay mechanics, scheduler execution, Git integration,
or higher-level ticket/audit state machines.

### Repository Evidence

`src/domain/pipeline.ts` and `tests/dom-001-ticket-004.test.ts`. REUSE ordering
and state separation; REPLACE scalar rehydration authority; EXTEND ports with
provenance contract.

### Expected Repository Impact

`src/domain/pipeline.ts`, repository port types, application restoration command,
and direct skip/forgery/divergence tests.

### Implementation Constraints

Canonical `STAGE` identity, append-only immediate predecessors, no formula-based
progression, no setter/direct state assignment, fail closed on any gap.

### Internal Prerequisites

`DOM-IMP-01`.

### Cross-Spec Prerequisites

| Owner SPEC | Required capability | Implementation state | Blocking? |
| --- | --- | --- | --- |
| SPEC-PLAT-001 | ordered provenance/journal/replay material | not yet productive | No for semantic contract tests; Yes for integrated recovery proof |

### Producer / Consumer Contract Proof

`PCP-PLAT-04`: PLAT produces ordered append-only transition records with
identity, predecessor/result stages, revisions, and integrity status; DOM
consumes and semantically validates them; dependency edge is
`PLAT provenance → DOM rehydration`.

### Temporal Authority Preconditions

Not an external effect. The rehydration input is a single immutable candidate;
all chain records and final snapshot are independently validated before state
materialization, with fail-closed rejection.

### Acceptance Criteria

1. Valid chain rehydrates the exact later state.
2. Missing predecessor, skip, duplicate/out-of-order, revision divergence,
   identity mismatch, and forged later state are rejected with no mutation.
3. Separate aggregate state machines cannot be combined into an implicit
   transition. `LOCAL_PROVABILITY = YES`.

### Acceptance Witness Matrix

| Normative behavior | Operation | Positive witness | Negative/isolation witness | Evidence | Owner |
| --- | --- | --- | --- | --- | --- |
| Ordered pipeline | advance/rehydrate | immediate valid chain | skipped phase and later-stage shortcut | pipeline test report | DOM-IMP-04 |
| Reconstruction | rehydrate | complete chain | missing, duplicate, reordered, divergent, forged chain | provenance test report | DOM-IMP-04 |

### Local Closure

`LOCAL_CLOSURE = YES`; contract fixtures provide records and all semantic
rejection cases are local. Durable replay is integrated evidence only.

### Required Tests

Ordering bypass, state-machine separation, valid-chain rehydration, skip,
missing predecessor, duplicate/order, revision continuity, identity mismatch,
snapshot divergence, forged state, stale state, and no-effect tests.

### Legacy / Cutover Impact

`REMOVE_ALTERNATE_AUTHORITY`: scalar restoration is no longer canonical;
historical records require a complete chain or fail closed.

### Completion Evidence

Rehydration validator, port contract, direct chain witness matrix, and passing
negative tests for every listed invalid history shape.

### Risks

Treating CAS or `PipelineRevision` as causal proof, accepting a projected
stage, or allowing PLAT to invent semantic predecessors.

### Issue Decomposition Readiness

`ISSUE_READY`; `READINESS_CLASSIFICATION = READY`.

### Initial DAG State

`BLOCKED`; `BLOCKED_BY = DOM-IMP-01`.

## DOM-IMP-05 — Canonical commands and failure semantics

`UNIT_FORMATION_REASON = SHARED_COMMAND_BOUNDARY`.

### Goal

Make every DOM command validate canonical preconditions, record rejection
meaning, and preserve state/effect immutability across mappings.

### Authority and Ownership

- Primary SPEC: `SPEC-DOM-001` §13 (`DOM-CMD-001`).
- Obligation: `O-011`; role `CANONICAL_OWNER`.
- Local ownership: command preconditions and canonical failure meaning.
- Foreign capabilities: PLAT journal; BACKEND/OPS/UI transport/log/presentation mappings.
- Authority Consumption Proof: `ACP-DOM-05`.
- Producer / Consumer Contract Proof: `PCP-PLAT-05`, `PCP-BACKEND-01`.
- Authority consumption result: `AUTHORITY_CONSUMABLE`.

### Gap Matrix Coverage

`GAP-011`, `GAP-012`; requirement `DOM-CMD-001`; acceptance `AC-DOM-011`.

### Portfolio Obligation Coverage

`O-011`.

### Validated Delta

```text
OBSERVED: pipeline handler checks identity/target/CAS and emits local error
          names; generic command coverage, journal recording, and canonical mapping absent.
REQUIRED: all command families validate identity/revision/state/dependency/verdict,
          reject and record canonical reasons, and cause no state/effect change.
DELTA:    extend command boundary and canonical failure taxonomy without moving
          physical recording or transport ownership into DOM.
```

### Required Behavior

`LOCAL_BEHAVIOR`: command dispatcher/precondition policies return canonical
accept/reject outcomes and no-effect guarantees. `END_TO_END_CONTRIBUTION`:
PLAT records and BACKEND/OPS/UI map the same meaning.

### Does Not Implement

Transport envelopes, HTTP/auth, physical journal, retry executor, or UI/OPS
presentation.

### Repository Evidence

`src/application/pipeline.ts`, `src/domain/snapshot.ts`, and productive pipeline
tests. REUSE current CAS checks; EXTEND command family and failure result;
ADD_INTEGRATION_SEAM for mappings.

### Expected Repository Impact

Domain failure types, application command handlers, ports, and command/failure
mapping tests.

### Implementation Constraints

Invalid commands are recorded and no-op; canonical reason names are stable;
mapping layers cannot rename or reinterpret retryability/terminality.

### Internal Prerequisites

`DOM-IMP-01`, `DOM-IMP-04`.

### Cross-Spec Prerequisites

| Owner SPEC | Required capability | Implementation state | Blocking? |
| --- | --- | --- | --- |
| SPEC-PLAT-001 | rejection journal and idempotent record | not yet productive | No for local result contract |
| SPEC-BACKEND-001 | transport/security mapping | not yet productive | No for local semantics |
| SPEC-OPS-001 / SPEC-UI-001 | logging/presentation projections | not yet productive | No |

### Producer / Consumer Contract Proof

`PCP-PLAT-05`: PLAT produces durable command/rejection record; DOM produces
semantic result. `PCP-BACKEND-01`: BACKEND consumes the canonical result and
maps it without changing reason or state.

### Temporal Authority Preconditions

Before commit, revalidate canonical identity/revision/state and dependency
version; stale or changed basis rejects with no effect. The local command
contract owns semantic validation; physical CAS/journal belongs to PLAT.

### Acceptance Criteria

1. Valid and invalid commands return deterministic canonical outcomes.
2. Invalid, stale, dependency-closed, and verdict-incompatible commands create
   no state/effect mutation and expose a canonical reason.
3. All five DOM-owned failure families map without semantic change.
   `LOCAL_PROVABILITY = YES`.

### Acceptance Witness Matrix

| Normative behavior | Operation | Positive witness | Negative/isolation witness | Evidence | Owner |
| --- | --- | --- | --- | --- | --- |
| Command preconditions | execute each command family | valid transition result | stale/invalid/closed/verdict mismatch | command test report | DOM-IMP-05 |
| Failure meaning | map result | stable code/flags | mapping rename or retry mutation | mapping contract report | DOM-IMP-05 |

### Local Closure

`LOCAL_CLOSURE = YES`; mapping is tested with contract doubles and no transport
or journal implementation is required for local semantic closure.

### Required Tests

Command positive/negative/no-effect, stale protection, idempotency, rejection
record contract, five DOM failure families, and BACKEND/OPS/UI mapping tests.

### Legacy / Cutover Impact

`REMOVE_ALTERNATE_AUTHORITY`: local ad hoc error labels become canonical
results; legacy mappings remain consumer-owned.

### Completion Evidence

Command dispatcher, canonical failure result, no-effect assertions, mapping
contract fixtures, and all required direct tests.

### Risks

Partial command coverage, failure-code drift, or a transport layer becoming
the source of truth.

### Issue Decomposition Readiness

`ISSUE_READY`; `READINESS_CLASSIFICATION = READY`.

### Initial DAG State

`BLOCKED`; `BLOCKED_BY = DOM-IMP-01, DOM-IMP-04`.

## DOM-IMP-06 — Ticket states and functional transitions

`UNIT_FORMATION_REASON = SHARED_INVARIANT + SHARED_COMMAND_BOUNDARY`.

### Goal

Implement the DOM ticket aggregate with exactly six functional states, eight
valid transitions, terminality, and fail-closed invalid transition recording.

### Authority and Ownership

- Primary SPEC: `SPEC-DOM-001` §13 (`DOM-TICKET-001`, `DOM-TICKET-002`).
- Obligations: `O-012`, `O-013`; role `CANONICAL_OWNER`.
- Local ownership: ticket state machine and transition meaning.
- Foreign capabilities: EXEC/GIT/BACKEND/UI operational mappings.
- Authority Consumption Proof: `ACP-DOM-06`; ticket states/transitions are fully specified upstream.
- Producer / Consumer Contract Proof: `PCP-EXEC-02` for execution mapping only.
- Authority consumption result: `AUTHORITY_CONSUMABLE`.

### Gap Matrix Coverage

`GAP-014`, `GAP-015`; requirements `DOM-TICKET-001`, `DOM-TICKET-002`;
acceptance `AC-DOM-012`, `AC-DOM-013`.

### Portfolio Obligation Coverage

`O-012`, `O-013`.

### Validated Delta

```text
OBSERVED: no productive ticket aggregate or transition recorder exists.
REQUIRED: exactly six functional states, exactly eight valid transitions,
          terminal no-reopen behavior, and rejection of every other transition.
DELTA:    add the local ticket state/transition authority and operational mapping seam.
```

### Required Behavior

`LOCAL_BEHAVIOR`: enforce the exact state set and transition table, terminality,
and explicit cancellation. `END_TO_END_CONTRIBUTION`: operational queue/audit
states remain mappings and cannot add functional states.

### Does Not Implement

Scheduler queues, audit/remediation state, Git execution, API, UI, or foreign
session lifecycle.

### Repository Evidence

No productive ticket symbols; prototype tests are references only. ADD_NEW_CAPABILITY
in DOM with direct tests.

### Expected Repository Impact

New ticket domain aggregate/commands, application boundary, and ticket state
and transition tests.

### Implementation Constraints

Only six states and eight transitions; terminal states never reopen; invalid
transitions are recorded and no-op; operational states do not become functional.

### Internal Prerequisites

`DOM-IMP-04`, `DOM-IMP-05`.

### Cross-Spec Prerequisites

| Owner SPEC | Required capability | Implementation state | Blocking? |
| --- | --- | --- | --- |
| SPEC-EXEC-002 | execution/session mapping | not yet productive | No for local state authority |
| SPEC-GIT-001 / SPEC-BACKEND-001 / SPEC-UI-001 | projections and transport | not yet productive | No |

### Producer / Consumer Contract Proof

`PCP-EXEC-02`: EXEC-002 consumes the canonical ticket state and returns
operational outcomes; DOM remains producer of functional state. No foreign
producer supplies ticket semantics.

### Temporal Authority Preconditions

State/revision and dependency preconditions are observed at command commit;
stale state fails closed without reopening or mutating the ticket.

### Acceptance Criteria

1. Only the six specified states can be created or restored.
2. All eight specified transitions succeed under their conditions.
3. Every other transition, including terminal reopen, rejects and records with
   no state change. `LOCAL_PROVABILITY = YES`.

### Acceptance Witness Matrix

| Normative behavior | Operation | Positive witness | Negative/isolation witness | Evidence | Owner |
| --- | --- | --- | --- | --- | --- |
| Six states | create/restore | each valid state | unknown/operational state | ticket state test report | DOM-IMP-06 |
| Eight transitions | transition command | all eight rows | invalid, terminal, reopen | transition matrix report | DOM-IMP-06 |

### Local Closure

`LOCAL_CLOSURE = YES`; all state/transition criteria are local.

### Required Tests

State enumeration, terminality, all eight transitions, invalid transitions,
duplicate/idempotent commands, stale state, and no-reopen tests.

### Legacy / Cutover Impact

`ADD_COMPATIBILITY_MAPPING`; operational labels are mapped without expanding
the functional state set.

### Completion Evidence

Ticket aggregate, transition validator/recorder, complete matrix test report,
and terminality/no-effect evidence.

### Risks

Operational queue/audit states leaking into functional authority or terminal
tickets being reopened.

### Issue Decomposition Readiness

`ISSUE_READY`; `READINESS_CLASSIFICATION = READY`.

### Initial DAG State

`BLOCKED`; `BLOCKED_BY = DOM-IMP-04, DOM-IMP-05`.

## DOM-IMP-07 — Publication vocabulary and advancement gates

`UNIT_FORMATION_REASON = SHARED_AUTHORITY + SHARED_INTEGRATION_SEAM`.

### Goal

Implement distinct DOM publication states and formal verdict/dependency/
cancellation gates without executing Git effects locally.

### Authority and Ownership

- Primary SPEC: `SPEC-DOM-001` §13 (`DOM-PUB-001`, `DOM-ADV-001`).
- Obligations: `O-014`, `O-015`; role `CANONICAL_OWNER`.
- Local ownership: publication vocabulary and advance/cancellation rules.
- Foreign capabilities: GIT execution/confirmation, EXEC activity, PLAT effects/evidence.
- Authority Consumption Proof: `ACP-DOM-07`.
- Producer / Consumer Contract Proof: `PCP-GIT-01`, `PCP-EXEC-03`, `PCP-PLAT-06`.
- Authority consumption result: `AUTHORITY_CONSUMABLE`; foreign evidence contracts are explicit.

### Gap Matrix Coverage

`GAP-013`, `GAP-016`; requirements `DOM-ADV-001`, `DOM-PUB-001`;
acceptance `AC-DOM-014`, `AC-DOM-015`.

### Portfolio Obligation Coverage

`O-014`, `O-015`.

### Validated Delta

```text
OBSERVED: no productive publication model; advance validates only target/revision.
REQUIRED: publication states remain distinct; no auditable advance occurs
          without formal verdict, dependency closure, and cooperative cancellation.
DELTA:    add local state/gate authority and consume GIT/EXEC/PLAT outcomes.
```

### Required Behavior

`LOCAL_BEHAVIOR`: represent all seven publication states, validate formal
verdict/dependency/cancellation conditions, and preserve independent progress.
`END_TO_END_CONTRIBUTION`: GIT produces execution/remote evidence; DOM never
declares `PR_MERGED` to be remote confirmation.

### Does Not Implement

Push, PR, merge, worktree, remote confirmation, scheduler activity, or physical
effect reconciliation.

### Repository Evidence

No productive publication symbols; pipeline handler is the current partial
advance seam. ADD_NEW_CAPABILITY and extend command/result boundaries.

### Expected Repository Impact

Publication/advancement domain state, application gates, and GIT/EXEC/PLAT
contract tests.

### Implementation Constraints

Distinct publication states; formal verdict required; cancellation cooperative;
remote effects are never reverted or locally confirmed.

### Internal Prerequisites

`DOM-IMP-04`, `DOM-IMP-05`.

### Cross-Spec Prerequisites

| Owner SPEC | Required capability | Implementation state | Blocking? |
| --- | --- | --- | --- |
| SPEC-GIT-001 | publication execution/evidence/remote confirmation | not yet productive | No for local vocabulary/gates; Yes for integrated publication proof |
| SPEC-EXEC-002 | activity/session outcomes | not yet productive | No for local gates |
| SPEC-PLAT-001 | effect intent/evidence | not yet productive | No for local gates |

### Producer / Consumer Contract Proof

`PCP-GIT-01`: GIT produces candidate/PR/merge/remote-confirmation evidence;
DOM consumes exact evidence. `PCP-EXEC-03` and `PCP-PLAT-06` similarly produce
activity/effect outcomes consumed by DOM gates.

### Temporal Authority Preconditions

Before any local advance authorization, revalidate verdict/dependency/revision
and exact evidence references; drift fails closed. GIT/PLAT own physical
effect integrity; DOM owns semantic gate validity.

### Acceptance Criteria

1. All publication states are distinct, especially `PR_MERGED` and
   `REMOTE_PUBLICATION_CONFIRMED`.
2. Advance without verdict/closure or with non-cooperative cancellation rejects
   with no local transition. `LOCAL_PROVABILITY = YES`.

### Acceptance Witness Matrix

| Normative behavior | Operation | Positive witness | Negative/isolation witness | Evidence | Owner |
| --- | --- | --- | --- | --- | --- |
| Publication vocabulary | state transition | candidate→approval→integration→PR states | merge treated as remote confirmation | publication test report | DOM-IMP-07 |
| Advancement gate | advance/cancel | formal verdict and closure | no verdict, closed dependency, non-cooperative cancel | gate test report | DOM-IMP-07 |

### Local Closure

`LOCAL_CLOSURE = YES`; local state/gate behavior uses foreign contract fixtures;
actual Git effects are checkpoint evidence.

### Required Tests

State distinction, verdict/dependency gates, cooperative cancellation,
idempotency, stale evidence, no-DOM-Git-execution, and effect boundary tests.

### Legacy / Cutover Impact

`ADD_COMPATIBILITY_MAPPING`; preserve historical publication labels while
retiring any local remote-confirmation shortcut.

### Completion Evidence

Publication state machine, gate command, direct negative tests, and contract
fixtures for GIT/EXEC/PLAT evidence.

### Risks

Premature advancement, publication vocabulary collapse, and local simulation
being mistaken for remote confirmation.

### Issue Decomposition Readiness

`ISSUE_READY`; `READINESS_CLASSIFICATION = READY`.

### Initial DAG State

`BLOCKED`; `BLOCKED_BY = DOM-IMP-04, DOM-IMP-05`.

## DOM-IMP-08 — Audit-cycle identity and structured verdict closure

`UNIT_FORMATION_REASON = SHARED_AUTHORITY + SHARED_COMMAND_BOUNDARY`.

### Goal

Implement distinct artifact/cycle/round identity and structured verdict
closure so remediation or absent findings cannot self-approve a cycle.

### Authority and Ownership

- Primary SPEC: `SPEC-DOM-001` §13 (`DOM-AUDIT-001`, `DOM-AUDIT-002`).
- Obligations: `O-049`, `O-050`; role `CANONICAL_OWNER`.
- Local ownership: cycle identity, verdict closure, and audit lifecycle meaning.
- Foreign capabilities: EXEC session/activity execution and downstream auditor evidence.
- Authority Consumption Proof: `ACP-DOM-08`.
- Producer / Consumer Contract Proof: `PCP-EXEC-04`.
- Authority consumption result: `AUTHORITY_CONSUMABLE`.

### Gap Matrix Coverage

`GAP-017`, `GAP-018`; requirements `DOM-AUDIT-001`, `DOM-AUDIT-002`;
acceptance `AC-DOM-049`, `AC-DOM-050`.

### Portfolio Obligation Coverage

`O-049`, `O-050`.

### Validated Delta

```text
OBSERVED: no productive audit-cycle identity or structured closure command.
REQUIRED: artifact, cycle, and round identities are distinct and only an exact
          structured verdict closes the exact cycle.
DELTA:    add local audit identity/closure authority and consume execution evidence.
```

### Required Behavior

`LOCAL_BEHAVIOR`: create distinct cycle records, validate artifact/revision/
cycle/round binding, and close only with a structured verdict. `END_TO_END_
CONTRIBUTION`: EXEC/auditors provide activity/findings; DOM records closure.

### Does Not Implement

Auditor assignment/session scheduling, finding production, or report projection.

### Repository Evidence

No productive audit-cycle symbols; prototype audit scenarios are references.
ADD_NEW_CAPABILITY with direct domain/application tests.

### Expected Repository Impact

Audit-cycle identity/verdict domain, application closure command, and exact
cycle/revision test fixtures.

### Implementation Constraints

No implicit cycle reuse; remediation/no-findings/process termination never
equals approval; exact artifact/revision/cycle/round binding is required.

### Internal Prerequisites

`DOM-IMP-01`, `DOM-IMP-05`.

### Cross-Spec Prerequisites

| Owner SPEC | Required capability | Implementation state | Blocking? |
| --- | --- | --- | --- |
| SPEC-EXEC-002 | session/activity evidence | not yet productive | No for local closure semantics |

### Producer / Consumer Contract Proof

`PCP-EXEC-04`: EXEC-002 produces activity/session evidence; DOM consumes its
correlation while retaining distinct cycle identity and verdict authority.

### Temporal Authority Preconditions

Closure revalidates exact artifact revision and cycle identity at commit; drift
or mismatched round fails closed and preserves prior cycle state.

### Acceptance Criteria

1. Independent cycles for distinct artifacts/revisions never reuse identity.
2. Only an exact structured verdict closes a cycle; remediation or missing
   findings cannot close it. `LOCAL_PROVABILITY = YES`.

### Acceptance Witness Matrix

| Normative behavior | Operation | Positive witness | Negative/isolation witness | Evidence | Owner |
| --- | --- | --- | --- | --- | --- |
| Cycle identity | create/open cycle | distinct artifact/cycle/round records | implicit reuse or wrong revision | cycle identity report | DOM-IMP-08 |
| Structured closure | close cycle | exact verdict | remediation-only, no-findings, wrong cycle | verdict closure report | DOM-IMP-08 |

### Local Closure

`LOCAL_CLOSURE = YES`; EXEC evidence is represented by contract fixtures only.

### Required Tests

Identity uniqueness, cycle non-reuse, exact revision binding, structured
verdict, remediation-only rejection, no-findings rejection, and idempotency.

### Legacy / Cutover Impact

`PRESERVE_LEGACY_READS`; no historical cycle is silently reused.

### Completion Evidence

Cycle/verdict model, closure command, exact-binding tests, and no-self-approval
evidence.

### Risks

Session identity replacing cycle identity or a report/no-finding result being
treated as a structured approval.

### Issue Decomposition Readiness

`ISSUE_READY`; `READINESS_CLASSIFICATION = READY`.

### Initial DAG State

`BLOCKED`; `BLOCKED_BY = DOM-IMP-01, DOM-IMP-05`.

## DOM-IMP-09 — Round limit and continuation authorization

`UNIT_FORMATION_REASON = SHARED_INVARIANT`.

### Goal

Enforce the configurable ten-round limit, pause only the affected unit, and
require explicit continuation authorization.

### Authority and Ownership

- Primary SPEC: `SPEC-DOM-001` §13 (`DOM-AUDIT-003`).
- Obligation: `O-051`; role `CANONICAL_OWNER`.
- Local ownership: round count, pause scope, and continuation authorization.
- Foreign capability: EXEC activity scheduling.
- Authority Consumption Proof: `ACP-DOM-09`.
- Producer / Consumer Contract Proof: `PCP-EXEC-05`.
- Authority consumption result: `AUTHORITY_CONSUMABLE`.

### Gap Matrix Coverage

`GAP-019`; requirement `DOM-AUDIT-003`; acceptance `AC-DOM-051`.

### Portfolio Obligation Coverage

`O-051`.

### Validated Delta

```text
OBSERVED: no productive round counter, affected-unit pause, or continuation authorization.
REQUIRED: tenth round pauses only the affected unit and explicit authorization is
          required for the next round.
DELTA:    add local round policy and continuation command; EXEC remains scheduler owner.
```

### Required Behavior

`LOCAL_BEHAVIOR`: count rounds, pause at configured limit, isolate affected
unit, and require explicit authorized continuation. `END_TO_END_CONTRIBUTION`:
EXEC stops/schedules activities according to the DOM result.

### Does Not Implement

Scheduler, agent assignment, session execution, or cross-unit queue control.

### Repository Evidence

No productive round symbols; prototype round scenarios are references. ADD_NEW_CAPABILITY.

### Expected Repository Impact

Audit round policy/command and isolated pause/continuation tests.

### Implementation Constraints

Default initial limit ten and configurable; no implicit approval, evidence reuse,
or cross-unit pause; continuation is explicit and auditable.

### Internal Prerequisites

`DOM-IMP-08`.

### Cross-Spec Prerequisites

| Owner SPEC | Required capability | Implementation state | Blocking? |
| --- | --- | --- | --- |
| SPEC-EXEC-002 | schedule/pause activity according to DOM result | not yet productive | No for local policy |

### Producer / Consumer Contract Proof

`PCP-EXEC-05`: DOM produces pause/continuation decision; EXEC-002 consumes it
for activity scheduling and does not create a second round authority.

### Temporal Authority Preconditions

Round count and continuation authorization are revalidated against the exact
cycle/revision before resuming; mismatch fails closed.

### Acceptance Criteria

1. The tenth round pauses only its affected unit.
2. A following round requires explicit continuation authorization and cannot
   be inferred from process termination or an unrelated unit. `LOCAL_PROVABILITY = YES`.

### Acceptance Witness Matrix

| Normative behavior | Operation | Positive witness | Negative/isolation witness | Evidence | Owner |
| --- | --- | --- | --- | --- | --- |
| Round limit | record tenth round | affected-unit pause | ninth/elevated or cross-unit pause | round policy report | DOM-IMP-09 |
| Continuation | authorize next round | explicit command | implicit continuation or wrong cycle | continuation report | DOM-IMP-09 |

### Local Closure

`LOCAL_CLOSURE = YES`; scheduling is represented by a contract fixture.

### Required Tests

Configurable limit, tenth-round pause, unit isolation, explicit authorization,
wrong-cycle/stale authorization, idempotency, and no-implicit-approval tests.

### Legacy / Cutover Impact

`NO_LEGACY_IMPACT` beyond preserving historical round records.

### Completion Evidence

Round policy and command, isolation tests, and explicit continuation audit record.

### Risks

Global pause, implicit continuation, or session termination being promoted to
the round authority.

### Issue Decomposition Readiness

`ISSUE_READY`; `READINESS_CLASSIFICATION = READY`.

### Initial DAG State

`BLOCKED`; `BLOCKED_BY = DOM-IMP-08`.

## DOM-IMP-10 — Normative-change invalidation and adjustment lineage

`UNIT_FORMATION_REASON = SHARED_CUTOVER + SHARED_INTEGRATION_SEAM`.

### Goal

Implement selective downstream invalidation and linked adjustment/succession
without reopening completed tickets or destroying historical approvals.

### Authority and Ownership

- Primary SPEC: `SPEC-DOM-001` §13 (`DOM-AUDIT-005`).
- Obligation: `O-053`; role `CANONICAL_OWNER`.
- Local ownership: normative-change impact, invalidation, and adjustment linkage.
- Foreign capabilities: PLAT/GIT/EXEC persistence, publication, and execution records.
- Authority Consumption Proof: `ACP-DOM-10`.
- Producer / Consumer Contract Proof: `PCP-PLAT-07`, `PCP-GIT-02`, `PCP-EXEC-06`.
- Authority consumption result: `AUTHORITY_CONSUMABLE`.

### Gap Matrix Coverage

`GAP-021`; requirement `DOM-AUDIT-005`; acceptance `AC-DOM-053`.

### Portfolio Obligation Coverage

`O-053`.

### Validated Delta

```text
OBSERVED: no productive downstream approval registry, selective invalidation,
          or linked adjustment path exists.
REQUIRED: normative change obsoletes affected approvals, preserves history,
          creates linked adjustment, and never reopens COMPLETED tickets.
DELTA:    add DOM invalidation/cutover authority and integration references.
```

### Required Behavior

`LOCAL_BEHAVIOR`: determine affected approvals, mark them obsolete, preserve
history, create linked adjustment, and preserve terminal ticket state.
`END_TO_END_CONTRIBUTION`: PLAT/GIT/EXEC persist and project the linked records.

### Does Not Implement

Foreign approval storage, Git publication, scheduler actions, or legacy adapter
retirement owned by REPO.

### Repository Evidence

No productive invalidation/cutover symbols; prototype drift scenarios are
references. ADD_NEW_CAPABILITY with selective invalidation tests.

### Expected Repository Impact

DOM invalidation/adjustment commands, linkage records, and PLAT/GIT/EXEC
contract tests.

### Implementation Constraints

Selective impact only, history immutable, completed tickets terminal, linked
adjustment explicit, no blanket reset or hidden reopening.

### Internal Prerequisites

`DOM-IMP-03`, `DOM-IMP-06`.

### Cross-Spec Prerequisites

| Owner SPEC | Required capability | Implementation state | Blocking? |
| --- | --- | --- | --- |
| SPEC-PLAT-001 | durable approval/history records | not yet productive | No for local cutover semantics |
| SPEC-GIT-001 | publication evidence linkage | not yet productive | No |
| SPEC-EXEC-002 | execution-cycle linkage | not yet productive | No |

### Producer / Consumer Contract Proof

`PCP-PLAT-07`, `PCP-GIT-02`, and `PCP-EXEC-06`: each foreign owner produces
records identified by the canonical DOM adjustment/revision; DOM consumes
references and owns only invalidation meaning.

### Temporal Authority Preconditions

`TAP-10`: observe normative revision and affected approvals, reobserve at
invalidation commit, fail closed on drift, preserve prior records, and let DOM
own semantic impact while foreign owners provide atomic persistence/evidence.

### Acceptance Criteria

1. A normative change obsoletes only affected approvals and links a new
   adjustment while preserving history.
2. A `COMPLETED` ticket remains terminal and is not reopened. `LOCAL_PROVABILITY = YES`.

### Acceptance Witness Matrix

| Normative behavior | Operation | Positive witness | Negative/isolation witness | Evidence | Owner |
| --- | --- | --- | --- | --- | --- |
| Selective invalidation | apply normative revision | affected approval obsolete | unrelated approval invalidated | cutover test report | DOM-IMP-10 |
| Terminal preservation | create adjustment | linked new adjustment | completed ticket reopen attempt | terminality report | DOM-IMP-10 |

### Local Closure

`LOCAL_CLOSURE = YES`; foreign stores are contract fixtures and the local
invalidation/terminality behavior is independently auditable.

### Required Tests

Selective impact, history preservation, linked adjustment, stale revision,
terminal no-reopen, idempotency, and foreign-reference mapping tests.

### Legacy / Cutover Impact

`CUTOVER`; invalidate affected downstream records, preserve reads/history, and
defer physical retirement/migration to approved owners.

### Completion Evidence

Impact resolver, invalidation/adjustment command, no-reopen tests, and mapping
contract evidence.

### Risks

Blanket invalidation, history loss, completed-ticket reopening, or foreign
publication data becoming DOM authority.

### Issue Decomposition Readiness

`ISSUE_READY`; `READINESS_CLASSIFICATION = READY`.

### Initial DAG State

`BLOCKED`; `BLOCKED_BY = DOM-IMP-03, DOM-IMP-06`.

## DOM-IMP-11 — Exact candidate evidence and drift gate

`UNIT_FORMATION_REASON = SHARED_INTEGRATION_SEAM + SHARED_CUTOVER`.

### Goal

Bind candidate conformance/publication authorization to exact base, head, tree,
and hash-linked evidence, rejecting drift before authorization.

### Authority and Ownership

- Primary SPEC: `SPEC-DOM-001` §13 (`DOM-AUDIT-006`).
- Obligation: `O-054`; role `CANONICAL_OWNER`.
- Local ownership: exact-basis authorization and semantic drift invalidation.
- Foreign capabilities: GIT evidence production, PLAT preservation, OPS projection.
- Authority Consumption Proof: `ACP-DOM-11`.
- Producer / Consumer Contract Proof: `PCP-GIT-03`, `PCP-PLAT-08`, `PCP-OPS-01`.
- Authority consumption result: `AUTHORITY_CONSUMABLE`.

### Gap Matrix Coverage

`GAP-022`; requirement `DOM-AUDIT-006`; acceptance `AC-DOM-054`.

### Portfolio Obligation Coverage

`O-054`.

### Validated Delta

```text
OBSERVED: no productive exact candidate binding, independent revalidation, or
          hash-linked publication gate exists.
REQUIRED: base/head/tree and external evidence are exact; any drift invalidates
          authorization before publication.
DELTA:    add DOM exact-basis gate and consume GIT/PLAT/OPS evidence contracts.
```

### Required Behavior

`LOCAL_BEHAVIOR`: capture exact candidate identity, independently revalidate
base/head/tree/evidence before commit, reject drift, and preserve hash links.
`END_TO_END_CONTRIBUTION`: GIT supplies evidence; PLAT/OPS preserve/project it.

### Does Not Implement

Git commands, worktrees, PR/merge, physical evidence retention, or operational
export.

### Repository Evidence

No productive exact-candidate symbols; prototype publication ledger is
non-authoritative. ADD_NEW_CAPABILITY and integration seams.

### Expected Repository Impact

DOM candidate/evidence gate, application authorization command, and GIT/PLAT/OPS
contract/drift tests.

### Implementation Constraints

Exact base/head/tree binding, independent second observation, hash-linked
evidence, fail-closed drift, and no confirmation from stale local variables.

### Internal Prerequisites

`DOM-IMP-01`, `DOM-IMP-07`.

### Cross-Spec Prerequisites

| Owner SPEC | Required capability | Implementation state | Blocking? |
| --- | --- | --- | --- |
| SPEC-GIT-001 | candidate/merge/remote evidence | not yet productive | No for gate contract; Yes for integrated publication proof |
| SPEC-PLAT-001 | durable intent/evidence preservation | not yet productive | No for local gate |
| SPEC-OPS-001 | operational evidence projection | not yet productive | No |

### Producer / Consumer Contract Proof

`PCP-GIT-03`: GIT produces exact candidate evidence; `PCP-PLAT-08`: PLAT
preserves intent/evidence; `PCP-OPS-01`: OPS projects records. DOM consumes
each by canonical correlation and retains gate authority.

### Temporal Authority Preconditions

`TAP-11`: initial base/head/tree/evidence observation, mutation window,
commit-point independent second observation, drift comparison, fail-closed
authorization, preserved prior evidence, DOM semantic owner, GIT physical
integrity owner. No self-comparison or CAS-only proof is accepted.

### Acceptance Criteria

1. Candidate authorization records exact base/head/tree and hash-linked evidence.
2. Drift in any binding between observations rejects authorization and preserves
   the prior record. `LOCAL_PROVABILITY = YES`.

### Acceptance Witness Matrix

| Normative behavior | Operation | Positive witness | Negative/isolation witness | Evidence | Owner |
| --- | --- | --- | --- | --- | --- |
| Exact candidate | authorize candidate | exact binding accepted | changed base/head/tree/evidence | candidate gate report | DOM-IMP-11 |
| Temporal drift | revalidate before effect | unchanged independent observation | drift/one-snapshot reuse | temporal proof report | DOM-IMP-11 |

### Local Closure

`LOCAL_CLOSURE = YES`; temporal gate and hash-link semantics execute against
contract fixtures; real Git/PLAT/OPS evidence is an integration checkpoint.

### Required Tests

Exact binding, independent re-read, base/head/tree drift, evidence hash mismatch,
stale local variable, idempotency, and fail-closed/no-effect tests.

### Legacy / Cutover Impact

`REMOVE_ALTERNATE_AUTHORITY`: prototype/local publication confirmation cannot
authorize publication; historical evidence remains hash-linked.

### Completion Evidence

Candidate gate, temporal proof record, direct drift matrix, and foreign evidence
contract fixtures.

### Risks

Self-comparison, stale evidence reuse, CAS mistaken for semantic revalidation,
or GIT/OPS projection becoming authorization authority.

### Issue Decomposition Readiness

`ISSUE_READY`; `READINESS_CLASSIFICATION = READY`.

### Initial DAG State

`BLOCKED`; `BLOCKED_BY = DOM-IMP-01, DOM-IMP-07`.

## DOM-IMP-12 — Final conformance evaluator

`UNIT_FORMATION_REASON = SHARED_CONFORMANCE`.

### Goal

Implement the DOM-owned final conformance evaluator that checks all named
dimensions, coverage, integration, regressions, tests, omissions, and
extrapolations after the contributing units and evidence are available.

### Authority and Ownership

- Primary SPEC: `SPEC-DOM-001` §13 (`DOM-AUDIT-004`).
- Obligation: `O-052`; role `CANONICAL_OWNER`.
- Local ownership: conformance criteria, evaluator result, and remediation return.
- Foreign capabilities: all component evidence producers and projections.
- Authority Consumption Proof: `ACP-DOM-12`; evaluator criteria are complete in SPEC §§21–22.
- Producer / Consumer Contract Proof: `PCP-ALL-01` aggregates explicit evidence contracts from `PCP-PLAT`, `PCP-GIT`, `PCP-EXEC`, `PCP-BACKEND`, `PCP-OPS`, and `PCP-UI`.
- Authority consumption result: `AUTHORITY_CONSUMABLE`; evidence availability is a known final integration prerequisite.

### Gap Matrix Coverage

`GAP-020`; requirement `DOM-AUDIT-004`; acceptance `AC-DOM-052`.

### Portfolio Obligation Coverage

`O-052`.

### Validated Delta

```text
OBSERVED: no productive evaluator exists; prototype report is non-authoritative.
REQUIRED: final conformance checks adherence, coverage, integration, regression,
          tests, omissions, and extrapolations and returns findings for remediation.
DELTA:    add the DOM evaluator and exact evidence-consumption boundary.
```

### Required Behavior

`LOCAL_BEHAVIOR`: evaluate the named dimensions against an exact artifact/cycle
and return structured conformant/non-conformant result with findings.
`END_TO_END_CONTRIBUTION`: consume foreign evidence without making any foreign
projection canonical.

### Does Not Implement

Foreign evidence production, ticket execution, Git publication, physical
recovery, UI/OPS reports, or a synthetic second authority.

### Repository Evidence

No productive evaluator; prototype final-report scenarios are test inspiration.
ADD_NEW_CAPABILITY after all local domain contracts exist.

### Expected Repository Impact

DOM evaluator/application command, evidence interfaces, and integrated
conformance fixtures/tests.

### Implementation Constraints

All named dimensions must be checked; absent evidence cannot pass; findings
return to remediation; no-findings alone is not approval; exact cycle/revision
binding is required.

### Internal Prerequisites

`DOM-IMP-01` through `DOM-IMP-11`.

### Cross-Spec Prerequisites

| Owner SPEC | Required capability | Implementation state | Blocking? |
| --- | --- | --- | --- |
| SPEC-EXEC-001 / SPEC-EXEC-002 | contract, session, and audit evidence | not yet productive | No for evaluator contract tests; Yes for integrated conformance |
| SPEC-PLAT-001 | persistence/effect/recovery evidence | not yet productive | No for evaluator contract tests; Yes for integrated conformance |
| SPEC-REPO-001 | repository/legacy evidence | not yet productive | No for evaluator contract tests |
| SPEC-GIT-001 | publication/integration evidence | not yet productive | No for evaluator contract tests; Yes for integrated conformance |
| SPEC-BACKEND-001 / SPEC-OPS-001 / SPEC-UI-001 | mapping/projection/evidence | not yet productive | No for evaluator contract tests; Yes for integrated conformance |

### Producer / Consumer Contract Proof

`PCP-ALL-01`: each listed owner produces its approved evidence contract;
DOM-IMP-12 consumes exact identity/revision/cycle-bound evidence, checks
availability and omissions, and produces the DOM conformance verdict. The
dependency edge is `all evidence producers → DOM evaluator`; no foreign
producer becomes a DOM authority.

### Temporal Authority Preconditions

Evaluator revalidates exact artifact revision and evidence hashes at the
conformance commit; drift or missing evidence fails closed and preserves the
cycle. Physical integrity remains with producers/PLAT/GIT/OPS.

### Acceptance Criteria

1. Evaluator checks adherence, coverage, integration, regressions, tests,
   omissions, and extrapolations for the exact cycle.
2. Missing/contradictory evidence returns structured findings and does not pass.
3. A conformant result is distinct from process termination and is linked to
   the exact artifact/revision/cycle. `LOCAL_PROVABILITY = YES` with evidence
   contract fixtures; integrated proof is owned here at CP-DOM-04.

### Acceptance Witness Matrix

| Normative behavior | Operation | Positive witness | Negative/isolation witness | Evidence | Owner |
| --- | --- | --- | --- | --- | --- |
| Final dimensions | evaluate exact cycle | complete evidence fixture | omitted/extrapolated/integrated failure | evaluator report | DOM-IMP-12 |
| Structured result | close conformance | exact conformant verdict | missing evidence/process termination | verdict report | DOM-IMP-12 |

### Local Closure

`LOCAL_CLOSURE = YES`; contract fixtures prove evaluator behavior locally and
the final integrated checkpoint waits for actual foreign evidence availability.

### Required Tests

Evaluator unit tests for every dimension, coverage/omission/extrapolation,
regression/test evidence, exact binding, structured findings, idempotency,
and integrated conformance tests at CP-DOM-04.

### Legacy / Cutover Impact

`PRESERVE_LEGACY_READS`; historical reports remain evidence only and cannot
close a new exact cycle.

### Completion Evidence

Evaluator, structured verdict/finding result, complete witness matrix, all
contributor evidence references, and integrated CP-DOM-04 report.

### Risks

Synthetic final unit, no-findings shortcut, missing evidence treated as pass,
or a projection/report becoming conformance authority.

### Issue Decomposition Readiness

`ISSUE_READY`; `READINESS_CLASSIFICATION = READY`.

### Initial DAG State

`BLOCKED`; `BLOCKED_BY = DOM-IMP-01 through DOM-IMP-11`.

## 10. Gap → Plan Traceability

| Gap ID | Requirement | Obligation | Classification | Severity | Planning type | Unit | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| GAP-001 | DOM-ID-001 | O-001 | PARTIAL | MAJOR | LOCAL_IMPLEMENTATION_WORK | DOM-IMP-01 | COVERED |
| GAP-003 | DOM-INGEST-001 | O-002 | PARTIAL | MAJOR | LOCAL_IMPLEMENTATION_WORK | DOM-IMP-02 | COVERED |
| GAP-004 | DOM-SNAPSHOT-001 | O-003 | CONTRADICTORY | MAJOR | INTEGRATION_OR_CONVERGENCE_WORK | DOM-IMP-02 | COVERED |
| GAP-005 | DOM-SNAPSHOT-001, DOM-ELIG-001 | O-003, O-004 | CONTRADICTORY | MAJOR | LOCAL_IMPLEMENTATION_WORK | DOM-IMP-02 | COVERED |
| GAP-006 | DOM-LINEAGE-001 | O-005 | PARTIAL | MAJOR | INTEGRATION_OR_CONVERGENCE_WORK | DOM-IMP-01 | COVERED |
| GAP-007 | DOM-LIFE-001 | O-006 | MISSING | MAJOR | LOCAL_IMPLEMENTATION_WORK | DOM-IMP-03 | COVERED |
| GAP-008 | DOM-REV-001 | O-007 | MISSING | MAJOR | INTEGRATION_OR_CONVERGENCE_WORK | DOM-IMP-03 | COVERED |
| GAP-009 | DOM-IMMUT-001 | O-008 | MISSING | MAJOR | LOCAL_IMPLEMENTATION_WORK | DOM-IMP-03 | COVERED |
| GAP-010 | DOM-PIPE-001, DOM-STATE-001 | O-009, O-010 | CONTRADICTORY | MAJOR | INTEGRATION_OR_CONVERGENCE_WORK | DOM-IMP-04 | COVERED |
| GAP-011 | DOM-CMD-001 | O-011 | PARTIAL | MAJOR | LOCAL_IMPLEMENTATION_WORK | DOM-IMP-05 | COVERED |
| GAP-012 | DOM-CMD-001 | O-011 | PARTIAL | MAJOR | LOCAL_IMPLEMENTATION_WORK | DOM-IMP-05 | COVERED |
| GAP-013 | DOM-ADV-001 | O-015 | CONTRADICTORY | MAJOR | INTEGRATION_OR_CONVERGENCE_WORK | DOM-IMP-07 | COVERED |
| GAP-014 | DOM-TICKET-001 | O-012 | MISSING | MAJOR | LOCAL_IMPLEMENTATION_WORK | DOM-IMP-06 | COVERED |
| GAP-015 | DOM-TICKET-002 | O-013 | MISSING | MAJOR | LOCAL_IMPLEMENTATION_WORK | DOM-IMP-06 | COVERED |
| GAP-016 | DOM-PUB-001 | O-014 | MISSING | MAJOR | INTEGRATION_OR_CONVERGENCE_WORK | DOM-IMP-07 | COVERED |
| GAP-017 | DOM-AUDIT-001 | O-049 | MISSING | MAJOR | LOCAL_IMPLEMENTATION_WORK | DOM-IMP-08 | COVERED |
| GAP-018 | DOM-AUDIT-002 | O-050 | MISSING | MAJOR | LOCAL_IMPLEMENTATION_WORK | DOM-IMP-08 | COVERED |
| GAP-019 | DOM-AUDIT-003 | O-051 | MISSING | MAJOR | LOCAL_IMPLEMENTATION_WORK | DOM-IMP-09 | COVERED |
| GAP-020 | DOM-AUDIT-004 | O-052 | MISSING | MAJOR | INTEGRATION_OR_CONVERGENCE_WORK | DOM-IMP-12 | COVERED |
| GAP-021 | DOM-AUDIT-005 | O-053 | MISSING | MAJOR | INTEGRATION_OR_CONVERGENCE_WORK | DOM-IMP-10 | COVERED |
| GAP-022 | DOM-AUDIT-006 | O-054 | MISSING | MAJOR | INTEGRATION_OR_CONVERGENCE_WORK | DOM-IMP-11 | COVERED |

`GAPS_WITHOUT_PLAN_COVERAGE = 0`.

## 11. Acceptance → Plan Traceability

| Acceptance ID | Requirement(s) | Contributing units | Final proof owner | Local evidence | Final evidence |
| --- | --- | --- | --- | --- | --- |
| AC-DOM-001 | DOM-ID-001 | DOM-IMP-01 | DOM-IMP-01 | identity catalog/continuity tests | canonical identity report |
| AC-DOM-002 | DOM-INGEST-001 | DOM-IMP-02 | DOM-IMP-02 | manual-trigger negative test | command trace |
| AC-DOM-003 | DOM-SNAPSHOT-001 | DOM-IMP-02 | DOM-IMP-02 | snapshot mutation/drift tests | immutable snapshot evidence |
| AC-DOM-004 | DOM-ELIG-001 | DOM-IMP-02 | DOM-IMP-02 | eligibility matrix | fail-closed evidence |
| AC-DOM-005 | DOM-LINEAGE-001 | DOM-IMP-01 | DOM-IMP-01 | independent lineage tests | durable lineage evidence |
| AC-DOM-006 | DOM-LIFE-001 | DOM-IMP-03 | DOM-IMP-03 | lifecycle isolation | lifecycle trace |
| AC-DOM-007 | DOM-REV-001 | DOM-IMP-03 | DOM-IMP-03 | revision/succession tests | history/cutover evidence |
| AC-DOM-008 | DOM-IMMUT-001 | DOM-IMP-03 | DOM-IMP-03 | mutation rejection | immutable record evidence |
| AC-DOM-009 | DOM-PIPE-001 | DOM-IMP-04 | DOM-IMP-04 | order/skip tests | provenance chain evidence |
| AC-DOM-010 | DOM-STATE-001 | DOM-IMP-04 | DOM-IMP-04 | separate-state/reconstruction tests | chain and isolation evidence |
| AC-DOM-011 | DOM-CMD-001 | DOM-IMP-05 | DOM-IMP-05 | rejection/no-effect tests | canonical result evidence |
| AC-DOM-012 | DOM-TICKET-001 | DOM-IMP-06 | DOM-IMP-06 | six-state/terminal tests | ticket aggregate evidence |
| AC-DOM-013 | DOM-TICKET-002 | DOM-IMP-06 | DOM-IMP-06 | eight-transition matrix | transition proof |
| AC-DOM-014 | DOM-PUB-001 | DOM-IMP-07 | DOM-IMP-07 | publication state tests | GIT distinction evidence |
| AC-DOM-015 | DOM-ADV-001 | DOM-IMP-07 | DOM-IMP-07 | verdict/cancel gate tests | gate/effect evidence |
| AC-DOM-049 | DOM-AUDIT-001 | DOM-IMP-08 | DOM-IMP-08 | cycle identity tests | artifact/cycle evidence |
| AC-DOM-050 | DOM-AUDIT-002 | DOM-IMP-08 | DOM-IMP-08 | structured closure tests | exact verdict evidence |
| AC-DOM-051 | DOM-AUDIT-003 | DOM-IMP-09 | DOM-IMP-09 | ten-round/isolation tests | continuation authorization |
| AC-DOM-052 | DOM-AUDIT-004 | DOM-IMP-01–11 | DOM-IMP-12 | contributor contract evidence | integrated six-dimension conformance |
| AC-DOM-053 | DOM-AUDIT-005 | DOM-IMP-03, DOM-IMP-06, DOM-IMP-10 | DOM-IMP-10 | selective invalidation tests | preserved terminal history |
| AC-DOM-054 | DOM-AUDIT-006 | DOM-IMP-01, DOM-IMP-07, DOM-IMP-11 | DOM-IMP-11 | exact/temporal drift tests | hash-linked candidate gate |

`UNRESOLVED_FINAL_PROOF_OWNERS = 0`.

## 12. Cross-Spec Dependencies

The following are integration contracts, not local ownership transfers. Each
producer owns its capability; DOM consumes only the approved boundary result.

| Dependency | Portfolio owner | Consumer unit(s) | Required contract | Foreign implementation state | Blocking? |
| --- | --- | --- | --- | --- | --- |
| Exact skill/contract versions | SPEC-EXEC-001 | DOM-IMP-02, DOM-IMP-07 | immutable exact version metadata | not productive | No for local closure; yes for integrated proof |
| Sessions/activities/cycles | SPEC-EXEC-002 | DOM-IMP-03, 07–09, 10, 12 | session/activity evidence and scheduling outcome | not productive | No for local closure; yes for integrated evidence |
| Persistence/journal/effects/recovery | SPEC-PLAT-001 | DOM-IMP-01, 02, 04, 05, 07, 10–12 | durable records, provenance, intent, evidence, recovery | not productive | No for local contract closure; yes for integrated durability |
| Repository/legacy adaptation | SPEC-REPO-001 | DOM-IMP-02, 03, 10, 11 | explicit mapping without authority transfer | not productive | No |
| Git/publication evidence | SPEC-GIT-001 | DOM-IMP-07, 10–12 | candidate, PR, merge, remote confirmation evidence | not productive | No for local state/gate closure; yes for integrated publication |
| Transport/security mapping | SPEC-BACKEND-001 | DOM-IMP-05, 06, 07, 12 | command/result mapping without semantic change | not productive | No |
| Operational projection/preservation | SPEC-OPS-001 | DOM-IMP-01, 05, 10–12 | correlation and hash-linked projections | not productive | No |
| Client request/read projection | SPEC-UI-001 | DOM-IMP-02, 05–07, 12 | request/read mapping without authority | prototype only | No |

### 12.1 Capability availability records

These records are consumed from the validated Gap Matrix. They are not local
DOM implementation gaps and do not transfer ownership to DOM. Authority,
contract, local testability, and productive availability remain independent
dimensions.

| CAPABILITY_ID | AUTHORITY_OWNER | PRODUCER | CONSUMER | CONTRACT | AUTHORITY_STATUS | CONTRACT_STATUS | LOCAL_TESTABILITY | PRODUCTIVE_AVAILABILITY | AVAILABILITY_EVIDENCE | DEPENDENCY_CLASS | BLOCKING_EFFECT | FAILURE_NOT_FOUND_STALE_SEMANTICS | VERSION_REVISION_TRANSPORT |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CAP-EXEC-EXACT-VERSION-BASIS | SPEC-EXEC-001 | EXEC-001 registry | DOM-SNAPSHOT-001 / DOM-ADV-001 | exact skill/capability identity, version, revision, compatibility basis, and returned result | DEFINED | DEFINED | NO | NO | no productive EXEC registry/adapter in current repository; authority defined by SPEC-EXEC-001 contract | REQUIRED_FOR_INTEGRATED_PROOF | does not block local closure; blocks integrated proof only | unknown, incompatible, missing, or stale basis fails closed | producer returns exact version/revision; consumer stores and transports it unchanged |
| CAP-PLAT-SNAPSHOT-PIPELINE-PROVENANCE | SPEC-PLAT-001 | PLAT journal/checkpoint reader | DOM-SNAPSHOT-001 / DOM-PIPE-001 / DOM-STATE-001 | canonical identity/reference revisions, persistence revision, current state, and ordered append-only provenance | DEFINED | DEFINED | NO | NO | no productive PLAT journal/checkpoint reader or adapter in current repository; ports are not availability | REQUIRED_FOR_INTEGRATED_PROOF | does not block local closure; blocks integrated proof only | missing, detached, stale, corrupt, duplicate, omitted, or inconsistent material fails closed | producer returns persistence/domain/identity revisions and provenance order; consumer preserves them |
| CAP-GIT-CANDIDATE-REMOTE-CONFIRMATION | SPEC-GIT-001 | GIT remote observation adapter | DOM-PUB-001 / DOM-AUDIT-006 | PublicationId, candidate base/head/tree, remote result, confirmation revision, and independent observation | DEFINED | DEFINED | NO | NO | no productive GIT remote observation adapter in current repository; mock publication is not availability | REQUIRED_FOR_INTEGRATED_PROOF | does not block local closure; blocks integrated proof only | merge-only, stale, drifted, mismatched, or missing confirmation fails closed | producer returns candidate-bound base/head/tree and confirmation revision; consumer binds exact candidate |

```text
CAPABILITY_AVAILABILITY_RECORDS = 3
AUTHORITY_DEFINED_BUT_NOT_CONSUMABLE = 3
AUTHORITY_NOT_DEFINED = 0
NO_DOWNSTREAM_CAPABILITY_PROMOTION_WITHOUT_NEW_EVIDENCE = TRUE
```

Unit closure reconciliation:

| Unit | CAPABILITY_AVAILABILITY_RECORDS | WORK_CAN_START | LOCAL_CLOSURE | SHARED_CLOSURE_BOUNDARY |
| --- | --- | --- | --- | --- |
| DOM-IMP-01 | none required for local closure | YES; initial READY | YES | N/A |
| DOM-IMP-02 | CAP-EXEC-EXACT-VERSION-BASIS; CAP-PLAT-SNAPSHOT-PIPELINE-PROVENANCE | after IMP-01; integrated capabilities not start blockers | YES | YES — local snapshot semantics vs integrated evidence |
| DOM-IMP-03 | none required for local closure | after IMP-01/02 | YES | N/A |
| DOM-IMP-04 | CAP-PLAT-SNAPSHOT-PIPELINE-PROVENANCE | after IMP-01; integrated capability not a local blocker | YES | YES — reconstruction contract vs integrated recovery |
| DOM-IMP-05 | none required for local closure | after IMP-01/04 | YES | N/A |
| DOM-IMP-06 | none required for local closure | after IMP-04/05 | YES | N/A |
| DOM-IMP-07 | CAP-EXEC-EXACT-VERSION-BASIS; CAP-GIT-CANDIDATE-REMOTE-CONFIRMATION | after IMP-04/05; integrated capabilities not local blockers | YES | YES — local gate/vocabulary vs integrated effects |
| DOM-IMP-08 | none required for local closure | after IMP-01/05 | YES | N/A |
| DOM-IMP-09 | none required for local closure | after IMP-08 | YES | N/A |
| DOM-IMP-10 | none required for local closure; integrated contracts remain checkpoint evidence | after IMP-03/06 | YES | YES — local cutover semantics vs integrated records |
| DOM-IMP-11 | CAP-GIT-CANDIDATE-REMOTE-CONFIRMATION | after IMP-01/07; integrated capability not a local blocker | YES | YES — local drift gate vs remote evidence |
| DOM-IMP-12 | CAP-EXEC-EXACT-VERSION-BASIS; CAP-PLAT-SNAPSHOT-PIPELINE-PROVENANCE; CAP-GIT-CANDIDATE-REMOTE-CONFIRMATION, aggregated at CP-DOM-04 | after IMP-01..11; final integrated evidence remains checkpoint-blocked | YES for evaluator contract behavior | YES — evaluator contract vs final integrated proof |

Fixtures, mocks, and in-memory repositories prove local testability only and
never promote productive availability.

`UNAPPROVED_NORMATIVE_DEPENDENCIES = 0`. No foreign lifecycle or physical
persistence implementation is assigned to a DOM unit.

## 13. Dependency DAG

```text
DOM-IMP-01
├── DOM-IMP-02 ── DOM-IMP-03 ──┐
├── DOM-IMP-04 ── DOM-IMP-05 ──┼── DOM-IMP-06 ──┐
│                              ├── DOM-IMP-07 ──┼── DOM-IMP-10 ──┐
│                              └── DOM-IMP-08 ──┘                │
│                                      └── DOM-IMP-09            │
└──────────────────────── DOM-IMP-11 ──────────────────────────┤
                                                               └── DOM-IMP-12
```

Explicit edges: `IMP-01→02,04,05,08,11`; `IMP-02→03`; `IMP-03→10`;
`IMP-04→05,06,07`; `IMP-05→06,07,08`; `IMP-06→10`; `IMP-07→10,11`;
`IMP-08→09`; and `IMP-01..11→IMP-12` where required by acceptance evidence.
All edges are implementation dependencies, not new normative portfolio edges.

`DAG_CYCLE_DETECTED = NO`.

## 14. Parallelization Waves

| Wave | Units | Prerequisites | Shared collision risk | Execution mode |
| ---: | --- | --- | --- | --- |
| 1 | DOM-IMP-01 | none | canonical identity/lineage vocabulary | `SERIAL_REQUIRED` |
| 2 | DOM-IMP-02, DOM-IMP-04 | IMP-01 | snapshot/pipeline ports and identity references | `SAFE_WITH_COORDINATION` |
| 3 | DOM-IMP-03, DOM-IMP-05 | IMP-02/04 | lifecycle, command, failure, and revision seams | `SAFE_WITH_COORDINATION` |
| 4 | DOM-IMP-06, DOM-IMP-07, DOM-IMP-08 | IMP-04/05; IMP-01/05 | state/command/event vocabulary | `SAFE_WITH_COORDINATION` |
| 5 | DOM-IMP-09, DOM-IMP-10, DOM-IMP-11 | IMP-08; IMP-03/06; IMP-01/07 | cutover, round, evidence fixtures | `SAFE_WITH_COORDINATION` |
| 6 | DOM-IMP-12 | IMP-01–11 | final evaluator consumes all evidence | `SERIAL_REQUIRED` |

## 15. Integration Checkpoints

| Checkpoint | Required units | Integrated behavior | Required evidence | Unlocks |
| --- | --- | --- | --- | --- |
| CP-DOM-01 | IMP-01, IMP-02, IMP-03 | canonical identity, snapshot, eligibility, lifecycle, revision | identity/revision/recovery contract evidence | IMP-10 and consumer mappings |
| CP-DOM-02 | IMP-04, IMP-05, IMP-06, IMP-07 | state, command, ticket, publication, advancement convergence | full state/command/no-effect matrix | IMP-10, IMP-11 |
| CP-DOM-03 | IMP-08, IMP-09, IMP-10, IMP-11 | audit cycle, round, cutover, exact evidence | structured verdict, selective invalidation, temporal drift | IMP-12 |
| CP-DOM-04 | IMP-01–IMP-11 | final DOM conformance boundary | all six dimensions, integration, regressions, omissions, extrapolations | downstream conformance/publication flow |

Checkpoint evidence is integrated proof and is not copied into earlier local
acceptance criteria.

## 16. Legacy / Authority Transition

| Current path | Target authority | Read behavior | Write behavior | Migration/mapping | Owning unit |
| --- | --- | --- | --- | --- | --- |
| Historical `PipelineId` path | canonical `STAGE` identity | resolve historical aliases explicitly | no independent writes/lookups | preserve historical mapping; no productive parallel authority | IMP-01 |
| Caller-supplied ADR status/hash | canonical ADR catalog | preserve old records as evidence | reject caller authority | canonical reader before snapshot | IMP-02 |
| Scalar pipeline rehydration | provenance chain | historical state only with complete chain | reject direct later-state writes | PLAT supplies records | IMP-04 |
| Prototype lifecycle/ticket/publication state | productive DOM models | prototype remains historical evidence | no productive writes | scenario vocabulary only | IMP-03, IMP-06, IMP-07 |
| Silent ADR mutation | revision/succession | preserve old revision | reject rewrite; create successor | cutover linkage | IMP-03 |
| Downstream approvals after normative change | DOM invalidation/adjustment | preserve history | obsolete affected records; never reopen completed ticket | foreign owners persist/project | IMP-10 |
| Local publication confirmation | exact candidate/GIT evidence | preserve hash-linked evidence | DOM gates; GIT executes/confirms | consume foreign result | IMP-07, IMP-11 |
| Historical reports as approval | exact audit cycle/verdict | retain for comparison only | cannot close a new cycle | exact cycle binding | IMP-08, IMP-12 |

## 17. Test Strategy

`LOCAL_TEST_EVIDENCE` is assigned to each unit and includes direct positive,
negative, isolation, no-effect, stale, idempotency, and reconstruction tests
where applicable. Existing 33 productive tests are retained and extended;
prototype 92/92 tests remain scenario evidence only.

`INTEGRATION_TEST_EVIDENCE` is owned by CP-DOM-01 through CP-DOM-04 and covers
PLAT persistence/recovery, EXEC contracts, GIT publication evidence, REPO
mapping, BACKEND/OPS/UI projections, temporal drift, and cross-spec identity.

`FINAL_CONFORMANCE_EVIDENCE` is owned only by DOM-IMP-12 at CP-DOM-04.

Required categories represented in the plan: unit/domain invariant,
persistence-boundary mapping, application, integration, concurrency/isolation,
stale protection, idempotency, recovery/reconstruction, compatibility,
cutover/migration history, regression, conformance, and API/UI contract mapping.
Physical persistence, adapter retry, scheduler, and external-effect tests
execute under their approved owner SPECs; DOM tests verify semantic contracts.

## 18. Risk Register

| Risk | Cause | Affected units | Mitigation / gate |
| --- | --- | --- | --- |
| Duplicate authority | `PipelineId`, projection, caller, or report becomes canonical | IMP-01, 02, 04, 05, 07, 11, 12 | identity/boundary tests and authority checks |
| Stale writes/evidence | revision, chain, or candidate drift accepted | IMP-02, 03, 04, 05, 10, 11, 12 | temporal proofs, independent rereads, fail-closed commands |
| Durability mismatch | DOM meaning confused with PLAT storage/recovery | IMP-01, 02, 04, 10–12 | PCPs and integration checkpoints |
| Identity/lineage loss | aliases or operational correlation replace canonical identity | IMP-01–04, 11 | identity continuity and historical lookup tests |
| Lifecycle duplication | EXEC/GIT operational states become DOM functional states | IMP-03, 06–09 | separate state-machine and ownership tests |
| Partial cutover | invalidation overwrites history or reopens terminal tickets | IMP-03, 10, 12 | selective impact and terminality tests |
| Idempotency/concurrency loss | repeated command creates duplicate transitions/effects | IMP-01, 04–07, 09–11 | duplicate/stale/concurrency tests and PLAT contract |
| Foreign contract unavailable | downstream component not yet productive | IMP-01–12 | explicit PCP, contract fixtures, checkpoint blocking |
| Parallel collision | shared domain/event vocabulary changes concurrently | waves 2–5 | coordination and serial checkpoints |
| Ambiguous final proof | multiple units claim conformance closure | IMP-10–12 | AC-DOM-052 final owner fixed to IMP-12 |

## 19. Implementation Unit Closure Matrix

| Unit | Independently implementable | Local closure | Issue decomposition readiness | Initial DAG state | Blocked by |
| --- | --- | --- | --- | --- | --- |
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
| DOM-IMP-12 | YES | YES | ISSUE_READY | BLOCKED | IMP-01–IMP-11 |

## 20. Plan Metrics

```text
VALIDATED_GAPS = 21
LOCAL_IMPLEMENTATION_GAPS = 12
CROSS_SPEC_DEPENDENCIES = 0
PREEXISTING_FOREIGN_CAPABILITIES = 0
NO_LOCAL_WORK_GAPS = 0
INTEGRATION_OR_CONVERGENCE_GAPS = 9
FOREIGN_CONTRACT_DEPENDENCY_ROWS = 8

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
SPECULATIVE_UNITS = 0

ACCEPTANCE_OBLIGATIONS = 21
ACCEPTANCE_WITH_FINAL_PROOF_OWNER = 21
UNRESOLVED_FINAL_PROOF_OWNERS = 0
LOCAL_AC_REQUIRING_DOWNSTREAM = 0
LOCAL_AC_CONTRADICTING_DOES_NOT_IMPLEMENT = 0
LOCAL_AC_REQUIRING_UNAVAILABLE_FOREIGN_CAPABILITY = 0
LOCAL_AC_SCOPE_CONTRADICTIONS = 0

UNAPPROVED_NORMATIVE_DEPENDENCIES = 0
SPECIFICATION_GAPS = 0
ARCHITECTURE_GAPS = 0
PORTFOLIO_GAPS = 0
UPSTREAM_CONTRACT_GAPS = 0
INTEGRATED_PROOF_AVAILABILITY_RECORDS = 3

IMPLEMENTATION_UNIT_AUTHORITY_CHECK = PASS
AUTHORITY_CONSUMPTION_GAPS = 3
AUTHORITY_CONSUMPTION_GAP_EFFECT = integrated-proof only
CAPABILITY_AVAILABILITY_RECORDS = 3
CAPABILITY_AVAILABILITY_CLASSIFICATION_ERRORS = 0
NO_DOWNSTREAM_CAPABILITY_PROMOTION_WITHOUT_NEW_EVIDENCE = TRUE
TEMPORAL_AUTHORITY_GAPS = 0
UNREPRESENTED_UPSTREAM_CONTRACT_BLOCKERS = 0
READY_UNITS_WITH_UNAVAILABLE_CONTRACT = 0
UNITS_INVENTING_IDENTITY = 0
UNITS_INVENTING_LIFECYCLE = 0
UNITS_INVENTING_PROVENANCE = 0
UNITS_INVENTING_OWNERSHIP = 0
UNITS_INVENTING_RECOVERY = 0
UNITS_INVENTING_PERSISTENCE_SEMANTICS = 0
DAG_CYCLE_DETECTED = NO
```

## 21. Authority / Specification Escalations

None. The conformant SPEC and audits determine identity, lifecycle,
provenance, persistence meaning, ownership, failure semantics, compatibility,
and cross-SPEC boundaries. No implementation unit invents a normative decision.

## 22. Upstream Authority Preconditions

| Proof / gate | Result | Evidence |
| --- | --- | --- |
| `SPEC_IMPLEMENTABILITY_CHECK` | PASS | Component SPEC audit §38; Gap Matrix audit §§5, 27 |
| `AGGREGATE_IDENTITY_PROOF` | complete | Component SPEC audit §17 for `WorkflowPipeline`; SPEC §12.1 |
| `AGGREGATE_RECONSTRUCTION_PROOF` | complete | Component SPEC audit §18; SPEC pipeline provenance section |
| `LIFECYCLE_AUTHORITY_GAP` | 0 | Component SPEC audit §§15, 38 |
| `PERSISTENCE_SEMANTICS_GAP` | 0 | Component SPEC audit §§20, 38; PLAT boundary explicit |
| `CROSS_SPEC_AUTHORITY_GAP` | 0 | Component SPEC audit §§14, 21, 38 |
| `AUTHORITY_NOT_DEFINED` | 0 | accepted ADR/portfolio/SPEC chain |
| `AUTHORITY_DEFINED_BUT_NOT_CONSUMABLE` | 3 | Gap Matrix §13 capability records; integrated-proof availability only; no local-closure blocker |
| `TEMPORAL_AUTHORITY_GAP` | 0 | SPEC §13 and Gap Matrix audit §27 |

For every unit, the answer to “Todas as decisões normativas necessárias para
implementar esta unidade já existem upstream?” is `YES`. The component SPEC
defines local semantics; the portfolio defines ownership/dependencies; PLAT,
EXEC, GIT, REPO, BACKEND, OPS, and UI contracts are consumed without moving
their ownership. Missing productive foreign implementations are explicit
integration prerequisites, not authority gaps.

The plan-local `ACP-DOM-01` through `ACP-DOM-12` labels cite the same
authority-consumption result independently confirmed by Component SPEC audit
§22 and Gap Matrix audit §27; they are trace labels, not new authority. The
`PCP-*` labels are defined by the producer/consumer fields in each unit and
remain subordinate to the portfolio ownership registry.

## 23. Implementation Unit Authority Checks

| Unit | Identity | Lifecycle | Provenance | Ownership | Persistence/recovery | Result | Readiness classification |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DOM-IMP-01 | SPEC §12.1 / ADR-0001 | ADR-0001 | lineage contract | O-001/O-005 | PLAT seam | YES | READY |
| DOM-IMP-02 | ADR-0001 / IMP-01 | ADR-0001 | snapshot basis | O-002–O-004 | PLAT seam | YES | READY |
| DOM-IMP-03 | ADR-0001 | ADR-0001 | revision lineage | O-006–O-008 | PLAT evidence seam | YES | READY |
| DOM-IMP-04 | SPEC §12.1 / ADR-0002 | ADR-0002 | audit chain contract | PLAT replay seam | YES | READY |
| DOM-IMP-05 | ADR-0002 | ADR-0002 | command revision | O-011 | PLAT journal seam | YES | READY |
| DOM-IMP-06 | ADR-0002 | ticket transitions | command revision | O-012/O-013 | no new persistence meaning | YES | READY |
| DOM-IMP-07 | ADR-0002 | publication/advance | evidence references | O-014/O-015 | PLAT/GIT effects foreign | YES | READY |
| DOM-IMP-08 | ADR-0009 | audit cycle | cycle/round identity | O-049/O-050 | EXEC evidence foreign | YES | READY |
| DOM-IMP-09 | ADR-0009 | round pause/continuation | cycle revision | O-051 | EXEC scheduling foreign | YES | READY |
| DOM-IMP-10 | ADR-0009 | cutover/invalidation | revision linkage | O-053 | PLAT/GIT/EXEC records foreign | YES | READY |
| DOM-IMP-11 | ADR-0009 | gate state | exact evidence correlation | O-054 | PLAT/GIT/OPS evidence foreign | YES | READY |
| DOM-IMP-12 | ADR-0009 | conformance cycle | exact evidence/cycle | O-052 | all producer evidence foreign | YES | READY |

All rows have `IMPLEMENTATION_UNIT_AUTHORITY_CHECK = YES`. Counts:

```text
UNITS_INVENTING_IDENTITY = 0
UNITS_INVENTING_LIFECYCLE = 0
UNITS_INVENTING_PROVENANCE = 0
UNITS_INVENTING_OWNERSHIP = 0
UNITS_INVENTING_RECOVERY = 0
UNITS_INVENTING_PERSISTENCE_SEMANTICS = 0
```

## 24. Implementation Plan Gate

```text
IMPLEMENTATION_PLAN_GATE: READY_FOR_INDEPENDENT_IMPLEMENTATION_PLAN_REAUDIT
```

The plan is not self-approved. The mandatory next step is independent
`audit-component-implementation-plan`.
