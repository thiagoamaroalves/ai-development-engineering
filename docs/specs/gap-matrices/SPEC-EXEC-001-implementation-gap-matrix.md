# SPEC-EXEC-001 — Implementation Gap Matrix

## 1. Executive Summary

This matrix is the finding-driven remediation baseline for `SPEC-EXEC-001` at
repository HEAD `381218d5fbf8d969ee5ae5349b8f65c4cd5af7f9`. It preserves the
19-requirement inventory, approved ownership, the single normative dependency
to `SPEC-DOM-001`, and all valid existing Gap identities. The latest
independent audit identified one remaining planning-blocking omission: the
`GAP-007` detail record did not expose all four required mixed-ownership fields
for `EXEC-REGISTRY-004`. The prior classification, capability proof, inventory,
gap split and other metrics remain preserved; this correction changes only the
validated ownership decomposition and its derived metrics. No implementation,
test, authority, plan, or ticket is changed.

The productive EXEC canonical schemas, registry/catalog, manifest and failure
contract remain absent. The productive DOM snapshot consumer and the generic
skill delegation runtime are recorded as repository boundaries, not promoted
to EXEC authority. `EXEC-SNAPSHOT-001` is `CONTRADICTORY` because caller input
can establish values in a productive snapshot path; the remaining 18
requirements are `MISSING`. There are 17 distinct local gaps: `GAP-005` is
retained for the snapshot contradiction and the formerly merged manifest-freeze
delta is represented by new stable `GAP-017`.

This artifact is not conformant or plan-ready by itself. Its only remediation
handoff is `READY_FOR_INDEPENDENT_GAP_MATRIX_REAUDIT`.

## 2. Assessment Subject and Baselines

| Field | Value |
|---|---|
| Target SPEC | `SPEC-EXEC-001` |
| Target path | `docs/specs/SPEC-EXEC-001-skill-contracts-and-capability-registry.md` |
| SPEC revision/status | `3` / `PROPOSED` |
| Component SPEC audit/verdict | `docs/specs/audits/SPEC-EXEC-001-component-conformance-audit.md` / `PASS — COMPONENT_SPEC_CONFORMANT` |
| Portfolio | `SPEC-PORTFOLIO-001`, revision `2` |
| Portfolio audit/verdict | `docs/specs/SPEC-PORTFOLIO-001-decomposition-audit.md` / `PORTFOLIO_DECOMPOSITION_APPROVED` |
| Accepted ADR | `ADR-0003`, revision `3`, `ACCEPTED`; related identity/boundary ADRs remain accepted |
| Upstream SPEC/audit | `SPEC-DOM-001`, revision `4` / `PASS — COMPONENT_SPEC_CONFORMANT` |
| Matrix prior baseline | SHA256 `d9ec02868842d7d04e516bded6f6e7d9f1dba0c534b318791c7973fa5f371c23` |
| Audited repository baseline | `381218d5fbf8d969ee5ae5349b8f65c4cd5af7f9` |
| Current repository HEAD | `381218d5fbf8d969ee5ae5349b8f65c4cd5af7f9` |
| Source audit | `docs/specs/gap-matrices/audits/SPEC-EXEC-001-implementation-gap-matrix-audit.md` |
| Source audit verdict | `GAP_MATRIX_REMEDIATION_REQUIRED` |
| Source audit fingerprint | `766e21a79dfef965e9193f4806bb55ac0f1568dca3b22deef04e5a9ae56ade91` |
| Matrix remediation baseline | source audit's 19 rows, 17 detail records, and pinned repository state |

### Baseline reassessment state

```text
BASELINE_DRIFT_STATUS = NO_DRIFT
REASSESSMENT_COMPLETE = YES
FINDINGS_ARE_ACTIONABLE = YES
BASELINE_REMEDIATION_READINESS = READY
AUDIT_BASIS_STALE = NO
AUDIT_BASIS_FINGERPRINT = 766e21a79dfef965e9193f4806bb55ac0f1568dca3b22deef04e5a9ae56ade91
OLD_AUTHORITY_BASELINE = SPEC-PORTFOLIO-001 rev 2 and approved decomposition audit; ADR-0003 rev 3 ACCEPTED; SPEC-DOM-001 rev 4 and conformant audit; SPEC-EXEC-001 rev 3 and conformant audit
CURRENT_AUTHORITY_BASELINE = unchanged from audited authority baseline; portfolio, ADR, target SPEC, upstream SPEC and audits match the audited revisions/hashes
OLD_REPOSITORY_BASELINE = 381218d5fbf8d969ee5ae5349b8f65c4cd5af7f9
CURRENT_REPOSITORY_BASELINE = 381218d5fbf8d969ee5ae5349b8f65c4cd5af7f9
REMEDIATION_SCOPE = target Gap Matrix only; correct CGMA-MAJOR-005 by completing GAP-007 mixed-ownership fields and derived metrics
REVALIDATION_CRITERIA = 19 requirements exactly once; 17 distinct active gap records; explicit GAP-007 four-part mixed-ownership decomposition; eight mixed-ownership records; mechanically reconciled metrics; zero planning-blocking findings remaining
```

The working tree is documentation-dirty as recorded by the source audit. No
production source, test, migration, schema, configuration, plan, ticket, ADR,
portfolio or upstream SPEC change occurred after the audited basis. The live
HEAD and live authority/source/evidence basis match the persisted audit
fingerprint. No `BASELINE_REASSESSMENT_PROOF` is required because the audit
reports `NO_DRIFT`.

## 3. Authority Context

Authority is consumed in this order:

```text
accepted ADR
  > approved SPEC portfolio decomposition
  > conformant component SPEC
  > conformant upstream component SPEC
  > repository implementation
  > tests
  > validated independent audit findings
  > matrix under remediation
```

`ADR-0003` owns envelope/schema, semver/support sets, exact basis, fail-closed
contract/verdict behavior, registry/catalog and immutable manifest semantics.
The portfolio assigns `O-016` through `O-021` to `EXEC-001` and approves the
direct edge `SPEC-EXEC-001 → SPEC-DOM-001`. DOM supplies canonical identity and
snapshot behavior; PLAT supplies physical persistence/recovery; EXEC-002
applies context; BACKEND/OPS/UI map or project failures. None of those foreign
obligations is absorbed into local EXEC implementation scope.

Failure ownership remains EXEC-001 for `UNKNOWN_CAPABILITY`,
`INCOMPATIBLE_CAPABILITY`, `CONTRACT_INVALID` and `VERDICT_UNKNOWN`.
Compatibility roles remain `NEW_CANONICAL_PATH=OWNER`,
`LEGACY_COMPATIBILITY=CONSUMER`, `HISTORICAL_REPLAY=OWNER`, `CUTOVER=OWNER`,
and `RETIREMENT=NOT_APPLICABLE`.

## 4. Normative Requirement Inventory

The conformant component SPEC defines exactly 19 implementation-relevant
requirements. Each appears once below and remains anchored to its obligation,
authority and owner.

| Requirement ID | Portfolio obligation | ADR authority | Ownership role | Requirement summary | Dependencies | Compatibility role |
|---|---|---|---|---|---|---|
| `EXEC-ENVELOPE-001` | O-016 | ADR-0003 / Decisão | CANONICAL_OWNER | Envelope and capability payload validate against identifiable JSON schemas; text is non-authoritative. | None | NEW_CANONICAL_PATH OWNER |
| `EXEC-ENVELOPE-002` | O-016 | ADR-0003 / Decisão | CANONICAL_OWNER | Envelope carries all required structured execution, identity, status, verdict, checkpoint, artifact, evidence, finding, effect and error fields. | None | NEW_CANONICAL_PATH OWNER |
| `EXEC-VERSION-001` | O-017 | ADR-0003 / Decisão | CANONICAL_OWNER | Semver major/minor/patch semantics are observable. | None | NEW_CANONICAL_PATH OWNER |
| `EXEC-VERSION-002` | O-017 | ADR-0003 / Decisão | CANONICAL_OWNER | Supported sets are explicit; unsupported resolution is `INCOMPATIBLE_CAPABILITY` without alias or silent conversion. | Registry | NEW_CANONICAL_PATH/CUTOVER OWNER |
| `EXEC-SNAPSHOT-001` | O-018 | ADR-0003 / Decisão; DOM-SNAPSHOT-001 | CANONICAL_OWNER with DOM consumer boundary | Authoritative exact contract/skill versions are frozen in the immutable DOM snapshot and activity manifest. | DOM snapshot | CUTOVER/HISTORICAL_REPLAY OWNER |
| `EXEC-CONTRACT-001` | O-019 | ADR-0003 / Decisão | CANONICAL_OWNER | Invalid JSON/schema fails closed as `CONTRACT_INVALID` without success, approval, checkpoint or effect. | Schemas | NEW_CANONICAL_PATH OWNER |
| `EXEC-CONTRACT-002` | O-019 | ADR-0003 / Decisão | CANONICAL_OWNER | Unknown or absent required verdict fails closed as `VERDICT_UNKNOWN`. | Registry, schemas | NEW_CANONICAL_PATH OWNER |
| `EXEC-REGISTRY-001` | O-020 | ADR-0003 / Decisão | CANONICAL_OWNER | Versioned registry deterministically maps stage, capability, schemas, artifacts, verdicts and roles for a frozen basis. | DOM execution basis | NEW_CANONICAL_PATH OWNER |
| `EXEC-REGISTRY-004` | O-020 | ADR-0003; ADR-0010; DOM-ID-001 | CANONICAL_OWNER | Registry entries have scoped immutable identity, deterministic creation/reconstruction, persistence, continuity and fail-closed invalid/stale behavior. | DOM `RepositoryId`; catalog basis | NEW_CANONICAL_PATH/HISTORICAL_REPLAY OWNER |
| `EXEC-REGISTRY-002` | O-020 | ADR-0003 / Decisão | CANONICAL_OWNER | NORMAL and independent BOOTSTRAP catalogs are separately sourced and versioned. | REPO configuration; DOM `RepositoryId` for NORMAL | NEW_CANONICAL_PATH/LEGACY CONSUMER |
| `EXEC-REGISTRY-003` | O-020 | ADR-0003 / Decisão | CANONICAL_OWNER | Bootstrap allowlist rejects normal capabilities with `INCOMPATIBLE_CAPABILITY`. | Registry; REPO consumer | NEW_CANONICAL_PATH OWNER |
| `EXEC-CAPABILITY-001` | O-020 | ADR-0003 / Decisão | CANONICAL_OWNER | Required capability resolves compatibly; unknown/incompatible cases preserve canonical codes. | Registry | NEW_CANONICAL_PATH OWNER |
| `EXEC-CAPABILITY-002` | O-020 | ADR-0003 / Decisão | CANONICAL_OWNER | Schema-valid new capability uses the same registry authority without mutating frozen bases. | Registry and schemas | NEW_CANONICAL_PATH/CUTOVER OWNER |
| `EXEC-MANIFEST-001` | O-021 | ADR-0003; DOM-ID-001 | CANONICAL_OWNER with DOM/PLAT boundary | Each activity receives a complete immutable manifest bound to DOM identities and exact contract references. | DOM activity/attempt/cycle; PLAT persistence | NEW_CANONICAL_PATH/HISTORICAL_REPLAY OWNER |
| `EXEC-MANIFEST-002` | O-021 | ADR-0003 / Decisão | CANONICAL_OWNER with EXEC-002/PLAT boundary | Manifest declares safe checkpoints and resume basis; downstream owners apply/replay context and physical material. | EXEC-002; PLAT | HISTORICAL_REPLAY OWNER |
| `EXEC-MANIFEST-003` | O-018/O-021 | ADR-0003; DOM-SNAPSHOT-001 | CANONICAL_OWNER with DOM consumer boundary | Started manifest, expected schema and exact versions cannot mutate; a new basis uses a new attempt/identity. | DOM snapshot/attempt | CUTOVER/HISTORICAL_REPLAY OWNER |
| `EXEC-MANIFEST-004` | O-018/O-021 | ADR-0003; ADR-0001; ADR-0006 | CANONICAL_OWNER with DOM/PLAT boundary | Exactly one immutable manifest per DOM tuple is created/reconstructed with attachment, basis, revision and digest validation. | DOM identity/snapshot; PLAT integrity/recovery | HISTORICAL_REPLAY/CUTOVER OWNER |
| `EXEC-HISTORY-001` | O-021 | ADR-0003 / Decisão | CANONICAL_OWNER with PLAT boundary | Historical replay preserves the original EXEC interpretation and cannot be reinterpreted by a current registry. | Manifest/catalog basis; PLAT replay | HISTORICAL_REPLAY OWNER |
| `EXEC-FAILURE-001` | O-019 | ADR-0003 / Decisão | CANONICAL_OWNER with mapping boundaries | Structured failures preserve code/family, contract/version/basis, cause and processing state without implying success/effect. | BACKEND/OPS/UI mappings | NEW_CANONICAL_PATH OWNER |

