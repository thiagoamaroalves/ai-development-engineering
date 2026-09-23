# EXEC-001-TICKET-002 — Ticket Conformance Audit

## 1. Audit subject and mode

```text
AUDIT_SKILL = audit-ticket-conformance
AUDIT_MODE = READ_ONLY; INDEPENDENT; ADVERSARIAL; TICKET_SCOPED; SPEC_FIRST; GAP_MATRIX_AWARE; PLAN_AWARE; DIFF_AWARE; EVIDENCE_REQUIRED
TICKET_ID = EXEC-001-TICKET-002
TICKET_PATH = docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-version-registry-catalogs-capabilities.md
TICKET_STATUS = VALIDATION_REQUIRED
IMPLEMENTATION_UNIT = EXEC-IMP-02
GAP_IDS = GAP-004, GAP-006, GAP-008, GAP-009, GAP-010, GAP-011
REQUIREMENT_IDS = EXEC-VERSION-001, EXEC-VERSION-002, EXEC-REGISTRY-001, EXEC-REGISTRY-002, EXEC-REGISTRY-003, EXEC-CAPABILITY-001, EXEC-CAPABILITY-002
ACCEPTANCE_IDS = AC-EXEC-003, AC-EXEC-004, AC-EXEC-005, AC-EXEC-007, AC-EXEC-008, AC-EXEC-009, AC-EXEC-010, AC-EXEC-011, AC-EXEC-012
ADR_PATHS = docs/adrs/ADR-0003-versioned-skill-contracts.md; docs/adrs/ADR-0010-repository-configuration-and-legacy-migration.md
SPEC_PATH = docs/specs/SPEC-EXEC-001-skill-contracts-and-capability-registry.md
GAP_MATRIX_PATH = docs/specs/gap-matrices/SPEC-EXEC-001-implementation-gap-matrix.md
IMPLEMENTATION_PLAN_PATH = docs/specs/implementation-plans/SPEC-EXEC-001-implementation-plan.md
PLAN_AUDIT_PATH = docs/specs/implementation-plans/audits/SPEC-EXEC-001-implementation-plan-audit.md
TICKET_AUDIT_PATH = docs/tickets/SPEC-EXEC-001/implementation-ticket-audit.md
IMPLEMENTATION_BASELINE = d4216ad6f4a87fe7142ccd45d3fd099ef1b92955 plus the pinned working-tree implementation overlay
CURRENT_HEAD = d4216ad6f4a87fe7142ccd45d3fd099ef1b92955
AUDIT_TARGET_HEAD = d4216ad6f4a87fe7142ccd45d3fd099ef1b92955
AUDIT_TARGET_STATE_FINGERPRINT = 4ae3e359d87e354024c62f86fca4eba759e78335f78696185277e0e37a3e0bf4
```

The supplied ticket-set audit, approved design, accepted ADR, conformant SPEC,
validated Gap Matrix, conformant Plan and Plan Audit were available. No sibling
specialist audit artifact was read. The target is the pinned HEAD plus the
working-tree overlay covered by the supplied fingerprint; this audit artifact
is excluded from that subject.

## 2. Traceability and execution eligibility

### Traceability

```text
TRACEABILITY = TRACEABILITY_CONFORMANT
ADR-0003 / O-017, O-020 → SPEC-EXEC-001 requirements
→ GAP-004, GAP-006, GAP-008, GAP-009, GAP-010, GAP-011
→ EXEC-IMP-02 → EXEC-001-TICKET-002
```

The ticket belongs to SPEC-EXEC-001, names the correct implementation unit, and
all referenced Gap, Requirement and Acceptance IDs resolve. The ticket-set audit
is `IMPLEMENTATION_TICKETS_CONFORMANT` with `READY_FOR_IMPLEMENTATION`; the
implementation design records TICKET-001 complete and TICKET-002 locally ready.
The ticket's current `VALIDATION_REQUIRED` state is appropriate for an
implemented ticket awaiting independent audit.

### Eligibility reconstruction

