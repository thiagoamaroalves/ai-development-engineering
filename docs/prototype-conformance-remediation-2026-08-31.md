# Relatório de remediação do protótipo — 2026-08-31

## 1. Veredito

`PROTOTYPE_REMEDIATION_COMPLETE`

Todos os findings alvo da reauditoria — `PCA-MAJOR-002`, `PCA-MAJOR-006`,
`PCA-MAJOR-021`, `PCA-MAJOR-022`, `PCA-MINOR-004`, `PCA-MINOR-005` e
`PCA-MINOR-006` — foram remediados com evidência executável. Os findings
previamente `CLOSED`, além de `PCA-MINOR-003`, foram preservados e verificados
sem regressão. Este relatório encerra a remediação solicitada; não realiza nem
antecipa uma nova reauditoria independente.

## 2. Baseline e HEAD

- Branch: `main`.
- HEAD usado: `4ae336c7f6a1dae468a23e1e9cbfe1fb95b63386`.
- O protótipo e os documentos estavam não rastreados no baseline; portanto,
  não há diff Git histórico confiável para atribuir mudanças incrementais.
- A reauditoria `docs/prototype-conformance-reaudit-2026-08-31.md` foi lida
  integralmente e não foi alterada.
- ADR-0001 a ADR-0014 não foram alteradas. Seus hashes continuam iguais aos
  hashes aprovados no portfólio.

## 3. Arquivos alterados nesta rodada

- `prototype/src/mockDomain.ts`
- `prototype/src/App.tsx`
- `prototype/src/styles.css`
- `prototype/tests/mockDomain.test.ts`
- `prototype/tests/ui.test.ts`
- `docs/prototype-conformance-remediation-2026-08-31.md`

As dependências de teste já existentes em `prototype/package.json` e
`prototype/package-lock.json` não foram alteradas nesta rodada. `prototype/dist`
e `prototype/node_modules` permanecem ignorados. Nenhum ADR, relatório de
auditoria, plano, rastreabilidade ou cobertura foi editado.

## 4. Findings tratados individualmente

### PCA-MAJOR-002 — consistência funcional/operacional

- Classificação: `REMEDIATED`.
- Causa raiz: a factory compartilhada criava atividades `RUNNING` com
  execução `READY/IDLE` e um candidato de publicação antes de a execução e a
  conformidade chegarem à etapa de publicação; cancelamento também não cobria
  espera de capacidade, falha e recovery.
- Remediação: as factories agora começam sem atividade operacional ativa
  quando a execução está `READY/IDLE`; cenários ativos usam combinações
  coerentes. Foi introduzido `NOT_READY` para publicação pré-gate. O candidato
  só é criado ao entrar em Publicação depois que o trabalho termina. A
  agregação operacional é sincronizada a partir de atividades/recovery e
  cancelamento cooperativo é aceito em `WAITING_CAPACITY`, `FAILED` e
  `RECOVERING`, preservando estados funcionais de tickets.
- Evidência: `assertCoherentState`, teste de todas as factories, teste de
  cancelamento nos três estados e jornada normal completa.

### PCA-MAJOR-003 — demonstrabilidade das 12 famílias

- Classificação: `REMEDIATED`.
- Causa raiz: a mesma fixture incoerente contaminava normal, audit, conflict,
  drift, PR e migration; a divergência também encerrava sem decisão ou efeito.
- Remediação: uma regra de coerência comum foi aplicada à factory, sem hacks
  por cenário. A jornada de cada família foi explicitamente exercitada com
  caminho válido, rejeição, eventos, estado final e recriação determinística.
  A UI mostra o gate de publicação e a intervenção semântica pendente.
- Evidência: testes `todas as doze factories...` e `as doze famílias executam
  jornadas determinísticas completas...`, além do reset por reconstrução de
  cada factory.

### PCA-MAJOR-018 — reuse de assignment

