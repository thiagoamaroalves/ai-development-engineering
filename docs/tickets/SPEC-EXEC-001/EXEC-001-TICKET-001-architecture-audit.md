# Architecture Boundaries Audit — EXEC-001-TICKET-001

## 1. Audit identity and basis

```text
SPECIALIST = ARCHITECTURE_BOUNDARIES
TICKET_ID = EXEC-001-TICKET-001
TICKET_PATH = docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-001-capability-specific-envelope-and-payload-schemas.md
IMPLEMENTATION_DESIGN_PATH = docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-001-implementation-design.md
TICKET_SET_AUDIT_PATH = docs/tickets/SPEC-EXEC-001/implementation-ticket-audit.md
IMPLEMENTATION_UNIT = EXEC-IMP-01
SPEC_PATH = docs/specs/SPEC-EXEC-001-skill-contracts-and-capability-registry.md
ADR_PATHS = docs/adrs/ADR-0003-versioned-skill-contracts.md (primary); related boundaries cited below
IMPLEMENTATION_BASELINE = 8cf79cd37ebb02d0657c1fb191cea1d194b71f89 (ticket §27)
CURRENT_HEAD = 13b4b70b37b9e3f84df21fe7db8381427fa2f95c
AUDIT_TARGET_HEAD = 13b4b70b37b9e3f84df21fe7db8381427fa2f95c
AUDIT_TARGET_STATE_FINGERPRINT = b10a12b6eced00572c29b12d381cedb9dc9886687fd6f5fd86d0051c1fcd4928
TICKET_STATUS = VALIDATION_REQUIRED
WORKING_TREE_AT_INTAKE = CLEAN
AUDIT_MODE = READ_ONLY / INDEPENDENT / ADVERSARIAL / ARCHITECTURE_FIRST / OWNERSHIP_PRESERVING / AUTHORITY_PRESERVING / CROSS_SPEC_AWARE / IDENTITY_AWARE / LEGACY_TRANSITION_AWARE
```

The pinned HEAD equals VCS `HEAD`. The semantic fingerprint was independently recomputed through `.pi/extensions/workflow-orchestrator/git-state.ts::workspaceSnapshot`, using `skills/_shared/semantic-fingerprint-policy.json` and exactly these audit-artifact exclusions:

```text
docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-001-implementation-audit.md
docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-001-ticket-conformance-audit.md
docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-001-implementation-behavior-audit.md
docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-001-implementation-design-conformance-audit.md
docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-001-architecture-audit.md
```

The computed fingerprint matches the supplied value. The helper returned no semantic working-tree overlay files. The policy excludes `.pi/**`, including runtime staging, from the semantic fingerprint. No sibling specialist audit was used as evidence.

Changed ticket-scope files relative to the ticket's declared implementation baseline:

```text
docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-001-capability-specific-envelope-and-payload-schemas.md
docs/tickets/SPEC-EXEC-001/evidence/TICKET-001/AC-EXEC-001-envelope-schema.md
docs/tickets/SPEC-EXEC-001/evidence/TICKET-001/AC-EXEC-001-structured-consumption.md
docs/tickets/SPEC-EXEC-001/evidence/TICKET-001/AC-EXEC-002-fail-closed.md
docs/tickets/SPEC-EXEC-001/evidence/TICKET-001/AC-EXEC-002-required-fields.md
src/application/exec-contract.ts
src/domain/exec-contract.ts
src/domain/exec-schema.ts
src/domain/exec-validation-evidence-internal.ts
src/infrastructure/exec-schema-validator.ts
tests/exec-001-ticket-001.test.ts
```

The target commit itself is a checkpoint commit; this file list is the ticket-scope diff from its declared implementation baseline, not only the checkpoint commit's own file list.

