# DOM-001-TICKET-004 — Implementation Remediation

## 1. Remediation Verdict

```text
TICKET_IMPLEMENTATION_REMEDIATION_BLOCKED
TICKET_GATE: BLOCKED
```

Three canonical findings were remediated locally. Two remaining findings
require upstream implementation-design/authority decisions and therefore the
ticket is not ready for re-audit.

## 2. Ticket

| Field | Value |
|---|---|
| Ticket | `DOM-001-TICKET-004` |
| Implementation Unit | `DOM-IMP-04` |
| Ticket status | `VALIDATION_REQUIRED` |
| Ticket path | `docs/tickets/SPEC-DOM-001/DOM-001-TICKET-004-pipeline-state-machines.md` |
| Implementation Design | `docs/tickets/SPEC-DOM-001/DOM-001-TICKET-004-implementation-design.md` |

## 3. Baseline Validation

```text
AUDIT_ROUND: INITIAL_AUDIT
AUDIT_HEAD: a58ce959f9b34f3c1c83ed41c01b058d31bf3366
REMEDIATION_START_HEAD: a58ce959f9b34f3c1c83ed41c01b058d31bf3366
CURRENT_HEAD: a58ce959f9b34f3c1c83ed41c01b058d31bf3366
STATE_CLASSIFICATION: NO_RELEVANT_DRIFT
```

The working tree contained the unchanged audited implementation before this
remediation. The local remediation changed only T004 production/tests and this
evidence artifact.

## 4. Canonical Findings Received

Canonical source:
`DOM-001-TICKET-004-implementation-audit.md`.

```text
CANONICAL_FINDINGS_RECEIVED: 5
BLOCKING_FINDINGS_RECEIVED: 3
```

- `IMA-CRITICAL-001`: pipeline uses an alternate local identity.
- `IMA-MAJOR-001`: derived workflow state bypasses controlled derivation.
- `IMA-MAJOR-002`: rehydration accepts later stages without provenance.
- `IMA-MINOR-001`: missing machine input leaks a native `TypeError`.
- `IMA-INFO-001`: exact replay lacks direct executable evidence.

## 5. Root Cause Analysis

### RC-001 — Pipeline identity is not bound to the canonical identity authority

Category: `IDENTITY_LINEAGE`, `OWNERSHIP`.

`PipelineId` is a local token, while the approved authority does not define
which `CanonicalIdentityReference`, kind, scope, correlation, and persistence
contract identify a pipeline aggregate.

### RC-002 — Rehydration validates shape but not progression provenance

Category: `LIFECYCLE`, `PERSISTENCE`, `INVARIANT_PLACEMENT`.

`WorkflowPipeline.rehydrate()` accepts any known stage and non-negative revision
without persisted evidence of the accepted predecessor transitions. Adding a
provenance field or inferring a stage/revision relation would change the
public/persistence contract.

### RC-003 — Derived state construction was publicly bypassable

Category: `AGGREGATE_BOUNDARY`, `DOMAIN_MODEL`.

The exported result could be fabricated directly instead of being produced by
`PipelineStateDerivationPolicy`.

### RC-004 — Malformed state members were not mapped to domain errors

Category: `BEHAVIOR`, `CLEAN_CODE_STRUCTURAL`.

`PipelineStateInputs.create()` accessed `.machine` before checking whether the
member existed.

### RC-005 — Exact replay lacked direct executable proof

Category: `IDEMPOTENCY`, `TEST_COVERAGE`.

The existing CAS behavior was not directly exercised with the identical
command after a successful transition.

## 6. Affected Radius

The radius was checked across the T004 pipeline aggregate, state-input/value
objects, derivation policy, application handlers, repository port behavior,
rehydration seam, and focused tests. No additional same-root manifestation
requiring production change was found.

`src/domain/identity.ts` is explicitly `MUST_NOT_MODIFY` in the approved design;
changing it to invent a pipeline kind would be outside the frozen ticket.

