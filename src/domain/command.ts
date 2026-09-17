import {
  CanonicalIdentityReference,
  CanonicalIdentityReferenceInput,
} from './identity.js'
import { PipelineRevision } from './pipeline.js'

export type CanonicalFailureFamily = 'SPEC_REVISION' | 'DEPENDENCY_CLOSURE' | 'COMMAND_BASIS'

export type CanonicalFailureCode =
  | 'UNKNOWN_SPEC'
  | 'INELIGIBLE_REVISION'
  | 'INVALID_DEPENDENCY_CLOSURE'
  | 'INVALID_COMMAND_BASIS'
  | 'STALE_REVISION'

const FAILURE_FAMILY_BY_CODE: Readonly<Record<CanonicalFailureCode, CanonicalFailureFamily>> = Object.freeze({
  UNKNOWN_SPEC: 'SPEC_REVISION',
  INELIGIBLE_REVISION: 'SPEC_REVISION',
  INVALID_DEPENDENCY_CLOSURE: 'DEPENDENCY_CLOSURE',
  INVALID_COMMAND_BASIS: 'COMMAND_BASIS',
  STALE_REVISION: 'COMMAND_BASIS',
})

export type CommandSpecStatus = 'KNOWN' | 'UNKNOWN'
export type CommandRevisionStatus = 'ELIGIBLE' | 'INELIGIBLE'
export type CommandDependencyClosureStatus = 'CLOSED' | 'OPEN' | 'INVALID'
export type CommandVerdictStatus = 'COMPATIBLE' | 'INCOMPATIBLE' | 'MISSING'

export type CommandErrorCode =
  | CanonicalFailureCode
  | 'INVALID_COMMAND_CORRELATION'

export class CommandDomainError extends Error {
  readonly code: CommandErrorCode

  constructor(code: CommandErrorCode, message: string) {
    super(message)
    this.name = 'CommandDomainError'
    this.code = code
  }
}

function requiredToken(value: unknown, label: string): string {
  if (typeof value !== 'string') {
    throw new CommandDomainError('INVALID_COMMAND_BASIS', `${label} is required.`)
  }

  const normalized = value.trim()
  if (!normalized || normalized.length > 200 || /[\r\n]/.test(normalized)) {
    throw new CommandDomainError('INVALID_COMMAND_BASIS', `${label} must be a non-empty single-line value.`)
  }

  return normalized
}

export interface CommandAuthorityFreshnessInput {
  readonly dependencyRevision: string
  readonly verdictRevision: string
}

export class CommandAuthorityFreshness {
  readonly dependencyRevision: string
  readonly verdictRevision: string

  private constructor(input: CommandAuthorityFreshnessInput) {
    this.dependencyRevision = requiredToken(input.dependencyRevision, 'Dependency revision')
    this.verdictRevision = requiredToken(input.verdictRevision, 'Verdict revision')
    Object.freeze(this)
  }

  static create(input: CommandAuthorityFreshnessInput): CommandAuthorityFreshness {
    if (!input || typeof input !== 'object') {
      throw new CommandDomainError('INVALID_COMMAND_BASIS', 'Command authority freshness is required.')
    }

    return new CommandAuthorityFreshness(input)
  }

  equals(other: CommandAuthorityFreshness): boolean {
    return this.dependencyRevision === other.dependencyRevision
      && this.verdictRevision === other.verdictRevision
  }
}

export class CommandCorrelation {
  readonly value: string

  private constructor(value: string) {
    this.value = value
    Object.freeze(this)
  }

  static create(value: unknown): CommandCorrelation {
    if (typeof value !== 'string') {
      throw new CommandDomainError('INVALID_COMMAND_CORRELATION', 'Command correlation is required.')
    }

    const normalized = value.trim()
    if (!normalized || normalized.length > 200 || /[\r\n]/.test(normalized)) {
      throw new CommandDomainError(
        'INVALID_COMMAND_CORRELATION',
        'Command correlation must be a non-empty single-line value.',
      )
    }

    return new CommandCorrelation(normalized)
  }

  equals(other: CommandCorrelation): boolean {
    return this.value === other.value
  }
}

export interface CommandPreconditionEvidenceInput {
  readonly specStatus: CommandSpecStatus
  readonly revisionStatus: CommandRevisionStatus
  readonly dependencyClosure: CommandDependencyClosureStatus
  readonly verdict: CommandVerdictStatus
}

