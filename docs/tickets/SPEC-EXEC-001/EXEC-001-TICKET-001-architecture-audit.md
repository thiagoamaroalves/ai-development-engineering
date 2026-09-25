# Specialist Architecture Audit — EXEC-001-TICKET-001

## 1. Audit identity and basis

```text
Audit mode = READ_ONLY INDEPENDENT ADVERSARIAL ARCHITECTURE_FIRST
             OWNERSHIP_PRESERVING AUTHORITY_PRESERVING CROSS_SPEC_AWARE
             IDENTITY_AWARE LEGACY_TRANSITION_AWARE
Ticket = EXEC-001-TICKET-001
Implementation unit = EXEC-IMP-01
Ticket path = docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-001-capability-specific-envelope-and-payload-schemas.md
Approved design = docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-001-implementation-design.md
Ticket-set audit = docs/tickets/SPEC-EXEC-001/implementation-ticket-audit.md
Component SPEC = docs/specs/SPEC-EXEC-001-skill-contracts-and-capability-registry.md, revision 5
Primary ADR = docs/adrs/ADR-0003-versioned-skill-contracts.md, revision 3, ACCEPTED
Related ADR context = docs/adrs/ADR-0001-workflow-domain-and-identity.md; docs/adrs/ADR-0006-persistence-journal-idempotency-and-recovery.md
Cross-spec authority = docs/specs/SPEC-DOM-001-workflow-authority-and-governance.md, revision 4
Gap = GAP-018
Requirements = EXEC-ENVELOPE-001, EXEC-ENVELOPE-002
Acceptance = AC-EXEC-001, AC-EXEC-002
Implementation baseline = 8cf79cd37ebb02d0657c1fb191cea1d194b71f89
Current HEAD = 38a81fc832b55360fd0cde1a584076cb28a5482f
AUDIT_TARGET_HEAD = 38a81fc832b55360fd0cde1a584076cb28a5482f
AUDIT_TARGET_STATE_FINGERPRINT = a85d61bc8ef7d9f1352b111ac3d28e7f71ce4a90a3b05f540b410b5e29203073
Working tree at intake = CLEAN
Ticket status at target = VALIDATION_REQUIRED
SIBLING_SPECIALIST_ARTIFACTS_CONSUMED = 0
```

Semantic implementation files changed from the stated implementation baseline:

```text
src/application/exec-contract.ts
src/domain/exec-contract.ts
src/domain/exec-schema.ts
tests/exec-001-ticket-001.test.ts
```

The target also contains ticket/evidence/checkpoint/design/remediation document
updates. Those documentary overlays are not treated as implementation authority
and are not counted as production boundary changes. No production change was
found in `src/composition/exec-contract.ts` or
`src/infrastructure/exec-schema-validator.ts` relative to the implementation
baseline; they are nevertheless affected boundary paths and were audited.

## 2. Source precedence and reconstructed architectural contract

The audit applies this precedence: accepted ADR authority, the canonical
component SPEC, explicit cross-SPEC contracts, the validated Gap Matrix, the
Implementation Plan, the approved Design, the Ticket, and finally repository
behavior. A claim in a ticket, design, execution report, or test is evidence,
not authority, unless it is independently supported by the higher source.

### 2.1 Ownership and authority

| Concern | Canonical owner | Contract boundary and evidence | This ticket may / must not own |
|---|---|---|---|
| Common envelope and capability-specific schema identity | `SPEC-EXEC-001 / EXEC-001` | ADR-0003 Decision; SPEC-EXEC-001 §9 O-016 and §13 `EXEC-ENVELOPE-001/002` | May own the ticket-local immutable definitions, selection and validation result; must not create DOM identity or lifecycle |
| Structured minimum fields and contract-invalid result | `SPEC-EXEC-001 / EXEC-001` | SPEC-EXEC-001 §13 `EXEC-ENVELOPE-002` and `EXEC-CONTRACT-001`; ADR-0003 | May require fields and fail closed; must not turn validity into approval, checkpoint confirmation or effect authorization |
| Execution/activity/attempt/cycle identities, snapshot and lifecycle | `SPEC-DOM-001` | SPEC-EXEC-001 §10 and §12 consume DOM contracts; DOM revision 4 owns the identity/lifecycle boundary | May transport opaque references; must not create, normalize, resolve or mutate DOM authority |
| Registry publication, catalog revision, dynamic capability resolution | `SPEC-EXEC-001` later registry units with REPO/DOM/source boundaries | SPEC-EXEC-001 §§12.1, 13 `EXEC-REGISTRY-*`, and §25 dependency contract | This unit uses only a frozen ticket-local schema set; it must not implement dynamic registry/source publication |
| Physical persistence, journal, recovery and external effects | `SPEC-PLAT-001` and effect owners | SPEC-EXEC-001 §19; ADR-0006 | Must not persist, execute, confirm or reconcile effects |
| Runtime/session/dispatch | `SPEC-EXEC-002` | Portfolio ownership and ticket `Does Not Implement` | Must not implement sessions, leases, dispatch or runtime lifecycle |
| Transport and projections | BACKEND/OPS/UI owners | SPEC-EXEC-001 §§14, 18 and 20 | Must not add routes or presentation authority |
| Schema-engine mechanics | Infrastructure adapter behind the EXEC port | Approved design §§4, 9, 12; `src/infrastructure/exec-schema-validator.ts` | Adapter may compile/check the selected definition; it must not mint schema meaning or select a foreign definition |