Verification performed: `npm run typecheck` passed. The standard `npm test` invocation could not load TypeScript test modules in this Node binary (`ERR_NO_TYPESCRIPT`); this was an environment/runner failure, not a test assertion failure. To execute the relevant direct tests without changing repository state, the installed TypeScript compiler API was used through an ephemeral Node loader. Eight selected TICKET-001 tests passed, including schema selection/rejection, custom schema substitution, caller evidence injection, an alternate adapter contract, and the productive import-graph guard. The direct executable architecture/import guard passed once (`ARCHITECTURE_GUARD_TESTS_RUN = 1`). These test results are implementation evidence only; they do not supply missing normative schema authority.

## 2. Reconstructed architectural contract and precedence

Source precedence applied:

```text
Accepted ADR authority
> Canonical Specification
> explicit cross-SPEC ownership contracts
> validated Gap Matrix
> Implementation Plan
> Ticket
> Design
> repository implementation/tests
```

### Authority and ownership

| Contract item | Reconstructed rule and source anchor |
|---|---|
| Local owner | `SPEC-EXEC-001 / EXEC-001` is canonical owner of the common envelope and capability-specific payload schemas, semantic contract versions, registry/capability contract and canonical contract failures. Sources: `docs/specs/SPEC-PORTFOLIO-001-organization.md` O-016 (EXEC-001, `CANONICAL_OWNER`); `docs/specs/SPEC-EXEC-001-skill-contracts-and-capability-registry.md` §§2, 9, 13 (`EXEC-ENVELOPE-001/002`). |
| Primary ADR authority | `ADR-0003` revision 3 is `ACCEPTED`. Its Decision requires JSON Schema-validated common envelope and a payload specific to capability; human text is not operational authority. `docs/adrs/ADR-0003-versioned-skill-contracts.md` §Decision. |
| Local schema decision boundary | Schema identity and schema-specific validation belong to EXEC-001, but the accepted sources do not identify `capability-001`, schema ID `exec-capability-001-payload`, or require a `data.result` field. `SPEC-EXEC-001` §13 requires identifiable capability-specific schemas, without those field-level definitions. This missing content is the principal authority gap below. |
| Foreign owners | DOM owns canonical execution/activity/attempt and lifecycle identity/meaning; PLAT owns physical persistence, effects and recovery; REPO owns enabled repository configuration/bootstrap; BACKEND and other consumers map/transport/project without changing EXEC meaning. Sources: `SPEC-EXEC-001` §§2, 10, 12, 19–20; `SPEC-DOM-001` §§2, 12. This ticket consumes no foreign capability for local closure. |
| Canonical identities | `SchemaId` plus semantic schema version are EXEC contract identities. Execution/activity/attempt/cycle identifiers carried in the envelope remain opaque references; this ticket does not create, resolve, normalize or replace DOM identity. Source: `SPEC-EXEC-001` §12 and `SPEC-DOM-001` §§2, 12. |
| Immutability and lineage | Schema definitions and validated values must remain immutable. No persistible aggregate, history, revision progression, or lineage is introduced by this ticket. Sources: `ADR-0003` §Decision; ticket/design scope and repository values. |
| Legacy/cutover | New canonical path uses identifiable capability schema; generic payload fallback is retired and invalid input fails closed. No persisted legacy state is migrated or rewritten. Source: `SPEC-EXEC-001` §17; ticket §6 `NEW_CANONICAL_PATH`; implementation/test behavior. |
| Migration and security | No migration is in scope. EXEC-001 does not own authorization; a valid contract/payload is not authorization, lifecycle approval, checkpoint confirmation, or effect execution. Sources: `SPEC-EXEC-001` §§19–20; `ADR-0003` §Decision. |
| Does not implement | Registry resolution/publication, DOM identity/lifecycle, source configuration, persistence/recovery, runtime/session effects, transport or final integrated mappings are excluded. Sources: ticket §6 and design §§3, 16. |

The Gap Matrix (`docs/specs/gap-matrices/SPEC-EXEC-001-implementation-gap-matrix.md`, GAP-018) supplies the observed generic schema and required capability-specific validation delta; it is evidence/classification, not additional schema-field authority. The Plan's EXEC-IMP-01 and the ticket/design bound this implementation unit and say registry resolution is out of scope. They cannot elevate a fixture field into normative payload meaning.