export interface CommandAuthorityObservation {
  readonly identity: CanonicalIdentityReference
  readonly aggregateRevision: PipelineRevision
  readonly stage: string
  readonly preconditions: CommandPreconditionEvidence
  readonly freshness: CommandAuthorityFreshness
}

export interface CommandAuthorityPreconditionState {
  readonly identity: CanonicalIdentityReference
  readonly preconditions: CommandPreconditionEvidenceInput | CommandPreconditionEvidence
  readonly freshness: CommandAuthorityFreshnessInput | CommandAuthorityFreshness
}

/**
 * The source-facing lifecycle vocabulary is deliberately richer than the
 * consumer-facing revision status. Every state other than ELIGIBLE is mapped
 * to the existing fail-closed INELIGIBLE meaning by the productive source.
 */
export type CanonicalCommandRevisionState =
  | 'ELIGIBLE'
  | 'PROPOSED'
  | 'SUPERSEDED'
  | 'REVOKED'
  | 'INVALIDATED'

/**
 * Complete DOM-owned command facts before they are adapted to the existing
 * CommandAuthorityObservation contract.
 */
export interface CanonicalCommandAuthorityState {
  readonly identity: CanonicalIdentityReference
  readonly specStatus: CommandSpecStatus
  readonly revisionState: CanonicalCommandRevisionState
  readonly dependencyClosure: CommandDependencyClosureStatus
  readonly verdict: CommandVerdictStatus
  readonly freshness: CommandAuthorityFreshnessInput | CommandAuthorityFreshness
}

/**
 * Supplies the complete DOM-owned command facts for one canonical identity.
 * This is a read-only input boundary; it does not decide command policy.
 */
export interface CanonicalCommandAuthorityStateReader {
  read(identity: CanonicalIdentityReference): CommandAuthorityPreconditionState | undefined
}

/**
 * Productive DOM-owned source for command-authority facts.
 *
 * The catalog stores explicit lifecycle, closure, verdict, and freshness facts;
 * it never derives them from pipeline state or caller claims. Physical
 * durability remains a separate PLAT concern, but the local productive
 * composition has one concrete source of command authority rather than an
 * arbitrary reader supplied by a caller.
 */
export class CanonicalCommandAuthorityStateCatalog implements CanonicalCommandAuthorityStateReader {
  private readonly states = new Map<string, Readonly<{
    readonly identity: CanonicalIdentityReference
    readonly specStatus: CommandSpecStatus
    readonly revisionState: CanonicalCommandRevisionState
    readonly dependencyClosure: CommandDependencyClosureStatus
    readonly verdict: CommandVerdictStatus
    readonly freshness: CommandAuthorityFreshness
  }>>()
  private observations = 0

  constructor(initialStates: readonly CanonicalCommandAuthorityState[] = []) {
    if (!Array.isArray(initialStates)) {
      throw new CommandDomainError('INVALID_COMMAND_BASIS', 'Canonical command-authority states are required.')
    }

    initialStates.forEach((state) => this.register(state))
  }

  get readCount(): number {
    return this.observations
  }

  register(state: CanonicalCommandAuthorityState): void {
    const normalized = normalizeCommandAuthorityState(state)
    if (this.states.has(normalized.identity.canonicalKey)) {
      throw new CommandDomainError(
        'INVALID_COMMAND_BASIS',
        `Command-authority state ${normalized.identity.canonicalKey} already exists.`,
      )
    }
    this.states.set(normalized.identity.canonicalKey, normalized)
  }

  replace(state: CanonicalCommandAuthorityState): void {
    const normalized = normalizeCommandAuthorityState(state)
    if (!this.states.has(normalized.identity.canonicalKey)) {
      throw new CommandDomainError(
        'INVALID_COMMAND_BASIS',
        `Command-authority state ${normalized.identity.canonicalKey} does not exist.`,
      )
    }
    this.states.set(normalized.identity.canonicalKey, normalized)
  }

  remove(identity: CanonicalIdentityReference): void {
    const reference = CanonicalIdentityReference.create(identity)
    this.states.delete(reference.canonicalKey)
  }

