# AC-EXEC-001 — Structured consumption evidence

- `src/composition/exec-contract.ts` is the outer composition boundary; `ValidateExecContract` consumes the narrow `ExecSchemaValidationPort` and returns `ValidatedExecContract` only after both authenticated producer results are valid and domain construction succeeds.
- The success contract carries exact input identity, canonical schema-reference identity and a current-content fingerprint. Plain caller result objects, copied adapters, exact-name evidence lookalikes and runtime-created schema references fail closed.
- `AuthenticatedExecSchemaValidationPort` is the explicit producer boundary. A non-delegating independent adapter/harness can implement the approved port contract without importing a concrete infrastructure evidence class; the application does not accept an unbranded caller object as a producer, and the structured payload value independently verifies the selected capability's required semantic fields before construction.
- Returned envelope and payload expose typed schema references and structured fields; `humanText` is ignored and cannot fill omitted authority. Required fields inherited from `Object.prototype` are rejected before structured consumption.
- Focused runtime command: `node --experimental-strip-types --test tests/exec-001-ticket-001.test.ts`.
- Focused runtime result: 23 tests passed, 0 failed.
- Focused strict static result: PASS for the touched production modules, composition root and ticket test.
