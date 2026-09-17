import {
  CanonicalIdentityReference,
  CanonicalIdentityReferenceInput,
} from './identity.js'

export const TICKET_FUNCTIONAL_STATES = Object.freeze([
  'DRAFT',
  'READY',
  'IMPLEMENTED',
  'COMPLETED',
  'BLOCKED',
  'CANCELLED',
] as const)

export type TicketFunctionalStateName = (typeof TICKET_FUNCTIONAL_STATES)[number]

export type TicketErrorCode =
  | 'INVALID_TICKET_IDENTITY'
  | 'INVALID_TICKET_STATE'
  | 'INVALID_TICKET_REVISION'
  | 'INVALID_TICKET_TRANSITION'
  | 'TICKET_STALE'
  | 'TICKET_RECONSTRUCTION_AUTHORITY_REQUIRED'
  | 'TICKET_NOT_FOUND'

export class TicketDomainError extends Error {
  readonly code: TicketErrorCode

  constructor(code: TicketErrorCode, message: string) {
    super(message)
    this.name = 'TicketDomainError'
    this.code = code
  }
}

function requiredToken(value: unknown, label: string): string {
  if (typeof value !== 'string') {
    throw new TicketDomainError('INVALID_TICKET_TRANSITION', `${label} is required.`)
  }
  const normalized = value.trim()
  if (!normalized || /[\r\n]/.test(normalized)) {
    throw new TicketDomainError('INVALID_TICKET_TRANSITION', `${label} must be a non-empty single-line value.`)
  }
  return normalized
}

export class TicketId {
  readonly reference: CanonicalIdentityReference

  private constructor(reference: CanonicalIdentityReference) {
    this.reference = reference
    Object.freeze(this)
  }

  static create(input: CanonicalIdentityReferenceInput | CanonicalIdentityReference): TicketId {
    const reference = input instanceof CanonicalIdentityReference
      ? input
      : CanonicalIdentityReference.create(input)
    if (reference.identity.kind !== 'TICKET') {
      throw new TicketDomainError('INVALID_TICKET_IDENTITY', 'Ticket identity must have kind TICKET.')
    }
    return new TicketId(reference)
  }

  get canonicalKey(): string {
    return this.reference.canonicalKey
  }

  equals(other: TicketId): boolean {
    return this.reference.equals(other.reference)
  }
}

export class TicketFunctionalState {
  readonly value: TicketFunctionalStateName

  private constructor(value: TicketFunctionalStateName) {
    this.value = value
    Object.freeze(this)
  }

  static create(value: unknown): TicketFunctionalState {
    if (typeof value === 'string' && (TICKET_FUNCTIONAL_STATES as readonly string[]).includes(value)) {
      return new TicketFunctionalState(value as TicketFunctionalStateName)
    }
    throw new TicketDomainError('INVALID_TICKET_STATE', 'Ticket functional state must be one of the six canonical states.')
  }

  equals(other: TicketFunctionalState): boolean {
    return this.value === other.value
  }
}

export class TicketRevision {
  readonly value: number

  private constructor(value: number) {
    this.value = value
    Object.freeze(this)
  }

  static create(value: unknown): TicketRevision {
    if (typeof value !== 'number' || !Number.isInteger(value) || value < 0) {
      throw new TicketDomainError('INVALID_TICKET_REVISION', 'Ticket revision must be a non-negative integer.')
    }
    return new TicketRevision(value)
  }

  next(): TicketRevision {
    return new TicketRevision(this.value + 1)
  }

  equals(other: TicketRevision): boolean {
    return this.value === other.value
  }
}

export interface TicketTransitionAuthorization {
  readonly documentationApproved?: boolean
  readonly dependenciesPending?: boolean
  readonly blockerRemoved?: boolean
  readonly cancellationAudited?: boolean
  readonly implementationVerdictApproved?: boolean
  readonly implementationCommitApproved?: boolean
  readonly waveIntegratedAndAudited?: boolean
  readonly finalizationComplete?: boolean
}

