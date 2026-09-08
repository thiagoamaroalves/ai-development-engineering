# Reauditoria independente de conformidade do protótipo — 2026-08-31

## 1. Veredito formal

`PROTOTYPE_REMEDIATION_REQUIRED`

O protótipo demonstra uma autoridade mockada centralizada, guards, rejeições,
eventos, publicação direta/PR, onboarding, segregação de assignments e as
principais jornadas. Porém, a reauditoria encontrou uma violação `MAJOR` que
impede o veredito conformante: o fluxo normal transforma atividades ainda
`WAITING_CAPACITY` em concluídas e publica, sem despacho, efeito operacional ou
liberação das leases. `PCA-MAJOR-002` e `PCA-MAJOR-006` permanecem apenas
parcialmente fechados. Também há um finding `MINOR` sobre a evidência declarada
de testes.

Contagem desta reauditoria: **1 MAJOR novo, 1 MINOR novo**. Não foram
identificados novos findings `CRITICAL`.

## 2. Independência, escopo e método

Esta avaliação foi realizada como reauditoria independente do implementador e
do remediador. O relatório de remediação foi tratado como alegação a ser
confirmada, não como prova.

Foram lidos integralmente os artefatos de autoridade e planejamento exigidos,
as 14 ADRs, o relatório de auditoria original, o relatório de remediação,
`prototype/README.md`, o plano, a rastreabilidade, a cobertura, o domínio
mockado, a UI, os estilos e os 43 testes presentes no código. Foram executados
probes independentes, a suíte de testes, lint, build, inspeção HTTP, montagem
das 30 combinações de rota/variante e inspeções interativas no navegador local.

Não foram modificados código, testes, dependências, ADRs, planejamento,
relatório original ou relatório de remediação.

## 3. Autoridade e precedência

Precedência aplicada:

1. `docs/adrs/ADR-0001` a `ADR-0014`, todas em `revision: 3`,
   `decision_status: ACCEPTED` e `implementation_status: UNPROCESSED`;
2. `docs/adrs/ADR-0001-0014-portfolio-remediation-ASC-MAJOR-002-2026-08-28.md`,
   com `ADR_PORTFOLIO_APPROVED`;
3. `docs/adrs/ADR-0001-0014-portfolio-remediation-2026-08-28.md`, também com
   `ADR_PORTFOLIO_APPROVED`;
4. `docs/adrs/README.md`;
5. planejamento, rastreabilidade, cobertura e README do protótipo, usados como
   evidência descritiva e confrontados com o código.

As ADRs continuam normativas e somente leitura. Relatórios operacionais,
findings e evidências de execução não substituem essa autoridade.

## 4. Baseline auditado

### 4.1 Identidade e estado inicial

- Diretório auditado:
  `C:\Users\taalves\.codex\worktrees\2c6d\ai-engineering-development`.
- Branch: nenhum branch ativo; `HEAD (no branch)`.
- Commit/HEAD: `4ae336c7f6a1dae468a23e1e9cbfe1fb95b63386`.
- Commit: `docs: registra aprovação do portfólio ADR-0001 a ADR-0014`.
- `AGENTS.md`: não encontrado no repositório nem nos diretórios pesquisados.
- Estado inicial: os artefatos do protótipo e os documentos de planejamento,
  auditoria, remediação e reauditoria estavam não rastreados.
- O relatório de reauditoria já existia no estado inicial e foi preservado como
  o único arquivo autorizado a ser atualizado.

### 4.2 Diff da remediação

Como `prototype/` e os relatórios estão não rastreados neste commit, Git não
fornece um diff histórico confiável para atribuir a remediação. Não atribuo ao
remediador alterações preexistentes. O relatório de remediação declara como
escopo desta rodada:

- `prototype/src/mockDomain.ts`;
- `prototype/src/App.tsx`;
- `prototype/src/styles.css`;
- `prototype/tests/mockDomain.test.ts`;
- `prototype/tests/ui.test.ts`;
- `docs/prototype-conformance-remediation-2026-08-31.md`.

Os arquivos do checkout que serviu o navegador e os arquivos auditados têm os
mesmos hashes de conteúdo para a implementação. Nenhuma dependência ou lockfile
foi alterada nesta rodada declarada.

## 5. Resultado dos dez findings originais

