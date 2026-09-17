import {
  CanonicalIdentityReference,
  CanonicalIdentityReferenceInput,
  Revision,
} from './identity.js'

export const ADR_DECISION_STATUSES = Object.freeze([
  'PROPOSED',
  'ACCEPTED',
  'SUPERSEDED',
  'REJECTED',
] as const)

export const ADR_REALIZATION_STATUSES = Object.freeze([
  'UNPROCESSED',
  'PROCESSING',
  'IMPLEMENTED',
] as const)

export type AdrDecisionStatusName = (typeof ADR_DECISION_STATUSES)[number]
export type AdrRealizationStatusName = (typeof ADR_REALIZATION_STATUSES)[number]

export type AdrErrorCode =
  | 'INVALID_ADR_IDENTITY'
  | 'INVALID_ADR_CONTENT_HASH'
  | 'INVALID_ADR_DECISION_STATUS'
  | 'INVALID_ADR_REALIZATION_STATUS'
  | 'INVALID_ADR_ELIGIBILITY'
  | 'INVALID_ADR_DECISION_TRANSITION'
  | 'INVALID_ADR_REALIZATION_TRANSITION'
  | 'ADR_REMEDIATION_NOT_ALLOWED'
  | 'ADR_SUCCESSION_INVALID'
  | 'IMPLEMENTED_ADR_IMMUTABLE'
  | 'ADR_CONTENT_REQUIRES_SUCCESSOR'
  | 'ADR_AUTHORITY_NOT_FOUND'
  | 'ADR_AUTHORITY_DRIFT'
  | 'ADR_REHYDRATION_MISMATCH'
  | 'ADR_REVISION_ALREADY_EXISTS'
  | 'ADR_REVISION_NOT_FOUND'

export class AdrDomainError extends Error {
  readonly code: AdrErrorCode

  constructor(code: AdrErrorCode, message: string) {
    super(message)
    this.name = 'AdrDomainError'
    this.code = code
  }
}

export class AdrContentHash {
  readonly value: string

  private constructor(value: string) {
    this.value = value
    Object.freeze(this)
  }

  static create(value: unknown): AdrContentHash {
    if (typeof value !== 'string' || !value.trim() || /[\r\n]/.test(value)) {
      throw new AdrDomainError('INVALID_ADR_CONTENT_HASH', 'ADR content hash is required.')
    }

    return new AdrContentHash(value.trim())
  }

  equals(other: AdrContentHash): boolean {
    return this.value === other.value
  }
}

export class AdrDecisionStatus {
  readonly value: AdrDecisionStatusName

  private constructor(value: AdrDecisionStatusName) {
    this.value = value
    Object.freeze(this)
  }

  static create(value: unknown): AdrDecisionStatus {
    if (typeof value === 'string' && (ADR_DECISION_STATUSES as readonly string[]).includes(value)) {
      return new AdrDecisionStatus(value as AdrDecisionStatusName)
    }

    throw new AdrDomainError('INVALID_ADR_DECISION_STATUS', 'ADR decision status must be known.')
  }

  equals(other: AdrDecisionStatus): boolean {
    return this.value === other.value
  }
}

export class AdrRealizationStatus {
  readonly value: AdrRealizationStatusName

  private constructor(value: AdrRealizationStatusName) {
    this.value = value
    Object.freeze(this)
  }

  static create(value: unknown): AdrRealizationStatus {
    if (typeof value === 'string' && (ADR_REALIZATION_STATUSES as readonly string[]).includes(value)) {
      return new AdrRealizationStatus(value as AdrRealizationStatusName)
    }

    throw new AdrDomainError('INVALID_ADR_REALIZATION_STATUS', 'ADR realization status must be known.')
  }

  equals(other: AdrRealizationStatus): boolean {
    return this.value === other.value
  }
}

export class DerivedEligibility {
  readonly status: 'ELIGIBLE' | 'INVALIDATED'
  readonly reason?: string

  private constructor(status: 'ELIGIBLE' | 'INVALIDATED', reason?: string) {
    this.status = status
    this.reason = reason
    Object.freeze(this)
  }

  static eligible(): DerivedEligibility {
    return new DerivedEligibility('ELIGIBLE')
  }

  static invalidated(reason: string): DerivedEligibility {
    if (typeof reason !== 'string' || !reason.trim()) {
      throw new AdrDomainError('ADR_REMEDIATION_NOT_ALLOWED', 'Eligibility invalidation requires a reason.')
    }
    return new DerivedEligibility('INVALIDATED', reason.trim())
  }

  static from(input: DerivedEligibility): DerivedEligibility {
    if (!input || typeof input.status !== 'string') {
      throw new AdrDomainError('INVALID_ADR_ELIGIBILITY', 'ADR derived eligibility must be a known value.')
    }

    if (input.status === 'ELIGIBLE') {
      if (input.reason !== undefined) {
        throw new AdrDomainError('INVALID_ADR_ELIGIBILITY', 'Eligible ADRs cannot carry an invalidation reason.')
      }
      return DerivedEligibility.eligible()
    }

    if (input.status === 'INVALIDATED' && typeof input.reason === 'string' && input.reason.trim()) {
      return DerivedEligibility.invalidated(input.reason)
    }

    throw new AdrDomainError('INVALID_ADR_ELIGIBILITY', 'Invalidated ADRs require a reason.')
  }
}

export interface AdrOperationalRecordInput {
  readonly implementationCommitSha: string
  readonly implementedAt: string
  readonly evidenceReference: string
}

export class AdrOperationalRecord {
  readonly implementationCommitSha: string
  readonly implementedAt: string
  readonly evidenceReference: string

  private constructor(input: AdrOperationalRecordInput) {
    this.implementationCommitSha = input.implementationCommitSha
    this.implementedAt = input.implementedAt
    this.evidenceReference = input.evidenceReference
    Object.freeze(this)
  }

