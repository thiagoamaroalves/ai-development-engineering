# AC-EXEC-002 — Fail-closed rejection evidence

- Invalid, text-only, missing-field, inherited-field, semver-invalid, caller-selected/custom/getter-backed schema, stale-result, one-side-invalid and untrusted adapter inputs return `CONTRACT_INVALID`.
- Schema adapter exceptions and malformed adapter results normalize to the same canonical failure result.
- Invalid results preserve immutable expected schema references and mark `noApproval`, `noCheckpoint` and `noEffect` true; no partial validated pair is returned.
- Runtime constructor attempts for the envelope, payload and pair fail with a boundary error. Public value factories require an authenticated producer-issued successful result bound to the exact input, canonical schema reference and current fingerprint; the payload factory also rechecks the canonical capability identity and required result field before materialization. An independent authenticated adapter is accepted only through the explicit producer contract; a plain wrapper is not.
- Direct witnesses are in `tests/exec-001-ticket-001.test.ts`, including exact-name caller-defined result rejection through the domain factory, caller-defined application-port rejection, copied-adapter rejection, authenticated alternate-adapter consumption, untrusted-wrapper rejection, caller-created always-true subtype rejection for valid and capability-invalid inputs, getter-backed-definition rejection, runtime constructor guards and the generic delegation consumer regression.
- Focused runtime command: `node --experimental-strip-types --test tests/exec-001-ticket-001.test.ts`.
- Focused runtime result: PASS (25/25).
- Focused strict static result: PASS, including the producer-boundary support module.
