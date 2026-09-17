import assert from 'node:assert/strict'
import test from 'node:test'
import { dirname, resolve } from 'node:path'
import { existsSync, readFileSync } from 'node:fs'
import {
  CanonicalIdentityCatalog,
  CanonicalIdentityGenerator,
  CanonicalIdentityRecord,
  CanonicalIdentityReference,
  CanonicalIdentityRepository,
} from '../src/domain/identity.js'
import {
  AdrAuthorityCatalog,
  AdrContentHash as AuthorityAdrContentHash,
  AdrRecord,
  DerivedEligibility,
  observationFromRecord,
  type AdrAuthorityObservation,
  type AdrAuthorityReader,
} from '../src/domain/adr.js'
import {
  ExecutionSnapshot,
  ExecutionSnapshotReconstructionAuthorities,
  ExecutionSnapshotRepository,
  ConfigurationVersion,
  ExactVersionSet,
  SnapshotBase,
  SnapshotDomainError,
  SnapshotId,
  SnapshotProgressionRecordInput,
  SnapshotProgressionReconstructionAuthority,
} from '../src/domain/snapshot.js'
import {
  SubmitManualExecutionCommand,
  SubmitManualExecutionHandler,
} from '../src/application/snapshot.js'

class InMemoryIdentityRepository implements CanonicalIdentityRepository {
  private readonly records = new Map<string, CanonicalIdentityRecord>()

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

class ReservationBarrier {
  private entered = 0
  private resolveAllEntered!: () => void
  private resolveRelease!: () => void

  readonly allEntered = new Promise<void>((resolve) => {
    this.resolveAllEntered = resolve
  })

  private readonly released = new Promise<void>((resolve) => {
    this.resolveRelease = resolve
  })

  wait(): Promise<void> {
    this.entered += 1
    if (this.entered === 2) this.resolveAllEntered()
    return this.released
  }

  release(): void {
    this.resolveRelease()
  }
}

class InMemorySnapshotRepository implements ExecutionSnapshotRepository {
  private readonly snapshots = new Map<string, ExecutionSnapshot>()
  reserveCalls = 0

  constructor(private readonly reservationBarrier?: ReservationBarrier) {}

  async reserve(snapshot: ExecutionSnapshot) {
    this.reserveCalls += 1
    if (this.reservationBarrier) await this.reservationBarrier.wait()
    const existing = this.snapshots.get(snapshot.id.value)
    if (existing) return { status: 'DUPLICATE' as const, existing }
    this.snapshots.set(snapshot.id.value, snapshot)
    return { status: 'ACCEPTED' as const, snapshot }
  }

  async confirm(snapshot: ExecutionSnapshot) {
    const existing = this.snapshots.get(snapshot.id.value)
    if (!existing) return { status: 'NOT_FOUND' as const }
    if (existing.status !== 'DRAFT' || !existing.hasSameAuthorityBasis(snapshot)) {
      return { status: 'STALE' as const, existing }
    }
    this.snapshots.set(snapshot.id.value, snapshot)
    return { status: 'CONFIRMED' as const, snapshot }
  }

  find(id: SnapshotId): ExecutionSnapshot | undefined {
    return this.snapshots.get(id.value)
  }
}

class InMemorySnapshotProgressionAuthority implements SnapshotProgressionReconstructionAuthority {
  private readonly records = new Map<string, readonly SnapshotProgressionRecordInput[]>()
  resolveCalls = 0

  seed(id: string, records: readonly SnapshotProgressionRecordInput[]): void {
    this.records.set(id, records)
  }

