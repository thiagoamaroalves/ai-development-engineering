import {
  AdrAuthorityObservation,
  AdrAuthorityReader,
  AdrContentHash,
  AdrDomainError,
  AdrRecord,
  AdrImplementedSuccession,
  AdrImplementedSuccessionRepository,
  AdrRemediation,
  AdrRevisionRepository,
  AdrSuccession,
  observationFromRecord,
} from '../domain/adr.js'
import { CanonicalIdentityReference, CanonicalIdentityReferenceInput } from '../domain/identity.js'

export interface ReadAdrAuthorityQuery {
  readonly reference: CanonicalIdentityReferenceInput
}

export class ReadAdrAuthorityHandler {
  constructor(private readonly reader: AdrAuthorityReader) {}

  handle(query: ReadAdrAuthorityQuery): AdrAuthorityObservation {
    const reference = CanonicalIdentityReference.create(query.reference)
    const observation = this.reader.observe(reference)
    if (!observation) {
      throw new AdrDomainError('ADR_AUTHORITY_NOT_FOUND', `ADR ${reference.canonicalKey} could not be resolved.`)
    }
    return observation
  }
}

export interface RemediateAdrCommand {
  readonly reference: CanonicalIdentityReferenceInput
  readonly nextContentHash: string
}

export class RemediateAdrHandler {
  constructor(
    private readonly revisions: AdrRevisionRepository,
    private readonly reader: AdrAuthorityReader,
  ) {}

  async handle(command: RemediateAdrCommand) {
    const reference = CanonicalIdentityReference.create(command.reference)
    const before = this.readRequired(reference)
    const current = this.revisions.find(reference)
    if (!current || !current.matchesObservation(before)) {
      throw new AdrDomainError('ADR_AUTHORITY_DRIFT', `ADR ${reference.canonicalKey} changed before remediation.`)
    }

    const replay = this.reconcileExactReplay(current, command.nextContentHash)
    if (replay) {
      return replay
    }

    const remediation = current.remediate(command.nextContentHash)
    const atCommit = this.readRequired(reference)
    if (!sameObservation(before, atCommit)) {
      throw new AdrDomainError('ADR_AUTHORITY_DRIFT', `ADR ${reference.canonicalKey} changed during remediation.`)
    }

    const reservation = await this.revisions.reserveRemediation(remediation, atCommit, this.reader)
    if (reservation.status === 'DUPLICATE') {
      if (!reservation.existing.reference.equals(remediation.successor.reference)
        || !reservation.existing.contentHash.equals(remediation.successor.contentHash)) {
        throw new AdrDomainError('ADR_AUTHORITY_DRIFT', `ADR successor ${reservation.existing.reference.canonicalKey} conflicts with the requested remediation.`)
      }
      return { ...remediation, successor: reservation.existing }
    }

    return reservation.remediation
  }

  private reconcileExactReplay(current: AdrRecord, nextContentHash: string): AdrRemediation | undefined {
    if (!current.supersededBy) {
      return undefined
    }

    const successor = this.revisions.find(current.supersededBy)
    if (!successor) {
      throw new AdrDomainError('ADR_REVISION_NOT_FOUND', `ADR successor ${current.supersededBy.canonicalKey} could not be resolved.`)
    }

    const requestedHash = AdrContentHash.create(nextContentHash)
    if (!successor.supersedes?.equals(current.reference)) {
      throw new AdrDomainError('ADR_SUCCESSION_INVALID', `ADR successor ${successor.reference.canonicalKey} is not reciprocally linked.`)
    }
    if (!successor.contentHash.equals(requestedHash)) {
      throw new AdrDomainError('ADR_AUTHORITY_DRIFT', `ADR successor ${successor.reference.canonicalKey} conflicts with the requested remediation.`)
    }

    return {
      expectedPredecessor: current,
      predecessor: current,
      successor,
      succession: AdrSuccession.create(current.reference, successor.reference),
    }
  }

  private readRequired(reference: CanonicalIdentityReference): AdrAuthorityObservation {
    const observation = this.reader.observe(reference)
    if (!observation) {
      throw new AdrDomainError('ADR_AUTHORITY_NOT_FOUND', `ADR ${reference.canonicalKey} could not be resolved.`)
    }
    return observation
  }
}

