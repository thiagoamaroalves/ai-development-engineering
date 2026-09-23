# EXEC-001-TICKET-002 — Implementation Design Conformance Audit

## 1. Specialist Result

```text
SPECIALIST_RESULT = SPECIALIST_DESIGN_FINDINGS
DOMAIN_AUDIT_COMPLETE = YES
CRITICAL_FINDINGS = 1
MAJOR_FINDINGS = 2
MINOR_FINDINGS = 1
INFO_FINDINGS = 0
```

The implementation preserves the main local registry model, immutable basis
publication, explicit version membership, bootstrap policy, canonical local
outcomes, and dependency direction. It does not, however, preserve the
approved authority-consumption/provenance boundary: a caller can supply the
basis used for resolution, and the foreign-source seams do not verify issuer,
identity, revision, staleness, or alternate-adapter provenance. The approved
policy boundary is also bypassed by duplicated resolution logic, and the
required structural negative witnesses are not part of the repository's
standard test/typecheck gates.

This artifact is specialist evidence only. No canonical ticket implementation
verdict is issued here.

## 2. Audit Subject

| Field | Value |
|---|---|
| TICKET_ID | `EXEC-001-TICKET-002` |
| TICKET_PATH | `docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-version-registry-catalogs-capabilities.md` |
| IMPLEMENTATION_DESIGN_PATH | `docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-implementation-design.md` |
| IMPLEMENTATION_UNIT | `EXEC-IMP-02 — Version, registry resolution, catalogs and capability extensibility` |
| TICKET_STATUS | `VALIDATION_REQUIRED` |
| AUDIT_TARGET_HEAD | `d4216ad6f4a87fe7142ccd45d3fd099ef1b92955` |
| AUDIT_TARGET_STATE_FINGERPRINT | `4ae3e359d87e354024c62f86fca4eba759e78335f78696185277e0e37a3e0bf4` |
| IMPLEMENTATION_BASELINE | Pinned HEAD `d4216ad6f4a87fe7142ccd45d3fd099ef1b92955` plus the pinned working-tree implementation overlay |
| IMPLEMENTATION_HEAD | `d4216ad6f4a87fe7142ccd45d3fd099ef1b92955` (semantic baseline; implementation is in the pinned overlay) |
| IMPLEMENTATION_STATE_FINGERPRINT | `4ae3e359d87e354024c62f86fca4eba759e78335f78696185277e0e37a3e0bf4` |
| IMPLEMENTATION_DIFF | Four production modules, one direct test module, and eight ticket evidence files listed in §5 |
| DESIGN_VERDICT | `IMPLEMENTATION_DESIGN_READY` |
| DESIGN_GATE | `IMPLEMENTATION_DESIGN_GATE: READY_FOR_IMPLEMENTATION` |
| DESIGN_BASELINE | Ticket-set audit target HEAD `d4216ad6f4a87fe7142ccd45d3fd099ef1b92955`; ticket-set audit basis `61bd0f612ba5b154d0f69e9a68a54f0375a44fe9e73a7e7debed6909ba3535e5` |

The target pair was unchanged during this audit. The implementation was
available through the pinned overlay; it was not rejected for being
uncommitted.

## 3. Audit Mode

```text
READ_ONLY = YES
INDEPENDENT = YES
ADVERSARIAL = YES
DESIGN_FIRST = YES
REPOSITORY_AWARE = YES
DDD_AWARE = YES
SOLID_AWARE = YES
CLEAN_CODE_AWARE = YES
DEPENDENCY_DIRECTION_AWARE = YES
INVARIANT_AWARE = YES
TESTABILITY_AWARE = YES
EVIDENCE_REQUIRED = YES
NO_REMEDIATION = YES
NO_ARCHITECTURE_REDESIGN = YES
NO_CODE_CHANGES = YES
NO_TEST_CHANGES = YES
NO_SELF_APPROVAL = YES
SIBLING_SPECIALIST_AUDITS_READ = NO
```

The approved design, ticket, ticket-set audit, relevant ADR/SPEC/portfolio/plan
authority, implementation, tests, and ticket evidence were inspected. No
sibling specialist audit artifact was read.

## 4. Authority / Design Baseline

Authority was applied in this order: accepted ADR, approved portfolio and
component SPEC, explicit cross-SPEC contracts, audited Gap Matrix and Plan,
ticket, approved Implementation Design, then actual implementation and its
self-check.

Relevant authority:

- `ADR-0003`, revision 3, accepted: semantic versioning, explicit supported
  versions, registry ownership, and independent bootstrap catalog.
- `ADR-0010`, revision 3, accepted: repository configuration is explicit and
  versioned; bootstrap is isolated from normal enablement.
- `SPEC-PORTFOLIO-001`: `O-017` and `O-020` assign semantic version and
  versioned registry/catalog ownership to `SPEC-EXEC-001`; `RepositoryId`
  authority remains DOM-owned and repository enablement remains REPO-owned.
- `SPEC-EXEC-001`: `EXEC-VERSION-001/002`, `EXEC-REGISTRY-001/002/003`, and
  `EXEC-CAPABILITY-001/002`; §12.1 requires canonical DOM `RepositoryId`, an
  authorized source, frozen `CatalogRevision`, and distinct creation versus
  reconstruction.
- Approved design §7 and §16 require consumer-side provenance verification,
  stale/mutation rejection, forged-input rejection, caller-injection
  rejection, and alternate-adapter contract evidence.
- Approved design §20 requires direct positive and negative structural tests and
  an architecture guard.

The upstream normative authority is complete for this unit:

```text
SPEC_IMPLEMENTABILITY_CHECK = PASS
IDENTITY_AUTHORITY_GAPS_UPSTREAM = 0
RECONSTRUCTION_AUTHORITY_GAPS_UPSTREAM = 0
LIFECYCLE_AUTHORITY_GAPS_UPSTREAM = 0
PERSISTENCE_SEMANTICS_GAPS_UPSTREAM = 0
CROSS_SPEC_AUTHORITY_GAPS_UPSTREAM = 0
```

That upstream result does not excuse an implementation authority escape. The
foreign capabilities remain classified exactly as approved:

| Capability | Authority / contract | Local testability | Productive availability | Dependency class | Audit result |
|---|---|---:|---:|---|---|
| `DOM-EXEC-IDENTITY-SNAPSHOT` | `DEFINED / DEFINED` | NO | NO | `REQUIRED_FOR_INTEGRATED_PROOF` | classification preserved; consumer verification missing |
| `REPO-EXEC-NORMAL-CATALOG` | `DEFINED / DEFINED` | NO | NO | `REQUIRED_FOR_INTEGRATED_PROOF` | classification preserved; consumer verification missing |
| `UNIT-EXEC-REGISTRY-FIXTURE` | `DEFINED / DEFINED` | YES | NO | `INFORMATIONAL` | local contract evidence only; no promotion |

Authority provenance recalculation:

| Required proof | Design record | Actual consumer evidence |
|---|---|---|
| `ISSUER_IS_AUTHORIZED` | YES in the approved DOM/REPO records | Not verified by the ports/use case |
| `PROOF_SCOPE_IS_EXACT` | YES | Scope is compared only as caller-visible value data |
| `PROOF_IDENTITY_OR_BRAND` | Required | Missing for `CatalogScope`, `CatalogBasis`, and port results |
| `CONSUMER_VERIFIES_PROVENANCE` | Required | NO |
| `INPUT_OR_REFERENCE_BINDING` | Required | Partial scope equality only; no execution/snapshot/revision binding |
| `MUTATION_OR_STALE_REJECTION` | Required | NO producer-side or consumer-side verification path |
| `FORGERY_PATH_REJECTED` | Required | NO; copied/forged values pass the runtime checks |
| `CALLER_INJECTION_REJECTED` | Required | NO; direct `basis`, `scope`, repository ID, and support set inputs are accepted |
| `ALTERNATE_ADAPTER_CONTRACT` | Required direct witness | Not demonstrated |