```text
IMPLEMENTATION_AUTHORIZED_AT_START = YES
PREDECESSOR_TICKET-001 = DONE / prerequisite satisfied
INITIAL_DAG_STATE = BLOCKED (historical planning state)
EXECUTION_READY_AT_IMPLEMENTATION_START = TRUE
CURRENT_POST_IMPLEMENTATION_EXECUTION_READY = FALSE (not a status defect)
EXECUTION_ELIGIBILITY = EXECUTION_ELIGIBILITY_CONFIRMED
```

The current `EXECUTION_READY: FALSE` is the ticket's post-implementation
record and does not rewrite its historical `INITIAL_DAG_STATE`. At the start,
TICKET-001 had completed its gate, local acceptance and completion evidence were
available, and the ticket-set audit released TICKET-002. The foreign producers
were not local prerequisites.

| Capability | Authority / contract | Local testability | Productive availability | Dependency class | Local closure effect | Evidence timing |
|---|---|---:|---:|---|---|---|
| `DOM-EXEC-IDENTITY-SNAPSHOT` | DEFINED / DEFINED | NO | NO | `REQUIRED_FOR_INTEGRATED_PROOF` | No local blocker | Integrated proof |
| `REPO-EXEC-NORMAL-CATALOG` | DEFINED / DEFINED | NO | NO | `REQUIRED_FOR_INTEGRATED_PROOF` | No local blocker | Integrated proof |
| `UNIT-EXEC-REGISTRY-FIXTURE` | DEFINED / DEFINED | YES | NO | `INFORMATIONAL` | Local contract witness only | Local closure |

`UPSTREAM_DEPENDENCY_CLASSIFICATION_PRESERVED = YES`. The unavailable DOM and
REPO capabilities are integrated-only and are not silently promoted to local
requirements. `LOCAL_ACCEPTANCE_REQUIRES_PRODUCTIVE_CAPABILITY = NO` for the
local fixture and both foreign capabilities. No execution-eligibility finding
is emitted.

## 3. Reconstructed canonical implementation contract

### Required local behavior

1. Classify semantic-version major/minor/patch meaning and resolve only an
   explicit supported set; unsupported versions return
   `INCOMPATIBLE_CAPABILITY`, with no alias or conversion.
2. Resolve a complete stage/skill/capability entry deterministically from an
   immutable frozen basis.
3. Keep NORMAL repository-scoped and BOOTSTRAP system-scoped; reject a normal
   capability in BOOTSTRAP before normal work.
4. Preserve `UNKNOWN_CAPABILITY` versus `INCOMPATIBLE_CAPABILITY`, and register
   a schema-valid synthetic capability through the common registry without
   mutating an existing frozen basis.

### Integration behavior

Consume DOM execution-basis and REPO NORMAL-catalog seams at the integrated
boundary. Those producers remain foreign and integrated-only. Local fixtures
may prove contract semantics but do not prove productive availability,
durability, physical CAS, recovery or external effects.

### Does not implement

DOM identity/lifecycle, REPO configuration or enablement, session/scheduler,
physical persistence/recovery, effects, transport/UI/OPS mappings, or registry
semantic reconstruction owned by the later ticket boundary.

### Expected repository impact and obligations

The authorized implementation surface is the EXEC domain registry/version and
catalog boundary, application orchestration and narrow source ports, a
composition root, direct tests, and ticket-local completion evidence. The six
owned Gaps, seven owned Requirements and seven locally owned Acceptance
Criteria above are the acceptance contract; AC-EXEC-005 and AC-EXEC-007 are
contribution obligations whose final owners remain TICKET-005 and TICKET-004.

## 4. Changed-file and scope audit

The pinned semantic overlay contains 29 changed files after excluding workflow
prefixes `.pi/`, `skills/`, `.codex/` and this output artifact.

