# TICKET-001 — AC-DOM-001 Identity Evidence

```text
AC: AC-DOM-001
STATUS: SATISFIED
TEST_SURFACE: tests/dom-001-ticket-001.test.ts
```

Direct witnesses cover canonical identity creation, exact lookup, scoped
uniqueness, kind separation, positive revision continuity, exact predecessor
matching, catalog-backed immutable record rehydration, historical resolution,
detached/corrupt/noninitial recovery rejection, invalid kind/scope/revision
rejection, and filename-only rejection.

Execution summary:

```text
TICKET_TESTS: 26/26 PASS
AFFECTED_PRODUCTIVE_TESTS: 41/41 PASS
```

The persisted contract remains represented by the typed repository boundary;
physical durability is a PLAT-owned integration checkpoint.