  resolveForRehydration(id: SnapshotId): readonly SnapshotProgressionRecordInput[] | undefined {
    this.resolveCalls += 1
    return this.records.get(id.value)
  }
}

function rehydrationAuthorities(
  catalog: CanonicalIdentityCatalog,
  adrAuthority: AdrAuthorityCatalog,
  id: string,
  status: 'DRAFT' | 'CONFIRMED',
): ExecutionSnapshotReconstructionAuthorities {
  const progression = new InMemorySnapshotProgressionAuthority()
  const basis = {
    id,
    spec: { identity: { kind: 'SPEC' as const, scope: 'workflow', value: 'SPEC-DOM-001' }, revision: 1 },
    adrs: [{
      reference: { identity: { kind: 'ADR' as const, scope: 'workflow', value: 'ADR-0001' }, revision: 1 },
      decisionStatus: 'ACCEPTED' as const,
      contentHash: 'sha256:adr-1',
    }],
    base: 'commit-base-1',
    configuration: 'config-1',
    versions: ExactVersionSet.create({ skill: 'skill-1', contract: 'contract-1' }),
  }
  progression.seed(id, status === 'DRAFT'
    ? [{ ...basis, status: 'DRAFT' }]
    : [{ ...basis, status: 'DRAFT' }, { ...basis, status: 'CONFIRMED' }])
  return { identities: catalog, adrs: adrAuthority, progression }
}

const generator: CanonicalIdentityGenerator = {
  next: ({ kind }) => `${kind}-GENERATED`,
}

async function createFixture() {
  const catalog = new CanonicalIdentityCatalog(
    new InMemoryIdentityRepository(),
    generator,
    () => '2026-09-09T12:00:00.000Z',
  )
  const adr = await catalog.create({ kind: 'ADR', scope: 'workflow', value: 'ADR-0001' })
  const spec = await catalog.create({ kind: 'SPEC', scope: 'workflow', value: 'SPEC-DOM-001' })
  const adrAuthority = new AdrAuthorityCatalog()
  adrAuthority.registerInitial(AdrRecord.create({
    reference: adr.reference,
    contentHash: 'sha256:adr-1',
    decisionStatus: 'ACCEPTED',
    realizationStatus: 'UNPROCESSED',
    derivedEligibility: DerivedEligibility.eligible(),
  }))
  return { catalog, adr, spec, adrAuthority }
}

class SequenceAdrAuthorityReader implements AdrAuthorityReader {
  calls = 0

  constructor(private readonly observations: readonly AdrAuthorityObservation[]) {}

