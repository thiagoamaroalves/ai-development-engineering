import assert from 'node:assert/strict'
import {
  acquireSchedulerLease,
  canExecute,
  createMockScheduler,
  createCanonicalSchedulerFixture,
  createScenarioState,
  enqueueSchedulerCandidate,
  getSchedulerForState,
  getSchedulerRegistrationAuthority,
  getSchedulerSnapshot,
  registerSchedulerExecution,
  releaseSchedulerLease,
  reconcileSchedulerCapacity,
  runCommandToCompletion,
  updateSchedulerExecutionRegistration,
} from './src/mockDomain.ts'

function completeAll(state: ReturnType<typeof createScenarioState>) {
  let next = state
  while (next.activities.some((item) => item.state !== 'COMPLETED')) {
    const running = next.activities.find((item) => item.state === 'RUNNING')
    assert.ok(running)
    next = runCommandToCompletion(next, 'COMPLETE_ACTIVITY', 'fresh adversarial probe', running.id)
  }
  return next
}

const scheduler = createMockScheduler({ maximum: 5, initialUsed: 2 })
const authority = getSchedulerRegistrationAuthority(scheduler)
const beforeForeignRegistration = scheduler.revision
assert.throws(() => registerSchedulerExecution(scheduler, { executionId: 'EXEC-OWN', runId: 'RUN-OWN', snapshotStatus: 'CONFIRMED', functionalState: 'RUNNING', operationalState: 'PROCESSING', activities: [{ activityId: 'ACT-OWN', assignmentId: 'ASN-OWN', sessionId: 'SES-FOREIGN', role: 'AUDITOR', artifactCycleId: 'AC-UNRELATED', state: 'READY', eligible: true }] }, authority), /canonical|provenance|ownership/i)
assert.equal(scheduler.revision, beforeForeignRegistration)
const registration = createCanonicalSchedulerFixture(scheduler, 'PROBE-A', 'ACT-PROBE-A', 'ASN-PROBE-A')
registerSchedulerExecution(scheduler, registration, authority)
const candidate = enqueueSchedulerCandidate(scheduler, { executionId: registration.executionId, activityId: 'ACT-PROBE-A', assignmentId: 'ASN-PROBE-A', priority: 1, reason: 'READY' }, authority)!
assert.throws(() => enqueueSchedulerCandidate(scheduler, candidate), /capability/i)
assert.throws(() => enqueueSchedulerCandidate(scheduler, candidate, { kind: 'scheduler-registration-authority' }), /capability/i)
assert.throws(() => registerSchedulerExecution(scheduler, { ...registration, executionId: 'RUN-PROBE-B', snapshotStatus: 'NOT_A_STATUS' } as never, authority), /invalid/i)
const registrationRevision = scheduler.revision
assert.throws(() => updateSchedulerExecutionRegistration(scheduler, { executionId: registration.executionId, snapshotStatus: 'CONFIRMED', functionalState: 'READY', operationalState: 'IDLE' }, authority), /illegal/i)
assert.equal(scheduler.revision, registrationRevision)
updateSchedulerExecutionRegistration(scheduler, { executionId: registration.executionId, snapshotStatus: 'CONFIRMED', functionalState: 'RUNNING', operationalState: 'PAUSED' }, authority)
assert.equal(scheduler.queue[0].reason, 'ELIGIBILITY')

const partialScheduler = createMockScheduler({ maximum: 5, initialUsed: 2 })
let normal = createScenarioState('normal', partialScheduler)
normal = runCommandToCompletion(normal, 'VALIDATE_SNAPSHOT')
normal = runCommandToCompletion(normal, 'START_RUN')
const partialSnapshot = getSchedulerSnapshot(partialScheduler)
assert.equal(partialSnapshot.used, 3)
assert.equal(partialSnapshot.available, 2)
assert.equal(normal.activities.filter((item) => item.state === 'READY').length, 4)
assert.equal(partialSnapshot.fairQueue.filter((item) => item.executionId === normal.schedulerExecutionId).length, 4)
normal = completeAll(normal)
assert.equal(normal.activities.every((item) => item.state === 'COMPLETED'), true)
assert.ok(getSchedulerSnapshot(partialScheduler).leases.some((lease) => lease.executionId === 'SYSTEM'))

