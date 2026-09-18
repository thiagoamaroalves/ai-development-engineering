# EXEC-001-TICKET-001 — Architecture Boundaries Audit

## Audit identity

```text
Audit: docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-001-architecture-audit.md
Specialist: ARCHITECTURE_BOUNDARIES
Ticket: EXEC-001-TICKET-001
Audit mode: READ_ONLY INDEPENDENT ADVERSARIAL ARCHITECTURE_FIRST OWNERSHIP_PRESERVING AUTHORITY_PRESERVING CROSS_SPEC_AWARE IDENTITY_AWARE LEGACY_TRANSITION_AWARE EXHAUSTIVE_WITHIN_DOMAIN
AUDIT_TARGET_HEAD: e83bc09150f9b0d7b7f4c26434926578723fef1a
CURRENT_HEAD: e83bc09150f9b0d7b7f4c26434926578723fef1a
TARGET_HEAD_MATCH: YES
AUDIT_TARGET_STATE_FINGERPRINT: 7f68eea870da956f4d8552cb155a9cc5bcfb38c048fe2f494f12f2fbdfbbba79
IMPLEMENTATION_BASELINE: 381218d5fbf8d969ee5ae5349b8f65c4cd5af7f9
WORKING_TREE_OVERLAY: documentation-only audit artifacts outside the semantic implementation subject
AUDIT_ARTIFACT_ONLY: YES
```

The pinned HEAD is present. The three dirty files reported by VCS are sibling
workflow audit artifacts and are not implementation subject matter. No source,
test, ticket state, authority, branch, commit, remote, or publication state was
changed by this audit.

### Subject paths

- Ticket: `docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-001-envelope-schema-contract.md`
- Approved design: `docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-001-implementation-design.md`
- Ticket-set audit: `docs/tickets/SPEC-EXEC-001/implementation-ticket-audit.md`
- ADR: `docs/adrs/ADR-0003-versioned-skill-contracts.md`
- Component SPEC: `docs/specs/SPEC-EXEC-001-skill-contracts-and-capability-registry.md`
- Gap Matrix: `docs/specs/gap-matrices/SPEC-EXEC-001-implementation-gap-matrix.md`
- Implementation Plan: `docs/specs/implementation-plans/SPEC-EXEC-001-implementation-plan.md`

### Semantic changed files inspected

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

## Source precedence and reconstructed architectural contract

Authority was applied in this order:

```text
ADR-0003 accepted revision 3
  > approved portfolio ownership and O-016
  > SPEC-EXEC-001 revision 3 and its conformance audit
  > validated GAP-001 and EXEC-IMP-01
  > approved implementation design
  > ticket
  > repository implementation and tests
```

### Contract reconstruction

| Contract item | Reconstructed authority and boundary |
|---|---|
| `LOCAL_OWNER` | `EXEC-001 / CANONICAL_OWNER`; envelope/payload schema shape, identifiable schema references, validation result and fail-closed contract result. ADR-0003 Decision; SPEC-EXEC-001 §§2, 9, 13, 15; ticket §§3, 7–10. |
| `LOCAL_AUTHORITIES` | `ExecContractSchemaDefinitions` owns the two canonical schema documents/references; the validation boundary returns either a complete structured pair or `CONTRACT_INVALID`. |
| `FOREIGN_OWNERS` | DOM owns `ExecutionId`, `ActivityId`, `AttemptId`, `ArtifactCycleId`, lifecycle and lifecycle-verdict authority; EXEC-001 owns contract-verdict validity; later EXEC units own registry/version resolution; PLAT owns persistence/effects/recovery; EXEC-002 owns session/context; BACKEND/OPS/UI own mappings/projections. SPEC-EXEC-001 §§2, 10, 12, 18–20. |
| `FOREIGN_CAPABILITIES_CONSUMED` | None required for local closure. The generic `.pi` delegation runtime is a regression consumer only, not schema authority. |
| `CANONICAL_IDENTITIES` | Local schema identities are exact canonical `SchemaReference` instances for `exec-envelope@1.0.0` and `exec-capability-payload@1.0.0`. DOM identity fields are opaque references carried without generation or normalization; their canonical resolution remains outside this ticket. |
| `IMMUTABILITY_RULES` | Canonical schema documents and returned contract/failure values are immutable; input is copied into returned structured values. No persisted history is created. ADR-0003; design §§7, 13–14. |
| `LINEAGE_RULES` | No local predecessor/successor or revision lineage is created. `artifactCycleId` is carried as an opaque field, not owned or resolved here. |
| `LEGACY_AUTHORITY_RULES` | `NEW_CANONICAL_PATH`; prototype and historical shapes are evidence only and cannot be silently converted into authority. Ticket §§21, 26. |
| `CUTOVER_RULES` | No legacy EXEC writer is retired by this ticket. Registry/version and historical cutover remain later EXEC/foreign boundaries. |
| `MIGRATION_AUTHORITY` | Not allocated; no migration or existing persisted state is handled. |
| `SECURITY_BOUNDARIES` | No authentication or domain authorization is allocated to EXEC-001. The contract must nevertheless reject caller-supplied validation authority. SPEC-EXEC-001 §20; ticket §10. |
| `DOES_NOT_IMPLEMENT` | Registry/version resolution, DOM identity/lifecycle, persistence/recovery, runtime/session execution, effects, transport, UI/OPS/BACKEND mappings and integrated downstream conformance. Ticket §10. |

