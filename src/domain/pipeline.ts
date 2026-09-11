import {
  CanonicalIdentityReference,
  CanonicalIdentityReferenceInput,
  CanonicalIdentityReconstructionAuthority,
  CanonicalStageReference,
  CanonicalStageReferenceInput,
} from './identity.js'

export const PIPELINE_STAGES = Object.freeze([
  'ACCEPTED_ADRS',
  'SPECS',
  'SPEC_AUDIT_REMEDIATION',
  'GAP_MATRIX_AUDIT_REMEDIATION',
  'PLAN_AUDIT_REMEDIATION',
  'TICKET_AUDIT_REMEDIATION',
  'DOCUMENTARY_COMMIT',
  'TICKET_IMPLEMENTATION_AUDIT',
  'WAVE_INTEGRATION_AUDIT',
  'TICKET_FINALIZATION',
  'SPEC_IMPLEMENTATION_CONFORMANCE',
  'MAIN_UPDATE_AND_PUBLICATION',
] as const)

export const PIPELINE_MACHINES = Object.freeze([
  'EXECUTION',
  'SPEC',
  'STAGE',
  'ACTIVITY',
  'CYCLE',
  'WAVE',
  'TICKET',
  'MIGRATION',
  'PUBLICATION',
] as const)

export type PipelineStageName = (typeof PIPELINE_STAGES)[number]
export type PipelineMachine = (typeof PIPELINE_MACHINES)[number]

export type PipelineErrorCode =
  | 'INVALID_PIPELINE_IDENTITY'
  | 'INVALID_PIPELINE_STAGE'
  | 'INVALID_PIPELINE_REVISION'
  | 'INVALID_PIPELINE_STATE'
  | 'INVALID_PIPELINE_TRANSITION'
  | 'PIPELINE_RECONSTRUCTION_AUTHORITY_REQUIRED'
  | 'PIPELINE_NOT_FOUND'
  | 'PIPELINE_STALE'

export class PipelineDomainError extends Error {
  readonly code: PipelineErrorCode

  constructor(code: PipelineErrorCode, message: string) {
    super(message)
    this.name = 'PipelineDomainError'
    this.code = code
  }
}

function requiredToken(value: unknown, label: string, errorCode: PipelineErrorCode): string {
  if (typeof value !== 'string') {
    throw new PipelineDomainError(errorCode, `${label} is required.`)
  }

  const normalized = value.trim()
  if (!normalized || /[\r\n]/.test(normalized)) {
    throw new PipelineDomainError(errorCode, `${label} must be a non-empty single-line value.`)
  }

  return normalized
}

export class PipelineStage {
  readonly value: PipelineStageName

  private constructor(value: PipelineStageName) {
    this.value = value
    Object.freeze(this)
  }

  static create(value: unknown): PipelineStage {
    if (typeof value === 'string' && (PIPELINE_STAGES as readonly string[]).includes(value)) {
      return new PipelineStage(value as PipelineStageName)
    }

    throw new PipelineDomainError('INVALID_PIPELINE_STAGE', 'Pipeline stage must be a known canonical stage.')
  }

  equals(other: PipelineStage): boolean {
    return this.value === other.value
  }
}

export class PipelineOrder {
  static first(): PipelineStage {
    return PipelineStage.create(PIPELINE_STAGES[0])
  }

  static isImmediateSuccessor(current: PipelineStage, requested: PipelineStage): boolean {
    const currentIndex = PIPELINE_STAGES.indexOf(current.value)
    return PIPELINE_STAGES[currentIndex + 1] === requested.value
  }
}

export class PipelineRevision {
  readonly value: number

  private constructor(value: number) {
    this.value = value
    Object.freeze(this)
  }

  static create(value: unknown): PipelineRevision {
    if (typeof value !== 'number' || !Number.isInteger(value) || value < 0) {
      throw new PipelineDomainError('INVALID_PIPELINE_REVISION', 'Pipeline revision must be a non-negative integer.')
    }

    return new PipelineRevision(value)
  }

