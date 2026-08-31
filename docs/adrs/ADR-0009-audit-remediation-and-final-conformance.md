---
schema_version: "1.0.0"
id: ADR-0009
title: Audit, Remediation, and Final Conformance
decision_status: ACCEPTED
implementation_status: UNPROCESSED
revision: 3
date: 2026-08-28
decision_scope: governance
supersedes: []
superseded_by: null
related: [ADR-0002, ADR-0003, ADR-0004, ADR-0007]
---

# ADR-0009 — Auditoria, remediação e conformidade final

## Contexto

Cada artefato deve convergir por avaliação independente, e a soma de tickets aprovados não prova aderência integral à SPEC.

## Decisão

SPEC, Gap Matrix, Plano de Implementação, tickets, implementações, integrações, migração e conformidade usam ciclos formais de auditoria/remediação. Somente veredito estruturado de auditoria encerra o ciclo. Remediação nunca aprova.

O limite inicial é de 10 rodadas por artefato, configurável. Uma rodada compreende auditoria com remediação requerida, remediação e nova auditoria. Ao atingir o limite, somente a unidade é pausada e requer autorização para novas rodadas.

Após todos os tickets concluídos, `Spec Implementation Conformance` verifica aderência, cobertura, integração, regressões, testes, omissões e extrapolações. Findings de implementação são remediados diretamente e auditados de novo.

Se a conformidade exigir mudança normativa, a SPEC retorna à primeira etapa documental afetada e repete o downstream. Aprovações posteriores tornam-se obsoletas, mas históricas. Tickets concluídos não reabrem; novos tickets de ajuste/substituição são criados.

Antes da publicação, a principal é merged na branch da SPEC e toda a conformidade é repetida contra o commit candidato exato.

No fluxo por PR, o veredito também vincula SHA da base, SHA da head e árvore candidata. Mudança de qualquer um desses elementos invalida a autorização de merge e exige nova conformidade.

Relatórios, findings e evidências intermediárias ficam fora do Git, associados por hash ao conteúdo/commit auditado.

## Consequências

O workflow pode ser longo, mas produz evidência formal de cobertura ponta a ponta. Retornos tardios exigem invalidação explícita de downstream e nova decomposição.

## Alternativas rejeitadas

- Considerar ausência de findings textuais como aprovação.
- Criar tickets automaticamente para toda remediação final.
- Alterar SPEC silenciosamente na conformidade.
