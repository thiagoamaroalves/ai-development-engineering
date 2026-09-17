# DOM-001-TICKET-013 — Canonical command-authority observation

## 1. Status

`STATUS: DONE`

```text
IMPLEMENTATION_UNIT: DOM-IMP-13
INITIAL_EXECUTION_STATUS: READY
CURRENT_EXECUTION_STATUS: DONE
IMPLEMENTATION_STATUS: IMPLEMENTED
PRODUCTIVE_CAPABILITY_STATUS: PROMOTED
CAPABILITY: CAP-DOM-COMMAND-AUTHORITY-OBSERVATION
UNBLOCKS: DOM-001-TICKET-005
T005_STATUS: DONE
```

This ticket is the producer introduced by the corrected decomposition. It is
not T005 and does not move command validation, failure selection, rejection
recording, or no-effect policy into the producer.

## 2. Source traceability

- accepted ADR authority: `ADR-0002`, revision 3, command preconditions and
  invalid-transition rejection;
- portfolio obligation: `O-011`;
- component SPEC: `SPEC-DOM-001` §13, `DOM-CMD-001`;
- Gap Matrix: `GAP-011`, `GAP-012` producer slice;
- Implementation Unit: `DOM-IMP-13`;
- consumer: `DOM-001-TICKET-005` / `DOM-IMP-05`;
- produced capability: `CAP-DOM-COMMAND-AUTHORITY-OBSERVATION`.

`DOM-IMP-03`/TICKET-003 is intentionally not a source trace for this ticket's
producer capability. It produces only the ADR authority observation used by
T002.

## 3. Objective

Provide the first productive implementation and runtime composition of
`CommandAuthorityReader`, returning a complete immutable command-authority
observation from the canonical DOM state required by `DOM-CMD-001`.

## 4. Architectural owner and boundaries

`SPEC-DOM-001` / DOM is the `CANONICAL_OWNER` of command precondition meaning,
canonical identity attachment, lifecycle eligibility, dependency closure,
verdict compatibility, freshness, and fail-closed command authority.

The producer boundary is a DOM-owned domain/application composition seam:

- it reuses canonical identity and pipeline state/provenance boundaries;
- it composes the canonical command-authority state into the existing reader
  contract;
- it does not become the ADR owner, pipeline identity owner, persistence owner,
  transport owner, or external-effect owner;
- it does not reinterpret a caller claim, projection, test fixture, or default
  as authority.

The `CommandAuthorityReader` remains the consumer-facing port. T005 remains
the command-policy consumer and must not duplicate or write the authority.

## 5. Produced contract

The productive implementation must satisfy the existing contract in
`src/domain/command.ts`:

```text
CommandAuthorityReader.observe(CanonicalIdentityReference)
  -> CommandAuthorityObservation | undefined
```

The returned observation must preserve:

| Field | Required meaning |
| --- | --- |
| `identity` | canonical `STAGE` identity, resolved and equal to the requested target |
| `aggregateRevision` | current canonical pipeline revision, not a persistence revision or caller value |
| `stage` | current canonical stage from the pipeline boundary |
| `preconditions.specStatus` | known/unknown command SPEC authority |
| `preconditions.revisionStatus` | eligible/ineligible command revision authority |
| `preconditions.dependencyClosure` | closed/open/invalid authoritative closure |
| `preconditions.verdict` | compatible/incompatible/missing authoritative verdict |
| `freshness.dependencyRevision` | dependency-closure freshness token |
| `freshness.verdictRevision` | verdict freshness token |

The producer must return no valid observation for an unknown, detached,
incomplete, stale, superseded, revoked, invalidated, or inconsistent source.
It must not invent a new failure family. Existing status values and the
consumer's canonical failure mapping remain authoritative.

## 6. Consumed boundaries

| Consumed boundary | Producer use | Authority owner |
| --- | --- | --- |
| canonical identity resolution | attach and verify the requested `STAGE` identity | DOM-IMP-01 |
| pipeline current-state/provenance boundary | obtain stage and aggregate revision without deriving state from a scalar or caller claim | DOM-IMP-04 |
| canonical command-authority state | obtain complete lifecycle, eligibility, dependency-closure, verdict, supersession/revocation/invalidation, and freshness facts | DOM under `O-011` |

