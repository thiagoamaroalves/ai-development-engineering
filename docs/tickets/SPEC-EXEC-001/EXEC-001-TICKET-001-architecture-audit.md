# Architecture Boundaries Audit — EXEC-001-TICKET-001

## 1. Audit identity and pinned subject

```text
TICKET_ID = EXEC-001-TICKET-001
IMPLEMENTATION_UNIT = EXEC-IMP-01 — Capability-specific envelope and payload schemas
TICKET_STATUS = VALIDATION_REQUIRED
TICKET_PATH = docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-001-capability-specific-envelope-and-payload-schemas.md
IMPLEMENTATION_DESIGN_PATH = docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-001-implementation-design.md
TICKET_SET_AUDIT_PATH = docs/tickets/SPEC-EXEC-001/implementation-ticket-audit.md
SPEC_PATH = docs/specs/SPEC-EXEC-001-skill-contracts-and-capability-registry.md
IMPLEMENTATION_PLAN_PATH = docs/specs/implementation-plans/SPEC-EXEC-001-implementation-plan.md
IMPLEMENTATION_BASELINE = 8cf79cd37ebb02d0657c1fb191cea1d194b71f89
CURRENT_HEAD = 1f27b0fe187325398524e351f56cacfc61eea1e4
AUDIT_TARGET_HEAD = 1f27b0fe187325398524e351f56cacfc61eea1e4
AUDIT_TARGET_STATE_FINGERPRINT = c21d52859837764cd3bd22cc3c2cef5df7f8aeeba733724040eaec4d10cd2f3e
AUDIT_WAVE_ID = 047b2eae-25bd-4a37-8955-bfd39bfa26b0
SPECIALIST_ATTEMPT = 2/3
AUDIT_MODE = READ_ONLY INDEPENDENT ADVERSARIAL ARCHITECTURE_FIRST OWNERSHIP_PRESERVING AUTHORITY_PRESERVING CROSS_SPEC_AWARE IDENTITY_AWARE LEGACY_TRANSITION_AWARE
```

The pinned target tree was audited. The working tree had unrelated overlay
changes at intake; those overlays were not used as implementation evidence.
The target commit is a later governance checkpoint after the implementation
baseline, and its production subject is unchanged by that checkpoint.

### Actual implementation delta from the stated baseline

The ticket's execution record omits one changed production boundary. The
baseline-to-target tree contains these files:

```text
src/application/exec-contract.ts
src/domain/exec-contract.ts
src/domain/exec-schema.ts
src/infrastructure/exec-schema-validator.ts
tests/exec-001-ticket-001.test.ts
docs/tickets/SPEC-EXEC-001/evidence/TICKET-001/AC-EXEC-001-envelope-schema.md
docs/tickets/SPEC-EXEC-001/evidence/TICKET-001/AC-EXEC-001-structured-consumption.md
docs/tickets/SPEC-EXEC-001/evidence/TICKET-001/AC-EXEC-002-fail-closed.md
docs/tickets/SPEC-EXEC-001/evidence/TICKET-001/AC-EXEC-002-required-fields.md
```

`src/composition/exec-contract.ts` is unchanged from the implementation
baseline but is an affected productive boundary because it wires the adapter.
The infrastructure adapter change is material to the authority/provenance
audit even though it is absent from ticket §27 `CHANGED_FILES`.

## 2. Authority precedence and reconstructed contract

Authority was read and applied in this order:

```text
Accepted ADR authority
→ approved portfolio ownership
→ SPEC-EXEC-001 revision 5
→ explicit SPEC-DOM-001 cross-SPEC contracts
→ validated Gap Matrix GAP-018
→ conformant Implementation Plan EXEC-IMP-01
→ ticket and approved implementation design
→ repository implementation and tests
```

| Concern | Canonical authority and anchor | Reconstructed rule |
|---|---|---|
| Envelope/payload ownership | `docs/adrs/ADR-0003-versioned-skill-contracts.md`, `Decisão`; Portfolio `O-016`; `SPEC-EXEC-001` §§2, 9, 13 | `SPEC-EXEC-001/EXEC-001` owns identifiable envelope/payload schemas, schema selection, validation result and structured minimum fields. |
| Contract validity | `SPEC-EXEC-001` §13 `EXEC-ENVELOPE-001/002`; §15 `EXEC-CONTRACT-001`; Portfolio contract/verdict failure row | Schema-invalid or structurally incomplete input fails closed; human text has no operational authority. |
| Identity | `SPEC-EXEC-001` §12 and `SPEC-DOM-001` `DOM-ID-001`/`DOM-SNAPSHOT-001` | Schema identity is EXEC-owned. Execution/activity/attempt and related DOM IDs are opaque references here; this ticket may not create or reinterpret DOM identity. |
| Foreign ownership | `SPEC-EXEC-001` §§2, 10, 18–19; Portfolio O-001/O-018/O-020/O-021 | DOM owns canonical lifecycle/identity/snapshot; REPO owns source/config migration; PLAT owns physical persistence/recovery; downstream consumers map or project. |
| Capability registry boundary | `SPEC-EXEC-001` §§6, 8, 11, 17; ticket/design exclusions | Dynamic registry resolution/publication, normal/bootstrap source authority and catalog persistence are outside this ticket. The local immutable schema set is the only ticket-owned selection authority. |
| Immutability and history | `ADR-0001`, `ADR-0003`, `ADR-0006`; `SPEC-EXEC-001` §§12, 16–18 | Definitions, validation evidence and returned contract values must not be mutable or silently replaced. No persisted history is introduced here. |
| Cross-SPEC edge | `SPEC-EXEC-001` §10 and §25; Portfolio normative edge `SPEC-EXEC-001 → SPEC-DOM-001` | This ticket does not consume a foreign producer for local closure. DOM references remain opaque and cannot authorize a DOM transition. |
| Cutover | `SPEC-EXEC-001` §17 `NEW_CANONICAL_PATH`; ticket §§6, 21; design §§15, 18 | The old generic payload acceptance route is retired locally; no silent conversion or second schema authority is allowed. |
| Non-goals | `SPEC-EXEC-001` §§7, 18–19; ticket §10; design §§5, 14–18 | No DOM lifecycle, registry publication, persistence/recovery, transport, runtime effect, UI/OPS mapping or authorization is implemented. |

