# DOM-001-TICKET-004 Architecture-Boundaries Audit

Audit: docs/tickets/SPEC-DOM-001/DOM-001-TICKET-004-architecture-boundaries-audit.md

Specialist: ARCHITECTURE_BOUNDARIES

Ticket: DOM-001-TICKET-004

Implementation unit: DOM-IMP-04

Audit mode: RE_AUDIT

## Audit identity and basis

AUDIT_TARGET_HEAD=6b31bcee1591c8b2e6499a434950664077b2be01

The audit was performed against the pinned repository head plus the current T004 semantic worktree snapshot supplied at dispatch. The supplied semantic fingerprints were independently checked and matched the files inspected. The repository was dirty with unrelated user changes; only this specialist artifact is written by this audit.

Relevant semantic target:

~~~
src/domain/pipeline.ts=E02D4765A9FE4B38C6DF873220FC2F1DEA34FC0F2ED10C9B5A9639D3D6EB605F
src/application/pipeline.ts=9B31182CB338C5B7E1904792E7748E84E5779F80D3CE05EE54F5B35AA5951E47
tests/dom-001-ticket-004.test.ts=881EE5A40BD78F7318FA02CE51DF6B9DA8820052FECAFD8DD8475026762CC6BD
docs/tickets/SPEC-DOM-001/DOM-001-TICKET-004-pipeline-state-machines.md=8DE2E345422DAC05368CEE94066A99647CF25B48FA9E08AD8F2191A2C3831E57
docs/tickets/SPEC-DOM-001/DOM-001-TICKET-004-implementation-design.md=4165C0ECAA82E8AF6FFA73871D9814096D7C795F467CF7E4C7F43F717E784D8C
docs/tickets/SPEC-DOM-001/evidence/TICKET-004/AC-DOM-009-provenance.md=4086222D8059DEBFC2136A8881FC800FEA24D4A890600E6DE7D58491045947F8
~~~

Authority and planning basis inspected:

~~~
ADR-0001=33705082B9D2F46E638CD93BDF27CA676CFC6181A2684AD583E4501F5D06D50D
ADR-0002=EF9289C6FCA4BBA73FCA53CA38C71DD19110EB1CFE948358A7CCA1FE14E177D9
ADR-0006=AB39573F39849D9D9016683096126A63B037D763F09B4F00293500FD8FBCC6B2
portfolio-organization=C449388972279D8ADD520564A9614CFA236F87B6C8932A70D5BC2D28EEF6BE86
portfolio-decomposition-audit=120F22D0080AC0640EBBDAD7C460DF5DE2745788CFAEA83A1859F2C577168104
SPEC-DOM-001=CB4A21924D9619B8349D6CC239D7998633C402D7EA3D7461C2D4D8498F9A014C
implementation-gap-matrix=8D8401903F5558C129FCB516F699D7DB40DDFCBF83D52B136AE22CA95976675C
implementation-gap-matrix-audit=445755D48204567770A663A58D23EBCD61C3029653CD3463BD4E34860C517510
implementation-plan=C57D24FEC7CF69BED3EC354C4334DE698AFC54722FD7EDA6F2D3D6353FF35C33
implementation-plan-audit=474E33C3FD17F8790FBB2CD2A39C9670A33D0830FF851C8D06DE31CA6BFB9695
implementation-ticket-set-audit=CC1C31679086B1B1F1CD9EA084DBFC5988BC5DCD0085881A6A2B974E0791561A
~~~

Additional implementation-boundary basis:

~~~
src/domain/identity.ts=B1D2157480B63EC245E4A465A7805A43A82C4D091C6E231F6EAF17C6BCC73E96
evidence/order=ECD00F0F820F911E798F22610DC59E942E728A909908D50B2A8CDFD75F3986FE
evidence/rehydration=992B809DBF0AD1B886BB0B4ED8252BEC85D57C2DB268068DA8F700C492C3F947
evidence/isolation=161F3EF2896406987A6B5E0971D53429CF716EEDD562D115F7D082F9DD0D9D24
~~~

