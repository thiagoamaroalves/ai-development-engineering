# SPEC-EXEC-001 — Component SPEC Remediation

## 1. Remediation mode

```text
WRITE_ALLOWED
AUDIT_DRIVEN
ADR_FIRST
PORTFOLIO_GOVERNED
UPSTREAM_CONTRACT_PRESERVING
COMPONENT_SCOPED
MINIMAL_SCOPE
NO_ARCHITECTURE_INVENTION
NO_PORTFOLIO_REDESIGN
NO_IMPLEMENTATION_PLAN
NO_TICKET_DECOMPOSITION
NO_PRODUCTION_IMPLEMENTATION
NO_SELF_APPROVAL
```

This remediation corrects only validated findings from the latest independent
EXEC-001 component audit. It does not approve the component SPEC; approval
remains the responsibility of a fresh independent conformance audit.

## 2. Baseline

| Item | Before remediation |
|---|---|
| Component SPEC | `docs/specs/SPEC-EXEC-001-skill-contracts-and-capability-registry.md` |
| Component revision/status | `1` / `PROPOSED` |
| Repository HEAD | `5318663b03b9d873261475dbd97702d77d2d3efc` |
| Portfolio | `SPEC-PORTFOLIO-001` revision `2` |
| Portfolio verdict | `PORTFOLIO_DECOMPOSITION_APPROVED` |
| Primary ADR | `ADR-0003` revision `3`, `ACCEPTED` |
| Upstream | `SPEC-DOM-001` revision `2`, independently conformant |
| Working tree | target SPEC and source audit already untracked; no production implementation/test changes |
| Prior Gap Matrix | absent |

No ADR, portfolio, upstream SPEC, source audit, implementation, test or
downstream planning artifact was modified.

## 3. Source audit

| Item | Value |
|---|---|
| Source audit | `docs/specs/audits/SPEC-EXEC-001-component-conformance-audit.md` |
| Source verdict | `FAIL — COMPONENT_SPEC_NON_CONFORMANT` |
| Validated findings | `CSC-MAJOR-001`, `CSC-MAJOR-002`, `CSC-MINOR-001`, `CSC-MINOR-002`, `CSC-MINOR-003` |
| Drift check | all five findings `STILL_VALID` before remediation |

The source audit was read completely and was not modified.

## 4. Authority used

| Authority | Use |
|---|---|
| `ADR-0001` | canonical DOM identity and AttemptId ownership |
| `ADR-0002` | separate lifecycle/state-machine authority |
| `ADR-0003` | envelope, semver, exact versions, failure, registry and manifest authority |
| `ADR-0004` | persisted manifest/artifact/result context between isolated sessions; O-025 owner remains EXEC-002 |
| `ADR-0006` | persistence, effect idempotency and physical recovery remain PLAT-owned |
| `ADR-0009` | structured verdict and audit-cycle authority remain DOM-owned |
| `ADR-0010` | bootstrap catalog and repository enablement boundary |
| `ADR-0011` | backend transport/application mapping boundary |
| Portfolio organization/audit | O-016…O-021 ownership, failure registry, compatibility registry and DAG |
| Conformant `SPEC-DOM-001`/audit | consumed identity, snapshot and lifecycle contracts |

Authority precedence remained accepted ADR > approved portfolio > conformant
upstream SPEC > validated audit > target SPEC > repository evidence.

## 5. Findings ledger

