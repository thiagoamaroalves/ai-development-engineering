# SPEC-EXEC-001 — Implementation Plan

Status: PROPOSED
Planning source: validated component Implementation Gap Matrix

This plan defines HOW the validated EXEC-001 implementation deltas may be closed. It does not redefine ADR, portfolio, component SPEC, upstream contracts, ownership, failure meaning, compatibility/cutover authority, or Gap Matrix classifications. It does not implement code, modify tests, mutate the Gap Matrix, or create tickets.

## 1. Status

Planning is authorized by the latest independent evidence:

```text
PORTFOLIO_DECOMPOSITION_APPROVED
PASS — COMPONENT_SPEC_CONFORMANT
SPEC_IMPLEMENTABILITY_CHECK = PASS
GAP_MATRIX_CONFORMANT
READY_FOR_IMPLEMENTATION_PLAN
```

The next independent gate is `READY_FOR_IMPLEMENTATION_PLAN_AUDIT`. This artifact is not an approval and does not authorize issue decomposition before that audit.

## 2. Planning Authority

| Artifact | Path | Revision / result | Use |
|---|---|---|---|
| Accepted ADR authority | `docs/adrs/ADR-0001-workflow-domain-and-identity.md`; `ADR-0002`; `ADR-0003`; `ADR-0006`; `ADR-0009`; `ADR-0010`; related accepted ADRs | revision 3, `ACCEPTED`, `UNPROCESSED` | architecture and boundaries |
| Portfolio | `docs/specs/SPEC-PORTFOLIO-001-organization.md` | revision 2 | owners, obligations, dependency direction, failure and compatibility registries |
| Portfolio audit | `docs/specs/SPEC-PORTFOLIO-001-decomposition-audit.md` | `PORTFOLIO_DECOMPOSITION_APPROVED` | independent decomposition approval |
| Component SPEC | `docs/specs/SPEC-EXEC-001-skill-contracts-and-capability-registry.md` | revision 3, `PROPOSED` | owned behavior and acceptance |
| Component SPEC audit | `docs/specs/audits/SPEC-EXEC-001-component-conformance-audit.md` | `PASS — COMPONENT_SPEC_CONFORMANT`; `SPEC_IMPLEMENTABILITY_CHECK = PASS` | authority completeness and implementability |
| Upstream SPEC | `docs/specs/SPEC-DOM-001-workflow-authority-and-governance.md` | revision 4 | canonical DOM identity, snapshot and lifecycle contract |
| Upstream audit | `docs/specs/audits/SPEC-DOM-001-component-conformance-audit.md` | `PASS — COMPONENT_SPEC_CONFORMANT` | upstream authority proof |
| Validated Gap Matrix | `docs/specs/gap-matrices/SPEC-EXEC-001-implementation-gap-matrix.md` | 17 active gaps, 19 requirements | validated implementation delta |
| Gap Matrix audit | `docs/specs/gap-matrices/audits/SPEC-EXEC-001-implementation-gap-matrix-audit.md` | `GAP_MATRIX_CONFORMANT`; `READY_FOR_IMPLEMENTATION_PLAN` | independent matrix validation |
| Repository plan convention | `docs/specs/implementation-plans/SPEC-DOM-001-implementation-plan.md` | existing convention | section, unit, DAG and metric structure |

The authority hierarchy is:

```text
accepted ADR
  > approved portfolio decomposition
  > conformant component SPEC
  > conformant upstream component SPEC
  > validated Gap Matrix
  > repository implementation
  > tests
  > prototype / historical evidence
```

This plan does not redefine ADR, portfolio, SPEC, or Gap Matrix authority.

## 3. Frozen Baselines

| Baseline | Frozen value |
|---|---|
| Portfolio | revision 2; SHA-256 `c449388972279d8add520564a9614cfa236f87b6c8932a70d5bc2d28eef6be86` |
| Portfolio audit | SHA-256 `120f22d0080ac0640ebbdad7c460df5de2745788cfaea83a1859f2c577168104` |
| Primary ADR-0003 | revision 3, `ACCEPTED`; SHA-256 `6325234bb9c927a6d2b38886206119c643a05718f6db8cce8df5625653260073` |
| Related authority ADRs | ADR-0001 `33705082...d06d50`; ADR-0002 `ef9289...e177d9`; ADR-0006 `ab3957...cc6b2`; ADR-0009 `4ab502...5761`; ADR-0010 `874b77...c186`; all revision 3 and accepted |
| Component SPEC | revision 3; SHA-256 `b55e106c3b2e239f28e3ba3d2a0e75fbb9c840a3697acc2d1f540777b284b053` |
| Component SPEC audit | current working artifact SHA-256 `d0eea5fc93afcc254d022512b6a8ed9902fe152a885ccfd7f2ac51e609a9a6f1` |
| Upstream SPEC | SPEC-DOM-001 revision 4; SHA-256 `cb4a21924d9619b8349d6cc239d7998633c402d7ea3d7461c2d4d8498f9a014c` |
| Upstream audit | SHA-256 `9bbea969820f3705354ee6ca76110039f747d9aa60c84e1a19cae49f01158c15` |
| Gap Matrix | SHA-256 `c1aac7122a25131608123d2eef20aa3c8962e9985f2042d13f024840e3fdde7c` |
| Gap Matrix audit | current working artifact SHA-256 `d27facb97a8455fa9a08d74d54281cf8ab8596da1f4fa5ce96159d75d1592962` |
| Gap Matrix audit basis fingerprint | `c833e06a9a98616a55de16d97420b9937da097c37690f904554831bef726e347` |
| Repository baseline / current HEAD | `381218d5fbf8d969ee5ae5349b8f65c4cd5af7f9` |
| Working tree | documentation-dirty: expected SPEC/audit/remediation/Gap Matrix artifacts modified or untracked; no `src`, test, prototype or `.pi` implementation drift |

## 4. Baseline Drift Assessment

```text
AUTHORITY_DRIFT = NO_RELEVANT_DRIFT
IMPLEMENTATION_DRIFT = NO_RELEVANT_DRIFT
PLANNING_DRIFT = NO_RELEVANT_DRIFT
BASELINE_DRIFT_STATUS = NO_RELEVANT_DRIFT
```

The live HEAD equals the validated repository baseline. Current target authority hashes and the Gap Matrix audit basis agree with the planning inputs. Documentation dirtiness is expected evidence material and is not implementation drift. No Gap status requires revalidation; no authority revalidation, matrix regeneration or planning blocker is present.

## 5. Validated Gap Intake

The matrix contains 17 distinct active gaps covering all 19 requirements. Every gap is carried without reclassification or broadening.

| Gap | Requirement(s) | Obligation(s) | Category / severity | Owner | Validated delta |
|---|---|---|---|---|---|
| GAP-001 | EXEC-ENVELOPE-001/002 | O-016 | MISSING / MAJOR | EXEC-001 | Productive common envelope, payload and schema validation are absent. |
| GAP-002 | EXEC-CONTRACT-001 | O-019 | MISSING / MAJOR | EXEC-001 | Productive invalid JSON/schema fail-closed result is absent. |
| GAP-003 | EXEC-CONTRACT-002 | O-019 | MISSING / MAJOR | EXEC-001 | Productive unknown/absent verdict rejection is absent. |
| GAP-004 | EXEC-VERSION-001/002 | O-017 | MISSING / MAJOR | EXEC-001 | Productive semver meaning and explicit supported-set resolution are absent. |
| GAP-005 | EXEC-SNAPSHOT-001 | O-018 | CONTRADICTORY / MAJOR | EXEC-001 semantic basis; DOM snapshot owner | Caller-selected versions can establish productive snapshot state; authoritative EXEC binding is absent. |
| GAP-006 | EXEC-REGISTRY-001 | O-020 | MISSING / MAJOR | EXEC-001 | Productive deterministic frozen-basis registry resolution is absent. |
| GAP-007 | EXEC-REGISTRY-004 | O-020 | MISSING / MAJOR | EXEC-001 with DOM/PLAT boundary | Scoped registry identity, persistence, reconstruction, continuity and invalid-material rejection are absent. |
| GAP-008 | EXEC-REGISTRY-002 | O-020 | MISSING / MAJOR | EXEC-001 | Independent NORMAL and BOOTSTRAP catalogs are absent. |
| GAP-009 | EXEC-REGISTRY-003 | O-020 | MISSING / MAJOR | EXEC-001 with REPO consumer | Bootstrap allowlist and normal-capability rejection are absent. |
| GAP-010 | EXEC-CAPABILITY-001 | O-020 | MISSING / MAJOR | EXEC-001 | Productive compatible/unknown/incompatible capability resolution is absent. |
| GAP-011 | EXEC-CAPABILITY-002 | O-020 | MISSING / MAJOR | EXEC-001 | Productive registry-only synthetic capability extensibility is absent. |
| GAP-012 | EXEC-MANIFEST-001 | O-021 | MISSING / MAJOR | EXEC-001 with DOM/PLAT boundary | Complete identity-bound immutable manifest is absent. |
| GAP-013 | EXEC-MANIFEST-002 | O-021 | MISSING / MAJOR | EXEC-001 with EXEC-002/PLAT boundary | Safe checkpoint and resume-basis declaration is absent. |
| GAP-014 | EXEC-MANIFEST-004 | O-018/O-021 | MISSING / MAJOR | EXEC-001 with DOM/PLAT boundary | Manifest identity, attachment, digest and semantic rehydration are absent. |
| GAP-015 | EXEC-HISTORY-001 | O-021 | MISSING / MAJOR | EXEC-001 with PLAT boundary | Original-basis historical replay is absent. |
| GAP-016 | EXEC-FAILURE-001 | O-019 | MISSING / MAJOR | EXEC-001 with mapping boundaries | Structured failure emission and meaning-preserving mappings are absent. |
| GAP-017 | EXEC-MANIFEST-003 | O-018/O-021 | MISSING / MAJOR | EXEC-001 with DOM boundary | Started manifest/schema/exact-version freeze and new-attempt cutover are absent. |

## 6. Planning Ownership Classification

| Planning type | Gaps | Count | Treatment |
|---|---|---:|---|
| LOCAL_IMPLEMENTATION_WORK | GAP-001, GAP-002, GAP-003, GAP-004, GAP-006, GAP-007, GAP-008, GAP-009, GAP-010, GAP-011, GAP-012, GAP-013, GAP-014, GAP-016 | 14 | Implement EXEC-owned semantic contracts and local conformance behavior. |
| INTEGRATION_OR_CONVERGENCE_WORK | GAP-005, GAP-015, GAP-017 | 3 | Bind or preserve EXEC-owned basis at approved DOM/PLAT boundaries; foreign ownership remains foreign. |
| CROSS_SPEC_DEPENDENCY | None as a primary gap type | 0 | Explicit prerequisites are recorded separately. |
| PREEXISTING_FOREIGN_CAPABILITY | None | 0 | No productive foreign EXEC capability closes a target gap. |
| TEST_OR_CONFORMANCE_WORK | None as a primary gap type | 0 | Evidence is attached to behavior units, not artificial production units. |
| NO_LOCAL_WORK | None | 0 | Every active gap has a local EXEC contribution. |

## 7. Repository Planning Evidence

The matrix and repository inspection establish these planning boundaries:

| Evidence | Planning interpretation |
|---|---|
| `src/application/snapshot.ts:19-25,36-43,59-71` | Existing DOM consumer accepts caller `versions`; preserve as the validated contradiction in GAP-005, not as EXEC authority. |
| `src/domain/snapshot.ts:124-143` | Existing non-empty-string validation is insufficient for authoritative EXEC version resolution. |
| `.pi/extensions/workflow-orchestrator/subagents-client.ts:52-68` and `full-orchestrator.ts` | Real generic delegation consumer exists, but is not a registry, schema authority or canonical failure producer. |
| `src/domain/*`, `src/application/*` | Existing productive code is DOM authority/consumer evidence only; no productive EXEC canonical surface was found. |
| `prototype/src/mockDomain.ts`, `prototype/tests/*` | Scenario/UX evidence only; cannot prove persistence, recovery, registry authority, productive availability or external effects. |
| Root and prototype test evidence | Existing passes do not close any absent EXEC gap; new direct witnesses are required. |
| No productive EXEC schemas, registry/catalog, manifest persistence/replay or failure surface | Implementation work is required; physical persistence, context application, transport and projection remain foreign seams. |

Expected Repository Impact is planning guidance, not normative design authority. Likely impact is the currently absent EXEC contract/registry/manifest boundary, direct productive tests, and typed integration seams to DOM, PLAT, REPO, EXEC-002, BACKEND, OPS and UI. No class, module, library, schema technology, database, route or protocol is frozen here.

## 8. Reuse Assessment

| Surface | Assessment |
|---|---|
| Existing DOM snapshot consumer | `REPLACE_CONTRADICTORY_PATH` at the authority boundary only; preserve DOM identity/lifecycle ownership and do not move DOM semantics into EXEC. |
| Generic delegation runtime | `ADD_INTEGRATION_SEAM`; consume EXEC contracts once available, but do not promote it to registry authority. |
| Prototype envelope/version/checkpoint-shaped values | `REUSE_UNCHANGED` as scenario evidence only; never promote to production authority. |
| Productive test harness | `ADD_NEW_CAPABILITY` for direct EXEC contract/registry/manifest witnesses; retain existing unrelated tests. |
| Physical persistence and recovery | `ADD_INTEGRATION_SEAM`; PLAT owns storage, integrity, ordering and recovery. |
| Normal repository configuration | `ADD_INTEGRATION_SEAM`; REPO supplies enabled configuration and does not define EXEC semantics. |
| Session/context application | `ADD_INTEGRATION_SEAM`; EXEC-002 applies context and owns session/assignment behavior. |
| Backend/OPS/UI mappings | `ADD_INTEGRATION_SEAM`; mappings/projectors preserve canonical failure and basis meaning. |

