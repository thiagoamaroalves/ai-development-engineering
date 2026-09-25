# EXEC-001-TICKET-001 — Architecture Boundaries Audit

## 1. Audit identity and basis

```text
Audit: .pi/runtime/workflow-audits/7d0e508c-41b3-49c7-96ee-0062bab17b1a/architecture-EXEC-001-TICKET-001-architecture-audit.md
Specialist: ARCHITECTURE_BOUNDARIES
Ticket: EXEC-001-TICKET-001
Ticket path: docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-001-capability-specific-envelope-and-payload-schemas.md
Implementation unit: EXEC-IMP-01 — Capability-specific envelope and payload schemas
Approved implementation design: docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-001-implementation-design.md
Ticket-set audit: docs/tickets/SPEC-EXEC-001/implementation-ticket-audit.md
Ticket status: VALIDATION_REQUIRED
Implementation baseline: 8cf79cd37ebb02d0657c1fb191cea1d194b71f89
CURRENT_HEAD: 543033de8484c9104c28fa60d5228027d170c103
AUDIT_TARGET_HEAD: 543033de8484c9104c28fa60d5228027d170c103
AUDIT_TARGET_STATE_FINGERPRINT: 48adbeb1d4917fabba5cde69f45f28f189f99f86b19098434fabcadc9c042350
AUDIT_WAVE_ID: 7d0e508c-41b3-49c7-96ee-0062bab17b1a
WORKTREE_OVERLAY: one unrelated tracked audit artifact; no implementation or test overlay was used
SIBLING_SPECIALIST_AUDITS_READ: NO
READ_ONLY: YES
INDEPENDENT: YES
ADVERSARIAL: YES
AUDIT_MODE: READ_ONLY INDEPENDENT ADVERSARIAL ARCHITECTURE_FIRST OWNERSHIP_PRESERVING AUTHORITY_PRESERVING CROSS_SPEC_AWARE IDENTITY_AWARE LEGACY_TRANSITION_AWARE EXHAUSTIVE_WITHIN_DOMAIN
```

The pinned commit resolves to `543033de8484c9104c28fa60d5228027d170c103`. The
working-tree change is an unrelated audit artifact and is not treated as a
semantic implementation overlay. No production code, test, ticket state,
authority artifact, Git state, commit, branch, remote, or publication state was
changed by this audit.

### Actual implementation subject changed from the ticket baseline

Production:

- `src/application/exec-contract.ts`
- `src/domain/exec-contract.ts`
- `src/domain/exec-schema.ts`
- `src/domain/exec-validation-evidence-internal.ts`
- `src/infrastructure/exec-schema-validator.ts`

Tests and ticket evidence:

- `tests/exec-001-ticket-001.test.ts`
- `docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-001-capability-specific-envelope-and-payload-schemas.md`
- `docs/tickets/SPEC-EXEC-001/evidence/TICKET-001/AC-EXEC-001-envelope-schema.md`
- `docs/tickets/SPEC-EXEC-001/evidence/TICKET-001/AC-EXEC-001-structured-consumption.md`
- `docs/tickets/SPEC-EXEC-001/evidence/TICKET-001/AC-EXEC-002-fail-closed.md`
- `docs/tickets/SPEC-EXEC-001/evidence/TICKET-001/AC-EXEC-002-required-fields.md`

The implementation subject was inspected at the pinned target, not inferred
from the implementation claims or self-checks.

## 2. Authority precedence and reconstructed contract

Authority was applied in this order:

1. `docs/adrs/ADR-0003-versioned-skill-contracts.md`, accepted revision 3,
   `Decisão`: JSON Schema envelope/payload, human text is non-authoritative,
   explicit semantic versions, exact execution basis, and fail-closed invalid
   schema results.
2. `docs/specs/SPEC-EXEC-001-skill-contracts-and-capability-registry.md`,
   revision 5, especially §2, §9 (`O-016`), §10, §12, §13
   (`EXEC-ENVELOPE-001/002`), and `EXEC-CONTRACT-001`.
3. `docs/specs/SPEC-DOM-001-workflow-authority-and-governance.md`, revision 4,
   for the consumed canonical DOM identity/snapshot/lifecycle boundary; DOM is
   not redefined here.
4. `skills/_shared/authority-completeness-gates.md` and
   `skills/_shared/authority-provenance-anti-forgery-contract.md` for
   authority-consumption, caller-as-authority, issuer, provenance, stale and
   forgery obligations.
