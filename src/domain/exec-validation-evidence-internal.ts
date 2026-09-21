import type { SchemaValidationEvidence } from './exec-contract.ts'

/**
 * Validation evidence is recognized only when it is an instance of the
 * adapter-owned evidence prototype.  The prototype method verifies a private
 * ECMAScript brand, so a structurally similar object returned by an injected
 * port cannot enter the domain construction path.
 *
 * Evidence issuance is deliberately not part of this module's export surface.
 * The infrastructure adapter constructs it in its own private closure after
 * it has checked the exact input/reference pair with the schema engine.
 */
export function isIssuedSchemaValidationEvidence(value: unknown): value is SchemaValidationEvidence {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false

  const prototype = Object.getPrototypeOf(value)
  if (!prototype || !Object.prototype.hasOwnProperty.call(prototype, 'isCanonicalEvidence')) {
    return false
  }

  const verifier = (prototype as { readonly isCanonicalEvidence?: unknown }).isCanonicalEvidence
  if (typeof verifier !== 'function') return false

  try {
    return verifier.call(value) === true
  } catch {
    return false
  }
}