```text
SPEC_NORMATIVE_REQUIREMENTS = 19
MATRIX_NORMATIVE_REQUIREMENTS = 19
MISSING_FROM_MATRIX = 0
EXTRA_IN_MATRIX = 0
DUPLICATED_IN_MATRIX = 0
```

## 5. Existing Implementation Inventory

| Surface | Corrected observed baseline | Authority/evidence interpretation |
|---|---|---|
| Productive EXEC canonical surfaces | No productive EXEC JSON schemas, registry/catalog, manifest persistence, replay surface or canonical failure result surface found under `src/`. | EXEC implementation remains absent; this supports local missing gaps. |
| Productive DOM snapshot consumer | `src/application/snapshot.ts:19-25,36-43,59-71` defines `ExecExactVersionMetadata`, accepts caller-supplied `versions`, maps them to `ExactVersionSet`, and stores them in a productive snapshot flow. `src/domain/snapshot.ts:124-143` validates only non-empty strings. | Existing DOM consumer boundary; caller values are not canonical EXEC authority. This is the `EXEC-SNAPSHOT-001` contradiction in `GAP-005`. |
| Productive skill delegation runtime | `.pi/extensions/workflow-orchestrator/subagents-client.ts:52-68` provides a real delegation request/response runtime; `.pi/extensions/workflow-orchestrator/full-orchestrator.ts` invokes operation skills and validates workflow results/artifacts. | Generic productive consumer/integration surface; not an EXEC registry, schema or canonical contract implementation. |
| Productive DOM/domain/application | Existing `src/domain` and `src/application` modules implement DOM identity, lifecycle and snapshot concerns. | Foreign DOM authority remains consumed; no ownership transfer. |
| Prototype | `prototype/src/mockDomain.ts` contains in-memory version, checkpoint, artifact and onboarding-shaped values. | Prototype-only evidence; not productive authority or availability proof. |
| Tests | Root `npm test` passed 20/20; `npm run typecheck` passed; `npm --prefix prototype test` passed 92/92. | Test existence/execution is distinct and does not prove absent EXEC behavior. |

The inventory deliberately distinguishes absent EXEC canonical implementation,
existing DOM consumer behavior, and generic skill delegation runtime. Neither
consumer is promoted to EXEC authority or productive capability availability.

## 6. Implementation Gap Matrix

The following is the distinct-gap index; the explicit one-row-per-requirement
matrix is in §6.1 and is the authoritative requirement reconciliation.

| Gap ID | Requirement ID | Portfolio obligation | Ownership role | Requirement summary | Classification | Implementation evidence | Test existence evidence | Test execution evidence | Exact delta / verification blocker | Owner | Dependencies | Confidence |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| GAP-001 | EXEC-ENVELOPE-001; EXEC-ENVELOPE-002 | O-016 | CANONICAL_OWNER | Schema-valid common envelope and structured fields | MISSING | No productive schema, envelope, payload or validator found. | No productive EXEC assertions; prototype tests are non-authoritative. | `npm test` 20/20; prototype 92/92; neither proves EXEC. | OBSERVED: no productive envelope/schema validation. REQUIRED: identifiable schemas for envelope and payload with minimum fields. DELTA: productive contract boundary is absent. | EXEC-001 | None | HIGH |
| GAP-002 | EXEC-CONTRACT-001 | O-019 | CANONICAL_OWNER | Invalid JSON/schema fails closed | MISSING | No productive validator or canonical rejection result. | No productive negative witness. | Root/typecheck/prototype pass without this productive path. | OBSERVED: no productive `CONTRACT_INVALID` path. REQUIRED: fail-closed rejection with no success/checkpoint/approval/effect. DELTA: invalid-contract behavior is absent. | EXEC-001 | Schemas | HIGH |
| GAP-003 | EXEC-CONTRACT-002 | O-019 | CANONICAL_OWNER | Unknown/missing verdict fails closed | MISSING | No productive verdict registry or validator. | No productive verdict test. | Existing suites do not exercise productive EXEC verdicts. | OBSERVED: no productive `VERDICT_UNKNOWN` path. REQUIRED: unknown/absent verdict cannot become approval or success. DELTA: canonical verdict rejection is absent. | EXEC-001 | Registry, schemas | HIGH |
| GAP-004 | EXEC-VERSION-001; EXEC-VERSION-002 | O-017 | CANONICAL_OWNER | Semver semantics and explicit supported sets | MISSING | No productive registry, semver resolver or supported-set enforcement. | Prototype version-shaped values are non-authoritative; no productive semver test. | Prototype 92/92 and root 20/20 do not prove semver compatibility. | OBSERVED: no productive semver/support-set authority. REQUIRED: observable semver meaning and explicit support with `INCOMPATIBLE_CAPABILITY` for unsupported versions. DELTA: version authority and compatibility enforcement are absent. | EXEC-001 | Registry | HIGH |
| GAP-005 | EXEC-SNAPSHOT-001 | O-018 | CANONICAL_OWNER with DOM consumer boundary | CONTRADICTORY | `src/application/snapshot.ts:19-25,36-43,59-71` accepts caller `versions`; `src/domain/snapshot.ts:124-143` checks non-empty strings only; no EXEC registry observation is performed. | Existing snapshot tests are evidence of the consumer path, not of conformant EXEC authority. | Root 20/20 and prototype 92/92 pass; they do not prove authoritative version resolution. | OBSERVED: caller-supplied `versions` are copied into a productive DOM snapshot after only non-empty-string validation, so arbitrary values can establish canonical snapshot state. REQUIRED: exact versions come from the authoritative EXEC basis and are frozen with the DOM snapshot/manifest; caller values cannot establish that basis. DELTA: productive caller-authority bypass and missing authoritative binding coexist. | EXEC-001 semantic basis; DOM owns snapshot state | DOM snapshot/attempt authority | HIGH |
| GAP-006 | EXEC-REGISTRY-001 | O-020 | CANONICAL_OWNER | Deterministic versioned stage/capability registry | MISSING | No productive registry/catalog resolver or entry model. | No productive registry resolution test. | Existing suites do not execute a productive registry. | OBSERVED: no registry resolution path. REQUIRED: deterministic frozen-basis mapping of stage, capability, skill, versions, schemas, artifacts, verdicts and roles. DELTA: registry authority is absent. | EXEC-001 | DOM execution basis | HIGH |
| GAP-007 | EXEC-REGISTRY-004 | O-020 | CANONICAL_OWNER | Scoped entry identity, persistence, reconstruction and continuity | MISSING | No productive registry entry, catalog revision, persistence or semantic rehydration validator. | No productive identity/reconstruction witness. | Prototype is in-memory and cannot prove persistence/isolation. | OBSERVED: no productive `REGISTRY_ENTRY` state or reconstruction path. REQUIRED: immutable scoped NORMAL/BOOTSTRAP identity, repository binding, revision continuity, references and fail-closed invalid material. DELTA: registry identity/reconstruction authority is absent. | EXEC-001 | DOM `RepositoryId`; catalog source | HIGH |
| GAP-008 | EXEC-REGISTRY-002 | O-020 | CANONICAL_OWNER | Independent NORMAL and BOOTSTRAP catalogs | MISSING | No productive normal catalog, bootstrap catalog or independent source boundary. | No productive catalog separation test. | Prototype onboarding values are mock-only. | OBSERVED: no productive catalogs. REQUIRED: repository-scoped NORMAL and independently system-scoped BOOTSTRAP catalogs with separate source/version authority. DELTA: catalog authorities and separation are absent. | EXEC-001 | REPO configuration; DOM `RepositoryId` | HIGH |
| GAP-009 | EXEC-REGISTRY-003 | O-020 | CANONICAL_OWNER | Bootstrap allowlist and normal-capability rejection | MISSING | No productive bootstrap resolver or allowlist. | No productive bootstrap restriction test. | Root/prototype suites do not exercise it. | OBSERVED: no productive bootstrap gate. REQUIRED: only onboarding capabilities execute and normal capability requests fail `INCOMPATIBLE_CAPABILITY` before enablement/work. DELTA: allowlist and fail-closed boundary are absent. | EXEC-001 | Registry; REPO consumer | HIGH |
| GAP-010 | EXEC-CAPABILITY-001 | O-020 | CANONICAL_OWNER | Compatible capability resolution and canonical unknown/incompatible results | MISSING | No productive capability resolver or registered entry source. | No productive unknown/incompatible resolution tests. | Existing suites do not execute productive resolution. | OBSERVED: no productive capability resolution. REQUIRED: known compatible entry resolves and unknown/incompatible cases retain canonical codes. DELTA: capability resolution semantics are absent. | EXEC-001 | Registry | HIGH |
| GAP-011 | EXEC-CAPABILITY-002 | O-020 | CANONICAL_OWNER | Registry-only extensibility | MISSING | No productive registration/resolution authority for a synthetic capability. | No productive extensibility test. | Existing suites do not exercise authoritative registration. | OBSERVED: no productive registration authority. REQUIRED: schema-valid capability uses the common registry and frozen bases remain unchanged. DELTA: extensibility behavior is absent. | EXEC-001 | Registry and schema authority | HIGH |
| GAP-012 | EXEC-MANIFEST-001 | O-021 | CANONICAL_OWNER with DOM/PLAT boundary | MISSING | No productive manifest record, persistence or required-field validation. | No productive manifest assertions; prototype artifact is mock data. | Prototype 92/92 is non-authoritative; root suite has no manifest coverage. | OBSERVED: no productive complete manifest. REQUIRED: immutable manifest with required paths, hashes, commits, basis, dependencies, findings, round/attempt, config, workdir, schema, references and versions bound to DOM identities. DELTA: complete manifest contract is absent. | EXEC-001 semantic contract | DOM activity/attempt/cycle; PLAT persistence | HIGH |
| GAP-013 | EXEC-MANIFEST-002 | O-021 | CANONICAL_OWNER with EXEC-002/PLAT boundary | MISSING | No productive checkpoint declaration or resume-basis surface. | No productive checkpoint/recovery witness. | Prototype checkpoints are in-memory; root suite does not prove this contract. | OBSERVED: no productive checkpoint/resume contract. REQUIRED: safe checkpoint and basis are declared while context application and physical replay remain foreign owners. DELTA: declaration/boundary contract is absent. | EXEC-001 | EXEC-002 context; PLAT replay/persistence | HIGH |
| GAP-014 | EXEC-MANIFEST-004 | O-018/O-021 | CANONICAL_OWNER with DOM/PLAT boundary | MISSING | No productive manifest identity, digest, attachment validator or rehydration path. | No productive creation/reconstruction/retry identity tests. | Prototype is non-persistent and cannot prove this behavior. | OBSERVED: no productive manifest identity or rehydration. REQUIRED: one immutable manifest per DOM tuple with revision 1/digest, fail-closed detached/stale/corrupt material and new `AttemptId` on retry. DELTA: manifest identity/reconstruction/replay authority is absent. | EXEC-001 semantic contract | DOM identity/snapshot; PLAT integrity/recovery | HIGH |
| GAP-015 | EXEC-HISTORY-001 | O-021 | CANONICAL_OWNER with PLAT boundary | MISSING | No productive historical manifest/catalog replay path. | No productive history replay test. | Existing suites do not execute persisted historical replay. | OBSERVED: no productive original-basis replay. REQUIRED: historical identity, catalog, schema, versions, hashes, commits, results and checkpoints cannot be reinterpreted by the current registry. DELTA: historical preservation is absent. | EXEC-001 | Manifest/catalog basis; PLAT replay | HIGH |
| GAP-016 | EXEC-FAILURE-001 | O-019 | CANONICAL_OWNER with mapping boundaries | MISSING | No productive structured EXEC failure result or mapping contract. | No productive failure contract/mapping assertions. | Root/prototype suites do not exercise EXEC failures. | OBSERVED: no productive structured failure path. REQUIRED: code/family, contract/version/basis, cause and processing state preserve non-success meaning across mappings. DELTA: canonical failure emission/mapping contract is absent. | EXEC-001 | Schemas; BACKEND/OPS/UI mappings; PLAT/effect boundary | HIGH |
| GAP-017 | EXEC-MANIFEST-003 | O-018/O-021 | CANONICAL_OWNER with DOM consumer boundary | MISSING | No productive activity manifest, expected-schema freeze or exact-version manifest binding exists; this delta is separate from the productive snapshot contradiction in GAP-005. | No productive post-start mutation/freeze witness. | Root 20/20 and prototype 92/92 pass without productive manifest freeze execution. | OBSERVED: no productive started-manifest/schema/version immutability behavior. REQUIRED: started basis cannot mutate and a new basis uses a new attempt/identity. DELTA: manifest freeze/cutover contract is absent. | EXEC-001 semantic basis | DOM snapshot/attempt authority | HIGH |

