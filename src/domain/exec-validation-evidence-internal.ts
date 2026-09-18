import type { SchemaReference, SchemaValidationEvidence } from './exec-contract.ts'

/**
 * Validation evidence is an opaque runtime capability. It is accepted only
 * when the exact input/reference pair was successfully checked by a
 * registered schema adapter. The adapter receipt prevents a caller from
 * manufacturing a structurally identical proof object.
 */
const ISSUED_VALIDATION_EVIDENCE = new WeakSet<object>()
const REGISTERED_SCHEMA_ADAPTERS = new WeakSet<object>()

export interface SchemaValidationAdapterReceipt {
  hasValidated(schemaReference: SchemaReference, validatedInput: object): boolean
}

/**
 * The infrastructure adapter registers its instance once at construction.
 * This is an internal capability handoff, not a public validation authority.
 */
export function registerSchemaValidationAdapter(adapter: object): void {
  REGISTERED_SCHEMA_ADAPTERS.add(adapter)
}

export function issueSchemaValidationEvidence(
  adapter: SchemaValidationAdapterReceipt,
  validatedInput: object,
  schemaReference: SchemaReference,
): SchemaValidationEvidence {
  if (!REGISTERED_SCHEMA_ADAPTERS.has(adapter)
    || !adapter.hasValidated(schemaReference, validatedInput)) {
    throw new Error('Validation evidence requires a successful canonical schema-adapter execution.')
  }

  const evidence = Object.freeze({
    valid: true as const,
    issues: Object.freeze([] as readonly string[]),
    validatedInput,
    schemaReference,
  })
  ISSUED_VALIDATION_EVIDENCE.add(evidence)
  return evidence
}

export function isIssuedSchemaValidationEvidence(value: unknown): value is SchemaValidationEvidence {
  return typeof value === 'object' && value !== null && ISSUED_VALIDATION_EVIDENCE.has(value)
}
