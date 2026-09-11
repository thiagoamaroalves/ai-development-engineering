# DOM-001-TICKET-001 — Implementation Behavior Audit

## Audit basis

```text
TICKET_ID: DOM-001-TICKET-001
TICKET_PATH: docs/tickets/SPEC-DOM-001/DOM-001-TICKET-001-canonical-identity-lineage.md
IMPLEMENTATION_UNIT: DOM-IMP-01 — Canonical identity and lineage authority
REQUIREMENT_IDS: DOM-ID-001, DOM-LINEAGE-001
ACCEPTANCE_IDS: AC-DOM-001, AC-DOM-005; contribution to AC-DOM-052
SPEC_PATH: docs/specs/SPEC-DOM-001-workflow-authority-and-governance.md
GAP_MATRIX_PATH: docs/specs/gap-matrices/SPEC-DOM-001-implementation-gap-matrix.md
IMPLEMENTATION_PLAN_PATH: docs/specs/implementation-plans/SPEC-DOM-001-implementation-plan.md
IMPLEMENTATION_DESIGN_PATH: docs/tickets/SPEC-DOM-001/DOM-001-TICKET-001-implementation-design.md
PRIOR_CANONICAL_AUDIT: docs/tickets/SPEC-DOM-001/DOM-001-TICKET-001-implementation-audit.md
REMEDIATION_ARTIFACT: docs/tickets/SPEC-DOM-001/DOM-001-TICKET-001-implementation-remediation.md
TICKET_STATUS_OBSERVED: VALIDATION_REQUIRED
TARGET_HEAD: cbd5fb94a5eb27f059944e19bc479b3f7587de27
CURRENT_HEAD: cbd5fb94a5eb27f059944e19bc479b3f7587de27
TARGET_STATE: target HEAD plus current uncommitted implementation/test remediation
AUDIT_BASIS_FINGERPRINT: 343D1C07BBF834E4E528B9E4D07AA628CC52F7F645D973BE1B9E72796E29171C
AUDIT_BASIS_STALE: NO
```

The live repository HEAD matched the requested target. The worktree contained
implementation changes in `src/application/lineage.ts`,
`src/application/pipeline.ts`, `src/domain/identity.ts`, `src/domain/lineage.ts`,
and `src/domain/pipeline.ts`, plus test changes in
`tests/dom-001-ticket-001.test.ts` and `tests/dom-001-ticket-004.test.ts`.
Those files were inspected as the current semantic basis. No authority,
production, or test file was modified by this audit.

### Authority reconstruction

```text
ADR-0001 / ADR-0002
  → SPEC-DOM-001: DOM-ID-001, DOM-LINEAGE-001, DOM-PIPE-001, DOM-STATE-001
  → validated SPEC-DOM-001 Gap Matrix: GAP-001, GAP-006, with historical GAP-002 obsolete
  → validated Implementation Plan: DOM-IMP-01 and affected DOM-IMP-04 contract
  → ticket and current Implementation Design
  → repository implementation and executable tests
```

The authority requires canonical `STAGE` identity for `WorkflowPipeline`,
authority-backed creation and reconstruction, independent ADR↔SPEC lineage,
complete immediate-successor provenance for later pipeline states, exact
predecessor/revision continuity, fail-closed rejection, and no mutation on
failure. PLAT remains the physical persistence/recovery owner.

### Baseline reassessment

```text
BASELINE_DRIFT_STATUS: DRIFT_ASSESSED
BASELINE_REMEDIATION_READINESS: READY
REASSESSMENT_COMPLETE: YES
FINDINGS_ARE_ACTIONABLE: YES
```

The prior audit and remediation were read as historical inputs, not as proof.
The current source and tests were re-inspected, the authority chain was
reconstructed, and the affected suites and focused public-boundary probes were
executed against the current worktree. Requirements and acceptance ownership
were preserved. The PLAT capability record was not promoted: its dependency
class remains `REQUIRED_FOR_INTEGRATED_PROOF` and its productive availability
remains `NO`.