`EXEC-SNAPSHOT-001` is the only contradictory requirement. The DOM consumer
is not promoted to EXEC authority; its behavior is an existing productive
bypass that the local EXEC contract must account for.

### 6.1 Requirement-level reconciliation

Each normative requirement has one explicit row with all matrix fields. Grouped
Gap records above are a compact delta index; these rows are the authoritative
requirement-to-Gap reconciliation.

| Gap ID | Requirement ID | Portfolio Obligation ID | Ownership Role | Requirement Summary | Classification | Implementation Evidence | Test Evidence | Exact Delta / Verification Blocker | Owner | Dependencies | Confidence |
|---|---|---|---|---|---|---|---|---|---|---|---|
| GAP-001 | EXEC-ENVELOPE-001 | O-016 | CANONICAL_OWNER | Common envelope and payload validate against identifiable schemas | MISSING | No productive schema/validator | No productive EXEC test; prototype-only tests | OBSERVED: no schema validation. REQUIRED: validatable envelope/payload. DELTA: boundary absent. | EXEC-001 | None | HIGH |
| GAP-001 | EXEC-ENVELOPE-002 | O-016 | CANONICAL_OWNER | Minimum execution/result fields are structured | MISSING | No productive envelope contract | No productive EXEC test | OBSERVED: no structured minimum fields. REQUIRED: all normative fields. DELTA: structured envelope content absent. | EXEC-001 | None | HIGH |
| GAP-004 | EXEC-VERSION-001 | O-017 | CANONICAL_OWNER | Semver major/minor/patch meaning is observable | MISSING | No productive semver authority | No productive semver test | OBSERVED: no productive version authority. REQUIRED: observable semantic version meaning. DELTA: version semantics absent. | EXEC-001 | Registry | HIGH |
| GAP-004 | EXEC-VERSION-002 | O-017 | CANONICAL_OWNER | Supported sets resolve without silent alias/conversion | MISSING | No productive support-set resolver | No productive compatibility test | OBSERVED: no support-set enforcement. REQUIRED: explicit support and incompatible rejection. DELTA: compatibility enforcement absent. | EXEC-001 | Registry | HIGH |
| GAP-005 | EXEC-SNAPSHOT-001 | O-018 | CANONICAL_OWNER with DOM consumer boundary | Exact versions are authoritative and frozen in DOM snapshot | CONTRADICTORY | Caller `versions` enters productive snapshot; only non-empty strings are checked | Snapshot tests witness consumer path, not EXEC authority | OBSERVED: caller values can establish snapshot basis. REQUIRED: authoritative EXEC basis. DELTA: caller-authority bypass. | EXEC-001 semantic basis; DOM snapshot owner | DOM snapshot/attempt | HIGH |
| GAP-002 | EXEC-CONTRACT-001 | O-019 | CANONICAL_OWNER | Invalid JSON/schema fails closed | MISSING | No productive validator/result | No productive negative witness | OBSERVED: no `CONTRACT_INVALID`. REQUIRED: fail-closed non-success. DELTA: rejection absent. | EXEC-001 | Schemas | HIGH |
| GAP-003 | EXEC-CONTRACT-002 | O-019 | CANONICAL_OWNER | Unknown/missing verdict fails closed | MISSING | No productive verdict validator | No productive verdict test | OBSERVED: no `VERDICT_UNKNOWN`. REQUIRED: no fallback approval. DELTA: verdict rejection absent. | EXEC-001 | Registry, schemas | HIGH |
| GAP-006 | EXEC-REGISTRY-001 | O-020 | CANONICAL_OWNER | Deterministic versioned stage/capability registry | MISSING | No productive registry/resolver | No productive registry test | OBSERVED: no registry resolution. REQUIRED: frozen-basis mapping. DELTA: registry authority absent. | EXEC-001 | DOM execution basis | HIGH |
| GAP-007 | EXEC-REGISTRY-004 | O-020 | CANONICAL_OWNER | Scoped identity, persistence, reconstruction and continuity | MISSING | No productive registry entry/rehydration | No productive identity witness | OBSERVED: no `REGISTRY_ENTRY`. REQUIRED: immutable scoped basis and rejection. DELTA: identity/reconstruction absent. | EXEC-001 | DOM `RepositoryId`; catalog source | HIGH |
| GAP-008 | EXEC-REGISTRY-002 | O-020 | CANONICAL_OWNER | NORMAL and BOOTSTRAP catalogs remain independent | MISSING | No productive catalogs | No productive separation test | OBSERVED: no catalogs. REQUIRED: separate repository/system scopes. DELTA: catalog boundaries absent. | EXEC-001 | REPO configuration; DOM `RepositoryId` | HIGH |
| GAP-009 | EXEC-REGISTRY-003 | O-020 | CANONICAL_OWNER | Bootstrap allowlist rejects normal capability | MISSING | No productive bootstrap gate | No productive bootstrap test | OBSERVED: no allowlist. REQUIRED: incompatible rejection before normal work. DELTA: bootstrap boundary absent. | EXEC-001 | Registry; REPO consumer | HIGH |
| GAP-010 | EXEC-CAPABILITY-001 | O-020 | CANONICAL_OWNER | Compatible capability resolution preserves canonical codes | MISSING | No productive capability resolver | No productive resolution test | OBSERVED: no resolution. REQUIRED: compatible/unknown/incompatible distinction. DELTA: resolution absent. | EXEC-001 | Registry | HIGH |
| GAP-011 | EXEC-CAPABILITY-002 | O-020 | CANONICAL_OWNER | Registry-only capability extensibility | MISSING | No productive registration authority | No productive extensibility test | OBSERVED: no registration path. REQUIRED: common registry and frozen bases. DELTA: extensibility absent. | EXEC-001 | Registry and schemas | HIGH |
| GAP-012 | EXEC-MANIFEST-001 | O-021 | CANONICAL_OWNER with DOM/PLAT boundary | Complete immutable activity-attempt manifest | MISSING | No productive manifest/persistence | No productive manifest test | OBSERVED: no complete manifest. REQUIRED: complete identity-bound manifest. DELTA: manifest contract absent. | EXEC-001 semantic contract | DOM tuple; PLAT persistence | HIGH |
| GAP-013 | EXEC-MANIFEST-002 | O-021 | CANONICAL_OWNER with EXEC-002/PLAT boundary | Safe checkpoint and resume basis declaration | MISSING | No productive checkpoint contract | No productive checkpoint test | OBSERVED: no checkpoint/resume contract. REQUIRED: declaration with foreign ownership preserved. DELTA: basis declaration absent. | EXEC-001 | EXEC-002 context; PLAT replay | HIGH |
| GAP-017 | EXEC-MANIFEST-003 | O-018/O-021 | CANONICAL_OWNER with DOM consumer boundary | Started manifest/schema/exact versions cannot mutate | MISSING | No productive manifest freeze | No productive post-start freeze test | OBSERVED: no started-manifest immutability. REQUIRED: new basis uses new attempt. DELTA: freeze/cutover absent. | EXEC-001 semantic basis | DOM snapshot/attempt | HIGH |
| GAP-014 | EXEC-MANIFEST-004 | O-018/O-021 | CANONICAL_OWNER with DOM/PLAT boundary | One immutable manifest per DOM tuple with validated reconstruction | MISSING | No productive manifest identity/rehydration | No productive reconstruction test | OBSERVED: no manifest reconstruction. REQUIRED: identity/attachment/digest validation. DELTA: reconstruction absent. | EXEC-001 semantic contract | DOM identity; PLAT integrity/recovery | HIGH |
| GAP-015 | EXEC-HISTORY-001 | O-021 | CANONICAL_OWNER with PLAT boundary | Historical replay preserves original basis | MISSING | No productive historical replay | No productive replay test | OBSERVED: no original-basis replay. REQUIRED: current registry cannot reinterpret history. DELTA: history preservation absent. | EXEC-001 | Manifest/catalog basis; PLAT replay | HIGH |
| GAP-016 | EXEC-FAILURE-001 | O-019 | CANONICAL_OWNER with mapping boundaries | Structured failure preserves meaning and non-success | MISSING | No productive failure envelope/mapping | No productive failure test | OBSERVED: no structured EXEC failure. REQUIRED: code/family/basis/cause/state and meaning-preserving mappings. DELTA: failure contract absent. | EXEC-001 | Schemas; BACKEND/OPS/UI mappings | HIGH |

