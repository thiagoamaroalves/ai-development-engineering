# AC-EXEC-002 — Required fields and fail-closed evidence

- Direct witnesses cover compiled JSON Schema validation, malformed/text-only input, caller-selected/custom schema rejection, semver and whitespace rejection, missing fields, own-enumerable required-field enforcement, inherited required fields supplied through both ordinary prototypes and `Object.prototype`, one-side-invalid input, unproven ports, sparse arrays and non-JSON values.
- Missing, malformed, semver-invalid, inherited, unproven-adapter and schema-adapter-failure inputs return `CONTRACT_INVALID`.
- Invalid results expose no approval, checkpoint or effect signal and never expose a partial validated pair.
- The former evidence issuer and adapter-registration exports are absent; the adapter handoff is not a caller-facing validation authority. The application boundary imports only domain contracts, and the productive graph guard rejects forbidden imports outside the approved `typebox` adapter dependency.
- Focused runtime command: `node --experimental-strip-types --test tests/exec-001-ticket-001.test.ts`.
- Focused runtime result: PASS (20/20).
- Focused strict static result: PASS, including the internal evidence support module.
