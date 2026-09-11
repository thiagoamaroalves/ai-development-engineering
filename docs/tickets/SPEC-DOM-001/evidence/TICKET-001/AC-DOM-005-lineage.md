# TICKET-001 — AC-DOM-005 Lineage Evidence

```text
AC: AC-DOM-005
STATUS: SATISFIED
TEST_SURFACE: tests/dom-001-ticket-001.test.ts
```

Direct witnesses cover ADR→SPEC endpoint validation, catalog-backed endpoint
attachment during registration, detached endpoint rejection during recovery,
many-to-many relation registration, exact pair lookup, independent progress,
duplicate rejection, cross-relation isolation, deterministic one-winner
reservation, and stale expected-progress rejection without last-write-wins
mutation.

`AdrSpecLineage` remains immutable; accepted relation history is required for
rehydration and repository CAS remains the physical mutation contract.

TICKET_TESTS: 26/26 PASS
