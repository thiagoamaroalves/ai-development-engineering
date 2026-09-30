---
name: implement-ready-tickets
description: >
  Execute implementation tickets that passed independent ticket audit and have
  an approved implementation design. Implement only currently READY tickets,
  preserving accepted authority, validated Gap Matrix scope, conformant
  Implementation Plan ordering, ticket-local closure, ownership, blockers,
  DDD responsibility placement, SOLID boundaries, Clean Code constraints,
  dependency direction, aggregate and invariant placement, tests, completion
  gates, and status transitions. Use the approved Implementation Design as the
  structural blueprint and require a structural self-check before marking a
  ticket IMPLEMENTED. Do not implement BLOCKED tickets, bypass dependencies,
  redesign architecture, collapse approved responsibilities into god
  components, create anemic domain behavior, leak infrastructure into domain
  semantics, modify upstream planning artifacts, or redefine ticket scope.
---

# Implement Ready Tickets

## Purpose

Execute implementation work only after the complete planning chain is valid:

```
Accepted ADR authority
     + Canonical validated specification
     + Validated / remediated Gap Matrix
     + Conformant Implementation Plan
     + Conformant Plan Audit
     + Conformant Implementation Tickets
     + Independent Ticket Audit
     │
     ▼
READY_FOR_IMPLEMENTATION → THIS SKILL → implementation and validation
```

Read `skills/_shared/workflow-execution-topology-contract.md` before any
mutation. This repository's authorized ticket implementation runs in the
contracted guarded main working tree; do not invent worktree allocation or
merge policy.

The skill MUST validate the baseline, load the entire ticket set and index,
select only executable READY tickets, preserve ownership/dependencies/waves,
implement the frozen ticket scope and required tests, satisfy acceptance and
completion evidence, update status and derived index state, recalculate
blockers, and stop when no further safe execution is available.

The skill MUST NOT implement BLOCKED tickets, bypass `DEPENDS_ON`, remove
blockers for throughput, implement foreign lifecycle ownership, modify ADRs,
specifications, Gap Matrix, Implementation Plan, Plan Audit, or ticket scope,
invent behavior, create speculative work, mark `DONE` without validation, or
perform destructive transition before replacement proof.

## Preconditions

The latest independent ticket audit must report exactly:

```
Ticket audit verdict:
IMPLEMENTATION_TICKETS_CONFORMANT

Implementation gate:
READY_FOR_IMPLEMENTATION
```

Otherwise return:

```
IMPLEMENTATION_BLOCKED
reason = TICKET_SET_NOT_CONFORMANT
```

If the audit is stale or absent, return `IMPLEMENTATION_BLOCKED` with
`reason = TICKET_AUDIT_REQUIRED`. If authority is not frozen, return
`IMPLEMENTATION_BLOCKED` with `reason = ARCHITECTURE_OR_SPEC_NOT_FROZEN`. If no
READY ticket exists, return `IMPLEMENTATION_NOOP` with
`reason = NO_READY_TICKETS`.

## Required Inputs

Identify or receive accepted ADRs, canonical specification, validated Gap
Matrix, conformant Implementation Plan and Plan Audit, ticket folder and
index, latest conformant Ticket Audit, repository root, implementation
baseline, current HEAD, and optional user-selected READY ticket IDs.

Explicit ticket selection limits execution to those IDs if they are READY. A
request for all available work permits all currently READY tickets that safely
share the earliest eligible wave.

## Source-of-Truth Precedence

```
Accepted ADR authority
    ↓ Canonical validated specification
    ↓ Explicit cross-spec ownership contracts
    ↓ Validated Gap Matrix
    ↓ Conformant Implementation Plan
    ↓ Conformant Plan Audit
    ↓ Conformant Ticket Set
    ↓ Conformant Ticket Audit
    ↓ Current repository implementation
    ↓ Tests
```

Tickets define execution scope but never override upstream authority. Repository
code is the implementation subject; tests are implementation deliverables and
evidence.

## Execution Mode

Use:

```
TICKET_DRIVEN
READY_ONLY
DEPENDENCY_AWARE
BLOCKER_AWARE
WAVE_AWARE
OWNERSHIP_PRESERVING
TEST_REQUIRED
COMPLETION_GATE_REQUIRED
NO_SCOPE_EXPANSION
NO_ARCHITECTURE_REDESIGN
```

## Phase 1 — Baseline Validation

