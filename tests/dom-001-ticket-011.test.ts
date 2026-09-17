import assert from 'node:assert/strict'
import test from 'node:test'
import {
  CandidateBasis,
} from '../src/domain/publication.js'
import {
  CandidateEvidenceGate,
  CandidateEvidenceObservation,
  CandidateEvidenceReader,
  CandidateEvidenceRepository,
} from '../src/domain/candidate-evidence.js'
import {
  CandidateEvidenceGateHandler,
  GitCandidateEvidenceMapper,
} from '../src/application/candidate-evidence.js'

const basis = CandidateBasis.create({
  candidateId: 'candidate-1',
  baseSha: 'base-1',
  headSha: 'head-1',
  treeHash: 'tree-1',
  conformanceRunId: 'conformance-1',
})

function observation(overrides: Partial<{
  candidateId: string
  baseSha: string
  headSha: string
  treeHash: string
  conformanceRunId: string
  evidenceId: string
  evidenceHash: string
  observationId: string
}> = {}): CandidateEvidenceObservation {
  return CandidateEvidenceObservation.create({
    basis: {
      candidateId: overrides.candidateId ?? basis.candidateId,
      baseSha: overrides.baseSha ?? basis.baseSha,
      headSha: overrides.headSha ?? basis.headSha,
      treeHash: overrides.treeHash ?? basis.treeHash,
      conformanceRunId: overrides.conformanceRunId ?? basis.conformanceRunId,
    },
    evidenceId: overrides.evidenceId ?? 'evidence-1',
    evidenceHash: overrides.evidenceHash ?? 'evidence-hash-1',
    observationId: overrides.observationId ?? 'observation-1',
  })
}

class SequenceEvidenceReader implements CandidateEvidenceReader {
  private index = 0

  constructor(private readonly values: readonly CandidateEvidenceObservation[]) {}

  observe(): CandidateEvidenceObservation | undefined {
    const value = this.values[Math.min(this.index, this.values.length - 1)]
    this.index += 1
    return value
  }
}

class MemoryGateRepository implements CandidateEvidenceRepository {
  current?: CandidateEvidenceGate
  commitCalls = 0

  find(): CandidateEvidenceGate | undefined {
    return this.current
  }

  async commit(
    gate: CandidateEvidenceGate,
    expectedRevision: CandidateEvidenceGate['revision'],
  ): Promise<{ status: 'ADVANCED'; gate: CandidateEvidenceGate } | { status: 'STALE'; existing?: CandidateEvidenceGate } | { status: 'DUPLICATE'; existing: CandidateEvidenceGate }> {
    this.commitCalls += 1
    if (this.current && expectedRevision.value !== this.current.revision.value) return { status: 'STALE', existing: this.current }
    if (this.current) return { status: 'DUPLICATE', existing: this.current }
    this.current = gate
    return { status: 'ADVANCED', gate }
  }
}

test('T11-AC1: exact candidate and hash-linked evidence binding is authorized', async () => {
  const first = observation({ observationId: 'observation-1' })
  const second = observation({ observationId: 'observation-2' })
  const repository = new MemoryGateRepository()
  const handler = new CandidateEvidenceGateHandler(new SequenceEvidenceReader([first, second]), repository)

  const result = await handler.authorize({ candidateId: basis.candidateId, basis, expectedRevision: 0 })
  assert.equal(result.status, 'ACCEPTED')
  if (result.status !== 'ACCEPTED') return
  assert.equal(result.gate.state, 'AUTHORIZED')
  assert.equal(result.gate.firstObservation.basis.headSha, 'head-1')
  assert.equal(result.gate.secondObservation.evidenceHash.value, 'evidence-hash-1')
  assert.equal(result.gate.revision.value, 1)
  assert.equal(result.duplicate, false)
})

test('T11-AC2: every candidate/evidence drift dimension fails closed before commit', async () => {
  const dimensions = [
    ['candidateId', 'candidate-2'],
    ['baseSha', 'base-2'],
    ['headSha', 'head-2'],
    ['treeHash', 'tree-2'],
    ['conformanceRunId', 'conformance-2'],
    ['evidenceId', 'evidence-2'],
    ['evidenceHash', 'evidence-hash-2'],
  ] as const

  for (const [dimension, value] of dimensions) {
    const repository = new MemoryGateRepository()
    const handler = new CandidateEvidenceGateHandler(new SequenceEvidenceReader([
      observation({ observationId: `${dimension}-first` }),
      observation({ [dimension]: value, observationId: `${dimension}-second` }),
    ]), repository)
    const result = await handler.authorize({ candidateId: basis.candidateId, basis, expectedRevision: 0 })
    assert.equal(result.status, 'REJECTED', dimension)
    assert.equal(result.code, 'CANDIDATE_DRIFT', dimension)
    assert.equal(repository.commitCalls, 0, dimension)
  }
})

