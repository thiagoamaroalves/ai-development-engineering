# Relatório final de cobertura do protótipo

**Data:** 2026-08-31  
**Escopo:** interface local simulada do Orquestrador de Tarefas  
**Autoridade:** ADR-0001–ADR-0014, todas em `revision: 3`, `decision_status: ACCEPTED` e `implementation_status: UNPROCESSED`

## Resultado

**PROTÓTIPO COBERTO PARA VALIDAÇÃO VISUAL E FUNCIONAL**

As 14 ADRs têm pelo menos uma tela, estado, comando ou cenário correspondente na [matriz de rastreabilidade](prototype-traceability.md). O protótipo não implementa backend real, não chama Git/GitHub/Codex/banco/e-mail e mantém estado em memória.

## Verificações executadas

| Verificação | Resultado |
|---|---|
| `npm run lint` | PASS |
| `npm run build` | PASS |
| servidor Vite local | PASS — `http://localhost:4173/` respondeu durante a validação |
| rota inicial e assets | PASS — HTML servido pelo Vite |
| ADRs modificadas | PASS — nenhuma ADR foi editada pelo protótipo |
| navegador automatizado | INDISPONÍVEL nesta sessão — não havia instância conectada |

## Cobertura por telas mínimas

| Tela | Status | Evidência no código |
|---|---|---|
| Visão geral | Coberta | KPIs, pipeline, atenção, capacidade, transições, publicações |
| Repositórios | Coberta | cadastro/validação simulados, clean/dirty, alinhamento, onboarding e migração |
| Nova execução | Coberta | snapshot, 14 ADRs elegíveis, hashes, revisão, base, skills, config, guardrails e confirmação |
| Detalhe da execução | Coberta | histórico de runs, pipeline e SPECs independentes |
| Detalhe da SPEC | Coberta | progresso, timeline, agentes, findings, tickets, lineage e publicação |
| DAG e ondas | Coberta | dependências, ondas, paralelismo, estados funcionais e integração |
| Atividade e agente | Coberta | IDs, sessão, skill/version, manifesto, rodada, tentativa, checkpoint, duração e journal |
| Central de intervenções | Coberta | capacidade, retry, rodada 10, divergência, governança e approval |
| Aprovação de publicação | Coberta | push direto/PR, SHAs, diff, checks, aprovação individual/lote e drift |
| Artefatos e auditoria | Coberta | manifestos, relatórios, findings, eventos, histórico, download e exportação |

## Cenários demonstráveis

Todos os 12 cenários têm uma opção no seletor e alteram o estado/mensagem exibidos:

1. execução normal até conclusão;
2. SPEC em auditoria e remediação;
3. falta de capacidade;
4. falha operacional com retry;
5. décima rodada atingida;
6. tickets paralelos com conflito;
7. divergência Git/banco;
8. reinício e recovery por checkpoint;
9. aprovação invalidada por mudança na principal;
10. Pull Request aguardando merge;
11. migração de repositório legado;
12. alteração indevida de ADR implementada.

## Limitações conhecidas

- A validação visual automatizada depende de uma instância Browser conectada; ela estava indisponível nesta execução.
- O protótipo usa projeções determinísticas e não reproduz persistência, reconexão ou concorrência real.
- As transições de comando são temporizadas em memória para tornar `requested`, `accepted` e `confirmed` observáveis.
- O estado `ADR_PORTFOLIO_APPROVED` é exibido como autoridade fornecida pelo usuário; nenhuma decisão nova foi criada.

## Questões para a avaliação do usuário

- Qual das variantes A (cockpit), B (trilho de rastreabilidade) e C (mesa de comando) melhor representa o uso diário?
- A distinção entre estado funcional, estado operacional, bloqueio e espera é suficientemente clara?
- O snapshot da nova execução contém informação suficiente para uma confirmação segura?
- A visão de DAG explica por que um ticket está `BLOCKED` sem abrir logs?
- A tela de publicação torna evidente quando uma aprovação foi invalidada pela mudança da principal?
- Quais informações devem permanecer sempre visíveis quando uma execução durar horas ou dias?