## 3. Applicability matrix

| Dimension | Classification | Evidence / reason |
|---|---|---|
| OWNERSHIP | REQUIRED | Production validation behavior changed. EXEC-001 owns schema contract semantics; foreign lifecycle/effect/persistence remains excluded. |
| CANONICAL_AUTHORITY | REQUIRED | The generic schema path is replaced with a canonical schema selection and validation path. Exact capability schema content is unresolved. |
| CROSS_SPEC_INTEGRATION | NOT_APPLICABLE | No foreign capability is consumed for local closure; DOM values remain opaque fields, and no DOM/REPO/PLAT producer is called. The approved EXEC→DOM context does not create an implementation dependency here. |
| IDENTITY | AFFECTED | Schema IDs/version and payload capability selector are validated; DOM IDs are preserved as opaque data. |
| IMMUTABILITY | AFFECTED | Definitions, validation evidence and returned contract values carry authority-bearing schema/input data. |
| LINEAGE | NOT_APPLICABLE | No persistible aggregate/entity or predecessor/successor history is created or restored. |
| LEGACY_TRANSITION | AFFECTED | Generic payload acceptance is removed in favor of the new identifiable path; no legacy fallback remains. |
| DESTRUCTIVE_TRANSITION | NOT_APPLICABLE | No durable/canonical state is deleted or changed. Rejecting the former non-persisted generic payload shape is a contract cutover, not an irreversible state transition. |
| MIGRATION_AUTHORITY | NOT_APPLICABLE | No migration code or existing state conversion is in scope. |
| SECURITY_AUTHORIZATION | NOT_APPLICABLE | This operation validates a contract only; it does not authorize commands/effects or bypass a backend/DOM authorization boundary. |

## 4. Domain audit results

### Ownership and canonical authority

**Ownership:** `OWNERSHIP_PRESERVED`. The changed code is in the EXEC schema/domain/application/infrastructure boundary and does not absorb DOM lifecycle, registry publication, REPO configuration, PLAT storage/effects or downstream mapping ownership. `FOREIGN_CAPABILITY_DUPLICATED = 0`.

**Canonical authority:** the high-level O-016 boundary is preserved: immutable identifiable schema definitions are consumed by `ValidateExecContract`; caller-supplied schema documents are not accepted; invalid or unknown input fails closed; the adapter compiles the ticket-owned document. However, `src/domain/exec-schema.ts:140–187` creates a sole canonical payload definition for `capability-001`, schema `exec-capability-001-payload`, with required `data.result`, and `payloadDefinitions` is exactly `[this.payload]`. No accepted ADR/SPEC/registry authority names that capability or specifies that field. Tests establish that this implementation accepts/rejects according to its own definition; they cannot make the chosen definition normative. `AUTHORITY_PRESERVED` for the owner boundary, with a material local schema-content authority gap (`ARCHITECTURAL_AUTHORITY_GAP_DISCOVERED = YES`). No dual writer, foreign owner, or persistent alternative authority was found.

### Cross-spec integration and capability proofs

No foreign capability is consumed by the local unit. The ticket's local producer/consumer is the schema-definition boundary → `ValidateExecContract`; the code path exists (`src/domain/exec-schema.ts`, `src/application/exec-contract.ts`, `src/infrastructure/exec-schema-validator.ts`, `src/composition/exec-contract.ts`). The production composition invokes the JSON Schema adapter and the application returns either one complete pair or `CONTRACT_INVALID`, with no partial result.

The planned unit record classifies the local harness as `AUTHORITY_STATUS=DEFINED`, `CONTRACT_STATUS=DEFINED`, `LOCAL_TESTABILITY=YES`, `PRODUCTIVE_AVAILABILITY=NO`, summary `CONTRACT_TESTABLE_LOCALLY`, dependency `INFORMATIONAL` (ticket §6 and AC matrix). Ticket §14a instead says `PRODUCTIVE_AVAILABILITY=YES for unit-owned local execution` and also says `no downstream promotion`; it provides no capability promotion record. The same ticket's witness rows remain `PRODUCTIVE_AVAILABILITY=NO`. The exact schema-content authority gap also means the local producer's complete normative contract is not established. Finding `ARCH-MAJOR-002` records the unsupported/inconsistent availability handoff. No foreign authority-consumption gap is counted because no foreign capability is required or consumed.

