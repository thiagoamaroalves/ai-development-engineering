export const AGGREGATE_KINDS = Object.freeze([
  'REPOSITORY',
  'EXECUTION',
  'ADR',
  'SPEC',
  'ARTIFACT',
  'ARTIFACT_CYCLE',
  'STAGE',
  'ACTIVITY',
  'ATTEMPT',
  'TICKET',
  'WAVE',
  'AGENT',
  'EXTERNAL_EFFECT',
  'PUBLICATION',
] as const)

export type AggregateKind = (typeof AGGREGATE_KINDS)[number]

export type IdentityErrorCode =
  | 'INVALID_AGGREGATE_KIND'
  | 'INVALID_SCOPE'
  | 'INVALID_IDENTITY_VALUE'
  | 'INVALID_REVISION'
  | 'IDENTITY_REFERENCE_REQUIRED'
  | 'IDENTITY_REFERENCE_MISMATCH'
  | 'IDENTITY_RECONSTRUCTION_AUTHORITY_REQUIRED'
  | 'IDENTITY_ALREADY_EXISTS'
  | 'IDENTITY_NOT_FOUND'

export class IdentityDomainError extends Error {
  readonly code: IdentityErrorCode

  constructor(code: IdentityErrorCode, message: string) {
    super(message)
    this.name = 'IdentityDomainError'
    this.code = code
  }
}

export function assertAggregateKind(value: unknown): AggregateKind {
  if (typeof value === 'string' && (AGGREGATE_KINDS as readonly string[]).includes(value)) {
    return value as AggregateKind
  }

  throw new IdentityDomainError('INVALID_AGGREGATE_KIND', 'Aggregate kind must be a known canonical identity kind.')
}

export class IdentityScope {
  readonly value: string

  private constructor(value: string) {
    this.value = value
    Object.freeze(this)
  }

  static create(value: unknown): IdentityScope {
    if (typeof value !== 'string') {
      throw new IdentityDomainError('INVALID_SCOPE', 'Identity scope is required.')
    }

    const normalized = value.trim()
    if (!normalized || normalized.length > 200 || /[\r\n]/.test(normalized)) {
      throw new IdentityDomainError('INVALID_SCOPE', 'Identity scope must be a non-empty single-line value of at most 200 characters.')
    }

    return new IdentityScope(normalized)
  }

  equals(other: IdentityScope): boolean {
    return this.value === other.value
  }
}

export class Revision {
  readonly value: number

  private constructor(value: number) {
    this.value = value
    Object.freeze(this)
  }

  static create(value: unknown = 1): Revision {
    if (typeof value !== 'number' || !Number.isInteger(value) || value < 1) {
      throw new IdentityDomainError('INVALID_REVISION', 'Revision must be a positive integer.')
    }

    return new Revision(value)
  }

  equals(other: Revision): boolean {
    return this.value === other.value
  }
}

function assertIdentityValue(value: unknown): string {
  if (typeof value !== 'string') {
    throw new IdentityDomainError('INVALID_IDENTITY_VALUE', 'Canonical identity value is required.')
  }

  const normalized = value.trim()
  if (!normalized || normalized.length > 200 || !/^[A-Za-z0-9][A-Za-z0-9._:-]*$/.test(normalized)) {
    throw new IdentityDomainError('INVALID_IDENTITY_VALUE', 'Canonical identity value must be an explicit stable token.')
  }

  return normalized
}

export interface CanonicalIdentityInput {
  readonly kind: AggregateKind
  readonly scope: IdentityScope | string
  readonly value: string
}

export class CanonicalIdentity {
  readonly kind: AggregateKind
  readonly scope: IdentityScope
  readonly value: string

  private constructor(kind: AggregateKind, scope: IdentityScope, value: string) {
    this.kind = kind
    this.scope = scope
    this.value = value
    Object.freeze(this)
  }

  static create(input: CanonicalIdentityInput): CanonicalIdentity {
    const kind = assertAggregateKind(input.kind)
    const scope = input.scope instanceof IdentityScope ? input.scope : IdentityScope.create(input.scope)
    return new CanonicalIdentity(kind, scope, assertIdentityValue(input.value))
  }

