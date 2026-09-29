# AC-EXEC-001 — Structured consumption evidence

- Evidence refresh target: `AUDIT_TARGET_HEAD=b68eb87d8afc21b5683e89f4ecd3aee8d8238306`; `AUDIT_BASIS_FINGERPRINT=70f7ea178eabee7cef5e588756b093c1de366d85ce9171e05e2235e091996675`; remediation candidate remains uncheckpointed at controller HEAD `7a3b3b0653c563be62357eff88aa8fbdaf3eaf4a`.
- `src/composition/exec-contract.ts` is the outer composition boundary; `ValidateExecContract` consumes the narrow `ExecSchemaValidationPort` and returns `ValidatedExecContract` only after both canonical branded results are accepted and domain construction succeeds.
- The success contract carries exact input identity, canonical schema-reference identity and a current-content fingerprint. Plain caller result objects, copied adapters, caller-created verifier results, untrusted wrappers and runtime-created schema references fail closed.
- The canonical `JsonSchemaExecValidator` issues privately branded successful results; the owner-authorized receipt-replay seam transports only genuine receipts for direct stale-consumer testing. An untrusted wrapper cannot make a result-shaped object authoritative merely by copying fields.
- Returned envelope and payload expose typed schema references and structured fields; `humanText` is ignored and cannot fill omitted authority. Required fields inherited from `Object.prototype` are rejected before structured consumption.
- Getter-backed/custom schema definitions are rejected by exact owner-definition membership before schema document access, preventing document substitution at the compiler boundary. The former exported authenticated issuer base class is absent, so callers cannot self-register a validation producer.
- Focused runtime command: `node_modules/.bin/tsx --test tests/exec-001-ticket-001.test.ts`; 25 tests passed, 0 failed.
- Focused strict static result: PASS for the touched production modules, composition root and ticket test.
- Environment probe: the equivalent `node --experimental-strip-types --test tests/exec-001-ticket-001.test.ts` command failed with `ERR_NO_TYPESCRIPT`; it was not used as proof.
