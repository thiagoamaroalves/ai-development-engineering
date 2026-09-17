import assert from 'node:assert/strict'
import test from 'node:test'
import { CanonicalIdentityReference } from '../src/domain/identity.js'
import { ArtifactCycle, AuditCycleDomainError, AuditCycleRepository } from '../src/domain/audit-cycle.js'
import { AuditCycleCommandHandler, ExecAuditEvidenceMapper } from '../src/application/audit-cycle.js'

function identity(value = 'CYCLE-008'): CanonicalIdentityReference {
  return CanonicalIdentityReference.create({ identity: { kind: 'ARTIFACT_CYCLE', scope: 'SPEC-DOM-001', value }, revision: 1 })
}
function verdict(cycle: CanonicalIdentityReference, result: 'CONFORMANT' | 'REMEDIATION_REQUIRED' = 'CONFORMANT') {
  return { verdictId: 'VERDICT-008', result, artifactRevision: 'REV-008', cycleIdentity: cycle, round: 1, findingIds: ['FINDING-008'], structured: true, issuedByAudit: true }
}
class Repository implements AuditCycleRepository {
  current?: ArtifactCycle
  find() { return this.current }
  async save(cycle: ArtifactCycle, expectedRevision: number) { if (!this.current) return { status: 'NOT_FOUND' as const }; if (expectedRevision !== this.current.revision.value) return { status: 'STALE' as const, existing: this.current }; this.current = cycle; return { status: 'ADVANCED' as const, cycle } }
}

class ConcurrentRepository extends Repository {
  private readonly barrier: Promise<void>
  private release!: () => void
  private arrivals = 0

  constructor() {
    super()
    this.barrier = new Promise<void>((resolve) => { this.release = resolve })
  }

  async save(cycle: ArtifactCycle, expectedRevision: number) {
    this.arrivals += 1
    if (this.arrivals === 2) this.release()
    await this.barrier
    return super.save(cycle, expectedRevision)
  }
}

test('T8-AC1 creates distinct cycles and rejects reuse/skipped rounds', () => {
  const cycle = ArtifactCycle.create({ identity: identity(), artifactRevision: 'REV-008' })
  const round = cycle.appendRound({ ordinal: 1, auditorEvidenceId: 'AUDIT-EVIDENCE-1' })
  assert.equal(round.rounds[0].ordinal.value, 1)
  assert.equal(round.appendRound({ ordinal: 1, auditorEvidenceId: 'AUDIT-EVIDENCE-1' }), round)
  assert.throws(() => round.appendRound({ ordinal: 3, auditorEvidenceId: 'AUDIT-EVIDENCE-3' }), /Expected audit round/i)
  assert.throws(() => round.appendRound({ ordinal: 2, auditorEvidenceId: 'AUDIT-EVIDENCE-1' }), /reused/i)
  assert.notEqual(cycle.id.canonicalKey, ArtifactCycle.create({ identity: identity('CYCLE-008-B'), artifactRevision: 'REV-008' }).id.canonicalKey)
})

test('T8-AC2 closes only with an exact structured verdict and remains terminal', () => {
  const cycle = ArtifactCycle.create({ identity: identity('CYCLE-008-CLOSE'), artifactRevision: 'REV-008' }).appendRound({ ordinal: 1, auditorEvidenceId: 'AUDIT-EVIDENCE-CLOSE' })
  const closed = cycle.close(verdict(identity('CYCLE-008-CLOSE')))
  assert.equal(closed.status, 'CLOSED')
  assert.throws(() => closed.appendRound({ ordinal: 2, auditorEvidenceId: 'AUDIT-EVIDENCE-2' }), /Closed/i)
  assert.throws(() => cycle.close({ ...verdict(identity('CYCLE-008-CLOSE')), findingIds: [], verdictId: 'EMPTY' }), /finding evidence/i)
  assert.throws(() => cycle.close({ ...verdict(identity('CYCLE-008-CLOSE')), structured: false, verdictId: 'UNSTRUCTURED' }), /structured/i)
})

test('T8-AC2 application command preserves cycle closure and rejects absent cycle', async () => {
  const repository = new Repository()
  repository.current = ArtifactCycle.create({ identity: identity('CYCLE-008-HANDLER'), artifactRevision: 'REV-008' }).appendRound({ ordinal: 1, auditorEvidenceId: 'AUDIT-EVIDENCE-HANDLER' })
  const handler = new AuditCycleCommandHandler(repository)
  const accepted = await handler.handle({ kind: 'CLOSE', identity: identity('CYCLE-008-HANDLER'), expectedRevision: 1, verdict: verdict(identity('CYCLE-008-HANDLER')) })
  assert.equal(accepted.status, 'ACCEPTED')
  const missing = await handler.handle({ kind: 'CLOSE', identity: identity('CYCLE-MISSING'), expectedRevision: 1, verdict: verdict(identity('CYCLE-MISSING')) })
  assert.equal(missing.status, 'REJECTED')
  assert.ok(repository.current?.verdict)
  assert.equal(repository.current!.close(verdict(identity('CYCLE-008-HANDLER'))), repository.current)
  assert.throws(() => repository.current!.close({ ...verdict(identity('CYCLE-008-HANDLER')), verdictId: 'CONFLICTING' }), AuditCycleDomainError)
})

