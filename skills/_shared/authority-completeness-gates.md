# Authority Completeness and Readiness Gates

Shared normative-audit and handoff reference for the Component SPEC, Gap Matrix,
Implementation Plan, ticket, Implementation Design, implementation, and audit
skills. Read this reference before applying any phase-specific instruction.

For baseline/source drift handoffs, also read
[`baseline-drift-remediation-contract.md`](baseline-drift-remediation-contract.md)
before deciding whether a remediation is blocked. That contract is the single
source of truth for `DRIFT_UNASSESSED` versus `DRIFT_ASSESSED`, reassessment
proof, exact audit-basis fingerprints, and the no-deadlock gate.

For canonical implementation findings and local-versus-integrated completion,
also read [`finding-completion-readiness-contract.md`](finding-completion-readiness-contract.md).
That contract is the single source of truth for finding-level `BLOCKS_*`
fields, `TICKET_GATE`, and downstream handoff traceability. The capability
rules below establish availability facts; they do not replace finding-level
completion derivation.

## Audit artifact ownership and immutability

Audit artifacts are historical snapshots of the audit execution that produced
them. The corresponding audit skill owns their creation and updates:

```text
AUDIT_ARTIFACT_IMMUTABILITY = REQUIRED
ONLY_THE_CORRESPONDING_AUDIT_SKILL_MAY_CREATE_OR_UPDATE_AN_AUDIT_ARTIFACT
AUDIT ARTIFACTS ARE OWNED BY THEIR AUDIT SKILL.
OTHER SKILLS MAY READ AND CITE THEM, NEVER MUTATE THEM.
```

This rule applies to canonical and specialist audit artifacts, including
`PORTFOLIO_AUDIT`, `COMPONENT_SPEC_AUDIT`, `GAP_MATRIX_AUDIT`,
`IMPLEMENTATION_PLAN_AUDIT`, `TICKET_SET_AUDIT`, `IMPLEMENTATION_AUDIT`, and
`SPECIALIST_AUDITS`. A downstream workflow may preserve a finding, cite its
source audit, and persist an explicit handoff. It may not synchronize the
source audit with later facts. If new facts require a changed verdict or
finding set, invoke the corresponding audit/revalidation skill to overwrite
the canonical audit according to the workflow's history convention.

Authority artifacts remain owned by their governing generation, remediation,
or decision workflow. Downstream finalization and handoff workflows may read
and cite authority artifacts but do not gain write authority over them.

For local ticket finalization, the following invariants are mandatory:

```text
UPSTREAM_AUDIT_ARTIFACTS_MODIFIED_BY_FINALIZATION = 0
UPSTREAM_AUTHORITY_ARTIFACTS_MODIFIED_BY_FINALIZATION = 0
```

An audit or authority artifact whose SHA-256 changes during finalization is a
write-scope violation, even if the change only adds a synchronization note,
new metric, revalidation section, or updated verdict.

## Purpose and scope

The gates apply to every Aggregate Root, Entity, persistible lifecycle, or
state machine that is introduced, required, referenced, or implicitly needed
by the audited scope. They are applicable only when the concept exists; mark a
gate `NOT_APPLICABLE` with evidence when it genuinely does not.

Authority is checked before implementation coverage. ADRs and approved
portfolio decomposition remain authoritative for architecture and ownership;
the component SPEC is authoritative for owned domain semantics; Gap Matrix,
Plan, Design, repository code, and tests cannot fill an upstream authority
hole. Existing implementation is evidence that a gap escaped, never authority
that may be promoted to close it.

Do not accept generic statements such as `has an identity`, `uses an ID`,
`repository finds by ID`, or `will be persisted`. The proof must make an
implementation deterministic, including negative and invalid cases.

## Canonical capability dimensions and dependency classes

Every cross-component capability MUST carry these independent dimensions at
every handoff. They are the source of truth; no single maturity enum may
replace them:

```text
AUTHORITY_STATUS = UNDEFINED | DEFINED
CONTRACT_STATUS = UNDEFINED | DEFINED
LOCAL_TESTABILITY = NO | YES
PRODUCTIVE_AVAILABILITY = NO | YES
```

The dimensions are intentionally non-exclusive. For example, a capability can
be locally testable while not productively available, or productively available
without a local fixture. Enforce only these consistency rules:

```text
AUTHORITY_STATUS = UNDEFINED
    => CONTRACT_STATUS = UNDEFINED
    AND LOCAL_TESTABILITY = NO
    AND PRODUCTIVE_AVAILABILITY = NO

CONTRACT_STATUS = DEFINED => AUTHORITY_STATUS = DEFINED
LOCAL_TESTABILITY = YES => CONTRACT_STATUS = DEFINED
PRODUCTIVE_AVAILABILITY = YES
    => AUTHORITY_STATUS = DEFINED AND CONTRACT_STATUS = DEFINED
```

The optional `CAPABILITY_SUMMARY_STATUS` is derived for compatibility and
reporting only. It is never the primary state and never authorizes a promotion:

```text
CAPABILITY_SUMMARY_STATUS =
    AUTHORITY_NOT_DEFINED
    | AUTHORITY_DEFINED
    | CONTRACT_DEFINED
    | CONTRACT_TESTABLE_LOCALLY
    | CONTRACT_PRODUCTIVELY_AVAILABLE
```

Derive the summary as follows, without treating it as an ordered state machine:

```text
AUTHORITY_STATUS = UNDEFINED
    => AUTHORITY_NOT_DEFINED

AUTHORITY_STATUS = DEFINED AND CONTRACT_STATUS = UNDEFINED
    => AUTHORITY_DEFINED

CONTRACT_STATUS = DEFINED
AND LOCAL_TESTABILITY = NO
AND PRODUCTIVE_AVAILABILITY = NO
    => CONTRACT_DEFINED

CONTRACT_STATUS = DEFINED
AND LOCAL_TESTABILITY = YES
AND PRODUCTIVE_AVAILABILITY = NO
    => CONTRACT_TESTABLE_LOCALLY

CONTRACT_STATUS = DEFINED AND PRODUCTIVE_AVAILABILITY = YES
    => CONTRACT_PRODUCTIVELY_AVAILABLE
```

`AUTHORITY_NOT_DEFINED`, `AUTHORITY_DEFINED`, `CONTRACT_DEFINED`,
`CONTRACT_TESTABLE_LOCALLY`, and `CONTRACT_PRODUCTIVELY_AVAILABLE` are summary
labels, not mutually exclusive facts. A handoff MUST persist the dimensions,
the summary (when used), and the ownership/evidence fields below:

```text
AUTHORITY_OWNER
PRODUCER
CONSUMER
CONTRACT
SEMANTIC_STATUS
AVAILABILITY_EVIDENCE
BLOCKING_EFFECT
```

The following implications are mandatory:

```text
CONTRACT_TESTABLE_LOCALLY != CONTRACT_PRODUCTIVELY_AVAILABLE
INTERFACE_EXISTS != PRODUCER_EXISTS
LOCAL_FIXTURE_EXISTS != PRODUCTIVE_PRODUCER_EXISTS
MOCK_EXISTS != PRODUCTIVE_PRODUCER_EXISTS
IN_MEMORY_REPOSITORY_EXISTS != DURABLE_CAPABILITY_EXISTS
CONTRACT_CONFORMANCE != RUNTIME_AVAILABILITY
```

Fixtures, mocks, fakes, contract harnesses, and in-memory repositories may prove
local contract semantics only. Alone they never prove productive availability,
durability, restart recovery, physical CAS, external-effect execution, or real
producer consumability. `AUTHORITY_DEFINED_BUT_NOT_CONSUMABLE` remains a
compatibility finding label for `PRODUCTIVE_AVAILABILITY = NO`; it is not a
canonical capability state.

For every handoff, copy the complete record without reinterpretation. A
downstream skill may promote `PRODUCTIVE_AVAILABILITY` only under the explicit
rule:

```text
NO_DOWNSTREAM_CAPABILITY_PROMOTION_WITHOUT_NEW_EVIDENCE
```

Every productive-availability promotion MUST record:

```text
CAPABILITY_ID
PREVIOUS_STATUS (PRODUCTIVE_AVAILABILITY)
NEW_STATUS (PRODUCTIVE_AVAILABILITY)
PREVIOUS_PRODUCTIVE_AVAILABILITY
NEW_PRODUCTIVE_AVAILABILITY
PREVIOUS_CAPABILITY_SUMMARY_STATUS (when a summary was emitted)
NEW_CAPABILITY_SUMMARY_STATUS (when a summary was emitted)
PROMOTION_EVIDENCE
EVIDENCE_OWNER
EVIDENCE_BASELINE_OR_COMMIT
```

The promotion evidence must be new relative to the upstream handoff and must
prove the integrated producer at the consumer execution point. A fixture is
never new productive evidence. A downstream artifact, owner assignment,
dependency reorder, or repeated citation is not evidence.

Allowed dimension transitions are:

```text
AUTHORITY_STATUS: UNDEFINED → DEFINED
    only with new accepted normative authority

CONTRACT_STATUS: UNDEFINED → DEFINED
    only with an approved consumer contract

LOCAL_TESTABILITY: NO → YES
    only with a local contract-level executable harness

PRODUCTIVE_AVAILABILITY: NO → YES
    only with an integrated productive producer and runtime evidence plus the
    promotion record above
```

Each dimension is recalculated from current evidence and may regress when
evidence is stale, revoked, unavailable, or contradicted. No phase may reverse
a blocker without evidence or promote a dimension because a downstream artifact
was created.

Every capability dependency MUST also carry exactly one class:

```text
REQUIRED_FOR_LOCAL_EXECUTION
REQUIRED_FOR_LOCAL_CLOSURE
REQUIRED_FOR_INTEGRATED_PROOF
INFORMATIONAL
```