## 7. Detailed Gap Records

Every active Gap ID has exactly one record below. `GAP-005` retains the prior
identity for the snapshot delta; `GAP-017` is the stable new identity required
to separate the independent manifest-freeze delta.

### GAP-001

- **Gap ID:** `GAP-001`
- **Affected Requirements:** `EXEC-ENVELOPE-001`, `EXEC-ENVELOPE-002`
- **Portfolio Obligations:** `O-016`
- **Gap Category:** `BEHAVIOR_MISSING`
- **Severity:** `MAJOR`
- **Normative Expectation:** Common envelope and capability payload are schema-identifiable, validatable and contain the structured minimum fields.
- **Current Repository Behavior:** No productive schema, envelope, payload or validator exists; prototype values are non-authoritative.
- **Repository Evidence:** No productive schema files/runtime under `src/`; prototype mock only.
- **Test Existence Evidence:** No productive EXEC contract test.
- **Test Execution Evidence:** `npm test` PASS 20/20; `npm run typecheck` PASS; `npm --prefix prototype test` PASS 92/92; none proves productive EXEC behavior.
- **Exact Delta:** OBSERVED: no productive envelope/schema validation. REQUIRED: schema-backed envelope and payload with all minimum fields. DELTA: productive contract boundary is absent.
- **Ownership Boundary:** EXEC-001 owns envelope/schema semantics; text, transport, UI and DOM cannot replace them.
- **Dependencies:** None for local contract definition.
- **Observed Repository Boundary:** No alternate EXEC authority found.
- **Acceptance Evidence Needed:** `AC-EXEC-001`, `AC-EXEC-002`, `C-EXEC-001`, `C-EXEC-002`.

### GAP-002

- **Gap ID:** `GAP-002`
- **Affected Requirements:** `EXEC-CONTRACT-001`
- **Portfolio Obligations:** `O-019`
- **Gap Category:** `BEHAVIOR_MISSING`
- **Severity:** `MAJOR`
- **Normative Expectation:** Invalid JSON/envelope/payload/schema produces structured `CONTRACT_INVALID` and no success, approval, checkpoint or effect implication.
- **Current Repository Behavior:** No productive validation/rejection path exists.
- **Repository Evidence:** No productive schema runtime or EXEC result surface.
- **Test Existence Evidence:** No productive negative witness.
- **Test Execution Evidence:** Root/typecheck/prototype passes have no productive EXEC rejection coverage.
- **Exact Delta:** OBSERVED: no productive `CONTRACT_INVALID` path. REQUIRED: fail-closed invalid-contract result with no success/effect. DELTA: canonical rejection behavior is absent.
- **Ownership Boundary:** EXEC-001 owns semantic failure; BACKEND/OPS/UI only map it.
- **Dependencies:** Productive schemas.
- **Observed Repository Boundary:** No alternate success authority found.
- **Acceptance Evidence Needed:** `AC-EXEC-006`, `C-EXEC-008`, `C-EXEC-020`.

### GAP-003

- **Gap ID:** `GAP-003`
- **Affected Requirements:** `EXEC-CONTRACT-002`
- **Portfolio Obligations:** `O-019`
- **Gap Category:** `BEHAVIOR_MISSING`
- **Severity:** `MAJOR`
- **Normative Expectation:** Absent/unknown/unrecognized verdict produces `VERDICT_UNKNOWN`, never fallback approval.
- **Current Repository Behavior:** No productive verdict registry or contract-result validator exists.
- **Repository Evidence:** No productive EXEC verdict surface; DOM verdict behavior is foreign.
- **Test Existence Evidence:** No productive verdict test.
- **Test Execution Evidence:** Root and prototype suites do not execute productive EXEC verdict validation.
- **Exact Delta:** OBSERVED: no productive `VERDICT_UNKNOWN` path. REQUIRED: unknown verdict cannot become approval/success. DELTA: canonical verdict validation is absent.
- **Ownership Boundary:** EXEC-001 owns contract verdict validity; DOM owns lifecycle verdict semantics.
- **Dependencies:** Registry and schemas.
- **Observed Repository Boundary:** No text fallback or projection authority found.
- **Acceptance Evidence Needed:** `AC-EXEC-007`, `C-EXEC-009`.

### GAP-004

- **Gap ID:** `GAP-004`
- **Affected Requirements:** `EXEC-VERSION-001`, `EXEC-VERSION-002`
- **Portfolio Obligations:** `O-017`
- **Gap Category:** `BEHAVIOR_MISSING`
- **Severity:** `MAJOR`
- **Normative Expectation:** Semver meaning and explicit supported sets are observable; unsupported capability versions fail `INCOMPATIBLE_CAPABILITY` without alias/conversion.
- **Current Repository Behavior:** No productive version authority, registry or support-set resolver exists.
- **Repository Evidence:** No productive registry/semver resolver under `src/`; mock version fields are prototype-only.
- **Test Existence Evidence:** No productive semver compatibility test.
- **Test Execution Evidence:** Prototype 92/92 and root 20/20 pass without productive semver compatibility.
- **Exact Delta:** OBSERVED: no productive semver/support-set authority. REQUIRED: observable major/minor/patch semantics and explicit support/rejection. DELTA: version authority and compatibility enforcement are absent.
- **Ownership Boundary:** EXEC-001 owns semver/support compatibility; consumers cannot approximate versions.
- **Dependencies:** Registry.
- **Observed Repository Boundary:** The DOM caller-version consumer is recorded in GAP-005 and is not a second version authority.
- **Acceptance Evidence Needed:** `AC-EXEC-003`, `AC-EXEC-004`, `C-EXEC-003`, `C-EXEC-010`.

### GAP-005

- **Gap ID:** `GAP-005`
- **Affected Requirements:** `EXEC-SNAPSHOT-001`
- **Portfolio Obligations:** `O-018`
- **Gap Category:** `BEHAVIOR_CONTRADICTORY`
- **Severity:** `MAJOR`
- **Normative Expectation:** Exact EXEC versions are obtained from authoritative registry/basis and bound to the immutable DOM snapshot; caller input cannot establish canonical basis.
- **Current Repository Behavior:** `SubmitManualExecutionCommand.versions` is caller input in `src/application/snapshot.ts:36-43`; `handle` stores it through `mapExecExactVersionMetadata` at `:59-71`. `ExactVersionSet.create` at `src/domain/snapshot.ts:124-143` checks only non-empty strings. No EXEC registry observation, semver validation or supported-set proof occurs.
- **Repository Evidence:** `src/application/snapshot.ts:19-25,36-43,59-71`; `src/domain/snapshot.ts:124-143`.
- **Test Existence Evidence:** Existing snapshot tests witness the productive consumer path but do not prove canonical EXEC authority.
- **Test Execution Evidence:** Root 20/20 and prototype 92/92 pass; no productive authoritative-version witness.
- **Exact Delta:** OBSERVED: arbitrary caller-selected version strings can be copied into a productive snapshot and mutate canonical snapshot state. REQUIRED: authoritative EXEC basis supplies exact versions and caller values cannot establish it. DELTA: a caller-supplied canonical authority bypass exists in the productive snapshot consumer.
- **Ownership Boundary:** EXEC-001 owns the contract/version basis; DOM owns snapshot identity/state. This record does not assign DOM implementation to EXEC and does not prescribe code movement.
- **Dependencies:** DOM snapshot/attempt authority.
- **LOCAL_OBLIGATION:** Supply/validate the exact EXEC contract and skill basis and bind it to the DOM snapshot/manifest.
- **FOREIGN_OBLIGATION:** DOM snapshot identity, immutability and lifecycle.
- **FOREIGN_OWNER:** `SPEC-DOM-001`.
- **LOCAL_INTEGRATION_EXPECTATION:** Bind authoritative EXEC versions to the exact DOM snapshot and manifest; reject caller-established basis while preserving DOM ownership.
- **Observed Repository Boundary:** Productive DOM snapshot path is an existing consumer/bypass, not an EXEC canonical registry.
- **Acceptance Evidence Needed:** `AC-EXEC-005`, `C-EXEC-005`, `C-EXEC-012`, `C-EXEC-016`.

