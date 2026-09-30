CHECKPOINT_KIND = GOVERNANCE_RECONCILIATION_CHECKPOINT
PARENT_HEAD = 74700e956cdf8b562d1b6201d2edaf909c8ea464
PRESERVED_UNSTAGED_RECOVERY_CANDIDATES =
.pi/settings.json
HUMAN_PRESERVATION_AUTHORIZATION = YES
PRESERVATION_SCOPE = EXPLICIT
PHASE_MANIFEST = docs/workflow-checkpoints/spec-exec-001-governance-workspace-checkpoint-governance-workspace-74700e956cdf-manifest.json
PRESERVED_PATHS =
.pi/extensions/workflow-orchestrator/README.md
.pi/extensions/workflow-orchestrator/full-orchestrator.ts
.pi/extensions/workflow-orchestrator/workflow-lineage.ts
.pi/extensions/workflow-orchestrator/workflow-preflight.ts
.pi/extensions/workflow-orchestrator/legacy-checkpoint.ts
skills/_shared/workflow-preflight-contract.md
skills/_shared/workflow-transition-contract.md
skills/_shared/workflow-transitions.json
skills/checkpoint-implemented-ticket/SKILL.md
skills/reconcile-legacy-checkpoint-lineage/SKILL.md
docs/workflow-checkpoints/spec-exec-001-governance-workspace-checkpoint-governance-workspace-74700e956cdf-manifest.json
docs/workflow-checkpoints/spec-exec-001-governance-workspace-checkpoint-governance-workspace-74700e956cdf.md
UNSTAGED_RECOVERY_PATHS =
.pi/settings.json
EXCLUDED_DIRS = .pi/; .codex/; node_modules/
TICKET_STATE_MUTATIONS = 0
PRODUCTION_FILES_CHANGED = 0
TEST_FILES_CHANGED = 0
CHECKS = PASS: npm test (106/106); npm run typecheck; npm run verify:audit-governance; npm run verify:skill-mirror; phase manifest
CHECKPOINT_COMMIT_MESSAGE = checkpoint(governance): preserve workflow reconciliation
NEXT_AUTHORIZED_OPERATION = workflow-controller-replan
