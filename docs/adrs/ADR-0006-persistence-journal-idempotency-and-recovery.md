---
schema_version: "1.0.0"
id: ADR-0006
title: Persistence, Journal, Idempotency, and Recovery
decision_status: ACCEPTED
implementation_status: UNPROCESSED
revision: 3
date: 2026-08-28
decision_scope: persistence
supersedes: []
superseded_by: null
related: [ADR-0001, ADR-0002, ADR-0003, ADR-0007]
---

# ADR-0006 — Persistência, idempotência e recuperação

## Contexto

Execuções duram horas ou dias e atravessam banco, filesystem, Git, Codex e GitHub, sem transação distribuída comum.

## Decisão

O estado operacional será persistido em banco local com journal append-only e outbox. A intenção de cada efeito é gravada antes de executá-lo; a evidência e confirmação são gravadas depois.

Cada efeito externo recebe chave idempotente determinística. Tentativas da mesma intenção reutilizam a chave. Antes de repetir, o sistema reconcilia evidências. Evidência compatível confirma sucesso; evidência divergente bloqueia; ausência permite nova tentativa.

Git e banco manterão estados funcionais de ticket como fontes equivalentes e reconciliadas. Divergência bloqueia o ticket e exige decisão humana; nenhum lado prevalece silenciosamente.

A reconciliação distingue quatro resultados:

- `EXPECTED_INCOMPLETE_EFFECT`: há intenção pendente e evidência idempotente correspondente; o banco é confirmado automaticamente;
- `MISSING_EFFECT`: há intenção pendente sem evidência; o efeito é repetido com a mesma chave;
- `SEMANTIC_DIVERGENCE`: existem estados incompatíveis sem intenção/evidência correlata; a unidade é bloqueada para decisão humana;
- `CONFLICTING_EFFECT`: existe evidência, mas conteúdo ou hash diverge do esperado; a unidade é bloqueada.

Somente os dois últimos casos constituem divergência que exige intervenção. Efeitos incompletos explicáveis pelo journal/outbox são recuperados automaticamente.

Após reinício, o backend reconstrói projeções, reconcilia banco, Git, worktrees, processos e serviços externos e retoma automaticamente do último checkpoint seguro. Status salvo isoladamente não prova conclusão.

Falhas operacionais recebem até 10 tentativas configuráveis. Tentativas não contam como rodadas de auditoria. Pausa e cancelamento solicitam checkpoint cooperativo. Encerramento do backend aguarda estado seguro.

## Consequências

Operações serão modeladas como workflows convergentes. Commit, branch, merge, push, PR, e-mail e limpeza precisam de evidências e chaves específicas. O banco terá backups automáticos e exportação.

## Alternativas rejeitadas

- Transação distribuída fictícia entre Git e banco.
- Repetir operações e tratar duplicidade depois.
- Escolher Git ou banco silenciosamente em divergência.