  observe(reference: CanonicalIdentityReference): AdrAuthorityObservation | undefined {
    const observation = this.observations[Math.min(this.calls, this.observations.length - 1)]
    this.calls += 1
    if (!observation || !observation.reference.equals(reference)) return undefined
    return observation
  }
}

function commandFor(
  adr: { reference: CanonicalIdentityReference },
  spec: { reference: CanonicalIdentityReference },
  overrides: Partial<SubmitManualExecutionCommand> = {},
): SubmitManualExecutionCommand {
  return {
    snapshotId: 'SNAPSHOT-001',
    spec: spec.reference,
    adrs: [{ reference: adr.reference, decisionStatus: 'ACCEPTED', contentHash: 'sha256:adr-1' }],
    base: 'commit-base-1',
    configuration: 'config-1',
    versions: { skill: 'skill-1', contract: 'contract-1' },
    ...overrides,
  }
}

function snapshotInput(id = 'SNAPSHOT-TEST') {
  return {
    id,
    spec: { identity: { kind: 'SPEC' as const, scope: 'workflow', value: 'SPEC-DOM-001' }, revision: 1 },
    adrs: [{
      reference: { identity: { kind: 'ADR' as const, scope: 'workflow', value: 'ADR-0001' }, revision: 1 },
      decisionStatus: 'ACCEPTED' as const,
      contentHash: 'sha256:adr-1',
    }],
    base: 'commit-base-1',
    configuration: 'config-1',
    versions: ExactVersionSet.create({ skill: 'skill-1', contract: 'contract-1' }),
  }
}

function snapshotCreationAuthorities(catalog: CanonicalIdentityCatalog, adrAuthority: AdrAuthorityReader) {
  return { identities: catalog, adrs: adrAuthority }
}

test('manual submission creates a confirmed immutable snapshot with exact authority basis', async () => {
  const { catalog, adr, spec, adrAuthority } = await createFixture()
  const repository = new InMemorySnapshotRepository()
  const handler = new SubmitManualExecutionHandler(catalog, repository, adrAuthority)

  const snapshot = await handler.handle(commandFor(adr, spec))

  assert.equal(snapshot.status, 'CONFIRMED')
  assert.equal(snapshot.spec.identity.kind, 'SPEC')
  assert.equal(snapshot.adrs[0]?.reference.identity.kind, 'ADR')
  assert.equal(snapshot.adrs[0]?.contentHash.value, 'sha256:adr-1')
  assert.equal(snapshot.base.value, 'commit-base-1')
  assert.equal(snapshot.configuration.value, 'config-1')
  assert.deepEqual({ skill: snapshot.versions.skill, contract: snapshot.versions.contract }, {
    skill: 'skill-1',
    contract: 'contract-1',
  })
  assert.equal(Object.isFrozen(snapshot), true)
  assert.equal(Object.isFrozen(snapshot.adrs), true)
  assert.equal(Object.isFrozen(snapshot.adrs[0]), true)
  assert.equal(repository.find(SnapshotId.create('SNAPSHOT-001')), snapshot)
})

test('snapshot admission requires canonical authority and repository outcomes preserve isolation', async () => {
  const { catalog, adrAuthority } = await createFixture()
  const input = snapshotInput()
  assert.throws(
    () => (ExecutionSnapshot.create as unknown as (value: unknown) => unknown)(input),
    (error: unknown) => error instanceof SnapshotDomainError && error.code === 'SNAPSHOT_RECONSTRUCTION_AUTHORITY_REQUIRED',
  )

  const draft = ExecutionSnapshot.create(input, snapshotCreationAuthorities(catalog, adrAuthority))
  const repository = new InMemorySnapshotRepository()
  const reserved = await repository.reserve(draft)
  assert.equal(reserved.status, 'ACCEPTED')
  const duplicate = await repository.reserve(draft)
  assert.equal(duplicate.status, 'DUPLICATE')
  if (duplicate.status === 'DUPLICATE') assert.equal(duplicate.existing, draft)

  const changed = ExecutionSnapshot.create({ ...input, base: 'commit-base-2' }, snapshotCreationAuthorities(catalog, adrAuthority))
  const stale = await repository.confirm(changed)
  assert.equal(stale.status, 'STALE')
  assert.equal(repository.find(SnapshotId.create(input.id))?.status, 'DRAFT')

  const confirmed = draft.confirm({
    spec: draft.spec,
    adrs: draft.adrs,
    base: draft.base,
    configuration: draft.configuration,
    versions: draft.versions,
  })
  const locked = await repository.confirm(confirmed)
  assert.equal(locked.status, 'CONFIRMED')
  assert.throws(
    () => confirmed.confirm({
      spec: confirmed.spec,
      adrs: confirmed.adrs,
      base: confirmed.base,
      configuration: confirmed.configuration,
      versions: confirmed.versions,
    }),
    (error: unknown) => error instanceof SnapshotDomainError && error.code === 'SNAPSHOT_ALREADY_CONFIRMED',
  )

  assert.throws(
    () => draft.confirm({
      spec: draft.spec,
      adrs: draft.adrs,
      base: draft.base,
      configuration: ConfigurationVersion.create('config-2'),
      versions: draft.versions,
    }),
    (error: unknown) => error instanceof SnapshotDomainError && error.code === 'SNAPSHOT_AUTHORITY_DRIFT',
  )
  assert.throws(
    () => draft.confirm({
      spec: draft.spec,
      adrs: draft.adrs,
      base: draft.base,
      configuration: draft.configuration,
      versions: ExactVersionSet.create({ skill: 'skill-2', contract: 'contract-1' }),
    }),
    (error: unknown) => error instanceof SnapshotDomainError && error.code === 'SNAPSHOT_AUTHORITY_DRIFT',
  )
  const overwrite = ExecutionSnapshot.create({ ...input, base: 'commit-base-3' }, snapshotCreationAuthorities(catalog, adrAuthority))
  const confirmedOverwrite = await repository.confirm(overwrite)
  assert.equal(confirmedOverwrite.status, 'STALE')
  assert.equal(repository.find(SnapshotId.create(input.id))?.base.value, 'commit-base-1')

  const missing = await new InMemorySnapshotRepository().confirm(confirmed)
  assert.equal(missing.status, 'NOT_FOUND')
})

test('eligibility is fail-closed and rejection occurs before snapshot persistence', async () => {
  const { catalog, adr, spec } = await createFixture()

  for (const decisionStatus of ['PROPOSED', 'REJECTED', 'SUPERSEDED'] as const) {
    const repository = new InMemorySnapshotRepository()
    const observation: AdrAuthorityObservation = Object.freeze({
      reference: adr.reference,
      decisionStatus,
      realizationStatus: 'UNPROCESSED',
      contentHash: AuthorityAdrContentHash.create('sha256:adr-1'),
    })
    const handler = new SubmitManualExecutionHandler(
      catalog,
      repository,
      new SequenceAdrAuthorityReader([observation]),
    )
    await assert.rejects(
      handler.handle(commandFor(adr, spec, {
        snapshotId: `SNAPSHOT-${decisionStatus}`,
        adrs: [{ reference: adr.reference, decisionStatus, contentHash: 'sha256:adr-1' }],
      })),
      (error: unknown) => error instanceof SnapshotDomainError && error.code === 'INELIGIBLE_ADR',
    )
    assert.equal(repository.reserveCalls, 0)
  }

  const repository = new InMemorySnapshotRepository()
  const handler = new SubmitManualExecutionHandler(
    catalog,
    repository,
    new SequenceAdrAuthorityReader([]),
  )
  await assert.rejects(
    handler.handle(commandFor(adr, spec, { snapshotId: 'SNAPSHOT-MISSING-SPEC', spec: { identity: { kind: 'SPEC', scope: 'workflow', value: 'SPEC-MISSING' }, revision: 1 } })),
    /could not be resolved/,
  )
  assert.equal(repository.reserveCalls, 0)
})

test('the boundary requires ADR and SPEC endpoints and cannot be triggered by discovery-only input', async () => {
  const { catalog, adr, spec, adrAuthority } = await createFixture()
  const repository = new InMemorySnapshotRepository()
  const handler = new SubmitManualExecutionHandler(catalog, repository, adrAuthority)

  await assert.rejects(
    handler.handle({ filename: 'ADR-0001.md', sessionState: 'READY' } as never),
  )
  await assert.rejects(
    handler.handle(commandFor(adr, spec, {
      snapshotId: 'SNAPSHOT-WRONG-ENDPOINT',
      spec: { identity: adr.identity, revision: adr.revision },
    })),
    (error: unknown) => error instanceof SnapshotDomainError && error.code === 'INVALID_SNAPSHOT_ENTRY',
  )
  assert.equal(repository.reserveCalls, 0)
})

test('confirmation rejects authority drift without mutating the draft', async () => {
  const { catalog, adrAuthority } = await createFixture()
  const snapshot = ExecutionSnapshot.create({
    id: 'SNAPSHOT-DRAFT',
    spec: { identity: { kind: 'SPEC', scope: 'workflow', value: 'SPEC-DOM-001' }, revision: 1 },
    adrs: [{
      reference: { identity: { kind: 'ADR', scope: 'workflow', value: 'ADR-0001' }, revision: 1 },
      decisionStatus: 'ACCEPTED' as const,
      contentHash: 'sha256:adr-1',
    }],
    base: 'commit-base-1',
    configuration: 'config-1',
    versions: ExactVersionSet.create({ skill: 'skill-1', contract: 'contract-1' }),
  }, { identities: catalog, adrs: adrAuthority })
  const versions = ExactVersionSet.create({ skill: 'skill-1', contract: 'contract-1' })

  assert.throws(
    () => snapshot.confirm({
      spec: snapshot.spec,
      adrs: snapshot.adrs,
      base: SnapshotBase.create('commit-base-2'),
      configuration: snapshot.configuration,
      versions,
    }),
    (error: unknown) => error instanceof SnapshotDomainError && error.code === 'SNAPSHOT_AUTHORITY_DRIFT',
  )
  assert.equal(snapshot.status, 'DRAFT')
  assert.equal(snapshot.base.value, 'commit-base-1')
})

test('manual submission consumes canonical ADR observations twice and rejects caller authority claims', async () => {
  const { catalog, adr, spec } = await createFixture()
  const canonical = AdrRecord.create({
    reference: adr.reference,
    contentHash: 'sha256:adr-1',
    decisionStatus: 'ACCEPTED',
    realizationStatus: 'UNPROCESSED',
    derivedEligibility: DerivedEligibility.eligible(),
  })
  const reader = new SequenceAdrAuthorityReader([observationFromRecord(canonical), observationFromRecord(canonical)])
  const repository = new InMemorySnapshotRepository()
  const handler = new SubmitManualExecutionHandler(catalog, repository, reader)

  const snapshot = await handler.handle(commandFor(adr, spec, {
    adrs: [{ reference: adr.reference }],
  }))

  assert.equal(snapshot.status, 'CONFIRMED')
  assert.equal(reader.calls, 2)
  const callsBeforeConflictingRetry = reader.calls
  await assert.rejects(
    handler.handle(commandFor(adr, spec, {
      snapshotId: 'SNAPSHOT-FALSE-CALLER-STATUS',
      adrs: [{ reference: adr.reference, decisionStatus: 'PROPOSED', contentHash: 'sha256:wrong' }],
    })),
    (error: unknown) => error instanceof SnapshotDomainError && error.code === 'SNAPSHOT_AUTHORITY_DRIFT',
  )
  assert.equal(repository.find(SnapshotId.create('SNAPSHOT-FALSE-CALLER-STATUS')), undefined)
  assert.equal(reader.calls, callsBeforeConflictingRetry + 1)
})

test('independent authority drift after reservation preserves the reserved draft', async () => {
  const { catalog, adr, spec, adrAuthority } = await createFixture()
  const initial = adrAuthority.observe(adr.reference)!
  const drifted: AdrAuthorityObservation = Object.freeze({
    ...initial,
    contentHash: AuthorityAdrContentHash.create('sha256:adr-drifted'),
  })
  const reader = new SequenceAdrAuthorityReader([initial, drifted])
  const repository = new InMemorySnapshotRepository()
  const handler = new SubmitManualExecutionHandler(catalog, repository, reader)

  await assert.rejects(
    handler.handle(commandFor(adr, spec, { snapshotId: 'SNAPSHOT-DRIFT' })),
    (error: unknown) => error instanceof SnapshotDomainError && error.code === 'SNAPSHOT_AUTHORITY_DRIFT',
  )
  const draft = repository.find(SnapshotId.create('SNAPSHOT-DRIFT'))
  assert.equal(draft?.status, 'DRAFT')
  assert.equal(draft?.adrs[0]?.contentHash.value, 'sha256:adr-1')
  assert.equal(reader.calls, 2)
})

test('rehydration uses canonical authorities and preserves immutable confirmed state', async () => {
  const { catalog, adr, spec, adrAuthority } = await createFixture()
  const snapshot = ExecutionSnapshot.rehydrate({
    id: 'SNAPSHOT-PERSISTED',
    status: 'CONFIRMED',
    spec: { identity: { kind: 'SPEC', scope: 'workflow', value: 'SPEC-DOM-001' }, revision: 1 },
    adrs: [{
      reference: { identity: { kind: 'ADR', scope: 'workflow', value: 'ADR-0001' }, revision: 1 },
      decisionStatus: 'ACCEPTED',
      contentHash: 'sha256:adr-1',
    }],
    base: 'commit-base-1',
    configuration: 'config-1',
    versions: ExactVersionSet.create({ skill: 'skill-1', contract: 'contract-1' }),
  }, rehydrationAuthorities(catalog, adrAuthority, 'SNAPSHOT-PERSISTED', 'CONFIRMED'))

  assert.equal(snapshot.status, 'CONFIRMED')
  assert.equal(snapshot.adrs[0]?.reference.revision.value, 1)
  assert.equal(Object.isFrozen(snapshot), true)
  assert.throws(() => ExecutionSnapshot.rehydrate({
    id: 'SNAPSHOT-INVALID',
    status: 'CONFIRMED',
    spec: { identity: { kind: 'ADR', scope: 'workflow', value: 'ADR-0001' }, revision: 1 },
    adrs: [],
    base: 'commit-base-1',
    configuration: 'config-1',
    versions: ExactVersionSet.create({ skill: 'skill-1', contract: 'contract-1' }),
  }, rehydrationAuthorities(catalog, adrAuthority, 'SNAPSHOT-INVALID', 'CONFIRMED')), (error: unknown) => error instanceof SnapshotDomainError && error.code === 'INVALID_SNAPSHOT_ENTRY')
  assert.throws(
    () => ExecutionSnapshot.rehydrate({
      id: 'SNAPSHOT-DETACHED',
      status: 'CONFIRMED',
      spec: spec.reference,
      adrs: [{
        reference: { identity: { kind: 'ADR', scope: 'workflow', value: 'ADR-MISSING' }, revision: 1 },
        decisionStatus: 'ACCEPTED',
        contentHash: 'sha256:adr-1',
      }],
      base: 'commit-base-1',
      configuration: 'config-1',
      versions: ExactVersionSet.create({ skill: 'skill-1', contract: 'contract-1' }),
    }, rehydrationAuthorities(catalog, adrAuthority, 'SNAPSHOT-DETACHED', 'CONFIRMED')),
    (error: unknown) => error instanceof SnapshotDomainError && error.code === 'SNAPSHOT_NOT_FOUND',
  )
})

test('rehydration requires authoritative progression and rejects corrupt or forged material', async () => {
  const { catalog, adrAuthority } = await createFixture()
  const draftInput = snapshotInput('SNAPSHOT-DRAFT-ROUNDTRIP')
  const draftAuthorities = rehydrationAuthorities(catalog, adrAuthority, draftInput.id, 'DRAFT')
  const draft = ExecutionSnapshot.rehydrate({ ...draftInput, status: 'DRAFT' }, draftAuthorities)
  assert.equal(draft.status, 'DRAFT')
  assert.equal(draft.base.value, 'commit-base-1')
  assert.equal(draft.versions.skill, 'skill-1')

  const confirmedInput = snapshotInput('SNAPSHOT-CONFIRMED-ROUNDTRIP')
  const confirmed = ExecutionSnapshot.rehydrate(
    { ...confirmedInput, status: 'CONFIRMED' },
    rehydrationAuthorities(catalog, adrAuthority, confirmedInput.id, 'CONFIRMED'),
  )
  assert.equal(confirmed.status, 'CONFIRMED')
  assert.equal(confirmed.adrs[0]?.contentHash.value, 'sha256:adr-1')

  assert.throws(
    () => ExecutionSnapshot.rehydrate(
      { ...confirmedInput, status: 'CONFIRMED' },
      rehydrationAuthorities(catalog, adrAuthority, confirmedInput.id, 'DRAFT'),
    ),
    (error: unknown) => error instanceof SnapshotDomainError && error.code === 'SNAPSHOT_AUTHORITY_DRIFT',
  )
  assert.throws(
    () => ExecutionSnapshot.rehydrate(
      { ...confirmedInput, status: 'CONFIRMED' },
      { identities: catalog, adrs: adrAuthority, progression: undefined as never },
    ),
    (error: unknown) => error instanceof SnapshotDomainError && error.code === 'SNAPSHOT_RECONSTRUCTION_AUTHORITY_REQUIRED',
  )
  assert.throws(
    () => ExecutionSnapshot.rehydrate(
      { ...confirmedInput, status: 'CONFIRMED', base: '' },
      rehydrationAuthorities(catalog, adrAuthority, confirmedInput.id, 'CONFIRMED'),
    ),
    (error: unknown) => error instanceof SnapshotDomainError && error.code === 'INVALID_SNAPSHOT_VALUE',
  )
  assert.throws(
    () => ExecutionSnapshot.rehydrate(
      { ...confirmedInput, status: 'CONFIRMED', adrs: [{ ...confirmedInput.adrs[0], contentHash: 'sha256:forged' }] },
      rehydrationAuthorities(catalog, adrAuthority, confirmedInput.id, 'CONFIRMED'),
    ),
    (error: unknown) => error instanceof SnapshotDomainError && error.code === 'SNAPSHOT_AUTHORITY_DRIFT',
  )
  assert.throws(
    () => ExecutionSnapshot.rehydrate(
      { ...confirmedInput, status: 'CONFIRMED', adrs: [{ ...confirmedInput.adrs[0], decisionStatus: 'PROPOSED' }] },
      rehydrationAuthorities(catalog, adrAuthority, confirmedInput.id, 'CONFIRMED'),
    ),
    (error: unknown) => error instanceof SnapshotDomainError && error.code === 'INELIGIBLE_ADR',
  )
})

test('barrier-controlled concurrent reservations have one winner and cannot overwrite a confirmed snapshot', async () => {
  const { catalog, adr, spec, adrAuthority } = await createFixture()
  const barrier = new ReservationBarrier()
  const repository = new InMemorySnapshotRepository(barrier)
  const handler = new SubmitManualExecutionHandler(catalog, repository, adrAuthority)
  const outcomesPromise = Promise.allSettled([
    handler.handle(commandFor(adr, spec, { snapshotId: 'SNAPSHOT-CONCURRENT' })),
    handler.handle(commandFor(adr, spec, { snapshotId: 'SNAPSHOT-CONCURRENT' })),
  ])
  await barrier.allEntered
  barrier.release()
  const outcomes = await outcomesPromise

  assert.equal(outcomes.filter((outcome) => outcome.status === 'fulfilled').length, 1)
  assert.equal(outcomes.filter((outcome) => outcome.status === 'rejected').length, 1)
  const rejected = outcomes.find((outcome) => outcome.status === 'rejected')
  assert.ok(rejected)
  if (rejected?.status === 'rejected') {
    assert.equal(rejected.reason instanceof SnapshotDomainError, true)
    if (rejected.reason instanceof SnapshotDomainError) assert.equal(rejected.reason.code, 'SNAPSHOT_ALREADY_EXISTS')
  }
  assert.equal(repository.find(SnapshotId.create('SNAPSHOT-CONCURRENT'))?.status, 'CONFIRMED')
  assert.equal(repository.find(SnapshotId.create('SNAPSHOT-CONCURRENT'))?.base.value, 'commit-base-1')
  assert.equal(repository.reserveCalls, 2)
})

test('rehydration rejects invalid progression and preserves the existing canonical record', async () => {
  const { catalog, adrAuthority } = await createFixture()
  const input = snapshotInput('SNAPSHOT-PROGRESSION-GUARD')
  const progression = new InMemorySnapshotProgressionAuthority()
  const authorities: ExecutionSnapshotReconstructionAuthorities = {
    identities: catalog,
    adrs: adrAuthority,
    progression,
  }
  const validRecords: readonly SnapshotProgressionRecordInput[] = [
    { ...input, status: 'DRAFT' },
    { ...input, status: 'CONFIRMED' },
  ]
  progression.seed(input.id, validRecords)

  const original = ExecutionSnapshot.rehydrate({ ...input, status: 'CONFIRMED' }, authorities)
  assert.equal(original.status, 'CONFIRMED')

  progression.seed(input.id, [
    { ...input, status: 'DRAFT' },
    { ...input, status: 'DRAFT' },
  ])
  assert.throws(
    () => ExecutionSnapshot.rehydrate({ ...input, status: 'CONFIRMED' }, authorities),
    (error: unknown) => error instanceof SnapshotDomainError && error.code === 'SNAPSHOT_AUTHORITY_DRIFT',
  )

  progression.seed(input.id, [
    { ...input, status: 'CONFIRMED' },
    { ...input, status: 'DRAFT' },
  ])
  assert.throws(
    () => ExecutionSnapshot.rehydrate({ ...input, status: 'CONFIRMED' }, authorities),
    (error: unknown) => error instanceof SnapshotDomainError && error.code === 'SNAPSHOT_AUTHORITY_DRIFT',
  )

  progression.seed(input.id, [
    { ...input, status: 'DRAFT' },
    { ...input, status: 'CONFIRMED', id: 'SNAPSHOT-OTHER' },
  ])
  assert.throws(
    () => ExecutionSnapshot.rehydrate({ ...input, status: 'CONFIRMED' }, authorities),
    (error: unknown) => error instanceof SnapshotDomainError && error.code === 'SNAPSHOT_AUTHORITY_DRIFT',
  )

  progression.seed(input.id, [
    { ...input, status: 'DRAFT' },
    { ...input, status: 'CONFIRMED', base: 'commit-base-forged' },
  ])
  assert.throws(
    () => ExecutionSnapshot.rehydrate({ ...input, status: 'CONFIRMED' }, authorities),
    (error: unknown) => error instanceof SnapshotDomainError && error.code === 'SNAPSHOT_AUTHORITY_DRIFT',
  )

  const missingSpecCatalog = new CanonicalIdentityCatalog(
    new InMemoryIdentityRepository(),
    generator,
    () => '2026-09-09T12:00:00.000Z',
  )
  progression.seed(input.id, validRecords)
  assert.throws(
    () => ExecutionSnapshot.rehydrate({ ...input, status: 'CONFIRMED' }, {
      identities: missingSpecCatalog,
      adrs: adrAuthority,
      progression,
    }),
    (error: unknown) => error instanceof SnapshotDomainError && error.code === 'SNAPSHOT_NOT_FOUND',
  )

  const restored = ExecutionSnapshot.rehydrate({ ...input, status: 'CONFIRMED' }, authorities)
  assert.equal(restored.status, original.status)
  assert.equal(restored.base.value, original.base.value)
  assert.equal(restored.adrs[0]?.contentHash.value, original.adrs[0]?.contentHash.value)
})

test('snapshot architecture guard traverses the productive import graph and protects the canonical reader seam', () => {
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
    const source = readFileSync(file, 'utf8')
    for (const specifier of importSpecifiers(source)) {
      assert.doesNotMatch(specifier, forbiddenDependency, `${file} imports forbidden dependency ${specifier}`)
      const child = resolveSource(file, specifier)
      if (child) visit(child)
    }
  }

  visit(resolve(process.cwd(), 'src/application/snapshot.ts'))
  visit(resolve(process.cwd(), 'src/domain/snapshot.ts'))
  assert.equal(visited.has(resolve(process.cwd(), 'src/domain/adr.ts')), true)
  const application = readFileSync(resolve(process.cwd(), 'src/application/snapshot.ts'), 'utf8')
  const domain = readFileSync(resolve(process.cwd(), 'src/domain/snapshot.ts'), 'utf8')
  assert.match(application, /AdrAuthorityReader/)
  assert.match(application, /ExecutionSnapshot\.create/)
  assert.doesNotMatch(application, /AdrAuthorityCatalog/)
  assert.match(domain, /ExecutionSnapshotCreationAuthorities/)
  assert.match(domain, /SnapshotProgressionReconstructionAuthority/)

  const syntheticForbiddenDependency = /prototype|infrastructure|database|filesystem|http|react|vite|orm|github|sqlite|postgres|node:fs|node:path|alternate-authority/i
  const syntheticGraphs = [
    new Map([
      ['entry.ts', "import './safe.ts'"],
      ['safe.ts', "import './alternate-authority.ts'"],
      ['alternate-authority.ts', 'export const authority = true'],
    ]),
    new Map([
      ['entry.ts', "import './missing.ts'"],
    ]),
  ]
  const visitSynthetic = (files: Map<string, string>, file: string, visited = new Set<string>()): void => {
    if (visited.has(file)) return
    const source = files.get(file)
    if (source === undefined) throw new Error(`unresolved graph edge: ${file}`)
    visited.add(file)
    for (const specifier of source.matchAll(/\bfrom\s*['"]([^'"]+)['"]|\bimport\s*['"]([^'"]+)['"]/g)) {
      const dependency = specifier[1] ?? specifier[2]
      assert.ok(dependency)
      assert.doesNotMatch(dependency, syntheticForbiddenDependency, `synthetic forbidden dependency ${dependency}`)
      const child = dependency.startsWith('./') ? dependency.slice(2) : dependency
      visitSynthetic(files, child, visited)
    }
  }
  assert.throws(() => visitSynthetic(syntheticGraphs[0]!, 'entry.ts'), /forbidden dependency/)
  assert.throws(() => visitSynthetic(syntheticGraphs[1]!, 'entry.ts'), /unresolved graph edge/)
})