```text
FOREIGN_CAPABILITIES_CONSUMED = NONE
AUTHORITY_CONSUMPTION_PROOF = NOT_APPLICABLE to a foreign capability
LOCAL_SCHEMA_PRODUCER = ExecContractSchemaDefinitions (local EXEC owner path)
LOCAL_CONSUMER = ValidateExecContract
LOCAL_SCHEMA_CONTRACT_AUTHORITY = INCOMPLETE for the named capability/schema content
PRODUCTIVE_AVAILABILITY_PROMOTION_RECORD = ABSENT despite ticket §14a YES claim
DEPENDENCY_CLASS = INFORMATIONAL (no local-closure blocker established)
```

### Identity, immutability and lineage

**Identity:** `CONFORMANT` for the scoped identity behavior. `SchemaReference` is immutable; domain construction accepts only the canonical reference object, and schema ID/version are compared to that reference. Opaque execution/activity/attempt/cycle values are preserved, not regenerated or normalized. This ticket does not prove those opaque values against DOM, which is correctly outside local scope. The hardcoded capability/schema mapping is reported as a schema-authority gap, not as a demonstrated identity continuity failure. `IDENTITY_VIOLATIONS = 0`.

**Immutability:** `CONFORMANT`. Schema documents and definitions are deep-frozen; result evidence is frozen; domain values clone/freeze structured input; current input fingerprint and required own-data fields are rechecked before value construction. Direct stale mutation tests passed. `IMMUTABILITY_VIOLATIONS = 0`.

**Lineage:** `NOT_APPLICABLE`; no persistible aggregate/history is implemented. `LINEAGE_VIOLATIONS = 0`.

### Legacy/cutover and destructive-transition safety

**Legacy transition:** `TRANSITION_CONFORMANT` within this stateless contract boundary. The former generic payload schema identity does not fall back to the new path; unknown capability/schema and capability-invalid data return `CONTRACT_INVALID`. Direct tests for the generic schema ID and generic-but-invalid data passed. No legacy writer, read-to-write authority, migration or dual writer was found.

**Destructive transition:** all of `REPLACEMENT_PROVEN`, `CUTOVER_AUTHORIZED`, `PRE_TRANSITION_GATES_SATISFIED`, `POST_TRANSITION_GUARDS_PRESENT`, and `ROLLBACK_OR_ROLL_FORWARD_SEMANTICS_DEFINED` are `NOT_APPLICABLE`: there is no persistent state transition. The contract intentionally fails closed for the retired generic input shape.

### Migration, authorization and temporal authority

**Migration authority:** `NOT_APPLICABLE`; no migration code exists in the changed behavior.

**Security authorization:** `NOT_APPLICABLE`; no authorization route/effect is executed. The invalid result explicitly sets `noApproval`, `noCheckpoint`, and `noEffect`; successful payload validation remains a contract result, not foreign approval or effect authority.

**Caller-as-authority:** `PASS` for the audited operation. Caller `capabilityId`/schema labels can only match the immutable local selector; unknown/mismatched values fail closed and caller documents cannot replace the schema. The implementation does not accept caller-supplied lifecycle, eligibility, canonical revision, approval or current-basis truth. `CALLER_SUPPLIED_AUTHORITY_BYPASSES = 0`.

**Temporal authority:** `NOT_APPLICABLE`; the operation observes immutable local definitions and commits no effect. Input mutation is separately rejected by fingerprint/current-field checks; no external mutable truth is reused across an effect boundary. `TEMPORAL_AUTHORITY_GAPS = 0`.

### Scope decisions and architecture guards