The accepted contract does not leave an architectural decision open for the
local schema semantics. It does, however, require the validation evidence
boundary to be owner-verifiable and requires any claimed alternate adapter to
satisfy the same provenance contract. The implementation design §7 records an
independent alternate-adapter contract test and states that only the owner
boundary may issue consumable evidence.

## 3. Applicability matrix

| Dimension | Classification | Evidence and reason |
|---|---|---|
| OWNERSHIP | REQUIRED | Production code changes the EXEC-owned schema definition and validation boundary. |
| CANONICAL_AUTHORITY | REQUIRED | The selected schema and successful validation evidence are authority-bearing inputs to structured values. |
| CROSS_SPEC_INTEGRATION | AFFECTED | The resulting contract is consumed downstream and the approved DOM edge remains context, but no foreign producer is required for this ticket's local criteria. |
| IDENTITY | REQUIRED | Schema ID/version and capability association select the canonical definition; DOM IDs cross the envelope as opaque data. |
| IMMUTABILITY | REQUIRED | Schema documents/definitions, validation receipts and returned contract values must preserve stable evidence. |
| LINEAGE | NOT_APPLICABLE | No aggregate, persisted revision, predecessor/successor record, historical replay record or lineage relation is created. Content fingerprints are stale-input protection, not domain lineage. |
| LEGACY_TRANSITION | AFFECTED | The former generic payload schema path is rejected and replaced by the capability-specific path. |
| DESTRUCTIVE_TRANSITION | AFFECTED | Previously accepted generic payloads are no longer accepted, although no durable data is deleted or migrated. |
| MIGRATION_AUTHORITY | NOT_APPLICABLE | No legacy records, catalog revisions, manifest, storage or migration operation is in scope. |
| SECURITY_AUTHORIZATION | NOT_APPLICABLE | Validation returns contract validity only; no authorization, approval, effect execution or protected route is implemented. `noApproval`, `noCheckpoint` and `noEffect` are failure semantics, not an authorization system. |

## 4. Evidence executed and inspected

The target source and tests were inspected independently. The target-specific
suite was executed through the installed TypeScript loader because the target
package command's Node native TypeScript mode is unavailable in this Node
runtime:

```text
COMMAND = node --import tsx --test tests/exec-001-ticket-001.test.ts
RESULT = 25 passed, 0 failed
```

The suite includes the direct import-graph guard (`returns immutable structured
values and guards the complete productive import graph`) and the normal
composition-path forged-result, caller-injection, stale-input and custom-schema
negative tests. Those tests import `JsonSchemaExecValidator` at module load.
That import-order fact is material to `ARCH-CRITICAL-001` below.

A separate read-only witness was executed against the application/domain path
without importing the infrastructure adapter first. It supplied a frozen
five-field result whose prototype verifier was caller-defined and returned
true. The result was:

```text
APP_ONLY_CALLER_RESULT = VALID
```

The same process then dynamically imported the infrastructure adapter and
observed:

```text
INFRASTRUCTURE_IMPORT = throws "Canonical validation result identity could not be initialized."
```

This is direct evidence that the first result can establish the verifier trust
anchor before the canonical adapter bootstrap.

## 5. Ownership and canonical-authority audit

### Local owner and paths

`ExecContractSchemaDefinitions` in `src/domain/exec-schema.ts` owns the frozen
envelope and capability-specific definition set. The target has one known
capability (`capability-001`) with an identifiable schema reference
`exec-capability-001-payload@1.0.0`; `selectPayload` accepts only the exact
capability/schema/version tuple. `ValidateExecContract` owns orchestration and
complete-pair exposure. `JsonSchemaExecValidator` performs schema-engine
mechanics and emits validation receipts.

The domain value constructors require canonical schema references, exact input
identity and matching content fingerprints. The productive composition root
wires only the application operation and the infrastructure adapter. No code in
the target imports prototype, `.pi`, transport, persistence, DOM, registry
publication or external-effect surfaces.

```text
OWNERSHIP_CLASSIFICATION = OWNERSHIP_PRESERVED
FOREIGN_CAPABILITY_DUPLICATED = 0
FOREIGN_LIFECYCLE_CREATED = 0
AUTHORITY_RECOMPUTED_LOCALLY = 0
REPOSITORY_SEMANTIC_AUTHORITY = 0
```

### Canonical authority paths

The ordinary path preserves the intended owner:

```text
immutable ExecContractSchemaDefinitions
  → exact tuple selection
  → JsonSchemaExecValidator over a canonical definition
  → owner/result verification
  → StructuredExecutionEnvelope + StructuredCapabilityPayload
  → ValidatedExecContract
```

The ordinary path has no competing canonical writer. However, the verifier
trust anchor is not fixed to the owner before an application-only consumer can
run:

```text
caller-supplied ExecSchemaValidationPort
  → caller-supplied result.canonicalResultType
  → first-call canonicalResultType assignment
  → producer verifier returns true
  → VALIDATED contract
```

That path is an alternate authority path and is a critical caller-supplied
authority bypass. It is not a foreign lifecycle implementation, so ownership
remains preserved while canonical authority is violated.

```text
CANONICAL_AUTHORITY_CLASSIFICATION = ALTERNATE_AUTHORITY_INTRODUCED
AUTHORITY_PRESERVED_FOR_ORDINARY_COMPOSITION = YES
CALLER_SUPPLIED_AUTHORITY_BYPASS = 1
```

## 6. Cross-SPEC, authority-consumption and producer/consumer audit

### Cross-SPEC result

`SPEC-DOM-001` is the only approved normative upstream dependency, but this unit
does not resolve it. `executionId`, `activityId`, `agentAssignmentId`,
`artifactCycleId` and `attemptId` are validated as opaque structured fields;
there is no local DOM lookup, lifecycle decision, snapshot mutation or verdict
advancement. Downstream mappings remain consumers.

