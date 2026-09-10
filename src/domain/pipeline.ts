import {
  CanonicalIdentityReference,
  CanonicalIdentityReferenceInput,
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

export interface WorkflowPipelineRehydrationInput {
  readonly identity: WorkflowPipelineIdentityInput
  readonly stage: PipelineStage | PipelineStageName
  readonly revision: PipelineRevision | number
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

  static create(input: WorkflowPipelineCreationInput): WorkflowPipeline {
    return WorkflowPipeline.construct({
      identity: input.identity,
      stage: PipelineOrder.first(),
      revision: PipelineRevision.create(0),
    })
  }

  static rehydrate(input: WorkflowPipelineRehydrationInput): WorkflowPipeline {
    return WorkflowPipeline.construct(input)
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
