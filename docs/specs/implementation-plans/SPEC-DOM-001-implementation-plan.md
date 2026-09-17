# SPEC-DOM-001 — Implementation Plan

Status: READY_FOR_ISSUE_DECOMPOSITION
Planning source: validated component Implementation Gap Matrix

This plan defines implementation decomposition only. It does not redefine
ADR, portfolio, SPEC, Gap Matrix, ownership, failure semantics, compatibility
roles, or normative dependency direction. It does not implement code, modify
tests, or modify authority artifacts. The current decomposition includes the
producer slice required to materialize the already normative command-authority
observation contract.

## 1. Status

The accepted ADR, portfolio, SPEC, and Gap Matrix gates remain unchanged. The
previous Plan state blocked DOM-IMP-05 because the current productive consumer
required a command-authority capability whose producer was not defined. This
revision resolves that decomposition defect by adding DOM-IMP-13 as the
producer/composition unit; it does not promote the capability itself.

```text
PORTFOLIO_DECOMPOSITION_APPROVED
PASS — COMPONENT_SPEC_CONFORMANT
GAP_MATRIX_CONFORMANT
READY_FOR_IMPLEMENTATION_PLAN
SPEC_IMPLEMENTABILITY_CHECK = PASS
```

`DOM-IMP-05` remains the semantic consumer and is execution-blocked until
DOM-IMP-13 is implemented, independently audited, and promoted. It is no
longer `PLAN_BLOCKED`: its producer edge is now explicit and its ticket may be
decomposed as `BLOCKED_BY_UPSTREAM_CONTRACT`.

The prior independent plan re-audit is
`docs/specs/implementation-plans/audits/SPEC-DOM-001-implementation-plan-audit-2026-09-15-reaudit-003.md`
and records `CIPA-MAJOR-001`: the current command consumer has no authorized
productive producer. This revision addresses that finding within the
DOM-owned implementation decomposition: the authority is already specified by
`O-011`/`DOM-CMD-001`, while DOM-IMP-13 owns only its productive observation
composition. A fresh independent Plan audit is required before implementation
readiness is claimed.

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
| Current HEAD at prior plan audit | `baa2a189bd71b85ba9fcc62840e52f091fc2e77e` |
| Current HEAD for this remediation | `cc4aa3b0ed31e03e0c0ef644944564d9d5f644b7`; plan edits uncommitted |
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

The plan preserves the revision-4 SPEC, current conformant Gap Matrix, and all
validated Gap identities. The current T002 design evidence exposed a planning
defect that was not represented by the archived conformant plan audit: T002
was declared locally closable before its DOM-owned authority producer. This
remediation corrects only the plan's unit contract and DAG; the Gap Matrix was
not regenerated or modified. GAP-002 remains historical only; GAP-001 and
DOM-ID-001 retain the current `PARTIAL` classification.

```text
NEW_CONFIRMED_PLAN_FINDING = T002-AUTHORITY-READER-001
BASELINE_REASSESSMENT_INPUT = current T002 implementation-design evidence
PLAN_CHANGE_SCOPE = DOM-IMP-02/03 contracts, closure, capability availability,
                     acceptance witnesses, DAG, waves, checkpoints, metrics
```

The latest independent re-audit is the mandatory source for the current
remediation:

```text
CURRENT_SOURCE_AUDIT = docs/specs/implementation-plans/audits/SPEC-DOM-001-implementation-plan-audit-2026-09-11-reaudit-001.md
CURRENT_SOURCE_AUDIT_VERDICT = IMPLEMENTATION_PLAN_REMEDIATION_REQUIRED
CURRENT_SOURCE_AUDIT_FINDINGS = CIPA-MAJOR-001, CIPA-INFO-001
CURRENT_SOURCE_AUDIT_BASIS_FINGERPRINT = 9F7D1AC96AD5F290A44AD9CC09C1AF68AA7F8DFFEA9CB60D252B22C7584F7545
CURRENT_SOURCE_AUDIT_HEAD = 6b31bcee1591c8b2e6499a434950664077b2be01
CURRENT_SOURCE_AUDIT_BASELINE_DRIFT_STATUS = DRIFT_ASSESSED
CURRENT_SOURCE_AUDIT_REASSESSMENT_COMPLETE = YES
CURRENT_SOURCE_AUDIT_FINDINGS_ARE_ACTIONABLE = YES
CURRENT_SOURCE_AUDIT_BASIS_STALE = NO
```

The prior remediation context above is retained as historical plan evidence;
the current witness, capability, and completion-evidence corrections below are
the active plan state. No authority or Gap Matrix baseline is changed.

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
| `tests/dom-001-ticket-001.test.ts`, `dom-001-ticket-002.test.ts`, `dom-001-ticket-004.test.ts` | Frozen Gap Matrix snapshot: 33 productive tests prove the current slice, not full SPEC conformance; current HEAD verification: 46/46 productive tests. | RETAIN and extend with direct witnesses; preserve the two evidence baselines distinctly. |
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
| Productive test evidence | Matrix snapshot baseline remains 33 tests; current HEAD verification is 46/46 productive tests. These are distinct evidence baselines. |

## 9. Implementation Units

The twelve original units preserve their coherent boundaries. A thirteenth
unit is added as the independently closable producer/composition slice for the
already normative command-authority contract. It does not add a new SPEC
requirement or owner, and it is not a proof-only unit. `UNIT_FORMATION_REASON`
is shown for each unit.

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
The complete mechanical PCP record is `PCP-PLAT-01` in §12.3.

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

| NORMATIVE_BEHAVIOR | NORMATIVE_VERB | CONCRETE_OPERATION_COMMAND_OR_QUERY | STATE_OR_TRANSITION_AFFECTED | DIRECT_POSITIVE_TEST | DIRECT_NEGATIVE_OR_ISOLATION_TEST | EXPECTED_EVIDENCE_FILE | EVIDENCE_TYPE | ACCEPTANCE_OWNER | REQUIRED_PRODUCER_OR_CAPABILITY | AUTHORITY_STATUS | CONTRACT_STATUS | LOCAL_TESTABILITY | PRODUCTIVE_AVAILABILITY | CAPABILITY_SUMMARY_STATUS | DEPENDENCY_CLASS | WITNESS_EXECUTABLE_AT_LOCAL_CLOSURE |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Canonical identity | creates, resolves, rehydrates | create → lookup → rehydrate canonical STAGE reference | identity registration and revision continuity | `tests/dom-001-ticket-001.test.ts` — canonical reference round-trip | same test — unknown kind/scope/revision and parallel `PipelineId` lookup rejected | `docs/specs/implementation-plans/evidence/SPEC-DOM-001/DOM-IMP-01-canonical-identity.md` | LOCAL_TEST_EVIDENCE | DOM-IMP-01 | none — unit-owned identity contract | DEFINED | DEFINED | YES | YES | CONTRACT_PRODUCTIVELY_AVAILABLE | LOCAL_IMPLEMENTATION | YES |
| Independent lineage | relates, progresses, queries | add → progress → query ADR↔SPEC relation | independent lineage progress | `tests/dom-001-ticket-001.test.ts` — isolated relation progress | same test — duplicate relation and cross-SPEC progress isolation | `docs/specs/implementation-plans/evidence/SPEC-DOM-001/DOM-IMP-01-lineage.md` | LOCAL_TEST_EVIDENCE | DOM-IMP-01 | none — unit-owned lineage contract | DEFINED | DEFINED | YES | YES | CONTRACT_PRODUCTIVELY_AVAILABLE | LOCAL_IMPLEMENTATION | YES |

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
- Local ownership: trigger, eligibility, snapshot meaning, exact version/hash binding, and consumption of the DOM-owned ADR authority contract.
- Foreign capabilities: EXEC contract versions, PLAT durable storage, REPO legacy input.
- Authority Consumption Proof: `ACP-DOM-02`; ADR lifecycle/revision/hash authority is consumed through the DOM-owned reader produced by DOM-IMP-03, never from caller fields.
- Producer / Consumer Contract Proof: `PCP-DOM-03→02` for the canonical ADR authority reader; `PCP-EXEC-01` for exact skill/contract metadata; `PCP-PLAT-02` for durable snapshot material.
- Authority consumption result: `AUTHORITY_CONSUMABLE` only after the DOM-IMP-03 producer contract is complete. It is a required internal prerequisite, not a foreign integrated-proof capability.

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

`DOM-IMP-01`, `DOM-IMP-03`.

`DOM-IMP-03` is the required authority producer. T002 consumes its canonical
ADR reference, lifecycle/status, revision, content hash, and independently
re-observable basis; T002 does not implement lifecycle authority.

### Cross-Spec Prerequisites

| Owner SPEC | Required capability | Implementation state | Blocking? |
| --- | --- | --- | --- |
| SPEC-EXEC-001 | exact skill/contract version metadata | not yet productive | No for local contract closure; Yes for integrated snapshot proof |
| SPEC-PLAT-001 | durable snapshot, journal, and recovery | not yet productive | No for local contract closure; Yes for integrated durability proof |
| SPEC-REPO-001 | legacy/manual input mapping | not yet productive | No; mapping remains foreign |

### Producer / Consumer Contract Proof

`PCP-DOM-03→02`: DOM-IMP-03 produces the canonical ADR authority read contract
with `ADRId`/canonical reference, lifecycle/status, revision, content hash, and
an independent second observation operation. DOM-IMP-02 consumes the returned
basis and performs eligibility, snapshot freezing, and drift rejection. The
producer owns lifecycle meaning; the consumer cannot supply or overwrite it.
`CAPABILITY_RECORD = CAP-DOM-ADR-AUTHORITY-READ-OBSERVATION`; dependency class
is `REQUIRED_FOR_LOCAL_EXECUTION`; availability before IMP-03 is `NO`, and
post-producer availability is conditional on
`EV-DOM-IMP-03-AUTHORITY-READER-COMPLETE`.
`PCP-EXEC-01`: EXEC-001 produces exact version/capability values; DOM consumes
and stores them in the snapshot. `PCP-PLAT-02`: PLAT produces durable snapshot
and recovery material; DOM validates semantic immutability. Foreign contracts
remain integration contracts and do not provide ADR authority.

### Temporal Authority Preconditions

`TEMPORAL_AUTHORITY_PROOF = TAP-02`: DOM-IMP-03 supplies the initial and
independent second ADR status/revision/content-hash observations; the mutation
window ends before snapshot confirmation; T002 compares the two producer
observations and rejects drift fail-closed. DOM owns semantic validation and
PLAT owns physical atomicity. `SECOND_INDEPENDENT_OBSERVATION_SUPPORTED = YES`.

### Acceptance Criteria

1. Only an explicit manual command starts processing; discovery and session
   state alone cannot start it.
2. Snapshot resolves current canonical accepted ADR data, stores exact required
   fields, and rejects false caller status/hash or later drift.
3. Rehydration returns the same immutable basis and rejects corrupt/missing
   material. `LOCAL_PROVABILITY = YES` using contract fixtures.

### Acceptance Witness Matrix

