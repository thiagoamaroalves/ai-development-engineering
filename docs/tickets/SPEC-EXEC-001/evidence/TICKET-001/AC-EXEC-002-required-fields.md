# AC-EXEC-002 — Required fields and fail-closed evidence

- Direct witnesses cover compiled JSON Schema validation, malformed/text-only input, caller-selected/custom schema rejection, semver and whitespace rejection, missing fields, own-enumerable required-field enforcement, owner-issued evidence, caller-created always-true subtype rejection, inherited required fields, one-side-invalid input, forged/copy rejection, stale evidence, sparse arrays and non-JSON values.
- Missing, malformed, semver-invalid, inherited, untrusted-producer, stale-result and schema-adapter-failure inputs return `CONTRACT_INVALID`.
- Invalid results expose no approval, checkpoint or effect signal and never expose a partial validated pair.
- The successful result is privately branded by the canonical adapter and carries `validatedInput`, canonical `schemaReference` and `contentFingerprint`. Domain value factories verify that owner-issued proof, exact input/reference binding and current fingerprint before construction; the payload factory also rechecks the canonical capability identity and required result field.
- Direct witnesses are in `tests/exec-001-ticket-001.test.ts`, including capability-specific schema selection, generic payload rejection, exact-name forged-result rejection, untrusted injected-port rejection, owner-issued delegating-wrapper consumption, caller-created always-true subtype rejection, runtime constructor guards and the generic delegation consumer regression.
- Focused runtime command: `node --experimental-strip-types --test tests/exec-001-ticket-001.test.ts`.
- Focused runtime result: PASS (23/23).
- Focused strict static result: PASS, including the producer-boundary support module.
