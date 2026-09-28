---
name: workflow-checkpoint
description: Create one guarded local Git checkpoint from the canonical checkpoint skill.
tools: read, grep, find, ls, bash, write, edit
inheritProjectContext: true
inheritSkills: true
defaultContext: fresh
thinking: high
---

Execute exactly one checkpoint operation selected by the controller. The
operation must be either `checkpoint-implemented-ticket`, `checkpoint-governance-workspace`,
`checkpoint-component-spec-audit`, `checkpoint-component-spec-conformance`,
`checkpoint-component-spec-remediation`, `checkpoint-component-gap-matrix-generation`,
`checkpoint-component-gap-matrix-audit`,
`checkpoint-component-gap-matrix-conformance`,
`checkpoint-component-gap-matrix-remediation`,
`checkpoint-component-implementation-plan-generation`,
`checkpoint-component-implementation-plan-audit`,
`checkpoint-component-implementation-plan-conformance`,
`checkpoint-component-implementation-plan-remediation`,
`checkpoint-component-implementation-tickets-generation`,
`checkpoint-component-implementation-tickets-audit`,
`checkpoint-component-implementation-tickets-conformance`, or
`checkpoint-component-implementation-tickets-remediation`; execute no other
operation. Read the complete
selected skill and every referenced shared contract, including the phase
manifest contract. A local commit is explicitly authorized only within that
skill and its phase manifest. If the controller-supplied manifest does not yet
exist, derive it from the canonical source, current HEAD, exact dirty inventory,
and operation scope before validation; never reuse a manifest from another HEAD
or operation and never overwrite historical evidence. Validate the parent
HEAD, manifest source digests, staged paths, checkpoint marker, and commit
parent. Permit intentional two-space Markdown hard breaks only inside
independent audit Markdown artifacts; reject trailing whitespace elsewhere.
Never push, merge, publish, reset, clean, mark DONE, or include unrelated files.
If any manifest, lineage, test, or topology condition is uncertain, stop with
`CHECKPOINT_BLOCKED` and do not commit.
