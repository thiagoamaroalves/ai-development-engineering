# Plano do protótipo — Orquestrador local

## Pergunta de design

Como tornar um workflow local, longo e auditável compreensível e operável sem dar autoridade de domínio ao frontend?

## Forma do protótipo

Protótipo React + TypeScript executado localmente em memória, com três variações estruturais da mesma aplicação, alternáveis por `?variant=A|B|C`. A variação A é o cockpit operacional; B prioriza rastreabilidade em trilho temporal; C prioriza filas, comandos e diagnóstico em uma mesa de comando.

## Limites

- Git, GitHub, Codex CLI, banco, e-mail e backend são simulados.
- Nenhuma ADR é alterada.
- Nenhuma ação chama integração externa ou persiste estado.
- Comandos passam por `requested → accepted → confirmed` simulado; pausa e cancelamento exibem checkpoint cooperativo.
- Os cenários são determinísticos e selecionáveis pelo usuário.

## Arquitetura de informação

1. **Visão geral** — pulso do sistema, intervenções, capacidade e publicações.
2. **Repositórios** — onboarding, validação e migração.
3. **Nova execução** — snapshot imutável e confirmação manual.
4. **Execuções** — pipeline e SPECs independentes.
5. **SPEC / detalhe** — timeline, auditoria, agentes, tickets, Git e publicação.
6. **DAG e ondas** — dependências, paralelismo, integração e estados funcionais.
7. **Atividade e agente** — manifesto, sessão, tentativa, rodada, checkpoint e resultado.
8. **Intervenções** — bloqueios e comandos que exigem decisão.
9. **Publicação** — candidato, aprovação, push direto/PR e confirmação remota.
10. **Artefatos e auditoria** — evidências, relatórios, logs, exportação e histórico.

## Modelo mockado

O domínio central em `prototype/src/mockDomain.ts` contém repositórios, execução selecionada, SPECs, tickets, atividades, capacidade, intervenções, publicação, artefatos e transições. `App.tsx` apenas projeta esse estado e encaminha comandos ao domínio. `scenarioId` troca projeções determinísticas; comandos adicionam uma transição estruturada ao feed e simulam confirmação por evento após um checkpoint curto.

## Critérios de validação visual

- Usuário entende em menos de um olhar o que está ativo, bloqueado, aguardando decisão e confirmado.
- A execução longa permanece legível sem depender de logs.
- O snapshot mostra autoridade, hash, revisão, base e contratos antes do processamento.
- O DAG explica por que cada ticket está `READY` ou `BLOCKED`.
- A publicação não aparece concluída antes de `REMOTE_PUBLICATION_CONFIRMED`.
- Todo comando deixa visível o pedido, a aceitação/rejeição e o evento confirmado.

## Decisões visuais registradas

- Fundo marfim e superfícies brancas para reduzir fadiga em uso prolongado.
- Azul-marinho para autoridade e navegação; lima para confirmação; âmbar para espera; coral para falha/bloqueio.
- Tipografia compacta com números tabulares e etiquetas monoespaçadas para IDs, SHAs e estados.
- Cards apenas para resumos; detalhes operacionais usam tabelas, trilhos e painéis de inspeção.
- Barra de variante fixa é exclusiva do protótipo e só aparece fora de build de produção.