const systemScheduler = createMockScheduler({ maximum: 5, initialUsed: 1 })
const systemAuthority = getSchedulerRegistrationAuthority(systemScheduler)
const systemLease = systemScheduler.leases[0]
assert.equal(releaseSchedulerLease(systemScheduler, systemLease, systemAuthority), false)
const duplicateSchedulerId = 'SCHEDULER-DUPLICATE-PROBE'
createMockScheduler({ id: duplicateSchedulerId })
assert.throws(() => createMockScheduler({ id: duplicateSchedulerId }), /already exists|already registered|unique/i)
assert.throws(() => createMockScheduler({ maximum: 1, initialUsed: 1, systemReservationAssignments: ['ARBITRARY'] }), /canonical|reservation/i)
assert.throws(() => createMockScheduler({ maximum: 2, initialUsed: 2, systemReservationAssignments: ['SYSTEM-RESERVATION-A', 'SYSTEM-RESERVATION-A'] }), /unique/i)
assert.throws(() => createMockScheduler({ maxConsecutiveDispatches: -1 }), /maxConsecutiveDispatches/i)
const ceilingScheduler = createMockScheduler({ maximum: 1, initialUsed: 0 })
const ceilingAuthority = getSchedulerRegistrationAuthority(ceilingScheduler)
const ceilingRevision = ceilingScheduler.revision
assert.throws(() => reconcileSchedulerCapacity(ceilingScheduler, { status: 'KNOWN', maximum: 1, conservativeCeiling: 99 }, ceilingAuthority), /ceiling|maximum/i)
assert.equal(ceilingScheduler.revision, ceilingRevision)

for (const options of [{ maximum: 0, initialUsed: 0 }, { maximum: 1, initialUsed: 0 }, { maximum: 2, initialUsed: 2 }, { maximum: 5, initialUsed: 2 }]) {
  const shared = createMockScheduler(options)
  let state = createScenarioState('normal', shared)
  state = runCommandToCompletion(state, 'VALIDATE_SNAPSHOT')
  state = runCommandToCompletion(state, 'START_RUN')
  const snapshot = getSchedulerSnapshot(shared)
  assert.equal(snapshot.used + (snapshot.available ?? 0), options.maximum)
  assert.ok(state.activities.filter((item) => item.state === 'READY' || item.state === 'WAITING_CAPACITY').every((item) => snapshot.fairQueue.some((candidate) => candidate.activityId === item.id)))
}

const abcScheduler = createMockScheduler({ maximum: 3, initialUsed: 0 })
const abc = ['normal', 'normal', 'normal'].map((scenario) => createScenarioState(scenario as 'normal', abcScheduler))
assert.equal(new Set(abc.map((state) => state.schedulerExecutionId)).size, 3)
abc.forEach((state) => { assert.equal(canExecute(state, 'START_RUN').allowed, false) })
const sharedABCScheduler = createMockScheduler({ maximum: 5, initialUsed: 2 })
let sharedA = createScenarioState('normal', sharedABCScheduler)
let sharedB = createScenarioState('normal', sharedABCScheduler)
let sharedC = createScenarioState('normal', sharedABCScheduler)
assert.equal(new Set([sharedA.schedulerExecutionId, sharedB.schedulerExecutionId, sharedC.schedulerExecutionId]).size, 3)
sharedA = runCommandToCompletion(runCommandToCompletion(sharedA, 'VALIDATE_SNAPSHOT'), 'START_RUN')
sharedB = runCommandToCompletion(runCommandToCompletion(sharedB, 'VALIDATE_SNAPSHOT'), 'START_RUN')
sharedC = runCommandToCompletion(runCommandToCompletion(sharedC, 'VALIDATE_SNAPSHOT'), 'START_RUN')
const sharedABCSnapshot = getSchedulerSnapshot(sharedABCScheduler)
assert.equal(sharedABCSnapshot.used, 5)
assert.equal(new Set(sharedABCSnapshot.leases).size, sharedABCSnapshot.leases.length)
assert.ok(sharedABCSnapshot.fairQueue.length >= 12)
assert.deepEqual(new Set(sharedABCScheduler.executionIds.filter((id) => id !== 'SYSTEM')), new Set([sharedA.schedulerExecutionId, sharedB.schedulerExecutionId, sharedC.schedulerExecutionId]))
const missing = { ...abc[0], schedulerId: 'MISSING-SCHEDULER' }
assert.equal(canExecute(missing, 'START_RUN').allowed, false)
assert.throws(() => getSchedulerForState(missing), /scheduler/i)