## Reconstructed authoritative contract

The authority chain used for this audit is:

ADR-0001/0002/0006 -> approved SPEC-DOM-001 decomposition -> DOM SPEC requirements DOM-PIPE-001, DOM-STATE-001, O-009/O-010 and AC-DOM-009/010 -> validated Gap Matrix -> conformant Implementation Plan -> approved T004 Implementation Design -> T004 implementation and executable evidence.

The reconstructed boundary contract is:

- DOM owns workflow-pipeline semantic meaning: canonical stage identity, immediate pipeline progression, pipeline provenance validation, aggregate revision semantics, and derivation of read-only workflow state.
- WorkflowPipeline is the DOM aggregate root. A persistent CanonicalIdentityReference of kind STAGE, scoped to the execution, is the identity authority. A mutable label, local alias, status, correlation alias, filename, or independent PipelineId is not an alternate identity.
- The nine declared machine families are separate state machines. PipelineStateInputs contains independently owned, frozen machine states. DerivedWorkflowState is a validated projection and cannot become a second state authority or be directly fabricated by callers.
- A later pipeline stage is valid only through the immediate canonical successor. Rehydration requires an accepted, identity-bound, complete provenance chain from the initial stage through the exact current stage and revision. A scalar stage/status/revision snapshot is insufficient.
- DOM semantically validates provenance identity, stage meaning, order, predecessor continuity, revision continuity, and final-state agreement. PLAT owns physical journal persistence, append-only records, integrity/replay, durable recovery, and physical compare-and-set. PLAT must not decide DOM stage meaning or replace the semantic chain proof with a status field.
- Application handlers may carry a canonical identity request and expected revision, but they do not supply the current semantic stage, accepted provenance, or derived state as authority. They resolve identity, load the aggregate, delegate domain transitions, and pass the domain-produced expected revision to the repository port.
- Projections, readers, repositories, UI, transport, backend authorization, and operational services cannot mutate or redefine the DOM authority. No legacy writer, migration adapter, or destructive transition is in scope for this ticket.

This contract is consistent with the approved design ownership table and boundary assertions: T004 introduces no new lifecycle owner, foreign schema, transport, persistence implementation, or authorization mechanism.

## Applicability and audit coverage

| Boundary dimension | Applicability | Reason and audit treatment |
|---|---|---|
| Ownership | REQUIRED | Pipeline semantics and state-machine separation are the ticket's purpose. |
| Canonical authority | REQUIRED | ADR-0001/0002/0006 and DOM-PIPE-001/DOM-STATE-001 define non-substitutable authority. |
| Cross-SPEC PLAT seam | AFFECTED | PCP-PLAT-04 and CAP-PLAT-SNAPSHOT-PIPELINE-PROVENANCE affect productive integrated proof. |
| Identity | REQUIRED | Canonical STAGE identity and exact reconstruction are explicit acceptance obligations. |
| Immutability | REQUIRED | Pipeline transitions, machine inputs, and provenance must not be mutated or aliased. |
| Lineage/reconstruction | REQUIRED | Later-stage restoration requires a complete, continuous, identity-bound chain. |
| Legacy/cutover | AFFECTED | The implementation replaces the historically unsafe alternate/scalar restoration path with the canonical path. |
| Destructive transitions | NOT_APPLICABLE | T004 contains no delete, revoke, destructive migration, irreversible external effect, or destructive state transition. |
| Migration authority | NOT_APPLICABLE | No migration, compatibility adapter, legacy writer, or data rewrite is implemented by T004. |
| Security/authorization | NOT_APPLICABLE | The DOM contract carries actor/evidence references only; no authentication, authorization, secret, route, or capability enforcement is implemented here. |
| Temporal authority | NOT_APPLICABLE | The approved contract treats rehydration as validation of one immutable candidate against accepted provenance before materialization; there is no mutable external commit or external-effect temporal race in this unit. |

