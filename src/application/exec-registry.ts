import {
  CatalogBasis,
  CatalogScope,
  ExecRegistryDomainError,
  RegistryEntry,
  RegistryResolutionService,
  isAuthenticatedCatalogBasis,
  isAuthenticatedCatalogScope,
  type RegistryRegistrationResult,
  type RegistryResolutionRequest,
  type RegistryResolutionResult,
  registerRegistryEntry,
} from '../domain/exec-registry.ts'
import {
  EXECUTION_CATALOG_BASIS_SOURCE,
  NORMAL_CATALOG_SOURCE,
  type ExecutionCatalogBasisReader,
  type NormalCatalogSource,
} from './exec-registry-ports.ts'

export interface ResolveExecCapabilityInput extends RegistryResolutionRequest {
  /** The requested scope is context, never a source of catalog authority. */
  readonly scope: CatalogScope
  /** Kept only as a consistency assertion for NORMAL requests. */
  readonly repositoryId?: string
}

export class ResolveExecCapability {
  private readonly resolver: RegistryResolutionService
  private readonly executionBasis?: ExecutionCatalogBasisReader
  private readonly normalCatalog?: NormalCatalogSource

  constructor(
    resolver: RegistryResolutionService,
    executionBasis?: ExecutionCatalogBasisReader,
    normalCatalog?: NormalCatalogSource,
  ) {
    this.resolver = resolver
    this.executionBasis = executionBasis
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
      if (input.repositoryId !== undefined || !this.executionBasis) {
        throw new ExecRegistryDomainError('An authorized bootstrap catalog basis reader is required.')
      }
      const basis = this.executionBasis.read()
      this.assertAuthorizedBasis(basis, input.scope, EXECUTION_CATALOG_BASIS_SOURCE)
      return basis
    }
    if (input.repositoryId !== undefined && input.repositoryId !== input.scope.repositoryId) {
      throw new ExecRegistryDomainError('The requested RepositoryId does not match the requested NORMAL scope.')
    }
    if (!this.normalCatalog || typeof input.scope.repositoryId !== 'string') {
      throw new ExecRegistryDomainError('An authorized normal catalog source is required.')
    }
    const basis = this.normalCatalog.read(input.scope.repositoryId)
    this.assertAuthorizedBasis(basis, input.scope, NORMAL_CATALOG_SOURCE)
    return basis
  }

  private assertAuthorizedBasis(basis: unknown, requestedScope: CatalogScope, expectedSource: string): asserts basis is CatalogBasis {
    if (!isAuthenticatedCatalogBasis(basis)) {
      throw new ExecRegistryDomainError('Catalog source returned unverified material.')
    }
    if (!basis.scope.equals(requestedScope)) {
      throw new ExecRegistryDomainError('Catalog source returned material for a different scope.')
    }
    if (basis.source !== expectedSource) {
      throw new ExecRegistryDomainError(`Catalog source must be issued by ${expectedSource}.`)
    }
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
