# Architecture Boundaries Audit — EXEC-001-TICKET-001

## 1. Audit identity and basis

```text
AUDIT_SKILL = audit-architecture-boundaries
AUDIT_MODE = READ_ONLY INDEPENDENT ADVERSARIAL ARCHITECTURE_FIRST
             OWNERSHIP_PRESERVING AUTHORITY_PRESERVING CROSS_SPEC_AWARE
             IDENTITY_AWARE LEGACY_TRANSITION_AWARE EXHAUSTIVE_WITHIN_DOMAIN
TICKET_ID = EXEC-001-TICKET-001
TICKET_PATH = docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-001-capability-specific-envelope-and-payload-schemas.md
IMPLEMENTATION_DESIGN_PATH = docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-001-implementation-design.md
TICKET_SET_AUDIT_PATH = docs/tickets/SPEC-EXEC-001/implementation-ticket-audit.md
IMPLEMENTATION_BASELINE = 8cf79cd37ebb02d0657c1fb191cea1d194b71f89
CURRENT_HEAD = b68eb87d8afc21b5683e89f4ecd3aee8d8238306
AUDIT_TARGET_HEAD = b68eb87d8afc21b5683e89f4ecd3aee8d8238306
AUDIT_TARGET_STATE_FINGERPRINT = 70f7ea178eabee7cef5e588756b093c1de366d85ce9171e05e2235e091996675
AUDIT_WAVE_ID = c4a46405-1314-4c2a-9af5-048cea009662
WORKTREE_MODE = DIRECT
TICKET_STATUS_AT_AUDIT = VALIDATION_REQUIRED
```

The pinned commit is the implementation subject. A pre-existing working-tree
overlay was covered by the supplied state fingerprint and was not attributed
to this ticket. No production source, test, ticket, authority artifact, Git
state, commit, branch, remote, or publication state was changed by this audit.
Only this specialist artifact is written.

### Implementation-relevant changed files

The target implementation delta from `IMPLEMENTATION_BASELINE` contains these
runtime/test paths:

```text
src/application/exec-contract.ts
src/domain/exec-contract.ts
src/domain/exec-schema.ts
src/domain/exec-validation-evidence-internal.ts
src/infrastructure/exec-schema-validator.ts
tests/exec-001-ticket-001.test.ts
```

`src/composition/exec-contract.ts` was also inspected as the productive
composition root, although it is unchanged by the ticket delta. The target
commit also contains checkpoint, evidence, audit/documentation, and workflow
orchestrator paths; those do not become ticket-owned runtime authority and are
not treated as implementation evidence for this audit.

## 2. Source precedence and reconstructed contract

Authority was read and applied in this order:

1. `docs/adrs/ADR-0003-versioned-skill-contracts.md` (`ACCEPTED`): every skill
   emits a JSON-Schema-validated common envelope plus capability-specific
   payload; human text has no operational authority; invalid JSON/schema is a
   contract failure.
2. `docs/specs/SPEC-PORTFOLIO-001-organization.md` revision 2, O-016:
   `SPEC-EXEC-001` is the sole `CANONICAL_OWNER` for the contract obligation;
   DOM, registry/source, persistence, runtime, transport and presentation
   owners remain foreign.
3. `docs/specs/SPEC-EXEC-001-skill-contracts-and-capability-registry.md`
   revision 5, especially O-016 and `EXEC-ENVELOPE-001/002`: identifiable
   envelope/payload schemas precede contract consumption, required structured
   envelope fields are explicit, and text cannot fill missing authority.
4. `docs/specs/gap-matrices/SPEC-EXEC-001-implementation-gap-matrix.md`,
   `GAP-018`: the former generic payload path is insufficient; capability-
   appropriate identifiable schema selection and validation are required.
5. `docs/specs/implementation-plans/SPEC-EXEC-001-implementation-plan.md`,
   `EXEC-IMP-01`: this unit may own schema identity, capability-specific
   selection, validation result and structured fields; registry resolution,
   source publication, DOM identity/lifecycle, persistence and effects remain
   outside scope.
6. The ticket and approved design preserve that boundary and explicitly classify
   downstream mappings as integrated-proof-only.
7. Repository implementation and tests are evidence only.

### Contract reconstruction

