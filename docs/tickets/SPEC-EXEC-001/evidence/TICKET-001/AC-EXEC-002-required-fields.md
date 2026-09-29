# AC-EXEC-002 — Required fields and fail-closed evidence

- Evidence refresh target: `AUDIT_TARGET_HEAD=b68eb87d8afc21b5683e89f4ecd3aee8d8238306`; `AUDIT_BASIS_FINGERPRINT=70f7ea178eabee7cef5e588756b093c1de366d85ce9171e05e2235e091996675`; remediation candidate remains uncheckpointed at controller HEAD `7a3b3b0653c563be62357eff88aa8fbdaf3eaf4a`.
- Direct witnesses cover compiled JSON Schema validation, malformed/text-only input, caller-selected/custom/getter-backed schema rejection, semver and whitespace rejection, missing fields, own-enumerable required-field enforcement, canonical branded evidence, untrusted wrapper rejection, caller-created verifier rejection, inherited fields, one-side-invalid input, forged/copy rejection, stale evidence, sparse arrays and non-JSON values.
- Missing, malformed, semver-invalid, inherited, untrusted-producer, stale-result and schema-adapter-failure inputs return `CONTRACT_INVALID`.
- Invalid results expose no approval, checkpoint or effect signal and never expose a partial validated pair.
- The canonical result carries a private brand and producer authorization outside caller-controlled fields; the productive infrastructure module primes the one canonical result-type identity before consumers run. Domain value factories verify canonical provenance, exact input/reference binding and current fingerprint before construction; the payload factory also rechecks the canonical capability identity and required result field. Receipt replay is owner-authorized and requires genuine canonical receipts rather than caller-shaped result metadata.
- Direct witnesses are in `tests/exec-001-ticket-001.test.ts`, including capability-specific schema selection, generic payload rejection, exact self-describing forged-result rejection, untrusted injected-port rejection, owner-authorized receipt replay, caller-created always-true subtype rejection, runtime constructor guards and the generic delegation consumer regression.
- Focused runtime command: `node_modules/.bin/tsx --test tests/exec-001-ticket-001.test.ts`.
- Focused runtime result: PASS (25/25).
- Focused strict static result: PASS, including the canonical evidence support module.
- Environment probe: the equivalent `node --experimental-strip-types --test tests/exec-001-ticket-001.test.ts` command failed with `ERR_NO_TYPESCRIPT`; it was not used as proof.
