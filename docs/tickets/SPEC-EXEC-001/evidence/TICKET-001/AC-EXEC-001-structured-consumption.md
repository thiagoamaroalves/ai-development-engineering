# AC-EXEC-001 — Structured consumption evidence

- `src/composition/exec-contract.ts` is the outer composition boundary; `ValidateExecContract` consumes the narrow authenticated `ExecSchemaValidationPort` and returns `ValidatedExecContract` only after both owner-bound results are accepted and domain construction succeeds.
- The success contract carries exact input identity, canonical schema-reference identity and a current-content fingerprint. Plain caller result objects, copied adapters, caller-created verifier results, untrusted wrappers and runtime-created schema references fail closed.
- `AuthenticatedExecSchemaValidationPort` records issued result identity outside the result object. A conformant independent adapter satisfies the same explicit authenticated producer contract; an untrusted wrapper cannot make a result-shaped object authoritative merely by copying fields.
- Returned envelope and payload expose typed schema references and structured fields; `humanText` is ignored and cannot fill omitted authority. Required fields inherited from `Object.prototype` are rejected before structured consumption.
- Getter-backed/custom schema definitions are rejected by exact owner-definition membership before schema document access, preventing document substitution at the compiler boundary.
- Focused runtime command: `node --experimental-strip-types --test tests/exec-001-ticket-001.test.ts`.
- Focused runtime result: 25 tests passed, 0 failed.
- Focused strict static result: PASS for the touched production modules, composition root and ticket test.
