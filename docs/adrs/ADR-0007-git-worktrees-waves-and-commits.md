---
schema_version: "1.0.0"
id: ADR-0007
title: Git Worktrees, Waves, Integration, and Commits
decision_status: ACCEPTED
implementation_status: UNPROCESSED
revision: 3
date: 2026-08-28
decision_scope: git
supersedes: []
superseded_by: null
related: [ADR-0002, ADR-0005, ADR-0006, ADR-0008, ADR-0009]
---

# ADR-0007 — Git, worktrees, ondas e commits

## Contexto

Tickets paralelos podem alterar os mesmos arquivos. Aprovações precisam corresponder a conteúdo exato e commits não podem misturar SPECs.

## Decisão

Cada SPEC terá branch de integração própria. Cada ticket terá branch e worktree dedicadas. Tickets prontos executam em paralelo, mesmo com sobreposição provável.

Tickets aprovados individualmente aguardam a onda. A onda só integra quando todos os tickets estiverem aprovados. Cancelamento exige revisão auditada do DAG. Conflitos são resolvidos por agente exclusivo e auditados por outro agente. A próxima onda usa apenas a base integrada e aprovada.

A branch principal será incorporada à branch da SPEC por merge, preservando hashes. Não haverá rebase ou force-push automático. O merge resultante retorna à conformidade.

Todo commit pertence a exatamente uma SPEC. Marcos:

1. ADRs aceitas já commitadas;
2. commit documental por SPEC após SPEC, Gap Matrix, plano e tickets aprovados;
3. commit da implementação individual após auditoria;
4. commits de finalização, um por ticket, após integração/auditoria da onda;
5. commit final único das remediações aprovadas na conformidade.

Tickets liberados para `READY` entram no commit do ticket cuja finalização removeu o último bloqueio. Antes de commit, auditorias registram hash da árvore avaliada.

Worktrees e branches são removidas somente após integração remota confirmada; pausas e falhas preservam recursos.

### Proteção do candidato documental

O veredito final da fase documental produz `DocumentCandidateTreeHash`, associado à SPEC, Gap Matrix, plano, tickets e aprovações que o compõem. Imediatamente antes do commit documental, o orquestrador recalcula a árvore. Divergência invalida o candidato e retorna o artefato afetado à auditoria. O commit registra a correlação com o hash aprovado; nenhum arquivo fora da SPEC pode entrar nesse commit.

## Consequências

O histórico contém commits adicionais de integração, mas mantém rastreabilidade e validade dos hashes auditados. Arquivos compartilhados são conciliados serialmente por SPEC.

## Alternativas rejeitadas

- Rebase de commits auditados.
- Commit por atividade ou relatório operacional.
- Commit contendo mudanças de duas SPECs.
