---
schema_version: "1.0.0"
id: SPEC-EXEC-002
title: Agent Sessions and Scheduler
status: PROPOSED
revision: 1
date: 2026-09-08
spec_scope: agent-execution-and-scheduling
portfolio: SPEC-PORTFOLIO-001
portfolio_revision: 2
portfolio_verdict: PORTFOLIO_DECOMPOSITION_APPROVED
portfolio_audit: docs/specs/SPEC-PORTFOLIO-001-decomposition-audit.md
authoritative_adrs: [ADR-0004, ADR-0005]
related_adrs: [ADR-0001, ADR-0002, ADR-0003, ADR-0006, ADR-0007, ADR-0009, ADR-0011, ADR-0013, ADR-0014]
upstream_dependencies: [SPEC-DOM-001, SPEC-EXEC-001]
---

# SPEC-EXEC-002 — Agent Sessions and Scheduler

## 1. Status

`PROPOSED` — primeira materialização do boundary EXEC-002 a partir do
portfolio aprovado. Esta SPEC aguarda auditoria independente; não é uma
aprovação de implementação.

Generation baseline:

| Campo | Valor |
|---|---|
| Target component | `SPEC-EXEC-002` |
| Portfolio | `SPEC-PORTFOLIO-001`, revision `2` |
| Portfolio audit | `docs/specs/SPEC-PORTFOLIO-001-decomposition-audit.md` |
| Portfolio verdict | `PORTFOLIO_DECOMPOSITION_APPROVED` |
| Primary ADRs | `ADR-0004`, `ADR-0005`, revision `3`, `ACCEPTED` |
| Upstream dependency | `SPEC-DOM-001`, revision `2`, audit `PASS — COMPONENT_SPEC_CONFORMANT` |
| Upstream dependency | `SPEC-EXEC-001`, revision `1`, audit `PASS — COMPONENT_SPEC_CONFORMANT` |
| Repository HEAD | `bd1b455bd8c5c96113e7f4e7b2e89326c955f22b` |
| Existing target draft | ausente |
| Prior Gap Matrix | ausente para `SPEC-EXEC-002` |
| Gate | `READY_FOR_INDEPENDENT_COMPONENT_SPEC_AUDIT` after this generation |

## 2. Ownership

### Owns

Este componente é o owner normativo de exatamente as obrigações `O-022` a
`O-031` do portfolio:

- criação de uma nova sessão Codex isolada e de um novo
  `AgentAssignmentId` para cada atividade;
- elegibilidade de agentes por `ArtifactCycleId` e segregação de papéis;
- lifecycle de `ArtifactCycleId` no que diz respeito à atribuição e à
  elegibilidade;
- espera quando não existe agente elegível e a regra de contexto permitido
  para retomada entre sessões;
- teto dinâmico de capacidade fornecido por `AgentCapacityProvider`;
- não substituição ou interrupção arbitrária de sessões ativas;
- tratamento conservador de capacidade `UNKNOWN`;
- lease lógico, exclusivo e persistido de capacidade, incluindo seu lifecycle;
- pool global, prioridade configurável e distribuição justa entre execuções;
- filas, elegibilidade de despacho, ondas/DAG e serialização da fila final de
  merge como decisões de scheduling.

### Consumes

- `SPEC-DOM-001`: identidades, lineage, snapshot, lifecycle, estados,
  pré-condições, veredictos e base de execução canônicos. EXEC-002 usa
  `ExecutionId`, `ActivityId`, `AttemptId`, `ArtifactId`, `AgentId` e
  `ArtifactCycleId` como referências; não os redefine.
- `SPEC-EXEC-001`: envelope, registry, capability, skill/contract version,
  manifesto, checkpoint, resultado e falhas de contrato. EXEC-002 resolve e
  despacha somente entradas compatíveis com esse contrato.

`SPEC-PLAT-001`, `SPEC-BACKEND-001`, `SPEC-OPS-001`, `SPEC-GIT-001` e
`SPEC-UI-001` são consumidores ou owners de boundaries adjacentes. Seus
contratos de persistência física, processo/adapter, observabilidade,
integração Git e apresentação não são redefinidos aqui.

### Does not own

- identidade DOM, `AttemptId`, transições de domínio, estados de ticket,
  veredictos formais ou fechamento de ciclos de auditoria;
- envelope/schema, registry de capabilities, manifesto ou semântica de falha
  de contrato owned por `SPEC-EXEC-001`;
- banco, journal, outbox, idempotência de efeitos externos, evidência,
  reconciliação física ou recovery do backend;
- criação, captura de saída, encerramento técnico ou checkpoints de processos
  do Codex owned pelo boundary de backend/adapters;
- branches, worktrees, commits, integração, PR, publicação ou confirmação
  remota;
- API, transporte, autenticação, UI, telemetria ou exportação;
- semântica de merge como operação Git: EXEC-002 somente controla admissão e
  serialização da fila final; a execução e a evidência do merge pertencem ao
  owner de Git/publicação;
- nomes de classes, módulos, tabelas, rotas, protocolos, SDKs ou algoritmos
  concretos não congelados por ADR.

## 3. Portfolio Authority

| Fonte | Uso nesta SPEC |
|---|---|
| `docs/specs/SPEC-PORTFOLIO-001-organization.md` | ownership `O-022…O-031`, consumers, DAG, failure registry, compatibility registry e boundary de projeção |
| `docs/specs/SPEC-PORTFOLIO-001-decomposition-audit.md` | aprovação independente mais recente: `PORTFOLIO_DECOMPOSITION_APPROVED` |
| `docs/specs/SPEC-DOM-001-workflow-authority-and-governance.md` | contrato upstream de identidade, snapshot, lifecycle, estados, avanço e dependência |
| `docs/specs/audits/SPEC-DOM-001-component-conformance-audit.md` | evidência upstream mais recente: `PASS — COMPONENT_SPEC_CONFORMANT` |
| `docs/specs/SPEC-EXEC-001-skill-contracts-and-capability-registry.md` | contrato upstream de capability, versão, manifesto, checkpoints e falhas de contrato |
| `docs/specs/audits/SPEC-EXEC-001-component-conformance-audit.md` | evidência upstream mais recente: `PASS — COMPONENT_SPEC_CONFORMANT` |

Esta especificação materializa ownership já atribuído pelo portfolio aprovado
e não redefine fronteiras do portfolio.

## 4. ADR Authority

### Primary accepted ADRs

| ADR | Status | Seções/decisões usadas | Consequência local |
|---|---|---|---|
| `ADR-0004` | `ACCEPTED`, revision `3` | `Decisão` | sessão nova por atividade, assignment novo, segregação por ciclo/papel, espera sem elegível e contexto persistido |
| `ADR-0005` | `ACCEPTED`, revision `3` | `Decisão`, `Regras` | capacidade dinâmica, provider, teto conservador, lease, pool global, fairness, DAG, ondas e filas distintas |

### Related accepted ADRs

