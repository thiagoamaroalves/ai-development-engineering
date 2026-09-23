# Implementation Behavior Audit — EXEC-001-TICKET-002

## Audit identity and inputs

```text
AUDIT_SKILL = audit-implementation-behavior
AUDIT_MODE = READ_ONLY; INDEPENDENT; ADVERSARIAL; BEHAVIOR_FIRST
TICKET_ID = EXEC-001-TICKET-002
TICKET_PATH = docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-version-registry-catalogs-capabilities.md
IMPLEMENTATION_UNIT = EXEC-IMP-02 — Version, registry resolution, catalogs and capability extensibility
REQUIREMENT_IDS = EXEC-VERSION-001, EXEC-VERSION-002, EXEC-REGISTRY-001, EXEC-REGISTRY-002, EXEC-REGISTRY-003, EXEC-CAPABILITY-001, EXEC-CAPABILITY-002
ACCEPTANCE_IDS = AC-EXEC-003, AC-EXEC-004, AC-EXEC-008, AC-EXEC-009, AC-EXEC-010, AC-EXEC-011, AC-EXEC-012
SPEC_PATH = docs/specs/SPEC-EXEC-001-skill-contracts-and-capability-registry.md
GAP_MATRIX_PATH = docs/specs/gap-matrices/SPEC-EXEC-001-implementation-gap-matrix.md
IMPLEMENTATION_PLAN_PATH = docs/specs/implementation-plans/SPEC-EXEC-001-implementation-plan.md
TICKET_SET_AUDIT_PATH = docs/tickets/SPEC-EXEC-001/implementation-ticket-audit.md
IMPLEMENTATION_DESIGN_PATH = docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-implementation-design.md
IMPLEMENTATION_BASELINE = d4216ad6f4a87fe7142ccd45d3fd099ef1b92955
CURRENT_HEAD = f8d34c11caca761fe562096588dcff6f3c5f3dab
AUDIT_TARGET_HEAD = f8d34c11caca761fe562096588dcff6f3c5f3dab
AUDIT_TARGET_STATE_FINGERPRINT = 98e064fd050a7ebb3264d2025ec1412d6d08e2544ed93e61e34be45a64798ca6
AUDIT_WAVE_ID = 3329addd-ecba-4610-a5b1-f2328dc46b8e
```

The pinned implementation commit is `HEAD`. Production and ticket-test files are
clean relative to that commit; unrelated documentary/workflow changes in the
working tree were not used as implementation evidence. No sibling specialist
audit artifact was read. The pinned state fingerprint is recorded as supplied.

### Changed production files

- `src/domain/exec-registry.ts`
- `src/domain/exec-contract.ts`
- `src/application/exec-registry.ts`
- `src/application/exec-registry-ports.ts`
- `src/composition/exec-registry.ts`

### Changed test files

- `tests/exec-001-ticket-002.test.ts`

### Changed local evidence files

The eight evidence files under
`docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/` for AC-EXEC-003,
AC-EXEC-005, AC-EXEC-007, AC-EXEC-008, AC-EXEC-009, AC-EXEC-010,
AC-EXEC-011 and AC-EXEC-012 are present. Their claimed test counts were
rechecked against executable output; claims of direct before-work and positive
supported-version resolution are not accepted where the test does not execute
those operations.

### Relevant test suites

```text
Ticket-specific: node --experimental-strip-types --test tests/exec-001-ticket-002.test.ts
Direct predecessor regression: node --experimental-strip-types --test tests/exec-001-ticket-001.test.ts
Root relevant suite: npm test
Type/architecture governance: npm run typecheck; npm run verify:audit-governance
```

## Authority-chain reconstruction

The authorized chain is:

```text
ADR-0003 revision 3 ACCEPTED
  -> SPEC-EXEC-001 requirements EXEC-VERSION-001/002,
     EXEC-REGISTRY-001/002/003, EXEC-CAPABILITY-001/002
  -> GAP-004, GAP-006, GAP-008, GAP-009, GAP-010, GAP-011
  -> EXEC-IMP-02 in the implementation plan
  -> EXEC-001-TICKET-002 and its approved implementation design
  -> repository implementation and executable tests
```

The contract requires semantic-version meaning and explicit supported sets,
deterministic complete entry resolution, independently sourced NORMAL and
BOOTSTRAP catalogs, bootstrap allowlisting before normal work, distinct
unknown/incompatible results, and common-path synthetic registration without
mutating a frozen basis. Physical persistence, recovery, execution effects,
DOM identity production and REPO enablement are outside this ticket, but their
integrated seams remain affected.

The ticket's authority records were reconciled as follows:

| Capability | Authority / producer | Consumer | Authority | Contract | Local testability | Productive availability | Dependency class | Audit result |
|---|---|---|---|---|---|---|---|---|
| `UNIT-EXEC-REGISTRY-FIXTURE` | EXEC local fixture | TICKET-002 domain/application tests | DEFINED | DEFINED | YES | NO | INFORMATIONAL | Consumable for local contract semantics only |
| `DOM-EXEC-IDENTITY-SNAPSHOT` | SPEC-DOM-001 / DOM canonical resolver | EXEC registry seam | DEFINED | DEFINED | NO | NO | REQUIRED_FOR_INTEGRATED_PROOF | Not productively consumable at this target; no local blocker |
| `REPO-EXEC-NORMAL-CATALOG` | SPEC-REPO-001 / enabled REPO configuration | EXEC NORMAL resolver seam | DEFINED | DEFINED | NO | NO | REQUIRED_FOR_INTEGRATED_PROOF | Not productively consumable at this target; no local blocker |

`AUTHORITY_CONSUMPTION_PROOF = ACP-EXEC-02`; local fixture receipts provide
contract-level evidence only and do not promote either foreign producer.
`PRODUCER_CONSUMER_CONTRACT_PROOF = PCP-DOM-EXEC-01,
PCP-REPO-EXEC-01`, both retained as integrated-only. `TEMPORAL_AUTHORITY_PROOF
= NOT_APPLICABLE`: the local basis is immutable and resolution commits no
external effect; catalog revision comparison is a stale-input check, not a
second observation before an effect.

`CALLER_AS_AUTHORITY_CHECK` is not globally PASS. Resolution through the
application rejects direct basis input and caller-selected repository context,
but the public registration/domain paths accept caller-created authenticated
basis values, and the exported source subclasses let caller code mint receipts.
These are reported as `CALLER_SUPPLIED_AUTHORITY_BYPASS` findings.

## Behavioral applicability matrix

