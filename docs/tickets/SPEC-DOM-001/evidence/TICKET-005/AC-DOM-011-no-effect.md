# AC-DOM-011 — Rejection recording and no-effect evidence

Status: PRESENT locally

`CanonicalCommandBoundary` records every canonical rejection through the
narrow `CommandRejectionRecorder` port. The local idempotent recorder fixture
returns the same record for an exact rejected replay. Negative and stale paths
do not invoke the aggregate transition writer, and the accepted aggregate
state remains unchanged.

Witnesses:

- `each canonical invalid precondition records one exact rejection and leaves state unchanged`
- `exact rejected replay is idempotent and cannot create an aggregate transition`
- `concurrent commands sharing one expected revision have one winner and one stale rejection`
- `canonical authority wins over conflicting caller claims and revalidates semantic truth at commit`
- `malformed commands use the canonical recorded no-effect boundary when correlation is recoverable`

Execution: T005 focused suite — 14/14 passed. Durable physical recording remains
the PLAT integrated checkpoint.