| Classification | Count | Files |
|---|---:|---|
| `DIRECT_TICKET_IMPLEMENTATION` | 5 | `src/domain/exec-registry.ts`; `src/application/exec-registry.ts`; `src/application/exec-registry-ports.ts`; `src/composition/exec-registry.ts`; `docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-version-registry-catalogs-capabilities.md` |
| `REQUIRED_TEST_CHANGE` | 1 | `tests/exec-001-ticket-002.test.ts` |
| `AUTHORIZED_GENERATED_ARTIFACT` | 9 | `docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-implementation-design.md`; the eight files under `docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/` |
| `UNRELATED_CHANGE` | 5 | `.gitignore`; root `README.md`; `package.json`; `tools/verify-audit-governance-contracts.mjs`; `tools/verify-skill-mirror.mjs` |
| `FOREIGN_SCOPE_CHANGE` | 9 | TICKET-001, TICKET-003, TICKET-004, TICKET-006, TICKET-007 and TICKET-009 documents; `docs/tickets/SPEC-EXEC-001/README.md`; `implementation-ticket-audit.md`; `implementation-ticket-remediation.md` |

```text
CHANGED_FILES_TOTAL = 29
IN_SCOPE_FILES = 15
UNRELATED_FILES = 14
SCOPE_EXPANSION_FILES = 0
FOREIGN_SCOPE_FILES = 9
UNAUTHORIZED_SCOPE_EXPANSION = NO
```

The foreign and unrelated documentary/workflow changes do not alter the
TICKET-002 product behavior, but they are outside this ticket's implementation
scope and are not counted as implementation conformance evidence.

## 5. Required behavior coverage

| Required behavior | Repository evidence | Result |
|---|---|---|
| Semver semantics and exact supported sets | `SemanticVersion`, `SupportedVersionSet`, `classifySemanticVersionChange`, and exact membership in `src/domain/exec-registry.ts`; focused direct tests pass. | `IMPLEMENTED` |
| Complete deterministic frozen-basis mapping | `RegistryEntry` carries stage, skill/capability, semantic version, schemas, artifacts, verdicts and roles; `CatalogBasis` returns a new immutable basis and rejects duplicate identity. | `IMPLEMENTED` |
| NORMAL/BOOTSTRAP separation and pre-work allowlist | Scope and allowlist policies exist and the domain resolver rejects NORMAL category in BOOTSTRAP, but the application accepts a caller-provided basis before checking the requested scope. | `IMPLEMENTED_WITH_SCOPE_LEAKAGE` |
| Distinct outcomes and common-path synthetic registration | Unknown and incompatible version paths are distinct; synthetic registration uses `RegistryEntry`/`CatalogBasis` and preserves the old basis. A mismatched schema is classified as unknown rather than the ticket's known-incompatible outcome. | `IMPLEMENTED_WITH_SCOPE_LEAKAGE` |

## 6. Gap closure

| Gap | Validated delta | Implementation evidence | Residual | Result |
|---|---|---|---|---|
| `GAP-004` | Semver meaning and explicit supported sets were absent. | `SemanticVersion`, `SupportedVersionSet`, exact resolver checks; direct focused tests. | No material residual for the ticket-owned version behavior. | `GAP_CLOSED` |
| `GAP-006` | Deterministic frozen-basis registry was absent. | Complete `RegistryEntry`, immutable `CatalogBasis`, duplicate rejection, deterministic resolution. | Full durable/reconstruction semantics remain outside this ticket as authorized. | `GAP_CLOSED` |
| `GAP-008` | Independent NORMAL and BOOTSTRAP catalogs were absent. | Explicit `CatalogScope`, independent bases and source/revision fields. | `ResolveExecCapability` accepts a direct basis without binding it to the requested scope/repository; cross-scope substitution remains possible. | `GAP_CLOSED_WITH_NEW_CONTRADICTION` |
| `GAP-009` | Bootstrap allowlist and normal-capability rejection were absent. | `BootstrapAllowlistPolicy` and incompatible failure for a NORMAL entry in a BOOTSTRAP basis. | A caller can supply a NORMAL basis while requesting BOOTSTRAP, bypassing the requested scope and allowlist boundary. | `GAP_CLOSED_WITH_NEW_CONTRADICTION` |
| `GAP-010` | Compatible/unknown/incompatible capability resolution was absent. | Resolver returns `UNKNOWN_CAPABILITY` for no candidates and `INCOMPATIBLE_CAPABILITY` for unsupported versions. | A known skill/capability with a mismatched schema is filtered out and returned as unknown. | `GAP_CLOSED_WITH_NEW_CONTRADICTION` |
| `GAP-011` | Registry-only synthetic extensibility was absent. | `RegisterExecCapability` and common `CatalogBasis.register` path; old basis remains unchanged. | No local residual in the synthetic registration behavior. | `GAP_CLOSED` |

