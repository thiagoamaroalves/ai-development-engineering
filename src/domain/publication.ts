import { CanonicalIdentityReference, CanonicalIdentityReferenceInput } from './identity.js'

export const PUBLICATION_STATES = Object.freeze([
  'PUBLICATION_CANDIDATE_READY',
  'AWAITING_PUBLICATION_APPROVAL',
  'LOCAL_INTEGRATION_PENDING',
  'LOCAL_INTEGRATION_COMPLETE',
  'PR_OPEN',
  'AWAITING_PR_MERGE',
  'PR_MERGED',
  'REMOTE_PUBLICATION_CONFIRMED',
] as const)

export type PublicationStateName = (typeof PUBLICATION_STATES)[number]
export type PublicationUnitProgressState = 'ACTIVE' | 'PAUSED' | 'CANCEL_REQUESTED' | 'CANCELLED'
export type PublicationErrorCode =
  | 'INVALID_PUBLICATION_IDENTITY'
  | 'INVALID_PUBLICATION_STATE'
  | 'INVALID_PUBLICATION_BASIS'
  | 'INVALID_PUBLICATION_TRANSITION'
  | 'PUBLICATION_STALE'

export class PublicationDomainError extends Error {
  readonly code: PublicationErrorCode
  constructor(code: PublicationErrorCode, message: string) {
    super(message)
    this.name = 'PublicationDomainError'
    this.code = code
  }
}

function token(value: unknown, label: string): string {
  if (typeof value !== 'string' || !value.trim() || /[\r\n]/.test(value)) {
    throw new PublicationDomainError('INVALID_PUBLICATION_BASIS', `${label} must be a non-empty single-line value.`)
  }
  return value.trim()
}

export class PublicationState {
  readonly value: PublicationStateName
  private constructor(value: PublicationStateName) { this.value = value; Object.freeze(this) }
  static create(value: unknown): PublicationState {
    if (typeof value === 'string' && (PUBLICATION_STATES as readonly string[]).includes(value)) return new PublicationState(value as PublicationStateName)
    throw new PublicationDomainError('INVALID_PUBLICATION_STATE', 'Publication state must be a known canonical state.')
  }
}

export class PublicationRevision {
  readonly value: number
  private constructor(value: number) { this.value = value; Object.freeze(this) }
  static create(value: unknown): PublicationRevision {
    if (typeof value !== 'number' || !Number.isInteger(value) || value < 0) throw new PublicationDomainError('INVALID_PUBLICATION_TRANSITION', 'Publication revision must be a non-negative integer.')
    return new PublicationRevision(value)
  }
  next(): PublicationRevision { return new PublicationRevision(this.value + 1) }
}

export interface CandidateBasisInput {
  readonly candidateId: string
  readonly baseSha: string
  readonly headSha: string
  readonly treeHash: string
  readonly conformanceRunId: string
}

export class CandidateBasis {
  readonly candidateId: string
  readonly baseSha: string
  readonly headSha: string
  readonly treeHash: string
  readonly conformanceRunId: string
  private constructor(input: CandidateBasisInput) {
    this.candidateId = token(input.candidateId, 'Candidate ID')
    this.baseSha = token(input.baseSha, 'Candidate base')
    this.headSha = token(input.headSha, 'Candidate head')
    this.treeHash = token(input.treeHash, 'Candidate tree')
    this.conformanceRunId = token(input.conformanceRunId, 'Conformance run')
    Object.freeze(this)
  }
  static create(input: CandidateBasisInput | CandidateBasis): CandidateBasis {
    return input instanceof CandidateBasis ? input : new CandidateBasis(input)
  }
  equals(other: CandidateBasis): boolean {
    return this.candidateId === other.candidateId && this.baseSha === other.baseSha
      && this.headSha === other.headSha && this.treeHash === other.treeHash
      && this.conformanceRunId === other.conformanceRunId
  }
}

export interface RemotePublicationConfirmationInput {
  readonly candidateId: string
  readonly baseSha: string
  readonly headSha: string
  readonly treeHash: string
  readonly conformanceRunId: string
  readonly evidenceId: string
}

