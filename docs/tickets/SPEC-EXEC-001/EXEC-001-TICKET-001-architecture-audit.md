# EXEC-001-TICKET-001 — Architecture Boundaries Audit

## 1. Audit identity and basis

```text
AUDIT: READ_ONLY INDEPENDENT ADVERSARIAL ARCHITECTURE_FIRST
      OWNERSHIP_PRESERVING AUTHORITY_PRESERVING CROSS_SPEC_AWARE
      IDENTITY_AWARE LEGACY_TRANSITION_AWARE
TICKET_ID: EXEC-001-TICKET-001
TICKET: docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-001-envelope-schema-contract.md
IMPLEMENTATION_UNIT: EXEC-IMP-01 — Envelope and schema contract
DESIGN: docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-001-implementation-design.md
TICKET_SET_AUDIT: docs/tickets/SPEC-EXEC-001/implementation-ticket-audit.md
IMPLEMENTATION_BASELINE: 381218d5fbf8d969ee5ae5349b8f65c4cd5af7f9
CURRENT_HEAD: 71d73d96d7df69513894736214aa0a36d53a7736
AUDIT_TARGET_HEAD: 71d73d96d7df69513894736214aa0a36d53a7736
AUDIT_TARGET_STATE_FINGERPRINT: 73f7214519ab58d119929dfcd35b539caf2a81361fdf5a17333240cd748d4c03
TICKET_STATUS: VALIDATION_REQUIRED
```

The pinned implementation subject is the source/test state at the target
HEAD. The working tree has documentation-only changes outside the production
and test implementation; no source or test overlay was used. The target
implementation delta contains:

```text
src/application/exec-contract.ts
src/composition/exec-contract.ts
src/domain/exec-contract.ts
src/domain/exec-schema.ts
src/domain/exec-validation-evidence-internal.ts
src/infrastructure/exec-schema-validator.ts
tests/exec-001-ticket-001.test.ts
docs/tickets/SPEC-EXEC-001/evidence/TICKET-001/AC-EXEC-001-envelope-schema.md
docs/tickets/SPEC-EXEC-001/evidence/TICKET-001/AC-EXEC-001-structured-consumption.md
docs/tickets/SPEC-EXEC-001/evidence/TICKET-001/AC-EXEC-002-required-fields.md
docs/tickets/SPEC-EXEC-001/evidence/TICKET-001/AC-EXEC-002-fail-closed.md
```

Evidence executed during this audit:

```text
FOCUSED_TICKET_TEST: PASS (20/20)
REPOSITORY_TEST: PASS (25/25)
FOCUSED_STRICT_TYPECHECK: PASS
ARCHITECTURE_GUARD_TESTS: the ticket's authority-boundary, productive-import-graph,
                          and generic-consumer isolation tests ran as part of 20/20
```

## 2. Reconstructed architectural contract

### Source precedence

```text
ADR-0003 (accepted, revision 3)
  > approved portfolio O-016
  > SPEC-EXEC-001 revision 3 and its conformant audit
  > SPEC-DOM-001 revision 4 for consumed identity/snapshot contracts
  > validated GAP-001 / EXEC-IMP-01
  > approved implementation design
  > ticket
  > repository implementation and tests
```

Relevant authority anchors are `docs/adrs/ADR-0003-versioned-skill-contracts.md`
(Decision and Consequences), `docs/adrs/ADR-0001-workflow-domain-and-identity.md`
(Decision/Invariants), `docs/adrs/ADR-0006-persistence-journal-idempotency-and-recovery.md`
(Decision), `docs/specs/SPEC-EXEC-001-skill-contracts-and-capability-registry.md`
(§§2, 9, 12, 13, 14, 15, 17, 19, 20, 21), and the ticket's
`EXEC-ENVELOPE-001/002`, `AC-EXEC-001/002`, and §§10, 14a–14c, 18, 21.

### Ownership and boundaries

