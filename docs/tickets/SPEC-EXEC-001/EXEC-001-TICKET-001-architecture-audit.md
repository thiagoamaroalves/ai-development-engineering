# EXEC-001-TICKET-001 — Architecture Boundaries Audit

## 1. Audit identity and basis

```text
Audit mode = READ_ONLY INDEPENDENT ADVERSARIAL ARCHITECTURE_FIRST
             OWNERSHIP_PRESERVING AUTHORITY_PRESERVING CROSS_SPEC_AWARE
             IDENTITY_AWARE LEGACY_TRANSITION_AWARE
Ticket = EXEC-001-TICKET-001
Ticket path = docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-001-envelope-schema-contract.md
Implementation design = docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-001-implementation-design.md
Ticket-set audit = docs/tickets/SPEC-EXEC-001/implementation-ticket-audit.md
Ticket status = VALIDATION_REQUIRED
Implementation unit = EXEC-IMP-01 — Envelope and schema contract
Implementation baseline = 381218d5fbf8d969ee5ae5349b8f65c4cd5af7f9 (design/ticket baseline)
AUDIT_TARGET_HEAD = 2306d92defaf315c5b3daf7639164445fc5dc281
CURRENT_HEAD = 2306d92defaf315c5b3daf7639164445fc5dc281
AUDIT_TARGET_STATE_FINGERPRINT = badcdee7af12b3df3c97732d2eb79e8bb73d3b69f9b8c024ff06fbe154f113f9
```

The target commit is checked out. The working tree had pre-existing
working-tree modifications to separate specialist audit artifacts; they are not
part of this semantic implementation subject and were not changed by this
audit. No production, test, ticket, authority, planning, Git, branch, commit,
remote, or publication state was changed.

### Actual implementation surfaces audited

- `src/domain/exec-contract.ts`
- `src/domain/exec-schema.ts`
- `src/domain/exec-validation-evidence-internal.ts`
- `src/application/exec-contract.ts`
- `src/infrastructure/exec-schema-validator.ts`
- `src/composition/exec-contract.ts`
- `tests/exec-001-ticket-001.test.ts`
- `docs/tickets/SPEC-EXEC-001/evidence/TICKET-001/AC-EXEC-001-envelope-schema.md`
- `docs/tickets/SPEC-EXEC-001/evidence/TICKET-001/AC-EXEC-001-structured-consumption.md`
- `docs/tickets/SPEC-EXEC-001/evidence/TICKET-001/AC-EXEC-002-required-fields.md`
- `docs/tickets/SPEC-EXEC-001/evidence/TICKET-001/AC-EXEC-002-fail-closed.md`

The ticket's declared changed-file list was independently compared with these
surfaces; its stale file-name/count bookkeeping is recorded as
`ARCH-MINOR-001` below.

### Evidence executed during this audit

- Focused ticket suite: `node --experimental-strip-types --test tests/exec-001-ticket-001.test.ts` — 20/20 passed.
- Repository regression: `npm test` — 25/25 passed.
- Focused strict typecheck over touched production/test modules — passed.
- Package typecheck: `npm run typecheck` — passed; its configured scope does not include this ticket source.
- Adversarial architecture probe: direct import and invocation of the exported `registerIssuedSchemaValidationEvidence` hook accepted forged evidence and a schema-invalid inherited-field input. This probe produced `SCHEMA_INVALID_INHERITED_INPUT_ACCEPTED e ['schemaId', 'schemaVersion']`.

## 2. Source precedence and reconstructed architectural contract

Authority was applied in this order:

```text
Accepted ADR authority
↓ Canonical portfolio ownership/dependency contracts
↓ Explicit cross-spec ownership contracts
↓ Conformant SPEC-EXEC-001 and SPEC-DOM-001
↓ Validated Gap Matrix
↓ Implementation Plan and approved Design
↓ Ticket
↓ Repository implementation and tests
```

### Local owner and authority

