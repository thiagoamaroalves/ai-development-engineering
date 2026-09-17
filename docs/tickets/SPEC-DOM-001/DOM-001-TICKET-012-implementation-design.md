# DOM-001-TICKET-012 — Implementation Design

## 1. Design Verdict

```text
IMPLEMENTATION_DESIGN_READY
```

## 2. Ticket

```text
Ticket ID: DOM-001-TICKET-012
Ticket path: docs/tickets/SPEC-DOM-001/DOM-001-TICKET-012-final-conformance-evaluator.md
Implementation Unit: DOM-IMP-12
Portfolio Obligations: O-052
Requirements: DOM-AUDIT-004
Gap IDs: GAP-020
Acceptance IDs: AC-DOM-052
Status at design entry: READY
Initial DAG state: BLOCKED (preserved)
Current DAG state: READY
```

The ticket is locally executable because T001–T011 are complete. Foreign
producer capabilities remain integrated-only and are not promoted by this
 design. The design implements the local evaluator contract and preserves the
CP-DOM-04 integrated proof boundary.

## 3. Implementation Responsibility

DOM-IMP-12 evaluates an exact artifact/cycle/implementation evidence bundle
across the seven named final-conformance dimensions and returns one immutable,
structured DOM-owned result that is either `CONFORMANT` or
`REMEDIATION_REQUIRED`, never treating omission, extrapolation, process
termination, or stale evidence as approval.

## 4. Repository Architecture Context

The repository has a productive TypeScript domain/application slice under
`src/` and executable tests under `tests/`. Domain modules own immutable value
semantics, aggregate behavior, validation, lifecycle decisions, and semantic
failure codes. Application modules own command handling, authority reads,
compare-and-set orchestration, and mapping at explicit ports. There is no
productive infrastructure, database, HTTP, Git, scheduler, or foreign adapter
implementation in this repository.

T012 therefore adds a local DOM contract boundary only:

```text
DOM domain aggregate/value objects
        ↑
DOM application command handler
        ↑
FinalConformanceEvidenceReader / FinalConformanceRepository ports
        ↑
local contract fixtures now; PLAT/GIT/EXEC/BACKEND/OPS/UI producers at CP-DOM-04
```

The evaluator is a semantic consumer. It does not produce contributor evidence,
execute audits, run Git, persist physical journal records, publish, project UI
state, or become a specification-level approval authority. A local fixture
proves the evaluator contract only; it does not prove the integrated foreign
producer.

## 5. Existing Repository Context

| Existing Component | Classification | Current Responsibility | Design Use |
| --- | --- | --- | --- |
| `src/domain/identity.ts` | REUSE | Canonical identity references, kinds, scopes, revisions, and immutable records | Use `CanonicalIdentityReference` for ARTIFACT and ARTIFACT_CYCLE; do not add a conformance identity kind |
| `src/domain/audit-cycle.ts` | INTEGRATE / DO_NOT_TOUCH | Artifact-cycle identity, rounds, structured audit verdict, accepted-history rehydration | Consume cycle identity semantics; do not reopen or duplicate the T008 lifecycle |
| `src/application/audit-cycle.ts` | DO_NOT_TOUCH | Audit-cycle commands and EXEC evidence mapping | T012 consumes an exact cycle reference, not the T008 command handler |
| `src/domain/publication.ts` | REUSE | Candidate basis and exact base/head/tree/conformance-run value semantics | Reuse only if evidence fixtures carry candidate-bound publication evidence; no Git execution |
| `src/domain/ticket.ts` | REUSE AS EVIDENCE CONTRACT | Canonical ticket identity and immutable transition evidence | Contributor evidence may identify completed ticket material; T012 never changes tickets |
| `src/domain/round-continuation.ts` | REUSE AS EVIDENCE CONTRACT | Round and continuation identity semantics | Contributor round evidence remains foreign/input data, not T012-owned scheduling |
| `src/domain/normative-change.ts` | REUSE AS EVIDENCE CONTRACT | Adjustment, approval invalidation, and preserved terminal ticket references | Normative-change evidence is consumed as evidence only |
| `src/domain/candidate-evidence.ts` | REUSE AS EVIDENCE CONTRACT | Exact candidate/evidence hash binding and independent observations | Candidate evidence can be represented at the input seam without reimplementing its gate |
| `prototype/src/mockDomain.ts` | DO_NOT_TOUCH | In-memory scenario/UI simulation | Test inspiration only; never imported or promoted |
| `tests/dom-001-ticket-008.test.ts`, `tests/dom-001-ticket-009.test.ts`, `tests/dom-001-ticket-010.test.ts`, `tests/dom-001-ticket-011.test.ts` | REUSE AS REGRESSION CONTEXT | Prior cycle, round, invalidation, and evidence witness patterns | Preserve patterns for immutable snapshots, stale rejection, exact retry, and independent rereads |

## 6. Domain Model Assessment

### Domain concepts

- `FinalConformanceEvaluation`: the DOM-owned aggregate root representing one
  terminal evaluation result for one exact artifact/cycle/implementation basis.
- `FinalConformanceScope`: immutable value object binding canonical artifact
  reference, artifact revision, artifact-cycle reference, implementation
  revision, exact candidate basis, and evaluator contract version.
- `FinalConformanceEvidenceBundle`: immutable value object containing the exact
  scope, seven dimension evidence items, and an observation identity.
- `FinalConformanceEvidenceItem`: immutable value object containing one named
  dimension, `PROVEN` or `FAILED` outcome, evidence identity, content hash, and
  exact scope binding.
- `FinalConformanceFinding`: immutable value object describing an omitted,
  extrapolated, duplicated, or failed dimension with structured category and
  reason.
- `FinalConformanceRevision`: immutable non-negative persistence/CAS revision
  for one evaluation record.

The seven canonical dimensions are exactly:

```text
ADHERENCE
COVERAGE
INTEGRATION
REGRESSIONS
TESTS
OMISSIONS
EXTRAPOLATIONS
```

A `PROVEN` result for `OMISSIONS` or `EXTRAPOLATIONS` means that the evaluator
found no omission or extrapolation. A missing dimension, unknown extra
 dimension, duplicate dimension, or `FAILED` item yields a structured finding.
No-findings is not inferred from an absent bundle.

### Aggregate and behavior placement

