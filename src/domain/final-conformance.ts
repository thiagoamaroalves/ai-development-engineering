import {
  CanonicalIdentityReference,
  CanonicalIdentityReferenceInput,
} from './identity.js'
import {
  CandidateBasis,
  CandidateBasisInput,
} from './publication.js'

export const FINAL_CONFORMANCE_DIMENSIONS = Object.freeze([
  'ADHERENCE',
  'COVERAGE',
  'INTEGRATION',
  'REGRESSIONS',
  'TESTS',
  'OMISSIONS',
  'EXTRAPOLATIONS',
] as const)

export type FinalConformanceDimension = (typeof FINAL_CONFORMANCE_DIMENSIONS)[number]
export type FinalConformanceDimensionResult = 'PROVEN' | 'FAILED'
export type FinalConformanceResult = 'CONFORMANT' | 'REMEDIATION_REQUIRED'
export type FinalConformanceFindingCategory =
  | 'MISSING_DIMENSION'
  | 'DUPLICATE_DIMENSION'
  | 'EXTRAPOLATED_DIMENSION'
  | 'FAILED_DIMENSION'

export type FinalConformanceErrorCode =
  | 'INVALID_FINAL_CONFORMANCE_EVIDENCE'
  | 'FINAL_CONFORMANCE_SCOPE_MISMATCH'
  | 'FINAL_CONFORMANCE_EVIDENCE_DRIFT'
  | 'FINAL_CONFORMANCE_STALE'
  | 'FINAL_CONFORMANCE_NOT_FOUND'
  | 'FINAL_CONFORMANCE_CONFLICT'
  | 'FINAL_CONFORMANCE_RECONSTRUCTION_AUTHORITY_REQUIRED'

export class FinalConformanceDomainError extends Error {
  readonly code: FinalConformanceErrorCode

  constructor(code: FinalConformanceErrorCode, message: string) {
    super(message)
    this.name = 'FinalConformanceDomainError'
    this.code = code
  }
}

function token(value: unknown, label: string): string {
  if (typeof value !== 'string' || !value.trim() || /[\r\n]/.test(value)) {
    throw new FinalConformanceDomainError(
      'INVALID_FINAL_CONFORMANCE_EVIDENCE',
      `${label} must be a non-empty single-line value.`,
    )
  }
  return value.trim()
}

function referenceInput(reference: CanonicalIdentityReference): CanonicalIdentityReferenceInput {
  return {
    identity: {
      kind: reference.identity.kind,
      scope: reference.identity.scope.value,
      value: reference.identity.value,
    },
    revision: reference.revision.value,
  }
}

function sameArray<T>(left: readonly T[], right: readonly T[], equals: (left: T, right: T) => boolean): boolean {
  return left.length === right.length && left.every((value, index) => equals(value, right[index]))
}

export interface FinalConformanceScopeInput {
  readonly artifactIdentity: CanonicalIdentityReferenceInput | CanonicalIdentityReference
  readonly artifactRevision: string
  readonly cycleIdentity: CanonicalIdentityReferenceInput | CanonicalIdentityReference
  readonly implementationRevision: string
  readonly candidateBasis: CandidateBasisInput | CandidateBasis
  readonly evaluatorVersion: string
}

export class FinalConformanceScope {
  readonly artifactIdentity: CanonicalIdentityReference
  readonly artifactRevision: string
  readonly cycleIdentity: CanonicalIdentityReference
  readonly implementationRevision: string
  readonly candidateBasis: CandidateBasis
  readonly evaluatorVersion: string

  private constructor(input: {
    readonly artifactIdentity: CanonicalIdentityReference
    readonly artifactRevision: string
    readonly cycleIdentity: CanonicalIdentityReference
    readonly implementationRevision: string
    readonly candidateBasis: CandidateBasis
    readonly evaluatorVersion: string
  }) {
    this.artifactIdentity = input.artifactIdentity
    this.artifactRevision = input.artifactRevision
    this.cycleIdentity = input.cycleIdentity
    this.implementationRevision = input.implementationRevision
    this.candidateBasis = input.candidateBasis
    this.evaluatorVersion = input.evaluatorVersion
    Object.freeze(this)
  }

