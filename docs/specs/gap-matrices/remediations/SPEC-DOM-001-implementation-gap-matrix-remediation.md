# SPEC-DOM-001 — Implementation Gap Matrix Remediation

## 1. Remediation Mode

```text
WRITE_ALLOWED
AUDIT_DRIVEN
TARGETED
SURGICAL
ADR_FIRST
PORTFOLIO_GOVERNED
SPEC_FIRST
EVIDENCE_BACKED
OWNERSHIP_PRESERVING
GAP_IDENTITY_PRESERVING
METRIC_RECONCILING
NO_ARCHITECTURE_INVENTION
NO_SCOPE_EXPANSION
NO_IMPLEMENTATION
NO_IMPLEMENTATION_PLAN
NO_TICKET_DECOMPOSITION
NO_SELF_APPROVAL
```

Only the existing Gap Matrix and this existing remediation artifact were
modified. This report is not an approval or conformance verdict.

## 2. Subject

| Item | Value |
| --- | --- |
| Component SPEC | SPEC-DOM-001 revision 4 |
| Matrix | `docs/specs/gap-matrices/SPEC-DOM-001-implementation-gap-matrix.md` |
| Portfolio | SPEC-PORTFOLIO-001 revision 2; `PORTFOLIO_DECOMPOSITION_APPROVED` |
| Component audit | `PASS — COMPONENT_SPEC_CONFORMANT`; `READY_FOR_GAP_MATRIX: YES` |
| Source audit | `docs/specs/gap-matrices/audits/SPEC-DOM-001-implementation-gap-matrix-audit.md` |
| Remediation scope | CGMA-MAJOR-001 only, from the latest source audit |

## 3. Source Audit

| Field | Value |
| --- | --- |
| Verdict | `GAP_MATRIX_REMEDIATION_REQUIRED` |
| Source audit SHA-256 | `3E6C6BF66B88FCC2F48CDF4278BB3450C4B173B5524C95EEFA59231416982496` |
| Findings consumed | 1: `CGMA-MAJOR-001` |
| Finding | Revision 4 dependency classes inconsistent with the normative witness matrix |
| Severity / planning impact | `MAJOR` / `PLANNING_BLOCKING` |
| Category | `DEPENDENCY_INTEGRATION_GAP` |

No finding from an earlier remediation cycle was carried forward as a current
finding. The latest source audit is the exclusive authority for this run's
findings.

## 4. Baseline Validation

| Baseline | Value | Result |
| --- | --- | --- |
| Component SPEC | revision 4; SHA-256 `CB4A21924D9619B8349D6CC239D7998633C402D7EA3D7461C2D4D8498F9A014C` | confirmed |
| Component audit | SHA-256 `9BBEA969820F3705354EE6CA76110039F747D9AA60C84E1A19CAE49F01158C15` | conformant |
| Portfolio | organization SHA-256 `C449388972279D8ADD520564A9614CFA236F87B6C8932A70D5BC2D28EEF6BE86`; audit SHA-256 `120F22D0080AC0640EBBDAD7C460DF5DE2745788CFAEA83A1859F2C577168104` | approved |
| Matrix before remediation | SHA-256 `32CF2E92184376EEFCBC84DB83B3D993F0F6C23A936951439FE5389D456FA38E` | exact audited matrix |
| Matrix after remediation | SHA-256 `8D8401903F5558C129FCB516F699D7DB40DDFCBF83D52B136AE22CA95976675C` | intended four-row correction |
| Repository HEAD | `baa2a189bd71b85ba9fcc62840e52f091fc2e77e` | unchanged |
| Source/test fingerprint | `F4F18AB5AD103DC0D1C4B2E7077E69EA081EF5FC3258A4735E2E2A767269BB01` | unchanged |
| Test execution | targeted TypeScript command; 33/33 PASS | current evidence |
| Historical baseline | SPEC revision 3; HEAD `5ec37e1bdf13250ae93e59ce24ef3c4b4c43a220` | history only |

The live authority, source, repository, evidence, and pre-edit Matrix basis
matched the source audit. No authority or implementation baseline changed
during remediation.

### 4.1 Baseline reassessment state