### GAP-006

- **Gap ID:** `GAP-006`
- **Affected Requirements:** `EXEC-REGISTRY-001`
- **Portfolio Obligations:** `O-020`
- **Gap Category:** `BEHAVIOR_MISSING`
- **Severity:** `MAJOR`
- **Normative Expectation:** Frozen-basis registry deterministically maps stage, capability, skill, versions, schemas, artifacts, verdicts and roles.
- **Current Repository Behavior:** No productive registry/catalog resolver or entry model exists.
- **Repository Evidence:** No productive registry/catalog implementation found.
- **Test Existence Evidence:** No productive registry resolution test; prototype catalog-shaped data is non-authoritative.
- **Test Execution Evidence:** Existing suites do not execute a productive registry.
- **Exact Delta:** OBSERVED: no registry resolution path. REQUIRED: deterministic frozen-basis mapping. DELTA: registry authority is absent.
- **Ownership Boundary:** EXEC-001 is canonical owner; REPO provides normal configuration only.
- **Dependencies:** DOM execution basis.
- **Observed Repository Boundary:** No alternate registry authority found.
- **Acceptance Evidence Needed:** `AC-EXEC-008`, `C-EXEC-004`.

### GAP-007

- **Gap ID:** `GAP-007`
- **Affected Requirements:** `EXEC-REGISTRY-004`
- **Portfolio Obligations:** `O-020`
- **Gap Category:** `BEHAVIOR_MISSING`
- **Severity:** `MAJOR`
- **Normative Expectation:** Scoped `REGISTRY_ENTRY` identity, persistence, reconstruction, continuity and fail-closed invalid-material behavior are deterministic.
- **Current Repository Behavior:** No productive registry entry, catalog revision, persistence or semantic rehydration validator exists.
- **Repository Evidence:** No productive registry/schema/persistence surface; prototype is in-memory.
- **Test Existence Evidence:** No productive identity/reconstruction witness.
- **Test Execution Evidence:** Prototype 92/92 cannot prove persistence or cross-repository isolation.
- **Exact Delta:** OBSERVED: no productive registry state/reconstruction. REQUIRED: immutable NORMAL/BOOTSTRAP scoped identity, repository binding, revision continuity, references and rejection. DELTA: registry identity/reconstruction authority is absent.
- **Ownership Boundary:** EXEC-001 validates semantic registry material; DOM supplies canonical NORMAL `RepositoryId`; PLAT supplies physical material only.
- **LOCAL_OBLIGATION:** Validate and reconstruct the EXEC registry entry/catalog basis, including scoped identity, references, revision continuity and fail-closed semantic outcomes.
- **FOREIGN_OBLIGATION:** Provide and resolve canonical NORMAL `RepositoryId` identity; provide physical persistence/integrity material without defining registry meaning.
- **FOREIGN_OWNER:** `SPEC-DOM-001` for `RepositoryId`; `SPEC-PLAT-001` for physical material.
- **LOCAL_INTEGRATION_EXPECTATION:** Bind the complete registry key and frozen catalog basis to the DOM repository identity and validate foreign physical material before semantic rehydration; keep foreign identity/storage work outside EXEC scope.
- **Dependencies:** DOM `RepositoryId`; authorized catalog source and physical persistence.
- **Observed Repository Boundary:** No wrong-owner registry implementation found; the foreign identity and physical material boundaries remain outside EXEC scope.
- **Acceptance Evidence Needed:** `AC-EXEC-019`, `C-EXEC-018`, `C-EXEC-020`.

### GAP-008

- **Gap ID:** `GAP-008`
- **Affected Requirements:** `EXEC-REGISTRY-002`
- **Portfolio Obligations:** `O-020`
- **Gap Category:** `BEHAVIOR_MISSING`
- **Severity:** `MAJOR`
- **Normative Expectation:** NORMAL repository catalog and independent BOOTSTRAP system catalog have separate source, scope and version authority.
- **Current Repository Behavior:** Neither productive catalog exists.
- **Repository Evidence:** No productive registry/catalog files or runtime found.
- **Test Existence Evidence:** Prototype onboarding/catalog fields are scenario data only.
- **Test Execution Evidence:** Prototype 92/92; no productive normal/bootstrap test.
- **Exact Delta:** OBSERVED: no productive catalogs. REQUIRED: repository-scoped NORMAL and independent system-scoped BOOTSTRAP catalogs with no aliasing. DELTA: catalog authorities and separation are absent.
- **Ownership Boundary:** EXEC-001 owns semantic separation; REPO owns configuration/enablement.
- **Dependencies:** REPO configuration source; DOM `RepositoryId` for NORMAL.
- **Observed Repository Boundary:** No dual catalog contradiction exists because no productive catalog exists.
- **Acceptance Evidence Needed:** `AC-EXEC-009`, `C-EXEC-005`.

### GAP-009

- **Gap ID:** `GAP-009`
- **Affected Requirements:** `EXEC-REGISTRY-003`
- **Portfolio Obligations:** `O-020`
- **Gap Category:** `BEHAVIOR_MISSING`
- **Severity:** `MAJOR`
- **Normative Expectation:** Bootstrap allowlist rejects normal capabilities with `INCOMPATIBLE_CAPABILITY` before enablement/work.
- **Current Repository Behavior:** No productive bootstrap resolver or allowlist exists.
- **Repository Evidence:** No productive onboarding/registry runtime found.
- **Test Existence Evidence:** No productive bootstrap restriction test.
- **Test Execution Evidence:** Existing suites do not exercise bootstrap enforcement.
- **Exact Delta:** OBSERVED: no productive bootstrap gate. REQUIRED: only onboarding capabilities execute and normal capability is rejected. DELTA: allowlist and fail-closed boundary are absent.
- **Ownership Boundary:** EXEC-001 owns catalog semantics; REPO owns enablement/onboarding state.
- **Dependencies:** Registry; REPO enablement consumer.
- **Observed Repository Boundary:** No bypass or premature enablement path observed.
- **Acceptance Evidence Needed:** `AC-EXEC-010`, `C-EXEC-011`.

### GAP-010

- **Gap ID:** `GAP-010`
- **Affected Requirements:** `EXEC-CAPABILITY-001`
- **Portfolio Obligations:** `O-020`
- **Gap Category:** `BEHAVIOR_MISSING`
- **Severity:** `MAJOR`
- **Normative Expectation:** Known compatible capability resolves; unknown and incompatible cases preserve `UNKNOWN_CAPABILITY` and `INCOMPATIBLE_CAPABILITY`.
- **Current Repository Behavior:** No productive capability resolver exists.
- **Repository Evidence:** No productive capability implementation under `src/`.
- **Test Existence Evidence:** No productive resolution tests.
- **Test Execution Evidence:** Existing suites do not execute productive resolution.
- **Exact Delta:** OBSERVED: no productive capability resolution. REQUIRED: compatible resolution and canonical distinction. DELTA: resolution semantics are absent.
- **Ownership Boundary:** EXEC-001 owns resolution; EXEC-002/REPO/BACKEND consume it.
- **Dependencies:** Registry.
- **Observed Repository Boundary:** Generic delegation runtime is not a capability registry.
- **Acceptance Evidence Needed:** `AC-EXEC-011`, `C-EXEC-010`.

### GAP-011

- **Gap ID:** `GAP-011`
- **Affected Requirements:** `EXEC-CAPABILITY-002`
- **Portfolio Obligations:** `O-020`
- **Gap Category:** `BEHAVIOR_MISSING`
- **Severity:** `MAJOR`
- **Normative Expectation:** Schema-valid synthetic capability uses common registry path and does not mutate frozen bases.
- **Current Repository Behavior:** No productive registration/resolution authority exists.
- **Repository Evidence:** No productive registry or extension authority found.
- **Test Existence Evidence:** No productive extensibility test.
- **Test Execution Evidence:** Existing suites do not execute authoritative registration.
- **Exact Delta:** OBSERVED: no productive registration authority. REQUIRED: common registry extensibility with frozen-basis preservation. DELTA: extensibility behavior is absent.
- **Ownership Boundary:** EXEC-001 owns the single extensibility authority; consumers cannot add category tables.
- **Dependencies:** Registry and schema authority.
- **Observed Repository Boundary:** No category-specific bypass found.
- **Acceptance Evidence Needed:** `AC-EXEC-012`, `C-EXEC-006`.

### GAP-012

- **Gap ID:** `GAP-012`
- **Affected Requirements:** `EXEC-MANIFEST-001`
- **Portfolio Obligations:** `O-021`
- **Gap Category:** `BEHAVIOR_MISSING`
- **Severity:** `MAJOR`
- **Normative Expectation:** Complete immutable activity-attempt manifest contains required paths, hashes, commits, basis, dependencies, findings, round/attempt, config, workdir, schema, references and exact versions bound to DOM identities.
- **Current Repository Behavior:** No productive manifest record, persistence or required-field validation exists.
- **Repository Evidence:** Prototype `execution-manifest.json` is mock state only; no productive manifest surface.
- **Test Existence Evidence:** No productive manifest completeness/immutability assertions.
- **Test Execution Evidence:** Prototype 92/92 is non-authoritative; root tests have no manifest contract coverage.
- **LOCAL_OBLIGATION:** Manifest semantic fields and contract completeness.
- **FOREIGN_OBLIGATION:** DOM identity/attachment and PLAT physical durability.
- **FOREIGN_OWNER:** `SPEC-DOM-001` / `SPEC-PLAT-001`.
- **LOCAL_INTEGRATION_EXPECTATION:** Bind complete manifest to the DOM activity/attempt/cycle tuple and expose foreign durability boundary without absorbing it.
- **Exact Delta:** OBSERVED: no productive complete manifest. REQUIRED: immutable complete manifest bound to DOM identities and exact references. DELTA: complete manifest contract is absent.
- **Ownership Boundary:** EXEC-001 owns manifest meaning; DOM owns referenced identities; PLAT owns physical persistence.
- **Dependencies:** DOM activity/attempt/cycle identity; PLAT persistence.
- **Observed Repository Boundary:** No alternate manifest authority found.
- **Acceptance Evidence Needed:** `AC-EXEC-013`, `C-EXEC-007`.