All required and affected dimensions were audited. The NOT_APPLICABLE classifications are scope classifications with explicit reasons, not omitted checks.

## Ownership and canonical authority audit

src/domain/pipeline.ts keeps canonical stage order in the immutable PIPELINE_STAGES value and keeps machine ownership in the immutable PIPELINE_MACHINES value. PipelineStage validates known stage names and PipelineRevision validates the revision domain. PipelineMachineState and PipelineStateInputs.create validate each machine's declared ownership and freeze the values.

WorkflowPipeline.create (src/domain/pipeline.ts:337) resolves the supplied identity through the DOM identity authority and requires an exact registered STAGE reference before materializing the initial aggregate. WorkflowPipeline.rehydrate (:366) repeats canonical identity resolution, requires the accepted provenance authority, validates the supplied chain, and only then materializes the aggregate. There is no alternate pipeline identity or caller-owned semantic state path.

WorkflowPipeline.advanceTo (:618) owns immediate-successor validation and returns a new transition value with a new aggregate revision. It does not accept skips, caller-selected current state, or a status-based shortcut. The repository port (:651) is a persistence boundary with find(canonicalReference) and advance(proposed, expectedRevision); it does not own pipeline semantics.

src/application/pipeline.ts:24-54 resolves the canonical identity, loads the current aggregate, delegates advanceTo, and sends the domain-produced proposed aggregate and expected revision to the repository. GetPipelineStateHandler (:57-74) resolves identity, reads independently keyed state inputs, and asks PipelineStateDerivationPolicy to produce the read-only projection. No handler reimplements the state machine or writes a derived state.

Repository-wide inspection of the current source shows no production writer, worker, route, projection, migration, ORM model, SQL adapter, or alternate state authority for this pipeline unit. The in-memory repository and provenance authority in tests/dom-001-ticket-004.test.ts are test fixtures only; they do not duplicate a production capability. No foreign PLAT physical persistence implementation is present in this local semantic unit.

Result: ownership is conformant; the DOM boundary is preserved; no architecture finding is emitted.

## Cross-SPEC PLAT seam and authority consumption

The declared seam is CAP-PLAT-SNAPSHOT-PIPELINE-PROVENANCE, consumed through PCP-PLAT-04. The contract is defined: PLAT produces ordered append-only records, integrity/replay results, and physical persistence/recovery; DOM consumes the accepted records and validates canonical identity, semantic stage meaning, immediate order, predecessor continuity, revision continuity, and final-state agreement.

The current T004 implementation does not implement PLAT's physical capability. Its local PipelineProvenanceAuthority test double supplies an accepted semantic fixture, while the domain remains the semantic consumer. The test double is explicitly non-productive and is not evidence of durable journal, replay, integrity, or recovery availability. This is the expected integrated-only dependency recorded by the ticket and approved design, not foreign capability duplication or a local ownership violation.

~~~
CAPABILITY=CAP-PLAT-SNAPSHOT-PIPELINE-PROVENANCE
AUTHORITY_STATUS=DEFINED
CONTRACT_STATUS=DEFINED
LOCAL_TESTABILITY=NO
PRODUCTIVE_AVAILABILITY=NO
DEPENDENCY_CLASS=REQUIRED_FOR_INTEGRATED_PROOF
LOCAL_CLOSURE_BLOCKING=NO
BLOCKS_LOCAL_EXECUTION=NO
BLOCKS_LOCAL_CLOSURE=NO
BLOCKS_TICKET_DONE=NO
BLOCKS_INTEGRATED_PROOF=YES
BLOCKS_SPEC_FINAL_CONFORMANCE=YES
PRIMARY_ROUTE=IMPLEMENTATION_PLAN_REVALIDATION
DOWNSTREAM_CHECKPOINT=CP-DOM-02 / integrated PLAT recovery and replay proof
DOWNSTREAM_OWNER=SPEC-PLAT-001 implementation and integrated conformance owner
UPSTREAM_DEPENDENCY_CLASSIFICATION_PRESERVED=YES
~~~

