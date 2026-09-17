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
  CanonicalIdentityReference,
  CanonicalIdentityReferenceInput,
} from '../domain/identity.js'
import type { AdrAuthorityObservation, AdrAuthorityReader } from '../domain/adr.js'

export interface ExecExactVersionMetadata {
  readonly skill: string
  readonly contract: string
}

export function mapExecExactVersionMetadata(metadata: ExecExactVersionMetadata): ExactVersionSet {
  return ExactVersionSet.create(metadata)
}

export interface ManualAdrSubmission {
  readonly reference: CanonicalIdentityReferenceInput
  /** Retained only as a compatibility assertion; authority comes from the reader. */
  readonly decisionStatus?: AdrDecisionStatus
  /** Retained only as a compatibility assertion; authority comes from the reader. */
  readonly contentHash?: string
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
    private readonly adrAuthority: AdrAuthorityReader,
  ) {
    if (!adrAuthority || typeof adrAuthority.observe !== 'function') {
      throw new SnapshotDomainError(
        'SNAPSHOT_RECONSTRUCTION_AUTHORITY_REQUIRED',
        'Manual execution submission requires the canonical ADR authority reader.',
      )
    }
  }

  async handle(command: SubmitManualExecutionCommand): Promise<ExecutionSnapshot> {
    const spec = this.identities.resolve(command.spec).reference
    const draft = ExecutionSnapshot.create({
      id: SnapshotId.create(command.snapshotId),
      spec,
      adrs: command.adrs,
      base: SnapshotBase.create(command.base),
      configuration: ConfigurationVersion.create(command.configuration),
      versions: mapExecExactVersionMetadata(command.versions),
    }, {
      identities: this.identities,
      adrs: this.adrAuthority,
    })
    const reservation = await this.snapshots.reserve(draft)
    if (reservation.status === 'DUPLICATE') {
      throw new SnapshotDomainError('SNAPSHOT_ALREADY_EXISTS', `Snapshot ${draft.id.value} already exists.`)
    }

    const secondObservation = command.adrs.map((entry) => this.observeEntry(entry))
    const confirmed = draft.confirm({
      spec: draft.spec,
      adrs: secondObservation,
      base: draft.base,
      configuration: draft.configuration,
      versions: draft.versions,
    })
    const persisted = await this.snapshots.confirm(confirmed)
    if (persisted.status === 'STALE') {
      throw new SnapshotDomainError('SNAPSHOT_STALE', `Snapshot ${draft.id.value} is stale.`)
    }
    if (persisted.status === 'NOT_FOUND') {
      throw new SnapshotDomainError('SNAPSHOT_NOT_FOUND', `Snapshot ${draft.id.value} could not be confirmed.`)
    }

    return persisted.snapshot
  }

  private observeEntry(entry: ManualAdrSubmission): AdrSnapshotEntry {
    const requested = CanonicalIdentityReference.create(entry.reference)
    const observation = this.adrAuthority.observe(requested)
    if (!observation || !observation.reference.equals(requested)) {
      throw new SnapshotDomainError(
        'SNAPSHOT_NOT_FOUND',
        `ADR ${requested.canonicalKey} could not be resolved by canonical authority.`,
      )
    }

    this.assertCompatibilityFields(entry, observation)
    return AdrSnapshotEntry.fromAuthority(observation)
  }

  private assertCompatibilityFields(entry: ManualAdrSubmission, observation: AdrAuthorityObservation): void {
    if (entry.decisionStatus !== undefined && entry.decisionStatus !== observation.decisionStatus) {
      throw new SnapshotDomainError(
        'SNAPSHOT_AUTHORITY_DRIFT',
        `ADR ${observation.reference.canonicalKey} caller status does not match canonical authority.`,
      )
    }
    if (entry.contentHash !== undefined && entry.contentHash !== observation.contentHash.value) {
      throw new SnapshotDomainError(
        'SNAPSHOT_AUTHORITY_DRIFT',
        `ADR ${observation.reference.canonicalKey} caller hash does not match canonical authority.`,
      )
    }
  }
}
