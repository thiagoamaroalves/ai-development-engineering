---
schema_version: "1.0.0"
id: ADR-0010
title: Repository Configuration and Legacy Migration
decision_status: ACCEPTED
implementation_status: UNPROCESSED
revision: 3
date: 2026-08-28
decision_scope: repositories
supersedes: []
superseded_by: null
related: [ADR-0001, ADR-0003, ADR-0007]
---

# ADR-0010 — Configuração e migração de repositórios

## Contexto

Uma instância administrará repositórios independentes com estruturas e políticas diferentes. Artefatos legados podem não ter metadados estruturados.

## Decisão

Cada repositório terá configuração explícita e versionada contendo caminhos e convenções de ADRs, SPECs, Gap Matrices, planos e tickets; branch principal; comandos obrigatórios de build/teste/lint; estratégia de publicação; e políticas específicas suportadas.

A configuração é validada no cadastro e congelada no snapshot da execução. O repositório deve estar limpo. O orquestrador faz `fetch` e exige alinhamento exato entre branch principal local e remota. Não fará stash, commit, descarte ou correção automática de divergência.

Artefatos Markdown usam front matter YAML padronizado. Repositório legado deve passar por migração explícita antes de ser habilitado. Uma skill migra, outra audita e uma terceira remedia findings; o ciclo repete até veredito formal, com limite de 10 rodadas e segregação de agentes.

### Bootstrap de onboarding

O onboarding opera antes da habilitação normal usando catálogo de skills pertencente ao sistema e uma configuração candidata isolada. Seu lifecycle é:

`DISCOVERED → VALIDATING → MIGRATING → AUDITING ↔ REMEDIATING → READY_TO_ENABLE → ENABLED`.

A migração ocorre em workspace dedicado e não modifica a configuração ativa. Somente veredito formal da auditoria permite promover atomicamente a configuração candidata e habilitar o repositório. Falha, pausa ou cancelamento preservam o workspace e mantêm o repositório não habilitado. Depois de `ENABLED`, o runtime passa a usar o registro e a configuração versionados do repositório.

Uma execução pertence a exatamente um repositório. Dependências entre repositórios ficam fora do escopo inicial.

## Consequências

O onboarding precisa validar Git, `gh`, caminhos, schemas, comandos e migração. Configurações mudadas não afetam execuções já iniciadas.

## Alternativas rejeitadas

- Descoberta heurística de estrutura.
- Convenção fixa para todos os repositórios.
- Migração silenciosa no primeiro processamento.