## Behavioral contract and applicability

| Dimension | Classification | Audit result / reason |
|---|---|---|
| UNIT_BEHAVIOR | REQUIRED | Identity, Stage reference, lineage, and pipeline reconstruction invariants are executable locally. |
| INTEGRATION_BEHAVIOR | AFFECTED | Application handlers must resolve canonical authority before repository/state-reader access. |
| PERSISTENCE | AFFECTED | Domain ports and rehydration boundaries must preserve exact identity, revision, lineage, and provenance. |
| CONCURRENCY | REQUIRED | Identity reservation and lineage progress use one-winner/CAS semantics locally. |
| STALE_STATE | REQUIRED | Stale identity predecessor and lineage/pipeline expected-progress mutations must fail closed. |
| IDEMPOTENCY | REQUIRED | Duplicate identity/relation reservation must not overwrite or create a second canonical record. |
| DURABILITY | AFFECTED | Durable PLAT storage, serialization, restart, and physical CAS are an integrated checkpoint only. |
| RECOVERY | REQUIRED | Local semantic rehydration and rejection of detached/corrupt/incomplete material are required. |
| COMPATIBILITY | REQUIRED | Historical `PipelineId`/filename-shaped aliases cannot become authority. |
| MIGRATION_BEHAVIOR | NOT_APPLICABLE | No physical migration is owned by this ticket; historical reconciliation is an explicit compatibility concern. |
| NEGATIVE_PATHS | REQUIRED | Unknown, detached, forged, stale, mismatched, unsupported, and corrupt material must fail closed. |

## Acceptance witness audit

The ticket/design acceptance matrix has four normative rows. Each has a direct
operation, positive witness, and direct negative/isolation witness:

| Matrix row | Direct executable evidence | Result |
|---|---|---|
| AC-DOM-001: create, lookup, persist-contract, rehydrate, compare identity | T001 identity creation, exact lookup, revision continuity, immutability, and recovery tests (`tests/dom-001-ticket-001.test.ts:166-461,705-751`) | DIRECT / PASS |
| AC-DOM-001: reject alternate `PipelineId` authority | Canonical Stage boundary and alias rejection (`tests/dom-001-ticket-001.test.ts:463-517`; T004 `231-264`) | DIRECT / PASS |
| AC-DOM-005: add, progress, query, and isolate ADR↔SPEC lineage | Many-to-many, duplicate, isolation, stale-CAS, and concurrent same-pair tests (`tests/dom-001-ticket-001.test.ts:519-629`) | DIRECT / PASS |
| AC-DOM-001/005: immutable authority-backed rehydration | Identity, lineage, and pipeline recovery negatives (`tests/dom-001-ticket-001.test.ts:631-769`; T004 `189-292`) | DIRECT / PASS |

Affected pipeline witnesses were also directly executed: authority-backed
Stage creation, complete accepted provenance, exact predecessor matching,
unknown/detached/unsupported history, and resolve-before-consumer guards.
There are no proxy-only acceptance rows.

```text
REQUIRED_BEHAVIORS_TOTAL: 4
DIRECT_BEHAVIOR_WITNESSES: 4
PROXY_ONLY_BEHAVIORS: 0
UNTESTED_STATE_TRANSITIONS: 0
UNPROVEN_CONCURRENCY_CONTRACTS: 1
MISSING_ARCHITECTURE_GUARDS: 0
WITNESS_EXECUTABLE_AT_LOCAL_CLOSURE: YES for local semantic rows;
  NO for productive PLAT durability/restart/physical-CAS rows
```

## Production behavior classification