`FinalConformanceEvaluation` owns the semantic derivation of the final result
and findings. It accepts a validated evidence bundle and computes the result
without application-level business conditionals. The application handler only
loads canonical observations, verifies the mutation window, invokes the
aggregate, and commits it through a CAS port.

No separate generic domain service, event bus, projection, or factory hierarchy
is justified. Evidence production remains outside this aggregate.

### Domain failure codes

The local command boundary uses precise T012 codes:

```text
INVALID_FINAL_CONFORMANCE_EVIDENCE
FINAL_CONFORMANCE_SCOPE_MISMATCH
FINAL_CONFORMANCE_EVIDENCE_DRIFT
FINAL_CONFORMANCE_STALE
FINAL_CONFORMANCE_NOT_FOUND
FINAL_CONFORMANCE_CONFLICT
FINAL_CONFORMANCE_RECONSTRUCTION_AUTHORITY_REQUIRED
```

These are application/domain transport codes for the evaluator contract. They
do not replace the five broader DOM failure families defined by the SPEC; the
foreign mapping layer retains the canonical family meaning.

## 7. UPSTREAM_AUTHORITY_PRECONDITIONS

The authority-first implementation simulation is complete. No normative
meaning, identity, lifecycle, persistence, or ownership decision is deferred to
implementation.

| Required proof | Authority / revision | Proof and implementation consequence | Gate |
| --- | --- | --- | --- |
| Identity | SPEC-DOM-001 revision 4 §12.2; `ACP-DOM-12`; `ADR-0009` revision 3 | Artifact uses canonical ARTIFACT reference; cycle uses canonical ARTIFACT_CYCLE reference; implementation revision, candidate basis, and evaluator version are bound values, not identity aliases. No new CONFORMANCE identity kind is introduced. | COMPLETE |
| Lifecycle | `ADR-0009` revision 3; SPEC §§12.2, 21–22; `DOM-AUDIT-004` | One evaluation is terminally recorded as CONFORMANT or REMEDIATION_REQUIRED for the exact cycle/basis. A new evaluation is not silently written over a different existing result. | COMPLETE |
| Persistence / recovery | `ADR-0006` revision 3; SPEC §16 and authority-completeness persistence matrix; `PCP-ALL-01` | T012 defines immutable snapshot and repository CAS/recovery ports. PLAT owns journal, physical durability, and recovery mechanics. | COMPLETE for local contract; integrated physical proof deferred |
| Rehydration | SPEC authority-completeness proof for `Audit cycle / round` and T012 §14c; `AGGREGATE_RECONSTRUCTION_PROOF` | Rehydration requires accepted exact snapshot authority, exact scope, immutable evidence, result/finding derivation, and no detached materialization. | COMPLETE |
| Concurrency | `ADR-0006` revision 3; SPEC §16; existing T006–T011 CAS patterns | Repository `commit(proposed, expectedRevision)` is the physical atomic seam; stale/conflict results cause no local overwrite. Domain result semantics remain in the aggregate. | COMPLETE |
| Idempotency | `ADR-0006` revision 3; T012 §18; existing T008/T009/T010/T011 retry contracts | Exact same scope/evidence replay returns the accepted immutable evaluation as a duplicate; a different evidence basis for the same cycle is rejected as conflict. | COMPLETE |
| Ownership | SPEC §2, §19–20; T012 §§3, 10, 17 | DOM owns final conformance meaning; contributor and foreign owners produce evidence; T012 consumes evidence and never executes or recomputes foreign lifecycle. | COMPLETE |
| Cross-SPEC dependencies | `ACP-DOM-12`, `PCP-ALL-01`, T012 §§14a–14b | EXEC, PLAT, GIT, BACKEND, OPS, and UI evidence remains foreign. Their capabilities are `DEFINED`, locally contract-testable through typed fixtures, `PRODUCTIVE_AVAILABILITY = NO`, class `REQUIRED_FOR_INTEGRATED_PROOF`, and do not block local closure. | COMPLETE with integrated follow-up |

### Required authority records

```text
SPEC_IMPLEMENTABILITY_CHECK = PASS
AGGREGATE_IDENTITY_PROOF = COMPLETE; SPEC-DOM-001 §12.2, ACP-DOM-12
AGGREGATE_RECONSTRUCTION_PROOF = COMPLETE; SPEC-DOM-001 authority-completeness matrix, T012 §14c
AUTHORITY_CONSUMPTION_PROOF = COMPLETE; ACP-DOM-12
PRODUCER_CONSUMER_CONTRACT_PROOF = COMPLETE; PCP-ALL-01
TEMPORAL_AUTHORITY_PROOF = COMPLETE; T012 §14c, TAP-12
CALLER_AS_AUTHORITY_CHECK = PASS; caller bundle is only a requested basis and must match two canonical reader observations
PROHIBITED_NORMATIVE_DECISIONS = 0
IDENTITY_AUTHORITY_GAPS = 0
RECONSTRUCTION_AUTHORITY_GAPS = 0
LIFECYCLE_AUTHORITY_GAPS = 0
PERSISTENCE_SEMANTICS_GAPS = 0
CROSS_SPEC_AUTHORITY_GAPS = 0
```

The local evidence reader is the canonical consumption seam for the evaluator.
The handler never evaluates a caller bundle unless its scope/evidence matches
the authoritative first observation and an independently identified second
observation.

## 8. Aggregate / Consistency Boundaries

| Aggregate | Root | Invariants | Transaction / Consistency Boundary | External References |
| --- | --- | --- | --- | --- |
| Final conformance evaluation | `FinalConformanceEvaluation` keyed by canonical ARTIFACT_CYCLE reference and exact scope | Seven dimensions are evaluated; every required dimension is present exactly once; unknown/duplicate dimensions, failed evidence, scope drift, and detached material cannot yield CONFORMANT; result/findings are immutable; exact replay is idempotent | One domain evaluation plus one repository CAS commit for a cycle/basis; no second evaluation may overwrite a different accepted result | Canonical ARTIFACT and ARTIFACT_CYCLE references, artifact/implementation revision tokens, evidence IDs/hashes, candidate/producer references |

The aggregate owns semantic evaluation and result immutability. The evidence
reader owns current observation access, and the repository owns physical CAS and
storage. Neither external port may bypass the aggregate by writing a result
from a raw projection.

## 9. Responsibility Decomposition

