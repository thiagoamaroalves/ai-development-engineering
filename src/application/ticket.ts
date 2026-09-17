import {
  CanonicalIdentityReference,
  CanonicalIdentityReferenceInput,
} from '../domain/identity.js'
import {
  Ticket,
  TicketAdvanceResult,
  TicketDomainError,
  TicketErrorCode,
  TicketFunctionalState,
  TicketFunctionalStateName,
  TicketRepository,
  TicketRejectionRecorder,
  TicketTransitionAuthorization,
} from '../domain/ticket.js'

export interface TicketTransitionCommand {
  readonly identity: CanonicalIdentityReferenceInput | CanonicalIdentityReference
  readonly target: TicketFunctionalStateName
  readonly expectedRevision: number
  readonly transitionId: string
  readonly authorization?: TicketTransitionAuthorization
}

export type TicketTransitionOutcome =
  | { readonly status: 'ACCEPTED'; readonly ticket: Ticket; readonly duplicate: boolean }
  | { readonly status: 'REJECTED'; readonly reason: string; readonly code: string }

export class TicketTransitionHandler {
  constructor(
    private readonly tickets: TicketRepository,
    private readonly rejections: TicketRejectionRecorder,
  ) {}

  private async reject(
    command: TicketTransitionCommand,
    identity: CanonicalIdentityReference | undefined,
    code: TicketErrorCode,
    reason: string,
  ): Promise<TicketTransitionOutcome> {
    await this.rejections.record(Object.freeze({
      identity,
      transitionId: typeof command.transitionId === 'string' ? command.transitionId : undefined,
      target: typeof command.target === 'string' ? command.target : undefined,
      code,
      reason,
    }))
    return { status: 'REJECTED', reason, code }
  }

  async handle(command: TicketTransitionCommand): Promise<TicketTransitionOutcome> {
    let identity: CanonicalIdentityReference | undefined
    try {
      identity = command.identity instanceof CanonicalIdentityReference
        ? command.identity
        : CanonicalIdentityReference.create(command.identity)
      if (identity.identity.kind !== 'TICKET') {
        throw new TicketDomainError('INVALID_TICKET_IDENTITY', 'Ticket identity must have kind TICKET.')
      }
      const current = this.tickets.find(identity)
      if (!current) {
        const reason = `Ticket ${identity.canonicalKey} was not found.`
        return this.reject(command, identity, 'TICKET_NOT_FOUND', reason)
      }
      const transition = current.transition({
        target: TicketFunctionalState.create(command.target),
        expectedRevision: command.expectedRevision,
        transitionId: command.transitionId,
        authorization: command.authorization,
      })
      if (transition.duplicate) {
        return { status: 'ACCEPTED', ticket: transition.proposed, duplicate: true }
      }
      const result: TicketAdvanceResult = await this.tickets.advance(transition.proposed, transition.expectedRevision)
      if (result.status === 'STALE') {
        const reason = `Ticket ${identity.canonicalKey} has a stale revision.`
        return this.reject(command, identity, 'TICKET_STALE', reason)
      }
      if (result.status === 'NOT_FOUND') {
        const reason = `Ticket ${identity.canonicalKey} was not found.`
        return this.reject(command, identity, 'TICKET_NOT_FOUND', reason)
      }
      return { status: 'ACCEPTED', ticket: result.ticket, duplicate: false }
    } catch (error) {
      const domainError = error instanceof TicketDomainError
        ? error
        : new TicketDomainError('INVALID_TICKET_TRANSITION', error instanceof Error ? error.message : 'Ticket transition was rejected.')
      return this.reject(command, identity, domainError.code, domainError.message)
    }
  }
}
