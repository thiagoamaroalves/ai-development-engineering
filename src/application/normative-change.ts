import {
  CanonicalIdentityReference,
  CanonicalIdentityReferenceInput,
} from '../domain/identity.js'
import {
  ApprovalId,
  DocumentationStage,
  NormativeChangeAuthorityReader,
  NormativeChangeDomainError,
  NormativeChangeInput,
  NormativeChangeRepository,
  NormativeChangeSet,
  NormativeRevision,
  observationsEqual,
} from '../domain/normative-change.js'
import { Ticket, TicketRepository } from '../domain/ticket.js'

export interface NormativeChangeCommand {
  readonly changeId: string
  readonly expectedRevision: number
  readonly sourceRevision: string
  readonly targetRevision: string
  readonly affectedApprovalIds: readonly string[]
  readonly affectedTicketIds: readonly (CanonicalIdentityReferenceInput | CanonicalIdentityReference)[]
  readonly adjustmentId: string
  readonly returnStage: string
}

export interface ForeignAdjustmentReference {
  readonly adjustmentId: string
  readonly sourceRevision: string
  readonly targetRevision: string
  readonly affectedApprovalIds: readonly string[]
  readonly affectedTicketIds: readonly string[]
  readonly returnStage: string
}

export class ForeignAdjustmentReferenceMapper {
  map(change: NormativeChangeSet): ForeignAdjustmentReference {
    const adjustment = change.adjustments[change.adjustments.length - 1]
    if (!adjustment) {
      throw new NormativeChangeDomainError('INVALID_ADJUSTMENT', 'A change result requires adjustment lineage before mapping.')
    }
    return Object.freeze({
      adjustmentId: adjustment.adjustmentId.value,
      sourceRevision: adjustment.sourceRevision.value,
      targetRevision: adjustment.targetRevision.value,
      affectedApprovalIds: adjustment.affectedApprovalIds.map((id) => id.value),
      affectedTicketIds: adjustment.affectedTicketIds.map((id) => id.canonicalKey),
      returnStage: adjustment.returnStage.value,
    })
  }
}

export type NormativeChangeOutcome =
  | {
      readonly status: 'ACCEPTED'
      readonly change: NormativeChangeSet
      readonly adjustmentId: string
      readonly duplicate: boolean
    }
  | { readonly status: 'REJECTED'; readonly reason: string; readonly code: string }

function normalizeIdentity(input: CanonicalIdentityReferenceInput | CanonicalIdentityReference): CanonicalIdentityReference {
  return input instanceof CanonicalIdentityReference ? input : CanonicalIdentityReference.create(input)
}

function commandMatchesObservation(command: NormativeChangeCommand, observation: Parameters<typeof observationsEqual>[0]): boolean {
  const commandTickets = command.affectedTicketIds.map((id) => normalizeIdentity(id).canonicalKey)
  const observedTickets = observation.affectedTicketIds.map((id) => normalizeIdentity(id).canonicalKey)
  return observation.changeId === command.changeId
    && (observation.sourceRevision instanceof NormativeRevision ? observation.sourceRevision.value : observation.sourceRevision) === command.sourceRevision
    && (observation.targetRevision instanceof NormativeRevision ? observation.targetRevision.value : observation.targetRevision) === command.targetRevision
    && JSON.stringify(observation.affectedApprovalIds) === JSON.stringify(command.affectedApprovalIds)
    && JSON.stringify(observedTickets) === JSON.stringify(commandTickets)
    && observation.adjustmentId === command.adjustmentId
    && (observation.returnStage instanceof DocumentationStage ? observation.returnStage.value : observation.returnStage) === command.returnStage
}

export class NormativeChangeHandler {
  constructor(
    private readonly changes: NormativeChangeRepository,
    private readonly authority: NormativeChangeAuthorityReader,
    private readonly tickets: Pick<TicketRepository, 'find'>,
    private readonly mapper: ForeignAdjustmentReferenceMapper = new ForeignAdjustmentReferenceMapper(),
  ) {}

  private reject(error: NormativeChangeDomainError): NormativeChangeOutcome {
    return { status: 'REJECTED', reason: error.message, code: error.code }
  }

  async handle(command: NormativeChangeCommand): Promise<NormativeChangeOutcome> {
    try {
      const current = this.changes.find(command.changeId)
      if (!current) {
        throw new NormativeChangeDomainError('NORMATIVE_CHANGE_NOT_FOUND', `Normative change ${command.changeId} was not found.`)
      }
      if (command.expectedRevision !== current.revision.value) {
        throw new NormativeChangeDomainError('NORMATIVE_CHANGE_STALE', 'Normative change command has a stale revision.')
      }

      const initial = this.authority.observe(command.changeId)
      if (!initial || !commandMatchesObservation(command, initial)) {
        throw new NormativeChangeDomainError('INVALID_NORMATIVE_CHANGE', 'Normative change command does not match canonical authority.')
      }
      const input: NormativeChangeInput = {
        changeId: initial.changeId,
        sourceRevision: initial.sourceRevision,
        targetRevision: initial.targetRevision,
        affectedApprovalIds: [...initial.affectedApprovalIds],
        affectedTicketIds: initial.affectedTicketIds,
        adjustmentId: initial.adjustmentId,
        returnStage: initial.returnStage,
      }
      const result = current.apply(input)
      if (result.duplicate) {
        return { status: 'ACCEPTED', change: result.proposed, adjustmentId: result.lineage.adjustmentId.value, duplicate: true }
      }

      initial.affectedTicketIds.forEach((reference) => {
        const ticketReference = normalizeIdentity(reference)
        if (ticketReference.identity.kind !== 'TICKET') {
          throw new NormativeChangeDomainError('INVALID_ADJUSTMENT', 'Adjustment lineage may reference only canonical tickets.')
        }
        const ticket = this.tickets.find(ticketReference)
        if (!ticket) {
          throw new NormativeChangeDomainError('INVALID_ADJUSTMENT', `Ticket ${ticketReference.canonicalKey} was not found.`)
        }
        // Reading a completed ticket proves terminal preservation; no transition is issued here.
        if (ticket.state.value === 'COMPLETED') return
      })

      const currentObservation = this.authority.observe(command.changeId)
      if (!currentObservation
        || currentObservation.observationId === initial.observationId
        || !observationsEqual(initial, currentObservation)) {
        throw new NormativeChangeDomainError('NORMATIVE_CHANGE_STALE', 'Normative authority changed before invalidation commit.')
      }

      const saved = await this.changes.save(result.proposed, current.revision)
      if (saved.status === 'STALE') {
        throw new NormativeChangeDomainError('NORMATIVE_CHANGE_STALE', 'Normative change has a stale revision.')
      }
      if (saved.status === 'DUPLICATE') {
        return { status: 'ACCEPTED', change: saved.existing, adjustmentId: result.lineage.adjustmentId.value, duplicate: true }
      }
      this.mapper.map(saved.change)
      return { status: 'ACCEPTED', change: saved.change, adjustmentId: result.lineage.adjustmentId.value, duplicate: false }
    } catch (error) {
      return this.reject(error instanceof NormativeChangeDomainError
        ? error
        : new NormativeChangeDomainError('INVALID_NORMATIVE_CHANGE', error instanceof Error ? error.message : 'Normative change was rejected.'))
    }
  }
}

export { ApprovalId }
