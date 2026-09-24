# SPEC-EXEC-001 — Implementation Plan

Status: PROPOSED
Planning source: validated component Implementation Gap Matrix

This plan defines HOW the validated EXEC-001 implementation deltas may be closed. It does not redefine ADR, portfolio, SPEC, upstream contracts, ownership, failure meaning, compatibility/cutover authority, or Gap Matrix classifications. It does not implement code, modify tests, mutate the Gap Matrix, create tickets, or approve the plan.

```text
Portfolio: docs/specs/SPEC-PORTFOLIO-001-organization.md
Portfolio audit: docs/specs/SPEC-PORTFOLIO-001-decomposition-audit.md
Component SPEC: docs/specs/SPEC-EXEC-001-skill-contracts-and-capability-registry.md
Component SPEC audit: docs/specs/audits/SPEC-EXEC-001-component-conformance-audit.md
Validated Gap Matrix: docs/specs/gap-matrices/SPEC-EXEC-001-implementation-gap-matrix.md
Gap Matrix audit: docs/specs/gap-matrices/audits/SPEC-EXEC-001-implementation-gap-matrix-audit.md
Repository baseline: 6b11695154b73a99e35418bfd952795f2028a3bf; source-audit baseline eeb906a8f11007ca4fa41e8f0ba5e32daa690567
Current HEAD: dfa70c4ea67bb0bb50c79d01a0e8fb4b135c3998
Baseline drift: NON_SEMANTIC_DOCUMENTARY_DRIFT; no authority or semantic implementation/test drift
```

## 1. Status

```text
ARTIFACT_PRODUCTION_RECOVERY = RESUME_OR_RECONCILE
INTERRUPTED_OUTPUT_ATTEMPT = YES
OUTPUT_CANDIDATE_CLASSIFICATION = COMPLETE_CLAIM_UNVERIFIED
OUTPUT_CANDIDATE_PATHS = docs/specs/implementation-plans/SPEC-EXEC-001-implementation-plan.md
SOURCE_AUTHORITY_AUDIT_UNMODIFIED = YES
SOURCE_AUTHORITY_VERDICT = GAP_MATRIX_CONFORMANT
SOURCE_AUTHORITY_READINESS = READY_FOR_IMPLEMENTATION_PLAN
```

The prior candidate was untrusted because it used SPEC revision 3, an older Gap Matrix basis and a stale Plan audit. It has been reconciled from the current conformant Gap Matrix and its current independent audit. No checkpoint or downstream Plan audit was performed.

Current planning gates:

```text
PORTFOLIO_DECOMPOSITION_APPROVED
PASS — COMPONENT_SPEC_CONFORMANT
SPEC_IMPLEMENTABILITY_CHECK = PASS
GAP_MATRIX_CONFORMANT
READY_FOR_IMPLEMENTATION_PLAN
```

The next independent gate is `READY_FOR_IMPLEMENTATION_PLAN_AUDIT`.

## 2. Planning Authority

| Artifact | Path | Current identity / result | Use |
|---|---|---|---|
| Accepted ADR authority | `docs/adrs/ADR-0001-workflow-domain-and-identity.md` through `ADR-0014-*` | revision 3, `ACCEPTED` | architecture and boundaries |
| Primary ADR | `docs/adrs/ADR-0003-versioned-skill-contracts.md` | revision 3, `ACCEPTED` | EXEC contracts, versions, registry, manifest |
| Portfolio | `docs/specs/SPEC-PORTFOLIO-001-organization.md` | revision 2 | ownership, obligations, dependency direction, failure and compatibility registries |
| Portfolio audit | `docs/specs/SPEC-PORTFOLIO-001-decomposition-audit.md` | `PORTFOLIO_DECOMPOSITION_APPROVED` | independent decomposition approval |
| Component SPEC | `docs/specs/SPEC-EXEC-001-skill-contracts-and-capability-registry.md` | revision 5, `PROPOSED` | owned behavior and acceptance |
| Component SPEC audit | `docs/specs/audits/SPEC-EXEC-001-component-conformance-audit.md` | `PASS — COMPONENT_SPEC_CONFORMANT`; `SPEC_IMPLEMENTABILITY_CHECK = PASS` | authority completeness and implementability |
| Upstream SPEC | `docs/specs/SPEC-DOM-001-workflow-authority-and-governance.md` | revision 4 | canonical DOM identity, snapshot and lifecycle contract |
| Upstream audit | `docs/specs/audits/SPEC-DOM-001-component-conformance-audit.md` | `PASS — COMPONENT_SPEC_CONFORMANT` | upstream authority proof |
| Validated Gap Matrix | `docs/specs/gap-matrices/SPEC-EXEC-001-implementation-gap-matrix.md` | 18 active gaps, 19 requirements | validated implementation delta |
| Gap Matrix audit | `docs/specs/gap-matrices/audits/SPEC-EXEC-001-implementation-gap-matrix-audit.md` | `GAP_MATRIX_CONFORMANT`; `READY_FOR_IMPLEMENTATION_PLAN` | independent matrix validation |
| Source checkpoint | `docs/workflow-checkpoints/SPEC-EXEC-001-component-gap-matrix-conformance.md` | conformance checkpoint, source unchanged | planning handoff |
| Plan convention | `docs/specs/implementation-plans/SPEC-DOM-001-implementation-plan.md` | repository convention | section, unit, DAG and metric structure |

Authority order:

```text
accepted ADR
  > approved SPEC portfolio decomposition
  > conformant component SPEC
  > conformant upstream component SPEC
  > validated component Gap Matrix
  > current repository implementation
  > tests
  > prototype / historical evidence
```

This plan does not redefine ADR, portfolio, SPEC, or Gap Matrix authority.

## 3. Frozen Baselines

Hashes are LF-normalized where stated by the source audit.

| Baseline | Frozen value |
|---|---|
| Portfolio | `SPEC-PORTFOLIO-001` rev 2; SHA-256 `c449388972279d8add520564a9614cfa236f87b6c8932a70d5bc2d28eef6be86` |
| Portfolio audit | SHA-256 `120f22d0080ac0640ebbdad7c460df5de2745788cfaea83a1859f2c577168104` |
| Component SPEC | `SPEC-EXEC-001` rev 5; SHA-256 `556f4b5ad0b1c8f10d4fd00964d84e1af5bb959724d023eed9bda12a282411b2` |
| Component SPEC audit | SHA-256 `fae060d0595ceecf81daa56b7a5a9a597d503f974d20bdcd8eb3e6d1fc4add2e` |
| Upstream SPEC | `SPEC-DOM-001` rev 4; SHA-256 `cb4a21924d9619b8349d6cc239d7998633c402d7ea3d7461c2d4d8498f9a014c` |
| Upstream audit | SHA-256 `9bbea969820f3705354ee6ca76110039f747d9aa60c84e1a19cae49f01158c15` |
| Gap Matrix | SHA-256 `1497c11cb68f15806c505d21e85c5ddc1ae5edc76ae126315958aa4f5d2c19de` |
| Gap Matrix audit | SHA-256 `d83f85266ca47560b9efb34190d2da2569f7957a0ecae5941c4e1bd3cef11b80` |
| Gap Matrix audit basis | `HEAD:11e238e8e70ea0a57507eb428df1255b5216abc5; semantic authority/source/test combined SHA-256: 8d0b784c2cb16f189dd990efb07ade80a9d7ba64d0f15cc17e95f94edf830683` |
| Matrix assessed repository baseline | `6b11695154b73a99e35418bfd952795f2028a3bf` |
| Source-audit repository baseline | `eeb906a8f11007ca4fa41e8f0ba5e32daa690567` |
| Current repository HEAD | `dfa70c4ea67bb0bb50c79d01a0e8fb4b135c3998` |
| Working tree at intake | clean; existing candidate is a tracked untrusted output, not authority |

## 4. Baseline Drift Assessment

```text
AUTHORITY_DRIFT = NO_RELEVANT_DRIFT
IMPLEMENTATION_DRIFT = NO_RELEVANT_DRIFT
PLANNING_DRIFT = NON_SEMANTIC_DOCUMENTARY_DRIFT
BASELINE_DRIFT_STATUS = NON_SEMANTIC_DOCUMENTARY_DRIFT
SOURCE_AUTHORITY_UNMODIFIED = YES
```

The current HEAD is later than the Gap Matrix audit basis only through the conformance checkpoint and related governance documentation. `git diff 6b116951..HEAD` contains no changes under `src`, `tests` or `package.json`; the semantic source/test combined tree remains the audited SHA-256. Accepted ADRs, portfolio ownership/dependencies, component SPEC revision 5, upstream SPEC revision 4, failure ownership and compatibility ownership are unchanged. Therefore no Gap status requires revalidation, no authority revalidation is required, and no Gap Matrix regeneration is permitted or needed.

## 5. Validated Gap Intake

The current Matrix contains 18 distinct active gaps. Every identity, classification, severity, owner and delta is carried without reclassification or broadening.

| Gap | Requirement(s) | Obligation(s) | Category / severity | Local owner | Validated delta |
|---|---|---|---|---|---|
| GAP-001 | `EXEC-CONTRACT-002` | O-019 | `BEHAVIOR_CONTRADICTORY` / MAJOR | EXEC-001 | Unknown non-empty verdict passes generic validation and returns `VALID`; it must produce `VERDICT_UNKNOWN` without approval. |
| GAP-002 | `EXEC-VERSION-002`, `EXEC-REGISTRY-001`, `EXEC-REGISTRY-004`, `EXEC-CAPABILITY-001` | O-017, O-020 | `BEHAVIOR_CONTRADICTORY` / MAJOR | EXEC-001 | Overlapping supported sets are admitted and a candidate is selected by ordering; overlap must reject with no selection or mutation. |
| GAP-003 | `EXEC-SNAPSHOT-001` | O-018 | `BEHAVIOR_CONTRADICTORY` / MAJOR | EXEC-001 at DOM boundary | Caller versions establish snapshot basis; exact EXEC authority must supply the basis. |
| GAP-004 | `EXEC-REGISTRY-001` | O-020 | `BEHAVIOR_PARTIAL` / MAJOR | EXEC-001 | Expected revision, mutation key, atomic publication, idempotency and productive basis are absent. |
| GAP-005 | `EXEC-REGISTRY-004` | O-020 | `BEHAVIOR_PARTIAL` / MAJOR | EXEC-001 with DOM/PLAT boundary | Semantic persisted reconstruction, digest/source progression and rehydration are absent. |
| GAP-006 | `EXEC-REGISTRY-002` | O-020 | `DEPENDENCY_INTEGRATION_GAP` / MAJOR | EXEC-001 with REPO/DOM/source boundary | NORMAL and BOOTSTRAP separation exists locally, but owner-issued productive sources are unavailable. |
| GAP-007 | `EXEC-CAPABILITY-001` | O-020 | `BEHAVIOR_PARTIAL` / MAJOR | EXEC-001 with catalog source boundary | Local outcome distinctions exist, but productive source-bound resolution is unavailable. |
| GAP-008 | `EXEC-CAPABILITY-002` | O-020 | `BEHAVIOR_PARTIAL` / MAJOR | EXEC-001 with source/publication boundary | Synthetic local registration exists, but productive source publication authority is unavailable. |
| GAP-009 | `EXEC-MANIFEST-001` | O-021 | `BEHAVIOR_MISSING` / MAJOR | EXEC-001 with DOM/PLAT boundary | No productive complete immutable activity manifest exists. |
| GAP-010 | `EXEC-MANIFEST-002` | O-021 | `BEHAVIOR_MISSING` / MAJOR | EXEC-001 with EXEC-002/PLAT boundary | No productive checkpoint/resume-basis declaration exists. |
| GAP-011 | `EXEC-MANIFEST-003` | O-018, O-021 | `BEHAVIOR_MISSING` / MAJOR | EXEC-001 with DOM boundary | No started-basis freeze or new-attempt cutover surface exists. |
| GAP-012 | `EXEC-MANIFEST-004` | O-018, O-021 | `BEHAVIOR_MISSING` / MAJOR | EXEC-001 with DOM/PLAT boundary | No manifest tuple identity, attachment validator or semantic rehydration exists. |
| GAP-013 | `EXEC-HISTORY-001` | O-021 | `BEHAVIOR_MISSING` / MAJOR | EXEC-001 with PLAT boundary | No original-basis historical replay surface exists. |
| GAP-014 | `EXEC-FAILURE-001` | O-019 | `BEHAVIOR_PARTIAL` / MAJOR | EXEC-001 with mapping boundaries | Failure code/family/basis/cause/processing-state and mapping completeness are incomplete. |
| GAP-015 | `EXEC-REGISTRY-001`, `EXEC-REGISTRY-004` | O-020 | `BEHAVIOR_MISSING` / MAJOR | EXEC-001 with source/PLAT boundary | Expected revision, stale rejection, one-successor rule and idempotent retry are absent. |
| GAP-016 | `EXEC-REGISTRY-001`, `EXEC-REGISTRY-002`, `EXEC-REGISTRY-004`, `EXEC-CAPABILITY-001` | O-020 | `DEPENDENCY_INTEGRATION_GAP` / MAJOR | EXEC-001 with DOM/REPO/BOOTSTRAP/PLAT boundaries | Owner-issued exact basis material and productive source consumption are absent; fixtures cannot be promoted. |
| GAP-017 | `EXEC-REGISTRY-001`, `EXEC-REGISTRY-004`, `EXEC-CAPABILITY-002` | O-020 | `BEHAVIOR_CONTRADICTORY` / MAJOR | EXEC-001 with source/publication boundary | Plain `REGISTERED` result claims successor authority without issuer/publication proof. |
| GAP-018 | `EXEC-ENVELOPE-001` | O-016 | `BEHAVIOR_PARTIAL` / MAJOR | EXEC-001 | Generic payload schema accepts arbitrary object data; capability-specific identifiable schema selection/validation is absent. |

## 6. Planning Ownership Classification

| Planning type | Gaps | Count | Treatment |
|---|---|---:|---|
| `LOCAL_IMPLEMENTATION_WORK` | GAP-001, GAP-002, GAP-004, GAP-005, GAP-007, GAP-009, GAP-010, GAP-011, GAP-012, GAP-013, GAP-014, GAP-015, GAP-018 | 13 | Implement or correct EXEC-owned semantic behavior and local contract witnesses. |
| `CROSS_SPEC_DEPENDENCY` | GAP-006, GAP-016 | 2 | Consume defined owner-issued source contracts; productive producers remain foreign and integrated-proof-only. |
| `INTEGRATION_OR_CONVERGENCE_WORK` | GAP-003, GAP-008, GAP-017 | 3 | Converge the EXEC-owned contract with approved DOM/source/publication boundaries without transferring ownership. |
| `PREEXISTING_FOREIGN_CAPABILITY` | none | 0 | No foreign productive EXEC capability closes a target gap. |
| `TEST_OR_CONFORMANCE_WORK` | none as primary type | 0 | Evidence is attached to the behavior unit, not made into artificial production work. |
| `NO_LOCAL_WORK` | none | 0 | Every active Gap has a local EXEC contribution or explicit foreign handoff. |

## 7. Repository Planning Evidence

| Evidence | Planning interpretation |
|---|---|
| `src/domain/exec-schema.ts` (`PAYLOAD_SCHEMA_DOCUMENT`) | Generic `data` object is schema-valid but not capability-specific; extend the contract seam without freezing a schema library. |
| `src/application/exec-contract.ts` (`ValidateExecContract.validate`) | Envelope/payload are validated, but verdict membership and capability-specific schema selection are not performed here. |
| `src/domain/exec-registry.ts` (`CatalogBasis.register`, `RegistryResolutionService.resolveInternal`) | Local immutable entries and fixtures exist; registration lacks overlap/progression/mutation semantics and resolution sorts/selects candidates. |
| `src/application/exec-registry.ts` (`ResolveExecCapability`, `RegisterExecCapability`) | Caller basis is rejected and fixtures are rejected at productive seams, but productive DOM/REPO/source issuers and source-bound registration proof are unavailable. |
| `src/application/snapshot.ts`, `src/domain/snapshot.ts` | Caller `versions` can establish snapshot state; this is the validated contradiction to converge at the EXEC/DOM boundary. |
| `src/application/exec-registry-ports.ts` and `src/composition/exec-registry.ts` | Source ports and fixture/productive distinction exist; no productive NORMAL/BOOTSTRAP producer is available. |
| `tests/exec-001-ticket-001.test.ts`, `tests/exec-001-ticket-002.test.ts` | Existing tests prove local schema/registry boundary behavior only; they do not prove capability-specific schemas, overlap rejection, productive source availability, durability, replay or physical CAS. |
| No productive manifest/checkpoint/replay surface under `src` | New semantic contract seams and direct witnesses are required; PLAT physical persistence remains foreign. |
| Prototype files and prototype tests | Scenario/history evidence only; not authority or productive availability. |

