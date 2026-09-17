# EV-DOM-IMP-13-AUTHORITY-READER-COMPLETE

## Result

```text
TICKET = DOM-001-TICKET-013
IMPLEMENTATION_UNIT = DOM-IMP-13
ACCEPTANCE = T13-AC1
RESULT = PRESENT; current basis refreshed 2026-09-16
```

`CanonicalCommandAuthorityStateCatalog` in `src/domain/command.ts` is the
concrete non-test DOM producer for command-authority facts. It admits only
complete canonical STAGE records, stores explicit lifecycle, closure, verdict,
and freshness values, and returns fresh immutable precondition/freshness
objects on every read. It does not derive authority from pipeline existence or
aggregate revision and does not consume caller claims.

`CanonicalCommandAuthorityStateSource` validates the catalog output. The
`CanonicalCommandAuthorityReader` resolves the exact canonical `STAGE`
identity, reads the current `WorkflowPipeline`, validates source identity and
all required fields, and returns a fresh frozen observation.

The focused tests assert exact identity, `ACCEPTED_ADRS`, aggregate revision `0`,
all four precondition statuses, both freshness tokens, lifecycle negatives,
source replacement/removal behavior, and failed mutation attempts against the
frozen outer and nested values.

## Executed witness

```text
COMMAND = npx --prefix prototype tsx --test tests/dom-001-ticket-013.test.ts
TESTS = 12
PASSED = 12
FAILED = 0
SKIPPED = 0
```

## Current implementation fingerprints

```text
src/domain/command.ts = 24B09F41633A3E14DEB7FC44092F34DF4FDE6F1ABF95A400EA88AA3662D24AAC
src/application/command-authority.ts = 03EDCA432ACD981000F6871C47B234DED7F50B0E930F9C0CCA59FB7029683885
src/application/composition.ts = B660898F319313F4C9A360225D579E457740F59A6A28ED1FB0A30A61F715C474
tests/dom-001-ticket-013.test.ts = 5492DBE75B965D86DECF332818673282C9D1CA0980DA14344EAC204F58E5AE5B
POST_REMEDIATION_SOURCE_TEST_FINGERPRINT = 01978373A7C917D5872D093A1ADFA49A71F031DAB38B673F219A1FA35DD38E04
```

This is producer evidence, not the independent T005 closure proof. The
previous pre-catalog hashes remain historical.