| Dimension | Applicability | Required reason / observed scope | Result |
|---|---|---|---|
| `UNIT_BEHAVIOR` | REQUIRED | All version, entry, basis, policy and outcome rules are owned here. | PARTIAL: support-set resolution has an exact-entry gate defect. |
| `INTEGRATION_BEHAVIOR` | AFFECTED | DOM/REPO source seams and source provenance are consumed by the application boundary. | PARTIAL: local source contract works; productive foreign producers are unavailable. |
| `PERSISTENCE` | AFFECTED | Catalog revision and frozen-basis identity are represented, although physical storage is excluded. | PARTIAL: immutable in-process basis only; no durable catalog claim. |
| `CONCURRENCY` | AFFECTED | Duplicate registration and the local create-only basis transition are relevant; physical CAS is integrated-only. | CONFORMANT locally; physical one-winner behavior is not claimed. |
| `STALE_STATE` | AFFECTED | Application resolution must reject a requested revision that differs from the source-issued basis. | CONFORMANT locally. |
| `IDEMPOTENCY` | REQUIRED | Duplicate/conflicting registration must fail without changing the old basis. | CONFORMANT locally. |
| `DURABILITY` | NOT_APPLICABLE | Physical durability is explicitly PLAT/TICKET-003 scope and is not claimed here. | No local durability claim. |
| `RECOVERY` | NOT_APPLICABLE | Restart, replay and interrupted-operation recovery are explicitly outside TICKET-002. | No recovery claim. |
| `COMPATIBILITY` | REQUIRED | Semver, exact supported sets, schema/role compatibility and canonical failure codes are ticket-owned. | PARTIAL: supported compatible versions beyond the entry version cannot resolve. |
| `MIGRATION_BEHAVIOR` | NOT_APPLICABLE | The ticket only classifies `MIGRATION` as a bootstrap category; it does not execute migration. | Allowlist category is tested, migration workflow is not claimed. |
| `NEGATIVE_PATHS` | REQUIRED | Unknown, incompatible, duplicate, stale, forged and wrong-source inputs are normative. | PARTIAL: caller-mintable authority and a before-work proxy remain. |

## Acceptance witness audit

The six ticket matrix rows decompose into seven observable obligations. The
following compares the normative verb with the operation actually exercised.

| Obligation | Requirements / ACs | Production operation and result | Executed witness | Classification |
|---|---|---|---|---|
| Semantic major/minor/patch classification | EXEC-VERSION-001 / AC-EXEC-003 | `SemanticVersion.parse`, `compare` and `changeFrom` preserve components and classify numeric changes. | Ticket test asserts components, prerelease/build and NONE/PATCH/MINOR/MAJOR. | IMPLEMENTED_CORRECTLY; direct witness |
| Supported-set resolution | EXEC-VERSION-002 / AC-EXEC-003/004 | `SupportedVersionSet` has exact membership, but resolver first requires `candidate.semanticVersion.value === requestedVersion.value` at `src/domain/exec-registry.ts:527-530`. | Direct set membership and unsupported rejection pass; no test resolves a version present only in `supportedVersions`. An ad hoc probe returned `status=FAILED, code=INCOMPATIBLE_CAPABILITY` while `supported=true` for entry `1.2.3`, supported set `[1.2.3,1.3.0]`, request `1.3.0`. | PARTIAL; untested/incorrect compatible transition; `BEH-MAJOR-001` |
| Complete deterministic mapping | EXEC-REGISTRY-001 / AC-EXEC-008 | Resolver returns stage, capability, skill, exact version, schemas, artifacts, verdicts, roles and basis. Duplicate registration returns no new basis. | Ticket tests assert every mapped field, both registration orders and old-basis identity. | IMPLEMENTED_CORRECTLY; direct strong witness |
| NORMAL/BOOTSTRAP isolation | EXEC-REGISTRY-002 / AC-EXEC-009 | Application verifies authenticated receipt, expected kind, scope, revision and source. | Cross-repository, copied receipt, plain matching-source object, DOM substitution and stale revision cases fail closed. | PARTIAL: verifier accepts a caller-created subclass receipt; `BEH-CRITICAL-002` |
| Bootstrap allowlist and before-work rejection | EXEC-REGISTRY-003 / AC-EXEC-010 | `BootstrapAllowlistPolicy` rejects category `NORMAL` with `INCOMPATIBLE_CAPABILITY`; resolver returns no approval/mutation. There is no work invocation boundary in this ticket. | Result-code and allowlist assertions are direct. The `normalWork` callback is called only by a test-controlled `if (result.status === 'RESOLVED')` branch (`tests/exec-001-ticket-002.test.ts:257-261`), not by a production consumer. | PARTIAL; before-work evidence is proxy-only; `BEH-MAJOR-002` |
| Unknown/incompatible distinction | EXEC-CAPABILITY-001 / AC-EXEC-011 | Missing capability is classified `UNKNOWN_CAPABILITY`; known version/schema mismatch is `INCOMPATIBLE_CAPABILITY`; both fail closed. | Direct assertions for unknown, unsupported version and wrong schema. | IMPLEMENTED_CORRECTLY; direct strong witness |
| Common-path synthetic registration and frozen basis | EXEC-CAPABILITY-002 / AC-EXEC-012 | `CatalogBasis.register` returns a new basis and common resolver handles synthetic capability. | Synthetic registration/resolution and old basis immutability pass. A caller-created basis is also accepted through public registration/domain paths; `BEH-CRITICAL-001`. | PARTIAL; semantic path direct, authority provenance incomplete |

```text
REQUIRED_BEHAVIORS_TOTAL = 7
DIRECT_BEHAVIOR_WITNESSES = 5
PROXY_ONLY_BEHAVIORS = 1
UNTESTED_STATE_TRANSITIONS = 1
UNPROVEN_CONCURRENCY_CONTRACTS = 0 (local contract; physical CAS is integrated-only)
MISSING_ARCHITECTURE_GUARDS = 1
WITNESS_EXECUTABLE_AT_LOCAL_CLOSURE = NO for the supported-compatible positive and before-work obligations
```

The design's `DIRECT_BEHAVIOR_WITNESSES = 9` claim is not accepted as a
substitute for this audit: it includes no direct witness for a supported
version that differs from the entry version and treats the test-controlled
before-work branch as a production guard.

## Production semantic audit

### Correct or locally conformant behavior

- `SemanticVersion` preserves parsed components, prerelease/build fields and
  exact decimal comparison; build-only changes classify as `NONE`.
- `SupportedVersionSet` is immutable, rejects duplicates and authenticates its
  object identity; direct membership is exact and has no alias/range fallback.
- `RegistryEntry` validates authenticated schemas, semantic syntax, complete
  verdict/role fields, explicit supported-set membership of its own entry
  version, and freezes stored arrays.
