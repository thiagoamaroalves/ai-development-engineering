# AC-EXEC-001 — Envelope and payload schema evidence

- Evidence refresh target: `AUDIT_TARGET_HEAD=b68eb87d8afc21b5683e89f4ecd3aee8d8238306`; `AUDIT_BASIS_FINGERPRINT=70f7ea178eabee7cef5e588756b093c1de366d85ce9171e05e2235e091996675`; remediation candidate remains uncheckpointed at controller HEAD `7a3b3b0653c563be62357eff88aa8fbdaf3eaf4a`.
- Production boundary: `src/application/exec-contract.ts` (`ValidateExecContract`), composed by `src/composition/exec-contract.ts`.
- Domain contract: `src/domain/exec-contract.ts`; immutable schema definitions and the narrow validation port: `src/domain/exec-schema.ts`.
- Identifiable JSON Schema 2020-12 documents: `exec-envelope@1.0.0` and `exec-capability-001-payload@1.0.0`, deeply frozen and compiled by `src/infrastructure/exec-schema-validator.ts`.
- Canonical schema-definition membership is owner-bound by a private `WeakSet`; getter-backed, copied and custom definitions cannot replace the document observed by the compiler.
- Successful evidence is issued only by the canonical `JsonSchemaExecValidator` through a private branded result type. Caller-shaped results, caller-created verifier classes, copied adapters and untrusted wrappers are rejected; the owner-authorized receipt-replay seam accepts only genuine canonical receipts and exists to exercise stale-consumer behavior.
- Direct witnesses cover valid structured pairs, capability-specific selection, generic-but-capability-invalid rejection, schema identity, custom/getter-backed schema substitution rejection, forged-result rejection, copied-adapter rejection, owner-authorized receipt replay, untrusted-wrapper rejection, caller-created always-true subtype rejection, immutable values, own-enumerable required fields, inherited-field rejection, stale evidence and generic-consumer text-only regression in `tests/exec-001-ticket-001.test.ts`.
- Result: successful evidence remains bound to the exact input/reference and current-content fingerprint; only a canonical branded result authorized for the consuming producer can produce consumable proof. Human text is non-authoritative and the former generic payload path is fail-closed.
- Focused runtime command: `node_modules/.bin/tsx --test tests/exec-001-ticket-001.test.ts`.
- Focused runtime result: PASS (25/25).
- Focused strict static command: `node_modules/.bin/tsc --noEmit --strict --target ES2023 --module NodeNext --moduleResolution NodeNext --allowImportingTsExtensions --skipLibCheck --types node src/domain/exec-contract.ts src/domain/exec-schema.ts src/domain/exec-validation-evidence-internal.ts src/application/exec-contract.ts src/infrastructure/exec-schema-validator.ts src/composition/exec-contract.ts tests/exec-001-ticket-001.test.ts`.
- Focused strict static result: PASS.
- Environment probe: `node --experimental-strip-types --test tests/exec-001-ticket-001.test.ts` failed with `ERR_NO_TYPESCRIPT`; the required TypeScript runner above was used instead.