5. `docs/specs/gap-matrices/SPEC-EXEC-001-implementation-gap-matrix.md`,
   `GAP-018`, and
   `docs/specs/implementation-plans/SPEC-EXEC-001-implementation-plan.md`,
   `EXEC-IMP-01`, for the validated implementation delta and proof allocation.
6. The approved implementation design, ticket, repository implementation and
   tests as subordinate realization/evidence.

### Reconstructed architectural contract

| Concern | Normative result |
|---|---|
| `LOCAL_OWNER` | `SPEC-EXEC-001 / EXEC-001` owns schema identity, capability-specific schema selection, structured validation result and minimum fields. |
| `LOCAL_AUTHORITIES` | Immutable identifiable envelope/payload schema definitions; `SchemaReference`; authenticated schema-validation evidence; complete validated pair; `CONTRACT_INVALID` failure meaning. |
| `FOREIGN_OWNERS` | `SPEC-DOM-001` owns `ExecutionId`, `ActivityId`, `AttemptId`, `ArtifactCycleId`, snapshot and lifecycle; PLAT owns persistence/recovery; registry/source/publication and downstream mappings remain outside this unit. |
| `FOREIGN_CAPABILITIES_CONSUMED` | None required for local closure. DOM references are carried opaquely and are not resolved or mutated. |
| `CANONICAL_IDENTITIES` | Local `SchemaId@semantic-version` and capability identity; DOM identities remain opaque canonical references and are not regenerated or normalized. |
| `IMMUTABILITY_RULES` | Schema documents/definition collections and returned structured values are immutable; invalid input cannot produce a partial validated pair. |
| `LINEAGE_RULES` | No lineage or persisted aggregate is created; the unit must preserve opaque identity fields without assigning DOM lineage meaning. |
| `LEGACY_AUTHORITY_RULES` | The former generic payload path is not silently converted; the new identifiable capability schema is the only accepted local path. |
| `CUTOVER_RULES` | Generic payload acceptance is retired as a contradictory local authority path; no durable migration is performed. |
| `MIGRATION_AUTHORITY` | None in this unit. |
| `SECURITY_BOUNDARIES` | Human text cannot supply authority; invalid results carry `noApproval`, `noCheckpoint` and `noEffect`; validation is not approval or effect execution. |
| `DOES_NOT_IMPLEMENT` | Registry resolution/publication, DOM identity/lifecycle, persistence/recovery, runtime/session, transport, UI/OPS, external effects and final cross-SPEC conformance. |

The authority and ownership contract is complete. The defect found below is
not an unresolved architecture decision; it is an implementation-created
alternate authority path.

## 3. Applicability matrix

| Dimension | Classification | Evidence and reason |
|---|---|---|
| OWNERSHIP | REQUIRED | Production code creates and consumes a new EXEC schema authority boundary. |
| CANONICAL_AUTHORITY | REQUIRED | The ticket must ensure only the EXEC-owned selected schema can establish validation truth. |
| CROSS_SPEC_INTEGRATION | AFFECTED | Opaque DOM-owned IDs are transported, but no foreign producer/outcome is consumed or recomputed. |
| IDENTITY | REQUIRED | Schema reference, schema version, capability identity and selection continuity are ticket-owned. |
| IMMUTABILITY | REQUIRED | Definitions, documents, results and structured values are frozen; no mutable authority may be substituted. |
| LINEAGE | NOT_APPLICABLE | There is no Aggregate Root, persisted record, predecessor/successor relation, reconstruction or historical record in this unit; opaque DOM fields are not interpreted as lineage. |
| LEGACY_TRANSITION | AFFECTED | The generic payload schema is retired in favor of the identifiable capability-specific schema. |
| DESTRUCTIVE_TRANSITION | NOT_APPLICABLE | No persisted state, data deletion, irreversible migration, or external transition is performed; the acceptance cutover is an in-memory contract boundary. |
| MIGRATION_AUTHORITY | NOT_APPLICABLE | No migration reader/writer, state conversion or migration authority is introduced. |
| SECURITY_AUTHORIZATION | AFFECTED | The result carries requested effects and verdict fields and therefore must not elevate validation into approval; this unit has no authentication route or effect executor. |

## 4. Audit results

### 4.1 Ownership and canonical authority

`OWNERSHIP_PRESERVED` for the intended scope. `src/domain/exec-schema.ts`
owns the immutable ticket-local definitions, `src/application/exec-contract.ts`
coordinates selection/validation, and
`src/infrastructure/exec-schema-validator.ts` owns JSON Schema mechanics. No
foreign lifecycle, persistence, registry publication, DOM decision, or effect
execution was absorbed.

