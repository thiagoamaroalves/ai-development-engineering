import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import test from 'node:test'
import { dirname, resolve } from 'node:path'
import {
  CanonicalIdentityCatalog,
  CanonicalIdentityGenerator,
  CanonicalIdentityRecord,
  CanonicalIdentityReference,
  CanonicalIdentityRepository,
  CanonicalStageReference,
} from '../src/domain/identity.js'
import {
  CanonicalCommandAuthorityState,
  CanonicalCommandAuthorityStateCatalog,
  CommandRejectionRecorder,
} from '../src/domain/command.js'
import {
  PipelineAdvanceReservation,
  PipelineRepository,
  PipelineRevision,
  WorkflowPipeline,
} from '../src/domain/pipeline.js'
import {
  CanonicalCommandAuthorityReader,
  CanonicalCommandAuthorityStateSource,
} from '../src/application/command-authority.js'
import {
  AdvancePipelineCompositionDependencies,
  createAdvancePipelineHandler,
} from '../src/application/composition.js'
import type { CanonicalCommandRejection, CommandRejectionRecord } from '../src/domain/command.js'

class InMemoryIdentityRepository implements CanonicalIdentityRepository {
  private readonly records = new Map<string, CanonicalIdentityRecord>()

  seed(record: CanonicalIdentityRecord): void {
    this.records.set(record.canonicalKey, record)
  }

  reserve(record: CanonicalIdentityRecord) {
    const existing = this.records.get(record.canonicalKey)
    if (existing) return Promise.resolve({ status: 'DUPLICATE' as const, existing })
    this.records.set(record.canonicalKey, record)
    return Promise.resolve({ status: 'ACCEPTED' as const, record })
  }

  find(reference: CanonicalIdentityReference): CanonicalIdentityRecord | undefined {
    return this.records.get(reference.canonicalKey)
  }
}

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

class SequencePipelineRepository implements PipelineRepository {
  advanceCalls = 0
  private findCalls = 0

  constructor(
    private readonly pipelines: readonly (WorkflowPipeline | undefined)[],
    private readonly afterFind?: (call: number) => void,
  ) {}

  find(_identity: CanonicalIdentityReference): WorkflowPipeline | undefined {
    const pipeline = this.pipelines[Math.min(this.findCalls, this.pipelines.length - 1)]
    this.findCalls += 1
    this.afterFind?.(this.findCalls)
    return pipeline
  }

  async advance(): Promise<PipelineAdvanceReservation> {
    this.advanceCalls += 1
    return { status: 'NOT_FOUND' }
  }
}

class InMemoryRejectionRecorder implements CommandRejectionRecorder {
  readonly records = new Map<string, CommandRejectionRecord>()

  async record(rejection: CanonicalCommandRejection): Promise<CommandRejectionRecord> {
    const existing = this.records.get(rejection.idempotencyKey)
    if (existing) return existing
    const record = Object.freeze({ rejection, recorded: true as const })
    this.records.set(rejection.idempotencyKey, record)
    return record
  }
}

const identityGenerator: CanonicalIdentityGenerator = {
  next: ({ kind }) => `${kind}-GENERATED`,
}

function pipelineIdentity(stageId = 'STAGE-001'): CanonicalStageReference {
  return CanonicalStageReference.create({
    executionId: 'EXECUTION-001',
    stageId,
    revision: 1,
  })
}

function createFixture(stageId = 'STAGE-001') {
  const stage = pipelineIdentity(stageId)
  const identityRepository = new InMemoryIdentityRepository()
  identityRepository.seed(CanonicalIdentityRecord.create({
    identity: stage.identity,
    revision: stage.revision,
    createdAt: '2026-09-15T12:00:00.000Z',
  }))
  const identities = new CanonicalIdentityCatalog(
    identityRepository,
    identityGenerator,
    () => '2026-09-15T12:00:00.000Z',
  )
  const pipelines = new InMemoryPipelineRepository()
  const pipeline = WorkflowPipeline.create({ identity: stage }, identities)
  pipelines.seed(pipeline)
  return { identities, pipelines, pipeline }
}

function stateFor(
  pipeline: WorkflowPipeline,
  overrides: Partial<CanonicalCommandAuthorityState> = {},
): CanonicalCommandAuthorityState {
  return {
    identity: pipeline.identity,
    specStatus: 'KNOWN',
    revisionState: 'ELIGIBLE',
    dependencyClosure: 'CLOSED',
    verdict: 'COMPATIBLE',
    freshness: {
      dependencyRevision: 'dependency-revision-1',
      verdictRevision: 'verdict-revision-1',
    },
    ...overrides,
  }
}