### 2.2 Canonical identities, immutability and lineage

- The ticket-local contract identities are the immutable `SchemaReference`
  values for `exec-envelope@1.0.0` and
  `exec-capability-001-payload@1.0.0`. The capability ID is
  `capability-001`; it is not a DOM identity.
- `ExecutionId`, `ActivityId`, `AgentAssignmentId`, `ArtifactCycleId` and
  `AttemptId` remain opaque DOM-owned references. The implementation does not
  resolve or replace them with local IDs.
- Schema documents, schema-definition sets, successful structured values and
  failure values are frozen. The validator's WeakMap/WeakSet caches are
  technical evidence caches, not business authority or persisted state.
- There is no aggregate/entity lifecycle, durable record, predecessor/successor
  chain, reconstruction operation, or historical record in this ticket.
  Lineage and aggregate reconstruction are therefore not applicable.
- Generic payload acceptance is a retired contradictory path. The authorized
  cutover is a new canonical capability-specific schema path with no silent
  conversion and no legacy writer.
- No migration authority, durable migration, destructive storage transition or
  rollback of persisted state is introduced.
- Schema validity is not authorization. The ticket carries requested effects
  only as structured data; DOM/backend/PLAT remain authoritative for lifecycle,
  authentication/authorization and effect execution.

### 2.3 Normative behavior reconstructed

`EXEC-ENVELOPE-001` requires a common JSON envelope and a capability-specific
payload validated against identifiable schemas before consumption. Human text
has no operational authority. `EXEC-ENVELOPE-002` requires all structured
minimum envelope fields. `EXEC-CONTRACT-001` requires invalid JSON, missing or
incompatible schemas and invalid payloads to produce `CONTRACT_INVALID` without
success, approval, checkpoint or effect meaning. The ticket is expressly local
schema/contract work; registry resolution, DOM authority, persistence, runtime,
transport and final integrated proof remain outside its scope.

## 3. Applicability matrix

| Dimension | Classification | Result and evidence |
|---|---|---|
| OWNERSHIP | REQUIRED | Production code changes the EXEC schema/validation boundary. Local schema authority remains in `src/domain/exec-schema.ts`; the alternate producer seam introduces the finding below. |
| CANONICAL_AUTHORITY | REQUIRED | Schema identity and selected-definition authority are the ticket's subject. Canonical definitions are frozen and selected internally, but issuer authorization is incomplete. |
| CROSS_SPEC_INTEGRATION | AFFECTED | No foreign capability is required for local closure, but opaque DOM references and downstream contract/effect boundaries must remain non-authoritative locally. |
| IDENTITY | REQUIRED | Schema references and capability association are contract identity; DOM IDs cross the envelope as opaque references. |
| IMMUTABILITY | REQUIRED | Definitions and validated values must remain immutable; successful values deep-copy structured input. |
| LINEAGE | NOT_APPLICABLE | No aggregate, historical record, revision progression, predecessor/successor relation or replay material is created by this validation operation. |
| LEGACY_TRANSITION | AFFECTED | The generic payload acceptance route is retired in favor of the identifiable capability-specific route. No legacy writer or conversion is allowed. |
| DESTRUCTIVE_TRANSITION | NOT_APPLICABLE | The cutover rejects input in a side-effect-free validator and mutates no persisted state; there is no irreversible storage or aggregate transition. |
| MIGRATION_AUTHORITY | NOT_APPLICABLE | No existing persisted data, migration command, migration adapter or migration ownership is introduced. |
| SECURITY_AUTHORIZATION | AFFECTED | The result crosses a contract boundary and must not imply authorization or effect confirmation. No authentication/authorization implementation is allocated to this ticket and no effect path exists in the audited production graph. |

