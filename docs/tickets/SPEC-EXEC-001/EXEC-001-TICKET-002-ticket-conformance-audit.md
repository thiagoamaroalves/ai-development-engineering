# Ticket Conformance Audit — EXEC-001-TICKET-002

## 1. Audit mode and subject

```text
AUDIT_SKILL = audit-ticket-conformance
AUDIT_MODE = READ_ONLY; INDEPENDENT; ADVERSARIAL; TICKET_SCOPED; SPEC_FIRST; GAP_MATRIX_AWARE; PLAN_AWARE; DIFF_AWARE; EVIDENCE_REQUIRED
TICKET_ID = EXEC-001-TICKET-002
TICKET_PATH = docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-version-registry-catalogs-capabilities.md
TICKET_STATUS = VALIDATION_REQUIRED
IMPLEMENTATION_UNIT = EXEC-IMP-02 — Version, registry resolution, catalogs and capability extensibility
IMPLEMENTATION_BASELINE = 8f62b283b1dbf487911c7c459db95cadc25ff101
CURRENT_HEAD = c450df1c4523a841484cbf1acb8cd1ab57621017
AUDIT_TARGET_HEAD = c450df1c4523a841484cbf1acb8cd1ab57621017
AUDIT_TARGET_STATE_FINGERPRINT = d91db0e8d277c66499d9d4fd5dc0a05818aeb7d39faf1303876abc8e6d165192
```

The pinned HEAD was present before evidence collection and the working tree
remained clean afterward. The supplied state fingerprint is recorded as the
semantic audit basis. No production code, tests, ticket state, authority,
Git state, commit, branch, remote, or publication state was changed.

### Required inputs

| Input | Value |
|---|---|
| Gap IDs | `GAP-004`, `GAP-006`, `GAP-008`, `GAP-009`, `GAP-010`, `GAP-011` |
| Requirement IDs | `EXEC-VERSION-001`, `EXEC-VERSION-002`, `EXEC-REGISTRY-001`, `EXEC-REGISTRY-002`, `EXEC-REGISTRY-003`, `EXEC-CAPABILITY-001`, `EXEC-CAPABILITY-002` |
| Acceptance IDs | `AC-EXEC-003`, `AC-EXEC-004`, `AC-EXEC-008`, `AC-EXEC-009`, `AC-EXEC-010`, `AC-EXEC-011`, `AC-EXEC-012`; contributor to `AC-EXEC-005`, `AC-EXEC-007` |
| ADR paths | `docs/adrs/ADR-0003-versioned-skill-contracts.md` (primary accepted authority); related ownership/boundary ADRs are consumed by the approved SPEC and Plan |
| SPEC path | `docs/specs/SPEC-EXEC-001-skill-contracts-and-capability-registry.md` |
| Gap Matrix path | `docs/specs/gap-matrices/SPEC-EXEC-001-implementation-gap-matrix.md` |
| Gap Matrix audit path | `docs/specs/gap-matrices/audits/SPEC-EXEC-001-implementation-gap-matrix-audit.md` |
| Implementation Plan path | `docs/specs/implementation-plans/SPEC-EXEC-001-implementation-plan.md` |
| Plan audit path | `docs/specs/implementation-plans/audits/SPEC-EXEC-001-implementation-plan-audit.md` |
| Ticket-set audit path | `docs/tickets/SPEC-EXEC-001/implementation-ticket-audit.md` |
| Changed files | The pinned checkpoint delta contains 16 files; all are classified in §4 |

## 2. Traceability and execution eligibility

### Traceability

`TRACEABILITY_CONFORMANT`.

The ticket resolves to `SPEC-EXEC-001`, unit `EXEC-IMP-02`, the six validated
Gaps, seven requirements, and the seven locally owned acceptance criteria.
`ADR-0003` revision 3 is accepted. The SPEC, Gap Matrix, Gap Matrix audit,
Implementation Plan, Plan audit, and ticket-set audit are present and
conformant at their recorded authority gates. The ticket-set audit records the
one-to-one unit mapping, ownership, local closure, acceptance allocation, and
predecessor release. No orphan, invalid, foreign, or invented reference was
found.

### Execution eligibility