```text
OWNERSHIP_RESULT = OWNERSHIP_PRESERVED
FOREIGN_CAPABILITY_DUPLICATED = 0
AUTHORITY_RECOMPUTED_LOCALLY = NO
REPOSITORY_SEMANTIC_AUTHORITY = NO
```

The authority result is not conformant. The intended canonical adapter proof is
replaced by an alternate caller-mintable path:

```text
AUTHORITY_RESULT = ALTERNATE_AUTHORITY_INTRODUCED
AUTHORITY_STATUS = PARTIAL
DUAL_AUTHORITY = YES at the validation-evidence boundary
```

`src/domain/exec-validation-evidence-internal.ts:11-32` ignores the supplied
producer and accepts any frozen result whose caller-controlled own
`canonicalResultType` points to a prototype with a method named
`isCanonicalValidationResult` that returns `true`. The private `#brand` in
`CanonicalSchemaValidationResult` is not actually checked by that recognizer.
This creates a second issuer path without changing the intended domain owner.

A second related escape is `src/domain/exec-schema.ts:195-203`: canonical
schema definition recognition checks only that a caller object returns the
canonical singleton reference and document, not that it is the canonical
immutable definition object. `JsonSchemaExecValidator.validate` then reads
those caller-controlled properties again at `:117-145`. A getter-backed object
can pass the first identity check and supply a different schema document to
`Compile`, allowing the public adapter to issue a genuine-looking result for
attacker-selected schema mechanics.

### 4.2 Cross-spec integration

```text
CROSS_SPEC_RESULT = CROSS_SPEC_CONFORMANT within this ticket boundary
FOREIGN_OWNER_STATE_WRITES = 0
FOREIGN_OUTCOME_DUPLICATION = 0
INTEGRATION_NOT_PROVEN = NO for local closure; no foreign capability is required
```

The implementation keeps DOM identifiers opaque and does not resolve, create,
or mutate DOM identity/lifecycle. The local schema harness is unit-owned and
has `PRODUCTIVE_AVAILABILITY = NO`; it is not incorrectly treated as a foreign
productive producer. The authority defect is local to the EXEC proof boundary,
not a cross-SPEC ownership transfer.

### 4.3 Identity

```text
IDENTITY_RESULT = CONFORMANT within the bounded schema contract
IDENTITY_VIOLATIONS = 0
```

`EXEC_ENVELOPE_SCHEMA_REFERENCE` and `EXEC_PAYLOAD_SCHEMA_REFERENCE` are
module-owned immutable singleton references. Domain construction requires those
exact canonical references, exact schema fields, exact capability identity and
own enumerable required fields. The payload selection returns a definition from
the frozen `payloadDefinitions` set, and the old generic schema ID is rejected.
DOM IDs are preserved as opaque strings (`tests/exec-001-ticket-001.test.ts:130-145`)
and are not normalized into local identities.

The forged proof finding is classified under canonical authority/provenance,
not as a regenerated schema identity. The schema-definition wrapper escape is a
related authority manifestation and does not create a new canonical ID.

`AGGREGATE_IDENTITY_PROOF = NOT_APPLICABLE`: no aggregate/entity is created.
`AGGREGATE_RECONSTRUCTION_PROOF = NOT_APPLICABLE`: no persisted material is
rehydrated.

### 4.4 Immutability and lineage

```text
IMMUTABILITY_RESULT = CONFORMANT for in-memory definitions/results/values
LINEAGE_RESULT = NOT_APPLICABLE
IMMUTABILITY_OR_LINEAGE_VIOLATIONS = 0
HISTORY_REWRITE = 0
```

`deepFreeze` recursively freezes schema documents and `payloadDefinitions`;
`cloneAndFreeze` freezes returned structured data; result/failure/value
objects are frozen. No append-only history, revision progression, persistence
adapter or reconstruction path is introduced. The authority defect permits
forged proof but does not mutate canonical definitions or historical material.

### 4.5 Legacy and cutover

```text
LEGACY_RESULT = TRANSITION_CONFORMANT
LEGACY_AUTHORITY_VIOLATIONS = 0
DUAL_LEGACY_WRITERS = 0
```

The former generic payload ID (`exec-capability-payload`) is rejected by
`selectPayload` and by the payload schema's `const` constraints. No compatibility
mapping converts a generic payload into a capability-specific contract, and no
legacy writer or persisted migration exists. The alternate proof issuer is a
current authority defect, not a legacy read/write defect.

