# Auditoria independente de conformidade do protótipo

## 1. Veredito formal

`PROTOTYPE_REMEDIATION_REQUIRED`

O protótipo é executável, está claramente identificado como simulação local e cobre visualmente a maior parte da superfície do produto. Porém, não representa de forma verificável vários contratos obrigatórios. Há uma violação crítica: o próprio frontend sintetiza aceitação, confirmação e efeito de comandos sem um modelo de autoridade/evento rejeitável. Também há findings major sobre máquinas de estado, publicação direta/PR, snapshot e elegibilidade de ADRs, DAG/ondas, agentes/capacidade, onboarding e controles operacionais.

Contagem: **1 CRITICAL, 8 MAJOR, 1 MINOR, 0 INFO**.

O veredito não decorre da ausência de backend real: essa ausência está dentro do escopo permitido. Decorre da ausência de simulações comportamentais suficientes e de representações que contradizem ou tornam não verificáveis as decisões aceitas.

## 2. Baseline e escopo auditados

- Repositório: `C:/Users/taalves/OneDrive - Octave/Documents 1/pessoal/ai-engineering-development`.
- Commit/base registrado: `4ae336c7f6a1dae468a23e1e9cbfe1fb95b63386` (`main`, `origin/main`).
- Estado inicial do worktree: já havia alterações não rastreadas em `docs/prototype-coverage-report.md`, `docs/prototype-plan.md`, `docs/prototype-traceability.md` e `prototype/`.
- `AGENTS.md`: não encontrado no repositório nem nos diretórios-pai pesquisados.
- Escopo de implementação: `prototype/src/App.tsx`, `prototype/src/main.tsx`, `prototype/src/styles.css`, `prototype/index.html`, configuração e documentação de execução do protótipo.
- O protótipo declara estado em memória e integrações simuladas em `prototype/README.md:36-38`.

O build gerou apenas artefatos locais já presentes/ignorados pelo worktree; não foram alterados código, dependências, configurações ou autoridade normativa.

## 3. Autoridade e precedência

A precedência aplicada foi:

1. ADR-0001 a ADR-0014 em `docs/adrs/`, cada uma com `schema_version: 1.0.0`, `revision: 3`, `decision_status: ACCEPTED` e `implementation_status: UNPROCESSED`.
2. Registro de aprovação final `docs/adrs/ADR-0001-0014-portfolio-remediation-ASC-MAJOR-002-2026-08-28.md`, com `result: ADR_PORTFOLIO_APPROVED`, aprovado em 2026-08-31.
3. Registro anterior `docs/adrs/ADR-0001-0014-portfolio-remediation-2026-08-28.md`, também com `result: ADR_PORTFOLIO_APPROVED`.
4. `docs/adrs/README.md`, que define as ADRs aceitas como decisões e distingue autoridade normativa de registro operacional.
5. `consolidacao-descoberta-orquestrador.md`, usado como origem histórica/conceitual, sem substituir as ADRs.
6. `docs/prototype-plan.md`, `docs/prototype-traceability.md`, `docs/prototype-coverage-report.md` e `prototype/README.md`, tratados como artefatos descritivos do protótipo, não como autoridade. Alegações desses arquivos foram confrontadas com o código e não aceitas por si só.

Os SHA-256 atuais das 14 ADRs foram comparados com a tabela do registro final de remediação do `ASC-MAJOR-002`: todos coincidem. Não há conflito documental de autoridade que bloqueie a auditoria.

## 4. Verificações executadas

| Verificação | Resultado | Evidência/observação |
|---|---|---|
| Baseline Git e worktree | PASS | `git rev-parse --show-toplevel`, `git rev-parse HEAD`, `git status --short`, `git diff --stat` |
| Instruções aplicáveis | PASS | Busca por `AGENTS.md` no repositório e diretórios-pai; nenhum encontrado |
| Integridade das 14 ADRs | PASS | IDs contínuos, front matter uniforme e hashes iguais ao baseline aprovado |
| `npm run lint` | PASS | `tsc --noEmit`, sem saída de erro |
| `npm run build` | PASS | `tsc -b && vite build`; Vite transformou 1818 módulos e produziu bundle |
| Scripts disponíveis | PASS/limitação | `npm run` confirma apenas `dev`, `build`, `lint`, `preview`; não existe script `test` |
| Testes | NÃO DISPONÍVEIS | `npm run test --if-present` não executou testes |
| Servidor local | PARCIAL | `npm run dev` não iniciou nova instância porque a porta 4173 já estava ocupada; o processo existente respondeu em `http://localhost:4173/` |
| Rotas/URLs HTTP | PASS limitado | Foram consultadas 10 views × 12 cenários = 120 URLs; todas retornaram HTTP 200 `text/html`. Isso testa apenas fallback/entrega do Vite, não renderização React |
| Navegador/interação visual | NÃO DEMONSTRÁVEL | A skill de navegador foi lida e seguida; não havia navegador conectado (`agent.browsers.list()` retornou `[]`) |
| Integrações externas | PASS estático | Busca no código não encontrou `fetch`, `axios`, `WebSocket`, `EventSource`, Git, `gh`, Codex, banco ou e-mail executáveis |

