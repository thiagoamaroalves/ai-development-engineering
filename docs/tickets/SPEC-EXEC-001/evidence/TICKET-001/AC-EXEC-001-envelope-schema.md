# AC-EXEC-001 — Envelope and payload schema evidence

- Production boundary: `src/application/exec-contract.ts` (`ValidateExecContract`), composed by `src/composition/exec-contract.ts`.
- Domain contract: `src/domain/exec-contract.ts`; schema definitions and the narrow validation port: `src/domain/exec-schema.ts`.
- Identifiable JSON Schema 2020-12 documents: `exec-envelope@1.0.0` and `exec-capability-payload@1.0.0`, deeply frozen and compiled by the TypeBox adapter in `src/infrastructure/exec-schema-validator.ts`.
- Direct witnesses: valid structured pair, schema identity, custom-schema substitution rejection, evidence issuance before canonical adapter execution, post-validation mutation rejection, explicit successful-adapter evidence enforcement, alternate-port substitution, own-enumerable required-field enforcement, caller-authority API absence, edge-value preservation/rejection, and generic-consumer text-only regression in `tests/exec-001-ticket-001.test.ts`.
- Result: only canonical schema references and evidence tied to a successful canonical adapter execution of the exact input reach the contract boundary; direct factories without evidence, caller-selected schema identities, inherited required fields and schema-invalid raw input fail closed. Human text is non-authoritative.
- Focused runtime command: `node --experimental-strip-types --test tests/exec-001-ticket-001.test.ts`.
- Focused runtime result: PASS (20/20), including pre-execution and post-validation-mutation evidence-issuance rejection, forged-evidence rejection at both value factories and the injected port seam, and inherited-field rejection for envelope and payload.
- Focused strict static command: `npx tsc --noEmit --strict --allowImportingTsExtensions --target ES2022 --module NodeNext --moduleResolution NodeNext --skipLibCheck src/domain/exec-contract.ts src/domain/exec-schema.ts src/domain/exec-validation-evidence-internal.ts src/application/exec-contract.ts src/infrastructure/exec-schema-validator.ts src/composition/exec-contract.ts tests/exec-001-ticket-001.test.ts`.
- Focused strict static result: PASS.
