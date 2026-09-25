import {
  isAuthenticatedExecSchemaValidationPort,
  isProducerIssuedValidationResult,
} from './exec-validation-evidence-internal.ts'
import type {
  ExecSchemaValidationPort,
  SchemaValidationResult,
} from './exec-schema.ts'

export type JsonObject = Readonly<Record<string, unknown>>

export type ContractFailureCode = 'CONTRACT_INVALID'

export const EXEC_ENVELOPE_SCHEMA_ID = 'exec-envelope'
export const EXEC_CAPABILITY_ID = 'capability-001'
export const EXEC_PAYLOAD_SCHEMA_ID = 'exec-capability-001-payload'
export const EXEC_SCHEMA_VERSION = '1.0.0'

const SCHEMA_REFERENCE_BRAND = Symbol('exec-schema-reference')
const VALIDATED_ENVELOPE_BRAND = Symbol('exec-validated-envelope')
const VALIDATED_PAYLOAD_BRAND = Symbol('exec-validated-payload')
const SCHEMA_REFERENCE_CONSTRUCTION_TOKEN = {}
const CONSTRUCTION_TOKEN = {}
const SCHEMA_REFERENCE_INSTANCES = new WeakSet<object>()
const VALIDATED_ENVELOPE_INSTANCES = new WeakSet<object>()
const VALIDATED_PAYLOAD_INSTANCES = new WeakSet<object>()

/**
 * Schema-validation success is accepted only when the authenticated producer
 * issued the exact result object for the canonical reference and input. Domain
 * recognition uses producer/result identity rather than caller-controlled
 * prototype methods or nominal evidence names.
 */
export class ExecContractDomainError extends Error {
  readonly code: ContractFailureCode

  constructor(message: string) {
    super(message)
    this.name = 'ExecContractDomainError'
    this.code = 'CONTRACT_INVALID'
  }
}

function requiredToken(value: unknown, label: string): string {
  if (typeof value !== 'string') {
    throw new ExecContractDomainError(`${label} is required.`)
  }

  const normalized = value.trim()
  if (!normalized || normalized.length > 200 || /[\r\n]/.test(normalized)) {
    throw new ExecContractDomainError(`${label} must be a non-empty single-line value.`)
  }

  return normalized
}

function requiredOpaqueIdentity(value: unknown, label: string): string {
  if (typeof value !== 'string' || !value || value.length > 200 || /[\r\n]/.test(value)) {
    throw new ExecContractDomainError(`${label} must be a non-empty single-line value.`)
  }
  return value
}

export function isSemanticVersion(value: string): boolean {
  const match = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/.exec(value)
  if (!match) return false

  const core = match.slice(1, 4)
  if (core.some((part) => part.length > 1 && part.startsWith('0'))) return false

  const prerelease = match[4]
  if (prerelease?.split('.').some((part) => /^\d+$/.test(part) && part.length > 1 && part.startsWith('0'))) {
    return false
  }

  return true
}

function requiredSemver(value: unknown, label: string): string {
  const normalized = requiredToken(value, label)
  if (!isSemanticVersion(normalized)) {
    throw new ExecContractDomainError(`${label} must be a semantic version.`)
  }
  return normalized
}

function requiredExactSemver(value: unknown, label: string): string {
  if (typeof value !== 'string' || !isSemanticVersion(value)) {
    throw new ExecContractDomainError(`${label} must be a semantic version.`)
  }
  return value
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  const prototype = Object.getPrototypeOf(value)
  return prototype === Object.prototype || prototype === null
}