test('T8-AC2 rehydrates only accepted cycle history and rejects forged evidence', () => {
  const cycleId = identity('CYCLE-008-REHYDRATE')
  const input = {
    identity: cycleId,
    artifactRevision: 'REV-008',
    status: 'OPEN' as const,
    revision: 1,
    rounds: [{ ordinal: 1, auditorEvidenceId: 'AUDIT-EVIDENCE-REHYDRATE' }],
  }
  const authority = { resolveForRehydration: () => ({ artifactRevision: 'REV-008', revision: 1, rounds: input.rounds }) }
  const restored = ArtifactCycle.rehydrate(input, authority)
  assert.equal(restored.rounds[0].auditorEvidenceId, 'AUDIT-EVIDENCE-REHYDRATE')
  assert.throws(() => ArtifactCycle.rehydrate({ ...input, rounds: [{ ordinal: 1, auditorEvidenceId: 'FORGED' }] }, authority), /accepted authority/i)
  assert.throws(() => ArtifactCycle.rehydrate({ ...input, status: 'CLOSED', revision: 2, verdict: { ...verdict(cycleId), cycleIdentity: identity('OTHER-CYCLE') } }, authority), /attached|authority|cycle/i)
})

test('T8-AC3 maps EXEC evidence, rejects wrong identity, and proves concurrent cycle CAS', async () => {
  const mapper = new ExecAuditEvidenceMapper()
  assert.deepEqual(mapper.map({ ordinal: 1, auditorEvidenceId: 'EXEC-AUDIT-1', remediationEvidenceId: 'EXEC-REMEDIATION-1' }), { ordinal: 1, auditorEvidenceId: 'EXEC-AUDIT-1', remediationEvidenceId: 'EXEC-REMEDIATION-1' })

  const wrongKindRepository = new Repository()
  wrongKindRepository.current = ArtifactCycle.create({ identity: identity('CYCLE-008-KIND'), artifactRevision: 'REV-008' })
    .appendRound({ ordinal: 1, auditorEvidenceId: 'AUDIT-KIND' })
  const wrongKindHandler = new AuditCycleCommandHandler(wrongKindRepository)
  const wrongKind = await wrongKindHandler.handle({ kind: 'APPEND_ROUND', identity: { identity: { kind: 'TICKET', scope: 'SPEC-DOM-001', value: 'CYCLE-008-KIND' }, revision: 1 }, expectedRevision: 1, round: { ordinal: 2, auditorEvidenceId: 'AUDIT-KIND-2' } })
  assert.equal(wrongKind.status, 'REJECTED')

  const duplicateRepository = new Repository()
  duplicateRepository.current = ArtifactCycle.create({ identity: identity('CYCLE-008-DUPLICATE'), artifactRevision: 'REV-008' })
    .appendRound({ ordinal: 1, auditorEvidenceId: 'AUDIT-DUPLICATE-1' })
  const duplicateHandler = new AuditCycleCommandHandler(duplicateRepository)
  const appended = await duplicateHandler.handle({ kind: 'APPEND_ROUND', identity: identity('CYCLE-008-DUPLICATE'), expectedRevision: 1, round: { ordinal: 2, auditorEvidenceId: 'AUDIT-DUPLICATE-2' } })
  assert.equal(appended.status, 'ACCEPTED')
  const staleDuplicate = await duplicateHandler.handle({ kind: 'APPEND_ROUND', identity: identity('CYCLE-008-DUPLICATE'), expectedRevision: 1, round: { ordinal: 2, auditorEvidenceId: 'AUDIT-DUPLICATE-2' } })
  assert.equal(staleDuplicate.status, 'REJECTED')
  if (staleDuplicate.status === 'REJECTED') assert.equal(staleDuplicate.code, 'AUDIT_CYCLE_STALE')
  const exactDuplicate = await duplicateHandler.handle({ kind: 'APPEND_ROUND', identity: identity('CYCLE-008-DUPLICATE'), expectedRevision: 2, round: { ordinal: 2, auditorEvidenceId: 'AUDIT-DUPLICATE-2' } })
  assert.equal(exactDuplicate.status, 'ACCEPTED')

  const repository = new ConcurrentRepository()
  repository.current = ArtifactCycle.create({ identity: identity('CYCLE-008-CONCURRENT'), artifactRevision: 'REV-008' })
    .appendRound({ ordinal: 1, auditorEvidenceId: 'AUDIT-CONCURRENT-1' })
  const handler = new AuditCycleCommandHandler(repository)
  const outcomes = await Promise.all([
    handler.handle({ kind: 'APPEND_ROUND', identity: identity('CYCLE-008-CONCURRENT'), expectedRevision: 1, round: { ordinal: 2, auditorEvidenceId: 'AUDIT-CONCURRENT-2A' } }),
    handler.handle({ kind: 'APPEND_ROUND', identity: identity('CYCLE-008-CONCURRENT'), expectedRevision: 1, round: { ordinal: 2, auditorEvidenceId: 'AUDIT-CONCURRENT-2B' } }),
  ])
  assert.equal(outcomes.filter((outcome) => outcome.status === 'ACCEPTED').length, 1)
  assert.equal(outcomes.filter((outcome) => outcome.status === 'REJECTED').length, 1)
  assert.equal(repository.current?.revision.value, 2)
  assert.equal(repository.current?.rounds.length, 2)
})
