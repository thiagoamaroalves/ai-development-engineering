# TICKET-001 — Alternate Identity Authority Evidence

```text
AC: AC-DOM-001
STATUS: SATISFIED
TEST: does not accept PipelineId-shaped input as a canonical identity command
```

The canonical identity command boundary requires the typed kind/scope/value
contract. A `PipelineId`-shaped request is rejected with
`INVALID_AGGREGATE_KIND`; it cannot create or resolve a canonical identity
record. The `CanonicalStageReference` factory narrows the accepted reference
to `STAGE`, execution scope, StageId value, and exact revision.

The productive `WorkflowPipeline` boundary now requires the DOM reconstruction
authority even for initial creation. Unregistered Stage references fail closed
without mutating the identity authority. Repository lookup and application
commands resolve the canonical reference before lookup/CAS or state reads.
Detached Stage references fail closed before the repository is touched, while
local alias-shaped input and non-`STAGE` references fail closed; no parallel
`PipelineId` authority remains.
