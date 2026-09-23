# EXEC-001-TICKET-002 — Implementation Design Conformance Audit

## 1. Specialist Result

```text
SPECIALIST_RESULT: SPECIALIST_DESIGN_FINDINGS
DOMAIN_AUDIT_COMPLETE: YES
AUDIT_SCOPE: implementation design conformance only
CANONICAL_TICKET_VERDICT: NOT_PRODUCED
CRITICAL_FINDINGS: 2
MAJOR_FINDINGS: 1
MINOR_FINDINGS: 1
INFO_FINDINGS: 0
```

The implementation preserves the principal domain, aggregate, application,
and dependency-direction structure, but it does not preserve the approved
authority-consumption and anti-forgery boundary. The source marker is caller
forgeable, the frozen-basis provenance contract is not verified, and the
request supplies a second compatibility authority. The implementation's
structural self-check therefore does not pass independently.

## 2. Audit Subject

| Field | Value |
|---|---|
| TICKET_ID | `EXEC-001-TICKET-002` |
| TICKET_PATH | `docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-version-registry-catalogs-capabilities.md` |
| IMPLEMENTATION_DESIGN_PATH | `docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-implementation-design.md` |
| IMPLEMENTATION_UNIT | `EXEC-IMP-02 — Version, registry resolution, catalogs and capability extensibility` |
| TICKET_STATUS | `VALIDATION_REQUIRED` |
| IMPLEMENTATION_BASELINE | `d4216ad6f4a87fe7142ccd45d3fd099ef1b92955` |
| IMPLEMENTATION_HEAD | `36ac11c08d6e7b9416e41662646c2686fcfef677` |
| AUDIT_TARGET_HEAD | `36ac11c08d6e7b9416e41662646c2686fcfef677` |
| AUDIT_TARGET_STATE_FINGERPRINT | `191ca7c9d2f15f71bc48ee2e17059438ed01efba281c261ad329e41532be6714` |
| IMPLEMENTATION_STATE_FINGERPRINT | `191ca7c9d2f15f71bc48ee2e17059438ed01efba281c261ad329e41532be6714` |
| IMPLEMENTATION_STATUS | `IMPLEMENTED` |
| DESIGN_VERDICT | `IMPLEMENTATION_DESIGN_READY` |
| DESIGN_GATE | `READY_FOR_IMPLEMENTATION` |

The target pair is stable for this audit. The current working-tree overlay
contains workflow/documentation material outside the production implementation
subject; the pinned semantic target pair is used as the audit basis.

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

The approved design, ticket, ticket-set audit, upstream authority artifacts,
actual implementation, tests, and evidence files were inspected. No sibling
specialist audit artifact was used as evidence.

## 4. Authority / Design Baseline

Authority precedence was applied as follows:

```text
ADR-0003 revision 3
  > SPEC-EXEC-001 revision 3
  > validated Gap Matrix
  > conformant Implementation Plan / Plan Audit
  > approved TICKET-002
  > approved Implementation Design
  > actual repository implementation
  > implementation structural self-check
```

Relevant upstream authority remains complete at the supplied baseline:

| Authority / proof | Independent result | Implementation consequence |
|---|---|---|
| `SPEC_IMPLEMENTABILITY_CHECK` for SPEC-EXEC-001 revision 3 | `PASS` | No upstream implementability block was found. |
| `AGGREGATE_IDENTITY_PROOF`, SPEC §12.3 and component audit basis `d0eea5fc93afcc254d022512b6a8ed9902fe152a885ccfd7f2ac51e609a9a6f1` | Complete | NORMAL identity remains scope, canonical DOM repository identity, skill/capability, schema and semantic version; BOOTSTRAP is independent. |
| `AGGREGATE_RECONSTRUCTION_PROOF`, SPEC §12.4 | Complete | No local reconstruction path is authorized; physical reconstruction remains outside this ticket. |
| Lifecycle authority matrix | Complete | This ticket owns immutable basis registration/resolution only, not execution lifecycle. |
| `ACP-EXEC-02` | Authority/contract defined; foreign productive availability `NO` | DOM and REPO producers remain integrated-proof dependencies. |
| `PCP-DOM-EXEC-01` | Defined/defined, local/productive `NO/NO`, `REQUIRED_FOR_INTEGRATED_PROOF` | No downstream promotion is made. |
| `PCP-REPO-EXEC-01` | Defined/defined, local/productive `NO/NO`, `REQUIRED_FOR_INTEGRATED_PROOF` | No downstream promotion is made. |

The upstream contracts define exact source scope, frozen-basis and failure
semantics. They do not authorize a caller-provided source marker, arbitrary
catalog basis, or caller-controlled replacement of the authoritative support
set. The design itself repeats these anti-forgery requirements in §7 and §16.

### Recalculated readiness and witness facts

```text
UPSTREAM_AUTHORITY_COMPLETE = YES
LOCAL_FIXTURE_AUTHORITY_STATUS = DEFINED
LOCAL_FIXTURE_CONTRACT_STATUS = DEFINED
LOCAL_FIXTURE_LOCAL_TESTABILITY = YES
LOCAL_FIXTURE_PRODUCTIVE_AVAILABILITY = NO
FOREIGN_PRODUCERS_PRODUCTIVE_AVAILABILITY = NO
FOREIGN_DEPENDENCY_CLASS = REQUIRED_FOR_INTEGRATED_PROOF
DOWNSTREAM_CAPABILITY_PROMOTION_WITHOUT_NEW_EVIDENCE = 0
LOCAL_ACCEPTANCE_OPERATIONS_EXECUTABLE = YES
LOCAL_COMPLETION_EVIDENCE_OPERATIONS_EXECUTABLE = YES
WITNESSES_NOT_EXECUTABLE_AT_LOCAL_CLOSURE = 0
```

The local readiness facts do not close the structural authority findings.
Foreign productive availability remains integrated-only and is not converted
into a local blocker.

### Authority-provenance defense

For both external authority records, the normative issuer and scope are
identified, but implementation-side provenance verification is incomplete:

| Required proof field | DOM basis reader | NORMAL catalog source |
|---|---|---|
| `ISSUER_IS_AUTHORIZED` | Designated by contract, not verified by code | Designated by contract, not verified by code |
| `PROOF_SCOPE_IS_EXACT` | Requested scope is compared; exact execution/revision binding is absent | Requested repository scope is compared; exact frozen revision binding is absent |
| `CONSUMER_VERIFIES_PROVENANCE` | `NO`: only local object membership and string source are checked | `NO`: only local object membership and string source are checked |
| `INPUT_OR_REFERENCE_BINDING` | `NO` for a producer-issued reference/brand | `NO` for a producer-issued reference/brand |
| `MUTATION_OR_STALE_REJECTION` | `NO` at the consumer seam | `NO` at the consumer seam |
| `FORGERY_PATH_REJECTED` | `NO`: public `CatalogBasis.create` can mint the expected source marker | `NO`: public `CatalogBasis.create` can mint the expected source marker |
| `CALLER_INJECTION_REJECTED` | Direct basis injection is rejected, but an adapter can inject a forged expected-source basis | Same |
| `ALTERNATE_ADAPTER_CONTRACT` | Not proven; no producer identity contract exists | Not proven; no producer identity contract exists |