### GAP-013

- **Gap ID:** `GAP-013`
- **Affected Requirements:** `EXEC-MANIFEST-002`
- **Portfolio Obligations:** `O-021`
- **Gap Category:** `BEHAVIOR_MISSING`
- **Severity:** `MAJOR`
- **Normative Expectation:** Safe checkpoints and resume basis are declared while context application and physical replay remain their approved owners.
- **Current Repository Behavior:** No productive checkpoint/resume contract exists.
- **Repository Evidence:** Checkpoint-shaped fields occur only in prototype mock data.
- **Test Existence Evidence:** No productive checkpoint declaration/delegation test.
- **Test Execution Evidence:** Existing suites do not execute productive checkpoint behavior.
- **LOCAL_OBLIGATION:** Declare safe checkpoints and resumable basis.
- **FOREIGN_OBLIGATION:** Apply context between sessions and perform physical persistence/replay.
- **FOREIGN_OWNER:** `SPEC-EXEC-002` / `SPEC-PLAT-001`.
- **LOCAL_INTEGRATION_EXPECTATION:** Expose a basis consumable by EXEC-002 and PLAT without assigning their work to EXEC-001.
- **Exact Delta:** OBSERVED: no productive checkpoint/resume contract. REQUIRED: declaration and owner-preserving handoff. DELTA: checkpoint/basis behavior is absent.
- **Ownership Boundary:** EXEC-001 declares contract basis; EXEC-002 applies context; PLAT handles physical replay.
- **Dependencies:** EXEC-002 context application; PLAT replay/persistence.
- **Observed Repository Boundary:** No EXEC recovery authority or text-session substitute found.
- **Acceptance Evidence Needed:** `AC-EXEC-014`, `C-EXEC-017`.

### GAP-014

- **Gap ID:** `GAP-014`
- **Affected Requirements:** `EXEC-MANIFEST-004`
- **Portfolio Obligations:** `O-018`, `O-021`
- **Gap Category:** `BEHAVIOR_MISSING`
- **Severity:** `MAJOR`
- **Normative Expectation:** One immutable `ACTIVITY_ATTEMPT_MANIFEST` per DOM tuple is created and semantically rehydrated only after identity, attachment, basis, revision, digest and cardinality validation.
- **Current Repository Behavior:** No productive manifest identity, digest, attachment validator or rehydration path exists.
- **Repository Evidence:** No productive manifest persistence/replay surface; prototype is non-persistent.
- **Test Existence Evidence:** No productive creation/reconstruction/retry identity tests.
- **Test Execution Evidence:** Prototype 92/92 cannot prove persistent reconstruction.
- **LOCAL_OBLIGATION:** Semantic manifest identity, attachment, reconstruction and original-basis validation.
- **FOREIGN_OBLIGATION:** DOM identity resolution and PLAT physical integrity/recovery.
- **FOREIGN_OWNER:** `SPEC-DOM-001` / `SPEC-PLAT-001`.
- **LOCAL_INTEGRATION_EXPECTATION:** Validate semantic attachment after foreign identity/material evidence, without owning physical recovery.
- **Exact Delta:** OBSERVED: no productive manifest identity or rehydration. REQUIRED: exactly one immutable validated manifest per DOM tuple and new attempt on retry. DELTA: manifest identity/reconstruction authority is absent.
- **Ownership Boundary:** EXEC-001 validates semantic manifest material; DOM resolves identities; PLAT supplies physical evidence.
- **Dependencies:** DOM identity/snapshot; PLAT physical integrity/recovery.
- **Observed Repository Boundary:** No competing `ManifestId` or alias authority found.
- **Acceptance Evidence Needed:** `AC-EXEC-019`, `C-EXEC-019`, `C-EXEC-020`.

### GAP-015

- **Gap ID:** `GAP-015`
- **Affected Requirements:** `EXEC-HISTORY-001`
- **Portfolio Obligations:** `O-021`
- **Gap Category:** `BEHAVIOR_MISSING`
- **Severity:** `MAJOR`
- **Normative Expectation:** Historical replay preserves original repository/catalog identity, schemas, versions, hashes, commits, results and checkpoints.
- **Current Repository Behavior:** No productive historical manifest/catalog replay exists.
- **Repository Evidence:** No productive manifest/catalog persistence or replay code; prototype is transient.
- **Test Existence Evidence:** No productive history replay test.
- **Test Execution Evidence:** Existing suites do not execute productive historical replay.
- **LOCAL_OBLIGATION:** Preserve original EXEC interpretation and frozen basis.
- **FOREIGN_OBLIGATION:** Physically persist/replay historical material.
- **FOREIGN_OWNER:** `SPEC-PLAT-001`.
- **LOCAL_INTEGRATION_EXPECTATION:** Prevent current registry reinterpretation while consuming PLAT replay material.
- **Exact Delta:** OBSERVED: no productive original-basis replay. REQUIRED: historical basis cannot be reinterpreted by current/foreign registry. DELTA: historical preservation is absent.
- **Ownership Boundary:** EXEC-001 owns contractual historical interpretation; PLAT owns physical replay.
- **Dependencies:** Manifest/catalog basis; PLAT replay.
- **Observed Repository Boundary:** No current-registry replay bypass found because no productive replay exists.
- **Acceptance Evidence Needed:** `AC-EXEC-016`, `C-EXEC-016`.

### GAP-016

- **Gap ID:** `GAP-016`
- **Affected Requirements:** `EXEC-FAILURE-001`
- **Portfolio Obligations:** `O-019`
- **Gap Category:** `BEHAVIOR_MISSING`
- **Severity:** `MAJOR`
- **Normative Expectation:** Failures carry structured code/family, contract/version/basis, cause and processing state; mappings preserve non-success meaning.
- **Current Repository Behavior:** No productive EXEC failure result or integrated consumer mapping exists.
- **Repository Evidence:** No productive EXEC failure modules; DOM rejection/state behavior is foreign.
- **Test Existence Evidence:** No productive failure contract or mapping assertions.
- **Test Execution Evidence:** Root 20/20 and prototype 92/92 pass without productive EXEC failure coverage.
- **LOCAL_OBLIGATION:** Canonical failure meaning and structured result.
- **FOREIGN_OBLIGATION:** Transport, logging and UI mapping; effect confirmation remains foreign.
- **FOREIGN_OWNER:** BACKEND, OPS, UI and PLAT/effect owners as applicable.
- **LOCAL_INTEGRATION_EXPECTATION:** Preserve code, state, retryability and non-success meaning in downstream mappings.
- **Exact Delta:** OBSERVED: no productive structured failure path. REQUIRED: canonical structured failure and meaning-preserving mappings. DELTA: failure emission/mapping contract is absent.
- **Ownership Boundary:** EXEC-001 owns failure meaning; downstream components only map/project.
- **Dependencies:** Schemas; BACKEND/OPS/UI mappings; PLAT/effect boundary.
- **Observed Repository Boundary:** No mapping that changes failure meaning was observed.
- **Acceptance Evidence Needed:** `AC-EXEC-017`, `AC-EXEC-018`, `C-EXEC-014`.

### GAP-017

- **Gap ID:** `GAP-017`
- **Affected Requirements:** `EXEC-MANIFEST-003`
- **Portfolio Obligations:** `O-018`, `O-021`
- **Gap Category:** `BEHAVIOR_MISSING`
- **Severity:** `MAJOR`
- **Normative Expectation:** Started manifest, expected schema and exact versions are immutable; a new basis requires a new attempt/identity.
- **Current Repository Behavior:** No productive activity manifest, expected-schema freeze or exact-version manifest binding exists. The productive DOM snapshot caller-basis contradiction is separately recorded in GAP-005.
- **Repository Evidence:** No productive manifest surface; existing DOM snapshot code does not establish a started manifest.
- **Test Existence Evidence:** No productive post-start mutation/freeze test.
- **Test Execution Evidence:** Root 20/20 and prototype 92/92 pass without productive manifest freeze execution.
- **Exact Delta:** OBSERVED: no productive started-manifest/schema/version immutability. REQUIRED: started basis cannot mutate and a changed basis uses a new attempt/identity. DELTA: independent manifest freeze/cutover contract is absent.
- **Ownership Boundary:** EXEC-001 owns contractual basis immutability; DOM owns snapshot/attempt identity.
- **Dependencies:** DOM snapshot/attempt authority.
- **LOCAL_OBLIGATION:** Protect the schema/version/manifest contract basis across start and new-attempt cutover.
- **FOREIGN_OBLIGATION:** DOM snapshot and attempt identity/lifecycle.
- **FOREIGN_OWNER:** `SPEC-DOM-001`.
- **LOCAL_INTEGRATION_EXPECTATION:** Preserve the same authoritative basis across start and cutover without mutating DOM-owned identity or absorbing foreign lifecycle work.
- **Observed Repository Boundary:** No productive manifest path exists to compete with the DOM consumer.
- **Acceptance Evidence Needed:** `AC-EXEC-005`, `AC-EXEC-015`, `C-EXEC-012`, `C-EXEC-016`.

## 8. Mixed Ownership Reconciliation

The following eight requirements have both a local EXEC obligation and an
approved foreign boundary. Foreign implementation remains outside local Gap
scope.

