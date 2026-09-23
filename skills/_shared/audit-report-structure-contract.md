# Audit Report Structure and Lineage Contract

Independent audits and remediation records must separate stable facts from
round-specific change and lineage. This reduces document churn without
reducing evidence.

## Required report components

Each canonical re-audit/remediation package references:

```text
BASE_REPORT_PATH = <stable subject/baseline report>
ROUND_DELTA_PATH = <current round delta>
FINDING_LINEAGE_LEDGER_PATH = <append-only finding lineage ledger>
BASE_REPORT_IMMUTABLE = YES
ROUND_DELTA_COMPLETE = YES
FINDING_LINEAGE_LEDGER_COMPLETE = YES
```

The base report contains stable subject, authority, scope, ownership,
requirements, acceptance, baseline, and invariant facts. It is replaced only
when the authoritative subject changes under its owning workflow; a re-audit
must not rewrite historical round evidence merely to restate unchanged facts.

The round delta contains only current target state, changed evidence, new or
changed findings, remediation effects, regression results, metrics, and the
current verdict/gate. It must cite the base report and exact target fingerprint.

The lineage ledger is append-only and records for every finding/campaign:

```text
FINDING_ID
ROOT_CAUSE_CAMPAIGN_ID
ROUND
STATUS = NEW | STILL_PRESENT | REGRESSED | RESOLVED | SUPERSEDED | REJECTED
ORIGIN = PREEXISTING | REMEDIATION_INTRODUCED | NEWLY_APPLICABLE | UNKNOWN
PREVIOUS_FINDING_IDS
EVIDENCE_DELTA
REMEDIATION_UNIT_IDS
AUDIT_TARGET_HEAD
AUDIT_TARGET_STATE_FINGERPRINT
```

Unknown origin, missing predecessor linkage, or a rewritten historical status
is a completeness failure and blocks consolidation or checkpointing.