function authorizationOf(input: TicketTransitionAuthorization | undefined): Readonly<TicketTransitionAuthorization> {
  return Object.freeze({ ...(input ?? {}) })
}

function authorizationEquals(
  left: Readonly<TicketTransitionAuthorization>,
  right: Readonly<TicketTransitionAuthorization>,
): boolean {
  const keys = new Set<keyof TicketTransitionAuthorization>([
    ...(Object.keys(left) as Array<keyof TicketTransitionAuthorization>),
    ...(Object.keys(right) as Array<keyof TicketTransitionAuthorization>),
  ])
  return [...keys].every((key) => left[key] === right[key])
}

export interface TicketRejectionRecord {
  readonly identity?: CanonicalIdentityReference
  readonly transitionId?: string
  readonly target?: string
  readonly code: TicketErrorCode
  readonly reason: string
}

export interface TicketRejectionRecorder {
  record(rejection: TicketRejectionRecord): void | Promise<void>
}

export interface TicketTransitionRecordInput {
  readonly transitionId: string
  readonly from: TicketFunctionalStateName
  readonly to: TicketFunctionalStateName
  readonly previousRevision: TicketRevision | number
  readonly revision: TicketRevision | number
  readonly authorization?: TicketTransitionAuthorization
}

export class TicketTransitionRecord {
  readonly transitionId: string
  readonly from: TicketFunctionalStateName
  readonly to: TicketFunctionalStateName
  readonly previousRevision: TicketRevision
  readonly revision: TicketRevision
  readonly authorization: Readonly<TicketTransitionAuthorization>

  private constructor(input: {
    transitionId: string
    from: TicketFunctionalStateName
    to: TicketFunctionalStateName
    previousRevision: TicketRevision
    revision: TicketRevision
    authorization: Readonly<TicketTransitionAuthorization>
  }) {
    this.transitionId = input.transitionId
    this.from = input.from
    this.to = input.to
    this.previousRevision = input.previousRevision
    this.revision = input.revision
    this.authorization = input.authorization
    Object.freeze(this)
  }

  static create(input: TicketTransitionRecordInput): TicketTransitionRecord {
    const from = TicketFunctionalState.create(input.from)
    const to = TicketFunctionalState.create(input.to)
    const previousRevision = input.previousRevision instanceof TicketRevision
      ? input.previousRevision
      : TicketRevision.create(input.previousRevision)
    const revision = input.revision instanceof TicketRevision
      ? input.revision
      : TicketRevision.create(input.revision)
    return new TicketTransitionRecord({
      transitionId: requiredToken(input.transitionId, 'Transition ID'),
      from: from.value,
      to: to.value,
      previousRevision,
      revision,
      authorization: authorizationOf(input.authorization),
    })
  }
}

export interface TicketTransitionInput {
  readonly target: TicketFunctionalStateName | TicketFunctionalState
  readonly expectedRevision: TicketRevision | number
  readonly transitionId: string
  readonly authorization?: TicketTransitionAuthorization
}

export interface TicketTransition {
  readonly previous: Ticket
  readonly proposed: Ticket
  readonly expectedRevision: TicketRevision
  readonly record: TicketTransitionRecord
  readonly duplicate: boolean
}

export class TicketTransitionPolicy {
  static assertAllowed(
    current: TicketFunctionalState,
    target: TicketFunctionalState,
    authorization: TicketTransitionAuthorization | undefined,
  ): void {
    const auth = authorization ?? {}
    const edge = `${current.value}->${target.value}`
    const allowed = edge === 'DRAFT->READY'
      ? auth.documentationApproved === true && auth.dependenciesPending === false
      : edge === 'DRAFT->BLOCKED'
        ? auth.documentationApproved === true && auth.dependenciesPending === true
        : edge === 'DRAFT->CANCELLED'
          ? auth.cancellationAudited === true
          : edge === 'BLOCKED->READY'
            ? auth.blockerRemoved === true
            : edge === 'BLOCKED->CANCELLED'
              ? auth.cancellationAudited === true
              : edge === 'READY->IMPLEMENTED'
                ? auth.implementationVerdictApproved === true && auth.implementationCommitApproved === true
                : edge === 'READY->CANCELLED'
                  ? auth.cancellationAudited === true
                  : edge === 'IMPLEMENTED->COMPLETED'
                    ? auth.waveIntegratedAndAudited === true && auth.finalizationComplete === true
                    : false

    if (!allowed) {
      throw new TicketDomainError(
        'INVALID_TICKET_TRANSITION',
        `Ticket cannot transition from ${current.value} to ${target.value} under the supplied authorization.`,
      )
    }
  }
}

