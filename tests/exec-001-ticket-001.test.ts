import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { promisify } from 'node:util'
import test from 'node:test'
import {
  ValidateExecContract,
  type ValidateExecContractInput,
} from '../src/application/exec-contract.ts'
import { createExecContractValidator } from '../src/composition/exec-contract.ts'
import * as execContractDomain from '../src/domain/exec-contract.ts'
import {
  SchemaReference,
  structuredContentFingerprint,
  StructuredCapabilityPayload,
  StructuredExecutionEnvelope,
  ValidatedExecContract,
} from '../src/domain/exec-contract.ts'
import {
  AuthenticatedExecSchemaValidationPort,
  ExecContractSchemaDefinitions,
  type ExecSchemaDefinition,
  type ExecSchemaValidationPort,
  type SchemaValidationResult,
} from '../src/domain/exec-schema.ts'
import { JsonSchemaExecValidator } from '../src/infrastructure/exec-schema-validator.ts'
import { runFullWorkflow, type WorkflowPlan } from '../.pi/extensions/workflow-orchestrator/full-orchestrator.ts'
import { OrchestrationStop, type DelegationRequest, type DelegationResult } from '../.pi/extensions/workflow-orchestrator/contracts.ts'

const execFileAsync = promisify(execFile)

function validInput(): ValidateExecContractInput {
  return {
    envelope: {
      schemaId: 'exec-envelope',
      schemaVersion: '1.0.0',
      contractVersion: '1.0.0',
      executionId: 'execution-001',
      activityId: 'activity-001',
      agentAssignmentId: 'assignment-001',
      artifactCycleId: 'cycle-001',
      attemptId: 'attempt-001',
      executionRound: 'round-001',
      executionStatus: 'COMPLETED',
      functionalVerdict: 'PASS',
      checkpoints: [],
      artifacts: [],
      evidence: [{ kind: 'test', value: 'direct' }],
      findings: [],
      requestedEffects: [],
      errors: [],
    },
    payload: {
      schemaId: 'exec-capability-001-payload',
      schemaVersion: '1.0.0',
      capabilityId: 'capability-001',
      data: { result: 'structured' },
    },
    humanText: 'This text is descriptive only.',
  }
}

function createDefaultValidator(): ValidateExecContract {
  return createExecContractValidator()
}

function assertFailureEvidence(result: ReturnType<ValidateExecContract['validate']>): void {
  assert.equal(result.status, 'INVALID')
  if (result.status !== 'INVALID') return
  assert.equal(result.failure.expectedContractReference.value.envelope.schemaId, 'exec-envelope')
  assert.equal(result.failure.expectedContractReference.value.payload.schemaId, 'exec-capability-001-payload')
  assert.equal(result.failure.expectedContractReference.value.envelope.version, '1.0.0')
  assert.equal(Object.isFrozen(result.failure), true)
  assert.equal(Object.isFrozen(result.failure.expectedContractReference), true)
  assert.equal(Object.isFrozen(result.failure.observedContractReference), true)
}

