# EXEC-001-TICKET-001 — Architecture Boundaries Audit

## 1. Audit identity and basis

```text
AUDIT_MODE = READ_ONLY INDEPENDENT ADVERSARIAL ARCHITECTURE_FIRST
SPECIALIST = ARCHITECTURE_BOUNDARIES
TICKET_ID = EXEC-001-TICKET-001
TICKET_PATH = docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-001-envelope-schema-contract.md
DESIGN_PATH = docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-001-implementation-design.md
TICKET_SET_AUDIT = docs/tickets/SPEC-EXEC-001/implementation-ticket-audit.md
IMPLEMENTATION_UNIT = EXEC-IMP-01 — Envelope and schema contract
IMPLEMENTATION_BASELINE = 381218d5fbf8d969ee5ae5349b8f65c4cd5af7f9
AUDIT_TARGET_HEAD = 381218d5fbf8d969ee5ae5349b8f65c4cd5af7f9
AUDIT_TARGET_STATE_FINGERPRINT = 2e77021139ed96e08980a98b792164c6b9ce2c5f86043b0fcad3f9dbda1c2db8
CURRENT_HEAD = 381218d5fbf8d969ee5ae5349b8f65c4cd5af7f9
WORKING_TREE_OVERLAY = PRESENT; covered by the pinned state fingerprint
TICKET_STATUS = VALIDATION_REQUIRED

AUTHORITY_CONSUMPTION_PROOF = ACP-EXEC-01 / ticket §14a
PRODUCER_CONSUMER_PROOF = PCP-EXEC-01 / ticket §14b
REQUIREMENTS = EXEC-ENVELOPE-001, EXEC-ENVELOPE-002
ACCEPTANCE = AC-EXEC-001, AC-EXEC-002
GAPS = GAP-001
PORTFOLIO_OBLIGATION = O-016
```

The pinned HEAD and state fingerprint remained unchanged during this audit. The
working tree contains the implementation overlay and documentation dirtiness
recorded by the ticket-set audit; no Git, ticket state, authority, commit,
branch, remote, or publication operation was performed.

### Audited implementation files

```text
src/domain/exec-contract.ts
src/domain/exec-schema.ts
src/domain/exec-validation-evidence-internal.ts
src/application/exec-contract.ts
src/infrastructure/exec-schema-validator.ts
src/composition/exec-contract.ts
tests/exec-001-ticket-001.test.ts
docs/tickets/SPEC-EXEC-001/evidence/TICKET-001/AC-EXEC-001-envelope-schema.md
docs/tickets/SPEC-EXEC-001/evidence/TICKET-001/AC-EXEC-001-structured-consumption.md
docs/tickets/SPEC-EXEC-001/evidence/TICKET-001/AC-EXEC-002-required-fields.md
docs/tickets/SPEC-EXEC-001/evidence/TICKET-001/AC-EXEC-002-fail-closed.md
```

The ticket's claimed execution record names `exec-validation-authority*`, but
the actual implementation uses `exec-validation-evidence-internal.ts`; this
is recorded as repository evidence, not promoted to authority.

## 2. Authority precedence and reconstructed contract

The audit applied:

```text
ADR-0003 (accepted, revision 3)
  > SPEC-EXEC-001 (revision 3; component audit conformant)
  > explicit DOM/PLAT/REPO consumer boundaries
  > validated Gap Matrix GAP-001
  > Implementation Plan EXEC-IMP-01
  > Implementation Design
  > ticket
  > repository implementation and tests
```

### Contract reconstruction

