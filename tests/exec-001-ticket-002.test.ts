import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import test from 'node:test'
import {
  BOOTSTRAP_CAPABILITY_CATEGORIES,
  BootstrapAllowlistPolicy,
  CatalogBasis,
  CatalogScope,
  RegistryEntry,
  RegistryResolutionService,
  SemanticVersion,
  SupportedVersionSet,
  classifySemanticVersionChange,
  createCatalogBasisFixture,
  isRegistryFailure,
  isRegistryResolutionBoundToRequest,
  isRegistryResolution,
  registryBasisIdentity,
} from '../src/domain/exec-registry.ts'
import { ResolveExecCapability } from '../src/application/exec-registry.ts'
import {
  AuthenticatedBootstrapCatalogSource,
  ExecutionCatalogBasisReader,
  NormalCatalogSource,
  createLocalBootstrapCatalogFixture,
  createLocalExecutionCatalogBasisFixture,
  createLocalNormalCatalogFixture,
  type CatalogBasisSourceReceipt,
} from '../src/application/exec-registry-ports.ts'
import { createExecRegistry } from '../src/composition/exec-registry.ts'
import { SchemaReference } from '../src/domain/exec-contract.ts'

const inputSchema = SchemaReference.create({ schemaId: 'exec-input', version: '1.0.0' })
const outputSchema = SchemaReference.create({ schemaId: 'exec-output', version: '1.0.0' })

function entry(overrides: Partial<{
  stage: string
  skillContractId: string
  capabilityId: string
  semanticVersion: string
  category: string
  supportedVersions: SupportedVersionSet
  inputSchema: SchemaReference
}> = {}): RegistryEntry {
  return RegistryEntry.create({
    stage: overrides.stage ?? 'PLAN',
    skillContractId: overrides.skillContractId ?? 'skill.contract',
    capabilityId: overrides.capabilityId ?? 'capability.registry',
    semanticVersion: overrides.semanticVersion ?? '1.2.3',
    inputSchema: overrides.inputSchema ?? inputSchema,
    outputSchema,
    acceptedArtifacts: ['input.json'],
    producedArtifacts: ['output.json'],
    allowedVerdicts: ['PASS', 'FAIL'],
    allowedRoles: ['IMPLEMENTER'],
    category: overrides.category ?? 'NORMAL',
    supportedVersions: overrides.supportedVersions,
  })
}

function request(overrides: Partial<{
  stage: string
  skillContractId: string
  capabilityId: string
  semanticVersion: string
  schema: SchemaReference
  role: string
}> = {}) {
  return {
    stage: overrides.stage ?? 'PLAN',
    skillContractId: overrides.skillContractId ?? 'skill.contract',
    capabilityId: overrides.capabilityId ?? 'capability.registry',
    schema: overrides.schema ?? inputSchema,
    semanticVersion: overrides.semanticVersion ?? '1.2.3',
    ...(overrides.role === undefined ? {} : { role: overrides.role }),
  }
}

class FixtureBootstrapSource extends AuthenticatedBootstrapCatalogSource {
  constructor(basis: CatalogBasis) {
    super()
    createLocalBootstrapCatalogFixture(() => basis, this)
  }

  read(): CatalogBasisSourceReceipt {
    throw new Error('fixture source was not initialized')
  }
}

class FixtureNormalSource extends NormalCatalogSource {
  constructor(basis: CatalogBasis) {
    super()
    createLocalNormalCatalogFixture(() => basis, this)
  }

  read(): CatalogBasisSourceReceipt {
    throw new Error('fixture source was not initialized')
  }
}

class FixtureDomExecutionSource extends ExecutionCatalogBasisReader {
  constructor(basis: CatalogBasis) {
    super()
    createLocalExecutionCatalogBasisFixture(() => basis, this)
  }

  read(): CatalogBasisSourceReceipt {
    throw new Error('fixture source was not initialized')
  }
}

function scopedRequest(scope: CatalogScope, overrides: Parameters<typeof request>[0] = {}) {
  return { ...request(overrides), scope, catalogRevision: 2 }
}

function domBasisFor(basis: CatalogBasis): CatalogBasis {
  return createCatalogBasisFixture({
    scope: basis.scope,
    catalogRevision: basis.catalogRevision,
    source: 'DOM_EXECUTION_BASIS',
  })
}

