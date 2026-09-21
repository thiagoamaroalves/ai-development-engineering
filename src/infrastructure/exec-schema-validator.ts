import { Compile, type Validator } from 'typebox/compile'
import type { TSchema } from 'typebox'
import {
  isCanonicalExecSchemaDefinition,
  type ExecSchemaDefinition,
  type ExecSchemaValidationPort,
  type SchemaValidationResult,
} from '../domain/exec-schema.ts'
import type {
  SchemaReference,
  SchemaValidationEvidence,
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

/**
 * Evidence is created only by this adapter after the compiled schema engine
 * has accepted the exact input/reference pair. The private brand prevents a
 * caller from manufacturing an object that merely has the public evidence
 * shape; the domain-side guard can verify the instance without importing
 * infrastructure or schema-library concerns.
 */
const EVIDENCE_CONSTRUCTION_TOKEN = {}

class CanonicalSchemaValidationEvidence implements SchemaValidationEvidence {
  readonly valid = true as const
  readonly issues = Object.freeze([] as readonly string[])
  readonly validatedInput: object
  readonly schemaReference: SchemaReference
  #brand: object

  constructor(
    validatedInput: object,
    schemaReference: SchemaReference,
    token: object,
  ) {
    if (token !== EVIDENCE_CONSTRUCTION_TOKEN) {
      throw new Error('Canonical validation evidence construction is restricted to the schema adapter.')
    }
    this.validatedInput = validatedInput
    this.schemaReference = schemaReference
    this.#brand = EVIDENCE_CONSTRUCTION_TOKEN
    Object.freeze(this)
  }

  isCanonicalEvidence(): boolean {
    return this.#brand === EVIDENCE_CONSTRUCTION_TOKEN
  }
}

function issueCanonicalEvidence(
  validatedInput: object,
  schemaReference: SchemaReference,
): SchemaValidationEvidence {
  return new CanonicalSchemaValidationEvidence(
    validatedInput,
    schemaReference,
    EVIDENCE_CONSTRUCTION_TOKEN,
  )
}

/**
 * Adapter around a JSON Schema 2020-12 compiler. Schema vocabulary and
 * contract ownership stay with ExecSchemaDefinition; this adapter only
 * translates engine results into the domain port result.
 */
interface ValidationReceipt {
  readonly schema: ExecSchemaDefinition
  readonly validator: Validator
  readonly inputs: WeakSet<object>
}

export class JsonSchemaExecValidator implements ExecSchemaValidationPort {
  private readonly compiled = new WeakMap<ExecSchemaDefinition, Validator>()
  private readonly validatedInputs = new WeakMap<SchemaReference, ValidationReceipt>()

  private hasValidated(schemaReference: SchemaReference, validatedInput: object): boolean {
    const receipt = this.validatedInputs.get(schemaReference)
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
      let validator = this.compiled.get(schema)
      if (!validator) {
        validator = Compile(schema.document as TSchema)
        this.compiled.set(schema, validator)
      }
      if (validator.Check(value)) {
        if (!value || typeof value !== 'object') {
          return issue('Validated schema input must be a structured object.')
        }
        if (!hasOwnEnumerableRequiredFields(schema, value)) {
          return issue('Required schema properties must be own enumerable JSON properties.')
        }
        const validatedInput = value as object
        const receipt = this.validatedInputs.get(schema.reference) ?? {
          schema,
          validator,
          inputs: new WeakSet<object>(),
        }
        receipt.inputs.add(validatedInput)
        this.validatedInputs.set(schema.reference, receipt)
        if (!this.hasValidated(schema.reference, validatedInput)) {
          return issue('Canonical schema validation evidence could not be established.')
        }
        return Object.freeze({
          valid: true,
          issues: Object.freeze([]),
          evidence: issueCanonicalEvidence(validatedInput, schema.reference),
        })
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
