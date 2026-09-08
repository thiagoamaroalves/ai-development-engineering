---
schema_version: "1.0.0"
id: SPEC-PORTFOLIO-001-DECOMPOSITION-REMEDIATION
title: SPEC-PORTFOLIO-001 - Decomposition Remediation
status: EVIDENCE
date: 2026-09-08
portfolio: SPEC-PORTFOLIO-001
source_audit: SPEC-PORTFOLIO-001-decomposition-audit.md
source_verdict: PORTFOLIO_DECOMPOSITION_REMEDIATION_REQUIRED
---

# SPEC-PORTFOLIO-001 - Decomposition Remediation

## 1. Remediation mode

`WRITE_ALLOWED / AUDIT_DRIVEN / ADR_FIRST / PORTFOLIO_FIRST / MINIMAL_SCOPE /
NO_ARCHITECTURE_INVENTION / NO_DOWNSTREAM_GENERATION / NO_IMPLEMENTATION /
NO_FINDING_SELF_CLOSURE`

This report records local remediation evidence. It does not alter the source
audit and does not issue an independent decomposition approval.

## 2. Baseline

| Field | Before remediation |
|---|---|
| Portfolio | `docs/specs/SPEC-PORTFOLIO-001-organization.md` |
| Audit report | `docs/specs/SPEC-PORTFOLIO-001-decomposition-audit.md` |
| Audit verdict | `PORTFOLIO_DECOMPOSITION_REMEDIATION_REQUIRED` |
| Repository HEAD | `d42a2dbe4d9e40dc7f139df920eb0a134c085aaf` |
| Working tree | `main...origin/main [ahead 4]`; pre-existing untracked `.gitignore` and `docs/specs/` |
| Portfolio revision | `1` |
| Component drafts | one materialized `PROPOSED` draft: `SPEC-DOM-001` |
| Accepted ADR authority | ADR-0001…ADR-0014, all `ACCEPTED`, `UNPROCESSED`, revision `3` |

The remediation changed the portfolio to revision `2`, retained status
`PROPOSED`, and left the historical audit immutable.

## 3. Input audit

The latest valid decomposition audit is the source above. Its validated finding
set is SPD-MAJOR-001 through SPD-MAJOR-006 and SPD-MINOR-001. The accepted ADR
portfolio remediation and the later ASC-MAJOR-002 schema remediation remain
supporting evidence; their content was not changed.

## 4. Findings remediated

| Finding | Before | Remediation | Mechanical evidence | Status |
|---|---|---|---|---|
| SPD-MAJOR-001 | ADR-family rows only; no stable one-row obligation ownership | Added O-001…O-078 registry with ADR section, owner, consumers, authority type, cross-cutting, failure and compatibility fields | 78 IDs, 78 `CANONICAL_OWNER` rows, zero owner cardinality violations | `REMEDIATED` |
| SPD-MAJOR-002 | 23 failure labels deferred to “spec owner” | Added 11-family semantic ownership and mapping matrix covering all 23 labels | 11/11 families have one semantic owner; code-list count is 23 | `REMEDIATED` |
| SPD-MAJOR-003 | General compatibility rule without allocation | Added 9-component × 5-cell matrix for new path, legacy, replay, cutover and retirement | 45 cells evaluated; 36 applicable cells have an owning boundary; 9 are justified `NOT_APPLICABLE` | `REMEDIATED` |
| SPD-MAJOR-004 | Backend commands/events and OPS findings could be read as canonical | Added command/event and finding/evidence class boundaries; narrowed BACKEND/OPS ownership | canonical owner vs mapping/projection classifications are explicit; no duplicate semantic owner | `REMEDIATED` |
| SPD-MAJOR-005 | Catalog and ASCII graph were ambiguous | Added one canonical 21-edge direct table and derived complete graph/order; removed duplicate graph | 21 table edges, zero self-edges/cycles, diagram/order derived from same set | `REMEDIATED` |
| SPD-MAJOR-006 | Inventory said no specs; DOM draft had reverse dependencies and ADR-0007 drift | Synchronized inventory; minimally changed DOM draft to consumer references and GIT ownership | 4 current `SPEC-*.md` files inventoried (3 in audit baseline plus this evidence report), 1 component draft, DOM has no downstream normative dependency | `REMEDIATED` |
| SPD-MINOR-001 | Gap category mixed closure/evidence labels | Added separate Gap ID, subject, category, closure status, evidence type, owner and next gate | 6 rows use governed separate fields; zero invalid taxonomy rows | `REMEDIATED` |

## 5. Files changed

| File | Scope |
|---|---|
| `docs/specs/SPEC-PORTFOLIO-001-organization.md` | portfolio revision, inventory, registries, boundaries, gates, acceptance and DoD |
| `docs/specs/SPEC-DOM-001-workflow-authority-and-governance.md` | minimal audited correction: downstream entries are consumers, and ADR-0007…ADR-0014 ownership references are synchronized with the portfolio |
| `docs/specs/SPEC-PORTFOLIO-001-decomposition-remediation.md` | this evidence report |

The decomposition audit, accepted ADRs, prototype, production code and tests
were not changed. No component SPEC was generated or promoted.

## 6. Obligation ownership remediation

The portfolio's section 8.2 is the canonical obligation registry. It expands
the audit's extracted O-001…O-078 IDs and enforces the chain:

```text
accepted ADR → obligation → one CANONICAL_OWNER → non-authoritative consumers
```

The ADR-level matrix is explicitly derived summary data. Owners are concrete
component IDs; values such as “all specs”, “transversal”, “implementation” or
“future spec” are not used as normative owner values.

## 7. Failure semantic ownership remediation

