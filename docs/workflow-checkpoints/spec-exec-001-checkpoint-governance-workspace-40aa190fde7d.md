CHECKPOINT_KIND = GOVERNANCE_RECONCILIATION_CHECKPOINT
PARENT_HEAD = 40aa190fde7d31497a4b85887d92e820e829fb1b
PRESERVED_UNSTAGED_RECOVERY_CANDIDATES =
docs/workflow-checkpoints/spec-exec-001-checkpoint-component-implementation-tickets-audit-b0ec30cb1d32-manifest.json
docs/workflow-checkpoints/spec-exec-001-checkpoint-governance-workspace-13b4b70b37b9-manifest.json
HUMAN_PRESERVATION_AUTHORIZATION = YES
PRESERVATION_SCOPE = EXPLICIT
PHASE_MANIFEST = docs/workflow-checkpoints/spec-exec-001-checkpoint-governance-workspace-40aa190fde7d-manifest.json
PRESERVED_PATHS =
.gitignore
.pi/agents/workflow-checkpoint.md
.pi/agents/workflow-controller.md
.pi/extensions/workflow-orchestrator/README.md
.pi/extensions/workflow-orchestrator/contracts.ts
.pi/extensions/workflow-orchestrator/full-orchestrator.ts
.pi/extensions/workflow-orchestrator/git-state.ts
.pi/extensions/workflow-orchestrator/index.ts
.pi/extensions/workflow-orchestrator/orchestrator.ts
.pi/extensions/workflow-orchestrator/subagents-client.ts
.pi/extensions/workflow-orchestrator/test/full-orchestrator.test.ts
.pi/extensions/workflow-orchestrator/test/subagents-client.test.ts
.pi/extensions/workflow-orchestrator/test/workflow-lineage.test.ts
.pi/extensions/workflow-orchestrator/test/workflow-preflight.test.ts
.pi/extensions/workflow-orchestrator/test/workflow-routing.test.ts
.pi/extensions/workflow-orchestrator/workflow-lineage.ts
.pi/extensions/workflow-orchestrator/workflow-routing.ts
.pi/extensions/workflow-orchestrator/phase-checkpoint.ts
.pi/extensions/workflow-orchestrator/run-logger.ts
.pi/extensions/workflow-orchestrator/test/phase-checkpoint.test.ts
.pi/extensions/workflow-orchestrator/test/run-logger.test.ts
.pi/extensions/workflow-orchestrator/ticket-set-analysis.ts
skills/_shared/authority-completeness-gates.md
skills/_shared/phase-checkpoint-contract.md
skills/_shared/phase-manifest-contract.md
skills/_shared/workflow-execution-topology-contract.md
skills/_shared/workflow-preflight-contract.md
skills/_shared/workflow-transition-contract.md
skills/_shared/workflow-transitions.json
skills/audit-component-implementation-tickets/SKILL.md
skills/checkpoint-component-implementation-tickets-audit/SKILL.md
skills/checkpoint-component-implementation-tickets-remediation/SKILL.md
skills/checkpoint-implemented-ticket/SKILL.md
skills/remediate-component-implementation-tickets/SKILL.md
tools/verify-phase-manifest.mjs
docs/workflow-checkpoints/spec-exec-001-checkpoint-governance-workspace-40aa190fde7d-manifest.json
docs/workflow-checkpoints/spec-exec-001-checkpoint-governance-workspace-40aa190fde7d.md
UNSTAGED_RECOVERY_PATHS =
docs/workflow-checkpoints/spec-exec-001-checkpoint-component-implementation-tickets-audit-b0ec30cb1d32-manifest.json
docs/workflow-checkpoints/spec-exec-001-checkpoint-governance-workspace-13b4b70b37b9-manifest.json
EXCLUDED_DIRS = .pi/; .codex/; node_modules/
TICKET_STATE_MUTATIONS = 0
PRODUCTION_FILES_CHANGED = 0
TEST_FILES_CHANGED = 0
WORKFLOW_ORCHESTRATOR_TEST_FILES_CHANGED = 7
CHECKS = PASS
PHASE_MANIFEST_VALID = PASS
CANONICAL_ARTIFACT_CONSISTENCY = PASS
CHECKPOINT_COMMIT_MESSAGE = checkpoint(governance): preserve workflow reconciliation
NEXT_AUTHORIZED_OPERATION = workflow-controller-replan

<!-- WORKFLOW_RESULT_V2
OPERATION = checkpoint-governance-workspace
SUBJECT_ID = SPEC-EXEC-001
RESULT_ID = 44de9304-4ec4-4baf-aa5f-6677999c7ec6:1
SUPERSEDES_RESULT_ID = 818a06c3-01e8-41fa-a6e8-6f9ea2949795:1
GATE_FIELD = NEXT_AUTHORIZED_OPERATION
GATE_VALUE = workflow-controller-replan
BASIS = {"type":"intake","artifacts":[{"artifactPath":"docs/workflow-checkpoints/SPEC-EXEC-001-component-implementation-tickets-conformance.md","fields":{"AUDIT_BASIS_FINGERPRINT":["HEAD:fcb67adc357e049dca79e16fc1dceb81026f63b1; semanticFingerprint:09d7c5dc3a47f90a60612eb5b31384ad1b73c81b252ec640e15a6b87d683ae57"],"AUDIT_VERDICT":["IMPLEMENTATION_TICKETS_CONFORMANT"],"CHECKPOINT_KIND":["COMPONENT_IMPLEMENTATION_TICKETS_CONFORMANCE_CHECKPOINT"],"COMPONENT":["SPEC-EXEC-001"],"IMPLEMENTATION_GATE":["READY_FOR_IMPLEMENTATION"],"NEXT_AUTHORIZED_OPERATION":["design-ticket-implementation"],"PARENT_HEAD":["fcb67adc357e049dca79e16fc1dceb81026f63b1"],"TICKET_DECOMPOSITION_GATE":["READY_FOR_INDEPENDENT_TICKET_REAUDIT"],"TICKET_SET_AUDIT_COMPLETE":["YES"]}}]}
-->