The implementation uses the authorized inward JSON Schema adapter and immutable schema-definition boundary, and keeps infrastructure mechanics outside domain values. The exact local capability/schema mapping and `data.result` requirement are `ARCHITECTURE_DECISION_REQUIRED`: they change acceptance semantics and are not supplied by the accepted authority chain. The ticket's `LOCAL_CLOSURE=YES` does not itself define those semantics.

The required productive import-graph guard exists in `tests/exec-001-ticket-001.test.ts:1100–1151` and was executed successfully. It asserts the productive composition graph is confined to the approved `src` files and rejects prototype, `.pi`, filesystem, HTTP, UI and database imports. Direct tests also reject custom schema documents, caller-selected schema references, generic payloads and untrusted structural evidence. No required guard is missing for the designed import/schema-substitution boundaries.

```text
ARCHITECTURE_DECISIONS = AUTHORIZED_ARCHITECTURAL_REALIZATION for immutable schema selection and fail-closed validation; ARCHITECTURE_DECISION_REQUIRED for the exact canonical capability/schema/field definition
MISSING_ARCHITECTURE_GUARDS = 0
ARCHITECTURE_GUARD_TESTS_RUN = 1
ARCHITECTURE_GUARD_EVIDENCE = tests/exec-001-ticket-001.test.ts:1100–1151, executed PASS
```

## 5. Systemic boundary expansion / root-cause campaign

The schema-authority and capability-availability findings are tracked together because both promote the same unit-owned local schema path as an established canonical/productive capability without a complete authority-to-consumer handoff. This is a finding campaign, not a claim that the campaign is closed.

```text
ROOT_CAUSE_CAMPAIGN_ID = RCC-EXEC001-SCHEMA-AUTHORITY-001
ROOT_CAUSE_ID = LOCAL_CAPABILITY_SCHEMA_CONTENT_AND_AVAILABILITY_ARE_ASSERTED_WITHOUT_A_COMPLETE_ACCEPTED_AUTHORITY_HANDOFF
CAMPAIGN_STATUS = OPEN
CAMPAIGN_SCOPE = EXEC-001-TICKET-001 local schema-definition/validation boundary and its ticket capability record
CANONICAL_FINDINGS = ARCH-MAJOR-001, ARCH-MAJOR-002
```

