import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  AdrSpecLineageRepository,
  AdrSpecLineage,
  LineageAdvanceReservation,
  LineageDomainError,
  LineageProgress,
  LineageReservation,
} from '../src/domain/lineage.js'
import { CreateCanonicalIdentityHandler, ResolveCanonicalIdentityHandler } from '../src/application/identity.js'
import { AdvanceAdrSpecLineageHandler, RegisterAdrSpecLineageHandler } from '../src/application/lineage.js'
import {
  AGGREGATE_KINDS,
  AggregateKind,
  CanonicalIdentity,
  CanonicalIdentityCatalog,
  CanonicalStageReference,
  CanonicalIdentityGenerator,
  CanonicalIdentityRecord,
  CanonicalIdentityReference,
  CanonicalIdentityRepository,
  IdentityDomainError,
  IdentityScope,
  Revision,
} from '../src/domain/identity.js'

class InMemoryIdentityRepository implements CanonicalIdentityRepository {
  private readonly records = new Map<string, CanonicalIdentityRecord>()

  constructor(private readonly beforeReserve: () => Promise<void> = async () => {}) {}

  get size(): number {
    return this.records.size
  }

  async reserve(record: CanonicalIdentityRecord) {
    await this.beforeReserve()
    const existing = this.records.get(record.canonicalKey)
    if (existing) return { status: 'DUPLICATE' as const, existing }
    this.records.set(record.canonicalKey, record)
    return { status: 'ACCEPTED' as const, record }
  }

  find(reference: CanonicalIdentityReference): CanonicalIdentityRecord | undefined {
    return this.records.get(reference.canonicalKey)
  }
}

class InMemoryLineageRepository implements AdrSpecLineageRepository {
  private readonly lineages = new Map<string, AdrSpecLineage>()
  private readonly heldFinds = new Map<string, { lineage: AdrSpecLineage; remaining: number }>()

  constructor(private readonly beforeReserve: () => Promise<void> = async () => {}) {}

  async reserve(lineage: AdrSpecLineage): Promise<LineageReservation> {
    await this.beforeReserve()
    const existing = this.lineages.get(lineage.canonicalKey)
    if (existing) return { status: 'DUPLICATE', existing }
    this.lineages.set(lineage.canonicalKey, lineage)
    return { status: 'ACCEPTED', lineage }
  }

  holdNextFinds(adr: CanonicalIdentityReference, spec: CanonicalIdentityReference, count: number): void {
    const key = `${adr.canonicalKey}->${spec.canonicalKey}`
    const lineage = this.lineages.get(key)
    if (!lineage) throw new Error(`Lineage ${key} must be seeded before its reads are held.`)
    this.heldFinds.set(key, { lineage, remaining: count })
  }

  advance(lineage: AdrSpecLineage, expectedProgress: LineageProgress): LineageAdvanceReservation {
    const existing = this.lineages.get(lineage.canonicalKey)
    if (!existing) return { status: 'NOT_FOUND' }
    if (!existing.progress.equals(expectedProgress)) return { status: 'STALE', existing }
    this.lineages.set(lineage.canonicalKey, lineage)
    return { status: 'ADVANCED', lineage }
  }

  find(adr: CanonicalIdentityReference, spec: CanonicalIdentityReference): AdrSpecLineage | undefined {
    const key = `${adr.canonicalKey}->${spec.canonicalKey}`
    const held = this.heldFinds.get(key)
    if (held && held.remaining > 0) {
      held.remaining -= 1
      if (held.remaining === 0) this.heldFinds.delete(key)
      return held.lineage
    }
    return this.lineages.get(key)
  }

  listByAdr(adr: CanonicalIdentityReference): readonly AdrSpecLineage[] {
    return [...this.lineages.values()].filter((lineage) => lineage.referencesAdr(adr))
  }

  listBySpec(spec: CanonicalIdentityReference): readonly AdrSpecLineage[] {
    return [...this.lineages.values()].filter((lineage) => lineage.referencesSpec(spec))
  }
}

const generator: CanonicalIdentityGenerator = {
  next: ({ kind }) => `${kind}-GENERATED`,
}

function identityCatalog(repository = new InMemoryIdentityRepository()): CanonicalIdentityCatalog {
  return new CanonicalIdentityCatalog(repository, generator, () => '2026-09-09T12:00:00.000Z')
}

