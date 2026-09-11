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
} from '../domain/identity.js'

export interface AdvancePipelineCommand {
  readonly identity: WorkflowPipelineIdentityInput
  readonly target: string
  readonly expectedRevision: number
}

export class AdvancePipelineHandler {
  constructor(
    private readonly pipelines: PipelineRepository,
    private readonly identities: CanonicalIdentityReconstructionAuthority,
  ) {}

  async handle(command: AdvancePipelineCommand): Promise<WorkflowPipeline> {
    const identity = resolvePipelineIdentity(command.identity, this.identities)
    const current = this.pipelines.find(identity)
    if (!current) {
      throw new PipelineDomainError('PIPELINE_NOT_FOUND', `Pipeline ${identity.canonicalKey} could not be resolved.`)
    }

    const transition = current.advanceTo(PipelineStage.create(command.target))
    const result = await this.pipelines.advance(
      transition.proposed,
      PipelineRevision.create(command.expectedRevision),
    )
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
