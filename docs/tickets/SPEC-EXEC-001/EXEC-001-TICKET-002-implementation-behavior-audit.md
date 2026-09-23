# EXEC-001-TICKET-002 — Implementation Behavior Audit

## Audit identity and pinned subject

```text
AUDIT_SKILL = audit-implementation-behavior
AUDIT_MODE = READ_ONLY / INDEPENDENT / ADVERSARIAL / BEHAVIOR_FIRST
TICKET_ID = EXEC-001-TICKET-002
TICKET_PATH = docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-version-registry-catalogs-capabilities.md
IMPLEMENTATION_UNIT = EXEC-IMP-02 — Version, registry resolution, catalogs and capability extensibility
REQUIREMENT_IDS = EXEC-VERSION-001, EXEC-VERSION-002, EXEC-REGISTRY-001, EXEC-REGISTRY-002, EXEC-REGISTRY-003, EXEC-CAPABILITY-001, EXEC-CAPABILITY-002
ACCEPTANCE_IDS = AC-EXEC-003, AC-EXEC-004, AC-EXEC-008, AC-EXEC-009, AC-EXEC-010, AC-EXEC-011, AC-EXEC-012
SPEC_PATH = docs/specs/SPEC-EXEC-001-skill-contracts-and-capability-registry.md
GAP_MATRIX_PATH = docs/specs/gap-matrices/SPEC-EXEC-001-implementation-gap-matrix.md
IMPLEMENTATION_PLAN_PATH = docs/specs/implementation-plans/SPEC-EXEC-001-implementation-plan.md
TICKET_SET_AUDIT_PATH = docs/tickets/SPEC-EXEC-001/implementation-ticket-audit.md
IMPLEMENTATION_BASELINE = d4216ad6f4a87fe7142ccd45d3fd099ef1b92955
CURRENT_HEAD = 36ac11c08d6e7b9416e41662646c2686fcfef677
AUDIT_TARGET_HEAD = 36ac11c08d6e7b9416e41662646c2686fcfef677
AUDIT_TARGET_STATE_FINGERPRINT = 191ca7c9d2f15f71bc48ee2e17059438ed01efba281c261ad329e41532be6714
```

The pinned HEAD was verified with `git rev-parse HEAD`. The semantic workspace
fingerprint was independently recomputed using the workflow snapshot rule
(path, NUL, bytes, NUL; sorted paths), excluding `.git`, `node_modules`,
`.pi/`, `skills/`, `.codex/`, and the specialist/canonical audit artifacts. It
was `191ca7c9d2f15f71bc48ee2e17059438ed01efba281c261ad329e41532be6714`,
matching the supplied fingerprint. No sibling specialist audit artifact was
read. No production code, test, authority, ticket state, or Git state was
modified.

## Authority chain and scope

The accepted chain reconstructed for this behavior audit is:

```text
ADR-0003 revision 3 ACCEPTED
  → O-017 / O-020
  → SPEC-EXEC-001 revision 3
  → GAP-004, GAP-006, GAP-008, GAP-009, GAP-010, GAP-011
  → EXEC-IMP-02 in the conformant Implementation Plan
  → EXEC-001-TICKET-002
  → implementation design and repository source/tests
```

The authoritative behaviors are exact semantic-version meaning and explicit
support sets; deterministic complete-entry resolution for a frozen basis;
repository-scoped NORMAL versus system-scoped BOOTSTRAP catalogs; bootstrap
allowlisting before normal work; distinct `UNKNOWN_CAPABILITY` and
`INCOMPATIBLE_CAPABILITY` results; and common-path synthetic registration with
no mutation of an old basis. DOM `RepositoryId`/execution basis, REPO enabled
NORMAL configuration, physical persistence, CAS, recovery and external work
remain foreign or later integrated boundaries as stated by the ticket.

The approved design is supporting structure, not authority. Repository
execution and direct assertions below are the evidence for implementation
behavior.

### Required inputs and changed surfaces

Actual semantic implementation files changed from the recorded implementation
baseline are:

- `src/domain/exec-registry.ts`
- `src/domain/exec-contract.ts` (the authenticated schema-reference helper;
  this file is absent from the ticket's changed-file list but is in the actual
  baseline-to-target diff)
- `src/application/exec-registry.ts`
- `src/application/exec-registry-ports.ts`
- `src/composition/exec-registry.ts`

Actual changed test file:

- `tests/exec-001-ticket-002.test.ts`

Relevant evidence files are the eight ticket evidence files under
`docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/`. Relevant suites are the
TICKET-002 direct suite, the TICKET-001 regression suite, the package root
suite, TypeScript typecheck, the audit-governance guard, and the skill-mirror
guard.

## Authority consumption and provenance baseline

The ticket records `ACP-EXEC-02`, `PCP-DOM-EXEC-01`,
`PCP-REPO-EXEC-01`, and `UNIT-EXEC-REGISTRY-FIXTURE`. Independent
reconciliation is:

| Capability | Authority / producer | Consumer | Authority / contract | Local testability | Productive availability | Dependency class | Result |
|---|---|---|---|---|---|---|---|
| `UNIT-EXEC-REGISTRY-FIXTURE` | EXEC local domain fixture | TICKET-002 tests | DEFINED / DEFINED | YES | NO | INFORMATIONAL | contract-level evidence only |
| `DOM-EXEC-IDENTITY-SNAPSHOT` | DOM canonical resolver | EXEC registry consumer | DEFINED / DEFINED | NO | NO | REQUIRED_FOR_INTEGRATED_PROOF | defined but not productively consumable |
| `REPO-EXEC-NORMAL-CATALOG` | enabled REPO configuration | EXEC NORMAL consumer | DEFINED / DEFINED | NO | NO | REQUIRED_FOR_INTEGRATED_PROOF | defined but not productively consumable |

No fixture, mock, source marker, or in-memory basis was promoted to productive
availability. The foreign capability classification and integrated-only
blocking effect are preserved; no dependency-class reclassification is made.

