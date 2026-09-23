# EXEC-001-TICKET-002 — Implementation Remediation

## 1. Remediation Verdict

```text
REMEDIATION_SKILL = remediate-implemented-ticket
TICKET_IMPLEMENTATION_REMEDIATION = AUTHORIZED
TICKET_IMPLEMENTATION_REMEDIATION_VERDICT = TICKET_IMPLEMENTATION_REMEDIATION_COMPLETE
TICKET_GATE = READY_FOR_REAUDIT
STATUS = VALIDATION_REQUIRED
INDEPENDENT_APPROVAL = NOT_PERFORMED
```

The round-5 canonical implementation audit is complete, current, actionable,
and routes this ticket to remediation. Seven canonical findings block local
completion. All seven were revalidated and corrected within the frozen
implementation/evidence boundary. `IMA-CRITICAL-001` and `IMA-MAJOR-011` are
integrated-only findings and remain open, traceable, and routed to their
owning integrated/plan checkpoints. No finding was closed by fixture evidence
or by promoting productive foreign availability.

This record is remediation evidence and a self-check only. It is not an
independent audit, final conformance verdict, approval, checkpoint commit, or
DONE transition.

## 2. Ticket

```text
TICKET_ID = EXEC-001-TICKET-002
TICKET_PATH = docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-version-registry-catalogs-capabilities.md
TICKET_FOLDER = docs/tickets/SPEC-EXEC-001
IMPLEMENTATION_UNIT = EXEC-IMP-02 — Version, registry resolution, catalogs and capability extensibility
IMPLEMENTATION_DESIGN_PATH = docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-implementation-design.md
CANONICAL_AUDIT_PATH = docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-implementation-audit.md
AUDIT_ROUND = RE_AUDIT / round 5
AUDIT_HEAD = cc3fe3210eaebf8e0f577f7f5e1e48b97ed175bb
REMEDIATION_START_HEAD = 8f62b283b1dbf487911c7c459db95cadc25ff101
CURRENT_HEAD = 8f62b283b1dbf487911c7c459db95cadc25ff101
AUDIT_TARGET_STATE_FINGERPRINT = d9da64d8a9ae6a490737bc93789929e656559d2463d06916d4704439d2d20c22
BASELINE_DRIFT_STATUS = NO_DRIFT before edits
REASSESSMENT_COMPLETE = YES
FINDINGS_ARE_ACTIONABLE = YES
BASELINE_REMEDIATION_READINESS = READY before edits
AUDIT_BASIS_STALE = YES after authorized edits
WORKTREE_REMEDIATION_STATE = UNCOMMITTED; intentional remediation edits are present
```

The semantic source/test paths were byte-identical to the audited target before
this remediation. The pinned HEAD is unchanged; the working tree now contains
only the remediation delta and permitted evidence updates. The audit basis is
stale after these edits by design and must not be reused as independent proof.

## 3. Baseline Validation

| Check | Result |
|---|---|
| Controller pinned start HEAD | `8f62b283b1dbf487911c7c459db95cadc25ff101` |
| Canonical audit target HEAD | `cc3fe3210eaebf8e0f577f7f5e1e48b97ed175bb` |
| Semantic state before edits | Equal to the canonical target; no source/test drift |
| Authority/planning state before edits | Equal to the audited ADR/SPEC/Gap Matrix/Plan/design basis |
| Workspace before edits | Clean |
| Current HEAD after edits | Unchanged at `8f62b283b1dbf487911c7c459db95cadc25ff101` |
| Canonical verdict | `TICKET_IMPLEMENTATION_REMEDIATION_REQUIRED` |
| Canonical ticket gate | `NOT_READY_FOR_DONE` |
| Finding completeness | `PASS` |
| Baseline drift before remediation | `NO_DRIFT` |
| Reassessment/actionability | `REASSESSMENT_COMPLETE = YES`; `FINDINGS_ARE_ACTIONABLE = YES` |
| Post-edit audit basis | Stale because authorized semantic remediation changed the working tree |

No upstream authority, ticket goal/scope, dependency class, approved design,
productive foreign capability, audit artifact, merge, push, publication, or
commit was changed. `IMA-CRITICAL-001` and `IMA-MAJOR-011` retain
`REQUIRED_FOR_INTEGRATED_PROOF`, `PRODUCTIVE_AVAILABILITY = NO`, and
`LOCAL_CLOSURE_BLOCKING = NO`.

## 4. Canonical Findings Received

The canonical IMA inventory, not a parallel specialist backlog, controls this
remediation. Every finding was revalidated against the pre-edit implementation.

| Finding | Severity | Blocks done | Revalidation and disposition |
|---|---:|---:|---|
| `IMA-CRITICAL-001` | CRITICAL | NO | Confirmed integrated DOM/REPO producer unavailability; remains OPEN and routed to `IMPLEMENTATION_PLAN_REVALIDATION`. |
| `IMA-CRITICAL-003` | CRITICAL | YES | Confirmed writable resolver dependency, status-only public predicates, and missing durable result/request binding; fixed by RU-001. |
| `IMA-CRITICAL-005` | CRITICAL | YES | Confirmed forged schema-shaped input passed exported binding proof; fixed by RU-001. |
| `IMA-MAJOR-008` | MAJOR | YES | Confirmed coercible non-string category was retained as authority; fixed by RU-002. |
| `IMA-MAJOR-009` | MAJOR | YES | Confirmed bootstrap ordering had only a proxy witness; fixed by RU-003 with an observable normal-work source non-invocation witness. |
| `IMA-MAJOR-010` | MAJOR | YES | Confirmed source scanning was the only architecture guard; fixed by RU-004 with an executable import-boundary loader and forbidden-import negative witness. |
| `IMA-MAJOR-011` | MAJOR | NO | Confirmed physical CAS/concurrent productive producer is unavailable; remains OPEN and routed to the PLAT/integrated checkpoint. |
| `IMA-MINOR-002` | MAJOR-normalized | YES | Confirmed stale ticket/evidence totals; reconciled to exact current commands and outputs by RU-005. |
| `IMA-MINOR-003` | MINOR | YES | Confirmed raw `CatalogRevision` overflow/repeating progression; fixed by RU-006. |

