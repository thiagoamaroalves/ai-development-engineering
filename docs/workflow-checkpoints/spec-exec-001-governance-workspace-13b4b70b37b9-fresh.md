CHECKPOINT_KIND = GOVERNANCE_RECONCILIATION_CHECKPOINT
PARENT_HEAD = 13b4b70b37b9e3f84df21fe7db8381427fa2f95c
PRESERVED_UNSTAGED_RECOVERY_CANDIDATES =
docs/workflow-checkpoints/spec-exec-001-checkpoint-governance-workspace-13b4b70b37b9-manifest.json
HUMAN_PRESERVATION_AUTHORIZATION = YES
PRESERVATION_SCOPE = EXPLICIT
PHASE_MANIFEST = docs/workflow-checkpoints/spec-exec-001-governance-workspace-13b4b70b37b9-fresh-manifest.json
PRESERVED_PATHS =
.pi/agents/workflow-controller.md
.pi/extensions/workflow-orchestrator/README.md
.pi/extensions/workflow-orchestrator/full-orchestrator.ts
.pi/extensions/workflow-orchestrator/legacy-checkpoint.ts
.pi/extensions/workflow-orchestrator/test/full-orchestrator.test.ts
.pi/extensions/workflow-orchestrator/test/workflow-preflight.test.ts
.pi/extensions/workflow-orchestrator/workflow-lineage.ts
.pi/extensions/workflow-orchestrator/workflow-preflight.ts
docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-001-architecture-audit.md
docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-001-implementation-audit.md
docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-001-implementation-behavior-audit.md
docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-001-implementation-design-conformance-audit.md
docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-001-ticket-conformance-audit.md
skills/_shared/workflow-preflight-contract.md
skills/_shared/workflow-transition-contract.md
skills/_shared/workflow-transitions.json
skills/checkpoint-governance-workspace/SKILL.md
skills/reconcile-legacy-ticket-set-audit-lineage/SKILL.md
UNSTAGED_RECOVERY_PATHS =
docs/workflow-checkpoints/spec-exec-001-checkpoint-governance-workspace-13b4b70b37b9-manifest.json
EXCLUDED_DIRS = .pi/; .codex/; node_modules/
TICKET_STATE_MUTATIONS = 0
PRODUCTION_FILES_CHANGED = 0
TEST_FILES_CHANGED = 0
WORKFLOW_ORCHESTRATOR_TEST_FILES_CHANGED = 2
CHECKS = PASS
PHASE_MANIFEST_VALID = PASS
NEXT_AUTHORIZED_OPERATION = workflow-controller-replan
CHECKPOINT_COMMIT_MESSAGE = checkpoint(governance): preserve workflow reconciliation
<!-- WORKFLOW_RESULT_V2
OPERATION = checkpoint-governance-workspace
SUBJECT_ID = SPEC-EXEC-001
RESULT_ID = 818a06c3-01e8-41fa-a6e8-6f9ea2949795:1
SUPERSEDES_RESULT_ID = NONE
GATE_FIELD = NEXT_AUTHORIZED_OPERATION
GATE_VALUE = workflow-controller-replan
BASIS = {"type":"intake","artifacts":[{"artifactPath":"docs/workflow-checkpoints/SPEC-EXEC-001-component-implementation-tickets-conformance.md","fields":{"AUDIT_BASIS_FINGERPRINT":["HEAD:fcb67adc357e049dca79e16fc1dceb81026f63b1; semanticFingerprint:09d7c5dc3a47f90a60612eb5b31384ad1b73c81b252ec640e15a6b87d683ae57"],"AUDIT_VERDICT":["IMPLEMENTATION_TICKETS_CONFORMANT"],"CHECKPOINT_KIND":["COMPONENT_IMPLEMENTATION_TICKETS_CONFORMANCE_CHECKPOINT"],"COMPONENT":["SPEC-EXEC-001"],"IMPLEMENTATION_GATE":["READY_FOR_IMPLEMENTATION"],"NEXT_AUTHORIZED_OPERATION":["design-ticket-implementation"],"PARENT_HEAD":["fcb67adc357e049dca79e16fc1dceb81026f63b1"],"TICKET_DECOMPOSITION_GATE":["READY_FOR_INDEPENDENT_TICKET_REAUDIT"],"TICKET_SET_AUDIT_COMPLETE":["YES"]}}]}
-->