async function createIdentity(
  handler: CreateCanonicalIdentityHandler,
  kind: AggregateKind,
  value: string,
  revision = 1,
  scope = 'workflow',
): Promise<CanonicalIdentityRecord> {
  return handler.handle({ kind, scope, value, revision })
}

class DeterministicInterleavingBarrier {
  private arrivals = 0
  private readonly released: Promise<void>
  private release!: () => void

  constructor(private readonly participants: number) {
    this.released = new Promise<void>((resolve) => {
      this.release = resolve
    })
  }

  async wait(): Promise<void> {
    this.arrivals += 1
    if (this.arrivals === this.participants) this.release()
    await this.released
  }
}

test('creates stable identities, scopes uniqueness, and preserves kind distinctions', async () => {
  const catalog = identityCatalog()
  const create = new CreateCanonicalIdentityHandler(catalog)
  const adr = await createIdentity(create, 'ADR', 'ADR-0001')
  const sameValueInOtherScope = await createIdentity(create, 'ADR', 'ADR-0001', 1, 'other-workflow')
  const sameValueAsAnotherKind = await createIdentity(create, 'SPEC', 'ADR-0001')

  assert.equal(adr.identity.kind, 'ADR')
  assert.equal(adr.identity.scope.value, 'workflow')
  assert.notEqual(adr.canonicalKey, sameValueInOtherScope.canonicalKey)
  assert.notEqual(adr.identity.canonicalKey, sameValueAsAnotherKind.identity.canonicalKey)
  assert.deepEqual(AGGREGATE_KINDS.includes('AGENT'), true)
  assert.deepEqual(AGGREGATE_KINDS.includes('ASSIGNMENT' as AggregateKind), false)
  assert.deepEqual(AGGREGATE_KINDS.includes('SESSION' as AggregateKind), false)
  assert.deepEqual(AGGREGATE_KINDS.includes('EXTERNAL_EFFECT'), true)
  assert.deepEqual(AGGREGATE_KINDS.includes('PUBLICATION'), true)
  assert.equal(Object.isFrozen(AGGREGATE_KINDS), true)
  assert.throws(() => (AGGREGATE_KINDS as unknown as string[]).push('FORGED'))
  assert.throws(
    () => CanonicalIdentity.create({ kind: 'FORGED' as AggregateKind, scope: 'workflow', value: 'forged' }),
    (error: unknown) => error instanceof IdentityDomainError && error.code === 'INVALID_AGGREGATE_KIND',
  )
})

test('rejects duplicate canonical records atomically in the scoped revision key', async () => {
  const catalog = identityCatalog()
  const create = new CreateCanonicalIdentityHandler(catalog)
  await createIdentity(create, 'ADR', 'ADR-0001')

  await assert.rejects(
    createIdentity(create, 'ADR', 'ADR-0001'),
    (error: unknown) => error instanceof IdentityDomainError && error.code === 'IDENTITY_ALREADY_EXISTS',
  )

  const nextRevision = await create.handle({
    kind: 'ADR',
    scope: 'workflow',
    revision: 2,
    existingReference: { identity: { kind: 'ADR', scope: 'workflow', value: 'ADR-0001' }, revision: 1 },
  })
  assert.equal(nextRevision.revision.value, 2)
})

test('requires a resolved prior identity and preserves it for unsupplied revision values', async () => {
  let generated = 0
  const recordingGenerator: CanonicalIdentityGenerator = {
    next: ({ kind }) => {
      generated += 1
      return `${kind}-GENERATED`
    },
  }
  const repository = new InMemoryIdentityRepository()
  const catalog = new CanonicalIdentityCatalog(repository, recordingGenerator, () => '2026-09-09T12:00:00.000Z')
  const create = new CreateCanonicalIdentityHandler(catalog)
  const resolve = new ResolveCanonicalIdentityHandler(catalog)

  const revisionOne = await create.handle({ kind: 'ADR', scope: 'workflow' })
  assert.equal(generated, 1)
  await assert.rejects(
    create.handle({ kind: 'ADR', scope: 'workflow', revision: 2 }),
    (error: unknown) => error instanceof IdentityDomainError && error.code === 'IDENTITY_REFERENCE_REQUIRED',
  )
  await assert.rejects(
    create.handle({
      kind: 'ADR',
      scope: 'workflow',
      revision: 2,
      existingReference: { identity: { kind: 'ADR', scope: 'workflow', value: 'ADR-UNKNOWN' }, revision: 1 },
    }),
    (error: unknown) => error instanceof IdentityDomainError && error.code === 'IDENTITY_NOT_FOUND',
  )

  const revisionTwo = await create.handle({
    kind: 'ADR',
    scope: 'workflow',
    revision: 2,
    existingReference: { identity: revisionOne.identity, revision: revisionOne.revision },
  })

  assert.equal(generated, 1)
  assert.equal(revisionTwo.identity.canonicalKey, revisionOne.identity.canonicalKey)
  assert.equal(resolve.handle(revisionOne.reference), revisionOne)
  assert.equal(resolve.handle(revisionTwo.reference), revisionTwo)
  await assert.rejects(
    create.handle({
      kind: 'ADR',
      scope: 'workflow',
      revision: 3,
      existingReference: { identity: revisionOne.identity, revision: revisionOne.revision },
      value: 'ADR-FORK',
    }),
    (error: unknown) => error instanceof IdentityDomainError && error.code === 'IDENTITY_REFERENCE_MISMATCH',
  )
})

