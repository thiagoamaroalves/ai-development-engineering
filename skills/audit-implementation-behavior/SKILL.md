---
name: audit-implementation-behavior
description: Independently audit an implemented ticket's runtime behavior and executable evidence, including positive and negative paths, assertions, test execution, regressions, concurrency, stale state, idempotency, persistence, recovery, and compatibility. Use when behavioral correctness must be checked before ticket approval; do not use to remediate code or transition ticket state.
metadata:
  short-description: Audit implemented ticket behavior
---

# Audit Implementation Behavior

Determine whether the implemented ticket actually behaves correctly and whether strong executable evidence proves that behavior.

Primary question:

`DOES_THE_IMPLEMENTATION_ACTUALLY_WORK_AND_IS_THERE_STRONG_EVIDENCE_OF_IT?`

This is a specialist audit of executable semantics, tests, assertions, failure semantics, and relevant runtime concerns. It does not own the final ticket verdict.

Read the shared authority-completeness reference at
`../_shared/authority-completeness-gates.md`. This is
the final runtime defense for authority consumption, temporal revalidation,
and caller-as-authority bypasses; it does not repair upstream artifacts.

Also read `../_shared/finding-completion-readiness-contract.md`.
When a missing runtime capability is only required for integrated proof, report
its evidence and downstream checkpoint without calling it a local completion
blocker. Canonical consolidation derives the final `BLOCKS_*` fields.

Also read `../_shared/root-cause-campaign-contract.md` and
`../_shared/authority-provenance-anti-forgery-contract.md`. For any authority-
bearing result, receipt, evidence, or proof, enumerate issuer, registrar,
consumer, alternate authority, injection, mutation/stale, port substitution,
and public-export surfaces and require direct negative witnesses.

Reconstruct required behavior from this chain, in order:

`Accepted ADR → Canonical Specification → Validated Gap Matrix → Implementation Plan → Ticket → Repository implementation → Executable tests`

The planning chain defines authorized behavior. Repository code and executable tests demonstrate actual behavior. Do not rely on implementation report claims.

Operate as:

`READ_ONLY · INDEPENDENT · ADVERSARIAL · BEHAVIOR_FIRST · TEST_ASSERTION_AWARE · NEGATIVE_PATH_AWARE · REGRESSION_AWARE · FAILURE_SEMANTICS_AWARE · EXHAUSTIVE_WITHIN_DOMAIN`

Do not modify production code, tests, ADRs, specifications, gap matrices, plans, tickets, or state indexes. The only permitted write is the required audit report artifact.

## Required inputs

Identify and record:

`TICKET_ID`, `TICKET_PATH`, `IMPLEMENTATION_UNIT`, `REQUIREMENT_IDS`, `ACCEPTANCE_IDS`, `SPEC_PATH`, `GAP_MATRIX_PATH`, `IMPLEMENTATION_PLAN_PATH`, `IMPLEMENTATION_BASELINE`, `CURRENT_HEAD`, `AUDIT_TARGET_HEAD`, `AUDIT_TARGET_STATE_FINGERPRINT`, `CHANGED_PRODUCTION_FILES`, `CHANGED_TEST_FILES`, and `RELEVANT_TEST_SUITES`.

`AUDIT_TARGET_HEAD` identifies the base commit. The semantic implementation
subject may include a working-tree overlay only when its exact content is
covered by `AUDIT_TARGET_STATE_FINGERPRINT` and remains unchanged during the
audit.

If an input cannot be identified, record the omission and determine whether it blocks an independent audit. Do not silently substitute an implementation report for repository evidence.

Also identify applicable `AUTHORITY_CONSUMPTION_PROOF`,
`PRODUCER_CONSUMER_CONTRACT_PROOF`, and `TEMPORAL_AUTHORITY_PROOF` baselines.
Reconcile each capability's independent authority, contract, local-testability,
productive-availability dimensions and dependency class, and verify that a
fixture/mock/fake/in-memory repository has not been promoted to productive
availability. If the ticket was locally closed without productive availability
for a required witness, report the contradiction as a blocking finding and
preserve the upstream root cause.

## Workflow

### 1. Reconstruct the behavioral contract

Extract every observable behavior owned or affected by the ticket. For each behavior, identify the applicable:

- success behavior;
- failure behavior;
- negative behavior;
- persistence behavior;
- retry behavior;
- concurrent behavior;
- stale-state behavior;
- recovery behavior;
- compatibility behavior.

