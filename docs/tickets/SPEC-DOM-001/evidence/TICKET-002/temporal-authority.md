# T002 temporal authority evidence — TAP-02

Status: PRESENT locally

The manual snapshot flow performs the following protected sequence:

```text
canonical ADR observation → immutable DRAFT reservation
→ independent second ADR observation → exact basis comparison
→ conditional CONFIRMED transition
```

The drift witness changes the second observed content hash and verifies that
the reserved draft remains `DRAFT` with its original hash. A barrier-controlled
reservation witness proves that equivalent submissions cannot both reserve the
same ID. A false caller status/hash is rejected before reservation. No fallback
or self-comparison is used.

Witnesses: `manual submission consumes canonical ADR observations twice and
rejects caller authority claims`, `independent authority drift after
reservation preserves the reserved draft`, and `barrier-controlled concurrent
reservations have one winner and cannot overwrite a confirmed snapshot`.

Execution: T002 focused suite — 12/12 passed. Physical atomicity is deferred to
the PLAT integrated checkpoint.
