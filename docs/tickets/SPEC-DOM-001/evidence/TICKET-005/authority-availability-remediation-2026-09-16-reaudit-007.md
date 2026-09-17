# T005 authority-availability remediation proof — re-audit 007

```text
TICKET_ID = DOM-001-TICKET-005
IMPLEMENTATION_UNIT = DOM-IMP-05
CANONICAL_FINDING = IMA-MAJOR-004
ROOT_CAUSE = RC-MAJOR-004
REMEDIATION_UNIT = RU-001
RESULT = VALIDATED_AND_REMEDIATED; independent re-audit required
```

## Productive producer correction

`CanonicalCommandAuthorityStateCatalog` in `src/domain/command.ts` is now the
concrete non-test DOM producer for command-authority facts. It admits only
complete canonical STAGE records, stores explicit lifecycle, closure, verdict,
and independently supplied freshness values, and returns fresh immutable
precondition/freshness objects on every read. It does not derive authority from
pipeline existence/revision or caller claims.

`CanonicalCommandAuthorityStateSource` accepts only that concrete catalog, and
`createAdvancePipelineHandler` requires the catalog type at the runtime
composition boundary. A consumer-facing `CommandAuthorityReader`, arbitrary
reader, default, or test-only reader cannot be registered through the factory.

The producer supports explicit replacement/removal of canonical source facts
for lifecycle/freshness changes. Missing, malformed, mismatched, and removed
state fail closed. T005 remains the owner of policy evaluation, rejection
mapping, no-effect semantics, and commit/CAS behavior.

## Executed proof

```text
T005_FOCUSED = 14 passed, 0 failed, 0 skipped
T013_FOCUSED = 12 passed, 0 failed, 0 skipped
COMBINED_FOCUSED = 26 passed, 0 failed, 0 skipped
FULL_PRODUCTIVE_SUITE = 103 passed, 0 failed, 0 skipped
STRICT_SOURCE_TYPECHECK = PASS
PROTOTYPE_LINT = PASS
PROTOTYPE_BUILD = PASS
```

The T005 composition witness receives source-owned `UNKNOWN` facts, rejects
without advancing, replaces the source with explicit `KNOWN` facts, and then
accepts despite conflicting caller claims. T013 witnesses source variation,
independent reads, source disappearance, immutable output, factory binding,
and forbidden-import boundaries.

## Current source/test basis

```text
POST_REMEDIATION_SOURCE_TEST_FINGERPRINT = 01978373A7C917D5872D093A1ADFA49A71F031DAB38B673F219A1FA35DD38E04
src/domain/command.ts = 24B09F41633A3E14DEB7FC44092F34DF4FDE6F1ABF95A400EA88AA3662D24AAC
src/application/command-authority.ts = 03EDCA432ACD981000F6871C47B234DED7F50B0E930F9C0CCA59FB7029683885
src/application/composition.ts = B660898F319313F4C9A360225D579E457740F59A6A28ED1FB0A30A61F715C474
tests/dom-001-ticket-005.test.ts = 52B640B28D9F73FF92E5A12259472F55E7AD1E1340064127175FB79C48D17C20
tests/dom-001-ticket-013.test.ts = 5492DBE75B965D86DECF332818673282C9D1CA0980DA14344EAC204F58E5AE5B

The previous 27693CA audit basis and pre-remediation fingerprints remain
historical. This proof does not mark T005 DONE and does not close the
integrated-only PLAT finding `IMA-MAJOR-002`.
