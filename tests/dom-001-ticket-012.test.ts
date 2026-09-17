import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import test from 'node:test'
import { dirname, resolve } from 'node:path'
import {
  FINAL_CONFORMANCE_DIMENSIONS,
  FinalConformanceDomainError,
  FinalConformanceEvidenceBundle,
  FinalConformanceEvidenceBundleInput,
  FinalConformanceEvidenceReader,
  FinalConformanceEvaluation,
  FinalConformanceRepository,
  FinalConformanceScope,
  FinalConformanceRevision,
} from '../src/domain/final-conformance.js'
import { FinalConformanceCommand, FinalConformanceHandler } from '../src/application/final-conformance.js'

class InMemoryFinalConformanceRepository implements FinalConformanceRepository {
  private evaluation?: FinalConformanceEvaluation
  commits = 0

  find() {
    return this.evaluation
  }

  async commit(
    evaluation: FinalConformanceEvaluation,
    expectedRevision: FinalConformanceRevision,
  ) {
    this.commits += 1
    if (this.evaluation && !this.evaluation.revision.equals(expectedRevision)) {
      return { status: 'STALE' as const, existing: this.evaluation }
    }
    if (this.evaluation) return { status: 'DUPLICATE' as const, existing: this.evaluation }
    this.evaluation = evaluation
    return { status: 'ADVANCED' as const, evaluation }
  }

  value(): FinalConformanceEvaluation | undefined {
    return this.evaluation
  }
}

class SequenceEvidenceReader implements FinalConformanceEvidenceReader {
  calls = 0

  constructor(private readonly observations: readonly FinalConformanceEvidenceBundle[]) {}

  observe(): FinalConformanceEvidenceBundle | undefined {
    const observation = this.observations[Math.min(this.calls, this.observations.length - 1)]
    this.calls += 1
    return observation
  }
}

class GeneratedObservationReader implements FinalConformanceEvidenceReader {
  calls = 0

  constructor(private readonly bundle: FinalConformanceEvidenceBundle) {}

  observe(): FinalConformanceEvidenceBundle {
    this.calls += 1
    return FinalConformanceEvidenceBundle.create({
      scope: this.bundle.scope,
      observationId: `OBS-${this.calls}`,
      items: this.bundle.items,
    })
  }
}

class BarrierFinalConformanceRepository implements FinalConformanceRepository {
  private evaluation?: FinalConformanceEvaluation
  private commits = 0
  private release!: () => void
  private readonly barrier = new Promise<void>((resolveBarrier) => {
    this.release = resolveBarrier
  })

  find() {
    return this.evaluation
  }

  async commit(
    evaluation: FinalConformanceEvaluation,
    expectedRevision: FinalConformanceRevision,
  ) {
    this.commits += 1
    if (this.commits === 2) this.release()
    await this.barrier
    if (this.evaluation && this.evaluation.sameEvidence(evaluation)) {
      return { status: 'DUPLICATE' as const, existing: this.evaluation }
    }
    if (this.evaluation && !this.evaluation.revision.equals(expectedRevision)) {
      return { status: 'STALE' as const, existing: this.evaluation }
    }
    if (this.evaluation) return { status: 'DUPLICATE' as const, existing: this.evaluation }
    this.evaluation = evaluation
    return { status: 'ADVANCED' as const, evaluation }
  }

  value(): FinalConformanceEvaluation | undefined {
    return this.evaluation
  }
}

function scope(overrides: Partial<{
  artifactRevision: string
  implementationRevision: string
}> = {}): FinalConformanceScope {
  return FinalConformanceScope.create({
    artifactIdentity: {
      identity: { kind: 'ARTIFACT', scope: 'EXECUTION-012', value: 'ARTIFACT-012' },
      revision: 1,
    },
    artifactRevision: overrides.artifactRevision ?? 'artifact-revision-1',
    cycleIdentity: {
      identity: { kind: 'ARTIFACT_CYCLE', scope: 'ARTIFACT-012', value: 'CYCLE-012' },
      revision: 1,
    },
    implementationRevision: overrides.implementationRevision ?? 'implementation-revision-1',
    candidateBasis: {
      candidateId: 'CANDIDATE-012',
      baseSha: 'base-sha-012',
      headSha: 'head-sha-012',
      treeHash: 'tree-hash-012',
      conformanceRunId: 'conformance-run-012',
    },
    evaluatorVersion: 'dom-final-conformance-v1',
  })
}