Expected Repository Impact is planning guidance, not normative design authority. Likely impact is the existing EXEC schema/registry/application seams, the snapshot consumer boundary, a new EXEC manifest/checkpoint/replay semantic surface, and direct productive tests. No class, module, library, database, route or protocol is frozen by this plan.

## 8. Reuse Assessment

| Surface | Assessment | Boundary |
|---|---|---|
| Generic envelope/schema validation | `REUSE_AND_EXTEND` | preserve authenticated schema evidence while adding capability-specific schema identity/selection |
| Generic payload `data` acceptance | `REPLACE_CONTRADICTORY_PATH` | reject structurally generic payloads that lack capability schema authority |
| Version/registry domain values | `REUSE_AND_EXTEND` | preserve explicit SemVer, immutable values and scoped keys; add overlap/progression/mutation rules |
| Fixture catalog/source ports | `REUSE_UNCHANGED` for local contract evidence | fixtures remain non-authoritative and never prove productive availability |
| Productive source boundaries | `ADD_INTEGRATION_SEAM` | consume DOM/REPO/BOOTSTRAP-issued material; do not create foreign authority |
| Snapshot consumer | `REPLACE_CONTRADICTORY_PATH` at authority seam | caller versions become assertions; DOM identity/lifecycle remain DOM-owned |
| Manifest/checkpoint/replay | `ADD_NEW_CAPABILITY` | no productive implementation exists; preserve PLAT/EXEC-002 boundaries |
| Existing tests | `REUSE_AND_EXTEND` | retain passing regression tests and add direct positive/negative witnesses |

## 9. Implementation Units

Units are formed by coherent semantic and closure boundaries, not mechanically one per Gap. Every unit has validated Gap backing, upstream authority for identity/lifecycle/provenance/persistence meaning/ownership, local acceptance witnesses, and an explicit distinction between local contract evidence and later integrated proof.

### EXEC-IMP-01 — Capability-specific envelope and payload schemas

`UNIT_FORMATION_REASON = SHARED_AUTHORITY + SHARED_COMMAND_BOUNDARY + SHARED_CONFORMANCE`

#### Goal

Make the envelope and capability payload validation select identifiable capability-appropriate schema authority, while preserving structured minimum fields and non-authority of human text.

#### Authority and Ownership

- Primary component SPEC: `SPEC-EXEC-001`, `EXEC-ENVELOPE-001/002`.
- Portfolio obligation: `O-016`; approved role `CANONICAL_OWNER`.
- Local ownership: envelope/payload schema identity, capability-specific schema selection, validation result and structured-field requirements.
- Cross-spec dependencies: downstream consumers map this contract only.
- Foreign capabilities consumed: none required for local closure.
- Authority Consumption Proof: target SPEC audit §12 and §17–§18; `SPEC_IMPLEMENTABILITY_CHECK = PASS`.
- Authority consumption result: `AUTHORITY_CONSUMABLE` for local contract semantics.
- Availability condition: unit-owned contract harness is executable locally; fixture status is not productive availability.

#### Gap Matrix Coverage

`GAP-018`; requirement `EXEC-ENVELOPE-001`; regression coverage for implemented `EXEC-ENVELOPE-002`; acceptance `AC-EXEC-001`, `AC-EXEC-002`.

#### Portfolio Obligation Coverage

`O-016`; `CANONICAL_OWNER`.

#### Validated Delta

```text
OBSERVED: fixed generic payload schema accepts capabilityId plus arbitrary object data.
REQUIRED: capability payload is validated against an identifiable capability-appropriate schema before consumption; minimum envelope remains structured.
DELTA: add capability-specific schema authority and selection without freezing a mechanism.
```

#### Required Behavior

`LOCAL_BEHAVIOR`: valid envelope and capability payload use registered identifiable schemas; a structurally generic but capability-invalid payload is rejected as `CONTRACT_INVALID`. `END_TO_END_CONTRIBUTION`: consumers receive a contract whose payload meaning is not inferred from text or generic shape.

#### Does Not Implement

DOM identity/lifecycle; registry resolution; source publication; physical persistence; execution/session runtime; external effects; transport routes; UI/OPS presentation; final cross-SPEC conformance.

#### Repository Evidence

`src/domain/exec-schema.ts`, `src/application/exec-contract.ts`, `src/infrastructure/exec-schema-validator.ts`, and `tests/exec-001-ticket-001.test.ts`. Reuse the authenticated validation/result boundary; replace only the generic capability-payload path.

#### Expected Repository Impact

EXEC schema definitions, contract validation application seam and direct schema tests. Expected Repository Impact is planning guidance, not normative design authority.

#### Implementation Constraints

Preserve identifiable schemas, structured minimum fields, fail-closed invalid payload behavior and text non-authority. Do not choose schema library or physical format here.

#### Internal Prerequisites

None.

#### Cross-Spec Prerequisites

None for local closure. Downstream mappings are `REQUIRED_FOR_INTEGRATED_PROOF` only.

#### Producer / Consumer Contract Proof

`CAPABILITY_ID = EXEC-SCHEMA-CAPABILITY-PAYLOAD`; `AUTHORITY_OWNER = EXEC-001`; `PRODUCER = EXEC schema authority`; `PRODUCED_CONTRACT = identifiable capability-specific payload schema`; `CONSUMER = EXEC contract validator`; `CONSUMED_CAPABILITY = capability-specific payload validation`; `SEMANTIC_STATUS = DEFINED`; `LOCAL_TESTABILITY = YES`; `PRODUCTIVE_AVAILABILITY = NO` for the fixture harness; `CAPABILITY_SUMMARY_STATUS = CONTRACT_TESTABLE_LOCALLY`; `AVAILABILITY_EVIDENCE = direct schema harness`; `AVAILABILITY_CONDITION = local contract execution`; `DEPENDENCY_CLASS = INFORMATIONAL`; `DEPENDENCY_EDGE = unit-owned`; `PROOF_EVIDENCE = SPEC-EXEC-001 EXEC-ENVELOPE-001 and audit §12`.

#### Capability Availability and Blocking Effect

The local harness is testable but is not a productive foreign producer. It has no blocking effect because it is an informational local witness capability.

#### Temporal Authority Preconditions

`NOT_APPLICABLE`; this unit validates immutable contract input and does not observe mutable external authority before committing an effect.

#### Acceptance Criteria

1. A valid envelope and capability-specific payload pass their identifiable schemas; a generic payload with capability-invalid data is rejected (`LOCAL_PROVABILITY = YES`).
2. Missing minimum structured fields or text-only authority produce `CONTRACT_INVALID` and cannot imply approval, checkpoint or effect (`LOCAL_PROVABILITY = YES`).

#### ACCEPTANCE_WITNESS_MATRIX

| Normative behavior | Verb | Concrete operation | State affected | Direct positive | Direct negative/isolation | Expected evidence | Acceptance owner | Required capability | Authority | Contract | Local testability | Productive availability | Dependency class | Witness executable at local closure | Evidence type |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Capability payload schema selection | validate | `C-EXEC-001` / `AC-EXEC-001` | result contract | valid capability schema accepted | generic-but-capability-invalid payload rejected | schema witness | EXEC-IMP-01 | local schema harness | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |
| Structured envelope minimum | reject | `C-EXEC-002` / `AC-EXEC-002` | result contract | complete fields accepted | missing/text-only input → `CONTRACT_INVALID` | minimum-field witness | EXEC-IMP-01 | local schema harness | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |

#### Local Closure

`LOCAL_CLOSURE = YES`. All local criteria and completion evidence are executable with the local contract harness; no downstream unit or unavailable foreign capability is required.

#### Work Can Start

`WORK_CAN_START = YES`; `EXECUTION_READY = TRUE` for this unit.

#### Shared Closure Boundary

`SHARED_CLOSURE_BOUNDARY = YES` for the schema and structured-envelope facets; no registry or manifest behavior is merged.

#### Required Tests

Direct capability-specific schema positive/negative tests, missing-field tests, text-only rejection, schema identity mismatch, no-approval/no-effect assertions and regression of existing authenticated validation.

#### Legacy / Cutover Impact

`NEW_CANONICAL_PATH`; generic payload acceptance is retired as a contradictory local authority path. No legacy schema is silently converted.

#### Completion Evidence

Direct `C-EXEC-001/002` witness report, schema identity/selection evidence, generic-payload rejection and passing retained regression tests.

#### Risks

Generic payload fallback, schema identity omission and transport/prototype shape promotion.

#### Issue Decomposition Readiness

`ISSUE_READY`; `VALIDATED_GAP_BACKING = YES`; `INDEPENDENT_CLOSURE = YES`.

#### Initial DAG State

`READY`; `BLOCKED_BY = NONE`.

---

### EXEC-IMP-02 — Verdict registry and structured failure semantics

`UNIT_FORMATION_REASON = SHARED_AUTHORITY + SHARED_CONFORMANCE + SHARED_INTEGRATION_SEAM`

#### Goal

Make unknown verdicts and incomplete contract failures fail closed with structured, meaning-preserving failure data.

#### Authority and Ownership

- Primary component SPEC: `EXEC-CONTRACT-001/002`, `EXEC-FAILURE-001`.
- Portfolio obligation: `O-019`; approved role `CANONICAL_OWNER`.
- Local ownership: `CONTRACT_INVALID`, `VERDICT_UNKNOWN`, code/family/basis/cause/processing-state and no-success semantics.
- Foreign capabilities consumed: DOM lifecycle rejection and downstream mappings are integrated-proof-only.
- Authority Consumption Proof: target SPEC audit §§12, 18–21; DOM audit §§21, 28–29.
- Authority consumption result: local failure semantics consumable; mappings cannot redefine them.

#### Gap Matrix Coverage

`GAP-001`, `GAP-014`; requirements `EXEC-CONTRACT-002`, `EXEC-FAILURE-001`; implemented `EXEC-CONTRACT-001` is retained as regression evidence; acceptance `AC-EXEC-006`, `AC-EXEC-007`, `AC-EXEC-017`, `AC-EXEC-018`.

#### Portfolio Obligation Coverage

`O-019`; `CANONICAL_OWNER`.

#### Validated Delta

```text
OBSERVED: unknown non-empty verdict returns VALID; structured failure lacks complete basis/cause/state mapping.
REQUIRED: unknown/absent verdict is VERDICT_UNKNOWN and every failure preserves canonical non-success meaning.
DELTA: add verdict membership/classification and complete structured failure semantics.
```

#### Required Behavior

`LOCAL_BEHAVIOR`: absent/unknown verdict fails as `VERDICT_UNKNOWN`; malformed schema remains `CONTRACT_INVALID`; failure preserves code/family, contract/version/basis, cause, processing state and retryability without approval/effect implication. `END_TO_END_CONTRIBUTION`: DOM/BACKEND/OPS/UI can map the result without changing meaning.

#### Does Not Implement

DOM state transition; transport status; logging/UI implementation; effect execution/reconciliation; retry scheduler; foreign failure families.

#### Repository Evidence

`src/application/exec-contract.ts`, `src/domain/exec-contract.ts`, `src/domain/exec-schema.ts` and current contract tests. Preserve existing `CONTRACT_INVALID` behavior while closing the unknown-verdict path.

#### Expected Repository Impact

Contract result/failure types, validator boundary and direct failure tests. Expected Repository Impact is planning guidance, not normative design authority.

#### Implementation Constraints

No fallback approval, no text authority, no failure-code renaming by consumers, no requested-effect confirmation and no lifecycle transfer.

#### Internal Prerequisites

`EXEC-IMP-01`.

#### Cross-Spec Prerequisites

| Owner SPEC | Required capability | Implementation state | Blocking? |
|---|---|---|---|
| SPEC-DOM-001 | lifecycle rejection/structured verdict boundary | defined, productive runtime unavailable | No; integrated proof only |
| BACKEND/OPS/UI | meaning-preserving mappings | defined boundary, productive consumers unavailable | No; integrated proof only |

#### Producer / Consumer Contract Proof

`CAPABILITY_ID = EXEC-CANONICAL-FAILURE`; `AUTHORITY_OWNER = EXEC-001`; `PRODUCER = EXEC contract validator`; `PRODUCED_CONTRACT = structured canonical failure`; `CONSUMER = DOM/BACKEND/OPS/UI mapping boundaries`; `SEMANTIC_STATUS = DEFINED`; `LOCAL_TESTABILITY = YES`; `PRODUCTIVE_AVAILABILITY = NO` for foreign consumers; `DEPENDENCY_CLASS = REQUIRED_FOR_INTEGRATED_PROOF`; `BLOCKING_EFFECT = integrated proof only`; evidence is target audit §§21–29.

#### Capability Availability and Blocking Effect

Foreign mapping capabilities are `AUTHORITY_STATUS = DEFINED`, `CONTRACT_STATUS = DEFINED`, `LOCAL_TESTABILITY = NO`, `PRODUCTIVE_AVAILABILITY = NO`, `DEPENDENCY_CLASS = REQUIRED_FOR_INTEGRATED_PROOF`; they do not block local closure.

#### Temporal Authority Preconditions

`NOT_APPLICABLE` for local failure creation. External effect confirmation remains PLAT/GIT-owned.

#### Acceptance Criteria

1. Unknown or absent verdict yields `VERDICT_UNKNOWN`, never approval, completion, resume or success (`LOCAL_PROVABILITY = YES`).
2. Canonical failure preserves code/family, version/basis, cause and processing state; retry cannot convert basis or confirm effect (`LOCAL_PROVABILITY = YES`).

#### ACCEPTANCE_WITNESS_MATRIX

| Normative behavior | Verb | Concrete operation | State affected | Direct positive | Direct negative/isolation | Expected evidence | Acceptance owner | Required capability | Authority | Contract | Local testability | Productive availability | Dependency class | Witness executable at local closure | Evidence type |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Invalid contract failure | reject | `C-EXEC-008` / `AC-EXEC-006` | result processing | valid contract accepted | malformed/schema-invalid → `CONTRACT_INVALID`; no effect | failure witness | EXEC-IMP-02 | local failure harness | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |
| Unknown verdict | reject | `C-EXEC-009` / `AC-EXEC-007` | result processing | registered verdict accepted | absent/unknown → `VERDICT_UNKNOWN` | verdict witness | EXEC-IMP-02 | local failure harness | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |
| Structured failure/retry | emit/retry | `C-EXEC-014/017` / `AC-EXEC-017/018` | contract failure | typed failure retains basis | no fallback approval/conversion/effect confirmation | failure/retry witness | EXEC-IMP-02 | local failure harness | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |

#### Local Closure

`LOCAL_CLOSURE = YES`. Local failure and retry semantics are directly testable; foreign mapping/effect evidence is integrated-only.

#### Work Can Start

`WORK_CAN_START = NO` until `EXEC-IMP-01` completes; then `EXECUTION_READY = TRUE` for this unit.

#### Shared Closure Boundary

`SHARED_CLOSURE_BOUNDARY = YES` for verdict and failure meaning; DOM transition and physical effect ownership remain excluded.

#### Required Tests

Unknown/absent verdict, malformed JSON/schema, structured fields, no approval/checkpoint/effect, retry no-conversion and meaning-preserving mapping contract tests.

#### Legacy / Cutover Impact

`NEW_CANONICAL_PATH`; no legacy failure format is authority.

#### Completion Evidence

Passing `C-EXEC-008/009/014/017` witnesses, explicit no-success/no-effect assertions and mapping contract records.

#### Risks

Unknown verdict as approval, text fallback, failure meaning loss and requested effect treated as confirmation.

#### Issue Decomposition Readiness

`ISSUE_READY`; `VALIDATED_GAP_BACKING = YES`; `INDEPENDENT_CLOSURE = YES`.

#### Initial DAG State

`BLOCKED`; `BLOCKED_BY = EXEC-IMP-01`.

---

### EXEC-IMP-03 — Version semantics, overlap rejection and deterministic resolution

`UNIT_FORMATION_REASON = SHARED_AUTHORITY + SHARED_INVARIANT + SHARED_COMMAND_BOUNDARY + SHARED_CONFORMANCE`

#### Goal

Make SemVer/support-set semantics and valid-basis resolution deterministic, rejecting overlap before identity selection or mutation.

#### Authority and Ownership