export class RemotePublicationConfirmation {
  readonly candidateId: string
  readonly baseSha: string
  readonly headSha: string
  readonly treeHash: string
  readonly conformanceRunId: string
  readonly evidenceId: string
  private constructor(input: RemotePublicationConfirmationInput) {
    this.candidateId = token(input.candidateId, 'Remote candidate ID')
    this.baseSha = token(input.baseSha, 'Remote base')
    this.headSha = token(input.headSha, 'Remote head')
    this.treeHash = token(input.treeHash, 'Remote tree')
    this.conformanceRunId = token(input.conformanceRunId, 'Remote conformance run')
    this.evidenceId = token(input.evidenceId, 'Remote evidence ID')
    Object.freeze(this)
  }
  static create(input: RemotePublicationConfirmationInput | RemotePublicationConfirmation): RemotePublicationConfirmation {
    return input instanceof RemotePublicationConfirmation ? input : new RemotePublicationConfirmation(input)
  }
  matches(basis: CandidateBasis): boolean {
    return this.candidateId === basis.candidateId && this.baseSha === basis.baseSha
      && this.headSha === basis.headSha && this.treeHash === basis.treeHash
      && this.conformanceRunId === basis.conformanceRunId
  }
}

function snapshotAuthorization(input: PublicationTransitionAuthorization | undefined): Readonly<PublicationTransitionAuthorization> {
  const authorization = input ?? {}
  return Object.freeze({
    ...authorization,
    candidateBasis: authorization.candidateBasis === undefined
      ? undefined
      : CandidateBasis.create(authorization.candidateBasis),
    remoteConfirmation: authorization.remoteConfirmation === undefined
      ? undefined
      : RemotePublicationConfirmation.create(authorization.remoteConfirmation),
  })
}

function authorizationKey(input: PublicationTransitionAuthorization | undefined): string {
  const authorization = input ?? {}
  const candidate = authorization.candidateBasis === undefined
    ? undefined
    : CandidateBasis.create(authorization.candidateBasis)
  const remote = authorization.remoteConfirmation === undefined
    ? undefined
    : RemotePublicationConfirmation.create(authorization.remoteConfirmation)
  return JSON.stringify([
    authorization.approvalRequested,
    authorization.verdict,
    authorization.dependencyClosure,
    authorization.activeWork,
    authorization.localIntegrationConfirmed,
    authorization.prOpened,
    authorization.mergeRequested,
    authorization.prMerged,
    candidate?.candidateId,
    candidate?.baseSha,
    candidate?.headSha,
    candidate?.treeHash,
    candidate?.conformanceRunId,
    remote?.candidateId,
    remote?.baseSha,
    remote?.headSha,
    remote?.treeHash,
    remote?.conformanceRunId,
    remote?.evidenceId,
  ])
}

export interface PublicationUnitProgressInput { readonly unitId: string; readonly state: PublicationUnitProgressState }
export class PublicationUnitProgress {
  readonly unitId: string
  readonly state: PublicationUnitProgressState
  private constructor(input: PublicationUnitProgressInput) { this.unitId = token(input.unitId, 'Unit ID'); this.state = input.state; Object.freeze(this) }
  static create(input: PublicationUnitProgressInput): PublicationUnitProgress {
    if (!['ACTIVE', 'PAUSED', 'CANCEL_REQUESTED', 'CANCELLED'].includes(input.state)) throw new PublicationDomainError('INVALID_PUBLICATION_TRANSITION', 'Unit progress state must be known.')
    return new PublicationUnitProgress(input)
  }
}

export interface PublicationTransitionAuthorization {
  readonly approvalRequested?: boolean
  readonly verdict?: 'APPROVED' | 'REJECTED'
  readonly dependencyClosure?: 'CLOSED' | 'OPEN' | 'INVALID'
  readonly activeWork?: boolean
  readonly localIntegrationConfirmed?: boolean
  readonly prOpened?: boolean
  readonly mergeRequested?: boolean
  readonly prMerged?: boolean
  readonly remoteConfirmation?: RemotePublicationConfirmationInput | RemotePublicationConfirmation
  readonly candidateBasis?: CandidateBasisInput | CandidateBasis
}

export interface PublicationTransitionInput {
  readonly target: PublicationStateName | PublicationState
  readonly expectedRevision: number | PublicationRevision
  readonly transitionId: string
  readonly authorization?: PublicationTransitionAuthorization
}

export interface PublicationTransitionRecord {
  readonly transitionId: string
  readonly unitId?: string
  readonly unitState?: PublicationUnitProgressState
  readonly from: PublicationStateName
  readonly to: PublicationStateName
  readonly revision: PublicationRevision
  readonly authorization: Readonly<PublicationTransitionAuthorization>
  readonly authorizationKey: string
}

export interface PublicationTransitionRecordInput {
  readonly transitionId: string
  readonly unitId?: string
  readonly unitState?: PublicationUnitProgressState
  readonly from: PublicationStateName
  readonly to: PublicationStateName
  readonly revision: PublicationRevision | number
  readonly authorization?: PublicationTransitionAuthorization
}