| ADR | Uso sem transferência de ownership |
|---|---|
| `ADR-0001` | DOM owns identidade, snapshot e base; EXEC-002 só correlaciona e valida referências recebidas. |
| `ADR-0002` | DOM owns pipeline, estados, pré-condições e dependência; EXEC-002 calcula elegibilidade operacional e não inventa transições. |
| `ADR-0003` | EXEC-001 owns contracts, versions, registry e manifesto; EXEC-002 resolve e consome esses contratos. |
| `ADR-0006` | PLAT owns journal, outbox, efeitos, idempotência e recovery físico; EXEC-002 declara lifecycle lógico de lease e espera confirmação/reconciliação. |
| `ADR-0007` | GIT owns branches, integração e merge; EXEC-002 mantém apenas a fila de merge serial e o gate de admissão. |
| `ADR-0009` | DOM owns ciclos de auditoria e veredictos; EXEC-002 aplica segregação de agentes nesses ciclos. |
| `ADR-0011` | BACKEND owns processo/sessão Codex, captura e transporte; EXEC-002 fornece a decisão de dispatch e as correlações. |
| `ADR-0013` | OPS owns observabilidade e correlação operacional; EXEC-002 fornece os campos de scheduling que devem ser observáveis. |
| `ADR-0014` | UI apresenta fila, capacidade e estados confirmados; não é autoridade para dispatch, lease ou elegibilidade. |

Todas as ADRs usadas como autoridade são `ACCEPTED`, revision `3`, sem
sucessor efetivo conflitante nesta fronteira.

## 5. Problem Statement

ADR-0004 exige que cada atividade seja executada em sessão isolada, com nova
atribuição e segregação de agentes verificável por ciclo. ADR-0005 exige que o
scheduler opere dentro de capacidade dinâmica, com leases exclusivos, pool
global justo, DAG de dependências, ondas auditadas e filas que expliquem por
que uma unidade aguarda.

O repositório não contém runtime produtivo de sessões, assignments,
`AgentCapacityProvider`, leases persistidos ou scheduler. O protótipo React
possui um mock em memória com sessões, leases, capacidade, prioridades,
filas, ciclos e testes de identidade, mas esse mock não é implementação nem
autoridade arquitetural.

Sem este boundary, um agente poderia ser reutilizado para auditar sua própria
alteração, uma execução poderia ultrapassar capacidade, um lease poderia ser
duplicado ou uma fila poderia esconder se o bloqueio é capacidade,
dependência, elegibilidade ou aprovação. A satisfação desta SPEC permite
despacho independente, limitado e explicável, preservando identidade e
decisão canônicas nos owners upstream.

## 6. Goals

- Cada atividade admitida possui uma sessão isolada e um
  `AgentAssignmentId` novo, correlacionados ao manifesto e ao ciclo correto.
- A elegibilidade impede que o mesmo agente audite ou remedeie sua própria
  alteração no mesmo `ArtifactCycleId`.
- Nenhum dispatch ultrapassa o teto de capacidade observado e nenhum spawn
  ocorre sem lease exclusivo.
- Capacidade desconhecida produz comportamento conservador e observável, sem
  fallback ilimitado.
- Execuções e repositórios independentes compartilham um pool global justo,
  sem uma prioridade monopolizar o scheduler.
- O DAG, as ondas e os motivos de espera impedem avanço prematuro e tornam
  ciclos, dependências, capacidade e conflitos de arquivo distinguíveis.
- Pausa, cancelamento, término e recovery não interrompem arbitrariamente uma
  sessão ativa nem transformam estado transitório em sucesso.

## 7. Non-Goals

- Implementar runtime Codex, processo nativo, adapter, banco, journal,
  outbox, API, UI ou integração externa.
- Definir ou alterar identidades, estados, transições, veredictos ou
  terminalidade DOM.
- Redefinir envelope, schema, registry, manifesto ou falhas de
  `SPEC-EXEC-001`.
- Definir a semântica de efeitos externos, confirmação, reconciliação física,
  publicação ou merge.
- Escolher algoritmo concreto de fairness, tecnologia de persistência,
  mecanismo de lease, protocolo de eventos ou comando do Codex CLI.
- Criar Gap Matrix, Implementation Plan, tickets, fases de entrega ou código
  de produção.

## 8. Current Repository State

| Área | Current behavior | Target behavior | Classification |
|---|---|---|---|
| ADR-0004/ADR-0005 | documentos aceitos, revision 3, não implementados | autoridade identificável para sessão, capacidade e scheduling | `ALREADY_CONFORMANT` como evidência documental |
| Portfolio O-022…O-031 | obrigações têm um owner único em EXEC-002 | boundary preservado | `ALREADY_CONFORMANT` |
| `prototype/src/mockDomain.ts` | simula sessões, assignments, ciclos, capacidade, leases, filas e scheduler em memória | comportamento produtivo independente do mock | `PROTOTYPE_ONLY` |
| `prototype/tests/mockDomain.test.ts` | cobre cenários simulados de capacidade, identidade, leases, prioridade e isolamento | conformance contra implementação real | `PROTOTYPE_ONLY` |
| Runtime Codex produtivo | não encontrado | cada atividade inicia sessão isolada e correlacionável | `IMPLEMENTATION_GAP` |
| Provider de capacidade | não encontrado fora do mock | provider dinâmico com estado `KNOWN`/`UNKNOWN` e teto conservador | `IMPLEMENTATION_GAP` |
| Lease persistido e exclusivo | não encontrado fora do mock | lease lógico persistido, sem dupla posse e com lifecycle verificável | `IMPLEMENTATION_GAP` |
| Scheduler global persistido | não encontrado | fairness, prioridades, filas, DAG e ondas entre execuções | `IMPLEMENTATION_GAP` |
| Backend/adapters | não há implementação produtiva | captura de processo, sessão, resultado e checkpoint pelos owners correspondentes | `IMPLEMENTATION_GAP` / downstream |
| `SPEC-EXEC-002` | draft não existia antes desta geração | SPEC materializada e auditável | `SPECIFICATION_GAP` — resolvido por este artefato |
| Gap Matrix de EXEC-002 | ausente | artefato downstream após validação da SPEC | `NON_GAP` nesta etapa |
| Tecnologia, algoritmo e layout | não congelados por ADR | liberdade de implementação dentro dos contratos | `UNFROZEN_IMPLEMENTATION_DETAIL` |
| Architecture gap | nenhuma identificada pelo audit do portfolio | nenhum novo decision point nesta SPEC | `NON_GAP` |

## 9. Owned Architectural Obligations

| ID | ADR / seção | Tratamento nesta SPEC | Requisitos |
|---|---|---|---|
| O-022 | ADR-0004 / Decisão | sessão Codex isolada e assignment novo por atividade | `EXEC-SESSION-001`, `EXEC-SESSION-002` |
| O-023 | ADR-0004 / Decisão | inelegibilidade do mesmo agente no mesmo ciclo | `EXEC-ELIGIBILITY-001` |
| O-024 | ADR-0004 / Decisão | lifecycle do `ArtifactCycleId` e segregação de remediador, auditor e conflito | `EXEC-CYCLE-001`, `EXEC-ROLE-001` |
| O-025 | ADR-0004 / Decisão | espera sem elegível e contexto de retomada limitado a artefatos persistidos | `EXEC-RESUME-001`, `EXEC-RESUME-002` |
| O-026 | ADR-0005 / Decisão | capacidade dinâmica por `AgentCapacityProvider` | `EXEC-CAPACITY-001`, `EXEC-DISPATCH-001` |
| O-027 | ADR-0005 / Regras | nenhuma substituição ou interrupção arbitrária | `EXEC-ACTIVITY-001` |
| O-028 | ADR-0005 / Regras | `UNKNOWN` usa teto conservador | `EXEC-CAPACITY-002` |
| O-029 | ADR-0005 / Regras | lease persistido, exclusivo e liberado conforme lifecycle | `EXEC-LEASE-001`, `EXEC-LEASE-002` |
| O-030 | ADR-0005 / Regras | pool global justo, prioridades sem monopólio e execuções independentes | `EXEC-SCHED-001`, `EXEC-SCHED-002` |
| O-031 | ADR-0005 / Regras | DAG, ondas, razões distintas de fila, merge final serial e conflito de arquivo separado | `EXEC-DAG-001`, `EXEC-DAG-002`, `EXEC-QUEUE-001`, `EXEC-MERGE-001` |