| Responsibility | Authority | State Owned | Expected Test Surface |
| --- | --- | --- | --- |
| Exact scope binding | SPEC §12.2 and T012 AC-DOM-052 | Artifact/cycle/implementation references | Domain value-object tests; wrong-kind and mismatched-scope negatives |
| Evidence item validation | T012 §14c and `DOM-AUDIT-004` | Dimension, outcome, evidence ID/hash, item scope | Domain invariant and negative tests |
| Seven-dimension completeness analysis | T012 AC-DOM-052 | Derived missing/duplicate/extrapolated/failed classification | Domain evaluator tests for complete and incomplete bundles |
| Structured finding creation | T012 §9 and §16; ADR-0009 | Immutable finding category, dimension, evidence references, reason | Domain result tests for remediation findings |
| Canonical authority consumption | `ACP-DOM-12`, `PCP-ALL-01`, `TAP-12` | First/second evidence observations | Application tests for caller bypass and drift |
| Exact-cycle persistence/CAS | ADR-0006; repository contract | Evaluation revision and accepted snapshot | Repository fixture tests for stale, duplicate, and one-winner concurrency |
| Foreign evidence translation | `PCP-ALL-01` | Local typed evidence contract only | ACL/architecture tests; no foreign lifecycle implementation |

`RESPONSIBILITY_MIXING_RISK = LOW`. Domain evaluation, application authority
orchestration, and physical persistence remain separate.

## 10. Proposed Components

| Component | Type | Responsibility | Existing/New | Expected Location | Size |
| --- | --- | --- | --- | --- | --- |
| `FinalConformanceEvaluation` | AGGREGATE_ROOT | Derive and freeze the exact final result and structured findings | New | `src/domain/final-conformance.ts` | MEDIUM |
| `FinalConformanceScope` | VALUE_OBJECT | Validate and compare canonical artifact/cycle, revision, candidate basis, and evaluator version binding | New | `src/domain/final-conformance.ts` | SMALL |
| `FinalConformanceRevision` | VALUE_OBJECT | Validate and compare the evaluation persistence/CAS revision | New | `src/domain/final-conformance.ts` | SMALL |
| `FinalConformanceEvidenceItem` | VALUE_OBJECT | Freeze one dimension's evidence and exact scope binding | New | `src/domain/final-conformance.ts` | SMALL |
| `FinalConformanceEvidenceBundle` | VALUE_OBJECT | Freeze one evidence observation and its exact item set | New | `src/domain/final-conformance.ts` | MEDIUM |
| `FinalConformanceFinding` | VALUE_OBJECT | Represent one deterministic structured failure finding | New | `src/domain/final-conformance.ts` | SMALL |
| `FinalConformanceEvidenceReader` | PORT | Supply current authoritative evidence observations | New | `src/domain/final-conformance.ts` | SMALL |
| `FinalConformanceRepository` | PORT | Find, CAS-commit, and recover accepted evaluation snapshots | New | `src/domain/final-conformance.ts` | SMALL |
| `FinalConformanceHandler` | COMMAND_HANDLER | Match caller request to two canonical observations, invoke aggregate, and commit | New | `src/application/final-conformance.ts` | MEDIUM |

### Component ownership details

`FinalConformanceEvaluation`:

```text
OWNS: result derivation, dimension completeness, finding semantics, immutable evaluation snapshot, exact replay comparison
COLLABORATES_WITH: FinalConformanceEvidenceBundle, FinalConformanceRepository through the application handler
MUST_NOT_OWN: evidence production, audit execution, foreign lifecycle, physical persistence, Git/EXEC/PLAT effects, transport projection
```

`FinalConformanceScope`:

```text
OWNS: canonical kind validation and exact artifact/cycle/revision/candidate/version equality
COLLABORATES_WITH: CanonicalIdentityReference, CandidateBasis, and the evidence/evaluation aggregate
MUST_NOT_OWN: artifact lifecycle, cycle lifecycle, evidence truth, or repository lookup
```

`FinalConformanceRevision`:

```text
OWNS: non-negative aggregate revision equality and increment semantics
COLLABORATES_WITH: FinalConformanceEvaluation and FinalConformanceRepository
MUST_NOT_OWN: domain lifecycle or physical transaction decisions
```

`FinalConformanceEvidenceItem`:

```text
OWNS: one dimension's exact evidence identity/hash/outcome and scope binding
COLLABORATES_WITH: FinalConformanceEvidenceBundle and FinalConformanceEvaluation
MUST_NOT_OWN: completeness policy, foreign evidence production, or persistence
```

`FinalConformanceEvidenceBundle`:

```text
OWNS: immutable item collection, observation identity, item-to-scope attachment, exact evidence equality
COLLABORATES_WITH: FinalConformanceScope and FinalConformanceEvaluation
MUST_NOT_OWN: deciding foreign evidence truth, persisting itself, or approving the result
```

`FinalConformanceFinding`:

```text
OWNS: structured category/dimension/reason/evidence references
COLLABORATES_WITH: FinalConformanceEvaluation
MUST_NOT_OWN: remediation execution, ticket mutation, or process status
```

`FinalConformanceEvidenceReader`:

```text
OWNS: no domain state; defines the authoritative observation query seam
COLLABORATES_WITH: application handler and an approved producer/fixture
MUST_NOT_OWN: result evaluation, caller fallback, default evidence, or persistence
```

`FinalConformanceRepository`:

```text
OWNS: lookup and physical atomic commit contract
COLLABORATES_WITH: application handler and PLAT implementation at integration
MUST_NOT_OWN: dimension meaning, finding creation, lifecycle decisions, or caller authority
```

`FinalConformanceHandler`:

```text
OWNS: command orchestration, authority matching, temporal revalidation, failure mapping
COLLABORATES_WITH: reader, aggregate, repository
MUST_NOT_OWN: canonical evidence truth, domain result rules, foreign execution, or projection state
```

## 11. SOLID Assessment

