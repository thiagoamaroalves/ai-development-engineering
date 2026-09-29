# AC-EXEC-001 — Structured consumption evidence

- Source-audit target: `AUDIT_TARGET_HEAD=1f27b0fe187325398524e351f56cacfc61eea1e4`; `AUDIT_TARGET_STATE_FINGERPRINT=c21d52859837764cd3bd22cc3c2cef5df7f8aeeba733724040eaec4d10cd2f3e`; source-audit SHA-256 `7086a500f9a963634e5c0d2f8223654fbc929e5b80f9d49533d687bab7e09207`.
- Remediation candidate baseline: HEAD `2d86c67121aed144b000051f13f7d6f689c63beb`; implementation fingerprint `e3fcd413314a277c8e78b49f1eda6f64cf149699ac9d937278019dd864258cd7` over the changed production/test paths.
- `ValidateExecContract` now rejects every structural port that is not an instance of the explicit authenticated producer contract before invoking it. A copied adapter, wrapper, result-shaped object, caller-selected verifier, and cold-start caller port cannot establish evidence.
- `AuthenticatedExecSchemaValidationPort` records producer instances and exact issued result objects in module-private `WeakSet`/`WeakMap` ledgers. The result has an exact five-field successful shape and no caller-controlled verifier metadata.
- The independently implemented adapter witness issues through the same producer contract and is consumed successfully for a valid pair; its capability-invalid payload and copied adapter are rejected. The owner adapter remains a separate infrastructure implementation behind the port.
- Returned envelope and payload expose typed canonical schema references and structured fields only after both authenticated results pass exact input/reference/fingerprint checks. `humanText` remains non-authoritative and cannot fill omitted fields.
- Direct cold-start witness imports only the application/domain boundary first, supplies a frozen self-describing caller result, and observes `CONTRACT_INVALID` rather than `VALID` before any infrastructure import.
- Focused runtime command: `node_modules/.bin/tsx --test tests/exec-001-ticket-001.test.ts`; 26 tests passed, 0 failed.
- Focused strict static result: PASS for the touched production modules, composition root and ticket test.
- Full repository result: PASS (84/84); no test failures or skips.
- The local schema harness remains testable-only (`PRODUCTIVE_AVAILABILITY=NO`); no integrated capability promotion is claimed.