```text
CANONICAL_FINDINGS_RECEIVED = 9
BLOCKING_FINDINGS_RECEIVED = 7
INTEGRATED_ONLY_FINDINGS_RECEIVED = 2
FINDINGS_REJECTED_BY_NEW_EVIDENCE = 0
FINDINGS_BLOCKED = 0
```

### Canonical finding authority and evidence intake

| Finding | Source findings | Gaps / requirements / acceptance | Normative/design authority | Repository and test evidence | Minimum correction / route |
|---|---|---|---|---|---|
| `IMA-CRITICAL-001` | `BEH-MAJOR-002`, `IDC-MAJOR-003`, `ARCH-MAJOR-001` | `GAP-006/008/010/011`; registry 001/002, capability 001/002; `AC-EXEC-008/009/011/012` | Ticket §§13–14b; Design §§7,16–18; capability completion contract | Productive DOM/REPO issuers absent; fixture/copy/stale negatives pass; productive positive witness absent | Owner-authenticated productive issuer and integrated positives; `IMPLEMENTATION_PLAN_REVALIDATION`; OPEN integrated-only |
| `IMA-CRITICAL-003` | `BEH-CRITICAL-001`, `IDC-CRITICAL-001`, `IDC-MAJOR-002` | `GAP-006/010/011`; capability 001/002, registry 003; `AC-EXEC-010/011/012` | Design §§7,16–17; authority-provenance contract | Writable resolver dependency and status-only predicates; mutation/forgery/request-binding negatives absent | Freeze dependency; authenticate result, request, basis and schema; `IMPLEMENTATION_REMEDIATION`; RU-001 |
| `IMA-CRITICAL-005` | `ARCH-CRITICAL-001` | `GAP-006/010/011`; registry 001, capability 001; `AC-EXEC-008/011/012` | SPEC registry/capability requirements; Design §§7,16; provenance contract | Prototype-shaped schema passed exported binding proof | Require authenticated schema in every comparison; `IMPLEMENTATION_REMEDIATION`; RU-001 |
| `IMA-MAJOR-008` | `BEH-MAJOR-001` | `GAP-006/009/011`; registry 001/003, capability 002; `AC-EXEC-008/010/012` | SPEC registry/bootstrap rules; Design §§9,13,18 | `String(category)` accepted a coercible object and retained the object | Validate original string token; `IMPLEMENTATION_REMEDIATION`; RU-002 |
| `IMA-MAJOR-009` | `BEH-MAJOR-003` | `GAP-009`; registry 003; `AC-EXEC-010` | Ticket AC-EXEC-010/witness matrix; Design §§13,17,20 | Result code was tested but no observable work/enablement non-invocation witness existed | Add owner-bound no-effect/source witness; `IMPLEMENTATION_REMEDIATION`; RU-003 |
| `IMA-MAJOR-010` | `BEH-MAJOR-004` | `GAP-006/008/011`; registry 001/002, capability 002; `AC-EXEC-008/009/012` | Design §20; dependency-direction/auditability contracts | Regex source scan passed but could not fail on a future forbidden import | Executable module loader and negative fixture; `IMPLEMENTATION_REMEDIATION`; RU-004 |
| `IMA-MAJOR-011` | `BEH-MAJOR-005` | `GAP-006/008/011`; registry 001/002, capability 002; `AC-EXEC-008/009/012` | Design §§14,20; plan/ticket CAS boundary | Sequential duplicate tests pass; productive physical one-winner witness absent | Integrated CAS/atomicity proof; `IMPLEMENTATION_PLAN_REVALIDATION`; OPEN integrated-only |
| `IMA-MINOR-002` | `CONF-MAJOR-001`, `BEH-MINOR-002` | `GAP-004/006/008/009/010/011`; all local version/registry/capability requirements; `AC-EXEC-003/004/008/009/010/011/012` | Ticket §§19–20 and completion-evidence contract | Evidence said 16/64/31-style totals while current commands produced 23/71 | Reconcile ticket/evidence to exact target and commands; `TICKET_REVALIDATION`; RU-005 |
| `IMA-MINOR-003` | `BEH-MINOR-001`, `IDC-MINOR-004` | `GAP-006/008`; registry 001/002; `AC-EXEC-008/009` | Design §§6,13–15,20; revision contract | `catalogRevision + 1` could overflow and repeat at `MAX_SAFE_INTEGER` | Domain-owned safe revision value/progression; `IMPLEMENTATION_REMEDIATION`; RU-006 |

## 5. Root Cause Analysis

Root causes were reconstructed across each canonical campaign. Stable campaign
IDs are preserved from the canonical audit.