| Component | SRP | OCP | LSP | ISP | DIP | Result |
| --- | --- | --- | --- | --- | --- | --- |
| `FinalConformanceEvaluation` | one reason: conformance semantics change | no speculative extension point; fixed normative dimensions | NOT_APPLICABLE | NOT_APPLICABLE | domain-only inputs | PASS |
| `FinalConformanceEvidenceBundle` | one reason: evidence-bundle validation/equality changes | fixed contract, no hypothetical plugins | NOT_APPLICABLE | NOT_APPLICABLE | domain-only inputs | PASS |
| `FinalConformanceEvidenceReader` | one authority-read capability | real producer/fixture boundary | implementations return the same observation semantics | cohesive single read capability | application depends on port | PASS |
| `FinalConformanceRepository` | one persistence/CAS capability | no storage strategy hierarchy | implementations preserve result variants | find/commit are one cohesive aggregate boundary | domain/application depend on port | PASS |
| `FinalConformanceHandler` | one reason: evaluator command orchestration changes | no policy plug-ins | NOT_APPLICABLE | depends only on needed reader/repository methods | injected ports | PASS |

```text
SRP_VIOLATIONS = 0
OCP_VIOLATIONS = 0
LSP_VIOLATIONS = 0
ISP_VIOLATIONS = 0
DIP_VIOLATIONS = 0
UNJUSTIFIED_SOLID_VIOLATIONS = 0
```

No generic `EvaluatorService`, `Manager`, `Processor`, `Factory`, event bus, or
provider hierarchy is introduced.

## 12. Dependency Direction

```text
CanonicalIdentityReference / domain value contracts
        ↓
FinalConformanceScope / EvidenceBundle / Finding
        ↓
FinalConformanceEvaluation
        ↑
FinalConformanceHandler → FinalConformanceEvidenceReader port
                         → FinalConformanceRepository port
        ↑
PLAT/GIT/EXEC/BACKEND/OPS/UI adapters and test fixtures
```

The arrows represent dependency direction toward stable domain contracts. The
domain imports only `src/domain/identity.ts` and other domain value contracts;
it does not import filesystem, HTTP, Git SDK, database, serializer, prototype,
or test code. The application handler imports domain contracts only.

```text
DEPENDENCY_DIRECTION_VIOLATIONS = 0
INFRASTRUCTURE_LEAKAGE_POINTS = 0
```

## 13. Invariant Placement

| Invariant | Domain Enforcement | Durable Protection | Application Guard | Test |
| --- | --- | --- | --- | --- |
| Artifact reference must be ARTIFACT and cycle reference ARTIFACT_CYCLE | `FinalConformanceScope` | Repository key preserves canonical cycle reference | Normalize before lookup | T12-AC3 wrong-kind/scope test |
| Artifact/cycle/implementation/candidate/version basis is exact | `FinalConformanceScope` | Persisted snapshot retains the full exact basis | Canonical reader scope is checked | T12-AC3 exact-linkage test |
| Evidence item scope must equal bundle scope | `FinalConformanceEvidenceBundle` | Persisted snapshot retains every bound scope | Canonical reader scope is checked | T12-AC1/T12-AC3 scope tests |
| Exactly seven known dimensions are required for CONFORMANT | `FinalConformanceEvaluation` | Accepted snapshot stores all items/findings | Handler never substitutes missing/default evidence | T12-AC1 complete/omission/extrapolation tests |
| Unknown or duplicated dimension cannot pass | `FinalConformanceEvaluation` | Snapshot preserves structured finding | Bundle is evaluated only through aggregate | T12-AC1 negative test |
| Every failed dimension produces a structured finding | `FinalConformanceEvaluation` | Findings are stored with evidence references | Handler returns accepted remediation result | T12-AC2 failure-result test |
| Process termination/empty evidence cannot pass | `FinalConformanceEvaluation` plus explicit reader absence failure | No accepted conformant snapshot without complete evidence | Missing source result is rejection; empty bundle is remediation | T12-AC2 termination/empty test |
| First caller basis must equal canonical observation | Evidence bundle equality plus handler | Accepted snapshot records canonical evidence | Handler rejects mismatched caller bundle before commit | T12-AC1 authority-bypass test |
| Second observation must be independent and exact | Handler and `FinalConformanceEvidenceBundle` equality | Commit stores second accepted basis | Independent observation ID and exact content comparison | T12-AC3 drift test |
| Evaluation revision uses CAS; stale/conflict does not overwrite | Repository physical contract | PLAT owns durable atomicity at integration | Expected revision checked before and during commit | T12-AC3 concurrency/stale test |
| Exact replay is idempotent; different basis cannot overwrite cycle result | Aggregate exact equality and handler | Repository duplicate response preserves accepted result | Existing result compared before commit | T12-AC3 replay test |

```text
UNPLACED_DOMAIN_INVARIANTS = 0
DOMAIN_RULE_DUPLICATION = 0
```

## 14. Persistence Design

### Aggregate storage boundary

`FinalConformanceEvaluation` is stored by the canonical ARTIFACT_CYCLE key and
contains its complete immutable `FinalConformanceScope` (including candidate
base/head/tree and evaluator version), evidence bundle, result, findings, and
aggregate revision. No current-state-only projection is sufficient.

### Repository / port boundary

```ts
find(cycle: CanonicalIdentityReference): FinalConformanceEvaluation | undefined
commit(
  evaluation: FinalConformanceEvaluation,
  expectedRevision: FinalConformanceRevision,
): Promise<
  | { status: 'ADVANCED'; evaluation: FinalConformanceEvaluation }
  | { status: 'STALE'; existing?: FinalConformanceEvaluation }
  | { status: 'DUPLICATE'; existing: FinalConformanceEvaluation }
>
```

The local fixture implements this contract in tests. A PLAT adapter, journal,
serialization, transaction and restart implementation are outside T012.

### Serialization / recovery

`toSnapshot()` returns an immutable plain record containing canonical identity
references, revisions, observation IDs, all evidence fields, result, findings,
and aggregate revision. `rehydrate(snapshot, authority)` requires a
`FinalConformanceReconstructionAuthority` that returns the accepted snapshot
for the cycle. It validates the full snapshot and independently derives the
expected result/findings from the evidence before materializing the aggregate.
Unknown, detached, corrupt, inconsistent, or forged material throws a typed
reconstruction error and mutates nothing.

### Concurrency / atomicity

The application checks the current aggregate revision before evaluation and the
repository performs the final expected-revision CAS. Equivalent concurrent
proposals produce one `ADVANCED` result and one exact `DUPLICATE`; conflicting
proposals produce a stale/conflict rejection. No last-write-wins path exists.

### Durable invariant and registry relationship

