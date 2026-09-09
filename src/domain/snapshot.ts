import {
  CanonicalIdentityReference,
  CanonicalIdentityReferenceInput,
} from './identity.js'

export type AdrDecisionStatus = 'ACCEPTED' | 'PROPOSED' | 'REJECTED' | 'SUPERSEDED'
export type SnapshotStatus = 'DRAFT' | 'CONFIRMED'

export type SnapshotErrorCode =
  | 'INVALID_SNAPSHOT_ID'
  | 'INVALID_SNAPSHOT_VALUE'
  | 'INVALID_SNAPSHOT_STATUS'
  | 'INVALID_SNAPSHOT_ENTRY'
  | 'INELIGIBLE_ADR'
  | 'SNAPSHOT_ALREADY_CONFIRMED'
  | 'SNAPSHOT_AUTHORITY_DRIFT'
  | 'SNAPSHOT_ALREADY_EXISTS'
  | 'SNAPSHOT_NOT_FOUND'
  | 'SNAPSHOT_STALE'

export class SnapshotDomainError extends Error {
  readonly code: SnapshotErrorCode

  constructor(code: SnapshotErrorCode, message: string) {
    super(message)
    this.name = 'SnapshotDomainError'
    this.code = code
  }
}

function requiredValue(value: unknown, label: string): string {
  if (typeof value !== 'string') {
    throw new SnapshotDomainError('INVALID_SNAPSHOT_VALUE', `${label} is required.`)
  }

  const normalized = value.trim()
  if (!normalized || /[\r\n]/.test(normalized)) {
    throw new SnapshotDomainError('INVALID_SNAPSHOT_VALUE', `${label} must be a non-empty single-line value.`)
  }

  return normalized
}

export class SnapshotId {
  readonly value: string

  private constructor(value: string) {
    this.value = value
    Object.freeze(this)
  }

  static create(value: unknown): SnapshotId {
    const normalized = requiredValue(value, 'Snapshot identity')
    if (!/^[A-Za-z0-9][A-Za-z0-9._:-]*$/.test(normalized)) {
      throw new SnapshotDomainError('INVALID_SNAPSHOT_ID', 'Snapshot identity must be an explicit stable token.')
    }

    return new SnapshotId(normalized)
  }

  equals(other: SnapshotId): boolean {
    return this.value === other.value
  }
}

export class SnapshotBase {
  readonly value: string

  private constructor(value: string) {
    this.value = value
    Object.freeze(this)
  }

  static create(value: unknown): SnapshotBase {
    return new SnapshotBase(requiredValue(value, 'Snapshot base'))
  }

  equals(other: SnapshotBase): boolean {
    return this.value === other.value
  }
}

export class ConfigurationVersion {
  readonly value: string

  private constructor(value: string) {
    this.value = value
    Object.freeze(this)
  }

  static create(value: unknown): ConfigurationVersion {
    return new ConfigurationVersion(requiredValue(value, 'Configuration version'))
  }

  equals(other: ConfigurationVersion): boolean {
    return this.value === other.value
  }
}

export class AdrContentHash {
  readonly value: string

  private constructor(value: string) {
    this.value = value
    Object.freeze(this)
  }

  static create(value: unknown): AdrContentHash {
    return new AdrContentHash(requiredValue(value, 'ADR content hash'))
  }

  equals(other: AdrContentHash): boolean {
    return this.value === other.value
  }
}

export class ExactVersionSet {
  readonly skill: string
  readonly contract: string

  private constructor(skill: string, contract: string) {
    this.skill = skill
    this.contract = contract
    Object.freeze(this)
  }

  static create(input: { readonly skill: unknown; readonly contract: unknown }): ExactVersionSet {
    return new ExactVersionSet(
      requiredValue(input.skill, 'Exact skill version'),
      requiredValue(input.contract, 'Exact contract version'),
    )
  }

  equals(other: ExactVersionSet): boolean {
    return this.skill === other.skill && this.contract === other.contract
  }
}

export interface AdrSnapshotEntryInput {
  readonly reference: CanonicalIdentityReference | CanonicalIdentityReferenceInput
  readonly decisionStatus: AdrDecisionStatus
  readonly contentHash: AdrContentHash | string
}

export class AdrSnapshotEntry {
  readonly reference: CanonicalIdentityReference
  readonly decisionStatus: AdrDecisionStatus
  readonly contentHash: AdrContentHash