```text
LOCAL_OWNER = SPEC-EXEC-001 / EXEC-001 / CANONICAL_OWNER
LOCAL_AUTHORITIES = immutable envelope and capability-payload schema definitions;
                    schema references; exact capability/schema/version selection;
                    structured minimum fields; CONTRACT_INVALID meaning;
                    owner-bound validation evidence consumed at this boundary
FOREIGN_OWNERS = DOM canonical execution/activity/attempt identities, snapshot,
                 lifecycle and verdict meaning; registry/catalog resolution and
                 publication; REPO/BOOTSTRAP source material; PLAT persistence,
                 integrity, CAS and recovery; runtime/session, transport,
                 BACKEND/OPS/UI mappings and external effects
FOREIGN_CAPABILITIES_CONSUMED = none for local closure; DOM references remain opaque
CANONICAL_IDENTITIES = exact owner-created SchemaReference instances for
                       exec-envelope@1.0.0 and
                       exec-capability-001-payload@1.0.0; capability-001 association;
                       execution/activity/etc. fields are foreign opaque references
IMMUTABILITY_RULES = schema documents, definition objects, definition collections,
                     authenticated successful evidence, structured values, complete
                     pair and failures are frozen or copied/frozen; no durable history
LINEAGE_RULES = NOT_APPLICABLE to this in-memory validation unit; schema version is
                contract identity, not aggregate/revision lineage
LEGACY_AUTHORITY_RULES = generic exec-capability-payload acceptance is retired;
                          no legacy writer/read path may regain authority
CUTOVER_RULES = new identifiable capability-specific path is canonical;
                unknown/mismatched capability/schema/version fails closed;
                no silent conversion or generic fallback
MIGRATION_AUTHORITY = NOT_APPLICABLE; no persisted state or migration is introduced
SECURITY_BOUNDARIES = humanText is non-authoritative; caller cannot select schema
                      documents; invalid results carry no approval/checkpoint/effect;
                      validation evidence must be issuer-bound and input-bound
DOES_NOT_IMPLEMENT = registry resolution/publication, DOM identity/lifecycle/snapshot,
                     persistence/recovery, execution/session runtime, transport,
                     external effects, UI/OPS/presentation and final cross-SPEC proof
```

## 3. Applicability matrix

| Dimension | Classification | Evidence and result |
|---|---|---|
| OWNERSHIP | REQUIRED | Production behavior changes in the EXEC contract boundary. EXEC owns the schema contract; no foreign lifecycle/persistence owner is absorbed. |
| CANONICAL_AUTHORITY | REQUIRED | The ticket replaces generic payload acceptance with canonical definition selection and authenticated validation evidence. |
| CROSS_SPEC_INTEGRATION | AFFECTED | The approved EXEC→DOM relationship remains context only; no DOM or other foreign capability is consumed locally. The boundary must not promote opaque IDs or local fixtures to foreign authority. |
| IDENTITY | AFFECTED | Schema identity and capability/schema/version tuples are selected and carried. DOM identities are intentionally opaque and not regenerated. |
| IMMUTABILITY | REQUIRED | Definitions/documents, validation evidence, structured values and failures must remain stable after issuance. |
| LINEAGE | NOT_APPLICABLE | No aggregate, persisted revision, predecessor/successor, retry, history, or derived artifact is created by this unit; there is no lineage contract to reconstruct. |
| LEGACY_TRANSITION | AFFECTED | The generic payload schema path is retired in favor of the new canonical capability-specific path. |
| DESTRUCTIVE_TRANSITION | NOT_APPLICABLE | No durable data, state, writer, migration, or irreversible store transition is deleted or rewritten. |
| MIGRATION_AUTHORITY | NOT_APPLICABLE | No migration logic or persisted material is introduced; future registry/source migration remains outside this ticket. |
| SECURITY_AUTHORIZATION | AFFECTED | A validated contract is an authority-bearing boundary before downstream consumption. Caller-injected schema-validation evidence must not become success authority. |

Every `NOT_APPLICABLE` row is bounded by the absence of persistence, lifecycle,
foreign-source consumption, migration and destructive state changes in the
changed behavior.

## 4. Ownership and canonical-authority audit

### Ownership

`ExecContractSchemaDefinitions` in `src/domain/exec-schema.ts:160-203`
owns the immutable envelope and payload definition set and exact local
selection. `ValidateExecContract` in
`src/application/exec-contract.ts:79-142` orchestrates selection, validation,
normalization and all-or-nothing pair construction. The JSON-Schema adapter in
`src/infrastructure/exec-schema-validator.ts:26-106` is a technical adapter.
The productive root at `src/composition/exec-contract.ts:1-9` wires that
adapter without introducing a second domain owner.

