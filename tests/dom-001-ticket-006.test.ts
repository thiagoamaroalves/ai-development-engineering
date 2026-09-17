import assert from 'node:assert/strict'
import test from 'node:test'
import { CanonicalIdentityReference } from '../src/domain/identity.js'
import {
  TICKET_FUNCTIONAL_STATES,
  Ticket,
  TicketDomainError,
  TicketRejectionRecord,
  TicketRejectionRecorder,
  TicketRepository,
} from '../src/domain/ticket.js'
import { TicketTransitionHandler } from '../src/application/ticket.js'

function identity(value = 'TCK-006'): CanonicalIdentityReference {
  return CanonicalIdentityReference.create({ identity: { kind: 'TICKET', scope: 'SPEC-DOM-001', value }, revision: 1 })
}

class Repository implements TicketRepository {
  current?: Ticket
  find() { return this.current }
  async advance(proposed: Ticket, expectedRevision: Ticket['revision']) {
    if (!this.current) return { status: 'NOT_FOUND' as const }
    if (this.current.revision.value !== expectedRevision.value) return { status: 'STALE' as const, existing: this.current }
    this.current = proposed
    return { status: 'ADVANCED' as const, ticket: proposed }
  }
}

class Rejections implements TicketRejectionRecorder {
  readonly records: TicketRejectionRecord[] = []

  record(rejection: TicketRejectionRecord): void {
    this.records.push(rejection)
  }
}

class ConcurrentRepository extends Repository {
  private readonly barrier: Promise<void>
  private release!: () => void
  private arrivals = 0

  constructor() {
    super()
    this.barrier = new Promise<void>((resolve) => { this.release = resolve })
  }

  async advance(proposed: Ticket, expectedRevision: Ticket['revision']) {
    this.arrivals += 1
    if (this.arrivals === 2) this.release()
    await this.barrier
    return super.advance(proposed, expectedRevision)
  }
}

test('T6-AC1 accepts exactly six functional states and rejects forged state', () => {
  const ticket = Ticket.create({ identity: identity() })
  assert.equal(ticket.state.value, 'DRAFT')

  const ready = ticket.transition({
    target: 'READY',
    expectedRevision: 0,
    transitionId: 'ready-state',
    authorization: { documentationApproved: true, dependenciesPending: false },
  }).proposed
  const implemented = ready.transition({
    target: 'IMPLEMENTED',
    expectedRevision: 1,
    transitionId: 'implemented-state',
    authorization: { implementationVerdictApproved: true, implementationCommitApproved: true },
  }).proposed
  const completed = implemented.transition({
    target: 'COMPLETED',
    expectedRevision: 2,
    transitionId: 'completed-state',
    authorization: { waveIntegratedAndAudited: true, finalizationComplete: true },
  }).proposed
  const blocked = Ticket.create({ identity: identity('TCK-006-STATE-BLOCKED') }).transition({
    target: 'BLOCKED',
    expectedRevision: 0,
    transitionId: 'blocked-state',
    authorization: { documentationApproved: true, dependenciesPending: true },
  }).proposed
  const cancelled = Ticket.create({ identity: identity('TCK-006-STATE-CANCELLED') }).transition({
    target: 'CANCELLED',
    expectedRevision: 0,
    transitionId: 'cancelled-state',
    authorization: { cancellationAudited: true },
  }).proposed
  assert.deepEqual(
    new Set([ticket.state.value, ready.state.value, implemented.state.value, completed.state.value, blocked.state.value, cancelled.state.value]),
    new Set(TICKET_FUNCTIONAL_STATES),
  )

  const accepted = ready.transitions.map((record) => ({
    transitionId: record.transitionId,
    from: record.from,
    to: record.to,
    previousRevision: record.previousRevision,
    revision: record.revision,
    authorization: record.authorization,
  }))
  const restored = Ticket.rehydrate(
    { identity: identity(), state: 'READY', revision: 1, transitions: accepted },
    { resolveForRehydration: () => accepted },
  )
  assert.equal(restored.state.value, 'READY')
  assert.equal(restored.revision.value, 1)

  assert.throws(() => Ticket.rehydrate({ identity: identity(), state: 'UNKNOWN' as never, revision: 0, transitions: [] }, { resolveForRehydration: () => [] }), /six canonical|state/i)
})