Do not invent requirements. Build a behavioral applicability matrix with these dimensions:

`UNIT_BEHAVIOR`, `INTEGRATION_BEHAVIOR`, `PERSISTENCE`, `CONCURRENCY`, `STALE_STATE`, `IDEMPOTENCY`, `DURABILITY`, `RECOVERY`, `COMPATIBILITY`, `MIGRATION_BEHAVIOR`, and `NEGATIVE_PATHS`.

Classify each dimension as `REQUIRED`, `AFFECTED`, or `NOT_APPLICABLE`; give a short reason for every `NOT_APPLICABLE` dimension. Inspect every `REQUIRED` and `AFFECTED` dimension.

### 2. Audit production semantics

Inspect executable implementation and trace actual execution paths when needed. For every required behavior classify it as:

`IMPLEMENTED_CORRECTLY`, `PARTIAL`, `MISSING`, `CONTRADICTORY`, or `UNSAFE_FAILURE_BEHAVIOR`.

For normal behavior follow:

`input → execution → state transition → persisted/observable result → expected output`

Record concrete production locations and observed semantics. Do not infer runtime behavior from names, types, structure, or apparent intent alone.

### 2a. Acceptance witness audit

Reconstruct the ticket's `ACCEPTANCE_WITNESS_MATRIX` and compare every
normative verb with a real production operation and a directly corresponding
executed test. Record:

```text
REQUIRED_BEHAVIORS_TOTAL
DIRECT_BEHAVIOR_WITNESSES
PROXY_ONLY_BEHAVIORS
UNTESTED_STATE_TRANSITIONS
UNPROVEN_CONCURRENCY_CONTRACTS
MISSING_ARCHITECTURE_GUARDS
```

A direct witness executes the required operation and asserts its semantic
result. Registration/listing does not prove progress; sequential duplicate
execution does not prove concurrency; source inspection does not prove an
architecture guard. If a behavior is covered only by a proxy, record a
`PROXY_ONLY_BEHAVIOR` finding even when the test suite is green. An absent or
non-operationalized witness is a blocking finding, not an inference that the
behavior is satisfied.

For every row verify `WITNESS_EXECUTABLE_AT_LOCAL_CLOSURE`. A fixture is a valid
witness only for local/contract-level semantics, never for durable persistence,
restart/recovery, serialization, physical CAS, foreign integration, productive
recovery, or external-effect execution.

### 3. Inventory required tests

Derive required test categories from the authority chain and applicability matrix. Consider only categories relevant to this ticket:

`UNIT`, `INVARIANT`, `PERSISTENCE`, `INTEGRATION`, `CROSS_SPEC`, `CONCURRENCY`, `STALE`, `IDEMPOTENCY`, `RECOVERY`, `COMPATIBILITY`, `MIGRATION`, `NEGATIVE_PATH`, `ARCHITECTURE_GUARD`, and `CONFORMANCE`.

Classify each as `REQUIRED_TEST_PRESENT`, `REQUIRED_TEST_MISSING`, or `TEST_CATEGORY_NOT_APPLICABLE`. Do not require unrelated categories.

### 4. Evaluate assertion quality

Inspect actual assertions and classify evidence as `STRONG`, `SUFFICIENT`, `WEAK`, `MISLEADING`, or `NON_ASSERTIVE`.

A test name is not evidence. Treat evidence as weak or non-assertive when it materially relies on HTTP success without semantic assertions, non-null assertions as correctness, duplicated implementation logic, mocks that remove the invariant under test, successful construction without behavioral proof, or absence of exceptions as business correctness.

### 5. Verify negative and failure behavior

Verify required rejection and failure semantics, including only cases authorized or materially affected by the ticket:

- invalid input;
- unavailable dependency;
- unauthorized action;
- missing owner outcome;
- stale state;
- duplicate command;
- conflicting predecessor;
- persistence failure;
- partial execution;
- retry after failure.

Record expected and observed outcomes. Pay particular attention to false success, silent overwrite, partial mutation, unsafe retries, and loss of durable identity.

### 6. Execute and classify tests

Independently execute or verify, in this order where available:

1. ticket-specific tests;
2. directly affected tests;
3. relevant regression suite;
4. integration tests;
5. architecture or conformance guards.