test('parses semantic versions and preserves exact change semantics', () => {
  const version = SemanticVersion.parse('1.2.3-beta.1+build.7')
  assert.equal(version.major, '1')
  assert.equal(version.minor, '2')
  assert.equal(version.patch, '3')
  assert.deepEqual(version.prerelease, ['beta', '1'])
  assert.deepEqual(version.build, ['build', '7'])
  assert.equal(classifySemanticVersionChange('1.2.3', '1.2.4'), 'PATCH')
  assert.equal(classifySemanticVersionChange('1.2.3', '1.3.0'), 'MINOR')
  assert.equal(classifySemanticVersionChange('1.2.3', '2.0.0'), 'MAJOR')
  assert.equal(classifySemanticVersionChange('1.2.3', '1.2.3'), 'NONE')
  assert.equal(classifySemanticVersionChange('1.2.3+build-a', '1.2.3+build-b'), 'NONE')

  const large = SemanticVersion.parse('1.2.9007199254740993')
  const larger = SemanticVersion.parse('1.2.9007199254740994')
  assert.equal(large.compare(larger), -1)
  assert.equal(SemanticVersion.parse('9007199254740993.2.3').major, '9007199254740993')
  assert.equal(SemanticVersion.parse('1.9007199254740993.3').minor, '9007199254740993')
  assert.equal(SemanticVersion.parse('1.2.9007199254740993').patch, '9007199254740993')
  assert.equal(larger.changeFrom(large), 'PATCH')
})

test('resolves only authenticated explicit supported versions without alias or approximation', () => {
  const supported = SupportedVersionSet.create(['1.2.3', '1.3.0'])
  assert.equal(supported.has('1.2.3'), true)
  assert.equal(supported.has('1.2.4'), false)
  assert.equal(supported.has('1.2'), false)
  assert.equal(supported.has('2.0.0'), false)
  assert.throws(() => SupportedVersionSet.create(['1.0.0', '1.0.0']), /duplicates/)
  assert.throws(() => RegistryEntry.create({
    ...entryInput(),
    supportedVersions: { has: () => true },
  } as never), /authenticated explicit set/)
})

function entryInput() {
  return {
    stage: 'PLAN',
    skillContractId: 'skill.contract',
    capabilityId: 'capability.forged',
    semanticVersion: '1.2.3',
    inputSchema,
    outputSchema,
    allowedVerdicts: ['PASS'],
    allowedRoles: ['IMPLEMENTER'],
  }
}

test('resolves a complete registered mapping deterministically and preserves frozen basis', () => {
  const basis = createCatalogBasisFixture({ scope: CatalogScope.normal('repo-a'), source: 'repo-a-config' })
  const registered = basis.register(entry())
  const resolver = new RegistryResolutionService()
  const result = resolver.resolve(registered, request())
  assert.equal(isRegistryResolution(result), true)
  if (!isRegistryResolution(result)) return
  assert.equal(result.entry.stage, 'PLAN')
  assert.equal(result.entry.skillContractId, 'skill.contract')
  assert.equal(result.entry.capabilityId, 'capability.registry')
  assert.equal(result.entry.semanticVersion.value, '1.2.3')
  assert.equal(result.entry.inputSchema, inputSchema)
  assert.equal(result.entry.outputSchema.schemaId, outputSchema.schemaId)
  assert.equal(result.entry.outputSchema.version, outputSchema.version)
  assert.deepEqual(result.entry.acceptedArtifacts, ['input.json'])
  assert.deepEqual(result.entry.producedArtifacts, ['output.json'])
  assert.deepEqual(result.entry.allowedVerdicts, ['PASS', 'FAIL'])
  assert.deepEqual(result.entry.allowedRoles, ['IMPLEMENTER'])
  assert.equal(result.entry.category, 'NORMAL')
  assert.equal(result.basis, registered)
  assert.equal(result.requestedVersion.value, '1.2.3')
  assert.equal(basis.entries.length, 0)
  assert.equal(registered.entries.length, 1)
  assert.equal(registryBasisIdentity(basis), JSON.stringify(['NORMAL:repo-a', 1, 'repo-a-config', []]))
})

