# SPEC-BACKEND-001 — Component SPEC Remediation

## 1. Remediation mode

`WRITE_ALLOWED / AUDIT_DRIVEN / ADR_FIRST / PORTFOLIO_GOVERNED / UPSTREAM_CONTRACT_PRESERVING / COMPONENT_SCOPED / MINIMAL_SCOPE / NO_ARCHITECTURE_INVENTION / NO_SELF_APPROVAL`

This report records finding-driven remediation of revision `2` of the audited
component SPEC. It does not approve the SPEC and does not replace the
independent conformance audit.

Authority cutoff: accepted ADRs, approved portfolio revision `2`, conformant
upstream SPECs and the latest component audit, all inspected on `2026-09-09`.

The prior remediation report was consulted as historical evidence and moved
unchanged to:

`docs/specs/remediations/.history/SPEC-BACKEND-001-component-spec-remediation-2026-09-09-pre-reaudit.md`

Its SHA-256 is:

`98CF16D84EB1CC56241E855DD3829F8BFAEADB6B556E77A19F60AB23BCF79479`

## 2. Baseline

| Item | Before this remediation |
|---|---|
| Component SPEC | `docs/specs/SPEC-BACKEND-001-local-api-security-and-notifications.md` |
| Component revision/status | revision `2`, `PROPOSED` |
| Source audit | `docs/specs/audits/SPEC-BACKEND-001-component-conformance-audit.md` |
| Source verdict | `FAIL — COMPONENT_SPEC_NON_CONFORMANT` |
| Portfolio | `SPEC-PORTFOLIO-001`, revision `2` |
| Portfolio verdict | `PORTFOLIO_DECOMPOSITION_APPROVED` |
| Primary ADRs | `ADR-0011`, `ADR-0012`, revision `3`, `ACCEPTED` |
| Upstream SPECs | DOM, EXEC-001, EXEC-002, PLAT, REPO and GIT; latest audits conformant |
| Repository HEAD | `a58ce959f9b34f3c1c83ed41c01b058d31bf3366` |
| Working tree | pre-existing unrelated changes preserved; no relevant authority drift found |
| Validated findings | `CSC-MAJOR-001`, `CSC-MAJOR-002` |

The target content was revalidated against the latest audit before editing.
Both findings were `STILL_VALID`; no ADR, portfolio or upstream drift was
found. The target is now revision `3`, remains `PROPOSED`, and requires a fresh
independent conformance re-audit.

## 3. Source audit

Source audit:

`docs/specs/audits/SPEC-BACKEND-001-component-conformance-audit.md`

Source verdict:

`FAIL — COMPONENT_SPEC_NON_CONFORMANT`

The source audit was not modified. Its prior predecessor was archived before
the fresh audit; this remediation uses only the active latest audit and the
archived prior remediation as consultation evidence.

## 4. Authority used

| Authority | Use |
|---|---|
| `ADR-0012`, Decisão | idempotent/auditable delivery and intervention records with justification when applicable |
| `ADR-0006`, Decisão | deterministic effect keys, intent/evidence/confirmation ordering and evidence-first retry |
| Approved portfolio, revision 2 | BACKEND ownership of `O-068`; PLAT ownership of effect persistence/idempotency; dependency direction |
| `SPEC-PLAT-001`, conformant | durable effect identity, evidence, confirmation and retry semantics; no local PLAT contract extension |
| `SPEC-DOM-001`, conformant | canonical command/decision authority; no rationale applicability field is invented |
| Latest component audit | validated defect inventory and exact revalidation conditions |

The correction keeps concurrency admission inside BACKEND's owned notification
policy and leaves PLAT as the durable effect/evidence authority. No new ADR,
portfolio, upstream owner, canonical identifier or provider decision was added.

## 5. Findings ledger

