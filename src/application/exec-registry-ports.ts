import {
  isAuthenticatedCatalogBasis,
  type CatalogBasis,
} from '../domain/exec-registry.ts'

export type CatalogBasisSourceKind =
  | 'DOM_EXECUTION_BASIS'
  | 'SYSTEM_BOOTSTRAP_CATALOG'
  | 'REPO_NORMAL_CATALOG'

export interface CatalogBasisSourceReceipt {
  readonly basis: CatalogBasis
}

const AUTHENTICATED_SOURCE_INSTANCES = new WeakSet<object>()
const ISSUED_RECEIPTS = new WeakMap<object, WeakSet<object>>()
const SOURCE_KINDS = new WeakMap<object, CatalogBasisSourceKind>()

/**
 * A source receipt is producer-issued evidence, not a source-name assertion.
 * The private receipt ledger makes copied result shapes and expected-marker
 * bases unusable at the consumer boundary.
 */
abstract class AuthenticatedCatalogBasisSource {
  protected constructor(kind: CatalogBasisSourceKind) {
    AUTHENTICATED_SOURCE_INSTANCES.add(this)
    ISSUED_RECEIPTS.set(this, new WeakSet<object>())
    SOURCE_KINDS.set(this, kind)
  }

  protected issue(basis: CatalogBasis): CatalogBasisSourceReceipt {
    if (!isAuthenticatedCatalogBasis(basis)) {
      throw new TypeError('A catalog source can issue only an authenticated basis.')
    }
    const receipt = Object.freeze({ basis })
    ISSUED_RECEIPTS.get(this)?.add(receipt)
    return receipt
  }
}

/**
 * Consumer-shaped port for DOM-owned execution/snapshot basis material. It is
 * intentionally distinct from the independent system bootstrap catalog.
 */
export abstract class ExecutionCatalogBasisReader extends AuthenticatedCatalogBasisSource {
  protected constructor() {
    super('DOM_EXECUTION_BASIS')
  }

  abstract read(): CatalogBasisSourceReceipt
}

/**
 * Independent system-scoped bootstrap catalog producer. DOM identity and
 * snapshot material must not become the bootstrap catalog authority.
 */
export abstract class AuthenticatedBootstrapCatalogSource extends AuthenticatedCatalogBasisSource {
  protected constructor() {
    super('SYSTEM_BOOTSTRAP_CATALOG')
  }

  abstract read(): CatalogBasisSourceReceipt
}

export type BootstrapCatalogSource = AuthenticatedBootstrapCatalogSource

/** Consumer-shaped port for the repository-owned enabled NORMAL catalog. */
export abstract class NormalCatalogSource extends AuthenticatedCatalogBasisSource {
  protected constructor() {
    super('REPO_NORMAL_CATALOG')
  }

  /** The producer selects canonical repository identity; callers provide no ID. */
  abstract read(): CatalogBasisSourceReceipt
}

export function isAuthenticatedCatalogBasisSource(value: unknown): value is AuthenticatedCatalogBasisSource {
  return typeof value === 'object'
    && value !== null
    && AUTHENTICATED_SOURCE_INSTANCES.has(value)
}

export function isProducerIssuedCatalogBasisReceipt(
  source: unknown,
  receipt: unknown,
  expectedKind: CatalogBasisSourceKind,
): receipt is CatalogBasisSourceReceipt {
  if (!isAuthenticatedCatalogBasisSource(source)
    || typeof receipt !== 'object'
    || receipt === null
    || !ISSUED_RECEIPTS.get(source)?.has(receipt)
    || SOURCE_KINDS.get(source) !== expectedKind) {
    return false
  }
  return isAuthenticatedCatalogBasis((receipt as CatalogBasisSourceReceipt).basis)
}

export const EXECUTION_CATALOG_BASIS_SOURCE = 'DOM_EXECUTION_BASIS' as const
export const SYSTEM_BOOTSTRAP_CATALOG_SOURCE = 'SYSTEM_BOOTSTRAP_CATALOG' as const
export const NORMAL_CATALOG_SOURCE = 'REPO_NORMAL_CATALOG' as const