| Finding | Severity | Category | Authority | Root cause | Target section | Planned correction | Validation |
|---|---|---|---|---|---|---|---|
| CSC-MAJOR-001 | MAJOR | AttemptId ownership violation | ADR-0001/O-001/DOM-ID-001 | `UPSTREAM_COMPOSITION_DEFECT` | Retry / Idempotency / Recovery | restore DOM AttemptId ownership; limit EXEC-002 to assignment/session | no downstream owner claims canonical AttemptId |
| CSC-MAJOR-002 | MAJOR | O-025 resume-context leakage | ADR-0003/O-021 + ADR-0004/O-025 | `PORTFOLIO_CONFORMANCE_DEFECT` | EXEC-MANIFEST-002 and recovery text | restrict EXEC to declaration; reference O-025/EXEC-002 and PLAT | no EXEC requirement defines context orchestration |
| CSC-MINOR-001 | MINOR | disjunctive acceptance outcome | ADR-0003/O-016/O-019 | `ACCEPTANCE_DEFECT` | AC-EXEC-002 | require exact `CONTRACT_INVALID` | missing fields have one asserted outcome |
| CSC-MINOR-002 | MINOR | ambiguous failure mapping | ADR-0003/O-019/O-020 | `SPEC_COMPLETENESS_DEFECT` | VERSION-002, REGISTRY-003, AC-EXEC-004/010 | bind unsupported capability/version to `INCOMPATIBLE_CAPABILITY` | exact code asserted in requirements/acceptance |
| CSC-MINOR-003 | MINOR | manifest event terminology | ADR-0003/O-021 | `SPEC_COMPLETENESS_DEFECT` | Commands / Queries / Events | classify manifest as `IMMUTABLE_ARTIFACT` | no manifest event lifecycle authority |

All findings were classified `REMEDIATE`; none required portfolio remediation,
ADR clarification, upstream remediation or blocking.

| Finding | Before | Remediation | Authority | Local proof | Status |
|---|---|---|---|---|---|
| CSC-MAJOR-001 | Retry text assigned AttemptId provision to downstream owners. | Retry text restores DOM ownership and limits EXEC-002 to assignment/session behavior. | ADR-0001/O-001/DOM-ID-001 | target section 16 names DOM as AttemptId owner | `REMEDIATED` |
| CSC-MAJOR-002 | EXEC-MANIFEST-002 owned persisted resume-context semantics. | Requirement now declares checkpoint/basis only and references O-025/EXEC-002/PLAT for application/replay. | ADR-0003/O-021; ADR-0004/O-025 | target requirement and AC-EXEC-014 contain owner delegation | `REMEDIATED` |
| CSC-MINOR-001 | AC-EXEC-002 allowed rejection or failure marking. | Acceptance requires exact `CONTRACT_INVALID`. | ADR-0003/O-016/O-019 | target AC-EXEC-002 | `REMEDIATED` |
| CSC-MINOR-002 | Unsupported version/bootstrap capability allowed ambiguous mapping. | Requirements and acceptances require exact `INCOMPATIBLE_CAPABILITY`; invalid payload remains `CONTRACT_INVALID`. | ADR-0003/O-019/O-020 | target EXEC-VERSION-002, EXEC-REGISTRY-003, AC-EXEC-004/010 | `REMEDIATED` |
| CSC-MINOR-003 | Manifest was classified as `CANONICAL_EVENT`. | Manifest is classified as `IMMUTABLE_ARTIFACT`; lifecycle events remain aggregate-owned. | ADR-0003/O-021 | target section 14 | `REMEDIATED` |

## 6. Files changed

| File | Change |
|---|---|
| `docs/specs/SPEC-EXEC-001-skill-contracts-and-capability-registry.md` | surgical normative, acceptance, conformance and consistency corrections |
| `docs/specs/remediations/SPEC-EXEC-001-component-spec-remediation.md` | this remediation evidence artifact |

The source audit and all authority documents were preserved unchanged.

## 7. Owned obligation remediation

The approved owner set remains exactly `O-016…O-021`:

- `O-016`: unchanged envelope authority; missing-field acceptance now has one
  deterministic contract failure.
- `O-017`: unsupported capability version resolution now maps explicitly to
  `INCOMPATIBLE_CAPABILITY`.
- `O-018`: exact version/basis immutability remains unchanged and is now
  compositionally isolated from retry identity.
- `O-019`: invalid contract, unknown verdict and unsupported version/bootstrap
  paths have deterministic canonical outcomes.
- `O-020`: bootstrap allowlist violation now has one canonical failure code;
  registry extensibility and normal/bootstrap separation remain unchanged.
