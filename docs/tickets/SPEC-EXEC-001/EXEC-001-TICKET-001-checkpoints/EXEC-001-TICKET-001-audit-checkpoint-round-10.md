CHECKPOINT_KIND = AUDIT_CHECKPOINT
TICKET_ID = EXEC-001-TICKET-001
PARENT_HEAD = 7bee020a59b0c44baebce8f73125672d5f87e920
CHECKPOINT_SCOPE = GAP-001; EXEC-ENVELOPE-001/002; AC-EXEC-001/002
ALLOWLIST =
docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-001-architecture-audit.md
docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-001-behavior-audit.md
docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-001-implementation-audit.md
docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-001-implementation-design-conformance-audit.md
docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-001-implementation-remediation.md
docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-001-ticket-conformance-audit.md
src/domain/exec-contract.ts
src/domain/exec-schema.ts
src/domain/exec-validation-evidence-internal.ts
src/application/exec-contract.ts
src/infrastructure/exec-schema-validator.ts
src/composition/exec-contract.ts
tests/exec-001-ticket-001.test.ts
docs/tickets/SPEC-EXEC-001/evidence/TICKET-001/AC-EXEC-001-envelope-schema.md
docs/tickets/SPEC-EXEC-001/evidence/TICKET-001/AC-EXEC-001-structured-consumption.md
docs/tickets/SPEC-EXEC-001/evidence/TICKET-001/AC-EXEC-002-required-fields.md
docs/tickets/SPEC-EXEC-001/evidence/TICKET-001/AC-EXEC-002-fail-closed.md
docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-001-checkpoints/EXEC-001-TICKET-001-audit-checkpoint-round-10.md
EXCLUDED_DIRS = .pi/; skills/; .codex/; node_modules/
SOURCE_AUDIT = docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-001-implementation-audit.md
SOURCE_REMEDIATION = docs/tickets/SPEC-EXEC-001/EXEC-001-TICKET-001-implementation-remediation.md
NEXT_AUTHORIZED_OPERATION = remediate-implemented-ticket
CHECKPOINT_COMMIT_MESSAGE = checkpoint(SPEC-EXEC-001/EXEC-001-TICKET-001): AUDIT_CHECKPOINT round 10
