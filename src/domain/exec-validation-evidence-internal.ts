import type { SchemaValidationEvidence } from './exec-contract.ts'

/**
 * Validation evidence is recognized only through the private ECMAScript brand
 * owned by the infrastructure adapter's evidence class. This module exposes
 * no issuer or registration handoff: callers can copy fields or provide a
 * hostile verifier, but neither can create the adapter's private brand.
 */
export function isIssuedSchemaValidationEvidence(value: unknown): value is SchemaValidationEvidence {
  if (!value || typeof value !== 'object' || Array.isArray(value) || !Object.isFrozen(value)) return false

  try {
    const candidate = value as SchemaValidationEvidence & {
      readonly evidenceType?: unknown
    }
    const evidenceType = candidate.evidenceType
    if (typeof evidenceType !== 'function' || evidenceType.name !== 'CanonicalSchemaValidationEvidence') return false
    if (Object.getPrototypeOf(value) !== evidenceType.prototype) return false

    const verifier = Object.getOwnPropertyDescriptor(evidenceType.prototype, 'isCanonicalEvidence')?.value
    if (typeof verifier !== 'function') return false
    return verifier.call(value) === true
  } catch {
    return false
  }
}