function cloneAndFreeze(value: unknown): unknown {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return value
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) throw new ExecContractDomainError('Structured values must contain finite JSON numbers.')
    return value
  }
  if (Array.isArray(value)) {
    const length = value.length
    for (const key of Reflect.ownKeys(value)) {
      if (typeof key !== 'string' || (key !== 'length' && !/^\d+$/.test(key))) {
        throw new ExecContractDomainError('Structured arrays must contain JSON values only.')
      }
      if (key !== 'length') {
        const index = Number(key)
        if (!Number.isSafeInteger(index) || String(index) !== key || index >= length) {
          throw new ExecContractDomainError('Structured arrays must contain JSON values only.')
        }
      }
    }
    for (let index = 0; index < length; index += 1) {
      if (!Object.prototype.hasOwnProperty.call(value, String(index))) {
        throw new ExecContractDomainError('Structured arrays must not contain sparse holes.')
      }
    }
    return Object.freeze(value.map((item) => cloneAndFreeze(item)))
  }
  if (isPlainObject(value)) {
    for (const key of Reflect.ownKeys(value)) {
      if (typeof key !== 'string') {
        throw new ExecContractDomainError('Structured objects must contain JSON keys only.')
      }
      const descriptor = Object.getOwnPropertyDescriptor(value, key)
      if (!descriptor || !descriptor.enumerable || !('value' in descriptor)) {
        throw new ExecContractDomainError('Structured objects must contain JSON data only.')
      }
    }
    const copy: Record<string, unknown> = {}
    for (const key of Object.keys(value)) {
      Object.defineProperty(copy, key, {
        configurable: true,
        enumerable: true,
        writable: true,
        value: cloneAndFreeze(value[key]),
      })
    }
    return Object.freeze(copy)
  }
  throw new ExecContractDomainError('Structured values must contain JSON data only.')
}

function stableSerialized(value: unknown): string {
  if (value === null) return 'null'
  if (typeof value === 'string') return JSON.stringify(value)
  if (typeof value === 'boolean') return value ? 'true' : 'false'
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) throw new ExecContractDomainError('Structured values must contain finite JSON numbers.')
    return JSON.stringify(value)
  }
  if (Array.isArray(value)) return `[${value.map((item) => stableSerialized(item)).join(',')}]`
  if (isPlainObject(value)) {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableSerialized(value[key])}`).join(',')}}`
  }
  throw new ExecContractDomainError('Structured values must contain JSON data only.')
}

export function structuredContentFingerprint(value: unknown): string {
  return stableSerialized(cloneAndFreeze(value))
}

function requiredObject(value: unknown, label: string): JsonObject {
  if (!isPlainObject(value)) {
    throw new ExecContractDomainError(`${label} must be a structured object.`)
  }
  return cloneAndFreeze(value) as JsonObject
}

function requiredArray(value: unknown, label: string): readonly unknown[] {
  if (!Array.isArray(value)) {
    throw new ExecContractDomainError(`${label} must be a structured array.`)
  }
  return cloneAndFreeze(value) as readonly unknown[]
}

export class SchemaReference {
  readonly schemaId: string
  readonly version: string

  private constructor(schemaId: string, version: string, token: object) {
    if (token !== SCHEMA_REFERENCE_CONSTRUCTION_TOKEN) {
      throw new ExecContractDomainError('Schema reference construction is restricted to the contract boundary.')
    }
    this.schemaId = schemaId
    this.version = version
    Object.defineProperty(this, SCHEMA_REFERENCE_BRAND, { value: true })
    SCHEMA_REFERENCE_INSTANCES.add(this)
    Object.freeze(this)
  }

  static create(input: { readonly schemaId: unknown; readonly version: unknown }): SchemaReference {
    if (!isPlainObject(input)
      || !Object.prototype.hasOwnProperty.call(input, 'schemaId')
      || !Object.prototype.hasOwnProperty.call(input, 'version')) {
      throw new ExecContractDomainError('Schema reference is required.')
    }
    const schemaId = requiredToken(input.schemaId, 'Schema identity')
    const version = requiredSemver(input.version, 'Schema version')
    return new SchemaReference(schemaId, version, SCHEMA_REFERENCE_CONSTRUCTION_TOKEN)
  }

  equals(other: SchemaReference): boolean {
    return this.schemaId === other.schemaId && this.version === other.version
  }

  get value(): string {
    return `${this.schemaId}@${this.version}`
  }
}

/**
 * Runtime provenance check for authority-bearing schema references. `instanceof`
 * alone is insufficient because callers can forge a matching prototype.
 */
export function isAuthenticatedSchemaReference(value: unknown): value is SchemaReference {
  return typeof value === 'object' && value !== null && SCHEMA_REFERENCE_INSTANCES.has(value)
}

export interface ContractSchemaReferenceSnapshot {
  readonly schemaId: string
  readonly version: string
}

export class ContractReference {
  readonly envelope: SchemaReference
  readonly payload: SchemaReference