export interface TicketCreationInput {
  readonly identity: CanonicalIdentityReferenceInput | CanonicalIdentityReference
  readonly continuationOf?: CanonicalIdentityReferenceInput | CanonicalIdentityReference
}

export interface TicketRehydrationInput {
  readonly identity: CanonicalIdentityReferenceInput | CanonicalIdentityReference
  readonly continuationOf?: CanonicalIdentityReferenceInput | CanonicalIdentityReference
  readonly state: TicketFunctionalStateName
  readonly revision: TicketRevision | number
  readonly transitions?: readonly TicketTransitionRecordInput[]
}

export interface TicketTransitionReconstructionAuthority {
  resolveForRehydration(identity: CanonicalIdentityReference): readonly TicketTransitionRecordInput[] | undefined
}

export class Ticket {
  readonly id: TicketId
  readonly continuationOf?: TicketId
  readonly state: TicketFunctionalState
  readonly revision: TicketRevision
  readonly transitions: readonly TicketTransitionRecord[]

  private constructor(
    id: TicketId,
    state: TicketFunctionalState,
    revision: TicketRevision,
    transitions: readonly TicketTransitionRecord[],
    continuationOf?: TicketId,
  ) {
    this.id = id
    this.continuationOf = continuationOf
    this.state = state
    this.revision = revision
    this.transitions = Object.freeze([...transitions])
    Object.freeze(this)
  }

  static create(input: TicketCreationInput): Ticket {
    const id = TicketId.create(input.identity)
    const continuationOf = input.continuationOf === undefined ? undefined : TicketId.create(input.continuationOf)
    if (continuationOf?.equals(id)) {
      throw new TicketDomainError('INVALID_TICKET_IDENTITY', 'A ticket cannot continue itself.')
    }
    return new Ticket(id, TicketFunctionalState.create('DRAFT'), TicketRevision.create(0), [], continuationOf)
  }

