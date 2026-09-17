# AC-DOM-015 — Advancement gate evidence

```text
TICKET = DOM-001-TICKET-007
IMPLEMENTATION = src/domain/publication.ts; src/application/publication.ts
OPERATION = Publication.transition to LOCAL_INTEGRATION_PENDING
RESULT = PASS
```

Advancement requires an approved verdict, closed dependencies, no active work,
and a matching candidate basis. Missing verdict, open dependency, active work,
or changed candidate basis rejects without a state transition. Conflicting transition-ID replay and wrong-kind publication identity are
rejected, while concurrent same-revision commands produce one accepted result
and one stale rejection. The application maps foreign GIT evidence before the
domain gate.

Witness: `tests/dom-001-ticket-007.test.ts`, `T7-AC2` and `T7-AC4`; 4 focused tests pass.
