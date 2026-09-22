# EXEC-001-TICKET-001 — Architecture Boundaries Audit

## Audit identity

```text
AUDIT_MODE = READ_ONLY INDEPENDENT ADVERSARIAL ARCHITECTURE_FIRST
             OWNERSHIP_PRESERVING AUTHORITY_PRESERVING CROSS_SPEC_AWARE
             IDENTITY_AWARE LEGACY_TRANSITION_AWARE EXHAUSTIVE_WITHIN_DOMAIN
TICKET_ID = EXEC-001-TICKET-001
TICKET_PATH = docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-001-envelope-schema-contract.md
IMPLEMENTATION_DESIGN_PATH = docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-001-implementation-design.md
TICKET_SET_AUDIT_PATH = docs/tickets/SPEC-EXEC-001/implementation-ticket-audit.md
IMPLEMENTATION_UNIT = EXEC-IMP-01 — Envelope and schema contract
IMPLEMENTATION_BASELINE = 381218d5fbf8d969ee5ae5349b8f65c4cd5af7f9
CURRENT_HEAD = c3375bf9675629262ed500857b41a9636971efc0
AUDIT_TARGET_HEAD = c3375bf9675629262ed500857b41a9636971efc0
AUDIT_TARGET_STATE_FINGERPRINT = 8a923cb179405b34582cd6dfafe168750ce897d3b75e4fddb0c00c04d22d8740
WORKTREE_AT_PREFLIGHT = CLEAN
TICKET_STATUS = VALIDATION_REQUIRED
EXECUTION_READY_CLAIM = FALSE
```

The semantic implementation subject changed at the target consists of:

```text
src/domain/exec-contract.ts
src/domain/exec-schema.ts
src/domain/exec-validation-evidence-internal.ts
src/application/exec-contract.ts
src/composition/exec-contract.ts
src/infrastructure/exec-schema-validator.ts
tests/exec-001-ticket-001.test.ts
docs/tickets/SPEC-EXEC-001/evidence/TICKET-001/AC-EXEC-001-envelope-schema.md
docs/tickets/SPEC-EXEC-001/evidence/TICKET-001/AC-EXEC-001-structured-consumption.md
docs/tickets/SPEC-EXEC-001/evidence/TICKET-001/AC-EXEC-002-required-fields.md
docs/tickets/SPEC-EXEC-001/evidence/TICKET-001/AC-EXEC-002-fail-closed.md
```

Planning, ticket-set, checkpoint, remediation, and audit artifacts are not
production authority and are not treated as implementation evidence except for
traceability. No sibling specialist audit artifact was read.

## Source precedence and reconstructed contract

Authority precedence used:

```text
ADR-0003 accepted revision 3
> approved portfolio ownership
> SPEC-EXEC-001 revision 3 and its conformance audit
> validated Gap Matrix GAP-001 and its audit
> Implementation Plan EXEC-IMP-01 and its audit
> Ticket and approved implementation design
> repository implementation and tests
```

Normative sources and anchors:

- `docs/adrs/ADR-0003-versioned-skill-contracts.md`, `Decisão`: every skill
  emits JSON validated by JSON Schema, with common envelope and capability
  payload; human text is non-authoritative; invalid/incompatible contracts
  fail closed.
- `docs/specs/SPEC-PORTFOLIO-001-organization.md`, O-016: `SPEC-EXEC-001`
  is the sole `CANONICAL_OWNER` of the JSON Schema envelope contract; DOM,
  EXEC-002, REPO, and BACKEND are consumers.
- `docs/specs/SPEC-EXEC-001-skill-contracts-and-capability-registry.md`, §§2,
  4, 9, 11, 12, 13 (`EXEC-ENVELOPE-001/002`), 15, 19, 20, 22: EXEC owns
  envelope/payload schema semantics, schema identity, structured minimum fields,
  and `CONTRACT_INVALID`; DOM owns execution/activity/attempt/cycle identity,
  lifecycle, and snapshots; persistence/effects belong to PLAT; transport and
  authorization belong to other owners.
- `docs/specs/gap-matrices/SPEC-EXEC-001-implementation-gap-matrix.md`,
  GAP-001: the productive identifiable envelope/payload validation boundary is
  the missing delta owned by EXEC-001.
- `docs/specs/implementation-plans/SPEC-EXEC-001-implementation-plan.md`,
  §9 EXEC-IMP-01 and §§12, 13: the local owner is the envelope/payload
  contract shape and validation result; no foreign capability is required for
  local closure; text must not be authoritative.
- Ticket §§3, 9–10, 13, 21–22, 26 and implementation design §§7–9, 13,
  16–18, 20–24: only the new canonical contract boundary is in scope; no
  registry resolution, DOM lifecycle, persistence, transport, effects, or
  downstream mapping is implemented here.