`TEMPORAL_AUTHORITY_PROOF` is not applicable to the local immutable operation
because no external effect is committed. That does not remove the requirement
to verify a producer-issued frozen basis before integrated resolution.

## 5. Implementation Diff

The semantic implementation delta from `d4216ad6f4a87fe7142ccd45d3fd099ef1b92955`
to `36ac11c08d6e7b9416e41662646c2686fcfef677` includes the following:

| File / area | Classification | Audit observation |
|---|---|---|
| `src/domain/exec-registry.ts` | `DESIGN_EXPECTED` | Implements value objects, entry, immutable basis, policies, resolver and results. |
| `src/application/exec-registry.ts` | `DESIGN_EXPECTED` | Implements resolve/register orchestration and source selection. |
| `src/application/exec-registry-ports.ts` | `DESIGN_EXPECTED` | Implements the two narrow source seams. |
| `src/composition/exec-registry.ts` | `DESIGN_EXPECTED` | Implements composition-root wiring. |
| `src/domain/exec-contract.ts` | `LOCAL_IMPLEMENTATION_ADAPTATION` | Exposes authenticated schema-reference recognition for entry validation. |
| `tests/exec-001-ticket-002.test.ts` | `TEST_SUPPORT` | Direct domain, application, isolation, fail-closed and import-guard tests. |
| `docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/*` | `TICKET_REQUIRED_ADDITION` | File-addressed local evidence for the ticket acceptance surfaces. |
| `package.json`, `tsconfig.json` | `TICKET_REQUIRED_ADDITION` | Adds the productive ticket test/typecheck surfaces. |
| Ticket/checkpoint/remediation/audit documentary files | `UNRELATED_CHANGE` to the production design subject | Workflow artifacts are not implementation components and are not used as implementation evidence here. |

No production import into infrastructure, transport, prototype, or `.pi` was
introduced by the four registry implementation modules. No persistence or
foreign lifecycle implementation was introduced.

## 6. Responsibility Conformance

| Responsibility | Designed home | Actual home | Result |
|---|---|---|---|
| Parse and compare semantic versions | `SemanticVersion` | `src/domain/exec-registry.ts:92-165` | `LOCALLY_ADAPTED` — core comparison is centralized, but numeric component exposure is lossy for valid very-large components. |
| Resolve explicit support sets | `SupportedVersionSet` and `VersionCompatibilityPolicy` | `src/domain/exec-registry.ts:168-205,485-490` | `LOCALLY_ADAPTED` — the request's caller-supplied set is a second compatibility authority. |
| Validate complete registry entries | `RegistryEntry` | `src/domain/exec-registry.ts:322-351` | `PRESERVED` |
| Maintain immutable catalog basis | `CatalogBasis` | `src/domain/exec-registry.ts:400-453` | `PRESERVED` |
| Enforce NORMAL/BOOTSTRAP separation | `CatalogScope`, `CatalogBasis`, application source selection | `src/domain/exec-registry.ts:210-246; src/application/exec-registry.ts:54-93` | `LOCALLY_ADAPTED` — scope is checked, but producer identity and frozen revision are not verified. |
| Enforce bootstrap allowlist | `BootstrapAllowlistPolicy` | `src/domain/exec-registry.ts:493-498,522-524` | `PRESERVED` |
| Classify unknown/incompatible outcomes | `RegistryResolutionService` | `src/domain/exec-registry.ts:500-541` | `PRESERVED` |
| Register through common registry path | `CatalogBasis.register` and `RegisterExecCapability` | `src/domain/exec-registry.ts:432-439,550-551; src/application/exec-registry.ts:101-104` | `PRESERVED` for local immutable behavior; authority of the supplied basis is not verified. |
| Orchestrate source and domain behavior | resolve/register application services and narrow ports | `src/application/exec-registry.ts:28-105; src/application/exec-registry-ports.ts:1-19` | `LOCALLY_ADAPTED` — the ports return a local basis but carry no producer-issued authority proof. |

```text
MISSING_RESPONSIBILITIES = 0
WRONG_RESPONSIBILITY_PLACEMENTS = 0
```

The domain responsibility homes are clear. Findings concern authority carried
through those homes, not a move of domain rules into infrastructure or generic
application code.

## 7. Component Conformance

| Designed component | Intended responsibility | Actual implementation | Result |
|---|---|---|---|
| `SemanticVersion` | Parse, compare, expose semver components | Domain class with exact digit comparison and numeric fields | `LOCALLY_ADAPTED` |
| `SupportedVersionSet` | Explicit membership | Authenticated immutable set | `PRESERVED` |
| `CatalogScope` | NORMAL/BOOTSTRAP scope | Authenticated immutable scope | `PRESERVED` |
| `RegistryEntry` | Complete immutable mapping and key | Authenticated immutable entry | `PRESERVED` |
| `CatalogBasis` | Frozen entry collection and publication | Authenticated immutable basis | `PRESERVED` |
| `VersionCompatibilityPolicy` | Explicit support-set rule | Static policy intersects request and entry sets | `LOCALLY_ADAPTED` |
| `BootstrapAllowlistPolicy` | Bootstrap functional restriction | Static allowlist policy | `PRESERVED` |
| `RegistryResolutionService` | Lookup, compatibility and canonical outcomes | Domain service | `LOCALLY_ADAPTED` — receives caller-selected support authority and basis directly. |
| `ResolveExecCapability` | Authorized source selection and resolution orchestration | Application service | `LOCALLY_ADAPTED` — source verification is nominal rather than provenance-based. |
| `RegisterExecCapability` | Registration orchestration | Thin application delegate | `LOCALLY_ADAPTED` — accepts any locally branded basis without source verification. |
| `ExecutionCatalogBasisReader` | DOM execution-basis seam | `read(): CatalogBasis` | `LOCALLY_ADAPTED` — no issuer/brand/revision result contract. |
| `NormalCatalogSource` | REPO NORMAL catalog seam | `read(repositoryId): CatalogBasis` | `LOCALLY_ADAPTED` — no issuer/brand/revision result contract. |
| Registry composition root | Wiring | `createExecRegistry` | `PRESERVED` |
| TICKET-002 fixture | Controlled local evidence | Tests create local `CatalogBasis` directly | `LOCALLY_ADAPTED` — fixture identity is indistinguishable from caller-created expected-source material. |

```text
UNJUSTIFIED_COMPONENT_COLLAPSES = 0
UNJUSTIFIED_COMPONENT_SPLITS = 0
MISSING_REQUIRED_COMPONENTS = 0
UNPLANNED_STRUCTURAL_COMPONENTS = 0
```

There is no material collapse of aggregate behavior into application
orchestration, or of persistence into domain behavior. The source ports are
narrow, but their authority-bearing result contract is structurally
insufficient.

## 8. Domain Model Conformance

### Domain concepts

The implementation contains the designed concepts: `SemanticVersion`,
`SupportedVersionSet`, `CatalogScope`, `RegistryEntry`, `CatalogBasis`, the two
policies, `RegistryResolutionService`, and the two application use cases.
There is no anemic-domain regression: entry completeness, set membership,
scope, immutable publication, bootstrap restriction, lookup and outcome
classification remain in domain-owned code.

### Aggregate model

`REGISTRY_ENTRY` remains the aggregate root for entry completeness and mapping
metadata. `CatalogBasis` remains an immutable consistency collection rather than
a second semantic identity authority. The code does not expose setters or a
mutable map, and failure paths do not publish a new basis.