| Root cause | Campaign | Findings | Category | Result |
|---|---|---|---|---|
| `RC-001` — Resolver and result authority was not durable for the lifetime of the application boundary. | `RCC-EXEC-T002-RESULT-AUTHORITY-001` | `IMA-CRITICAL-003` | `IDENTITY_LINEAGE`, `AUTHORITY_PROVENANCE`, `TESTABILITY` | Removed locally. |
| `RC-002` — Schema comparison treated matching shape as canonical schema identity. | `RCC-EXEC-T002-SCHEMA-PROVENANCE-001` | `IMA-CRITICAL-005` | `AUTHORITY_PROVENANCE`, `CROSS_SPEC_BOUNDARY` | Removed. |
| `RC-003` — Registry input validation coerced an authority-bearing category before validation. | `RCC-EXEC-REGISTRY-AUTHORITY-SURFACE` | `IMA-MAJOR-008` | `BEHAVIOR`, `OWNERSHIP` | Removed. |
| `RC-004` — Bootstrap before-work ordering lacked an executable owner-bound no-effect witness. | `RCC-EXEC-T002-BOOTSTRAP-WITNESS-001` | `IMA-MAJOR-009` | `TEST_COVERAGE`, `READINESS_HANDOFF` | Removed. |
| `RC-005` — Architecture conformance relied on source text rather than an executable failure boundary. | `RCC-EXEC-T002-ARCHITECTURE-GUARD-001` | `IMA-MAJOR-010` | `DEPENDENCY_DIRECTION`, `TESTABILITY` | Removed. |
| `RC-006` — Ticket execution evidence was not regenerated after the target/test surface changed. | `RCC-EXEC-T002-TICKET-TRACEABILITY-001` | `IMA-MINOR-002` | `COMPLETION_EVIDENCE` | Removed in permitted ticket/evidence records. |
| `RC-007` — Catalog revision progression bypassed a domain-owned safe value boundary. | `RCC-EXEC-T002-REVISION-BOUNDARY-001` | `IMA-MINOR-003` | `INVARIANT_PLACEMENT`, `DOMAIN_MODEL` | Removed. |
| `RC-008` — Productive DOM/REPO issuers and direct integrated witnesses are absent. | `RCC-EXEC-T002-AUTHORITY-PROVENANCE-001` | `IMA-CRITICAL-001` | `CAPABILITY_AVAILABILITY`, `CROSS_SPEC_BOUNDARY` | Open integrated-only; outside ticket authority. |
| `RC-009` — Physical registry persistence/CAS behavior is not available at this boundary. | `RCC-EXEC-T002-INTEGRATED-CAS-001` | `IMA-MAJOR-011` | `CONCURRENCY`, `PERSISTENCE` | Open integrated-only; outside ticket authority. |

## 6. Affected Radius

The expanded-radius gate was applied to the persistent authority and evidence
campaigns. The following surfaces were inspected and classified before edits:

| Campaign | Issuers/registrars | Consumers | Alternate/injection paths | Mutation/stale paths | Public/test/foreign paths |
|---|---|---|---|---|---|
| Result authority | `RegistryResolutionService`, `ResolveExecCapability` | domain result predicates and application consumer | resolver constructor, subclass/structural fake, copied result | post-construction resolver replacement; request/basis/schema/version/role mismatch | public result helpers; direct forgery tests; no foreign redesign |
| Schema provenance | `RegistryEntry` and schema comparison | result/request binding | forged prototype-shaped schema | schema copy/mismatch | exported binding proof; direct forged-schema test |
| Registry input | `RegistryEntry.create` | `CatalogBasis`, bootstrap policy | coercible category object | invalid category registration | entry validation and no-mutation tests |
| Bootstrap witness | bootstrap resolver and catalog selection | normal-work/enablement source seam | normal source injection | bootstrap rejection before normal source read | direct source non-invocation witness |
| Architecture guard | productive EXEC module graph | composition/runtime loader | forbidden infrastructure/prototype/transport import | future dependency introduction | executable loader plus forbidden-import fixture |
| Evidence traceability | ticket record and eight AC evidence files | audit/re-audit consumer | stale execution totals | target/test-surface changes | exact command outputs and target HEAD |
| Catalog revision | `CatalogRevision`, `CatalogBasis.register` | application source binding and registry result | raw/unsafe numeric revision | MAX_SAFE_INTEGER progression and no-mutation | boundary tests and immutable basis identity |
| Integrated authority/CAS | future DOM/REPO/PLAT producers | EXEC integrated checkpoint | foreign producer/substitution paths | physical concurrent publication | OUTSIDE_SCOPE; routed to owning phase |

```text
CAMPAIGN_MATRIX_COMPLETE = YES for remediation scope
ALL_SURFACE_ROWS_COVERED = YES for remediation scope
OUTSIDE_SCOPE_ROWS = explicitly routed to integrated/plan owners
```

### Negative witness matrix

| Witness | Finding/campaign | Result |
|---|---|---|
| Authenticated frozen result and request/basis binding | `IMA-CRITICAL-003` | PASS; mutable use-case dependency, copied result, mismatch and public status-shaped values are rejected. |
| Forged/copy schema reference | `IMA-CRITICAL-005` | PASS; exported binding requires authenticated schema identity. |
| Coercible category object | `IMA-MAJOR-008` | PASS; non-string category fails before registration. |
| Bootstrap normal-work source | `IMA-MAJOR-009` | PASS; bootstrap rejection does not invoke the observable NORMAL source/work seam. |
| Forbidden import fixture | `IMA-MAJOR-010` | PASS; loader rejects infrastructure import; real graph loads successfully. |
| Exact evidence command/output reconciliation | `IMA-MINOR-002` | PASS; focused 23/23, package 71/71, TICKET-001 21/21, typecheck and governance guards pass. |
| MAX_SAFE_INTEGER revision progression | `IMA-MINOR-003` | PASS; overflow fails closed and the original basis remains unchanged. |
| Productive DOM/REPO source receipt and physical CAS | `IMA-CRITICAL-001`, `IMA-MAJOR-011` | NOT_APPLICABLE to local remediation; integrated owner/checkpoint retained and not marked resolved. |

```text
ALL_NEGATIVE_WITNESSES_PASS = YES for local remediation scope
NO_UNEXPLAINED_PUBLIC_AUTHORITY_PATH = YES for local scope
NO_HIDDEN_CONCRETE_PROTOCOL = YES for local scope
```

## 7. Remediation Units

### RU-001 — Authenticate resolver results and schema provenance