No downstream capability promotion was made. The two missing productive
foreign producers remain integrated-proof concerns, while the local consumer
verification defect is an implementation finding.

## 5. Implementation Diff

The actual ticket-specific implementation was reconstructed rather than taken
only from the execution record.

| File | Classification | Evidence / reason |
|---|---|---|
| `src/domain/exec-registry.ts` | `DESIGN_EXPECTED` | Semver, support set, scope, entry, immutable basis, policies, resolver, outcomes |
| `src/application/exec-registry.ts` | `DESIGN_EXPECTED` | Resolve/register orchestration and source selection |
| `src/application/exec-registry-ports.ts` | `DESIGN_EXPECTED` | DOM execution-basis and REPO NORMAL source seams |
| `src/composition/exec-registry.ts` | `DESIGN_EXPECTED` | Composition root |
| `tests/exec-001-ticket-002.test.ts` | `TEST_SUPPORT` | Ten direct ticket tests and source guard |
| `docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/AC-EXEC-003-semver.md` | `DESIGN_EXPECTED` | Local evidence |
| `docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/AC-EXEC-005-registry-contribution.md` | `DESIGN_EXPECTED` | Contribution evidence |
| `docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/AC-EXEC-007-registry-contribution.md` | `DESIGN_EXPECTED` | Contribution evidence |
| `docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/AC-EXEC-008-deterministic-resolution.md` | `DESIGN_EXPECTED` | Local evidence |
| `docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/AC-EXEC-009-catalog-isolation.md` | `DESIGN_EXPECTED` | Local evidence |
| `docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/AC-EXEC-010-bootstrap-allowlist.md` | `DESIGN_EXPECTED` | Local evidence |
| `docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/AC-EXEC-011-failure-distinction.md` | `DESIGN_EXPECTED` | Local evidence |
| `docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/AC-EXEC-012-registry-extensibility.md` | `DESIGN_EXPECTED` | Local evidence |

No production import into infrastructure, transport, prototype, or `.pi` was
found. `src/domain/exec-contract.ts` was reused and not changed. No unplanned
structural implementation file was identified in the ticket scope.

Independent execution evidence:

```text
DIRECT_TICKET_TESTS = 10 passed, 0 failed
REPOSITORY_NPM_TEST = 27 passed, 0 failed, but the package script does not discover tests/exec-001-ticket-002.test.ts
NPM_TYPECHECK = PASS for tsconfig's existing .pi-only include, but it excludes the new src/ and tests/ trees
```

The direct test command passed; the latter two facts remain test-gate
limitations and are addressed in §23 and finding `IDC-MAJOR-002`.

## 6. Responsibility Conformance

| Responsibility | Designed home | Actual home | Result |
|---|---|---|---|
| Parse and compare semantic versions | `SemanticVersion` | `SemanticVersion`, `classifySemanticVersionChange` | `PRESERVED` |
| Resolve explicit support sets | `SupportedVersionSet` + `VersionCompatibilityPolicy` | `SupportedVersionSet` plus inline logic in `RegistryResolutionService` | `SCATTERED` |
| Validate complete registry entries | `RegistryEntry` | `RegistryEntry.create` | `PRESERVED` |
| Maintain immutable catalog basis | `CatalogBasis` | `CatalogBasis.create/register` | `PRESERVED` locally; authority of source/revision is unverified |
| Enforce NORMAL/BOOTSTRAP separation | `CatalogScope`, `CatalogBasis`, resolver | Those domain types plus application selection | `LOCALLY_ADAPTED`; caller basis path bypasses application source selection |
| Enforce bootstrap allowlist | `BootstrapAllowlistPolicy` | `BootstrapAllowlistPolicy` called by resolver | `PRESERVED` |
| Classify resolution outcomes | `RegistryResolutionService` | `RegistryResolutionService` | `PRESERVED` |
| Register through common capability path | `CatalogBasis` and register use case | `CatalogBasis.register`, `RegisterExecCapability` | `PRESERVED` |
| Orchestrate authorized sources and domain | Resolve/register application services and narrow ports | `ResolveExecCapability`, ports, composition root | `LOCALLY_ADAPTED`; source results and caller selectors are not provenance-verified |

The implementation has no missing responsibility and no responsibility moved to
an unrelated layer. The three material adaptations are not harmless local
implementation detail because they expose basis authority and duplicate the
support-set decision.

## 7. Component Conformance

| Designed component | Intended responsibility | Actual implementation | Result |
|---|---|---|---|
| `SemanticVersion` | Parse/compare semver | `src/domain/exec-registry.ts` | `PRESERVED` |
| `SupportedVersionSet` | Exact support membership | `src/domain/exec-registry.ts` | `PRESERVED` |
| `CatalogScope` | NORMAL/BOOTSTRAP scope | String-valued scope and repository ID | `LOCALLY_ADAPTED`; no opaque authority boundary |
| `RegistryEntry` | Complete immutable mapping/root | `RegistryEntry.create` | `PRESERVED` |
| `CatalogBasis` | Immutable scoped collection | `CatalogBasis` | `LOCALLY_ADAPTED`; source/revision are caller-created scalars |
| `VersionCompatibilityPolicy` | Canonical compatibility decision | Exists but is bypassed by resolver inline logic | `LOCALLY_ADAPTED` |
| `BootstrapAllowlistPolicy` | Bootstrap category decision | `BootstrapAllowlistPolicy` | `PRESERVED` |
| `RegistryResolutionService` | Coordinate lookup and domain decisions | Resolver also owns duplicate compatibility logic | `LOCALLY_ADAPTED` |
| `ResolveExecCapability` | Load authorized basis and resolve | Optional direct basis bypass plus unverified ports | `LOCALLY_ADAPTED` |
| `RegisterExecCapability` | Registration orchestration | Delegates to domain registration | `PRESERVED` |
| `ExecutionCatalogBasisReader` | DOM consumer seam | `read(): CatalogBasis`, no proof/revision/issuer contract | `LOCALLY_ADAPTED` |
| `NormalCatalogSource` | REPO consumer seam | `read(repositoryId: string): CatalogBasis` | `LOCALLY_ADAPTED` |
| Registry composition root | Wiring only | `createExecRegistry` | `PRESERVED` |
| TICKET-002 fixture | Controlled local evidence | `tests/exec-001-ticket-002.test.ts` | `PRESERVED` as fixture support only |

The designed components are present. There is no unjustified component split,
missing component, or material god-component collapse. The policy bypass and
port provenance defects are structural findings even though the named files
exist.

## 8. Domain Model Conformance

The implemented domain concepts are recognizable and responsibility is mostly
inside the domain:

```text
DOMAIN_CONCEPTS = SemanticVersion, SupportedVersionSet, CatalogScope,
                  RegistryEntry, CatalogBasis, compatibility policy,
                  bootstrap policy, resolution service
AGGREGATE_ROOTS = RegistryEntry with immutable CatalogBasis consistency boundary
ENTITIES = RegistryEntry
VALUE_OBJECTS = SemanticVersion, SupportedVersionSet, CatalogScope, revision-like basis data
DOMAIN_SERVICES = RegistryResolutionService
DOMAIN_POLICIES = VersionCompatibilityPolicy, BootstrapAllowlistPolicy
DOMAIN_EVENTS = NOT_APPLICABLE
ANTI_CORRUPTION_BOUNDARIES = application source ports; provenance verification incomplete
ANEMIC_DOMAIN_MODEL_INTRODUCED = NO
FAT_APPLICATION_SERVICE_INTRODUCED = NO
```

The domain does not import infrastructure or transport and does not reimplement
DOM lifecycle or REPO enablement. The conformance findings are the lack of an
opaque/verified foreign identity boundary, inline duplication of a designed
policy, and the inconsistent semver value-object equality described in
`IDC-MINOR-001`.

## 9. Upstream Authority Preconditions Audit

The approved authority proofs remain current and sufficient. The implementation
consumption audit is not conformant:

| Proof / capability | Required consumer behavior | Actual result |
|---|---|---|
| `ACP-EXEC-02` / DOM record | Verify authorized issuer, exact execution/snapshot basis, identity/revision, stale/mutation and forged input | Port returns an unbranded local `CatalogBasis`; no consumer verification |
| `ACP-EXEC-02` / REPO record | Verify enabled-source provenance, requested canonical RepositoryId, basis and stale/detached behavior | `NormalCatalogSource.read` accepts a caller string and returns an unverified basis |
| Local fixture record | Prove local semantics only and reject caller replacement where authority is claimed | Fixture proves happy-path source invocation, not replacement/forgery rejection |

`CatalogScope.normal` accepts any non-empty string as `repositoryId` (domain
module lines 199–201), and `NormalCatalogSource` exposes the same primitive at
its port (ports lines 14–16). This is not an authorized DOM identity. The
application only compares `basis.scope.equals(input.scope)` after selecting a
source; both scope objects and the repository ID can originate from the caller.

`RegistryEntry` also validates schema references only with `instanceof`
(domain module lines 70–74 and 299–302). The existing contract boundary has a
private instance/brand check in `exec-contract.ts`; the registry does not use
an equivalent branded verification. An adversarial runtime check constructed a
`SchemaReference` prototype-shaped object with `schemaId` and `version`, and
`RegistryEntry.create` accepted it; the resulting forged-schema entry resolved
with `status = RESOLVED`.

Therefore:

```text
SPEC_IMPLEMENTABILITY_CHECK = PASS
IDENTITY_AUTHORITY_GAPS = 1 implementation exposure
RECONSTRUCTION_AUTHORITY_GAPS = 0 (out of local scope)
LIFECYCLE_AUTHORITY_GAPS = 0
PERSISTENCE_SEMANTICS_GAPS = 0 (out of local scope)
CROSS_SPEC_AUTHORITY_GAPS = 1 implementation consumption exposure
AUTHORITY_CONSUMPTION_GAPS = 2 (DOM and REPO consumer seams)
PRODUCER_CONSUMER_CONTRACT_ERRORS = 2
CAPABILITY_AVAILABILITY_CLASSIFICATION_ERRORS = 0
DOWNSTREAM_PROMOTION_WITHOUT_NEW_EVIDENCE = 0
TEMPORAL_AUTHORITY_GAPS = 0 (no external mutable effect in this unit)
CALLER_SUPPLIED_AUTHORITY_BYPASS = 1
UPSTREAM_AUTHORITY_CONFORMANCE = FINDINGS
```

The foreign capabilities remain `REQUIRED_FOR_INTEGRATED_PROOF`; their
productive unavailability was not promoted to a local blocker.

## 10. Aggregate Boundary Audit

| Aggregate/boundary | Root | Invariants protected | Mutation entry point | Consistency / transaction boundary | Result |
|---|---|---|---|---|---|
| Immutable registry catalog basis | `RegistryEntry` within `CatalogBasis` | complete entry, explicit versions, unique key, immutable old basis, scope policy | `CatalogBasis.register` returns a new basis | local register/resolve operation over frozen values; no physical transaction claimed | `PRESERVED` locally |

`CatalogBasis.register` does not mutate the prior entries and duplicate
registration fails before publication. The returned result retains a complete
basis. No aggregate-internal mutable map or repository write was introduced.

The boundary's *authority* is not protected: application resolution can accept
an arbitrary caller-provided `CatalogBasis`, and `CatalogBasis` itself has no
producer brand. That is reported as an authority/provenance bypass, not as a
second mutation authority.

```text
AGGREGATE_BOUNDARY_VIOLATIONS = 0
AGGREGATE_INTERNAL_MUTATION_BYPASSES = 0
MULTIPLE_TRANSITION_AUTHORITIES = 0
INVALID_TRANSACTION_BOUNDARY = 0
DURABLE_ENFORCEMENT = NOT_APPLICABLE_LOCALLY
```

## 11. Invariant Placement Audit

| Invariant | Designed enforcement | Actual enforcement | Durable enforcement | Actual test | Result |
|---|---|---|---|---|---|
| Semver has canonical components/form | `SemanticVersion` | `SemanticVersion.parse` and existing semver predicate | N/A locally | Parse/components test | `PRESERVED` with build-only minor finding |
| Only explicit supported versions resolve | support set + compatibility policy | support set plus inline resolver check | N/A locally | Supported/unsupported tests | `LOCALLY_ADAPTED`; policy is bypassed |
| Entry is complete | `RegistryEntry.create` | required fields, schema type check, unique lists | Later persistence scope | Mapping tests; no malformed-entry witness | `PRESERVED` for normal construction |
| Scoped key is unique and duplicate is fail-closed | `CatalogBasis.register` | identity check and new-basis publication | Physical uniqueness/CAS later | Duplicate/no-mutation test | `PRESERVED` locally |
| NORMAL/BOOTSTRAP are independent | scope, basis, resolver and authorized source | domain scope and application scope equality | Integrated source isolation later | Partial two-basis test | `BYPASSABLE` through direct `basis` and caller-created scope |
| Bootstrap allowlist precedes normal work | `BootstrapAllowlistPolicy` | resolver checks policy before success | REPO enablement remains foreign | Incompatible/no-approval test | `PRESERVED` locally; before-work callback is not exercised |
| Unknown differs from incompatible | resolver | separate failure codes | N/A | Distinction test | `PRESERVED` |
| Synthetic capability uses common path | basis registration/resolution | same `RegistryEntry`/`CatalogBasis` path | Later persistence | Synthetic registration test | `PRESERVED` |
| Frozen basis is unchanged | immutable value publication | frozen arrays and new basis | PLAT later | Old-basis assertions | `PRESERVED` |
| Producer-issued schema/basis/reference cannot be forged | authority proof and consumer verification | `instanceof`/scope equality only | Integrated producer later | No forged/caller/stale/alternate negative test | `UNENFORCED` |

```text
DOMAIN_INVARIANT_BYPASSES = 2
UNENFORCED_INVARIANTS = 2
INVARIANT_PLACEMENT_DEVIATIONS = 2
```

The first two counts are the caller-controlled scope/basis authority and the
unbranded schema/basis provenance path; they are not claims that immutable
array mutation was possible.

## 12. Domain Rule Duplication Audit

