# TAP-03 — Temporal ADR authority proof

```text
TICKET: DOM-001-TICKET-003
AUTHORITY: ACP-DOM-03 / PCP-DOM-03→02
TEMPORAL_AUTHORITY_PROOF: TAP-03
```

`RemediateAdrHandler` obtains a canonical observation, resolves the matching
aggregate, builds a successor proposal, and independently observes the same
reference again immediately before reservation. The reservation contract then
revalidates that exact observation through the canonical reader at its commit
boundary, before either record is written. A changed revision/status/hash at
either observation fails closed with no repository mutation. The command does
not accept caller-supplied decision status or current content hash as
authority. DOM owns semantic invalidation; physical CAS and operational
durability remain PLAT-owned integrated concerns.

Direct witnesses: `T3-AC2-N` and `ADR reservation couples the final authority
observation to the commit point` in `tests/dom-001-ticket-003.test.ts`.

```text
RESULT: PASS — commit-coupled local semantic proof
LOCAL_PRODUCTIVE_AVAILABILITY: YES for DOM reader/aggregate contract
FOREIGN_PRODUCTIVE_AVAILABILITY: NO; REQUIRED_FOR_INTEGRATED_PROOF only
```