### 4.6 Destructive transition and migration

```text
DESTRUCTIVE_TRANSITION = NOT_APPLICABLE
REPLACEMENT_PROVEN = NOT_APPLICABLE
CUTOVER_AUTHORIZED = NOT_APPLICABLE as a destructive transition
PRE_TRANSITION_GATES_SATISFIED = NOT_APPLICABLE
POST_TRANSITION_GUARDS_PRESENT = NOT_APPLICABLE
ROLLBACK_OR_ROLL_FORWARD_SEMANTICS_DEFINED = NOT_APPLICABLE
MIGRATION_RESULT = NOT_APPLICABLE
```

There is no durable record, irreversible deletion, migration command, recovery
operation or state cutover. The ticket's generic-path retirement is bounded to
contract acceptance and is authorized by the ticket/design scope.

### 4.7 Security/authorization boundary

```text
SECURITY_RESULT = CONFORMANT for the bounded validation operation, subject to ARCH-CRITICAL-001
```

`humanText` is ignored for structured construction. Invalid paths return
`CONTRACT_INVALID`, expose no partial value and set `noApproval`, `noCheckpoint`
and `noEffect`. No backend authorization route or effect executor exists in
this unit, and no capability is used to authorize an external action. The
caller-mintable schema-proof result nevertheless violates the separate
authority/provenance boundary and is reported as a critical architecture
finding.

## 5. Authority consumption and provenance proofs

### 5.1 Authority consumption proof

| Field | Evidence/result |
|---|---|
| `CAPABILITY_ID` | `EXEC-SCHEMA-CAPABILITY-PAYLOAD` |
| `AUTHORITY_EXISTENCE` | `SPEC-EXEC-001` O-016 / `EXEC-ENVELOPE-001/002`; identifiable envelope and capability payload are normatively defined. |
| `TRUTH_OWNER` | `SPEC-EXEC-001 / EXEC-001`. |
| `AUTHORITY_SEMANTIC_SOURCE` | Frozen envelope and capability-specific payload schema definitions. |
| `OWNER_DOMAIN_OR_BOUNDED_CONTEXT` | EXEC-001. |
| `CONSUMPTION_CONTRACT` | `ValidateExecContract` selects an internal definition, invokes the validation port, verifies evidence and constructs the complete pair. |
| `PORT_INTERFACE_QUERY_RESOLVER_OR_READER` | `ExecSchemaValidationPort`; `JsonSchemaExecValidator` is the intended producer. |
| `CONTRACT_PRODUCER` | Intended: `JsonSchemaExecValidator`; actual proof recognizer also accepts caller-created result objects. |
| `CONTRACT_CONSUMER` | `ValidateExecContract`, `StructuredExecutionEnvelope.create`, `StructuredCapabilityPayload.create`. |
| `RETURNED_DATA` | selected schema reference, exact input object and content fingerprint, plus validation result. |
| `VERSION_REVISION_TRANSPORT` | `SchemaReference` carries exact schema ID and semantic version. |
| `FAILURE_NOT_FOUND_STALE_SEMANTICS` | Missing/unknown/mismatched payload selection, malformed result and stale genuine result fail closed; forged exact-shape results currently do not. |
| `AUTHORITY_STATUS` | `DEFINED`. |
| `CONTRACT_STATUS` | `DEFINED`. |
| `SEMANTIC_STATUS` | `PARTIAL — provenance issuer verification is defective`. |
| `LOCAL_TESTABILITY` | `YES`; focused contract suite is executable. |
| `PRODUCTIVE_AVAILABILITY` | `NO` for the unit-owned local harness; no foreign productive producer is claimed. |
| `CAPABILITY_SUMMARY_STATUS` | `CONTRACT_TESTABLE_LOCALLY`. |
| `DEPENDENCY_CLASS` | `INFORMATIONAL`. |
| `AVAILABILITY_EVIDENCE` | focused direct schema tests; local evidence is not productive availability. |
| `BLOCKING_EFFECT` | No external capability blocker; the proof defect blocks architectural conformance. |
| `PROOF_RESULT` | `AUTHORITY_CONSUMPTION_GAP` because consumable success can be minted without the canonical producer. |

### 5.2 Producer/consumer contract proof

