import {
  isAuthenticatedCatalogBasis,
  type CatalogBasis,
} from '../domain/exec-registry.ts'

export type CatalogBasisSourceKind =
  | 'DOM_EXECUTION_BASIS'
  | 'SYSTEM_BOOTSTRAP_CATALOG'
  | 'REPO_NORMAL_CATALOG'

/**
 * An opaque producer receipt. The runtime provenance ledger is intentionally
 * module-private; callers can transport a receipt but cannot mint or copy one.
 */
export interface CatalogBasisSourceReceipt {
  readonly basis: CatalogBasis
}

type CatalogBasisSource = {
  readonly read: () => CatalogBasisSourceReceipt
}

/** Consumer-shaped port for DOM-owned execution/snapshot basis material. */
export abstract class ExecutionCatalogBasisReader {
  protected constructor() {}
  abstract read(): CatalogBasisSourceReceipt
}

/** Independent system-scoped bootstrap catalog producer. */
export abstract class AuthenticatedBootstrapCatalogSource {
  protected constructor() {}
  abstract read(): CatalogBasisSourceReceipt
}

export type BootstrapCatalogSource = AuthenticatedBootstrapCatalogSource

/** Consumer-shaped port for the repository-owned enabled NORMAL catalog. */
export abstract class NormalCatalogSource {
  protected constructor() {}
  abstract read(): CatalogBasisSourceReceipt
}

const AUTHENTICATED_SOURCE_INSTANCES = new WeakSet<object>()
const ISSUED_RECEIPTS = new WeakMap<object, WeakSet<object>>()
const SOURCE_KINDS = new WeakMap<object, CatalogBasisSourceKind>()

function issue(source: object, basis: CatalogBasis): CatalogBasisSourceReceipt {
  if (!isAuthenticatedCatalogBasis(basis)) {
    throw new TypeError('A catalog source can issue only an authenticated basis.')
  }
  const receipt = Object.freeze({ basis })
  ISSUED_RECEIPTS.get(source)?.add(receipt)
  return receipt
}

function createLocalSourceFixture(
  kind: CatalogBasisSourceKind,
  readBasis: () => CatalogBasis,
  target?: object,
): CatalogBasisSource {
  const source = target ?? {}
  AUTHENTICATED_SOURCE_INSTANCES.add(source)
  ISSUED_RECEIPTS.set(source, new WeakSet<object>())
  SOURCE_KINDS.set(source, kind)
  Object.defineProperty(source, 'read', {
    configurable: false,
    enumerable: false,
    writable: false,
    value: () => issue(source, readBasis()),
  })
  return source as CatalogBasisSource
}

/**
 * Local contract fixture for the DOM-owned execution/snapshot basis. This is
 * deliberately named as fixture support: it proves the consumer contract but
 * never claims productive DOM availability. The optional target exists only
 * for tests that use the documented port class shape.
 */
export function createLocalExecutionCatalogBasisFixture(
  readBasis: () => CatalogBasis,
  target?: object,
): ExecutionCatalogBasisReader {
  return createLocalSourceFixture('DOM_EXECUTION_BASIS', readBasis, target) as ExecutionCatalogBasisReader
}

/** Local contract fixture for the independent system bootstrap catalog. */
export function createLocalBootstrapCatalogFixture(
  readBasis: () => CatalogBasis,
  target?: object,
): AuthenticatedBootstrapCatalogSource {
  return createLocalSourceFixture('SYSTEM_BOOTSTRAP_CATALOG', readBasis, target) as AuthenticatedBootstrapCatalogSource
}

/**
 * Local contract fixture for repository-owned NORMAL catalog material. The
 * producer selects repository identity through the basis; callers do not pass
 * a repository identifier to the source.
 */
export function createLocalNormalCatalogFixture(
  readBasis: () => CatalogBasis,
  target?: object,
): NormalCatalogSource {
  return createLocalSourceFixture('REPO_NORMAL_CATALOG', readBasis, target) as NormalCatalogSource
}

export function isAuthenticatedCatalogBasisSource(value: unknown): value is CatalogBasisSource {
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