The provenance proof is not complete in the implementation. The application
checks an authenticated local `CatalogBasis`, requested scope equality, and a
plain `basis.source` string (`src/application/exec-registry.ts:83-92`). It does
not verify an issuer-bound producer identity. A caller-provided adapter can
create a valid local basis with the expected source string and obtain a
resolved result. The direct witness was executed independently:

```text
forged expected-source adapter result = RESOLVED / RESOLVED
expected = CONTRACT_INVALID / no resolution
```

The existing wrong-source and untrusted-material tests
(`tests/exec-001-ticket-002.test.ts:255-277`) do not exercise this forged
expected-source path. The direct-basis-property test
(`tests/exec-001-ticket-002.test.ts:233-242`) rejects only an explicit `basis`
field and does not close source provenance.

`TEMPORAL_AUTHORITY_PROOF = NOT_APPLICABLE` for the local immutable operation:
this ticket commits no external effect and does not implement physical
persistence. Integrated source freshness, snapshot binding, CAS and semantic
reconstruction remain later-owner obligations. This does not excuse the
caller/provenance bypass found below.

## Behavioral applicability matrix

| Dimension | Classification | Applicability and inspected evidence |
|---|---|---|
| `UNIT_BEHAVIOR` | REQUIRED | Semver, support sets, entry validation, basis registration and resolution execute in `src/domain/exec-registry.ts`. |
| `INTEGRATION_BEHAVIOR` | AFFECTED | Application source ports select DOM/REPO seams and authenticate scope/source markers; no productive foreign producer exists at this target. |
| `PERSISTENCE` | AFFECTED | Immutable local basis and `CatalogRevision` are exercised; physical serialization/storage is explicitly outside TICKET-002. |
| `CONCURRENCY` | AFFECTED | Local registration is pure create-only basis publication; physical one-winner/CAS behavior is integrated-only. |
| `STALE_STATE` | AFFECTED | Frozen-basis and source/scope mismatch behavior are local; stale persisted-material reconstruction is later scope. |
| `IDEMPOTENCY` | REQUIRED | Duplicate/conflicting registration must reject without changing the old basis. |
| `DURABILITY` | NOT_APPLICABLE | No durable store or durable completion claim is implemented by this ticket. |
| `RECOVERY` | NOT_APPLICABLE | Restart, replay and physical recovery are explicitly excluded. |
| `COMPATIBILITY` | REQUIRED | Semantic-version classification, exact support membership and no alias/conversion are owned here. |
| `MIGRATION_BEHAVIOR` | NOT_APPLICABLE | `MIGRATION` is only an allowlisted bootstrap category; no migration operation is implemented. |
| `NEGATIVE_PATHS` | REQUIRED | Unsupported, unknown, wrong scope/source, duplicate, malformed, forged and untrusted material paths are in scope. |

Every `REQUIRED` and `AFFECTED` row was inspected. Local persistence,
concurrency and stale results are not claims of productive physical behavior.

## Production behavior classification

| Required behavior | Production path | Classification | Observed semantics |
|---|---|---|---|
| Semver syntax and major/minor/patch meaning | `SemanticVersion.parse/compare/changeFrom`, lines 96-164 | `IMPLEMENTED_CORRECTLY` for exercised SemVer cases | Exact decimal comparison avoids numeric overflow; prerelease/build handling and major/minor/patch classification execute correctly. |
| Explicit support-set membership | `SupportedVersionSet.create/has/resolve`, lines 166-208; `VersionCompatibilityPolicy`, lines 485-490 | `PARTIAL` | Exact authenticated sets reject aliases/ranges, but the resolver applies the first candidate's support set before selecting a matching version when multiple registered versions exist. |
| Complete deterministic registry mapping | `CatalogBasis.register`, `findByCapability`, and resolver lines 432-453, 500-528 | `PARTIAL` | Single-entry mapping returns stage, skill/capability, semantic version, schemas, artifacts, verdicts and roles; a valid second registered version can be falsely rejected because only `schemaCandidates[0]` is checked. |
| NORMAL/BOOTSTRAP separation and source selection | `ResolveExecCapability.selectBasis`, lines 54-93 | `PARTIAL` | Scope/source mismatch, untrusted material and explicit basis injection fail closed, but caller-created scope/repository identity, caller support set and forgeable source markers remain accepted authority paths. |
| Bootstrap allowlist | `BootstrapAllowlistPolicy` lines 493-497 and resolver lines 522-524 | `IMPLEMENTED_CORRECTLY` for result classification | Normal category in BOOTSTRAP returns `INCOMPATIBLE_CAPABILITY`; allowlisted categories resolve. “Before work” isolation is not directly witnessed by an actual work/enablement boundary. |
| Unknown versus incompatible outcomes | resolver lines 512-521 | `IMPLEMENTED_CORRECTLY` for tested single-version paths | No identity candidate returns `UNKNOWN_CAPABILITY`; stage/schema/version mismatches return `INCOMPATIBLE_CAPABILITY`; failures carry `noApproval` and `noMutation`. |
| Synthetic common-path extensibility | `registerRegistryEntry`, `CatalogBasis.register`, application composition | `PARTIAL` | Valid synthetic entries use the common path and old bases remain unchanged, but registration accepts forged `RegistryEntry`/`CatalogBasis` objects through a nominal check bypass. |
| Duplicate/no-mutation idempotency | `CatalogBasis.register`, lines 432-438 | `IMPLEMENTED_CORRECTLY` for immutable sequential duplicate path | Same identity, including a different stage, rejects and leaves the existing basis unchanged. |
| Local source failure behavior | `ResolveExecCapability.resolve`, lines 43-50 and `failureBasis` | `IMPLEMENTED_CORRECTLY` for tested failure shapes | Missing, untrusted and wrong-source adapters map to structured `CONTRACT_INVALID`; no approval/mutation is claimed. Provenance is incomplete for a forged expected-source adapter. |

## Acceptance witness audit

The ticket's seven final AC rows plus the two explicit contributor rows were
reconstructed as nine normative behaviors. The operation and test mapping is:

| Behavior | Direct operation and test | Witness result |
|---|---|---|
| Semver classify/resolve | `SemanticVersion` and resolver tests, `tests/exec-001-ticket-002.test.ts:74-105,197-212` | direct positive and negative witness present |
| Explicit support set | `SupportedVersionSet` and incompatible resolution tests | direct witness present; multiple-entry selection not covered |
| Complete deterministic mapping | basis register/resolve, `:120-142` | direct operation present, but output schema is not asserted |
| NORMAL/BOOTSTRAP isolation | scoped bases and source mismatch, `:153-176,255-293` | direct local witness present; productive producer not claimed |
| Bootstrap allowlist before work | resolver rejection, `:178-195` | result rejection direct; no work/enablement isolation witness |
| Unknown/incompatible distinction | `:197-213` | direct witness present |
| Synthetic common registry path | `:215-231` | direct witness present; forged registration negative is absent |
| Frozen-basis contributor behavior | `:120-150,215-231` | direct no-mutation witness present |
| Failure-classification contributor behavior | `:197-213,255-277` | direct result witness present |

```text
REQUIRED_BEHAVIORS_TOTAL = 9
DIRECT_BEHAVIOR_WITNESSES = 8
PROXY_ONLY_BEHAVIORS = 1
UNTESTED_STATE_TRANSITIONS = 0
UNPROVEN_CONCURRENCY_CONTRACTS = 0
MISSING_ARCHITECTURE_GUARDS = 0
```

The bootstrap “before work” row is proxy-only: the test asserts a result code,
`noApproval` and `noMutation`, but no actual work/enablement operation or
callback is exercised. The deterministic mapping witness is direct but weakly
asserted because `outputSchema` is not checked; this is separately reported.
Registration and resolution are local immutable operations, so no physical
one-winner concurrency witness is claimed or required for local closure.

## Test inventory and assertion quality

| Category | Classification | Evidence |
|---|---|---|
| `UNIT` | `REQUIRED_TEST_PRESENT` | 12 direct TICKET-002 tests pass. |
| `INVARIANT` | `REQUIRED_TEST_PRESENT` | Duplicate identity, immutable basis, authenticated references and complete-entry checks are exercised. |
| `INTEGRATION` | `REQUIRED_TEST_PRESENT` | Consumer-shaped DOM/REPO source seams, source/scope checks and failure mapping are exercised with local adapters. |
| `COMPATIBILITY` | `REQUIRED_TEST_PRESENT` | SemVer components, prerelease/build behavior, large decimal comparison and explicit support membership pass. |
| `IDEMPOTENCY` | `REQUIRED_TEST_PRESENT` | Sequential duplicate/conflicting registration asserts no mutation. |
| `NEGATIVE_PATH` | `REQUIRED_TEST_PRESENT` | Unsupported, unknown, schema, scope, source, forged schema and unavailable adapter paths execute. |
| `ARCHITECTURE_GUARD` | `REQUIRED_TEST_PRESENT` | Import guard test covers infrastructure/prototype/transport/generic dependency exclusions. |
| `CONFORMANCE` | `REQUIRED_TEST_PRESENT` | Typecheck, audit-governance and skill-mirror guards pass. |
| `CROSS_SPEC` | `TEST_CATEGORY_NOT_APPLICABLE` for local closure | DOM/REPO productive producers are `REQUIRED_FOR_INTEGRATED_PROOF` and unavailable; local fixtures cannot prove integrated availability. |
| `PERSISTENCE` | `TEST_CATEGORY_NOT_APPLICABLE` | Physical persistence is explicitly outside the ticket. |
| `CONCURRENCY` | `TEST_CATEGORY_NOT_APPLICABLE` for local closure | Physical CAS/one-winner behavior is explicitly integrated-only; local registration is immutable/pure. |
| `STALE` | `TEST_CATEGORY_NOT_APPLICABLE` for local closure | Persisted stale/reconstruction semantics belong to TICKET-003/PLAT; local source mismatch is tested under negative paths. |
| `RECOVERY` | `TEST_CATEGORY_NOT_APPLICABLE` | Restart/replay/recovery are excluded. |
| `MIGRATION` | `TEST_CATEGORY_NOT_APPLICABLE` | No migration operation is implemented. |

The direct assertions are generally strong: they assert canonical codes,
returned identity, arrays, role/verdict restrictions, old-basis contents and
failure flags rather than merely construction or absence of exceptions. Two
required evidence weaknesses remain: no actual before-work isolation and no
`outputSchema` assertion. The import test is an architecture guard, not a
substitute for provenance.

## Independently executed tests

```text
TESTS_RUN = 60 unique root test cases
TESTS_PASSED = 60
TESTS_FAILED = 0
TESTS_SKIPPED = 0
ENVIRONMENTAL_FAILURES = 0
```

Execution record:

| Command | Result |
|---|---|
| `node --experimental-strip-types --test tests/exec-001-ticket-002.test.ts` | 12 passed, 0 failed, 0 skipped |
| `node --experimental-strip-types --test tests/exec-001-ticket-001.test.ts` | 21 passed, 0 failed, 0 skipped |
| `npm test` | 60 passed, 0 failed, 0 skipped |
| `npm run typecheck` | PASS |
| `npm run verify:audit-governance` | PASS |
| `npm run verify:skill-mirror` | PASS |

The root suite includes the direct TICKET-002 and TICKET-001 suites, so counts
are reported as unique root cases rather than summed invocations.

## Direct adversarial executions

The following one-off executions were performed without changing repository
files:

1. A basis containing valid entries for `1.0.0` and `2.0.0`, with a request
   for supported `2.0.0`, returned
   `FAILED / INCOMPATIBLE_CAPABILITY` with reason “Capability version is not
   explicitly supported by the requested basis.” Expected: `RESOLVED` to the
   `2.0.0` entry.
2. A caller-injected adapter returned a locally created BOOTSTRAP basis whose
   `source` was the expected `DOM_EXECUTION_BASIS` marker. Resolution returned
   `RESOLVED / RESOLVED`. Expected: fail closed because the adapter had no
   producer-issued provenance.