`VersionCompatibilityPolicy.resolve` exists at domain module lines 451–457 and
implements the exact intersection of request support and entry support. The
resolver instead independently performs the same rule at lines 482–487 and
never calls the policy. This creates two semantic homes for a designed domain
rule even though current tests produce the same result.

Bootstrap allowlist logic has one active policy home. Unknown/incompatible
classification has one active resolver home.

```text
DOMAIN_RULE_DUPLICATION = 1
```

See `IDC-MAJOR-001`.

## 13. Value Object / Primitive Audit

`SemanticVersion` and `SupportedVersionSet` are immutable and preserve explicit
membership. `CatalogScope` is immutable as an object, but its canonical
`RepositoryId` is represented as an arbitrary string supplied by the caller.
The normal source port repeats that primitive representation. This is a
primitive/authority regression against the approved opaque DOM-owned identity
boundary, counted under `IDC-CRITICAL-001` rather than as a separate finding.

`SemanticVersion.compare` ignores build metadata as SemVer precedence requires,
but `equals` compares the raw value including build metadata. Consequently,
two versions with equal core and prerelease precedence but different build
metadata compare as equal while `changeFrom` classifies the difference as
`PATCH`. This is a localized value-object semantic inconsistency; see
`IDC-MINOR-001`.

```text
PRIMITIVE_OBSESSION_REGRESSIONS = 1
VALUE_OBJECT_COLLAPSED_TO_PRIMITIVE = 1 (RepositoryId authority representation)
VALUE_OBJECT_SEMANTICS_DUPLICATED_EXTERNALLY = 0
```

## 14. Domain Service Audit

`RegistryResolutionService` contains real domain behavior: complete-key
candidate lookup, stage selection, explicit support membership, bootstrap
allowlisting, role compatibility, and canonical outcome creation. It is not a
generic service bucket and does not perform persistence, retry, transport, or
foreign lifecycle work.

Its compatibility branch duplicates the designed policy rather than delegating
to it. This is a domain-rule ownership defect, not an anemic-domain finding.

```text
DOMAIN_SERVICE_SCOPE_LEAK = NO
GENERIC_DOMAIN_SERVICE_BUCKET = NO
```

## 15. Application Service Audit

`RegisterExecCapability` is a thin orchestration wrapper. `ResolveExecCapability`
selects a basis, calls the domain resolver, and performs scope checks; it does
not absorb domain invariants, persistence, recovery, or external effects.

```text
FAT_APPLICATION_SERVICE_INTRODUCED = NO
```

The application boundary is nevertheless structurally unsafe because
`ResolveExecCapabilityInput.basis` is an optional caller-controlled escape
(application lines 14–18 and 40–41). The source ports are also not issuer or
revision-verifying adapters. This is `IDC-CRITICAL-001`, not a fat-service
finding.

## 16. Repository / Persistence Boundary Audit

The approved design explicitly keeps physical storage, serialization, CAS,
recovery, and semantic reconstruction outside this ticket. The implementation
uses immutable in-process `CatalogBasis` values and makes no durable claim.
The local atomicity shape is preserved: registration either returns a new
complete basis or throws without changing the old value.

```text
AGGREGATE_STORAGE_BOUNDARY = PRESERVED_LOCALLY
REPOSITORY_PORT = NOT_APPLICABLE_FOR_LOCAL_PHYSICAL_STORAGE
SERIALIZATION_BOUNDARY = NOT_APPLICABLE
CONCURRENCY_MECHANISM = deterministic in-process publication only
ATOMICITY_BOUNDARY = old basis retained; new basis returned
DURABLE_INVARIANT_PROTECTION = integrated PLAT/TICKET-003 scope
REGISTRY_INDEX_RELATIONSHIP = no separate index introduced
RECOVERY_BEHAVIOR = out of scope; no recovery authority claimed
PERSISTENCE_DESIGN = PERSISTENCE_DESIGN_PRESERVED
```

The lack of persisted digest/reconstruction validation is not counted as a
local defect here because the approved design assigns it to later reconstruction
and physical persistence boundaries. It remains an integrated proof condition.

## 17. Anti-Corruption / Cross-Spec Design Audit

| Foreign model | Local model | Translation boundary | Identity preservation | Failure preservation | Result |
|---|---|---|---|---|---|
| DOM canonical execution/snapshot basis and `RepositoryId` | EXEC `CatalogScope` / `CatalogBasis` | `ExecutionCatalogBasisReader` | No brand, execution/snapshot identity, or revision verification | Reader errors are not mapped through a provenance contract | `DESIGN_BOUNDARY_VIOLATED` |
| REPO enabled NORMAL catalog | EXEC `CatalogBasis` | `NormalCatalogSource` | Caller supplies raw repository ID; returned basis is unverified | No producer-issued stale/detached/source proof | `ACL_BYPASSED` |
| PLAT physical persistence | Local immutable basis | Not applicable in this ticket | Not claimed | Not applicable | `NOT_APPLICABLE` |

The domain does not import foreign modules and does not reimplement DOM identity
or REPO enablement, so `FOREIGN_AUTHORITY_REIMPLEMENTED = NO`. The issue is that
the intended ACL seam is only a structural TypeScript interface; it does not
verify authority-bearing results, and the optional direct basis path bypasses it.

```text
FOREIGN_MODEL_LEAKAGE = 1 (raw RepositoryId authority is exposed as a string)
FOREIGN_AUTHORITY_REIMPLEMENTED = 0
ACL_BYPASSED = YES
DESIGN_BOUNDARY_VIOLATED = YES
```

## 18. SOLID Audit

| Dimension | Result | Evidence |
|---|---|---|
| SRP | PASS | Value objects, basis, policies, resolver, and use cases have coherent reasons to change |
| OCP | PASS | New synthetic entries use data-driven common registration; no speculative plugin hierarchy |
| LSP | NOT_APPLICABLE / PASS | No inheritance substitution boundary is used |
| ISP | PASS | Two narrow source ports expose only their consumer-shaped read capability |
| DIP | PASS | Application depends on port interfaces; domain has no infrastructure dependency |

The direct basis escape weakens the application boundary, but it is not a
material dependency inversion violation. The policy duplication is a domain
ownership problem, not a reason to introduce another abstraction.

```text
SRP_VIOLATIONS = 0
OCP_VIOLATIONS = 0
LSP_VIOLATIONS = 0
ISP_VIOLATIONS = 0
DIP_VIOLATIONS = 0
UNJUSTIFIED_SOLID_VIOLATIONS = 0
```

## 19. Dependency Direction Audit

The actual import graph is consistent with the approved direction:

```text
src/domain/exec-registry.ts
  -> src/domain/exec-contract.ts
src/application/*exec-registry*.ts
  -> src/domain/exec-registry.ts
src/composition/exec-registry.ts
  -> src/application/* and src/domain/exec-registry.ts
```

No domain import of filesystem, HTTP, database, serializer framework,
prototype, `.pi`, or infrastructure code was found. The source-text guard also
passes its own forbidden-token check, but its effectiveness is addressed in
§23.

```text
DEPENDENCY_DIRECTION_VIOLATIONS = 0
INFRASTRUCTURE_LEAKAGE_POINTS = 0
```

## 20. Lifecycle Design Audit

This ticket introduces immutable basis values, not a mutable lifecycle machine.
The actual register operation creates a new basis; resolve reads a frozen basis;
duplicate, unsupported, wrong-scope, and disallowed-bootstrap cases do not
publish a new basis.