```text
REMEDIATION_UNIT_ID = RU-001
ROOT_CAUSE_IDS = RC-001, RC-002
CANONICAL_FINDINGS = IMA-CRITICAL-003, IMA-CRITICAL-005
BEHAVIOR_TO_CORRECT = only authenticated, request/basis/schema/version/role-bound results are recognized; forged schema-shaped input fails closed
STRUCTURE_TO_CORRECT = freeze the application dependency boundary; authenticate every public result predicate and schema comparison
FILES_EXPECTED = src/domain/exec-registry.ts; src/application/exec-registry.ts; tests/exec-001-ticket-002.test.ts
TESTS_REQUIRED = copied/forged result, post-construction resolver mutation, alternate resolver, forged schema and request mismatch negatives
DESIGN_BOUNDARIES_TO_PRESERVE = RegistryResolutionService owns domain decisions; application orchestrates; no effect callback or foreign lifecycle
OWNERSHIP_CONSTRAINTS = no caller-supplied result/provenance authority; no productive foreign capability promotion
DEPENDENCY_CONSTRAINTS = DOM/REPO remain REQUIRED_FOR_INTEGRATED_PROOF
REGRESSION_RISKS = status-shaped result acceptance, stale request acceptance, schema authority bypass
COMPLETION_PROOF = focused 23/23, full 71/71, typecheck and direct negative witnesses
```

### RU-002 — Validate registry category without coercion

```text
REMEDIATION_UNIT_ID = RU-002
ROOT_CAUSE_IDS = RC-003
CANONICAL_FINDINGS = IMA-MAJOR-008
BEHAVIOR_TO_CORRECT = only an allowed string category is accepted and retained
STRUCTURE_TO_CORRECT = validate the original authority-bearing token before storage
FILES_EXPECTED = src/domain/exec-registry.ts; tests/exec-001-ticket-002.test.ts
TESTS_REQUIRED = toString-coercible object rejection and normal/bootstrap category behavior
DESIGN_BOUNDARIES_TO_PRESERVE = RegistryEntry remains the domain owner of entry invariants
OWNERSHIP_CONSTRAINTS = no category-specific alternate registry
DEPENDENCY_CONSTRAINTS = none added
REGRESSION_RISKS = coercion or category mutation reappearing
COMPLETION_PROOF = focused and full suites pass
```

### RU-003 — Provide a direct bootstrap before-work witness

```text
REMEDIATION_UNIT_ID = RU-003
ROOT_CAUSE_IDS = RC-004
CANONICAL_FINDINGS = IMA-MAJOR-009
BEHAVIOR_TO_CORRECT = bootstrap rejection occurs without invoking the observable NORMAL work/enablement source seam
STRUCTURE_TO_CORRECT = preserve the no-effect registry boundary; do not reintroduce a caller work callback
FILES_EXPECTED = tests/exec-001-ticket-002.test.ts
TESTS_REQUIRED = bootstrap normal capability rejection, noApproval/noMutation, normal source non-invocation
DESIGN_BOUNDARIES_TO_PRESERVE = registry returns resolution only; downstream work remains downstream-owned
OWNERSHIP_CONSTRAINTS = no local execution/effect authority
DEPENDENCY_CONSTRAINTS = no dependency reclassification
REGRESSION_RISKS = callback/effect orchestration returning to registry
COMPLETION_PROOF = direct source non-invocation witness and focused/full suites
```

### RU-004 — Enforce the import boundary at module load time

```text
REMEDIATION_UNIT_ID = RU-004
ROOT_CAUSE_IDS = RC-005
CANONICAL_FINDINGS = IMA-MAJOR-010
BEHAVIOR_TO_CORRECT = forbidden infrastructure/prototype/transport/.pi imports fail at executable module resolution
STRUCTURE_TO_CORRECT = add a test-owned Node loader guard; retain source scan only as supplementary evidence
FILES_EXPECTED = tests/exec-001-ticket-002.test.ts; tests/exec-registry-import-boundary-loader.mjs; tests/fixtures/exec-registry-forbidden-import.mjs
TESTS_REQUIRED = allowed production graph load and forbidden import fixture failure
DESIGN_BOUNDARIES_TO_PRESERVE = domain/application/composition dependency direction and no infrastructure leakage
OWNERSHIP_CONSTRAINTS = test guard only; no production loader or architecture redesign
DEPENDENCY_CONSTRAINTS = no new production dependency
REGRESSION_RISKS = guard becomes source-text-only or misses a forbidden import
COMPLETION_PROOF = executable loader positive/negative witness; focused/full suites
```

### RU-005 — Reconcile exact target-bound completion evidence

```text
REMEDIATION_UNIT_ID = RU-005
ROOT_CAUSE_IDS = RC-006
CANONICAL_FINDINGS = IMA-MINOR-002
BEHAVIOR_TO_CORRECT = ticket record and required AC evidence identify exact commands, target and current counts
STRUCTURE_TO_CORRECT = evidence only; frozen scope, authority and status remain unchanged
FILES_EXPECTED = ticket §27; docs/tickets/SPEC-EXEC-001/evidence/TICKET-002/AC-EXEC-003,005,007,008,009,010,011,012; remediation report
TESTS_REQUIRED = exact focused/full/TICKET-001 commands and guard output
DESIGN_BOUNDARIES_TO_PRESERVE = no authority or implementation redesign
OWNERSHIP_CONSTRAINTS = preserve ticket-record workflow ownership and independent re-audit
DEPENDENCY_CONSTRAINTS = no dependency reclassification
REGRESSION_RISKS = stale totals, ambiguous target, or evidence claiming DONE
COMPLETION_PROOF = exact 23/23 and 71/71 outputs plus target HEAD recorded
```

### RU-006 — Make CatalogRevision a domain-owned safe value boundary