  static create(input: FinalConformanceScopeInput | FinalConformanceScope): FinalConformanceScope {
    if (input instanceof FinalConformanceScope) return input

    const artifactIdentity = input.artifactIdentity instanceof CanonicalIdentityReference
      ? input.artifactIdentity
      : CanonicalIdentityReference.create(input.artifactIdentity)
    const cycleIdentity = input.cycleIdentity instanceof CanonicalIdentityReference
      ? input.cycleIdentity
      : CanonicalIdentityReference.create(input.cycleIdentity)

    if (artifactIdentity.identity.kind !== 'ARTIFACT' || cycleIdentity.identity.kind !== 'ARTIFACT_CYCLE') {
      throw new FinalConformanceDomainError(
        'FINAL_CONFORMANCE_SCOPE_MISMATCH',
        'Final conformance scope requires ARTIFACT and ARTIFACT_CYCLE identities.',
      )
    }

    return new FinalConformanceScope({
      artifactIdentity,
      artifactRevision: token(input.artifactRevision, 'Artifact revision'),
      cycleIdentity,
      implementationRevision: token(input.implementationRevision, 'Implementation revision'),
      candidateBasis: input.candidateBasis instanceof CandidateBasis
        ? input.candidateBasis
        : CandidateBasis.create(input.candidateBasis),
      evaluatorVersion: token(input.evaluatorVersion, 'Evaluator version'),
    })
  }

  get canonicalKey(): string {
    return `${this.artifactIdentity.canonicalKey}|artifact-revision=${this.artifactRevision}|${this.cycleIdentity.canonicalKey}|implementation=${this.implementationRevision}|candidate=${this.candidateBasis.candidateId}|base=${this.candidateBasis.baseSha}|head=${this.candidateBasis.headSha}|tree=${this.candidateBasis.treeHash}|conformance=${this.candidateBasis.conformanceRunId}|evaluator=${this.evaluatorVersion}`
  }

  equals(other: FinalConformanceScope): boolean {
    return this.artifactIdentity.equals(other.artifactIdentity)
      && this.artifactRevision === other.artifactRevision
      && this.cycleIdentity.equals(other.cycleIdentity)
      && this.implementationRevision === other.implementationRevision
      && this.candidateBasis.equals(other.candidateBasis)
      && this.evaluatorVersion === other.evaluatorVersion
  }

  toInput(): FinalConformanceScopeInput {
    return {
      artifactIdentity: referenceInput(this.artifactIdentity),
      artifactRevision: this.artifactRevision,
      cycleIdentity: referenceInput(this.cycleIdentity),
      implementationRevision: this.implementationRevision,
      candidateBasis: this.candidateBasis,
      evaluatorVersion: this.evaluatorVersion,
    }
  }
}

export class FinalConformanceRevision {
  readonly value: number

  private constructor(value: number) {
    this.value = value
    Object.freeze(this)
  }

  static create(value: unknown = 0): FinalConformanceRevision {
    if (typeof value !== 'number' || !Number.isInteger(value) || value < 0) {
      throw new FinalConformanceDomainError(
        'INVALID_FINAL_CONFORMANCE_EVIDENCE',
        'Final conformance revision must be a non-negative integer.',
      )
    }
    return new FinalConformanceRevision(value)
  }

  next(): FinalConformanceRevision {
    return new FinalConformanceRevision(this.value + 1)
  }

  equals(other: FinalConformanceRevision): boolean {
    return this.value === other.value
  }
}

export interface FinalConformanceEvidenceItemInput {
  readonly scope: FinalConformanceScopeInput | FinalConformanceScope
  readonly dimension: string
  readonly result: FinalConformanceDimensionResult
  readonly evidenceId: string
  readonly evidenceHash: string
  readonly detail?: string
}