```text
CROSS_SPEC_CLASSIFICATION = CROSS_SPEC_CONFORMANT_FOR_TICKET_SCOPE
FOREIGN_CAPABILITIES_REQUIRED_FOR_LOCAL_CLOSURE = 0
FOREIGN_OWNER_CHANGED = 0
FOREIGN_BEHAVIOR_DUPLICATED = 0
OWNER_OUTCOME_RECOMPUTED = 0
INTEGRATION_NOT_PROVEN = 0 for foreign capabilities; see local port defect below
```

### Local capability record

The Plan §9 `EXEC-IMP-01` record, design §7 and ticket §6/§14a–§14b do not
reconcile their independent availability dimensions. The Plan/design record
says the local harness is `PRODUCTIVE_AVAILABILITY = NO`,
`CAPABILITY_SUMMARY_STATUS = CONTRACT_TESTABLE_LOCALLY`, `DEPENDENCY_CLASS =
INFORMATIONAL`, and explicitly says there is no promotion. Ticket §14a instead
says `AUTHORITY_CONSUMPTION_PROOF = AUTHORITY_CONSUMABLE` and
`PRODUCTIVE_AVAILABILITY = YES for unit-owned local execution`; ticket §14b's
external capability table is empty.

The audit preserves the lower, explicit evidence record rather than silently
promoting it. The target implementation proves a local production code path,
but no complete productive-availability promotion record is present in the
handoff. Under the shared authority-completeness contract, the recorded proof
therefore cannot be `AUTHORITY_CONSUMABLE`.

```text
CAPABILITY_ID = EXEC-SCHEMA-CAPABILITY-PAYLOAD
AUTHORITY_EXISTENCE = SPEC-EXEC-001 rev5 EXEC-ENVELOPE-001/002; O-016
TRUTH_OWNER = SPEC-EXEC-001 / EXEC-001
AUTHORITY_SEMANTIC_SOURCE = identifiable envelope and capability-payload schema contract
OWNER_DOMAIN_OR_BOUNDED_CONTEXT = EXEC-001
CONSUMPTION_CONTRACT = ValidateExecContract consumes the immutable ticket-owned definition set
PORT_INTERFACE_QUERY_RESOLVER_OR_READER = ExecSchemaDefinition selection plus ExecSchemaValidationPort
CONTRACT_PRODUCER = ticket-owned EXEC schema authority/definition set
CONTRACT_CONSUMER = ValidateExecContract and structured domain values
RETURNED_DATA = selected schema reference, capability association, validation result, input identity and content fingerprint
VERSION_REVISION_TRANSPORT = SchemaReference schema ID and semantic version; no registry/catalog revision in this ticket
FAILURE_NOT_FOUND_STALE_SEMANTICS = selection failure, invalid payload, malformed evidence or stale input → CONTRACT_INVALID
AUTHORITY_STATUS = DEFINED
CONTRACT_STATUS = DEFINED
SEMANTIC_STATUS = DEFINED
LOCAL_TESTABILITY = YES
PRODUCTIVE_AVAILABILITY = NO in the accepted harness handoff; no promotion record
CAPABILITY_SUMMARY_STATUS = CONTRACT_TESTABLE_LOCALLY
DEPENDENCY_CLASS = INFORMATIONAL
AVAILABILITY_EVIDENCE = direct C-EXEC-001/C-EXEC-002 operations and target-specific suite
AVAILABILITY_CONDITION = local contract execution
BLOCKING_EFFECT = NONE
PROOF_RESULT = AUTHORITY_CONSUMPTION_GAP in ticket/design handoff classification
```

### Producer/consumer contract result

The local definition set and application consumer exist, but the validation
port's claimed substitutability is not a consumable producer/consumer contract:
`ExecSchemaValidationPort` exposes only `validate`; the successful result class,
brand, authorization token and transport authorizer are private to
`JsonSchemaExecValidator`. The only accepted alternate-shaped port,
`createReceiptReplayPort`, transports receipts already issued by that same
concrete adapter and does not independently validate schemas. A plain wrapper
and a caller-created subtype are rejected. No independent adapter can issue a
consumable result through the published port.

```text
PRODUCER_CONSUMER_CONTRACT_STATUS = PARTIAL
ALTERNATE_ADAPTER_CONTRACT = FAIL / NOT_PROVEN
LOCAL_CONTRACT_SEMANTICS = TESTABLE
PRODUCTIVE_FOREIGN_PRODUCER = NOT_REQUIRED
PRODUCER_CONSUMER_CONTRACT_ERRORS = 2
```

One error is the hidden concrete protocol/failed alternate-adapter contract
(`ARCH-MAJOR-001`); the other is the inconsistent availability/consumability
handoff (`ARCH-MAJOR-002`). Neither is a foreign lifecycle ownership transfer.

## 7. Identity, immutability and lineage audit

### Identity

The target preserves the canonical schema reference singletons and ties
`capability-001` to `exec-capability-001-payload@1.0.0`. Selection compares exact
untrusted input fields to the immutable definition set; it does not infer
identity from human text, display names or mutable data. The structured values
retain the canonical reference and preserve opaque execution-related strings
without normalization. Direct positive/negative identity tests passed.

```text
IDENTITY_CLASSIFICATION = CONFORMANT_FOR_SCHEMA_AND_OPAQUE_CONTRACT_FIELDS
IDENTITY_VIOLATIONS = 0
AGGREGATE_IDENTITY_PROOF = NOT_APPLICABLE — no aggregate is introduced
```

### Immutability

Schema documents are recursively frozen; definition objects, the definition
array, successful receipts, failures and returned values are frozen. Structured
values clone and freeze JSON data, and stale receipt checks compare exact input
identity and content fingerprints. Direct immutability and stale mutation
witnesses passed in the target-specific run.