Não foram executados `npm install`, atualização de pacotes, alterações de configuração, comandos Git destrutivos ou integrações externas.

## 5. Matriz ADR/documento → requisito → tela/cenário → evidência → resultado

| Fonte | Requisito auditado | Tela/cenário | Evidência no código/comportamento | Resultado |
|---|---|---|---|---|
| ADR-0001 | Identidade persistente para execução, SPEC, revisão, artefato, ciclo, atividade e agente | Nova execução; Atividade | Há rótulos `ExecutionId`, `ArtifactCycleId` e `AgentAssignmentId` em `App.tsx:263,279`, mas os valores são constantes e não há registro persistente | `PARTIALLY_CONFORMANT` |
| ADR-0001 | Snapshot imutável, ADRs elegíveis somente `ACCEPTED`, conjunto fechado e hashes verificáveis | Nova execução | Lista fixa de 14 ADRs em `App.tsx:263`, hashes truncados artificiais `…sha`; `snapshotReady` é apenas booleano local | `NONCONFORMANT` |
| ADR-0001 | Imutabilidade de ADR implementada e bloqueio por mutação | `adr-mutation` | O cenário altera somente a mensagem global; não há conteúdo/hash de ADR, comparação ou bloqueio de processamento | `NOT_DEMONSTRABLE` |
| ADR-0002 | Pipeline ADR → SPEC → Gap Matrix → Plano → Tickets → Implementação → Conformidade → Publicação | Visão geral; detalhe da SPEC | `stageLabels` e trilhos visuais em `App.tsx:80,248,271`; não há transições baseadas em veredictos | `PARTIALLY_CONFORMANT` |
| ADR-0002 | Máquinas separadas, guards, rejeição de transições e estados terminais de tickets | SPEC; DAG | Tickets são constantes em `App.tsx:52-58`; não há comandos funcionais de ticket, cancelamento terminal, reabertura proibida ou guard real | `NONCONFORMANT` |
| ADR-0002 | Separação entre funcional, operacional, bloqueio, espera e falha | Visão geral; Atividade | Há texto explicativo e badges, mas `runState` só admite `RUNNING`, `PAUSED`, `COMPLETED` (`App.tsx:138`) e estados não têm agregado/efeito independente | `NONCONFORMANT` |
| ADR-0002 | Vocabulário de publicação normativo | Publicação | Alguns rótulos aparecem, mas `REMOTE_PUBLICATION_CONFIRMED` é mostrado com `done={false}` e o fluxo PR ainda mantém o cabeçalho `push direto` (`App.tsx:283`) | `NONCONFORMANT` |
| ADR-0003 | Envelope JSON/Schema, versões fixadas, veredictos e erros de contrato | Nova execução; Atividade | Mostra `schema 1.0.0`, skills e JSON ilustrativo (`App.tsx:263,279`), sem validação, erro de schema, compatibilidade ou resultado persistido | `PARTIALLY_CONFORMANT` |
| ADR-0003 | Manifesto imutável completo e checkpoints de retomada | Atividade | Painel contém poucos campos e checkpoint fixos; não há manifesto completo nem ação real de download/replay | `PARTIALLY_CONFORMANT` |
| ADR-0004 | Sessão nova, `AgentAssignmentId`, `ArtifactCycleId` e elegibilidade por ciclo | Atividade; `audit`, `rounds` | `AGT-044`, `AGT-039` e `AC-021-01` são dados estáticos; não há sessão nativa, papel, histórico de elegibilidade ou guard de reuso | `NONCONFORMANT` |
| ADR-0004 | Segregação implementador/auditor/remediador e espera se não houver agente elegível | Auditoria; intervenções | A segregação é alegada em texto (`App.tsx:271,281`), não demonstrada por assignments incompatíveis nem por ação bloqueada | `NOT_DEMONSTRABLE` |
| ADR-0005 | Capacidade dinâmica, `UNKNOWN`, teto conservador, lease persistida e filas por motivo | Visão geral; `capacity` | Dashboard fica sempre `KNOWN`, `04/05`, e o cenário apenas muda a mensagem (`App.tsx:31-44,241`); não existe provider, lease ou transição de fila | `NONCONFORMANT` |
| ADR-0005 | Paralelismo por DAG, prioridade justa e SPECs independentes | Execuções; DAG | Rótulos indicam paralelismo, mas filtros são botões sem handlers e não há scheduler ou mudança de prioridade | `PARTIALLY_CONFORMANT` |
| ADR-0006 | Journal/outbox, intenção antes do efeito, chave idempotente e reconciliação por evidência | Atividade; Artefatos | Feed e “command journal” são arrays em memória; nenhuma chave/evidência/reconciliação real é modelada | `NOT_DEMONSTRABLE` |
| ADR-0006 | Quatro resultados de reconciliação e recovery por checkpoint | `divergence`; `recovery` | Cenários mudam apenas `currentScenario.message`; não há ações, estados ou resultados `EXPECTED_INCOMPLETE_EFFECT`, `MISSING_EFFECT`, `SEMANTIC_DIVERGENCE`, `CONFLICTING_EFFECT` produzidos | `NOT_DEMONSTRABLE` |
| ADR-0006 | Até 10 tentativas, pausa cooperativa e retomada segura | `retry`; `rounds` | Valores estáticos aparecem em `activities`; não há retry action, checkpoint solicitado/confirmado ou contagem evolutiva | `NONCONFORMANT` |
| ADR-0007 | Branch/worktree por SPEC e ticket, commits sem mistura e hashes auditados | SPEC; DAG; Publicação | Há uma branch/worktree e hashes abreviados (`App.tsx:271,283`), mas não há ticket worktrees/commits correlacionados nem proteção verificável | `PARTIALLY_CONFORMANT` |
| ADR-0007 | Onda integra somente com todos aprovados e recálculo pós-integração | DAG; `conflict` | Mensagem diz que não integra, mas não há integração, aprovação por ticket, conflito efetivo ou recálculo; grafo é fixo (`App.tsx:276`) | `NONCONFORMANT` |
| ADR-0007 | Merge da principal na branch da SPEC sem rebase/force-push e proteção documental contra drift | SPEC; Publicação; `drift` | A interface exibe `base main` e `DocumentCandidateTreeHash`, porém não executa comparação antes do commit nem invalidação por mudança real | `PARTIALLY_CONFORMANT` |
| ADR-0008 | Aprovação humana antes de merge/push, fila serial e push controlado | Publicação | Botões de aprovação existem, mas `runCommand` auto-confirma e não há fila/merge/push simulado com guards | `NONCONFORMANT` |
| ADR-0008 | PR com base SHA, head SHA, checks, mergeability, árvore candidata e `PR_MERGED` | `pr` | O cenário exibe `PR_OPEN`/`AWAITING_PR_MERGE`, mas não há PR identificada no fluxo, ação de merge, checks evolutivos ou confirmação remota | `NONCONFORMANT` |
| ADR-0009 | Auditoria/remediação independente, rodada limite e retorno downstream | `audit`; `rounds` | Findings e rodadas são constantes; não há remediação, reauditoria, invalidação downstream ou limite aplicado | `NONCONFORMANT` |
| ADR-0009 | Conformidade final após tickets e contra commit candidato exato | Detalhe da SPEC; Publicação | `CONFORMANCE_APPROVED` e hashes são textos estáticos; não há pré-condição nem reauditoria contra base atual | `NONCONFORMANT` |
| ADR-0010 | Cadastro/validação de configuração versionada, clean tree e alinhamento Git/remoto | Repositórios | Cartões e botão de validar existem (`App.tsx:257`), mas não alteram dados nem validam entradas | `PARTIALLY_CONFORMANT` |
| ADR-0010 | Bootstrap legado antes de `ENABLED`, workspace isolado e promoção atômica após auditoria | Repositórios; `migration` | Lifecycle é desenhado, mas sempre marca etapas `0..4` como concluídas e `READY_TO_ENABLE` apesar de working tree `DIRTY` e `DIVERGED` | `NONCONFORMANT` |
| ADR-0011 | Frontend cliente sem autoridade, backend autônomo e eventos em tempo real | Todas; banner local | Banner informa simulação, mas o estado é mutado pelo componente e não há snapshots/eventos vindos de serviço | `NONCONFORMANT` |
| ADR-0012 | localhost/token efêmero e alertas de intervenção | Topbar; intervenções | Topbar apenas imprime `localhost:5128` e `token efêmero` (`App.tsx:224`); não há aquisição/renovação nem registro de intervenção real | `PARTIALLY_CONFORMANT` |
| ADR-0013 | Duração, consumo, retenção, backup, exportação e correlação | Visão geral; Artefatos | Métricas, ledger e botões são estáticos; exportação/download só enfileiram comando local (`App.tsx:286`) | `PARTIALLY_CONFORMANT` |
| ADR-0014 | Acompanhamento completo e intervenções operacionais | Todas | Hierarquia e várias telas existem, mas faltam cancelar, repetir falha, prioridade e controls efetivos | `NONCONFORMANT` |
| ADR-0014 | `requested → accepted/rejected → confirmed` por comando/evento, sem UI otimista | Atividade; intervenções | `runCommand` sempre agenda `accepted` e `confirmed`, invoca efeitos e registra `frontend-command` (`App.tsx:175-178`); `rejected` nunca ocorre | `NONCONFORMANT` |
| ADR-0014 | Publicação só concluída após `REMOTE_PUBLICATION_CONFIRMED` | Publicação | O status terminal é renderizado antes de estar concluído e nunca há confirmação remota produzida | `NONCONFORMANT` |
| Registro final de aprovação ADR | Portfólio normativo aprovado e imutável no baseline | Autoridade, não tela | Front matter/hashes das ADRs conferem com `ADR-PORTFOLIO-REMEDIATION-ASC-MAJOR-002-2026-08-28.md` | `CONFORMANT` |
| `docs/prototype-traceability.md` e `docs/prototype-coverage-report.md` | Alegações de cobertura do protótipo | Documentação auxiliar | Os documentos listam os 12 cenários como cobertos, mas a inspeção revela que vários só trocam mensagem; a alegação não é evidência suficiente | `NONCONFORMANT` |