```text
ANEMIC_DOMAIN_MODEL_INTRODUCED = NO
FAT_APPLICATION_SERVICE_INTRODUCED = NO
```

### Value-object observations

`SemanticVersion`, `SupportedVersionSet` and `CatalogScope` are real immutable
concepts with private construction and runtime authentication where they cross
trust boundaries. The `CatalogRevision` and `source` values remain primitive
fields in `CatalogBasis`; this is acceptable for the local unfrozen storage
surface, but those fields cannot serve as a producer provenance proof. The
large-component numeric exposure is recorded as `IDC-MINOR-001`.

## 9. Upstream Authority Preconditions Audit

The implementation did not invent DOM identity, execution lifecycle, physical
persistence, reconstruction, recovery, or REPO enablement. The upstream proof
IDs and revisions are current for the pinned target. The local implementation,
however, exposes a cross-spec authority-consumption escape:

1. `CatalogBasis.create` is public and accepts arbitrary `source` text.
2. `ResolveExecCapability.assertAuthorizedBasis` accepts a basis when its local
   WeakSet membership, requested scope, and expected source string match.
3. No producer-issued brand, exact frozen basis reference, revision selector,
   digest, mutation observation, or alternate-adapter contract is verified.
4. `RegisterExecCapability.register` accepts a caller-supplied authenticated
   basis without any source/provenance check.

This is not a new upstream SPEC identity or reconstruction gap. It is an
implementation escape from the approved consumer-side authority proof.

```text
SPEC_IMPLEMENTABILITY_CHECK = PASS
IDENTITY_AUTHORITY_GAPS = 0
RECONSTRUCTION_AUTHORITY_GAPS = 0
LIFECYCLE_AUTHORITY_GAPS = 0
PERSISTENCE_SEMANTICS_GAPS = 0
CROSS_SPEC_AUTHORITY_GAPS = 1
UPSTREAM_AUTHORITY_CONFORMANCE = FINDINGS
AUTHORITY_CONSUMPTION_GAPS = 2
PRODUCER_CONSUMER_CONTRACT_ERRORS = 2
CAPABILITY_AVAILABILITY_CLASSIFICATION_ERRORS = 0
DOWNSTREAM_PROMOTION_WITHOUT_NEW_EVIDENCE = 0
WITNESSES_NOT_EXECUTABLE_AT_LOCAL_CLOSURE = 0
TEMPORAL_AUTHORITY_GAPS = 0
CALLER_SUPPLIED_AUTHORITY_BYPASS = 2
```

`EXECUTION_READY` and local capability availability are not promoted by this
finding. The two foreign capabilities remain `REQUIRED_FOR_INTEGRATED_PROOF`
with productive availability `NO`.

## 10. Aggregate Boundary Audit

| Aggregate boundary check | Result | Evidence |
|---|---|---|
| Aggregate root | `PASS` | `RegistryEntry` is authenticated and immutable; basis owns collection publication. |
| Invariants protected | `PASS` locally / `FINDINGS` at source seam | Entry completeness, uniqueness, scope and allowlist are domain-owned; source provenance is not. |
| Mutation entry points | `PASS` | `CatalogBasis.register` returns a new basis; no direct mutable collection is exposed. |
| Consistency boundary | `PASS` | Registration validates uniqueness and publishes only a complete new basis. |
| Transaction boundary | `PASS` locally | One in-memory registration either returns a new basis or throws; physical CAS is explicitly outside scope. |
| Durable enforcement | `NOT_APPLICABLE` | No durable persistence is implemented by this ticket. |
| Aggregate-internal mutation bypass | `PASS` | Frozen objects and arrays prevent local in-place mutation. |
| Multiple transition authorities | `PASS` locally | Registration delegates to `CatalogBasis.register`; no second mutable state machine exists. |
| Invalid transaction boundary | `PASS` | Domain/application layering preserves the local immutable operation boundary. |

```text
AGGREGATE_BOUNDARY_VIOLATIONS = 0
```

The authority findings do not arise from an aggregate mutation bypass; they
arise because an externally supplied basis can be made to look producer-issued.

## 11. Invariant Placement Audit

| Approved invariant | Designed enforcement | Actual enforcement | Durable enforcement | Actual test | Result |
|---|---|---|---|---|---|
| Semver has canonical form/components | `SemanticVersion` | `SemanticVersion.parse` delegates syntax to `isSemanticVersion`, then parses | N/A locally | Semver tests, including large comparison | `LOCALLY_ADAPTED` |
| Only explicit supported versions resolve | set and compatibility policy | Both `request.supportedVersions` and `entry.supportedVersions` are consulted | N/A locally | Explicit set and unsupported tests | `BYPASSABLE` as authority placement; caller can alter the first decision |
| Entry is complete | `RegistryEntry.create` | Authenticated schemas, tokens, artifacts, verdicts, roles and category | Future persistence scope | Complete mapping tests | `PRESERVED` |
| Scoped key is unique | `CatalogBasis.register` | Identity lookup rejects duplicate/conflict without new basis | Physical uniqueness integrated-only | Duplicate/no-mutation test | `PRESERVED` |
| NORMAL/BOOTSTRAP are independent | scope/basis/source seam | Scope equality and source string check | Foreign source owns productive material | Isolation and wrong-source tests | `LOCALLY_ADAPTED` |
| Bootstrap allowlist precedes work | `BootstrapAllowlistPolicy` | Policy rejects normal category before a work callback exists | REPO enablement remains foreign | Normal bootstrap negative test | `PRESERVED` |
| Unknown differs from incompatible | resolution service | Lookup occurs before stage/schema/version classification | N/A locally | Unknown/schema/version tests | `PRESERVED` |
| Synthetic capability uses common path | basis registration/resolution | `RegisterExecCapability` and common resolver | Frozen-basis durability integrated-only | Synthetic registration test | `PRESERVED` |
| Existing frozen basis remains unchanged | immutable basis publication | Returned basis is new; old basis is retained | Physical immutability integrated-only | Old-basis and duplicate tests | `PRESERVED` |

```text
DOMAIN_INVARIANT_BYPASSES = 1
UNENFORCED_INVARIANTS = 0
INVARIANT_PLACEMENT_DEVIATIONS = 2
```

The support-set placement and source-basis provenance are the two deviations.
The core local invariants remain enforced, but their authority inputs are not
all authenticated at the application boundary.

## 12. Domain Rule Duplication Audit

The support decision is split between an entry-owned explicit set and a
caller-provided explicit set. This is not a harmless mechanical validation
duplication: `VersionCompatibilityPolicy.resolve` first accepts the caller's
set and only then checks the entry's set. The result therefore depends on two
independent sources for one canonical compatibility outcome.

The semver syntax predicate is reused from `exec-contract.ts`; the second
regular expression in `SemanticVersion.parse` extracts components after that
predicate and is not treated as an independent semantic authority.

```text
DOMAIN_RULE_DUPLICATION = 1
```

## 13. Value Object / Primitive Audit

