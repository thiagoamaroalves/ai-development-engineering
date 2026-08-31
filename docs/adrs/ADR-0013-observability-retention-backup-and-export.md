---
schema_version: "1.0.0"
id: ADR-0013
title: Observability, Retention, Backup, and Export
decision_status: ACCEPTED
implementation_status: UNPROCESSED
revision: 3
date: 2026-08-28
decision_scope: operations
supersedes: []
superseded_by: null
related: [ADR-0006, ADR-0011, ADR-0012, ADR-0014]
---

# ADR-0013 — Observabilidade, retenção, backup e exportação

## Contexto

O usuário precisa acompanhar atividades que duram horas ou dias e auditar decisões, tempos, findings e efeitos depois da conclusão.

## Decisão

O sistema registrará estado atual, eventos, duração total/ativa/em fila, agentes, skills, versões, tentativas, rodadas, consumo Codex quando disponível, DAG, bloqueios, branches, worktrees, commits, vereditos, findings e artefatos.

Logs, eventos, relatórios e artefatos intermediários permanecem indefinidamente até exclusão manual. Relatórios operacionais ficam fora do Git e são relacionados ao conteúdo auditado por hashes.

O banco local terá backups automáticos e exportação. A exportação deverá permitir auditar e reconstruir a história de uma execução. Exclusão manual apresenta impacto, exige confirmação e preserva registro mínimo do que foi removido.

Eventos e métricas devem ter correlação por repositório, execução, SPEC, atividade, agente e efeito. O sistema mede consumo sem impor orçamento.

## Consequências

Armazenamento cresce continuamente e precisará de diagnóstico de volume. Backup/restauração devem incluir banco e arquivos externos associados. A forma exata será definida na implementação sem alterar a decisão de retenção.

## Alternativas rejeitadas

- Excluir logs automaticamente após período fixo.
- Versionar todos os relatórios no Git.
- Não acompanhar consumo e tempos.
