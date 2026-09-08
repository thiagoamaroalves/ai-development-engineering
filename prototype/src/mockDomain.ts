export type ScenarioId = 'normal' | 'audit' | 'capacity' | 'retry' | 'rounds' | 'conflict' | 'divergence' | 'recovery' | 'drift' | 'pr' | 'migration' | 'adr-mutation'

export type CommandName =
  | 'VALIDATE_SNAPSHOT' | 'START_RUN' | 'ADVANCE_NORMAL' | 'COMPLETE_ACTIVITY' | 'REQUEST_PAUSE' | 'REQUEST_RESUME' | 'REQUEST_CANCEL'
  | 'CANCEL_TICKET' | 'SET_PRIORITY' | 'RETRY_ACTIVITY' | 'AUTHORIZE_ROUND' | 'DISPATCH_ACTIVITY' | 'RELEASE_CAPACITY'
  | 'REMEDIATE_FINDING' | 'REAUDIT_FINDING' | 'RESOLVE_CONFLICT' | 'AUDIT_INTEGRATION' | 'INTEGRATE_WAVE'
  | 'RECONCILE_DIVERGENCE' | 'RECOVER_CHECKPOINT' | 'ADVANCE_MAIN' | 'CHANGE_CANDIDATE' | 'REVALIDATE_PUBLICATION'
  | 'APPROVE_PUBLICATION' | 'LOCAL_INTEGRATE' | 'PUSH_REMOTE' | 'MERGE_PR' | 'CONFIRM_REMOTE'
  | 'DECIDE_DIVERGENCE' | 'APPLY_DIVERGENCE_EFFECT'
  | 'INSPECT_ONBOARDING' | 'FIX_ONBOARDING' | 'VALIDATE_ONBOARDING' | 'BOOTSTRAP_ONBOARDING' | 'MIGRATE_ONBOARDING'
  | 'VERIFY_ONBOARDING' | 'AUDIT_ONBOARDING' | 'APPROVE_ONBOARDING' | 'ENABLE_ONBOARDING' | 'RESTORE_ADR' | 'EXPORT_EVIDENCE'

export type CommandStatus = 'requested' | 'accepted' | 'rejected' | 'confirmed'
export type EffectStatus = 'none' | 'pending' | 'confirmed'
export type RunFunctionalState = 'READY' | 'RUNNING' | 'PAUSED' | 'COMPLETED' | 'CANCELLED'
export type RunOperationalState = 'IDLE' | 'PROCESSING' | 'PAUSE_REQUESTED' | 'RESUME_REQUESTED' | 'CANCEL_REQUESTED' | 'PAUSED' | 'WAITING_CAPACITY' | 'RECOVERING' | 'FAILED' | 'COMPLETED' | 'CANCELLED'
export type TicketFunctionalState = 'DRAFT' | 'READY' | 'IMPLEMENTED' | 'COMPLETED' | 'BLOCKED' | 'CANCELLED'
export type TicketOperationalState = 'IDLE' | 'QUEUED' | 'RUNNING' | 'AUDITING' | 'WAITING_DEPENDENCY' | 'WAITING_CAPACITY' | 'FAILED' | 'PAUSED'
export type AgentRole = 'IMPLEMENTER' | 'AUDITOR' | 'REMEDIATOR' | 'CONFLICT_RESOLVER'
export type ActivityOperationalState = 'READY' | 'QUEUED' | 'RUNNING' | 'PAUSE_REQUESTED' | 'PAUSED' | 'FAILED' | 'RETRYING' | 'COMPLETED' | 'WAITING_CAPACITY' | 'WAITING_ELIGIBILITY'
export type PublicationMode = 'DIRECT_PUSH' | 'PULL_REQUEST'
export type PublicationState = 'NOT_READY' | 'PUBLICATION_CANDIDATE_READY' | 'AWAITING_PUBLICATION_APPROVAL' | 'LOCAL_INTEGRATION_PENDING' | 'LOCAL_INTEGRATION_COMPLETE' | 'PR_OPEN' | 'AWAITING_PR_MERGE' | 'PR_MERGED' | 'INVALIDATED' | 'REMOTE_PUBLICATION_CONFIRMED'
export type ApprovalState = 'AWAITING_PUBLICATION_APPROVAL' | 'APPROVED' | 'INVALIDATED'
export type ReconciliationResult = 'EXPECTED_INCOMPLETE_EFFECT' | 'MISSING_EFFECT' | 'SEMANTIC_DIVERGENCE' | 'CONFLICTING_EFFECT'
export type DivergenceDecision = 'AUTHORITATIVE_GIT' | 'AUTHORITATIVE_DATABASE'
export type DivergenceCorrectiveEffect = 'RECONCILE_DATABASE_TO_GIT' | 'RECONCILE_GIT_TO_DATABASE'
export type OnboardingState = 'DISCOVERED' | 'INSPECTING' | 'VALIDATING' | 'BOOTSTRAPPING' | 'MIGRATING' | 'VERIFYING' | 'AUDITING' | 'REMEDIATING' | 'READY_TO_ENABLE' | 'ENABLED'
export type OnboardingActivityState = 'PENDING' | 'READY' | 'COMPLETED'

export interface AdrRecord { id: string; title: string; revision: number; decisionStatus: 'ACCEPTED' | 'SUPERSEDED' | 'REJECTED'; implementationStatus: 'UNPROCESSED' | 'PROCESSING' | 'IMPLEMENTED'; contentHash: string; actualContentHash: string }
export interface Snapshot { id: string; status: 'DRAFT' | 'READY_TO_START' | 'CONFIRMED' | 'REJECTED'; adrIds: string[]; adrHashes: Record<string, string>; baseSha: string; currentBaseSha: string; configVersion: string; currentConfigVersion: string; skillVersions: Record<string, string>; currentSkillVersions: Record<string, string>; capacitySnapshot: string; lockedAtEvent?: string }
export interface Ticket { id: string; title: string; wave: number; dependencies: string[]; functionalState: TicketFunctionalState; operationalState: TicketOperationalState; verdict: 'PENDING' | 'APPROVED' | 'REJECTED'; touchedFiles: string[]; branch: string; worktree: string; lastUnblockedBy?: string }
export interface Activity { id: string; name: string; skill: string; version: string; agentAssignmentId: string; sessionId: string; role: AgentRole; artifactCycleId: string; round: number; maxRounds: number; roundExtensions: number; maxRoundExtensions: number; attempt: number; maxAttempts: number; idempotencyKey: string; state: ActivityOperationalState; checkpoint: string; safeCheckpoint: string; error?: string }
export interface AgentAssignment { agentAssignmentId: string; logicalAgentId: string; sessionId: string; role: AgentRole; skill: string; artifactCycleId: string; eligible: boolean; ineligibleReason?: string; participationHistory: string[] }
export interface Capacity { status: 'KNOWN' | 'UNKNOWN'; maximum: number | null; used: number; available: number | null; conservativeCeiling: number; queuedByCapacity: number; queuedByEligibility: number; leases: string[]; fairQueue: string[] }
export interface Finding { id: string; title: string; severity: 'MAJOR' | 'MINOR'; state: 'OPEN' | 'REMEDIATING' | 'REMEDIATED' | 'APPROVED'; cycleId: string; auditorAssignmentId: string; remediatorAssignmentId?: string; reauditorAssignmentId?: string }
export interface PersistentPublicationIdentity { provider: 'github'; repository: string; schedulerId: string; executionId: string; candidateId: string; pullRequestNumber?: number; canonicalId: string }
export interface Publication { mode: PublicationMode; state: PublicationState; approval: ApprovalState; conformanceStatus: 'PENDING' | 'APPROVED' | 'INVALIDATED'; conformanceRunId: string; candidateId: string; publicationIdentity: PersistentPublicationIdentity; queueStatus: 'QUEUED' | 'PROCESSING' | 'AWAITING_MERGE' | 'CONFIRMED'; baseSha: string; currentBaseSha: string; headSha: string; currentHeadSha: string; treeHash: string; currentTreeHash: string; prNumber?: number; mergeable: boolean; checks: 'PENDING' | 'PASSING' | 'FAILING'; queuePosition: number; localMergeSha?: string; remoteEvidenceId?: string; mergedCandidateId?: string; mergedPrNumber?: number; mergedBaseSha?: string; mergedHeadSha?: string; mergedTreeHash?: string; mergedConformanceRunId?: string; mergedRemoteEvidenceId?: string; mergedPublicationIdentity?: PersistentPublicationIdentity }
export interface OnboardingActivity { id: string; name: string; kind: 'BOOTSTRAP' | 'MIGRATION' | 'REMEDIATION' | 'AUDIT'; agentAssignmentId: string; logicalAgentId: string; sessionId: string; role: AgentRole; artifactCycleId: string; state: OnboardingActivityState; participationRecorded: boolean }
export interface Onboarding { repository: string; state: OnboardingState; candidateConfigVersion: string; workspace: string; clean: boolean; aligned: boolean; bootstrapCatalogVersion: string; auditVerdict: 'PENDING' | 'APPROVED' | 'REJECTED'; artifactCycleId: string; activities: OnboardingActivity[] }
export interface MockCommand { id: string; correlationId: string; name: CommandName; label: string; detail: string; payload?: string; status: CommandStatus; effectStatus: EffectStatus; rejectionReason?: string; requestedAt: string; acceptedAt?: string; confirmedAt?: string }
export interface MockEvent { id: string; time: string; type: string; actor: 'mock-authority' | 'scheduler' | 'human' | 'agent'; target: string; detail: string }
export interface ArtifactRecord { artifactId: string; name: string; type: string; hash: string; relatedTo: string; retained: boolean }
export type SchedulerQueueReason = 'READY' | 'CAPACITY' | 'ELIGIBILITY'
export interface SchedulerCandidate { executionId: string; activityId: string; assignmentId: string; priority: number; reason: SchedulerQueueReason; sequence: number }
export interface SchedulerLease { leaseId: string; executionId: string; activityId: string; assignmentId: string }
export interface SchedulerActivityRegistration { activityId: string; assignmentId: string; sessionId?: string; state: ActivityOperationalState; role?: AgentRole; artifactCycleId?: string; eligible: boolean }
export interface SchedulerRegistrationProvenance { readonly kind: 'canonical-execution-domain'; readonly schedulerId: string; readonly executionId: string; readonly fingerprint: string }
export interface SchedulerExecutionRegistration { executionId: string; runId: string; snapshotStatus: Snapshot['status']; functionalState: RunFunctionalState; operationalState: RunOperationalState; activities: SchedulerActivityRegistration[]; provenance?: SchedulerRegistrationProvenance }
export interface SchedulerExecutionRegistrationUpdate { executionId: string; snapshotStatus: Snapshot['status']; functionalState: RunFunctionalState; operationalState: RunOperationalState }
export interface SchedulerRegistrationAuthority { readonly kind: 'scheduler-registration-authority' }
export interface SchedulerExecutionRecord { runId: string; snapshotStatus: Snapshot['status']; functionalState: RunFunctionalState; operationalState: RunOperationalState; activityIds: string[]; assignmentIds: Record<string, string>; activitySessions: Record<string, string>; activityRoles: Record<string, AgentRole>; activityCycles: Record<string, string>; activityStates: Record<string, ActivityOperationalState>; activityEligibility: Record<string, boolean>; provenanceFingerprint: string }
export interface MockScheduler {
  readonly id: string
  readonly status: 'KNOWN' | 'UNKNOWN'
  readonly maximum: number | null
  readonly conservativeCeiling: number
  readonly used: number
  readonly available: number | null
  readonly leases: ReadonlyArray<SchedulerLease>
  readonly queue: ReadonlyArray<SchedulerCandidate>
  readonly executionIds: ReadonlyArray<string>
  readonly executionActivities: Readonly<Record<string, SchedulerExecutionRecord>>
  readonly revision: number
  readonly nextSequence: number
  readonly nextLeaseNumber: number
  readonly nextExecutionNumber: number
  readonly lastExecutionId?: string
  readonly consecutiveDispatches: number
  readonly maxConsecutiveDispatches: number
}

interface CanonicalScheduler {
  id: string
  status: 'KNOWN' | 'UNKNOWN'
  maximum: number | null
  conservativeCeiling: number
  used: number
  available: number | null
  leases: SchedulerLease[]
  queue: SchedulerCandidate[]
  executionIds: string[]
  executionActivities: Record<string, SchedulerExecutionRecord>
  revision: number
  nextSequence: number
  nextLeaseNumber: number
  nextExecutionNumber: number
  lastExecutionId?: string
  consecutiveDispatches: number
  maxConsecutiveDispatches: number
}
export interface RecoveryEvidence { checkpointSafe: boolean; journalPosition: number; replayStart: number; replayEnd: number; journalPositions: number[]; projectionHash: string; replayKey: string; recoveryEvidenceId?: string }
export interface MockState {
  scenario: ScenarioId
  schedulerId: string; schedulerExecutionId: string; schedulerRevision: number
  repository: { name: string; branch: string; clean: boolean; aligned: boolean; publicationMode: PublicationMode }
  run: { id: string; functionalState: RunFunctionalState; operationalState: RunOperationalState; stage: string; normalStep: number; priority: number }
  snapshot: Snapshot; adrs: AdrRecord[]; specs: { id: string; title: string; status: string; progress: number; artifactCycleId: string; adrIds: string[] }[]; tickets: Ticket[]; activities: Activity[]; assignments: AgentAssignment[]; capacity: Capacity; findings: Finding[]
  wave: { number: number; status: 'READY' | 'INTEGRATION_PENDING' | 'CONFLICTING' | 'RESOLVED' | 'AUDITED' | 'INTEGRATED'; conflictStatus: 'NONE' | 'DETECTED' | 'RESOLVED'; integrationAudit: 'PENDING' | 'APPROVED'; integrationAuditorAssignmentId: string; dagRevision: number }
  reconciliation: { status: 'NONE' | 'PENDING' | 'AWAITING_DECISION' | 'AWAITING_EFFECT' | 'RESOLVED'; result?: ReconciliationResult; evidence: string; evidenceResult?: ReconciliationResult; decision?: DivergenceDecision; correctiveEffect?: DivergenceCorrectiveEffect }
  recovery: { status: 'NOT_REQUIRED' | 'NEEDS_RECOVERY' | 'RECOVERED'; checkpoint: string; replayedEvents: number } & RecoveryEvidence
  publication: Publication; onboarding: Onboarding; adrMutation: { blocked: boolean; adrId: string; expectedHash: string; actualHash: string }; commands: MockCommand[]; events: MockEvent[]; artifacts: ArtifactRecord[]; nextCommandId: number
}

const adrData: [string, string, string][] = [
  ['ADR-0001', 'Domínio, identidade e imutabilidade', '33705082b9d2f46e638cd93bdf27ca676cfc6181a2684ad583e4501f5d06d50d'], ['ADR-0002', 'Pipeline e máquinas de estados', 'ef9289c6fca4bba73fca53ca38c71dd19110eb1cfe948358a7cca1fe14e177d9'], ['ADR-0003', 'Contratos versionados das skills', '6325234bb9c927a6d2b38886206119c643a05718f6db8cce8df5625653260073'], ['ADR-0004', 'Sessões Codex e segregação', '5b2454da004f5ca0f7c0b6dd36c35aeeae642dbc139b5c11e1295e0db62a1e4c'], ['ADR-0005', 'Scheduler, capacidade e concorrência', 'c1a9aaef50599f06afb979edbe8ac1084bde3eada4b2d1bbf87c3d5be886917d'], ['ADR-0006', 'Persistência, journal e recovery', 'ab39573f39849d9d9016683096126a63b037d763f09b4f00293500fd8fbcc6b2'], ['ADR-0007', 'Git, worktrees e ondas', 'ee4d22de0ff3e71f325bbf4f702c5c20221303db141f1d873c4e9cc438d38428'], ['ADR-0008', 'GitHub e aprovação humana', 'f887895fac13c0236b2f34cc5db9c3e43ef97bcd8e3e8b537db2fc8fa0f94947'], ['ADR-0009', 'Auditoria e conformidade final', '4ab502aea4f09afe2c5fa33bfb6c5ee0d11e2d8f9af65f244209ce1fac935761'], ['ADR-0010', 'Configuração e migração legada', '874b77ac7f1f19fe0b22a95705721905ae861feecd1e043a956c5c1bbfdac186'], ['ADR-0011', 'Backend local e API realtime', 'f17a2f90f8c7d8058bb927786dadfeabbe112e5fd898fc50115d37c9d02b3971'], ['ADR-0012', 'Segurança local e notificações', 'f73cf9dd962be0a0a45b0f69aa6e22bd3f5c0ac713fa9cae23fa8d285e4a4d88'], ['ADR-0013', 'Observabilidade e exportação', '377b712c1544d07e3c4e1990b84c124afceec984e54ef8c1ba6fadba14a5f218'], ['ADR-0014', 'Contrato operacional do frontend', '3ac6d6c75e05bd65b2d90cc754ffdc4885f36cd98eb7a87c6bfb8395f044c642'],
]

export const ADR_HASHES: Readonly<Record<string, string>> = Object.freeze(Object.fromEntries(adrData.map(([id, , hash]) => [id, hash])))
export const SCENARIO_IDS: readonly ScenarioId[] = ['normal', 'audit', 'capacity', 'retry', 'rounds', 'conflict', 'divergence', 'recovery', 'drift', 'pr', 'migration', 'adr-mutation']