## Applicability matrix

| Dimension | Classification | Evidence/reason |
|---|---|---|
| OWNERSHIP | REQUIRED | The ticket creates a productive EXEC boundary and must not absorb DOM, registry, persistence or consumer ownership. |
| CANONICAL_AUTHORITY | REQUIRED | Schema definitions and the result consumed as a validated contract are canonical EXEC authority for this scope. |
| CROSS_SPEC_INTEGRATION | AFFECTED | No foreign capability is needed for closure, but DOM-owned identity fields and the generic consumer boundary must not become alternate authority. |
| IDENTITY | AFFECTED | The envelope transports DOM-owned identity references and local schema identity; no identity may be regenerated or inferred from text. |
| IMMUTABILITY | AFFECTED | Returned structured values and schema definitions must be immutable; no durable history is local. |
| LINEAGE | NOT_APPLICABLE | There is no persistible aggregate, revision sequence, predecessor/successor relation or replay operation in this ticket. The cycle field is carried only. |
| LEGACY_TRANSITION | AFFECTED | This is a new canonical path and prototype/text formats must remain non-authoritative. |
| DESTRUCTIVE_TRANSITION | NOT_APPLICABLE | No legacy writer, persisted state, retirement or irreversible deletion/cutover operation is introduced. |
| MIGRATION_AUTHORITY | NOT_APPLICABLE | No migration, state conversion or persisted material is read or written. |
| SECURITY_AUTHORIZATION | NOT_APPLICABLE | The governing SPEC allocates authentication/domain authorization to other owners and this ticket adds no route, permission or capability authorization. Caller-as-authority is audited separately. |

## Ownership and canonical-authority audit

### Ownership result

```text
OWNERSHIP_CLASSIFICATION = OWNERSHIP_PRESERVED
FOREIGN_CAPABILITY_DUPLICATED = NO
FOREIGN_LIFECYCLE_OWNED_LOCALLY = NO
REPOSITORY_SEMANTIC_AUTHORITY = NO
```

`StructuredExecutionEnvelope` and `StructuredCapabilityPayload` enforce the
local structured contract only. Their execution/activity/attempt/cycle fields
are not created, resolved, progressed or persisted as local domain lifecycle.
`JsonSchemaExecValidator` translates schema-engine output and does not own
registry, DOM, effect or persistence meaning. No foreign canonical write path
or alternate lifecycle owner was introduced.

### Canonical authority result

```text
SCHEMA_DEFINITION_AUTHORITY = PRESERVED
NORMAL_VALIDATION_PATH = canonical immutable definitions → narrow validation port → typed values
AUTHORITY_CLASSIFICATION = ALTERNATE_AUTHORITY_INTRODUCED
AUTHORITY_VIOLATIONS = 1
```

The normal composition path is authority-preserving: `ExecContractSchemaDefinitions`
provides exact reference/document identities; the infrastructure adapter rejects
custom definitions; `ValidateExecContract` requires successful evidence for
both sides; and the value constructors require the exact canonical references.

However, `src/domain/exec-validation-evidence-internal.ts:21-38` exports
`recordCanonicalValidationEvidence` and accepts any structural
`SchemaValidationAdapterReceipt`. A caller can provide
`{ hasValidated: () => true }`, issue an evidence object, and pass it to the
public `StructuredExecutionEnvelope.create`/`StructuredCapabilityPayload.create`
boundaries. An independent runtime probe produced a `VALID` result from
`new ValidateExecContract(fake).validate(...)` for raw input without JSON Schema
validation. This is a competing validation-authority route, not merely a test
fixture or adapter substitution.

