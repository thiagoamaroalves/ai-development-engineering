# DOM-001-TICKET-002 — Implementation Design Conformance Audit

## 1. Specialist Result

```text
AUDIT_RESULT: FINDINGS
SPECIALIST_DESIGN_FINDINGS
DOMAIN_AUDIT_COMPLETE = YES
```

This is independent specialist evidence only. It does not approve the ticket,
close implementation validation, or transition the ticket to `DONE`.

## 2. Audit Subject

| Field | Value |
|---|---|
| Ticket | `DOM-001-TICKET-002` |
| Ticket path | `docs/tickets/SPEC-DOM-001/DOM-001-TICKET-002-manual-entry-snapshot-eligibility.md` |
| Implementation unit | `DOM-IMP-02` |
| Implementation Design | `docs/tickets/SPEC-DOM-001/DOM-001-TICKET-002-implementation-design.md` |
| Ticket status | `VALIDATION_REQUIRED` |
| Audit target HEAD | `a58ce959f9b34f3c1c83ed41c01b058d31bf3366` |
| Implementation state | Target HEAD plus unchanged implementation working tree |
| Audit type | Independent re-audit |
| Audit date | `2026-09-09` |

The target HEAD was verified with `git rev-parse HEAD`. The ticket-scoped
productive files are working-tree additions relative to that HEAD; `git show
HEAD:<path>` confirms that the snapshot production files are not present in the
pinned commit. No production, test, ticket, authority-upstream, or historical
artifact was modified during this audit. Unrelated pre-existing working-tree
changes were excluded.

## 3. Audit Mode

```text
READ_ONLY
INDEPENDENT
ADVERSARIAL
DESIGN_FIRST
REPOSITORY_AWARE
DDD_AWARE
SOLID_AWARE
DEPENDENCY_DIRECTION_AWARE
INVARIANT_AWARE
CLEAN_CODE_AWARE
TESTABILITY_AWARE
REHYDRATION_AWARE
NO_REMEDIATION
```

## 4. Authority / Design Baseline

Authority was evaluated as: accepted ADRs, approved portfolio decomposition,
conformant `SPEC-DOM-001`, validated Gap Matrix and Plan, ticket, then approved
Implementation Design. Relevant authority includes:

- `ADR-0001`: explicit manual processing; immutable pre-execution snapshot;
  only `ACCEPTED` ADRs; no later accepted ADR or divergent basis may enter the
  execution snapshot.
- `DOM-INGEST-001`: discovery, absent SPEC, or session state cannot initiate
  processing or choose ADRs.
- `DOM-SNAPSHOT-001`: exact ADR hashes, base, configuration, and skill/contract
  versions are immutable and drift-sensitive.
- `DOM-ELIG-001`: proposed, rejected, superseded, unknown, or ineligible
  revisions fail closed without fallback.

The current design contains both `IMPLEMENTATION_DESIGN_READY` and
`IMPLEMENTATION_DESIGN_GATE: READY_FOR_IMPLEMENTATION`. Its structural baseline
requires `AdrEligibilityPolicy` to consume canonical ADR decision state,
`ExecutionSnapshot` to own invariant-preserving confirmation and drift
rejection, the handler to remain orchestration, and the repository to remain a
narrow PLAT-facing persistence port.

Design SHA-256 at audit time:
`DC878401A257473FAB1A322245C464C7077E4EAD05E92E898E9684B3B5C01AFB`.

## 5. Implementation Diff

| File | Classification | Evidence |
|---|---|---|
| `src/domain/snapshot.ts` | `DESIGN_EXPECTED` | Snapshot value objects, policy, aggregate, lifecycle, and repository port |
| `src/application/snapshot.ts` | `DESIGN_EXPECTED` | Manual command handler and EXEC exact-version mapping seam |
| `tests/dom-001-ticket-002.test.ts` | `DESIGN_EXPECTED` | Productive ticket-scoped tests and in-memory boundary fixtures |
| `src/domain/identity.ts` | `REUSED_AUTHORITY` | TICKET-001 identity/value-object/catalog implementation; no T002 edit inferred |
| `src/application/identity.ts` | `REUSED_AUTHORITY` | TICKET-001 resolver handler; no T002 edit inferred |

No productive adapter, transport, filesystem trigger, serializer, ORM, schema,
or new architectural layer was introduced. The implementation files were
hashed before and after audit with no change. Current relevant hashes include:

```text
BADB782ECDFCAE8430991A23ED7F41AD3F27DA96E317DB899DF4CE79A3BB6E17  src/domain/snapshot.ts
FBFDBA10142C5E4D7504AF52C90A05C5CEE92F06D1204A932245B5AE4943CB25  src/application/snapshot.ts
2B12123B98D46539E2861C6833ED91B3ECB9189164CFF2F72D3A00B86EA1440C  src/domain/identity.ts
999EE9EF1027BDA7392A495B7BC4A4C916E6AE251D2790C6C4462B734344BCB0  src/application/identity.ts
83326D0EC993F410DC321869ACCF23E8C9DEA86688BFE3F438F97D1D94ED3520  tests/dom-001-ticket-002.test.ts
```