No local code creates DOM lifecycle state, registry/catalog state, source
publication state, persistence/recovery state, approval state or external
effects. No foreign capability is duplicated. The ordinary ownership result is
therefore:

```text
OWNERSHIP = OWNERSHIP_PRESERVED
FOREIGN_CAPABILITY_DUPLICATED = 0
FOREIGN_LIFECYCLE_OWNERSHIP = 0
REPOSITORY_SEMANTIC_AUTHORITY = 0
```

The validation-evidence issuer boundary is an authority/provenance defect,
not a foreign lifecycle ownership defect; it is reported as
`ALTERNATE_AUTHORITY_INTRODUCED` below.

### Canonical authority

The target correctly:

- changes `EXEC_PAYLOAD_SCHEMA_ID` to the identifiable
  `exec-capability-001-payload` and associates it with `capability-001`
  (`src/domain/exec-contract.ts:13-16`);
- freezes canonical schema documents and definition objects
  (`src/domain/exec-schema.ts:68-92`, `98-179`);
- selects only an exact capability/schema/version tuple
  (`src/domain/exec-schema.ts:181-187`);
- passes the selected owner definition to the validator before constructing
  values (`src/application/exec-contract.ts:101-133`);
- rejects the former generic schema ID and unknown capability by failing
  selection closed; and
- retains `CONTRACT_INVALID` with no approval, checkpoint or effect flags for
  invalid paths (`src/domain/exec-contract.ts:594-633`).

The canonical definition membership check in
`src/domain/exec-schema.ts:212-219` rejects copied, getter-backed or custom
schema definition objects before the adapter reads their replaceable fields.
The canonical `SchemaReference` checks in
`src/domain/exec-contract.ts:327-334` and value-construction checks preserve
owner-created schema-reference identity.

These paths preserve schema-selection authority:

```text
SCHEMA_SELECTION = AUTHORITY_PRESERVED
SCHEMA_DEFINITION_OWNER = EXEC-001
CANONICAL_WRITE_PATHS = one local immutable definition/selection path;
                        no durable canonical write exists
PROJECTION_USED_AS_AUTHORITY = NO
```

However, successful validation evidence is not restricted to an authorized
issuer. `AuthenticatedExecSchemaValidationPort` is publicly re-exported by
`src/domain/exec-schema.ts:17-21`; its constructor records every instance in
`AUTHENTICATED_PORTS` and its protected method
`issueValidatedResult` records every result in `ISSUED_RESULTS`
(`src/domain/exec-validation-evidence-internal.ts:7-75`). A caller-created
subclass can call that method, produce a frozen result with the expected shape,
input, schema reference and fingerprint, and then pass the instance to
`ValidateExecContract`. The consumer only verifies the same caller-created
instance/result membership at
`src/application/exec-contract.ts:47-58`; it does not verify that the issuer
performed canonical schema validation or that the issuer is the canonical
adapter/owner.

The direct executable probe used for this audit was:

```text
class CallerIssuer extends AuthenticatedExecSchemaValidationPort {
  validate(schema, value) {
    return this.issueValidatedResult({
      valid: true, issues: [], validatedInput: value,
      schemaReference: schema.reference,
      contentFingerprint: structuredContentFingerprint(value)
    })
  }
}
new ValidateExecContract(new CallerIssuer()).validate(validInput()).status
= VALID
```

This is an authority-proof bypass even when the particular input is otherwise
valid: the consumer accepts a result as schema proof without canonical schema
execution. The existing domain constructors provide useful defense in depth,
but they do not make caller-issued validation evidence canonical, and they do
not preserve the required issuer/provenance boundary as schemas evolve.

```text
AUTHORITY = ALTERNATE_AUTHORITY_INTRODUCED
AUTHORITY_VIOLATIONS = 1
CALLER_SUPPLIED_AUTHORITY_BYPASS = 1
```

## 5. Cross-spec and authority-consumption audit

The local unit has no foreign producer required for local execution or closure.
The DOM dependency is intentionally not invoked; execution/activity/attempt and
cycle values are opaque fields. No registry, REPO, BOOTSTRAP, PLAT, runtime,
transport or UI authority is consumed or re-created.

### Local producer/consumer record