## 7. Requirement conformance

| Requirement | Required behavior | Evidence | Result |
|---|---|---|---|
| `EXEC-VERSION-001` | Observable major/minor/patch semantics. | Parsed components and direct classification function/tests. | `CONFORMANT` |
| `EXEC-VERSION-002` | Explicit supported set; incompatible versions fail without conversion. | Exact `SupportedVersionSet` membership and resolver failure; focused tests. | `CONFORMANT` |
| `EXEC-REGISTRY-001` | Explicit stage-to-complete-entry mapping. | Registry entry fields and deterministic basis lookup. | `CONFORMANT` |
| `EXEC-REGISTRY-002` | Independent NORMAL and BOOTSTRAP catalog authority. | Scope-separated immutable bases and source/revision fields, but direct-basis scope substitution is accepted by the application boundary. | `PARTIAL` |
| `EXEC-REGISTRY-003` | Bootstrap allowlist rejects normal work before execution. | Domain allowlist rejection works for the selected BOOTSTRAP basis; requested scope can be bypassed with `input.basis`. | `PARTIAL` |
| `EXEC-CAPABILITY-001` | Known/unknown/incompatible resolution preserves canonical outcomes. | Unknown and unsupported-version cases pass; known mismatched schema returns unknown. | `PARTIAL` |
| `EXEC-CAPABILITY-002` | Synthetic capability uses the common registry path without frozen-basis mutation. | Common registration/resolution test and immutable basis implementation. | `CONFORMANT` |

```text
REQUIREMENTS = 7
REQUIREMENTS_CONFORMANT = 4
```

## 8. Acceptance criteria

| Acceptance | Objective evidence | Result |
|---|---|---|
| `AC-EXEC-003` | Focused test observes parsed major/minor/patch fields and NONE/PATCH/MINOR/MAJOR classification. | `SATISFIED` |
| `AC-EXEC-004` | Exact support-set test and the incompatible-version resolution assertion in the focused suite show no alias or conversion. | `SATISFIED` |
| `AC-EXEC-008` | Complete entry fields are constructed and returned; duplicate registration leaves the prior basis unchanged; focused test passes. | `SATISFIED` |
| `AC-EXEC-009` | Scope-separated bases exist and normal repositories are distinct, but application direct-basis substitution defeats complete end-to-end isolation. | `PARTIALLY_SATISFIED` |
| `AC-EXEC-010` | Normal category in a selected BOOTSTRAP basis returns incompatible with no approval/mutation; no work path is invoked. Requested-scope bypass remains. | `PARTIALLY_SATISFIED` |
| `AC-EXEC-011` | Missing capability returns unknown and known unsupported version returns incompatible in direct tests. | `SATISFIED` |
| `AC-EXEC-012` | Synthetic entry registers/resolves through the common path and the old basis remains empty. | `SATISFIED` |

```text
ACCEPTANCE_CRITERIA = 7
ACCEPTANCE_CRITERIA_SATISFIED = 5
ACCEPTANCE_CRITERIA_PARTIALLY_SATISFIED = 2
ACCEPTANCE_CRITERIA_NOT_SATISFIED = 0
ACCEPTANCE_CRITERIA_UNSUPPORTED = 0
ACCEPTANCE_CRITERIA_BLOCKED = 0
```

## 9. Acceptance obligations