| Required behavior | Production path | Classification | Observed behavior |
|---|---|---|---|
| Canonical identity creation and exact lookup | `CanonicalIdentityCatalog.create/resolve`, `src/domain/identity.ts:393-489` | IMPLEMENTED_CORRECTLY | Known kind/scope/value/revision is validated; exact canonical key is looked up; duplicate reservation rejects without overwrite. |
| Exact identity predecessor matching | `src/domain/identity.ts:375-391,418-453` | IMPLEMENTED_CORRECTLY | Later revision requires an immediate predecessor; returned predecessor reference is compared before reservation; mismatched producer output fails closed. |
| Authority-backed Stage creation | `WorkflowPipeline.create`, `src/domain/pipeline.ts:337-364` | IMPLEMENTED_CORRECTLY | Canonical Stage reference is resolved through `resolveForRehydration`; unknown or wrong-kind resolution rejects before aggregate materialization. |
| Lineage endpoint ownership and progress | `src/domain/lineage.ts:84-167`; `src/application/lineage.ts:18-64` | IMPLEMENTED_CORRECTLY | ADR/SPEC endpoints are resolved and kind-checked; progress is immutable; stale expected progress rejects without replacement. |
| Identity and lineage reconstruction | `CanonicalIdentityRecord.rehydrate`, `AdrSpecLineage.rehydrate` | IMPLEMENTED_CORRECTLY | Detached endpoints, missing predecessors, corrupt timestamps, invalid kinds, missing accepted relation, and fabricated progress reject before a valid aggregate is returned. |
| Pipeline provenance reconstruction | `WorkflowPipeline.rehydrate`, `src/domain/pipeline.ts:366-616` | IMPLEMENTED_CORRECTLY locally | Identity and accepted provenance authorities are required; the accepted chain is validated for initial record, immediate successors, continuous revisions, identity attachment, duplicates, order, final state/revision, and exact equality with caller material. |
| Consumer authority ordering | `src/application/pipeline.ts:24-90`; `src/application/lineage.ts:39-64` | IMPLEMENTED_CORRECTLY | Detached Stage input is rejected before pipeline repository lookup/state read; lineage advancement resolves endpoints before pair lookup/CAS. |
| No mutation on local failure | identity reserve, lineage reserve/advance, pipeline repository fixtures | IMPLEMENTED_CORRECTLY locally | Negative witnesses show reserve calls or repository state remain unchanged on mismatched predecessor, unknown Stage, fabricated progress, detached history, and stale mutations. |
| Durable persistence/restart/physical CAS | PLAT contract only; no productive adapter under `src` | PARTIAL / INTEGRATED-ONLY | Domain ports and fixture semantics exist, but productive durable producer, restart/replay, serialization, and physical CAS are unavailable in this basis. |

## Direct negative probes and mutation/authority evidence

The following focused public-boundary probes were run directly against the
current TypeScript sources:

```text
unknown-stage-create:
{"probe":"unknown-stage-create","authorityCalls":1,"materialized":false,"error":"INVALID_PIPELINE_IDENTITY"}

mismatched-predecessor:
{"probe":"mismatched-predecessor","reserveCalls":0,"error":"IDENTITY_REFERENCE_MISMATCH"}

forged-lineage-progress:
{"probe":"forged-lineage-progress","identityCalls":2,"lineageCalls":1,"acceptedProgress":0,"error":"LINEAGE_REFERENCE_MISMATCH"}

unknown-pipeline-provenance:
{"probe":"unknown-pipeline-provenance","authorityCalls":1,"materialized":false,"error":"INVALID_PIPELINE_TRANSITION"}

mismatched-pipeline-history:
{"probe":"mismatched-pipeline-history","authorityCalls":1,"acceptedLength":2,"error":"INVALID_PIPELINE_TRANSITION"}
```

Additional executable witnesses from the affected suites:

- `tests/dom-001-ticket-004.test.ts:231-264` requires authority for direct
  Stage creation and rejects missing authority, unregistered Stage material,
  `PipelineId`-shaped input, and wrong-kind identity.
