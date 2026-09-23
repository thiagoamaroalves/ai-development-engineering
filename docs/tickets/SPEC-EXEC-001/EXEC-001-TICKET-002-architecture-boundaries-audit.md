# Architecture Boundaries Audit — EXEC-001-TICKET-002

## Audit identity

```text
AUDIT_SKILL = audit-architecture-boundaries
SPECIALIST = ARCHITECTURE_BOUNDARIES
AUDIT_MODE = READ_ONLY INDEPENDENT ADVERSARIAL ARCHITECTURE_FIRST
TICKET_ID = EXEC-001-TICKET-002
TICKET_PATH = docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-version-registry-catalogs-capabilities.md
IMPLEMENTATION_UNIT = EXEC-IMP-02
IMPLEMENTATION_DESIGN_PATH = docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-implementation-design.md
TICKET_SET_AUDIT_PATH = docs/tickets/SPEC-EXEC-001/implementation-ticket-audit.md
SPEC_PATH = docs/specs/SPEC-EXEC-001-skill-contracts-and-capability-registry.md
ADR_PATHS = docs/adrs/ADR-0003-versioned-skill-contracts.md; docs/adrs/ADR-0010-repository-configuration-and-legacy-migration.md; upstream DOM identity/snapshot contract
GAP_IDS = GAP-004, GAP-006, GAP-008, GAP-009, GAP-010, GAP-011
REQUIREMENT_IDS = EXEC-VERSION-001/002, EXEC-REGISTRY-001/002/003, EXEC-CAPABILITY-001/002
IMPLEMENTATION_BASELINE = d4216ad6f4a87fe7142ccd45d3fd099ef1b92955 (ticket semantic baseline)
CURRENT_HEAD = f8d34c11caca761fe562096588dcff6f3c5f3dab
AUDIT_TARGET_HEAD = f8d34c11caca761fe562096588dcff6f3c5f3dab
AUDIT_TARGET_STATE_FINGERPRINT = 98e064fd050a7ebb3264d2025ec1412d6d08e2544ed93e61e34be45a64798ca6
WORKTREE_OVERLAY = present; documented unrelated workflow changes; pinned semantic target unchanged during audit
```

The pinned HEAD was verified as the current HEAD. Production source and focused
implementation tests were audited at that target. Existing sibling specialist
audit artifacts were not used as evidence. The ticket is `VALIDATION_REQUIRED`
and declares `IMPLEMENTATION_STATUS = IMPLEMENTED`; those claims were treated as
claims and checked against source and executable evidence.

### Subject changed files

The implementation subject consists of:

- `src/domain/exec-registry.ts`
- `src/application/exec-registry.ts`
- `src/application/exec-registry-ports.ts`
- `src/composition/exec-registry.ts`
- `tests/exec-001-ticket-002.test.ts`
- `docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/AC-EXEC-003-semver.md`
- `docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/AC-EXEC-005-registry-contribution.md`
- `docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/AC-EXEC-007-registry-contribution.md`
- `docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/AC-EXEC-008-deterministic-resolution.md`
- `docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/AC-EXEC-009-catalog-isolation.md`
- `docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/AC-EXEC-010-bootstrap-allowlist.md`
- `docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/AC-EXEC-011-failure-distinction.md`
- `docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/AC-EXEC-012-registry-extensibility.md`

The remediation/checkpoint documents are workflow evidence, not additional
production ownership. `src/domain/exec-contract.ts` is a predecessor contract
reused by this implementation and was not treated as a TICKET-002 ownership
change.

## Source precedence and reconstructed contract

Authority was applied in this order:

```text
accepted ADR
→ canonical SPEC and accepted upstream DOM contract
→ explicit cross-SPEC ownership contracts
→ validated Gap Matrix
→ Implementation Plan
→ approved Implementation Design
→ Ticket
→ repository implementation and tests
```

### Local owner and authority

`SPEC-EXEC-001 / EXEC-001` owns:

- semantic-version meaning and explicit supported-version membership;
- deterministic versioned registry mapping;
- NORMAL versus BOOTSTRAP catalog separation;
- the BOOTSTRAP allowlist;
- `UNKNOWN_CAPABILITY`, `INCOMPATIBLE_CAPABILITY`, and local registry
  `CONTRACT_INVALID` classification;
- common registry registration and resolution extensibility.

The implementation places these rules in `src/domain/exec-registry.ts`, with
application orchestration in `src/application/exec-registry.ts` and composition
in `src/composition/exec-registry.ts`. No foreign lifecycle, enablement,
transport, persistence, or external-effect authority was found in those paths.

### Foreign owners and consumed capabilities

- DOM owns canonical `RepositoryId`, execution identity, snapshot identity,
  exact execution basis, and lifecycle. The approved capability is
  `DOM-EXEC-IDENTITY-SNAPSHOT`.
- REPO owns enabled repository configuration and the repository-scoped NORMAL
  catalog source. The approved capability is `REPO-EXEC-NORMAL-CATALOG`.
- PLAT owns physical persistence, integrity, ordering, CAS, and recovery; it is
  outside this ticket and belongs to the registry reconstruction boundary.
- REPO owns legacy configuration adaptation and enablement; EXEC does not own
  legacy writes.

The first two capabilities are explicitly
`AUTHORITY_STATUS = DEFINED`, `CONTRACT_STATUS = DEFINED`,
`PRODUCTIVE_AVAILABILITY = NO`, and
`DEPENDENCY_CLASS = REQUIRED_FOR_INTEGRATED_PROOF`. A local fixture is not a
productive producer.

### Canonical identity, immutability, and lineage rules

For NORMAL, the accepted identity is
`(CatalogScope=NORMAL, RepositoryId, SkillContractId, CapabilityId, SchemaId,
SemanticVersion)`. For BOOTSTRAP it is the independent system scope plus the
contract/capability/schema/version tuple, without `RepositoryId`.
`CatalogBasis` and `RegistryEntry` are immutable local values. Registration
creates a new basis, duplicate/conflicting registration fails without mutation,
and the previous basis remains frozen. `CatalogRevision` is distinct from
semantic version. Full persisted reconstruction, digest/source validation,
revision continuity, and stale/detached material rejection belong to the
TICKET-003/PLAT boundary and are not silently claimed here.

### Legacy, cutover, and non-scope

This ticket introduces the `NEW_CANONICAL_PATH` and local `CUTOVER` semantics:
a semantic/catalog change creates a new version or basis and does not rewrite a
frozen basis. Legacy compatibility remains a REPO concern. There is no local
migration, destructive deletion, external effect, authorization route, or
security boundary.

## Applicability matrix

| Dimension | Classification | Result and reason |
|---|---|---|
| OWNERSHIP | REQUIRED | The ticket creates the EXEC registry owner and consumes DOM/REPO boundaries. |
| CANONICAL_AUTHORITY | REQUIRED | The ticket creates the canonical EXEC resolution and registration decision path. |
| CROSS_SPEC_INTEGRATION | AFFECTED | DOM identity/execution basis and REPO NORMAL material are declared integrated-only inputs. |
| IDENTITY | AFFECTED | NORMAL lookup binds `RepositoryId`; the local implementation must not replace DOM identity with aliases or caller authority. |
| IMMUTABILITY | REQUIRED | Frozen catalog bases and entries must not be rewritten by registration or failure. |
| LINEAGE | AFFECTED | Local new-basis revision and predecessor preservation are in scope; semantic reconstruction/history is TICKET-003. |
| LEGACY_TRANSITION | AFFECTED | The ticket declares new canonical registry/cutover behavior while REPO retains legacy compatibility. |
| DESTRUCTIVE_TRANSITION | NOT_APPLICABLE | No delete, overwrite, irreversible retirement, or destructive migration is implemented. |
| MIGRATION_AUTHORITY | NOT_APPLICABLE | No migration or enablement operation is implemented; REPO owns that boundary. |
| SECURITY_AUTHORIZATION | NOT_APPLICABLE | No authorization decision, credential, route, or privilege elevation is changed. |