| NORMATIVE_BEHAVIOR | NORMATIVE_VERB | CONCRETE_OPERATION_COMMAND_OR_QUERY | STATE_OR_TRANSITION_AFFECTED | DIRECT_POSITIVE_TEST | DIRECT_NEGATIVE_OR_ISOLATION_TEST | EXPECTED_EVIDENCE_FILE | EVIDENCE_TYPE | ACCEPTANCE_OWNER | REQUIRED_PRODUCER_OR_CAPABILITY | AUTHORITY_STATUS | CONTRACT_STATUS | LOCAL_TESTABILITY | PRODUCTIVE_AVAILABILITY | CAPABILITY_SUMMARY_STATUS | DEPENDENCY_CLASS | WITNESS_EXECUTABLE_AT_LOCAL_CLOSURE |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Manual trigger | accepts | submit explicit manual command | manual-entry request accepted; discovery remains inert | `tests/dom-001-ticket-002.test.ts` — explicit submission | same test — discovery/session-start attempt has no effect | `docs/specs/implementation-plans/evidence/SPEC-DOM-001/DOM-IMP-02-manual-trigger.md` | LOCAL_TEST_EVIDENCE | DOM-IMP-02 | none — unit-owned manual-entry contract | DEFINED | DEFINED | YES | YES | CONTRACT_PRODUCTIVELY_AVAILABLE | LOCAL_IMPLEMENTATION | YES |
| Canonical authority observation | observes and compares | initial ADR read → independent second ADR read | authority basis before snapshot confirmation | planned direct authority-reader contract test with two reads | caller-supplied authority, fallback, self-comparison, or drift rejected | `docs/specs/implementation-plans/evidence/SPEC-DOM-001/DOM-IMP-02-authority-consumption.md` | LOCAL_TEST_EVIDENCE | DOM-IMP-02 | DOM-IMP-03 produces `CAP-DOM-ADR-AUTHORITY-READ-OBSERVATION` | DEFINED | DEFINED | YES | YES | CONTRACT_PRODUCTIVELY_AVAILABLE | REQUIRED_FOR_LOCAL_EXECUTION | YES |
| Canonical eligibility | resolves and freezes | resolve accepted revision → freeze snapshot | eligibility decision and snapshot creation | planned accepted-revision eligibility test | proposed, superseded, false caller status/hash rejected | `docs/specs/implementation-plans/evidence/SPEC-DOM-001/DOM-IMP-02-eligibility.md` | LOCAL_TEST_EVIDENCE | DOM-IMP-02 | `CAP-DOM-ADR-AUTHORITY-READ-OBSERVATION` from DOM-IMP-03 | DEFINED | DEFINED | YES | YES | CONTRACT_PRODUCTIVELY_AVAILABLE | REQUIRED_FOR_LOCAL_EXECUTION | YES |
| Immutable basis | rehydrates and rejects | rehydrate exact basis → attempt mutation | immutable snapshot fields and persistence boundary | planned exact-field round-trip contract test | mutation, drift, corrupt/missing record rejected without mutation | `docs/specs/implementation-plans/evidence/SPEC-DOM-001/DOM-IMP-02-immutable-basis.md` | LOCAL_TEST_EVIDENCE | DOM-IMP-02 | `CAP-DOM-ADR-AUTHORITY-READ-OBSERVATION` from DOM-IMP-03; PLAT durability is integrated-only | DEFINED | DEFINED | YES | YES | CONTRACT_PRODUCTIVELY_AVAILABLE | REQUIRED_FOR_LOCAL_CLOSURE | YES |

### Local Closure

`LOCAL_CLOSURE = YES` only after DOM-IMP-03 completes; local semantics and
rejection behavior are proven with the completed authority-reader contract and
approved port fixtures; physical PLAT proof is an integration checkpoint.
`T002_LOCAL_CLOSURE_WITHOUT_AUTHORITY_PRODUCER = NO`.

### Required Tests

Manual-entry negative tests, accepted-only matrix, caller-authority bypass,
mutation-window drift, immutable snapshot, exact version transport,
rehydration, corruption/missing material, idempotency, and stale revision.

### Legacy / Cutover Impact

`ADD_COMPATIBILITY_MAPPING` for historical input; `RETIRE_LEGACY_WRITES` for
caller-supplied status/hash as authority. Legacy reads remain explicit.

### Completion Evidence

Canonical snapshot command, authority reader/port, direct positive/negative
tests, `EV-DOM-IMP-02-AUTHORITY-CONSUMPTION`, and a contract fixture proving
exact persisted fields. The authority-reader producer evidence must already be
available at T002 closure.

### Risks

Caller authority bypass, snapshot drift, and confusing EXEC version metadata
with ADR lifecycle authority.

### Issue Decomposition Readiness

`ISSUE_READY`; `READINESS_CLASSIFICATION = READY`.

### Initial DAG State

`BLOCKED`; `BLOCKED_BY = DOM-IMP-01, DOM-IMP-03`.

## DOM-IMP-03 — Decision lifecycle, revision, and immutability

`UNIT_FORMATION_REASON = SHARED_AUTHORITY + SHARED_CUTOVER + SHARED_INVARIANT`.

### Goal

Implement separate decision/realization lifecycle semantics, ADR remediation
revision, immutable implemented ADRs, reciprocal succession, and history-safe
cutover.

### Authority and Ownership

- Primary SPEC: `SPEC-DOM-001` §§13 (`DOM-LIFE-001`, `DOM-REV-001`, `DOM-IMMUT-001`).
- Obligations: `O-006`, `O-007`, `O-008`; role `CANONICAL_OWNER`.
- Local ownership: decision lifecycle, revision, succession, invalidation meaning, and the canonical ADR authority read/observation contract required by snapshot consumers.
- Foreign capabilities: PLAT operational records; REPO legacy adaptation; downstream approval mappings.
- Authority Consumption Proof: `ACP-DOM-03`; authority is fully defined by ADR-0001/SPEC §§12–13.
- Producer / Consumer Contract Proof: `PCP-DOM-03→02` for the DOM-owned canonical ADR authority reader; `PCP-PLAT-03` remains the operational-evidence mapping and is not lifecycle authority.
- Authority consumption result: `AUTHORITY_CONSUMABLE`; this unit is the producer for T002 and must complete before T002 can start or close.

### Gap Matrix Coverage

`GAP-007`, `GAP-008`, `GAP-009`; requirements `DOM-LIFE-001`, `DOM-REV-001`,
`DOM-IMMUT-001`; acceptance `AC-DOM-006`–`AC-DOM-008`.

### Portfolio Obligation Coverage

`O-006`, `O-007`, `O-008`.

### Validated Delta

```text
OBSERVED: no productive ADR lifecycle, remediation revision, succession,
          implemented immutability boundary, or canonical authority reader exists.
REQUIRED: decision and realization lifecycles stay separate; changed accepted
          ADRs receive new revision/history; implemented ADRs cannot be rewritten;
          consumers can obtain canonical ADR reference, lifecycle/status, revision,
          content hash, and an independent second observation.
DELTA:    add the DOM lifecycle/cutover authority and its read/observation
          contract, then connect operational evidence without putting that
          evidence in the ADR document. This is supporting producer work for
          GAP-005, not a new Gap or a transfer of GAP-005 ownership from T002.
```

### Required Behavior

`LOCAL_BEHAVIOR`: authorized lifecycle transitions, revision/successor linkage,
canonical ADR authority observations, independent temporal re-observation,
derived eligibility invalidation, and mutation rejection are enforced.
`END_TO_END_CONTRIBUTION`: consumers observe linked history and obsolete
derived decisions without reopening completed work.

### Does Not Implement

Snapshot trigger/eligibility decisions, snapshot construction, physical
evidence storage, REPO migration mechanics, downstream approval registries,
execution lifecycle, Git publication, or ticket reopening. T002 consumes this
unit's authority observations; it does not become a lifecycle authority.

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

`DOM-IMP-01`.

The former `DOM-IMP-02` prerequisite was a consumer-before-producer inversion
and is removed. DOM-IMP-03 is independently closable after canonical identity
and does not require snapshot implementation.

### Cross-Spec Prerequisites

| Owner SPEC | Required capability | Implementation state | Blocking? |
| --- | --- | --- | --- |
| SPEC-PLAT-001 | durable operational evidence | not yet productive | No for local semantic closure |
| SPEC-REPO-001 | legacy revision/adaptation | not yet productive | No; local cutover contract is deterministic |

### Producer / Consumer Contract Proof

`PCP-DOM-03→02`: this unit produces the DOM-owned canonical ADR authority
reader/read contract. Each observation returns the canonical ADR reference,
lifecycle/status, revision, and content hash; the reader supports a second
independent temporal observation rather than self-comparing a caller draft.
`CAPABILITY_RECORD = CAP-DOM-ADR-AUTHORITY-READ-OBSERVATION`; authority and
contract status are defined, semantic status is DOM-owned, and productive
availability is promoted only by `EV-DOM-IMP-03-AUTHORITY-READER-COMPLETE`.
`PCP-PLAT-03`: PLAT produces persistent operational evidence keyed by DOM
identity/revision; DOM consumes only the record reference. `PCP-REPO-01`:
REPO produces legacy mapping; DOM consumes mapped canonical references. Neither
foreign contract supplies lifecycle authority.

### Temporal Authority Preconditions

`TAP-03`: observe accepted ADR reference/status/revision/content hash before
remediation, independently reobserve at commit, reject if revision/content
changed, preserve prior state, and let DOM own semantic invalidation while PLAT
owns atomic record storage. This producer capability is consumed by `TAP-02`
in DOM-IMP-02.

### Acceptance Criteria

1. Decision and realization lifecycle operations are independent and cannot
   silently mutate one another.
2. Remediation produces a new revision with reciprocal lineage and invalidates
   derived eligibility.
3. Implemented ADR mutation is rejected and operational fields remain in the
   persistent record boundary. `LOCAL_PROVABILITY = YES`.

### Acceptance Witness Matrix

| NORMATIVE_BEHAVIOR | NORMATIVE_VERB | CONCRETE_OPERATION_COMMAND_OR_QUERY | STATE_OR_TRANSITION_AFFECTED | DIRECT_POSITIVE_TEST | DIRECT_NEGATIVE_OR_ISOLATION_TEST | EXPECTED_EVIDENCE_FILE | EVIDENCE_TYPE | ACCEPTANCE_OWNER | REQUIRED_PRODUCER_OR_CAPABILITY | AUTHORITY_STATUS | CONTRACT_STATUS | LOCAL_TESTABILITY | PRODUCTIVE_AVAILABILITY | CAPABILITY_SUMMARY_STATUS | DEPENDENCY_CLASS | WITNESS_EXECUTABLE_AT_LOCAL_CLOSURE |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Separate lifecycles | transitions | decision command and realization command independently | decision and realization state machines | planned lifecycle isolation test | execution attempting decision mutation is rejected | `docs/specs/implementation-plans/evidence/SPEC-DOM-001/DOM-IMP-03-lifecycle.md` | LOCAL_TEST_EVIDENCE | DOM-IMP-03 | none — unit-owned lifecycle contract | DEFINED | DEFINED | YES | YES | CONTRACT_PRODUCTIVELY_AVAILABLE | LOCAL_IMPLEMENTATION | YES |
| Canonical ADR authority producer | observes and re-observes | canonical ADR reader initial read → independent second read | authority observation basis and temporal validity | planned two-observation producer test | caller authority, fallback, self-comparison rejected | `docs/specs/implementation-plans/evidence/SPEC-DOM-001/DOM-IMP-03-authority-reader.md` | LOCAL_TEST_EVIDENCE | DOM-IMP-03 | produces `CAP-DOM-ADR-AUTHORITY-READ-OBSERVATION` for DOM-IMP-02 | DEFINED | DEFINED | YES | YES | CONTRACT_PRODUCTIVELY_AVAILABLE | LOCAL_IMPLEMENTATION | YES |
| Revision/cutover | creates and links | remediate accepted ADR → create successor | ADR revision, reciprocal succession, derived eligibility | planned revision/succession test | stale eligibility and missing reciprocal link rejected | `docs/specs/implementation-plans/evidence/SPEC-DOM-001/DOM-IMP-03-revision.md` | LOCAL_TEST_EVIDENCE | DOM-IMP-03 | none — unit-owned revision contract | DEFINED | DEFINED | YES | YES | CONTRACT_PRODUCTIVELY_AVAILABLE | LOCAL_IMPLEMENTATION | YES |
| Immutability | rejects | update implemented ADR | immutable implemented record | planned immutable-record rejection test | document metadata mutation attempt rejected | `docs/specs/implementation-plans/evidence/SPEC-DOM-001/DOM-IMP-03-immutability.md` | LOCAL_TEST_EVIDENCE | DOM-IMP-03 | none — unit-owned immutable-record contract | DEFINED | DEFINED | YES | YES | CONTRACT_PRODUCTIVELY_AVAILABLE | LOCAL_IMPLEMENTATION | YES |

### Local Closure

`LOCAL_CLOSURE = YES`; all local transitions, authority observations, and
invalidation semantics are testable without a physical store or downstream
approval implementation. T002 is not required for this unit's closure.

### Required Tests

Lifecycle isolation, valid/invalid transitions, revision lineage, eligibility
invalidation, reciprocal succession, immutable implemented ADR, metadata
boundary, stale replay, and idempotency tests.

### Legacy / Cutover Impact

`PRESERVE_LEGACY_READS`; `RETIRE_LEGACY_WRITES` for silent ADR mutation;
REPO-owned legacy adaptation remains external.

### Completion Evidence

Lifecycle/revision aggregate and commands, history-safe records, the canonical
authority-reader contract, `EV-DOM-IMP-03-AUTHORITY-READER-COMPLETE`, direct
positive/negative tests, and cutover mapping contract.

### Risks

Lifecycle conflation, history overwrite, and treating operational hashes as
normative ADR document content.

### Issue Decomposition Readiness

`ISSUE_READY`; `READINESS_CLASSIFICATION = READY`.

### Initial DAG State

`BLOCKED`; `BLOCKED_BY = DOM-IMP-01`.

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

