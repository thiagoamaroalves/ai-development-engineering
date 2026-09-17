import assert from 'node:assert/strict'
import test from 'node:test'
import {
  AuditCycle,
  AuditCycleRevision,
  AuditRound,
} from '../src/domain/audit-cycle.js'
import {
  CanonicalIdentityReference,
} from '../src/domain/identity.js'
import {
  RoundContinuationAuthorization,
  RoundContinuationRepository,
  RoundCycleReader,
  RoundLimit,
  RoundLimitPolicy,
  RoundUnitReference,
} from '../src/domain/round-continuation.js'
import {
  ExecRoundDecisionMapper,
  RoundContinuationHandler,
} from '../src/application/round-continuation.js'

function reference(kind: 'ARTIFACT_CYCLE' | 'ACTIVITY', scope: string, value: string): CanonicalIdentityReference {
  return CanonicalIdentityReference.create({
    identity: { kind, scope, value },
    revision: 1,
  })
}

function tenRoundCycle(): AuditCycle {
  let cycle = AuditCycle.create({
    identity: reference('ARTIFACT_CYCLE', 'execution-1', 'cycle-1'),
    artifactRevision: 'artifact-revision-1',
  })
  for (let ordinal = 1; ordinal <= 10; ordinal += 1) {
    cycle = cycle.appendRound({ ordinal, auditorEvidenceId: `audit-${ordinal}` })
  }
  return cycle
}

class CycleReader implements RoundCycleReader {
  reads = 0
  driftOnSecondRead = false

  constructor(public cycle: AuditCycle) {}

  find(identity: CanonicalIdentityReference): AuditCycle | undefined {
    this.reads += 1
    if (!identity.equals(this.cycle.id.reference)) return undefined
    if (this.driftOnSecondRead && this.reads === 2) {
      return this.cycle.appendRound({ ordinal: 11, auditorEvidenceId: 'audit-11' })
    }
    return this.cycle
  }
}

class MemoryContinuationRepository implements RoundContinuationRepository {
  private readonly records = new Map<string, RoundContinuationAuthorization>()
  saveCalls = 0

  find(authorizationId: string): RoundContinuationAuthorization | undefined {
    return this.records.get(authorizationId)
  }

  async reserve(
    authorization: RoundContinuationAuthorization,
    expectedCycleRevision: AuditCycleRevision,
  ): Promise<{ status: 'ADVANCED'; authorization: RoundContinuationAuthorization } | { status: 'STALE'; existing?: RoundContinuationAuthorization } | { status: 'DUPLICATE'; existing: RoundContinuationAuthorization }> {
    this.saveCalls += 1
    if (expectedCycleRevision.value !== 10) return { status: 'STALE' }
    const existing = this.records.get(authorization.authorizationId)
    if (existing) return { status: 'DUPLICATE', existing }
    if (this.records.size > 0) return { status: 'STALE', existing: [...this.records.values()][0] }
    this.records.set(authorization.authorizationId, authorization)
    return { status: 'ADVANCED', authorization }
  }
}

function command(cycle: AuditCycle, unit: CanonicalIdentityReference, authorizationId = 'continue-1') {
  return {
    authorizationId,
    cycle: cycle.id.reference,
    unit,
    currentRound: 10,
    expectedCycleRevision: cycle.revision.value,
  }
}

test('T9-AC1: the configured limit pauses only the addressed unit', () => {
  const cycle = tenRoundCycle()
  const unitA = RoundUnitReference.create({ cycle: cycle.id.reference, unit: reference('ACTIVITY', 'execution-1', 'unit-a') })
  const unitB = RoundUnitReference.create({ cycle: cycle.id.reference, unit: reference('ACTIVITY', 'execution-1', 'unit-b') })

  const decisionA = RoundLimitPolicy.decide(cycle.id.reference, unitA, 10)
  const decisionB = RoundLimitPolicy.decide(cycle.id.reference, unitB, 9, RoundLimit.create(10))

  assert.equal(decisionA.decision, 'PAUSE_AFFECTED_UNIT')
  assert.equal(decisionA.unit.reference.identity.value, 'unit-a')
  assert.equal(decisionB.decision, 'CONTINUE')
  assert.equal(decisionB.unit.reference.identity.value, 'unit-b')
})

