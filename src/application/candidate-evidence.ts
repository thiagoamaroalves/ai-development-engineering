import {
  CandidateBasis,
  CandidateBasisInput,
} from '../domain/publication.js'
import {
  CandidateEvidenceGate,
  CandidateEvidenceObservation,
  CandidateEvidenceObservationInput,
  CandidateEvidenceRepository,
  CandidateEvidenceReader,
  CandidateEvidenceDomainError,
  CandidateEvidenceRevision,
} from '../domain/candidate-evidence.js'

export interface GitCandidateEvidence {
  readonly candidateId: string
  readonly baseSha: string
  readonly headSha: string
  readonly treeHash: string
  readonly conformanceRunId: string
  readonly evidenceId: string
  readonly evidenceHash: string
  readonly observationId: string
}

export class GitCandidateEvidenceMapper {
  map(evidence: GitCandidateEvidence): CandidateEvidenceObservation {
    return CandidateEvidenceObservation.create({
      basis: {
        candidateId: evidence.candidateId,
        baseSha: evidence.baseSha,
        headSha: evidence.headSha,
        treeHash: evidence.treeHash,
        conformanceRunId: evidence.conformanceRunId,
      },
      evidenceId: evidence.evidenceId,
      evidenceHash: evidence.evidenceHash,
      observationId: evidence.observationId,
    })
  }
}

export interface CandidateEvidenceCommand {
  readonly candidateId: string
  readonly basis: CandidateBasisInput | CandidateBasis
  readonly expectedRevision: number
}

export type CandidateEvidenceOutcome =
  | { readonly status: 'ACCEPTED'; readonly gate: CandidateEvidenceGate; readonly duplicate: boolean }
  | { readonly status: 'REJECTED'; readonly reason: string; readonly code: string }

export class CandidateEvidenceGateHandler {
  constructor(
    private readonly evidence: CandidateEvidenceReader,
    private readonly gates: CandidateEvidenceRepository,
    private readonly mapper: GitCandidateEvidenceMapper = new GitCandidateEvidenceMapper(),
  ) {}

  private reject(error: CandidateEvidenceDomainError): CandidateEvidenceOutcome {
    return { status: 'REJECTED', reason: error.message, code: error.code }
  }

  async authorize(command: CandidateEvidenceCommand): Promise<CandidateEvidenceOutcome> {
    try {
      const requestedBasis = command.basis instanceof CandidateBasis ? command.basis : CandidateBasis.create(command.basis)
      if (requestedBasis.candidateId !== command.candidateId) {
        throw new CandidateEvidenceDomainError('CANDIDATE_CONFLICT', 'Candidate command identity does not match its basis.')
      }
      const existing = this.gates.find(command.candidateId)
      const expectedRevision = CandidateEvidenceRevision.create(command.expectedRevision)
      if (existing && !existing.revision.equals(expectedRevision)) {
        throw new CandidateEvidenceDomainError('CANDIDATE_STALE', 'Candidate evidence command has a stale gate revision.')
      }

      const first = this.evidence.observe(command.candidateId)
      if (!first || !first.basis.equals(requestedBasis)) {
        throw new CandidateEvidenceDomainError('CANDIDATE_DRIFT', 'Initial candidate evidence does not match the requested exact basis.')
      }
      const second = this.evidence.observe(command.candidateId)
      if (!second) {
        throw new CandidateEvidenceDomainError('CANDIDATE_DRIFT', 'Independent candidate evidence observation was not available.')
      }
      if (first.observationId.equals(second.observationId)) {
        throw new CandidateEvidenceDomainError('CANDIDATE_DRIFT', 'Candidate evidence requires an independent second observation.')
      }
      CandidateEvidenceGate.assertIndependentMatch(first, second)

      if (existing) {
        if (existing.state !== 'AUTHORIZED'
          || !existing.firstObservation.exactEvidenceEquals(first)
          || !existing.secondObservation.exactEvidenceEquals(second)) {
          throw new CandidateEvidenceDomainError('CANDIDATE_CONFLICT', 'Candidate evidence was already authorized with different semantics.')
        }
        return { status: 'ACCEPTED', gate: existing, duplicate: true }
      }

      const proposed = CandidateEvidenceGate.authorize(first, second, expectedRevision)
      const result = await this.gates.commit(proposed, expectedRevision)
      if (result.status === 'STALE') {
        throw new CandidateEvidenceDomainError('CANDIDATE_STALE', 'Candidate evidence gate has a stale revision.')
      }
      if (result.status === 'DUPLICATE') {
        if (!result.existing.exactEquals(proposed)) {
          throw new CandidateEvidenceDomainError('CANDIDATE_CONFLICT', 'Candidate evidence was concurrently authorized with different semantics.')
        }
        return { status: 'ACCEPTED', gate: result.existing, duplicate: true }
      }
      return { status: 'ACCEPTED', gate: result.gate, duplicate: false }
    } catch (error) {
      return this.reject(error instanceof CandidateEvidenceDomainError
        ? error
        : new CandidateEvidenceDomainError('INVALID_CANDIDATE_EVIDENCE', error instanceof Error ? error.message : 'Candidate evidence was rejected.'))
    }
  }

  mapGitEvidence(evidence: GitCandidateEvidence): CandidateEvidenceObservationInput {
    const observation = this.mapper.map(evidence)
    return Object.freeze({
      basis: observation.basis,
      evidenceId: observation.evidenceId,
      evidenceHash: observation.evidenceHash,
      observationId: observation.observationId,
    })
  }
}
