import assert from 'node:assert/strict'
import test from 'node:test'
import {
  CanonicalIdentityReference,
} from '../src/domain/identity.js'
import {
  NormativeChangeAuthorityReader,
  NormativeChangeObservation,
  NormativeChangeRepository,
  NormativeChangeSet,
  NormativeRevision,
} from '../src/domain/normative-change.js'
import {
  NormativeChangeCommand,
  NormativeChangeHandler,
} from '../src/application/normative-change.js'
import {
  Ticket,
  TicketRepository,
} from '../src/domain/ticket.js'

function ticketReference(value: string): CanonicalIdentityReference {
  return CanonicalIdentityReference.create({
    identity: { kind: 'TICKET', scope: 'execution-1', value },
    revision: 1,
  })
}

function completedTicket(): Ticket {
  let ticket = Ticket.create({ identity: ticketReference('ticket-completed') })
  ticket = ticket.transition({
    target: 'READY',
    expectedRevision: 0,
    transitionId: 'ticket-ready',
    authorization: { documentationApproved: true, dependenciesPending: false },
  }).proposed
  ticket = ticket.transition({
    target: 'IMPLEMENTED',
    expectedRevision: 1,
    transitionId: 'ticket-implemented',
    authorization: { implementationVerdictApproved: true, implementationCommitApproved: true },
  }).proposed
  return ticket.transition({
    target: 'COMPLETED',
    expectedRevision: 2,
    transitionId: 'ticket-completed',
    authorization: { waveIntegratedAndAudited: true, finalizationComplete: true },
  }).proposed
}

function changeSet(): NormativeChangeSet {
  return NormativeChangeSet.create({
    changeId: 'change-1',
    approvals: [
      { id: 'approval-a', normativeRevision: 'revision-1' },
      { id: 'approval-b', normativeRevision: 'revision-1' },
    ],
  })
}

function command(overrides: Partial<NormativeChangeCommand> = {}): NormativeChangeCommand {
  return {
    changeId: 'change-1',
    expectedRevision: 0,
    sourceRevision: 'revision-1',
    targetRevision: 'revision-2',
    affectedApprovalIds: ['approval-a'],
    affectedTicketIds: [ticketReference('ticket-completed')],
    adjustmentId: 'adjustment-1',
    returnStage: 'SPEC',
    ...overrides,
  }
}

class MemoryChangeRepository implements NormativeChangeRepository {
  current: NormativeChangeSet
  saveCalls = 0

  constructor(initial: NormativeChangeSet) {
    this.current = initial
  }

  find(): NormativeChangeSet {
    return this.current
  }

  async save(
    change: NormativeChangeSet,
    expectedRevision: NormativeChangeSet['revision'],
  ): Promise<{ status: 'ADVANCED'; change: NormativeChangeSet } | { status: 'STALE'; existing?: NormativeChangeSet } | { status: 'DUPLICATE'; existing: NormativeChangeSet }> {
    this.saveCalls += 1
    await new Promise<void>((resolve) => setTimeout(resolve, 0))
    if (expectedRevision.value !== this.current.revision.value) return { status: 'STALE', existing: this.current }
    if (change.revision.value !== expectedRevision.value + 1) return { status: 'STALE', existing: this.current }
    this.current = change
    return { status: 'ADVANCED', change }
  }
}

class MemoryTicketRepository implements Pick<TicketRepository, 'find'> {
  readonly ticket: Ticket

  constructor(ticket: Ticket) {
    this.ticket = ticket
  }

  find(identity: CanonicalIdentityReference): Ticket | undefined {
    return identity.equals(this.ticket.id.reference) ? this.ticket : undefined
  }
}

class MutableChangeAuthority implements NormativeChangeAuthorityReader {
  readonly observation: NormativeChangeObservation = {
    changeId: 'change-1',
    sourceRevision: 'revision-1',
    targetRevision: 'revision-2',
    affectedApprovalIds: ['approval-a'],
    affectedTicketIds: [ticketReference('ticket-completed')],
    adjustmentId: 'adjustment-1',
    returnStage: 'SPEC',
    observationId: 'observation-1',
  }
  calls = 0
  driftOnSecondRead = false

  observe(): NormativeChangeObservation {
    this.calls += 1
    if (this.calls === 2 && this.driftOnSecondRead) {
      return { ...this.observation, targetRevision: 'revision-3', observationId: 'observation-2' }
    }
    return { ...this.observation, observationId: `observation-${this.calls}` }
  }
}

