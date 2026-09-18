# EXEC-001-TICKET-001 — Architecture Boundaries Audit

## 1. Audit identity and pinned subject

```text
AUDIT_MODE = READ_ONLY INDEPENDENT ADVERSARIAL ARCHITECTURE_FIRST OWNERSHIP_PRESERVING AUTHORITY_PRESERVING CROSS_SPEC_AWARE IDENTITY_AWARE LEGACY_TRANSITION_AWARE
TICKET_ID = EXEC-001-TICKET-001
TICKET_PATH = docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-001-envelope-schema-contract.md
IMPLEMENTATION_DESIGN = docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-001-implementation-design.md
TICKET_SET_AUDIT = docs/tickets/SPEC-EXEC-001/implementation-ticket-audit.md
IMPLEMENTATION_BASELINE = 381218d5fbf8d969ee5ae5349b8f65c4cd5af7f9
IMPLEMENTATION_CHECKPOINT = 25d11eb82d3b89226f7058e188a062233fe30556
CURRENT_HEAD = e50dc2e721b1517faae55d60883248ca1fe71844
AUDIT_TARGET_HEAD = e50dc2e721b1517faae55d60883248ca1fe71844
AUDIT_TARGET_STATE_FINGERPRINT = b967f87041ee3133242ca6910c8f673d9434d712f8e053ee0057f96132cef63d
TICKET_STATUS_AT_AUDIT = VALIDATION_REQUIRED
```

The pinned HEAD was present. The source/test overlay used as the semantic
implementation subject was covered by the pinned state fingerprint and
remained unchanged during this audit. Other documentation artifacts were not
part of the semantic implementation subject and were not read. No production
code, tests, ticket state, authority artifact, Git state, commit, branch,
remote or publication state was changed by this audit.

### Implementation subject and changed files

The actual implementation boundary audited is:

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

The ticket's execution record names two `exec-validation-authority*` paths,
but the implemented support path is `exec-validation-evidence-internal.ts`.
This audit follows the actual target tree.

### Evidence executed

- Focused ticket test: `20/20` passed.
- Repository regression: `25/25` passed (`npm test`).
- Focused strict TypeScript check: passed.
- Package TypeScript check: passed (`npm run typecheck`).
- An adversarial direct import test was executed against the implemented
  boundary. It successfully constructed a validated envelope using the
  exported evidence recorder and a fake receipt returning `true`, without
  invoking the JSON Schema validator. Output included:
  `{"forgedEvidence":true,"accepted":"forged-inherited","ownExecutionId":false}`.

## 2. Source precedence and reconstructed architectural contract

Authority was reconstructed in this order:

```text
ADR-0003 (accepted, revision 3)
  > SPEC-PORTFOLIO-001 revision 2 and O-016
  > SPEC-EXEC-001 revision 3 and its component audit
  > validated Gap Matrix GAP-001 and Plan EXEC-IMP-01
  > approved implementation design
  > ticket
  > repository implementation and tests
```

Relevant normative anchors:

| Concern | Normative source and anchor | Reconstructed rule |
|---|---|---|
| Envelope/schema ownership | `docs/adrs/ADR-0003-versioned-skill-contracts.md`, `Decisão`; Portfolio O-016; `SPEC-EXEC-001` §13 `EXEC-ENVELOPE-001/002` | EXEC-001 owns the identifiable common envelope/payload schemas and structured minimum fields. Human text is non-authoritative. |
| Fail-closed contract result | ADR-0003, `Decisão`; `SPEC-EXEC-001` §13 `EXEC-CONTRACT-001`, §15 and §19; ticket §§9, 16, 18 | Invalid input is `CONTRACT_INVALID` and cannot imply approval, checkpoint confirmation or effect. |
| Local boundary | Ticket §§3, 7, 10, 12–15; design §§3, 7, 9, 16–18 | The ticket may validate schema shape and return immutable contract/failure values. It does not own registry resolution, DOM identity/lifecycle, persistence, transport, effects or downstream mappings. |
| Identity boundary | ADR-0001, `Decisão`; `SPEC-EXEC-001` §§10, 12.3–12.4; design §7 | DOM identities are consumed, not created here. Schema references are local contract identities. Incoming execution/activity IDs remain opaque fields in this ticket. |
| Persistence/recovery boundary | ADR-0006, `Decisão`; Portfolio O-032–O-038; ticket §10; design §§7, 14–18 | This ticket creates no durable state, history, recovery record or effect intent. |
| Consumer/mapping boundary | Portfolio §§8.3, 10, 14; `SPEC-EXEC-001` §§2, 18–20; design §§12, 16–17 | BACKEND/OPS/UI and generic delegation may consume/map results but cannot become schema or failure authority. |
| Legacy/cutover boundary | ADR-0003, `Decisão`; `SPEC-EXEC-001` §17; ticket §§21, 26; design §§17–18 | This is a new canonical path. Prototype, historical and text formats are non-authoritative and are not silently converted. |

