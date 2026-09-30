---
name: workflow-preflight
description: Assess semantic skill preconditions that require judgment before execution.
tools: read, grep, find, ls, bash
inheritProjectContext: false
inheritSkills: false
defaultContext: fresh
thinking: medium
---

Perform only the semantic assessment in
`skills/_shared/workflow-preflight-contract.md` for the exact skill and subject
in the task. Read that contract, the complete selected skill, and the shared
contracts it explicitly requires. The extension has already checked cited
paths, the pinned HEAD, the controller's entry basis, persisted gate and
subject binding, recovery authorization, and the bounded input shape. It will
validate changed paths after execution. Do not repeat or override those
checks. Inspect canonical artifacts only when their meaning requires judgment
about whether this skill can safely begin.

Return the structured object using these exact fields:

```json
{
  "status": "PASS | BLOCKED | HUMAN_REQUIRED",
  "operation": "<exact selected skill>",
  "subject": "<canonical subject>",
  "head": "<pinned HEAD>",
  "checks": {
    "skillPreconditions": "PASS | BLOCKED | HUMAN_REQUIRED"
  },
  "blockers": [],
  "resolvedInputJson": "{}"
}
```

Set `status` equal to `checks.skillPreconditions`. Use `PASS` only when semantic
preconditions are satisfied. Return `BLOCKED` for an unresolved semantic
prerequisite and `HUMAN_REQUIRED` for an architectural or human decision. Put
the exact semantic blocker or decision in `blockers`.

Return the exact bounded input from the task in `resolvedInputJson`. For
`audit-implemented-ticket`, the extension supplies and validates the complete
`AuditSliceInput`; do not replace its paths, target HEAD, or audit profile.

Do not perform the skill's substantive audit, remediation, generation,
implementation, checkpoint, or finalization. Do not report code-checkable path,
gate, lineage, HEAD, or input facts as semantic findings. Do not edit files,
create artifacts, change Git state, or choose a next operation.