Record `TESTS_RUN`, `TESTS_PASSED`, `TESTS_FAILED`, `TESTS_SKIPPED`, and `ENVIRONMENTAL_FAILURES`. Classify failures as `IMPLEMENTATION_FAILURE`, `PREEXISTING_REGRESSION`, `CROSS_SPEC_FAILURE`, or `ENVIRONMENTAL_FAILURE`.

Required tests that remain unexecuted without accepted justification block a specialist pass. A failed test does not terminate the audit; complete all `REQUIRED` and `AFFECTED` dimensions.

The audit must execute or otherwise obtain direct evidence for each matrix row;
test names, source inspection, and inferred behavior are not witnesses.

### 7. Audit regression safety

Compare behavior against `IMPLEMENTATION_BASELINE` and inspect affected existing contracts. Classify the result as `NO_REGRESSION`, `REGRESSION_DISCOVERED`, or `REGRESSION_NOT_PROVABLE`.

Do not perform unrelated repository-wide regression hunting. A material regression is a blocking finding.

### 8. Audit conditional runtime dimensions

Run each audit below when its dimension is `REQUIRED` or `AFFECTED`; otherwise mark it `NOT_APPLICABLE` with a reason.

#### Concurrency

Exercise or trace concurrent equivalent commands and conflicting mutations. Check lost updates, duplicate creation, ordering assumptions, and required atomicity. Require observable correctness, not a particular locking strategy. Classify as `FULLY_CONFORMANT`, `PARTIAL`, `MISSING`, or `CONTRADICTORY`.

#### Stale state

Verify stale revision rejection, predecessor mismatch handling, outdated-state mutation, compare-and-set semantics where required, and absence of silent overwrite. Classify as `CONFORMANT`, `PARTIAL`, or `NON_CONFORMANT`.

#### Authority consumption and temporal validation

For every external authority used during execution, verify that the code uses
the approved productive contract and preserves the authority owner's meaning.
Classify the evidence with the shared independent dimensions; when a summary is
emitted, derive it only after recording them:
`AUTHORITY_CONSUMABLE` is valid only when `PRODUCTIVE_AVAILABILITY = YES`;
`PRODUCTIVE_AVAILABILITY = NO` is not a behavioral PASS. Verify producer, consumer, returned data,
version/revision, not-found/stale/failure semantics, and availability.

When authority can change between observation and effect, audit the
`TEMPORAL_AUTHORITY_PROOF`: initial basis, independent second observation,
drift detection, fail-closed behavior, state preservation, semantic validation
owner, and the separate CAS/physical-integrity role. Comparing an object with
itself, reusing one snapshot, trusting a caller value, reusing a local variable,
or relying only on CAS is not revalidation.

Run `CALLER_AS_AUTHORITY_CHECK` for lifecycle, eligibility, canonical revision,
status, current basis, ownership, approval, and domain state. Report
`CALLER_SUPPLIED_AUTHORITY_BYPASS` whenever caller input is accepted as
canonical truth instead of obtaining it from the authority owner.

#### Idempotency

Verify repeated equivalent execution and retry semantics. Check for duplicate canonical state, authority records, business effects, or inconsistent outcomes. Classify as `CONFORMANT`, `PARTIAL`, or `NON_CONFORMANT`.

#### Durability and persistence

Verify state becomes durable at the required point before dependent observation or completion is reported. Inspect transaction boundaries, persistence ordering, durable identity, and false-success scenarios. Classify as `CONFORMANT`, `PARTIAL`, or `NON_CONFORMANT`.

#### Recovery

Verify restart behavior, retry after partial failure, replay behavior, identity preservation, absence of duplicate business completion, and recovery from interrupted operations. Classify as `CONFORMANT`, `PARTIAL`, or `NON_CONFORMANT`.

#### Compatibility and migration

Verify relevant existing readers, compatibility mappings, migrated-state behavior, historical behavior, and explicitly required backward compatibility. `audit-architecture-boundaries` owns legacy-authority boundaries; this skill audits observable runtime behavior.

### 9. Expand systemic findings within scope

For every material behavioral defect, open or join a `ROOT_CAUSE_CAMPAIGN_ID` and
complete the shared surface matrix. Inspect issuers, registrars, consumers,
alternate authority paths, injection points, mutation/stale paths, port
substitution paths, public exports, retry/recovery routes, and equivalent tests
within ticket scope. Record a negative-witness row for every applicable surface.

Prefer one root-cause finding with multiple evidence locations when that accurately represents the pattern, while preserving distinct obligations as separate findings.