- Classificação: `REMEDIATED` para ambos.
- Causa raiz: findings distintos apontavam para os mesmos assignments e a
  confirmação da remediação/reauditoria não criava atividade nem atualizava o
  histórico consultado por `agentIsEligible`.
- Remediação: os findings da fixture usam assignments e sessões distintos.
  Cada remediação e cada reauditoria confirmada cria uma nova atividade com
  `AgentAssignmentId`, sessão, papel e ciclo próprios; em seguida registra a
  participação e torna o assignment inelegível. O dispatch respeita o
  assignment solicitado/fila justa, lease nova e histórico atualizado.
- Evidência: testes de dois findings, IDs/sessões distintos, histórico
  persistido, rejeição de assignment já participante e teste de lease
  duplicada. O reuso de remediador e reauditor é rejeitado após a primeira
  participação.

### PCA-MAJOR-006 — ciclo de vida de lease e capacidade

- Classificação: `REMEDIATED`.
- Causa raiz: a conclusão era implícita no `ADVANCE_NORMAL` e nos efeitos
  terminais de publicação; atividades `WAITING_CAPACITY` podiam ser marcadas
  como `COMPLETED` sem dispatch/efeito confirmado, sem liberar lease nem
  despachar o próximo trabalho.
- Remediação: foi introduzido o comando `COMPLETE_ACTIVITY`, aceito somente
  para atividade `RUNNING` com lease correspondente. O efeito grava
  `activity.completed`, libera o lease e os counters atomicamente e chama a
  mesma primitiva `dispatchAvailableActivities` para redispatch justo. Resume,
  recovery e autorização de rodada também não fabricam `RUNNING` sem lease.
  Cancelamento e terminal remoto reconciliam todos os leases restantes.
- Evidência: teste negativo de conclusão em espera; teste de liberação,
  evento `lease.released` e redispatch da próxima atividade; invariantes
  `used + available = maximum`, leases únicas e lease para todo trabalho
  operacional ativo; probe terminal com `used=0`, `available=5`, `leases=0`.

### PCA-MAJOR-022 — conclusão fabricada e publicação prematura

- Classificação: `REMEDIATED`.
- Causa raiz: `ADVANCE_NORMAL` promovia diretamente toda atividade não
  concluída para `COMPLETED`, permitindo criar o candidato de publicação sem
  execução real e deixando leases órfãos.
- Remediação: o avanço normal agora exige todas as atividades em
  `COMPLETED`; ele apenas muda a etapa e cria o candidato depois do trabalho
  concluído. `APPROVE_PUBLICATION`, integração, push, merge e confirmação
  remota repetem o gate de atividades concluídas e não alteram estados de
  atividade. A conclusão é explícita, com dispatch/lease/efeito confirmado.
- Evidência: no fluxo normal, `ADVANCE_NORMAL` é rejeitado enquanto há
  `RUNNING`/`WAITING_CAPACITY`; cinco conclusões explícitas levam a
  `COMPLETED=5` antes da publicação; a jornada terminal preserva essas cinco
  conclusões e limpa os leases.

### PCA-MINOR-006 — contagem de testes do relatório

- Classificação: `REMEDIATED`.
- Causa raiz: o relatório anterior preservava a contagem de uma execução
  anterior e informava `48/48` após a suíte ter recebido novos testes.
- Remediação: a contagem foi reconciliada com a execução atual da suíte, sem
  arredondamento nem inferência a partir de arquivos.
- Evidência: `npm test` atual produziu exatamente **51/51**, 0 falhas, 0
  skips.

### PCA-MAJOR-019 — divergência semântica

- Classificação: `REMEDIATED`.
- Causa raiz: `RECONCILE_DIVERGENCE` tratava a classificação
  `SEMANTIC_DIVERGENCE` como resolução e removia a intervenção sem escolher
  autoridade ou aplicar correção.
- Remediação: o domínio separa `PENDING`, `AWAITING_DECISION`,
  `AWAITING_EFFECT` e `RESOLVED`, com campos para classificação, decisão e
  efeito corretivo. Foram adicionados comandos explícitos para decidir a fonte
  autoritativa e aplicar a reconciliação correspondente. A UI mantém a
  intervenção visível entre classificação e efeito.
