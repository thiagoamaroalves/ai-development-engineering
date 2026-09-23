import {
  isSemanticVersion,
  SchemaReference,
} from './exec-contract.ts'

export type RegistryFailureCode =
  | 'CONTRACT_INVALID'
  | 'UNKNOWN_CAPABILITY'
  | 'INCOMPATIBLE_CAPABILITY'

export type RegistryOutcome = 'RESOLVED' | RegistryFailureCode

export class ExecRegistryDomainError extends Error {
  readonly code: 'CONTRACT_INVALID'

  constructor(message: string) {
    super(message)
    this.name = 'ExecRegistryDomainError'
    this.code = 'CONTRACT_INVALID'
  }
}

function requiredToken(value: unknown, label: string): string {
  if (typeof value !== 'string' || value.length === 0 || value.length > 200 || /[\r\n]/.test(value)) {
    throw new ExecRegistryDomainError(`${label} must be a non-empty single-line value.`)
  }
  return value
}

function requiredSemver(value: unknown, label: string): string {
  if (typeof value !== 'string' || !isSemanticVersion(value)) {
    throw new ExecRegistryDomainError(`${label} must be a semantic version.`)
  }
  return value
}

function requiredPositiveInteger(value: unknown, label: string): number {
  if (!Number.isSafeInteger(value) || (value as number) < 1) {
    throw new ExecRegistryDomainError(`${label} must be a positive integer.`)
  }
  return value as number
}

function uniqueTokens(values: readonly unknown[], label: string): readonly string[] {
  if (!Array.isArray(values) || values.length === 0) {
    throw new ExecRegistryDomainError(`${label} must contain at least one value.`)
  }
  const normalized = values.map((value) => requiredToken(value, label))
  if (new Set(normalized).size !== normalized.length) {
    throw new ExecRegistryDomainError(`${label} must not contain duplicates.`)
  }
  return Object.freeze([...normalized])
}

function optionalUniqueTokens(values: readonly unknown[] | undefined, label: string): readonly string[] {
  if (values === undefined) return Object.freeze([])
  if (!Array.isArray(values)) throw new ExecRegistryDomainError(`${label} must be an array.`)
  if (values.length === 0) return Object.freeze([])
  return uniqueTokens(values, label)
}

function freezeRecord<T extends object>(value: T): Readonly<T> {
  return Object.freeze(value)
}

function schemaKey(schema: SchemaReference): string {
  return `${schema.schemaId}@${schema.version}`
}

function assertSchemaReference(value: unknown, label: string): asserts value is SchemaReference {
  if (!(value instanceof SchemaReference)) {
    throw new ExecRegistryDomainError(`${label} must be a schema reference.`)
  }
}

export type SemanticVersionChange = 'NONE' | 'MAJOR' | 'MINOR' | 'PATCH'

export class SemanticVersion {
  readonly value: string
  readonly major: number
  readonly minor: number
  readonly patch: number
  readonly prerelease: readonly string[]
  readonly build: readonly string[]

  private constructor(value: string, major: number, minor: number, patch: number, prerelease: readonly string[], build: readonly string[]) {
    this.value = value
    this.major = major
    this.minor = minor
    this.patch = patch
    this.prerelease = Object.freeze([...prerelease])
    this.build = Object.freeze([...build])
    Object.freeze(this)
  }

  static parse(value: unknown): SemanticVersion {
    const version = requiredSemver(value, 'Semantic version')
    const match = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/.exec(version)
    if (!match) throw new ExecRegistryDomainError('Semantic version is invalid.')
    return new SemanticVersion(
      version,
      Number(match[1]),
      Number(match[2]),
      Number(match[3]),
      match[4] ? match[4].split('.') : [],
      match[5] ? match[5].split('.') : [],
    )
  }

  equals(other: SemanticVersion): boolean {
    return this.value === other.value
  }