export class FinalConformanceEvidenceItem {
  readonly scope: FinalConformanceScope
  readonly dimension: string
  readonly result: FinalConformanceDimensionResult
  readonly evidenceId: string
  readonly evidenceHash: string
  readonly detail?: string

  private constructor(input: {
    readonly scope: FinalConformanceScope
    readonly dimension: string
    readonly result: FinalConformanceDimensionResult
    readonly evidenceId: string
    readonly evidenceHash: string
    readonly detail?: string
  }) {
    this.scope = input.scope
    this.dimension = input.dimension
    this.result = input.result
    this.evidenceId = input.evidenceId
    this.evidenceHash = input.evidenceHash
    this.detail = input.detail
    Object.freeze(this)
  }

  static create(input: FinalConformanceEvidenceItemInput | FinalConformanceEvidenceItem): FinalConformanceEvidenceItem {
    if (input instanceof FinalConformanceEvidenceItem) return input
    if (input.result !== 'PROVEN' && input.result !== 'FAILED') {
      throw new FinalConformanceDomainError(
        'INVALID_FINAL_CONFORMANCE_EVIDENCE',
        'Final conformance evidence result must be PROVEN or FAILED.',
      )
    }
    const detail = input.detail === undefined ? undefined : token(input.detail, 'Evidence detail')
    if (input.result === 'FAILED' && detail === undefined) {
      throw new FinalConformanceDomainError(
        'INVALID_FINAL_CONFORMANCE_EVIDENCE',
        'Failed conformance evidence requires a structured detail.',
      )
    }
    return new FinalConformanceEvidenceItem({
      scope: FinalConformanceScope.create(input.scope),
      dimension: token(input.dimension, 'Conformance dimension'),
      result: input.result,
      evidenceId: token(input.evidenceId, 'Evidence ID'),
      evidenceHash: token(input.evidenceHash, 'Evidence hash'),
      detail,
    })
  }

  exactEquals(other: FinalConformanceEvidenceItem): boolean {
    return this.scope.equals(other.scope)
      && this.dimension === other.dimension
      && this.result === other.result
      && this.evidenceId === other.evidenceId
      && this.evidenceHash === other.evidenceHash
      && this.detail === other.detail
  }

  toInput(): FinalConformanceEvidenceItemInput {
    return {
      scope: this.scope.toInput(),
      dimension: this.dimension,
      result: this.result,
      evidenceId: this.evidenceId,
      evidenceHash: this.evidenceHash,
      detail: this.detail,
    }
  }
}

export interface FinalConformanceEvidenceBundleInput {
  readonly scope: FinalConformanceScopeInput | FinalConformanceScope
  readonly observationId: string
  readonly items: readonly (FinalConformanceEvidenceItemInput | FinalConformanceEvidenceItem)[]
}

export class FinalConformanceEvidenceBundle {
  readonly scope: FinalConformanceScope
  readonly observationId: string
  readonly items: readonly FinalConformanceEvidenceItem[]

  private constructor(input: {
    readonly scope: FinalConformanceScope
    readonly observationId: string
    readonly items: readonly FinalConformanceEvidenceItem[]
  }) {
    this.scope = input.scope
    this.observationId = input.observationId
    this.items = Object.freeze([...input.items])
    Object.freeze(this)
  }

  static create(input: FinalConformanceEvidenceBundleInput | FinalConformanceEvidenceBundle): FinalConformanceEvidenceBundle {
    if (input instanceof FinalConformanceEvidenceBundle) return input
    const scope = FinalConformanceScope.create(input.scope)
    const items = input.items.map((item) => FinalConformanceEvidenceItem.create(item))
    if (items.some((item) => !item.scope.equals(scope))) {
      throw new FinalConformanceDomainError(
        'FINAL_CONFORMANCE_SCOPE_MISMATCH',
        'Every final conformance evidence item must attach to the exact artifact, cycle, and implementation scope.',
      )
    }
    return new FinalConformanceEvidenceBundle({
      scope,
      observationId: token(input.observationId, 'Evidence observation ID'),
      items,
    })
  }

