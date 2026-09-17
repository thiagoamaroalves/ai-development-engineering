import {
  CandidateBasis,
  CandidateBasisInput,
} from './publication.js'

export type CandidateEvidenceGateState = 'PENDING' | 'AUTHORIZED' | 'INVALIDATED'
export type CandidateEvidenceErrorCode =
  | 'INVALID_CANDIDATE_EVIDENCE'
  | 'CANDIDATE_DRIFT'
  | 'CANDIDATE_STALE'
  | 'CANDIDATE_NOT_FOUND'
  | 'CANDIDATE_CONFLICT'
  | 'CANDIDATE_RECONSTRUCTION_AUTHORITY_REQUIRED'

export class CandidateEvidenceDomainError extends Error {
  readonly code: CandidateEvidenceErrorCode

  constructor(code: CandidateEvidenceErrorCode, message: string) {
    super(message)
    this.name = 'CandidateEvidenceDomainError'
    this.code = code
  }
}

function token(value: unknown, label: string): string {
  if (typeof value !== 'string' || !value.trim() || /[\r\n]/.test(value)) {
    throw new CandidateEvidenceDomainError('INVALID_CANDIDATE_EVIDENCE', `${label} must be a non-empty single-line value.`)
  }
  return value.trim()
}

export class CandidateEvidenceId {
  readonly value: string

  private constructor(value: string) {
    this.value = value
    Object.freeze(this)
  }

  static create(value: unknown): CandidateEvidenceId {
    return new CandidateEvidenceId(token(value, 'Evidence ID'))
  }

  equals(other: CandidateEvidenceId): boolean {
    return this.value === other.value
  }
}

export class EvidenceHash {
  readonly value: string

  private constructor(value: string) {
    this.value = value
    Object.freeze(this)
  }

  static create(value: unknown): EvidenceHash {
    return new EvidenceHash(token(value, 'Evidence hash'))
  }

  equals(other: EvidenceHash): boolean {
    return this.value === other.value
  }
}

export class CandidateObservationId {
  readonly value: string

  private constructor(value: string) {
    this.value = value
    Object.freeze(this)
  }

  static create(value: unknown): CandidateObservationId {
    return new CandidateObservationId(token(value, 'Candidate observation ID'))
  }

  equals(other: CandidateObservationId): boolean {
    return this.value === other.value
  }
}

export class CandidateEvidenceRevision {
  readonly value: number

  private constructor(value: number) {
    this.value = value
    Object.freeze(this)
  }

  static create(value: unknown = 0): CandidateEvidenceRevision {
    if (typeof value !== 'number' || !Number.isInteger(value) || value < 0) {
      throw new CandidateEvidenceDomainError('INVALID_CANDIDATE_EVIDENCE', 'Candidate evidence revision must be a non-negative integer.')
    }
    return new CandidateEvidenceRevision(value)
  }

  next(): CandidateEvidenceRevision {
    return new CandidateEvidenceRevision(this.value + 1)
  }

  equals(other: CandidateEvidenceRevision): boolean {
    return this.value === other.value
  }
}

export interface CandidateEvidenceObservationInput {
  readonly basis: CandidateBasisInput | CandidateBasis
  readonly evidenceId: string | CandidateEvidenceId
  readonly evidenceHash: string | EvidenceHash
  readonly observationId: string | CandidateObservationId
}

export class CandidateEvidenceObservation {
  readonly basis: CandidateBasis
  readonly evidenceId: CandidateEvidenceId
  readonly evidenceHash: EvidenceHash
  readonly observationId: CandidateObservationId

  private constructor(input: {
    readonly basis: CandidateBasis
    readonly evidenceId: CandidateEvidenceId
    readonly evidenceHash: EvidenceHash
    readonly observationId: CandidateObservationId
  }) {
    this.basis = input.basis
    this.evidenceId = input.evidenceId
    this.evidenceHash = input.evidenceHash
    this.observationId = input.observationId
    Object.freeze(this)
  }