## 6. Cobertura dos 12 cenários mockados

| Cenário | Estado inicial observado | Ações disponíveis | Resultado observado | Classificação |
|---|---|---|---|---|
| `normal` | Execução fixa `RUNNING`, pipeline visual até conformidade | Preparar snapshot; comandos genéricos | Não há caminho demonstrável até conclusão/publicação remota | `NOT_DEMONSTRABLE` |
| `audit` | Banner informa `AUDITING` rodada 03 | Navegar para SPEC/intervenções | Findings continuam fixos; nenhuma remediação/reauditoria é produzida | `NOT_DEMONSTRABLE` |
| `capacity` | Dashboard continua `KNOWN`, 04/05 | Navegar para atividade | Só a mensagem muda; não há `UNKNOWN`, lease recusada ou fila que evolua | `NONCONFORMANT` |
| `retry` | Atividade fixa `RETRYING`, tentativa 03/10 | Não há botão de repetir falha | Nenhum retry nem reconciliação de chave idempotente ocorre | `NONCONFORMANT` |
| `rounds` | Atividade fixa `PAUSED`, rodada 10/10 | “Autorizar rodada adicional” | Comando chega a `confirmed`, mas rodada/estado não mudam | `NONCONFORMANT` |
| `conflict` | DAG fixo com `INTEGRATION_PENDING` | Recalcular DAG; ver bloqueios | Não há conflito, agente de resolução, auditoria ou nova base | `NOT_DEMONSTRABLE` |
| `divergence` | Intervenção fixa `SEMANTIC_DIVERGENCE` | Reconciliar | Comando confirma genericamente; nenhum dos quatro resultados de reconciliação é produzido | `NOT_DEMONSTRABLE` |
| `recovery` | Banner informa retomada por checkpoint | Atualizar projeção | Não há reinício, replay, evidência ou checkpoint recuperado | `NOT_DEMONSTRABLE` |
| `drift` | Publicação renderiza `INVALIDATED` com duas SHAs | Revalidar; aprovar lote continua habilitado | A invalidação deriva apenas de `scenario === 'drift'`; não há mudança real nem reauditoria | `PARTIALLY_CONFORMANT` |
| `pr` | Fluxo mostra `PR mode`, `PR_OPEN`, `AWAITING_PR_MERGE` | Aprovar publicação | Cabeçalho permanece `push direto`; nunca chega a `PR_MERGED`/`REMOTE_PUBLICATION_CONFIRMED` | `NONCONFORMANT` |
| `migration` | Repositório `MIGRATING` | Validar/cadastrar genérico | Lifecycle continua com etapas previamente concluídas e não há promoção após auditoria | `NONCONFORMANT` |
| `adr-mutation` | Banner/intervenção informam hash divergente | Inspecionar evidência | Não há ADR/sha mutada para inspeção nem guard que bloqueie uma execução | `NOT_DEMONSTRABLE` |