```text
REMEDIATION_UNIT_ID = RU-006
ROOT_CAUSE_IDS = RC-007
CANONICAL_FINDINGS = IMA-MINOR-003
BEHAVIOR_TO_CORRECT = revisions are authenticated values; progression rejects unsafe overflow and preserves old basis
STRUCTURE_TO_CORRECT = CatalogRevision owns creation, equality and next progression; application compares authenticated values
FILES_EXPECTED = src/domain/exec-registry.ts; src/application/exec-registry.ts; tests/exec-001-ticket-002.test.ts
TESTS_REQUIRED = MAX_SAFE_INTEGER overflow, invalid revision, exact source/basis binding and no mutation
DESIGN_BOUNDARIES_TO_PRESERVE = semantic revision remains distinct from SemanticVersion and physical CAS
OWNERSHIP_CONSTRAINTS = no persistence or foreign revision authority
DEPENDENCY_CONSTRAINTS = no new normative dependency
REGRESSION_RISKS = raw-number transport, rounded revision, or basis identity drift
COMPLETION_PROOF = focused/full tests and typecheck pass
```

All units pass the frozen-scope guard. They are required by canonical findings,
remain inside EXEC-IMP-02 implementation/evidence scope, preserve Does Not
Implement, preserve owner boundaries and add no product behavior outside the
approved contract.

## 8. Finding Closure

| Finding | Root cause | Unit | Fixed files | Closure evidence | Disposition |
|---|---|---|---|---|---|
| `IMA-CRITICAL-001` | `RC-008` | none | none | Productive DOM/REPO issuer remains unavailable; handoff preserved | `OPEN_INTEGRATED_ONLY` |
| `IMA-CRITICAL-003` | `RC-001` | `RU-001` | domain/application/test | authenticated frozen application dependency, result WeakSet, request binding, forged/copy/mismatch tests | `VALIDATED_AND_REMEDIATED` |
| `IMA-CRITICAL-005` | `RC-002` | `RU-001` | domain/test | `acceptsSchema` and request binding require authenticated schema; forged schema test | `VALIDATED_AND_REMEDIATED` |
| `IMA-MAJOR-008` | `RC-003` | `RU-002` | domain/test | strict original-token category validation and coercion negative | `VALIDATED_AND_REMEDIATED` |
| `IMA-MAJOR-009` | `RC-004` | `RU-003` | test | observable NORMAL source/work seam is not invoked for bootstrap rejection | `VALIDATED_AND_REMEDIATED` |
| `IMA-MAJOR-010` | `RC-005` | `RU-004` | test/loader/fixture | runtime graph import passes; forbidden dependency child process fails | `VALIDATED_AND_REMEDIATED` |
| `IMA-MAJOR-011` | `RC-009` | none | none | physical CAS/productive producer unavailable; integrated owner route preserved | `OPEN_INTEGRATED_ONLY` |
| `IMA-MINOR-002` | `RC-006` | `RU-005` | ticket/evidence/remediation | exact target, commands and 23/71 totals recorded | `VALIDATED_AND_REMEDIATED` |
| `IMA-MINOR-003` | `RC-007` | `RU-006` | domain/application/test | authenticated `CatalogRevision`, overflow rejection and no-mutation test | `VALIDATED_AND_REMEDIATED` |

```text
FINDINGS_REMEDIATED = 7
FINDINGS_ALREADY_RESOLVED = 0
FINDINGS_REJECTED_BY_NEW_EVIDENCE = 0
FINDINGS_PARTIALLY_REMEDIATED = 0
FINDINGS_BLOCKED = 0
```

### Append-only finding lineage ledger

| Finding | Campaign | Round | Status | Origin | Previous finding IDs | Evidence delta | Units | Target state |
|---|---|---:|---|---|---|---|---|---|
| `IMA-CRITICAL-001` | `RCC-EXEC-T002-AUTHORITY-PROVENANCE-001` | 5→remediation | `STILL_PRESENT` | PREEXISTING | `IMA-CRITICAL-001` | no productive issuer; local scope remains isolated | none | HEAD `8f62...` + uncommitted delta |
| `IMA-CRITICAL-003` | `RCC-EXEC-T002-RESULT-AUTHORITY-001` | 5→remediation | `RESOLVED_PENDING_REAUDIT` | PREEXISTING | `IMA-CRITICAL-003` | durable result/request binding and public auth negatives | `RU-001` | HEAD `8f62...` + uncommitted delta |
| `IMA-CRITICAL-005` | `RCC-EXEC-T002-SCHEMA-PROVENANCE-001` | 5→remediation | `RESOLVED_PENDING_REAUDIT` | NEW_PREEXISTING / ARCHITECTURE_ESCAPE | none | authenticated schema comparison and forged witness | `RU-001` | HEAD `8f62...` + uncommitted delta |
| `IMA-MAJOR-008` | `RCC-EXEC-REGISTRY-AUTHORITY-SURFACE` | 5→remediation | `RESOLVED_PENDING_REAUDIT` | NEW_PREEXISTING / BEHAVIOR_ESCAPE | none | strict category token validation | `RU-002` | HEAD `8f62...` + uncommitted delta |
| `IMA-MAJOR-009` | `RCC-EXEC-T002-BOOTSTRAP-WITNESS-001` | 5→remediation | `RESOLVED_PENDING_REAUDIT` | NEW_PREEXISTING / BEHAVIOR_ESCAPE | none | direct source non-invocation witness | `RU-003` | HEAD `8f62...` + uncommitted delta |
| `IMA-MAJOR-010` | `RCC-EXEC-T002-ARCHITECTURE-GUARD-001` | 5→remediation | `RESOLVED_PENDING_REAUDIT` | NEW_PREEXISTING / BEHAVIOR_ESCAPE | none | executable loader and negative fixture | `RU-004` | HEAD `8f62...` + uncommitted delta |
| `IMA-MAJOR-011` | `RCC-EXEC-T002-INTEGRATED-CAS-001` | 5→remediation | `STILL_PRESENT` | NEW_PREEXISTING / BEHAVIOR_ESCAPE | none | no local claim; integrated handoff retained | none | HEAD `8f62...` + uncommitted delta |
| `IMA-MINOR-002` | `RCC-EXEC-T002-TICKET-TRACEABILITY-001` | 5→remediation | `RESOLVED_PENDING_REAUDIT` | PREEXISTING | `IMA-MINOR-002` | ticket/evidence counts regenerated | `RU-005` | HEAD `8f62...` + uncommitted delta |
| `IMA-MINOR-003` | `RCC-EXEC-T002-REVISION-BOUNDARY-001` | 5→remediation | `RESOLVED_PENDING_REAUDIT` | NEW_PREEXISTING / DESIGN_ESCAPE | none | value boundary and overflow proof | `RU-006` | HEAD `8f62...` + uncommitted delta |