- Evidência: classificação incompatível é rejeitada; classificação semântica
  permanece pendente; efeito sem decisão é rejeitado; Git ou banco pode ser
  escolhido e o efeito compatível leva a `RESOLVED`; eventos de classificação,
  decisão, efeito e confirmação são preservados. O teste DOM percorre a mesma
  sequência.

### PCA-MAJOR-020 — segregação de onboarding

- Classificação: `REMEDIATED`.
- Causa raiz: `Onboarding` guardava apenas o estado agregado e um ator textual;
  não havia atividades, ciclo, assignments, sessões, papéis ou histórico para
  provar a segregação.
- Remediação: onboarding agora modela atividades identificáveis de bootstrap,
  migração, remediação e auditoria, todas com assignment, identidade lógica,
  sessão, papel, `ArtifactCycleId` e registro de participação. Os guards
  exigem assignments elegíveis e independentes. Bootstrap continua permitido
  antes de `ENABLED`, e promoção continua condicionada ao veredito formal da
  auditoria.
- Evidência: jornada completa de migração com quatro atividades concluídas e
  histórico; teste positivo de papéis/ciclos distintos; teste negativo que
  tenta reutilizar o assignment de migração para auditoria.

### PCA-MINOR-003 — evidência da UI

- Classificação: `REMEDIATED`.
- Causa raiz: havia chamada de `canExecute` com argumento extra ignorado e
  nenhuma montagem da aplicação React.
- Remediação: a chamada foi corrigida para passar o activity ID na posição
  correta; o scheduler e o handler agora usam explicitamente a atividade
  solicitada ou a fila justa. Foram adicionadas dependências de teste
  `tsx`/`jsdom` e um teste que monta o `App` real e exercita guards, ação
  habilitada/desabilitada, razão do guard, dispatch, estados
  `requested`/`accepted`/`confirmed`, reset de cenário, ARIA, visibilidade de
  publicação e intervenção semântica.
- Evidência: `npm test` executa 51 testes, incluindo o teste DOM montado; o
  teste verifica `aria-label`, `role=status`, publicação PR sem integração
  local, confirmação remota inicialmente bloqueada e intervenção persistente.

### PCA-MAJOR-021 — início respeita scheduler, capacidade e leases

- Classificação: `REMEDIATED`.
- Causa raiz: `START_RUN` promovia cada atividade READY diretamente para
  `RUNNING`, sem consultar capacidade, fila justa, elegibilidade ou leases;
  retry também promovia a nova tentativa sem reservar capacidade.
- Remediação: `dispatchAvailableActivities` é agora a primitiva reutilizável
  chamada por `START_RUN`, `DISPATCH_ACTIVITY` e `RETRY_ACTIVITY`. Ela seleciona
  a fila justa, conserva o ID solicitado quando aplicável, só adquire lease com
  capacidade KNOWN e slot disponível, registra participação antes do spawn,
  atualiza `used`/`available`/`leases` atomicamente e move o restante para
  `WAITING_CAPACITY` ou `WAITING_ELIGIBILITY`. A seleção explícita não aceita
  atividades terminais.
- Invariantes verificadas: capacidade conhecida mantém
  `used + available = maximum`, leases são únicas e sua contagem coincide com
  `used`, toda
  atividade `RUNNING`, `PAUSE_REQUESTED` ou `RETRYING` possui lease, capacidade
  UNKNOWN não cria atividade RUNNING, e a ordem da fila justa permanece
  determinística. `assertCapacityCoherent` é chamado por
  `assertCoherentState`.