## Cross-spec integration and capability proofs

### Authority consumption proof

```text
CAPABILITY_ID = UNIT-EXEC-SCHEMA-HARNESS
AUTHORITY_EXISTENCE = YES; ADR-0003/O-016 and EXEC-ENVELOPE-001/002
TRUTH_OWNER = SPEC-EXEC-001 / EXEC-001
AUTHORITY_SEMANTIC_SOURCE = ADR-0003 Decision; SPEC-EXEC-001 §§9, 13
OWNER_DOMAIN_OR_BOUNDED_CONTEXT = EXEC-001
CONSUMPTION_CONTRACT = identifiable envelope and capability-payload schemas plus fail-closed validation result
PORT_INTERFACE_QUERY_RESOLVER_OR_READER = ExecSchemaValidationPort
CONTRACT_PRODUCER = ticket-owned schema definitions and canonical adapter
CONTRACT_CONSUMER = ValidateExecContract and later EXEC consumers
RETURNED_DATA = schema-valid structured envelope/payload or CONTRACT_INVALID with references/issues
VERSION_REVISION_TRANSPORT = schema references carry schema ID and 1.0.0; registry version resolution is out of scope
FAILURE_NOT_FOUND_STALE_SEMANTICS = malformed/invalid/unproven validation fails CONTRACT_INVALID; no partial value
AUTHORITY_STATUS = DEFINED
CONTRACT_STATUS = DEFINED
SEMANTIC_STATUS = DEFINED
LOCAL_TESTABILITY = YES
PRODUCTIVE_AVAILABILITY = NO; no foreign productive producer is required
CAPABILITY_SUMMARY_STATUS = CONTRACT_TESTABLE_LOCALLY
DEPENDENCY_CLASS = INFORMATIONAL
AVAILABILITY_EVIDENCE = direct focused contract harness at the consumer execution point
BLOCKING_EFFECT = NONE
RESULT = LOCAL_CONTRACT_CONSUMPTION_PROVABLE; productive-availability gap is non-blocking and not promoted
```

No foreign capability is consumed for local closure. The unit-owned harness is
not represented as a foreign productive producer. The discovered authority
route is a local canonical-authority failure, not a producer/consumer
availability failure.

### Producer/consumer contract proof

```text
CAPABILITY_ID = UNIT-EXEC-SCHEMA-HARNESS
AUTHORITY_OWNER = SPEC-EXEC-001
PRODUCER = ticket-owned canonical schema definitions plus adapter
PRODUCED_CONTRACT = identifiable envelope/payload validation result and typed structured values
CONSUMER = ValidateExecContract; later EXEC contract consumers
SEMANTIC_STATUS = DEFINED
LOCAL_TESTABILITY = YES
PRODUCTIVE_AVAILABILITY = NO
AVAILABILITY_EVIDENCE = tests/exec-001-ticket-001.test.ts and four ticket evidence files
AVAILABILITY_CONDITION = local contract harness is executable at closure
DEPENDENCY_CLASS = INFORMATIONAL
DEPENDENCY_EDGE = local schema contract → EXEC consumers
```

The contract record is complete. The fake-receipt route violates the producer's
authority boundary, but does not create a second foreign capability or a hidden
cross-SPEC dependency.

## Identity, immutability and lineage audit

### Identity

```text
IDENTITY_RESULT = CONFORMANT_FOR_TICKET_SCOPE
IDENTITY_VIOLATIONS = 0
```

Schema identity is exact-object based and cannot be replaced by a
runtime-created look-alike reference. Envelope identity fields are preserved as
opaque strings, without trim/normalization or regeneration. Canonical DOM
resolution and attachment are explicitly outside this ticket; this result does
not promote caller strings to DOM authority for later lifecycle decisions.

### Immutability

```text
IMMUTABILITY_RESULT = CONFORMANT
LINEAGE_RESULT = NOT_APPLICABLE
IMMUTABILITY_LINEAGE_VIOLATIONS = 0
```

Schema documents are deeply frozen. Validated envelope/payload values clone
structured input and freeze the returned values; the pair and failure result are
frozen. No history, persistence revision or reconstruction path is introduced,
so no local lineage violation is present.

## Legacy, cutover and destructive-transition audit

