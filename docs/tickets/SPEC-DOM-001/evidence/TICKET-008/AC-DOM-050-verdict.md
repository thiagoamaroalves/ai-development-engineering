# AC-DOM-050 — Structured verdict closure evidence

```text
TICKET = DOM-001-TICKET-008
IMPLEMENTATION = src/domain/audit-cycle.ts; src/application/audit-cycle.ts
OPERATION = ArtifactCycle.close / AuditCycleCommandHandler.handle
RESULT = PASS
```

Only an audit-issued structured verdict attached to the exact artifact revision,
cycle, and latest round can close a cycle. Empty finding material,
unstructured input, absent cycle, detached verdicts and a second close are
rejected. Process termination and remediation commands are not approval
signals. Concurrent append is CAS-protected and EXEC evidence is mapped without
becoming cycle authority.

Witness: `tests/dom-001-ticket-008.test.ts`, `T8-AC2` and `T8-AC3`; 5 focused tests pass.