Cada obrigação possui requisito, critério de aceitação e teste de conformance.

## 10. Consumed Contracts

| Owner SPEC | Contract / requirement | Why consumed | Local rule |
|---|---|---|---|
| `SPEC-DOM-001` | `DOM-ID-001`, `DOM-LINEAGE-001` | correlacionar execução, atividade, artefato, tentativa, agente e ciclo | usar identidades canônicas recebidas; não criar `AttemptId`, `ArtifactId` ou estado DOM alternativo |
| `SPEC-DOM-001` | `DOM-SNAPSHOT-001`, `DOM-LIFE-001` | delimitar a base e o lifecycle do ciclo | um cycle permanece ligado ao snapshot/revisão; nova revisão/execução recebe a identidade prevista pelo DOM |
| `SPEC-DOM-001` | `DOM-PIPE-001`, `DOM-TICKET-001`, `DOM-TICKET-002`, `DOM-ADV-001` | avaliar dependências, estados `READY`, ondas e avanço | scheduler não despacha estado inelegível nem redefine transição ou terminalidade |
| `SPEC-EXEC-001` | `EXEC-REGISTRY-001`, `EXEC-CAPABILITY-001`, `EXEC-VERSION-002` | resolver skill/capability, versão e restrições de papel | somente entrada registrada e compatível pode ser candidata; desconhecida/incompatível permanece falha canônica de EXEC-001 |
| `SPEC-EXEC-001` | `EXEC-MANIFEST-001`, `EXEC-MANIFEST-002`, `EXEC-MANIFEST-003`, `EXEC-HISTORY-001` | fornecer basis, checkpoint, artefatos e contexto permitido | assignment/session referencia o manifesto; scheduler não usa memória conversacional ou estado transitório como contexto |
| `SPEC-EXEC-001` | `EXEC-CONTRACT-001`, `EXEC-CONTRACT-002`, `EXEC-FAILURE-001` | impedir dispatch baseado em resultado contratual inválido | propagar falha e não convertê-la em elegibilidade, sucesso ou aprovação |

Há exatamente duas dependências normativas upstream aprovadas: `SPEC-DOM-001`
e `SPEC-EXEC-001`. `SPEC-PLAT-001` e os demais componentes permanecem
owners/consumidores downstream de seus respectivos contratos; nenhuma nova
edge normativa é criada por esta seção.

## 11. Target Behavioral Model

```text
snapshot DOM + manifesto/capability EXEC-001 + candidatos de atividade
        ↓
avaliar lifecycle, dependências, papel, ciclo e capacidade
        ↓
fila com razão explícita → adquirir lease exclusivo → criar assignment/session
        ↓
dispatch admitido OU espera/falha sem mutar estado indevido
        ↓
resultado/checkpoint/terminação correlacionados ao assignment
        ↓
liberar ou reconciliar lease conforme lifecycle; recalcular fila/DAG/onda
```

O scheduler é autoridade apenas para elegibilidade operacional, lease,
admissão, fila e coordenação de ondas dentro das obrigações `O-022…O-031`.
DOM continua autoridade para identidades e estados de domínio; EXEC-001 para
contratos; PLAT para persistência/recovery físico; BACKEND para o processo e
transporte; GIT para merge/publicação; OPS/UI para projeções.

## 12. Identity and Authority Rules

| Identidade/conceito | Canonical owner | Reference identity | Local correlation | Derived projection |
|---|---|---|---|---|
| `ExecutionId`, `ActivityId`, `ArtifactId`, `AttemptId` | `SPEC-DOM-001` | IDs recebidos do snapshot/manifesto | chave de correlação de scheduling | label/status mostrado |
| `AgentId` | `SPEC-DOM-001` quando usado como identidade de domínio; catálogo/runtime fornece referência elegível | ID do agente no registry/assignment | histórico de elegibilidade | nome/label do agente |
| `AgentAssignmentId` | `SPEC-EXEC-002` | assignment vinculado à atividade, papel, ciclo, skill, manifesto e sessão | chave de lease e dispatch | resumo de atribuição |
| `ArtifactCycleId` | lifecycle canônico referenciado pelo DOM; EXEC-002 owns sua aplicação para elegibilidade | ciclo do artefato | índice de assignments/elegibilidade | ciclo/rodada exibido |
| native session identifier | backend/adapter como evidência técnica; não substitui assignment | referência opcional no assignment | correlação de processo | identificador operacional |
| scheduler lease | `SPEC-EXEC-002` para exclusividade e lifecycle lógico | lease vinculado a assignment/capacidade | token/versão de posse | capacidade usada |
| queue reason / capacity observation | `SPEC-EXEC-002` dentro do scheduling | estado da fila e observação do provider | reevaluation correlation | motivo exibido |

`AgentAssignmentId` é novo por atividade admitida, e não pode ser derivado de
nome, prompt, sessão anterior ou label. Uma nova sessão nativa, quando
disponível, é referência técnica; não cria identidade DOM concorrente. Retry
de uma atividade conserva a lineage DOM aplicável, mas recebe assignment e
sessão novos e continua sujeito à inelegibilidade por ciclo.

## 13. Normative Requirements

### EXEC-SESSION-001 — Sessão e assignment novos

Para cada atividade admitida, EXEC-002 deve criar uma nova atribuição lógica
`AgentAssignmentId` e solicitar uma sessão Codex isolada. A atribuição deve
estar vinculada à execução, atividade, papel, skill/capability, artefato,
`ArtifactCycleId`, rodada, manifesto e, quando disponível, ao identificador
nativo de sessão. Reutilizar uma sessão ou assignment de outra atividade não é
admissível.

Authority: `O-022`, `ADR-0004`, `Decisão`.

### EXEC-SESSION-002 — Admissão somente após correlação suficiente

Uma atividade não pode ser despachada se faltarem as referências DOM e EXEC-001
necessárias para correlacionar assignment, ciclo, manifesto, capability e
basis. Ausência ou incompatibilidade deve manter a unidade fora de execução e
preservar a falha canônica do owner correspondente; não pode ser compensada
por texto, nome ou sessão já existente.

Authority: `O-022`, `ADR-0004`, `ADR-0003`, `Decisão`.

### EXEC-ELIGIBILITY-001 — Inelegibilidade no mesmo ciclo

Um agente que já possui assignment no mesmo `ArtifactCycleId` não pode receber
novo assignment para esse ciclo, inclusive quando a atividade retorna para
remediação, auditoria ou etapa anterior. O agente permanece elegível para
outros artefatos ou ciclos independentes. A decisão deve consultar o histórico
persistido de assignments, não a memória de uma sessão.

Authority: `O-023`, `ADR-0004`, `Decisão`.

### EXEC-CYCLE-001 — Lifecycle do ArtifactCycleId

`ArtifactCycleId` deve ser criado quando uma revisão entra na primeira
atividade auditável, permanecer estável durante rodadas e retornos downstream
da mesma execução, e terminar somente por aprovação formal ou cancelamento
terminal conforme o lifecycle DOM. Uma nova execução sobre uma revisão
posterior deve usar novo ciclo. EXEC-002 não pode encerrar ou recriar o ciclo
por conveniência de scheduling.