| Acceptance | Implementation evidence | Supporting test evidence | Result |
|---|---|---|---|
| `AC-EXEC-003` | `SemanticVersion` components and classification. | TICKET-002 focused suite: 10/10 pass. | `DIRECTLY_CONFORMANT` |
| `AC-EXEC-004` | Explicit support-set checks and incompatible result. | Focused support-set and failure-distinction tests. | `DIRECTLY_CONFORMANT` |
| `AC-EXEC-005` | Immutable new-basis publication contributes frozen-basis behavior. | Synthetic registration and old-basis assertions. Full snapshot proof remains TICKET-005-owned. | `CROSS_SPEC_CONFORMANT` |
| `AC-EXEC-007` | Unsupported version supplies incompatible/no-approval/no-mutation classification. | Focused incompatible failure assertions. Full failure mapping remains TICKET-004-owned. | `CROSS_SPEC_CONFORMANT` |
| `AC-EXEC-008` | Complete registry entry and deterministic lookup. | Direct mapping and duplicate/no-mutation tests. | `DIRECTLY_CONFORMANT` |
| `AC-EXEC-009` | Scope policy and immutable bases exist. | Normal repository isolation test and BOOTSTRAP basis test; no direct substitution witness. | `PARTIAL` |
| `AC-EXEC-010` | Bootstrap policy returns incompatible for a NORMAL-category entry. | Direct allowlist test; no work callback exists in this local implementation. | `PARTIAL` |
| `AC-EXEC-011` | Canonical unknown/incompatible codes for tested paths. | Direct unknown and unsupported-version assertions. | `DIRECTLY_CONFORMANT` |
| `AC-EXEC-012` | Common registration and resolution path. | Synthetic common-path and no-mutation test. | `DIRECTLY_CONFORMANT` |

## 10. Completion evidence

The ticket requires production code, automated tests, local completion evidence,
integration contribution evidence, local legacy/cutover evidence and
conformance evidence. The eight TICKET-002 evidence files exist, and the
focused runtime and explicit strict source typecheck were independently run:

```text
node --experimental-strip-types --test tests/exec-001-ticket-002.test.ts = 10/10 PASS
node --experimental-strip-types --test tests/exec-001-ticket-001.test.ts = 21/21 PASS
npm test = 27/27 PASS (workflow-orchestrator suite)
explicit strict tsc over TICKET-002 source/test surface = PASS
```

The evidence files themselves contain assertions and `10/10` claims but do not
contain the ticket-required executed command output. The ticket's execution
record is an implementation claim and is not independent completion evidence.

| Required item | Evidence | Classification |
|---|---|---|
| `production_code` | Four production registry modules exist and are exercised by focused tests. | `PRESENT_AND_VERIFIED` |
| `automated_tests` | Focused TICKET-002 test and explicit strict source typecheck pass. | `PRESENT_AND_VERIFIED` |
| `local_completion_evidence` | Eight file-addressed evidence artifacts exist, but omit executed command output. | `PRESENT_BUT_WEAK` |
| `integration_evidence` | AC-EXEC-005/007 contribution records exist; foreign producers remain unavailable and integrated-only. | `PRESENT_BUT_WEAK` |
| `legacy_transition_evidence` | Ticket declares `NEW_CANONICAL_PATH` and REPO-owned legacy compatibility, but no direct executed local transition witness is recorded. | `PRESENT_BUT_WEAK` |
| `conformance_evidence` | Ticket self-check and claims exist; independent conformance evidence is the subject of this audit and cannot be treated as pre-existing completion evidence. | `PRESENT_BUT_WEAK` |

```text
COMPLETION_EVIDENCE_REQUIRED = 6
COMPLETION_EVIDENCE_VERIFIED = 2
COMPLETION_EVIDENCE_WEAK = 4
COMPLETION_EVIDENCE_MISSING = 0
COMPLETION_EVIDENCE_BLOCKED = 0
```

## 11. Scope creep and status accuracy

```text
SCOPE_CREEP = NONE
UNAUTHORIZED_SCOPE_EXPANSION = NO
SPECULATIVE_FEATURE = NO
FOREIGN_SCOPE_IMPLEMENTATION_IN_PRODUCT_CODE = NO
STATUS_RESULT = STATUS_CORRECT
```

