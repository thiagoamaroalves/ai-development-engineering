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
  type CanonicalCommandRejection,
  type CanonicalCommandAuthorityState,
  type CommandRejectionRecord,
  type CommandRejectionRecorder,
  CanonicalCommandAuthorityStateCatalog,
  CommandAuthorityFreshness,
  CommandAuthorityObservation,
  CommandAuthorityReader,
  CommandBasis,
  CommandPreconditionEvidence,
  CommandDomainError,
} from '../src/domain/command.js'
import {
  PipelineAdvanceReservation,
  PipelineRepository,
  PipelineRevision,
  WorkflowPipeline,
} from '../src/domain/pipeline.js'
import { AdvancePipelineHandler, AdvancePipelineCommand } from '../src/application/pipeline.js'
import { createAdvancePipelineHandler } from '../src/application/composition.js'

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
    await new Promise<void>((resolveNow) => setImmediate(resolveNow))
    const current = this.pipelines.get(proposed.identity.canonicalKey)
    if (!current) return { status: 'NOT_FOUND' }
    if (!current.revision.equals(expectedRevision)) return { status: 'STALE', existing: current }
    this.pipelines.set(proposed.identity.canonicalKey, proposed)
    return { status: 'ADVANCED', pipeline: proposed }
  }
}

class InMemoryCommandRejectionRecorder implements CommandRejectionRecorder {
  readonly records = new Map<string, CommandRejectionRecord>()
  calls = 0

  async record(rejection: CanonicalCommandRejection): Promise<CommandRejectionRecord> {
    this.calls += 1
    const existing = this.records.get(rejection.idempotencyKey)
    if (existing) return existing
    const record = Object.freeze({ rejection, recorded: true as const })
    this.records.set(rejection.idempotencyKey, record)
    return record
  }
}

class InMemoryCommandAuthorityReader implements CommandAuthorityReader {
  constructor(
    private readonly repository: InMemoryPipelineRepository,
    private readonly preconditions = {
      specStatus: 'KNOWN' as const,
      revisionStatus: 'ELIGIBLE' as const,
      dependencyClosure: 'CLOSED' as const,
      verdict: 'COMPATIBLE' as const,
    },
    private readonly freshness = commandAuthorityFreshness(),
  ) {}

  observe(identity: CanonicalIdentityReference): CommandAuthorityObservation | undefined {
    const pipeline = this.repository.find(identity)
    return pipeline ? {
      identity: pipeline.identity,
      aggregateRevision: pipeline.revision,
      stage: pipeline.stage.value,
      preconditions: CommandPreconditionEvidence.create(this.preconditions),
      freshness: this.freshness,
    } : undefined
  }
}

class SequenceCommandAuthorityReader implements CommandAuthorityReader {
  calls = 0

  constructor(private readonly observations: readonly CommandAuthorityObservation[]) {}

  observe(_identity: CanonicalIdentityReference): CommandAuthorityObservation | undefined {
    const observation = this.observations[Math.min(this.calls, this.observations.length - 1)]
    this.calls += 1
    return observation
  }
}

function commandAuthorityObservation(
  repository: InMemoryPipelineRepository,
  preconditions = {
    specStatus: 'KNOWN' as const,
    revisionStatus: 'ELIGIBLE' as const,
    dependencyClosure: 'CLOSED' as const,
    verdict: 'COMPATIBLE' as const,
  },
): CommandAuthorityObservation {
  const pipeline = repository.find(pipelineIdentity())
  if (!pipeline) throw new Error('Pipeline must be seeded before building authority evidence.')
  return {
    identity: pipeline.identity,
    aggregateRevision: pipeline.revision,
    stage: pipeline.stage.value,
    preconditions: CommandPreconditionEvidence.create(preconditions),
    freshness: commandAuthorityFreshness(),
  }
}