- `SPEC-EXEC-001 / EXEC-001` is the canonical owner of O-016 and the local
  envelope/payload contract shape, identifiable JSON Schemas, structured
  minimum fields, and fail-closed contract validation result.
- Primary authority: `docs/adrs/ADR-0003-versioned-skill-contracts.md`,
  `Decisão`; `docs/specs/SPEC-PORTFOLIO-001-organization.md`, O-016;
  `docs/specs/SPEC-EXEC-001-skill-contracts-and-capability-registry.md`,
  `EXEC-ENVELOPE-001` and `EXEC-ENVELOPE-002`.
- The approved Design §§6, 9, 13, 17, and 20 authorize a schema-mechanics
  port, immutable structured values, canonical schema definitions, and a
  fail-closed application boundary. They do not authorize a second schema
  authority or caller-mintable validation proof.

### Foreign owners and capabilities

- DOM owns `ExecutionId`, `ActivityId`, `AttemptId`, `AgentId`,
  `ArtifactCycleId`, lifecycle, snapshot, verdict progression, and domain
  identity semantics (`SPEC-DOM-001`, `DOM-ID-001`, `DOM-SNAPSHOT-001`).
  This ticket may carry those values opaquely but must not create, resolve,
  normalize, or transition them.
- EXEC-001's registry/version resolution, manifest, checkpoint, and failure
  consumers are downstream ticket boundaries and are not implemented here.
- PLAT owns persistence, physical integrity, journal/outbox, effects, and
  recovery. BACKEND/OPS/UI map or project the result and do not own its
  meaning.
- No foreign capability is required for local closure. `typebox` is a
  technical schema-engine dependency behind the port, not a foreign domain
  authority. The `.pi` generic delegation surface is regression evidence only.

### Canonical identities and aliases

- `SchemaReference` (`SchemaId` plus semantic schema version) is the local
  contract identity owned by EXEC-001. The implementation correctly requires
  the exact ticket-owned reference instance for envelope and payload values.
- DOM IDs in the envelope are opaque references and are neither generated nor
  regenerated by this ticket. Labels, text, transport values, and prototype
  shapes are not identity authority.
- Human text is descriptive only. Requested effects are structured requested
  data, not effect confirmation or authorization.

### Immutability and lineage

- Schema definitions, references, evidence instances, validated values, and
  failure values are intended to be immutable. Input values are copied into
  frozen structured values.
- This unit creates no aggregate, persisted revision, manifest, history,
  reconstruction path, predecessor/successor chain, or durable lineage.
  Identity/lineage of the opaque DOM fields remains foreign and is not inferred
  locally.

### Legacy, cutover, migration, and security rules

- Compatibility class is `NEW_CANONICAL_PATH`: prototype, text-only, and
  historical shapes remain non-authoritative and are not silently converted.
  There is no legacy EXEC writer to retire and no alternate legacy authority
  to preserve.
- No destructive transition, migration, persistence recovery, authorization
  route, or external-effect execution is in scope. This boundary must not turn
  token presence, caller text, or a requested effect into approval.

### Does not implement

DOM identity/lifecycle or snapshot authority; registry/version resolution;
manifest persistence/reconstruction; runtime/session execution; external
intent/effect/confirmation; transport; UI/OPS/BACKEND mappings; or migration.

## 3. Applicability matrix

