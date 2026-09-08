import assert from 'node:assert/strict'
import test from 'node:test'
import {
  ADR_HASHES,
  MockState,
  SchedulerCandidate,
  SchedulerExecutionRecord,
  agentIsEligible,
  advanceCommand,
  assertCapacityCoherent,
  canExecute,
  acquireSchedulerLease as acquireSchedulerLeaseCanonical,
  createScenarioState,
  createCanonicalSchedulerFixture,
  createCanonicalSchedulerExecutionRegistration,
  createMockScheduler,
  getSchedulerForState,
  getSchedulerRegistrationAuthority,
  eligibleAdrs,
  enqueueSchedulerCandidate as enqueueSchedulerCandidateCanonical,
  getSchedulerSnapshot,
  releaseSchedulerLease as releaseSchedulerLeaseCanonical,
  reconcileSchedulerCapacity,
  reconciliationOptions,
  reevaluateScheduler as reevaluateSchedulerCanonical,
  registerSchedulerExecution,
  updateSchedulerExecutionRegistration,
  requestCommand,
  runCommandToCompletion,
  selectNextSchedulerCandidate,
  validateAdrIntegrity,
} from '../src/mockDomain.ts'

function completeAllActivities(state: MockState): MockState {
  let next = state
  while (next.activities.some((item) => item.state !== 'COMPLETED')) {
    const running = next.activities.find((item) => item.state === 'RUNNING')
    assert.ok(running, 'scheduler must expose a running activity before completion')
    next = runCommandToCompletion(next, 'COMPLETE_ACTIVITY', 'confirmed operational effect', running.id)
    assert.equal(next.commands[0].status, 'confirmed')
  }
  return next
}

const schedulerFixtures = new WeakMap<object, ReturnType<typeof createCanonicalSchedulerFixture>>()
function registerSchedulerCandidates(scheduler: ReturnType<typeof createMockScheduler>, candidates: Array<{ executionId: string; activityId: string; assignmentId: string; reason?: 'READY' | 'CAPACITY' | 'ELIGIBILITY' }>): void {
  const authority = getSchedulerRegistrationAuthority(scheduler)
  candidates.forEach((candidate) => {
    let registration = schedulerFixtures.get(candidate)
    if (!registration) { registration = createCanonicalSchedulerFixture(scheduler, candidate.executionId, candidate.activityId, candidate.assignmentId, candidate.reason !== 'ELIGIBILITY'); schedulerFixtures.set(candidate, registration) }
    Object.assign(candidate, { executionId: registration.executionId, activityId: registration.activities[0].activityId, assignmentId: registration.activities[0].assignmentId })
    if (!scheduler.executionActivities[registration.executionId]) registerSchedulerExecution(scheduler, registration, authority)
  })
}

const schedulerAuthority = (scheduler: ReturnType<typeof createMockScheduler>) => getSchedulerRegistrationAuthority(scheduler)
const enqueueSchedulerCandidate = (scheduler: ReturnType<typeof createMockScheduler>, candidate: Parameters<typeof enqueueSchedulerCandidateCanonical>[1]) => enqueueSchedulerCandidateCanonical(scheduler, candidate, schedulerAuthority(scheduler))
const acquireSchedulerLease = (scheduler: ReturnType<typeof createMockScheduler>, candidate: Parameters<typeof acquireSchedulerLeaseCanonical>[1]) => acquireSchedulerLeaseCanonical(scheduler, candidate, schedulerAuthority(scheduler))
const releaseSchedulerLease = (scheduler: ReturnType<typeof createMockScheduler>, lease: Parameters<typeof releaseSchedulerLeaseCanonical>[1]) => releaseSchedulerLeaseCanonical(scheduler, lease, schedulerAuthority(scheduler))
const reevaluateScheduler = (scheduler: ReturnType<typeof createMockScheduler>) => reevaluateSchedulerCanonical(scheduler, schedulerAuthority(scheduler))

test('rejeita transição inválida sem fabricar efeito', () => {
  const initial = createScenarioState('normal')
  const rejected = runCommandToCompletion(initial, 'START_RUN')

  assert.equal(rejected.run.operationalState, 'IDLE')
  assert.equal(rejected.snapshot.status, 'DRAFT')
  assert.equal(rejected.commands[0].status, 'rejected')
  assert.match(rejected.commands[0].rejectionReason ?? '', /snapshot/i)
  assert.ok(rejected.events.some((event) => event.type === 'command.rejected'))
})

test('cada mutador produtivo exige a capability canônica exata do scheduler', () => {
  const schedulerA = createMockScheduler({ maximum: 1, initialUsed: 0 })
  const schedulerB = createMockScheduler({ maximum: 1, initialUsed: 0 })
  const authorityA = getSchedulerRegistrationAuthority(schedulerA)
  const registration = createCanonicalSchedulerFixture(schedulerA, 'CAPABILITY-A', 'ACT-CAPABILITY-A', 'ASN-CAPABILITY-A')
  registerSchedulerExecution(schedulerA, registration, authorityA)
  const candidate = enqueueSchedulerCandidateCanonical(schedulerA, { executionId: registration.executionId, activityId: 'ACT-CAPABILITY-A', assignmentId: 'ASN-CAPABILITY-A', priority: 1, reason: 'READY' }, authorityA)!
  assert.throws(() => enqueueSchedulerCandidateCanonical(schedulerA, candidate), /capability/i)
  assert.throws(() => enqueueSchedulerCandidateCanonical(schedulerA, candidate, getSchedulerRegistrationAuthority(schedulerB)), /capability/i)
  assert.throws(() => acquireSchedulerLeaseCanonical(schedulerA, candidate, getSchedulerRegistrationAuthority(schedulerB)), /capability/i)
  assert.throws(() => releaseSchedulerLeaseCanonical(schedulerA, { leaseId: 'LEASE-DOES-NOT-EXIST', executionId: 'RUN-CAPABILITY-A', activityId: 'ACT-CAPABILITY-A', assignmentId: 'ASN-CAPABILITY-A' }, getSchedulerRegistrationAuthority(schedulerB)), /capability/i)
  assert.throws(() => reevaluateSchedulerCanonical(schedulerA), /capability/i)
})

test('projeções do scheduler são profundamente imutáveis e não alteram a autoridade', () => {
  const scheduler = createMockScheduler({ maximum: 1, initialUsed: 0 })
  const authority = getSchedulerRegistrationAuthority(scheduler)
  const registration = createCanonicalSchedulerFixture(scheduler, 'PROJECTION-A', 'ACT-PROJECTION-A', 'ASN-PROJECTION-A')
  registerSchedulerExecution(scheduler, registration, authority)
  enqueueSchedulerCandidateCanonical(scheduler, { executionId: registration.executionId, activityId: 'ACT-PROJECTION-A', assignmentId: 'ASN-PROJECTION-A', priority: 1, reason: 'READY' }, authority)
  const before = getSchedulerSnapshot(scheduler)
  assert.throws(() => (scheduler.queue as SchedulerCandidate[]).pop(), /cannot delete|read only|frozen/i)
  assert.throws(() => { (scheduler.executionActivities as Record<string, SchedulerExecutionRecord>)[registration.executionId].operationalState = 'PAUSED' }, /read only|frozen/i)
  assert.deepEqual(getSchedulerSnapshot(scheduler), before)
})

test('registro rejeita lifecycle, identidade e ownership inválidos atomicamente', () => {
  const scheduler = createMockScheduler({ maximum: 2, initialUsed: 0 })
  const authority = getSchedulerRegistrationAuthority(scheduler)
  const registration = createCanonicalSchedulerFixture(scheduler, 'REGISTRATION-BASE', 'ACT-REGISTRATION-BASE', 'ASN-REGISTRATION-BASE')
  const invalids = [
    { snapshotStatus: 'NOT_A_STATUS' }, { functionalState: 'NOT_A_FUNCTIONAL_STATE' }, { operationalState: 'NOT_A_OPERATIONAL_STATE' },
    { activities: [{ ...registration.activities[0], state: 'NOT_A_STATE' }] }, { activities: [{ ...registration.activities[0], activityId: 'ARBITRARY-ACTIVITY' }] },
    { activities: [{ ...registration.activities[0], assignmentId: 'ARBITRARY-ASSIGNMENT' }] }, { activities: [{ ...registration.activities[0], role: 'NOT_A_ROLE' }] },
  ]
  invalids.forEach((change, index) => {
    const before = getSchedulerSnapshot(scheduler)
    const revision = scheduler.revision
    const invalid = { ...registration, executionId: `RUN-REGISTRATION-INVALID-${index}`, ...change } as never
    assert.throws(() => registerSchedulerExecution(scheduler, invalid, authority), /invalid|canonical|identity|ownership/i)
    assert.deepEqual(getSchedulerSnapshot(scheduler), before)
    assert.equal(scheduler.revision, revision)
  })
  registerSchedulerExecution(scheduler, registration, authority)
  const revision = scheduler.revision
  registerSchedulerExecution(scheduler, registration, authority)
  assert.equal(scheduler.revision, revision)
  assert.throws(() => registerSchedulerExecution(scheduler, { ...registration, runId: 'RUN-REGISTRATION-ALTERED' }, authority), /identity|immutable|registered|provenance/i)
  assert.throws(() => registerSchedulerExecution(scheduler, { ...registration, activities: [{ ...registration.activities[0], assignmentId: 'ASN-REGISTRATION-SUBSTITUTED' }] }, authority), /identity|immutable|registered|provenance/i)
})

test('política de lifecycle rejeita regressão e atualiza a elegibilidade da fila atomicamente', () => {
  const scheduler = createMockScheduler({ maximum: 1, initialUsed: 0 })
  const authority = getSchedulerRegistrationAuthority(scheduler)
  const registration = createCanonicalSchedulerFixture(scheduler, 'LIFECYCLE-A', 'ACT-LIFECYCLE-A', 'ASN-LIFECYCLE-A')
  registerSchedulerExecution(scheduler, registration, authority)
  enqueueSchedulerCandidateCanonical(scheduler, { executionId: registration.executionId, activityId: 'ACT-LIFECYCLE-A', assignmentId: 'ASN-LIFECYCLE-A', priority: 1, reason: 'READY' }, authority)
  const revision = scheduler.revision
  assert.throws(() => updateSchedulerExecutionRegistration(scheduler, { executionId: registration.executionId, snapshotStatus: 'CONFIRMED', functionalState: 'READY', operationalState: 'IDLE' }, authority), /illegal/i)
  assert.equal(scheduler.revision, revision)
  updateSchedulerExecutionRegistration(scheduler, { executionId: registration.executionId, snapshotStatus: 'CONFIRMED', functionalState: 'RUNNING', operationalState: 'PAUSED' }, authority)
  assert.equal(scheduler.queue[0].reason, 'ELIGIBILITY')
  updateSchedulerExecutionRegistration(scheduler, { executionId: registration.executionId, snapshotStatus: 'CONFIRMED', functionalState: 'RUNNING', operationalState: 'PROCESSING' }, authority)
  assert.equal(scheduler.queue[0].reason, 'READY')
})

test('SYSTEM reservations são canônicas, protegidas e preservadas no cleanup terminal', () => {
  assert.throws(() => createMockScheduler({ maximum: 1, initialUsed: 1, systemReservationAssignments: ['ARBITRARY-SYSTEM'] }), /canonical|reservation/i)
  assert.throws(() => createMockScheduler({ maximum: 2, initialUsed: 2, systemReservationAssignments: ['SYSTEM-RESERVATION-A', 'SYSTEM-RESERVATION-A'] }), /unique/i)
  const scheduler = createMockScheduler({ maximum: 5, initialUsed: 1 })
  const authority = getSchedulerRegistrationAuthority(scheduler)
  const systemLease = scheduler.leases[0]
  const before = getSchedulerSnapshot(scheduler)
  assert.equal(releaseSchedulerLeaseCanonical(scheduler, systemLease, authority), false)
  assert.deepEqual(getSchedulerSnapshot(scheduler), before)
  let state = createScenarioState('normal', scheduler)
  state = runCommandToCompletion(state, 'VALIDATE_SNAPSHOT')
  state = runCommandToCompletion(state, 'START_RUN')
  state = completeAllActivities(state)
  assert.ok(getSchedulerSnapshot(scheduler).leases.some((lease) => lease.executionId === 'SYSTEM'))
})

test('opções de fairness e capacidade inválidas falham antes de criar estado', () => {
  assert.throws(() => createMockScheduler({ maxConsecutiveDispatches: -1 }), /maxConsecutiveDispatches/i)
  assert.throws(() => createMockScheduler({ maxConsecutiveDispatches: 1.5 }), /maxConsecutiveDispatches/i)
  assert.throws(() => createMockScheduler({ status: 'UNKNOWN', maximum: 1 }), /unknown/i)
  assert.throws(() => createMockScheduler({ status: 'UNKNOWN', initialUsed: 1 }), /unknown/i)
  assert.throws(() => createMockScheduler({ maximum: 1, initialUsed: 1, systemReservationAssignments: ['SYSTEM-RESERVATION-A', 'SYSTEM-RESERVATION-B'] }), /length|reservation/i)
})