The last row is the command-authority source represented by this producer. It
must be an explicit productive source with a runtime composition. A test-only
sequence, fake, mock, fixture, default, caller claim, or self-comparison is
not an implementation of this boundary.

## 7. Required behavior

1. Resolve only the requested canonical `STAGE` identity.
2. Read the current pipeline stage and aggregate revision from the canonical
   pipeline boundary.
3. Obtain all four command precondition statuses and both freshness tokens
   from the canonical command-authority source.
4. Return an immutable complete observation, or no observation when any
   mandatory authority fact is absent or inconsistent.
5. Preserve supersession, revocation, invalidation, and freshness changes as
   ineligible/incompatible/missing evidence according to the existing typed
   statuses; never convert them to compatibility.
6. Support two independent reads against the productive source so T005 can
   re-read immediately before commit.
7. Register/wire the productive implementation through a non-test runtime
   factory or composition root.
8. Leave command acceptance, rejection code selection, rejection recording,
   CAS, transport mapping, and external effects to their existing owners.

## 8. Does not implement

- `CommandPreconditionPolicy` or `CanonicalCommandBoundary` behavior owned by
  T005;
- ADR lifecycle or `CAP-DOM-ADR-AUTHORITY-READ-OBSERVATION` owned by T003;
- pipeline identity/reconstruction semantics owned by T001/T004;
- PLAT journal, persistence, CAS, recovery, or physical rejection recording;
- BACKEND, OPS, UI, EXEC, GIT, or external-effect behavior;
- authority defaults, fallback readers, caller-derived authority, or duplicate
  command rules inside T005.

## 9. Acceptance criteria

### T13-AC1 — Complete productive observation

A non-test runtime instance returns the complete canonical observation for a
known stage and preserves identity, stage, aggregate revision, all four
precondition statuses, and both freshness tokens exactly.

### T13-AC2 — Fail-closed source boundary

Unknown, detached, incomplete, stale, superseded, revoked, invalidated, or
inconsistent authority cannot produce an eligible/compatible observation and
does not fall back to caller input or a default.

### T13-AC3 — Freshness and independent reread

Two reads are made through the productive composition. A change in aggregate
revision/stage, dependency freshness, verdict freshness, or precondition state
is observable by the existing T005 drift check before commit.

### T13-AC4 — Runtime composition

The application composition/factory injects the productive reader into the
command boundary. A repository-wide read-only search finds the productive
implementation and its registration under `src`; test-only readers remain in
tests only.

### T13-AC5 — Boundary ownership

The implementation does not expose a second identity authority, ADR authority,
caller-authority path, default, fallback, transport mapping, or command-policy
implementation.

### Acceptance witness matrix