## 9. Implementation Units

Nine units are formed by cohesive semantic and closure boundaries, not mechanically one-per-gap. All units have upstream authority for identity, lifecycle, provenance, persistence meaning and ownership. External capabilities are classified `REQUIRED_FOR_INTEGRATED_PROOF`, so local contract witnesses do not require unavailable productive foreign implementations. For mixed requirements, each unit's acceptance criteria and witness matrix are explicitly the locally owned contribution; the complete cross-SPEC obligation is proved only by the final-proof owner and integration checkpoint shown in §11 and §15.

### EXEC-IMP-01 — Envelope and schema contract

`UNIT_FORMATION_REASON = SHARED_AUTHORITY + SHARED_COMMAND_BOUNDARY + SHARED_CONFORMANCE`

#### Goal

Make the common envelope and capability payload schema contract validatable with the required structured fields, while keeping text non-authoritative.

#### Authority and Ownership

- Primary component SPEC: `SPEC-EXEC-001` §§9, 11, 13, 14; `EXEC-ENVELOPE-001/002`.
- Portfolio obligations: `O-016`; approved ownership role `CANONICAL_OWNER`.
- Local ownership: envelope/payload contract shape, schema identity and validation result.
- Cross-spec dependencies: downstream consumers map this contract; they do not define it.
- Foreign capabilities consumed: none for local closure; integration mappings are integrated-proof-only.
- Authority Consumption Proof: `ACP-EXEC-01`; accepted ADR-0003 and SPEC requirements deterministically define all local decisions.
- Authority consumption result: `AUTHORITY_CONSUMABLE` for local contract semantics.
- Availability condition: unit-owned contract harness is locally executable; no productive foreign producer is required for local closure.

#### Gap Matrix Coverage

`GAP-001`; requirements `EXEC-ENVELOPE-001`, `EXEC-ENVELOPE-002`; acceptance `AC-EXEC-001`, `AC-EXEC-002`; conformance `C-EXEC-001`, `C-EXEC-002`.

#### Portfolio Obligation Coverage

`O-016`; approved role `CANONICAL_OWNER`.

#### Validated Delta

```text
OBSERVED: no productive identifiable envelope/payload schemas or validator.
REQUIRED: common envelope and capability payload validate before consumption;
          minimum fields are structured and text is non-authoritative.
DELTA:    add the EXEC-owned contract validation boundary and direct witnesses.
```

#### Required Behavior

`LOCAL_BEHAVIOR`: valid envelope/payload pairs are accepted only through identifiable schemas; missing or text-only fields are rejected. `END_TO_END_CONTRIBUTION`: consumers receive a structured contract they can map without interpreting prose.

#### Does Not Implement

DOM lifecycle or identity; registry resolution; physical persistence; runtime/session execution; external effects; transport routes; UI/OPS presentation; final cross-SPEC conformance.

#### Repository Evidence

No productive EXEC schema/runtime was found. Prototype-shaped envelope fields are `REUSE_UNCHANGED` as scenario evidence only. Existing generic delegation is `ADD_INTEGRATION_SEAM`, not schema authority.

#### Expected Repository Impact

Absent EXEC contract/schema boundary and direct contract tests; downstream mapping seams may consume the result. This is guidance, not normative design.

#### Implementation Constraints

Preserve structured minimum fields, schema-identifiable validation, fail-closed semantics, and non-authority of text. Do not select schema technology or freeze physical representation.

#### Internal Prerequisites

None.

#### Cross-Spec Prerequisites

None for local closure. BACKEND/OPS/UI mapping contracts are required only at integrated proof.

#### Producer / Consumer Contract Proof

`PCP-EXEC-01` (full record in §12): unit-owned schema contract is consumed by EXEC failure/verdict and registry units; no foreign productive capability is required for this unit's local witnesses.

#### Capability Availability and Blocking Effect

| Capability | Authority | Contract | Local testability | Productive availability | Dependency class | Blocking effect |
|---|---|---|---|---|---|---|
| Unit-owned EXEC schema harness | DEFINED | DEFINED | YES | NO (fixture, not producer) | INFORMATIONAL | none; local witness is contract-level |

#### Temporal Authority Preconditions

`NOT_APPLICABLE`: this unit validates immutable contract input and does not observe mutable external authority before committing an effect.

#### Acceptance Criteria

1. Valid envelope and payload are accepted only when both identifiable schemas validate; text-only input is not accepted (`LOCAL_PROVABILITY = YES`).
2. Missing minimum structured fields are rejected as invalid contract, with no implied approval, checkpoint or effect (`LOCAL_PROVABILITY = YES`).

#### ACCEPTANCE_WITNESS_MATRIX

| Normative behavior | Verb | Concrete operation | State affected | Direct positive | Direct negative/isolation | Evidence | Owner | Required capability | Authority | Contract | Local testability | Productive availability | Dependency class | Witness executable at closure | Evidence type |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Envelope/payload schema validation | validate | C-EXEC-001 / AC-EXEC-001 | result contract | valid pair accepted | text-only or invalid schema rejected | `C-EXEC-001` evidence | EXEC-IMP-01 | unit-owned schema harness | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |
| Minimum structured envelope | reject | C-EXEC-002 / AC-EXEC-002 | result contract | complete fields accepted | missing field yields `CONTRACT_INVALID` | `C-EXEC-002` evidence | EXEC-IMP-01 | unit-owned schema harness | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |

#### Local Closure

`LOCAL_CLOSURE = YES`. All local criteria and completion evidence are executable with the unit-owned contract harness; no downstream unit or foreign capability is required.

#### Work Can Start

`WORK_CAN_START = YES`; `EXECUTION_READY = YES` for this unit.

#### Shared Closure Boundary

`SHARED_CLOSURE_BOUNDARY = YES` for the two envelope gaps: same EXEC owner, schema/structured-field invariant, command boundary and identical contract-level closure evidence.

#### Required Tests

Direct valid/invalid schema tests, missing-field tests, text-only rejection, non-approval/non-effect assertions and regression tests for the existing generic delegation consumer boundary.

#### Legacy / Cutover Impact

`NEW_CANONICAL_PATH`; no legacy EXEC authority exists. Historical/prototype formats are evidence only and are not silently converted.

#### Completion Evidence

Passing direct contract witness report for `C-EXEC-001/002`, schema-identifiable validation behavior, and proof that text-only input cannot be consumed as authority. All completion evidence is locally producible.

#### Risks

Text fallback, schema identity omission, and accidental promotion of a transport/prototype shape to authority.

#### Issue Decomposition Readiness

`ISSUE_READY`; `VALIDATED_GAP_BACKING = YES`; `INDEPENDENT_CLOSURE = YES`.

#### Initial DAG State

`READY`; `BLOCKED_BY = NONE`.

---

### EXEC-IMP-02 — Version, registry resolution, catalogs and capability extensibility

`UNIT_FORMATION_REASON = SHARED_AUTHORITY + SHARED_INVARIANT + SHARED_COMMAND_BOUNDARY + SHARED_CONFORMANCE`

#### Goal

Make semver/support-set interpretation, deterministic frozen-basis resolution, NORMAL/BOOTSTRAP separation, bootstrap allowlisting and registry-only capability extensibility locally true.

#### Authority and Ownership

- Primary component SPEC: `SPEC-EXEC-001` §§12.1, 13, 14; `EXEC-VERSION-001/002`, `EXEC-REGISTRY-001/002/003`, `EXEC-CAPABILITY-001/002`.
- Portfolio obligations: `O-017`, `O-020`; approved role `CANONICAL_OWNER`.
- Local ownership: semantic version classification, supported-set result, registry mapping, catalog scope separation, allowlist and common extensibility path.
- Foreign capabilities: DOM execution basis and REPO enabled configuration are consumed only as integrated proof; no foreign lifecycle or enablement is local.
- Authority Consumption Proof: `ACP-EXEC-02`; ADR-0003, ADR-0010 and the conformant SPEC define all decisions.
- Authority consumption result: `AUTHORITY_CONSUMABLE` for local semantics; integrated DOM/REPO availability remains non-blocking.

#### Gap Matrix Coverage

`GAP-004`, `GAP-006`, `GAP-008`, `GAP-009`, `GAP-010`, `GAP-011`; requirements `EXEC-VERSION-001/002`, `EXEC-REGISTRY-001/002/003`, `EXEC-CAPABILITY-001/002`; acceptance `AC-EXEC-003`, `AC-EXEC-004`, `AC-EXEC-008`, `AC-EXEC-009`, `AC-EXEC-010`, `AC-EXEC-011`, `AC-EXEC-012`.

#### Portfolio Obligation Coverage

`O-017`, `O-020`; approved role `CANONICAL_OWNER`.

#### Validated Delta

```text
OBSERVED: no productive version authority, registry/catalog resolver,
          bootstrap catalog/allowlist or extensibility path.
REQUIRED: explicit semver/support sets, deterministic frozen-basis mapping,
          independent catalogs, canonical unknown/incompatible outcomes and
          common registry extensibility.
DELTA:    add the EXEC-owned registry resolution boundary without moving DOM
          identity, REPO enablement or consumer mapping ownership.
```

#### Required Behavior

`LOCAL_BEHAVIOR`: resolve complete registered entries against the requested frozen basis; distinguish supported, unknown and incompatible cases; keep NORMAL repository-scoped and BOOTSTRAP system-scoped; reject normal capability in bootstrap; register a synthetic capability through the common path without mutating a frozen basis. `END_TO_END_CONTRIBUTION`: DOM/REPO/EXEC-002/BACKEND consume the same registry contract.

#### Does Not Implement

DOM `RepositoryId` or execution lifecycle; repository onboarding/enablement; sessions, leases or dispatch; physical persistence; external effects; transport/UI/OPS mapping.

#### Repository Evidence

No productive registry or semver resolver exists. Prototype catalogs are `REUSE_UNCHANGED` as non-authoritative scenario evidence. Generic delegation is `ADD_INTEGRATION_SEAM` only.

#### Expected Repository Impact

Absent registry, catalog and resolver boundary plus direct registry/version tests. Physical storage and enabled configuration are foreign seams; no concrete mechanism is frozen.

#### Implementation Constraints

Preserve complete scoped resolution, explicit support sets, `UNKNOWN_CAPABILITY`, `INCOMPATIBLE_CAPABILITY`, independent catalog authorities, bootstrap allowlist and frozen-basis immutability. No alias or silent conversion.

#### Internal Prerequisites

`EXEC-IMP-01`.

#### Cross-Spec Prerequisites

| Owner SPEC | Required capability | Implementation state | Blocking? |
|---|---|---|---|
| SPEC-DOM-001 | execution identity/snapshot basis | contract defined; productive integrated runtime unavailable | No for local closure; yes for integrated proof |
| SPEC-REPO-001 | enabled normal catalog source | boundary defined; productive implementation unavailable | No for local closure; yes for integrated proof |

#### Producer / Consumer Contract Proof

`PCP-DOM-EXEC-01` and `PCP-REPO-EXEC-01` (full records in §12). Both are `REQUIRED_FOR_INTEGRATED_PROOF`; local fixtures witness the local registry contract and do not promote foreign productive availability.

#### Capability Availability and Blocking Effect

| Capability ID | Authority | Contract | Local testability | Productive availability | Dependency class | Blocking effect |
|---|---|---|---|---|---|---|
| `DOM-EXEC-IDENTITY-SNAPSHOT` | DEFINED | DEFINED | NO | NO | REQUIRED_FOR_INTEGRATED_PROOF | integrated proof only |
| `REPO-EXEC-NORMAL-CATALOG` | DEFINED | DEFINED | NO | NO | REQUIRED_FOR_INTEGRATED_PROOF | integrated proof only |
| Unit-owned registry fixture | DEFINED | DEFINED | YES | NO | INFORMATIONAL | none |

#### Temporal Authority Preconditions

`NOT_APPLICABLE` to local registry resolution; a frozen basis is loaded and compared, but no mutable external effect is committed by this unit. Any external publication/enablement temporal proof remains with its owner.

#### Acceptance Criteria

1. Semver major/minor/patch meaning and explicit supported sets are observable; unsupported resolution produces `INCOMPATIBLE_CAPABILITY` without alias/conversion.
2. A registered stage resolves deterministically to capability, skill, versions, schemas, artifacts, veredictos and role constraints.
3. NORMAL and BOOTSTRAP catalogs remain independently sourced/scoped/versioned; bootstrap rejects normal capability before work.
4. Unknown/incompatible capability outcomes remain distinct and a schema-valid synthetic capability uses the common registry without mutating frozen bases.

All four criteria have `LOCAL_PROVABILITY = YES`; foreign availability is integrated-only.

#### ACCEPTANCE_WITNESS_MATRIX

| Normative behavior | Verb | Concrete operation | State affected | Direct positive | Direct negative/isolation | Evidence | Owner | Required capability | Authority | Contract | Local testability | Productive availability | Dependency class | Witness executable at closure | Evidence type |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Semver/support set | classify/resolve | C-EXEC-003/004 | registry basis | compatible minor/patch resolves | unsupported major → `INCOMPATIBLE_CAPABILITY` | C-EXEC-003/004 | EXEC-IMP-02 | registry fixture | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |
| Deterministic mapping | resolve | C-EXEC-004 / AC-EXEC-008 | registry entry | complete entry returned | duplicate/conflict or incomplete entry rejected | C-EXEC-004 | EXEC-IMP-02 | registry fixture | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |
| Catalog isolation/allowlist | isolate/reject | C-EXEC-005/010 | catalog basis | bootstrap onboarding entry resolves | normal capability in bootstrap → `INCOMPATIBLE_CAPABILITY` | C-EXEC-005/010 | EXEC-IMP-02 | catalog fixture | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |
| Capability resolution/extensibility | resolve/register | C-EXEC-010/011/012 | capability basis | known/synthetic capability resolves | unknown/incompatible remain canonical; frozen basis unchanged | C-EXEC-010/011/012 | EXEC-IMP-02 | registry fixture | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |

#### Local Closure

`LOCAL_CLOSURE = YES`. The unit's local contract fixture supplies all local witness inputs; no downstream unit, enabled repository or productive DOM runtime is required.

#### Work Can Start

`WORK_CAN_START = NO` until `EXEC-IMP-01` completes; after that prerequisite, `EXECUTION_READY = YES` for this unit.

#### Shared Closure Boundary

`SHARED_CLOSURE_BOUNDARY = YES` for the six gaps: one EXEC registry/version authority, shared resolution invariant and common direct conformance evidence; identity/reconstruction persistence is intentionally split to EXEC-IMP-03.

#### Required Tests

Semver classification, explicit supported-set rejection, deterministic mapping, duplicate/conflict no-mutation, normal/bootstrap isolation, bootstrap allowlist, unknown/incompatible distinction, synthetic registry extensibility and frozen-basis preservation.

#### Legacy / Cutover Impact

`NEW_CANONICAL_PATH` and `CUTOVER`: new semantic versions/catalog revisions create new bases; `LEGACY_COMPATIBILITY` remains a REPO consumer; no legacy registry is silently converted.

#### Completion Evidence

Direct version/registry/catalog/capability witness report for C-EXEC-003/004/005/006/010/011/012 and proof of no frozen-basis mutation. Evidence is locally producible.

#### Risks

Version approximation, normal/bootstrap authority collapse, fallback from unknown capability, category-specific branches and mutable frozen bases.

#### Issue Decomposition Readiness

`ISSUE_READY`; `VALIDATED_GAP_BACKING = YES`; `INDEPENDENT_CLOSURE = YES`.

#### Initial DAG State

`BLOCKED`; `BLOCKED_BY = EXEC-IMP-01`.

---

### EXEC-IMP-03 — Registry entry identity and semantic reconstruction

`UNIT_FORMATION_REASON = SHARED_AUTHORITY + SHARED_PERSISTENCE_BOUNDARY + SHARED_INVARIANT`

#### Goal

Make `REGISTRY_ENTRY` identity, scoped attachment, revision continuity and fail-closed semantic reconstruction locally provable without owning physical storage.

#### Authority and Ownership

- Primary component SPEC: `SPEC-EXEC-001` §§12.1, 12.3, 12.4 and `EXEC-REGISTRY-004`.
- Portfolio obligation: `O-020`; approved role `CANONICAL_OWNER`.
- Local ownership: semantic registry material validation, identity equality, reference attachment, continuity and rejection.
- Foreign capabilities: DOM supplies NORMAL `RepositoryId`; PLAT supplies physical material/integrity/order.
- Authority Consumption Proof: `ACP-EXEC-03`; target and DOM identity/reconstruction proofs are complete.
- Authority consumption result: local semantic authority complete; foreign physical availability is integrated-only.

#### Gap Matrix Coverage

`GAP-007`; requirement `EXEC-REGISTRY-004`; acceptance `AC-EXEC-019`; conformance `C-EXEC-018`, `C-EXEC-020`.

#### Portfolio Obligation Coverage

`O-020`; approved role `CANONICAL_OWNER`.

#### Validated Delta

```text
OBSERVED: no productive REGISTRY_ENTRY state, scoped key, persistence or
          semantic rehydration validator.
REQUIRED: NORMAL/BOOTSTRAP scoped identity, repository binding, continuity,
          complete references and fail-closed invalid-material behavior.
DELTA:    add EXEC semantic create/rehydrate validation while consuming DOM
          identity and PLAT physical material without absorbing either owner.
```

#### Required Behavior

`LOCAL_BEHAVIOR`: create only absent complete scoped entries; rehydrate only validated material; preserve NORMAL `RepositoryId`, BOOTSTRAP system scope, `CatalogRevision`, source, digest, references and continuity; reject duplicate, detached, corrupt, stale, out-of-order, cross-repository or inconsistent material without mutation. `END_TO_END_CONTRIBUTION`: PLAT can supply physical material for integrated replay while EXEC remains semantic owner.

#### Does Not Implement

DOM identity creation/resolution; database/serialization/integrity/recovery; repository enablement; registry retirement; downstream mapping.

#### Repository Evidence

No productive registry persistence or validator; prototype in-memory data cannot prove this gap. Use `ADD_INTEGRATION_SEAM` for DOM/PLAT material and direct semantic tests.

#### Expected Repository Impact

Registry identity/reconstruction contract and direct invalid-material/continuity tests; physical persistence interface remains guidance only.

#### Implementation Constraints

Canonical NORMAL key includes DOM `RepositoryId`; BOOTSTRAP has no repository identity; create and rehydrate are distinct; aliases cannot replace identity; physical revision/CAS is not domain continuity; failure is `CONTRACT_INVALID` with `MUTATION_ON_FAILURE = NO`.

#### Internal Prerequisites

`EXEC-IMP-02`.

#### Cross-Spec Prerequisites

| Owner SPEC | Required capability | Implementation state | Blocking? |
|---|---|---|---|
| SPEC-DOM-001 | canonical NORMAL `RepositoryId` | contract conformant; productive integration unavailable | No for local closure; yes for integrated proof |
| SPEC-PLAT-001 | physical persisted material, integrity and ordered recovery evidence | boundary defined; productive implementation unavailable | No for local closure; yes for integrated proof |

#### Producer / Consumer Contract Proof

`PCP-DOM-EXEC-01` and `PCP-PLAT-EXEC-01` (full records in §12). Both are integrated-proof-only; a local contract fixture is not promoted to productive capability.

#### Capability Availability and Blocking Effect

| Capability ID | Authority | Contract | Local testability | Productive availability | Dependency class | Blocking effect |
|---|---|---|---|---|---|---|
| `DOM-EXEC-IDENTITY-SNAPSHOT` | DEFINED | DEFINED | NO | NO | REQUIRED_FOR_INTEGRATED_PROOF | integrated proof only |
| `PLAT-EXEC-PERSISTED-MATERIAL` | DEFINED | DEFINED | NO | NO | REQUIRED_FOR_INTEGRATED_PROOF | integrated proof only |
| Local semantic reconstruction fixture | DEFINED | DEFINED | YES | NO | INFORMATIONAL | none |

#### Temporal Authority Preconditions

`NOT_APPLICABLE`: reconstruction validates a frozen material basis; no mutable external authority is observed before an effect commit.

#### Acceptance Criteria

1. NORMAL entries resolve only through the complete scoped key with DOM `RepositoryId`; BOOTSTRAP remains independently system-scoped.
2. Duplicate, detached, corrupt, stale, cross-repository, skipped or inconsistent material rejects as `CONTRACT_INVALID` without mutation; unknown/incompatible capability codes remain canonical.

`LOCAL_PROVABILITY = YES` for both.

#### ACCEPTANCE_WITNESS_MATRIX

| Normative behavior | Verb | Concrete operation | State affected | Direct positive | Direct negative/isolation | Evidence | Owner | Required capability | Authority | Contract | Local testability | Productive availability | Dependency class | Witness executable at closure | Evidence type |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Scoped registry identity | create/lookup/rehydrate | C-EXEC-018 / AC-EXEC-019 | catalog entry/basis | two NORMAL RepositoryIds resolve only locally; BOOTSTRAP resolves independently | foreign scope/key substitution rejected | C-EXEC-018 | EXEC-IMP-03 | local reconstruction fixture | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |
| Reconstruction continuity | rehydrate/reject | C-EXEC-020 | registry basis | valid digest/source/revision material rehydrates | duplicate/detached/corrupt/out-of-order material → `CONTRACT_INVALID`, no mutation | C-EXEC-020 | EXEC-IMP-03 | local reconstruction fixture | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |

#### Local Closure

`LOCAL_CLOSURE = YES`; semantic reconstruction and all negative witnesses run with deterministic local material. PLAT physical durability is integrated proof only.

#### Work Can Start

`WORK_CAN_START = NO` until `EXEC-IMP-02` completes. After that, local execution is ready.

#### Shared Closure Boundary

`SHARED_CLOSURE_BOUNDARY = YES` for the identity/reconstruction facets of GAP-007; registry mapping/catalog behavior is deliberately in EXEC-IMP-02 and physical persistence is foreign.

#### Required Tests

Two-repository isolation, NORMAL/BOOTSTRAP scope, duplicate create, wrong attachment, digest/source/schema/reference mismatch, skipped/out-of-order revision, stale/foreign material, no-mutation-on-failure and reconstruction equality/continuity.

#### Legacy / Cutover Impact

`HISTORICAL_REPLAY` owner behavior: frozen scoped basis is preserved. No registry retirement is assigned by ADR-0003.

#### Completion Evidence

Direct C-EXEC-018/020 report, complete identity/reconstruction field assertions, no-mutation evidence and explicit proof that aliases/CAS do not replace semantic authority. Evidence is locally producible.

#### Risks

Repository identity collapse, direct materialization of untrusted data, physical revision mistaken for semantic continuity, and partial mutation on rejection.

#### Issue Decomposition Readiness

`ISSUE_READY`; `VALIDATED_GAP_BACKING = YES`; `INDEPENDENT_CLOSURE = YES`.

#### Initial DAG State

`BLOCKED`; `BLOCKED_BY = EXEC-IMP-02`.

---

### EXEC-IMP-04 — Contract verdict and failure semantics

`UNIT_FORMATION_REASON = SHARED_AUTHORITY + SHARED_CONFORMANCE + SHARED_INTEGRATION_SEAM`

#### Goal

Make canonical contract/verdict failures structured, fail closed and meaning-preserving across approved consumer mappings.

#### Authority and Ownership

- Primary component SPEC: `SPEC-EXEC-001` §§13, 14, 15, 16; `EXEC-CONTRACT-001/002`, `EXEC-FAILURE-001`.
- Portfolio obligations: `O-019`; approved role `CANONICAL_OWNER`.
- Local ownership: `CONTRACT_INVALID`, `VERDICT_UNKNOWN`, structured failure fields, no-success semantics and retry/basis preservation.
- Foreign capabilities: BACKEND/OPS/UI mappings and PLAT/effect boundary are consumed only for integrated proof.
- Authority Consumption Proof: `ACP-EXEC-04`; ADR-0003 and DOM advancement/failure boundaries are sufficient.
- Authority consumption result: local failure semantics consumable; integrated mappings remain non-blocking locally.

#### Gap Matrix Coverage

`GAP-002`, `GAP-003`, `GAP-016`; requirements `EXEC-CONTRACT-001`, `EXEC-CONTRACT-002`, `EXEC-FAILURE-001`; acceptance `AC-EXEC-006`, `AC-EXEC-007`, `AC-EXEC-017`, `AC-EXEC-018`.

#### Portfolio Obligation Coverage

`O-019`; approved role `CANONICAL_OWNER`.

#### Validated Delta

```text
OBSERVED: no productive invalid-contract, unknown-verdict or structured
          failure result/mapping surface exists.
REQUIRED: canonical failures preserve code/family, contract/version/basis,
          cause and processing state and cannot imply success/effect.
DELTA:    add the EXEC-owned failure result boundary and mapping contract.
```

#### Required Behavior

`LOCAL_BEHAVIOR`: invalid JSON/schema yields `CONTRACT_INVALID`; absent/unknown verdict yields `VERDICT_UNKNOWN`; failure records preserve non-success, basis and cause; retry policy does not convert version or authorize effects. `END_TO_END_CONTRIBUTION`: BACKEND/OPS/UI preserve canonical meaning.

#### Does Not Implement

DOM lifecycle transition; transport status selection; logging/UI presentation implementation; effect execution, intent, evidence or confirmation; retry scheduler.

#### Repository Evidence

No productive EXEC failure surface. Generic delegation is a consumer seam only. Use direct failure fixtures and mapping contract tests; do not create a second failure owner.

#### Expected Repository Impact

Failure result contract and direct negative tests, with mapping seams for BACKEND/OPS/UI. No transport representation is frozen.

#### Implementation Constraints

Fail closed; preserve canonical code/family/retryability/basis/non-success; never map unknown verdict to approval; never treat requested effect as confirmed effect.

#### Internal Prerequisites

`EXEC-IMP-01`, `EXEC-IMP-02`.

#### Cross-Spec Prerequisites

| Owner SPEC | Required capability | Implementation state | Blocking? |
|---|---|---|---|
| SPEC-DOM-001 | advancement/lifecycle rejection contract | conformant contract; productive runtime unavailable | No for local closure; integrated proof only |
| SPEC-BACKEND-001 | meaning-preserving failure mapping | boundary defined; productive mapping unavailable | No for local closure; integrated proof only |
| SPEC-OPS-001 / SPEC-UI-001 | preserving logging/presentation projections | boundaries defined; productive projections unavailable | No for local closure; integrated proof only |
| SPEC-PLAT-001 | effect confirmation boundary | boundary defined; productive effect runtime unavailable | No for local closure; integrated proof only |

#### Producer / Consumer Contract Proof