```text
UPSTREAM_AUTHORITY_COMPLETE = YES
PREDECESSOR_EXEC-001-TICKET-001 = DONE before implementation
LOCAL_ACCEPTANCE_PROVABLE_NOW = YES
LOCAL_COMPLETION_EVIDENCE_PRODUCIBLE_NOW = YES
REQUIRED_FOR_LOCAL_EXECUTION_CAPABILITIES_PRODUCTIVELY_AVAILABLE = NOT_APPLICABLE (none)
REQUIRED_FOR_LOCAL_CLOSURE_CAPABILITIES_PRODUCTIVELY_AVAILABLE = NOT_APPLICABLE (none)
EXECUTION_READY_AT_START = TRUE
EXECUTION_ELIGIBILITY = EXECUTION_ELIGIBILITY_CONFIRMED
```

The ticket's `INITIAL_DAG_STATE = BLOCKED` and `EXECUTION_READY = FALSE` are
historical planning fields. The predecessor was finalized before this unit's
implementation, and the ticket-set audit independently records the released
TICKET-002 readiness. The current `STATUS = VALIDATION_REQUIRED` is the
post-implementation validation state, not an execution-start claim.

Foreign capabilities are preserved as integrated-only and do not contradict
local readiness:

| Capability | Authority / contract | Local testability | Productive availability | Dependency class | Local acceptance requires productive capability | Local closure blocking | Classification result |
|---|---|---:|---:|---|---:|---:|---|
| `DOM-EXEC-IDENTITY-SNAPSHOT` | DEFINED / DEFINED | NO | NO | `REQUIRED_FOR_INTEGRATED_PROOF` | NO | NO | preserved; integrated follow-up only |
| `REPO-EXEC-NORMAL-CATALOG` | DEFINED / DEFINED | NO | NO | `REQUIRED_FOR_INTEGRATED_PROOF` | NO | NO | preserved; integrated follow-up only |
| Unit registry fixture | DEFINED / DEFINED | YES | NO (fixture only) | `INFORMATIONAL` | NO | NO | local contract evidence only |

```text
UPSTREAM_DEPENDENCY_CLASSIFICATION_PRESERVED = YES
DEPENDENCY_CLASS_RECLASSIFICATION_REQUIRED = NO
INTEGRATED_ONLY_AVAILABILITY_BLOCKING_LOCAL_DONE = 0
```

No unavailable capability was silently promoted to a local blocker, and no
fixture was treated as productive availability. Physical CAS/concurrent
publication remains an integrated PLAT concern and is not a local ticket
closure dependency.

## 3. Reconstructed canonical implementation contract

### Required local behavior

1. Parse and expose semantic-version major/minor/patch meaning; resolve only
   explicit supported versions and return `INCOMPATIBLE_CAPABILITY` for an
   unsupported version without aliasing or conversion.
2. Resolve a complete stage/skill/capability mapping deterministically from an
   immutable catalog basis, including schemas, artifacts, verdicts, and roles.
3. Keep NORMAL repository-scoped and BOOTSTRAP system-scoped, with separate
   source/revision authority; reject a non-allowlisted bootstrap capability as
   `INCOMPATIBLE_CAPABILITY` before normal work.
4. Preserve `UNKNOWN_CAPABILITY` versus `INCOMPATIBLE_CAPABILITY` and fail
   closed on malformed or unverified resolution material.
5. Register and resolve a schema-valid synthetic capability through the common
   registry path while publishing a new basis and leaving the frozen basis
   unchanged.

### Integration behavior

The implementation exposes narrow DOM execution-basis, REPO NORMAL-catalog,
and independent system-bootstrap source seams. It verifies producer-issued
receipts, source kind, scope, source label, and exact catalog revision. It
contributes the registry contract to downstream snapshot and failure owners;
it does not claim productive DOM/REPO availability.

### Does not implement

DOM `RepositoryId` or lifecycle; REPO configuration/enablement; session or
scheduler behavior; physical persistence, recovery, or CAS; effects; transport,
UI, or OPS mappings; registry semantic reconstruction owned by TICKET-003.
The implementation does not add a legacy registry writer or a silent conversion
path.

### Normative authority and expected impact

The contract is anchored in ADR-0003, SPEC §§12.1 and 13, Gap Matrix rows
GAP-004/006/008/009/010/011, Plan unit EXEC-IMP-02, and the approved design
§§2–4, 7, 9, 13, 16–20. Expected impact is the EXEC registry/version/catalog
boundary, narrow source seams, direct tests, and local evidence only.

