---
schema_version: "1.0.0"
id: ADR-0011
title: Local .NET Backend and Realtime API
decision_status: ACCEPTED
implementation_status: UNPROCESSED
revision: 3
date: 2026-08-28
decision_scope: backend
supersedes: []
superseded_by: null
related: [ADR-0003, ADR-0005, ADR-0006, ADR-0014]
---

# ADR-0011 — Backend local .NET e API em tempo real

## Contexto

O motor deve operar antes do frontend, executar processos nativos do Windows e continuar durante navegação ou fechamento do navegador.

## Decisão

O backend será um serviço autônomo em C#/.NET, executado em Windows nativo e iniciado manualmente. Não dependerá do frontend para continuar atividades.

Ele exporá API local e stream de eventos em tempo real. O frontend será um cliente sem autoridade sobre estados. Comandos mutantes retornam aceitação/rejeição e correlação; consultas oferecem snapshots; eventos atualizam projeções.

O backend possuirá um modo de onboarding anterior ao runtime de repositório. Esse modo usa apenas configuração candidata, catálogo de bootstrap do sistema e workspace de migração, sem exigir que o repositório já esteja habilitado.

O backend iniciará Codex CLI como processo local, capturará saída estruturada, eventos, código de saída, sessão, duração e métricas disponíveis. Cada atividade usa processo/sessão novos. Parada e encerramento são cooperativos por checkpoints.

O desenho atenderá escala local pequena sem limites rígidos de domínio. Componentes internos devem separar domínio, aplicação/orquestração, adaptadores de Codex/Git/GitHub/e-mail, persistência e API.

## Consequências

Será necessário definir protocolo de replay/reconexão, contratos HTTP/eventos, hosting local e supervisão de processos. O backend pode ser testado headless antes do frontend.

## Alternativas rejeitadas

- Backend acoplado ao ciclo de vida da página.
- CLI como única interface permanente.
- WSL ou Docker como requisito inicial.
