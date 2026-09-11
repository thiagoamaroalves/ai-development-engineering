# T004 — AC-DOM-009 provenance rehydration evidence

## Scope

This evidence covers reconstruction from accepted persisted provenance,
identity binding, revision continuity, and fail-closed rejection of missing,
detached, stale, duplicate, skipped, or inconsistent material.

## Direct executable witness

Command:

```text
prototype/node_modules/.bin/tsx.cmd --test tests/dom-001-ticket-004.test.ts
```

Result: 11 tests passed, 0 failed, 0 skipped.

The test suite verifies that rehydration preserves the accepted chain and
rejects invalid provenance before state is exposed or advanced. The authority
port is used to validate the canonical identity; local fixtures remain
contract fixtures and are not treated as productive foreign capability.

## Boundary conclusion

Rehydration reconstructs the aggregate from validated provenance and does not
recompute or silently repair an external authority chain.
