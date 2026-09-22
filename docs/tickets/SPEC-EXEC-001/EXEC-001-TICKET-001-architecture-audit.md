# EXEC-001-TICKET-001 — Architecture Boundaries Audit

## 1. Audit identity and pinned subject

```text
TICKET_ID = EXEC-001-TICKET-001
IMPLEMENTATION_UNIT = EXEC-IMP-01 — Envelope and schema contract
TICKET_PATH = docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-001-envelope-schema-contract.md
IMPLEMENTATION_DESIGN_PATH = docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-001-implementation-design.md
TICKET_SET_AUDIT_PATH = docs/tickets/SPEC-EXEC-001/implementation-ticket-audit.md
SPEC_PATH = docs/specs/SPEC-EXEC-001-skill-contracts-and-capability-registry.md
PRIMARY_ADR_PATH = docs/adrs/ADR-0003-versioned-skill-contracts.md
CROSS_SPEC_REFERENCES = SPEC-DOM-001 is authoritative upstream for DOM identity/lifecycle, but is not consumed by this local ticket
GAP_IDS = GAP-001
REQUIREMENT_IDS = EXEC-ENVELOPE-001, EXEC-ENVELOPE-002
ACCEPTANCE_IDS = AC-EXEC-001, AC-EXEC-002
CURRENT_HEAD = 7bee020a59b0c44baebce8f73125672d5f87e920
AUDIT_TARGET_HEAD = 7bee020a59b0c44baebce8f73125672d5f87e920
AUDIT_TARGET_STATE_FINGERPRINT = e6328873c6f215a522d11911417c7fc64e74ab380fa67e56d2fa6423e347a5c7
IMPLEMENTATION_BASELINE = 381218d5fbf8d969ee5ae5349b8f65c4cd5af7f9 (pre-ticket implementation baseline)
TARGET_PARENT = 1d76af345ac6c840f639c7fd861315f7cd2852a2
TICKET_STATUS_AT_TARGET = VALIDATION_REQUIRED
AUDIT_MODE = READ_ONLY INDEPENDENT ADVERSARIAL ARCHITECTURE_FIRST OWNERSHIP_PRESERVING AUTHORITY_PRESERVING CROSS_SPEC_AWARE IDENTITY_AWARE LEGACY_TRANSITION_AWARE
```

The target commit and repository were inspected read-only before this artifact
was written. The semantic implementation subject consists of:

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

The final remediation checkpoint changed the evidence handoff implementation
and its direct witnesses; no authority, planning, ticket, DOM, persistence,
transport, or legacy surface was changed. The target working tree was clean
before creation of this audit artifact.

## 2. Source precedence and reconstructed contract

The applicable precedence is:

```text
accepted ADR
  > canonical Component SPEC
  > explicit cross-SPEC ownership contracts
  > validated Gap Matrix
  > Implementation Plan
  > ticket
  > approved Implementation Design
  > repository implementation and tests
```

### Local owner and authority

- `EXEC-001` is the canonical owner of the common envelope, capability payload
  schema shape, identifiable schema references, minimum structured fields and
  the fail-closed `CONTRACT_INVALID` result. Authority: ADR-0003, `SPEC-EXEC-001`
  §§2, 9, 11 and 13 (`EXEC-ENVELOPE-001/002`), and ticket §§3, 7, 9 and 15.
- The ticket may validate raw contract shape and return an immutable structured
  result. It may not create or resolve registry entries, create DOM identity or
  lifecycle state, persist/recover state, execute effects, or define transport
  or projection semantics. Authority: SPEC §§2, 7, 10, 12, 14, 16, 19 and 20;
  ticket §§10, 13 and 21.
- Schema-engine mechanics belong behind the `ExecSchemaValidationPort`. The
  approved design makes the domain/application/adapter boundary explicit in
  §§10, 12, 13, 17 and 20.

### Foreign owners and capabilities

- DOM owns `ExecutionId`, `ActivityId`, `AttemptId`, `AgentId`,
  `ArtifactCycleId`, repository identity and lifecycle. This ticket carries
  such fields as contract data but does not resolve or own them.
- PLAT/effect owners own persistence, physical integrity, effect intent,
  execution, evidence and recovery. BACKEND, OPS and UI map/project only.