```text
CAPABILITY_ID = EXEC-SCHEMA-CAPABILITY-PAYLOAD
AUTHORITY_OWNER = EXEC-001
PRODUCER = JsonSchemaExecValidator (intended canonical producer)
PRODUCED_CONTRACT = frozen successful validation evidence bound to exact schema/input/fingerprint
CONSUMER = ValidateExecContract and domain structured values
CONSUMED_CAPABILITY = capability-specific schema validation
AUTHORITY_STATUS = DEFINED
CONTRACT_STATUS = DEFINED
SEMANTIC_STATUS = ERROR: issuer/provenance verification is forgeable
LOCAL_TESTABILITY = YES
PRODUCTIVE_AVAILABILITY = NO for the local harness
DEPENDENCY_CLASS = INFORMATIONAL
PRODUCER_CONSUMER_CONTRACT_RESULT = PRODUCER_CONSUMER_CONTRACT_ERROR
```

A delegating wrapper that transports a genuine canonical result is accepted,
which is the intended alternate adapter behavior. A wrapper that returns the
exact forged result shape is also accepted, which violates the same contract.

### 5.3 Authority provenance / anti-forgery record

| Required proof field | Audit result |
|---|---|
| `PROOF_ISSUER_OWNER` | `SPEC-EXEC-001 / EXEC-001`; intended issuance in `JsonSchemaExecValidator`. |
| `PROOF_SCOPE` | Exact selected immutable schema definition and exact input object. |
| `PROOF_IDENTITY_OR_BRAND` | Intended private `#brand`, but the consumer does not inspect it; it trusts caller-supplied `canonicalResultType` and method. **FAIL**. |
| `CONSUMER_VERIFICATION_RULE` | `isProducerIssuedValidationResult` plus exact five-key, input/reference/fingerprint checks in `src/application/exec-contract.ts:47-58` and `src/domain/exec-contract.ts:397-415`. |
| `STALE_OR_MUTATION_POLICY` | Genuine stale/mutated results are rejected by exact input identity, current fingerprint and adapter receipt recheck; a caller can mint a fresh fingerprint on a forged result, so provenance remains unprotected. **PARTIAL**. |
| `FORGERY_NEGATIVE_TEST` | Existing plain/copy/wrong-method tests pass, but an exact frozen self-describing fake passes the production boundary. **FAIL**. |
| `CALLER_INJECTION_NEGATIVE_TEST` | Existing always-true plain-port tests pass, but an injected port returning the exact forged shape yields `VALID`. **FAIL**. |
| `ALTERNATE_ADAPTER_CONTRACT_TEST` | Genuine owner-result delegating adapter passes; arbitrary exact-shape result adapter also passes. **PARTIAL/FAIL**. |
| `ISSUER_IS_AUTHORIZED` | **NO** — issuer identity is not verified. |
| `PROOF_SCOPE_IS_EXACT` | **PARTIAL** — input/reference/fingerprint are exact, issuer and immutable definition identity are not. |
| `CONSUMER_VERIFIES_PROVENANCE` | **NO**. |
| `INPUT_OR_REFERENCE_BINDING` | `YES` for the fields checked. |
| `MUTATION_OR_STALE_REJECTION` | `YES` for genuine evidence; insufficient against caller-minted fresh evidence. |
| `FORGERY_PATH_REJECTED` | **NO**. |
| `CALLER_INJECTION_REJECTED` | **NO** for the exact forged shape. |
| `ALTERNATE_ADAPTER_CONTRACT` | **PARTIAL/FAIL**. |

### 5.4 Temporal authority and caller-as-authority checks

```text
TEMPORAL_AUTHORITY_PROOF = NOT_APPLICABLE
TEMPORAL_AUTHORITY_GAPS = 0
```

The operation validates immutable ticket-owned definitions and commits no
external effect. Input mutation is checked as stale/provenance protection, not
as revalidation of mutable external authority.

```text
CALLER_AS_AUTHORITY_CHECK = FAIL
CALLER_SUPPLIED_AUTHORITY_BYPASS = YES
```

The injected validator/result and caller-controlled definition wrapper can
replace the canonical producer's schema evaluation with caller-asserted
success. The caller is therefore treated as the authority for validation proof
on those paths.

## 6. Direct executable evidence

The target's focused suite and repository suite were run read-only:

```text
node --experimental-strip-types --test tests/exec-001-ticket-001.test.ts = PASS (23/23)
npm test = PASS (81/81)
npm run typecheck = PASS
```

Relevant existing tests include custom-schema rejection, plain always-true port
rejection, caller-created subtype rejection, copied-result rejection, stale
 genuine-result rejection, public-boundary export checks, and the productive