| NORMATIVE_BEHAVIOR | NORMATIVE_VERB | CONCRETE_OPERATION_COMMAND_OR_QUERY | STATE_OR_TRANSITION_AFFECTED | DIRECT_POSITIVE_TEST | DIRECT_NEGATIVE_OR_ISOLATION_TEST | EXPECTED_EVIDENCE_FILE | EVIDENCE_TYPE | ACCEPTANCE_OWNER | REQUIRED_PRODUCER_OR_CAPABILITY | AUTHORITY_STATUS | CONTRACT_STATUS | LOCAL_TESTABILITY | PRODUCTIVE_AVAILABILITY | CAPABILITY_SUMMARY_STATUS | DEPENDENCY_CLASS | WITNESS_EXECUTABLE_AT_LOCAL_CLOSURE |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Ordered pipeline | advances and rehydrates | advance initial stage → rehydrate immediate valid chain | pipeline order and state transition | `tests/dom-001-ticket-004.test.ts` — valid immediate chain | same test — skipped phase and later-stage shortcut rejected | `docs/specs/implementation-plans/evidence/SPEC-DOM-001/DOM-IMP-04-order.md` | LOCAL_TEST_EVIDENCE | DOM-IMP-04 | none — unit-owned pipeline transition contract | DEFINED | DEFINED | YES | YES | CONTRACT_PRODUCTIVELY_AVAILABLE | LOCAL_IMPLEMENTATION | YES |
| Reconstruction | rehydrates and rejects | rehydrate complete provenance chain | persisted state reconstruction and integrity | `tests/dom-001-ticket-004.test.ts` — complete chain fixture | same test — missing, duplicate, reordered, divergent, forged chain rejected | `docs/specs/implementation-plans/evidence/SPEC-DOM-001/DOM-IMP-04-reconstruction.md` | LOCAL_TEST_EVIDENCE | DOM-IMP-04 | none — DOM reconstruction contract; `CAP-PLAT-SNAPSHOT-PIPELINE-PROVENANCE` is integrated evidence only | DEFINED | DEFINED | YES | YES | CONTRACT_PRODUCTIVELY_AVAILABLE | LOCAL_IMPLEMENTATION | YES |

### Local Closure

`LOCAL_CLOSURE = YES`; DOM-owned contract fixtures provide records and all
semantic rejection cases are local. Durable PLAT replay is integrated evidence
only and has no local foreign-contract harness.

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

### Command-authority capability boundary

The current productive command implementation consumes the DOM-owned
`CommandAuthorityReader` contract. The required capability is
`CAP-DOM-COMMAND-AUTHORITY-OBSERVATION`; it includes the canonical stage
identity, aggregate revision, stage, complete command precondition evidence,
and dependency/verdict freshness. Its semantic owner is `SPEC-DOM-001` under
`O-011`/`DOM-CMD-001`.

`DOM-IMP-13` now produces this capability through the productive command
authority observation composition. It is not an owner of ADR authority,
pipeline identity, persistence, or transport: it reads those canonical
inputs through their existing boundaries and materializes the single command
observation consumed by T005. `DOM-IMP-03` and TICKET-003 remain limited to
`CAP-DOM-ADR-AUTHORITY-READ-OBSERVATION` for DOM-IMP-02. No caller claim,
default, fixture, mock, fake, or T005-local authority is permitted.

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

`DOM-IMP-01`, `DOM-IMP-04`, and `DOM-IMP-13`. No valid `DOM-IMP-03 →
DOM-IMP-05` producer edge exists; T003 remains an ADR-authority producer only.

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

| NORMATIVE_BEHAVIOR | NORMATIVE_VERB | CONCRETE_OPERATION_COMMAND_OR_QUERY | STATE_OR_TRANSITION_AFFECTED | DIRECT_POSITIVE_TEST | DIRECT_NEGATIVE_OR_ISOLATION_TEST | EXPECTED_EVIDENCE_FILE | EVIDENCE_TYPE | ACCEPTANCE_OWNER | REQUIRED_PRODUCER_OR_CAPABILITY | AUTHORITY_STATUS | CONTRACT_STATUS | LOCAL_TESTABILITY | PRODUCTIVE_AVAILABILITY | CAPABILITY_SUMMARY_STATUS | DEPENDENCY_CLASS | WITNESS_EXECUTABLE_AT_LOCAL_CLOSURE |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Command preconditions | executes and rejects | execute each canonical command family | command transition and rejection state | planned command test — valid transition result | same test — stale/invalid/closed/verdict mismatch rejected | `docs/specs/implementation-plans/evidence/SPEC-DOM-001/DOM-IMP-05-commands.md` | LOCAL_TEST_EVIDENCE | DOM-IMP-05 | `CAP-DOM-COMMAND-AUTHORITY-OBSERVATION`; DOM-IMP-13/TICKET-013 promotion pending | DEFINED | DEFINED | YES | NO | CONTRACT_TESTABLE_LOCALLY | REQUIRED_FOR_LOCAL_EXECUTION | NO |
| Failure meaning | maps | map canonical command result | failure code/flags and no-effect outcome | planned mapping contract test — stable code/flags | same test — mapping rename or retry mutation rejected | `docs/specs/implementation-plans/evidence/SPEC-DOM-001/DOM-IMP-05-failure-mapping.md` | LOCAL_TEST_EVIDENCE | DOM-IMP-05 | `CAP-DOM-COMMAND-AUTHORITY-OBSERVATION`; DOM-IMP-13/TICKET-013 promotion pending | DEFINED | DEFINED | YES | NO | CONTRACT_TESTABLE_LOCALLY | REQUIRED_FOR_LOCAL_EXECUTION | NO |

### Local Closure

`LOCAL_CLOSURE = NO` at the current baseline because
`PRODUCTIVE_AVAILABILITY(CAP-DOM-COMMAND-AUTHORITY-OBSERVATION) = NO` until
DOM-IMP-13 is implemented, audited, composed, and promoted. Contract doubles
establish local testability only.

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

`ISSUE_READY`; `READINESS_CLASSIFICATION = ISSUE_READY`. Execution remains
blocked until DOM-IMP-13/TICKET-013 promotes
`CAP-DOM-COMMAND-AUTHORITY-OBSERVATION`.

### Initial DAG State

`BLOCKED`; `BLOCKED_BY = DOM-IMP-01, DOM-IMP-04,
DOM-IMP-13:CAP-DOM-COMMAND-AUTHORITY-OBSERVATION:PRODUCTIVE_AVAILABILITY_NO`.

## DOM-IMP-13 — Canonical command-authority observation

`UNIT_FORMATION_REASON = MANDATORY_PRODUCER_CONSUMER_BOUNDARY +
INDEPENDENTLY_CLOSABLE_SUBWORK`.

### Goal

Materialize the single productive DOM-owned observation consumed by
`CommandAuthorityReader`, preserving canonical identity, pipeline revision and
stage, complete command precondition evidence, freshness, and independent
re-observation. This unit supplies authority; it does not execute or validate
the command and does not move ownership from any existing DOM unit.

### Authority and Ownership

- Primary SPEC: `SPEC-DOM-001` §13 (`DOM-CMD-001`).
- Portfolio obligation: `O-011`; DOM remains `CANONICAL_OWNER`.
- Semantic source: canonical DOM identity, lifecycle, pipeline, dependency
  closure, and verdict state as required by `DOM-CMD-001`.
- Productive layer: a DOM-owned domain/application composition boundary that
  implements the existing `CommandAuthorityReader` port. The port remains a
  consumer-facing read contract; this unit is its sole productive producer.
- `DOM-IMP-03`/TICKET-003 is not this unit. It produces only
  `CAP-DOM-ADR-AUTHORITY-READ-OBSERVATION`.
- T005 remains the command policy/consumer. It must not acquire, reconstruct,
  default, or duplicate the authority represented here.

### Gap and Acceptance Coverage

Producer slice of `GAP-011` and `GAP-012`; requirement `DOM-CMD-001`;
producer evidence for `AC-DOM-011`. The semantic acceptance owner remains
DOM-IMP-05/TICKET-005.

### Capability Produced

`CAP-DOM-COMMAND-AUTHORITY-OBSERVATION`.

The produced `CommandAuthorityObservation` contains, without caller
substitution or lossy mapping:

- canonical `STAGE` identity;
- current aggregate `PipelineRevision` and stage;
- complete `CommandPreconditionEvidence` for SPEC knowledge, revision
  eligibility, dependency closure, and verdict compatibility;
- dependency and verdict freshness revisions;
- enough immutable basis for the consumer's first observation and independent
  second observation immediately before commit.

The producer represents superseded, revoked, invalidated, stale, missing, or
incompatible authority through the existing typed statuses and absence/fail-
closed behavior. It does not introduce a new failure family or infer a valid
state from absence.

### Authority Source and Boundary

The authority source is the DOM-owned canonical command-authority state
assembled from the existing identity and pipeline boundaries plus the
canonical lifecycle, dependency-closure, and verdict facts required by
`DOM-CMD-001`. DOM-IMP-13 owns the observation composition and translation to
`CommandAuthorityReader`; it does not become the owner of ADR authority,
physical persistence, transport, or external execution. The productive source
must be explicit and runtime-wired. Caller claims, defaults, projections,
fixtures, mocks, fakes, and self-comparison are forbidden as source authority.

### Required Inputs and Outputs

| Direction | Contract | Owner / boundary | Use |
| --- | --- | --- | --- |
| input | canonical identity resolution | DOM-IMP-01 | reject unknown, detached, or wrong-kind targets |
| input | current pipeline state, aggregate revision, and accepted provenance | DOM-IMP-04 | preserve identity/stage/revision continuity |
| input | canonical command lifecycle/revision, dependency-closure, and verdict facts | DOM-owned authority state under `O-011` | produce complete precondition evidence and freshness |
| output | `CommandAuthorityReader.observe(CanonicalIdentityReference)` | DOM-IMP-13 | return one immutable command-authority observation or no observation |
| consumer | `CommandPreconditionPolicy` and command boundary | DOM-IMP-05/TICKET-005 | validate first observation and independent pre-commit reread |

No input is allowed to be filled with an authority default. If a required
source is unknown, missing, stale, superseded, revoked, or inconsistent, the
producer returns no valid observation and the consumer fails closed.

### Productive Availability Dimensions

```text
CONTRACT_AVAILABLE = YES
LOCAL_TESTABILITY_AVAILABLE = YES after producer contract tests
PRODUCTIVE_IMPLEMENTATION_AVAILABLE = NO at current baseline
PRODUCTIVE_COMPOSITION_AVAILABLE = NO at current baseline
INTEGRATED_PROOF_AVAILABLE = NO at current baseline
DEPENDENCY_CLASS = REQUIRED_FOR_LOCAL_EXECUTION
LOCAL_CLOSURE_BLOCKING_FOR_T005 = YES
```

The capability changes to productively available only after TICKET-013 has a
non-test implementation, runtime composition, first-read/second-read
evidence, independent audit, and an explicit promotion record. T013's own
local closure is independently closable after its productive implementation
and direct evidence; T005 remains blocked until the promotion handoff.

### Acceptance Criteria

1. A productive reader returns the complete canonical observation for a known
   stage and preserves identity, stage, aggregate revision, preconditions, and
   freshness exactly.
2. Unknown, detached, superseded, revoked, invalidated, stale, incomplete, or
   inconsistent authority never becomes an eligible/compatible observation.
3. A second read is obtained independently from the canonical source; a
   changed aggregate state, dependency revision, verdict revision, or
   precondition is observable before commit.
4. A runtime composition/factory injects the productive reader into the
   application command boundary. Test-only readers are not part of the
   composition.
5. No caller claim, default, ADR-only observation, projection, fixture, mock,
   or fake can establish command authority.

### Evidence Required for Capability Promotion

- `EV-DOM-IMP-13-AUTHORITY-READER-COMPLETE`: productive implementation returns
  identity, revision, stage, all four precondition statuses, and both freshness
  revisions.
- `EV-DOM-IMP-13-COMPOSITION`: non-test runtime factory/registration wires the
  productive reader to the command boundary.
- `EV-DOM-IMP-13-TEMPORAL-REOBSERVATION`: first read and independent second
  read prove stale/revoked/superseded/dependency/verdict drift is rejected by
  the existing consumer contract.
- `EV-DOM-IMP-13-BOUNDARY-NEGATIVE`: caller authority, default, projection,
  test double, missing source, and self-comparison are rejected or ignored.
- independent producer implementation audit and the affected T005 audit
  reference the same implementation baseline.
- `PROMO-DOM-COMMAND-AUTHORITY-01` records previous/new availability,
  capability summary, evidence owner, exact baseline/commit, producer and
  consumer, and the promotion preconditions.

### Internal Prerequisites and Successors