```text
LEGACY_RESULT = TRANSITION_CONFORMANT
LEGACY_AUTHORITY_VIOLATIONS = 0
DESTRUCTIVE_TRANSITION = NOT_APPLICABLE
REPLACEMENT_PROVEN = NOT_APPLICABLE
CUTOVER_AUTHORIZED = NOT_APPLICABLE
PRE_TRANSITION_GATES_SATISFIED = NOT_APPLICABLE
POST_TRANSITION_GUARDS_PRESENT = NOT_APPLICABLE
ROLLBACK_OR_ROLL_FORWARD_SEMANTICS_DEFINED = NOT_APPLICABLE
```

The implementation uses a new canonical path and does not import prototype or
text authority. There are no legacy EXEC writers or destructive state changes
in this unit. Later registry/version cutover and historical replay remain
outside scope.

## Migration and authorization boundaries

```text
MIGRATION_RESULT = MIGRATION_AUTHORITY_PRESERVED (NOT_APPLICABLE)
AUTHORIZATION_RESULT = NOT_APPLICABLE
```

There is no migration or persisted material. No authentication, authorization
route, secret, or effect permission is added. The contract's authority check is
still material because a forged validation receipt can make untrusted input
look schema-authorized; that issue is reported below as a canonical-authority
and caller-authority violation, not as a user authorization finding.

## Temporal authority and caller-as-authority checks

```text
TEMPORAL_AUTHORITY_PROOF = NOT_APPLICABLE
TEMPORAL_AUTHORITY_GAPS = 0
CALLER_AS_AUTHORITY_CHECK = FAIL
CALLER_SUPPLIED_AUTHORITY_BYPASS = 1
```

The normal operation observes no mutable external authority before an effect;
validation is side-effect free. Nevertheless, a caller can supply a fake
receipt issuer through the reachable internal module and replace canonical
schema validation with caller assertion. This is a caller-supplied authority
bypass even though no lifecycle or external effect is committed locally.

## Architecture scope and guards

```text
ARCHITECTURAL_SCOPE = UNAUTHORIZED_ARCHITECTURAL_EXPANSION
ARCHITECTURAL_AUTHORITY_GAP_DISCOVERED = NO
MISSING_ARCHITECTURE_GUARDS = 1
ARCHITECTURE_GUARD_TESTS_RUN = 8
```

The approved design requires an executable architecture guard against
caller-mintable authority and forbidden productive dependencies. The focused
20-test suite ran and passed. The eight relevant guard/boundary tests cover
canonical adapter use, caller-selected schema rejection, custom schema
rejection, always-true adapter rejection, former issuer/registration export
checks, forged evidence/reference rejection, productive import-graph isolation,
and generic-consumer text-only rejection. The guard suite does not exercise the
actual exported `recordCanonicalValidationEvidence` route with a forged receipt;
that missing negative witness is the missing guard.

The import-graph guard found the productive composition graph limited to the six
EXEC source modules and permitted `typebox` only in the infrastructure adapter.
No productive `.pi`, prototype, transport, filesystem, UI, database or DOM
import was found.

## Findings

### ARCH-CRITICAL-001 — Caller-reachable evidence issuer creates alternate schema authority

```text
Finding ID = ARCH-CRITICAL-001
Severity = CRITICAL
Ticket = EXEC-001-TICKET-001
Normative authority = ADR-0003 Decision; SPEC-EXEC-001 §§2, 9, 13, 15, 20; EXEC-ENVELOPE-001/002; ticket §§7, 9, 10, 15; design §§9, 13, 16–18, 20
Owner = EXEC-001 / canonical contract-validation boundary
Affected boundary = schema-validation evidence → StructuredExecutionEnvelope/StructuredCapabilityPayload → ValidateExecContract
Repository evidence = src/domain/exec-validation-evidence-internal.ts:11-38 exports recordCanonicalValidationEvidence and trusts any structural hasValidated receipt; src/domain/exec-contract.ts:309-323 and :389-457 accept only the WeakSet-issued evidence; src/infrastructure/exec-schema-validator.ts:78-82 is the legitimate caller; tests/exec-001-ticket-001.test.ts:239-262 checks former issuer names but not the actual issuer route
Problem = A caller can import the repository-reachable internal module, supply hasValidated: () => true, issue WeakSet-recognized evidence for a candidate raw input and canonical references, then construct a validated envelope/payload or obtain VALID from the application boundary without canonical JSON Schema execution.
Impact = Candidate input that has not passed the canonical schema adapter can be promoted to the consumable EXEC contract. This introduces an alternate validation authority and defeats the ticket's fail-closed boundary; downstream consumers can receive a value that falsely carries schema-validation authority. The same bypass applies to both envelope and payload paths and is therefore systemic.
Minimum correction required = Remove the caller-reachable evidence-issuance route and make issuance depend on an unforgeable canonical adapter capability that callers cannot manufacture or invoke as an issuer. Add an executable negative architecture guard covering direct issuer import, forged receipt, both value constructors and the application VALID result; preserve the existing canonical schema path and fail-closed behavior.
Systemic pattern = YES
Related locations = src/domain/exec-validation-evidence-internal.ts:21-38; src/domain/exec-contract.ts:309-323, :389-457; src/application/exec-contract.ts:98-126; src/infrastructure/exec-schema-validator.ts:37-82; tests/exec-001-ticket-001.test.ts:239-326
```