Reconstructed architectural contract:

```text
LOCAL_OWNER = EXEC-001 / CANONICAL_OWNER
LOCAL_AUTHORITIES = identifiable envelope/payload schemas; schema references;
                    required structured fields; immutable validated values;
                    fail-closed CONTRACT_INVALID result
FOREIGN_OWNERS = DOM (canonical IDs, lifecycle, snapshot, domain verdicts);
                 EXEC-002 (sessions/assignments/context); PLAT (persistence,
                 effects, recovery); REPO (configuration/enablement/migration);
                 BACKEND (transport/auth/mapping); OPS/UI (projections)
FOREIGN_CAPABILITIES_CONSUMED = none for local closure; downstream mappings are
                                integrated-proof-only
CANONICAL_IDENTITIES = local SchemaId + exact schema version; DOM IDs carried
                       only as opaque references; no DOM identity is created
                       or resolved here
IMMUTABILITY_RULES = schema documents and validated contract values are frozen;
                     validation failure exposes no mutable partial result
LINEAGE_RULES = validation evidence must originate from the canonical adapter,
                bind the exact input and schema reference, and preserve the
                content fingerprint; no aggregate lineage is created here
LEGACY_AUTHORITY_RULES = prototype/historical shapes remain non-authoritative;
                          no legacy writer or silent conversion
CUTOVER_RULES = NEW_CANONICAL_PATH; no destructive cutover or old EXEC writer
MIGRATION_AUTHORITY = none in this ticket
SECURITY_BOUNDARIES = no EXEC-001 authorization obligation; text, tokens, and
                      display values cannot authorize success/effect
DOES_NOT_IMPLEMENT = registry/version resolution, DOM identity/lifecycle,
                     persistence/recovery, runtime/session execution, external
                     effects, transport, UI/OPS mappings, migration
```

## Applicability matrix

| Dimension | Classification | Audit basis / reason |
|---|---|---|
| OWNERSHIP | REQUIRED | New EXEC contract authority and adapter/application boundary are introduced. |
| CANONICAL_AUTHORITY | REQUIRED | Valid structured consumption must have one EXEC-owned schema authority. |
| CROSS_SPEC_INTEGRATION | AFFECTED | DOM-owned IDs cross the envelope and downstream consumers are named, although no foreign capability is required for local closure. |
| IDENTITY | AFFECTED | Schema references are local canonical contract identities; DOM IDs are transported as references and must not be regenerated. |
| IMMUTABILITY | REQUIRED | Schema definitions and returned validated/failure values must remain immutable. |
| LINEAGE | AFFECTED | Validation evidence carries source/input/reference/fingerprint provenance; no persisted aggregate lineage is created. |
| LEGACY_TRANSITION | AFFECTED | The ticket declares `NEW_CANONICAL_PATH` and explicitly excludes prototype/historical authority. |
| DESTRUCTIVE_TRANSITION | NOT_APPLICABLE | No deletion, irreversible replacement, writer retirement, or state migration occurs. |
| MIGRATION_AUTHORITY | NOT_APPLICABLE | No migration or existing-state rewrite is implemented. |
| SECURITY_AUTHORIZATION | NOT_APPLICABLE | The governing SPEC assigns authentication/authorization elsewhere and this path has no authorization decision or endpoint. |

## Boundary audit results

### Ownership and canonical authority

```text
OWNERSHIP = OWNERSHIP_PRESERVED
FOREIGN_CAPABILITY_DUPLICATION = 0
AUTHORITY_RECOMPUTED_LOCALLY = 0
REPOSITORY_SEMANTIC_AUTHORITY = 0
CANONICAL_AUTHORITY = ALTERNATE_AUTHORITY_INTRODUCED
```

The intended path is correctly separated: `exec-schema.ts` owns the immutable
schema definitions, `exec-schema-validator.ts` owns schema-engine mechanics,
`ValidateExecContract` coordinates, and domain values expose the structured
result. The composition root is the only productive selection of the adapter.
No DOM lifecycle, persistence, registry, transport, or projection authority was
absorbed.

However, canonical schema-validation authority is not actually confined to the
adapter. `src/domain/exec-validation-evidence-internal.ts:9-22` accepts any
frozen object whose caller-provided `evidenceType` function is named
`CanonicalSchemaValidationEvidence`, whose prototype has a caller-provided
`isCanonicalEvidence` method, and whose method returns `true`. The recognizer
never verifies the adapter's private `#brand`.

