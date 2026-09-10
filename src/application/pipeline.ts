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
import type { CanonicalIdentityReference } from '../domain/identity.js'

export interface AdvancePipelineCommand {
  readonly identity: WorkflowPipelineIdentityInput
  readonly target: string
  readonly expectedRevision: number
}

export class AdvancePipelineHandler {
  constructor(private readonly pipelines: PipelineRepository) {}

  async handle(command: AdvancePipelineCommand): Promise<WorkflowPipeline> {
    const identity = WorkflowPipeline.create({ identity: command.identity }).identity
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
  ) {}

  handle(query: GetPipelineStateQuery): DerivedWorkflowState {
    const identity: CanonicalIdentityReference = WorkflowPipeline.create({ identity: query.identity }).identity
    const pipeline = this.pipelines.find(identity)
    const inputs: PipelineStateInputs | undefined = this.states.read(identity)
    if (!pipeline || !inputs) {
      throw new PipelineDomainError('PIPELINE_NOT_FOUND', `Pipeline ${identity.canonicalKey} state could not be resolved.`)
    }

    return PipelineStateDerivationPolicy.derive(pipeline, inputs)
  }
}
