# EXEC-001-TICKET-001 — Lineage Migration Checkpoint

```text
CHECKPOINT_KIND = LINEAGE_MIGRATION_CHECKPOINT
TICKET_ID = EXEC-001-TICKET-001
PARENT_HEAD = c6d7f949037045159bc7a951da224cff53aea7f3
CHECKPOINT_SCOPE = GAP-018; EXEC-ENVELOPE-001/002; AC-EXEC-001/002
PHASE_MANIFEST = docs/workflow-checkpoints/exec-001-ticket-001-checkpoint-implemented-ticket-c6d7f9490370-manifest.json
PRESERVED_PATHS = 3
docs/workflow-checkpoints/exec-001-ticket-001-legacy-checkpoint-lineage-8f17e2bb7957.md
docs/workflow-checkpoints/exec-001-ticket-001-checkpoint-implemented-ticket-c6d7f9490370-manifest.json
docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-001-checkpoints/EXEC-001-TICKET-001-lineage-migration-checkpoint-round-25.md
UNSTAGED_RECOVERY_PATHS = 0
EXCLUDED_DIRS = .pi/; skills/; .codex/; node_modules/
SOURCE_AUDIT = docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-001-implementation-audit.md
SOURCE_AUDIT_SHA256 = 7086a500f9a963634e5c0d2f8223654fbc929e5b80f9d49533d687bab7e09207
SOURCE_REMEDIATION = docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-001-implementation-remediation.md
SOURCE_REMEDIATION_SHA256 = 630b15d328f51dfd89ed6eddad18a53fef37ddc657951164d4782b1d42746adc
SOURCE_LEGACY_CHECKPOINT = docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-001-checkpoints/EXEC-001-TICKET-001-remediation-checkpoint-round-24.md
SOURCE_LEGACY_CHECKPOINT_COMMIT = 8f17e2bb7957e5829184ae99b256a2548dd4fd91
SOURCE_LEGACY_PHASE_MANIFEST = docs/workflow-checkpoints/exec-001-ticket-001-checkpoint-implemented-ticket-2d86c67121ae-manifest.json
SOURCE_LINEAGE_MIGRATION = docs/workflow-checkpoints/exec-001-ticket-001-legacy-checkpoint-lineage-8f17e2bb7957.md
MIGRATION_VALIDATION = PASS
MIGRATION_REBASE_REQUIRED = YES
MIGRATION_GATE = LEGACY_CHECKPOINT_VALIDATED
NEXT_AUTHORIZED_OPERATION = audit-implemented-ticket
PUSHED = NO
MERGED = NO
DONE_TRANSITION = NO
CHECKPOINT_COMMIT_MESSAGE = checkpoint(SPEC-EXEC-001/EXEC-001-TICKET-001): LINEAGE_MIGRATION_CHECKPOINT round 25
```

<!-- WORKFLOW_RESULT_V2
OPERATION = checkpoint-implemented-ticket
SUBJECT_ID = EXEC-001-TICKET-001
RESULT_ID = f580d1ae-7585-4bbd-96e6-a98d27858448:2
SUPERSEDES_RESULT_ID = NONE
GATE_FIELD = NEXT_AUTHORIZED_OPERATION
GATE_VALUE = audit-implemented-ticket
BASIS = {"type":"transition","source":{"operation":"reconcile-legacy-checkpoint-lineage","subject":"EXEC-001-TICKET-001","resultId":"f580d1ae-7585-4bbd-96e6-a98d27858448:1","artifactPath":"docs/workflow-checkpoints/exec-001-ticket-001-legacy-checkpoint-lineage-8f17e2bb7957.md","gateField":"MIGRATION_GATE","gateValue":"LEGACY_CHECKPOINT_VALIDATED","fields":{"MIGRATION_GATE":["LEGACY_CHECKPOINT_VALIDATED"],"NEXT_AUTHORIZED_OPERATION":["audit-implemented-ticket"],"SOURCE_CHECKPOINT_PARENT_HEAD":["2d86c67121aed144b000051f13f7d6f689c63beb"],"SOURCE_CHECKPOINT_TARGET_HEAD":["c6d7f949037045159bc7a951da224cff53aea7f3"],"TICKET_ID":["EXEC-001-TICKET-001"]}}}
-->
