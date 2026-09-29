import {
  EXEC_ENVELOPE_SCHEMA_ID,
  EXEC_CAPABILITY_ID,
  EXEC_PAYLOAD_SCHEMA_ID,
  EXEC_SCHEMA_VERSION,
  ContractReference,
  EXEC_ENVELOPE_SCHEMA_REFERENCE,
  EXEC_PAYLOAD_SCHEMA_REFERENCE,
  SchemaReference,
} from './exec-contract.ts'
import {
  AuthenticatedExecSchemaValidationPort,
  isAuthenticatedExecSchemaValidationPort,
  isProducerIssuedValidationResult,
} from './exec-validation-evidence-internal.ts'

export {
  AuthenticatedExecSchemaValidationPort,
  isAuthenticatedExecSchemaValidationPort,
  isProducerIssuedValidationResult,
}

export type SchemaValidationResult =
  | {
      readonly valid: true
      readonly issues: readonly string[]
      readonly validatedInput: object
      readonly schemaReference: SchemaReference
      readonly contentFingerprint: string
    }
  | {
      readonly valid: false
      readonly issues: readonly string[]
    }

export interface JsonSchemaDocument extends Readonly<Record<string, unknown>> {
  readonly $id: string
  readonly $schema: string
}

export interface ExecSchemaDefinition {
  readonly reference: SchemaReference
  readonly document: JsonSchemaDocument
  readonly capabilityId?: string
}

export interface ExecSchemaValidationPort {
  validate(schema: ExecSchemaDefinition, value: unknown): SchemaValidationResult
}

function jsonValueRef(): Readonly<Record<string, unknown>> {
  return { $ref: '#/$defs/jsonValue' }
}

function jsonValueDefinition(): Readonly<Record<string, unknown>> {
  return {
    anyOf: [
      { type: 'null' },
      { type: 'string' },
      { type: 'boolean' },
      { type: 'number' },
      { type: 'array', items: jsonValueRef() },
      { type: 'object', additionalProperties: jsonValueRef() },
    ],
  }
}

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (!value || typeof value !== 'object') return value
  if (seen.has(value)) return value
  seen.add(value)
  for (const key of Reflect.ownKeys(value)) {
    const descriptor = Object.getOwnPropertyDescriptor(value, key)
    if (descriptor && 'value' in descriptor) deepFreeze(descriptor.value, seen)
  }
  return Object.freeze(value)
}

function schemaDocument(input: {
  readonly id: string
  readonly properties: Readonly<Record<string, unknown>>
  readonly required: readonly string[]
}): JsonSchemaDocument {
  return deepFreeze({
    $id: `${input.id}@${EXEC_SCHEMA_VERSION}`,
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    type: 'object',
    properties: input.properties,
    required: input.required,
    additionalProperties: jsonValueRef(),
    $defs: { jsonValue: jsonValueDefinition() },
  })
}

const ENVELOPE_SCHEMA_REFERENCE = EXEC_ENVELOPE_SCHEMA_REFERENCE
const PAYLOAD_SCHEMA_REFERENCE = EXEC_PAYLOAD_SCHEMA_REFERENCE

const ENVELOPE_SCHEMA_DOCUMENT = schemaDocument({
  id: EXEC_ENVELOPE_SCHEMA_ID,
  properties: {
    schemaId: { const: EXEC_ENVELOPE_SCHEMA_ID },
    schemaVersion: { const: EXEC_SCHEMA_VERSION },
    contractVersion: { type: 'string', pattern: '^(0|[1-9][0-9]*)\\.(0|[1-9][0-9]*)\\.(0|[1-9][0-9]*)(-[0-9A-Za-z-]+(?:\\.[0-9A-Za-z-]+)*)?(\\+[0-9A-Za-z-]+(?:\\.[0-9A-Za-z-]+)*)?$' },
    executionId: { type: 'string', minLength: 1 },
    activityId: { type: 'string', minLength: 1 },
    agentAssignmentId: { type: 'string', minLength: 1 },
    artifactCycleId: { type: 'string', minLength: 1 },
    attemptId: { type: 'string', minLength: 1 },
    executionRound: { type: 'string', minLength: 1 },
    executionStatus: { type: 'string', minLength: 1 },
    functionalVerdict: { type: 'string', minLength: 1 },
    checkpoints: { type: 'array', items: jsonValueRef() },
    artifacts: { type: 'array', items: jsonValueRef() },
    evidence: { type: 'array', items: jsonValueRef() },
    findings: { type: 'array', items: jsonValueRef() },
    requestedEffects: { type: 'array', items: jsonValueRef() },
    errors: { type: 'array', items: jsonValueRef() },
  },
  required: [
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
  ],
})

const PAYLOAD_SCHEMA_DOCUMENT = schemaDocument({
  id: EXEC_PAYLOAD_SCHEMA_ID,
  properties: {
    schemaId: { const: EXEC_PAYLOAD_SCHEMA_ID },
    schemaVersion: { const: EXEC_SCHEMA_VERSION },
    capabilityId: { const: EXEC_CAPABILITY_ID },
    data: {
      type: 'object',
      properties: {
        result: { type: 'string', minLength: 1 },
      },
      required: ['result'],
      additionalProperties: jsonValueRef(),
    },
  },
  required: ['schemaId', 'schemaVersion', 'capabilityId', 'data'],
})

const CANONICAL_SCHEMA_DEFINITIONS = new WeakSet<object>()

export class ExecContractSchemaDefinitions {
  readonly envelope: ExecSchemaDefinition
  readonly payload: ExecSchemaDefinition
  readonly payloadDefinitions: readonly ExecSchemaDefinition[]

  constructor() {
    this.envelope = Object.freeze({
      reference: ENVELOPE_SCHEMA_REFERENCE,
      document: ENVELOPE_SCHEMA_DOCUMENT,
    })
    this.payload = Object.freeze({
      reference: PAYLOAD_SCHEMA_REFERENCE,
      document: PAYLOAD_SCHEMA_DOCUMENT,
      capabilityId: EXEC_CAPABILITY_ID,
    })
    this.payloadDefinitions = Object.freeze([this.payload])
    Object.freeze(this)
    CANONICAL_SCHEMA_DEFINITIONS.add(this.envelope)
    CANONICAL_SCHEMA_DEFINITIONS.add(this.payload)
  }

  selectPayload(value: unknown): ExecSchemaDefinition | undefined {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined
    const candidate = value as { readonly capabilityId?: unknown; readonly schemaId?: unknown; readonly schemaVersion?: unknown }
    return this.payloadDefinitions.find((definition) => candidate.capabilityId === definition.capabilityId
      && candidate.schemaId === definition.reference.schemaId
      && candidate.schemaVersion === definition.reference.version)
  }

  get envelopeReference(): SchemaReference {
    return this.envelope.reference
  }

  get payloadReference(): SchemaReference {
    return this.payload.reference
  }

  get contractReference(): ContractReference {
    return ContractReference.create({
      envelope: this.envelope.reference,
      payload: this.payload.reference,
    })
  }
}

/**
 * Schema mechanics may be selected behind the port, but canonical authority
 * can only be established from an immutable definition object created by the
 * owner boundary. Membership is checked before reading `reference` or
 * `document`, so getter/proxy wrappers cannot pass recognition and then swap
 * the document observed by the compiler.
 */
export function isCanonicalExecSchemaDefinition(value: unknown): value is ExecSchemaDefinition {
  return Boolean(
    value
      && typeof value === 'object'
      && !Array.isArray(value)
      && CANONICAL_SCHEMA_DEFINITIONS.has(value),
  )
}