### Reconstructed ownership contract

```text
LOCAL_OWNER = SPEC-EXEC-001 / EXEC-001 / CANONICAL_OWNER
LOCAL_AUTHORITIES = identifiable envelope schema, capability-payload schema,
                    structured minimum fields, schema validation result,
                    CONTRACT_INVALID fail-closed result
FOREIGN_OWNERS = SPEC-DOM-001 (canonical IDs, snapshot, lifecycle and verdict
                 advancement); SPEC-PLAT-001 (physical persistence/integrity/
                 recovery); SPEC-EXEC-002 (session/context); SPEC-REPO-001
                 (configuration/enablement); BACKEND/OPS/UI (mapping/projection)
FOREIGN_CAPABILITIES_CONSUMED = none for local closure; downstream mappings and
                                generic delegation are integrated consumers only
CANONICAL_IDENTITIES = ticket-owned SchemaReference values; DOM IDs are opaque
                       consumed references and are not locally created
IMMUTABILITY_RULES = schema definitions, schema references, validated values,
                     contract pairs and failure results are immutable; no
                     historical record is created
LINEAGE_RULES = no local aggregate/revision lineage; schema version is contract
                identity, not domain progression lineage
LEGACY_AUTHORITY_RULES = prototype, text-only and historical formats never
                         become production authority
CUTOVER_RULES = NEW_CANONICAL_PATH; no legacy EXEC writer exists and no
                destructive retirement is performed
MIGRATION_AUTHORITY = NOT_APPLICABLE; no migration or state conversion
SECURITY_BOUNDARIES = no EXEC-001 authentication/authorization or secret
                      obligation; no transport/effect path is exposed
DOES_NOT_IMPLEMENT = registry/version resolution; DOM identity/lifecycle;
                     persistence/recovery; runtime/session execution; external
                     effects; transport; UI/OPS/BACKEND mappings; downstream
                     integrated conformance
```

## 3. Applicability matrix

| Dimension | Classification | Reason and audit result |
|---|---|---|
| OWNERSHIP | REQUIRED | The implementation introduces a new EXEC schema/failure boundary and must not absorb DOM, persistence or consumer ownership. A leakage is found in the evidence issuance seam. |
| CANONICAL_AUTHORITY | REQUIRED | Schema validation and `CONTRACT_INVALID` are canonical EXEC-001 semantics; an alternate validation-authority route must be rejected. |
| CROSS_SPEC_INTEGRATION | AFFECTED | The validated result is a handoff to later EXEC and mapping consumers, but no foreign capability is required for this ticket's local closure. |
| IDENTITY | AFFECTED | SchemaReference identity is locally canonical and envelope fields carry foreign DOM references as opaque values; no DOM identity is created here. |
| IMMUTABILITY | REQUIRED | The ticket creates immutable schema definitions, validated values and failures, even though it creates no durable history. |
| LINEAGE | NOT_APPLICABLE | There is no persisted aggregate/entity, predecessor/successor relationship, retry identity, historical record or reconstruction operation in this ticket. Schema version does not establish domain lineage. |
| LEGACY_TRANSITION | AFFECTED | The ticket declares `NEW_CANONICAL_PATH` and must prevent prototype/text/historical formats from becoming an alternate writer or authority. |
| DESTRUCTIVE_TRANSITION | NOT_APPLICABLE | No data, writer, route or authority is retired or deleted; no irreversible cutover operation is implemented. |
| MIGRATION_AUTHORITY | NOT_APPLICABLE | No migration, legacy conversion, bootstrap promotion or existing-state rewrite is implemented. |
| SECURITY_AUTHORIZATION | NOT_APPLICABLE | The ticket changes no authentication, authorization, transport, credentials or effect boundary. Text is checked as non-authority, but this is contract authority rather than security authorization. |

