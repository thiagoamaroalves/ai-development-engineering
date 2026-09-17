# T004 — AC-DOM-009 canonical pipeline order evidence

## Scope

This evidence covers canonical `STAGE` identity, immediate next-stage
ordering, rejection of skipped/duplicate/backward transitions, and accepted
provenance reconstruction.

## Direct executable witness

Command:

```text
prototype/node_modules/.bin/tsx.cmd --test tests/dom-001-ticket-004.test.ts
```

Result: 15 tests passed, 0 failed, 0 skipped.

The direct witnesses are in `tests/dom-001-ticket-004.test.ts`, including
canonical stage identity, valid sequential advancement, invalid transitions,
the exact accepted provenance chain after rehydration, plus direct duplicate,
reordered, detached, and exact-replay witnesses.

## Boundary conclusion

The local implementation enforces the canonical pipeline order without
introducing a downstream projection as a second authority.
