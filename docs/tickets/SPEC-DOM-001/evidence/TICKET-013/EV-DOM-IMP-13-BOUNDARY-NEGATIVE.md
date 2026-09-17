# EV-DOM-IMP-13-BOUNDARY-NEGATIVE

## Result

```text
TICKET = DOM-001-TICKET-013
IMPLEMENTATION_UNIT = DOM-IMP-13
ACCEPTANCE = T13-AC2, T13-AC5
RESULT = PRESENT; current basis refreshed 2026-09-16
```

The productive catalog, source adapter, and reader fail closed for unknown,
detached, wrong-kind, incomplete, mismatched, or removed authority state.
Named `PROPOSED`, `SUPERSEDED`, `REVOKED`, and `INVALIDATED` source states map
to the existing typed `INELIGIBLE` evidence without upgrading any value to
eligible or compatible. Explicit freshness changes remain observable.

No default, caller claim, ADR-only reader, projection, fake, test-only reader,
or self-comparison is used by the factory. Direct mutation attempts against
observations and nested values fail, and the import graph remains inside the
productive `src` tree.

## Executed witness

```text
COMMAND = npx --prefix prototype tsx --test tests/dom-001-ticket-013.test.ts
TESTS = 12
PASSED = 12
FAILED = 0
SKIPPED = 0
```

The architecture witness verifies that the factory requires
`CanonicalCommandAuthorityStateCatalog`, constructs the productive source,
and rejects an alternate non-catalog object before constructing the command
graph. The previous 12-test result remains numerically current; its cited
pre-catalog implementation hashes are historical.