test('selects the exact compatible version independently of registration order', () => {
  const first = entry({ semanticVersion: '1.0.0' })
  const second = entry({ semanticVersion: '2.0.0' })
  const resolver = new RegistryResolutionService()
  const forward = createCatalogBasisFixture({ scope: CatalogScope.normal('repo-a') })
    .register(first)
    .register(second)
  const reverse = createCatalogBasisFixture({ scope: CatalogScope.normal('repo-a') })
    .register(second)
    .register(first)

  for (const basis of [forward, reverse]) {
    const result = resolver.resolve(basis, request({ semanticVersion: '2.0.0' }))
    assert.equal(result.status, 'RESOLVED')
    if (result.status === 'RESOLVED') {
      assert.equal(result.entry.semanticVersion.value, '2.0.0')
      assert.equal(result.entry.outputSchema.schemaId, outputSchema.schemaId)
      assert.equal(result.entry.outputSchema.version, outputSchema.version)
    }
  }

  const unsupported = resolver.resolve(forward, request({ semanticVersion: '3.0.0' }))
  assert.equal(unsupported.status, 'FAILED')
  if (unsupported.status === 'FAILED') assert.equal(unsupported.code, 'INCOMPATIBLE_CAPABILITY')

  const supportedOnlyBasis = createCatalogBasisFixture({ scope: CatalogScope.normal('repo-a') })
    .register(entry({
      semanticVersion: '1.0.0',
      supportedVersions: SupportedVersionSet.create(['1.0.0', '1.5.0']),
    }))
  const supportedOnly = resolver.resolve(supportedOnlyBasis, request({ semanticVersion: '1.5.0' }))
  assert.equal(supportedOnly.status, 'RESOLVED')
  if (supportedOnly.status === 'RESOLVED') {
    assert.equal(supportedOnly.entry.semanticVersion.value, '1.0.0')
    assert.equal(supportedOnly.requestedVersion.value, '1.5.0')
  }
})

test('rejects duplicate and conflicting registration without mutating the frozen basis', () => {
  const basis = createCatalogBasisFixture({ scope: CatalogScope.normal('repo-a') }).register(entry())
  const before = registryBasisIdentity(basis)
  assert.throws(() => basis.register(entry()), /same immutable key/)
  assert.throws(() => basis.register(entry({ stage: 'RUN' })), /same immutable key/)
  assert.equal(registryBasisIdentity(basis), before)
  assert.equal(basis.entries.length, 1)
})

test('keeps NORMAL repositories isolated and rejects cross-scope source substitution', () => {
  const first = createCatalogBasisFixture({ scope: CatalogScope.normal('repo-a') }).register(entry())
  const second = createCatalogBasisFixture({ scope: CatalogScope.normal('repo-b') }).register(entry())
  const resolver = new RegistryResolutionService()
  const firstResult = resolver.resolve(first, request())
  const secondResult = resolver.resolve(second, request())
  assert.equal(firstResult.status, 'RESOLVED')
  assert.equal(secondResult.status, 'RESOLVED')
  assert.notEqual(first.scope.repositoryId, second.scope.repositoryId)
  assert.notEqual(registryBasisIdentity(first), registryBasisIdentity(second))
  assert.equal(first.findByIdentity(first.entries[0].identity(first.scope)), first.entries[0])
  assert.equal(second.findByIdentity(second.entries[0].identity(second.scope)), second.entries[0])

  const normalSource = new FixtureNormalSource(first)
  const domSource = new FixtureDomExecutionSource(domBasisFor(first))
  const useCase = new ResolveExecCapability(new RegistryResolutionService(), undefined, normalSource, domSource)
  const substituted = useCase.resolve(scopedRequest(CatalogScope.normal('repo-b')))
  assert.equal(substituted.status, 'FAILED')
  if (substituted.status === 'FAILED') {
    assert.equal(substituted.code, 'CONTRACT_INVALID')
    assert.equal(substituted.noApproval, true)
    assert.equal(substituted.noMutation, true)
  }
})