## 4. Boundary inspection and results

### Production dependency boundary

The intended composition is present:

```text
src/composition/exec-contract.ts
  -> src/application/exec-contract.ts
      -> src/domain/exec-contract.ts / src/domain/exec-schema.ts
      -> src/infrastructure/exec-schema-validator.ts
          -> typebox/compile
          -> src/domain/exec-validation-evidence-internal.ts
```

The production graph does not import `prototype`, `.pi`, HTTP, React, Vite,
filesystem or a database. `src/application/snapshot.ts` and
`src/domain/snapshot.ts` remain DOM-owned paths and are not imported by the
EXEC contract boundary. The `.pi` generic delegation runtime is touched only
by a regression test and is not promoted to schema authority.

`ExecContractSchemaDefinitions` owns two deeply frozen, identifiable schema
definitions. `JsonSchemaExecValidator` compiles and evaluates those exact
canonical definitions. `ValidateExecContract` invokes both validations,
requires successful evidence, constructs immutable structured values and
returns a single fail-closed result when either side fails. The ordinary path
therefore preserves the intended owner and boundary.

### Ownership and canonical authority result

```text
OWNERSHIP_RESULT = OWNERSHIP_LEAKAGE
CANONICAL_AUTHORITY_RESULT = ALTERNATE_AUTHORITY_INTRODUCED
FOREIGN_CAPABILITY_DUPLICATION = 0
AUTHORITY_RECOMPUTED_LOCALLY = 1
PROJECTION_USED_AS_AUTHORITY = 0
```

The defect is in `src/domain/exec-validation-evidence-internal.ts:21-37`:
`recordCanonicalValidationEvidence` is exported and accepts any object
implementing `SchemaValidationAdapterReceipt`. It only checks the caller-
provided `hasValidated(...)` boolean before placing the evidence in the
module's private WeakSet. The caller can therefore supply
`{ hasValidated: () => true }`, obtain an issued evidence object and pass it to
`StructuredExecutionEnvelope.create` or
`StructuredCapabilityPayload.create`.

The value factories correctly require a WeakSet-issued object and canonical
schema-reference singleton, but the exported issuer lets an untrusted caller
mint that supposedly unforgeable evidence. The WeakSet proves only issuance by
the same module, not execution of the canonical JSON Schema adapter.

### Cross-spec and producer/consumer result

No foreign capability is consumed for local closure. The ticket handoff
`UNIT-EXEC-SCHEMA-HARNESS` is informational and explicitly records:

```text
AUTHORITY_STATUS = DEFINED
CONTRACT_STATUS = DEFINED
LOCAL_TESTABILITY = YES
PRODUCTIVE_AVAILABILITY = NO (the local fixture/harness is not a foreign producer)
CAPABILITY_SUMMARY_STATUS = CONTRACT_TESTABLE_LOCALLY
DEPENDENCY_CLASS = INFORMATIONAL
BLOCKING_EFFECT = NONE
```

The actual local producer/consumer path is the implemented
`JsonSchemaExecValidator` → `ValidateExecContract` composition. It was
executed through the focused tests. No downstream productive consumer,
foreign producer or availability promotion is claimed by this ticket. The
local handoff is therefore conformant in scope, but the evidence issuer makes
its validation proof semantically incomplete.

```text
CROSS_SPEC_RESULT = CROSS_SPEC_CONFORMANT_FOR_LOCAL_SCOPE
AUTHORITY_CONSUMPTION_RESULT = NO_FOREIGN_AUTHORITY_GAP_FOR_LOCAL_CLOSURE
PRODUCER_CONSUMER_RESULT = PARTIAL (canonical producer is not enforced by the
                                  exported evidence-recorder seam)
```

### Identity result

```text
IDENTITY_RESULT = CONFORMANT
IDENTITY_VIOLATIONS = 0
```

`SchemaReference` instances are immutable and the production path requires the
canonical envelope/payload singleton references and exact schema identity
fields. Runtime-created references and custom schema documents are rejected.
The envelope's execution/activity/assignment/cycle/attempt fields are opaque
structured data, not locally resolved or promoted to DOM identity. No
alternative DOM identity or lifecycle is created.

