---
schema_version: "1.0.0"
id: ADR-0001
title: Workflow Domain, Identity, and Immutability
decision_status: ACCEPTED
implementation_status: UNPROCESSED
revision: 3
date: 2026-08-28
decision_scope: domain
supersedes: []
superseded_by: null
related: [ADR-0002, ADR-0006, ADR-0010]
---

# ADR-0001 — Domínio, identidade e imutabilidade do workflow

## Contexto

O orquestrador precisa processar ADRs aceitas até a publicação da implementação, preservando rastreabilidade entre decisões, SPECs, documentos, tickets, atividades, agentes, commits e execuções. Inferir progresso apenas pela existência de arquivos não oferece identidade, retomada ou auditoria suficientes.

## Decisão

O orquestrador manterá identidade persistente própria para repositório, execução, ADR, SPEC, revisão, artefato, ciclo auditável, etapa, atividade, tentativa, agente atribuído, onda, ticket, efeito externo e publicação.

O comando de entrada será manual: **processar todas as ADRs novas**. Antes da execução, será criado um snapshot imutável contendo ADRs elegíveis e hashes, commit-base, configuração e versões de skills/contratos. Somente ADRs `ACCEPTED` entram. ADRs aceitas depois aguardam nova execução.

A geração de SPECs recebe todas as ADRs aceitas ainda sem cobertura e decide autonomamente o mapeamento muitos-para-muitos ADR ↔ SPEC. Cada SPEC resultante avança de modo independente.

O lifecycle decisório (`PROPOSED`, `ACCEPTED`, `SUPERSEDED`, `REJECTED`) é separado do lifecycle de realização (`UNPROCESSED`, `PROCESSING`, `IMPLEMENTED`). Uma ADR `ACCEPTED` e ainda não implementada pode ser remediada por auditoria formal, incrementando `revision` e preservando o histórico. Uma ADR `IMPLEMENTED` é imutável. Detalhamento ou mudança exige nova ADR. Uma substituição usa relações recíprocas `supersedes`/`superseded_by`; a anterior permanece `SUPERSEDED`. Alteração de conteúdo em ADR implementada bloqueia o processamento.

Metadados normativos de artefatos Markdown serão expressos em front matter YAML padronizado. Revisões de SPEC preservam identificador e arquivo, incrementando revisão e mantendo linhagem Git.

Os campos `adr_content_hash`, `implementation_commit_sha`, `implemented_at` e a evidência de realização pertencem exclusivamente ao registro operacional persistente do orquestrador, e não ao documento ADR nem ao seu front matter. O documento ADR não autorreferencia esses metadados: o registro operacional mantém a relação por identidade e hash de conteúdo. Assim, a realização pode ser registrada sem inserir autorreferência ou exigir alteração posterior de uma ADR depois que seu `implementation_status` for `IMPLEMENTED`.

## Invariantes

- Uma execução pertence a um único repositório.
- Uma ADR implementada nunca é reescrita.
- Aceitação decisória não equivale a implementação.
- Remediação de ADR aceita e não implementada incrementa sua revisão.
- Uma execução não incorpora ADRs aceitas após seu snapshot.
- Toda relação ADR ↔ SPEC é explícita e verificável.
- ADR elegível sem cobertura ou justificativa impede a conclusão da geração.

## Consequências

O modelo suporta múltiplas execuções e repositórios sem depender de memória de sessão. Exige identificadores estáveis, validação de metadados, hashes de conteúdo e reconciliação com Git.

## Alternativas rejeitadas

- Inferir ADR nova apenas pelo Git ou pela ausência de SPEC.
- Alterar ADR implementada e reprocessá-la silenciosamente.
- Acrescentar ADR aceita a uma execução em andamento.
