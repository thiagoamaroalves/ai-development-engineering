import {
  AuditCycle,
  AuditCycleRevision,
  RoundOrdinal,
} from './audit-cycle.js'
import {
  CanonicalIdentityReference,
  CanonicalIdentityReferenceInput,
} from './identity.js'

export type RoundDecision = 'CONTINUE' | 'PAUSE_AFFECTED_UNIT'
export type RoundContinuationErrorCode =
  | 'INVALID_ROUND_LIMIT'
  | 'INVALID_ROUND_UNIT'
  | 'INVALID_ROUND_POLICY'
  | 'ROUND_CYCLE_NOT_FOUND'
  | 'ROUND_STALE'
  | 'ROUND_CONTINUATION_CONFLICT'

export class RoundContinuationDomainError extends Error {
  readonly code: RoundContinuationErrorCode

  constructor(code: RoundContinuationErrorCode, message: string) {
    super(message)
    this.name = 'RoundContinuationDomainError'
    this.code = code
  }
}

function token(value: unknown, label: string): string {
  if (typeof value !== 'string' || !value.trim() || /[\r\n]/.test(value)) {
    throw new RoundContinuationDomainError('INVALID_ROUND_POLICY', `${label} must be a non-empty single-line value.`)
  }
  return value.trim()
}

export class RoundLimit {
  readonly value: number

  private constructor(value: number) {
    this.value = value
    Object.freeze(this)
  }

  static create(value: unknown = 10): RoundLimit {
    if (typeof value !== 'number' || !Number.isInteger(value) || value < 1) {
      throw new RoundContinuationDomainError('INVALID_ROUND_LIMIT', 'Round limit must be a positive integer.')
    }
    return new RoundLimit(value)
  }

  equals(other: RoundLimit): boolean {
    return this.value === other.value
  }
}

export class RoundUnitReference {
  readonly reference: CanonicalIdentityReference
  readonly cycle: CanonicalIdentityReference

  private constructor(reference: CanonicalIdentityReference, cycle: CanonicalIdentityReference) {
    this.reference = reference
    this.cycle = cycle
    Object.freeze(this)
  }

  static create(input: {
    readonly cycle: CanonicalIdentityReferenceInput | CanonicalIdentityReference
    readonly unit: CanonicalIdentityReferenceInput | CanonicalIdentityReference
  }): RoundUnitReference {
    const cycle = input.cycle instanceof CanonicalIdentityReference
      ? input.cycle
      : CanonicalIdentityReference.create(input.cycle)
    const unit = input.unit instanceof CanonicalIdentityReference
      ? input.unit
      : CanonicalIdentityReference.create(input.unit)

    if (cycle.identity.kind !== 'ARTIFACT_CYCLE' || unit.identity.kind !== 'ACTIVITY') {
      throw new RoundContinuationDomainError(
        'INVALID_ROUND_UNIT',
        'Round continuation requires an ARTIFACT_CYCLE and ACTIVITY identity.',
      )
    }
    if (!unit.identity.scope.equals(cycle.identity.scope)) {
      throw new RoundContinuationDomainError(
        'INVALID_ROUND_UNIT',
        'Round unit must belong to the same execution scope as its cycle.',
      )
    }

    return new RoundUnitReference(unit, cycle)
  }

  get canonicalKey(): string {
    return `${this.cycle.canonicalKey}|unit=${this.reference.canonicalKey}`
  }

  equals(other: RoundUnitReference): boolean {
    return this.cycle.equals(other.cycle) && this.reference.equals(other.reference)
  }
}

export class RoundLimitDecision {
  readonly cycle: CanonicalIdentityReference
  readonly unit: RoundUnitReference
  readonly currentRound: RoundOrdinal
  readonly limit: RoundLimit
  readonly decision: RoundDecision

  private constructor(input: {
    readonly cycle: CanonicalIdentityReference
    readonly unit: RoundUnitReference
    readonly currentRound: RoundOrdinal
    readonly limit: RoundLimit
    readonly decision: RoundDecision
  }) {
    this.cycle = input.cycle
    this.unit = input.unit
    this.currentRound = input.currentRound
    this.limit = input.limit
    this.decision = input.decision
    Object.freeze(this)
  }

