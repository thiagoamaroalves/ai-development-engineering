import {
  CanonicalIdentityReference,
  CanonicalIdentityReferenceInput,
  CanonicalIdentityReconstructionAuthority,
} from './identity.js'

export type LineageErrorCode =
  | 'INVALID_LINEAGE_ENDPOINT'
  | 'INVALID_LINEAGE_PROGRESS'
  | 'LINEAGE_RECONSTRUCTION_AUTHORITY_REQUIRED'
  | 'LINEAGE_REFERENCE_MISMATCH'
  | 'LINEAGE_ALREADY_EXISTS'
  | 'LINEAGE_NOT_FOUND'
  | 'LINEAGE_CONCURRENT_MODIFICATION'

export class LineageDomainError extends Error {
  readonly code: LineageErrorCode

  constructor(code: LineageErrorCode, message: string) {
    super(message)
    this.name = 'LineageDomainError'
    this.code = code
  }
}

export interface AdrSpecLineageInput {
  readonly adr: CanonicalIdentityReferenceInput
  readonly spec: CanonicalIdentityReferenceInput
}

export class LineageProgress {
  readonly value: number

  private constructor(value: number) {
    this.value = value
    Object.freeze(this)
  }

  static create(value: unknown = 0): LineageProgress {
    if (typeof value !== 'number' || !Number.isInteger(value) || value < 0) {
      throw new LineageDomainError('INVALID_LINEAGE_PROGRESS', 'Lineage progress must be a non-negative integer.')
    }

    return new LineageProgress(value)
  }

  advance(): LineageProgress {
    return new LineageProgress(this.value + 1)
  }

  equals(other: LineageProgress): boolean {
    return this.value === other.value
  }
}

export interface AdrSpecLineageRehydrationInput extends AdrSpecLineageInput {
  readonly progress: LineageProgress | number
}

/**
 * Supplies the accepted relation state used to validate persisted progress.
 * The relation aggregate remains the semantic owner; this is only the
 * authority-backed read boundary for reconstruction.
 */
export interface AdrSpecLineageReconstructionAuthority {
  resolveForRehydration(
    adr: CanonicalIdentityReference,
    spec: CanonicalIdentityReference,
  ): AdrSpecLineage | undefined
}

export class AdrSpecLineage {
  readonly adr: CanonicalIdentityReference
  readonly spec: CanonicalIdentityReference
  readonly progress: LineageProgress

  private constructor(adr: CanonicalIdentityReference, spec: CanonicalIdentityReference, progress: LineageProgress) {
    this.adr = adr
    this.spec = spec
    this.progress = progress
    Object.freeze(this)
  }

  static create(input: AdrSpecLineageInput): AdrSpecLineage {
    const adr = CanonicalIdentityReference.create(input.adr)
    const spec = CanonicalIdentityReference.create(input.spec)
    return AdrSpecLineage.createFromReferences(adr, spec, LineageProgress.create())
  }

