import {
  CanonicalIdentityReference,
  CanonicalIdentityReferenceInput,
} from './identity.js'

export const DOCUMENTATION_STAGES = Object.freeze([
  'SPEC',
  'GAP_MATRIX',
  'IMPLEMENTATION_PLAN',
  'TICKETS',
] as const)

export type DocumentationStageName = (typeof DOCUMENTATION_STAGES)[number]
export type ApprovalState = 'VALID' | 'OBSOLETE'
export type NormativeChangeErrorCode =
  | 'INVALID_NORMATIVE_CHANGE'
  | 'INVALID_APPROVAL'
  | 'INVALID_ADJUSTMENT'
  | 'NORMATIVE_CHANGE_NOT_FOUND'
  | 'NORMATIVE_CHANGE_STALE'
  | 'NORMATIVE_CHANGE_CONFLICT'
  | 'COMPLETED_TICKET_TERMINAL'
  | 'NORMATIVE_CHANGE_RECONSTRUCTION_AUTHORITY_REQUIRED'

export class NormativeChangeDomainError extends Error {
  readonly code: NormativeChangeErrorCode

  constructor(code: NormativeChangeErrorCode, message: string) {
    super(message)
    this.name = 'NormativeChangeDomainError'
    this.code = code
  }
}

function token(value: unknown, label: string): string {
  if (typeof value !== 'string' || !value.trim() || /[\r\n]/.test(value)) {
    throw new NormativeChangeDomainError('INVALID_NORMATIVE_CHANGE', `${label} must be a non-empty single-line value.`)
  }
  return value.trim()
}

function uniqueTokens(values: readonly string[], label: string): string[] {
  const normalized = values.map((value) => token(value, label))
  if (new Set(normalized).size !== normalized.length) {
    throw new NormativeChangeDomainError('INVALID_NORMATIVE_CHANGE', `${label} must not contain duplicates.`)
  }
  return normalized
}

export class NormativeRevision {
  readonly value: string

  private constructor(value: string) {
    this.value = value
    Object.freeze(this)
  }

  static create(value: unknown): NormativeRevision {
    return new NormativeRevision(token(value, 'Normative revision'))
  }

  equals(other: NormativeRevision): boolean {
    return this.value === other.value
  }
}

export class NormativeChangeId {
  readonly value: string

  private constructor(value: string) {
    this.value = value
    Object.freeze(this)
  }

  static create(value: unknown): NormativeChangeId {
    return new NormativeChangeId(token(value, 'Normative change ID'))
  }

  equals(other: NormativeChangeId): boolean {
    return this.value === other.value
  }
}

export class ApprovalId {
  readonly value: string

  private constructor(value: string) {
    this.value = value
    Object.freeze(this)
  }

  static create(value: unknown): ApprovalId {
    return new ApprovalId(token(value, 'Approval ID'))
  }

  equals(other: ApprovalId): boolean {
    return this.value === other.value
  }
}

export class AdjustmentId {
  readonly value: string

  private constructor(value: string) {
    this.value = value
    Object.freeze(this)
  }

  static create(value: unknown): AdjustmentId {
    return new AdjustmentId(token(value, 'Adjustment ID'))
  }

  equals(other: AdjustmentId): boolean {
    return this.value === other.value
  }
}

export class DocumentationStage {
  readonly value: DocumentationStageName

  private constructor(value: DocumentationStageName) {
    this.value = value
    Object.freeze(this)
  }

  static create(value: unknown): DocumentationStage {
    if (typeof value === 'string' && (DOCUMENTATION_STAGES as readonly string[]).includes(value)) {
      return new DocumentationStage(value as DocumentationStageName)
    }
    throw new NormativeChangeDomainError('INVALID_NORMATIVE_CHANGE', 'Documentation return stage must be known.')
  }

  equals(other: DocumentationStage): boolean {
    return this.value === other.value
  }
}

export class NormativeChangeRevision {
  readonly value: number

  private constructor(value: number) {
    this.value = value
    Object.freeze(this)
  }

  static create(value: unknown = 0): NormativeChangeRevision {
    if (typeof value !== 'number' || !Number.isInteger(value) || value < 0) {
      throw new NormativeChangeDomainError('INVALID_NORMATIVE_CHANGE', 'Normative change revision must be a non-negative integer.')
    }
    return new NormativeChangeRevision(value)
  }