```text
CAPABILITY_ID = EXEC-SCHEMA-CAPABILITY-PAYLOAD
AUTHORITY_EXISTENCE = O-016 / EXEC-ENVELOPE-001/002 in SPEC-EXEC-001 revision 5
TRUTH_OWNER = EXEC-001
AUTHORITY_SEMANTIC_SOURCE = immutable identifiable envelope and capability schema definitions
OWNER_DOMAIN_OR_BOUNDED_CONTEXT = EXEC-001
CONSUMPTION_CONTRACT = ValidateExecContract selects the immutable owner definition;
                       the validation port validates that selected definition
PORT_INTERFACE_QUERY_RESOLVER_OR_READER = ExecSchemaValidationPort
CONTRACT_PRODUCER = ExecContractSchemaDefinitions plus the selected validation producer
CONTRACT_CONSUMER = ValidateExecContract and the structured EXEC values
RETURNED_DATA = selected schema reference/definition, bound input, validation outcome,
                content fingerprint and complete validated pair or failure
VERSION_REVISION_TRANSPORT = SchemaReference exact semantic version; no registry or
                             persistence revision is introduced here
FAILURE_NOT_FOUND_STALE_SEMANTICS = unknown/mismatched selection, invalid input,
                                     malformed result, stale input or thrown adapter
                                     result fails as CONTRACT_INVALID with no partial pair
AUTHORITY_STATUS = DEFINED
CONTRACT_STATUS = DEFINED
SEMANTIC_STATUS = DEFINED
LOCAL_TESTABILITY = YES
PRODUCTIVE_AVAILABILITY = NO for the explicitly recorded fixture/harness capability;
                          that fixture is not promoted and is INFORMATIONAL only
CAPABILITY_SUMMARY_STATUS = CONTRACT_TESTABLE_LOCALLY for the fixture record
DEPENDENCY_CLASS = INFORMATIONAL
BLOCKING_EFFECT = NONE; no foreign capability is required for local closure
RESULT = no external AUTHORITY_CONSUMPTION_GAP; evidence-issuer provenance defect
         is separately reported as ARCH-CRITICAL-001
```

This preserves the shared availability distinction: the local fixture is not
claimed as a productive foreign producer, and no READY/local-closure claim
depends on it. The real composition root uses the local canonical adapter; the
problem is that the public alternate-adapter issuer protocol admits an
unauthorized producer.

```text
CROSS_SPEC_RESULT = CROSS_SPEC_CONFORMANT for the bounded local scope
AUTHORITY_CONSUMPTION_GAPS = 0
PRODUCER_CONSUMER_CONTRACT_ERRORS = 1
```

The producer/consumer error is the missing authorized issuer guarantee, not an
unavailable foreign dependency.

## 6. Identity, immutability and lineage audit

### Identity

```text
IDENTITY_RESULT = CONFORMANT
```

`SchemaReference` instances are created by the contract boundary and the two
canonical references are exact module-owned objects
(`src/domain/exec-contract.ts:182-223`, `303-315`). Schema ID, schema version
and capability ID are compared against owner definitions before construction.
The validated envelope/payload preserve the same schema references and do not
infer identity from human text or mutable labels. Execution/activity/attempt,
assignment and cycle values remain opaque strings as required by the
EXEC/DOM ownership boundary; they are not normalized into local DOM identity.
No accidental ID regeneration or mutable-display-field identity was found.

### Immutability

```text
IMMUTABILITY_RESULT = CONFORMANT (with the separate issuer provenance defect)
```

Schema documents are recursively frozen (`exec-schema.ts:68-92`), definition
objects and the definition collection are frozen (`160-179`), successful
results and issue arrays are frozen (`exec-validation-evidence-internal.ts:53-74`),
and structured values/failures clone and freeze their data
(`exec-contract.ts:99-180`, `437-617`). The focused target test run passed the
immutability, mutation and no-partial-result checks. No historical record or
current-state convenience writer exists in this unit.

### Lineage and reconstruction

```text
LINEAGE_RESULT = NOT_APPLICABLE
AGGREGATE_IDENTITY_PROOF = NOT_APPLICABLE — no Aggregate Root/entity
AGGREGATE_RECONSTRUCTION_PROOF = NOT_APPLICABLE — no persisted non-initial state
```

This unit creates no persisted aggregate, revision, predecessor/successor,
replay record, durable snapshot, migration record or derived artifact. A
persistence revision, lineage relation and rehydration validator are not
silently invented.

## 7. Legacy, cutover, destructive transition and migration audit

```text
LEGACY_READS = none
LEGACY_WRITES = none
NEW_CANONICAL_PATH = exec-capability-001-payload + capability-001 + exact version
GENERIC_FALLBACK = absent
LEGACY_RESULT = TRANSITION_CONFORMANT
LEGACY_AUTHORITY_VIOLATIONS = 0
DESTRUCTIVE_TRANSITION = NOT_APPLICABLE
MIGRATION_AUTHORITY = NOT_APPLICABLE
```