  read(identity: CanonicalIdentityReference): CommandAuthorityPreconditionState | undefined {
    this.observations += 1

    let requested: CanonicalIdentityReference
    try {
      requested = CanonicalIdentityReference.create(identity)
    } catch {
      return undefined
    }
    if (requested.identity.kind !== 'STAGE') return undefined

    const state = this.states.get(requested.canonicalKey)
    if (!state) return undefined

    return Object.freeze({
      identity: state.identity,
      preconditions: CommandPreconditionEvidence.create({
        specStatus: state.specStatus,
        revisionStatus: state.revisionState === 'ELIGIBLE' ? 'ELIGIBLE' : 'INELIGIBLE',
        dependencyClosure: state.dependencyClosure,
        verdict: state.verdict,
      }),
      freshness: CommandAuthorityFreshness.create({
        dependencyRevision: state.freshness.dependencyRevision,
        verdictRevision: state.freshness.verdictRevision,
      }),
    })
  }
}

function normalizeCommandAuthorityState(
  state: CanonicalCommandAuthorityState,
): Readonly<{
  readonly identity: CanonicalIdentityReference
  readonly specStatus: CommandSpecStatus
  readonly revisionState: CanonicalCommandRevisionState
  readonly dependencyClosure: CommandDependencyClosureStatus
  readonly verdict: CommandVerdictStatus
  readonly freshness: CommandAuthorityFreshness
}> {
  if (!state || typeof state !== 'object') {
    throw new CommandDomainError('INVALID_COMMAND_BASIS', 'Canonical command-authority state is required.')
  }

  const identity = CanonicalIdentityReference.create(state.identity)
  if (identity.identity.kind !== 'STAGE') {
    throw new CommandDomainError('INVALID_COMMAND_BASIS', 'Command-authority state must carry a canonical STAGE identity.')
  }
  if (!['KNOWN', 'UNKNOWN'].includes(state.specStatus)
    || !['ELIGIBLE', 'PROPOSED', 'SUPERSEDED', 'REVOKED', 'INVALIDATED'].includes(state.revisionState)
    || !['CLOSED', 'OPEN', 'INVALID'].includes(state.dependencyClosure)
    || !['COMPATIBLE', 'INCOMPATIBLE', 'MISSING'].includes(state.verdict)) {
    throw new CommandDomainError('INVALID_COMMAND_BASIS', 'Canonical command-authority state must be complete and known.')
  }

  const freshness = CommandAuthorityFreshness.create({
    dependencyRevision: state.freshness?.dependencyRevision,
    verdictRevision: state.freshness?.verdictRevision,
  })

  return Object.freeze({
    identity,
    specStatus: state.specStatus,
    revisionState: state.revisionState,
    dependencyClosure: state.dependencyClosure,
    verdict: state.verdict,
    freshness,
  })
}

/**
 * Canonical DOM-owned command truth. A command may carry precondition claims,
 * but only this reader can supply the evidence used for acceptance.
 */
export interface CommandAuthorityReader {
  observe(identity: CanonicalIdentityReference): CommandAuthorityObservation | undefined
}

export class CommandPreconditionEvidence {
  readonly specStatus: CommandSpecStatus
  readonly revisionStatus: CommandRevisionStatus
  readonly dependencyClosure: CommandDependencyClosureStatus
  readonly verdict: CommandVerdictStatus

  private constructor(input: CommandPreconditionEvidenceInput) {
    this.specStatus = input.specStatus
    this.revisionStatus = input.revisionStatus
    this.dependencyClosure = input.dependencyClosure
    this.verdict = input.verdict
    Object.freeze(this)
  }

  static create(input: CommandPreconditionEvidenceInput): CommandPreconditionEvidence {
    if (!input
      || !['KNOWN', 'UNKNOWN'].includes(input.specStatus)
      || !['ELIGIBLE', 'INELIGIBLE'].includes(input.revisionStatus)
      || !['CLOSED', 'OPEN', 'INVALID'].includes(input.dependencyClosure)
      || !['COMPATIBLE', 'INCOMPATIBLE', 'MISSING'].includes(input.verdict)) {
      throw new CommandDomainError('INVALID_COMMAND_BASIS', 'Command precondition evidence must be complete and known.')
    }

    return new CommandPreconditionEvidence(input)
  }
}

export interface CommandBasisInput {
  readonly identity: CanonicalIdentityReference | CanonicalIdentityReferenceInput
  readonly expectedRevision: PipelineRevision | number
  readonly correlation: CommandCorrelation | string
  readonly preconditions: CommandPreconditionEvidenceInput | CommandPreconditionEvidence
}

