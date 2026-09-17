# T005 Authority Availability Remediation Proof — 2026-09-16

> Historical evidence. Superseded by `authority-availability-remediation-2026-09-16-reaudit-007.md`; its injected-reader claim is not the current producer proof.

```text
TICKET_ID = DOM-001-TICKET-005
IMPLEMENTATION_UNIT = DOM-IMP-05
CANONICAL_FINDING = IMA-MAJOR-004
ROOT_CAUSE = RC-MAJOR-004-REVALIDATED
REMEDIATION_UNIT = RU-001
RESULT = VALIDATED_AND_REMEDIATED; independent re-audit required
```

## Correction

The productive observation adapter no longer derives command authority from a
pipeline's existence or aggregate revision. `CanonicalCommandAuthorityStateSource`
now binds the complete DOM-owned state reader supplied by the runtime
composition and forwards only its identity, four precondition statuses, and
two freshness tokens after fail-closed validation.

`createAdvancePipelineHandler` now requires that complete state reader as an
explicit dependency and constructs the sole consumer-facing observation path.
No caller `CommandAuthorityReader`, default status, pipeline-derived freshness,
ADR-only observation, test import, or fallback authority is registered.

## Proof

```text
T013_FOCUSED = 12 passed, 0 failed, 0 skipped
T005_FOCUSED = 13 passed, 0 failed, 0 skipped
FULL_REPOSITORY = 102 passed, 0 failed, 0 skipped
STRICT_SOURCE_TYPECHECK = PASS
```

The focused producer/composition tests cover complete positive observation,
negative status preservation, same-status freshness drift, source disappearance,
conflicting caller claims, immutable output, sole factory wiring, and forbidden
productive import paths. The T005 suite continues to prove no-effect,
rejection-recording, replay/idempotency, temporal reread, and CAS behavior.

## Current file fingerprints

```text
23076E6D2DE24184450199A840FAC4F7AE022FFA3E69E1B102DCC0F6E535A0DD  src/application/command-authority.ts
948ECDA21EE1459604A47EC71F5D56FDF543AB935BE37FF9E987A251AF5AF108  src/application/composition.ts
051B524E0B762623DAE00290F18A93EEF2D7F5F0111DA827BD2CF83BD7BE7430  tests/dom-001-ticket-013.test.ts
```

This proof is remediation evidence only. The canonical audit remains the
authority for closure and must be rerun against this post-remediation basis.
`IMA-MAJOR-002` remains the separate integrated-only PLAT handoff at
`CP-DOM-02`; it is not changed by this correction.
