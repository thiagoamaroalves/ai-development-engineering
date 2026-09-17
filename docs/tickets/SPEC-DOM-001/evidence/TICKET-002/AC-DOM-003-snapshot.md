# AC-DOM-003 — Authority-backed immutable snapshot evidence

Status: PRESENT

TICKET-002 now resolves ADR status, revision, and content hash from the
promoted TICKET-003 `AdrAuthorityReader`. Caller-supplied status/hash values,
when retained for compatibility, are consistency assertions only. The
snapshot reserves a `DRAFT`, performs an independent second observation, and
confirms only when the complete basis matches. Hash, base, configuration, and
exact version values are frozen in the aggregate.

Witnesses:

- `manual submission creates a confirmed immutable snapshot with exact authority basis`
- `manual submission consumes canonical ADR observations twice and rejects caller authority claims`
- `independent authority drift after reservation preserves the reserved draft`
- `confirmation rejects authority drift without mutating the draft`
- `snapshot admission requires canonical authority and repository outcomes preserve isolation`
- `barrier-controlled concurrent reservations have one winner and cannot overwrite a confirmed snapshot`

Execution:

```text
node prototype/node_modules/tsx/dist/cli.mjs --test tests/dom-001-ticket-002.test.ts
12 tests, 12 passed, 0 failed
```

Physical PLAT persistence/CAS remains an integrated-only checkpoint.