| Requirement | LOCAL_OBLIGATION | FOREIGN_OBLIGATION | FOREIGN_OWNER | LOCAL_INTEGRATION_EXPECTATION |
|---|---|---|---|---|
| `EXEC-SNAPSHOT-001` | Supply/validate exact EXEC contract and skill basis. | DOM snapshot identity, immutability and lifecycle. | `SPEC-DOM-001` | Bind authoritative EXEC versions to the exact DOM snapshot and manifest; caller values cannot establish the basis. |
| `EXEC-REGISTRY-004` | Validate and reconstruct the EXEC registry entry/catalog basis, including scoped identity, references, revision continuity and fail-closed semantic outcomes. | Provide and resolve canonical NORMAL `RepositoryId` identity; provide physical persistence/integrity material without defining registry meaning. | `SPEC-DOM-001` for `RepositoryId`; `SPEC-PLAT-001` for physical material. | Bind the complete registry key and frozen catalog basis to the DOM repository identity and validate foreign physical material before semantic rehydration; keep foreign identity/storage work outside EXEC scope. |
| `EXEC-MANIFEST-001` | Manifest semantic fields and contract completeness. | DOM identities/attachment and PLAT durability. | `SPEC-DOM-001` / `SPEC-PLAT-001` | Bind complete manifest to DOM tuple and durable boundary without absorbing physical persistence. |
| `EXEC-MANIFEST-002` | Safe checkpoint declaration and resume basis. | EXEC-002 context application and PLAT physical replay. | `SPEC-EXEC-002` / `SPEC-PLAT-001` | Expose a consumable basis while preserving application/replay ownership. |
| `EXEC-MANIFEST-003` | Protect schema/version/manifest contract basis. | DOM snapshot and attempt identity. | `SPEC-DOM-001` | Preserve the same basis across start and new-attempt cutover. |
| `EXEC-MANIFEST-004` | Semantic identity, attachment, reconstruction and fail-closed validation. | DOM identity resolution and PLAT physical integrity/recovery. | `SPEC-DOM-001` / `SPEC-PLAT-001` | Validate semantic attachment and physical material without owning foreign work. |
| `EXEC-HISTORY-001` | Preserve original EXEC interpretation. | Physical historical replay. | `SPEC-PLAT-001` | Prevent current registry reinterpretation of the original basis. |
| `EXEC-FAILURE-001` | Canonical failure meaning and structured result. | Transport/log/UI mappings and effect confirmation boundaries. | BACKEND / OPS / UI / PLAT/effect owners | Preserve code, state, retryability and non-success meaning in mappings. |

```text
MIXED_OWNERSHIP_REQUIREMENTS = 8
UNRESOLVED_OWNERSHIP = 0
```

## 9. Cross-SPEC Dependency and Capability Proof

The approved normative edge remains exactly `SPEC-EXEC-001 → SPEC-DOM-001`.
The capability record is corrected into independent authority, contract,
semantic, local-testability and productive-availability dimensions. The
producer contract is defined but not productively available; this is an
integrated-proof condition, not a local EXEC gap or downstream promotion.

| Dependency SPEC | Portfolio role | Foreign ownership | Local obligation | Repository integration | Foreign implementation state | CAPABILITY_ID | AUTHORITY_OWNER | PRODUCER | CONSUMER | CONTRACT | SEMANTIC_STATUS | AUTHORITY_STATUS | CONTRACT_STATUS | LOCAL_TESTABILITY | PRODUCTIVE_AVAILABILITY | AVAILABILITY_EVIDENCE | BLOCKING_EFFECT | DEPENDENCY_CLASS | Result |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `SPEC-DOM-001` rev 4 | Approved normative upstream | DOM supplies identity/snapshot/lifecycle | EXEC consumes `RepositoryId`, DOM IDs and exact snapshot basis; EXEC validates its own contract semantics | Productive DOM snapshot consumer exists; no integrated EXEC producer/consumer contract runtime exists | Conformant contract defined; productive producer/runtime unavailable at baseline | `DOM-EXEC-IDENTITY-SNAPSHOT` | DOM-001 | DOM canonical contract/resolver | EXEC-001 | `DOM-ID-001`, `DOM-SNAPSHOT-001`, `DOM-LIFE-001` | DEFINED | DEFINED | DEFINED | NO | NO | Conformant DOM SPEC/audit; no productive integrated producer/runtime at pinned HEAD | Integrated proof only; does not block local gap classification or local planning | `REQUIRED_FOR_INTEGRATED_PROOF` | PARTIAL |

### Authority-consumption proof

```text
CAPABILITY_ID = DOM-EXEC-IDENTITY-SNAPSHOT
AUTHORITY_EXISTENCE = YES; SPEC-DOM-001 rev 4 and conformant audit
TRUTH_OWNER = SPEC-DOM-001
AUTHORITY_SEMANTIC_SOURCE = DOM-ID-001, DOM-SNAPSHOT-001, DOM-LIFE-001
OWNER_DOMAIN_OR_BOUNDED_CONTEXT = workflow domain
CONSUMPTION_CONTRACT = EXEC-001 §§10, 12, 13 and EXEC-MANIFEST-004/EXEC-REGISTRY-004
PORT_INTERFACE_QUERY_RESOLVER_OR_READER = canonical DOM identity/snapshot resolver
CONTRACT_PRODUCER = DOM-001 canonical contract/resolver
CONTRACT_CONSUMER = EXEC-001
RETURNED_DATA = RepositoryId, ExecutionId, ActivityId, AttemptId, ArtifactCycleId, snapshot and exact-basis references
VERSION_REVISION_TRANSPORT = DOM identity revisions and frozen snapshot/catalog basis references
FAILURE_NOT_FOUND_STALE_SEMANTICS = unknown, detached, stale, corrupt or mismatched attachment fails closed; no mutation
AUTHORITY_STATUS = DEFINED
CONTRACT_STATUS = DEFINED
SEMANTIC_STATUS = DEFINED
LOCAL_TESTABILITY = NO
PRODUCTIVE_AVAILABILITY = NO
CAPABILITY_SUMMARY_STATUS = CONTRACT_DEFINED
DEPENDENCY_CLASS = REQUIRED_FOR_INTEGRATED_PROOF
AVAILABILITY_EVIDENCE = conformant DOM rev 4/audit; no productive integrated runtime
BLOCKING_EFFECT = integrated proof only; local closure/planning is not blocked by availability
AUTHORITY_CONSUMPTION_RESULT = AUTHORITY_CONSUMPTION_GAP (contract defined, producer not productively available)
PRODUCER_CONSUMER_CONTRACT_PROOF_RESULT = AUTHORITY_CONSUMPTION_GAP
PROOF_EVIDENCE = SPEC-DOM-001 §§10.1, 12-13 and audit §§21-23; SPEC-EXEC-001 §§10, 12-13
```

### Producer/consumer contract proof

| CAPABILITY_ID | AUTHORITY_OWNER | PRODUCER | PRODUCED_CONTRACT | CONSUMER | SEMANTIC_STATUS | AUTHORITY_STATUS | CONTRACT_STATUS | LOCAL_TESTABILITY | PRODUCTIVE_AVAILABILITY | CAPABILITY_SUMMARY_STATUS | AVAILABILITY_EVIDENCE | AVAILABILITY_CONDITION | DEPENDENCY_CLASS | DEPENDENCY_EDGE | BLOCKING_EFFECT | PROOF_EVIDENCE |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `DOM-EXEC-IDENTITY-SNAPSHOT` | DOM-001 | DOM canonical contract/resolver | `RepositoryId`, DOM identity, snapshot and lifecycle references | EXEC-001 | DEFINED | DEFINED | DEFINED | NO | NO | CONTRACT_DEFINED | DOM rev 4 conformant audit; no integrated producer/runtime | Available only when productive producer/integration evidence exists | REQUIRED_FOR_INTEGRATED_PROOF | `EXEC-001 → DOM-001` | Integrated proof only; no local gap promotion; proof result `AUTHORITY_CONSUMPTION_GAP` | Target §§10, 12-13; DOM audit §§21-23 |

```text
CAPABILITY_AVAILABILITY_RECORDS = 1
CAPABILITY_AVAILABILITY_CLASSIFICATION_ERRORS = 0
DOWNSTREAM_PROMOTION_WITHOUT_NEW_EVIDENCE = 0
READY_CLAIMS_WITH_UNAVAILABLE_CONTRACT = 0
```

## 10. Failure Ownership Reconciliation

| Failure | Approved semantic owner | Component role | Repository implementation | Result |
|---|---|---|---|---|
| `UNKNOWN_CAPABILITY` | EXEC-001 | Canonical owner | None found | MISSING |
| `INCOMPATIBLE_CAPABILITY` | EXEC-001 | Canonical owner | None found | MISSING |
| `CONTRACT_INVALID` | EXEC-001 | Canonical owner | None found | MISSING |
| `VERDICT_UNKNOWN` | EXEC-001 | Canonical owner | None found | MISSING |
| Invalid registry/manifest basis | EXEC-001 semantic meaning; PLAT physical evidence | Canonical owner with foreign physical boundary | None found | MISSING |

No wrong failure owner, mapping redefinition or alternate failure authority was
found. `FAILURE_OWNER_ERRORS = 0`.

## 11. Compatibility / Cutover Reconciliation

| Concern | Approved role | Matrix treatment |
|---|---|---|
| `NEW_CANONICAL_PATH` | EXEC-001 OWNER | Local missing canonical schemas, registry, manifest and failure behavior remain in local gaps. |
| `LEGACY_COMPATIBILITY` | CONSUMER of REPO-001 | No local second authority or legacy bypass observed. |
| `HISTORICAL_REPLAY` | EXEC-001 OWNER | `GAP-015` records missing original-basis replay; PLAT work remains foreign. |
| `CUTOVER` | EXEC-001 OWNER | `GAP-017` records missing manifest/schema/version freeze; new basis requires new attempt/identity. |
| `RETIREMENT` | NOT_APPLICABLE | No independent retirement obligation assigned by ADR-0003. |

`COMPATIBILITY_OWNER_ERRORS = 0`; no dual canonical path, legacy bypass or
wrong compatibility owner was found.

## 12. Dependency Direction and Foreign Scope

The only approved normative edge is:

```text
SPEC-EXEC-001 → SPEC-DOM-001
```

REPO configuration, EXEC-002 context application, PLAT persistence/replay and
consumer mappings are boundary dependencies already authorized by the
portfolio. Their unavailable implementation is not absorbed into local gaps.

```text
NORMATIVE_DEPENDENCIES = 1
UNAPPROVED_DEPENDENCIES = 0
MISSING_REQUIRED_DEPENDENCIES = 0
DEPENDENCY_DIRECTION_ERRORS = 0
DEPENDENCY_INTEGRATION_GAPS = 0
```

## 13. Evidence and Exact Delta Reconciliation

Implementation evidence, test-existence evidence and test-execution evidence
remain separate. Every actionable row and detail record has `OBSERVED`,
`REQUIRED` and `DELTA`; no implementation design, file/class/schema-library,
database, ticket, phase or sequence is prescribed. The productive version
consumer and delegation runtime are cited as observed repository boundaries,
not as proof of EXEC implementation.

Conformance evidence status by final requirement classification:

| Evidence status | Requirements |
|---|---|
| `NOT_IMPLEMENTED` | 18 `MISSING` requirements |
| `PROVEN` | `EXEC-SNAPSHOT-001` contradiction and productive consumer evidence |

No requirement is `UNVERIFIED`; no test-only evidence is used to claim
implementation.

## 14. Gap Identity, Category and Severity Reconciliation

- `GAP-005` retains the prior identity and now represents only the productive
  caller-basis contradiction for `EXEC-SNAPSHOT-001`.