## Audit results

### Ownership and canonical authority

```text
OWNERSHIP = OWNERSHIP_PRESERVED locally
FOREIGN_CAPABILITY_DUPLICATION = 0
AUTHORITY = LOCAL_EXEC_AUTHORITY_PRESERVED
DUAL_AUTHORITY = NOT_OBSERVED
ALTERNATE_AUTHORITY_INTRODUCED = NOT_OBSERVED locally
PROJECTION_USED_AS_AUTHORITY = NO
REPOSITORY_SEMANTIC_AUTHORITY = NO
```

`SemanticVersion`, `SupportedVersionSet`, `RegistryEntry`, `CatalogBasis`, the
allowlist, compatibility policy, and resolution service all reside in the EXEC
domain boundary. The application layer selects a source and delegates domain
meaning; it does not duplicate the compatibility or allowlist rules. No DOM
lifecycle or REPO enablement state is created locally. The local registrar is
an authorized EXEC owner path, not a second foreign owner.

There is nevertheless an integration boundary defect recorded as
`ARCH-MAJOR-001`: the declared DOM execution-basis capability has no executable
consumer path, and the source receipt proves only a local port-issued receipt,
not the upstream canonical DOM/REPO producer at the integrated execution point.
This is not counted as a local dual-writer finding because productive DOM/REPO
availability is explicitly not claimed.

### Cross-SPEC authority consumption and producer/consumer proof

| Capability | Authority owner / producer | Consumer evidence | Authority | Contract | Local testability | Productive availability | Class | Result |
|---|---|---|---|---|---|---|---|---|
| `DOM-EXEC-IDENTITY-SNAPSHOT` | DOM canonical resolver | `ExecutionCatalogBasisReader` is declared, but `ResolveExecCapability` does not accept or call it; the only DOM fixture use is a negative bootstrap substitution | DEFINED | DEFINED | NO | NO | REQUIRED_FOR_INTEGRATED_PROOF | `AUTHORITY_CONSUMPTION_GAP`; `INTEGRATION_NOT_PROVEN` |
| `REPO-EXEC-NORMAL-CATALOG` | REPO enabled configuration | `NormalCatalogSource` is accepted and read by `ResolveExecCapability` | DEFINED | DEFINED | NO | NO | REQUIRED_FOR_INTEGRATED_PROOF | `AUTHORITY_CONSUMPTION_GAP`; source seam exists but productive producer is absent |
| `UNIT-EXEC-REGISTRY-FIXTURE` | local test fixture | direct focused tests | DEFINED | DEFINED | YES | NO | INFORMATIONAL | contract evidence only; never productive availability |

The application checks source class/receipt identity, expected source kind,
expected source label, exact scope, and exact catalog revision. Those checks are
useful local provenance checks, but they cannot establish that a foreign
producer actually issued the canonical `RepositoryId`, execution basis, or
enabled REPO material. `CatalogBasisSourceReceipt` carries a locally
authenticated `CatalogBasis`; it does not transport an independently verified
DOM identity/reference or REPO producer proof.

The ticket's local readiness claims do not depend on these capabilities because
the dependency class is integrated-only. The integrated proof remains open and
must not be promoted from the fixture evidence.

### Identity audit

```text
IDENTITY_RESULT = PARTIAL
IDENTITY_VIOLATIONS = 0
```

The local entry key is stable, scoped, versioned, and does not use labels,
paths, branches, or URLs. Scope objects and registry entries are authenticated
within the EXEC domain and are immutable. However, the integrated NORMAL path
has no executable DOM producer binding: `CatalogScope.normal(repositoryId)` is
caller-created context and is only compared with the basis returned by the
NORMAL source. Without the DOM execution-basis consumer, the canonical
`RepositoryId` attachment for an integrated execution is not proven. This is
covered by `ARCH-MAJOR-001`, not treated as an observed local identity
replacement.

### Immutability and lineage audit

```text
IMMUTABILITY_RESULT = CONFORMANT for local immutable bases
LINEAGE_RESULT = PARTIAL within ticket scope; full reconstruction is outside scope
IMMUTABILITY_LINEAGE_VIOLATIONS = 0
```