The direct adversarial probe constructed a caller-defined class with that exact
name and shape, supplied the exact canonical schema reference, exact input
object, and `structuredContentFingerprint(input)`, and passed it to
`StructuredExecutionEnvelope.create`: `accepted = true`. The same forged
receipt through an injected `ExecSchemaValidationPort` caused
`ValidateExecContract.validate` to return `status = VALID` for both envelope and
payload. This establishes an alternate caller-controlled authority path.

### Cross-spec and producer/consumer contract

```text
CROSS_SPEC_RESULT = CROSS_SPEC_CONFORMANT for the declared local scope
FOREIGN_CAPABILITIES_REQUIRED_FOR_LOCAL_CLOSURE = 0
UNIT-EXEC-SCHEMA-HARNESS:
  AUTHORITY_STATUS = DEFINED
  CONTRACT_STATUS = DEFINED
  LOCAL_TESTABILITY = YES
  PRODUCTIVE_AVAILABILITY = NO
  CAPABILITY_SUMMARY_STATUS = CONTRACT_TESTABLE_LOCALLY
  DEPENDENCY_CLASS = INFORMATIONAL
  BLOCKING_EFFECT = NONE
AUTHORITY_CONSUMPTION_GAPS = 1 (internal producer-authenticity seam)
PRODUCER_CONSUMER_CONTRACT_ERRORS = 1 (same root finding; not a foreign seam)
```

The approved local capability record correctly does not promote a fixture to
productive foreign availability. The intended producer is the adapter and the
consumer is the application/domain construction path. The contract transports
`valid`, issues, exact input, exact schema reference, and fingerprint, but its
producer authenticity is only nominal: the consumer accepts a caller-defined
receipt through the public port. Downstream integrated consumers are not
claimed as locally proven or productively available.

### Identity, immutability, and lineage

```text
AGGREGATE_IDENTITY_PROOF = NOT_APPLICABLE (no aggregate/entity is created)
IDENTITY = CONFORMANT within ticket scope
IDENTITY_VIOLATIONS = 0
IMMUTABILITY = CONFORMANT
LINEAGE = VIOLATED for validation-evidence provenance
IMMUTABILITY_LINEAGE_VIOLATIONS = 1 (evidence provenance; no history rewrite)
RECONSTRUCTION_PROOF = NOT_APPLICABLE (no persisted material is materialized)
```

`EXEC_ENVELOPE_SCHEMA_REFERENCE` and `EXEC_PAYLOAD_SCHEMA_REFERENCE` are
created once and compared by object identity; runtime-created lookalike
references are rejected. DOM-owned execution/activity/assignment/cycle/attempt
values are preserved as opaque fields and are not normalized into local
identity. Schema documents are deeply frozen, and successful values clone and
freeze structured arrays/objects. No historical record or predecessor/successor
relationship is created.

The lineage/provenance requirement for validation evidence is nevertheless
violated because a forged receipt is accepted as if it originated from the
canonical adapter. This is counted separately from canonical identity and
historical immutability.

### Legacy, cutover, destructive transition, migration, and authorization

```text
LEGACY_RESULT = TRANSITION_CONFORMANT
DESTRUCTIVE_TRANSITION = NOT_APPLICABLE; no replacement/cutover proof required
MIGRATION_RESULT = NOT_APPLICABLE
AUTHORIZATION_RESULT = NOT_APPLICABLE
```

The productive import graph excludes `prototype` and `.pi`; no legacy EXEC
writer or compatibility mapping was introduced. The generic delegation test
continues to reject text-only completion/effect interpretation. There is no
migration, destructive transition, endpoint authorization, or capability-based
execution decision in this ticket.

### Temporal authority and caller-as-authority checks

```text
TEMPORAL_AUTHORITY_PROOF = NOT_APPLICABLE for mutable external authority/effect
TEMPORAL_AUTHORITY_GAPS = 0
CALLER_AS_AUTHORITY_CHECK = FAIL
CALLER_SUPPLIED_AUTHORITY_BYPASSES = 1
```

The validation operation does not observe mutable domain authority before an
external effect. It does, however, accept caller-supplied adapter/evidence
behavior as proof that schema validation occurred. A caller-defined
`CanonicalSchemaValidationEvidence` therefore replaces the canonical adapter's
validation authority at the application/domain boundary.

### Architecture scope and guards

```text
ARCHITECTURAL_SCOPE = AUTHORIZED_ARCHITECTURAL_REALIZATION with a critical
                       authority-boundary defect
ARCHITECTURAL_AUTHORITY_GAP_DISCOVERED = NO
MISSING_ARCHITECTURE_GUARDS = 1
ARCHITECTURE_GUARD_TESTS_RUN = 3
```