For the two not-applicable transition-related dimensions, replacement/cutover
proof is still recorded: the static ticket-owned definitions are present, the
cutover is authorized by O-016 and `NEW_CANONICAL_PATH`, and direct generic,
identity-mismatch and no-effect witnesses passed. Rollback/roll-forward of
persisted state is not applicable because no state is migrated or destroyed.

## 4. Authority consumption and producer/consumer proof

### 4.1 Unit-owned schema capability

```text
CAPABILITY_ID = EXEC-SCHEMA-CAPABILITY-PAYLOAD
AUTHORITY_EXISTENCE = SPEC-EXEC-001 §13 EXEC-ENVELOPE-001/002 and O-016
TRUTH_OWNER = SPEC-EXEC-001 / EXEC-001
AUTHORITY_SEMANTIC_SOURCE = immutable identifiable envelope and capability payload definitions
OWNER_DOMAIN_OR_BOUNDED_CONTEXT = EXEC-001
CONSUMPTION_CONTRACT = ValidateExecContract selects the ticket-owned definition and consumes validation evidence
PORT_INTERFACE_QUERY_RESOLVER_OR_READER = ExecSchemaValidationPort / ValidateExecContract
CONTRACT_PRODUCER = ticket-owned ExecContractSchemaDefinitions plus canonical JsonSchemaExecValidator
CONTRACT_CONSUMER = ValidateExecContract, StructuredExecutionEnvelope and StructuredCapabilityPayload
RETURNED_DATA = selected schema reference, exact input, valid/invalid result, issues and content fingerprint
VERSION_REVISION_TRANSPORT = SchemaReference carries SchemaId and semantic schema version; no catalog revision is in this unit
FAILURE_NOT_FOUND_STALE_SEMANTICS = selection mismatch, invalid data, malformed receipt or stale/mutated input returns CONTRACT_INVALID
AUTHORITY_STATUS = DEFINED
CONTRACT_STATUS = DEFINED
SEMANTIC_STATUS = DEFINED
LOCAL_TESTABILITY = YES
PRODUCTIVE_AVAILABILITY = NO for the fixture/harness handoff; no foreign productive producer is required
CAPABILITY_SUMMARY_STATUS = CONTRACT_TESTABLE_LOCALLY
DEPENDENCY_CLASS = INFORMATIONAL
AVAILABILITY_EVIDENCE = direct C-EXEC-001/C-EXEC-002 operations and productive composition-path tests
BLOCKING_EFFECT = NONE
RESULT = local contract semantics are defined and executable; no foreign productive-availability promotion is made
```

The ticket's local shorthand `AUTHORITY_CONSUMABLE` is not accepted as a
promotion of a fixture or alternate caller adapter. The independent result is
kept at the shared-contract dimensions above. The relevant architecture defect
is not missing upstream authority; it is that a caller-created subclass is
allowed to issue an authority-shaped result without an independently verified
schema-validation contract.

### 4.2 Authority provenance / anti-forgery proof

```text
PROOF_ISSUER_OWNER = EXEC-001 schema authority; canonical productive issuer is JsonSchemaExecValidator
PROOF_SCOPE = exact canonical envelope or selected capability-payload definition and exact input
PROOF_IDENTITY_OR_BRAND = SchemaReference object identity plus AuthenticatedExecSchemaValidationPort/issued-result WeakSet identity
CONSUMER_VERIFICATION_RULE = ValidateExecContract checks authenticated producer/result identity, exact input, exact canonical reference, result shape and current content fingerprint before construction
STALE_OR_MUTATION_POLICY = canonical receipt/input mutation, missing own fields and current schema failure are rejected
FORGERY_NEGATIVE_TEST = plain forged result, copied adapter, custom schema definition and runtime-created reference tests pass
CALLER_INJECTION_NEGATIVE_TEST = plain unbranded caller port is rejected, but caller-created AuthenticatedExecSchemaValidationPort subclasses are accepted as producers
ALTERNATE_ADAPTER_CONTRACT_TEST = INCOMPLETE; positive independent adapter test only proves it can issue, not that it validates the selected schema
ISSUER_IS_AUTHORIZED = NO for an arbitrary caller-created authenticated subclass; YES only for the canonical composition issuer
PROOF_SCOPE_IS_EXACT = YES for canonical result fields and input binding
CONSUMER_VERIFIES_PROVENANCE = PARTIAL; instance/result provenance is checked, issuer ownership/semantic conformance is not
INPUT_OR_REFERENCE_BINDING = YES
MUTATION_OR_STALE_REJECTION = YES on the canonical receipt path
FORGERY_PATH_REJECTED = PARTIAL; copied/plain result forgery is rejected, public subclass issuance is not
CALLER_INJECTION_REJECTED = NO for a caller-created branded subtype
ALTERNATE_ADAPTER_CONTRACT = FAIL/MISSING
```

