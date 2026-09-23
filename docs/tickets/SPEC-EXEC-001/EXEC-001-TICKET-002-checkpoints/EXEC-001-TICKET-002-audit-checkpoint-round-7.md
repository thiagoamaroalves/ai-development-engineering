CHECKPOINT_KIND = AUDIT_CHECKPOINT
TICKET_ID = EXEC-001-TICKET-002
PARENT_HEAD = 6f8ea7170f21f94d36f30893cc5622040fa4ba5b
CHECKPOINT_SCOPE = EXEC-IMP-02; GAP-004/006/008/009/010/011; EXEC-VERSION-001/002; EXEC-REGISTRY-001/002/003; EXEC-CAPABILITY-001/002; AC-EXEC-003/004/008/009/010/011/012
ALLOWLIST =
docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-architecture-boundaries-audit.md
docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-implementation-audit.md
docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-implementation-behavior-audit.md
docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-implementation-design-conformance-audit.md
docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-ticket-conformance-audit.md
src/application/exec-registry-ports.ts
src/application/exec-registry.ts
src/composition/exec-registry.ts
src/domain/exec-contract.ts
src/domain/exec-registry.ts
tests/exec-001-ticket-002.test.ts
tests/exec-registry-import-boundary-loader.mjs
tests/fixtures/exec-registry-forbidden-import.mjs
docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-checkpoints/EXEC-001-TICKET-002-audit-checkpoint-round-7.md
EXCLUDED_DIRS = .pi/; skills/; .codex/; node_modules/
SOURCE_AUDIT = docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-implementation-audit.md
SOURCE_REMEDIATION = docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-002-implementation-remediation.md
NEXT_AUTHORIZED_OPERATION = remediate-implemented-ticket
DOWNSTREAM_RECONCILIATION_REQUIRED = NO
CHECKPOINT_COMMIT_MESSAGE = checkpoint(SPEC-EXEC-001/EXEC-001-TICKET-002): AUDIT_CHECKPOINT round 7