Authority: `O-024`, `ADR-0004`, `Decisão`, consumindo `DOM-LIFE-001`.

### EXEC-ROLE-001 — Segregação de papéis

Um remediador não pode auditar a própria alteração no mesmo ciclo. Um agente
de resolução de conflito não pode ser implementador dos tickets conflitantes
nem auditor da integração correspondente. Se as restrições de papel eliminarem
todos os candidatos, a unidade deve aguardar e não pode relaxar a regra.

Authority: `O-024`, `ADR-0004`, `Decisão`.

### EXEC-RESUME-001 — Espera sem agente elegível

Quando não houver agente elegível, a atividade deve permanecer em fila com
razão `AGENT_ELIGIBILITY` ou equivalente explicitamente distinguível. O
orquestrador não pode assumir a tarefa, trocar a identidade do agente sem
novo assignment, reduzir a segregação ou despachar por timeout implícito.

Authority: `O-025`, `ADR-0004`, `Decisão`.

### EXEC-RESUME-002 — Contexto de retomada autorizado

Entre sessões, somente manifesto, artefatos e resultados/checkpoints
persistidos, relacionados ao basis correto, podem formar contexto de
retomada. Memória conversacional anterior, texto não validado, estado de
processo perdido ou projeção de UI não são autoridade. A aplicação física do
replay pertence a `SPEC-PLAT-001`; a semântica de contexto entre agentes
pertence a este boundary.

Authority: `O-025`, `ADR-0004`, `Decisão`, consumindo
`EXEC-MANIFEST-001/002/003`.

### EXEC-CAPACITY-001 — Provider de capacidade

Toda decisão de dispatch deve consultar uma abstração de capacidade equivalente
a `AgentCapacityProvider`. Quando houver capacidade confiável do Codex CLI, a
observação deve refletir essa autoridade; quando não houver, o provider deve
retornar `UNKNOWN` e permitir somente o teto conservador configurado. A
capacidade não pode ser inferida de contagem local otimista ou da UI.

Authority: `O-026`, `ADR-0005`, `Decisão`.

### EXEC-CAPACITY-002 — Capacidade UNKNOWN conservadora

Com capacidade `UNKNOWN`, o scheduler deve aplicar teto conservador e não
ultrapassá-lo. A unidade que não puder obter slot deve permanecer em fila com
razão `CAPACITY`; `UNKNOWN` não pode ser tratado como capacidade ilimitada,
como sucesso ou como autorização para substituir uma sessão ativa.

Authority: `O-028`, `ADR-0005`, `Regras`.

### EXEC-DISPATCH-001 — Nenhum dispatch sem capacidade e lease

Nenhum spawn/dispatch de atividade pode ocorrer sem capacidade confirmada
dentro do teto aplicável e lease exclusivo adquirido para o assignment. A
ordem lógica observável é: avaliar elegibilidade, confirmar capacidade,
adquirir lease, registrar assignment/session e então solicitar dispatch. Falha
em qualquer pré-condição mantém a unidade fora de execução.

Authority: `O-026`, `O-029`, `ADR-0005`, `Decisão`, `Regras`.

### EXEC-ACTIVITY-001 — Sessão ativa não é interrompida arbitrariamente

O scheduler não pode substituir, interromper, apressar ou matar uma sessão
ativa para satisfazer prioridade, capacidade ou fila. Pausa e cancelamento
devem ser pedidos cooperativos e permanecer pendentes até checkpoint/estado
seguro e término confirmado pelos owners de processo e persistência.

Authority: `O-027`, `ADR-0005`, `Regras`, consumindo o boundary de
processo/recovery de `SPEC-BACKEND-001` e `SPEC-PLAT-001`.

### EXEC-LEASE-001 — Lease persistido e exclusivo

Cada dispatch deve possuir lease logicamente persistido, vinculado a um único
assignment e a uma unidade de capacidade. Não podem existir dois leases ativos
para a mesma unidade de capacidade nem dois owners para o mesmo assignment.
Tentativas concorrentes devem deixar no máximo um lease vencedor e não podem
ultrapassar o teto observado.

Authority: `O-029`, `ADR-0005`, `Regras`.

### EXEC-LEASE-002 — Lifecycle e liberação do lease

O lease deve permanecer ativo enquanto a sessão admitida está ativa e ser
liberado somente por término confirmado ou reconciliação autorizada do
lifecycle. Falha, reinício, pausa ou cancelamento não autorizam liberação
otimista que possa duplicar execução. A persistência física, journal, outbox e
recovery da liberação permanecem no owner PLAT.

Authority: `O-029`, `ADR-0005`, `Decisão`, consumindo o boundary de
persistência/recovery de `SPEC-PLAT-001`.

### EXEC-SCHED-001 — Pool global entre execuções

Execuções e repositórios independentes devem competir pelo mesmo pool global
de capacidade sem sobrescrever leases ou identidade de outra execução. Uma
execução nova pode iniciar enquanto outra está ativa, desde que suas bases DOM
sejam independentes e cada dispatch satisfaça as mesmas regras de capacidade,
assignment e lease.

Authority: `O-030`, `ADR-0005`, `Regras`.

### EXEC-SCHED-002 — Prioridade configurável e fairness

Prioridade configurável pode alterar peso ou ordem futura, mas não concede
monopólio. O scheduler deve fornecer distribuição justa suficiente para evitar
inanição entre execuções elegíveis e deve manter a decisão determinística para
o mesmo conjunto de observações e configuração. Uma prioridade maior não pode
tomar lease já adquirido nem interromper uma sessão ativa.

Authority: `O-030`, `ADR-0005`, `Decisão`.

### EXEC-DAG-001 — Dependências e ondas

Tickets somente podem ser elegíveis quando todas as dependências do DAG
estiverem concluídas conforme o contrato DOM. Todos os tickets `READY` que
tenham capacidade e agente elegível podem ser despachados em paralelo; um
potencial conflito de arquivo não é, por si só, bloqueio de execução paralela.
Uma nova onda somente pode ser calculada após integração, auditoria,
finalização da onda anterior e recálculo do DAG.

Authority: `O-031`, `ADR-0005`, `Regras`, consumindo
`DOM-TICKET-001/002` e `DOM-ADV-001`.

### EXEC-DAG-002 — Ciclo e dependência não são capacidade

Um ciclo no DAG deve bloquear a SPEC com a semântica canônica
`INVALID_DEPENDENCY_CLOSURE` do owner DOM. Dependência ainda não concluída,
aprovação pendente, pausa, capacidade ausente, agente inelegível e merge
serial devem permanecer razões distintas. EXEC-002 não pode converter ciclo
ou dependência em `CAPACITY_EXHAUSTED`, nem decidir aprovação de domínio.

Authority: `O-031`, `ADR-0005`, `ADR-0002`, `Regras`, consumindo o failure
contract DOM.

### EXEC-QUEUE-001 — Razões de fila observáveis

Cada item aguardando deve expor uma razão de scheduling que distinga, no
mínimo, `CAPACITY`, `AGENT_ELIGIBILITY`, `DEPENDENCY`, `PAUSED`, `APPROVAL` e
`MERGE_SERIAL`. A razão não pode ser substituída por uma mensagem genérica
nem pode alterar a semântica canônica do failure owner.

Authority: `O-031`, `ADR-0005`, `Regras`.