  private constructor(envelope: SchemaReference, payload: SchemaReference) {
    this.envelope = envelope
    this.payload = payload
    Object.freeze(this)
  }

  static create(input: {
    readonly envelope: SchemaReference
    readonly payload: SchemaReference
  }): ContractReference {
    if (!(input?.envelope instanceof SchemaReference) || !(input?.payload instanceof SchemaReference)) {
      throw new ExecContractDomainError('Expected contract references are required.')
    }
    return new ContractReference(input.envelope, input.payload)
  }

  get value(): Readonly<{ envelope: ContractSchemaReferenceSnapshot; payload: ContractSchemaReferenceSnapshot }> {
    return Object.freeze({
      envelope: Object.freeze({ schemaId: this.envelope.schemaId, version: this.envelope.version }),
      payload: Object.freeze({ schemaId: this.payload.schemaId, version: this.payload.version }),
    })
  }
}

export interface ObservedSchemaReference {
  readonly present: boolean
  readonly schemaId?: string
  readonly version?: string
  readonly source: 'UNTRUSTED_INPUT'
}

export class ObservedContractReference {
  readonly envelope: ObservedSchemaReference
  readonly payload: ObservedSchemaReference

  private constructor(envelope: ObservedSchemaReference, payload: ObservedSchemaReference) {
    this.envelope = Object.freeze(envelope)
    this.payload = Object.freeze(payload)
    Object.freeze(this)
  }

  static fromInput(input: unknown): ObservedContractReference {
    const read = (value: unknown): ObservedSchemaReference => {
      try {
        if (!isPlainObject(value)) return Object.freeze({ present: false, source: 'UNTRUSTED_INPUT' as const })
        const schemaId = typeof value.schemaId === 'string' ? value.schemaId : undefined
        const version = typeof value.schemaVersion === 'string' ? value.schemaVersion : undefined
        return Object.freeze({
          present: true,
          ...(schemaId === undefined ? {} : { schemaId }),
          ...(version === undefined ? {} : { version }),
          source: 'UNTRUSTED_INPUT' as const,
        })
      } catch {
        return Object.freeze({ present: true, source: 'UNTRUSTED_INPUT' as const })
      }
    }
    try {
      const record = isPlainObject(input) ? input : {}
      return new ObservedContractReference(read(record.envelope), read(record.payload))
    } catch {
      return new ObservedContractReference(
        Object.freeze({ present: true, source: 'UNTRUSTED_INPUT' as const }),
        Object.freeze({ present: true, source: 'UNTRUSTED_INPUT' as const }),
      )
    }
  }
}

export const EXEC_ENVELOPE_SCHEMA_REFERENCE = SchemaReference.create({
  schemaId: EXEC_ENVELOPE_SCHEMA_ID,
  version: EXEC_SCHEMA_VERSION,
})
export const EXEC_PAYLOAD_SCHEMA_REFERENCE = SchemaReference.create({
  schemaId: EXEC_PAYLOAD_SCHEMA_ID,
  version: EXEC_SCHEMA_VERSION,
})

export const DEFAULT_EXEC_CONTRACT_REFERENCE = ContractReference.create({
  envelope: EXEC_ENVELOPE_SCHEMA_REFERENCE,
  payload: EXEC_PAYLOAD_SCHEMA_REFERENCE,
})

function hasOwnBrand(value: object, brand: symbol): boolean {
  return Object.prototype.hasOwnProperty.call(value, brand)
}

function isSchemaReference(value: unknown): value is SchemaReference {
  return value instanceof SchemaReference
    && SCHEMA_REFERENCE_INSTANCES.has(value)
    && hasOwnBrand(value, SCHEMA_REFERENCE_BRAND)
}

function isCanonicalSchemaReference(value: unknown, schemaId: string): value is SchemaReference {
  const canonical = schemaId === EXEC_ENVELOPE_SCHEMA_ID
    ? EXEC_ENVELOPE_SCHEMA_REFERENCE
    : schemaId === EXEC_PAYLOAD_SCHEMA_ID
      ? EXEC_PAYLOAD_SCHEMA_REFERENCE
      : undefined
  return isSchemaReference(value) && value === canonical
}