const scenarioMessages: Record<ScenarioId, string> = {
  normal: 'Execução normal: valide o snapshot, inicie e avance o pipeline, aprove o candidato e confirme a publicação remota.', audit: 'Auditoria, remediação e reauditoria com assignments segregados no mesmo ArtifactCycleId.', capacity: 'Capacidade UNKNOWN: o scheduler mantém o trabalho em espera até reconciliar a capacidade.', retry: 'Falha operacional na tentativa 03/10; retry cria nova sessão e preserva a chave idempotente.', rounds: 'Limite de 10 rodadas atingido; uma autorização humana libera somente a rodada seguinte.', conflict: 'Tickets paralelos conflitaram na integração; resolver e auditar precede o recálculo da próxima onda.', divergence: 'Divergência Git/banco exige o resultado compatível com a evidência apresentada.', recovery: 'Reinício recuperável: o registro operacional reconstrói a projeção no checkpoint seguro.', drift: 'A principal avançou: base/tree do candidato não correspondem e a aprovação foi invalidada.', pr: 'Pull Request vinculada ao candidato aguarda merge dentro da fila serial.', migration: 'Bootstrap independente: configuração candidata e workspace legado ainda não estão habilitados.', 'adr-mutation': 'ADR implementada divergiu do hash registrado; processamento permanece bloqueado.',
}
const labels: Record<CommandName, string> = { VALIDATE_SNAPSHOT: 'Validar snapshot', START_RUN: 'Iniciar processamento', ADVANCE_NORMAL: 'Avançar fluxo normal', COMPLETE_ACTIVITY: 'Concluir atividade', REQUEST_PAUSE: 'Solicitar pausa', REQUEST_RESUME: 'Solicitar retomada', REQUEST_CANCEL: 'Solicitar cancelamento', CANCEL_TICKET: 'Cancelar ticket após revisão do DAG', SET_PRIORITY: 'Alterar prioridade', RETRY_ACTIVITY: 'Repetir atividade', AUTHORIZE_ROUND: 'Autorizar rodada adicional', DISPATCH_ACTIVITY: 'Despachar atividade', RELEASE_CAPACITY: 'Liberar capacidade', REMEDIATE_FINDING: 'Remediar finding', REAUDIT_FINDING: 'Reauditar finding', RESOLVE_CONFLICT: 'Resolver conflito', AUDIT_INTEGRATION: 'Auditar integração', INTEGRATE_WAVE: 'Integrar onda', RECONCILE_DIVERGENCE: 'Classificar divergência', RECOVER_CHECKPOINT: 'Recuperar checkpoint', ADVANCE_MAIN: 'Avançar principal', CHANGE_CANDIDATE: 'Alterar candidato', REVALIDATE_PUBLICATION: 'Revalidar publicação', APPROVE_PUBLICATION: 'Aprovar publicação', LOCAL_INTEGRATE: 'Integrar localmente', PUSH_REMOTE: 'Enviar ao remoto', MERGE_PR: 'Fazer merge da PR', CONFIRM_REMOTE: 'Confirmar publicação remota', DECIDE_DIVERGENCE: 'Decidir autoridade da divergência', APPLY_DIVERGENCE_EFFECT: 'Aplicar efeito corretivo', INSPECT_ONBOARDING: 'Inspecionar legado', FIX_ONBOARDING: 'Corrigir pré-condições', VALIDATE_ONBOARDING: 'Validar onboarding', BOOTSTRAP_ONBOARDING: 'Executar bootstrap', MIGRATE_ONBOARDING: 'Migrar configuração', VERIFY_ONBOARDING: 'Verificar migração', AUDIT_ONBOARDING: 'Auditar migração', APPROVE_ONBOARDING: 'Aprovar onboarding', ENABLE_ONBOARDING: 'Habilitar repositório', RESTORE_ADR: 'Restaurar ADR', EXPORT_EVIDENCE: 'Exportar evidências' }

function clone<T>(value: T): T { return JSON.parse(JSON.stringify(value)) as T }
function timeFor(sequence: number): string { return `10:00:${String(sequence % 60).padStart(2, '0')}` }
function isSharedExecution(state: MockState): boolean { return state.schedulerExecutionId !== `EXECUTION-${state.scenario}` }
function scopedIdentity(state: MockState, value: string): string { return isSharedExecution(state) ? `${value}-${state.schedulerExecutionId}` : value }
function eventIdentity(state: MockState, sequence: number): string { return isSharedExecution(state) ? `EVT-${state.schedulerExecutionId}-${String(sequence).padStart(4, '0')}` : `EVT-${String(sequence).padStart(4, '0')}` }
function candidateIdForPublication(repository: string, schedulerId: string, executionId: string, baseSha: string, headSha: string, treeHash: string): string { return ['CANDIDATE', repository, schedulerId, executionId, baseSha, headSha, treeHash].join(':') }
function createPublicationIdentity(repository: string, schedulerId: string, executionId: string, candidateId: string, pullRequestNumber?: number): PersistentPublicationIdentity { const canonicalId = ['github', repository, schedulerId, executionId, candidateId, pullRequestNumber === undefined ? 'direct' : `pr-${pullRequestNumber}`].join(':'); return { provider: 'github', repository, schedulerId, executionId, candidateId, pullRequestNumber, canonicalId } }
function publicationEvidenceId(publication: Publication, kind: 'merge' | 'remote'): string { return `${publication.publicationIdentity.canonicalId}:${kind}-evidence` }
function addEvent(state: MockState, type: string, actor: MockEvent['actor'], target: string, detail: string): void { state.events.push({ id: eventIdentity(state, state.events.length + 1), time: timeFor(state.events.length), type, actor, target, detail }) }
let schedulerSequence = 0
let executionSequence = 0
const schedulerAuthorities = new WeakMap<MockScheduler, SchedulerRegistrationAuthority>()
const schedulerCanonicalState = new WeakMap<MockScheduler, CanonicalScheduler>()
const schedulerRegistrationProvenance = new WeakMap<object, { scheduler: MockScheduler; fingerprint: string }>()
const schedulerRegistry = new Map<string, MockScheduler>()

function deepFreeze<T>(value: T): T {
  if (value && typeof value === 'object') {
    Object.values(value as Record<string, unknown>).forEach((child) => deepFreeze(child))
    Object.freeze(value)
  }
  return value
}

function schedulerState(scheduler: MockScheduler): CanonicalScheduler {
  const state = schedulerCanonicalState.get(scheduler)
  if (!state) throw new Error('scheduler canonical state is unavailable')
  return state
}

function schedulerProjection<T>(value: T): T { return value === undefined ? value : deepFreeze(clone(value)) }

function schedulerView(state: CanonicalScheduler): MockScheduler {
  const view = {} as MockScheduler
  const projection = (property: keyof CanonicalScheduler): void => { Object.defineProperty(view, property, { enumerable: true, configurable: false, get: () => schedulerProjection(state[property]) }) }
  ;(['id', 'status', 'maximum', 'conservativeCeiling', 'used', 'available', 'leases', 'queue', 'executionIds', 'executionActivities', 'revision', 'nextSequence', 'nextLeaseNumber', 'nextExecutionNumber', 'lastExecutionId', 'consecutiveDispatches', 'maxConsecutiveDispatches'] as (keyof CanonicalScheduler)[]).forEach(projection)
  return Object.freeze(view)
}

function requireSchedulerAuthority(scheduler: MockScheduler, authority: SchedulerRegistrationAuthority | undefined, operation: string): CanonicalScheduler {
  if (!authority || schedulerAuthorities.get(scheduler) !== authority) throw new Error(`${operation} requires its canonical authority capability`)
  return schedulerState(scheduler)
}

function registrationFingerprint(registration: SchedulerExecutionRegistration): string {
  return JSON.stringify({
    executionId: registration.executionId,
    runId: registration.runId,
    snapshotStatus: registration.snapshotStatus,
    functionalState: registration.functionalState,
    operationalState: registration.operationalState,
    activities: registration.activities.map((item) => ({ activityId: item.activityId, assignmentId: item.assignmentId, sessionId: item.sessionId, state: item.state, role: item.role, artifactCycleId: item.artifactCycleId, eligible: item.eligible })),
  })
}

function canonicalRegistrationProvenance(scheduler: MockScheduler, registration: SchedulerExecutionRegistration): SchedulerRegistrationProvenance {
  const fingerprint = registrationFingerprint(registration)
  const provenance: SchedulerRegistrationProvenance = Object.freeze({ kind: 'canonical-execution-domain', schedulerId: scheduler.id, executionId: registration.executionId, fingerprint })
  schedulerRegistrationProvenance.set(provenance, { scheduler, fingerprint })
  return provenance
}

function verifyRegistrationProvenance(scheduler: MockScheduler, registration: SchedulerExecutionRegistration): void {
  const provenance = registration.provenance
  const record = provenance && schedulerRegistrationProvenance.get(provenance)
  if (!record || record.scheduler !== scheduler || provenance.kind !== 'canonical-execution-domain' || provenance.schedulerId !== scheduler.id || provenance.executionId !== registration.executionId || record.fingerprint !== registrationFingerprint(registration) || provenance.fingerprint !== record.fingerprint) throw new Error('scheduler registration requires canonical authority provenance')
}

function isCanonicalSystemReservation(value: unknown): value is string { return typeof value === 'string' && /^SYSTEM-RESERVATION-[A-Z0-9-]+$/.test(value) }

export function createMockScheduler(options: { id?: string; maximum?: number | null; initialUsed?: number; status?: 'KNOWN' | 'UNKNOWN'; maxConsecutiveDispatches?: number; systemReservationAssignments?: string[] } = {}): MockScheduler {
  const status = options.status ?? 'KNOWN'
  if (status === 'UNKNOWN' && ((options.maximum !== undefined && options.maximum !== null) || (options.initialUsed !== undefined && options.initialUsed !== 0))) throw new Error('unknown scheduler cannot accept known capacity or initial reservations')
  const maximum = status === 'UNKNOWN' ? null : options.maximum ?? 5
  if (status === 'KNOWN' && (maximum === null || !Number.isInteger(maximum) || maximum < 0)) throw new Error('known scheduler capacity requires a non-negative integer maximum')
  const initialUsed = status === 'UNKNOWN' ? 0 : options.initialUsed ?? Math.min(4, maximum ?? 0)
  if (!Number.isInteger(initialUsed) || initialUsed < 0 || initialUsed > (maximum ?? 0)) throw new Error('initial scheduler reservations must fit the maximum capacity')
  if (options.maxConsecutiveDispatches !== undefined && (!Number.isInteger(options.maxConsecutiveDispatches) || options.maxConsecutiveDispatches < 0)) throw new Error('maxConsecutiveDispatches must be a non-negative integer')
  const defaultReservations = ['SYSTEM-RESERVATION-044', 'SYSTEM-RESERVATION-039', 'SYSTEM-RESERVATION-041', 'SYSTEM-RESERVATION-028'].slice(0, initialUsed)
  const reservationAssignments = options.systemReservationAssignments ?? defaultReservations
  if (reservationAssignments.length !== initialUsed || reservationAssignments.some((item) => !isCanonicalSystemReservation(item)) || new Set(reservationAssignments).size !== reservationAssignments.length) throw new Error('system reservations must be canonical, non-empty and unique')
  const schedulerId = options.id ?? `SCHEDULER-${++schedulerSequence}`
  if (schedulerRegistry.has(schedulerId)) throw new Error(`scheduler identity already exists: ${schedulerId}`)
  const systemLeases = reservationAssignments.map((assignmentId, index) => ({ leaseId: `SYSTEM-${index + 1}`, executionId: 'SYSTEM', activityId: `SYSTEM-ACT-${index + 1}`, assignmentId }))
  const canonical: CanonicalScheduler = { id: schedulerId, status, maximum, conservativeCeiling: maximum === null ? 2 : Math.min(2, maximum), used: initialUsed, available: maximum === null ? null : maximum - initialUsed, leases: systemLeases, queue: [], executionIds: [], executionActivities: {}, revision: 0, nextSequence: 1, nextLeaseNumber: 1, nextExecutionNumber: 1, lastExecutionId: undefined, consecutiveDispatches: 0, maxConsecutiveDispatches: options.maxConsecutiveDispatches ?? 2 }
  const scheduler = schedulerView(canonical)
  const authority = Object.freeze({ kind: 'scheduler-registration-authority' as const })
  schedulerCanonicalState.set(scheduler, canonical)
  schedulerAuthorities.set(scheduler, authority)
  const systemRegistration: SchedulerExecutionRegistration = { executionId: 'SYSTEM', runId: 'SYSTEM', snapshotStatus: 'CONFIRMED', functionalState: 'RUNNING', operationalState: 'PROCESSING', activities: systemLeases.map((lease) => ({ activityId: lease.activityId, assignmentId: lease.assignmentId, sessionId: `SYSTEM-SESSION-${lease.leaseId}`, role: 'IMPLEMENTER', artifactCycleId: 'SYSTEM-CYCLE', state: 'RUNNING', eligible: true })) }
  registerSchedulerExecution(scheduler, { ...systemRegistration, provenance: canonicalRegistrationProvenance(scheduler, systemRegistration) }, authority)
  schedulerRegistry.set(scheduler.id, scheduler)
  return scheduler
}
function schedulerFor(state: MockState): MockScheduler {
  const scheduler = schedulerRegistry.get(state.schedulerId)
  if (!scheduler) throw new Error(`scheduler authority not found: ${state.schedulerId}`)
  return scheduler
}
export function getSchedulerForState(state: MockState): MockScheduler { return schedulerFor(state) }
export function getSchedulerRegistrationAuthority(scheduler: MockScheduler): SchedulerRegistrationAuthority {
  const authority = schedulerAuthorities.get(scheduler)
  if (!authority) throw new Error('scheduler registration authority is unavailable')
  return authority
}
function schedulerCanDispatch(scheduler: MockScheduler): boolean { const canonical = schedulerState(scheduler); return canonical.status === 'KNOWN' && canonical.available !== null && canonical.available > 0 }
function executionCanDispatch(record: SchedulerExecutionRecord): boolean { return record.snapshotStatus === 'CONFIRMED' && record.functionalState === 'RUNNING' && ['PROCESSING', 'WAITING_CAPACITY', 'RECOVERING'].includes(record.operationalState) }
function candidateRegistration(scheduler: MockScheduler, candidate: Pick<SchedulerCandidate, 'executionId' | 'activityId' | 'assignmentId'>): { record: SchedulerExecutionRecord; eligible: boolean } | undefined {
  const record = scheduler.executionActivities[candidate.executionId]
  if (!record || record.assignmentIds[candidate.activityId] !== candidate.assignmentId) return undefined
  const eligible = record.activityEligibility[candidate.activityId] ?? false
  return { record, eligible }
}
function candidateCanDispatch(scheduler: MockScheduler, candidate: Pick<SchedulerCandidate, 'executionId' | 'activityId' | 'assignmentId'>): boolean {
  const registration = candidateRegistration(scheduler, candidate)
  if (!registration || !executionCanDispatch(registration.record) || !registration.eligible) return false
  if (!['READY', 'QUEUED', 'WAITING_CAPACITY'].includes(registration.record.activityStates[candidate.activityId])) return false
  return !scheduler.leases.some((lease) => lease.executionId === candidate.executionId && lease.activityId === candidate.activityId && lease.assignmentId === candidate.assignmentId)
}
function effectiveQueueReason(scheduler: MockScheduler, candidate: Pick<SchedulerCandidate, 'executionId' | 'activityId' | 'assignmentId'>): SchedulerQueueReason {
  return candidateCanDispatch(scheduler, candidate) ? (schedulerCanDispatch(scheduler) ? 'READY' : 'CAPACITY') : 'ELIGIBILITY'
}
function refreshSchedulerQueueReasons(scheduler: MockScheduler): void {
  const canonical = schedulerState(scheduler)
  let changed = false
  canonical.queue.forEach((item) => {
    const reason = effectiveQueueReason(scheduler, item)
    if (item.reason !== reason) { item.reason = reason; changed = true }
  })
  if (changed) canonical.revision += 1
}
export function reevaluateScheduler(scheduler: MockScheduler, authority?: SchedulerRegistrationAuthority): void { requireSchedulerAuthority(scheduler, authority, 'scheduler reevaluation'); refreshSchedulerQueueReasons(scheduler) }
function syncCapacityProjection(state: MockState): void {
  const scheduler = schedulerFor(state)
  state.schedulerRevision = scheduler.revision
  state.capacity = { status: scheduler.status, maximum: scheduler.maximum, used: scheduler.used, available: scheduler.available, conservativeCeiling: scheduler.conservativeCeiling, queuedByCapacity: scheduler.queue.filter((item) => item.reason === 'CAPACITY').length, queuedByEligibility: scheduler.queue.filter((item) => item.reason === 'ELIGIBILITY').length, leases: scheduler.leases.map((lease) => lease.assignmentId), fairQueue: scheduler.queue.filter((item) => item.executionId === state.schedulerExecutionId).map((item) => item.activityId) }
}
function executionOwnsLease(state: MockState, assignmentId: string): boolean { return schedulerFor(state).leases.some((lease) => lease.executionId === state.schedulerExecutionId && lease.assignmentId === assignmentId) }

function registrationRecord(registration: SchedulerExecutionRegistration): SchedulerExecutionRecord {
  return {
    runId: registration.runId,
    snapshotStatus: registration.snapshotStatus,
    functionalState: registration.functionalState,
    operationalState: registration.operationalState,
    activityIds: registration.activities.map((item) => item.activityId),
    assignmentIds: Object.fromEntries(registration.activities.map((item) => [item.activityId, item.assignmentId])),
    activitySessions: Object.fromEntries(registration.activities.map((item) => [item.activityId, item.sessionId ?? ''])),
    activityRoles: Object.fromEntries(registration.activities.map((item) => [item.activityId, item.role ?? 'IMPLEMENTER'])),
    activityCycles: Object.fromEntries(registration.activities.map((item) => [item.activityId, item.artifactCycleId ?? ''])),
    activityStates: Object.fromEntries(registration.activities.map((item) => [item.activityId, item.state])),
    activityEligibility: Object.fromEntries(registration.activities.map((item) => [item.activityId, item.eligible])),
    provenanceFingerprint: registration.provenance?.fingerprint ?? registrationFingerprint(registration),
  }
}

export function createCanonicalSchedulerExecutionRegistration(state: MockState): SchedulerExecutionRegistration {
  const scheduler = schedulerFor(state)
  const registration: SchedulerExecutionRegistration = {
    executionId: state.schedulerExecutionId,
    runId: state.run.id,
    snapshotStatus: state.snapshot.status,
    functionalState: state.run.functionalState,
    operationalState: state.run.operationalState,
    activities: state.activities.map((item) => {
      const assignment = state.assignments.find((candidate) => candidate.agentAssignmentId === item.agentAssignmentId)
      if (!assignment || assignment.sessionId !== item.sessionId || assignment.role !== item.role || assignment.artifactCycleId !== item.artifactCycleId) throw new Error(`canonical execution ownership is incomplete for ${item.id}`)
      return { activityId: item.id, assignmentId: assignment.agentAssignmentId, sessionId: item.sessionId, role: assignment.role, artifactCycleId: assignment.artifactCycleId, state: item.state, eligible: agentIsEligible(state, assignment.role, assignment.artifactCycleId, assignment.agentAssignmentId) }
    }),
  }
  return { ...registration, provenance: canonicalRegistrationProvenance(scheduler, registration) }
}

export function createCanonicalSchedulerFixture(scheduler: MockScheduler, fixtureId: string, activityId = `ACT-${fixtureId}`, assignmentId = `ASN-${fixtureId}`, eligible = true): SchedulerExecutionRegistration {
  const registration: SchedulerExecutionRegistration = { executionId: `EXECUTION-FIXTURE-${fixtureId}`, runId: `RUN-FIXTURE-${fixtureId}`, snapshotStatus: 'CONFIRMED', functionalState: 'RUNNING', operationalState: 'PROCESSING', activities: [{ activityId, assignmentId, sessionId: `SESSION-${fixtureId}`, role: 'IMPLEMENTER', artifactCycleId: `CYCLE-${fixtureId}`, state: 'READY', eligible }] }
  return { ...registration, provenance: canonicalRegistrationProvenance(scheduler, registration) }
}

