# AC-EXEC-002 — Fail-closed rejection evidence

- Source-audit target: `AUDIT_TARGET_HEAD=1f27b0fe187325398524e351f56cacfc61eea1e4`; `AUDIT_TARGET_STATE_FINGERPRINT=c21d52859837764cd3bd22cc3c2cef5df7f8aeeba733724040eaec4d10cd2f3e`; source-audit SHA-256 `7086a500f9a963634e5c0d2f8223654fbc929e5b80f9d49533d687bab7e09207`.
- Remediation candidate baseline: HEAD `2d86c67121aed144b000051f13f7d6f689c63beb`; implementation fingerprint `e3fcd413314a277c8e78b49f1eda6f64cf149699ac9d937278019dd864258cd7` over the changed production/test paths.
- Invalid, text-only, missing-field, inherited-field, semver-invalid, caller-selected/custom/getter-backed schema, forged/copy/wrapper result, untrusted port, stale result, one-side-invalid, malformed adapter and throwing adapter inputs return `CONTRACT_INVALID`.
- Invalid results remain immutable, expose no approval/checkpoint/effect signal, and never expose a partial validated pair.
- The cold-start application-only witness rejects caller-supplied self-describing evidence before infrastructure bootstrap. The canonical adapter no longer relies on import order or a module-level bootstrap side effect.
- The approved authenticated producer boundary is restored for independent adapter substitution; receipt replay and the hidden concrete result/token protocol are no longer used as the alternate-adapter proof.
- Direct witnesses are in `tests/exec-001-ticket-001.test.ts`, including caller-injection, exact forged-result, copied-adapter, independent-adapter, stale/mutated-input, no-effect and no-partial-result cases.
- Focused runtime command: `node_modules/.bin/tsx --test tests/exec-001-ticket-001.test.ts`; 26 tests passed, 0 failed.
- Focused strict static result: PASS, including the authenticated evidence support module.
- Full repository result: PASS (84/84); no test failures or skips.
- Environment probe: the equivalent `node --experimental-strip-types --test tests/exec-001-ticket-001.test.ts` command fails with `ERR_NO_TYPESCRIPT` in this Node binary and is not used as proof.