test('T11 negative: caller identity mismatch and self-comparison cannot authorize', async () => {
  const repository = new MemoryGateRepository()
  const handler = new CandidateEvidenceGateHandler(new SequenceEvidenceReader([
    observation({ observationId: 'same-observation' }),
    observation({ observationId: 'same-observation' }),
  ]), repository)

  const mismatch = await handler.authorize({ candidateId: 'other-candidate', basis, expectedRevision: 0 })
  assert.equal(mismatch.status, 'REJECTED')
  assert.equal(mismatch.code, 'CANDIDATE_CONFLICT')

  const selfCompared = await handler.authorize({ candidateId: basis.candidateId, basis, expectedRevision: 0 })
  assert.equal(selfCompared.status, 'REJECTED')
  assert.equal(selfCompared.code, 'CANDIDATE_DRIFT')
  assert.equal(repository.commitCalls, 0)
})

test('T11 exact retry is idempotent and stale retry is rejected', async () => {
  const first = observation({ observationId: 'observation-1' })
  const second = observation({ observationId: 'observation-2' })
  const retryFirst = observation({ observationId: 'retry-observation-1' })
  const retrySecond = observation({ observationId: 'retry-observation-2' })
  const repository = new MemoryGateRepository()
  const handler = new CandidateEvidenceGateHandler(new SequenceEvidenceReader([first, second, retryFirst, retrySecond]), repository)

  const accepted = await handler.authorize({ candidateId: basis.candidateId, basis, expectedRevision: 0 })
  assert.equal(accepted.status, 'ACCEPTED')
  if (accepted.status !== 'ACCEPTED') return

  const duplicate = await handler.authorize({ candidateId: basis.candidateId, basis, expectedRevision: 1 })
  assert.equal(duplicate.status, 'ACCEPTED')
  if (duplicate.status !== 'ACCEPTED') return
  assert.equal(duplicate.duplicate, true)
  assert.equal(repository.commitCalls, 1)

  const stale = await handler.authorize({ candidateId: basis.candidateId, basis, expectedRevision: 0 })
  assert.equal(stale.status, 'REJECTED')
  assert.equal(stale.code, 'CANDIDATE_STALE')
})

test('T11 concurrency: one exact candidate authorization wins the CAS revision', async () => {
  const repository = new MemoryGateRepository()
  const reader = new SequenceEvidenceReader([
    observation({ observationId: 'first-1' }),
    observation({ observationId: 'first-2' }),
    observation({ observationId: 'second-1' }),
    observation({ observationId: 'second-2' }),
  ])
  const handler = new CandidateEvidenceGateHandler(reader, repository)

  const [first, second] = await Promise.all([
    handler.authorize({ candidateId: basis.candidateId, basis, expectedRevision: 0 }),
    handler.authorize({ candidateId: basis.candidateId, basis, expectedRevision: 0 }),
  ])
  const statuses = [first.status, second.status].sort()
  assert.deepEqual(statuses, ['ACCEPTED', 'REJECTED'])
  assert.equal(repository.commitCalls, 1)
})

test('T11 recovery and mapper preserve exact evidence relation without executing Git', () => {
  const first = observation({ observationId: 'observation-1' })
  const second = observation({ observationId: 'observation-2' })
  const gate = CandidateEvidenceGate.authorize(first, second)
  const recovered = CandidateEvidenceGate.rehydrate({
    firstObservation: gate.firstObservation,
    secondObservation: gate.secondObservation,
    state: gate.state,
    revision: gate.revision,
  }, { resolveForRehydration: () => gate })
  const mapped = new GitCandidateEvidenceMapper().map({
    candidateId: 'candidate-1',
    baseSha: 'base-1',
    headSha: 'head-1',
    treeHash: 'tree-1',
    conformanceRunId: 'conformance-1',
    evidenceId: 'evidence-1',
    evidenceHash: 'evidence-hash-1',
    observationId: 'observation-3',
  })

  assert.equal(recovered.exactEquals(gate), true)
  assert.equal(mapped.basis.candidateId, 'candidate-1')
  assert.equal(mapped.evidenceHash.value, 'evidence-hash-1')
  assert.throws(() => CandidateEvidenceGate.rehydrate({
    firstObservation: gate.firstObservation,
    secondObservation: gate.secondObservation,
    state: gate.state,
    revision: gate.revision,
    invalidationReason: 'tampered',
  }, { resolveForRehydration: () => gate }), /invalidation reason/i)
  assert.throws(() => CandidateEvidenceGate.rehydrate({
    firstObservation: gate.firstObservation,
    secondObservation: gate.secondObservation,
    state: gate.state,
    revision: gate.revision.value + 1,
  }, { resolveForRehydration: () => gate }), /authority/i)
})