export function registerSchedulerExecution(scheduler: MockScheduler, registration: SchedulerExecutionRegistration, authority: SchedulerRegistrationAuthority): void {
  const canonical = requireSchedulerAuthority(scheduler, authority, 'scheduler registration')
  validateSchedulerRegistration(scheduler, registration)
  const current = canonical.executionActivities[registration.executionId]
  if (current) {
    if (!sameRegistration(current, registration)) throw new Error('registered scheduler execution identity is immutable; use the lifecycle update operation')
    return
  }
   canonical.executionIds.push(registration.executionId)
   canonical.executionActivities[registration.executionId] = registrationRecord(registration)
   canonical.revision += 1
}
function sameRegistration(current: SchedulerExecutionRecord, registration: SchedulerExecutionRegistration): boolean {
  return current.provenanceFingerprint === registrationFingerprint(registration) && current.runId === registration.runId && current.snapshotStatus === registration.snapshotStatus && current.functionalState === registration.functionalState && current.operationalState === registration.operationalState && JSON.stringify(current.activityIds) === JSON.stringify(registration.activities.map((item) => item.activityId)) && JSON.stringify(current.assignmentIds) === JSON.stringify(Object.fromEntries(registration.activities.map((item) => [item.activityId, item.assignmentId]))) && JSON.stringify(current.activitySessions) === JSON.stringify(Object.fromEntries(registration.activities.map((item) => [item.activityId, item.sessionId ?? '']))) && JSON.stringify(current.activityRoles) === JSON.stringify(Object.fromEntries(registration.activities.map((item) => [item.activityId, item.role ?? 'IMPLEMENTER']))) && JSON.stringify(current.activityCycles) === JSON.stringify(Object.fromEntries(registration.activities.map((item) => [item.activityId, item.artifactCycleId ?? '']))) && JSON.stringify(current.activityStates) === JSON.stringify(Object.fromEntries(registration.activities.map((item) => [item.activityId, item.state]))) && JSON.stringify(current.activityEligibility) === JSON.stringify(Object.fromEntries(registration.activities.map((item) => [item.activityId, item.eligible])))
}
function validateSchedulerRegistration(scheduler: MockScheduler, registration: SchedulerExecutionRegistration, ignoredExecutionId?: string): void {
  const executionIdValid = registration.executionId === 'SYSTEM' || /^(EXECUTION|EXEC|RUN)-[A-Za-z0-9-]+$/.test(registration.executionId)
  const runIdValid = registration.runId === 'SYSTEM' || /^RUN-[A-Za-z0-9-]+$/.test(registration.runId)
  if (!executionIdValid || !runIdValid || (registration.executionId !== 'SYSTEM' && registration.activities.length === 0)) throw new Error('scheduler registration requires canonical execution and run identity')
  const snapshotStatuses: Snapshot['status'][] = ['DRAFT', 'READY_TO_START', 'CONFIRMED', 'REJECTED']
  const functionalStates: RunFunctionalState[] = ['READY', 'RUNNING', 'PAUSED', 'COMPLETED', 'CANCELLED']
  const operationalStates: RunOperationalState[] = ['IDLE', 'PROCESSING', 'PAUSE_REQUESTED', 'RESUME_REQUESTED', 'CANCEL_REQUESTED', 'PAUSED', 'WAITING_CAPACITY', 'RECOVERING', 'FAILED', 'COMPLETED', 'CANCELLED']
  const activityStates: ActivityOperationalState[] = ['READY', 'QUEUED', 'RUNNING', 'PAUSE_REQUESTED', 'PAUSED', 'FAILED', 'RETRYING', 'COMPLETED', 'WAITING_CAPACITY', 'WAITING_ELIGIBILITY']
  const roles: AgentRole[] = ['IMPLEMENTER', 'AUDITOR', 'REMEDIATOR', 'CONFLICT_RESOLVER']
  if (!snapshotStatuses.includes(registration.snapshotStatus) || !functionalStates.includes(registration.functionalState) || !operationalStates.includes(registration.operationalState)) throw new Error('scheduler registration contains an invalid execution lifecycle value')
  const activityIds = registration.activities.map((item) => item.activityId)
  const assignmentIds = registration.activities.map((item) => item.assignmentId)
  const activityIdentityValid = (item: string): boolean => registration.executionId === 'SYSTEM' ? /^SYSTEM-ACT-[0-9]+$/.test(item) : /^(ACT|CAP|ELIG)-[A-Za-z0-9-]+$/.test(item)
  const assignmentIdentityValid = (item: string): boolean => registration.executionId === 'SYSTEM' ? isCanonicalSystemReservation(item) : /^ASN-[A-Za-z0-9-]+$/.test(item)
  if (activityIds.some((item) => !activityIdentityValid(item)) || assignmentIds.some((item) => !assignmentIdentityValid(item)) || new Set(activityIds).size !== activityIds.length || new Set(assignmentIds).size !== assignmentIds.length) throw new Error('scheduler registration activity identity values and assignment identity values must be canonical and unique')
  if (registration.activities.some((item) => !activityStates.includes(item.state) || typeof item.eligible !== 'boolean' || typeof item.sessionId !== 'string' || !item.sessionId || !roles.includes(item.role as AgentRole) || typeof item.artifactCycleId !== 'string' || !item.artifactCycleId)) throw new Error('scheduler registration contains an invalid activity lifecycle or ownership value')
  verifyRegistrationProvenance(scheduler, registration)
  if (registration.executionId === 'SYSTEM' && (registration.snapshotStatus !== 'CONFIRMED' || registration.functionalState !== 'RUNNING' || registration.operationalState !== 'PROCESSING')) throw new Error('SYSTEM registration must remain a confirmed running processing authority')
  const canonical = schedulerState(scheduler)
  for (const executionId of canonical.executionIds) {
    if (executionId === ignoredExecutionId || executionId === registration.executionId) continue
    const current = scheduler.executionActivities[executionId]
    if (current?.runId === registration.runId || current?.activityIds.some((item) => activityIds.includes(item)) || Object.values(current?.assignmentIds ?? {}).some((item) => assignmentIds.includes(item))) throw new Error('scheduler registration identity already belongs to another execution')
  }
}
function lifecycleUpdateIsLegal(current: SchedulerExecutionRecord, update: SchedulerExecutionRegistrationUpdate): boolean {
  const legal = <T extends string>(from: T, to: T, graph: Record<T, readonly T[]>): boolean => from === to || graph[from].includes(to)
  const snapshotGraph: Record<Snapshot['status'], readonly Snapshot['status'][]> = { DRAFT: ['READY_TO_START', 'REJECTED'], READY_TO_START: ['CONFIRMED', 'DRAFT', 'REJECTED'], CONFIRMED: [], REJECTED: ['DRAFT'] }
  const functionalGraph: Record<RunFunctionalState, readonly RunFunctionalState[]> = { READY: ['RUNNING', 'CANCELLED'], RUNNING: ['PAUSED', 'COMPLETED', 'CANCELLED'], PAUSED: ['RUNNING', 'CANCELLED'], COMPLETED: [], CANCELLED: [] }
  const operationalGraph: Record<RunOperationalState, readonly RunOperationalState[]> = { IDLE: ['PROCESSING', 'CANCELLED'], PROCESSING: ['PAUSE_REQUESTED', 'PAUSED', 'WAITING_CAPACITY', 'RECOVERING', 'FAILED', 'COMPLETED', 'CANCEL_REQUESTED', 'CANCELLED'], PAUSE_REQUESTED: ['PAUSED', 'PROCESSING', 'CANCEL_REQUESTED', 'CANCELLED'], RESUME_REQUESTED: ['PROCESSING', 'PAUSED', 'CANCELLED'], CANCEL_REQUESTED: ['CANCELLED', 'PROCESSING'], PAUSED: ['RESUME_REQUESTED', 'PROCESSING', 'CANCELLED'], WAITING_CAPACITY: ['PROCESSING', 'PAUSED', 'CANCEL_REQUESTED', 'COMPLETED', 'CANCELLED'], RECOVERING: ['PROCESSING', 'FAILED', 'CANCELLED'], FAILED: ['RECOVERING', 'CANCELLED', 'PROCESSING'], COMPLETED: [], CANCELLED: [] }
  return legal(current.snapshotStatus, update.snapshotStatus, snapshotGraph) && legal(current.functionalState, update.functionalState, functionalGraph) && legal(current.operationalState, update.operationalState, operationalGraph)
}
export function updateSchedulerExecutionRegistration(scheduler: MockScheduler, update: SchedulerExecutionRegistrationUpdate, authority: SchedulerRegistrationAuthority): void {
  const canonical = requireSchedulerAuthority(scheduler, authority, 'scheduler lifecycle update')
  const current = canonical.executionActivities[update.executionId]
  if (!current) throw new Error('scheduler execution must be registered before lifecycle update')
  if (!lifecycleUpdateIsLegal(current, update)) throw new Error('illegal scheduler execution lifecycle transition')
  const changed = current.snapshotStatus !== update.snapshotStatus || current.functionalState !== update.functionalState || current.operationalState !== update.operationalState
  if (changed) {
    current.snapshotStatus = update.snapshotStatus
    current.functionalState = update.functionalState
    current.operationalState = update.operationalState
    canonical.revision += 1
  }
  refreshSchedulerQueueReasons(scheduler)
}
function registerStateExecution(state: MockState, allowIdentityChange = false): void {
  const scheduler = schedulerFor(state)
  const canonical = schedulerState(scheduler)
  const current = canonical.executionActivities[state.schedulerExecutionId]
  const registration = current && !allowIdentityChange
    ? { executionId: state.schedulerExecutionId, runId: state.run.id, snapshotStatus: state.snapshot.status, functionalState: state.run.functionalState, operationalState: state.run.operationalState, activities: current.activityIds.map((activityId) => { const item = state.activities.find((activity) => activity.id === activityId); if (!item) throw new Error(`canonical execution activity is missing: ${activityId}`); const assignmentId = current.assignmentIds[activityId]; const role = current.activityRoles[activityId]; const cycle = current.activityCycles[activityId]; return { activityId, assignmentId, sessionId: current.activitySessions[activityId], role, artifactCycleId: cycle, state: item.state, eligible: agentIsEligible(state, role, cycle, assignmentId) } }) }
    : createCanonicalSchedulerExecutionRegistration(state)
  const registrationWithProvenance = { ...registration, provenance: canonicalRegistrationProvenance(scheduler, registration) }
  if (!current) {
    registerSchedulerExecution(scheduler, registrationWithProvenance, getSchedulerRegistrationAuthority(scheduler))
    return
  }
  if (allowIdentityChange) {
    validateSchedulerRegistration(scheduler, registrationWithProvenance, state.schedulerExecutionId)
    if (!lifecycleUpdateIsLegal(current, { executionId: registration.executionId, snapshotStatus: registration.snapshotStatus, functionalState: registration.functionalState, operationalState: registration.operationalState })) throw new Error('illegal scheduler execution lifecycle transition')
    const leasedActivityIds = new Set(scheduler.leases.filter((lease) => lease.executionId === state.schedulerExecutionId).map((lease) => lease.activityId))
    const changedLeasedIdentity = [...leasedActivityIds].some((activityId) => registration.activities.find((item) => item.activityId === activityId)?.assignmentId !== current.assignmentIds[activityId])
    if (changedLeasedIdentity) throw new Error('leased scheduler activity identity is immutable')
    if (!sameRegistration(current, registrationWithProvenance)) {
      canonical.executionActivities[state.schedulerExecutionId] = registrationRecord(registrationWithProvenance)
      canonical.revision += 1
    }
    refreshSchedulerQueueReasons(scheduler)
    return
  }
  updateSchedulerExecutionRegistration(scheduler, { executionId: registration.executionId, snapshotStatus: registration.snapshotStatus, functionalState: registration.functionalState, operationalState: registration.operationalState }, getSchedulerRegistrationAuthority(scheduler))
  let activityChanged = false
  current.activityIds.forEach((activityId) => {
    const item = state.activities.find((activity) => activity.id === activityId)
    if (!item) return
    if (current.activityStates[activityId] !== item.state) { current.activityStates[activityId] = item.state; activityChanged = true }
    const assignment = state.assignments.find((candidate) => candidate.agentAssignmentId === current.assignmentIds[activityId])
    const eligible = !!assignment && agentIsEligible(state, assignment.role, assignment.artifactCycleId, assignment.agentAssignmentId)
    if (current.activityEligibility[activityId] !== eligible) { current.activityEligibility[activityId] = eligible; activityChanged = true }
  })
  if (activityChanged) canonical.revision += 1
  refreshSchedulerQueueReasons(scheduler)
}
export function reconcileSchedulerCapacity(scheduler: MockScheduler, options: { status: 'KNOWN' | 'UNKNOWN'; maximum: number | null; leaseAssignments?: string[]; conservativeCeiling?: number }, authority: SchedulerRegistrationAuthority): void {
  const canonical = requireSchedulerAuthority(scheduler, authority, 'scheduler capacity reconciliation')
  if (options.status === 'UNKNOWN' && options.maximum !== null) throw new Error('unknown scheduler capacity must not accept a known maximum')
  if (options.status === 'KNOWN' && (options.maximum === null || !Number.isInteger(options.maximum) || options.maximum < 0)) throw new Error('known scheduler capacity requires a non-negative integer maximum')
  if (options.conservativeCeiling !== undefined && (!Number.isInteger(options.conservativeCeiling) || options.conservativeCeiling < 0)) throw new Error('scheduler conservative ceiling requires a non-negative integer')
  if (options.status === 'KNOWN' && options.conservativeCeiling !== undefined && options.conservativeCeiling > (options.maximum ?? 0)) throw new Error('scheduler conservative ceiling cannot exceed known maximum capacity')
  const canonicalAssignments = canonical.leases.map((lease) => lease.assignmentId)
  if (options.leaseAssignments && (new Set(options.leaseAssignments).size !== options.leaseAssignments.length || options.leaseAssignments.length !== canonicalAssignments.length || options.leaseAssignments.some((assignmentId, index) => assignmentId !== canonicalAssignments[index]))) throw new Error('scheduler lease assignments exceed or diverge from canonical registered lease assignments')
  if (options.status === 'KNOWN' && canonicalAssignments.length > (options.maximum ?? 0)) throw new Error('scheduler lease assignments exceed maximum capacity')
  const before = getSchedulerSnapshot(scheduler)
  const beforeConservativeCeiling = canonical.conservativeCeiling
  canonical.status = options.status
  canonical.maximum = options.status === 'KNOWN' ? options.maximum : null
  canonical.conservativeCeiling = options.conservativeCeiling ?? (canonical.maximum === null ? canonical.conservativeCeiling : Math.min(canonical.conservativeCeiling, canonical.maximum))
  canonical.used = canonical.leases.length
  canonical.available = canonical.maximum === null ? null : canonical.maximum - canonical.used
  if (before.status !== canonical.status || before.maximum !== canonical.maximum || before.available !== canonical.available || before.used !== canonical.used || beforeConservativeCeiling !== canonical.conservativeCeiling || before.fairQueue.length !== canonical.queue.length || before.leases.length !== canonical.leases.length || before.leases.some((lease, index) => JSON.stringify(lease) !== JSON.stringify(canonical.leases[index])) || before.fairQueue.some((candidate, index) => JSON.stringify(candidate) !== JSON.stringify(canonical.queue[index]))) canonical.revision += 1
  refreshSchedulerQueueReasons(scheduler)
}
export function enqueueSchedulerCandidate(scheduler: MockScheduler, candidate: Omit<SchedulerCandidate, 'sequence'>, authority?: SchedulerRegistrationAuthority): SchedulerCandidate | undefined {
  const canonical = requireSchedulerAuthority(scheduler, authority, 'scheduler candidate enqueue')
  if (!candidateRegistration(scheduler, candidate)) return undefined
  const existing = canonical.queue.find((item) => item.executionId === candidate.executionId && item.activityId === candidate.activityId)
  const reason = effectiveQueueReason(scheduler, candidate)
  if (existing) {
    if (existing.assignmentId !== candidate.assignmentId || existing.priority !== candidate.priority || existing.reason !== reason) { Object.assign(existing, { assignmentId: candidate.assignmentId, priority: candidate.priority, reason }); canonical.revision += 1 }
    return schedulerProjection(existing)
  }
  const queued = { ...candidate, reason, sequence: canonical.nextSequence++ }
  canonical.queue.push(queued)
  canonical.revision += 1
  return schedulerProjection(queued)
}
export function selectNextSchedulerCandidate(scheduler: MockScheduler): SchedulerCandidate | undefined {
  const eligibleQueue = scheduler.queue.filter((item) => item.reason !== 'ELIGIBILITY' && candidateCanDispatch(scheduler, item))
  const alternateExecutions = new Set(eligibleQueue.map((item) => item.executionId).filter((id) => id !== scheduler.lastExecutionId))
  const candidates = scheduler.lastExecutionId && scheduler.consecutiveDispatches >= scheduler.maxConsecutiveDispatches && alternateExecutions.size > 0
    ? eligibleQueue.filter((item) => item.executionId !== scheduler.lastExecutionId)
    : eligibleQueue
  return [...candidates].sort((left, right) => right.priority - left.priority || left.sequence - right.sequence)[0]
}
export function acquireSchedulerLease(scheduler: MockScheduler, candidate: SchedulerCandidate, authority?: SchedulerRegistrationAuthority): SchedulerLease | undefined {
  const canonical = requireSchedulerAuthority(scheduler, authority, 'scheduler lease acquisition')
  if (!schedulerCanDispatch(scheduler) || canonical.available === null || !candidateCanDispatch(scheduler, candidate)) return undefined
  const index = canonical.queue.findIndex((item) => item.sequence === candidate.sequence && item.executionId === candidate.executionId && item.activityId === candidate.activityId && item.assignmentId === candidate.assignmentId && item.reason !== 'ELIGIBILITY')
  if (index < 0) return undefined
  const queued = canonical.queue[index]
  canonical.queue.splice(index, 1)
  const lease: SchedulerLease = { leaseId: `LEASE-${String(canonical.nextLeaseNumber++).padStart(4, '0')}`, executionId: queued.executionId, activityId: queued.activityId, assignmentId: queued.assignmentId }
  canonical.leases.push(lease)
  canonical.used += 1
  canonical.available = canonical.available - 1
  canonical.consecutiveDispatches = canonical.lastExecutionId === queued.executionId ? canonical.consecutiveDispatches + 1 : 1
  canonical.lastExecutionId = queued.executionId
  const record = canonical.executionActivities[queued.executionId]
  if (record) record.activityStates[queued.activityId] = 'RUNNING'
  canonical.revision += 1
  refreshSchedulerQueueReasons(scheduler)
  return schedulerProjection(lease)
}
export function releaseSchedulerLease(scheduler: MockScheduler, lease: SchedulerLease, authority?: SchedulerRegistrationAuthority): boolean {
  const canonical = requireSchedulerAuthority(scheduler, authority, 'scheduler lease release')
  const index = canonical.leases.findIndex((item) => item.leaseId === lease.leaseId)
  if (index < 0) return false
  const canonicalLease = canonical.leases[index]
  if (canonicalLease.executionId !== lease.executionId || canonicalLease.activityId !== lease.activityId || canonicalLease.assignmentId !== lease.assignmentId) return false
  if (canonicalLease.executionId === 'SYSTEM') return false
  canonical.leases.splice(index, 1)
  const releasedRecord = canonical.executionActivities[canonicalLease.executionId]
  if (releasedRecord && releasedRecord.activityStates[canonicalLease.activityId] === 'RUNNING') releasedRecord.activityStates[canonicalLease.activityId] = 'READY'
  canonical.used = canonical.leases.length
  if (canonical.maximum !== null) canonical.available = canonical.maximum - canonical.used
  if (canonical.lastExecutionId === canonicalLease.executionId) {
    const lastPriority = Math.max(...canonical.queue.filter((item) => item.executionId === canonical.lastExecutionId).map((item) => item.priority), Number.MIN_SAFE_INTEGER)
    const alternatePriority = Math.max(...canonical.queue.filter((item) => item.executionId !== canonical.lastExecutionId).map((item) => item.priority), Number.MIN_SAFE_INTEGER)
    if (lastPriority !== Number.MIN_SAFE_INTEGER && alternatePriority >= lastPriority) canonical.consecutiveDispatches = canonical.maxConsecutiveDispatches
  }
  canonical.revision += 1
  refreshSchedulerQueueReasons(scheduler)
  return true
}
export function getSchedulerSnapshot(scheduler: MockScheduler): { status: MockScheduler['status']; maximum: number | null; used: number; available: number | null; queuedByCapacity: number; queuedByEligibility: number; fairQueue: SchedulerCandidate[]; leases: SchedulerLease[] } {
  const canonical = schedulerState(scheduler)
  return schedulerProjection({ status: canonical.status, maximum: canonical.maximum, used: canonical.used, available: canonical.available, queuedByCapacity: canonical.queue.filter((item) => item.reason === 'CAPACITY').length, queuedByEligibility: canonical.queue.filter((item) => item.reason === 'ELIGIBILITY').length, fairQueue: canonical.queue.map((item) => ({ ...item })), leases: canonical.leases.map((item) => ({ ...item })) })
}
function adrRecords(): AdrRecord[] { return adrData.map(([id, title, hash]) => ({ id, title, revision: 3, decisionStatus: 'ACCEPTED', implementationStatus: 'UNPROCESSED', contentHash: hash, actualContentHash: hash })) }
function assignment(id: string, logical: string, session: string, role: AgentRole, skill: string, cycle: string, eligible = true, reason?: string): AgentAssignment { return { agentAssignmentId: id, logicalAgentId: logical, sessionId: session, role, skill, artifactCycleId: cycle, eligible, ineligibleReason: reason, participationHistory: [] } }
function activity(id: string, name: string, assignmentId: string, sessionId: string, role: AgentRole, cycle: string, state: ActivityOperationalState, round = 1, attempt = 1): Activity { return { id, name, skill: role === 'AUDITOR' ? 'audit-spec-implementation' : role === 'REMEDIATOR' ? 'remediate-spec' : role === 'CONFLICT_RESOLVER' ? 'resolve-conflict' : 'implement-ready-tickets', version: '2.4.1', agentAssignmentId: assignmentId, sessionId, role, artifactCycleId: cycle, round, maxRounds: 10, roundExtensions: 0, maxRoundExtensions: 1, attempt, maxAttempts: 10, idempotencyKey: `idem-${id}`, state, checkpoint: 'safe-checkpoint', safeCheckpoint: 'safe-checkpoint' } }
function syncExecutionAggregate(state: MockState): void {
  if (state.run.functionalState === 'READY') { state.run.operationalState = 'IDLE'; return }
  if (state.run.functionalState === 'CANCELLED' || state.run.functionalState === 'COMPLETED') return
  if (state.recovery.status === 'NEEDS_RECOVERY') { state.run.operationalState = 'RECOVERING'; return }
  if (state.publication.state !== 'NOT_READY' && state.run.stage === 'Publicação' && state.publication.state !== 'REMOTE_PUBLICATION_CONFIRMED') { state.run.operationalState = 'PROCESSING'; return }
  if (state.activities.some((item) => item.state === 'PAUSED')) { state.run.operationalState = 'PAUSED'; return }
  if (state.activities.some((item) => item.state === 'FAILED')) { state.run.operationalState = 'FAILED'; return }
  if (state.activities.some((item) => item.state === 'WAITING_CAPACITY')) { state.run.operationalState = 'WAITING_CAPACITY'; return }
  state.run.operationalState = 'PROCESSING'
}
function recordParticipation(state: MockState, assignmentId: string, activityId: string, role: AgentRole): void {
  const selected = state.assignments.find((item) => item.agentAssignmentId === assignmentId)
  if (!selected) return
  selected.participationHistory.push(`${activityId}:${role}`)
  selected.eligible = false
  selected.ineligibleReason = `participou de ${activityId} no ciclo ${selected.artifactCycleId}`
}
function onboardingActivity(state: MockState, kind: OnboardingActivity['kind']): OnboardingActivity {
  return state.onboarding.activities.find((item) => item.kind === kind)!
}
const dispatchableActivityStates: ActivityOperationalState[] = ['READY', 'QUEUED', 'WAITING_CAPACITY', 'WAITING_ELIGIBILITY']