The implementation adds only the authorized registry/version/catalog boundary;
no persistence, execution, DOM lifecycle or REPO enablement behavior was
added. The unrelated and foreign documentary files are scope changes in the
working-tree overlay, not product behavior. `VALIDATION_REQUIRED` accurately
reflects implemented code awaiting independent validation. `BLOCKED_BY: NONE`
and `TICKET_LOCAL_CLOSURE = YES` do not contradict the unavailable foreign
capabilities because their class is `REQUIRED_FOR_INTEGRATED_PROOF`.

## 12. Findings

### CONF-CRITICAL-001 — Caller-supplied basis bypasses scope and authority binding

```text
FINDING_STATUS = OPEN
SEVERITY = CRITICAL
FINDING_CATEGORY = CALLER_SUPPLIED_AUTHORITY_BYPASS
TICKET = EXEC-001-TICKET-002
GAP_IDS = GAP-008, GAP-009
REQUIREMENT_IDS = EXEC-REGISTRY-002, EXEC-REGISTRY-003
ACCEPTANCE_IDS = AC-EXEC-009, AC-EXEC-010
SYSTEMIC_PATTERN = YES
CAPABILITY_RECORDS:
  - UNIT-EXEC-REGISTRY-FIXTURE / DEPENDENCY_CLASS = INFORMATIONAL / PRODUCTIVE_AVAILABILITY = NO
  - DOM-EXEC-IDENTITY-SNAPSHOT / DEPENDENCY_CLASS = REQUIRED_FOR_INTEGRATED_PROOF / PRODUCTIVE_AVAILABILITY = NO
  - REPO-EXEC-NORMAL-CATALOG / DEPENDENCY_CLASS = REQUIRED_FOR_INTEGRATED_PROOF / PRODUCTIVE_AVAILABILITY = NO
LOCAL_CLOSURE_BLOCKING = YES
LOCAL_ACCEPTANCE_REQUIRES_PRODUCTIVE_CAPABILITY = NO
CLOSURE_OWNERSHIP = LOCAL_TICKET for scope binding; INTEGRATED_CHECKPOINT for foreign provenance
COMPLETION_EVIDENCE_TIMING = LOCAL_CLOSURE and integrated proof
DEPENDENCY_CLASS_RECLASSIFICATION_REQUIRED = NO
UPSTREAM_DEPENDENCY_CLASSIFICATION_PRESERVED = YES
SUGGESTED_BLOCKS_LOCAL_EXECUTION = NO
SUGGESTED_BLOCKS_LOCAL_CLOSURE = YES
SUGGESTED_BLOCKS_TICKET_DONE = YES
SUGGESTED_BLOCKS_INTEGRATED_PROOF = YES
SUGGESTED_BLOCKS_SPEC_FINAL_CONFORMANCE = YES
PRIMARY_ROUTE = IMPLEMENTATION_REMEDIATION
DOWNSTREAM_CHECKPOINT = TICKET-002 local closure and later integrated registry proof
DOWNSTREAM_OWNER = EXEC-001 ticket owner, then integrated EXEC checkpoint
```

**Normative authority:** Ticket §14a and §14b require caller input not to
replace a frozen basis and preserve the DOM/REPO producer boundary. The approved
design §7 and §17 states that caller input cannot establish canonical basis
material and that an authorized source or local immutable fixture must select
it. SPEC `EXEC-REGISTRY-002/003` requires independent scope authority and
bootstrap rejection.

**Repository evidence:** `src/application/exec-registry.ts:40-46` returns
`input.basis` immediately, before checking `input.scope` or
`repositoryId`; only source-selected bases receive scope equality checks at
lines 45 and 53. Independent audit simulation supplied a NORMAL basis scoped to
`repo-a` with a request scoped to `repo-b` and received `RESOLVED`. The same
first branch permits a NORMAL basis while the request declares BOOTSTRAP,
thereby avoiding `BootstrapAllowlistPolicy` for the requested context.
`tests/exec-001-ticket-002.test.ts:121-152` does not exercise either mismatch.