| Check | Result | Evidence |
|---|---|---|
| Value object collapse | `PASS` | Semver, support set and scope are not reduced to unvalidated strings at their intended local boundaries. |
| External value-object semantics | `PASS` with minor finding | Exact digit strings are used for comparison, but public numeric components are lossy beyond safe integer range. |
| Primitive obsession regression | `PASS` | The implementation introduces the designed typed concepts; source/revision primitives do not replace an approved local semantic object. |
| Canonicalization | `PASS` | Semver syntax rejects leading zeros and support membership is explicit. |
| Comparison semantics | `FINDINGS` | `equals`/comparison are exact for precedence, while `major`, `minor`, and `patch` fields use `Number(...)`. |

## 14. Domain Service Audit

`RegistryResolutionService` contains the designed domain behavior: complete-key
candidate filtering, canonical unknown/incompatible classification, explicit
version compatibility, bootstrap allowlisting, role checks and immutable
result construction. It is not a generic rule bucket and does not perform
application orchestration, persistence, retry, mapping, or integration.

`VersionCompatibilityPolicy` and `BootstrapAllowlistPolicy` have concrete
current consumers and each has one coherent reason to change. The support-set
authority issue is an input/provenance defect, not a reason to move these rules
out of the domain service.

```text
DOMAIN_SERVICE_SCOPE_LEAK = NO
GENERIC_DOMAIN_SERVICE_BUCKET = NO
```

## 15. Application Service Audit

`ResolveExecCapability` loads a source basis, checks scope/source conditions,
invokes the domain resolver, and maps source failures to structured failure
results. `RegisterExecCapability` delegates registration and does not own
entry invariants or persistence. No fat application service or domain-rule
migration was introduced.

The application boundary is structurally narrow but has two authority escapes:
source strings are treated as issuer proof, and registration accepts any local
basis object. Those escapes are recorded under cross-spec authority and
caller-injection findings rather than as a fat-service finding.

```text
FAT_APPLICATION_SERVICE_INTRODUCED = NO
```

## 16. Repository / Persistence Boundary Audit

| Persistence concern | Result |
|---|---|
| Aggregate storage boundary | `PRESERVED` — only in-process immutable basis values are used. |
| Repository port | `PRESERVED` for the approved source seams; no storage repository is invented. |
| Serialization boundary | `NOT_APPLICABLE` locally. |
| Concurrency mechanism | `NOT_APPLICABLE` physically; local create-only no-mutation behavior is present. |
| Atomicity boundary | `PRESERVED` locally — registration returns a complete new basis or fails. |
| Durable invariant protection | `INTEGRATED_ONLY` — correctly not claimed locally. |
| Registry/index relationship | `PRESERVED` — linear collection lookup is the local authority; no second index authority exists. |
| Recovery behavior | `NOT_APPLICABLE` locally; reconstruction belongs to later scope. |

```text
PERSISTENCE_DESIGN_CONFORMANCE = PASS
PERSISTENCE_BOUNDARY_VIOLATED = 0
PERSISTENCE_SEMANTICS_GAPS = 0
```

The source-revision provenance defect must be addressed at the integrated
consumer/producer contract, not by adding local persistence to this ticket.

## 17. Anti-Corruption / Cross-Spec Design Audit

| Seam | Foreign model | Local model | Translation boundary | Identity preservation | Failure preservation | Result |
|---|---|---|---|---|---|---|
| DOM execution basis | DOM-owned execution identity/basis | EXEC `CatalogScope`/`CatalogBasis` | `ExecutionCatalogBasisReader` | Scope shape is checked; producer identity and exact frozen revision are not | Source failure maps to `CONTRACT_INVALID` | `FINDINGS` |
| REPO NORMAL catalog | REPO enabled configuration/material | EXEC `CatalogScope`/`CatalogBasis` | `NormalCatalogSource` | Repository string and scope are compared; producer-issued binding is not | Source failure maps to `CONTRACT_INVALID` | `FINDINGS` |
| PLAT persistence | Physical material/integrity/CAS | No local model | Not applicable | Not applicable | Not applicable | `NOT_APPLICABLE` |

`FOREIGN_MODEL_LEAKAGE = NO` in the domain imports. `FOREIGN_AUTHORITY_REIMPLEMENTED
= NO`: the code does not implement DOM identity or REPO enablement. The ACL is
not bypassed as a call graph, but its result is not an authority-bearing proof;
checking `basis.source === expectedSource` is a nominal label check, not a
producer verification boundary.

```text
ACL_BYPASSED = NO
DESIGN_BOUNDARY_VIOLATED = YES for authority provenance
CROSS_SPEC_DESIGN_CONFORMANCE = FINDINGS
```

## 18. SOLID Audit

| Principle | Result | Evidence |
|---|---|---|
| SRP | `PASS` | Value objects, basis, policies, resolver, use cases and ports have coherent reasons to change. |
| OCP | `PASS` | New capabilities use immutable entry data and the common path; no central category switch is required for synthetic registration. |
| LSP | `NOT_APPLICABLE` | No inheritance hierarchy or substitutable subtype contract is introduced. |
| ISP | `PASS` | `ExecutionCatalogBasisReader` and `NormalCatalogSource` are narrow consumer-shaped interfaces. |
| DIP | `PASS` structurally | Application depends on source ports; domain has no infrastructure dependency. The authority proof carried by those ports is nevertheless insufficient. |

```text
SRP_VIOLATIONS = 0
OCP_VIOLATIONS = 0
LSP_VIOLATIONS = 0
ISP_VIOLATIONS = 0
DIP_VIOLATIONS = 0
UNJUSTIFIED_SOLID_VIOLATIONS = 0
```

The authority findings do not justify adding a speculative factory, strategy,
provider hierarchy, or generic adapter framework.

## 19. Dependency Direction Audit

The actual graph is:

```text
src/domain/exec-registry.ts
  -> src/domain/exec-contract.ts
src/application/exec-registry.ts
  -> domain registry contracts
  -> application source ports
src/composition/exec-registry.ts
  -> application services and ports
```

No domain module imports infrastructure, filesystem, HTTP, transport,
prototype, `.pi`, or a foreign SDK. The architecture/import test covers the
four productive registry modules. The direct graph preserves the approved
inner-to-outer direction.

```text
DEPENDENCY_DIRECTION_VIOLATIONS = 0
INFRASTRUCTURE_LEAKAGE_POINTS = 0
DEPENDENCY_DIRECTION_CONFORMANCE = PASS
```

The missing producer proof is a contract/authority problem at the existing
port boundary, not an import-direction violation.

## 20. Lifecycle Design Audit

No mutable execution lifecycle state machine was introduced. The actual
immutable transitions are:

```text
register absent key -> new basis
resolve frozen basis -> resolved result or canonical failure
```

Duplicate/conflicting keys, unsupported versions, wrong scope, disallowed
bootstrap category and role mismatch fail without mutating the supplied basis.
There is no retry owner, recovery transition, terminal mutable state, or direct
map mutation path in this ticket.

```text
TRANSITION_OWNER = CatalogBasis / RegistryResolutionService
VALID_TRANSITIONS = PRESERVED
INVALID_TRANSITIONS = PRESERVED
RECOVERY_TRANSITIONS = NOT_APPLICABLE
TERMINAL_TRANSITIONS = PRESERVED for an in-process frozen basis
FORBIDDEN_BYPASS_PATHS = PRESERVED locally; source provenance remains a finding
LIFECYCLE_AUTHORITY_DUPLICATED = NO
GENERIC_STATE_MUTATION_BYPASS = NO
TERMINAL_STATE_BYPASS = NO
LIFECYCLE_DESIGN_CONFORMANCE = PASS
```