- `O-021`: manifest/checkpoint declaration remains EXEC-owned, while context
  orchestration is explicitly delegated to O-025/EXEC-002 and PLAT.

`OWNED_OBLIGATIONS_WITHOUT_REQUIREMENT = 0` remains true.

## 8. Upstream contract remediation

No upstream SPEC was modified. The target continues to consume
`DOM-ID-001`, `DOM-SNAPSHOT-001`, `DOM-LINEAGE-001`, `DOM-LIFE-001`,
`DOM-CMD-001`, `DOM-ADV-001` and `DOM-AUDIT-002` by reference.

The target now states that DOM owns `AttemptId`; EXEC-002 owns retry
assignment/session behavior only. This restores, rather than changes, the
approved upstream contract.

## 9. Requirement authority remediation

No requirement ID was added or removed. `EXEC-MANIFEST-002` was narrowed to
the O-021 authority of declaring safe checkpoints and resume information. The
persisted-context rule is now a referenced O-025/ADR-0004 contract, not an
EXEC-001-owned rule. `EXEC-VERSION-002` and `EXEC-REGISTRY-003` now use the
portfolio-registered failure code for their local cases.

All 17 requirements still trace to a portfolio obligation and accepted
ADR-0003; no hidden ADR or new architectural decision was introduced.

## 10. Lifecycle/identity remediation

The retry section now preserves the following ownership split:

```text
DOM                → canonical AttemptId and aggregate lineage
EXEC-002           → new retry assignment/session and operational dispatch
PLAT/GIT           → persistence, effect idempotency, reconciliation/publication
EXEC-001           → contract basis, manifest and checkpoint declaration
```

The manifest remains bound to DOM ActivityId/AttemptId/ArtifactCycleId and no
competing manifest identity is introduced. No lifecycle or transition owned by
DOM or EXEC-002 was redefined.

## 11. Failure/recovery remediation

- Missing required envelope fields now produce `CONTRACT_INVALID`.
- A capability/version mismatch during resolution now produces
  `INCOMPATIBLE_CAPABILITY`.
- A capability outside the bootstrap allowlist now produces
  `INCOMPATIBLE_CAPABILITY` in the bootstrap context.
- Contract failure remains distinct from operational retry and external effect
  confirmation.
- EXEC-001 exposes checkpoint/basis data; O-025/EXEC-002 applies persisted
  inter-session context and PLAT owns physical persistence/replay.

No canonical failure owner changed. The portfolio failure registry remains the
authority for all 11 families and provisional labels.

## 12. Compatibility/cutover remediation

No compatibility ownership changed. The target still declares:

| Class | Role |
|---|---|
| `NEW_CANONICAL_PATH` | OWNER |
| `LEGACY_COMPATIBILITY` | CONSUMER of REPO |
| `HISTORICAL_REPLAY` | OWNER |
| `CUTOVER` | OWNER |
| `RETIREMENT` | NOT_APPLICABLE |

The corrected version/failure language reinforces that legacy conversion is
not silent and historical basis is not reinterpreted by the current registry.

## 13. Dependency remediation

No dependency declaration changed. The sole normative dependency remains:

```text
SPEC-EXEC-001 → SPEC-DOM-001
```

It is approved, direct, required and conformant. EXEC-002 and PLAT are named
as referenced owners for composition, not declared as new upstream dependencies.

## 14. Projection boundary remediation

The activity manifest is now classified as an `IMMUTABLE_ARTIFACT` rather than
a `CANONICAL_EVENT`. Any event referring to the manifest remains owned by the
aggregate lifecycle owner. Registry views, failure mappings and UI/OPS views
remain non-authoritative projections.

## 15. Acceptance/conformance remediation

The following acceptance/conformance corrections were made:

| Artifact | Correction |
|---|---|
| AC-EXEC-002 | missing structured fields require exact `CONTRACT_INVALID` |
| AC-EXEC-004 | unsupported capability version requires exact `INCOMPATIBLE_CAPABILITY`; schema invalid remains `CONTRACT_INVALID` |
| AC-EXEC-010 | bootstrap allowlist violation requires exact `INCOMPATIBLE_CAPABILITY` |
| AC-EXEC-014 | verifies checkpoint declaration and owner delegation rather than redefining downstream recovery |
| C-EXEC-011 | asserts exact bootstrap failure code |
| C-EXEC-017 | verifies EXEC exposure versus downstream context application |