The relevant source path is explicit: the exported base class registers every
constructed subclass in `AUTHENTICATED_PORTS` and exposes protected
`issueValidatedResult` (`src/domain/exec-validation-evidence-internal.ts:18-39`,
re-exported by `src/domain/exec-schema.ts:17-20`). `ValidateExecContract`
accepts an injected port and treats that instance/result membership, shape and
fingerprint as sufficient (`src/application/exec-contract.ts:80-145`). A test
subclass returns `valid: true` without evaluating the schema
(`tests/exec-001-ticket-001.test.ts:263-281`), and the same style of adapter
returns `valid: true` for an unknown capability when called directly
(`tests/exec-001-ticket-001.test.ts:318-324`). The later value-construction
check rejects that one unknown-capability value (`:325-332`), but it does not
prove the producer evaluated the selected JSON Schema or establish issuer
authorization.

## 5. Boundary audit results

### 5.1 Ownership and canonical authority

```text
OWNERSHIP_CLASSIFICATION = OWNERSHIP_PRESERVED locally; no foreign lifecycle ownership
FOREIGN_CAPABILITY_DUPLICATED = 0
FOREIGN_BEHAVIOR_DUPLICATED = 0
AUTHORITY_RECOMPUTED_LOCALLY = NO for DOM/registry/effect authority
REPOSITORY_SEMANTIC_AUTHORITY = NO
CANONICAL_WRITE_PATHS = none; this is a side-effect-free validation operation
AUTHORITY_CLASSIFICATION = ALTERNATE_AUTHORITY_INTRODUCED
```

The canonical composition path keeps schema definitions in EXEC and uses the
infrastructure adapter only for JSON Schema mechanics. It does not import
prototype, `.pi`, transport, persistence, DOM or effect code. The defect is a
competing producer/evidence route, not foreign lifecycle absorption: any caller
can create an authenticated subtype and issue a result accepted by the domain
boundary. This violates the owner/provenance boundary even though the static
canonical path itself is correctly wired.

### 5.2 Cross-spec integration

```text
CROSS_SPEC_RESULT = CROSS_SPEC_CONFORMANT for the bounded local unit
FOREIGN_CAPABILITIES_REQUIRED_FOR_LOCAL_EXECUTION = NO
FOREIGN_CAPABILITIES_REQUIRED_FOR_LOCAL_CLOSURE = NO
DOM_CONSUMPTION = opaque identity fields only; no DOM resolver or lifecycle write
PRODUCTIVE_FOREIGN_AVAILABILITY = not claimed
```

No foreign owner was changed or duplicated. The implementation does not
recompute DOM identity, lifecycle, snapshot, registry publication, persistence,
or effect outcomes. Downstream consumers receive only the local contract
surface; integrated mappings remain outside this ticket.

### 5.3 Identity

```text
IDENTITY_RESULT = CONFORMANT
IDENTITY_VIOLATIONS = 0
CANONICAL_SCHEMA_IDENTITY = EXEC_ENVELOPE_SCHEMA_REFERENCE and EXEC_PAYLOAD_SCHEMA_REFERENCE
CAPABILITY_ASSOCIATION = capability-001 bound by selection, schema const and value-construction checks
DOM_IDENTITY_CONTINUITY = opaque references preserved; no local substitute
ALIASES_USED_AS_AUTHORITY = NO
```

`selectPayload` requires exact capability/schema identity and the canonical
value constructors require the exact ticket-owned references. Runtime-created
schema references and copied definitions cannot become the canonical value
reference. The issuer finding is a provenance/authority defect, not an
identity regeneration defect.

### 5.4 Immutability, lineage and reconstruction

```text
IMMUTABILITY_RESULT = CONFORMANT
IMMUTABILITY_VIOLATIONS = 0
LINEAGE_RESULT = NOT_APPLICABLE
RECONSTRUCTION_RESULT = NOT_APPLICABLE
```

Schema documents and definition collections are deeply frozen. Structured
values clone and freeze JSON data, and the complete result/failure surfaces are
frozen. No persistible aggregate/entity or later-state reconstruction exists;
therefore no aggregate identity or reconstruction proof is required for this
unit.

### 5.5 Legacy and cutover

```text
LEGACY_RESULT = TRANSITION_CONFORMANT
LEGACY_AUTHORITY_VIOLATIONS = 0
LEGACY_WRITES_STILL_ACTIVE = NO
ALTERNATE_LEGACY_AUTHORITY = NO
CUTOVER = generic exec-capability-payload acceptance retired; identifiable capability-001 schema is the only local canonical payload path
```