function commandAuthorityFreshness(
  dependencyRevision = 'dependency-revision-1',
  verdictRevision = 'verdict-revision-1',
): CommandAuthorityFreshness {
  return CommandAuthorityFreshness.create({ dependencyRevision, verdictRevision })
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

function identityAuthorityFor(stage: CanonicalStageReference): CanonicalIdentityCatalog {
  const repository = new InMemoryIdentityRepository()
  repository.seed(CanonicalIdentityRecord.create({
    identity: stage.identity,
    revision: stage.revision,
    createdAt: '2026-09-09T12:00:00.000Z',
  }))
  return new CanonicalIdentityCatalog(repository, identityGenerator, () => '2026-09-09T12:00:00.000Z')
}

function command(overrides: Partial<AdvancePipelineCommand> = {}): AdvancePipelineCommand {
  return {
    identity: pipelineIdentity(),
    target: 'SPECS',
    expectedRevision: 0,
    correlation: 'T5-COMMAND-001',
    preconditions: {
      specStatus: 'KNOWN',
      revisionStatus: 'ELIGIBLE',
      dependencyClosure: 'CLOSED',
      verdict: 'COMPATIBLE',
    },
    ...overrides,
  }
}

function createHandler(
  repository: InMemoryPipelineRepository,
  recorder: InMemoryCommandRejectionRecorder,
  identity = pipelineIdentity(),
  authority: CommandAuthorityReader = new InMemoryCommandAuthorityReader(repository),
): AdvancePipelineHandler {
  repository.seed(WorkflowPipeline.create({ identity }, identityAuthorityFor(identity)))
  return new AdvancePipelineHandler(repository, identityAuthorityFor(identity), recorder, authority)
}

test('command basis is canonical, immutable, and rejects missing correlation or evidence', () => {
  const basis = CommandBasis.create({
    identity: pipelineIdentity().reference,
    expectedRevision: 0,
    correlation: 'T5-BASIS-001',
    preconditions: {
      specStatus: 'KNOWN',
      revisionStatus: 'ELIGIBLE',
      dependencyClosure: 'CLOSED',
      verdict: 'COMPATIBLE',
    },
  })

  assert.equal(basis.identity.identity.kind, 'STAGE')
  assert.equal(Object.isFrozen(basis), true)
  assert.equal(Object.isFrozen(basis.preconditions), true)
  assert.throws(
    () => CommandBasis.create({ ...command(), correlation: '' }),
    (error: unknown) => error instanceof CommandDomainError && error.code === 'INVALID_COMMAND_CORRELATION',
  )
  assert.throws(
    () => CommandBasis.create({ ...command(), preconditions: undefined } as never),
    (error: unknown) => error instanceof CommandDomainError && error.code === 'INVALID_COMMAND_BASIS',
  )
})

test('valid pipeline commands return the canonical accepted result with correlation and basis', async () => {
  const repository = new InMemoryPipelineRepository()
  const recorder = new InMemoryCommandRejectionRecorder()
  const handler = createHandler(repository, recorder)

  const outcome = await handler.handle(command())

  assert.equal(outcome.status, 'ACCEPTED')
  if (outcome.status === 'ACCEPTED') {
    assert.equal(outcome.value.stage.value, 'SPECS')
    assert.equal(outcome.value.revision.value, 1)
    assert.equal(outcome.basis.correlation.value, 'T5-COMMAND-001')
  }
  assert.equal(repository.advanceCalls, 1)
  assert.equal(recorder.records.size, 0)
})

test('T005 composition consumes the productive state catalog instead of caller authority claims', async () => {
  const repository = new InMemoryPipelineRepository()
  const recorder = new InMemoryCommandRejectionRecorder()
  const identity = pipelineIdentity()
  const identities = identityAuthorityFor(identity)
  const pipeline = WorkflowPipeline.create({ identity }, identities)
  repository.seed(pipeline)
  const state: CanonicalCommandAuthorityState = {
    identity: pipeline.identity,
    specStatus: 'UNKNOWN',
    revisionState: 'ELIGIBLE',
    dependencyClosure: 'CLOSED',
    verdict: 'COMPATIBLE',
    freshness: {
      dependencyRevision: 'authority-dependency-1',
      verdictRevision: 'authority-verdict-1',
    },
  }
  const authorityState = new CanonicalCommandAuthorityStateCatalog([state])
  const handler = createAdvancePipelineHandler({
    pipelines: repository,
    identities,
    rejectionRecorder: recorder,
    authorityState,
  })

  const rejected = await handler.handle(command({
    correlation: 'T5-PRODUCTIVE-SOURCE-UNKNOWN',
    preconditions: {
      specStatus: 'KNOWN',
      revisionStatus: 'ELIGIBLE',
      dependencyClosure: 'CLOSED',
      verdict: 'COMPATIBLE',
    },
  }))
  assert.equal(rejected.status, 'REJECTED')
  if (rejected.status === 'REJECTED') assert.equal(rejected.rejection.code, 'UNKNOWN_SPEC')
  assert.equal(repository.advanceCalls, 0)

  authorityState.replace({ ...state, specStatus: 'KNOWN' })
  const accepted = await handler.handle(command({
    correlation: 'T5-PRODUCTIVE-SOURCE-KNOWN',
    preconditions: {
      specStatus: 'UNKNOWN',
      revisionStatus: 'INELIGIBLE',
      dependencyClosure: 'INVALID',
      verdict: 'INCOMPATIBLE',
    },
  }))
  assert.equal(accepted.status, 'ACCEPTED')
  assert.equal(repository.advanceCalls, 1)
})

test('canonical authority wins over conflicting caller claims and revalidates semantic truth at commit', async () => {
  const repository = new InMemoryPipelineRepository()
  const recorder = new InMemoryCommandRejectionRecorder()
  const handler = createHandler(repository, recorder)
  const canonical = commandAuthorityObservation(repository)

  const accepted = await handler.handle(command({
    preconditions: { specStatus: 'UNKNOWN', revisionStatus: 'INELIGIBLE', dependencyClosure: 'INVALID', verdict: 'INCOMPATIBLE' },
  }))
  assert.equal(accepted.status, 'ACCEPTED')
  assert.equal(repository.find(pipelineIdentity().reference)?.stage.value, 'SPECS')

  const staleRepository = new InMemoryPipelineRepository()
  const staleRecorder = new InMemoryCommandRejectionRecorder()
  const seeded = WorkflowPipeline.create({ identity: pipelineIdentity() }, identityAuthorityFor(pipelineIdentity()))
  const initial: CommandAuthorityObservation = {
    identity: seeded.identity,
    aggregateRevision: seeded.revision,
    stage: seeded.stage.value,
    preconditions: CommandPreconditionEvidence.create({
      specStatus: 'KNOWN',
      revisionStatus: 'ELIGIBLE',
      dependencyClosure: 'CLOSED',
      verdict: 'COMPATIBLE',
    }),
    freshness: commandAuthorityFreshness(),
  }
  const changed: CommandAuthorityObservation = {
    ...initial,
    preconditions: CommandPreconditionEvidence.create({
      specStatus: 'KNOWN',
      revisionStatus: 'ELIGIBLE',
      dependencyClosure: 'OPEN',
      verdict: 'COMPATIBLE',
    }),
    freshness: commandAuthorityFreshness(),
  }
  const staleHandler = createHandler(
    staleRepository,
    staleRecorder,
    pipelineIdentity(),
    new SequenceCommandAuthorityReader([initial, changed]),
  )
  const stale = await staleHandler.handle(command({
    correlation: 'T5-SEMANTIC-DRIFT-001',
  }))
  assert.equal(stale.status, 'REJECTED')
  if (stale.status === 'REJECTED') assert.equal(stale.rejection.code, 'INVALID_DEPENDENCY_CLOSURE')
  assert.equal(staleRepository.advanceCalls, 0)
  assert.equal(staleRepository.find(pipelineIdentity().reference)?.stage.value, 'ACCEPTED_ADRS')
})

test('commit-time freshness rejects same-status semantic authority drift without mutation', async () => {
  const repository = new InMemoryPipelineRepository()
  const recorder = new InMemoryCommandRejectionRecorder()
  const identity = pipelineIdentity()
  repository.seed(WorkflowPipeline.create({ identity }, identityAuthorityFor(identity)))
  const initial = commandAuthorityObservation(repository)
  const changed: CommandAuthorityObservation = {
    ...initial,
    freshness: commandAuthorityFreshness('dependency-revision-2', 'verdict-revision-1'),
  }
  const handler = new AdvancePipelineHandler(
    repository,
    identityAuthorityFor(identity),
    recorder,
    new SequenceCommandAuthorityReader([initial, changed]),
  )

  const outcome = await handler.handle(command({ correlation: 'T5-SAME-STATUS-DRIFT-001' }))

  assert.equal(outcome.status, 'REJECTED')
  if (outcome.status === 'REJECTED') {
    assert.equal(outcome.rejection.code, 'INVALID_COMMAND_BASIS')
    assert.equal(outcome.rejection.noEffect, true)
  }
  assert.equal(repository.advanceCalls, 0)
  assert.equal(repository.find(pipelineIdentity().reference)?.stage.value, 'ACCEPTED_ADRS')
  assert.equal(recorder.records.size, 1)
})

test('malformed commands use the canonical recorded no-effect boundary when correlation is recoverable', async () => {
  const repository = new InMemoryPipelineRepository()
  const recorder = new InMemoryCommandRejectionRecorder()
  const handler = createHandler(repository, recorder)

  const malformedBasis = await handler.handle({
    ...command(),
    correlation: 'T5-MALFORMED-BASIS-001',
    preconditions: undefined,
  } as never)
  assert.equal(malformedBasis.status, 'REJECTED')
  if (malformedBasis.status === 'REJECTED') {
    assert.equal(malformedBasis.rejection.code, 'INVALID_COMMAND_BASIS')
    assert.equal(malformedBasis.rejection.noEffect, true)
    assert.equal(malformedBasis.rejection.basis, undefined)
  }
  assert.equal(recorder.records.size, 1)
  assert.equal(repository.advanceCalls, 0)

  const malformedIdentity = await handler.handle({
    ...command(),
    correlation: 'T5-MALFORMED-IDENTITY-001',
    identity: { filename: 'STAGE-001.md' },
  } as never)
  assert.equal(malformedIdentity.status, 'REJECTED')
  if (malformedIdentity.status === 'REJECTED') assert.equal(malformedIdentity.rejection.code, 'INVALID_COMMAND_BASIS')
  assert.equal(recorder.records.size, 2)
  assert.equal(repository.advanceCalls, 0)

  await assert.rejects(
    handler.handle({ ...command(), correlation: '' }),
    (error: unknown) => error instanceof CommandDomainError && error.code === 'INVALID_COMMAND_CORRELATION',
  )
  assert.equal(recorder.records.size, 2)
})

test('each canonical invalid precondition records one exact rejection and leaves state unchanged', async () => {
  const cases: Array<{
    name: string
    expected: 'UNKNOWN_SPEC' | 'INELIGIBLE_REVISION' | 'INVALID_DEPENDENCY_CLOSURE' | 'INVALID_COMMAND_BASIS'
    preconditions: AdvancePipelineCommand['preconditions']
  }> = [
    {
      name: 'unknown-spec',
      expected: 'UNKNOWN_SPEC',
      preconditions: { specStatus: 'UNKNOWN', revisionStatus: 'ELIGIBLE', dependencyClosure: 'CLOSED', verdict: 'COMPATIBLE' },
    },
    {
      name: 'ineligible-revision',
      expected: 'INELIGIBLE_REVISION',
      preconditions: { specStatus: 'KNOWN', revisionStatus: 'INELIGIBLE', dependencyClosure: 'CLOSED', verdict: 'COMPATIBLE' },
    },
    {
      name: 'invalid-dependency-closure',
      expected: 'INVALID_DEPENDENCY_CLOSURE',
      preconditions: { specStatus: 'KNOWN', revisionStatus: 'ELIGIBLE', dependencyClosure: 'OPEN', verdict: 'COMPATIBLE' },
    },
    {
      name: 'invalid-command-basis',
      expected: 'INVALID_COMMAND_BASIS',
      preconditions: { specStatus: 'KNOWN', revisionStatus: 'ELIGIBLE', dependencyClosure: 'CLOSED', verdict: 'INCOMPATIBLE' },
    },
  ]

  for (const [index, candidate] of cases.entries()) {
    const repository = new InMemoryPipelineRepository()
    const recorder = new InMemoryCommandRejectionRecorder()
    const handler = createHandler(
      repository,
      recorder,
      pipelineIdentity(),
      new InMemoryCommandAuthorityReader(repository, candidate.preconditions),
    )
    const outcome = await handler.handle(command({
      correlation: `T5-INVALID-${index}`,
      preconditions: candidate.preconditions,
    }))

    assert.equal(outcome.status, 'REJECTED', candidate.name)
    if (outcome.status === 'REJECTED') {
      assert.equal(outcome.rejection.code, candidate.expected)
      assert.equal(outcome.rejection.noEffect, true)
      assert.equal(outcome.rejection.correlation.value, `T5-INVALID-${index}`)
      assert.equal(outcome.record.recorded, true)
    }
    assert.equal(repository.advanceCalls, 0, candidate.name)
    assert.equal(repository.find(pipelineIdentity().reference)?.stage.value, 'ACCEPTED_ADRS')
    assert.equal(recorder.records.size, 1)
  }
})

test('unknown canonical identity and invalid aggregate transition map to command rejections before mutation', async () => {
  const repository = new InMemoryPipelineRepository()
  const recorder = new InMemoryCommandRejectionRecorder()
  const handler = createHandler(repository, recorder)

  const unknown = await handler.handle(command({
    identity: pipelineIdentity('STAGE-UNKNOWN'),
    correlation: 'T5-UNKNOWN-001',
  }))
  assert.equal(unknown.status, 'REJECTED')
  if (unknown.status === 'REJECTED') assert.equal(unknown.rejection.code, 'UNKNOWN_SPEC')
  assert.equal(repository.advanceCalls, 0)

  const invalid = await handler.handle(command({
    correlation: 'T5-INVALID-TARGET',
    target: 'SPEC_AUDIT_REMEDIATION',
  }))
  assert.equal(invalid.status, 'REJECTED')
  if (invalid.status === 'REJECTED') assert.equal(invalid.rejection.code, 'INVALID_COMMAND_BASIS')
  assert.equal(repository.advanceCalls, 0)
  assert.equal(repository.find(pipelineIdentity().reference)?.stage.value, 'ACCEPTED_ADRS')
})

test('stale revision returns STALE_REVISION, records it, and preserves the accepted aggregate', async () => {
  const repository = new InMemoryPipelineRepository()
  const recorder = new InMemoryCommandRejectionRecorder()
  const handler = createHandler(repository, recorder)

  const accepted = await handler.handle(command({ correlation: 'T5-STALE-WINNER' }))
  assert.equal(accepted.status, 'ACCEPTED')

  const stale = await handler.handle(command({
    target: 'SPEC_AUDIT_REMEDIATION',
    correlation: 'T5-STALE-LOSER',
  }))
  assert.equal(stale.status, 'REJECTED')
  if (stale.status === 'REJECTED') {
    assert.equal(stale.rejection.code, 'STALE_REVISION')
    assert.equal(stale.rejection.basis?.expectedRevision.value, 0)
  }
  assert.equal(repository.advanceCalls, 1)
  assert.equal(repository.find(pipelineIdentity().reference)?.stage.value, 'SPECS')
  assert.equal(repository.find(pipelineIdentity().reference)?.revision.value, 1)
})

test('exact rejected replay is idempotent and cannot create an aggregate transition', async () => {
  const repository = new InMemoryPipelineRepository()
  const recorder = new InMemoryCommandRejectionRecorder()
  const handler = createHandler(
    repository,
    recorder,
    pipelineIdentity(),
    new InMemoryCommandAuthorityReader(repository, {
      specStatus: 'KNOWN',
      revisionStatus: 'ELIGIBLE',
      dependencyClosure: 'INVALID',
      verdict: 'COMPATIBLE',
    }),
  )
  const candidate = command({
    correlation: 'T5-REPLAY-001',
    preconditions: { specStatus: 'KNOWN', revisionStatus: 'ELIGIBLE', dependencyClosure: 'INVALID', verdict: 'COMPATIBLE' },
  })

  const first = await handler.handle(candidate)
  const second = await handler.handle(candidate)

  assert.equal(first.status, 'REJECTED')
  assert.equal(second.status, 'REJECTED')
  if (first.status === 'REJECTED' && second.status === 'REJECTED') {
    assert.equal(first.rejection.idempotencyKey, second.rejection.idempotencyKey)
    assert.equal(first.record, second.record)
    assert.equal(first.rejection.code, 'INVALID_DEPENDENCY_CLOSURE')
  }
  assert.equal(recorder.calls, 2)
  assert.equal(recorder.records.size, 1)
  assert.equal(repository.advanceCalls, 0)
})

test('concurrent commands sharing one expected revision have one winner and one stale rejection', async () => {
  const repository = new InMemoryPipelineRepository()
  const recorder = new InMemoryCommandRejectionRecorder()
  const handler = createHandler(repository, recorder)

  const outcomes = await Promise.all([
    handler.handle(command({ correlation: 'T5-CONCURRENT-1' })),
    handler.handle(command({ correlation: 'T5-CONCURRENT-2' })),
  ])

  assert.equal(outcomes.filter((outcome) => outcome.status === 'ACCEPTED').length, 1)
  assert.equal(outcomes.filter((outcome) => outcome.status === 'REJECTED').length, 1)
  const rejected = outcomes.find((outcome) => outcome.status === 'REJECTED')
  assert.ok(rejected)
  if (rejected?.status === 'REJECTED') assert.equal(rejected.rejection.code, 'STALE_REVISION')
  assert.equal(repository.advanceCalls, 2)
  assert.equal(repository.find(pipelineIdentity().reference)?.stage.value, 'SPECS')
})

test('canonical outcomes preserve the exact failure mapping consumed by downstream adapters', async () => {
  const repository = new InMemoryPipelineRepository()
  const recorder = new InMemoryCommandRejectionRecorder()
  const handler = createHandler(
    repository,
    recorder,
    pipelineIdentity(),
    new InMemoryCommandAuthorityReader(repository, {
      specStatus: 'KNOWN',
      revisionStatus: 'INELIGIBLE',
      dependencyClosure: 'CLOSED',
      verdict: 'COMPATIBLE',
    }),
  )
  const outcome = await handler.handle(command({
    correlation: 'T5-MAPPING-001',
    preconditions: { specStatus: 'KNOWN', revisionStatus: 'ELIGIBLE', dependencyClosure: 'CLOSED', verdict: 'COMPATIBLE' },
  }))

  const mapped = outcome.status === 'REJECTED'
    ? {
      status: outcome.status,
      family: outcome.rejection.family,
      code: outcome.rejection.code,
      correlation: outcome.rejection.correlation.value,
      noEffect: outcome.rejection.noEffect,
    }
    : { status: outcome.status, correlation: outcome.basis.correlation.value }

  assert.deepEqual(mapped, {
    status: 'REJECTED',
    family: 'SPEC_REVISION',
    code: 'INELIGIBLE_REVISION',
    correlation: 'T5-MAPPING-001',
    noEffect: true,
  })
})

test('command modules preserve the productive dependency boundary', () => {
  for (const file of [
    'src/domain/command.ts',
    'src/application/command.ts',
    'src/application/pipeline.ts',
  ]) {
    const source = readFileSync(resolve(process.cwd(), file), 'utf8')
    assert.doesNotMatch(source, /\bprototype\b|node:fs|node:path|\bhttp\b|\borm\b|\bgithub\b|\bsqlite\b|\bpostgres\b/i)
  }
})

test('command architecture guard traverses direct and transitive imports and keeps one failure authority', () => {
  const forbiddenDependency = /prototype|infrastructure|database|filesystem|http|react|vite|orm|github|sqlite|postgres|node:fs|node:path/i
  const visited = new Set<string>()
  const resolveSource = (file: string, specifier: string): string | undefined => {
    if (!specifier.startsWith('.')) return undefined
    const withoutExtension = specifier.replace(/\.js$/, '')
    const candidates = [
      resolve(dirname(file), `${withoutExtension}.ts`),
      resolve(dirname(file), `${withoutExtension}.tsx`),
      resolve(dirname(file), withoutExtension),
    ]
    return candidates.find((candidate) => existsSync(candidate))
  }
  const importSpecifiers = (source: string): string[] => {
    const matches = new Set<string>()
    const patterns = [
      /\bfrom\s*['"]([^'"]+)['"]/g,
      /\bimport\s*['"]([^'"]+)['"]/g,
      /\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
    ]
    for (const pattern of patterns) {
      for (const match of source.matchAll(pattern)) {
        if (match[1]) matches.add(match[1])
      }
    }
    return [...matches]
  }
  const visit = (file: string): void => {
    if (visited.has(file)) return
    visited.add(file)
    for (const specifier of importSpecifiers(readFileSync(file, 'utf8'))) {
      assert.doesNotMatch(specifier, forbiddenDependency, `${file} imports forbidden dependency ${specifier}`)
      const child = resolveSource(file, specifier)
      if (child) visit(child)
    }
  }

  visit(resolve(process.cwd(), 'src/application/pipeline.ts'))
  visit(resolve(process.cwd(), 'src/application/command.ts'))
  assert.equal(visited.has(resolve(process.cwd(), 'src/domain/command.ts')), true)
  const commandSource = readFileSync(resolve(process.cwd(), 'src/domain/command.ts'), 'utf8')
  const boundarySource = readFileSync(resolve(process.cwd(), 'src/application/command.ts'), 'utf8')
  assert.match(commandSource, /CanonicalFailureCode/)
  assert.doesNotMatch(boundarySource, /type\s+CanonicalFailureCode\s*=/)
  assert.match(boundarySource, /CommandAuthorityReader/)
})