Além disso, a seleção de cenário não cria um novo snapshot nem reinicializa o estado; comandos, aprovação e `snapshotReady` podem sobreviver à troca de cenário. Portanto, a sequência de interação não é determinística mesmo que o carregamento inicial seja estático.

## 7. Findings

### PCA-CRITICAL-001 — O frontend fabrica aceitação, confirmação e efeito de comandos

- Severidade: `CRITICAL`.
- Fonte normativa exata: ADR-0002 (“comandos validam pré-condições; transições inválidas são rejeitadas e registradas”), ADR-0011 (“o frontend será um cliente sem autoridade; comandos retornam aceitação/rejeição e correlação; eventos atualizam projeções”) e ADR-0014 (“a interface não altera a UI otimisticamente; mostra `requested`, `accepted/rejected` e o estado confirmado por eventos”).
- Requisito violado: toda mutação deve ser uma solicitação ao backend/contrato simulado, com aceitação ou rejeição verificável; somente o evento confirmado pode alterar a projeção.
- Evidência: `prototype/src/App.tsx:175-178` adiciona sempre `requested`, agenda sempre `accepted` após 650 ms, sempre `confirmed` após 1500 ms, executa `effect?.()`, muta `runState`/`approval` e cria transição com `actor: 'frontend-command'`. O tipo aceita `rejected` em `App.tsx:16`, mas nenhum caminho o produz. Os botões de pausa, aprovação, reconciliação, exportação e atualização usam essa mesma função.
- Impacto: a UI aparenta ser autoridade do workflow; não demonstra guards, rejeições, falha operacional, evento tardio ou confirmação do registro operacional. Uma validação baseada nesse fluxo pode aceitar transições impossíveis.
- Correção esperada: introduzir um stub de autoridade separado do componente, com comandos correlacionados e guardados, resultados `accepted`/`rejected`, eventos confirmados e efeitos somente após evento confirmado; preservar estado anterior enquanto `requested`/`accepted` estiverem pendentes.
- Critério objetivo de fechamento: testes demonstram pelo menos um comando válido (`requested → accepted → confirmed`) e um inválido (`requested → rejected`, sem alteração de estado), e nenhum callback de tela altera diretamente estado funcional/operacional sem a projeção de evento confirmado.
- Arquivos provavelmente envolvidos: `prototype/src/App.tsx`, `prototype/src/main.tsx`.