test('T10-AC1/T10-AC2: invalidates only affected approvals and preserves completed tickets', async () => {
  const repository = new MemoryChangeRepository(changeSet())
  const ticket = completedTicket()
  const handler = new NormativeChangeHandler(repository, new MutableChangeAuthority(), new MemoryTicketRepository(ticket))

  const result = await handler.handle(command())
  assert.equal(result.status, 'ACCEPTED')
  if (result.status !== 'ACCEPTED') return
  assert.equal(result.duplicate, false)
  assert.equal(result.change.approvals.find((approval) => approval.id.value === 'approval-a')?.state, 'OBSOLETE')
  assert.equal(result.change.approvals.find((approval) => approval.id.value === 'approval-b')?.state, 'VALID')
  assert.equal(result.change.adjustments[0].returnStage.value, 'SPEC')
  assert.deepEqual(result.change.adjustments[0].affectedApprovalIds.map((id) => id.value), ['approval-a'])
  assert.equal(ticket.state.value, 'COMPLETED')
  assert.equal(ticket.revision.value, 3)
})

test('T10 exact retry is idempotent and does not rewrite the adjustment lineage', async () => {
  const repository = new MemoryChangeRepository(changeSet())
  const authority = new MutableChangeAuthority()
  const handler = new NormativeChangeHandler(repository, authority, new MemoryTicketRepository(completedTicket()))

  const first = await handler.handle(command())
  assert.equal(first.status, 'ACCEPTED')
  if (first.status !== 'ACCEPTED') return

  const duplicate = await handler.handle(command({ expectedRevision: first.change.revision.value }))
  assert.equal(duplicate.status, 'ACCEPTED')
  if (duplicate.status !== 'ACCEPTED') return
  assert.equal(duplicate.duplicate, true)
  assert.equal(duplicate.change.adjustments.length, 1)
  assert.equal(repository.saveCalls, 1)
})

test('T10 negative: normative drift, unrelated approval, and malformed lineage fail closed', async () => {
  const repository = new MemoryChangeRepository(changeSet())
  const authority = new MutableChangeAuthority()
  authority.driftOnSecondRead = true
  const handler = new NormativeChangeHandler(repository, authority, new MemoryTicketRepository(completedTicket()))

  const drifted = await handler.handle(command())
  assert.equal(drifted.status, 'REJECTED')
  assert.equal(drifted.code, 'NORMATIVE_CHANGE_STALE')
  assert.equal(repository.current.approvals.every((approval) => approval.state === 'VALID'), true)
  assert.equal(repository.saveCalls, 0)

  const mismatchedRevisionSet = NormativeChangeSet.create({
    changeId: 'change-2',
    approvals: [{ id: 'approval-other', normativeRevision: 'revision-old' }],
  })
  assert.throws(() => mismatchedRevisionSet.apply({
    changeId: 'change-2',
    sourceRevision: 'revision-new',
    targetRevision: 'revision-next',
    affectedApprovalIds: ['approval-other'],
    affectedTicketIds: [ticketReference('ticket-completed')],
    adjustmentId: 'adjustment-other',
    returnStage: 'SPEC',
  }), /source normative revision/i)

  const unrelated = await handler.handle(command({
    expectedRevision: 0,
    affectedApprovalIds: ['approval-unknown'],
    adjustmentId: 'adjustment-unknown',
  }))
  assert.equal(unrelated.status, 'REJECTED')
  assert.equal(unrelated.code, 'INVALID_NORMATIVE_CHANGE')
})

test('T10 concurrency: a competing invalidation cannot win the same revision twice', async () => {
  const repository = new MemoryChangeRepository(changeSet())
  const authority = new MutableChangeAuthority()
  const handler = new NormativeChangeHandler(repository, authority, new MemoryTicketRepository(completedTicket()))

  const [first, second] = await Promise.all([handler.handle(command()), handler.handle(command())])
  const statuses = [first.status, second.status].sort()
  assert.deepEqual(statuses, ['ACCEPTED', 'REJECTED'])
  assert.equal(repository.saveCalls, 2)
})

test('T10 recovery: accepted adjustment and approval history require matching authority', () => {
  const original = changeSet().apply({
    changeId: 'change-1',
    sourceRevision: NormativeRevision.create('revision-1'),
    targetRevision: NormativeRevision.create('revision-2'),
    affectedApprovalIds: ['approval-a'],
    affectedTicketIds: [ticketReference('ticket-completed')],
    adjustmentId: 'adjustment-1',
    returnStage: 'SPEC',
  }).proposed
  const snapshot = original.toSnapshot()
  const recovered = NormativeChangeSet.rehydrate(snapshot, {
    resolveForRehydration: () => snapshot,
  })

  assert.equal(recovered.revision.value, 1)
  assert.equal(recovered.approvals.find((approval) => approval.id.value === 'approval-a')?.state, 'OBSOLETE')
  assert.throws(() => NormativeChangeSet.rehydrate({ ...snapshot, revision: 2 }, { resolveForRehydration: () => snapshot }), /authority/i)
})