| Concern | Canonical result and source anchor |
|---|---|
| Local owner | `SPEC-EXEC-001 / EXEC-001 / CANONICAL_OWNER`; Portfolio O-016; SPEC §§2, 9, 13; ticket §§3, 7. |
| Local authority | `ADR-0003` Decisão; `EXEC-ENVELOPE-001/002`; ticket AC-EXEC-001/002. |
| Local behavior | Both envelope and capability payload pass identifiable schemas before structured consumption; required structured fields cannot be inferred from text; invalid input yields `CONTRACT_INVALID` without approval, checkpoint, or effect. |
| Canonical local identities | `exec-envelope@1.0.0` and `exec-capability-payload@1.0.0` are ticket-owned schema references. `ExecutionId`, `ActivityId`, `AgentAssignmentId`, `ArtifactCycleId`, and `AttemptId` are DOM-owned references carried opaquely, not created or resolved here. SPEC §12 and DOM-ID-001 boundary apply. |
| Foreign owners | DOM owns domain identity, revision, snapshot and lifecycle; PLAT owns physical persistence, integrity, effects and recovery; EXEC-002 owns session/context; REPO owns configuration and enablement; BACKEND owns transport/application mapping; OPS/UI project only. SPEC-EXEC-001 §§2, 10, 19, 20; ADR-0001, ADR-0006. |
| Immutability | Schema definitions and returned contract/failure values are immutable in this unit. No durable history or revision lineage is created. ADR-0003 and ticket/design persistence exclusions. |
| Lineage | No local aggregate, predecessor/successor, persisted revision, replay, or source lineage is introduced. DOM identifiers are references only. |
| Legacy authority | `NEW_CANONICAL_PATH`; prototype and historical shapes are non-authoritative and are not imported or silently converted. SPEC §17; ticket §§10, 21. |
| Cutover | No destructive retirement is required. New schema authority is introduced without a legacy EXEC writer. Incompatible future bases belong to later version/basis owners. |
| Migration authority | Not owned or invoked; no migration or existing-state rewrite exists. ADR-0010 and SPEC-EXEC-001 §7. |
| Security boundary | Not applicable to this ticket. SPEC-EXEC-001 §20 allocates authentication/authorization to BACKEND/DOM and this implementation adds no authorization path. |
| Does not implement | Registry/version resolution, DOM identity/lifecycle, persistence/recovery, runtime/session execution, external effects, transport, UI/OPS mappings, and downstream integrated conformance (ticket §10; design §§7, 16). |

## 3. Applicability matrix

| Dimension | Classification | Audit basis and result |
|---|---|---|
| OWNERSHIP | REQUIRED | New production contract authority is added. Local schema shape and validation result remain EXEC-owned, with one authority-issuance escape reported below. |
| CANONICAL_AUTHORITY | REQUIRED | The ticket creates the canonical schema-validation boundary and must not permit text, prototype, caller schema, or an unvalidated adapter to become authority. |
| CROSS_SPEC_INTEGRATION | AFFECTED | No foreign capability is needed for local closure, but DOM-owned IDs are transported and downstream consumers receive this contract. The boundary is preserved; integrated productive availability is not claimed. |
| IDENTITY | AFFECTED | Schema references are locally canonical; DOM identity values cross the envelope boundary. No ID is generated or normalized. |
| IMMUTABILITY | REQUIRED | Returned schema definitions, validated values, and failure evidence must not be mutable after validation. |
| LINEAGE | NOT_APPLICABLE | No aggregate/entity, persisted record, predecessor/successor relation, historical replay, or local revision is created by this ticket. |
| LEGACY_TRANSITION | AFFECTED | The ticket declares a new canonical path and must prevent prototype/text/historical formats from becoming alternate authority. No legacy EXEC writer exists. |
| DESTRUCTIVE_TRANSITION | NOT_APPLICABLE | No writer retirement, destructive migration, irreversible data transition, or replacement cutover is performed. |
| MIGRATION_AUTHORITY | NOT_APPLICABLE | No migration logic, state conversion, or existing persisted material is read or rewritten. |
| SECURITY_AUTHORIZATION | NOT_APPLICABLE | The accepted SPEC explicitly allocates security to other owners and this boundary has no authentication, authorization, or secret path. |

## 4. Ownership and canonical-authority audit