`PCP-DOM-EXEC-01`, `PCP-BACKEND-EXEC-01`, `PCP-OPS-EXEC-01`, `PCP-UI-EXEC-01`, and `PCP-PLAT-EXEC-01` (full records in §12). All foreign capabilities are integrated-proof-only.

#### Capability Availability and Blocking Effect

All listed foreign capabilities have `AUTHORITY_STATUS = DEFINED`, `CONTRACT_STATUS = DEFINED`, `LOCAL_TESTABILITY = NO`, `PRODUCTIVE_AVAILABILITY = NO`, `DEPENDENCY_CLASS = REQUIRED_FOR_INTEGRATED_PROOF`; therefore none blocks local execution or local closure.

#### Temporal Authority Preconditions

`NOT_APPLICABLE` for local failure creation. External effect confirmation and any observe-then-commit operation remain under PLAT/GIT/DOM temporal owners.

#### Acceptance Criteria

1. Invalid JSON/schema and absent/unknown verdict produce their canonical structured failure and cannot imply approval, checkpoint or effect (`LOCAL_PROVABILITY = YES`).
2. Structured failure preserves code/family, contract/version/basis, cause and processing state; retry cannot convert basis or confirm an effect (`LOCAL_PROVABILITY = YES`).

#### ACCEPTANCE_WITNESS_MATRIX

| Normative behavior | Verb | Concrete operation | State affected | Direct positive | Direct negative/isolation | Evidence | Owner | Required capability | Authority | Contract | Local testability | Productive availability | Dependency class | Witness executable at closure | Evidence type |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Invalid contract failure | reject | C-EXEC-006 / AC-EXEC-006 | result processing | valid contract accepted | malformed/unknown schema → `CONTRACT_INVALID`; no success/effect | C-EXEC-006 | EXEC-IMP-04 | local failure fixture | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |
| Unknown verdict failure | reject | C-EXEC-007 / AC-EXEC-007 | result processing | registered verdict accepted | absent/unknown → `VERDICT_UNKNOWN`; no approval | C-EXEC-007 | EXEC-IMP-04 | local failure fixture | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |
| Structured failure and retry basis | emit/retry | C-EXEC-014/017 / AC-EXEC-017/018 | contract failure | typed failure preserves basis | no fallback approval, version conversion or effect confirmation | C-EXEC-014/017 | EXEC-IMP-04 | local failure fixture | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |

#### Local Closure

`LOCAL_CLOSURE = YES`; local failure and retry semantics are directly testable. Foreign mappings are integrated-only and are not local closure criteria.

#### Work Can Start

`WORK_CAN_START = NO` until `EXEC-IMP-01` and `EXEC-IMP-02` complete.

#### Shared Closure Boundary

`SHARED_CLOSURE_BOUNDARY = YES`: contract rejection and structured failure share O-019, canonical failure fields and local fail-closed evidence. DOM transition and physical effect ownership remains excluded.

#### Required Tests

Malformed JSON, missing/unknown schema, absent/unknown verdict, structured code/family/basis/cause/state, no approval/checkpoint/effect, retry no-conversion, and mapping-preservation contract tests.

#### Legacy / Cutover Impact

`NEW_CANONICAL_PATH`; incompatible bases require explicit compatible retry/new basis. No legacy failure format is authoritative.

#### Completion Evidence

Passing C-EXEC-006/007/014/017 reports, explicit no-success/no-effect assertions and mapping preservation contract evidence. Evidence is locally producible for this unit's closure.

#### Risks

Text fallback, unknown verdict as approval, failure-code renaming, or requested effect being treated as confirmation.

#### Issue Decomposition Readiness

`ISSUE_READY`; `VALIDATED_GAP_BACKING = YES`; `INDEPENDENT_CLOSURE = YES`.

#### Initial DAG State

`BLOCKED`; `BLOCKED_BY = EXEC-IMP-01, EXEC-IMP-02`.

---

### EXEC-IMP-05 — Authoritative exact-basis binding at the DOM snapshot boundary

`UNIT_FORMATION_REASON = SHARED_AUTHORITY + SHARED_INTEGRATION_SEAM + SHARED_CUTOVER`

#### Goal

Ensure exact EXEC versions are obtained from authoritative registry/basis and bound to the immutable DOM snapshot/manifest without allowing caller values to establish canonical basis.

#### Authority and Ownership

- Primary component SPEC: `SPEC-EXEC-001` §13 `EXEC-SNAPSHOT-001`; DOM `DOM-SNAPSHOT-001` is consumed authority.
- Portfolio obligation: `O-018`; EXEC-001 owns exact contract/skill basis, DOM owns snapshot identity/state.
- Local ownership: EXEC basis supply/validation and rejection of caller-established basis.
- Foreign ownership: DOM snapshot identity/immutability/lifecycle; no DOM implementation is moved here.
- Authority Consumption Proof: `ACP-DOM-EXEC-01` (full record in §12), with `AUTHORITY_STATUS=DEFINED`, `CONTRACT_STATUS=DEFINED`, `LOCAL_TESTABILITY=NO`, `PRODUCTIVE_AVAILABILITY=NO`, integrated-proof-only.
- Authority consumption result: `AUTHORITY_CONSUMPTION_GAP` for productive integration only; no local authority gap.

#### Gap Matrix Coverage

`GAP-005`; requirement `EXEC-SNAPSHOT-001`; acceptance `AC-EXEC-005`; conformance `C-EXEC-005`, `C-EXEC-012`, `C-EXEC-016`.

#### Portfolio Obligation Coverage

`O-018`; approved role `CANONICAL_OWNER` with DOM consumer boundary.

#### Validated Delta

```text
OBSERVED: caller-supplied versions enter src/application/snapshot.ts and are
          stored after only non-empty-string validation.
REQUIRED: authoritative EXEC basis supplies exact versions and caller values
          cannot establish DOM snapshot/manifest basis.
DELTA:    add the EXEC consumption/convergence boundary and retire the caller
          authority path without taking DOM identity/lifecycle ownership.
```

#### Required Behavior

`LOCAL_BEHAVIOR`: an authority-backed exact-version basis is required for the EXEC contribution; caller-supplied values are assertions only and mismatch fails closed. `END_TO_END_CONTRIBUTION`: DOM snapshot and EXEC manifest retain the same exact basis; later registry changes do not rewrite it.

#### Does Not Implement

DOM snapshot aggregate/identity/lifecycle; registry semantic authority (EXEC-IMP-02); manifest persistence/reconstruction (EXEC-IMP-06/07); PLAT storage; REPO configuration; downstream transport.

#### Repository Evidence

Existing snapshot path is `REPLACE_CONTRADICTORY_PATH` at the authority seam only. Existing DOM value objects and lifecycle remain foreign authority. No productive EXEC resolver is present.

#### Expected Repository Impact

EXEC-to-DOM exact-basis consumption seam, caller-authority rejection and direct contradiction/convergence tests. This is planning guidance, not a required file layout.

#### Implementation Constraints

Caller fields cannot become authority; preserve DOM identity and snapshot lifecycle; use exact supported basis; reject stale/mismatched basis without mutation; no silent version conversion.

#### Internal Prerequisites

`EXEC-IMP-02`.

#### Cross-Spec Prerequisites

| Owner SPEC | Required capability | Implementation state | Blocking? |
|---|---|---|---|
| SPEC-DOM-001 | canonical snapshot/attempt identity and immutable snapshot state | conformant contract; productive integration unavailable | No for local contract closure; yes for integrated proof |

#### Producer / Consumer Contract Proof

`PCP-DOM-EXEC-01` (full record in §12); the capability is integrated-proof-only and is not promoted by this unit.

#### Capability Availability and Blocking Effect

`DOM-EXEC-IDENTITY-SNAPSHOT`: DEFINED authority/contract, local testability NO, productive availability NO, `REQUIRED_FOR_INTEGRATED_PROOF`, integrated-only blocking effect. Local contract fixture proves only the consumer contract.

#### Temporal Authority Preconditions

`NOT_APPLICABLE` to local EXEC contract binding. Any mutable authority re-observation before an external effect belongs to the owning DOM/PLAT/GIT operation; this unit does not invent temporal semantics.

#### Acceptance Criteria

1. Activity start obtains exact versions from the authority-backed EXEC basis, and caller-selected values cannot establish snapshot state; registry mutation after start cannot alter the frozen basis (`LOCAL_PROVABILITY = YES` for the local binding witness).

#### ACCEPTANCE_WITNESS_MATRIX

| Normative behavior | Verb | Concrete operation | State affected | Direct positive | Direct negative/isolation | Evidence | Owner | Required capability | Authority | Contract | Local testability | Productive availability | Dependency class | Witness executable at closure | Evidence type |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Exact authoritative basis binding | resolve/freeze | C-EXEC-005 / AC-EXEC-005 | snapshot/manifest basis | authority returns exact versions and frozen basis is retained | caller arbitrary versions or post-start registry mutation cannot establish/change basis | C-EXEC-005/012/016 | EXEC-IMP-05 | local authority-binding fixture | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |

#### Local Closure

`LOCAL_CLOSURE = YES` for the EXEC binding contribution. The DOM integrated producer is not required for local closure because the local witness uses an explicit contract fixture; it remains required for integrated proof.

#### Work Can Start

`WORK_CAN_START = NO` until `EXEC-IMP-02` completes.

#### Shared Closure Boundary

`SHARED_CLOSURE_BOUNDARY = YES` for the single caller-basis contradiction. Manifest freeze is independently closed by EXEC-IMP-06 and is not merged here.

#### Required Tests

Authority-backed version binding, caller mismatch, arbitrary caller-version rejection, registry mutation after start, basis immutability and no snapshot mutation on rejection.

#### Legacy / Cutover Impact

`CUTOVER`; new incompatible basis uses new DOM attempt/identity; historical snapshots remain unchanged. REPO legacy adaptation remains foreign.

#### Completion Evidence

Direct C-EXEC-005/012/016 convergence report and no-caller-authority/no-mutation assertions. Evidence is locally producible for this unit's closure.

#### Risks

Caller-authority bypass, current-registry reinterpretation and accidental DOM ownership transfer.

#### Issue Decomposition Readiness

`ISSUE_READY`; `VALIDATED_GAP_BACKING = YES`; `INDEPENDENT_CLOSURE = YES`.

#### Initial DAG State

`BLOCKED`; `BLOCKED_BY = EXEC-IMP-02`.

---

### EXEC-IMP-06 — Complete manifest and started-basis freeze

`UNIT_FORMATION_REASON = SHARED_AUTHORITY + SHARED_PERSISTENCE_BOUNDARY + SHARED_CUTOVER + SHARED_CONFORMANCE`

#### Goal

Make the complete activity-attempt manifest contract complete before start and immutable after start, including exact schema/version basis and safe linkage to DOM identities.

#### Authority and Ownership

- Primary component SPEC: `SPEC-EXEC-001` §§12.2, 13, 14, 17; `EXEC-MANIFEST-001`, `EXEC-MANIFEST-003`.
- Portfolio obligations: `O-018`, `O-021`; approved role `CANONICAL_OWNER`.
- Local ownership: manifest semantic fields, exact basis, expected schema/version freeze and cutover contract.
- Foreign ownership: DOM identity/attempt lifecycle and PLAT durability.
- Authority Consumption Proof: `ACP-EXEC-06`; target manifest identity/reconstruction proof plus DOM identity proof.
- Authority consumption result: local semantic authority complete; foreign productive availability is integrated-only.

#### Gap Matrix Coverage

`GAP-012`, `GAP-017`; requirements `EXEC-MANIFEST-001`, `EXEC-MANIFEST-003`; acceptance `AC-EXEC-013`, `AC-EXEC-015`; conformance `C-EXEC-007`, `C-EXEC-012`.

#### Portfolio Obligation Coverage

`O-018`, `O-021`; approved role `CANONICAL_OWNER`.

#### Validated Delta

```text
OBSERVED: no productive complete manifest, expected-schema freeze or started
          exact-version immutability exists.
REQUIRED: complete manifest is attached before start; started schema/version/
          manifest basis cannot mutate; a changed basis uses a new attempt.
DELTA:    add the local immutable manifest contract and freeze/cutover proof.
```

#### Required Behavior

`LOCAL_BEHAVIOR`: construct one complete manifest for a DOM activity/attempt with paths, hashes, commits, basis, dependencies, findings, round, attempt, configuration, workdir, expected schema, exact versions and DOM references; after start reject mutation; changed basis is a new attempt/manifest. `END_TO_END_CONTRIBUTION`: EXEC-002/PLAT can apply/recover the frozen basis through their approved boundaries.

#### Does Not Implement

DOM identity/lifecycle; registry entry reconstruction (EXEC-IMP-03); physical persistence/recovery; session context application; external effect execution; consumer projections.

#### Repository Evidence

No productive manifest surface exists; prototype manifest values are non-authoritative. This is `ADD_NEW_CAPABILITY` plus typed integration seams, without fixing internal layout.

#### Expected Repository Impact

Manifest semantic boundary and direct completeness/freeze tests; persistence and DOM attachment seams remain foreign guidance.

#### Implementation Constraints

Complete pre-start creation; immutable post-start basis; new AttemptId/new manifest for new basis; no path, filename, digest, checkpoint or correlation as identity.

#### Internal Prerequisites

`EXEC-IMP-01`, `EXEC-IMP-02`.

#### Cross-Spec Prerequisites

| Owner SPEC | Required capability | Implementation state | Blocking? |
|---|---|---|---|
| SPEC-DOM-001 | activity/attempt/cycle identity and lifecycle | conformant contract; productive runtime unavailable | No for local closure; integrated proof only |
| SPEC-PLAT-001 | durable manifest material and physical integrity/recovery | boundary defined; productive implementation unavailable | No for local closure; integrated proof only |

