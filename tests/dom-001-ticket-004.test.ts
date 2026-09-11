import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { resolve } from 'node:path'
import {
  CanonicalIdentityCatalog,
  CanonicalIdentityGenerator,
  CanonicalIdentityRecord,
  CanonicalIdentityReference,
  CanonicalIdentityRepository,
  CanonicalStageReference,
  IdentityDomainError,
} from '../src/domain/identity.js'
import {
  PipelineAdvanceReservation,
  PipelineDomainError,
  DerivedWorkflowState,
  PipelineRepository,
  PipelineRevision,
  PipelineStateInputSet,
  PipelineStateInputs,
  PipelineStateReader,
  PipelineProvenanceRecordInput,
  PipelineProvenanceReconstructionAuthority,
  WorkflowPipeline,
} from '../src/domain/pipeline.js'
import {
  AdvancePipelineHandler,
  GetPipelineStateHandler,
} from '../src/application/pipeline.js'

class InMemoryPipelineRepository implements PipelineRepository {
  private readonly pipelines = new Map<string, WorkflowPipeline>()
  advanceCalls = 0

  seed(pipeline: WorkflowPipeline): void {
    this.pipelines.set(pipeline.identity.canonicalKey, pipeline)
  }

  find(identity: CanonicalIdentityReference): WorkflowPipeline | undefined {
    return this.pipelines.get(identity.canonicalKey)
  }

  async advance(proposed: WorkflowPipeline, expectedRevision: PipelineRevision): Promise<PipelineAdvanceReservation> {
    this.advanceCalls += 1
    const current = this.pipelines.get(proposed.identity.canonicalKey)
    if (!current) return { status: 'NOT_FOUND' }
    if (!current.revision.equals(expectedRevision)) return { status: 'STALE', existing: current }
    this.pipelines.set(proposed.identity.canonicalKey, proposed)
    return { status: 'ADVANCED', pipeline: proposed }
  }
}

class InMemoryPipelineStateReader implements PipelineStateReader {
  constructor(private readonly inputs: PipelineStateInputs) {}

  read(): PipelineStateInputs {
    return this.inputs
  }
}

class InMemoryPipelineProvenanceAuthority implements PipelineProvenanceReconstructionAuthority {
  private readonly histories = new Map<string, readonly PipelineProvenanceRecordInput[]>()
  resolveCalls = 0

  seed(identity: CanonicalIdentityReference, provenance: readonly PipelineProvenanceRecordInput[]): void {
    this.histories.set(identity.canonicalKey, provenance)
  }

  resolveForRehydration(identity: CanonicalIdentityReference): readonly PipelineProvenanceRecordInput[] | undefined {
    this.resolveCalls += 1
    return this.histories.get(identity.canonicalKey)
  }

  get size(): number {
    return this.histories.size
  }
}

class InMemoryIdentityRepository implements CanonicalIdentityRepository {
  private readonly records = new Map<string, CanonicalIdentityRecord>()

  get size(): number {
    return this.records.size
  }

  seed(record: CanonicalIdentityRecord): void {
    this.records.set(record.canonicalKey, record)
  }

  async reserve(record: CanonicalIdentityRecord) {
    const existing = this.records.get(record.canonicalKey)
    if (existing) return { status: 'DUPLICATE' as const, existing }
    this.records.set(record.canonicalKey, record)
    return { status: 'ACCEPTED' as const, record }
  }

  find(reference: CanonicalIdentityReference): CanonicalIdentityRecord | undefined {
    return this.records.get(reference.canonicalKey)
  }
}

const identityGenerator: CanonicalIdentityGenerator = {
  next: ({ kind }) => `${kind}-GENERATED`,
}

function identityAuthorityFor(stage: CanonicalStageReference): CanonicalIdentityCatalog {
  const repository = new InMemoryIdentityRepository()
  repository.seed(CanonicalIdentityRecord.create({
    identity: stage.identity,
    revision: stage.revision,
    createdAt: '2026-09-09T12:00:00.000Z',
  }))
  return new CanonicalIdentityCatalog(repository, identityGenerator, () => '2026-09-09T12:00:00.000Z')
}

function pipelineIdentity(stageId = 'STAGE-001'): CanonicalStageReference {
  return CanonicalStageReference.create({
    executionId: 'EXECUTION-001',
    stageId,
    revision: 1,
  })
}