  next(): NormativeChangeRevision {
    return new NormativeChangeRevision(this.value + 1)
  }

  equals(other: NormativeChangeRevision): boolean {
    return this.value === other.value
  }
}

export interface ApprovalRecordInput {
  readonly id: string | ApprovalId
  readonly normativeRevision: string | NormativeRevision
  readonly state?: ApprovalState
  readonly invalidatedBy?: string | AdjustmentId
}

export class ApprovalRecord {
  readonly id: ApprovalId
  readonly normativeRevision: NormativeRevision
  readonly state: ApprovalState
  readonly invalidatedBy?: AdjustmentId

  private constructor(input: {
    readonly id: ApprovalId
    readonly normativeRevision: NormativeRevision
    readonly state: ApprovalState
    readonly invalidatedBy?: AdjustmentId
  }) {
    this.id = input.id
    this.normativeRevision = input.normativeRevision
    this.state = input.state
    this.invalidatedBy = input.invalidatedBy
    Object.freeze(this)
  }

  static create(input: ApprovalRecordInput): ApprovalRecord {
    const id = input.id instanceof ApprovalId ? input.id : ApprovalId.create(input.id)
    const normativeRevision = input.normativeRevision instanceof NormativeRevision
      ? input.normativeRevision
      : NormativeRevision.create(input.normativeRevision)
    const state = input.state ?? 'VALID'
    if (state !== 'VALID' && state !== 'OBSOLETE') {
      throw new NormativeChangeDomainError('INVALID_APPROVAL', 'Approval state must be VALID or OBSOLETE.')
    }
    const invalidatedBy = input.invalidatedBy === undefined
      ? undefined
      : input.invalidatedBy instanceof AdjustmentId ? input.invalidatedBy : AdjustmentId.create(input.invalidatedBy)
    if (state === 'VALID' && invalidatedBy) {
      throw new NormativeChangeDomainError('INVALID_APPROVAL', 'A valid approval cannot reference an invalidating adjustment.')
    }
    if (state === 'OBSOLETE' && !invalidatedBy) {
      throw new NormativeChangeDomainError('INVALID_APPROVAL', 'An obsolete approval requires an invalidating adjustment reference.')
    }
    return new ApprovalRecord({ id, normativeRevision, state, invalidatedBy })
  }

  obsolete(adjustmentId: AdjustmentId, targetRevision: NormativeRevision): ApprovalRecord {
    if (this.state === 'OBSOLETE') {
      if (this.invalidatedBy?.equals(adjustmentId)) return this
      throw new NormativeChangeDomainError('INVALID_APPROVAL', 'An obsolete approval cannot be invalidated by a different adjustment.')
    }
    if (this.normativeRevision.equals(targetRevision)) {
      throw new NormativeChangeDomainError('INVALID_NORMATIVE_CHANGE', 'A normative change must advance the approval revision.')
    }
    return new ApprovalRecord({
      id: this.id,
      normativeRevision: this.normativeRevision,
      state: 'OBSOLETE',
      invalidatedBy: adjustmentId,
    })
  }

  equals(other: ApprovalRecord): boolean {
    return this.id.equals(other.id)
      && this.normativeRevision.equals(other.normativeRevision)
      && this.state === other.state
      && this.invalidatedBy?.value === other.invalidatedBy?.value
  }
}

export interface AdjustmentLineageInput {
  readonly adjustmentId: string | AdjustmentId
  readonly sourceRevision: string | NormativeRevision
  readonly targetRevision: string | NormativeRevision
  readonly affectedApprovalIds: readonly (string | ApprovalId)[]
  readonly affectedTicketIds: readonly (CanonicalIdentityReferenceInput | CanonicalIdentityReference)[]
  readonly returnStage: DocumentationStageName | DocumentationStage
}

export class AdjustmentLineage {
  readonly adjustmentId: AdjustmentId
  readonly sourceRevision: NormativeRevision
  readonly targetRevision: NormativeRevision
  readonly affectedApprovalIds: readonly ApprovalId[]
  readonly affectedTicketIds: readonly CanonicalIdentityReference[]
  readonly returnStage: DocumentationStage