| NORMATIVE_BEHAVIOR | NORMATIVE_VERB | CONCRETE_OPERATION_COMMAND_OR_QUERY | STATE_OR_TRANSITION_AFFECTED | DIRECT_POSITIVE_TEST | DIRECT_NEGATIVE_OR_ISOLATION_TEST | EXPECTED_EVIDENCE_FILE | EVIDENCE_TYPE | ACCEPTANCE_OWNER | REQUIRED_PRODUCER_OR_CAPABILITY | AUTHORITY_STATUS | CONTRACT_STATUS | LOCAL_TESTABILITY | PRODUCTIVE_AVAILABILITY | CAPABILITY_SUMMARY_STATUS | DEPENDENCY_CLASS | WITNESS_EXECUTABLE_AT_LOCAL_CLOSURE |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Complete productive observation | returns complete immutable authority | `CommandAuthorityReader.observe(CanonicalIdentityReference)` | `CommandAuthorityObservation` identity, stage, revision, preconditions, freshness | `T13-AC1` complete known-stage observation | `T13-AC2` unknown/detached/wrong-kind/incomplete/mismatched source rejects | `docs/tickets/SPEC-DOM-001/evidence/TICKET-013/EV-DOM-IMP-13-AUTHORITY-READER-COMPLETE.md` | LOCAL_TEST_EVIDENCE | TICKET-013 | none — DOM-IMP-13 local productive composition | DEFINED | DEFINED | YES | YES | CONTRACT_PRODUCTIVELY_AVAILABLE | LOCAL_IMPLEMENTATION | YES |
| Fail-closed source boundary | rejects invalid authority | `CommandAuthorityReader.observe(CanonicalIdentityReference)` | eligible/compatible observation availability | `T13-AC1` valid canonical source remains observable | `T13-AC2`, `T13-AC2` status, lifecycle, and reread negatives reject without fallback | `docs/tickets/SPEC-DOM-001/evidence/TICKET-013/EV-DOM-IMP-13-BOUNDARY-NEGATIVE.md` | LOCAL_TEST_EVIDENCE | TICKET-013 | none — DOM-IMP-13 local source boundary | DEFINED | DEFINED | YES | YES | CONTRACT_PRODUCTIVELY_AVAILABLE | LOCAL_IMPLEMENTATION | YES |
| Freshness and independent reread | revalidates independently | productive composition plus T005 commit check | freshness tokens and pipeline basis before commit | `T13-AC3` independent reads expose unchanged/current basis | `T13-AC3` drift in stage, aggregate revision, dependency, verdict, or precondition rejects before effect | `docs/tickets/SPEC-DOM-001/evidence/TICKET-013/EV-DOM-IMP-13-TEMPORAL-REOBSERVATION.md` | LOCAL_TEST_EVIDENCE | TICKET-013 | none — DOM-IMP-13 productive reread composition | DEFINED | DEFINED | YES | YES | CONTRACT_PRODUCTIVELY_AVAILABLE | LOCAL_IMPLEMENTATION | YES |
| Runtime composition | composes productively | `createAdvancePipelineHandler` / application factory | command-boundary reader dependency | `T13-AC4` factory injects productive reader and executes T005 path | `T13-AC5` test/prototype/infrastructure/caller authority path is rejected or absent | `docs/tickets/SPEC-DOM-001/evidence/TICKET-013/EV-DOM-IMP-13-COMPOSITION.md` | LOCAL_TEST_EVIDENCE | TICKET-013 | none — DOM-IMP-13 runtime composition | DEFINED | DEFINED | YES | YES | CONTRACT_PRODUCTIVELY_AVAILABLE | LOCAL_IMPLEMENTATION | YES |
| Boundary ownership | preserves one authority | productive source/composition inspection and execution | authority ownership and command-policy boundary | `T13-AC4` productive composition consumes canonical source only | `T13-AC5` duplicate identity/ADR/policy/default/fallback/transport path absent | `docs/tickets/SPEC-DOM-001/evidence/TICKET-013/EV-DOM-IMP-13-BOUNDARY-NEGATIVE.md` | LOCAL_TEST_EVIDENCE | TICKET-013 | none — DOM-IMP-13 ownership boundary | DEFINED | DEFINED | YES | YES | CONTRACT_PRODUCTIVELY_AVAILABLE | LOCAL_IMPLEMENTATION | YES |

## 10. Required tests

- complete positive observation through the productive implementation;
- unknown identity and detached/wrong-kind target rejection;
- missing/incomplete source rejection;
- proposed, superseded, revoked, and invalidated revision behavior;
- open/invalid dependency closure and missing/incompatible verdict behavior;
- freshness-token change and same-status freshness drift;
- independent first-read/second-read behavior before commit;
- caller claims, defaults, test doubles, projections, and self-comparison do
  not establish authority;
- runtime factory/registration test using the productive implementation;
- affected T005 regression tests after the producer is composed.

## 11. Evidence requirements

The implementation must produce, at minimum:

- `docs/tickets/SPEC-DOM-001/evidence/TICKET-013/EV-DOM-IMP-13-AUTHORITY-READER-COMPLETE.md`;
- `docs/tickets/SPEC-DOM-001/evidence/TICKET-013/EV-DOM-IMP-13-COMPOSITION.md`;
- `docs/tickets/SPEC-DOM-001/evidence/TICKET-013/EV-DOM-IMP-13-TEMPORAL-REOBSERVATION.md`;
- `docs/tickets/SPEC-DOM-001/evidence/TICKET-013/EV-DOM-IMP-13-BOUNDARY-NEGATIVE.md`;
- focused producer test output and affected T005 suite output;
- strict source typecheck, lint/build as applicable;
- an independent producer implementation audit bound to the exact source
  baseline/commit;
- fresh T005 audit evidence after composition, not a copied producer result.

## 12. Capability promotion gate

The following records preserve the pre-promotion predicate:

```text
CAPABILITY = CAP-DOM-COMMAND-AUTHORITY-OBSERVATION
PREVIOUS_PRODUCTIVE_AVAILABILITY = NO
NEW_PRODUCTIVE_AVAILABILITY = YES only after all evidence below
PROMOTION_RECORD = PROMO-DOM-COMMAND-AUTHORITY-01
PROMOTION_CONSUMER = DOM-IMP-05 / TICKET-005
DEPENDENCY_CLASS = REQUIRED_FOR_LOCAL_EXECUTION
```

Promotion requires the productive implementation, runtime composition,
complete first-read/second-read evidence, stale/revoked/superseded/freshness
negative evidence, independent producer audit, and exact baseline/commit
identity. Local testability alone never promotes this capability.

Before that record existed, T005 was:

```text
STATUS = BLOCKED
T005_TICKET_LOCAL_CLOSURE = NO
T005_BLOCKED_BY = TICKET-013 implementation/audit/promotion evidence
IMA-MAJOR-004 = OPEN
```

The pre-promotion condition is superseded by the current promotion record:

```text
PROMOTION_RECORD = PROMO-DOM-COMMAND-AUTHORITY-01
PROMOTION_STATUS = PROMOTED
PRODUCTIVE_AVAILABILITY = YES
CAPABILITY_SUMMARY_STATUS = CONTRACT_PRODUCTIVELY_AVAILABLE
T005_STATUS = DONE
T005_BLOCKED_BY = NONE
T005_LOCAL_CLOSURE = YES; independent consumer audit and local finalization are complete
```

## 13. Dependencies and DAG

```text
DEPENDS_ON = DOM-001-TICKET-001, DOM-001-TICKET-004
PRODUCES = CAP-DOM-COMMAND-AUTHORITY-OBSERVATION
PRECEDES = DOM-001-TICKET-005
UNBLOCKS = DOM-001-TICKET-005 only after capability promotion
```

The T001/T004 edges are real canonical identity and pipeline-state
prerequisites. There is deliberately no T003 → T013 producer substitution and
no T003 → T005 command-authority edge.

## 14. Wave and execution state

```text
WAVE = 3
EXECUTION_MODE = SERIAL_REQUIRED_BEFORE_T005
INITIAL_DAG_STATE = READY after T001/T004
PRODUCER_TICKET_STATUS = READY
PRODUCTIVE_AVAILABILITY = YES after implementation, independent producer audit, and promotion
```

## 15. Handoff

After implementation and independent producer audit, the promotion record
`PROMO-DOM-COMMAND-AUTHORITY-01` is present. T005 has now independently
re-audited first-read/second-read, identity/revision/stage, preconditions,
freshness, stale/revoked/superseded behavior, no-effect semantics, and its own
acceptance evidence. T005 is locally finalized as `DONE`; T006–T008 are the
next prerequisite-eligible tickets.

## 16. Implementation execution record

```text
EXECUTION_DATE: 2026-09-15
INITIAL_STATUS: READY
FINAL_STATUS: DONE
IMPLEMENTATION_VERDICT: IMPLEMENTED
STRUCTURAL_SELF_CHECK: PASS
DESIGN_DEVIATIONS: NONE
```

The implementation preserves the approved decomposition: a narrow
`CanonicalCommandAuthorityStateReader` input port and source-facing lifecycle
contract in `src/domain/command.ts`, the concrete productive state source and
observation adapter in `src/application/command-authority.ts`, and the runtime
composition factory in `src/application/composition.ts`. T005 policy,
rejection semantics, CAS, and persistence ownership were not modified.

### Acceptance results

| Criterion | Result | Evidence |
|---|---|---|
| T13-AC1 | SATISFIED | `evidence/TICKET-013/EV-DOM-IMP-13-AUTHORITY-READER-COMPLETE.md` |
| T13-AC2 | SATISFIED | `evidence/TICKET-013/EV-DOM-IMP-13-BOUNDARY-NEGATIVE.md` |
| T13-AC3 | SATISFIED | `evidence/TICKET-013/EV-DOM-IMP-13-TEMPORAL-REOBSERVATION.md` |
| T13-AC4 | SATISFIED | `evidence/TICKET-013/EV-DOM-IMP-13-COMPOSITION.md` |
| T13-AC5 | SATISFIED | `evidence/TICKET-013/EV-DOM-IMP-13-BOUNDARY-NEGATIVE.md` |

### Completion evidence

