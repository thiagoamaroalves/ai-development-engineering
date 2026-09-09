# DOM-001-TICKET-004 — Ticket Conformance Audit

## 1. Audit mode and subject

```text
READ_ONLY
INDEPENDENT
ADVERSARIAL
TICKET_SCOPED
SPEC_FIRST
GAP_MATRIX_AWARE
PLAN_AWARE
DIFF_AWARE
EVIDENCE_REQUIRED
EXHAUSTIVE_WITHIN_DOMAIN
```

This artifact is the specialist `audit-ticket-conformance` result. It does
not modify production code, tests, the ticket, the ticket index, upstream
authority, or implementation state.

| Input | Value |
|---|---|
| `TICKET_ID` | `DOM-001-TICKET-004` |
| `TICKET_PATH` | `docs/tickets/SPEC-DOM-001/DOM-001-TICKET-004-pipeline-state-machines.md` |
| `TICKET_FOLDER` | `docs/tickets/SPEC-DOM-001/` |
| `TICKET_STATUS` | `VALIDATION_REQUIRED` |
| `IMPLEMENTATION_UNIT` | `DOM-IMP-04 — Pipeline and aggregate state machines` |
| `GAP_IDS` | `GAP-009`, `GAP-010` |
| `REQUIREMENT_IDS` | `DOM-PIPE-001`, `DOM-STATE-001` |
| `ACCEPTANCE_IDS` | `AC-DOM-009`, `AC-DOM-010`; contribution to `AC-DOM-052` |
| `ADR_PATHS` | `docs/adrs/ADR-0002-pipeline-state-machines-and-transitions.md` |
| `SPEC_PATH` | `docs/specs/SPEC-DOM-001-workflow-authority-and-governance.md` |
| `GAP_MATRIX_PATH` | `docs/specs/gap-matrices/SPEC-DOM-001-implementation-gap-matrix.md` |
| `IMPLEMENTATION_PLAN_PATH` | `docs/specs/implementation-plans/SPEC-DOM-001-implementation-plan.md` |
| `PLAN_AUDIT_PATH` | `docs/specs/implementation-plans/audits/SPEC-DOM-001-implementation-plan-audit.md` |
| `TICKET_AUDIT_PATH` | `docs/tickets/SPEC-DOM-001/implementation-ticket-audit.md` |
| `IMPLEMENTATION_BASELINE` | `a58ce959f9b34f3c1c83ed41c01b058d31bf3366`; productive pipeline files and ticket test absent at baseline |
| `CURRENT_HEAD` | `a58ce959f9b34f3c1c83ed41c01b058d31bf3366` |
| `AUDIT_TARGET_HEAD` | `a58ce959f9b34f3c1c83ed41c01b058d31bf3366` plus unchanged current working-tree implementation state |
| `CHANGED_FILES` | `src/domain/pipeline.ts`, `src/application/pipeline.ts`, `tests/dom-001-ticket-004.test.ts` |

The wider working tree contains pre-existing documentary and support changes
outside this ticket. They were not attributed to the TICKET-004 implementation
delta.

## 2. Authority and traceability

The effective authority chain is:

```text
accepted ADR-0002
  > approved portfolio obligations O-009/O-010
  > conformant SPEC-DOM-001 requirements DOM-PIPE-001/DOM-STATE-001
  > validated GAP-009/GAP-010
  > conformant DOM-IMP-04 implementation plan
  > conformant implementation-ticket audit
  > DOM-001-TICKET-004
  > repository implementation
```

| Traceability check | Result | Evidence |
|---|---|---|
| Ticket belongs to `SPEC-DOM-001` | `TRACEABILITY_CONFORMANT` | Ticket source traceability and component ownership sections |
| Implementation Unit exists | `TRACEABILITY_CONFORMANT` | Plan `DOM-IMP-04`; ticket §6 |
| Gaps resolve | `TRACEABILITY_CONFORMANT` | Gap Matrix `GAP-009`, `GAP-010`; ticket §5 |
| Requirements resolve | `TRACEABILITY_CONFORMANT` | SPEC `DOM-PIPE-001`, `DOM-STATE-001`; ticket §5 |
| Acceptance criteria resolve | `TRACEABILITY_CONFORMANT` | SPEC `AC-DOM-009`, `AC-DOM-010`; ticket §§5 and 16 |
| Upstream gates remain usable | `TRACEABILITY_CONFORMANT` | Portfolio/component/GAP/plan/ticket audits remain conformant |

