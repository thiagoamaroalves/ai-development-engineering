# AC-EXEC-002 — Required fields and fail-closed evidence

- Direct witnesses cover compiled JSON Schema validation, malformed/text-only input, caller-selected/custom/getter-backed schema rejection, semver and whitespace rejection, missing fields, own-enumerable required-field enforcement, authenticated producer evidence, untrusted wrapper rejection, caller-created verifier rejection, inherited fields, one-side-invalid input, forged/copy rejection, stale evidence, sparse arrays and non-JSON values.
- Missing, malformed, semver-invalid, inherited, untrusted-producer, stale-result and schema-adapter-failure inputs return `CONTRACT_INVALID`.
- Invalid results expose no approval, checkpoint or effect signal and never expose a partial validated pair.
- The authenticated result record is held in module-private producer/result `WeakSet` records rather than caller-visible verifier metadata. Domain value factories verify producer membership, exact input/reference binding and current fingerprint before construction; the payload factory also rechecks the canonical capability identity and required result field. Independent adapters use the explicit authenticated producer contract rather than a caller-shaped result protocol.
- Direct witnesses are in `tests/exec-001-ticket-001.test.ts`, including capability-specific schema selection, generic payload rejection, exact self-describing forged-result rejection, untrusted injected-port rejection, authenticated alternate-adapter consumption, caller-created always-true subtype rejection, runtime constructor guards and the generic delegation consumer regression.
- Focused runtime command: `node --experimental-strip-types --test tests/exec-001-ticket-001.test.ts`.
- Focused runtime result: PASS (25/25).
- Focused strict static result: PASS, including the producer-boundary support module.
