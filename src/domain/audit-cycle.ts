import { CanonicalIdentityReference, CanonicalIdentityReferenceInput } from './identity.js'

export type AuditCycleStatusName = 'OPEN' | 'CLOSED'
export type AuditVerdictResult = 'CONFORMANT' | 'REMEDIATION_REQUIRED'
export type AuditCycleErrorCode =
  | 'INVALID_AUDIT_CYCLE_IDENTITY'
  | 'INVALID_AUDIT_CYCLE_REFERENCE'
  | 'INVALID_AUDIT_ROUND'
  | 'INVALID_AUDIT_VERDICT'
  | 'AUDIT_CYCLE_CLOSED'
  | 'AUDIT_CYCLE_STALE'
  | 'AUDIT_CYCLE_RECONSTRUCTION_AUTHORITY_REQUIRED'

export class AuditCycleDomainError extends Error {
  readonly code: AuditCycleErrorCode
  constructor(code: AuditCycleErrorCode, message: string) { super(message); this.name = 'AuditCycleDomainError'; this.code = code }
}

function token(value: unknown, label: string): string {
  if (typeof value !== 'string' || !value.trim() || /[\r\n]/.test(value)) throw new AuditCycleDomainError('INVALID_AUDIT_CYCLE_REFERENCE', `${label} must be a non-empty single-line value.`)
  return value.trim()
}

export class ArtifactCycleId {
  readonly reference: CanonicalIdentityReference
  private constructor(reference: CanonicalIdentityReference) { this.reference = reference; Object.freeze(this) }
  static create(input: CanonicalIdentityReferenceInput | CanonicalIdentityReference): ArtifactCycleId {
    const reference = input instanceof CanonicalIdentityReference ? input : CanonicalIdentityReference.create(input)
    if (reference.identity.kind !== 'ARTIFACT_CYCLE') throw new AuditCycleDomainError('INVALID_AUDIT_CYCLE_IDENTITY', 'Audit cycle identity must have kind ARTIFACT_CYCLE.')
    return new ArtifactCycleId(reference)
  }
  get canonicalKey(): string { return this.reference.canonicalKey }
}

export class ArtifactRevision {
  readonly value: string
  private constructor(value: string) { this.value = value; Object.freeze(this) }
  static create(value: unknown): ArtifactRevision { return new ArtifactRevision(token(value, 'Artifact revision')) }
}

export class RoundOrdinal {
  readonly value: number
  private constructor(value: number) { this.value = value; Object.freeze(this) }
  static create(value: unknown): RoundOrdinal {
    if (typeof value !== 'number' || !Number.isInteger(value) || value < 1) throw new AuditCycleDomainError('INVALID_AUDIT_ROUND', 'Round ordinal must be a positive integer.')
    return new RoundOrdinal(value)
  }
  next(): RoundOrdinal { return new RoundOrdinal(this.value + 1) }
}

export class AuditCycleRevision {
  readonly value: number
  private constructor(value: number) { this.value = value; Object.freeze(this) }
  static create(value: unknown): AuditCycleRevision {
    if (typeof value !== 'number' || !Number.isInteger(value) || value < 0) throw new AuditCycleDomainError('INVALID_AUDIT_ROUND', 'Audit cycle revision must be a non-negative integer.')
    return new AuditCycleRevision(value)
  }
  next(): AuditCycleRevision { return new AuditCycleRevision(this.value + 1) }
}

export interface AuditRoundInput {
  readonly ordinal: number | RoundOrdinal
  readonly auditorEvidenceId: string
  readonly remediationEvidenceId?: string
}