`Object.freeze`, authenticated instance ledgers, new-basis publication, and
no-mutation failures preserve local history. Duplicate registration, forged
material, wrong source, and stale revision rejection leave the prior basis
unchanged. `CatalogRevision` increments on local registration, but persistence,
continuity across restart, digest, ordered history, detached material, and
semantic rehydration are not implemented here and correctly remain assigned to
TICKET-003/PLAT.

### Legacy and cutover audit

```text
LEGACY_RESULT = TRANSITION_CONFORMANT locally
LEGACY_AUTHORITY_VIOLATIONS = 0
DESTRUCTIVE_TRANSITION = NOT_APPLICABLE
```

No legacy writer or alternate registry writer was found. The local path uses
new immutable bases; REPO remains the owner of legacy configuration mapping and
enablement. No destructive transition was performed, so replacement proof,
pre-transition gates, post-transition guards, and rollback semantics are not
applicable.

### Migration and authorization audit

```text
MIGRATION_RESULT = NOT_APPLICABLE
AUTHORIZATION_RESULT = NOT_APPLICABLE
```

No migration logic, configuration promotion, HTTP route, credential, role
check, or effect authorization is present in the audited ticket scope. The
BOOTSTRAP allowlist is a catalog capability boundary, not a security
authorization implementation.

### Temporal authority and caller-as-authority checks

```text
TEMPORAL_AUTHORITY_PROOF = NOT_APPLICABLE
TEMPORAL_AUTHORITY_GAPS = 0
CALLER_AS_AUTHORITY_CHECK = PASS for the local consumer path
CALLER_SUPPLIED_AUTHORITY_BYPASSES = 0
```

The local operation reads an immutable basis and produces a resolution result;
it does not commit an external effect after observing mutable authority. The
application rejects direct basis injection, mismatched NORMAL scope, stale
revision, caller support-set injection, copied receipts, and raw structural
adapters. `scope` and `catalogRevision` are treated as consistency assertions,
not accepted as authority when they disagree with the source. The remaining
problem is the absence of an independently verified DOM producer path, not a
direct local caller bypass.

### Architecture scope and guards

```text
ARCHITECTURAL_REALIZATION = AUTHORIZED for local EXEC domain/application/composition boundaries
UNAUTHORIZED_ARCHITECTURAL_EXPANSION = 0
ARCHITECTURE_DECISION_REQUIRED = 0
ARCHITECTURAL_AUTHORITY_GAP_DISCOVERED = NO
MISSING_ARCHITECTURE_GUARDS = 0
ARCHITECTURE_GUARD_TESTS_RUN = 1
ARCHITECTURE_GUARD_EVIDENCE = tests/exec-001-ticket-002.test.ts, "productive registry graph has no infrastructure, prototype, transport or generic bucket dependency"; PASS
ADDITIONAL_GOVERNANCE_GUARD = npm run verify:audit-governance; PASS
```

The required import/dependency architecture guard exists and was executed. It
does not prove productive DOM/REPO availability or required consumer wiring;
those are recorded in the cross-SPEC finding rather than silently inferred
from the guard.

## Systemic boundary expansion

### Root-cause campaign

```text
ROOT_CAUSE_CAMPAIGN_ID = RCC-EXEC-T002-FOREIGN-BASIS-CONSUMPTION-001
ROOT_CAUSE_ID = RC-EXEC-T002-FOREIGN-BASIS-CONSUMPTION
CAMPAIGN_STATUS = OPEN
CAMPAIGN_SCOPE = EXEC-001-TICKET-002 source/identity/catalog integration boundary
CANONICAL_FINDINGS = ARCH-MAJOR-001
```

The campaign is required because the same missing producer-verification
boundary affects issuer, source/consumer wiring, injection, stale handling,
port substitution, public exports, and architecture guards. It is not merged
with unrelated behavior findings.

