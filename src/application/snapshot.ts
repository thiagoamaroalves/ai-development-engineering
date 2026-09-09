import {
  AdrDecisionStatus,
  AdrSnapshotEntry,
  ConfigurationVersion,
  ExactVersionSet,
  ExecutionSnapshot,
  ExecutionSnapshotRepository,
  SnapshotBase,
  SnapshotDomainError,
  SnapshotId,
} from '../domain/snapshot.js'
import {
  CanonicalIdentityCatalog,
  CanonicalIdentityReferenceInput,
} from '../domain/identity.js'

export interface ExecExactVersionMetadata {
  readonly skill: string
  readonly contract: string
}

export function mapExecExactVersionMetadata(metadata: ExecExactVersionMetadata): ExactVersionSet {
  return ExactVersionSet.create(metadata)
}

export interface ManualAdrSubmission {
  readonly reference: CanonicalIdentityReferenceInput
  readonly decisionStatus: AdrDecisionStatus
  readonly contentHash: string
}

export interface SubmitManualExecutionCommand {
  readonly snapshotId: string
  readonly spec: CanonicalIdentityReferenceInput
  readonly adrs: readonly ManualAdrSubmission[]
  readonly base: string
  readonly configuration: string
  readonly versions: ExecExactVersionMetadata
}

export class SubmitManualExecutionHandler {
  constructor(
    private readonly identities: CanonicalIdentityCatalog,
    private readonly snapshots: ExecutionSnapshotRepository,
  ) {}

  async handle(command: SubmitManualExecutionCommand): Promise<ExecutionSnapshot> {
    const spec = this.identities.resolve(command.spec).reference
    const adrs = command.adrs.map((entry) => {
      const resolved = this.identities.resolve(entry.reference)
      const snapshotEntry = AdrSnapshotEntry.create({
        reference: resolved.reference,
        decisionStatus: entry.decisionStatus,
        contentHash: entry.contentHash,
      })
      return snapshotEntry
    })

    const draft = ExecutionSnapshot.create({
      id: SnapshotId.create(command.snapshotId),
      spec,
      adrs,
      base: SnapshotBase.create(command.base),
      configuration: ConfigurationVersion.create(command.configuration),
      versions: mapExecExactVersionMetadata(command.versions),
    })
    const reservation = await this.snapshots.reserve(draft)
    if (reservation.status === 'DUPLICATE') {
      throw new SnapshotDomainError('SNAPSHOT_ALREADY_EXISTS', `Snapshot ${draft.id.value} already exists.`)
    }

    const confirmed = draft.confirm(draft)
    const persisted = await this.snapshots.confirm(confirmed)
    if (persisted.status === 'STALE') {
      throw new SnapshotDomainError('SNAPSHOT_STALE', `Snapshot ${draft.id.value} is stale.`)
    }
    if (persisted.status === 'NOT_FOUND') {
      throw new SnapshotDomainError('SNAPSHOT_NOT_FOUND', `Snapshot ${draft.id.value} could not be confirmed.`)
    }

    return persisted.snapshot
  }
}