The repository key is an index for the ArtifactCycle reference, not a new
semantic identity. PLAT must preserve append-only evidence and physical
integrity at CP-DOM-04. T012 does not add a database schema, migration, journal,
or outbox.

```text
AGGREGATE_STORAGE_BOUNDARY = FinalConformanceEvaluation per ArtifactCycle
SERIALIZATION_BOUNDARY = FinalConformanceSnapshot
CONCURRENCY_REVISION_MECHANISM = FinalConformanceRevision + repository CAS
ATOMICITY_BOUNDARY = repository commit
REGISTRY_INDEX_RELATIONSHIP = cycle canonical key → one accepted evaluation
DURABLE_INVARIANT_PROTECTION = PLAT at integrated checkpoint; semantic rules in DOM
INTEGRITY_VALIDATION = domain snapshot equality plus producer/PLAT physical integrity
RECOVERY_BEHAVIOR = accepted-authority rehydration; fail closed on invalid material
ARCHIVAL_BEHAVIOR = NOT_APPLICABLE locally; historical result remains immutable evidence
```

## 15. Lifecycle Design

### States

```text
EVALUATION_RESULT = CONFORMANT | REMEDIATION_REQUIRED
```

These are result states, not a new global workflow state machine. The
`FinalConformanceEvaluation` is terminal for its exact artifact/cycle/basis.
A remediation outcome returns a structured result to the owning workflow; it
does not itself execute remediation or reopen a ticket.

### Transitions and guards

```text
ABSENT → CONFORMANT
ABSENT → REMEDIATION_REQUIRED
CONFORMANT → same exact replay only
REMEDIATION_REQUIRED → same exact replay only
```

A different evidence basis for the same exact cycle is rejected as
`FINAL_CONFORMANCE_CONFLICT`; a new conformance cycle/basis is required by the
owning workflow. No setter or generic state mutation is exposed.

### Lifecycle ownership

`FinalConformanceEvaluation.evaluate` owns result derivation. The handler owns
command orchestration and the repository owns CAS. Process termination is not a
transition. Missing source evidence is a rejected command; an empty but
well-formed bundle is an accepted `REMEDIATION_REQUIRED` result with an
`OMITTED_DIMENSION`/completeness finding.

```text
VALID_TRANSITIONS = first exact evaluation to CONFORMANT or REMEDIATION_REQUIRED; exact replay
INVALID_TRANSITIONS = overwrite, different basis, detached scope, implicit approval, termination-as-pass
RECOVERY_TRANSITIONS = accepted snapshot rehydrate only
TERMINAL_TRANSITIONS = result accepted; no different result overwrite
FORBIDDEN_BYPASS_PATHS = public setters, direct result constructors, caller-only evidence, projection writes, repository semantic decisions
PERSISTENCE_GUARD = expected-revision CAS plus exact accepted snapshot authority
```

## 16. Cross-Spec Integration

| Foreign Owner | Contract | Local Integration Point | ACL | Forbidden Local Ownership |
| --- | --- | --- | --- | --- |
| `SPEC-EXEC-001/002` | exact skill/contract, session/activity, and contributor audit evidence | `FinalConformanceEvidenceReader` observation items | Typed local evidence item mapping | session, assignment, scheduling, or audit execution lifecycle |
| `SPEC-PLAT-001` | durable evidence, journal, recovery, physical integrity, and persistence revision | `FinalConformanceRepository` and evidence reader at CP-DOM-04 | Snapshot/record mapper that preserves IDs, hashes, revisions, and failures | database, journal, outbox, retry, physical recovery, or semantic verdict |
| `SPEC-GIT-001` | candidate/publication/integration/remote evidence | evidence item fields and reader | Candidate-bound evidence mapping; reuse `CandidateBasis` semantics where applicable | Git execution, merge, push, remote observation, or publication state |
| `SPEC-BACKEND-001` | command/result transport mapping | application outcome mapper at a later consumer boundary | Result mapping preserves `CONFORMANT`, `REMEDIATION_REQUIRED`, findings, identity, and failure code | HTTP/auth/transport authority or result reinterpretation |
| `SPEC-OPS-001` | correlation and hash-linked operational projection | evidence IDs/hashes and output snapshot | Projection mapping only | report approval, operational state, or conformance recomputation |
| `SPEC-UI-001` | request/read presentation | no productive dependency; downstream mapping consumes outcome | UI adapter only | UI confirmation, missing-evidence default, or fabricated result |

For every row:

```text
AUTHORITY_CONSUMPTION_PROOF = ACP-DOM-12; DOM consumes producer-owned evidence by exact identity/revision/cycle/hash relation
PRODUCER_CONSUMER_CONTRACT_PROOF = PCP-ALL-01; each named producer supplies the mapped evidence contract; DOM is the semantic consumer
SEMANTIC_STATUS = DEFINED
AUTHORITY_STATUS = DEFINED
CONTRACT_STATUS = DEFINED
LOCAL_TESTABILITY = YES through deterministic typed contract fixtures
PRODUCTIVE_AVAILABILITY = NO for foreign producers
DEPENDENCY_CLASS = REQUIRED_FOR_INTEGRATED_PROOF
AVAILABILITY_EVIDENCE = T012 ticket §14a–14b and Plan §12.1; no productive foreign adapter in repository
BLOCKING_EFFECT = no local execution/closure block; integrated CP-DOM-04 proof remains pending
```

No foreign capability is promoted. `NO_DOWNSTREAM_CAPABILITY_PROMOTION_WITHOUT_NEW_EVIDENCE = TRUE`.

## 17. Main Interaction Flow

1. `FinalConformanceHandler` normalizes the caller's requested evidence bundle
   and validates its canonical scope.
2. It loads any existing evaluation by the exact ArtifactCycle reference and
   rejects an obsolete expected revision before doing work.
3. It asks `FinalConformanceEvidenceReader` for the first canonical observation.
   Missing source evidence fails closed; caller evidence is only a requested
   basis and cannot become authority.
4. It compares caller scope/items to the first canonical observation, then asks
   for a second observation.
5. It requires a distinct observation ID and exact scope/item/hash equality. Any
   drift or source disappearance is rejected without repository mutation.
6. For a first evaluation, it invokes `FinalConformanceEvaluation.evaluate`
   on the second canonical bundle. The aggregate derives all seven dimensions
   and immutable findings.