Capture:

```
TICKET_AUDIT_HEAD
IMPLEMENTATION_BASELINE
CURRENT_HEAD
AUTHORITY_CUTOFF
```

Classify drift exactly as:

```
NO_RELEVANT_DRIFT
NON_SEMANTIC_DOCUMENTARY_DRIFT
LOCALIZED_IMPLEMENTATION_DRIFT
MATERIAL_BASELINE_DRIFT
```

Continue for the first two. For localized drift, re-evaluate affected READY
ticket assumptions. If status, blockers, scope, or evidence may be stale, stop
with `IMPLEMENTATION_BLOCKED`, `reason = TICKET_REAUDIT_REQUIRED`. For material
drift stop with `IMPLEMENTATION_BLOCKED`,
`reason = UPSTREAM_PLANNING_REVALIDATION_REQUIRED`.

## Phase 2 — Eligibility Resolution

Read every ticket and the index. Capture:

```
TICKET_ID STATUS DEPENDS_ON BLOCKED_BY WAVE PARALLELIZATION
IMPLEMENTATION_UNIT GAPS REQUIREMENTS ACCEPTANCE CROSS_SPEC_DEPENDENCIES
```

A ticket is executable only when:

```
STATUS = READY
BLOCKED_BY = NONE
mandatory internal prerequisites are satisfied
blocking cross-spec prerequisites are available
the wave is eligible
no destructive-transition gate is unresolved
no baseline drift or hidden dependency invalidates it
```

Additionally recalculate the shared `EXECUTION_READY` predicate from upstream
authority and current capability records. For every capability classified
`REQUIRED_FOR_LOCAL_EXECUTION` or `REQUIRED_FOR_LOCAL_CLOSURE`, require
`PRODUCTIVE_AVAILABILITY = YES` and concrete producer/integration evidence at
this execution point. Local fixtures, mocks,
fakes, contract tests, and in-memory repositories do not satisfy this check.
If the ticket claims READY while this predicate is false, stop with
`IMPLEMENTATION_BLOCKED`, `reason = TICKET_REAUDIT_REQUIRED` and do not promote
or execute it.

Classify otherwise as `NOT_EXECUTABLE_STATUS`, `NOT_EXECUTABLE_BLOCKED`,
`NOT_EXECUTABLE_DEPENDENCY`, `NOT_EXECUTABLE_WAVE`,
`NOT_EXECUTABLE_EXTERNAL_PREREQUISITE`, or `NOT_EXECUTABLE_BASELINE`. Never
convert a non-executable ticket to READY.

## Phase 3 — Execution Set

With explicit IDs use only selected READY tickets. Without explicit IDs choose
the maximal safe set in the earliest eligible wave.

* `SAFE`: run concurrently only when change surfaces do not conflict.
* `SAFE_WITH_COORDINATION`: coordinate shared contracts/files without violating
  ticket boundaries.
* `SERIAL_REQUIRED`: execute alone relative to conflicting tickets.

If uncertain, execute serially. Do not skip an earlier eligible wave.

## Phase 4 — Pre-Implementation Ticket and Design Recheck

For each ticket in the execution set verify:

- exact Spec reference;
- exact Gap Matrix reference;
- exact Implementation Plan reference;
- exact Plan Audit reference;
- exact Implementation Unit;
- exact Gap/Requirement/Acceptance coverage;
- ownership;
- Does Not Implement;
- acceptance criteria;
- required tests;
- completion evidence;
- independent capability dimensions, dependency classes, and availability
  evidence/promotion records;
- `ACCEPTANCE_WITNESS_MATRIX`, with every local witness executable now;
- completion gate;
- Implementation Design exists;
- Implementation Design verdict is `IMPLEMENTATION_DESIGN_READY`;
- Implementation Design gate is `READY_FOR_IMPLEMENTATION`;
- the design ticket identity and ticket-set audit target/basis match the current
  selected ticket and current conformant ticket-set audit.

The design skill owns this approval gate. Do not require an independent design
audit or a pre-existing Git commit. A design created in the current working
tree is valid evidence; the implementation checkpoint must include that exact
 design artifact in its allowlist before committing it.

Then load the complete Implementation Design and capture:

```text
IMPLEMENTATION_RESPONSIBILITY
EXISTING_COMPONENTS_TO_REUSE
EXISTING_COMPONENTS_TO_EXTEND
PROPOSED_COMPONENTS
RESPONSIBILITY_DECOMPOSITION
INVARIANT_PLACEMENT
PERSISTENCE_DESIGN
LIFECYCLE_DESIGN
CROSS_SPEC_INTEGRATION
TEST_DESIGN
STRUCTURAL_RISKS
IMPLEMENTATION_SEQUENCE
EXPECTED_FILES
```

The implementation agent MUST understand the proposed responsibility
boundaries before modifying production code. The Implementation Design is
implementation guidance subordinate to upstream authority. Do not silently
ignore the design and independently redesign the ticket during implementation.

If repository investigation shows that part of the design is locally
inaccurate but the correction preserves the same responsibilities, upstream
behavior, ownership, architecture, and ticket scope, and does not materially
change component boundaries, the implementing agent may make a localized
implementation adjustment. Record every such adjustment as:

```text
DESIGN_DEVIATION:
    expected:
    actual:
    reason:
```

If implementation requires a material change to any of the following, stop:

- responsibility decomposition;
- component boundaries;
- lifecycle authority;
- persistence authority;
- invariant placement;
- cross-spec integration boundary;
- recovery model;
- major interaction flow.

Return:

```text
TICKET_EXECUTION_BLOCKED
reason = IMPLEMENTATION_DESIGN_REVALIDATION_REQUIRED
```

Do not redesign the ticket while coding or repair planning artifacts during
implementation.

## Approved design is the structural blueprint

Before changing production code, load the complete design artifact and preserve:

~~~text
IMPLEMENTATION_RESPONSIBILITY
REPOSITORY_ARCHITECTURE_CONTEXT
EXISTING_COMPONENTS
DOMAIN_MODEL_ASSESSMENT
AGGREGATE_BOUNDARIES
RESPONSIBILITY_DECOMPOSITION
PROPOSED_COMPONENTS
SOLID_ASSESSMENT
DEPENDENCY_DIRECTION
INVARIANT_PLACEMENT
PERSISTENCE_DESIGN
LIFECYCLE_DESIGN
CROSS_SPEC_INTEGRATION
FAILURE_RECOVERY_FLOW
CLEAN_CODE_ASSESSMENT
TEST_DESIGN
STRUCTURAL_RISKS
IMPLEMENTATION_SEQUENCE
EXPECTED_FILES
~~~

The design is subordinate to ADR, portfolio, SPEC, Gap Matrix, Plan, ticket,
and ticket-audit authority. It governs code structure only within frozen ticket
semantics.

### Design-deviation protocol

Record every departure as:

~~~text
DESIGN_DEVIATION:
  classification:
  expected:
  actual:
  reason:
~~~

Only these classifications may continue automatically:

~~~text
LOCAL_IMPLEMENTATION_DETAIL
REPOSITORY_REALITY_ADJUSTMENT
~~~

The following require stopping and design revalidation:

~~~text
COMPONENT_BOUNDARY_CHANGE
DOMAIN_MODEL_CHANGE
DEPENDENCY_DIRECTION_CHANGE
INVARIANT_PLACEMENT_CHANGE
PERSISTENCE_BOUNDARY_CHANGE
LIFECYCLE_AUTHORITY_CHANGE
CROSS_SPEC_BOUNDARY_CHANGE
RECOVERY_MODEL_CHANGE
~~~

Return:

~~~text
TICKET_EXECUTION_BLOCKED
reason = IMPLEMENTATION_DESIGN_REVALIDATION_REQUIRED
~~~

Do not silently replace the approved design with an improvised structure.

## DDD, SOLID, and Clean Code implementation guardrails

Preserve the approved interpretation:

~~~text
Domain objects and policies decide
Application services orchestrate
Repositories persist
Adapters translate
~~~

Do not introduce a new architecture merely to apply a textbook pattern.

### Domain and aggregate boundaries

For every designed Aggregate, preserve:

~~~text
AGGREGATE_ROOT
INVARIANTS_PROTECTED
MUTATION_ENTRY_POINTS
CONSISTENCY_BOUNDARY
TRANSACTION_BOUNDARY
DURABLE_PROTECTION
~~~

The Aggregate Root remains the mutation authority. Do not expose generic
setters, repository mutations, adapters, serializers, or application paths
that bypass the designed lifecycle.

For each designed invariant compare designed and actual enforcement:

| Invariant | Designed Enforcement | Actual Enforcement | Durable Enforcement | Test |
| --- | --- | --- | --- | --- |