`DOM-IMP-01` and `DOM-IMP-04` are real input precedences. There is no
`DOM-IMP-03 → DOM-IMP-13` producer substitution: T003's ADR observation is a
different capability. `DOM-IMP-13` precedes `DOM-IMP-05`; T005 then precedes
the command-dependent units `DOM-IMP-06`, `DOM-IMP-07`, `DOM-IMP-08`, and the
final evaluator chain.

### Issue Decomposition Readiness

`ISSUE_READY`; `READINESS_CLASSIFICATION = ISSUE_READY`. The producer ticket
is independently implementable from this unit contract. Its current execution
state is `READY` because its declared identity/pipeline prerequisites are
already represented by T001/T004; the capability it will produce remains
unavailable until implementation and promotion.

### Initial DAG State

`READY` after T001/T004; `PRODUCES =
CAP-DOM-COMMAND-AUTHORITY-OBSERVATION`; `UNBLOCKS = DOM-IMP-05/TICKET-005`.

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

| NORMATIVE_BEHAVIOR | NORMATIVE_VERB | CONCRETE_OPERATION_COMMAND_OR_QUERY | STATE_OR_TRANSITION_AFFECTED | DIRECT_POSITIVE_TEST | DIRECT_NEGATIVE_OR_ISOLATION_TEST | EXPECTED_EVIDENCE_FILE | EVIDENCE_TYPE | ACCEPTANCE_OWNER | REQUIRED_PRODUCER_OR_CAPABILITY | AUTHORITY_STATUS | CONTRACT_STATUS | LOCAL_TESTABILITY | PRODUCTIVE_AVAILABILITY | CAPABILITY_SUMMARY_STATUS | DEPENDENCY_CLASS | WITNESS_EXECUTABLE_AT_LOCAL_CLOSURE |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Six states | creates and restores | create/restore ticket aggregate | six-state ticket lifecycle | planned ticket state test — each valid state | same test — unknown/operational state rejected | `docs/specs/implementation-plans/evidence/SPEC-DOM-001/DOM-IMP-06-states.md` | LOCAL_TEST_EVIDENCE | DOM-IMP-06 | none — unit-owned ticket state contract | DEFINED | DEFINED | YES | YES | CONTRACT_PRODUCTIVELY_AVAILABLE | LOCAL_IMPLEMENTATION | YES |
| Eight transitions | transitions | execute each transition command | eight authorized ticket transitions | planned transition matrix test — all eight rows | same test — invalid, terminal, and reopen transitions rejected | `docs/specs/implementation-plans/evidence/SPEC-DOM-001/DOM-IMP-06-transitions.md` | LOCAL_TEST_EVIDENCE | DOM-IMP-06 | none — unit-owned ticket transition contract | DEFINED | DEFINED | YES | YES | CONTRACT_PRODUCTIVELY_AVAILABLE | LOCAL_IMPLEMENTATION | YES |

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

| NORMATIVE_BEHAVIOR | NORMATIVE_VERB | CONCRETE_OPERATION_COMMAND_OR_QUERY | STATE_OR_TRANSITION_AFFECTED | DIRECT_POSITIVE_TEST | DIRECT_NEGATIVE_OR_ISOLATION_TEST | EXPECTED_EVIDENCE_FILE | EVIDENCE_TYPE | ACCEPTANCE_OWNER | REQUIRED_PRODUCER_OR_CAPABILITY | AUTHORITY_STATUS | CONTRACT_STATUS | LOCAL_TESTABILITY | PRODUCTIVE_AVAILABILITY | CAPABILITY_SUMMARY_STATUS | DEPENDENCY_CLASS | WITNESS_EXECUTABLE_AT_LOCAL_CLOSURE |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Publication vocabulary | distinguishes | candidate → approval → integration → PR state transitions | DOM publication state vs remote merge confirmation | planned publication state test — vocabulary transitions | same test — merge is not treated as remote confirmation | `docs/specs/implementation-plans/evidence/SPEC-DOM-001/DOM-IMP-07-publication.md` | LOCAL_TEST_EVIDENCE | DOM-IMP-07 | none — DOM publication vocabulary; `CAP-GIT-CANDIDATE-REMOTE-CONFIRMATION` is integrated evidence only | DEFINED | DEFINED | YES | YES | CONTRACT_PRODUCTIVELY_AVAILABLE | LOCAL_IMPLEMENTATION | YES |
| Advancement gate | advances and cancels | advance/cancel with formal verdict | advancement, dependency closure, cooperative cancellation | planned gate test — formal verdict and closure | same test — no verdict, closed dependency, non-cooperative cancel rejected | `docs/specs/implementation-plans/evidence/SPEC-DOM-001/DOM-IMP-07-advancement.md` | LOCAL_TEST_EVIDENCE | DOM-IMP-07 | none — DOM advancement contract; `CAP-EXEC-EXACT-VERSION-BASIS` and `CAP-GIT-CANDIDATE-REMOTE-CONFIRMATION` are integrated evidence only | DEFINED | DEFINED | YES | YES | CONTRACT_PRODUCTIVELY_AVAILABLE | LOCAL_IMPLEMENTATION | YES |

### Local Closure

`LOCAL_CLOSURE = YES`; local state/gate behavior uses DOM-owned contract
fixtures; foreign EXEC/GIT outcomes are integrated evidence only and have no
local foreign-contract harness;
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

| NORMATIVE_BEHAVIOR | NORMATIVE_VERB | CONCRETE_OPERATION_COMMAND_OR_QUERY | STATE_OR_TRANSITION_AFFECTED | DIRECT_POSITIVE_TEST | DIRECT_NEGATIVE_OR_ISOLATION_TEST | EXPECTED_EVIDENCE_FILE | EVIDENCE_TYPE | ACCEPTANCE_OWNER | REQUIRED_PRODUCER_OR_CAPABILITY | AUTHORITY_STATUS | CONTRACT_STATUS | LOCAL_TESTABILITY | PRODUCTIVE_AVAILABILITY | CAPABILITY_SUMMARY_STATUS | DEPENDENCY_CLASS | WITNESS_EXECUTABLE_AT_LOCAL_CLOSURE |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Cycle identity | creates and opens | create/open audit cycle | artifact, cycle, and round identity | planned cycle identity test — distinct records | same test — implicit reuse or wrong revision rejected | `docs/specs/implementation-plans/evidence/SPEC-DOM-001/DOM-IMP-08-cycle-identity.md` | LOCAL_TEST_EVIDENCE | DOM-IMP-08 | none — unit-owned audit-cycle identity contract | DEFINED | DEFINED | YES | YES | CONTRACT_PRODUCTIVELY_AVAILABLE | LOCAL_IMPLEMENTATION | YES |
| Structured closure | closes and rejects | close exact audit cycle with verdict | cycle closure and verdict state | planned verdict closure test — exact verdict | same test — remediation-only, no-findings, or wrong-cycle close rejected | `docs/specs/implementation-plans/evidence/SPEC-DOM-001/DOM-IMP-08-structured-closure.md` | LOCAL_TEST_EVIDENCE | DOM-IMP-08 | none — unit-owned structured verdict contract | DEFINED | DEFINED | YES | YES | CONTRACT_PRODUCTIVELY_AVAILABLE | LOCAL_IMPLEMENTATION | YES |

### Local Closure

`LOCAL_CLOSURE = YES`; local cycle semantics use DOM-owned contract fixtures;
EXEC evidence is integrated-only and has no local foreign-contract harness.

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

| NORMATIVE_BEHAVIOR | NORMATIVE_VERB | CONCRETE_OPERATION_COMMAND_OR_QUERY | STATE_OR_TRANSITION_AFFECTED | DIRECT_POSITIVE_TEST | DIRECT_NEGATIVE_OR_ISOLATION_TEST | EXPECTED_EVIDENCE_FILE | EVIDENCE_TYPE | ACCEPTANCE_OWNER | REQUIRED_PRODUCER_OR_CAPABILITY | AUTHORITY_STATUS | CONTRACT_STATUS | LOCAL_TESTABILITY | PRODUCTIVE_AVAILABILITY | CAPABILITY_SUMMARY_STATUS | DEPENDENCY_CLASS | WITNESS_EXECUTABLE_AT_LOCAL_CLOSURE |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Round limit | pauses | record tenth round and pause affected unit | round count and affected-unit pause | planned round policy test — tenth round pause | same test — ninth/elevated or cross-unit pause rejected | `docs/specs/implementation-plans/evidence/SPEC-DOM-001/DOM-IMP-09-round-limit.md` | LOCAL_TEST_EVIDENCE | DOM-IMP-09 | none — unit-owned round policy contract | DEFINED | DEFINED | YES | YES | CONTRACT_PRODUCTIVELY_AVAILABLE | LOCAL_IMPLEMENTATION | YES |
| Continuation | authorizes | authorize explicit next round | continuation authorization and cycle identity | planned continuation test — explicit command | same test — implicit continuation or wrong-cycle authorization rejected | `docs/specs/implementation-plans/evidence/SPEC-DOM-001/DOM-IMP-09-continuation.md` | LOCAL_TEST_EVIDENCE | DOM-IMP-09 | none — unit-owned continuation authorization contract | DEFINED | DEFINED | YES | YES | CONTRACT_PRODUCTIVELY_AVAILABLE | LOCAL_IMPLEMENTATION | YES |

### Local Closure

`LOCAL_CLOSURE = YES`; local scheduling semantics use a DOM-owned contract
fixture; EXEC scheduling evidence is integrated-only.

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

| NORMATIVE_BEHAVIOR | NORMATIVE_VERB | CONCRETE_OPERATION_COMMAND_OR_QUERY | STATE_OR_TRANSITION_AFFECTED | DIRECT_POSITIVE_TEST | DIRECT_NEGATIVE_OR_ISOLATION_TEST | EXPECTED_EVIDENCE_FILE | EVIDENCE_TYPE | ACCEPTANCE_OWNER | REQUIRED_PRODUCER_OR_CAPABILITY | AUTHORITY_STATUS | CONTRACT_STATUS | LOCAL_TESTABILITY | PRODUCTIVE_AVAILABILITY | CAPABILITY_SUMMARY_STATUS | DEPENDENCY_CLASS | WITNESS_EXECUTABLE_AT_LOCAL_CLOSURE |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Selective invalidation | invalidates | apply normative revision to affected approvals | affected approval status and unrelated approval isolation | planned cutover test — affected approval obsolete | same test — unrelated approval remains valid; foreign records are integrated-only | `docs/specs/implementation-plans/evidence/SPEC-DOM-001/DOM-IMP-10-selective-invalidation.md` | LOCAL_TEST_EVIDENCE | DOM-IMP-10 | none for local semantics; PLAT/GIT/EXEC records are integrated evidence | DEFINED | DEFINED | YES | YES | CONTRACT_PRODUCTIVELY_AVAILABLE | LOCAL_IMPLEMENTATION | YES |
| Terminal preservation | creates and preserves | create linked adjustment | completed-ticket terminal state | planned terminality test — linked new adjustment | same test — completed ticket reopen attempt rejected | `docs/specs/implementation-plans/evidence/SPEC-DOM-001/DOM-IMP-10-terminality.md` | LOCAL_TEST_EVIDENCE | DOM-IMP-10 | none — unit-owned terminality contract | DEFINED | DEFINED | YES | YES | CONTRACT_PRODUCTIVELY_AVAILABLE | LOCAL_IMPLEMENTATION | YES |

### Local Closure

`LOCAL_CLOSURE = YES`; local invalidation/terminality behavior is independently
auditable with DOM-owned fixtures; foreign stores are integrated evidence only
and have no local foreign-contract harness.

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