- Registry/version resolution and downstream integrated consumers belong to
  later EXEC units or their approved consumers.
- No foreign capability is required for this ticket's local closure. The
  ticket-owned `UNIT-EXEC-SCHEMA-HARNESS` record is informational and locally
  testable; it is not evidence of a foreign productive producer.

### Canonical identity, immutability and lineage

- The applicable local identities are the canonical schema references
  `exec-envelope@1.0.0` and `exec-capability-payload@1.0.0`. The implementation
  correctly keeps canonical reference object identity distinct from caller-made
  lookalike `SchemaReference` values.
- No aggregate, persisted entity, revision history or rehydration path is
  introduced. Schema documents and returned contract values are required to be
  immutable. Validation evidence must preserve exact raw-input identity and
  exact canonical-schema-reference identity across the adapter/domain boundary.
- Human text, field labels, paths, filenames, projections and generic
  delegation results are not authority.

### Legacy, cutover, migration and security

- This is `NEW_CANONICAL_PATH`; prototype and historical shapes remain
  non-authoritative. There is no legacy EXEC writer or compatibility writer in
  this implementation.
- No destructive transition, retirement, migration, authorization route,
  credential boundary or security capability is implemented. Those dimensions
  remain outside this ticket and their approved owners.

## 3. Applicability matrix

| Dimension | Classification | Result and evidence |
|---|---|---|
| OWNERSHIP | REQUIRED | Domain/application/adapter ownership is mostly preserved; the validation-proof trust boundary is vulnerable to caller-controlled prototype mutation. |
| CANONICAL_AUTHORITY | REQUIRED | `ALTERNATE_AUTHORITY_INTRODUCED`: a caller can cause a fabricated evidence object to be accepted as schema-engine proof. |
| CROSS_SPEC_INTEGRATION | AFFECTED | The structured result is an integration boundary, but no foreign capability is consumed locally. Downstream mapping is explicitly integrated-proof-only. |
| IDENTITY | REQUIRED | Canonical schema-reference identity is preserved. Validation-evidence provenance identity is not protected against a mutable public verifier. |
| IMMUTABILITY | REQUIRED | Schema documents, evidence instances and returned values are frozen, but the public evidence prototype/verifier remains mutable and is used as authority. |
| LINEAGE | REQUIRED | Exact input/reference checks exist, but forged evidence can claim that lineage without a schema-engine execution. |
| LEGACY_TRANSITION | AFFECTED | `NEW_CANONICAL_PATH` was checked; no legacy EXEC authority or dual writer was found. |
| DESTRUCTIVE_TRANSITION | NOT_APPLICABLE | No deletion, irreversible retirement, destructive cutover or replacement transition is performed by this ticket. |
| MIGRATION_AUTHORITY | NOT_APPLICABLE | No migration, legacy conversion, import, or state rewrite is implemented. |
| SECURITY_AUTHORIZATION | NOT_APPLICABLE | The accepted SPEC assigns authentication/session authorization elsewhere and this boundary performs no authorization decision. |

The `NOT_APPLICABLE` classifications are grounded in the ticket's explicit
Does Not Implement boundary and the SPEC's ownership sections; they do not
excuse the required schema-authority and evidence-lineage checks.

## 4. Ownership and canonical-authority audit

### Ownership result

```text
OWNERSHIP_CLASSIFICATION = OWNERSHIP_PRESERVED_WITH_LOCAL_PROOF_BOUNDARY_DEFECT
FOREIGN_CAPABILITY_DUPLICATED = NO
FOREIGN_LIFECYCLE_OWNED = NO
REPOSITORY_SEMANTIC_AUTHORITY = NO
```

The implementation does not create DOM identity/lifecycle, registry state,
persistence, transport, effects or downstream failure mappings. The domain
contains contract shape and required-field invariants; the application only
orchestrates two validation calls; the schema adapter contains `typebox`
mechanics. The defect below is a local canonical-proof authority failure, not
foreign lifecycle ownership.

### Canonical authority result

