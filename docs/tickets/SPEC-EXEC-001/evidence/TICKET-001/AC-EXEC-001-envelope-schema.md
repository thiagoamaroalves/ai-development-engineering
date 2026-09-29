# AC-EXEC-001 — Envelope and payload schema evidence

- Source-audit target: `AUDIT_TARGET_HEAD=1f27b0fe187325398524e351f56cacfc61eea1e4`; `AUDIT_TARGET_STATE_FINGERPRINT=c21d52859837764cd3bd22cc3c2cef5df7f8aeeba733724040eaec4d10cd2f3e`; source-audit SHA-256 `7086a500f9a963634e5c0d2f8223654fbc929e5b80f9d49533d687bab7e09207`.
- Remediation start/current HEAD: `2d86c67121aed144b000051f13f7d6f689c63beb` (governance-only descendant; implementation changes are the current uncommitted remediation candidate).
- Remediation implementation fingerprint over the changed production/test paths: `e3fcd413314a277c8e78b49f1eda6f64cf149699ac9d937278019dd864258cd7`.
- Production boundary: `src/application/exec-contract.ts` (`ValidateExecContract`), composed by `src/composition/exec-contract.ts`.
- Domain contract: `src/domain/exec-schema.ts` and `src/domain/exec-validation-evidence-internal.ts` expose the narrow schema port plus the explicit authenticated producer contract. Producer membership and issued-result membership remain module-private; successful results are not self-describing.
- Adapter: `src/infrastructure/exec-schema-validator.ts` compiles only exact ticket-owned definitions and issues authenticated results through `AuthenticatedExecSchemaValidationPort`. The import-time bootstrap, first-result verifier, private concrete replay protocol, and receipt replay substitute were removed.
- Direct witnesses cover valid structured pairs, capability-specific selection, generic-but-capability-invalid rejection, schema identity, custom/getter-backed schema substitution rejection, forged/copy/wrapper rejection, independently implemented authenticated adapter positive/negative behavior, copied-adapter rejection, cold-start caller-injection rejection before infrastructure import, immutable values, own-enumerable required fields, stale evidence, and no-effect failure semantics in `tests/exec-001-ticket-001.test.ts`.
- Local capability status remains `LOCAL_TESTABILITY=YES`, `PRODUCTIVE_AVAILABILITY=NO`, `DEPENDENCY_CLASS=INFORMATIONAL`; this remediation does not promote the local harness or alter the integrated-only handoff.
- Focused runtime command: `node_modules/.bin/tsx --test tests/exec-001-ticket-001.test.ts`.
- Focused runtime result: PASS (26/26).
- Focused strict static command: `node_modules/.bin/tsc --noEmit --strict --target ES2023 --module NodeNext --moduleResolution NodeNext --allowImportingTsExtensions --skipLibCheck --types node src/domain/exec-contract.ts src/domain/exec-schema.ts src/domain/exec-validation-evidence-internal.ts src/application/exec-contract.ts src/infrastructure/exec-schema-validator.ts src/composition/exec-contract.ts tests/exec-001-ticket-001.test.ts`.
- Focused strict static result: PASS.
- Full repository test result: PASS (84/84); no test failures or skips.
- Environment probe: `node --experimental-strip-types --test tests/exec-001-ticket-001.test.ts` is unavailable in this Node binary (`ERR_NO_TYPESCRIPT`); the required `tsx` runner was used instead.
