---
schema_version: "1.0.0"
id: ADR-0005
title: Scheduler, Capacity, Priority, and Concurrency
decision_status: ACCEPTED
implementation_status: UNPROCESSED
revision: 3
date: 2026-08-28
decision_scope: scheduling
supersedes: []
superseded_by: null
related: [ADR-0002, ADR-0004, ADR-0007]
---

# ADR-0005 — Scheduler, capacidade e concorrência

## Contexto

Há limites dinâmicos de agentes, múltiplas SPECs, DAGs de tickets, vários repositórios e execuções concorrentes.

## Decisão

O orquestrador detectará dinamicamente a capacidade disponível e nunca a ultrapassará. Sem vaga, atividades permanecem em fila. O orquestrador não implementa tarefas no lugar dos agentes, não interrompe nem apressa sessões ativas.

A capacidade será fornecida por uma abstração `AgentCapacityProvider`. Quando o Codex CLI oferecer capacidade/vagas confiáveis, o provider usará essa autoridade. Quando não oferecer, retornará `UNKNOWN` e aplicará um teto conservador configurado localmente. Todo spawn exige lease de capacidade persistida; o lease é liberado por término confirmado ou reconciliação. Sem capacidade conhecida dentro do teto e sem lease, o scheduler não despacha.

Múltiplas execuções e repositórios independentes compartilham o pool global. O scheduler usará prioridade configurável com distribuição justa para evitar inanição. Alterar prioridade muda o peso/ordem futura, não concede monopólio.

Cada SPEC avança independentemente. Tickets usam DAG; todos os `READY` podem executar em paralelo. A próxima onda é calculada somente após integração, auditoria, finalização da onda anterior e recálculo do DAG.

Filas distinguem falta de capacidade, falta de agente elegível, dependência, pausa, aprovação e merge serial. A fila de merge final é exclusiva e serial.

## Regras

- Nenhum despacho sem capacidade confirmada.
- Nenhum ticket executa antes das dependências concluídas.
- Ciclo no DAG bloqueia a SPEC.
- Potencial conflito de arquivo não impede execução paralela de tickets; é tratado na integração.
- Uma execução nova pode começar enquanto outra está ativa, com snapshot independente.

## Consequências

O scheduler precisa ser reentrante, persistido e orientado a eventos. Justiça e prioridade deverão ter algoritmo determinístico documentado na implementação.

## Alternativas rejeitadas

- Prioridade estrita que monopoliza agentes.
- Cota fixa por execução.
- Serializar tickets por possível sobreposição de arquivos.