  compare(other: SemanticVersion): -1 | 0 | 1 {
    for (const [left, right] of [[this.major, other.major], [this.minor, other.minor], [this.patch, other.patch]] as const) {
      if (left < right) return -1
      if (left > right) return 1
    }
    if (this.prerelease.length === 0 && other.prerelease.length > 0) return 1
    if (this.prerelease.length > 0 && other.prerelease.length === 0) return -1
    for (let index = 0; index < Math.max(this.prerelease.length, other.prerelease.length); index += 1) {
      const left = this.prerelease[index]
      const right = other.prerelease[index]
      if (left === undefined) return -1
      if (right === undefined) return 1
      if (left === right) continue
      const leftNumeric = /^\d+$/.test(left)
      const rightNumeric = /^\d+$/.test(right)
      if (leftNumeric && rightNumeric) return Number(left) < Number(right) ? -1 : 1
      if (leftNumeric !== rightNumeric) return leftNumeric ? -1 : 1
      return left < right ? -1 : 1
    }
    return 0
  }

  changeFrom(previous: SemanticVersion): SemanticVersionChange {
    if (this.equals(previous)) return 'NONE'
    if (this.major !== previous.major) return 'MAJOR'
    if (this.minor !== previous.minor) return 'MINOR'
    return 'PATCH'
  }
}

export function classifySemanticVersionChange(previous: unknown, current: unknown): SemanticVersionChange {
  return SemanticVersion.parse(current).changeFrom(SemanticVersion.parse(previous))
}

export class SupportedVersionSet {
  readonly versions: readonly SemanticVersion[]
  private readonly values: readonly string[]

  private constructor(versions: readonly SemanticVersion[]) {
    this.versions = Object.freeze([...versions])
    this.values = Object.freeze(versions.map((version) => version.value))
    Object.freeze(this)
  }

  static create(values: readonly unknown[]): SupportedVersionSet {
    if (!Array.isArray(values) || values.length === 0) {
      throw new ExecRegistryDomainError('Supported versions must be a non-empty explicit set.')
    }
    const versions = values.map((value) => SemanticVersion.parse(value))
    if (new Set(versions.map((version) => version.value)).size !== versions.length) {
      throw new ExecRegistryDomainError('Supported versions must not contain duplicates.')
    }
    return new SupportedVersionSet(versions)
  }

  has(value: unknown): boolean {
    try {
      return this.values.includes(SemanticVersion.parse(value).value)
    } catch {
      return false
    }
  }

  resolve(value: unknown): SemanticVersion | undefined {
    try {
      const version = SemanticVersion.parse(value)
      return this.values.includes(version.value) ? version : undefined
    } catch {
      return undefined
    }
  }
}

export type CatalogScopeName = 'NORMAL' | 'BOOTSTRAP'

export class CatalogScope {
  readonly name: CatalogScopeName
  readonly repositoryId?: string

  private constructor(name: CatalogScopeName, repositoryId?: string) {
    this.name = name
    this.repositoryId = repositoryId
    Object.freeze(this)
  }

  static normal(repositoryId: unknown): CatalogScope {
    return new CatalogScope('NORMAL', requiredToken(repositoryId, 'Repository identity'))
  }

  static bootstrap(): CatalogScope {
    return new CatalogScope('BOOTSTRAP')
  }

  static create(input: { readonly name: unknown; readonly repositoryId?: unknown }): CatalogScope {
    if (input?.name === 'NORMAL') return CatalogScope.normal(input.repositoryId)
    if (input?.name === 'BOOTSTRAP' && input.repositoryId === undefined) return CatalogScope.bootstrap()
    throw new ExecRegistryDomainError('Catalog scope must be NORMAL with RepositoryId or BOOTSTRAP without RepositoryId.')
  }

  equals(other: CatalogScope): boolean {
    return this.name === other.name && this.repositoryId === other.repositoryId
  }

  get key(): string {
    return this.name === 'NORMAL' ? `NORMAL:${this.repositoryId}` : 'BOOTSTRAP'
  }
}

export const BOOTSTRAP_CAPABILITY_CATEGORIES = Object.freeze([
  'DISCOVERY',
  'VALIDATION',
  'MIGRATION',
  'AUDIT',
  'REMEDIATION',
] as const)

export type BootstrapCapabilityCategory = typeof BOOTSTRAP_CAPABILITY_CATEGORIES[number] | 'NORMAL'

export interface RegistryEntryInput {
  readonly stage: unknown
  readonly skillContractId: unknown
  readonly capabilityId: unknown
  readonly semanticVersion: unknown
  readonly inputSchema: SchemaReference
  readonly outputSchema: SchemaReference
  readonly acceptedArtifacts?: readonly unknown[]
  readonly producedArtifacts?: readonly unknown[]
  readonly allowedVerdicts: readonly unknown[]
  readonly allowedRoles: readonly unknown[]
  readonly category?: unknown
  readonly supportedVersions?: SupportedVersionSet
}

