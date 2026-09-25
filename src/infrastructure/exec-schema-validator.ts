import { Compile, type Validator } from 'typebox/compile'
import type { TSchema } from 'typebox'
import {
  isCanonicalExecSchemaDefinition,
  type ExecSchemaDefinition,
  type ExecSchemaValidationPort,
  type SchemaValidationResult,
} from '../domain/exec-schema.ts'
import {
  structuredContentFingerprint,
  type SchemaReference,
} from '../domain/exec-contract.ts'

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

type CanonicalValidationSuccess = Extract<SchemaValidationResult, { readonly valid: true }>

/**
 * Only the canonical adapter can construct a consumable successful result.
 * The private brand is checked by the domain-side recognizer; a copied result,
 * a caller-created subtype, or a result-shaped object cannot mint proof.
 */
class CanonicalSchemaValidationResult implements CanonicalValidationSuccess {
  readonly valid = true as const
  readonly issues = Object.freeze([] as readonly string[])
  readonly validatedInput: object
  readonly schemaReference: SchemaReference
  readonly contentFingerprint: string
  #brand: object

  constructor(
    validatedInput: object,
    schemaReference: SchemaReference,
    contentFingerprint: string,
    token: object,
  ) {
    if (token !== CANONICAL_RESULT_TOKEN) {
      throw new Error('Canonical schema validation result construction is restricted to the schema adapter.')
    }
    this.validatedInput = validatedInput
    this.schemaReference = schemaReference
    this.contentFingerprint = contentFingerprint
    this.#brand = CANONICAL_RESULT_TOKEN
    Object.defineProperty(this, 'canonicalResultType', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: CanonicalSchemaValidationResult,
    })
    Object.freeze(this)
  }

  isCanonicalValidationResult(): boolean {
    return this.#brand === CANONICAL_RESULT_TOKEN
  }
}

Object.freeze(CanonicalSchemaValidationResult.prototype)

function issueCanonicalResult(
  validatedInput: object,
  schemaReference: SchemaReference,
): CanonicalValidationSuccess {
  return new CanonicalSchemaValidationResult(
    validatedInput,
    schemaReference,
    structuredContentFingerprint(validatedInput),
    CANONICAL_RESULT_TOKEN,
  )
}

/**
 * Adapter around a JSON Schema 2020-12 compiler. Schema vocabulary and
 * contract ownership stay with ExecSchemaDefinition; this adapter only
 * translates engine results into canonical, owner-issued evidence.
 */
interface ValidationReceipt {
  readonly schema: ExecSchemaDefinition
  readonly validator: Validator
  readonly inputs: WeakSet<object>
}

export class JsonSchemaExecValidator implements ExecSchemaValidationPort {
  readonly #compiled = new WeakMap<ExecSchemaDefinition, Validator>()
  readonly #validatedInputs = new WeakMap<SchemaReference, ValidationReceipt>()

  constructor() {
    // The canonical adapter is immutable at its public surface. A caller may
    // wrap or subclass it, but cannot replace the implementation on an
    // already-constructed owner instance.
    Object.freeze(this)
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

  validate(schema: ExecSchemaDefinition, value: unknown): SchemaValidationResult {
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
        return issueCanonicalResult(validatedInput, schema.reference)
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
