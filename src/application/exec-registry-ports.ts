import type { CatalogBasis } from '../domain/exec-registry.ts'

/** Explicit producer identities for the existing source seams. */
export const EXECUTION_CATALOG_BASIS_SOURCE = 'DOM_EXECUTION_BASIS' as const
export const NORMAL_CATALOG_SOURCE = 'REPO_NORMAL_CATALOG' as const

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