const ENVELOPE_REQUIRED_FIELDS = Object.freeze([
  'schemaId',
  'schemaVersion',
  'contractVersion',
  'executionId',
  'activityId',
  'agentAssignmentId',
  'artifactCycleId',
  'attemptId',
  'executionRound',
  'executionStatus',
  'functionalVerdict',
  'checkpoints',
  'artifacts',
  'evidence',
  'findings',
  'requestedEffects',
  'errors',
] as const)

const PAYLOAD_REQUIRED_FIELDS = Object.freeze([
  'schemaId',
  'schemaVersion',
  'capabilityId',
  'data',
] as const)

function hasCurrentOwnDataFields(
  value: object,
  requiredFields: readonly string[],
): boolean {
  return requiredFields.every((field) => {
    const descriptor = Object.getOwnPropertyDescriptor(value, field)
    return Boolean(descriptor?.enumerable && 'value' in descriptor)
  })
}

/**
 * The selected capability schema's semantic minimum is rechecked at the
 * structured-value boundary. This keeps a caller-supplied authenticated
 * producer from turning an unvalidated payload into a domain value: producer
 * evidence binds the input, while the domain value independently enforces the
 * ticket-owned capability contract before construction.
 */
function hasRequiredNonEmptyStringField(value: unknown, field: string): boolean {
  if (!isPlainObject(value)) return false
  const descriptor = Object.getOwnPropertyDescriptor(value, field)
  return Boolean(
    descriptor?.enumerable
      && 'value' in descriptor
      && typeof descriptor.value === 'string'
      && descriptor.value.length > 0,
  )
}

function isSuccessfulSchemaValidation(
  value: unknown,
  schema: SchemaReference,
  input: object,
  producer: unknown,
): value is Extract<SchemaValidationResult, { readonly valid: true }> {
  if (!isAuthenticatedExecSchemaValidationPort(producer)
    || !isProducerIssuedValidationResult(producer, value)) {
    return false
  }
  const result = value as Partial<Extract<SchemaValidationResult, { readonly valid: true }>>
  const keys = Object.keys(value)
  return keys.length === 5
    && keys.every((key) => key === 'valid'
      || key === 'issues'
      || key === 'validatedInput'
      || key === 'schemaReference'
      || key === 'contentFingerprint')
    && result.valid === true
    && Array.isArray(result.issues)
    && result.issues.every((issue) => typeof issue === 'string')
    && result.validatedInput === input
    && result.schemaReference === schema
    && typeof result.contentFingerprint === 'string'
    && result.contentFingerprint === structuredContentFingerprint(input)
}

export interface StructuredExecutionEnvelopeInput extends JsonObject {
  readonly schemaId: unknown
  readonly schemaVersion: unknown
  readonly contractVersion: unknown
  readonly executionId: unknown
  readonly activityId: unknown
  readonly agentAssignmentId: unknown
  readonly artifactCycleId: unknown
  readonly attemptId: unknown
  readonly executionRound: unknown
  readonly executionStatus: unknown
  readonly functionalVerdict: unknown
  readonly checkpoints: unknown
  readonly artifacts: unknown
  readonly evidence: unknown
  readonly findings: unknown
  readonly requestedEffects: unknown
  readonly errors: unknown
}

export class StructuredExecutionEnvelope {
  readonly schema: SchemaReference
  readonly contractVersion: string
  readonly executionId: string
  readonly activityId: string
  readonly agentAssignmentId: string
  readonly artifactCycleId: string
  readonly attemptId: string
  readonly executionRound: string
  readonly executionStatus: string
  readonly functionalVerdict: string
  readonly checkpoints: readonly unknown[]
  readonly artifacts: readonly unknown[]
  readonly evidence: readonly unknown[]
  readonly findings: readonly unknown[]
  readonly requestedEffects: readonly unknown[]
  readonly errors: readonly unknown[]
  readonly structured: JsonObject