#### Producer / Consumer Contract Proof

`PCP-DOM-EXEC-01` and `PCP-PLAT-EXEC-01` (full records in §12), both integrated-proof-only.

#### Capability Availability and Blocking Effect

Foreign identity and physical material capabilities are DEFINED/DEFINED/NO/NO and `REQUIRED_FOR_INTEGRATED_PROOF`; local contract fixture is INFORMATIONAL and does not promote productive availability.

#### Temporal Authority Preconditions

`NOT_APPLICABLE` for local manifest construction/freeze. Mutable external authority before effects remains owned by the relevant effect boundary.

#### Acceptance Criteria

1. Every started activity has all required manifest fields and exact schema/version references bound to DOM identities (`LOCAL_PROVABILITY = YES` for semantic completeness).
2. Started manifest/schema/versions cannot mutate; a changed basis creates a new attempt/manifest and leaves history unchanged (`LOCAL_PROVABILITY = YES`).

#### ACCEPTANCE_WITNESS_MATRIX

| Normative behavior | Verb | Concrete operation | State affected | Direct positive | Direct negative/isolation | Evidence | Owner | Required capability | Authority | Contract | Local testability | Productive availability | Dependency class | Witness executable at closure | Evidence type |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Complete manifest | create/freeze | C-EXEC-007 / AC-EXEC-013 | activity/attempt manifest | complete pre-start manifest accepted | missing required field/identity rejected | C-EXEC-007 | EXEC-IMP-06 | local manifest fixture | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |
| Started-basis immutability | preserve/reject | C-EXEC-012 / AC-EXEC-015 | started manifest | basis remains unchanged | post-start mutation rejected; new basis requires new attempt | C-EXEC-012 | EXEC-IMP-06 | local manifest fixture | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |

#### Local Closure

`LOCAL_CLOSURE = YES`; all completeness and freeze witnesses are local semantic evidence. PLAT persistence and DOM lifecycle are integrated-only.

#### Work Can Start

`WORK_CAN_START = NO` until `EXEC-IMP-01` and `EXEC-IMP-02` complete.

#### Shared Closure Boundary

`SHARED_CLOSURE_BOUNDARY = YES` for complete manifest fields and started-basis immutability: same artifact, basis and local closure evidence. Identity/reconstruction and historical replay are intentionally split.

#### Required Tests

Manifest completeness, DOM tuple attachment contract, missing/duplicate fields, pre-start creation, post-start mutation rejection, new-attempt cutover, basis immutability and history preservation.

#### Legacy / Cutover Impact

`CUTOVER` and `HISTORICAL_REPLAY`: old started basis is preserved; changed basis is a new attempt/identity; no legacy manifest is silently rewritten.

#### Completion Evidence

C-EXEC-007/012 reports, complete field assertions, post-start mutation rejection and new-attempt evidence. All are locally producible.

#### Risks

Manifest mutation, basis drift, identity aliasing and physical persistence being mistaken for semantic immutability.

#### Issue Decomposition Readiness

`ISSUE_READY`; `VALIDATED_GAP_BACKING = YES`; `INDEPENDENT_CLOSURE = YES`.

#### Initial DAG State

`BLOCKED`; `BLOCKED_BY = EXEC-IMP-01, EXEC-IMP-02`.

---

### EXEC-IMP-07 — Manifest identity, reconstruction and retry lineage

`UNIT_FORMATION_REASON = SHARED_AUTHORITY + SHARED_PERSISTENCE_BOUNDARY + SHARED_INVARIANT`

#### Goal

Make one immutable `ACTIVITY_ATTEMPT_MANIFEST` per DOM tuple semantically reconstructable, attachment-safe and retry-distinct.

#### Authority and Ownership

- Primary component SPEC: `SPEC-EXEC-001` §§12.2–12.4, 13, 16; `EXEC-MANIFEST-004`.
- Portfolio obligations: `O-018`, `O-021`; approved role `CANONICAL_OWNER`.
- Local ownership: manifest identity, attachment, digest/cardinality validation, semantic rehydration and retry lineage.
- Foreign capabilities: DOM resolves identity; PLAT supplies physical integrity/recovery; neither is absorbed.
- Authority Consumption Proof: `ACP-EXEC-07`; target and upstream aggregate proofs are complete.
- Authority consumption result: local semantic authority complete; productive foreign material remains integrated-proof-only.

#### Gap Matrix Coverage

`GAP-014`; requirement `EXEC-MANIFEST-004`; acceptance `AC-EXEC-020` and contribution to `AC-EXEC-018`; conformance `C-EXEC-019`, `C-EXEC-020`.

#### Portfolio Obligation Coverage

`O-018`, `O-021`; approved role `CANONICAL_OWNER`.

#### Validated Delta

```text
OBSERVED: no productive manifest identity, digest, attachment validator or
          semantic rehydration/retry path exists.
REQUIRED: exactly one immutable manifest per DOM tuple; create differs from
          rehydrate; detached/stale/corrupt/duplicate material fails closed;
          retry uses a new AttemptId and manifest.
DELTA:    add local semantic identity/reconstruction and retry-lineage proof.
```

#### Required Behavior

`LOCAL_BEHAVIOR`: create exactly once before attempt start; rehydrate only after physical and semantic validation; preserve `(ExecutionId, ActivityId, AttemptId)` and `ArtifactCycleId` lineage; reject detached/corrupt/stale/duplicate material without mutation; retry creates a new attempt identity. `END_TO_END_CONTRIBUTION`: PLAT supplies material and EXEC-002 applies context under their contracts.

#### Does Not Implement

DOM identity creation; PLAT serialization/durability/recovery; EXEC-002 sessions; history replay orchestration; external effects; UI/OPS mapping.

#### Repository Evidence

No productive manifest persistence or reconstruction; prototype is in-memory only. Use `ADD_NEW_CAPABILITY` and a typed physical-integrity seam.

#### Expected Repository Impact

Manifest identity/rehydration boundary and direct reconstruction/retry tests; no physical persistence mechanism is frozen.

#### Implementation Constraints

Canonical DOM tuple is authoritative; `ManifestContentRevision=1` is distinct from domain/physical revision; untrusted material cannot become valid state directly; no mutation on failure.

#### Internal Prerequisites

`EXEC-IMP-03`, `EXEC-IMP-06`.

#### Cross-Spec Prerequisites

| Owner SPEC | Required capability | Implementation state | Blocking? |
|---|---|---|---|
| SPEC-DOM-001 | Execution/Activity/Attempt/ArtifactCycle identity | conformant contract; productive runtime unavailable | No for local closure; integrated proof only |
| SPEC-PLAT-001 | physical manifest material and integrity/recovery | boundary defined; productive implementation unavailable | No for local closure; integrated proof only |

#### Producer / Consumer Contract Proof

`PCP-DOM-EXEC-01` and `PCP-PLAT-EXEC-01` (full records in §12), integrated-proof-only; local reconstruction fixtures do not promote availability.

#### Capability Availability and Blocking Effect

Foreign capabilities are DEFINED/DEFINED/NO/NO, `REQUIRED_FOR_INTEGRATED_PROOF`, integrated-only blocking. Local fixture is INFORMATIONAL.

#### Temporal Authority Preconditions

`NOT_APPLICABLE` to local identity/reconstruction; retry lineage is a semantic identity rule, not external effect confirmation.

#### Acceptance Criteria

1. One manifest is created/reconstructed for the exact DOM tuple with content revision and digest; attachment and cardinality are validated (`LOCAL_PROVABILITY = YES`).
2. Detached, stale, corrupt, duplicate or cross-attempt material fails closed without mutation; retry uses a new AttemptId/manifest (`LOCAL_PROVABILITY = YES`).

#### ACCEPTANCE_WITNESS_MATRIX

| Normative behavior | Verb | Concrete operation | State affected | Direct positive | Direct negative/isolation | Evidence | Owner | Required capability | Authority | Contract | Local testability | Productive availability | Dependency class | Witness executable at closure | Evidence type |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Manifest identity/reconstruction | create/rehydrate | C-EXEC-019 / AC-EXEC-020 | immutable manifest | one DOM tuple creates and rehydrates | duplicate/detached/digest/basis mismatch → `CONTRACT_INVALID` | C-EXEC-019/020 | EXEC-IMP-07 | local reconstruction fixture | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |
| Retry lineage | retry/recreate | C-EXEC-017 / AC-EXEC-018 | attempt/manifest lineage | new AttemptId/new manifest preserves basis | same manifest reuse or current-registry reinterpretation rejected | C-EXEC-017 | EXEC-IMP-07 | local reconstruction fixture | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |

#### Local Closure

`LOCAL_CLOSURE = YES`; semantic identity/reconstruction/retry evidence is locally executable. PLAT durable proof remains integrated-only.

#### Work Can Start

`WORK_CAN_START = NO` until `EXEC-IMP-03` and `EXEC-IMP-06` complete.

#### Shared Closure Boundary

`SHARED_CLOSURE_BOUNDARY = YES` for manifest identity, rehydration and retry lineage. Complete field/freeze work and historical replay are separate closure boundaries.

#### Required Tests

Exact tuple uniqueness, one-manifest cardinality, attachment mismatch, duplicate creation, digest/schema/basis mismatch, stale/current registry separation, no mutation on failure, retry new identity and reconstruction equality.

#### Legacy / Cutover Impact

`HISTORICAL_REPLAY` and `CUTOVER`: retry/new basis is new identity; original manifest remains immutable and replayable.

#### Completion Evidence

C-EXEC-019/020 reports, identity/reconstruction proof, no-mutation evidence and new-AttemptId retry evidence. All are locally producible.

#### Risks

ManifestId invention, detached material acceptance, duplicate attachment and current-registry reinterpretation.

#### Issue Decomposition Readiness

`ISSUE_READY`; `VALIDATED_GAP_BACKING = YES`; `INDEPENDENT_CLOSURE = YES`.

#### Initial DAG State

`BLOCKED`; `BLOCKED_BY = EXEC-IMP-03, EXEC-IMP-06`.

---

### EXEC-IMP-08 — Safe checkpoint and resume-basis declaration

`UNIT_FORMATION_REASON = SHARED_AUTHORITY + SHARED_INTEGRATION_SEAM + SHARED_CONFORMANCE`

#### Goal

Make safe checkpoints and resumable basis declarations explicit in the manifest/contract while preserving EXEC-002 context application and PLAT physical replay ownership.

#### Authority and Ownership

- Primary component SPEC: `SPEC-EXEC-001` §§13, 14, 16; `EXEC-MANIFEST-002`.
- Portfolio obligation: `O-021`; approved role `CANONICAL_OWNER`.
- Local ownership: checkpoint declaration and resume-basis contract.
- Foreign ownership: EXEC-002 applies session context; PLAT replays physical records.
- Authority Consumption Proof: `ACP-EXEC-08`; target §12.4 and approved foreign boundary contracts are sufficient.
- Authority consumption result: local contract consumable; foreign availability integrated-only.

#### Gap Matrix Coverage

`GAP-013`; requirement `EXEC-MANIFEST-002`; acceptance `AC-EXEC-014`; conformance `C-EXEC-017`.

#### Portfolio Obligation Coverage

`O-021`; approved role `CANONICAL_OWNER`.

#### Validated Delta

```text
OBSERVED: no productive checkpoint declaration or resume-basis surface.
REQUIRED: manifest declares safe checkpoints and basis; context application and
          physical replay remain EXEC-002/PLAT responsibilities.
DELTA:    add the local declaration and owner-preserving handoff contract.
```

#### Required Behavior

`LOCAL_BEHAVIOR`: declare safe checkpoint and exact resume basis; reject resume authorization when declaration/basis is absent. `END_TO_END_CONTRIBUTION`: EXEC-002 applies persisted context and PLAT performs physical replay without EXEC acquiring those responsibilities.

#### Does Not Implement

Session/assignment creation; scheduler; physical persistence/recovery; retry policy; lifecycle transition; external effect execution.

#### Repository Evidence

Only prototype checkpoint-shaped data exists. Use `ADD_NEW_CAPABILITY` for declaration semantics and integration seams to EXEC-002/PLAT.

#### Expected Repository Impact

Manifest checkpoint/basis contract and direct declaration/delegation tests; no session or persistence implementation is frozen.

#### Implementation Constraints

No resume without declared safe checkpoint/basis; transient text/session memory is not authority; preserve EXEC-002/PLAT ownership.

#### Internal Prerequisites

`EXEC-IMP-06`.

#### Cross-Spec Prerequisites

| Owner SPEC | Required capability | Implementation state | Blocking? |
|---|---|---|---|
| SPEC-EXEC-002 | context application between sessions | boundary defined; productive implementation unavailable | No for local closure; integrated proof only |
| SPEC-PLAT-001 | physical replay/recovery | boundary defined; productive implementation unavailable | No for local closure; integrated proof only |

#### Producer / Consumer Contract Proof

`PCP-EXEC2-EXEC-01` and `PCP-PLAT-EXEC-01` (full records in §12), integrated-proof-only.

#### Capability Availability and Blocking Effect

Both foreign capabilities are DEFINED/DEFINED/NO/NO with `REQUIRED_FOR_INTEGRATED_PROOF`; local declaration fixture is INFORMATIONAL.

#### Temporal Authority Preconditions

`NOT_APPLICABLE`: no external effect is committed by declaring a checkpoint.

#### Acceptance Criteria

1. Manifest declares safe checkpoint and resume basis; absence cannot authorize resume (`LOCAL_PROVABILITY = YES`).