```text
IMMUTABILITY_CLASSIFICATION = CONFORMANT
IMMUTABILITY_VIOLATIONS = 0
```

### Lineage/reconstruction

No persistible aggregate/entity, revision succession, manifest, journal or
historical replay is created. Rehydration, predecessor/successor continuity
and reconstruction authority are not applicable. A validation receipt's input
fingerprint is evidence freshness, not domain lineage.

```text
LINEAGE_CLASSIFICATION = NOT_APPLICABLE
RECONSTRUCTION_CONTRACT = NOT_APPLICABLE
IMMUTABILITY_LINEAGE_VIOLATIONS = 0
```

## 8. Legacy, cutover and destructive-transition safety

The old generic payload identity (`exec-capability-payload`) is not accepted.
The target selects only the new identifiable capability path and rejects an
unknown capability, generic legacy schema identity or capability-invalid data.
No legacy writer, compatibility mapper or second schema source remains in the
productive import graph.

```text
LEGACY_CLASSIFICATION = TRANSITION_CONFORMANT
LEGACY_AUTHORITY_VIOLATIONS = 0
REPLACEMENT_PROVEN = YES — canonical capability-specific path and direct positive witness
CUTOVER_AUTHORIZED = YES — SPEC-EXEC-001 §17 and ticket/design NEW_CANONICAL_PATH
PRE_TRANSITION_GATES_SATISFIED = PARTIAL — generic-path witnesses pass, but provenance guard has an import-order gap
POST_TRANSITION_GUARDS_PRESENT = PARTIAL — generic rejection/import graph guards pass; import-order authority guard is absent
ROLLBACK_OR_ROLL_FORWARD_SEMANTICS_DEFINED = NOT_APPLICABLE — no durable state or data migration; invalid input fails closed and forward correction uses the canonical schema
DESTRUCTIVE_TRANSITION_RESULT = PARTIAL; covered by ARCH-CRITICAL-001, no separate legacy finding
```

There is no destructive storage deletion, migration, manifest rewrite or
physical cutover. Migration authority is not applicable.

## 9. Migration and authorization boundaries

```text
MIGRATION_AUTHORITY = NOT_APPLICABLE — no legacy material is read, transformed, persisted or promoted
MIGRATION_AUTHORITY_CLASSIFICATION = MIGRATION_AUTHORITY_PRESERVED_BY_NON_APPLICABILITY
SECURITY_AUTHORIZATION = NOT_APPLICABLE — no protected route, capability grant, approval transition or effect execution is present
AUTHORIZATION_CLASSIFICATION = CONFORMANT_BY_NON_APPLICABILITY
```

A valid contract result is not an approval or effect confirmation. The critical
finding below nevertheless matters because it lets a caller mint the
validation evidence that precedes any downstream interpretation.

## 10. Authority provenance and anti-forgery audit

The approved design's provenance record is only partially realized:

```text
PROOF_ISSUER_OWNER = SPEC-EXEC-001 / EXEC-001 schema contract boundary
PROOF_SCOPE = exact selected immutable definition and exact input
PROOF_IDENTITY_OR_BRAND = canonical definition membership plus producer-issued result
CONSUMER_VERIFICATION_RULE = exact producer/result, schema reference, input identity and current fingerprint before value construction
STALE_OR_MUTATION_POLICY = changed input/required field/fingerprint fails closed
FORGERY_NEGATIVE_TEST = present for normal composition/import order; target suite passed
CALLER_INJECTION_NEGATIVE_TEST = present for normal composition/import order; import-order path fails
ALTERNATE_ADAPTER_CONTRACT_TEST = replay transport only; independent adapter contract not proven
ISSUER_IS_AUTHORIZED = NO for application-only first-use path; YES after canonical bootstrap
PROOF_SCOPE_IS_EXACT = YES
CONSUMER_VERIFIES_PROVENANCE = PARTIAL
INPUT_OR_REFERENCE_BINDING = YES
MUTATION_OR_STALE_REJECTION = YES
FORGERY_PATH_REJECTED = PARTIAL
CALLER_INJECTION_REJECTED = NO
ALTERNATE_ADAPTER_CONTRACT = FAIL / NOT_PROVEN
```

`src/domain/exec-validation-evidence-internal.ts` initializes
`canonicalResultType` from the first result that advertises a constructor and
verifier. The infrastructure module later primes it with a genuine result,
but that is an import-time side effect rather than an invariant established at
the consumer boundary. `ValidateExecContract` accepts a caller-supplied port
before that side effect. This is the direct basis for
`ARCH-CRITICAL-001`.

## 11. Temporal authority and caller-as-authority checks

The ticket validates immutable local definitions and commits no effect, so a
second independent observation of mutable external authority is not applicable.
The replay port's fingerprint/current-input checks protect a receipt from input
mutation, but they are not temporal revalidation of a foreign mutable owner.

```text
TEMPORAL_AUTHORITY_PROOF = NOT_APPLICABLE
TEMPORAL_AUTHORITY_GAPS = 0
CALLER_AS_AUTHORITY_CHECK = FAIL for validation-evidence provenance; PASS for schema-definition selection
CALLER_SUPPLIED_AUTHORITY_BYPASS = 1
```

The caller's capability/schema fields can select only an exact member of the
owner's frozen set; they cannot provide a schema document. The caller's custom
validation port, however, can supply the first verifier type before the
canonical adapter is imported and thereby replace the proof issuer.

## 12. Architectural scope classification