| Surface row | Class | Location | Owner | Normative obligation | Current behavior | Expected behavior | Coverage |
|---|---|---|---|---|---|---|---|
| RCC-001 | ISSUER | DOM canonical resolver (not present at target) | SPEC-DOM-001 | Issue canonical `RepositoryId` and execution/snapshot basis | No productive producer | Producer-issued identity/basis with revision and failure/stale semantics | MISSING; integrated owner/route |
| RCC-002 | ISSUER | REPO enabled configuration source (not present at target) | SPEC-REPO-001 | Issue repository-scoped NORMAL catalog material | No productive producer | Enabled configuration material bound to canonical repository | MISSING; integrated owner/route |
| RCC-003 | REGISTRAR | `CatalogBasis.create`, `CatalogBasis.register`, `registerRegistryEntry` | SPEC-EXEC-001 | Preserve EXEC registration authority and no mutation | Local authenticated values and new immutable basis | EXEC validates source material and publishes one authorized basis | COVERED locally; integrated source provenance remains open |
| RCC-004 | CONSUMER | `src/application/exec-registry.ts:32-124` | SPEC-EXEC-001 | Consume DOM basis and REPO NORMAL material through approved seams | Reads only bootstrap and NORMAL sources; no DOM reader call | Resolve against the execution's producer-issued DOM basis and matching REPO catalog | MISSING for DOM; PARTIAL for REPO |
| RCC-005 | ALTERNATE_AUTHORITY_PATH | `src/domain/exec-registry.ts:419-438, 503-562` | SPEC-EXEC-001 | Domain remains sole local semantic owner | Direct domain owner path is valid; no competing foreign writer observed | Preserve owner path; do not promote caller/source fixture as foreign authority | COVERED locally |
| RCC-006 | INJECTION_POINT | `ResolveExecCapabilityInput.scope`, optional `repositoryId`, `catalogRevision`, and `basis` rejection | SPEC-EXEC-001 / DOM | Caller cannot establish canonical basis | Direct basis and mismatched scope/revision are rejected; matching caller scope remains a context assertion | Bind request to producer-issued DOM identity and exact execution basis | COVERED negative paths; integrated binding missing |
| RCC-007 | MUTATION_PATH | `CatalogBasis.register` and source receipt publication | SPEC-EXEC-001 / PLAT later | Frozen basis remains immutable | New basis returned; prior basis unchanged | Preserve no-mutation behavior through integrated source/persistence path | COVERED local; PLAT outside scope |
| RCC-008 | STALE_PATH | `assertAuthorizedBasis` revision check | SPEC-EXEC-001 / DOM/REPO | Stale basis fails closed | Exact requested revision is checked for source receipts | Independently producer-issued stale detection and semantic revalidation | PARTIAL; local revision witness only |
| RCC-009 | PORT_SUBSTITUTION_PATH | `ExecutionCatalogBasisReader`, `NormalCatalogSource`, `AuthenticatedBootstrapCatalogSource` | SPEC-EXEC-001 | Alternate adapter must satisfy same provenance contract | Raw adapters, copied receipts, and wrong source kinds fail closed | Productive alternate adapters must carry upstream authority proof | PARTIAL; no productive alternate producer exists |
| RCC-010 | PUBLIC_EXPORT | exported source classes and `createExecRegistry` | SPEC-EXEC-001 | Public boundary must not expose alternate authority | Ports are exported; DOM reader is unused by composition | Public composition must wire approved producer-issued capability | PARTIAL; unused DOM port is exposed but not consumed |
| RCC-011 | ARCHITECTURE_GUARD | focused import/dependency guard in T002 test | SPEC-EXEC-001 design §20 | Forbidden dependencies and alternate buckets rejected | Guard runs and passes | Also guard required DOM producer-consumer wiring when integrated | COVERED for specified import guard; no additional guard mandated by design |
| RCC-012 | TEST | `tests/exec-001-ticket-002.test.ts` | EXEC-001 | Direct positive and negative producer/consumer witnesses | 16 focused tests pass; DOM path only appears as rejected bootstrap substitute | Positive DOM consumer, producer provenance, stale/detached and alternate productive adapter witnesses | PARTIAL; integrated proof open |
| RCC-013 | PERSISTENCE / RECOVERY | TICKET-003 and PLAT boundary | TICKET-003 / SPEC-PLAT-001 | Physical material must not become local semantic authority | Not implemented in T002 | Later owner validates integrity/order and EXEC validates semantic reconstruction | OUTSIDE_SCOPE with owner/route |