  get canonicalKey(): string {
    return `${this.kind}|${this.scope.value}|${this.value}`
  }

  equals(other: CanonicalIdentity): boolean {
    return this.canonicalKey === other.canonicalKey
  }
}

export interface CanonicalIdentityReferenceInput {
  readonly identity: CanonicalIdentity | CanonicalIdentityInput
  readonly revision: Revision | number
}

export class CanonicalIdentityReference {
  readonly identity: CanonicalIdentity
  readonly revision: Revision

  private constructor(identity: CanonicalIdentity, revision: Revision) {
    this.identity = identity
    this.revision = revision
    Object.freeze(this)
  }

  static create(input: CanonicalIdentityReferenceInput): CanonicalIdentityReference {
    const identity = input.identity instanceof CanonicalIdentity ? input.identity : CanonicalIdentity.create(input.identity)
    const revision = input.revision instanceof Revision ? input.revision : Revision.create(input.revision)
    return new CanonicalIdentityReference(identity, revision)
  }

  get canonicalKey(): string {
    return `${this.identity.canonicalKey}|revision=${this.revision.value}`
  }

  equals(other: CanonicalIdentityReference): boolean {
    return this.canonicalKey === other.canonicalKey
  }
}

export interface CanonicalStageReferenceInput {
  readonly executionId: IdentityScope | string
  readonly stageId: string
  readonly revision: Revision | number
}

/**
 * Narrows the generic identity reference to the canonical WorkflowPipeline
 * identity without introducing a second identity representation.
 */
export class CanonicalStageReference {
  readonly reference: CanonicalIdentityReference

  private constructor(reference: CanonicalIdentityReference) {
    this.reference = reference
    Object.freeze(this)
  }

  static create(input: CanonicalStageReferenceInput): CanonicalStageReference {
    return new CanonicalStageReference(CanonicalIdentityReference.create({
      identity: {
        kind: 'STAGE',
        scope: input.executionId,
        value: input.stageId,
      },
      revision: input.revision,
    }))
  }

  get identity(): CanonicalIdentity {
    return this.reference.identity
  }

  get revision(): Revision {
    return this.reference.revision
  }

  get canonicalKey(): string {
    return this.reference.canonicalKey
  }

  equals(other: CanonicalStageReference): boolean {
    return this.reference.equals(other.reference)
  }
}

export interface CanonicalIdentityRecordInput extends CanonicalIdentityReferenceInput {
  readonly createdAt: string
}

/**
 * The semantic authority used when persisted identity material re-enters the
 * domain. Physical persistence remains outside DOM; this contract only proves
 * canonical attachment and historical continuity before materialization.
 */
export interface CanonicalIdentityReconstructionAuthority {
  resolve(reference: CanonicalIdentityReferenceInput): CanonicalIdentityRecord
  resolveForRehydration(reference: CanonicalIdentityReferenceInput): CanonicalIdentityRecord
}

export class CanonicalIdentityRecord {
  readonly reference: CanonicalIdentityReference
  readonly createdAt: string

  private constructor(reference: CanonicalIdentityReference, createdAt: string) {
    this.reference = reference
    this.createdAt = createdAt
    Object.freeze(this)
  }

  static create(input: CanonicalIdentityRecordInput): CanonicalIdentityRecord {
    if (typeof input.createdAt !== 'string' || !input.createdAt.trim()) {
      throw new IdentityDomainError('INVALID_IDENTITY_VALUE', 'Identity creation timestamp is required.')
    }

    return new CanonicalIdentityRecord(CanonicalIdentityReference.create(input), input.createdAt)
  }