```text
LOCAL_OWNER:
  EXEC-001 / CANONICAL_OWNER

LOCAL_AUTHORITIES:
  identifiable envelope schema;
  identifiable capability-payload schema;
  structured minimum fields;
  schema-validation result and CONTRACT_INVALID fail-closed result;
  non-authority of human text.

FOREIGN_OWNERS:
  DOM-001 — ExecutionId, ActivityId, AttemptId, AgentId, ArtifactCycleId,
            snapshot, lifecycle and canonical domain state;
  PLAT-001 — physical persistence, journal, integrity, recovery and effects;
  REPO-001 — enabled repository configuration and migration/enablement;
  EXEC-002 — session/context application;
  BACKEND/OPS/UI — transport, mapping and projection.

FOREIGN_CAPABILITIES_CONSUMED:
  No foreign capability is required for this ticket's local closure.
  DOM-looking IDs are transported as opaque references only. Downstream
  attachment/identity validation remains with the approved owners.

CANONICAL_IDENTITIES:
  exec-envelope@1.0.0 and exec-capability-payload@1.0.0 are local contract
  schema references. DOM IDs in the envelope are references, not identities
  created or resolved by this ticket.

IMMUTABILITY_RULES:
  Schema definitions, schema references, validated values and failures are
  immutable at the returned contract boundary. No durable history is created.

LINEAGE_RULES:
  No predecessor/successor, aggregate lineage, manifest lineage or replay
  record is introduced by this synchronous validation unit.

LEGACY_AUTHORITY_RULES:
  Prototype, text, .pi and historical shapes are non-authoritative.

CUTOVER_RULES:
  NEW_CANONICAL_PATH only; no legacy EXEC writer or alternate schema authority
  is authorized. Version/basis cutover belongs to later EXEC/DOM boundaries.

MIGRATION_AUTHORITY:
  Not owned or implemented here; REPO owns migration/enablement.

SECURITY_BOUNDARIES:
  No EXEC-001 authentication or authorization obligation is allocated here;
  presence of text, IDs or capability fields is not authorization.

DOES_NOT_IMPLEMENT:
  registry/version resolution, DOM identity/lifecycle, persistence/recovery,
  runtime/session execution, effects, transport, UI/OPS mappings and downstream
  integrated conformance.
```

## 3. Applicability matrix

| Dimension | Classification | Result and reason |
|---|---|---|
| OWNERSHIP | REQUIRED | The new schema/value/application/adapter path must remain EXEC-owned and must not absorb DOM, PLAT or consumer lifecycle. |
| CANONICAL_AUTHORITY | REQUIRED | ADR-0003 requires schema validation before contract consumption and fail-closed results; the implementation must have one authoritative schema path. |
| CROSS_SPEC_INTEGRATION | AFFECTED | The envelope carries foreign-owned identity references and is consumed downstream, but no foreign capability is needed for local closure. |
| IDENTITY | AFFECTED | DOM identity fields are transported and must remain opaque/intact; this ticket creates no DOM identity and performs no attachment resolution. |
| IMMUTABILITY | AFFECTED | Schema definitions and returned validated/failure values must not be mutable; no persisted historical record is introduced. |
| LINEAGE | NOT_APPLICABLE | The unit creates no aggregate, entity, predecessor/successor relation, manifest, revision history or replay material. |
| LEGACY_TRANSITION | AFFECTED | The implementation establishes the new canonical schema path and must not promote prototype/text/.pi formats. |
| DESTRUCTIVE_TRANSITION | NOT_APPLICABLE | No writer, record, catalog, legacy route or authority is deleted or retired by this ticket. |
| MIGRATION_AUTHORITY | NOT_APPLICABLE | No state migration, compatibility migration or enablement operation is implemented. |
| SECURITY_AUTHORIZATION | NOT_APPLICABLE | SPEC-EXEC-001 §20 assigns no authentication/authorization obligation to EXEC-001; this audit still checks that contract validity is not treated as authorization. |

## 4. Architecture audit results

### Ownership and canonical authority

`OWNERSHIP_PRESERVED` for the intended component decomposition:

- `src/domain/exec-schema.ts:24-31, 133-163` owns the two ticket-local schema
  definitions and the narrow validation port.
- `src/domain/exec-contract.ts:326-487` owns structured values, schema
  references and immutable validated-pair construction.
- `src/application/exec-contract.ts:76-129` only sequences the two validations
  and maps failure; it does not own DOM lifecycle, registry resolution or effects.
- `src/infrastructure/exec-schema-validator.ts:1-94` contains the selected
  schema-engine adapter and depends inward on the port.
- `src/composition/exec-contract.ts:1-9` selects the adapter without moving
  schema mechanics into the domain.

There is no local persistence, canonical DOM write, registry writer, effect
confirmation path, foreign lifecycle state, projection-as-authority path or
repository semantic authority. The implementation preserves the intended
`domain -> application -> port -> infrastructure` direction.

However, `ALTERNATE_AUTHORITY_INTRODUCED` exists at the validation-evidence
seam. The exported `recordCanonicalValidationEvidence` function can be called
by arbitrary code with any object implementing `hasValidated`. This is a
canonical schema-authority bypass and is detailed as `ARCH-CRITICAL-001`.

### Cross-spec integration

`CROSS_SPEC_CONFORMANT` for the ticket's declared local boundary. The code does
not resolve or regenerate DOM IDs, interpret lifecycle/status, persist foreign
state, or map a foreign outcome. The opaque reference preservation test at
`tests/exec-001-ticket-001.test.ts:96-115` confirms that local validation does
not normalize or substitute those references. The later DOM/PLAT/consumer
contracts remain downstream.

The ticket's authority/producer-consumer records are preserved without
promoting a fixture to a foreign productive producer:

```text
CAPABILITY_ID = UNIT-EXEC-SCHEMA-HARNESS
AUTHORITY_OWNER = SPEC-EXEC-001 / EXEC-001
PRODUCER = ticket-owned schema definition/validation boundary
CONSUMER = ValidateExecContract and later EXEC consumers
RETURNED_DATA = identifiable schema references, validation evidence and
                structured envelope/payload values
VERSION_TRANSPORT = schemaId/schemaVersion plus contractVersion
FAILURE_SEMANTICS = CONTRACT_INVALID; no success/approval/checkpoint/effect
AUTHORITY_STATUS = DEFINED
CONTRACT_STATUS = DEFINED
LOCAL_TESTABILITY = YES
PRODUCTIVE_AVAILABILITY = NO for the unit fixture; this is INFORMATIONAL and
                          no local closure claim depends on a foreign producer
DEPENDENCY_CLASS = INFORMATIONAL
```

The actual composition root is executable at `src/composition/exec-contract.ts`
and the focused test proves the local producer/consumer path. No upstream
availability promotion is required or claimed.

### Identity, immutability and lineage

```text
IDENTITY = CONFORMANT within scope
```

The code uses canonical object-identity checks for the two local schema
references (`exec-contract.ts:294-307`) and preserves opaque DOM-looking IDs
without deriving identity from labels, text or mutable display values. It does
not claim that a non-empty string proves DOM identity; attachment and lifecycle
proof remain foreign. No local canonical ID is regenerated.

```text
IMMUTABILITY = CONFORMANT within scope
```