#### ACCEPTANCE_WITNESS_MATRIX

| Normative behavior | Verb | Concrete operation | State affected | Direct positive | Direct negative/isolation | Evidence | Owner | Required capability | Authority | Contract | Local testability | Productive availability | Dependency class | Witness executable at closure | Evidence type |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Checkpoint/resume declaration | declare/reject | C-EXEC-017 / AC-EXEC-014 | manifest basis | declared safe checkpoint accepted | absent basis cannot authorize resume | C-EXEC-017 | EXEC-IMP-08 | local declaration fixture | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |

#### Local Closure

`LOCAL_CLOSURE = YES`; declaration and negative authorization witnesses are local. Context application and physical replay are integrated-only.

#### Work Can Start

`WORK_CAN_START = NO` until `EXEC-IMP-06` completes.

#### Shared Closure Boundary

`SHARED_CLOSURE_BOUNDARY = YES` for declaration and resume-basis evidence; EXEC-002 context application and PLAT replay are excluded.

#### Required Tests

Safe checkpoint declaration, complete basis, absent declaration rejection, transient-text rejection and owner-preserving handoff contract tests.

#### Legacy / Cutover Impact

`HISTORICAL_REPLAY`: original checkpoint/basis remains attached to its manifest; a changed basis is a new attempt.

#### Completion Evidence

C-EXEC-017 report, declaration/basis assertions and rejection of resume without declaration. Evidence is locally producible.

#### Risks

Transient session memory as authority, checkpoint without basis, and EXEC ownership of context/recovery.

#### Issue Decomposition Readiness

`ISSUE_READY`; `VALIDATED_GAP_BACKING = YES`; `INDEPENDENT_CLOSURE = YES`.

#### Initial DAG State

`BLOCKED`; `BLOCKED_BY = EXEC-IMP-06`.

---

### EXEC-IMP-09 — Historical original-basis replay protection

`UNIT_FORMATION_REASON = SHARED_AUTHORITY + SHARED_PERSISTENCE_BOUNDARY + SHARED_CUTOVER`

#### Goal

Preserve the original EXEC interpretation during historical replay and prevent the current registry from reinterpreting a frozen manifest/catalog basis.

#### Authority and Ownership

- Primary component SPEC: `SPEC-EXEC-001` §§12.1–12.4, 13, 16, 17; `EXEC-HISTORY-001`.
- Portfolio obligation: `O-021`; approved role `CANONICAL_OWNER`.
- Local ownership: original-basis interpretation and replay protection.
- Foreign ownership: PLAT physical historical material/replay.
- Authority Consumption Proof: `ACP-EXEC-09`; reconstruction and historical proofs are complete.
- Authority consumption result: local semantic authority consumable; PLAT productive replay remains integrated-only.

#### Gap Matrix Coverage

`GAP-015`; requirement `EXEC-HISTORY-001`; acceptance `AC-EXEC-016`; conformance `C-EXEC-016`.

#### Portfolio Obligation Coverage

`O-021`; approved role `CANONICAL_OWNER`.

#### Validated Delta

```text
OBSERVED: no productive historical manifest/catalog replay path exists.
REQUIRED: original identity, catalog/schema/version/hash/commit/result/checkpoint
          basis is preserved and current registry cannot reinterpret history.
DELTA:    add the local replay-basis guard while consuming PLAT replay material.
```

#### Required Behavior

`LOCAL_BEHAVIOR`: historical query/replay uses the stored original basis and rejects current-registry substitution or silent conversion. `END_TO_END_CONTRIBUTION`: PLAT supplies ordered durable history; EXEC preserves semantic interpretation.

#### Does Not Implement

Physical replay/storage; current registry construction (EXEC-IMP-02); manifest identity construction (EXEC-IMP-07); execution/session runtime; external effects; UI/OPS projection.

#### Repository Evidence

No productive replay surface; prototype history is transient. Use `ADD_INTEGRATION_SEAM` to PLAT and direct frozen-basis replay tests.

#### Expected Repository Impact

Original-basis replay contract and direct current-registry-divergence tests; physical replay mechanism is not frozen.

#### Implementation Constraints

Preserve original repository/catalog identity, schema, versions, hashes, commits, results and checkpoints; reject reinterpretation/conversion; no historical mutation.

#### Internal Prerequisites

`EXEC-IMP-03`, `EXEC-IMP-07`.

#### Cross-Spec Prerequisites

| Owner SPEC | Required capability | Implementation state | Blocking? |
|---|---|---|---|
| SPEC-PLAT-001 | ordered durable historical replay material | boundary defined; productive implementation unavailable | No for local closure; integrated proof only |

#### Producer / Consumer Contract Proof

`PCP-PLAT-EXEC-01` (full record in §12), integrated-proof-only.

#### Capability Availability and Blocking Effect

`PLAT-EXEC-PERSISTED-MATERIAL`: DEFINED/DEFINED/NO/NO, `REQUIRED_FOR_INTEGRATED_PROOF`; integrated-only blocker. Local frozen-basis fixture is INFORMATIONAL.

#### Temporal Authority Preconditions

`NOT_APPLICABLE`: replay is historical interpretation, not observe-then-commit effect authority.

#### Acceptance Criteria

1. Replay reproduces the original basis even when the current registry differs; no silent conversion or reinterpretation occurs (`LOCAL_PROVABILITY = YES`).

#### ACCEPTANCE_WITNESS_MATRIX

| Normative behavior | Verb | Concrete operation | State affected | Direct positive | Direct negative/isolation | Evidence | Owner | Required capability | Authority | Contract | Local testability | Productive availability | Dependency class | Witness executable at closure | Evidence type |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Historical original-basis replay | replay/resolve | C-EXEC-016 / AC-EXEC-016 | historical manifest/catalog | original basis reproduced | current registry/version differs but cannot reinterpret/convert | C-EXEC-016 | EXEC-IMP-09 | local replay fixture | DEFINED | DEFINED | YES | NO | INFORMATIONAL | YES | LOCAL_TEST_EVIDENCE |

#### Local Closure

`LOCAL_CLOSURE = YES`; frozen-basis semantic replay protection is locally testable. PLAT durable replay is integrated-only.

#### Work Can Start

`WORK_CAN_START = NO` until `EXEC-IMP-03` and `EXEC-IMP-07` complete.

#### Shared Closure Boundary

`SHARED_CLOSURE_BOUNDARY = YES` for the single historical replay gap; manifest reconstruction is a prerequisite, not a merged concern.

#### Required Tests

Original-basis replay, current-registry divergence, schema/version/hash/commit preservation, silent conversion rejection and historical immutability.

#### Legacy / Cutover Impact

`HISTORICAL_REPLAY` owner; no current registry substitution and no legacy rewrite.

#### Completion Evidence

C-EXEC-016 report and original-basis/divergence assertions. Evidence is locally producible.

#### Risks

Current-registry reinterpretation, historical mutation, and PLAT material being mistaken for EXEC semantic authority.

#### Issue Decomposition Readiness

`ISSUE_READY`; `VALIDATED_GAP_BACKING = YES`; `INDEPENDENT_CLOSURE = YES`.

#### Initial DAG State

`BLOCKED`; `BLOCKED_BY = EXEC-IMP-03, EXEC-IMP-07`.

## 10. Gap → Plan Traceability

| Gap ID | Requirement | Portfolio obligation | Classification | Severity | Planning type | Implementation unit(s) | Status |
|---|---|---|---|---:|---|---|---|
| GAP-001 | EXEC-ENVELOPE-001/002 | O-016 | MISSING | MAJOR | LOCAL_IMPLEMENTATION_WORK | EXEC-IMP-01 | COVERED |
| GAP-002 | EXEC-CONTRACT-001 | O-019 | MISSING | MAJOR | LOCAL_IMPLEMENTATION_WORK | EXEC-IMP-04 | COVERED |
| GAP-003 | EXEC-CONTRACT-002 | O-019 | MISSING | MAJOR | LOCAL_IMPLEMENTATION_WORK | EXEC-IMP-04 | COVERED |
| GAP-004 | EXEC-VERSION-001/002 | O-017 | MISSING | MAJOR | LOCAL_IMPLEMENTATION_WORK | EXEC-IMP-02 | COVERED |
| GAP-005 | EXEC-SNAPSHOT-001 | O-018 | CONTRADICTORY | MAJOR | INTEGRATION_OR_CONVERGENCE_WORK | EXEC-IMP-05 | COVERED |
| GAP-006 | EXEC-REGISTRY-001 | O-020 | MISSING | MAJOR | LOCAL_IMPLEMENTATION_WORK | EXEC-IMP-02 | COVERED |
| GAP-007 | EXEC-REGISTRY-004 | O-020 | MISSING | MAJOR | LOCAL_IMPLEMENTATION_WORK | EXEC-IMP-03 | COVERED |
| GAP-008 | EXEC-REGISTRY-002 | O-020 | MISSING | MAJOR | LOCAL_IMPLEMENTATION_WORK | EXEC-IMP-02 | COVERED |
| GAP-009 | EXEC-REGISTRY-003 | O-020 | MISSING | MAJOR | LOCAL_IMPLEMENTATION_WORK | EXEC-IMP-02 | COVERED |
| GAP-010 | EXEC-CAPABILITY-001 | O-020 | MISSING | MAJOR | LOCAL_IMPLEMENTATION_WORK | EXEC-IMP-02 | COVERED |
| GAP-011 | EXEC-CAPABILITY-002 | O-020 | MISSING | MAJOR | LOCAL_IMPLEMENTATION_WORK | EXEC-IMP-02 | COVERED |
| GAP-012 | EXEC-MANIFEST-001 | O-021 | MISSING | MAJOR | LOCAL_IMPLEMENTATION_WORK | EXEC-IMP-06 | COVERED |
| GAP-013 | EXEC-MANIFEST-002 | O-021 | MISSING | MAJOR | LOCAL_IMPLEMENTATION_WORK | EXEC-IMP-08 | COVERED |
| GAP-014 | EXEC-MANIFEST-004 | O-018/O-021 | MISSING | MAJOR | LOCAL_IMPLEMENTATION_WORK | EXEC-IMP-07 | COVERED |
| GAP-015 | EXEC-HISTORY-001 | O-021 | MISSING | MAJOR | INTEGRATION_OR_CONVERGENCE_WORK | EXEC-IMP-09 | COVERED |
| GAP-016 | EXEC-FAILURE-001 | O-019 | MISSING | MAJOR | LOCAL_IMPLEMENTATION_WORK | EXEC-IMP-04 | COVERED |
| GAP-017 | EXEC-MANIFEST-003 | O-018/O-021 | MISSING | MAJOR | INTEGRATION_OR_CONVERGENCE_WORK | EXEC-IMP-06 | COVERED |

```text
UNCOVERED_LOCAL_GAPS = 0
GAPS_WITH_PLAN_COVERAGE = 17
GAPS_WITHOUT_PLAN_COVERAGE = 0
```

## 11. Acceptance → Plan Traceability

| Acceptance ID | Requirement(s) | Contributing unit(s) | Final Proof Owner | Local evidence | Final evidence |
|---|---|---|---|---|---|
| AC-EXEC-001 | EXEC-ENVELOPE-001 | EXEC-IMP-01 | EXEC-IMP-01 | schema positive/negative witness | contract conformance report |
| AC-EXEC-002 | EXEC-ENVELOPE-002 | EXEC-IMP-01 | EXEC-IMP-01 | minimum-field rejection | contract conformance report |
| AC-EXEC-003 | EXEC-VERSION-001 | EXEC-IMP-02 | EXEC-IMP-02 | semver classification | registry conformance report |
| AC-EXEC-004 | EXEC-VERSION-002 | EXEC-IMP-02 | EXEC-IMP-02 | supported-set/incompatibility witness | registry conformance report |
| AC-EXEC-005 | EXEC-SNAPSHOT-001 | EXEC-IMP-02, EXEC-IMP-05 | EXEC-IMP-05 | authority-binding fixture | integrated DOM snapshot/basis evidence |
| AC-EXEC-006 | EXEC-CONTRACT-001 | EXEC-IMP-01, EXEC-IMP-04 | EXEC-IMP-04 | invalid-contract witness | failure conformance report |
| AC-EXEC-007 | EXEC-CONTRACT-002 | EXEC-IMP-02, EXEC-IMP-04 | EXEC-IMP-04 | verdict registry/rejection witness | failure conformance report |
| AC-EXEC-008 | EXEC-REGISTRY-001 | EXEC-IMP-02 | EXEC-IMP-02 | deterministic entry resolution | registry conformance report |
| AC-EXEC-009 | EXEC-REGISTRY-002 | EXEC-IMP-02 | EXEC-IMP-02 | catalog isolation witness | registry conformance report |
| AC-EXEC-010 | EXEC-REGISTRY-003 | EXEC-IMP-02 | EXEC-IMP-02 | bootstrap allowlist rejection | registry conformance report |
| AC-EXEC-011 | EXEC-CAPABILITY-001 | EXEC-IMP-02 | EXEC-IMP-02 | known/unknown/incompatible resolution | registry conformance report |
| AC-EXEC-012 | EXEC-CAPABILITY-002 | EXEC-IMP-02 | EXEC-IMP-02 | synthetic common-path witness | registry conformance report |
| AC-EXEC-013 | EXEC-MANIFEST-001 | EXEC-IMP-06 | EXEC-IMP-06 | complete manifest fixture | manifest conformance report |
| AC-EXEC-014 | EXEC-MANIFEST-002 | EXEC-IMP-06, EXEC-IMP-08 | EXEC-IMP-08 | checkpoint/basis declaration | checkpoint conformance report |
| AC-EXEC-015 | EXEC-MANIFEST-003 | EXEC-IMP-06 | EXEC-IMP-06 | post-start mutation rejection | manifest conformance report |
| AC-EXEC-016 | EXEC-HISTORY-001 | EXEC-IMP-03, EXEC-IMP-07, EXEC-IMP-09 | EXEC-IMP-09 | original-basis replay fixture | replay/conformance report |
| AC-EXEC-017 | EXEC-FAILURE-001 | EXEC-IMP-04 | EXEC-IMP-04 | structured failure witness | failure conformance report |
| AC-EXEC-018 | EXEC-FAILURE-001 / EXEC-MANIFEST-002 | EXEC-IMP-04, EXEC-IMP-07 | EXEC-IMP-07 | retry no-conversion plus new AttemptId witness | integrated retry/basis evidence |
| AC-EXEC-019 | EXEC-REGISTRY-004 | EXEC-IMP-03 | EXEC-IMP-03 | two-NORMAL-scope and frozen CatalogRevision witness | registry identity/reconstruction report |
| AC-EXEC-020 | EXEC-MANIFEST-004 | EXEC-IMP-06, EXEC-IMP-07 | EXEC-IMP-07 | tuple identity/rehydration rejection | manifest identity/reconstruction report |

