import {
  invalidContract,
  ObservedContractReference,
  type ExecContractValidationResult,
  StructuredCapabilityPayload,
  StructuredExecutionEnvelope,
  ValidatedExecContract,
} from '../domain/exec-contract.ts'
import {
  ExecContractSchemaDefinitions,
  type ExecSchemaValidationPort,
  type SchemaValidationResult,
} from '../domain/exec-schema.ts'
import { isProducerIssuedValidationResult } from '../domain/exec-validation-evidence-internal.ts'

export interface ValidateExecContractInput {
  readonly envelope: unknown
  readonly payload: unknown
  readonly humanText?: unknown
}

function normalizedValidationResult(
  value: unknown,
  producer: ExecSchemaValidationPort,
): SchemaValidationResult | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined
  if (!Object.prototype.hasOwnProperty.call(value, 'valid')
    || !Object.prototype.hasOwnProperty.call(value, 'issues')) return undefined
  const result = value as {
    readonly valid: unknown
    readonly issues: unknown
    readonly validatedInput?: unknown
    readonly schemaReference?: unknown
    readonly contentFingerprint?: unknown
  }
  if (typeof result.valid !== 'boolean' || !Array.isArray(result.issues)
    || !result.issues.every((entry) => typeof entry === 'string')) return undefined
  const keys = Object.keys(value)
  if (!result.valid) {
    if (keys.length !== 2) return undefined
    return Object.freeze({
      valid: false as const,
      issues: Object.freeze([...result.issues]),
    })
  }

  if (!isProducerIssuedValidationResult(producer, value)
    || keys.length !== 5
    || typeof result.contentFingerprint !== 'string'
    || !result.validatedInput
    || typeof result.validatedInput !== 'object'
    || Array.isArray(result.validatedInput)
    || !result.schemaReference
    || typeof result.schemaReference !== 'object'
    || Array.isArray(result.schemaReference)) {
    return undefined
  }
  return value as SchemaValidationResult
}

function safeThrownIssue(error: unknown): readonly string[] {
  try {
    let message = ''
    if (typeof error === 'string') {
      message = error
    } else if (error && typeof error === 'object' && 'message' in error) {
      const candidate = (error as { readonly message?: unknown }).message
      if (typeof candidate === 'string') message = candidate
    }
    const normalized = message.trim()
    return normalized && normalized.length <= 200 && !/[\r\n]/.test(normalized)
      ? [normalized]
      : []
  } catch {
    return []
  }
}

export class ValidateExecContract {
  private readonly definitions = new ExecContractSchemaDefinitions()
  private readonly validator: ExecSchemaValidationPort

  constructor(validator: ExecSchemaValidationPort) {
    this.validator = validator
  }

  private invalid(input: unknown, reason: string, issues: readonly string[] = []): ExecContractValidationResult {
    return invalidContract(
      reason,
      issues,
      this.definitions.contractReference,
      ObservedContractReference.fromInput(input),
    )
  }

  validate(input: ValidateExecContractInput): ExecContractValidationResult {
    if (!input || typeof input !== 'object') {
      return this.invalid(input, 'A structured envelope and payload are required.')
    }

    try {
      const payloadDefinition = this.definitions.selectPayload(input.payload)
      if (!payloadDefinition) {
        return this.invalid(input, 'Capability payload schema selection failed closed.')
      }

      const envelopeResult = normalizedValidationResult(
        this.validator.validate(this.definitions.envelope, input.envelope),
        this.validator,
      )
      const payloadResult = normalizedValidationResult(
        this.validator.validate(payloadDefinition, input.payload),
        this.validator,
      )
      if (!envelopeResult || !payloadResult) {
        return this.invalid(input, 'Schema validation returned a malformed result.')
      }
      const issues = [...envelopeResult.issues, ...payloadResult.issues]
      if (!envelopeResult.valid || !payloadResult.valid) {
        return this.invalid(input, 'Envelope and payload must both pass their identifiable schemas.', issues)
      }

      const envelope = StructuredExecutionEnvelope.create(
        input.envelope as never,
        this.definitions.envelopeReference,
        envelopeResult,
        this.validator,
      )
      const payload = StructuredCapabilityPayload.create(
        input.payload as never,
        payloadDefinition.reference,
        payloadResult,
        this.validator,
      )
      return Object.freeze({
        status: 'VALID' as const,
        value: ValidatedExecContract.create(envelope, payload),
      })
    } catch (error) {
      return this.invalid(input, 'Schema validation failed closed.', safeThrownIssue(error))
    }
  }
}