| Surface row | Surface class / location | Owner | Normative obligation | Current behavior | Expected behavior | Finding / direct witness | Coverage |
|---|---|---|---|---|---|---|---|
| RCC-S01 | ISSUER — `src/domain/exec-schema.ts:140–155` | EXEC-001 | O-016 / EXEC-ENVELOPE-001: capability-appropriate identifiable schema | Source code defines `capability-001`, `exec-capability-001-payload`, and required `data.result`; accepted authority does not name them | Selected schema content and identity come from accepted EXEC schema/registry authority | ARCH-MAJOR-001; no authority-source negative witness | MISSING |
| RCC-S02 | REGISTRAR — `src/domain/exec-schema.ts:160–187` | EXEC-001 | Only authorized schema identity/association may be canonical | Constructor registers a hardcoded singleton definition in a private set; no accepted registry/catalog association supplies it | Canonical association must be source-traceable; registry resolution may remain out of this ticket only if the local schema record is already authoritative | ARCH-MAJOR-001; `selects an identifiable capability schema...` verifies singleton behavior, not authority | MISSING |
| RCC-S03 | CONSUMER — `src/application/exec-contract.ts:107–142` | EXEC-001 | Validate against identifiable capability schema before consumption | Consumer selects the one local definition and emits `VALID` for the fixture shape | Consumer selects only a contract-authorized definition; code-defined fixture behavior is not authority | ARCH-MAJOR-001; `TEST-CAP-SELECTION-01` passed for implementation behavior | MISSING |
| RCC-S04 | ALTERNATE_AUTHORITY_PATH — `src/domain/exec-schema.ts:160–187`; registry resolution explicitly out of scope | EXEC-001 | No unsupported capability/schema path becomes canonical | The immutable singleton is the only productive selection path in this unit; no owner-issued registry record is consumed | The path must either be tied to an authorized schema entry or remain only contract-level test evidence | ARCH-MAJOR-001; no accepted source-to-definition witness | MISSING |
| RCC-S05 | INJECTION_POINT — `ValidateExecContract.validate`, lines 107–118 | EXEC-001 | Caller schema/capability claims cannot replace canonical schema | Caller labels only match the local immutable singleton; unknown/mismatched values fail closed | Caller may select only among owner-authorized definitions | `TEST-UNKNOWN-CAP-01`, `TEST-WRONG-SCHEMA-01` passed | COVERED (mechanical rejection; authority mapping remains S01–S04) |
| RCC-S06 | MUTATION_PATH — frozen documents/definitions, `exec-schema.ts:158–179` | EXEC-001 | Canonical definition cannot mutate after selection | Deep-frozen documents and frozen definition set; no runtime registration/mutation | Preserve immutability and no mutation on failure | `TEST-SCHEMA-IMMUTABILITY-01` within direct selected suite passed | COVERED |
| RCC-S07 | STALE_PATH — `exec-schema-validator.ts` receipts; `exec-contract.ts:391–415` | EXEC-001 | Evidence binds exact input/reference and rejects stale content | Producer receipt and fingerprint/current-field checks reject changed input | Reject stale/mutated input before construction | `TEST-STALE-EVIDENCE-01` and direct stale tests passed | COVERED |
| RCC-S08 | PORT_SUBSTITUTION_PATH — authenticated validation port and app injection | EXEC-001 | Adapter cannot substitute a caller schema or unbound result | Structural/copied wrappers rejected; one independently implemented authenticated adapter is accepted under the explicit port contract | Alternative adapters must validate the same accepted schema contract; no result-shaped caller proof | `TEST-UNTRUSTED-PORT-01` and `TEST-ALT-ADAPTER-01` passed | COVERED for the port contract; schema source remains S01–S04 |
| RCC-S09 | PUBLIC_EXPORT — `src/domain/exec-schema.ts`; `src/composition/exec-contract.ts:8–10` | EXEC-001 | Public productive boundary must expose only canonical authority | Exported definition and composition APIs expose the singleton schema as canonical | Public consumers must receive authority-backed schema identity/content | ARCH-MAJOR-001; no published authority crosswalk for the exported entry | MISSING |
| RCC-S10 | CONSUMER / capability handoff — ticket §§6, 14a and AC matrix | EXEC-001 | Preserve all four availability dimensions; promote only with complete evidence record | Unit/AC records say NO and `CONTRACT_TESTABLE_LOCALLY`; §14a says YES and “no downstream promotion”; no promotion record with old/new status, summary, evidence owner and baseline | Keep NO unless promotion is explicitly evidenced, or record the complete authorized promotion for the same capability ID | ARCH-MAJOR-002; `TEST-AVAILABILITY-PROMOTION-RECORD` absent | MISSING |
| RCC-S11 | LEGACY_ROUTE — `src/domain/exec-schema.ts:140–155`; selection tests | EXEC-001 | Generic path cannot regain authority | No generic schema fallback; old generic ID rejected | No legacy write/fallback authority | `TEST-GENERIC-SCHEMA-01` passed | COVERED |
| RCC-S12 | ARCHITECTURE_GUARD — `tests/exec-001-ticket-001.test.ts:1100–1151` | EXEC-001 | Forbid hidden prototype/.pi/transport/database dependency path | Executable composition graph assertion runs and passes | Preserve sole allowed productive dependency direction | `ARCH-GUARD-IMPORT-GRAPH-01` executed PASS | COVERED |
| RCC-S13 | TEST — `tests/exec-001-ticket-001.test.ts:91–134, 290–345` | EXEC-001 | Direct positive/negative witnesses must reflect normative schema contract | Tests prove the code-defined singleton and sample adapter behavior; no test can prove the absent authority source | Tests must map the accepted schema identity/fields to direct authority-backed witnesses | ARCH-MAJOR-001/002; `TEST-CAP-SELECTION-01` and `TEST-ALT-ADAPTER-01` passed | MISSING for authority/promotion proof; behavior tests covered |
| RCC-S14 | PERSISTENCE / RETRY_RECOVERY | PLAT is owner if later introduced | No persistence/recovery authority transferred | No persistence, retry or recovery path in this ticket | Keep these surfaces out of scope; route future work to PLAT/EXEC owners | Not applicable; no changed path | NOT_APPLICABLE — no persisted material or recovery command exists |