The local consumer does not infer physical provenance, acknowledge durability, decide replay integrity, or turn the test fixture into a productive availability claim. No new dependency class or downstream owner is invented by this audit. The one authority-consumption gap is therefore recorded for integrated follow-up only, with no specialist architecture finding and no local closure block.

## Identity audit

Identity is conformant.

- CanonicalIdentityReference.create and CanonicalIdentity.rehydrate are used through the identity authority; exact kind, scope, value, and identity revision are checked.
- T004 requires kind=STAGE and rejects unknown, unregistered, wrong-kind, wrong-scope, and local-alias inputs.
- The repository key in the test fixture is pipeline.identity.canonicalKey, and application lookup uses the resolved canonical reference.
- The implementation contains no alternate persisted PipelineId lookup and no stage-name, filename, status, or correlation alias authority.
- Rehydration verifies that the candidate's canonical identity matches the resolved authoritative reference before provenance materialization.

The direct identity/authority tests cover unregistered STAGE creation, local aliases, wrong kind, missing authority, and shape-valid provenance without accepted authority. The identity authority is not mutated on failed creation or failed rehydration.

## Immutability and lineage audit

Immutability is conformant for the local semantic boundary. Pipeline stages, revisions, machine states, state-input collections, derived state, provenance entries, and aggregate instances are frozen. A transition returns a new aggregate; failed validation does not mutate the source aggregate or accepted provenance fixture. The application read path returns a derived value and does not write through the reader.

Lineage and reconstruction are conformant. assertProvenanceChain (src/domain/pipeline.ts:482) requires a nonempty chain attached to one canonical identity, rejects duplicates, requires the initial stage at revision zero with no predecessor, requires each subsequent stage to be the immediate successor with continuous revisions and matching predecessor fields, and requires the final entry to match the candidate aggregate exactly. assertProvenanceMatchesAuthority (:554) compares the supplied chain entry by entry with accepted authoritative provenance. Divergent, reordered, detached, skipped, incomplete, or fabricated chains fail closed before aggregate materialization.

The local test suite directly exercises valid reconstruction, missing authority, missing/empty provenance, duplicate/reordered/detached records, skipped stages, revision gaps, final mismatch, authority divergence, exact replay, and source immutability. Durable append-only lineage storage and replay are correctly left to the integrated PLAT capability described above.

## Separate state-machine and projection boundary audit

PipelineStateInputs.create (src/domain/pipeline.ts:180-225) requires all declared machine members, verifies each member's machine ownership, and freezes the independent values. It does not expose a combined state transition. DerivedWorkflowState (:232-277) has a private constructor and requires the module derivation proof symbol; direct construction without the validated derivation path throws INVALID_PIPELINE_STATE. PipelineStateDerivationPolicy is the sole local derivation path.

The current tests verify frozen independent inputs, absence of a combined state, rejection of direct derived-state construction, independent machine queries, concurrency separation, restart separation, and read-only query behavior. No projection or derived state is promoted to a canonical lifecycle authority.

## Legacy, cutover, destructive-transition, migration, and security boundary audit

The current implementation is a new canonical path. It contains no legacy writer, legacy reader, PipelineId alias, status snapshot restoration, migration adapter, compatibility translation, or fallback lookup. Historical architecture concerns about alternate pipeline identity, scalar rehydration without provenance, and directly constructible derived state are not present in the pinned current source; they were closed in the preceding remediation round and did not regress.

No destructive operation or migration authority is applicable. No security or authorization capability is duplicated: the DOM implementation does not authenticate actors, authorize commands, handle secrets, or define transport permissions. Any actor/revision/evidence references remain data in the domain contract, consistent with the SPEC security boundary.

## Caller-as-authority and temporal proof audit