## 6. Responsibility Conformance

| Responsibility | Designed home | Actual home | Result |
|---|---|---|---|
| Require explicit manual submission | `SubmitManualExecutionHandler` | `src/application/snapshot.ts:32-47` | `PRESERVED` |
| Resolve submitted ADR/SPEC references | `CanonicalIdentityCatalog` via handler | `src/application/snapshot.ts:48-56`; catalog `src/domain/identity.ts:363-370` | `PRESERVED` |
| Decide accepted-only ADR eligibility | `AdrEligibilityPolicy` and aggregate | `src/domain/snapshot.ts:191-199, 251-253` | `LOCALLY_ADAPTED — authority input is caller-supplied` |
| Construct immutable snapshot | `ExecutionSnapshot` and value objects | `src/domain/snapshot.ts:211-279` | `PRESERVED` |
| Confirm and reject basis drift | `ExecutionSnapshot.confirm` | `src/domain/snapshot.ts:282-304`; handler `src/application/snapshot.ts:72-79` | `LOCALLY_ADAPTED — self-confirming basis` |
| Persist/resolve snapshot record | `ExecutionSnapshotRepository` port | `src/domain/snapshot.ts:328-363`; handler calls `:67-79` | `PRESERVED` |
| Map foreign EXEC exact versions | Explicit mapping seam | `src/application/snapshot.ts:17-24` | `PRESERVED` |

The responsibility homes are present, but the two adaptations above are not
semantically acceptable because the canonical authority observation and
independent lock-time basis required by the design are absent.

```text
MISSING_RESPONSIBILITIES = 0
WRONG_RESPONSIBILITY_PLACEMENTS = 0
```

## 7. Component Conformance

| Designed component | Intended responsibility | Actual implementation | Result |
|---|---|---|---|
| `CanonicalIdentityCatalog` | Resolve canonical identity | Reused TICKET-001 catalog | `PRESERVED` |
| `AdrEligibilityPolicy` | Own accepted-only admission | Static policy in `src/domain/snapshot.ts:191-200` | `PRESERVED` home; authority input insufficient |
| `ExecutionSnapshot` | Own immutable state and confirmation | Private constructor, `create`, `rehydrate`, `confirm` | `PRESERVED` shape; lock observation incomplete |
| Snapshot value objects | Validate, compare, and freeze exact basis | `SnapshotId`, `SnapshotBase`, `ConfigurationVersion`, `AdrContentHash`, `ExactVersionSet`, `AdrSnapshotEntry` | `PRESERVED` |
| `ExecutionSnapshotRepository` | Narrow persistence boundary | `reserve`, `confirm`, `find` only | `PRESERVED` |
| `SubmitManualExecutionHandler` | Coordinate use case and side effects | Resolve, map, construct, reserve, confirm, map outcomes | `PRESERVED` boundary; confirmation seam incomplete |
| EXEC mapping seam | Translate exact foreign metadata | `mapExecExactVersionMetadata` | `PRESERVED` |

No unjustified split, material collapse, missing required component, or
unplanned structural component was found. `AdrContentHash` is a valid local
semantic refinement, not a new authority or responsibility.

## 8. Domain Model Conformance

`ExecutionSnapshot` is the only new aggregate root and owns its immutable
authority basis and DRAFT-to-CONFIRMED transition. The domain contains
meaningful behavior: construction, endpoint validation, eligibility check,
duplicate ADR revision rejection, immutability, confirmation, exact comparison,
and validated rehydration.

The model is therefore not anemic. However, eligibility is not based on a
canonical lifecycle/revision observation: `ManualAdrSubmission.decisionStatus`
is accepted from the command and copied into the domain entry. This is a major
authority/invariant conformance defect, not a class-placement preference.

```text
DOMAIN_MODEL_CONFORMANCE: FINDINGS
```

## 9. Aggregate Boundary Audit

| Aggregate | Root | Protected state/invariants | Mutation entry points | Consistency boundary | Result |
|---|---|---|---|---|---|
| Pre-execution authority snapshot | `ExecutionSnapshot` | ID, SPEC endpoint, ADR entries, hashes, base, configuration, versions, status | `create`, `rehydrate`, `confirm` | One snapshot record with repository reserve/confirm | `PRESERVED` |

The constructor is private. The aggregate, ADR-entry objects, arrays, and value
objects are frozen. There are no setters or generic mutable update methods.
`create` and `rehydrate` share validated construction. No ADR lifecycle or
execution lifecycle was duplicated inside the snapshot aggregate.