function dispatchActivity(state: MockState, requestedId?: string): Activity | undefined {
  const isDispatchable = (item: Activity): boolean => dispatchableActivityStates.includes(item.state)
  if (requestedId) return state.activities.find((item) => item.id === requestedId && isDispatchable(item))
  const next = selectNextSchedulerCandidate(schedulerFor(state))
  if (next) return next.executionId === state.schedulerExecutionId ? state.activities.find((item) => item.id === next.activityId && isDispatchable(item)) : undefined
  return state.activities.find(isDispatchable)
}

function syncSchedulerProjection(state: MockState): void {
  const scheduler = schedulerFor(state)
  state.activities.forEach((item) => {
    const lease = scheduler.leases.find((current) => current.executionId === state.schedulerExecutionId && current.activityId === item.id)
    const queued = scheduler.queue.find((current) => current.executionId === state.schedulerExecutionId && current.activityId === item.id)
    if (lease && ['READY', 'QUEUED', 'WAITING_CAPACITY', 'WAITING_ELIGIBILITY'].includes(item.state)) item.state = 'RUNNING'
    if (state.run.functionalState !== 'READY' && !lease && queued?.reason === 'CAPACITY' && ['READY', 'QUEUED', 'WAITING_CAPACITY'].includes(item.state)) item.state = 'WAITING_CAPACITY'
    if (state.run.functionalState !== 'READY' && !lease && queued?.reason === 'ELIGIBILITY' && ['READY', 'QUEUED', 'WAITING_CAPACITY', 'WAITING_ELIGIBILITY'].includes(item.state)) item.state = 'WAITING_ELIGIBILITY'
    if (state.run.functionalState !== 'READY' && !lease && queued?.reason === 'READY' && item.state === 'WAITING_CAPACITY') item.state = 'READY'
  })
  syncCapacityProjection(state)
}

function removeFromFairQueue(state: MockState, activityId: string): void {
  const scheduler = schedulerFor(state)
  const canonical = schedulerState(scheduler)
  const before = canonical.queue.length
  canonical.queue = canonical.queue.filter((item) => !(item.executionId === state.schedulerExecutionId && item.activityId === activityId))
  if (canonical.queue.length !== before) canonical.revision += 1
}

function enqueueFairly(state: MockState, activityId: string): void {
  const item = state.activities.find((activity) => activity.id === activityId)
  if (item) { const scheduler = schedulerFor(state); enqueueSchedulerCandidate(scheduler, { executionId: state.schedulerExecutionId, activityId, assignmentId: item.agentAssignmentId, priority: state.run.priority, reason: item.state === 'WAITING_ELIGIBILITY' ? 'ELIGIBILITY' : item.state === 'WAITING_CAPACITY' ? 'CAPACITY' : 'READY' }, getSchedulerRegistrationAuthority(scheduler)) }
}

function markWaitingForCapacity(state: MockState, item: Activity): void {
  if (item.state === 'WAITING_CAPACITY') {
    enqueueFairly(state, item.id)
    return
  }
  item.state = 'WAITING_CAPACITY'
  enqueueFairly(state, item.id)
  syncCapacityProjection(state)
}

function markWaitingForEligibility(state: MockState, item: Activity): void {
  if (item.state === 'WAITING_ELIGIBILITY') {
    enqueueFairly(state, item.id)
    return
  }
  item.state = 'WAITING_ELIGIBILITY'
  enqueueFairly(state, item.id)
  syncCapacityProjection(state)
}

function acquireActivityLease(state: MockState, item: Activity): boolean {
  const scheduler = schedulerFor(state)
  if (scheduler.status !== 'KNOWN' || scheduler.available === null || scheduler.available <= 0) return false
  if (scheduler.leases.some((lease) => lease.executionId === state.schedulerExecutionId && lease.assignmentId === item.agentAssignmentId) || !agentIsEligible(state, item.role, item.artifactCycleId, item.agentAssignmentId)) return false
  const candidate = scheduler.queue.find((queued) => queued.executionId === state.schedulerExecutionId && queued.activityId === item.id) ?? enqueueSchedulerCandidate(scheduler, { executionId: state.schedulerExecutionId, activityId: item.id, assignmentId: item.agentAssignmentId, priority: state.run.priority, reason: item.state === 'WAITING_ELIGIBILITY' ? 'ELIGIBILITY' : item.state === 'WAITING_CAPACITY' ? 'CAPACITY' : 'READY' }, getSchedulerRegistrationAuthority(scheduler))
  if (!candidate) return false
  const lease = acquireSchedulerLease(scheduler, candidate, getSchedulerRegistrationAuthority(scheduler))
  if (!lease) return false
  item.state = 'RUNNING'
  recordParticipation(state, item.agentAssignmentId, item.id, item.role)
  removeFromFairQueue(state, item.id)
  registerStateExecution(state)
  syncCapacityProjection(state)
  addEvent(state, 'lease.acquired', 'scheduler', item.agentAssignmentId, 'persisted lease acquired before isolated spawn')
  return true
}

function dispatchAvailableActivities(state: MockState, requestedId?: string): number {
  let dispatched = 0
  const scheduler = schedulerFor(state)
  registerStateExecution(state)
  const authority = getSchedulerRegistrationAuthority(scheduler)
  state.activities.filter((item) => dispatchableActivityStates.includes(item.state)).forEach((item) => enqueueSchedulerCandidate(scheduler, { executionId: state.schedulerExecutionId, activityId: item.id, assignmentId: item.agentAssignmentId, priority: state.run.priority, reason: item.state === 'WAITING_ELIGIBILITY' ? 'ELIGIBILITY' : item.state === 'WAITING_CAPACITY' ? 'CAPACITY' : 'READY' }, authority))
  refreshSchedulerQueueReasons(scheduler)
  while (true) {
    let item: Activity | undefined
    if (requestedId) item = dispatchActivity(state, requestedId)
    else {
      const next = selectNextSchedulerCandidate(scheduler)
      if (!next) break
    if (next.executionId !== state.schedulerExecutionId) {
        if (!acquireSchedulerLease(scheduler, next, authority)) break
        dispatched += 1
        break
      }
      item = state.activities.find((activity) => activity.id === next.activityId && dispatchableActivityStates.includes(activity.state))
    }
    if (!item) break
    if (state.capacity.status !== 'KNOWN' || (state.capacity.available ?? 0) <= 0) break
    if (!agentIsEligible(state, item.role, item.artifactCycleId, item.agentAssignmentId)) {
      markWaitingForEligibility(state, item)
      if (requestedId) break
      continue
    }
    if (!acquireActivityLease(state, item)) break
    dispatched += 1
    break
  }
  if (!requestedId && (state.capacity.status !== 'KNOWN' || (state.capacity.available ?? 0) <= 0)) {
    state.activities.filter((item) => ['READY', 'QUEUED'].includes(item.state)).forEach((item) => markWaitingForCapacity(state, item))
  }
  syncSchedulerProjection(state)
  return dispatched
}

function releaseActivityLease(state: MockState, item: Activity): boolean {
  const scheduler = schedulerFor(state)
  const lease = scheduler.leases.find((current) => current.executionId === state.schedulerExecutionId && current.assignmentId === item.agentAssignmentId)
  if (!lease || !releaseSchedulerLease(scheduler, lease, getSchedulerRegistrationAuthority(scheduler))) return false
  syncCapacityProjection(state)
  addEvent(state, 'lease.released', 'scheduler', item.agentAssignmentId, `lease released after confirmed completion of ${item.id}`)
  return true
}

function releaseAllCapacity(state: MockState): void {
  const scheduler = schedulerFor(state)
  const userExecutionIds = scheduler.executionIds.filter((executionId) => executionId !== 'SYSTEM')
  const leases = scheduler.leases.filter((lease) => lease.executionId === state.schedulerExecutionId)
  const authority = getSchedulerRegistrationAuthority(scheduler)
  leases.forEach((lease) => { releaseSchedulerLease(scheduler, lease, authority); addEvent(state, 'lease.released', 'scheduler', lease.assignmentId, 'lease released during terminal execution reconciliation') })
  const canonical = schedulerState(scheduler)
  const beforeQueue = canonical.queue.length
  canonical.queue = canonical.queue.filter((item) => !userExecutionIds.includes(item.executionId) || item.executionId !== state.schedulerExecutionId)
  if (canonical.queue.length !== beforeQueue) canonical.revision += 1
  refreshSchedulerQueueReasons(scheduler)
  syncCapacityProjection(state)
}

function completeActivity(state: MockState, activityId: string): boolean {
  const item = state.activities.find((activity) => activity.id === activityId)
  if (!item || item.state !== 'RUNNING' || !schedulerFor(state).leases.some((lease) => lease.executionId === state.schedulerExecutionId && lease.assignmentId === item.agentAssignmentId)) return false
  item.state = 'COMPLETED'
  releaseActivityLease(state, item)
  addEvent(state, 'activity.completed', 'agent', item.id, `confirmed operational effect completed with assignment ${item.agentAssignmentId}`)
  dispatchAvailableActivities(state)
  return true
}

function allActivitiesCompleted(state: MockState): boolean { return state.activities.length > 0 && state.activities.every((item) => item.state === 'COMPLETED') }
function completeOnboardingActivity(state: MockState, kind: OnboardingActivity['kind']): void {
  const item = onboardingActivity(state, kind)
  item.state = 'COMPLETED'
  item.participationRecorded = true
  recordParticipation(state, item.agentAssignmentId, item.id, item.role)
}
export function assertCapacityCoherent(state: MockState): void {
  const { capacity } = state
  const scheduler = schedulerFor(state)
  const schedulerSnapshot = getSchedulerSnapshot(scheduler)
  if (capacity.status !== schedulerSnapshot.status || capacity.maximum !== schedulerSnapshot.maximum || capacity.used !== schedulerSnapshot.used || capacity.available !== schedulerSnapshot.available || capacity.queuedByCapacity !== schedulerSnapshot.queuedByCapacity || capacity.queuedByEligibility !== schedulerSnapshot.queuedByEligibility || capacity.leases.length !== schedulerSnapshot.leases.length) throw new Error(`capacity projection diverges from canonical scheduler in ${state.scenario}`)
  if (capacity.used < 0 || capacity.queuedByCapacity < 0 || capacity.queuedByEligibility < 0) throw new Error(`capacity counters cannot be negative in ${state.scenario}`)
  if (new Set(scheduler.leases.map((lease) => lease.leaseId)).size !== scheduler.leases.length) throw new Error(`capacity leases must be unique in ${state.scenario}`)
  if (new Set(scheduler.executionIds).size !== scheduler.executionIds.length || scheduler.executionIds.some((executionId) => !scheduler.executionActivities[executionId])) throw new Error(`scheduler execution registry must be canonical in ${state.scenario}`)
  const registeredActivityIds = scheduler.executionIds.flatMap((executionId) => scheduler.executionActivities[executionId].activityIds)
  const registeredAssignmentIds = scheduler.executionIds.flatMap((executionId) => Object.values(scheduler.executionActivities[executionId].assignmentIds))
  if (new Set(registeredActivityIds).size !== registeredActivityIds.length || new Set(registeredAssignmentIds).size !== registeredAssignmentIds.length) throw new Error(`scheduler activity and assignment identities must be globally unique in ${state.scenario}`)
  if (capacity.status === 'KNOWN') {
    if (capacity.maximum === null || !Number.isInteger(capacity.maximum) || capacity.maximum < 0 || capacity.conservativeCeiling > capacity.maximum || capacity.available === null || capacity.available < 0 || capacity.used + capacity.available !== capacity.maximum || capacity.leases.length !== capacity.used || scheduler.used !== scheduler.leases.length) throw new Error(`known capacity counters are inconsistent in ${state.scenario}`)
  } else if (capacity.maximum !== null || capacity.available !== null) throw new Error(`unknown capacity cannot expose exact counters in ${state.scenario}`)
  if (new Set(scheduler.queue.map((item) => `${item.executionId}:${item.activityId}`)).size !== scheduler.queue.length) throw new Error(`scheduler queue cannot duplicate an execution/activity in ${state.scenario}`)
  scheduler.queue.forEach((queued) => {
    const execution = scheduler.executionActivities[queued.executionId]
    if (!scheduler.executionIds.includes(queued.executionId) || !execution || !execution.activityIds.includes(queued.activityId) || execution.assignmentIds[queued.activityId] !== queued.assignmentId) throw new Error(`scheduler queue member ${queued.activityId} has no registered execution/activity in ${state.scenario}`)
    const expectedReason = effectiveQueueReason(scheduler, queued)
    if (queued.reason !== expectedReason) throw new Error(`scheduler queue member ${queued.activityId} has stale reason ${queued.reason} in ${state.scenario}`)
    const activity = queued.executionId === state.schedulerExecutionId ? state.activities.find((item) => item.id === queued.activityId) : undefined
    if (activity && state.run.functionalState !== 'READY' && (activity.agentAssignmentId !== queued.assignmentId || (queued.reason === 'CAPACITY' && activity.state !== 'WAITING_CAPACITY') || (queued.reason === 'ELIGIBILITY' && activity.state !== 'WAITING_ELIGIBILITY') || (queued.reason === 'READY' && activity.state === 'WAITING_CAPACITY'))) throw new Error(`scheduler queue member ${queued.activityId} has an inconsistent state in ${state.scenario}`)
  })
  scheduler.leases.forEach((lease) => {
    const execution = scheduler.executionActivities[lease.executionId]
    if (!scheduler.executionIds.includes(lease.executionId) || !execution || !execution.activityIds.includes(lease.activityId) || execution.assignmentIds[lease.activityId] !== lease.assignmentId) throw new Error(`scheduler lease ${lease.leaseId} has no registered execution/activity/assignment in ${state.scenario}`)
    if (scheduler.queue.some((queued) => queued.executionId === lease.executionId && queued.activityId === lease.activityId)) throw new Error(`active lease and queued candidate cannot represent ${lease.activityId} in ${state.scenario}`)
  })
  state.activities.filter((item) => item.state === 'WAITING_CAPACITY' || item.state === 'WAITING_ELIGIBILITY').forEach((item) => {
    const queued = scheduler.queue.find((candidate) => candidate.executionId === state.schedulerExecutionId && candidate.activityId === item.id)
    if (!queued || (item.state === 'WAITING_CAPACITY' && queued.reason !== 'CAPACITY') || (item.state === 'WAITING_ELIGIBILITY' && queued.reason !== 'ELIGIBILITY')) throw new Error(`waiting activity ${item.id} has no matching canonical queue reason in ${state.scenario}`)
  })
  state.activities.filter((item) => ['RUNNING', 'PAUSE_REQUESTED', 'RETRYING'].includes(item.state)).forEach((item) => {
    if (!executionOwnsLease(state, item.agentAssignmentId)) throw new Error(`active activity ${item.id} has no capacity lease in ${state.scenario}`)
  })
}