  private constructor(input: {
    readonly adjustmentId: AdjustmentId
    readonly sourceRevision: NormativeRevision
    readonly targetRevision: NormativeRevision
    readonly affectedApprovalIds: readonly ApprovalId[]
    readonly affectedTicketIds: readonly CanonicalIdentityReference[]
    readonly returnStage: DocumentationStage
  }) {
    this.adjustmentId = input.adjustmentId
    this.sourceRevision = input.sourceRevision
    this.targetRevision = input.targetRevision
    this.affectedApprovalIds = Object.freeze([...input.affectedApprovalIds])
    this.affectedTicketIds = Object.freeze([...input.affectedTicketIds])
    this.returnStage = input.returnStage
    Object.freeze(this)
  }

  static create(input: AdjustmentLineageInput): AdjustmentLineage {
    const adjustmentId = input.adjustmentId instanceof AdjustmentId ? input.adjustmentId : AdjustmentId.create(input.adjustmentId)
    const sourceRevision = input.sourceRevision instanceof NormativeRevision ? input.sourceRevision : NormativeRevision.create(input.sourceRevision)
    const targetRevision = input.targetRevision instanceof NormativeRevision ? input.targetRevision : NormativeRevision.create(input.targetRevision)
    if (sourceRevision.equals(targetRevision)) {
      throw new NormativeChangeDomainError('INVALID_ADJUSTMENT', 'Adjustment source and target revisions must differ.')
    }
    const affectedApprovalIds = input.affectedApprovalIds.map((id) => id instanceof ApprovalId ? id : ApprovalId.create(id))
    if (!affectedApprovalIds.length || new Set(affectedApprovalIds.map((id) => id.value)).size !== affectedApprovalIds.length) {
      throw new NormativeChangeDomainError('INVALID_ADJUSTMENT', 'An adjustment requires a unique non-empty affected approval set.')
    }
    const affectedTicketIds = input.affectedTicketIds.map((id) => id instanceof CanonicalIdentityReference ? id : CanonicalIdentityReference.create(id))
    if (affectedTicketIds.some((id) => id.identity.kind !== 'TICKET')) {
      throw new NormativeChangeDomainError('INVALID_ADJUSTMENT', 'Adjustment lineage may reference only canonical TICKET identities.')
    }
    if (new Set(affectedTicketIds.map((id) => id.canonicalKey)).size !== affectedTicketIds.length) {
      throw new NormativeChangeDomainError('INVALID_ADJUSTMENT', 'Adjustment ticket references must be unique.')
    }
    const returnStage = input.returnStage instanceof DocumentationStage
      ? input.returnStage
      : DocumentationStage.create(input.returnStage)
    return new AdjustmentLineage({ adjustmentId, sourceRevision, targetRevision, affectedApprovalIds, affectedTicketIds, returnStage })
  }

  equals(other: AdjustmentLineage): boolean {
    return this.adjustmentId.equals(other.adjustmentId)
      && this.sourceRevision.equals(other.sourceRevision)
      && this.targetRevision.equals(other.targetRevision)
      && this.returnStage.equals(other.returnStage)
      && this.affectedApprovalIds.length === other.affectedApprovalIds.length
      && this.affectedApprovalIds.every((id, index) => id.equals(other.affectedApprovalIds[index]))
      && this.affectedTicketIds.length === other.affectedTicketIds.length
      && this.affectedTicketIds.every((id, index) => id.equals(other.affectedTicketIds[index]))
  }
}

export interface NormativeChangeInput {
  readonly changeId: string | NormativeChangeId
  readonly sourceRevision: string | NormativeRevision
  readonly targetRevision: string | NormativeRevision
  readonly affectedApprovalIds: readonly string[]
  readonly affectedTicketIds: readonly (CanonicalIdentityReferenceInput | CanonicalIdentityReference)[]
  readonly adjustmentId: string
  readonly returnStage: DocumentationStageName | DocumentationStage
}

export interface NormativeChangeResult {
  readonly previous: NormativeChangeSet
  readonly proposed: NormativeChangeSet
  readonly lineage: AdjustmentLineage
  readonly duplicate: boolean
}