3. `Object.create(RegistryEntry.prototype)` with copied valid-looking fields
   was accepted by `CatalogBasis.register` and resolved successfully. Expected:
   `CONTRACT_INVALID` because it was not an authenticated domain entry.
4. `Object.create(CatalogBasis.prototype)` with valid-looking scope/revision/
   source/entries was accepted by `registerRegistryEntry` and produced a new
   authenticated basis. Expected: reject an unauthenticated basis.
5. Two equivalent immutable registrations run through `Promise.all` each
   returned an independent one-entry basis while the original remained empty.
   This is consistent with the declared local pure-operation contract; it does
   not claim a physical shared-store one-winner guarantee.

## Conditional dimensions

| Dimension | Result | Evidence and scope |
|---|---|---|
| Concurrency | `CONFORMANT` locally | Pure immutable registration has no lost update within a supplied basis; physical CAS and one-winner publication are integrated-only and not claimed. |
| Stale behavior | `CONFORMANT` locally | Frozen basis references are not rewritten; wrong scope/source material fails closed. Persisted stale/reconstruction semantics are later scope. |
| Idempotency | `CONFORMANT` | Duplicate/conflicting key rejects without mutation; repeated equivalent local attempts do not duplicate the supplied basis. |
| Durability/persistence | `NOT_APPLICABLE` locally | No durable storage is implemented. |
| Recovery | `NOT_APPLICABLE` | Restart/replay/physical recovery are out of scope. |
| Compatibility/migration | `PARTIAL` compatibility, `NOT_APPLICABLE` migration | SemVer behavior is good for exercised cases; multi-version resolution is incorrect. No migration operation exists. |
| Authority consumption | `DEFINED_BUT_NOT_CONSUMABLE` for DOM/REPO productive capabilities; local fixture consumable only as contract evidence | Productive availability remains `NO`; no downstream promotion is made. |
| Temporal authority | `NOT_APPLICABLE` locally | No local mutable authority-to-effect commit exists. |
| Caller-as-authority bypasses | `4` material surfaces | Caller-created NORMAL identity/scope, caller-supplied supported set, forgeable expected source marker/adapter, and unauthenticated registration basis/entry. |

## Regression result

```text
REGRESSION_RESULT = NO_REGRESSION
REGRESSIONS = 0
```

The TICKET-001 direct regression suite and the full root suite pass. No
behavioral regression in the affected existing contract boundary was observed
relative to the implementation baseline. The findings below are defects or
proof gaps in the new TICKET-002 behavior, not pre-existing regressions.

## Findings

### BEH-CRITICAL-001 — Caller-supplied registry authority and forgeable source provenance

```text
FINDING_STATUS = OPEN
SEVERITY = CRITICAL
TICKET = EXEC-001-TICKET-002
REQUIREMENTS = EXEC-VERSION-002, EXEC-REGISTRY-001, EXEC-REGISTRY-002, EXEC-CAPABILITY-001
ACCEPTANCE = AC-EXEC-004, AC-EXEC-008, AC-EXEC-009, AC-EXEC-011
CAPABILITY = DOM-EXEC-IDENTITY-SNAPSHOT; REPO-EXEC-NORMAL-CATALOG; UNIT-EXEC-REGISTRY-FIXTURE
DEPENDENCY_CLASS = REQUIRED_FOR_INTEGRATED_PROOF for foreign producers; local provenance guard is a TICKET-002 obligation
LOCAL_CLOSURE_BLOCKING = YES
LOCAL_ACCEPTANCE_REQUIRES_PRODUCTIVE_CAPABILITY = NO
DEPENDENCY_CLASS_RECLASSIFICATION_REQUIRED = NO
UPSTREAM_DEPENDENCY_CLASSIFICATION_PRESERVED = YES
BLOCKS_LOCAL_EXECUTION = YES
BLOCKS_LOCAL_CLOSURE = YES
BLOCKS_TICKET_DONE = YES
BLOCKS_INTEGRATED_PROOF = YES
BLOCKS_SPEC_FINAL_CONFORMANCE = YES
PRIMARY_ROUTE = IMPLEMENTATION_REMEDIATION for the local guard; preserve integrated producer routes
DOWNSTREAM_CHECKPOINT = integrated DOM/REPO authority-consumption proof
CALLER_SUPPLIED_AUTHORITY_BYPASS = YES
```

**Required behavior:** Canonical NORMAL `RepositoryId`/scope and supported
version authority must come from the approved owner/consumer contract; a
source adapter must return producer-issued catalog material, not caller-minted
material. Caller input may request a capability but may not establish the
canonical basis or consumer support set.

**Production evidence:** `CatalogScope.normal` accepts any caller string
(`src/domain/exec-registry.ts:224-227`). `ResolveExecCapabilityInput` exposes
caller scope, repository ID and inherited `supportedVersions`
(`src/application/exec-registry.ts:21-25`). `selectBasis` uses the caller's
scope repository ID to query the NORMAL source and checks only scope equality
and the forgeable source string (`src/application/exec-registry.ts:61-91`).
`ExecutionCatalogBasisReader` and `NormalCatalogSource` are public structural
ports (`src/application/exec-registry-ports.ts:7-20`).

**Test evidence:** Existing tests correctly reject an explicit basis property,
forged scope prototype, untrusted returned shape and wrong source
(`tests/exec-001-ticket-002.test.ts:233-277`). They do not reject a genuine
`CatalogBasis` created by a caller with the expected source marker, a caller
chosen NORMAL identity, or a caller chosen genuine `SupportedVersionSet`.
Independent execution of the forged expected-source adapter returned
`RESOLVED / RESOLVED`, and independent execution with a caller-supplied genuine
support set also returned `RESOLVED / RESOLVED`.

**Observed result:** A caller can inject an adapter that returns a locally
constructed basis with `source = DOM_EXECUTION_BASIS`; the consumer accepts and
resolves it. A caller can create `CatalogScope.normal('arbitrary-id')` and a
fresh authenticated support set and have them treated as the requested
canonical context.