```text
AUTHORITY_CLASSIFICATION = ALTERNATE_AUTHORITY_INTRODUCED
CANONICAL_SCHEMA_DEFINITION_OWNER = EXEC-001
CANONICAL_SCHEMA_ENGINE_PATH = JsonSchemaExecValidator → typebox/compile
CANONICAL_WRITE_PATHS = none; validation is side-effect free
PROJECTION_USED_AS_AUTHORITY = NO
```

`JsonSchemaExecValidator` correctly rejects non-canonical schema definition
objects (`src/infrastructure/exec-schema-validator.ts:103-105`) and maintains
exact schema/input receipts (`:81-134`). However, the domain acceptance gate
for the receipt is not an immutable private brand check. The direct finding in
§9 is therefore a critical canonical-authority violation.

## 5. Cross-spec and producer/consumer audit

No foreign capability is consumed by local closure. The local record is
preserved without promoting fixture evidence to an external productive
capability:

```text
CAPABILITY_ID = UNIT-EXEC-SCHEMA-HARNESS
AUTHORITY_OWNER = SPEC-EXEC-001 / EXEC-001
PRODUCER = ticket-owned schema definitions and JsonSchemaExecValidator
CONSUMER = ValidateExecContract and later EXEC contract consumers
PRODUCED_CONTRACT = identifiable envelope/payload validation result plus structured values
RETURNED_DATA = canonical schema references, structured envelope/payload, or CONTRACT_INVALID
VERSION_REVISION_TRANSPORT = exec-envelope@1.0.0 and exec-capability-payload@1.0.0
FAILURE_STALE_SEMANTICS = invalid/malformed/unproven input fails CONTRACT_INVALID; text cannot substitute fields
AUTHORITY_STATUS = DEFINED
CONTRACT_STATUS = DEFINED
SEMANTIC_STATUS = DEFINED
LOCAL_TESTABILITY = YES
PRODUCTIVE_AVAILABILITY = NO (no downstream promotion; the ticket classifies the local harness as informational)
CAPABILITY_SUMMARY_STATUS = CONTRACT_TESTABLE_LOCALLY
DEPENDENCY_CLASS = INFORMATIONAL
AVAILABILITY_EVIDENCE = focused productive-boundary tests and strict touched-source typecheck
BLOCKING_EFFECT = NONE
RESULT = AUTHORITY_CONSUMPTION_GAP for the recorded availability dimension only; no local or foreign capability blocker
```

The producer/consumer contract fields are complete, so
`PRODUCER_CONSUMER_CONTRACT_ERRORS = 0`. The unavailable productive dimension
is not used to claim readiness for any foreign consumer and does not block this
informational local capability. No integrated DOM/PLAT/BACKEND/OPS/UI seam was
implemented in the pinned subject, so no foreign authority was duplicated or
recomputed.

## 6. Identity, immutability and lineage audit

### Identity

`SchemaReference` construction is token-guarded and canonical factories use
exact reference-object identity (`src/domain/exec-contract.ts:300-307,
389-407, 430-455`). A runtime-created lookalike reference is rejected by the
focused test. No DOM identity is regenerated or substituted. Result:

```text
IDENTITY_RESULT = CONFORMANT for canonical schema identities
IDENTITY_VIOLATIONS = 0
```

### Immutability

The schema documents are deeply frozen, successful evidence instances are
frozen, and returned values/failure results are frozen. No historical or
persisted state exists. Nevertheless, `CanonicalSchemaValidationEvidence`'
prototype is not frozen (`src/infrastructure/exec-schema-validator.ts:33-63`),
and a method on that mutable prototype is consulted as authority. Result:

```text
IMMUTABILITY_RESULT = PARTIAL
PERSISTED_HISTORY_REWRITE = NOT_APPLICABLE
```

### Lineage/provenance

The intended lineage is exact raw input plus exact canonical schema reference.
The adapter stores an input receipt and rechecks it (`src/infrastructure/
exec-schema-validator.ts:81-134`), while the domain checks the same two object
identities (`src/domain/exec-contract.ts:309-324`). The public prototype method
can nevertheless be replaced so a fabricated frozen object is recognized as
having that lineage. Result:

```text
LINEAGE_RESULT = VIOLATED
IMMUTABILITY_OR_LINEAGE_VIOLATIONS = 1
```

