# T012 — Temporal authority evidence

```text
PROOF = TAP-12
RESULT = TEMPORAL_AUTHORITY_PROTECTED
CALLER_AS_AUTHORITY_CHECK = PASS
CALLER_SUPPLIED_AUTHORITY_BYPASS = 0
```

Initial authority is obtained from `FinalConformanceEvidenceReader` for the
exact artifact/cycle/implementation scope. The requested caller bundle is only
a basis assertion and must match the first canonical observation. Before the
evaluation commit, the handler performs a second independent reader call and
requires a distinct observation ID plus exact equality of scope, dimensions,
outcomes, evidence IDs, evidence hashes, candidate basis, and evaluator
version.

Any source disappearance, observation identity reuse, or evidence drift fails
closed without repository mutation. The repository then applies the expected
`FinalConformanceRevision` as its CAS token. CAS provides physical atomicity;
DOM remains the semantic owner of the conformance result. The direct drift and
no-commit witness is `tests/dom-001-ticket-012.test.ts`, T12-AC3.