- `CatalogBasis.register` publishes a new immutable basis, increments revision,
  rejects duplicate immutable identities and leaves the prior basis unchanged.
- Local resolver failure records carry `noMutation=true` and `noApproval=true`.
- Application NORMAL/BOOTSTRAP source selection checks receipt provenance,
  source kind, exact scope, requested revision and expected source marker.
- Unknown and incompatible outcomes remain distinct on the direct domain path.

### Partial or unsafe behavior

1. `RegistryResolutionService.resolve` filters candidates by exact entry version
   before invoking `VersionCompatibilityPolicy`. This makes any additional
   supported-set member unreachable. A semantically supported minor/patch
   request is reported incompatible. This is a required local behavior defect.
2. The application receipt check proves only that an object is an instance of
   the exported source subclass and that that instance issued the receipt. It
   does not prove that the issuer is the canonical DOM/REPO/system producer.
   Any caller can subclass the port and invoke the protected `issue` method on
   a caller-created basis. This is a caller-mintable authority path.
3. `RegisterExecCapability.register` and the exported
   `registerRegistryEntry` accept any authenticated `CatalogBasis`, while
   `CatalogBasis.create` is public. A caller can create a basis with an
   expected source marker and register/resolve canonical-looking material
   without a producer-issued receipt. The direct domain resolver has the same
   public-basis alternate path.
4. The bootstrap policy supplies the correct result code, but no production
   operation owns the subsequent work invocation. The test manually branches
   on the result, so the required “before work” property is not directly
   executed.

## Test inventory and assertion quality

| Category | Classification | Evidence and assessment |
|---|---|---|
| `UNIT` | REQUIRED_TEST_PRESENT | 16 ticket tests include direct value/policy assertions; strong for parsing and set membership. |
| `INVARIANT` | REQUIRED_TEST_PRESENT | Complete mapping, immutable basis, duplicate and no-mutation assertions are strong. |
| `INTEGRATION` | REQUIRED_TEST_PRESENT (contract-level) | Application source seams, scope, revision and source-kind checks are exercised with fixtures; productive DOM/REPO integration is unavailable and remains integrated-only. |
| `CROSS_SPEC` | REQUIRED_TEST_PRESENT (contract-level) | Scope/source substitution and DOM-vs-bootstrap substitution are exercised; fixture evidence cannot promote foreign producers. |
| `CONCURRENCY` | REQUIRED_TEST_PRESENT (local) | Ad hoc `Promise.all` duplicate registration probe produced two `CONTRACT_INVALID` outcomes and retained one entry; physical CAS remains outside scope. |
| `STALE` | REQUIRED_TEST_PRESENT | A source-issued basis requested at revision 1 when current revision is 2 fails `CONTRACT_INVALID`; no mutation/approval is asserted. |
| `IDEMPOTENCY` | REQUIRED_TEST_PRESENT | Duplicate and conflicting registrations reject and preserve `registryBasisIdentity`. |
| `COMPATIBILITY` | REQUIRED_TEST_MISSING | Direct set membership and unsupported rejection exist, but compatible resolution from an additional explicit support-set member is absent and fails under probe. |
| `RECOVERY` | TEST_CATEGORY_NOT_APPLICABLE | No restart/recovery operation is owned by the ticket. |
| `MIGRATION` | TEST_CATEGORY_NOT_APPLICABLE | No migration execution is owned by the ticket. |
| `NEGATIVE_PATH` | REQUIRED_TEST_PRESENT | Unknown, incompatible, duplicate, malformed, stale, forged and unavailable source paths are asserted. |
| `ARCHITECTURE_GUARD` | REQUIRED_TEST_MISSING | The test scans source text with regexes; it does not execute/validate the import graph. `BEH-MAJOR-003`. |
| `CONFORMANCE` | REQUIRED_TEST_PRESENT | Typecheck, governance verification and root regression suite pass. |

Assertion quality is `STRONG` for exact result codes, no-approval/no-mutation
flags, complete mapping fields, source scope/revision and old-basis identity.
It is `WEAK` for the before-work callback because the test owns the branch, and
`WEAK` for architecture because source text inspection is used as a proxy for
an executable architecture guard. The evidence files accurately report 16
passing ticket tests but overstate those two semantic proofs.

## Independent test execution

```text
Ticket-specific tests:
  node --experimental-strip-types --test tests/exec-001-ticket-002.test.ts
  16 passed, 0 failed, 0 skipped

Direct predecessor regression:
  node --experimental-strip-types --test tests/exec-001-ticket-001.test.ts
  21 passed, 0 failed, 0 skipped

Root relevant suite:
  npm test
  64 passed, 0 failed, 0 skipped

Typecheck:
  npm run typecheck
  PASS

Audit governance guard:
  npm run verify:audit-governance
  PASS

Skill mirror guard:
  npm run verify:skill-mirror
  PASS

Environmental failures = 0
```

Additional read-only runtime probes were executed against the pinned production
modules. They are not counted as committed tests:

- An entry at `1.2.3` with authenticated supported set `[1.2.3, 1.3.0]`
  received request `1.3.0`: output was
  `{"status":"FAILED","code":"INCOMPATIBLE_CAPABILITY","supported":true}`.
- Two equivalent duplicate registrations in `Promise.all` both returned
  `CONTRACT_INVALID`; the original basis retained one entry.
- A public caller-created basis with source marker `REPO_NORMAL_CATALOG` was
  accepted by `registerRegistryEntry` and direct domain resolution returned
  `REGISTERED` / `RESOLVED`.
- A caller-defined subclass of `AuthenticatedBootstrapCatalogSource` issued a
  receipt for a caller-created basis and application resolution returned
  `RESOLVED`, demonstrating the missing issuer boundary.

## Regression result

```text
IMPLEMENTATION_BASELINE = d4216ad6f4a87fe7142ccd45d3fd099ef1b92955
REGRESSION_RESULT = NO_REGRESSION
REGRESSIONS = 0
```

The TICKET-001 regression and complete root suite pass. No unrelated baseline
contract regression was found. The findings below are defects or proof gaps in
the new TICKET-002 behavior, not regressions in the predecessor.

## Conditional runtime dimensions

### Concurrency

`CONFORMANT` for the local immutable create-only contract. Duplicate equivalent
operations do not mutate the old basis, including the ad hoc concurrent probe.
A physical one-winner CAS/transaction is explicitly PLAT/integrated scope and
is not represented as locally proven.

### Stale state

