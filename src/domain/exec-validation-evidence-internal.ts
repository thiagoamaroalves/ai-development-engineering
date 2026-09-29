import type {
  ExecSchemaDefinition,
  ExecSchemaValidationPort,
  SchemaValidationResult,
} from './exec-schema.ts'

type SuccessfulSchemaValidationResult = Extract<SchemaValidationResult, { readonly valid: true }>

const AUTHENTICATED_PORTS = new WeakSet<object>()
const ISSUED_RESULTS = new WeakMap<object, WeakSet<object>>()
const SUCCESS_RESULT_KEYS = Object.freeze([
  'valid',
  'issues',
  'validatedInput',
  'schemaReference',
  'contentFingerprint',
] as const)

function hasExactSuccessfulResultShape(value: object): value is SuccessfulSchemaValidationResult {
  try {
    const ownKeys = Reflect.ownKeys(value)
    if (ownKeys.length !== SUCCESS_RESULT_KEYS.length
      || !ownKeys.every((key): key is (typeof SUCCESS_RESULT_KEYS)[number] => (
        typeof key === 'string'
        && SUCCESS_RESULT_KEYS.includes(key as (typeof SUCCESS_RESULT_KEYS)[number])
      ))) {
      return false
    }

    return SUCCESS_RESULT_KEYS.every((key) => {
      const descriptor = Object.getOwnPropertyDescriptor(value, key)
      return Boolean(descriptor?.enumerable && 'value' in descriptor)
    })
  } catch {
    return false
  }
}

/**
 * A validation port is an explicit producer boundary. The producer membership
 * and issued-result ledger are module-private, so a structural port, copied
 * adapter, result-shaped object, or self-described verifier cannot establish
 * schema-validation authority. Independent adapters implement this same
 * authenticated contract rather than reproducing infrastructure-private
 * receipt mechanics.
 */
export abstract class AuthenticatedExecSchemaValidationPort implements ExecSchemaValidationPort {
  protected constructor() {
    AUTHENTICATED_PORTS.add(this)
    ISSUED_RESULTS.set(this, new WeakSet<object>())
  }

  protected issueValidatedResult<T extends SuccessfulSchemaValidationResult>(result: T): T {
    const issuedResults = ISSUED_RESULTS.get(this)
    if (!issuedResults) {
      throw new Error('Validation evidence can be issued only by an authenticated producer.')
    }
    if (!result
      || typeof result !== 'object'
      || Array.isArray(result)
      || result.valid !== true
      || !hasExactSuccessfulResultShape(result)
      || !Array.isArray(result.issues)
      || !result.issues.every((entry) => typeof entry === 'string')
      || !result.validatedInput
      || typeof result.validatedInput !== 'object'
      || Array.isArray(result.validatedInput)
      || !result.schemaReference
      || typeof result.schemaReference !== 'object'
      || Array.isArray(result.schemaReference)
      || typeof result.contentFingerprint !== 'string') {
      throw new Error('Authenticated validation results must be complete successful evidence.')
    }

    Object.freeze(result.issues)
    Object.freeze(result)
    issuedResults.add(result)
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
): result is SuccessfulSchemaValidationResult {
  return Boolean(
    isAuthenticatedExecSchemaValidationPort(producer)
      && result
      && typeof result === 'object'
      && !Array.isArray(result)
      && Object.isFrozen(result)
      && ISSUED_RESULTS.get(producer)?.has(result),
  )
}
