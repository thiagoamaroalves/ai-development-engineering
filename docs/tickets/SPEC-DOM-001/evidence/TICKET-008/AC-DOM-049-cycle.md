# AC-DOM-049 — Audit cycle identity evidence

```text
TICKET = DOM-001-TICKET-008
IMPLEMENTATION = src/domain/audit-cycle.ts
OPERATION = ArtifactCycle.create / appendRound
RESULT = PASS
```

Each cycle has an explicit `ARTIFACT_CYCLE` identity attached to an artifact
revision and an independent functional cycle revision. Round ordinals start at
one, cannot be skipped, and cannot reuse an auditor evidence record. Distinct
artifact-cycle identities remain distinct; accepted history rehydrates only
through the reconstruction boundary.

Witness: `tests/dom-001-ticket-008.test.ts`, `T8-AC1`, `T8-AC2` and `T8-AC3`; 5 focused tests pass.
