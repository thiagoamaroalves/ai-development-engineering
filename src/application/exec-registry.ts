import {
  CatalogBasis,
  CatalogScope,
  ExecRegistryDomainError,
  RegistryEntry,
  RegistryResolutionService,
  type RegistryRegistrationResult,
  type RegistryResolutionRequest,
  type RegistryResolutionResult,
  registerRegistryEntry,
} from '../domain/exec-registry.ts'
import type { ExecutionCatalogBasisReader, NormalCatalogSource } from './exec-registry-ports.ts'

export interface ResolveExecCapabilityInput extends RegistryResolutionRequest {
  readonly basis?: CatalogBasis
  readonly scope?: CatalogScope
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
    const basis = this.selectBasis(input)
    return this.resolver.resolve(basis, input)
  }

  private selectBasis(input: ResolveExecCapabilityInput): CatalogBasis {
    if (input.basis instanceof CatalogBasis) return input.basis
    if (input.scope?.name === 'BOOTSTRAP') {
      if (!this.executionBasis) throw new ExecRegistryDomainError('A bootstrap catalog basis reader is required.')
      const basis = this.executionBasis.read()
      if (!basis.scope.equals(input.scope)) throw new ExecRegistryDomainError('The supplied basis does not match the requested bootstrap scope.')
      return basis
    }
    if (input.scope?.name === 'NORMAL') {
      if (!this.normalCatalog || typeof input.repositoryId !== 'string') {
        throw new ExecRegistryDomainError('A normal catalog source and RepositoryId are required.')
      }
      const basis = this.normalCatalog.read(input.repositoryId)
      if (!basis.scope.equals(input.scope)) throw new ExecRegistryDomainError('The supplied basis does not match the requested normal scope.')
      return basis
    }
    throw new ExecRegistryDomainError('A frozen catalog basis or an authorized catalog source is required.')
  }
}

export class RegisterExecCapability {
  register(basis: CatalogBasis, entry: RegistryEntry): RegistryRegistrationResult {
    return registerRegistryEntry(basis, entry)
  }
}
