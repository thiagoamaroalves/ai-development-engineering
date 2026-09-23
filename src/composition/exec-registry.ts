import { ResolveExecCapability, RegisterExecCapability } from '../application/exec-registry.ts'
import type { ExecutionCatalogBasisReader, NormalCatalogSource } from '../application/exec-registry-ports.ts'
import { RegistryResolutionService } from '../domain/exec-registry.ts'

export interface ExecRegistryComposition {
  readonly resolver: RegistryResolutionService
  readonly resolve: ResolveExecCapability
  readonly register: RegisterExecCapability
}

export function createExecRegistry(
  executionBasis?: ExecutionCatalogBasisReader,
  normalCatalog?: NormalCatalogSource,
): ExecRegistryComposition {
  const resolver = new RegistryResolutionService()
  return Object.freeze({
    resolver,
    resolve: new ResolveExecCapability(resolver, executionBasis, normalCatalog),
    register: new RegisterExecCapability(),
  })
}