```text
production_code = PRESENT
persistence_schema = NOT_APPLICABLE
migration_wiring = NOT_APPLICABLE
automated_tests = PRESENT
integration_evidence = PRESENT
architecture_guard = PRESENT
legacy_transition_evidence = NOT_APPLICABLE
cross_spec_evidence = NOT_APPLICABLE
conformance_evidence = PRESENT; independent producer audit, capability promotion, and fresh T005 consumer audit complete
```

### Tests and validation

```text
T013_FOCUSED = 12 passed, 0 failed, 0 skipped
T005_AFFECTED = 13 passed, 0 failed, 0 skipped
FULL_RELEVANT_SUITE = 102 passed, 0 failed, 0 skipped
STRICT_SOURCE_TYPECHECK = PASS
ALL_TEST_TYPECHECK = FAILED_ENVIRONMENTAL_BASELINE; repository lacks @types/node and contains pre-existing test typing errors; no T013 source errors
```

At implementation time, the independent producer audit and
`PROMO-DOM-COMMAND-AUTHORITY-01` were not yet claimed; that historical state is
superseded by the current promotion record. T005 is no longer blocked by
capability availability and remains `VALIDATION_REQUIRED` pending its
independent consumer audit.

### Local closure

```text
TICKET_LOCAL_CLOSURE = YES
```

## 17. Local Finalization

The finalization record below is the pre-promotion snapshot. Its downstream
handoff state is preserved as history; the current post-promotion state is
recorded in §18.

```text
LOCAL_FINALIZATION_DATE: 2026-09-16
FINALIZATION_VERDICT: TICKET_FINALIZED_LOCALLY
FINALIZATION_AUTHORITY: docs/tickets/SPEC-DOM-001/DOM-001-TICKET-013-implementation-audit-2026-09-15-reaudit-001.md
AUDIT_ROUND: RE_AUDIT
RE_AUDIT_NUMBER: 1
AUDIT_TARGET_HEAD: 6b31bcee1591c8b2e6499a434950664077b2be01
CURRENT_HEAD: 6b31bcee1591c8b2e6499a434950664077b2be01
TARGET_MISMATCHES: 0
AUDIT_BASIS_FINGERPRINT: C51BC87D09812F69C50852C55C475437D7905950CD7525CD7C9622C203A7F964
LOCAL_TICKET_DONE_ALLOWED: YES
TICKET_GATE: READY_FOR_DONE
LOCAL_TICKET_DONE_BLOCKERS: 0
LOCAL_CLOSURE_PERSISTED: YES
FINAL_TICKET_STATUS: DONE
OPEN_INTEGRATED_FINDINGS: 1
OPEN_INTEGRATED_FINDING_IDS: IMA-INFO-001
INTEGRATED_HANDOFFS_COMPLETE: YES
INTEGRATED_ONLY_AVAILABILITY_BLOCKING_LOCAL_DONE: 0
LOCAL_CLOSURE_FINDINGS_NOT_BLOCKING_DONE: 0
FINDING_SEVERITY_USED_AS_SOLE_COMPLETION_GATE: 0
OPEN_INTEGRATED_FINDING_LOST_FROM_TRACEABILITY: 0
SPECIALIST_CANNOT_SILENTLY_PROMOTE_INTEGRATED_DEPENDENCY_TO_LOCAL_BLOCKER: TRUE
CONSOLIDATOR_CANNOT_DERIVE_LOCAL_BLOCKING_FROM_SEVERITY_ALONE: TRUE
LOCAL_DONE_GATE_USES_LOCAL_CLOSURE_SCOPE: TRUE
INTEGRATED_PROOF_GATE_USES_INTEGRATED_DEPENDENCY_SCOPE: TRUE
AUDIT_ARTIFACT_IMMUTABILITY: REQUIRED
UPSTREAM_AUDIT_ARTIFACTS_MODIFIED_BY_FINALIZATION: 0
UPSTREAM_AUTHORITY_ARTIFACTS_MODIFIED_BY_FINALIZATION: 0
DAG_EDGES_RELEASED: 0
DEPENDENCY_SATISFIED_FOR: NONE; TICKET-005 remains blocked by capability promotion
TICKETS_NEWLY_UNBLOCKED: NONE
DOWNSTREAM_CHECKPOINTS_PRESERVED: YES
SPEC_FINAL_CONFORMANCE_STATE: NOT_FINAL_CONFORMANT_YET
PRODUCTIVE_AVAILABILITY_PROMOTED: NO
INTEGRATED_PROOF_AUTO_APPROVED: NO
SPEC_FINALIZED: NO
```