Classify each as PRESERVED, LOCALLY_ADAPTED, MOVED_WITHOUT_JUSTIFICATION,
BYPASSED, or MISSING. Before IMPLEMENTED require:

~~~text
AGGREGATE_BOUNDARY_VIOLATIONS = 0
DOMAIN_INVARIANT_BYPASSES = 0
UNENFORCED_INVARIANTS = 0
INVARIANT_PLACEMENT_DEVIATIONS = 0
ANEMIC_DOMAIN_MODEL_INTRODUCED = NO
~~~

Domain behavior must not become data-only entities plus procedural service
logic. Application Services must not acquire lifecycle rules, invariant trees,
durable persistence semantics, mapping, recovery, and integration as one
undifferentiated responsibility. Repositories must not become business
decision authorities.

### Cross-spec and infrastructure boundaries

For every designed foreign boundary preserve:

~~~text
FOREIGN_OWNER
FOREIGN_CONTRACT
LOCAL_MAPPING
IDENTITY_PRESERVATION
FAILURE_SEMANTICS
FORBIDDEN_LOCAL_OWNERSHIP
~~~

Do not duplicate foreign state machines, identities, or canonical outcomes.
When a required foreign capability is unavailable, block the ticket with an
explicit external prerequisite instead of implementing the capability locally.

Compare actual references against the approved dependency direction. Suspicious
leaks include domain code importing ORM, filesystem, HTTP, SDK, serializer, or
concrete infrastructure repository types. Do not add an abstraction merely to
zero a metric when no approved architectural boundary exists.

Before IMPLEMENTED require:

~~~text
DEPENDENCY_DIRECTION_VIOLATIONS = 0
INFRASTRUCTURE_LEAKAGE_POINTS = 0
FOREIGN_AUTHORITY_DUPLICATION = 0
~~~

### SOLID and Clean Code

Re-evaluate material implementation violations:

~~~text
SRP_VIOLATIONS
OCP_VIOLATIONS
LSP_VIOLATIONS
ISP_VIOLATIONS
DIP_VIOLATIONS
UNJUSTIFIED_SOLID_VIOLATIONS
GOD_COMPONENT_INTRODUCED
FAT_APPLICATION_SERVICE_INTRODUCED
FAT_INTERFACE_INTRODUCED
GENERIC_SERVICE_BUCKETS
GENERIC_UTIL_BUCKETS
DOMAIN_RULE_DUPLICATION
DOMAIN_PRIMITIVE_OBSESSION
PREMATURE_ABSTRACTIONS
OVERENGINEERING_FINDINGS
~~~

Do not introduce speculative Strategy, Factory, Provider, Plugin, event-bus, or
framework layers. Use precise domain names, cohesive methods, explicit side
effects, explicit mutation boundaries, and the repository's existing language.
Do not DRY distinct concepts merely because their code looks similar.

## Structural self-check

Before transitioning IN_PROGRESS to IMPLEMENTED, run a deterministic
IMPLEMENTATION_STRUCTURAL_SELF_CHECK. It is not an independent audit.

Require:

~~~text
DOMAIN_MODEL_CONFORMANT = YES
AGGREGATE_BOUNDARIES_CONFORMANT = YES
INVARIANT_PLACEMENT_CONFORMANT = YES
COMPONENT_BOUNDARIES_CONFORMANT = YES
SOLID_CONFORMANT = YES
DEPENDENCY_DIRECTION_CONFORMANT = YES
CLEAN_CODE_STRUCTURALLY_ACCEPTABLE = YES
CROSS_SPEC_BOUNDARY_CONFORMANT = YES
CRITICAL_INVARIANTS_WITH_TESTS = ALL
REQUIRED_TEST_SURFACES_IMPLEMENTED = YES
TESTABILITY_REGRESSIONS = 0
~~~

Also require:

~~~text
UNJUSTIFIED_COMPONENT_COLLAPSES = 0
UNPLANNED_STRUCTURAL_COMPONENTS = 0
MISSING_REQUIRED_COMPONENTS = 0
UNJUSTIFIED_SOLID_VIOLATIONS = 0
DEPENDENCY_DIRECTION_VIOLATIONS = 0
INFRASTRUCTURE_LEAKAGE_POINTS = 0
DOMAIN_RULE_DUPLICATION = 0
~~~

Return:

~~~text
IMPLEMENTATION_STRUCTURAL_SELF_CHECK = PASS
~~~

only when all required checks pass. Otherwise return:

~~~text
IMPLEMENTATION_STRUCTURAL_SELF_CHECK = FAIL
~~~

Do not transition to IMPLEMENTED on FAIL. Passing this self-check does not
mean IMPLEMENTATION_CONFORMANT or DONE; independent validation remains the
next gate.

## Phase 5 — Repository Investigation

Confirm cited code, reusable implementation, contradictory paths, foreign
capabilities, and baseline tests still exist as described. Search semantically.
If evidence materially contradicts a ticket, stop it with:

```
TICKET_EXECUTION_BLOCKED
reason = IMPLEMENTATION_BASELINE_CONTRADICTION
```

Require audit or replanning as appropriate.

## Phase 6 — Frozen Implementation Boundary

Implement only behavior required by:

```
Ticket + Conformant Implementation Unit + Validated Gap Matrix + Canonical Spec/ADRs
```

Do not add unrelated refactors, APIs, DTOs, lifecycle states, authority,
persistence ownership, convenience features, or speculative abstractions.
Refactor only when directly required and behavior/ownership remain unchanged.

## Phase 7 — Ownership Guard

Implement behavior owned by the current ticket/spec. Consume
`PREEXISTING_FOREIGN_CAPABILITY`. Integrate `CROSS_SPEC_DEPENDENCY` according to
its frozen contract. If local implementation would move foreign lifecycle
authority, stop with:

```
TICKET_EXECUTION_BLOCKED
reason = OWNERSHIP_VIOLATION_REQUIRED
```

## Phase 8 — Production Implementation

Implement the ticket according to:

```text
Ticket Required Behavior
        +
Approved Implementation Design
```

Use the Implementation Design as the default structural blueprint for:

- responsibility boundaries;
- component decomposition;
- invariant placement;
- persistence boundaries;
- lifecycle authority;
- integration boundaries;
- recovery structure;
- test surfaces.

Preserve the proposed decomposition unless repository evidence requires a
localized non-material adjustment.

Do not collapse multiple designed responsibilities into one implementation
artifact merely for convenience. In particular:

```text
one ticket != one file
one ticket != one class
one ticket != one service
```

If the Implementation Design defines distinct cohesive responsibilities,
preserve those boundaries during implementation.

Do not introduce:

- unrelated refactors;
- new architecture;
- speculative abstractions;
- new lifecycle ownership;
- new persistence authority;
- foreign capability duplication;
- convenience features;
- scope expansion.

If implementing the approved design proves materially impractical, stop and
return:

```text
TICKET_EXECUTION_BLOCKED
reason = IMPLEMENTATION_DESIGN_REVALIDATION_REQUIRED
```

Do not replace the approved design with an improvised implementation structure.

## Phase 9 — Tests With the Ticket

Implement required automated tests with the behavior-owning ticket. Cover every
applicable category: identity, immutability, authority, concurrency, stale
rejection, idempotency, atomicity, durability, recovery, migration,
compatibility, negative behavior, cross-spec integration, and architecture
guards. A final conformance ticket may aggregate evidence but never replaces
ticket-level correctness tests.

## Phase 10 — Acceptance Verification

Evaluate each criterion as exactly one of:

```
SATISFIED
NOT_SATISFIED
BLOCKED_BY_EXTERNAL_PREREQUISITE
NOT_APPLICABLE_BY_VALIDATED_SCOPE
```

`NOT_APPLICABLE` requires upstream authority. Never rewrite a criterion to fit
implementation. Any required `NOT_SATISFIED` prevents `IMPLEMENTED` and
`VALIDATION_REQUIRED` completion.

## Phase 11 — Test Execution

Run ticket-specific tests, directly affected regressions, required cross-spec
tests, required architecture/conformance guards, and broader relevant suites
when change radius warrants them. Unexecuted tests are not passing.

Record:

```
TESTS_RUN
TESTS_PASSED
TESTS_FAILED
TESTS_SKIPPED
ENVIRONMENTAL_FAILURES
```

Distinguish `IMPLEMENTATION_FAILURE`, `TEST_INFRASTRUCTURE_FAILURE`, and
`ENVIRONMENTAL_FAILURE`. Never hide failures.

## Phase 12 — Completion Evidence

Evaluate each applicable evidence item:

```
production_code persistence_schema migration wiring automated_tests
integration_evidence architecture_guard legacy_transition_evidence
cross_spec_evidence conformance_evidence
```

with one of:

```
PRESENT
ABSENT
BLOCKED
NOT_APPLICABLE
```

`IMPLEMENTED` requires implementation work complete. `VALIDATION_REQUIRED`
requires implementation evidence complete while independent validation remains.
`DONE` requires all validation gates.

## Phase 13 — Status Transitions

Allowed transitions are:

```
READY → IN_PROGRESS
IN_PROGRESS → IMPLEMENTED
IN_PROGRESS → BLOCKED
IMPLEMENTED → VALIDATION_REQUIRED
VALIDATION_REQUIRED → DONE
```

Do not skip evidence-required transitions. Move to `IN_PROGRESS` immediately
before code modification. Move to `IMPLEMENTED` only when production changes,
required tests, and acceptance behavior are complete. Move to `BLOCKED` only for
a real blocker with evidence. This skill must not set `DONE` without the
required independent validation.

## Phase 14 — Newly Discovered Blockers

For missing foreign contracts, undefined semantics, hidden migrations,
authority conflicts, impossible criteria, or contradictory planning assumptions,
stop the affected ticket, set `STATUS = BLOCKED`, and add an exact
`BLOCKED_BY` identifier. Classify as:

```
IMPLEMENTATION_DEPENDENCY
CROSS_SPEC_DEPENDENCY
SPECIFICATION_GAP
ARCHITECTURE_GAP
BASELINE_CONTRADICTION
ENVIRONMENTAL_BLOCKER
```

Do not invent semantics.

## Phase 15 — Destructive Transition Guard

Before a ticket containing `RETIRE_LEGACY_WRITES`,
`REMOVE_ALTERNATE_AUTHORITY`, irreversible cutover, or destructive migration,
verify replacement tickets/checkpoints and their evidence. Require:

```
REPLACEMENT_PROVEN = YES
```

Otherwise use:

```
STATUS = BLOCKED
BLOCKED_BY:
- REPLACEMENT_PROOF_REQUIRED
```

The order is replacement, proof, retirement.

## Phase 16 — Cross-Spec Integration

Verify the foreign owner, identity, outcomes, failure behavior, and boundary
tests. Consume rather than duplicate. If a foreign capability classified
`REQUIRED_FOR_LOCAL_EXECUTION` or `REQUIRED_FOR_LOCAL_CLOSURE` has
`PRODUCTIVE_AVAILABILITY = NO`, block the ticket with
`BLOCKED_BY_UPSTREAM_CONTRACT`; do not create it locally unless upstream
authority assigns that work. A local fixture cannot satisfy durability,
restart/recovery, physical CAS, external-effect, or productive producer
requirements.

## Phase 17 — Change Discipline

Modify only files required by executed tickets and required shared test/contract
support. Before finishing inspect the repository diff and working-tree status.
Classify every changed file by ticket. Flag `UNRELATED_CHANGE` and revert it
unless accepted ticket scope requires it.

## Phase 18 — Ticket State Update

Update only state/evidence fields needed to reflect actual work:

```
STATUS
BLOCKED_BY
implementation evidence
tests executed
acceptance results
completion evidence
implementation notes
changed files, if supported
```

Do not alter Goal, validated delta, ownership, upstream traceability, Gap
coverage, or frozen Required Behavior. If those are wrong, stop for remediation
or replanning.

## Phase 19 — Index Update

Update the ticket-folder index as derived state. Recalculate status counts,
current blockers, execution order, newly unblocked tickets, waves, and
completion metrics. Ticket files remain authoritative.

## Phase 20 — Dependency and Blocker Recalculation

After each batch recalculate the graphs and downstream status. By default a
dependency requiring implementation completion is satisfied at `DONE`; use an
earlier state only when the documented ticket gate permits it. Recalculate each
downstream ticket as `READY` or `BLOCKED` from remaining blockers.

## Phase 21 — Newly Ready Tickets

Do not continue automatically when the user selected specific tickets. When all
available work was requested, continue only when the newly READY wave is
eligible, no independent re-audit is required, predecessors do not require
validation before execution, and the set remains conformant. Otherwise stop:

```
IMPLEMENTATION_BATCH_COMPLETE
next_gate = TICKET_VALIDATION_REQUIRED
```

## Phase 22 — Failure Handling

