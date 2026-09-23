# Root-Cause Campaign Contract

This contract governs systemic implementation findings whose manifestations may
appear across multiple issuers, registrars, consumers, authority paths, or
mutation/stale-state routes. It is required by canonical consolidation,
implemented-ticket remediation, implementation-behavior audit, and architecture
boundary audit.

## Campaign identity

Every systemic root cause receives one stable campaign record:

```text
ROOT_CAUSE_CAMPAIGN_ID = RCC-<stable id>
ROOT_CAUSE_ID = <canonical root cause>
CAMPAIGN_STATUS = OPEN | EXPANDED | READY_FOR_CLOSURE | CLOSED | BLOCKED
CAMPAIGN_SCOPE = <frozen ticket/spec scope>
CANONICAL_FINDINGS = <finding ids>
```

`ROOT_CAUSE_CAMPAIGN_ID` remains stable across re-audits while the underlying
root cause remains present. A new campaign is allowed only when evidence proves
an independent cause or an authority boundary outside the existing campaign.

## Required surface matrix

The campaign must enumerate every applicable surface row:

```text
SURFACE_ROW_ID
SURFACE_CLASS = ISSUER | REGISTRAR | CONSUMER | ALTERNATE_AUTHORITY_PATH |
                INJECTION_POINT | MUTATION_PATH | STALE_PATH |
                PORT_SUBSTITUTION_PATH | PUBLIC_EXPORT | PERSISTENCE |
                RETRY_RECOVERY | LEGACY_ROUTE | ARCHITECTURE_GUARD | TEST
LOCATION
OWNER
NORMATIVE_OBLIGATION
CURRENT_BEHAVIOR
EXPECTED_BEHAVIOR
RELATED_FINDING_OR_AC
COVERAGE_STATUS = COVERED | FIXED | NOT_APPLICABLE | OUTSIDE_SCOPE | MISSING
NEGATIVE_WITNESS_IDS
```

At minimum, a campaign must explicitly account for:

```text
ISSUERS
REGISTRARS
CONSUMERS
ALTERNATE_AUTHORITY_PATHS
INJECTION_POINTS
MUTATION_AND_STALE_PATHS
PORT_SUBSTITUTION_PATHS
PUBLIC_EXPORTS
```

## Closure gate

A campaign cannot be closed until:

```text
CAMPAIGN_MATRIX_COMPLETE = YES
ALL_SURFACE_ROWS_COVERED = YES
ALL_NEGATIVE_WITNESSES_PASS = YES
NO_UNEXPLAINED_PUBLIC_AUTHORITY_PATH = YES
NO_HIDDEN_CONCRETE_PROTOCOL = YES | NOT_APPLICABLE
ROOT_CAUSE_REMOVED = YES
KNOWN_MANIFESTATIONS_CLOSED = YES
SYSTEMIC_TEST_EVIDENCE = PRESENT
```

`OUTSIDE_SCOPE` and `NOT_APPLICABLE` require a reason and an owner/route. A
single happy-path witness or one corrected implementation site never closes a
campaign by itself. Do not merge independent obligations merely because they
share vocabulary; preserve separate findings while linking them to one campaign
when one correction obligation governs them.