| Decision/path | Classification | Reason |
|---|---|---|
| Frozen identifiable definition set, exact capability/schema tuple selection, no generic fallback | AUTHORIZED_ARCHITECTURAL_REALIZATION | Directly realizes O-016/EXEC-ENVELOPE-001/002 within the ticket's bounded local scope. |
| Domain structured values require canonical refs, exact input and fingerprints | AUTHORIZED_ARCHITECTURAL_REALIZATION | Preserves identity, immutability and provenance obligations. |
| Production import graph excludes prototype/`.pi`/transport/persistence/effects | AUTHORIZED_ARCHITECTURAL_REALIZATION | Required boundary guard passed. |
| First-observed caller-supplied verifier type | UNAUTHORIZED_ARCHITECTURAL_EXPANSION | Introduces an alternate authority route not authorized by the owner-proof contract. |
| Public `ExecSchemaValidationPort` with a private concrete receipt protocol and replay-only substitute | UNAUTHORIZED_ARCHITECTURAL_EXPANSION | The design names an adapter port and independent contract, but the implementation freezes the protocol to one concrete adapter. |
| Registry resolution, DOM lifecycle, persistence, migration, authorization | NOT_INTRODUCED | Explicitly excluded and absent from the target paths. |

```text
ARCHITECTURAL_AUTHORITY_GAP_DISCOVERED = NO
UNAUTHORIZED_ARCHITECTURAL_EXPANSIONS = 2 related manifestations
ARCHITECTURE_DECISION_REQUIRED = NO
```

The defects are implementation/provenance and handoff conformance defects, not
missing normative decisions that this audit may invent.

## 13. Systemic boundary expansion campaigns

### Campaign A — validation evidence provenance

```text
ROOT_CAUSE_CAMPAIGN_ID = RCC-EXEC-SCHEMA-PROVENANCE-001
ROOT_CAUSE_ID = validation-evidence-owner-boundary-not-fixed-before-consumption
CAMPAIGN_STATUS = EXPANDED
CAMPAIGN_SCOPE = EXEC-001-TICKET-001 validation schema/receipt boundary
CANONICAL_FINDINGS = ARCH-CRITICAL-001, ARCH-MAJOR-001
```

| Surface row | Class | Location | Owner | Normative obligation | Current behavior | Expected behavior | Related finding/AC | Coverage | Negative witness |
|---|---|---|---|---|---|---|---|---|---|
| RCC-SCHEMA-ISSUER-001 | ISSUER | `src/infrastructure/exec-schema-validator.ts:136-232` | EXEC adapter under EXEC-001 authority | Issue only owner-verifiable evidence | Concrete adapter issues private branded receipts; verifier can be seeded by caller before bootstrap | Issuer identity must be fixed independently of caller/import order | ARCH-CRITICAL-001; AC-EXEC-001 | COVERED with defect | W-AUTH-ORDER-001 |
| RCC-SCHEMA-REGISTRAR-001 | REGISTRAR | `src/domain/exec-schema.ts:156-182` | EXEC-001 | Only immutable owner definitions select schemas | Frozen one-capability definition set; no mutable registration | Definition membership and identity remain owner-bound | AC-EXEC-001 | COVERED | W-CAP-001 |
| RCC-SCHEMA-CONSUMER-001 | CONSUMER | `src/application/exec-contract.ts:79-138`, domain value factories | EXEC-001 | Verify provenance before constructing validated values | Consumer invokes caller-provided port and first-use verifier can accept caller type | Consumer must reject caller-minted evidence on every load/order path | ARCH-CRITICAL-001 | COVERED with defect | W-AUTH-ORDER-001 |
| RCC-SCHEMA-ALT-001 | ALTERNATE_AUTHORITY_PATH | `src/domain/exec-validation-evidence-internal.ts:5-37` | EXEC-001 | No caller-defined verifier may become proof issuer | `canonicalResultType` is assigned from first self-describing result | Fixed owner brand/capability must precede any consumer call | ARCH-CRITICAL-001 | MISSING | W-AUTH-ORDER-001 |
| RCC-SCHEMA-INJECT-001 | INJECTION_POINT | `ValidateExecContract` constructor `src/application/exec-contract.ts:83-85` | EXEC-001/composition | Injected adapter must preserve proof contract | Any `ExecSchemaValidationPort` is accepted; normal path relies on import side effect | Constructor/port boundary must require a stable owner-issued proof contract | ARCH-CRITICAL-001, ARCH-MAJOR-001 | PARTIAL | W-PORT-001 |
| RCC-SCHEMA-MUT-001 | MUTATION_PATH | `src/infrastructure/exec-schema-validator.ts:147-221` | EXEC adapter | Receipt binds input and schema and rechecks current content | Receipt/input identity and fingerprint checks reject direct mutation | Preserve exact binding and fail closed | AC-EXEC-001 | COVERED | W-STALE-001 |
| RCC-SCHEMA-STALE-001 | STALE_PATH | `createReceiptReplayPort` and domain fingerprint checks | EXEC-001 | Stale/mutated input cannot become validated value | Replay returns genuine receipts; consumer rejects changed input | Preserve stale rejection independent of adapter transport | AC-EXEC-001 | COVERED | W-STALE-001 |
| RCC-SCHEMA-PORT-001 | PORT_SUBSTITUTION_PATH | `src/domain/exec-schema.ts:43-45`; infra private result/token | EXEC-001 | Alternate adapter must satisfy the same proof contract | Only concrete adapter or its receipt replay transport can issue accepted success; independent adapter cannot implement the protocol | Either provide an owner-issued substitution contract or remove the false alternate port | ARCH-MAJOR-001; design §7 | MISSING | W-PORT-001 |
| RCC-SCHEMA-EXPORT-001 | PUBLIC_EXPORT | exported `ExecSchemaValidationPort`, `isProducerIssuedValidationResult` and reachable internal module | EXEC-001 | Public boundary must not expose a forgeable/ambiguous authority protocol | Structural port is public; verifier trust is import-order-dependent; no public owner issuance capability exists | Public API must expose a complete authority contract or a non-substitutable concrete boundary | ARCH-CRITICAL-001, ARCH-MAJOR-001 | MISSING | W-AUTH-ORDER-001 |
| RCC-SCHEMA-PERSIST-001 | PERSISTENCE | None in ticket | PLAT/EXEC-001 | No persistence ownership leakage | No persistence or history path | No path required | N/A | NOT_APPLICABLE — no durable material | N/A |
| RCC-SCHEMA-RETRY-001 | RETRY_RECOVERY | None in ticket | PLAT/EXEC-001 | No retry/effect authority in local validator | No external effect/retry path | No path required | N/A | NOT_APPLICABLE — validation is side-effect free | N/A |
| RCC-SCHEMA-LEGACY-001 | LEGACY_ROUTE | Generic schema input at `tests/exec-001-ticket-001.test.ts:99-132` | EXEC-001 | Legacy generic acceptance cannot regain authority | Old generic schema identity is rejected | New canonical path remains sole authority | AC-EXEC-001 | COVERED | W-CAP-001 |
| RCC-SCHEMA-GUARD-001 | ARCHITECTURE_GUARD | `tests/exec-001-ticket-001.test.ts:999-1050` and provenance tests | EXEC-001 | Execute import/authority boundary guards | Normal import-graph and post-bootstrap forgery guards pass; import-order guard absent | Guard must exercise application-only first use and alternate substitution | ARCH-CRITICAL-001/ARCH-MAJOR-001 | MISSING | W-AUTH-ORDER-001 |
| RCC-SCHEMA-TEST-001 | TEST | `tests/exec-001-ticket-001.test.ts:288-337,398-520,626-710` | EXEC-001 | Direct positive/negative provenance and stale witnesses | Replay, wrapper, subtype, forged result and stale tests run; no independent adapter/import-order positive/negative | Direct witnesses cover all issuer/substitution/order paths | ARCH-CRITICAL-001, ARCH-MAJOR-001 | PARTIAL | W-AUTH-ORDER-001; W-PORT-001 |

