# T005 Authority Availability Reassessment — 2026-09-16

> Historical evidence. Superseded by `authority-availability-remediation-2026-09-16-reaudit-007.md`; its pipeline-derived freshness claim is not current.

```text
TICKET_ID = DOM-001-TICKET-005
IMPLEMENTATION_UNIT = DOM-IMP-05
FINDING = IMA-MAJOR-004
REMEDIATION_UNIT = RU-005-005
REASSESSMENT_RESULT = IMPLEMENTATION_LEVEL_REMEDIATION_COMPLETE
INDEPENDENT_AUDIT_RESULT = PENDING
```

The caller-supplied command-authority seam was removed from the productive
composition path.

Evidence:

- `src/application/command-authority.ts` now defines a concrete
  `CanonicalCommandAuthorityStateSource` bound to
  `CanonicalIdentityReconstructionAuthority` and `PipelineRepository`.
- The source validates the canonical STAGE reference, reads the canonical
  pipeline, returns complete immutable precondition evidence, and derives
  immutable freshness from the canonical pipeline revision.
- `src/application/composition.ts` constructs that source internally. Its
  dependency contract no longer accepts an authority-state callback or reader,
  so caller-selected authority cannot establish productive command truth.
- `tests/dom-001-ticket-013.test.ts` proves productive observation,
  composition, callback rejection, missing-dependency rejection, import-graph
  boundaries, and productive reread behavior. Test-only readers are confined
  to test scenarios and are not registered by the factory.

Validation executed on the remediation worktree:

```text
FOCUSED_T005_T013_TESTS = 25/25 PASS
FULL_REPOSITORY_TESTS = 102/102 PASS
STRICT_SOURCE_TYPECHECK = PASS
```

This evidence does not close the canonical finding independently. The next
required action is `audit-implemented-ticket`, which must pin the changed
implementation state and perform fresh specialist validation. PLAT command /
rejection durability and recovery remain the separate integrated-only
`IMA-MAJOR-002` handoff at CP-DOM-02.
