import { Compile, type Validator } from 'typebox/compile'
import type { TSchema } from 'typebox'
import {
  ExecContractSchemaDefinitions,
  isCanonicalExecSchemaDefinition,
  type ExecSchemaDefinition,
  type ExecSchemaValidationPort,
  type SchemaValidationResult,
} from '../domain/exec-schema.ts'
import {
  EXEC_ENVELOPE_SCHEMA_REFERENCE,
  structuredContentFingerprint,
  type SchemaReference,
} from '../domain/exec-contract.ts'
import { isProducerIssuedValidationResult } from '../domain/exec-validation-evidence-internal.ts'

function issue(message: string): SchemaValidationResult {
  return Object.freeze({ valid: false, issues: Object.freeze([message]) })
}

function hasOwnEnumerableRequiredFields(schema: ExecSchemaDefinition, value: unknown): boolean {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  const required = schema.document.required
  if (!Array.isArray(required) || !required.every((key) => typeof key === 'string')) return false
  return required.every((key) => Object.prototype.propertyIsEnumerable.call(value, key))
}

const CANONICAL_RESULT_TOKEN = {}
const CANONICAL_VALIDATORS = new WeakSet<object>()

type CanonicalValidationSuccess = Extract<SchemaValidationResult, { readonly valid: true }>

/**
 * The canonical adapter owns the only successful-result issuer. Its private
 * brand cannot be copied from a genuine result, and the authorized producer
 * set prevents a caller-created wrapper or subclass from being treated as the
 * issuer merely because it transports a result-shaped object.
 */
class CanonicalSchemaValidationResult implements CanonicalValidationSuccess {
  readonly valid = true as const
  readonly issues = Object.freeze([] as readonly string[])
  readonly validatedInput: object
  readonly schemaReference: SchemaReference
  readonly contentFingerprint: string
  #brand: object
  #authorizedProducers = new WeakSet<object>()

  constructor(
    validatedInput: object,
    schemaReference: SchemaReference,
    contentFingerprint: string,
    producer: object,
    token: object,
  ) {
    if (token !== CANONICAL_RESULT_TOKEN) {
      throw new Error('Canonical schema validation result construction is restricted to the schema adapter.')
    }
    this.validatedInput = validatedInput
    this.schemaReference = schemaReference
    this.contentFingerprint = contentFingerprint
    this.#brand = CANONICAL_RESULT_TOKEN
    this.#authorizedProducers.add(producer)
    Object.defineProperty(this, 'canonicalResultType', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: CanonicalSchemaValidationResult,
    })
    Object.freeze(this)
  }

  isCanonicalValidationResult(producer: unknown): boolean {
    return this.#brand === CANONICAL_RESULT_TOKEN
      && typeof producer === 'object'
      && producer !== null
      && this.#authorizedProducers.has(producer)
  }

  authorizeProducer(producer: unknown, token: object): void {
    if (token !== CANONICAL_RESULT_TOKEN
      || !producer
      || typeof producer !== 'object'
      || Array.isArray(producer)) {
      throw new Error('Only the canonical adapter can authorize a receipt transport.')
    }
    this.#authorizedProducers.add(producer)
  }
}

Object.freeze(CanonicalSchemaValidationResult.prototype)

function issueCanonicalResult(
  validatedInput: object,
  schemaReference: SchemaReference,
  producer: object,
): CanonicalValidationSuccess {
  return new CanonicalSchemaValidationResult(
    validatedInput,
    schemaReference,
    structuredContentFingerprint(validatedInput),
    producer,
    CANONICAL_RESULT_TOKEN,
  )
}

interface ValidationReceipt {
  readonly schema: ExecSchemaDefinition
  readonly validator: Validator
  readonly inputs: WeakSet<object>
}

interface CanonicalResultInternals {
  readonly canonicalResultType?: {
    readonly prototype: object
  }
}

function authorizeReceiptTransport(
  result: CanonicalValidationSuccess,
  producer: object,
): void {
  const resultType = (result as unknown as CanonicalResultInternals).canonicalResultType
  const authorizer = resultType
    && Object.getOwnPropertyDescriptor(resultType.prototype, 'authorizeProducer')?.value
  if (typeof authorizer !== 'function') {
    throw new Error('Only canonical validation results can authorize a receipt transport.')
  }
  authorizer.call(result, producer, CANONICAL_RESULT_TOKEN)
}

/**
 * Adapter around a JSON Schema 2020-12 compiler. Schema vocabulary and
 * contract ownership stay with ExecSchemaDefinition; this adapter only
 * translates engine results into authenticated, owner-bound port evidence.
 */
export class JsonSchemaExecValidator implements ExecSchemaValidationPort {
  readonly #compiled = new WeakMap<ExecSchemaDefinition, Validator>()
  readonly #validatedInputs = new WeakMap<SchemaReference, ValidationReceipt>()

  constructor() {
    if (new.target === JsonSchemaExecValidator) {
      CANONICAL_VALIDATORS.add(this)
      Object.freeze(this)
    }
  }