const publicationScheduler = createMockScheduler({ maximum: 4, initialUsed: 0 })
const first = runCommandToCompletion(createScenarioState('pr', publicationScheduler), 'APPROVE_PUBLICATION')
const second = runCommandToCompletion(createScenarioState('pr', publicationScheduler), 'APPROVE_PUBLICATION')
assert.notEqual(first.publication.publicationIdentity.canonicalId, second.publication.publicationIdentity.canonicalId)
const mergedFirst = runCommandToCompletion(first, 'MERGE_PR')
const crossEvidence = { ...second, publication: { ...second.publication, state: 'PR_MERGED' as const, queueStatus: 'PROCESSING' as const, mergedCandidateId: mergedFirst.publication.mergedCandidateId, mergedPrNumber: mergedFirst.publication.mergedPrNumber, mergedBaseSha: mergedFirst.publication.mergedBaseSha, mergedHeadSha: mergedFirst.publication.mergedHeadSha, mergedTreeHash: mergedFirst.publication.mergedTreeHash, mergedConformanceRunId: mergedFirst.publication.mergedConformanceRunId, mergedPublicationIdentity: mergedFirst.publication.mergedPublicationIdentity, mergedRemoteEvidenceId: mergedFirst.publication.mergedRemoteEvidenceId } }
assert.equal(canExecute(crossEvidence, 'CONFIRM_REMOTE').allowed, false)
const confirmedFirst = runCommandToCompletion(mergedFirst, 'CONFIRM_REMOTE')
assert.equal(confirmedFirst.publication.publicationIdentity.canonicalId, first.publication.publicationIdentity.canonicalId)
assert.equal(confirmedFirst.publication.remoteEvidenceId, `${first.publication.publicationIdentity.canonicalId}:remote-evidence`)
const changedSource = createScenarioState('pr')
const changed = runCommandToCompletion(changedSource, 'CHANGE_CANDIDATE')
assert.notEqual(changed.publication.candidateId, first.publication.candidateId)
assert.notEqual(changed.publication.publicationIdentity.canonicalId, first.publication.publicationIdentity.canonicalId)
assert.equal(changed.publication.mergedPublicationIdentity, undefined)
const rolloverSource = createScenarioState('pr')
const oldMerged = runCommandToCompletion(runCommandToCompletion(rolloverSource, 'APPROVE_PUBLICATION'), 'MERGE_PR')
const rolled = runCommandToCompletion(rolloverSource, 'CHANGE_CANDIDATE')
const approvedRolled = runCommandToCompletion(runCommandToCompletion(rolled, 'REVALIDATE_PUBLICATION'), 'APPROVE_PUBLICATION')
const staleMergeAfterRollover = { ...approvedRolled, publication: { ...approvedRolled.publication, state: 'PR_MERGED' as const, queueStatus: 'PROCESSING' as const, mergedCandidateId: oldMerged.publication.mergedCandidateId, mergedPrNumber: oldMerged.publication.mergedPrNumber, mergedBaseSha: oldMerged.publication.mergedBaseSha, mergedHeadSha: oldMerged.publication.mergedHeadSha, mergedTreeHash: oldMerged.publication.mergedTreeHash, mergedConformanceRunId: oldMerged.publication.mergedConformanceRunId, mergedPublicationIdentity: oldMerged.publication.mergedPublicationIdentity, mergedRemoteEvidenceId: oldMerged.publication.mergedRemoteEvidenceId } }
assert.equal(canExecute(staleMergeAfterRollover, 'CONFIRM_REMOTE').allowed, false)
const independentA = createScenarioState('pr')
const independentB = createScenarioState('pr')
assert.notEqual(independentA.schedulerId, independentB.schedulerId)
assert.notEqual(independentA.publication.publicationIdentity.canonicalId, independentB.publication.publicationIdentity.canonicalId)

console.log('FRESH_ADVERSARIAL_PROBE_PASS')