The old generic `exec-capability-payload` identifier is not selected by
`selectPayload`; the selected schema document requires the exact new schema ID,
version, capability ID and `data.result`. No compatibility conversion or
legacy writer remains in the changed runtime path. This is a new canonical
path, not a destructive persistence cutover.

## 8. Security/authorization and caller-authority audit

The application correctly ignores `humanText`, rejects caller-selected schema
identities/documents, rejects copied/untrusted wrappers and binds genuine
successful receipts to exact input identity plus a content fingerprint. Invalid
results are explicitly marked `noApproval`, `noCheckpoint` and `noEffect`.
The productive import graph guard also keeps prototype, `.pi`, transport,
filesystem and other forbidden surfaces out of the EXEC composition path.

The authorization-sensitive issuer path is not conformant. The following
caller-controlled choice becomes authority-bearing:

```text
caller creates subclass of exported AuthenticatedExecSchemaValidationPort
  -> protected issueValidatedResult is callable by that subclass
  -> subclass is inserted into AUTHENTICATED_PORTS by its public construction
  -> subclass returns the issuer-recorded result
  -> ValidateExecContract accepts membership as schema-validation provenance
  -> result.status = VALID
```

```text
CALLER_AS_AUTHORITY_CHECK = FAIL
CALLER_SUPPLIED_AUTHORITY_BYPASS = YES
SECURITY_AUTHORIZATION_RESULT = NON_CONFORMANT
```

The existing test named `rejects a caller-created always-true subtype at the
owner-proof boundary` (`tests/exec-001-ticket-001.test.ts:359-416`) overrides
`validate` and returns a raw result; it does not invoke the inherited protected
issuer. It therefore does not guard the actual public-subclass issuance route.
The test asserting the evidence boundary (`:418-451`) also confirms that the
base issuer is publicly exported, which is the relevant exposure.

## 9. Temporal authority and provenance audit

### Temporal authority

```text
TEMPORAL_AUTHORITY_PROOF = NOT_APPLICABLE
TEMPORAL_AUTHORITY_GAPS = 0
```

The ticket does not observe mutable external canonical truth and then commit an
external effect. Schema definitions are immutable local values. Genuine input
staleness is nevertheless checked by re-fingerprinting current input during
value construction (`exec-contract.ts:391-415`) and by the adapter's current
schema check (`exec-schema-validator.ts:46-55`). This is stale-input
protection, not a missing mutable-authority revalidation sequence.

### Authority provenance / anti-forgery record

```text
PROOF_ISSUER_OWNER = EXEC-001 canonical schema-validation owner / productive adapter
PROOF_SCOPE = exact ticket-owned selected schema definition and exact input object
PROOF_IDENTITY_OR_BRAND = producer/result WeakSet membership held in the evidence
                           module; membership is not owner-only because the exported
                           base class registers caller-created subclasses
CONSUMER_VERIFICATION_RULE = exact successful-result shape, producer membership,
                             schema reference, input identity, content fingerprint,
                             own required fields and domain minimums before value construction
STALE_OR_MUTATION_POLICY = genuine receipt fingerprint/current-schema and own-field
                           checks reject changed or inherited input; a forged producer
                           can mint a fresh fingerprint without schema execution
FORGERY_NEGATIVE_TEST = raw result, copied result, copied adapter, custom schema,
                        runtime reference and untrusted-wrapper tests reject those paths
CALLER_INJECTION_NEGATIVE_TEST = caller-selected schema IDs/documents and generic/
                                 unknown capability tests reject direct input injection
ALTERNATE_ADAPTER_CONTRACT_TEST = positive independent adapter test passes, but the
                                  contract is insufficient because arbitrary subclasses
                                  can call issueValidatedResult without proving validation
ISSUER_IS_AUTHORIZED = NO for caller-created subclasses
PROOF_SCOPE_IS_EXACT = YES for shape/binding checks; authority issuer scope is PARTIAL
CONSUMER_VERIFIES_PROVENANCE = PARTIAL — verifies self-issued membership, not canonical issuer
INPUT_OR_REFERENCE_BINDING = YES for the supplied result/input/reference
MUTATION_OR_STALE_REJECTION = YES for genuine evidence
FORGERY_PATH_REJECTED = NO for protected-issuer subclass path
CALLER_INJECTION_REJECTED = PARTIAL — direct input injection rejected; issuer injection accepted
ALTERNATE_ADAPTER_CONTRACT = FAIL for owner authorization; PASS only for the positive
                               explicitly implemented adapter example
```