### Immutability and lineage result

```text
IMMUTABILITY_RESULT = CONFORMANT
LINEAGE_RESULT = NOT_APPLICABLE
IMMUTABILITY_LINEAGE_VIOLATIONS = 0
```

Schema documents and references are frozen. Structured arrays/objects are
copied and recursively frozen; validated values, pairs and failures are
frozen. No persistence, append-only history, rehydration, retry identity or
historical reconstruction exists in this unit. The forged evidence route is an
authority-proof defect, not a mutation of authoritative history.

### Legacy, cutover and destructive-transition result

```text
LEGACY_RESULT = TRANSITION_CONFORMANT
LEGACY_AUTHORITY_VIOLATIONS = 0
DESTRUCTIVE_TRANSITION_RESULT = NOT_APPLICABLE
MIGRATION_RESULT = NOT_APPLICABLE
```

The production graph has no legacy EXEC schema writer, prototype import or
text fallback. The generic delegation consumer remains a separate non-
authoritative consumer and its regression rejects text-only completion. No
replacement/cutover or migration operation is executed, so destructive safety
fields are all not applicable:

```text
REPLACEMENT_PROVEN = NOT_APPLICABLE
CUTOVER_AUTHORIZED = NOT_APPLICABLE
PRE_TRANSITION_GATES_SATISFIED = NOT_APPLICABLE
POST_TRANSITION_GUARDS_PRESENT = NOT_APPLICABLE
ROLLBACK_OR_ROLL_FORWARD_SEMANTICS_DEFINED = NOT_APPLICABLE
```

### Authorization result

```text
SECURITY_AUTHORIZATION_RESULT = NOT_APPLICABLE
```

There is no authorization route in this ticket. The public evidence issuer is
a canonical-contract authority bypass, not an authentication or user-
authorization bypass.

## 5. Identity, caller authority and temporal checks

### Caller-as-authority check

```text
CALLER_AS_AUTHORITY_CHECK = FAIL
CALLER_SUPPLIED_AUTHORITY_BYPASS = 1
```

The caller can import `src/domain/exec-validation-evidence-internal.ts`, call
the exported `recordCanonicalValidationEvidence` with a fake receipt, and make
`StructuredExecutionEnvelope.create` accept a value that no canonical schema
adapter validated. The direct adversarial run accepted an envelope whose
required `executionId` was supplied only through `Object.prototype`, proving
that the fake receipt bypasses the adapter's own-enumerable-required-field
guard as well as schema execution.

Human text, custom schema references, copied branded values and malformed
adapter results are rejected on the ordinary path. They do not cure this
separate exported-issuer route.

### Temporal authority proof

```text
TEMPORAL_AUTHORITY_PROOF = NOT_APPLICABLE
TEMPORAL_AUTHORITY_GAPS = 0
```

This operation validates immutable contract input and commits no external or
durable effect. There is no observe-then-effect sequence requiring independent
revalidation. The evidence defect is a direct authority issuance bypass, not a
stale-observation or CAS problem.

## 6. Scope classification and systemic boundary expansion

```text
ORDINARY_SCHEMA_BOUNDARY = AUTHORIZED_ARCHITECTURAL_REALIZATION
EVIDENCE_ISSUANCE_SEAM = UNAUTHORIZED_ARCHITECTURAL_EXPANSION
ARCHITECTURAL_AUTHORITY_GAP_DISCOVERED = NO
```

The accepted ADR, SPEC and design determine the schema authority and ownership;
no missing normative decision must be invented. The implementation instead
opens an alternate route that bypasses that authority. The issue is systemic
within the affected boundary because every caller able to import the internal
module can provide an arbitrary `SchemaValidationAdapterReceipt` and mint
accepted evidence.

Equivalent-path inspection found no second production schema writer, worker,
migration, projection or legacy route. The systemic root cause is consolidated
in one finding rather than duplicated across the application, adapter and
value-factory manifestations.

## 7. Architecture guards

The focused suite ran 20 tests. Four tests provide architecture-oriented
coverage:

1. `does not expose caller-mintable validation authority through the domain boundary` checks selected old issuer/registration names and mutation behavior.
2. `rejects forged evidence and runtime-created canonical-looking references` checks structurally forged evidence and runtime-created schema references.
3. `returns immutable structured values and guards the complete productive import graph` exercises the composition path and forbidden dependency graph.
4. `generic delegation consumer never promotes text-only output to canonical completion or effects` exercises the non-authoritative text consumer boundary.

