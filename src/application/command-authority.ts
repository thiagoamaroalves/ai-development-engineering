import {
  CanonicalCommandAuthorityStateCatalog,
  CanonicalCommandAuthorityStateReader,
  CommandAuthorityFreshness,
  CommandAuthorityObservation,
  CommandAuthorityReader,
  CommandAuthorityPreconditionState,
  CommandPreconditionEvidence,
} from '../domain/command.js'
import {
  CanonicalIdentityReference,
  CanonicalIdentityReconstructionAuthority,
} from '../domain/identity.js'
import {
  PipelineRepository,
  PipelineRevision,
  PipelineStage,
} from '../domain/pipeline.js'

/**
 * Binds the complete DOM-owned command-authority producer to the observation
 * adapter. The producer is deliberately supplied as a narrow state-reader
 * port: this adapter must not manufacture lifecycle, dependency, verdict, or
 * freshness facts from pipeline state.
 */
export class CanonicalCommandAuthorityStateSource implements CanonicalCommandAuthorityStateReader {
  constructor(private readonly producer: CanonicalCommandAuthorityStateCatalog) {
    if (!(producer instanceof CanonicalCommandAuthorityStateCatalog)) {
      throw new TypeError('The productive command-authority source requires the canonical DOM state catalog.')
    }
  }

  read(identity: CanonicalIdentityReference): CommandAuthorityPreconditionState | undefined {
    try {
      const requested = CanonicalIdentityReference.create(identity)
      if (requested.identity.kind !== 'STAGE') return undefined

      const state = this.producer.read(requested)
      if (!state) return undefined

      const stateIdentity = CanonicalIdentityReference.create(state.identity)
      if (!stateIdentity.equals(requested) || stateIdentity.identity.kind !== 'STAGE') {
        return undefined
      }

      const preconditions = CommandPreconditionEvidence.create(state.preconditions)
      const freshness = CommandAuthorityFreshness.create(state.freshness)

      return Object.freeze({
        identity: stateIdentity,
        preconditions,
        freshness,
      })
    } catch {
      return undefined
    }
  }
}

/**
 * Composes the canonical identity, pipeline state, and command-authority facts
 * into the consumer-facing command observation.
 *
 * Every call performs fresh reads. Missing or malformed source material is
 * deliberately represented as no observation so callers cannot obtain a
 * partially authoritative result or fall back to their own claims.
 */
export class CanonicalCommandAuthorityReader implements CommandAuthorityReader {
  constructor(
    private readonly identities: CanonicalIdentityReconstructionAuthority,
    private readonly pipelines: PipelineRepository,
    private readonly authorityState: CanonicalCommandAuthorityStateSource,
  ) {}

  observe(identity: CanonicalIdentityReference): CommandAuthorityObservation | undefined {
    try {
      const requested = CanonicalIdentityReference.create(identity)
      if (requested.identity.kind !== 'STAGE') return undefined

      const canonical = this.identities.resolveForRehydration(requested)
      if (!canonical.reference.equals(requested) || canonical.identity.kind !== 'STAGE') {
        return undefined
      }

      const pipeline = this.pipelines.find(canonical.reference)
      if (!pipeline
        || !pipeline.identity.equals(canonical.reference)
        || pipeline.identity.identity.kind !== 'STAGE') {
        return undefined
      }

      const stage = PipelineStage.create(pipeline.stage.value)
      const aggregateRevision = PipelineRevision.create(pipeline.revision.value)
      const state = this.authorityState.read(canonical.reference)
      if (!state) return undefined

      const stateIdentity = CanonicalIdentityReference.create(state.identity)
      if (!stateIdentity.equals(canonical.reference) || stateIdentity.identity.kind !== 'STAGE') {
        return undefined
      }

      const preconditions = CommandPreconditionEvidence.create(state.preconditions)
      const freshness = CommandAuthorityFreshness.create(state.freshness)

      return Object.freeze({
        identity: canonical.reference,
        aggregateRevision,
        stage: stage.value,
        preconditions,
        freshness,
      })
    } catch {
      return undefined
    }
  }
}