test('keeps BOOTSTRAP independent and rejects normal capabilities before work', () => {
  const bootstrap = createCatalogBasisFixture({ scope: CatalogScope.bootstrap(), source: 'SYSTEM_BOOTSTRAP_CATALOG' })
    .register(entry({ category: 'NORMAL' }))
  const resolver = new RegistryResolutionService()
  const result = resolver.resolve(bootstrap, request())
  assert.equal(result.status, 'FAILED')
  if (result.status !== 'FAILED') return
  assert.equal(result.code, 'INCOMPATIBLE_CAPABILITY')
  assert.equal(result.noApproval, true)
  assert.equal(result.noMutation, true)
  const useCase = new ResolveExecCapability(
    new RegistryResolutionService(),
    new FixtureBootstrapSource(bootstrap),
  )
  assert.equal('resolveBeforeWork' in useCase, false)
  assert.equal(BootstrapAllowlistPolicy.permits(bootstrap.scope, bootstrap.entries[0]), false)
  assert.deepEqual(BOOTSTRAP_CAPABILITY_CATEGORIES, ['DISCOVERY', 'VALIDATION', 'MIGRATION', 'AUDIT', 'REMEDIATION'])

  const onboarding = createCatalogBasisFixture({ scope: CatalogScope.bootstrap(), source: 'SYSTEM_BOOTSTRAP_CATALOG' })
    .register(entry({ category: 'DISCOVERY', capabilityId: 'capability.discover' }))
  const onboardingResult = resolver.resolve(onboarding, request({ capabilityId: 'capability.discover' }))
  assert.equal(onboardingResult.status, 'RESOLVED')
})

test('distinguishes unknown from every known incompatibility with canonical outcomes', () => {
  const supportedEntry = entry({ supportedVersions: SupportedVersionSet.create(['1.2.3']) })
  const basis = createCatalogBasisFixture({ scope: CatalogScope.normal('repo-a') }).register(supportedEntry)
  const resolver = new RegistryResolutionService()
  const unknown = resolver.resolve(basis, request({ capabilityId: 'not-registered' }))
  const incompatibleVersion = resolver.resolve(basis, request({ semanticVersion: '2.0.0' }))
  const incompatibleSchema = resolver.resolve(basis, request({ schema: SchemaReference.create({ schemaId: 'other-input', version: '1.0.0' }) }))
  assert.equal(isRegistryFailure(unknown), true)
  assert.equal(isRegistryFailure(incompatibleVersion), true)
  assert.equal(isRegistryFailure(incompatibleSchema), true)
  if (!isRegistryFailure(unknown) || !isRegistryFailure(incompatibleVersion) || !isRegistryFailure(incompatibleSchema)) return
  assert.equal(unknown.code, 'UNKNOWN_CAPABILITY')
  assert.equal(incompatibleVersion.code, 'INCOMPATIBLE_CAPABILITY')
  assert.equal(incompatibleSchema.code, 'INCOMPATIBLE_CAPABILITY')
  assert.equal(incompatibleSchema.noApproval, true)
  assert.equal(incompatibleSchema.noMutation, true)
})

test('registers a synthetic capability through the common domain registry path', () => {
  const basis = createCatalogBasisFixture({ scope: CatalogScope.normal('repo-a'), source: 'REPO_NORMAL_CATALOG' })
  const synthetic = entry({ capabilityId: 'capability.synthetic', semanticVersion: '3.0.0' })
  const registered = basis.register(synthetic)
  const resolved = new RegistryResolutionService().resolve(registered, request({
    capabilityId: 'capability.synthetic',
    semanticVersion: '3.0.0',
  }))
  assert.equal(resolved.status, 'RESOLVED')
  assert.equal(registered.entries.length, 1)
  assert.equal(basis.entries.length, 0)
  if (resolved.status === 'RESOLVED') assert.equal(resolved.entry, synthetic)
})

test('rejects direct basis injection, forged scope and forged schema authority', () => {
  const validBasis = createCatalogBasisFixture({ scope: CatalogScope.bootstrap(), source: 'SYSTEM_BOOTSTRAP_CATALOG' }).register(entry({ category: 'DISCOVERY' }))
  const source = new FixtureBootstrapSource(validBasis)
  const useCase = new ResolveExecCapability(new RegistryResolutionService(), source)
  const direct = useCase.resolve({
    ...scopedRequest(CatalogScope.bootstrap()),
    basis: validBasis,
  } as never)
  assert.equal(direct.status, 'FAILED')
  if (direct.status === 'FAILED') assert.equal(direct.code, 'CONTRACT_INVALID')

  const forgedScope = Object.create(CatalogScope.prototype) as CatalogScope
  Object.assign(forgedScope, { name: 'BOOTSTRAP' })
  const forgedScopeResult = useCase.resolve({ ...scopedRequest(forgedScope) })
  assert.equal(forgedScopeResult.status, 'FAILED')
  if (forgedScopeResult.status === 'FAILED') assert.equal(forgedScopeResult.code, 'CONTRACT_INVALID')

  const forgedSchema = Object.create(SchemaReference.prototype) as SchemaReference
  Object.assign(forgedSchema, { schemaId: 'exec-input', version: '1.0.0' })
  assert.throws(() => entry({ inputSchema: forgedSchema }), /authenticated schema reference/)
})