### EXEC-MERGE-001 — Fila final de merge serial

A fila final de merge deve admitir no máximo uma operação de merge em voo por
vez. EXEC-002 deve serializar a admissão e liberar a próxima unidade somente
após a confirmação do resultado ou reconciliação definida pelo owner
`SPEC-GIT-001`; não executa nem confirma o merge e não transforma uma
solicitação em publicação concluída.

Authority: `O-031`, `ADR-0005`, `Regras`, consumindo o contrato de publicação
de `SPEC-GIT-001`.

## 14. Commands / Queries / Events

Os nomes abaixo descrevem semântica, não congelam rotas, DTOs ou protocolos:

| Interface | Classificação | Regra |
|---|---|---|
| observar capacidade e elegibilidade | `QUERY` | retorna estado/basis do provider e candidatos; não cria lease nem altera DOM |
| avaliar item para dispatch | `APPLICATION_COMMAND` | valida ciclo, papel, dependências e capacidade; resultado é admitido ou razão de fila |
| adquirir/liberar lease | `APPLICATION_COMMAND` | operação exclusiva do scheduling; repetição não cria segunda posse |
| criar assignment e solicitar nova sessão | `APPLICATION_COMMAND` | somente após todas as pré-condições; processo nativo e captura pertencem ao backend |
| resultado de assignment/sessão | `INTEGRATION_EVENT` | correlacionado por assignment/ciclo/manifesto; resultado válido segue EXEC-001 |
| mudança de capacidade, lease ou razão de fila | `OPERATIONAL_EVENT` | observável para OPS/BACKEND/UI; não vira estado DOM por ser emitido pelo scheduler |
| estado de onda/DAG | `PROJECTION_EVENT` / `QUERY` | expõe decisão operacional; estados e veredictos canônicos continuam nos owners DOM/GIT |

Um `CANONICAL_DOMAIN_COMMAND` ou `CANONICAL_DOMAIN_EVENT` não é criado por
esta SPEC. Falhas `CONTRACT_INVALID`, `VERDICT_UNKNOWN`,
`UNKNOWN_CAPABILITY`, `INCOMPATIBLE_CAPABILITY`, `INVALID_COMMAND_BASIS` e
`INVALID_DEPENDENCY_CLOSURE` mantêm a semântica dos owners; este componente
somente decide se a unidade permanece fora de dispatch e qual razão local de
fila é exibida.

## 15. Failure Semantics

### Falhas canônicas owned

| Família/código | Trigger | Significado local | Retry/recovery |
|---|---|---|---|
| Capacity — `CAPACITY_UNKNOWN` | provider não fornece observação confiável | capacidade não pode ser tratada como ilimitada; aplicar teto conservador | reavaliar após nova observação; não fazer fallback ilimitado |
| Capacity — `CAPACITY_EXHAUSTED` | não há slot/lease dentro do teto | unidade aguarda por capacidade; nenhum dispatch | reevaluar sem interromper sessões ativas |
| Capacity/eligibility — `AGENT_INELIGIBLE` | agente viola ciclo, papel, assignment ou capability | agente não pode receber esta atividade | procurar outro candidato explicitamente elegível; se nenhum, aguardar |

Essas falhas não confirmam resultado, não alteram aprovação DOM e não criam
uma sessão implícita. Seus rótulos são os do registry do portfolio; qualquer
alias local deve preservar trigger, significado, retryability e terminalidade.

### Falhas consumidas

| Falha | Owner semântico | Regra EXEC-002 |
|---|---|---|
| `CONTRACT_INVALID`, `VERDICT_UNKNOWN`, `UNKNOWN_CAPABILITY`, `INCOMPATIBLE_CAPABILITY` | `SPEC-EXEC-001` | não despachar com resultado/basis inválido; não converter em capacidade ou sucesso |
| `INVALID_COMMAND_BASIS`, `STALE_REVISION` | `SPEC-DOM-001` | preservar basis/revisão e bloquear dispatch até correção/reconciliação autorizada |
| `INVALID_DEPENDENCY_CLOSURE` | `SPEC-DOM-001` | distinguir de fila de capacidade e bloquear a SPEC conforme DOM |
| `MERGE_CONFLICT`, `PUBLICATION_DRIFT`, `REMOTE_PUBLICATION_UNCONFIRMED` | `SPEC-GIT-001` | manter merge/publicação fora da fila de execução concluída; não renomear a falha |

`SPEC-BACKEND-001` pode mapear representação de transporte, `SPEC-OPS-001`
pode registrar e `SPEC-UI-001` pode apresentar. Nenhum desses mappings pode
alterar a semântica canônica.

## 16. Retry / Idempotency / Recovery

- Uma reavaliação de fila por mudança de capacidade, elegibilidade ou
  dependência é uma decisão de scheduling; não é por si só nova rodada de
  auditoria nem justificativa para interromper uma sessão ativa.
- Um retry de atividade que realmente seja admitido recebe assignment e
  sessão novos, conserva as referências DOM e a base/manifesto aplicáveis e
  continua inelegível para qualquer agente já usado no mesmo ciclo.
- Aquisição concorrente de lease é idempotente no sentido de produzir no
  máximo uma posse ativa para a mesma unidade; uma tentativa perdedora não
  cria assignment ou sessão duplicados.
- A semântica física de idempotência, journal, outbox, evidência de término e
  recovery após reinício pertence a `SPEC-PLAT-001`. EXEC-002 somente retoma
  despacho após receber estado/reconciliação compatível e não trata status
  salvo isoladamente como conclusão.
- Pausa e cancelamento são pedidos cooperativos. A capacidade só volta ao
  pool após término confirmado ou reconciliação autorizada; ausência de
  confirmação conserva a unidade em estado seguro/pendente.
- Uma tentativa operacional de execução não conta como nova rodada de
  auditoria e não relaxa a regra de segregação de agente.

## 17. Compatibility / Cutover

| Classe | Papel de EXEC-002 | Regra |
|---|---|---|
| `NEW_CANONICAL_PATH` | `OWNER` — `O-022…O-030`, ADR-0004/0005 | sessões, assignments, leases, filas e scheduler seguem este contrato |
| `LEGACY_COMPATIBILITY` | `NOT_APPLICABLE` | não existe autoridade legada de sessão/scheduler autorizada; um mock não é caminho canônico |
| `HISTORICAL_REPLAY` | `CONSUMER` — `SPEC-PLAT-001`/`SPEC-DOM-001` | histórico preserva assignment, ciclo, manifesto, leases e razões sem reinterpretar com capacidade atual |
| `CUTOVER` | `NOT_APPLICABLE` | ADR-0004/0005 não definem caminho canônico concorrente ou fase de cutover |
| `RETIREMENT` | `NOT_APPLICABLE` | não há obrigação de aposentadoria de uma autoridade legada nesta fronteira |

Qualquer compatibilidade futura deve adaptar-se ao caminho novo e não criar
uma segunda fonte canônica de elegibilidade, lease ou estado de sessão.

## 18. Projection Boundaries

O snapshot do scheduler é autoritativo somente para campos owned por
EXEC-002: observação de capacidade, leases, assignments, elegibilidade,
razões de fila, prioridade, waves e serialização de admissão. Mesmo nesses
campos, a persistência/recovery física é de PLAT.

