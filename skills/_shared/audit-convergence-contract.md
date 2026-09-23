# Audit Convergence and Non-Convergence Contract

This contract turns repeated re-audit behavior into an actionable process gate
without weakening independent audit coverage.

## Required per-finding metrics

For every canonical finding with lineage, record:

```text
CONSECUTIVE_FINDING_PERSISTENCE = <non-negative integer>
REMEDIATION_PROGRESS = NONE | PARTIAL | SUBSTANTIVE | CLOSED
CONVERGENCE_STATUS = CONVERGING | NON_CONVERGING | NEW_FINDING | CLOSED | BLOCKED
NON_CONVERGENCE_REASON = <reason or NONE>
EXPANDED_RADIUS_REQUIRED = YES | NO
```

`CONSECUTIVE_FINDING_PERSISTENCE` counts consecutive re-audits in which the
finding is `STILL_PRESENT` or `REGRESSED`. It resets only after the canonical
obligation is closed or the finding is rejected by objective evidence. A new
finding with an inherited campaign still receives its own lineage and campaign
row; it does not erase persistence of the underlying unresolved obligation.

## Mandatory expanded-radius gate

When the same blocking finding is `STILL_PRESENT` or `REGRESSED` for two
consecutive re-audits:

```text
CONVERGENCE_STATUS = NON_CONVERGING
EXPANDED_RADIUS_REQUIRED = YES
NON_CONVERGENCE_REASON = TWO_CONSECUTIVE_UNCLOSED_REAUDITS
```

The next remediation is not eligible for a remediation checkpoint until its
root-cause campaign matrix expands to all applicable surfaces and its preflight
proves the expanded negative witnesses. Repeating the previous narrow
remediation without new radius evidence is a process blocker, not progress.

If the expanded radius proves that a manifestation is outside the frozen ticket
scope, stop with the canonical upstream/escalation route rather than silently
widening scope.

## Campaign-level convergence

The canonical consolidator reports at least:

```text
CONVERGENCE_STATUS = CONVERGING | NON_CONVERGING | CLOSED | BLOCKED
NON_CONVERGENCE_FINDINGS = <finding ids or NONE>
EXPANDED_RADIUS_REQUIRED = YES | NO
CAMPAIGNS_TOTAL = <count>
CAMPAIGNS_NON_CONVERGING = <count>
```

These fields are a gate for remediation preparation, not a severity override.
Independent specialists still audit the complete profile on every re-audit.