- Primary requirements: `EXEC-VERSION-001/002`, `EXEC-REGISTRY-001`, `EXEC-CAPABILITY-001`.
- Portfolio obligations: `O-017`, `O-020`; `CANONICAL_OWNER`.
- Local ownership: version classification, disjointness, unique compatible resolution and distinct unknown/incompatible/invalid outcomes.
- Foreign capabilities consumed: exact DOM basis and source-backed catalogs are integrated-proof-only.
- Authority Consumption Proof: target SPEC audit §§17–§18 and §24; no unresolved authority gap.

#### Gap Matrix Coverage

`GAP-002`, `GAP-004`; requirements `EXEC-VERSION-001/002`, `EXEC-REGISTRY-001`, `EXEC-CAPABILITY-001`; acceptance `AC-EXEC-003`, `AC-EXEC-004`, `AC-EXEC-008`, `AC-EXEC-011`.

#### Portfolio Obligation Coverage

`O-017`, `O-020`; `CANONICAL_OWNER`.

#### Validated Delta

```text
OBSERVED: explicit sets exist, but overlapping sets are admitted and resolver sorts/selects a candidate; mutation semantics are incomplete.
REQUIRED: overlap is CONTRACT_INVALID with no selected identity, precedence or mutation; valid basis resolves one explicit entry.
DELTA: add overlap validation and deterministic resolution semantics.
```

#### Required Behavior

`LOCAL_BEHAVIOR`: classify semantic versions, reject overlap in either registration order, distinguish unknown/incompatible/invalid basis and resolve a unique complete entry from a valid frozen fixture basis. `END_TO_END_CONTRIBUTION`: later source-bound units consume this semantic resolver without selecting precedence.

#### Does Not Implement

DOM identity/snapshot; source publication; physical CAS/durability; manifest; session/runtime; downstream mappings.

#### Repository Evidence

`src/domain/exec-registry.ts` (`SupportedVersionSet`, `CatalogBasis.register`, `RegistryResolutionService.resolveInternal`) and `tests/exec-001-ticket-002.test.ts`. The ordered-candidate path is the validated contradiction.

#### Expected Repository Impact

Registry domain validation and direct SemVer/overlap/resolution tests. Expected Repository Impact is planning guidance, not normative design authority.

#### Implementation Constraints

No order-based precedence, alias/conversion, last-writer-wins or identity selection on an invalid basis; preserve explicit support sets and canonical failure codes.

#### Internal Prerequisites

`EXEC-IMP-01`.

#### Cross-Spec Prerequisites

DOM exact basis and NORMAL/BOOTSTRAP source contracts are defined but productive availability is `NO`, dependency class `REQUIRED_FOR_INTEGRATED_PROOF`; no local closure block.

#### Producer / Consumer Contract Proof

`CAPABILITY_ID = EXEC-REGISTRY-SEMANTIC-RESOLUTION`; `AUTHORITY_OWNER = EXEC-001`; `PRODUCER = EXEC registry semantics`; `PRODUCED_CONTRACT = unique resolution or canonical failure`; `CONSUMER = EXEC source/basis and snapshot units`; `AUTHORITY_STATUS = DEFINED`; `CONTRACT_STATUS = DEFINED`; `SEMANTIC_STATUS = DEFINED`; `LOCAL_TESTABILITY = YES`; `PRODUCTIVE_AVAILABILITY = NO` for foreign producers; `DEPENDENCY_CLASS = REQUIRED_FOR_INTEGRATED_PROOF`; `BLOCKING_EFFECT = integrated proof only`.

#### Capability Availability and Blocking Effect

Local fixtures are contract-level only. DOM/source productive capabilities remain unavailable but are not required for local closure.

#### Temporal Authority Preconditions

`TEMPORAL_AUTHORITY_PROOF` is inherited for later mutation operations; this unit has no external commit point and does not invent revalidation.

#### Acceptance Criteria

1. SemVer major/minor/patch and explicit support sets are observable; unsupported valid requests produce `INCOMPATIBLE_CAPABILITY` without conversion (`LOCAL_PROVABILITY = YES`).
2. Overlap in either registration order yields `CONTRACT_INVALID`, no identity selection and no basis mutation (`LOCAL_PROVABILITY = YES`).
3. Valid complete basis resolves deterministically; unknown, incompatible and invalid outcomes remain distinct (`LOCAL_PROVABILITY = YES`).

#### ACCEPTANCE_WITNESS_MATRIX

| Normative behavior | Verb | Concrete operation | State affected | Direct positive | Direct negative/isolation | Expected evidence | Acceptance owner | Required capability | Authority | Contract | Local testability | Productive availability | Dependency class | Witness executable at local closure | Evidence type |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| SemVer/support sets | classify/resolve | `C-EXEC-003` / `AC-EXEC-003` | registry basis | compatible minor/patch classified | incompatible major rejected | version witness | EXEC-IMP-03 | local registry fixture | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |
| Overlap rule | register/resolve | `C-EXEC-021` / `AC-EXEC-004/011` | catalog basis | disjoint sets resolve | overlap both orders → invalid/no mutation | overlap witness | EXEC-IMP-03 | local registry fixture | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |
| Deterministic mapping | resolve | `C-EXEC-004` / `AC-EXEC-008` | registry entry | complete entry returned | duplicate/conflict/order choice rejected | resolution witness | EXEC-IMP-03 | local registry fixture | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |

#### Local Closure

`LOCAL_CLOSURE = YES`; all semantic witnesses run against local contract fixtures. Productive source proof remains integrated-only.

#### Work Can Start

`WORK_CAN_START = NO` until `EXEC-IMP-01` completes; then `EXECUTION_READY = TRUE` for this unit.

#### Shared Closure Boundary

`SHARED_CLOSURE_BOUNDARY = YES` for version, disjointness and resolution; source publication and mutation concurrency are separate units.

#### Required Tests

Large SemVer values, major/minor/patch, unsupported requests, overlap both orders, no selected identity/no mutation, duplicate/conflict and unique valid resolution.

#### Legacy / Cutover Impact

`NEW_CANONICAL_PATH`; invalid overlap cannot become a legacy precedence rule; valid new semantic versions create new bases.

#### Completion Evidence

`C-EXEC-003/004/021` witness report, overlap no-mutation proof and unique-resolution assertions.

#### Risks

Version approximation, candidate ordering, duplicate authority and invalid basis mutation.

#### Issue Decomposition Readiness

`ISSUE_READY`; `VALIDATED_GAP_BACKING = YES`; `INDEPENDENT_CLOSURE = YES`.

#### Initial DAG State

`BLOCKED`; `BLOCKED_BY = EXEC-IMP-01`.

---

### EXEC-IMP-04 — Source-bound NORMAL/BOOTSTRAP catalog consumption

`UNIT_FORMATION_REASON = SHARED_INTEGRATION_SEAM + SHARED_AUTHORITY + SHARED_CONFORMANCE`

#### Goal

Consume only owner-issued NORMAL and BOOTSTRAP catalog/basis material, preserving scope, source, exact revision and productive-availability distinctions.

#### Authority and Ownership

- Primary requirements: `EXEC-REGISTRY-001/002/004`, `EXEC-CAPABILITY-001`.
- Portfolio obligation: `O-020`; `CANONICAL_OWNER`.
- Local ownership: source verification, scope/revision binding and consumption rejection; DOM/REPO/system sources retain material ownership.
- Authority Consumption Proofs: `DOM-EXEC-IDENTITY-SNAPSHOT`, `EXEC-NORMAL-CATALOG-SOURCE-PROGRESSION`, `EXEC-BOOTSTRAP-CATALOG-SOURCE-PROGRESSION` from current audits.
- Authority consumption result: contract defined and locally testable where fixtures exist; productive availability remains `NO` and integrated-only.

#### Gap Matrix Coverage

`GAP-006`, `GAP-007`, `GAP-016`; acceptance contributions to `AC-EXEC-005`, `AC-EXEC-008`, `AC-EXEC-009`, `AC-EXEC-011`, `AC-EXEC-019`, `AC-EXEC-021`.

#### Portfolio Obligation Coverage

`O-020`; `CANONICAL_OWNER`.

#### Validated Delta

```text
OBSERVED: local fixtures issue receipts, productive seams reject fixtures, and no productive DOM/REPO/BOOTSTRAP issuer is available.
REQUIRED: exact owner-issued scoped material is consumed; fixtures never become productive authority.
DELTA: complete the source-bound consumer contract and preserve integrated-only availability.
```

#### Required Behavior

`LOCAL_BEHAVIOR`: reject caller/fixture/unverified/detached/wrong-source/wrong-scope/stale basis and accept only a producer-issued basis whose scope and revision match the request. `END_TO_END_CONTRIBUTION`: productive DOM, REPO and BOOTSTRAP producers can later supply evidence without changing EXEC meaning.

#### Does Not Implement

DOM identity/source; REPO enablement/configuration; system bootstrap production; PLAT persistence; registry semantic ownership beyond consumption validation; scheduler or mappings.

#### Repository Evidence

`src/application/exec-registry.ts`, `src/application/exec-registry-ports.ts`, `src/composition/exec-registry.ts`; fixture rejection is already explicit. Extend source-bound contract tests without promoting fixtures.

#### Expected Repository Impact

Source ports/receipts, exact scope/revision binding, consumer validation and integrated handoff tests. Expected Repository Impact is planning guidance, not normative design authority.

#### Implementation Constraints

Preserve `AUTHORITY_STATUS`, `CONTRACT_STATUS`, `LOCAL_TESTABILITY`, `PRODUCTIVE_AVAILABILITY` as independent dimensions. No downstream promotion without new producer evidence.

#### Internal Prerequisites

`EXEC-IMP-03`.

#### Cross-Spec Prerequisites

| Owner / source | Required capability | Implementation state | Blocking? |
|---|---|---|---|
| SPEC-DOM-001 | execution identity/snapshot basis | defined; productive availability `NO` | No for local closure; yes for integrated proof |
| SPEC-REPO-001 | NORMAL enabled catalog source | defined boundary; productive availability `NO` | No for local closure; yes for integrated proof |
| Independent system source | BOOTSTRAP catalog | defined boundary; productive availability `NO` | No for local closure; yes for integrated proof |

#### Producer / Consumer Contract Proof

For `DOM-EXEC-IDENTITY-SNAPSHOT`: authority owner DOM, producer DOM canonical resolver, produced contract canonical identities/snapshot/exact basis, consumer IMP-04/06, status defined, local testability `NO`, productive availability `NO`, class `REQUIRED_FOR_INTEGRATED_PROOF`, edge `EXEC-001 → DOM-001`, integrated-only blocking.

For `EXEC-CATALOG-SOURCE-PROGRESSION`: authority owner EXEC semantic boundary with NORMAL/BOOTSTRAP producer, produced contract scoped predecessor/successor/digest/SourceSequence material, consumer IMP-04/08/09, local testability `YES` only through fixtures, productive availability `NO`, class `REQUIRED_FOR_INTEGRATED_PROOF`, fixture evidence is not promotion evidence.

#### Capability Availability and Blocking Effect

All external capabilities are defined, contract-defined, and unavailable productively. Their dependency class is `REQUIRED_FOR_INTEGRATED_PROOF`; therefore local execution and local closure are not blocked.

#### Temporal Authority Preconditions

Use the already-authorized `TEMPORAL_AUTHORITY_PROOF` for source observation before mutation. This unit does not invent source revalidation semantics.

#### Acceptance Criteria

1. NORMAL and BOOTSTRAP requests consume only matching owner-issued scope/source/revision material; fixture or caller material is rejected (`LOCAL_PROVABILITY = YES`).
2. A source-bound basis is required for valid resolution; no foreign producer is silently promoted (`LOCAL_PROVABILITY = YES`; integrated availability remains a separate proof).

#### ACCEPTANCE_WITNESS_MATRIX

| Normative behavior | Verb | Concrete operation | State affected | Direct positive | Direct negative/isolation | Expected evidence | Acceptance owner | Required capability | Authority | Contract | Local testability | Productive availability | Dependency class | Witness executable at local closure | Evidence type |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Catalog isolation | isolate/resolve | `C-EXEC-005` / `AC-EXEC-009` | catalog basis | NORMAL/BOOTSTRAP scopes remain distinct | wrong scope/source/fixture rejected | source-bound witness | EXEC-IMP-04 | contract fixture | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |
| Source-bound resolution | resolve | `C-EXEC-010/018` / `AC-EXEC-008/011/019` | resolution basis | matching owner-issued basis accepted | detached/stale/wrong-source basis rejected | source contract witness | EXEC-IMP-04 | source fixture | DEFINED | DEFINED | YES | NO | REQUIRED_FOR_INTEGRATED_PROOF | YES | LOCAL_TEST_EVIDENCE |

#### Local Closure

`LOCAL_CLOSURE = YES` for source-contract consumption and negative witnesses. Productive source integration is an integrated checkpoint obligation, not a local closure dependency.

#### Work Can Start

`WORK_CAN_START = NO` until `EXEC-IMP-03` completes; `EXECUTION_READY = TRUE` after that prerequisite for local contract work.

#### Shared Closure Boundary

`SHARED_CLOSURE_BOUNDARY = YES` for the source/scope/revision consumption seam. Registration publication authority is split into IMP-05 because it has a different issuer/result closure.

#### Required Tests

NORMAL/BOOTSTRAP isolation, fixture rejection, wrong-source/scope/revision, detached/foreign/stale basis, source progression contract and no productive promotion without evidence.

#### Legacy / Cutover Impact

`NEW_CANONICAL_PATH` and `LEGACY_COMPATIBILITY` as a REPO consumer; no fixture or legacy source is a second authority.

#### Completion Evidence

Source-bound contract witness report, independent capability dimensions, explicit fixture-versus-productive record and integrated handoff record.

#### Risks

Fixture promotion, source/scope mismatch, DOM identity substitution and hidden producer dependency.

#### Issue Decomposition Readiness

`ISSUE_READY`; `VALIDATED_GAP_BACKING = YES`; `INDEPENDENT_CLOSURE = YES`.

#### Initial DAG State

`BLOCKED`; `BLOCKED_BY = EXEC-IMP-03`.

---

### EXEC-IMP-05 — Issuer-bound registration and common extensibility

`UNIT_FORMATION_REASON = SHARED_AUTHORITY + SHARED_INTEGRATION_SEAM + SHARED_CONFORMANCE`

#### Goal

Make registration results consumer-verifiable and preserve registry-only extensibility without allowing a detached structural result to claim canonical publication authority.

#### Authority and Ownership

- Primary requirements: `EXEC-REGISTRY-001`, `EXEC-REGISTRY-004`, `EXEC-CAPABILITY-002`.
- Portfolio obligation: `O-020`; `CANONICAL_OWNER`.
- Local ownership: registration-result validation and common-path semantic extensibility; source/PLAT own publication and physical durability.
- Authority Consumption Proof: current target §12.1/§12.4 and producer/consumer records in Gap Matrix §13.

#### Gap Matrix Coverage

`GAP-008`, `GAP-017`; acceptance `AC-EXEC-012`, `AC-EXEC-022` contribution and `AC-EXEC-019` contribution.

#### Portfolio Obligation Coverage

`O-020`; `CANONICAL_OWNER`.

#### Validated Delta

```text
OBSERVED: local synthetic registration works, but RegistryRegistrationResult is a plain structural result without issuer/publication proof.
REQUIRED: only issuer-bound, consumer-verifiable registration evidence may authorize a successor; common registry path remains category-independent.
DELTA: validate publication provenance and preserve source/PLAT ownership.
```

#### Required Behavior

`LOCAL_BEHAVIOR`: accept only an issuer-bound result whose source, predecessor, successor, revision, payload and publication outcome are validated; synthetic capabilities use the common path. `END_TO_END_CONTRIBUTION`: source and PLAT can provide productive publication proof without EXEC inventing it.

#### Does Not Implement

Physical CAS/durability; source publication; DOM identity/lifecycle; category-specific consumer authorities; transport/UI.

#### Repository Evidence

`src/application/exec-registry.ts` (`RegisterExecCapability`) and `src/domain/exec-registry.ts` (`RegistryRegistrationResult`, `CatalogBasis.register`). Existing fixture rejection is retained; plain detached result is the contradiction.

#### Expected Repository Impact

Registration command/result boundary and direct forged-result/producer-proof tests. Expected Repository Impact is planning guidance, not normative design authority.

#### Implementation Constraints

No structural result promotion, no fixture promotion, no category-specific authority branch and no physical storage meaning invented in EXEC.

#### Internal Prerequisites

`EXEC-IMP-03`, `EXEC-IMP-04`.

#### Cross-Spec Prerequisites