The accepted ADR is `ADR-0002` revision 3. Its canonical order, separate
aggregate state machines, derived higher states, and rejection of invalid
transitions are directly applicable. No authority drift was found that would
invalidate this audit basis.

## 3. Execution eligibility

```text
EXECUTION_ELIGIBILITY_CONFIRMED
```

The ticket was authorized as a Wave 2 implementation unit after its only
predecessor, `DOM-001-TICKET-001`, reached `DONE`. The ticket had no remaining
blocker, was `READY` at execution start according to the finalized ticket
index, and followed the approved `SAFE_WITH_COORDINATION` wave. Its current
`VALIDATION_REQUIRED` status accurately reflects that implementation finished
and independent validation is pending.

## 4. Reconstructed canonical implementation contract

### Required local behavior

- Enforce the canonical pipeline order from accepted ADRs through publication.
- Reject any phase bypass without changing the current pipeline state.
- Keep execution, SPEC, stage, activity, audit cycle, wave, ticket, migration,
  and publication machines distinct.
- Supply validated, read-only inputs for those independent machines.
- Derive higher/read-only state only through the approved derivation boundary;
  projections and transports must not become a second state authority.
- Preserve revision/CAS semantics at the repository boundary without silently
  accepting stale state or last-write-wins behavior.

### Integration behavior

- Application handlers may coordinate loading, domain transition, repository
  CAS, state reading, and outcome mapping.
- Persistence is represented by narrow repository/state-reader ports; physical
  schema, storage, and recovery remain outside this ticket.
- Consumer state mappings remain read-only and cannot perform canonical
  transitions.

### Does not implement

Scheduler capacity or leases, Git integration, backend transport, OPS/UI
projection, foreign operational states, ticket lifecycle, publication
lifecycle, audit-cycle lifecycle, migration lifecycle, or a global generic
state-machine framework.

### Expected repository impact

The approved design authorizes the focused domain pipeline/state model, two
application handlers, and ticket-scoped tests. It explicitly marks identity,
lineage, the prototype, ADRs, SPECs, Gap Matrix, plan, and tickets as not to be
modified.

### Gap obligations and requirements

| Gap | Requirement | Obligation | Validated delta |
|---|---|---|---|
| `GAP-009` | `DOM-PIPE-001` | `O-009` | Prototype/mock ordering existed; productive bypass enforcement was absent |
| `GAP-010` | `DOM-STATE-001` | `O-010` | Mock state fields existed; productive independent machines and derivation boundary were absent |

### Acceptance criteria

| ID | Canonical criterion |
|---|---|
| `AC-DOM-009` | A scenario attempting to skip a pipeline phase is rejected |
| `AC-DOM-010` | Combining aggregate machines or fabricating a higher state is rejected |
| Local provability | `LOCAL_PROVABILITY = YES` after TICKET-001 completion |

### Completion evidence required

Executable ordered pipeline/state authority, negative bypass and implicit
combined-state tests, production code, automated tests, integration evidence,
and conformance evidence. Legacy transition evidence is not applicable.

## 5. Repository scope audit

The baseline commit does not contain the three ticket implementation files.
The current target state contains exactly the approved implementation/test
surface for this ticket.

| File | Classification | Evidence |
|---|---|---|
| `src/domain/pipeline.ts` | `DIRECT_TICKET_IMPLEMENTATION` | Pipeline stages/order, revision, state-input boundary, aggregate, derivation policy, repository ports |
| `src/application/pipeline.ts` | `DIRECT_TICKET_IMPLEMENTATION` | Advance and query orchestration handlers |
| `tests/dom-001-ticket-004.test.ts` | `REQUIRED_TEST_CHANGE` | Ordered transition, rehydration, separation, projection, CAS, and regression tests |

```text
CHANGED_FILES_TOTAL = 3
IN_SCOPE_FILES = 3
UNRELATED_FILES = 0
SCOPE_EXPANSION_FILES = 0
FOREIGN_SCOPE_FILES = 0
```

No implementation change was found in identity, lineage, prototype,
infrastructure, or downstream ticket domains.

