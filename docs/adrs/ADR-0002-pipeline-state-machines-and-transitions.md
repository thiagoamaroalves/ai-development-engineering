---
schema_version: "1.0.0"
id: ADR-0002
title: Pipeline, State Machines, and Transitions
decision_status: ACCEPTED
implementation_status: UNPROCESSED
revision: 3
date: 2026-08-28
decision_scope: workflow
supersedes: []
superseded_by: null
related: [ADR-0001, ADR-0005, ADR-0009]
---

# ADR-0002 — Pipeline e máquinas de estados

## Contexto

O workflow inclui unidades com ciclos de vida diferentes. Uma máquina global criaria combinações ambíguas e forte acoplamento.

## Decisão

O pipeline canônico será:

1. ADRs aceitas → geração de SPECs;
2. SPEC → auditoria/remediação;
3. Gap Matrix → auditoria/remediação;
4. Plano de Implementação → auditoria/remediação;
5. tickets → auditoria/remediação;
6. commit documental por SPEC;
7. implementação e auditoria de tickets por DAG/ondas;
8. integração e auditoria de ondas;
9. finalização de tickets e recálculo do DAG;
10. Spec Implementation Conformance;
11. atualização com a principal e repetição da conformidade;
12. aprovação e publicação.

Serão usadas máquinas de estados separadas por agregado: execução, SPEC, etapa, atividade, ciclo auditável, onda, ticket, migração e publicação. Eventos coordenam os agregados. Estados superiores serão derivados dos inferiores sempre que possível. Comandos validam pré-condições; transições inválidas são rejeitadas e registradas.

Os estados funcionais de ticket são `DRAFT`, `READY`, `IMPLEMENTED`, `COMPLETED`, `BLOCKED` e `CANCELLED`. Estados transitórios permanecem no banco. `CANCELLED` é terminal; retomada exige novo ticket vinculado.

### Transições funcionais normativas dos tickets

| Origem | Destino | Comando/condição |
|---|---|---|
| `DRAFT` | `READY` | documentação aprovada e nenhuma dependência pendente |
| `DRAFT` | `BLOCKED` | documentação aprovada e existe dependência pendente |
| `DRAFT` | `CANCELLED` | cancelamento funcional explícito e auditado |
| `BLOCKED` | `READY` | skill de finalização comprova que o último bloqueio foi removido |
| `BLOCKED` | `CANCELLED` | cancelamento funcional explícito e auditado |
| `READY` | `IMPLEMENTED` | implementação individual possui veredito formal e commit aprovado |
| `READY` | `CANCELLED` | cancelamento funcional explícito e auditado |
| `IMPLEMENTED` | `COMPLETED` | onda integrada/auditada e skill de finalização conclui o ticket |

`COMPLETED` e `CANCELLED` são terminais. Tickets não são reabertos. Estados como fila, execução, auditoria, remediação, pausa e falha são operacionais e existem somente no banco.

### Vocabulário normativo de publicação

- `PUBLICATION_CANDIDATE_READY`: conformidade concluída contra a base atual.
- `AWAITING_PUBLICATION_APPROVAL`: candidato aguarda decisão humana.
- `LOCAL_INTEGRATION_PENDING` e `LOCAL_INTEGRATION_COMPLETE`: usados no push direto.
- `PR_OPEN`, `AWAITING_PR_MERGE` e `PR_MERGED`: usados no fluxo de PR.
- `REMOTE_PUBLICATION_CONFIRMED`: conclusão comum após confirmação remota.

Cancelamento operacional é cooperativo e em cascata, preserva estados funcionais e não reverte efeitos remotos. Pausa é retomável; cancelamento de execução ou SPEC é terminal e uma continuação exige nova execução.

## Regras de avanço

- Nenhuma etapa auditável avança sem veredito formal.
- Uma SPEC não espera outras SPECs independentes.
- Uma onda somente integra com todos os tickets aprovados.
- Ticket cancelado exige revisão auditada da documentação e do DAG.
- Tickets concluídos não são reabertos; ajustes usam novos tickets.

## Consequências

O backend deverá formalizar comandos, eventos, estados e pré-condições de cada agregado. A UI não poderá fabricar estados; ela apresenta projeções do domínio.

## Alternativas rejeitadas

- Uma máquina de estados única.
- Estados definidos livremente por cada skill.
- Avanço baseado no término do processo, sem veredito.
