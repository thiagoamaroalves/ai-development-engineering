# AC-EXEC-001 — Envelope and payload schema evidence

- Production boundary: `src/application/exec-contract.ts` (`ValidateExecContract`), composed by `src/composition/exec-contract.ts`.
- Domain contract: `src/domain/exec-contract.ts`; immutable schema definitions and the authenticated validation port: `src/domain/exec-schema.ts`.
- Identifiable JSON Schema 2020-12 documents: `exec-envelope@1.0.0` and `exec-capability-001-payload@1.0.0`, deeply frozen and compiled by `src/infrastructure/exec-schema-validator.ts`.
- Canonical schema-definition membership is owner-bound by a private `WeakSet`; getter-backed, copied and custom definitions cannot replace the document observed by the compiler.
- Successful evidence is recorded outside the result object in the authenticated producer/result `WeakSet` records. Caller-shaped results, caller-created verifier classes, copied adapters and untrusted wrappers are rejected; an independently implemented authenticated adapter can satisfy the same explicit producer contract.
- Direct witnesses cover valid structured pairs, capability-specific selection, generic-but-capability-invalid rejection, schema identity, custom/getter-backed schema substitution rejection, forged-result rejection, copied-adapter rejection, authenticated alternate-adapter consumption, untrusted-wrapper rejection, caller-created always-true subtype rejection, immutable values, own-enumerable required fields, inherited-field rejection, stale evidence and generic-consumer text-only regression in `tests/exec-001-ticket-001.test.ts`.
- Result: successful evidence remains bound to the exact input/reference and current-content fingerprint; only an authenticated producer evidence record can produce consumable proof. Human text is non-authoritative and the former generic payload path is fail-closed.
- Focused runtime command: `node --experimental-strip-types --test tests/exec-001-ticket-001.test.ts`.
- Focused runtime result: PASS (25/25).
- Focused strict static command: `npx tsc --noEmit --strict --target ES2023 --module NodeNext --moduleResolution NodeNext --allowImportingTsExtensions --skipLibCheck --types node src/domain/exec-contract.ts src/domain/exec-schema.ts src/domain/exec-validation-evidence-internal.ts src/application/exec-contract.ts src/infrastructure/exec-schema-validator.ts src/composition/exec-contract.ts tests/exec-001-ticket-001.test.ts`.
- Focused strict static result: PASS.
