# T011 — AC-DOM-054 Exact Binding Evidence

```text
EVIDENCE_ID: T11-AC1
TICKET: DOM-001-TICKET-011
BEHAVIOR: bind candidate authorization to exact candidate/evidence basis
IMPLEMENTATION: src/domain/candidate-evidence.ts; src/application/candidate-evidence.ts
DIRECT_TEST: tests/dom-001-ticket-011.test.ts — T11-AC1 and recovery/mapper cases
RESULT: PASS
FOCUSED_TESTS: 6/6 PASS
```

The gate reuses T7 `CandidateBasis` and binds candidate ID, base SHA, head SHA,
tree hash, conformance run, evidence ID and evidence hash. GIT evidence is
translated by an ACL; no Git operation or remote state is executed locally.

```text
LOCAL_ACCEPTANCE: SATISFIED
WITNESS_EXECUTABLE_AT_LOCAL_CLOSURE: YES
EXACT_FIELDS_BOUND: 7
FOREIGN_GIT_EXECUTION: NOT_IMPLEMENTED_BY_DOM
```