**Problem and impact:** The application boundary treats a caller-provided
`CatalogBasis` as authoritative. A caller can substitute another repository's
basis or a NORMAL basis for a BOOTSTRAP request. The domain policy is correct
only for the basis that was selected; the selection itself is not authority
bound. This contradicts catalog isolation and permits bootstrap leakage.

**Minimum correction required:** Remove the unbound direct-basis authority path,
or require it to be an authorized fixture/source selected by the application
and verify the basis against every supplied scope/repository selector before
resolution. Add direct negative witnesses for NORMAL-to-NORMAL repository
substitution and NORMAL-basis-to-BOOTSTRAP substitution, asserting fail-closed
result/no mutation/no work.

### CONF-MAJOR-001 — Known schema incompatibility is reported as unknown

```text
FINDING_STATUS = OPEN
SEVERITY = MAJOR
FINDING_CATEGORY = FAILURE_SEMANTICS_GAP
TICKET = EXEC-001-TICKET-002
GAP_IDS = GAP-010
REQUIREMENT_IDS = EXEC-CAPABILITY-001
ACCEPTANCE_IDS = AC-EXEC-011
SYSTEMIC_PATTERN = NO
CAPABILITY = UNIT-EXEC-REGISTRY-FIXTURE
DEPENDENCY_CLASS = INFORMATIONAL
LOCAL_CLOSURE_BLOCKING = YES
LOCAL_ACCEPTANCE_REQUIRES_PRODUCTIVE_CAPABILITY = NO
CLOSURE_OWNERSHIP = LOCAL_TICKET
COMPLETION_EVIDENCE_TIMING = LOCAL_CLOSURE
DEPENDENCY_CLASS_RECLASSIFICATION_REQUIRED = NO
UPSTREAM_DEPENDENCY_CLASSIFICATION_PRESERVED = YES
SUGGESTED_BLOCKS_LOCAL_EXECUTION = NO
SUGGESTED_BLOCKS_LOCAL_CLOSURE = YES
SUGGESTED_BLOCKS_TICKET_DONE = YES
SUGGESTED_BLOCKS_INTEGRATED_PROOF = YES
SUGGESTED_BLOCKS_SPEC_FINAL_CONFORMANCE = YES
PRIMARY_ROUTE = IMPLEMENTATION_REMEDIATION
DOWNSTREAM_CHECKPOINT = TICKET-002 acceptance/conformance validation
DOWNSTREAM_OWNER = EXEC-001 ticket owner
```

**Normative authority:** Ticket §14a distinguishes unknown capability from a
known incompatible basis/version/schema/role and requires
`UNKNOWN_CAPABILITY` versus `INCOMPATIBLE_CAPABILITY`. The ticket's
`EXEC-CAPABILITY-001` requirement and AC-EXEC-011 require canonical outcome
distinction.

**Repository evidence:** `src/domain/exec-registry.ts:415-481` filters
candidates by input schema before determining whether the skill/capability is
known. An independently executed request for a registered capability with a
valid but different `SchemaReference` returned `UNKNOWN_CAPABILITY`.

**Problem and impact:** A registered capability with a mismatched schema is
indistinguishable from an absent capability. This loses the required canonical
outcome distinction and can misroute diagnosis and integrated failure handling.

**Minimum correction required:** Determine registered capability identity before
schema compatibility, then return the contract-authorized incompatible (or
explicit schema-invalid contract) result for a known capability. Add a direct
mismatched-schema negative witness and preserve no mutation/no approval.

### CONF-MAJOR-002 — Ticket-local completion evidence lacks executed output