| Finding | Before | Remediation | Authority | Local proof | Status |
|---|---|---|---|---|---|
| `CSC-MAJOR-001` | `BACKEND-NOTIFY-002` claimed that PLAT atomically admits one in-flight owner, although PLAT only defines deterministic key reuse and evidence-first retry | Moved concurrent admission to the BACKEND notification boundary; PLAT is referenced only for durable effect identity, evidence, confirmation and retry; updated requirement, retry rule, acceptance and conformance test | `O-068`, ADR-0012 Decisão; PLAT `O-034`/`PLAT-IDEMP-001` remains consumed without extension | `BACKEND-NOTIFY-002`, `AC-BACKEND-012`, `C-BACKEND-033` now state one active backend attempt and losing-attempt observation without attributing atomicity to PLAT | `REMEDIATED` |
| `CSC-MAJOR-002` | justification applicability was delegated to an unnamed canonical contract and a hypothetical N/A path | Current BACKEND human interventions are deterministically rationale-applicable; non-empty justification is mandatory; absent justification is rejected/unconfirmed; removed unsupported `C-BACKEND-035` | `O-068`, ADR-0012 Decisão; current DOM command contracts remain authoritative and no new field is defined | `BACKEND-INTERVENTION-001`, `AC-BACKEND-013`, `C-BACKEND-034` | `REMEDIATED` |

## 6. Files changed

| File | Change |
|---|---|
| `docs/specs/SPEC-BACKEND-001-local-api-security-and-notifications.md` | revision 3; corrected notification concurrency ownership and deterministic intervention justification coverage |
| `docs/specs/remediations/SPEC-BACKEND-001-component-spec-remediation.md` | this current remediation evidence |
| `docs/specs/remediations/.history/SPEC-BACKEND-001-component-spec-remediation-2026-09-09-pre-reaudit.md` | prior remediation moved unchanged at the user's request |

No ADR, portfolio, upstream SPEC, source audit, Gap Matrix, Implementation
Plan, ticket, production code or test file was modified.

## 7. Owned obligation remediation

All nine obligations remain assigned to BACKEND. Only `O-068` required this
round's correction; `O-060`–`O-067` remain conformant from the preceding
remediation.

| Obligation | Correction |
|---|---|
| `O-060`–`O-067` | preserved unchanged; previous audit evidence remains valid |
| `O-068` | BACKEND owns concurrent notification admission and requires non-empty justification for every current human intervention; PLAT remains consumed for durable effect semantics |

`OWNED_OBLIGATIONS_UNCOVERED = 0` and
`OWNED_OBLIGATIONS_PARTIAL = 0` after the targeted corrections.

## 8. Upstream contract remediation

No upstream contract was changed. The target no longer requires
`SPEC-PLAT-001` to provide atomic single-flight ownership. It now requires the
BACKEND notification boundary to admit at most one active delivery attempt for
one delivery identity within the running service, while all durable effect
identity, evidence, confirmation, reconciliation and restart retry remain
PLAT-owned.

The six approved normative dependencies and their directions are unchanged.

## 9. Requirement authority remediation

| Requirement | Portfolio obligation | ADR/upstream authority | Role | Correction |
|---|---|---|---|---|
| `BACKEND-NOTIFY-002` | `O-068` | ADR-0012 Decisão; ADR-0006 Decisão; PLAT-IDEMP-001 | BACKEND owner with PLAT consumer mapping | local concurrent admission; no PLAT atomicity claim |
| `BACKEND-INTERVENTION-001` | `O-068` | ADR-0012 Decisão; DOM command authority | BACKEND owner with DOM reference | all current human interventions require non-empty rationale |

No requirement is implementation-derived or unbacked. No new canonical
command field, PLAT guarantee, identity, lifecycle or dependency was created.

## 10. Lifecycle/identity remediation

Notification delivery retains one stable delivery identity across retries and
restarts. Concurrent attempts are serialized at the BACKEND boundary; durable
intent/evidence and restart reconciliation remain PLAT-owned. Losing attempts
do not create a second provider invocation while the backend-owned admission is
active and must observe the existing PLAT evidence before any later retry.

Intervention records now have a deterministic current lifecycle: an initiated
human intervention must carry a non-empty rationale before it can become a
confirmed intervention record. No N/A identity or canonical command field was
invented. Existing local-session identity and lifecycle rules remain unchanged.

## 11. Failure/recovery remediation

Missing intervention justification is a rejected or unconfirmed local
intervention condition; it does not change the canonical meaning of consumed
DOM failures. Provider failures remain PLAT effect/evidence failures and retain
their retryability, terminality, reconciliation and recovery semantics.

Concurrent delivery losers wait for or observe the existing backend admission
and PLAT evidence. Restart reuses the same delivery identity and PLAT
evidence-first recovery; no new key is invented by transport retry.

## 12. Compatibility/cutover remediation

No compatibility or cutover owner changed. Notification delivery remains on
the approved `NEW_CANONICAL_PATH`; legacy adaptation, historical replay,
cutover and retirement remain owned by the registry's existing components.
Intervention rationale is a current record invariant and does not create a
legacy path or a second authority.