**Expected result:** The consumer must verify producer provenance with an
issuer-bound/unforgeable or independently verifiable proof, obtain canonical
NORMAL identity and authoritative support-set meaning from their owners, and
reject caller-injected or source-substituted material as `CONTRACT_INVALID`
without a resolution.

**Problem:** A plain source marker and caller-authenticated local value are
being used as authority proof. The implementation has no producer-bound source
credential and no owner-facing support-set seam; the request itself is the
authority input.

**Impact:** Forged or wrong-owner catalog material can be interpreted as a
canonical capability result. An attacker can select repository scope or
consumer support authority, defeating the exact-basis and authority-consumption
contract. This is a `CALLER_SUPPLIED_AUTHORITY_BYPASS` and a provenance failure.

**Minimum correction required:** Introduce an owner-issued/verifiable producer
credential or equivalent provenance boundary for each source, obtain NORMAL
identity and authoritative supported-set semantics through approved authority
seams, reject caller-authored canonical replacements, and add direct negative
witnesses for expected-marker forgeries, caller scope/support-set injection and
alternate adapters. Preserve `PRODUCTIVE_AVAILABILITY = NO` for foreign
producers until integrated evidence exists; do not reclassify the dependency.

**Systemic pattern = YES**
**Related locations:** `src/domain/exec-registry.ts:224-227,419-429`;
`src/application/exec-registry.ts:21-25,54-93`;
`src/application/exec-registry-ports.ts:7-20`;
`tests/exec-001-ticket-002.test.ts:233-277`.

### BEH-CRITICAL-002 — Unauthenticated registry entry and basis accepted by registration

```text
FINDING_STATUS = OPEN
SEVERITY = CRITICAL
TICKET = EXEC-001-TICKET-002
REQUIREMENTS = EXEC-REGISTRY-001, EXEC-REGISTRY-002, EXEC-CAPABILITY-002
ACCEPTANCE = AC-EXEC-008, AC-EXEC-009, AC-EXEC-012
CAPABILITY = UNIT-EXEC-REGISTRY-FIXTURE
DEPENDENCY_CLASS = INFORMATIONAL for the local fixture; this is a local authority/provenance defect
LOCAL_CLOSURE_BLOCKING = YES
LOCAL_ACCEPTANCE_REQUIRES_PRODUCTIVE_CAPABILITY = NO
DEPENDENCY_CLASS_RECLASSIFICATION_REQUIRED = NO
UPSTREAM_DEPENDENCY_CLASSIFICATION_PRESERVED = YES
BLOCKS_LOCAL_EXECUTION = YES
BLOCKS_LOCAL_CLOSURE = YES
BLOCKS_TICKET_DONE = YES
BLOCKS_INTEGRATED_PROOF = YES
BLOCKS_SPEC_FINAL_CONFORMANCE = YES
PRIMARY_ROUTE = IMPLEMENTATION_REMEDIATION
DOWNSTREAM_CHECKPOINT = integrated registry authority and reconstruction proof
CALLER_SUPPLIED_AUTHORITY_BYPASS = YES
```

**Required behavior:** Only authenticated `RegistryEntry` and `CatalogBasis`
material may enter or advance the registry; schema-valid synthetic entries must
use the common path without allowing forged material to become canonical.

**Production evidence:** `CatalogBasis.create` checks the WeakSet
`isAuthenticatedRegistryEntry` predicate (`src/domain/exec-registry.ts:419-429`),
but `CatalogBasis.register` uses only `instanceof RegistryEntry`
(`src/domain/exec-registry.ts:432-438`). The registration helper and
application use case perform no authenticated-basis check
(`src/domain/exec-registry.ts:550-552`; `src/application/exec-registry.ts:101-103`).
The runtime WeakSet predicates exist at lines 571-585 but are not applied at
this registration boundary.

**Test evidence:** The test rejects a forged schema reference and a plain
support-set-shaped object (`tests/exec-001-ticket-002.test.ts:94-105,233-253`),
but has no direct forged `RegistryEntry` or forged `CatalogBasis` registration
witness. Independent execution created `Object.create(RegistryEntry.prototype)`
with copied valid-looking fields; `CatalogBasis.register` accepted it and the
resolver returned `RESOLVED`. Independent execution created
`Object.create(CatalogBasis.prototype)` with valid-looking scope/revision/source
and `registerRegistryEntry` produced a new authenticated basis.

**Observed result:** Nominal prototype objects bypass the intended WeakSet
authentication at the registration operation and become registry material.

**Expected result:** Forged or detached entry/basis objects must be rejected
with `CONTRACT_INVALID` before publication, and the prior basis must remain
unchanged.

**Problem:** The construction-authentication model is inconsistent: basis
creation uses runtime provenance, while registration trusts forgeable
`instanceof` and a caller-provided basis.

**Impact:** Caller-controlled registry identity, metadata and catalog revision
can be promoted into a valid resolution result. This violates the registry
identity/provenance invariant and can contaminate every consumer of the common
registry path.

**Minimum correction required:** Enforce the WeakSet or equivalent producer
proof for both `basis` and `entry` in every registration helper and application
boundary; reject detached/prototype-forged material; add direct forged entry,
forged basis, copied, stale and alternate-adapter negative witnesses. Keep old
bases unchanged on every rejection.

**Systemic pattern = YES**
**Related locations:** `src/domain/exec-registry.ts:322-351,400-438,550-585`;
`src/application/exec-registry.ts:101-103`;
`tests/exec-001-ticket-002.test.ts:94-105,233-253`.

### BEH-MAJOR-001 — Multi-version resolution selects the first candidate's support set

