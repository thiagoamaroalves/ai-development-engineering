---
name: audit-architecture-boundaries
description: >
  Independently audit an implemented ticket for canonical architecture,
  ownership, authority, identity, immutability, lineage, cross-spec contracts,
  legacy/cutover behavior, destructive-transition safety, migration authority,
  and affected authorization boundaries. Use when an implemented ticket needs
  a read-only specialist architecture audit. Do not use this skill to approve
  the ticket, remediate defects, or transition ticket state.
---

# Audit Architecture Boundaries

## Purpose

Determine whether the implementation preserves the canonical architectural
boundaries and authority model.

Primary question:

```text
DID_THE_IMPLEMENTATION_PRESERVE_ARCHITECTURAL_AUTHORITY_AND_OWNERSHIP?
```

This is a specialist audit. It reports architectural findings but does not
own the final ticket verdict, approve the ticket, remediate defects, or change
ticket state. It may create the required audit artifact; all other repository
and planning artifacts are read-only.

Read the shared authority-completeness reference at
`../_shared/authority-completeness-gates.md`. Use it for
authority consumption, producer/consumer, temporal authority, caller-as-
authority, identity, and reconstruction checks without repeating the full SPEC
audit.

Also read `../_shared/root-cause-campaign-contract.md` and
`../_shared/authority-provenance-anti-forgery-contract.md`. For every authority
or ownership violation, enumerate the complete affected surface matrix and
verify issuer, registrar, consumer, alternate authority, injection, mutation/
stale, port substitution, public export, and architecture-guard paths.

## Authority and audit mode

Use this precedence when sources disagree:

```text
Accepted ADR authority
↓ Canonical Specification
↓ Explicit cross-spec ownership contracts
↓ Validated Gap Matrix
↓ Implementation Plan
↓ Ticket
↓ Repository implementation
```

Architecture is determined by accepted authority, not implementation
convenience. Use:

```text
READ_ONLY INDEPENDENT ADVERSARIAL ARCHITECTURE_FIRST
OWNERSHIP_PRESERVING AUTHORITY_PRESERVING CROSS_SPEC_AWARE
IDENTITY_AWARE LEGACY_TRANSITION_AWARE EXHAUSTIVE_WITHIN_DOMAIN
```

Do not infer ownership from folder structure, class names, existing adapters,
or the implementation itself. Repository code and tests establish actual
behavior; ticket notes and execution reports are claims that require evidence.

## Inputs and preflight

Identify from the ticket, upstream artifacts, repository, and VCS:

```text
TICKET_ID
IMPLEMENTATION_UNIT
SPEC_PATH
ADR_PATHS
CROSS_SPEC_REFERENCES
GAP_IDS
REQUIREMENT_IDS
AUTHORITY_CONSUMPTION_PROOF
PRODUCER_CONSUMER_CONTRACT_PROOF
TEMPORAL_AUTHORITY_PROOF
IMPLEMENTATION_PLAN_PATH
TICKET_PATH
IMPLEMENTATION_BASELINE
CURRENT_HEAD
AUDIT_TARGET_HEAD
AUDIT_TARGET_STATE_FINGERPRINT
CHANGED_FILES
```

`AUDIT_TARGET_HEAD` identifies the base commit. The semantic implementation
subject may include a working-tree overlay only when its exact content is
covered by `AUDIT_TARGET_STATE_FINGERPRINT` and remains unchanged during the
audit.

Also identify the ticket status and the ticket folder where the audit artifact
belongs. Inspect the actual implementation and all affected boundary paths.

If the ticket is not implemented, the baseline/HEAD cannot be attributed, or
the authoritative ADR/specification/contract inputs are unavailable or
contradictory, create a partial artifact if possible and return
`SPECIALIST_AUDIT_BLOCKED` with the concrete blocker. Do not resolve missing
architecture authority by inference. A finding of an unresolved architectural
decision during an otherwise valid audit is reported as
`ARCHITECTURAL_AUTHORITY_GAP_DISCOVERED = YES` and does not by itself justify
silently choosing a design.

## Phase 1 — Reconstruct the architectural contract

Read accepted authority before reading implementation details. Record:

```text
LOCAL_OWNER
LOCAL_AUTHORITIES
FOREIGN_OWNERS
FOREIGN_CAPABILITIES_CONSUMED
CANONICAL_IDENTITIES
IMMUTABILITY_RULES
LINEAGE_RULES
LEGACY_AUTHORITY_RULES
CUTOVER_RULES
MIGRATION_AUTHORITY
SECURITY_BOUNDARIES
DOES_NOT_IMPLEMENT
```

For every item, retain the exact source path and requirement/contract anchor.
Capture what this ticket may own, what it may consume, and what it must leave
to another owner.

## Phase 2 — Applicability matrix

Classify each dimension as `REQUIRED`, `AFFECTED`, or `NOT_APPLICABLE`:

```text
OWNERSHIP
CANONICAL_AUTHORITY
CROSS_SPEC_INTEGRATION
IDENTITY
IMMUTABILITY
LINEAGE
LEGACY_TRANSITION
DESTRUCTIVE_TRANSITION
MIGRATION_AUTHORITY
SECURITY_AUTHORIZATION
```

For every `NOT_APPLICABLE`, record a reason grounded in the authority and
changed behavior. Whenever production behavior changes, evaluate Ownership and
Canonical Authority for impact at minimum. Run every `REQUIRED` and `AFFECTED`
dimension; do not stop after finding a critical defect.

## Phase 3 — Ownership and canonical authority

Inspect local code, persistence, handlers, workers, adapters, migrations, and
tests for foreign lifecycle or authority absorption. Check whether the ticket:

* creates foreign lifecycle state locally;
* duplicates foreign domain decisions or recomputes foreign outcomes;
* persists foreign authority as local authority;
* bypasses the canonical owner; or
* creates an alternative owner path.

Classify ownership as:

```text
OWNERSHIP_PRESERVED
OWNERSHIP_LEAKAGE
FOREIGN_CAPABILITY_DUPLICATED
AUTHORITY_RECOMPUTED_LOCALLY
REPOSITORY_SEMANTIC_AUTHORITY
```

Identify every canonical write or decision path affected by the ticket and
verify that exactly the authorized owner writes canonical state. Verify that
derived/projection state and orchestration state are not treated as business
authority. Classify authority as:

```text
AUTHORITY_PRESERVED
DUAL_AUTHORITY
ALTERNATE_AUTHORITY_INTRODUCED
PROJECTION_USED_AS_AUTHORITY
```

Dual authority, foreign lifecycle ownership, and any competing canonical write
path are normally `CRITICAL`.

Report `REPOSITORY_SEMANTIC_AUTHORITY` when a repository, mapper, serializer,
or persistence adapter decides domain meaning, lifecycle validity, identity
continuity, or provenance rather than enforcing only authorized physical
integrity.

## Phase 4 — Cross-spec integration

For every foreign capability consumed, verify all of the following:

* the foreign owner remains unchanged;
* the canonical identity and outcome are consumed intact;
* local code does not reproduce owner logic;
* unavailable or invalid owner outcomes are handled according to the contract;
* local persistence is not competing authority; and
* integration uses the intended contract and boundary.

Also verify the `AUTHORITY_CONSUMPTION_PROOF` and
`PRODUCER_CONSUMER_CONTRACT_PROOF`: the approved contract exists, has a real
producer and consumer, transports required data/version, defines failure and
stale semantics, and is productively available. Distinguish
`AUTHORITY_STATUS`, `CONTRACT_STATUS`, `LOCAL_TESTABILITY`, and
`PRODUCTIVE_AVAILABILITY`; a derived summary may report the five compatibility
labels but is not the source of truth. A fixture/mock/fake/in-memory repository
is never productive availability. Do not accept `PRODUCTIVE_AVAILABILITY = NO`
as a valid productive consumption seam, and flag any upstream READY/local-
closure claim that depends on that capability for local execution or closure.

Classify:

```text
CROSS_SPEC_CONFORMANT
PARTIAL
FOREIGN_BEHAVIOR_DUPLICATED
OWNER_OUTCOME_RECOMPUTED
INTEGRATION_NOT_PROVEN
```

## Phase 5 — Identity, immutability, and lineage

Run each dimension marked `REQUIRED` or `AFFECTED`.

Identity: verify canonical IDs, stable logical identity, no accidental ID
regeneration, no identity inferred from mutable display fields, and intact
identity across boundaries. Classify `CONFORMANT`, `PARTIAL`, or `VIOLATED`.