## 7. Remediation Units

| Unit | Findings | Result |
|---|---|---|
| `RU-001` | `IMA-CRITICAL-001` | `BLOCKED` — canonical pipeline identity contract is undefined |
| `RU-002` | `IMA-MAJOR-001` | `VALIDATED_AND_REMEDIATED` — derivation construction is token-gated and immutable |
| `RU-003` | `IMA-MAJOR-002` | `BLOCKED` — persisted progression provenance contract is undefined |
| `RU-004` | `IMA-MINOR-001` | `VALIDATED_AND_REMEDIATED` — missing members map to `INVALID_PIPELINE_STATE` |
| `RU-005` | `IMA-INFO-001` | `VALIDATED_AND_REMEDIATED` — exact replay has direct no-effect evidence |

## 8. Finding Closure

| Finding | Classification | Evidence |
|---|---|---|
| `IMA-CRITICAL-001` | `BLOCKED` | Requires canonical identity kind/scope/reference and compatible command/repository contract |
| `IMA-MAJOR-001` | `VALIDATED_AND_REMEDIATED` | Private construction path, non-exported derivation proof, and direct-construction negative test |
| `IMA-MAJOR-002` | `BLOCKED` | Requires persisted predecessor/transition provenance; no stage/revision inference was added |
| `IMA-MINOR-001` | `VALIDATED_AND_REMEDIATED` | Presence guard and missing-member negative test |
| `IMA-INFO-001` | `VALIDATED_AND_REMEDIATED` | Identical replay is rejected without a second repository call or state mutation |

```text
FINDINGS_REMEDIATED: 3
FINDINGS_ALREADY_RESOLVED: 0
FINDINGS_REJECTED_BY_NEW_EVIDENCE: 0
FINDINGS_PARTIALLY_REMEDIATED: 0
FINDINGS_BLOCKED: 2
```

## 9. Root Cause Closure

```text
ROOT_CAUSES_IDENTIFIED: 5
ROOT_CAUSES_CLOSED: 3
SYSTEMIC_ROOT_CAUSES: 0
ADDITIONAL_SAME_ROOT_MANIFESTATIONS_FIXED: 0
ROOT_CAUSE_REMOVED: PARTIAL — RC-003, RC-004, RC-005 only
AFFECTED_RADIUS_CHECKED: YES
KNOWN_MANIFESTATIONS_CLOSED: PARTIAL
```

## 10. Design Conformance Reconciliation

The local corrections preserve the approved component decomposition:
`WorkflowPipeline` remains the aggregate root, derivation remains a domain
policy, handlers remain orchestration, and the repository remains the CAS
boundary. No generic state-machine framework, new architecture, or alternate
state authority was introduced.

The identity and rehydration findings cannot be safely closed without
revalidating the approved design and its public/persistence contracts.

## 11. Files Changed

```text
CHANGED_PRODUCTION_FILES: 1
CHANGED_TEST_FILES: 1
```

- `src/domain/pipeline.ts`
- `tests/dom-001-ticket-004.test.ts`
- `docs/tickets/SPEC-DOM-001/DOM-001-TICKET-004-implementation-remediation.md`

## 12. Gap / Requirement / Acceptance Impact

Affected authority: `GAP-009`, `GAP-010`, `DOM-PIPE-001`, `DOM-STATE-001`,
`AC-DOM-009`, and `AC-DOM-010`.

```text
ACCEPTANCE_CRITERIA_AFFECTED: 2
ACCEPTANCE_CRITERIA_SATISFIED: 0
ACCEPTANCE_CRITERIA_NOT_SATISFIED: 0
ACCEPTANCE_CRITERIA_BLOCKED: 2
```

## 13. Tests

Focused proof:

```text
prototype/node_modules/.bin/tsx.cmd --test tests/dom-001-ticket-004.test.ts
6 passed, 0 failed
```

Typecheck of productive source:

```text
$files = @(Get-ChildItem src/domain/*.ts,src/application/*.ts | Select-Object -ExpandProperty FullName)
& '.\\prototype\\node_modules\\.bin\\tsc.cmd' --noEmit --strict --target ES2021 --module ESNext --moduleResolution Bundler --skipLibCheck $files
passed, 0 errors
```

Full regression:

```text
prototype/node_modules/.bin/tsx.cmd --test tests/*.test.ts
27 passed, 0 failed
```

## 14. Behavioral Regression Self-Check

```text
NO_REMEDIATION_REGRESSION
KNOWN_BEHAVIORAL_REMEDIATION_REGRESSIONS: 0
```

The existing immediate-successor, stale CAS, no-last-write-wins, and
read-only query behavior remain passing. Exact replay now has direct evidence.

## 15. Structural Regression Self-Check

```text
DOMAIN_MODEL_CONFORMANT: PARTIAL — identity and rehydration remain blocked
AGGREGATE_BOUNDARIES_CONFORMANT: YES
INVARIANT_PLACEMENT_CONFORMANT: PARTIAL
COMPONENT_BOUNDARIES_CONFORMANT: YES
SOLID_CONFORMANT: YES
DEPENDENCY_DIRECTION_CONFORMANT: YES
CLEAN_CODE_STRUCTURALLY_ACCEPTABLE: YES
CROSS_SPEC_BOUNDARY_CONFORMANT: YES
AGGREGATE_BOUNDARY_VIOLATIONS: 0
DOMAIN_INVARIANT_BYPASSES: 0
UNENFORCED_INVARIANTS: 2
DOMAIN_RULE_DUPLICATION: 0
STRUCTURAL_REMEDIATION_REGRESSIONS: 0
```

## 16. Ownership / Authority

Local ownership remains explicit. No foreign capability or lifecycle was
duplicated, and no upstream authority was changed.

```text
OWNERSHIP_ERRORS: 1
FOREIGN_CAPABILITY_DUPLICATION: 0
NEW_ALTERNATE_AUTHORITY: 0
UNRELATED_CHANGE: 0
```

The one ownership error is the pre-existing unresolved alternate pipeline
identity finding.

## 17. Completion Evidence

```text
COMPLETION_EVIDENCE_MISSING: 2
```

Missing evidence concerns canonical pipeline identity binding and valid
later-stage rehydration provenance.

## 18. Remaining Blockers

```text
IMPLEMENTATION_REMEDIATION_BLOCKED
reason = IMPLEMENTATION_DESIGN_REVALIDATION_REQUIRED
```

- `IMA-CRITICAL-001`: define which canonical DOM identity reference, kind,
  scope, correlation, and persistence key identify `WorkflowPipeline`; then
  revalidate affected public contracts.
- `IMA-MAJOR-002`: define persisted progression provenance and the validated
  rehydration boundary; do not infer stage from revision or restrict all valid
  persisted pipelines to the initial stage.

## 19. Pre-Reaudit Self-Check

```text
ALL_BLOCKING_FINDINGS_CLOSED: NO
ALL_ROOT_CAUSES_CLOSED: NO
AFFECTED_RADIUS_CHECKED: YES
REQUIRED_TESTS_PASS: YES_FOR_LOCAL_CORRECTIONS
AFFECTED_ACCEPTANCE_CRITERIA_PASS: NO
NO_KNOWN_MATERIAL_BEHAVIOR_REGRESSION: YES
BEHAVIORAL_SELF_CHECK: PASS_FOR_LOCAL_CORRECTIONS
STRUCTURAL_SELF_CHECK: BLOCKED_BY_TWO_UPSTREAM_CONTRACTS
STATUS: VALIDATION_REQUIRED
```

## 20. Remediation Gate

```text
TICKET_IMPLEMENTATION_REMEDIATION_BLOCKED
TICKET_GATE: BLOCKED
NEXT_ACTION: IMPLEMENTATION_DESIGN_REVALIDATION_REQUIRED
```