test('reconciliação rejeita ceiling incoerente e mantém revisão estável em no-op', () => {
  const scheduler = createMockScheduler({ maximum: 5, initialUsed: 0 })
  const authority = getSchedulerRegistrationAuthority(scheduler)
  const before = scheduler.revision
  assert.throws(() => reconcileSchedulerCapacity(scheduler, { status: 'KNOWN', maximum: 5, conservativeCeiling: 9 }, authority), /ceiling|maximum/i)
  assert.equal(scheduler.revision, before)
  reconcileSchedulerCapacity(scheduler, { status: 'KNOWN', maximum: 5, conservativeCeiling: 1 }, authority)
  assert.ok(scheduler.revision > before)
  const after = scheduler.revision
  reconcileSchedulerCapacity(scheduler, { status: 'KNOWN', maximum: 5, conservativeCeiling: 1 }, authority)
  assert.equal(scheduler.revision, after)
})

test('fila canônica é completa com capacidade multi-slot parcialmente ocupada e permite conclusão', () => {
  const scheduler = createMockScheduler({ maximum: 5, initialUsed: 2 })
  let state = createScenarioState('normal', scheduler)
  state = runCommandToCompletion(state, 'VALIDATE_SNAPSHOT')
  state = runCommandToCompletion(state, 'START_RUN')
  const snapshot = getSchedulerSnapshot(scheduler)
  assert.equal(snapshot.used, 3)
  assert.equal(snapshot.available, 2)
  const readyIds = state.activities.filter((item) => item.state === 'READY').map((item) => item.id)
  assert.equal(readyIds.length, 4)
  assert.ok(readyIds.every((activityId) => snapshot.fairQueue.some((candidate) => candidate.executionId === state.schedulerExecutionId && candidate.activityId === activityId)))
  state = completeAllActivities(state)
  assert.equal(state.activities.every((item) => item.state === 'COMPLETED'), true)
  assert.ok(getSchedulerSnapshot(scheduler).leases.every((lease) => lease.executionId === 'SYSTEM'))
})

test('identidade persistente de PR separa execuções concorrentes e impede prova cruzada', () => {
  const scheduler = createMockScheduler({ maximum: 4, initialUsed: 0 })
  const first = runCommandToCompletion(createScenarioState('pr', scheduler), 'APPROVE_PUBLICATION')
  const second = runCommandToCompletion(createScenarioState('pr', scheduler), 'APPROVE_PUBLICATION')
  assert.equal(first.publication.prNumber, second.publication.prNumber)
  assert.notEqual(first.publication.publicationIdentity.canonicalId, second.publication.publicationIdentity.canonicalId)
  assert.notEqual(first.publication.candidateId, second.publication.candidateId)
  const mergedFirst = runCommandToCompletion(first, 'MERGE_PR')
  const crossBoundEvidence = { ...second, publication: { ...second.publication, state: 'PR_MERGED' as const, queueStatus: 'PROCESSING' as const, mergedCandidateId: mergedFirst.publication.mergedCandidateId, mergedPrNumber: mergedFirst.publication.mergedPrNumber, mergedBaseSha: mergedFirst.publication.mergedBaseSha, mergedHeadSha: mergedFirst.publication.mergedHeadSha, mergedTreeHash: mergedFirst.publication.mergedTreeHash, mergedConformanceRunId: mergedFirst.publication.mergedConformanceRunId, mergedPublicationIdentity: mergedFirst.publication.mergedPublicationIdentity, mergedRemoteEvidenceId: mergedFirst.publication.mergedRemoteEvidenceId } }
  assert.equal(canExecute(crossBoundEvidence, 'CONFIRM_REMOTE').allowed, false)
  const recoveredFirst = runCommandToCompletion(mergedFirst, 'CONFIRM_REMOTE')
  assert.equal(recoveredFirst.publication.publicationIdentity.canonicalId, first.publication.publicationIdentity.canonicalId)
  assert.equal(recoveredFirst.publication.remoteEvidenceId, `${first.publication.publicationIdentity.canonicalId}:remote-evidence`)
})

test('não oferece pausa ou cancelamento antes da execução confirmada', () => {
  const initial = createScenarioState('normal')
  assert.equal(canExecute(initial, 'REQUEST_PAUSE').allowed, false)
  assert.equal(canExecute(initial, 'REQUEST_CANCEL').allowed, false)
})

test('separa solicitação, aceitação e efeito confirmado', () => {
  const initial = createScenarioState('normal')
  const requested = requestCommand(initial, 'VALIDATE_SNAPSHOT')
  assert.equal(requested.commands[0].status, 'requested')
  const accepted = advanceCommand(requested, requested.commands[0].id)
  assert.equal(accepted.commands[0].status, 'accepted')
  assert.equal(accepted.commands[0].effectStatus, 'pending')
  assert.equal(accepted.snapshot.status, 'DRAFT')
  const validated = advanceCommand(accepted, accepted.commands[0].id)
  const started = runCommandToCompletion(validated, 'START_RUN')
  const paused = runCommandToCompletion(started, 'REQUEST_PAUSE', 'checkpoint seguro')

  assert.equal(paused.run.functionalState, 'RUNNING')
  assert.equal(paused.run.operationalState, 'PAUSED')
  assert.equal(paused.commands[0].status, 'confirmed')
  assert.equal(paused.commands[0].effectStatus, 'confirmed')
  assert.ok(paused.commands[0].requestedAt)
  assert.ok(paused.commands[0].acceptedAt)
  assert.ok(paused.commands[0].confirmedAt)
  assert.equal(initial.run.functionalState, 'READY')
})

test('execução normal exige snapshot confirmado e avança até conclusão', () => {
  let state = createScenarioState('normal')
  state = runCommandToCompletion(state, 'VALIDATE_SNAPSHOT')
  state = runCommandToCompletion(state, 'START_RUN')
  assert.equal(state.snapshot.status, 'CONFIRMED')
  assert.equal(canExecute(state, 'ADVANCE_NORMAL').allowed, false)
  state = completeAllActivities(state)
  assert.equal(state.activities.every((item) => item.state === 'COMPLETED'), true)
  assert.equal(state.capacity.used, 4)
  assert.equal(state.capacity.available, 1)
  for (let step = 0; step < 3; step += 1) state = runCommandToCompletion(state, 'ADVANCE_NORMAL')
  assert.equal(state.run.functionalState, 'RUNNING')
  assert.equal(state.publication.state, 'PUBLICATION_CANDIDATE_READY')
  state = runCommandToCompletion(state, 'APPROVE_PUBLICATION')
  state = runCommandToCompletion(state, 'LOCAL_INTEGRATE')
  state = runCommandToCompletion(state, 'PUSH_REMOTE')
  assert.equal(state.run.functionalState, 'COMPLETED')
  assert.equal(state.run.operationalState, 'COMPLETED')
  assert.equal(state.publication.state, 'REMOTE_PUBLICATION_CONFIRMED')
  assert.equal(state.capacity.used, 4)
  assert.equal(state.capacity.available, 1)
  assert.equal(state.capacity.leases.length, 4)
  assert.ok(state.events.some((event) => event.type === 'workflow.advanced'))
})

test('início normal usa o scheduler e respeita o único slot disponível', () => {
  let state = createScenarioState('normal')
  const before = { used: state.capacity.used, available: state.capacity.available, leases: state.capacity.leases.length, ready: state.activities.filter((item) => item.state === 'READY').length }
  state = runCommandToCompletion(state, 'VALIDATE_SNAPSHOT')
  state = runCommandToCompletion(state, 'START_RUN')

  assert.equal(before.used, 4)
  assert.equal(before.available, 1)
  assert.equal(before.leases, 4)
  assert.equal(before.ready, 5)
  assert.equal(state.capacity.used, 5)
  assert.equal(state.capacity.available, 0)
  assert.equal(state.capacity.used + state.capacity.available, state.capacity.maximum)
  assert.equal(state.capacity.leases.length, 5)
  assert.equal(state.activities.filter((item) => item.state === 'RUNNING').length, 1)
  assert.equal(state.activities.find((item) => item.id === 'ACT-8F12')?.state, 'RUNNING')
  assert.ok(state.capacity.leases.includes('ASN-031'))
  assert.ok(state.activities.filter((item) => item.state === 'RUNNING').every((item) => state.capacity.leases.includes(item.agentAssignmentId)))
  assert.equal(state.activities.filter((item) => item.state === 'WAITING_CAPACITY').length, 4)
  assertCapacityCoherent(state)
})

test('capacidade UNKNOWN mantém o início em espera e nunca fabrica atividades RUNNING', () => {
  const scheduler = createMockScheduler({ status: 'UNKNOWN' })
  const state = createScenarioState('normal', scheduler)
  let started = runCommandToCompletion(state, 'VALIDATE_SNAPSHOT')
  started = runCommandToCompletion(started, 'START_RUN')
  assert.equal(started.run.functionalState, 'RUNNING')
  assert.equal(started.activities.some((item) => item.state === 'RUNNING'), false)
  assert.equal(started.activities.every((item) => item.state === 'WAITING_CAPACITY'), true)
  assert.equal(started.capacity.leases.length, 0)
  assertCapacityCoherent(started)
})

test('atividade em espera não pode fabricar conclusão', () => {
  let state = createScenarioState('normal')
  state = runCommandToCompletion(runCommandToCompletion(state, 'VALIDATE_SNAPSHOT'), 'START_RUN')
  const waiting = state.activities.find((item) => item.state === 'WAITING_CAPACITY')!
  const rejected = runCommandToCompletion(state, 'COMPLETE_ACTIVITY', 'efeito alegado', waiting.id)

  assert.equal(rejected.commands[0].status, 'rejected')
  assert.equal(rejected.activities.find((item) => item.id === waiting.id)?.state, 'WAITING_CAPACITY')
  assert.equal(rejected.events.some((event) => event.type === 'activity.completed' && event.target === waiting.id), false)
})

test('conclusão exige lease, libera-a e redispatcha a próxima atividade', () => {
  let state = createScenarioState('normal')
  state = runCommandToCompletion(runCommandToCompletion(state, 'VALIDATE_SNAPSHOT'), 'START_RUN')
  const running = state.activities.find((item) => item.state === 'RUNNING')!
  state = runCommandToCompletion(state, 'COMPLETE_ACTIVITY', 'efeito operacional confirmado', running.id)
  const releasedIndex = state.events.findIndex((event) => event.type === 'lease.released' && event.target === running.agentAssignmentId)
  const acquiredAfterRelease = state.events.findIndex((event, index) => index > releasedIndex && event.type === 'lease.acquired')
  const nextRunning = state.activities.find((item) => item.state === 'RUNNING')

  assert.equal(state.activities.find((item) => item.id === running.id)?.state, 'COMPLETED')
  assert.ok(releasedIndex >= 0)
  assert.ok(acquiredAfterRelease > releasedIndex)
  assert.ok(nextRunning)
  assert.notEqual(nextRunning?.id, running.id)
  assert.equal(state.capacity.used, 5)
  assert.equal(state.capacity.available, 0)
  assertCapacityCoherent(state)
})

test('publicação permanece bloqueada enquanto houver atividade RUNNING ou WAITING_CAPACITY', () => {
  let runningState = createScenarioState('normal')
  runningState = runCommandToCompletion(runCommandToCompletion(runningState, 'VALIDATE_SNAPSHOT'), 'START_RUN')
  runningState.run.stage = 'Publicação'
  runningState.publication.state = 'PUBLICATION_CANDIDATE_READY'
  runningState.publication.conformanceStatus = 'APPROVED'
  assert.equal(canExecute(runningState, 'APPROVE_PUBLICATION').allowed, false)

  const waitingState = structuredClone(runningState)
  waitingState.activities[0].state = 'WAITING_CAPACITY'
  assert.equal(canExecute(waitingState, 'APPROVE_PUBLICATION').allowed, false)
})

test('auditoria, remediação e reauditoria fecham findings com assignments distintos', () => {
  let state = createScenarioState('audit')
  state = runCommandToCompletion(state, 'REMEDIATE_FINDING')
  assert.equal(state.findings[0].state, 'REMEDIATED')
  assert.equal(canExecute(state, 'REAUDIT_FINDING').allowed, false)
  state = runCommandToCompletion(state, 'REMEDIATE_FINDING')
  assert.equal(state.findings[1].state, 'REMEDIATED')
  state = runCommandToCompletion(state, 'REAUDIT_FINDING')
  assert.equal(state.findings[0].state, 'APPROVED')
  assert.equal(state.specs[0].status, 'CONFORMANCE_APPROVED')
  assert.equal(state.findings[0].auditorAssignmentId, 'ASN-044')
  assert.equal(state.findings[0].remediatorAssignmentId, 'ASN-041-R2')
  assert.notEqual(state.findings[0].remediatorAssignmentId, state.findings[1].remediatorAssignmentId)
  assert.notEqual(state.findings[0].reauditorAssignmentId, state.findings[1].reauditorAssignmentId)
  assert.equal(state.assignments.find((item) => item.agentAssignmentId === 'ASN-041-R2')?.eligible, false)
  assert.equal(state.assignments.find((item) => item.agentAssignmentId === 'ASN-041-R3')?.eligible, false)
  assert.ok(state.activities.some((item) => item.id === 'ACT-REMEDIATE-ASC-MAJOR-004'))
  assert.ok(state.activities.some((item) => item.id === 'ACT-REAUDIT-ASC-MINOR-002'))
})