test('rejects matching-source forgery, copied receipts and the DOM bootstrap substitute', () => {
  const scope = CatalogScope.bootstrap()
  const basis = createCatalogBasisFixture({ scope, source: 'SYSTEM_BOOTSTRAP_CATALOG' })
    .register(entry({ category: 'DISCOVERY', capabilityId: 'capability.discover' }))
  const requestForScope = scopedRequest(scope, { capabilityId: 'capability.discover' })

  const matchingSourceForgery = new ResolveExecCapability(new RegistryResolutionService(), {
    read: () => basis,
  } as never).resolve(requestForScope)
  assert.equal(matchingSourceForgery.status, 'FAILED')
  if (matchingSourceForgery.status === 'FAILED') assert.equal(matchingSourceForgery.code, 'CONTRACT_INVALID')

  class CallerDefinedSource extends AuthenticatedBootstrapCatalogSource {
    constructor() {
      super()
    }

    read(): CatalogBasisSourceReceipt {
      return { basis } as never
    }
  }
  const callerDefinedSource = new ResolveExecCapability(new RegistryResolutionService(), new CallerDefinedSource())
    .resolve(requestForScope)
  assert.equal(callerDefinedSource.status, 'FAILED')
  if (callerDefinedSource.status === 'FAILED') assert.equal(callerDefinedSource.code, 'CONTRACT_INVALID')

  const legitimateSource = new FixtureBootstrapSource(basis)
  const issued = legitimateSource.read()
  const stale = new ResolveExecCapability(new RegistryResolutionService(), legitimateSource)
    .resolve({ ...requestForScope, catalogRevision: 1 })
  assert.equal(stale.status, 'FAILED')
  if (stale.status === 'FAILED') assert.equal(stale.code, 'CONTRACT_INVALID')

  const copiedReceipt = new ResolveExecCapability(new RegistryResolutionService(), {
    read: () => ({ basis: issued.basis }),
  } as never).resolve(requestForScope)
  assert.equal(copiedReceipt.status, 'FAILED')
  if (copiedReceipt.status === 'FAILED') assert.equal(copiedReceipt.code, 'CONTRACT_INVALID')
  assert.equal(Object.isFrozen(issued.basis), true)

  const domSource = new ResolveExecCapability(new RegistryResolutionService(), new FixtureDomExecutionSource(basis) as never)
    .resolve(requestForScope)
  assert.equal(domSource.status, 'FAILED')
  if (domSource.status === 'FAILED') assert.equal(domSource.code, 'CONTRACT_INVALID')
})

test('rejects caller-selected repository authority and ignores caller support-set authority', () => {
  const basis = createCatalogBasisFixture({ scope: CatalogScope.normal('repo-a'), source: 'REPO_NORMAL_CATALOG' })
    .register(entry())
  const source = new FixtureNormalSource(basis)
  const domSource = new FixtureDomExecutionSource(domBasisFor(basis))
  const useCase = new ResolveExecCapability(new RegistryResolutionService(), undefined, source, domSource)

  const wrongRepository = useCase.resolve(scopedRequest(CatalogScope.normal('caller-selected-repository')))
  assert.equal(wrongRepository.status, 'FAILED')
  if (wrongRepository.status === 'FAILED') assert.equal(wrongRepository.code, 'CONTRACT_INVALID')

  const callerSupportSet = new RegistryResolutionService().resolve(basis, {
    ...request(),
    supportedVersions: SupportedVersionSet.create(['9.9.9']),
  } as never)
  assert.equal(callerSupportSet.status, 'RESOLVED')
  if (callerSupportSet.status === 'RESOLVED') assert.equal(callerSupportSet.entry.semanticVersion.value, '1.2.3')
})