| NORMATIVE_BEHAVIOR | NORMATIVE_VERB | CONCRETE_OPERATION_COMMAND_OR_QUERY | STATE_OR_TRANSITION_AFFECTED | DIRECT_POSITIVE_TEST | DIRECT_NEGATIVE_OR_ISOLATION_TEST | EXPECTED_EVIDENCE_FILE | EVIDENCE_TYPE | ACCEPTANCE_OWNER | REQUIRED_PRODUCER_OR_CAPABILITY | AUTHORITY_STATUS | CONTRACT_STATUS | LOCAL_TESTABILITY | PRODUCTIVE_AVAILABILITY | CAPABILITY_SUMMARY_STATUS | DEPENDENCY_CLASS | WITNESS_EXECUTABLE_AT_LOCAL_CLOSURE |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Exact candidate | authorizes | authorize candidate with exact base/head/tree binding | candidate identity and evidence binding | planned candidate gate test — exact binding accepted | same test — changed base/head/tree/evidence rejected | `docs/specs/implementation-plans/evidence/SPEC-DOM-001/DOM-IMP-11-exact-candidate.md` | LOCAL_TEST_EVIDENCE | DOM-IMP-11 | none — DOM candidate gate contract; `CAP-GIT-CANDIDATE-REMOTE-CONFIRMATION` is integrated evidence only | DEFINED | DEFINED | YES | YES | CONTRACT_PRODUCTIVELY_AVAILABLE | LOCAL_IMPLEMENTATION | YES |
| Temporal drift | revalidates and rejects | revalidate candidate before effect | independent second observation and effect gate | planned temporal proof test — unchanged independent observation | same test — drift or one-snapshot reuse rejected | `docs/specs/implementation-plans/evidence/SPEC-DOM-001/DOM-IMP-11-temporal-drift.md` | LOCAL_TEST_EVIDENCE | DOM-IMP-11 | none — DOM temporal gate contract; `CAP-GIT-CANDIDATE-REMOTE-CONFIRMATION` is integrated evidence only | DEFINED | DEFINED | YES | YES | CONTRACT_PRODUCTIVELY_AVAILABLE | LOCAL_IMPLEMENTATION | YES |

### Local Closure

`LOCAL_CLOSURE = YES`; temporal gate and hash-link semantics execute against
DOM-owned contract fixtures; real Git/PLAT/OPS evidence is an integration
checkpoint and has no local foreign-contract harness.

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

| NORMATIVE_BEHAVIOR | NORMATIVE_VERB | CONCRETE_OPERATION_COMMAND_OR_QUERY | STATE_OR_TRANSITION_AFFECTED | DIRECT_POSITIVE_TEST | DIRECT_NEGATIVE_OR_ISOLATION_TEST | EXPECTED_EVIDENCE_FILE | EVIDENCE_TYPE | ACCEPTANCE_OWNER | REQUIRED_PRODUCER_OR_CAPABILITY | AUTHORITY_STATUS | CONTRACT_STATUS | LOCAL_TESTABILITY | PRODUCTIVE_AVAILABILITY | CAPABILITY_SUMMARY_STATUS | DEPENDENCY_CLASS | WITNESS_EXECUTABLE_AT_LOCAL_CLOSURE |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Final dimensions | evaluates | evaluate exact cycle against six conformance dimensions | cycle binding and dimension evidence | planned evaluator contract test — complete fixture | same test — omitted/extrapolated/integrated failure returns findings | `docs/specs/implementation-plans/evidence/SPEC-DOM-001/DOM-IMP-12-evaluator-contract.md` | LOCAL_TEST_EVIDENCE | DOM-IMP-12 | none — evaluator contract; foreign capabilities are required only for final CP-DOM-04 proof | DEFINED | DEFINED | YES | YES | CONTRACT_PRODUCTIVELY_AVAILABLE | LOCAL_IMPLEMENTATION | YES |
| Structured result | returns | close evaluator contract with structured result | conformant verdict vs process termination | planned structured-result test — exact conformant verdict | same test — missing evidence/process termination cannot pass | `docs/specs/implementation-plans/evidence/SPEC-DOM-001/DOM-IMP-12-structured-result.md` | LOCAL_TEST_EVIDENCE | DOM-IMP-12 | none — evaluator result contract; foreign capabilities are required only for final CP-DOM-04 proof | DEFINED | DEFINED | YES | YES | CONTRACT_PRODUCTIVELY_AVAILABLE | LOCAL_IMPLEMENTATION | YES |

### Local Closure

`LOCAL_CLOSURE = YES` for the evaluator contract only; DOM-owned contract
fixtures prove evaluator behavior locally. The final integrated checkpoint
waits for actual foreign evidence availability and is a separate completion
boundary with no local foreign-contract harness.

### Required Tests

Evaluator unit tests for every dimension, coverage/omission/extrapolation,
regression/test evidence, exact binding, structured findings, idempotency,
and integrated conformance tests at CP-DOM-04.

### Legacy / Cutover Impact

`PRESERVE_LEGACY_READS`; historical reports remain evidence only and cannot
close a new exact cycle.

### Completion Evidence

Local closure evidence is limited to the evaluator contract, structured
verdict/finding result, complete witness-matrix contract, direct local tests,
and `docs/specs/implementation-plans/evidence/SPEC-DOM-001/DOM-IMP-12-evaluator-contract.md`.
The integrated CP-DOM-04 report and contributor evidence references are
`FINAL_CONFORMANCE_EVIDENCE` owned by DOM-IMP-12 after IMP-01 through IMP-11;
they are not prerequisites for this Unit's local closure.

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
| GAP-011 | DOM-CMD-001 | O-011 | PARTIAL | MAJOR | LOCAL_IMPLEMENTATION_WORK | DOM-IMP-13 (producer), DOM-IMP-05 (consumer) | COVERED |
| GAP-012 | DOM-CMD-001 | O-011 | PARTIAL | MAJOR | LOCAL_IMPLEMENTATION_WORK | DOM-IMP-13 (producer), DOM-IMP-05 (consumer) | COVERED |
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

`GAP-005` remains owned and covered by DOM-IMP-02. DOM-IMP-03 provides only
the required supporting authority producer contract; no Gap identity,
classification, severity, or ownership is moved.

## 11. Acceptance → Plan Traceability

| Acceptance ID | Requirement(s) | Contributing units | Final proof owner | Local evidence | Final evidence |
| --- | --- | --- | --- | --- | --- |
| AC-DOM-001 | DOM-ID-001 | DOM-IMP-01 | DOM-IMP-01 | identity catalog/continuity tests | canonical identity report |
| AC-DOM-002 | DOM-INGEST-001 | DOM-IMP-02 | DOM-IMP-02 | manual-trigger negative test | command trace |
| AC-DOM-003 | DOM-SNAPSHOT-001 | DOM-IMP-03 (producer), DOM-IMP-02 | DOM-IMP-02 | authority-reader, snapshot mutation/drift tests | immutable snapshot evidence |
| AC-DOM-004 | DOM-ELIG-001 | DOM-IMP-03 (producer), DOM-IMP-02 | DOM-IMP-02 | authority-reader, eligibility matrix | fail-closed evidence |
| AC-DOM-005 | DOM-LINEAGE-001 | DOM-IMP-01 | DOM-IMP-01 | independent lineage tests | durable lineage evidence |
| AC-DOM-006 | DOM-LIFE-001 | DOM-IMP-03 | DOM-IMP-03 | lifecycle isolation | lifecycle trace |
| AC-DOM-007 | DOM-REV-001 | DOM-IMP-03 | DOM-IMP-03 | revision/succession tests | history/cutover evidence |
| AC-DOM-008 | DOM-IMMUT-001 | DOM-IMP-03 | DOM-IMP-03 | mutation rejection | immutable record evidence |
| AC-DOM-009 | DOM-PIPE-001 | DOM-IMP-04 | DOM-IMP-04 | order/skip tests | provenance chain evidence |
| AC-DOM-010 | DOM-STATE-001 | DOM-IMP-04 | DOM-IMP-04 | separate-state/reconstruction tests | chain and isolation evidence |
| AC-DOM-011 | DOM-CMD-001 | DOM-IMP-05 | DOM-IMP-13 (producer), DOM-IMP-05 (consumer) | productive observation, rejection/no-effect, and temporal reread tests | canonical authority and result evidence |
| AC-DOM-012 | DOM-TICKET-001 | DOM-IMP-06 | DOM-IMP-06 | six-state/terminal tests | ticket aggregate evidence |
| AC-DOM-013 | DOM-TICKET-002 | DOM-IMP-06 | DOM-IMP-06 | eight-transition matrix | transition proof |
| AC-DOM-014 | DOM-PUB-001 | DOM-IMP-07 | DOM-IMP-07 | publication state tests | GIT distinction evidence |
| AC-DOM-015 | DOM-ADV-001 | DOM-IMP-07 | DOM-IMP-07 | verdict/cancel gate tests | gate/effect evidence |
| AC-DOM-049 | DOM-AUDIT-001 | DOM-IMP-08 | DOM-IMP-08 | cycle identity tests | artifact/cycle evidence |
| AC-DOM-050 | DOM-AUDIT-002 | DOM-IMP-08 | DOM-IMP-08 | structured closure tests | exact verdict evidence |
| AC-DOM-051 | DOM-AUDIT-003 | DOM-IMP-09 | DOM-IMP-09 | ten-round/isolation tests | continuation authorization |
| AC-DOM-052 | DOM-AUDIT-004 | DOM-IMP-01–11 | DOM-IMP-12 | contributor contract evidence | CP-DOM-04: IMP-01..11 → IMP-12 → integrated six-dimension conformance |
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

| CAPABILITY_ID | AUTHORITY_OWNER | PRODUCER | PRODUCED_CONTRACT | CONSUMER | CONSUMED_CAPABILITY | SEMANTIC_STATUS | AUTHORITY_STATUS | CONTRACT_STATUS | LOCAL_TESTABILITY | PRODUCTIVE_AVAILABILITY | CAPABILITY_SUMMARY_STATUS | AVAILABILITY_EVIDENCE | AVAILABILITY_CONDITION | DEPENDENCY_CLASS | DEPENDENCY_EDGE | BLOCKING_EFFECT | FAILURE_NOT_FOUND_STALE_SEMANTICS | VERSION_REVISION_TRANSPORT |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CAP-EXEC-EXACT-VERSION-BASIS | SPEC-EXEC-001 | EXEC-001 registry | exact skill/capability identity, version, revision, compatibility basis, and returned result | DOM-SNAPSHOT-001 / DOM-ADV-001 | exact version/revision basis | DEFINED_BY_EXEC-001_CONTRACT | DEFINED | DEFINED | NO | NO | CONTRACT_DEFINED | no productive EXEC registry/adapter in current repository; authority is defined by SPEC-EXEC-001 | available only when the productive EXEC registry/adapter returns the exact basis at integrated consumer execution | REQUIRED_FOR_INTEGRATED_PROOF | EXEC-001 registry → DOM-IMP-02/07 | does not block local closure; blocks integrated proof only | unknown, incompatible, missing, or stale basis fails closed | producer returns exact version/revision; consumer stores and transports it unchanged |
| CAP-PLAT-SNAPSHOT-PIPELINE-PROVENANCE | SPEC-PLAT-001 | PLAT journal/checkpoint reader | canonical identity/reference revisions, persistence revision, current state, and ordered append-only provenance | DOM-SNAPSHOT-001 / DOM-PIPE-001 / DOM-STATE-001 | durable snapshot, journal, and provenance material | DEFINED_BY_PLAT-001_CONTRACT | DEFINED | DEFINED | NO | NO | CONTRACT_DEFINED | no productive PLAT journal/checkpoint reader or adapter in current repository; ports are not availability | available only when the productive PLAT reader returns durable, ordered, integrity-checked material at integrated consumer execution | REQUIRED_FOR_INTEGRATED_PROOF | PLAT reader → DOM-IMP-01/02/04/05/07/10–12 | does not block local closure; blocks integrated proof only | missing, detached, stale, corrupt, duplicate, omitted, or inconsistent material fails closed | producer returns persistence/domain/identity revisions and provenance order; consumer preserves them |
| CAP-GIT-CANDIDATE-REMOTE-CONFIRMATION | SPEC-GIT-001 | GIT remote observation adapter | PublicationId, candidate base/head/tree, remote result, confirmation revision, and independent observation | DOM-PUB-001 / DOM-AUDIT-006 | candidate-bound remote confirmation | DEFINED_BY_GIT-001_CONTRACT | DEFINED | DEFINED | NO | NO | CONTRACT_DEFINED | no productive GIT remote observation adapter in current repository; mock publication is not availability | available only when the productive GIT adapter independently confirms the exact candidate at integrated consumer execution | REQUIRED_FOR_INTEGRATED_PROOF | GIT adapter → DOM-IMP-07/11/12 | does not block local closure; blocks integrated proof only | merge-only, stale, drifted, mismatched, or missing confirmation fails closed | producer returns candidate-bound base/head/tree and confirmation revision; consumer binds exact candidate |

```text
CAPABILITY_AVAILABILITY_RECORDS = 3 external + 3 DOM-internal
AUTHORITY_DEFINED_BUT_NOT_CONSUMABLE = 3 external + command authority pending promotion
AUTHORITY_NOT_DEFINED = 0
NO_DOWNSTREAM_CAPABILITY_PROMOTION_WITHOUT_NEW_EVIDENCE = TRUE
```

### 12.2 DOM-internal authority capability

The following is an implementation capability produced inside the DOM owner;
it is not a new portfolio dependency, foreign capability, or second authority.
It is the plan-level producer/consumer contract required to make the validated
GAP-011/GAP-012 correction implementable without caller-supplied authority.