| Aspecto | Regra |
|---|---|
| Fonte canônica | estado logical de scheduling mais referências DOM/EXEC-001 válidas |
| Projeção | BACKEND/OPS/UI podem projetar capacidade, fila, assignment e onda |
| Refresh/replay | deve usar eventos/snapshots/basis correlacionados; não reconstruir por texto de UI |
| Stale behavior | snapshot stale não admite dispatch; exige reavaliação/reconciliação |
| Limite de autoridade | projeção não cria assignment, lease, aprovação, conclusão, efeito ou publicação |

## 19. External Effects

| Semântica | Owner/regra |
|---|---|
| request de dispatch | EXEC-002 decide somente depois de capacidade, elegibilidade e lease |
| intent de iniciar processo | boundary de aplicação/backend materializa a solicitação; não é confirmação de execução |
| execução externa | Codex CLI/process adapter pertence a `SPEC-BACKEND-001` |
| evidência de saída/término/checkpoint | contrato de execução/backend e persistência owners; deve referenciar assignment/session/manifesto |
| confirmação de sucesso | resultado estruturado e lifecycle DOM/PLAT/GIT conforme o caso; scheduler não infere por ausência de erro |
| reconciliação | PLAT/backend owners; lease só é liberado com término confirmado ou reconciliação autorizada |
| projeção | OPS/BACKEND/UI, sem autoridade canônica |

## 20. Security / Authorization

Não há obrigação de autenticação, autorização de transporte ou armazenamento
de segredo alocada a EXEC-002. A elegibilidade de papel é uma regra de
segregação do scheduler, não substitui autorização de domínio nem autenticação
do backend. Tokens, credenciais, sessão local e proteção de processo pertencem
ao boundary de segurança/backend; a ausência de token ou a presença de um
nome de usuário não torna um agente elegível.

## 21. Conformance Suite

### Positive

1. Uma atividade elegível recebe assignment novo, sessão isolada, lease único
   e correlação completa com manifesto/ciclo.
2. Dois tickets `READY` sem dependência entre si são admitidos em paralelo
   quando há dois leases e agentes elegíveis.
3. Execuções independentes compartilham o pool global e a prioridade altera a
   ordem futura sem interromper sessão ativa.
4. Um provider conhecido limita dispatch ao teto observado; a liberação após
   término confirmado permite nova admissão.
5. O recálculo de uma onda ocorre somente após integração, auditoria,
   finalização e recálculo do DAG.

### Negative

6. Reutilizar assignment ou sessão da mesma atividade/atividade anterior é
   rejeitado.
7. O agente que atuou no mesmo `ArtifactCycleId` é rejeitado, inclusive após
   retorno para remediação.
8. Remediador, auditor e resolvedor de conflito não podem violar as regras de
   segregação.
9. Nenhum dispatch ocorre sem capacidade confirmada dentro do teto ou sem
   lease exclusivo.
10. `UNKNOWN` não permite ultrapassar o teto conservador; falta de vaga fica
    em `CAPACITY`.
11. Interrupção forçada de sessão ativa por prioridade, pausa ou cancelamento
    falha; o pedido deve ser cooperativo.
12. Segundo lease concorrente para a mesma capacidade/assignment é rejeitado
    sem mutação parcial.
13. Dependência incompleta, ciclo, aprovação, pausa e conflito de arquivo não
    são colapsados em uma razão única.
14. Ciclo produz `INVALID_DEPENDENCY_CLOSURE` do DOM e não dispatch.
15. Uma mensagem de UI, texto de sessão ou status stale não cria elegibilidade,
    lease, assignment ou sucesso.
16. Resultado `CONTRACT_INVALID`, `VERDICT_UNKNOWN` ou capability incompatível
    não é tratado como capacidade disponível ou aprovação.

### Boundary isolation

17. O scheduler não cria/redefine `AttemptId`, transição DOM, veredito, schema,
    efeito, merge ou publicação.
18. Uma projeção de capacidade/fila não se torna estado DOM canônico.
19. Backend, OPS e UI podem transportar/observar/projetar os dados, mas não
    mudam falha, retryability, terminalidade ou owner.
20. Um potencial conflito de arquivo não impede despacho paralelo por si só;
    integração permanece no owner Git.

### Dependency conformance

21. O scheduler aceita somente capability, versão, manifesto e checkpoint
    resolvidos pelos IDs/contratos de `SPEC-EXEC-001`.
22. O scheduler usa identidades, snapshot, lifecycle e dependências de
    `SPEC-DOM-001` sem redefini-los.
23. Histórico/replay conserva o basis original e não usa registry/capacidade
    atual para reinterpretar uma execução histórica.

### Compatibility and recovery

24. Não há caminho legada concorrente que possa manter dois owners de sessão,
    lease ou elegibilidade.
25. Após reinício ou término ambíguo, nenhuma capacidade é reutilizada até
    confirmação/reconciliação autorizada.
26. Retry preserva lineage/ciclo e cria assignment/session novos sem contar
    como nova rodada de auditoria.

### Synthetic extensibility

27. Uma capability sintética registrada por `SPEC-EXEC-001` pode ser resolvida
    e despachada pelas mesmas regras de assignment, papel, capacidade, lease e
    fila, sem enum, branch ou reviewer especial em EXEC-002.

## 22. Acceptance Criteria

| ID | Critério binário | Requirement(s) |
|---|---|---|
| AC-EXEC-002-001 | Dado um activity válido, assignment e sessão recebidos são novos e possuem todas as correlações exigidas. | `EXEC-SESSION-001/002` |
| AC-EXEC-002-002 | Reuso de sessão/assignment ou referência incompleta deixa a atividade fora de dispatch. | `EXEC-SESSION-001/002` |
| AC-EXEC-002-003 | Agente já usado no ciclo é inelegível, inclusive em remediação posterior no mesmo ciclo. | `EXEC-ELIGIBILITY-001` |
| AC-EXEC-002-004 | `ArtifactCycleId` permanece estável durante retornos e termina somente conforme DOM. | `EXEC-CYCLE-001` |
| AC-EXEC-002-005 | Violação de papel de remediador/auditor/conflito é rejeitada sem fallback. | `EXEC-ROLE-001` |
| AC-EXEC-002-006 | Sem agente elegível, a unidade aguarda com razão explícita e nenhum agente alternativo indevido é criado. | `EXEC-RESUME-001` |
| AC-EXEC-002-007 | Retomada aceita somente manifesto, artefatos e resultados/checkpoints persistidos do basis correto. | `EXEC-RESUME-002` |
| AC-EXEC-002-008 | Toda decisão de dispatch consulta `AgentCapacityProvider` ou equivalente autorizado. | `EXEC-CAPACITY-001` |
| AC-EXEC-002-009 | Com provider `UNKNOWN`, o número de sessões ativas nunca excede o teto conservador. | `EXEC-CAPACITY-002` |
| AC-EXEC-002-010 | Nenhum spawn ocorre sem capacidade aplicável e lease exclusivo. | `EXEC-DISPATCH-001` |
| AC-EXEC-002-011 | Prioridade, pausa ou cancelamento não interrompem uma sessão ativa. | `EXEC-ACTIVITY-001` |
| AC-EXEC-002-012 | Concorrência de aquisição deixa no máximo um lease ativo por capacidade/assignment. | `EXEC-LEASE-001` |
| AC-EXEC-002-013 | Lease só é liberado após término confirmado ou reconciliação autorizada. | `EXEC-LEASE-002` |
| AC-EXEC-002-014 | Execuções independentes usam pool global sem sobrescrever leases. | `EXEC-SCHED-001` |
| AC-EXEC-002-015 | Nenhuma prioridade monopoliza o pool e o resultado é determinístico para a mesma entrada. | `EXEC-SCHED-002` |
| AC-EXEC-002-016 | Ticket sem dependência pendente pode executar em paralelo com outro `READY`; conflito potencial de arquivo não bloqueia sozinho. | `EXEC-DAG-001` |
| AC-EXEC-002-017 | Nova onda só aparece após os gates de integração, auditoria, finalização e recálculo. | `EXEC-DAG-001` |
| AC-EXEC-002-018 | Ciclo gera `INVALID_DEPENDENCY_CLOSURE` e bloqueia, sem ser convertido em falha de capacidade. | `EXEC-DAG-002` |
| AC-EXEC-002-019 | Fila distingue todas as razões obrigatórias. | `EXEC-QUEUE-001` |
| AC-EXEC-002-020 | No máximo um merge está em voo e o scheduler não o confirma como publicação. | `EXEC-MERGE-001` |