function extractImportSpecifiers(content: string): string[] {
  const patterns = [
    /\bimport\s+(?:[^'\";]*?\sfrom\s*)?['\"]([^'\"]+)['\"]/g,
    /\bexport\s+[^'\";]*?\sfrom\s*['\"]([^'\"]+)['\"]/g,
    /\b(?:require|import)\s*\(\s*['\"]([^'\"]+)['\"]\s*\)/g,
  ]
  return patterns.flatMap((pattern) => [...content.matchAll(pattern)].map((match) => match[1]))
}

test('accepts a valid identifiable envelope and capability payload as structured values', () => {
  const result = createDefaultValidator().validate(validInput())

  assert.equal(result.status, 'VALID')
  if (result.status !== 'VALID') return
  assert.equal(result.value.envelope.schema.value, 'exec-envelope@1.0.0')
  assert.equal(result.value.payload.schema.value, 'exec-capability-001-payload@1.0.0')
  assert.equal(result.value.payload.data.result, 'structured')
})

test('selects an identifiable capability schema and rejects generic or unknown payloads', () => {
  const definitions = new ExecContractSchemaDefinitions()
  assert.equal(definitions.payload.capabilityId, 'capability-001')
  assert.equal(definitions.payloadDefinitions.length, 1)
  assert.equal(Object.isFrozen(definitions.payloadDefinitions), true)
  assert.equal(definitions.selectPayload(validInput().payload), definitions.payload)

  const genericPayload = {
    ...(validInput().payload as Record<string, unknown>),
    data: { unrelated: true },
  }
  const genericResult = createDefaultValidator().validate({ ...validInput(), payload: genericPayload })
  assert.equal(genericResult.status, 'INVALID')
  if (genericResult.status === 'INVALID') {
    assert.equal(genericResult.failure.code, 'CONTRACT_INVALID')
    assert.equal(genericResult.failure.noEffect, true)
  }

  const unknownPayload = {
    ...(validInput().payload as Record<string, unknown>),
    capabilityId: 'capability-unknown',
  }
  const unknownResult = createDefaultValidator().validate({ ...validInput(), payload: unknownPayload })
  assert.equal(unknownResult.status, 'INVALID')
  if (unknownResult.status === 'INVALID') assert.equal(unknownResult.failure.code, 'CONTRACT_INVALID')

  const genericSchemaPayload = {
    ...(validInput().payload as Record<string, unknown>),
    schemaId: 'exec-capability-payload',
  }
  const genericSchemaResult = createDefaultValidator().validate({ ...validInput(), payload: genericSchemaPayload })
  assert.equal(genericSchemaResult.status, 'INVALID')
  if (genericSchemaResult.status === 'INVALID') assert.equal(genericSchemaResult.failure.code, 'CONTRACT_INVALID')
})

test('preserves opaque identity references without normalization', () => {
  const input = validInput()
  const envelope = {
    ...(input.envelope as Record<string, unknown>),
    executionId: '  execution-opaque  ',
    activityId: ' activity-opaque ',
  }
  const result = createDefaultValidator().validate({ ...input, envelope })

  assert.equal(result.status, 'VALID')
  if (result.status !== 'VALID') return
  assert.equal(result.value.envelope.executionId, '  execution-opaque  ')
  assert.equal(result.value.envelope.activityId, ' activity-opaque ')
  assert.equal(result.value.payload.capabilityId, 'capability-001')
})

test('uses canonical JSON Schema documents through the compiled validation adapter', () => {
  const definitions = new ExecContractSchemaDefinitions()
  assert.equal(definitions.envelope.document.$schema, 'https://json-schema.org/draft/2020-12/schema')
  assert.equal(definitions.envelope.document.$id, 'exec-envelope@1.0.0')
  assert.equal(definitions.payload.document.$id, 'exec-capability-001-payload@1.0.0')
  assert.equal(Object.isFrozen(definitions.envelope.document), true)
  assert.equal(Object.isFrozen(definitions.envelope.document.required), true)
  assert.equal(Object.isFrozen(definitions.envelope.document.properties), true)
  assert.equal(Object.isFrozen(definitions.envelope.document.$defs), true)
  assert.throws(
    () => (definitions.envelope.document.required as string[]).push('mutated'),
    TypeError,
  )
  const secondDefinitions = new ExecContractSchemaDefinitions()
  assert.equal((secondDefinitions.envelope.document.required as readonly string[]).includes('mutated'), false)

  const input = validInput()
  const envelope = {
    ...(input.envelope as Record<string, unknown>),
    unsupported: () => true,
  }
  const result = createDefaultValidator().validate({ ...input, envelope })
  assert.equal(result.status, 'INVALID')
  if (result.status !== 'INVALID') return
  assert.equal(result.failure.code, 'CONTRACT_INVALID')
  assert.equal(result.failure.expectedContractReference.value.envelope.schemaId, 'exec-envelope')
})

test('keeps schema validation behind the narrow adapter port', () => {
  const input = validInput()
  const firstAdapterResult = new JsonSchemaExecValidator().validate(
    new ExecContractSchemaDefinitions().envelope,
    input.envelope,
  )
  assert.equal(firstAdapterResult.valid, true)
  assert.deepEqual(firstAdapterResult.issues, [])
  assert.equal(firstAdapterResult.validatedInput, input.envelope)
  assert.equal(firstAdapterResult.schemaReference, new ExecContractSchemaDefinitions().envelope.reference)
})

test('rejects caller-selected schema authority at the production boundary', () => {
  const input = validInput()
  const permissiveValidator: ExecSchemaValidationPort = {
    validate: () => ({ valid: true, issues: [], validatedInput: {}, schemaReference: new ExecContractSchemaDefinitions().envelope.reference, contentFingerprint: '{}' }),
  }
  const result = new ValidateExecContract(permissiveValidator).validate({
    ...input,
    envelope: {
      ...(input.envelope as Record<string, unknown>),
      schemaId: 'caller-envelope',
      schemaVersion: '9.9.9',
    },
    payload: {
      ...(input.payload as Record<string, unknown>),
      schemaId: 'caller-payload',
      schemaVersion: '9.9.9',
    },
  })

  assert.equal(result.status, 'INVALID')
  if (result.status !== 'INVALID') return
  assert.equal(result.failure.code, 'CONTRACT_INVALID')
  assert.equal(result.failure.noApproval, true)
  assert.equal('value' in result, false)
  assertFailureEvidence(result)
  assert.equal(result.failure.observedContractReference.envelope.schemaId, 'caller-envelope')
  assert.equal(result.failure.observedContractReference.payload.schemaId, 'caller-payload')
})

test('does not let a custom schema document mint canonical validation authority', () => {
  const definitions = new ExecContractSchemaDefinitions()
  const customDefinition = {
    reference: definitions.envelope.reference,
    document: {
      ...definitions.envelope.document,
      required: [],
    },
  }
  const schemaResult = new JsonSchemaExecValidator().validate(
    customDefinition as never,
    validInput().envelope,
  )

  assert.equal(schemaResult.valid, false)
  assert.match(schemaResult.issues.join(' '), /ticket-owned schema definitions/)
})

test('rejects getter-backed schema definitions before reading replaceable authority', () => {
  const definitions = new ExecContractSchemaDefinitions()
  const attackerDocument = {
    ...definitions.envelope.document,
    required: [],
  }
  let documentReads = 0
  const getterBackedDefinition = {
    get reference(): SchemaReference {
      return definitions.envelope.reference
    },
    get document() {
      documentReads += 1
      return documentReads === 1 ? definitions.envelope.document : attackerDocument
    },
  }

  const result = new JsonSchemaExecValidator().validate(
    getterBackedDefinition as never,
    validInput().envelope,
  )

  assert.equal(result.valid, false)
  assert.match(result.issues.join(' '), /ticket-owned schema definitions/)
  assert.equal(documentReads, 0)
})

test('rejects an always-true adapter when the structured input is invalid or unproven', () => {
  const forgedValidator: ExecSchemaValidationPort = {
    validate: () => ({ valid: true, issues: [], validatedInput: {}, schemaReference: new ExecContractSchemaDefinitions().envelope.reference, contentFingerprint: '{}' }),
  }
  const input = validInput()
  const invalidResult = new ValidateExecContract(forgedValidator).validate({
    ...input,
    envelope: { ...(input.envelope as Record<string, unknown>), contractVersion: ' 1.0.0 ' },
  })
  assert.equal(invalidResult.status, 'INVALID')
  if (invalidResult.status !== 'INVALID') return
  assert.equal(invalidResult.failure.code, 'CONTRACT_INVALID')
  assert.equal(invalidResult.failure.noApproval, true)
  assert.equal(invalidResult.failure.noCheckpoint, true)
  assert.equal(invalidResult.failure.noEffect, true)
  assert.equal('value' in invalidResult, false)

  const unprovenResult = new ValidateExecContract(forgedValidator).validate(input)
  assert.equal(unprovenResult.status, 'INVALID')
  if (unprovenResult.status !== 'INVALID') return
  assert.equal(unprovenResult.failure.code, 'CONTRACT_INVALID')
  assert.equal('value' in unprovenResult, false)
})

test('accepts an independently implemented authenticated adapter through the explicit producer contract', () => {
  const input = validInput()
  const definitions = new ExecContractSchemaDefinitions()

  class IndependentSchemaAdapter extends AuthenticatedExecSchemaValidationPort {
    constructor() {
      super()
    }

    validate(schema: ExecSchemaDefinition, value: unknown): SchemaValidationResult {
      if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return Object.freeze({ valid: false, issues: Object.freeze(['A structured value is required.']) })
      }
      const candidate = value as Record<string, unknown>
      if (candidate.schemaId !== schema.reference.schemaId
        || candidate.schemaVersion !== schema.reference.version) {
        return Object.freeze({ valid: false, issues: Object.freeze(['Schema identity is invalid.']) })
      }
      if (schema.reference === definitions.payload.reference) {
        const data = candidate.data
        if (candidate.capabilityId !== 'capability-001'
          || !data || typeof data !== 'object' || Array.isArray(data)
          || typeof (data as Record<string, unknown>).result !== 'string'
          || !(data as Record<string, unknown>).result) {
          return Object.freeze({ valid: false, issues: Object.freeze(['Capability payload is invalid.']) })
        }
      }
      return this.issueValidatedResult({
        valid: true as const,
        issues: Object.freeze([]),
        validatedInput: value,
        schemaReference: schema.reference,
        contentFingerprint: structuredContentFingerprint(value),
      })
    }
  }

  const adapter = new IndependentSchemaAdapter()
  const result = new ValidateExecContract(adapter).validate(input)
  assert.equal(result.status, 'VALID')

  const invalid = new ValidateExecContract(adapter).validate({
    ...input,
    payload: {
      ...(input.payload as Record<string, unknown>),
      data: { unrelated: true },
    },
  })
  assert.equal(invalid.status, 'INVALID')
  if (invalid.status === 'INVALID') assert.equal(invalid.failure.code, 'CONTRACT_INVALID')

  const copiedAdapter = Object.create(adapter) as ExecSchemaValidationPort
  const copiedResult = new ValidateExecContract(copiedAdapter).validate(input)
  assert.equal(copiedResult.status, 'INVALID')
  if (copiedResult.status === 'INVALID') assert.equal(copiedResult.failure.code, 'CONTRACT_INVALID')
})

test('rejects an untrusted wrapper even when it transports a genuine result', () => {
  const canonicalAdapter = new JsonSchemaExecValidator()
  const untrustedWrapper: ExecSchemaValidationPort = {
    validate: (schema, value) => canonicalAdapter.validate(schema, value),
  }
  const result = new ValidateExecContract(untrustedWrapper).validate(validInput())
  assert.equal(result.status, 'INVALID')
  if (result.status === 'INVALID') {
    assert.equal(result.failure.code, 'CONTRACT_INVALID')
    assert.equal(result.failure.noApproval, true)
    assert.equal(result.failure.noCheckpoint, true)
    assert.equal(result.failure.noEffect, true)
  }
})

test('rejects caller-supplied evidence before infrastructure bootstrap', async () => {
  const script = String.raw`
    const { ValidateExecContract } = await import('./src/application/exec-contract.ts')
    const { structuredContentFingerprint } = await import('./src/domain/exec-contract.ts')
    const input = {
      envelope: {
        schemaId: 'exec-envelope',
        schemaVersion: '1.0.0',
        contractVersion: '1.0.0',
        executionId: 'execution-cold-start',
        activityId: 'activity-cold-start',
        agentAssignmentId: 'assignment-cold-start',
        artifactCycleId: 'cycle-cold-start',
        attemptId: 'attempt-cold-start',
        executionRound: 'round-cold-start',
        executionStatus: 'COMPLETED',
        functionalVerdict: 'PASS',
        checkpoints: [],
        artifacts: [],
        evidence: [],
        findings: [],
        requestedEffects: [],
        errors: [],
      },
      payload: {
        schemaId: 'exec-capability-001-payload',
        schemaVersion: '1.0.0',
        capabilityId: 'capability-001',
        data: { result: 'structured' },
      },
    }
    const callerVerifier = { isCanonicalValidationResult: () => true }
    const callerPort = {
      validate: (schema, value) => {
        const result = {
          valid: true,
          issues: Object.freeze([]),
          validatedInput: value,
          schemaReference: schema.reference,
          contentFingerprint: structuredContentFingerprint(value),
        }
        Object.defineProperty(result, 'canonicalResultType', {
          configurable: false,
          enumerable: false,
          writable: false,
          value: callerVerifier,
        })
        return Object.freeze(result)
      },
    }
    const result = new ValidateExecContract(callerPort).validate(input)
    if (result.status !== 'INVALID') process.exit(1)
    console.log(result.status)
  `
  const { stdout } = await execFileAsync(
    process.execPath,
    ['--import', 'tsx', '--input-type=module', '-e', script],
    { cwd: resolve('.'), encoding: 'utf8' },
  )
  assert.equal(stdout.trim(), 'INVALID')
})

test('rejects a caller-created always-true subtype at the owner-proof boundary', () => {
  class AlwaysTrueCallerAdapter extends JsonSchemaExecValidator {
    validate(_schema: ExecSchemaDefinition, value: unknown): SchemaValidationResult {
      return Object.freeze({
        valid: true as const,
        issues: Object.freeze([]),
        validatedInput: value as object,
        schemaReference: new ExecContractSchemaDefinitions().payload.reference,
        contentFingerprint: structuredContentFingerprint(value),
      })
    }
  }

  const adapter = new AlwaysTrueCallerAdapter()
  const validInputResult = new ValidateExecContract(adapter).validate(validInput())
  assert.equal(validInputResult.status, 'INVALID')
  if (validInputResult.status === 'INVALID') {
    assert.equal(validInputResult.failure.noApproval, true)
    assert.equal(validInputResult.failure.noCheckpoint, true)
    assert.equal(validInputResult.failure.noEffect, true)
    assert.equal('value' in validInputResult, false)
  }

  const genericInvalidResult = new ValidateExecContract(adapter).validate({
    ...validInput(),
    payload: {
      ...(validInput().payload as Record<string, unknown>),
      data: { unrelated: true },
    },
  })
  assert.equal(genericInvalidResult.status, 'INVALID')
  if (genericInvalidResult.status === 'INVALID') {
    assert.equal(genericInvalidResult.failure.code, 'CONTRACT_INVALID')
    assert.equal(genericInvalidResult.failure.noApproval, true)
    assert.equal(genericInvalidResult.failure.noCheckpoint, true)
    assert.equal(genericInvalidResult.failure.noEffect, true)
    assert.equal('value' in genericInvalidResult, false)
  }

  const unknownCapabilityPayload = {
    ...(validInput().payload as Record<string, unknown>),
    capabilityId: 'capability-unknown',
  }
  const forgedUnknownCapability = adapter.validate(
    new ExecContractSchemaDefinitions().payload,
    unknownCapabilityPayload,
  )
  assert.equal(forgedUnknownCapability.valid, true)
  assert.throws(
    () => StructuredCapabilityPayload.create(
      unknownCapabilityPayload as never,
      new ExecContractSchemaDefinitions().payload.reference,
      forgedUnknownCapability,
      adapter,
    ),
    /authenticated successful schema validation result/,
  )
})

test('keeps the authenticated producer contract explicit and non-self-describing', async () => {
  assert.equal('registerExecValidationAuthority' in execContractDomain, false)
  assert.equal('recordExecSchemaValidation' in execContractDomain, false)
  const validationEvidenceModule = await import('../src/domain/exec-validation-evidence-internal.ts')
  const schemaModule = await import('../src/domain/exec-schema.ts')
  assert.equal('AuthenticatedExecSchemaValidationPort' in schemaModule, true)
  assert.equal('isAuthenticatedExecSchemaValidationPort' in schemaModule, true)
  assert.equal('AuthenticatedExecSchemaValidationPort' in validationEvidenceModule, true)
  assert.equal('default' in validationEvidenceModule, false)
  assert.equal('registerIssuedSchemaValidationEvidence' in validationEvidenceModule, false)
  assert.equal('issueSchemaValidationEvidence' in validationEvidenceModule, false)
  assert.equal('registerSchemaValidationAdapter' in validationEvidenceModule, false)
  assert.equal('recordCanonicalValidationEvidence' in validationEvidenceModule, false)
  assert.equal('recordEvidenceAfterCanonicalValidation' in validationEvidenceModule, false)

  const definitions = new ExecContractSchemaDefinitions()
  const adapter = new JsonSchemaExecValidator()
  class CallerCreatedValidator extends JsonSchemaExecValidator {}
  const callerCreatedValidator = new CallerCreatedValidator()
  const callerCreatedValidation = callerCreatedValidator.validate(definitions.envelope, validInput().envelope)
  assert.equal(callerCreatedValidation.valid, true)
  const input = validInput()
  const validation = adapter.validate(definitions.envelope, input.envelope)
  assert.equal(validation.valid, true)
  if (!validation.valid) return
  assert.equal(validation.validatedInput, input.envelope)
  assert.equal(validation.schemaReference, definitions.envelope.reference)
  ;(input.envelope as Record<string, unknown>).contractVersion = ' 1.0.0 '
  const postMutationValidation = adapter.validate(definitions.envelope, input.envelope)
  assert.equal(postMutationValidation.valid, false)

  assert.throws(
    () => StructuredExecutionEnvelope.create(
      input.envelope as never,
      definitions.envelope.reference,
    ),
    /authenticated successful schema validation result/,
  )
})

test('rejects forged validation results and runtime-created canonical-looking references', () => {
  const definitions = new ExecContractSchemaDefinitions()
  const input = validInput()
  const forgedResult = (schema: SchemaReference, value: object) => ({
    valid: true as const,
    issues: [] as readonly string[],
    validatedInput: value,
    schemaReference: schema,
    contentFingerprint: structuredContentFingerprint(value),
  })

  assert.throws(
    () => StructuredExecutionEnvelope.create(
      input.envelope as never,
      definitions.envelope.reference,
      forgedResult(definitions.envelope.reference, input.envelope as object),
    ),
    /authenticated successful schema validation result/,
  )
  assert.throws(
    () => StructuredCapabilityPayload.create(
      input.payload as never,
      definitions.payload.reference,
      forgedResult(definitions.payload.reference, input.payload as object),
    ),
    /authenticated successful schema validation result/,
  )

  class CanonicalSchemaValidationEvidence {
    isCanonicalEvidence(): boolean {
      return true
    }
  }
  const exactNamedResult = Object.assign(
    forgedResult(definitions.envelope.reference, input.envelope as object),
    { evidenceType: CanonicalSchemaValidationEvidence },
  )
  assert.throws(
    () => StructuredExecutionEnvelope.create(
      input.envelope as never,
      definitions.envelope.reference,
      exactNamedResult,
      new JsonSchemaExecValidator(),
    ),
    /authenticated successful schema validation result/,
  )

  class CallerOwnedVerifier {
    isCanonicalValidationResult(): boolean {
      return true
    }
  }
  const callerOwnedSelfDescribingResult = (
    schema: SchemaReference,
    value: unknown,
  ): SchemaValidationResult => {
    const result = {
      valid: true as const,
      issues: Object.freeze([] as readonly string[]),
      validatedInput: value as object,
      schemaReference: schema,
      contentFingerprint: structuredContentFingerprint(value),
    }
    Object.defineProperty(result, 'canonicalResultType', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: CallerOwnedVerifier,
    })
    return Object.freeze(result)
  }
  const callerOwnedResult = new ValidateExecContract({
    validate: (schema, value) => callerOwnedSelfDescribingResult(schema.reference, value),
  }).validate(input)
  assert.equal(callerOwnedResult.status, 'INVALID')
  if (callerOwnedResult.status === 'INVALID') {
    assert.equal(callerOwnedResult.failure.code, 'CONTRACT_INVALID')
    assert.equal(callerOwnedResult.failure.noApproval, true)
    assert.equal(callerOwnedResult.failure.noCheckpoint, true)
    assert.equal(callerOwnedResult.failure.noEffect, true)
    assert.equal('value' in callerOwnedResult, false)
  }

  assert.throws(
    () => StructuredExecutionEnvelope.create(
      input.envelope as never,
      definitions.envelope.reference,
      callerOwnedSelfDescribingResult(definitions.envelope.reference, input.envelope),
      new JsonSchemaExecValidator(),
    ),
    /authenticated successful schema validation result/,
  )

  const callerOwnedPrototypeResult = Object.assign(
    Object.create(CallerOwnedVerifier.prototype),
    forgedResult(definitions.envelope.reference, input.envelope as object),
  )
  Object.defineProperty(callerOwnedPrototypeResult, 'canonicalResultType', {
    configurable: false,
    enumerable: false,
    writable: false,
    value: CallerOwnedVerifier,
  })
  Object.freeze(callerOwnedPrototypeResult)
  assert.throws(
    () => StructuredExecutionEnvelope.create(
      input.envelope as never,
      definitions.envelope.reference,
      callerOwnedPrototypeResult,
      new JsonSchemaExecValidator(),
    ),
    /authenticated successful schema validation result/,
  )

  assert.throws(
    () => new (SchemaReference as unknown as new (...args: unknown[]) => unknown)('exec-envelope', '1.0.0'),
    /restricted to the contract boundary/,
  )
  const runtimeCreatedReference = SchemaReference.create({ schemaId: 'exec-envelope', version: '1.0.0' })
  assert.notEqual(runtimeCreatedReference, definitions.envelope.reference)
  assert.throws(
    () => StructuredExecutionEnvelope.create(
      input.envelope as never,
      runtimeCreatedReference,
      forgedResult(runtimeCreatedReference, input.envelope as object),
    ),
    /ticket-owned envelope schema reference/,
  )

  const genuineValidation = new JsonSchemaExecValidator().validate(
    definitions.envelope,
    input.envelope,
  )
  assert.equal(genuineValidation.valid, true)
  if (genuineValidation.valid) {
    const copiedValidation = Object.assign(
      Object.create(Object.getPrototypeOf(genuineValidation)),
      genuineValidation,
    )
    Object.defineProperty(copiedValidation, 'canonicalResultType', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: (genuineValidation as unknown as { readonly canonicalResultType: unknown }).canonicalResultType,
    })
    Object.freeze(copiedValidation)
    assert.throws(
      () => StructuredExecutionEnvelope.create(
        input.envelope as never,
        definitions.envelope.reference,
        copiedValidation,
        new JsonSchemaExecValidator(),
      ),
      /authenticated successful schema validation result/,
    )
  }

  const forgedPort: ExecSchemaValidationPort = {
    validate: (schema, value) => ({ ...forgedResult(schema.reference, value as object), contentFingerprint: structuredContentFingerprint(value) }),
  }
  const result = new ValidateExecContract(forgedPort).validate(input)
  assert.equal(result.status, 'INVALID')
  if (result.status !== 'INVALID') return
  assert.equal(result.failure.code, 'CONTRACT_INVALID')
  assert.equal('value' in result, false)
  assert.equal(result.failure.noApproval, true)
  assert.equal(result.failure.noCheckpoint, true)
  assert.equal(result.failure.noEffect, true)

  const copiedAdapter = Object.create(new JsonSchemaExecValidator()) as ExecSchemaValidationPort
  const copiedResult = new ValidateExecContract(copiedAdapter).validate(input)
  assert.equal(copiedResult.status, 'INVALID')
  if (copiedResult.status === 'INVALID') assert.equal(copiedResult.failure.code, 'CONTRACT_INVALID')

  const callerDefinedResult = new ValidateExecContract({
    validate: (schema, value) => Object.assign(
      forgedResult(schema.reference, value as object),
      { evidenceType: CanonicalSchemaValidationEvidence },
    ) as never,
  }).validate(input)
  assert.equal(callerDefinedResult.status, 'INVALID')
  if (callerDefinedResult.status === 'INVALID') {
    assert.equal(callerDefinedResult.failure.code, 'CONTRACT_INVALID')
    assert.equal('value' in callerDefinedResult, false)
  }
})

test('rejects stale genuine evidence after envelope or payload current-content mutation', () => {
  const input = validInput()
  const envelope = input.envelope as Record<string, unknown>
  const payload = input.payload as Record<string, unknown>
  const definitions = new ExecContractSchemaDefinitions()
  const adapter = new JsonSchemaExecValidator()
  const envelopeValidation = adapter.validate(definitions.envelope, envelope)
  const payloadValidation = adapter.validate(definitions.payload, payload)
  assert.equal(envelopeValidation.valid, true)
  assert.equal(payloadValidation.valid, true)
  if (!envelopeValidation.valid || !payloadValidation.valid) return

  class StaleReceiptAdapter extends AuthenticatedExecSchemaValidationPort {
    constructor() {
      super()
    }

    validate(schema: ExecSchemaDefinition, value: unknown): SchemaValidationResult {
      const receipt = schema.reference === definitions.envelope.reference
        ? envelopeValidation
        : payloadValidation
      if (!receipt.valid) return receipt
      return this.issueValidatedResult({
        valid: true as const,
        issues: receipt.issues,
        validatedInput: receipt.validatedInput,
        schemaReference: receipt.schemaReference,
        contentFingerprint: receipt.contentFingerprint,
      })
    }
  }

  const stalePort: ExecSchemaValidationPort = new StaleReceiptAdapter()
  const control = new ValidateExecContract(stalePort).validate(input)
  assert.equal(control.status, 'VALID')
  const originalExecutionId = Object.getOwnPropertyDescriptor(Object.prototype, 'executionId')
  const originalData = Object.getOwnPropertyDescriptor(Object.prototype, 'data')
  try {
    envelope.executionId = 'mutated-but-schema-valid'
    const staleValidEnvelope = new ValidateExecContract(stalePort).validate(input)
    assert.equal(staleValidEnvelope.status, 'INVALID')
    if (staleValidEnvelope.status === 'INVALID') {
      assert.equal(staleValidEnvelope.failure.noApproval, true)
      assert.equal(staleValidEnvelope.failure.noCheckpoint, true)
      assert.equal(staleValidEnvelope.failure.noEffect, true)
      assert.equal('value' in staleValidEnvelope, false)
    }
    envelope.executionId = 'execution-001'

    delete envelope.executionId
    Object.defineProperty(Object.prototype, 'executionId', {
      configurable: true,
      enumerable: false,
      writable: true,
      value: 'inherited-forgery',
    })
    const staleEnvelope = new ValidateExecContract(stalePort).validate(input)
    assert.equal(staleEnvelope.status, 'INVALID')
    if (staleEnvelope.status === 'INVALID') {
      assert.equal(staleEnvelope.failure.code, 'CONTRACT_INVALID')
      assert.equal(staleEnvelope.failure.noApproval, true)
      assert.equal(staleEnvelope.failure.noCheckpoint, true)
      assert.equal(staleEnvelope.failure.noEffect, true)
    }

    Object.defineProperty(envelope, 'executionId', {
      configurable: true,
      enumerable: true,
      writable: true,
      value: 'execution-001',
    })
    payload.data = { changed: true }
    const staleValidPayload = new ValidateExecContract(stalePort).validate(input)
    assert.equal(staleValidPayload.status, 'INVALID')
    if (staleValidPayload.status === 'INVALID') {
      assert.equal(staleValidPayload.failure.noApproval, true)
      assert.equal(staleValidPayload.failure.noCheckpoint, true)
      assert.equal(staleValidPayload.failure.noEffect, true)
      assert.equal('value' in staleValidPayload, false)
    }
    payload.data = { result: 'structured' }

    delete payload.data
    Object.defineProperty(Object.prototype, 'data', {
      configurable: true,
      enumerable: false,
      writable: true,
      value: { inherited: true },
    })
    const stalePayload = new ValidateExecContract(stalePort).validate(input)
    assert.equal(stalePayload.status, 'INVALID')
    if (stalePayload.status === 'INVALID') {
      assert.equal(stalePayload.failure.code, 'CONTRACT_INVALID')
      assert.equal(stalePayload.failure.noApproval, true)
      assert.equal(stalePayload.failure.noCheckpoint, true)
      assert.equal(stalePayload.failure.noEffect, true)
    }
  } finally {
    if (originalExecutionId) Object.defineProperty(Object.prototype, 'executionId', originalExecutionId)
    else delete (Object.prototype as Record<string, unknown>).executionId
    if (originalData) Object.defineProperty(Object.prototype, 'data', originalData)
    else delete (Object.prototype as Record<string, unknown>).data
    Object.defineProperty(envelope, 'executionId', {
      configurable: true,
      enumerable: true,
      writable: true,
      value: 'execution-001',
    })
    Object.defineProperty(payload, 'data', {
      configurable: true,
      enumerable: true,
      writable: true,
      value: { result: 'structured' },
    })
  }
})

test('normalizes malformed adapter results and thrown values to fail-closed results', () => {
  const malformedResultValidator: ExecSchemaValidationPort = {
    validate: () => ({ valid: 'false', issues: [] } as never),
  }
  const malformedResult = new ValidateExecContract(malformedResultValidator).validate(validInput())
  assert.equal(malformedResult.status, 'INVALID')
  assertFailureEvidence(malformedResult)

  const malformedErrorValidator: ExecSchemaValidationPort = {
    validate: () => {
      throw { message: 42 }
    },
  }
  const malformedError = new ValidateExecContract(malformedErrorValidator).validate(validInput())
  assert.equal(malformedError.status, 'INVALID')
  if (malformedError.status !== 'INVALID') return
  assert.equal(malformedError.failure.code, 'CONTRACT_INVALID')
  assert.equal(malformedError.failure.noApproval, true)
  assert.equal(malformedError.failure.noCheckpoint, true)
  assert.equal(malformedError.failure.noEffect, true)
  assert.equal('value' in malformedError, false)
  assertFailureEvidence(malformedError)
})

test('rejects semver leading zeroes without resolving supported versions', () => {
  const input = validInput()
  const envelope = {
    ...(input.envelope as Record<string, unknown>),
    contractVersion: '01.0.0',
  }
  const result = createDefaultValidator().validate({ ...input, envelope })

  assert.equal(result.status, 'INVALID')
  if (result.status !== 'INVALID') return
  assert.equal(result.failure.code, 'CONTRACT_INVALID')
  assert.match(result.failure.issues.join(' '), /contractVersion/)
  assertFailureEvidence(result)
})

test('domain construction rejects alternate schemas and runtime constructor bypasses', () => {
  const input = validInput()
  const attackerEnvelopeSchema = SchemaReference.create({ schemaId: 'attacker-envelope', version: '9.9.9' })
  const attackerPayloadSchema = SchemaReference.create({ schemaId: 'attacker-payload', version: '9.9.9' })
  assert.throws(
    () => StructuredExecutionEnvelope.create(input.envelope as never, attackerEnvelopeSchema),
    /ticket-owned envelope schema reference/,
  )
  assert.throws(
    () => StructuredCapabilityPayload.create(input.payload as never, attackerPayloadSchema),
    /ticket-owned payload schema reference/,
  )
  assert.throws(
    () => ValidatedExecContract.create({} as never, {} as never),
    /validated envelope and payload/,
  )

  const canonicalDefinitions = new ExecContractSchemaDefinitions()
  const canonicalEnvelopeSchema = canonicalDefinitions.envelope.reference
  const canonicalPayloadSchema = canonicalDefinitions.payload.reference
  assert.throws(
    () => StructuredExecutionEnvelope.create(input.envelope as never, canonicalEnvelopeSchema),
    /authenticated successful schema validation result/,
  )
  assert.throws(
    () => StructuredCapabilityPayload.create(input.payload as never, canonicalPayloadSchema),
    /authenticated successful schema validation result/,
  )

  const canonicalValidator = new JsonSchemaExecValidator()
  const envelopeValidation = canonicalValidator.validate(canonicalDefinitions.envelope, input.envelope)
  const payloadValidation = canonicalValidator.validate(canonicalDefinitions.payload, input.payload)
  assert.equal(envelopeValidation.valid, true)
  assert.equal(payloadValidation.valid, true)
  assert.doesNotThrow(() => StructuredExecutionEnvelope.create(
    input.envelope as never,
    canonicalEnvelopeSchema,
    envelopeValidation,
    canonicalValidator,
  ))
  assert.doesNotThrow(() => StructuredCapabilityPayload.create(
    input.payload as never,
    canonicalPayloadSchema,
    payloadValidation,
    canonicalValidator,
  ))

  assert.throws(
    () => new (StructuredExecutionEnvelope as unknown as new (...args: unknown[]) => unknown)(input.envelope, canonicalEnvelopeSchema),
    /restricted to the contract boundary/,
  )
  assert.throws(
    () => new (StructuredCapabilityPayload as unknown as new (...args: unknown[]) => unknown)(input.payload, canonicalPayloadSchema),
    /restricted to the contract boundary/,
  )
  assert.throws(
    () => new (ValidatedExecContract as unknown as new (...args: unknown[]) => unknown)({}, {}),
    /restricted to the contract boundary/,
  )

  const invalidEnvelope = { ...(input.envelope as Record<string, unknown>), contractVersion: ' 1.0.0 ' }
  assert.throws(
    () => StructuredExecutionEnvelope.create(invalidEnvelope as never, canonicalEnvelopeSchema),
    /authenticated successful schema validation result/,
  )

  const result = createDefaultValidator().validate(validInput())
  assert.equal(result.status, 'VALID')
  if (result.status !== 'VALID') return
  const inheritedEnvelope = Object.create(result.value.envelope as object)
  assert.throws(
    () => ValidatedExecContract.create(inheritedEnvelope, result.value.payload),
    /validated envelope and payload/,
  )
})

test('rejects text-only and malformed input as CONTRACT_INVALID without success signals', () => {
  const result = createDefaultValidator().validate({
    envelope: 'approved by text',
    payload: 'done',
    humanText: 'approved',
  })

  assert.equal(result.status, 'INVALID')
  if (result.status !== 'INVALID') return
  assert.equal(result.failure.code, 'CONTRACT_INVALID')
  assert.equal(result.failure.noApproval, true)
  assert.equal(result.failure.noCheckpoint, true)
  assert.equal(result.failure.noEffect, true)
  assertFailureEvidence(result)
  assert.equal(result.failure.observedContractReference.envelope.present, false)
  assert.equal(result.failure.observedContractReference.payload.present, false)
})

test('rejects missing structured fields and never infers them from human text', () => {
  const input = validInput()
  const envelope = { ...(input.envelope as Record<string, unknown>) }
  delete envelope.functionalVerdict
  const result = createDefaultValidator().validate({
    ...input,
    envelope,
    humanText: 'functional verdict: PASS',
  })

  assert.equal(result.status, 'INVALID')
  if (result.status !== 'INVALID') return
  assert.equal(result.failure.code, 'CONTRACT_INVALID')
  assert.match(result.failure.issues.join(' '), /functionalVerdict/)
  assertFailureEvidence(result)
  assert.equal(result.failure.observedContractReference.envelope.schemaId, 'exec-envelope')
})

test('requires both sides of the pair and does not expose a partial validated result', () => {
  const input = validInput()
  const payload = { ...(input.payload as Record<string, unknown>) }
  delete payload.data
  const result = createDefaultValidator().validate({ ...input, payload })

  assert.equal(result.status, 'INVALID')
  assert.equal('value' in result, false)
  assertFailureEvidence(result)
})

test('rejects non-JSON and inherited values at the schema boundary', () => {
  const input = validInput()
  const inheritedEnvelope = Object.assign(Object.create({ executionId: 'inherited-execution' }), input.envelope)
  delete inheritedEnvelope.executionId
  const inheritedEnvelopeValidation = new JsonSchemaExecValidator().validate(
    new ExecContractSchemaDefinitions().envelope,
    inheritedEnvelope,
  )
  assert.equal(inheritedEnvelopeValidation.valid, false)
  const inheritedEnvelopeResult = createDefaultValidator().validate({ ...input, envelope: inheritedEnvelope })
  assert.equal(inheritedEnvelopeResult.status, 'INVALID')

  const inheritedPayload = Object.assign(Object.create({ data: { forged: true } }), input.payload)
  delete inheritedPayload.data
  const inheritedPayloadValidation = new JsonSchemaExecValidator().validate(
    new ExecContractSchemaDefinitions().payload,
    inheritedPayload,
  )
  assert.equal(inheritedPayloadValidation.valid, false)
  const inheritedPayloadResult = createDefaultValidator().validate({ ...input, payload: inheritedPayload })
  assert.equal(inheritedPayloadResult.status, 'INVALID')

  const originalExecutionId = Object.getOwnPropertyDescriptor(Object.prototype, 'executionId')
  const originalData = Object.getOwnPropertyDescriptor(Object.prototype, 'data')
  try {
    Object.defineProperty(Object.prototype, 'executionId', {
      configurable: true,
      enumerable: false,
      writable: true,
      value: 'prototype-execution',
    })
    const objectPrototypeEnvelope = { ...(input.envelope as Record<string, unknown>) }
    delete objectPrototypeEnvelope.executionId
    const objectPrototypeEnvelopeResult = createDefaultValidator().validate({
      ...input,
      envelope: objectPrototypeEnvelope,
    })
    assert.equal(objectPrototypeEnvelopeResult.status, 'INVALID')

    Object.defineProperty(Object.prototype, 'data', {
      configurable: true,
      enumerable: false,
      writable: true,
      value: { forged: true },
    })
    const objectPrototypePayload = { ...(input.payload as Record<string, unknown>) }
    delete objectPrototypePayload.data
    const objectPrototypePayloadResult = createDefaultValidator().validate({
      ...input,
      payload: objectPrototypePayload,
    })
    assert.equal(objectPrototypePayloadResult.status, 'INVALID')
  } finally {
    if (originalExecutionId) Object.defineProperty(Object.prototype, 'executionId', originalExecutionId)
    else delete (Object.prototype as Record<string, unknown>).executionId
    if (originalData) Object.defineProperty(Object.prototype, 'data', originalData)
    else delete (Object.prototype as Record<string, unknown>).data
  }

  const bigintEnvelope = {
    ...(input.envelope as Record<string, unknown>),
    evidence: [{ value: 1n }],
  }
  const bigintResult = createDefaultValidator().validate({ ...input, envelope: bigintEnvelope })
  assert.equal(bigintResult.status, 'INVALID')

  const functionPayload = {
    ...(input.payload as Record<string, unknown>),
    data: { execute: () => true },
  }
  const functionResult = createDefaultValidator().validate({ ...input, payload: functionPayload })
  assert.equal(functionResult.status, 'INVALID')
})

test('preserves own __proto__ keys and rejects sparse arrays at the value boundary', () => {
  const input = validInput()
  const data = JSON.parse('{"__proto__":{"nested":"preserved"},"result":"structured"}') as Record<string, unknown>
  const preserved = createDefaultValidator().validate({
    ...input,
    payload: { ...(input.payload as Record<string, unknown>), data },
  })
  assert.equal(preserved.status, 'VALID')
  if (preserved.status === 'VALID') {
    assert.equal(Object.prototype.hasOwnProperty.call(preserved.value.payload.data, '__proto__'), true)
    assert.deepEqual(preserved.value.payload.data['__proto__'], { nested: 'preserved' })
    assert.equal(Object.getPrototypeOf(preserved.value.payload.data), Object.prototype)
  }

  const sparseEvidence: unknown[] = []
  sparseEvidence.length = 2
  sparseEvidence[1] = { kind: 'sparse' }
  const sparse = createDefaultValidator().validate({
    ...input,
    envelope: { ...(input.envelope as Record<string, unknown>), evidence: sparseEvidence },
  })
  assert.equal(sparse.status, 'INVALID')
  if (sparse.status === 'INVALID') {
    assertFailureEvidence(sparse)
    assert.match(sparse.failure.issues.join(' '), /sparse holes/)
  }

  const nonCanonicalIndex: unknown[] = [{ kind: 'value' }]
  Object.defineProperty(nonCanonicalIndex, '01', { enumerable: true, value: { kind: 'lost' } })
  const nonCanonical = createDefaultValidator().validate({
    ...input,
    envelope: { ...(input.envelope as Record<string, unknown>), evidence: nonCanonicalIndex },
  })
  assert.equal(nonCanonical.status, 'INVALID')
  if (nonCanonical.status === 'INVALID') assertFailureEvidence(nonCanonical)
})

test('returns immutable structured values and guards the complete productive import graph', () => {
  const result = createDefaultValidator().validate(validInput())
  assert.equal(result.status, 'VALID')
  if (result.status !== 'VALID') return

  assert.equal(Object.isFrozen(result.value), true)
  assert.equal(Object.isFrozen(result.value.envelope), true)
  assert.equal(Object.isFrozen(result.value.payload), true)
  assert.equal(Object.isFrozen(result.value.payload.data), true)

  const forbiddenSpecifier = /(?:prototype|\.pi|filesystem|http|react|vite|database)/i
  const sourceFiles = new Set<string>()
  const visit = (sourceFile: string): void => {
    if (sourceFiles.has(sourceFile)) return
    sourceFiles.add(sourceFile)
    const content = readFileSync(sourceFile, 'utf8')
    for (const specifier of extractImportSpecifiers(content)) {
      assert.doesNotMatch(specifier, forbiddenSpecifier, `${sourceFile}: ${specifier}`)
      if (!specifier.startsWith('.')) {
        assert.equal(
          sourceFile.endsWith(resolve('src/infrastructure/exec-schema-validator.ts')),
          true,
          `unexpected bare productive dependency: ${specifier}`,
        )
        assert.match(specifier, /^typebox(?:\/|$)/, `unapproved bare productive dependency: ${specifier}`)
        continue
      }
      const imported = resolve(dirname(sourceFile), specifier)
      const candidates = [imported, `${imported}.ts`, `${imported}.js`]
      const withExtension = candidates.find((candidate) => existsSync(candidate))
      assert.ok(withExtension, `productive import is missing: ${imported}`)
      assert.ok(withExtension.startsWith(resolve('src')), `productive import escapes src: ${withExtension}`)
      visit(withExtension)
    }
  }
  assert.deepEqual(
    extractImportSpecifiers("import 'prototype/forbidden.ts'; const x = require('prototype/forbidden.ts'); import('./src-safe.ts')"),
    ['prototype/forbidden.ts', 'prototype/forbidden.ts', './src-safe.ts'],
  )
  visit(resolve('src/composition/exec-contract.ts'))
  assert.deepEqual(
    [...sourceFiles].sort(),
    [
      resolve('src/application/exec-contract.ts'),
      resolve('src/composition/exec-contract.ts'),
      resolve('src/domain/exec-contract.ts'),
      resolve('src/domain/exec-schema.ts'),
      resolve('src/domain/exec-validation-evidence-internal.ts'),
      resolve('src/infrastructure/exec-schema-validator.ts'),
    ].sort(),
  )
})

async function initializeGenericConsumerFixture(): Promise<{ root: string; cleanup: () => Promise<void> }> {
  const root = await mkdtemp(join(os.tmpdir(), 'exec-001-generic-consumer-'))
  const runGit = async (...args: string[]): Promise<void> => {
    await execFileAsync('git', args, { cwd: root, encoding: 'utf8' })
  }

  await runGit('init', '-q')
  await runGit('config', 'user.email', 'test@example.invalid')
  await runGit('config', 'user.name', 'EXEC ticket test')
  await mkdir(join(root, 'skills', 'generate-component-spec-from-portfolio'), { recursive: true })
  await mkdir(join(root, '.pi', 'agents'), { recursive: true })
  await writeFile(join(root, 'skills', 'generate-component-spec-from-portfolio', 'SKILL.md'), '---\nname: generate-component-spec-from-portfolio\n---\n')
  await writeFile(join(root, '.pi', 'agents', 'workflow-controller.md'), '---\nname: workflow-controller\n---\n')
  await writeFile(join(root, '.pi', 'agents', 'workflow-skill-executor.md'), '---\nname: workflow-skill-executor\n---\n')
  await writeFile(join(root, 'authority.md'), 'APPROVED\n')
  await runGit('add', '.')
  await runGit('commit', '-qm', 'generic consumer fixture')

  return { root, cleanup: () => rm(root, { recursive: true, force: true }) }
}

function genericConsumerPlan(): WorkflowPlan {
  return {
    decision: 'EXECUTE',
    operation: 'generate-component-spec-from-portfolio',
    subject: 'SPEC-EXEC-001',
    reason: 'A selected operation is authorized for this consumer-boundary regression.',
    authorityFiles: ['skills/generate-component-spec-from-portfolio/SKILL.md'],
    evidenceFiles: ['authority.md'],
    stateFingerprint: 'consumer-test-before',
    executionIsolation: 'main',
    operationInputJson: '{}',
  }
}

test('generic delegation consumer never promotes text-only output to canonical completion or effects', async () => {
  const fixture = await initializeGenericConsumerFixture()
  try {
    const operationValues: unknown[] = []
    const delegate = async (request: DelegationRequest): Promise<DelegationResult> => {
      if (request.agent === 'workflow-controller') {
        return { status: 'completed', value: genericConsumerPlan() }
      }
      operationValues.push('APPROVED; checkpoint confirmed; effect authorized')
      return {
        status: 'completed',
        value: 'APPROVED; checkpoint confirmed; effect authorized',
      }
    }

    await assert.rejects(
      runFullWorkflow(
        { objective: 'Exercise generic consumer text handling', maxSteps: 1 },
        { root: fixture.root, delegate },
      ),
      (error: unknown) => error instanceof OrchestrationStop && error.code === 'INCOMPLETE_CANONICAL_RESULT',
    )
    assert.deepEqual(operationValues, ['APPROVED; checkpoint confirmed; effect authorized'])
    assert.equal(existsSync(join(fixture.root, 'generated-spec.md')), false)
  } finally {
    await fixture.cleanup()
  }
})