  static create(input: {
    readonly cycle: CanonicalIdentityReference
    readonly unit: RoundUnitReference
    readonly currentRound: RoundOrdinal
    readonly limit: RoundLimit
    readonly decision: RoundDecision
  }): RoundLimitDecision {
    if (!input.unit.cycle.equals(input.cycle)) {
      throw new RoundContinuationDomainError('INVALID_ROUND_UNIT', 'Round decision cycle and unit cycle must match.')
    }
    if (input.currentRound.value > input.limit.value) {
      throw new RoundContinuationDomainError('INVALID_ROUND_POLICY', 'A round beyond the configured limit requires explicit continuation authorization.')
    }
    const expectedDecision = input.currentRound.value === input.limit.value
      ? 'PAUSE_AFFECTED_UNIT'
      : 'CONTINUE'
    if (input.decision !== expectedDecision) {
      throw new RoundContinuationDomainError('INVALID_ROUND_POLICY', 'Round decision does not match the configured limit.')
    }
    return new RoundLimitDecision(input)
  }
}

export class RoundLimitPolicy {
  static decide(
    cycle: CanonicalIdentityReference,
    unit: RoundUnitReference | CanonicalIdentityReference | CanonicalIdentityReferenceInput,
    currentRound: RoundOrdinal | number,
    limit: RoundLimit | number = RoundLimit.create(),
  ): RoundLimitDecision {
    const normalizedCycle = CanonicalIdentityReference.create(cycle)
    const normalizedUnit = unit instanceof RoundUnitReference ? unit : RoundUnitReference.create({ cycle: normalizedCycle, unit })
    const normalizedRound = currentRound instanceof RoundOrdinal ? currentRound : RoundOrdinal.create(currentRound)
    const normalizedLimit = limit instanceof RoundLimit ? limit : RoundLimit.create(limit)

    if (!normalizedUnit.cycle.equals(normalizedCycle)) {
      throw new RoundContinuationDomainError('INVALID_ROUND_UNIT', 'Round unit does not belong to the requested cycle.')
    }
    if (normalizedRound.value > normalizedLimit.value) {
      throw new RoundContinuationDomainError('INVALID_ROUND_POLICY', 'A round beyond the configured limit requires explicit continuation authorization.')
    }

    return RoundLimitDecision.create({
      cycle: normalizedCycle,
      unit: normalizedUnit,
      currentRound: normalizedRound,
      limit: normalizedLimit,
      decision: normalizedRound.value === normalizedLimit.value ? 'PAUSE_AFFECTED_UNIT' : 'CONTINUE',
    })
  }

  static assertContinuationAllowed(
    cycle: AuditCycle,
    unit: RoundUnitReference,
    currentRound: RoundOrdinal | number,
    limit: RoundLimit | number,
  ): RoundLimitDecision {
    const decision = RoundLimitPolicy.decide(cycle.id.reference, unit, currentRound, limit)
    if (decision.decision !== 'PAUSE_AFFECTED_UNIT') {
      throw new RoundContinuationDomainError(
        'INVALID_ROUND_POLICY',
        'Continuation authorization is valid only for the affected unit at the configured round limit.',
      )
    }
    if (decision.currentRound.value !== cycle.rounds.length) {
      throw new RoundContinuationDomainError(
        'INVALID_ROUND_POLICY',
        'Continuation must authorize the latest recorded audit round.',
      )
    }
    return decision
  }
}

export class RoundContinuationRevision {
  readonly value: number

  private constructor(value: number) {
    this.value = value
    Object.freeze(this)
  }

  static create(value: unknown = 0): RoundContinuationRevision {
    if (typeof value !== 'number' || !Number.isInteger(value) || value < 0) {
      throw new RoundContinuationDomainError('INVALID_ROUND_POLICY', 'Continuation revision must be a non-negative integer.')
    }
    return new RoundContinuationRevision(value)
  }

  next(): RoundContinuationRevision {
    return new RoundContinuationRevision(this.value + 1)
  }

  equals(other: RoundContinuationRevision): boolean {
    return this.value === other.value
  }
}

export interface RoundContinuationAuthorizationInput {
  readonly authorizationId: string
  readonly cycle: CanonicalIdentityReferenceInput | CanonicalIdentityReference
  readonly unit: CanonicalIdentityReferenceInput | CanonicalIdentityReference
  readonly pausedRound: number | RoundOrdinal
  readonly nextRound: number | RoundOrdinal
  readonly cycleRevision: number | AuditCycleRevision
  readonly revision?: number | RoundContinuationRevision
}