export interface PublicationReconstructionAuthority {
  resolveBasisForRehydration(identity: CanonicalIdentityReference): CandidateBasisInput | CandidateBasis | undefined
  resolveForRehydration(identity: CanonicalIdentityReference): readonly PublicationTransitionRecordInput[] | undefined
}

export interface PublicationRehydrationInput {
  readonly identity: CanonicalIdentityReferenceInput | CanonicalIdentityReference
  readonly basis: CandidateBasisInput | CandidateBasis
  readonly state: PublicationStateName | PublicationState
  readonly revision: PublicationRevision | number
  readonly units?: readonly PublicationUnitProgressInput[]
  readonly transitions?: readonly PublicationTransitionRecordInput[]
}

export interface PublicationCreationInput {
  readonly identity: CanonicalIdentityReferenceInput | CanonicalIdentityReference
  readonly basis: CandidateBasisInput | CandidateBasis
  readonly units?: readonly PublicationUnitProgressInput[]
}

export class Publication {
  readonly identity: CanonicalIdentityReference
  readonly state: PublicationState
  readonly revision: PublicationRevision
  readonly basis: CandidateBasis
  readonly units: readonly PublicationUnitProgress[]
  readonly transitions: readonly PublicationTransitionRecord[]

  private constructor(input: {
    identity: CanonicalIdentityReference
    state: PublicationState
    revision: PublicationRevision
    basis: CandidateBasis
    units: readonly PublicationUnitProgress[]
    transitions: readonly PublicationTransitionRecord[]
  }) {
    this.identity = input.identity
    this.state = input.state
    this.revision = input.revision
    this.basis = input.basis
    this.units = Object.freeze([...input.units])
    this.transitions = Object.freeze([...input.transitions])
    Object.freeze(this)
  }

  static create(input: PublicationCreationInput): Publication {
    const identity = input.identity instanceof CanonicalIdentityReference ? input.identity : CanonicalIdentityReference.create(input.identity)
    if (identity.identity.kind !== 'PUBLICATION') throw new PublicationDomainError('INVALID_PUBLICATION_IDENTITY', 'Publication identity must have kind PUBLICATION.')
    const units = (input.units ?? []).map((unit) => PublicationUnitProgress.create(unit))
    if (new Set(units.map((unit) => unit.unitId)).size !== units.length) throw new PublicationDomainError('INVALID_PUBLICATION_TRANSITION', 'Publication units must be unique.')
    return new Publication({ identity, state: PublicationState.create('PUBLICATION_CANDIDATE_READY'), revision: PublicationRevision.create(0), basis: CandidateBasis.create(input.basis), units, transitions: [] })
  }

  static rehydrate(input: PublicationRehydrationInput, authority: PublicationReconstructionAuthority): Publication {
    if (!authority || typeof authority.resolveForRehydration !== 'function') {
      throw new PublicationDomainError('INVALID_PUBLICATION_TRANSITION', 'Publication rehydration requires accepted transition provenance authority.')
    }
    const identity = input.identity instanceof CanonicalIdentityReference
      ? input.identity
      : CanonicalIdentityReference.create(input.identity)
    if (identity.identity.kind !== 'PUBLICATION') {
      throw new PublicationDomainError('INVALID_PUBLICATION_IDENTITY', 'Publication identity must have kind PUBLICATION.')
    }
    const basis = CandidateBasis.create(input.basis)
    const acceptedBasisInput = authority.resolveBasisForRehydration(identity)
    if (!acceptedBasisInput || !basis.equals(CandidateBasis.create(acceptedBasisInput))) {
      throw new PublicationDomainError('INVALID_PUBLICATION_BASIS', 'Publication basis does not match accepted authority.')
    }
    const state = input.state instanceof PublicationState ? input.state : PublicationState.create(input.state)
    const revision = input.revision instanceof PublicationRevision
      ? input.revision
      : PublicationRevision.create(input.revision)
    const accepted = authority.resolveForRehydration(identity)
    if (!accepted) {
      throw new PublicationDomainError('INVALID_PUBLICATION_TRANSITION', 'Accepted publication transition provenance was not found.')
    }
    if (input.transitions === undefined && (state.value !== PUBLICATION_STATES[0] || revision.value !== 0)) {
      throw new PublicationDomainError('INVALID_PUBLICATION_TRANSITION', 'A non-initial publication state requires complete transition provenance.')
    }
    const supplied = input.transitions ?? []
    if (supplied.length !== accepted.length) {
      throw new PublicationDomainError('INVALID_PUBLICATION_TRANSITION', 'Publication transition provenance does not match accepted authority.')
    }
    let current = Publication.create({ identity, basis, units: input.units })
    supplied.forEach((entry, index) => {
      const expected = accepted[index]
      if (!publicationRecordInputEquals(entry, expected)) {
        throw new PublicationDomainError('INVALID_PUBLICATION_TRANSITION', 'Publication transition provenance does not match accepted authority.')
      }
      const recordRevision = entry.revision instanceof PublicationRevision
        ? entry.revision
        : PublicationRevision.create(entry.revision)
      if (recordRevision.value !== current.revision.value + 1 || entry.from !== current.state.value) {
        throw new PublicationDomainError('INVALID_PUBLICATION_TRANSITION', 'Publication transition provenance must be ordered and continuous.')
      }
      current = entry.unitId === undefined
        ? current.transition({ target: entry.to, expectedRevision: current.revision, transitionId: entry.transitionId, authorization: entry.authorization })
        : current.changeUnitProgress(entry.unitId, entry.unitState as PublicationUnitProgressState, current.revision, entry.transitionId)
      const actual = current.transitions[current.transitions.length - 1]
      if (!actual || !publicationRecordEqualsInput(actual, entry)) {
        throw new PublicationDomainError('INVALID_PUBLICATION_TRANSITION', 'Publication transition provenance does not match the restored state.')
      }
    })
    if (current.state.value !== state.value || current.revision.value !== revision.value) {
      throw new PublicationDomainError('INVALID_PUBLICATION_TRANSITION', 'Publication transition provenance must terminate at the restored state and revision.')
    }
    return current
  }