## 23. ADR / Obligation / Requirement Traceability

| Requirement | Portfolio obligation | ADR | ADR section | Ownership role | Acceptance / test |
|---|---|---|---|---|---|
| `EXEC-SESSION-001` | O-022 | ADR-0004 | Decisão | `CANONICAL_OWNER` | AC-EXEC-002-001; tests 1, 6 |
| `EXEC-SESSION-002` | O-022 | ADR-0004; ADR-0003 | Decisão | `CANONICAL_OWNER` + consumed contract | AC-EXEC-002-002; tests 1, 6 |
| `EXEC-ELIGIBILITY-001` | O-023 | ADR-0004 | Decisão | `CANONICAL_OWNER` | AC-EXEC-002-003; test 7 |
| `EXEC-CYCLE-001` | O-024 | ADR-0004 | Decisão | `CANONICAL_OWNER`, DOM lifecycle consumed | AC-EXEC-002-004; test 1 |
| `EXEC-ROLE-001` | O-024 | ADR-0004 | Decisão | `CANONICAL_OWNER` | AC-EXEC-002-005; test 8 |
| `EXEC-RESUME-001` | O-025 | ADR-0004 | Decisão | `CANONICAL_OWNER` | AC-EXEC-002-006; tests 7, 9 |
| `EXEC-RESUME-002` | O-025 | ADR-0004; ADR-0003 | Decisão | `CANONICAL_OWNER` + EXEC-001 consumed | AC-EXEC-002-007; tests 15, 23 |
| `EXEC-CAPACITY-001` | O-026 | ADR-0005 | Decisão | `CANONICAL_OWNER` | AC-EXEC-002-008; test 4 |
| `EXEC-CAPACITY-002` | O-028 | ADR-0005 | Regras | `CANONICAL_OWNER` | AC-EXEC-002-009; test 10 |
| `EXEC-DISPATCH-001` | O-026/O-029 | ADR-0005 | Decisão/Regras | `CANONICAL_OWNER` | AC-EXEC-002-010; test 9 |
| `EXEC-ACTIVITY-001` | O-027 | ADR-0005 | Regras | `CANONICAL_OWNER` | AC-EXEC-002-011; test 11 |
| `EXEC-LEASE-001` | O-029 | ADR-0005 | Regras | `CANONICAL_OWNER` | AC-EXEC-002-012; test 12 |
| `EXEC-LEASE-002` | O-029 | ADR-0005; ADR-0006 | Regras/Decisão | `CANONICAL_OWNER` + PLAT boundary consumed | AC-EXEC-002-013; test 25 |
| `EXEC-SCHED-001` | O-030 | ADR-0005 | Regras | `CANONICAL_OWNER` | AC-EXEC-002-014; test 3 |
| `EXEC-SCHED-002` | O-030 | ADR-0005 | Decisão | `CANONICAL_OWNER` | AC-EXEC-002-015; test 3 |
| `EXEC-DAG-001` | O-031 | ADR-0005; ADR-0002 | Regras/Decisão | `CANONICAL_OWNER` + DOM contract consumed | AC-EXEC-002-016/017; tests 2, 4 |
| `EXEC-DAG-002` | O-031 | ADR-0005; ADR-0002 | Regras/Decisão | local scheduling + DOM failure consumed | AC-EXEC-002-018; test 14 |
| `EXEC-QUEUE-001` | O-031 | ADR-0005 | Regras | `CANONICAL_OWNER` | AC-EXEC-002-019; test 13 |
| `EXEC-MERGE-001` | O-031 | ADR-0005; ADR-0007 | Regras/Decisão | scheduling owner + GIT operation consumed | AC-EXEC-002-020; tests 13, 20 |

`REQUIREMENTS_WITHOUT_PORTFOLIO_OBLIGATION = 0`. O requisito
`EXEC-SESSION-002` é uma precisão local diretamente necessária para O-022 e
para a autoridade de contrato de ADR-0003; não cria nova autoridade.

## 24. Known Gap Summary

| Gap subject | Classification | Related requirement | Evidence |
|---|---|---|---|
| Runtime produtivo de sessão/assignment | `IMPLEMENTATION_GAP` | `EXEC-SESSION-001/002`, `EXEC-ELIGIBILITY-001` | nenhum runtime fora do protótipo |
| Provider real de capacidade e teto conservador | `IMPLEMENTATION_GAP` | `EXEC-CAPACITY-001/002` | somente mock em `prototype/src/mockDomain.ts` |
| Lease persistido/exclusivo e lifecycle | `IMPLEMENTATION_GAP` | `EXEC-DISPATCH-001`, `EXEC-LEASE-001/002` | ausência de backend, banco e persistência operacional |
| Scheduler global, fairness, filas e waves | `IMPLEMENTATION_GAP` | `EXEC-SCHED-001/002`, `EXEC-DAG-001/002`, `EXEC-QUEUE-001` | simulação em memória e testes do protótipo |
| Interação real com Codex CLI e checkpoints | `IMPLEMENTATION_GAP` | `EXEC-RESUME-001/002`, `EXEC-ACTIVITY-001` | adapters/backend não encontrados |
| Prova normativa do componente | `SPECIFICATION_GAP` | esta SPEC | antes desta geração não existia arquivo alvo; auditoria independente permanece downstream |
| Mock scheduler e testes do protótipo | `PROTOTYPE_ONLY` | todos | `prototype/src/mockDomain.ts`, `prototype/tests/mockDomain.test.ts` |
| Persistência/recovery físico e observabilidade | `IMPLEMENTATION_GAP` owned by downstream specs | `EXEC-LEASE-002`, `EXEC-RESUME-002` | PLAT/OPS/BACKEND ainda não implementados |
| Technology/algorithm choices | `UNFROZEN_IMPLEMENTATION_DETAIL` | todos | ADRs não congelam banco, provider adapter, fairness algorithm ou protocolo |

Não há Gap Matrix anterior a reconciliar. A formalização das linhas, evidência
de fechamento e unidades de implementação permanecem trabalho downstream.

## 25. Dependencies

| Dependency SPEC | Contract consumed | Blocking? | Evidence |
|---|---|---|---|
| `SPEC-DOM-001` | identidade, snapshot, lifecycle, estados, dependências, veredictos e avanço (`DOM-ID-001`, `DOM-SNAPSHOT-001`, `DOM-LIFE-001`, `DOM-TICKET-001/002`, `DOM-ADV-001`) | YES | portfolio edge `EXEC-002 → DOM-001`; audit `PASS — COMPONENT_SPEC_CONFORMANT` |
| `SPEC-EXEC-001` | registry, capability/version, manifesto, checkpoints e contrato de falha (`EXEC-REGISTRY-001`, `EXEC-CAPABILITY-001`, `EXEC-MANIFEST-001/002/003`, `EXEC-FAILURE-001`) | YES | portfolio edge `EXEC-002 → EXEC-001`; audit `PASS — COMPONENT_SPEC_CONFORMANT` |