test('rejects caller-created fixture authority from productive registration without changing the prior basis', () => {
  const basis = createCatalogBasisFixture({ scope: CatalogScope.normal('repo-a'), source: 'REPO_NORMAL_CATALOG' })
    .register(entry())
  const before = registryBasisIdentity(basis)
  const forgedEntry = Object.create(RegistryEntry.prototype) as RegistryEntry
  Object.assign(forgedEntry, { stage: 'PLAN', skillContractId: 'skill.contract', capabilityId: 'forged' })
  assert.throws(() => basis.register(forgedEntry), /registry entry/)
  assert.equal(registryBasisIdentity(basis), before)

  const forgedBasis = Object.create(CatalogBasis.prototype) as CatalogBasis
  const composition = createExecRegistry()
  assert.throws(() => composition.register.register(forgedBasis as never, entry()), /read/)
  const callerCreatedBasis = createCatalogBasisFixture({ scope: CatalogScope.normal('caller-owned'), source: 'REPO_NORMAL_CATALOG' })
  const callerFixture = createLocalNormalCatalogFixture(() => callerCreatedBasis)
  assert.throws(() => composition.register.register(callerFixture, entry()), /fixtures cannot publish productive registration authority/)
  assert.equal(registryBasisIdentity(basis), before)
})

test('authenticates resolver output and binds it to the requested basis and contract', () => {
  const basis = createCatalogBasisFixture({ scope: CatalogScope.normal('repo-a') }).register(entry())
  const resolver = new RegistryResolutionService()
  const result = resolver.resolve(basis, request())
  assert.equal(Object.isFrozen(result), true)
  assert.throws(() => Object.assign(result as object, { requestedVersion: SemanticVersion.parse('9.9.9') }), TypeError)
  assert.equal(isRegistryResolutionBoundToRequest(result, basis, request()), true)
  assert.equal(isRegistryResolutionBoundToRequest(result, basis, request({ capabilityId: 'other-capability' })), false)
  assert.equal(isRegistryResolutionBoundToRequest(result, basis, request({ semanticVersion: '2.0.0' })), false)
  assert.equal(isRegistryResolutionBoundToRequest({ ...result } as never, basis, request()), false)

  const otherBasis = createCatalogBasisFixture({ scope: CatalogScope.normal('repo-b') }).register(entry())
  const otherResult = resolver.resolve(otherBasis, request())
  assert.equal(isRegistryResolutionBoundToRequest(otherResult, basis, request()), false)
})

test('rejects caller-injected resolver results and alternate resolver adapters', () => {
  class AlternateResolver extends RegistryResolutionService {}
  assert.throws(() => new AlternateResolver(), /substitutions are not authoritative/)
  assert.throws(() => new ResolveExecCapability({
    resolve: () => ({ status: 'RESOLVED', code: 'RESOLVED' }),
  } as never), /authenticated registry resolver/)
})

test('maps nullish, malformed and throwing-getter contexts to structured failures', () => {
  const useCase = new ResolveExecCapability(new RegistryResolutionService())
  const throwingGetter = Object.defineProperty({}, 'scope', {
    configurable: true,
    get() {
      throw new Error('scope getter must not escape')
    },
  })
  for (const invalid of [null, undefined, 42, 'not-an-object', {}, throwingGetter]) {
    const result = useCase.resolve(invalid as never)
    assert.equal(result.status, 'FAILED')
    if (result.status === 'FAILED') {
      assert.equal(result.code, 'CONTRACT_INVALID')
      assert.equal(result.noApproval, true)
      assert.equal(result.noMutation, true)
    }
  }
})

test('maps unavailable, untrusted and wrong-source adapters to structured fail-closed results', () => {
  const scope = CatalogScope.bootstrap()
  const requestForScope = scopedRequest(scope, { capabilityId: 'capability.discover' })
  const missing = new ResolveExecCapability(new RegistryResolutionService()).resolve(requestForScope)
  assert.equal(missing.status, 'FAILED')
  if (missing.status === 'FAILED') {
    assert.equal(missing.code, 'CONTRACT_INVALID')
    assert.equal(missing.noApproval, true)
    assert.equal(missing.noMutation, true)
  }

  const untrusted = new ResolveExecCapability(new RegistryResolutionService(), {
    read: () => ({ basis: { scope, source: 'SYSTEM_BOOTSTRAP_CATALOG', catalogRevision: 1, entries: [] } } as never),
  } as never).resolve(requestForScope)
  assert.equal(untrusted.status, 'FAILED')
  if (untrusted.status === 'FAILED') assert.equal(untrusted.code, 'CONTRACT_INVALID')

  const wrongSourceBasis = createCatalogBasisFixture({ scope, source: 'untrusted-source' }).register(entry({ category: 'DISCOVERY', capabilityId: 'capability.discover' }))
  const wrongSource = new ResolveExecCapability(new RegistryResolutionService(), new FixtureBootstrapSource(wrongSourceBasis))
    .resolve(requestForScope)
  assert.equal(wrongSource.status, 'FAILED')
  if (wrongSource.status === 'FAILED') assert.equal(wrongSource.code, 'CONTRACT_INVALID')
})