export class CommandBasis {
  readonly identity: CanonicalIdentityReference
  readonly expectedRevision: PipelineRevision
  readonly correlation: CommandCorrelation
  readonly preconditions: CommandPreconditionEvidence

  private constructor(
    identity: CanonicalIdentityReference,
    expectedRevision: PipelineRevision,
    correlation: CommandCorrelation,
    preconditions: CommandPreconditionEvidence,
  ) {
    this.identity = identity
    this.expectedRevision = expectedRevision
    this.correlation = correlation
    this.preconditions = preconditions
    Object.freeze(this)
  }

  static create(input: CommandBasisInput): CommandBasis {
    if (!input || typeof input !== 'object') {
      throw new CommandDomainError('INVALID_COMMAND_BASIS', 'Command basis is required.')
    }

    const identity = input.identity instanceof CanonicalIdentityReference
      ? input.identity
      : CanonicalIdentityReference.create(input.identity)
    if (identity.identity.kind !== 'STAGE') {
      throw new CommandDomainError('INVALID_COMMAND_BASIS', 'Command basis must carry a canonical STAGE identity.')
    }

    const expectedRevision = input.expectedRevision instanceof PipelineRevision
      ? input.expectedRevision
      : PipelineRevision.create(input.expectedRevision)
    const correlation = input.correlation instanceof CommandCorrelation
      ? input.correlation
      : CommandCorrelation.create(input.correlation)
    const preconditions = input.preconditions instanceof CommandPreconditionEvidence
      ? input.preconditions
      : CommandPreconditionEvidence.create(input.preconditions)

    return new CommandBasis(identity, expectedRevision, correlation, preconditions)
  }

  get idempotencyKey(): string {
    return `${this.identity.canonicalKey}|aggregate-revision=${this.expectedRevision.value}|correlation=${this.correlation.value}`
  }
}

export interface CanonicalFailureSelection {
  readonly family: CanonicalFailureFamily
  readonly code: CanonicalFailureCode
  readonly reason: string
}

export class CanonicalCommandAuthorityError extends Error {
  readonly failure: CanonicalFailureSelection

  constructor(failure: CanonicalFailureSelection) {
    super(failure.reason)
    this.name = 'CanonicalCommandAuthorityError'
    this.failure = failure
  }
}

export class CommandPreconditionPolicy {
  evaluate(
    basis: CommandBasis,
    authority: CommandAuthorityObservation,
  ): CanonicalFailureSelection | undefined {
    if (!authority.identity.equals(basis.identity)) {
      return {
        family: 'COMMAND_BASIS',
        code: 'INVALID_COMMAND_BASIS',
        reason: 'The command identity does not match canonical authority.',
      }
    }
    if (basis.expectedRevision.value !== authority.aggregateRevision.value) {
      return {
        family: 'COMMAND_BASIS',
        code: 'STALE_REVISION',
        reason: 'The command aggregate revision is stale against canonical authority.',
      }
    }

    return this.evaluateEvidence(basis.preconditions)
  }

  evaluateEvidence(preconditions: CommandPreconditionEvidence): CanonicalFailureSelection | undefined {
    if (preconditions.specStatus === 'UNKNOWN') {
      return {
        family: 'SPEC_REVISION',
        code: 'UNKNOWN_SPEC',
        reason: 'The command SPEC or revision is not known to canonical authority.',
      }
    }
    if (preconditions.revisionStatus === 'INELIGIBLE') {
      return {
        family: 'SPEC_REVISION',
        code: 'INELIGIBLE_REVISION',
        reason: 'The command revision is not eligible for execution.',
      }
    }
    if (preconditions.dependencyClosure !== 'CLOSED') {
      return {
        family: 'DEPENDENCY_CLOSURE',
        code: 'INVALID_DEPENDENCY_CLOSURE',
        reason: 'The command dependency closure is not valid and complete.',
      }
    }
    if (preconditions.verdict !== 'COMPATIBLE') {
      return {
        family: 'COMMAND_BASIS',
        code: 'INVALID_COMMAND_BASIS',
        reason: 'The command basis is incompatible with the authoritative verdict.',
      }
    }

    return undefined
  }