| Finding | Resultado | Conclusão independente |
|---|---|---|
| `PCA-CRITICAL-001` | `CLOSED` | Comandos passam por `requestCommand`/`advanceCommand`; rejeição não aplica efeito e confirmação aplica efeito no domínio. |
| `PCA-MAJOR-001` | `CLOSED` | 14 hashes completos, conjunto fechado, guards de integridade, snapshot e mutação de ADR demonstrados. |
| `PCA-MAJOR-002` | `PARTIALLY_CLOSED` | Estados e guards foram modelados, mas `ADVANCE_NORMAL` conclui atividades que ainda aguardam capacidade. |
| `PCA-MAJOR-003` | `CLOSED` | As 12 factories são determinísticas, isoláveis e carregam estados específicos; a cobertura interativa completa ficou limitada. |
| `PCA-MAJOR-004` | `CLOSED` | Push direto e PR têm estados, comandos, SHAs, fila e confirmação remota separados. |
| `PCA-MAJOR-005` | `CLOSED` | Tickets, ondas, conflito, auditoria, integração, cancelamento e recálculo usam o domínio comum. |
| `PCA-MAJOR-006` | `PARTIALLY_CLOSED` | UNKNOWN impede despacho e leases são adquiridas no start, mas o fluxo normal não libera leases nem respeita a espera até o efeito real. |
| `PCA-MAJOR-007` | `CLOSED` | Bootstrap ocorre antes de `ENABLED` e promoção exige auditoria aprovada. |
| `PCA-MAJOR-008` | `CLOSED` | Controles normativos possuem handlers, guards, rejeições e eventos no domínio/UI. |
| `PCA-MINOR-001` | `CLOSED` | Nomes acessíveis, regiões live, foco declarado e contraste de tokens foram verificáveis no DOM/estilo. |

### 5.1 PCA-CRITICAL-001 — autoridade do frontend

- Requisito original: o frontend é cliente sem autoridade; o fluxo deve ser
  `ação → solicitação → validação → aceitação/rejeição → processamento → efeito
  confirmado`.
- Fonte normativa: ADR-0002, ADR-0011 e ADR-0014.
- Evidência original: `App.tsx` fabricava aceitação/confirmação e não produzia
  rejeições.
- Correção declarada: `mockDomain.ts` passou a concentrar commands, guards,
  eventos e efeitos.
- Evidência atual: `requestCommand` registra `requested`; o primeiro
  `advanceCommand` valida e produz `accepted` ou `rejected`; o segundo valida de
  novo e somente então chama `applyEffect`. A UI chama esse domínio em
  `App.tsx:40`.
- Teste associado: `rejeita transição inválida sem fabricar efeito`,
  `separa solicitação, aceitação e efeito confirmado`, teste DOM de dispatch e
  rejeição.
- Comportamento observado: no navegador, `Validar snapshot` mostrou toast
  `requested` e depois `confirmed`; comandos inválidos apareceram desabilitados
  com a razão do guard. O journal expôs `command.requested` e
  `command.accepted`.
- Critério objetivo: comando válido com requested/accepted/confirmed e comando
  inválido com requested/rejected, sem mutação funcional.
- Resultado: `CLOSED`.

### 5.2 PCA-MAJOR-001 — snapshot e elegibilidade de ADRs

- Requisito original: snapshot fechado somente com ADRs elegíveis, hashes,
  base, configuração e versões; mutação ou drift deve impedir o início.
- Fonte normativa: ADR-0001, ADR-0003, ADR-0010 e ADR-0014.
- Evidência original: lista fixa, hashes abreviados e nenhum guard real.
- Correção declarada: records de ADR, hashes completos, `validateAdrIntegrity`,
  validação de inputs e lock do snapshot.
- Evidência atual: `ADR_HASHES` contém 14 SHA-256; `eligibleAdrs` exige
  `ACCEPTED`, `UNPROCESSED` e hash atual igual ao esperado; `VALIDATE_SNAPSHOT`
  exige integridade, tree limpa, alinhamento e inputs coincidentes. O cenário
  `adr-mutation` reduz a elegibilidade a 13 e bloqueia a validação.
- Teste associado: hashes completos, conjunto incompleto, drift antes do lock,
  lock sem alteração da lista e ADR implementada divergente.