export function assertCoherentState(state: MockState): void {
  const activeStates: ActivityOperationalState[] = ['RUNNING', 'PAUSE_REQUESTED', 'PAUSED', 'RETRYING', 'WAITING_CAPACITY', 'WAITING_ELIGIBILITY']
  if (state.run.functionalState === 'READY' && (state.run.operationalState !== 'IDLE' || state.activities.some((item) => activeStates.includes(item.state)))) throw new Error(`incoherent READY execution in ${state.scenario}`)
  if (state.run.functionalState === 'RUNNING' && state.run.operationalState === 'IDLE') throw new Error(`RUNNING execution cannot be IDLE in ${state.scenario}`)
  const publicationNeedsGates = ['PUBLICATION_CANDIDATE_READY', 'AWAITING_PUBLICATION_APPROVAL', 'LOCAL_INTEGRATION_PENDING', 'LOCAL_INTEGRATION_COMPLETE', 'PR_OPEN', 'AWAITING_PR_MERGE', 'PR_MERGED'].includes(state.publication.state)
  if (publicationNeedsGates && (state.snapshot.status !== 'CONFIRMED' || state.run.stage !== 'Publicação' || state.run.functionalState !== 'RUNNING' || state.activities.some((item) => item.state !== 'COMPLETED'))) throw new Error(`publication gate is incomplete in ${state.scenario}`)
  if (state.publication.state === 'NOT_READY' && state.publication.conformanceStatus === 'APPROVED') throw new Error(`publication is approved before candidate readiness in ${state.scenario}`)
  assertCapacityCoherent(state)
}

export function createScenarioState(scenario: ScenarioId = 'normal', sharedScheduler?: MockScheduler): MockState {
  const scheduler = sharedScheduler ?? createMockScheduler({ status: scenario === 'capacity' ? 'UNKNOWN' : 'KNOWN' })
  const canonicalScheduler = schedulerState(scheduler)
  const schedulerExecutionId = `EXECUTION-${scenario}-${++executionSequence}`
  canonicalScheduler.revision += 1
  const adrs = adrRecords(); const cycle = 'AC-021-01'; const adrIds = adrs.map((adr) => adr.id); const baseSha = '4ae336c7f6a1dae468a23e1e9cbfe1fb95b63386'; const configVersion = 'repo-config@3.2.0'; const skillVersions = { specification: '2.4.1', gapMatrix: '1.9.0', audit: '3.0.2', publication: '1.5.0' }; const headSha = '5c91f2a8c7d6e5f40392817a6b5c4d3e2f1a0987'; const treeHash = 'b73e11c0d9a4f2e1c8b7a6d5e4f3a29181726354'
  const state: MockState = {
    scenario, schedulerId: scheduler.id, schedulerExecutionId, schedulerRevision: scheduler.revision, repository: { name: 'ai-development-engineering', branch: 'main', clean: true, aligned: true, publicationMode: scenario === 'pr' ? 'PULL_REQUEST' : 'DIRECT_PUSH' },
    run: { id: 'RUN-2026-0831-01', functionalState: ['capacity', 'retry', 'rounds', 'recovery'].includes(scenario) ? 'RUNNING' : 'READY', operationalState: 'IDLE', stage: scenario === 'audit' ? 'Conformidade' : scenario === 'pr' || scenario === 'drift' ? 'Publicação' : 'Snapshot', normalStep: 0, priority: 50 },
    snapshot: { id: 'SNAP-2026-0831-01', status: scenario === 'normal' ? 'DRAFT' : scenario === 'adr-mutation' ? 'REJECTED' : 'CONFIRMED', adrIds, adrHashes: Object.fromEntries(adrs.map((adr) => [adr.id, adr.contentHash])), baseSha, currentBaseSha: baseSha, configVersion, currentConfigVersion: configVersion, skillVersions, currentSkillVersions: { ...skillVersions }, capacitySnapshot: 'KNOWN · 04/05' },
    adrs,
    specs: [{ id: 'SPEC-021', title: 'Orquestração do pipeline', status: scenario === 'audit' ? 'AUDITING' : 'READY', progress: scenario === 'audit' ? 72 : 0, artifactCycleId: cycle, adrIds: ['ADR-0001', 'ADR-0002', 'ADR-0009'] }, { id: 'SPEC-022', title: 'Runtime local e segurança', status: 'IMPLEMENTING', progress: 44, artifactCycleId: 'AC-022-01', adrIds: ['ADR-0011', 'ADR-0012', 'ADR-0013'] }, { id: 'SPEC-023', title: 'Contrato operacional do frontend', status: 'READY', progress: 18, artifactCycleId: 'AC-023-01', adrIds: ['ADR-0003', 'ADR-0014'] }],
    tickets: [{ id: 'TCK-104', title: 'Persistir envelope e journal', wave: 1, dependencies: [], functionalState: 'COMPLETED', operationalState: 'IDLE', verdict: 'APPROVED', touchedFiles: ['src/Runtime/Journal.cs'], branch: 'ticket/TCK-104', worktree: 'wt-TCK-104' }, { id: 'TCK-105', title: 'Expor stream de eventos', wave: 2, dependencies: ['TCK-104'], functionalState: 'IMPLEMENTED', operationalState: 'IDLE', verdict: 'APPROVED', touchedFiles: ['src/Api/EventsController.cs'], branch: 'ticket/TCK-105', worktree: 'wt-TCK-105' }, { id: 'TCK-106', title: 'Validar capacidade e leases', wave: 2, dependencies: ['TCK-104'], functionalState: 'READY', operationalState: 'QUEUED', verdict: 'PENDING', touchedFiles: ['src/Scheduler/Capacity.cs'], branch: 'ticket/TCK-106', worktree: 'wt-TCK-106' }, { id: 'TCK-108', title: 'Publicação por Pull Request', wave: 2, dependencies: ['TCK-105'], functionalState: 'BLOCKED', operationalState: 'WAITING_DEPENDENCY', verdict: 'PENDING', touchedFiles: ['src/Publication/PullRequest.cs'], branch: 'ticket/TCK-108', worktree: 'wt-TCK-108' }, { id: 'TCK-107', title: 'Reconciliação Git / banco', wave: 3, dependencies: ['TCK-105', 'TCK-106'], functionalState: 'BLOCKED', operationalState: 'WAITING_DEPENDENCY', verdict: 'PENDING', touchedFiles: ['src/Persistence/Reconciliation.cs'], branch: 'ticket/TCK-107', worktree: 'wt-TCK-107' }, { id: 'TCK-109', title: 'Conformance final', wave: 3, dependencies: ['TCK-107', 'TCK-108'], functionalState: 'BLOCKED', operationalState: 'WAITING_DEPENDENCY', verdict: 'PENDING', touchedFiles: ['docs/conformance.md'], branch: 'ticket/TCK-109', worktree: 'wt-TCK-109' }],
    activities: [activity('ACT-8F21', 'Auditoria de conformidade', 'ASN-044', 'SES-044-01', 'AUDITOR', cycle, 'READY', 3), activity('ACT-8F18', 'Implementação do stream', 'ASN-039', 'SES-039-01', 'IMPLEMENTER', cycle, 'READY'), activity('ACT-8F12', 'Validação de configuração', 'ASN-031', 'SES-031-01', 'IMPLEMENTER', 'AC-022-01', 'READY', 1, 3), activity('ACT-8E99', 'Conformidade final', 'ASN-028', 'SES-028-01', 'AUDITOR', cycle, 'READY', 3), activity('ACT-8F20', 'Remediação de findings', 'ASN-041', 'SES-041-01', 'REMEDIATOR', cycle, 'READY')],
    assignments: [assignment('ASN-044', 'AGT-044', 'SES-044-01', 'AUDITOR', 'audit-spec-implementation@2.4.1', cycle), assignment('ASN-041', 'AGT-041', 'SES-041-01', 'REMEDIATOR', 'remediate-spec@1.3.0', cycle), assignment('ASN-039', 'AGT-039', 'SES-039-01', 'IMPLEMENTER', 'implement-ready-tickets@1.8.0', cycle), assignment('ASN-031', 'AGT-031', 'SES-031-01', 'IMPLEMENTER', 'validate-repository@1.2.3', 'AC-022-01'), assignment('ASN-031-C1', 'AGT-031-C1', 'SES-031-C1', 'IMPLEMENTER', 'validate-repository@1.2.3', 'AC-022-01'), assignment('ASN-028', 'AGT-028', 'SES-028-01', 'AUDITOR', 'audit-spec-implementation@2.4.1', cycle), assignment('ASN-028-R1', 'AGT-028-R1', 'SES-028-R1', 'AUDITOR', 'audit-spec-implementation@2.4.1', cycle), assignment('ASN-028-R2', 'AGT-028-R2', 'SES-028-R2', 'AUDITOR', 'audit-spec-implementation@2.4.1', cycle), assignment('ASN-028-I1', 'AGT-028-I1', 'SES-028-I1', 'AUDITOR', 'audit-wave@1.0.0', cycle), assignment('ASN-041-R2', 'AGT-041-R2', 'SES-041-R2', 'REMEDIATOR', 'remediate-spec@1.3.0', cycle), assignment('ASN-041-R3', 'AGT-041-R3', 'SES-041-R3', 'REMEDIATOR', 'remediate-spec@1.3.0', cycle), assignment('ASN-055', 'AGT-055', 'SES-055-01', 'CONFLICT_RESOLVER', 'resolve-conflict@1.0.0', cycle, scenario === 'conflict', scenario === 'conflict' ? undefined : 'reserved until a conflict exists')],
    capacity: { status: 'KNOWN', maximum: 5, used: 4, available: 1, conservativeCeiling: 2, queuedByCapacity: 2, queuedByEligibility: 1, leases: ['LEASE-044', 'LEASE-039', 'LEASE-041', 'LEASE-028'], fairQueue: ['ACT-8F12'] },
    findings: [{ id: 'ASC-MAJOR-004', title: 'Segregação do agente auditor', severity: 'MAJOR', state: scenario === 'audit' ? 'OPEN' : 'APPROVED', cycleId: cycle, auditorAssignmentId: 'ASN-044', remediatorAssignmentId: 'ASN-041-R2', reauditorAssignmentId: 'ASN-028-R1' }, { id: 'ASC-MINOR-002', title: 'Retenção da evidência de lease', severity: 'MINOR', state: scenario === 'audit' ? 'OPEN' : 'APPROVED', cycleId: cycle, auditorAssignmentId: 'ASN-044', remediatorAssignmentId: 'ASN-041-R3', reauditorAssignmentId: 'ASN-028-R2' }],
    wave: { number: 2, status: scenario === 'conflict' ? 'CONFLICTING' : 'INTEGRATION_PENDING', conflictStatus: scenario === 'conflict' ? 'DETECTED' : 'NONE', integrationAudit: 'PENDING', integrationAuditorAssignmentId: 'ASN-028-I1', dagRevision: 7 },
    reconciliation: { status: scenario === 'divergence' ? 'PENDING' : 'NONE', evidenceResult: scenario === 'divergence' ? 'SEMANTIC_DIVERGENCE' : undefined, evidence: 'journal-intent-1842 + git-ref-4ae336c7 + db-run-991 · classificação: SEMANTIC_DIVERGENCE' },
    recovery: { status: scenario === 'recovery' ? 'NEEDS_RECOVERY' : 'NOT_REQUIRED', checkpoint: 'event-contract-written', replayedEvents: 0, checkpointSafe: true, journalPosition: 5, replayStart: 2, replayEnd: 4, journalPositions: [2, 3, 4], projectionHash: 'projection-recovery-v1', replayKey: 'replay-recovery-v1' },
    publication: { mode: scenario === 'pr' ? 'PULL_REQUEST' : 'DIRECT_PUSH', state: scenario === 'pr' ? 'PR_OPEN' : scenario === 'drift' ? 'INVALIDATED' : 'NOT_READY', approval: scenario === 'drift' ? 'INVALIDATED' : 'AWAITING_PUBLICATION_APPROVAL', conformanceStatus: scenario === 'drift' ? 'INVALIDATED' : scenario === 'pr' ? 'APPROVED' : 'PENDING', conformanceRunId: 'CONF-2026-0831-17', candidateId: candidateIdForPublication('ai-development-engineering', scheduler.id, schedulerExecutionId, baseSha, headSha, treeHash), publicationIdentity: createPublicationIdentity('ai-development-engineering', scheduler.id, schedulerExecutionId, candidateIdForPublication('ai-development-engineering', scheduler.id, schedulerExecutionId, baseSha, headSha, treeHash), scenario === 'pr' ? 184 : undefined), queueStatus: 'QUEUED', baseSha, currentBaseSha: scenario === 'drift' ? '8d1b0ff9e1c2b7a1c554b88c0e0d31e96d5d0b11' : baseSha, headSha, currentHeadSha: headSha, treeHash, currentTreeHash: scenario === 'drift' ? 'c04d77ef33aa11bb22cc33dd44ee55ff66778899' : treeHash, prNumber: scenario === 'pr' ? 184 : undefined, mergeable: true, checks: 'PASSING', queuePosition: 1 },
    onboarding: { repository: 'legacy-workflow-lab', state: 'DISCOVERED', candidateConfigVersion: 'candidate@1.0.0', workspace: 'bootstrap-wt-legacy-workflow-lab', clean: false, aligned: false, bootstrapCatalogVersion: '1.1.0', auditVerdict: 'PENDING', artifactCycleId: 'ONB-LEGACY-2026-01', activities: [{ id: 'ONB-ACT-BOOTSTRAP', name: 'Bootstrap do catálogo', kind: 'BOOTSTRAP', agentAssignmentId: 'ONB-ASN-BOOT', logicalAgentId: 'ONB-AGT-BOOT', sessionId: 'ONB-SES-BOOT-01', role: 'IMPLEMENTER', artifactCycleId: 'ONB-LEGACY-2026-01', state: 'PENDING', participationRecorded: false }, { id: 'ONB-ACT-MIGRATION', name: 'Migração da configuração', kind: 'MIGRATION', agentAssignmentId: 'ONB-ASN-MIGRATE', logicalAgentId: 'ONB-AGT-MIGRATE', sessionId: 'ONB-SES-MIGRATE-01', role: 'IMPLEMENTER', artifactCycleId: 'ONB-LEGACY-2026-01', state: 'PENDING', participationRecorded: false }, { id: 'ONB-ACT-REMEDIATION', name: 'Remediação de pré-condições', kind: 'REMEDIATION', agentAssignmentId: 'ONB-ASN-REMEDIATE', logicalAgentId: 'ONB-AGT-REMEDIATE', sessionId: 'ONB-SES-REMEDIATE-01', role: 'REMEDIATOR', artifactCycleId: 'ONB-LEGACY-2026-01', state: 'READY', participationRecorded: false }, { id: 'ONB-ACT-AUDIT', name: 'Auditoria independente', kind: 'AUDIT', agentAssignmentId: 'ONB-ASN-AUDIT', logicalAgentId: 'ONB-AGT-AUDIT', sessionId: 'ONB-SES-AUDIT-01', role: 'AUDITOR', artifactCycleId: 'ONB-LEGACY-2026-01', state: 'PENDING', participationRecorded: false }] },
    adrMutation: { blocked: false, adrId: 'ADR-0007', expectedHash: adrs[6].contentHash, actualHash: adrs[6].contentHash }, commands: [], events: [{ id: 'EVT-0001', time: '09:58:00', type: 'snapshot.loaded', actor: 'mock-authority', target: 'RUN-2026-0831-01', detail: scenarioMessages[scenario] }], artifacts: [{ artifactId: 'ART-MANIFEST-0001', name: 'execution-manifest.json', type: 'Manifesto', hash: '1c9d53fbb2a14e91c7d8e6f5a4b3c2d1e0ff1122aa33445566778899aabbccdd', relatedTo: 'ACT-8F21', retained: true }, { artifactId: 'ART-CONFORMANCE-0001', name: 'conformance-report.md', type: 'Relatório', hash: '7f31aabbccddeeff00112233445566778899aabbccddeeff0011223344556677', relatedTo: 'SPEC-021', retained: true }, { artifactId: 'ART-EVENTS-0001', name: 'event-stream.ndjson', type: 'Eventos', hash: 'a11233445566778899aabbccddeeff00112233445566778899aabbccddeeff00', relatedTo: 'RUN-2026-0831-01', retained: true }], nextCommandId: 1,
  }
  state.assignments.push(...state.onboarding.activities.map((item) => assignment(item.agentAssignmentId, item.logicalAgentId, item.sessionId, item.role, `onboarding-${item.kind.toLowerCase()}@1.0.0`, item.artifactCycleId)))
  state.assignments.forEach((item) => { item.participationHistory = state.activities.filter((current) => current.agentAssignmentId === item.agentAssignmentId).map((current) => `${current.id}:${current.role}`) })
  if (scenario === 'normal') { state.run.functionalState = 'READY'; state.run.operationalState = 'IDLE' }
  if (scenario === 'audit' || scenario === 'conflict' || scenario === 'divergence' || scenario === 'migration' || scenario === 'adr-mutation') { state.run.functionalState = 'READY'; state.run.operationalState = 'IDLE' }
  if (scenario === 'capacity') { state.snapshot.capacitySnapshot = 'UNKNOWN · teto conservador 02'; state.run.functionalState = 'RUNNING'; state.activities[2].agentAssignmentId = 'ASN-031-C1'; state.activities[2].sessionId = 'SES-031-C1'; state.activities[2].state = 'WAITING_CAPACITY' }
  if (scenario === 'retry') { state.activities[0].state = 'COMPLETED'; state.activities[1].state = 'COMPLETED'; state.activities[2].state = 'FAILED'; state.activities[3].state = 'COMPLETED'; state.activities[4].state = 'COMPLETED'; state.activities[2].error = 'Codex CLI exit code 7 · checkpoint preservado'; state.run.functionalState = 'RUNNING' }
  if (scenario === 'rounds') { state.activities.slice(0, 3).forEach((item) => { item.state = 'COMPLETED' }); state.activities[4].state = 'COMPLETED'; state.activities[3].round = 10; state.activities[3].state = 'PAUSED'; state.run.functionalState = 'RUNNING' }
  if (scenario === 'conflict') { state.tickets[2].functionalState = 'IMPLEMENTED'; state.tickets[2].verdict = 'APPROVED'; state.tickets[3].functionalState = 'IMPLEMENTED'; state.tickets[3].verdict = 'APPROVED' }
  if (scenario === 'recovery') { state.activities[0].state = 'COMPLETED'; state.activities[1].state = 'PAUSED'; state.activities[2].state = 'COMPLETED'; state.activities[3].state = 'COMPLETED'; state.activities[4].state = 'COMPLETED'; state.run.functionalState = 'RUNNING'; state.recovery.recoveryEvidenceId = 'RECOVERY-EVIDENCE-2026-0831-01' }
  if (scenario === 'drift' || scenario === 'pr') { state.activities.forEach((item) => { item.state = 'COMPLETED' }); state.run.functionalState = 'RUNNING' }
  if (sharedScheduler) remapExecutionIdentity(state, schedulerExecutionId)
  state.assignments.forEach((item) => { item.participationHistory = state.activities.filter((current) => current.agentAssignmentId === item.agentAssignmentId && current.state === 'COMPLETED').map((current) => `${current.id}:${current.role}`); if (item.participationHistory.length > 0) { item.eligible = false; item.ineligibleReason = `participou de ${item.participationHistory[0]} no ciclo ${item.artifactCycleId}` } })
  syncExecutionAggregate(state)
  if (scenario === 'adr-mutation') { const adr = state.adrs[6]; adr.implementationStatus = 'IMPLEMENTED'; adr.actualContentHash = 'deadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef'; state.adrMutation = { blocked: true, adrId: adr.id, expectedHash: adr.contentHash, actualHash: adr.actualContentHash } }
  registerStateExecution(state, true)
  const authority = getSchedulerRegistrationAuthority(scheduler)
  const dispatchableActivities = state.activities.filter((item) => dispatchableActivityStates.includes(item.state))
  const preferredInitialActivity = dispatchableActivities.find((item) => item.id.includes('ACT-8F12'))
  ;[...(preferredInitialActivity ? [preferredInitialActivity] : []), ...dispatchableActivities.filter((item) => item !== preferredInitialActivity)].forEach((item) => enqueueSchedulerCandidate(scheduler, { executionId: schedulerExecutionId, activityId: item.id, assignmentId: item.agentAssignmentId, priority: state.run.priority, reason: item.state === 'WAITING_ELIGIBILITY' ? 'ELIGIBILITY' : item.state === 'WAITING_CAPACITY' ? 'CAPACITY' : 'READY' }, authority))
  syncSchedulerProjection(state)
  recalculateDag(state, false); syncProjections(state); assertCoherentState(state); return state
}