The source no longer selects the old generic schema ID. Unknown capability,
old schema identity and generic-but-invalid data fail closed. No compatibility
mapping silently converts a generic payload, and no persistent legacy state is
migrated here.

### 5.6 Destructive transition and migration

```text
DESTRUCTIVE_TRANSITION = NOT_APPLICABLE
REPLACEMENT_PROVEN = YES for the ticket-local immutable capability schema
CUTOVER_AUTHORIZED = YES by O-016 / EXEC-ENVELOPE-001 and the approved NEW_CANONICAL_PATH
PRE_TRANSITION_GATES_SATISFIED = YES for this local contract operation
POST_TRANSITION_GUARDS_PRESENT = YES for selection, old-schema rejection, generic rejection and no-effect failure
ROLLBACK_OR_ROLL_FORWARD_SEMANTICS = NOT_APPLICABLE; no durable state is changed
MIGRATION_AUTHORITY_RESULT = NOT_APPLICABLE
```

### 5.7 Security and authorization boundary

```text
SECURITY_AUTHORIZATION = CONFORMANT within ticket scope
BACKEND_AUTHORITY = not implemented here and not bypassed
CAPABILITY_POSSESSION_AS_AUTHORIZATION = NO
LEGACY_ROUTE_BYPASS = NO
EFFECT_CONFIRMATION = NO; invalid failures carry noApproval/noCheckpoint/noEffect
```

The schema result is not an authorization decision, and no production effect
path is reachable from the composition root. The caller-mintable validation
issuer remains an authority/provenance defect and must not be treated as an
authorization grant by downstream owners.

## 6. Caller, temporal and architectural-scope checks

```text
CALLER_AS_AUTHORITY_CHECK = BYPASS PRESENT
CALLER_SUPPLIED_AUTHORITY_BYPASS = 1
TEMPORAL_AUTHORITY_PROOF = NOT_APPLICABLE to external mutable authority/effect commit
TEMPORAL_AUTHORITY_GAPS = 0
ARCHITECTURAL_AUTHORITY_GAP_DISCOVERED = NO
```

The caller's raw schema fields are correctly treated as selection assertions,
not as schema documents. However, the caller can select the validation producer
itself through the public `ValidateExecContract` constructor and use the
exported authenticated subclass seam to mint a successful validation receipt.
Canonical receipt/input mutation is rechecked by the productive adapter and
consumer fingerprint; there is no external mutable authority observed before
an effect in this ticket.

Architectural decisions in the implementation classify as follows:

- Frozen ticket-local schema definitions, a narrow adapter port, and a thin
  application orchestrator are `AUTHORIZED_ARCHITECTURAL_REALIZATION`.
- No local aggregate, persistence, registry, transport or effect architecture
  was added.
- The public caller-constructible authenticated producer path is
  `UNAUTHORIZED_ARCHITECTURAL_EXPANSION` because the accepted authority
  contract does not authorize arbitrary callers to mint schema proof.
- No unresolved architectural decision is required; the owner and required
  proof semantics are already defined by the accepted ADR, component SPEC and
  shared provenance contract.

## 7. Executable evidence and architecture guards

Commands run against the pinned target:

```text
npm test = PASS, 80/80
npm run typecheck = PASS
```

Direct architecture/provenance guards run and passing:

```text
1. rejects caller-selected schema authority at the production boundary
2. does not let a custom schema document mint canonical validation authority
3. rejects forged validation results and runtime-created canonical-looking references
4. does not expose caller-mintable validation authority through the domain boundary
5. domain construction rejects alternate schemas and runtime constructor bypasses
6. returns immutable structured values and guards the complete productive import graph
7. generic delegation consumer never promotes text-only output to canonical completion or effects
```

The productive import graph guard passes from
`src/composition/exec-contract.ts` through the six expected `src` files and
rejects forbidden prototype, `.pi`, transport, filesystem and generic external
paths. The canonical adapter's stale/current-content checks also pass the direct
mutation matrix (`tests/exec-001-ticket-001.test.ts:460-551`).

Required architecture guard evidence is incomplete in one specific respect:
there is no direct negative guard that rejects a caller-created
`AuthenticatedExecSchemaValidationPort` subtype as an unauthorized issuer or
independently verifies that every alternate adapter evaluated the selected
canonical schema. The positive alternate-adapter test intentionally accepts an
always-true implementation on valid input, and the negative test only reaches
value-level duplicate checks for a known local `result` invariant. This is a
missing guard, not a test-suite execution failure.

```text
ARCHITECTURE_GUARD_TESTS_RUN = 7
MISSING_ARCHITECTURE_GUARDS = 1
ARCHITECTURE_GUARD_EVIDENCE = canonical graph/forgery/stale/no-text guards PASS; alternate issuer authorization/conformance guard MISSING
```