test('preserva segregação por assignment, sessão, papel e ciclo', () => {
  const state = createScenarioState('audit')
  const auditor = state.assignments.find((item) => item.agentAssignmentId === 'ASN-044')
  const remediator = state.assignments.find((item) => item.agentAssignmentId === 'ASN-041-R2')

  assert.ok(auditor)
  assert.ok(remediator)
  assert.notEqual(auditor.logicalAgentId, remediator.logicalAgentId)
  assert.notEqual(auditor.sessionId, remediator.sessionId)
  assert.equal(agentIsEligible(state, 'AUDITOR', auditor.artifactCycleId, auditor.agentAssignmentId), true)
  assert.equal(agentIsEligible(state, 'REMEDIATOR', remediator.artifactCycleId, remediator.agentAssignmentId), true)
  assert.equal(agentIsEligible(state, 'AUDITOR', auditor.artifactCycleId, 'ASN-028-R1'), true)

  const participated = runCommandToCompletion(runCommandToCompletion(state, 'REMEDIATE_FINDING'), 'REMEDIATE_FINDING')
  assert.equal(agentIsEligible(participated, 'REMEDIATOR', 'AC-021-01', 'ASN-041-R2'), false)
  assert.equal(agentIsEligible(participated, 'REMEDIATOR', 'AC-021-01', 'ASN-041-R3'), false)
  assert.ok(participated.assignments.find((item) => item.agentAssignmentId === 'ASN-041-R2')?.participationHistory.length)

  const duplicate = { ...auditor, agentAssignmentId: 'ASN-DUP', sessionId: 'SES-DUP' }
  const contaminated = { ...state, assignments: [...state.assignments, duplicate] }
  assert.equal(agentIsEligible(contaminated, 'AUDITOR', auditor.artifactCycleId, auditor.agentAssignmentId), false)
})

test('capacidade desconhecida impede despacho até reconciliação confirmada', () => {
  const unknown = createScenarioState('capacity')
  assert.equal(canExecute(unknown, 'DISPATCH_ACTIVITY').allowed, false)
  const reconciled = runCommandToCompletion(unknown, 'RELEASE_CAPACITY')
  assert.equal(reconciled.capacity.status, 'KNOWN')
  assert.equal(reconciled.activities[2].state, 'RUNNING')
  assert.equal(reconciled.commands[0].status, 'confirmed')
})

test('limite de rodadas exige autorização explícita e mantém histórico', () => {
  const limited = createScenarioState('rounds')
  assert.equal(limited.activities[3].round, 10)
  assert.equal(limited.activities[3].maxRounds, 10)
  const advanced = runCommandToCompletion(limited, 'AUTHORIZE_ROUND')
  assert.equal(advanced.activities[3].round, 11)
  assert.equal(advanced.activities[3].state, 'RUNNING')
  assert.ok(advanced.events.some((event) => event.type === 'round.authorized'))
})

test('retry operacional reutiliza checkpoint e incrementa tentativa', () => {
  const failed = createScenarioState('retry')
  assert.equal(failed.activities[2].state, 'FAILED')
  const retried = runCommandToCompletion(failed, 'RETRY_ACTIVITY')
  assert.equal(retried.activities[2].attempt, 4)
  assert.equal(retried.activities[2].state, 'RUNNING')
  assert.equal(retried.activities[2].checkpoint, retried.activities[2].safeCheckpoint)
  assert.ok(retried.events.some((event) => event.type === 'activity.retry.confirmed'))
})

test('pausa e cancelamento são cooperativos e não cancelam tickets silenciosamente', () => {
  let initial = createScenarioState('normal')
  initial = runCommandToCompletion(runCommandToCompletion(initial, 'VALIDATE_SNAPSHOT'), 'START_RUN')
  const paused = runCommandToCompletion(initial, 'REQUEST_PAUSE')
  assert.equal(paused.run.operationalState, 'PAUSED')
  assert.equal(paused.run.functionalState, 'RUNNING')
  const ticketStates = paused.tickets.map((ticket) => [ticket.id, ticket.functionalState])
  const cancelled = runCommandToCompletion(paused, 'REQUEST_CANCEL')
  assert.equal(cancelled.run.functionalState, 'CANCELLED')
  assert.equal(cancelled.run.operationalState, 'CANCELLED')
  assert.deepEqual(cancelled.tickets.map((ticket) => [ticket.id, ticket.functionalState]), ticketStates)
})

test('prioridade é um comando validado e confirmado pelo registro operacional', () => {
  const initial = createScenarioState('normal')
  assert.equal(canExecute(initial, 'SET_PRIORITY', '101').allowed, false)
  const changed = runCommandToCompletion(initial, 'SET_PRIORITY', 'prioridade humana', '80')
  assert.equal(changed.run.priority, 80)
  assert.ok(changed.events.some((event) => event.type === 'priority.changed'))
})

test('onda paralela só integra depois de conflito resolvido e auditoria aprovada', () => {
  const conflict = createScenarioState('conflict')
  assert.equal(canExecute(conflict, 'INTEGRATE_WAVE').allowed, false)
  const resolved = runCommandToCompletion(conflict, 'RESOLVE_CONFLICT')
  const audited = runCommandToCompletion(resolved, 'AUDIT_INTEGRATION')
  const integrated = runCommandToCompletion(audited, 'INTEGRATE_WAVE')
  assert.equal(integrated.wave.status, 'INTEGRATED')
  assert.equal(integrated.tickets.find((ticket) => ticket.id === 'TCK-107')?.functionalState, 'READY')
  assert.equal(integrated.tickets.find((ticket) => ticket.id === 'TCK-107')?.lastUnblockedBy, 'TCK-106')
  assert.ok(integrated.events.some((event) => event.type === 'integration.conflict.resolved'))
  assert.ok(integrated.events.some((event) => event.type === 'integration.audited'))
})

test('cancelamento funcional de ticket exige revisão auditada do DAG', () => {
  const conflict = createScenarioState('conflict')
  assert.equal(canExecute(conflict, 'CANCEL_TICKET', 'TCK-106').allowed, false)
  const audited = runCommandToCompletion(runCommandToCompletion(conflict, 'RESOLVE_CONFLICT'), 'AUDIT_INTEGRATION')
  const cancelled = runCommandToCompletion(audited, 'CANCEL_TICKET', 'revisão do DAG', 'TCK-106')
  assert.equal(cancelled.tickets.find((ticket) => ticket.id === 'TCK-106')?.functionalState, 'CANCELLED')
  assert.equal(canExecute(cancelled, 'INTEGRATE_WAVE').allowed, false)
})

test('aprovação é invalidada por drift e PR só conclui após confirmação remota', () => {
  const drifted = createScenarioState('drift')
  assert.equal(drifted.publication.approval, 'INVALIDATED')
  const revalidated = runCommandToCompletion(drifted, 'REVALIDATE_PUBLICATION')
  const approved = runCommandToCompletion(revalidated, 'APPROVE_PUBLICATION')
  assert.equal(approved.publication.approval, 'APPROVED')
  assert.equal(approved.publication.state, 'LOCAL_INTEGRATION_PENDING')
  const directDone = runCommandToCompletion(runCommandToCompletion(approved, 'LOCAL_INTEGRATE'), 'PUSH_REMOTE')
  assert.equal(directDone.publication.state, 'REMOTE_PUBLICATION_CONFIRMED')
  assert.equal(directDone.run.functionalState, 'COMPLETED')

  const prApproved = runCommandToCompletion(createScenarioState('pr'), 'APPROVE_PUBLICATION')
  assert.equal(prApproved.publication.state, 'AWAITING_PR_MERGE')
  const stalePr = { ...prApproved, publication: { ...prApproved.publication, currentTreeHash: 'tree-drift' } }
  assert.equal(canExecute(stalePr, 'MERGE_PR').allowed, false)
  const merged = runCommandToCompletion(prApproved, 'MERGE_PR')
  assert.equal(merged.publication.state, 'PR_MERGED')
  assert.notEqual(merged.run.functionalState, 'COMPLETED')
  const remotelyConfirmed = runCommandToCompletion(merged, 'CONFIRM_REMOTE')
  assert.equal(remotelyConfirmed.publication.state, 'REMOTE_PUBLICATION_CONFIRMED')
  assert.equal(remotelyConfirmed.run.functionalState, 'COMPLETED')
})

test('CONFIRM_REMOTE revalida identidade e evidência da PR depois do merge', () => {
  const approved = runCommandToCompletion(createScenarioState('pr'), 'APPROVE_PUBLICATION')
  const merged = runCommandToCompletion(approved, 'MERGE_PR')
  assert.equal(canExecute(merged, 'CONFIRM_REMOTE').allowed, true)

  const mutations: Array<[string, (state: MockState) => void]> = [
    ['base', (state) => { state.publication.currentBaseSha = 'post-merge-base-drift' }],
    ['head', (state) => { state.publication.currentHeadSha = 'post-merge-head-drift' }],
    ['tree', (state) => { state.publication.currentTreeHash = 'post-merge-tree-drift' }],
    ['candidate', (state) => { state.publication.candidateId = 'post-merge-candidate-drift' }],
    ['approval', (state) => { state.publication.approval = 'INVALIDATED' }],
    ['checks', (state) => { state.publication.checks = 'FAILING' }],
    ['mergeability', (state) => { state.publication.mergeable = false }],
    ['conformance run', (state) => { state.publication.conformanceRunId = 'stale-conformance' }],
    ['merge evidence', (state) => { state.publication.mergedRemoteEvidenceId = 'stale-remote-evidence' }],
  ]

  for (const [label, mutate] of mutations) {
    const stale = structuredClone(merged)
    mutate(stale)
    assert.equal(canExecute(stale, 'CONFIRM_REMOTE').allowed, false, label)
    const rejected = runCommandToCompletion(stale, 'CONFIRM_REMOTE')
    assert.equal(rejected.commands[0].status, 'rejected', label)
    assert.equal(rejected.publication.state, 'PR_MERGED', label)
    assert.notEqual(rejected.run.functionalState, 'COMPLETED', label)
    assert.equal(rejected.events.some((event) => event.type === 'remote.publication.confirmed'), false, label)
  }

  assert.equal(merged.publication.mergedCandidateId, merged.publication.candidateId)
  assert.equal(merged.publication.mergedBaseSha, merged.publication.baseSha)
  const confirmed = runCommandToCompletion(merged, 'CONFIRM_REMOTE')
  assert.equal(confirmed.publication.state, 'REMOTE_PUBLICATION_CONFIRMED')
  assert.equal(confirmed.run.functionalState, 'COMPLETED')
})

test('scheduler compartilhado mantém uma capacidade global e aplica prioridade com fairness', () => {
  const scheduler = createMockScheduler({ maximum: 1, initialUsed: 0, maxConsecutiveDispatches: 2 })
  const candidates = [
    { executionId: 'RUN-A', activityId: 'ACT-A', assignmentId: 'ASN-A', priority: 90 },
    { executionId: 'RUN-B', activityId: 'ACT-B', assignmentId: 'ASN-B', priority: 10 },
  ]
  registerSchedulerCandidates(scheduler, candidates)
  candidates.forEach((candidate) => enqueueSchedulerCandidate(scheduler, { ...candidate, reason: 'CAPACITY' }))

  const first = selectNextSchedulerCandidate(scheduler)
  assert.equal(first?.executionId, candidates[0].executionId)
  const firstLease = acquireSchedulerLease(scheduler, first!)
  assert.equal(getSchedulerSnapshot(scheduler).available, 0)
  releaseSchedulerLease(scheduler, firstLease!)

  registerSchedulerCandidates(scheduler, [candidates[0]])
  enqueueSchedulerCandidate(scheduler, { ...candidates[0], reason: 'CAPACITY' })
  const second = selectNextSchedulerCandidate(scheduler)
  assert.equal(second?.executionId, candidates[0].executionId)
  const secondLease = acquireSchedulerLease(scheduler, second!)
  releaseSchedulerLease(scheduler, secondLease!)

  registerSchedulerCandidates(scheduler, [candidates[0], candidates[1]])
  enqueueSchedulerCandidate(scheduler, { ...candidates[0], reason: 'CAPACITY' })
  const third = selectNextSchedulerCandidate(scheduler)
  assert.equal(third?.executionId, candidates[1].executionId, 'a high-priority execution cannot monopolize the shared pool')
  const snapshot = getSchedulerSnapshot(scheduler)
  assert.equal(snapshot.maximum, 1)
  assert.equal(snapshot.used + (snapshot.available ?? 0), 1)
  assert.equal(snapshot.queuedByCapacity, 0)
})