function createPipeline(stage = pipelineIdentity()): WorkflowPipeline {
  return WorkflowPipeline.create({ identity: stage }, identityAuthorityFor(stage))
}

function stateInputs(): PipelineStateInputs {
  const state = (machine: PipelineStateInputSet['execution']['machine'], value: string) => ({ machine, state: value })
  return PipelineStateInputs.create({
    execution: state('EXECUTION', 'READY'),
    spec: state('SPEC', 'READY'),
    stage: state('STAGE', 'READY'),
    activity: state('ACTIVITY', 'READY'),
    cycle: state('CYCLE', 'READY'),
    wave: state('WAVE', 'READY'),
    ticket: state('TICKET', 'READY'),
    migration: state('MIGRATION', 'READY'),
    publication: state('PUBLICATION', 'READY'),
  })
}

test('pipeline accepts only the immediate canonical successor', () => {
  const pipeline = createPipeline()
  const transition = pipeline.advanceTo('SPECS')

  assert.equal(transition.previous, pipeline)
  assert.equal(transition.proposed.stage.value, 'SPECS')
  assert.equal(transition.expectedRevision.value, 0)
  assert.equal(transition.proposed.revision.value, 1)
  assert.throws(
    () => pipeline.advanceTo('SPEC_AUDIT_REMEDIATION'),
    (error: unknown) => error instanceof PipelineDomainError && error.code === 'INVALID_PIPELINE_TRANSITION',
  )
  assert.equal(pipeline.stage.value, 'ACCEPTED_ADRS')
  assert.equal(pipeline.revision.value, 0)
})

test('pipeline rehydration rejects unknown stages and invalid revisions', () => {
  const identity = pipelineIdentity('STAGE-INVALID')
  const authority = identityAuthorityFor(identity)
  const newlyCreated = WorkflowPipeline.create({
    identity,
    stage: 'TICKET_FINALIZATION',
    revision: 99,
  } as never, authority)
  assert.equal(newlyCreated.stage.value, 'ACCEPTED_ADRS')
  assert.equal(newlyCreated.revision.value, 0)

  assert.throws(
    () => WorkflowPipeline.rehydrate({ identity, stage: 'FORGED', revision: 4 } as never, authority, new InMemoryPipelineProvenanceAuthority()),
    (error: unknown) => error instanceof PipelineDomainError && error.code === 'INVALID_PIPELINE_STAGE',
  )
  assert.throws(
    () => WorkflowPipeline.rehydrate({ identity, stage: 'SPECS', revision: -1 }, authority, new InMemoryPipelineProvenanceAuthority()),
    (error: unknown) => error instanceof PipelineDomainError && error.code === 'INVALID_PIPELINE_REVISION',
  )
  assert.throws(
    () => WorkflowPipeline.rehydrate({ identity, revision: 1 } as never, authority, new InMemoryPipelineProvenanceAuthority()),
    (error: unknown) => error instanceof PipelineDomainError && error.code === 'INVALID_PIPELINE_STAGE',
  )
  assert.throws(
    () => WorkflowPipeline.rehydrate({ identity, stage: 'SPECS' } as never, authority, new InMemoryPipelineProvenanceAuthority()),
    (error: unknown) => error instanceof PipelineDomainError && error.code === 'INVALID_PIPELINE_REVISION',
  )
})

test('pipeline rehydration requires an attached complete immediate-transition chain', () => {
  const identity = pipelineIdentity('STAGE-CHAIN')
  const authority = identityAuthorityFor(identity)
  const provenance = [
    { identity: identity.reference, stage: 'ACCEPTED_ADRS' as const, revision: 0 },
    {
      identity: identity.reference,
      stage: 'SPECS' as const,
      revision: 1,
      previousStage: 'ACCEPTED_ADRS' as const,
      previousRevision: 0,
    },
  ]
  const provenanceAuthority = new InMemoryPipelineProvenanceAuthority()
  provenanceAuthority.seed(identity.reference, provenance)
  const restored = WorkflowPipeline.rehydrate({
    identity,
    stage: 'SPECS',
    revision: 1,
    provenance,
  }, authority, provenanceAuthority)

  assert.equal(restored.stage.value, 'SPECS')
  assert.equal(restored.revision.value, 1)
  for (const invalid of [
    { identity, stage: 'SPECS' as const, revision: 1 },
    { identity, stage: 'SPEC_AUDIT_REMEDIATION' as const, revision: 1, provenance },
    { identity, stage: 'SPECS' as const, revision: 2, provenance },
    {
      identity,
      stage: 'SPECS' as const,
      revision: 1,
      provenance: [provenance[0], { ...provenance[1], previousStage: 'ACCEPTED_ADRS' as const, previousRevision: 4 }],
    },
  ]) {
    assert.throws(
      () => WorkflowPipeline.rehydrate(invalid as never, authority, provenanceAuthority),
      (error: unknown) => error instanceof PipelineDomainError && error.code === 'INVALID_PIPELINE_TRANSITION',
    )
  }
})

