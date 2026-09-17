# AC-DOM-052 — Final conformance dimensions

```text
TICKET = DOM-001-TICKET-012
WITNESS = T12-AC1
RESULT = PASS
DIMENSIONS = ADHERENCE, COVERAGE, INTEGRATION, REGRESSIONS, TESTS, OMISSIONS, EXTRAPOLATIONS
DIRECT_OPERATION = FinalConformanceHandler.handle with an exact evidence bundle
```

The productive evaluator requires exactly one evidence item for each of the
seven canonical dimensions. A complete bundle with all items marked `PROVEN`
returns a structured `CONFORMANT` evaluation. Omitted, duplicated, failed,
unknown, or extrapolated items produce explicit structured findings and cannot
produce `CONFORMANT`.

Evidence is bound to the canonical artifact and artifact-cycle references,
artifact revision, implementation revision, candidate base/head/tree,
conformance run, evaluator version, evidence ID, and evidence hash. The direct
executable witness is `tests/dom-001-ticket-012.test.ts`, T12-AC1, with both
complete and negative bundles.