```text
FINDING_LINEAGE_LEDGER_COMPLETE = YES
BASE_REPORT_IMMUTABLE = YES
```

`RESOLVED_PENDING_REAUDIT` is remediation evidence terminology; only the
independent re-audit may set canonical `FINDING_STATUS = RESOLVED`.

## 9. Root Cause Closure

| Root cause/campaign | Root cause removed | Radius checked | Known manifestations closed | Systemic evidence | Structural boundary restored |
|---|---|---|---|---|---|
| `RC-001` result authority | YES | YES | YES | PRESENT | YES |
| `RC-002` schema provenance | YES | YES | YES | PRESENT | YES |
| `RC-003` category authority | YES | YES | YES | PRESENT | YES |
| `RC-004` bootstrap witness | YES | YES | YES | PRESENT | YES |
| `RC-005` architecture guard | YES | YES | YES | PRESENT | YES |
| `RC-006` stale evidence | YES | YES | YES | PRESENT | NOT_APPLICABLE |
| `RC-007` revision boundary | YES | YES | YES | PRESENT | YES |
| `RC-008` integrated producer authority | NO | YES | NO; outside owner | MISSING locally by design | NO; routed |
| `RC-009` physical CAS | NO | YES | NO; outside owner | MISSING locally by design | NO; routed |

```text
ROOT_CAUSES_IDENTIFIED = 9
ROOT_CAUSES_CLOSED = 7 local
SYSTEMIC_ROOT_CAUSES = 2
AFFECTED_RADIUS_CHECKED = YES
KNOWN_LOCAL_MANIFESTATIONS_CLOSED = YES
ROOT_CAUSE_CLOSURE_PROOF_COMPLETE = YES for local blocking scope
```

The two open campaigns are not local remediation failures; they remain
integrated-only and retain their primary routes and downstream owners.

## 10. Design Conformance Reconciliation

The approved Implementation Design remains the structural authority. The
changes restore result/schema authority, input validation, revision value
semantics and test enforcement without introducing persistence, effects,
foreign lifecycle, a second registry, or a generic framework.

```text
DOMAIN_MODEL_CONFORMANT = YES
AGGREGATE_BOUNDARIES_CONFORMANT = YES
INVARIANT_PLACEMENT_CONFORMANT = YES
COMPONENT_BOUNDARIES_CONFORMANT = YES
SOLID_CONFORMANT = YES
DEPENDENCY_DIRECTION_CONFORMANT = YES
CLEAN_CODE_STRUCTURALLY_ACCEPTABLE = YES
CROSS_SPEC_BOUNDARY_CONFORMANT = YES for local consumer boundary
UNJUSTIFIED_COMPONENT_COLLAPSES = 0
MISSING_REQUIRED_COMPONENTS = 0
AGGREGATE_BOUNDARY_VIOLATIONS = 0
DOMAIN_INVARIANT_BYPASSES = 0
UNENFORCED_INVARIANTS = 0
DOMAIN_RULE_DUPLICATION = 0
ANEMIC_DOMAIN_MODEL_INTRODUCED = NO
FAT_APPLICATION_SERVICE_INTRODUCED = NO
GOD_COMPONENTS_INTRODUCED = 0
UNJUSTIFIED_SOLID_VIOLATIONS = 0
DEPENDENCY_DIRECTION_VIOLATIONS = 0
INFRASTRUCTURE_LEAKAGE_POINTS = 0
IMPLEMENTATION_DESIGN_REVALIDATION_REQUIRED = NO
```

## 11. Files Changed

```text
CHANGED_PRODUCTION_FILES = 2
  src/domain/exec-registry.ts
  src/application/exec-registry.ts
CHANGED_TEST_FILES = 3
  tests/exec-001-ticket-002.test.ts
  tests/exec-registry-import-boundary-loader.mjs
  tests/fixtures/exec-registry-forbidden-import.mjs
CHANGED_TICKET_EVIDENCE_FILES = 10
  ticket execution record
  8 AC-EXEC-003/005/007/008/009/010/011/012 evidence snapshots
  this remediation report
UPSTREAM_AUTHORITY_FILES_CHANGED = 0
AUDIT_ARTIFACTS_CHANGED = 0
UNRELATED_CHANGE = 0
FOREIGN_SCOPE_CHANGE = 0
NEW_PRODUCT_BEHAVIOR_OUTSIDE_SCOPE = 0
COMMIT_MERGE_PUSH_PUBLISH = NONE
```

## 12. Gap / Requirement / Acceptance Impact

```text
GAPS_PRESERVED = GAP-004, GAP-006, GAP-008, GAP-009, GAP-010, GAP-011
REQUIREMENTS_PRESERVED = EXEC-VERSION-001/002, EXEC-REGISTRY-001/002/003, EXEC-CAPABILITY-001/002
ACCEPTANCE_CRITERIA_AFFECTED = AC-EXEC-003, AC-EXEC-004, AC-EXEC-008, AC-EXEC-009, AC-EXEC-010, AC-EXEC-011, AC-EXEC-012
ACCEPTANCE_CRITERIA_SATISFIED = 7/7 locally after remediation proof
ACCEPTANCE_CRITERIA_NOT_SATISFIED = 0 locally
ACCEPTANCE_CRITERIA_BLOCKED = 0 locally
DEPENDENCY_CLASS_RECLASSIFICATION = NONE
PRODUCTIVE_FOREIGN_AVAILABILITY_PROMOTED = NO
TICKET_SCOPE_EXPANDED = NO
```