Nenhuma dependência normativa nova foi adicionada. `PLAT`, `BACKEND`, `GIT`,
`OPS` e `UI` são contratos downstream/consumidores conforme o portfolio e não
podem inverter a direção do DAG.

## 26. Risks

| Risco | Mitigação/conformance |
|---|---|
| Reutilização do agente no mesmo ciclo | histórico por `ArtifactCycleId`; tests 7–8 |
| Lease duplicado ou liberação otimista | exclusividade, término confirmado/reconciliação; tests 9, 12, 25 |
| `UNKNOWN` virar capacidade ilimitada | teto conservador e `CAPACITY_UNKNOWN`; test 10 |
| Prioridade monopolizar o pool | fairness e decisão determinística; test 3 |
| Fila esconder a causa do bloqueio | razões distintas obrigatórias; test 13 |
| Scheduler virar segunda máquina DOM | contratos consumidos e test 17 |
| Resultado de contrato inválido gerar dispatch | fail-closed de EXEC-001 e tests 15, 22 |
| Merge/sucesso ser confirmado pelo scheduler | admissão serial apenas; tests 18, 20 |
| Projeção virar autoridade | limites de projeção e test 18 |
| Retry duplicar efeito ou contar como auditoria | PLAT/backend owners, novo assignment e test 26 |
| Mock/protótipo tratado como produção | classificação `PROTOTYPE_ONLY` e conformance independente |

## 27. Implementation Details Intentionally Unfrozen

Permanecem livres, desde que preservem esta SPEC, as ADRs e os contratos
upstream:

- nomes de classes, módulos, funções, tabelas e arquivos;
- tecnologia de banco, journal, outbox e mecanismo de lock/lease;
- mecanismo concreto de consulta de vagas do Codex CLI;
- valor e formato da configuração do teto conservador;
- algoritmo concreto de fairness e desempate, desde que determinístico e sem
  inanição;
- protocolo de eventos, replay e reconexão;
- formato de DTO, rota HTTP e adapter de processo;
- disponibilidade e representação do identificador nativo de sessão;
- detalhes de polling, timeout e backoff operacional;
- framework de testes e instrumentação, desde que prove os critérios binários.

Essas liberdades não autorizam reduzir segregação, ultrapassar capacidade,
usar fallback textual, criar segunda autoridade ou alterar falhas canônicas.

## 28. Open Questions

### Implementation-detail questions

- Como o provider detecta a versão do Codex CLI e a confiabilidade da
  capacidade?
- Qual representação persistida oferece exclusividade de lease compatível com
  o banco escolhido?
- Como o adapter captura término confirmado, checkpoint cooperativo e sessão
  nativa quando ela não fornece um identificador?
- Qual algoritmo de fairness fornece desempate determinístico com as métricas
  operacionais disponíveis?

### Architectural questions

Nenhuma. A autoridade de sessão, assignment, elegibilidade, capacidade, lease,
fila e scheduling está alocada pelo portfolio e pelas ADRs aceitas. Se uma
resposta às questões de implementação exigir novo owner, nova dependência ou
alteração de lifecycle, o trabalho deve parar com `PORTFOLIO_DECOMPOSITION_CHANGE_REQUIRED`
ou `ARCHITECTURAL_DECISION_REQUIRED`, sem resolver a questão nesta SPEC.

## 29. Definition of Done

- portfolio revision 2 é aprovado por auditoria independente;
- ADR-0004 e ADR-0005 estão aceitas e efetivas;
- `SPEC-DOM-001` e `SPEC-EXEC-001` são upstream conformantes;
- `O-022…O-031` estão todos representados por requisitos testáveis;
- nenhum contrato DOM/EXEC-001 é redefinido;
- identidade, assignment, ciclo, lease e authority limits estão explícitos;
- falhas owned e consumed possuem owners não ambíguos;
- capacidade desconhecida, fairness, retry, recovery boundary, DAG, filas e
  merge serial estão definidos;
- compatibilidade, replay e projeção não criam autoridade concorrente;
- toda requirement tem ADR, obrigação, critério e/ou teste rastreável;
- estado do repository e gaps conhecidos foram classificados;
- não há architecture gap ou portfolio ownership gap;
- nenhum Implementation Plan, ticket, código de produção, nova ADR ou Gap
  Matrix foi produzido por esta geração.

## 30. Mechanical Validation and Adversarial Review

| Métrica | Resultado |
|---|---:|
| `PORTFOLIO_OBLIGATIONS_OWNED` | 10 |
| `PORTFOLIO_OBLIGATIONS_COVERED` | 10 |
| `OWNED_OBLIGATIONS_UNCOVERED` | 0 |
| `NORMATIVE_REQUIREMENTS` | 19 |
| `REQUIREMENTS_WITHOUT_AUTHORITY` | 0 |
| `CONSUMED_CONTRACTS` | 6 contract groups |
| `CONSUMED_CONTRACTS_REDEFINED` | 0 |
| `FAILURES_OWNED` | 3 |
| `FAILURES_CONSUMED` | 9 |
| `AMBIGUOUS_FAILURE_OWNERS` | 0 |
| `NORMATIVE_DEPENDENCIES` | 2 |
| `NEW_UNAPPROVED_DEPENDENCIES` | 0 |
| `KNOWN_SPECIFICATION_GAPS` | 1 |
| `KNOWN_IMPLEMENTATION_GAPS` | 6 |
| `ARCHITECTURE_GAPS` | 0 |
| `PORTFOLIO_OWNERSHIP_GAPS` | 0 |
| `ACCEPTANCE_CRITERIA` | 20 |
| `CONFORMANCE_TESTS` | 27 |

Adversarial validation:

- Nenhum requisito define comportamento fora de `O-022…O-031`.
- Nenhum contrato upstream é redefinido; consumidores downstream não viram
  owners.
- Não foi adicionada dependência ao DAG aprovado.
- Backend, UI, OPS, Git, persistência, projection ou protótipo não viraram
  autoridade canônica.
- Falhas locais preservam códigos, triggers, retryability e terminalidade dos
  owners; `INVALID_DEPENDENCY_CLOSURE` continua DOM-owned.
- Não há caminho legacy concorrente, cutover ambíguo ou retirement exigido.
- Wording de fairness, provider, lease e recovery fixa invariantes observáveis,
  mas não congela classes, módulos, banco, algoritmo ou transporte.
- Todos os requisitos materiais possuem acceptance/conformance coverage.

Invariantes mecânicos:

```text
OWNED_OBLIGATIONS_UNCOVERED = 0
REQUIREMENTS_WITHOUT_AUTHORITY = 0
CONSUMED_CONTRACTS_REDEFINED = 0
AMBIGUOUS_FAILURE_OWNERS = 0
NEW_UNAPPROVED_DEPENDENCIES = 0
ARCHITECTURE_GAPS = 0
PORTFOLIO_OWNERSHIP_GAPS = 0
```

## 31. Gate

```text
COMPONENT_SPEC_GENERATION_COMPLETE
READY_FOR_SPEC_VALIDATION
```

O próximo passo é uma auditoria independente de conformance desta SPEC.