`CONFORMANT` for the local application seam. `ResolveExecCapability` compares
the caller-requested revision with the source-issued basis revision and fails
closed on mismatch. No effect is committed after the mismatch. Registration's
caller-created basis issue is separately covered by the authority finding; it
is not a temporal revalidation claim.

### Idempotency

`CONFORMANT` locally. Duplicate immutable keys reject and preserve the prior
basis. Physical durable retry identity is outside scope.

### Durability / persistence

The local immutable basis is not durable persistence. No productive storage,
restart or recovery is claimed; this remains an integrated/TICKET-003 concern,
not a local pass for physical durability.

### Recovery

`NOT_APPLICABLE` to this ticket. There is no restart, replay, interrupted
operation or external effect path.

### Compatibility and migration

Compatibility is `PARTIAL` because explicit support-set membership does not
reach resolution for a version different from the entry version. Migration
execution is not applicable; only bootstrap category allowlisting is local.

### Authority consumption and provenance

Local fixture authority is consumable for contract semantics only. DOM and REPO
producer capabilities remain `PRODUCTIVE_AVAILABILITY=NO`, so the summary is
`DEFINED_BUT_NOT_CONSUMABLE` for integrated execution. This is preserved as an
integrated-only handoff, not silently promoted to a local capability blocker.

The receipt tests reject copied shapes, plain fake objects, stale revisions,
wrong source markers and DOM substitution. They do not reject a caller-created
subclass that owns the private ledger for its own receipt, nor a caller-created
valid `CatalogBasis` passed to registration/direct domain APIs. Those missing
negative witnesses are the two critical authority findings.

### Caller-as-authority bypass count

```text
CALLER_SUPPLIED_AUTHORITY_BYPASSES = 2
1. Public/caller-created CatalogBasis accepted by registration and direct resolver.
2. Caller-created exported source subclass can mint an accepted producer receipt.
```

## Root-cause campaigns and surface matrices

### RCC-EXEC-T002-PUBLIC-AUTHORITY-MINT

```text
ROOT_CAUSE_CAMPAIGN_ID = RCC-EXEC-T002-PUBLIC-AUTHORITY-MINT
ROOT_CAUSE_ID = caller-mintable catalog basis and source receipt authority
CAMPAIGN_STATUS = OPEN
CAMPAIGN_SCOPE = EXEC-001-TICKET-002 registry resolution, registration and source seams
CANONICAL_FINDINGS = BEH-CRITICAL-001, BEH-CRITICAL-002
```

| Surface row | Class | Location | Current behavior | Expected behavior | Coverage | Negative witness |
|---|---|---|---|---|---|---|
| AUTH-01 | ISSUER | `CatalogBasis.create`; `AuthenticatedCatalogBasisSource.issue` | Public creation and subclass issuance mint branded-looking authority. | Only canonical owner/producer can issue basis/receipt authority. | MISSING | `NW-CRIT-001`, `NW-CRIT-002` |
| AUTH-02 | REGISTRAR | `registerRegistryEntry`; `RegisterExecCapability.register` | Accepts caller-created authenticated basis without receipt/registrar proof. | Registrar must receive an approved source-issued current basis. | MISSING | `NW-CRIT-001` |
| AUTH-03 | CONSUMER | `RegistryResolutionService.resolve`; `ResolveExecCapability.assertAuthorizedBasis` | Domain accepts any branded basis; application accepts any expected-kind subclass receipt. | Consumer independently verifies issuer, scope, revision and provenance. | MISSING | `NW-CRIT-001`, `NW-CRIT-002` |
| AUTH-04 | ALTERNATE_AUTHORITY_PATH | Direct domain APIs and exported composition registration | Direct path bypasses application source selection. | No alternate canonical authority path, or same proof contract enforced. | MISSING | `NW-CRIT-001` |
| AUTH-05 | INJECTION_POINT | Caller `CatalogBasis.create` and caller-defined source subclass | Caller can inject valid-looking basis/receipt and obtain `RESOLVED`. | Caller injection must fail closed. | MISSING | `NW-CRIT-001`, `NW-CRIT-002` |
| AUTH-06 | MUTATION_PATH | `CatalogBasis.register` | Immutable old basis is preserved on duplicate; new basis is published from caller basis. | Preserve immutability and require authorized current basis. | PARTIAL | `NW-CRIT-001` |
| AUTH-07 | STALE_PATH | `ResolveExecCapability` revision check; registration API | Resolve checks stale revision; registration has no producer/current-basis check. | All authority-bearing transitions validate current source basis where applicable. | PARTIAL | `NW-CRIT-001` |
| AUTH-08 | PORT_SUBSTITUTION_PATH | `AuthenticatedBootstrapCatalogSource`, `NormalCatalogSource` | Expected kind is checked, issuer identity is not. | Alternate adapter must satisfy producer identity/provenance contract. | MISSING | `NW-CRIT-002` |
| AUTH-09 | PUBLIC_EXPORT | Exported source subclasses, `CatalogBasis`, `registerRegistryEntry` | Public exports expose mintable authority paths. | Public API must expose opaque verified receipts/factories only. | MISSING | `NW-CRIT-001`, `NW-CRIT-002` |
| AUTH-10 | PERSISTENCE | Physical catalog persistence | Not implemented by this ticket. | PLAT/TICKET-003 owns durable authority. | OUTSIDE_SCOPE | N/A; owner PLAT/TICKET-003 |
| AUTH-11 | RETRY_RECOVERY | Retry/restart paths | No such path. | TICKET-003/PLAT owns recovery. | NOT_APPLICABLE | N/A |
| AUTH-12 | TEST | `tests/exec-001-ticket-002.test.ts:317-401` | Forged prototypes/plain objects are rejected, but valid caller-created basis/subclass witnesses are absent. | Direct forged caller/alternate-adapter negatives pass. | MISSING | `NW-CRIT-001`, `NW-CRIT-002` |

`CAMPAIGN_MATRIX_COMPLETE = YES`; `ALL_SURFACE_ROWS_COVERED = NO`;
`ALL_NEGATIVE_WITNESSES_PASS = NO`; `NO_UNEXPLAINED_PUBLIC_AUTHORITY_PATH = NO`;
`ROOT_CAUSE_REMOVED = NO`; `KNOWN_MANIFESTATIONS_CLOSED = NO`;
`SYSTEMIC_TEST_EVIDENCE = PARTIAL`.

### RCC-EXEC-T002-SUPPORT-SELECTION

```text
ROOT_CAUSE_CAMPAIGN_ID = RCC-EXEC-T002-SUPPORT-SELECTION
ROOT_CAUSE_ID = exact entry-key filtering precedes explicit support-set compatibility
CAMPAIGN_STATUS = OPEN
CAMPAIGN_SCOPE = EXEC-001-TICKET-002 semantic-version and registry resolution
CANONICAL_FINDINGS = BEH-MAJOR-001
```

