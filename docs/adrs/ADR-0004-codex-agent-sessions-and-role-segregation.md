---
schema_version: "1.0.0"
id: ADR-0004
title: Codex Agent Sessions and Role Segregation
decision_status: ACCEPTED
implementation_status: UNPROCESSED
revision: 3
date: 2026-08-28
decision_scope: agents
supersedes: []
superseded_by: null
related: [ADR-0003, ADR-0005, ADR-0009]
---

# ADR-0004 — Sessões Codex e segregação de agentes

## Contexto

Auditoria independente exige impedir que um agente valide sua própria remediação e evitar dependência de memória conversacional.

## Decisão

Cada atividade de skill cria uma nova sessão isolada do Codex CLI e um novo `AgentAssignmentId`. A atribuição vincula execução, atividade, papel, skill, artefato, ciclo, rodada, processo, manifesto e identificador nativo de sessão, quando disponível.

Não é necessário trocar modelo ou persona. Independência significa sessão limpa, contexto manifesto e identidade lógica nova.

Um agente não pode atuar novamente no mesmo ciclo do mesmo artefato, incluindo revisões produzidas nesse ciclo. Ele permanece elegível para outros artefatos e outras SPECs. Se a conformidade devolver o artefato a etapa anterior na mesma execução, o ciclo continua e a inelegibilidade permanece.

Cada ciclo possui `ArtifactCycleId`. Ele é criado quando uma revisão entra na primeira atividade auditável, permanece estável durante todas as rodadas e retornos downstream da mesma execução, e termina somente por aprovação formal ou cancelamento terminal. Uma nova execução sobre uma revisão posterior cria novo ciclo. O histórico de `AgentAssignmentId` é indexado por `ArtifactCycleId` e constitui a evidência de elegibilidade.

Remediador nunca audita a própria alteração. Agentes de resolução de conflito não podem ser implementadores dos tickets conflitantes nem auditores da integração. Se não houver agente elegível, a unidade entra em espera; o orquestrador não assume a tarefa nem reduz a segregação.

O contexto entre sessões é transmitido somente por manifestos, artefatos e resultados persistidos. Raciocínio interno e memória conversacional anterior não são autoridade.

## Consequências

O scheduler precisa manter histórico de elegibilidade por ciclo de artefato. Processos do CLI devem ser correlacionáveis e observáveis. Ciclos longos podem aguardar novas identidades.

## Alternativas rejeitadas

- Sessão persistente por SPEC.
- Reutilizar agente na mesma rodada porque a skill mudou.
- Exigir modelo diferente como prova de independência.