## 6. Required behavior coverage

| Required behavior | Evidence | Result |
|---|---|---|
| Canonical ordered stage vocabulary | `src/domain/pipeline.ts:1-14, 106-115` | `IMPLEMENTED` |
| Only immediate successor is accepted | `src/domain/pipeline.ts:321-332`; test `tests/dom-001-ticket-004.test.ts:66-79` | `IMPLEMENTED` |
| Later-stage bypass is rejected without mutation | `WorkflowPipeline.advanceTo`; current stage/revision remain unchanged in focused test | `IMPLEMENTED` |
| Nine aggregate machines remain separately named and tagged | `PIPELINE_MACHINES` and `EXPECTED_MACHINES` at `pipeline.ts:16-26, 181-191` | `IMPLEMENTED` |
| State inputs are copied and immutable | `PipelineMachineState` and `PipelineStateInputs` at `pipeline.ts:147-243`; focused separation test | `IMPLEMENTED` |
| Incompatible machine ownership is rejected | `PipelineStateInputs.create` and test at `tests/dom-001-ticket-004.test.ts:131-144` | `IMPLEMENTED` |
| Higher state is derived only through an approved rule | `PipelineStateDerivationPolicy.derive` at `pipeline.ts:264-267` only copies values; `DerivedWorkflowState` can be constructed directly | `PARTIAL` |
| Projections/readers cannot perform transitions | `PipelineStateReader` exposes only `read`; query handler does not persist | `IMPLEMENTED` |
| Stale revision is rejected without last-write-wins | repository CAS contract and focused handler test at `tests/dom-001-ticket-004.test.ts:146-168` | `IMPLEMENTED` |
| No physical persistence or foreign operational state is introduced | No adapter or infrastructure import in ticket files; architecture guard test | `IMPLEMENTED` |

## 7. Gap closure

| Gap | Validated Delta | Implementation Evidence | Residual | Result |
|---|---|---|---|---|
| `GAP-009` | Productive enforcement of canonical order and no bypass | `PIPELINE_STAGES`, `PipelineOrder.isImmediateSuccessor`, `WorkflowPipeline.advanceTo`, focused bypass/no-mutation test | No residual bypass path found for pipeline advancement | `GAP_CLOSED` |
| `GAP-010` | Productive independent state inputs and controlled derivation without a second authority | Nine machine-specific inputs, runtime tag validation, immutable snapshots, read-only query handler, and derivation policy | Public `DerivedWorkflowState` construction accepts arbitrary stage and arbitrary state list; higher state can be fabricated outside the policy | `GAP_PARTIALLY_CLOSED` |

## 8. Requirement conformance

| Requirement | Required behavior | Evidence | Result |
|---|---|---|---|
| `DOM-PIPE-001` | Canonical pipeline order; no phase bypass or later-stage completion by a consumer | Closed stage vocabulary and immediate-successor aggregate decision; six focused tests pass | `CONFORMANT` |
| `DOM-STATE-001` | Separate state machines; higher states derived where possible; no combined or fabricated canonical transition | Separate input boundary is present, but public derived-result construction bypasses controlled derivation | `PARTIAL` |

## 9. Acceptance criteria

| Criterion | Objective evidence | Result |
|---|---|---|
| `AC-DOM-009` — prohibited pipeline bypass is rejected | `advanceTo('SPEC_AUDIT_REMEDIATION')` from `ACCEPTED_ADRS` throws `INVALID_PIPELINE_TRANSITION` and preserves stage/revision | `SATISFIED` |
| `AC-DOM-010` — combining machines/fabricating higher state is rejected | Wrong machine tags and missing state through the handler are rejected, but direct `new DerivedWorkflowState(...)` accepts a fabricated higher stage with one machine state | `PARTIALLY_SATISFIED` |
| Local provability after TICKET-001 | TICKET-001 is `DONE`; all local code/tests are available | `SATISFIED` |

## 10. Acceptance obligations