test('reevaliação canônica relabela READY e CAPACITY conforme slots globais', () => {
  const scheduler = createMockScheduler({ maximum: 1, initialUsed: 0 })
  const candidates = [
    { executionId: 'RUN-A', activityId: 'ACT-A', assignmentId: 'ASN-A' },
    { executionId: 'RUN-B', activityId: 'ACT-B', assignmentId: 'ASN-B' },
  ]
  registerSchedulerCandidates(scheduler, candidates)
  const first = enqueueSchedulerCandidate(scheduler, { ...candidates[0], priority: 90, reason: 'READY' })
  enqueueSchedulerCandidate(scheduler, { ...candidates[1], priority: 80, reason: 'READY' })
  assert.equal(first.reason, 'READY')
  const lease = acquireSchedulerLease(scheduler, selectNextSchedulerCandidate(scheduler)!)
  assert.ok(lease)
  assert.equal(getSchedulerSnapshot(scheduler).fairQueue[0].reason, 'CAPACITY')
  assert.equal(getSchedulerSnapshot(scheduler).queuedByCapacity, 1)
  assert.equal(releaseSchedulerLease(scheduler, lease!), true)
  assert.equal(getSchedulerSnapshot(scheduler).fairQueue[0].reason, 'READY')
  assert.equal(getSchedulerSnapshot(scheduler).queuedByCapacity, 0)
})

test('scheduler deriva counters de membros reais da fila e separa espera por motivo', () => {
  const scheduler = createMockScheduler({ maximum: 2, initialUsed: 2 })
  const candidates = [
    { executionId: 'RUN-A', activityId: 'CAP-1', assignmentId: 'ASN-1', reason: 'CAPACITY' },
    { executionId: 'RUN-B', activityId: 'ELIG-1', assignmentId: 'ASN-2', reason: 'ELIGIBILITY' },
  ]
  registerSchedulerCandidates(scheduler, candidates)
  enqueueSchedulerCandidate(scheduler, { ...candidates[0], priority: 50, reason: 'CAPACITY' })
  enqueueSchedulerCandidate(scheduler, { ...candidates[1], priority: 50, reason: 'ELIGIBILITY' })
  const snapshot = getSchedulerSnapshot(scheduler)
  assert.equal(snapshot.queuedByCapacity, 1)
  assert.equal(snapshot.queuedByEligibility, 1)
  assert.equal(snapshot.fairQueue.length, 2)
  assert.equal(snapshot.used, 2)
  assert.equal(snapshot.available, 0)
})

test('execuções independentes usam o mesmo scheduler sem sobrescrever leases concorrentes', () => {
  const scheduler = createMockScheduler({ maximum: 2, initialUsed: 0 })
  let first = createScenarioState('normal', scheduler)
  let second = createScenarioState('normal', scheduler)
  first = runCommandToCompletion(first, 'VALIDATE_SNAPSHOT')
  second = runCommandToCompletion(second, 'VALIDATE_SNAPSHOT')
  first = runCommandToCompletion(first, 'START_RUN')
  second = runCommandToCompletion(second, 'START_RUN')

  const snapshot = getSchedulerSnapshot(scheduler)
  assert.equal(first.schedulerExecutionId === second.schedulerExecutionId, false)
  assert.equal(snapshot.used, 2)
  assert.equal(snapshot.available, 0)
  assert.deepEqual(new Set(snapshot.leases.map((lease) => lease.executionId)), new Set([first.schedulerExecutionId, second.schedulerExecutionId]))
})

test('projeção local nunca reescreve autoridade canônica em revisão igual ou obsoleta', () => {
  let state = createScenarioState('normal')
  const canonicalBefore = structuredClone(state.capacity)
  state.capacity = { ...state.capacity, maximum: 1, used: 1, available: 0, leases: ['FAKE-LEASE'], fairQueue: [] }
  const forgedProjection = structuredClone(state.capacity)
  assert.equal(canExecute(state, 'ADVANCE_MAIN').allowed, false)
  assert.deepEqual(state.capacity, forgedProjection)
  assert.deepEqual(getSchedulerSnapshot(getSchedulerForState(state)), { status: canonicalBefore.status, maximum: canonicalBefore.maximum, used: canonicalBefore.used, available: canonicalBefore.available, queuedByCapacity: canonicalBefore.queuedByCapacity, queuedByEligibility: canonicalBefore.queuedByEligibility, fairQueue: getSchedulerSnapshot(getSchedulerForState(state)).fairQueue, leases: getSchedulerSnapshot(getSchedulerForState(state)).leases })

  const stale = structuredClone(state)
  state = runCommandToCompletion(state, 'VALIDATE_SNAPSHOT')
  state = runCommandToCompletion(state, 'START_RUN')
  const canonicalAfterCommand = structuredClone(state.capacity)
  stale.capacity = { ...stale.capacity, status: 'UNKNOWN', maximum: null, used: 0, available: null, leases: ['STALE-FAKE'], fairQueue: [] }
  const staleProjection = structuredClone(stale.capacity)
  assert.equal(canExecute(stale, 'ADVANCE_MAIN').allowed, false)
  assert.deepEqual(stale.capacity, staleProjection)
  assert.notDeepEqual(stale.capacity, canonicalAfterCommand)
})

test('restauração UNKNOWN→KNOWN preserva a fila de todas as execuções e redispatcha globalmente', () => {
  const scheduler = createMockScheduler({ status: 'UNKNOWN' })
  const first = createScenarioState('capacity', scheduler)
  const second = createScenarioState('capacity', scheduler)
  const before = getSchedulerSnapshot(scheduler)
  assert.deepEqual(new Set(before.fairQueue.map((item) => item.executionId)), new Set([first.schedulerExecutionId, second.schedulerExecutionId]))

  const restored = runCommandToCompletion(first, 'RELEASE_CAPACITY')
  const after = getSchedulerSnapshot(scheduler)
  assert.equal(after.status, 'KNOWN')
  assert.ok(after.leases.length <= 5)
  assert.ok(after.leases.length > 0)
  assert.ok(after.fairQueue.some((item) => item.executionId === first.schedulerExecutionId) || after.leases.some((lease) => lease.executionId === first.schedulerExecutionId))
  assert.ok(after.fairQueue.some((item) => item.executionId === second.schedulerExecutionId) || after.leases.some((lease) => lease.executionId === second.schedulerExecutionId))
  assert.equal(restored.capacity.queuedByCapacity, after.queuedByCapacity)
  assert.equal(restored.capacity.queuedByEligibility, after.queuedByEligibility)
})

test('restauração global em um e múltiplos slots preserva os candidatos remanescentes', () => {
  const oneSlot = createMockScheduler({ status: 'UNKNOWN' })
  const oneSlotCandidates = [
    { executionId: 'RUN-A', activityId: 'ACT-A', assignmentId: 'ASN-A' },
    { executionId: 'RUN-B', activityId: 'ACT-B', assignmentId: 'ASN-B' },
  ]
  registerSchedulerCandidates(oneSlot, oneSlotCandidates)
  enqueueSchedulerCandidate(oneSlot, { ...oneSlotCandidates[0], priority: 90, reason: 'CAPACITY' })
  enqueueSchedulerCandidate(oneSlot, { ...oneSlotCandidates[1], priority: 80, reason: 'CAPACITY' })
  reconcileSchedulerCapacity(oneSlot, { status: 'KNOWN', maximum: 1 }, getSchedulerRegistrationAuthority(oneSlot))
  const oneSlotLease = acquireSchedulerLease(oneSlot, selectNextSchedulerCandidate(oneSlot)!)
  const oneSlotSnapshot = getSchedulerSnapshot(oneSlot)
  assert.ok(oneSlotLease)
  assert.equal(oneSlotSnapshot.leases.length, 1)
  assert.equal(oneSlotSnapshot.fairQueue.length, 1)
  assert.equal(oneSlotSnapshot.fairQueue[0].reason, 'CAPACITY')

  const multiSlot = createMockScheduler({ status: 'UNKNOWN' })
  const multiSlotCandidates = ['RUN-A', 'RUN-B', 'RUN-C'].map((executionId) => ({ executionId, activityId: `ACT-${executionId}`, assignmentId: `ASN-${executionId}` }))
  registerSchedulerCandidates(multiSlot, multiSlotCandidates)
  multiSlotCandidates.forEach((candidate, index) => enqueueSchedulerCandidate(multiSlot, { ...candidate, priority: 90 - index, reason: 'CAPACITY' }))
  reconcileSchedulerCapacity(multiSlot, { status: 'KNOWN', maximum: 2 }, getSchedulerRegistrationAuthority(multiSlot))
  while (multiSlot.available && multiSlot.available > 0) {
    const candidate = selectNextSchedulerCandidate(multiSlot)
    if (!candidate || !acquireSchedulerLease(multiSlot, candidate)) break
  }
  const multiSlotSnapshot = getSchedulerSnapshot(multiSlot)
  assert.equal(multiSlotSnapshot.leases.length, 2)
  assert.equal(multiSlotSnapshot.fairQueue.length, 1)
  assert.equal(multiSlotSnapshot.fairQueue[0].reason, 'CAPACITY')
})

test('liberação de lease em uma execução pode despachar trabalho de outra', () => {
  const scheduler = createMockScheduler({ maximum: 1, initialUsed: 0 })
  let first = createScenarioState('normal', scheduler)
  let second = createScenarioState('normal', scheduler)
  first = runCommandToCompletion(runCommandToCompletion(first, 'VALIDATE_SNAPSHOT'), 'START_RUN')
  second = runCommandToCompletion(runCommandToCompletion(second, 'VALIDATE_SNAPSHOT'), 'START_RUN')
  const firstRunning = first.activities.find((item) => item.state === 'RUNNING')!
  first = runCommandToCompletion(first, 'COMPLETE_ACTIVITY', 'confirmed operational effect', firstRunning.id)
  const snapshot = getSchedulerSnapshot(scheduler)
  assert.ok(snapshot.leases.some((lease) => lease.executionId === second.schedulerExecutionId))
  assert.ok(snapshot.leases.every((lease) => lease.executionId !== first.schedulerExecutionId || lease.activityId !== firstRunning.id))
})

test('cancelamento de uma execução compartilhada preserva a fila de outra', () => {
  const scheduler = createMockScheduler({ maximum: 1, initialUsed: 0 })
  let first = createScenarioState('normal', scheduler)
  let second = createScenarioState('normal', scheduler)
  first = runCommandToCompletion(runCommandToCompletion(first, 'VALIDATE_SNAPSHOT'), 'START_RUN')
  second = runCommandToCompletion(runCommandToCompletion(second, 'VALIDATE_SNAPSHOT'), 'START_RUN')
  const secondExecutionId = second.schedulerExecutionId
  const before = getSchedulerSnapshot(scheduler)
  assert.ok(before.fairQueue.some((candidate) => candidate.executionId === secondExecutionId))
  first = runCommandToCompletion(first, 'REQUEST_CANCEL')
  const after = getSchedulerSnapshot(scheduler)
  assert.ok(after.fairQueue.some((candidate) => candidate.executionId === secondExecutionId) || after.leases.some((lease) => lease.executionId === secondExecutionId))
})

test('SET_PRIORITY altera a próxima seleção entre execuções compartilhadas', () => {
  const scheduler = createMockScheduler({ maximum: 1, initialUsed: 0 })
  let first = createScenarioState('normal', scheduler)
  let second = createScenarioState('normal', scheduler)
  first = runCommandToCompletion(first, 'SET_PRIORITY', 'prioridade baixa', '10')
  second = runCommandToCompletion(second, 'SET_PRIORITY', 'prioridade alta', '90')
  const selected = selectNextSchedulerCandidate(scheduler)
  assert.equal(selected, undefined, 'prioridade não pode iniciar uma execução ainda não iniciada')
  assert.equal(scheduler.queue.find((item) => item.executionId === first.schedulerExecutionId)?.priority, 10)
  assert.equal(scheduler.queue.find((item) => item.executionId === second.schedulerExecutionId)?.priority, 90)
})

test('capacidade UNKNOWN bloqueia leases de todas as execuções enfileiradas', () => {
  const scheduler = createMockScheduler({ status: 'UNKNOWN', initialUsed: 0 })
  const candidates = [
    { executionId: 'RUN-A', activityId: 'ACT-A', assignmentId: 'ASN-A' },
    { executionId: 'RUN-B', activityId: 'ACT-B', assignmentId: 'ASN-B' },
  ]
  registerSchedulerCandidates(scheduler, candidates)
  enqueueSchedulerCandidate(scheduler, { ...candidates[0], priority: 90, reason: 'CAPACITY' })
  enqueueSchedulerCandidate(scheduler, { ...candidates[1], priority: 80, reason: 'CAPACITY' })
  const selected = selectNextSchedulerCandidate(scheduler)
  assert.equal(acquireSchedulerLease(scheduler, selected!), undefined)
  assert.equal(getSchedulerSnapshot(scheduler).used, 0)
  assert.equal(getSchedulerSnapshot(scheduler).fairQueue.length, 2)
})