The missing canonical authority reader does not create an aggregate boundary
violation; it leaves a critical input invariant bypassable. The repository
fixture also demonstrates explicit stored-state CAS behavior at
`tests/dom-001-ticket-002.test.ts:50-57`, although the required behavior is not
fully exercised by assertions.

```text
AGGREGATE_BOUNDARY_CONFORMANCE: PASS
AGGREGATE_BOUNDARY_VIOLATIONS = 0
DOMAIN_INVARIANT_BYPASSES = 2
```

## 10. Invariant Placement Audit

| Invariant | Designed enforcement | Actual enforcement | Durable enforcement | Actual test | Result |
|---|---|---|---|---|---|
| Explicit manual submission only | Application command boundary | Handler has no discovery/session dependency; `:47-48` requires command fields | Repository receives only constructed snapshots | Discovery-only rejection `tests/...:141-156` | `PRESERVED` |
| Only accepted, eligible ADR revisions enter snapshot | Canonical decision state + `AdrEligibilityPolicy` | Policy checks `reference.identity.kind` and caller-supplied status only at `src/domain/snapshot.ts:192-197`; catalog returns identity/revision only at `src/domain/identity.ts:363-370` | No durable lifecycle authority is supplied | Non-accepted status loop `tests/...:124-131`; no forged/canonical-state test | `BYPASSABLE` |
| ADR hashes are frozen | Immutable entry/value object | `AdrContentHash` and frozen entry at `src/domain/snapshot.ts:100-115, 145-159` | Port exposes no field update | Freeze assertions `tests/...:113-115` | `PRESERVED` |
| Base/configuration/exact versions are frozen | Value objects and confirmation comparison | Frozen value objects and `hasSameAuthorityBasis` at `src/domain/snapshot.ts:306-325` | Exact values retained by repository contract | Exact value assertions `tests/...:106-112`; only base drift tested | `LOCALLY_ADAPTED` test coverage incomplete |
| Confirmed snapshot cannot absorb later authority | Aggregate confirmation plus lock-time current-basis observation | `confirm` compares a supplied basis; handler passes the same object at `src/application/snapshot.ts:72` | Repository can reject stored mismatch but has no external authority reader in its port | Direct base-drift test `tests/...:174-185`; no independent current-basis test | `BYPASSABLE` |
| Snapshot identity is not a filename | `SnapshotId` and canonical references | Stable token and identity references at `src/domain/snapshot.ts:44-64` | Identity-qualified repository key | Discovery-only input rejected; no filename stored | `PRESERVED` |
| Rehydration re-enters validated construction | Shared private construction path | `rehydrate` delegates to `construct` at `src/domain/snapshot.ts:235-279` | Adapter seam is declared, not implemented | Basic confirmed rehydration `tests/...:188-214` | `PRESERVED` locally; matrix incomplete |

```text
UNENFORCED_INVARIANTS = 2
INVARIANT_PLACEMENT_DEVIATIONS = 2
```

## 11. Domain Rule Duplication Audit

The accepted-only conditional exists in one policy. The handler does not repeat
that conditional, and the repository result types do not redefine eligibility.
Identity resolution is delegated to TICKET-001. No independent duplicate of
the same domain rule was found.

```text
DOMAIN_RULE_DUPLICATION = 0
```

## 12. Value Object / Primitive Audit

`SnapshotId`, `SnapshotBase`, `ConfigurationVersion`, `AdrContentHash`, and
`ExactVersionSet` validate, compare, and freeze their semantic values. Identity
references are reused from TICKET-001. `AdrSnapshotEntry` binds the ADR
reference, decision status, and content hash and is frozen.

The command boundary appropriately accepts raw external values and maps them to
domain value objects. No filename, mutable dictionary, raw version tuple, or
mutable DTO became snapshot authority.

```text
VALUE_OBJECT_CONFORMANCE: PASS
PRIMITIVE_OBSESSION_REGRESSIONS = 0
```

## 13. Domain Service Audit

No Domain Service was introduced or required. `AdrEligibilityPolicy` is a
focused policy and not a generic service bucket. It does not own ADR
transitions, persistence, discovery, fallback, or EXEC capability logic.

```text
DOMAIN_SERVICE_SCOPE_LEAK = 0
GENERIC_DOMAIN_SERVICE_BUCKET = 0
```

## 14. Application Service Audit

`SubmitManualExecutionHandler` is structurally an application orchestrator: it
resolves identities, maps foreign metadata, constructs the aggregate, performs
repository calls, and maps persistence outcomes. It does not contain a generic
eligibility conditional or direct snapshot mutation.

The defect is not a fat-service classification. The handler's `draft.confirm(draft)`
call at `src/application/snapshot.ts:72` is a materially inadequate lock-time
authority seam, captured as `IDC-MAJOR-002`.

```text
FAT_APPLICATION_SERVICE_INTRODUCED: NO
APPLICATION_ORCHESTRATION_CONFORMANCE: FINDINGS
```