7. The handler commits using the expected aggregate revision. Repository stale
   or conflicting results are mapped without overwrite.
8. Exact replay returns the accepted immutable result with `duplicate: true`.
   The returned result preserves artifact, cycle, implementation revision,
   candidate base/head/tree, evaluator version, evidence hashes, and structured
   conformance state.

## 18. Failure / Recovery Flow

| Failure point | Detection | Durable evidence | Failure owner | Retry owner | Idempotency boundary | Recovery / reconciliation |
| --- | --- | --- | --- | --- | --- | --- |
| Invalid identity/scope/item | Domain value-object validation | none; no commit | DOM domain | caller/workflow | no state created | correct command; no mutation |
| Caller evidence differs from canonical first observation | exact scope/item/hash comparison | none; no commit | DOM application boundary | caller/workflow | no state created | refresh authoritative evidence |
| Evidence changes between observations | distinct observation IDs plus exact bundle comparison | prior accepted state preserved | DOM temporal guard; producer owns source truth | owning workflow | no state created | obtain a new exact cycle/basis; do not reuse stale evidence |
| Source unavailable/not found | reader returns `undefined` | no false result | producer boundary / DOM fail-closed mapping | integration workflow | no state created | wait for producer or integrated checkpoint |
| Evidence bundle incomplete/failed/extrapolated | aggregate derives structured findings | accepted remediation result contains findings | DOM aggregate | remediation workflow | result snapshot is immutable | return to remediation; do not pass |
| Existing evaluation has a different basis | aggregate/handler exact comparison | existing accepted snapshot preserved | DOM aggregate | owning conformance workflow | one result per exact cycle/basis | create/use the next authorized cycle; no overwrite |
| Stale CAS | repository returns `STALE` | accepted existing state preserved | PLAT physical boundary | application retry/reconciliation | expected revision | reread canonical result; exact replay only |
| Equivalent concurrent commit | repository returns `DUPLICATE` with exact existing result | one accepted snapshot | repository physical boundary | handler | cycle/evidence exactness | return duplicate accepted result; no second effect |
| Corrupt/detached rehydration | reconstruction authority/snapshot equality and derived result validation | no materialized state | DOM reconstruction boundary | PLAT recovery owner | snapshot identity | fail closed and preserve last accepted state |

### Temporal authority proof

```text
INITIAL_OBSERVATION = canonical reader observation for exact artifact/cycle/implementation scope
VERSION_REVISION_HASH_OR_CORRELATION = artifact revision, implementation revision, evidence IDs/hashes, observation ID
MUTATION_WINDOW = first canonical read through repository commit
RELEVANT_COMMIT_POINT = final repository CAS commit
INDEPENDENT_SECOND_OBSERVATION = second reader invocation with a distinct observation ID
DRIFT_DETECTION = exact scope/item/outcome/evidence-hash comparison; source disappearance; stale CAS
FAIL_CLOSED_BEHAVIOR = return typed rejection or accepted REMEDIATION_REQUIRED result; never CONFORMANT on incomplete/drifted input
STATE_PRESERVATION = no repository write on drift/stale/failure; existing result remains unchanged
SEMANTIC_VALIDATION_OWNER = DOM FinalConformanceEvaluation
CAS_OR_PHYSICAL_INTEGRITY_ROLE = repository/PLAT only; CAS does not replace semantic reread
PROOF_EVIDENCE = T012 §14c; planned T12-AC3 direct drift/recovery witness
```

```text
CALLER_AS_AUTHORITY_CHECK = PASS
CALLER_SUPPLIED_AUTHORITY_BYPASS = 0
TEMPORAL_AUTHORITY_GAP = 0
```

## 19. Clean Code Assessment

| Check | Result | Evidence / constraint |
| --- | --- | --- |
| Clear domain naming | PASS | Names mirror conformance, artifact, cycle, evidence, finding, revision, and exact basis vocabulary |
| Small cohesive methods | PASS | Bundle normalization, evidence analysis, snapshot conversion, and command orchestration remain separate operations |
| Explicit side effects | PASS | Only repository `commit` mutates external state; reader is read-only |
| Explicit mutation boundaries | PASS | Immutable domain objects and one CAS commit |
| No boolean parameter explosion | PASS | Typed result/outcome unions and dimension status replace mode booleans |
| No long parameter lists | PASS | Scope/bundle input objects group cohesive data |
| No primitive obsession where semantics exist | PASS | Canonical references, revisions, bundles, findings, and evidence hashes have named boundaries |
| No magic values | PASS | Seven dimensions and result/category unions are named constants/types |
| No generic utility/service buckets | PASS | No `Manager`, `Helper`, `Processor`, or generic evaluator service |
| No duplicated domain rules | PASS | Dimension analysis and exact equality have one semantic owner |
| No deep nesting by design | PASS | Early fail-closed guards and focused analysis helpers |
| No comment-dependent correctness | PASS | Scope, completeness, temporal, and CAS guards execute in code |
| No hidden temporal coupling | PASS | Reader calls and commit mutation window are explicit |
| No unnecessary mutability | PASS | Evidence, result, findings, and snapshots are frozen |

```text
PRIMITIVE_OBSESSION_RISK = LOW
PREMATURE_ABSTRACTION_RISK = LOW
OVERENGINEERING_RISK = LOW
```

## 20. Test Design

### Test surfaces