test('reconciliação semântica exige classificação, decisão e efeito corretivo', () => {
  const divergence = createScenarioState('divergence')
  const classified = runCommandToCompletion(divergence, 'RECONCILE_DIVERGENCE', 'classificação baseada em evidência', 'SEMANTIC_DIVERGENCE')
  assert.equal(classified.reconciliation.status, 'AWAITING_DECISION')
  assert.equal(classified.reconciliation.result, 'SEMANTIC_DIVERGENCE')
  assert.equal(canExecute(classified, 'RECONCILE_DIVERGENCE', 'SEMANTIC_DIVERGENCE').allowed, false)
  assert.equal(canExecute(classified, 'APPLY_DIVERGENCE_EFFECT', 'RECONCILE_DATABASE_TO_GIT').allowed, false)
  const decided = runCommandToCompletion(classified, 'DECIDE_DIVERGENCE', 'decisão humana', 'AUTHORITATIVE_GIT')
  assert.equal(decided.reconciliation.status, 'AWAITING_EFFECT')
  const resolved = runCommandToCompletion(decided, 'APPLY_DIVERGENCE_EFFECT', 'efeito corretivo', 'RECONCILE_DATABASE_TO_GIT')
  assert.equal(resolved.reconciliation.status, 'RESOLVED')
  assert.ok(resolved.reconciliation.correctiveEffect)
  assert.ok(resolved.events.some((event) => event.type === 'reconciliation.classified'))
  assert.ok(resolved.events.some((event) => event.type === 'reconciliation.decision.recorded'))
  assert.ok(resolved.events.some((event) => event.type === 'reconciliation.effect.confirmed'))

  const recovering = createScenarioState('recovery')
  assert.equal(recovering.recovery.status, 'NEEDS_RECOVERY')
  const recovered = runCommandToCompletion(recovering, 'RECOVER_CHECKPOINT')
  assert.equal(recovered.recovery.status, 'RECOVERED')
  assert.equal(recovered.recovery.replayedEvents, 3)
  assert.ok(recovered.events.some((event) => event.type === 'recovery.confirmed'))
})

test('RECOVER_CHECKPOINT exige checkpoint seguro e evidência de journal compatível', () => {
  const mutations: Array<[string, (state: MockState) => void]> = [
    ['checkpoint inseguro', (state) => { state.recovery.checkpointSafe = false }],
    ['checkpoint desconhecido', (state) => { state.recovery.checkpoint = 'arbitrary-checkpoint' }],
    ['evidência ausente', (state) => { state.recovery.journalPositions = [] }],
    ['intervalo incompatível', (state) => { state.recovery.replayEnd = state.recovery.journalPosition + 1 }],
    ['projeção divergente', (state) => { state.recovery.projectionHash = 'stale-projection' }],
    ['evidência ausente', (state) => { state.recovery.recoveryEvidenceId = undefined }],
    ['identidade incompatível', (state) => { state.recovery.recoveryEvidenceId = 'other' }],
  ]

  for (const [label, mutate] of mutations) {
    const state = createScenarioState('recovery')
    mutate(state)
    assert.equal(canExecute(state, 'RECOVER_CHECKPOINT').allowed, false, label)
    const rejected = runCommandToCompletion(state, 'RECOVER_CHECKPOINT')
    assert.equal(rejected.commands[0].status, 'rejected', label)
    assert.equal(rejected.recovery.status, 'NEEDS_RECOVERY', label)
    assert.equal(rejected.recovery.replayedEvents, 0, label)
    assert.equal(rejected.events.some((event) => event.type === 'recovery.confirmed'), false, label)
  }

  const recovering = createScenarioState('recovery')
  const authoritativeEvidenceId = recovering.recovery.recoveryEvidenceId
  const recovered = runCommandToCompletion(recovering, 'RECOVER_CHECKPOINT')
  assert.equal(recovered.recovery.replayedEvents, recovered.recovery.replayEnd - recovered.recovery.replayStart + 1)
  assert.equal(recovered.recovery.recoveryEvidenceId, authoritativeEvidenceId)
  assert.equal(recovered.events.filter((event) => event.type === 'recovery.confirmed').length, 1)
  const repeated = runCommandToCompletion(recovered, 'RECOVER_CHECKPOINT')
  assert.equal(repeated.commands[0].status, 'rejected')
  assert.equal(repeated.events.filter((event) => event.type === 'recovery.confirmed').length, 1)
})

test('RECOVER_CHECKPOINT rejeita mutação da identidade entre request, acceptance e confirmation', () => {
  const requested = requestCommand(createScenarioState('recovery'), 'RECOVER_CHECKPOINT')
  requested.recovery.recoveryEvidenceId = 'other'
  const rejectedBeforeAcceptance = advanceCommand(requested, requested.commands[0].id)
  assert.equal(rejectedBeforeAcceptance.commands[0].status, 'rejected')
  assert.equal(rejectedBeforeAcceptance.recovery.status, 'NEEDS_RECOVERY')
  assert.equal(rejectedBeforeAcceptance.recovery.replayedEvents, 0)

  const validRequest = requestCommand(createScenarioState('recovery'), 'RECOVER_CHECKPOINT')
  const accepted = advanceCommand(validRequest, validRequest.commands[0].id)
  accepted.recovery.recoveryEvidenceId = 'other'
  const rejectedBeforeConfirmation = advanceCommand(accepted, accepted.commands[0].id)
  assert.equal(rejectedBeforeConfirmation.commands[0].status, 'rejected')
  assert.equal(rejectedBeforeConfirmation.recovery.status, 'NEEDS_RECOVERY')
  assert.equal(rejectedBeforeConfirmation.recovery.replayedEvents, 0)
  assert.equal(rejectedBeforeConfirmation.events.some((event) => event.type === 'recovery.confirmed'), false)
})

test('onboarding legado executa bootstrap independente antes de habilitar', () => {
  const initial = createScenarioState('migration')
  assert.equal(initial.onboarding.state, 'DISCOVERED')
  assert.deepEqual(initial.onboarding.activities.map((item) => item.kind), ['BOOTSTRAP', 'MIGRATION', 'REMEDIATION', 'AUDIT'])
  assert.notEqual(initial.onboarding.activities[1].agentAssignmentId, initial.onboarding.activities[3].agentAssignmentId)
  assert.notEqual(initial.onboarding.activities[1].logicalAgentId, initial.onboarding.activities[3].logicalAgentId)
  assert.notEqual(initial.onboarding.activities[1].sessionId, initial.onboarding.activities[3].sessionId)
  assert.equal(canExecute(initial, 'ENABLE_ONBOARDING').allowed, false)
  const inspected = runCommandToCompletion(initial, 'INSPECT_ONBOARDING')
  const validated = runCommandToCompletion(inspected, 'FIX_ONBOARDING')
  assert.equal(validated.onboarding.state, 'VALIDATING')
  const bootstrapping = runCommandToCompletion(validated, 'VALIDATE_ONBOARDING')
  assert.equal(bootstrapping.onboarding.state, 'BOOTSTRAPPING')
  const migrating = runCommandToCompletion(bootstrapping, 'BOOTSTRAP_ONBOARDING')
  assert.equal(migrating.onboarding.state, 'MIGRATING')
  const verifying = runCommandToCompletion(migrating, 'MIGRATE_ONBOARDING')
  assert.equal(verifying.onboarding.state, 'VERIFYING')
  const audited = runCommandToCompletion(verifying, 'VERIFY_ONBOARDING')
  assert.equal(audited.onboarding.state, 'AUDITING')
  const auditedWithVerdict = runCommandToCompletion(audited, 'AUDIT_ONBOARDING')
  const approved = runCommandToCompletion(auditedWithVerdict, 'APPROVE_ONBOARDING')
  const enabled = runCommandToCompletion(approved, 'ENABLE_ONBOARDING')
  assert.equal(enabled.onboarding.state, 'ENABLED')
  assert.equal(enabled.onboarding.auditVerdict, 'APPROVED')
  assert.ok(enabled.onboarding.activities.every((item) => item.state === 'COMPLETED' && item.participationRecorded))
  assert.ok(enabled.onboarding.activities.every((item) => item.artifactCycleId === 'ONB-LEGACY-2026-01'))
  assert.equal(enabled.assignments.find((item) => item.agentAssignmentId === 'ONB-ASN-MIGRATE')?.eligible, false)
  assert.equal(enabled.assignments.find((item) => item.agentAssignmentId === 'ONB-ASN-AUDIT')?.eligible, false)
})

test('ADR implementada com hash divergente é inelegível até restauração auditada', () => {
  const mutated = createScenarioState('adr-mutation')
  assert.equal(eligibleAdrs(mutated).length, 13)
  assert.equal(canExecute(mutated, 'VALIDATE_SNAPSHOT').allowed, false)
  const restored = runCommandToCompletion(mutated, 'RESTORE_ADR')
  assert.equal(restored.adrMutation.blocked, false)
  assert.equal(restored.adrs[6].actualContentHash, restored.adrs[6].contentHash)
  assert.equal(eligibleAdrs(restored).length, 13)
  assert.equal(restored.adrs[6].implementationStatus, 'IMPLEMENTED')
  assert.equal(restored.snapshot.status, 'DRAFT')
})

test('factories independentes mantêm semântica de cenário e identidades distintas', () => {
  const scenarios = ['normal', 'audit', 'capacity', 'retry', 'rounds', 'conflict', 'divergence', 'recovery', 'drift', 'pr', 'migration', 'adr-mutation'] as const
  for (const scenario of scenarios) {
    const first = createScenarioState(scenario)
    const second = createScenarioState(scenario)
    assert.equal(first.scenario, second.scenario, scenario)
    assert.notEqual(first.schedulerId, second.schedulerId, scenario)
    assert.notEqual(first.schedulerExecutionId, second.schedulerExecutionId, scenario)
    assert.equal(first.publication.mode, second.publication.mode, scenario)
  }
})

test('rejeita retry acima do limite operacional', () => {
  const state = createScenarioState('retry')
  state.activities[2].attempt = state.activities[2].maxAttempts
  assert.equal(canExecute(state, 'RETRY_ACTIVITY').allowed, false)
  const rejected = runCommandToCompletion(state, 'RETRY_ACTIVITY')
  assert.equal(rejected.commands[0].status, 'rejected')
  assert.equal(rejected.activities[2].state, 'FAILED')
})

test('rejeita autorização de segunda extensão de rodada', () => {
  let state = createScenarioState('rounds')
  state = runCommandToCompletion(state, 'AUTHORIZE_ROUND')
  state.activities[3].round = state.activities[3].maxRounds
  assert.equal(canExecute(state, 'AUTHORIZE_ROUND').allowed, false)
})

test('publicação direta não confirma remoto antes do push', () => {
  let state = createScenarioState('normal')
  state = runCommandToCompletion(state, 'VALIDATE_SNAPSHOT')
  state = runCommandToCompletion(state, 'START_RUN')
  state = completeAllActivities(state)
  for (let step = 0; step < 3; step += 1) state = runCommandToCompletion(state, 'ADVANCE_NORMAL')
  assert.equal(canExecute(state, 'APPROVE_PUBLICATION').allowed, true)
  state = runCommandToCompletion(state, 'APPROVE_PUBLICATION')
  assert.equal(canExecute(state, 'CONFIRM_REMOTE').allowed, false)
  assert.notEqual(state.publication.state, 'REMOTE_PUBLICATION_CONFIRMED')
})

test('snapshot confirmado não aceita alteração de autoridade depois do lock', () => {
  let state = createScenarioState('normal')
  state = runCommandToCompletion(state, 'VALIDATE_SNAPSHOT')
  state = runCommandToCompletion(state, 'START_RUN')
  const lockedHashes = { ...state.snapshot.adrHashes }
  state.adrs[0].actualContentHash = 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
  assert.equal(canExecute(state, 'VALIDATE_SNAPSHOT').allowed, false)
  assert.deepEqual(state.snapshot.adrHashes, lockedHashes)
  assert.equal(state.snapshot.status, 'CONFIRMED')
})

test('integração da onda é idempotentemente rejeitada após integração', () => {
  let state = createScenarioState('conflict')
  state = runCommandToCompletion(state, 'RESOLVE_CONFLICT')
  state = runCommandToCompletion(state, 'AUDIT_INTEGRATION')
  state = runCommandToCompletion(state, 'INTEGRATE_WAVE')
  assert.equal(canExecute(state, 'INTEGRATE_WAVE').allowed, false)
  assert.equal(runCommandToCompletion(state, 'INTEGRATE_WAVE').commands[0].status, 'rejected')
})

