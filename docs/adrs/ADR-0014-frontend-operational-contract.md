---
schema_version: "1.0.0"
id: ADR-0014
title: Frontend Operational Contract
decision_status: ACCEPTED
implementation_status: UNPROCESSED
revision: 3
date: 2026-08-28
decision_scope: frontend
supersedes: []
superseded_by: null
related: [ADR-0002, ADR-0005, ADR-0008, ADR-0011, ADR-0013]
---

# ADR-0014 — Contrato operacional do frontend

## Contexto

A interface precisa tornar um workflow complexo compreensível sem adquirir autoridade sobre regras do domínio.

## Decisão

O frontend será aplicação web local aberta no navegador. Tecnologia específica será escolhida após protótipo validado. Ele consumirá snapshots, comandos e eventos do backend.

A interface mostrará repositórios, execuções, ADRs, SPECs, etapas, ondas e tickets; estados e atividade atual; agente/skill/rodada/tentativa; tempos; progresso e DAG; capacidade e filas; bloqueios; branches/worktrees/commits; logs, findings, vereditos, artefatos e consumo.

Controles: preparar e confirmar execução; pausar/retomar; repetir falha; cancelar processamento não integrado; alterar prioridade; autorizar rodadas adicionais; reconciliar divergência; inspecionar/baixar/exportar evidências; aprovar publicação individual ou em lote.

A interface usa o vocabulário normativo de publicação da ADR-0002. Push direto distingue candidato, aprovação, integração local e confirmação remota. PR distingue abertura, espera pelo merge, merge e confirmação remota. “Concluído” só é exibido após `REMOTE_PUBLICATION_CONFIRMED`.

Comandos não alteram a UI otimisticamente como se já tivessem ocorrido. A interface mostra `requested`, `accepted/rejected` e o estado confirmado por eventos. Pausa/cancelamento exibem estado solicitado até checkpoint cooperativo.

E-mails são apenas alertas de intervenção; a interface é a fonte completa de acompanhamento operacional.

## Consequências

O protótipo deve validar hierarquia, dashboards, timelines, DAG, filas e aprovações. O contrato de API/eventos precede a implementação final do frontend.

## Alternativas rejeitadas

- Frontend controlar diretamente Git ou Codex.
- Tecnologia de frontend fixada antes do protótipo.
- Interface apenas de logs, sem modelo operacional.