CALLER_AS_AUTHORITY_CHECK=PASS.

The caller supplies a requested canonical identity and target transition plus an expected revision for optimistic concurrency. The application resolves and revalidates the canonical identity, loads the current aggregate, and delegates semantic transition validation to WorkflowPipeline. It does not accept a caller-provided current stage, status, derived state, or unvalidated provenance as truth. Supplied rehydration provenance is compared to accepted authority rather than trusted merely because it is shape-valid.

TEMPORAL_AUTHORITY_PROOF=NOT_APPLICABLE.

This ticket performs in-memory/domain validation and a repository CAS contract; it does not commit a mutable external effect whose authority can change between proof and commit. The rehydration proof is deliberately completed against one immutable accepted candidate before materialization. The repository's expected-revision CAS is the concurrency boundary for advances. Productive physical replay/recovery and any temporal coordination with PLAT remain integrated proof obligations, already classified as REQUIRED_FOR_INTEGRATED_PROOF.

## Executable architecture guards and evidence

Architecture guard tests run: 3 guard groups, all passing within the focused T004 suite:

1. Canonical identity and authority guards: unregistered/alias/wrong-kind identity rejection, missing accepted provenance rejection, and no authority mutation on failed materialization (tests/dom-001-ticket-004.test.ts identity and provenance tests).
2. Productive-domain import guard: source inspection rejects forbidden prototype, filesystem, network, ORM, database, and transport imports (tests/dom-001-ticket-004.test.ts architecture import guard).
3. State-authority guards: independent frozen machine inputs and rejection of direct DerivedWorkflowState construction (tests/dom-001-ticket-004.test.ts separate-state test).

Executable verification performed against the pinned semantic state:

~~~
prototype/node_modules/.bin/tsx.cmd --test tests/dom-001-ticket-004.test.ts
15 passed, 0 failed, 0 skipped

prototype/node_modules/.bin/tsc.cmd --noEmit --target ES2022 --module NodeNext --moduleResolution NodeNext --strict <all current src/domain and src/application files>
exit code 0
~~~

MISSING_ARCHITECTURE_GUARDS=0. The tests are direct architecture witnesses rather than proxy-only behavior tests for the audited boundaries. No production source or test file was modified by this audit.

## Baseline drift and reassessment

~~~
BASELINE_DRIFT_STATUS=DRIFT_ASSESSED
AUDIT_BASIS_STALE=NO
REASSESSMENT_COMPLETE=YES
FINDINGS_ARE_ACTIONABLE=NO
BASELINE_REMEDIATION_READINESS=READY
~~~

The prior canonical implementation audit was a RE_AUDIT against the earlier T004 semantic baseline beginning at 646f5c67ffe0cdd9e0abeb9df0489ecb4f4a3b24, with architecture source findings reported as zero. The current pinned target differs in the T004 ticket, test, evidence, and approved design fingerprints while the production pipeline/application fingerprints remain the supplied current values. The drift was assessed rather than assumed stale.