export interface RegistryEntryKey {
  readonly scope: CatalogScope
  readonly skillContractId: string
  readonly capabilityId: string
  readonly schemaId: string
  readonly schemaVersion: string
  readonly semanticVersion: string
}

export class RegistryEntry {
  readonly stage: string
  readonly skillContractId: string
  readonly capabilityId: string
  readonly semanticVersion: SemanticVersion
  readonly inputSchema: SchemaReference
  readonly outputSchema: SchemaReference
  readonly acceptedArtifacts: readonly string[]
  readonly producedArtifacts: readonly string[]
  readonly allowedVerdicts: readonly string[]
  readonly allowedRoles: readonly string[]
  readonly category: BootstrapCapabilityCategory
  readonly supportedVersions: SupportedVersionSet

  private constructor(input: {
    readonly stage: string
    readonly skillContractId: string
    readonly capabilityId: string
    readonly semanticVersion: SemanticVersion
    readonly inputSchema: SchemaReference
    readonly outputSchema: SchemaReference
    readonly acceptedArtifacts: readonly string[]
    readonly producedArtifacts: readonly string[]
    readonly allowedVerdicts: readonly string[]
    readonly allowedRoles: readonly string[]
    readonly category: BootstrapCapabilityCategory
    readonly supportedVersions: SupportedVersionSet
  }) {
    this.stage = input.stage
    this.skillContractId = input.skillContractId
    this.capabilityId = input.capabilityId
    this.semanticVersion = input.semanticVersion
    this.inputSchema = input.inputSchema
    this.outputSchema = input.outputSchema
    this.acceptedArtifacts = input.acceptedArtifacts
    this.producedArtifacts = input.producedArtifacts
    this.allowedVerdicts = input.allowedVerdicts
    this.allowedRoles = input.allowedRoles
    this.category = input.category
    this.supportedVersions = input.supportedVersions
    Object.freeze(this)
  }

  static create(input: RegistryEntryInput): RegistryEntry {
    if (!input || typeof input !== 'object') throw new ExecRegistryDomainError('A complete registry entry is required.')
    assertSchemaReference(input.inputSchema, 'Input schema')
    assertSchemaReference(input.outputSchema, 'Output schema')
    const semanticVersion = SemanticVersion.parse(input.semanticVersion)
    const category = input.category === undefined ? 'NORMAL' : input.category
    if (!['DISCOVERY', 'VALIDATION', 'MIGRATION', 'AUDIT', 'REMEDIATION', 'NORMAL'].includes(String(category))) {
      throw new ExecRegistryDomainError('Registry capability category is unknown.')
    }
    const supportedVersions = input.supportedVersions ?? SupportedVersionSet.create([semanticVersion.value])
    if (!supportedVersions.has(semanticVersion.value)) {
      throw new ExecRegistryDomainError('The entry semantic version must be explicitly supported.')
    }
    return new RegistryEntry({
      stage: requiredToken(input.stage, 'Stage'),
      skillContractId: requiredToken(input.skillContractId, 'Skill contract identity'),
      capabilityId: requiredToken(input.capabilityId, 'Capability identity'),
      semanticVersion,
      inputSchema: input.inputSchema,
      outputSchema: input.outputSchema,
      acceptedArtifacts: optionalUniqueTokens(input.acceptedArtifacts, 'Accepted artifacts'),
      producedArtifacts: optionalUniqueTokens(input.producedArtifacts, 'Produced artifacts'),
      allowedVerdicts: uniqueTokens(input.allowedVerdicts, 'Allowed verdicts'),
      allowedRoles: uniqueTokens(input.allowedRoles, 'Allowed roles'),
      category: category as BootstrapCapabilityCategory,
      supportedVersions,
    })
  }

  key(scope: CatalogScope): RegistryEntryKey {
    return Object.freeze({
      scope,
      skillContractId: this.skillContractId,
      capabilityId: this.capabilityId,
      schemaId: this.inputSchema.schemaId,
      schemaVersion: this.inputSchema.version,
      semanticVersion: this.semanticVersion.value,
    })
  }

  identity(scope: CatalogScope): string {
    const key = this.key(scope)
    return JSON.stringify([
      key.scope.key,
      key.skillContractId,
      key.capabilityId,
      key.schemaId,
      key.schemaVersion,
      key.semanticVersion,
    ])
  }

