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
  isRegistryFailure,
  isRegistryResolution,
  registryBasisIdentity,
} from '../src/domain/exec-registry.ts'
import { ResolveExecCapability } from '../src/application/exec-registry.ts'
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
  supportedVersions: SupportedVersionSet
  schema: SchemaReference
  role: string
}> = {}) {
  return {
    stage: overrides.stage ?? 'PLAN',
    skillContractId: overrides.skillContractId ?? 'skill.contract',
    capabilityId: overrides.capabilityId ?? 'capability.registry',
    schema: overrides.schema ?? inputSchema,
    semanticVersion: overrides.semanticVersion ?? '1.2.3',
    supportedVersions: overrides.supportedVersions ?? SupportedVersionSet.create(['1.2.3']),
    ...(overrides.role === undefined ? {} : { role: overrides.role }),
  }
}

function scopedRequest(scope: CatalogScope, overrides: Parameters<typeof request>[0] = {}) {
  return { ...request(overrides), scope }
}

test('parses semantic versions and preserves exact change semantics', () => {
  const version = SemanticVersion.parse('1.2.3-beta.1+build.7')
  assert.equal(version.major, 1)
  assert.equal(version.minor, 2)
  assert.equal(version.patch, 3)
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
  const basis = CatalogBasis.create({ scope: CatalogScope.normal('repo-a'), source: 'repo-a-config' })
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

test('rejects duplicate and conflicting registration without mutating the frozen basis', () => {
  const basis = CatalogBasis.create({ scope: CatalogScope.normal('repo-a') }).register(entry())
  const before = registryBasisIdentity(basis)
  assert.throws(() => basis.register(entry()), /same immutable key/)
  assert.throws(() => basis.register(entry({ stage: 'RUN' })), /same immutable key/)
  assert.equal(registryBasisIdentity(basis), before)
  assert.equal(basis.entries.length, 1)
})

test('keeps NORMAL repositories isolated and rejects cross-scope source substitution', () => {
  const first = CatalogBasis.create({ scope: CatalogScope.normal('repo-a') }).register(entry())
  const second = CatalogBasis.create({ scope: CatalogScope.normal('repo-b') }).register(entry())
  const resolver = new RegistryResolutionService()
  const firstResult = resolver.resolve(first, request())
  const secondResult = resolver.resolve(second, request())
  assert.equal(firstResult.status, 'RESOLVED')
  assert.equal(secondResult.status, 'RESOLVED')
  assert.notEqual(first.scope.repositoryId, second.scope.repositoryId)
  assert.notEqual(registryBasisIdentity(first), registryBasisIdentity(second))
  assert.equal(first.findByIdentity(first.entries[0].identity(first.scope)), first.entries[0])
  assert.equal(second.findByIdentity(second.entries[0].identity(second.scope)), second.entries[0])

  const useCase = new ResolveExecCapability(new RegistryResolutionService(), undefined, {
    read: () => first,
  })
  const substituted = useCase.resolve(scopedRequest(CatalogScope.normal('repo-b')))
  assert.equal(substituted.status, 'FAILED')
  if (substituted.status === 'FAILED') {
    assert.equal(substituted.code, 'CONTRACT_INVALID')
    assert.equal(substituted.noApproval, true)
    assert.equal(substituted.noMutation, true)
  }
})

test('keeps BOOTSTRAP independent and rejects normal capabilities before work', () => {
  const bootstrap = CatalogBasis.create({ scope: CatalogScope.bootstrap(), source: 'DOM_EXECUTION_BASIS' })
    .register(entry({ category: 'NORMAL' }))
  const resolver = new RegistryResolutionService()
  const result = resolver.resolve(bootstrap, request())
  assert.equal(result.status, 'FAILED')
  if (result.status !== 'FAILED') return
  assert.equal(result.code, 'INCOMPATIBLE_CAPABILITY')
  assert.equal(result.noApproval, true)
  assert.equal(result.noMutation, true)
  assert.equal(BootstrapAllowlistPolicy.permits(bootstrap.scope, bootstrap.entries[0]), false)
  assert.deepEqual(BOOTSTRAP_CAPABILITY_CATEGORIES, ['DISCOVERY', 'VALIDATION', 'MIGRATION', 'AUDIT', 'REMEDIATION'])

  const onboarding = CatalogBasis.create({ scope: CatalogScope.bootstrap(), source: 'DOM_EXECUTION_BASIS' })
    .register(entry({ category: 'DISCOVERY', capabilityId: 'capability.discover' }))
  const onboardingResult = resolver.resolve(onboarding, request({ capabilityId: 'capability.discover' }))
  assert.equal(onboardingResult.status, 'RESOLVED')
})

test('distinguishes unknown from every known incompatibility with canonical outcomes', () => {
  const supportedEntry = entry({ supportedVersions: SupportedVersionSet.create(['1.2.3']) })
  const basis = CatalogBasis.create({ scope: CatalogScope.normal('repo-a') }).register(supportedEntry)
  const resolver = new RegistryResolutionService()
  const unknown = resolver.resolve(basis, request({ capabilityId: 'not-registered' }))
  const incompatibleVersion = resolver.resolve(basis, request({ semanticVersion: '2.0.0', supportedVersions: SupportedVersionSet.create(['2.0.0']) }))
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

test('registers a synthetic capability through the common source-selected path', () => {
  const basis = CatalogBasis.create({ scope: CatalogScope.normal('repo-a'), source: 'REPO_NORMAL_CATALOG' })
  const synthetic = entry({ capabilityId: 'capability.synthetic', semanticVersion: '3.0.0' })
  let currentBasis = basis
  const composition = createExecRegistry(undefined, { read: () => currentBasis })
  const registration = composition.register.register(basis, synthetic)
  currentBasis = registration.basis
  assert.equal(registration.status, 'REGISTERED')
  assert.equal(registration.basis.entries.length, 1)
  assert.equal(basis.entries.length, 0)
  const resolved = composition.resolve.resolve({
    ...request({ capabilityId: 'capability.synthetic', semanticVersion: '3.0.0', supportedVersions: SupportedVersionSet.create(['3.0.0']) }),
    scope: CatalogScope.normal('repo-a'),
  })
  assert.equal(resolved.status, 'RESOLVED')
  assert.equal(registration.basis.entries[0], synthetic)
})

test('rejects direct basis injection, forged scope and forged schema authority', () => {
  const validBasis = CatalogBasis.create({ scope: CatalogScope.bootstrap(), source: 'DOM_EXECUTION_BASIS' }).register(entry({ category: 'DISCOVERY' }))
  const source = { read: () => validBasis }
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
    read: () => ({ scope, source: 'DOM_EXECUTION_BASIS', catalogRevision: 1, entries: [] } as never),
  }).resolve(requestForScope)
  assert.equal(untrusted.status, 'FAILED')
  if (untrusted.status === 'FAILED') assert.equal(untrusted.code, 'CONTRACT_INVALID')

  const wrongSourceBasis = CatalogBasis.create({ scope, source: 'untrusted-source' }).register(entry({ category: 'DISCOVERY', capabilityId: 'capability.discover' }))
  const wrongSource = new ResolveExecCapability(new RegistryResolutionService(), { read: () => wrongSourceBasis })
    .resolve(requestForScope)
  assert.equal(wrongSource.status, 'FAILED')
  if (wrongSource.status === 'FAILED') assert.equal(wrongSource.code, 'CONTRACT_INVALID')
})

test('uses authorized application source seams without moving foreign ownership into domain', () => {
  const bootstrapBasis = CatalogBasis.create({ scope: CatalogScope.bootstrap(), source: 'DOM_EXECUTION_BASIS' })
    .register(entry({ category: 'DISCOVERY', capabilityId: 'capability.discover' }))
  let bootstrapReads = 0
  const useCase = new ResolveExecCapability(
    new RegistryResolutionService(),
    { read: () => { bootstrapReads += 1; return bootstrapBasis } },
  )
  const result = useCase.resolve({
    ...request({ capabilityId: 'capability.discover' }),
    scope: CatalogScope.bootstrap(),
  })
  assert.equal(result.status, 'RESOLVED')
  assert.equal(bootstrapReads, 1)
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