Direct local negative witnesses include expected-source forgery, copied receipt,
direct basis injection, caller-selected scope mismatch, stale revision,
DOM-as-bootstrap substitution, forged entry/basis registration, source failure,
no-work-after-bootstrap rejection, and import boundary checks. They do not
constitute productive DOM/REPO producer proof.

## Finding

### ARCH-MAJOR-001 — Canonical DOM execution-basis consumption and productive foreign provenance are not proven

- **Severity:** MAJOR
- **Ticket:** EXEC-001-TICKET-002
- **Normative authority:** ADR-0003 (versioned exact basis and independent
  bootstrap catalog); `SPEC-EXEC-001` §§10, 12.1, 12.3, 13
  (`EXEC-REGISTRY-001`, `EXEC-REGISTRY-002`, `EXEC-CAPABILITY-001`), §14a/b
  authority-consumption and producer/consumer records; upstream DOM
  `DOM-ID-001`/`DOM-SNAPSHOT-001`; approved design §§7, 10, 16, 17.
- **Owner:** EXEC-001 owns the consumer and semantic validation boundary;
  DOM-001 owns canonical execution identity/basis; REPO-001 owns the enabled
  NORMAL catalog producer.
- **Affected boundary:** `src/application/exec-registry-ports.ts`,
  `src/application/exec-registry.ts`, `src/composition/exec-registry.ts`,
  NORMAL repository identity binding, frozen-basis resolution, and the
  DOM/REPO integrated handoff.
- **Repository evidence:**
  1. `ExecutionCatalogBasisReader` is declared at
     `src/application/exec-registry-ports.ts:45-50`, but
     `ResolveExecCapability` at `src/application/exec-registry.ts:32-40`
     accepts only `BootstrapCatalogSource` and `NormalCatalogSource`; no DOM
     execution-basis reader is selected or called.
  2. `selectBasis` at `src/application/exec-registry.ts:57-99` obtains the
     NORMAL basis only from `normalCatalog.read()`. The caller supplies a
     `CatalogScope` and `catalogRevision`; the returned source basis is checked
     against those values, but no producer-issued DOM `RepositoryId` or exact
     execution snapshot basis is consumed.
  3. `CatalogBasisSourceReceipt` carries only a locally authenticated
     `CatalogBasis`. `AuthenticatedCatalogBasisSource.issue` at
     `src/application/exec-registry-ports.ts:24-38` can issue a receipt for any
     authenticated basis supplied by the adapter. The consumer verifies local
     receipt/source-kind identity and source metadata, not upstream DOM/REPO
     issuer provenance.
  4. `createExecRegistry` at `src/composition/exec-registry.ts:11-17` wires only
     bootstrap and NORMAL sources; the declared DOM port is not part of the
     productive composition.
  5. The focused test's `FixtureDomExecutionSource` is used only as a deliberately
     rejected substitute for the bootstrap source; no positive DOM consumer
     witness exists. The 16 focused tests pass, but fixtures do not prove
     productive availability.
  6. `CatalogBasis.create` and `RegistryEntry.create` are valid local EXEC
     constructors, but no integrated adapter contract carries independently
     verified DOM identity/reference or enabled-REPO provenance into this
     consumer.
- **Problem:** The implementation has a local receipt and source-kind boundary,
  but it does not consume the declared canonical DOM execution-basis capability.
  The normal resolver can therefore be exercised with a caller-created scope
  that merely matches a source-returned basis. A local subclass can issue a
  receipt for an authenticated basis without an upstream producer-issued
  identity/reference. The ticket's local fixture proves semantic registry
  behavior, not the approved producer/consumer authority handoff.