test('rejects local fixture source seams at the productive application boundary', () => {
  const bootstrapBasis = createCatalogBasisFixture({ scope: CatalogScope.bootstrap(), source: 'SYSTEM_BOOTSTRAP_CATALOG' })
    .register(entry({ category: 'DISCOVERY', capabilityId: 'capability.discover' }))
  let bootstrapReads = 0
  class CountingBootstrapSource extends AuthenticatedBootstrapCatalogSource {
    constructor() {
      super()
      createLocalBootstrapCatalogFixture(() => {
        bootstrapReads += 1
        return bootstrapBasis
      }, this)
    }

    read(): CatalogBasisSourceReceipt {
      throw new Error('fixture source was not initialized')
    }
  }
  const useCase = new ResolveExecCapability(
    new RegistryResolutionService(),
    new CountingBootstrapSource(),
  )
  const result = useCase.resolve({
    ...request({ capabilityId: 'capability.discover' }),
    scope: CatalogScope.bootstrap(),
    catalogRevision: 2,
  })
  assert.equal(result.status, 'FAILED')
  if (result.status === 'FAILED') assert.equal(result.code, 'CONTRACT_INVALID')
  assert.equal(bootstrapReads, 0)
})

test('productive registry graph has no infrastructure, prototype, transport or generic bucket dependency', () => {
  const sourceFiles = [
    resolve('src/domain/exec-registry.ts'),
    resolve('src/application/exec-registry.ts'),
    resolve('src/application/exec-registry-ports.ts'),
    resolve('src/composition/exec-registry.ts'),
  ]
  const forbiddenImports = /from\s+['"](?:[^'\"]*\/)?(?:infrastructure|transport|prototype|\.pi)(?:\/|['"])/i
  for (const sourceFile of sourceFiles) {
    assert.equal(existsSync(sourceFile), true)
    const source = readFileSync(sourceFile, 'utf8')
    assert.doesNotMatch(source, forbiddenImports, sourceFile)
    assert.doesNotMatch(source, /from\s+['"][^'\"]*(?:react|database|filesystem|http)[^'\"]*['"]/i, sourceFile)
    assert.equal(dirname(sourceFile).startsWith(resolve('src')), true)
  }
})

test('exec registry architecture guard imports the real graph and exercises the common path', async () => {
  const [domain, application, ports, composition] = await Promise.all([
    import('../src/domain/exec-registry.ts'),
    import('../src/application/exec-registry.ts'),
    import('../src/application/exec-registry-ports.ts'),
    import('../src/composition/exec-registry.ts'),
  ])
  assert.equal(typeof domain.RegistryResolutionService, 'function')
  assert.equal(typeof application.ResolveExecCapability, 'function')
  assert.equal(typeof ports.createLocalNormalCatalogFixture, 'function')
  assert.equal(typeof composition.createExecRegistry, 'function')

  const basis = createCatalogBasisFixture({
    scope: CatalogScope.normal('runtime-guard'),
    source: 'REPO_NORMAL_CATALOG',
  }).register(entry({ capabilityId: 'capability.runtime-guard' }))
  const normalSource = createLocalNormalCatalogFixture(() => basis)
  const domSource = createLocalExecutionCatalogBasisFixture(() => domBasisFor(basis))
  const registry = composition.createExecRegistry(undefined, normalSource, domSource)
  assert.equal('resolver' in registry, false)
  const result = registry.resolve.resolve({
    ...request({ capabilityId: 'capability.runtime-guard' }),
    scope: CatalogScope.normal('runtime-guard'),
    catalogRevision: 2,
  })
  assert.equal(result.status, 'FAILED')
  if (result.status === 'FAILED') assert.equal(result.code, 'CONTRACT_INVALID')
})
