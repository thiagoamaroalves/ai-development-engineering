# ADRs — Orquestrador simples de tarefas

Este índice reúne as decisões arquiteturais aceitas para o orquestrador local de engenharia com Codex CLI.

| ADR | Decisão |
|---|---|
| [ADR-0001](ADR-0001-workflow-domain-and-identity.md) | Domínio, identidade e imutabilidade |
| [ADR-0002](ADR-0002-pipeline-state-machines-and-transitions.md) | Pipeline e máquinas de estados |
| [ADR-0003](ADR-0003-versioned-skill-contracts.md) | Contratos versionados das skills |
| [ADR-0004](ADR-0004-codex-agent-sessions-and-role-segregation.md) | Sessões Codex e segregação de agentes |
| [ADR-0005](ADR-0005-scheduler-capacity-and-concurrency.md) | Scheduler, capacidade e concorrência |
| [ADR-0006](ADR-0006-persistence-journal-idempotency-and-recovery.md) | Persistência, idempotência e recuperação |
| [ADR-0007](ADR-0007-git-worktrees-waves-and-commits.md) | Git, worktrees, ondas e commits |
| [ADR-0008](ADR-0008-github-publication-and-human-approval.md) | GitHub, publicação e aprovação humana |
| [ADR-0009](ADR-0009-audit-remediation-and-final-conformance.md) | Auditoria, remediação e conformidade |
| [ADR-0010](ADR-0010-repository-configuration-and-legacy-migration.md) | Configuração e migração de repositórios |
| [ADR-0011](ADR-0011-local-dotnet-backend-and-realtime-api.md) | Backend .NET e API em tempo real |
| [ADR-0012](ADR-0012-local-security-credentials-and-notifications.md) | Segurança local e notificações |
| [ADR-0013](ADR-0013-observability-retention-backup-and-export.md) | Observabilidade, retenção e backup |
| [ADR-0014](ADR-0014-frontend-operational-contract.md) | Contrato operacional do frontend |

## Autoridade e revisão

As ADRs derivam da sessão de descoberta consolidada em `consolidacao-descoberta-orquestrador.md`. Todas estão com `decision_status: ACCEPTED` e ainda `implementation_status: UNPROCESSED` quanto à realização.

Uma ADR com `decision_status: ACCEPTED`, mas ainda não implementada, pode ser remediada pelo ciclo formal de auditoria, com incremento de `revision` e preservação do histórico. Depois que seu `implementation_status` for `IMPLEMENTED`, o conteúdo torna-se imutável: qualquer detalhamento ou mudança exige nova ADR complementar ou substituta. `adr_content_hash`, `implementation_commit_sha`, `implemented_at` e a evidência de realização pertencem ao registro operacional persistente do orquestrador, não ao documento ADR.