| CAPABILITY_ID | AUTHORITY_OWNER | PRODUCER | PRODUCED_CONTRACT | CONSUMER | CONSUMED_CAPABILITY | SEMANTIC_STATUS | AUTHORITY_STATUS | CONTRACT_STATUS | LOCAL_TESTABILITY | PRODUCTIVE_AVAILABILITY | CAPABILITY_SUMMARY_STATUS | AVAILABILITY_BEFORE_PRODUCER | AVAILABILITY_CONDITION | AVAILABILITY_EVIDENCE | VERSION_REVISION_TRANSPORT | FAILURE_NOT_FOUND_STALE_SEMANTICS | DEPENDENCY_CLASS | DEPENDENCY_EDGE | BLOCKING_EFFECT | PROOF_EVIDENCE | PROMOTION_RECORD |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CAP-DOM-ADR-AUTHORITY-READ-OBSERVATION | SPEC-DOM-001 | DOM-IMP-03 | canonical ADR reference, lifecycle/status, revision, content hash, and independent second observation | DOM-IMP-02 | canonical authority basis for snapshot eligibility | DEFINED_AND_DOM_OWNED | DEFINED | DEFINED | YES | NO | CONTRACT_TESTABLE_LOCALLY | NO | `NO` until producer evidence; `YES` at consumer execution/closure only after the explicit promotion record | before: no productive reader; producer evidence: `EV-DOM-IMP-03-AUTHORITY-READER-COMPLETE` | canonical ADR reference, lifecycle/status, revision, and content hash returned unchanged; second observation independently re-read and compared | unknown, missing, non-accepted, stale, mismatched, caller-supplied, fallback, self-compared, or corrupt authority fails closed without snapshot mutation | REQUIRED_FOR_LOCAL_EXECUTION | DOM-IMP-03 → DOM-IMP-02 | T002 cannot start or close before this capability is productively available; current baseline is `BLOCKED_BY_UPSTREAM_CONTRACT`; fixture/mock/prototype cannot promote it | `EV-DOM-IMP-03-AUTHORITY-READER-COMPLETE`; `EV-DOM-IMP-02-AUTHORITY-CONSUMPTION`; `TAP-02`; `TAP-03`; CP-DOM-01 producer-before-consumer evidence | `PROMO-DOM-ADR-01`: CAPABILITY_ID=`CAP-DOM-ADR-AUTHORITY-READ-OBSERVATION`; PREVIOUS_STATUS=`NO`; NEW_STATUS=`YES`; PREVIOUS_PRODUCTIVE_AVAILABILITY=`NO`; NEW_PRODUCTIVE_AVAILABILITY=`YES`; PREVIOUS_CAPABILITY_SUMMARY_STATUS=`CONTRACT_TESTABLE_LOCALLY`; NEW_CAPABILITY_SUMMARY_STATUS=`CONTRACT_PRODUCTIVELY_AVAILABLE`; PROMOTION_EVIDENCE=`EV-DOM-IMP-03-AUTHORITY-READER-COMPLETE`; EVIDENCE_OWNER=`DOM-IMP-03`; EVIDENCE_BASELINE_OR_COMMIT=`post-IMP-03 closure evidence at current plan basis` |
| CAP-DOM-COMMAND-AUTHORITY-OBSERVATION | SPEC-DOM-001 | DOM-IMP-13 / TICKET-013 | canonical STAGE identity, aggregate revision, stage, complete command precondition evidence, and dependency/verdict freshness | DOM-IMP-05 / TICKET-005 | canonical command authority observation | DEFINED_AND_DOM_OWNED | DEFINED | DEFINED | YES | NO | CONTRACT_TESTABLE_LOCALLY | NO | `NO` until TICKET-013 supplies productive implementation, runtime composition, independent reread evidence, and a promotion record | current repository search: contract in `src/domain/command.ts` and test doubles only; TICKET-013 is the authorized producer but is not implemented | caller claims, defaults, fixtures, mocks, fakes, and ADR-only observations cannot establish command authority; missing, stale, revoked, superseded, or incompatible evidence fails closed | REQUIRED_FOR_LOCAL_EXECUTION | `DOM-IMP-13 → DOM-IMP-05` | T005 cannot execute or close locally while availability is `NO`; no `DOM-IMP-03 → DOM-IMP-05` edge is valid because T003 produces only ADR authority | pending `EV-DOM-IMP-13-AUTHORITY-READER-COMPLETE`, `EV-DOM-IMP-13-COMPOSITION`, `EV-DOM-IMP-13-TEMPORAL-REOBSERVATION`, and independent audits | `PROMO-DOM-COMMAND-AUTHORITY-01` only after all producer, composition, first/second read, and audit evidence exists |

```text
PRODUCER_BEFORE_CONSUMER = YES
CALLER_SUPPLIED_AUTHORITY = FORBIDDEN
SECOND_INDEPENDENT_OBSERVATION_SUPPORTED = REQUIRED_AND_NOT_YET_PROVEN
PRODUCTIVE_AVAILABILITY_BEFORE_PRODUCER = NO
PRODUCTIVE_AVAILABILITY_AFTER_PRODUCER = PENDING PROMO-DOM-COMMAND-AUTHORITY-01
T005_EXECUTION_BLOCKED_BEFORE_PRODUCER = YES
T005_LOCAL_CLOSURE_WITHOUT_AUTHORITY_PRODUCER = NO
CAPABILITY_PROOF_EVIDENCE = EV-DOM-IMP-13-AUTHORITY-READER-COMPLETE; EV-DOM-IMP-13-COMPOSITION; EV-DOM-IMP-13-TEMPORAL-REOBSERVATION; PROMO-DOM-COMMAND-AUTHORITY-01
```

Unit closure reconciliation:

| Unit | CAPABILITY_AVAILABILITY_RECORDS | WORK_CAN_START | LOCAL_CLOSURE | SHARED_CLOSURE_BOUNDARY |
| --- | --- | --- | --- | --- |
| DOM-IMP-01 | none required for local closure | YES; initial READY | YES | N/A |
| DOM-IMP-02 | CAP-DOM-ADR-AUTHORITY-READ-OBSERVATION; CAP-EXEC-EXACT-VERSION-BASIS; CAP-PLAT-SNAPSHOT-PIPELINE-PROVENANCE | NO before IMP-03; after IMP-01 and IMP-03; foreign integrated capabilities are not start blockers | YES only after `EV-DOM-IMP-03-AUTHORITY-READER-COMPLETE`; no closure without producer | YES — local snapshot semantics vs integrated evidence |
| DOM-IMP-03 | produces CAP-DOM-ADR-AUTHORITY-READ-OBSERVATION; no upstream capability required for local closure | after IMP-01 | YES | N/A |
| DOM-IMP-04 | CAP-PLAT-SNAPSHOT-PIPELINE-PROVENANCE | after IMP-01; integrated capability not a local blocker | YES | YES — reconstruction contract vs integrated recovery |
| DOM-IMP-05 | CAP-DOM-COMMAND-AUTHORITY-OBSERVATION | NO until DOM-IMP-13 promotion | NO at current baseline | ISSUE_READY but execution-blocked by DOM-IMP-13 capability |
| DOM-IMP-13 | CAP-DOM-COMMAND-AUTHORITY-OBSERVATION | YES after its own implementation evidence; no upstream command capability required | YES after producer evidence; capability promotion still pending | READY; producer ticket precedes T005 |
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

### 12.3 Mechanical producer/consumer reconciliation

Every Unit-level `PCP-*` prose reference is mechanically completed by the
following records. The records preserve the required producer, consumer,
contract, semantic, authority, local-testability, productive-availability,
availability-condition, dependency-class, dependency-edge, evidence, and
blocking fields. `PRODUCTIVE_AVAILABILITY` is evaluated at the handoff point;
the internal DOM capability is `NO` at the current baseline and becomes `YES`
only through `PROMO-DOM-ADR-01` after producer evidence exists.

| PCP IDs | CAPABILITY_ID | AUTHORITY_OWNER | PRODUCER | PRODUCED_CONTRACT | CONSUMER | CONSUMED_CAPABILITY | SEMANTIC_STATUS | AUTHORITY_STATUS | CONTRACT_STATUS | LOCAL_TESTABILITY | PRODUCTIVE_AVAILABILITY | CAPABILITY_SUMMARY_STATUS | AVAILABILITY_EVIDENCE | AVAILABILITY_CONDITION | DEPENDENCY_CLASS | DEPENDENCY_EDGE | PROOF_EVIDENCE | BLOCKING_EFFECT |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| PCP-PLAT-01 | CAP-PLAT-SNAPSHOT-PIPELINE-PROVENANCE | DOM | PLAT journal/checkpoint reader | durable canonical identity, lineage, revision transport, and recovery result | DOM-IMP-01 | physical durable identity/lineage material | DEFINED_BY_PLAT-001_CONTRACT | DEFINED | DEFINED | NO | NO | CONTRACT_DEFINED | no local foreign-contract harness; CP-DOM-01 integrated evidence | only at integrated checkpoint when the productive PLAT reader returns durable material | REQUIRED_FOR_INTEGRATED_PROOF | PLAT → DOM-IMP-01 | CP-DOM-01 integrated evidence | does not block local closure; blocks integrated durability proof |
| PCP-DOM-03→02 | CAP-DOM-ADR-AUTHORITY-READ-OBSERVATION | DOM-IMP-03 | canonical ADR reader | canonical reference/status/revision/hash and independent second observation | DOM-IMP-02 | authoritative ADR basis for snapshot and eligibility | DEFINED_AND_DOM_OWNED | DEFINED | DEFINED | YES | NO | CONTRACT_TESTABLE_LOCALLY before promotion; CONTRACT_PRODUCTIVELY_AVAILABLE after promotion | `EV-DOM-IMP-03-AUTHORITY-READER-COMPLETE` | `NO` before producer evidence; consumer closure requires `PROMO-DOM-ADR-01` | REQUIRED_FOR_LOCAL_EXECUTION | DOM-IMP-03 → DOM-IMP-02 | `EV-DOM-IMP-03-AUTHORITY-READER-COMPLETE`; `PROMO-DOM-ADR-01` | current consumer state is `BLOCKED_BY_UPSTREAM_CONTRACT`; no fixture/mock/prototype promotion |
| PCP-DOM-13→05 | CAP-DOM-COMMAND-AUTHORITY-OBSERVATION | DOM-IMP-13 | productive command-authority observation composition | canonical STAGE identity, aggregate revision, stage, complete preconditions, and dependency/verdict freshness | DOM-IMP-05 | command precondition validation and independent pre-commit reread | DEFINED_AND_DOM_OWNED | DEFINED | DEFINED | YES | NO | CONTRACT_TESTABLE_LOCALLY before T013 implementation; `CONTRACT_PRODUCTIVELY_AVAILABLE` only after T013 implementation, composition, audit, and promotion | pending `EV-DOM-IMP-13-AUTHORITY-READER-COMPLETE`, `EV-DOM-IMP-13-COMPOSITION`, and `EV-DOM-IMP-13-TEMPORAL-REOBSERVATION` | missing, unknown, stale, superseded, revoked, invalidated, or inconsistent source fails closed; no defaults or caller authority | REQUIRED_FOR_LOCAL_EXECUTION | DOM-IMP-13 → DOM-IMP-05 | T005 remains `BLOCKED` until `PROMO-DOM-COMMAND-AUTHORITY-01`; DOM-IMP-03/T003 is not a valid producer edge |
| PCP-PLAT-04 | CAP-PLAT-SNAPSHOT-PIPELINE-PROVENANCE | DOM | PLAT journal/checkpoint reader | ordered append-only transition records and integrity status | DOM-IMP-04 | durable pipeline provenance | DEFINED_BY_PLAT-001_CONTRACT | DEFINED | DEFINED | NO | NO | CONTRACT_DEFINED | no local foreign-contract harness; CP-DOM-02 recovery evidence | only at integrated recovery execution | REQUIRED_FOR_INTEGRATED_PROOF | PLAT → DOM-IMP-04 | CP-DOM-02 integrated evidence | does not block local reconstruction closure; blocks integrated recovery proof |
| PCP-PLAT-05 | CAP-PLAT-SNAPSHOT-PIPELINE-PROVENANCE | DOM | PLAT journal/checkpoint reader | durable command and rejection record | DOM-IMP-05 | physical command/rejection record | DEFINED_BY_PLAT-001_CONTRACT | DEFINED | DEFINED | NO | NO | CONTRACT_DEFINED | no local foreign-contract harness; CP-DOM-02 evidence | only at integrated command execution | REQUIRED_FOR_INTEGRATED_PROOF | PLAT → DOM-IMP-05 | CP-DOM-02 integrated evidence | does not block local semantic closure; blocks integrated durability proof |
| PCP-EXEC-02 | CAP-EXEC-EXACT-VERSION-BASIS | DOM | EXEC-002 session/activity capability | operational outcome correlated to canonical ticket state | DOM-IMP-06 | execution outcome | DEFINED_BY_EXEC-002_CONTRACT | DEFINED | DEFINED | NO | NO | CONTRACT_DEFINED | no local foreign-contract harness; CP-DOM-02 evidence | only when productive EXEC outcome is returned | REQUIRED_FOR_INTEGRATED_PROOF | EXEC-002 → DOM-IMP-06 | CP-DOM-02 integrated evidence | does not block local ticket semantics; blocks integrated execution proof |
| PCP-GIT-01 / PCP-EXEC-03 / PCP-PLAT-06 | CAP-GIT-CANDIDATE-REMOTE-CONFIRMATION | DOM | GIT remote adapter / EXEC activity / PLAT effect reader | candidate, activity, and effect outcome evidence | DOM-IMP-07 | exact publication and advancement outcome | DEFINED_BY_GIT_EXEC_PLAT_CONTRACTS | DEFINED | DEFINED | NO | NO | CONTRACT_DEFINED | no local foreign-contract harness; CP-DOM-02 integrated evidence | only at integrated publication/advancement execution | REQUIRED_FOR_INTEGRATED_PROOF | GIT/EXEC/PLAT → DOM-IMP-07 | CP-DOM-02 integrated evidence | does not block local state/gate closure; blocks integrated effects proof |
| PCP-EXEC-04 / PCP-EXEC-05 / PCP-EXEC-06 | CAP-EXEC-EXACT-VERSION-BASIS | DOM | EXEC-002 session/activity capability | cycle activity, pause, continuation, and invalidation outcome evidence | DOM-IMP-08/09/10 | exact activity and scheduling outcome | DEFINED_BY_EXEC-002_CONTRACT | DEFINED | DEFINED | NO | NO | CONTRACT_DEFINED | no local foreign-contract harness; CP-DOM-03 evidence | only when productive EXEC records are available | REQUIRED_FOR_INTEGRATED_PROOF | EXEC-002 → DOM-IMP-08/09/10 | CP-DOM-03 integrated evidence | does not block local cycle/round semantics; blocks integrated activity proof |
| PCP-PLAT-07 / PCP-GIT-02 / PCP-GIT-03 / PCP-PLAT-08 / PCP-OPS-01 / PCP-ALL-01 | CAP-PLAT-SNAPSHOT-PIPELINE-PROVENANCE; CAP-GIT-CANDIDATE-REMOTE-CONFIRMATION | DOM | PLAT/GIT/OPS/EXEC approved producers | canonical adjustment, exact candidate, preserved intent, projection, and contributor evidence | DOM-IMP-10/11/12 | integrated invalidation, drift, and final-conformance evidence | DEFINED_BY_APPROVED_OWNER_CONTRACTS | DEFINED | DEFINED | NO | NO | CONTRACT_DEFINED | no local foreign-contract harness; CP-DOM-03/04 integrated evidence | only after productive foreign evidence is available at the checkpoint | REQUIRED_FOR_INTEGRATED_PROOF | approved foreign producers → DOM-IMP-10/11/12 | CP-DOM-03 and CP-DOM-04 integrated evidence | does not block local cutover/evaluator-contract closure; blocks integrated final proof |