- Comportamento observado: a rota Nova execução exibiu os 14 hashes completos;
  a rota `adr-mutation` exibiu `REJECTED`, `13/14 ADRs elegíveis` e habilitou
  apenas `Restaurar ADR`.
- Critério objetivo: mutação/base/configuração divergente rejeita início e
  snapshot confirmado permanece congelado.
- Resultado: `CLOSED`.

### 5.3 PCA-MAJOR-002 — máquinas funcional/operacional

- Requisito original: separar estados funcional e operacional, aplicar guards,
  terminalidade, espera, falha, pausa/cancelamento cooperativos e efeitos
  somente após transição válida.
- Fonte normativa: ADR-0002, ADR-0005, ADR-0006, ADR-0009 e ADR-0014.
- Evidência original: apenas `RUNNING/PAUSED/COMPLETED` e pausa genérica.
- Correção declarada: tipos separados, estados solicitados, guards,
  `assertCoherentState`, cancelamento cooperativo e projeções derivadas.
- Evidência atual: tipos e guards existem em `mockDomain.ts`; pausa mostra
  `PAUSE_REQUESTED` antes de `PAUSED`; tickets preservam estado funcional em
  cancelamento operacional. Entretanto, `applyEffect(ADVANCE_NORMAL)` em
  `mockDomain.ts:317` força todas as atividades não concluídas a `COMPLETED`
  quando chega à publicação, mesmo que estejam `WAITING_CAPACITY`.
- Teste associado: guards de pausa/cancelamento e jornada normal. Os testes
  não afirmam que toda atividade concluída teve lease/efeito antes de publicar.
- Comportamento observado: após start normal, o probe independente encontrou 1
  atividade `RUNNING` e 4 `WAITING_CAPACITY`; após três avanços, as cinco
  atividades estavam `COMPLETED` e a publicação foi confirmada.
- Critério objetivo: nenhuma atividade em espera/falha pode virar concluída ou
  satisfazer o gate de publicação sem despacho, efeito e confirmação próprios.
- Resultado: `PARTIALLY_CLOSED`.

### 5.4 PCA-MAJOR-003 — demonstrabilidade das 12 famílias

- Requisito original: cada família precisa de estado inicial, ações válidas e
  rejeitadas, transições, mensagens, evidências, estado final, reset e
  isolamento; seletor sozinho não basta.
- Fonte normativa: ADR-0002, ADR-0004, ADR-0005, ADR-0006, ADR-0007, ADR-0008,
  ADR-0009 e ADR-0010.
- Evidência original: cenários eram somente rótulos/mensagens.
- Correção declarada: factories determinísticas, jornadas no domínio, reset
  por reconstrução e integração DOM.
- Evidência atual: `createScenarioState` contém as 12 famílias; o teste de
  jornada exercita normal, audit, capacity, retry, rounds, conflict,
  divergence, recovery, drift, PR, migration e ADR mutation; `changeScenario`
  cancela timers, reconstrói o estado e limpa seleção/hash.
- Teste associado: factories coerentes, snapshots determinísticos e jornada
  das 12 famílias.
- Comportamento observado: todas as 12 opções carregaram rota React válida e
  descrição específica; cada tela representativa exibiu estados e ações
  coerentes com sua factory. Não foi possível percorrer manualmente todas as
  ações de todas as famílias no navegador.
- Critério objetivo: cada factory tem roteiro executável com asserts de estados,
  guards, eventos, mensagens, resultado e reset sem interferência.
- Resultado: `CLOSED` para a demonstrabilidade determinística do domínio;
  limitação visual registrada na seção 10.

### 5.5 PCA-MAJOR-004 — push direto e Pull Request

- Requisito original: protocolos separados; conclusão somente em
  `REMOTE_PUBLICATION_CONFIRMED`; drift invalida aprovação.
- Fonte normativa: ADR-0002, ADR-0007, ADR-0008, ADR-0009 e ADR-0014.
- Evidência original: PR e push misturados e confirmação terminal prematura.
- Correção declarada: estados e comandos específicos, fila serial, base/head/
  tree, checks, mergeability, invalidação e confirmação remota.
- Evidência atual: `visiblePublicationCommands` separa os modos; guards exigem
  candidato, aprovação, fila, hashes e checks; PR exige `PR_MERGED` antes de
  `CONFIRM_REMOTE`; push direto exige `LOCAL_INTEGRATION_COMPLETE`.
