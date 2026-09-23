import { ResolveExecCapability, RegisterExecCapability } from '../application/exec-registry.ts'
import type {
  BootstrapCatalogSource,
  ExecutionCatalogBasisReader,
  NormalCatalogSource,
} from '../application/exec-registry-ports.ts'
import { RegistryResolutionService } from '../domain/exec-registry.ts'

export interface ExecRegistryComposition {
  readonly resolver: RegistryResolutionService
  readonly resolve: ResolveExecCapability
  readonly register: RegisterExecCapability
}

export function createExecRegistry(
  bootstrapCatalog?: BootstrapCatalogSource,
  normalCatalog?: NormalCatalogSource,
  executionBasisReader?: ExecutionCatalogBasisReader,
): ExecRegistryComposition {
  const resolver = new RegistryResolutionService()
  return Object.freeze({
    resolver,
    resolve: new ResolveExecCapability(resolver, bootstrapCatalog, normalCatalog, executionBasisReader),
    register: new RegisterExecCapability(),
  })
}