The existing positive, negative, boundary-isolation, compatibility,
synthetic-extensibility and replay tests remain in place.

## 16. Traceability remediation

The traceability matrix retains 17 stable requirement rows and the same six
portfolio obligations. It now reflects:

- `EXEC-MANIFEST-002` as direct O-021/ADR-0003 checkpoint declaration with
  O-025/EXEC-002 and PLAT referenced as consumed recovery contracts;
- `EXEC-VERSION-002` and `EXEC-REGISTRY-003` as exact failure-mapped
  requirements;
- all acceptance and conformance IDs remaining linked to their requirement.

```text
REQUIREMENTS_WITHOUT_PORTFOLIO_AUTHORITY = 0
REQUIREMENTS_WITHOUT_ADR_AUTHORITY = 0
```

## 17. Gap classification remediation

No repository gap classification was changed. Schemas, registry, manifest
persistence and runtime remain `IMPLEMENTATION_GAP`; prototype source/tests
remain `PROTOTYPE_ONLY`; unfrozen technology remains
`UNFROZEN_IMPLEMENTATION_DETAIL`; architecture remains `NON_GAP`.

No formal Gap Matrix was created or updated.

## 18. Implementation-plan leakage remediation

No implementation-plan leakage was present and none was introduced. The
corrections specify observable authority, failure and acceptance semantics
without naming files/classes, choosing libraries/storage, defining phases or
creating tickets.

## 19. Mechanical validation

```text
PORTFOLIO_OBLIGATIONS_OWNED = 6
PORTFOLIO_OBLIGATIONS_COVERED = 6
OWNED_OBLIGATIONS_UNCOVERED = 0
OWNED_OBLIGATIONS_PARTIAL = 0
NORMATIVE_REQUIREMENTS = 17
REQUIREMENTS_WITHOUT_AUTHORITY = 0
CONSUMED_CONTRACTS = 2
CONSUMED_CONTRACTS_REDEFINED = 0
UNTESTABLE_REQUIREMENTS = 0
ACCEPTANCE_GAPS = 0
NORMATIVE_DEPENDENCIES = 1
UNAPPROVED_DEPENDENCIES = 0
MISSING_REQUIRED_DEPENDENCIES = 0
DEPENDENCY_DIRECTION_VIOLATIONS = 0
FAILURE_OWNER_VIOLATIONS = 0
COMPATIBILITY_OWNER_VIOLATIONS = 0
ARCHITECTURE_GAPS = 0
PORTFOLIO_GAPS = 0
UPSTREAM_CONTRACT_GAPS = 0
IMPLEMENTATION_PLAN_LEAKS = 0
REMEDIATED_FINDINGS = 5
PARTIAL_FINDINGS = 0
BLOCKED_FINDINGS = 0
```

All local remediation invariants are zero where required. This report does
not self-assign a conformant verdict.

## 20. Remaining blockers

```text
ARCHITECTURE = 0
PORTFOLIO = 0
UPSTREAM = 0
ADR_CLARIFICATION_REQUIRED = 0
PORTFOLIO_REMEDIATION_REQUIRED = 0
UPSTREAM_REMEDIATION_REQUIRED = 0
REMEDIATION_BLOCKED = 0
```

The independent audit findings are locally remediated. Only the mandated
fresh conformance audit remains.

## 21. Reaudit readiness

All five validated findings are marked `REMEDIATED`. The target SPEC now has:

```text
READY_FOR_INDEPENDENT_COMPONENT_SPEC_REAUDIT
```

This is a remediation gate, not `PASS — COMPONENT_SPEC_CONFORMANT` and not a
Gap Matrix or implementation gate. The next mandatory action is a fresh
independent `audit-component-spec-conformance` run against the updated SPEC.