## 15. Repository / Persistence Boundary Audit

The repository port remains narrow:

- `reserve(snapshot)` handles identity reservation;
- `confirm(snapshot)` exposes `CONFIRMED`, `STALE`, and `NOT_FOUND` outcomes;
- `find(id)` resolves a snapshot;
- no generic field update, serializer, schema, ORM, filesystem, or physical
  recovery implementation is present.

This preserves PLAT ownership and dependency direction. The port's stored-state
comparison is visible in the test double at
`tests/dom-001-ticket-002.test.ts:50-57`. It does not, however, provide a
current ADR/lifecycle authority observation for the handler's lock-time flow.
That omission is a lifecycle/authority conformance finding, not a repository
boundary redesign recommendation.

```text
PERSISTENCE_BOUNDARY_CONFORMANCE: PASS
PERSISTENCE_DESIGN: LOCALLY_ADAPTED — lock-time authority observation absent
```

## 16. Anti-Corruption / Cross-Spec Design Audit

EXEC metadata is explicitly mapped through
`mapExecExactVersionMetadata` at `src/application/snapshot.ts:17-24` into local
`ExactVersionSet`. EXEC lifecycle, version generation, and capability registry
authority are not recreated. PLAT remains the physical persistence/recovery
owner through the repository port. No foreign model leaks into the domain
module, and no foreign authority is reimplemented.

```text
CROSS_SPEC_DESIGN_CONFORMANCE: PASS
FOREIGN_MODEL_LEAKAGE = 0
FOREIGN_AUTHORITY_REIMPLEMENTED = 0
ACL_BYPASSED = 0
```

## 17. SOLID Audit

| Principle | Result | Evidence |
|---|---|---|
| SRP | `PASS` | Policy, aggregate, handler, mapper, and repository port have coherent change reasons |
| OCP | `PASS` | No speculative strategy/factory/provider or central variation switch |
| LSP | `NOT_APPLICABLE` | No inheritance/subtype contract |
| ISP | `PASS` | Repository port is narrow and consumer-focused |
| DIP | `PASS` | Application depends on domain port; domain imports only domain vocabulary |

The missing authority seams do not introduce an additional SOLID violation;
they are authority and invariant-placement defects.

```text
SRP_VIOLATIONS = 0
OCP_VIOLATIONS = 0
LSP_VIOLATIONS = 0
ISP_VIOLATIONS = 0
DIP_VIOLATIONS = 0
UNJUSTIFIED_SOLID_VIOLATIONS = 0
```

## 18. Dependency Direction Audit

`src/domain/snapshot.ts` imports only `src/domain/identity.ts`. The application
module imports domain objects and the repository port. No filesystem, HTTP,
ORM, serializer framework, EXEC SDK, PLAT adapter, prototype, or concrete
infrastructure import is present in the audited productive modules.

```text
DEPENDENCY_DIRECTION_CONFORMANCE: PASS
DEPENDENCY_DIRECTION_VIOLATIONS = 0
INFRASTRUCTURE_LEAKAGE_POINTS = 0
```

## 19. Lifecycle Design Audit

The intended lifecycle is `manual basis → DRAFT → CONFIRMED`, with drift or
repeat confirmation rejected without mutation. `create` and `rehydrate` expose
the intended states, and `confirm` is the sole aggregate transition method.

The productive application path immediately calls `draft.confirm(draft)`.
Because `ExecutionSnapshot.confirm` compares the received basis with the same
draft's own basis (`src/domain/snapshot.ts:293-303`), this path proves only
self-consistency. It does not structurally establish that the current ADR
decision/revision, hashes, base, configuration, or exact versions still match
at the lock boundary.

No duplicate ADR lifecycle or alternate snapshot mutation authority was found,
but the no-drift lifecycle contract is not conformant.

```text
LIFECYCLE_DESIGN_CONFORMANCE: FINDINGS
LIFECYCLE_AUTHORITY_DUPLICATED = 0
GENERIC_STATE_MUTATION_BYPASS = 0
TERMINAL_STATE_BYPASS = 0
```

## 20. Failure / Recovery Structure Audit

Domain placement is correct for malformed values, endpoint errors, known
decision vocabulary, duplicate ADR revisions, already-confirmed state, and
basis comparison. Repository outcomes are explicit and application mapping is
present. No automatic retry, rebase, discovery fallback, or physical recovery
implementation was introduced.

Rehydration uses the shared validated construction seam. The structural gap is
that eligibility and current-authority failure detection do not have the
independent authority observation needed by the design, and the test suite does
not prove the complete stale/recovery matrix.

```text
RECOVERY_STRUCTURE_COLLAPSED = 0
RETRY_OWNERSHIP_DRIFT = 0
IDEMPOTENCY_BOUNDARY_DRIFT = 0
```