- `tests/dom-001-ticket-004.test.ts:266-292` rejects a shape-valid provenance
  chain when the accepted provenance authority has no history; the authority
  resolver is called once and its history remains empty.
- `tests/dom-001-ticket-004.test.ts:294-316` records identity-repository size
  before and after unknown Stage creation; it is unchanged.
- `tests/dom-001-ticket-001.test.ts:278-302` proves a corrupt predecessor
  response causes `reserveCalls=0`.
- `tests/dom-001-ticket-001.test.ts:666-679` proves fabricated attached
  lineage progress rejects and accepted progress remains `0`.
- `tests/dom-001-ticket-001.test.ts:705-751` rejects detached, corrupt, and
  incomplete identity history.
- `tests/dom-001-ticket-001.test.ts:771-805` rejects detached pipeline input
  before repository `find` or state-reader access (`findCalls=0`).
- `tests/dom-001-ticket-004.test.ts:366-387` proves stale pipeline expected
  revision rejects without last-write-wins; stored state remains `SPECS` at
  revision `1`.
- `tests/dom-001-ticket-001.test.ts:602-629` proves one same-pair lineage
  advance wins and the conflicting advance is stale; stored progress remains
  `1`.

## Failure semantics coverage

| Failure class | Expected | Observed |
|---|---|---|
| Unknown kind/scope/value/revision | Reject before reservation/materialization | PASS; canonical domain errors asserted. |
| Detached identity or Stage | Reject before consumer/repository effect | PASS; `IDENTITY_NOT_FOUND`/invalid identity and zero consumer access. |
| Forged attached lineage progress | Reject against accepted relation history | PASS; `LINEAGE_REFERENCE_MISMATCH`, accepted history unchanged. |
| Forged/unsupported pipeline history | Reject unknown stage, missing initial/provenance, skips, duplicate/order divergence | PASS; `INVALID_PIPELINE_STAGE` or `INVALID_PIPELINE_TRANSITION`. |
| Mismatched identity/provenance/predecessor | Reject exact mismatch | PASS; no identity reservation and no aggregate materialization. |
| Stale identity/lineage/pipeline mutation | Reject and preserve current state | PASS locally through exact predecessor checks and expected-progress CAS. |
| Duplicate identity/relation | Reject without overwrite/cross-relation mutation | PASS sequentially and under deterministic interleavings. |
| Productive persistence/restart failure | Fail closed with durable recovery evidence | NOT EXECUTABLE; PLAT producer is unavailable and remains integrated-only. |

## Required test inventory and assertion quality

| Test category | Classification | Evidence |
|---|---|---|
| UNIT | REQUIRED_TEST_PRESENT | T001/T004 direct domain tests. |
| INVARIANT | REQUIRED_TEST_PRESENT | Exact kind/scope/revision, endpoint, stage, and provenance assertions. |
| PERSISTENCE_CONTRACT | REQUIRED_TEST_PRESENT | In-memory port fixtures exercise reserve/find/rehydration contracts. |
| PERSISTENCE_DURABLE_RESTART | REQUIRED_TEST_MISSING | PLAT productive producer absent; integrated checkpoint. |
| INTEGRATION_PIPELINE_CONSUMERS | REQUIRED_TEST_PRESENT | Detached handler tests prove authority-before-find/read. |
| CROSS_SPEC_PLAT_PRODUCER | REQUIRED_TEST_MISSING | No productive PLAT producer in current repository. |
| CONCURRENCY_LOCAL | REQUIRED_TEST_PRESENT | Deterministic identity/lineage reservation and same-pair conflict tests. |
| CONCURRENCY_PHYSICAL_CAS | REQUIRED_TEST_MISSING | Physical CAS belongs to PLAT and is unavailable. |
| STALE | REQUIRED_TEST_PRESENT | Identity predecessor, lineage progress, and pipeline expected revision tests. |
| IDEMPOTENCY | REQUIRED_TEST_PRESENT | Duplicate identity/relation and one-winner tests. |
| RECOVERY_LOCAL_SEMANTIC | REQUIRED_TEST_PRESENT | Identity, lineage, and pipeline accepted-history reconstruction tests. |
| COMPATIBILITY | REQUIRED_TEST_PRESENT | `PipelineId` and filename-only inputs are rejected. |
| NEGATIVE_PATH | REQUIRED_TEST_PRESENT | Direct unknown/detached/forged/stale/mismatch/unsupported history cases. |
| ARCHITECTURE_GUARD | REQUIRED_TEST_PRESENT | Runtime authority guards plus supplementary source import scans. |
| CONFORMANCE | REQUIRED_TEST_PRESENT | TypeScript lint and affected suite execution. |