```text
BASELINE_DRIFT_STATUS = NO_DRIFT
REASSESSMENT_COMPLETE = YES
FINDINGS_ARE_ACTIONABLE = YES
BASELINE_REMEDIATION_READINESS = READY
AUDIT_BASIS_STALE = NO
AUDIT_BASIS_FINGERPRINT = BF32FCC4CF3FEBF0156B1136B27BE0EB7F0D968C4B9D3408618BE040F66B537C
REMEDIATION_ENTRY_STATE = READY_FOR_TARGETED_REMEDIATION
```

The fingerprint was validated before the target Matrix edit and covers the
SPEC revision/digest, component audit, portfolio/audit digests, pre-edit
Matrix digest, repository HEAD, and source/test content fingerprint.

```text
OLD_AUTHORITY_BASELINE = SPEC-DOM-001 revision 4 and the approved portfolio/audit baselines above
CURRENT_AUTHORITY_BASELINE = same; no relevant authority drift
OLD_REPOSITORY_BASELINE = HEAD baa2a189bd71b85ba9fcc62840e52f091fc2e77e; content fingerprint F4F18AB5AD103DC0D1C4B2E7077E69EA081EF5FC3258A4735E2E2A767269BB01
CURRENT_REPOSITORY_BASELINE = same; source and tests unchanged
REMEDIATION_SCOPE = correct four revision-4 dependency-class fields only
REVALIDATION_CRITERIA = exact SPEC witness classes, 21 requirements, 21 live gaps, 3 capability records, reconciled metrics, no downstream promotion
```

## 5. Authority Context

The correction is directly determined by the SPEC-DOM-001 revision 4
Acceptance Witness Matrix and was confirmed by the independent source audit.
ADR, portfolio, component-SPEC, ownership, lifecycle, persistence,
aggregate-identity, aggregate-reconstruction, cross-SPEC, and failure
authority were not changed or reinterpreted.

```text
SPEC_NORMATIVE_REQUIREMENTS = 21
SPEC_IMPLEMENTABILITY_CHECK = PASS
AUTHORITY_NOT_DEFINED = 0
AGGREGATE_IDENTITY_PROOF = COMPLETE
AGGREGATE_RECONSTRUCTION_PROOF = COMPLETE
LIFECYCLE_AUTHORITY_MATRIX = COMPLETE
PERSISTENCE_SEMANTICS_MATRIX = COMPLETE
CROSS_SPEC_AUTHORITY_MATRIX = COMPLETE
```

## 6. Finding Ledger

| Finding | Validation | Matrix correction | Local evidence | Result |
| --- | --- | --- | --- | --- |
| `CGMA-MAJOR-001` | `VALIDATED_AND_STILL_PRESENT`; four row-level dependency classes disagreed with the SPEC revision 4 witness matrix; primary classifications, ownership, Gap IDs, and severities were valid | Corrected DOM-CMD-001 and DOM-ADV-001 to `REQUIRED_FOR_LOCAL_CLOSURE`; corrected DOM-AUDIT-001 and DOM-AUDIT-005 to `REQUIRED_FOR_INTEGRATED_PROOF` | SPEC witness rows, source audit finding, unchanged repository/evidence baseline, and post-edit row verification | `REMEDIATED` |

```text
FINDINGS_TOTAL = 1
REMEDIATED = 1
ALREADY_RESOLVED = 0
REJECTED_BY_VALID_EVIDENCE = 0
PARTIALLY_REMEDIATED = 0
BLOCKED = 0
```

## 7. Requirement Inventory Reconciliation

```text
SPEC_NORMATIVE_REQUIREMENTS = 21
MATRIX_NORMATIVE_REQUIREMENTS = 21
MISSING_FROM_MATRIX = 0
EXTRA_IN_MATRIX = 0
DUPLICATED_IN_MATRIX = 0
```

No requirement was added, removed, renamed, or regenerated.

## 8. Classification Corrections

Primary classifications were preserved exactly and revalidated:

```text
IMPLEMENTED = 0
PARTIAL = 4
MISSING = 12
CONTRADICTORY = 5
NOT_APPLICABLE = 0
OWNED_BY_OTHER_SPEC = 0
UNVERIFIED = 0
```