## Severity and findings

Use `CRITICAL`, `MAJOR`, `MINOR`, and `INFO`.

- `CRITICAL`: behavior can violate fundamental identity, durable authority, destructive safety, or an equivalent fundamental invariant.
- `CRITICAL`: also applies to `CALLER_SUPPLIED_AUTHORITY_BYPASS`,
  `TEMPORAL_AUTHORITY_GAP`, or use of a non-consumable/undefined authority in a
  path that can commit an effect.
- `MAJOR`: required behavior is missing or incorrect, a material regression exists, a required test is absent, or required concurrency, idempotency, recovery, or similar semantics are unproven.
- `MAJOR`: a required behavior is covered only by a proxy, a required state
  transition is untested, or a required concurrency contract has no direct
  contract test, even when the available suite is green.
- `MINOR`: localized test-strength or maintainability concern with real but non-blocking impact.
- `INFO`: non-blocking observation.

Use IDs `BEH-CRITICAL-001`, `BEH-MAJOR-001`, `BEH-MINOR-001`, and `BEH-INFO-001` in separate sequences by severity. Do not use `IMA-*` IDs.

Every finding must include:

- severity;
- ticket;
- requirement and acceptance references;
- required behavior;
- production evidence;
- test evidence;
- observed result;
- expected result;
- problem;
- impact;
- minimum correction required;
- `Systemic pattern = YES | NO`;
- related locations.
- capability, dependency class, local-acceptance dependency, and evidence timing;
- `LOCAL_CLOSURE_BLOCKING`, `DEPENDENCY_CLASS_RECLASSIFICATION_REQUIRED`, and
  `UPSTREAM_DEPENDENCY_CLASSIFICATION_PRESERVED`;
- suggested local versus integrated blocking effects for canonical
  consolidation.

## Completion and output

Create `<TICKET-ID>-behavior-audit.md` in the ticket's established artifact location, or alongside the ticket when no convention exists. The report must include the identified inputs, behavioral contract, applicability matrix, production classifications, test inventory, assertion-quality assessment, test execution record, regression result, conditional-dimension results, all findings, and this exact summary shape:

```text
Audit: <path>

Specialist:
IMPLEMENTATION_BEHAVIOR

Ticket: <ticket ID>

Required behavioral dimensions: <count>

Required tests: <count>

Required tests missing: <count>

Required behaviors total: <count>

Direct behavior witnesses: <count>

Proxy-only behaviors: <count>

Untested state transitions: <count>

Unproven concurrency contracts: <count>

Missing architecture guards: <count>

Tests run: <count>

Tests passed: <count>

Tests failed: <count>

Regressions: <count>

Concurrency:
CONFORMANT | NON_CONFORMANT | NOT_APPLICABLE

Stale behavior:
CONFORMANT | NON_CONFORMANT | NOT_APPLICABLE

Idempotency:
CONFORMANT | NON_CONFORMANT | NOT_APPLICABLE

Recovery:
CONFORMANT | NON_CONFORMANT | NOT_APPLICABLE

Authority consumption:
CONSUMABLE | DEFINED_BUT_NOT_CONSUMABLE | NOT_DEFINED | NOT_APPLICABLE

Temporal authority:
PROTECTED | GAP | NOT_APPLICABLE

Caller-as-authority bypasses: <count>

Findings:
CRITICAL=<count>
MAJOR=<count>
MINOR=<count>
INFO=<count>

Domain audit complete:
YES | NO

Specialist result:
SPECIALIST_BEHAVIOR_PASS
|
SPECIALIST_BEHAVIOR_FINDINGS
|
SPECIALIST_AUDIT_BLOCKED
```

Return exactly one specialist result:

- `SPECIALIST_BEHAVIOR_PASS` when this behavioral domain passes;
- `SPECIALIST_BEHAVIOR_FINDINGS` when findings exist;
- `SPECIALIST_AUDIT_BLOCKED` when required evidence cannot be obtained or the audit cannot be completed independently.

`SPECIALIST_BEHAVIOR_PASS` applies only to this specialist domain. Never declare `READY_FOR_DONE`, approve the ticket, transition ticket state, or modify implementation.

The audit is complete only when every `REQUIRED` and `AFFECTED` behavioral dimension has been inspected, all required test categories have a classification, test execution outcomes are recorded, and the report contains `DOMAIN_AUDIT_COMPLETE = YES` or a documented reason for `NO`.