test('T6-AC2 executes all eight valid transitions and rejects arbitrary edges', () => {
  let ticket = Ticket.create({ identity: identity('TCK-006-EDGES') })
  const transition = (target: Parameters<Ticket['transition']>[0]['target'], authorization: Parameters<Ticket['transition']>[0]['authorization'], id: string) => { ticket = ticket.transition({ target, expectedRevision: ticket.revision, transitionId: id, authorization }).proposed }
  transition('READY', { documentationApproved: true, dependenciesPending: false }, 'draft-ready')
  transition('IMPLEMENTED', { implementationVerdictApproved: true, implementationCommitApproved: true }, 'ready-implemented')
  transition('COMPLETED', { waveIntegratedAndAudited: true, finalizationComplete: true }, 'implemented-completed')
  assert.equal(ticket.state.value, 'COMPLETED')
  assert.throws(() => ticket.transition({ target: 'DRAFT', expectedRevision: ticket.revision, transitionId: 'reopen', authorization: {} }), /cannot transition/i)

  const blocked = Ticket.create({ identity: identity('TCK-006-BLOCKED') })
    .transition({ target: 'BLOCKED', expectedRevision: 0, transitionId: 'draft-blocked', authorization: { documentationApproved: true, dependenciesPending: true } }).proposed
  const unblocked = blocked.transition({ target: 'READY', expectedRevision: 1, transitionId: 'blocked-ready', authorization: { blockerRemoved: true } }).proposed
  assert.equal(unblocked.state.value, 'READY')

  const blockedCancelled = Ticket.create({ identity: identity('TCK-006-BLOCKED-CANCEL') })
    .transition({ target: 'BLOCKED', expectedRevision: 0, transitionId: 'blocked', authorization: { documentationApproved: true, dependenciesPending: true } }).proposed
    .transition({ target: 'CANCELLED', expectedRevision: 1, transitionId: 'blocked-cancel', authorization: { cancellationAudited: true } }).proposed
  assert.equal(blockedCancelled.state.value, 'CANCELLED')

  const draftCancelled = Ticket.create({ identity: identity('TCK-006-DRAFT-CANCEL') })
    .transition({ target: 'CANCELLED', expectedRevision: 0, transitionId: 'draft-cancel', authorization: { cancellationAudited: true } }).proposed
  assert.equal(draftCancelled.state.value, 'CANCELLED')

  const readyCancelled = Ticket.create({ identity: identity('TCK-006-READY-CANCEL') })
    .transition({ target: 'READY', expectedRevision: 0, transitionId: 'ready', authorization: { documentationApproved: true, dependenciesPending: false } }).proposed
    .transition({ target: 'CANCELLED', expectedRevision: 1, transitionId: 'ready-cancel', authorization: { cancellationAudited: true } }).proposed
  assert.equal(readyCancelled.state.value, 'CANCELLED')
})

