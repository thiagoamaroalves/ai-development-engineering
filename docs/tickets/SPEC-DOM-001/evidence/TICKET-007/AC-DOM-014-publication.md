# AC-DOM-014 — Publication vocabulary evidence

```text
TICKET = DOM-001-TICKET-007
IMPLEMENTATION = src/domain/publication.ts
OPERATION = Publication.transition
RESULT = PASS
```

The publication model exposes the eight canonical states and preserves the
semantic distinction between `PR_MERGED` and
`REMOTE_PUBLICATION_CONFIRMED`. A merged PR cannot be treated as a remote
confirmation without candidate-bound confirmation evidence. Confirmation now also binds `conformanceRunId`, accepted publication history
rehydrates only through the reconstruction authority, and GIT evidence crosses
the explicit `GitPublicationEvidenceMapper` boundary.

Witness: `tests/dom-001-ticket-007.test.ts`, `T7-AC1` and `T7-AC4`; 4 focused tests pass.
