import { CanonicalIdentityReference, CanonicalIdentityReferenceInput } from '../domain/identity.js'
import { AuditCycle, AuditCycleDomainError, AuditCycleRepository, AuditRoundInput, StructuredVerdictInput } from '../domain/audit-cycle.js'

export type AuditCycleCommand =
  | { readonly kind: 'APPEND_ROUND'; readonly identity: CanonicalIdentityReferenceInput | CanonicalIdentityReference; readonly expectedRevision: number; readonly round: AuditRoundInput }
  | { readonly kind: 'CLOSE'; readonly identity: CanonicalIdentityReferenceInput | CanonicalIdentityReference; readonly expectedRevision: number; readonly verdict: StructuredVerdictInput }

export type AuditCycleOutcome =
  | { readonly status: 'ACCEPTED'; readonly cycle: AuditCycle }
  | { readonly status: 'REJECTED'; readonly reason: string; readonly code: string }

export interface ExecAuditEvidence {
  readonly ordinal: number
  readonly auditorEvidenceId: string
  readonly remediationEvidenceId?: string
}

export class ExecAuditEvidenceMapper {
  map(evidence: ExecAuditEvidence): AuditRoundInput {
    return Object.freeze({
      ordinal: evidence.ordinal,
      auditorEvidenceId: evidence.auditorEvidenceId,
      remediationEvidenceId: evidence.remediationEvidenceId,
    })
  }
}

export class AuditCycleCommandHandler {
  constructor(private readonly cycles: AuditCycleRepository) {}

  async handle(command: AuditCycleCommand): Promise<AuditCycleOutcome> {
    try {
      const identity = command.identity instanceof CanonicalIdentityReference ? command.identity : CanonicalIdentityReference.create(command.identity)
      if (identity.identity.kind !== 'ARTIFACT_CYCLE') {
        throw new AuditCycleDomainError('INVALID_AUDIT_CYCLE_IDENTITY', 'Audit cycle identity must have kind ARTIFACT_CYCLE.')
      }
      const current = this.cycles.find(identity)
      if (!current) return { status: 'REJECTED', reason: `Audit cycle ${identity.canonicalKey} was not found.`, code: 'AUDIT_CYCLE_NOT_FOUND' }
      const proposed = command.kind === 'APPEND_ROUND' ? current.appendRound(command.round) : current.close(command.verdict)
      if (proposed === current) {
        if (command.expectedRevision !== current.revision.value) {
          throw new AuditCycleDomainError('AUDIT_CYCLE_STALE', 'Audit cycle command has a stale revision.')
        }
        return { status: 'ACCEPTED', cycle: current }
      }
      const result = await this.cycles.save(proposed, command.expectedRevision)
      if (result.status === 'STALE') return { status: 'REJECTED', reason: 'Audit cycle has a stale revision.', code: 'AUDIT_CYCLE_STALE' }
      if (result.status === 'NOT_FOUND') return { status: 'REJECTED', reason: 'Audit cycle was not found.', code: 'AUDIT_CYCLE_NOT_FOUND' }
      return { status: 'ACCEPTED', cycle: result.cycle }
    } catch (error) {
      const domainError = error instanceof AuditCycleDomainError ? error : new AuditCycleDomainError('INVALID_AUDIT_VERDICT', error instanceof Error ? error.message : 'Audit cycle command rejected.')
      return { status: 'REJECTED', reason: domainError.message, code: domainError.code }
    }
  }
}
