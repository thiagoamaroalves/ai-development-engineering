import {
  CanonicalIdentityReconstructionAuthority,
} from '../domain/identity.js'
import {
  PipelineRepository,
} from '../domain/pipeline.js'
import {
  CommandRejectionRecorder,
  CanonicalCommandAuthorityStateCatalog,
} from '../domain/command.js'
import { AdvancePipelineHandler } from './pipeline.js'
import {
  CanonicalCommandAuthorityReader,
  CanonicalCommandAuthorityStateSource,
} from './command-authority.js'

export interface AdvancePipelineCompositionDependencies {
  readonly pipelines: PipelineRepository
  readonly identities: CanonicalIdentityReconstructionAuthority
  readonly rejectionRecorder: CommandRejectionRecorder
  /** Complete DOM-owned command-authority facts from the productive producer. */
  readonly authorityState: CanonicalCommandAuthorityStateCatalog
}

/**
 * Builds the production command object graph. The consumer-facing reader is
 * created here, while the complete producer facts remain the sole authority
 * for statuses and freshness.
 */
export function createAdvancePipelineHandler(
  dependencies: AdvancePipelineCompositionDependencies,
): AdvancePipelineHandler {
  if (!dependencies || !dependencies.pipelines || !dependencies.identities
    || !dependencies.rejectionRecorder
    || !(dependencies.authorityState instanceof CanonicalCommandAuthorityStateCatalog)) {
    throw new TypeError('The runtime composition requires canonical pipeline, identity, authority-state catalog, and rejection dependencies.')
  }

  const authorityState = new CanonicalCommandAuthorityStateSource(dependencies.authorityState)
  const authority = new CanonicalCommandAuthorityReader(
    dependencies.identities,
    dependencies.pipelines,
    authorityState,
  )

  return new AdvancePipelineHandler(
    dependencies.pipelines,
    dependencies.identities,
    dependencies.rejectionRecorder,
    authority,
  )
}
