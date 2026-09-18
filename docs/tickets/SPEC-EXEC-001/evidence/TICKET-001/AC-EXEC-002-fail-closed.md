# AC-EXEC-002 — Fail-closed rejection evidence

- Invalid, text-only, missing-field, semver-invalid, caller-selected/custom schema, post-validation mutation, one-side-invalid and always-true-but-unproven adapter inputs return `CONTRACT_INVALID`.
- Schema adapter exceptions and malformed adapter results are normalized to the same canonical failure result.
- Invalid results preserve immutable expected schema references and mark `noApproval`, `noCheckpoint` and `noEffect` true; no partial validated pair is returned.
- Runtime constructor attempts for the envelope, payload and pair fail with a boundary error; public value factories without explicit successful schema-validation evidence, pre-execution evidence issuance, alternate schemas, inherited required fields and invalid semantic values cannot mint consumable values. The public domain module exposes no receipt-registration or receipt-recording authority.
- Direct witnesses are in `tests/exec-001-ticket-001.test.ts`, including the generic delegation consumer regression and schema-definition immutability witness.
- Focused runtime command: `node --experimental-strip-types --test tests/exec-001-ticket-001.test.ts`.
- Focused runtime result: PASS (20/20), including pre-execution evidence-issuance rejection, forged-evidence rejection at both public factories and the injected port seam, and inherited-field rejection for envelope and payload.
- Focused strict static result: PASS, including the opaque evidence support module.