test('T9-AC2: continuation requires an explicit authorization and survives exact retry', async () => {
  const cycle = tenRoundCycle()
  const unit = reference('ACTIVITY', 'execution-1', 'unit-a')
  const repository = new MemoryContinuationRepository()
  const cycleReader = new CycleReader(cycle)
  const handler = new RoundContinuationHandler(cycleReader, repository)

  const accepted = await handler.authorize(command(cycle, unit))
  assert.equal(accepted.status, 'ACCEPTED')
  if (accepted.status !== 'ACCEPTED') return
  assert.equal(accepted.authorization.pausedRound.value, 10)
  assert.equal(accepted.authorization.nextRound.value, 11)
  assert.equal(accepted.duplicate, false)

  const duplicate = await handler.authorize(command(cycle, unit))
  assert.equal(duplicate.status, 'ACCEPTED')
  if (duplicate.status !== 'ACCEPTED') return
  assert.equal(duplicate.duplicate, true)
  assert.equal(duplicate.authorization.canonicalKey, accepted.authorization.canonicalKey)
  assert.equal(cycleReader.reads, 4)
  assert.equal(repository.saveCalls, 1)
})

test('T9-AC2 negative: below-limit, wrong-cycle, and stale continuation requests fail closed', async () => {
  const cycle = tenRoundCycle()
  const unit = reference('ACTIVITY', 'execution-1', 'unit-a')
  const repository = new MemoryContinuationRepository()
  const handler = new RoundContinuationHandler(new CycleReader(cycle), repository)

  const belowLimit = await handler.authorize({ ...command(cycle, unit), currentRound: 9, authorizationId: 'below-limit' })
  assert.equal(belowLimit.status, 'REJECTED')
  assert.equal(belowLimit.code, 'INVALID_ROUND_POLICY')

  const wrongCycleReference = reference('ARTIFACT_CYCLE', 'execution-1', 'other-cycle')
  const wrongUnit = reference('ACTIVITY', 'execution-1', 'unit-a')
  const wrongCycle = await handler.authorize({
    ...command(cycle, unit, 'wrong-cycle'),
    cycle: wrongCycleReference,
    unit: wrongUnit,
  })
  assert.equal(wrongCycle.status, 'REJECTED')
  assert.equal(wrongCycle.code, 'ROUND_CYCLE_NOT_FOUND')

  const stale = await handler.authorize({ ...command(cycle, unit, 'stale'), expectedCycleRevision: cycle.revision.value - 1 })
  assert.equal(stale.status, 'REJECTED')
  assert.equal(stale.code, 'ROUND_STALE')
  assert.equal(repository.saveCalls, 0)

  const driftingReader = new CycleReader(cycle)
  driftingReader.driftOnSecondRead = true
  const driftingRepository = new MemoryContinuationRepository()
  const drifted = await new RoundContinuationHandler(driftingReader, driftingRepository).authorize(command(cycle, unit, 'drifted'))
  assert.equal(drifted.status, 'REJECTED')
  assert.equal(drifted.code, 'ROUND_STALE')
  assert.equal(driftingRepository.saveCalls, 0)
})

test('T9 concurrency: only one different continuation authorization wins the cycle revision', async () => {
  const cycle = tenRoundCycle()
  const unit = reference('ACTIVITY', 'execution-1', 'unit-a')
  const repository = new MemoryContinuationRepository()
  const handler = new RoundContinuationHandler(new CycleReader(cycle), repository)

  const [first, second] = await Promise.all([
    handler.authorize(command(cycle, unit, 'continue-a')),
    handler.authorize(command(cycle, unit, 'continue-b')),
  ])
  const statuses = [first.status, second.status].sort()
  assert.deepEqual(statuses, ['ACCEPTED', 'REJECTED'])
  assert.equal(repository.saveCalls, 2)
})

test('T9 mapper exposes a unit-scoped scheduler decision without owning scheduling', () => {
  const cycle = tenRoundCycle()
  const unit = RoundUnitReference.create({ cycle: cycle.id.reference, unit: reference('ACTIVITY', 'execution-1', 'unit-a') })
  const decision = RoundLimitPolicy.decide(cycle.id.reference, unit, 10)
  const mapped = new ExecRoundDecisionMapper().map(decision)
  const belowLimit = RoundLimitPolicy.decide(cycle.id.reference, unit, 9)
  const authorization = RoundContinuationAuthorization.create({
    authorizationId: 'continue-1',
    cycle: cycle.id.reference,
    unit: unit.reference,
    pausedRound: 10,
    nextRound: 11,
    cycleRevision: cycle.revision,
  })

  assert.equal(mapped.action, 'PAUSE_AFFECTED_UNIT')
  assert.equal(mapped.unit.identity.value, 'unit-a')
  assert.equal(mapped.round, 10)
  assert.throws(() => new ExecRoundDecisionMapper().map(belowLimit, authorization), /pause-at-limit/i)
})