  private constructor(input: StructuredExecutionEnvelopeInput, schema: SchemaReference, token: object) {
    if (token !== CONSTRUCTION_TOKEN) throw new ExecContractDomainError('Validated envelope construction is restricted to the contract boundary.')
    this.schema = schema
    this.contractVersion = requiredExactSemver(input.contractVersion, 'Contract version')
    this.executionId = requiredOpaqueIdentity(input.executionId, 'Execution identity')
    this.activityId = requiredOpaqueIdentity(input.activityId, 'Activity identity')
    this.agentAssignmentId = requiredOpaqueIdentity(input.agentAssignmentId, 'Agent assignment identity')
    this.artifactCycleId = requiredOpaqueIdentity(input.artifactCycleId, 'Artifact cycle identity')
    this.attemptId = requiredOpaqueIdentity(input.attemptId, 'Attempt identity')
    this.executionRound = requiredToken(input.executionRound, 'Execution round')
    this.executionStatus = requiredToken(input.executionStatus, 'Execution status')
    this.functionalVerdict = requiredToken(input.functionalVerdict, 'Functional verdict')
    this.checkpoints = requiredArray(input.checkpoints, 'Checkpoints')
    this.artifacts = requiredArray(input.artifacts, 'Artifacts')
    this.evidence = requiredArray(input.evidence, 'Evidence')
    this.findings = requiredArray(input.findings, 'Findings')
    this.requestedEffects = requiredArray(input.requestedEffects, 'Requested effects')
    this.errors = requiredArray(input.errors, 'Errors')
    this.structured = requiredObject(input, 'Envelope')
    Object.defineProperty(this, VALIDATED_ENVELOPE_BRAND, { value: true })
    VALIDATED_ENVELOPE_INSTANCES.add(this)
    Object.freeze(this)
  }

  static create(
    input: StructuredExecutionEnvelopeInput,
    schema: SchemaReference,
    validation?: SchemaValidationResult,
    producer?: ExecSchemaValidationPort,
  ): StructuredExecutionEnvelope {
    if (!input || typeof input !== 'object' || Array.isArray(input)) {
      throw new ExecContractDomainError('A structured envelope is required.')
    }
    if (!isCanonicalSchemaReference(schema, EXEC_ENVELOPE_SCHEMA_ID)) {
      throw new ExecContractDomainError('A ticket-owned envelope schema reference is required.')
    }
    if (!isSuccessfulSchemaValidation(validation, schema, input, producer)) {
      throw new ExecContractDomainError('Envelope construction requires an authenticated successful schema validation result.')
    }
    if (!hasCurrentOwnDataFields(input, ENVELOPE_REQUIRED_FIELDS)) {
      throw new ExecContractDomainError('Envelope required schema properties must remain own enumerable data fields.')
    }
    if (!Object.prototype.hasOwnProperty.call(input, 'schemaId')
      || !Object.prototype.hasOwnProperty.call(input, 'schemaVersion')
      || input.schemaId !== schema.schemaId
      || input.schemaVersion !== schema.version) {
      throw new ExecContractDomainError('Envelope schema identity does not match the registered schema.')
    }
    return new StructuredExecutionEnvelope(input, schema, CONSTRUCTION_TOKEN)
  }
}

export interface StructuredCapabilityPayloadInput extends JsonObject {
  readonly schemaId: unknown
  readonly schemaVersion: unknown
  readonly capabilityId: unknown
  readonly data: unknown
}

export class StructuredCapabilityPayload {
  readonly schema: SchemaReference
  readonly capabilityId: string
  readonly data: JsonObject
  readonly structured: JsonObject

  private constructor(input: StructuredCapabilityPayloadInput, schema: SchemaReference, token: object) {
    if (token !== CONSTRUCTION_TOKEN) throw new ExecContractDomainError('Validated payload construction is restricted to the contract boundary.')
    this.schema = schema
    this.capabilityId = requiredOpaqueIdentity(input.capabilityId, 'Capability identity')
    this.data = requiredObject(input.data, 'Capability data')
    this.structured = requiredObject(input, 'Capability payload')
    Object.defineProperty(this, VALIDATED_PAYLOAD_BRAND, { value: true })
    VALIDATED_PAYLOAD_INSTANCES.add(this)
    Object.freeze(this)
  }

