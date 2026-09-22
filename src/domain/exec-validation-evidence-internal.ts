import type { SchemaValidationEvidence } from './exec-contract.ts'

/**
 * Validation evidence is recognized through the adapter-owned evidence
 * prototype and its private ECMAScript brand. The domain does not expose an
 * issuer or mutable ledger: callers can copy fields or provide a hostile
 * verifier, but neither produces the adapter's private brand.
 */
export function isIssuedSchemaValidationEvidence(value: unknown): value is SchemaValidationEvidence {
  if (!value || typeof value !== 'object' || Array.isArray(value) || !Object.isFrozen(value)) return false

  try {
    const candidate = value as SchemaValidationEvidence & { readonly evidenceType?: unknown }
    const evidenceType = candidate.evidenceType
    if (typeof evidenceType !== 'function' || !evidenceType.prototype) return false
    if (Object.getPrototypeOf(value) !== evidenceType.prototype) return false

    const verifier = Object.getOwnPropertyDescriptor(evidenceType.prototype, 'isCanonicalEvidence')?.value
    if (typeof verifier !== 'function') return false
    return verifier.call(value) === true
  } catch {
    return false
  }
}
