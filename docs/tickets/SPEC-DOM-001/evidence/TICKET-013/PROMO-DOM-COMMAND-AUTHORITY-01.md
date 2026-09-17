# PROMO-DOM-COMMAND-AUTHORITY-01

```text
PROMOTION_RECORD = PROMO-DOM-COMMAND-AUTHORITY-01
PROMOTION_DATE = 2026-09-16
CAPABILITY_ID = CAP-DOM-COMMAND-AUTHORITY-OBSERVATION
AUTHORITY_OWNER = SPEC-DOM-001
PRODUCER = DOM-IMP-13 / DOM-001-TICKET-013
CONSUMER = DOM-IMP-05 / DOM-001-TICKET-005
EVIDENCE_OWNER = DOM-IMP-13

EVIDENCE_BASELINE_OR_COMMIT = 6b31bcee1591c8b2e6499a434950664077b2be01 plus current assessed remediation worktree
AUDIT_BASIS_FINGERPRINT = 01978373A7C917D5872D093A1ADFA49A71F031DAB38B673F219A1FA35DD38E04
PROMOTION_BASIS = current EV-DOM-IMP-13-AUTHORITY-READER-COMPLETE.md; current EV-DOM-IMP-13-COMPOSITION.md; current EV-DOM-IMP-13-TEMPORAL-REOBSERVATION.md; current EV-DOM-IMP-13-BOUNDARY-NEGATIVE.md

AUTHORITY_STATUS = DEFINED
CONTRACT_STATUS = DEFINED
LOCAL_TESTABILITY = YES
PRODUCTIVE_AVAILABILITY = YES for the concrete DOM producer; independent T005 re-audit remains pending
CAPABILITY_SUMMARY_STATUS = CONTRACT_PRODUCTIVELY_AVAILABLE

PREVIOUS_STATUS = CONTRACT_TESTABLE_LOCALLY
NEW_STATUS = CONTRACT_PRODUCTIVELY_AVAILABLE
PREVIOUS_PRODUCTIVE_AVAILABILITY = NO
NEW_PRODUCTIVE_AVAILABILITY = YES
PREVIOUS_CAPABILITY_SUMMARY_STATUS = CONTRACT_TESTABLE_LOCALLY
NEW_CAPABILITY_SUMMARY_STATUS = CONTRACT_PRODUCTIVELY_AVAILABLE

DEPENDENCY_CLASS = REQUIRED_FOR_LOCAL_EXECUTION
DEPENDENCY_EDGE = DOM-IMP-13 -> DOM-IMP-05
DEPENDENCY_CLASS_RECLASSIFICATION_REQUIRED = NO
UPSTREAM_DEPENDENCY_CLASSIFICATION_PRESERVED = YES

REQUIRED_PRECONDITIONS = concrete non-test catalog; runtime composition; complete immutable observation; independent reads; stale/lifecycle/closure/verdict/freshness-negative evidence; exact source/test basis
PROOF = current T013 producer evidence; T005 composition witness; 129 runtime cases; strict source/type/build checks; current source/test fingerprint
CONSUMER_HANDOFF_REVALIDATION = T005 must undergo the fresh independent consumer audit; fixture, mock, fake, prototype, or ADR-only observations remain invalid substitutes
REVALIDATION_RESULT = CONCRETE_PRODUCER_BOUND_AND_CURRENT; T005_REVALIDATION_PENDING
PROMOTION_STATUS = PROMOTED
PROMOTION_REVALIDATION_STATUS = PRODUCER_BASIS_REFRESHED; T005_INDEPENDENT_REAUDIT_PENDING
```

The concrete producer is `CanonicalCommandAuthorityStateCatalog` in
`src/domain/command.ts`. The application source adapter and composition
factory bind that catalog and reject arbitrary reader substitutes. This record
promotes only the DOM-internal capability; it does not finalize T005, mark it
DONE, or replace its independent audit.

Prior `C51BC87D...` and pre-catalog implementation hashes are historical and
are not the current promotion basis.