test('mantém os 14 hashes completos e detecta qualquer divergência antes do snapshot lock', () => {
  assert.equal(Object.keys(ADR_HASHES).length, 14)
  assert.ok(Object.values(ADR_HASHES).every((hash) => /^[a-f0-9]{64}$/i.test(hash)))
  const state = createScenarioState('normal')
  state.adrs[1].actualContentHash = 'f'.repeat(64)
  assert.deepEqual(validateAdrIntegrity(state), { valid: false, invalidAdrIds: ['ADR-0002'] })
  assert.equal(canExecute(state, 'VALIDATE_SNAPSHOT').allowed, false)
  const rejected = runCommandToCompletion(state, 'VALIDATE_SNAPSHOT')
  assert.equal(rejected.commands[0].status, 'rejected')
  assert.match(rejected.commands[0].rejectionReason ?? '', /ADR-0002/)
})

test('snapshot lock também revalida autoridade genérica e não altera a lista congelada', () => {
  let state = runCommandToCompletion(createScenarioState('normal'), 'VALIDATE_SNAPSHOT')
  state = runCommandToCompletion(state, 'START_RUN')
  const locked = { ...state, adrs: state.adrs.map((adr, index) => index === 0 ? { ...adr, actualContentHash: '0'.repeat(64) } : adr) }
  assert.equal(canExecute(locked, 'VALIDATE_SNAPSHOT').allowed, false)
  assert.deepEqual(locked.snapshot.adrIds, state.snapshot.adrIds)
  assert.deepEqual(locked.snapshot.adrHashes, state.snapshot.adrHashes)
})

test('assignment com participação no mesmo ciclo é inelegível, e espera persiste sem agente novo', () => {
  const state = createScenarioState('audit')
  assert.equal(agentIsEligible(state, 'AUDITOR', 'AC-021-01', 'ASN-044'), true)
  const waiting = { ...state, activities: state.activities.map((activity) => activity.id === 'ACT-8E99' ? { ...activity, state: 'WAITING_ELIGIBILITY' as const } : activity), assignments: state.assignments.map((assignment) => assignment.agentAssignmentId === 'ASN-028-R1' ? { ...assignment, eligible: false, ineligibleReason: 'já participou do ciclo' } : assignment) }
  assert.equal(canExecute(waiting, 'DISPATCH_ACTIVITY').allowed, false)
  assert.match(canExecute(waiting, 'DISPATCH_ACTIVITY').reason, /elegível/)
})

test('retry cria sessão e assignment isolados sem trocar a chave idempotente', () => {
  const failed = createScenarioState('retry')
  const previous = failed.activities[2]
  const retried = runCommandToCompletion(failed, 'RETRY_ACTIVITY')
  const current = retried.activities[2]
  assert.notEqual(current.agentAssignmentId, previous.agentAssignmentId)
  assert.notEqual(current.sessionId, previous.sessionId)
  assert.equal(current.idempotencyKey, previous.idempotencyKey)
  assert.ok(retried.assignments.some((assignment) => assignment.agentAssignmentId === current.agentAssignmentId))
})

test('reconciliação rejeita resultados incompatíveis com a classificação da evidência', () => {
  const state = createScenarioState('divergence')
  assert.deepEqual(reconciliationOptions(state), ['SEMANTIC_DIVERGENCE'])
  assert.equal(canExecute(state, 'RECONCILE_DIVERGENCE', 'EXPECTED_INCOMPLETE_EFFECT').allowed, false)
  const rejected = runCommandToCompletion(state, 'RECONCILE_DIVERGENCE', 'tentativa incompatível', 'EXPECTED_INCOMPLETE_EFFECT')
  assert.equal(rejected.commands[0].status, 'rejected')
  const confirmed = runCommandToCompletion(state, 'RECONCILE_DIVERGENCE', 'classificação observada', 'SEMANTIC_DIVERGENCE')
  assert.equal(confirmed.reconciliation.result, 'SEMANTIC_DIVERGENCE')
})

test('cancelamento funcional recalcula o DAG sem liberar dependências', () => {
  let state = createScenarioState('conflict')
  state = runCommandToCompletion(runCommandToCompletion(state, 'RESOLVE_CONFLICT'), 'AUDIT_INTEGRATION')
  const beforeRevision = state.wave.dagRevision
  state = runCommandToCompletion(state, 'CANCEL_TICKET', 'revisão auditada', 'TCK-106')
  assert.equal(state.tickets.find((ticket) => ticket.id === 'TCK-106')?.functionalState, 'CANCELLED')
  assert.equal(state.tickets.find((ticket) => ticket.id === 'TCK-107')?.functionalState, 'BLOCKED')
  assert.ok(state.wave.dagRevision > beforeRevision)
  assert.ok(state.events.some((event) => event.type === 'dag.recalculated'))
})

test('desbloqueio do DAG deriva o último bloqueio da transição real', () => {
  let state = createScenarioState('conflict')
  state = runCommandToCompletion(state, 'RESOLVE_CONFLICT')
  state = runCommandToCompletion(state, 'AUDIT_INTEGRATION')
  state = runCommandToCompletion(state, 'INTEGRATE_WAVE')
  const released = state.tickets.find((ticket) => ticket.id === 'TCK-107')
  assert.equal(released?.functionalState, 'READY')
  assert.equal(released?.lastUnblockedBy, 'TCK-106')
  assert.match(state.events.find((event) => event.type === 'dag.recalculated')?.detail ?? '', /TCK-106/)
})

test('fila serial de publicação exige posição e invalida base, head ou árvore divergentes', () => {
  let state = createScenarioState('normal')
  state = runCommandToCompletion(state, 'VALIDATE_SNAPSHOT')
  state = runCommandToCompletion(state, 'START_RUN')
  state = completeAllActivities(state)
  for (let step = 0; step < 3; step += 1) state = runCommandToCompletion(state, 'ADVANCE_NORMAL')
  state.publication.queuePosition = 2
  assert.equal(canExecute(state, 'APPROVE_PUBLICATION').allowed, false)
  state.publication.queuePosition = 1
  assert.equal(canExecute(state, 'APPROVE_PUBLICATION').allowed, true)
  state = runCommandToCompletion(state, 'APPROVE_PUBLICATION')
  state.publication.currentHeadSha = 'head-drift'
  assert.equal(canExecute(state, 'LOCAL_INTEGRATE').allowed, false)
  assert.equal(canExecute(state, 'PUSH_REMOTE').allowed, false)
  assert.notEqual(state.publication.state, 'REMOTE_PUBLICATION_CONFIRMED')
})

test('execução, SPEC e publicação convergem após confirmação remota', () => {
  let state = createScenarioState('normal')
  state = runCommandToCompletion(state, 'VALIDATE_SNAPSHOT')
  state = runCommandToCompletion(state, 'START_RUN')
  state = completeAllActivities(state)
  for (let step = 0; step < 3; step += 1) state = runCommandToCompletion(state, 'ADVANCE_NORMAL')
  state = runCommandToCompletion(state, 'APPROVE_PUBLICATION')
  state = runCommandToCompletion(state, 'LOCAL_INTEGRATE')
  state = runCommandToCompletion(state, 'PUSH_REMOTE')
  assert.equal(state.run.functionalState, 'COMPLETED')
  assert.equal(state.run.operationalState, 'COMPLETED')
  assert.equal(state.publication.state, 'REMOTE_PUBLICATION_CONFIRMED')
  assert.equal(state.specs[0].status, 'PUBLISHED')
  assert.equal(state.specs[0].progress, 100)
  assert.ok(state.activities.every((activity) => activity.state === 'COMPLETED'))
})

test('snapshot rejeita conjunto de ADR incompleto antes de qualquer validação', () => {
  const state = createScenarioState('normal')
  state.adrs = state.adrs.slice(1)
  assert.equal(canExecute(state, 'VALIDATE_SNAPSHOT').allowed, false)
  const drifted = createScenarioState('normal')
  drifted.snapshot.currentBaseSha = 'base-drift'
  assert.equal(canExecute(drifted, 'VALIDATE_SNAPSHOT').allowed, false)
})

test('START_RUN revalida toda a autoridade congelada no instante da execução', () => {
  const mutations: Array<[string, (state: MockState) => void]> = [
    ['ADR hash', (state) => { state.adrs[0].actualContentHash = 'f'.repeat(64) }],
    ['ADR elegibilidade', (state) => { state.adrs[0].implementationStatus = 'IMPLEMENTED' }],
    ['base', (state) => { state.snapshot.currentBaseSha = 'stale-base' }],
    ['config', (state) => { state.snapshot.currentConfigVersion = 'repo-config@stale' }],
    ['skills', (state) => { state.snapshot.currentSkillVersions = { ...state.snapshot.currentSkillVersions, audit: 'stale' } }],
    ['repository clean', (state) => { state.repository.clean = false }],
    ['repository aligned', (state) => { state.repository.aligned = false }],
  ]

  for (const [label, mutate] of mutations) {
    let state = runCommandToCompletion(createScenarioState('normal'), 'VALIDATE_SNAPSHOT')
    mutate(state)
    assert.equal(canExecute(state, 'START_RUN').allowed, false, label)
    const rejected = runCommandToCompletion(state, 'START_RUN')
    assert.equal(rejected.commands[0].status, 'rejected', label)
    assert.equal(rejected.snapshot.status, 'READY_TO_START', label)
    assert.equal(rejected.run.functionalState, 'READY', label)
    assert.equal(rejected.events.some((event) => event.type === 'run.started'), false, label)
    assert.equal(rejected.capacity.leases.length, state.capacity.leases.length, label)
  }
})

test('START_RUN confirma um snapshot ainda íntegro sem alterar sua fotografia', () => {
  const validated = runCommandToCompletion(createScenarioState('normal'), 'VALIDATE_SNAPSHOT')
  const started = runCommandToCompletion(validated, 'START_RUN')
  assert.equal(started.commands[0].status, 'confirmed')
  assert.equal(started.snapshot.adrIds.length, 14)
  assert.deepEqual(started.snapshot.adrHashes, Object.fromEntries(started.adrs.map((adr) => [adr.id, adr.contentHash])))
  assert.equal(started.run.functionalState, 'RUNNING')
})

test('cenários com trabalho operacional iniciam com estado funcional RUNNING', () => {
  for (const scenario of ['capacity', 'retry', 'rounds', 'recovery'] as const) {
    const state = createScenarioState(scenario)
    assert.equal(state.run.functionalState, 'RUNNING', scenario)
  }
})

test('todas as doze factories iniciam agregados coerentes e gates de publicação', () => {
  const scenarios = ['normal', 'audit', 'capacity', 'retry', 'rounds', 'conflict', 'divergence', 'recovery', 'drift', 'pr', 'migration', 'adr-mutation'] as const
  for (const scenario of scenarios) {
    const state = createScenarioState(scenario)
    if (state.run.functionalState === 'READY') {
      assert.equal(state.run.operationalState, 'IDLE', scenario)
      assert.equal(state.activities.some((item) => ['RUNNING', 'PAUSED', 'FAILED', 'WAITING_CAPACITY'].includes(item.state)), false, scenario)
    }
    if (!['drift', 'pr'].includes(scenario)) assert.equal(state.publication.state, 'NOT_READY', scenario)
    if (['drift', 'pr'].includes(scenario)) assert.equal(state.activities.every((item) => item.state === 'COMPLETED'), true, scenario)
  }
})