## 21. Clean Code Structural Audit

Naming follows the ticket vocabulary. Methods are cohesive, side effects are
visible at repository calls, mutation boundaries are explicit, and there are
no generic managers/helpers, boolean mode switches, speculative abstraction
chains, or unnecessary mutable state.

`draft.confirm(draft)` is semantically misleading because the same value is
used as both candidate and comparison basis; it is reported under lifecycle and
authority conformance rather than as a style-only finding.

```text
CLEAN_CODE_STRUCTURAL_CONFORMANCE: PASS_WITH_MATERIAL_LIFECYCLE_OBSERVATION
GOD_COMPONENTS = 0
FAT_INTERFACES = 0
```

## 22. Testability / Structural Test Audit

Executable evidence:

- Focused ticket suite: `5 passed, 0 failed`.
- Related regression suite: `27 passed, 0 failed`.
- Productive source-only TypeScript check: passed.
- A TypeScript check including root tests could not complete because the
  repository lacks `@types/node`; this is an environment/project typing
  prerequisite, not a production compile error.

Covered structural surfaces include explicit/manual input rejection, several
non-accepted statuses, missing SPEC, endpoint validation, exact-value success,
immutability, one base-drift path, and basic rehydration.

The approved design requires broader structural proof that is absent:

1. canonical lifecycle decision/revision cannot be forged through the command;
2. independent current-authority observation at confirmation;
3. drift matrix for SPEC, ADR references/status/hash, base, configuration, and
   both exact version fields;
4. duplicate, already-confirmed, `STALE`, and `NOT_FOUND` repository outcomes;
5. rehydration rejection for malformed status/version/authority records and
   preservation of stored state after rejected transitions.

The repository fixture contains some unasserted branches, but fixture code is
not executable proof. This is a material testability gap because the missing
tests protect the exact authority and aggregate lifecycle boundaries.

```text
TESTABILITY_CONFORMANCE: FINDINGS
TESTABILITY_REGRESSIONS = 1
MISSING_STRUCTURAL_TESTS = 5
ARCHITECTURE_GUARD_PRESENT = YES
ARCHITECTURE_GUARD_INEFFECTIVE = NO
```

## 23. Design Deviation Audit

Recorded material deviations: none. The additional `AdrContentHash` value
object is a valid local implementation detail and does not alter authority,
ownership, or dependency direction.

Independent inspection found two undeclared material deviations from the
approved structural contract:

- eligibility has no canonical ADR lifecycle/revision observation and trusts a
  command claim;
- lock confirmation has no independent current-basis observation and
  self-compares the draft.

These deviations are not accepted as repository adaptations because they make
approved invariants bypassable. No specific code patch is prescribed here.

```text
DESIGN_DEVIATION_CONFORMANCE: FINDINGS
RECORDED_DESIGN_DEVIATIONS = 0
VALID_DESIGN_DEVIATIONS = 0
INVALID_DESIGN_DEVIATIONS = 2
UNDECLARED_MATERIAL_DESIGN_DEVIATIONS = 2
```

## 24. Structural Self-Check Verification

The ticket reports implementation claims under its implementation evidence,
but it does not contain a standalone `IMPLEMENTATION_STRUCTURAL_SELF_CHECK`
field. The claims that the domain owns accepted-only eligibility and drift
rejection are not fully substantiated by the actual authority flow described in
`IDC-MAJOR-001` and `IDC-MAJOR-002`.

```text
CLAIMED: NOT_REPORTED
AUDITED: INCOMPLETE
STRUCTURAL_SELF_CHECK_CONFORMANCE: FINDINGS
```

## 25. Findings

### IDC-MAJOR-001 — Eligibility trusts caller-supplied lifecycle and revision claims

Severity: `MAJOR`  
Category: DDD authority ownership / invariant placement / domain boundary

Ticket: `DOM-001-TICKET-002`  
Implementation Design: `docs/tickets/SPEC-DOM-001/DOM-001-TICKET-002-implementation-design.md`  
Audit Target HEAD: `a58ce959f9b34f3c1c83ed41c01b058d31bf3366`

Designed responsibility/component: `AdrEligibilityPolicy` consuming canonical
ADR decision state after exact identity resolution.

Approved design: The policy and aggregate must admit only `ACCEPTED` ADRs at
eligible revisions; the handler must resolve canonical references and must not
become the domain eligibility authority.

Actual implementation: `ManualAdrSubmission.decisionStatus` is a raw command
field at `src/application/snapshot.ts:26-30`. The handler copies it unchanged
at `:49-55`. `CanonicalIdentityCatalog.resolve` returns only the identity record
and revision at `src/domain/identity.ts:363-370`. The policy at
`src/domain/snapshot.ts:192-197` checks only ADR kind and the caller-provided
status. No canonical lifecycle/revision eligibility reader is consulted.