### Ownership result

```text
OWNERSHIP_RESULT = OWNERSHIP_LEAKAGE
FOREIGN_CAPABILITY_DUPLICATED = 0
AUTHORITY_RECOMPUTED_LOCALLY = 0
REPOSITORY_SEMANTIC_AUTHORITY = NO
```

The implementation correctly places schema definitions, semantic structured
values, the application orchestration boundary, and schema-engine mechanics in
separate local roles. It does not create DOM lifecycle, registry, persistence,
transport, or projection state. `SchemaReference` does not create a DOM ID;
opaque identity fields are preserved as supplied references.

There is one ownership leak: `src/domain/exec-validation-evidence-internal.ts`
exports `issueSchemaValidationEvidence` at line 10, even though its comment
says the adapter is the only issuer. This is an authority capability, not a
mere diagnostic helper. The exported function can be imported by arbitrary
production code and used to mint accepted validation evidence.

### Canonical-authority result

```text
AUTHORITY_RESULT = ALTERNATE_AUTHORITY_INTRODUCED
DUAL_AUTHORITY = NO (no second schema document owner)
PROJECTION_USED_AS_AUTHORITY = NO
```

The normal path is correctly ordered:

```text
ExecContractSchemaDefinitions
  -> JsonSchemaExecValidator / ExecSchemaValidationPort
  -> opaque validation evidence
  -> StructuredExecutionEnvelope/StructuredCapabilityPayload
  -> ValidatedExecContract
```

However, the evidence issuer is exported from the domain source tree. A direct
runtime simulation imported that function, issued evidence for an input never
passed through JSON Schema validation, and successfully constructed a
`StructuredExecutionEnvelope`. A second simulation injected a custom
`ExecSchemaValidationPort` using the exported issuer and returned `VALID` from
`ValidateExecContract`. This creates an alternate path to the same canonical
validated value and violates the fail-closed authority boundary.

No foreign lifecycle or canonical write path was found in the equivalent
composition, application, adapter, or value-object paths. The issue is one
systemic boundary location with related locations listed in the finding.

## 5. Cross-spec and authority-consumption audit

### Cross-spec result

```text
CROSS_SPEC_RESULT = CROSS_SPEC_CONFORMANT
FOREIGN_OWNER_CHANGED = NO
FOREIGN_BEHAVIOR_DUPLICATED = NO
OWNER_OUTCOME_RECOMPUTED = NO
INTEGRATION_NOT_PROVEN = NO local blocker; productive foreign integration is intentionally downstream
```

The production import graph for this unit stays within `src` except for the
TypeBox schema-engine dependency in the infrastructure adapter. It does not
import DOM, PLAT, REPO, `.pi`, or `prototype`. The generic delegation runtime
is used only by a direct regression test and is not promoted to schema
authority.

### AUTHORITY_CONSUMPTION_PROOF

```text
CAPABILITY_ID = UNIT-EXEC-SCHEMA-HARNESS
AUTHORITY_EXISTENCE = YES; ADR-0003/O-016 and EXEC-ENVELOPE-001/002
TRUTH_OWNER = SPEC-EXEC-001 / EXEC-001
AUTHORITY_SEMANTIC_SOURCE = ticket-owned identifiable envelope/payload schemas
OWNER_DOMAIN_OR_BOUNDED_CONTEXT = EXEC-001
CONSUMPTION_CONTRACT = both schema results plus structured minimum fields
PORT_INTERFACE_QUERY_RESOLVER_OR_READER = ExecSchemaValidationPort
CONTRACT_PRODUCER = ticket-owned definitions and JsonSchemaExecValidator
CONTRACT_CONSUMER = ValidateExecContract and later EXEC consumers
RETURNED_DATA = schema-valid envelope/payload and structured validation result
VERSION_REVISION_TRANSPORT = schema ID/version 1.0.0; contractVersion is carried in the envelope
FAILURE_NOT_FOUND_STALE_SEMANTICS = invalid/malformed schema result fails CONTRACT_INVALID; no partial pair
AUTHORITY_STATUS = DEFINED
CONTRACT_STATUS = DEFINED
SEMANTIC_STATUS = DEFINED
LOCAL_TESTABILITY = YES
PRODUCTIVE_AVAILABILITY = NO for the declared local harness capability; it is not a foreign producer
CAPABILITY_SUMMARY_STATUS = CONTRACT_TESTABLE_LOCALLY
DEPENDENCY_CLASS = INFORMATIONAL
AVAILABILITY_EVIDENCE = direct productive-boundary tests at the consumer execution point
BLOCKING_EFFECT = NONE
RESULT = local authority consumption complete; no foreign productive capability is required
```