import-graph guard (`tests/exec-001-ticket-001.test.ts:192-237, 239-329,
331-483, 485-576, 835-886`). These are useful evidence but do not close the
exact forged-shape path.

Two additional adversarial runtime probes were executed against the pinned
implementation without modifying the repository:

1. A caller-created frozen object with five enumerable validation fields and a
   non-enumerable own `canonicalResultType` pointing to a caller class whose
   `isCanonicalValidationResult()` returns `true` was returned by an injected
   `ExecSchemaValidationPort`. `ValidateExecContract.validate(validInput)`
   returned `VALID`. This directly demonstrates that the recognizer at
   `src/domain/exec-validation-evidence-internal.ts:11-32` is forgeable and
   that the application/domain consumers accept caller-minted proof.
2. A getter-backed `ExecSchemaDefinition` returned the canonical reference and
   document during `isCanonicalExecSchemaDefinition`, then returned an
   attacker document to the adapter compiler. The direct result was:

   ```text
   documentReads=4, valid=true, issues=[], reference=exec-envelope@1.0.0
   ```

   The input used for that direct adapter call was `{totally: 'invalid'}`.
   This demonstrates that the public schema-definition guard is not an
   immutable identity boundary and can cause the canonical adapter to issue
   evidence for caller-selected schema mechanics.

### Architecture guards

```text
ARCHITECTURE_GUARD_TESTS_RUN = 2 explicit guards
  - public validation-authority/export boundary
  - productive import-graph boundary
MISSING_ARCHITECTURE_GUARDS = 1
```

The required owner-proof negative guard is incomplete: the existing forgery
cases do not construct the exact self-describing shape accepted by the
recognizer. The custom-schema guard likewise tests a copied document, not a
getter-backed definition that passes the identity check and changes the
compiled document. Ordinary green tests therefore do not establish an
architecture-preserving issuer boundary.

## 7. Systemic boundary expansion campaign

```text
ROOT_CAUSE_CAMPAIGN_ID = RCC-EXEC-001-SCHEMA-PROOF-AUTHORITY
ROOT_CAUSE_ID = RC-EXEC-001-CALLER-CONTROLLED-PROOF-RECOGNITION
CAMPAIGN_STATUS = OPEN
CAMPAIGN_SCOPE = EXEC-001-TICKET-001 schema definition, validation evidence, structured-value and alternate-producer boundary
CANONICAL_FINDINGS = ARCH-CRITICAL-001
```

Root cause: the implementation attempts to make proof private, but the
consumer recognizes caller-controlled runtime metadata and a caller-controlled
predicate instead of checking a producer-owned identity/token and exact
immutable definition. The result, schema registrar, consumer, injection and
port-substitution paths must be audited together.

