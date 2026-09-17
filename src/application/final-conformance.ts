import {
  FinalConformanceDomainError,
  FinalConformanceEvidenceBundle,
  FinalConformanceEvidenceBundleInput,
  FinalConformanceEvidenceReader,
  FinalConformanceEvaluation,
  FinalConformanceRepository,
  FinalConformanceRevision,
} from '../domain/final-conformance.js'

export interface FinalConformanceCommand {
  readonly evidence: FinalConformanceEvidenceBundleInput | FinalConformanceEvidenceBundle
  readonly expectedRevision: number
}

export type FinalConformanceOutcome =
  | {
      readonly status: 'ACCEPTED'
      readonly evaluation: FinalConformanceEvaluation
      readonly duplicate: boolean
    }
  | {
      readonly status: 'REJECTED'
      readonly reason: string
      readonly code: string
    }

export class FinalConformanceHandler {
  constructor(
    private readonly authority: FinalConformanceEvidenceReader,
    private readonly evaluations: FinalConformanceRepository,
  ) {}

  private reject(error: FinalConformanceDomainError): FinalConformanceOutcome {
    return { status: 'REJECTED', reason: error.message, code: error.code }
  }

  async handle(command: FinalConformanceCommand): Promise<FinalConformanceOutcome> {
    try {
      const requested = FinalConformanceEvidenceBundle.create(command.evidence)
      const expectedRevision = FinalConformanceRevision.create(command.expectedRevision)
      const existing = this.evaluations.find(requested.scope.cycleIdentity)

      if (existing && !existing.revision.equals(expectedRevision)) {
        throw new FinalConformanceDomainError(
          'FINAL_CONFORMANCE_STALE',
          'Final conformance command has a stale evaluation revision.',
        )
      }

      const firstRaw = this.authority.observe(requested.scope)
      if (!firstRaw) {
        throw new FinalConformanceDomainError(
          'FINAL_CONFORMANCE_NOT_FOUND',
          `Evidence for ${requested.scope.canonicalKey} was not found.`,
        )
      }
      const first = FinalConformanceEvidenceBundle.create(firstRaw)
      if (!first.scope.equals(requested.scope) || !first.exactEvidenceEquals(requested)) {
        throw new FinalConformanceDomainError(
          'FINAL_CONFORMANCE_EVIDENCE_DRIFT',
          'Requested final conformance evidence does not match canonical authority.',
        )
      }

      const secondRaw = this.authority.observe(requested.scope)
      if (!secondRaw) {
        throw new FinalConformanceDomainError(
          'FINAL_CONFORMANCE_EVIDENCE_DRIFT',
          'Independent final conformance evidence observation was not available.',
        )
      }
      const second = FinalConformanceEvidenceBundle.create(secondRaw)
      if (first.observationId === second.observationId || !first.exactEvidenceEquals(second)) {
        throw new FinalConformanceDomainError(
          'FINAL_CONFORMANCE_EVIDENCE_DRIFT',
          'Final conformance evidence changed before evaluation commit.',
        )
      }

      if (existing) {
        if (!existing.sameEvidence(second)) {
          throw new FinalConformanceDomainError(
            'FINAL_CONFORMANCE_CONFLICT',
            'An evaluation already exists for this cycle with different evidence.',
          )
        }
        return { status: 'ACCEPTED', evaluation: existing, duplicate: true }
      }

      const proposed = FinalConformanceEvaluation.evaluate(second, expectedRevision)
      const saved = await this.evaluations.commit(proposed, expectedRevision)
      if (saved.status === 'STALE') {
        throw new FinalConformanceDomainError(
          'FINAL_CONFORMANCE_STALE',
          'Final conformance evaluation has a stale revision.',
        )
      }
      if (saved.status === 'DUPLICATE') {
        if (!saved.existing.sameEvidence(second)) {
          throw new FinalConformanceDomainError(
            'FINAL_CONFORMANCE_CONFLICT',
            'Final conformance was concurrently evaluated with different evidence.',
          )
        }
        return { status: 'ACCEPTED', evaluation: saved.existing, duplicate: true }
      }

      return { status: 'ACCEPTED', evaluation: saved.evaluation, duplicate: false }
    } catch (error) {
      return this.reject(error instanceof FinalConformanceDomainError
        ? error
        : new FinalConformanceDomainError(
          'INVALID_FINAL_CONFORMANCE_EVIDENCE',
          error instanceof Error ? error.message : 'Final conformance evidence was rejected.',
        ))
    }
  }
}
