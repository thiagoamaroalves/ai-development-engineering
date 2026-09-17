import assert from 'node:assert/strict'
import test from 'node:test'
import { CanonicalIdentityReference } from '../src/domain/identity.js'
import { CandidateBasis, Publication, PublicationRepository } from '../src/domain/publication.js'
import { GitPublicationEvidenceMapper, PublicationCommandHandler } from '../src/application/publication.js'

function identity(value = 'PUB-007'): CanonicalIdentityReference {
  return CanonicalIdentityReference.create({ identity: { kind: 'PUBLICATION', scope: 'SPEC-DOM-001', value }, revision: 1 })
}
function basis(): CandidateBasis { return CandidateBasis.create({ candidateId: 'CAND-007', baseSha: 'base-007', headSha: 'head-007', treeHash: 'tree-007', conformanceRunId: 'CONF-007' }) }
function publication(value = 'PUB-007'): Publication { return Publication.create({ identity: identity(value), basis: basis(), units: [{ unitId: 'UNIT-A', state: 'ACTIVE' }, { unitId: 'UNIT-B', state: 'ACTIVE' }] }) }

class Repository implements PublicationRepository {
  current?: Publication
  find() { return this.current }
  async advance(proposed: Publication, expectedRevision: Publication['revision']) {
    if (!this.current) return { status: 'NOT_FOUND' as const }
    if (this.current.revision.value !== expectedRevision.value) return { status: 'STALE' as const, existing: this.current }
    this.current = proposed
    return { status: 'ADVANCED' as const, publication: proposed }
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

  async advance(proposed: Publication, expectedRevision: Publication['revision']) {
    this.arrivals += 1
    if (this.arrivals === 2) this.release()
    await this.barrier
    return super.advance(proposed, expectedRevision)
  }
}

test('T7-AC1 keeps PR_MERGED distinct from remote confirmation', () => {
  const evidenceMapper = new GitPublicationEvidenceMapper()
  const mappedEvidence = evidenceMapper.map({ candidateId: 'CAND-007', baseSha: 'base-007', headSha: 'head-007', treeHash: 'tree-007', conformanceRunId: 'CONF-007', evidenceId: 'REMOTE-EVIDENCE-007' })
  assert.equal(mappedEvidence.conformanceRunId, 'CONF-007')
  let current = publication()
  current = current.transition({ target: 'AWAITING_PUBLICATION_APPROVAL', expectedRevision: 0, transitionId: 'request', authorization: { approvalRequested: true } })
  current = current.transition({ target: 'LOCAL_INTEGRATION_PENDING', expectedRevision: 1, transitionId: 'approve', authorization: { verdict: 'APPROVED', dependencyClosure: 'CLOSED', activeWork: false, candidateBasis: basis() } })
  current = current.transition({ target: 'LOCAL_INTEGRATION_COMPLETE', expectedRevision: 2, transitionId: 'integrate', authorization: { localIntegrationConfirmed: true } })
  current = current.transition({ target: 'PR_OPEN', expectedRevision: 3, transitionId: 'pr-open', authorization: { prOpened: true } })
  current = current.transition({ target: 'AWAITING_PR_MERGE', expectedRevision: 4, transitionId: 'merge-request', authorization: { mergeRequested: true } })
  current = current.transition({ target: 'PR_MERGED', expectedRevision: 5, transitionId: 'merged', authorization: { prMerged: true } })
  assert.equal(current.state.value, 'PR_MERGED')
  assert.notEqual(current.state.value, 'REMOTE_PUBLICATION_CONFIRMED')
  const confirmed = current.transition({ target: 'REMOTE_PUBLICATION_CONFIRMED', expectedRevision: 6, transitionId: 'remote-confirm', authorization: { remoteConfirmation: { candidateId: 'CAND-007', baseSha: 'base-007', headSha: 'head-007', treeHash: 'tree-007', conformanceRunId: 'CONF-007', evidenceId: 'REMOTE-EVIDENCE-007' } } })
  assert.equal(confirmed.state.value, 'REMOTE_PUBLICATION_CONFIRMED')
  assert.equal(confirmed.transition({ target: 'REMOTE_PUBLICATION_CONFIRMED', expectedRevision: 6, transitionId: 'remote-confirm', authorization: { remoteConfirmation: { candidateId: 'CAND-007', baseSha: 'base-007', headSha: 'head-007', treeHash: 'tree-007', conformanceRunId: 'CONF-007', evidenceId: 'REMOTE-EVIDENCE-007' } } }), confirmed)
  assert.throws(() => current.transition({ target: 'REMOTE_PUBLICATION_CONFIRMED', expectedRevision: 6, transitionId: 'remote-drift', authorization: { remoteConfirmation: { candidateId: 'CAND-007', baseSha: 'base-007', headSha: 'drifted', treeHash: 'tree-007', conformanceRunId: 'CONF-007', evidenceId: 'REMOTE-EVIDENCE-007' } } }), /gate/i)
  assert.throws(() => current.transition({ target: 'REMOTE_PUBLICATION_CONFIRMED', expectedRevision: 6, transitionId: 'remote-run-drift', authorization: { remoteConfirmation: { candidateId: 'CAND-007', baseSha: 'base-007', headSha: 'head-007', treeHash: 'tree-007', conformanceRunId: 'OTHER-RUN', evidenceId: 'REMOTE-EVIDENCE-007' } } }), /gate/i)
})

test('T7-AC2 rejects missing verdict, open dependency, active work, or stale candidate', () => {
  let current = publication('PUB-007-GATE').transition({ target: 'AWAITING_PUBLICATION_APPROVAL', expectedRevision: 0, transitionId: 'request', authorization: { approvalRequested: true } })
  assert.throws(() => current.transition({ target: 'LOCAL_INTEGRATION_PENDING', expectedRevision: 1, transitionId: 'no-verdict', authorization: { dependencyClosure: 'CLOSED', activeWork: false } }), /gate/i)
  assert.throws(() => current.transition({ target: 'LOCAL_INTEGRATION_PENDING', expectedRevision: 1, transitionId: 'open-deps', authorization: { verdict: 'APPROVED', dependencyClosure: 'OPEN', activeWork: false } }), /gate/i)
  assert.throws(() => current.transition({ target: 'LOCAL_INTEGRATION_PENDING', expectedRevision: 1, transitionId: 'active', authorization: { verdict: 'APPROVED', dependencyClosure: 'CLOSED', activeWork: true } }), /gate/i)
  assert.throws(() => current.transition({ target: 'LOCAL_INTEGRATION_PENDING', expectedRevision: 1, transitionId: 'stale-basis', authorization: { verdict: 'APPROVED', dependencyClosure: 'CLOSED', activeWork: false, candidateBasis: { ...basis(), headSha: 'drifted' } } }), /gate/i)
})

test('T7-AC3 keeps cooperative cancellation unit-local and maps through the application boundary', async () => {
  const repository = new Repository(); repository.current = publication('PUB-007-CANCEL')
  const handler = new PublicationCommandHandler(repository)
  const accepted = await handler.handle({ identity: identity('PUB-007-CANCEL'), target: 'AWAITING_PUBLICATION_APPROVAL', expectedRevision: 0, transitionId: 'request', authorization: { approvalRequested: true } })
  assert.equal(accepted.status, 'ACCEPTED')
  const changed = repository.current!.changeUnitProgress('UNIT-A', 'CANCEL_REQUESTED', 1, 'cancel-a')
  assert.equal(changed.units.find((unit) => unit.unitId === 'UNIT-A')?.state, 'CANCEL_REQUESTED')
  assert.equal(changed.units.find((unit) => unit.unitId === 'UNIT-B')?.state, 'ACTIVE')
  assert.equal(changed.changeUnitProgress('UNIT-A', 'CANCEL_REQUESTED', 1, 'cancel-a'), changed)
  assert.throws(() => changed.changeUnitProgress('UNIT-A', 'PAUSED', 1, 'cancel-a'), /reused with different semantics/i)
  assert.throws(() => changed.changeUnitProgress('UNIT-A', 'ACTIVE', changed.revision, 'reopen-a'), /cannot transition/i)
})

test('T7-AC4 binds exact replay and recovery authority, identity kind, and concurrent CAS', async () => {
  let current = publication('PUB-007-REHYDRATE')
  current = current.transition({ target: 'AWAITING_PUBLICATION_APPROVAL', expectedRevision: 0, transitionId: 'request', authorization: { approvalRequested: true } })
  current = current.transition({ target: 'LOCAL_INTEGRATION_PENDING', expectedRevision: 1, transitionId: 'approve', authorization: { verdict: 'APPROVED', dependencyClosure: 'CLOSED', activeWork: false, candidateBasis: basis() } })
  current = current.transition({ target: 'LOCAL_INTEGRATION_COMPLETE', expectedRevision: 2, transitionId: 'integrate', authorization: { localIntegrationConfirmed: true } })
  const restored = Publication.rehydrate(
    { identity: identity('PUB-007-REHYDRATE'), basis: basis(), state: 'LOCAL_INTEGRATION_COMPLETE', revision: 3, units: [{ unitId: 'UNIT-A', state: 'ACTIVE' }, { unitId: 'UNIT-B', state: 'ACTIVE' }], transitions: current.transitions },
    { resolveBasisForRehydration: () => basis(), resolveForRehydration: () => current.transitions },
  )
  assert.equal(restored.state.value, 'LOCAL_INTEGRATION_COMPLETE')
  assert.equal(restored.revision.value, 3)
  assert.throws(() => Publication.rehydrate(
    { identity: identity('PUB-007-REHYDRATE'), basis: { ...basis(), conformanceRunId: 'OTHER-RUN' }, state: 'LOCAL_INTEGRATION_COMPLETE', revision: 3, units: [{ unitId: 'UNIT-A', state: 'ACTIVE' }, { unitId: 'UNIT-B', state: 'ACTIVE' }], transitions: current.transitions },
    { resolveBasisForRehydration: () => basis(), resolveForRehydration: () => current.transitions },
  ), /basis does not match/i)
  const forged = current.transitions.map((record, index) => index === 1
    ? { ...record, authorization: { ...record.authorization, candidateBasis: { ...basis(), headSha: 'drifted' } } }
    : record)
  assert.throws(() => Publication.rehydrate(
    { identity: identity('PUB-007-REHYDRATE'), basis: basis(), state: 'LOCAL_INTEGRATION_COMPLETE', revision: 3, units: [{ unitId: 'UNIT-A', state: 'ACTIVE' }, { unitId: 'UNIT-B', state: 'ACTIVE' }], transitions: forged },
    { resolveBasisForRehydration: () => basis(), resolveForRehydration: () => current.transitions },
  ), /accepted authority/i)

  const first = publication('PUB-007-DUPLICATE').transition({ target: 'AWAITING_PUBLICATION_APPROVAL', expectedRevision: 0, transitionId: 'duplicate', authorization: { approvalRequested: true } })
  assert.throws(() => first.transition({ target: 'AWAITING_PUBLICATION_APPROVAL', expectedRevision: 99, transitionId: 'duplicate', authorization: { approvalRequested: true } }), /reused with different semantics/i)

  const wrongKindRepository = new Repository(); wrongKindRepository.current = publication('PUB-007-KIND')
  const wrongKind = new PublicationCommandHandler(wrongKindRepository)
  const wrongKindOutcome = await wrongKind.handle({ identity: { identity: { kind: 'TICKET', scope: 'SPEC-DOM-001', value: 'PUB-007-KIND' }, revision: 1 }, target: 'AWAITING_PUBLICATION_APPROVAL', expectedRevision: 0, transitionId: 'wrong-kind', authorization: { approvalRequested: true } })
  assert.equal(wrongKindOutcome.status, 'REJECTED')

  const repository = new ConcurrentRepository()
  repository.current = publication('PUB-007-CONCURRENT')
  const handler = new PublicationCommandHandler(repository)
  const outcomes = await Promise.all([
    handler.handle({ identity: identity('PUB-007-CONCURRENT'), target: 'AWAITING_PUBLICATION_APPROVAL', expectedRevision: 0, transitionId: 'concurrent-a', authorization: { approvalRequested: true } }),
    handler.handle({ identity: identity('PUB-007-CONCURRENT'), target: 'AWAITING_PUBLICATION_APPROVAL', expectedRevision: 0, transitionId: 'concurrent-b', authorization: { approvalRequested: true } }),
  ])
  assert.equal(outcomes.filter((outcome) => outcome.status === 'ACCEPTED').length, 1)
  assert.equal(outcomes.filter((outcome) => outcome.status === 'REJECTED').length, 1)
  assert.equal(repository.current?.revision.value, 1)
  assert.equal(repository.current?.transitions.length, 1)
})