export class RoundContinuationAuthorization {
  readonly authorizationId: string
  readonly unit: RoundUnitReference
  readonly pausedRound: RoundOrdinal
  readonly nextRound: RoundOrdinal
  readonly cycleRevision: AuditCycleRevision
  readonly revision: RoundContinuationRevision

  private constructor(input: {
    readonly authorizationId: string
    readonly unit: RoundUnitReference
    readonly pausedRound: RoundOrdinal
    readonly nextRound: RoundOrdinal
    readonly cycleRevision: AuditCycleRevision
    readonly revision: RoundContinuationRevision
  }) {
    this.authorizationId = input.authorizationId
    this.unit = input.unit
    this.pausedRound = input.pausedRound
    this.nextRound = input.nextRound
    this.cycleRevision = input.cycleRevision
    this.revision = input.revision
    Object.freeze(this)
  }

  static create(input: RoundContinuationAuthorizationInput): RoundContinuationAuthorization {
    const unit = RoundUnitReference.create({ cycle: input.cycle, unit: input.unit })
    const pausedRound = input.pausedRound instanceof RoundOrdinal ? input.pausedRound : RoundOrdinal.create(input.pausedRound)
    const nextRound = input.nextRound instanceof RoundOrdinal ? input.nextRound : RoundOrdinal.create(input.nextRound)
    if (nextRound.value !== pausedRound.value + 1) {
      throw new RoundContinuationDomainError('INVALID_ROUND_POLICY', 'Continuation must authorize exactly the next round.')
    }
    const cycleRevision = input.cycleRevision instanceof AuditCycleRevision
      ? input.cycleRevision
      : AuditCycleRevision.create(input.cycleRevision)
    const revision = input.revision instanceof RoundContinuationRevision
      ? input.revision
      : RoundContinuationRevision.create(input.revision)

    return new RoundContinuationAuthorization({
      authorizationId: token(input.authorizationId, 'Continuation authorization ID'),
      unit,
      pausedRound,
      nextRound,
      cycleRevision,
      revision,
    })
  }

  get cycle(): CanonicalIdentityReference {
    return this.unit.cycle
  }

  get canonicalKey(): string {
    return `${this.authorizationId}|${this.unit.canonicalKey}|paused=${this.pausedRound.value}|next=${this.nextRound.value}|cycle-revision=${this.cycleRevision.value}`
  }

  sameSemantics(other: RoundContinuationAuthorization): boolean {
    return this.authorizationId === other.authorizationId
      && this.unit.equals(other.unit)
      && this.pausedRound.value === other.pausedRound.value
      && this.nextRound.value === other.nextRound.value
      && this.cycleRevision.value === other.cycleRevision.value
  }
}

export interface RoundContinuationRepository {
  find(authorizationId: string): RoundContinuationAuthorization | undefined
  reserve(
    authorization: RoundContinuationAuthorization,
    expectedCycleRevision: AuditCycleRevision,
  ): Promise<
    | { readonly status: 'ADVANCED'; readonly authorization: RoundContinuationAuthorization }
    | { readonly status: 'STALE'; readonly existing?: RoundContinuationAuthorization }
    | { readonly status: 'DUPLICATE'; readonly existing: RoundContinuationAuthorization }
  >
}

export interface RoundCycleReader {
  find(identity: CanonicalIdentityReference): AuditCycle | undefined
}

export interface RoundContinuationCommand {
  readonly authorizationId: string
  readonly cycle: CanonicalIdentityReferenceInput | CanonicalIdentityReference
  readonly unit: CanonicalIdentityReferenceInput | CanonicalIdentityReference
  readonly currentRound: number
  readonly expectedCycleRevision: number
  readonly limit?: number
}

export function continuationAuthorizationFrom(
  command: RoundContinuationCommand,
  cycleRevision: AuditCycleRevision,
): RoundContinuationAuthorization {
  const pausedRound = RoundOrdinal.create(command.currentRound)
  return RoundContinuationAuthorization.create({
    authorizationId: command.authorizationId,
    cycle: command.cycle,
    unit: command.unit,
    pausedRound,
    nextRound: pausedRound.next(),
    cycleRevision,
  })
}