Repository evidence: The ticket fixture creates an ADR identity with no
decision lifecycle state (`tests/dom-001-ticket-002.test.ts:69-77`) and passes
`decisionStatus: 'ACCEPTED'` from `commandFor` at `:80-93`. The negative test
proves rejection of claims labelled `PROPOSED`, `REJECTED`, and `SUPERSEDED`
(`:124-131`), but not rejection of a forged `ACCEPTED` claim or an ineligible
revision.

Structural problem: Any caller able to submit an existing ADR reference can
label it `ACCEPTED`; the domain policy validates the assertion rather than
reading the canonical decision authority. The accepted-only invariant is
therefore bypassable and the design's authority boundary is not preserved.

DDD impact: Canonical ADR lifecycle authority is not observed at the domain
boundary; the snapshot can become a second or claim-based eligibility authority.
  
SOLID impact: No additional SOLID count; responsibility placement is present but
the input contract is structurally insufficient.  
Clean Code impact: The status field suggests authoritative state while being an
unverified assertion.  
Dependency direction impact: No technology dependency violation.  
Invariant impact: `DOM-ELIG-001` and eligible-revision protection are bypassable.
  
Testability impact: No test can prove canonical lifecycle/revision admission
because no such authority seam is injected.

Why this matters: A fail-closed snapshot must not be made eligible by an
untrusted command claim; otherwise later execution consumes authority that the
canonical ADR lifecycle may not grant.

Minimum structural correction required: Introduce or consume the approved
canonical ADR lifecycle/revision observation contract at the eligibility seam,
so the policy receives authoritative state and the command cannot manufacture
eligibility. Preserve T003 ownership of lifecycle transitions.

Classification: `PREEXISTING_AUDIT_ESCAPE`  
Historical reconciliation: corresponds to historical canonical finding
`IMA-MAJOR-001`, still present; `.history` was used only for reconciliation.

### IDC-MAJOR-002 — Confirmation self-compares instead of observing current authority

Severity: `MAJOR`  
Category: lifecycle authority / stale protection / concurrency seam

Ticket: `DOM-001-TICKET-002`  
Implementation Design: `docs/tickets/SPEC-DOM-001/DOM-001-TICKET-002-implementation-design.md`  
Audit Target HEAD: `a58ce959f9b34f3c1c83ed41c01b058d31bf3366`

Designed responsibility/component: `ExecutionSnapshot.confirm` as transition
owner, coordinated by the handler with exact current authority and protected by
the repository's atomic confirmation boundary.

Approved design: A later authority basis or drift must be rejected without
changing the snapshot. The failure/recovery design distinguishes domain
semantic detection from repository durable conflict and requires stale
protection at confirmation.

Actual implementation: The handler constructs `draft` and invokes
`draft.confirm(draft)` at `src/application/snapshot.ts:59-73`. The domain method
compares the supplied basis with the same draft at
`src/domain/snapshot.ts:293-303`. The repository then receives the already
confirmed value at `src/application/snapshot.ts:73`. There is no independent
current-authority reader or current basis supplied at lock time.

Repository evidence: The in-memory repository compares the stored draft to the
proposed snapshot at `tests/dom-001-ticket-002.test.ts:50-57`, but this only
protects the repository's stored object. The direct test at `:174-185` supplies a
different base manually and therefore does not exercise the handler's actual
self-confirming path.

Structural problem: The productive lock flow proves draft self-consistency, not
that the authority basis is still current. A later ADR lifecycle/content or
exact-basis change can be missed unless an external caller happens to construct
and pass a different candidate, which this handler never does.

DDD impact: The aggregate transition method exists, but its current-authority
observation contract is incomplete.  
SOLID impact: No additional SOLID count.  
Clean Code impact: `confirm(draft)` obscures the intended distinction between
stored basis and current basis.  
Dependency direction impact: No technology leakage.  
Invariant impact: No-drift and stale-confirmation protection is bypassable in the
productive orchestration path.  
Testability impact: The actual handler lock path has no independent stale source
to test.

Why this matters: Confirmation is the irreversible boundary before execution;
self-comparison can silently lock stale authority and defeats the design's
drift-sensitive snapshot guarantee.

Minimum structural correction required: Provide an approved current-authority
observation/lock seam, pass an independently obtained basis to the aggregate,
and retain atomic repository compare-and-set protection. Do not add a second
ADR lifecycle owner or implement PLAT storage here.

Classification: `PREEXISTING_AUDIT_ESCAPE`  
Historical reconciliation: corresponds to historical canonical finding
`IMA-MAJOR-002`, still present; `.history` was used only for reconciliation.

### IDC-MAJOR-003 — Required structural failure and state-preservation matrix is incomplete

Severity: `MAJOR`  
Category: testability / invariant evidence / lifecycle boundary