```text
CAMPAIGN_MATRIX_COMPLETE = YES
ALL_SURFACE_ROWS_COVERED = NO
ALL_NEGATIVE_WITNESSES_PASS = NO (implementation rejection tests pass, but no authority-source or complete promotion-record witness exists)
NO_UNEXPLAINED_PUBLIC_AUTHORITY_PATH = NO
NO_HIDDEN_CONCRETE_PROTOCOL = YES
ROOT_CAUSE_REMOVED = NO
KNOWN_MANIFESTATIONS_CLOSED = NO
SYSTEMIC_TEST_EVIDENCE = PRESENT for local validation/import isolation; ABSENT for authority-source and availability-promotion obligations
```

## 6. Findings

### ARCH-MAJOR-001 — Implementation makes an unspecified fixture schema canonical

- **Severity:** MAJOR
- **Ticket:** EXEC-001-TICKET-001
- **Normative authority:** `ADR-0003` revision 3 §Decision; portfolio O-016; `SPEC-EXEC-001` revision 5 §§2, 9, 13 (`EXEC-ENVELOPE-001/002`). These require EXEC-owned identifiable capability-specific schemas, but do not specify `capability-001`, `exec-capability-001-payload`, or a required `data.result` property. Gap Matrix GAP-018, Plan EXEC-IMP-01, ticket and design do not add those field-level semantics.
- **Owner:** `SPEC-EXEC-001 / EXEC-001` owns the canonical schema; the missing field-level normative schema decision belongs at the SPEC/canonical capability-schema authority stage, not in repository implementation or test fixtures.
- **Affected boundary:** EXEC schema authority → `ValidateExecContract` → downstream consumers of `ValidatedExecContract`.
- **Repository evidence:** `src/domain/exec-contract.ts:13–17` defines the capability/schema IDs; `src/domain/exec-schema.ts:140–187` requires `data.result` and installs exactly one hardcoded payload definition; `src/application/exec-contract.ts:107–142` uses it for the `VALID` result. `tests/exec-001-ticket-001.test.ts:101–134` confirms the singleton and mirrors this code-defined shape. No accepted authority source in ADR-0003, SPEC-EXEC-001, ticket or design provides this exact mapping/field rule.
- **Problem:** The implementation turns an unreferenced capability/test shape into the sole canonical payload schema. Schema field content changes which capability inputs can be consumed; this is not merely a JSON Schema library or physical-format choice. The higher-level requirement is defined, but the actual schema authority needed by this consumer is not.
- **Impact:** Other capability IDs have no selectable schema in the productive path, and `capability-001` payloads are accepted/rejected according to implementation-selected semantics. The local code/test path is therefore being treated as schema truth without an accepted source for the capability association and data contract.
- **Minimum correction required:** Obtain an accepted normative schema/registry authority that specifies the supported capability-to-schema identity/version association and the payload fields, then consume that authority; until then do not promote the fixture mapping/shape as canonical schema truth. Route the missing domain schema meaning to SPEC/canonical schema authority, not to implementation remediation.
- **Systemic pattern:** YES
- **Related locations:** `src/domain/exec-contract.ts:13–17, 556–561`; `src/domain/exec-schema.ts:140–187`; `src/application/exec-contract.ts:107–142`; `tests/exec-001-ticket-001.test.ts:91–134`; ticket §§6, 14a–14c; implementation design §§7, 9, 13, 17, 20.

### ARCH-MAJOR-002 — Capability availability is promoted without the required promotion record

