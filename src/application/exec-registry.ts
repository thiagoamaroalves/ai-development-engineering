import {
  CatalogBasis,
  CatalogRevision,
  CatalogScope,
  createCatalogBasisFixture,
  ExecRegistryDomainError,
  RegistryEntry,
  RegistryResolutionService,
  isAuthenticatedCatalogRevision,
  isAuthenticatedCatalogScope,
  isAuthenticatedRegistryResolutionService,
  isRegistryResolutionBoundToRequest,
  type RegistryRegistrationResult,
  type RegistryResolutionRequest,
  type RegistryResolutionResult,
} from '../domain/exec-registry.ts'
import {
  NORMAL_CATALOG_SOURCE,
  SYSTEM_BOOTSTRAP_CATALOG_SOURCE,
  type BootstrapCatalogSource,
  type CatalogBasisSourceKind,
  type CatalogBasisSourceReceipt,
  type ExecutionCatalogBasisReader,
  type NormalCatalogSource,
  isLocalCatalogBasisFixture,
  isProducerIssuedCatalogBasisReceipt,
} from './exec-registry-ports.ts'

export interface ResolveExecCapabilityInput extends RegistryResolutionRequest {
  /** The requested scope is context, never a source of catalog authority. */
  readonly scope: CatalogScope
  /** Kept only as a consistency assertion for NORMAL requests. */
  readonly repositoryId?: string
  /** The exact frozen basis revision requested by the execution. */
  readonly catalogRevision: CatalogRevision
}

export class ResolveExecCapability {
  private readonly resolver: RegistryResolutionService
  private readonly bootstrapCatalog?: BootstrapCatalogSource
  private readonly normalCatalog?: NormalCatalogSource
  private readonly executionBasisReader?: ExecutionCatalogBasisReader

  constructor(
    resolver: RegistryResolutionService,
    bootstrapCatalog?: BootstrapCatalogSource,
    normalCatalog?: NormalCatalogSource,
    executionBasisReader?: ExecutionCatalogBasisReader,
  ) {
    if (!isAuthenticatedRegistryResolutionService(resolver)) {
      throw new ExecRegistryDomainError('An authenticated registry resolver is required.')
    }
    this.resolver = resolver
    this.bootstrapCatalog = bootstrapCatalog
    this.normalCatalog = normalCatalog
    this.executionBasisReader = executionBasisReader
    Object.freeze(this)
  }

  resolve(input: ResolveExecCapabilityInput): RegistryResolutionResult {
    try {
      const basis = this.selectBasis(input)
      const result = this.resolver.resolve(basis, input)
      if (!isRegistryResolutionBoundToRequest(result, basis, input)) {
        return this.resolver.failure(basis, 'CONTRACT_INVALID', 'Resolver returned an unverified or request-mismatched result.')
      }
      return result
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
      if (input.repositoryId !== undefined || !this.bootstrapCatalog || isLocalCatalogBasisFixture(this.bootstrapCatalog)) {
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
    if (!this.executionBasisReader || !this.normalCatalog
      || isLocalCatalogBasisFixture(this.executionBasisReader)
      || isLocalCatalogBasisFixture(this.normalCatalog)) {
      throw new ExecRegistryDomainError('Authorized productive DOM execution basis and normal catalog sources are required.')
    }

    const executionBasis = this.assertAuthorizedBasis(
      this.executionBasisReader,
      this.executionBasisReader.read(),
      input.scope,
      input.catalogRevision,
      'DOM_EXECUTION_BASIS',
      'DOM_EXECUTION_BASIS',
    )
    const normalBasis = this.assertAuthorizedBasis(
      this.normalCatalog,
      this.normalCatalog.read(),
      executionBasis.scope,
      executionBasis.catalogRevision,
      'REPO_NORMAL_CATALOG',
      NORMAL_CATALOG_SOURCE,
    )
    if (!normalBasis.scope.equals(executionBasis.scope)
      || !normalBasis.catalogRevision.equals(executionBasis.catalogRevision)) {
      throw new ExecRegistryDomainError('NORMAL catalog is not bound to the DOM execution basis.')
    }
    return normalBasis
  }

  private assertAuthorizedBasis(
    source: object,
    receipt: unknown,
    requestedScope: CatalogScope,
    requestedRevision: CatalogRevision,
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
    if (!isAuthenticatedCatalogRevision(requestedRevision)
      || !requestedRevision.equals(basis.catalogRevision)) {
      throw new ExecRegistryDomainError('Catalog source returned a stale or unexpected catalog revision.')
    }
    if (basis.source !== expectedSource) {
      throw new ExecRegistryDomainError(`Catalog source must be issued by ${expectedSource}.`)
    }
    return basis
  }

  private failureBasis(input: unknown): CatalogBasis {
    let scope: CatalogScope | undefined
    try {
      if (typeof input === 'object' && input !== null) {
        const candidate = (input as { readonly scope?: unknown }).scope
        if (isAuthenticatedCatalogScope(candidate)) scope = candidate
      }
    } catch {
      // A malformed caller object must still receive a structured failure.
    }
    return createCatalogBasisFixture({ scope: scope ?? CatalogScope.bootstrap(), source: 'EXEC_FAILURE_CONTEXT' })
  }
}

export class RegisterExecCapability {
  register(source: NormalCatalogSource, entry: RegistryEntry): RegistryRegistrationResult {
    return this.registerFromSource(source, entry, 'REPO_NORMAL_CATALOG', NORMAL_CATALOG_SOURCE)
  }

  registerBootstrap(source: BootstrapCatalogSource, entry: RegistryEntry): RegistryRegistrationResult {
    return this.registerFromSource(source, entry, 'SYSTEM_BOOTSTRAP_CATALOG', SYSTEM_BOOTSTRAP_CATALOG_SOURCE)
  }

  private registerFromSource(
    source: { readonly read: () => CatalogBasisSourceReceipt },
    entry: RegistryEntry,
    expectedKind: CatalogBasisSourceKind,
    expectedSource: string,
  ): RegistryRegistrationResult {
    if (isLocalCatalogBasisFixture(source)) {
      throw new ExecRegistryDomainError('Local catalog fixtures cannot publish productive registration authority.')
    }
    const receipt = source.read()
    if (!isProducerIssuedCatalogBasisReceipt(source, receipt, expectedKind)) {
      throw new ExecRegistryDomainError('Catalog source returned unverified material.')
    }
    const basis = receipt.basis
    if (basis.source !== expectedSource) {
      throw new ExecRegistryDomainError(`Catalog source must be issued by ${expectedSource}.`)
    }
    if ((expectedKind === 'REPO_NORMAL_CATALOG' && basis.scope.name !== 'NORMAL')
      || (expectedKind === 'SYSTEM_BOOTSTRAP_CATALOG' && basis.scope.name !== 'BOOTSTRAP')) {
      throw new ExecRegistryDomainError('Catalog source returned material for an incompatible scope.')
    }
    return Object.freeze({
      status: 'REGISTERED' as const,
      code: 'REGISTERED' as const,
      basis: basis.register(entry),
      entry,
    })
  }
}