### PCA-MAJOR-001 — Snapshot e elegibilidade de ADRs são apenas dados fixos

- Severidade: `MAJOR`.
- Fonte normativa exata: ADR-0001, ADR-0003, ADR-0010 e ADR-0014; em especial, snapshot imutável com ADRs `ACCEPTED` elegíveis, hashes, commit-base, configuração e versões fixadas.
- Requisito violado: o protótipo deve demonstrar seleção/validação do conjunto elegível, fechamento do snapshot e rejeição de conteúdo/configuração/base inválidos.
- Evidência: `prototype/src/App.tsx:263` contém uma lista literal de 14 ADRs, sempre `ACCEPTED + UNPROCESSED`, `rev 3` e hash abreviado calculado do número (`0001…sha`); `snapshotReady` em `App.tsx:137` é apenas um booleano e o primeiro clique apenas o torna `true`. Não há leitura de ADR, hash real, seleção, revalidação, alteração de base ou estado de snapshot imutável.
- Impacto: não é possível provar que as ADRs exibidas são as elegíveis do repositório ou que o comando não incorpora ADR aceita depois do snapshot; o cenário de mutação não fecha essa lacuna.
- Correção esperada: modelar dados de entrada variados e um snapshot congelado com hashes completos, status/revisão, configuração, base e contratos; demonstrar aprovação, rejeição e invalidação por drift/mutação.
- Critério objetivo de fechamento: um teste de cenário com ADR inelegível/mutada ou base divergente impede o início; um snapshot confirmado mantém exatamente o conjunto/hash exibido mesmo após mudança da fonte; o caminho feliz exibe os hashes verificáveis.
- Arquivos provavelmente envolvidos: `prototype/src/App.tsx`, dados mockados e `prototype/README.md`.

### PCA-MAJOR-002 — Máquinas de estado e distinção funcional/operacional não são implementadas

- Severidade: `MAJOR`.
- Fonte normativa exata: ADR-0002, ADR-0005, ADR-0006, ADR-0009 e ADR-0014.
- Requisito violado: distinguir estado funcional, estado operacional, bloqueio, espera por dependência/capacidade, falha, intervenção, solicitação/aceitação/efeito; aplicar pré-condições, terminalidade, pausa/cancelamento cooperativos e proibição de reabertura.
- Evidência: `runState` admite somente `RUNNING | PAUSED | COMPLETED` (`App.tsx:138`), sem `PAUSE_REQUESTED`, `CANCEL_REQUESTED`, `CANCELLED`, `FAILED` ou waits. Não há controle de cancelar, repetir falha ou alterar prioridade. O botão de pausa em `App.tsx:271` alterna diretamente entre `RUNNING` e `PAUSED` depois do timer genérico. Tickets são apenas strings estáticas e não possuem transições/guards.
- Impacto: a interface não permite verificar pré-condições ou estados terminais e pode sugerir que pausa, retomada e cancelamento são efeitos imediatos; estados operacionais podem ser confundidos com estados funcionais.
- Correção esperada: criar modelos separados por agregado, tabela de transições e comandos com guards para execução/SPEC/atividade/ticket/onda/publicação; incluir estados solicitados e confirmados, terminalidade e efeitos preservados.
- Critério objetivo de fechamento: testes de cada transição permitida e proibida mostram origem, destino, pré-condição, mensagem, estado funcional preservado e efeito; cancelamento funcional só aparece após revisão auditada do DAG.
- Arquivos provavelmente envolvidos: `prototype/src/App.tsx`, dados de cenários.

### PCA-MAJOR-003 — Os cenários não demonstram os comportamentos que seus nomes alegam