Ticket: `DOM-001-TICKET-002`  
Implementation Design: `docs/tickets/SPEC-DOM-001/DOM-001-TICKET-002-implementation-design.md`  
Audit Target HEAD: `a58ce959f9b34f3c1c83ed41c01b058d31bf3366`

Designed responsibility/component: Ticket-scoped domain, application, and
persistence-boundary tests protecting the aggregate and its seams.

Approved design: Test design sections require accepted-only admission,
proposed/rejected/superseded/unknown/ineligible revision rejection, complete
exact-basis drift protection, duplicate and stale persistence outcomes,
rehydration validation, and no state mutation or fallback after rejection.

Actual implementation: `tests/dom-001-ticket-002.test.ts` contains five tests.
It covers success (`:96-117`), three caller-labelled non-accepted statuses and
missing SPEC (`:119-139`), manual/discovery boundary (`:141-157`), one direct
base-drift case (`:159-186`), and basic rehydration (`:188-214`). It does not
assert canonical decision/revision authority, unknown/ineligible revision,
SPEC/ADR/hash/configuration/version drift, duplicate/confirmed/stale/not-found
handler outcomes, malformed status/version rehydration, or stored-state
preservation across repository rejection.

Structural problem: Passing tests cover a happy path and selected negatives but
do not protect the design-critical authority, lock, persistence, and recovery
boundaries. The repository fixture's unasserted branches are not evidence.

DDD impact: Aggregate and policy ownership cannot be independently verified for
the full invariant matrix.  
SOLID impact: None.  
Clean Code impact: None beyond unprotected structural intent.  
Dependency direction impact: Existing import guard is present and effective.  
Invariant impact: Missing assertions leave eligibility, stale lock, exact-basis,
idempotency, and rehydration failures unproven.  
Testability impact: Material regression; critical boundaries require broad
infrastructure or authority fixtures that are currently absent.

Why this matters: A green five-test suite does not demonstrate that the
immutable snapshot cannot absorb later authority, reject malformed persisted
state, or preserve state after duplicate/stale outcomes.

Minimum structural correction required: Add the complete design-specified
negative/state-preservation matrix, including an approved canonical authority
fixture and an independent current-basis confirmation fixture. Do not weaken
the invariant to fit the current tests.

Classification: `PREEXISTING_AUDIT_ESCAPE`  
Historical reconciliation: corresponds to historical canonical finding
`IMA-MAJOR-003`, still present; `.history` was used only for reconciliation.

## 26. Metrics

Audit dimensions:

| Dimension | Result |
|---|---|
| `DOMAIN_MODEL_CONFORMANCE` | `FINDINGS` |
| `AGGREGATE_BOUNDARY_CONFORMANCE` | `PASS` |
| `INVARIANT_PLACEMENT_CONFORMANCE` | `FINDINGS` |
| `COMPONENT_BOUNDARY_CONFORMANCE` | `FINDINGS` |
| `SRP_CONFORMANCE` | `PASS` |
| `OCP_CONFORMANCE` | `PASS` |
| `LSP_CONFORMANCE` | `NOT_APPLICABLE` |
| `ISP_CONFORMANCE` | `PASS` |
| `DIP_CONFORMANCE` | `PASS` |
| `DEPENDENCY_DIRECTION_CONFORMANCE` | `PASS` |
| `PERSISTENCE_BOUNDARY_CONFORMANCE` | `PASS` |
| `LIFECYCLE_DESIGN_CONFORMANCE` | `FINDINGS` |
| `CROSS_SPEC_DESIGN_CONFORMANCE` | `PASS` |
| `CLEAN_CODE_STRUCTURAL_CONFORMANCE` | `PASS` |
| `TESTABILITY_CONFORMANCE` | `FINDINGS` |
| `DESIGN_DEVIATION_CONFORMANCE` | `FINDINGS` |
| `STRUCTURAL_SELF_CHECK_CONFORMANCE` | `FINDINGS` |