| Surface row | Surface class | Location / owner | Current behavior | Expected behavior | Coverage status | Negative witness IDs |
|---|---|---|---|---|---|---|
| `RCC-SCHEMA-001` | ISSUER | `src/infrastructure/exec-schema-validator.ts:34-80`, EXEC-001 | Genuine issuer has a private token, but publishes a self-describing type property that the consumer trusts indirectly. | Only the authorized owner-issued result can establish proof. | MISSING | `NEG-PROOF-001` |
| `RCC-SCHEMA-002` | REGISTRAR | `src/domain/exec-schema.ts:146-163,195-203`, EXEC-001 | Frozen definitions exist, but the canonical predicate accepts caller objects exposing singleton reference/document values. | Registrar returns/recognizes only immutable owner definitions; caller wrappers cannot alter schema mechanics or capability association. | MISSING | `NEG-PROOF-002` |
| `RCC-SCHEMA-003` | CONSUMER | `src/application/exec-contract.ts:22-58`; `src/domain/exec-contract.ts:391-415` | Consumer accepts a fake result after shape, input, reference and fingerprint checks. | Consumer must independently verify issuer provenance and exact scope before constructing values. | MISSING | `NEG-PROOF-001`, `NEG-PROOF-003` |
| `RCC-SCHEMA-004` | ALTERNATE_AUTHORITY_PATH | `isProducerIssuedValidationResult`; caller class/result | A caller class can implement the expected method and return true. | Caller-defined result/protocol must be rejected as `CONTRACT_INVALID`. | MISSING | `NEG-PROOF-001` |
| `RCC-SCHEMA-005` | INJECTION_POINT | `ValidateExecContract` constructor and structured value factory producer parameters | Arbitrary injected ports are rejected only for ordinary result shapes, not exact forged shapes. | Injection can transport genuine owner proof only; it cannot mint proof. | MISSING | `NEG-PROOF-003` |
| `RCC-SCHEMA-006` | MUTATION_PATH | `JsonSchemaExecValidator` receipt/fingerprint and domain exact-input checks | Genuine current/stale handling works; a forged result can claim a newly computed fingerprint. | Mutation checks must be subordinate to unforgeable provenance, not a replacement for it. | MISSING | `NEG-PROOF-004` |
| `RCC-SCHEMA-007` | STALE_PATH | stale port and `isSuccessfulSchemaValidation` | Genuine stale evidence is rejected, but caller-minted evidence can be recomputed after mutation. | Stale and forged evidence both fail closed. | MISSING | `NEG-PROOF-004` |
| `RCC-SCHEMA-008` | PORT_SUBSTITUTION_PATH | `ExecSchemaValidationPort`; delegating wrapper test | Genuine owner-result delegation passes; exact fake-result wrapper also passes. | Alternate adapter may transport owner-issued result only. | MISSING | `NEG-PROOF-003` |
| `RCC-SCHEMA-009` | PUBLIC_EXPORT | `src/domain/exec-validation-evidence-internal.ts:11`; public adapter/schema interfaces | Internal recognizer and schema-definition/adapter surfaces are importable; no producer identity is enforced at the seam. | Publicly reachable ports must not expose a forgeable authority protocol. | MISSING | `NEG-PROOF-001`, `NEG-PROOF-002` |
| `RCC-SCHEMA-010` | PERSISTENCE | Ticket has no persistence path | No persistence authority is introduced. | No persistence path is required for this unit. | NOT_APPLICABLE | — |
| `RCC-SCHEMA-011` | RETRY_RECOVERY | Ticket has no retry/recovery path | No retry/recovery authority is introduced. | No retry/recovery path is required for this unit. | NOT_APPLICABLE | — |
| `RCC-SCHEMA-012` | LEGACY_ROUTE | `ExecContractSchemaDefinitions.selectPayload`; payload schema const | Generic old payload ID is rejected and not converted. | No generic legacy route may establish current schema authority. | COVERED | `NEG-LEGACY-001` |
| `RCC-SCHEMA-013` | ARCHITECTURE_GUARD | `tests/exec-001-ticket-001.test.ts:331-363,835-886` | Public/export and import guards pass, but exact forged issuer/definition guards are absent. | Executable guards reject the forbidden issuer and definition substitution paths. | MISSING | `NEG-PROOF-001`, `NEG-PROOF-002` |
| `RCC-SCHEMA-014` | TEST | `tests/exec-001-ticket-001.test.ts:365-483` | Plain/copy/wrong-method cases are covered; exact fake class/prototype case is not. | Direct positive and exact forged/caller-injected negative witnesses pass. | MISSING | `NEG-PROOF-001`, `NEG-PROOF-003` |

```text
CAMPAIGN_MATRIX_COMPLETE = YES
ALL_SURFACE_ROWS_COVERED = YES
ALL_NEGATIVE_WITNESSES_PASS = NO
NO_UNEXPLAINED_PUBLIC_AUTHORITY_PATH = NO
NO_HIDDEN_CONCRETE_PROTOCOL = NO — the self-describing result protocol is hidden in the public recognizer
ROOT_CAUSE_REMOVED = NO
KNOWN_MANIFESTATIONS_CLOSED = NO
SYSTEMIC_TEST_EVIDENCE = PRESENT but insufficient for closure
```

## 8. Finding

### ARCH-CRITICAL-001 — Caller-mintable schema proof and alternate schema authority

- **Severity:** CRITICAL
- **Ticket:** `EXEC-001-TICKET-001`
- **Normative authority:** `docs/adrs/ADR-0003-versioned-skill-contracts.md`,
  `Decisão`; `docs/specs/SPEC-EXEC-001-skill-contracts-and-capability-registry.md`
  §2, §9 `O-016`, §12, §13 `EXEC-ENVELOPE-001/002` and
  `EXEC-CONTRACT-001`; `skills/_shared/authority-provenance-anti-forgery-contract.md`;
  approved implementation design §7, §13 and §20.
- **Owner:** `SPEC-EXEC-001 / EXEC-001` (schema authority); the intended
  producer is `JsonSchemaExecValidator`, with application/domain consumers
  responsible for verification.
- **Affected boundary:** canonical schema-definition registrar → validation
  evidence issuer → `ExecSchemaValidationPort` injection/substitution seam →
  application validator → structured domain values.
