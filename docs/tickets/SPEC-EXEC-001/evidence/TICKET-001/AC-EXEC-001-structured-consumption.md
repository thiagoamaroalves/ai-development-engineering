# AC-EXEC-001 — Structured consumption evidence

- `src/composition/exec-contract.ts` is the outer composition boundary; `ValidateExecContract` consumes the narrow `ExecSchemaValidationPort` and returns `ValidatedExecContract` only after both schema results are valid and domain field construction succeeds.
- Validation evidence is runtime-opaque and is issued only after a registered canonical adapter has successfully checked the exact current input/reference pair; pre-execution issuance, post-validation mutation, forged evidence, runtime-created canonical-looking references and copied branded values cannot reach structured consumption.
- Returned envelope and payload expose typed schema references and structured fields; `humanText` is ignored and cannot fill omitted authority.
- Runtime-callable class constructors are guarded by an internal construction token, and public value factories require explicit evidence from the successful schema-validation port result; direct construction without that evidence cannot mint validated values or pairs. Alternate ports remain substitutable when they delegate to a canonical adapter receipt, while an unproven port fails closed.
- The generic delegation consumer does not promote a text-only child value to canonical completion or effects: the direct regression verifies `INCOMPLETE_CANONICAL_RESULT` and no generated canonical state.
- Focused runtime command: `node --experimental-strip-types --test tests/exec-001-ticket-001.test.ts`.
- Focused runtime result: 20 tests passed, 0 failed, including pre-execution and post-validation-mutation evidence rejection, direct forged-evidence rejection at both factories, inherited-field rejection and the alternate port seam.
- Focused strict static result: PASS for the four edited production modules plus the internal evidence support module, composition root and ticket test.
