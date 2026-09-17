# T004 — AC-DOM-009 provenance witness evidence

## Scope

This is the exact provenance evidence path declared by the T004 acceptance
witness matrix. It records direct executable proof for accepted rehydration,
duplicate/reordered/detached provenance rejection, supplied-provenance
divergence rejection, and exact replay idempotency.

## Direct executable witness

Command:

```text
prototype/node_modules/.bin/tsx.cmd --test tests/dom-001-ticket-004.test.ts
```

Result: 15 tests passed, 0 failed, 0 skipped.

The direct witnesses are in `tests/dom-001-ticket-004.test.ts`:

- `pipeline rehydration requires an attached complete immediate-transition chain`
- `pipeline rehydration rejects duplicate, reordered, and detached provenance records`
- `pipeline rehydration rejects supplied provenance that diverges from accepted authority`
- `exact provenance replay is idempotent and does not mutate accepted history`

The local authority is a contract fixture only; it does not claim productive
PLAT replay or durability availability.

## Boundary conclusion

T004 now has an explicit, auditable provenance witness at the exact path named
by its acceptance matrix. Rehydration remains identity-bound, fail-closed, and
non-mutating on invalid or repeated input.