```text
ACCEPTANCE_OBLIGATIONS = 20
ACCEPTANCE_WITH_FINAL_PROOF_OWNER = 20
UNRESOLVED_FINAL_PROOF_OWNERS = 0
LOCAL_AC_REQUIRING_DOWNSTREAM = 0
LOCAL_AC_CONTRADICTING_DOES_NOT_IMPLEMENT = 0
LOCAL_AC_REQUIRING_UNAVAILABLE_FOREIGN_CAPABILITY = 0
```

Final Proof Owners are the earliest units that can prove the complete acceptance obligation from local behavior, completed internal prerequisites and explicit contract fixtures. Integrated evidence listed for mixed boundaries is not copied into earlier local criteria.

## 12. Cross-Spec Dependencies

The approved normative dependency is exactly `SPEC-EXEC-001 → SPEC-DOM-001`. The other records below are approved implementation/integration boundaries already declared by the target SPEC and portfolio; they do not create new normative edges.

| Dependency / capability ID | Portfolio owner | Producer | Consumer unit(s) | Required contract | Authority status | Contract status | Semantic status | Local testability | Productive availability | Dependency class | Availability evidence | Blocking? |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `DOM-EXEC-IDENTITY-SNAPSHOT` | SPEC-DOM-001 | DOM canonical contract/resolver | IMP-02, IMP-03, IMP-05, IMP-06, IMP-07 | `DOM-ID-001`, `DOM-SNAPSHOT-001`, `DOM-LIFE-001`; RepositoryId and execution/activity/attempt/cycle references | DEFINED | DEFINED | DEFINED | NO | NO | REQUIRED_FOR_INTEGRATED_PROOF | SPEC-DOM-001 rev 4 and conformant audit; no productive integrated runtime at HEAD | No; integrated proof only |
| `REPO-EXEC-NORMAL-CATALOG` | SPEC-REPO-001 | enabled repository configuration source | IMP-02 | repository-scoped NORMAL catalog source/configuration | DEFINED | DEFINED | DEFINED | NO | NO | REQUIRED_FOR_INTEGRATED_PROOF | approved portfolio O-055/O-058 and EXEC-001 §12.1/§25; no productive REPO producer at HEAD | No; integrated proof only |
| `PLAT-EXEC-PERSISTED-MATERIAL` | SPEC-PLAT-001 | journal/checkpoint/physical material producer | IMP-03, IMP-06, IMP-07, IMP-09 | physical material, integrity, ordering and replay; PLAT cannot define EXEC meaning | DEFINED | DEFINED | DEFINED | NO | NO | REQUIRED_FOR_INTEGRATED_PROOF | portfolio O-032/O-037 and EXEC-001 §12.4/§19; no productive PLAT producer at HEAD | No; integrated proof only |
| `EXEC2-EXEC-RESUME-CONTEXT` | SPEC-EXEC-002 | EXEC-002 context applicator | IMP-08 | safe checkpoint basis application between sessions | DEFINED | DEFINED | DEFINED | NO | NO | REQUIRED_FOR_INTEGRATED_PROOF | portfolio O-022/O-025 and EXEC-001 §16; no productive EXEC-002 producer at HEAD | No; integrated proof only |
| `BACKEND-EXEC-FAILURE-MAPPING` | SPEC-BACKEND-001 | BACKEND mapping boundary | IMP-04 | preserve canonical failure code/family/basis/state | DEFINED | DEFINED | DEFINED | NO | NO | REQUIRED_FOR_INTEGRATED_PROOF | portfolio O-061 and EXEC-001 §15/§18; no productive mapping at HEAD | No; integrated proof only |
| `OPS-EXEC-FAILURE-PROJECTION` | SPEC-OPS-001 | OPS projection boundary | IMP-04 | preserve failure meaning in operational records | DEFINED | DEFINED | DEFINED | NO | NO | REQUIRED_FOR_INTEGRATED_PROOF | portfolio O-069 and EXEC-001 §15/§18; no productive projection at HEAD | No; integrated proof only |
| `UI-EXEC-FAILURE-PROJECTION` | SPEC-UI-001 | UI projection boundary | IMP-04 | present failure without changing success/approval meaning | DEFINED | DEFINED | DEFINED | NO | NO | REQUIRED_FOR_INTEGRATED_PROOF | portfolio O-073/O-077 and EXEC-001 §15/§18; no productive projection at HEAD | No; integrated proof only |

### Producer / Consumer Contract Proofs

`PCP-DOM-EXEC-01`: authority owner DOM-001; producer canonical DOM contract/resolver; produced contract is canonical `RepositoryId`, execution/activity/attempt/cycle identity, snapshot and lifecycle references with version/revision transport; consumers are EXEC-IMP-02/03/05/06/07; semantic status `DEFINED`; local testability `NO`; productive availability `NO`; dependency class `REQUIRED_FOR_INTEGRATED_PROOF`; edge `EXEC-001 → DOM-001`; availability is the future integrated DOM producer at the consumer execution point; no local blocking.

`PCP-REPO-EXEC-01`: authority owner REPO-001; producer enabled repository configuration source; produced contract is repository-scoped NORMAL catalog material; consumer EXEC-IMP-02; authority/contract/semantic status `DEFINED`; local testability `NO`; productive availability `NO`; dependency class `REQUIRED_FOR_INTEGRATED_PROOF`; edge is the approved REPO source boundary, not a new EXEC normative edge; no local blocking.

`PCP-PLAT-EXEC-01`: authority owner PLAT-001; producer physical journal/checkpoint/material reader; produced contract is integrity-checked ordered persisted material; consumers EXEC-IMP-03/06/07/09; PLAT owns storage, serialization, atomicity, ordering and physical recovery only; authority/contract/semantic status `DEFINED`; local testability `NO`; productive availability `NO`; dependency class `REQUIRED_FOR_INTEGRATED_PROOF`; no local blocking.

`PCP-EXEC2-EXEC-01`: authority owner EXEC-002; producer context applicator; produced contract is application of a declared safe checkpoint/resume basis between sessions; consumer EXEC-IMP-08; authority/contract/semantic status `DEFINED`; local testability `NO`; productive availability `NO`; dependency class `REQUIRED_FOR_INTEGRATED_PROOF`; no local blocking.

`PCP-BACKEND-EXEC-01`, `PCP-OPS-EXEC-01`, and `PCP-UI-EXEC-01`: respective approved mapping/projection owner produces a representation preserving EXEC failure code/family/basis/state; consumer EXEC-IMP-04; authority/contract/semantic status `DEFINED`; local testability `NO`; productive availability `NO`; dependency class `REQUIRED_FOR_INTEGRATED_PROOF`; no local blocking and no semantic promotion.

```text
NO_DOWNSTREAM_CAPABILITY_PROMOTION_WITHOUT_NEW_EVIDENCE = 0
UNREPRESENTED_UPSTREAM_CONTRACT_BLOCKERS = 0
READY_UNITS_WITH_UNAVAILABLE_CONTRACT = 0
```

## 13. Dependency DAG

Edges are internal implementation dependencies only; they do not change the approved normative component graph.

```text
EXEC-IMP-01
 ├──> EXEC-IMP-02
 │     ├──> EXEC-IMP-03
 │     │     └──> EXEC-IMP-07
 │     │            └──> EXEC-IMP-09
 │     ├──> EXEC-IMP-04
 │     ├──> EXEC-IMP-05
 │     └──> EXEC-IMP-06
 │            ├──> EXEC-IMP-07
 │            └──> EXEC-IMP-08
```

```text
DAG_CYCLE_DETECTED = NO
```

Every edge represents an actual contract dependency. No unit's local closure requires a downstream unit: all edges point from an earlier prerequisite to a later consumer.

## 14. Parallelization Waves

| Wave | Units | Prerequisites | Shared repository collision risk | Execution mode |
|---:|---|---|---|---|
| 1 | EXEC-IMP-01 | none | low; isolated contract boundary | SAFE |
| 2 | EXEC-IMP-02 | IMP-01 | medium with shared registry/schema surfaces; coordinate | SAFE_WITH_COORDINATION |
| 2 | EXEC-IMP-04 | IMP-01 and IMP-02 | medium with schema/registry failure result surfaces; coordinate | SAFE_WITH_COORDINATION |
| 2 | EXEC-IMP-05 | IMP-02 | high with existing DOM snapshot consumer; serial ownership coordination | SERIAL_REQUIRED |
| 2 | EXEC-IMP-06 | IMP-01 and IMP-02 | medium with manifest/schema/version surfaces; coordinate | SAFE_WITH_COORDINATION |
| 3 | EXEC-IMP-03 | IMP-02 | medium with registry persistence seam | SAFE_WITH_COORDINATION |
| 3 | EXEC-IMP-08 | IMP-06 | low/medium with manifest checkpoint fields | SAFE_WITH_COORDINATION |
| 4 | EXEC-IMP-07 | IMP-03 and IMP-06 | medium with manifest identity/reconstruction boundary | SAFE_WITH_COORDINATION |
| 5 | EXEC-IMP-09 | IMP-03 and IMP-07 | low; replay boundary consumes frozen basis | SAFE_WITH_COORDINATION |

The nominal same-wave work is not unconditionally parallel where it touches the same schema, registry, snapshot or manifest boundary. `EXEC-IMP-05` is serial with the existing snapshot consumer/bypass seam. No wave assumes unavailable foreign productive capability.

## 15. Integration Checkpoints

| Checkpoint | Required units | Integrated behavior | Required evidence | Unlocked units |
|---|---|---|---|---|
| CP-EXEC-01 | IMP-01, IMP-02 | schema-validated deterministic registry resolution and canonical failure inputs | direct schema/version/registry/unknown-incompatible reports | IMP-03, IMP-04, IMP-05, IMP-06 |
| CP-EXEC-02 | IMP-03, IMP-06, IMP-07 | exact identity-bound manifest and registry basis survive semantic reconstruction | cross-scope, attachment, digest, continuity and no-mutation reports | IMP-09 |
| CP-EXEC-03 | IMP-06, IMP-08, IMP-09 | declared checkpoint and original-basis replay preserve frozen interpretation | checkpoint declaration, current-registry divergence and replay reports | integrated EXEC-002/PLAT proof |
| CP-EXEC-04 | IMP-04, IMP-05, IMP-07 | caller cannot establish basis; failures/retry preserve non-success and attempt lineage | caller-bypass, failure-mapping, retry/new-AttemptId evidence | downstream integrated conformance |

Checkpoint evidence is integrated proof and is never copied into earlier units' local acceptance criteria.

## 16. Legacy / Authority Transition

| Current path | Target authority | Read behavior | Write behavior | Migration/mapping | Owning unit |
|---|---|---|---|---|---|
| Caller-supplied `versions` in existing DOM snapshot path | EXEC exact-version basis + DOM snapshot authority | existing path must consume resolved basis; caller values are assertions only | reject caller-established basis; preserve immutable DOM snapshot | convergence at approved DOM/EXEC seam; no DOM ownership transfer | EXEC-IMP-05 |
| Prototype envelope/version/catalog/checkpoint values | EXEC schemas/registry/manifest contracts | prototype remains historical/scenario evidence | no production writes from prototype | no silent conversion; re-express through canonical contracts | IMP-01, IMP-02, IMP-06, IMP-08 |
| Current registry during historical replay | original frozen EXEC manifest/catalog basis | replay original basis | never rewrite historical basis | PLAT supplies material; EXEC prevents reinterpretation | EXEC-IMP-09 |
| Changed started manifest/schema/version basis | new attempt and new immutable manifest | historical record remains readable | no mutation of started basis | explicit cutover to new basis/identity | EXEC-IMP-06/07 |
| Legacy repository catalog input | REPO mapping to EXEC NORMAL catalog | consume mapped canonical material only | EXEC does not mutate REPO configuration | REPO owns compatibility and enablement | EXEC-IMP-02 |

Failure ownership remains EXEC-001 for `UNKNOWN_CAPABILITY`, `INCOMPATIBLE_CAPABILITY`, `CONTRACT_INVALID` and `VERDICT_UNKNOWN`. PLAT owns physical recovery/effect reconciliation; DOM owns identity/lifecycle; REPO owns legacy compatibility; BACKEND/OPS/UI only map/project.

## 17. Test Strategy