  exactEvidenceEquals(other: FinalConformanceEvidenceBundle): boolean {
    return this.scope.equals(other.scope)
      && sameArray(this.items, other.items, (left, right) => left.exactEquals(right))
  }

  exactEquals(other: FinalConformanceEvidenceBundle): boolean {
    return this.observationId === other.observationId && this.exactEvidenceEquals(other)
  }

  toInput(): FinalConformanceEvidenceBundleInput {
    return {
      scope: this.scope.toInput(),
      observationId: this.observationId,
      items: this.items.map((item) => item.toInput()),
    }
  }
}

export interface FinalConformanceFindingInput {
  readonly id: string
  readonly category: FinalConformanceFindingCategory
  readonly dimension: string
  readonly evidenceIds: readonly string[]
  readonly reason: string
}

export class FinalConformanceFinding {
  readonly id: string
  readonly category: FinalConformanceFindingCategory
  readonly dimension: string
  readonly evidenceIds: readonly string[]
  readonly reason: string

  private constructor(input: FinalConformanceFindingInput) {
    this.id = input.id
    this.category = input.category
    this.dimension = input.dimension
    this.evidenceIds = Object.freeze([...input.evidenceIds])
    this.reason = input.reason
    Object.freeze(this)
  }

  static create(input: FinalConformanceFindingInput): FinalConformanceFinding {
    const categories: readonly string[] = [
      'MISSING_DIMENSION',
      'DUPLICATE_DIMENSION',
      'EXTRAPOLATED_DIMENSION',
      'FAILED_DIMENSION',
    ]
    if (!categories.includes(input.category)) {
      throw new FinalConformanceDomainError(
        'INVALID_FINAL_CONFORMANCE_EVIDENCE',
        'Final conformance finding category must be known.',
      )
    }
    const evidenceIds = input.evidenceIds.map((id) => token(id, 'Finding evidence ID'))
    if (new Set(evidenceIds).size !== evidenceIds.length) {
      throw new FinalConformanceDomainError(
        'INVALID_FINAL_CONFORMANCE_EVIDENCE',
        'Finding evidence IDs must be unique.',
      )
    }
    return new FinalConformanceFinding({
      id: token(input.id, 'Finding ID'),
      category: input.category,
      dimension: token(input.dimension, 'Finding dimension'),
      evidenceIds,
      reason: token(input.reason, 'Finding reason'),
    })
  }

  exactEquals(other: FinalConformanceFinding): boolean {
    return this.id === other.id
      && this.category === other.category
      && this.dimension === other.dimension
      && this.reason === other.reason
      && sameArray(this.evidenceIds, other.evidenceIds, (left, right) => left === right)
  }

  toInput(): FinalConformanceFindingInput {
    return {
      id: this.id,
      category: this.category,
      dimension: this.dimension,
      evidenceIds: [...this.evidenceIds],
      reason: this.reason,
    }
  }
}

export interface FinalConformanceSnapshot {
  readonly scope: FinalConformanceScopeInput
  readonly evidence: FinalConformanceEvidenceBundleInput
  readonly result: FinalConformanceResult
  readonly revision: number
  readonly findings: readonly FinalConformanceFindingInput[]
}

export interface FinalConformanceReconstructionAuthority {
  resolveForRehydration(cycleIdentity: CanonicalIdentityReference): FinalConformanceSnapshot | undefined
}

function isKnownDimension(value: string): value is FinalConformanceDimension {
  return (FINAL_CONFORMANCE_DIMENSIONS as readonly string[]).includes(value)
}

function findingId(category: FinalConformanceFindingCategory, dimension: string, ordinal: number): string {
  return `FINAL-${category}-${dimension}-${ordinal + 1}`
}