```text
TRANSITION_OWNER = CatalogBasis / RegistryEntry domain boundary
VALID_TRANSITIONS = register absent key -> new immutable basis; resolve -> result
INVALID_TRANSITIONS = duplicate/conflict, unsupported, invalid scope, disallowed bootstrap
RECOVERY_TRANSITIONS = NOT_APPLICABLE locally
TERMINAL_TRANSITIONS = existing basis is not edited in place
FORBIDDEN_BYPASS_PATHS = direct map mutation not available; authority-source bypass remains open
LIFECYCLE_AUTHORITY_DUPLICATED = 0
GENERIC_STATE_MUTATION_BYPASS = 0
TERMINAL_STATE_BYPASS = 0
LIFECYCLE_DESIGN_CONFORMANCE = PASS
```

The authority-source bypass is not a duplicate lifecycle owner; it is reported
under provenance and identity authority.

## 21. Failure / Recovery Structure Audit

Local failure placement is structurally coherent:

- malformed requests are converted by the domain resolver to
  `CONTRACT_INVALID` with `noMutation` and `noApproval`;
- unknown candidates produce `UNKNOWN_CAPABILITY`;
- known unsupported versions, role mismatches, and bootstrap-disallowed entries
  produce `INCOMPATIBLE_CAPABILITY`;
- duplicate registration throws `ExecRegistryDomainError` before old-basis
  mutation;
- physical durability, retry, recovery, reconciliation, and CAS remain
  outside this ticket.

The source-selection path throws a domain error on missing or scope-mismatched
source material rather than returning the resolver's structured failure shape.
That is still a `CONTRACT_INVALID` code and no local state is mutated, but it
cannot establish source provenance or stale/detached semantics. The latter is
covered by `IDC-CRITICAL-001`.

```text
FAILURE_DETECTION = domain resolver and basis registration
DURABLE_EVIDENCE = NOT_APPLICABLE locally
FAILURE_OWNER = EXEC domain boundary
RETRY_OWNER = outside this ticket
IDEMPOTENCY_BOUNDARY = immutable basis duplicate rejection
RECOVERY_PATH = outside this ticket
RECONCILIATION_PATH = outside this ticket
RECOVERY_STRUCTURE_COLLAPSED = NO
RETRY_OWNERSHIP_DRIFT = NO
IDEMPOTENCY_BOUNDARY_DRIFT = NO
```

## 22. Clean Code Structural Audit

The implementation uses clear domain names, guard-style validation, immutable
arrays/objects, explicit registration publication, and cohesive methods. No
god component, generic utility bucket, hidden side effect, hidden temporal
coupling, deep nesting, or speculative factory/strategy framework was found.

The raw string `RepositoryId` is a material primitive/authority issue rather
than a naming preference. `freezeRecord`, unused result aliases, and similar
small dead declarations are not separately reported because they do not alter
responsibility or authority.

```text
CLEAR_DOMAIN_NAMING = PASS
COHESIVE_METHODS = PASS
EXPLICIT_SIDE_EFFECTS = PASS
EXPLICIT_MUTATION_BOUNDARIES = PASS
BOOLEAN_MODE_SWITCH = PASS
LONG_PARAMETER_LIST = PASS
DOMAIN_PRIMITIVE_OBSESSION = FINDINGS (RepositoryId authority)
MAGIC_VALUES = PASS
GENERIC_UTIL_BUCKETS = 0
GENERIC_SERVICE_BUCKETS = 0
DOMAIN_RULE_DUPLICATION = FINDINGS (one)
DEEP_NESTING = PASS
COMMENT_DEPENDENT_CORRECTNESS = PASS
HIDDEN_SIDE_EFFECT = PASS
HIDDEN_TEMPORAL_COUPLING = PASS
UNNECESSARY_MUTABILITY = PASS
PREMATURE_ABSTRACTIONS = 0
OVERENGINEERING_FINDINGS = 0
```

## 23. Testability / Structural Test Audit

The direct ticket test file contains ten passing tests and covers the principal
happy paths and local immutable-basis behavior. It does not cover all approved
structural proof obligations.

| Design-critical behavior | Actual evidence | Result |
|---|---|---|
| Semver components and explicit support | Direct tests 1–2 | Direct witness |
| Complete deterministic mapping | Direct test 3 | Direct witness |
| Duplicate/no-mutation registration | Direct test 4 | Direct witness |
| NORMAL/BOOTSTRAP isolation | Direct test 5 checks separate successful bases, but no cross-substitution rejection | Proxy-only / incomplete negative witness |
| Bootstrap before-work rejection | Direct test 6 asserts incompatible/no-approval/no-mutation, but no work callback or source-side negative witness exists | Proxy-only / incomplete boundary witness |
| Unknown/incompatible distinction | Direct test 7 | Direct witness |
| Synthetic common-path registration | Direct test 8 | Direct witness |
| Application source seam | Direct test 9 counts a bootstrap reader call, but does not verify provenance, stale state, forged input, or alternate adapter contract | Missing structural negative witnesses |
| Dependency architecture guard | Direct test 10 scans text for forbidden words and source paths; it does not inspect the import graph or authority contract | `ARCHITECTURE_GUARD_INEFFECTIVE` |
| Caller/basis/schema forgery rejection | No test | Missing |
| Stale/mutation/alternate adapter rejection | No test | Missing |

The approved matrix contains nine rows and declares all direct. Independently
recalculated evidence is:

```text
DIRECT_BEHAVIOR_WITNESSES = 7
PROXY_ONLY_BEHAVIORS = 2
UNTESTED_STATE_TRANSITIONS = 0
UNPROVEN_CONCURRENCY_CONTRACTS = 0 (physical CAS is correctly integrated-only)
MISSING_ARCHITECTURE_GUARDS = 1 (the present guard is ineffective for the required proof)
ARCHITECTURE_GUARD_PRESENT = YES
ARCHITECTURE_GUARD_INEFFECTIVE = YES
DESIGN_TEST_COVERAGE_GATE = BLOCKED
```

The repository's default commands also do not execute the new structural
surface: `package.json` runs only `.pi/extensions/workflow-orchestrator/test/*.test.ts`,
and `tsconfig.json` includes only `.pi/extensions/**/*.ts`. The direct T002
command passes, but this is not equivalent to a repository gate executing the
new tests and typechecking the new production module. This is a material
structural testability regression, reported as `IDC-MAJOR-002`.

## 24. Design Deviation Audit

The ticket records `DESIGN_DEVIATIONS = NONE`. Independent comparison found:

| Actual deviation | Classification |
|---|---|
| Optional caller-supplied `basis`, raw caller scope/repository selector, and unverified source results bypass the approved authority-consumption seam | `INVALID_CROSS_SPEC_BOUNDARY_CHANGE` and `INVALID_INVARIANT_PLACEMENT_CHANGE` |
| `RegistryResolutionService` reimplements the designed compatibility policy instead of using the policy as the single decision home | `UNDECLARED_MATERIAL_DEVIATION` / `INVALID_COMPONENT_BOUNDARY_CHANGE` |
| Build-metadata equality/change classification inconsistency | `UNDECLARED_MATERIAL_DEVIATION`, localized value-object defect |
| No physical persistence/reconstruction implementation | `VALID_LOCAL_IMPLEMENTATION_DETAIL`; explicitly out of scope |
| No concrete DOM/REPO adapters | `VALID_REPOSITORY_REALITY_ADJUSTMENT`; foreign productive producers are integrated-only |