  transition(input: PublicationTransitionInput): Publication {
    const target = input.target instanceof PublicationState ? input.target : PublicationState.create(input.target)
    const expected = input.expectedRevision instanceof PublicationRevision ? input.expectedRevision : PublicationRevision.create(input.expectedRevision)
    const transitionId = token(input.transitionId, 'Publication transition ID')
    const requestedAuthorizationKey = authorizationKey(input.authorization)
    const previous = this.transitions.find((record) => record.transitionId === transitionId)
    if (previous) {
      if (previous.to !== target.value || previous.unitId !== undefined
        || previous.revision.value - 1 !== expected.value
        || previous.authorizationKey !== requestedAuthorizationKey) {
        throw new PublicationDomainError('INVALID_PUBLICATION_TRANSITION', 'Publication transition ID was reused with different semantics.')
      }
      return this
    }
    if (expected.value !== this.revision.value) throw new PublicationDomainError('PUBLICATION_STALE', `Publication ${this.identity.canonicalKey} has a stale revision.`)
    PublicationStatePolicy.assertAllowed(this.state, target, input.authorization, this.basis)
    const record = Object.freeze({
      transitionId,
      from: this.state.value,
      to: target.value,
      revision: this.revision.next(),
      authorization: snapshotAuthorization(input.authorization),
      authorizationKey: requestedAuthorizationKey,
    })
    return new Publication({ identity: this.identity, state: target, revision: record.revision, basis: this.basis, units: this.units, transitions: [...this.transitions, record] })
  }

  changeUnitProgress(unitId: string, state: PublicationUnitProgressState, expectedRevision: number | PublicationRevision, transitionId: string): Publication {
    const expected = expectedRevision instanceof PublicationRevision ? expectedRevision : PublicationRevision.create(expectedRevision)
    const normalizedUnitId = token(unitId, 'Unit ID')
    const normalizedTransitionId = token(transitionId, 'Publication transition ID')
    const existing = this.transitions.find((record) => record.transitionId === normalizedTransitionId)
    if (existing) {
      if (existing.unitId !== normalizedUnitId || existing.unitState !== state
        || existing.from !== this.state.value || existing.to !== this.state.value
        || existing.revision.value - 1 !== expected.value) {
        throw new PublicationDomainError('INVALID_PUBLICATION_TRANSITION', 'Publication progress transition ID was reused with different semantics.')
      }
      return this
    }
    if (expected.value !== this.revision.value) throw new PublicationDomainError('PUBLICATION_STALE', 'Publication unit progress has a stale revision.')
    const index = this.units.findIndex((unit) => unit.unitId === normalizedUnitId)
    if (index < 0) throw new PublicationDomainError('INVALID_PUBLICATION_TRANSITION', 'Affected publication unit was not found.')
    assertUnitProgressTransition(this.units[index].state, state)
    const nextUnits = [...this.units]
    nextUnits[index] = PublicationUnitProgress.create({ unitId: normalizedUnitId, state })
    const record = Object.freeze({
      transitionId: normalizedTransitionId,
      unitId: normalizedUnitId,
      unitState: state,
      from: this.state.value,
      to: this.state.value,
      revision: this.revision.next(),
      authorization: snapshotAuthorization(undefined),
      authorizationKey: authorizationKey(undefined),
    })
    return new Publication({ identity: this.identity, state: this.state, revision: record.revision, basis: this.basis, units: nextUnits, transitions: [...this.transitions, record] })
  }
}