The remediation corrected dependency metadata only. It did not alter
implementation deltas or productive-availability claims.

## 9. Portfolio Ownership Corrections

No ownership correction was required. DOM remains the approved canonical owner
for all 21 in-scope requirements and no foreign obligation was absorbed.

```text
PORTFOLIO_OWNERSHIP_ERRORS = 0
WRONG_OWNER_IMPLEMENTATIONS = 0
UNRESOLVED_OWNERSHIP = 0
```

## 10. Mixed Ownership Corrections

Mixed ownership treatment was preserved for the existing nine mixed rows. No
pure foreign requirement was promoted to a local implementation gap and no
local integration obligation was classified as foreign.

```text
MIXED_OWNERSHIP_REQUIREMENTS = 9
MIXED_OWNERSHIP_RECLASSIFICATIONS = 0
```

## 11. Failure Ownership Corrections

Failure semantic ownership, not-found/stale behavior, failure mapping, and
cross-SPEC boundaries were unchanged.

```text
FAILURE_OWNER_ERRORS = 0
FAILURE_SEMANTIC_VIOLATION_GAPS = 1
```

## 12. Compatibility / Cutover Corrections

Compatibility, historical replay, invalidation, cutover, and retirement
treatment were unchanged.

```text
COMPATIBILITY_OWNER_ERRORS = 0
COMPATIBILITY_VIOLATION_GAPS = 3
```

## 13. Dependency Corrections

The following four requirement rows were corrected against the revision 4
normative witness matrix. Gap IDs and primary classifications remain stable.

| Requirement | Gap ID | Previous class | Corrected class | Basis |
| --- | --- | --- | --- | --- |
| DOM-CMD-001 | GAP-011 | `REQUIRED_FOR_INTEGRATED_PROOF` | `REQUIRED_FOR_LOCAL_CLOSURE` | SPEC witness row / O-011 |
| DOM-ADV-001 | GAP-013 | `REQUIRED_FOR_INTEGRATED_PROOF` | `REQUIRED_FOR_LOCAL_CLOSURE` | SPEC witness row / O-015 |
| DOM-AUDIT-001 | GAP-017 | `REQUIRED_FOR_LOCAL_CLOSURE` | `REQUIRED_FOR_INTEGRATED_PROOF` | SPEC witness row / O-049 |
| DOM-AUDIT-005 | GAP-021 | `REQUIRED_FOR_LOCAL_CLOSURE` | `REQUIRED_FOR_INTEGRATED_PROOF` | SPEC witness row / O-053 |

Reconciled requirement dependency classes:

```text
REQUIRED_FOR_LOCAL_EXECUTION = 0
REQUIRED_FOR_LOCAL_CLOSURE = 13
REQUIRED_FOR_INTEGRATED_PROOF = 8
INFORMATIONAL = 0
CAPABILITY_AVAILABILITY_CLASSIFICATION_ERRORS = 0
```

The three existing capability availability records were preserved and
revalidated independently:

| CAPABILITY_ID | AUTHORITY_OWNER | PRODUCER | CONSUMER | CONTRACT | AUTHORITY_STATUS | CONTRACT_STATUS | LOCAL_TESTABILITY | PRODUCTIVE_AVAILABILITY | DEPENDENCY_CLASS |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CAP-EXEC-EXACT-VERSION-BASIS | SPEC-EXEC-001 | EXEC-001 registry | DOM-SNAPSHOT-001 / DOM-ADV-001 | exact version/revision basis and returned result | DEFINED | DEFINED | NO | NO | REQUIRED_FOR_INTEGRATED_PROOF |
| CAP-PLAT-SNAPSHOT-PIPELINE-PROVENANCE | SPEC-PLAT-001 | PLAT journal/checkpoint reader | DOM-SNAPSHOT-001 / DOM-PIPE-001 / DOM-STATE-001 | identity/reference revisions, persistence revision, state, ordered provenance | DEFINED | DEFINED | NO | NO | REQUIRED_FOR_INTEGRATED_PROOF |
| CAP-GIT-CANDIDATE-BOUND-REMOTE-CONFIRMATION | SPEC-GIT-001 | GIT candidate-bound publication observer | DOM-PUB-001 / DOM-AUDIT-006 | candidate-bound remote confirmation, base/head/tree, returned evidence | DEFINED | DEFINED | NO | NO | REQUIRED_FOR_INTEGRATED_PROOF |