Schema documents are deeply frozen (`exec-schema.ts:50-74`), contract values
clone and freeze structured input (`exec-contract.ts:99-160, 365-386,
426-435`), and the validated pair/failure are frozen (`exec-contract.ts:461-511`.
No historical or persisted record is rewritten.

```text
LINEAGE = NOT_APPLICABLE
```

There is no persistible aggregate/entity, progression evidence, predecessor or
successor relation, or reconstruction path in this ticket. The implementation
does not treat schema validity as DOM lifecycle or manifest lineage proof.

### Legacy, cutover and destructive-transition safety

```text
LEGACY_RESULT = TRANSITION_CONFORMANT
DESTRUCTIVE_TRANSITION = NOT_APPLICABLE
```

The production graph does not import `prototype` or `.pi` and does not expose a
legacy writer. Human text is explicitly ignored as authority. No replacement,
retirement, destructive cutover, rollback or roll-forward decision is required
for this new canonical path.

### Migration and authorization boundaries

```text
MIGRATION_AUTHORITY = NOT_APPLICABLE
AUTHORIZATION = NOT_APPLICABLE / NO AUTHORITY ELEVATION OBSERVED
```

No migration code or durable state exists. A valid contract result has no
approval, lifecycle, or effect authority by itself; invalid results carry
`noApproval`, `noCheckpoint` and `noEffect` at
`src/domain/exec-contract.ts:489-511`.

## 5. Authority-completeness checks

### Authority consumption and producer/consumer proof

The local authority is defined by ADR-0003/O-016 and
`EXEC-ENVELOPE-001/002`; the consumer contract is the immutable schema
reference/structured-result boundary. `ExecSchemaValidationPort` exists and
has a real implementation. The contract transports schema references,
structured fields and validation evidence, and defines invalid/malformed
failure semantics. The recorded `PRODUCTIVE_AVAILABILITY=NO` applies to the
unit fixture record, not to an unavailable foreign capability and not to a
local-closure blocker.

```text
AUTHORITY_CONSUMPTION_PROOF = COMPLETE for local scope
AUTHORITY_CONSUMPTION_GAPS = 0
PRODUCER_CONSUMER_CONTRACT_PROOF = COMPLETE for local scope
PRODUCER_CONSUMER_CONTRACT_ERRORS = 0
```

### Caller-as-authority check

Normal raw envelope/payload input is correctly treated as untrusted contract
material: caller-selected schema identity is rejected by the canonical schema
references, and human text cannot fill missing fields. Nevertheless, the
caller can import and invoke the exported evidence issuer with a forged
`hasValidated` receipt. That makes the caller the authority for schema validity
and is the blocking bypass in `ARCH-CRITICAL-001`.

```text
CALLER_AS_AUTHORITY_CHECK = FAIL
CALLER_SUPPLIED_AUTHORITY_BYPASS = 1
```

### Temporal authority proof

No mutable external authority is observed before committing an effect. The
operation is synchronous and side-effect-free, with no persistence, lifecycle
transition or external effect commit.

```text
TEMPORAL_AUTHORITY_PROOF = NOT_APPLICABLE
TEMPORAL_AUTHORITY_GAPS = 0
```

### Architecture guard evidence

The focused ticket test ran:

1. the caller-authority/export guard at `tests/...:239-262`;
2. the production import-graph guard at `tests/...:594-645`;
3. the generic delegation consumer isolation guard at `tests/...:682-709`.

The import-graph and generic-consumer guards passed. The export guard is
insufficient: it checks that older names are absent but does not attempt the
actual exported `recordCanonicalValidationEvidence` issuer. Therefore one
required architecture guard is missing/inadequate despite three guard tests
running.

```text
MISSING_ARCHITECTURE_GUARDS = 1
ARCHITECTURE_GUARD_TESTS_RUN = 3
ARCHITECTURE_GUARD_EVIDENCE = focused 20/20; direct forged-receipt
                               reproduction succeeds (see finding)
```

## 6. Systemic boundary expansion

The issue was checked across the affected validation boundary rather than only
at the first call site. The same evidence token is consumed by both
`StructuredExecutionEnvelope.create` and `StructuredCapabilityPayload.create`
(`src/domain/exec-contract.ts:389-457`), combined into
`ValidatedExecContract` (`:461-487`), and reached through
`ValidateExecContract` (`src/application/exec-contract.ts:93-129`). The issuer
is exported from `src/domain/exec-validation-evidence-internal.ts:21-38` and
called by the infrastructure adapter at
`src/infrastructure/exec-schema-validator.ts:78-82`.

No second registry, persistence writer, legacy route, DOM writer or projection
authority was found. The systemic pattern is specifically the exposed
validation-authority seam: a supposedly internal issuer plus a WeakSet-backed
consumer can be reached by an arbitrary caller. The finding consolidates all
of those manifestations.

## 7. Findings

### ARCH-CRITICAL-001 — Caller can mint canonical schema-validation authority

```text
Severity: CRITICAL
Ticket: EXEC-001-TICKET-001
Normative authority:
  ADR-0003 Decision — every skill emits JSON validated by JSON Schema before
  consumption; invalid schema is a contract failure and human text is not
  operational authority.
  SPEC-EXEC-001 §13 EXEC-ENVELOPE-001 and EXEC-CONTRACT-001; §14 structured
  contract boundary; §15 CONTRACT_INVALID fail-closed semantics.
  Approved design §§10, 13, 20 — schema mechanics may be substituted only
  behind the port and an executable architecture guard must preserve the
  boundary.
  Shared authority-completeness gate — CALLER_SUPPLIED_AUTHORITY_BYPASS is a
  critical architecture violation.
Owner: EXEC-001 / schema-validation authority boundary
Affected boundary:
  src/domain/exec-validation-evidence-internal.ts ↔
  src/infrastructure/exec-schema-validator.ts ↔
  src/domain/exec-contract.ts ↔ src/application/exec-contract.ts
Repository evidence:
  recordCanonicalValidationEvidence is exported at
  src/domain/exec-validation-evidence-internal.ts:21-38. It only checks the
  caller-provided object's hasValidated method at :26, then adds the evidence
  object to the accepted WeakSet at :36.
  src/domain/exec-contract.ts:309-323 accepts any evidence object in that
  WeakSet, and :400-409 / :448-457 use it to construct validated values.
  src/application/exec-contract.ts:113-126 then returns VALIDATED_EXEC_CONTRACT.
  A direct target-state reproduction imported the issuer, passed
  { hasValidated: () => true }, issued evidence for an otherwise unvalidated
  envelope, and successfully constructed StructuredExecutionEnvelope. The
  observed output was: "issued true" followed by "constructed x".
  The existing guard at tests/exec-001-ticket-001.test.ts:239-244 checks only
  obsolete export names and does not cover this callable issuer.
Problem:
  Any caller able to import the internal module can manufacture the runtime
  evidence that the domain treats as proof of canonical schema validation.
  The module filename and comment do not enforce a trust boundary. This
  creates an alternate schema-validation authority and makes the caller's
  receipt claim authoritative.
Impact:
  Malformed or schema-incompatible input can be materialized as a validated
  envelope/payload and returned as a VALID result. Downstream consumers can
  therefore receive contract authority without JSON Schema proof, defeating
  CONTRACT_INVALID fail-closed behavior and the required no-text/alternate-
  authority boundary. Both envelope and payload construction paths are exposed.
Minimum correction required:
  Make evidence issuance callable only through the authorized canonical
  adapter path; an arbitrary imported function and forged receipt must not be
  able to place evidence in the accepted set. Add and run an executable guard
  that attempts the direct-import/fake-receipt path and asserts rejection,
  while retaining the approved narrow adapter contract for legitimate schema
  engines.
Systemic pattern = YES
Related locations:
  src/domain/exec-validation-evidence-internal.ts:9-41;
  src/domain/exec-contract.ts:309-323, 389-487;
  src/infrastructure/exec-schema-validator.ts:37-82;
  src/application/exec-contract.ts:76-129;
  tests/exec-001-ticket-001.test.ts:239-321, 594-645.
```

## 8. Required summary

```text
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
Architecture guard tests run: 3

Findings:
CRITICAL=1
MAJOR=0
MINOR=0
INFO=0

Domain audit complete:
YES

Specialist result:
SPECIALIST_ARCHITECTURE_FINDINGS
```

AUDIT_TARGET_HEAD: 71d73d96d7df69513894736214aa0a36d53a7736
AUDIT_TARGET_STATE_FINGERPRINT: 73f7214519ab58d119929dfcd35b539caf2a81361fdf5a17333240cd748d4c03
DOMAIN_AUDIT_COMPLETE: YES
SPECIALIST_RESULT: SPECIALIST_ARCHITECTURE_FINDINGS