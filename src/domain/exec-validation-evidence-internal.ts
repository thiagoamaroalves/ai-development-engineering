import type {
  ExecSchemaDefinition,
  ExecSchemaValidationPort,
  SchemaValidationResult,
} from './exec-schema.ts'

/**
 * A validation port is an explicit producer boundary. The private brand is
 * applied when an adapter is constructed, so a result-shaped object or copied
 * adapter prototype cannot establish schema-validation authority. Independent
 * adapters and deterministic contract harnesses implement the same explicit
 * base contract rather than reproducing an infrastructure receipt protocol.
 */
const AUTHENTICATED_PORTS = new WeakSet<object>()
const ISSUED_RESULTS = new WeakMap<object, WeakSet<object>>()
const AUTHENTICATED_PORT_TOKEN = {}

export abstract class AuthenticatedExecSchemaValidationPort implements ExecSchemaValidationPort {
  #producerBrand: object

  protected constructor() {
    this.#producerBrand = AUTHENTICATED_PORT_TOKEN
    AUTHENTICATED_PORTS.add(this)
    ISSUED_RESULTS.set(this, new WeakSet<object>())
  }

  protected issueValidatedResult<T extends Extract<SchemaValidationResult, { readonly valid: true }>>(
    result: T,
  ): T {
    if (!result || typeof result !== 'object' || Array.isArray(result)) {
      throw new Error('Authenticated validation results must be objects.')
    }
    if (Array.isArray(result.issues)) Object.freeze(result.issues)
    Object.freeze(result)
    ISSUED_RESULTS.get(this)?.add(result)
    return result
  }

  abstract validate(schema: ExecSchemaDefinition, value: unknown): SchemaValidationResult
}

export function isAuthenticatedExecSchemaValidationPort(
  value: unknown,
): value is ExecSchemaValidationPort {
  return Boolean(
    value
      && typeof value === 'object'
      && !Array.isArray(value)
      && AUTHENTICATED_PORTS.has(value),
  )
}

export function isProducerIssuedValidationResult(
  producer: unknown,
  result: unknown,
): result is Extract<SchemaValidationResult, { readonly valid: true }> {
  return Boolean(
    isAuthenticatedExecSchemaValidationPort(producer)
      && result
      && typeof result === 'object'
      && !Array.isArray(result)
      && ISSUED_RESULTS.get(producer)?.has(result),
  )
}