| Owner | Required capability | Implementation state | Blocking? |
|---|---|---|---|
| NORMAL/BOOTSTRAP source owner | issuer/publication proof | contract defined; productive source unavailable | No for local contract closure; integrated proof only |
| SPEC-PLAT-001 | physical atomicity/CAS/durability | boundary defined; unavailable | No for local closure; integrated proof only |

#### Producer / Consumer Contract Proof

`CAPABILITY_ID = EXEC-REGISTRY-REGISTRATION-PUBLICATION`; authority owner EXEC/source boundary; producer authorized source; produced contract issuer-bound predecessor/successor/revision/publication result; consumer EXEC-001; semantic status defined; local testability yes by contract fixture; productive availability no; summary `CONTRACT_TESTABLE_LOCALLY`; class `REQUIRED_FOR_INTEGRATED_PROOF`; blocking effect integrated-only.

#### Capability Availability and Blocking Effect

The local issuer-proof fixture is testable but does not prove productive source/publication availability. No local AC depends on productive availability.

#### Temporal Authority Preconditions

Use target `TEMPORAL_AUTHORITY_PROOF`: initial expected revision, independent source re-observation, drift detection and fail-closed result are already normatively defined. No new revalidation semantics are introduced.

#### Acceptance Criteria

1. A schema-valid synthetic capability uses the common registry semantics without a category-specific authority (`LOCAL_PROVABILITY = YES`).
2. A detached or forged registration result cannot authorize a successor; only issuer-bound evidence is consumable (`LOCAL_PROVABILITY = YES`).

#### ACCEPTANCE_WITNESS_MATRIX

| Normative behavior | Verb | Concrete operation | State affected | Direct positive | Direct negative/isolation | Expected evidence | Acceptance owner | Required capability | Authority | Contract | Local testability | Productive availability | Dependency class | Witness executable at local closure | Evidence type |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Common-path extensibility | register/resolve | `C-EXEC-006` / `AC-EXEC-012` | registry basis | synthetic capability resolves through common path | category-specific branch rejected; frozen basis unchanged | extensibility witness | EXEC-IMP-05 | local registry fixture | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |
| Registration authority | publish/consume | `C-EXEC-023` / `AC-EXEC-022` | catalog successor | issuer-bound result accepted | forged/detached result rejected | issuer-proof witness | EXEC-IMP-05 | issuer contract fixture | DEFINED | DEFINED | YES | NO | REQUIRED_FOR_INTEGRATED_PROOF | YES | LOCAL_TEST_EVIDENCE |

#### Local Closure

`LOCAL_CLOSURE = YES` for issuer-proof and common-path semantics; physical publication remains integrated-only.

#### Work Can Start

`WORK_CAN_START = NO` until IMP-03 and IMP-04 complete.

#### Shared Closure Boundary

`SHARED_CLOSURE_BOUNDARY = YES` for result provenance and common extensibility; mutation concurrency is a separate unit.

#### Required Tests

Synthetic capability common-path test, category-branch isolation, forged/copy/source-mismatch registration result, successor identity/revision binding and no frozen-basis mutation.

#### Legacy / Cutover Impact

`NEW_CANONICAL_PATH`; detached structural registration results are retired as an alternate authority.

#### Completion Evidence

Issuer-bound result witness, forged-result rejection, common-path extensibility report and explicit integrated-only source/publication handoff.

#### Risks

Plain result authority bypass, source ownership transfer and duplicate category-specific registries.

#### Issue Decomposition Readiness

`ISSUE_READY`; `VALIDATED_GAP_BACKING = YES`; `INDEPENDENT_CLOSURE = YES`.

#### Initial DAG State

`BLOCKED`; `BLOCKED_BY = EXEC-IMP-03, EXEC-IMP-04`.

---

### EXEC-IMP-06 — Exact EXEC basis binding at the DOM snapshot boundary

`UNIT_FORMATION_REASON = SHARED_AUTHORITY + SHARED_INTEGRATION_SEAM + SHARED_CUTOVER`

#### Goal

Bind exact EXEC versions to the immutable DOM snapshot/manifest basis while ensuring caller values are assertions rather than canonical authority.

#### Authority and Ownership

- Requirement: `EXEC-SNAPSHOT-001`; portfolio obligation `O-018`, `CANONICAL_OWNER`.
- Local ownership: exact EXEC basis supply/validation and caller-basis rejection.
- Foreign ownership: DOM snapshot identity/immutability/lifecycle.
- Authority Consumption Proof: `DOM-EXEC-IDENTITY-SNAPSHOT`, defined but integrated-only unavailable.

#### Gap Matrix Coverage

`GAP-003`; acceptance `AC-EXEC-005` and contribution to `AC-EXEC-015/016`.

#### Portfolio Obligation Coverage

`O-018`; `CANONICAL_OWNER` with DOM consumer boundary.

#### Validated Delta

```text
OBSERVED: src/application/snapshot.ts maps caller versions into snapshot state without EXEC authority observation.
REQUIRED: EXEC authority supplies exact versions; caller values cannot establish the basis; later registry changes do not rewrite it.
DELTA: converge the caller path at the approved EXEC/DOM boundary.
```

#### Required Behavior

`LOCAL_BEHAVIOR`: the EXEC consumer treats caller versions only as assertions, rejects a caller/expected-basis mismatch without local mutation, and exposes the exact-basis requirement at the approved boundary. This local contribution does not claim that a DOM producer or snapshot aggregate is available.

`END_TO_END_CONTRIBUTION`: a productive DOM snapshot supplies the exact authority-backed basis and the DOM snapshot and EXEC manifest retain that same immutable basis. The complete `AC-EXEC-005` obligation is integrated proof, not local unit closure.

#### Does Not Implement

DOM identity/lifecycle/snapshot aggregate; registry semantics; manifest physical persistence; REPO configuration; downstream transport.

#### Repository Evidence

`src/application/snapshot.ts`, `src/domain/snapshot.ts`, and current snapshot tests. Existing caller path is replaced only at the authority seam.

#### Expected Repository Impact

EXEC-to-DOM basis consumption seam, caller mismatch rejection and direct convergence tests. Expected Repository Impact is planning guidance, not normative design authority.

#### Implementation Constraints

No caller authority, no silent conversion, no DOM identity transfer, no snapshot mutation on rejection and exact frozen basis preservation.

#### Internal Prerequisites

`EXEC-IMP-03`, `EXEC-IMP-04`.

#### Cross-Spec Prerequisites

DOM identity/snapshot producer is defined but `PRODUCTIVE_AVAILABILITY = NO`, class `REQUIRED_FOR_INTEGRATED_PROOF`. It is not required for the local caller-authority guard, but it is required for the complete `AC-EXEC-005` integrated witness at `CP-EXEC-03`.

#### Producer / Consumer Contract Proof

`CAPABILITY_ID = DOM-EXEC-IDENTITY-SNAPSHOT`; authority owner DOM; producer DOM canonical resolver; produced contract identities, snapshot and exact basis; consumer EXEC-IMP-06; semantic status defined; local testability no; productive availability no; dependency class `REQUIRED_FOR_INTEGRATED_PROOF`; edge `EXEC-001 → DOM-001`; integrated-only blocking.

#### Capability Availability and Blocking Effect

The local contract fixture proves only binding semantics. No downstream promotion is claimed.

#### Temporal Authority Preconditions

`NOT_APPLICABLE` to local binding; any observe-then-commit effect revalidation remains with the approved owner.

#### Acceptance Criteria

1. **Local contribution to `AC-EXEC-005`:** the EXEC boundary treats caller versions as assertions, rejects a caller/expected-basis mismatch, and performs no local snapshot mutation (`LOCAL_PROVABILITY = YES`).
2. **Plan-level `AC-EXEC-005`:** a productive DOM witness proves that the exact authority-backed basis is captured and remains immutable against later registry mutation (`LOCAL_PROVABILITY = NO`; `FINAL_PROOF_OWNER = EXEC-IMP-06`; `INTEGRATION_PROOF_STAGE = CP-EXEC-03`).

#### ACCEPTANCE_WITNESS_MATRIX

| Normative behavior | Verb | Concrete operation | State affected | Direct positive | Direct negative/isolation | Expected evidence | Acceptance owner | Required capability | Authority | Contract | Local testability | Productive availability | Dependency class | Witness executable at local closure | Evidence type |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Caller-authority guard (local contribution to `AC-EXEC-005`) | validate/reject | `C-EXEC-005` / `AC-EXEC-005` local contribution | EXEC basis input | authority-bound input is accepted as a contract value | caller mismatch is rejected with no local mutation | caller-authority guard report | EXEC-IMP-06 | unit-owned EXEC boundary | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |
| Exact DOM-bound basis (plan-level `AC-EXEC-005`) | resolve/freeze | `C-EXEC-005` / `AC-EXEC-005` integrated proof | DOM snapshot/manifest basis | DOM authority supplies and freezes the exact basis | caller mismatch or post-start registry mutation cannot change it | integrated DOM basis evidence | EXEC-IMP-06 | DOM-EXEC-IDENTITY-SNAPSHOT | DEFINED | DEFINED | NO | NO | REQUIRED_FOR_INTEGRATED_PROOF | NO | INTEGRATION_TEST_EVIDENCE |

#### Local Closure

`LOCAL_CLOSURE = YES`; `LOCAL_CLOSURE_SCOPE = EXEC_CALLER_AUTHORITY_CONTRIBUTION_ONLY`. The complete plan-level `AC-EXEC-005` closes only at `CP-EXEC-03`; integrated evidence is not local Completion Evidence.

#### Work Can Start

`WORK_CAN_START = NO` until IMP-03 and IMP-04 complete.

#### Shared Closure Boundary

`SHARED_CLOSURE_BOUNDARY = YES` for caller-basis convergence; manifest completeness/freeze is separate.

#### Required Tests

Local caller/expected-basis mismatch and no-mutation tests. At `CP-EXEC-03`, integrated DOM exact-basis, post-start registry-mutation and immutable snapshot/manifest tests are required; those tests are not local closure evidence.

#### Legacy / Cutover Impact

`CUTOVER`; a changed basis requires a new DOM attempt/identity; historical snapshots remain unchanged.

#### Completion Evidence

Local: caller-authority guard and no-local-mutation report. Integrated: `CP-EXEC-03` exact DOM-basis evidence for plan-level `AC-EXEC-005`.

#### Risks

Caller-authority bypass, current-registry reinterpretation and DOM ownership transfer.

#### Issue Decomposition Readiness

`ISSUE_READY`; `VALIDATED_GAP_BACKING = YES`; `INDEPENDENT_CLOSURE = YES` for the local contribution; the plan-level integrated witness remains an explicit checkpoint handoff.

#### Initial DAG State

`BLOCKED`; `BLOCKED_BY = EXEC-IMP-03, EXEC-IMP-04`.

---

### EXEC-IMP-07 — Complete immutable manifest and started-basis freeze

`UNIT_FORMATION_REASON = SHARED_AUTHORITY + SHARED_PERSISTENCE_BOUNDARY + SHARED_CUTOVER + SHARED_CONFORMANCE`

#### Goal

Make the activity-attempt manifest complete before start and immutable after start, including exact schema/version basis and DOM attachment references.

#### Authority and Ownership

- Requirements: `EXEC-MANIFEST-001`, `EXEC-MANIFEST-003`; obligations `O-018`, `O-021`; `CANONICAL_OWNER`.
- Local ownership: manifest semantic content, completeness, exact basis and freeze/cutover.
- Foreign ownership: DOM identity/attempt lifecycle and PLAT durability.
- Authority proofs: target manifest identity/reconstruction proofs and DOM audit §§17–23.

#### Gap Matrix Coverage

`GAP-009`, `GAP-011`; acceptance `AC-EXEC-013`, `AC-EXEC-015`.

#### Portfolio Obligation Coverage

`O-018`, `O-021`; `CANONICAL_OWNER`.

#### Validated Delta

```text
OBSERVED: no productive complete manifest or started-basis freeze exists.
REQUIRED: one complete DOM-bound manifest before start; started schema/version/basis is immutable; changed basis is a new attempt.
DELTA: add semantic manifest completeness/freeze contract without assigning storage authority.
```

#### Required Behavior

`LOCAL_BEHAVIOR`: validate the EXEC-owned manifest field set and freeze/cutover rules against supplied contract values; reject missing fields and post-start mutation without claiming DOM attachment or durable persistence. This is the locally closable semantic contribution.

`END_TO_END_CONTRIBUTION`: a productive DOM/PLAT path proves one complete DOM-bound manifest before start, durable started-basis immutability and history preservation. The complete `AC-EXEC-013` and `AC-EXEC-015` obligations are integrated proof, not local unit closure.

#### Does Not Implement

DOM identity/lifecycle; registry reconstruction; physical persistence/recovery; session context; external effects; projections.

#### Repository Evidence

No productive manifest under `src`; prototype values are non-authoritative. This is `ADD_NEW_CAPABILITY` plus typed foreign seams.

#### Expected Repository Impact

Manifest semantic boundary and direct completeness/freeze tests; persistence and DOM attachment remain integration seams. Expected Repository Impact is planning guidance, not normative design authority.

#### Implementation Constraints

Complete pre-start creation, immutable post-start basis, new AttemptId for change, no path/digest/checkpoint alias as identity and no historical rewrite.

#### Internal Prerequisites

`EXEC-IMP-01`, `EXEC-IMP-03`, `EXEC-IMP-06` for the acceptance-order contribution to `AC-EXEC-015`.

#### Cross-Spec Prerequisites

DOM identity/attempt and PLAT durability are defined, unavailable productively and `REQUIRED_FOR_INTEGRATED_PROOF` only. They are not required for the local field-validation/freeze contribution, but are required for the complete `AC-EXEC-013` and `AC-EXEC-015` witnesses at `CP-EXEC-03`.

#### Producer / Consumer Contract Proof

`CAPABILITY_ID = EXEC-ACTIVITY-MANIFEST`; authority owner EXEC; producer manifest semantic boundary; produced contract complete immutable manifest; consumers DOM/PLAT/EXEC-002; semantic status defined; local testability yes; productive availability no for foreign producers; dependency class integrated-proof-only for foreign capabilities.

#### Capability Availability and Blocking Effect

Local manifest fixture is testable; physical persistence/DOM runtime remain integrated-only and do not block local closure.

#### Temporal Authority Preconditions

`NOT_APPLICABLE` for local construction/freeze; mutable external authority revalidation remains with the owning boundary.

#### Acceptance Criteria

1. **Local contribution to `AC-EXEC-013`:** the EXEC-owned manifest field validator accepts a complete supplied contract and rejects missing fields without claiming DOM attachment or durable persistence (`LOCAL_PROVABILITY = YES`).
2. **Local contribution to `AC-EXEC-015`:** the EXEC-owned freeze rule rejects post-start mutation and requires a new attempt for a changed supplied basis (`LOCAL_PROVABILITY = YES`).
3. **Plan-level `AC-EXEC-013`/`AC-EXEC-015`:** productive DOM/PLAT evidence proves complete attachment, durable started-basis immutability and preserved history (`LOCAL_PROVABILITY = NO`; `FINAL_PROOF_OWNER = EXEC-IMP-07`; `INTEGRATION_PROOF_STAGE = CP-EXEC-03`).

#### ACCEPTANCE_WITNESS_MATRIX

| Normative behavior | Verb | Concrete operation | State affected | Direct positive | Direct negative/isolation | Expected evidence | Acceptance owner | Required capability | Authority | Contract | Local testability | Productive availability | Dependency class | Witness executable at local closure | Evidence type |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Manifest field validation (local contribution to `AC-EXEC-013`) | create/validate | `C-EXEC-007` / `AC-EXEC-013` local contribution | EXEC manifest contract | complete supplied field set accepted | missing field rejected | local manifest-field report | EXEC-IMP-07 | unit-owned manifest contract | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |
| Basis freeze (local contribution to `AC-EXEC-015`) | freeze/reject | `C-EXEC-012` / `AC-EXEC-015` local contribution | EXEC manifest contract | supplied started basis remains unchanged | post-start mutation rejected; new attempt required | local freeze report | EXEC-IMP-07 | unit-owned freeze contract | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |
| Complete DOM-bound manifest (plan-level `AC-EXEC-013`) | create/attach | `C-EXEC-007` / `AC-EXEC-013` integrated proof | activity/attempt manifest | complete manifest is attached before start | missing identity or attachment rejected | integrated manifest evidence | EXEC-IMP-07 | DOM-EXEC-IDENTITY-SNAPSHOT + PLAT-EXEC-PERSISTED-MATERIAL | DEFINED | DEFINED | NO | NO | REQUIRED_FOR_INTEGRATED_PROOF | NO | INTEGRATION_TEST_EVIDENCE |
| Durable started-basis freeze (plan-level `AC-EXEC-015`) | preserve/reject | `C-EXEC-012` / `AC-EXEC-015` integrated proof | started manifest | exact basis remains immutable in durable history | post-start mutation or changed basis without new attempt rejected | integrated freeze/history evidence | EXEC-IMP-07 | DOM-EXEC-IDENTITY-SNAPSHOT + PLAT-EXEC-PERSISTED-MATERIAL | DEFINED | DEFINED | NO | NO | REQUIRED_FOR_INTEGRATED_PROOF | NO | INTEGRATION_TEST_EVIDENCE |

