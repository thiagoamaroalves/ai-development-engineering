# AC-EXEC-002 — Fail-closed rejection evidence

- Evidence refresh target: `AUDIT_TARGET_HEAD=b68eb87d8afc21b5683e89f4ecd3aee8d8238306`; `AUDIT_BASIS_FINGERPRINT=70f7ea178eabee7cef5e588756b093c1de366d85ce9171e05e2235e091996675`; remediation candidate remains uncheckpointed at controller HEAD `7a3b3b0653c563be62357eff88aa8fbdaf3eaf4a`.
- Invalid, text-only, missing-field, inherited-field, semver-invalid, caller-selected/custom/getter-backed schema, stale-result, one-side-invalid and untrusted adapter inputs return `CONTRACT_INVALID`.
- Schema adapter exceptions and malformed adapter results normalize to the same canonical failure result.
- Invalid results preserve immutable expected schema references and mark `noApproval`, `noCheckpoint` and `noEffect` true; no partial validated pair is returned.
- Runtime constructor attempts for the envelope, payload and pair fail with a boundary error. Public value factories require a canonical privately branded successful result bound to the exact input, canonical schema reference and current fingerprint; the payload factory also rechecks the canonical capability identity and required result field before materialization. The owner-authorized receipt-replay seam accepts only genuine canonical receipts; a plain wrapper is not.
- Direct witnesses are in `tests/exec-001-ticket-001.test.ts`, including exact-name caller-defined result rejection through the domain factory, caller-defined application-port rejection, copied-adapter rejection, owner-authorized receipt-replay consumption, untrusted-wrapper rejection, caller-created always-true subtype rejection for valid and capability-invalid inputs, getter-backed-definition rejection, runtime constructor guards and the generic delegation consumer regression.
- Focused runtime command: `node_modules/.bin/tsx --test tests/exec-001-ticket-001.test.ts`.
- Focused runtime result: PASS (25/25).
- Focused strict static result: PASS, including the canonical evidence support module.
- Environment probe: the equivalent `node --experimental-strip-types --test tests/exec-001-ticket-001.test.ts` command failed with `ERR_NO_TYPESCRIPT`; it was not used as proof.