```text
RECORDED_DESIGN_DEVIATIONS = 0
VALID_DESIGN_DEVIATIONS = 2
INVALID_DESIGN_DEVIATIONS = 2
UNDECLARED_MATERIAL_DESIGN_DEVIATIONS = 3
```

The two invalid deviations are counted as authority/component findings; the
localized value-object issue is separately counted as a minor finding.

## 25. Structural Self-Check Verification

The ticket claims all structural checks pass, including zero domain-rule
duplication, zero testability regressions, zero invariant bypasses, and
cross-SPEC conformance. The independent audit does not confirm those claims:

```text
IMPLEMENTATION_STRUCTURAL_SELF_CHECK = FALSE_PASS
DOMAIN_MODEL_CONFORMANT claim = FALSE_PASS
INVARIANT_PLACEMENT_CONFORMANT claim = FALSE_PASS
COMPONENT_BOUNDARIES_CONFORMANT claim = FALSE_PASS
CROSS_SPEC_BOUNDARY_CONFORMANT claim = FALSE_PASS
DOMAIN_RULE_DUPLICATION claim = FALSE_PASS
TESTABILITY_REGRESSIONS claim = FALSE_PASS
MISSING_ARCHITECTURE_GUARDS claim = FALSE_PASS
```

Claims for dependency direction, absence of infrastructure leakage, absence of
fat application service, and immutable local publication are independently
confirmed.

## 26. Findings

## IDC-CRITICAL-001 — Caller-controlled or unverified catalog basis bypasses authority provenance

Severity: CRITICAL  
Category: `CALLER_SUPPLIED_AUTHORITY_BYPASS`; `IDENTITY_AUTHORITY_GAP`; `CROSS_SPEC_AUTHORITY_GAP`

Ticket: `EXEC-001-TICKET-002`  
Implementation Design: `docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-implementation-design.md`  
Audit Target HEAD: `d4216ad6f4a87fe7142ccd45d3fd099ef1b92955`

Designed responsibility/component:
`ResolveExecCapability`, `ExecutionCatalogBasisReader`, `NormalCatalogSource`,
`CatalogScope`, and `CatalogBasis`.

Approved design:
The design requires an authorized frozen basis, canonical DOM-owned
`RepositoryId`, consumer verification of issuer/identity/scope/revision,
rejection of stale/mutated/forged/caller-injected material, and alternate
adapter contract evidence. The caller must not establish basis material,
replace `CatalogRevision`, or supply authoritative foreign identity.

Actual implementation:
`ResolveExecCapabilityInput` exposes optional `basis`, `scope`, and primitive
`repositoryId` fields. `selectBasis` returns `input.basis` immediately when it
is a `CatalogBasis`, without consulting or verifying either source port. When a
port is used, it accepts `read(): CatalogBasis` or
`read(repositoryId: string): CatalogBasis` and only compares returned scope
value fields to caller-provided scope fields. `CatalogScope.normal` accepts
any non-empty string as identity. `RegistryEntry` accepts schema references
using only `instanceof`.

Repository evidence:

- `src/application/exec-registry.ts:14-18` defines caller-selectable basis,
  scope, and repository ID.
- `src/application/exec-registry.ts:40-41` returns the caller's basis before
  any authorized source or provenance check.
- `src/application/exec-registry.ts:48-53` passes the caller's raw repository
  ID to the REPO port and checks only value equality of scope.
- `src/application/exec-registry-ports.ts:7-16` returns an unbranded local
  `CatalogBasis` and accepts `repositoryId: string`.
- `src/domain/exec-registry.ts:199-201` creates NORMAL identity from any
  string; lines 217-219 derive the lookup key from it.
- `src/domain/exec-registry.ts:70-74` and `299-302` check schema references
  only with `instanceof`, not the existing contract boundary's brand/instance
  proof.
- `tests/exec-001-ticket-002.test.ts:184-196` tests only that a reader is
  called and a result resolves; it does not test forged or caller-injected
  basis rejection.
- An adversarial runtime check accepted a prototype-shaped forged
  `SchemaReference` and resolved a registry entry with `status = RESOLVED`.
  A second check resolved a caller-supplied NORMAL basis through a use case
  constructed with no source ports.

Structural problem:
Immutability is being used as a substitute for authority. A frozen basis can
still be an arbitrary caller-created or stale basis. The application port is
therefore optional rather than authoritative, and its results have no issuer
brand, exact execution/snapshot binding, revision verification, stale policy,
or alternate-adapter contract enforcement.

DDD impact:
The canonical identity of a NORMAL catalog and the authority of its frozen
basis are no longer owned by DOM/REPO producer seams and the approved EXEC
consumer boundary. A primitive caller string can stand in for a DOM-owned
identity.

SOLID impact:
No standalone SOLID metric is violated, but the application abstraction has an
unchecked escape path that defeats its intended consumer boundary.

Clean Code impact:
The public input shape hides a security/authority mode choice and uses a raw
identity primitive where the design requires opaque authority.

Dependency direction impact:
The import graph remains inward, but the ACL/port contract is structurally
bypassed; dependency direction alone does not prove authority provenance.

Invariant impact:
The NORMAL repository-scoped key, frozen basis binding, and schema/reference
provenance invariants are bypassable. A caller can obtain a successful result
for arbitrary basis material.

Testability impact:
Required forged-input, caller-injection, stale/mutation, and alternate-adapter
negative witnesses are absent. The current test can pass while this authority
escape remains open.

Why this matters:
An arbitrary or stale catalog can resolve a capability under the wrong
repository or basis while returning a normal-looking `RESOLVED` result. This
violates the approved identity and cross-SPEC ownership contract and can make
future integrated consumers trust noncanonical registry material.

Minimum structural correction required:
Make basis selection depend on a producer-issued, consumer-verified authority
seam; reject direct caller basis injection and unverified identity/result
shapes; preserve exact scope/revision/source binding and fail closed on forged,
stale, detached, or alternate-adapter material. Add direct negative witnesses
for each required provenance rule. Do not treat a local fixture or a frozen
object as productive authority.

Capability: `EXEC-REGISTRY-AUTHORITY-PROVENANCE` consuming
`DOM-EXEC-IDENTITY-SNAPSHOT` and `REPO-EXEC-NORMAL-CATALOG`  
Dependency class: `REQUIRED_FOR_LOCAL_CLOSURE` for consumer verification and
local negative witnesses; the productive DOM/REPO capabilities remain
`REQUIRED_FOR_INTEGRATED_PROOF`  
Local closure blocking: YES  
Local acceptance requires productive capability: NO  
Completion evidence timing: local ticket for consumer verification; integrated
checkpoint for productive DOM/REPO producer evidence  
Dependency class reclassification required: NO  
Upstream dependency classification preserved: YES  
Suggested local/integrated blocking effects: block local design conformance on
this consumer-boundary defect; retain the two foreign producer dependencies as
integrated-only and do not promote them to local availability.

## IDC-MAJOR-001 — Resolution service duplicates and bypasses the approved compatibility policy

Severity: MAJOR  
Category: `DOMAIN_RULE_DUPLICATION`; `INVALID_COMPONENT_BOUNDARY_CHANGE`

Ticket: `EXEC-001-TICKET-002`  
Implementation Design: `docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-implementation-design.md`  
Audit Target HEAD: `d4216ad6f4a87fe7142ccd45d3fd099ef1b92955`

Designed responsibility/component:
`VersionCompatibilityPolicy` and `RegistryResolutionService`.