export interface SucceedImplementedAdrCommand {
  readonly reference: CanonicalIdentityReferenceInput
  readonly successorReference: CanonicalIdentityReferenceInput
  readonly successorContentHash: string
}

/**
 * Coordinates the only permitted replacement path for an implemented ADR.
 * The aggregate owns the lifecycle and lineage decision; this handler owns
 * observations and delegates the atomic reciprocal reservation to the port.
 */
export class SucceedImplementedAdrHandler {
  constructor(
    private readonly succession: AdrImplementedSuccessionRepository,
    private readonly reader: AdrAuthorityReader,
  ) {}

  async handle(command: SucceedImplementedAdrCommand): Promise<AdrImplementedSuccession> {
    const reference = CanonicalIdentityReference.create(command.reference)
    const successorReference = CanonicalIdentityReference.create(command.successorReference)
    const current = this.succession.find(reference)
    if (!current) {
      throw new AdrDomainError('ADR_AUTHORITY_NOT_FOUND', `ADR ${reference.canonicalKey} could not be resolved.`)
    }

    const replay = this.reconcileExactReplay(current, successorReference, command.successorContentHash)
    if (replay) return replay

    const before = this.readRequired(reference)
    if (!current.matchesObservation(before)) {
      throw new AdrDomainError('ADR_AUTHORITY_DRIFT', `ADR ${reference.canonicalKey} changed before succession.`)
    }

    const candidate = current.succeedImplemented(successorReference, command.successorContentHash)
    const atCommit = this.readRequired(reference)
    if (!sameObservation(before, atCommit)) {
      throw new AdrDomainError('ADR_AUTHORITY_DRIFT', `ADR ${reference.canonicalKey} changed during succession.`)
    }

    const reservation = await this.succession.reserveImplementedSuccession(candidate, atCommit, this.reader)
    if (reservation.status === 'DUPLICATE') {
      if (!reservation.existing.reference.equals(candidate.successor.reference)
        || !reservation.existing.contentHash.equals(candidate.successor.contentHash)) {
        throw new AdrDomainError('ADR_AUTHORITY_DRIFT', `ADR successor ${reservation.existing.reference.canonicalKey} conflicts with the requested succession.`)
      }
      return { ...candidate, successor: reservation.existing }
    }

    return reservation.succession
  }

  private reconcileExactReplay(
    current: AdrRecord,
    successorReference: CanonicalIdentityReference,
    successorContentHashInput: string,
  ): AdrImplementedSuccession | undefined {
    if (!current.supersededBy) return undefined

    const successor = this.succession.find(current.supersededBy)
    if (!successor) {
      throw new AdrDomainError('ADR_REVISION_NOT_FOUND', `ADR successor ${current.supersededBy.canonicalKey} could not be resolved.`)
    }
    const requestedHash = AdrContentHash.create(successorContentHashInput)
    if (!successor.reference.equals(successorReference)
      || !successor.contentHash.equals(requestedHash)) {
      throw new AdrDomainError('ADR_AUTHORITY_DRIFT', `ADR successor ${successor.reference.canonicalKey} conflicts with the requested succession.`)
    }
    if (!successor.supersedes?.equals(current.reference)) {
      throw new AdrDomainError('ADR_SUCCESSION_INVALID', `ADR successor ${successor.reference.canonicalKey} is not reciprocally linked.`)
    }

    return {
      expectedPredecessor: current,
      predecessor: current,
      successor,
      succession: AdrSuccession.createImplementedReplacement(current.reference, successor.reference),
    }
  }

  private readRequired(reference: CanonicalIdentityReference): AdrAuthorityObservation {
    const observation = this.reader.observe(reference)
    if (!observation) {
      throw new AdrDomainError('ADR_AUTHORITY_NOT_FOUND', `ADR ${reference.canonicalKey} could not be resolved.`)
    }
    return observation
  }
}

function sameObservation(left: AdrAuthorityObservation, right: AdrAuthorityObservation): boolean {
  return left.reference.equals(right.reference)
    && left.decisionStatus === right.decisionStatus
    && left.realizationStatus === right.realizationStatus
    && left.contentHash.equals(right.contentHash)
}