function analyzeEvidence(evidence: FinalConformanceEvidenceBundle): readonly FinalConformanceFinding[] {
  const findings: FinalConformanceFinding[] = []
  const byDimension = new Map<string, FinalConformanceEvidenceItem[]>()

  evidence.items.forEach((item, index) => {
    if (!isKnownDimension(item.dimension)) {
      findings.push(FinalConformanceFinding.create({
        id: findingId('EXTRAPOLATED_DIMENSION', item.dimension, index),
        category: 'EXTRAPOLATED_DIMENSION',
        dimension: item.dimension,
        evidenceIds: [item.evidenceId],
        reason: `Evidence dimension ${item.dimension} is not part of the canonical final-conformance set.`,
      }))
      return
    }
    const values = byDimension.get(item.dimension) ?? []
    values.push(item)
    byDimension.set(item.dimension, values)
  })

  FINAL_CONFORMANCE_DIMENSIONS.forEach((dimension, index) => {
    const values = byDimension.get(dimension) ?? []
    if (!values.length) {
      findings.push(FinalConformanceFinding.create({
        id: findingId('MISSING_DIMENSION', dimension, index),
        category: 'MISSING_DIMENSION',
        dimension,
        evidenceIds: [],
        reason: `Evidence for ${dimension} was omitted from the exact final-conformance bundle.`,
      }))
      return
    }
    if (values.length > 1) {
      findings.push(FinalConformanceFinding.create({
        id: findingId('DUPLICATE_DIMENSION', dimension, index),
        category: 'DUPLICATE_DIMENSION',
        dimension,
        evidenceIds: [...new Set(values.map((value) => value.evidenceId))],
        reason: `Dimension ${dimension} has duplicate evidence entries and cannot be evaluated exactly once.`,
      }))
      return
    }
    if (values[0].result === 'FAILED') {
      findings.push(FinalConformanceFinding.create({
        id: findingId('FAILED_DIMENSION', dimension, index),
        category: 'FAILED_DIMENSION',
        dimension,
        evidenceIds: [values[0].evidenceId],
        reason: values[0].detail ?? `Dimension ${dimension} reported failure.`,
      }))
    }
  })

  return Object.freeze(findings)
}

function findingsEqual(left: readonly FinalConformanceFinding[], right: readonly FinalConformanceFindingInput[]): boolean {
  return left.length === right.length && left.every((finding, index) => finding.exactEquals(FinalConformanceFinding.create(right[index])))
}

function snapshotMatches(left: FinalConformanceSnapshot, right: FinalConformanceSnapshot): boolean {
  try {
    const leftScope = FinalConformanceScope.create(left.scope)
    const rightScope = FinalConformanceScope.create(right.scope)
    const leftEvidence = FinalConformanceEvidenceBundle.create(left.evidence)
    const rightEvidence = FinalConformanceEvidenceBundle.create(right.evidence)
    const leftRevision = FinalConformanceRevision.create(left.revision)
    const rightRevision = FinalConformanceRevision.create(right.revision)
    return left.result === right.result
      && leftScope.equals(rightScope)
      && leftRevision.equals(rightRevision)
      && leftEvidence.exactEquals(rightEvidence)
      && findingsEqual(left.findings.map((finding) => FinalConformanceFinding.create(finding)), right.findings)
  } catch {
    return false
  }
}

export class FinalConformanceEvaluation {
  readonly scope: FinalConformanceScope
  readonly evidence: FinalConformanceEvidenceBundle
  readonly result: FinalConformanceResult
  readonly revision: FinalConformanceRevision
  readonly findings: readonly FinalConformanceFinding[]

  private constructor(input: {
    readonly scope: FinalConformanceScope
    readonly evidence: FinalConformanceEvidenceBundle
    readonly result: FinalConformanceResult
    readonly revision: FinalConformanceRevision
    readonly findings: readonly FinalConformanceFinding[]
  }) {
    this.scope = input.scope
    this.evidence = input.evidence
    this.result = input.result
    this.revision = input.revision
    this.findings = Object.freeze([...input.findings])
    Object.freeze(this)
  }