  /** Rebuilds a persisted relation through the same invariant-checked seam. */
  static rehydrate(
    input: AdrSpecLineageRehydrationInput,
    identityAuthority: CanonicalIdentityReconstructionAuthority,
    lineageAuthority: AdrSpecLineageReconstructionAuthority,
  ): AdrSpecLineage {
    if (!identityAuthority || typeof identityAuthority.resolveForRehydration !== 'function') {
      throw new LineageDomainError(
        'LINEAGE_RECONSTRUCTION_AUTHORITY_REQUIRED',
        'Lineage rehydration requires the DOM identity reconstruction authority.',
      )
    }
    if (!lineageAuthority || typeof lineageAuthority.resolveForRehydration !== 'function') {
      throw new LineageDomainError(
        'LINEAGE_RECONSTRUCTION_AUTHORITY_REQUIRED',
        'Lineage rehydration requires the accepted relation reconstruction authority.',
      )
    }

    const adrCandidate = CanonicalIdentityReference.create(input.adr)
    const specCandidate = CanonicalIdentityReference.create(input.spec)
    const adrRecord = identityAuthority.resolveForRehydration(adrCandidate)
    const specRecord = identityAuthority.resolveForRehydration(specCandidate)
    if (!adrRecord || !specRecord) {
      throw new LineageDomainError(
        'LINEAGE_REFERENCE_MISMATCH',
        'Lineage endpoints could not be resolved by the authoritative identity records.',
      )
    }

    const adr = adrRecord.reference
    const spec = specRecord.reference
    if (!adr.equals(adrCandidate) || !spec.equals(specCandidate)) {
      throw new LineageDomainError(
        'LINEAGE_REFERENCE_MISMATCH',
        'Lineage endpoints do not match the authoritative identity records.',
      )
    }

    if (adr.identity.kind !== 'ADR' || spec.identity.kind !== 'SPEC') {
      throw new LineageDomainError(
        'INVALID_LINEAGE_ENDPOINT',
        'ADR↔SPEC lineage requires one ADR endpoint and one SPEC endpoint.',
      )
    }

    const accepted = lineageAuthority.resolveForRehydration(adr, spec)
    if (!(accepted instanceof AdrSpecLineage)) {
      throw new LineageDomainError(
        'LINEAGE_NOT_FOUND',
        `ADR↔SPEC lineage ${adr.canonicalKey}->${spec.canonicalKey} could not be resolved for rehydration.`,
      )
    }

    const progress = input.progress instanceof LineageProgress
      ? input.progress
      : LineageProgress.create(input.progress)

    if (!accepted.adr.equals(adr) || !accepted.spec.equals(spec) || !accepted.progress.equals(progress)) {
      throw new LineageDomainError(
        'LINEAGE_REFERENCE_MISMATCH',
        'Lineage progress or endpoints do not match the accepted reconstruction authority.',
      )
    }

    return AdrSpecLineage.createFromReferences(adr, spec, progress)
  }

  private static createFromReferences(
    adr: CanonicalIdentityReference,
    spec: CanonicalIdentityReference,
    progress: LineageProgress,
  ): AdrSpecLineage {
    if (adr.identity.kind !== 'ADR' || spec.identity.kind !== 'SPEC') {
      throw new LineageDomainError('INVALID_LINEAGE_ENDPOINT', 'ADR↔SPEC lineage requires one ADR endpoint and one SPEC endpoint.')
    }

    return new AdrSpecLineage(adr, spec, progress)
  }

  advance(): AdrSpecLineage {
    return AdrSpecLineage.createFromReferences(this.adr, this.spec, this.progress.advance())
  }

  get canonicalKey(): string {
    return `${this.adr.canonicalKey}->${this.spec.canonicalKey}`
  }

  referencesAdr(reference: CanonicalIdentityReference): boolean {
    return this.adr.equals(reference)
  }

  referencesSpec(reference: CanonicalIdentityReference): boolean {
    return this.spec.equals(reference)
  }
}

export interface LineageReservationAccepted {
  readonly status: 'ACCEPTED'
  readonly lineage: AdrSpecLineage
}

export interface LineageReservationDuplicate {
  readonly status: 'DUPLICATE'
  readonly existing: AdrSpecLineage
}

export type LineageReservation = LineageReservationAccepted | LineageReservationDuplicate

export interface LineageAdvanceAccepted {
  readonly status: 'ADVANCED'
  readonly lineage: AdrSpecLineage
}

export interface LineageAdvanceStale {
  readonly status: 'STALE'
  readonly existing: AdrSpecLineage
}

export interface LineageAdvanceMissing {
  readonly status: 'NOT_FOUND'
}

export type LineageAdvanceReservation = LineageAdvanceAccepted | LineageAdvanceStale | LineageAdvanceMissing

export interface AdrSpecLineageRepository {
  reserve(lineage: AdrSpecLineage): Promise<LineageReservation>
  /** Persist only when the stored progress equals expectedProgress. */
  advance(lineage: AdrSpecLineage, expectedProgress: LineageProgress): LineageAdvanceReservation
  find(adr: CanonicalIdentityReference, spec: CanonicalIdentityReference): AdrSpecLineage | undefined
  listByAdr(adr: CanonicalIdentityReference): readonly AdrSpecLineage[]
  listBySpec(spec: CanonicalIdentityReference): readonly AdrSpecLineage[]
}