`REQUIRED_FOR_LOCAL_EXECUTION` blocks execution readiness when its productive
producer is unavailable. `REQUIRED_FOR_LOCAL_CLOSURE` blocks local closure and
ticket readiness when its productive producer is unavailable. A local fixture
may still be valid contract-level evidence when the fixture/harness is the
capability required by the local witness; that does not promote the real
producer. `REQUIRED_FOR_INTEGRATED_PROOF` is recorded for later integrated proof
and MUST NOT block local execution or local closure merely because productive
availability is missing. `INFORMATIONAL` never blocks a gate. For canonical
findings, derive the complete finding-level `BLOCKS_LOCAL_EXECUTION`,
`BLOCKS_LOCAL_CLOSURE`, `BLOCKS_TICKET_DONE`, `BLOCKS_INTEGRATED_PROOF`, and
`BLOCKS_SPEC_FINAL_CONFORMANCE` set from the shared finding-completion contract;
do not infer completion blocking from severity or from a cross-SPEC relationship.
The Plan/Ticket dependency class and `LOCAL_CLOSURE_BLOCKING` record are
completion-scope authority once independently audited. A downstream specialist
or consolidator may change them only with explicit reclassification evidence
and `PRIMARY_ROUTE = PLAN_OR_TICKET_REVALIDATION`.

## Canonical readiness and closure predicates

Use these predicates mechanically; do not infer them from a prose status:

```text
EXECUTION_READY =
    UPSTREAM_AUTHORITY_COMPLETE
    AND ALL_CAPABILITIES_WITH_CLASS_IN(
        REQUIRED_FOR_LOCAL_EXECUTION,
        REQUIRED_FOR_LOCAL_CLOSURE
    )_HAVE_PRODUCTIVE_AVAILABILITY
    AND LOCAL_ACCEPTANCE_PROVABLE_NOW
    AND LOCAL_COMPLETION_EVIDENCE_PRODUCIBLE_NOW
    AND NO_UNRESOLVED_BLOCKER
```

`STATUS: READY`, `INITIAL_DAG_STATE = READY`, and the implementation execution
gate are valid only when `EXECUTION_READY = TRUE`. A future integration,
checkpoint, owner assignment, fixture, or code that can start locally does not
make this predicate true.

Keep these fields distinct:

```text
WORK_CAN_START = YES | NO
LOCAL_CLOSURE = YES | NO
ISSUE_DECOMPOSITION_READINESS = ISSUE_READY | INTERNAL_ONLY | PLAN_BLOCKED
INITIAL_DAG_STATE = READY | BLOCKED
```

`LOCAL_CLOSURE = YES` requires every local Acceptance Criterion and every
Completion Evidence item to be producible at the unit/ticket closure point,
including all capabilities classified `REQUIRED_FOR_LOCAL_CLOSURE` and all
negative witnesses. Capabilities classified only
`REQUIRED_FOR_INTEGRATED_PROOF` or `INFORMATIONAL` do not block local closure.
`WORK_CAN_START = YES` with `LOCAL_CLOSURE = NO` is representable only as
non-ticket planning work or an explicitly blocked/split-required unit. Because
the ticket orchestrator requires local closure, such a unit MUST be split or
blocked before ticket decomposition; it MUST NOT produce a normal READY ticket.

`SHARED_CLOSURE_BOUNDARY = YES` requires the merged parts to have compatible
authority status, contract status, local testability, productive availability,
dependency classes, external blockers, cross-SPEC prerequisites, local closure
conditions, and completion-evidence timing. Shared authority, persistence
boundary, or invariant is not sufficient. If one part is locally closable and
another requires an unavailable capability for local execution/closure, the
unit is `FALSE_UNIT_MERGE`: split it when the governing authority permits, or
keep the combined unit blocked. This inconsistency is resolved in the Plan,
never deferred to ticket decomposition.

Use:

```text
BLOCKED_BY_UPSTREAM_AUTHORITY
    authority is AUTHORITY_NOT_DEFINED or normative authority is incomplete

BLOCKED_BY_UPSTREAM_CONTRACT
    authority/contract is defined but a required capability is below
    PRODUCTIVE_AVAILABILITY = YES
```

Neither blocker may be represented as `READY`, `BLOCKED_BY: NONE`, or
`TICKET_LOCAL_CLOSURE = YES` when the blocked capability is required by a local
criterion or completion gate.

## Canonical proof: `AGGREGATE_IDENTITY_PROOF`

Produce one proof per Aggregate Root. Include:

```text
AGGREGATE_ROOT
CANONICAL_IDENTITY
IDENTITY_AUTHORITY_SOURCE
IDENTITY_KIND_OR_TYPE
IDENTITY_SCOPE
STABLE_CORRELATION_FIELDS
CREATION_RULE
COMMAND_REPRESENTATION
REPOSITORY_LOOKUP_REPRESENTATION
PERSISTED_REPRESENTATION
REHYDRATED_REPRESENTATION
EQUALITY_AND_CONTINUITY_SEMANTICS
REVISION_RELATIONSHIP
ALIASES_LOCAL_IDS_DERIVED_IDS
ALIAS_AUTHORITY_AND_FORBIDDEN_SUBSTITUTIONS
PROOF_EVIDENCE
```

`CANONICAL_IDENTITY` and `IDENTITY_AUTHORITY_SOURCE` must be concrete. State
who owns the identity and how it is created, transported, looked up, stored,
restored, compared, and related to revision/version. If any applicable field
is absent or ambiguous, return:

```text
IDENTITY_AUTHORITY_GAP
```

The result is `IDENTITY_CONTRACT_COMPLETE` only when every representation
preserves the same canonical identity and aliases cannot silently become
authority.

## Canonical proof: `AGGREGATE_RECONSTRUCTION_PROOF`

Produce one proof for every persistible Aggregate Root or Entity that may be
restored in a state other than its initial state. Include:

```text
AGGREGATE_OR_ENTITY
WHAT_PERSISTED_MATERIAL_IS_ACCEPTED
WHO_VALIDATES_PERSISTED_MATERIAL
CREATE_SEMANTICS
REHYDRATE_SEMANTICS
REHYDRATABLE_STATES
CURRENT_STATE_EVIDENCE
CANONICAL_IDENTITY_RESOLUTION
REFERENCE_ATTACHMENT_VALIDATION
VERSION_OR_REVISION_VALIDATION
CAN_UNTRUSTED_OR_DETACHED_PERSISTED_MATERIAL_BE_MATERIALIZED_DIRECTLY_AS_VALID_DOMAIN_STATE?
RECONSTRUCTION_VALIDATOR_OR_RESOLVER_OWNER
PREDECESSOR_SUCCESSOR_OR_PROGRESSION_PROVENANCE
CAUSAL_SEQUENCE_OR_EQUIVALENT_CONTINUITY_EVIDENCE
CONTINUITY_VALIDATION
STALE_STATE_BEHAVIOR
UNKNOWN_REFERENCE_BEHAVIOR
DETACHED_REFERENCE_BEHAVIOR
CORRUPTED_MATERIAL_BEHAVIOR
SKIPPED_STATE_BEHAVIOR
FORGED_LATER_STATE_BEHAVIOR
STATE_SKIP_REJECTION
STATE_EVIDENCE_INCONSISTENCY_REJECTION
FORGED_LATER_STATE_REJECTION
DOMAIN_VALIDATION_OWNER
PERSISTENCE_ADAPTER_RESPONSIBILITY
FAIL_CLOSED_FAILURES
FAIL_CLOSED_RESULT
MUTATION_ON_FAILURE = NO
PERSISTED_IDENTITY_STATE_VERSION
INVARIANTS_REVALIDATED
EXTERNAL_REFERENCES_REQUIRED
INVALID_PERSISTENCE_BEHAVIOR
INCOMPLETE_HISTORY_BEHAVIOR
STALE_STATE_BEHAVIOR
PROOF_EVIDENCE
```

Do not treat an enum value, a CAS/persistence revision, or a mapper/repository
decision as lifecycle proof unless accepted authority explicitly gives it that
meaning. Do not make rehydration safe merely by permitting only the initial
state. The proof must distinguish create from rehydrate, show how legitimate
progression is evidenced, validate continuity, reject skips/inconsistency/
fabrication, and fail closed.

The result is `RECONSTRUCTION_CONTRACT_COMPLETE` only when all applicable
fields are normatively defined. Otherwise return:

```text
RECONSTRUCTION_AUTHORITY_GAP
```

The following are explicit non-proofs and MUST be recorded when encountered:

```text
SHAPE_VALIDATION_IS_NOT_AUTHORITY_PROOF
CALLER_SUPPLIED_VALID_SHAPE_IS_NOT_CANONICAL_AUTHORITY
```

The mere presence of `rehydrate(...)`, a constructor, `fromPersisted(...)`,
`CanonicalIdentityReference.create(...)`, a schema-valid object, or a valid
caller-supplied shape never closes this proof. When reconstruction depends on a
resolver, catalog, or authority owner, the contract must identify its input,
returned authoritative data, failure/not-found/stale semantics, attachment and
continuity validation, and the owner of each decision.

The reconstruction simulation MUST answer
`CAN_UNTRUSTED_OR_DETACHED_PERSISTED_MATERIAL_BE_MATERIALIZED_DIRECTLY_AS_VALID_DOMAIN_STATE?`.
When canonical authority or reconstruction validation applies, the answer is
`NO`; `RECONSTRUCTION_VALIDATOR_OR_RESOLVER_OWNER` MUST name the validator or
resolver owner and its rejection/failure boundary. A `YES`, `UNKNOWN`, or
omitted owner is `RECONSTRUCTION_AUTHORITY_GAP`.

## Lifecycle and persistence gates

For every stateful aggregate/entity, verify:

```text
VALID_STATES
INITIAL_STATE
TERMINAL_STATES
ALLOWED_TRANSITIONS
FORBIDDEN_TRANSITIONS
PREDECESSOR_SUCCESSOR_RULES
TRANSITION_INVARIANTS
TRANSITION_OWNER
OBSERVABLE_EFFECTS
IDEMPOTENCY
CONCURRENCY
STALE_AND_REPLAY_BEHAVIOR
RECOVERY_RULES
REHYDRATION_RULES
```

For every persistible aggregate/entity, verify:

```text
SNAPSHOT_SEMANTICS
HISTORY_OR_PROVENANCE_SEMANTICS
PERSISTENCE_REVISION_SEMANTICS
DOMAIN_REVISION_SEMANTICS_IF_DISTINCT
RECONSTRUCTION_INPUTS
INTEGRITY_GUARANTEE
SEMANTIC_OWNER
STORAGE_OWNER
RECOVERY_WITHOUT_AUTHORITY_TRANSFER
```

Enumerating states is not lifecycle authority. A persistence revision is not a
domain revision or progression proof unless the normative contract says so.

## Cross-boundary ownership

When domain and persistence/infra are in different SPECs, record the explicit
cross-SPEC dependency and prove both sides:

```text
DOMAIN_OWNS = meaning, invariants, identity, lifecycle, reconstruction validity
INFRA_OWNS = storage, serialization, atomicity, indexes, physical recovery
BOUNDARY_CONTRACT = all data/mechanisms needed to preserve DOMAIN_OWNS
```

Adapters may enforce durable constraints but may not invent domain meaning.
Aggregates may not depend on a concrete database, serializer, journal, or
adapter. A missing or insufficient boundary contract is
`CROSS_SPEC_AUTHORITY_GAP`.

## Authority consumption proof: `AUTHORITY_CONSUMPTION_PROOF`

For every dependency on an authority outside the consuming component, prove
both existence and consumability. Record:

```text
CAPABILITY_ID
AUTHORITY_EXISTENCE
TRUTH_OWNER
AUTHORITY_SEMANTIC_SOURCE
OWNER_DOMAIN_OR_BOUNDED_CONTEXT
CONSUMPTION_CONTRACT
PORT_INTERFACE_QUERY_RESOLVER_OR_READER
CONTRACT_PRODUCER
CONTRACT_CONSUMER
RETURNED_DATA
VERSION_REVISION_TRANSPORT
FAILURE_NOT_FOUND_STALE_SEMANTICS
AUTHORITY_STATUS
CONTRACT_STATUS
SEMANTIC_STATUS
LOCAL_TESTABILITY
PRODUCTIVE_AVAILABILITY
CAPABILITY_SUMMARY_STATUS (derived, optional)
DEPENDENCY_CLASS
AVAILABILITY_EVIDENCE
BLOCKING_EFFECT
PROOF_EVIDENCE
```

Use these distinct classifications:

```text
AUTHORITY_NOT_DEFINED
    no sufficient ADR/SPEC contract defines the required truth

AUTHORITY_DEFINED_BUT_NOT_CONSUMABLE
    compatibility finding label for a capability whose derived summary is
    AUTHORITY_DEFINED, CONTRACT_DEFINED, or CONTRACT_TESTABLE_LOCALLY
```

The proof result is `AUTHORITY_CONSUMABLE` only when
`PRODUCTIVE_AVAILABILITY = YES` and the
authority source, consumer contract, integrated producer, returned data,
version semantics, failures, and availability evidence are all explicit.
Otherwise return `AUTHORITY_CONSUMPTION_GAP`; conceptual existence or local
testability alone is never consumability.

At SPEC-audit time, distinguish normative contract definition from repository
availability. If a local fixture proves the contract but no productive producer
is evidenced, record `CONTRACT_STATUS = DEFINED`,
`LOCAL_TESTABILITY = YES`, and `PRODUCTIVE_AVAILABILITY = NO`, with the derived
summary `CONTRACT_TESTABLE_LOCALLY`; never emit a pending state that a
downstream skill can accidentally promote. If no local testability exists, use
`LOCAL_TESTABILITY = NO` and the derived summary `CONTRACT_DEFINED`. The Gap
Matrix may promote only with a new productive-availability promotion record.

## Producer/consumer proof: `PRODUCER_CONSUMER_CONTRACT_PROOF`

For every inter-component or inter-ticket dependency record:

```text
CAPABILITY_ID
AUTHORITY_OWNER
PRODUCER
PRODUCED_CONTRACT
CONSUMER
CONSUMED_CAPABILITY
SEMANTIC_STATUS
LOCAL_TESTABILITY
PRODUCTIVE_AVAILABILITY
CAPABILITY_SUMMARY_STATUS (derived, optional)
AVAILABILITY_EVIDENCE
AVAILABILITY_CONDITION
DEPENDENCY_CLASS
DEPENDENCY_EDGE
PROOF_EVIDENCE
```

If a capability classified `REQUIRED_FOR_LOCAL_EXECUTION` or
`REQUIRED_FOR_LOCAL_CLOSURE` does not have `PRODUCTIVE_AVAILABILITY = YES` at
the consumer's execution/closure point, classify the consumer as
`BLOCKED_BY_UPSTREAM_CONTRACT`; the consumer is not `EXECUTION_READY`, even if
the contract is locally testable. A capability classified only
`REQUIRED_FOR_INTEGRATED_PROOF` or `INFORMATIONAL` does not block local
execution or closure.

Every handoff must reconcile the upstream record mechanically. A downstream
claim of `AUTHORITY_CONSUMABLE`, `PRODUCTIVE_AVAILABILITY = YES`, or `READY`
without the required `NO_DOWNSTREAM_CAPABILITY_PROMOTION_WITHOUT_NEW_EVIDENCE`
promotion record is an error. The record must include previous status, new
status, promotion evidence, evidence owner, evidence baseline/commit, and
capability ID.