test('pipeline identity is canonical STAGE reference and rejects local aliases', () => {
  const stage = pipelineIdentity()
  const authority = identityAuthorityFor(stage)
  const pipeline = WorkflowPipeline.create({ identity: stage }, authority)

  assert.equal(pipeline.identity.equals(stage.reference), true)
  assert.throws(
    () => WorkflowPipeline.create({ identity: stage }, undefined as never),
    (error: unknown) => error instanceof PipelineDomainError && error.code === 'PIPELINE_RECONSTRUCTION_AUTHORITY_REQUIRED',
  )
  assert.throws(
    () => WorkflowPipeline.create({
      identity: CanonicalStageReference.create({
        executionId: 'EXECUTION-UNREGISTERED',
        stageId: 'STAGE-FORGED',
        revision: 1,
      }),
    }, authority),
    (error: unknown) => error instanceof IdentityDomainError && error.code === 'IDENTITY_NOT_FOUND',
  )
  assert.throws(
    () => WorkflowPipeline.create({ identity: { id: 'PIPELINE-001' } as never }, authority),
    (error: unknown) => error instanceof PipelineDomainError && error.code === 'INVALID_PIPELINE_IDENTITY',
  )
  assert.throws(
    () => WorkflowPipeline.create({
      identity: {
        identity: { kind: 'ADR', scope: 'workflow', value: 'ADR-0001' },
        revision: 1,
      },
    }, authority),
    (error: unknown) => error instanceof PipelineDomainError && error.code === 'INVALID_PIPELINE_IDENTITY',
  )
})

test('rejects a shape-valid pipeline provenance chain without accepted authority', () => {
  const identity = pipelineIdentity('STAGE-PROVENANCE-AUTHORITY')
  const identityAuthority = identityAuthorityFor(identity)
  const provenance = [
    { identity: identity.reference, stage: 'ACCEPTED_ADRS' as const, revision: 0 },
    {
      identity: identity.reference,
      stage: 'SPECS' as const,
      revision: 1,
      previousStage: 'ACCEPTED_ADRS' as const,
      previousRevision: 0,
    },
  ]
  const provenanceAuthority = new InMemoryPipelineProvenanceAuthority()

  assert.throws(
    () => WorkflowPipeline.rehydrate({
      identity,
      stage: 'SPECS',
      revision: 1,
      provenance,
    }, identityAuthority, provenanceAuthority),
    (error: unknown) => error instanceof PipelineDomainError && error.code === 'INVALID_PIPELINE_TRANSITION',
  )
  assert.equal(provenanceAuthority.size, 0)
  assert.equal(provenanceAuthority.resolveCalls, 1)
})

test('rejects unregistered Stage creation without mutating the identity authority', () => {
  const registered = pipelineIdentity('STAGE-REGISTERED')
  const repository = new InMemoryIdentityRepository()
  repository.seed(CanonicalIdentityRecord.create({
    identity: registered.identity,
    revision: registered.revision,
    createdAt: '2026-09-09T12:00:00.000Z',
  }))
  const authority = new CanonicalIdentityCatalog(repository, identityGenerator, () => '2026-09-09T12:00:00.000Z')
  const before = repository.size

  assert.throws(
    () => WorkflowPipeline.create({
      identity: CanonicalStageReference.create({
        executionId: 'EXECUTION-UNREGISTERED',
        stageId: 'STAGE-FORGED',
        revision: 1,
      }),
    }, authority),
    (error: unknown) => error instanceof IdentityDomainError && error.code === 'IDENTITY_NOT_FOUND',
  )
  assert.equal(repository.size, before)
})