`PRODUCTIVE_AVAILABILITY = NO` is not promoted to YES by the fixture or test
adapter. Because the capability is `INFORMATIONAL` and local schema semantics
are directly executable, there is no authority-consumption gap blocking this
ticket.

### PRODUCER_CONSUMER_CONTRACT_PROOF

```text
CAPABILITY_ID = UNIT-EXEC-SCHEMA-HARNESS
AUTHORITY_OWNER = SPEC-EXEC-001 / EXEC-001
PRODUCER = ExecContractSchemaDefinitions + JsonSchemaExecValidator
PRODUCED_CONTRACT = identifiable envelope/payload validation result with explicit structured fields
CONSUMER = ValidateExecContract
CONSUMED_CAPABILITY = two validated schema results and contract values
SEMANTIC_STATUS = DEFINED
LOCAL_TESTABILITY = YES
PRODUCTIVE_AVAILABILITY = NO for an external/integrated producer; local productive adapter exists
AVAILABILITY_EVIDENCE = focused direct contract suite and strict typecheck
AVAILABILITY_CONDITION = local contract boundary is executable at closure
DEPENDENCY_CLASS = INFORMATIONAL
DEPENDENCY_EDGE = local schema contract -> EXEC consumers
BLOCKING_EFFECT = NONE
PROOF_RESULT = PRODUCER_CONSUMER_CONFORMANT, subject to the authority-issuer finding
```

## 6. Identity, immutability, and lineage audit

### Identity

```text
IDENTITY_RESULT = CONFORMANT
```

`EXEC_ENVELOPE_SCHEMA_REFERENCE` and `EXEC_PAYLOAD_SCHEMA_REFERENCE` are
canonical, frozen, ticket-owned references. Domain factories require the exact
canonical reference object and matching structured `schemaId`/`schemaVersion`;
custom schema references and custom schema documents are rejected. The
execution/activity/assignment/cycle/attempt values are opaque strings carried
without trimming or regeneration, so this unit does not replace DOM identity
with a display label or mutable field. DOM resolution and lifecycle semantics
remain outside this ticket. No accidental ID generation or identity
substitution was found.

### Immutability

```text
IMMUTABILITY_RESULT = CONFORMANT
```

Schema documents and definitions are deeply frozen. Validated envelope and
payload values clone/freeze structured data; the pair and failure values are
frozen. The test suite directly exercises mutation rejection and nested
structured values. No current-state convenience object rewrites historical
records because no durable record exists in scope.

### Lineage and reconstruction

```text
LINEAGE_RESULT = NOT_APPLICABLE
RECONSTRUCTION_CONTRACT = NOT_APPLICABLE
```

This unit does not persist or rehydrate an aggregate/entity and introduces no
revision progression, predecessor/successor, digest lineage, or historical
basis. A schema-valid raw object is materialized only as an in-memory contract
value after validation; this is not persistence reconstruction. The DOM IDs
inside the envelope remain foreign references and are not resolved here.

## 7. Legacy, cutover, destructive transition, migration, and security

### Legacy/cutover

