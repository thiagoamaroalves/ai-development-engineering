# AC-DOM-011 — Canonical failure-family evidence

This artifact indexes the direct failure witnesses for TICKET-005. The
productive command boundary returns and records the exact DOM-owned failure
codes without mutating the pipeline aggregate:

- `AC-DOM-011-unknown-spec.md` — `UNKNOWN_SPEC`
- `AC-DOM-011-ineligible-revision.md` — `INELIGIBLE_REVISION`
- `AC-DOM-011-dependency-closure.md` — `INVALID_DEPENDENCY_CLOSURE`
- `AC-DOM-011-command-basis.md` — `INVALID_COMMAND_BASIS`
- `AC-DOM-011-stale.md` — `STALE_REVISION`
- `AC-DOM-011-no-effect.md` — rejection correlation, idempotency, and no-effect proof
- T005 direct authority, malformed-input, and executable dependency-graph
  witnesses complete the local command-boundary proof.

The physical durable rejection journal and foreign transport mappings remain
integrated-only evidence, as declared by the ticket contract.