## 10. Systemic boundary expansion / root-cause campaign

Because the defect is a reusable authority/provenance protocol defect, it is
tracked as one systemic campaign within this audit. No sibling audit artifact
is used or modified.

```text
ROOT_CAUSE_CAMPAIGN_ID = RCC-EXEC-SCHEMA-PROVENANCE-001
ROOT_CAUSE_ID = caller-reachable validation-evidence issuer
CAMPAIGN_STATUS = OPEN
CAMPAIGN_SCOPE = EXEC-001-TICKET-001 schema validation and evidence boundary
CANONICAL_FINDINGS = ARCH-CRITICAL-001
```

### Required affected-surface matrix

| Surface row | Class | Location | Owner | Normative obligation | Current behavior | Expected behavior | Coverage | Negative witness |
|---|---|---|---|---|---|---|---|---|
| RCC-001 | ISSUER | `src/domain/exec-validation-evidence-internal.ts:47-75` | EXEC-001 | only authorized producer may issue consumable validation proof | any caller-created subclass can invoke the protected issuer; membership is recorded | canonical owner or independently verifiable authorized producer only | MISSING | `NW-ARCH-001` returns `VALID` through caller subclass |
| RCC-002 | REGISTRAR | no schema-evidence registrar; `ExecContractSchemaDefinitions` is static at `src/domain/exec-schema.ts:160-187` | EXEC-001 | no foreign registrar may mint schema authority | no dynamic registrar exists in this unit | no registrar should be added here; future registry must consume owner proof | NOT_APPLICABLE — reason recorded; route is future registry unit | N/A |
| RCC-003 | CONSUMER | `src/application/exec-contract.ts:22-58,79-140`; `src/domain/exec-contract.ts:391-415` | EXEC-001 | consumer verifies provenance before constructing a valid contract | verifies result shape/membership/binding/fingerprint but accepts caller-registered issuer | verify canonical issuer ownership or independently authenticated producer contract | MISSING for issuer ownership | `NW-ARCH-001` |
| RCC-004 | ALTERNATE_AUTHORITY_PATH | `ValidateExecContract` validator injection `src/application/exec-contract.ts:79-85`; exported base `exec-schema.ts:17-21` | EXEC-001 | no alternate validation authority may compete with canonical schema owner | caller injects an authenticated subclass that mints evidence | injected adapter must be authorized and unable to self-authorize | MISSING | `NW-ARCH-001` |
| RCC-005 | INJECTION_POINT | `src/application/exec-contract.ts:83`; `AuthenticatedExecSchemaValidationPort` construction `exec-validation-evidence-internal.ts:48-50` | EXEC-001 | caller input/adapter cannot replace canonical proof | validator object is caller-supplied; base construction self-registers it | composition-selected producer or consumer-side owner verification | MISSING | `NW-ARCH-001` |
| RCC-006 | MUTATION_PATH | `src/infrastructure/exec-schema-validator.ts:46-55`; `src/domain/exec-contract.ts:414` | EXEC-001 | genuine proof must bind current input | genuine receipts are rechecked against current schema/fingerprint | preserve this check | COVERED | stale genuine-evidence tests pass |
| RCC-007 | STALE_PATH | `tests/exec-001-ticket-001.test.ts` stale test around `:660-750` and adapter `:46-55` | EXEC-001 | stale/mutated evidence fails closed | genuine stale and inherited-field cases fail closed | preserve and extend to forged issuer route | PARTIAL — forged issuer has no source-validation proof | `NW-ARCH-001` |
| RCC-008 | PORT_SUBSTITUTION_PATH | `ExecSchemaValidationPort` at `src/domain/exec-schema.ts:47-49`; independent adapter test `tests/...:291-342` | EXEC-001 | alternate adapters must satisfy the same authority proof | positive adapter works; base subclass can issue without semantic validation | alternate adapter must be independently authorized/verified | MISSING | `NW-ARCH-001` |
| RCC-009 | PUBLIC_EXPORT | `src/domain/exec-schema.ts:17-21` re-exports the base and recognizer | EXEC-001 | public API must not expose a caller-mintable authority route | caller can import/subclass the issuer boundary | export only a non-mintable consumer contract or owner-issued factory | MISSING | `NW-ARCH-001` |
| RCC-010 | PERSISTENCE | no persistence/repository in ticket; design §14 | EXEC-001/PLAT | no durable authority writer in this unit | none | remain outside scope | NOT_APPLICABLE — no durable state | N/A |
| RCC-011 | RETRY_RECOVERY | no retry/effect/recovery path in ticket; design §§14,18 | EXEC-001/PLAT | no recovery path may reinterpret evidence | none | remain outside scope | NOT_APPLICABLE — no effect/recovery | N/A |
| RCC-012 | LEGACY_ROUTE | old generic ID absent from runtime selection; `exec-schema.ts:140-187`, `exec-contract.ts:13-16` | EXEC-001 | generic legacy path cannot regain authority | exact new path selected; old ID fails closed | preserve retirement/no fallback | COVERED | generic-schema rejection test passes |
| RCC-013 | ARCHITECTURE_GUARD | `tests/exec-001-ticket-001.test.ts:359-416,418-451,991-1020` | EXEC-001 | executable guard must reject forbidden authority route | guards reject raw/copy/wrapper paths and import violations, but no guard exercises protected issuer call | direct subclass/protected-issuer negative guard | MISSING | `NW-ARCH-001` contradicts the intended rejection |
| RCC-014 | TEST | `tests/exec-001-ticket-001.test.ts:267-416` | EXEC-001 | direct negative witness for forgery/caller injection | raw forged result and raw subtype are tested; issuer-capable subtype is not | add direct protected-issuer negative witness | MISSING | `NW-ARCH-001` |