```text
CAMPAIGN_MATRIX_COMPLETE = YES
ALL_SURFACE_ROWS_COVERED = YES
ALL_NEGATIVE_WITNESSES_PASS = NO — W-AUTH-ORDER-001 exposes bypass
NO_UNEXPLAINED_PUBLIC_AUTHORITY_PATH = NO
NO_HIDDEN_CONCRETE_PROTOCOL = NO
ROOT_CAUSE_REMOVED = NO
KNOWN_MANIFESTATIONS_CLOSED = NO
SYSTEMIC_TEST_EVIDENCE = PRESENT but incomplete
```

### Campaign B — capability handoff availability dimensions

```text
ROOT_CAUSE_CAMPAIGN_ID = RCC-EXEC-CAPABILITY-HANDOFF-001
ROOT_CAUSE_ID = local-capability-consumability-and-availability-record-not-reconciled
CAMPAIGN_STATUS = OPEN
CAMPAIGN_SCOPE = EXEC-001-TICKET-001 authority/producer-consumer handoff
CANONICAL_FINDINGS = ARCH-MAJOR-002
```

| Surface row | Class | Location | Owner | Current behavior | Expected behavior | Coverage | Negative witness |
|---|---|---|---|---|---|---|---|
| RCC-HANDOFF-ISSUER-001 | ISSUER | Plan §9 EXEC-IMP-01; target `ExecContractSchemaDefinitions` | EXEC-001 | Plan/design record says local harness is not productive; target adds production code but no promotion record | Availability status must be evidence-backed and mechanically reconciled | MISSING | W-HANDOFF-001 |
| RCC-HANDOFF-REGISTRAR-001 | REGISTRAR | ticket §14a–§14b capability record | EXEC-001/ticket authority | §14a claims `AUTHORITY_CONSUMABLE`/productive YES while §14b is empty and §115 says fixture NO | One complete capability record must preserve all independent dimensions | MISSING | W-HANDOFF-001 |
| RCC-HANDOFF-CONSUMER-001 | CONSUMER | local closure/readiness fields §§1, 14a, 26 | ticket workflow | Local closure is declared with no blocking effect, but proof label can be read as consumable authority | Informational local evidence may not be promoted to consumable without promotion evidence | PARTIAL | W-HANDOFF-001 |
| RCC-HANDOFF-ALT-001 | ALTERNATE_AUTHORITY_PATH | Plan/design `RESULT=CONTRACT_TESTABLE_LOCALLY` versus ticket `AUTHORITY_CONSUMABLE` | Plan/ticket handoff | Two incompatible classifications describe the same capability | Preserve one authoritative status; no alternate handoff classification | MISSING | W-HANDOFF-001 |
| RCC-HANDOFF-INJECT-001 | INJECTION_POINT | Capability status handoff fields | workflow artifacts | No explicit promotion record is injected at implementation handoff | Promotion must include previous/new status, evidence owner and baseline | MISSING | W-HANDOFF-001 |
| RCC-HANDOFF-MUT-001 | MUTATION_PATH | None | N/A | No mutable catalog state in this ticket | Not applicable | NOT_APPLICABLE — no mutable capability registry | N/A |
| RCC-HANDOFF-STALE-001 | STALE_PATH | None | N/A | No foreign revision/status source is re-read | Not applicable | NOT_APPLICABLE — no external status source | N/A |
| RCC-HANDOFF-PORT-001 | PORT_SUBSTITUTION_PATH | Related schema port issue | EXEC-001 | Port defect is covered by Campaign A, not this handoff campaign | Keep independent authority-boundary correction linked, not merged | OUTSIDE_SCOPE — owner/route Campaign A | N/A |
| RCC-HANDOFF-EXPORT-001 | PUBLIC_EXPORT | None | N/A | No public capability-status API added | Not applicable | NOT_APPLICABLE — artifact handoff only | N/A |
| RCC-HANDOFF-GUARD-001 | ARCHITECTURE_GUARD | ticket/design availability records | workflow audit | No executable promotion/status guard is evidenced | Promotion record or explicit non-promotion guard required | MISSING | W-HANDOFF-001 |
| RCC-HANDOFF-TEST-001 | TEST | target suite and ticket evidence | EXEC-001 | Behavior tests prove local schema operation, not availability promotion | Separate local testability from productive availability | MISSING | W-HANDOFF-001 |