- `GAP-017` is the stable new identity required for the materially independent
  started-manifest/schema/version freeze delta of `EXEC-MANIFEST-003`.
- The split has different current behavior, evidence paths, authority
  boundaries and closure conditions; it therefore satisfies the false-merge
  correction without a false split.
- All 17 active gaps have one affected requirement set, one detail record and
  one valid category/severity. No orphan or duplicate identity exists.

```text
TOTAL_DISTINCT_GAPS = 17
BLOCKER_GAPS = 0
MAJOR_GAPS = 17
MINOR_GAPS = 0
EVIDENCE_ONLY_GAPS = 0
FALSE_GAP_SPLITS = 0
FALSE_GAP_MERGES = 0
ORPHAN_GAPS = 0
ORPHAN_REQUIREMENT_REFERENCES = 0
```

`GAP-005` is `BEHAVIOR_CONTRADICTORY` / `MAJOR`; all other active gaps are
`BEHAVIOR_MISSING` / `MAJOR`. The contradiction is not softened to `PARTIAL`
because productive caller input can establish canonical snapshot state.

## 15. Coverage and Metric Reconciliation

All metrics below are derived from the corrected requirement rows and the 17
distinct detail records, not copied from the prior matrix.

```text
PORTFOLIO_OBLIGATIONS_AUDITED = 6
AUDITED_REQUIREMENTS = 19
CONFIRMED_CLASSIFICATIONS = 19
RECLASSIFICATION_REQUIRED = 0
UNAUDITED_REQUIREMENTS = 0
INSUFFICIENT_EVIDENCE = 0
OWNERSHIP_ERRORS = 0
TOTAL_NORMATIVE_REQUIREMENTS = 19
TOTAL_CLASSIFIED_REQUIREMENTS = 19
IMPLEMENTED = 0
PARTIAL = 0
MISSING = 18
CONTRADICTORY = 1
NOT_APPLICABLE = 0
OWNED_BY_OTHER_SPEC = 0
UNVERIFIED = 0

TOTAL_DISTINCT_GAPS = 17
BLOCKER_GAPS = 0
MAJOR_GAPS = 17
MINOR_GAPS = 0
EVIDENCE_ONLY_GAPS = 0

PORTFOLIO_OWNERSHIP_VIOLATION_GAPS = 0
FAILURE_SEMANTIC_VIOLATION_GAPS = 0
COMPATIBILITY_VIOLATION_GAPS = 0
DEPENDENCY_INTEGRATION_GAPS = 0
WRONG_OWNER_IMPLEMENTATIONS = 0
IMPLEMENTATION_LOCATION_CONCERNS = 0

UNCLASSIFIED_REQUIREMENTS = 0
UNRESOLVED_OWNERSHIP = 0
UNRESOLVED_MATERIAL_DELTA = 0
UNSUPPORTED_IMPLEMENTED_CLAIMS = 0
KNOWN_FALSE_POSITIVE_GAPS = 0
KNOWN_FALSE_NEGATIVE_GAPS = 0
FALSE_GAP_SPLITS = 0
FALSE_GAP_MERGES = 0
ORPHAN_GAPS = 0
ORPHAN_REQUIREMENT_REFERENCES = 0

SPECIFICATION_AMBIGUITY = 0
ARCHITECTURAL_AUTHORITY_GAP = 0
PORTFOLIO_AUTHORITY_GAP = 0
SOURCE_SPEC_CONFORMANCE_DRIFT = 0
CAPABILITY_AVAILABILITY_CLASSIFICATION_ERRORS = 0
DOWNSTREAM_PROMOTION_WITHOUT_NEW_EVIDENCE = 0
READY_CLAIMS_WITH_UNAVAILABLE_CONTRACT = 0
```

Implementation coverage includes all 19 requirements because every requirement
has a local EXEC obligation, including mixed-ownership rows:

```text
IMPLEMENTATION_COVERAGE = IMPLEMENTED_OWNED_REQUIREMENTS / ELIGIBLE_OWNED_REQUIREMENTS
IMPLEMENTATION_COVERAGE = 0 / 19 = 0%
```

A PARTIAL requirement would remain eligible and count only under the repository
convention's explicitly stated `IMPLEMENTED + PARTIAL` alternative; there are
no PARTIAL rows in this baseline.

## 16. Planning-Blocking Defect Reconciliation

The six prior-source findings and the latest `CGMA-MAJOR-005` finding are
retained in the lineage ledger below. Their matrix defects are remediated
locally; only the independent auditor may close or approve them.

| Finding | Validation | Matrix correction | Local evidence | Result |
|---|---|---|---|---|
| `CGMA-CRITICAL-001` | Validated and still present at the audited HEAD: productive caller `versions` enters DOM snapshot without authoritative EXEC resolution. | Reclassified `EXEC-SNAPSHOT-001` from `MISSING` to `CONTRADICTORY`; retained `GAP-005`; added precise evidence, contradiction fields, mixed ownership and exact delta. | `src/application/snapshot.ts:19-25,36-43,59-71`; `src/domain/snapshot.ts:124-143`. | REMEDIATED |
| `CGMA-MAJOR-001` | Validated and still present: prior capability proof used invalid `AUTHORITY_DEFINED` and omitted required dimensions. | Replaced with `AUTHORITY_STATUS=DEFINED`, explicit authority existence, bounded context, returned data, version/revision transport, failure/stale semantics, evidence, availability and integrated-only result. | Corrected §9 authority and producer/consumer tables; conformant DOM SPEC/audit. | REMEDIATED |
| `CGMA-MAJOR-002` | Validated and still present: seven mixed requirements have local plus foreign obligations. | Added the four required mixed-ownership fields for `EXEC-SNAPSHOT-001`, `EXEC-MANIFEST-001/002/003/004`, `EXEC-HISTORY-001`, `EXEC-FAILURE-001`; foreign scope remains outside local gaps. | Corrected §8 and GAP-005/GAP-012–GAP-017 records. | REMEDIATED |
| `CGMA-MAJOR-005` | Validated and still present in the latest independent audit: `EXEC-REGISTRY-004` is an eighth mixed-ownership requirement, but GAP-007 omitted the four required fields. | Added `LOCAL_OBLIGATION`, `FOREIGN_OBLIGATION`, `FOREIGN_OWNER` and `LOCAL_INTEGRATION_EXPECTATION` to GAP-007 and the mixed-ownership table; reconciled the count to eight and preserved foreign scope. | Conformant SPEC-EXEC-001 §§12.1, 12.3, 12.4; conformant SPEC-DOM-001 DOM-ID-001; current repository baseline. | REMEDIATED |
| `CGMA-MAJOR-003` | Validated and still present: prior GAP-005 combined independent snapshot and manifest deltas. | Preserved GAP-005 for snapshot contradiction and created stable GAP-017 for independent manifest freeze; updated all references and metrics. | Corrected §6, §7, §14; 17 records reconcile one-to-one. | REMEDIATED |
| `CGMA-MAJOR-004` | Validated and still present: inventory omitted productive DOM version consumer and generic skill delegation runtime. | Corrected inventory and affected evidence without promoting either surface to EXEC authority or productive availability. | Corrected §5 and GAP-004/GAP-005 evidence. | REMEDIATED |
| `CGMA-MINOR-001` | Validated and still present: required auditability metric vocabulary was incomplete. | Added explicit audited/confirmed/reclassification/obligation and all required final metric fields, recalculated from corrected rows/details. | Corrected §15 and §17 metrics. | REMEDIATED |

```text
TOTAL_FINDINGS = 7
REMEDIATED = 7
ALREADY_RESOLVED = 0
REJECTED_BY_VALID_EVIDENCE = 0
PARTIALLY_REMEDIATED = 0
BLOCKED = 0
PLANNING_BLOCKING_FINDINGS_REMAINING = 0
```

`PLANNING_BLOCKING_FINDINGS_REMAINING = 0` means no audited planning-blocking
matrix defect remains knowingly present. It does not emit a conformance or
planning approval verdict.

## 17. Reliability Validation

```text
UNCLASSIFIED_REQUIREMENTS = 0
UNAUDITED_REQUIREMENTS = 0
UNRESOLVED_OWNERSHIP = 0
UNRESOLVED_MATERIAL_DELTA = 0
UNSUPPORTED_IMPLEMENTED_CLAIMS = 0
KNOWN_FALSE_POSITIVE_GAPS = 0
KNOWN_FALSE_NEGATIVE_GAPS = 0
FALSE_GAP_SPLITS = 0
FALSE_GAP_MERGES = 0
ORPHAN_GAPS = 0
ORPHAN_REQUIREMENT_REFERENCES = 0
SPECIFICATION_AMBIGUITY = 0
ARCHITECTURAL_AUTHORITY_GAP = 0
PORTFOLIO_AUTHORITY_GAP = 0
SOURCE_SPEC_CONFORMANCE_DRIFT = 0
CAPABILITY_AVAILABILITY_CLASSIFICATION_ERRORS = 0
DOWNSTREAM_PROMOTION_WITHOUT_NEW_EVIDENCE = 0
READY_CLAIMS_WITH_UNAVAILABLE_CONTRACT = 0
```

No authority escalation was discovered:

```text
ESCALATION = NO_ESCALATION
```

The caller bypass is a repository contradiction against sufficient existing
authority, not an ADR, portfolio, target SPEC or upstream SPEC defect. No new
normative dependency, owner, failure meaning, compatibility role or
implementation design was invented.

## 18. Required Change-Boundary Proof

```text
ADRS_CHANGED = NO
PORTFOLIO_CHANGED = NO
COMPONENT_SPEC_CHANGED = NO
UPSTREAM_SPECS_CHANGED = NO
PRODUCTION_CODE_CHANGED = NO
TESTS_CHANGED = NO
IMPLEMENTATION_PLAN_CHANGED = NO
TICKETS_CHANGED = NO
```

## 19. Remediation Status and Handoff

```text
VERDICT = COMPONENT_GAP_MATRIX_REMEDIATION_COMPLETE
REMEDIATION_STATE = READY_FOR_INDEPENDENT_GAP_MATRIX_REAUDIT
```

This remediation does not mark findings closed, approve the matrix, or emit
`GAP_MATRIX_CONFORMANT`, `READY_FOR_IMPLEMENTATION_PLAN` or any implementation
phase gate. The mandatory next operation is the independent
`audit-component-implementation-gap-matrix` re-audit against this corrected
matrix and the same pinned authority/repository basis.