| Surface row | Class | Location | Current behavior | Expected behavior | Coverage |
|---|---|---|---|---|---|
| SUP-01 | ISSUER | `RegistryEntry.create` | Stores explicit set but only requires entry version be in it. | Preserve all declared supported versions for resolution. | PARTIAL |
| SUP-02 | REGISTRAR | `CatalogBasis.register` | Registers immutable entries but does not expose/support alternate set members in lookup. | Register a basis whose supported set can be consumed. | MISSING |
| SUP-03 | CONSUMER | `RegistryResolutionService.resolve:515-530` | Requires exact entry semantic version before calling support policy. | Match deterministic candidate then apply explicit set membership. | MISSING |
| SUP-04 | ALTERNATE_AUTHORITY_PATH | `VersionCompatibilityPolicy.resolve` | Direct policy can recognize a set member, but resolver does not route to it for alternate versions. | One canonical resolution path must use the policy. | PARTIAL |
| SUP-05 | INJECTION_POINT | `request.semanticVersion` | Unsupported is rejected; supported non-entry version is also rejected. | Only non-members are incompatible. | MISSING |
| SUP-06 | MUTATION_PATH | `CatalogBasis.register` | Old basis is immutable. | Preserve old basis while exposing new supported semantics. | COVERED |
| SUP-07 | STALE_PATH | source revision path | Stale source revision is rejected. | Preserve stale rejection independently of support selection. | COVERED |
| SUP-08 | PORT_SUBSTITUTION_PATH | source seams | Unrelated to support selection. | No alternate source may change support semantics. | NOT_APPLICABLE |
| SUP-09 | PUBLIC_EXPORT | `SupportedVersionSet`, policy and resolver exports | Public set is observable, but resolver path is incomplete. | Public behavior must match explicit support contract. | PARTIAL |
| SUP-10 | PERSISTENCE | Physical basis persistence | Outside ticket. | TICKET-003/PLAT owns durable support-set reconstruction. | OUTSIDE_SCOPE |
| SUP-11 | RETRY_RECOVERY | No retry/recovery path | Outside ticket. | No local claim. | NOT_APPLICABLE |
| SUP-12 | TEST | ticket test lines137-212 | Tests set membership and exact entry versions but not supported-only resolution. | Direct positive supported-only and negative unsupported tests. | MISSING |

`CAMPAIGN_MATRIX_COMPLETE = YES`; `ALL_SURFACE_ROWS_COVERED = NO`;
`ROOT_CAUSE_REMOVED = NO`; `KNOWN_MANIFESTATIONS_CLOSED = NO`.

### RCC-EXEC-T002-DIRECT-WITNESS-GAPS

```text
ROOT_CAUSE_CAMPAIGN_ID = RCC-EXEC-T002-DIRECT-WITNESS-GAPS
ROOT_CAUSE_ID = proxy assertions substituted for direct before-work and architecture witnesses
CAMPAIGN_STATUS = OPEN
CAMPAIGN_SCOPE = EXEC-001-TICKET-002 local acceptance evidence
CANONICAL_FINDINGS = BEH-MAJOR-002, BEH-MAJOR-003
```

| Surface row | Class | Location | Current behavior | Expected behavior | Coverage |
|---|---|---|---|---|---|
| WIT-01 | CONSUMER | `RegistryResolutionService` and absent work boundary | Returns rejection, but no production consumer operation is exercised before work. | Directly execute the boundary that gates work. | MISSING |
| WIT-02 | ARCHITECTURE_GUARD | `tests/exec-001-ticket-002.test.ts:454-469` | Regex scans source text. | Executable graph/conformance guard validates imports and common path. | MISSING |
| WIT-03 | TEST | bootstrap test `257-261` | Test-controlled conditional callback substitutes for work. | A real local consumer/operation must be denied work. | MISSING |
| WIT-04 | PUBLIC_EXPORT | Registry composition and port exports | No direct architecture guard protects future exported alternate paths. | Guard public dependency graph and authority boundary. | MISSING |
| WIT-05 | RETRY_RECOVERY | No local recovery route | Outside scope. | N/A. | NOT_APPLICABLE |

`CAMPAIGN_MATRIX_COMPLETE = YES`; `ALL_SURFACE_ROWS_COVERED = YES` for the
applicable local witness surfaces; `ALL_NEGATIVE_WITNESSES_PASS = NO`;
`ROOT_CAUSE_REMOVED = NO`; `KNOWN_MANIFESTATIONS_CLOSED = NO`.

## Findings

### BEH-CRITICAL-001 — Caller-created catalog basis is accepted as canonical authority

```text
FINDING_STATUS = OPEN
SEVERITY = CRITICAL
TICKET = EXEC-001-TICKET-002
REQUIREMENTS = EXEC-REGISTRY-001, EXEC-REGISTRY-002, EXEC-CAPABILITY-002
ACCEPTANCE = AC-EXEC-008, AC-EXEC-009, AC-EXEC-012
CAPABILITY = EXEC canonical catalog-basis registration authority
DEPENDENCY_CLASS = REQUIRED_FOR_LOCAL_CLOSURE
LOCAL_CLOSURE_BLOCKING = YES
LOCAL_ACCEPTANCE_REQUIRES_PRODUCTIVE_CAPABILITY = NO
CLOSURE_OWNERSHIP = LOCAL_TICKET
EVIDENCE_TIMING = LOCAL_CLOSURE
DEPENDENCY_CLASS_RECLASSIFICATION_REQUIRED = NO
UPSTREAM_DEPENDENCY_CLASSIFICATION_PRESERVED = YES
SUGGESTED_BLOCKS_LOCAL_EXECUTION = YES
SUGGESTED_BLOCKS_LOCAL_CLOSURE = YES
SUGGESTED_BLOCKS_TICKET_DONE = YES
SUGGESTED_BLOCKS_INTEGRATED_PROOF = YES
SUGGESTED_BLOCKS_SPEC_FINAL_CONFORMANCE = YES
PRIMARY_ROUTE = IMPLEMENTATION_REMEDIATION
DOWNSTREAM_CHECKPOINT = TICKET-002 local closure and integrated registry proof
DOWNSTREAM_OWNER = EXEC-001 / TICKET-002
ROOT_CAUSE_CAMPAIGN_ID = RCC-EXEC-T002-PUBLIC-AUTHORITY-MINT
Systemic pattern = YES
```

- **Required behavior:** A caller must not mint the current canonical catalog
  basis by constructing a valid-looking `CatalogBasis`; registration and direct
  resolution must consume an authority-owned/current basis or an opaque
  producer-issued receipt.