test('keeps revision continuity rules cohesive across kind, scope, and ordering', async () => {
  const catalog = identityCatalog()
  const create = new CreateCanonicalIdentityHandler(catalog)
  const revisionOne = await createIdentity(create, 'ADR', 'ADR-0001')

  for (const existingReference of [
    { identity: { kind: 'SPEC' as const, scope: 'workflow', value: 'ADR-0001' }, revision: 1 },
    { identity: { kind: 'ADR' as const, scope: 'other-workflow', value: 'ADR-0001' }, revision: 1 },
    { identity: revisionOne.identity, revision: 2 },
  ]) {
    await assert.rejects(
      create.handle({ kind: 'ADR', scope: 'workflow', revision: 2, existingReference }),
      (error: unknown) => error instanceof IdentityDomainError && error.code === 'IDENTITY_REFERENCE_MISMATCH',
    )
  }
})

test('rejects skipped identity successors without reserving fabricated history', async () => {
  const repository = new InMemoryIdentityRepository()
  const catalog = identityCatalog(repository)
  const create = new CreateCanonicalIdentityHandler(catalog)
  const revisionOne = await createIdentity(create, 'ADR', 'ADR-SKIP')

  await assert.rejects(
    create.handle({
      kind: 'ADR',
      scope: 'workflow',
      revision: 3,
      existingReference: revisionOne.reference,
    }),
    (error: unknown) => error instanceof IdentityDomainError && error.code === 'IDENTITY_REFERENCE_MISMATCH',
  )

  assert.equal(repository.size, 1)
  assert.equal(repository.find(revisionOne.reference), revisionOne)
})

test('preserves stable identity across historical ADR↔SPEC lineage revisions', async () => {
  const identities = identityCatalog()
  const create = new CreateCanonicalIdentityHandler(identities)
  const adrOne = await createIdentity(create, 'ADR', 'ADR-0001')
  const specOne = await createIdentity(create, 'SPEC', 'SPEC-DOM-001')
  const adrTwo = await create.handle({
    kind: 'ADR',
    scope: 'workflow',
    revision: 2,
    existingReference: { identity: adrOne.identity, revision: adrOne.revision },
  })
  const specTwo = await create.handle({
    kind: 'SPEC',
    scope: 'workflow',
    revision: 2,
    existingReference: { identity: specOne.identity, revision: specOne.revision },
  })
  const repository = new InMemoryLineageRepository()
  const register = new RegisterAdrSpecLineageHandler(repository, identities)

  const firstRevisionLineage = await register.handle({
    adr: adrOne.reference,
    spec: specOne.reference,
  })
  const secondRevisionLineage = await register.handle({
    adr: adrTwo.reference,
    spec: specTwo.reference,
  })

  assert.equal(adrTwo.identity.canonicalKey, adrOne.identity.canonicalKey)
  assert.equal(specTwo.identity.canonicalKey, specOne.identity.canonicalKey)
  assert.equal(firstRevisionLineage.adr.identity.canonicalKey, secondRevisionLineage.adr.identity.canonicalKey)
  assert.equal(firstRevisionLineage.spec.identity.canonicalKey, secondRevisionLineage.spec.identity.canonicalKey)
  assert.notEqual(firstRevisionLineage.canonicalKey, secondRevisionLineage.canonicalKey)
  assert.equal(repository.listByAdr(adrOne.reference).length, 1)
  assert.equal(repository.listByAdr(adrTwo.reference).length, 1)
})