test('as doze famílias executam jornadas determinísticas completas no domínio', () => {
  let state = createScenarioState('normal')
  state = runCommandToCompletion(state, 'VALIDATE_SNAPSHOT')
  state = runCommandToCompletion(state, 'START_RUN')
  state = completeAllActivities(state)
  for (let step = 0; step < 3; step += 1) state = runCommandToCompletion(state, 'ADVANCE_NORMAL')
  state = runCommandToCompletion(runCommandToCompletion(state, 'APPROVE_PUBLICATION'), 'LOCAL_INTEGRATE')
  state = runCommandToCompletion(state, 'PUSH_REMOTE')
  assert.equal(state.publication.state, 'REMOTE_PUBLICATION_CONFIRMED')

  state = createScenarioState('audit')
  state = runCommandToCompletion(runCommandToCompletion(state, 'REMEDIATE_FINDING'), 'REMEDIATE_FINDING')
  state = runCommandToCompletion(state, 'REAUDIT_FINDING')
  assert.ok(state.findings.every((finding) => finding.state === 'APPROVED'))

  state = runCommandToCompletion(runCommandToCompletion(createScenarioState('capacity'), 'RELEASE_CAPACITY'), 'DISPATCH_ACTIVITY')
  assert.equal(state.activities[2].state, 'RUNNING')
  assert.equal(runCommandToCompletion(createScenarioState('retry'), 'RETRY_ACTIVITY').activities[2].attempt, 4)
  assert.equal(runCommandToCompletion(createScenarioState('rounds'), 'AUTHORIZE_ROUND').activities[3].round, 11)

  state = createScenarioState('conflict')
  state = runCommandToCompletion(runCommandToCompletion(runCommandToCompletion(state, 'RESOLVE_CONFLICT'), 'AUDIT_INTEGRATION'), 'INTEGRATE_WAVE')
  assert.equal(state.wave.status, 'INTEGRATED')

  state = createScenarioState('divergence')
  state = runCommandToCompletion(runCommandToCompletion(runCommandToCompletion(state, 'RECONCILE_DIVERGENCE', '', 'SEMANTIC_DIVERGENCE'), 'DECIDE_DIVERGENCE', '', 'AUTHORITATIVE_GIT'), 'APPLY_DIVERGENCE_EFFECT', '', 'RECONCILE_DATABASE_TO_GIT')
  assert.equal(state.reconciliation.status, 'RESOLVED')
  assert.equal(runCommandToCompletion(createScenarioState('recovery'), 'RECOVER_CHECKPOINT').recovery.status, 'RECOVERED')

  state = createScenarioState('drift')
  state = runCommandToCompletion(state, 'REVALIDATE_PUBLICATION')
  state = runCommandToCompletion(runCommandToCompletion(state, 'APPROVE_PUBLICATION'), 'LOCAL_INTEGRATE')
  assert.equal(runCommandToCompletion(state, 'PUSH_REMOTE').publication.state, 'REMOTE_PUBLICATION_CONFIRMED')

  state = createScenarioState('pr')
  state = runCommandToCompletion(runCommandToCompletion(state, 'APPROVE_PUBLICATION'), 'MERGE_PR')
  assert.equal(runCommandToCompletion(state, 'CONFIRM_REMOTE').publication.state, 'REMOTE_PUBLICATION_CONFIRMED')

  state = createScenarioState('migration')
  for (const command of ['INSPECT_ONBOARDING', 'FIX_ONBOARDING', 'VALIDATE_ONBOARDING', 'BOOTSTRAP_ONBOARDING', 'MIGRATE_ONBOARDING', 'VERIFY_ONBOARDING', 'AUDIT_ONBOARDING', 'APPROVE_ONBOARDING', 'ENABLE_ONBOARDING'] as const) state = runCommandToCompletion(state, command)
  assert.equal(state.onboarding.state, 'ENABLED')
  assert.equal(runCommandToCompletion(createScenarioState('adr-mutation'), 'RESTORE_ADR').snapshot.status, 'DRAFT')
})

test('onboarding rejeita auditoria que reutiliza assignment de migração', () => {
  let state = createScenarioState('migration')
  for (const command of ['INSPECT_ONBOARDING', 'FIX_ONBOARDING', 'VALIDATE_ONBOARDING', 'BOOTSTRAP_ONBOARDING', 'MIGRATE_ONBOARDING', 'VERIFY_ONBOARDING'] as const) state = runCommandToCompletion(state, command)
  const migrationAssignment = state.onboarding.activities.find((item) => item.kind === 'MIGRATION')!
  state.onboarding.activities = state.onboarding.activities.map((item) => item.kind === 'AUDIT' ? { ...item, agentAssignmentId: migrationAssignment.agentAssignmentId, logicalAgentId: migrationAssignment.logicalAgentId, sessionId: migrationAssignment.sessionId } : item)
  assert.equal(canExecute(state, 'AUDIT_ONBOARDING').allowed, false)
  const rejected = runCommandToCompletion(state, 'AUDIT_ONBOARDING')
  assert.equal(rejected.commands[0].status, 'rejected')
})

test('cancelamento é permitido em espera de capacidade, falha e recovery sem alterar tickets funcionais', () => {
  for (const scenario of ['capacity', 'retry', 'recovery'] as const) {
    const state = createScenarioState(scenario)
    const ticketStates = state.tickets.map((ticket) => [ticket.id, ticket.functionalState])
    assert.equal(canExecute(state, 'REQUEST_CANCEL').allowed, true, scenario)
    const cancelled = runCommandToCompletion(state, 'REQUEST_CANCEL')
    assert.equal(cancelled.run.functionalState, 'CANCELLED', scenario)
    assert.equal(cancelled.run.operationalState, 'CANCELLED', scenario)
    assert.deepEqual(cancelled.tickets.map((ticket) => [ticket.id, ticket.functionalState]), ticketStates, scenario)
  }
})

test('despacho exige execução funcional ativa e assignment ainda não locado', () => {
  let state = createScenarioState('capacity')
  state.run.functionalState = 'RUNNING'
  state = runCommandToCompletion(state, 'RELEASE_CAPACITY')
  const scheduler = getSchedulerForState(state)
  const canonical = getSchedulerSnapshot(scheduler)
  state.capacity.leases = [...state.capacity.leases, 'FAKE-LEASE']
  canExecute(state, 'DISPATCH_ACTIVITY', state.activities[2].id)
  assert.deepEqual(getSchedulerSnapshot(scheduler), canonical)
})

test('pausa e cancelamento preservam o estado solicitado até o efeito confirmado', () => {
  let state = createScenarioState('normal')
  state = runCommandToCompletion(state, 'VALIDATE_SNAPSHOT')
  state = runCommandToCompletion(state, 'START_RUN')
  state = requestCommand(state, 'REQUEST_PAUSE')
  const pauseRequestId = state.commands[0].id
  state = advanceCommand(state, pauseRequestId)
  assert.equal(state.run.operationalState, 'PAUSE_REQUESTED')
  assert.equal(state.run.functionalState, 'RUNNING')
  state = advanceCommand(state, pauseRequestId)
  assert.equal(state.run.operationalState, 'PAUSED')
})

test('avanço de publicação exige que a execução esteja na etapa de Publicação', () => {
  let state = createScenarioState('normal')
  assert.equal(canExecute(state, 'ADVANCE_MAIN').allowed, false)
  state = runCommandToCompletion(state, 'VALIDATE_SNAPSHOT')
  state = runCommandToCompletion(state, 'START_RUN')
  state = completeAllActivities(state)
  for (let step = 0; step < 3; step += 1) state = runCommandToCompletion(state, 'ADVANCE_NORMAL')
  assert.equal(canExecute(state, 'ADVANCE_MAIN').allowed, true)
})

test('scheduler compartilhado não loca execução não iniciada durante dispatch global', () => {
  const scheduler = createMockScheduler({ maximum: 2, initialUsed: 0 })
  let first = createScenarioState('normal', scheduler)
  const second = createScenarioState('normal', scheduler)
  const third = createScenarioState('normal', scheduler)

  first = runCommandToCompletion(first, 'VALIDATE_SNAPSHOT')
  first = runCommandToCompletion(first, 'START_RUN')

  assert.ok(scheduler.leases.length > 0)
  assert.ok(scheduler.leases.every((lease) => lease.executionId === first.schedulerExecutionId))
  assert.equal(second.activities.some((item) => item.state === 'RUNNING'), false)
  assert.equal(third.activities.some((item) => item.state === 'RUNNING'), false)
  assert.equal(second.run.functionalState, 'READY')
  assert.equal(third.run.functionalState, 'READY')
})

test('execuções pausadas ou canceladas não recebem lease novo', () => {
  const pausedScheduler = createMockScheduler({ maximum: 1, initialUsed: 0 })
  let paused = createScenarioState('normal', pausedScheduler)
  paused = runCommandToCompletion(runCommandToCompletion(paused, 'VALIDATE_SNAPSHOT'), 'START_RUN')
  paused = runCommandToCompletion(paused, 'REQUEST_PAUSE')
  const pausedActivity = paused.activities.find((item) => item.state === 'PAUSED')!
  const pausedLease = pausedScheduler.leases.find((lease) => lease.executionId === paused.schedulerExecutionId && lease.activityId === pausedActivity.id)
  assert.ok(pausedLease)
  assert.equal(releaseSchedulerLease(pausedScheduler, pausedLease!), true)
  const pausedCandidate = enqueueSchedulerCandidate(pausedScheduler, { executionId: paused.schedulerExecutionId, activityId: pausedActivity.id, assignmentId: pausedActivity.agentAssignmentId, priority: paused.run.priority, reason: 'READY' })
  assert.ok(pausedCandidate)
  assert.equal(acquireSchedulerLease(pausedScheduler, pausedCandidate!), undefined)
  assert.equal(pausedScheduler.leases.some((lease) => lease.executionId === paused.schedulerExecutionId && lease.activityId === pausedActivity.id), false)

  const cancelledScheduler = createMockScheduler({ maximum: 1, initialUsed: 0 })
  let cancelled = createScenarioState('normal', cancelledScheduler)
  cancelled = runCommandToCompletion(runCommandToCompletion(cancelled, 'VALIDATE_SNAPSHOT'), 'START_RUN')
  const cancelledActivity = cancelled.activities.find((item) => item.state === 'RUNNING')!
  cancelled = runCommandToCompletion(cancelled, 'REQUEST_CANCEL')
  const cancelledCandidate = enqueueSchedulerCandidate(cancelledScheduler, { executionId: cancelled.schedulerExecutionId, activityId: cancelledActivity.id, assignmentId: cancelledActivity.agentAssignmentId, priority: cancelled.run.priority, reason: 'READY' })
  assert.ok(cancelledCandidate)
  assert.equal(acquireSchedulerLease(cancelledScheduler, cancelledCandidate!), undefined)
  assert.equal(cancelledScheduler.leases.some((lease) => lease.executionId === cancelled.schedulerExecutionId), false)
})

test('lease rejeita identidade forjada e reconciliação rejeita overflow antes de mutar capacidade', () => {
  const scheduler = createMockScheduler({ maximum: 1, initialUsed: 0 })
  const state = createScenarioState('capacity', scheduler)
  const candidate = scheduler.queue[0]
  assert.ok(candidate)
  const before = getSchedulerSnapshot(scheduler)

  assert.equal(enqueueSchedulerCandidate(scheduler, { executionId: 'FORGED-EXEC', activityId: candidate.activityId, assignmentId: candidate.assignmentId, priority: candidate.priority, reason: 'READY' }), undefined)
  assert.equal(acquireSchedulerLease(scheduler, { ...candidate, executionId: 'FORGED-EXEC' }), undefined)
  assert.deepEqual(getSchedulerSnapshot(scheduler), before)
  assert.equal(acquireSchedulerLease(scheduler, { ...candidate, activityId: 'FORGED-ACT' }), undefined)
  assert.deepEqual(getSchedulerSnapshot(scheduler), before)
  assert.equal(acquireSchedulerLease(scheduler, { ...candidate, assignmentId: 'FORGED-ASN' }), undefined)
  assert.deepEqual(getSchedulerSnapshot(scheduler), before)

  const actualLease = acquireSchedulerLease(scheduler, candidate)
  assert.ok(actualLease)
  const leased = getSchedulerSnapshot(scheduler)
  assert.equal(releaseSchedulerLease(scheduler, { ...actualLease!, assignmentId: 'FORGED-ASN' }), false)
  assert.deepEqual(getSchedulerSnapshot(scheduler), leased)
  assert.equal(releaseSchedulerLease(scheduler, actualLease!), true)

  assert.throws(() => reconcileSchedulerCapacity(scheduler, { status: 'KNOWN', maximum: 0, leaseAssignments: ['A', 'B'] }, getSchedulerRegistrationAuthority(scheduler)), /exceed/i)
  assert.equal(getSchedulerSnapshot(scheduler).used, before.used)
  assert.ok(state.schedulerExecutionId)
})

test('efeito de comando não pode reescrever a identidade canônica por projeção local forjada', () => {
  let state = createScenarioState('normal')
  const scheduler = getSchedulerForState(state)
  const execution = scheduler.executionActivities[state.schedulerExecutionId]
  const activity = state.activities[0]
  const canonicalAssignment = execution.assignmentIds[activity.id]
  activity.agentAssignmentId = 'FORGED-ASN'
  state = runCommandToCompletion(state, 'SET_PRIORITY', 'prioridade válida', '60')
  assert.equal(scheduler.executionActivities[state.schedulerExecutionId].assignmentIds[activity.id], canonicalAssignment)
})

test('execuções compartilhadas recebem identidades persistentes distintas', () => {
  const scheduler = createMockScheduler({ maximum: 3, initialUsed: 0 })
  const first = createScenarioState('normal', scheduler)
  const second = createScenarioState('normal', scheduler)

  assert.notEqual(first.schedulerExecutionId, second.schedulerExecutionId)
  assert.notEqual(first.run.id, second.run.id)
  assert.equal(first.activities.every((item, index) => item.id !== second.activities[index]?.id), true)
  assert.equal(first.activities.every((item, index) => item.agentAssignmentId !== second.activities[index]?.agentAssignmentId), true)
  assert.equal(first.activities.every((item, index) => item.sessionId !== second.activities[index]?.sessionId), true)
})

