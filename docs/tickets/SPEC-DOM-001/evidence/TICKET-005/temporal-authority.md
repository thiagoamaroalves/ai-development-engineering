# T005 temporal authority evidence

Status: PRESENT locally; current basis refreshed 2026-09-16

The command carries canonical identity, expected aggregate revision,
dependency/verdict evidence, and correlation. The authority observation also
carries immutable dependency and verdict revision tokens. The aggregate
produces an immutable proposal and the repository receives the unchanged
expected revision. Commit-time re-observation compares both state and
semantic freshness before CAS; a same-status freshness change produces
`INVALID_COMMAND_BASIS` with no transition. CAS converts competing or stale
commands into the canonical `STALE_REVISION` rejection. Rejected commands are
recorded without transition/effect mutation.

The productive source is `CanonicalCommandAuthorityStateCatalog` in
`src/domain/command.ts`. It supplies explicit, independently versioned
freshness facts; it does not derive them from pipeline revision. The
application source and composition factory accept that concrete catalog only.
T005 test-only reader fixtures remain historical/local consumer-contract
witnesses and are not used by the productive factory.

Witnesses: T005 canonical-authority, productive factory composition,
same-status freshness drift, malformed-input, stale-revision, concurrent
one-winner, exact replay, and no-effect tests. T005 focused execution:
14/14 passed; T013 focused execution: 12/12 passed; combined focused execution:
26/26 passed; full productive suite: 103/103 passed. Strict source typecheck,
prototype lint, and prototype build passed. PLAT physical CAS/journal
durability is explicitly deferred to the integrated checkpoint.

The former 90-test count in historical evidence is superseded by the current
post-remediation basis recorded in
`evidence/TICKET-005/authority-availability-remediation-2026-09-16-reaudit-007.md`.