  next(): PipelineRevision {
    return new PipelineRevision(this.value + 1)
  }

  equals(other: PipelineRevision): boolean {
    return this.value === other.value
  }
}

export interface PipelineMachineStateInput {
  readonly machine: PipelineMachine
  readonly state: string
}

export class PipelineMachineState {
  readonly machine: PipelineMachine
  readonly state: string

  private constructor(machine: PipelineMachine, state: string) {
    this.machine = machine
    this.state = state
    Object.freeze(this)
  }

  static create(input: PipelineMachineStateInput): PipelineMachineState {
    if (!(PIPELINE_MACHINES as readonly string[]).includes(input.machine)) {
      throw new PipelineDomainError('INVALID_PIPELINE_STATE', 'Pipeline machine must be known.')
    }

    return new PipelineMachineState(
      input.machine,
      requiredToken(input.state, `${input.machine} state`, 'INVALID_PIPELINE_STATE'),
    )
  }
}

export type PipelineStateInputSet = {
  readonly execution: PipelineMachineStateInput
  readonly spec: PipelineMachineStateInput
  readonly stage: PipelineMachineStateInput
  readonly activity: PipelineMachineStateInput
  readonly cycle: PipelineMachineStateInput
  readonly wave: PipelineMachineStateInput
  readonly ticket: PipelineMachineStateInput
  readonly migration: PipelineMachineStateInput
  readonly publication: PipelineMachineStateInput
}

const EXPECTED_MACHINES: readonly [keyof PipelineStateInputSet, PipelineMachine][] = [
  ['execution', 'EXECUTION'],
  ['spec', 'SPEC'],
  ['stage', 'STAGE'],
  ['activity', 'ACTIVITY'],
  ['cycle', 'CYCLE'],
  ['wave', 'WAVE'],
  ['ticket', 'TICKET'],
  ['migration', 'MIGRATION'],
  ['publication', 'PUBLICATION'],
]

export class PipelineStateInputs {
  readonly execution: PipelineMachineState
  readonly spec: PipelineMachineState
  readonly stage: PipelineMachineState
  readonly activity: PipelineMachineState
  readonly cycle: PipelineMachineState
  readonly wave: PipelineMachineState
  readonly ticket: PipelineMachineState
  readonly migration: PipelineMachineState
  readonly publication: PipelineMachineState

  private constructor(states: Record<keyof PipelineStateInputSet, PipelineMachineState>) {
    this.execution = states.execution
    this.spec = states.spec
    this.stage = states.stage
    this.activity = states.activity
    this.cycle = states.cycle
    this.wave = states.wave
    this.ticket = states.ticket
    this.migration = states.migration
    this.publication = states.publication
    Object.freeze(this)
  }

  static create(input: PipelineStateInputSet): PipelineStateInputs {
    const states = {} as Record<keyof PipelineStateInputSet, PipelineMachineState>
    for (const [key, machine] of EXPECTED_MACHINES) {
      const candidate = input[key]
      if (!candidate || candidate.machine !== machine) {
        throw new PipelineDomainError('INVALID_PIPELINE_STATE', `${key} must carry ${machine} state.`)
      }
      states[key] = PipelineMachineState.create(candidate)
    }

    return new PipelineStateInputs(states)
  }

  all(): readonly PipelineMachineState[] {
    return Object.freeze([
      this.execution,
      this.spec,
      this.stage,
      this.activity,
      this.cycle,
      this.wave,
      this.ticket,
      this.migration,
      this.publication,
    ])
  }
}

export class DerivedWorkflowState {
  readonly pipelineStage: PipelineStage
  readonly machineStates: readonly PipelineMachineState[]

  private constructor(
    pipelineStage: PipelineStage,
    machineStates: readonly PipelineMachineState[],
    proof: DerivationProof,
  ) {
    if (proof !== DERIVATION_PROOF) {
      throw new PipelineDomainError('INVALID_PIPELINE_STATE', 'Derived workflow state must come from validated derivation.')
    }

    this.pipelineStage = pipelineStage
    this.machineStates = Object.freeze([...machineStates])
    Object.freeze(this)
  }