  /** Rebuild a persisted record through the same invariant-checked boundary. */
  static rehydrate(
    input: CanonicalIdentityRecordInput,
    authority: CanonicalIdentityReconstructionAuthority,
  ): CanonicalIdentityRecord {
    if (!authority || typeof authority.resolveForRehydration !== 'function') {
      throw new IdentityDomainError(
        'IDENTITY_RECONSTRUCTION_AUTHORITY_REQUIRED',
        'Canonical identity rehydration requires the DOM reconstruction authority.',
      )
    }

    const candidate = CanonicalIdentityReference.create(input)
    const resolved = authority.resolveForRehydration(candidate)
    if (!resolved.reference.equals(candidate) || resolved.createdAt !== input.createdAt) {
      throw new IdentityDomainError(
        'IDENTITY_REFERENCE_MISMATCH',
        `Canonical identity ${candidate.canonicalKey} does not match its authoritative record.`,
      )
    }

    return CanonicalIdentityRecord.create({
      identity: resolved.identity,
      revision: resolved.revision,
      createdAt: resolved.createdAt,
    })
  }

  get identity(): CanonicalIdentity {
    return this.reference.identity
  }

  get revision(): Revision {
    return this.reference.revision
  }

  get canonicalKey(): string {
    return this.reference.canonicalKey
  }
}

interface CanonicalIdentityRevisionInput {
  readonly kind: AggregateKind
  readonly scope: IdentityScope
  readonly revision: Revision
  readonly existingReference: CanonicalIdentityReference
  readonly existingRecord: CanonicalIdentityRecord
  readonly value?: string
  readonly createdAt: string
}

function resolveRevisionReference(
  revision: Revision,
  input: CanonicalIdentityReferenceInput | undefined,
): CanonicalIdentityReference | undefined {
  if (revision.value > 1) {
    if (!input) {
      throw new IdentityDomainError(
        'IDENTITY_REFERENCE_REQUIRED',
        'A revision above the initial revision requires an existing canonical identity reference.',
      )
    }

    return CanonicalIdentityReference.create(input)
  }

  if (input) {
    throw new IdentityDomainError(
      'IDENTITY_REFERENCE_MISMATCH',
      'The initial revision cannot register from an existing canonical identity reference.',
    )
  }

  return undefined
}

function assertRevisionReferenceCompatible(
  reference: CanonicalIdentityReference,
  kind: AggregateKind,
  scope: IdentityScope,
  revision: Revision,
): void {
  if (reference.revision.value + 1 !== revision.value
    || reference.identity.kind !== kind
    || !reference.identity.scope.equals(scope)) {
    throw new IdentityDomainError(
      'IDENTITY_REFERENCE_MISMATCH',
      'The existing canonical identity reference must be the immediate predecessor of the requested kind and scope.',
    )
  }
}

/**
 * Domain policy for registering a revision against an existing identity.
 * Repository lookup is deliberately performed by the catalog; this policy
 * owns the invariant once the predecessor has been resolved.
 */
function createRevisionRecord(input: CanonicalIdentityRevisionInput): CanonicalIdentityRecord {
  assertRevisionReferenceCompatible(input.existingReference, input.kind, input.scope, input.revision)

  if (input.value !== undefined) {
    const requestedIdentity = CanonicalIdentity.create({ kind: input.kind, scope: input.scope, value: input.value })
    if (!requestedIdentity.equals(input.existingRecord.identity)) {
      throw new IdentityDomainError(
        'IDENTITY_REFERENCE_MISMATCH',
        'A registered revision must preserve the existing canonical identity value.',
      )
    }
  }

  return CanonicalIdentityRecord.create({
    identity: input.existingRecord.identity,
    revision: input.revision,
    createdAt: input.createdAt,
  })
}

export interface IdentityReservationAccepted {
  readonly status: 'ACCEPTED'
  readonly record: CanonicalIdentityRecord
}

export interface IdentityReservationDuplicate {
  readonly status: 'DUPLICATE'
  readonly existing: CanonicalIdentityRecord
}

export type IdentityReservation = IdentityReservationAccepted | IdentityReservationDuplicate

export interface CanonicalIdentityRepository {
  reserve(record: CanonicalIdentityRecord): Promise<IdentityReservation>
  find(reference: CanonicalIdentityReference): CanonicalIdentityRecord | undefined
}