## 21. Failure / Recovery Structure Audit

Failure detection and canonical result construction remain in
`RegistryResolutionService`; source-selection failures are mapped by the
application service. `CONTRACT_INVALID`, `UNKNOWN_CAPABILITY`, and
`INCOMPATIBLE_CAPABILITY` retain distinct meanings. Failure results carry
`noMutation = true` and `noApproval = true`.

There is no local durable evidence, external effect, retry, recovery, or
reconciliation path. Physical CAS and recovery are correctly deferred to the
approved later owner.

```text
FAILURE_DETECTION = PRESERVED
FAILURE_OWNER = PRESERVED
RETRY_OWNER = OUTSIDE_SCOPE
IDEMPOTENCY_BOUNDARY = PRESERVED locally
RECOVERY_PATH = OUTSIDE_SCOPE
RECONCILIATION_PATH = OUTSIDE_SCOPE
RECOVERY_STRUCTURE_COLLAPSED = NO
RETRY_OWNERSHIP_DRIFT = NO
IDEMPOTENCY_BOUNDARY_DRIFT = NO
```

## 22. Clean Code Structural Audit

| Structural check | Result | Evidence |
|---|---|---|
| Clear domain naming | `PASS` | Registry, entry, basis, scope, version, allowlist and canonical outcome terms are explicit. |
| Cohesive methods | `PASS` | Parsing, membership, lookup, policy checks and orchestration are separated. |
| Explicit side effects | `PASS` | Registration returns a new basis; source reads and result publication are explicit. |
| Explicit mutation boundaries | `PASS` | Objects/arrays are frozen and old bases remain available. |
| Boolean mode switch | `PASS` | No boolean mode parameter controls unrelated semantics. |
| Long parameter list | `PASS` | Named input records and narrow ports are used. |
| Primitive obsession | `PASS` with value-object minor finding | Core concepts are typed; revision/source are intentionally local fields. |
| Magic values | `PASS` | Bootstrap categories and source markers are named constants where used. |
| Generic util/service buckets | `PASS` | No `Manager`, `Helper`, or generic service bucket is introduced. |
| Domain rule duplication | `FINDINGS` | Caller and entry support sets jointly decide one compatibility outcome. |
| Deep nesting | `PASS` | Guard clauses keep application and domain flows readable. |
| Comment-dependent correctness | `FINDINGS` at authority seam | Comments describe producer identity, but runtime verification is only a string marker. |
| Hidden side effects | `PASS` | No source read or registration occurs through an accessor unexpectedly. |
| Hidden temporal coupling | `FINDINGS` | `read(repositoryId)` has no frozen-revision/selection contract and may resolve whatever basis the source currently returns. |
| Unnecessary mutability | `PASS` | New-basis publication is explicit and immutable. |

```text
GOD_COMPONENTS = 0
FAT_INTERFACES = 0
PRIMITIVE_OBSESSION_REGRESSIONS = 0
GENERIC_SERVICE_BUCKETS = 0
GENERIC_UTIL_BUCKETS = 0
PREMATURE_ABSTRACTIONS = 0
OVERENGINEERING_FINDINGS = 0
HIDDEN_SIDE_EFFECTS = 0
HIDDEN_TEMPORAL_COUPLINGS = 1
CLEAN_CODE_STRUCTURAL_CONFORMANCE = PASS with authority findings tracked separately
```

## 23. Testability / Structural Test Audit

### Direct behavior coverage

| Design-critical behavior | Actual witness | Result |
|---|---|---|
| Semver major/minor/patch and explicit set | `tests/exec-001-ticket-002.test.ts:75-105` | Direct positive/negative witness present. |
| Complete deterministic mapping | `:120-142` | Direct mapping and frozen-basis witness present. |
| Duplicate/conflict/no mutation | `:144-151` | Direct negative/idempotency witness present. |
| NORMAL isolation | `:153-176` | Direct two-scope and source-substitution witness present. |
| BOOTSTRAP allowlist | `:178-195` | Direct allowlist and normal-capability negative witness present. |
| Unknown/incompatible distinction | `:197-213` | Direct distinct-result witness present. |
| Synthetic common-path registration | `:215-231` | Direct registration/resolution and old-basis witness present. |
| Forged direct input/scope/schema | `:233-253` | Direct negative witness is present but incomplete for producer provenance. |
| Untrusted/wrong-source adapter | `:255-277` | Direct fail-closed witness is present but does not test forged expected-source material, stale material, or alternate proof contract. |

The import guard at `tests/exec-001-ticket-002.test.ts:295-310` is present and
checks forbidden direct imports. It is not a substitute for producer
provenance verification or a transitive architecture graph.

```text
DIRECT_BEHAVIOR_WITNESSES = 9
PROXY_ONLY_BEHAVIORS = 0
UNTESTED_STATE_TRANSITIONS = 0
UNPROVEN_CONCURRENCY_CONTRACTS = 0
MISSING_ARCHITECTURE_GUARDS = 0
DESIGN_TEST_COVERAGE_GATE = BLOCKED
```

The local acceptance rows are directly executable, but the approved authority
proof requirements are not fully witnessed. Missing structural witnesses are:

1. caller-injected supported-set authority rejection;
2. forged basis carrying the expected producer source marker;
3. stale/mutated or wrong frozen-revision material rejection; and
4. an alternate adapter satisfying or violating the same producer proof.

```text
ARCHITECTURE_GUARD_PRESENT = YES
ARCHITECTURE_GUARD_MISSING = NO
ARCHITECTURE_GUARD_INEFFECTIVE = NO for the direct forbidden-import guard
TESTABILITY_REGRESSION = YES
```

The missing foreign producer/runtime does not become a local closure blocker;
these witnesses are still required before integrated authority proof can pass.

## 24. Design Deviation Audit

The implementation reports `DESIGN_DEVIATIONS = NONE`. Independent review finds
these material undeclared differences from the approved structural authority
contract:

| Actual difference | Classification | Reason |
|---|---|---|
| Producer source is represented by a public string marker and local basis membership rather than a producer-issued identity/brand verified by the consumer | `UNDECLARED_MATERIAL_DEVIATION` | The design explicitly requires issuer, scope, brand, stale/mutation and forgery verification. |
| Source ports return `CatalogBasis` without an exact frozen-basis selector/revision/provenance record | `UNDECLARED_MATERIAL_DEVIATION` | The design requires exact frozen-basis consumption at the integrated seam. |
| Resolution treats request-provided `supportedVersions` as a compatibility input | `UNDECLARED_MATERIAL_DEVIATION` | The design says caller input cannot supply authoritative support-set truth. |
| Local module layout and use of static policy methods | `VALID_LOCAL_IMPLEMENTATION_DETAIL` | Responsibility, dependency direction and testability remain intact. |

```text
RECORDED_DESIGN_DEVIATIONS = 0
VALID_DESIGN_DEVIATIONS = 1
INVALID_DESIGN_DEVIATIONS = 0
UNDECLARED_MATERIAL_DEVIATIONS = 3
DESIGN_DEVIATION_CONFORMANCE = FINDINGS
```

## 25. Structural Self-Check Verification

The implementation claims `IMPLEMENTATION_STRUCTURAL_SELF_CHECK = PASS` and
reports zero authority, testability, boundary and duplication defects. The
local class/port layout and dependency graph support several of those claims,
but the full claim is not supported:

| Claim | Independent result |
|---|---|
| `DOMAIN_MODEL_CONFORMANT = YES` | `FALSE_PASS` — support-set authority is caller-influenced. |
| `AGGREGATE_BOUNDARIES_CONFORMANT = YES` | `CONFIRMED` for local immutable aggregate boundaries. |
| `INVARIANT_PLACEMENT_CONFORMANT = YES` | `FALSE_PASS` — support and producer provenance inputs are not fully authoritative. |
| `COMPONENT_BOUNDARIES_CONFORMANT = YES` | `FALSE_PASS` — source result contracts lack issuer/frozen-basis proof. |
| `SOLID_CONFORMANT = YES` | `CONFIRMED` for material SOLID structure. |
| `DEPENDENCY_DIRECTION_CONFORMANT = YES` | `CONFIRMED`. |
| `CLEAN_CODE_STRUCTURALLY_ACCEPTABLE = YES` | `CONFIRMED` with the authority/temporal observations already recorded. |
| `CROSS_SPEC_BOUNDARY_CONFORMANT = YES` | `FALSE_PASS` — source marker is not provenance proof. |
| `CRITICAL_INVARIANTS_WITH_TESTS = ALL` | `FALSE_PASS` — required forged/stale/alternate proof witnesses are missing. |
| `TESTABILITY_REGRESSIONS = 0` | `FALSE_PASS` — authority-proof test surfaces are incomplete. |
| `DOMAIN_RULE_DUPLICATION = 0` | `FALSE_PASS` — caller and entry support sets jointly decide compatibility. |

```text
IMPLEMENTATION_STRUCTURAL_SELF_CHECK = FALSE_PASS
```

## 26. Findings

## IDC-CRITICAL-001 — Catalog source authority is forgeable and frozen-basis provenance is not verified

Severity: CRITICAL  
Category: `CROSS_SPEC_AUTHORITY_GAP`; `CALLER_SUPPLIED_AUTHORITY_BYPASS`

Ticket: `EXEC-001-TICKET-002`  
Implementation Design: `docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-implementation-design.md`  
Audit Target HEAD: `36ac11c08d6e7b9416e41662646c2686fcfef677`

Designed responsibility/component:
`ExecutionCatalogBasisReader`, `NormalCatalogSource`, `ResolveExecCapability`,
`RegisterExecCapability`, and the DOM/REPO ACL seams.

Approved design:
The design's authority-consumption records require an authorized issuer,
exact scope, producer identity/brand, consumer-side provenance verification,
stale/mutation rejection, forged-input rejection, caller-injection rejection,
and alternate-adapter evidence. Section 17 requires an authorized exact basis
and says caller input cannot establish catalog authority. The source contract
is integrated-only, but it must preserve those proof semantics when consumed.

Actual implementation:
`CatalogBasis.create` accepts arbitrary source text and returns a locally
authenticated basis. `ResolveExecCapability.assertAuthorizedBasis` checks only
local WeakSet membership, scope equality and a source string at
`src/application/exec-registry.ts:83-92`. The source ports at
`src/application/exec-registry-ports.ts:11-19` carry only `CatalogBasis` and a
repository string; they carry no producer-issued proof, revision selector,
digest, or stale/mutation evidence. `RegisterExecCapability.register` at
`src/application/exec-registry.ts:101-104` accepts any caller-provided basis
without source verification.

Repository evidence:

- `src/domain/exec-registry.ts:419-429` allows any caller to create a basis
  with any `source` value.
- `src/application/exec-registry.ts:68-79` selects an adapter result and
  `:83-92` accepts the result when `source` equals a public constant.
- A direct reproduction using a caller-created basis with
  `source: 'REPO_NORMAL_CATALOG'` and `scope: CatalogScope.normal('forged-repo')`
  returned `RESOLVED RESOLVED REPO_NORMAL_CATALOG forged-repo` through
  `ResolveExecCapability`; no producer-issued proof was present.
- The negative tests at `tests/exec-001-ticket-002.test.ts:266-277` cover an
  untrusted shape and a wrong source marker, but not a forged basis with the
  expected marker.

Structural problem:
A public constructor and copied source string are being used as the boundary
for an authority-bearing catalog result. Any caller-controlled adapter can mint
the expected marker and materialize a locally valid basis. The application
also has no way to bind the read to the exact frozen catalog revision required
by the execution. The direct basis-injection check rejects a `basis` property in
one resolve request, but it does not prevent an adapter from injecting the same
basis through the accepted port, and registration has no equivalent check.

DDD impact:
The consumer does not verify the foreign authority that owns repository/basis
truth. This weakens the ACL and permits a foreign-looking object to become a
canonical local catalog basis.

SOLID impact:
No material SRP/DIP violation is introduced, but the port contract's
abstraction is semantically incomplete: substitutability of alternate adapters
is not established.

Clean Code impact:
The names and method decomposition are clear. The explicit source marker gives
a misleading appearance of provenance while relying on comment/constant
convention rather than executable authority proof.

Dependency direction impact:
The import direction remains correct. The boundary contract itself is
insufficient even though dependency inversion is structurally present.

Invariant impact:
Exact source ownership, frozen-basis identity, revision continuity, and
cross-repository attachment cannot be enforced at the consumer seam. A forged
or stale basis can reach domain resolution.

Testability impact:
The direct authority negative witness required by the design is absent. A
future producer cannot demonstrate the same proof contract through an
alternate adapter.

Why this matters:
`EXEC-REGISTRY-004` requires resolution against the execution's canonical
repository and frozen catalog revision, not merely a shape that carries the
right text. Accepting caller-minted authority can resolve a capability from the
wrong source or basis and defeats the ownership boundary even when all local
happy-path tests pass.

Minimum structural correction required:
The source result must carry a producer-owned authority identity appropriate to
the accepted architecture, and the consumer must verify issuer, exact scope,
frozen revision/basis binding, stale or mutation behavior, forged input, and
alternate-adapter conformance before passing material to domain resolution.
Registration must not provide a second unverified basis-authority path.

Capability: `DOM-EXEC-IDENTITY-SNAPSHOT`; `REPO-EXEC-NORMAL-CATALOG`
Dependency class: `REQUIRED_FOR_INTEGRATED_PROOF`
Local closure blocking: NO
Local acceptance requires productive capability: NO
Completion evidence timing: integrated proof checkpoint
Dependency class reclassification required: NO
Upstream dependency classification preserved: YES
Suggested local/integrated blocking effects: no local capability promotion or local closure block; integrated proof remains blocked until producer-consumer provenance evidence exists.

## IDC-CRITICAL-002 — Caller request supplies a second authoritative supported-version set

Severity: CRITICAL
Category: `CALLER_SUPPLIED_AUTHORITY_BYPASS`; `INVARIANT_PLACEMENT_DRIFT`

Ticket: `EXEC-001-TICKET-002`  
Implementation Design: `docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-implementation-design.md`  
Audit Target HEAD: `36ac11c08d6e7b9416e41662646c2686fcfef677`

Designed responsibility/component:
`SupportedVersionSet`, `VersionCompatibilityPolicy`, and
`ResolveExecCapability`.