- Severidade: `MAJOR`.
- Fonte normativa exata: ADR-0002, ADR-0004, ADR-0005, ADR-0006, ADR-0007, ADR-0008, ADR-0009 e ADR-0010; método obrigatório da auditoria para os 12 cenários.
- Requisito violado: cada cenário deve possuir estado inicial, ações válidas, transições, resultado final e mensagens coerentes; não basta existir no seletor.
- Evidência: `scenarios` em `App.tsx:31-44` contém rótulos/mensagens, mas `currentScenario` é usado majoritariamente para texto. Os cartões de intervenções, atividades, findings, tickets, DAG e artefatos permanecem fixos. A única variação substantiva é `drift` renderizar `INVALIDATED`, `pr` alterar dois rótulos e `migration` alterar um badge; não há sequência nem resultado final para normal, recovery, conflito, divergência, mutação, capacidade, retry ou rodadas.
- Impacto: a documentação auxiliar afirma cobertura dos 12 cenários, mas o usuário não consegue verificar os contratos operacionais críticos nem detectar regressões na jornada.
- Correção esperada: cada cenário deve possuir fixture de estado e sequência de ações/efeitos; a seleção deve carregar essa fixture, limpar/isolá-la e apresentar transições, rejeições, intervenção e resultado final determinísticos.
- Critério objetivo de fechamento: para cada um dos 12 cenários existe um roteiro executável com assertivas de estado inicial, ações disponíveis, eventos intermediários, resultado, mensagem e guards, incluindo pelo menos um caminho negativo quando normativo.
- Arquivos provavelmente envolvidos: `prototype/src/App.tsx`, dados de cenário e documentação auxiliar.

### PCA-MAJOR-004 — Fluxo de publicação mistura push direto e PR e expõe status terminal prematuramente

- Severidade: `MAJOR`.
- Fonte normativa exata: ADR-0002, ADR-0007, ADR-0008, ADR-0009 e ADR-0014.
- Requisito violado: push direto deve distinguir candidato, aprovação, integração local e confirmação remota; PR deve distinguir abertura, espera, merge e confirmação remota; `REMOTE_PUBLICATION_CONFIRMED` só conclui.
- Evidência: `Publication` em `App.tsx:283` sempre apresenta `SPEC-021 · push direto`. O cenário `pr` apenas muda `PR mode`, `PR_OPEN` e `AWAITING_PR_MERGE`; não há `PR_MERGED`, base/head/checks evolutivos nem confirmação remota. No fluxo direto, `REMOTE_PUBLICATION_CONFIRMED` é renderizado com `done={false}`. O botão “Aprovar lote” permanece acionável em `drift`, embora a aprovação esteja invalidada.
- Impacto: o operador pode interpretar um candidato não publicado como confirmação remota e não consegue validar a fila serial, a invalidade por mudança da base/árvore ou a diferença entre PR aberta e PR merged.
- Correção esperada: separar fixtures/estados dos dois protocolos, com guards de aprovação, fila exclusiva, base SHA/head SHA/tree hash/checks, invalidação e confirmação remota; desabilitar comandos incompatíveis com o estado confirmado.
- Critério objetivo de fechamento: no push direto a ordem observável é `PUBLICATION_CANDIDATE_READY → AWAITING_PUBLICATION_APPROVAL → LOCAL_INTEGRATION_COMPLETE → REMOTE_PUBLICATION_CONFIRMED`; no PR é `PR_OPEN → AWAITING_PR_MERGE → PR_MERGED → REMOTE_PUBLICATION_CONFIRMED`, e qualquer mudança de SHA/árvore invalida a autorização.
- Arquivos provavelmente envolvidos: `prototype/src/App.tsx`, dados de publicação e `prototype/src/styles.css`.

### PCA-MAJOR-005 — DAG, ondas e pré-condições são inconsistentes e não interativos

- Severidade: `MAJOR`.
- Fonte normativa exata: ADR-0002, ADR-0005, ADR-0007 e ADR-0009.
- Requisito violado: dependências e ondas devem ser coerentes; tickets `READY` podem executar em paralelo, tickets não aprovados impedem a integração, e cancelamento/conflito exigem revisão e auditoria.
- Evidência: `tickets` declara `TCK-105` como `Onda 02` em `App.tsx:52-58`, enquanto `Dag` o desenha em `Onda 01` em `App.tsx:276`. O inspector sempre marca “documentação aprovada” e “dependências concluídas”, inclusive ao selecionar ticket bloqueado. Os filtros `Todas as ondas`/`Somente bloqueados` e os conectores não têm lógica; “Recalcular DAG” só chama `runCommand`.
- Impacto: o DAG pode mostrar uma onda errada e pré-condições satisfeitas para ticket bloqueado; a visualização não prova que integração só ocorre com todos os aprovados.
- Correção esperada: manter uma única fixture normalizada de tickets/dependências/ondas e derivar grafo, inspector, filtros e ações dela; modelar integração, conflito, auditoria e recálculo com guards.
- Critério objetivo de fechamento: selecionar cada ticket mostra suas dependências reais; o grafo e a tabela concordam; integração é rejeitada enquanto qualquer ticket aplicável não estiver aprovado; o cenário de conflito mostra resolução exclusiva e auditoria posterior.
- Arquivos provavelmente envolvidos: `prototype/src/App.tsx`, dados mockados e estilos do DAG.

### PCA-MAJOR-006 — Segregação de agentes, ciclos e capacidade não são verificáveis