test('T6-AC3 preserves terminality, linked continuation condition, stale rejection, and idempotent retry', async () => {
  const repository = new Repository()
  const rejections = new Rejections()
  repository.current = Ticket.create({ identity: identity('TCK-006-HANDLER') })
  const handler = new TicketTransitionHandler(repository, rejections)
  const first = await handler.handle({ identity: identity('TCK-006-HANDLER'), target: 'READY', expectedRevision: 0, transitionId: 'ready-1', authorization: { documentationApproved: true, dependenciesPending: false } })
  assert.equal(first.status, 'ACCEPTED')
  const retry = await handler.handle({ identity: identity('TCK-006-HANDLER'), target: 'READY', expectedRevision: 0, transitionId: 'ready-1', authorization: { documentationApproved: true, dependenciesPending: false } })
  assert.equal(retry.status, 'ACCEPTED')
  if (retry.status === 'ACCEPTED') assert.equal(retry.duplicate, true)
  const stale = await handler.handle({ identity: identity('TCK-006-HANDLER'), target: 'IMPLEMENTED', expectedRevision: 0, transitionId: 'implemented-stale', authorization: { implementationVerdictApproved: true, implementationCommitApproved: true } })
  assert.equal(stale.status, 'REJECTED')
  assert.equal(rejections.records.length, 1)
  assert.equal(rejections.records[0].code, 'TICKET_STALE')
  const invalid = await handler.handle({ identity: identity('TCK-006-HANDLER'), target: 'COMPLETED', expectedRevision: 1, transitionId: 'complete-without-verdict', authorization: {} })
  assert.equal(invalid.status, 'REJECTED')
  assert.equal(rejections.records.length, 2)
  assert.equal(rejections.records[1].code, 'INVALID_TICKET_TRANSITION')
  assert.equal(repository.current?.state.value, 'READY')
  assert.throws(() => repository.current!.transition({ target: 'CANCELLED', expectedRevision: repository.current!.revision, transitionId: 'cancel-no-proof', authorization: {} }), TicketDomainError)

  const completed = Ticket.create({ identity: identity('TCK-006-TERMINAL') })
    .transition({ target: 'READY', expectedRevision: 0, transitionId: 'ready', authorization: { documentationApproved: true, dependenciesPending: false } }).proposed
    .transition({ target: 'IMPLEMENTED', expectedRevision: 1, transitionId: 'implemented', authorization: { implementationVerdictApproved: true, implementationCommitApproved: true } }).proposed
    .transition({ target: 'COMPLETED', expectedRevision: 2, transitionId: 'completed', authorization: { waveIntegratedAndAudited: true, finalizationComplete: true } }).proposed
  const continuation = Ticket.create({ identity: identity('TCK-006-CONTINUATION'), continuationOf: completed.id.reference })
  assert.equal(continuation.continuationOf?.equals(completed.id), true)
  assert.equal(completed.state.value, 'COMPLETED')
})

test('T6-AC4 rejects forged authorization, proves concurrent CAS, and preserves one accepted history', async () => {
  const ticket = Ticket.create({ identity: identity('TCK-006-REHYDRATE-AUTH') })
    .transition({ target: 'READY', expectedRevision: 0, transitionId: 'ready-auth', authorization: { documentationApproved: true, dependenciesPending: false } }).proposed
  const accepted = ticket.transitions.map((record) => ({
    transitionId: record.transitionId,
    from: record.from,
    to: record.to,
    previousRevision: record.previousRevision,
    revision: record.revision,
    authorization: record.authorization,
  }))
  const forged = accepted.map((record) => ({
    ...record,
    authorization: { ...record.authorization, blockerRemoved: true },
  }))
  assert.throws(() => Ticket.rehydrate(
    { identity: identity('TCK-006-REHYDRATE-AUTH'), state: 'READY', revision: 1, transitions: forged },
    { resolveForRehydration: () => accepted },
  ), /accepted authority|provenance/i)

  const repository = new ConcurrentRepository()
  const rejections = new Rejections()
  repository.current = Ticket.create({ identity: identity('TCK-006-CONCURRENT') })
  const handler = new TicketTransitionHandler(repository, rejections)
  const outcomes = await Promise.all([
    handler.handle({ identity: identity('TCK-006-CONCURRENT'), target: 'READY', expectedRevision: 0, transitionId: 'concurrent-a', authorization: { documentationApproved: true, dependenciesPending: false } }),
    handler.handle({ identity: identity('TCK-006-CONCURRENT'), target: 'READY', expectedRevision: 0, transitionId: 'concurrent-b', authorization: { documentationApproved: true, dependenciesPending: false } }),
  ])
  assert.equal(outcomes.filter((outcome) => outcome.status === 'ACCEPTED').length, 1)
  assert.equal(outcomes.filter((outcome) => outcome.status === 'REJECTED').length, 1)
  assert.equal(repository.current?.state.value, 'READY')
  assert.equal(repository.current?.revision.value, 1)
  assert.equal(repository.current?.transitions.length, 1)
  assert.equal(rejections.records.length, 1)
  assert.equal(rejections.records[0].code, 'TICKET_STALE')
})