## Temporal authority proof: `TEMPORAL_AUTHORITY_PROOF`

When an operation observes mutable authority and later commits an effect,
record:

```text
INITIAL_OBSERVATION
VERSION_REVISION_HASH_OR_CORRELATION
MUTATION_WINDOW
RELEVANT_COMMIT_POINT
INDEPENDENT_SECOND_OBSERVATION
DRIFT_DETECTION
FAIL_CLOSED_BEHAVIOR
STATE_PRESERVATION
SEMANTIC_VALIDATION_OWNER
CAS_OR_PHYSICAL_INTEGRITY_ROLE
PROOF_EVIDENCE
```

The result is `TEMPORAL_AUTHORITY_PROTECTED` only when the current external
truth is independently revalidated before the effect. Comparing an object with
itself, reusing one snapshot, trusting the caller, reusing a local variable, or
using CAS alone without explicit semantic authority is not revalidation. If
required evidence is absent, return `TEMPORAL_AUTHORITY_GAP`.

## Caller authority and implementation escapes

Ask:

```text
CALLER_AS_AUTHORITY_CHECK
Algum valor fornecido pelo caller está sendo tratado como verdade canônica
quando deveria ser obtido de autoridade externa?
```

If yes, report `CALLER_SUPPLIED_AUTHORITY_BYPASS` as a blocking finding. Apply
this to lifecycle, eligibility, canonical revision, authoritative status,
current basis, ownership, approval state, and domain state.

## Implementation decision simulation

Before `SPEC_IMPLEMENTABILITY_CHECK = PASS`, and again as a defensive handoff
at Gap Matrix and Plan boundaries, simulate the implementation of every critical
requirement without choosing classes, algorithms, or other free technical
details. Record one answer per requirement:

```text
IMPLEMENTER_DECISION_CHECK
CONCRETE_OPERATION
AUTHORITATIVE_SOURCE_FOR_EACH_INPUT
RULE_VALIDATION_OWNER
EXISTING_STATE_LOAD_PATH
CANONICAL_IDENTITY_PROOF_PATH
EXTERNAL_REFERENCE_PROOF_PATH
CAN_UNTRUSTED_OR_DETACHED_PERSISTED_MATERIAL_BE_MATERIALIZED_DIRECTLY_AS_VALID_DOMAIN_STATE?
RECONSTRUCTION_VALIDATOR_OR_RESOLVER_OWNER
STALE_DUPLICATE_UNKNOWN_DETACHED_CORRUPT_REJECTION
STATE_AFTER_FAILURE
REQUIRED_EXTERNAL_CAPABILITIES
AUTHORITY_STATUS
CONTRACT_STATUS
LOCAL_TESTABILITY
PRODUCTIVE_AVAILABILITY
CAPABILITY_SUMMARY_STATUS (derived, optional)
DEPENDENCY_CLASS
```

For reconstruction, when canonical authority or reconstruction validation is
applicable, `CAN_UNTRUSTED_OR_DETACHED_PERSISTED_MATERIAL_BE_MATERIALIZED_DIRECTLY_AS_VALID_DOMAIN_STATE?`
MUST be `NO`, and `RECONSTRUCTION_VALIDATOR_OR_RESOLVER_OWNER` MUST already be
determined. This is a normative sufficiency check, not permission to choose
implementation classes, modules, interfaces, internal patterns, schemas,
algorithms, or mechanisms.

`DEPENDENCY_CLASS` in the record is an already-authorized handoff fact to
verify, not a class that the simulation may invent or select.

The simulation asks only whether the normative path is determined. It MUST fail
with `NO` or `UNKNOWN` when the answer requires any of:

```text
"the implementer may choose"
"probably"
"we assume"
"resolve it in the adapter"
"the fixture is sufficient"
"define during implementation"
```

When a material answer is `NO` or `UNKNOWN`, emit:

```text
SPEC_IMPLEMENTABILITY_CHECK = FAIL
SPEC_IMPLEMENTABILITY_FAILED
```

and classify the smallest root cause as one of:

```text
IDENTITY_AUTHORITY_GAP
RECONSTRUCTION_AUTHORITY_GAP
REHYDRATION_AUTHORITY_GAP
LIFECYCLE_AUTHORITY_GAP
PERSISTENCE_SEMANTICS_GAP
CROSS_SPEC_AUTHORITY_GAP
FAILURE_SEMANTICS_GAP
CONCURRENCY_SEMANTICS_GAP
```

Gap Matrix, Plan, Ticket, Design, and Implementation may report the missing
authority and route remediation; none may complete it or choose classes,
modules, interfaces, internal patterns, schemas, algorithms, or mechanisms of
implementation locally. The simulation verifies normative sufficiency only.

## Mandatory adversarial questions

Ask for every applicable concept:

1. Could a competent implementer, using only accepted ADRs, SPEC, Gap Matrix,
   Plan, and Design, implement it without inventing an architectural,
   normative, or domain decision?