test('proves one-winner identity reservation for concurrently scheduled equivalent creates', async () => {
  const barrier = new DeterministicInterleavingBarrier(20)
  const repository = new InMemoryIdentityRepository(() => barrier.wait())
  const catalog = identityCatalog(repository)
  const create = new CreateCanonicalIdentityHandler(catalog)

  const attempts = await Promise.allSettled(
    Array.from({ length: 20 }, () => createIdentity(create, 'ADR', 'ADR-CONCURRENT')),
  )
  const accepted = attempts.filter((attempt) => attempt.status === 'fulfilled')
  const duplicates = attempts.filter(
    (attempt): attempt is PromiseRejectedResult =>
      attempt.status === 'rejected' && attempt.reason instanceof IdentityDomainError && attempt.reason.code === 'IDENTITY_ALREADY_EXISTS',
  )

  assert.equal(accepted.length, 1)
  assert.equal(duplicates.length, 19)
  assert.equal(repository.size, 1)
})

test('proves one-winner lineage reservation across deterministic async interleavings', async () => {
  const identities = identityCatalog()
  const create = new CreateCanonicalIdentityHandler(identities)
  const adr = await createIdentity(create, 'ADR', 'ADR-CONCURRENT')
  const spec = await createIdentity(create, 'SPEC', 'SPEC-CONCURRENT')
  const barrier = new DeterministicInterleavingBarrier(20)
  const repository = new InMemoryLineageRepository(() => barrier.wait())
  const register = new RegisterAdrSpecLineageHandler(repository, identities)
  const input = {
    adr: { identity: adr.identity, revision: adr.revision },
    spec: { identity: spec.identity, revision: spec.revision },
  }

  const attempts = await Promise.allSettled(Array.from({ length: 20 }, () => register.handle(input)))
  const accepted = attempts.filter((attempt) => attempt.status === 'fulfilled')
  const duplicates = attempts.filter(
    (attempt): attempt is PromiseRejectedResult =>
      attempt.status === 'rejected' && attempt.reason instanceof LineageDomainError && attempt.reason.code === 'LINEAGE_ALREADY_EXISTS',
  )

  assert.equal(accepted.length, 1)
  assert.equal(duplicates.length, 19)
  assert.equal(repository.listByAdr(adr.reference).length, 1)
})

test('resolves exact historical revisions and rejects invalid references', async () => {
  const catalog = identityCatalog()
  const create = new CreateCanonicalIdentityHandler(catalog)
  const resolve = new ResolveCanonicalIdentityHandler(catalog)
  const revisionOne = await createIdentity(create, 'ADR', 'ADR-0001', 1)
  const revisionTwo = await create.handle({
    kind: 'ADR',
    scope: 'workflow',
    revision: 2,
    existingReference: { identity: revisionOne.identity, revision: revisionOne.revision },
  })

  assert.equal(resolve.handle({ identity: revisionOne.identity, revision: 1 }).canonicalKey, revisionOne.canonicalKey)
  assert.equal(resolve.handle({ identity: revisionTwo.identity, revision: 2 }).canonicalKey, revisionTwo.canonicalKey)
  assert.throws(
    () => resolve.handle({ identity: revisionOne.identity, revision: 3 }),
    (error: unknown) => error instanceof IdentityDomainError && error.code === 'IDENTITY_NOT_FOUND',
  )
  assert.throws(() => Revision.create(0), (error: unknown) => error instanceof IdentityDomainError && error.code === 'INVALID_REVISION')
  assert.throws(() => IdentityScope.create(''), (error: unknown) => error instanceof IdentityDomainError && error.code === 'INVALID_SCOPE')
})

test('keeps created identity records and revisions immutable', async () => {
  const record = await createIdentity(new CreateCanonicalIdentityHandler(identityCatalog()), 'ADR', 'ADR-0001')

  assert.equal(Object.isFrozen(record), true)
  assert.equal(Object.isFrozen(record.identity), true)
  assert.equal(Object.isFrozen(record.revision), true)
  try {
    ;(record as unknown as { createdAt: string }).createdAt = 'changed'
    ;(record.identity as unknown as { value: string }).value = 'changed'
  } catch {
    // Strict runtimes throw on writes to frozen records; both outcomes are immutable.
  }
  assert.equal(record.createdAt, '2026-09-09T12:00:00.000Z')
  assert.equal(record.identity.value, 'ADR-0001')
  assert.equal(record.revision.value, 1)
})