## 7. Legacy/cutover, destructive transition, migration and authorization

```text
LEGACY_RESULT = TRANSITION_CONFORMANT
LEGACY_WRITES_STILL_ACTIVE = 0
DUAL_AUTHORITY_FROM_LEGACY = 0
ALTERNATE_LEGACY_AUTHORITY = 0

DESTRUCTIVE_TRANSITION = NOT_APPLICABLE
REPLACEMENT_PROVEN = NOT_APPLICABLE
CUTOVER_AUTHORIZED = NOT_APPLICABLE
PRE_TRANSITION_GATES_SATISFIED = NOT_APPLICABLE
POST_TRANSITION_GUARDS_PRESENT = NOT_APPLICABLE
ROLLBACK_OR_ROLL_FORWARD_SEMANTICS_DEFINED = NOT_APPLICABLE

MIGRATION_RESULT = MIGRATION_AUTHORITY_PRESERVED (no migration applicable)
AUTHORIZATION_RESULT = NOT_APPLICABLE_AS_SECURITY_OWNER
```

The implementation uses only the new canonical EXEC path. No prototype or
historical format is silently converted, and no destructive replacement is
attempted.

## 8. Scope, caller-authority and temporal checks

```text
ARCHITECTURAL_SCOPE = AUTHORIZED_ARCHITECTURAL_REALIZATION_WITH_ONE_UNAUTHORIZED_PROOF-BOUNDARY_EXPANSION
CALLER_AS_AUTHORITY_CHECK = FAIL
CALLER_SUPPLIED_AUTHORITY_BYPASS = 1
TEMPORAL_AUTHORITY_PROOF = NOT_APPLICABLE
TEMPORAL_AUTHORITY_GAPS = 0
ARCHITECTURAL_AUTHORITY_GAP_DISCOVERED = NO
```

The domain/application/adapter decomposition and import graph are authorized
realizations of the approved design. The evidence recognizer's reliance on an
exposed, mutable adapter prototype makes that prototype a second authority
route, which is an unauthorized boundary expansion. This is an implementation
violation of an otherwise sufficient contract, not a missing ADR/SPEC
decision. No operation observes mutable external business authority before
committing an external effect, so the temporal gate is not applicable.

## 9. Findings

### ARCH-CRITICAL-001 — Caller can forge canonical schema-validation evidence by mutating the exposed adapter prototype

```text
Severity = CRITICAL
Ticket = EXEC-001-TICKET-001
Normative authority = ADR-0003 / Decisão; SPEC-EXEC-001 §§2, 9, 11, 13 (EXEC-ENVELOPE-001/002), §15; Implementation Design §§10, 13, 17, 20, 22
Owner = EXEC-001 canonical envelope/schema-validation boundary
Affected boundary = infrastructure schema adapter → domain validation-evidence handoff → StructuredExecutionEnvelope/StructuredCapabilityPayload factories → ValidateExecContract
Repository evidence =
  src/infrastructure/exec-schema-validator.ts:33-63 exposes evidenceType and a public isCanonicalEvidence prototype method; the class prototype is not frozen.
  src/domain/exec-validation-evidence-internal.ts:9-20 trusts value.evidenceType, requires that prototype, then calls the mutable method descriptor as the proof decision.
  src/domain/exec-contract.ts:309-324 uses that recognizer before constructing consumable values; application/exec-contract.ts:113-125 accepts the result as VALID.
  tests/exec-001-ticket-001.test.ts:239-268 and :270-316 reject ordinary hostile/copy objects but do not test mutation of the genuine evidence prototype.
  Read-only audit probe at the pinned HEAD obtained one genuine evidence object's exposed constructor, replaced its prototype isCanonicalEvidence method with an always-true function, built a frozen lookalike with the exact input/reference fields, and observed StructuredExecutionEnvelope.create return a valid envelope (FORGED_ACCEPTED e). A second probe supplied the same forged evidence through an injected ExecSchemaValidationPort and observed ValidateExecContract return VALID without a schema-engine call in that port (UNPROVEN_PORT_ACCEPTED).
Problem = The claimed adapter-private brand is not the decision authority used by the domain. A caller can mutate the publicly reachable verifier method and mint a frozen evidence lookalike that passes the domain gate. The receipt/compiled-schema execution is therefore not required to establish consumable proof.
Impact = Caller-controlled proof can replace canonical schema-engine authority. Invalid or future schema-constrained material can cross the application/domain boundary as a valid contract, creating an alternate EXEC authority and defeating the ticket's fail-closed/non-text-authoritative boundary. Both envelope and payload factories share this bypass.
Minimum correction required = Make evidence recognition depend on a non-mutable, non-caller-reachable adapter-issued identity/brand rather than a mutable exposed prototype method, and add an executable negative guard that mutates every exposed evidence prototype and attempts exact-input/reference forgery through both factories and ValidateExecContract.
Systemic pattern = YES
Related locations = src/domain/exec-validation-evidence-internal.ts:9-20; src/infrastructure/exec-schema-validator.ts:31-74; src/domain/exec-contract.ts:309-324, 389-455; src/application/exec-contract.ts:98-128; tests/exec-001-ticket-001.test.ts:229-237, 239-316, 621-672
```