For all three records, `BLOCKING_EFFECT` remains integrated proof only;
`FAILURE_NOT_FOUND_STALE_SEMANTICS` and `VERSION_REVISION_TRANSPORT` remain
explicitly recorded in the Matrix. Authority, contract, local testability,
and productive availability remain independent dimensions.

```text
AUTHORITY_DEFINED_BUT_NOT_CONSUMABLE = 3
DOWNSTREAM_CAPABILITY_PROMOTION_WITHOUT_NEW_EVIDENCE = 0
READY_CLAIMS_WITH_UNAVAILABLE_CONTRACT = 0
```

No fixture, mock, fake, contract test, or in-memory repository was used to
prove productive availability.

## 14. Evidence Corrections

No implementation or test evidence changed. Evidence dimensions remain
separate:

| Dimension | Result |
| --- | --- |
| IMPLEMENTATION_EVIDENCE | current repository behavior; productive implementation gaps preserved |
| TEST_EXISTENCE_EVIDENCE | existing tests and prototype evidence retained separately |
| TEST_EXECUTION_EVIDENCE | targeted TypeScript execution: 33/33 PASS |
| PRODUCTIVE_AVAILABILITY_EVIDENCE | unavailable for the three integrated-proof capabilities; remains `NO` |

A passing test execution does not prove productive availability.

## 15. Exact Delta Corrections

No `OBSERVED`, `REQUIRED`, or `DELTA` implementation statement was changed.
The only correction is the classification of when each affected dependency is
needed: local closure versus integrated proof. No implementation design,
module, class, table, algorithm, phase, or ticket was introduced.

```text
UNRESOLVED_MATERIAL_DELTA = 0
```

## 16. Gap Identity Corrections

All valid identities were preserved:

```text
LIVE_GAPS = GAP-001 and GAP-003 through GAP-022 = 21
GAP-002 = OBSOLETE_HISTORICAL; not reused
NEW_LOCAL_GAPS = 0
FALSE_GAP_SPLITS = 0
FALSE_GAP_MERGES = 0
ORPHAN_GAPS = 0
ORPHAN_REQUIREMENT_REFERENCES = 0
```

The dependency correction does not turn any capability record into a local DOM
Gap and does not convert any integrated-proof dependency into durable identity
closure.

## 17. Gap Category / Severity Corrections

No category or severity was changed. The 21 live implementation gaps remain
`MAJOR`; capability availability records remain dependency records rather than
local implementation gaps.

```text
BLOCKER_GAPS = 0
MAJOR_GAPS = 21
MINOR_GAPS = 0
EVIDENCE_ONLY_GAPS = 0
```

## 18. Metric Reconciliation

| Metric | Reconciled result |
| --- | --- |
| NORMATIVE_REQUIREMENTS | 21 |
| IMPLEMENTED / PARTIAL / MISSING / CONTRADICTORY | 0 / 4 / 12 / 5 |
| NOT_APPLICABLE / OWNED_BY_OTHER_SPEC / UNVERIFIED | 0 / 0 / 0 |
| ACTIVE_GAPS | 21 |
| GAP-002 | `OBSOLETE_HISTORICAL` |
| BLOCKER / MAJOR / MINOR / EVIDENCE_ONLY | 0 / 21 / 0 / 0 |
| DEPENDENCY_INTEGRATION_GAPS | 3 capability records; not local gaps |
| CAPABILITY_AVAILABILITY_RECORDS | 3 |
| REQUIRED_FOR_LOCAL_EXECUTION / LOCAL_CLOSURE / INTEGRATED_PROOF / INFORMATIONAL | 0 / 13 / 8 / 0 |
| FALSE_POSITIVE_GAPS / FALSE_NEGATIVE_GAPS | 0 / 0 |
| PORTFOLIO_OWNERSHIP_ERRORS / WRONG_OWNER_IMPLEMENTATIONS | 0 / 0 |
| FAILURE_OWNER_ERRORS / COMPATIBILITY_OWNER_ERRORS | 0 / 0 |
| UNSUPPORTED_IMPLEMENTED_CLAIMS | 0 |
| UNRESOLVED_OWNERSHIP / UNRESOLVED_MATERIAL_DELTA | 0 / 0 |
| PLANNING_BLOCKING_FINDINGS_REMAINING | 0 |
| IMPLEMENTATION_COVERAGE | 0 / 21 = 0% |