2. Are there two or more semantically different implementations that are both
   plausible under the current text?
3. If yes, is the difference a legitimate unfrozen technical detail, or is it
   missing authority?

`NO` to question 1, or `YES` to question 2 when the difference changes
identity, lifecycle, provenance, reconstruction, persistence meaning,
ownership, recovery, or observable domain behavior, is an authority gap. Do
not resolve it locally.

## Root-cause stage and ownership

Record the smallest artifact that should own each missing decision:

```text
ADR                  architectural/foundational decision
SPEC                 normative domain contract or cross-boundary semantics
GAP_MATRIX            authority-vs-implementation difference
IMPLEMENTATION_PLAN  decomposition, ordering, or proof allocation
IMPLEMENTATION_DESIGN authorized technical structure only
```

Do not promote a gap to ADR automatically. A Plan or Design must never receive
an implementation unit/section whose responsibility is to invent identity,
lifecycle, provenance, ownership, recovery semantics, or missing domain rules.

## Acceptance witness proof

Every Required Behavior and Acceptance Criterion that contains normative
behavior must have an `ACCEPTANCE_WITNESS_MATRIX`. The matrix is the bridge
from normative language to executable evidence; it does not authorize new
semantics.

```text
ACCEPTANCE_WITNESS_MATRIX: REQUIRED
NORMATIVE_BEHAVIOR
NORMATIVE_VERB
CONCRETE_OPERATION_COMMAND_OR_QUERY
STATE_OR_TRANSITION_AFFECTED
DIRECT_POSITIVE_TEST
DIRECT_NEGATIVE_OR_ISOLATION_TEST
EXPECTED_EVIDENCE_FILE
ACCEPTANCE_OWNER
REQUIRED_PRODUCER_OR_CAPABILITY
AUTHORITY_STATUS
CONTRACT_STATUS
LOCAL_TESTABILITY
PRODUCTIVE_AVAILABILITY
CAPABILITY_SUMMARY_STATUS (derived, optional)
DEPENDENCY_CLASS
WITNESS_EXECUTABLE_AT_LOCAL_CLOSURE
EVIDENCE_TYPE
```

An acceptable direct witness executes the operation named by the requirement
and asserts its semantic result, including the relevant rejection or isolation
behavior. Registration/listing does not witness progress; sequential duplicate
execution does not witness concurrency; source inspection does not witness an
architecture guard. A green proxy test is evidence of the proxy only.

Set `WITNESS_EXECUTABLE_AT_LOCAL_CLOSURE = YES` only when the operation,
positive witness, negative witness, and evidence type can execute at the local
closure point. A fixture may be a witness only for behavior classified as
local/contract-level. It cannot witness durable persistence, restart/recovery,
serialization, physical CAS, foreign integration, productive recovery, or an
external effect.

If a required behavior cannot be operationalized from accepted authority,
return:

```text
TICKET_DECOMPOSITION_GATE: BLOCKED
reason = ACCEPTANCE_BEHAVIOR_NOT_OPERATIONALIZED
```

Route the root cause to `PLAN_REVALIDATION_REQUIRED` when the plan's proof
allocation is insufficient, or to `SPECIFICATION_GAP` when the normative
meaning itself is absent. Never invent the missing semantics locally.

The phase owner is distributed narrowly:

```text
TICKET_DECOMPOSITION = complete matrix and operationalization
DESIGN = direct test mapping and required test surfaces
IMPLEMENTATION_PREFLIGHT = enforce matrix completeness before coding
IMPLEMENTATION_AUDIT = independently recalculate direct/proxy coverage
REMEDIATION = preserve and close the matrix; no test-only closure
```

The downstream phases cite the matrix and check for stale, contradictory, or
missing evidence; they do not repeat the full normative audit.

## Findings and blocking

Use these categories exactly for authority gaps:

```text
IDENTITY_AUTHORITY_GAP
REHYDRATION_AUTHORITY_GAP
RECONSTRUCTION_AUTHORITY_GAP
LIFECYCLE_AUTHORITY_GAP
PERSISTENCE_SEMANTICS_GAP
CROSS_SPEC_AUTHORITY_GAP
FAILURE_SEMANTICS_GAP
CONCURRENCY_SEMANTICS_GAP
AUTHORITY_CONSUMPTION_GAP
TEMPORAL_AUTHORITY_GAP
AUTHORITY_NOT_DEFINED
AUTHORITY_DEFINED_BUT_NOT_CONSUMABLE
BLOCKED_BY_UPSTREAM_CONTRACT
CALLER_SUPPLIED_AUTHORITY_BYPASS
```

They are blocking findings when applicable. Use evidence-based severity and
the local skill's finding ID format. A downstream artifact must not disguise
one as an ordinary implementation gap.

## Mechanical contradiction invariants

Every producer and independent auditor MUST evaluate these invariants. Any
violation is a gate failure, not an informational finding:

```text
capability with class REQUIRED_FOR_LOCAL_EXECUTION or REQUIRED_FOR_LOCAL_CLOSURE
AND PRODUCTIVE_AVAILABILITY = NO
AND STATUS = READY
    => ERROR

BLOCKED_BY_UPSTREAM_AUTHORITY
AND STATUS = READY
    => ERROR

BLOCKED_BY_UPSTREAM_CONTRACT
AND STATUS = READY
    => ERROR

LOCAL_CLOSURE = YES
AND a capability with class REQUIRED_FOR_LOCAL_CLOSURE
    has PRODUCTIVE_AVAILABILITY = NO
    => ERROR

LOCAL_TESTABILITY = YES
AND PRODUCTIVE_AVAILABILITY = NO
AND proof claims AUTHORITY_CONSUMABLE
    => ERROR

FINAL_PROOF_OWNER = downstream
AND local AC requires the same missing capability
    => ERROR

UPSTREAM PRODUCTIVE_AVAILABILITY = NO
AND downstream claims PRODUCTIVE_AVAILABILITY = YES
AND no complete productive-availability promotion record exists
    => ERROR: NO_DOWNSTREAM_CAPABILITY_PROMOTION_WITHOUT_NEW_EVIDENCE

WITNESS_EXECUTABLE_AT_LOCAL_CLOSURE = NO
AND ticket claims TICKET_LOCAL_CLOSURE = YES
    => ERROR

parts of one unit have incompatible authority/contract status, local
testability, productive availability, dependency classes, external blockers,
cross-SPEC prerequisites, closure conditions, or completion-evidence timing
AND SHARED_CLOSURE_BOUNDARY != YES
    => ERROR: FALSE_UNIT_MERGE
```

## Phase ownership and defense in depth

```text
SPEC generation       materialize proofs from accepted authority; stop if absent
SPEC audit             owner of complete proofs and SPEC_IMPLEMENTABILITY_CHECK
Gap Matrix generation  classify missing consumption/productive contracts; require SPEC result
Gap Matrix audit       verify classifications and contract evidence; block on authority gaps
Plan generation       run IMPLEMENTATION_UNIT_AUTHORITY_CHECK, dependency classes,
                      and FALSE_UNIT_MERGE checks per unit
Plan audit             independently confirm producers, consumers, sequencing, availability
Ticket decomposition   preserve contract edges and derive READY only from actual availability
Ticket audit           verify READY claims and upstream contract availability
Design generation      require UPSTREAM_AUTHORITY_PRECONDITIONS; design consumption seams
Design audit           verify temporal proof and report caller/authority escapes
Implementation audit    final defense for bypasses, self-comparison, stale reuse, local authority
```

The full authority audit should not be duplicated downstream. Downstream
confirmation must cite the upstream proof IDs, revision, and audit artifact,
then inspect only for stale, contradictory, missing, or newly exposed evidence.

## Required outcomes

The SPEC authority gate emits:

```text
SPEC_IMPLEMENTABILITY_CHECK = PASS | FAIL | BLOCKED
```

When the authority-first implementability question is `NO`, also record
`SPEC_IMPLEMENTABILITY_FAILED` as the blocking audit result.

The Gap Matrix cannot proceed on `FAIL` or `BLOCKED` and must emit:

```text
GAP_MATRIX_BLOCKED_BY_SPEC_AUTHORITY_GAP
```

The Plan and Design cannot be approved when any applicable authority gate is
incomplete. They must identify the upstream artifact and root-cause stage,
without creating a compensating implementation task or local design decision.

Readiness is allowed only when decisions and productive contracts are both
available:

```text
READY
BLOCKED_BY_UPSTREAM_AUTHORITY
BLOCKED_BY_UPSTREAM_CONTRACT
```

Use `BLOCKED_BY_UPSTREAM_AUTHORITY` for `AUTHORITY_STATUS = UNDEFINED` and
`BLOCKED_BY_UPSTREAM_CONTRACT` for `CONTRACT_STATUS = UNDEFINED` after authority
exists, or for an unavailable producer when the dependency class is
`REQUIRED_FOR_LOCAL_EXECUTION` or `REQUIRED_FOR_LOCAL_CLOSURE`. Do not collapse
the two conditions, and do not block local work for dependencies classified only
`REQUIRED_FOR_INTEGRATED_PROOF` or `INFORMATIONAL`.

The canonical execution result is derived, never copied:

```text
EXECUTION_READY = TRUE
    => STATUS: READY / INITIAL_DAG_STATE: READY is permitted

EXECUTION_READY = FALSE
    => STATUS: BLOCKED or the upstream stage must stop before ticket creation
```

`LOCAL_CLOSURE = YES` and `TICKET_LOCAL_CLOSURE = YES` require all local
acceptance witnesses to be executable now, including durable, recovery,
concurrency, physical-CAS, foreign-integration, and external-effect witnesses
when those evidence types are required. A future checkpoint is not local
closure.

Every relevant proof must answer, separately:

```text
WHO_OWNS_THE_TRUTH?
HOW_DOES_THIS_COMPONENT_LEGITIMATELY_ACCESS_THAT_TRUTH?
HOW_IS_CURRENT_TRUTH_REVALIDATED_BEFORE_COMMITTING_THE_EFFECT?
```

If one answer is absent, block at the earliest owning phase.