export function scenarioDescription(scenario: ScenarioId): string { return scenarioMessages[scenario] }
export function isSha256(value: string): boolean { return /^[a-f0-9]{64}$/i.test(value) }
export function validateAdrIntegrity(state: MockState): { valid: boolean; invalidAdrIds: string[] } {
  const expectedIds = Object.keys(ADR_HASHES)
  const presentIds = state.adrs.map((adr) => adr.id)
  const missingIds = expectedIds.filter((id) => !presentIds.includes(id))
  const unexpectedOrDuplicateIds = presentIds.filter((id, index) => !ADR_HASHES[id] || presentIds.indexOf(id) !== index)
  const invalidAdrIds = state.adrs.filter((adr) => !isSha256(adr.contentHash) || !isSha256(adr.actualContentHash) || adr.actualContentHash.toLowerCase() !== adr.contentHash.toLowerCase() || adr.contentHash.toLowerCase() !== ADR_HASHES[adr.id]?.toLowerCase()).map((adr) => adr.id)
  const allInvalidIds = [...new Set([...missingIds, ...unexpectedOrDuplicateIds, ...invalidAdrIds])]
  return { valid: allInvalidIds.length === 0 && state.adrs.length === expectedIds.length, invalidAdrIds: allInvalidIds }
}
export function eligibleAdrs(state: MockState): AdrRecord[] { return state.adrs.filter((adr) => adr.decisionStatus === 'ACCEPTED' && adr.implementationStatus === 'UNPROCESSED' && isSha256(adr.contentHash) && isSha256(adr.actualContentHash) && adr.actualContentHash.toLowerCase() === adr.contentHash.toLowerCase()) }
export function agentIsEligible(state: MockState, role: AgentRole, cycleId: string, assignmentId: string): boolean { const candidate = state.assignments.find((item) => item.agentAssignmentId === assignmentId); if (!candidate || candidate.role !== role || candidate.artifactCycleId !== cycleId || !candidate.eligible || candidate.participationHistory.length > 0) return false; return !state.assignments.some((other) => other.agentAssignmentId !== assignmentId && other.artifactCycleId === cycleId && other.logicalAgentId === candidate.logicalAgentId) }
export function reconciliationOptions(state: MockState): ReconciliationResult[] { return state.reconciliation.status === 'PENDING' && state.reconciliation.evidenceResult ? [state.reconciliation.evidenceResult] : [] }
export function commandLabel(name: CommandName): string { return labels[name] }
function reason(text: string): { ok: false; reason: string } { return { ok: false, reason: text } }
function hashesMatch(publication: Publication): boolean { return publication.baseSha === publication.currentBaseSha && publication.headSha === publication.currentHeadSha && publication.treeHash === publication.currentTreeHash }
function snapshotInputsMatch(snapshot: Snapshot): boolean { return snapshot.baseSha === snapshot.currentBaseSha && snapshot.configVersion === snapshot.currentConfigVersion && JSON.stringify(snapshot.skillVersions) === JSON.stringify(snapshot.currentSkillVersions) }
function sameStringSet(left: string[], right: string[]): boolean { return left.length === right.length && left.every((value) => right.includes(value)) }
function startInputsMatch(state: MockState): boolean {
  const integrity = validateAdrIntegrity(state)
  const currentAdrs = eligibleAdrs(state)
  const currentHashes = Object.fromEntries(currentAdrs.map((adr) => [adr.id, adr.contentHash]))
  const frozenHashesMatch = Object.keys(currentHashes).length === Object.keys(state.snapshot.adrHashes).length && Object.entries(state.snapshot.adrHashes).every(([id, hash]) => currentHashes[id]?.toLowerCase() === hash.toLowerCase())
  return integrity.valid && sameStringSet(currentAdrs.map((adr) => adr.id), state.snapshot.adrIds) && frozenHashesMatch && snapshotInputsMatch(state.snapshot) && state.repository.clean && state.repository.aligned
}

function remapExecutionIdentity(state: MockState, suffix: string): void {
  const activityIds = new Set(state.activities.map((item) => item.id))
  const assignmentIds = new Set(state.activities.map((item) => item.agentAssignmentId))
  const cycleIds = new Set(state.activities.map((item) => item.artifactCycleId))
  const onboardingActivityIds = new Set(state.onboarding.activities.map((item) => item.id))
  const onboardingAssignmentIds = new Set(state.onboarding.activities.map((item) => item.agentAssignmentId))
  const onboardingLogicalAgentIds = new Set(state.onboarding.activities.map((item) => item.logicalAgentId))
  const onboardingSessionIds = new Set(state.onboarding.activities.map((item) => item.sessionId))
  const sessionIds = new Set(state.activities.map((item) => item.sessionId))
  const onboardingCycleIds = new Set([state.onboarding.artifactCycleId, ...state.onboarding.activities.map((item) => item.artifactCycleId)])
  const specCycleIds = new Set(state.specs.map((item) => item.artifactCycleId))
  const remap = (value: string): string => `${value}-${suffix}`
  const remapActivityId = (value: string): string => activityIds.has(value) ? remap(value) : value
  const remapOnboardingActivityId = (value: string): string => onboardingActivityIds.has(value) ? remap(value) : value
  const remapAssignmentId = (value: string): string => assignmentIds.has(value) || onboardingAssignmentIds.has(value) ? remap(value) : value
  const remapLogicalAgentId = (value: string): string => onboardingLogicalAgentIds.has(value) ? remap(value) : value
  const remapSessionId = (value: string): string => sessionIds.has(value) || onboardingSessionIds.has(value) ? remap(value) : value
  const remapCycleId = (value: string): string => cycleIds.has(value) || onboardingCycleIds.has(value) || specCycleIds.has(value) ? remap(value) : value

  state.run.id = remap(state.run.id)
  state.snapshot.id = remap(state.snapshot.id)
  state.activities = state.activities.map((item) => ({ ...item, id: remap(item.id), agentAssignmentId: remap(item.agentAssignmentId), sessionId: remap(item.sessionId), artifactCycleId: remap(item.artifactCycleId), idempotencyKey: remap(item.idempotencyKey) }))
  state.assignments = state.assignments.map((item) => assignmentIds.has(item.agentAssignmentId) || onboardingAssignmentIds.has(item.agentAssignmentId) ? { ...item, agentAssignmentId: remap(item.agentAssignmentId), logicalAgentId: assignmentIds.has(item.agentAssignmentId) ? remap(item.logicalAgentId) : remapLogicalAgentId(item.logicalAgentId), sessionId: remapSessionId(item.sessionId), artifactCycleId: remapCycleId(item.artifactCycleId) } : item)
  state.onboarding = { ...state.onboarding, workspace: remap(state.onboarding.workspace), artifactCycleId: remapCycleId(state.onboarding.artifactCycleId), activities: state.onboarding.activities.map((item) => ({ ...item, id: remapOnboardingActivityId(item.id), agentAssignmentId: remapAssignmentId(item.agentAssignmentId), logicalAgentId: remapLogicalAgentId(item.logicalAgentId), sessionId: remapSessionId(item.sessionId), artifactCycleId: remapCycleId(item.artifactCycleId) })) }
  state.specs = state.specs.map((item) => ({ ...item, artifactCycleId: remapCycleId(item.artifactCycleId) }))
  state.findings = state.findings.map((item) => ({ ...item, cycleId: remapCycleId(item.cycleId), auditorAssignmentId: remapAssignmentId(item.auditorAssignmentId), remediatorAssignmentId: item.remediatorAssignmentId ? remapAssignmentId(item.remediatorAssignmentId) : undefined, reauditorAssignmentId: item.reauditorAssignmentId ? remapAssignmentId(item.reauditorAssignmentId) : undefined }))
  state.wave.integrationAuditorAssignmentId = remapAssignmentId(state.wave.integrationAuditorAssignmentId)
  state.events = state.events.map((event) => ({ ...event, id: `${event.id}-${suffix}`, target: event.target === 'RUN-2026-0831-01' ? state.run.id : event.target }))
  state.artifacts = state.artifacts.map((artifact) => ({ ...artifact, artifactId: remap(artifact.artifactId), relatedTo: artifact.relatedTo === 'RUN-2026-0831-01' ? state.run.id : artifact.relatedTo === 'ACT-8F21' ? remapActivityId('ACT-8F21') : artifact.relatedTo }))
  state.publication.conformanceRunId = remap(state.publication.conformanceRunId)
  state.publication.candidateId = candidateIdForPublication(state.publication.publicationIdentity.repository, state.publication.publicationIdentity.schedulerId, state.schedulerExecutionId, state.publication.baseSha, state.publication.headSha, state.publication.treeHash)
  state.publication.publicationIdentity = createPublicationIdentity(state.publication.publicationIdentity.repository, state.publication.publicationIdentity.schedulerId, state.schedulerExecutionId, state.publication.candidateId, state.publication.prNumber)
  if (state.publication.mergedPublicationIdentity) state.publication.mergedPublicationIdentity = createPublicationIdentity(state.publication.mergedPublicationIdentity.repository, state.publication.mergedPublicationIdentity.schedulerId, state.schedulerExecutionId, state.publication.candidateId, state.publication.prNumber)
  state.publication.remoteEvidenceId = state.publication.remoteEvidenceId ? publicationEvidenceId(state.publication, 'remote') : undefined
  state.publication.mergedRemoteEvidenceId = state.publication.mergedRemoteEvidenceId ? publicationEvidenceId(state.publication, 'merge') : undefined
  state.recovery.recoveryEvidenceId = state.recovery.recoveryEvidenceId ? remap(state.recovery.recoveryEvidenceId) : undefined
}
function mergedPublicationEvidenceMatches(publication: Publication): boolean {
  return hashesMatch(publication) && publication.queuePosition === 1 && publication.mergedCandidateId === publication.candidateId && publication.mergedPrNumber === publication.prNumber && publication.mergedBaseSha === publication.baseSha && publication.mergedHeadSha === publication.headSha && publication.mergedTreeHash === publication.treeHash && publication.mergedConformanceRunId === publication.conformanceRunId && !!publication.mergedPublicationIdentity && publication.mergedPublicationIdentity.canonicalId === publication.publicationIdentity.canonicalId && publication.mergedRemoteEvidenceId === publicationEvidenceId(publication, 'merge') && publication.approval === 'APPROVED' && publication.conformanceStatus === 'APPROVED' && publication.checks === 'PASSING' && publication.mergeable
}
function recoveryEvidenceMatches(recovery: MockState['recovery']): boolean {
  const expectedPositions = Array.from({ length: Math.max(0, recovery.replayEnd - recovery.replayStart + 1) }, (_, index) => recovery.replayStart + index)
  return recovery.checkpoint === 'event-contract-written' && recovery.checkpointSafe && recovery.replayStart > 0 && recovery.replayEnd >= recovery.replayStart && recovery.journalPosition >= recovery.replayEnd && recovery.projectionHash === 'projection-recovery-v1' && recovery.replayKey === 'replay-recovery-v1' && !!recovery.recoveryEvidenceId && recovery.recoveryEvidenceId.startsWith('RECOVERY-EVIDENCE-2026-0831-01') && JSON.stringify(recovery.journalPositions) === JSON.stringify(expectedPositions)
}
function validation(state: MockState, name: CommandName, payload?: string): { ok: boolean; reason?: string } {
  if (!schedulerRegistry.has(state.schedulerId)) return reason(`scheduler authority not found for ${state.schedulerId}`)
  const schedulerSnapshot = getSchedulerSnapshot(schedulerFor(state))
  if (name === 'VALIDATE_SNAPSHOT') { const integrity = validateAdrIntegrity(state); return state.snapshot.status === 'DRAFT' && integrity.valid && snapshotInputsMatch(state.snapshot) && state.repository.clean && state.repository.aligned ? { ok: true } : reason(`snapshot deve estar DRAFT, ADRs completas e íntegras, base/configuração/skills alinhadas e tree CLEAN/ALIGNED; divergentes: ${integrity.invalidAdrIds.join(', ') || 'inputs do snapshot'}.`) }
  if (name === 'START_RUN') return state.snapshot.status === 'READY_TO_START' && state.run.functionalState === 'READY' && startInputsMatch(state) ? { ok: true } : reason('START_RUN exige snapshot READY_TO_START e revalidação íntegra de ADRs, base, configuração, skills e repositório.')
  if (name === 'ADVANCE_NORMAL') return state.scenario === 'normal' && state.snapshot.status === 'CONFIRMED' && state.run.functionalState === 'RUNNING' && state.run.stage !== 'Publicação' && state.run.normalStep < 3 && allActivitiesCompleted(state) ? { ok: true } : reason('avanço normal exige snapshot confirmado, execução iniciada, todas as atividades concluídas e etapa ainda não publicada.')
  if (name === 'COMPLETE_ACTIVITY') { const item = state.activities.find((activity) => activity.id === payload); const ownedLease = !!item && schedulerFor(state).leases.some((lease) => lease.executionId === state.schedulerExecutionId && lease.assignmentId === item.agentAssignmentId); return state.run.functionalState === 'RUNNING' && !!item && item.state === 'RUNNING' && ownedLease ? { ok: true } : reason('conclusão exige atividade RUNNING com lease correspondente; atividades em espera não podem ser concluídas.') }
  if (name === 'REQUEST_PAUSE') return state.run.functionalState === 'RUNNING' && ['PROCESSING', 'WAITING_CAPACITY', 'PAUSE_REQUESTED'].includes(state.run.operationalState) ? { ok: true } : reason('pausa só pode ser solicitada durante processamento ou espera de capacidade.')
  if (name === 'REQUEST_RESUME') return state.run.functionalState === 'RUNNING' && ['PAUSED', 'RESUME_REQUESTED'].includes(state.run.operationalState) ? { ok: true } : reason('retomada exige pausa confirmada no checkpoint.')
  if (name === 'REQUEST_CANCEL') return state.snapshot.status === 'CONFIRMED' && state.run.functionalState === 'RUNNING' && ['PROCESSING', 'PAUSE_REQUESTED', 'PAUSED', 'WAITING_CAPACITY', 'FAILED', 'RECOVERING', 'CANCEL_REQUESTED'].includes(state.run.operationalState) && state.publication.state !== 'REMOTE_PUBLICATION_CONFIRMED' ? { ok: true } : reason('cancelamento exige execução iniciada e não concluída.')
  if (name === 'CANCEL_TICKET') { const ticket = state.tickets.find((item) => item.id === payload); return ticket && state.wave.status === 'AUDITED' && state.wave.integrationAudit === 'APPROVED' && !['COMPLETED', 'CANCELLED'].includes(ticket.functionalState) ? { ok: true } : reason('cancelamento funcional exige revisão auditada do DAG e ticket não terminal.') }
  if (name === 'SET_PRIORITY') { const priority = Number(payload); return Number.isInteger(priority) && priority >= 0 && priority <= 100 && !['COMPLETED', 'CANCELLED'].includes(state.run.functionalState) ? { ok: true } : reason('prioridade deve ser um inteiro entre 0 e 100 em execução não terminal.') }
  if (name === 'RETRY_ACTIVITY') { const item = state.activities.find((activity) => activity.state === 'FAILED'); return item && item.attempt < item.maxAttempts ? { ok: true } : reason('retry exige falha operacional e tentativa abaixo do limite.') }
  if (name === 'AUTHORIZE_ROUND') { const item = state.activities.find((activity) => activity.round >= activity.maxRounds && activity.state === 'PAUSED'); return item && item.roundExtensions < item.maxRoundExtensions ? { ok: true } : reason('autorização exige atividade pausada no limite e orçamento de rodada disponível.') }
  if (name === 'DISPATCH_ACTIVITY') { const item = dispatchActivity(state, payload); const freshLease = !!item && !schedulerFor(state).leases.some((lease) => lease.executionId === state.schedulerExecutionId && lease.assignmentId === item.agentAssignmentId); return state.snapshot.status === 'CONFIRMED' && state.run.functionalState === 'RUNNING' && schedulerSnapshot.status === 'KNOWN' && (schedulerSnapshot.available ?? 0) > 0 && !!item && freshLease && agentIsEligible(state, item.role, item.artifactCycleId, item.agentAssignmentId) ? { ok: true } : reason('despacho aguardando execução RUNNING, capacidade conhecida, lease nova e assignment novo e elegível.') }
  if (name === 'RELEASE_CAPACITY') return schedulerSnapshot.status === 'UNKNOWN' && state.run.functionalState === 'RUNNING' ? { ok: true } : reason('não há capacidade desconhecida ou execução funcional ativa a reconciliar.')
  if (name === 'REMEDIATE_FINDING') { const finding = state.findings.find((item) => item.state === 'OPEN'); return state.scenario === 'audit' && !!finding?.remediatorAssignmentId && agentIsEligible(state, 'REMEDIATOR', finding.cycleId, finding.remediatorAssignmentId) ? { ok: true } : reason('remediação exige finding aberto e remediador novo, elegível e segregado.') }
  if (name === 'REAUDIT_FINDING') return state.findings.length > 0 && state.findings.every((finding) => finding.state === 'REMEDIATED' && !!finding.reauditorAssignmentId && agentIsEligible(state, 'AUDITOR', finding.cycleId, finding.reauditorAssignmentId) && finding.reauditorAssignmentId !== finding.remediatorAssignmentId && finding.reauditorAssignmentId !== finding.auditorAssignmentId) ? { ok: true } : reason('reauditoria exige todos os findings remediados e reauditor novo, sem histórico no ciclo.')
  if (name === 'RESOLVE_CONFLICT') return state.wave.conflictStatus === 'DETECTED' && agentIsEligible(state, 'CONFLICT_RESOLVER', 'AC-021-01', 'ASN-055') ? { ok: true } : reason('conflito inexistente ou agente resolvedor não elegível.')
  if (name === 'AUDIT_INTEGRATION') return state.wave.conflictStatus === 'RESOLVED' && agentIsEligible(state, 'AUDITOR', 'AC-021-01', state.wave.integrationAuditorAssignmentId) ? { ok: true } : reason('auditoria independente exige conflito resolvido e assignment de auditor sem participação anterior.')
  if (name === 'INTEGRATE_WAVE') { const tickets = state.tickets.filter((ticket) => ticket.wave === state.wave.number); const ready = tickets.length > 0 && tickets.every((ticket) => ['IMPLEMENTED', 'COMPLETED'].includes(ticket.functionalState) && ticket.verdict === 'APPROVED'); return state.wave.status === 'AUDITED' && state.wave.integrationAudit === 'APPROVED' && ready ? { ok: true } : reason('integração exige onda auditada e todos os tickets aplicáveis aprovados.') }
  if (name === 'RECONCILE_DIVERGENCE') { const options = reconciliationOptions(state); return state.reconciliation.status === 'PENDING' && options.includes(payload as ReconciliationResult) ? { ok: true } : reason(`classificação incompatível com a evidência; opções permitidas: ${options.join(', ') || 'nenhuma'}.`) }
  if (name === 'DECIDE_DIVERGENCE') return state.reconciliation.status === 'AWAITING_DECISION' && ['AUTHORITATIVE_GIT', 'AUTHORITATIVE_DATABASE'].includes(payload ?? '') ? { ok: true } : reason('a decisão exige uma divergência classificada e uma fonte autoritativa explícita.')
  if (name === 'APPLY_DIVERGENCE_EFFECT') { const effect = payload as DivergenceCorrectiveEffect; const compatible = (state.reconciliation.decision === 'AUTHORITATIVE_GIT' && effect === 'RECONCILE_DATABASE_TO_GIT') || (state.reconciliation.decision === 'AUTHORITATIVE_DATABASE' && effect === 'RECONCILE_GIT_TO_DATABASE'); return state.reconciliation.status === 'AWAITING_EFFECT' && compatible ? { ok: true } : reason('o efeito corretivo exige decisão explícita e deve reconciliar o lado não autoritativo.') }
  if (name === 'RECOVER_CHECKPOINT') return state.recovery.status === 'NEEDS_RECOVERY' && recoveryEvidenceMatches(state.recovery) ? { ok: true } : reason('recuperação exige checkpoint conhecido, seguro, e intervalo de journal completo e compatível com a projeção.')
  if (name === 'ADVANCE_MAIN' || name === 'CHANGE_CANDIDATE') return state.run.stage === 'Publicação' && ['PUBLICATION_CANDIDATE_READY', 'AWAITING_PUBLICATION_APPROVAL', 'PR_OPEN', 'AWAITING_PR_MERGE'].includes(state.publication.state) ? { ok: true } : reason('drift só pode ser simulado na etapa de Publicação com candidato ativo.')
  if (name === 'REVALIDATE_PUBLICATION') return state.publication.state === 'INVALIDATED' ? { ok: true } : reason('revalidação só é necessária após drift detectado.')
  if (name === 'APPROVE_PUBLICATION') return allActivitiesCompleted(state) && ['PUBLICATION_CANDIDATE_READY', 'PR_OPEN'].includes(state.publication.state) && state.run.stage === 'Publicação' && state.publication.approval === 'AWAITING_PUBLICATION_APPROVAL' && state.publication.conformanceStatus === 'APPROVED' && hashesMatch(state.publication) && state.publication.checks === 'PASSING' && state.publication.queueStatus === 'QUEUED' && state.publication.queuePosition === 1 ? { ok: true } : reason('aprovação inválida: todas as atividades devem estar concluídas e fila, posição, conformidade, base, head, árvore, checks e etapa devem conferir.')
  if (name === 'LOCAL_INTEGRATE') return allActivitiesCompleted(state) && state.publication.mode === 'DIRECT_PUSH' && state.publication.state === 'LOCAL_INTEGRATION_PENDING' && state.publication.approval === 'APPROVED' && state.publication.queueStatus === 'PROCESSING' && hashesMatch(state.publication) ? { ok: true } : reason('integração local exige todas as atividades concluídas, aprovação, fila serial ativa e base/head/árvore atuais.')
  if (name === 'PUSH_REMOTE') return allActivitiesCompleted(state) && state.publication.mode === 'DIRECT_PUSH' && state.publication.state === 'LOCAL_INTEGRATION_COMPLETE' && state.publication.queueStatus === 'PROCESSING' && hashesMatch(state.publication) ? { ok: true } : reason('push exige todas as atividades concluídas, integração local, fila ativa e candidato alinhado à base/head/árvore.')
  if (name === 'MERGE_PR') return allActivitiesCompleted(state) && state.publication.mode === 'PULL_REQUEST' && state.publication.state === 'AWAITING_PR_MERGE' && state.publication.approval === 'APPROVED' && state.publication.queueStatus === 'AWAITING_MERGE' && hashesMatch(state.publication) && state.publication.checks === 'PASSING' && state.publication.mergeable ? { ok: true } : reason('PR exige todas as atividades concluídas, fila livre, árvore alinhada, merge permitido, checks e aprovação válida.')
  if (name === 'CONFIRM_REMOTE') return allActivitiesCompleted(state) && state.publication.mode === 'PULL_REQUEST' && state.publication.state === 'PR_MERGED' && state.publication.queueStatus === 'PROCESSING' && mergedPublicationEvidenceMatches(state.publication) ? { ok: true } : reason('confirmação remota exige identidade pós-merge, aprovação, checks, mergeabilidade e base/head/árvore ainda alinhados.')
  if (name === 'INSPECT_ONBOARDING') return state.onboarding.state === 'DISCOVERED' ? { ok: true } : reason('inspeção só inicia a partir de DISCOVERED.')
  if (name === 'FIX_ONBOARDING') { const item = onboardingActivity(state, 'REMEDIATION'); return state.onboarding.state === 'INSPECTING' && item.state === 'READY' && !item.participationRecorded && agentIsEligible(state, item.role, item.artifactCycleId, item.agentAssignmentId) ? { ok: true } : reason('correção exige inspeção, remediador segregado e pré-condições inválidas.') }
  if (name === 'VALIDATE_ONBOARDING') return state.onboarding.state === 'VALIDATING' && state.onboarding.clean && state.onboarding.aligned ? { ok: true } : reason('validação exige estado VALIDATING, tree limpa e alinhamento exato.')
  if (name === 'BOOTSTRAP_ONBOARDING') { const item = onboardingActivity(state, 'BOOTSTRAP'); return state.onboarding.state === 'BOOTSTRAPPING' && item.state === 'READY' && agentIsEligible(state, item.role, item.artifactCycleId, item.agentAssignmentId) ? { ok: true } : reason('bootstrap exige pré-condições validadas e assignment de bootstrap elegível; não depende de ENABLED.') }
  if (name === 'MIGRATE_ONBOARDING') { const item = onboardingActivity(state, 'MIGRATION'); return state.onboarding.state === 'MIGRATING' && item.state === 'READY' && agentIsEligible(state, item.role, item.artifactCycleId, item.agentAssignmentId) ? { ok: true } : reason('migração exige bootstrap concluído e assignment novo.') }
  if (name === 'VERIFY_ONBOARDING') { const item = onboardingActivity(state, 'AUDIT'); return state.onboarding.state === 'VERIFYING' && item.state === 'PENDING' ? { ok: true } : reason('verificação exige migração concluída.') }
  if (name === 'AUDIT_ONBOARDING') { const item = onboardingActivity(state, 'AUDIT'); const migration = onboardingActivity(state, 'MIGRATION'); const remediation = onboardingActivity(state, 'REMEDIATION'); return state.onboarding.state === 'AUDITING' && state.onboarding.auditVerdict === 'PENDING' && item.state === 'READY' && agentIsEligible(state, item.role, item.artifactCycleId, item.agentAssignmentId) && item.agentAssignmentId !== migration.agentAssignmentId && item.agentAssignmentId !== remediation.agentAssignmentId ? { ok: true } : reason('auditoria exige verificação, assignment independente e segregação de migração/remediação.') }
  if (name === 'APPROVE_ONBOARDING') return state.onboarding.state === 'AUDITING' && state.onboarding.auditVerdict === 'APPROVED' && onboardingActivity(state, 'AUDIT').state === 'COMPLETED' ? { ok: true } : reason('habilitação exige atividade de auditoria concluída e veredito formal aprovado.')
  if (name === 'ENABLE_ONBOARDING') return state.onboarding.state === 'READY_TO_ENABLE' && state.onboarding.auditVerdict === 'APPROVED' ? { ok: true } : reason('repositório não pode ser habilitado sem auditoria aprovada.')
  if (name === 'RESTORE_ADR') return state.adrMutation.blocked ? { ok: true } : reason('não há mutação de ADR implementada.')
  return { ok: true }
}