Approved design:
The design §7 explicitly records `CALLER_AS_AUTHORITY_CHECK = PASS` and says
caller input cannot supply the authoritative support set. The approved domain
model gives support-set compatibility one domain-owned rule and requires
explicit set membership without alias, range, approximation, or conversion.

Actual implementation:
`RegistryResolutionRequest` requires a caller-provided
`SupportedVersionSet` at `src/domain/exec-registry.ts:456-464`.
`ResolveExecCapability.resolve` passes the entire request directly to the
resolver at `src/application/exec-registry.ts:43-46`. The policy at
`src/domain/exec-registry.ts:485-490` first resolves the requested version in
`request.supportedVersions` and then checks `entry.supportedVersions`.

Repository evidence:

- Tests construct the effective support authority from request input at
  `tests/exec-001-ticket-002.test.ts:51-68`.
- The unsupported test at `:197-213` proves canonical rejection for one caller
  set, but does not prove that caller-supplied support authority is rejected or
  producer-verified.
- The approved design says the caller cannot supply this authority, while the
  implementation makes it a required request field and uses it in the canonical
  decision.

Structural problem:
There are two sources deciding one compatibility outcome. A caller can narrow
or replace the consumer support declaration and change a resolution result
before the registry entry's own support set is considered. The implementation
therefore has a second transition/decision authority at the request boundary,
contrary to the approved authority placement. Even though a caller cannot use
this path to expand beyond the entry's set, it can still alter canonical
resolution semantics and the source is not authenticated.

DDD impact:
A semantic compatibility decision is partially owned by an external caller
rather than by the approved EXEC authority. This is an authority placement
drift, not merely duplicated input validation.

SOLID impact:
The classes remain cohesive, but the domain policy consumes an unverified
external decision input. No separate SRP or DIP metric is added.

Clean Code impact:
The field name is clear, but the API makes an authority-bearing input look like
ordinary request data and hides the ownership ambiguity.

Dependency direction impact:
No import-direction defect is present. The defect is at the application-to-
domain authority seam.

Invariant impact:
A supported version that the canonical consumer set permits can be reported as
incompatible because of caller input; the same operation has more than one
canonical support-set decision source.

Testability impact:
Existing tests pass only the expected set and therefore confirm the proxy of
caller-supplied semantics. There is no direct caller-injection witness.

Why this matters:
The design's explicit anti-forgery check is intended to prevent caller input
from becoming version authority. Without that boundary, downstream resolution
can vary based on an unverified request field and no longer represents the
approved consumer support contract.

Minimum structural correction required:
Make the effective supported-version authority producer/consumer-owned and
verified at the approved seam. A request may express an assertion, but it must
not independently establish or replace the canonical support set used for
resolution.

Capability: `UNIT-EXEC-REGISTRY-FIXTURE` / local registry compatibility decision
Dependency class: `INFORMATIONAL`
Local closure blocking: YES
Local acceptance requires productive capability: NO
Completion evidence timing: local ticket evidence
Dependency class reclassification required: NO
Upstream dependency classification preserved: YES
Suggested local/integrated blocking effects: local structural closure evidence must include caller-injection rejection; no productive foreign capability is required.

## IDC-MAJOR-001 — Required authority and provenance witness surfaces are incomplete

Severity: MAJOR
Category: `TESTABILITY_REGRESSION`; `MISSING_STRUCTURAL_TESTS`

Ticket: `EXEC-001-TICKET-002`  
Implementation Design: `docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-implementation-design.md`  
Audit Target HEAD: `36ac11c08d6e7b9416e41662646c2686fcfef677`

Designed responsibility/component:
The `AUTHORITY_CONSUMPTION_PROOF` and
`PRODUCER_CONSUMER_CONTRACT_PROOF` test surfaces for the two external source
ports and the local fixture.

Approved design:
The design requires direct forged-input, caller-injection, stale/mutated-input,
and alternate-adapter witnesses. It rejects source inspection or a passing
happy path as provenance proof. The design's structural test coverage gate
claims all applicable witnesses are direct and executable.

Actual implementation:
The test file contains direct local behavior tests for semver, resolution,
immutability, scope isolation, bootstrap allowlisting, outcome distinction,
synthetic registration, forged scope/schema, direct basis injection, and
wrong-source/untrusted adapters. It does not contain the required direct
witnesses for a caller-forged expected source marker, stale or mutated basis,
exact frozen revision binding, or a valid/invalid alternate adapter under the
same producer proof contract.

Repository evidence:

- `tests/exec-001-ticket-002.test.ts:233-253` rejects a forged scope and schema
  prototype and a direct `basis` request field, but not a forged expected-source
  basis returned by an adapter.
- `tests/exec-001-ticket-002.test.ts:255-277` rejects an untrusted shape and a
  wrong source marker, but the expected marker remains forgeable.
- `tests/exec-001-ticket-002.test.ts:295-310` is a direct forbidden-import
  source guard, not proof of producer authority or an alternate adapter's
  provenance behavior.
- No test asserts stale/mutated source material or a frozen `CatalogRevision`
  selector at the application seam.

Structural problem:
The test surface proves local happy paths and some fail-closed conditions but
leaves the exact escape identified in `IDC-CRITICAL-001` untested. The
implementation structural self-check therefore overstates structural proof.

DDD impact:
Unwitnessed authority verification leaves ownership and attachment invariants
unprotected at the ACL boundary.

SOLID impact:
The narrow interfaces are present, but substitutability and contract
conformance of alternate adapters are not demonstrated.

Clean Code impact:
No formatting or naming defect is required for this finding. The concern is
that a comment/marker convention is not protected by executable evidence.

Dependency direction impact:
The import guard is present; missing proof concerns the semantic contract of an
existing dependency edge.

Invariant impact:
Forged, stale, detached, or caller-injected basis material could evade the
intended negative boundary without a regression test.

Testability impact:
This is a material structural testability regression because the approved
provenance contract cannot be independently rechecked at the consumer seam.

Why this matters:
The ticket's integrated-only classification does not remove the requirement
to preserve a testable producer-consumer contract. A fixture or wrong-source
negative test cannot stand in for forged expected-source, stale, and alternate-
adapter evidence.

Minimum structural correction required:
Add direct negative and compatibility witnesses for every authority-proof field
required by the approved design, including caller injection, forged expected
issuer/brand, stale or mutated revision/basis, and alternate adapters. Keep
productive availability classified integrated-only.

Capability: `DOM-EXEC-IDENTITY-SNAPSHOT` and `REPO-EXEC-NORMAL-CATALOG`
Dependency class: `REQUIRED_FOR_INTEGRATED_PROOF`
Local closure blocking: NO
Local acceptance requires productive capability: NO
Completion evidence timing: integrated proof checkpoint
Dependency class reclassification required: NO
Upstream dependency classification preserved: YES
Suggested local/integrated blocking effects: local behavior witnesses remain executable; integrated authority proof is blocked until the required witness set is complete.

## IDC-MINOR-001 — SemanticVersion exposes lossy numeric components for valid large versions

Severity: MINOR
Category: `VALUE_OBJECT_SEMANTICS`; `CLEAN_CODE_STRUCTURAL_CONFORMANCE`

Ticket: `EXEC-001-TICKET-002`  
Implementation Design: `docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-implementation-design.md`  
Audit Target HEAD: `36ac11c08d6e7b9416e41662646c2686fcfef677`