- Evidência: no cenário normal, antes do start: total 5, used 4, available 1,
  leases 4, READY 5, RUNNING 0, waiting 0; depois: total 5, used 5,
  available 0, leases 5, READY 0, RUNNING 1, waiting 4. `ACT-8F12` foi a
  única atividade despachada e recebeu `ASN-031`. O teste de capacidade UNKNOWN
  confirma que o start deixa todas as cinco atividades em espera e nenhuma em
  RUNNING. Retry continua criando nova sessão/assignment, preservando a chave
  idempotente, agora com lease coerente.

### PCA-MINOR-004 — nomes acessíveis na variante B

- Classificação: `REMEDIATED`.
- Causa raiz: a variante B ocultava visualmente `.nav__label` e os botões não
  tinham nome acessível independente do texto visual.
- Remediação: cada botão da navegação, inclusive Configurações, recebe
  `aria-label` estável derivado do label canônico; a apresentação visual das
  variantes não foi alterada.
- Evidência: teste React/jsdom monta `variant=B` e consulta os itens pelos
  nomes semânticos `Visão geral`, `Execuções` e `Artefatos e auditoria`. O
  snapshot do navegador confirmou os dez botões nomeados na navegação.

### PCA-MINOR-005 — contraste de texto e status

- Classificação: `REMEDIATED`.
- Causa raiz: tokens de texto/status claros demais e uma regra ampla de
  `.approval-banner span` sobrescrevendo o token de status verde.
- Remediação: tokens sistêmicos `--muted`, `--green`, `--blue`, `--purple`,
  `--amber`, `--red` e o status neutro foram escurecidos preservando matiz e
  fundos; a regra do banner foi restringida ao span textual correto.
- Evidência: medição computada no navegador produziu muted em branco 6,29:1,
  neutral 6,14:1, green 6,09:1, blue 6,28:1, purple 7,36:1, amber 6,39:1 e
  red 7,02:1. Todos superam 4,5:1 para texto pequeno e a diferenciação por
  estado continua usando texto, ícone/dot e classe sem depender apenas de cor.

## 5. Findings previamente fechados e regressão

Os seguintes foram classificados como `NOT_APPLICABLE_AFTER_ROOT_CAUSE_ANALYSIS`:
eles não exigiam nova correção, mas foram verificados durante esta rodada:

| Finding | Verificação de não regressão |
|---|---|
| `PCA-CRITICAL-001` | comandos continuam passando pelo domínio; efeito somente após confirmação e rejeição sem mutação |
| `PCA-MAJOR-001` | testes de hashes completos, conjunto ADR, lock, drift e ADR mutada continuam passando |
| `PCA-MAJOR-004` | push direto e PR mantêm comandos, estados, SHAs, merge e confirmação remota distintos |
| `PCA-MAJOR-005` | conflito, auditoria, integração, cancelamento funcional e recálculo do DAG continuam passando |
| `PCA-MAJOR-007` | bootstrap ocorre antes de `ENABLED`; promoção exige auditoria aprovada |
| `PCA-MAJOR-008` | controles permanecem ligados a handlers/guards reais; novas ações semânticas também usam o domínio |
| `PCA-MINOR-001` | nomes acessíveis, `aria-current`, `role=status`, `role=log`, `aria-live`, progresso e foco declarado permanecem no App/CSS |

## 6. Alterações sistêmicas

- Factory canônica agora impõe coerência entre execução, atividades,
  recovery e publicação.
- Participação é um efeito persistido no mesmo ponto em que a atividade se
  torna autoritativa; elegibilidade não depende de IDs decorativos.
- Reconciliation possui estados intermediários explícitos e trilha de
  evidência.
- Onboarding usa o mesmo vocabulário de identidade/segregação do domínio de
  execução, mantendo seu ciclo separado.
- A seleção de atividade para dispatch agora é determinística e testável.
- O scheduler/dispatch tornou-se uma única primitiva com invariantes de
  capacidade, lease, elegibilidade e fila justa compartilhada por start,
  dispatch explícito, retry e conclusão com liberação/redispatch.
- Conclusão e publicação agora têm gates explícitos: nenhuma atividade em
  espera é concluída por projeção, e nenhum terminal de publicação fabrica
  conclusão ou preserva leases órfãos.