  static fromValidatedDerivation(
    pipelineStage: PipelineStage,
    machineStates: readonly PipelineMachineState[],
    proof: DerivationProof,
  ): DerivedWorkflowState {
    if (proof !== DERIVATION_PROOF) {
      throw new PipelineDomainError('INVALID_PIPELINE_STATE', 'Derived workflow state must come from validated derivation.')
    }

    return new DerivedWorkflowState(pipelineStage, machineStates, proof)
  }

  stateFor(machine: PipelineMachine): PipelineMachineState {
    const state = this.machineStates.find((candidate) => candidate.machine === machine)
    if (!state) {
      throw new PipelineDomainError('INVALID_PIPELINE_STATE', `${machine} state is not present.`)
    }
    return state
  }
}

const DERIVATION_PROOF = Symbol('validated-pipeline-derivation')
type DerivationProof = typeof DERIVATION_PROOF

export class PipelineStateDerivationPolicy {
  static derive(pipeline: WorkflowPipeline, inputs: PipelineStateInputs): DerivedWorkflowState {
    return DerivedWorkflowState.fromValidatedDerivation(pipeline.stage, inputs.all(), DERIVATION_PROOF)
  }
}

export interface PipelineTransition {
  readonly previous: WorkflowPipeline
  readonly proposed: WorkflowPipeline
  readonly expectedRevision: PipelineRevision
}

export type WorkflowPipelineIdentityInput =
  | CanonicalIdentityReferenceInput
  | CanonicalStageReferenceInput
  | CanonicalStageReference

export interface WorkflowPipelineCreationInput {
  readonly identity: WorkflowPipelineIdentityInput
}

export interface PipelineProvenanceRecordInput {
  readonly identity: CanonicalIdentityReferenceInput
  /** Resulting stage in this append-only record. */
  readonly stage: PipelineStage | PipelineStageName
  /** Aggregate revision of the resulting stage. */
  readonly revision: PipelineRevision | number
  /** Omitted only for the initial creation record. */
  readonly previousStage?: PipelineStage | PipelineStageName
  readonly previousRevision?: PipelineRevision | number
}

/**
 * Supplies the accepted transition history for pipeline reconstruction.
 * The pipeline aggregate validates progression semantics; this port establishes
 * that the supplied history was accepted by the canonical producer.
 */
export interface PipelineProvenanceReconstructionAuthority {
  resolveForRehydration(
    identity: CanonicalIdentityReference,
  ): readonly PipelineProvenanceRecordInput[] | undefined
}

export interface WorkflowPipelineRehydrationInput {
  readonly identity: WorkflowPipelineIdentityInput
  readonly stage: PipelineStage | PipelineStageName
  readonly revision: PipelineRevision | number
  /** Required for every non-initial restored pipeline state. */
  readonly provenance?: readonly PipelineProvenanceRecordInput[]
}

export class WorkflowPipeline {
  readonly identity: CanonicalIdentityReference
  readonly stage: PipelineStage
  readonly revision: PipelineRevision

  private constructor(identity: CanonicalIdentityReference, stage: PipelineStage, revision: PipelineRevision) {
    this.identity = identity
    this.stage = stage
    this.revision = revision
    Object.freeze(this)
  }

  static create(
    input: WorkflowPipelineCreationInput,
    authority: CanonicalIdentityReconstructionAuthority,
  ): WorkflowPipeline {
    if (!authority || typeof authority.resolveForRehydration !== 'function') {
      throw new PipelineDomainError(
        'PIPELINE_RECONSTRUCTION_AUTHORITY_REQUIRED',
        'WorkflowPipeline creation requires the DOM identity reconstruction authority.',
      )
    }

    const candidate = WorkflowPipeline.canonicalIdentity(input.identity)
    const resolved = authority.resolveForRehydration(candidate)
    if (!resolved
      || !resolved.reference.equals(candidate)
      || resolved.identity.kind !== 'STAGE') {
      throw new PipelineDomainError(
        'INVALID_PIPELINE_IDENTITY',
        'WorkflowPipeline identity must resolve to its canonical STAGE record.',
      )
    }

    return WorkflowPipeline.construct({
      identity: resolved.reference,
      stage: PipelineOrder.first(),
      revision: PipelineRevision.create(0),
    })
  }