#### Local Closure

`LOCAL_CLOSURE = YES`; `LOCAL_CLOSURE_SCOPE = EXEC_MANIFEST_FIELD_AND_FREEZE_CONTRIBUTION_ONLY`. The complete plan-level `AC-EXEC-013` and `AC-EXEC-015` obligations close only at `CP-EXEC-03`; integrated evidence is not local Completion Evidence.

#### Work Can Start

`WORK_CAN_START = NO` until IMP-01, IMP-03 and the IMP-06 acceptance-order contribution complete.

#### Shared Closure Boundary

`SHARED_CLOSURE_BOUNDARY = YES` for complete fields and freeze; identity/reconstruction and replay are separate.

#### Required Tests

Local manifest-field completeness, missing/duplicate field rejection, post-start freeze and new-attempt cutover tests. At `CP-EXEC-03`, integrated DOM attachment, durable started-basis and history-preservation tests are required; those tests are not local closure evidence.

#### Legacy / Cutover Impact

`CUTOVER` and `HISTORICAL_REPLAY`; old started basis remains readable and unchanged.

#### Completion Evidence

Local: field-validation, mutation-rejection and new-attempt contract reports. Integrated: `CP-EXEC-03` complete DOM-bound manifest, durable freeze and history evidence for plan-level `AC-EXEC-013`/`AC-EXEC-015`.

#### Risks

Manifest mutation, basis drift, identity aliasing and storage meaning leakage.

#### Issue Decomposition Readiness

`ISSUE_READY`; `VALIDATED_GAP_BACKING = YES`; `INDEPENDENT_CLOSURE = YES` for the local contribution; the plan-level integrated witnesses remain explicit checkpoint handoffs.

#### Initial DAG State

`BLOCKED`; `BLOCKED_BY = EXEC-IMP-01, EXEC-IMP-03`.

---

### EXEC-IMP-08 — Registry identity and semantic reconstruction

`UNIT_FORMATION_REASON = SHARED_AUTHORITY + SHARED_PERSISTENCE_BOUNDARY + SHARED_INVARIANT`

#### Goal

Make `REGISTRY_ENTRY` identity, scope, source-backed progression and fail-closed reconstruction semantically provable without owning physical storage.

#### Authority and Ownership

- Requirement: `EXEC-REGISTRY-004`; obligation `O-020`; `CANONICAL_OWNER`.
- Local ownership: semantic create/rehydrate validation, identity, attachment, continuity and invalid-material rejection.
- Foreign ownership: DOM `RepositoryId`; PLAT material/integrity/order/recovery; catalog sources.
- Authority proofs: target SPEC audit §§17–20 and current source-bound handoffs.

#### Gap Matrix Coverage

`GAP-005`; acceptance `AC-EXEC-019`, `AC-EXEC-021` and contribution to `AC-EXEC-020`.

#### Portfolio Obligation Coverage

`O-020`; `CANONICAL_OWNER`.

#### Validated Delta

```text
OBSERVED: scoped in-process entries exist, but persisted material, digest/source progression and semantic rehydration do not.
REQUIRED: create and rehydrate are distinct; scope, references, progression, continuity and failure are validated before materialization.
DELTA: add semantic reconstruction while preserving DOM/PLAT/source ownership.
```

#### Required Behavior

`LOCAL_BEHAVIOR`: NORMAL includes DOM `RepositoryId`, BOOTSTRAP is system-scoped, and only complete source-backed material rehydrates; detached, corrupt, stale, skipped, foreign, overlapping or inconsistent material fails `CONTRACT_INVALID` without mutation. `END_TO_END_CONTRIBUTION`: PLAT supplies physical material and source supplies progression evidence.

#### Does Not Implement

DOM identity creation; physical storage/serialization/CAS/recovery; repository configuration; registry retirement; downstream mapping.

#### Repository Evidence

`src/domain/exec-registry.ts` identity and fixture basis; `src/application/exec-registry.ts` source selection. No productive persisted reconstruction path exists.

#### Expected Repository Impact

Registry semantic rehydration and direct invalid-material/continuity tests; physical persistence remains unfrozen guidance. Expected Repository Impact is planning guidance, not normative design authority.

#### Implementation Constraints

Create differs from rehydrate; canonical keys cannot be aliases; physical revision/CAS is not domain continuity; no untrusted material becomes valid state directly; no mutation on failure.

#### Internal Prerequisites

`EXEC-IMP-03`, `EXEC-IMP-04`.

#### Cross-Spec Prerequisites

DOM `RepositoryId`, source progression and PLAT material are defined, unavailable productively and `REQUIRED_FOR_INTEGRATED_PROOF`; local semantic fixtures provide local witnesses only.

#### Producer / Consumer Contract Proof

`CAPABILITY_ID = EXEC-CATALOG-RECONSTRUCTION`; authority owner EXEC; producers authorized NORMAL/BOOTSTRAP source and PLAT material boundary; produced contract validated scoped basis/progression; consumer EXEC-IMP-08; status defined; local testability yes via fixtures; productive availability no; dependency class integrated-proof-only for foreign producers; no local blocking.

#### Capability Availability and Blocking Effect

Local reconstruction fixtures are contract evidence only. Physical durability and source production remain integrated-only.

#### Temporal Authority Preconditions

Use the target `TEMPORAL_AUTHORITY_PROOF` for expected revision, independent source observation, drift detection and fail-closed result; do not invent a new protocol.

#### Acceptance Criteria

1. NORMAL/BOOTSTRAP identity and references rehydrate only with matching scope, source, digest, progression and continuity (`LOCAL_PROVABILITY = YES`).
2. Detached, corrupt, stale, skipped, foreign, forged-later or overlapping material fails `CONTRACT_INVALID` with no mutation (`LOCAL_PROVABILITY = YES`).

#### ACCEPTANCE_WITNESS_MATRIX

| Normative behavior | Verb | Concrete operation | State affected | Direct positive | Direct negative/isolation | Expected evidence | Acceptance owner | Required capability | Authority | Contract | Local testability | Productive availability | Dependency class | Witness executable at local closure | Evidence type |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Registry identity | create/lookup/rehydrate | `C-EXEC-018` / `AC-EXEC-019` | catalog entry/basis | scoped NORMAL and BOOTSTRAP identities resolve correctly | cross-repository/wrong-scope substitution rejected | identity witness | EXEC-IMP-08 | reconstruction fixture | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |
| Reconstruction continuity | rehydrate/reject | `C-EXEC-020/022` / `AC-EXEC-021` | registry basis | legitimate source-backed successor rehydrates | forged/skipped/detached/digest mismatch → invalid/no mutation | reconstruction witness | EXEC-IMP-08 | progression fixture | DEFINED | DEFINED | YES | NO | REQUIRED_FOR_INTEGRATED_PROOF | YES | LOCAL_TEST_EVIDENCE |

#### Local Closure

`LOCAL_CLOSURE = YES`; semantic identity/reconstruction evidence is locally executable. PLAT durability remains integrated-only.

#### Work Can Start

`WORK_CAN_START = NO` until IMP-03 and IMP-04 complete.

#### Shared Closure Boundary

`SHARED_CLOSURE_BOUNDARY = YES` for registry identity and reconstruction; mutation concurrency is separate.

#### Required Tests

Two-repository isolation, NORMAL/BOOTSTRAP scope, duplicate create, wrong attachment, digest/source/reference mismatch, skipped/out-of-order/stale/foreign/forged material and no mutation on failure.

#### Legacy / Cutover Impact

`HISTORICAL_REPLAY` ownership is preserved; frozen scoped basis cannot be replaced by current or foreign material.

#### Completion Evidence

`C-EXEC-018/020/022` reports, identity/reconstruction proof, continuity evidence and no-mutation assertions.

#### Risks

Repository identity collapse, direct materialization of untrusted data and numeric revision mistaken for causal authority.

#### Issue Decomposition Readiness

`ISSUE_READY`; `VALIDATED_GAP_BACKING = YES`; `INDEPENDENT_CLOSURE = YES`.

#### Initial DAG State

`BLOCKED`; `BLOCKED_BY = EXEC-IMP-03, EXEC-IMP-04`.

---

### EXEC-IMP-09 — Registry mutation concurrency and idempotent retry

`UNIT_FORMATION_REASON = SHARED_AUTHORITY + SHARED_INVARIANT + SHARED_PERSISTENCE_BOUNDARY + SHARED_CONFORMANCE`

#### Goal

Make registry publication require the expected current revision and deterministic mutation key, producing one semantic successor or no mutation with deterministic stale/idempotent outcomes.

#### Authority and Ownership

- Requirements: `EXEC-REGISTRY-001`, `EXEC-REGISTRY-004`; obligation `O-020`; `CANONICAL_OWNER`.
- Local ownership: expected-revision semantics, stale/concurrent rejection, one-successor rule and retry reconciliation.
- Foreign ownership: source publication and PLAT physical CAS/durability.
- Authority proofs: target SPEC audit §24 and Gap Matrix temporal proof.

#### Gap Matrix Coverage

`GAP-004`, `GAP-015`; acceptance `AC-EXEC-008`, `AC-EXEC-022`.

#### Portfolio Obligation Coverage

`O-020`; `CANONICAL_OWNER`.

#### Validated Delta

```text
OBSERVED: in-memory register increments revision without expected revision, mutation key, source reconciliation or idempotent retry.
REQUIRED: expected basis, one semantic successor/no mutation, stale rejection and same-key replay are explicit.
DELTA: add semantic mutation and retry contract without choosing physical CAS/storage.
```

#### Required Behavior

`LOCAL_BEHAVIOR`: `ExpectedCatalogRevision` and `RegistryMutationKey` are required; stale/competing/conflicting-key commands fail closed; identical key/payload replays the original result without a second revision; ambiguous retry reconciles by key. `END_TO_END_CONTRIBUTION`: PLAT/source provide physical publication/integrity.

#### Does Not Implement

Physical CAS/journal/database/durability; source publication; DOM lifecycle; external effects; transport.

#### Repository Evidence

`CatalogBasis.register` and `RegisterExecCapability` show the in-memory revision/plain-result path; no mutation command/reconciliation surface exists.

#### Expected Repository Impact

Registry mutation command/result semantics and direct stale/concurrency/idempotency tests. Expected Repository Impact is planning guidance, not normative design authority.

#### Implementation Constraints

One semantic accept/reject decision; no last-writer-wins/merge; physical CAS cannot define domain meaning; last valid basis is preserved on failure.

#### Internal Prerequisites

`EXEC-IMP-03`, `EXEC-IMP-04`, `EXEC-IMP-05`, `EXEC-IMP-08`.

#### Cross-Spec Prerequisites

Source publication and PLAT physical integrity are `REQUIRED_FOR_INTEGRATED_PROOF`, defined but unavailable productively; no local closure block.

#### Producer / Consumer Contract Proof

`CAPABILITY_ID = EXEC-REGISTRY-MUTATION`; authority owner EXEC; producer semantic mutation boundary plus source/PLAT physical producers; produced contract one successor/no mutation and idempotent result; consumer EXEC-IMP-09 and snapshot/manifest consumers; semantic status defined; local testability yes; productive availability no for foreign producers; dependency class integrated-proof-only for foreign capabilities.

#### Capability Availability and Blocking Effect

Fixture mutation witnesses are local contract evidence only. No productive source/CAS promotion is claimed.

#### Temporal Authority Preconditions

`TEMPORAL_AUTHORITY_PROOF = TEMPORAL_AUTHORITY_PROTECTED`, inherited from target SPEC/audit: initial observation, expected revision/digest, independent source re-observation, drift detection, fail-closed behavior and state preservation are already authoritative.

#### Acceptance Criteria

1. Valid mutation publishes one successor; stale/concurrent expected revision fails `CONTRACT_INVALID`/`STALE_CATALOG_BASIS` with no mutation (`LOCAL_PROVABILITY = YES`).
2. Same mutation key and payload replay the original result without a new revision; conflicting payload fails and ambiguous retry reconciles before retry (`LOCAL_PROVABILITY = YES`).

#### ACCEPTANCE_WITNESS_MATRIX

| Normative behavior | Verb | Concrete operation | State affected | Direct positive | Direct negative/isolation | Expected evidence | Acceptance owner | Required capability | Authority | Contract | Local testability | Productive availability | Dependency class | Witness executable at local closure | Evidence type |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Expected revision/one successor | register/publish | `C-EXEC-023` / `AC-EXEC-022` | catalog revision | valid successor accepted once | stale/concurrent basis → invalid/no mutation | mutation witness | EXEC-IMP-09 | local mutation fixture | DEFINED | DEFINED | YES | NO | REQUIRED_FOR_INTEGRATED_PROOF | YES | LOCAL_TEST_EVIDENCE |
| Idempotent retry | reconcile/retry | `C-EXEC-023` / `AC-EXEC-022` | mutation result/revision | same key/payload replays original | key payload conflict/ambiguous stale retry rejected | retry witness | EXEC-IMP-09 | local mutation fixture | DEFINED | DEFINED | YES | NO | REQUIRED_FOR_INTEGRATED_PROOF | YES | LOCAL_TEST_EVIDENCE |

#### Local Closure

`LOCAL_CLOSURE = YES`; semantic concurrency/idempotency witnesses are locally executable. Physical CAS/durability is integrated-only.

#### Work Can Start

`WORK_CAN_START = NO` until IMP-03, IMP-04, IMP-05 and IMP-08 complete.

#### Shared Closure Boundary

`SHARED_CLOSURE_BOUNDARY = YES` for stale, successor and retry semantics; physical persistence is outside the unit.

#### Required Tests

Expected revision, two competing successors, stale rejection, no mutation, same-key replay, key/payload conflict, ambiguous-result reconciliation and retained prior basis.

#### Legacy / Cutover Impact

`CUTOVER` and `HISTORICAL_REPLAY`; accepted basis remains immutable and retry cannot reinterpret historical material.

#### Completion Evidence

`C-EXEC-023` direct concurrency/idempotency report, no-mutation proof, stale reason and same-key replay identity/revision evidence.

#### Risks

Last-writer-wins, duplicate revisions, physical CAS promoted to semantics and retry without reconciliation.

#### Issue Decomposition Readiness

`ISSUE_READY`; `VALIDATED_GAP_BACKING = YES`; `INDEPENDENT_CLOSURE = YES`.

#### Initial DAG State

`BLOCKED`; `BLOCKED_BY = EXEC-IMP-03, EXEC-IMP-04, EXEC-IMP-05, EXEC-IMP-08`.

---

### EXEC-IMP-10 — Manifest identity, reconstruction and retry lineage

`UNIT_FORMATION_REASON = SHARED_AUTHORITY + SHARED_PERSISTENCE_BOUNDARY + SHARED_INVARIANT`

#### Goal

Make one immutable `ACTIVITY_ATTEMPT_MANIFEST` per DOM tuple semantically reconstructable, attachment-safe and retry-distinct.

#### Authority and Ownership

- Requirement: `EXEC-MANIFEST-004`; obligations `O-018`, `O-021`; `CANONICAL_OWNER`.
- Local ownership: tuple identity, attachment/cardinality, digest/basis validation, rehydration and retry lineage.
- Foreign ownership: DOM identity and PLAT physical integrity/recovery.
- Authority proofs: target SPEC audit §§17–§18 and DOM audit §§17–§23.

#### Gap Matrix Coverage

`GAP-012`; acceptance `AC-EXEC-018`, `AC-EXEC-020` and contribution to `AC-EXEC-014/016`.

#### Portfolio Obligation Coverage

`O-018`, `O-021`; `CANONICAL_OWNER`.

#### Validated Delta

```text
OBSERVED: no productive manifest identity, digest, attachment validator or semantic rehydration/retry path exists.
REQUIRED: exactly one immutable manifest per DOM tuple; detached/stale/corrupt/duplicate material fails closed; retry uses a new AttemptId.
DELTA: add local semantic identity/reconstruction and retry-lineage proof.
```

#### Required Behavior

