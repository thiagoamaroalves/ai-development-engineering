import type {
  SchemaValidationResult,
} from './exec-schema.ts'

let canonicalResultType: Function | undefined

/**
 * Successful validation evidence is recognized through the private result
 * verifier owned by the canonical schema adapter. The verifier checks the
 * result's unforgeable private brand and the exact producer identity; a
 * caller-controlled port may return a result-shaped object or transport a
 * copied result, but neither can manufacture consumable schema proof.
 */
export function isProducerIssuedValidationResult(
  producer: unknown,
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
    if (canonicalResultType && canonicalResultType !== resultType) return false
    if (Object.getPrototypeOf(result) !== resultType.prototype) return false
    canonicalResultType ??= resultType

    const verifier = Object.getOwnPropertyDescriptor(
      resultType.prototype,
      'isCanonicalValidationResult',
    )?.value
    if (typeof verifier !== 'function') return false
    return verifier.call(result, producer) === true
  } catch {
    return false
  }
}
