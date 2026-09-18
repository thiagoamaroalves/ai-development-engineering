import {
  invalidContract,
  ObservedContractReference,
  type ExecContractValidationResult,
  type SchemaValidationEvidence,
  StructuredCapabilityPayload,
  StructuredExecutionEnvelope,
  ValidatedExecContract,
} from '../domain/exec-contract.ts'
import {
  ExecContractSchemaDefinitions,
  type ExecSchemaValidationPort,
} from '../domain/exec-schema.ts'

export interface ValidateExecContractInput {
  readonly envelope: unknown
  readonly payload: unknown
  readonly humanText?: unknown
}

function normalizedValidationResult(value: unknown): {
  readonly valid: boolean
  readonly issues: readonly string[]
  readonly evidence?: SchemaValidationEvidence
} | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined
  if (!Object.prototype.hasOwnProperty.call(value, 'valid')
    || !Object.prototype.hasOwnProperty.call(value, 'issues')) return undefined
  const result = value as {
    readonly valid: unknown
    readonly issues: unknown
    readonly evidence?: unknown
  }
  if (typeof result.valid !== 'boolean' || !Array.isArray(result.issues)
    || !result.issues.every((entry) => typeof entry === 'string')) return undefined
  const keys = Object.keys(value)
  if (!result.valid) {
    if (keys.length !== 2) return undefined
    return Object.freeze({
      valid: false,
      issues: Object.freeze([...result.issues]),
    })
  }

  if (keys.length !== 3
    || !result.evidence
    || typeof result.evidence !== 'object'
    || Array.isArray(result.evidence)) {
    return undefined
  }
  return Object.freeze({
    valid: true,
    issues: Object.freeze([...result.issues]),
    evidence: result.evidence as SchemaValidationEvidence,
  })
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
      const envelopeResult = normalizedValidationResult(
        this.validator.validate(this.definitions.envelope, input.envelope),
      )
      const payloadResult = normalizedValidationResult(
        this.validator.validate(this.definitions.payload, input.payload),
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
        envelopeResult.evidence,
      )
      const payload = StructuredCapabilityPayload.create(
        input.payload as never,
        this.definitions.payloadReference,
        payloadResult.evidence,
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