export class NormativeChangeSet {
  readonly changeId: NormativeChangeId
  readonly revision: NormativeChangeRevision
  readonly approvals: readonly ApprovalRecord[]
  readonly adjustments: readonly AdjustmentLineage[]

  private constructor(input: {
    readonly changeId: NormativeChangeId
    readonly revision: NormativeChangeRevision
    readonly approvals: readonly ApprovalRecord[]
    readonly adjustments: readonly AdjustmentLineage[]
  }) {
    this.changeId = input.changeId
    this.revision = input.revision
    this.approvals = Object.freeze([...input.approvals])
    this.adjustments = Object.freeze([...input.adjustments])
    Object.freeze(this)
  }

  static create(input: {
    readonly changeId: string | NormativeChangeId
    readonly revision?: number | NormativeChangeRevision
    readonly approvals: readonly ApprovalRecordInput[]
    readonly adjustments?: readonly AdjustmentLineageInput[]
  }): NormativeChangeSet {
    const approvals = input.approvals.map((approval) => ApprovalRecord.create(approval))
    if (new Set(approvals.map((approval) => approval.id.value)).size !== approvals.length) {
      throw new NormativeChangeDomainError('INVALID_APPROVAL', 'Approval records must be unique.')
    }
    const adjustments = (input.adjustments ?? []).map((adjustment) => AdjustmentLineage.create(adjustment))
    if (new Set(adjustments.map((adjustment) => adjustment.adjustmentId.value)).size !== adjustments.length) {
      throw new NormativeChangeDomainError('INVALID_ADJUSTMENT', 'Adjustment records must be unique.')
    }
    return new NormativeChangeSet({
      changeId: input.changeId instanceof NormativeChangeId ? input.changeId : NormativeChangeId.create(input.changeId),
      revision: input.revision instanceof NormativeChangeRevision ? input.revision : NormativeChangeRevision.create(input.revision),
      approvals,
      adjustments,
    })
  }

  apply(input: NormativeChangeInput): NormativeChangeResult {
    const changeId = input.changeId instanceof NormativeChangeId ? input.changeId : NormativeChangeId.create(input.changeId)
    if (!changeId.equals(this.changeId)) {
      throw new NormativeChangeDomainError('NORMATIVE_CHANGE_CONFLICT', 'Normative change does not match the local change set.')
    }
    const sourceRevision = input.sourceRevision instanceof NormativeRevision ? input.sourceRevision : NormativeRevision.create(input.sourceRevision)
    const targetRevision = input.targetRevision instanceof NormativeRevision ? input.targetRevision : NormativeRevision.create(input.targetRevision)
    if (sourceRevision.equals(targetRevision)) {
      throw new NormativeChangeDomainError('INVALID_NORMATIVE_CHANGE', 'Normative change must advance the source revision.')
    }
    const affectedIds = uniqueTokens(input.affectedApprovalIds, 'Affected approval ID').map((id) => ApprovalId.create(id))
    const lineage = AdjustmentLineage.create({
      adjustmentId: input.adjustmentId,
      sourceRevision,
      targetRevision,
      affectedApprovalIds: affectedIds,
      affectedTicketIds: input.affectedTicketIds,
      returnStage: input.returnStage,
    })
    const existing = this.adjustments.find((adjustment) => adjustment.adjustmentId.equals(lineage.adjustmentId))
    if (existing) {
      if (!existing.equals(lineage)) {
        throw new NormativeChangeDomainError('NORMATIVE_CHANGE_CONFLICT', 'Adjustment ID was reused with different normative-change semantics.')
      }
      return { previous: this, proposed: this, lineage: existing, duplicate: true }
    }

    const affectedSet = new Set(affectedIds.map((id) => id.value))
    const affectedApprovals = this.approvals.filter((approval) => affectedSet.has(approval.id.value))
    if (affectedSet.size !== affectedApprovals.length) {
      throw new NormativeChangeDomainError('INVALID_APPROVAL', 'Every affected approval must resolve to an existing approval record.')
    }
    if (affectedApprovals.some((approval) => approval.state !== 'VALID' || !approval.normativeRevision.equals(sourceRevision))) {
      throw new NormativeChangeDomainError('INVALID_APPROVAL', 'Every affected approval must belong to the observed source normative revision.')
    }
    const approvals = this.approvals.map((approval) => affectedSet.has(approval.id.value)
      ? approval.obsolete(lineage.adjustmentId, targetRevision)
      : approval)
    const proposed = new NormativeChangeSet({
      changeId: this.changeId,
      revision: this.revision.next(),
      approvals,
      adjustments: [...this.adjustments, lineage],
    })
    return { previous: this, proposed, lineage, duplicate: false }
  }