```text
FINDING_STATUS = OPEN
SEVERITY = MAJOR
TICKET = EXEC-001-TICKET-002
REQUIREMENTS = EXEC-VERSION-001, EXEC-VERSION-002, EXEC-REGISTRY-001, EXEC-CAPABILITY-001
ACCEPTANCE = AC-EXEC-003, AC-EXEC-004, AC-EXEC-008, AC-EXEC-011
CAPABILITY = UNIT-EXEC-REGISTRY-FIXTURE
DEPENDENCY_CLASS = INFORMATIONAL
LOCAL_CLOSURE_BLOCKING = YES
LOCAL_ACCEPTANCE_REQUIRES_PRODUCTIVE_CAPABILITY = NO
DEPENDENCY_CLASS_RECLASSIFICATION_REQUIRED = NO
UPSTREAM_DEPENDENCY_CLASSIFICATION_PRESERVED = YES
BLOCKS_LOCAL_EXECUTION = YES
BLOCKS_LOCAL_CLOSURE = YES
BLOCKS_TICKET_DONE = YES
BLOCKS_INTEGRATED_PROOF = YES
BLOCKS_SPEC_FINAL_CONFORMANCE = YES
PRIMARY_ROUTE = IMPLEMENTATION_REMEDIATION
DOWNSTREAM_CHECKPOINT = multi-version registry conformance
```

**Required behavior:** A requested explicitly supported version must resolve to
the matching registered complete entry in the frozen basis, independent of the
insertion order of other versions for the same capability/schema/stage.

**Production evidence:** The resolver gathers all identity/stage/schema
candidates but calls `VersionCompatibilityPolicy.resolve` only with
`schemaCandidates[0]` (`src/domain/exec-registry.ts:512-520`), then searches for
the selected version (`:520-521`). Distinct semantic versions are permitted by
the identity key, so this is an executable path, not an impossible state.

**Test evidence:** The direct mapping test registers one entry
(`tests/exec-001-ticket-002.test.ts:120-142`). The incompatibility test also
has one entry (`:197-213`). No test registers two versions of the same
capability/schema/stage. An independent two-entry execution (`1.0.0` then
`2.0.0`, request `2.0.0`) returned `FAILED / INCOMPATIBLE_CAPABILITY` instead
of resolving the `2.0.0` entry.

**Observed result:** A valid compatible later candidate is rejected when the
first candidate does not support the requested version.

**Expected result:** Select the requested exact version from the complete
candidate set, then validate the request's authoritative support set and the
selected entry's support set; resolve the matching entry deterministically.

**Problem:** Compatibility is evaluated before candidate selection and is
bound to array position rather than the requested semantic version.

**Impact:** Registries containing more than one version of a capability cannot
reliably resolve supported later versions, causing false
`INCOMPATIBLE_CAPABILITY` failures and breaking versioned cutover behavior.

**Minimum correction required:** Make version selection independent of insertion
order, add two-or-more-version positive tests with reversed registration order,
and retain unsupported/unknown negative assertions.

**Systemic pattern = YES**
**Related locations:** `src/domain/exec-registry.ts:485-490,512-521`;
`tests/exec-001-ticket-002.test.ts:120-142,197-213`.

### BEH-MAJOR-002 — Bootstrap “before work” behavior is only proxy-witnessed

```text
FINDING_STATUS = OPEN
SEVERITY = MAJOR
TICKET = EXEC-001-TICKET-002
REQUIREMENTS = EXEC-REGISTRY-003
ACCEPTANCE = AC-EXEC-010
CAPABILITY = UNIT-EXEC-REGISTRY-FIXTURE
DEPENDENCY_CLASS = INFORMATIONAL
LOCAL_CLOSURE_BLOCKING = YES
LOCAL_ACCEPTANCE_REQUIRES_PRODUCTIVE_CAPABILITY = NO
DEPENDENCY_CLASS_RECLASSIFICATION_REQUIRED = NO
UPSTREAM_DEPENDENCY_CLASSIFICATION_PRESERVED = YES
BLOCKS_LOCAL_EXECUTION = YES
BLOCKS_LOCAL_CLOSURE = YES
BLOCKS_TICKET_DONE = YES
BLOCKS_INTEGRATED_PROOF = YES
BLOCKS_SPEC_FINAL_CONFORMANCE = YES
PRIMARY_ROUTE = IMPLEMENTATION_REMEDIATION
DOWNSTREAM_CHECKPOINT = bootstrap/enablement integration proof
```

**Required behavior:** A normal capability requested in BOOTSTRAP must return
`INCOMPATIBLE_CAPABILITY` before repository enablement or normal work is
invoked.

**Production evidence:** The allowlist decision is local and returns a failure
at `src/domain/exec-registry.ts:493-497,522-524`. The TICKET-002 application
has no work/enablement operation or callback boundary; therefore it cannot
itself prove the “before work” isolation beyond returning a failure.

**Test evidence:** `tests/exec-001-ticket-002.test.ts:178-195` asserts
`INCOMPATIBLE_CAPABILITY`, `noApproval` and `noMutation`, and the evidence file
claims “before work.” No callback, enablement adapter or work operation is
instrumented or asserted. This is a direct result witness, not a direct
isolation witness.

**Observed result:** The canonical rejection result is demonstrated, but no
executable witness establishes that normal work/enablement is not invoked.

**Expected result:** A direct negative harness should invoke the actual
application boundary with an observable work/enablement callback and assert
zero calls when the BOOTSTRAP request is outside the allowlist.

**Problem:** The acceptance verb “before work” is not operationalized in the
implemented test surface. `noMutation`/`noApproval` are not equivalent to no
external invocation.

**Impact:** A future caller could perform work before inspecting the result
without violating any current test. The allowlist's destructive safety boundary
is therefore unproven at local closure.

**Minimum correction required:** Add a direct before-work test at the approved
boundary with a callback/adapter counter and assert no invocation, no
enablement and no approval for a normal BOOTSTRAP capability. Preserve the
canonical result-code assertion.

**Systemic pattern = YES**
**Related locations:** `src/domain/exec-registry.ts:493-497,522-524`;
`src/application/exec-registry.ts:43-50`;
`tests/exec-001-ticket-002.test.ts:178-195`;
`docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/AC-EXEC-010-bootstrap-allowlist.md`.

### BEH-MAJOR-003 — Complete mapping witness omits output-schema semantics