  static create(input: AdrOperationalRecordInput): AdrOperationalRecord {
    if (!input) {
      throw new AdrDomainError('INVALID_ADR_REALIZATION_STATUS', 'An operational record is required.')
    }
    for (const [label, value] of Object.entries(input)) {
      if (typeof value !== 'string' || !value.trim() || /[\r\n]/.test(value)) {
        throw new AdrDomainError('INVALID_ADR_CONTENT_HASH', `${label} is required for an operational record.`)
      }
    }

    return new AdrOperationalRecord({
      implementationCommitSha: input.implementationCommitSha.trim(),
      implementedAt: input.implementedAt.trim(),
      evidenceReference: input.evidenceReference.trim(),
    })
  }

  static from(input: AdrOperationalRecord): AdrOperationalRecord {
    if (!input) {
      throw new AdrDomainError('INVALID_ADR_REALIZATION_STATUS', 'An operational record is required.')
    }

    return AdrOperationalRecord.create({
      implementationCommitSha: input.implementationCommitSha,
      implementedAt: input.implementedAt,
      evidenceReference: input.evidenceReference,
    })
  }
}

export interface AdrRecordInput {
  readonly reference: CanonicalIdentityReferenceInput | CanonicalIdentityReference
  readonly contentHash: AdrContentHash | string
  readonly decisionStatus: AdrDecisionStatus | AdrDecisionStatusName
  readonly realizationStatus: AdrRealizationStatus | AdrRealizationStatusName
  readonly derivedEligibility: DerivedEligibility
  readonly operationalRecord?: AdrOperationalRecord
  readonly supersedes?: CanonicalIdentityReferenceInput | CanonicalIdentityReference
  readonly supersededBy?: CanonicalIdentityReferenceInput | CanonicalIdentityReference
}

/**
 * The semantic authority used when persisted ADR material re-enters DOM.
 * The authority resolves the exact ADR record and validates its complete
 * reciprocal history before the aggregate is materialized.
 */
export interface AdrRecordReconstructionAuthority {
  resolveAdrForRehydration(reference: CanonicalIdentityReference): AdrRecord
}

function referenceOf(input: CanonicalIdentityReferenceInput | CanonicalIdentityReference): CanonicalIdentityReference {
  const reference = input instanceof CanonicalIdentityReference
    ? input
    : CanonicalIdentityReference.create(input)
  return CanonicalIdentityReference.create({
    identity: {
      kind: reference.identity.kind,
      scope: reference.identity.scope.value,
      value: reference.identity.value,
    },
    revision: reference.revision.value,
  })
}

function decisionOf(input: AdrDecisionStatus | AdrDecisionStatusName): AdrDecisionStatus {
  return AdrDecisionStatus.create(input instanceof AdrDecisionStatus ? input.value : input)
}

function realizationOf(input: AdrRealizationStatus | AdrRealizationStatusName): AdrRealizationStatus {
  return AdrRealizationStatus.create(input instanceof AdrRealizationStatus ? input.value : input)
}

export class AdrSuccession {
  readonly predecessor: CanonicalIdentityReference
  readonly successor: CanonicalIdentityReference

  private constructor(predecessor: CanonicalIdentityReference, successor: CanonicalIdentityReference) {
    this.predecessor = predecessor
    this.successor = successor
    Object.freeze(this)
  }

  static create(predecessorInput: CanonicalIdentityReferenceInput | CanonicalIdentityReference, successorInput: CanonicalIdentityReferenceInput | CanonicalIdentityReference): AdrSuccession {
    const predecessor = referenceOf(predecessorInput)
    const successor = referenceOf(successorInput)
    if (predecessor.identity.kind !== 'ADR'
      || successor.identity.kind !== 'ADR'
      || !predecessor.identity.equals(successor.identity)
      || successor.revision.value !== predecessor.revision.value + 1) {
      throw new AdrDomainError(
        'ADR_SUCCESSION_INVALID',
        'ADR succession requires the same canonical identity and an immediate successor revision.',
      )
    }

    return new AdrSuccession(predecessor, successor)
  }

  /**
   * An implemented ADR is immutable and therefore cannot receive a revision
   * under its existing identity. Its normative replacement is a distinct ADR
   * identity, always admitted at revision one, while the relation remains
   * reciprocal and explicit.
   */
  static createImplementedReplacement(
    predecessorInput: CanonicalIdentityReferenceInput | CanonicalIdentityReference,
    successorInput: CanonicalIdentityReferenceInput | CanonicalIdentityReference,
  ): AdrSuccession {
    const predecessor = referenceOf(predecessorInput)
    const successor = referenceOf(successorInput)
    if (predecessor.identity.kind !== 'ADR'
      || successor.identity.kind !== 'ADR'
      || predecessor.identity.equals(successor.identity)
      || successor.revision.value !== 1) {
      throw new AdrDomainError(
        'ADR_SUCCESSION_INVALID',
        'An implemented ADR successor requires a distinct ADR identity at revision one.',
      )
    }

    return new AdrSuccession(predecessor, successor)
  }
}

export class AdrRecord {
  readonly reference: CanonicalIdentityReference
  readonly contentHash: AdrContentHash
  readonly decisionStatus: AdrDecisionStatus
  readonly realizationStatus: AdrRealizationStatus
  readonly derivedEligibility: DerivedEligibility
  readonly operationalRecord?: AdrOperationalRecord
  readonly supersedes?: CanonicalIdentityReference
  readonly supersededBy?: CanonicalIdentityReference

  private constructor(input: {
    reference: CanonicalIdentityReference
    contentHash: AdrContentHash
    decisionStatus: AdrDecisionStatus
    realizationStatus: AdrRealizationStatus
    derivedEligibility: DerivedEligibility
    operationalRecord?: AdrOperationalRecord
    supersedes?: CanonicalIdentityReference
    supersededBy?: CanonicalIdentityReference
  }) {
    this.reference = input.reference
    this.contentHash = input.contentHash
    this.decisionStatus = input.decisionStatus
    this.realizationStatus = input.realizationStatus
    this.derivedEligibility = input.derivedEligibility
    this.operationalRecord = input.operationalRecord
    this.supersedes = input.supersedes
    this.supersededBy = input.supersededBy
    Object.freeze(this)
  }

