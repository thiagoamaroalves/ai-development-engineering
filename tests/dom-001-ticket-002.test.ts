import assert from 'node:assert/strict'
import test from 'node:test'
import {
  CanonicalIdentityCatalog,
  CanonicalIdentityGenerator,
  CanonicalIdentityRecord,
  CanonicalIdentityReference,
  CanonicalIdentityRepository,
} from '../src/domain/identity.js'
import {
  ExecutionSnapshot,
  ExecutionSnapshotRepository,
  ExactVersionSet,
  SnapshotBase,
  SnapshotDomainError,
  SnapshotId,
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

class InMemorySnapshotRepository implements ExecutionSnapshotRepository {
  private readonly snapshots = new Map<string, ExecutionSnapshot>()
  reserveCalls = 0

  async reserve(snapshot: ExecutionSnapshot) {
    this.reserveCalls += 1
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
  return { catalog, adr, spec }
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

test('manual submission creates a confirmed immutable snapshot with exact authority basis', async () => {
  const { catalog, adr, spec } = await createFixture()
  const repository = new InMemorySnapshotRepository()
  const handler = new SubmitManualExecutionHandler(catalog, repository)

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

test('eligibility is fail-closed and rejection occurs before snapshot persistence', async () => {
  const { catalog, adr, spec } = await createFixture()
  const repository = new InMemorySnapshotRepository()
  const handler = new SubmitManualExecutionHandler(catalog, repository)

  for (const decisionStatus of ['PROPOSED', 'REJECTED', 'SUPERSEDED'] as const) {
    await assert.rejects(
      handler.handle(commandFor(adr, spec, {
        snapshotId: `SNAPSHOT-${decisionStatus}`,
        adrs: [{ reference: adr.reference, decisionStatus, contentHash: 'sha256:adr-1' }],
      })),
      (error: unknown) => error instanceof SnapshotDomainError && error.code === 'INELIGIBLE_ADR',
    )
  }

  await assert.rejects(
    handler.handle(commandFor(adr, spec, { snapshotId: 'SNAPSHOT-MISSING-SPEC', spec: { identity: { kind: 'SPEC', scope: 'workflow', value: 'SPEC-MISSING' }, revision: 1 } })),
    /could not be resolved/,
  )
  assert.equal(repository.reserveCalls, 0)
})

test('the boundary requires ADR and SPEC endpoints and cannot be triggered by discovery-only input', async () => {
  const { catalog, adr, spec } = await createFixture()
  const repository = new InMemorySnapshotRepository()
  const handler = new SubmitManualExecutionHandler(catalog, repository)

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

test('confirmation rejects authority drift without mutating the draft', () => {
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
  })
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

test('rehydration uses validated construction and preserves immutable confirmed state', () => {
  const snapshot = ExecutionSnapshot.rehydrate({
    id: 'SNAPSHOT-PERSISTED',
    status: 'CONFIRMED',
    spec: { identity: { kind: 'SPEC', scope: 'workflow', value: 'SPEC-DOM-001' }, revision: 1 },
    adrs: [{
      reference: { identity: { kind: 'ADR', scope: 'workflow', value: 'ADR-0001' }, revision: 2 },
      decisionStatus: 'ACCEPTED',
      contentHash: 'sha256:adr-2',
    }],
    base: 'commit-base-1',
    configuration: 'config-1',
    versions: ExactVersionSet.create({ skill: 'skill-1', contract: 'contract-1' }),
  })

  assert.equal(snapshot.status, 'CONFIRMED')
  assert.equal(snapshot.adrs[0]?.reference.revision.value, 2)
  assert.equal(Object.isFrozen(snapshot), true)
  assert.throws(() => ExecutionSnapshot.rehydrate({
    id: 'SNAPSHOT-INVALID',
    status: 'CONFIRMED',
    spec: { identity: { kind: 'ADR', scope: 'workflow', value: 'ADR-0001' }, revision: 1 },
    adrs: [],
    base: 'commit-base-1',
    configuration: 'config-1',
    versions: ExactVersionSet.create({ skill: 'skill-1', contract: 'contract-1' }),
  }), (error: unknown) => error instanceof SnapshotDomainError && error.code === 'INVALID_SNAPSHOT_ENTRY')
})