The integrated DOM/REPO/CAS proof remains outside local closure and is not
represented as local acceptance or productive availability.

## 13. Tests

| Command | Result |
|---|---|
| `node --experimental-strip-types --test tests/exec-001-ticket-002.test.ts` | 23 passed, 0 failed, 0 skipped |
| `node --experimental-strip-types --test tests/exec-001-ticket-001.test.ts` | 21 passed, 0 failed, 0 skipped |
| `npm test` | 71 passed, 0 failed, 0 skipped |
| `npm run typecheck` | PASS |
| `npm run verify:audit-governance` | PASS |
| `npm run verify:skill-mirror` | PASS |

```text
TESTS_RUN = 6 command groups; 115 passing test executions across focused/TICKET-001/package commands plus required guards
TESTS_PASSED = 23 focused; 21 TICKET-001; 71 package; typecheck/governance/skill mirror PASS
TESTS_FAILED = 0
TESTS_SKIPPED = 0
ENVIRONMENTAL_FAILURES = 0
```

No assertion was weakened. The direct witnesses cover result/schema
provenance, category coercion, bootstrap no-effect ordering, executable import
boundaries, revision overflow, no-mutation, catalog isolation, and the frozen
basis behavior required by the ticket.

## 14. Behavioral Regression Self-Check

```text
REGRESSION_RESULT = NO_REMEDIATION_REGRESSION
ANEMIC_DOMAIN_REGRESSION = NO
GOD_COMPONENT_REGRESSION = NO
FAT_SERVICE_REGRESSION = NO
DIP_REGRESSION = NO
DEPENDENCY_DIRECTION_REGRESSION = NO
INVARIANT_PLACEMENT_REGRESSION = NO
DOMAIN_RULE_DUPLICATION_REGRESSION = NO
TESTABILITY_REGRESSION = NO
CROSS_SPEC_BOUNDARY_REGRESSION = NO
KNOWN_BEHAVIORAL_REMEDIATION_REGRESSIONS = 0
```

The complete diff was inspected. Result recognition is stricter, malformed
category material fails closed, bootstrap selection does not invoke the
normal-work source seam, unsafe revisions do not publish a new basis, and the
import guard is test-owned. No effect, enablement, persistence, or foreign
lifecycle behavior was added.

## 15. Structural Regression Self-Check

```text
STRUCTURAL_REGRESSION_RESULT = NO_REMEDIATION_REGRESSION
DOMAIN_MODEL_PRESERVED = YES
AGGREGATE_BOUNDARIES_PRESERVED = YES
INVARIANT_OWNERSHIP_PRESERVED = YES
POLICY_OWNERSHIP_PRESERVED = YES
CROSS_SPEC_ACL_PRESERVED = YES
FOREIGN_AUTHORITY_REIMPLEMENTED = NO
NEW_ALTERNATE_AUTHORITY = 0
HIDDEN_CONCRETE_PROTOCOL = NO
UNJUSTIFIED_COMPONENT_COLLAPSES = 0
MISSING_REQUIRED_COMPONENTS = 0
KNOWN_STRUCTURAL_REMEDIATION_REGRESSIONS = 0
```

`CatalogRevision` is a domain value boundary, not a persistence mechanism.
The loader is a test guard, not a production architecture layer. The
application remains orchestration-only and the domain remains free of
infrastructure/transport dependencies.

## 16. Ownership / Authority

```text
OWNERSHIP_ERRORS = 0
FOREIGN_CAPABILITY_DUPLICATION = 0
NEW_ALTERNATE_AUTHORITY = 0
IDENTITY_DRIFT = 0
HISTORY_REWRITE = 0
LEGACY_DUAL_WRITER = 0
PRODUCTIVE_FOREIGN_AVAILABILITY_PROMOTED = NO
LOCAL_CLOSURE_RECLASSIFIED = NO
DOM_BOOTSTRAP_AUTHORITY_USED = NO
```

`DOM-EXEC-IDENTITY-SNAPSHOT`, `REPO-EXEC-NORMAL-CATALOG`, and physical CAS
remain integrated-proof capabilities with productive availability `NO`. Their
canonical owners and downstream routes remain intact.

## 17. Completion Evidence

```text
REMEDIATION_EVIDENCE_REQUIRED = production fixes, direct tests, structural guard, exact execution output and ticket evidence
REMEDIATION_EVIDENCE_PRESENT = YES
COMPLETION_EVIDENCE_MISSING = 0 for local remediation
TICKET_EXECUTION_RECORD_STALE = NO after RU-005; independent re-audit must verify
EVIDENCE_COMMANDS_PERSISTED = YES
EVIDENCE_OUTPUT_COUNTS_PERSISTED = YES
EVIDENCE_TARGET_HEAD_PERSISTED = YES
EVIDENCE_NO_MUTATION_PROOF_PERSISTED = YES
EVIDENCE_AUTHORITY_NEGATIVES_PERSISTED = YES
EVIDENCE_ARCHITECTURE_NEGATIVE_PERSISTED = YES
```

## 18. Remaining Blockers

```text
LOCAL_TICKET_BLOCKERS = NONE after remediation self-check
OPEN_INTEGRATED_FINDINGS = IMA-CRITICAL-001; IMA-MAJOR-011
OPEN_INTEGRATED_ROUTE = IMPLEMENTATION_PLAN_REVALIDATION / integrated PLAT checkpoint
OPEN_INTEGRATED_OWNER = DOM/REPO producer owners with EXEC consumer owner; PLAT registry owner
PRODUCTIVE_AVAILABILITY = NO (preserved)
INDEPENDENT_REAUDIT = REQUIRED
```

The integrated findings are not marked resolved by this consumer-side
remediation. No local completion gate is promoted by their absence.

