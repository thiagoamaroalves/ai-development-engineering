import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { resolve } from 'node:path'
import {
  PipelineAdvanceReservation,
  PipelineDomainError,
  DerivedWorkflowState,
  PipelineId,
  PipelineRepository,
  PipelineRevision,
  PipelineStateInputSet,
  PipelineStateInputs,
  PipelineStateReader,
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
    this.pipelines.set(pipeline.id.value, pipeline)
  }

  find(id: PipelineId): WorkflowPipeline | undefined {
    return this.pipelines.get(id.value)
  }

  async advance(proposed: WorkflowPipeline, expectedRevision: PipelineRevision): Promise<PipelineAdvanceReservation> {
    this.advanceCalls += 1
    const current = this.pipelines.get(proposed.id.value)
    if (!current) return { status: 'NOT_FOUND' }
    if (!current.revision.equals(expectedRevision)) return { status: 'STALE', existing: current }
    this.pipelines.set(proposed.id.value, proposed)
    return { status: 'ADVANCED', pipeline: proposed }
  }
}

class InMemoryPipelineStateReader implements PipelineStateReader {
  constructor(private readonly inputs: PipelineStateInputs) {}

  read(): PipelineStateInputs {
    return this.inputs
  }
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
  const pipeline = WorkflowPipeline.create({ id: 'PIPELINE-001' })
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
  const newlyCreated = WorkflowPipeline.create({
    id: 'PIPELINE-NEW',
    stage: 'TICKET_FINALIZATION',
    revision: 99,
  } as never)
  assert.equal(newlyCreated.stage.value, 'ACCEPTED_ADRS')
  assert.equal(newlyCreated.revision.value, 0)

  assert.throws(
    () => WorkflowPipeline.rehydrate({ id: 'PIPELINE-INVALID', stage: 'FORGED', revision: 4 } as never),
    (error: unknown) => error instanceof PipelineDomainError && error.code === 'INVALID_PIPELINE_STAGE',
  )
  assert.throws(
    () => WorkflowPipeline.rehydrate({ id: 'PIPELINE-INVALID', stage: 'SPECS', revision: -1 }),
    (error: unknown) => error instanceof PipelineDomainError && error.code === 'INVALID_PIPELINE_REVISION',
  )
  assert.throws(
    () => WorkflowPipeline.rehydrate({ id: 'PIPELINE-INVALID', revision: 1 } as never),
    (error: unknown) => error instanceof PipelineDomainError && error.code === 'INVALID_PIPELINE_STAGE',
  )
  assert.throws(
    () => WorkflowPipeline.rehydrate({ id: 'PIPELINE-INVALID', stage: 'SPECS' } as never),
    (error: unknown) => error instanceof PipelineDomainError && error.code === 'INVALID_PIPELINE_REVISION',
  )
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
  const pipeline = WorkflowPipeline.create({ id: 'PIPELINE-001' })
  const repository = new InMemoryPipelineRepository()
  repository.seed(pipeline)
  const view = new GetPipelineStateHandler(repository, new InMemoryPipelineStateReader(inputs)).handle({ id: 'PIPELINE-001' })

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
  repository.seed(WorkflowPipeline.create({ id: 'PIPELINE-001' }))
  const handler = new AdvancePipelineHandler(repository)

  const advanced = await handler.handle({ id: 'PIPELINE-001', target: 'SPECS', expectedRevision: 0 })
  assert.equal(advanced.stage.value, 'SPECS')
  assert.equal(advanced.revision.value, 1)

  await assert.rejects(
    handler.handle({ id: 'PIPELINE-001', target: 'SPECS', expectedRevision: 0 }),
    (error: unknown) => error instanceof PipelineDomainError && error.code === 'INVALID_PIPELINE_TRANSITION',
  )
  assert.equal(repository.advanceCalls, 1)
  await assert.rejects(
    handler.handle({ id: 'PIPELINE-001', target: 'SPEC_AUDIT_REMEDIATION', expectedRevision: 0 }),
    (error: unknown) => error instanceof PipelineDomainError && error.code === 'PIPELINE_STALE',
  )
  const current = repository.find(PipelineId.create('PIPELINE-001'))!
  assert.equal(current.stage.value, 'SPECS')
  assert.equal(current.revision.value, 1)
  assert.equal(repository.advanceCalls, 2)
})

test('query handler is read-only and missing state fails closed', () => {
  const repository = new InMemoryPipelineRepository()
  repository.seed(WorkflowPipeline.create({ id: 'PIPELINE-001' }))
  const handler = new GetPipelineStateHandler(repository, { read: () => undefined })

  assert.throws(
    () => handler.handle({ id: 'PIPELINE-001' }),
    (error: unknown) => error instanceof PipelineDomainError && error.code === 'PIPELINE_NOT_FOUND',
  )
  assert.equal(repository.find(PipelineId.create('PIPELINE-001'))?.stage.value, 'ACCEPTED_ADRS')
})