- Severidade: `MAJOR`.
- Fonte normativa exata: ADR-0003, ADR-0004 e ADR-0005.
- Requisito violado: cada atividade precisa de sessão/assignment novo, elegibilidade por `ArtifactCycleId`, segregação auditor/remediador e despacho somente com capacidade conhecida dentro do teto e lease.
- Evidência: as atividades em `App.tsx:60-65` usam `AGT-044`, `AGT-039`, `AGT-031`, `AGT-028` como se fossem `AgentAssignmentId`, sem sessão, processo, papel ou histórico. O manifesto contém um único ciclo fixo. O dashboard em `App.tsx:241` é sempre `KNOWN` e `04/05 leases`; `capacity` só altera o texto do cenário. Não há provider `UNKNOWN`, reserva/liberação de lease ou espera por agente inédito.
- Impacto: não se consegue provar não-reuso no mesmo ciclo, que remediador não audita sua alteração ou que o teto conservador é aplicado quando a capacidade é desconhecida.
- Correção esperada: fixtures de assignment com `AgentAssignmentId`, sessão, papel, ciclo, rodada e elegibilidade; capacidade conhecida/desconhecida, lease e filas separadas; comandos incompatíveis devem ser rejeitados.
- Critério objetivo de fechamento: o cenário de auditoria mostra assignments incompatíveis e bloqueia reuso; o cenário de capacidade `UNKNOWN` não despacha sem lease; o cenário de rodada/retorno preserva `ArtifactCycleId` e troca a identidade elegível.
- Arquivos provavelmente envolvidos: `prototype/src/App.tsx`, dados de atividades/capacidade.

### PCA-MAJOR-007 — Onboarding legado mostra `READY_TO_ENABLE` apesar de guards impeditivos

- Severidade: `MAJOR`.
- Fonte normativa exata: ADR-0003, ADR-0010 e ADR-0011.
- Requisito violado: repositório legado permanece não habilitado até migração, auditoria formal e promoção atômica da configuração candidata; working tree suja ou branch divergente não pode ser apresentada como pronta.
- Evidência: em `App.tsx:257`, `legacy-workflow-lab` tem `MIGRATING`, `DIRTY` e `DIVERGED`. O painel de onboarding renderiza `READY_TO_ENABLE` em qualquer cenário que não seja `migration`; o lifecycle marca os índices 0 a 4 como concluídos e `READY_TO_ENABLE` como atual, sem resultado de validação/migração/auditoria. Não existem ações de bootstrap, remediação ou habilitação.
- Impacto: o operador pode entender que o repositório está pronto para habilitação quando as pré-condições normativas estão explicitamente falhando.
- Correção esperada: derivar o lifecycle da fixture de onboarding e bloquear promoção enquanto dirty/diverged ou sem veredito; modelar workspace candidato, auditoria, remediação e promoção atômica.
- Critério objetivo de fechamento: com tree suja/divergente, `READY_TO_ENABLE` e `ENABLED` não são alcançáveis; o caminho feliz percorre `DISCOVERED → VALIDATING → MIGRATING → AUDITING → READY_TO_ENABLE → ENABLED` somente após veredito aprovado.
- Arquivos provavelmente envolvidos: `prototype/src/App.tsx`, fixtures de repositórios/onboarding.

### PCA-MAJOR-008 — Controles obrigatórios e ações relevantes não são operáveis

- Severidade: `MAJOR`.
- Fonte normativa exata: ADR-0014, com controles derivados de ADR-0002, ADR-0006, ADR-0008, ADR-0010 e ADR-0013.
- Requisito violado: a interface deve permitir, conforme estado, pausar/retomar, repetir falha, cancelar processamento não integrado, alterar prioridade, autorizar rodada, reconciliar divergência, aprovar publicação e inspecionar/exportar evidências.
- Evidência: não existe ação de cancelar, repetir falha ou alterar prioridade. Os botões “Configuração”, filtros, “Abrir diff completo”, “Baixar manifesto”, inspeções de atividade e `MoreHorizontal` não têm handlers em `App.tsx:212,240,257,279,283,286`. Não há confirmação específica para aprovação, exportação ou operações relevantes; o timer genérico confirma qualquer ação.
- Impacto: jornadas críticas ficam sem caminho de intervenção e affordances aparentes podem não fazer nada, impedindo a validação operacional e a prevenção de comandos inválidos.
- Correção esperada: implementar as affordances como comandos simulados com destino/estado, confirmação contextual e erro/rejeição; ligar filtros, evidências e inspeções a dados do cenário.
- Critério objetivo de fechamento: cada controle normativo tem handler testado, estado confirmado, mensagem de erro/rejeição quando inaplicável e confirmação explícita para aprovação, cancelamento, reconciliação e exclusão/exportação quando aplicável.
- Arquivos provavelmente envolvidos: `prototype/src/App.tsx`, `prototype/src/styles.css`.

### PCA-MINOR-001 — Deficiências localizadas de acessibilidade em controles visuais