- **Production evidence:** `CatalogBasis.create` is public and brands the new
  object in the private WeakSet (`src/domain/exec-registry.ts:419-429`).
  `registerRegistryEntry` accepts any authenticated basis and returns a new
  registered basis (`src/domain/exec-registry.ts:559-562`).
  `RegisterExecCapability.register` forwards the caller basis without a source
  or registrar proof (`src/application/exec-registry.ts:128-130`). The direct
  `RegistryResolutionService` accepts any authenticated basis
  (`src/domain/exec-registry.ts:503-506`), so the source-verifying application
  boundary is bypassable through public domain exports.
- **Test evidence:** Existing forged material coverage only creates a forged
  prototype and expects it to fail (`tests/exec-001-ticket-002.test.ts:389-400`).
  The direct audit probe instead created a legitimate branded basis with
  `source='REPO_NORMAL_CATALOG'` and `repositoryId='caller-owned'`; registration
  returned `REGISTERED` and direct resolution returned `RESOLVED`.
- **Observed result:** Caller-created canonical-looking state is accepted and
  can be resolved without a producer-issued source receipt.
- **Expected result:** A basis not issued by the approved registrar/source must
  fail closed with `CONTRACT_INVALID`, no approval, no mutation and no
  canonical registration result.
- **Problem:** WeakSet authentication proves construction through a public
  static factory, not provenance or issuer ownership. The application protects
  only one resolution route; the registration and direct-domain routes are
  alternate authority paths.
- **Impact:** Caller input can establish scope/source/current basis and publish
  canonical-looking registry state, violating authority ownership and allowing
  cross-scope or wrong-source material to enter the registry contract.
- **Minimum correction required:** Make productive registration consume an
  opaque source/registrar-issued basis receipt (or an issuer-bound registrar
  factory) and reject caller-created bases, including valid public-factory
  instances. Close or guard the direct domain alternate path. Add direct
  negative witnesses for a valid caller-created basis, wrong source/scope and
  stale basis; retain the positive local fixture only as contract evidence.
- **Related locations:** `src/domain/exec-registry.ts:419-429,503-506,559-562`;
  `src/application/exec-registry.ts:128-130`; tests `389-400`.

### BEH-CRITICAL-002 — Exported source subclasses can mint accepted producer receipts

```text
FINDING_STATUS = OPEN
SEVERITY = CRITICAL
TICKET = EXEC-001-TICKET-002
REQUIREMENTS = EXEC-REGISTRY-002, EXEC-REGISTRY-003, EXEC-CAPABILITY-001, EXEC-CAPABILITY-002
ACCEPTANCE = AC-EXEC-009, AC-EXEC-010, AC-EXEC-011, AC-EXEC-012
CAPABILITY = DOM-EXEC-IDENTITY-SNAPSHOT / REPO-EXEC-NORMAL-CATALOG source provenance
DEPENDENCY_CLASS = REQUIRED_FOR_LOCAL_CLOSURE
LOCAL_CLOSURE_BLOCKING = YES
LOCAL_ACCEPTANCE_REQUIRES_PRODUCTIVE_CAPABILITY = NO
CLOSURE_OWNERSHIP = LOCAL_TICKET
EVIDENCE_TIMING = LOCAL_CLOSURE
DEPENDENCY_CLASS_RECLASSIFICATION_REQUIRED = NO
UPSTREAM_DEPENDENCY_CLASSIFICATION_PRESERVED = YES
SUGGESTED_BLOCKS_LOCAL_EXECUTION = YES
SUGGESTED_BLOCKS_LOCAL_CLOSURE = YES
SUGGESTED_BLOCKS_TICKET_DONE = YES
SUGGESTED_BLOCKS_INTEGRATED_PROOF = YES
SUGGESTED_BLOCKS_SPEC_FINAL_CONFORMANCE = YES
PRIMARY_ROUTE = IMPLEMENTATION_REMEDIATION
DOWNSTREAM_CHECKPOINT = TICKET-002 source provenance closure and integrated DOM/REPO proof
DOWNSTREAM_OWNER = EXEC-001 with DOM/REPO producer owners
ROOT_CAUSE_CAMPAIGN_ID = RCC-EXEC-T002-PUBLIC-AUTHORITY-MINT
Systemic pattern = YES
```

- **Required behavior:** The consumer must verify that an authority-bearing
  receipt came from the canonical producer owner. A caller-created alternate
  adapter must not be able to mint a producer receipt merely by matching the
  source kind.
- **Production evidence:** `AuthenticatedCatalogBasisSource` registers every
  subclass instance, stores its own receipt ledger and exposes protected
  `issue` (`src/application/exec-registry-ports.ts:24-37`). The exported
  `AuthenticatedBootstrapCatalogSource` and `NormalCatalogSource` are freely
  subclassable (`:57-75`). Consumer verification checks only instance ledger,
  expected kind and branded basis (`:83-95`); application verification then
  checks scope, revision and source marker (`src/application/exec-registry.ts:106-119`).
  No canonical issuer identity is verified.
- **Test evidence:** Plain matching-source objects, copied receipts, wrong
  source markers and DOM substitution are rejected (`tests/exec-001-ticket-002.test.ts:339-369`),
  but no caller-defined subclass negative exists. A direct audit probe defined
  a new `AuthenticatedBootstrapCatalogSource` subclass, called protected
  `issue` on a caller-created `SYSTEM_BOOTSTRAP_CATALOG` basis and obtained
  `status=RESOLVED, code=RESOLVED` from application resolution.
- **Observed result:** A caller can substitute an alternate adapter that mints
  accepted authority and resolve a capability as if it came from the system
  bootstrap producer.
- **Expected result:** Only the canonical producer-owned issuer/factory may
  issue a receipt; an unapproved alternate adapter or caller injection must
  return `CONTRACT_INVALID` with no approval/mutation.
- **Problem:** The receipt ledger authenticates the adapter instance's own
  issuance, not the authority owner's identity. Protected issuance is
  inherited by arbitrary caller subclasses, so the anti-forgery boundary is
  nominal rather than issuer-bound.
- **Impact:** Source substitution can bypass DOM/REPO/bootstrap authority and
  promote caller-created basis material to a resolved canonical capability.
  This is a `CALLER_SUPPLIED_AUTHORITY_BYPASS` and an alternate-adapter
  provenance failure.
- **Minimum correction required:** Replace subclass-mintable issuance with an
  issuer-private factory/opaque receipt bound to the canonical producer owner,
  or independently verify a producer-issued brand/token that alternate callers
  cannot mint. Add forged-subclass, copied-receipt, wrong-owner and alternate
  adapter compatibility tests for each source kind.