## 8. Systemic boundary expansion campaign

```text
ROOT_CAUSE_CAMPAIGN_ID = RCC-ARCH-EXEC-001-T001-SCHEMA-PRODUCER
ROOT_CAUSE_ID = CALLER_MINTABLE_SCHEMA_VALIDATION_PROOF
CAMPAIGN_STATUS = OPEN
CAMPAIGN_SCOPE = EXEC-001-TICKET-001 schema-definition, validation-evidence and structured-value boundary
CANONICAL_FINDINGS = ARCH-CRITICAL-001
CAMPAIGN_MATRIX_COMPLETE = YES
ALL_SURFACE_ROWS_COVERED = NO; all rows were inspected, but issuer/substitution/guard rows remain defective
ALL_NEGATIVE_WITNESSES_PASS = NO
NO_UNEXPLAINED_PUBLIC_AUTHORITY_PATH = NO
NO_HIDDEN_CONCRETE_PROTOCOL = YES
ROOT_CAUSE_REMOVED = NO
KNOWN_MANIFESTATIONS_CLOSED = NO
SYSTEMIC_TEST_EVIDENCE = PRESENT
```

| Surface row | Surface class | Location / owner | Normative obligation | Current behavior | Expected behavior | Related finding/AC | Coverage status | Negative witness IDs |
|---|---|---|---|---|---|---|---|---|
| RCC-SVP-001 | ISSUER | `src/domain/exec-validation-evidence-internal.ts:18-39`; EXEC-001 | Only an authorized producer may issue consumable schema proof | Every subclass instance is branded and may issue a `valid: true` receipt | Issuer authorization and selected-schema semantic conformance must be independently established | ARCH-CRITICAL-001; AC-EXEC-001 | MISSING | NW-ARCH-003, NW-ARCH-007 |
| RCC-SVP-002 | REGISTRAR | `src/domain/exec-schema.ts:158-183`; EXEC-001 | Local schema definitions are identifiable, immutable and selected without caller document injection | Static frozen envelope/payload set and exact selection are present | Keep definition authority owner-controlled; no caller extension | AC-EXEC-001 | COVERED | NW-ARCH-002, NW-ARCH-005 |
| RCC-SVP-003 | CONSUMER | `src/application/exec-contract.ts:80-145`; EXEC-001 | Consumer must verify provenance and consume only validated selected-schema results | Consumer verifies WeakSet issuer/result identity, shape, input and fingerprint, but not issuer authorization or schema evaluation | Verify owner-authorized producer and alternate-adapter semantic contract before value construction | ARCH-CRITICAL-001; AC-EXEC-001 | MISSING | NW-ARCH-003, NW-ARCH-007 |
| RCC-SVP-004 | ALTERNATE_AUTHORITY_PATH | Caller-created subclass of `AuthenticatedExecSchemaValidationPort`; caller | Alternate adapters, if allowed, must satisfy the same authority proof and cannot become a second owner | Caller subclass can call protected issuance and return success without schema evaluation | Alternate adapters must be owner-authorized and independently verified, or must not issue consumable proof | ARCH-CRITICAL-001 | MISSING | NW-ARCH-003 |
| RCC-SVP-005 | INJECTION_POINT | `ValidateExecContract` constructor at `src/application/exec-contract.ts:84-86`; application boundary | Dependency injection cannot replace canonical authority with caller truth | Any caller-supplied port is stored; brand check occurs only at validation time | Injection must be constrained to an authorized proof-bearing producer boundary | ARCH-CRITICAL-001 | MISSING | NW-ARCH-001, NW-ARCH-003 |
| RCC-SVP-006 | MUTATION_PATH | `src/infrastructure/exec-schema-validator.ts:46-92`; infrastructure/EXEC contract | Validation evidence must bind current input and selected schema | Canonical adapter records input, rechecks current schema and fingerprints content | Preserve current-content and own-field revalidation | AC-EXEC-001/002 | COVERED | NW-ARCH-004 |
| RCC-SVP-007 | STALE_PATH | `tests/exec-001-ticket-001.test.ts:460-551`; EXEC-001 | Stale or mutated receipt/input cannot become a validated value | Genuine stale receipt and changed own fields fail closed; alternate producer semantics are not independently proven | Every consumable producer must satisfy the same stale/current-input proof | ARCH-CRITICAL-001 | MISSING for alternate adapters; COVERED for canonical adapter | NW-ARCH-004, NW-ARCH-007 |
| RCC-SVP-008 | PORT_SUBSTITUTION_PATH | `ExecSchemaValidationPort` and exported authenticated base in `src/domain/exec-schema.ts:17-20`; EXEC-001 | Port substitution must preserve issuer, scope, stale and forgery guarantees | Independent adapter substitution is explicitly accepted based on subclass brand alone | Alternate implementation must have verifiable owner/proof contract, not merely subclass membership | ARCH-CRITICAL-001 | MISSING | NW-ARCH-003, NW-ARCH-007 |
| RCC-SVP-009 | PUBLIC_EXPORT | `src/domain/exec-schema.ts:17-20`; `src/domain/exec-validation-evidence-internal.ts:18-39` | Public exports cannot expose a caller-mintable authority route | Authenticated producer base and issuance method are reachable to public subclasses | Close issuance or expose only a factory/owner-issued capability with semantic verification | ARCH-CRITICAL-001 | MISSING | NW-ARCH-003 |
| RCC-SVP-010 | PERSISTENCE | None in this ticket; EXEC-001/PLAT boundary | No persistence adapter may become schema authority | No persistence path exists | Preserve out-of-scope status | None | NOT_APPLICABLE — no durable material | None |
| RCC-SVP-011 | RETRY_RECOVERY | None in this ticket; EXEC-001/PLAT/EXEC-002 boundary | Retry/recovery cannot mint or reinterpret contract proof | No retry or recovery path exists | Later owners must consume only preserved proof/basis | None | NOT_APPLICABLE — no retry/recovery operation | None |
| RCC-SVP-012 | LEGACY_ROUTE | `src/domain/exec-schema.ts:140-183`; EXEC-001 | Generic payload acceptance cannot remain an alternate authority | Old generic schema ID is not selected; no conversion fallback | Retain fail-closed old-schema rejection | AC-EXEC-001 | COVERED | NW-ARCH-005 |
| RCC-SVP-013 | ARCHITECTURE_GUARD | `tests/exec-001-ticket-001.test.ts:826-877` and provenance tests | Executable guard must reject forbidden issuer/substitution paths | Import graph, plain forgery, custom definition, copied adapter and stale guards pass; alternate issuer guard absent | Add direct negative witness for caller-created authenticated issuer and alternate adapter semantic conformance | ARCH-CRITICAL-001 | MISSING | NW-ARCH-007 |
| RCC-SVP-014 | TEST | `tests/exec-001-ticket-001.test.ts:263-334,430-457`; EXEC-001 | Positive and negative witnesses must cover issuer and caller injection | Positive independent adapter can return success without schema evaluation; value-level checks cover only fixed local invariants | Test the forbidden dependency/issuer condition directly and fail closed at the producer/consumer boundary | ARCH-CRITICAL-001; AC-EXEC-001 | MISSING | NW-ARCH-003, NW-ARCH-007 |