## 4. Changed-file classification and scope

The pinned checkpoint commit (`c450df1`) changes 16 files. The complete
implementation surface was also inspected, including the previously established
`src/application/exec-registry-ports.ts` and `src/composition/exec-registry.ts`
seams. The target delta is entirely authorized.

| Classification | Files |
|---|---:|
| `DIRECT_TICKET_IMPLEMENTATION` | 2 — `src/domain/exec-registry.ts`, `src/application/exec-registry.ts` |
| `REQUIRED_SHARED_SUPPORT` | 0 in the pinned checkpoint delta; authenticated schema support in `src/domain/exec-contract.ts` was inspected as an already established shared seam |
| `REQUIRED_TEST_CHANGE` | 3 — `tests/exec-001-ticket-002.test.ts`, `tests/exec-registry-import-boundary-loader.mjs`, `tests/fixtures/exec-registry-forbidden-import.mjs` |
| `REQUIRED_MIGRATION` | 0 |
| `AUTHORIZED_GENERATED_ARTIFACT` | 11 — the remediation checkpoint, implementation-remediation record, ticket execution record, and eight required TICKET-002 evidence snapshots |
| `UNRELATED_CHANGE` | 0 in the pinned checkpoint delta |
| `SCOPE_EXPANSION` | 0 |
| `FOREIGN_SCOPE_CHANGE` | 0 |

```text
CHANGED_FILES_TOTAL = 16
IN_SCOPE_FILES = 16
UNRELATED_FILES = 0
SCOPE_EXPANSION_FILES = 0
FOREIGN_SCOPE_FILES = 0
```

The required import-boundary loader is test-owned architecture support, not a
production dependency. No storage, transport, lifecycle, alternate registry,
or foreign authority implementation was introduced.

## 5. Required behavior coverage

| Required behavior | Evidence | Result |
|---|---|---|
| Semantic version parsing, major/minor/patch classification, and exact explicit support sets | `src/domain/exec-registry.ts:90–203`; tests `parses semantic versions...` and `resolves only authenticated explicit supported versions...` | `IMPLEMENTED` |
| Complete deterministic mapping for a frozen basis | `RegistryEntry`, `CatalogBasis`, and `RegistryResolutionService` at `src/domain/exec-registry.ts:304–483, 578–623`; tests `resolves a complete registered mapping...` and `selects the exact compatible version...` | `IMPLEMENTED` |
| Duplicate/conflict rejection and frozen-basis immutability | `CatalogBasis.register` at `src/domain/exec-registry.ts:461–468`; tests `rejects duplicate and conflicting registration...`, `rejects unsafe catalog revision progression...`, and synthetic registration | `IMPLEMENTED` |
| Independent NORMAL/BOOTSTRAP scope and source authority | `src/domain/exec-registry.ts:234–259`; `src/application/exec-registry.ts:75–153`; tests `keeps NORMAL repositories isolated...` and `rejects matching-source forgery...` | `IMPLEMENTED` |
| Bootstrap allowlist and before-work rejection | `BootstrapAllowlistPolicy` at `src/domain/exec-registry.ts:562–567`; tests `keeps BOOTSTRAP independent and rejects normal capabilities before work` | `IMPLEMENTED` |
| Distinct unknown/incompatible outcomes and fail-closed malformed source/result handling | `src/domain/exec-registry.ts:578–623`; application receipt verification at `src/application/exec-registry.ts:131–167`; tests `distinguishes unknown from every known incompatibility...` and malformed/untrusted source tests | `IMPLEMENTED` |
| Common-path synthetic capability extensibility without frozen-basis mutation | `RegistryEntry.create` and `CatalogBasis.register`; test `registers a synthetic capability through the common domain registry path` | `IMPLEMENTED` |
| Does-not-implement boundaries | Import guard, narrow ports, no infrastructure/prototype/transport imports, and composition-only wiring | `IMPLEMENTED_WITHOUT_SCOPE_LEAKAGE` |

No required behavior is partial, missing, or contradictory.

## 6. Gap closure

