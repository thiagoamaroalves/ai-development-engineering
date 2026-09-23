import {
  CatalogBasis,
  CatalogScope,
  ExecRegistryDomainError,
  RegistryEntry,
  RegistryResolutionService,
  isAuthenticatedCatalogScope,
  type RegistryRegistrationResult,
  type RegistryResolutionRequest,
  type RegistryResolutionResult,
  registerRegistryEntry,
} from '../domain/exec-registry.ts'
import {
  NORMAL_CATALOG_SOURCE,
  SYSTEM_BOOTSTRAP_CATALOG_SOURCE,
  type BootstrapCatalogSource,
  type CatalogBasisSourceKind,
  type NormalCatalogSource,
  isProducerIssuedCatalogBasisReceipt,
} from './exec-registry-ports.ts'

export interface ResolveExecCapabilityInput extends RegistryResolutionRequest {
  /** The requested scope is context, never a source of catalog authority. */
  readonly scope: CatalogScope
  /** Kept only as a consistency assertion for NORMAL requests. */
  readonly repositoryId?: string
  /** The exact frozen basis revision requested by the execution. */
  readonly catalogRevision: unknown
}

export class ResolveExecCapability {
  private readonly resolver: RegistryResolutionService
  private readonly bootstrapCatalog?: BootstrapCatalogSource
  private readonly normalCatalog?: NormalCatalogSource

  constructor(
    resolver: RegistryResolutionService,
    bootstrapCatalog?: BootstrapCatalogSource,
    normalCatalog?: NormalCatalogSource,
  ) {
    this.resolver = resolver
    this.bootstrapCatalog = bootstrapCatalog
    this.normalCatalog = normalCatalog
  }

  resolve(input: ResolveExecCapabilityInput): RegistryResolutionResult {
    try {
      const basis = this.selectBasis(input)
      return this.resolver.resolve(basis, input)
    } catch (error) {
      const basis = this.failureBasis(input)
      const reason = error instanceof Error ? error.message : 'Catalog source failure.'
      return this.resolver.failure(basis, 'CONTRACT_INVALID', reason)
    }
  }

  private selectBasis(input: ResolveExecCapabilityInput): CatalogBasis {
    if (!input || typeof input !== 'object') {
      throw new ExecRegistryDomainError('A complete resolution context is required.')
    }
    if (Object.prototype.hasOwnProperty.call(input, 'basis')) {
      throw new ExecRegistryDomainError('Caller-supplied catalog basis is not an authority path.')
    }
    if (!isAuthenticatedCatalogScope(input.scope)) {
      throw new ExecRegistryDomainError('An authenticated catalog scope is required.')
    }
    if (input.scope.name === 'BOOTSTRAP') {
      if (input.repositoryId !== undefined || !this.bootstrapCatalog) {
        throw new ExecRegistryDomainError('An authorized system bootstrap catalog source is required.')
      }
      const receipt = this.bootstrapCatalog.read()
      return this.assertAuthorizedBasis(
        this.bootstrapCatalog,
        receipt,
        input.scope,
        input.catalogRevision,
        'SYSTEM_BOOTSTRAP_CATALOG',
        SYSTEM_BOOTSTRAP_CATALOG_SOURCE,
      )
    }
    if (input.repositoryId !== undefined && input.repositoryId !== input.scope.repositoryId) {
      throw new ExecRegistryDomainError('The requested RepositoryId does not match the requested NORMAL scope.')
    }
    if (!this.normalCatalog) {
      throw new ExecRegistryDomainError('An authorized normal catalog source is required.')
    }
    const receipt = this.normalCatalog.read()
    return this.assertAuthorizedBasis(
      this.normalCatalog,
      receipt,
      input.scope,
      input.catalogRevision,
      'REPO_NORMAL_CATALOG',
      NORMAL_CATALOG_SOURCE,
    )
  }

  private assertAuthorizedBasis(
    source: object,
    receipt: unknown,
    requestedScope: CatalogScope,
    requestedRevision: unknown,
    expectedKind: CatalogBasisSourceKind,
    expectedSource: string,
  ): CatalogBasis {
    if (!isProducerIssuedCatalogBasisReceipt(source, receipt, expectedKind)) {
      throw new ExecRegistryDomainError('Catalog source returned unverified material.')
    }
    const basis = receipt.basis
    if (!basis.scope.equals(requestedScope)) {
      throw new ExecRegistryDomainError('Catalog source returned material for a different scope.')
    }
    if (!Number.isSafeInteger(requestedRevision) || requestedRevision !== basis.catalogRevision) {
      throw new ExecRegistryDomainError('Catalog source returned a stale or unexpected catalog revision.')
    }
    if (basis.source !== expectedSource) {
      throw new ExecRegistryDomainError(`Catalog source must be issued by ${expectedSource}.`)
    }
    return basis
  }

  private failureBasis(input: Partial<ResolveExecCapabilityInput>): CatalogBasis {
    const scope = isAuthenticatedCatalogScope(input.scope) ? input.scope : CatalogScope.bootstrap()
    return CatalogBasis.create({ scope, source: 'EXEC_FAILURE_CONTEXT' })
  }
}

export class RegisterExecCapability {
  register(basis: CatalogBasis, entry: RegistryEntry): RegistryRegistrationResult {
    return registerRegistryEntry(basis, entry)
  }
}