- Teste associado: drift, fila/SHAs, push sem confirmação e PR sem confirmação
  antes do merge.
- Comportamento observado: a rota PR mostrou `PR_OPEN`, `AWAITING_PR_MERGE`,
  `PR_MERGED` e confirmação remota como etapas distintas; o botão de confirmar
  iniciou desabilitado.
- Critério objetivo: qualquer mudança de base/head/tree rejeita aprovação ou
  merge; PR aberta/merged sem confirmação não é concluída.
- Resultado: `CLOSED`.

### 5.6 PCA-MAJOR-005 — DAG, ondas e pré-condições

- Requisito original: dependências coerentes, execução paralela, integração
  após aprovação, resolução de conflito exclusiva, auditoria independente e
  cancelamento funcional distinto.
- Fonte normativa: ADR-0002, ADR-0005, ADR-0007 e ADR-0009.
- Evidência original: onda divergente entre dados e grafo, inspector estático.
- Correção declarada: tickets normalizados, `recalculateDag`, guards de onda,
  conflito, auditoria e cancelamento.
- Evidência atual: o grafo filtra os mesmos `state.tickets` que o inspector;
  `INTEGRATE_WAVE` exige todos os tickets da onda `IMPLEMENTED/COMPLETED` e
  `APPROVED`; conflito exige `RESOLVE_CONFLICT` e depois `AUDIT_INTEGRATION`.
- Teste associado: conflito, integração bloqueada, cancelamento após revisão e
  desbloqueio derivado da transição real.
- Comportamento observado: no cenário conflito, integração começou bloqueada,
  resolução ficou habilitada e auditoria só apareceu após resolução.
- Critério objetivo: tabela/grafo concordam e a integração rejeita qualquer
  onda sem tickets aplicáveis aprovados e auditoria requerida.
- Resultado: `CLOSED`.

### 5.7 PCA-MAJOR-006 — agentes, ciclos e capacidade

- Requisito original: assignments/sessões/ciclos segregados, histórico de
  participação, capacidade conhecida/UNKNOWN, teto conservador, filas e lease;
  nenhum despacho sem capacidade confirmada.
- Fonte normativa: ADR-0003, ADR-0004 e ADR-0005.
- Evidência original: IDs decorativos e capacidade fixa sem scheduler.
- Correção declarada: `AgentAssignment`, `ArtifactCycleId`, histórico,
  `agentIsEligible`, capacidade UNKNOWN, `dispatchAvailableActivities` e
  leases.
- Evidência atual: atividades têm assignment, sessão, papel, skill, ciclo,
  rodada, tentativa e chave idempotente; reuso é rejeitado; UNKNOWN mantém
  atividades em espera; dispatch explícito consome uma lease conhecida.
  Contudo, o fluxo normal começa com leases ocupadas e quatro atividades em
  espera, depois publica essas quatro sem despacho; `PUSH_REMOTE` também não
  libera leases.
- Teste associado: segregação, reuso, UNKNOWN, retry com novo assignment e
  dispatch com lease.
- Comportamento observado: probe normal após start: `used=5`, `available=0`,
  `leases=5`, `RUNNING=1`, `WAITING_CAPACITY=4`; após publicação: `COMPLETED=5`
  mas `leases=5` e `available=0` permanecem.
- Critério objetivo: capacidade ocupada corresponde a atividades realmente
  ativas; espera só é removida por lease/efeito; término/reconciliação libera
  lease e permite retomada sem vazamento.
- Resultado: `PARTIALLY_CLOSED`.

### 5.8 PCA-MAJOR-007 — onboarding legado

- Requisito original: `DISCOVERED → inspeção → validação → bootstrap →
  migração → verificação → ENABLED`, com bootstrap antes de habilitação e
  promoção somente após auditoria.
- Fonte normativa: ADR-0003, ADR-0010 e ADR-0011.
- Evidência original: `READY_TO_ENABLE` era exibido apesar de dirty/diverged.
- Correção declarada: lifecycle de onboarding, workspace candidato, quatro
  atividades segregadas, guards e promoção formal.
