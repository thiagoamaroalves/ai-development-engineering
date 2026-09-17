# AC-DOM-002 — Manual entry evidence

Status: PRESENT

The productive `SubmitManualExecutionHandler` accepts only the typed
`SubmitManualExecutionCommand`. Discovery/session-shaped input is rejected
before repository reservation, and no automatic trigger path is exposed.

Witness: T002 focused test `the boundary requires ADR and SPEC endpoints and
cannot be triggered by discovery-only input`.

Execution:

```text
node prototype/node_modules/tsx/dist/cli.mjs --test tests/dom-001-ticket-002.test.ts
12 tests, 12 passed, 0 failed
```

Foreign transport/session behavior remains outside this local DOM boundary.