  private constructor(
    reference: CanonicalIdentityReference,
    decisionStatus: AdrDecisionStatus,
    contentHash: AdrContentHash,
  ) {
    this.reference = reference
    this.decisionStatus = decisionStatus
    this.contentHash = contentHash
    Object.freeze(this)
  }

  static create(input: AdrSnapshotEntryInput): AdrSnapshotEntry {
    if (!['ACCEPTED', 'PROPOSED', 'REJECTED', 'SUPERSEDED'].includes(input.decisionStatus)) {
      throw new SnapshotDomainError('INVALID_SNAPSHOT_ENTRY', 'ADR decision status must be known.')
    }

    return new AdrSnapshotEntry(
      input.reference instanceof CanonicalIdentityReference
        ? input.reference
        : CanonicalIdentityReference.create(input.reference),
      input.decisionStatus,
      input.contentHash instanceof AdrContentHash ? input.contentHash : AdrContentHash.create(input.contentHash),
    )
  }
}

interface ExecutionSnapshotBasisInput {
  readonly id: SnapshotId | string
  readonly spec: CanonicalIdentityReference | CanonicalIdentityReferenceInput
  readonly adrs: readonly AdrSnapshotEntryInput[]
  readonly base: SnapshotBase | string
  readonly configuration: ConfigurationVersion | string
  readonly versions: ExactVersionSet
}

export interface ExecutionSnapshotCreationInput extends ExecutionSnapshotBasisInput {}

export interface ExecutionSnapshotRehydrationInput extends ExecutionSnapshotBasisInput {
  readonly status: SnapshotStatus
}

export class AdrEligibilityPolicy {
  static assertEligible(reference: CanonicalIdentityReference, decisionStatus: AdrDecisionStatus): void {
    if (reference.identity.kind !== 'ADR' || decisionStatus !== 'ACCEPTED') {
      throw new SnapshotDomainError(
        'INELIGIBLE_ADR',
        `ADR ${reference.canonicalKey} is not eligible for an execution snapshot.`,
      )
    }
  }

}

interface SnapshotAuthorityBasis {
  readonly spec: CanonicalIdentityReference
  readonly adrs: readonly AdrSnapshotEntry[]
  readonly base: SnapshotBase
  readonly configuration: ConfigurationVersion
  readonly versions: ExactVersionSet
}

export class ExecutionSnapshot {
  readonly id: SnapshotId
  readonly status: SnapshotStatus
  readonly spec: CanonicalIdentityReference
  readonly adrs: readonly AdrSnapshotEntry[]
  readonly base: SnapshotBase
  readonly configuration: ConfigurationVersion
  readonly versions: ExactVersionSet

  private constructor(id: SnapshotId, status: SnapshotStatus, basis: SnapshotAuthorityBasis) {
    this.id = id
    this.status = status
    this.spec = basis.spec
    this.adrs = basis.adrs
    this.base = basis.base
    this.configuration = basis.configuration
    this.versions = basis.versions
    Object.freeze(this)
  }

  static create(input: ExecutionSnapshotCreationInput): ExecutionSnapshot {
    return ExecutionSnapshot.construct(input, 'DRAFT')
  }

  static rehydrate(input: ExecutionSnapshotRehydrationInput): ExecutionSnapshot {
    return ExecutionSnapshot.construct(input, input.status)
  }