- Tokens de cor de texto/status passaram a ter contraste mínimo verificável e
  nomes acessíveis não dependem da visibilidade do label.
- A superfície React foi coberta por integração DOM focada, sem snapshots
  grandes e frágeis.

## 7. Testes e evidências

- `npm test`: **51/51**, 0 falhas, 0 skips.
- Jornadas de domínio: **12/12** famílias executadas no teste determinístico,
  com caminhos válidos e rejeições mantidos nos testes específicos.
- `npm run lint`: **PASS** (`tsc --noEmit`).
- `npm run build`: **PASS** (`tsc -b && vite build`).
- ADRs: hashes SHA-256 das 14 ADRs coincidem com os valores aprovados.
- UI: montagem React real em jsdom, comandos, guards, eventos, reset,
  publicação PR, ARIA, nomes da variante B e intervenção semântica exercitados.
- Probe independente do fluxo normal: antes `{ total: 5, used: 4,
  available: 1, leases: 4, READY: 5, RUNNING: 0, WAITING_CAPACITY: 0,
  COMPLETED: 0 }`; depois do start `{ total: 5, used: 5, available: 0,
  leases: 5, READY: 0, RUNNING: 1, WAITING_CAPACITY: 4, COMPLETED: 0 }`;
  após cinco conclusões `{ total: 5, used: 4, available: 1, leases: 4,
  READY: 0, RUNNING: 0, WAITING_CAPACITY: 0, COMPLETED: 5 }`; no terminal
  `{ total: 5, used: 0, available: 5, leases: 0, READY: 0, RUNNING: 0,
  WAITING_CAPACITY: 0, COMPLETED: 5 }`.
- Probe das factories: **12/12** cenários criados e coerentes; jornadas
  determinísticas completas continuam cobertas pelo teste de domínio.
- Navegador local: variante B expôs os dez nomes de navegação; após confirmar
  o início, `ACT-8F12` apareceu `RUNNING`; após a ação UI `Concluir atividade`,
  `ACT-8F12` apareceu `COMPLETED` e `ACT-8F21` apareceu `RUNNING`, provando o
  dispatch seguinte. O contraste computado permanece validado conforme a
  seção 4.

## 8. Limitações restantes

Foi validado o DOM e o estilo computado no navegador local disponível. Não foi
feita uma avaliação manual de responsividade, ordem completa de tabulação ou
tecnologia assistiva real; a confirmação de acessibilidade desta rodada é
semântica/DOM. Integrações externas continuam mockadas, conforme o escopo.

Não foi executada reauditoria independente após a remediação, conforme o
limite explícito desta tarefa; este relatório registra apenas a remediação e
sua validação executável.

## 9. Comandos executados

- `Get-Content -Raw docs/prototype-conformance-reaudit-2026-08-31.md` e leitura
  das seções completas do re-audit.
- Leitura integral da autoridade citada: ADR-0002, ADR-0003, ADR-0004,
  ADR-0005, ADR-0006, ADR-0009, ADR-0010, ADR-0011, ADR-0014 e registro
  aprovado do portfólio, além da conferência dos 14 hashes.
- `npm test` — **51/51**.
- `npm run lint` — **PASS** (`tsc --noEmit`).
- `npm run build` — **PASS** (`tsc -b && vite build`).
- Probe independente do fluxo normal com contagem de capacidade, leases e
  estados READY/RUNNING/waiting.
- Probe explícito das 12 factories.
- Validação no navegador local da variante B, fluxo normal, estados de
  atividade e contraste computado.
- `git branch --show-current`, `git rev-parse HEAD` e `git status --short`.

## 10. Resultado final

`PROTOTYPE_REMEDIATION_COMPLETE`

O protótipo atende aos sete achados alvo desta remediação, com testes, lint,
build, 12 factories e probes de domínio/navegador aprovados. A remediação está
concluída; qualquer nova reauditoria é uma atividade posterior e independente.