Approved design:
The policy owns exact supported-set compatibility; the resolver coordinates
lookup, scope, policy invocation, and canonical outcome classification. The
design explicitly calls for one home for compatibility semantics.

Actual implementation:
`VersionCompatibilityPolicy.resolve` implements the intersection of request
support and entry support but has no call site. `RegistryResolutionService`
reimplements the same decision inline using `request.supportedVersions.resolve`
and `entry.supports`.

Repository evidence:

- `src/domain/exec-registry.ts:451-457` defines the approved policy.
- `src/domain/exec-registry.ts:482-487` independently performs the same
  compatibility decision in the resolver.
- Repository search finds no invocation of `VersionCompatibilityPolicy`.
- The ticket self-check claims `DOMAIN_RULE_DUPLICATION = 0`, which is false.

Structural problem:
The designed policy is not the canonical decision home. Two implementations
can diverge as supported-set semantics evolve, while tests exercise only the
resolver's inline branch and cannot protect the policy boundary.

DDD impact:
Compatibility is a domain rule, but its ownership is scattered between a dead
policy component and the domain service.

SOLID impact:
The service remains cohesive, but the designed responsibility decomposition is
weakened and the policy component is ceremonial rather than authoritative.

Clean Code impact:
The unused policy obscures the actual rule owner and creates future drift risk.

Dependency direction impact:
No import-direction violation.

Invariant impact:
Current exact-membership behavior passes, but policy invariants are not
protected by a single decision home.

Testability impact:
There is no direct test that the resolver consumes the designed policy or that
the policy and resolver cannot diverge.

Why this matters:
A later change to version compatibility can update one location and silently
leave the other with different acceptance semantics, defeating explicit
supported-set authority.

Minimum structural correction required:
Restore one canonical compatibility decision home consistent with the approved
design and add a direct structural/behavior witness that the resolution path
uses it. Do not add another strategy or abstraction.

Capability: `UNIT-EXEC-REGISTRY-FIXTURE` / local compatibility decision  
Dependency class: `REQUIRED_FOR_LOCAL_CLOSURE`  
Local closure blocking: YES  
Local acceptance requires productive capability: NO  
Completion evidence timing: local ticket  
Dependency class reclassification required: NO  
Upstream dependency classification preserved: YES  
Suggested local/integrated blocking effects: local structural conformance remains
open; no integrated foreign capability promotion or reclassification is needed.

## IDC-MAJOR-002 — Required authority and architecture witnesses are outside the repository test/typecheck gates

Severity: MAJOR  
Category: `TESTABILITY_REGRESSION`; `ARCHITECTURE_GUARD_INEFFECTIVE`

Ticket: `EXEC-001-TICKET-002`  
Implementation Design: `docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-implementation-design.md`  
Audit Target HEAD: `d4216ad6f4a87fe7142ccd45d3fd099ef1b92955`

Designed responsibility/component:
TICKET-002 structural test support, provenance verification at the two source
ports, and the first productive registry dependency-direction guard.

Approved design:
The test design requires direct positive and negative witnesses for catalog
isolation, bootstrap before-work rejection, caller/forgery/stale handling, and
alternate-adapter contracts. The architecture guard must protect the actual
boundary, and all local witnesses must be executable at closure.

Actual implementation:
The ten direct ticket tests pass when invoked explicitly, but no test rejects a
caller-provided `basis`, forged schema/basis, stale source result, or alternate
adapter. The catalog-isolation test proves two successful basis values differ,
not that cross-scope substitution is rejected. The architecture test uses a
forbidden-word regular expression over source text and a path check; it does
not inspect imports or authority/provenance behavior. `npm test` runs only the
existing `.pi` test glob, while `tsconfig.json` typechecks only `.pi` sources.

Repository evidence:

- `tests/exec-001-ticket-002.test.ts:121-133` does not attempt cross-basis
  substitution or mutation through the application seam.
- `tests/exec-001-ticket-002.test.ts:184-196` verifies only reader invocation
  and a successful result.
- `tests/exec-001-ticket-002.test.ts:199-211` performs a substring/path scan,
  not a dependency graph or authority guard.
- `package.json` test script is
  `node --experimental-strip-types --test .pi/extensions/workflow-orchestrator/test/*.test.ts`.
- `tsconfig.json` includes only `.pi/extensions/**/*.ts`.
- Explicit execution of `tests/exec-001-ticket-002.test.ts` passed 10/10, but
  that command is not the repository `npm test` gate.

Structural problem:
The implementation's most important structural escape is not guarded by a
negative executable witness, and the standard repository commands do not run or
typecheck the new production/test surface. A green proxy or separately invoked
suite cannot establish the required local architecture boundary.

DDD impact:
Missing negative witnesses leave aggregate identity, basis authority, and
catalog-scope isolation unprotected at the consumer boundary.

SOLID impact:
No direct SOLID violation; the ineffective guard fails to protect the approved
DIP/ACL seam.

Clean Code impact:
The test name implies authorized source behavior without testing authorization
or provenance.

Dependency direction impact:
The textual guard can miss an import path or package dependency that does not
contain one of its forbidden tokens; actual direction is currently clean but
not robustly guarded.

Invariant impact:
No direct executable witness protects caller-injection rejection, stale basis
rejection, or alternate-adapter equivalence.

Testability impact:
This is a material testability regression: the required local structural proof
cannot be reproduced by the normal repository test/typecheck commands.

Why this matters:
Future changes can reintroduce infrastructure leakage or authority bypass while
both the standard suite and the ticket's happy-path tests remain green.

Minimum structural correction required:
Make the required T002 tests part of the executable repository gate, include the
new source/tests in type coverage, and add direct negative/alternate-adapter
witnesses for provenance, stale, forged, caller-injected, cross-scope, and
before-work behavior. Replace the substring-only architecture check with a
witness that actually verifies the approved dependency boundary.

Capability: `UNIT-EXEC-REGISTRY-FIXTURE` and `EXEC-REGISTRY-ARCHITECTURE-GUARD`  
Dependency class: `REQUIRED_FOR_LOCAL_CLOSURE`  
Local closure blocking: YES  
Local acceptance requires productive capability: NO  
Completion evidence timing: local ticket  
Dependency class reclassification required: NO  
Upstream dependency classification preserved: YES  
Suggested local/integrated blocking effects: local structural test gate remains
blocked; integrated-only foreign producer availability remains unchanged and is
not promoted.

## IDC-MINOR-001 — SemanticVersion equality and change classification disagree on build metadata

Severity: MINOR  
Category: `VALUE_OBJECT_SEMANTICS`

Ticket: `EXEC-001-TICKET-002`  
Implementation Design: `docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-implementation-design.md`  
Audit Target HEAD: `d4216ad6f4a87fe7142ccd45d3fd099ef1b92955`

Designed responsibility/component:
`SemanticVersion` value object and semantic-version change classification.

Approved design:
The value object owns canonical semver components, comparison, and observable
major/minor/patch meaning. The existing parser permits valid prerelease and
build metadata.

Actual implementation:
`SemanticVersion.compare` ignores build metadata, but `equals` compares the raw
`value`. `changeFrom` returns `NONE` only when raw values are equal, otherwise
returns `PATCH` when major and minor are unchanged. Thus
`1.2.3+build-a` and `1.2.3+build-b` compare equal but are classified as a
patch change.

Repository evidence:

- `src/domain/exec-registry.ts:110-112` implements raw-string equality.
- `src/domain/exec-registry.ts:114-133` compares precedence without build data.
- `src/domain/exec-registry.ts:136-141` classifies every non-equal same-core
  version as `PATCH`.