| Dimension | Classification | Evidence/reason |
|---|---|---|
| OWNERSHIP | REQUIRED | Production code establishes a new EXEC contract boundary and must not absorb DOM, registry, persistence, or mapping ownership. |
| CANONICAL_AUTHORITY | REQUIRED | The result is consumable only after the ticket-owned identifiable schemas validate both inputs. |
| CROSS_SPEC_INTEGRATION | AFFECTED | Downstream consumers and the generic delegation regression seam must receive structured results without gaining authority; no foreign producer is required locally. |
| IDENTITY | AFFECTED | Schema references are local canonical identities; DOM identity fields must remain opaque and intact. |
| IMMUTABILITY | REQUIRED | Returned contract values, schema definitions, references, and failures must not be mutable authority. |
| LINEAGE | NOT_APPLICABLE | No persisted aggregate, historical record, revision chain, manifest, predecessor, or reconstruction is created by this unit. |
| LEGACY_TRANSITION | AFFECTED | The ticket declares a new canonical path and excludes prototype/text formats from authority. |
| DESTRUCTIVE_TRANSITION | NOT_APPLICABLE | No writer retirement, deletion, irreversible migration, or lifecycle transition occurs. |
| MIGRATION_AUTHORITY | NOT_APPLICABLE | No migration or state conversion is implemented. |
| SECURITY_AUTHORIZATION | NOT_APPLICABLE | This unit validates a contract only; it does not authenticate, authorize domain actions, or execute effects. |

## 4. Architecture audit results

### Ownership and canonical authority

Intended component ownership is preserved: `ExecContractSchemaDefinitions`
owns the two local schemas, the domain values own structured completeness and
immutability, the application coordinates the pair, and the infrastructure
adapter owns JSON-Schema mechanics. No foreign lifecycle, registry, persistence,
or effect authority was duplicated.

However, the evidence handoff introduces an alternate authority path. The
exported `registerIssuedSchemaValidationEvidence` function in
`src/domain/exec-validation-evidence-internal.ts:15-18` accepts any object and
adds it to the recognition `WeakSet`. `src/domain/exec-contract.ts:309-323`
then treats membership plus caller-visible fields as proof of successful schema
validation. Therefore an arbitrary consumer can mint accepted schema evidence
without invoking the canonical adapter. Overall classifications:

```text
OWNERSHIP = OWNERSHIP_PRESERVED for domain ownership, with evidence-boundary leakage
CANONICAL_AUTHORITY = ALTERNATE_AUTHORITY_INTRODUCED
FOREIGN_CAPABILITY_DUPLICATED = 0
AUTHORITY_RECOMPUTED_LOCALLY = NO
REPOSITORY_SEMANTIC_AUTHORITY = NO
```

The canonical schema documents and schema reference identity checks are strong:
`isCanonicalExecSchemaDefinition` uses canonical object identity and the value
factories use exact canonical `SchemaReference` instances. Those checks do not
close the exported evidence-registration route.

### Cross-spec integration

No foreign capability is consumed for local closure, so there is no foreign
producer duplication or foreign outcome recomputation. The local producer/
consumer record is:

```text
AUTHORITY_CONSUMPTION_PROOF
CAPABILITY_ID = UNIT-EXEC-SCHEMA-HARNESS
AUTHORITY_EXISTENCE = ADR-0003/O-016 and EXEC-ENVELOPE-001/002
TRUTH_OWNER = SPEC-EXEC-001 / EXEC-001
AUTHORITY_SEMANTIC_SOURCE = ticket-owned identifiable envelope/payload schemas
OWNER_DOMAIN_OR_BOUNDED_CONTEXT = EXEC-001 contract boundary
CONSUMPTION_CONTRACT = ValidateExecContract → ValidatedExecContract or CONTRACT_INVALID
PORT_INTERFACE_QUERY_RESOLVER_OR_READER = ExecSchemaValidationPort
CONTRACT_PRODUCER = ticket-owned schema definitions and validation adapter
CONTRACT_CONSUMER = ValidateExecContract and later EXEC consumers
RETURNED_DATA = structured envelope/payload and schema references, or fail-closed result
VERSION_REVISION_TRANSPORT = schema references carry exec-envelope@1.0.0 and exec-capability-payload@1.0.0
FAILURE_NOT_FOUND_STALE_SEMANTICS = malformed/unidentifiable input fails CONTRACT_INVALID; no text fallback
AUTHORITY_STATUS = DEFINED
CONTRACT_STATUS = DEFINED
SEMANTIC_STATUS = DEFINED
LOCAL_TESTABILITY = YES
PRODUCTIVE_AVAILABILITY = NO for the ticket-owned fixture record; no foreign
  productive producer is required by its INFORMATIONAL dependency class
CAPABILITY_SUMMARY_STATUS = CONTRACT_TESTABLE_LOCALLY
DEPENDENCY_CLASS = INFORMATIONAL
AVAILABILITY_EVIDENCE = focused direct schema operations and 20/20 ticket tests
BLOCKING_EFFECT = NONE
PROOF_EVIDENCE = ADR-0003; SPEC-EXEC-001 O-016/EXEC-ENVELOPE-001/002; ticket §14a–14c
RESULT = local contract authority defined and testable; no foreign productive
  availability is required or promoted

PRODUCER_CONSUMER_CONTRACT_PROOF
CAPABILITY_ID = UNIT-EXEC-SCHEMA-HARNESS
AUTHORITY_OWNER = SPEC-EXEC-001 / EXEC-001
PRODUCER = ticket-owned schema definitions and validation adapter
PRODUCED_CONTRACT = identifiable envelope/payload validation result with structured fields
CONSUMER = ValidateExecContract and later EXEC consumers
CONSUMED_CAPABILITY = structured validated envelope/payload
SEMANTIC_STATUS = DEFINED
LOCAL_TESTABILITY = YES
PRODUCTIVE_AVAILABILITY = NO for the fixture record; this is not a foreign producer
CAPABILITY_SUMMARY_STATUS = CONTRACT_TESTABLE_LOCALLY
AVAILABILITY_EVIDENCE = direct positive/negative schema operations at the consumer point
AVAILABILITY_CONDITION = unit-owned schema harness executable at local closure
DEPENDENCY_CLASS = INFORMATIONAL
DEPENDENCY_EDGE = local schema contract → EXEC consumers
BLOCKING_EFFECT = NONE
PROOF_EVIDENCE = ticket §14b–14c; Design §7/16/20; focused execution evidence
```

This is not accepted as evidence of foreign productive availability, but it
also does not block local closure. The local boundary is
`CROSS_SPEC_CONFORMANT` for its declared scope; integrated downstream mapping
remains a later proof.

### Identity

`CONFORMANT` for the applicable local identity behavior. Schema references are
canonical and stable; raw DOM-looking IDs are preserved as opaque values and
not regenerated or inferred from display text. No local aggregate identity is
created. The forged evidence defect is an authority/provenance defect, not an
observed DOM identity substitution.

### Immutability

`CONFORMANT` for returned values and definitions. Schema documents, references,
validated envelope/payload values, structured copies, and failures are frozen;
structured inputs are copied rather than exposed as mutable authority. The
forged evidence route can admit an unfrozen receipt, so it violates proof
provenance but does not mutate the returned validated value after construction.

### Lineage and reconstruction

`NOT_APPLICABLE`. There is no persistence, rehydration, manifest, revision
history, predecessor/successor relation, or historical replay in this ticket.
The ticket correctly leaves those rules to later EXEC/DOM/PLAT boundaries.

### Legacy and cutover

`TRANSITION_CONFORMANT` in intended behavior. The productive composition path
uses the new ticket-owned schemas; human text and prototype shapes are not
fallback authority. The generic consumer regression test confirms that text-
only output does not become canonical completion/effect. No legacy writer or
dual cutover writer was found.

### Destructive-transition safety

`NOT_APPLICABLE` because this unit performs no destructive transition:

```text
REPLACEMENT_PROVEN = NOT_APPLICABLE
CUTOVER_AUTHORIZED = NOT_APPLICABLE
PRE_TRANSITION_GATES_SATISFIED = NOT_APPLICABLE
POST_TRANSITION_GUARDS_PRESENT = NOT_APPLICABLE
ROLLBACK_OR_ROLL_FORWARD_SEMANTICS_DEFINED = NOT_APPLICABLE
```

### Migration and authorization

```text
MIGRATION_AUTHORITY = NOT_APPLICABLE
SECURITY_AUTHORIZATION = NOT_APPLICABLE; no execution or authorization path
```