```text
FINDING_STATUS = OPEN
SEVERITY = MAJOR
TICKET = EXEC-001-TICKET-002
REQUIREMENTS = EXEC-REGISTRY-001
ACCEPTANCE = AC-EXEC-008
CAPABILITY = UNIT-EXEC-REGISTRY-FIXTURE
DEPENDENCY_CLASS = INFORMATIONAL
LOCAL_CLOSURE_BLOCKING = YES
LOCAL_ACCEPTANCE_REQUIRES_PRODUCTIVE_CAPABILITY = NO
DEPENDENCY_CLASS_RECLASSIFICATION_REQUIRED = NO
UPSTREAM_DEPENDENCY_CLASSIFICATION_PRESERVED = YES
BLOCKS_LOCAL_EXECUTION = YES
BLOCKS_LOCAL_CLOSURE = YES
BLOCKS_TICKET_DONE = YES
BLOCKS_INTEGRATED_PROOF = NO
BLOCKS_SPEC_FINAL_CONFORMANCE = YES
PRIMARY_ROUTE = IMPLEMENTATION_REMEDIATION
DOWNSTREAM_CHECKPOINT = complete registry mapping conformance
```

**Required behavior:** Deterministic resolution must return the complete
registered mapping, including both input and output schema references,
artifacts, verdicts and role restrictions.

**Production evidence:** `RegistryEntry` stores and returns `outputSchema`
(`src/domain/exec-registry.ts:278-317`), so the field is part of the required
mapping. The resolver returns the selected entry at lines 520-528.

**Test evidence:** The principal mapping assertions
(`tests/exec-001-ticket-002.test.ts:127-138`) assert stage, skill,
capability, semantic version, input schema, artifacts, verdicts, roles,
category, basis and requested version. They do not assert `result.entry.outputSchema`
or its schema ID/version. The AC-EXEC-008 evidence file consequently claims a
complete mapping without a corresponding output-schema assertion.

**Observed result:** The direct operation runs and returns an entry, but the
required output-schema semantics are untested; source presence is not a
witness.

**Expected result:** The direct test must assert output schema identity/version
and retain that assertion across a multi-version resolution case.

**Problem:** The acceptance witness is materially incomplete for one of the
normative mapping fields.

**Impact:** A regression that drops, substitutes or changes output schema could
pass the required suite while falsely closing AC-EXEC-008.

**Minimum correction required:** Add direct output-schema identity/version
assertions and an invalid/mismatched output-schema negative witness where the
contract permits it; update evidence only after the executable witness passes.

**Systemic pattern = NO**
**Related locations:** `src/domain/exec-registry.ts:278-317,520-528`;
`tests/exec-001-ticket-002.test.ts:120-142`;
`docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/AC-EXEC-008-deterministic-resolution.md`.

## Root-cause campaigns and surface matrices

The following campaigns remain open. They are evidence records, not remediation
or state transitions.

### RCC-EXEC-REGISTRY-AUTHORITY-PROVENANCE-001

```text
ROOT_CAUSE_ID = forgeable/structurally trusted authority-bearing registry material
CAMPAIGN_STATUS = OPEN
CAMPAIGN_SCOPE = EXEC-001-TICKET-002 source, registration and resolution boundaries
CANONICAL_FINDINGS = BEH-CRITICAL-001, BEH-CRITICAL-002
CAMPAIGN_MATRIX_COMPLETE = YES
ALL_SURFACE_ROWS_COVERED = NO (negative witnesses fail or are missing)
ALL_NEGATIVE_WITNESSES_PASS = NO
NO_UNEXPLAINED_PUBLIC_AUTHORITY_PATH = NO
NO_HIDDEN_CONCRETE_PROTOCOL = NOT_APPLICABLE
ROOT_CAUSE_REMOVED = NO
KNOWN_MANIFESTATIONS_CLOSED = NO
SYSTEMIC_TEST_EVIDENCE = PRESENT but incomplete
```

| Row | Surface class / location | Current behavior | Expected behavior | Coverage / negative witness |
|---|---|---|---|---|
| P-01 | ISSUER — `CatalogScope.normal`, `CatalogBasis.create`, source strings | Caller can mint repository scope and expected source text | Issuer/identity must be owner-bound and independently verifiable | MISSING — no caller-scope/source-forgery witness |
| P-02 | REGISTRAR — `CatalogBasis.register`, `registerRegistryEntry` | `instanceof`/caller basis can publish forged material | Only authenticated entries/bases can publish | MISSING — forged entry/basis executions succeed |
| P-03 | CONSUMER — `ResolveExecCapability.assertAuthorizedBasis` | Checks WeakSet basis, scope and plain source string | Verify producer provenance and exact scope | MISSING — forged expected-source adapter resolves |
| P-04 | ALTERNATE_AUTHORITY_PATH — `ResolveExecCapabilityInput` | Caller supplies scope and supported set | Obtain canonical identity/support authority from owner seams | MISSING — genuine caller values are accepted |
| P-05 | INJECTION_POINT — `ExecutionCatalogBasisReader`, `NormalCatalogSource` constructors | Structural adapters are injectable without issuer proof | Alternate adapter must satisfy provenance contract | MISSING — only wrong-source adapter tested |
| P-06 | MUTATION_PATH — basis registration/publication | Old basis is immutable, but forged material can enter new basis | Reject forged material before publication; old basis preserved | MISSING — forged entry/basis accepted |
| P-07 | STALE_PATH — source/basis observation | No producer-bound current revision/provenance revalidation | Reject stale/detached/foreign authority at owner boundary | OUTSIDE_SCOPE for physical stale reconstruction; local source proof missing |
| P-08 | PORT_SUBSTITUTION_PATH — source ports | Port substitution with expected marker succeeds | Alternate adapter must be directly contract-tested | MISSING |
| P-09 | PUBLIC_EXPORT — `CatalogBasis`, `RegistryEntry`, source constants, ports | Public factories/types expose the injection surfaces | Publicly reachable authority requires independent verification | MISSING |
| P-10 | TEST — `tests/exec-001-ticket-002.test.ts:233-277` | Negative coverage stops at fake shape/wrong marker | Direct forged expected-source/entry/basis tests | MISSING |

### RCC-EXEC-REGISTRY-VERSION-SELECTION-001