| Gap | Validated delta | Implementation evidence | Residual | Result |
|---|---|---|---|---|
| `GAP-004` | Productive semver meaning and explicit supported-set enforcement were absent | `SemanticVersion`, `SupportedVersionSet`, `VersionCompatibilityPolicy`; focused tests and AC-EXEC-003 evidence | Productive cross-SPEC basis remains an integrated dependency, not this Gap's local semantic closure | `GAP_CLOSED` |
| `GAP-006` | Deterministic frozen-basis stage/capability registry was absent | `RegistryEntry`, immutable `CatalogBasis`, resolver, source-bound application seam; AC-EXEC-008 evidence | Physical producer/CAS proof is outside this unit and retained for integrated proof | `GAP_CLOSED` |
| `GAP-008` | Independent NORMAL and BOOTSTRAP catalogs were absent | `CatalogScope`, independent source kinds, receipt verification, isolation tests; AC-EXEC-009 evidence | Productive DOM/REPO producers remain integrated-only | `GAP_CLOSED` |
| `GAP-009` | Bootstrap allowlist and normal-capability rejection were absent | `BOOTSTRAP_CAPABILITY_CATEGORIES`, `BootstrapAllowlistPolicy`, no-normal-source-read witness; AC-EXEC-010 evidence | Actual onboarding/enablement remains REPO-owned | `GAP_CLOSED` |
| `GAP-010` | Compatible capability resolution and canonical unknown/incompatible outcomes were absent | Resolver result codes and direct distinction tests; AC-EXEC-011 evidence | Downstream structured failure mapping remains TICKET-004-owned | `GAP_CLOSED` |
| `GAP-011` | Common registry extensibility without frozen-basis mutation was absent | Authenticated `RegistryEntry`, common `CatalogBasis.register`, synthetic-path test; AC-EXEC-012 evidence | Productive source publication/CAS remains integrated-only | `GAP_CLOSED` |

All six active ticket-owned Gaps are closed. No new contradiction or residual
local Gap was introduced.

## 7. Requirement conformance

| Requirement | Required behavior | Evidence | Result |
|---|---|---|---|
| `EXEC-VERSION-001` | Observable semver major/minor/patch meaning | `SemanticVersion`, `classifySemanticVersionChange`, focused semver test | `CONFORMANT` |
| `EXEC-VERSION-002` | Explicit supported set; unsupported capability version is `INCOMPATIBLE_CAPABILITY` without alias/conversion; malformed schema/request is fail-closed | `SupportedVersionSet`, resolver failure path, focused negative tests | `CONFORMANT` |
| `EXEC-REGISTRY-001` | Deterministic complete mapping of stage, capability, skill, versions, schemas, artifacts, verdicts, and roles | `RegistryEntry`, basis resolver, complete mapping assertions | `CONFORMANT` |
| `EXEC-REGISTRY-002` | Independent NORMAL and BOOTSTRAP catalog source/version authority | Authenticated source kinds, scope binding, isolation and substitution negatives | `CONFORMANT` |
| `EXEC-REGISTRY-003` | Bootstrap allowlist rejects normal capability before normal work | Allowlist policy and normal-source non-invocation witness | `CONFORMANT` |
| `EXEC-CAPABILITY-001` | Compatible resolution and distinct unknown/incompatible canonical codes | Resolver and AC-EXEC-011 evidence | `CONFORMANT` |
| `EXEC-CAPABILITY-002` | Schema-valid synthetic capability uses common registry and does not mutate frozen basis | Common `RegistryEntry`/`CatalogBasis` path and no-mutation assertions | `CONFORMANT` |

```text
REQUIREMENTS = 7
REQUIREMENTS_CONFORMANT = 7
```

## 8. Acceptance criteria

| Acceptance criterion | Objective evidence | Result |
|---|---|---|
| `AC-EXEC-003` | Focused test: semantic components, exact comparison, change classification; AC-EXEC-003 evidence | `SATISFIED` |
| `AC-EXEC-004` | Explicit support-set membership rejects `2.0.0` with `INCOMPATIBLE_CAPABILITY`; invalid request/schema path is fail-closed; AC-EXEC-003 and AC-EXEC-007 evidence | `SATISFIED` |
| `AC-EXEC-008` | Complete entry fields and order-independent exact resolution; AC-EXEC-008 evidence | `SATISFIED` |
| `AC-EXEC-009` | NORMAL repository isolation, independent BOOTSTRAP source, source/scope/revision substitution rejection; AC-EXEC-009 evidence | `SATISFIED` |
| `AC-EXEC-010` | Non-allowlisted NORMAL category in BOOTSTRAP returns `INCOMPATIBLE_CAPABILITY`; normal-work source is not read; AC-EXEC-010 evidence | `SATISFIED` |
| `AC-EXEC-011` | Missing capability returns `UNKNOWN_CAPABILITY`; known unsupported version/schema returns `INCOMPATIBLE_CAPABILITY`; AC-EXEC-011 evidence | `SATISFIED` |
| `AC-EXEC-012` | Synthetic schema-authenticated entry resolves through the same common path and old basis remains unchanged; AC-EXEC-012 evidence | `SATISFIED` |

