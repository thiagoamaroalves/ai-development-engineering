# AC-DOM-004 — Snapshot reconstruction evidence

Status: PRESENT

`ExecutionSnapshot.rehydrate` requires canonical SPEC and ADR reconstruction
authorities, validates the exact persisted basis, and returns immutable
`DRAFT`/`CONFIRMED` state. Missing or mismatched authority material is rejected
without materializing a valid snapshot.

Witnesses: T002 focused tests `rehydration uses canonical authorities and
preserves immutable confirmed state`, `rehydration requires authoritative
progression and rejects corrupt or forged material`, and `rehydration rejects
invalid progression and preserves the existing canonical record`, including
detached ADR, missing SPEC authority, duplicate/reordered progression,
identity/base divergence, forged basis, and invalid-state rejection.

Execution:

```text
node prototype/node_modules/tsx/dist/cli.mjs --test tests/dom-001-ticket-002.test.ts
12 tests, 12 passed, 0 failed
```

The local repository fixture is contract evidence only; durable restart and
physical recovery remain owned by PLAT.