function createStateSource(
  states: readonly (CanonicalCommandAuthorityState | undefined)[],
): { readonly source: CanonicalCommandAuthorityStateCatalog; readonly calls: number } {
  const source = new CanonicalCommandAuthorityStateCatalog()
  states.forEach((state) => {
    if (state) source.register(state)
  })

  return {
    source,
    get calls() {
      return source.readCount
    },
  }
}

function readerFor(
  fixture: ReturnType<typeof createFixture>,
  state: CanonicalCommandAuthorityState | undefined = stateFor(fixture.pipeline),
): CanonicalCommandAuthorityReader {
  return new CanonicalCommandAuthorityReader(
    fixture.identities,
    fixture.pipelines,
    new CanonicalCommandAuthorityStateSource(createStateSource([state]).source),
  )
}

function productiveReaderFor(
  fixture: ReturnType<typeof createFixture>,
): CanonicalCommandAuthorityReader {
  return readerFor(fixture)
}

test('T13-AC1 returns a complete immutable productive observation', () => {
  const fixture = createFixture()
  const observation = productiveReaderFor(fixture).observe(fixture.pipeline.identity)

  if (!observation) throw new Error('Expected a complete command-authority observation.')
  assert.equal(observation.identity.equals(fixture.pipeline.identity), true)
  assert.equal(observation.stage, 'ACCEPTED_ADRS')
  assert.equal(observation.aggregateRevision.value, 0)
  assert.equal(observation.preconditions.specStatus, 'KNOWN')
  assert.equal(observation.preconditions.revisionStatus, 'ELIGIBLE')
  assert.equal(observation.preconditions.dependencyClosure, 'CLOSED')
  assert.equal(observation.preconditions.verdict, 'COMPATIBLE')
  assert.equal(
    observation.freshness.dependencyRevision,
    'dependency-revision-1',
  )
  assert.equal(
    observation.freshness.verdictRevision,
    'verdict-revision-1',
  )
  assert.equal(Object.isFrozen(observation), true)
  assert.equal(Object.isFrozen(observation.preconditions), true)
  assert.equal(Object.isFrozen(observation.freshness), true)
})

test('T13-AC2 rejects unknown, detached, wrong-kind, incomplete, and mismatched source state', () => {
  const fixture = createFixture()
  const stateSource = createStateSource([stateFor(fixture.pipeline)])
  const reader = new CanonicalCommandAuthorityReader(
    fixture.identities,
    fixture.pipelines,
    new CanonicalCommandAuthorityStateSource(stateSource.source),
  )

  const unknown = reader.observe(pipelineIdentity('STAGE-UNKNOWN').reference)
  const detached = reader.observe(pipelineIdentity('STAGE-DETACHED').reference)
  const wrongKind = reader.observe(CanonicalIdentityReference.create({
    identity: { kind: 'ADR', scope: 'EXECUTION-001', value: 'ADR-001' },
    revision: 1,
  }))
  const incompleteState = {
    identity: fixture.pipeline.identity,
    specStatus: undefined as never,
    revisionState: 'ELIGIBLE' as const,
    dependencyClosure: 'CLOSED' as const,
    verdict: 'COMPATIBLE' as const,
    freshness: stateFor(fixture.pipeline).freshness,
  }
  assert.throws(
    () => new CanonicalCommandAuthorityStateCatalog([incompleteState]),
    /complete and known/i,
  )
  const incomplete = undefined
  const mismatched = new CanonicalCommandAuthorityReader(
    fixture.identities,
    fixture.pipelines,
    new CanonicalCommandAuthorityStateSource(createStateSource([stateFor(fixture.pipeline, {
      identity: pipelineIdentity('STAGE-OTHER').reference,
    })]).source),
  ).observe(fixture.pipeline.identity)

  assert.equal(unknown, undefined)
  assert.equal(detached, undefined)
  assert.equal(wrongKind, undefined)
  assert.equal(incomplete, undefined)
  assert.equal(mismatched, undefined)
  assert.equal(stateSource.calls, 0)
})