The three executable guards run in the focused suite are the caller-mintable
authority guard, forged-evidence/reference rejection guard, and productive
import-graph guard. All 21 focused tests passed. The guard set is incomplete:
there is no negative witness for a caller-defined class whose constructor name
collides with the adapter class name, so the critical alternate-authority path
passes the existing guards.

## Executed evidence

```text
FOCUSED_TICKET_TEST = PASS (21/21)
FOCUSED_STRICT_TYPECHECK = PASS
PACKAGE_TYPECHECK = PASS (npm run typecheck)
REPOSITORY_REGRESSION = PASS (25/25; npm test)
ADVERSARIAL_FORGED_EVIDENCE_PROBE = FAILS_REQUIRED_REJECTION; forged evidence
                                  was accepted and forged application adapter
                                  returned VALID
TARGET_HEAD_AFTER_TESTS = c3375bf9675629262ed500857b41a9636971efc0
WORKTREE_AFTER_TESTS = CLEAN
```

The focused tests prove canonical valid/invalid behavior, immutable values,
custom-schema rejection, ordinary forged/copy rejection, text non-authority,
and import isolation. They do not prove non-forgeability against the exact
constructor-name collision described above.

## Finding

### ARCH-CRITICAL-001

```text
Severity = CRITICAL
Ticket = EXEC-001-TICKET-001
Normative authority = ADR-0003 Decisão; O-016; SPEC-EXEC-001 §§2, 9, 11,
                      13 EXEC-ENVELOPE-001/002, 15, 19, 22; ticket §9–10;
                      design §§7, 9, 13, 17, 20
Owner = EXEC-001 / CANONICAL_OWNER
Affected boundary = schema adapter → ExecSchemaValidationPort → domain evidence
                    recognizer → StructuredExecutionEnvelope /
                    StructuredCapabilityPayload → ValidateExecContract
Repository evidence = src/domain/exec-validation-evidence-internal.ts:9-22
                      trusts caller-controlled evidenceType.name/prototype/
                      verifier; src/infrastructure/exec-schema-validator.ts:34-65
                      exposes evidenceType while its private #brand is not
                      checked; src/domain/exec-contract.ts:366-386, 452-475,
                      503-526 accepts the forged receipt; src/application/
                      exec-contract.ts:76-126 accepts injected ports and
                      forwards their evidence; focused tests pass, while an
                      exact-name collision probe returns accepted=true and an
                      injected forged port returns status=VALID
Problem = The implementation's supposed adapter-private evidence brand is
          validated by a caller-controlled class name and method rather than
          by an unforgeable adapter-owned identity/private brand. A caller can
          provide a receipt with the canonical schema reference, exact input,
          and matching fingerprint without running the canonical JSON Schema
          validator.
Impact = Invalid or unvalidated structured data can become a VALID canonical
         EXEC contract. This creates an alternate authority path, breaks the
         evidence provenance/lineage guarantee, and can expose downstream
         consumers to a contract that never passed the owner-approved schema
         engine; fail-closed/no-effect guarantees cannot be relied upon after
         the bypass.
Minimum correction required = Make evidence recognition depend on an identity
                              that callers cannot reproduce (for example, a
                              genuinely private adapter-owned brand/issuer
                              capability or a closed construction boundary),
                              and add an executable exact-name collision and
                              injected-port negative guard through both domain
                              factories and ValidateExecContract. Preserve
                              EXEC ownership and the existing adapter/domain/
                              application separation; do not add a registry,
                              DOM, persistence, or transport authority.
Systemic pattern = YES
Related locations = src/domain/exec-validation-evidence-internal.ts:9-22;
                   src/infrastructure/exec-schema-validator.ts:34-65, 106-138;
                   src/domain/exec-contract.ts:20-32, 366-386, 452-475,
                   503-526; src/application/exec-contract.ts:21-55, 76-126;
                   tests/exec-001-ticket-001.test.ts architecture guards and
                   evidence-forgery tests (missing exact-name collision case)
```

## Summary

Audit: `docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-001-architecture-audit.md`

Specialist:
ARCHITECTURE_BOUNDARIES

Ticket: EXEC-001-TICKET-001

Ownership errors: 0

Foreign capability duplication: 0

Authority violations: 1

Identity violations: 0

Immutability/lineage violations: 1

Legacy authority violations: 0

Architectural authority gaps: 0
Authority consumption gaps: 1
Producer/consumer contract errors: 1
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

AUDIT_TARGET_HEAD: c3375bf9675629262ed500857b41a9636971efc0
AUDIT_TARGET_STATE_FINGERPRINT: 8a923cb179405b34582cd6dfafe168750ce897d3b75e4fddb0c00c04d22d8740
DOMAIN_AUDIT_COMPLETE: YES
SPECIALIST_RESULT: SPECIALIST_ARCHITECTURE_FINDINGS