test('rehydrates canonical identity records through the validated immutable boundary', async () => {
  const record = await createIdentity(new CreateCanonicalIdentityHandler(identityCatalog()), 'STAGE', 'STAGE-001')
  const rehydrated = CanonicalIdentityRecord.rehydrate({
    identity: record.identity,
    revision: record.revision,
    createdAt: record.createdAt,
  })

  assert.equal(rehydrated.canonicalKey, record.canonicalKey)
  assert.equal(rehydrated.createdAt, record.createdAt)
  assert.equal(Object.isFrozen(rehydrated), true)
  assert.equal(Object.isFrozen(rehydrated.identity), true)
  assert.equal(Object.isFrozen(rehydrated.revision), true)
})

test('narrows WorkflowPipeline identity to the canonical STAGE reference', () => {
  const stage = CanonicalStageReference.create({
    executionId: 'EXECUTION-001',
    stageId: 'STAGE-001',
    revision: 1,
  })

  assert.equal(stage.identity.kind, 'STAGE')
  assert.equal(stage.identity.scope.value, 'EXECUTION-001')
  assert.equal(stage.identity.value, 'STAGE-001')
  assert.equal(stage.revision.value, 1)
  assert.equal(stage.canonicalKey, 'STAGE|EXECUTION-001|STAGE-001|revision=1')
  assert.equal(Object.isFrozen(stage), true)
  assert.throws(
    () => CanonicalStageReference.create({ executionId: '', stageId: 'STAGE-001', revision: 1 }),
    (error: unknown) => error instanceof IdentityDomainError && error.code === 'INVALID_SCOPE',
  )
  assert.throws(
    () => CanonicalStageReference.create({ executionId: 'EXECUTION-001', stageId: 'STAGE-001', revision: 0 }),
    (error: unknown) => error instanceof IdentityDomainError && error.code === 'INVALID_REVISION',
  )
})

test('does not accept PipelineId-shaped input as a canonical identity command', async () => {
  const create = new CreateCanonicalIdentityHandler(identityCatalog())

  await assert.rejects(
    create.handle({ id: 'PIPELINE-001' } as never),
    (error: unknown) => error instanceof IdentityDomainError && error.code === 'INVALID_AGGREGATE_KIND',
  )
})

test('does not infer identity from a filename-only input', async () => {
  const create = new CreateCanonicalIdentityHandler(identityCatalog())

  await assert.rejects(
    create.handle({ filename: 'ADR-0001.md' } as never),
    (error: unknown) => error instanceof IdentityDomainError && error.code === 'INVALID_AGGREGATE_KIND',
  )
})

test('keeps EXEC-owned assignment and session identities outside the DOM catalog authority', async () => {
  const catalog = identityCatalog()

  for (const kind of ['ASSIGNMENT', 'SESSION'] as const) {
    await assert.rejects(
      catalog.create({ kind: kind as AggregateKind, scope: 'workflow', value: `${kind}-001` }),
      (error: unknown) => error instanceof IdentityDomainError && error.code === 'INVALID_AGGREGATE_KIND',
    )
    assert.throws(
      () => catalog.resolve({ identity: { kind: kind as AggregateKind, scope: 'workflow', value: `${kind}-001` }, revision: 1 }),
      (error: unknown) => error instanceof IdentityDomainError && error.code === 'INVALID_AGGREGATE_KIND',
    )
  }
})

