---
schema_version: "1.0.0"
id: ADR-0008
title: GitHub Publication and Human Approval
decision_status: ACCEPTED
implementation_status: UNPROCESSED
revision: 3
date: 2026-08-28
decision_scope: publication
supersedes: []
superseded_by: null
related: [ADR-0006, ADR-0007, ADR-0012]
---

# ADR-0008 — GitHub, publicação e aprovação humana

## Contexto

O fluxo é autônomo até a publicação, mas alterações na principal remota exigem controle humano e serialização.

## Decisão

A primeira versão integrará GitHub e reutilizará autenticação existente do `gh` CLI. Cada repositório configurará push direto ou Pull Request.

Após conformidade final, o candidato permanece na branch da SPEC. A interface apresenta commit, diff, testes, vereditos, conflitos e base validada. Publicação requer aprovação humana individual ou em lote.

Após aprovação, o orquestrador adquire fila exclusiva, faz `fetch` e confirma que a principal não mudou. Se mudou, a SPEC volta ao merge da principal e à conformidade. Se não mudou, faz merge local na principal e push como operação controlada e idempotente.

Falha de push preserva o merge local e entra em reconciliação; não há reset destrutivo automático.

No modo PR, a aprovação autoriza criar/atualizar a PR, mas não substitui a fila serial. Antes de autorizar o merge, o orquestrador:

1. adquire a fila exclusiva;
2. confirma SHA da base, SHA da head, mergeability e checks;
3. atualiza a branch da SPEC com a principal e repete a conformidade se a base mudou;
4. registra a árvore candidata aprovada;
5. autoriza o merge somente se a principal permanecer no SHA validado;
6. verifica que a árvore resultante corresponde ao candidato conformado.

Merge externo, mudança da base ou árvore resultante diferente invalidam o veredito e forçam reconciliação e nova conformidade. Branch protection/merge queue do GitHub deverá impedir ou detectar integração fora do protocolo. A SPEC só termina em `PR_MERGED` seguido de `REMOTE_PUBLICATION_CONFIRMED`. PR fechada sem merge não conclui a SPEC.

Merges finais são sempre seriais, inclusive em aprovação em lote. Limpeza ocorre somente após confirmação remota.

## Consequências

O backend precisará consultar refs, checks, PRs e merge pelo `gh`, detectar drift e correlacionar efeitos com chaves idempotentes.

## Alternativas rejeitadas

- Push automático sem confirmação.
- Merge local antes da aprovação.
- Considerar PR criada como conclusão.