export interface CanonicalIdentityGenerator {
  next(input: { readonly kind: AggregateKind; readonly scope: IdentityScope }): string
}

export interface CreateCanonicalIdentityRequest {
  readonly kind: AggregateKind
  readonly scope: IdentityScope | string
  readonly revision?: Revision | number
  readonly value?: string
  readonly existingReference?: CanonicalIdentityReferenceInput
}

export class CanonicalIdentityCatalog implements CanonicalIdentityReconstructionAuthority {
  constructor(
    private readonly repository: CanonicalIdentityRepository,
    private readonly generator: CanonicalIdentityGenerator,
    private readonly now: () => string = () => new Date().toISOString(),
  ) {}

  async create(request: CreateCanonicalIdentityRequest): Promise<CanonicalIdentityRecord> {
    const kind = assertAggregateKind(request.kind)
    const scope = request.scope instanceof IdentityScope ? request.scope : IdentityScope.create(request.scope)
    const revision = request.revision instanceof Revision ? request.revision : Revision.create(request.revision)
    const existingReference = resolveRevisionReference(revision, request.existingReference)

    let record: CanonicalIdentityRecord
    if (existingReference) {
      // Preserve the domain error precedence before performing repository I/O.
      assertRevisionReferenceCompatible(existingReference, kind, scope, revision)
      const existingRecord = this.repository.find(existingReference)
      if (!existingRecord) {
        throw new IdentityDomainError(
          'IDENTITY_NOT_FOUND',
          `Canonical identity ${existingReference.canonicalKey} could not be resolved for revision registration.`,
        )
      }

      if (!existingRecord.reference.equals(existingReference)) {
        throw new IdentityDomainError(
          'IDENTITY_REFERENCE_MISMATCH',
          `Canonical identity ${existingReference.canonicalKey} does not match the repository predecessor response.`,
        )
      }

      record = createRevisionRecord({
        kind,
        scope,
        revision,
        existingReference,
        existingRecord,
        value: request.value,
        createdAt: this.now(),
      })
    } else {
      const value = request.value ?? this.generator.next({ kind, scope })
      record = CanonicalIdentityRecord.create({
        identity: { kind, scope, value },
        revision,
        createdAt: this.now(),
      })
    }

    const reservation = await this.repository.reserve(record)

    if (reservation.status === 'DUPLICATE') {
      throw new IdentityDomainError('IDENTITY_ALREADY_EXISTS', `Canonical identity ${record.canonicalKey} already exists.`)
    }

    return reservation.record
  }

  resolve(reference: CanonicalIdentityReferenceInput): CanonicalIdentityRecord {
    const canonicalReference = CanonicalIdentityReference.create(reference)
    const record = this.repository.find(canonicalReference)
    if (!record) {
      throw new IdentityDomainError('IDENTITY_NOT_FOUND', `Canonical identity ${canonicalReference.canonicalKey} could not be resolved.`)
    }
    if (!record.reference.equals(canonicalReference)) {
      throw new IdentityDomainError(
        'IDENTITY_REFERENCE_MISMATCH',
        `Canonical identity ${canonicalReference.canonicalKey} does not match the resolved record.`,
      )
    }

    return record
  }

  /**
   * Resolves persisted material only after proving every predecessor in the
   * immutable identity stream is attached and preserves the same identity.
   */
  resolveForRehydration(reference: CanonicalIdentityReferenceInput): CanonicalIdentityRecord {
    const canonicalReference = CanonicalIdentityReference.create(reference)
    const record = this.resolve(canonicalReference)

    for (let revision = record.revision.value - 1; revision >= 1; revision -= 1) {
      const predecessorReference = CanonicalIdentityReference.create({
        identity: record.identity,
        revision,
      })
      const predecessor = this.resolve(predecessorReference)
      if (!predecessor.identity.equals(record.identity)) {
        throw new IdentityDomainError(
          'IDENTITY_REFERENCE_MISMATCH',
          `Canonical identity ${canonicalReference.canonicalKey} has an incompatible predecessor chain.`,
        )
      }
    }

    return record
  }
}
