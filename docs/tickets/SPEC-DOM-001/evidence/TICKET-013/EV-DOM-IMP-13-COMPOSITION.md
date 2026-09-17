# EV-DOM-IMP-13-COMPOSITION

## Result

```text
TICKET = DOM-001-TICKET-013
IMPLEMENTATION_UNIT = DOM-IMP-13
ACCEPTANCE = T13-AC4
RESULT = PRESENT; current basis refreshed 2026-09-16
```

`src/application/composition.ts` requires the concrete productive
`CanonicalCommandAuthorityStateCatalog`. It constructs
`CanonicalCommandAuthorityStateSource` and `CanonicalCommandAuthorityReader`
inside the runtime graph, then injects the reader into
`AdvancePipelineHandler`. It does not accept a prebuilt consumer-facing
`CommandAuthorityReader` or arbitrary state-reader substitute.

The factory witness supplies conflicting caller claims while the catalog
reports explicit source facts. The command outcome follows the catalog, not
the caller. The source can be replaced or removed between fresh observations;
those changes are handled by the existing T005 drift/no-effect boundary.

## Executed witnesses

```text
FOCUSED_COMMAND = npx --prefix prototype tsx --test tests/dom-001-ticket-013.test.ts
FOCUSED_TESTS = 12
FOCUSED_PASSED = 12

T005_COMMAND = npx --prefix prototype tsx --test tests/dom-001-ticket-005.test.ts
T005_TESTS = 14
T005_PASSED = 14

FULL_PRODUCTIVE_SUITE = 103 passed, 0 failed, 0 skipped
STRICT_SOURCE_TYPECHECK = PASS
```

The productive import-graph guard passed transitively and found no test,
prototype, transport, or infrastructure import in the runtime graph.
Previous 13-test and 102-test values are historical.
