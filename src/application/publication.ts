import { CanonicalIdentityReference, CanonicalIdentityReferenceInput } from '../domain/identity.js'
import {
  Publication,
  PublicationDomainError,
  PublicationRepository,
  PublicationStateName,
  PublicationTransitionAuthorization,
  RemotePublicationConfirmation,
  RemotePublicationConfirmationInput,
} from '../domain/publication.js'

export interface PublicationCommand {
  readonly identity: CanonicalIdentityReferenceInput | CanonicalIdentityReference
  readonly target: PublicationStateName
  readonly expectedRevision: number
  readonly transitionId: string
  readonly authorization?: PublicationTransitionAuthorization
}

export type PublicationOutcome =
  | { readonly status: 'ACCEPTED'; readonly publication: Publication }
  | { readonly status: 'REJECTED'; readonly reason: string; readonly code: string }

export interface GitPublicationEvidence extends RemotePublicationConfirmationInput {}

export class GitPublicationEvidenceMapper {
  map(evidence: GitPublicationEvidence | RemotePublicationConfirmation): RemotePublicationConfirmation {
    return RemotePublicationConfirmation.create(evidence)
  }
}

export class PublicationCommandHandler {
  constructor(
    private readonly publications: PublicationRepository,
    private readonly gitEvidenceMapper: GitPublicationEvidenceMapper = new GitPublicationEvidenceMapper(),
  ) {}

  async handle(command: PublicationCommand): Promise<PublicationOutcome> {
    try {
      const identity = command.identity instanceof CanonicalIdentityReference ? command.identity : CanonicalIdentityReference.create(command.identity)
      if (identity.identity.kind !== 'PUBLICATION') {
        throw new PublicationDomainError('INVALID_PUBLICATION_IDENTITY', 'Publication identity must have kind PUBLICATION.')
      }
      const current = this.publications.find(identity)
      if (!current) return { status: 'REJECTED', reason: `Publication ${identity.canonicalKey} was not found.`, code: 'PUBLICATION_NOT_FOUND' }
      const authorization = command.authorization?.remoteConfirmation === undefined
        ? command.authorization
        : {
            ...command.authorization,
            remoteConfirmation: this.gitEvidenceMapper.map(command.authorization.remoteConfirmation),
          }
      const proposed = current.transition({ target: command.target, expectedRevision: command.expectedRevision, transitionId: command.transitionId, authorization })
      if (proposed === current) return { status: 'ACCEPTED', publication: current }
      const result = await this.publications.advance(proposed, current.revision)
      if (result.status === 'STALE') return { status: 'REJECTED', reason: 'Publication has a stale revision.', code: 'PUBLICATION_STALE' }
      if (result.status === 'NOT_FOUND') return { status: 'REJECTED', reason: 'Publication was not found.', code: 'PUBLICATION_NOT_FOUND' }
      return { status: 'ACCEPTED', publication: result.publication }
    } catch (error) {
      const domainError = error instanceof PublicationDomainError ? error : new PublicationDomainError('INVALID_PUBLICATION_TRANSITION', error instanceof Error ? error.message : 'Publication transition rejected.')
      return { status: 'REJECTED', reason: domainError.message, code: domainError.code }
    }
  }
}
