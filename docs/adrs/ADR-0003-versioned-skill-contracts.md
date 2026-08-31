---
schema_version: "1.0.0"
id: ADR-0003
title: Versioned Skill Contracts and Execution Manifests
decision_status: ACCEPTED
implementation_status: UNPROCESSED
revision: 3
date: 2026-08-28
decision_scope: contracts
supersedes: []
superseded_by: null
related: [ADR-0002, ADR-0004, ADR-0006]
---

# ADR-0003 — Contratos versionados das skills

## Contexto

O backend não pode interpretar texto livre para decidir aprovação, retomada ou efeitos. Skills existentes precisam operar como componentes contratuais.

## Decisão

Toda skill emitirá JSON validado por JSON Schema. Haverá envelope comum e payload específico por capacidade. O envelope incluirá: versão, execução, atividade, atribuição de agente, artefato/ciclo, rodada/tentativa, status de execução, veredito funcional, checkpoints, artefatos, evidências, findings, efeitos solicitados e erros.

Texto humano poderá acompanhar o resultado, mas não terá autoridade operacional.

Os contratos usarão versionamento semântico:

- `major`: mudança incompatível;
- `minor`: campos opcionais e evolução compatível;
- `patch`: correção sem mudança semântica.

O backend declara versões suportadas. Cada execução fixa versões exatas no snapshot. Não haverá conversão silenciosa entre versões incompatíveis. JSON inválido, schema incompatível ou veredito desconhecido é falha de contrato, sujeita à política operacional de tentativas.

Um registro explícito e versionado mapeará cada etapa para uma skill, versões de entrada/saída, artefatos aceitos/produzidos, vereditos e restrições de papel.

O registro normal de skills pertence à configuração habilitada do repositório. Skills necessárias ao onboarding e à migração pertencem a um catálogo de bootstrap do sistema, versionado independentemente e disponível antes da habilitação do repositório. Esse catálogo só poderá executar capacidades de descoberta, validação, migração, auditoria e remediação de onboarding.

Cada atividade receberá manifesto imutável completo: caminhos, hashes, commits, autoridade, dependências, findings, rodada, tentativa, configurações, diretório de trabalho e schema esperado. Cada skill declarará checkpoints seguros e informações de retomada.

## Consequências

Skills existentes precisarão ser atualizadas. O backend poderá validar resultados deterministicamente, gerar SDKs/tipos e rejeitar drift contratual.

## Alternativas rejeitadas

- Interpretar respostas textuais.
- Adaptadores permanentes para formatos históricos.
- Cada skill definir estrutura sem envelope comum.