```text
ROOT_CAUSE_ID = candidate-order-dependent version selection
CAMPAIGN_STATUS = OPEN
CAMPAIGN_SCOPE = EXEC-001-TICKET-002 multi-version registry resolution
CANONICAL_FINDINGS = BEH-MAJOR-001
CAMPAIGN_MATRIX_COMPLETE = YES
ALL_SURFACE_ROWS_COVERED = NO
ALL_NEGATIVE_WITNESSES_PASS = NO
NO_UNEXPLAINED_PUBLIC_AUTHORITY_PATH = YES
NO_HIDDEN_CONCRETE_PROTOCOL = NOT_APPLICABLE
ROOT_CAUSE_REMOVED = NO
KNOWN_MANIFESTATIONS_CLOSED = NO
SYSTEMIC_TEST_EVIDENCE = MISSING for multi-version order independence
```

| Row | Surface class / location | Current behavior | Expected behavior | Coverage / witness |
|---|---|---|---|---|
| V-01 | ISSUER — `RegistryEntry.create` | Distinct semantic versions are valid entries | Each valid version can be selected by exact request | COVERED positive construction |
| V-02 | REGISTRAR — `CatalogBasis.register` | Insertion order is preserved | Order must not change exact-version result | MISSING multi-version order test |
| V-03 | CONSUMER — resolver `:512-521` | First candidate's support set controls all candidates | Select requested matching version | MISSING; direct adversarial failure |
| V-04 | ALTERNATE_AUTHORITY_PATH — multiple basis revisions | No alternate candidate-selection path | Every frozen basis resolves exact requested version | MISSING |
| V-05 | INJECTION_POINT — registered version set | Valid second version can be registered | Version set is a supported resolution case | COVERED only single-version fixture |
| V-06 | MUTATION_AND_STALE_PATH | No mutation is observed | Preserve basis while selecting version | COVERED old-basis checks; selection still defective |
| V-07 | STALE_PATH / PORT_SUBSTITUTION_PATH | Not applicable to pure local selection | Integrated source must preserve exact basis | OUTSIDE_SCOPE, owner DOM/REPO |
| V-08 | PUBLIC_EXPORT / TEST — resolver and direct suite | Public resolver exposes order-dependent behavior; tests use one entry | Reversed-order positive and unsupported negative tests | MISSING |

### RCC-EXEC-REGISTRY-WITNESS-COVERAGE-001

```text
ROOT_CAUSE_ID = acceptance verbs not mapped to direct executable isolation assertions
CAMPAIGN_STATUS = OPEN
CAMPAIGN_SCOPE = EXEC-001-TICKET-002 acceptance evidence
CANONICAL_FINDINGS = BEH-MAJOR-002, BEH-MAJOR-003
CAMPAIGN_MATRIX_COMPLETE = YES
ALL_SURFACE_ROWS_COVERED = NO
ALL_NEGATIVE_WITNESSES_PASS = NO
NO_UNEXPLAINED_PUBLIC_AUTHORITY_PATH = YES
NO_HIDDEN_CONCRETE_PROTOCOL = NOT_APPLICABLE
ROOT_CAUSE_REMOVED = NO
KNOWN_MANIFESTATIONS_CLOSED = NO
SYSTEMIC_TEST_EVIDENCE = PRESENT but proxy/incomplete
```

| Row | Surface class / location | Current behavior | Expected behavior | Coverage / witness |
|---|---|---|---|---|
| W-01 | ISSUER — `BootstrapAllowlistPolicy` | Returns incompatible result | Result must precede observable work/enablement | Proxy-only result test |
| W-02 | REGISTRAR — bootstrap basis fixture | Normal entry is present in bootstrap fixture | Direct before-work isolation at caller boundary | Missing callback/enablement witness |
| W-03 | CONSUMER — resolver/application path | No work boundary is exercised | Assert zero work/enablement invocations | Missing |
| W-04 | ALTERNATE_AUTHORITY_PATH — work/enablement adapter | No adapter is supplied | Direct negative isolation adapter | Missing |
| W-05 | INJECTION_POINT — output schema field | Returned entry contains output schema | Assert identity/version in resolved result | Missing assertion |
| W-06 | MUTATION_AND_STALE_PATH — frozen basis | Old basis checks pass | Complete mapping assertions survive basis immutability | Partial |
| W-07 | STALE/PERSISTENCE | Physical behavior is outside ticket | Do not claim local durable proof | NOT_APPLICABLE with explicit reason |
| W-08 | PORT_SUBSTITUTION/PUBLIC_EXPORT/TEST | Import guard and result assertions exist | Direct semantic assertions for every normative field | Partial; output schema omitted |

## Summary

Audit: `docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-implementation-behavior-audit.md`

Specialist:
`IMPLEMENTATION_BEHAVIOR`

Ticket: `EXEC-001-TICKET-002`

Required behavioral dimensions: 9

Required tests: 8

Required tests missing: 0

Required behaviors total: 9

Direct behavior witnesses: 8

Proxy-only behaviors: 1

Untested state transitions: 0

Unproven concurrency contracts: 0

Missing architecture guards: 0

Tests run: 60

Tests passed: 60

Tests failed: 0

Regressions: 0

Concurrency:
CONFORMANT

Stale behavior:
CONFORMANT

Idempotency:
CONFORMANT

Recovery:
NOT_APPLICABLE

Authority consumption:
DEFINED_BUT_NOT_CONSUMABLE

Temporal authority:
NOT_APPLICABLE

Caller-as-authority bypasses: 4

Findings:
CRITICAL=2
MAJOR=3
MINOR=0
INFO=0

Domain audit complete:
YES

Specialist result:
SPECIALIST_BEHAVIOR_FINDINGS

AUDIT_TARGET_HEAD: 36ac11c08d6e7b9416e41662646c2686fcfef677
AUDIT_TARGET_STATE_FINGERPRINT: 191ca7c9d2f15f71bc48ee2e17059438ed01efba281c261ad329e41532be6714
DOMAIN_AUDIT_COMPLETE: YES
SPECIALIST_RESULT: SPECIALIST_BEHAVIOR_FINDINGS