`LOCAL_BEHAVIOR`: validate the EXEC-owned tuple, digest, cardinality and retry-lineage rules against supplied contract material; reject detached, corrupt, stale or duplicate values without local mutation and require a new AttemptId for retry. This local contribution does not claim canonical DOM attachment or durable rehydration.

`END_TO_END_CONTRIBUTION`: productive DOM/PLAT evidence proves one immutable manifest for the canonical DOM tuple and durable reconstruction. The complete `AC-EXEC-020` obligation is integrated proof; retry semantics contribute locally to `AC-EXEC-018`.

#### Does Not Implement

DOM identity creation; PLAT storage/recovery; EXEC-002 sessions; replay orchestration; external effects; UI/OPS.

#### Repository Evidence

No productive manifest persistence/reconstruction; prototype is transient. This is `ADD_NEW_CAPABILITY` with typed DOM/PLAT seams.

#### Expected Repository Impact

Manifest identity/rehydration semantic boundary and direct reconstruction/retry tests; no physical mechanism is frozen. Expected Repository Impact is planning guidance, not normative design authority.

#### Implementation Constraints

DOM tuple is authoritative; `ManifestContentRevision=1` is distinct from physical revision; untrusted material cannot become valid state; no mutation on failure.

#### Internal Prerequisites

`EXEC-IMP-07`, `EXEC-IMP-08`.

#### Cross-Spec Prerequisites

DOM tuple and PLAT physical material are defined, unavailable productively, `REQUIRED_FOR_INTEGRATED_PROOF`. They are not required for the local tuple/retry validator contribution, but are required for the complete `AC-EXEC-020` witness at `CP-EXEC-03` and the later recovery evidence.

#### Producer / Consumer Contract Proof

`CAPABILITY_ID = EXEC-MANIFEST-RECONSTRUCTION`; authority owner EXEC/DOM boundary; producers DOM identity and PLAT material; produced contract validated immutable tuple/basis/digest; consumer EXEC-IMP-10; status defined; local testability yes; productive availability no; integrated-only blocking.

#### Capability Availability and Blocking Effect

Foreign productive identity/material availability does not block local semantic closure.

#### Temporal Authority Preconditions

`NOT_APPLICABLE` to identity/reconstruction; retry lineage is semantic identity, not external effect authorization.

#### Acceptance Criteria

1. **Local contribution to `AC-EXEC-020`:** the EXEC validator accepts a supplied tuple/material contract only when identity, digest and cardinality rules hold; detached or corrupt values fail without local mutation (`LOCAL_PROVABILITY = YES`).
2. **Local contribution to `AC-EXEC-018`:** retry lineage requires a new AttemptId/manifest and rejects same-manifest reuse or current-basis reinterpretation (`LOCAL_PROVABILITY = YES`).
3. **Plan-level `AC-EXEC-020`:** productive DOM/PLAT evidence proves canonical tuple attachment and durable reconstruction (`LOCAL_PROVABILITY = NO`; `FINAL_PROOF_OWNER = EXEC-IMP-10`; `INTEGRATION_PROOF_STAGE = CP-EXEC-03`).

#### ACCEPTANCE_WITNESS_MATRIX

| Normative behavior | Verb | Concrete operation | State affected | Direct positive | Direct negative/isolation | Expected evidence | Acceptance owner | Required capability | Authority | Contract | Local testability | Productive availability | Dependency class | Witness executable at local closure | Evidence type |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Tuple/material validation (local contribution to `AC-EXEC-020`) | validate/rehydrate | `C-EXEC-019` / `AC-EXEC-020` local contribution | EXEC manifest contract | supplied tuple/material passes identity, digest and cardinality checks | detached/corrupt/stale/duplicate value fails with no local mutation | local manifest-validator report | EXEC-IMP-10 | unit-owned manifest validator | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |
| Retry lineage (local contribution to `AC-EXEC-018`) | retry/recreate | `C-EXEC-017` / `AC-EXEC-018` local contribution | attempt/manifest contract | new AttemptId preserves supplied basis | same-manifest reuse/current reinterpretation rejected | local retry-lineage report | EXEC-IMP-10 | unit-owned retry contract | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |
| Canonical tuple attachment/reconstruction (plan-level `AC-EXEC-020`) | create/rehydrate | `C-EXEC-019` / `AC-EXEC-020` integrated proof | immutable manifest | one canonical DOM tuple creates/rehydrates exactly one manifest | attachment, digest, basis or durable-material mismatch fails | integrated manifest reconstruction evidence | EXEC-IMP-10 | DOM-EXEC-IDENTITY-SNAPSHOT + PLAT-EXEC-PERSISTED-MATERIAL | DEFINED | DEFINED | NO | NO | REQUIRED_FOR_INTEGRATED_PROOF | NO | INTEGRATION_TEST_EVIDENCE |

#### Local Closure

`LOCAL_CLOSURE = YES`; `LOCAL_CLOSURE_SCOPE = EXEC_TUPLE_VALIDATION_AND_RETRY_CONTRIBUTION_ONLY`. The complete plan-level `AC-EXEC-020` closes only at `CP-EXEC-03`; integrated evidence is not local Completion Evidence.

#### Work Can Start

`WORK_CAN_START = NO` until IMP-07 and IMP-08 complete.

#### Shared Closure Boundary

`SHARED_CLOSURE_BOUNDARY = YES` for identity, attachment, reconstruction and retry lineage; checkpoint/replay declaration is separate.

#### Required Tests

Local tuple/digest/cardinality validation, no-mutation-on-failure and new-AttemptId retry tests. At `CP-EXEC-03`, integrated canonical DOM attachment and durable reconstruction tests are required; those tests are not local closure evidence.

#### Legacy / Cutover Impact

`HISTORICAL_REPLAY` and `CUTOVER`; retry/new basis is new identity and original manifest remains immutable.

#### Completion Evidence

Local: tuple-validator, no-mutation and retry-lineage reports. Integrated: `CP-EXEC-03` canonical attachment and durable reconstruction evidence for plan-level `AC-EXEC-020`.

#### Risks

Manifest identity invention, detached material acceptance and current-registry reinterpretation.

#### Issue Decomposition Readiness

`ISSUE_READY`; `VALIDATED_GAP_BACKING = YES`; `INDEPENDENT_CLOSURE = YES` for the local contribution; the plan-level integrated witness remains an explicit checkpoint handoff.

#### Initial DAG State

`BLOCKED`; `BLOCKED_BY = EXEC-IMP-07, EXEC-IMP-08`.

---

### EXEC-IMP-11 — Safe checkpoint and original-basis historical replay

`UNIT_FORMATION_REASON = SHARED_AUTHORITY + SHARED_PERSISTENCE_BOUNDARY + SHARED_CUTOVER + SHARED_CONFORMANCE`

#### Goal

Declare safe checkpoint/resume basis and preserve original manifest/catalog interpretation during historical replay, without owning session application or physical replay.

#### Authority and Ownership

- Requirements: `EXEC-MANIFEST-002`, `EXEC-HISTORY-001`; obligation `O-021`; `CANONICAL_OWNER`.
- Local ownership: checkpoint declaration, resume-basis contract and original-basis replay guard.
- Foreign ownership: EXEC-002 context application and PLAT physical replay.
- Authority proofs: target SPEC §§12.2–§12.4 and current upstream capability records.

#### Gap Matrix Coverage

`GAP-010`, `GAP-013`; acceptance `AC-EXEC-014`, `AC-EXEC-016` and contribution to `AC-EXEC-018`.

#### Portfolio Obligation Coverage

`O-021`; `CANONICAL_OWNER`.

#### Validated Delta

```text
OBSERVED: no productive checkpoint declaration, resume-basis surface or original-basis replay path exists.
REQUIRED: absent declaration cannot authorize resume; historical replay uses its original frozen basis even when the current registry differs.
DELTA: add local declaration and replay-protection semantics while preserving EXEC-002/PLAT ownership.
```

#### Required Behavior

`LOCAL_BEHAVIOR`: validate the EXEC-owned checkpoint declaration and original-basis guard against supplied contract material; reject absent basis and current-registry reinterpretation without local mutation. This local contribution does not claim EXEC-002 context application or durable replay.

`END_TO_END_CONTRIBUTION`: productive EXEC-002/PLAT evidence proves safe resume and durable historical replay from the original basis. The complete `AC-EXEC-014` and `AC-EXEC-016` obligations are integrated proof, and this unit is their final proof contributor.

#### Does Not Implement

Session/assignment/scheduler; physical persistence/recovery; retry scheduler; DOM lifecycle; external effect; UI/OPS.

#### Repository Evidence

Only prototype checkpoint/history-shaped values exist. Use new semantic declaration/replay guard with PLAT/EXEC-002 integration seams.

#### Expected Repository Impact

Manifest checkpoint/replay contract and direct divergence tests; no session or physical storage mechanism is frozen. Expected Repository Impact is planning guidance, not normative design authority.

#### Implementation Constraints

No resume without declared basis; transient text/session memory is not authority; current registry cannot reinterpret history; no historical mutation.

#### Internal Prerequisites

`EXEC-IMP-07`, `EXEC-IMP-10`.

#### Cross-Spec Prerequisites

| Owner | Required capability | Implementation state | Blocking? |
|---|---|---|---|
| SPEC-EXEC-002 | apply declared resume context | defined; productive availability `NO` | No for local contribution; integrated proof only |
| SPEC-PLAT-001 | durable replay/recovery material | defined; productive availability `NO` | No for local contribution; integrated proof only |

#### Producer / Consumer Contract Proof

`CAPABILITY_ID = EXEC-RESUME-HISTORICAL-BASIS`; authority owner EXEC; producer manifest/basis semantics; produced contract safe checkpoint and original-basis replay guard; consumers EXEC-002/PLAT; semantic status defined; local testability yes; productive availability no for foreign producers; dependency class integrated-proof-only; blocking effect integrated-only.

#### Capability Availability and Blocking Effect

The local declaration/original-basis guard is executable against supplied contract values. EXEC-002 context application and PLAT durable replay remain `REQUIRED_FOR_INTEGRATED_PROOF`; they do not block the local contribution, but they are required before the plan-level `AC-EXEC-014`/`AC-EXEC-016` proof can close.

#### Temporal Authority Preconditions

`NOT_APPLICABLE` to historical interpretation; no observe-then-commit effect is owned here.

#### Acceptance Criteria

1. **Local contribution to `AC-EXEC-014`:** the checkpoint contract requires an explicit exact resume basis and rejects an absent declaration without local authorization (`LOCAL_PROVABILITY = YES`).
2. **Local contribution to `AC-EXEC-016`:** the replay guard preserves the supplied original basis and rejects current-registry reinterpretation without local mutation (`LOCAL_PROVABILITY = YES`).
3. **Plan-level `AC-EXEC-014`/`AC-EXEC-016`:** productive EXEC-002/PLAT evidence proves safe resume and durable original-basis historical replay (`LOCAL_PROVABILITY = NO`; `FINAL_PROOF_OWNER = EXEC-IMP-11`; `INTEGRATION_PROOF_STAGE = CP-EXEC-04`).

#### ACCEPTANCE_WITNESS_MATRIX

| Normative behavior | Verb | Concrete operation | State affected | Direct positive | Direct negative/isolation | Expected evidence | Acceptance owner | Required capability | Authority | Contract | Local testability | Productive availability | Dependency class | Witness executable at local closure | Evidence type |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Checkpoint declaration guard (local contribution to `AC-EXEC-014`) | declare/reject | `C-EXEC-017` / `AC-EXEC-014` local contribution | EXEC checkpoint contract | exact supplied basis declaration accepted | absent basis cannot authorize local resume | local checkpoint-guard report | EXEC-IMP-11 | unit-owned checkpoint contract | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |
| Original-basis replay guard (local contribution to `AC-EXEC-016`) | replay/reject | `C-EXEC-016` / `AC-EXEC-016` local contribution | EXEC replay contract | supplied original basis is preserved | current registry divergence cannot reinterpret it | local replay-guard report | EXEC-IMP-11 | unit-owned replay contract | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |
| Safe resume (plan-level `AC-EXEC-014`) | declare/apply | `C-EXEC-017` / `AC-EXEC-014` integrated proof | durable manifest basis | EXEC-002 applies a declared exact basis | absent or mismatched durable basis cannot resume | integrated resume evidence | EXEC-IMP-11 | EXEC2-EXEC-RESUME-CONTEXT + PLAT-EXEC-PERSISTED-MATERIAL | DEFINED | DEFINED | NO | NO | REQUIRED_FOR_INTEGRATED_PROOF | NO | INTEGRATION_TEST_EVIDENCE |
| Historical replay (plan-level `AC-EXEC-016`) | replay/resolve | `C-EXEC-016` / `AC-EXEC-016` integrated proof | durable historical manifest/catalog | PLAT replays the original basis | current registry cannot reinterpret or convert history | integrated historical replay evidence | EXEC-IMP-11 | PLAT-EXEC-PERSISTED-MATERIAL | DEFINED | DEFINED | NO | NO | REQUIRED_FOR_INTEGRATED_PROOF | NO | INTEGRATION_TEST_EVIDENCE |

#### Local Closure

`LOCAL_CLOSURE = YES`; `LOCAL_CLOSURE_SCOPE = EXEC_CHECKPOINT_AND_REPLAY_GUARD_CONTRIBUTION_ONLY`. The complete plan-level `AC-EXEC-014` and `AC-EXEC-016` obligations close only at `CP-EXEC-04`; integrated evidence is not local Completion Evidence.

#### Work Can Start

`WORK_CAN_START = NO` until IMP-07 and IMP-10 complete.

#### Shared Closure Boundary

`SHARED_CLOSURE_BOUNDARY = YES`: both gaps operate on the same immutable manifest basis, use the same local fixture-level readiness (`AUTHORITY_STATUS=DEFINED`, `CONTRACT_STATUS=DEFINED`, `LOCAL_TESTABILITY=YES`, `PRODUCTIVE_AVAILABILITY=NO`), have compatible `REQUIRED_FOR_INTEGRATED_PROOF` foreign handoffs, and close with the same local declaration/basis evidence. Physical recovery and session application remain foreign.

#### Required Tests

Local absent-basis, transient-text and current-registry-divergence guard tests. At `CP-EXEC-04`, integrated EXEC-002 context application, durable checkpoint and historical replay tests are required; those tests are not local closure evidence.

#### Legacy / Cutover Impact

`HISTORICAL_REPLAY`; original manifest/catalog basis is retained; changed basis is a new attempt.

#### Completion Evidence

Local: checkpoint-declaration and original-basis guard reports. Integrated: `CP-EXEC-04` safe-resume and durable historical-replay evidence for plan-level `AC-EXEC-014`/`AC-EXEC-016`; `CP-EXEC-05` consumes this evidence for `AC-EXEC-018` final proof.

#### Risks

Transient memory as authority, current-registry reinterpretation and PLAT recovery meaning leakage.

#### Issue Decomposition Readiness

`ISSUE_READY`; `VALIDATED_GAP_BACKING = YES`; `INDEPENDENT_CLOSURE = YES` for the local contribution; the plan-level integrated witnesses remain explicit checkpoint handoffs.

#### Initial DAG State

`BLOCKED`; `BLOCKED_BY = EXEC-IMP-07, EXEC-IMP-10`.

## 10. Gap → Plan Traceability