```text
LEGACY_RESULT = TRANSITION_CONFORMANT
PRESERVE_LEGACY_READS = NOT_APPLICABLE; no legacy EXEC authority/read path
RETIRE_LEGACY_WRITES = NOT_APPLICABLE; no legacy EXEC writer exists
REMOVE_ALTERNATE_AUTHORITY = FAILED by the exported evidence issuer
ADD_COMPATIBILITY_MAPPING = NOT_APPLICABLE; no legacy conversion is defined
MIGRATE_EXISTING_STATE = NOT_APPLICABLE; no persisted state exists
```

The implementation does not import prototype or `.pi` code, and human text is
ignored. The authority leak is a new alternate issuance path, not a legacy
compatibility path, and is therefore counted in the critical finding rather
than as a legacy-writer violation.

### Destructive transition

```text
REPLACEMENT_PROVEN = NOT_APPLICABLE; no destructive replacement
CUTOVER_AUTHORIZED = NOT_APPLICABLE; no irreversible cutover
PRE_TRANSITION_GATES_SATISFIED = NOT_APPLICABLE
POST_TRANSITION_GUARDS_PRESENT = NOT_APPLICABLE
ROLLBACK_OR_ROLL_FORWARD_SEMANTICS_DEFINED = NOT_APPLICABLE
```

### Migration and authorization

```text
MIGRATION_RESULT = MIGRATION_AUTHORITY_PRESERVED (no migration in scope)
AUTHORIZATION_RESULT = NOT_APPLICABLE
```

No migration authority or authorization boundary is implemented. Backend and
DOM remain the owners of those concerns under SPEC-EXEC-001 §20 and ADR-0010.

## 8. Temporal and caller-authority checks

```text
TEMPORAL_AUTHORITY_PROOF = NOT_APPLICABLE
TEMPORAL_AUTHORITY_GAPS = 0
CALLER_AS_AUTHORITY_CHECK = FAIL
CALLER_SUPPLIED_AUTHORITY_BYPASS = 1
```

There is no observe-then-effect operation, external mutable authority, CAS,
persistence, or effect commit in this unit. The schema input itself is
validated synchronously and no external effect follows it.

Caller-supplied `schemaId`, `schemaVersion`, custom schema documents, human
text, and an always-true port without evidence are correctly rejected. The
caller-authority check fails because the caller can import the exported
`issueSchemaValidationEvidence`, create an evidence object that the internal
WeakSet accepts, and then obtain a valid structured contract without schema
validation. This is the same authority bypass as ARCH-CRITICAL-001.

## 9. Architecture scope and executable guards

```text
IMPLEMENTATION_DETAIL = TypeBox selection, module placement, deep-freeze strategy,
                         value-object classes and composition-root naming
AUTHORIZED_ARCHITECTURAL_REALIZATION = domain-facing schema port, ticket-owned
                                         immutable definitions, infrastructure adapter,
                                         fail-closed application orchestration
UNAUTHORIZED_ARCHITECTURAL_EXPANSION = exported validation-evidence issuer
ARCHITECTURE_DECISION_REQUIRED = NO
ARCHITECTURAL_AUTHORITY_GAP_DISCOVERED = NO
```

The required architecture tests were executed through the focused ticket suite
(20/20 pass), including:

1. caller-selected schema authority rejection;
2. custom schema-document substitution rejection;
3. always-true/unproven adapter rejection;
4. public factory/receipt-authority rejection;
5. forged evidence and runtime-created reference rejection;
6. productive import-graph and forbidden dependency guard; and
7. generic delegation consumer rejection of text-only canonical completion.

The package regression also passed 24/24 and the focused strict TypeScript
check passed. These tests prove the intended paths, but none attempts to import
the supposedly internal evidence issuer and prove that only the canonical
adapter can issue evidence. Therefore:

```text
MISSING_ARCHITECTURE_GUARDS = 1
ARCHITECTURE_GUARD_TESTS_RUN = 7
ARCHITECTURE_GUARD_EVIDENCE = focused suite tests listed above; direct runtime
                             simulation demonstrated exported issuer can mint
                             accepted evidence and produce VALID output
```

