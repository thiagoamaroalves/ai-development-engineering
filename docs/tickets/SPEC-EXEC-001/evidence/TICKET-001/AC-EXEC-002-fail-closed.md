# AC-EXEC-002 — Fail-closed rejection evidence

- Invalid, text-only, missing-field, inherited-field, semver-invalid, caller-selected/custom schema, stale-result, one-side-invalid and untrusted adapter inputs return `CONTRACT_INVALID`.
- Schema adapter exceptions and malformed adapter results normalize to the same canonical failure result.
- Invalid results preserve immutable expected schema references and mark `noApproval`, `noCheckpoint` and `noEffect` true; no partial validated pair is returned.
- Runtime constructor attempts for the envelope, payload and pair fail with a boundary error. Public value factories require an authenticated producer port and a successful result bound to the exact input, canonical schema reference and current fingerprint.
- Direct witnesses are in `tests/exec-001-ticket-001.test.ts`, including exact-name caller-defined result rejection through the domain factory, caller-defined application-port rejection, copied-adapter rejection, non-delegating producer-port success, runtime constructor guards and the generic delegation consumer regression.
- Focused runtime command: `node --experimental-strip-types --test tests/exec-001-ticket-001.test.ts`.
- Focused runtime result: PASS (21/21).
- Focused strict static result: PASS, including the producer-boundary support module.