Negative witness index:

```text
NW-ARCH-001 = plain unbranded caller port is rejected by ValidateExecContract
NW-ARCH-002 = copied/custom schema definition cannot establish canonical adapter authority
NW-ARCH-003 = caller-created authenticated adapter issues valid=true for unknown capability input
NW-ARCH-004 = canonical stale receipt/current-content mutation is rejected
NW-ARCH-005 = productive import graph rejects prototype/.pi/transport and unexpected dependencies
NW-ARCH-006 = text-only generic consumer output cannot become canonical completion/effect
NW-ARCH-007 = required unauthorized-alternate-issuer negative witness is absent; the existing positive subtype test is not a negative witness
```

## 9. Findings

### ARCH-CRITICAL-001 — Caller-mintable authenticated schema producer creates an alternate authority path

- **Severity:** CRITICAL
- **Ticket:** EXEC-001-TICKET-001
- **Normative authority:** `docs/adrs/ADR-0003-versioned-skill-contracts.md` Decision; `docs/specs/SPEC-EXEC-001-skill-contracts-and-capability-registry.md` §9 O-016, §13 `EXEC-ENVELOPE-001`, §13 `EXEC-ENVELOPE-002`, §13 `EXEC-CONTRACT-001`, §14 result boundary, and §21 C-EXEC-001/C-EXEC-008; `skills/_shared/authority-provenance-anti-forgery-contract.md` required issuer authorization, consumer provenance verification and alternate-adapter contract.
- **Owner:** `SPEC-EXEC-001 / EXEC-001` schema authority and its validation boundary.
- **Affected boundary:** `AuthenticatedExecSchemaValidationPort` issuer → `ValidateExecContract` injected consumer → `StructuredExecutionEnvelope`/`StructuredCapabilityPayload` → downstream contract consumers.
- **Repository evidence:**
  - `src/domain/exec-validation-evidence-internal.ts:18-39` publicly exports a subclassable producer base. Its protected constructor adds every subclass to `AUTHENTICATED_PORTS`, and protected `issueValidatedResult` adds any caller-provided result to that producer's issued-result WeakSet.
  - `src/domain/exec-schema.ts:17-20` re-exports the base and identity checks. `src/application/exec-contract.ts:80-118` accepts an injected port and invokes it for the canonical definitions; `:128-142` constructs a valid contract after only result identity/shape/input/fingerprint checks.
  - `tests/exec-001-ticket-001.test.ts:263-281` demonstrates that a caller-created independent adapter that never evaluates JSON Schema is accepted as a producer and yields `VALID` for a valid input. `:318-324` demonstrates that the same producer can issue `valid: true` for an unknown capability input; `:325-332` rejects that one value only because a separate hard-coded value check catches it.
  - The canonical adapter does perform JSON Schema checking at `src/infrastructure/exec-schema-validator.ts:58-98`, but the composition root does not prevent the public alternate producer path from being injected into `ValidateExecContract`.