## 19. Pre-Reaudit Self-Check

```text
ALL_LOCAL_TICKET_BLOCKING_FINDINGS_CLOSED = YES
ALL_ROOT_CAUSES_CLOSED = YES for local blocking scope
AFFECTED_RADIUS_CHECKED = YES
REQUIRED_TESTS_PASS = YES
AFFECTED_ACCEPTANCE_CRITERIA_PASS = YES
NO_KNOWN_MATERIAL_BEHAVIOR_REGRESSION = YES
BEHAVIORAL_SELF_CHECK = PASS
STRUCTURAL_SELF_CHECK = PASS
CAMPAIGN_MATRIX_COMPLETE = YES for remediation scope
ALL_SURFACE_ROWS_COVERED = YES for remediation scope
ALL_NEGATIVE_WITNESSES_PASS = YES for remediation scope
NO_UNEXPLAINED_PUBLIC_AUTHORITY_PATH = YES for remediation scope
NO_HIDDEN_CONCRETE_PROTOCOL = YES
SEMANTIC_PROGRESS_PROVEN = YES
ROOT_CAUSE_CLOSURE_PROOF_COMPLETE = YES for local blocking scope
NO_KNOWN_STRUCTURAL_REMEDIATION_REGRESSION = YES
REMEDIATION_PREFLIGHT = PASS
STATUS = VALIDATION_REQUIRED
```

The integrated-only witnesses remain explicitly outside this local gate and are
routed rather than falsely closed.

## 20. Remediation Gate

```text
REMEDIATION_PREFLIGHT_VERSION = 1
CAMPAIGN_MATRIX_COMPLETE = YES
ALL_SURFACE_ROWS_COVERED = YES
ALL_NEGATIVE_WITNESSES_PASS = YES for local remediation scope
NO_UNEXPLAINED_PUBLIC_AUTHORITY_PATH = YES
NO_HIDDEN_CONCRETE_PROTOCOL = YES
SEMANTIC_PROGRESS_PROVEN = YES
ROOT_CAUSE_CLOSURE_PROOF_COMPLETE = YES
NO_KNOWN_MATERIAL_BEHAVIOR_REGRESSION = YES
NO_KNOWN_STRUCTURAL_REMEDIATION_REGRESSION = YES
REMEDIATION_PREFLIGHT = PASS
TICKET_IMPLEMENTATION_REMEDIATION_COMPLETE = YES
TICKET_GATE = READY_FOR_REAUDIT
STATUS = VALIDATION_REQUIRED
NEXT_AUTHORIZED_OPERATION = checkpoint-implemented-ticket
POST_CHECKPOINT_OPERATION = audit-implemented-ticket
```

### Remediation metrics

```text
AUDIT_ROUND = RE_AUDIT / round 5
CANONICAL_FINDINGS_RECEIVED = 9
BLOCKING_FINDINGS_RECEIVED = 7
FINDINGS_REMEDIATED = 7
FINDINGS_ALREADY_RESOLVED = 0
FINDINGS_REJECTED_BY_NEW_EVIDENCE = 0
FINDINGS_PARTIALLY_REMEDIATED = 0
FINDINGS_BLOCKED = 0
ROOT_CAUSES_IDENTIFIED = 9
ROOT_CAUSES_CLOSED = 7 local
SYSTEMIC_ROOT_CAUSES = 2
CAMPAIGNS_TOTAL = 9
CAMPAIGNS_NON_CONVERGING = 2 integrated/open campaigns preserved
CONVERGENCE_STATUS = CONVERGING locally; NON_CONVERGING for integrated handoffs
EXPANDED_RADIUS_REQUIRED = YES; expanded rows recorded for persistent campaigns
REMEDIATION_PREFLIGHT = PASS
REMEDIATION_UNITS = 6
ADDITIONAL_SAME_ROOT_MANIFESTATIONS_FIXED = 6
CHANGED_PRODUCTION_FILES = 2
CHANGED_TEST_FILES = 3
TESTS_RUN = 23 focused; 21 TICKET-001; 71 package; typecheck; governance; skill mirror
TESTS_PASSED = 23 focused; 21 TICKET-001; 71 package; all required gates PASS
TESTS_FAILED = 0
STRUCTURAL_FINDINGS_REMEDIATED = 4
AGGREGATE_BOUNDARY_VIOLATIONS = 0
DOMAIN_INVARIANT_BYPASSES = 0
UNENFORCED_INVARIANTS = 0
DOMAIN_RULE_DUPLICATION = 0
ANEMIC_DOMAIN_MODEL_INTRODUCED = NO
FAT_APPLICATION_SERVICE_INTRODUCED = NO
GOD_COMPONENTS_INTRODUCED = 0
UNJUSTIFIED_SOLID_VIOLATIONS = 0
DEPENDENCY_DIRECTION_VIOLATIONS = 0
INFRASTRUCTURE_LEAKAGE_POINTS = 0
KNOWN_BEHAVIORAL_REMEDIATION_REGRESSIONS = 0
KNOWN_STRUCTURAL_REMEDIATION_REGRESSIONS = 0
OWNERSHIP_ERRORS = 0
FOREIGN_CAPABILITY_DUPLICATION = 0
COMPLETION_EVIDENCE_MISSING = 0
BASE_REPORT_PATH = docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-implementation-audit.md
ROUND_DELTA_PATH = docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-implementation-remediation.md
FINDING_LINEAGE_LEDGER_PATH = docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-implementation-remediation.md#8-finding-closure
BASE_REPORT_IMMUTABLE = YES
ROUND_DELTA_COMPLETE = YES
FINDING_LINEAGE_LEDGER_COMPLETE = YES
```

This remediation ends at `VALIDATION_REQUIRED` and is ready only for the
required guarded local checkpoint followed by complete independent
re-audit. It does not mark the ticket DONE and does not self-certify final
conformance.