  static create(input: CandidateEvidenceObservationInput): CandidateEvidenceObservation {
    const basis = input.basis instanceof CandidateBasis ? input.basis : CandidateBasis.create(input.basis)
    const evidenceId = input.evidenceId instanceof CandidateEvidenceId ? input.evidenceId : CandidateEvidenceId.create(input.evidenceId)
    const evidenceHash = input.evidenceHash instanceof EvidenceHash ? input.evidenceHash : EvidenceHash.create(input.evidenceHash)
    const observationId = input.observationId instanceof CandidateObservationId ? input.observationId : CandidateObservationId.create(input.observationId)
    return new CandidateEvidenceObservation({ basis, evidenceId, evidenceHash, observationId })
  }

  exactEvidenceEquals(other: CandidateEvidenceObservation): boolean {
    return this.basis.equals(other.basis)
      && this.evidenceId.equals(other.evidenceId)
      && this.evidenceHash.equals(other.evidenceHash)
  }

  exactEquals(other: CandidateEvidenceObservation): boolean {
    return this.exactEvidenceEquals(other) && this.observationId.equals(other.observationId)
  }
}

export interface CandidateEvidenceGateInput {
  readonly firstObservation: CandidateEvidenceObservationInput | CandidateEvidenceObservation
  readonly secondObservation: CandidateEvidenceObservationInput | CandidateEvidenceObservation
  readonly state: CandidateEvidenceGateState
  readonly revision?: number | CandidateEvidenceRevision
  readonly invalidationReason?: string
}

export class CandidateEvidenceGate {
  readonly firstObservation: CandidateEvidenceObservation
  readonly secondObservation: CandidateEvidenceObservation
  readonly state: CandidateEvidenceGateState
  readonly revision: CandidateEvidenceRevision
  readonly invalidationReason?: string

  private constructor(input: {
    readonly firstObservation: CandidateEvidenceObservation
    readonly secondObservation: CandidateEvidenceObservation
    readonly state: CandidateEvidenceGateState
    readonly revision: CandidateEvidenceRevision
    readonly invalidationReason?: string
  }) {
    this.firstObservation = input.firstObservation
    this.secondObservation = input.secondObservation
    this.state = input.state
    this.revision = input.revision
    this.invalidationReason = input.invalidationReason
    Object.freeze(this)
  }

  static authorize(
    first: CandidateEvidenceObservation,
    second: CandidateEvidenceObservation,
    revision: CandidateEvidenceRevision | number = 0,
  ): CandidateEvidenceGate {
    CandidateEvidenceGate.assertIndependentMatch(first, second)
    return new CandidateEvidenceGate({
      firstObservation: first,
      secondObservation: second,
      state: 'AUTHORIZED',
      revision: revision instanceof CandidateEvidenceRevision ? revision.next() : CandidateEvidenceRevision.create(revision).next(),
    })
  }

  static invalidate(
    first: CandidateEvidenceObservation,
    second: CandidateEvidenceObservation,
    revision: CandidateEvidenceRevision | number = 0,
    reason = 'Candidate or evidence drift was detected before authorization.',
  ): CandidateEvidenceGate {
    if (first.observationId.equals(second.observationId)) {
      throw new CandidateEvidenceDomainError('CANDIDATE_DRIFT', 'Candidate evidence requires two independent observations.')
    }
    return new CandidateEvidenceGate({
      firstObservation: first,
      secondObservation: second,
      state: 'INVALIDATED',
      revision: revision instanceof CandidateEvidenceRevision ? revision.next() : CandidateEvidenceRevision.create(revision).next(),
      invalidationReason: token(reason, 'Invalidation reason'),
    })
  }