  static rehydrate(
    input: WorkflowPipelineRehydrationInput,
    identityAuthority: CanonicalIdentityReconstructionAuthority,
    provenanceAuthority: PipelineProvenanceReconstructionAuthority,
  ): WorkflowPipeline {
    if (!identityAuthority || typeof identityAuthority.resolveForRehydration !== 'function') {
      throw new PipelineDomainError(
        'PIPELINE_RECONSTRUCTION_AUTHORITY_REQUIRED',
        'WorkflowPipeline rehydration requires the DOM reconstruction authority.',
      )
    }
    if (!provenanceAuthority || typeof provenanceAuthority.resolveForRehydration !== 'function') {
      throw new PipelineDomainError(
        'PIPELINE_RECONSTRUCTION_AUTHORITY_REQUIRED',
        'WorkflowPipeline rehydration requires the accepted provenance authority.',
      )
    }

    const candidate = WorkflowPipeline.canonicalIdentity(input.identity)
    const resolved = identityAuthority.resolveForRehydration(candidate)
    if (!resolved || !resolved.reference.equals(candidate) || resolved.identity.kind !== 'STAGE') {
      throw new PipelineDomainError(
        'INVALID_PIPELINE_IDENTITY',
        'WorkflowPipeline identity does not match its authoritative record.',
      )
    }

    const pipeline = WorkflowPipeline.construct({ ...input, identity: resolved.reference })
    const acceptedProvenance = provenanceAuthority.resolveForRehydration(resolved.reference)
    if (!acceptedProvenance || acceptedProvenance.length === 0) {
      throw new PipelineDomainError(
        'INVALID_PIPELINE_TRANSITION',
        'WorkflowPipeline rehydration requires accepted transition provenance.',
      )
    }

    WorkflowPipeline.assertRehydrationProvenance(pipeline, acceptedProvenance)
    if (input.provenance === undefined
      && (pipeline.stage.value !== PIPELINE_STAGES[0] || pipeline.revision.value !== 0)) {
      throw new PipelineDomainError(
        'INVALID_PIPELINE_TRANSITION',
        'A non-initial pipeline state requires complete transition provenance.',
      )
    }
    if (input.provenance !== undefined) {
      WorkflowPipeline.assertRehydrationProvenance(pipeline, input.provenance)
      WorkflowPipeline.assertProvenanceMatchesAuthority(input.provenance, acceptedProvenance)
    }
    return pipeline
  }

  private static construct(input: WorkflowPipelineRehydrationInput): WorkflowPipeline {
    const identity = WorkflowPipeline.canonicalIdentity(input.identity)
    const stage = input.stage instanceof PipelineStage
      ? input.stage
      : PipelineStage.create(input.stage)
    const revision = input.revision instanceof PipelineRevision
      ? input.revision
      : PipelineRevision.create(input.revision)
    return new WorkflowPipeline(identity, stage, revision)
  }

  private static canonicalIdentity(input: WorkflowPipelineIdentityInput): CanonicalIdentityReference {
    if (!input || typeof input !== 'object') {
      throw new PipelineDomainError(
        'INVALID_PIPELINE_IDENTITY',
        'WorkflowPipeline identity must be a canonical STAGE reference.',
      )
    }

    const reference = input instanceof CanonicalStageReference
      ? input.reference
      : 'executionId' in input
      ? CanonicalStageReference.create(input).reference
      : 'identity' in input
        ? CanonicalIdentityReference.create(input)
        : undefined

    if (!reference) {
      throw new PipelineDomainError(
        'INVALID_PIPELINE_IDENTITY',
        'WorkflowPipeline identity must be a canonical STAGE reference.',
      )
    }

    if (reference.identity.kind !== 'STAGE') {
      throw new PipelineDomainError(
        'INVALID_PIPELINE_IDENTITY',
        'WorkflowPipeline identity must be a canonical STAGE reference.',
      )
    }

    return reference
  }