  supports(version: unknown): boolean {
    return this.supportedVersions.has(version)
  }

  acceptsRole(role: unknown): boolean {
    return typeof role === 'string' && this.allowedRoles.includes(role)
  }

  acceptsSchema(schema: SchemaReference): boolean {
    return schemaKey(this.inputSchema) === schemaKey(schema)
  }
}

export interface CatalogBasisInput {
  readonly scope: CatalogScope
  readonly catalogRevision?: unknown
  readonly source?: unknown
  readonly entries?: readonly RegistryEntry[]
}

export class CatalogBasis {
  readonly scope: CatalogScope
  readonly catalogRevision: number
  readonly source: string
  readonly entries: readonly RegistryEntry[]

  private constructor(scope: CatalogScope, catalogRevision: number, source: string, entries: readonly RegistryEntry[]) {
    this.scope = scope
    this.catalogRevision = catalogRevision
    this.source = source
    this.entries = Object.freeze([...entries])
    const identities = entries.map((entry) => entry.identity(scope))
    if (new Set(identities).size !== identities.length) {
      throw new ExecRegistryDomainError('Catalog contains duplicate registry entry identity.')
    }
    Object.freeze(this)
  }

  static create(input: CatalogBasisInput): CatalogBasis {
    if (!input || !(input.scope instanceof CatalogScope)) {
      throw new ExecRegistryDomainError('A catalog scope is required.')
    }
    const catalogRevision = input.catalogRevision === undefined ? 1 : requiredPositiveInteger(input.catalogRevision, 'Catalog revision')
    const source = input.source === undefined ? input.scope.name : requiredToken(input.source, 'Catalog source')
    const entries = input.entries ?? []
    if (!Array.isArray(entries) || !entries.every((entry) => entry instanceof RegistryEntry)) {
      throw new ExecRegistryDomainError('Catalog entries must be registry entries.')
    }
    return new CatalogBasis(input.scope, catalogRevision, source, entries)
  }

  register(entry: RegistryEntry): CatalogBasis {
    if (!(entry instanceof RegistryEntry)) throw new ExecRegistryDomainError('A registry entry is required.')
    const identity = entry.identity(this.scope)
    if (this.findByIdentity(identity)) {
      throw new ExecRegistryDomainError('A registry entry with the same immutable key already exists.')
    }
    return new CatalogBasis(this.scope, this.catalogRevision + 1, this.source, [...this.entries, entry])
  }

  findByIdentity(identity: string): RegistryEntry | undefined {
    return this.entries.find((entry) => entry.identity(this.scope) === identity)
  }

  findCandidates(input: { readonly skillContractId: string; readonly capabilityId: string; readonly schema: SchemaReference }): readonly RegistryEntry[] {
    return Object.freeze(this.entries.filter((entry) => entry.skillContractId === input.skillContractId
      && entry.capabilityId === input.capabilityId
      && entry.acceptsSchema(input.schema)))
  }
}

export interface RegistryResolutionRequest {
  readonly stage: unknown
  readonly skillContractId: unknown
  readonly capabilityId: unknown
  readonly schema: SchemaReference
  readonly semanticVersion: unknown
  readonly supportedVersions: SupportedVersionSet
  readonly role?: unknown
}

export interface ResolvedRegistryCapability {
  readonly status: 'RESOLVED'
  readonly code: 'RESOLVED'
  readonly basis: CatalogBasis
  readonly entry: RegistryEntry
  readonly requestedVersion: SemanticVersion
}

export interface RegistryResolutionFailure {
  readonly status: 'FAILED'
  readonly code: Exclude<RegistryFailureCode, 'RESOLVED'>
  readonly basis: CatalogBasis
  readonly reason: string
  readonly noMutation: true
  readonly noApproval: true
}

export type RegistryResolutionResult = ResolvedRegistryCapability | RegistryResolutionFailure

export class VersionCompatibilityPolicy {
  static resolve(entry: RegistryEntry, requested: unknown, supported: SupportedVersionSet): SemanticVersion | undefined {
    const requestedVersion = supported.resolve(requested)
    if (!requestedVersion || !entry.supports(requestedVersion.value)) return undefined
    return requestedVersion
  }
}

