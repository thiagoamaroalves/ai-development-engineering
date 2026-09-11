# T004 — AC-DOM-010 state-machine isolation and concurrency evidence

## Scope

This evidence covers separate aggregate state inputs, derived higher states,
read-only query behavior, expected-revision compare-and-set semantics, and
concurrent advancement of one pipeline.

## Direct executable witness

Command:

```text
prototype/node_modules/.bin/tsx.cmd --test tests/dom-001-ticket-004.test.ts
```

Result: 11 tests passed, 0 failed, 0 skipped.

The suite directly proves that independent state inputs are not combined into
a transition, queries do not mutate state, and two concurrent advances with
the same expected revision have exactly one winner. The losing operation is
rejected as `PIPELINE_STALE`, and the accepted chain remains at the single
next stage with revision `1`.

## Boundary conclusion

The pipeline aggregate owns only its local state machines and derived state;
CAS prevents last-write-wins behavior without transferring authority to a
projection or repository fixture.