- **Impact:** The integrated path cannot prove that the resolved NORMAL catalog
  belongs to the canonical DOM repository/execution basis or that the catalog
  came from enabled REPO configuration. A source/adapter replacement could
  supply a different locally valid basis while satisfying the current port
  protocol. This leaves authority consumption and integrated conformance open;
  it does not establish a local dual writer because productive foreign
  availability is explicitly `NO` and the dependency is integrated-only.
- **Minimum correction required:** At the integrated consumer boundary, wire and
  consume the approved producer-issued DOM execution-basis capability, carrying
  canonical `RepositoryId`, execution/snapshot basis, revision, and explicit
  failure/stale/detached semantics. Bind the REPO NORMAL catalog to that exact
  producer-issued identity and revision, and require consumer-side provenance
  verification before resolution. Preserve the fixture as contract-level
  evidence only; add direct positive and negative productive seam witnesses
  for issuer, caller injection, stale/mutated basis, alternate adapter, and
  no cross-repository substitution. Do not promote local fixtures or source
  labels to productive availability.
- **Systemic pattern = YES**
- **Related locations:** `src/application/exec-registry-ports.ts:24-95`,
  `src/application/exec-registry.ts:32-124`,
  `src/composition/exec-registry.ts:11-20`,
  `src/domain/exec-registry.ts:203-438, 503-562`,
  `tests/exec-001-ticket-002.test.ts` source-forgery, stale, scope, and
  bootstrap-substitution tests, and the DOM/REPO PCP records in the ticket
  §14a–§14b and design §7/§16.

## Domain summary

```text
OWNERSHIP_ERRORS = 0
FOREIGN_CAPABILITY_DUPLICATION = 0
AUTHORITY_VIOLATIONS = 0 local dual/alternate canonical writers observed
IDENTITY_VIOLATIONS = 0 (integrated identity result PARTIAL)
IMMUTABILITY_LINEAGE_VIOLATIONS = 0
LEGACY_AUTHORITY_VIOLATIONS = 0
ARCHITECTURAL_AUTHORITY_GAPS = 0
AUTHORITY_CONSUMPTION_GAPS = 2 (DOM-EXEC-IDENTITY-SNAPSHOT; REPO-EXEC-NORMAL-CATALOG productive availability)
PRODUCER_CONSUMER_CONTRACT_ERRORS = 1 (declared DOM capability has no executable consumer path)
TEMPORAL_AUTHORITY_GAPS = 0
CALLER_SUPPLIED_AUTHORITY_BYPASSES = 0
MISSING_ARCHITECTURE_GUARDS = 0
ARCHITECTURE_GUARD_TESTS_RUN = 1
```

Audit: `.pi/runtime/workflow-audits/3329addd-ecba-4610-a5b1-f2328dc46b8e/architecture-EXEC-001-TICKET-002-architecture-boundaries-audit.md`

Specialist:
ARCHITECTURE_BOUNDARIES

Ticket: EXEC-001-TICKET-002

Ownership errors: 0

Foreign capability duplication: 0

Authority violations: 0

Identity violations: 0

Immutability/lineage violations: 0

Legacy authority violations: 0

Architectural authority gaps: 0
Authority consumption gaps: 2
Producer/consumer contract errors: 1
Temporal authority gaps: 0
Caller-supplied authority bypasses: 0
Missing architecture guards: 0
Architecture guard tests run: 1

Findings:
CRITICAL=0
MAJOR=1
MINOR=0
INFO=0

Domain audit complete:
YES

Specialist result:
SPECIALIST_ARCHITECTURE_FINDINGS

AUDIT_TARGET_HEAD: f8d34c11caca761fe562096588dcff6f3c5f3dab
AUDIT_TARGET_STATE_FINGERPRINT: 98e064fd050a7ebb3264d2025ec1412d6d08e2544ed93e61e34be45a64798ca6
AUDIT_WAVE_ID: 3329addd-ecba-4610-a5b1-f2328dc46b8e
DOMAIN_AUDIT_COMPLETE: YES
SPECIALIST_RESULT: SPECIALIST_ARCHITECTURE_FINDINGS