```text
CAMPAIGN_MATRIX_COMPLETE = YES
ALL_SURFACE_ROWS_COVERED = NO
ALL_NEGATIVE_WITNESSES_PASS = NO
NO_UNEXPLAINED_PUBLIC_AUTHORITY_PATH = NO
NO_HIDDEN_CONCRETE_PROTOCOL = NO
ROOT_CAUSE_REMOVED = NO
KNOWN_MANIFESTATIONS_CLOSED = NO
SYSTEMIC_TEST_EVIDENCE = PRESENT — focused suite plus direct adversarial probe
```

The registrar, persistence and retry/recovery rows are explicitly
`NOT_APPLICABLE` with their owner/route and are not silently omitted.

## 11. Findings

### ARCH-CRITICAL-001 — Caller-reachable validation issuer creates alternate authority

- **Severity:** `CRITICAL`
- **Ticket:** `EXEC-001-TICKET-001`
- **Normative authority:** Accepted `ADR-0003` §Decisão; `SPEC-EXEC-001`
  revision 5 O-016 / `EXEC-ENVELOPE-001` and `EXEC-CONTRACT-001`; approved
  design authority/provenance record §7; shared authority-provenance
  anti-forgery contract.
- **Owner:** `SPEC-EXEC-001 / EXEC-001 / CANONICAL_OWNER` owns the schema
  validation contract and its consumable authority proof.
- **Affected boundary:** `AuthenticatedExecSchemaValidationPort` issuance,
  `ExecSchemaValidationPort` substitution, `ValidateExecContract` validator
  injection, structured-value construction, public domain schema exports and
  the architecture guard surface.
- **Repository evidence:**
  - `src/domain/exec-validation-evidence-internal.ts:47-75` registers every
    constructed subclass instance and exposes the protected
    `issueValidatedResult` method to subclasses. The method records any
    shape-valid result as producer-issued without checking that the canonical
    schema validator ran.
  - `src/domain/exec-schema.ts:17-21` publicly re-exports the base class and
    recognizer, making the issuance protocol available to caller-defined
    subclasses.
  - `src/application/exec-contract.ts:47-58,79-85` accepts the caller-supplied
    validator and treats producer/result membership as validation provenance;
    there is no owner-only issuer check or canonical revalidation for a
    subclass-issued result.
  - `tests/exec-001-ticket-001.test.ts:359-416` tests a caller subclass that
    returns a raw result, not a subclass that invokes `issueValidatedResult`.
    `:418-451` confirms the issuer base is exported.
  - Direct executable witness `NW-ARCH-001` used a caller subclass invoking
    `issueValidatedResult`; `ValidateExecContract` returned `VALID`.
- **Problem:** The implementation's WeakSet membership is instance-authentic,
  but not owner-authentic. A caller can create an object that the consumer
  recognizes as an authenticated producer and mint the exact result shape,
  schema reference, input binding and fingerprint expected by the consumer.
  This creates an alternate validation-authority path rather than merely a
  technical adapter substitution.