test('productive domain boundaries do not import prototype or infrastructure details', () => {
  const productiveFiles = [
    'src/domain/pipeline.ts',
    'src/domain/snapshot.ts',
    'src/application/pipeline.ts',
    'src/application/snapshot.ts',
  ]
  for (const file of productiveFiles) {
    const source = readFileSync(resolve(process.cwd(), file), 'utf8')
    assert.doesNotMatch(source, /\bprototype\b|node:fs|node:path|\bhttp\b|\borm\b|\bgithub\b|\bsqlite\b|\bpostgres\b/i)
  }
})

test('independent aggregate state inputs are validated, frozen, and never combined into a transition', () => {
  const inputs = stateInputs()
  const pipeline = createPipeline()
  const repository = new InMemoryPipelineRepository()
  repository.seed(pipeline)
  const view = new GetPipelineStateHandler(repository, new InMemoryPipelineStateReader(inputs), identityAuthorityFor(pipelineIdentity())).handle({ identity: pipelineIdentity() })

  assert.equal(view.pipelineStage.value, 'ACCEPTED_ADRS')
  assert.equal(view.stateFor('TICKET').state, 'READY')
  assert.equal(Object.isFrozen(inputs), true)
  assert.equal(Object.isFrozen(view), true)
  assert.equal(Object.isFrozen(view.machineStates), true)
  try {
    ;(view as unknown as { pipelineStage: unknown }).pipelineStage = 'FORGED'
  } catch {
    // Strict runtimes throw on writes to frozen records; both outcomes are immutable.
  }
  assert.equal(view.pipelineStage.value, 'ACCEPTED_ADRS')
  assert.throws(
    () => PipelineStateInputs.create({ ...stateInputs(), ticket: { machine: 'WAVE', state: 'READY' } }),
    (error: unknown) => error instanceof PipelineDomainError && error.code === 'INVALID_PIPELINE_STATE',
  )
  assert.throws(
    () => PipelineStateInputs.create({ ...stateInputs(), ticket: undefined } as never),
    (error: unknown) => error instanceof PipelineDomainError && error.code === 'INVALID_PIPELINE_STATE',
  )
  const constructDerivedState = DerivedWorkflowState as unknown as {
    new (stage: unknown, states: readonly unknown[]): DerivedWorkflowState
  }
  assert.throws(
    () => new constructDerivedState(pipeline.stage, inputs.all()),
    (error: unknown) => error instanceof PipelineDomainError && error.code === 'INVALID_PIPELINE_STATE',
  )
})

test('advance handler uses expected revision as CAS token and rejects stale without last-write-wins', async () => {
  const repository = new InMemoryPipelineRepository()
  repository.seed(createPipeline())
  const handler = new AdvancePipelineHandler(repository, identityAuthorityFor(pipelineIdentity()))

  const advanced = await handler.handle({ identity: pipelineIdentity(), target: 'SPECS', expectedRevision: 0 })
  assert.equal(advanced.stage.value, 'SPECS')
  assert.equal(advanced.revision.value, 1)

  await assert.rejects(
    handler.handle({ identity: pipelineIdentity(), target: 'SPECS', expectedRevision: 0 }),
    (error: unknown) => error instanceof PipelineDomainError && error.code === 'INVALID_PIPELINE_TRANSITION',
  )
  assert.equal(repository.advanceCalls, 1)
  await assert.rejects(
    handler.handle({ identity: pipelineIdentity(), target: 'SPEC_AUDIT_REMEDIATION', expectedRevision: 0 }),
    (error: unknown) => error instanceof PipelineDomainError && error.code === 'PIPELINE_STALE',
  )
  const current = repository.find(pipelineIdentity().reference)!
  assert.equal(current.stage.value, 'SPECS')
  assert.equal(current.revision.value, 1)
  assert.equal(repository.advanceCalls, 2)
})

test('query handler is read-only and missing state fails closed', () => {
  const repository = new InMemoryPipelineRepository()
  repository.seed(createPipeline())
  const handler = new GetPipelineStateHandler(repository, { read: () => undefined }, identityAuthorityFor(pipelineIdentity()))

  assert.throws(
    () => handler.handle({ identity: pipelineIdentity() }),
    (error: unknown) => error instanceof PipelineDomainError && error.code === 'PIPELINE_NOT_FOUND',
  )
  assert.equal(repository.find(pipelineIdentity().reference)?.stage.value, 'ACCEPTED_ADRS')
})