  static create(input: AdrRecordInput): AdrRecord {
    if (CanonicalIdentityReference.create(input.reference).revision.value !== 1) {
      throw new AdrDomainError(
        'ADR_SUCCESSION_INVALID',
        'Only an initial ADR revision may be publicly constructed; successors require aggregate remediation or reconstruction authority.',
      )
    }

    return AdrRecord.createValidated(input, false)
  }

  private static createValidated(
    input: AdrRecordInput,
    allowNonInitialRevision: boolean,
    requireFreshSuccessor = false,
    allowImplementedReplacement = false,
  ): AdrRecord {
    const reference = referenceOf(input.reference)
    if (reference.identity.kind !== 'ADR') {
      throw new AdrDomainError('INVALID_ADR_IDENTITY', 'ADR record identity must have kind ADR.')
    }

    const contentHash = input.contentHash instanceof AdrContentHash
      ? AdrContentHash.create(input.contentHash.value)
      : AdrContentHash.create(input.contentHash)
    const decisionStatus = decisionOf(input.decisionStatus)
    const realizationStatus = realizationOf(input.realizationStatus)
    const derivedEligibility = DerivedEligibility.from(input.derivedEligibility)
    const supersedes = input.supersedes === undefined ? undefined : referenceOf(input.supersedes)
    const supersededBy = input.supersededBy === undefined ? undefined : referenceOf(input.supersededBy)
    const operationalRecord = input.operationalRecord === undefined
      ? undefined
      : AdrOperationalRecord.from(input.operationalRecord)

    if (!allowNonInitialRevision && reference.revision.value !== 1) {
      throw new AdrDomainError(
        'ADR_SUCCESSION_INVALID',
        'Non-initial ADR revisions require the canonical aggregate boundary.',
      )
    }
    if (!allowNonInitialRevision && realizationStatus.value !== 'UNPROCESSED') {
      throw new AdrDomainError(
        'INVALID_ADR_REALIZATION_STATUS',
        'Public initial ADR admission must start unprocessed; realization progression requires its lifecycle transitions.',
      )
    }
    if (reference.revision.value === 1 && supersedes !== undefined) {
      if (!allowImplementedReplacement
        || supersedes.identity.kind !== 'ADR'
        || supersedes.identity.equals(reference.identity)
        || supersedes.revision.value < 1) {
        throw new AdrDomainError('ADR_SUCCESSION_INVALID', 'ADR revision one cannot have a predecessor unless it is a distinct implemented-ADR successor.')
      }
    }
    if (!allowNonInitialRevision && reference.revision.value === 1 && supersededBy !== undefined) {
      throw new AdrDomainError('ADR_SUCCESSION_INVALID', 'Initial ADR admission cannot contain a detached successor reference.')
    }
    if (reference.revision.value > 1 && supersedes === undefined) {
      throw new AdrDomainError('ADR_SUCCESSION_INVALID', 'Every non-initial ADR revision must retain its predecessor reference.')
    }
    if (supersedes !== undefined
      && (supersedes.identity.kind !== 'ADR'
        || (supersedes.identity.equals(reference.identity)
          ? supersedes.revision.value + 1 !== reference.revision.value
          : (!allowImplementedReplacement || reference.revision.value !== 1)))) {
      throw new AdrDomainError('ADR_SUCCESSION_INVALID', 'An ADR successor must point to its immediate predecessor revision.')
    }
    if (supersededBy !== undefined
      && (supersededBy.identity.kind !== 'ADR'
        || (supersededBy.identity.equals(reference.identity)
          ? reference.revision.value + 1 !== supersededBy.revision.value
          : (!allowImplementedReplacement || supersededBy.revision.value !== 1)))) {
      throw new AdrDomainError('ADR_SUCCESSION_INVALID', 'An ADR predecessor must point to its immediate successor revision.')
    }
    if (decisionStatus.value === 'SUPERSEDED' && supersededBy === undefined) {
      throw new AdrDomainError('ADR_SUCCESSION_INVALID', 'A superseded ADR must retain its reciprocal successor reference.')
    }
    if (decisionStatus.value !== 'SUPERSEDED' && supersededBy !== undefined) {
      throw new AdrDomainError('ADR_SUCCESSION_INVALID', 'Only a superseded ADR may carry a successor reference.')
    }
    if (decisionStatus.value === 'ACCEPTED' && derivedEligibility.status !== 'ELIGIBLE') {
      throw new AdrDomainError('INVALID_ADR_ELIGIBILITY', 'Accepted ADRs must remain eligible until superseded.')
    }
    if (decisionStatus.value !== 'ACCEPTED' && derivedEligibility.status !== 'INVALIDATED') {
      throw new AdrDomainError('INVALID_ADR_ELIGIBILITY', 'Non-accepted ADRs cannot be eligible.')
    }
    const isImplementedReplacementPredecessor = allowImplementedReplacement
      && decisionStatus.value === 'SUPERSEDED'
      && realizationStatus.value === 'IMPLEMENTED'
      && supersededBy !== undefined
    if (realizationStatus.value !== 'UNPROCESSED'
      && decisionStatus.value !== 'ACCEPTED'
      && !isImplementedReplacementPredecessor) {
      throw new AdrDomainError('INVALID_ADR_REALIZATION_STATUS', 'Only accepted ADRs may enter realization.')
    }
    if (realizationStatus.value === 'IMPLEMENTED' && !operationalRecord) {
      throw new AdrDomainError('IMPLEMENTED_ADR_IMMUTABLE', 'An implemented ADR requires its operational record.')
    }
    if (realizationStatus.value !== 'IMPLEMENTED' && operationalRecord) {
      throw new AdrDomainError('INVALID_ADR_REALIZATION_STATUS', 'Operational metadata is valid only for implemented ADRs.')
    }
    if (requireFreshSuccessor && supersedes !== undefined
      && (decisionStatus.value !== 'ACCEPTED'
        || realizationStatus.value !== 'UNPROCESSED'
        || derivedEligibility.status !== 'ELIGIBLE'
        || supersededBy !== undefined)) {
      throw new AdrDomainError('ADR_SUCCESSION_INVALID', 'An ADR successor must be a fresh accepted, unprocessed, eligible revision.')
    }
    if (supersededBy !== undefined
      && (decisionStatus.value !== 'SUPERSEDED'
        || derivedEligibility.status !== 'INVALIDATED'
        || (realizationStatus.value === 'IMPLEMENTED'
          ? operationalRecord === undefined
          : realizationStatus.value !== 'UNPROCESSED' || operationalRecord !== undefined))) {
      throw new AdrDomainError('ADR_SUCCESSION_INVALID', 'A superseded ADR must preserve its invalidated predecessor state.')
    }

    return new AdrRecord({
      reference,
      contentHash,
      decisionStatus,
      realizationStatus,
      derivedEligibility,
      operationalRecord,
      supersedes,
      supersededBy,
    })
  }