  toSnapshot(): NormativeChangeSnapshot {
    return Object.freeze({
      changeId: this.changeId.value,
      revision: this.revision.value,
      approvals: this.approvals.map((approval) => Object.freeze({
        id: approval.id.value,
        normativeRevision: approval.normativeRevision.value,
        state: approval.state,
        invalidatedBy: approval.invalidatedBy?.value,
      })),
      adjustments: this.adjustments.map((adjustment) => Object.freeze({
        adjustmentId: adjustment.adjustmentId.value,
        sourceRevision: adjustment.sourceRevision.value,
        targetRevision: adjustment.targetRevision.value,
        affectedApprovalIds: [...adjustment.affectedApprovalIds].map((id) => id.value),
        affectedTicketIds: [...adjustment.affectedTicketIds].map((id) => ({
          identity: { kind: id.identity.kind, scope: id.identity.scope.value, value: id.identity.value },
          revision: id.revision.value,
        })),
        returnStage: adjustment.returnStage.value,
      })),
    })
  }

  static rehydrate(input: NormativeChangeSnapshot, authority: NormativeChangeReconstructionAuthority): NormativeChangeSet {
    if (!authority || typeof authority.resolveForRehydration !== 'function') {
      throw new NormativeChangeDomainError('NORMATIVE_CHANGE_RECONSTRUCTION_AUTHORITY_REQUIRED', 'Normative change rehydration requires accepted change history authority.')
    }
    const accepted = authority.resolveForRehydration(input.changeId)
    if (!accepted || !snapshotsEqual(accepted, input)) {
      throw new NormativeChangeDomainError('NORMATIVE_CHANGE_RECONSTRUCTION_AUTHORITY_REQUIRED', 'Normative change material does not match accepted authority.')
    }
    return NormativeChangeSet.create({
      changeId: input.changeId,
      revision: input.revision,
      approvals: input.approvals,
      adjustments: input.adjustments,
    })
  }
}

export interface NormativeChangeSnapshot {
  readonly changeId: string
  readonly revision: number
  readonly approvals: readonly ApprovalRecordInput[]
  readonly adjustments: readonly AdjustmentLineageInput[]
}

export interface NormativeChangeReconstructionAuthority {
  resolveForRehydration(changeId: string): NormativeChangeSnapshot | undefined
}

export interface NormativeChangeObservation {
  readonly changeId: string
  readonly sourceRevision: NormativeRevision | string
  readonly targetRevision: NormativeRevision | string
  readonly affectedApprovalIds: readonly string[]
  readonly affectedTicketIds: readonly (CanonicalIdentityReferenceInput | CanonicalIdentityReference)[]
  readonly adjustmentId: string
  readonly returnStage: DocumentationStageName | DocumentationStage
  readonly observationId: string
}

export interface NormativeChangeAuthorityReader {
  observe(changeId: string): NormativeChangeObservation | undefined
}

export interface NormativeChangeRepository {
  find(changeId: string): NormativeChangeSet | undefined
  save(
    change: NormativeChangeSet,
    expectedRevision: NormativeChangeRevision,
  ): Promise<
    | { readonly status: 'ADVANCED'; readonly change: NormativeChangeSet }
    | { readonly status: 'STALE'; readonly existing?: NormativeChangeSet }
    | { readonly status: 'DUPLICATE'; readonly existing: NormativeChangeSet }
  >
}