These tests all passed, but none directly imports and invokes the current
exported `recordCanonicalValidationEvidence` with a forged receipt. The first
test checks `issueSchemaValidationEvidence` and
`registerSchemaValidationAdapter` are absent, while the current exported name
is different.

```text
MISSING_ARCHITECTURE_GUARDS = 1
ARCHITECTURE_GUARD_TESTS_RUN = 4
ARCHITECTURE_GUARD_EVIDENCE = focused 20/20 suite; productive import graph and
                              generic text-consumer guards pass; direct forged
                              current-evidence-issuer guard is absent and the
                              adversarial command demonstrates acceptance
```

## 8. Findings

### ARCH-CRITICAL-001 — Exported evidence issuer permits caller-minted schema authority

```text
Severity = CRITICAL
Ticket = EXEC-001-TICKET-001
Normative authority = ADR-0003 Decisão; SPEC-EXEC-001 §13
  EXEC-ENVELOPE-001/002 and EXEC-CONTRACT-001; ticket §§7, 9, 13, 15, 18;
  implementation design §§9, 13, 17, 20–22
Owner = SPEC-EXEC-001 / EXEC-001 canonical contract-validation boundary
Affected boundary = src/domain/exec-validation-evidence-internal.ts →
                   src/infrastructure/exec-schema-validator.ts →
                   src/application/exec-contract.ts →
                   StructuredExecutionEnvelope/StructuredCapabilityPayload
Repository evidence = src/domain/exec-validation-evidence-internal.ts:21-37
  exports recordCanonicalValidationEvidence and trusts the caller-provided
  SchemaValidationAdapterReceipt.hasValidated result; the value factories at
  src/domain/exec-contract.ts:309-324, 389-409 and 437-457 accept any evidence
  placed in the module WeakSet. The direct adversarial execution called the
  exported function with { hasValidated: () => true } and constructed an
  envelope without invoking JsonSchemaExecValidator.validate.
Problem = The supposedly opaque proof of successful canonical schema
          validation is mintable by any caller that can import the internal
          module. Module-local WeakSet membership proves only that the issuer
          ran, not that a canonical schema validator ran.
Impact = A caller can bypass the canonical schema-validation authority and
         reach structured contract consumption. This introduces an alternate
         authority path and defeats fail-closed validation, including the
         adapter's own enumerable-field and JSON-shape checks. Downstream
         consumers could receive a value represented as schema-validated even
         though no canonical schema validation occurred.
Minimum correction required = Remove caller-reachable evidence issuance or
                              otherwise make issuance available only to the
                              canonical adapter's unforgeable internal handoff;
                              the evidence check must prove actual canonical
                              schema execution for the exact input/reference
                              pair. Add an executable guard that attempts the
                              current direct-import/forged-receipt route and
                              asserts rejection. Preserve alternate adapters
                              only when they delegate through an authority-
                              preserving seam.
Systemic pattern = YES
Related locations = src/domain/exec-validation-evidence-internal.ts:11-37;
                   src/infrastructure/exec-schema-validator.ts:37-81;
                   src/application/exec-contract.ts:21-55, 93-122;
                   src/domain/exec-contract.ts:309-324, 389-457;
                   tests/exec-001-ticket-001.test.ts:239-262, 264-337
```

## 9. Specialist summary

Audit: `docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-001-architecture-audit.md`

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
Producer/consumer contract errors: 1
Temporal authority gaps: 0
Caller-supplied authority bypasses: 1
Missing architecture guards: 1
Architecture guard tests run: 4

Findings:
CRITICAL=1
MAJOR=0
MINOR=0
INFO=0

Domain audit complete:
YES

Specialist result:
SPECIALIST_ARCHITECTURE_FINDINGS

AUDIT_TARGET_HEAD: e50dc2e721b1517faae55d60883248ca1fe71844
AUDIT_TARGET_STATE_FINGERPRINT: b967f87041ee3133242ca6910c8f673d9434d712f8e053ee0057f96132cef63d
DOMAIN_AUDIT_COMPLETE: YES
SPECIALIST_RESULT: SPECIALIST_ARCHITECTURE_FINDINGS