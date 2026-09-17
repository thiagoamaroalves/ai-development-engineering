import {
  CanonicalCommandBoundary,
} from './command.js'
import {
  PipelineDomainError,
  PipelineRepository,
  PipelineRevision,
  PipelineStage,
  PipelineStateDerivationPolicy,
  PipelineStateInputs,
  PipelineStateReader,
  DerivedWorkflowState,
  WorkflowPipelineIdentityInput,
  WorkflowPipeline,
} from '../domain/pipeline.js'
import {
  CanonicalIdentityReference,
  CanonicalIdentityReconstructionAuthority,
  CanonicalStageReference,
  CanonicalStageReferenceInput,
  CanonicalIdentityReferenceInput,
} from '../domain/identity.js'
import {
  CanonicalFailureSelection,
  CanonicalCommandOutcome,
  CanonicalCommandAuthorityError,
  CommandBasis,
  CommandAuthorityObservation,
  CommandAuthorityReader,
  CommandPreconditionEvidenceInput,
  CommandPreconditionPolicy,
  CommandRejectionRecorder,
} from '../domain/command.js'
import { IdentityDomainError } from '../domain/identity.js'

export interface AdvancePipelineCommand {
  readonly identity: WorkflowPipelineIdentityInput
  readonly target: string
  readonly expectedRevision: number
  readonly correlation: string
  readonly preconditions: CommandPreconditionEvidenceInput
}

export class AdvancePipelineHandler {
  constructor(
    private readonly pipelines: PipelineRepository,
    private readonly identities: CanonicalIdentityReconstructionAuthority,
    rejectionRecorder: CommandRejectionRecorder,
    private readonly authority: CommandAuthorityReader,
  ) {
    this.policy = new CommandPreconditionPolicy()
    this.commands = new CanonicalCommandBoundary(rejectionRecorder, this.policy)
  }

  private readonly commands: CanonicalCommandBoundary
  private readonly policy: CommandPreconditionPolicy

  async handle(command: AdvancePipelineCommand): Promise<CanonicalCommandOutcome<WorkflowPipeline>> {
    return this.commands.execute(
      command,
      (input) => canonicalCommandIdentity(input, this.identities),
      this.authority,
      async (basis, initial) => this.advance(basis, initial, command.target),
      mapPipelineError,
    )
  }

  private async advance(
    basis: CommandBasis,
    initial: CommandAuthorityObservation,
    target: string,
  ): Promise<WorkflowPipeline> {
    const currentAuthority = this.authority.observe(basis.identity)
    const drift = this.policy.detectDrift(initial, currentAuthority, basis)
    if (drift) throw new CanonicalCommandAuthorityError(drift)

    const identity = resolvePipelineIdentity(basis.identity, this.identities)
    const current = this.pipelines.find(identity)
    if (!current) {
      throw new PipelineDomainError('PIPELINE_NOT_FOUND', `Pipeline ${identity.canonicalKey} could not be resolved.`)
    }

    const transition = current.advanceTo(PipelineStage.create(target))
    const result = await this.pipelines.advance(transition.proposed, basis.expectedRevision)
    if (result.status === 'STALE') {
      throw new PipelineDomainError('PIPELINE_STALE', `Pipeline ${identity.canonicalKey} has a stale revision.`)
    }
    if (result.status === 'NOT_FOUND') {
      throw new PipelineDomainError('PIPELINE_NOT_FOUND', `Pipeline ${identity.canonicalKey} could not be persisted.`)
    }

    return result.pipeline
  }
}

export interface GetPipelineStateQuery {
  readonly identity: WorkflowPipelineIdentityInput
}

export class GetPipelineStateHandler {
  constructor(
    private readonly pipelines: PipelineRepository,
    private readonly states: PipelineStateReader,
    private readonly identities: CanonicalIdentityReconstructionAuthority,
  ) {}

  handle(query: GetPipelineStateQuery): DerivedWorkflowState {
    const identity = resolvePipelineIdentity(query.identity, this.identities)
    const pipeline = this.pipelines.find(identity)
    const inputs: PipelineStateInputs | undefined = this.states.read(identity)
    if (!pipeline || !inputs) {
      throw new PipelineDomainError('PIPELINE_NOT_FOUND', `Pipeline ${identity.canonicalKey} state could not be resolved.`)
    }

    return PipelineStateDerivationPolicy.derive(pipeline, inputs)
  }
}

function resolvePipelineIdentity(
  input: WorkflowPipelineIdentityInput,
  identities: CanonicalIdentityReconstructionAuthority,
): CanonicalIdentityReference {
  const candidate = WorkflowPipeline.create({ identity: input }, identities).identity
  const resolved = identities.resolveForRehydration(candidate)
  if (!resolved.reference.equals(candidate) || resolved.identity.kind !== 'STAGE') {
    throw new PipelineDomainError(
      'INVALID_PIPELINE_IDENTITY',
      'WorkflowPipeline identity must resolve to its canonical STAGE record.',
    )
  }

  return resolved.reference
}

function canonicalCommandIdentity(
  input: unknown,
  identities: CanonicalIdentityReconstructionAuthority,
): CanonicalIdentityReference {
  const candidate = canonicalCommandReference(input)
  const resolved = identities.resolveForRehydration(candidate)
  if (!resolved.reference.equals(candidate) || resolved.identity.kind !== 'STAGE') {
    throw new PipelineDomainError(
      'INVALID_PIPELINE_IDENTITY',
      'Command basis must resolve to its canonical STAGE identity.',
    )
  }
  return resolved.reference
}

function canonicalCommandReference(input: unknown): CanonicalIdentityReference {
  if (input instanceof CanonicalStageReference) return input.reference
  if (input && typeof input === 'object' && 'executionId' in input) {
    return CanonicalStageReference.create(input as CanonicalStageReferenceInput).reference
  }
  if (input && typeof input === 'object' && 'identity' in input) {
    return CanonicalIdentityReference.create(input as CanonicalIdentityReferenceInput)
  }
  throw new PipelineDomainError('INVALID_PIPELINE_IDENTITY', 'Command basis must carry a canonical STAGE identity.')
}

function mapPipelineError(error: unknown, _basis: CommandBasis | undefined): CanonicalFailureSelection | undefined {
  if (error instanceof CanonicalCommandAuthorityError) return error.failure
  if (error instanceof PipelineDomainError) {
    if (error.code === 'PIPELINE_STALE') {
      return {
        family: 'COMMAND_BASIS',
        code: 'STALE_REVISION',
        reason: error.message,
      }
    }
    if (error.code === 'PIPELINE_NOT_FOUND') {
      return {
        family: 'SPEC_REVISION',
        code: 'UNKNOWN_SPEC',
        reason: error.message,
      }
    }
    return {
      family: 'COMMAND_BASIS',
      code: 'INVALID_COMMAND_BASIS',
      reason: error.message,
    }
  }

  if (error instanceof IdentityDomainError) {
    return {
      family: error.code === 'IDENTITY_NOT_FOUND' ? 'SPEC_REVISION' : 'COMMAND_BASIS',
      code: error.code === 'IDENTITY_NOT_FOUND' ? 'UNKNOWN_SPEC' : 'INVALID_COMMAND_BASIS',
      reason: error.message,
    }
  }

  return undefined
}