- Evidência atual: `validation` exige `VALIDATING`, `clean` e `aligned`; o
  bootstrap exige estado `BOOTSTRAPPING` e não exige `ENABLED`; promoção exige
  auditoria concluída/aprovada.
- Teste associado: jornada de migração completa e rejeição de auditoria que
  reutiliza assignment de migração.
- Comportamento observado: cenário inicial mostrou `DISCOVERED`, `DIRTY / DIVERGED`
  e ações posteriores bloqueadas; a factory de migração percorreu a jornada
  feliz até `ENABLED` por commands confirmados.
- Critério objetivo: estado sujo/divergente não alcança `READY_TO_ENABLE` ou
  `ENABLED`; caminho feliz só promove após auditoria independente.
- Resultado: `CLOSED`.

### 5.9 PCA-MAJOR-008 — controles operacionais

- Requisito original: pausa/retomada, retry, cancelamento, prioridade, rodada,
  reconciliação, publicação e evidências devem ter controles operáveis conforme
  estado.
- Fonte normativa: ADR-0014 e contratos derivados de ADR-0002, ADR-0006,
  ADR-0008, ADR-0010 e ADR-0013.
- Evidência original: vários botões não tinham handlers.
- Correção declarada: commands tipados, guards e handlers para as affordances.
- Evidência atual: `ActionButton` consulta `canExecute`; telas chamam
  `onSubmit`; exportação, reconciliação, retry, rodada, prioridade, publicação,
  onboarding, conflito e cancelamento estão ligados ao domínio.
- Teste associado: montagem real de `App`, guards, dispatch, intervenção e
  publicação, além dos testes de domínio por comando.
- Comportamento observado: botões inválidos ficaram desabilitados com razão
  contextual; ações válidas produziram toast/journal e transição confirmada.
- Critério objetivo: todo controle normativo tem handler, guard, resultado e
  mensagem observável, sem comando incompatível habilitado.
- Resultado: `CLOSED`.

### 5.10 PCA-MINOR-001 — acessibilidade localizada

- Requisito original: controles icon-only nomeados, foco visível, estados
  dinâmicos anunciáveis e contraste suficiente.
- Fonte normativa: ADR-0014 e critérios de validação visual do plano.
- Evidência original: nomes ausentes em alguns icon buttons e validação visual
  indisponível.
- Correção declarada: `aria-label` estável, `role=status/log`, `aria-live`,
  tokens de contraste e foco.
- Evidência atual: navegação e icon buttons têm nomes acessíveis; o histórico
  usa `role=log`; toast usa `role=status`/`aria-live`; CSS fornece
  `:focus-visible`; as cores medidas superam 4,5:1 contra seus fundos.
- Teste associado: variante B com nomes acessíveis e montagem DOM com ARIA.
- Comportamento observado: os dez itens de navegação da variante B foram
  encontrados por nome acessível; contraste computado observado: muted 6,29:1,
  neutral 6,14:1, green 6,09:1, blue 6,28:1, purple 7,36:1, amber 6,39:1 e
  red 7,02:1.
- Critério objetivo: controles nomeados, foco/ordem e anúncio confirmados nas
  três variantes com contraste mínimo.
- Resultado: `CLOSED` para semântica, nomes, foco declarado e contraste; ordem
  completa de tabulação e tecnologia assistiva real permanecem limitações.

## 6. Evidência do domínio e autoridade do frontend

`prototype/src/mockDomain.ts` é o domínio mockado central e é consumido por
`App.tsx`. Há comandos tipados, validação, rejeições, transições explícitas,
eventos, journal em memória, histórico, factories determinísticas,
reinicialização por cenário e projeções derivadas. Não foram encontradas
mutações paralelas de estado funcional nos componentes além da navegação, do
toast e da seleção visual.

A separação observada é:

`ação → requestCommand → command.accepted/rejected → applyEffect → evento e
projeção confirmada`.

Os efeitos continuam simulados, como autorizado. Não foram encontrados
`fetch`, `axios`, `WebSocket`, `EventSource`, Git/`gh`, Codex CLI, banco, SMTP ou
outras integrações externas executáveis no protótipo.

## 7. Avaliação dos testes

### 7.1 Execução

- No worktree auditado, `npm test`, `npm run lint` e `npm run build` falharam
  ambientalmente porque não há `prototype/node_modules/.bin`; `tsx` e `tsc`
  não foram encontrados.