| Evidence class | Retained/modified/new evidence | Owner |
|---|---|---|
| Existing tests retained | Root `.pi` orchestration tests and current DOM tests remain regression evidence; prototype tests remain non-authoritative evidence. | respective existing owners |
| Tests modified | Only where an existing DOM snapshot consumer must stop accepting caller authority, under the approved cross-boundary contract. | EXEC-IMP-05 with DOM consumer owner |
| New unit/domain tests | schema/envelope, version/support set, registry resolution/catalog isolation, bootstrap allowlist, extensibility, identity/reconstruction, manifest completeness/freeze, checkpoint declaration, failure and replay. | IMP-01 through IMP-09 |
| Integration tests | DOM exact basis binding; REPO NORMAL source; PLAT physical material/recovery; EXEC-002 resume application; BACKEND/OPS/UI failure mappings. | designated integrated checkpoints |
| Cross-SPEC tests | two RepositoryIds, DOM tuple attachment, PLAT material integrity, current-registry divergence, retry/new AttemptId, and meaning-preserving mappings. | CP-EXEC-02 through CP-EXEC-04 |
| Concurrency/idempotency tests | duplicate registry key, duplicate manifest tuple, no mutation on failure, basis immutability; physical CAS/idempotency remains PLAT/GIT-owned integrated evidence. | IMP-02/03/06/07 locally; PLAT integrated |
| Recovery tests | semantic rehydration and frozen-basis replay locally; durable restart/recovery physically by PLAT at integrated proof. | IMP-03/07/09 plus CP-EXEC-02/03 |
| Migration/compatibility tests | bootstrap-vs-normal isolation and REPO legacy mapping; no EXEC retirement path. | IMP-02 and integrated REPO proof |
| Conformance tests | all C-EXEC-001 through C-EXEC-020 applicable to target; direct positive, negative and isolation witnesses. | final proof owners in §11 |

Correctness-sensitive behavior receives automated direct witnesses. Registration/listing is not used as progress proof; sequential duplicate execution is not concurrency proof; fixtures do not prove productive durability, restart, physical CAS or external effects.

## 18. Risk Register

| Risk | Cause | Affected units | Mitigation / gate |
|---|---|---|---|
| Duplicate authority | caller, prototype, generic delegation or consumer becomes registry/schema authority | IMP-01/02/05 | authority boundary tests; no downstream promotion; independent plan audit |
| Version approximation | alias, major-only acceptance or silent conversion | IMP-02/05/09 | explicit support-set and frozen-basis negative witnesses |
| Identity mismatch | RepositoryId, DOM tuple or manifest aliases replaced by path/digest/label | IMP-03/06/07 | identity/reconstruction proofs and cross-scope isolation |
| Partial mutation | invalid registry/manifest material mutates state before rejection | IMP-03/06/07 | no-mutation-on-failure witnesses and PLAT integrity boundary |
| Hidden lifecycle duplication | EXEC starts/advances DOM or applies session lifecycle | IMP-05/08 | Does Not Implement checks and cross-SPEC audit |
| Historical reinterpretation | current registry resolves old activity | IMP-07/09 | original-basis replay checkpoint and divergence test |
| Caller-authority bypass | existing snapshot path copies arbitrary `versions` | IMP-05 | direct contradiction witness and serial integration coordination |
| Durable recovery mismatch | fixture treated as physical persistence/recovery | IMP-03/06/07/09 | dependency class integrated-only; PLAT checkpoint evidence |
| Failure semantic loss | BACKEND/OPS/UI rename or soften EXEC failures | IMP-04 | meaning-preserving mapping contract and integrated tests |
| Downstream-dependent local acceptance | local AC requires DOM/PLAT/EXEC-002 implementation | all mixed units | local fixtures; all external capabilities integrated-proof-only |
| Parallel collision | registry/schema/manifest paths changed concurrently | IMP-02/04/05/06 | waves mark coordination/serial execution |
| Ambiguous final proof | contributor assigned full end-to-end obligation too early | all | §11 has exactly one owner per acceptance; checkpoints separate proof |

## 19. Implementation Unit Closure Matrix

| Unit | Independently implementable | Local closure | Issue decomposition readiness | Initial DAG state | Blocked by |
|---|---|---|---|---|---|
| EXEC-IMP-01 | YES | YES | ISSUE_READY | READY | none |
| EXEC-IMP-02 | YES after prerequisite | YES | ISSUE_READY | BLOCKED | EXEC-IMP-01 |
| EXEC-IMP-03 | YES after prerequisite | YES | ISSUE_READY | BLOCKED | EXEC-IMP-02 |
| EXEC-IMP-04 | YES after prerequisites | YES | ISSUE_READY | BLOCKED | EXEC-IMP-01, EXEC-IMP-02 |
| EXEC-IMP-05 | YES after prerequisite | YES | ISSUE_READY | BLOCKED | EXEC-IMP-02 |
| EXEC-IMP-06 | YES after prerequisites | YES | ISSUE_READY | BLOCKED | EXEC-IMP-01, EXEC-IMP-02 |
| EXEC-IMP-07 | YES after prerequisites | YES | ISSUE_READY | BLOCKED | EXEC-IMP-03, EXEC-IMP-06 |
| EXEC-IMP-08 | YES after prerequisite | YES | ISSUE_READY | BLOCKED | EXEC-IMP-06 |
| EXEC-IMP-09 | YES after prerequisites | YES | ISSUE_READY | BLOCKED | EXEC-IMP-03, EXEC-IMP-07 |

All nine units have local acceptance and completion evidence executable at their closure point. A unit's `ISSUE_READY` status is decomposition readiness, not ticket lifecycle or immediate execution state.

## 20. Plan Metrics

```text
VALIDATED_GAPS = 17
LOCAL_IMPLEMENTATION_GAPS = 14
CROSS_SPEC_DEPENDENCIES = 0 primary gaps; 7 explicit capability handoffs
PREEXISTING_FOREIGN_CAPABILITIES = 0
NO_LOCAL_WORK_GAPS = 0

IMPLEMENTATION_UNITS = 9
LOCALLY_CLOSABLE_UNITS = 9
NON_LOCALLY_CLOSABLE_UNITS = 0
ISSUE_DECOMPOSITION_READY_UNITS = 9
INTERNAL_ONLY_UNITS = 0
PLAN_BLOCKED_UNITS = 0
INITIAL_READY_UNITS = 1
INITIAL_BLOCKED_UNITS = 8

GAPS_WITH_PLAN_COVERAGE = 17
GAPS_WITHOUT_PLAN_COVERAGE = 0
UNITS_WITHOUT_GAP_OR_SUPPORTING_AUTHORITY = 0
FALSE_UNIT_SPLITS = 0
FALSE_UNIT_MERGES = 0

ACCEPTANCE_OBLIGATIONS = 20
ACCEPTANCE_WITH_FINAL_PROOF_OWNER = 20
UNRESOLVED_FINAL_PROOF_OWNERS = 0
LOCAL_AC_REQUIRING_DOWNSTREAM = 0
LOCAL_AC_CONTRADICTING_DOES_NOT_IMPLEMENT = 0
LOCAL_AC_REQUIRING_UNAVAILABLE_FOREIGN_CAPABILITY = 0

UNAPPROVED_NORMATIVE_DEPENDENCIES = 0
SPECIFICATION_GAPS = 0
ARCHITECTURE_GAPS = 0
PORTFOLIO_GAPS = 0
UPSTREAM_CONTRACT_GAPS = 0

DAG_CYCLE_DETECTED = NO
IMPLEMENTATION_UNIT_AUTHORITY_CHECK = PASS
UNITS_INVENTING_IDENTITY = 0
UNITS_INVENTING_LIFECYCLE = 0
UNITS_INVENTING_PROVENANCE = 0
UNITS_INVENTING_OWNERSHIP = 0
UNITS_INVENTING_RECOVERY = 0
UNITS_INVENTING_PERSISTENCE_SEMANTICS = 0

AUTHORITY_CONSUMPTION_GAPS = 0 local/blocking; 1 inherited integrated-only availability gap
TEMPORAL_AUTHORITY_GAPS = 0
AUTHORITY_COMPLETENESS = PASS
UNREPRESENTED_UPSTREAM_CONTRACT_BLOCKERS = 0
READY_UNITS_WITH_UNAVAILABLE_CONTRACT = 0
DOWNSTREAM_PROMOTION_WITHOUT_NEW_EVIDENCE = 0
LOCAL_CLOSURE_WITH_UNAVAILABLE_REQUIRED_CAPABILITY = 0
WITNESSES_NOT_EXECUTABLE_AT_LOCAL_CLOSURE = 0
SPECULATIVE_UNITS = 0
```

## 21. Authority / Specification Escalations

```text
SPECIFICATION_GAPS = 0
ARCHITECTURE_GAPS = 0
PORTFOLIO_GAPS = 0
UPSTREAM_CONTRACT_GAPS = 0
ESCALATION = NO_ESCALATION
```

No implementation detail in this plan requires a new architectural decision, ownership change, normative dependency or missing domain rule. If implementation later exposes such a question, planning must stop and route it to the owning upstream phase; no unit may decide it locally.

## 22. Upstream Authority Preconditions

The authority handoff is complete and is cited rather than recreated:

| Applicable concept | Required proof | Evidence | Result |
|---|---|---|---|
| `REGISTRY_ENTRY` identity | `AGGREGATE_IDENTITY_PROOF` | SPEC-EXEC-001 §12.3; component audit §17 | `IDENTITY_CONTRACT_COMPLETE` |
| `REGISTRY_ENTRY` reconstruction | `AGGREGATE_RECONSTRUCTION_PROOF` | SPEC-EXEC-001 §12.4; component audit §18 | `RECONSTRUCTION_CONTRACT_COMPLETE` |
| Activity-attempt manifest identity | `AGGREGATE_IDENTITY_PROOF` | SPEC-EXEC-001 §12.2–12.3; component audit §17 | `IDENTITY_CONTRACT_COMPLETE` |
| Activity-attempt manifest reconstruction | `AGGREGATE_RECONSTRUCTION_PROOF` | SPEC-EXEC-001 §12.2–12.4; component audit §18 | `RECONSTRUCTION_CONTRACT_COMPLETE` |
| DOM identities/snapshot/lifecycle consumed by EXEC | upstream proofs | SPEC-DOM-001 revision 4 §§10.1, 12, authority-completeness sections; DOM audit §§17–23 | complete, integrated producer unavailable only |
| Persistence semantics | domain/physical boundary proof | SPEC-EXEC-001 §12.4, §19; ADR-0006; PLAT boundary | complete; PLAT physical capability is integrated-only |
| Lifecycle and failure | local SPEC §§15–16 and DOM advancement boundary | SPEC-EXEC-001 audit §§19, 28–29; DOM audit §§19, 28–29 | complete |

The shared Implementation Decision Simulation is inherited as PASS for all 19 requirements from the latest component SPEC audit and Gap Matrix audit. This plan defensively rechecks every unit touching identity, reconstruction, rehydration, lifecycle, persistence, recovery, stale/duplicate behavior, external effects and cross-SPEC consumption: all answers remain determined by accepted authority; no `NO` or `UNKNOWN` answer is present. No unit invents identity, lifecycle, provenance, recovery, persistence meaning or ownership.

## 23. Implementation Unit Authority Checks

| Unit | Normative decisions already upstream? | Identity/lifecycle/provenance/persistence/ownership invented? | Readiness classification | Execution-ready predicate |
|---|---|---|---|---|
| EXEC-IMP-01 | YES — ADR-0003/O-016; EXEC envelope requirements | NO | READY | TRUE |
| EXEC-IMP-02 | YES — ADR-0003/O-017/O-020; EXEC version/registry requirements; DOM/REPO boundaries | NO | READY after IMP-01 | TRUE after prerequisite |
| EXEC-IMP-03 | YES — EXEC-REGISTRY-004 and DOM/PLAT proofs | NO | READY after IMP-02 | TRUE after prerequisite |
| EXEC-IMP-04 | YES — ADR-0003/O-019; EXEC failure requirements; DOM mapping boundary | NO | READY after IMP-01/02 | TRUE after prerequisites |
| EXEC-IMP-05 | YES — O-018, EXEC-SNAPSHOT-001, DOM-SNAPSHOT-001 | NO | READY after IMP-02; DOM availability integrated-only | TRUE for local closure |
| EXEC-IMP-06 | YES — O-018/O-021, EXEC-MANIFEST-001/003, DOM identity proof | NO | READY after IMP-01/02 | TRUE for local closure |
| EXEC-IMP-07 | YES — EXEC-MANIFEST-004, DOM/PLAT reconstruction proofs | NO | READY after IMP-03/06 | TRUE for local closure |
| EXEC-IMP-08 | YES — EXEC-MANIFEST-002, O-025/PLAT boundary | NO | READY after IMP-06 | TRUE for local closure |
| EXEC-IMP-09 | YES — EXEC-HISTORY-001, O-021, PLAT replay boundary | NO | READY after IMP-03/07 | TRUE for local closure |

```text
IMPLEMENTATION_UNIT_AUTHORITY_CHECK = PASS
```

## 24. Implementation Plan Gate

The plan satisfies the local planning invariants:

```text
zero uncovered local gaps
zero speculative units
zero false unit splits
zero false unit merges
all units independently implementable and locally closable
all local witnesses executable at closure
all acceptance obligations have exactly one final proof owner
cross-SPEC dependencies explicit and non-promoted
approved normative dependency direction preserved
legacy/cutover and historical replay represented
failure ownership preserved
required tests represented
DAG acyclic
no unresolved authority/specification/portfolio/contract gap
```

```text
IMPLEMENTATION_PLAN_GATE: READY_FOR_IMPLEMENTATION_PLAN_AUDIT
```