test('T13-AC2 preserves fail-closed status evidence without upgrading it', () => {
  const fixture = createFixture()
  const cases: Array<{
    overrides: Partial<CanonicalCommandAuthorityState>
    expected: {
      specStatus: 'KNOWN' | 'UNKNOWN'
      revisionStatus: 'ELIGIBLE' | 'INELIGIBLE'
      dependencyClosure: 'CLOSED' | 'OPEN' | 'INVALID'
      verdict: 'COMPATIBLE' | 'INCOMPATIBLE' | 'MISSING'
    }
  }> = [
    {
      overrides: { specStatus: 'UNKNOWN' },
      expected: { specStatus: 'UNKNOWN', revisionStatus: 'ELIGIBLE', dependencyClosure: 'CLOSED', verdict: 'COMPATIBLE' },
    },
    {
      overrides: { revisionState: 'SUPERSEDED' },
      expected: { specStatus: 'KNOWN', revisionStatus: 'INELIGIBLE', dependencyClosure: 'CLOSED', verdict: 'COMPATIBLE' },
    },
    {
      overrides: { dependencyClosure: 'OPEN' },
      expected: { specStatus: 'KNOWN', revisionStatus: 'ELIGIBLE', dependencyClosure: 'OPEN', verdict: 'COMPATIBLE' },
    },
    {
      overrides: { dependencyClosure: 'INVALID', verdict: 'INCOMPATIBLE' },
      expected: { specStatus: 'KNOWN', revisionStatus: 'ELIGIBLE', dependencyClosure: 'INVALID', verdict: 'INCOMPATIBLE' },
    },
    {
      overrides: { verdict: 'MISSING' },
      expected: { specStatus: 'KNOWN', revisionStatus: 'ELIGIBLE', dependencyClosure: 'CLOSED', verdict: 'MISSING' },
    },
  ]

  for (const { overrides, expected } of cases) {
    const observation = readerFor(fixture, stateFor(fixture.pipeline, overrides)).observe(fixture.pipeline.identity)
    if (!observation) throw new Error('Expected a typed non-eligible observation.')
    assert.equal(observation.preconditions.specStatus, expected.specStatus)
    assert.equal(observation.preconditions.revisionStatus, expected.revisionStatus)
    assert.equal(observation.preconditions.dependencyClosure, expected.dependencyClosure)
    assert.equal(observation.preconditions.verdict, expected.verdict)
    assert.equal(Object.isFrozen(observation.preconditions), true)
  }
})

test('T13-AC2 maps every named revision lifecycle negative to ineligible', () => {
  const fixture = createFixture()
  const lifecycleStates = ['PROPOSED', 'SUPERSEDED', 'REVOKED', 'INVALIDATED'] as const

  for (const revisionState of lifecycleStates) {
    const observation = readerFor(fixture, stateFor(fixture.pipeline, { revisionState }))
      .observe(fixture.pipeline.identity)

    if (!observation) throw new Error(`Expected an observation for ${revisionState}.`)
    assert.equal(observation.preconditions.revisionStatus, 'INELIGIBLE')
    assert.equal(observation.preconditions.verdict, 'COMPATIBLE')
  }
})

test('T13-AC2 rejects mutation attempts against every frozen observation boundary', () => {
  const fixture = createFixture()
  const observation = productiveReaderFor(fixture).observe(fixture.pipeline.identity)

  if (!observation) throw new Error('Expected a complete observation.')
  assert.equal(Reflect.set(observation as unknown as object, 'stage', 'SPECS'), false)
  assert.equal(Reflect.set(observation.preconditions as unknown as object, 'verdict', 'MISSING'), false)
  assert.equal(Reflect.set(observation.freshness as unknown as object, 'dependencyRevision', 'changed'), false)
  assert.equal(observation.stage, 'ACCEPTED_ADRS')
  assert.equal(observation.preconditions.verdict, 'COMPATIBLE')
  assert.equal(
    observation.freshness.dependencyRevision,
    'dependency-revision-1',
  )
})

test('T13-AC3 performs independent reads and exposes same-status freshness drift', () => {
  const fixture = createFixture()
  const stateSource = new CanonicalCommandAuthorityStateCatalog([stateFor(fixture.pipeline)])
  const reader = new CanonicalCommandAuthorityReader(
    fixture.identities,
    fixture.pipelines,
    new CanonicalCommandAuthorityStateSource(stateSource),
  )

  const first = reader.observe(fixture.pipeline.identity)
  stateSource.replace(stateFor(fixture.pipeline, {
    freshness: {
      dependencyRevision: 'dependency-revision-2',
      verdictRevision: 'verdict-revision-1',
    },
  }))
  const second = reader.observe(fixture.pipeline.identity)

  if (!first || !second) throw new Error('Expected two independent observations.')
  assert.equal(stateSource.readCount, 2)
  assert.equal(first.freshness.dependencyRevision, 'dependency-revision-1')
  assert.equal(second.freshness.dependencyRevision, 'dependency-revision-2')
  assert.equal(first.preconditions.verdict, second.preconditions.verdict)
})