export class BootstrapAllowlistPolicy {
  static permits(scope: CatalogScope, entry: RegistryEntry): boolean {
    return scope.name !== 'BOOTSTRAP'
      || BOOTSTRAP_CAPABILITY_CATEGORIES.includes(entry.category as typeof BOOTSTRAP_CAPABILITY_CATEGORIES[number])
  }
}

export class RegistryResolutionService {
  resolve(basis: CatalogBasis, request: RegistryResolutionRequest): RegistryResolutionResult {
    if (!(basis instanceof CatalogBasis)) {
      throw new ExecRegistryDomainError('A catalog basis is required.')
    }
    try {
      if (!request || !(request.schema instanceof SchemaReference) || !(request.supportedVersions instanceof SupportedVersionSet)) {
        return this.failure(basis, 'CONTRACT_INVALID', 'A complete registry resolution request is required.')
      }
      const stage = requiredToken(request.stage, 'Stage')
      const skillContractId = requiredToken(request.skillContractId, 'Skill contract identity')
      const capabilityId = requiredToken(request.capabilityId, 'Capability identity')
      const candidates = basis.findCandidates({ skillContractId, capabilityId, schema: request.schema })
      if (candidates.length === 0) return this.failure(basis, 'UNKNOWN_CAPABILITY', 'Capability is not registered in the requested catalog basis.')
      const stageCandidates = candidates.filter((entry) => entry.stage === stage)
      if (stageCandidates.length === 0) return this.failure(basis, 'UNKNOWN_CAPABILITY', 'Capability stage is not registered in the requested catalog basis.')
      const version = request.supportedVersions.resolve(request.semanticVersion)
      if (!version || !stageCandidates.some((entry) => entry.semanticVersion.value === version.value && entry.supports(version.value))) {
        return this.failure(basis, 'INCOMPATIBLE_CAPABILITY', 'Capability version is not explicitly supported by the requested basis.')
      }
      const entry = stageCandidates.find((candidate) => candidate.semanticVersion.value === version.value)
      if (!entry) return this.failure(basis, 'INCOMPATIBLE_CAPABILITY', 'Capability version is not registered for the requested basis.')
      if (!BootstrapAllowlistPolicy.permits(basis.scope, entry)) {
        return this.failure(basis, 'INCOMPATIBLE_CAPABILITY', 'The bootstrap catalog permits onboarding capabilities only.')
      }
      if (request.role !== undefined && !entry.acceptsRole(request.role)) {
        return this.failure(basis, 'INCOMPATIBLE_CAPABILITY', 'Capability role is not supported by the requested entry.')
      }
      return Object.freeze({ status: 'RESOLVED' as const, code: 'RESOLVED' as const, basis, entry, requestedVersion: version })
    } catch (error) {
      const reason = error instanceof Error ? error.message : 'Registry resolution request is invalid.'
      return this.failure(basis, 'CONTRACT_INVALID', reason)
    }
  }

  private failure(basis: CatalogBasis, code: Exclude<RegistryFailureCode, 'RESOLVED'>, reason: string): RegistryResolutionFailure {
    return Object.freeze({ status: 'FAILED' as const, code, basis, reason, noMutation: true as const, noApproval: true as const })
  }
}

export interface RegistryRegistrationResult {
  readonly status: 'REGISTERED'
  readonly code: 'REGISTERED'
  readonly basis: CatalogBasis
  readonly entry: RegistryEntry
}

export function registerRegistryEntry(basis: CatalogBasis, entry: RegistryEntry): RegistryRegistrationResult {
  return Object.freeze({ status: 'REGISTERED' as const, code: 'REGISTERED' as const, basis: basis.register(entry), entry })
}

export function registryBasisIdentity(basis: CatalogBasis): string {
  return JSON.stringify([basis.scope.key, basis.catalogRevision, basis.source, basis.entries.map((entry) => entry.identity(basis.scope))])
}

export function isRegistryFailure(value: RegistryResolutionResult): value is RegistryResolutionFailure {
  return value.status === 'FAILED'
}

export function isRegistryResolution(value: RegistryResolutionResult): value is ResolvedRegistryCapability {
  return value.status === 'RESOLVED'
}

export function cloneRegistryEntries(basis: CatalogBasis): readonly RegistryEntry[] {
  return Object.freeze([...basis.entries])
}

export const RegistryCatalog = CatalogBasis
export const CapabilityRegistry = RegistryResolutionService