  static rehydrate(
    input: TicketRehydrationInput,
    authority: TicketTransitionReconstructionAuthority,
  ): Ticket {
    if (!authority || typeof authority.resolveForRehydration !== 'function') {
      throw new TicketDomainError(
        'TICKET_RECONSTRUCTION_AUTHORITY_REQUIRED',
        'Ticket rehydration requires accepted transition provenance authority.',
      )
    }

    const id = TicketId.create(input.identity)
    const continuationOf = input.continuationOf === undefined ? undefined : TicketId.create(input.continuationOf)
    if (continuationOf?.equals(id)) {
      throw new TicketDomainError('INVALID_TICKET_IDENTITY', 'A ticket cannot continue itself.')
    }
    const state = TicketFunctionalState.create(input.state)
    const revision = input.revision instanceof TicketRevision
      ? input.revision
      : TicketRevision.create(input.revision)
    const accepted = authority.resolveForRehydration(id.reference)
    if (!accepted) {
      throw new TicketDomainError('TICKET_RECONSTRUCTION_AUTHORITY_REQUIRED', 'Accepted ticket transition provenance was not found.')
    }
    if (input.transitions === undefined && (state.value !== 'DRAFT' || revision.value !== 0)) {
      throw new TicketDomainError('INVALID_TICKET_TRANSITION', 'A non-initial ticket state requires complete transition provenance.')
    }
    const supplied = input.transitions ?? []
    if (supplied.length !== accepted.length) {
      throw new TicketDomainError('INVALID_TICKET_TRANSITION', 'Ticket transition provenance does not match accepted authority.')
    }

    let current = TicketFunctionalState.create('DRAFT')
    let currentRevision = TicketRevision.create(0)
    const records: TicketTransitionRecord[] = []
    const seen = new Set<string>()
    supplied.forEach((entry) => {
      const record = TicketTransitionRecord.create(entry)
      if (seen.has(record.transitionId)
        || record.from !== current.value
        || record.previousRevision.value !== currentRevision.value
        || record.revision.value !== currentRevision.value + 1) {
        throw new TicketDomainError('INVALID_TICKET_TRANSITION', 'Ticket transition provenance must be ordered and continuous.')
      }
      TicketTransitionPolicy.assertAllowed(current, TicketFunctionalState.create(record.to), record.authorization)
      seen.add(record.transitionId)
      records.push(record)
      current = TicketFunctionalState.create(record.to)
      currentRevision = record.revision
    })

    if (!current.equals(state) || !currentRevision.equals(revision)) {
      throw new TicketDomainError('INVALID_TICKET_TRANSITION', 'Ticket transition provenance must terminate at the restored state and revision.')
    }

    supplied.forEach((entry, index) => {
      const expected = TicketTransitionRecord.create(accepted[index])
      const actual = records[index]
      if (expected.transitionId !== actual.transitionId
        || expected.from !== actual.from
        || expected.to !== actual.to
        || expected.previousRevision.value !== actual.previousRevision.value
        || expected.revision.value !== actual.revision.value
        || !authorizationEquals(expected.authorization, actual.authorization)) {
        throw new TicketDomainError('INVALID_TICKET_TRANSITION', 'Ticket transition provenance does not match accepted authority.')
      }
    })

    return new Ticket(id, state, revision, records, continuationOf)
  }

  transition(input: TicketTransitionInput): TicketTransition {
    const expectedRevision = input.expectedRevision instanceof TicketRevision
      ? input.expectedRevision
      : TicketRevision.create(input.expectedRevision)
    const transitionId = requiredToken(input.transitionId, 'Transition ID')
    const target = input.target instanceof TicketFunctionalState
      ? input.target
      : TicketFunctionalState.create(input.target)
    const existing = this.transitions.find((record) => record.transitionId === transitionId)
    if (existing) {
      if (existing.to !== target.value || existing.previousRevision.value !== expectedRevision.value) {
        throw new TicketDomainError('INVALID_TICKET_TRANSITION', 'A reused transition ID has different semantics.')
      }
      return Object.freeze({ previous: this, proposed: this, expectedRevision, record: existing, duplicate: true })
    }
    if (!this.revision.equals(expectedRevision)) {
      throw new TicketDomainError('TICKET_STALE', `Ticket ${this.id.canonicalKey} has a stale revision.`)
    }

    TicketTransitionPolicy.assertAllowed(this.state, target, input.authorization)
    const record = TicketTransitionRecord.create({
      transitionId,
      from: this.state.value,
      to: target.value,
      previousRevision: this.revision,
      revision: this.revision.next(),
      authorization: input.authorization,
    })
    const proposed = new Ticket(this.id, target, record.revision, [...this.transitions, record], this.continuationOf)
    return Object.freeze({
      previous: this,
      proposed,
      expectedRevision,
      record,
      duplicate: false,
    })
  }
}

export interface TicketAdvanceAccepted {
  readonly status: 'ADVANCED'
  readonly ticket: Ticket
}

export interface TicketAdvanceStale {
  readonly status: 'STALE'
  readonly existing: Ticket
}

export interface TicketAdvanceNotFound {
  readonly status: 'NOT_FOUND'
}

export type TicketAdvanceResult = TicketAdvanceAccepted | TicketAdvanceStale | TicketAdvanceNotFound

export interface TicketRepository {
  find(identity: CanonicalIdentityReference): Ticket | undefined
  advance(proposed: Ticket, expectedRevision: TicketRevision): Promise<TicketAdvanceResult>
}