```text
REQUIRED_TEST_CATEGORIES: 16
REQUIRED_TESTS_MISSING: 3
```

Assertions are `STRONG` for local semantic behavior: tests assert canonical
error codes, exact stages/revisions/progress, immutable identity, repository
contents, mutation counters, resolver calls, and stale outcomes. Source scans
are supplementary and are not counted as architecture proof; the effective
runtime guards are direct tests. In-memory fixtures prove local contract
semantics only and do not prove productive durability, restart/recovery,
serialization, or physical CAS.

## Conditional dimensions

```text
CONCURRENCY: NON_CONFORMANT overall
  Local reservation and expected-progress/CAS behavior is conformant. Physical
  PLAT CAS remains unexecuted because the productive producer is unavailable.

STALE_BEHAVIOR: CONFORMANT locally
  Exact predecessor, exact identity, expected lineage progress, and expected
  pipeline revision reject stale or conflicting mutations without overwrite.

IDEMPOTENCY: CONFORMANT locally
  Duplicate identity/relation reservation has one winner and preserves state;
  durable retry idempotency remains part of the integrated PLAT checkpoint.

DURABILITY/PERSISTENCE: PARTIAL
  Port and fixture semantics execute; no productive durable adapter, journal,
  serializer, restart path, or physical CAS exists in the audited basis.

RECOVERY: NON_CONFORMANT overall
  Local authority-backed reconstruction is conformant, but productive restart,
  replay, and durable recovery cannot be proven without PLAT.

COMPATIBILITY: CONFORMANT locally
  PipelineId-shaped, filename-only, wrong-kind, detached, and unsupported
  identity paths do not become canonical authority.
```

## Authority and temporal checks

### Authority consumption

DOM semantic authority is defined and locally executable through the catalog,
identity authority, lineage authority, and provenance authority ports. The
foreign capability record remains:

```text
CAPABILITY_ID: CAP-PLAT-SNAPSHOT-PIPELINE-PROVENANCE / PCP-PLAT-01
AUTHORITY_OWNER: SPEC-DOM-001 for meaning; SPEC-PLAT-001 for physical producer
CONSUMER: DOM-IMP-01 / affected DOM-IMP-04 reconstruction boundary
AUTHORITY_STATUS: DEFINED
CONTRACT_STATUS: DEFINED
LOCAL_TESTABILITY: NO (the accepted local fixtures are contract-level evidence only)
PRODUCTIVE_AVAILABILITY: NO
DERIVED_SUMMARY: CONTRACT_DEFINED
DEPENDENCY_CLASS: REQUIRED_FOR_INTEGRATED_PROOF
FAILURE_SEMANTICS: missing, detached, stale, corrupt, duplicate, omitted, or inconsistent material fails closed
```

No fixture, mock, or in-memory repository was promoted to productive
availability. Therefore this specialist preserves the prior canonical finding
`IMA-MAJOR-002` as `OPEN`, integrated-only, with local closure unblocked.

### Caller-as-authority check

```text
CALLER_AS_AUTHORITY_CHECK: PASS
CALLER_SUPPLIED_AUTHORITY_BYPASSES: 0
```

Caller values are parsed candidates only. Identity, Stage, lineage, and
provenance are checked against the supplied authority seams before the valid
aggregate is returned or a consumer repository is reached.