function bundle(
  currentScope: FinalConformanceScope = scope(),
  overrides: Partial<Record<string, { result: 'PROVEN' | 'FAILED'; detail?: string }>> = {},
  observationId = 'OBS-1',
): FinalConformanceEvidenceBundle {
  return FinalConformanceEvidenceBundle.create({
    scope: currentScope,
    observationId,
    items: FINAL_CONFORMANCE_DIMENSIONS.map((dimension) => ({
      scope: currentScope,
      dimension,
      result: overrides[dimension]?.result ?? 'PROVEN',
      evidenceId: `EVIDENCE-${dimension}`,
      evidenceHash: `HASH-${dimension}`,
      detail: overrides[dimension]?.detail,
    })),
  })
}

function command(evidence: FinalConformanceEvidenceBundle, expectedRevision = 0): FinalConformanceCommand {
  return { evidence, expectedRevision }
}

test('T12-AC1 evaluates all seven exact dimensions into a structured conformant result', async () => {
  const canonical = bundle(scope(), {}, 'CANONICAL-1')
  const second = bundle(canonical.scope, {}, 'CANONICAL-2')
  const repository = new InMemoryFinalConformanceRepository()
  const outcome = await new FinalConformanceHandler(
    new SequenceEvidenceReader([canonical, second]),
    repository,
  ).handle(command(bundle(canonical.scope, {}, 'CALLER-CLAIM')))

  assert.equal(outcome.status, 'ACCEPTED')
  if (outcome.status === 'ACCEPTED') {
    assert.equal(outcome.evaluation.result, 'CONFORMANT')
    assert.equal(outcome.evaluation.findings.length, 0)
    assert.equal(outcome.evaluation.evidence.observationId, 'CANONICAL-2')
    assert.deepEqual(
      outcome.evaluation.evidence.items.map((item) => item.dimension),
      [...FINAL_CONFORMANCE_DIMENSIONS],
    )
    assert.equal(outcome.evaluation.scope.equals(canonical.scope), true)
    assert.equal(Object.isFrozen(outcome.evaluation), true)
    assert.equal(Object.isFrozen(outcome.evaluation.evidence.items), true)
  }
  assert.equal(repository.commits, 1)
})

test('T12-AC1 returns findings for omission, contradiction, duplicate, and extrapolated evidence', async () => {
  const currentScope = scope()
  const complete = bundle(currentScope, {
    INTEGRATION: { result: 'FAILED', detail: 'Integration evidence was not complete.' },
  }, 'CANONICAL-1')
  const malformed = FinalConformanceEvidenceBundle.create({
    scope: currentScope,
    observationId: 'CANONICAL-2',
    items: [
      ...complete.items.filter((item) => item.dimension !== 'COVERAGE'),
      complete.items.find((item) => item.dimension === 'ADHERENCE')!,
      {
        scope: currentScope,
        dimension: 'FUTURE_DIMENSION',
        result: 'PROVEN',
        evidenceId: 'EVIDENCE-FUTURE',
        evidenceHash: 'HASH-FUTURE',
      },
    ],
  })
  const repository = new InMemoryFinalConformanceRepository()
  const outcome = await new FinalConformanceHandler(
    new SequenceEvidenceReader([complete, malformed]),
    repository,
  ).handle(command(complete))

  assert.equal(outcome.status, 'REJECTED')
  if (outcome.status === 'REJECTED') assert.equal(outcome.code, 'FINAL_CONFORMANCE_EVIDENCE_DRIFT')
  assert.equal(repository.commits, 0)

  const stableRepository = new InMemoryFinalConformanceRepository()
  const remediationBundle = FinalConformanceEvidenceBundle.create({
    scope: currentScope,
    observationId: 'CANONICAL-3',
    items: malformed.items,
  })
  const remediationOutcome = await new FinalConformanceHandler(
    new SequenceEvidenceReader([remediationBundle, FinalConformanceEvidenceBundle.create({ ...remediationBundle, observationId: 'CANONICAL-4' })]),
    stableRepository,
  ).handle(command(remediationBundle))

  assert.equal(remediationOutcome.status, 'ACCEPTED')
  if (remediationOutcome.status === 'ACCEPTED') {
    assert.equal(remediationOutcome.evaluation.result, 'REMEDIATION_REQUIRED')
    assert.deepEqual(
      new Set(remediationOutcome.evaluation.findings.map((finding) => finding.category)),
      new Set(['MISSING_DIMENSION', 'DUPLICATE_DIMENSION', 'EXTRAPOLATED_DIMENSION', 'FAILED_DIMENSION']),
    )
    assert.equal(remediationOutcome.evaluation.findings.some((finding) => finding.dimension === 'COVERAGE'), true)
    assert.equal(remediationOutcome.evaluation.findings.some((finding) => finding.dimension === 'FUTURE_DIMENSION'), true)
  }
})