function snapshotsEqual(left: NormativeChangeSnapshot, right: NormativeChangeSnapshot): boolean {
  if (left.changeId !== right.changeId || left.revision !== right.revision
    || left.approvals.length !== right.approvals.length
    || left.adjustments.length !== right.adjustments.length) return false

  const approvalsEqual = left.approvals.every((approval, index) => {
    const other = right.approvals[index]
    const approvalId = approval.id instanceof ApprovalId ? approval.id.value : approval.id
    const otherId = other.id instanceof ApprovalId ? other.id.value : other.id
    const normativeRevision = approval.normativeRevision instanceof NormativeRevision ? approval.normativeRevision.value : approval.normativeRevision
    const otherNormativeRevision = other.normativeRevision instanceof NormativeRevision ? other.normativeRevision.value : other.normativeRevision
    const invalidatedBy = approval.invalidatedBy instanceof AdjustmentId ? approval.invalidatedBy.value : approval.invalidatedBy
    const otherInvalidatedBy = other.invalidatedBy instanceof AdjustmentId ? other.invalidatedBy.value : other.invalidatedBy
    return approvalId === otherId
      && normativeRevision === otherNormativeRevision
      && approval.state === other.state
      && invalidatedBy === otherInvalidatedBy
  })
  if (!approvalsEqual) return false

  return left.adjustments.every((adjustment, index) => {
    const other = right.adjustments[index]
    const adjustmentId = adjustment.adjustmentId instanceof AdjustmentId ? adjustment.adjustmentId.value : adjustment.adjustmentId
    const otherAdjustmentId = other.adjustmentId instanceof AdjustmentId ? other.adjustmentId.value : other.adjustmentId
    const source = adjustment.sourceRevision instanceof NormativeRevision ? adjustment.sourceRevision.value : adjustment.sourceRevision
    const otherSource = other.sourceRevision instanceof NormativeRevision ? other.sourceRevision.value : other.sourceRevision
    const target = adjustment.targetRevision instanceof NormativeRevision ? adjustment.targetRevision.value : adjustment.targetRevision
    const otherTarget = other.targetRevision instanceof NormativeRevision ? other.targetRevision.value : other.targetRevision
    const approvalIds = adjustment.affectedApprovalIds.map((id) => id instanceof ApprovalId ? id.value : id)
    const otherApprovalIds = other.affectedApprovalIds.map((id) => id instanceof ApprovalId ? id.value : id)
    const ticketIds = adjustment.affectedTicketIds.map((id) => CanonicalIdentityReference.create(id).canonicalKey)
    const otherTicketIds = other.affectedTicketIds.map((id) => CanonicalIdentityReference.create(id).canonicalKey)
    const stage = adjustment.returnStage instanceof DocumentationStage ? adjustment.returnStage.value : adjustment.returnStage
    const otherStage = other.returnStage instanceof DocumentationStage ? other.returnStage.value : other.returnStage
    return adjustmentId === otherAdjustmentId
      && source === otherSource
      && target === otherTarget
      && stage === otherStage
      && JSON.stringify(approvalIds) === JSON.stringify(otherApprovalIds)
      && JSON.stringify(ticketIds) === JSON.stringify(otherTicketIds)
  })
}

export function observationsEqual(left: NormativeChangeObservation, right: NormativeChangeObservation): boolean {
  const leftTickets = left.affectedTicketIds.map((id) => CanonicalIdentityReference.create(id).canonicalKey)
  const rightTickets = right.affectedTicketIds.map((id) => CanonicalIdentityReference.create(id).canonicalKey)
  const leftSource = left.sourceRevision instanceof NormativeRevision ? left.sourceRevision.value : NormativeRevision.create(left.sourceRevision).value
  const rightSource = right.sourceRevision instanceof NormativeRevision ? right.sourceRevision.value : NormativeRevision.create(right.sourceRevision).value
  const leftTarget = left.targetRevision instanceof NormativeRevision ? left.targetRevision.value : NormativeRevision.create(left.targetRevision).value
  const rightTarget = right.targetRevision instanceof NormativeRevision ? right.targetRevision.value : NormativeRevision.create(right.targetRevision).value
  return left.changeId === right.changeId
    && leftSource === rightSource
    && leftTarget === rightTarget
    && JSON.stringify(left.affectedApprovalIds) === JSON.stringify(right.affectedApprovalIds)
    && JSON.stringify(leftTickets) === JSON.stringify(rightTickets)
    && left.adjustmentId === right.adjustmentId
    && (left.returnStage instanceof DocumentationStage ? left.returnStage.value : left.returnStage) === (right.returnStage instanceof DocumentationStage ? right.returnStage.value : right.returnStage)
}
