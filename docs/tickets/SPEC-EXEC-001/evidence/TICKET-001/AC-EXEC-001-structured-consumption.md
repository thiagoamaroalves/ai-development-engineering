# AC-EXEC-001 — Structured consumption evidence

- `src/composition/exec-contract.ts` is the outer composition boundary; `ValidateExecContract` consumes the narrow `ExecSchemaValidationPort` and returns `ValidatedExecContract` only after both owner-issued canonical results are accepted and domain construction succeeds.
- The success contract carries exact input identity, canonical schema-reference identity and a current-content fingerprint. Plain caller result objects, copied adapters, caller-created always-true subtypes and runtime-created schema references fail closed.
- `src/infrastructure/exec-schema-validator.ts` privately constructs the only consumable successful result type. `src/domain/exec-validation-evidence-internal.ts` verifies its frozen private brand; an explicit adapter wrapper is accepted only when it transports that owner-issued result, not when it mints a result of its own.
- Returned envelope and payload expose typed schema references and structured fields; `humanText` is ignored and cannot fill omitted authority. Required fields inherited from `Object.prototype` are rejected before structured consumption.
- Focused runtime command: `node --experimental-strip-types --test tests/exec-001-ticket-001.test.ts`.
- Focused runtime result: 23 tests passed, 0 failed.
- Focused strict static result: PASS for the touched production modules, composition root and ticket test.
