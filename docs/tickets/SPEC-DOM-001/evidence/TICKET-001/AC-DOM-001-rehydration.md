# TICKET-001 — Identity and Lineage Rehydration Evidence

```text
AC: AC-DOM-001 / AC-DOM-005
STATUS: SATISFIED
TEST_SURFACE: tests/dom-001-ticket-001.test.ts
```

Identity records rehydrate through `CanonicalIdentityRecord.rehydrate` only
with the DOM reconstruction authority; the catalog proves exact attachment
and every predecessor revision before the immutable record is materialized.
`AdrSpecLineage.rehydrate` resolves both endpoints through that same authority
and compares progress/endpoints with accepted relation history. Pipeline
creation resolves the Stage reference before materialization; pipeline
rehydration validates the attached Stage identity and compares a complete
immediate-transition chain with accepted provenance history. Detached,
unknown, corrupt, fabricated, skipped, and noninitial-without-provenance
material is rejected without replacing valid state.

Direct witnesses:

- `rejects detached, corrupt, and noninitial identity recovery before materialization`;
- `rejects detached lineage endpoints during public recovery`;
- `rejects fabricated attached lineage progress without mutating accepted history`;
- `pipeline rehydration requires an attached complete immediate-transition chain`;
- `rejects a shape-valid pipeline provenance chain without accepted authority`;
- `rejects unregistered Stage creation without mutating the identity authority`;
- `effective pipeline consumption guard resolves catalog authority before repository access`.

```text
TICKET_TESTS: 26/26 PASS
AFFECTED_PRODUCTIVE_TESTS: 41/41 PASS
PROTOTYPE_REGRESSION_TESTS: 92/92 PASS
PROTOTYPE_LINT: PASS
PROTOTYPE_BUILD: PASS
STRICT_SOURCE_TYPECHECK: PASS
```