  static rehydrate(input: AdrRecordInput, authority: AdrRecordReconstructionAuthority): AdrRecord {
    if (!authority || typeof authority.resolveAdrForRehydration !== 'function') {
      throw new AdrDomainError('INVALID_ADR_IDENTITY', 'ADR rehydration requires the canonical identity authority.')
    }

    const reference = referenceOf(input.reference)
    const resolved = authority.resolveAdrForRehydration(reference)
    if (!resolved.reference.equals(reference) || resolved.reference.identity.kind !== 'ADR') {
      throw new AdrDomainError('INVALID_ADR_IDENTITY', 'ADR rehydration reference does not match canonical identity authority.')
    }

    const candidate = AdrRecord.createValidated(input, true, false, true)
    if (!candidate.matchesRecord(resolved)) {
      throw new AdrDomainError(
        'ADR_REHYDRATION_MISMATCH',
        `ADR ${reference.canonicalKey} does not match its authoritative semantic record.`,
      )
    }

    return resolved
  }

  beginProcessing(): AdrRecord {
    if (this.decisionStatus.value !== 'ACCEPTED' || this.realizationStatus.value !== 'UNPROCESSED') {
      throw new AdrDomainError('INVALID_ADR_REALIZATION_TRANSITION', 'Only an accepted, unprocessed ADR can begin realization.')
    }
    return this.copy({ realizationStatus: AdrRealizationStatus.create('PROCESSING') })
  }

  markImplemented(input: AdrOperationalRecordInput): AdrRecord {
    if (this.decisionStatus.value !== 'ACCEPTED' || this.realizationStatus.value !== 'PROCESSING') {
      throw new AdrDomainError('INVALID_ADR_REALIZATION_TRANSITION', 'Only a processing, accepted ADR can become implemented.')
    }
    return this.copy({
      realizationStatus: AdrRealizationStatus.create('IMPLEMENTED'),
      operationalRecord: AdrOperationalRecord.create(input),
    })
  }

  transitionDecision(next: AdrDecisionStatusName): AdrRecord {
    const current = this.decisionStatus.value
    const allowed = current === 'PROPOSED' && (next === 'ACCEPTED' || next === 'REJECTED')
    if (!allowed) {
      throw new AdrDomainError('INVALID_ADR_DECISION_TRANSITION', `ADR decision cannot transition from ${current} to ${next}.`)
    }
    return this.copy({
      decisionStatus: AdrDecisionStatus.create(next),
      derivedEligibility: next === 'ACCEPTED'
        ? DerivedEligibility.eligible()
        : this.derivedEligibility,
    })
  }

  replaceContentHash(): never {
    if (this.realizationStatus.value === 'IMPLEMENTED') {
      throw new AdrDomainError('IMPLEMENTED_ADR_IMMUTABLE', 'An implemented ADR cannot be rewritten.')
    }
    throw new AdrDomainError('ADR_CONTENT_REQUIRES_SUCCESSOR', 'ADR content changes require a successor revision.')
  }

  remediate(nextContentHashInput: AdrContentHash | string): AdrRemediation {
    if (this.decisionStatus.value !== 'ACCEPTED'
      || this.realizationStatus.value !== 'UNPROCESSED'
      || this.derivedEligibility.status !== 'ELIGIBLE') {
      throw new AdrDomainError('ADR_REMEDIATION_NOT_ALLOWED', 'Only an accepted, eligible, unprocessed ADR can be remediated.')
    }

    const nextContentHash = nextContentHashInput instanceof AdrContentHash
      ? nextContentHashInput
      : AdrContentHash.create(nextContentHashInput)
    if (nextContentHash.equals(this.contentHash)) {
      throw new AdrDomainError('ADR_REMEDIATION_NOT_ALLOWED', 'Remediation must change the ADR content basis.')
    }

    const successorReference = CanonicalIdentityReference.create({
      identity: this.reference.identity,
      revision: Revision.create(this.reference.revision.value + 1),
    })
    const successor = AdrRecord.createValidated({
      reference: successorReference,
      contentHash: nextContentHash,
      decisionStatus: 'ACCEPTED',
      realizationStatus: 'UNPROCESSED',
      derivedEligibility: DerivedEligibility.eligible(),
      supersedes: this.reference,
    }, true, true)
    const predecessor = this.copy({
      decisionStatus: AdrDecisionStatus.create('SUPERSEDED'),
      derivedEligibility: DerivedEligibility.invalidated('ADR content changed; derived eligibility is obsolete.'),
      supersededBy: successor.reference,
    })

    return Object.freeze({
      expectedPredecessor: this,
      predecessor,
      successor,
      succession: AdrSuccession.create(predecessor.reference, successor.reference),
    })
  }

