# TICKET-007 — Temporal authority evidence

```text
INITIAL_OBSERVATION = candidate basis, verdict, dependency closure, and unit progress
MUTATION_WINDOW = publication gate request through repository persistence
COMMIT_POINT = PublicationRepository.advance(proposed, expectedRevision)
INDEPENDENT_SECOND_OBSERVATION = repository compares publication revision at advance
DRIFT_DETECTION = stale revision or candidate-basis mismatch
FAIL_CLOSED_BEHAVIOR = reject gate; preserve prior publication state
STATE_PRESERVATION = YES
SEMANTIC_VALIDATION_OWNER = DOM publication/gate policies
CAS_OR_PHYSICAL_INTEGRITY_ROLE = repository/PLAT boundary
RESULT = PASS
```

Witness: `tests/dom-001-ticket-007.test.ts`, T7-AC2 gate negatives and T7-AC4 concurrent CAS/recovery assertions; 4 focused tests pass.