test('T12-AC2 distinguishes structured remediation from process termination and never treats empty evidence as approval', async () => {
  const empty = FinalConformanceEvidenceBundle.create({
    scope: scope(),
    observationId: 'EMPTY-1',
    items: [],
  })
  const second = FinalConformanceEvidenceBundle.create({ ...empty, observationId: 'EMPTY-2' })
  const outcome = await new FinalConformanceHandler(
    new SequenceEvidenceReader([empty, second]),
    new InMemoryFinalConformanceRepository(),
  ).handle(command(empty))

  assert.equal(outcome.status, 'ACCEPTED')
  if (outcome.status === 'ACCEPTED') {
    assert.equal(outcome.evaluation.result, 'REMEDIATION_REQUIRED')
    assert.equal(outcome.evaluation.findings.length, FINAL_CONFORMANCE_DIMENSIONS.length)
    assert.equal(Object.prototype.hasOwnProperty.call(outcome.evaluation, 'TERMINATED'), false)
  }

  const unavailable = await new FinalConformanceHandler(
    new SequenceEvidenceReader([]),
    new InMemoryFinalConformanceRepository(),
  ).handle(command(empty))
  assert.equal(unavailable.status, 'REJECTED')
  if (unavailable.status === 'REJECTED') assert.equal(unavailable.code, 'FINAL_CONFORMANCE_NOT_FOUND')
})

test('T12-AC3 rejects caller authority, exact-evidence drift, and same-observation rereads before commit', async () => {
  const canonical = bundle(scope(), {}, 'CANONICAL-1')
  const changed = bundle(canonical.scope, {
    TESTS: { result: 'FAILED', detail: 'Test evidence changed.' },
  }, 'CANONICAL-2')
  const repository = new InMemoryFinalConformanceRepository()
  const callerForgery = bundle(canonical.scope, {
    COVERAGE: { result: 'FAILED', detail: 'Caller-forged failure.' },
  }, 'CALLER-1')
  const forgedOutcome = await new FinalConformanceHandler(
    new SequenceEvidenceReader([canonical, canonical]),
    repository,
  ).handle(command(callerForgery))
  assert.equal(forgedOutcome.status, 'REJECTED')
  if (forgedOutcome.status === 'REJECTED') assert.equal(forgedOutcome.code, 'FINAL_CONFORMANCE_EVIDENCE_DRIFT')
  assert.equal(repository.commits, 0)

  assert.throws(
    () => FinalConformanceEvidenceBundle.create({
      ...canonical.toInput(),
      items: canonical.items.map((item, index) => index === 0
        ? { ...item.toInput(), scope: scope({ artifactRevision: 'detached-artifact-revision' }) }
        : item),
    }),
    (error: unknown) => error instanceof FinalConformanceDomainError
      && error.code === 'FINAL_CONFORMANCE_SCOPE_MISMATCH',
  )

  const driftOutcome = await new FinalConformanceHandler(
    new SequenceEvidenceReader([canonical, changed]),
    repository,
  ).handle(command(canonical))
  assert.equal(driftOutcome.status, 'REJECTED')
  if (driftOutcome.status === 'REJECTED') assert.equal(driftOutcome.code, 'FINAL_CONFORMANCE_EVIDENCE_DRIFT')
  assert.equal(repository.commits, 0)

  const sameObservationOutcome = await new FinalConformanceHandler(
    new SequenceEvidenceReader([canonical, canonical]),
    repository,
  ).handle(command(canonical))
  assert.equal(sameObservationOutcome.status, 'REJECTED')
  if (sameObservationOutcome.status === 'REJECTED') assert.equal(sameObservationOutcome.code, 'FINAL_CONFORMANCE_EVIDENCE_DRIFT')
  assert.equal(repository.commits, 0)
})

test('T12-AC3 preserves exact artifact/cycle/implementation linkage through authority-backed recovery', async () => {
  const canonical = bundle(scope(), {}, 'CANONICAL-1')
  const second = bundle(canonical.scope, {}, 'CANONICAL-2')
  const evaluation = FinalConformanceEvaluation.evaluate(second)
  const snapshot = evaluation.toSnapshot()
  const restored = FinalConformanceEvaluation.rehydrate(snapshot, {
    resolveForRehydration: (identity) => identity.equals(second.scope.cycleIdentity) ? snapshot : undefined,
  })

  assert.equal(restored.result, 'CONFORMANT')
  assert.equal(restored.scope.equals(evaluation.scope), true)
  assert.equal(restored.evidence.exactEquals(evaluation.evidence), true)
  assert.deepEqual(restored.findings, evaluation.findings)

  const forgedSnapshot = {
    ...snapshot,
    scope: { ...snapshot.scope, artifactRevision: 'forged-artifact-revision' },
  }
  assert.throws(
    () => FinalConformanceEvaluation.rehydrate(forgedSnapshot, {
      resolveForRehydration: () => snapshot,
    }),
    (error: unknown) => error instanceof FinalConformanceDomainError
      && error.code === 'FINAL_CONFORMANCE_RECONSTRUCTION_AUTHORITY_REQUIRED',
  )
})

