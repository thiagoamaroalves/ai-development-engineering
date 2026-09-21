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
  StructuredCapabilityPayload,
  StructuredExecutionEnvelope,
  ValidatedExecContract,
} from '../src/domain/exec-contract.ts'
import {
  ExecContractSchemaDefinitions,
  type ExecSchemaValidationPort,
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
      schemaId: 'exec-capability-payload',
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
  assert.equal(result.failure.expectedContractReference.value.payload.schemaId, 'exec-capability-payload')
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
  assert.equal(result.value.payload.schema.value, 'exec-capability-payload@1.0.0')
  assert.equal(result.value.payload.data.result, 'structured')
})

test('preserves opaque identity references without normalization', () => {
  const input = validInput()
  const envelope = {
    ...(input.envelope as Record<string, unknown>),
    executionId: '  execution-opaque  ',
    activityId: ' activity-opaque ',
  }
  const payload = {
    ...(input.payload as Record<string, unknown>),
    capabilityId: ' capability-opaque ',
  }
  const result = createDefaultValidator().validate({ ...input, envelope, payload })
  assert.equal(result.status, 'VALID')
  if (result.status !== 'VALID') return
  assert.equal(result.value.envelope.executionId, '  execution-opaque  ')
  assert.equal(result.value.envelope.activityId, ' activity-opaque ')
  assert.equal(result.value.payload.capabilityId, ' capability-opaque ')
  assert.equal(result.value.envelope.structured.executionId, '  execution-opaque  ')
  assert.equal(result.value.payload.structured.capabilityId, ' capability-opaque ')
})

test('uses canonical JSON Schema documents through the compiled validation adapter', () => {
  const definitions = new ExecContractSchemaDefinitions()
  assert.equal(definitions.envelope.document.$schema, 'https://json-schema.org/draft/2020-12/schema')
  assert.equal(definitions.envelope.document.$id, 'exec-envelope@1.0.0')
  assert.equal(definitions.payload.document.$id, 'exec-capability-payload@1.0.0')
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
  assert.ok(firstAdapterResult.evidence)
  assert.equal(firstAdapterResult.evidence?.validatedInput, input.envelope)
  assert.equal(firstAdapterResult.evidence?.schemaReference, new ExecContractSchemaDefinitions().envelope.reference)
})

test('rejects caller-selected schema authority at the production boundary', () => {
  const input = validInput()
  const permissiveValidator: ExecSchemaValidationPort = {
    validate: () => ({ valid: true, issues: [] }),
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

test('rejects an always-true adapter when the structured input is invalid or unproven', () => {
  const forgedValidator: ExecSchemaValidationPort = {
    validate: () => ({ valid: true, issues: [] }),
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

test('accepts a valid alternate adapter through the explicit evidence contract', () => {
  const canonicalAdapter = new JsonSchemaExecValidator()
  const alternateAdapter: ExecSchemaValidationPort = {
    validate: (schema, value) => canonicalAdapter.validate(schema, value),
  }
  const result = new ValidateExecContract(alternateAdapter).validate(validInput())

  assert.equal(result.status, 'VALID')
})

test('does not expose caller-mintable validation authority through the domain boundary', async () => {
  assert.equal('registerExecValidationAuthority' in execContractDomain, false)
  assert.equal('recordExecSchemaValidation' in execContractDomain, false)
  const validationEvidenceModule = await import('../src/domain/exec-validation-evidence-internal.ts')
  assert.equal('issueSchemaValidationEvidence' in validationEvidenceModule, false)
  assert.equal('registerSchemaValidationAdapter' in validationEvidenceModule, false)
  assert.equal('recordCanonicalValidationEvidence' in validationEvidenceModule, false)

  const definitions = new ExecContractSchemaDefinitions()
  const adapter = new JsonSchemaExecValidator()
  const input = validInput()
  const validation = adapter.validate(definitions.envelope, input.envelope)
  assert.equal(validation.valid, true)
  ;(input.envelope as Record<string, unknown>).contractVersion = ' 1.0.0 '
  const postMutationValidation = adapter.validate(definitions.envelope, input.envelope)
  assert.equal(postMutationValidation.valid, false)

  assert.throws(
    () => StructuredExecutionEnvelope.create(
      input.envelope as never,
      definitions.envelope.reference,
    ),
    /explicit successful schema validation evidence/,
  )
})

test('rejects forged evidence and runtime-created canonical-looking references', () => {
  const definitions = new ExecContractSchemaDefinitions()
  const input = validInput()
  const forgedEvidence = (schema: SchemaReference, value: object) => ({
    valid: true as const,
    issues: [],
    validatedInput: value,
    schemaReference: schema,
  })

  assert.throws(
    () => StructuredExecutionEnvelope.create(
      input.envelope as never,
      definitions.envelope.reference,
      forgedEvidence(definitions.envelope.reference, input.envelope as object),
    ),
    /explicit successful schema validation evidence/,
  )
  assert.throws(
    () => StructuredCapabilityPayload.create(
      input.payload as never,
      definitions.payload.reference,
      forgedEvidence(definitions.payload.reference, input.payload as object),
    ),
    /explicit successful schema validation evidence/,
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
      forgedEvidence(runtimeCreatedReference, input.envelope as object),
    ),
    /ticket-owned envelope schema reference/,
  )

  const forgedPort: ExecSchemaValidationPort = {
    validate: (schema, value) => ({
      valid: true,
      issues: [],
      evidence: forgedEvidence(schema.reference, value as object),
    }),
  }
  const result = new ValidateExecContract(forgedPort).validate(input)
  assert.equal(result.status, 'INVALID')
  if (result.status !== 'INVALID') return
  assert.equal(result.failure.code, 'CONTRACT_INVALID')
  assert.equal('value' in result, false)
  assert.equal(result.failure.noApproval, true)
  assert.equal(result.failure.noCheckpoint, true)
  assert.equal(result.failure.noEffect, true)
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
    /explicit successful schema validation evidence/,
  )
  assert.throws(
    () => StructuredCapabilityPayload.create(input.payload as never, canonicalPayloadSchema),
    /explicit successful schema validation evidence/,
  )

  const canonicalValidator = new JsonSchemaExecValidator()
  const envelopeValidation = canonicalValidator.validate(canonicalDefinitions.envelope, input.envelope)
  const payloadValidation = canonicalValidator.validate(canonicalDefinitions.payload, input.payload)
  assert.equal(envelopeValidation.valid, true)
  assert.equal(payloadValidation.valid, true)
  assert.doesNotThrow(() => StructuredExecutionEnvelope.create(
    input.envelope as never,
    canonicalEnvelopeSchema,
    envelopeValidation.evidence,
  ))
  assert.doesNotThrow(() => StructuredCapabilityPayload.create(
    input.payload as never,
    canonicalPayloadSchema,
    payloadValidation.evidence,
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
    /explicit successful schema validation evidence/,
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
  const data = JSON.parse('{"__proto__":{"nested":"preserved"}}') as Record<string, unknown>
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