  private static assertRehydrationProvenance(
    pipeline: WorkflowPipeline,
    provenance: readonly PipelineProvenanceRecordInput[] | undefined,
  ): void {
    if (pipeline.stage.value === PIPELINE_STAGES[0] && pipeline.revision.value === 0) {
      if (provenance !== undefined) {
        WorkflowPipeline.assertProvenanceChain(pipeline, provenance)
      }
      return
    }

    if (!provenance || provenance.length === 0) {
      throw new PipelineDomainError(
        'INVALID_PIPELINE_TRANSITION',
        'A non-initial pipeline state requires complete transition provenance.',
      )
    }

    WorkflowPipeline.assertProvenanceChain(pipeline, provenance)
  }

  private static assertProvenanceChain(
    pipeline: WorkflowPipeline,
    provenance: readonly PipelineProvenanceRecordInput[],
  ): void {
    if (provenance.length === 0) {
      throw new PipelineDomainError('INVALID_PIPELINE_TRANSITION', 'Pipeline provenance cannot be empty.')
    }

    let previousStage: PipelineStage | undefined
    let previousRevision: PipelineRevision | undefined
    const seen = new Set<string>()

    provenance.forEach((entry, index) => {
      const identity = CanonicalIdentityReference.create(entry.identity)
      const stage = entry.stage instanceof PipelineStage ? entry.stage : PipelineStage.create(entry.stage)
      const revision = entry.revision instanceof PipelineRevision
        ? entry.revision
        : PipelineRevision.create(entry.revision)
      const key = `${identity.canonicalKey}|stage=${stage.value}|revision=${revision.value}`

      if (!identity.equals(pipeline.identity) || seen.has(key)) {
        throw new PipelineDomainError(
          'INVALID_PIPELINE_TRANSITION',
          'Pipeline provenance must remain attached to one canonical identity without duplicates.',
        )
      }
      seen.add(key)

      if (index === 0) {
        if (stage.value !== PIPELINE_STAGES[0]
          || revision.value !== 0
          || entry.previousStage !== undefined
          || entry.previousRevision !== undefined) {
          throw new PipelineDomainError(
            'INVALID_PIPELINE_TRANSITION',
            'Pipeline provenance must begin with the initial stage at revision zero.',
          )
        }
      } else {
        const declaredPreviousStage = entry.previousStage instanceof PipelineStage
          ? entry.previousStage
          : PipelineStage.create(entry.previousStage)
        const declaredPreviousRevision = entry.previousRevision instanceof PipelineRevision
          ? entry.previousRevision
          : PipelineRevision.create(entry.previousRevision)

        if (!previousStage || !previousRevision
          || !declaredPreviousStage.equals(previousStage)
          || !declaredPreviousRevision.equals(previousRevision)
          || !PipelineOrder.isImmediateSuccessor(previousStage, stage)
          || revision.value !== previousRevision.value + 1) {
          throw new PipelineDomainError(
            'INVALID_PIPELINE_TRANSITION',
            'Pipeline provenance must contain ordered immediate successors with continuous revisions.',
          )
        }
      }

      previousStage = stage
      previousRevision = revision
    })

    if (!previousStage || !previousRevision
      || !previousStage.equals(pipeline.stage)
      || !previousRevision.equals(pipeline.revision)) {
      throw new PipelineDomainError(
        'INVALID_PIPELINE_TRANSITION',
        'Pipeline provenance must terminate at the restored stage and revision.',
      )
    }
  }