- No checkout local que já hospedava o servidor, os arquivos de implementação
  tinham hashes idênticos e os mesmos scripts/dependências. Ali, sem instalar
  ou atualizar nada, `npm test` executou **43/43**, sem falhas, skips ou todo.
- Nesse checkout equivalente, `npm run lint` passou e `npm run build` passou,
  gerando o bundle Vite.

### 7.2 Qualidade

Os testes são predominantemente comportamentais, determinísticos e incluem
caminhos positivos e negativos: guards, rejeições, ciclo de comandos,
capacidade UNKNOWN, reuso de assignment, retry, limite de rodadas, conflito,
drift, PR, divergência, recovery, onboarding e mutação de ADR. Usam asserts
semânticos, não somente snapshots.

Ainda assim, a suíte contém 43 testes, não 48 como declara o relatório de
remediação (`docs/prototype-conformance-remediation-2026-08-31.md:224`). A
suíte também não detecta a conclusão prematura das atividades aguardando
capacidade, nem a retenção de leases após publicação. Portanto, passar não é
prova suficiente de conformidade.

## 8. Cobertura dos 12 cenários

| Cenário | Estado inicial e jornada observada | Resultado |
|---|---|---|
| normal | `READY/IDLE`, snapshot DRAFT; validação, start, avanço e publicação direta disponíveis conforme guards. | `PARTIAL`: caminho conclui, mas mascara quatro atividades em espera; ver `PCA-MAJOR-022`. |
| audit | Findings abertos, remediação habilitada e reauditoria inicialmente bloqueada; remediação/reauditoria criam activities e assignments distintos. | `CONFORMANT` no domínio. |
| capacity | `UNKNOWN`, sem lease e atividade em `WAITING_CAPACITY`; despacho bloqueado. `RELEASE_CAPACITY` muda para KNOWN e dispatch usa lease. | `CONFORMANT` para UNKNOWN; lifecycle normal de leases é parcial. |
| retry | Uma atividade `FAILED` na tentativa 3/10; retry cria sessão/assignment novo e preserva chave idempotente. | `CONFORMANT`. |
| rounds | Atividade pausada em rodada 10/10; autorização libera rodada 11; segunda extensão é rejeitada. | `CONFORMANT`. |
| conflict | Onda conflitante; integrar bloqueado; resolver e auditar precedem integração e recálculo. | `CONFORMANT`. |
| divergence | Classificação incompatível é rejeitada; sequência `PENDING → AWAITING_DECISION → AWAITING_EFFECT → RESOLVED` exige decisão e efeito. | `CONFORMANT`. |
| recovery | Checkpoint seguro pendente; recovery reconstrói projeção, reproduz eventos e retoma. | `CONFORMANT` no domínio mockado. |
| drift | Base/tree atuais divergem; aprovação fica invalidada; revalidação atualiza candidato e exige nova aprovação. | `CONFORMANT`. |
| PR | `PR_OPEN`, aprovação, `AWAITING_PR_MERGE`, `PR_MERGED` e confirmação remota separados; merge stale é rejeitado. | `CONFORMANT`. |
| migration | Começa `DISCOVERED`, dirty/diverged; bootstrap é independente de ENABLED e promoção só ocorre após auditoria. | `CONFORMANT`. |
| ADR mutation | ADR-0007 simulada como implementada com hash divergente; 13 elegíveis; validação bloqueada até restauração, mantendo ADR implementada inelegível. | `CONFORMANT`. |

Todas as factories podem ser recriadas sem compartilhar o estado em memória.
No navegador, as 12 opções carregaram rota React e descrição específica; a
execução manual completa ficou limitada pela duração e pelo escopo do
navegador.

## 9. Validação no navegador

O navegador in-app funcional estava disponível e foi usado em segundo plano.

Verificações realizadas:

- 30 combinações de view/variante (`10 × 3`) foram abertas e renderizaram
  `main`, título e banner do protótipo, sem erros de console.
- A rota Nova execução mostrou 14 hashes completos, snapshot DRAFT e start
  bloqueado antes da validação.
- O fluxo normal foi iniciado e levado até `REMOTE_PUBLICATION_CONFIRMED`; o
  navegador exibiu a distinção entre `LOCAL_INTEGRATION_PENDING`, integração
  local, push e confirmação remota.