test('represents independent many-to-many ADR↔SPEC lineage', async () => {
  const identities = identityCatalog()
  const create = new CreateCanonicalIdentityHandler(identities)
  const adrOne = await createIdentity(create, 'ADR', 'ADR-0001')
  const adrTwo = await createIdentity(create, 'ADR', 'ADR-0002')
  const specOne = await createIdentity(create, 'SPEC', 'SPEC-DOM-001')
  const specTwo = await createIdentity(create, 'SPEC', 'SPEC-PLAT-001')
  const repository = new InMemoryLineageRepository()
  const register = new RegisterAdrSpecLineageHandler(repository, identities)

  const first = await register.handle({
    adr: { identity: adrOne.identity, revision: adrOne.revision },
    spec: { identity: specOne.identity, revision: specOne.revision },
  })
  const second = await register.handle({
    adr: { identity: adrOne.identity, revision: adrOne.revision },
    spec: { identity: specTwo.identity, revision: specTwo.revision },
  })
  const third = await register.handle({
    adr: { identity: adrTwo.identity, revision: adrTwo.revision },
    spec: { identity: specOne.identity, revision: specOne.revision },
  })

  assert.equal(repository.listByAdr(adrOne.reference).length, 2)
  assert.equal(repository.listBySpec(specOne.reference).length, 2)
  assert.notEqual(first.canonicalKey, second.canonicalKey)
  assert.notEqual(second.canonicalKey, third.canonicalKey)
  assert.equal(repository.find(adrOne.reference, specOne.reference), first)
  assert.equal(repository.find(adrOne.reference, specTwo.reference), second)
  assert.equal(repository.find(adrTwo.reference, specOne.reference), third)
  await assert.rejects(register.handle({ adr: { identity: specOne.identity, revision: 1 }, spec: { identity: adrOne.identity, revision: 1 } }), /ADR↔SPEC/)
  await assert.rejects(
    register.handle({ adr: { identity: adrOne.identity, revision: 1 }, spec: { identity: { kind: 'SPEC', scope: 'workflow', value: 'SPEC-UNKNOWN' }, revision: 1 } }),
    (error: unknown) => error instanceof IdentityDomainError && error.code === 'IDENTITY_NOT_FOUND',
  )
})

test('rejects duplicate lineage without changing another relation', async () => {
  const identities = identityCatalog()
  const create = new CreateCanonicalIdentityHandler(identities)
  const adr = await createIdentity(create, 'ADR', 'ADR-0001')
  const specA = await createIdentity(create, 'SPEC', 'SPEC-A')
  const specB = await createIdentity(create, 'SPEC', 'SPEC-B')
  const repository = new InMemoryLineageRepository()
  const register = new RegisterAdrSpecLineageHandler(repository, identities)
  const relationA = await register.handle({ adr: { identity: adr.identity, revision: 1 }, spec: { identity: specA.identity, revision: 1 } })
  const relationB = await register.handle({ adr: { identity: adr.identity, revision: 1 }, spec: { identity: specB.identity, revision: 1 } })

  await assert.rejects(register.handle({ adr: { identity: adr.identity, revision: 1 }, spec: { identity: specA.identity, revision: 1 } }), /already exists/)
  assert.equal(repository.find(adr.reference, specA.reference), relationA)
  assert.equal(repository.find(adr.reference, specB.reference), relationB)
  assert.equal(repository.listByAdr(adr.reference).length, 2)
})

test('advances one lineage relation without mutating another relation', async () => {
  const identities = identityCatalog()
  const create = new CreateCanonicalIdentityHandler(identities)
  const adr = await createIdentity(create, 'ADR', 'ADR-0001')
  const specA = await createIdentity(create, 'SPEC', 'SPEC-A')
  const specB = await createIdentity(create, 'SPEC', 'SPEC-B')
  const repository = new InMemoryLineageRepository()
  const register = new RegisterAdrSpecLineageHandler(repository, identities)
  const advance = new AdvanceAdrSpecLineageHandler(repository)
  const relationA = await register.handle({ adr: { identity: adr.identity, revision: 1 }, spec: { identity: specA.identity, revision: 1 } })
  const relationB = await register.handle({ adr: { identity: adr.identity, revision: 1 }, spec: { identity: specB.identity, revision: 1 } })

  const progressed = advance.handle({
    adr: { identity: adr.identity, revision: adr.revision },
    spec: { identity: specA.identity, revision: specA.revision },
  })

  assert.equal(relationA.progress.value, 0)
  assert.equal(progressed.progress.value, 1)
  assert.equal(repository.find(adr.reference, specA.reference)?.progress.value, 1)
  assert.equal(repository.find(adr.reference, specB.reference), relationB)
  assert.equal(repository.find(adr.reference, specB.reference)?.progress.value, 0)
  assert.equal(progressed.canonicalKey, relationA.canonicalKey)

  const stale = repository.advance(progressed.advance(), relationA.progress)
  assert.equal(stale.status, 'STALE')
  assert.equal(repository.find(adr.reference, specA.reference)?.progress.value, 1)
})