| Gap ID | Requirement(s) | Portfolio obligation | Classification | Severity | Planning type | Implementation unit(s) | Status |
|---|---|---|---|---:|---|---|---|
| GAP-001 | EXEC-CONTRACT-002 | O-019 | BEHAVIOR_CONTRADICTORY | MAJOR | LOCAL_IMPLEMENTATION_WORK | EXEC-IMP-02 | COVERED |
| GAP-002 | EXEC-VERSION-002, EXEC-REGISTRY-001, EXEC-REGISTRY-004, EXEC-CAPABILITY-001 | O-017/O-020 | BEHAVIOR_CONTRADICTORY | MAJOR | LOCAL_IMPLEMENTATION_WORK | EXEC-IMP-03 | COVERED |
| GAP-003 | EXEC-SNAPSHOT-001 | O-018 | BEHAVIOR_CONTRADICTORY | MAJOR | INTEGRATION_OR_CONVERGENCE_WORK | EXEC-IMP-06 | COVERED |
| GAP-004 | EXEC-REGISTRY-001 | O-020 | BEHAVIOR_PARTIAL | MAJOR | LOCAL_IMPLEMENTATION_WORK | EXEC-IMP-03, EXEC-IMP-09 | COVERED |
| GAP-005 | EXEC-REGISTRY-004 | O-020 | BEHAVIOR_PARTIAL | MAJOR | LOCAL_IMPLEMENTATION_WORK | EXEC-IMP-08 | COVERED |
| GAP-006 | EXEC-REGISTRY-002 | O-020 | DEPENDENCY_INTEGRATION_GAP | MAJOR | CROSS_SPEC_DEPENDENCY | EXEC-IMP-04 | COVERED |
| GAP-007 | EXEC-CAPABILITY-001 | O-020 | BEHAVIOR_PARTIAL | MAJOR | LOCAL_IMPLEMENTATION_WORK | EXEC-IMP-04 | COVERED |
| GAP-008 | EXEC-CAPABILITY-002 | O-020 | BEHAVIOR_PARTIAL | MAJOR | INTEGRATION_OR_CONVERGENCE_WORK | EXEC-IMP-05 | COVERED |
| GAP-009 | EXEC-MANIFEST-001 | O-021 | BEHAVIOR_MISSING | MAJOR | LOCAL_IMPLEMENTATION_WORK | EXEC-IMP-07 | COVERED |
| GAP-010 | EXEC-MANIFEST-002 | O-021 | BEHAVIOR_MISSING | MAJOR | LOCAL_IMPLEMENTATION_WORK | EXEC-IMP-11 | COVERED |
| GAP-011 | EXEC-MANIFEST-003 | O-018/O-021 | BEHAVIOR_MISSING | MAJOR | LOCAL_IMPLEMENTATION_WORK | EXEC-IMP-07 | COVERED |
| GAP-012 | EXEC-MANIFEST-004 | O-018/O-021 | BEHAVIOR_MISSING | MAJOR | LOCAL_IMPLEMENTATION_WORK | EXEC-IMP-10 | COVERED |
| GAP-013 | EXEC-HISTORY-001 | O-021 | BEHAVIOR_MISSING | MAJOR | LOCAL_IMPLEMENTATION_WORK | EXEC-IMP-11 | COVERED |
| GAP-014 | EXEC-FAILURE-001 | O-019 | BEHAVIOR_PARTIAL | MAJOR | LOCAL_IMPLEMENTATION_WORK | EXEC-IMP-02 | COVERED |
| GAP-015 | EXEC-REGISTRY-001/004 | O-020 | BEHAVIOR_MISSING | MAJOR | LOCAL_IMPLEMENTATION_WORK | EXEC-IMP-09 | COVERED |
| GAP-016 | EXEC-REGISTRY-001/002/004, EXEC-CAPABILITY-001 | O-020 | DEPENDENCY_INTEGRATION_GAP | MAJOR | CROSS_SPEC_DEPENDENCY | EXEC-IMP-04, EXEC-IMP-08 | COVERED |
| GAP-017 | EXEC-REGISTRY-001/004, EXEC-CAPABILITY-002 | O-020 | BEHAVIOR_CONTRADICTORY | MAJOR | INTEGRATION_OR_CONVERGENCE_WORK | EXEC-IMP-05 | COVERED |
| GAP-018 | EXEC-ENVELOPE-001 | O-016 | BEHAVIOR_PARTIAL | MAJOR | LOCAL_IMPLEMENTATION_WORK | EXEC-IMP-01 | COVERED |

```text
UNCOVERED_LOCAL_GAPS = 0
GAPS_WITH_PLAN_COVERAGE = 18
GAPS_WITHOUT_PLAN_COVERAGE = 0
```

## 11. Acceptance → Plan Traceability

| Acceptance ID | Requirement(s) | Contributing units | Final Proof Owner | Local evidence | Final evidence |
|---|---|---|---|---|---|
| AC-EXEC-001 | EXEC-ENVELOPE-001 | IMP-01 | IMP-01 | capability-specific schema witness | schema conformance report |
| AC-EXEC-002 | EXEC-ENVELOPE-002 | IMP-01 | IMP-01 | structured minimum rejection | envelope conformance report |
| AC-EXEC-003 | EXEC-VERSION-001 | IMP-03 | IMP-03 | SemVer witness | version report |
| AC-EXEC-004 | EXEC-VERSION-002 | IMP-03 | IMP-03 | disjointness/unsupported witness | registry conformance report |
| AC-EXEC-005 | EXEC-SNAPSHOT-001 | IMP-03, IMP-04, IMP-06 | IMP-06 | caller-authority guard contribution (local) | integrated DOM exact-basis evidence at CP-EXEC-03 |
| AC-EXEC-006 | EXEC-CONTRACT-001 | IMP-01, IMP-02 | IMP-02 | invalid-contract regression/direct witness | failure conformance report |
| AC-EXEC-007 | EXEC-CONTRACT-002 | IMP-01, IMP-02 | IMP-02 | verdict registry/rejection witness | failure conformance report |
| AC-EXEC-008 | EXEC-REGISTRY-001 | IMP-03, IMP-04, IMP-05, IMP-09 | IMP-09 | deterministic resolution and mutation witnesses | registry publication report |
| AC-EXEC-009 | EXEC-REGISTRY-002 | IMP-04 | IMP-04 | NORMAL/BOOTSTRAP isolation | source integration evidence |
| AC-EXEC-010 | EXEC-REGISTRY-003 | IMP-03, IMP-04 | IMP-04 | bootstrap allowlist witness | catalog conformance report |
| AC-EXEC-011 | EXEC-CAPABILITY-001 | IMP-03, IMP-04, IMP-08 | IMP-08 | known/unknown/incompatible and source-bound witnesses | capability conformance report |
| AC-EXEC-012 | EXEC-CAPABILITY-002 | IMP-03, IMP-05 | IMP-05 | common-path synthetic capability | registry extensibility report |
| AC-EXEC-013 | EXEC-MANIFEST-001 | IMP-07 | IMP-07 | manifest-field validation contribution (local) | integrated DOM-bound manifest evidence at CP-EXEC-03 |
| AC-EXEC-014 | EXEC-MANIFEST-002 | IMP-07, IMP-11 | IMP-11 | checkpoint-declaration guard contribution (local) | integrated resume evidence at CP-EXEC-04 |
| AC-EXEC-015 | EXEC-MANIFEST-003 | IMP-06, IMP-07 | IMP-07 | freeze-rule contribution (local) | integrated durable freeze/history evidence at CP-EXEC-03 |
| AC-EXEC-016 | EXEC-HISTORY-001 | IMP-10, IMP-11 | IMP-11 | original-basis replay-guard contribution (local) | integrated historical replay evidence at CP-EXEC-04 |
| AC-EXEC-017 | EXEC-FAILURE-001 | IMP-02 | IMP-02 | structured failure witness | failure conformance report |
| AC-EXEC-018 | EXEC-FAILURE-001 / EXEC-MANIFEST-002 | IMP-02, IMP-10, IMP-11 | IMP-11 | failure/retry and new-AttemptId contributions (local) | integrated retry/recovery evidence at CP-EXEC-05 |
| AC-EXEC-019 | EXEC-REGISTRY-004 | IMP-03, IMP-04, IMP-08 | IMP-08 | scope/identity/continuity witness | registry reconstruction evidence |
| AC-EXEC-020 | EXEC-MANIFEST-004 | IMP-07, IMP-10 | IMP-10 | tuple/material validation contribution (local) | integrated canonical attachment/reconstruction evidence at CP-EXEC-03 |
| AC-EXEC-021 | EXEC-REGISTRY-004 | IMP-04, IMP-08 | IMP-08 | source-backed progression witness | progression conformance evidence |
| AC-EXEC-022 | EXEC-REGISTRY-001 / EXEC-REGISTRY-004 | IMP-05, IMP-08, IMP-09 | IMP-09 | expected revision/key/retry witness | mutation concurrency evidence |

```text
ACCEPTANCE_OBLIGATIONS = 22
ACCEPTANCE_WITH_FINAL_PROOF_OWNER = 22
UNRESOLVED_FINAL_PROOF_OWNERS = 0
LOCAL_AC_REQUIRING_DOWNSTREAM = 0
LOCAL_AC_CONTRADICTING_DOES_NOT_IMPLEMENT = 0
LOCAL_AC_REQUIRING_UNAVAILABLE_FOREIGN_CAPABILITY = 0
```

The complete cross-SPEC obligations remain integrated checkpoint evidence; no local AC claims foreign productive availability.

## 12. Cross-Spec Dependencies

The approved normative edge is exactly `SPEC-EXEC-001 → SPEC-DOM-001`. The following capability handoffs are explicit implementation/integration boundaries and do not add normative edges.

| Capability ID | Portfolio owner / source | Producer | Consumer units | Required contract | Authority | Contract | Semantic | Local testability | Productive availability | Dependency class | Availability evidence | Blocking? |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| DOM-EXEC-IDENTITY-SNAPSHOT | SPEC-DOM-001 | DOM canonical resolver | IMP-04, IMP-06, IMP-08, IMP-10 | `DOM-ID-001`, `DOM-SNAPSHOT-001`, `DOM-LIFE-001` | DEFINED | DEFINED | DEFINED | NO | NO | REQUIRED_FOR_INTEGRATED_PROOF | conformant DOM rev4/audit; no productive runtime | No; integrated proof only |
| DOM-EXEC-ADVANCEMENT-VERDICT | SPEC-DOM-001 | DOM command/verdict contract | IMP-02, integrated consumers | `DOM-CMD-001`, `DOM-ADV-001`, `DOM-AUDIT-002` | DEFINED | DEFINED | DEFINED | NO | NO | REQUIRED_FOR_INTEGRATED_PROOF | conformant DOM audit; no productive runtime | No; integrated proof only |
| EXEC-NORMAL-CATALOG-SOURCE-PROGRESSION | EXEC-001/REPO boundary | enabled NORMAL source | IMP-04, IMP-08, IMP-09 | scoped source-backed basis/progression | DEFINED | DEFINED | DEFINED | YES (fixture) | NO | REQUIRED_FOR_INTEGRATED_PROOF | fixture/source contract; no productive source | No; integrated proof only |
| EXEC-BOOTSTRAP-CATALOG-SOURCE-PROGRESSION | EXEC-001/system boundary | independent BOOTSTRAP source | IMP-04, IMP-08 | system-scoped basis/progression | DEFINED | DEFINED | DEFINED | YES (fixture) | NO | REQUIRED_FOR_INTEGRATED_PROOF | fixture/source contract; no productive source | No; integrated proof only |
| PLAT-EXEC-PERSISTED-MATERIAL | SPEC-PLAT-001 | journal/checkpoint/material reader | IMP-08, IMP-10, IMP-11 | physical material/integrity/order/replay | DEFINED | DEFINED | DEFINED | NO | NO | REQUIRED_FOR_INTEGRATED_PROOF | approved PLAT boundary; no productive producer | No; integrated proof only |
| EXEC2-EXEC-RESUME-CONTEXT | SPEC-EXEC-002 | context applicator | IMP-11 | safe checkpoint basis application | DEFINED | DEFINED | DEFINED | NO | NO | REQUIRED_FOR_INTEGRATED_PROOF | approved EXEC-002 boundary; no productive producer | No; integrated proof only |
| BACKEND-EXEC-FAILURE-MAPPING | SPEC-BACKEND-001 | mapping boundary | IMP-02 | canonical failure code/family/basis/state | DEFINED | DEFINED | DEFINED | NO | NO | REQUIRED_FOR_INTEGRATED_PROOF | approved mapping boundary; no productive consumer | No; integrated proof only |
| OPS-EXEC-FAILURE-PROJECTION | SPEC-OPS-001 | projection boundary | IMP-02 | preserve operational failure meaning | DEFINED | DEFINED | DEFINED | NO | NO | REQUIRED_FOR_INTEGRATED_PROOF | approved projection boundary; no productive consumer | No; integrated proof only |
| UI-EXEC-FAILURE-PROJECTION | SPEC-UI-001 | projection boundary | IMP-02 | preserve success/failure meaning | DEFINED | DEFINED | DEFINED | NO | NO | REQUIRED_FOR_INTEGRATED_PROOF | approved projection boundary; no productive consumer | No; integrated proof only |

### Producer / Consumer Contract Proof Summary

Every record above carries the complete dimensions required by the shared authority contract. No `AUTHORITY_STATUS` or `CONTRACT_STATUS` is undefined. No capability classified `REQUIRED_FOR_LOCAL_EXECUTION` or `REQUIRED_FOR_LOCAL_CLOSURE` is unavailable. No productive-availability promotion is claimed; no `NO_DOWNSTREAM_CAPABILITY_PROMOTION_WITHOUT_NEW_EVIDENCE` exception is used.

## 13. Dependency DAG

Internal implementation edges:

```text
IMP-01 → IMP-02, IMP-03, IMP-07
IMP-03 → IMP-04, IMP-05, IMP-06, IMP-08, IMP-09
IMP-04 → IMP-05, IMP-06, IMP-08, IMP-09
IMP-05 → IMP-09
IMP-06 → IMP-07
IMP-07 → IMP-10, IMP-11
IMP-08 → IMP-09, IMP-10
IMP-10 → IMP-11
```

```text
DAG_CYCLE_DETECTED = NO
DAG_LOCAL_CLOSURE_INVARIANT = PASS
```

Every edge is producer-before-consumer. No unit's local closure requires a downstream unit.

## 14. Parallelization Waves

| Wave | Units | Prerequisites | Shared repository collision risk | Execution mode |
|---:|---|---|---|---|
| 1 | IMP-01 | none | low; schema boundary | SAFE |
| 2 | IMP-02, IMP-03 | IMP-01 | medium; shared schema/registry failures | SAFE_WITH_COORDINATION |
| 3 | IMP-04 | IMP-03 | medium; registry/source seam | SAFE_WITH_COORDINATION |
| 4 | IMP-06 | IMP-03/04 | high; snapshot seam and DOM-boundary coordination | SERIAL_REQUIRED |
| 5 | IMP-05, IMP-07, IMP-08 | IMP-03/04; IMP-06 for IMP-07 | high for registry/source, manifest and reconstruction seams; coordinate ownership | SERIAL_REQUIRED |
| 6 | IMP-09, IMP-10 | IMP-05/08; IMP-07/08 | medium; mutation and manifest reconstruction | SAFE_WITH_COORDINATION |
| 7 | IMP-11 | IMP-07/10 | low/medium; checkpoint and replay boundary | SAFE_WITH_COORDINATION |

`IMP-06` must complete its exact-basis contribution before `IMP-07` can contribute to `AC-EXEC-015`; `IMP-05`, `IMP-07` and `IMP-08` remain coordinated/serial in Wave 5. Repository ownership coordination is required.

## 15. Integration Checkpoints

| Checkpoint | Required units | Integrated behavior | Required evidence | Unlocked units |
|---|---|---|---|---|
| CP-EXEC-01 | IMP-01, IMP-02, IMP-03 | identifiable schemas, canonical failures and unique non-overlapping resolution | schema, verdict, failure, SemVer and overlap reports | IMP-04, IMP-05, IMP-06, IMP-07 |
| CP-EXEC-02 | IMP-03, IMP-04, IMP-05, IMP-08, IMP-09 | owner-issued scoped catalog basis, source progression and one-successor mutation | source receipt, scope, progression, issuer, stale/idempotency and no-mutation evidence | integrated DOM/REPO/PLAT catalog proof |
| CP-EXEC-03 | IMP-06, IMP-07, IMP-10 | exact DOM-bound manifest identity and immutable started basis | caller-bypass, manifest-field, attachment, digest and freeze reports; full proof runs after IMP-06 → IMP-07 and required IMP-10 evidence | IMP-11 |
| CP-EXEC-04 | IMP-07, IMP-10, IMP-11 | safe checkpoint and original-basis replay with retry-distinct identity | checkpoint declaration, current-registry divergence, durable replay and new-attempt evidence | CP-EXEC-05 |
| CP-EXEC-05 | IMP-02, IMP-06, IMP-10, IMP-11 | failure/retry meaning remains separate from DOM lifecycle and external effect confirmation | canonical failure mapping, no-success/no-effect, retry and CP-EXEC-04 recovery evidence; `IMP-11` is Final Proof Owner for AC-EXEC-018 | downstream final conformance |

Checkpoint evidence is integrated proof and is not copied into earlier local ACs.

## 16. Legacy / Authority Transition

