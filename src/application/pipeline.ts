import {
  PipelineDomainError,
  PipelineId,
  PipelineRepository,
  PipelineRevision,
  PipelineStage,
  PipelineStateDerivationPolicy,
  PipelineStateInputs,
  PipelineStateReader,
  DerivedWorkflowState,
  WorkflowPipeline,
} from '../domain/pipeline.js'

export interface AdvancePipelineCommand {
  readonly id: string
  readonly target: string
  readonly expectedRevision: number
}

export class AdvancePipelineHandler {
  constructor(private readonly pipelines: PipelineRepository) {}

  async handle(command: AdvancePipelineCommand): Promise<WorkflowPipeline> {
    const id = PipelineId.create(command.id)
    const current = this.pipelines.find(id)
    if (!current) {
      throw new PipelineDomainError('PIPELINE_NOT_FOUND', `Pipeline ${id.value} could not be resolved.`)
    }

    const transition = current.advanceTo(PipelineStage.create(command.target))
    const result = await this.pipelines.advance(
      transition.proposed,
      PipelineRevision.create(command.expectedRevision),
    )
    if (result.status === 'STALE') {
      throw new PipelineDomainError('PIPELINE_STALE', `Pipeline ${id.value} has a stale revision.`)
    }
    if (result.status === 'NOT_FOUND') {
      throw new PipelineDomainError('PIPELINE_NOT_FOUND', `Pipeline ${id.value} could not be persisted.`)
    }

    return result.pipeline
  }
}

export interface GetPipelineStateQuery {
  readonly id: string
}

export class GetPipelineStateHandler {
  constructor(
    private readonly pipelines: PipelineRepository,
    private readonly states: PipelineStateReader,
  ) {}

  handle(query: GetPipelineStateQuery): DerivedWorkflowState {
    const id = PipelineId.create(query.id)
    const pipeline = this.pipelines.find(id)
    const inputs: PipelineStateInputs | undefined = this.states.read(id)
    if (!pipeline || !inputs) {
      throw new PipelineDomainError('PIPELINE_NOT_FOUND', `Pipeline ${id.value} state could not be resolved.`)
    }

    return PipelineStateDerivationPolicy.derive(pipeline, inputs)
  }
}