Classify test failures as `IMPLEMENTATION_FAILURE`, `EXISTING_REGRESSION`,
`CROSS_SPEC_FAILURE`, or `ENVIRONMENTAL_FAILURE`. Keep the ticket `IN_PROGRESS`
or `BLOCKED` as appropriate. Never mark `IMPLEMENTED` or `DONE` with unresolved
failures. Record environmental evidence without claiming tests passed.

## Phase 23 — Execution Findings

Record unexpected upstream-action conditions as:

```
EXE-BLOCKER-001
EXE-SPEC-GAP-001
EXE-ARCH-GAP-001
EXE-BASELINE-001
```

Do not use these for ordinary coding defects.

## Phase 24 — Batch Closure

For every executed ticket report:

```
INITIAL_STATUS
FINAL_STATUS
CHANGED_FILES
TESTS_RUN
ACCEPTANCE_CRITERIA_SATISFIED
COMPLETION_EVIDENCE_STATUS
REMAINING_BLOCKERS
UNBLOCKED_TICKETS
```

Do not force all tickets to the same final state.

## Ticket Validation Requirement

This skill implements; it is not an independent audit. Unless another
validator is explicitly defined, completed code normally finishes as:

```
READY → IN_PROGRESS → IMPLEMENTED → VALIDATION_REQUIRED
                                      ↓
                            independent audit → DONE
```

Do not self-certify final conformance merely because local tests pass.

## Critical Rules

1. Implement READY tickets only; never implement BLOCKED work.
2. Status is objective; never alter it to make workflow progress.
3. Ticket scope is frozen; adjacent work becomes a blocker or upstream finding.
4. Consume foreign capability; do not recreate it.
5. Required tests are part of implementation.
6. Replacement proof precedes destructive cutover.
7. Stop and escalate when planning assumptions are wrong.
8. Avoid unrelated refactoring and never weaken tests.
9. Preserve historical state unless authority explicitly requires migration.
10. Independent validation remains independent.
11. Update ticket and index state after execution.

## Required Final Response

After the implementation batch, report:

```
Implementation verdict:
IMPLEMENTATION_BATCH_COMPLETE
|
IMPLEMENTATION_PARTIALLY_COMPLETE
|
IMPLEMENTATION_BLOCKED
|
IMPLEMENTATION_NOOP

Ticket folder:
<path>

Ticket audit:
<path>

Repository baseline:
<commit>

Current HEAD:
<commit>

Baseline drift:
<classification>

Tickets selected:
<count>

Tickets executed:
<count>

Tickets completed to IMPLEMENTED:
<count>

Tickets moved to VALIDATION_REQUIRED:
<count>

Tickets blocked during execution:
<count>

Tests run:
<count>

Tests passed:
<count>

Tests failed:
<count>

Environmental failures:
<count>

Structural conformance:
- Structural self-check PASS: <count>
- Structural self-check FAIL: <count>
- Design revalidation required: <count>

DDD:
- Aggregate boundary violations: <count>
- Domain invariant bypasses: <count>
- Unenforced invariants: <count>
- Anemic domain regressions: <count>
- Fat application services introduced: <count>

SOLID:
- Unjustified violations: <count>
- Dependency direction violations: <count>
- Infrastructure leakage points: <count>

Clean Code:
- God components introduced: <count>
- Domain rule duplications: <count>
- Primitive obsession regressions: <count>
- Premature abstractions: <count>
- Overengineering findings: <count>

Ready tickets now:
<count>

Blocked tickets now:
<count>

In progress tickets now:
<count>

Implemented tickets now:
<count>

Validation required tickets now:
<count>

Done tickets now:
<count>

New blockers:
<count>

Newly unblocked tickets:
<count>

Upstream planning/spec gaps discovered:
<count>

NEXT_WORKFLOW_GATE: CHECKPOINT_REQUIRED | TICKET_VALIDATION_REQUIRED | MORE_READY_TICKETS_AVAILABLE | BLOCKED | COMPLETE
```

Then list each executed ticket with its ID, initial/final status, changed
files, design deviations, structural self-check result, acceptance result,
tests, completion evidence, remaining blockers, and unblocks. If blockers or
gaps were discovered, list only the identifier, affected ticket, short reason,
and required upstream action.

Do not claim `DONE` without independent validation. Do not modify ADRs, the
specification, Gap Matrix, Implementation Plan, or their audits.