- **Related locations:** `src/application/exec-registry-ports.ts:24-37,45-75,83-95`;
  `src/application/exec-registry.ts:106-119`; tests `339-369`.

### BEH-MAJOR-001 — Explicit supported versions beyond the entry version are unreachable

```text
FINDING_STATUS = OPEN
SEVERITY = MAJOR
TICKET = EXEC-001-TICKET-002
REQUIREMENTS = EXEC-VERSION-001, EXEC-VERSION-002, EXEC-CAPABILITY-001
ACCEPTANCE = AC-EXEC-003, AC-EXEC-004, AC-EXEC-011
CAPABILITY = UNIT-EXEC-REGISTRY-FIXTURE / explicit supported-version resolution
DEPENDENCY_CLASS = REQUIRED_FOR_LOCAL_CLOSURE
LOCAL_CLOSURE_BLOCKING = YES
LOCAL_ACCEPTANCE_REQUIRES_PRODUCTIVE_CAPABILITY = NO
CLOSURE_OWNERSHIP = LOCAL_TICKET
EVIDENCE_TIMING = LOCAL_CLOSURE
DEPENDENCY_CLASS_RECLASSIFICATION_REQUIRED = NO
UPSTREAM_DEPENDENCY_CLASSIFICATION_PRESERVED = YES
SUGGESTED_BLOCKS_LOCAL_EXECUTION = YES
SUGGESTED_BLOCKS_LOCAL_CLOSURE = YES
SUGGESTED_BLOCKS_TICKET_DONE = YES
SUGGESTED_BLOCKS_INTEGRATED_PROOF = YES
SUGGESTED_BLOCKS_SPEC_FINAL_CONFORMANCE = YES
PRIMARY_ROUTE = IMPLEMENTATION_REMEDIATION
DOWNSTREAM_CHECKPOINT = TICKET-002 semver/support-set conformance
DOWNSTREAM_OWNER = EXEC-001 / TICKET-002
ROOT_CAUSE_CAMPAIGN_ID = RCC-EXEC-T002-SUPPORT-SELECTION
Systemic pattern = YES
```

- **Required behavior:** A version in an entry's explicit supported set must
  resolve; only a version outside that set is `INCOMPATIBLE_CAPABILITY`, with
  no alias or conversion.
- **Production evidence:** `VersionCompatibilityPolicy.resolve` correctly
  checks `entry.supports` (`src/domain/exec-registry.ts:484-493`), but the
  resolver first selects only a candidate whose `semanticVersion.value` equals
  the requested version (`:521-530`). `RegistryEntry.create` requires the
  entry's own version in the set, so additional supported-set members become
  dead for resolution.
- **Test evidence:** The ticket test checks direct set membership for `1.2.3`
  and `1.3.0` (`tests/exec-001-ticket-002.test.ts:137-147`) and tests only
  exact registered entry versions (`:189-212`). There is no positive resolver
  witness for a supported version different from the entry version. The audit
  probe observed `supported=true` but `status=FAILED, code=INCOMPATIBLE_CAPABILITY`
  for that case.
- **Observed result:** Compatible minor/patch support is rejected as if it were
  not registered.
- **Expected result:** Deterministically select the applicable entry and apply
  its authoritative explicit support set; return `RESOLVED` for each supported
  member and `INCOMPATIBLE_CAPABILITY` only for non-members.
- **Problem:** Complete-key exact-version selection is performed before the
  support policy, making the policy semantically redundant except for the
  entry's own version.
- **Impact:** Legitimate compatible versions cannot be resolved, violating
  EXEC-VERSION-002 and the semver/support acceptance witness while producing a
  false incompatibility outcome.
- **Minimum correction required:** Select a deterministic candidate by the
  complete non-version identity and apply the entry-owned `SupportedVersionSet`
  to the requested version, with deterministic handling when multiple entries
  support it. Add positive supported-only and negative unsupported resolver
  tests and assert no alias/conversion.
- **Related locations:** `src/domain/exec-registry.ts:380-382,484-493,521-530`;
  tests `137-147,189-212`.

### BEH-MAJOR-002 — Bootstrap before-work evidence is a test-controlled proxy

```text
FINDING_STATUS = OPEN
SEVERITY = MAJOR
TICKET = EXEC-001-TICKET-002
REQUIREMENTS = EXEC-REGISTRY-003
ACCEPTANCE = AC-EXEC-010
CAPABILITY = UNIT-EXEC-REGISTRY-FIXTURE / bootstrap work-gating witness
DEPENDENCY_CLASS = REQUIRED_FOR_LOCAL_CLOSURE
LOCAL_CLOSURE_BLOCKING = YES
LOCAL_ACCEPTANCE_REQUIRES_PRODUCTIVE_CAPABILITY = NO
CLOSURE_OWNERSHIP = LOCAL_TICKET
EVIDENCE_TIMING = LOCAL_CLOSURE
DEPENDENCY_CLASS_RECLASSIFICATION_REQUIRED = NO
UPSTREAM_DEPENDENCY_CLASSIFICATION_PRESERVED = YES
SUGGESTED_BLOCKS_LOCAL_EXECUTION = YES
SUGGESTED_BLOCKS_LOCAL_CLOSURE = YES
SUGGESTED_BLOCKS_TICKET_DONE = YES
SUGGESTED_BLOCKS_INTEGRATED_PROOF = YES
SUGGESTED_BLOCKS_SPEC_FINAL_CONFORMANCE = YES
PRIMARY_ROUTE = IMPLEMENTATION_REMEDIATION
DOWNSTREAM_CHECKPOINT = TICKET-002 bootstrap before-work witness
DOWNSTREAM_OWNER = EXEC-001 / TICKET-002
ROOT_CAUSE_CAMPAIGN_ID = RCC-EXEC-T002-DIRECT-WITNESS-GAPS
Systemic pattern = YES
```

- **Required behavior:** A NORMAL capability requested in BOOTSTRAP must be
  rejected before enablement or normal work is invoked.
- **Production evidence:** `BootstrapAllowlistPolicy.permits` and resolver
  failure classification are present (`src/domain/exec-registry.ts:496-500,531-537`),
  but the TICKET-002 implementation has no operation that invokes or gates
  normal work after resolution.
- **Test evidence:** The test asserts `INCOMPATIBLE_CAPABILITY`,
  `noApproval` and `noMutation` (`tests/exec-001-ticket-002.test.ts:247-256`).
  It then creates `normalWork` locally and invokes it only if the already
  asserted result were `RESOLVED` (`:257-261`). The production resolver never
  receives this callback and the test never executes a real work consumer.
