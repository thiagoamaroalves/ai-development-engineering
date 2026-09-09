import {
  CanonicalIdentityCatalog,
  CanonicalIdentityRecord,
  CanonicalIdentityReferenceInput,
  CreateCanonicalIdentityRequest,
} from '../domain/identity.js'

declare const execOwnedIdentityReferenceBrand: unique symbol

export type ExecOwnedIdentityKind = 'ASSIGNMENT' | 'SESSION'

export interface ExecOwnedIdentityReference {
  readonly [execOwnedIdentityReferenceBrand]: true
  readonly owner: 'EXEC'
  readonly kind: ExecOwnedIdentityKind
  readonly value: string
  readonly revision: number
}

export class CreateCanonicalIdentityHandler {
  constructor(private readonly catalog: CanonicalIdentityCatalog) {}

  async handle(request: CreateCanonicalIdentityRequest): Promise<CanonicalIdentityRecord> {
    return this.catalog.create(request)
  }
}

export class ResolveCanonicalIdentityHandler {
  constructor(private readonly catalog: CanonicalIdentityCatalog) {}

  handle(reference: CanonicalIdentityReferenceInput): CanonicalIdentityRecord {
    return this.catalog.resolve(reference)
  }
}