Immutability: verify that new revisions/versions create new historical records
when required, append-only history remains stable, historical evidence is not
mutated, and current-state convenience does not rewrite authoritative history.
Classify `CONFORMANT`, `PARTIAL`, or `VIOLATED`.

Lineage: verify predecessor/successor relationships, revision lineage, source
identity, derived-artifact references, digest/content identity where required,
and reconstruction of historical authority. Classify `CONFORMANT`, `PARTIAL`,
or `VIOLATED`.

Canonical identity, history, or lineage violations are normally `CRITICAL`.

For persistible aggregates/entities, verify reconstruction preserves the
canonical identity and validates progression evidence, predecessor continuity,
ordering, no state skips, incomplete-history behavior, fabricated-state
rejection, and domain-versus-persistence ownership. A persisted enum, CAS
revision, mapper, or repository decision is not lifecycle proof by itself.

## Phase 6 — Legacy authority and cutover

When applicable, audit:

```text
PRESERVE_LEGACY_READS
RETIRE_LEGACY_WRITES
REMOVE_ALTERNATE_AUTHORITY
ADD_COMPATIBILITY_MAPPING
MIGRATE_EXISTING_STATE
```

Verify that a replacement owner exists and is authoritative, legacy writers are
unreachable when retirement is required, legacy reads cannot regain write
authority, compatibility mapping cannot become an alternate authority, and no
dual writers remain. Classify:

```text
TRANSITION_CONFORMANT
TRANSITION_PARTIAL
DUAL_AUTHORITY_REMAINS
LEGACY_WRITES_STILL_ACTIVE
ALTERNATE_AUTHORITY_REMAINS
```

Behavioral compatibility belongs to the implementation-behavior audit; this
skill audits the authority transition and ownership boundary.

For destructive transitions, independently verify:

```text
REPLACEMENT_PROVEN
CUTOVER_AUTHORIZED
PRE_TRANSITION_GATES_SATISFIED
POST_TRANSITION_GUARDS_PRESENT
ROLLBACK_OR_ROLL_FORWARD_SEMANTICS_DEFINED
```

Evaluate only applicable fields, but record why an omitted field is not
applicable. An irreversible transition before replacement proof is normally
`CRITICAL`.

## Phase 7 — Migration and security boundaries

Migration logic must preserve canonical identity, history, ownership, and
authority. Verify it does not invent canonical authority, rewrite history
contrary to specification, create parallel ownership, or turn temporary
migration infrastructure into permanent authority. Classify:

```text
MIGRATION_AUTHORITY_PRESERVED
MIGRATION_AUTHORITY_PARTIAL
MIGRATION_AUTHORITY_VIOLATED
```

Run the authorization audit only when `SECURITY_AUTHORIZATION` is `REQUIRED`
or `AFFECTED`. This is an architecture-sensitive boundary audit, not a
penetration test. Verify:

* the backend remains authoritative;
* no alternate execution path bypasses authorization;
* capability possession does not replace required authorization;
* legacy routes do not bypass current authority; and
* cross-spec integration does not implicitly elevate authority.

Classify `CONFORMANT`, `PARTIAL`, or `NON_CONFORMANT`.

## Phase 8 — Architectural scope and systemic expansion

Classify architectural decisions introduced by the implementation as:

```text
IMPLEMENTATION_DETAIL
AUTHORIZED_ARCHITECTURAL_REALIZATION
UNAUTHORIZED_ARCHITECTURAL_EXPANSION
ARCHITECTURE_DECISION_REQUIRED
```

If correctness requires unresolved authority, set
`ARCHITECTURAL_AUTHORITY_GAP_DISCOVERED = YES`; report the missing decision and
its affected boundary without inventing it.

Run `CALLER_AS_AUTHORITY_CHECK` across lifecycle, eligibility, canonical
revision, status, current basis, ownership, approval, and domain state. Report
`CALLER_SUPPLIED_AUTHORITY_BYPASS` when caller input replaces canonical
authority. Run `TEMPORAL_AUTHORITY_PROOF` where mutable authority is observed
before an effect; self-comparison, snapshot reuse, caller trust, and CAS-only
revalidation are gaps.