| Behavior / Invariant | Test Type | Target | Expected Proof |
| --- | --- | --- | --- |
| Exact scope accepts ARTIFACT + ARTIFACT_CYCLE and rejects wrong kinds | UNIT / INVARIANT / NEGATIVE_PATH | `FinalConformanceScope` | Canonical identity types are preserved and invalid references fail before commit |
| Complete seven-dimension evidence evaluates CONFORMANT | DOMAIN_INVARIANT / CONFORMANCE | `FinalConformanceEvaluation.evaluate` via handler | All seven dimensions are present once, all are PROVEN, and result is structured |
| Omitted, duplicate, failed, and unknown dimensions produce findings | DOMAIN_INVARIANT / NEGATIVE_PATH | aggregate analysis | Result is REMEDIATION_REQUIRED with explicit finding category/dimension/reason |
| Empty evidence/process termination cannot pass | NEGATIVE_PATH / CONFORMANCE | handler + aggregate | Missing source rejects; empty bundle cannot produce CONFORMANT |
| Caller evidence cannot replace authority | APPLICATION / TEMPORAL | `FinalConformanceHandler` | Caller basis must match canonical first observation; no commit on mismatch |
| Independent second observation detects drift | APPLICATION / STALE | reader sequence fixture | Different evidence ID/hash/scope or same observation ID fails closed |
| Exact scope/evidence/revision survives recovery | RECOVERY / REHYDRATION | `toSnapshot`/`rehydrate` | Accepted authority and derived result must match; forged/detached snapshot rejected |
| Exact replay is idempotent | IDEMPOTENCY | handler + repository fixture | Same evidence returns existing evaluation with `duplicate: true` |
| Stale/conflicting replay cannot overwrite | STALE / CONCURRENCY | CAS repository fixture | Existing evaluation is preserved and rejection is structured |
| Concurrent equivalent commands have one physical winner | CONCURRENCY / PERSISTENCE_CONTRACT | deterministic barrier repository | One `ADVANCED`, one exact `DUPLICATE`; no second canonical result |
| Foreign boundary does not execute or import infrastructure | ARCHITECTURE_GUARD | productive import-graph test | New T012 source remains under `src/`, with no prototype/test/infrastructure authority path |

### Complete AC-DOM-052 acceptance witness matrix

| Normative behavior | Normative verb | Concrete operation | State/effect | Direct positive test | Direct negative/isolation test | Expected evidence | Required capability | Authority / contract / availability | Dependency class | Executable at closure |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Conformance dimensions | evaluates completely | `FinalConformanceHandler.handle` with exact cycle bundle | seven-dimension evaluation | `T12-AC1-P`: complete seven-item bundle returns CONFORMANT | `T12-AC1-N`: omission, duplicate, failed, unknown/extrapolated, or contradictory item returns findings | `docs/tickets/SPEC-DOM-001/evidence/TICKET-012/AC-DOM-052-dimensions.md` | local evaluator contract; foreign evidence fixtures are integrated-only | AUTHORITY `DEFINED`; CONTRACT `DEFINED`; LOCAL_TESTABILITY `YES`; PRODUCTIVE_AVAILABILITY `YES` for local evaluator contract; no foreign producer required | REQUIRED_FOR_LOCAL_CLOSURE | YES |
| Structured verdict | emits | `FinalConformanceHandler.handle` result | terminal structured result | `T12-AC2-P`: exact result includes state, identity, revision, findings, and evidence | `T12-AC2-N`: missing source/empty evidence/process termination cannot pass; failed evidence yields REMEDIATION_REQUIRED | `docs/tickets/SPEC-DOM-001/evidence/TICKET-012/AC-DOM-052-verdict.md` | local evaluator contract | AUTHORITY `DEFINED`; CONTRACT `DEFINED`; LOCAL_TESTABILITY `YES`; PRODUCTIVE_AVAILABILITY `YES` for local evaluator contract | REQUIRED_FOR_LOCAL_CLOSURE | YES |
| Exact-cycle linkage | links exactly | exact scope evaluation, replay, and `rehydrate` | artifact/cycle/implementation/evidence identity | `T12-AC3-P`: exact identity/revision/hash linkage survives snapshot recovery and exact retry | `T12-AC3-N`: wrong artifact/revision/cycle, detached scope, changed hash, same observation, stale CAS, or conflicting replay rejects | `docs/tickets/SPEC-DOM-001/evidence/TICKET-012/AC-DOM-052-linkage.md` | local evaluator contract; PLAT/GIT/EXEC evidence is integrated-only | AUTHORITY `DEFINED`; CONTRACT `DEFINED`; LOCAL_TESTABILITY `YES`; PRODUCTIVE_AVAILABILITY `YES` for local evaluator contract; foreign availability `NO` and non-blocking locally | REQUIRED_FOR_LOCAL_CLOSURE | YES |

```text
ACCEPTANCE_WITNESS_MATRIX_ROWS = 3
REQUIRED_BEHAVIORS_TOTAL = 3
DIRECT_BEHAVIOR_WITNESSES = 3
PROXY_ONLY_BEHAVIORS = 0
UNTESTED_STATE_TRANSITIONS = 0
UNPROVEN_CONCURRENCY_CONTRACTS = 0
MISSING_ARCHITECTURE_GUARDS = 0
DESIGN_TEST_COVERAGE_GATE: PASS
```

Every matrix row has a direct operation, a positive test, a negative/isolation
test, an evidence file, and `WITNESS_EXECUTABLE_AT_LOCAL_CLOSURE = YES`. The
foreign producer evidence remains an integrated CP-DOM-04 obligation and is
not falsely represented as local productive availability.

## 21. Structural Risk Assessment

| Risk | Level | Mitigation |
| --- | --- | --- |
| God component | LOW | Seven fixed dimension checks remain aggregate analysis; authority and persistence are separate ports |
| Oversized file | LOW | Domain value objects and aggregate are cohesive; application orchestration is a separate module |
| Responsibility mixing | LOW | Domain derives; handler orchestrates; ports abstract external boundaries |
| Excessive dependency | LOW | Handler depends on two cohesive ports; domain depends only on domain contracts |
| Duplication | LOW | One canonical dimension set, scope equality, and evidence analysis path |
| Testability | LOW | Pure aggregate evaluation plus deterministic reader/repository fixtures |
| Cross-spec leakage | LOW | Typed local evidence boundary; no foreign lifecycle state or adapter import |
| Architecture drift | LOW | Architecture guard checks import graph and forbidden authority paths |
| Anemic domain model | LOW | Aggregate owns completeness, finding, and result semantics |
| Fat application service | LOW | Handler performs only read/compare/evaluate/commit orchestration |
| Fat interface | LOW | Reader and repository are cohesive ports with current consumers |
| Primitive obsession | LOW | Named scope, bundle, item, finding, and revision contracts |
| Dependency inversion | LOW | Domain/application use stable ports; concrete producers remain external |
| Infrastructure leakage | LOW | No filesystem, database, HTTP, Git SDK, or prototype import |
| Domain rule duplication | LOW | Result derivation is centralized in the aggregate |
| Premature abstraction | LOW | No hypothetical strategies, factories, or plugin seams |
| Overengineering | LOW | Seven normative dimensions require only one aggregate, two ports, and one handler |