  private hasValidated(schemaReference: SchemaReference, validatedInput: object): boolean {
    const receipt = this.#validatedInputs.get(schemaReference)
    if (!receipt?.inputs.has(validatedInput) || !hasOwnEnumerableRequiredFields(receipt.schema, validatedInput)) {
      return false
    }
    try {
      return receipt.validator.Check(validatedInput)
    } catch {
      return false
    }
  }

  /**
   * Creates an owner-authorized transport for already-issued receipts. This is
   * intentionally not a general evidence issuer: callers must provide genuine
   * receipts from this adapter, so replay can exercise stale-input rejection
   * without introducing a caller-mintable validation path.
   */
  createReceiptReplayPort(receipts: {
    readonly envelope: SchemaValidationResult
    readonly payload: SchemaValidationResult
  }): ExecSchemaValidationPort {
    if (!CANONICAL_VALIDATORS.has(this)) {
      throw new Error('Only the canonical schema adapter can replay validation receipts.')
    }
    if (!isProducerIssuedValidationResult(this, receipts.envelope)
      || !isProducerIssuedValidationResult(this, receipts.payload)) {
      throw new Error('Receipt replay requires genuine canonical validation results.')
    }
    const envelopeReceipt = receipts.envelope
    const payloadReceipt = receipts.payload
    const replayPort: ExecSchemaValidationPort = Object.freeze({
      validate: (schema: ExecSchemaDefinition): SchemaValidationResult => {
        if (schema.reference === envelopeReceipt.schemaReference) return envelopeReceipt
        if (schema.reference === payloadReceipt.schemaReference) return payloadReceipt
        return issue('No authenticated receipt exists for the selected schema.')
      },
    })
    authorizeReceiptTransport(envelopeReceipt, replayPort)
    authorizeReceiptTransport(payloadReceipt, replayPort)
    return replayPort
  }

  validate(schema: ExecSchemaDefinition, value: unknown): SchemaValidationResult {
    if (!CANONICAL_VALIDATORS.has(this)) {
      return issue('Only the canonical schema adapter can establish validation authority.')
    }
    if (!isCanonicalExecSchemaDefinition(schema)) {
      return issue('Only ticket-owned schema definitions can establish validation authority.')
    }
    try {
      let validator = this.#compiled.get(schema)
      if (!validator) {
        validator = Compile(schema.document as TSchema)
        this.#compiled.set(schema, validator)
      }
      if (validator.Check(value)) {
        if (!value || typeof value !== 'object') {
          return issue('Validated schema input must be a structured object.')
        }
        if (!hasOwnEnumerableRequiredFields(schema, value)) {
          return issue('Required schema properties must be own enumerable JSON properties.')
        }
        const validatedInput = value as object
        const receipt = this.#validatedInputs.get(schema.reference) ?? {
          schema,
          validator,
          inputs: new WeakSet<object>(),
        }
        receipt.inputs.add(validatedInput)
        this.#validatedInputs.set(schema.reference, receipt)
        if (!this.hasValidated(schema.reference, validatedInput)) {
          return issue('Canonical schema validation evidence could not be established.')
        }
        return issueCanonicalResult(validatedInput, schema.reference, this)
      }
      const issues = validator.Errors(value).map((error) => {
        const path = error.instancePath || '$'
        return `${path}: ${error.message}`
      })
      return Object.freeze({ valid: false, issues: Object.freeze(issues) })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'JSON Schema validation failed.'
      return issue(message)
    }
  }
}

Object.freeze(JsonSchemaExecValidator.prototype)

// Prime the internal result-type identity with a genuine canonical validation
// before any caller-supplied port can ask the consumer to recognize a
// result-shaped object.
const canonicalResultBootstrapProducer = new JsonSchemaExecValidator()
const canonicalResultBootstrapInput = {
  schemaId: EXEC_ENVELOPE_SCHEMA_REFERENCE.schemaId,
  schemaVersion: EXEC_ENVELOPE_SCHEMA_REFERENCE.version,
  contractVersion: '1.0.0',
  executionId: 'bootstrap-execution',
  activityId: 'bootstrap-activity',
  agentAssignmentId: 'bootstrap-assignment',
  artifactCycleId: 'bootstrap-cycle',
  attemptId: 'bootstrap-attempt',
  executionRound: 'bootstrap-round',
  executionStatus: 'bootstrap-status',
  functionalVerdict: 'bootstrap-verdict',
  checkpoints: [],
  artifacts: [],
  evidence: [],
  findings: [],
  requestedEffects: [],
  errors: [],
}
const canonicalResultBootstrap = canonicalResultBootstrapProducer.validate(
  new ExecContractSchemaDefinitions().envelope,
  canonicalResultBootstrapInput,
)
if (!canonicalResultBootstrap.valid
  || !isProducerIssuedValidationResult(canonicalResultBootstrapProducer, canonicalResultBootstrap)) {
  throw new Error('Canonical validation result identity could not be initialized.')
}