  static evaluate(
    input: FinalConformanceEvidenceBundleInput | FinalConformanceEvidenceBundle,
    previousRevision: FinalConformanceRevision | number = 0,
  ): FinalConformanceEvaluation {
    const evidence = FinalConformanceEvidenceBundle.create(input)
    const revision = previousRevision instanceof FinalConformanceRevision
      ? previousRevision
      : FinalConformanceRevision.create(previousRevision)
    const findings = analyzeEvidence(evidence)
    return new FinalConformanceEvaluation({
      scope: evidence.scope,
      evidence,
      result: findings.length === 0 ? 'CONFORMANT' : 'REMEDIATION_REQUIRED',
      revision: revision.next(),
      findings,
    })
  }

  static rehydrate(
    input: FinalConformanceSnapshot,
    authority: FinalConformanceReconstructionAuthority,
  ): FinalConformanceEvaluation {
    if (!authority || typeof authority.resolveForRehydration !== 'function') {
      throw new FinalConformanceDomainError(
        'FINAL_CONFORMANCE_RECONSTRUCTION_AUTHORITY_REQUIRED',
        'Final conformance rehydration requires accepted evaluation history authority.',
      )
    }
    if (input.result !== 'CONFORMANT' && input.result !== 'REMEDIATION_REQUIRED') {
      throw new FinalConformanceDomainError(
        'INVALID_FINAL_CONFORMANCE_EVIDENCE',
        'Final conformance result must be CONFORMANT or REMEDIATION_REQUIRED.',
      )
    }
    const scope = FinalConformanceScope.create(input.scope)
    const accepted = authority.resolveForRehydration(scope.cycleIdentity)
    if (!accepted || !snapshotMatches(accepted, input)) {
      throw new FinalConformanceDomainError(
        'FINAL_CONFORMANCE_RECONSTRUCTION_AUTHORITY_REQUIRED',
        'Final conformance material does not match accepted artifact/cycle authority.',
      )
    }
    const revision = FinalConformanceRevision.create(input.revision)
    if (revision.value < 1) {
      throw new FinalConformanceDomainError(
        'INVALID_FINAL_CONFORMANCE_EVIDENCE',
        'A persisted final conformance evaluation must have a positive revision.',
      )
    }
    const evaluated = FinalConformanceEvaluation.evaluate(input.evidence, revision.value - 1)
    if (evaluated.result !== input.result || !findingsEqual(evaluated.findings, input.findings)) {
      throw new FinalConformanceDomainError(
        'INVALID_FINAL_CONFORMANCE_EVIDENCE',
        'Final conformance result and findings do not match the supplied evidence.',
      )
    }
    return new FinalConformanceEvaluation({
      scope: evaluated.scope,
      evidence: evaluated.evidence,
      result: evaluated.result,
      revision: evaluated.revision,
      findings: evaluated.findings,
    })
  }

  sameEvidence(other: FinalConformanceEvaluation | FinalConformanceEvidenceBundle): boolean {
    const bundle = other instanceof FinalConformanceEvaluation ? other.evidence : other
    return this.scope.equals(bundle.scope) && this.evidence.exactEvidenceEquals(bundle)
  }

  toSnapshot(): FinalConformanceSnapshot {
    return Object.freeze({
      scope: this.scope.toInput(),
      evidence: this.evidence.toInput(),
      result: this.result,
      revision: this.revision.value,
      findings: this.findings.map((finding) => finding.toInput()),
    })
  }
}

export interface FinalConformanceEvidenceReader {
  observe(scope: FinalConformanceScope): FinalConformanceEvidenceBundle | undefined
}

export interface FinalConformanceRepository {
  find(cycleIdentity: CanonicalIdentityReference): FinalConformanceEvaluation | undefined
  commit(
    evaluation: FinalConformanceEvaluation,
    expectedRevision: FinalConformanceRevision,
  ): Promise<
    | { readonly status: 'ADVANCED'; readonly evaluation: FinalConformanceEvaluation }
    | { readonly status: 'STALE'; readonly existing?: FinalConformanceEvaluation }
    | { readonly status: 'DUPLICATE'; readonly existing: FinalConformanceEvaluation }
  >
}
