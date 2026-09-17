# AC-DOM-052 — Exact-cycle linkage and recovery

```text
TICKET = DOM-001-TICKET-012
WITNESS = T12-AC3
RESULT = PASS
IDENTITY = ARTIFACT + ARTIFACT_CYCLE canonical references
BASIS = artifact revision + implementation revision + candidate base/head/tree + conformance run + evaluator version
```

The evaluator rejects wrong-kind and detached scope, caller-supplied evidence
that differs from the canonical observation, changed evidence between the two
observations, same-observation rereads, stale CAS, and conflicting replay.
`toSnapshot()`/`rehydrate()` preserves the exact artifact/cycle/implementation
basis, candidate basis, evidence IDs/hashes, result, and findings only when the
accepted reconstruction authority returns the same snapshot.

Exact retry returns the accepted immutable result as a duplicate. A different
basis cannot overwrite the accepted cycle result. The direct executable
witnesses are `tests/dom-001-ticket-012.test.ts`, T12-AC3 recovery, drift,
retry, stale, and concurrency cases.
