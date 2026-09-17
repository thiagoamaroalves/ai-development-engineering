# AC-DOM-011 — STALE_REVISION evidence

Status: PRESENT locally

The existing expected-revision repository CAS remains the physical commit
guard. A command based on revision zero after another command has advanced the
aggregate is returned as `family=COMMAND_BASIS`, `code=STALE_REVISION`, with a
recorded correlation and no last-write-wins overwrite.

Witnesses:

- `stale revision returns STALE_REVISION, records it, and preserves the accepted aggregate`
- `concurrent commands sharing one expected revision have one winner and one stale rejection`

Execution: T005 focused suite — 14/14 passed. Physical PLAT CAS/durable journal
proof remains integrated-only.