  /**
   * Replaces an implemented ADR with a new, distinct ADR identity. The
   * predecessor's document and operational metadata stay immutable; only its
   * decision relation is advanced to SUPERSEDED as part of the atomic
   * reciprocal succession reservation.
   */
  succeedImplemented(
    successorReferenceInput: CanonicalIdentityReferenceInput | CanonicalIdentityReference,
    successorContentHashInput: AdrContentHash | string,
  ): AdrImplementedSuccession {
    if (this.decisionStatus.value !== 'ACCEPTED' || this.realizationStatus.value !== 'IMPLEMENTED') {
      throw new AdrDomainError(
        'ADR_SUCCESSION_INVALID',
        'Only an accepted, implemented ADR can be succeeded by a distinct ADR.',
      )
    }

    const successorReference = referenceOf(successorReferenceInput)
    const succession = AdrSuccession.createImplementedReplacement(this.reference, successorReference)
    const successorContentHash = successorContentHashInput instanceof AdrContentHash
      ? AdrContentHash.create(successorContentHashInput.value)
      : AdrContentHash.create(successorContentHashInput)
    if (successorContentHash.equals(this.contentHash)) {
      throw new AdrDomainError('ADR_SUCCESSION_INVALID', 'An implemented ADR successor must provide a new content basis.')
    }

    const successor = AdrRecord.createValidated({
      reference: succession.successor,
      contentHash: successorContentHash,
      decisionStatus: 'ACCEPTED',
      realizationStatus: 'UNPROCESSED',
      derivedEligibility: DerivedEligibility.eligible(),
      supersedes: this.reference,
    }, true, true, true)
    const predecessor = this.copy({
      decisionStatus: AdrDecisionStatus.create('SUPERSEDED'),
      derivedEligibility: DerivedEligibility.invalidated('ADR was superseded by a distinct normative successor.'),
      supersededBy: successor.reference,
    }, true)

    return Object.freeze({
      expectedPredecessor: this,
      predecessor,
      successor,
      succession,
    })
  }

  matchesObservation(observation: AdrAuthorityObservation): boolean {
    return this.reference.equals(observation.reference)
      && this.decisionStatus.value === observation.decisionStatus
      && this.realizationStatus.value === observation.realizationStatus
      && this.contentHash.equals(observation.contentHash)
  }

  matchesRecord(other: AdrRecord): boolean {
    return this.reference.equals(other.reference)
      && this.contentHash.equals(other.contentHash)
      && this.decisionStatus.equals(other.decisionStatus)
      && this.realizationStatus.equals(other.realizationStatus)
      && this.derivedEligibility.status === other.derivedEligibility.status
      && this.derivedEligibility.reason === other.derivedEligibility.reason
      && sameOperationalRecord(this.operationalRecord, other.operationalRecord)
      && sameOptionalReference(this.supersedes, other.supersedes)
      && sameOptionalReference(this.supersededBy, other.supersededBy)
  }

  private copy(overrides: Partial<{
    decisionStatus: AdrDecisionStatus
    realizationStatus: AdrRealizationStatus
    derivedEligibility: DerivedEligibility
    operationalRecord: AdrOperationalRecord
    supersedes: CanonicalIdentityReference
    supersededBy: CanonicalIdentityReference
  }>, allowImplementedReplacement = false): AdrRecord {
    return AdrRecord.createValidated({
      reference: this.reference,
      contentHash: this.contentHash,
      decisionStatus: overrides.decisionStatus ?? this.decisionStatus,
      realizationStatus: overrides.realizationStatus ?? this.realizationStatus,
      derivedEligibility: overrides.derivedEligibility ?? this.derivedEligibility,
      operationalRecord: overrides.operationalRecord ?? this.operationalRecord,
      supersedes: overrides.supersedes ?? this.supersedes,
      supersededBy: overrides.supersededBy ?? this.supersededBy,
    }, true, false, allowImplementedReplacement)
  }
}

export interface AdrRemediation {
  readonly expectedPredecessor: AdrRecord
  readonly predecessor: AdrRecord
  readonly successor: AdrRecord
  readonly succession: AdrSuccession
}

export interface AdrImplementedSuccession {
  readonly expectedPredecessor: AdrRecord
  readonly predecessor: AdrRecord
  readonly successor: AdrRecord
  readonly succession: AdrSuccession
}

export interface AdrRevisionReservationAccepted {
  readonly status: 'ACCEPTED'
  readonly remediation: AdrRemediation
}

export interface AdrRevisionReservationDuplicate {
  readonly status: 'DUPLICATE'
  readonly existing: AdrRecord
}

export type AdrRevisionReservation = AdrRevisionReservationAccepted | AdrRevisionReservationDuplicate

export interface AdrRevisionRepository {
  find(reference: CanonicalIdentityReference): AdrRecord | undefined
  reserveRemediation(
    remediation: AdrRemediation,
    expectedAuthority: AdrAuthorityObservation,
    authorityReader: AdrAuthorityReader,
  ): Promise<AdrRevisionReservation>
}

export interface AdrImplementedSuccessionAccepted {
  readonly status: 'ACCEPTED'
  readonly succession: AdrImplementedSuccession
}

export interface AdrImplementedSuccessionDuplicate {
  readonly status: 'DUPLICATE'
  readonly existing: AdrRecord
}

export type AdrImplementedSuccessionReservation =
  | AdrImplementedSuccessionAccepted
  | AdrImplementedSuccessionDuplicate

export interface AdrImplementedSuccessionRepository {
  find(reference: CanonicalIdentityReference): AdrRecord | undefined
  reserveImplementedSuccession(
    succession: AdrImplementedSuccession,
    expectedAuthority: AdrAuthorityObservation,
    authorityReader: AdrAuthorityReader,
  ): Promise<AdrImplementedSuccessionReservation>
}

export interface AdrAuthorityObservation {
  readonly reference: CanonicalIdentityReference
  readonly decisionStatus: AdrDecisionStatusName
  readonly realizationStatus: AdrRealizationStatusName
  readonly contentHash: AdrContentHash
}

export interface AdrAuthorityReader {
  observe(reference: CanonicalIdentityReference): AdrAuthorityObservation | undefined
}

export interface AdrAuthorityCatalogOptions {
  readonly beforeReservationCommit?: () => Promise<void>
}

export function observationFromRecord(record: AdrRecord): AdrAuthorityObservation {
  return Object.freeze({
    reference: record.reference,
    decisionStatus: record.decisionStatus.value,
    realizationStatus: record.realizationStatus.value,
    contentHash: record.contentHash,
  })
}

function sameOptionalReference(
  left: CanonicalIdentityReference | undefined,
  right: CanonicalIdentityReference | undefined,
): boolean {
  return left === undefined || right === undefined
    ? left === right
    : left.equals(right)
}

function sameOperationalRecord(left: AdrOperationalRecord | undefined, right: AdrOperationalRecord | undefined): boolean {
  return left === undefined || right === undefined
    ? left === right
    : left.implementationCommitSha === right.implementationCommitSha
      && left.implementedAt === right.implementedAt
      && left.evidenceReference === right.evidenceReference
}