test('T13-AC4 factory composes the productive reader and ignores caller claims', async () => {
  const fixture = createFixture()
  const dependencies: AdvancePipelineCompositionDependencies = {
    pipelines: fixture.pipelines,
    identities: fixture.identities,
    rejectionRecorder: new InMemoryRejectionRecorder(),
    authorityState: createStateSource([stateFor(fixture.pipeline)]).source,
  }
  const handler = createAdvancePipelineHandler(dependencies)
  const outcome = await handler.handle({
    identity: fixture.pipeline.identity,
    target: 'SPECS',
    expectedRevision: 0,
    correlation: 'T13-COMPOSITION-001',
    preconditions: {
      specStatus: 'UNKNOWN',
      revisionStatus: 'INELIGIBLE',
      dependencyClosure: 'INVALID',
      verdict: 'INCOMPATIBLE',
    },
  })

  assert.equal(outcome.status, 'ACCEPTED')
  assert.equal(fixture.pipelines.find(fixture.pipeline.identity)?.stage.value, 'SPECS')
})

test('T13-AC3 factory path rejects drift before commit and leaves pipeline unchanged', async () => {
  const fixture = createFixture()
  const changedPipeline = fixture.pipeline.advanceTo('SPECS').proposed
  const pipelines = new SequencePipelineRepository([fixture.pipeline, changedPipeline])
  const handler = createAdvancePipelineHandler({
    pipelines,
    identities: fixture.identities,
    rejectionRecorder: new InMemoryRejectionRecorder(),
    authorityState: createStateSource([stateFor(fixture.pipeline)]).source,
  })

  const outcome = await handler.handle({
    identity: fixture.pipeline.identity,
    target: 'SPECS',
    expectedRevision: 0,
    correlation: 'T13-DRIFT-001',
    preconditions: {
      specStatus: 'KNOWN',
      revisionStatus: 'ELIGIBLE',
      dependencyClosure: 'CLOSED',
      verdict: 'COMPATIBLE',
    },
  })

  assert.equal(outcome.status, 'REJECTED')
  if (outcome.status === 'REJECTED') assert.equal(outcome.rejection.code, 'STALE_REVISION')
  assert.equal(pipelines.advanceCalls, 0)
})

test('T13-AC3 factory path preserves producer-owned freshness', async () => {
  const fixture = createFixture()
  const handler = createAdvancePipelineHandler({
    pipelines: fixture.pipelines,
    identities: fixture.identities,
    rejectionRecorder: new InMemoryRejectionRecorder(),
    authorityState: createStateSource([stateFor(fixture.pipeline)]).source,
  })

  const outcome = await handler.handle({
    identity: fixture.pipeline.identity,
    target: 'SPECS',
    expectedRevision: 0,
    correlation: 'T13-SAME-STATUS-FRESHNESS-001',
    preconditions: {
      specStatus: 'KNOWN',
      revisionStatus: 'ELIGIBLE',
      dependencyClosure: 'CLOSED',
      verdict: 'COMPATIBLE',
    },
  })

  assert.equal(outcome.status, 'ACCEPTED')
  assert.equal(fixture.pipelines.advanceCalls, 1)
})

test('T13-AC3 productive reread detects pipeline stage and revision drift before commit', async () => {
  const fixture = createFixture()
  const changedPipeline = fixture.pipeline.advanceTo('SPECS').proposed
  const pipelines = new SequencePipelineRepository([fixture.pipeline, changedPipeline])
  const handler = createAdvancePipelineHandler({
    pipelines,
    identities: fixture.identities,
    rejectionRecorder: new InMemoryRejectionRecorder(),
    authorityState: createStateSource([stateFor(fixture.pipeline)]).source,
  })

  const outcome = await handler.handle({
    identity: fixture.pipeline.identity,
    target: 'SPECS',
    expectedRevision: 0,
    correlation: 'T13-PIPELINE-DRIFT-001',
    preconditions: {
      specStatus: 'KNOWN',
      revisionStatus: 'ELIGIBLE',
      dependencyClosure: 'CLOSED',
      verdict: 'COMPATIBLE',
    },
  })

  assert.equal(outcome.status, 'REJECTED')
  if (outcome.status === 'REJECTED') assert.equal(outcome.rejection.code, 'STALE_REVISION')
  assert.equal(pipelines.advanceCalls, 0)
})