## 10. Finding

### ARCH-CRITICAL-001 — Exported internal evidence issuer permits unvalidated authority

```text
Severity = CRITICAL
Ticket = EXEC-001-TICKET-001
Normative authority = ADR-0003 Decisão; SPEC-EXEC-001 EXEC-ENVELOPE-001/002,
                      §§11, 13, 20–22; ticket §§9–10, 15, 18; design §§9, 13,
                      17, 20–22
Owner = SPEC-EXEC-001 / EXEC-001 / CANONICAL_OWNER
Affected boundary = src/domain/exec-validation-evidence-internal.ts ->
                    StructuredExecutionEnvelope/StructuredCapabilityPayload ->
                    ValidateExecContract / ExecSchemaValidationPort
Repository evidence = src/domain/exec-validation-evidence-internal.ts:10-21
                       exports issueSchemaValidationEvidence; the function adds
                       caller-provided evidence to the module WeakSet. The
                       domain factories at src/domain/exec-contract.ts:400-401
                       and :448-449 accept any evidence recognized by that set.
                       ValidateExecContract accepts an injected port at
                       src/application/exec-contract.ts:80. JsonSchemaExecValidator
                       is the intended issuer at
                       src/infrastructure/exec-schema-validator.ts:40.
Problem = The implementation comment says the adapter is the only issuer, but
          the issuer is an importable production export. A caller can call it
          for an unvalidated object, pass the result to a domain factory, or
          inject a port that returns it.
Observed proof = An isolated runtime import of the exported function issued
                 evidence for a raw envelope and StructuredExecutionEnvelope
                 construction returned successfully. A second isolated runtime
                 used a custom port calling the exported function and
                 ValidateExecContract returned VALID for unvalidated input.
Impact = A caller can replace canonical schema validation with caller-created
         evidence. This introduces an alternate validation authority and can
         make malformed/unvalidated data a ValidatedExecContract, defeating
         fail-closed CONTRACT_INVALID semantics and the ticket's no-text/no-
         unproven-adapter authority boundary. Downstream consumers could treat
         the forged value as structured contract authority.
Minimum correction required = Make evidence issuance inaccessible to arbitrary
                              callers and retain it only behind the authorized
                              schema-validation adapter boundary (or an equally
                              authority-preserving closed capability). Add an
                              executable architecture guard that attempts the
                              forbidden issuance/injection route and asserts
                              that it cannot yield a valid contract.
Systemic pattern = NO
Related locations = src/domain/exec-validation-evidence-internal.ts:10-21;
                   src/domain/exec-contract.ts:309-320, 392-401, 440-449;
                   src/application/exec-contract.ts:76-101;
                   src/infrastructure/exec-schema-validator.ts:8-42;
                   tests/exec-001-ticket-001.test.ts authority/forged-evidence
                   guards (which do not import the exported issuer)
```

## 11. Specialist summary

Audit: docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-001-architecture-audit.md

Specialist:
ARCHITECTURE_BOUNDARIES

Ticket: EXEC-001-TICKET-001

Ownership errors: 1

Foreign capability duplication: 0

Authority violations: 1

Identity violations: 0

Immutability/lineage violations: 0

Legacy authority violations: 0

Architectural authority gaps: 0
Authority consumption gaps: 0
Producer/consumer contract errors: 0
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

AUDIT_TARGET_HEAD: 381218d5fbf8d969ee5ae5349b8f65c4cd5af7f9
AUDIT_TARGET_STATE_FINGERPRINT: 2e77021139ed96e08980a98b792164c6b9ce2c5f86043b0fcad3f9dbda1c2db8
DOMAIN_AUDIT_COMPLETE: YES
SPECIALIST_RESULT: SPECIALIST_ARCHITECTURE_FINDINGS