- **Repository evidence:**
  `src/domain/exec-validation-evidence-internal.ts:11-32` ignores its producer
  parameter and accepts caller-selected `canonicalResultType`/verifier claims;
  `src/infrastructure/exec-schema-validator.ts:34-66` exposes that
  self-describing property while its actual private token is never checked by
  the consumer; `src/application/exec-contract.ts:47-58` and
  `src/domain/exec-contract.ts:397-415` use the result as proof; and
  `src/domain/exec-schema.ts:195-203` does not require exact canonical
  definition object identity. The exact frozen fake probe returned `VALID` from
  `ValidateExecContract`; the getter-backed definition probe returned
  `valid=true` for `{totally: 'invalid'}` from the exported adapter.
- **Problem:** A caller can mint a frozen, result-shaped object with the five
  expected enumerable fields and an attacker class whose
  `isCanonicalValidationResult()` returns `true`. The consumer treats this as
  owner-issued schema evidence. A caller can also pass a definition wrapper
  that passes the reference/document identity check once and supplies an
  attacker document to the compiler. The current negative tests reject only
  less precise fakes and therefore do not witness the forbidden paths.
- **Impact:** Caller-supplied authority replaces canonical schema evaluation;
  an alternate adapter/definition path can establish `VALID` without the
  authorized selected schema. This is a direct provenance/anti-forgery
  violation and a competing canonical proof path. It can admit schema-invalid
  or semantically unproven data whenever a schema rule is not duplicated by
  the current value constructors and makes the authority boundary unsafe for
  later capability schemas/consumers. It also violates the requirement that
  alternate adapters transport, rather than mint, owner authority.
- **Minimum correction required:** Restore an independently verifiable
  owner-issued proof boundary and exact immutable schema-definition binding;
  reject exact self-describing fake results, caller-injected minting ports,
  getter-backed/custom definition substitutions and stale forged evidence as
  `CONTRACT_INVALID` with no validated value or success signals. Preserve the
  existing EXEC/domain/application/infrastructure ownership split and add
  executable direct negative witnesses for the exact result and definition
  substitution shapes.
- **Systemic pattern:** YES
- **Related locations:**
  `src/domain/exec-validation-evidence-internal.ts`;
  `src/infrastructure/exec-schema-validator.ts`;
  `src/domain/exec-schema.ts`;
  `src/application/exec-contract.ts`;
  `src/domain/exec-contract.ts`;
  `tests/exec-001-ticket-001.test.ts` caller-injection, custom-definition,
  forged-result, stale and architecture-guard sections;
  `src/composition/exec-contract.ts` productive composition boundary.

## 9. Architectural scope conclusion

```text
ARCHITECTURAL_AUTHORITY_GAP_DISCOVERED = NO
ARCHITECTURAL_SCOPE = AUTHORIZED_ARCHITECTURAL_REALIZATION_WITH_AUTHORITY_DEFECT
CALLER_SUPPLIED_AUTHORITY_BYPASS = 1
UNAUTHORIZED_FOREIGN_OWNERSHIP = 0
UNAUTHORIZED_ARCHITECTURAL_EXPANSION = 0
```

The normative owner and boundary are clear. No ADR/SPEC/contract decision must
be invented. The implementation's private-result design is an authorized
realization in intent, but its runtime recognizer creates an unauthorized
alternate authority path and is not architecturally conformant.

## 10. Required specialist summary

Audit: `.pi/runtime/workflow-audits/7d0e508c-41b3-49c7-96ee-0062bab17b1a/architecture-EXEC-001-TICKET-001-architecture-audit.md`

Specialist:
`ARCHITECTURE_BOUNDARIES`

Ticket: `EXEC-001-TICKET-001`

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
Architecture guard tests run: 2

Findings:
CRITICAL=1
MAJOR=0
MINOR=0
INFO=0

Domain audit complete:
YES

Specialist result:
SPECIALIST_ARCHITECTURE_FINDINGS

AUDIT_TARGET_HEAD: 543033de8484c9104c28fa60d5228027d170c103
AUDIT_TARGET_STATE_FINGERPRINT: 48adbeb1d4917fabba5cde69f45f28f189f99f86b19098434fabcadc9c042350
AUDIT_WAVE_ID: 7d0e508c-41b3-49c7-96ee-0062bab17b1a
DOMAIN_AUDIT_COMPLETE: YES
SPECIALIST_RESULT: SPECIALIST_ARCHITECTURE_FINDINGS