```text
CAMPAIGN_MATRIX_COMPLETE = YES
ALL_SURFACE_ROWS_COVERED = YES
ALL_NEGATIVE_WITNESSES_PASS = NO — W-HANDOFF-001 exposes contradiction
NO_UNEXPLAINED_PUBLIC_AUTHORITY_PATH = YES for this handoff campaign
NO_HIDDEN_CONCRETE_PROTOCOL = NOT_APPLICABLE
ROOT_CAUSE_REMOVED = NO
KNOWN_MANIFESTATIONS_CLOSED = NO
SYSTEMIC_TEST_EVIDENCE = ABSENT for promotion/status guard
```

## 14. Findings

### ARCH-CRITICAL-001 — Caller can establish validation authority before canonical bootstrap

- **Severity:** CRITICAL
- **Ticket:** `EXEC-001-TICKET-001`
- **Normative authority:** `ADR-0003` Decisão; `SPEC-EXEC-001` §§12, 13 `EXEC-ENVELOPE-001/002`, 19; implementation design §7 authority-provenance record; shared authority-provenance anti-forgery contract. Successful evidence must be issuer-bound and caller injection must be rejected.
- **Owner:** `SPEC-EXEC-001 / EXEC-001` canonical schema/validation boundary; remediation route is implementation boundary revalidation.
- **Affected boundary:** `src/domain/exec-validation-evidence-internal.ts` verifier trust root → `ValidateExecContract` injected `ExecSchemaValidationPort` → structured value construction; infrastructure bootstrap ordering.
- **Repository evidence:** `canonicalResultType` starts undefined and is assigned from the first result's self-described `canonicalResultType` (`src/domain/exec-validation-evidence-internal.ts:5, 23–30`). `ValidateExecContract` accepts any structural port (`src/application/exec-contract.ts:79–85`) and passes its returned result to that verifier (`:107–137`). The genuine bootstrap is only a module side effect in `src/infrastructure/exec-schema-validator.ts:237–267`. A standalone application-only witness supplied a frozen caller-owned verifier/result and returned `VALID`; dynamically importing the infrastructure afterward failed with `Canonical validation result identity could not be initialized.`
- **Problem:** The consumer's trust anchor is learned from caller-controlled result metadata when the canonical adapter has not yet initialized it. The normal test file masks this route by importing the infrastructure module at line 28 before the tests execute. This makes the claimed caller-injection rejection dependent on module import order.
- **Impact:** A caller-controlled adapter can mint consumable validation evidence and a `ValidatedExecContract` without running the canonical schema validator. A first caller can also poison the global verifier so that later canonical adapter initialization fails. This is a caller-supplied authority bypass and a fundamental provenance violation.
- **Minimum correction required:** Bind consumer verification to a fixed owner-issued authority before any caller port can be invoked; never derive the trust anchor from the first result's self-described constructor. Make the application-only load path reject caller-issued evidence and add a direct import-order negative witness. The correction may either expose a complete owner-controlled issuance boundary or remove the misleading injectable success path; it must preserve the canonical owner and fail closed.
- **Systemic pattern:** YES — `RCC-EXEC-SCHEMA-PROVENANCE-001`.
- **Related locations:** `src/domain/exec-validation-evidence-internal.ts:5–37`; `src/application/exec-contract.ts:22–58,79–140`; `src/infrastructure/exec-schema-validator.ts:237–267`; `tests/exec-001-ticket-001.test.ts:28,486–520,999–1050`; `src/composition/exec-contract.ts:1–10`.

### ARCH-MAJOR-001 — Public schema port has a hidden concrete receipt protocol and no independent alternate-adapter contract

- **Severity:** MAJOR
- **Ticket:** `EXEC-001-TICKET-001`
- **Normative authority:** `SPEC-EXEC-001` §2/§10/§13 and design §§7, 10, 12, 20; design explicitly records `ALTERNATE_ADAPTER_CONTRACT_TEST` and a schema-mechanics port; shared authority-provenance contract requires every claimed alternate adapter to satisfy the same proof contract.
- **Owner:** `SPEC-EXEC-001 / EXEC-001` validation boundary; the adapter may translate mechanics but cannot make a private concrete protocol the only realizable port contract.
- **Affected boundary:** `ExecSchemaValidationPort` (`src/domain/exec-schema.ts:43–45`) and `ValidateExecContract` constructor versus private `CanonicalSchemaValidationResult`, token, producer set and `authorizeReceiptTransport` in `src/infrastructure/exec-schema-validator.ts:25–105,159–187`.
- **Repository evidence:** The port exposes only `validate` and has no owner-issued evidence capability. The successful result type and token are private to `JsonSchemaExecValidator`; the only accepted non-concrete port is `createReceiptReplayPort`, which transports receipts already issued by that same adapter. Target tests prove replay success (`tests/exec-001-ticket-001.test.ts:288–322`) and reject an untrusted wrapper (`:324–337`) and caller-created subtype (`:339–396`), but no independently implemented schema adapter can issue an accepted result. The design claims an authenticated independent adapter contract at §7 lines 207–215, while the target implementation has no such producer seam.
- **Problem:** The structural port advertises substitution, but successful consumption is bound to a private concrete class and import-local token. A legitimate alternate schema engine cannot implement the approved contract without becoming the concrete adapter or using a replay of a prior concrete receipt. The replay test is not an alternate validation implementation.
- **Impact:** The adapter boundary is not genuinely replaceable; schema-library/adapter substitution is architecturally frozen by a hidden protocol, and any attempt to substitute either fails closed or must bypass the owner proof. This is a material cross-boundary conformance defect even though no foreign lifecycle is duplicated.
- **Minimum correction required:** Reconcile the boundary by either providing an owner-controlled, independently consumable issuance contract for alternate adapters with direct positive/negative evidence, or removing the false structural substitution port and making the canonical concrete boundary explicit. Do not permit a caller to mint the brand as the correction.
- **Systemic pattern:** YES — `RCC-EXEC-SCHEMA-PROVENANCE-001`.
- **Related locations:** `src/domain/exec-schema.ts:37–45,201–215`; `src/application/exec-contract.ts:79–85`; `src/infrastructure/exec-schema-validator.ts:25–105,136–187,235`; `tests/exec-001-ticket-001.test.ts:288–337,398–520`.