Section 15 assigns one semantic owner to each of 11 families and covers all 23
named classes. Backend is the transport/application mapping owner, OPS is the
log/observability owner, and UI is the presentation owner. The hierarchy is
canonical semantic → application mapping → transport representation →
operational logging → UI presentation. Consumers cannot change trigger,
meaning, retryability, terminality, recovery or authority implications.

## 8. Compatibility/cutover remediation

Section 16 evaluates every component across all five lifecycle columns. Each
applicable cell identifies one owner obligation or one owning consumer;
legacy support is explicitly an adapter to the new canonical path. Historical
artifacts are preserved and are not rewritten. Cutover and retirement remain
subject to the cited accepted ADR obligations and future component evidence.

## 9. Projection authority remediation

Section 14 classifies domain commands/events, application envelopes, transport
messages, integration events, projection events, findings, reports, effect
evidence, publication evidence, exports and UI projections. DOM owns canonical
domain/lifecycle/audit semantics; PLAT owns effect evidence and reconciliation;
GIT owns publication evidence; BACKEND maps and transports; OPS projects and
exports; UI presents and requests. No technical surface becomes canonical merely
because it carries, stores or renders a value.

## 10. Dependency graph remediation

Section 8.3 is the canonical direct normative edge list. It contains 21 edges,
each classified `NORMATIVE`, with reason, source obligation and directness; its
direction is `consumer → dependency`. The `COMPLETE_VIEW` diagram and
dependency-first topological order are derived representations. The UI-to-DOM
entry was treated as transitive rather than direct because UI consumes
BACKEND/OPS projections, matching the audit's 21-edge baseline; this removes an
ambiguous catalog interpretation without changing canonical semantics.

## 11. Repository-state synchronization

The portfolio now records the exact `docs/specs/SPEC-*.md` inventory: the
portfolio organization, its audit report, this remediation report, and one
`PROPOSED` DOM component draft. There are zero accepted component specs. The DOM draft remains
non-authoritative and its section 15 now lists downstream boundaries as
consumers rather than dependencies. Its ADR-0007 coverage points to
`SPEC-GIT-001`; the affected ADR-0010/0011/0013/0014 rows also now match the
portfolio's owner registry.

## 12. Gap taxonomy remediation

The portfolio's section 19 separates:

```text
Gap category | closure status | evidence type | owner | next gate
```

Allowed categories are `SPECIFICATION_GAP`, `IMPLEMENTATION_GAP`,
`ARCHITECTURE_GAP`, `NON_GAP`, `PROTOTYPE_ONLY` and
`UNFROZEN_IMPLEMENTATION_DETAIL`. No premature closure or audit verdict is
claimed. The local observation that no architecture gap was identified remains
subject to independent re-audit.

## 13. Acceptance/DoD remediation

Section 24 contains mechanically testable acceptance checks for obligation
coverage, unique ownership, failure semantics, compatibility, graph
consistency, projection boundaries, inventory, gap typing, prototype authority
and downstream-artifact prohibition.

Section 25 separates:

- Gate A: `PORTFOLIO_DECOMPOSITION_APPROVED`, issued only by independent audit;
- Gate B: future `SPEC_PORTFOLIO_CONFORMANT`, after materialized component SPECs
  are independently checked.

Section 26 defines decomposition readiness without requiring generated
component SPECs, a Gap Matrix, an Implementation Plan or tickets.

## 14. Mechanical validation

| Check | Result |
|---|---:|
| Authoritative ADRs | 14 |
| Architectural obligations | 78 |
| Component SPECs | 9 declared; 1 materialized `PROPOSED`; 0 accepted |
| Obligations with exactly one owner | 78 |
| Unowned obligations | 0 |
| Ambiguous owners | 0 |
| Multiple owners | 0 |
| Failure families | 11 |
| Failure families with one semantic owner | 11 |
| Named failure codes/classes covered | 23 |
| Compatibility obligations | 36 applicable cells; 45 cells evaluated |
| Compatibility obligations with one owner | 36 |
| Normative dependency edges | 21 |
| Dependency cycles | 0 |
| Graph representation mismatches | 0 |
| Component inventory mismatches | 0 |
| Invalid gap taxonomy rows | 0 |
| Findings remediated | 7 |
| Findings remaining | 0 |

Local checks also confirmed O-001…O-078 are unique and contiguous, every
failure code appears in exactly one family row, every compatibility cell has a
governed classification, no canonical graph self-edge exists, and no
Gap Matrix/Implementation Plan/ticket artifact was generated by this work.

## 15. ADR authority revalidation

All modified normative statements were checked against the accepted ADR set:

| Authority check | Result |
|---|---|
| ADR-0001…ADR-0014 status/revision | 14 accepted, unprocessed, revision 3 |
| No accepted ADR content changed | PASS |
| Ownership changes supported by accepted ADR sections or decomposition rules | PASS |
| BACKEND/OPS/UI narrowed to mapping/projection/presentation where applicable | PASS |
| Implementation details frozen accidentally | 0 |
| Architecture decision required during remediation | 0 |
| Prototype used as normative authority | 0 |

No database, DTO, route, transport technology, frontend framework, SMTP
provider, GitHub polling strategy, class layout or storage schema was frozen.

## 16. Remaining issues

No remediable finding remains in the latest audit baseline. The portfolio is
still `PROPOSED`; no audit finding is marked closed, and no decomposition
approval is asserted here. Independent re-audit must validate the registries,
the graph and the minimal DOM-draft correction in a fresh context.

## 17. Reaudit readiness

Local remediation checks support:

```text
READY_FOR_INDEPENDENT_DECOMPOSITION_REAUDIT
```

The mandatory next action is a fresh `audit-spec-portfolio-decomposition` run,
preferably in a different agent/session. This readiness signal is not
`PORTFOLIO_DECOMPOSITION_APPROVED`.