test('proves one same-pair lineage advance wins and the conflicting advance is stale', async () => {
  const identities = identityCatalog()
  const create = new CreateCanonicalIdentityHandler(identities)
  const adr = await createIdentity(create, 'ADR', 'ADR-CONFLICT')
  const spec = await createIdentity(create, 'SPEC', 'SPEC-CONFLICT')
  const repository = new InMemoryLineageRepository()
  const register = new RegisterAdrSpecLineageHandler(repository, identities)
  const advance = new AdvanceAdrSpecLineageHandler(repository)
  await register.handle({ adr: adr.reference, spec: spec.reference })

  repository.holdNextFinds(adr.reference, spec.reference, 2)
  const input = { adr: adr.reference, spec: spec.reference }
  const attempts = await Promise.allSettled([
    Promise.resolve().then(() => advance.handle(input)),
    Promise.resolve().then(() => advance.handle(input)),
  ])
  const advanced = attempts.filter((attempt) => attempt.status === 'fulfilled')
  const stale = attempts.filter(
    (attempt): attempt is PromiseRejectedResult =>
      attempt.status === 'rejected'
      && attempt.reason instanceof LineageDomainError
      && attempt.reason.code === 'LINEAGE_CONCURRENT_MODIFICATION',
  )

  assert.equal(advanced.length, 1)
  assert.equal(stale.length, 1)
  assert.equal(repository.find(adr.reference, spec.reference)?.progress.value, 1)
})

test('rehydrates persisted lineage through a validated immutable boundary', async () => {
  const identities = identityCatalog()
  const create = new CreateCanonicalIdentityHandler(identities)
  const adr = await createIdentity(create, 'ADR', 'ADR-0001')
  const spec = await createIdentity(create, 'SPEC', 'SPEC-DOM-001')

  const rehydrated = AdrSpecLineage.rehydrate({
    adr: adr.reference,
    spec: spec.reference,
    progress: 4,
  })

  assert.equal(rehydrated.progress.value, 4)
  assert.equal(rehydrated.canonicalKey, `${adr.reference.canonicalKey}->${spec.reference.canonicalKey}`)
  assert.equal(Object.isFrozen(rehydrated), true)
  assert.equal(Object.isFrozen(rehydrated.progress), true)
  assert.equal(rehydrated.advance().progress.value, 5)
  assert.equal(rehydrated.advance().adr, rehydrated.adr)
  assert.equal(rehydrated.advance().spec, rehydrated.spec)

  assert.throws(
    () => AdrSpecLineage.rehydrate({ adr: spec.reference, spec: adr.reference, progress: 4 }),
    (error: unknown) => error instanceof LineageDomainError && error.code === 'INVALID_LINEAGE_ENDPOINT',
  )
  assert.throws(
    () => AdrSpecLineage.rehydrate({ adr: adr.reference, spec: spec.reference, progress: -1 }),
    (error: unknown) => error instanceof LineageDomainError && error.code === 'INVALID_LINEAGE_PROGRESS',
  )
})

test('enforces the productive architecture and identity-kind boundaries', () => {
  const testDirectory = dirname(fileURLToPath(import.meta.url))
  const sourceFiles = [
    resolve(testDirectory, '..', 'src', 'domain', 'identity.ts'),
    resolve(testDirectory, '..', 'src', 'domain', 'lineage.ts'),
    resolve(testDirectory, '..', 'src', 'application', 'identity.ts'),
    resolve(testDirectory, '..', 'src', 'application', 'lineage.ts'),
  ]
  const forbiddenImport = /(?:from\s+|import\s*\()\s*['"][^'"]*(?:prototype|infrastructure|database|filesystem|http|react|vite)[^'"]*['"]/i

  for (const sourceFile of sourceFiles) {
    assert.doesNotMatch(readFileSync(sourceFile, 'utf8'), forbiddenImport, sourceFile)
  }

  const applicationIdentitySource = readFileSync(sourceFiles[2], 'utf8')
  assert.match(applicationIdentitySource, /ExecOwnedIdentityReference/)
  assert.match(applicationIdentitySource, /execOwnedIdentityReferenceBrand/)

  assert.equal(new Set(AGGREGATE_KINDS).size, AGGREGATE_KINDS.length)
  assert.notEqual(CanonicalIdentity.create({ kind: 'ADR', scope: 'workflow', value: 'same' }).canonicalKey,
    CanonicalIdentity.create({ kind: 'SPEC', scope: 'workflow', value: 'same' }).canonicalKey)
})