/**
 * Local semantic authority catalog. Physical persistence remains a PLAT
 * concern; this catalog is the productive DOM contract used by consumers
 * before the integrated persistence checkpoint exists.
 */
export class AdrAuthorityCatalog implements AdrRevisionRepository, AdrImplementedSuccessionRepository, AdrAuthorityReader, AdrRecordReconstructionAuthority {
  private readonly records = new Map<string, AdrRecord>()

  constructor(private readonly options: AdrAuthorityCatalogOptions = {}) {}

  registerInitial(record: AdrRecord): void {
    if (!(record instanceof AdrRecord) || record.reference.revision.value !== 1) {
      throw new AdrDomainError('ADR_SUCCESSION_INVALID', 'Initial ADR registration must use a valid revision-one record.')
    }
    const canonicalRecord = AdrRecord.create(record)
    if (this.records.has(canonicalRecord.reference.canonicalKey)) {
      throw new AdrDomainError('ADR_REVISION_ALREADY_EXISTS', `ADR ${canonicalRecord.reference.canonicalKey} already exists.`)
    }
    this.records.set(canonicalRecord.reference.canonicalKey, canonicalRecord)
  }

  find(reference: CanonicalIdentityReference): AdrRecord | undefined {
    return this.records.get(reference.canonicalKey)
  }

  observe(reference: CanonicalIdentityReference): AdrAuthorityObservation | undefined {
    const record = this.find(reference)
    return record ? observationFromRecord(record) : undefined
  }

  resolveAdrForRehydration(reference: CanonicalIdentityReference): AdrRecord {
    const canonicalReference = CanonicalIdentityReference.create(reference)
    const record = this.find(canonicalReference)
    if (!record) {
      throw new AdrDomainError('ADR_REVISION_NOT_FOUND', `ADR ${canonicalReference.canonicalKey} could not be resolved.`)
    }

    this.assertCompleteReciprocalHistory(record)
    return record
  }

  async reserveRemediation(
    remediation: AdrRemediation,
    expectedAuthority: AdrAuthorityObservation,
    authorityReader: AdrAuthorityReader,
  ): Promise<AdrRevisionReservation> {
    if (!remediation
      || !remediation.predecessor
      || !remediation.successor
      || !remediation.expectedPredecessor
      || !remediation.succession) {
      throw new AdrDomainError('ADR_SUCCESSION_INVALID', 'ADR reservation requires a complete remediation relation.')
    }
    if (!isAuthorityObservation(expectedAuthority)
      || !authorityReader
      || typeof authorityReader.observe !== 'function') {
      throw new AdrDomainError('ADR_AUTHORITY_DRIFT', 'ADR reservation requires a canonical authority observation and reader.')
    }

    const predecessorReference = referenceOf(remediation.predecessor.reference)
    const successorReference = referenceOf(remediation.successor.reference)
    const predecessorKey = predecessorReference.canonicalKey
    const successorKey = successorReference.canonicalKey
    const succession = AdrSuccession.create(predecessorReference, successorReference)
    const canonicalSuccessorContentHash = AdrContentHash.create(remediation.successor.contentHash.value)
    if (!succession.predecessor.equals(remediation.succession.predecessor)
      || !succession.successor.equals(remediation.succession.successor)) {
      throw new AdrDomainError('ADR_SUCCESSION_INVALID', 'ADR reservation contains a mismatched succession relation.')
    }

    const predecessor = this.records.get(predecessorKey)
    if (!predecessor) {
      throw new AdrDomainError('ADR_REVISION_NOT_FOUND', `ADR predecessor ${predecessorKey} could not be resolved.`)
    }

    const existing = this.records.get(successorKey)
    if (existing
      && predecessor.matchesRecord(remediation.predecessor)
      && existing.matchesRecord(remediation.successor)) {
      return { status: 'DUPLICATE', existing }
    }
    if (existing) {
      throw new AdrDomainError('ADR_AUTHORITY_DRIFT', `ADR successor ${successorKey} conflicts with canonical history.`)
    }

    if (!predecessor.matchesRecord(remediation.expectedPredecessor)) {
      throw new AdrDomainError('ADR_AUTHORITY_DRIFT', `ADR predecessor ${predecessorKey} does not match canonical authority.`)
    }

    const canonicalRemediation = predecessor.remediate(canonicalSuccessorContentHash)
    if (!canonicalRemediation.predecessor.reference.equals(predecessorReference)
      || !canonicalRemediation.successor.reference.equals(successorReference)
      || !canonicalRemediation.predecessor.matchesRecord(remediation.predecessor)
      || !canonicalRemediation.successor.matchesRecord(remediation.successor)
      || !canonicalRemediation.succession.predecessor.equals(remediation.succession.predecessor)
      || !canonicalRemediation.succession.successor.equals(remediation.succession.successor)) {
      throw new AdrDomainError('ADR_SUCCESSION_INVALID', 'ADR reservation contains caller-supplied semantic material that is not canonical.')
    }
    const canonicalExpectedAuthority: AdrAuthorityObservation = Object.freeze({
      reference: referenceOf(expectedAuthority.reference),
      decisionStatus: expectedAuthority.decisionStatus,
      realizationStatus: expectedAuthority.realizationStatus,
      contentHash: AdrContentHash.create(expectedAuthority.contentHash.value),
    })

    if (!predecessor.matchesObservation(canonicalExpectedAuthority)) {
      throw new AdrDomainError('ADR_AUTHORITY_DRIFT', `ADR predecessor ${predecessorKey} does not match the observed authority.`)
    }
    const atCommit = authorityReader.observe(predecessor.reference)
    if (!isAuthorityObservation(atCommit) || !sameObservation(canonicalExpectedAuthority, atCommit)) {
      throw new AdrDomainError('ADR_AUTHORITY_DRIFT', `ADR predecessor ${predecessorKey} changed at reservation commit.`)
    }

    await this.options.beforeReservationCommit?.()

    const predecessorAtCommit = this.records.get(predecessorKey)
    const successorAtCommit = this.records.get(successorKey)
    if (!predecessorAtCommit) {
      throw new AdrDomainError('ADR_REVISION_NOT_FOUND', `ADR predecessor ${predecessorKey} could not be resolved.`)
    }
    if (successorAtCommit
      && predecessorAtCommit.matchesRecord(canonicalRemediation.predecessor)
      && successorAtCommit.matchesRecord(canonicalRemediation.successor)) {
      return { status: 'DUPLICATE', existing: successorAtCommit }
    }
    if (successorAtCommit) {
      throw new AdrDomainError('ADR_AUTHORITY_DRIFT', `ADR successor ${successorKey} conflicts with canonical history.`)
    }
    if (!predecessorAtCommit.matchesRecord(canonicalRemediation.expectedPredecessor)
      || !predecessorAtCommit.matchesObservation(canonicalExpectedAuthority)) {
      throw new AdrDomainError('ADR_AUTHORITY_DRIFT', `ADR predecessor ${predecessorKey} changed before reservation commit.`)
    }
    const finalAuthority = authorityReader.observe(predecessor.reference)
    if (!isAuthorityObservation(finalAuthority) || !sameObservation(canonicalExpectedAuthority, finalAuthority)) {
      throw new AdrDomainError('ADR_AUTHORITY_DRIFT', `ADR predecessor ${predecessorKey} changed at reservation commit.`)
    }

    const commitRemediation = predecessorAtCommit.remediate(canonicalSuccessorContentHash)
    if (!commitRemediation.predecessor.matchesRecord(canonicalRemediation.predecessor)
      || !commitRemediation.successor.matchesRecord(canonicalRemediation.successor)
      || !commitRemediation.succession.predecessor.equals(canonicalRemediation.succession.predecessor)
      || !commitRemediation.succession.successor.equals(canonicalRemediation.succession.successor)) {
      throw new AdrDomainError('ADR_AUTHORITY_DRIFT', `ADR predecessor ${predecessorKey} changed before reservation commit.`)
    }

    this.records.set(predecessorKey, commitRemediation.predecessor)
    this.records.set(successorKey, commitRemediation.successor)
    return { status: 'ACCEPTED', remediation: commitRemediation }
  }

