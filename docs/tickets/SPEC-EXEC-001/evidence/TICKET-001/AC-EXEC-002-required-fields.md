# AC-EXEC-002 — Required fields and fail-closed evidence

- Direct witnesses cover compiled JSON Schema validation, malformed/text-only input, caller-selected/custom schema rejection, semver and whitespace rejection, missing fields, own-enumerable required-field enforcement, inherited required fields, one-side-invalid input, plain forged ports/results, stale producer results, sparse arrays and non-JSON values.
- Missing, malformed, semver-invalid, inherited, untrusted-producer, stale-result and schema-adapter-failure inputs return `CONTRACT_INVALID`.
- Invalid results expose no approval, checkpoint or effect signal and never expose a partial validated pair.
- The explicit successful result contract carries `validatedInput`, canonical `schemaReference` and `contentFingerprint`; value factories additionally require an authenticated producer port. This preserves stale-input rejection while allowing independent adapter/harness substitution without a hidden concrete-adapter evidence class.
- Direct witnesses are in `tests/exec-001-ticket-001.test.ts`, including exact-name forged-result rejection, untrusted injected-port rejection, non-delegating producer success, runtime constructor guards and the generic delegation consumer regression.
- Focused runtime command: `node --experimental-strip-types --test tests/exec-001-ticket-001.test.ts`.
- Focused runtime result: PASS (21/21).
- Focused strict static result: PASS, including the producer-boundary support module.
