# AC-EXEC-001 — Envelope and payload schema evidence

- Production boundary: `src/application/exec-contract.ts` (`ValidateExecContract`), composed by `src/composition/exec-contract.ts`.
- Domain contract: `src/domain/exec-contract.ts`; schema definitions and the narrow validation port: `src/domain/exec-schema.ts`.
- Identifiable JSON Schema 2020-12 documents: `exec-envelope@1.0.0` and `exec-capability-001-payload@1.0.0`, deeply frozen and compiled by `src/infrastructure/exec-schema-validator.ts`.
- The canonical adapter is the sole issuer of consumable successful schema evidence. Its private branded result is recognized by `src/domain/exec-validation-evidence-internal.ts`; caller-shaped results and caller-created always-true subtypes are rejected. A wrapper can transport only an owner-issued result and cannot mint one.
- Direct witnesses cover valid structured pairs, capability-specific selection, generic-but-capability-invalid rejection, schema identity, custom-schema substitution rejection, forged-result rejection, copied-adapter rejection, owner-issued delegating-wrapper consumption, caller-created always-true subtype rejection, immutable values, own-enumerable required fields, inherited-field rejection, stale evidence and generic-consumer text-only regression in `tests/exec-001-ticket-001.test.ts`.
- Result: successful evidence remains bound to the exact input/reference and current-content fingerprint; only canonical schema evaluation can produce consumable proof. Human text is non-authoritative and the former generic payload path is fail-closed.
- Focused runtime command: `node --experimental-strip-types --test tests/exec-001-ticket-001.test.ts`.
- Focused runtime result: PASS (23/23).
- Focused strict static command: `npx tsc --noEmit --strict --target ES2023 --module NodeNext --moduleResolution NodeNext --allowImportingTsExtensions --skipLibCheck --types node src/domain/exec-contract.ts src/domain/exec-schema.ts src/domain/exec-validation-evidence-internal.ts src/application/exec-contract.ts src/infrastructure/exec-schema-validator.ts src/composition/exec-contract.ts tests/exec-001-ticket-001.test.ts`.
- Focused strict static result: PASS.