export class AuditRound {
  readonly ordinal: RoundOrdinal
  readonly auditorEvidenceId: string
  readonly remediationEvidenceId?: string
  private constructor(input: { ordinal: RoundOrdinal; auditorEvidenceId: string; remediationEvidenceId?: string }) {
    this.ordinal = input.ordinal; this.auditorEvidenceId = input.auditorEvidenceId; this.remediationEvidenceId = input.remediationEvidenceId; Object.freeze(this)
  }
  static create(input: AuditRoundInput): AuditRound {
    return new AuditRound({ ordinal: input.ordinal instanceof RoundOrdinal ? input.ordinal : RoundOrdinal.create(input.ordinal), auditorEvidenceId: token(input.auditorEvidenceId, 'Auditor evidence ID'), remediationEvidenceId: input.remediationEvidenceId === undefined ? undefined : token(input.remediationEvidenceId, 'Remediation evidence ID') })
  }
  equals(other: AuditRound): boolean {
    return this.ordinal.value === other.ordinal.value
      && this.auditorEvidenceId === other.auditorEvidenceId
      && this.remediationEvidenceId === other.remediationEvidenceId
  }
}

export interface StructuredVerdictInput {
  readonly verdictId: string
  readonly result: AuditVerdictResult
  readonly artifactRevision: string | ArtifactRevision
  readonly cycleIdentity: CanonicalIdentityReferenceInput | CanonicalIdentityReference
  readonly round: number | RoundOrdinal
  readonly findingIds: readonly string[]
  readonly structured: boolean
  readonly issuedByAudit: boolean
}

export class StructuredVerdict {
  readonly verdictId: string
  readonly result: AuditVerdictResult
  readonly artifactRevision: ArtifactRevision
  readonly cycleIdentity: CanonicalIdentityReference
  readonly round: RoundOrdinal
  readonly findingIds: readonly string[]
  readonly structured: boolean
  readonly issuedByAudit: boolean
  private constructor(input: { verdictId: string; result: AuditVerdictResult; artifactRevision: ArtifactRevision; cycleIdentity: CanonicalIdentityReference; round: RoundOrdinal; findingIds: readonly string[]; structured: boolean; issuedByAudit: boolean }) {
    this.verdictId = input.verdictId; this.result = input.result; this.artifactRevision = input.artifactRevision; this.cycleIdentity = input.cycleIdentity; this.round = input.round; this.findingIds = Object.freeze([...input.findingIds]); this.structured = input.structured; this.issuedByAudit = input.issuedByAudit; Object.freeze(this)
  }
  static create(input: StructuredVerdictInput): StructuredVerdict {
    const cycleIdentity = input.cycleIdentity instanceof CanonicalIdentityReference ? input.cycleIdentity : CanonicalIdentityReference.create(input.cycleIdentity)
    if (cycleIdentity.identity.kind !== 'ARTIFACT_CYCLE') throw new AuditCycleDomainError('INVALID_AUDIT_CYCLE_REFERENCE', 'Structured verdict must attach to an artifact cycle.')
    if (!['CONFORMANT', 'REMEDIATION_REQUIRED'].includes(input.result) || input.structured !== true || input.issuedByAudit !== true) throw new AuditCycleDomainError('INVALID_AUDIT_VERDICT', 'Cycle closure requires an audit-issued structured verdict.')
    if (!Array.isArray(input.findingIds)) throw new AuditCycleDomainError('INVALID_AUDIT_VERDICT', 'Structured verdict finding evidence is required.')
    const findingIds = input.findingIds.map((id) => token(id, 'Finding ID'))
    if (!findingIds.length) throw new AuditCycleDomainError('INVALID_AUDIT_VERDICT', 'Structured cycle closure requires finding evidence; process termination is not a verdict.')
    return new StructuredVerdict({ verdictId: token(input.verdictId, 'Verdict ID'), result: input.result, artifactRevision: input.artifactRevision instanceof ArtifactRevision ? input.artifactRevision : ArtifactRevision.create(input.artifactRevision), cycleIdentity, round: input.round instanceof RoundOrdinal ? input.round : RoundOrdinal.create(input.round), findingIds, structured: input.structured, issuedByAudit: input.issuedByAudit })
  }
  equals(other: StructuredVerdict): boolean {
    return this.verdictId === other.verdictId
      && this.result === other.result
      && this.artifactRevision.value === other.artifactRevision.value
      && this.cycleIdentity.equals(other.cycleIdentity)
      && this.round.value === other.round.value
      && this.structured === other.structured
      && this.issuedByAudit === other.issuedByAudit
      && this.findingIds.length === other.findingIds.length
      && this.findingIds.every((id, index) => id === other.findingIds[index])
  }
}