When any ownership or authority violation is found, open or join a
`ROOT_CAUSE_CAMPAIGN_ID` and inspect equivalent paths in the affected boundary:
adapters, handlers, workers, migrations, projections, legacy routes, alternate
writers, public exports, and architecture guards. Complete every surface row,
record direct negative witnesses, and consolidate repeated manifestations into a
systemic root-cause finding while listing every related location.

When the ticket or design requires an architecture guard, verify an executable
guard exists and was run. Source inspection alone is not proof. The guard must
exercise the forbidden dependency, import, ownership route, or alternate
authority condition and assert the required rejection/preservation. Record:

```text
MISSING_ARCHITECTURE_GUARDS
ARCHITECTURE_GUARD_TESTS_RUN
ARCHITECTURE_GUARD_EVIDENCE
```

Any required guard without direct executable evidence is a finding, even when
ordinary behavior tests are green.

## Phase 9 — Findings and severity

Use only these IDs, in sequence within each severity:

```text
ARCH-CRITICAL-001
ARCH-MAJOR-001
ARCH-MINOR-001
ARCH-INFO-001
```

Use these severities:

```text
CRITICAL — dual authority, foreign lifecycle ownership, canonical identity or history violation, destructive transition without proof, caller-supplied authority bypass, temporal authority gap, non-consumable authority used as truth, or equivalent fundamental architecture violation
MAJOR    — material cross-spec, migration, authorization-boundary, or architectural conformance defect
MINOR    — localized architecture evidence or maintainability risk without canonical-authority violation
INFO     — non-blocking observation
```

Every finding must include:

```text
Severity
Ticket
Normative authority
Owner
Affected boundary
Repository evidence
Problem
Impact
Minimum correction required
Systemic pattern = YES | NO
Related locations
```

Do not use `IMA-*` IDs or issue a remediation yourself. The minimum correction
describes the smallest authority-preserving change another workflow would need.

## Required artifact

Create the following file in the ticket folder, without overwriting the ticket
or modifying upstream artifacts:

```text
<TICKET-ID>-architecture-audit.md
```

The artifact must be self-contained and include:

1. Audit identity, paths, baseline, current HEAD, changed files, and audit mode.
2. Reconstructed architectural contract and source precedence.
3. Applicability matrix with reasons for every `NOT_APPLICABLE` dimension.
4. Ownership, canonical authority, cross-spec, identity, immutability, lineage,
   legacy/cutover, destructive-transition, migration, authorization, and scope
   audit results, including evidence.
5. Systemic boundary expansion results.
6. Findings using the required IDs and fields.
7. The exact summary fields below and one specialist result.

Use `DOMAIN_AUDIT_COMPLETE = NO` if any required/affected dimension could not
be audited, and explain the blocker. Otherwise use `YES`, including when
findings exist.

## Required summary and result

The final response and artifact summary must use this shape. Replace every
placeholder with an evidence-backed value and return exactly one specialist
result:

```text
Audit: <path>

Specialist:
ARCHITECTURE_BOUNDARIES

Ticket: <ticket ID>

Ownership errors: <count>

Foreign capability duplication: <count>

Authority violations: <count>

Identity violations: <count>

Immutability/lineage violations: <count>

Legacy authority violations: <count>

Architectural authority gaps: <count>
Authority consumption gaps: <count>
Producer/consumer contract errors: <count>
Temporal authority gaps: <count>
Caller-supplied authority bypasses: <count>
Missing architecture guards: <count>
Architecture guard tests run: <count>

Findings:
CRITICAL=<count>
MAJOR=<count>
MINOR=<count>
INFO=<count>

Domain audit complete:
YES | NO

Specialist result:
SPECIALIST_ARCHITECTURE_PASS
|
SPECIALIST_ARCHITECTURE_FINDINGS
|
SPECIALIST_AUDIT_BLOCKED
```

`SPECIALIST_ARCHITECTURE_PASS` applies only to this specialist domain and
requires zero architectural findings that violate authority or ownership.
`SPECIALIST_ARCHITECTURE_FINDINGS` applies when findings exist, including
non-blocking observations. `SPECIALIST_AUDIT_BLOCKED` applies only when a valid
audit cannot be completed because required evidence or authority is missing.

Never return `READY_FOR_DONE`, approve the ticket, transition status, modify
implementation, or modify upstream planning/authority artifacts.