  private static assertProvenanceMatchesAuthority(
    supplied: readonly PipelineProvenanceRecordInput[],
    accepted: readonly PipelineProvenanceRecordInput[],
  ): void {
    if (supplied.length !== accepted.length) {
      throw new PipelineDomainError(
        'INVALID_PIPELINE_TRANSITION',
        'Pipeline provenance does not match the accepted transition authority.',
      )
    }

    supplied.forEach((entry, index) => {
      const expected = accepted[index]
      const suppliedIdentity = CanonicalIdentityReference.create(entry.identity)
      const acceptedIdentity = CanonicalIdentityReference.create(expected.identity)
      const suppliedStage = entry.stage instanceof PipelineStage ? entry.stage : PipelineStage.create(entry.stage)
      const acceptedStage = expected.stage instanceof PipelineStage ? expected.stage : PipelineStage.create(expected.stage)
      const suppliedRevision = entry.revision instanceof PipelineRevision
        ? entry.revision
        : PipelineRevision.create(entry.revision)
      const acceptedRevision = expected.revision instanceof PipelineRevision
        ? expected.revision
        : PipelineRevision.create(expected.revision)

      const suppliedPreviousStage = entry.previousStage === undefined
        ? undefined
        : entry.previousStage instanceof PipelineStage
          ? entry.previousStage
          : PipelineStage.create(entry.previousStage)
      const acceptedPreviousStage = expected.previousStage === undefined
        ? undefined
        : expected.previousStage instanceof PipelineStage
          ? expected.previousStage
          : PipelineStage.create(expected.previousStage)
      const suppliedPreviousRevision = entry.previousRevision === undefined
        ? undefined
        : entry.previousRevision instanceof PipelineRevision
          ? entry.previousRevision
          : PipelineRevision.create(entry.previousRevision)
      const acceptedPreviousRevision = expected.previousRevision === undefined
        ? undefined
        : expected.previousRevision instanceof PipelineRevision
          ? expected.previousRevision
          : PipelineRevision.create(expected.previousRevision)

      if (!suppliedIdentity.equals(acceptedIdentity)
        || !suppliedStage.equals(acceptedStage)
        || !suppliedRevision.equals(acceptedRevision)
        || (suppliedPreviousStage === undefined) !== (acceptedPreviousStage === undefined)
        || (suppliedPreviousStage !== undefined
          && acceptedPreviousStage !== undefined
          && !suppliedPreviousStage.equals(acceptedPreviousStage))
        || (suppliedPreviousRevision === undefined) !== (acceptedPreviousRevision === undefined)
        || (suppliedPreviousRevision !== undefined
          && acceptedPreviousRevision !== undefined
          && !suppliedPreviousRevision.equals(acceptedPreviousRevision))) {
        throw new PipelineDomainError(
          'INVALID_PIPELINE_TRANSITION',
          'Pipeline provenance does not match the accepted transition authority.',
        )
      }
    })
  }

  advanceTo(requested: PipelineStage | PipelineStageName): PipelineTransition {
    const target = requested instanceof PipelineStage ? requested : PipelineStage.create(requested)
    if (!PipelineOrder.isImmediateSuccessor(this.stage, target)) {
      throw new PipelineDomainError(
        'INVALID_PIPELINE_TRANSITION',
        `Pipeline cannot advance from ${this.stage.value} directly to ${target.value}.`,
      )
    }

    const proposed = new WorkflowPipeline(this.identity, target, this.revision.next())
    return Object.freeze({ previous: this, proposed, expectedRevision: this.revision })
  }
}

export interface PipelineAdvanceAccepted {
  readonly status: 'ADVANCED'
  readonly pipeline: WorkflowPipeline
}

export interface PipelineAdvanceStale {
  readonly status: 'STALE'
  readonly existing: WorkflowPipeline
}

export interface PipelineAdvanceNotFound {
  readonly status: 'NOT_FOUND'
}

export type PipelineAdvanceReservation =
  | PipelineAdvanceAccepted
  | PipelineAdvanceStale
  | PipelineAdvanceNotFound

export interface PipelineRepository {
  find(identity: CanonicalIdentityReference): WorkflowPipeline | undefined
  advance(proposed: WorkflowPipeline, expectedRevision: PipelineRevision): Promise<PipelineAdvanceReservation>
}

export interface PipelineStateReader {
  read(identity: CanonicalIdentityReference): PipelineStateInputs | undefined
}