function publicationRecordInputEquals(
  supplied: PublicationTransitionRecordInput,
  accepted: PublicationTransitionRecordInput,
): boolean {
  const suppliedRevision = supplied.revision instanceof PublicationRevision
    ? supplied.revision
    : PublicationRevision.create(supplied.revision)
  const acceptedRevision = accepted.revision instanceof PublicationRevision
    ? accepted.revision
    : PublicationRevision.create(accepted.revision)
  return supplied.transitionId === accepted.transitionId
    && supplied.unitId === accepted.unitId
    && supplied.unitState === accepted.unitState
    && supplied.from === accepted.from
    && supplied.to === accepted.to
    && suppliedRevision.value === acceptedRevision.value
    && authorizationKey(supplied.authorization) === authorizationKey(accepted.authorization)
}

function publicationRecordEqualsInput(
  actual: PublicationTransitionRecord,
  supplied: PublicationTransitionRecordInput,
): boolean {
  const suppliedRevision = supplied.revision instanceof PublicationRevision
    ? supplied.revision
    : PublicationRevision.create(supplied.revision)
  return actual.transitionId === supplied.transitionId
    && actual.unitId === supplied.unitId
    && actual.unitState === supplied.unitState
    && actual.from === supplied.from
    && actual.to === supplied.to
    && actual.revision.value === suppliedRevision.value
    && actual.authorizationKey === authorizationKey(supplied.authorization)
}

function assertUnitProgressTransition(current: PublicationUnitProgressState, target: PublicationUnitProgressState): void {
  const allowed = current === 'ACTIVE'
    ? target === 'PAUSED' || target === 'CANCEL_REQUESTED'
    : current === 'PAUSED'
      ? target === 'ACTIVE' || target === 'CANCEL_REQUESTED' || target === 'CANCELLED'
      : current === 'CANCEL_REQUESTED'
        ? target === 'CANCELLED'
        : false
  if (!allowed) throw new PublicationDomainError('INVALID_PUBLICATION_TRANSITION', `Unit progress cannot transition from ${current} to ${target}.`)
}

export class PublicationStatePolicy {
  static assertAllowed(current: PublicationState, target: PublicationState, authorization: PublicationTransitionAuthorization | undefined, basis: CandidateBasis): void {
    const auth = authorization ?? {}
    const edge = `${current.value}->${target.value}`
    let allowed = edge === 'PUBLICATION_CANDIDATE_READY->AWAITING_PUBLICATION_APPROVAL'
      ? auth.approvalRequested === true
      : edge === 'AWAITING_PUBLICATION_APPROVAL->LOCAL_INTEGRATION_PENDING'
        ? auth.verdict === 'APPROVED' && auth.dependencyClosure === 'CLOSED' && auth.activeWork === false && !!auth.candidateBasis && CandidateBasis.create(auth.candidateBasis).equals(basis)
        : edge === 'LOCAL_INTEGRATION_PENDING->LOCAL_INTEGRATION_COMPLETE'
          ? auth.localIntegrationConfirmed === true
          : edge === 'LOCAL_INTEGRATION_COMPLETE->PR_OPEN'
            ? auth.prOpened === true
            : edge === 'PR_OPEN->AWAITING_PR_MERGE'
              ? auth.mergeRequested === true
              : edge === 'AWAITING_PR_MERGE->PR_MERGED'
                ? auth.prMerged === true
                : edge === 'PR_MERGED->REMOTE_PUBLICATION_CONFIRMED'
                  ? !!auth.remoteConfirmation && RemotePublicationConfirmation.create(auth.remoteConfirmation).matches(basis)
                  : false
    if (!allowed) throw new PublicationDomainError('INVALID_PUBLICATION_TRANSITION', `Publication cannot transition from ${current.value} to ${target.value} under the supplied gate.`)
  }
}

export interface PublicationRepository {
  find(identity: CanonicalIdentityReference): Publication | undefined
  advance(proposed: Publication, expectedRevision: PublicationRevision): Promise<{ status: 'ADVANCED'; publication: Publication } | { status: 'STALE'; existing: Publication } | { status: 'NOT_FOUND' }>
}