  private static construct(input: ExecutionSnapshotBasisInput, status: SnapshotStatus): ExecutionSnapshot {
    const id = input.id instanceof SnapshotId ? input.id : SnapshotId.create(input.id)
    const spec = input.spec instanceof CanonicalIdentityReference
      ? input.spec
      : CanonicalIdentityReference.create(input.spec)
    if (spec.identity.kind !== 'SPEC') {
      throw new SnapshotDomainError('INVALID_SNAPSHOT_ENTRY', 'An execution snapshot requires a SPEC endpoint.')
    }

    if (!Array.isArray(input.adrs) || input.adrs.length === 0) {
      throw new SnapshotDomainError('INVALID_SNAPSHOT_ENTRY', 'An execution snapshot requires at least one ADR.')
    }

    const adrs = input.adrs.map((entry) => AdrSnapshotEntry.create(entry))
    adrs.forEach((entry) => AdrEligibilityPolicy.assertEligible(entry.reference, entry.decisionStatus))

    const uniqueReferences = new Set(adrs.map((entry) => entry.reference.canonicalKey))
    if (uniqueReferences.size !== adrs.length) {
      throw new SnapshotDomainError('INVALID_SNAPSHOT_ENTRY', 'An execution snapshot cannot repeat an ADR revision.')
    }

    const normalizedStatus = status
    if (normalizedStatus !== 'DRAFT' && normalizedStatus !== 'CONFIRMED') {
      throw new SnapshotDomainError('INVALID_SNAPSHOT_STATUS', 'Snapshot status must be DRAFT or CONFIRMED.')
    }

    const basis: SnapshotAuthorityBasis = Object.freeze({
      spec,
      adrs: Object.freeze(adrs),
      base: input.base instanceof SnapshotBase ? input.base : SnapshotBase.create(input.base),
      configuration: input.configuration instanceof ConfigurationVersion
        ? input.configuration
        : ConfigurationVersion.create(input.configuration),
      versions: input.versions,
    })

    if (!(basis.versions instanceof ExactVersionSet)) {
      throw new SnapshotDomainError('INVALID_SNAPSHOT_VALUE', 'Exact version metadata is required.')
    }

    return new ExecutionSnapshot(id, normalizedStatus, basis)
  }

  confirm(basis: {
    readonly spec: CanonicalIdentityReference
    readonly adrs: readonly AdrSnapshotEntry[]
    readonly base: SnapshotBase
    readonly configuration: ConfigurationVersion
    readonly versions: ExactVersionSet
  }): ExecutionSnapshot {
    if (this.status === 'CONFIRMED') {
      throw new SnapshotDomainError('SNAPSHOT_ALREADY_CONFIRMED', `Snapshot ${this.id.value} is already confirmed.`)
    }

    if (!this.hasSameAuthorityBasis(basis)) {
      throw new SnapshotDomainError('SNAPSHOT_AUTHORITY_DRIFT', `Snapshot ${this.id.value} authority basis has drifted.`)
    }

    return new ExecutionSnapshot(this.id, 'CONFIRMED', {
      spec: this.spec,
      adrs: this.adrs,
      base: this.base,
      configuration: this.configuration,
      versions: this.versions,
    })
  }

  hasSameAuthorityBasis(other: {
    readonly spec: CanonicalIdentityReference
    readonly adrs: readonly AdrSnapshotEntry[]
    readonly base: SnapshotBase
    readonly configuration: ConfigurationVersion
    readonly versions: ExactVersionSet
  }): boolean {
    return this.spec.equals(other.spec)
      && this.base.equals(other.base)
      && this.configuration.equals(other.configuration)
      && this.versions.equals(other.versions)
      && this.adrs.length === other.adrs.length
      && this.adrs.every((entry, index) => {
        const candidate = other.adrs[index]
        return candidate !== undefined
          && entry.reference.equals(candidate.reference)
          && entry.decisionStatus === candidate.decisionStatus
          && entry.contentHash.equals(candidate.contentHash)
      })
  }
}

export interface SnapshotReservationAccepted {
  readonly status: 'ACCEPTED'
  readonly snapshot: ExecutionSnapshot
}

export interface SnapshotReservationDuplicate {
  readonly status: 'DUPLICATE'
  readonly existing: ExecutionSnapshot
}

export type SnapshotReservation = SnapshotReservationAccepted | SnapshotReservationDuplicate

export interface SnapshotConfirmationAdvanced {
  readonly status: 'CONFIRMED'
  readonly snapshot: ExecutionSnapshot
}

export interface SnapshotConfirmationStale {
  readonly status: 'STALE'
  readonly existing: ExecutionSnapshot
}

export interface SnapshotConfirmationNotFound {
  readonly status: 'NOT_FOUND'
}

export type SnapshotConfirmation =
  | SnapshotConfirmationAdvanced
  | SnapshotConfirmationStale
  | SnapshotConfirmationNotFound

export interface ExecutionSnapshotRepository {
  reserve(snapshot: ExecutionSnapshot): Promise<SnapshotReservation>
  confirm(snapshot: ExecutionSnapshot): Promise<SnapshotConfirmation>
  find(id: SnapshotId): ExecutionSnapshot | undefined
}