test('T12 exact retry is idempotent while stale and conflicting replays preserve the accepted result', async () => {
  const canonical = bundle(scope(), {}, 'CANONICAL-1')
  const repository = new InMemoryFinalConformanceRepository()
  const first = new FinalConformanceHandler(new GeneratedObservationReader(canonical), repository)
  const firstOutcome = await first.handle(command(canonical))
  assert.equal(firstOutcome.status, 'ACCEPTED')

  const retry = await new FinalConformanceHandler(new GeneratedObservationReader(canonical), repository)
    .handle(command(canonical, 1))
  assert.equal(retry.status, 'ACCEPTED')
  if (retry.status === 'ACCEPTED') assert.equal(retry.duplicate, true)

  const stale = await new FinalConformanceHandler(new GeneratedObservationReader(canonical), repository)
    .handle(command(canonical, 0))
  assert.equal(stale.status, 'REJECTED')
  if (stale.status === 'REJECTED') assert.equal(stale.code, 'FINAL_CONFORMANCE_STALE')

  const conflicting = bundle(scope(), {
    INTEGRATION: { result: 'FAILED', detail: 'Conflicting result.' },
  }, 'CONFLICT-CALLER')
  const conflictOutcome = await new FinalConformanceHandler(new GeneratedObservationReader(conflicting), repository)
    .handle(command(conflicting, 1))
  assert.equal(conflictOutcome.status, 'REJECTED')
  if (conflictOutcome.status === 'REJECTED') assert.equal(conflictOutcome.code, 'FINAL_CONFORMANCE_CONFLICT')
  assert.equal(repository.value()?.result, 'CONFORMANT')
})

test('T12 concurrency: equivalent final evaluations have one CAS winner and one exact duplicate', async () => {
  const canonical = bundle(scope(), {}, 'REQUEST-1')
  const repository = new BarrierFinalConformanceRepository()
  const handler = () => new FinalConformanceHandler(new GeneratedObservationReader(canonical), repository)
  const [left, right] = await Promise.all([
    handler().handle(command(canonical)),
    handler().handle(command(canonical)),
  ])

  assert.equal(left.status, 'ACCEPTED')
  assert.equal(right.status, 'ACCEPTED')
  if (left.status === 'ACCEPTED' && right.status === 'ACCEPTED') {
    assert.notEqual(left.duplicate, right.duplicate)
    assert.equal(left.evaluation.result, 'CONFORMANT')
    assert.equal(right.evaluation.result, 'CONFORMANT')
    assert.equal(left.evaluation.scope.equals(right.evaluation.scope), true)
  }
  assert.equal(repository.value()?.revision.value, 1)
})

test('T12 architecture guard keeps the productive evaluator graph inside the DOM domain/application boundary', () => {
  const sourceRoot = resolve(process.cwd(), 'src')
  const domainPath = resolve(sourceRoot, 'domain/final-conformance.ts')
  const applicationPath = resolve(sourceRoot, 'application/final-conformance.ts')
  const graph = new Set<string>()
  const pending = [domainPath, applicationPath]

  while (pending.length > 0) {
    const current = pending.pop()!
    if (graph.has(current)) continue
    assert.equal(current.startsWith(sourceRoot), true)
    assert.equal(existsSync(current), true)
    graph.add(current)
    const source = readFileSync(current, 'utf8')
    const imports = [...source.matchAll(/(?:\bfrom\s*|\bimport\s*)['"](\.[^'"]+)['"]/g)]
      .map((match) => match[1])
    for (const specifier of imports) {
      const normalized = specifier.endsWith('.js') ? specifier.slice(0, -3) : specifier
      pending.push(`${resolve(dirname(current), normalized)}.ts`)
    }
    assert.doesNotMatch(source, /(?:\bfrom\s*|\bimport\s*)['"][^'"]*(?:prototype|tests\/|node:fs|node:path|infrastructure|database|http|git(?:hub)?\s+sdk)/i)
  }

  assert.equal(graph.has(domainPath), true)
  assert.equal(graph.has(applicationPath), true)
  assert.equal(graph.has(resolve(sourceRoot, 'domain/identity.ts')), true)
  assert.equal(graph.has(resolve(sourceRoot, 'domain/publication.ts')), true)
  assert.equal(graph.size, 4)
})