- `tests/exec-001-ticket-002.test.ts:70-81` tests build parsing but not
  build-only equality/change semantics.

Structural problem:
The designed value object has inconsistent equality and semantic-change
contracts. A build-only metadata change can be treated as a patch semantic
change even though comparison reports equal precedence.

DDD impact:
Value-object equality and semantic classification are not a single coherent
semver meaning.

SOLID impact:
No material SOLID violation.

Clean Code impact:
The public API exposes an internally inconsistent value-object contract.

Dependency direction impact:
None.

Invariant impact:
Build-only metadata can produce an incorrect change category.

Testability impact:
One direct edge-case witness is missing; this does not invalidate the main
local acceptance cases.

Why this matters:
Later registry revision or compatibility code can interpret a metadata-only
change as a semantic patch evolution.

Minimum structural correction required:
Align equality/change classification with the approved SemVer meaning and add a
direct build-only witness. No persistence or integration change is required.

Capability: `UNIT-EXEC-REGISTRY-FIXTURE` / semantic version value object  
Dependency class: `INFORMATIONAL`  
Local closure blocking: NO  
Local acceptance requires productive capability: NO  
Completion evidence timing: local follow-up evidence  
Dependency class reclassification required: NO  
Upstream dependency classification preserved: YES  
Suggested local/integrated blocking effects: retain as a localized design
finding; no integrated blocking effect.

## 27. Metrics

```text
RESPONSIBILITIES:
- DESIGNED: 9
- PRESERVED: 6
- LOCALLY_ADAPTED: 3
- MISSING: 0
- WRONG_PLACEMENT: 0

COMPONENTS:
- DESIGNED: 14
- PRESERVED: 7
- LOCALLY_ADAPTED: 7
- COLLAPSED: 0
- UNJUSTIFIED_SPLITS: 0
- MISSING: 0
- UNPLANNED: 0

DDD:
- AGGREGATE_BOUNDARY_VIOLATIONS: 0
- DOMAIN_INVARIANT_BYPASSES: 2
- UNENFORCED_INVARIANTS: 2
- INVARIANT_PLACEMENT_DEVIATIONS: 2
- DOMAIN_RULE_DUPLICATION: 1
- ANEMIC_DOMAIN_MODEL_INTRODUCED: NO
- FAT_APPLICATION_SERVICE_INTRODUCED: NO

SOLID:
- SRP_VIOLATIONS: 0
- OCP_VIOLATIONS: 0
- LSP_VIOLATIONS: 0
- ISP_VIOLATIONS: 0
- DIP_VIOLATIONS: 0
- UNJUSTIFIED_SOLID_VIOLATIONS: 0

DEPENDENCIES:
- DEPENDENCY_DIRECTION_VIOLATIONS: 0
- INFRASTRUCTURE_LEAKAGE_POINTS: 0

UPSTREAM_AUTHORITY:
- SPEC_IMPLEMENTABILITY_CHECK: PASS
- IDENTITY_AUTHORITY_GAPS: 1
- RECONSTRUCTION_AUTHORITY_GAPS: 0
- LIFECYCLE_AUTHORITY_GAPS: 0
- PERSISTENCE_SEMANTICS_GAPS: 0
- CROSS_SPEC_AUTHORITY_GAPS: 1
- UPSTREAM_AUTHORITY_CONFORMANCE: FINDINGS
- AUTHORITY_CONSUMPTION_GAPS: 2
- PRODUCER_CONSUMER_CONTRACT_ERRORS: 2
- CAPABILITY_AVAILABILITY_CLASSIFICATION_ERRORS: 0
- DOWNSTREAM_PROMOTION_WITHOUT_NEW_EVIDENCE: 0
- WITNESSES_NOT_EXECUTABLE_AT_LOCAL_CLOSURE: 0
- TEMPORAL_AUTHORITY_GAPS: 0
- CALLER_SUPPLIED_AUTHORITY_BYPASS: 1

CLEAN_CODE:
- GOD_COMPONENTS: 0
- FAT_INTERFACES: 0
- PRIMITIVE_OBSESSION_REGRESSIONS: 1
- GENERIC_SERVICE_BUCKETS: 0
- GENERIC_UTIL_BUCKETS: 0
- PREMATURE_ABSTRACTIONS: 0
- OVERENGINEERING_FINDINGS: 0
- HIDDEN_SIDE_EFFECTS: 0
- HIDDEN_TEMPORAL_COUPLINGS: 0

TESTABILITY:
- TESTABILITY_REGRESSIONS: 1
- MISSING_STRUCTURAL_TESTS: 3

DESIGN_DEVIATIONS:
- RECORDED: 0
- VALID: 2
- INVALID: 2
- UNDECLARED_MATERIAL: 3

SELF_CHECK:
- CLAIMED: PASS
- AUDITED: FALSE_PASS

FINDINGS:
- CRITICAL: 1
- MAJOR: 2
- MINOR: 1
- INFO: 0
```

## 28. Re-audit Reconciliation

```text
RE_AUDIT = NOT_APPLICABLE
PREVIOUS_IDC_FINDINGS_RECONCILED = NOT_APPLICABLE
REMEDIATION_DELTA_AUDITED = NO_PRIOR_SPECIALIST_ARTIFACT_READ
NEW_FINDINGS = IDC-CRITICAL-001, IDC-MAJOR-001, IDC-MAJOR-002, IDC-MINOR-001
```

This is the first specialist audit for the pinned T002 implementation in this
execution. No sibling specialist audit was used as evidence or reconciliation
input.

## 29. Specialist Completeness Proof

- The complete `audit-implementation-design-conformance` skill was loaded,
  including authority-completeness, finding-completion-readiness, and
  authority-provenance anti-forgery contracts.
- The ticket, approved Implementation Design, and ticket-set audit were read;
  the ticket status, design readiness, implementation unit, expected files,
  local closure, acceptance witness matrix, authority records, and self-check
  claims were independently compared with code.
- Accepted ADR-0003/0010, portfolio ownership for O-017/O-020, SPEC-EXEC-001
  requirements and identity rules, the audited Implementation Plan, and the
  approved DOM/REPO dependency classifications were checked.
- Every designed responsibility and component was mapped to an actual home.
- Aggregate boundary, invariant placement, domain rule ownership, value
  objects, application services, dependency direction, lifecycle, persistence
  scope, cross-SPEC seams, recovery placement, SOLID, Clean Code, and
  testability were audited.
- The implementation and direct test source were inspected rather than relying
  on the implementation execution record. Direct T002 tests were executed and
  passed 10/10; repository command coverage limitations were independently
  observed.
- Authority provenance was checked for issuer ownership, scope, identity/brand,
  consumer verification, stale/mutation handling, forged input, caller
  injection, and alternate adapter behavior.
- Recorded deviations were compared with actual deviations; the structural
  self-check was independently recalculated as a false pass.
- No production code, tests, ticket state, upstream authority, Git state,
  commits, branches, remotes, or publication state was changed by this audit.

AUDIT_TARGET_HEAD: d4216ad6f4a87fe7142ccd45d3fd099ef1b92955
AUDIT_TARGET_STATE_FINGERPRINT: 4ae3e359d87e354024c62f86fca4eba759e78335f78696185277e0e37a3e0bf4
DOMAIN_AUDIT_COMPLETE: YES
SPECIALIST_RESULT: SPECIALIST_DESIGN_FINDINGS