| Current path | Target authority | Read behavior | Write behavior | Migration/mapping | Owning unit |
|---|---|---|---|---|---|
| Generic capability payload `data` | identifiable capability-specific schema | consume only selected schema | reject generic-but-invalid payload | no silent conversion | IMP-01 |
| Unknown non-empty `functionalVerdict` | EXEC verdict registry | return `VERDICT_UNKNOWN` | never approve/finalize/resume | preserve canonical failure | IMP-02 |
| Ordered overlap resolution | disjoint supported-set registry | invalid overlap is not selectable | reject before basis mutation | no precedence/alias | IMP-03 |
| Caller-supplied snapshot `versions` | EXEC exact basis plus DOM snapshot | caller fields are assertions | reject caller-established basis | converge at EXEC/DOM seam | IMP-06 |
| Fixture catalog/source receipt | owner-issued NORMAL/BOOTSTRAP source | fixtures remain contract evidence only | no fixture publication | productive source integration remains foreign | IMP-04/05 |
| Plain `REGISTERED` result | issuer-bound publication result | consume only verified predecessor/successor | reject detached authority | source/PLAT publication remains foreign | IMP-05 |
| Started manifest/schema/version basis | immutable original basis | preserve historical record | changed basis uses new AttemptId/manifest | explicit cutover | IMP-07/10 |
| Current registry during historical replay | original frozen manifest/catalog basis | replay original basis | never rewrite history | PLAT supplies material | IMP-11 |
| Transient checkpoint/session text | declared persisted checkpoint basis | no resume from text alone | no transient authority write | EXEC-002/PLAT own application/replay | IMP-11 |

Failure ownership remains EXEC-001 for `UNKNOWN_CAPABILITY`, `INCOMPATIBLE_CAPABILITY`, `CONTRACT_INVALID` and `VERDICT_UNKNOWN`. DOM owns identity/lifecycle; PLAT owns physical recovery/effects; REPO owns legacy configuration; BACKEND/OPS/UI only map/project.

## 17. Test Strategy

| Evidence class | Retained/modified/new evidence | Owner |
|---|---|---|
| Existing tests retained | Current root/DOM tests and existing EXEC contract/registry tests remain regression evidence. Prototype tests remain non-authoritative. | existing owners |
| Tests modified | Snapshot consumer tests change only to reject caller authority at the approved EXEC/DOM seam. | IMP-06 with DOM boundary owner |
| New unit/domain tests | capability schema, verdict/failure, SemVer/overlap/resolution, source scope, registration provenance, reconstruction, mutation, manifest, checkpoint and replay. | IMP-01 through IMP-11 |
| Integration tests | DOM exact basis, NORMAL/BOOTSTRAP productive sources, PLAT material/recovery, EXEC-002 resume and downstream mappings. | CP-EXEC-02 through CP-EXEC-05 |
| Cross-SPEC tests | RepositoryId isolation, tuple attachment, source progression, issuer proof, current-registry divergence, retry/new AttemptId and failure mappings. | checkpoints/final proof owners |
| Concurrency/idempotency tests | overlap no mutation, duplicate entry/tuple, stale expected revision, same-key replay and conflicting-key rejection; physical CAS remains PLAT evidence. | IMP-03/08/09 and CP-EXEC-02 |
| Recovery tests | semantic reconstruction, checkpoint declaration, retry lineage and original-basis replay locally; durable restart/recovery by PLAT. | IMP-08/10/11 and CP-EXEC-04 |
| Compatibility/migration tests | NORMAL/BOOTSTRAP isolation, legacy REPO mapping, caller-basis cutover, no history rewrite. | IMP-04/06/07/11 |
| Conformance tests | all `C-EXEC-001` through `C-EXEC-023` applicable scenarios with direct positive and negative/isolation witnesses. | final owners in §11 |

Correctness-sensitive behavior receives automated direct witnesses. Listing is not progress proof; sequential duplicates are not concurrency proof; fixtures do not prove productive durability, restart, physical CAS or external effects.

## 18. Risk Register

| Risk | Cause | Affected units | Mitigation / gate |
|---|---|---|---|
| Duplicate authority | caller, fixture, structural registration result or projection becomes canonical | IMP-01/04/05/06 | authority-boundary tests; no promotion without evidence |
| Version approximation | alias, major-only acceptance or silent conversion | IMP-03/06/11 | explicit support-set/frozen-basis witnesses |
| Identity mismatch | RepositoryId, DOM tuple or manifest alias replaces canonical identity | IMP-04/08/10 | identity/reconstruction and cross-scope tests |
| Partial mutation | invalid overlap/material/mutation changes state before rejection | IMP-03/08/09/10 | no-mutation-on-failure witnesses |
| Hidden lifecycle duplication | EXEC advances DOM or applies session lifecycle | IMP-06/11 | Does Not Implement and cross-SPEC audit |
| Historical reinterpretation | current registry resolves old activity | IMP-10/11 | original-basis replay divergence witness |
| Caller authority bypass | snapshot copies arbitrary versions | IMP-06 | direct contradiction/convergence witness |
| Durable recovery mismatch | fixture treated as physical persistence | IMP-08/10/11 | integrated-only dependency class and PLAT checkpoint |
| Failure semantic loss | consumer mapping renames/softens canonical result | IMP-02 | mapping contract and CP-EXEC-05 |
| Downstream-dependent local acceptance | local AC requires unavailable producer | all mixed units | local fixture witnesses; integrated-only classes |
| Parallel change collision | shared schema/registry/manifest seam edited concurrently | IMP-01–05, IMP-07–10 | waves and coordination/serial mode |
| Ambiguous final proof | contributor claims complete cross-SPEC conformance | all | §11 Final Proof Owners and checkpoints |

## 19. Implementation Unit Closure Matrix

| Unit | Independently implementable | Local closure | Issue decomposition readiness | Initial DAG state | Blocked by |
|---|---|---|---|---|---|
| IMP-01 | YES | YES | ISSUE_READY | READY | none |
| IMP-02 | YES after prerequisite | YES | ISSUE_READY | BLOCKED | IMP-01 |
| IMP-03 | YES after prerequisite | YES | ISSUE_READY | BLOCKED | IMP-01 |
| IMP-04 | YES after prerequisite | YES | ISSUE_READY | BLOCKED | IMP-03 |
| IMP-05 | YES after prerequisites | YES | ISSUE_READY | BLOCKED | IMP-03, IMP-04 |
| IMP-06 | YES after prerequisites | YES | ISSUE_READY | BLOCKED | IMP-03, IMP-04 |
| IMP-07 | YES after prerequisites | YES | ISSUE_READY | BLOCKED | IMP-01, IMP-03, IMP-06 |
| IMP-08 | YES after prerequisites | YES | ISSUE_READY | BLOCKED | IMP-03, IMP-04 |
| IMP-09 | YES after prerequisites | YES | ISSUE_READY | BLOCKED | IMP-03, IMP-04, IMP-05, IMP-08 |
| IMP-10 | YES after prerequisites | YES | ISSUE_READY | BLOCKED | IMP-07, IMP-08 |
| IMP-11 | YES after prerequisites | YES | ISSUE_READY | BLOCKED | IMP-07, IMP-10 |

All `ISSUE_READY` units have local acceptance and completion evidence executable at closure. For IMP-06, IMP-07, IMP-10 and IMP-11, this means the explicitly bounded EXEC-owned local contribution; their complete plan-level integrated acceptance remains at the named checkpoint and is not claimed as local closure. `ISSUE_READY` is decomposition readiness, not ticket lifecycle or immediate execution state.

## 20. Plan Metrics

```text
VALIDATED_GAPS = 18
AUDITED_GAPS = 18
FULLY_COVERED_GAPS = 18
PARTIALLY_COVERED_GAPS = 0
UNCOVERED_GAPS = 0
LOCAL_IMPLEMENTATION_GAPS = 13
CROSS_SPEC_DEPENDENCIES = 2 primary Gap records
INTEGRATION_OR_CONVERGENCE_GAPS = 3
EXPLICIT_CAPABILITY_HANDOFFS = 9
PORTFOLIO_OBLIGATIONS_PLANNED = 6
PREEXISTING_FOREIGN_CAPABILITIES = 0
NO_LOCAL_WORK_GAPS = 0

IMPLEMENTATION_UNITS = 11
JUSTIFIED_UNITS = 11
SPECULATIVE_UNITS = 0
LOCALLY_CLOSABLE_UNITS = 11
NON_LOCALLY_CLOSABLE_UNITS = 0
ISSUE_DECOMPOSITION_READY_UNITS = 11
INTERNAL_ONLY_UNITS = 0
PLAN_BLOCKED_UNITS = 0
INTEGRATED_ONLY_ACCEPTANCE_OBLIGATIONS = 6
NON_LOCAL_COMPLETION_EVIDENCE = 4
ISSUE_READY_OVERRATED = 0
LOCAL_PROVABILITY_FAILURES = 0
INITIAL_READY_UNITS = 1
INITIAL_BLOCKED_UNITS = 10

GAPS_WITH_PLAN_COVERAGE = 18
GAPS_WITHOUT_PLAN_COVERAGE = 0
UNITS_WITHOUT_GAP_OR_SUPPORTING_AUTHORITY = 0
FALSE_UNIT_SPLITS = 0
FALSE_UNIT_MERGES = 0
SPECULATIVE_UNITS = 0

ACCEPTANCE_OBLIGATIONS = 22
ACCEPTANCE_WITH_FINAL_PROOF_OWNER = 22
UNRESOLVED_FINAL_PROOF_OWNERS = 0
LOCAL_AC_REQUIRING_DOWNSTREAM = 0
LOCAL_AC_CONTRADICTING_DOES_NOT_IMPLEMENT = 0
LOCAL_AC_REQUIRING_UNAVAILABLE_FOREIGN_CAPABILITY = 0
LOCAL_CLOSURE_WITH_UNAVAILABLE_REQUIRED_CAPABILITY = 0
WITNESSES_NOT_EXECUTABLE_AT_LOCAL_CLOSURE = 0

UNAPPROVED_NORMATIVE_DEPENDENCIES = 0
SPECIFICATION_GAPS = 0
ARCHITECTURE_GAPS = 0
PORTFOLIO_GAPS = 0
UPSTREAM_CONTRACT_GAPS = 0

DAG_CYCLE_DETECTED = NO
FINAL_PROOF_PREMATURE = 0
INVALID_FINAL_PROOF_OWNERS = 0
UNSAFE_PARALLEL_RELATIONSHIPS = 0
HIDDEN_BLOCKERS = 0
IMPLEMENTATION_UNIT_AUTHORITY_CHECK = PASS
UNITS_INVENTING_IDENTITY = 0
UNITS_INVENTING_LIFECYCLE = 0
UNITS_INVENTING_PROVENANCE = 0
UNITS_INVENTING_OWNERSHIP = 0
UNITS_INVENTING_RECOVERY = 0
UNITS_INVENTING_PERSISTENCE_SEMANTICS = 0

AUTHORITY_CONSUMPTION_GAPS = 0 local/blocking; 9 inherited integrated-only availability records
OWNERSHIP_ERRORS = 0
AGGREGATE_IDENTITY_PROOF = COMPLETE
AGGREGATE_RECONSTRUCTION_PROOF = COMPLETE
REHYDRATION_AUTHORITY_GAPS = 0
BLOCKED_BY_UPSTREAM_CONTRACT = 0 at declared local closure points
CAPABILITY_AVAILABILITY_CLASSIFICATION_ERRORS = 0
TEMPORAL_AUTHORITY_GAPS = 0
AUTHORITY_COMPLETENESS = PASS
UNREPRESENTED_UPSTREAM_CONTRACT_BLOCKERS = 0
READY_UNITS_WITH_UNAVAILABLE_CONTRACT = 0
DOWNSTREAM_PROMOTION_WITHOUT_NEW_EVIDENCE = 0
LOCAL_CLOSURE_WITH_UNAVAILABLE_REQUIRED_CAPABILITY = 0
WITNESSES_NOT_EXECUTABLE_AT_LOCAL_CLOSURE = 0
```

## 21. Authority / Specification Escalations

```text
SPECIFICATION_GAPS = 0
ARCHITECTURE_GAPS = 0
PORTFOLIO_GAPS = 0
UPSTREAM_CONTRACT_GAPS = 0
ESCALATION = NO_ESCALATION
```

No implementation detail requires a new architectural decision, ownership change, unapproved normative dependency or missing domain rule. If implementation exposes such a question, planning must stop and route it to the owning upstream phase.

## 22. Upstream Authority Preconditions

| Applicable concept | Required proof | Evidence | Result |
|---|---|---|---|
| `REGISTRY_ENTRY` identity | `AGGREGATE_IDENTITY_PROOF` | SPEC-EXEC-001 audit §17; target §12.3 | `IDENTITY_CONTRACT_COMPLETE` |
| `REGISTRY_ENTRY` reconstruction | `AGGREGATE_RECONSTRUCTION_PROOF` | SPEC-EXEC-001 audit §18; target §12.4 | `RECONSTRUCTION_CONTRACT_COMPLETE` |
| Activity-attempt manifest identity | `AGGREGATE_IDENTITY_PROOF` | SPEC-EXEC-001 audit §17; target §12.2–§12.3 | `IDENTITY_CONTRACT_COMPLETE` |
| Activity-attempt manifest reconstruction | `AGGREGATE_RECONSTRUCTION_PROOF` | SPEC-EXEC-001 audit §18; target §12.2–§12.4 | `RECONSTRUCTION_CONTRACT_COMPLETE` |
| DOM identity/snapshot/lifecycle | upstream proofs | SPEC-DOM-001 rev4 audit §§17–23 | complete; productive runtime unavailable only |
| Persistence semantics | domain/physical boundary | target audit §§18–20; ADR-0006; approved PLAT boundary | complete; physical producer integrated-only |
| Lifecycle/failure/recovery | target §§15–20 and DOM boundary | target audit §§19, 28–29; DOM audit §§19, 28–29 | complete |

The shared Implementation Decision Simulation is inherited as `PASS` for all 19 requirements from the current component and Gap Matrix audits. It was defensively rechecked for each unit touching identity, reconstruction, rehydration, lifecycle, persistence, recovery, stale/duplicate behavior, concurrency, external effects or cross-SPEC consumption. No answer is `NO` or `UNKNOWN`.

## 23. Implementation Unit Authority Checks

| Unit | Normative decisions already upstream? | Identity/lifecycle/provenance/persistence/ownership invented? | Readiness classification | Execution-ready predicate |
|---|---|---|---|---|
| IMP-01 | YES — ADR-0003/O-016 and envelope requirements | NO | READY | TRUE |
| IMP-02 | YES — ADR-0003/O-019 and failure requirements | NO | READY | TRUE after prerequisite |
| IMP-03 | YES — ADR-0003/O-017/O-020 and overlap/resolution requirements | NO | READY | TRUE after prerequisite |
| IMP-04 | YES — source/scope/progression contracts and approved DOM/REPO boundaries | NO | READY | TRUE after prerequisite; integrated source remains separate |
| IMP-05 | YES — registry publication/extensibility requirements and source/PLAT boundaries | NO | READY | TRUE after prerequisites |
| IMP-06 | YES — O-018, `EXEC-SNAPSHOT-001`, `DOM-SNAPSHOT-001` | NO | READY | TRUE for local closure |
| IMP-07 | YES — O-018/O-021 and manifest proofs | NO | READY | TRUE for local closure |
| IMP-08 | YES — `EXEC-REGISTRY-004`, identity/reconstruction proofs | NO | READY | TRUE for local closure |
| IMP-09 | YES — registry mutation/concurrency proof and temporal authority proof | NO | READY | TRUE for local closure |
| IMP-10 | YES — `EXEC-MANIFEST-004`, DOM/PLAT proofs | NO | READY | TRUE for local closure |
| IMP-11 | YES — `EXEC-MANIFEST-002`, `EXEC-HISTORY-001`, O-021 | NO | READY | TRUE for local closure |

Readiness classification is the authority/contract result (`READY`) and is distinct from internal prerequisite scheduling in the Initial DAG State.

```text
IMPLEMENTATION_UNIT_AUTHORITY_CHECK = PASS
```

## 24. Implementation Plan Gate

The plan remains pending independent re-audit. Its local contribution and integrated-proof allocations now satisfy the remediation consistency invariants:

```text
zero uncovered local gaps
zero speculative units
zero false unit splits
zero false unit merges
all ISSUE_READY units independently implementable and locally closable
every local AC locally provable
zero downstream-dependent local ACs
zero Does Not Implement contradictions
every local witness executable at closure
every required-for-local-closure capability productively available at closure
all acceptance obligations have exactly one final proof owner
cross-SPEC dependencies explicit and not promoted
approved normative dependency direction preserved
legacy/cutover, failure, replay and compatibility represented
required tests represented
DAG acyclic
no unresolved authority/specification/portfolio/contract gap
zero units inventing identity, lifecycle, provenance, ownership, recovery or persistence semantics
```

```text
IMPLEMENTATION_PLAN_GATE: REMEDIATION_PENDING_INDEPENDENT_REAUDIT
```