export interface AuditCycleCreationInput {
  readonly identity: CanonicalIdentityReferenceInput | CanonicalIdentityReference
  readonly artifactRevision: string | ArtifactRevision
}
export interface AuditCycleRehydrationInput {
  readonly identity: CanonicalIdentityReferenceInput | CanonicalIdentityReference
  readonly artifactRevision: string | ArtifactRevision
  readonly status: AuditCycleStatusName
  readonly revision: number | AuditCycleRevision
  readonly rounds: readonly AuditRoundInput[]
  readonly verdict?: StructuredVerdictInput
}
export interface AuditCycleReconstructionAuthority {
  resolveForRehydration(identity: CanonicalIdentityReference): { readonly artifactRevision: string; readonly revision: number | AuditCycleRevision; readonly rounds: readonly AuditRoundInput[]; readonly verdict?: StructuredVerdictInput } | undefined
}

export class AuditCycle {
  readonly id: ArtifactCycleId
  readonly artifactRevision: ArtifactRevision
  readonly revision: AuditCycleRevision
  readonly status: AuditCycleStatusName
  readonly rounds: readonly AuditRound[]
  readonly verdict?: StructuredVerdict

  private constructor(input: { id: ArtifactCycleId; artifactRevision: ArtifactRevision; revision: AuditCycleRevision; status: AuditCycleStatusName; rounds: readonly AuditRound[]; verdict?: StructuredVerdict }) {
    this.id = input.id; this.artifactRevision = input.artifactRevision; this.revision = input.revision; this.status = input.status; this.rounds = Object.freeze([...input.rounds]); this.verdict = input.verdict; Object.freeze(this)
  }

  static create(input: AuditCycleCreationInput): AuditCycle {
    return new AuditCycle({ id: ArtifactCycleId.create(input.identity), artifactRevision: input.artifactRevision instanceof ArtifactRevision ? input.artifactRevision : ArtifactRevision.create(input.artifactRevision), revision: AuditCycleRevision.create(0), status: 'OPEN', rounds: [] })
  }

  static rehydrate(input: AuditCycleRehydrationInput, authority: AuditCycleReconstructionAuthority): AuditCycle {
    if (!authority || typeof authority.resolveForRehydration !== 'function') throw new AuditCycleDomainError('AUDIT_CYCLE_RECONSTRUCTION_AUTHORITY_REQUIRED', 'Audit cycle rehydration requires accepted cycle history authority.')
    const id = ArtifactCycleId.create(input.identity)
    const artifactRevision = input.artifactRevision instanceof ArtifactRevision ? input.artifactRevision : ArtifactRevision.create(input.artifactRevision)
    const revision = input.revision instanceof AuditCycleRevision ? input.revision : AuditCycleRevision.create(input.revision)
    if (!['OPEN', 'CLOSED'].includes(input.status)) throw new AuditCycleDomainError('INVALID_AUDIT_CYCLE_REFERENCE', 'Audit cycle status must be OPEN or CLOSED.')
    const accepted = authority.resolveForRehydration(id.reference)
    const acceptedRevision = accepted?.revision instanceof AuditCycleRevision ? accepted.revision.value : accepted?.revision
    if (!accepted || accepted.artifactRevision !== artifactRevision.value || acceptedRevision !== revision.value || accepted.rounds.length !== input.rounds.length) throw new AuditCycleDomainError('INVALID_AUDIT_CYCLE_REFERENCE', 'Audit cycle material does not match accepted artifact history.')
    let expected = 1
    const rounds = input.rounds.map((round, index) => {
      const current = AuditRound.create(round)
      if (current.ordinal.value !== expected) throw new AuditCycleDomainError('INVALID_AUDIT_ROUND', 'Audit rounds must be ordered without skips or duplicates.')
      expected += 1
      const acceptedRound = AuditRound.create(accepted.rounds[index])
      if (!current.equals(acceptedRound)) throw new AuditCycleDomainError('INVALID_AUDIT_ROUND', 'Audit round material does not match accepted authority.')
      return current
    })
    const verdict = input.verdict ? StructuredVerdict.create(input.verdict) : undefined
    const acceptedVerdict = accepted.verdict ? StructuredVerdict.create(accepted.verdict) : undefined
    if (input.status === 'CLOSED' && !verdict) throw new AuditCycleDomainError('INVALID_AUDIT_VERDICT', 'A closed audit cycle requires a structured verdict.')
    if (input.status === 'OPEN' && verdict) throw new AuditCycleDomainError('INVALID_AUDIT_VERDICT', 'An open audit cycle cannot carry a closure verdict.')
    if (verdict && (!verdict.cycleIdentity.equals(id.reference) || verdict.artifactRevision.value !== artifactRevision.value || verdict.round.value !== rounds.length)) throw new AuditCycleDomainError('INVALID_AUDIT_VERDICT', 'Audit verdict must remain attached to this artifact, revision, cycle, and latest round.')
    if ((verdict === undefined) !== (acceptedVerdict === undefined)
      || (verdict !== undefined && acceptedVerdict !== undefined && !verdict.equals(acceptedVerdict))) {
      throw new AuditCycleDomainError('INVALID_AUDIT_VERDICT', 'Audit verdict material does not match accepted authority.')
    }
    return new AuditCycle({ id, artifactRevision, revision, status: input.status, rounds, verdict })
  }