### Temporal authority

```text
TEMPORAL_AUTHORITY_PROOF: NOT_APPLICABLE
```

The ticket performs no external effect after observing mutable external truth.
Expected-progress CAS and stale checks are concurrency/failure semantics, not a
substitute for temporal authority revalidation. Productive PLAT temporal,
durability, and physical-integrity evidence remains outside this local audit.

## Regression result

```text
REGRESSION_RESULT: NO_REGRESSION
REGRESSIONS: 0
```

Executed affected and prototype tests remained green. The current remediation
does not introduce a local behavioral regression. The absent PLAT producer is
pre-existing integrated scope, not classified as a remediation regression.

## Findings

### BEH-MAJOR-001 — Productive PLAT persistence/recovery/CAS remains unavailable

```text
FINDING_STATUS: OPEN
FINDING_CATEGORY: CAPABILITY_AVAILABILITY_CONTRADICTION
SEVERITY: MAJOR
SOURCE_CANONICAL_FINDING: IMA-MAJOR-002
TICKET: DOM-001-TICKET-001
REQUIREMENT_IDS: DOM-ID-001, DOM-LINEAGE-001
ACCEPTANCE_IDS: AC-DOM-001, AC-DOM-005; integrated contribution to AC-DOM-052
REQUIRED_BEHAVIOR: A productive PLAT producer must durably persist and recover canonical identity, lineage, and pipeline provenance with exact revision transport and physical expected-progress CAS.
PRODUCTION_EVIDENCE: src/domain/identity.ts, src/domain/lineage.ts, and src/domain/pipeline.ts expose domain/reconstruction ports; no productive PLAT adapter, durable store, serializer, journal/replay implementation, restart path, or physical CAS exists under src.
TEST_EVIDENCE: 26 T001 tests, 10 T004 tests, 41 affected productive test executions, and 92 prototype tests pass with local fixtures; no productive durable/restart/physical-CAS witness executes.
OBSERVED_RESULT: AUTHORITY_STATUS=DEFINED; CONTRACT_STATUS=DEFINED; LOCAL_TESTABILITY=NO for productive PLAT; PRODUCTIVE_AVAILABILITY=NO.
EXPECTED_RESULT: Integrated PLAT evidence proves durable serialization, restart/replay recovery, not-found/stale/corrupt handling, and physical CAS while DOM retains semantic ownership.
PROBLEM: The authorized foreign producer is not productively consumable in the current basis.
IMPACT: Local green tests cannot prove durable identity/history, restart preservation, serialization compatibility, productive recovery, or physical concurrency.
MINIMUM_CORRECTION_REQUIRED: Revalidate the authorized PLAT producer and integrated checkpoint with productive durability/recovery/physical-CAS evidence. Do not add PLAT mechanics to DOM or promote fixtures.
SYSTEMIC_PATTERN: YES
RELATED_LOCATIONS: src/domain/identity.ts:224-229, src/domain/lineage.ts:60-70, src/domain/pipeline.ts:306-315; docs/specs/implementation-plans/SPEC-DOM-001-implementation-plan.md:1894-1905; docs/specs/SPEC-DOM-001-workflow-authority-and-governance.md:541-561
CAPABILITY: CAP-PLAT-SNAPSHOT-PIPELINE-PROVENANCE / PCP-PLAT-01
DEPENDENCY_CLASS: REQUIRED_FOR_INTEGRATED_PROOF
LOCAL_CLOSURE_BLOCKING: NO
LOCAL_ACCEPTANCE_REQUIRES_PRODUCTIVE_CAPABILITY: NO
CLOSURE_OWNERSHIP: INTEGRATED_CHECKPOINT
EVIDENCE_TIMING: INTEGRATED_PLAT_DURABILITY_AND_RECOVERY_CHECKPOINT
DEPENDENCY_CLASS_RECLASSIFICATION_REQUIRED: NO
UPSTREAM_DEPENDENCY_CLASSIFICATION_PRESERVED: YES
SUGGESTED_BLOCKS_LOCAL_EXECUTION: NO
SUGGESTED_BLOCKS_LOCAL_CLOSURE: NO
SUGGESTED_BLOCKS_TICKET_DONE: NO
SUGGESTED_BLOCKS_INTEGRATED_PROOF: YES
SUGGESTED_BLOCKS_SPEC_FINAL_CONFORMANCE: YES
PRIMARY_ROUTE: IMPLEMENTATION_PLAN_REVALIDATION
DOWNSTREAM_CHECKPOINT: SPEC-DOM-001 / PLAT durable identity-lineage-pipeline provenance integrated checkpoint
DOWNSTREAM_OWNER: SPEC-PLAT-001 producer and integrated plan owner
OPEN_INTEGRATED_FINDING_TRACEABILITY: COMPLETE
```