```text
HIGH_STRUCTURAL_RISKS = 0
HIGH_DDD_RISKS = 0
HIGH_SOLID_RISKS = 0
HIGH_CLEAN_CODE_RISKS = 0
```

## 22. Implementation Sequence

1. Add domain constants/types for the seven dimensions, outcomes, categories,
   revisions, and exact scope. Immediately test canonical kind/revision and
   immutable token validation.
2. Add `FinalConformanceEvidenceItem` and
   `FinalConformanceEvidenceBundle`. Immediately test item-to-scope attachment,
   exact equality, duplicate observation rejection inputs, and immutable arrays.
3. Add `FinalConformanceFinding` and the aggregate analysis path. Immediately
   test complete, omitted, duplicated, failed, unknown, and empty evidence.
4. Add aggregate snapshot and authority-backed `rehydrate`. Immediately test
   exact recovery and forged/detached/corrupt material rejection.
5. Add `FinalConformanceEvidenceReader` and
   `FinalConformanceRepository` ports. Implement only test fixtures, not
   physical infrastructure. Immediately test stale/duplicate repository
   results through the ports.
6. Add `FinalConformanceHandler` with caller-basis matching, first/second
   observations, exact replay, and CAS mapping. Immediately test caller bypass,
   drift, source disappearance, stale, conflict, and idempotency.
7. Add the T012 focused test file covering all three witness rows and a
   productive import-graph architecture guard.
8. Run focused T012 tests, all productive regressions, strict source typecheck,
   prototype regressions, and diff checks. Confirm the structural self-check
   before `IMPLEMENTED`.

No step changes upstream authority, prototype code, foreign ownership, or
physical persistence.

## 23. Files Expected to Change

| Path / Area | Classification | Reason |
| --- | --- | --- |
| `src/domain/final-conformance.ts` | EXPECTED_CREATE | T012 aggregate, value objects, findings, snapshots, and ports |
| `src/application/final-conformance.ts` | EXPECTED_CREATE | T012 command handler and authority/commit orchestration |
| `tests/dom-001-ticket-012.test.ts` | EXPECTED_CREATE | Direct AC-DOM-052 positive, negative, recovery, concurrency, and architecture witnesses |
| `docs/tickets/SPEC-DOM-001/DOM-001-TICKET-012-final-conformance-evaluator.md` | MODIFY_LATER | Only implementation evidence/status fields after implementation; frozen scope/authority remains unchanged |
| `docs/tickets/SPEC-DOM-001/evidence/TICKET-012/*` | EXPECTED_CREATE | Acceptance, temporal authority, and completion evidence |
| `docs/tickets/SPEC-DOM-001/DOM-001-TICKET-012-implementation-audit.md` | AUDIT_OWNED_LATER | Independent canonical audit artifact; not modified by implementation |
| `docs/tickets/SPEC-DOM-001/DOM-001-TICKET-012-ticket-conformance-audit.md` | AUDIT_OWNED_LATER | Independent specialist artifact; not modified by implementation |
| `docs/tickets/SPEC-DOM-001/README.md` | DERIVED_STATE_LATER | Status/index projection only after independent finalization; not modified by implementation design |
| ADRs, portfolio, SPEC, Gap Matrix, Plan, Plan Audit, prior tickets, prototype | MUST_NOT_MODIFY | Upstream authority, foreign owner, and historical evidence boundaries |

## 24. Open Questions / Blockers

```text
OPEN_IMPLEMENTATION_BLOCKERS = NONE
SPECIFICATION_GAP = NONE
ARCHITECTURAL_AUTHORITY_REQUIRED = NO
CROSS_SPEC_CONTRACT_MISSING = NO
TICKET_LOCAL_CLOSURE_NOT_PRESERVABLE = NO
```

The integrated CP-DOM-04 foreign producer capabilities are known and
intentionally classified `REQUIRED_FOR_INTEGRATED_PROOF`; they are not local
blockers and do not require implementation in T012.

## 25. Design Metrics

```text
RESPONSIBILITIES = 7
DOMAIN_CONCEPTS = 6
AGGREGATE_ROOTS = 1
ENTITIES = 0
VALUE_OBJECTS = 5
DOMAIN_SERVICES = 0
DOMAIN_POLICIES = 0
APPLICATION_SERVICES = 0
COMMAND_HANDLERS = 1
PORTS = 2
ADAPTERS = 0 locally; foreign adapters at CP-DOM-04
ANTI_CORRUPTION_LAYERS = 1 typed evidence mapping boundary
PROPOSED_COMPONENTS = 9
CRITICAL_INVARIANTS = 10
UNPLACED_DOMAIN_INVARIANTS = 0
TEST_SURFACES = 3
UNJUSTIFIED_SOLID_VIOLATIONS = 0
DEPENDENCY_DIRECTION_VIOLATIONS = 0
HIGH_STRUCTURAL_RISKS = 0
HIGH_DDD_RISKS = 0
HIGH_SOLID_RISKS = 0
HIGH_CLEAN_CODE_RISKS = 0
SPEC_IMPLEMENTABILITY_CHECK = PASS
IDENTITY_AUTHORITY_GAPS = 0
RECONSTRUCTION_AUTHORITY_GAPS = 0
LIFECYCLE_AUTHORITY_GAPS = 0
PERSISTENCE_SEMANTICS_GAPS = 0
CROSS_SPEC_AUTHORITY_GAPS = 0
PROHIBITED_NORMATIVE_DECISIONS = 0
AUTHORITY_CONSUMPTION_PROOFS = 1
PRODUCER_CONSUMER_CONTRACT_PROOFS = 1
TEMPORAL_AUTHORITY_PROOFS = 1
TEMPORAL_AUTHORITY_GAPS = 0
CALLER_SUPPLIED_AUTHORITY_BYPASS = 0
ACCEPTANCE_WITNESS_MATRIX_ROWS = 3
DIRECT_BEHAVIOR_WITNESSES = 3
PROXY_ONLY_BEHAVIORS = 0
UNTESTED_STATE_TRANSITIONS = 0
UNPROVEN_CONCURRENCY_CONTRACTS = 0
MISSING_ARCHITECTURE_GUARDS = 0
DESIGN_TEST_COVERAGE_GATE = PASS
```

## 26. Design Gate

```text
IMPLEMENTATION_DESIGN_GATE: READY_FOR_IMPLEMENTATION
```
