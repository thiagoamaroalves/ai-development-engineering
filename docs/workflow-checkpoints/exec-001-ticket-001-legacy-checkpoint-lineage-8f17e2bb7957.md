# Legacy Checkpoint Lineage Reconciliation — EXEC-001-TICKET-001

```text
MIGRATION_KIND = LEGACY_CHECKPOINT_LINEAGE_RECONCILIATION
TICKET_ID = EXEC-001-TICKET-001
SOURCE_CHECKPOINT_MARKER = docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-001-checkpoints/EXEC-001-TICKET-001-remediation-checkpoint-round-24.md
SOURCE_CHECKPOINT_KIND = REMEDIATION_CHECKPOINT
SOURCE_CHECKPOINT_COMMIT = 8f17e2bb7957e5829184ae99b256a2548dd4fd91
SOURCE_CHECKPOINT_PARENT_HEAD = 2d86c67121aed144b000051f13f7d6f689c63beb
SOURCE_CHECKPOINT_MARKER_SHA256 = 171830fa0e1972baedae3cb1dbea644aec7b212a4b24d5e67d88f5d0268a6f9d
SOURCE_PHASE_MANIFEST = docs/workflow-checkpoints/exec-001-ticket-001-checkpoint-implemented-ticket-2d86c67121ae-manifest.json
SOURCE_PHASE_MANIFEST_SHA256 = 9877e912840f9f2439c85be69dba5937c5acc896ec7055ebbedbc98c95f1fc75
SOURCE_CHECKPOINT_TARGET_HEAD = c6d7f949037045159bc7a951da224cff53aea7f3
SOURCE_CHECKPOINT_PRESERVED_PATH_DRIFT = [{"path":"tests/exec-001-ticket-001.test.ts","checkpointTreeEntry":"100644 blob 92e27a42adc3bb1fb2ea40805cb90b423b179716\ttests/exec-001-ticket-001.test.ts","migrationTreeEntry":"100644 blob 985e0ab1f7f93d115fbbdfa040c1df95b34d0591\ttests/exec-001-ticket-001.test.ts"}]
SOURCE_CHECKPOINT_COMMIT_MESSAGE = checkpoint(SPEC-EXEC-001/EXEC-001-TICKET-001): REMEDIATION_CHECKPOINT round 24
CURRENT_TICKET_GENERATION_MARKER = docs/workflow-checkpoints/SPEC-EXEC-001-component-implementation-tickets-generation.md
CURRENT_TICKET_GENERATION_MANIFEST = docs/workflow-checkpoints/SPEC-EXEC-001-component-implementation-tickets-generation-manifest.json
CURRENT_TICKET_GENERATION_COMMIT = eab1e40b79724b222f7f51d8199df2d65fe7c22b
CURRENT_TICKET_SET_CONFORMANCE_MARKER = docs/workflow-checkpoints/SPEC-EXEC-001-component-implementation-tickets-conformance.md
CURRENT_TICKET_SET_CONFORMANCE_MANIFEST = docs/workflow-checkpoints/SPEC-EXEC-001-component-implementation-tickets-conformance-manifest.json
CURRENT_TICKET_SET_CONFORMANCE_COMMIT = 8cf79cd37ebb02d0657c1fb191cea1d194b71f89
CURRENT_TICKET_PATH = docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-001-capability-specific-envelope-and-payload-schemas.md
CURRENT_TICKET_SHA256 = 7d45c31950981e50f57a8bdf22ffd3c2ca3d86d46abff227848d0b72320c3aa0
NEXT_AUTHORIZED_OPERATION = audit-implemented-ticket
MIGRATION_VALIDATION = PASS
MIGRATION_REBASE_REQUIRED = YES
MIGRATION_GATE = LEGACY_CHECKPOINT_VALIDATED
```

<!-- WORKFLOW_RESULT_V2
OPERATION = reconcile-legacy-checkpoint-lineage
SUBJECT_ID = EXEC-001-TICKET-001
RESULT_ID = f580d1ae-7585-4bbd-96e6-a98d27858448:1
SUPERSEDES_RESULT_ID = NONE
GATE_FIELD = MIGRATION_GATE
GATE_VALUE = LEGACY_CHECKPOINT_VALIDATED
BASIS = {"type":"legacy-checkpoint","proof":{"markerPath":"docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-001-checkpoints/EXEC-001-TICKET-001-remediation-checkpoint-round-24.md","subject":"EXEC-001-TICKET-001","checkpointKind":"REMEDIATION_CHECKPOINT","checkpointCommit":"8f17e2bb7957e5829184ae99b256a2548dd4fd91","parentHead":"2d86c67121aed144b000051f13f7d6f689c63beb","manifestPath":"docs/workflow-checkpoints/exec-001-ticket-001-checkpoint-implemented-ticket-2d86c67121ae-manifest.json","manifestSha256":"9877e912840f9f2439c85be69dba5937c5acc896ec7055ebbedbc98c95f1fc75","markerSha256":"171830fa0e1972baedae3cb1dbea644aec7b212a4b24d5e67d88f5d0268a6f9d","targetHead":"c6d7f949037045159bc7a951da224cff53aea7f3","ticketRevision":{"generationMarkerPath":"docs/workflow-checkpoints/SPEC-EXEC-001-component-implementation-tickets-generation.md","generationManifestPath":"docs/workflow-checkpoints/SPEC-EXEC-001-component-implementation-tickets-generation-manifest.json","generationCommit":"eab1e40b79724b222f7f51d8199df2d65fe7c22b","conformanceMarkerPath":"docs/workflow-checkpoints/SPEC-EXEC-001-component-implementation-tickets-conformance.md","conformanceManifestPath":"docs/workflow-checkpoints/SPEC-EXEC-001-component-implementation-tickets-conformance-manifest.json","conformanceCommit":"8cf79cd37ebb02d0657c1fb191cea1d194b71f89","ticketPath":"docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-001-capability-specific-envelope-and-payload-schemas.md","ticketSha256":"7d45c31950981e50f57a8bdf22ffd3c2ca3d86d46abff227848d0b72320c3aa0"},"preservedPathDrift":[{"path":"tests/exec-001-ticket-001.test.ts","checkpointTreeEntry":"100644 blob 92e27a42adc3bb1fb2ea40805cb90b423b179716\ttests/exec-001-ticket-001.test.ts","migrationTreeEntry":"100644 blob 985e0ab1f7f93d115fbbdfa040c1df95b34d0591\ttests/exec-001-ticket-001.test.ts"}],"nextOperation":"audit-implemented-ticket","commitMessage":"checkpoint(SPEC-EXEC-001/EXEC-001-TICKET-001): REMEDIATION_CHECKPOINT round 24"}}
-->