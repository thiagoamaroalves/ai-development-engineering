# AC-EXEC-002 — Required fields and fail-closed evidence

- Direct witnesses cover compiled JSON Schema validation, malformed/text-only input, caller-selected/custom schema, semver leading-zero and whitespace rejection, missing field, own-enumerable required-field enforcement for envelope and payload, one-side-invalid, construction without explicit validation evidence, alternate-port substitution, caller-authority API absence, non-JSON/inherited values, sparse arrays, own `__proto__` keys, structured failure references and malformed adapter outcomes.
- Missing, malformed, semver-invalid, unproven-adapter and schema-adapter-failure inputs return `CONTRACT_INVALID`.
- Invalid results expose no approval, checkpoint or effect signal and never expose a partial validated pair.
- The application boundary imports only domain contracts; `src/composition/exec-contract.ts` is the sole outer composition point for the concrete adapter. The productive graph guard enumerates the six current production modules, including the internal evidence support module, and rejects forbidden imports outside the adapter's approved `typebox` dependency.
- The generic delegation consumer regression separately proves text-only output cannot establish canonical completion/effect state.
- Focused runtime command: `node --experimental-strip-types --test tests/exec-001-ticket-001.test.ts`.
- Focused runtime result: PASS (20/20), including pre-execution/forged-evidence and runtime-created-reference rejection plus inherited required-field rejection for both schemas.
- Focused strict static result: PASS, including `src/domain/exec-validation-evidence-internal.ts`.
- Package `npm run typecheck` remains separate and is not used as evidence for ticket source.