```text
RESPONSIBILITIES:
- DESIGNED: 7
- PRESERVED: 5
- LOCALLY_ADAPTED: 2
- MISSING: 0
- WRONG_PLACEMENT: 0

COMPONENTS:
- DESIGNED: 7
- PRESERVED: 7
- LOCALLY_ADAPTED: 0
- COLLAPSED: 0
- UNJUSTIFIED_COMPONENT_COLLAPSES: 0
- UNJUSTIFIED_SPLITS: 0
- UNJUSTIFIED_COMPONENT_SPLITS: 0
- MISSING: 0
- MISSING_REQUIRED_COMPONENTS: 0
- UNPLANNED: 0
- UNPLANNED_STRUCTURAL_COMPONENTS: 0

DDD:
- AGGREGATE_BOUNDARY_VIOLATIONS: 0
- DOMAIN_INVARIANT_BYPASSES: 2
- UNENFORCED_INVARIANTS: 2
- INVARIANT_PLACEMENT_DEVIATIONS: 2
- DOMAIN_RULE_DUPLICATION: 0
- ANEMIC_DOMAIN_MODEL_INTRODUCED: NO
- FAT_APPLICATION_SERVICE_INTRODUCED: NO
- FAT_INTERFACE_INTRODUCED: NO
- GOD_COMPONENTS_INTRODUCED: NO

SOLID:
- SRP_VIOLATIONS: 0
- OCP_VIOLATIONS: 0
- LSP_VIOLATIONS: 0
- ISP_VIOLATIONS: 0
- DIP_VIOLATIONS: 0
- UNJUSTIFIED_SOLID_VIOLATIONS: 0

DEPENDENCIES:
- DEPENDENCY_DIRECTION_VIOLATIONS: 0
- INFRASTRUCTURE_LEAKAGE_POINTS: 0

CLEAN_CODE:
- GOD_COMPONENTS: 0
- FAT_INTERFACES: 0
- PRIMITIVE_OBSESSION_REGRESSIONS: 0
- GENERIC_SERVICE_BUCKETS: 0
- GENERIC_UTIL_BUCKETS: 0
- PREMATURE_ABSTRACTIONS: 0
- OVERENGINEERING_FINDINGS: 0
- HIDDEN_SIDE_EFFECTS: 0
- HIDDEN_TEMPORAL_COUPLINGS: 0

TESTABILITY:
- TESTABILITY_REGRESSIONS: 1
- MISSING_STRUCTURAL_TESTS: 5

DESIGN_DEVIATIONS:
- RECORDED: 0
- VALID: 0
- INVALID: 2
- UNDECLARED_MATERIAL: 2

SELF_CHECK:
- CLAIMED: NOT_REPORTED
- AUDITED: INCOMPLETE

FINDINGS:
- CRITICAL: 0
- MAJOR: 3
- MINOR: 0
- INFO: 0
```

## 27. Re-audit Reconciliation

The prior artifact in `.history/DOM-001-TICKET-002-implementation-design-conformance-audit.md`
reported `SPECIALIST_DESIGN_PASS`. It is historical only and is superseded as
an audit conclusion by this independent re-audit; no prior IDC finding from it
is treated as a current artifact.

The historical canonical implementation audit and remediation records reported:

| Historical finding | Independent re-audit result | Classification |
|---|---|---|
| `IMA-MAJOR-001` caller-supplied eligibility/lifecycle claim | `IDC-MAJOR-001` remains present | `STILL_PRESENT` / `PREEXISTING_AUDIT_ESCAPE` |
| `IMA-MAJOR-002` self-comparing lock confirmation | `IDC-MAJOR-002` remains present | `STILL_PRESENT` / `PREEXISTING_AUDIT_ESCAPE` |
| `IMA-MAJOR-003` incomplete negative/state evidence | `IDC-MAJOR-003` remains present | `STILL_PRESENT` / `PREEXISTING_AUDIT_ESCAPE` |

The remediation artifact records `NO_RELEVANT_DRIFT` and no production/test
changes. Independent current file hashes, target HEAD, focused tests, and
regressions agree that no remediation delta or remediation-introduced
regression occurred. The three findings were not accepted merely because they
appear in history; each was re-established from current code and tests.

## 28. Specialist Completeness Proof

```text
TICKET_STATUS_PRECONDITION: SATISFIED (VALIDATION_REQUIRED)
DESIGN_PRESENT: YES
DESIGN_GATE: READY_FOR_IMPLEMENTATION
TARGET_HEAD_PINNED: YES
IMPLEMENTATION_STATE_STABLE_DURING_AUDIT: YES
AUTHORITY_CHAIN_INSPECTED: YES
RESPONSIBILITIES_COMPARED: YES
COMPONENTS_COMPARED: YES
DOMAIN_MODEL_AUDITED: YES
AGGREGATE_BOUNDARY_AUDITED: YES
INVARIANTS_AUDITED: YES
REPOSITORY_BOUNDARY_AUDITED: YES
REHYDRATION_AUDITED: YES
LIFECYCLE_AUDITED: YES
FAILURE_RECOVERY_STRUCTURE_AUDITED: YES
CROSS_SPEC_SEAMS_AUDITED: YES
SOLID_AUDITED: YES
DEPENDENCY_DIRECTION_AUDITED: YES
CLEAN_CODE_AUDITED: YES
TESTABILITY_AUDITED: YES
DESIGN_DEVIATIONS_AUDITED: YES
STRUCTURAL_SELF_CHECK_AUDITED: YES
HISTORICAL_ARTIFACTS_TREATED_AS_HISTORY_ONLY: YES
PRODUCTION_MODIFIED: NO
TESTS_MODIFIED: NO
TICKET_MODIFIED: NO
AUTHORITY_UPSTREAM_MODIFIED: NO
DOMAIN_AUDIT_COMPLETE: YES
```