  appendRound(input: AuditRoundInput): AuditCycle {
    if (this.status !== 'OPEN') throw new AuditCycleDomainError('AUDIT_CYCLE_CLOSED', 'Closed audit cycles cannot receive another round.')
    const round = AuditRound.create(input)
    const existingOrdinal = this.rounds.find((existing) => existing.ordinal.value === round.ordinal.value)
    if (existingOrdinal) {
      if (existingOrdinal.equals(round)) return this
      throw new AuditCycleDomainError('INVALID_AUDIT_ROUND', 'An audit round ordinal cannot be reused with different evidence.')
    }
    const expected = this.rounds.length + 1
    if (round.ordinal.value !== expected) throw new AuditCycleDomainError('INVALID_AUDIT_ROUND', `Expected audit round ${expected}.`)
    if (this.rounds.some((existing) => existing.auditorEvidenceId === round.auditorEvidenceId)) throw new AuditCycleDomainError('INVALID_AUDIT_ROUND', 'An audit evidence record cannot be reused for another round.')
    return new AuditCycle({ id: this.id, artifactRevision: this.artifactRevision, revision: this.revision.next(), status: 'OPEN', rounds: [...this.rounds, round] })
  }

  close(verdictInput: StructuredVerdictInput): AuditCycle {
    const verdict = StructuredVerdict.create(verdictInput)
    if (this.status !== 'OPEN') {
      if (this.verdict?.equals(verdict)) return this
      throw new AuditCycleDomainError('AUDIT_CYCLE_CLOSED', 'Closed audit cycles cannot be closed again.')
    }
    if (!verdict.cycleIdentity.equals(this.id.reference) || verdict.artifactRevision.value !== this.artifactRevision.value || verdict.round.value !== this.rounds.length) throw new AuditCycleDomainError('INVALID_AUDIT_VERDICT', 'Structured verdict must attach to this artifact, revision, and latest round.')
    if (!this.rounds.length) throw new AuditCycleDomainError('INVALID_AUDIT_VERDICT', 'An audit cycle requires an explicit round before closure.')
    return new AuditCycle({ id: this.id, artifactRevision: this.artifactRevision, revision: this.revision.next(), status: 'CLOSED', rounds: this.rounds, verdict })
  }
}

export interface AuditCycleRepository {
  find(identity: CanonicalIdentityReference): AuditCycle | undefined
  save(cycle: AuditCycle, expectedRevision: number): Promise<{ status: 'ADVANCED'; cycle: AuditCycle } | { status: 'STALE'; existing: AuditCycle } | { status: 'NOT_FOUND' }>
}

export { AuditCycle as ArtifactCycle }
