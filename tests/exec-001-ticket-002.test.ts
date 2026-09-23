import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { existsSync } from 'node:fs'
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
}> = {}): RegistryEntry {
  return RegistryEntry.create({
    stage: overrides.stage ?? 'PLAN',
    skillContractId: overrides.skillContractId ?? 'skill.contract',
    capabilityId: overrides.capabilityId ?? 'capability.registry',
    semanticVersion: overrides.semanticVersion ?? '1.2.3',
    inputSchema,
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
  role: string
}> = {}) {
  return {
    stage: overrides.stage ?? 'PLAN',
    skillContractId: overrides.skillContractId ?? 'skill.contract',
    capabilityId: overrides.capabilityId ?? 'capability.registry',
    schema: inputSchema,
    semanticVersion: overrides.semanticVersion ?? '1.2.3',
    supportedVersions: overrides.supportedVersions ?? SupportedVersionSet.create(['1.2.3']),
    ...(overrides.role === undefined ? {} : { role: overrides.role }),
  }
}

test('parses semantic versions and exposes major/minor/patch change semantics', () => {
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
})

test('resolves only explicit supported versions without alias or major approximation', () => {
  const supported = SupportedVersionSet.create(['1.2.3', '1.3.0'])
  assert.equal(supported.has('1.2.3'), true)
  assert.equal(supported.has('1.2.4'), false)
  assert.equal(supported.has('1.2'), false)
  assert.equal(supported.has('2.0.0'), false)
  assert.throws(() => SupportedVersionSet.create(['1.0.0', '1.0.0']), /duplicates/)
})

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
  assert.equal(result.entry.inputSchema, inputSchema)
  assert.deepEqual(result.entry.acceptedArtifacts, ['input.json'])
  assert.deepEqual(result.entry.producedArtifacts, ['output.json'])
  assert.deepEqual(result.entry.allowedVerdicts, ['PASS', 'FAIL'])
  assert.deepEqual(result.entry.allowedRoles, ['IMPLEMENTER'])
  assert.equal(result.basis, registered)
  assert.equal(basis.entries.length, 0)
  assert.equal(registered.entries.length, 1)
  assert.equal(registryBasisIdentity(basis), JSON.stringify(['NORMAL:repo-a', 1, 'repo-a-config', []]))
})

test('rejects duplicates and conflicts without mutating the frozen basis', () => {
  const basis = CatalogBasis.create({ scope: CatalogScope.normal('repo-a') }).register(entry())
  const before = registryBasisIdentity(basis)
  assert.throws(() => basis.register(entry()), /same immutable key/)
  assert.equal(registryBasisIdentity(basis), before)
  assert.equal(basis.entries.length, 1)
})

test('keeps NORMAL repositories isolated even when their entry shapes match', () => {
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
})

test('keeps BOOTSTRAP independent and rejects normal capabilities before work', () => {
  const bootstrap = CatalogBasis.create({ scope: CatalogScope.bootstrap(), source: 'system-bootstrap' })
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

  const onboarding = CatalogBasis.create({ scope: CatalogScope.bootstrap() })
    .register(entry({ category: 'DISCOVERY', capabilityId: 'capability.discover' }))
  const onboardingResult = resolver.resolve(onboarding, request({ capabilityId: 'capability.discover' }))
  assert.equal(onboardingResult.status, 'RESOLVED')
})

test('distinguishes unknown and incompatible capabilities with canonical outcomes', () => {
  const supportedEntry = entry({ supportedVersions: SupportedVersionSet.create(['1.2.3']) })
  const basis = CatalogBasis.create({ scope: CatalogScope.normal('repo-a') }).register(supportedEntry)
  const resolver = new RegistryResolutionService()
  const unknown = resolver.resolve(basis, request({ capabilityId: 'not-registered' }))
  const incompatible = resolver.resolve(basis, request({ semanticVersion: '2.0.0', supportedVersions: SupportedVersionSet.create(['2.0.0']) }))
  assert.equal(isRegistryFailure(unknown), true)
  assert.equal(isRegistryFailure(incompatible), true)
  if (!isRegistryFailure(unknown) || !isRegistryFailure(incompatible)) return
  assert.equal(unknown.code, 'UNKNOWN_CAPABILITY')
  assert.equal(incompatible.code, 'INCOMPATIBLE_CAPABILITY')
  assert.notEqual(unknown.code, incompatible.code)
})

test('registers a synthetic schema-valid capability through the common path', () => {
  const basis = CatalogBasis.create({ scope: CatalogScope.normal('repo-a') })
  const synthetic = entry({ capabilityId: 'capability.synthetic', semanticVersion: '3.0.0' })
  const composition = createExecRegistry()
  const registration = composition.register.register(basis, synthetic)
  assert.equal(registration.status, 'REGISTERED')
  assert.equal(registration.basis.entries.length, 1)
  assert.equal(basis.entries.length, 0)
  const resolved = composition.resolve.resolve({
    ...request({ capabilityId: 'capability.synthetic', semanticVersion: '3.0.0', supportedVersions: SupportedVersionSet.create(['3.0.0']) }),
    basis: registration.basis,
  })
  assert.equal(resolved.status, 'RESOLVED')
  assert.equal(registration.basis.entries[0], synthetic)
})

test('uses authorized application source seams without moving foreign ownership into domain', () => {
  const bootstrapBasis = CatalogBasis.create({ scope: CatalogScope.bootstrap() }).register(entry({ category: 'DISCOVERY', capabilityId: 'capability.discover' }))
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
  const forbidden = /(?:prototype|\.pi|infrastructure|filesystem|http|react|database|util)/i
  for (const sourceFile of sourceFiles) {
    assert.equal(existsSync(sourceFile), true)
    assert.doesNotMatch(readFileSync(sourceFile, 'utf8'), forbidden, sourceFile)
    assert.equal(dirname(sourceFile).startsWith(resolve('src')), true)
  }
})