- **Observed result:** The result code is correct, but the required
  before-work transition is not directly witnessed.
- **Expected result:** An executable local consumer/operation must demonstrate
  that rejected bootstrap resolution cannot invoke normal work, or the ticket
  must explicitly reclassify this proof as integrated-only rather than claim
  local closure.
- **Problem:** A test-controlled branch models the consumer decision and can
  pass even though an actual caller could ignore the result and invoke work.
- **Impact:** AC-EXEC-010's safety boundary is unproven; a false positive could
  permit bootstrap leakage into normal execution at the integration seam.
- **Minimum correction required:** Add a direct contract-level work-gating
  operation/test that invokes work only from a resolved allowlisted result and
  asserts the NORMAL bootstrap path cannot invoke it, or obtain the approved
  integrated consumer witness and preserve the local-closure classification
  honestly.
- **Related locations:** `src/domain/exec-registry.ts:496-500,531-537`;
  `tests/exec-001-ticket-002.test.ts:247-269`.

### BEH-MAJOR-003 — Architecture guard relies on source-text scanning only

```text
FINDING_STATUS = OPEN
SEVERITY = MAJOR
TICKET = EXEC-001-TICKET-002
REQUIREMENTS = EXEC-REGISTRY-001, EXEC-CAPABILITY-002
ACCEPTANCE = AC-EXEC-008, AC-EXEC-012
CAPABILITY = TICKET-002 architecture/conformance guard
DEPENDENCY_CLASS = REQUIRED_FOR_LOCAL_CLOSURE
LOCAL_CLOSURE_BLOCKING = YES
LOCAL_ACCEPTANCE_REQUIRES_PRODUCTIVE_CAPABILITY = NO
CLOSURE_OWNERSHIP = LOCAL_TICKET
EVIDENCE_TIMING = LOCAL_CLOSURE
DEPENDENCY_CLASS_RECLASSIFICATION_REQUIRED = NO
UPSTREAM_DEPENDENCY_CLASSIFICATION_PRESERVED = YES
SUGGESTED_BLOCKS_LOCAL_EXECUTION = YES
SUGGESTED_BLOCKS_LOCAL_CLOSURE = YES
SUGGESTED_BLOCKS_TICKET_DONE = YES
SUGGESTED_BLOCKS_INTEGRATED_PROOF = YES
SUGGESTED_BLOCKS_SPEC_FINAL_CONFORMANCE = YES
PRIMARY_ROUTE = IMPLEMENTATION_REMEDIATION
DOWNSTREAM_CHECKPOINT = TICKET-002 architecture/conformance closure
DOWNSTREAM_OWNER = EXEC-001 / TICKET-002
ROOT_CAUSE_CAMPAIGN_ID = RCC-EXEC-T002-DIRECT-WITNESS-GAPS
Systemic pattern = YES
```

- **Required behavior:** The first productive registry owner must have an
  executable architecture guard proving no infrastructure, transport,
  prototype or generic-bucket dependency and preserving one common path.
- **Production evidence:** Current imports are clean in the inspected files,
  but that is source evidence, not an executable architectural guard.
- **Test evidence:** `tests/exec-001-ticket-002.test.ts:454-469` reads source
  text and applies regexes. It does not execute an import/dependency graph,
  exercise the guard against a forbidden edge, or prove that dynamic/indirect
  dependencies cannot bypass it.
- **Observed result:** The static check passes, but the required architecture
  guard remains unproven under the direct-witness rule.
- **Expected result:** A dedicated executable architecture/conformance guard
  must validate the actual module graph/common registry path, with a negative
  forbidden-edge witness where applicable.
- **Problem:** Source inspection is a proxy for an architecture guard and can
  miss indirect, dynamic or generated dependency edges.
- **Impact:** Architecture drift or an alternate authority path can enter while
  the suite remains green; the required conformance evidence is incomplete.
- **Minimum correction required:** Replace or supplement the regex-only test
  with an executable import-graph/dependency guard and direct common-path
  conformance witness. Record any intentionally static portion as static
  evidence rather than as a complete architecture guard.
- **Related locations:** `tests/exec-001-ticket-002.test.ts:454-469` and the
  productive graph files listed under changed production files.

## Local versus integrated completion effects

The ticket and plan classify DOM/REPO productive capabilities as
`REQUIRED_FOR_INTEGRATED_PROOF`, with `PRODUCTIVE_AVAILABILITY=NO` and
`LOCAL_CLOSURE_BLOCKING=NO`. That classification is preserved here:

```text
UPSTREAM_DEPENDENCY_CLASSIFICATION_PRESERVED = YES
INTEGRATED_ONLY_AVAILABILITY_BLOCKING_LOCAL_DONE = 0
NO_DOWNSTREAM_CAPABILITY_PROMOTION_WITHOUT_NEW_EVIDENCE = YES
```

The five findings above are local behavioral/provenance/witness obligations,
not a silent reclassification of the unavailable DOM/REPO producer. Their
suggested local blocking effects are evidence for canonical consolidation; this
specialist does not assign the final ticket gate. The productive foreign
producer gap remains an integrated follow-up owned by DOM/REPO at the approved
checkpoint.

## Summary

Audit: `.pi/runtime/workflow-audits/3329addd-ecba-4610-a5b1-f2328dc46b8e/behavior-EXEC-001-TICKET-002-implementation-behavior-audit.md`

Specialist:
IMPLEMENTATION_BEHAVIOR

Ticket: EXEC-001-TICKET-002

Required behavioral dimensions: 9

Required tests: 10

Required tests missing: 2

Required behaviors total: 7

Direct behavior witnesses: 5

Proxy-only behaviors: 1

Untested state transitions: 1

Unproven concurrency contracts: 0

Missing architecture guards: 1

Tests run: 64

Tests passed: 64

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

Caller-as-authority bypasses: 2

Findings:
CRITICAL=2
MAJOR=3
MINOR=0
INFO=0

Domain audit complete:
YES

Specialist result:
SPECIALIST_BEHAVIOR_FINDINGS

AUDIT_TARGET_HEAD: f8d34c11caca761fe562096588dcff6f3c5f3dab
AUDIT_TARGET_STATE_FINGERPRINT: 98e064fd050a7ebb3264d2025ec1412d6d08e2544ed93e61e34be45a64798ca6
AUDIT_WAVE_ID: 3329addd-ecba-4610-a5b1-f2328dc46b8e
DOMAIN_AUDIT_COMPLETE: YES
SPECIALIST_RESULT: SPECIALIST_BEHAVIOR_FINDINGS