- **Impact:** Schema-validation evidence is not canonical proof. Downstream
  consumers may consume a contract whose success was issued by an untrusted
  caller adapter; the current constructor defenses reduce some malformed-data
  impact but do not preserve issuer provenance and can be bypassed as schema
  semantics evolve. The defect violates the caller-as-authority and
  authority-provenance boundaries and leaves the required architecture guard
  absent.
- **Minimum correction required:** Close successful-evidence issuance behind a
  canonical owner-only, non-caller-mintable issuer/factory, or require every
  alternate producer to carry independently verifiable owner authorization and
  have the consumer verify it. Remove the public caller-reachable issuance
  route (or separate it from production authority), and add a direct executable
  negative witness that a caller subclass invoking the former route cannot
  produce a consumable `VALID` result. Do not repair this with source inspection
  or a test-only assertion.
- **Systemic pattern = YES**
- **Related locations:**
  `src/domain/exec-validation-evidence-internal.ts:7-103`,
  `src/domain/exec-schema.ts:12-21,41-49`,
  `src/application/exec-contract.ts:22-58,79-140`,
  `src/infrastructure/exec-schema-validator.ts:37-92`,
  `src/composition/exec-contract.ts:1-9`,
  `tests/exec-001-ticket-001.test.ts:267-416,418-451,561-620,991-1020`.
  Related campaign rows: `RCC-001`, `RCC-003`–`RCC-009`, `RCC-013` and
  `RCC-014`.

No additional ownership, identity, immutability, lineage, legacy, migration,
destructive-transition or unresolved-architecture-authority finding was found.
The single finding is systemic within the affected evidence boundary and is not
remediated by this audit.

## 12. Scope and architecture decision result

```text
AUTHORIZED_ARCHITECTURAL_REALIZATION = immutable ticket-owned schema definitions,
                                       exact capability/schema/version selection,
                                       thin application orchestration, inward
                                       schema-mechanics adapter and no-effect failures
IMPLEMENTATION_DETAIL = JSON Schema document mechanics and existing TypeBox adapter
UNAUTHORIZED_ARCHITECTURAL_EXPANSION = public caller-reachable validation-evidence
                                       issuer through AuthenticatedExecSchemaValidationPort
ARCHITECTURE_DECISION_REQUIRED = NO
ARCHITECTURAL_AUTHORITY_GAP_DISCOVERED = NO
```

The accepted authority is sufficient to decide ownership and proof direction;
the defect is an implementation/provenance violation, not permission to invent
a new architecture locally.

## 13. Execution evidence and audit metrics

```text
FOCUSED_TARGET_TEST_COMMAND = node_modules/.bin/tsx --test tests/exec-001-ticket-001.test.ts
FOCUSED_TARGET_TEST_RESULT = 25/25 PASS
ADVERSARIAL_PROBE = caller subclass invoked issueValidatedResult and reached VALID
PRODUCTION_OR_TEST_FILES_CHANGED_BY_THIS_AUDIT = 0
UPSTREAM_AUTHORITY_FILES_CHANGED_BY_THIS_AUDIT = 0
```

The focused suite's existing schema identity, generic fallback, stale input,
forgery, no-effect, immutability and import-graph checks passed. Its named
caller-subtype guard is incomplete because it does not exercise the protected
issuer. Twelve existing boundary/provenance/import architecture guards were
executed as part of that focused run; one missing guard is reported above.

## 14. Required specialist summary

Audit: `.pi/runtime/workflow-audits/c4a46405-1314-4c2a-9af5-048cea009662/architecture-EXEC-001-TICKET-001-architecture-audit.md`

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
Producer/consumer contract errors: 1
Temporal authority gaps: 0
Caller-supplied authority bypasses: 1
Missing architecture guards: 1
Architecture guard tests run: 12

Findings:
CRITICAL=1
MAJOR=0
MINOR=0
INFO=0

Domain audit complete:
YES

Specialist result:
SPECIALIST_ARCHITECTURE_FINDINGS

AUDIT_TARGET_HEAD: b68eb87d8afc21b5683e89f4ecd3aee8d8238306
AUDIT_TARGET_STATE_FINGERPRINT: 70f7ea178eabee7cef5e588756b093c1de366d85ce9171e05e2235e091996675
AUDIT_WAVE_ID: c4a46405-1314-4c2a-9af5-048cea009662
DOMAIN_AUDIT_COMPLETE: YES
SPECIALIST_RESULT: SPECIALIST_ARCHITECTURE_FINDINGS