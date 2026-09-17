# EV-DOM-IMP-13-TEMPORAL-REOBSERVATION

## Result

```text
TICKET = DOM-001-TICKET-013
IMPLEMENTATION_UNIT = DOM-IMP-13
ACCEPTANCE = T13-AC3
RESULT = PRESENT; current basis refreshed 2026-09-16
```

The productive catalog and observation adapter perform no caching or
self-comparison. Each observation reads the canonical identity, current
pipeline, and explicit command-authority source again. A source replacement
with the same statuses but a new freshness token is visible on the next read.
A source removal returns no observation.

Factory-backed witnesses prove that T005 rejects before `advance` when the
pipeline stage/revision changes or when the command-authority source disappears.
T005 remains the owner of drift classification, no-effect rejection, and CAS.

## Executed witnesses

```text
T013_COMMAND = npx --prefix prototype tsx --test tests/dom-001-ticket-013.test.ts
T013_TESTS = 12
T013_PASSED = 12

T005_COMMAND = npx --prefix prototype tsx --test tests/dom-001-ticket-005.test.ts
T005_TESTS = 14
T005_PASSED = 14

FULL_RELEVANT_COMMAND = npx --prefix prototype tsx --test tests/*.test.ts
FULL_RELEVANT_TESTS = 103
FULL_RELEVANT_PASSED = 103
STRICT_SOURCE_TYPECHECK = PASS
```

Current producer/source-test basis:
`01978373A7C917D5872D093A1ADFA49A71F031DAB38B673F219A1FA35DD38E04`.
Earlier counts and pre-catalog hashes are historical.