### ARCH-MAJOR-002 — Authority-consumption status contradicts the approved capability record

- **Severity:** MAJOR
- **Ticket:** `EXEC-001-TICKET-001`
- **Normative authority:** shared authority-completeness gates for independent `AUTHORITY_STATUS`, `CONTRACT_STATUS`, `LOCAL_TESTABILITY` and `PRODUCTIVE_AVAILABILITY`; Implementation Plan `EXEC-IMP-01` §9 producer/consumer record; implementation design §7 lines 165–195 and §16 lines 417–422; ticket §§6, 14a–14c.
- **Owner:** `SPEC-EXEC-001 / EXEC-001` capability handoff, with Plan/ticket revalidation as the owning artifact route.
- **Affected boundary:** capability `EXEC-SCHEMA-CAPABILITY-PAYLOAD` producer/consumer and readiness handoff.
- **Repository/evidence:** Plan §9 and design §7 state `LOCAL_TESTABILITY=YES`, `PRODUCTIVE_AVAILABILITY=NO` for the harness, summary `CONTRACT_TESTABLE_LOCALLY`, dependency `INFORMATIONAL`, no productive promotion and result `CONTRACT_TESTABLE_LOCALLY`. Ticket §14a instead states `AUTHORITY_CONSUMPTION_PROOF = AUTHORITY_CONSUMABLE` and `PRODUCTIVE_AVAILABILITY = YES for unit-owned local execution`, while §14b contains no normalized capability row and §115 retains the fixture `NO` record. No complete promotion record supplies previous/new availability, evidence owner and evidence baseline. The target tests prove local contract behavior only; they do not prove or record a productive-availability promotion.
- **Problem:** The same handoff simultaneously claims nonproductive local testability and consumable/productive authority. Under the shared contract, `AUTHORITY_CONSUMABLE` is not valid while the accepted evidence remains `PRODUCTIVE_AVAILABILITY=NO`, and a downstream promotion cannot be assumed without the required promotion record.
- **Impact:** A later readiness or consumer workflow can falsely treat a local harness/static witness as a productively consumable authority, weakening the distinction between local testability and integrated availability. The dependency is informational, so this does not create a local execution blocker; it remains a material producer/consumer proof defect.
- **Minimum correction required:** Reconcile all copies mechanically. Either preserve `CONTRACT_TESTABLE_LOCALLY`/`PRODUCTIVE_AVAILABILITY=NO` and do not call the capability consumable, or produce the complete authorized promotion record with new productive evidence and update every handoff consistently. Do not infer promotion from the implementation, test fixture or downstream artifact alone.
- **Systemic pattern:** NO — localized handoff contradiction; `RCC-EXEC-CAPABILITY-HANDOFF-001`.
- **Related locations:** Implementation Plan `docs/specs/implementation-plans/SPEC-EXEC-001-implementation-plan.md:187–196,242–248`; design `docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-001-implementation-design.md:163–195,414–422`; ticket `...capability-specific-envelope-and-payload-schemas.md:113–139,213–240`; target local schema/test paths listed in §4.

## 15. Required metrics and specialist summary

```text
OWNERSHIP_ERRORS = 0
FOREIGN_CAPABILITY_DUPLICATION = 0
AUTHORITY_VIOLATIONS = 1
IDENTITY_VIOLATIONS = 0
IMMUTABILITY_VIOLATIONS = 0
LINEAGE_VIOLATIONS = 0
LEGACY_AUTHORITY_VIOLATIONS = 0
ARCHITECTURAL_AUTHORITY_GAPS = 0
AUTHORITY_CONSUMPTION_GAPS = 1
PRODUCER_CONSUMER_CONTRACT_ERRORS = 2
TEMPORAL_AUTHORITY_GAPS = 0
CALLER_SUPPLIED_AUTHORITY_BYPASSES = 1
MISSING_ARCHITECTURE_GUARDS = 2
ARCHITECTURE_GUARD_TESTS_RUN = 12
```

The twelve executed boundary/architecture guard cases are the target tests for
caller-selected schema authority, custom/getter-backed definitions,
result-shaped adapters, replay/wrapper/subtype authority, public-boundary
exports, forged results, stale evidence, alternate schema/constructor bypass,
and the productive import graph. They all pass only after the infrastructure
module's import-time bootstrap. The two missing guards are (1) application-only
first-use/import-order caller injection and (2) a positive independent alternate
adapter contract; both are direct evidence gaps, not claims that ordinary
behavior tests are absent.

### Required summary shape

Audit: `.pi/runtime/workflow-audits/047b2eae-25bd-4a37-8955-bfd39bfa26b0/architecture-EXEC-001-TICKET-001-architecture-audit.md`

Specialist:
ARCHITECTURE_BOUNDARIES

Ticket: `EXEC-001-TICKET-001`

Ownership errors: 0

Foreign capability duplication: 0

Authority violations: 1

Identity violations: 0

Immutability/lineage violations: 0

Legacy authority violations: 0

Architectural authority gaps: 0
Authority consumption gaps: 1
Producer/consumer contract errors: 2
Temporal authority gaps: 0
Caller-supplied authority bypasses: 1
Missing architecture guards: 2
Architecture guard tests run: 12

Findings:
CRITICAL=1
MAJOR=2
MINOR=0
INFO=0

Domain audit complete:
YES

Specialist result:
SPECIALIST_ARCHITECTURE_FINDINGS

AUDIT_TARGET_HEAD: 1f27b0fe187325398524e351f56cacfc61eea1e4
AUDIT_TARGET_STATE_FINGERPRINT: c21d52859837764cd3bd22cc3c2cef5df7f8aeeba733724040eaec4d10cd2f3e
AUDIT_WAVE_ID: 047b2eae-25bd-4a37-8955-bfd39bfa26b0
DOMAIN_AUDIT_COMPLETE: YES
SPECIALIST_RESULT: SPECIALIST_ARCHITECTURE_FINDINGS