- **Problem:** Producer-instance membership and issued-result identity are treated as sufficient authority proof. They establish only that a caller subclass invoked a protected helper; they do not establish that the authorized EXEC schema owner evaluated the selected canonical definition or that the alternate adapter satisfies the same semantic/stale/forgery contract. The explicit alternate-adapter positive test accepts an always-true implementation, and the missing negative guard leaves a second schema-proof authority path.
- **Impact:** A caller-controlled adapter can present schema-validation evidence to the consumer without owner authorization or independently verified schema semantics. The current fixed capability value checks reject several known malformed payloads, but they are a duplicate local defense and do not close the issuer/provenance boundary for all schema constraints or future capability definitions. Downstream consumers can therefore receive a result whose claimed validation provenance is not canonical, violating the authority contract and creating a route for schema-invalid data to be treated as consumable when the schema and value rules diverge.
- **Minimum correction required:** Preserve the canonical EXEC owner as the sole source of consumable schema proof, or constrain alternate adapters behind an owner-issued/independently verified producer capability whose contract directly proves selected-schema evaluation, exact scope, stale behavior and caller-injection rejection. Add an executable negative witness that exercises a caller-created always-true subtype and rejects its authority at the producer/consumer boundary; do not rely only on duplicated value checks. Do not promote a fixture or unverified alternate adapter to productive authority.
- **Systemic pattern = YES**
- **Related locations:** `src/domain/exec-validation-evidence-internal.ts:14-39`; `src/domain/exec-schema.ts:11-20,41-49`; `src/application/exec-contract.ts:80-145`; `src/domain/exec-contract.ts:392-416,482-564`; `src/infrastructure/exec-schema-validator.ts:38-98`; `src/composition/exec-contract.ts:1-10`; `tests/exec-001-ticket-001.test.ts:239-334,430-457,460-551`.

## 10. Audit conclusion and summary

The canonical productive composition path preserves EXEC ownership, schema
identity, immutability, structured minimum fields, generic-payload cutover and
no-effect failure semantics. No foreign lifecycle, DOM identity, persistence,
registry publication, migration or security authorization owner was absorbed.
The audit is complete within scope, but the public authenticated producer seam
is a fundamental authority/provenance defect. The one critical finding remains
open; no ticket approval, remediation, state transition or implementation
change is made by this artifact.

Audit: .pi/runtime/workflow-audits/ffb910a8-45ef-4e4c-a1c9-7f000239e153/architecture-EXEC-001-TICKET-001-architecture-audit.md

Specialist:
ARCHITECTURE_BOUNDARIES

Ticket: EXEC-001-TICKET-001

Ownership errors: 0

Foreign capability duplication: 0

Authority violations: 1

Identity violations: 0

Immutability/lineage violations: 0

Legacy authority violations: 0

Architectural authority gaps: 0
Authority consumption gaps: 1
Producer/consumer contract errors: 1
Temporal authority gaps: 0
Caller-supplied authority bypasses: 1
Missing architecture guards: 1
Architecture guard tests run: 7

Findings:
CRITICAL=1
MAJOR=0
MINOR=0
INFO=0

Domain audit complete:
YES

Specialist result:
SPECIALIST_ARCHITECTURE_FINDINGS

AUDIT_TARGET_HEAD: 38a81fc832b55360fd0cde1a584076cb28a5482f
AUDIT_TARGET_STATE_FINGERPRINT: a85d61bc8ef7d9f1352b111ac3d28e7f71ce4a90a3b05f540b410b5e29203073
AUDIT_WAVE_ID: ffb910a8-45ef-4e4c-a1c9-7f000239e153
DOMAIN_AUDIT_COMPLETE: YES
SPECIALIST_RESULT: SPECIALIST_ARCHITECTURE_FINDINGS