```text
ACCEPTANCE_CRITERIA = 7
ACCEPTANCE_CRITERIA_SATISFIED = 7
```

## 9. Acceptance obligations

The ticket is a contributor to AC-EXEC-005 and AC-EXEC-007; those final proof
owners remain TICKET-005 and TICKET-004 respectively. The local contributions
are independently evidenced and do not claim downstream ownership.

| Acceptance | Implementation evidence | Supporting test evidence | Result |
|---|---|---|---|
| `AC-EXEC-003` | Semver value object and change classifier | Focused test, 23/23 | `DIRECTLY_CONFORMANT` |
| `AC-EXEC-004` | Explicit supported-set and incompatible outcome | Focused negative tests and AC-EXEC-003 evidence | `DIRECTLY_CONFORMANT` |
| `AC-EXEC-008` | Complete deterministic registry entry resolution | Mapping/order tests, 23/23 | `DIRECTLY_CONFORMANT` |
| `AC-EXEC-009` | Scope/source/revision isolation and immutable bases | Isolation and substitution tests, 23/23 | `DIRECTLY_CONFORMANT` |
| `AC-EXEC-010` | Bootstrap category policy and before-work boundary | Allowlist and non-invocation test, 23/23 | `DIRECTLY_CONFORMANT` |
| `AC-EXEC-011` | Unknown/incompatible result distinction | Canonical outcome test, 23/23 | `DIRECTLY_CONFORMANT` |
| `AC-EXEC-012` | Common registry synthetic registration path | Synthetic/no-mutation test, 23/23 | `DIRECTLY_CONFORMANT` |
| `AC-EXEC-005` | New basis publication and prior-basis immutability contribution | Frozen-basis and duplicate/conflict tests; AC-EXEC-005 evidence | `CROSS_SPEC_CONFORMANT` |
| `AC-EXEC-007` | Local incompatible/fail-closed classification contribution | Failure classification tests; AC-EXEC-007 evidence | `CROSS_SPEC_CONFORMANT` |

No acceptance obligation is unsupported. The two cross-spec results explicitly
retain their downstream final proof owners.

## 10. Completion evidence

| Required evidence item | Repository evidence | Classification |
|---|---|---|
| Production code | Domain registry, application orchestration, source ports and composition root; target code inspected | `PRESENT_AND_VERIFIED` |
| Automated tests | Focused TICKET-002 suite 23/23; package suite 71/71; TICKET-001 regression 21/21 | `PRESENT_AND_VERIFIED` |
| Local completion evidence | Eight required evidence snapshots under `evidence/TICKET-002/`, with commands, assertions, target and outputs | `PRESENT_AND_VERIFIED` |
| Integration evidence as contract contribution | AC-EXEC-005/007 contribution records and preserved DOM/REPO integrated-only handoffs | `PRESENT_AND_VERIFIED` |
| Legacy/cutover evidence for local scope | `NEW_CANONICAL_PATH`/`CUTOVER` declarations, explicit no-alias/no-conversion behavior, and no legacy registry writer in the changed implementation | `PRESENT_AND_VERIFIED` |
| Conformance evidence | Approved design, ticket execution record, checkpoint record, typecheck and governance/architecture guards | `PRESENT_AND_VERIFIED` |

```text
COMPLETION_EVIDENCE_REQUIRED = 6
COMPLETION_EVIDENCE_VERIFIED = 6
COMPLETION_EVIDENCE_MISSING = 0
```

Audit execution independently reproduced:

```text
node --experimental-strip-types --test tests/exec-001-ticket-002.test.ts = 23 passed, 0 failed, 0 skipped
node --experimental-strip-types --test tests/exec-001-ticket-001.test.ts = 21 passed, 0 failed, 0 skipped
npm test = 71 passed, 0 failed, 0 skipped
npm run typecheck = PASS
npm run verify:audit-governance = PASS
npm run verify:skill-mirror = PASS
```

## 11. Scope creep and status accuracy

```text
SCOPE_CREEP = NONE
UNAUTHORIZED_SCOPE_EXPANSION = NO
SPECULATIVE_FEATURE = NO
FOREIGN_SCOPE_IMPLEMENTATION = NO
STATUS_ACCURACY = STATUS_CORRECT
TICKET_STATUS = VALIDATION_REQUIRED
```

The implementation adds only the authorized EXEC version/registry/catalog
boundary, its approved source seams, local tests, and evidence. It does not
implement DOM, REPO, PLAT, transport, lifecycle, or effect behavior. The
current validation-required status accurately reflects that independent audit
is pending. `TICKET_LOCAL_CLOSURE = YES` is consistent with all local witnesses
being executable now; integrated-only capabilities do not contradict it.

## 12. Findings

No CRITICAL, MAJOR, MINOR, or INFO conformance finding was identified.

The absence of productive DOM/REPO producers is an explicitly authorized
integrated-only dependency record, not a local implementation defect:

```text
INTEGRATED_HANDOFF_RECORD = YES
HANDOFF_CATEGORY = CAPABILITY_AVAILABILITY_CONTRADICTION
SPECIALIST_FINDING_ID = NONE (not a local conformance finding)
CAPABILITY = DOM-EXEC-IDENTITY-SNAPSHOT; REPO-EXEC-NORMAL-CATALOG
DEPENDENCY_CLASS = REQUIRED_FOR_INTEGRATED_PROOF
LOCAL_CLOSURE_BLOCKING = NO
LOCAL_ACCEPTANCE_REQUIRES_PRODUCTIVE_CAPABILITY = NO
CLOSURE_OWNERSHIP = INTEGRATED_CHECKPOINT
COMPLETION_EVIDENCE_TIMING = INTEGRATED_CHECKPOINT
DEPENDENCY_CLASS_RECLASSIFICATION_REQUIRED = NO
UPSTREAM_DEPENDENCY_CLASSIFICATION_PRESERVED = YES
BLOCKS_LOCAL_EXECUTION = NO
BLOCKS_LOCAL_CLOSURE = NO
BLOCKS_TICKET_DONE = NO
BLOCKS_INTEGRATED_PROOF = YES
BLOCKS_SPEC_FINAL_CONFORMANCE = YES
PRIMARY_ROUTE = IMPLEMENTATION_PLAN_REVALIDATION / owning integrated checkpoint
DOWNSTREAM_CHECKPOINT = CP-EXEC-01
DOWNSTREAM_OWNER = DOM/REPO producers with EXEC consumer owner
OPEN_INTEGRATED_FINDING_TRACEABILITY = COMPLETE
```

This record does not convert the integrated handoff into a specialist finding
or a local completion gate. The consolidator owns canonical `BLOCKS_*` values.

## 13. Required summary

```text
Audit: .pi/runtime/workflow-audits/72e54edf-031a-436b-9c04-82f31bc2a04b/conformance-EXEC-001-TICKET-002-ticket-conformance-audit.md

Specialist:
TICKET_CONFORMANCE

Ticket: EXEC-001-TICKET-002

Changed files: 16

Gaps: 6

Gaps closed: 6

Requirements: 7

Requirements conformant: 7

Acceptance criteria: 7

Acceptance criteria satisfied: 7

Completion evidence missing: 0

Unauthorized scope expansion:
NO

Findings:
CRITICAL=0
MAJOR=0
MINOR=0
INFO=0

Domain audit complete:
YES

Specialist result:
SPECIALIST_CONFORMANCE_PASS
```

AUDIT_TARGET_HEAD: c450df1c4523a841484cbf1acb8cd1ab57621017
AUDIT_TARGET_STATE_FINGERPRINT: d91db0e8d277c66499d9d4fd5dc0a05818aeb7d39faf1303876abc8e6d165192
AUDIT_WAVE_ID: 72e54edf-031a-436b-9c04-82f31bc2a04b
DOMAIN_AUDIT_COMPLETE: YES
SPECIALIST_RESULT: SPECIALIST_CONFORMANCE_PASS