import type { CatalogBasis } from '../domain/exec-registry.ts'

/**
 * Consumer-shaped port for the DOM-owned execution/snapshot basis. It carries
 * foreign identity material without creating or redefining that identity.
 */
export interface ExecutionCatalogBasisReader {
  read(): CatalogBasis
}

/**
 * Consumer-shaped port for the repository-owned enabled NORMAL catalog.
 */
export interface NormalCatalogSource {
  read(repositoryId: string): CatalogBasis
}
