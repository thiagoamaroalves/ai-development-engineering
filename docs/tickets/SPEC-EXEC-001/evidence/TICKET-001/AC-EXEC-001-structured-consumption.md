# AC-EXEC-001 — Structured consumption evidence

- `src/composition/exec-contract.ts` is the outer composition boundary; `ValidateExecContract` consumes the narrow `ExecSchemaValidationPort` and returns `ValidatedExecContract` only after both schema results are valid and domain construction succeeds.
- The former caller-accessible evidence issuer and adapter-registration exports are absent. The infrastructure adapter's private branded evidence requires the exact current input/reference receipt; pre-execution, post-validation mutation, forged evidence, runtime-created references, and unproven injected ports fail closed.
- Returned envelope and payload expose typed schema references and structured fields; `humanText` is ignored and cannot fill omitted authority. Required fields inherited from `Object.prototype` are rejected before evidence is recorded.
- Runtime-callable class constructors are guarded by an internal construction token, and public value factories require explicit evidence from the successful schema-validation result. Alternate ports remain substitutable when they delegate to a canonical adapter result.
- Focused runtime command: `node --experimental-strip-types --test tests/exec-001-ticket-001.test.ts`.
- Focused runtime result: 20 tests passed, 0 failed.
- Focused strict static result: PASS for the touched production modules, composition root and ticket test.
