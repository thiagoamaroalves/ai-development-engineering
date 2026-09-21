# AC-EXEC-001 — Envelope and payload schema evidence

- Production boundary: `src/application/exec-contract.ts` (`ValidateExecContract`), composed by `src/composition/exec-contract.ts`.
- Domain contract: `src/domain/exec-contract.ts`; schema definitions and the narrow validation port: `src/domain/exec-schema.ts`.
- Identifiable JSON Schema 2020-12 documents: `exec-envelope@1.0.0` and `exec-capability-payload@1.0.0`, deeply frozen and compiled by `src/infrastructure/exec-schema-validator.ts`.
- Direct witnesses cover valid structured pairs, schema identity, custom-schema substitution rejection, unproven-port rejection, immutable values, own-enumerable required fields, inherited `Object.prototype` required-field rejection, caller-authority API absence, edge-value preservation/rejection, and generic-consumer text-only regression in `tests/exec-001-ticket-001.test.ts`.
- The former exported evidence issuer is absent from the internal module export surface. The infrastructure adapter creates branded evidence only after the compiled schema engine accepts the exact input/reference pair and rechecks its receipt; post-validation mutation and forged/injected evidence fail closed.
- Result: only canonical schema references and evidence tied to a successful canonical adapter execution reach structured consumption; human text is non-authoritative.
- Focused runtime command: `node --experimental-strip-types --test tests/exec-001-ticket-001.test.ts`.
- Focused runtime result: PASS (20/20).
- Focused strict static command: `npx tsc --noEmit --strict --allowImportingTsExtensions --target ES2022 --module NodeNext --moduleResolution NodeNext --skipLibCheck src/domain/exec-contract.ts src/domain/exec-schema.ts src/domain/exec-validation-evidence-internal.ts src/application/exec-contract.ts src/infrastructure/exec-schema-validator.ts src/composition/exec-contract.ts tests/exec-001-ticket-001.test.ts`.
- Focused strict static result: PASS.