  static rehydrate(input: CandidateEvidenceGateInput, authority: CandidateEvidenceReconstructionAuthority): CandidateEvidenceGate {
    if (!authority || typeof authority.resolveForRehydration !== 'function') {
      throw new CandidateEvidenceDomainError('CANDIDATE_RECONSTRUCTION_AUTHORITY_REQUIRED', 'Candidate evidence rehydration requires accepted evidence authority.')
    }
    const firstObservation = input.firstObservation instanceof CandidateEvidenceObservation
      ? input.firstObservation
      : CandidateEvidenceObservation.create(input.firstObservation)
    const secondObservation = input.secondObservation instanceof CandidateEvidenceObservation
      ? input.secondObservation
      : CandidateEvidenceObservation.create(input.secondObservation)
    const revision = input.revision instanceof CandidateEvidenceRevision
      ? input.revision
      : CandidateEvidenceRevision.create(input.revision)
    if (input.state === 'AUTHORIZED' && input.invalidationReason !== undefined) {
      throw new CandidateEvidenceDomainError('CANDIDATE_DRIFT', 'An authorized candidate evidence gate cannot carry an invalidation reason.')
    }
    if (input.state === 'INVALIDATED' && input.invalidationReason === undefined) {
      throw new CandidateEvidenceDomainError('CANDIDATE_DRIFT', 'An invalidated candidate evidence gate requires its reason.')
    }
    const accepted = authority.resolveForRehydration(firstObservation.basis.candidateId)
    if (!accepted
      || accepted.state !== input.state
      || !accepted.firstObservation.exactEquals(firstObservation)
      || !accepted.secondObservation.exactEquals(secondObservation)
      || !accepted.revision.equals(revision)
      || accepted.invalidationReason !== input.invalidationReason) {
      throw new CandidateEvidenceDomainError('CANDIDATE_RECONSTRUCTION_AUTHORITY_REQUIRED', 'Candidate evidence material does not match accepted authority.')
    }
    if (input.state === 'AUTHORIZED') CandidateEvidenceGate.assertIndependentMatch(firstObservation, secondObservation)
    return new CandidateEvidenceGate({
      firstObservation,
      secondObservation,
      state: input.state,
      revision,
      invalidationReason: input.invalidationReason,
    })
  }

  static assertIndependentMatch(first: CandidateEvidenceObservation, second: CandidateEvidenceObservation): void {
    if (first.observationId.equals(second.observationId)) {
      throw new CandidateEvidenceDomainError('CANDIDATE_DRIFT', 'Candidate evidence requires an independent second observation.')
    }
    if (!first.exactEvidenceEquals(second)) {
      throw new CandidateEvidenceDomainError('CANDIDATE_DRIFT', 'Candidate basis or hash-linked evidence changed before authorization.')
    }
  }

  get candidateId(): string {
    return this.firstObservation.basis.candidateId
  }

  get idempotencyKey(): string {
    return `${this.candidateId}|evidence=${this.firstObservation.evidenceId.value}|hash=${this.firstObservation.evidenceHash.value}|revision=${this.revision.value}`
  }

  exactEquals(other: CandidateEvidenceGate): boolean {
    return this.state === other.state
      && this.revision.equals(other.revision)
      && this.firstObservation.exactEquals(other.firstObservation)
      && this.secondObservation.exactEquals(other.secondObservation)
      && this.invalidationReason === other.invalidationReason
  }
}

export interface CandidateEvidenceReader {
  observe(candidateId: string): CandidateEvidenceObservation | undefined
}

export interface CandidateEvidenceReconstructionAuthority {
  resolveForRehydration(candidateId: string): CandidateEvidenceGate | undefined
}

export interface CandidateEvidenceRepository {
  find(candidateId: string): CandidateEvidenceGate | undefined
  commit(
    gate: CandidateEvidenceGate,
    expectedRevision: CandidateEvidenceRevision,
  ): Promise<
    | { readonly status: 'ADVANCED'; readonly gate: CandidateEvidenceGate }
    | { readonly status: 'STALE'; readonly existing?: CandidateEvidenceGate }
    | { readonly status: 'DUPLICATE'; readonly existing: CandidateEvidenceGate }
  >
}