This finding is intentionally not a local ticket blocker. It preserves
`IMA-MAJOR-002` as OPEN and integrated-only; no dependency-class promotion,
productive-availability claim, ticket-state change, or approval is made here.

## Test execution record

```text
TESTS_RUN: 169 test-case executions
TESTS_PASSED: 169
TESTS_FAILED: 0
TESTS_SKIPPED: 0
ENVIRONMENTAL_FAILURES: 0
```

Commands and results:

```text
npx --prefix prototype tsx --test tests/dom-001-ticket-001.test.ts
  26 passed, 0 failed
npx --prefix prototype tsx --test tests/dom-001-ticket-004.test.ts
  10 passed, 0 failed
npx --prefix prototype tsx --test tests/dom-001-ticket-001.test.ts tests/dom-001-ticket-002.test.ts tests/dom-001-ticket-004.test.ts
  41 passed, 0 failed
npm --prefix prototype test
  92 passed, 0 failed
npm --prefix prototype run lint
  exit 0
```

The first three commands overlap test cases; the total is execution count, not
an assertion of 169 unique tests. No build was run during finalization because
the user requested no further commands after the collected evidence.

## Required summary

```text
Audit: docs/tickets/SPEC-DOM-001/DOM-001-TICKET-001-implementation-behavior-audit.md

Specialist:
IMPLEMENTATION_BEHAVIOR

Ticket: DOM-001-TICKET-001

Required behavioral dimensions: 10

Required tests: 16

Required tests missing: 3

Required behaviors total: 4

Direct behavior witnesses: 4

Proxy-only behaviors: 0

Untested state transitions: 0

Unproven concurrency contracts: 1

Missing architecture guards: 0

Tests run: 169

Tests passed: 169

Tests failed: 0

Regressions: 0

Concurrency:
NON_CONFORMANT

Stale behavior:
CONFORMANT

Idempotency:
CONFORMANT

Recovery:
NON_CONFORMANT

Authority consumption:
DEFINED_BUT_NOT_CONSUMABLE

Temporal authority:
NOT_APPLICABLE

Caller-as-authority bypasses: 0

Findings:
CRITICAL=0
MAJOR=1
MINOR=0
INFO=0

Domain audit complete:
YES

Specialist result:
SPECIALIST_BEHAVIOR_FINDINGS
```

```text
DOMAIN_AUDIT_COMPLETE: YES
SPECIALIST_RESULT_UNIQUE: YES
TICKET_STATE_MODIFIED: NO
PRODUCTION_CODE_MODIFIED: NO
TESTS_MODIFIED: NO
ADR_MODIFIED: NO
SPEC_MODIFIED: NO
GAP_MATRIX_MODIFIED: NO
IMPLEMENTATION_PLAN_MODIFIED: NO
OTHER_SPECIALIST_ARTIFACTS_MODIFIED: NO
IMA-MAJOR-002_PRESERVED_OPEN_INTEGRATED_ONLY: YES
```
