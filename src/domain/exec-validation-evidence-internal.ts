import type {
  ExecSchemaDefinition,
  ExecSchemaValidationPort,
  SchemaValidationResult,
} from './exec-schema.ts'

const AUTHENTICATED_PORTS = new WeakSet<object>()
const ISSUED_RESULTS = new WeakMap<object, WeakSet<object>>()
const SUCCESS_RESULT_KEYS = Object.freeze([
  'valid',
  'issues',
  'validatedInput',
  'schemaReference',
  'contentFingerprint',
] as const)

type SuccessfulSchemaValidationResult = Extract<SchemaValidationResult, { readonly valid: true }>

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
 * A validation port is an explicit producer boundary. The owner-bound
 * membership record is kept outside the result object, so a caller cannot
 * reproduce it by copying fields, selecting a verifier class, or returning a
 * result-shaped object from an untrusted port. Alternate adapters implement
 * this explicit contract and issue only results that they own through the
 * protected issuance method.
 */
export abstract class AuthenticatedExecSchemaValidationPort implements ExecSchemaValidationPort {
  protected constructor() {
    AUTHENTICATED_PORTS.add(this)
    ISSUED_RESULTS.set(this, new WeakSet<object>())
  }

  protected issueValidatedResult<T extends SuccessfulSchemaValidationResult>(result: T): T {
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
