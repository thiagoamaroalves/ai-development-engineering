import {
  AdrSpecLineage,
  AdrSpecLineageInput,
  AdrSpecLineageRepository,
  LineageDomainError,
} from '../domain/lineage.js'
import {
  CanonicalIdentityCatalog,
  CanonicalIdentityReconstructionAuthority,
} from '../domain/identity.js'

export class RegisterAdrSpecLineageHandler {
  constructor(
    private readonly repository: AdrSpecLineageRepository,
    private readonly identityCatalog: CanonicalIdentityCatalog,
  ) {}

  async handle(input: AdrSpecLineageInput): Promise<AdrSpecLineage> {
    const adr = this.identityCatalog.resolve(input.adr)
    const spec = this.identityCatalog.resolve(input.spec)
    const lineage = AdrSpecLineage.create({
      adr: { identity: adr.identity, revision: adr.revision },
      spec: { identity: spec.identity, revision: spec.revision },
    })
    const reservation = await this.repository.reserve(lineage)
    if (reservation.status === 'DUPLICATE') {
      throw new LineageDomainError('LINEAGE_ALREADY_EXISTS', `ADR↔SPEC lineage ${lineage.canonicalKey} already exists.`)
    }

    return reservation.lineage
  }
}

export interface AdvanceAdrSpecLineageRequest {
  readonly adr: AdrSpecLineageInput['adr']
  readonly spec: AdrSpecLineageInput['spec']
}

export class AdvanceAdrSpecLineageHandler {
  constructor(
    private readonly repository: AdrSpecLineageRepository,
    private readonly identityAuthority: CanonicalIdentityReconstructionAuthority,
  ) {}

  handle(input: AdvanceAdrSpecLineageRequest): AdrSpecLineage {
    const adr = this.identityAuthority.resolveForRehydration(input.adr).reference
    const spec = this.identityAuthority.resolveForRehydration(input.spec).reference
    const relation = AdrSpecLineage.create({ adr, spec })
    const existing = this.repository.find(relation.adr, relation.spec)
    if (!existing) {
      throw new LineageDomainError('LINEAGE_NOT_FOUND', 'ADR↔SPEC lineage could not be resolved for progress.')
    }

    const expectedProgress = existing.progress
    const advanced = existing.advance()
    const reservation = this.repository.advance(advanced, expectedProgress)
    if (reservation.status === 'STALE') {
      throw new LineageDomainError('LINEAGE_CONCURRENT_MODIFICATION', 'ADR↔SPEC lineage changed before progress was committed.')
    }
    if (reservation.status === 'NOT_FOUND') {
      throw new LineageDomainError('LINEAGE_NOT_FOUND', 'ADR↔SPEC lineage could not be resolved for progress.')
    }

    return reservation.lineage
  }
}