  async reserveImplementedSuccession(
    successionInput: AdrImplementedSuccession,
    expectedAuthority: AdrAuthorityObservation,
    authorityReader: AdrAuthorityReader,
  ): Promise<AdrImplementedSuccessionReservation> {
    if (!successionInput
      || !successionInput.predecessor
      || !successionInput.successor
      || !successionInput.expectedPredecessor
      || !successionInput.succession) {
      throw new AdrDomainError('ADR_SUCCESSION_INVALID', 'Implemented ADR succession requires a complete reciprocal relation.')
    }
    if (!isAuthorityObservation(expectedAuthority)
      || !authorityReader
      || typeof authorityReader.observe !== 'function') {
      throw new AdrDomainError('ADR_AUTHORITY_DRIFT', 'Implemented ADR succession requires a canonical authority observation and reader.')
    }

    const predecessorReference = referenceOf(successionInput.predecessor.reference)
    const successorReference = referenceOf(successionInput.successor.reference)
    const canonicalSuccession = AdrSuccession.createImplementedReplacement(predecessorReference, successorReference)
    if (!canonicalSuccession.predecessor.equals(successionInput.succession.predecessor)
      || !canonicalSuccession.successor.equals(successionInput.succession.successor)) {
      throw new AdrDomainError('ADR_SUCCESSION_INVALID', 'Implemented ADR succession contains a mismatched relation.')
    }

    const predecessor = this.records.get(predecessorReference.canonicalKey)
    if (!predecessor) {
      throw new AdrDomainError('ADR_REVISION_NOT_FOUND', `ADR predecessor ${predecessorReference.canonicalKey} could not be resolved.`)
    }
    const existing = this.records.get(successorReference.canonicalKey)
    if (existing
      && predecessor.matchesRecord(successionInput.predecessor)
      && existing.matchesRecord(successionInput.successor)) {
      return { status: 'DUPLICATE', existing }
    }
    if (existing) {
      throw new AdrDomainError('ADR_AUTHORITY_DRIFT', `ADR successor ${successorReference.canonicalKey} conflicts with canonical history.`)
    }
    if (!predecessor.matchesRecord(successionInput.expectedPredecessor)) {
      throw new AdrDomainError('ADR_AUTHORITY_DRIFT', `ADR predecessor ${predecessorReference.canonicalKey} does not match canonical authority.`)
    }

    const canonicalSuccessionResult = predecessor.succeedImplemented(
      successorReference,
      successionInput.successor.contentHash,
    )
    if (!canonicalSuccessionResult.predecessor.matchesRecord(successionInput.predecessor)
      || !canonicalSuccessionResult.successor.matchesRecord(successionInput.successor)) {
      throw new AdrDomainError('ADR_SUCCESSION_INVALID', 'Implemented ADR succession contains caller-supplied semantic material that is not canonical.')
    }

    const canonicalExpectedAuthority: AdrAuthorityObservation = Object.freeze({
      reference: referenceOf(expectedAuthority.reference),
      decisionStatus: expectedAuthority.decisionStatus,
      realizationStatus: expectedAuthority.realizationStatus,
      contentHash: AdrContentHash.create(expectedAuthority.contentHash.value),
    })
    if (!predecessor.matchesObservation(canonicalExpectedAuthority)) {
      throw new AdrDomainError('ADR_AUTHORITY_DRIFT', `ADR predecessor ${predecessorReference.canonicalKey} does not match the observed authority.`)
    }
    const observedBeforeCommit = authorityReader.observe(predecessor.reference)
    if (!isAuthorityObservation(observedBeforeCommit) || !sameObservation(canonicalExpectedAuthority, observedBeforeCommit)) {
      throw new AdrDomainError('ADR_AUTHORITY_DRIFT', `ADR predecessor ${predecessorReference.canonicalKey} changed at succession reservation.`)
    }

    await this.options.beforeReservationCommit?.()

    const predecessorAtCommit = this.records.get(predecessorReference.canonicalKey)
    const successorAtCommit = this.records.get(successorReference.canonicalKey)
    if (!predecessorAtCommit) {
      throw new AdrDomainError('ADR_REVISION_NOT_FOUND', `ADR predecessor ${predecessorReference.canonicalKey} could not be resolved.`)
    }
    if (successorAtCommit
      && predecessorAtCommit.matchesRecord(canonicalSuccessionResult.predecessor)
      && successorAtCommit.matchesRecord(canonicalSuccessionResult.successor)) {
      return { status: 'DUPLICATE', existing: successorAtCommit }
    }
    if (successorAtCommit) {
      throw new AdrDomainError('ADR_AUTHORITY_DRIFT', `ADR successor ${successorReference.canonicalKey} conflicts with canonical history.`)
    }
    if (!predecessorAtCommit.matchesRecord(canonicalSuccessionResult.expectedPredecessor)
      || !predecessorAtCommit.matchesObservation(canonicalExpectedAuthority)) {
      throw new AdrDomainError('ADR_AUTHORITY_DRIFT', `ADR predecessor ${predecessorReference.canonicalKey} changed before succession commit.`)
    }
    const finalAuthority = authorityReader.observe(predecessor.reference)
    if (!isAuthorityObservation(finalAuthority) || !sameObservation(canonicalExpectedAuthority, finalAuthority)) {
      throw new AdrDomainError('ADR_AUTHORITY_DRIFT', `ADR predecessor ${predecessorReference.canonicalKey} changed at succession commit.`)
    }

    const commitSuccession = predecessorAtCommit.succeedImplemented(
      successorReference,
      canonicalSuccessionResult.successor.contentHash,
    )
    if (!commitSuccession.predecessor.matchesRecord(canonicalSuccessionResult.predecessor)
      || !commitSuccession.successor.matchesRecord(canonicalSuccessionResult.successor)) {
      throw new AdrDomainError('ADR_AUTHORITY_DRIFT', `ADR predecessor ${predecessorReference.canonicalKey} changed before succession commit.`)
    }
    this.records.set(predecessorReference.canonicalKey, commitSuccession.predecessor)
    this.records.set(successorReference.canonicalKey, commitSuccession.successor)
    return { status: 'ACCEPTED', succession: commitSuccession }
  }

