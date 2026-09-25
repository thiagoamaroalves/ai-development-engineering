# AC-EXEC-001 — Envelope and payload schema evidence

- Production boundary: `src/application/exec-contract.ts` (`ValidateExecContract`), composed by `src/composition/exec-contract.ts`.
- Domain contract: `src/domain/exec-contract.ts`; schema definitions and the narrow validation port: `src/domain/exec-schema.ts`.
- Identifiable JSON Schema 2020-12 documents: `exec-envelope@1.0.0` and `exec-capability-001-payload@1.0.0`, deeply frozen and compiled by `src/infrastructure/exec-schema-validator.ts`.
- Successful port results explicitly carry the exact validated input, canonical schema reference and current-content fingerprint. The authenticated producer-port contract permits an independently implemented adapter/harness without exposing a concrete infrastructure receipt protocol.
- Direct witnesses cover valid structured pairs, capability-specific selection, generic-but-capability-invalid rejection, schema identity, custom-schema substitution rejection, plain forged-port rejection, exact-name forged-result rejection, non-delegating adapter substitution, immutable values, own-enumerable required fields, inherited-field rejection, and generic-consumer text-only regression in `tests/exec-001-ticket-001.test.ts`.
- Result: only an authenticated producer port can supply a successful result tied to the exact input/reference; human text is non-authoritative and the former generic payload path is fail-closed.
- Focused runtime command: `node --experimental-strip-types --test tests/exec-001-ticket-001.test.ts`.
- Focused runtime result: PASS (22/22).
- Focused strict static command: `npx tsc --noEmit --strict --target ES2023 --module NodeNext --moduleResolution NodeNext --allowImportingTsExtensions --skipLibCheck --types node src/domain/exec-contract.ts src/domain/exec-schema.ts src/domain/exec-validation-evidence-internal.ts src/application/exec-contract.ts src/infrastructure/exec-schema-validator.ts src/composition/exec-contract.ts tests/exec-001-ticket-001.test.ts`.
- Focused strict static result: PASS.
