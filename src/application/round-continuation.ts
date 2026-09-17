import {
  CanonicalIdentityReference,
  CanonicalIdentityReferenceInput,
} from '../domain/identity.js'
import {
  RoundContinuationAuthorization,
  RoundContinuationCommand,
  RoundContinuationDomainError,
  RoundContinuationRepository,
  RoundCycleReader,
  RoundLimit,
  RoundLimitDecision,
  RoundLimitPolicy,
  RoundUnitReference,
  continuationAuthorizationFrom,
} from '../domain/round-continuation.js'

export interface ExecRoundSchedulingDecision {
  readonly cycle: CanonicalIdentityReference
  readonly unit: CanonicalIdentityReference
  readonly round: number
  readonly action: 'CONTINUE' | 'PAUSE_AFFECTED_UNIT'
  readonly authorizationId?: string
}

export class ExecRoundDecisionMapper {
  map(decision: RoundLimitDecision, authorization?: RoundContinuationAuthorization): ExecRoundSchedulingDecision {
    if (authorization && !authorization.cycle.equals(decision.cycle)) {
      throw new RoundContinuationDomainError('INVALID_ROUND_UNIT', 'Continuation authorization does not match the round decision cycle.')
    }
    if (authorization && !authorization.unit.reference.equals(decision.unit.reference)) {
      throw new RoundContinuationDomainError('INVALID_ROUND_UNIT', 'Continuation authorization does not match the round decision unit.')
    }
    if (authorization && decision.decision !== 'PAUSE_AFFECTED_UNIT') {
      throw new RoundContinuationDomainError('INVALID_ROUND_POLICY', 'Continuation authorization requires a pause-at-limit decision.')
    }

    return Object.freeze({
      cycle: decision.cycle,
      unit: decision.unit.reference,
      round: authorization?.nextRound.value ?? decision.currentRound.value,
      action: authorization ? 'CONTINUE' : decision.decision,
      authorizationId: authorization?.authorizationId,
    })
  }
}

export type RoundContinuationOutcome =
  | {
      readonly status: 'ACCEPTED'
      readonly authorization: RoundContinuationAuthorization
      readonly decision: RoundLimitDecision
      readonly duplicate: boolean
    }
  | { readonly status: 'REJECTED'; readonly reason: string; readonly code: string }

export class RoundContinuationHandler {
  constructor(
    private readonly cycles: RoundCycleReader,
    private readonly continuations: RoundContinuationRepository,
    private readonly mapper: ExecRoundDecisionMapper = new ExecRoundDecisionMapper(),
  ) {}

  private reject(error: RoundContinuationDomainError): RoundContinuationOutcome {
    return { status: 'REJECTED', reason: error.message, code: error.code }
  }

  async authorize(command: RoundContinuationCommand): Promise<RoundContinuationOutcome> {
    try {
      const cycle = command.cycle instanceof CanonicalIdentityReference
        ? command.cycle
        : CanonicalIdentityReference.create(command.cycle)
      const unit = command.unit instanceof CanonicalIdentityReference
        ? command.unit
        : CanonicalIdentityReference.create(command.unit)
      const unitReference = RoundUnitReference.create({ cycle, unit })
      const current = this.cycles.find(cycle)
      if (!current) {
        throw new RoundContinuationDomainError('ROUND_CYCLE_NOT_FOUND', `Audit cycle ${cycle.canonicalKey} was not found.`)
      }
      if (command.expectedCycleRevision !== current.revision.value) {
        throw new RoundContinuationDomainError('ROUND_STALE', 'Round continuation command has a stale cycle revision.')
      }

      const decision = RoundLimitPolicy.assertContinuationAllowed(
        current,
        unitReference,
        command.currentRound,
        RoundLimit.create(command.limit),
      )
      const reobserved = this.cycles.find(cycle)
      if (!reobserved
        || !reobserved.id.reference.equals(current.id.reference)
        || reobserved.artifactRevision.value !== current.artifactRevision.value
        || reobserved.revision.value !== current.revision.value
        || reobserved.rounds.length !== current.rounds.length) {
        throw new RoundContinuationDomainError('ROUND_STALE', 'Round cycle changed before continuation authorization.')
      }
      const authorization = continuationAuthorizationFrom(command, current.revision)
      const existing = this.continuations.find(command.authorizationId)
      if (existing) {
        if (command.expectedCycleRevision !== current.revision.value || !existing.sameSemantics(authorization)) {
          throw new RoundContinuationDomainError('ROUND_CONTINUATION_CONFLICT', 'Continuation authorization ID was reused with different or stale semantics.')
        }
        return {
          status: 'ACCEPTED',
          authorization: existing,
          decision,
          duplicate: true,
        }
      }

      const result = await this.continuations.reserve(authorization, current.revision)
      if (result.status === 'STALE') {
        throw new RoundContinuationDomainError('ROUND_STALE', 'Round continuation has a stale cycle revision.')
      }
      if (result.status === 'DUPLICATE') {
        if (!result.existing.sameSemantics(authorization)) {
          throw new RoundContinuationDomainError('ROUND_CONTINUATION_CONFLICT', 'Continuation authorization was concurrently reused with different semantics.')
        }
        return {
          status: 'ACCEPTED',
          authorization: result.existing,
          decision,
          duplicate: true,
        }
      }

      return {
        status: 'ACCEPTED',
        authorization: result.authorization,
        decision,
        duplicate: false,
      }
    } catch (error) {
      return this.reject(error instanceof RoundContinuationDomainError
        ? error
        : new RoundContinuationDomainError('INVALID_ROUND_POLICY', error instanceof Error ? error.message : 'Round continuation was rejected.'))
    }
  }

  schedulingDecision(
    decision: RoundLimitDecision,
    authorization?: RoundContinuationAuthorization,
  ): ExecRoundSchedulingDecision {
    return this.mapper.map(decision, authorization)
  }
}

export interface RoundDecisionCommand {
  readonly cycle: CanonicalIdentityReferenceInput | CanonicalIdentityReference
  readonly unit: CanonicalIdentityReferenceInput | CanonicalIdentityReference
  readonly currentRound: number
  readonly limit?: number
}

export function decideRound(command: RoundDecisionCommand): RoundLimitDecision {
  const cycle = command.cycle instanceof CanonicalIdentityReference
    ? command.cycle
    : CanonicalIdentityReference.create(command.cycle)
  const unit = RoundUnitReference.create({ cycle, unit: command.unit })
  return RoundLimitPolicy.decide(cycle, unit, command.currentRound, RoundLimit.create(command.limit))
}