## 13. Dependency remediation

No dependency was added, removed or reversed. The declared DAG remains:

```text
BACKEND → DOM
BACKEND → EXEC-001
BACKEND → EXEC-002
BACKEND → PLAT
BACKEND → REPO
BACKEND → GIT
```

The correction removes semantic overreach within the PLAT edge; it does not
change the edge itself.

## 14. Projection boundary remediation

The backend-owned admission rule is an application/effect scheduling boundary,
not a canonical PLAT record or projection. PLAT intent/evidence/confirmation
remains the durable source; notification status remains a projection of that
source. UI labels, transport acknowledgements and email delivery cannot create
or confirm the intervention record.

## 15. Acceptance/conformance remediation

Acceptance criteria remain 16 total. The changed criteria are:

* `AC-BACKEND-012` now distinguishes backend-owned concurrent admission from
  PLAT-owned durable effect identity/evidence/retry;
* `AC-BACKEND-013` now requires a non-empty justification for every current
  human intervention and rejects or leaves unconfirmed an absent value.

The conformance suite now contains 34 unique tests:

```text
C-BACKEND-033 concurrent backend admission and PLAT evidence observation
C-BACKEND-034 required non-empty justification for current interventions
```

The unsupported hypothetical `C-BACKEND-035` was removed. Existing positive,
negative, replay, recovery, boundary and synthetic-extensibility tests remain
unchanged.

## 16. Traceability remediation

The traceability matrix remains 16 rows for 16 requirements. The changed rows
now reference `AC-BACKEND-012`, `AC-BACKEND-013`, `C-BACKEND-033` and
`C-BACKEND-034` only. No traceability row references an unsupported PLAT
single-flight guarantee or an undefined N/A rationale contract.

## 17. Gap classification remediation

No implementation gap was closed. Productive backend, transport, security,
process, notification and intervention absence remains `IMPLEMENTATION_GAP`;
prototype behavior remains `PROTOTYPE_ONLY`. The SPEC remains the only target
artifact and no formal Gap Matrix was created or modified.

## 18. Implementation-plan leakage remediation

No implementation-plan leakage was introduced. “Backend-owned admission” is an
observable concurrency rule; it does not select a lock, queue, class, module,
database, route, library, provider or file layout. The protected token,
notification provider and storage mechanism remain intentionally unfrozen.

## 19. Mechanical validation

```text
PORTFOLIO_OBLIGATIONS_OWNED = 9
PORTFOLIO_OBLIGATIONS_COVERED = 9
OWNED_OBLIGATIONS_UNCOVERED = 0
OWNED_OBLIGATIONS_PARTIAL = 0
NORMATIVE_REQUIREMENTS = 16
REQUIREMENTS_WITHOUT_AUTHORITY = 0
CONSUMED_CONTRACTS = 8 contract groups; 6 normative upstream SPECs
CONSUMED_CONTRACTS_REDEFINED = 0
UNTESTABLE_REQUIREMENTS = 0
ACCEPTANCE_GAPS = 0
NORMATIVE_DEPENDENCIES = 6
UNAPPROVED_DEPENDENCIES = 0
MISSING_REQUIRED_DEPENDENCIES = 0
DEPENDENCY_DIRECTION_VIOLATIONS = 0
FAILURE_OWNER_VIOLATIONS = 0
COMPATIBILITY_OWNER_VIOLATIONS = 0
ARCHITECTURE_GAPS = 0
PORTFOLIO_GAPS = 0
UPSTREAM_CONTRACT_GAPS = 0
IMPLEMENTATION_PLAN_LEAKS = 0
REMEDIATED_FINDINGS = 2
PARTIAL_FINDINGS = 0
BLOCKED_FINDINGS = 0
ACCEPTANCE_CRITERIA = 16
CONFORMANCE_TESTS = 34
```

## 20. Remaining blockers

No remediation blocker remains. The component SPEC is not self-approved; a
fresh independent `audit-component-spec-conformance` run is mandatory before
Gap Matrix generation.

## 21. Reaudit readiness

The component SPEC now targets:

```text
READY_FOR_INDEPENDENT_COMPONENT_SPEC_REAUDIT
```

This is a remediation gate only. It is not a conformance verdict and does not
authorize implementation, Gap Matrix generation, planning or ticket
decomposition.