test('canExecute é leitura pura do scheduler até que uma operação explícita o reavalie', () => {
  const scheduler = createMockScheduler({ maximum: 1, initialUsed: 0 })
  let first = createScenarioState('normal', scheduler)
  let second = createScenarioState('normal', scheduler)
  first = runCommandToCompletion(runCommandToCompletion(first, 'VALIDATE_SNAPSHOT'), 'START_RUN')
  second = runCommandToCompletion(runCommandToCompletion(second, 'VALIDATE_SNAPSHOT'), 'START_RUN')
  const candidate = scheduler.queue.find((item) => item.executionId === second.schedulerExecutionId)
  assert.ok(candidate)
  assert.throws(() => { candidate.reason = 'READY' }, /read only|frozen/i)
  const revisionBefore = scheduler.revision

  canExecute(first, 'REQUEST_PAUSE')
  assert.equal(scheduler.revision, revisionBefore)
  assert.equal(scheduler.queue.find((item) => item.sequence === candidate.sequence)?.reason, 'CAPACITY')

  reevaluateScheduler(scheduler)
  assert.equal(scheduler.queue.find((item) => item.sequence === candidate.sequence)?.reason, 'CAPACITY')
})

test('registro do scheduler preserva autoridade e identidade após a criação', () => {
  const scheduler = createMockScheduler({ maximum: 2, initialUsed: 0 })
  const registration = createCanonicalSchedulerFixture(scheduler, 'AUTHORITY-A', 'ACT-AUTHORITY-A', 'ASN-AUTHORITY-A')

  const authority = getSchedulerRegistrationAuthority(scheduler)
  registerSchedulerExecution(scheduler, registration, authority)
  const revisionAfterCreate = scheduler.revision
  registerSchedulerExecution(scheduler, { ...registration, activities: [...registration.activities] }, authority)
  assert.equal(scheduler.revision, revisionAfterCreate)
  const forgedAuthority = { kind: 'scheduler-registration-authority' } as Parameters<typeof registerSchedulerExecution>[2]
  assert.throws(() => registerSchedulerExecution(scheduler, { ...registration, executionId: 'EXEC-FORGED-AUTHORITY' }, forgedAuthority), /canonical authority/i)

  assert.throws(() => registerSchedulerExecution(scheduler, { ...registration, runId: 'FORGED-RUN' }, authority), /identity|immutable|registered|provenance/i)
  assert.throws(() => registerSchedulerExecution(scheduler, { ...registration, activities: [{ ...registration.activities[0], assignmentId: 'FORGED-ASN' }] }, authority), /identity|immutable|registered|provenance/i)
  assert.throws(() => registerSchedulerExecution(scheduler, { ...registration, activities: [...registration.activities, { ...registration.activities[0], activityId: 'ACT-AUTHORITY-B', assignmentId: 'ASN-AUTHORITY-B' }] }, authority), /identity|immutable|registered|provenance/i)

  updateSchedulerExecutionRegistration(scheduler, { executionId: registration.executionId, snapshotStatus: 'CONFIRMED', functionalState: 'RUNNING', operationalState: 'PAUSED' }, authority)
  assert.equal(scheduler.executionActivities[registration.executionId].operationalState, 'PAUSED')
  assert.ok(scheduler.revision > revisionAfterCreate)
})

test('reconciliação só preserva leases canônicos e rejeita assignment inventado', () => {
  const scheduler = createMockScheduler({ maximum: 1, initialUsed: 0 })
  const before = getSchedulerSnapshot(scheduler)

  const authority = getSchedulerRegistrationAuthority(scheduler)
  assert.throws(() => reconcileSchedulerCapacity(scheduler, { status: 'KNOWN', maximum: 1, leaseAssignments: ['FORGED-ASSIGNMENT'] }, authority), /canonical|authorit|lease|registered/i)
  assert.deepEqual(getSchedulerSnapshot(scheduler), before)

  reconcileSchedulerCapacity(scheduler, { status: 'KNOWN', maximum: 0, conservativeCeiling: 0 }, authority)
  assert.deepEqual(getSchedulerSnapshot(scheduler).leases, before.leases)
  assert.equal(getSchedulerSnapshot(scheduler).used, 0)
})

test('criação rejeita capacidade e reservas de sistema malformadas', () => {
  assert.throws(() => createMockScheduler({ maximum: -1 }), /non-negative|integer/i)
  assert.throws(() => createMockScheduler({ maximum: 1.5 }), /non-negative|integer/i)
  assert.throws(() => createMockScheduler({ maximum: 0, initialUsed: 1 }), /initial|capacity|maximum/i)
  assert.throws(() => createMockScheduler({ maximum: 2, initialUsed: 1, systemReservationAssignments: ['DUP', 'DUP'] }), /reservation|unique|length/i)
})

test('scheduler ausente nega guardas sem criar autoridade durante leitura', () => {
  const state = createScenarioState('normal')
  const stale = { ...state, schedulerId: 'MISSING-SCHEDULER' }

  const result = canExecute(stale, 'START_RUN')
  assert.equal(result.allowed, false)
  assert.match(result.reason, /scheduler/i)
  assert.throws(() => getSchedulerForState(stale), /not found|scheduler/i)
})

test('execuções compartilhadas isolam todo identificador persistente aplicável', () => {
  const scheduler = createMockScheduler({ maximum: 3, initialUsed: 0 })
  const first = requestCommand(createScenarioState('normal', scheduler), 'VALIDATE_SNAPSHOT')
  const second = requestCommand(createScenarioState('normal', scheduler), 'VALIDATE_SNAPSHOT')
  const inventory = (state: MockState) => ({
    executions: [state.schedulerExecutionId, state.run.id, state.snapshot.id],
    activities: state.activities.map((item) => item.id), assignments: state.activities.map((item) => item.agentAssignmentId),
    sessions: state.activities.map((item) => item.sessionId), idempotency: state.activities.map((item) => item.idempotencyKey),
    onboardingActivities: state.onboarding.activities.map((item) => item.id), onboardingAssignments: state.onboarding.activities.map((item) => item.agentAssignmentId),
    onboardingSessions: state.onboarding.activities.map((item) => item.sessionId), onboardingWorkspace: [state.onboarding.workspace],
    cycles: [state.onboarding.artifactCycleId, ...state.specs.map((item) => item.artifactCycleId), ...state.findings.map((item) => item.cycleId)],
    events: state.events.map((item) => item.id), commands: state.commands.map((item) => item.id), correlations: state.commands.map((item) => item.correlationId), artifacts: state.artifacts.map((item) => item.artifactId),
    publication: [state.publication.candidateId, state.publication.conformanceRunId, state.publication.remoteEvidenceId ?? '', state.publication.mergedRemoteEvidenceId ?? ''],
    recovery: [state.recovery.recoveryEvidenceId ?? ''],
  })
  const firstIds = inventory(first)
  const secondIds = inventory(second)
  Object.keys(firstIds).forEach((key) => {
    const firstSet = new Set(firstIds[key as keyof typeof firstIds].filter(Boolean))
    const secondSet = new Set(secondIds[key as keyof typeof secondIds].filter(Boolean))
    assert.ok([...firstSet].every((id) => !secondSet.has(id)), `shared identity collision in ${key}`)
  })
})

test('registro exige ownership canônico e rejeita relações estrangeiras atomicamente', () => {
  const scheduler = createMockScheduler({ maximum: 2, initialUsed: 0 })
  const authority = getSchedulerRegistrationAuthority(scheduler)
  const beforeRevision = scheduler.revision
  const forged = { executionId: 'EXEC-OWN', runId: 'RUN-OWN', snapshotStatus: 'CONFIRMED' as const, functionalState: 'RUNNING' as const, operationalState: 'PROCESSING' as const, activities: [{ activityId: 'ACT-OWN', assignmentId: 'ASN-OWN', sessionId: 'SES-FOREIGN', role: 'AUDITOR' as const, artifactCycleId: 'AC-UNRELATED', state: 'READY' as const, eligible: true }] }
  assert.throws(() => registerSchedulerExecution(scheduler, forged, authority), /canonical|provenance|ownership/i)
  assert.equal(scheduler.revision, beforeRevision)
  const canonicalState = createScenarioState('normal', scheduler)
  const canonical = createCanonicalSchedulerExecutionRegistration(canonicalState)
  const activity = canonical.activities[0]
  assert.throws(() => registerSchedulerExecution(scheduler, { ...canonical, executionId: 'EXECUTION-FOREIGN', activities: [{ ...activity, assignmentId: 'ASN-FOREIGN' }] }, authority), /canonical|provenance|ownership/i)
  assert.equal(scheduler.executionIds.includes('EXECUTION-FOREIGN'), false)
  assert.throws(() => registerSchedulerExecution(scheduler, { ...canonical, activities: [{ ...activity, role: 'AUDITOR' }] }, authority), /canonical|provenance|ownership/i)
})

test('identidade do scheduler é globalmente única e não redireciona estados independentes', () => {
  const first = createMockScheduler({ id: 'SCHEDULER-EXPLICIT-UNIQUE', maximum: 1, initialUsed: 0 })
  assert.throws(() => createMockScheduler({ id: 'SCHEDULER-EXPLICIT-UNIQUE', maximum: 1, initialUsed: 0 }), /already exists|identity/i)
  const stateA = createScenarioState('normal')
  const stateB = createScenarioState('normal')
  const schedulerA = getSchedulerForState(stateA)
  const schedulerB = getSchedulerForState(stateB)
  assert.notEqual(schedulerA, schedulerB)
  const revisionB = schedulerB.revision
  const startedA = runCommandToCompletion(runCommandToCompletion(stateA, 'VALIDATE_SNAPSHOT'), 'START_RUN')
  assert.equal(getSchedulerForState(startedA), schedulerA)
  assert.equal(schedulerB.revision, revisionB)
  assert.notEqual(schedulerA.id, schedulerB.id)
  assert.notEqual(startedA.publication.publicationIdentity.canonicalId, stateB.publication.publicationIdentity.canonicalId)
  assert.equal(first.id, 'SCHEDULER-EXPLICIT-UNIQUE')
})

test('ceiling inválido falha atomicamente e mudanças válidas distinguem no-op', () => {
  const scheduler = createMockScheduler({ maximum: 5, initialUsed: 0 })
  const authority = getSchedulerRegistrationAuthority(scheduler)
  const before = { revision: scheduler.revision, maximum: scheduler.maximum, ceiling: scheduler.conservativeCeiling, used: scheduler.used }
  assert.throws(() => reconcileSchedulerCapacity(scheduler, { status: 'KNOWN', maximum: 5, conservativeCeiling: 99 }, authority), /ceiling|maximum/i)
  assert.deepEqual({ revision: scheduler.revision, maximum: scheduler.maximum, ceiling: scheduler.conservativeCeiling, used: scheduler.used }, before)
  reconcileSchedulerCapacity(scheduler, { status: 'KNOWN', maximum: 5, conservativeCeiling: 1 }, authority)
  assert.ok(scheduler.revision > before.revision)
  const revision = scheduler.revision
  reconcileSchedulerCapacity(scheduler, { status: 'KNOWN', maximum: 5, conservativeCeiling: 1 }, authority)
  assert.equal(scheduler.revision, revision)
})

test('rollover de candidato aloca identidade nova e invalida evidência antiga', () => {
  const original = createScenarioState('pr')
  const oldIdentity = original.publication.publicationIdentity.canonicalId
  const oldMerged = runCommandToCompletion(runCommandToCompletion(original, 'APPROVE_PUBLICATION'), 'MERGE_PR')
  const changed = runCommandToCompletion(original, 'CHANGE_CANDIDATE')
  assert.notEqual(changed.publication.candidateId, original.publication.candidateId)
  assert.notEqual(changed.publication.publicationIdentity.canonicalId, oldIdentity)
  assert.equal(changed.publication.mergedPublicationIdentity, undefined)
  const revalidated = runCommandToCompletion(changed, 'REVALIDATE_PUBLICATION')
  assert.equal(revalidated.publication.publicationIdentity.canonicalId, changed.publication.publicationIdentity.canonicalId)
  const approved = runCommandToCompletion(revalidated, 'APPROVE_PUBLICATION')
  const staleEvidence = { ...approved, publication: { ...approved.publication, state: 'PR_MERGED' as const, queueStatus: 'PROCESSING' as const, mergedCandidateId: oldMerged.publication.mergedCandidateId, mergedPrNumber: oldMerged.publication.mergedPrNumber, mergedBaseSha: oldMerged.publication.mergedBaseSha, mergedHeadSha: oldMerged.publication.mergedHeadSha, mergedTreeHash: oldMerged.publication.mergedTreeHash, mergedConformanceRunId: oldMerged.publication.mergedConformanceRunId, mergedPublicationIdentity: oldMerged.publication.mergedPublicationIdentity, mergedRemoteEvidenceId: oldMerged.publication.mergedRemoteEvidenceId } }
  assert.equal(canExecute(staleEvidence, 'CONFIRM_REMOTE').allowed, false)
  const retried = runCommandToCompletion(approved, 'APPROVE_PUBLICATION')
  assert.equal(retried.publication.publicationIdentity.canonicalId, approved.publication.publicationIdentity.canonicalId)
})