Designed responsibility/component:
`SemanticVersion` value object, including parsed major/minor/patch components
and exact comparison semantics.

Approved design:
The design requires semantic-version components and exact major/minor/patch
meaning. The existing syntax accepts arbitrary-length numeric components, and
the implementation sequence explicitly calls for component and comparison
tests.

Actual implementation:
`src/domain/exec-registry.ts:103-110` stores exact digit strings for comparison
but exposes `major`, `minor`, and `patch` using `Number(...)`. For a valid
version such as `1.2.9007199254740993`, the public `patch` value cannot preserve
the exact component even though `compare` remains exact.

Repository evidence:

- `src/domain/exec-registry.ts:108-110` converts components to JavaScript
  numbers.
- `src/domain/exec-registry.ts:134-153` correctly compares exact digit strings.
- `tests/exec-001-ticket-002.test.ts:88-91` proves exact ordering for a large
  patch but does not assert the exposed component value.

Structural problem:
The same value object exposes two inconsistent representations of a valid
semantic version: exact internal digits for ordering and lossy public numeric
components. Consumers reading the component fields can observe a value that is
not the declared version component.

DDD impact:
The value object's canonical component semantics are not fully self-consistent.

SOLID impact:
No material SOLID violation.

Clean Code impact:
The public representation hides a precision constraint that the accepted
semantic-version syntax does not impose.

Dependency direction impact:
No impact.

Invariant impact:
Exact major/minor/patch meaning is weakened for valid large components.

Testability impact:
The existing comparison test does not protect the public component contract.

Why this matters:
The design makes semantic version meaning observable. A caller can receive an
incorrect component while comparison and classification use a different exact
representation.

Minimum structural correction required:
Ensure the public component representation preserves the exact accepted
semver meaning, or establish and enforce an authoritative range constraint
before exposing numeric components.

Capability: `UNIT-EXEC-REGISTRY-FIXTURE` / semantic version value object
Dependency class: `INFORMATIONAL`
Local closure blocking: NO
Local acceptance requires productive capability: NO
Completion evidence timing: local follow-up evidence
Dependency class reclassification required: NO
Upstream dependency classification preserved: YES
Suggested local/integrated blocking effects: non-blocking localized value-object correction and direct component witness.

## 27. Metrics

```text
RESPONSIBILITIES:
- DESIGNED: 9
- PRESERVED: 5
- LOCALLY_ADAPTED: 4
- MISSING: 0
- WRONG_PLACEMENT: 0

COMPONENTS:
- DESIGNED: 14
- PRESERVED: 8
- LOCALLY_ADAPTED: 6
- COLLAPSED: 0
- UNJUSTIFIED_SPLITS: 0
- MISSING: 0
- UNPLANNED: 0

DDD:
- AGGREGATE_BOUNDARY_VIOLATIONS: 0
- DOMAIN_INVARIANT_BYPASSES: 1
- UNENFORCED_INVARIANTS: 0
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
- IDENTITY_AUTHORITY_GAPS: 0
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
- CALLER_SUPPLIED_AUTHORITY_BYPASS: 2

CLEAN_CODE:
- GOD_COMPONENTS: 0
- FAT_INTERFACES: 0
- PRIMITIVE_OBSESSION_REGRESSIONS: 0
- GENERIC_SERVICE_BUCKETS: 0
- GENERIC_UTIL_BUCKETS: 0
- PREMATURE_ABSTRACTIONS: 0
- OVERENGINEERING_FINDINGS: 0
- HIDDEN_SIDE_EFFECTS: 0
- HIDDEN_TEMPORAL_COUPLINGS: 1

TESTABILITY:
- TESTABILITY_REGRESSIONS: 1
- MISSING_STRUCTURAL_TESTS: 4

DESIGN_DEVIATIONS:
- RECORDED: 0
- VALID: 1
- INVALID: 0
- UNDECLARED_MATERIAL: 3

SELF_CHECK:
- CLAIMED: PASS
- AUDITED: FALSE_PASS

FINDINGS:
- CRITICAL: 2
- MAJOR: 1
- MINOR: 1
- INFO: 0
```

## 28. Re-audit Reconciliation

This audit is an independent execution against the supplied target pair. No
prior specialist audit artifact was read or used, and no prior finding lineage
was adopted. Consequently, previous-finding status is not inferred.

```text
RE_AUDIT_MODE = INDEPENDENT_FROM_PRIOR_SPECIALIST_ARTIFACTS
PREVIOUS_FINDINGS_RECONCILED = NOT_APPLICABLE
CURRENT_FINDINGS_RECALCULATED = YES
REMEDIATION_DELTA_AUDITED = YES at target HEAD
NEWLY_APPLICABLE_FINDINGS = 4
```

The implementation remediation/checkpoint state was compared directly with the
approved design and repository code. The four findings above are the current
independent result, not a synchronization of any other audit artifact.

## 29. Specialist Completeness Proof

- The complete `audit-implementation-design-conformance` skill was loaded and
  applied, together with the authority-completeness, finding-completion, and
  authority-provenance shared contracts.
- The ticket, approved implementation design, ticket-set audit, ADR, portfolio,
  SPEC, Gap Matrix, Implementation Plan, and relevant upstream authority
  sections were inspected.
- The implementation baseline, pinned target HEAD, supplied state fingerprint,
  actual changed production files, tests, evidence files, package/typecheck
  surface, and repository dependency graph were reconstructed.
- Responsibility placement was compared responsibility by responsibility and
  component placement component by component.
- Aggregate ownership, immutable basis publication, invariants, lifecycle,
  persistence boundary, recovery scope, ACL seams, SOLID, dependency direction,
  Clean Code structure, testability, deviations, and the implementation
  structural self-check were independently evaluated.
- Authority-bearing DOM and REPO consumption records were checked for issuer,
  scope, identity/brand, consumer verification, stale/mutation behavior,
  forgery rejection, caller-injection rejection, alternate-adapter evidence,
  capability status, dependency class, and blocking effect.
- `npm test` executed 60 tests with 60 passed, 0 failed, 0 skipped.
- `npm run typecheck` completed successfully.
- Direct behavior evidence was distinguished from proxy evidence; local fixture
  evidence was not promoted to productive foreign availability.
- No production code, tests, ticket state, upstream authority, Git state,
  commits, branches, remotes, or publication state was changed by this audit.

```text
COMPLETE_DOMAIN_AUDIT = YES
RESPONSIBILITY_BY_RESPONSIBILITY = COMPLETE
COMPONENT_BY_COMPONENT = COMPLETE
INVARIANT_BY_INVARIANT = COMPLETE
DEPENDENCY_BOUNDARY_BY_DEPENDENCY_BOUNDARY = COMPLETE
AUTHORITY_PROVENANCE_DEFENSE = COMPLETE_WITH_FINDINGS
FULL_AUDIT_CONTINUED_AFTER_FINDINGS = YES
NO_REMEDIATION_PERFORMED = YES
```

AUDIT_TARGET_HEAD: 36ac11c08d6e7b9416e41662646c2686fcfef677
AUDIT_TARGET_STATE_FINGERPRINT: 191ca7c9d2f15f71bc48ee2e17059438ed01efba281c261ad329e41532be6714
DOMAIN_AUDIT_COMPLETE: YES
SPECIALIST_RESULT: SPECIALIST_DESIGN_FINDINGS