  detectDrift(
    initial: CommandAuthorityObservation,
    current: CommandAuthorityObservation | undefined,
    basis: CommandBasis,
  ): CanonicalFailureSelection | undefined {
    if (!current) {
      return {
        family: 'SPEC_REVISION',
        code: 'UNKNOWN_SPEC',
        reason: 'The command identity is no longer known to canonical authority.',
      }
    }
    if (!current.identity.equals(initial.identity)) {
      return {
        family: 'COMMAND_BASIS',
        code: 'INVALID_COMMAND_BASIS',
        reason: 'Canonical command identity changed during execution.',
      }
    }
    if (current.aggregateRevision.value !== initial.aggregateRevision.value
      || current.stage !== initial.stage) {
      return {
        family: 'COMMAND_BASIS',
        code: 'STALE_REVISION',
        reason: 'Canonical command state changed before commit.',
      }
    }
    if (!current.freshness.equals(initial.freshness)) {
      return {
        family: 'COMMAND_BASIS',
        code: 'INVALID_COMMAND_BASIS',
        reason: 'Canonical command authority freshness changed before commit.',
      }
    }
    if (!samePreconditions(initial.preconditions, current.preconditions)) {
      return this.evaluateEvidence(current.preconditions) ?? {
        family: 'COMMAND_BASIS',
        code: 'INVALID_COMMAND_BASIS',
        reason: 'Canonical command precondition evidence changed before commit.',
      }
    }
    return this.evaluate(basis, current)
  }
}

function samePreconditions(
  left: CommandPreconditionEvidence,
  right: CommandPreconditionEvidence,
): boolean {
  return left.specStatus === right.specStatus
    && left.revisionStatus === right.revisionStatus
    && left.dependencyClosure === right.dependencyClosure
    && left.verdict === right.verdict
}

export class CanonicalCommandRejection {
  readonly family: CanonicalFailureFamily
  readonly code: CanonicalFailureCode
  readonly reason: string
  readonly basis: CommandBasis | undefined
  readonly correlation: CommandCorrelation
  readonly noEffect = true

  private constructor(input: {
    readonly family: CanonicalFailureFamily
    readonly code: CanonicalFailureCode
    readonly reason: string
    readonly basis: CommandBasis | undefined
    readonly correlation: CommandCorrelation
  }) {
    this.family = input.family
    this.code = input.code
    this.reason = input.reason
    this.basis = input.basis
    this.correlation = input.correlation
    Object.freeze(this)
  }

  static create(input: {
    readonly family: CanonicalFailureFamily
    readonly code: CanonicalFailureCode
    readonly reason: string
    readonly basis?: CommandBasis
    readonly correlation?: CommandCorrelation | string
  }): CanonicalCommandRejection {
    if (FAILURE_FAMILY_BY_CODE[input.code] !== input.family) {
      throw new CommandDomainError('INVALID_COMMAND_BASIS', 'Canonical failure family and code must match.')
    }

    const correlation = input.correlation instanceof CommandCorrelation
      ? input.correlation
      : input.correlation !== undefined
        ? CommandCorrelation.create(input.correlation)
        : input.basis?.correlation
    if (!correlation) {
      throw new CommandDomainError('INVALID_COMMAND_CORRELATION', 'A canonical rejection requires a valid correlation.')
    }

    return new CanonicalCommandRejection({
      ...input,
      basis: input.basis,
      correlation,
      reason: requiredToken(input.reason, 'Canonical rejection reason'),
    })
  }

  get idempotencyKey(): string {
    return `${this.basis?.idempotencyKey ?? `malformed-command|correlation=${this.correlation.value}`}|failure=${this.code}`
  }
}

export interface CommandRejectionRecord {
  readonly rejection: CanonicalCommandRejection
  readonly recorded: true
}

export interface CommandRejectionRecorder {
  record(rejection: CanonicalCommandRejection): Promise<CommandRejectionRecord>
}

export interface CanonicalCommandAccepted<T> {
  readonly status: 'ACCEPTED'
  readonly value: T
  readonly basis: CommandBasis
}

export interface CanonicalCommandRejected {
  readonly status: 'REJECTED'
  readonly rejection: CanonicalCommandRejection
  readonly record: CommandRejectionRecord
}

export type CanonicalCommandOutcome<T> = CanonicalCommandAccepted<T> | CanonicalCommandRejected
