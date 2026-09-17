# AC-DOM-011 — Valid command evidence

Status: PRESENT

`AdvancePipelineHandler` now returns a canonical `ACCEPTED` outcome carrying
the unchanged canonical identity, expected revision basis, and correlation.
The existing `WorkflowPipeline` aggregate remains the owner of the accepted
immediate-successor transition.

Witness: T005 test `valid pipeline commands return the canonical accepted
result with correlation and basis`.

Execution: T005 focused suite — 14 tests, 14 passed, 0 failed.