### Canonical downstream handoff — IMA-INFO-001

```text
FINDING_ID: IMA-INFO-001
STATUS: OPEN
FINDING_STATUS: OPEN
FINDING_CATEGORY: COMPLETION_EVIDENCE_DOWNSTREAM_HANDOFF
CAPABILITY: CAP-DOM-COMMAND-AUTHORITY-OBSERVATION
AUTHORITY_OWNER: SPEC-DOM-001 / DOM
PRODUCER: DOM-IMP-13 / DOM-001-TICKET-013
CONSUMER: DOM-IMP-05 / DOM-001-TICKET-005
CONTRACT: CommandAuthorityReader.observe -> complete CommandAuthorityObservation
AUTHORITY_STATUS: DEFINED
CONTRACT_STATUS: DEFINED
SEMANTIC_STATUS: CONTRACT_DEFINED_NONPRODUCTIVE
LOCAL_TESTABILITY: YES
PRODUCTIVE_AVAILABILITY: NO
CAPABILITY_SUMMARY_STATUS: CONTRACT_TESTABLE_LOCALLY
DEPENDENCY_CLASS: REQUIRED_FOR_INTEGRATED_PROOF
LOCAL_CLOSURE_BLOCKING: NO
LOCAL_ACCEPTANCE_REQUIRES_PRODUCTIVE_CAPABILITY: NO for T013 after it produces the capability
CLOSURE_OWNERSHIP: INTEGRATED_CHECKPOINT
DEPENDENCY_CLASS_RECLASSIFICATION_REQUIRED: NO
UPSTREAM_DEPENDENCY_CLASSIFICATION_PRESERVED: YES
BLOCKS_LOCAL_EXECUTION: NO
BLOCKS_LOCAL_CLOSURE: NO
BLOCKS_TICKET_DONE: NO
BLOCKS_INTEGRATED_PROOF: YES
BLOCKS_SPEC_FINAL_CONFORMANCE: YES
PRIMARY_ROUTE: IMPLEMENTATION_PLAN_REVALIDATION
DOWNSTREAM_CHECKPOINT: T005 productive-reader promotion and fresh T005 audit
DOWNSTREAM_OWNER: DOM-IMP-05 / T005 with capability-handoff owner
AVAILABILITY_EVIDENCE: T013 producer implementation and independent audit are complete; PROMO-DOM-COMMAND-AUTHORITY-01 and fresh T005 audit are not yet present
BLOCKING_EFFECT: T005 local execution and integrated SPEC proof remain blocked
SOURCE_AUDIT: docs/tickets/SPEC-DOM-001/DOM-001-TICKET-013-implementation-audit-2026-09-15-reaudit-001.md
SOURCE_TICKET: DOM-001-TICKET-013
SOURCE_FINDING_IDS: CONF-INFO-001
OPEN_INTEGRATED_FINDING_TRACEABILITY: COMPLETE
```

The handoff was open at finalization time. The promotion record now exists;
fresh T005 consumer validation remains open and is not replaced by producer
evidence.

## 18. Current post-promotion reconciliation

```text
CURRENT_RECONCILIATION_DATE: 2026-09-16
PROMOTION_RECORD: PROMO-DOM-COMMAND-AUTHORITY-01
PRODUCTIVE_AVAILABILITY: YES
CAPABILITY_SUMMARY_STATUS: CONTRACT_PRODUCTIVELY_AVAILABLE
T005_STATUS: DONE
T005_BLOCKED_BY: NONE
T005_LOCAL_CLOSURE: YES
T005_DOWNSTREAM_UNBLOCK: COMPLETE_AFTER_LOCAL_FINALIZATION
NEXT_WAVE_TICKETS: DOM-001-TICKET-006, DOM-001-TICKET-007, DOM-001-TICKET-008
FINAL_PROOF_OWNERSHIP_CHANGED: NO
```

T013 remains `DONE` and remains the sole productive producer. T005 is now
locally finalized; the T005 completion edge releases T006–T008 without changing
their initial `BLOCKED` state. T009–T012 remain blocked by their unresolved
predecessor chain.
