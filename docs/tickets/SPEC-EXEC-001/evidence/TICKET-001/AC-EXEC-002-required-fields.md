# AC-EXEC-002 — Required fields and fail-closed evidence

- Source-audit target: `AUDIT_TARGET_HEAD=1f27b0fe187325398524e351f56cacfc61eea1e4`; `AUDIT_TARGET_STATE_FINGERPRINT=c21d52859837764cd3bd22cc3c2cef5df7f8aeeba733724040eaec4d10cd2f3e`; source-audit SHA-256 `7086a500f9a963634e5c0d2f8223654fbc929e5b80f9d49533d687bab7e09207`.
- Remediation candidate baseline: HEAD `2d86c67121aed144b000051f13f7d6f689c63beb`; implementation fingerprint `e3fcd413314a277c8e78b49f1eda6f64cf149699ac9d937278019dd864258cd7` over the changed production/test paths.
- Direct witnesses cover compiled JSON Schema validation, malformed/text-only input, semver and whitespace rejection, missing fields, own-enumerable required-field enforcement, inherited values, sparse arrays, non-JSON values, caller-selected/custom/getter-backed schema rejection, authenticated producer evidence, copied/forged result rejection, cold-start caller injection, independent adapter substitution, stale/mutated input, one-side-invalid input and no-effect flags.
- Missing, malformed, semver-invalid, inherited, untrusted-producer, stale-result and schema-adapter-failure inputs return `CONTRACT_INVALID`; no validated value is constructed.
- The result contract is owner-bound by the explicit authenticated producer/result ledger rather than caller-provided `canonicalResultType` or import-time first-use state. The application checks the authenticated producer before invoking the injected port.
- Required structured fields remain enforced by the canonical definitions and immutable value boundaries; human text is never used as authority.
- Focused runtime command: `node_modules/.bin/tsx --test tests/exec-001-ticket-001.test.ts`; 26 tests passed, 0 failed.
- Focused strict static result: PASS, including the authenticated evidence support module.
- Full repository result: PASS (84/84); no test failures or skips.
- Environment probe: the equivalent `node --experimental-strip-types --test tests/exec-001-ticket-001.test.ts` command fails with `ERR_NO_TYPESCRIPT` in this Node binary and is not used as proof.