test('T13-AC2 productive reread fails closed when the canonical authority source disappears', async () => {
  const fixture = createFixture()
  const authorityState = new CanonicalCommandAuthorityStateCatalog([stateFor(fixture.pipeline)])
  const pipelines = new SequencePipelineRepository(
    [fixture.pipeline, fixture.pipeline],
    (call) => {
      if (call === 2) authorityState.remove(fixture.pipeline.identity)
    },
  )
  const handler = createAdvancePipelineHandler({
    pipelines,
    identities: fixture.identities,
    rejectionRecorder: new InMemoryRejectionRecorder(),
    authorityState,
  })

  const outcome = await handler.handle({
    identity: fixture.pipeline.identity,
    target: 'SPECS',
    expectedRevision: 0,
    correlation: 'T13-SOURCE-DISAPPEAR-001',
    preconditions: {
      specStatus: 'KNOWN',
      revisionStatus: 'ELIGIBLE',
      dependencyClosure: 'CLOSED',
      verdict: 'COMPATIBLE',
    },
  })

  assert.equal(outcome.status, 'REJECTED')
  if (outcome.status === 'REJECTED') assert.equal(outcome.rejection.code, 'UNKNOWN_SPEC')
  assert.equal(fixture.pipelines.advanceCalls, 0)
})

test('T13-AC5 productive composition contains no test, prototype, or infrastructure authority path', () => {
  const sourceRoot = resolve(process.cwd(), 'src')
  const compositionPath = resolve(sourceRoot, 'application/composition.ts')
  const adapterPath = resolve(sourceRoot, 'application/command-authority.ts')
  const compositionSource = readFileSync(compositionPath, 'utf8')
  const adapterSource = readFileSync(adapterPath, 'utf8')

  const graph = new Set<string>()
  const pending = [compositionPath]
  while (pending.length > 0) {
    const current = pending.pop()!
    if (graph.has(current)) continue
    assert.equal(current.startsWith(sourceRoot), true)
    graph.add(current)

    const source = readFileSync(current, 'utf8')
    const importSpecifiers = [...source.matchAll(/(?:\bfrom\s*|\bimport\s*)['"](\.[^'"]+)['"]/g)]
      .map((match) => match[1])
    for (const specifier of importSpecifiers) {
      const normalized = specifier.endsWith('.js') ? specifier.slice(0, -3) : specifier
      const target = `${resolve(dirname(current), normalized)}.ts`
      assert.equal(existsSync(target), true, `Unresolvable productive import: ${specifier}`)
      pending.push(target)
    }
  }

  assert.equal(graph.has(adapterPath), true)
  assert.equal(graph.has(resolve(sourceRoot, 'domain/command.ts')), true)
  assert.equal(graph.has(resolve(sourceRoot, 'domain/identity.ts')), true)
  assert.equal(graph.has(resolve(sourceRoot, 'domain/pipeline.ts')), true)
  for (const path of graph) {
    assert.doesNotMatch(path, /(?:prototype|tests|infrastructure|database|http|orm)/i)
  }

  for (const source of [adapterSource, compositionSource]) {
    assert.doesNotMatch(source, /(?:from|import)\s*['"][^'"]*(?:prototype|tests\/|node:fs|node:path|infrastructure|database|http|orm)/i)
  }
  assert.match(adapterSource, /class CanonicalCommandAuthorityStateSource/)
  assert.match(adapterSource, /CommandAuthorityFreshness\.create/)
  assert.match(compositionSource, /CanonicalCommandAuthorityStateCatalog/)
  assert.doesNotMatch(adapterSource, /CanonicalCommandAuthorityStateProvider/)
  assert.doesNotMatch(adapterSource, /=>\s*CanonicalCommandAuthorityState/)
  assert.doesNotMatch(adapterSource, /specStatus:\s*'KNOWN'/)
  assert.doesNotMatch(adapterSource, /dependency-revision=\$\{/)
  assert.match(compositionSource, /new CanonicalCommandAuthorityStateSource\(dependencies\.authorityState\)/)
  assert.match(compositionSource, /new CanonicalCommandAuthorityReader/)
  assert.match(compositionSource, /new AdvancePipelineHandler/)
  const fixture = createFixture()
  assert.throws(
    () => new CanonicalCommandAuthorityStateSource((() => undefined) as never),
    TypeError,
  )
  assert.throws(
    () => createAdvancePipelineHandler({
      pipelines: {} as PipelineRepository,
      identities: fixture.identities,
      rejectionRecorder: new InMemoryRejectionRecorder(),
      authorityState: undefined as never,
    }),
    TypeError,
  )
  assert.throws(
    () => createAdvancePipelineHandler({
      pipelines: {} as PipelineRepository,
      identities: fixture.identities,
      rejectionRecorder: new InMemoryRejectionRecorder(),
      authorityState: { read: () => undefined } as never,
    }),
    TypeError,
  )
  assert.doesNotMatch(compositionSource, /readonly authority\s*:\s*CommandAuthorityReader/)
  assert.doesNotMatch(compositionSource, /CanonicalCommandAuthorityStateReader/)
})