```text
FINDING_STATUS = OPEN
SEVERITY = MAJOR
FINDING_CATEGORY = COMPLETION_EVIDENCE_GAP
TICKET = EXEC-001-TICKET-002
GAP_IDS = GAP-004, GAP-006, GAP-008, GAP-009, GAP-010, GAP-011
REQUIREMENT_IDS = EXEC-VERSION-001, EXEC-VERSION-002, EXEC-REGISTRY-001, EXEC-REGISTRY-002, EXEC-REGISTRY-003, EXEC-CAPABILITY-001, EXEC-CAPABILITY-002
ACCEPTANCE_IDS = AC-EXEC-003, AC-EXEC-004, AC-EXEC-008, AC-EXEC-009, AC-EXEC-010, AC-EXEC-011, AC-EXEC-012
SYSTEMIC_PATTERN = YES
CAPABILITY = UNIT-EXEC-REGISTRY-FIXTURE
DEPENDENCY_CLASS = INFORMATIONAL
LOCAL_CLOSURE_BLOCKING = YES
LOCAL_ACCEPTANCE_REQUIRES_PRODUCTIVE_CAPABILITY = NO
CLOSURE_OWNERSHIP = LOCAL_TICKET
COMPLETION_EVIDENCE_TIMING = LOCAL_CLOSURE
DEPENDENCY_CLASS_RECLASSIFICATION_REQUIRED = NO
UPSTREAM_DEPENDENCY_CLASSIFICATION_PRESERVED = YES
SUGGESTED_BLOCKS_LOCAL_EXECUTION = NO
SUGGESTED_BLOCKS_LOCAL_CLOSURE = YES
SUGGESTED_BLOCKS_TICKET_DONE = YES
SUGGESTED_BLOCKS_INTEGRATED_PROOF = NO
SUGGESTED_BLOCKS_SPEC_FINAL_CONFORMANCE = NO
PRIMARY_ROUTE = IMPLEMENTATION_REMEDIATION
DOWNSTREAM_CHECKPOINT = TICKET-002 local completion gate
DOWNSTREAM_OWNER = EXEC-001 ticket owner
```

**Normative authority:** Ticket §19 requires the file-addressed completion
evidence to contain canonical assertions, no-mutation evidence and executed
test output. Ticket §20 marks local completion evidence and conformance
evidence required.

**Repository evidence:** All eight files under
`docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/` contain result claims and
`FOCUSED_TICKET_TESTS = 10/10`, but none records the executed command or its
output. The ticket §27 execution record is a claim, not independent evidence.
The audit independently reproduced 10/10 TICKET-002 tests, 21/21 TICKET-001
tests, 27/27 package regression tests and an explicit strict source typecheck,
but that later audit observation does not make the required historical
completion artifacts complete.

**Problem and impact:** The required completion-evidence artifacts are present
but weak, so the local completion gate cannot independently verify the claimed
execution record, no-mutation assertions and conformance evidence from the
file-addressed evidence set.

**Minimum correction required:** Update each required evidence artifact with
exact runtime/static commands, executed output/counts, direct canonical result
assertions and no-mutation evidence; include the local legacy/cutover and
conformance evidence required by the ticket gate, then reconcile the execution
record to those artifacts.

## 13. Specialist summary

```text
Audit: docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-ticket-conformance-audit.md

Specialist:
TICKET_CONFORMANCE

Ticket: EXEC-001-TICKET-002

Changed files: 29

Gaps: 6

Gaps closed: 3

Requirements: 7

Requirements conformant: 4

Acceptance criteria: 7

Acceptance criteria satisfied: 5

Completion evidence missing: 0

Unauthorized scope expansion:
NO

Findings:
CRITICAL=1
MAJOR=2
MINOR=0
INFO=0

Domain audit complete:
YES

Specialist result:
SPECIALIST_CONFORMANCE_FINDINGS
```

AUDIT_TARGET_HEAD: d4216ad6f4a87fe7142ccd45d3fd099ef1b92955
AUDIT_TARGET_STATE_FINGERPRINT: 4ae3e359d87e354024c62f86fca4eba759e78335f78696185277e0e37a3e0bf4
DOMAIN_AUDIT_COMPLETE: YES
SPECIALIST_RESULT: SPECIALIST_CONFORMANCE_FINDINGS