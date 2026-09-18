# AC-EXEC-002 — Fail-closed rejection evidence

- Invalid, text-only, missing-field, inherited-field, semver-invalid, caller-selected/custom schema, post-validation mutation, one-side-invalid and always-true-but-unproven adapter inputs return `CONTRACT_INVALID`.
- Schema adapter exceptions and malformed adapter results normalize to the same canonical failure result.
- Invalid results preserve immutable expected schema references and mark `noApproval`, `noCheckpoint` and `noEffect` true; no partial validated pair is returned.
- Runtime constructor attempts for the envelope, payload and pair fail with a boundary error; public value factories without explicit successful schema-validation evidence, alternate schemas, inherited required fields and invalid semantic values cannot mint consumable values.
- Direct witnesses are in `tests/exec-001-ticket-001.test.ts`, including the absent former issuer/registration export guard, injected-port rejection and generic delegation consumer regression.
- Focused runtime command: `node --experimental-strip-types --test tests/exec-001-ticket-001.test.ts`.
- Focused runtime result: PASS (20/20).
- Focused strict static result: PASS, including the opaque evidence support module.