- Severidade: `MINOR`.
- Fonte normativa exata: ADR-0014 (interface operacional compreensível e acessível; foco/semântica são parte do escopo solicitado).
- Requisito violado: controles icon-only precisam de nome acessível e estados dinâmicos relevantes devem ser anunciados de forma compreensível.
- Evidência: há regra positiva de `:focus-visible` em `prototype/src/styles.css:31` e `aria-label` na busca/notificações/variações, mas botões icon-only `MoreHorizontal` em `App.tsx:240,257` não têm `aria-label`; filtros e badges não possuem semântica de seleção/estado, e somente o toast usa `role="status"` (`App.tsx:202`). A inspeção visual/teclado completa ficou não demonstrável por ausência de navegador.
- Impacto: usuários de tecnologia assistiva podem não identificar controles de menu; mudanças de estado podem não ser anunciadas.
- Correção esperada: nomear controles icon-only, usar semântica de botão/seleção para filtros e regiões live apenas onde apropriado, e validar foco/contraste em execução real.
- Critério objetivo de fechamento: auditoria automatizada e manual confirma nome acessível para todo controle, ordem de tabulação, foco visível, anúncio de `requested/accepted/rejected/confirmed` e contraste mínimo nas três variantes.
- Arquivos provavelmente envolvidos: `prototype/src/App.tsx`, `prototype/src/styles.css`.

## 8. Navegação e experiência operacional

Aspectos positivos verificáveis:

- `header`, `nav`, `main` e `aside` dão uma hierarquia semântica básica.
- A navegação usa `aria-label` e `aria-current` (`App.tsx:211-212`); a URL preserva `view`, `variant` e `scenario`.
- Há foco visível para `button`, `select` e `input` (`styles.css:31`), uso de teclado para variantes e identificação persistente de “PROTÓTIPO · simulação local em memória”.
- Há telas dedicadas para execução, SPEC, DAG, atividade, intervenções, publicação e evidências; a intenção de rastreabilidade é clara.

Deficiências de conformidade, distintas de preferência estética:

- várias ações visíveis não têm comportamento;
- não há confirmação contextual para ações relevantes;
- estados de carregamento, falha, vazio e ausência de dados só aparecem no painel de comandos vazio, não por agregado/cenário;
- não é possível validar visualmente responsividade, contraste, foco e navegação completa sem navegador conectado;
- textos muito pequenos (8–10px em vários elementos) aumentam risco operacional, mas a classificação visual final fica `NOT_DEMONSTRABLE` sem renderização.

## 9. Integridade do escopo

- Nenhum código chama Git, GitHub/`gh`, Codex CLI, banco, e-mail ou backend real; essa parte está conforme o escopo explicitamente simulado.
- O estado é local em memória (`useState`, constantes e timers); não há `localStorage`/`sessionStorage` nem persistência externa.
- Nenhuma ADR foi modificada; seus hashes permanecem iguais ao baseline aprovado.
- O protótipo não alterou decisões arquiteturais, mas a implementação visual antecipa uma autoridade de comando no frontend, apontada em `PCA-CRITICAL-001`.
- Não houve expansão material de integração. A principal expansão problemática é de alegação: os documentos de cobertura declaram cenários demonstrados que o comportamento real não sustenta.

## 10. Requisitos não demonstráveis e riscos

Não foi possível demonstrar por execução visual/interativa, devido à ausência de navegador conectado:

- renderização das três variantes A/B/C;
- responsividade desktop, foco real, ordem de tabulação, contraste e erros de console;
- interação real com cada rota e cada controle;
- sequências temporizadas `requested → accepted → confirmed` no DOM;
- fechamento completo dos 12 cenários.

Independentemente dessa limitação, a inspeção estática já prova os findings críticos/major acima. O HTTP 200 para 120 URLs não deve ser interpretado como prova de que React renderizou cada tela.

Riscos principais:

- validação enganosa de comandos inválidos como confirmados;
- publicação aparentemente confirmada antes de integração remota;
- onboarding aparentemente pronto apesar de dirty/diverged;
- impossibilidade de provar segregação, capacidade conservadora, reconciliação, recuperação e imutabilidade;
- perda de confiança na rastreabilidade porque a fixture do DAG diverge da fixture de tickets.

## 11. Arquivos modificados durante a auditoria

O único arquivo criado durante esta auditoria foi:

- `docs/prototype-conformance-audit-2026-08-31.md` — este relatório.

Os seguintes itens já estavam presentes como alterações não rastreadas antes da auditoria e foram preservados sem edição:

- `docs/prototype-coverage-report.md`;
- `docs/prototype-plan.md`;
- `docs/prototype-traceability.md`;
- `prototype/`.

Não foram modificados `docs/adrs/`, `prototype/src/`, `package.json`, `package-lock.json`, `vite.config.ts`, `tsconfig.json` ou qualquer outra autoridade/configuração.

## 12. Recomendação para a próxima etapa

Remediar primeiro `PCA-CRITICAL-001`, criando uma autoridade mockada separada com comandos, guards, correlação, rejeições e eventos confirmados. Em seguida, implementar a matriz de estados e fixtures de cenários; corrigir publicação PR/push; normalizar tickets/DAG/ondas; fechar capacidade/segregação; e corrigir onboarding. Só depois repetir a auditoria com navegador conectado, testes automatizados dos 12 cenários e verificação visual de acessibilidade. Não recomendar aprovação do protótipo no estado auditado.