  static create(
    input: StructuredCapabilityPayloadInput,
    schema: SchemaReference,
    validation?: SchemaValidationResult,
    producer?: ExecSchemaValidationPort,
  ): StructuredCapabilityPayload {
    if (!input || typeof input !== 'object' || Array.isArray(input)) {
      throw new ExecContractDomainError('A structured capability payload is required.')
    }
    if (!isCanonicalSchemaReference(schema, EXEC_PAYLOAD_SCHEMA_ID)) {
      throw new ExecContractDomainError('A ticket-owned payload schema reference is required.')
    }
    if (!isSuccessfulSchemaValidation(validation, schema, input, producer)) {
      throw new ExecContractDomainError('Payload construction requires an authenticated successful schema validation result.')
    }
    if (!hasCurrentOwnDataFields(input, PAYLOAD_REQUIRED_FIELDS)) {
      throw new ExecContractDomainError('Payload required schema properties must remain own enumerable data fields.')
    }
    if (!Object.prototype.hasOwnProperty.call(input, 'schemaId')
      || !Object.prototype.hasOwnProperty.call(input, 'schemaVersion')
      || input.schemaId !== schema.schemaId
      || input.schemaVersion !== schema.version) {
      throw new ExecContractDomainError('Payload schema identity does not match the registered schema.')
    }
    if (input.capabilityId !== EXEC_CAPABILITY_ID) {
      throw new ExecContractDomainError('Capability identity does not match the ticket-owned payload schema.')
    }
    if (!hasRequiredNonEmptyStringField(input.data, 'result')) {
      throw new ExecContractDomainError('Capability payload data must include a non-empty result field.')
    }
    return new StructuredCapabilityPayload(input, schema, CONSTRUCTION_TOKEN)
  }
}

export class ValidatedExecContract {
  readonly envelope: StructuredExecutionEnvelope
  readonly payload: StructuredCapabilityPayload

  private constructor(envelope: StructuredExecutionEnvelope, payload: StructuredCapabilityPayload, token: object) {
    if (token !== CONSTRUCTION_TOKEN) throw new ExecContractDomainError('Validated contract construction is restricted to the contract boundary.')
    this.envelope = envelope
    this.payload = payload
    Object.freeze(this)
  }

  static create(
    envelope: StructuredExecutionEnvelope,
    payload: StructuredCapabilityPayload,
  ): ValidatedExecContract {
    const validEnvelope = envelope instanceof StructuredExecutionEnvelope
      && VALIDATED_ENVELOPE_INSTANCES.has(envelope)
      && hasOwnBrand(envelope, VALIDATED_ENVELOPE_BRAND)
    const validPayload = payload instanceof StructuredCapabilityPayload
      && VALIDATED_PAYLOAD_INSTANCES.has(payload)
      && hasOwnBrand(payload, VALIDATED_PAYLOAD_BRAND)
    if (!validEnvelope || !validPayload) {
      throw new ExecContractDomainError('A complete validated envelope and payload are required.')
    }
    return new ValidatedExecContract(envelope, payload, CONSTRUCTION_TOKEN)
  }
}

export class ContractInvalidFailure {
  readonly status = 'INVALID' as const
  readonly code: ContractFailureCode = 'CONTRACT_INVALID'
  readonly family = 'CONTRACT' as const
  readonly reason: string
  readonly issues: readonly string[]
  readonly expectedContractReference: ContractReference
  readonly observedContractReference: ObservedContractReference
  readonly noApproval = true as const
  readonly noCheckpoint = true as const
  readonly noEffect = true as const

  constructor(
    reason: string,
    issues: readonly string[] = [],
    expectedContractReference: ContractReference = DEFAULT_EXEC_CONTRACT_REFERENCE,
    observedReference: ObservedContractReference = ObservedContractReference.fromInput(undefined),
  ) {
    this.reason = requiredToken(reason, 'Contract failure reason')
    this.issues = Object.freeze([...issues].map((issue) => requiredToken(issue, 'Contract failure issue')))
    this.expectedContractReference = expectedContractReference
    this.observedContractReference = observedReference
    Object.freeze(this)
  }
}

export type ExecContractValidationResult =
  | Readonly<{ readonly status: 'VALID'; readonly value: ValidatedExecContract }>
  | Readonly<{ readonly status: 'INVALID'; readonly failure: ContractInvalidFailure }>

export function invalidContract(
  reason: string,
  issues: readonly string[] = [],
  expectedContractReference: ContractReference = DEFAULT_EXEC_CONTRACT_REFERENCE,
  observedReference: ObservedContractReference = ObservedContractReference.fromInput(undefined),
): ExecContractValidationResult {
  return Object.freeze({
    status: 'INVALID' as const,
    failure: new ContractInvalidFailure(reason, issues, expectedContractReference, observedReference),
  })
}
