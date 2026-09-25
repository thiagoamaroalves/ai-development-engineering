import type {
  SchemaValidationResult,
} from './exec-schema.ts'

/**
 * Successful validation evidence is recognized through a private producer
 * brand owned by the canonical schema adapter. A caller-controlled port may
 * return a result-shaped object, but it cannot manufacture the adapter's
 * private result brand or turn that object into consumable schema proof.
 */
export function isProducerIssuedValidationResult(
  _producer: unknown,
  result: unknown,
): result is Extract<SchemaValidationResult, { readonly valid: true }> {
  if (!result || typeof result !== 'object' || Array.isArray(result) || !Object.isFrozen(result)) {
    return false
  }

  try {
    const candidate = result as {
      readonly canonicalResultType?: unknown
    }
    const resultType = candidate.canonicalResultType
    if (typeof resultType !== 'function' || !resultType.prototype) return false
    if (Object.getPrototypeOf(result) !== resultType.prototype) return false

    const verifier = Object.getOwnPropertyDescriptor(
      resultType.prototype,
      'isCanonicalValidationResult',
    )?.value
    if (typeof verifier !== 'function') return false
    return verifier.call(result) === true
  } catch {
    return false
  }
}