### Direct adversarial evidence

The following read-only runtime probe was independently executed against the
pinned target (not added to the repository): a fake receipt returning `true`
was passed to `recordCanonicalValidationEvidence`, then to the public value
factory; a second probe passed the forged evidence through
`ValidateExecContract`. Results were respectively:

```text
FORGED_EVIDENCE_ACCEPTED e
VALID FORGED_VALIDATED_CONTRACT
```

This finding remains despite the ordinary focused and repository regression
suites being green, because those suites do not cover the actual caller-reachable
issuer path.

## Audit result matrix

| Area | Result | Count/findings |
|---|---|---:|
| Ownership errors | OWNERSHIP_PRESERVED | 0 |
| Foreign capability duplication | NONE | 0 |
| Authority violations | ALTERNATE_AUTHORITY_INTRODUCED | 1 |
| Identity violations | CONFORMANT | 0 |
| Immutability/lineage violations | CONFORMANT / NOT_APPLICABLE | 0 |
| Legacy authority violations | TRANSITION_CONFORMANT | 0 |
| Architectural authority gaps | NONE; authority is defined, implementation bypass found | 0 |
| Authority consumption gaps | NONE for local closure | 0 |
| Producer/consumer contract errors | NONE | 0 |
| Temporal authority gaps | NOT_APPLICABLE | 0 |
| Caller-supplied authority bypasses | PRESENT | 1 |
| Missing architecture guards | Present for forged issuer route | 1 |
| Architecture guard tests run | Focused executable boundary guards | 8 |

## Verification evidence

```text
FOCUSED_TICKET_TEST = PASS (20/20; node --experimental-strip-types --test tests/exec-001-ticket-001.test.ts)
FOCUSED_SOURCE_TYPECHECK = PASS (strict tsc over six touched production modules and ticket test)
REPOSITORY_REGRESSION = PASS (npm test; 25/25 generic workflow-orchestrator tests)
DIRECT_FORGED_RECEIPT_PROBE = FAILS_REQUIRED_GUARD (forged evidence was accepted)
```

The ordinary test and typecheck results prove executable behavior and static
consistency only; they do not close the discovered architecture route.

## Specialist summary

Audit: `docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-001-architecture-audit.md`

Specialist:
`ARCHITECTURE_BOUNDARIES`

Ticket: `EXEC-001-TICKET-001`

Ownership errors: `0`

Foreign capability duplication: `0`

Authority violations: `1`

Identity violations: `0`

Immutability/lineage violations: `0`

Legacy authority violations: `0`

Architectural authority gaps: `0`
Authority consumption gaps: `0`
Producer/consumer contract errors: `0`
Temporal authority gaps: `0`
Caller-supplied authority bypasses: `1`
Missing architecture guards: `1`
Architecture guard tests run: `8`

Findings:
`CRITICAL=1`
`MAJOR=0`
`MINOR=0`
`INFO=0`

Domain audit complete:
`YES`

Specialist result:
`SPECIALIST_ARCHITECTURE_FINDINGS`

AUDIT_TARGET_HEAD: e83bc09150f9b0d7b7f4c26434926578723fef1a
AUDIT_TARGET_STATE_FINGERPRINT: 7f68eea870da956f4d8552cb155a9cc5bcfb38c048fe2f494f12f2fbdfbbba79
DOMAIN_AUDIT_COMPLETE: YES
SPECIALIST_RESULT: SPECIALIST_ARCHITECTURE_FINDINGS