  private assertCompleteReciprocalHistory(target: AdrRecord): void {
    const visited = new Set<string>()
    let current = target
    while (true) {
      this.assertUnvisited(current, visited)
      const predecessorReference = current.supersedes
      if (!predecessorReference) {
        if (current.reference.revision.value !== 1) {
          throw new AdrDomainError('ADR_SUCCESSION_INVALID', 'Every non-initial ADR revision must retain its predecessor reference.')
        }
        break
      }
      if (current.reference.revision.value === 1
        && current.reference.identity.equals(predecessorReference.identity)) {
        throw new AdrDomainError('ADR_SUCCESSION_INVALID', 'An initial ADR revision cannot point to a same-identity predecessor.')
      }
      const predecessor = this.records.get(predecessorReference.canonicalKey)
      if (!predecessor) {
        throw new AdrDomainError('ADR_REVISION_NOT_FOUND', `ADR predecessor ${predecessorReference.canonicalKey} could not be resolved.`)
      }
      if (!predecessor.supersededBy?.equals(current.reference)) {
        throw new AdrDomainError('ADR_SUCCESSION_INVALID', 'ADR predecessor and successor references must be reciprocal.')
      }
      if (predecessor.reference.identity.equals(current.reference.identity)) {
        if (current.reference.revision.value !== predecessor.reference.revision.value + 1) {
          throw new AdrDomainError('ADR_SUCCESSION_INVALID', 'ADR same-identity succession must be an immediate revision.')
        }
      } else if (current.reference.revision.value !== 1
        || predecessor.realizationStatus.value !== 'IMPLEMENTED') {
        throw new AdrDomainError('ADR_SUCCESSION_INVALID', 'A distinct implemented-ADR successor must begin at revision one and follow an implemented predecessor.')
      }
      current = predecessor
    }

    current = target
    const forwardVisited = new Set<string>()
    while (current.supersededBy) {
      this.assertUnvisited(current, forwardVisited)
      const successor = this.records.get(current.supersededBy.canonicalKey)
      if (!successor) {
        throw new AdrDomainError('ADR_REVISION_NOT_FOUND', `ADR successor ${current.supersededBy.canonicalKey} could not be resolved.`)
      }
      if (!successor.supersedes?.equals(current.reference)) {
        throw new AdrDomainError('ADR_SUCCESSION_INVALID', 'ADR successor and predecessor references must be reciprocal.')
      }
      if (successor.reference.identity.equals(current.reference.identity)) {
        if (successor.reference.revision.value !== current.reference.revision.value + 1) {
          throw new AdrDomainError('ADR_SUCCESSION_INVALID', 'ADR same-identity succession must be an immediate revision.')
        }
      } else if (successor.reference.revision.value !== 1
        || current.realizationStatus.value !== 'IMPLEMENTED') {
        throw new AdrDomainError('ADR_SUCCESSION_INVALID', 'A distinct implemented-ADR successor must begin at revision one and follow an implemented predecessor.')
      }
      current = successor
    }
  }

  private assertUnvisited(record: AdrRecord, visited: Set<string>): void {
    if (visited.has(record.reference.canonicalKey)) {
      throw new AdrDomainError('ADR_SUCCESSION_INVALID', 'ADR succession cannot contain a cycle.')
    }
    visited.add(record.reference.canonicalKey)
  }
}

function sameObservation(left: AdrAuthorityObservation, right: AdrAuthorityObservation): boolean {
  return left.reference.equals(right.reference)
    && left.decisionStatus === right.decisionStatus
    && left.realizationStatus === right.realizationStatus
    && left.contentHash.equals(right.contentHash)
}

function isAuthorityObservation(input: unknown): input is AdrAuthorityObservation {
  if (!input || typeof input !== 'object') return false
  const observation = input as Partial<AdrAuthorityObservation>
  return observation.reference instanceof CanonicalIdentityReference
    && typeof observation.decisionStatus === 'string'
    && typeof observation.realizationStatus === 'string'
    && observation.contentHash instanceof AdrContentHash
}