Coverage formula: `IMPLEMENTED_OWNED_REQUIREMENTS / ELIGIBLE_OWNED_REQUIREMENTS`;
the denominator is all 21 locally or partly owned requirements, including the
nine mixed rows.

## 19. Reliability Validation

```text
MISSING_FROM_MATRIX = 0
DUPLICATED_IN_MATRIX = 0
UNCLASSIFIED_REQUIREMENTS = 0
UNRESOLVED_OWNERSHIP = 0
UNRESOLVED_MATERIAL_DELTA = 0
UNSUPPORTED_IMPLEMENTED_CLAIMS = 0
KNOWN_FALSE_POSITIVE_GAPS = 0
KNOWN_FALSE_NEGATIVE_GAPS = 0
FALSE_GAP_SPLITS = 0
FALSE_GAP_MERGES = 0
ORPHAN_GAPS = 0
ORPHAN_REQUIREMENT_REFERENCES = 0
SPECIFICATION_AMBIGUITY = 0
ARCHITECTURAL_AUTHORITY_GAP = 0
PORTFOLIO_AUTHORITY_GAP = 0
SOURCE_SPEC_CONFORMANCE_DRIFT = 0
CAPABILITY_AVAILABILITY_CLASSIFICATION_ERRORS = 0
DOWNSTREAM_PROMOTION_WITHOUT_NEW_EVIDENCE = 0
READY_CLAIMS_WITH_UNAVAILABLE_CONTRACT = 0
SPEC_IMPLEMENTABILITY_CHECK = PASS
```

All independent authority/contract/local-testability/productive-availability
dimensions remain internally consistent.

## 20. Escalations

```text
AUTHORITY_ESCALATION = NO_ESCALATION
SPEC_REMEDIATION_REQUIRED = 0
ADR_CLARIFICATION_REQUIRED = 0
PORTFOLIO_REMEDIATION_REQUIRED = 0
UPSTREAM_SPEC_REMEDIATION_REQUIRED = 0
BLOCKED_INSUFFICIENT_REASSESSMENT = 0
STALE_AUDIT_BASIS = 0 at remediation entry
```

## 21. Files Changed

```text
MATRIX_CHANGED = docs/specs/gap-matrices/SPEC-DOM-001-implementation-gap-matrix.md
REMEDIATION_ARTIFACT_CHANGED = docs/specs/gap-matrices/remediations/SPEC-DOM-001-implementation-gap-matrix-remediation.md
ADRS_CHANGED = NO
PORTFOLIO_CHANGED = NO
COMPONENT_SPEC_CHANGED = NO
UPSTREAM_SPECS_CHANGED = NO
PRODUCTION_CODE_CHANGED = NO
TESTS_CHANGED = NO
IMPLEMENTATION_PLAN_CHANGED = NO
TICKETS_CHANGED = NO
PRIOR_AUDITS_CHANGED = NO
```

## 22. Reaudit Readiness

```text
PRE_REAUDIT_SELF_CHECK = PASS
MATRIX_SELF_APPROVAL = NOT_PERFORMED
GAP_MATRIX_CONFORMANT = NOT_ASSERTED
READY_FOR_IMPLEMENTATION_PLAN = NOT_ASSERTED
NEXT_GOVERNANCE_STEP = audit-component-implementation-gap-matrix
RESULT = READY_FOR_INDEPENDENT_GAP_MATRIX_REAUDIT
```

```text
COMPONENT_GAP_MATRIX_REMEDIATION_COMPLETE
READY_FOR_INDEPENDENT_GAP_MATRIX_REAUDIT
```