No migration invents authority. No backend authorization path is bypassed,
and no capability possession or schema-valid requested effect is treated as
permission to execute an effect.

### Architectural scope

- Schema-engine selection behind `ExecSchemaValidationPort`, immutable value
  objects, and composition-root wiring are `AUTHORIZED_ARCHITECTURAL_REALIZATION`.
- Embedded schema-document representation is an implementation detail left
  unfrozen by the Design.
- The exported evidence-registration hook is
  `UNAUTHORIZED_ARCHITECTURAL_EXPANSION` because it exposes a second way to
  establish the authority that the canonical adapter is supposed to own.
- `ARCHITECTURAL_AUTHORITY_GAP_DISCOVERED = NO`: accepted authority is
  sufficient; the defect is implementation conformance, not a missing decision.

## 5. Authority-completeness checks

### Caller-as-authority check

```text
CALLER_AS_AUTHORITY_CHECK = FAIL
CALLER_SUPPLIED_AUTHORITY_BYPASS = 1
```

Human text, schema IDs, and raw fields are correctly treated as untrusted. The
bypass is the caller's ability to import the internal module, register a
lookalike receipt, and thereby replace canonical schema-engine evidence.

### Temporal authority proof

```text
TEMPORAL_AUTHORITY_PROOF = NOT_APPLICABLE
TEMPORAL_AUTHORITY_GAPS = 0
```

The operation has no observe-mutable-authority-then-commit-effect sequence.
The evidence defect is an issuer/authority-boundary defect, not a temporal
revalidation claim.

### Aggregate identity/reconstruction proofs

```text
AGGREGATE_IDENTITY_PROOF = NOT_APPLICABLE; no aggregate or entity introduced
AGGREGATE_RECONSTRUCTION_PROOF = NOT_APPLICABLE; no persisted material restored
```

## 6. Architecture guards and systemic boundary expansion

The focused suite ran nine architecture-oriented guards covering caller schema
substitution, custom schema substitution, unproven/forged adapters, runtime
constructor bypasses, evidence/prototype checks, the productive import graph,
and the generic text-only consumer. The guards passed for their exercised
conditions. The additional direct adversarial probe exercised the actual
exported registration hook and demonstrated acceptance of schema-invalid
inherited fields.

```text
MISSING_ARCHITECTURE_GUARDS = 1
ARCHITECTURE_GUARD_TESTS_RUN = 9
ARCHITECTURE_GUARD_EVIDENCE = focused 20/20 suite plus direct exported-hook
  probe; existing guard does not assert that the registration hook is
  uncallable by a consumer and the direct probe succeeds
```

The affected-radius check covered both domain factories, the application
aggregation path, the adapter issuer, canonical schema/reference checks, the
composition root, and the productive import graph. No equivalent route was
found in `.pi`, prototype, registry, persistence, migration, worker, legacy,
or downstream mapping paths. The same root cause is systemic within the
schema-evidence handoff: one exported issuer allows both envelope and payload
factories to accept forged proof.

## 7. Findings

### ARCH-CRITICAL-001 — Exported evidence registrar creates an alternate schema authority

