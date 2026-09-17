# TICKET-008 — Temporal authority evidence

```text
INITIAL_OBSERVATION = artifact revision, cycle identity, ordered round history
MUTATION_WINDOW = verdict request through cycle persistence
COMMIT_POINT = AuditCycleRepository.save(cycle, expectedRevision)
INDEPENDENT_SECOND_OBSERVATION = repository compares current cycle revision
DRIFT_DETECTION = stale expected round/revision or mismatched verdict attachment
FAIL_CLOSED_BEHAVIOR = reject close; cycle remains OPEN
STATE_PRESERVATION = YES
SEMANTIC_VALIDATION_OWNER = DOM cycle/round/verdict policies
CAS_OR_PHYSICAL_INTEGRITY_ROLE = repository/PLAT boundary
RESULT = PASS
```

Witness: `tests/dom-001-ticket-008.test.ts`, T8-AC3 barrier-controlled concurrent round append and stale loser assertions; 5 focused tests pass.