export function recalculateDag(state: MockState, recordEvent = true, transitionTarget?: string): void {
  const before = new Map(state.tickets.map((ticket) => [ticket.id, ticket.functionalState]))
  state.tickets.forEach((ticket) => {
    if (['COMPLETED', 'CANCELLED', 'IMPLEMENTED'].includes(ticket.functionalState)) return
    const dependenciesComplete = ticket.dependencies.every((dependency) => state.tickets.find((candidate) => candidate.id === dependency)?.functionalState === 'COMPLETED')
    ticket.functionalState = dependenciesComplete ? 'READY' : 'BLOCKED'
    ticket.operationalState = dependenciesComplete ? 'QUEUED' : 'WAITING_DEPENDENCY'
  })
  const newlyReleased = state.tickets.filter((ticket) => before.get(ticket.id) === 'BLOCKED' && ticket.functionalState === 'READY')
  const changed = state.tickets.some((ticket) => before.get(ticket.id) !== ticket.functionalState) || !!transitionTarget
  if (recordEvent && changed) { state.wave.dagRevision += 1; const ticket = newlyReleased[0]; if (ticket) { const completedDependency = ticket.dependencies.slice().reverse().find((dependency) => before.get(dependency) !== 'COMPLETED' && state.tickets.find((candidate) => candidate.id === dependency)?.functionalState === 'COMPLETED'); ticket.lastUnblockedBy = completedDependency ?? ticket.dependencies[ticket.dependencies.length - 1]; addEvent(state, 'dag.recalculated', 'mock-authority', ticket.id, `último bloqueio removido por ${ticket.lastUnblockedBy}`) } else addEvent(state, 'dag.recalculated', 'mock-authority', 'DAG', 'dependências recalculadas após transição funcional') }
}

function syncProjections(state: MockState): void {
  const spec = state.specs[0]
  if (state.publication.state === 'REMOTE_PUBLICATION_CONFIRMED') { spec.status = 'PUBLISHED'; spec.progress = 100; state.run.stage = 'Publicação' }
  else if (state.publication.state === 'INVALIDATED') { spec.status = 'CONFORMANCE_REQUIRED'; spec.progress = 90 }
  else if (state.findings.every((finding) => finding.state === 'APPROVED') && state.scenario === 'audit') { spec.status = 'CONFORMANCE_APPROVED'; spec.progress = 100 }
  else if (state.wave.status === 'INTEGRATED') { spec.status = 'IMPLEMENTING'; spec.progress = 88 }
  else if (state.run.stage === 'Publicação') { spec.status = 'AWAITING_PUBLICATION'; spec.progress = 90 }
  else if (state.run.functionalState === 'RUNNING') { spec.status = state.run.stage === 'Conformidade' ? 'CONFORMANCE_IN_PROGRESS' : 'IMPLEMENTING'; spec.progress = state.run.normalStep === 0 ? 72 : 72 + state.run.normalStep * 6 }
}