~~~
BASELINE_REASSESSMENT_PROOF:
  OLD_AUTHORITY_BASELINE=ADR-0001/0002/0006 rev3; SPEC-DOM-001; approved Gap Matrix; conformant Plan; prior approved T004 design DBEFC66E...; prior canonical audit basis
  CURRENT_AUTHORITY_BASELINE=ADR-0001/0002/0006 and current SPEC/Gap Matrix/Plan/Plan Audit/Ticket-Set fingerprints listed above; current T004 design 4165C0E...4D8C
  OLD_REPOSITORY_BASELINE=HEAD/semantic baseline 646f5c67ffe0cdd9e0abeb9df0489ecb4f4a3b24 plus prior T004 test/evidence/ticket state
  CURRENT_REPOSITORY_BASELINE=HEAD 6b31bcee1591c8b2e6499a434950664077b2be01 plus the exact current T004 semantic fingerprints listed above
  AUTHORITY_DRIFT_CLASSIFICATION=NO_RELEVANT_NORMATIVE_DRIFT; design-basis refresh assessed and accepted requirements preserved
  REPOSITORY_DRIFT_CLASSIFICATION=T004_WORKTREE_DRIFT_ASSESSED; production pipeline/application unchanged; current ticket/test/evidence reconciled
  REQUIREMENTS_PRESERVED=DOM-PIPE-001; DOM-STATE-001; O-009; O-010; AC-DOM-009; AC-DOM-010
  ADDED_REQUIREMENTS=NONE
  REMOVED_REQUIREMENTS=NONE
  GAP_RECLASSIFICATION=NONE
  OBSOLETE_GAPS=NONE
  NEWLY_REQUIRED_GAPS=NONE
  DEPENDENCY_RECORDS_PRESERVED=CAP-PLAT-SNAPSHOT-PIPELINE-PROVENANCE; PCP-PLAT-04; integrated-only classification
  STALE_EVIDENCE_REPLACED=prior T004 direct-witness/evidence basis; current order, rehydration, isolation, provenance evidence and 15/15 focused execution
  ARCHITECTURE_FINDINGS_BEFORE=0 current prior-round architecture findings; historical initial architecture findings were closed before this round
  ARCHITECTURE_FINDINGS_AFTER=0
  ARCHITECTURE_GUARD_TESTS_AFTER=3 guard groups passing
  INTEGRATED_ONLY_CONSUMPTION_GAPS_AFTER=1 expected PLAT productive-availability handoff
  REMEDIATION_SCOPE=none for architecture; only current-state evidence/design-basis reassessment was required
  REVALIDATION_CRITERIA=ownership; canonical authority; identity; immutability; lineage/reconstruction; PLAT seam; caller authority; temporal applicability; legacy/migration/security scope; executable guards
  REASSESSMENT_COMPLETE=YES
~~~

AUDIT_ESCAPE_COUNT=0. No prior architecture finding remains present, no architecture finding regressed, and no new architecture finding was discovered. The integrated PLAT availability handoff is preserved with its upstream dependency classification and is not converted into a local architecture finding.

## Findings

No architecture-boundary findings are emitted for the pinned current T004 state.

Because the finding set is empty, per-finding completion fields are vacuous:

~~~
FINDING_COMPLETION_FIELDS_APPLICABLE=NO_FINDINGS
FINDING_STATUS=NONE
FINDING_CATEGORY=NONE
CAPABILITY=NONE
DEPENDENCY_CLASS=NONE
LOCAL_CLOSURE_BLOCKING=NO
LOCAL_ACCEPTANCE_REQUIRES_PRODUCTIVE_CAPABILITY=NO
CLOSURE_OWNERSHIP=NONE
DEPENDENCY_CLASS_RECLASSIFICATION_REQUIRED=NO
UPSTREAM_DEPENDENCY_CLASSIFICATION_PRESERVED=YES
PRIMARY_ROUTE=NONE
DOWNSTREAM_CHECKPOINT=NONE
DOWNSTREAM_OWNER=NONE
~~~

## Specialist result summary

Audit: docs/tickets/SPEC-DOM-001/DOM-001-TICKET-004-architecture-boundaries-audit.md

Specialist:
ARCHITECTURE_BOUNDARIES

Ticket: DOM-001-TICKET-004

Ownership errors: 0
Foreign capability duplication: 0
Authority violations: 0
Identity violations: 0
Immutability/lineage violations: 0
Legacy authority violations: 0

Architectural authority gaps: 0
Authority consumption gaps: 1
Producer/consumer contract errors: 0
Temporal authority gaps: 0
Caller-supplied authority bypasses: 0
Missing architecture guards: 0
Architecture guard tests run: 3

Findings:
CRITICAL=0
MAJOR=0
MINOR=0
INFO=0

Domain audit complete:
YES

Specialist result:
SPECIALIST_ARCHITECTURE_PASS