#### Productive availability promotion record

```text
PROMOTION_RECORD = PROMO-DOM-ADR-01
CAPABILITY_ID = CAP-DOM-ADR-AUTHORITY-READ-OBSERVATION
PREVIOUS_STATUS = NO
NEW_STATUS = YES
PREVIOUS_PRODUCTIVE_AVAILABILITY = NO
NEW_PRODUCTIVE_AVAILABILITY = YES
PREVIOUS_CAPABILITY_SUMMARY_STATUS = CONTRACT_TESTABLE_LOCALLY
NEW_CAPABILITY_SUMMARY_STATUS = CONTRACT_PRODUCTIVELY_AVAILABLE
PROMOTION_EVIDENCE = EV-DOM-IMP-03-AUTHORITY-READER-COMPLETE
EVIDENCE_OWNER = DOM-IMP-03
EVIDENCE_BASELINE_OR_COMMIT = post-IMP-03 closure evidence at the current plan basis
PROMOTION_CONSUMER_POINT = DOM-IMP-02 execution and local closure
```

## 13. Dependency DAG

```text
DOM-IMP-01
├── DOM-IMP-03 ── DOM-IMP-02
├── DOM-IMP-04 ── DOM-IMP-13 ── DOM-IMP-05 ──┬── DOM-IMP-06 ── DOM-IMP-10 ──┐
│                                            ├── DOM-IMP-07 ── DOM-IMP-11 ──┤
│                                            └── DOM-IMP-08 ── DOM-IMP-09 ──┤
└────────────────────────────────────────────────────────────────────────────┴── DOM-IMP-12
```

Explicit edges: `IMP-01→03,04,08,11,13`; `IMP-03→02,10`;
`IMP-04→06,07,13`; `IMP-13→05`; `IMP-05→06,07,08`;
`IMP-06→10`; `IMP-07→10,11`; `IMP-08→09`; and `IMP-01..11→IMP-12`
where required by acceptance evidence. All edges are implementation
dependencies, not new normative portfolio edges. The `IMP-13→05` edge is a
real producer/consumer capability dependency. No `IMP-03→05` edge exists:
T003 produces only the ADR authority capability.

`DAG_CYCLE_DETECTED = NO`.

## 14. Parallelization Waves

| Wave | Units | Prerequisites | Shared collision risk | Execution mode |
| ---: | --- | --- | --- | --- |
| 1 | DOM-IMP-01 | none | canonical identity/lineage vocabulary | `SERIAL_REQUIRED` |
| 2 | DOM-IMP-03, DOM-IMP-04 | IMP-01 | lifecycle/authority-reader, pipeline ports, and identity references | `SAFE_WITH_COORDINATION` |
| 3 | DOM-IMP-02, DOM-IMP-13 | IMP-03 for IMP-02; IMP-01/04 for IMP-13 | snapshot authority consumption and command-authority composition | `SAFE_WITH_COORDINATION` |
| 4 | DOM-IMP-05 | IMP-13 plus IMP-01/04 | command, failure, and revision seams | `SERIAL_REQUIRED`; T005 remains blocked until capability promotion |
| 5 | DOM-IMP-06, DOM-IMP-07, DOM-IMP-08 | IMP-04/05; IMP-01/05 | state/command/event vocabulary | `SAFE_WITH_COORDINATION` |
| 6 | DOM-IMP-09, DOM-IMP-10, DOM-IMP-11 | IMP-08; IMP-03/06; IMP-01/07 | cutover, round, evidence fixtures | `SAFE_WITH_COORDINATION` |
| 7 | DOM-IMP-12 | IMP-01–11 plus IMP-13 evidence | final evaluator consumes all evidence | `SERIAL_REQUIRED` |

## 15. Integration Checkpoints

| Checkpoint | Required units | Integrated behavior | Required evidence | Unlocks |
| --- | --- | --- | --- | --- |
| CP-DOM-01 | IMP-01, IMP-03, IMP-02 | canonical identity, lifecycle authority reader, snapshot, eligibility, revision | producer/consumer authority, identity/revision/recovery contract evidence | IMP-10 and consumer mappings |
| CP-DOM-02 | IMP-04, IMP-13, IMP-05, IMP-06, IMP-07 | state, command-authority observation, command, ticket, publication, advancement convergence | productive command-authority composition, first/second reads, full state/command/no-effect matrix | IMP-10, IMP-11 |
| CP-DOM-03 | IMP-08, IMP-09, IMP-10, IMP-11 | audit cycle, round, cutover, exact evidence | structured verdict, selective invalidation, temporal drift | IMP-12 |
| CP-DOM-04 | IMP-01–IMP-13, with IMP-12 after IMP-01–IMP-11 and IMP-13 | final DOM conformance boundary; IMP-12 emits the final proof after consuming every contributor | all six dimensions, integration, regressions, omissions, extrapolations, and command-authority promotion | downstream conformance/publication flow |

Checkpoint evidence is integrated proof and is not copied into earlier local
acceptance criteria.

`CP-DOM-04_EXECUTION_ORDER = IMP-01..04 → DOM-IMP-13 → IMP-05..11 → DOM-IMP-12 → FINAL_CONFORMANCE_EVIDENCE`.
`CP-DOM-04_FINAL_PROOF_OWNER = DOM-IMP-12`; the checkpoint cannot emit final
conformance evidence before the evaluator completes.

## 16. Legacy / Authority Transition

| Current path | Target authority | Read behavior | Write behavior | Migration/mapping | Owning unit |
| --- | --- | --- | --- | --- | --- |
| Historical `PipelineId` path | canonical `STAGE` identity | resolve historical aliases explicitly | no independent writes/lookups | preserve historical mapping; no productive parallel authority | IMP-01 |
| Caller-supplied ADR status/hash | canonical ADR catalog | preserve old records as evidence | reject caller authority | DOM-IMP-03 produces canonical reader; DOM-IMP-02 consumes before snapshot | IMP-03 (producer); IMP-02 (consumer) |
| Scalar pipeline rehydration | provenance chain | historical state only with complete chain | reject direct later-state writes | PLAT supplies records | IMP-04 |
| Prototype lifecycle/ticket/publication state | productive DOM models | prototype remains historical evidence | no productive writes | scenario vocabulary only | IMP-03, IMP-06, IMP-07 |
| Silent ADR mutation | revision/succession | preserve old revision | reject rewrite; create successor | cutover linkage | IMP-03 |
| Downstream approvals after normative change | DOM invalidation/adjustment | preserve history | obsolete affected records; never reopen completed ticket | foreign owners persist/project | IMP-10 |
| Local publication confirmation | exact candidate/GIT evidence | preserve hash-linked evidence | DOM gates; GIT executes/confirms | consume foreign result | IMP-07, IMP-11 |
| Historical reports as approval | exact audit cycle/verdict | retain for comparison only | cannot close a new cycle | exact cycle binding | IMP-08, IMP-12 |

## 17. Test Strategy

`LOCAL_TEST_EVIDENCE` is assigned to each unit and includes direct positive,
negative, isolation, no-effect, stale, idempotency, and reconstruction tests
where applicable. The frozen Gap Matrix snapshot records 33 productive tests;
the current repository verification is 46/46 productive tests. Prototype
92/92 tests remain scenario evidence only. The counts are separate baselines.

DOM-IMP-03 owns the ADR authority-reader producer witnesses, including
canonical reference/status/revision/content-hash completeness for T002.
DOM-IMP-13 owns the distinct command-authority producer witnesses: canonical stage
identity, aggregate revision/stage, complete command preconditions, freshness,
runtime composition, and independent re-observation. DOM-IMP-02 owns consumer
rejection, eligibility, snapshot freeze, and drift witnesses; T005 owns command
validation and no-effect witnesses. No caller, fixture, mock, or prototype
supplies authority.

`INTEGRATION_TEST_EVIDENCE` is owned by CP-DOM-01 through CP-DOM-04 and covers
PLAT persistence/recovery, EXEC contracts, GIT publication evidence, REPO
mapping, BACKEND/OPS/UI projections, temporal drift, and cross-spec identity.

`FINAL_CONFORMANCE_EVIDENCE` is owned only by DOM-IMP-12 at CP-DOM-04, after
CP-DOM-04 has received the completed evidence from IMP-01 through IMP-11 and
the command-authority producer evidence from IMP-13.

Required categories represented in the plan: unit/domain invariant,
persistence-boundary mapping, application, integration, concurrency/isolation,
stale protection, idempotency, recovery/reconstruction, compatibility,
cutover/migration history, regression, conformance, and API/UI contract mapping.
Physical persistence, adapter retry, scheduler, and external-effect tests
execute under their approved owner SPECs; DOM tests verify semantic contracts.
No local DOM fixture promotes a foreign capability to local testability or
productive availability.

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
| Foreign contract unavailable | downstream component not yet productive | IMP-01–12 | explicit PCP, no local foreign-contract harness, checkpoint blocking |
| Parallel collision | shared domain/event vocabulary changes concurrently | waves 2–5 | coordination and serial checkpoints |
| Ambiguous final proof | multiple units claim conformance closure | IMP-10–12 | AC-DOM-052 final owner fixed to IMP-12 |

## 19. Implementation Unit Closure Matrix