This finding is consolidated across the envelope and payload paths because the
same evidence-recognition root cause governs both. It is not a foreign
capability duplication, legacy writer, persistence/recovery defect, or
unresolved architectural authority gap.

## 10. Architecture guards and direct audit evidence

The design requires an executable architecture guard rather than source
inspection alone (Implementation Design §20 and §22). The following guards ran
against the pinned target:

```text
ARCHITECTURE_GUARD_TESTS_RUN = 2
ARCHITECTURE_GUARD_EVIDENCE =
  tests/exec-001-ticket-001.test.ts:239-268 exercises registrar absence, hostile evidence and mutation rejection;
  tests/exec-001-ticket-001.test.ts:621-672 executes the productive import/dependency graph guard;
  node --experimental-strip-types --test tests/exec-001-ticket-001.test.ts = 20/20 PASS;
  npm test = 25/25 PASS;
  focused strict tsc command = PASS;
  npm run typecheck = PASS;
  independent prototype-mutation probes reproduced the authority bypass described in ARCH-CRITICAL-001.
MISSING_ARCHITECTURE_GUARDS = 1
```

The existing guards prove import isolation and reject ordinary copied/hostile
receipts, but no executable guard rejects mutation of the genuine exposed
adapter prototype followed by exact-input/reference forgery. The required
architecture guard is therefore incomplete despite green ordinary tests.

## 11. Audit conclusion and metrics

All required and affected architecture dimensions were audited. The canonical
contract and ownership authority are sufficient and available for local
analysis; the implementation violates the authority-preserving evidence
boundary. No authority decision is missing, and no upstream artifact was
modified.

```text
OWNERSHIP_ERRORS = 0
FOREIGN_CAPABILITY_DUPLICATION = 0
AUTHORITY_VIOLATIONS = 1
IDENTITY_VIOLATIONS = 0
IMMUTABILITY_LINEAGE_VIOLATIONS = 1
LEGACY_AUTHORITY_VIOLATIONS = 0
ARCHITECTURAL_AUTHORITY_GAPS = 0
AUTHORITY_CONSUMPTION_GAPS = 1 (informational availability record; no local blocker)
PRODUCER_CONSUMER_CONTRACT_ERRORS = 0
TEMPORAL_AUTHORITY_GAPS = 0
CALLER_SUPPLIED_AUTHORITY_BYPASSES = 1
MISSING_ARCHITECTURE_GUARDS = 1
ARCHITECTURE_GUARD_TESTS_RUN = 2

CRITICAL_FINDINGS = 1
MAJOR_FINDINGS = 0
MINOR_FINDINGS = 0
INFO_FINDINGS = 0
```

Audit: docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-001-architecture-audit.md

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
Producer/consumer contract errors: 0
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

AUDIT_TARGET_HEAD: 7bee020a59b0c44baebce8f73125672d5f87e920
AUDIT_TARGET_STATE_FINGERPRINT: e6328873c6f215a522d11911417c7fc64e74ab380fa67e56d2fa6423e347a5c7
DOMAIN_AUDIT_COMPLETE: YES
SPECIALIST_RESULT: SPECIALIST_ARCHITECTURE_FINDINGS