- **Severity:** MAJOR
- **Ticket:** EXEC-001-TICKET-001
- **Normative authority:** `skills/_shared/authority-completeness-gates.md` capability dimensions and `NO_DOWNSTREAM_CAPABILITY_PROMOTION_WITHOUT_NEW_EVIDENCE`; Plan `EXEC-IMP-01` §9 producer/consumer proof. Promotion requires the capability ID, previous/new status and availability, previous/new summary when used, promotion evidence, evidence owner, and evidence baseline/commit.
- **Owner:** EXEC-001 ticket producer/consumer handoff; the Plan's original availability classification remains authoritative unless a complete evidence-based promotion is recorded.
- **Affected boundary:** `EXEC-SCHEMA-CAPABILITY-PAYLOAD` producer → `ValidateExecContract` consumer; local test evidence versus productive availability.
- **Repository evidence:** Ticket §6 Unit record and its witness rows (§§6, 14c; lines 113–135) set `PRODUCTIVE_AVAILABILITY=NO` for the fixture/harness, `CAPABILITY_SUMMARY_STATUS=CONTRACT_TESTABLE_LOCALLY`, and retain NO in both AC rows. Ticket §14a (lines 216–221) instead sets `PRODUCTIVE_AVAILABILITY=YES for unit-owned local execution after prerequisites` while asserting “no downstream promotion.” No complete promotion record is present. `src/composition/exec-contract.ts:8–10` wires a local adapter and the tests call it, but those facts are not a recorded productive-availability promotion for the capability ID.
- **Problem:** The same capability record has conflicting NO/YES values and no allowed promotion record. Local execution readiness and a testable harness do not substitute for the shared productive-availability dimension. If the actual composition/runtime path is the new productive evidence, the handoff still omits the required previous/new state, summary, evidence owner and baseline; otherwise the YES claim is unsupported.
- **Impact:** Consumers cannot mechanically determine whether this seam is only locally testable or productively available. The dependency class is INFORMATIONAL, so this does not establish a local-closure blocker, but the capability handoff is not contract-conformant and must not be treated as a valid availability promotion.
- **Minimum correction required:** Reconcile the single capability ID across the Unit, AC matrix, design and §14a. Retain `PRODUCTIVE_AVAILABILITY=NO` with the derived `CONTRACT_TESTABLE_LOCALLY` summary unless integrated productive evidence exists; if promoting, add the complete shared promotion record with evidence owner and baseline/commit. Do not conflate local execution readiness with productive availability.
- **Systemic pattern:** YES
- **Related locations:** Ticket §§6, 14a–14c; implementation design §7; Plan §9 EXEC-IMP-01; shared authority-completeness gates. The empty ticket §14b foreign-capability table correctly shows no foreign capability, but does not reconcile this local capability record.

## 7. Specialist summary

Audit: `.pi/runtime/workflow-audits/3636d2d2-5c89-40ce-9e40-5aff9abdae17/architecture-EXEC-001-TICKET-001-architecture-audit.md`

Specialist:
ARCHITECTURE_BOUNDARIES

Ticket: EXEC-001-TICKET-001

Ownership errors: 0

Foreign capability duplication: 0

Authority violations: 1

Identity violations: 0

Immutability/lineage violations: 0

Legacy authority violations: 0

Architectural authority gaps: 1
Authority consumption gaps: 0
Producer/consumer contract errors: 2
Temporal authority gaps: 0
Caller-supplied authority bypasses: 0
Missing architecture guards: 0
Architecture guard tests run: 1

Findings:
CRITICAL=0
MAJOR=2
MINOR=0
INFO=0

Domain audit complete:
YES

Specialist result:
SPECIALIST_ARCHITECTURE_FINDINGS

AUDIT_TARGET_HEAD: 13b4b70b37b9e3f84df21fe7db8381427fa2f95c
AUDIT_TARGET_STATE_FINGERPRINT: b10a12b6eced00572c29b12d381cedb9dc9886687fd6f5fd86d0051c1fcd4928
AUDIT_WAVE_ID: 3636d2d2-5c89-40ce-9e40-5aff9abdae17
DOMAIN_AUDIT_COMPLETE: YES
SPECIALIST_RESULT: SPECIALIST_ARCHITECTURE_FINDINGS