| Unit | Independently implementable | Local closure | Issue decomposition readiness | Initial DAG state | Blocked by |
| --- | --- | --- | --- | --- | --- |
| DOM-IMP-01 | YES | YES | ISSUE_READY | READY | — |
| DOM-IMP-02 | YES | YES after producer | ISSUE_READY | BLOCKED | IMP-01, IMP-03 |
| DOM-IMP-03 | YES | YES | ISSUE_READY | BLOCKED | IMP-01 |
| DOM-IMP-04 | YES | YES | ISSUE_READY | BLOCKED | IMP-01 |
| DOM-IMP-05 | YES after producer handoff | NO until capability promotion | ISSUE_READY | BLOCKED | IMP-01, IMP-04, IMP-13 capability promotion |
| DOM-IMP-13 | YES | YES after its own implementation evidence | ISSUE_READY | READY | IMP-01, IMP-04 (satisfied in current ticket baseline) |
| DOM-IMP-06 | YES | YES | ISSUE_READY | BLOCKED | IMP-04, IMP-05 |
| DOM-IMP-07 | YES | YES | ISSUE_READY | BLOCKED | IMP-04, IMP-05 |
| DOM-IMP-08 | YES | YES | ISSUE_READY | BLOCKED | IMP-01, IMP-05 |
| DOM-IMP-09 | YES | YES | ISSUE_READY | BLOCKED | IMP-08 |
| DOM-IMP-10 | YES | YES | ISSUE_READY | BLOCKED | IMP-03, IMP-06 |
| DOM-IMP-11 | YES | YES | ISSUE_READY | BLOCKED | IMP-01, IMP-07 |
| DOM-IMP-12 | YES | YES | ISSUE_READY | BLOCKED | IMP-01–IMP-11 |

Readiness reconciliation:

```text
DOM-IMP-02_ISSUE_DECOMPOSITION_READINESS = ISSUE_READY
DOM-IMP-02_INITIAL_DAG_STATE = BLOCKED
DOM-IMP-02_T002_EXECUTION_BLOCKED_BEFORE_PRODUCER = YES
DOM-IMP-02_LOCAL_CLOSURE = YES only after EV-DOM-IMP-03-AUTHORITY-READER-COMPLETE
DOM-IMP-05_ISSUE_DECOMPOSITION_READINESS = ISSUE_READY
DOM-IMP-05_INITIAL_DAG_STATE = BLOCKED
DOM-IMP-05_LOCAL_CLOSURE = NO until CAP-DOM-COMMAND-AUTHORITY-OBSERVATION is promoted by DOM-IMP-13
DOM-IMP-13_ISSUE_DECOMPOSITION_READINESS = ISSUE_READY
DOM-IMP-13_INITIAL_DAG_STATE = READY after T001/T004
DOM-IMP-13_LOCAL_CLOSURE = YES after its own productive implementation evidence
DOM-IMP-12_LOCAL_EVALUATOR_CLOSURE = YES for evaluator contract after IMP-01..11 plus IMP-13 evidence
CP-DOM-04_FINAL_PROOF = after IMP-01..11 and DOM-IMP-13 and DOM-IMP-12; FINAL_PROOF_OWNER = DOM-IMP-12
IMPLEMENTATION_PLAN_GATE = IMPLEMENTATION_PLAN_CONFORMANT
READY_FOR_ISSUE_DECOMPOSITION = READY_FOR_ISSUE_DECOMPOSITION
```

Downstream ticket handoff remains plan-derived only. T002 may retain its
separate ADR-authority producer edge to T003. T005 must remain blocked by the
unpromoted command-authority capability; T003 must not be relabeled as that
producer, and no T005 downstream ticket may be promoted through the missing
promotion evidence.

## 20. Plan Metrics

```text
VALIDATED_GAPS = 21
LOCAL_IMPLEMENTATION_GAPS = 12
CROSS_SPEC_DEPENDENCIES = 0
PREEXISTING_FOREIGN_CAPABILITIES = 0
NO_LOCAL_WORK_GAPS = 0
INTEGRATION_OR_CONVERGENCE_GAPS = 9
FOREIGN_CONTRACT_DEPENDENCY_ROWS = 8

IMPLEMENTATION_UNITS = 13
LOCALLY_CLOSABLE_UNITS = 12
NON_LOCALLY_CLOSABLE_UNITS = 1
ISSUE_DECOMPOSITION_READY_UNITS = 13
INTERNAL_ONLY_UNITS = 0
PLAN_BLOCKED_UNITS = 0
INITIAL_READY_UNITS = 1 (DOM-IMP-13/TICKET-013)
INITIAL_BLOCKED_UNITS = 12
INTERNAL_AUTHORITY_PRODUCER_CAPABILITIES = 3
INTERNAL_AUTHORITY_PRODUCER_BLOCKERS = 2; ADR producer is promotable after IMP-03 evidence, command producer awaits T013 implementation and promotion

GAPS_WITH_PLAN_COVERAGE = 21
GAPS_WITHOUT_PLAN_COVERAGE = 0
UNITS_WITHOUT_GAP_OR_SUPPORTING_AUTHORITY = 0
FALSE_UNIT_SPLITS = 0
FALSE_UNIT_MERGES = 0
SPECULATIVE_UNITS = 0

ACCEPTANCE_OBLIGATIONS = 21
ACCEPTANCE_WITH_FINAL_PROOF_OWNER = 21
UNRESOLVED_FINAL_PROOF_OWNERS = 0
FINAL_PROOF_PREMATURE = 0
CHECKPOINT_PROOF_MISALLOCATED = 0
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
FOREIGN_CAPABILITIES_LOCAL_TESTABLE = 0
FOREIGN_CAPABILITIES_INTEGRATED_ONLY = 3
FOREIGN_CAPABILITY_HARNESS_EVIDENCE = 0

IMPLEMENTATION_UNIT_AUTHORITY_CHECK = PASS
AUTHORITY_CONSUMPTION_GAPS = 3
AUTHORITY_CONSUMPTION_GAP_EFFECT = integrated-proof only
CAPABILITY_AVAILABILITY_RECORDS = 3 external; 2 DOM-internal contracts
INTERNAL_CAPABILITY_CONTRACTS = 2
REQUIRED_FOR_LOCAL_EXECUTION_CAPABILITIES = 1
PRODUCTIVE_AVAILABILITY_BEFORE_PRODUCER = 0
PRODUCTIVE_AVAILABILITY_AFTER_PRODUCER = 1 current ADR capability via PROMO-DOM-ADR-01; command capability pending PROMO-DOM-COMMAND-AUTHORITY-01
CAPABILITY_AVAILABILITY_CLASSIFICATION_ERRORS = 0
NO_DOWNSTREAM_CAPABILITY_PROMOTION_WITHOUT_NEW_EVIDENCE = TRUE; PROMO-DOM-ADR-01 is required
PRODUCER_BEFORE_CONSUMER = YES
COMMAND_AUTHORITY_PRODUCER_BEFORE_CONSUMER = YES — DOM-IMP-13 → DOM-IMP-05; promotion pending
CALLER_SUPPLIED_AUTHORITY = FORBIDDEN
SECOND_INDEPENDENT_OBSERVATION_SUPPORTED = YES
T002_LOCAL_CLOSURE_WITHOUT_AUTHORITY_PRODUCER = NO
LOCAL_CLOSURE_WITH_UNAVAILABLE_REQUIRED_CAPABILITY = 1
WITNESSES_NOT_EXECUTABLE_AT_LOCAL_CLOSURE = 2 Plan-level rows; 7 ticket-level rows
TEMPORAL_AUTHORITY_GAPS = 0
UNREPRESENTED_UPSTREAM_CONTRACT_BLOCKERS = 0
READY_UNITS_WITH_UNAVAILABLE_CONTRACT = 0; T005 is blocked execution, not falsely READY
T002_EXECUTION_BLOCKED_BEFORE_PRODUCER = YES
T005_EXECUTION_BLOCKED_BEFORE_PRODUCER = YES
T013_PRODUCER_TICKET = READY; capability promotion pending
T002_LOCAL_CLOSURE_REQUIRES_PRODUCER_EVIDENCE = YES
UNITS_INVENTING_IDENTITY = 0
UNITS_INVENTING_LIFECYCLE = 0
UNITS_INVENTING_PROVENANCE = 0
UNITS_INVENTING_OWNERSHIP = 0
UNITS_INVENTING_RECOVERY = 0
UNITS_INVENTING_PERSISTENCE_SEMANTICS = 0
T005_DOWNSTREAM_PROMOTION_BLOCKED = YES until command capability promotion
DAG_CYCLE_DETECTED = NO
```

## 21. Authority / Specification Escalations

`CAP-DOM-COMMAND-AUTHORITY-OBSERVATION` has a defined DOM semantic owner and
consumer contract. The decomposition now assigns DOM-IMP-13/TICKET-013 as its
productive observation producer. This is a Plan-local decomposition of the
existing `O-011`/`DOM-CMD-001` obligation, not a new normative dependency.
The remaining escalation is capability promotion: T005 cannot execute or
close until T013 produces the required runtime evidence. This is not resolved
by DOM-IMP-03/T003, a fixture, a default, or a T005-local duplicate.

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
| `AUTHORITY_DEFINED_BUT_NOT_CONSUMABLE` | 3 external records plus the unpromoted command-authority capability | Gap Matrix §13 external records; command capability now has DOM-IMP-13/TICKET-013 as producer, but local closure remains blocked until promotion |
| `CAP-DOM-ADR-AUTHORITY-READ-OBSERVATION` | consumable after DOM-IMP-03 | Internal producer/consumer contract; T002 is not locally closable before its producer |
| `CAP-DOM-COMMAND-AUTHORITY-OBSERVATION` | producer assigned; not yet promoted | DOM-IMP-13/TICKET-013 is the authorized producer; T005 local closure and all downstream command consumers remain blocked until `PROMO-DOM-COMMAND-AUTHORITY-01` |
| `TEMPORAL_AUTHORITY_GAP` | 0 | SPEC §13 and Gap Matrix audit §27 |

For every unit, the answer to “Todas as decisões normativas necessárias para
implementar esta unidade já existem upstream?” is `YES`. The component SPEC
defines local semantics; the portfolio defines ownership/dependencies; PLAT,
EXEC, GIT, REPO, BACKEND, OPS, and UI contracts are consumed without moving
their ownership. Missing productive foreign implementations are explicit
integration prerequisites, not authority gaps.

The plan-local `ACP-DOM-01` through `ACP-DOM-13` labels cite the same
authority-consumption result independently confirmed by Component SPEC audit
§22 and Gap Matrix audit §27; they are trace labels, not new authority. The
`PCP-*` labels are defined by the producer/consumer fields in each unit and
remain subordinate to the portfolio ownership registry.

## 23. Implementation Unit Authority Checks

| Unit | Identity | Lifecycle | Provenance | Ownership | Persistence/recovery | Result | Readiness classification |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DOM-IMP-01 | SPEC §12.1 / ADR-0001 | ADR-0001 | lineage contract | O-001/O-005 | PLAT seam | YES | READY |
| DOM-IMP-02 | ADR-0001 / IMP-03 | ADR-0001 | snapshot basis; consumes canonical authority observations | O-002–O-004 | PLAT seam | YES after IMP-03 | READY |
| DOM-IMP-03 | ADR-0001 | ADR-0001 | lifecycle/revision lineage; produces canonical authority observations | O-006–O-008 | PLAT evidence seam | YES | READY |
| DOM-IMP-04 | SPEC §12.1 / ADR-0002 | ADR-0002 | audit chain contract | PLAT replay seam | YES | READY |
| DOM-IMP-05 | ADR-0002 | ADR-0002 | command revision and command validation; consumes complete command-authority observation | O-011 | PLAT journal seam; DOM-IMP-13 producer handoff | YES | ISSUE_READY / execution blocked |
| DOM-IMP-13 | ADR-0002 | ADR-0002 | productive command-authority observation composition; does not own ADR authority or pipeline identity | O-011 | DOM-IMP-01/04 inputs; runtime composition and promotion evidence | YES | ISSUE_READY |
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
IMPLEMENTATION_PLAN_GATE: IMPLEMENTATION_PLAN_CONFORMANT
REQUIRED_NEXT_ACTION: independently audit/decompose TICKET-013 and keep T005 blocked until capability promotion
```

The amended Plan is not self-approved. The fresh independent audit is
`docs/specs/implementation-plans/audits/SPEC-DOM-001-implementation-plan-audit-2026-09-15-command-authority-producer.md`.
Its result authorizes issue decomposition only; it does not promote the
command capability or make T005 implementation-ready.