```text
Severity = CRITICAL
Ticket = EXEC-001-TICKET-001
Normative authority = ADR-0003 / Decisão; Portfolio O-016; SPEC-EXEC-001
  EXEC-ENVELOPE-001 and EXEC-ENVELOPE-002; Design §§9, 13, 17 and 20
Owner = SPEC-EXEC-001 / EXEC-001 schema-validation authority boundary
Affected boundary = infrastructure schema adapter → domain evidence handoff →
  StructuredExecutionEnvelope/StructuredCapabilityPayload construction
Repository evidence = src/domain/exec-validation-evidence-internal.ts:15-18
  exports registerIssuedSchemaValidationEvidence and accepts arbitrary objects;
  src/domain/exec-contract.ts:309-323 accepts any registered object with the
  expected visible fields; src/infrastructure/exec-schema-validator.ts:54-64
  calls the registrar. A direct executable probe imported the registrar,
  registered a forged receipt, and constructed an envelope from an input whose
  required fields were inherited rather than own enumerable schema fields.
  The probe output was
  SCHEMA_INVALID_INHERITED_INPUT_ACCEPTED e ['schemaId', 'schemaVersion'].
Problem = A caller can mint membership in the evidence ledger without the
  canonical JSON-Schema engine or adapter issuer. Membership is treated as
  successful validation proof, so the canonical adapter is not the sole
  authority for consumable schema evidence.
Impact = Schema-invalid material can cross the contract boundary as a valid
  structured value. This creates an alternate authority path and defeats the
  ticket's fail-closed and identifiable-schema guarantee; downstream consumers
  may consume a contract whose schema was never authoritatively validated.
Minimum correction required = Remove the externally callable registration/mint
  route and make issuance/recognition unforgeably private to the canonical
  adapter handoff. Preserve the narrow port and canonical schema definitions,
  and add an executable guard that attacks the actual internal registrar and
  proves caller-created evidence cannot be accepted.
Systemic pattern = YES
Related locations = src/domain/exec-validation-evidence-internal.ts:15-18;
  src/infrastructure/exec-schema-validator.ts:54-64, 122-126;
  src/domain/exec-contract.ts:309-323, 389-409, 437-450;
  src/application/exec-contract.ts:98-125;
  tests/exec-001-ticket-001.test.ts architecture-guard coverage
```

### ARCH-MINOR-001 — Ticket implementation inventory does not identify the actual evidence boundary

```text
Severity = MINOR
Ticket = EXEC-001-TICKET-001
Normative authority = ticket/design traceability expectations under the
  approved implementation boundary; ticket §27 and Design §23 are the specific
  implementation-evidence claims audited here
Owner = EXEC-001 ticket implementation-evidence record
Affected boundary = changed-file and completion-evidence traceability for the
  schema-validation authority seam
Repository evidence = ticket §27 lists
  src/domain/exec-validation-authority.ts and
  src/domain/exec-validation-authority-internal.ts, but those paths do not
  exist at AUDIT_TARGET_HEAD. The actual authority support module is
  src/domain/exec-validation-evidence-internal.ts, imported by both the domain
  contract and infrastructure adapter. The ticket records focused 17/17 and
  repository 23/23 tests, while the executable target produced 20/20 focused
  and 25/25 repository tests.
Problem = The implementation inventory and execution counts are stale and can
  cause a reviewer to omit the actual evidence-issuance boundary or rely on
  inaccurate completion accounting.
Impact = Localized architecture evidence and maintainability risk; this does
  not by itself create a second domain owner or change runtime authority.
Minimum correction required = Reconcile the ticket's changed-file list,
  execution counts, and evidence references with the actual target files and
  commands. No architecture redesign is required for this finding.
Systemic pattern = NO
Related locations = ticket §27 Changed files and Test execution;
  Design §23 Files Expected to Change; src/domain/exec-validation-evidence-
  internal.ts; tests/exec-001-ticket-001.test.ts
```

## 8. Summary

Audit: docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-001-architecture-audit.md

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
Authority consumption gaps: 0
Producer/consumer contract errors: 0
Temporal authority gaps: 0
Caller-supplied authority bypasses: 1
Missing architecture guards: 1
Architecture guard tests run: 9

Findings:
CRITICAL=1
MAJOR=0
MINOR=1
INFO=0

Domain audit complete:
YES

Specialist result:
SPECIALIST_ARCHITECTURE_FINDINGS

AUDIT_TARGET_HEAD: 2306d92defaf315c5b3daf7639164445fc5dc281
AUDIT_TARGET_STATE_FINGERPRINT: badcdee7af12b3df3c97732d2eb79e8bb73d3b69f9b8c024ff06fbe154f113f9
DOMAIN_AUDIT_COMPLETE: YES
SPECIALIST_RESULT: SPECIALIST_ARCHITECTURE_FINDINGS