| Acceptance | Implementation evidence | Supporting test evidence | Result |
|---|---|---|---|
| `AC-DOM-009` | Aggregate owns canonical successor decision | Focused ordered-stage/bypass test | `DIRECTLY_CONFORMANT` |
| `AC-DOM-010` | Independent machine input boundary is present; derived-result boundary remains bypassable | Focused separation/immutability test does not exercise the exported constructor bypass | `PARTIAL` |
| `AC-DOM-052` contribution | Ordered state authority and negative evidence are available for final conformance aggregation; final ownership remains TICKET-012 | Focused suite, full productive regression, typecheck/lint/build | `CROSS_SPEC_CONFORMANT` |

## 11. Completion evidence

| Evidence item | Status | Verification |
|---|---|---|
| Production code | `PRESENT_AND_VERIFIED` | `src/domain/pipeline.ts`, `src/application/pipeline.ts` inspected against approved design |
| Automated tests | `PRESENT_AND_VERIFIED` | Focused suite: 6/6 passed; productive suite: 27/27 passed |
| Integration evidence | `PRESENT_BUT_WEAK` | Application handlers integrate domain and narrow in-memory ports; physical persistence is explicitly outside ticket scope |
| Legacy transition evidence | `NOT_APPLICABLE` | Ticket declares `NEW_CANONICAL_PATH` with no legacy writes |
| Conformance evidence | `PRESENT_BUT_WEAK` | This specialist audit provides evidence, but `GAP-010` remains partial |

```text
COMPLETION_EVIDENCE_REQUIRED = 5
COMPLETION_EVIDENCE_VERIFIED = 2
COMPLETION_EVIDENCE_MISSING = 0
```

## 12. Scope creep

```text
SCOPE_CREEP_RESULT: NO_UNAUTHORIZED_SCOPE
```

The implementation adds only the approved productive pipeline/state model,
application coordination, and tests. It does not implement scheduler, Git,
transport, UI/OPS, or foreign operational lifecycles. The in-memory repository
in the test is required test support, not a production persistence claim.

## 13. Status accuracy

```text
STATUS_RESULT: STATUS_CORRECT
```

The ticket is `VALIDATION_REQUIRED`, its implementation evidence records the
READY → IN_PROGRESS → IMPLEMENTED → VALIDATION_REQUIRED transition, and
independent validation is the current required gate. This audit does not alter
status.

## 14. Findings

### CONF-MAJOR-001

| Field | Value |
|---|---|
| Severity | `MAJOR` |
| Ticket | `DOM-001-TICKET-004` |
| Gap IDs | `GAP-010` |
| Requirement IDs | `DOM-STATE-001` |
| Acceptance IDs | `AC-DOM-010` |
| Normative authority | Accepted `ADR-0002`, Decisão; SPEC-DOM-001 `DOM-STATE-001`; ticket §§9, 15, 16, 18, 19 |
| Repository evidence | `src/domain/pipeline.ts:245-267`: `DerivedWorkflowState` has a public constructor accepting arbitrary `PipelineStage` and arbitrary `PipelineMachineState[]`; `PipelineStateDerivationPolicy.derive` delegates directly to it. A direct runtime probe constructed `MAIN_UPDATE_AND_PUBLICATION` with only one machine state and succeeded. |
| Problem | A caller can fabricate a higher derived state outside the approved derivation policy, bypassing the requirement that aggregate machines remain separate and that higher states be controlled derivations. The current tests cover the handler path but not this exported construction path. |
| Impact | `GAP-010` and `DOM-STATE-001` are only partially closed; `AC-DOM-010` is not fully satisfied. The ticket is not conformant within this specialist domain. |
| Minimum correction required | Close the result construction boundary so only validated derivation can create `DerivedWorkflowState` (for example, a private constructor/factory seam owned by the derivation policy), and add a negative test proving arbitrary combined/fabricated state cannot be created. Do not broaden this into a new architecture or new state semantics. |
| Systemic pattern | `NO` — one localized exported construction bypass |

No CRITICAL, MINOR, or INFO findings were identified. The major finding is
not remediated by this read-only audit.

## 15. Specialist completion

All applicable phases ran: subject/traceability, execution eligibility, scope
reconstruction, repository scope, behavior coverage, gap closure, requirement
conformance, acceptance criteria, acceptance obligations, completion evidence,
scope creep, status accuracy, and finding classification.

```text
DOMAIN_AUDIT_COMPLETE = YES
SPECIALIST_CONFORMANCE_RESULT = SPECIALIST_CONFORMANCE_FINDINGS
```