- A rota PR mostrou confirmação remota bloqueada antes de `PR_MERGED`.
- A variante B expôs nomes acessíveis para os dez itens de navegação.
- O DOM computado confirmou contraste dos tokens informados na seção 5.10.
- Console: somente mensagens normais do Vite/React DevTools; nenhum erro.

Limitações: não foi feita avaliação manual com leitor de tela, tecnologia
assistiva real, ordem completa de tabulação, responsividade desktop/mobile ou
teste de reconexão/restart real. As screenshots disponíveis mostraram viewport
estreito com overflow horizontal; não classifico isso como finding adicional
sem um requisito de breakpoint definido, mas também não alego responsividade
conforme.

## 10. Novos findings e regressões

### PCA-MAJOR-022 — avanço normal conclui trabalho sem capacidade/lease

- Severidade: `MAJOR`.
- Requisitos: ADR-0002 e ADR-0005 exigem transições operacionais coerentes,
  espera por capacidade e nenhum despacho sem lease; ADR-0014 proíbe a UI de
  aparentar efeitos não confirmados.
- Evidência no código: `prototype/src/mockDomain.ts:205` inicializa capacidade
  com `used=4`, `available=1`; `dispatchAvailableActivities` despacha somente
  uma atividade e marca quatro como `WAITING_CAPACITY`; porém
  `applyEffect` de `ADVANCE_NORMAL` em `prototype/src/mockDomain.ts:317`
  converte toda atividade não concluída em `COMPLETED`. `PUSH_REMOTE` em
  `prototype/src/mockDomain.ts:341` mantém as cinco leases ocupadas.
- Evidência executável: probe independente produziu:

  ```text
  após START_RUN: used=5 available=0 leases=5 RUNNING=1 WAITING_CAPACITY=4
  após três ADVANCE_NORMAL: COMPLETED=5
  após PUSH_REMOTE: used=5 available=0 leases=5
  ```

- Testes relacionados: jornada normal, scheduler inicial e invariantes de
  capacidade; nenhum assert exige lease/efeito para cada atividade concluída
  ou liberação ao término.
- Comportamento esperado: atividades em espera permanecem em espera até
  capacidade e lease; publicação/conclusão exigem todo o trabalho aplicável
  realmente processado; término libera leases e atualiza filas.
- Impacto: falso sucesso operacional, publicação de trabalho não executado,
  vazamento de capacidade e possível bloqueio permanente de retomadas.
- Systemic pattern: `YES`, porque afeta avanço normal e conclusão de publicação.
- Resultado: `OPEN`.
- Correção mínima: impedir avanço/publish enquanto houver atividades pendentes;
  modelar conclusão de cada atividade por efeito confirmado e liberar leases,
  filas e contadores em término/reconciliação, com asserts negativos.

### PCA-MINOR-006 — evidência declarada de contagem de testes está desatualizada

- Severidade: `MINOR`.
- Evidência: o relatório de remediação declara `48/48` em
  `docs/prototype-conformance-remediation-2026-08-31.md:224`, mas `rg` nos
  arquivos atuais encontrou 43 testes e `npm test` no checkout equivalente
  reportou `1..43`, `43 pass`.
- Impacto: reduz a confiabilidade da trilha de evidência e dificulta saber se
  testes foram removidos ou se o relatório não foi atualizado.
- Resultado: `OPEN`.
- Correção mínima: reconciliar a contagem declarada com a suíte real e registrar
  quais testes foram executados no mesmo estado auditado.

## 11. Comandos e verificações executados

No worktree auditado:

- `Get-Content -Raw` do pedido, ADRs, relatórios e planejamento;
- `git branch --show-current`, `git rev-parse HEAD`, `git status --short`;
- `Get-FileHash`/SHA-256 das 14 ADRs;
- `npm test` — falha ambiental: `tsx` não reconhecido;
- `npm run lint` — falha ambiental: `tsc` não reconhecido;
- `npm run build` — falha ambiental: `tsc` não reconhecido;
- probe HTTP `http://localhost:4173/` — HTTP 200;
- inspeção estática de integrações externas e rotas.

No checkout equivalente já equipado com as dependências, sem instalar ou
atualizar pacotes:

- `npm test` — 43/43 PASS;
- `npm run lint` — PASS;
- `npm run build` — PASS;
- probes TypeScript independentes de capacidade, start, publicação e invariantes.

No navegador:

- documentação da skill e conexão ao navegador in-app;
- 30 rotas/variantes renderizadas;
- 12 cenários carregados;
- jornadas representativas normal, PR, drift, divergência, capacity,
  migration e ADR mutation;
- DOM, ARIA, console, nomes acessíveis e contraste computado;
- screenshots de overview e publicação PR.

## 12. Hashes SHA-256 das 14 ADRs

Os valores abaixo são os hashes normalizados para LF registrados no baseline
aprovado; os valores atuais coincidem com eles. A normalização é necessária
porque os arquivos locais usam CRLF, enquanto o registro aprovado usa o
conteúdo normalizado.

| ADR | SHA-256 |
|---|---|
| ADR-0001 | `33705082b9d2f46e638cd93bdf27ca676cfc6181a2684ad583e4501f5d06d50d` |
| ADR-0002 | `ef9289c6fca4bba73fca53ca38c71dd19110eb1cfe948358a7cca1fe14e177d9` |
| ADR-0003 | `6325234bb9c927a6d2b38886206119c643a05718f6db8cce8df5625653260073` |
| ADR-0004 | `5b2454da004f5ca0f7c0b6dd36c35aeeae642dbc139b5c11e1295e0db62a1e4c` |
| ADR-0005 | `c1a9aaef50599f06afb979edbe8ac1084bde3eada4b2d1bbf87c3d5be886917d` |
| ADR-0006 | `ab39573f39849d9d9016683096126a63b037d763f09b4f00293500fd8fbcc6b2` |
| ADR-0007 | `ee4d22de0ff3e71f325bbf4f702c5c20221303db141f1d873c4e9cc438d38428` |
| ADR-0008 | `f887895fac13c0236b2f34cc5db9c3e43ef97bcd8e3e8b537db2fc8fa0f94947` |
| ADR-0009 | `4ab502aea4f09afe2c5fa33bfb6c5ee0d11e2d8f9af65f244209ce1fac935761` |
| ADR-0010 | `874b77ac7f1f19fe0b22a95705721905ae861feecd1e043a956c5c1bbfdac186` |
| ADR-0011 | `f17a2f90f8c7d8058bb927786dadfeabbe112e5fd898fc50115d37c9d02b3971` |
| ADR-0012 | `f73cf9dd962be0a0a45b0f69aa6e22bd3f5c0ac713fa9cae23fa8d285e4a4d88` |
| ADR-0013 | `377b712c1544d07e3c4e1990b84c124afceec984e54ef8c1ba6fadba14a5f218` |
| ADR-0014 | `3ac6d6c75e05bd65b2d90cc754ffdc4885f36cd98eb7a87c6bfb8395f044c642` |

Conclusão: as 14 ADRs não foram modificadas e permanecem iguais ao baseline
aprovado. Não há hash autorreferente inserido nelas.

## 13. Arquivos modificados durante a auditoria

Somente este arquivo foi atualizado, conforme autorização:

- `docs/prototype-conformance-reaudit-2026-08-31.md`.

Nenhum arquivo em `prototype/`, nenhuma dependência, configuração, ADR,
relatório original, relatório de remediação, plano, rastreabilidade ou
cobertura foi modificado durante esta reauditoria. Os artefatos não rastreados
preexistentes foram preservados.

## 14. Recomendação da próxima etapa

Não aprovar o protótipo neste baseline. Corrigir `PCA-MAJOR-022` e reabrir a
validação de `PCA-MAJOR-002`/`PCA-MAJOR-006`: o pipeline deve bloquear publicação
com atividades pendentes, concluir atividades somente após dispatch/efeito
confirmado e liberar leases/filas ao término ou reconciliação. Reconciliar a
contagem de testes no relatório de remediação e adicionar asserts que falhem
quando uma atividade `WAITING_CAPACITY` for concluída ou uma lease permanecer
ocupada após publicação.

Depois, executar novamente `npm test`, lint, build e a reauditoria independente
dos dez findings e dos novos findings, mantendo a autoridade das ADRs separada
da evidência operacional.

Confirmação final: nenhum arquivo do protótipo ou da autoridade foi modificado;
 somente este relatório autorizado foi atualizado.