function applyEffect(state: MockState, command: MockCommand): void {
  const { name, payload } = command
  if (name === 'VALIDATE_SNAPSHOT') { state.snapshot.status = 'READY_TO_START'; state.snapshot.adrIds = eligibleAdrs(state).map((adr) => adr.id); state.snapshot.adrHashes = Object.fromEntries(eligibleAdrs(state).map((adr) => [adr.id, adr.contentHash])); addEvent(state, 'snapshot.validated', 'mock-authority', state.snapshot.id, 'ADR authority, base, config and contracts frozen') }
  if (name === 'START_RUN') { state.snapshot.status = 'CONFIRMED'; state.snapshot.lockedAtEvent = eventIdentity(state, state.events.length + 1); state.run.functionalState = 'RUNNING'; state.run.operationalState = 'PROCESSING'; state.run.stage = 'Implementação'; const firstDispatchable = state.activities.find((item) => item.id.includes('ACT-8F12') && dispatchableActivityStates.includes(item.state)) ?? state.activities.find((item) => dispatchableActivityStates.includes(item.state)); dispatchAvailableActivities(state, firstDispatchable?.id); addEvent(state, 'run.started', 'mock-authority', state.run.id, 'snapshot confirmed; scheduler represented every eligible candidate and dispatched only within confirmed capacity') }
  if (name === 'ADVANCE_NORMAL') { state.run.normalStep += 1; state.run.stage = state.run.normalStep >= 3 ? 'Publicação' : state.run.normalStep === 2 ? 'Conformidade' : 'Implementação'; if (state.run.stage === 'Publicação') { state.publication.state = 'PUBLICATION_CANDIDATE_READY'; state.publication.conformanceStatus = 'APPROVED' }; addEvent(state, 'workflow.advanced', 'mock-authority', state.run.id, `deterministic normal step ${state.run.normalStep}; publication gate remains required`) }
  if (name === 'COMPLETE_ACTIVITY') completeActivity(state, payload ?? '')
  if (name === 'REQUEST_PAUSE') { state.run.operationalState = 'PAUSED'; state.activities.forEach((item) => { if (item.state === 'RUNNING') item.state = 'PAUSED' }); addEvent(state, 'checkpoint.confirmed', 'mock-authority', state.run.id, 'pause requested and cooperatively confirmed at safe checkpoint') }
  if (name === 'REQUEST_RESUME') { state.run.operationalState = 'PROCESSING'; state.activities.forEach((item) => { if (item.state === 'PAUSED') { if (executionOwnsLease(state, item.agentAssignmentId)) item.state = 'RUNNING'; else markWaitingForCapacity(state, item) } }); dispatchAvailableActivities(state); addEvent(state, 'checkpoint.resumed', 'mock-authority', state.run.id, 'resume requested and confirmed from safe checkpoint; scheduler retained lease invariant') }
  if (name === 'REQUEST_CANCEL') { releaseAllCapacity(state); state.run.functionalState = 'CANCELLED'; state.run.operationalState = 'CANCELLED'; state.activities.forEach((item) => { if (item.state !== 'COMPLETED') item.state = 'PAUSED' }); recalculateDag(state); addEvent(state, 'run.cancelled', 'mock-authority', state.run.id, 'cooperative cancellation confirmed; leases released and functional ticket states preserved') }
  if (name === 'CANCEL_TICKET') { const ticket = state.tickets.find((item) => item.id === payload); if (ticket) { ticket.functionalState = 'CANCELLED'; ticket.operationalState = 'IDLE'; recalculateDag(state, true, ticket.id); addEvent(state, 'ticket.cancelled', 'mock-authority', ticket.id, 'functional cancellation confirmed after audited DAG review') } }
  if (name === 'SET_PRIORITY') { state.run.priority = Number(payload); const scheduler = schedulerFor(state); const canonical = schedulerState(scheduler); canonical.queue.filter((item) => item.executionId === state.schedulerExecutionId).forEach((item) => { item.priority = state.run.priority }); canonical.revision += 1; syncSchedulerProjection(state); addEvent(state, 'priority.changed', 'human', state.run.id, `priority confirmed at ${state.run.priority}; scheduler score updated for queued candidates`) }
  if (name === 'RETRY_ACTIVITY') { const item = state.activities.find((activity) => activity.state === 'FAILED'); if (item) { const nextAssignmentId = `${item.agentAssignmentId}-R${item.attempt + 1}`; const nextSessionId = `${item.sessionId}-R${item.attempt + 1}`; state.assignments.push(assignment(nextAssignmentId, `${item.agentAssignmentId}-logical-${item.attempt + 1}`, nextSessionId, item.role, `${item.skill}@${item.version}`, item.artifactCycleId)); item.attempt += 1; item.agentAssignmentId = nextAssignmentId; item.sessionId = nextSessionId; item.state = 'READY'; item.error = undefined; item.checkpoint = item.safeCheckpoint; state.run.operationalState = 'PROCESSING'; registerStateExecution(state, true); if (dispatchAvailableActivities(state, item.id) === 0) markWaitingForCapacity(state, item); addEvent(state, 'activity.retry.confirmed', 'mock-authority', item.id, `new isolated assignment ${nextAssignmentId}; same idempotency key ${item.idempotencyKey}; attempt ${item.attempt}/${item.maxAttempts}`) } }
  if (name === 'AUTHORIZE_ROUND') { const item = state.activities.find((activity) => activity.round >= activity.maxRounds && activity.state === 'PAUSED'); if (item) { item.round += 1; item.roundExtensions += 1; if (executionOwnsLease(state, item.agentAssignmentId)) item.state = 'RUNNING'; else markWaitingForCapacity(state, item); state.run.operationalState = 'PROCESSING'; dispatchAvailableActivities(state); addEvent(state, 'round.authorized', 'human', item.id, `human authorization released round ${item.round}; extension ${item.roundExtensions}/${item.maxRoundExtensions}`) } }
  if (name === 'DISPATCH_ACTIVITY') dispatchAvailableActivities(state, payload)
  if (name === 'RELEASE_CAPACITY') { const scheduler = schedulerFor(state); reconcileSchedulerCapacity(scheduler, { status: 'KNOWN', maximum: 5, conservativeCeiling: 2 }, getSchedulerRegistrationAuthority(scheduler)); syncSchedulerProjection(state); dispatchAvailableActivities(state); state.run.operationalState = 'PROCESSING'; addEvent(state, 'capacity.reconciled', 'scheduler', 'capacity-pool', 'conservative ceiling confirmed; canonical global queue reevaluated and waiting work dispatched') }
  if (name === 'REMEDIATE_FINDING') { const finding = state.findings.find((item) => item.state === 'OPEN'); if (finding && finding.remediatorAssignmentId) { const activityId = `ACT-REMEDIATE-${finding.id}`; state.activities.push(activity(activityId, `Remediação ${finding.id}`, finding.remediatorAssignmentId, state.assignments.find((item) => item.agentAssignmentId === finding.remediatorAssignmentId)?.sessionId ?? `SES-${finding.remediatorAssignmentId}`, 'REMEDIATOR', finding.cycleId, 'COMPLETED')); recordParticipation(state, finding.remediatorAssignmentId, activityId, 'REMEDIATOR'); registerStateExecution(state, true); finding.state = 'REMEDIATED'; addEvent(state, 'finding.remediation.participation.recorded', 'agent', finding.id, `new isolated remediation activity ${activityId} completed by ${finding.remediatorAssignmentId}`); addEvent(state, 'finding.remediated', 'agent', finding.id, `remediation completed by ${finding.remediatorAssignmentId}`) } }
  if (name === 'REAUDIT_FINDING') { state.findings.forEach((finding) => { if (finding.state === 'REMEDIATED' && finding.reauditorAssignmentId) { const activityId = `ACT-REAUDIT-${finding.id}`; state.activities.push(activity(activityId, `Reauditoria ${finding.id}`, finding.reauditorAssignmentId, state.assignments.find((item) => item.agentAssignmentId === finding.reauditorAssignmentId)?.sessionId ?? `SES-${finding.reauditorAssignmentId}`, 'AUDITOR', finding.cycleId, 'COMPLETED')); recordParticipation(state, finding.reauditorAssignmentId, activityId, 'AUDITOR'); finding.state = 'APPROVED'; addEvent(state, 'finding.reaudit.participation.recorded', 'agent', finding.id, `new isolated reauditor activity ${activityId} completed by ${finding.reauditorAssignmentId}`) } }); addEvent(state, 'finding.reaudited', 'agent', state.specs[0].id, 'independent reauditor approved remediated artifacts') }
  if (name === 'RESOLVE_CONFLICT') { state.wave.conflictStatus = 'RESOLVED'; state.wave.status = 'RESOLVED'; addEvent(state, 'integration.conflict.resolved', 'agent', `WAVE-${state.wave.number}`, 'exclusive conflict resolver produced a candidate') }
  if (name === 'AUDIT_INTEGRATION') { state.wave.status = 'AUDITED'; state.wave.integrationAudit = 'APPROVED'; addEvent(state, 'integration.audited', 'agent', `WAVE-${state.wave.number}`, 'independent integration audit approved') }
  if (name === 'INTEGRATE_WAVE') { state.wave.status = 'INTEGRATED'; state.tickets.filter((ticket) => ticket.wave === state.wave.number).forEach((ticket) => { ticket.functionalState = 'COMPLETED'; ticket.operationalState = 'IDLE' }); recalculateDag(state); addEvent(state, 'wave.integrated', 'mock-authority', `WAVE-${state.wave.number}`, 'all applicable tickets approved; DAG recalculated from completed dependencies') }
  if (name === 'RECONCILE_DIVERGENCE') { state.reconciliation.result = payload as ReconciliationResult; state.reconciliation.status = 'AWAITING_DECISION'; addEvent(state, 'reconciliation.classified', 'human', 'SPEC-020', `${payload} classified from correlated evidence; intervention remains required`) }
  if (name === 'DECIDE_DIVERGENCE') { state.reconciliation.decision = payload as DivergenceDecision; state.reconciliation.status = 'AWAITING_EFFECT'; addEvent(state, 'reconciliation.decision.recorded', 'human', 'SPEC-020', `${payload} selected as the authoritative state; corrective effect remains pending`) }
  if (name === 'APPLY_DIVERGENCE_EFFECT') { state.reconciliation.correctiveEffect = payload as DivergenceCorrectiveEffect; state.reconciliation.status = 'RESOLVED'; addEvent(state, 'reconciliation.effect.confirmed', 'mock-authority', 'SPEC-020', `${payload} applied and correlated evidence reconciled`); addEvent(state, 'reconciliation.confirmed', 'mock-authority', 'SPEC-020', 'semantic divergence resolved only after decision and corrective effect') }
  if (name === 'RECOVER_CHECKPOINT') { const evidenceId = state.recovery.recoveryEvidenceId; state.recovery.status = 'RECOVERED'; state.recovery.replayedEvents = state.recovery.replayEnd - state.recovery.replayStart + 1; state.run.operationalState = 'PROCESSING'; const recovered = state.activities[1]; if (executionOwnsLease(state, recovered.agentAssignmentId)) recovered.state = 'RUNNING'; else markWaitingForCapacity(state, recovered); dispatchAvailableActivities(state); addEvent(state, 'recovery.confirmed', 'mock-authority', state.recovery.checkpoint, `projection rebuilt from journal positions ${state.recovery.replayStart}-${state.recovery.replayEnd} using ${state.recovery.replayKey} and evidence ${evidenceId}`) }
  if (name === 'ADVANCE_MAIN') { state.publication.currentBaseSha = '8d1b0ff9e1c2b7a1c554b88c0e0d31e96d5d0b11'; state.publication.approval = 'INVALIDATED'; state.publication.conformanceStatus = 'INVALIDATED'; state.publication.state = 'INVALIDATED'; state.publication.queueStatus = 'QUEUED'; addEvent(state, 'publication.invalidated', 'mock-authority', 'SPEC-021', 'main changed; prior approval no longer matches base SHA') }
  if (name === 'CHANGE_CANDIDATE') { state.publication.currentHeadSha = '9a22f2a8c7d6e5f40392817a6b5c4d3e2f1a0987'; state.publication.currentTreeHash = 'c04d77ef33aa11bb22cc33dd44ee55ff66778899'; state.publication.candidateId = candidateIdForPublication(state.publication.publicationIdentity.repository, state.publication.publicationIdentity.schedulerId, state.schedulerExecutionId, state.publication.currentBaseSha, state.publication.currentHeadSha, state.publication.currentTreeHash); state.publication.publicationIdentity = createPublicationIdentity(state.publication.publicationIdentity.repository, state.publication.publicationIdentity.schedulerId, state.schedulerExecutionId, state.publication.candidateId, state.publication.prNumber); state.publication.remoteEvidenceId = undefined; state.publication.mergedCandidateId = undefined; state.publication.mergedPrNumber = undefined; state.publication.mergedBaseSha = undefined; state.publication.mergedHeadSha = undefined; state.publication.mergedTreeHash = undefined; state.publication.mergedConformanceRunId = undefined; state.publication.mergedRemoteEvidenceId = undefined; state.publication.mergedPublicationIdentity = undefined; state.publication.approval = 'INVALIDATED'; state.publication.conformanceStatus = 'INVALIDATED'; state.publication.state = 'INVALIDATED'; state.publication.queueStatus = 'QUEUED'; addEvent(state, 'publication.invalidated', 'mock-authority', state.publication.candidateId, 'candidate head/tree changed; a new candidate and persistent publication identity invalidated prior evidence') }
  if (name === 'REVALIDATE_PUBLICATION') { state.publication.baseSha = state.publication.currentBaseSha; state.publication.headSha = state.publication.currentHeadSha; state.publication.treeHash = state.publication.currentTreeHash; const canonicalCandidateId = candidateIdForPublication(state.publication.publicationIdentity.repository, state.publication.publicationIdentity.schedulerId, state.schedulerExecutionId, state.publication.baseSha, state.publication.headSha, state.publication.treeHash); if (state.publication.candidateId !== canonicalCandidateId || state.publication.publicationIdentity.candidateId !== canonicalCandidateId) { state.publication.candidateId = canonicalCandidateId; state.publication.publicationIdentity = createPublicationIdentity(state.publication.publicationIdentity.repository, state.publication.publicationIdentity.schedulerId, state.schedulerExecutionId, canonicalCandidateId, state.publication.prNumber); state.publication.remoteEvidenceId = undefined; state.publication.mergedCandidateId = undefined; state.publication.mergedPrNumber = undefined; state.publication.mergedBaseSha = undefined; state.publication.mergedHeadSha = undefined; state.publication.mergedTreeHash = undefined; state.publication.mergedConformanceRunId = undefined; state.publication.mergedRemoteEvidenceId = undefined; state.publication.mergedPublicationIdentity = undefined } state.publication.conformanceRunId = scopedIdentity(state, `CONF-2026-0831-${state.events.length + 1}`); state.publication.conformanceStatus = 'APPROVED'; state.publication.approval = 'AWAITING_PUBLICATION_APPROVAL'; state.publication.state = state.publication.mode === 'PULL_REQUEST' ? 'PR_OPEN' : 'PUBLICATION_CANDIDATE_READY'; state.publication.queueStatus = 'QUEUED'; addEvent(state, 'publication.revalidated', 'mock-authority', state.publication.candidateId, 'new conformance run bound to current canonical candidate head/tree identity') }
  if (name === 'APPROVE_PUBLICATION') { state.publication.approval = 'APPROVED'; state.publication.state = state.publication.mode === 'PULL_REQUEST' ? 'AWAITING_PR_MERGE' : 'LOCAL_INTEGRATION_PENDING'; state.publication.queueStatus = state.publication.mode === 'PULL_REQUEST' ? 'AWAITING_MERGE' : 'PROCESSING'; addEvent(state, 'publication.approval.confirmed', 'human', state.publication.candidateId, 'human approval recorded; exclusive serial publication queue acquired') }
  if (name === 'LOCAL_INTEGRATE') { state.publication.state = 'LOCAL_INTEGRATION_COMPLETE'; state.publication.localMergeSha = 'merge-5c91f2a8'; addEvent(state, 'local.integration.confirmed', 'mock-authority', 'main', 'SPEC branch merged locally without rebase or force-push') }
  if (name === 'PUSH_REMOTE') { state.publication.state = 'REMOTE_PUBLICATION_CONFIRMED'; state.publication.queueStatus = 'CONFIRMED'; state.publication.remoteEvidenceId = publicationEvidenceId(state.publication, 'remote'); releaseAllCapacity(state); state.run.functionalState = 'COMPLETED'; state.run.operationalState = 'COMPLETED'; addEvent(state, 'remote.publication.confirmed', 'mock-authority', 'origin/main', 'controlled idempotent push confirmed by remote evidence bound to the canonical publication identity; completed activities and leases reconciled') }
  if (name === 'MERGE_PR') { state.publication.state = 'PR_MERGED'; state.publication.queueStatus = 'PROCESSING'; state.publication.mergedCandidateId = state.publication.candidateId; state.publication.mergedPrNumber = state.publication.prNumber; state.publication.mergedBaseSha = state.publication.baseSha; state.publication.mergedHeadSha = state.publication.headSha; state.publication.mergedTreeHash = state.publication.treeHash; state.publication.mergedConformanceRunId = state.publication.conformanceRunId; state.publication.mergedPublicationIdentity = { ...state.publication.publicationIdentity }; state.publication.mergedRemoteEvidenceId = publicationEvidenceId(state.publication, 'merge'); addEvent(state, 'pr.merged', 'mock-authority', state.publication.publicationIdentity.canonicalId, 'serial queue merge matched the canonical publication identity, conformance run, remote evidence and base/head/tree') }
  if (name === 'CONFIRM_REMOTE') { state.publication.state = 'REMOTE_PUBLICATION_CONFIRMED'; state.publication.queueStatus = 'CONFIRMED'; state.publication.remoteEvidenceId = publicationEvidenceId(state.publication, 'remote'); releaseAllCapacity(state); state.run.functionalState = 'COMPLETED'; state.run.operationalState = 'COMPLETED'; addEvent(state, 'remote.publication.confirmed', 'mock-authority', 'origin/main', 'remote ref reconciled through the canonical publication identity; completed activities and leases reconciled') }
  if (name === 'INSPECT_ONBOARDING') { state.onboarding.state = 'INSPECTING'; addEvent(state, 'onboarding.inspected', 'mock-authority', state.onboarding.repository, 'legacy repository discovered and inspected before bootstrap') }
  if (name === 'FIX_ONBOARDING') { completeOnboardingActivity(state, 'REMEDIATION'); state.onboarding.clean = true; state.onboarding.aligned = true; state.onboarding.state = 'VALIDATING'; addEvent(state, 'onboarding.remediation.completed', 'agent', state.onboarding.repository, 'isolated remediation activity fixed candidate workspace') }
  if (name === 'VALIDATE_ONBOARDING') { state.onboarding.state = 'BOOTSTRAPPING'; onboardingActivity(state, 'BOOTSTRAP').state = 'READY'; addEvent(state, 'onboarding.validated', 'mock-authority', state.onboarding.repository, 'bootstrap catalog validated candidate configuration') }
  if (name === 'BOOTSTRAP_ONBOARDING') { completeOnboardingActivity(state, 'BOOTSTRAP'); state.onboarding.state = 'MIGRATING'; onboardingActivity(state, 'MIGRATION').state = 'READY'; addEvent(state, 'onboarding.bootstrapped', 'agent', state.onboarding.workspace, 'isolated bootstrap activity completed independently of ENABLED state') }
  if (name === 'MIGRATE_ONBOARDING') { completeOnboardingActivity(state, 'MIGRATION'); state.onboarding.state = 'VERIFYING'; addEvent(state, 'onboarding.migrated', 'agent', state.onboarding.repository, 'isolated migration activity completed in candidate workspace') }
  if (name === 'VERIFY_ONBOARDING') { state.onboarding.state = 'AUDITING'; onboardingActivity(state, 'AUDIT').state = 'READY'; addEvent(state, 'onboarding.verified', 'mock-authority', state.onboarding.repository, 'migration verification evidence recorded for independent audit') }
  if (name === 'AUDIT_ONBOARDING') { completeOnboardingActivity(state, 'AUDIT'); state.onboarding.auditVerdict = 'APPROVED'; addEvent(state, 'onboarding.audit.approved', 'agent', state.onboarding.repository, 'independent audit activity approved the migrated candidate') }
  if (name === 'APPROVE_ONBOARDING') { state.onboarding.state = 'READY_TO_ENABLE'; addEvent(state, 'onboarding.ready', 'mock-authority', state.onboarding.repository, 'formal audit verdict permits atomic promotion') }
  if (name === 'ENABLE_ONBOARDING') { state.onboarding.state = 'ENABLED'; addEvent(state, 'repository.enabled', 'mock-authority', state.onboarding.repository, 'candidate configuration promoted atomically') }
  if (name === 'RESTORE_ADR') { const adr = state.adrs.find((item) => item.id === state.adrMutation.adrId); if (adr) { adr.actualContentHash = adr.contentHash; adr.implementationStatus = 'IMPLEMENTED' }; state.adrMutation.blocked = false; state.adrMutation.actualHash = state.adrMutation.expectedHash; state.snapshot.status = 'DRAFT'; addEvent(state, 'adr.integrity.restored', 'human', state.adrMutation.adrId, 'processing remains gated until snapshot is revalidated') }
  if (name === 'EXPORT_EVIDENCE' && !state.artifacts.some((item) => item.name === 'run-export-2026-0831.zip')) { state.artifacts.push({ artifactId: scopedIdentity(state, 'ART-EXPORT-0001'), name: 'run-export-2026-0831.zip', type: 'Exportação', hash: 'export-0001', relatedTo: state.run.id, retained: true }); addEvent(state, 'evidence.export.confirmed', 'mock-authority', state.run.id, 'database projection, journal and external evidence packaged') }
  syncExecutionAggregate(state)
  registerStateExecution(state)
  refreshSchedulerQueueReasons(schedulerFor(state))
  syncSchedulerProjection(state)
  syncProjections(state)
  assertCoherentState(state)
}

export function canExecute(state: MockState, name: CommandName, payload?: string): { allowed: boolean; reason: string } { const result = validation(state, name, payload); return { allowed: result.ok, reason: result.reason ?? '' } }
export function requestCommand(state: MockState, name: CommandName, detail = '', payload?: string): MockState { const next = clone(state); const sequence = next.nextCommandId++; const command: MockCommand = { id: scopedIdentity(next, `CMD-${String(sequence).padStart(4, '0')}`), correlationId: scopedIdentity(next, `CORR-${String(sequence).padStart(4, '0')}`), name, label: commandLabel(name), detail: detail || scenarioMessages[next.scenario], payload, status: 'requested', effectStatus: 'none', requestedAt: timeFor(next.events.length + next.commands.length) }; next.commands.unshift(command); addEvent(next, 'command.requested', 'human', command.name, command.detail); return next }
export function advanceCommand(state: MockState, commandId: string): MockState { const next = clone(state); const command = next.commands.find((item) => item.id === commandId); if (!command) return next; if (command.status === 'requested') { const result = validation(next, command.name, command.payload); if (!result.ok) { command.status = 'rejected'; command.rejectionReason = result.reason; addEvent(next, 'command.rejected', 'mock-authority', command.name, result.reason ?? 'precondition rejected'); return next } command.status = 'accepted'; command.effectStatus = 'pending'; command.acceptedAt = timeFor(next.events.length + 1); if (command.name === 'REQUEST_PAUSE') next.run.operationalState = 'PAUSE_REQUESTED'; if (command.name === 'REQUEST_RESUME') next.run.operationalState = 'RESUME_REQUESTED'; if (command.name === 'REQUEST_CANCEL') next.run.operationalState = 'CANCEL_REQUESTED'; addEvent(next, 'command.accepted', 'mock-authority', command.name, 'preconditions valid; effect pending'); return next } if (command.status === 'accepted' && command.effectStatus === 'pending') { const result = validation(next, command.name, command.payload); if (!result.ok) { command.status = 'rejected'; command.effectStatus = 'none'; command.rejectionReason = `estado mudou antes da confirmação: ${result.reason}`; addEvent(next, 'command.rejected', 'mock-authority', command.name, command.rejectionReason); return next } applyEffect(next, command); command.status = 'confirmed'; command.effectStatus = 'confirmed'; command.confirmedAt = timeFor(next.events.length + 1) } return next }
export function runCommandToCompletion(state: MockState, name: CommandName, detail = '', payload?: string): MockState { let next = requestCommand(state, name, detail, payload); const id = next.commands[0].id; next = advanceCommand(next, id); return advanceCommand(next, id) }
