import {
  CanonicalCommandRejection,
  CanonicalCommandOutcome,
  CanonicalFailureSelection,
  CommandBasis,
  CommandBasisInput,
  CommandAuthorityObservation,
  CommandAuthorityReader,
  CommandCorrelation,
  CommandPreconditionEvidenceInput,
  CommandPreconditionPolicy,
  CommandRejectionRecorder,
} from '../domain/command.js'
import { CanonicalIdentityReference } from '../domain/identity.js'

export type CanonicalCommandErrorMapper = (
  error: unknown,
  basis: CommandBasis | undefined,
) => CanonicalFailureSelection | undefined

/** Coordinates canonical precondition results and rejection recording. */
export class CanonicalCommandBoundary {
  constructor(
    private readonly recorder: CommandRejectionRecorder,
    private readonly policy: CommandPreconditionPolicy = new CommandPreconditionPolicy(),
  ) {}

  async execute<T>(
    input: unknown,
    resolveIdentity: (input: unknown) => CanonicalIdentityReference,
    authority: CommandAuthorityReader,
    action: (basis: CommandBasis, initial: CommandAuthorityObservation) => Promise<T>,
    mapError: CanonicalCommandErrorMapper,
  ): Promise<CanonicalCommandOutcome<T>> {
    const correlation = this.readCorrelation(input)
    let basis: CommandBasis | undefined
    try {
      const raw = this.readInput(input)
      const identity = resolveIdentity(raw.identity)
      const expectedRevision = raw.expectedRevision
      const callerEvidence = raw.preconditions as CommandPreconditionEvidenceInput
      // Validate the request shape, but never use caller claims as authority.
      const requestedBasis = CommandBasis.create({
        identity,
        expectedRevision: expectedRevision as CommandBasisInput['expectedRevision'],
        correlation,
        preconditions: callerEvidence,
      } as CommandBasisInput)
      const observed = authority.observe(identity)
      if (!observed) {
        return this.reject(requestedBasis, {
          family: 'SPEC_REVISION',
          code: 'UNKNOWN_SPEC',
          reason: 'The command identity is not known to canonical authority.',
        })
      }

      basis = CommandBasis.create({
        identity: observed.identity,
        expectedRevision: expectedRevision as CommandBasisInput['expectedRevision'],
        correlation,
        preconditions: observed.preconditions,
      } as CommandBasisInput)
      const preconditionFailure = this.policy.evaluate(basis, observed)
      if (preconditionFailure) {
        return this.reject(basis, preconditionFailure)
      }

      try {
        const value = await action(basis, observed)
        return Object.freeze({ status: 'ACCEPTED' as const, value, basis })
      } catch (error) {
        const failure = mapError(error, basis)
        if (!failure) throw error
        return this.reject(basis, failure)
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'CommandDomainError'
        && (error as { code?: string }).code === 'INVALID_COMMAND_CORRELATION') {
        throw error
      }
      const failure = mapError(error, basis)
      if (failure) return this.reject(basis, failure, correlation.value)
      return this.reject(undefined, {
        family: 'COMMAND_BASIS',
        code: 'INVALID_COMMAND_BASIS',
        reason: error instanceof Error ? error.message : 'The command basis is malformed.',
      }, correlation)
    }
  }

  private async reject(
    basis: CommandBasis | undefined,
    failure: CanonicalFailureSelection,
    correlation?: string | CommandCorrelation,
  ): Promise<Extract<CanonicalCommandOutcome<unknown>, { status: 'REJECTED' }>> {
    const rejection = CanonicalCommandRejection.create({ ...failure, basis, correlation })
    const record = await this.recorder.record(rejection)
    return Object.freeze({ status: 'REJECTED' as const, rejection, record })
  }

  private readCorrelation(input: unknown) {
    const correlation = input && typeof input === 'object'
      ? (input as { correlation?: unknown }).correlation
      : undefined
    return CommandCorrelation.create(correlation)
  }

  private readInput(input: unknown): {
    readonly identity: unknown
    readonly expectedRevision: unknown
    readonly preconditions: unknown
  } {
    if (!input || typeof input !== 'object') {
      throw new Error('The command input is required.')
    }
    return input as {
      readonly identity: unknown
      readonly expectedRevision: unknown
      readonly preconditions: unknown
    }
  }
}
