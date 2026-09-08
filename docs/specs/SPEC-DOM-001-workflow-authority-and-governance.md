---
schema_version: "1.0.0"
id: SPEC-DOM-001
title: Workflow Authority and Governance
status: PROPOSED
revision: 2
date: 2026-09-08
spec_scope: domain
portfolio: SPEC-PORTFOLIO-001
portfolio_revision: 2
portfolio_verdict: PORTFOLIO_DECOMPOSITION_APPROVED
portfolio_audit: docs/specs/SPEC-PORTFOLIO-001-decomposition-audit.md
remediation_source_audit: docs/specs/audits/SPEC-DOM-001-component-conformance-audit.md
remediation_report: docs/specs/remediations/SPEC-DOM-001-component-spec-remediation.md
authoritative_adrs: [ADR-0001, ADR-0002, ADR-0009]
related_adrs: [ADR-0003, ADR-0007, ADR-0008, ADR-0010, ADR-0011, ADR-0013, ADR-0014]
upstream_dependencies: []
---

# SPEC-DOM-001 — Workflow Authority and Governance

## 1. Status

`PROPOSED` — primeira revisão materializada a partir do portfolio aprovado.

Generation baseline:

| Campo | Valor |
|---|---|
| Target component | `SPEC-DOM-001` |
| Portfolio | `SPEC-PORTFOLIO-001` |
| Portfolio revision | `2` |
| Portfolio audit | `SPEC-PORTFOLIO-001-decomposition-audit.md` |
| Portfolio verdict | `PORTFOLIO_DECOMPOSITION_APPROVED` |
| Repository HEAD | `d42a2dbe4d9e40dc7f139df920eb0a134c085aaf` |
| Existing target draft | não presente no filesystem atual; referências históricas tratadas como evidência |
| Gate | `READY_FOR_INDEPENDENT_COMPONENT_SPEC_REAUDIT` after this remediation |

Esta especificação não é aceita ainda. A aceitação depende de auditoria
independente da SPEC. A decomposição do portfolio não é redefinida aqui.

## 2. Ownership

### Owns

Este componente é o owner normativo de:

- identidade persistente e lineage dos agregados do workflow;
- entrada explícita de ADRs e artefatos governados;
- snapshot imutável de elegibilidade e base de execução;
- elegibilidade de ADRs aceitas e relação ADR↔SPEC;
- separação entre lifecycle decisório e lifecycle de realização;
- revisão, imutabilidade e sucessão de ADRs;
- ordenação canônica do pipeline;
- separação das máquinas de estado e derivação de estados superiores;
- pré-condições, rejeição e registro de comandos de domínio;
- estados e transições funcionais de tickets;
- vocabulário canônico de publicação;
- regras de avanço, pausa, cancelamento e independência entre ciclos;
- ciclos formais de auditoria, remediação e conformidade;
- veredictos estruturados, limites de rodadas e autorização de continuação;
- invalidação downstream e preservação da evidência de conformance.

Esses limites correspondem às obrigações `O-001…O-015` e `O-049…O-054`.

### Consumes

O DOM não possui dependência normativa upstream no DAG aprovado. Ele referencia
contratos de consumidores e de capacidades adjacentes somente para preservar
identidade, versão, persistência, publicação e projeção sem redefinir seus
owners. Em particular:

- `SPEC-EXEC-001` permanece owner da semântica de versões e capabilities;
- `SPEC-PLAT-001` permanece owner de journal, outbox, efeitos, idempotência,
  evidência e recovery;
- `SPEC-GIT-001` permanece owner da execução de integração e publicação;
- `SPEC-BACKEND-001`, `SPEC-OPS-001` e `SPEC-UI-001` somente transportam,
  observam ou projetam contratos DOM.

Essas relações de consumo não criam edges upstream para `SPEC-DOM-001`.

### Does not own

Este componente não possui:

- envelopes JSON Schema, registry de skills ou semântica de capabilities;
- sessões Codex, assignments, elegibilidade de agentes, leases ou scheduler;
- banco, journal, outbox, efeitos externos, idempotência ou recovery físico;
- configuração de repositório, bootstrap, migração ou habilitação;
- branches, worktrees, waves, commits, checks, PRs, push ou confirmação remota;
- API, transporte, autenticação local, armazenamento de segredos ou e-mail;
- retenção, backup, exportação ou telemetria operacional;
- navegação, interação ou apresentação de frontend;
- definição de rotas, classes, módulos, tabelas, protocolos ou bibliotecas.

Nenhum consumidor pode redefinir as semânticas owned nesta seção.

## 3. Portfolio Authority

Esta especificação materializa ownership já atribuído pelo portfolio aprovado e
não redefine fronteiras do portfolio.

| Evidência | Uso |
|---|---|
| `docs/specs/SPEC-PORTFOLIO-001-organization.md` | decomposição, registry de obrigações, owners, consumers, falhas, compatibilidade e DAG |
| `docs/specs/SPEC-PORTFOLIO-001-decomposition-audit.md` | aprovação independente mais recente e verdict `PORTFOLIO_DECOMPOSITION_APPROVED` |
| `docs/specs/SPEC-PORTFOLIO-001-decomposition-remediation.md` | evidência histórica de remediação; não é autoridade de aprovação |

O registry do portfolio é a fonte canônica da alocação. Os consumidores listados
no registry são não-autoritários.

## 4. ADR Authority

### Primary accepted ADRs

| ADR | Revisão | Seções usadas | Consequência local |
|---|---:|---|---|
| `ADR-0001` | 3 | Decisão, Invariantes | identidade, snapshot, elegibilidade, lineage, revisão e imutabilidade |
| `ADR-0002` | 3 | Decisão, Transições funcionais, Vocabulário, Regras de avanço | pipeline, state machines, tickets, publicação e avanço |
| `ADR-0009` | 3 | Decisão | ciclos formais, veredictos, rodadas, invalidação downstream e conformance |

Todas as ADRs primárias estão `decision_status: ACCEPTED` e
`implementation_status: UNPROCESSED`. ADRs relacionadas não ampliam o
ownership deste componente.

## 5. Problem Statement

As ADRs exigem um domínio com identidades persistentes, snapshots imutáveis,
state machines separadas, comandos fail-closed, avanço condicionado a
veredictos e ciclos formais de auditoria. O repository atual contém essas
decisões no conjunto de ADRs e um protótipo React que simula parte do fluxo,
mas não contém implementação produtiva do domínio ou persistência canônica.

Sem esta fronteira, backend, frontend, scheduler, Git e relatórios poderiam
fabricar estados, aprovações ou publicação. A capacidade resultante desta SPEC
é um contrato de autoridade verificável: consumidores podem solicitar,
transportar e projetar decisões, mas somente o domínio pode determinar
identidade, transição, veredito, terminalidade e invalidação.

## 6. Goals

- Cada agregado normativo possui identidade estável e lineage verificável.
- Uma execução somente incorpora ADRs aceitas no snapshot inicial e conserva a
  base, configuração e versões aplicáveis.
- O pipeline segue a ordem canônica e cada agregado mantém lifecycle próprio.
- Comandos inválidos são rejeitados, registrados e não alteram estado
  canônico.
- Tickets usam estados funcionais e transições normativas completas, sem
  reabertura de estados terminais.
- Nenhuma etapa avança sem veredito formal; ciclos independentes podem avançar
  independentemente quando seus próprios contratos estiverem satisfeitos.
- Cada ciclo de auditoria termina por veredito estruturado, nunca por
  remediação ou ausência de findings.
- Mudança normativa invalida aprovações downstream afetadas sem reabrir tickets
  concluídos.
- Publicação só atinge conclusão canônica após o vocabulário e os gates
  definidos pelas ADRs, inclusive confirmação remota.

## 7. Non-Goals

- Implementar o runtime, banco, API, scheduler, adapters ou frontend.
- Criar Gap Matrix, Plano de Implementação ou tickets.
- Definir classes, pastas, tabelas, endpoints, protocolos ou bibliotecas.
- Redefinir contratos owned por `SPEC-EXEC-001`, `SPEC-PLAT-001`,
  `SPEC-REPO-001`, `SPEC-GIT-001`, `SPEC-BACKEND-001`, `SPEC-OPS-001` ou
  `SPEC-UI-001`.
- Tornar relatório, fixture, protótipo, transporte ou projeção uma autoridade.
- Escolher tecnologia de persistência, token, eventos ou integração externa.

## 8. Current Repository State

| Área | Current behavior | Target behavior | Classification |
|---|---|---|---|
| ADR authority | ADR-0001…ADR-0014 estão aceitas, revisão 3, não implementadas | autoridade identificável e elegível por snapshot | `ALREADY_CONFORMANT` como evidência documental |
| Portfolio | revisão 2 proposta, com audit independente aprovado | ownership e DAG usados como baseline | `ALREADY_CONFORMANT` para Gate A |
| Domínio produtivo | nenhum runtime de domínio/persistência canônica está presente | agregados, comandos, transições e veredictos observáveis | `IMPLEMENTATION_GAP` |
| `prototype/src/mockDomain.ts` | simula IDs, snapshots, comandos, estados, journal, publicação e cenários | comportamento produtivo independente do mock | `PROTOTYPE_ONLY` |
| `prototype/tests/*` | cobre probes do mock e da UI | conformance independente contra implementação real | `PROTOTYPE_ONLY` |
| SPEC componente | este arquivo é a primeira materialização atual | SPEC auditável e rastreável; reauditoria independente pendente | `SPECIFICATION_GAP` |
| Persistência/recovery | simulação em memória; nenhuma prova de durabilidade | consumo de contratos PLAT sem redefinição | `IMPLEMENTATION_GAP` |
| API/UI/integrações | não há implementação produtiva neste repository | consumidores mapeiam semânticas DOM | `IMPLEMENTATION_GAP` |

O protótipo informa cenários e vocabulário observável, mas não altera
ownership, autoridade ADR ou dependências.

## 9. Owned Architectural Obligations

| ID | ADR / seção | Tratamento nesta SPEC | Requisito |
|---|---|---|---|
| O-001 | ADR-0001 / Decisão | catálogo de identidades persistentes e lineage | DOM-ID-001 |
| O-002 | ADR-0001 / Invariantes | entrada manual explícita dos artefatos governados | DOM-INGEST-001 |
| O-003 | ADR-0001 / Decisão | snapshot imutável de elegibilidade, hashes, base, configuração e versões | DOM-SNAPSHOT-001 |
| O-004 | ADR-0001 / Invariantes | somente ADRs `ACCEPTED` são elegíveis | DOM-ELIG-001 |
| O-005 | ADR-0001 / Decisão | relação ADR↔SPEC explícita, muitos-para-muitos e independente | DOM-LINEAGE-001 |
| O-006 | ADR-0001 / Invariantes | lifecycle decisório separado do lifecycle de realização | DOM-LIFE-001 |
| O-007 | ADR-0001 / Invariantes | remediação de ADR aceita não implementada incrementa revisão | DOM-REV-001 |
| O-008 | ADR-0001 / Invariantes | ADR implementada imutável, sucessão e front matter padronizados | DOM-IMMUT-001 |
| O-009 | ADR-0002 / Decisão | ordenação canônica do pipeline | DOM-PIPE-001 |
| O-010 | ADR-0002 / Decisão | state machines separadas e estados superiores derivados quando possível | DOM-STATE-001 |
| O-011 | ADR-0002 / Regras | pré-condições, rejeição e registro de transições inválidas | DOM-CMD-001 |
| O-012 | ADR-0002 / Transições | estados funcionais de ticket e terminalidade | DOM-TICKET-001 |
| O-013 | ADR-0002 / Transições | tabela completa de transições funcionais de tickets | DOM-TICKET-002 |
| O-014 | ADR-0002 / Vocabulário | candidato, aprovação, integração e confirmação remota distintos | DOM-PUB-001 |
| O-015 | ADR-0002 / Regras | nenhum avanço sem veredito e progressos independentes | DOM-ADV-001 |
| O-049 | ADR-0009 / Decisão | ciclos formais cobrem os artefatos governados | DOM-AUDIT-001 |
| O-050 | ADR-0009 / Decisão | veredito estruturado encerra ciclo; remediação nunca aprova | DOM-AUDIT-002 |
| O-051 | ADR-0009 / Decisão | limite de dez rodadas e autorização de continuação | DOM-AUDIT-003 |
| O-052 | ADR-0009 / Decisão | conformance final cobre aderência, cobertura, integração e regressões | DOM-AUDIT-004 |
| O-053 | ADR-0009 / Decisão | mudança normativa invalida downstream e cria ajuste sem reabrir concluídos | DOM-AUDIT-005 |
| O-054 | ADR-0009 / Decisão | base exata e evidência hash-linked antes da publicação | DOM-AUDIT-006 |

Resultado: 21 obrigações próprias, todas cobertas por requisitos, invariantes,
falhas, critérios ou testes abaixo.

## 10. Consumed Contracts

Não há SPEC componente upstream no DAG de `SPEC-DOM-001`; portanto não há
dependência normativa blocking a consumir nesta geração. Os seguintes contratos
são referências não-autoritárias que os futuros consumidores devem respeitar:

| Owner SPEC | Contrato / requisito | Por que relacionado | Regra local |
|---|---|---|---|
| `SPEC-EXEC-001` | versões e capabilities (`O-016`, `O-018`, `O-020`) | snapshot registra versões sem possuir registry | armazenar referência; não validar ou redefinir semântica de capability |
| `SPEC-PLAT-001` | journal, outbox, intenção, evidência e recovery (`O-032…O-038`) | lifecycle DOM precisa de durable evidence | exigir evidência/estado confirmado; não definir mecanismo de persistência |
| `SPEC-GIT-001` | integração e publicação (`O-039…O-048`) | DOM fornece vocabulário e gates | consumir estados canônicos; não executar Git nem redefinir confirmação |
| `SPEC-BACKEND-001` | mapping application/transport (`O-060…O-068`) | expõe comandos e eventos a consumidores | preservar precondição, trigger, terminalidade e failure code |
| `SPEC-OPS-001` | projeção operacional (`O-069…O-072`) | auditoria e operação precisam de correlação | tratar relatório como projeção/record hash-linked |
| `SPEC-UI-001` | interação e projeção (`O-073…O-078`) | apresenta estados e solicita comandos | nunca confirmar ou fabricar estado |

Estas linhas não transferem ownership nem introduzem dependência DOM→consumer.
`CONSUMED_CONTRACTS_REDEFINED = 0`.

## 11. Target Behavioral Model

```text
ADRs/artefatos explicitamente submetidos
    ↓
identidade + elegibilidade + snapshot imutável
    ↓
agregado e ciclo apropriados
    ↓ comando com pré-condições
accepted transition ou rejected transition registrada
    ↓ veredito formal quando a etapa exigir
avanço independente / pausa / cancelamento / invalidação downstream
    ↓
vocabulário canônico de publicação e evidência hash-linked
```

O DOM define a decisão e o estado canônico. PLAT persiste e reconcilia efeitos;
GIT executa publicação; BACKEND transporta; OPS e UI projetam.

## 12. Identity and Authority Rules

| Identidade | Canonical owner | Reference identity | Local correlation | Derived projection |
|---|---|---|---|---|
| `RepositoryId` | DOM | alvo da execução | correlationId | nome/branch exibidos |
| `ExecutionId` | DOM | execução de um repositório | request/event correlation | status agregado |
| `ADRId` + revisão | DOM | decisão elegível | snapshot correlation | título/status |
| `SPECId` + revisão | DOM | artefato normativo | cycle correlation | progresso |
| `ArtifactId` | DOM | evidência/resultado | event correlation | item de ledger |
| `ArtifactCycleId` | DOM | ciclo de auditoria | audit correlation | rodada exibida |
| `StageId` | DOM | etapa do pipeline | activity correlation | estado superior |
| `ActivityId` / `AttemptId` | DOM | unidade e tentativa | session correlation | atividade operacional |
| `TicketId` | DOM | unidade de implementação | branch/worktree correlation | estado funcional |
| `WaveId` | DOM | conjunto de integração | integration correlation | progresso da onda |
| `AgentId` | DOM | agente lógico atribuído; assignment/sessão permanecem contratos de EXEC | assignment/session correlation | nome/estado exibidos |
| `ExternalEffectId` | DOM | efeito externo associado à intenção; PLAT persiste e reconcilia | request/effect correlation | evidência operacional |
| `PublicationId` / candidate | DOM | candidato de publicação; GIT executa e confirma publicação | provider/candidate correlation | estado de publicação |

Labels, títulos, rotas e nomes de tela são derivados. Não substituem IDs
canônicos. Hashes operacionais e evidências externas são relacionados por
identidade e conteúdo, sem inserir metadados operacionais no documento ADR.
DOM é o owner da identidade canônica dos agregados, inclusive agente atribuído,
efeito externo e publicação; EXEC, PLAT e GIT continuam owners de assignment e
sessão, persistência/reconciliação e execução/confirmação, respectivamente.

## 13. Normative Requirements

### DOM-ID-001 — Identidade persistente

Para cada agregado normativo, incluindo agente atribuído, efeito externo e
publicação, o sistema deve atribuir uma identidade persistente estável,
registrar criação, unicidade, imutabilidade, escopo, revisão/lineage e
resolução histórica quando aplicável, e rejeitar referências que não resolvam
para uma identidade e revisão válidas. `AgentId` deve permanecer distinto de
assignment, atividade e sessão; `ExternalEffectId` e `PublicationId` devem
permanecer distintos de seus mecanismos de persistência, execução ou
confirmação. A identidade não pode ser inferida apenas pela existência ou pelo
nome de um arquivo.

Authority: `O-001`, `ADR-0001`, `Decisão`.

### DOM-INGEST-001 — Entrada manual explícita

O início do processamento deve resultar de uma entrada manual explícita dos
artefatos e decisões governados. A descoberta de arquivos, ausência de SPEC ou
estado de uma sessão não pode, por si só, iniciar processamento ou escolher
ADRs.

Authority: `O-002`, `ADR-0001`, `Invariantes`.

### DOM-SNAPSHOT-001 — Snapshot imutável de execução

Antes de uma execução, deve existir um snapshot imutável contendo as ADRs
elegíveis e seus hashes, a base de commit, configuração e versões exatas de
skills/contratos aplicáveis. O snapshot usado por uma execução não pode ser
alterado para incorporar ADR aceita posteriormente ou uma base/configuração
divergente.

Authority: `O-003`, `ADR-0001`, `Decisão`.

### DOM-ELIG-001 — Elegibilidade de ADR

Somente ADRs com lifecycle decisório `ACCEPTED` podem entrar na elegibilidade
do snapshot. ADR `PROPOSED`, `REJECTED`, `SUPERSEDED`, desconhecida ou com
revisão inelegível deve falhar fechada e não pode ser tratada como autoridade
por fallback.

Authority: `O-004`, `ADR-0001`, `Invariantes`.

### DOM-LINEAGE-001 — Relação ADR↔SPEC

Cada relação entre ADR e SPEC deve ser explícita, verificável e capaz de
representar muitos-para-muitos. O progresso de uma SPEC não pode ser usado para
encerrar ou alterar silenciosamente outra SPEC, ADR ou revisão relacionada.

Authority: `O-005`, `ADR-0001`, `Decisão`.

### DOM-LIFE-001 — Lifecycles separados

O lifecycle decisório (`PROPOSED`, `ACCEPTED`, `SUPERSEDED`, `REJECTED`) deve
permanecer separado do lifecycle de realização (`UNPROCESSED`, `PROCESSING`,
`IMPLEMENTED`). Aceitação decisória não pode ser interpretada como
implementação, e execução não pode alterar o lifecycle decisório sem a
transição autorizada correspondente.

Authority: `O-006`, `ADR-0001`, `Invariantes`.

### DOM-REV-001 — Revisão por remediação

Uma ADR `ACCEPTED` e ainda não implementada que seja remediada deve receber uma
nova revisão preservando seu histórico e relações de lineage. A revisão nova
deve invalidar a elegibilidade derivada de conteúdo anterior quando o conteúdo
normativo mudar.

Authority: `O-007`, `ADR-0001`, `Invariantes`.

### DOM-IMMUT-001 — Imutabilidade e sucessão

Uma ADR `IMPLEMENTED` não pode ser reescrita ou processada novamente após
mutação silenciosa. Alteração normativa exige nova ADR com `supersedes` /
`superseded_by` recíprocos; front matter normativo permanece padronizado e
`adr_content_hash`, `implementation_commit_sha`, `implemented_at` e evidência
operacional permanecem no registro persistente, não no documento ADR.

Authority: `O-008`, `ADR-0001`, `Invariantes` e `Decisão`.

### DOM-PIPE-001 — Ordenação do pipeline

O pipeline canônico deve respeitar, em ordem: ADRs aceitas → SPECs → auditoria
da SPEC → Gap Matrix → Plano → tickets → implementação/auditoria → integração
e conformance → atualização com a principal → aprovação/publicação. Uma etapa
não pode declarar concluída uma etapa posterior, e um consumidor não pode
reordenar fases por conveniência de transporte.

Authority: `O-009`, `ADR-0002`, `Decisão`.

### DOM-STATE-001 — State machines separadas

Execução, SPEC, etapa, atividade, ciclo auditável, onda, ticket, migração e
publicação devem possuir máquinas de estado separadas. Estados superiores devem
ser derivados dos inferiores quando essa derivação for possível; uma projeção
ou transporte não pode criar uma segunda máquina canônica ou combinar estados
de agregados diferentes em uma transição implícita.

Authority: `O-010`, `ADR-0002`, `Decisão`.

### DOM-CMD-001 — Pré-condições e rejeição

Todo comando de domínio deve validar suas pré-condições contra a identidade,
revisão e estado canônicos. Comando inválido, base obsoleta, dependência
fechada ou veredito incompatível deve ser rejeitado, registrado com a razão
canônica e não deve alterar estado ou produzir efeito. BACKEND e UI podem mapear
essa rejeição, mas não alterar seu significado.

Authority: `O-011`, `ADR-0002`, `Regras`.

### DOM-TICKET-001 — Estados funcionais de ticket

Os únicos estados funcionais normativos de ticket são `DRAFT`, `READY`,
`IMPLEMENTED`, `COMPLETED`, `BLOCKED` e `CANCELLED`. Fila, execução, auditoria,
remediação, pausa e falha são estados operacionais e não podem ser promovidos
a estados funcionais por observação de processo.

`COMPLETED` e `CANCELLED` são terminais; retomada após cancelamento exige novo
ticket vinculado.

Authority: `O-012`, `ADR-0002`, `Transições funcionais normativas`.

### DOM-TICKET-002 — Transições funcionais completas

As transições válidas de ticket são exatamente:

| Origem | Destino | Condição |
|---|---|---|
| `DRAFT` | `READY` | documentação aprovada e nenhuma dependência pendente |
| `DRAFT` | `BLOCKED` | documentação aprovada e dependência pendente |
| `DRAFT` | `CANCELLED` | cancelamento funcional explícito e auditado |
| `BLOCKED` | `READY` | finalização comprova remoção do último bloqueio |
| `BLOCKED` | `CANCELLED` | cancelamento funcional explícito e auditado |
| `READY` | `IMPLEMENTED` | implementação possui veredito formal e commit aprovado |
| `READY` | `CANCELLED` | cancelamento funcional explícito e auditado |
| `IMPLEMENTED` | `COMPLETED` | onda integrada/auditada e finalização concluída |

Qualquer outra transição deve ser rejeitada e registrada. Tickets concluídos
não são reabertos; ajuste ou substituição usa novo ticket.

Authority: `O-013`, `ADR-0002`, `Transições funcionais normativas dos tickets`.

### DOM-PUB-001 — Vocabulário de publicação

O domínio deve distinguir `PUBLICATION_CANDIDATE_READY`,
`AWAITING_PUBLICATION_APPROVAL`, `LOCAL_INTEGRATION_PENDING`,
`LOCAL_INTEGRATION_COMPLETE`, `PR_OPEN`, `AWAITING_PR_MERGE`, `PR_MERGED` e
`REMOTE_PUBLICATION_CONFIRMED`. `PR_MERGED` não equivale a publicação remota
confirmada. A implementação de push, PR, merge e confirmação permanece em
`SPEC-GIT-001`.

Authority: `O-014`, `ADR-0002`, `Vocabulário normativo de publicação`.

### DOM-ADV-001 — Avanço e progressos independentes

Nenhuma etapa auditável pode avançar sem veredito formal. Progresso de SPEC,
DAG, rodada, pausa e cancelamento são contratos independentes: uma SPEC não
deve esperar outra SPEC independente, uma onda só integra tickets aprovados e
cancelamento operacional é cooperativo, em cascata, preserva estados funcionais
e não reverte efeitos remotos.

Authority: `O-015`, `ADR-0002`, `Regras de avanço`.

### DOM-AUDIT-001 — Ciclos formais

SPECs, Gap Matrices, Planos, tickets, implementações, integrações, migrações e
conformance devem possuir ciclos formais de auditoria/remediação com identidade
de artefato, ciclo e rodada. Um ciclo deve cobrir o artefato apropriado sem
reutilizar implicitamente o ciclo de outro artefato.

Authority: `O-049`, `ADR-0009`, `Decisão`.

### DOM-AUDIT-002 — Veredito estruturado

Somente um veredito estruturado de auditoria pode encerrar um ciclo. Remediação,
ausência de findings textuais ou término de processo nunca equivalem a
aprovação. O veredito deve identificar o artefato, revisão, ciclo, rodada e
resultado aplicável.

Authority: `O-050`, `ADR-0009`, `Decisão`.

### DOM-AUDIT-003 — Limite de rodadas

O limite inicial de um ciclo é dez rodadas, configurável por contrato. Ao
atingir o limite, somente a unidade afetada deve pausar e exigir autorização
explícita para continuar; o limite não pode ser contornado criando uma
aprovação implícita ou reutilizando evidência de outra unidade.

Authority: `O-051`, `ADR-0009`, `Decisão`.

### DOM-AUDIT-004 — Conformance final

Após os tickets concluídos, conformance final deve verificar aderência,
cobertura, integração, regressões, testes, omissões e extrapolações. Findings
de implementação retornam para remediação e nova auditoria; ausência de
findings não dispensa as verificações de cobertura e integração.

Authority: `O-052`, `ADR-0009`, `Decisão`.

### DOM-AUDIT-005 — Invalidação downstream

Se conformance exigir mudança normativa, a SPEC deve retornar à primeira etapa
documental afetada e as aprovações downstream dependentes devem ser marcadas
obsoletas, preservando sua história. Tickets `COMPLETED` não são reabertos;
novos tickets de ajuste ou substituição são criados e ligados à causa.

Authority: `O-053`, `ADR-0009`, `Decisão`.

### DOM-AUDIT-006 — Base exata e evidência

Antes da publicação, a branch da SPEC deve incorporar a principal e toda a
conformance deve ser repetida contra o commit candidato exato. No fluxo por PR,
o veredito deve vincular SHA da base, SHA da head e árvore candidata; mudança
em qualquer um invalida a autorização de merge. Relatórios, findings e
evidências externas devem permanecer ligados por hash ao conteúdo/commit
auditado.

Authority: `O-054`, `ADR-0009`, `Decisão`.

## 14. Commands / Queries / Events

### Canonical domain commands

O domínio autoriza apenas comandos semanticamente delimitados por aggregate:

- submeter artefatos/ADRs para processamento;
- criar/validar snapshot;
- iniciar ou avançar uma etapa quando suas pré-condições estiverem satisfeitas;
- solicitar pausa, retomada ou cancelamento cooperativo;
- registrar decisão de auditoria, remediação, reauditoria ou rodada adicional;
- registrar aprovação, invalidação ou confirmação de uma transição de publicação
  recebida do owner de publicação.

Nomes de transporte e envelopes permanecem livres. O comando transportado deve
preservar `aggregate identity`, `revision`, `correlation`, pré-condições e
resultado `requested`/`accepted`/`rejected`/`confirmed` quando aplicável.

### Events

Eventos de domínio pertencem ao lifecycle que os produz. No escopo DOM estão
eventos de snapshot, elegibilidade, transição funcional, veredito, invalidação
downstream e mudança de estado canônico. BACKEND pode emitir evento de
transporte e OPS/UI podem projetá-lo, sem torná-lo autoridade.

### Queries

Queries podem retornar snapshots, lineage, estado funcional, vereditos e
evidências relacionadas. Uma query não pode executar transição, aprovar efeito,
alterar snapshot ou criar identidade canônica.

## 15. Failure Semantics

O DOM é owner semântico de três famílias e cinco códigos canônicos:

| Família | Códigos | Trigger e significado | Recovery owner |
|---|---|---|---|
| SPEC/revision | `UNKNOWN_SPEC`, `INELIGIBLE_REVISION` | identidade/revisão não resolvida ou inelegível | DOM |
| Dependency closure | `INVALID_DEPENDENCY_CLOSURE` | avanço solicitado sem fechamento válido do DAG | DOM |
| Command basis | `INVALID_COMMAND_BASIS`, `STALE_REVISION` | pré-condição inválida ou comando baseado em revisão obsoleta | DOM |

Essas falhas são canônicas, fail-closed e não produzem transição ou efeito
parcial. BACKEND pode mapear para transporte, OPS registrar observabilidade e
UI apresentar mensagem; nenhuma dessas camadas pode renomear a família,
transformá-la em sucesso ou substituí-la por erro canônico de outro owner.

Falhas de repository, capability, contrato, capacity, efeito, publicação e
sessão local são consumidas dos owners `SPEC-REPO-001`, `SPEC-EXEC-001`,
`SPEC-EXEC-002`, `SPEC-PLAT-001`, `SPEC-GIT-001` e `SPEC-BACKEND-001`.

## 16. Retry / Idempotency / Recovery

O DOM define somente a semântica de repetição de ciclos e comandos de domínio:

- comando rejeitado não é implicitamente repetido;
- nova rodada exige autorização quando o limite foi atingido;
- cancelamento não é convertido em retomada;
- mudança normativa inicia novo ciclo documental e invalida downstream afetado.

Idempotência de efeitos, retry de adapter, checkpoints físicos, replay de
journal e reconciliação são contratos de `SPEC-PLAT-001`, `SPEC-EXEC-002` ou
`SPEC-GIT-001`. Um retry local não pode criar nova transição canônica sem
pré-condição válida nem duplicar efeito externo.

## 17. Compatibility / Cutover

| Classe | Papel DOM | Regra |
|---|---|---|
| `NEW_CANONICAL_PATH` | `OWNER` (`O-003`, `O-005`) | novos snapshots, lineage e lifecycle usam o contrato canônico |
| `LEGACY_COMPATIBILITY` | `CONSUMER` de `SPEC-REPO-001` | adaptação legada não cria segunda autoridade DOM |
| `HISTORICAL_REPLAY` | `OWNER` (`O-003`, `O-054`) | histórico e evidência são preservados e reprodutíveis por identidade/hash |
| `CUTOVER` | `OWNER` (`O-053`) | mudança normativa invalida aprovações downstream afetadas e reinicia a etapa documental apropriada |
| `RETIREMENT` | `NOT_APPLICABLE` | retirada de adapters/dados legados pertence ao owner de compatibilidade |

O caminho legado é adapter e não fonte canônica. Nenhuma fase de implementação
ou plano de migração é definido nesta SPEC.

## 18. Projection Boundaries

| Fonte canônica | Projeção | Replay/stale behavior | Limite de autoridade |
|---|---|---|---|
| DOM aggregate/state | snapshot de backend | replay deve preservar identidade, revisão e veredito; stale não pode comandar | snapshot não altera domínio |
| DOM verdict/lineage | relatório de auditoria/OPS | evidência é hash-linked; relatório stale é histórico | relatório não aprova |
| DOM state/events | UI operacional | UI mostra `requested`, `accepted/rejected` e confirmado; stale exige refresh | UI não confirma |
| GIT publication state | estado de publicação consumido | PR/remote evidence são projetados | DOM não executa Git |

Uma projeção pode ser completa para seu consumidor, mas nunca é fonte de
identidade, estado, elegibilidade, aprovação ou publicação.

## 19. External Effects

O DOM define a semântica de decisão e os gates; não executa efeitos externos.

| Semântica | Owner |
|---|---|
| `REQUEST` / comando de domínio | DOM |
| `INTENT` persistida para efeito | PLAT |
| `EXTERNAL_EXECUTION` | adapter owner, especialmente GIT |
| `EVIDENCE` / `CONFIRMATION` | PLAT/GIT conforme o efeito |
| `RECONCILIATION` | PLAT |
| `PROJECTION` | BACKEND/OPS/UI |

`REMOTE_PUBLICATION_CONFIRMED` é condição canônica de conclusão de publicação;
DOM reconhece o contrato, enquanto GIT produz a evidência.

## 20. Security / Authorization

Este componente não possui autenticação ou armazenamento de segredo. Ele
somente exige que decisões de domínio e aprovação humana estejam representadas
por identidade, ator, revisão e evidência auditável. Autenticação localhost,
token, autorização de usuário único e proteção de credenciais pertencem a
`SPEC-BACKEND-001` / ADR-0012. UI não pode elevar sua apresentação a
autorização canônica.

## 21. Conformance Suite

### Positive

C-01. criar um snapshot com ADRs aceitas, hashes, base e versões;
C-02. resolver lineage muitos-para-muitos sem alterar outra SPEC;
C-03. avançar ticket por cada transição válida da tabela;
C-04. encerrar ciclo com veredito estruturado;
C-05. preservar histórico ao criar revisão/sucessor;
C-06. reconhecer publicação somente após confirmação remota.

### Negative

C-07. rejeitar ADR não aceita ou revisão desconhecida;
C-08. rejeitar snapshot/base/configuração divergente;
C-09. rejeitar toda transição de ticket fora da tabela;
C-10. rejeitar avanço sem veredito formal;
C-11. rejeitar remediação como aprovação;
C-12. rejeitar continuação após dez rodadas sem autorização;
C-13. invalidar downstream após mudança normativa;
C-14. rejeitar `PR_MERGED` como equivalente a `REMOTE_PUBLICATION_CONFIRMED`.

### Boundary isolation

- C-15: backend não cria transição alternativa;
- C-16: UI não confirma efeito, lease, aprovação ou publicação;
- C-17: relatório OPS não vira estado canônico;
- C-18: Git não modifica estados funcionais de ticket fora dos contratos DOM;
- C-19: protótipo não é aceito como prova de persistência, concorrência ou integração;
- C-20: um consumidor não exige que uma SPEC downstream defina autoridade DOM.

### Dependency conformance

Consumidores devem provar que usam IDs, estados, falhas e veredictos DOM sem
redefini-los. A ausência de dependência upstream DOM deve permanecer acíclica.
Esse teste é `C-21`.

### Compatibility and recovery

Conformance deve provar preservação histórica, invalidação por revisão, replay
de evidência hash-linked e que retry/recovery externo não altera semântica
canônica (`C-22`).

### Synthetic extensibility

Uma SPEC sintética com capabilities registradas deve atravessar o lifecycle sem
novo enum, branch específico, reviewer dedicado, página específica ou fallback
silencioso no domínio (`C-23`).

`C-24` resolve `AgentId`, `ExternalEffectId` e `PublicationId` com DOM como
owner canônico, preservando as relações com assignment/sessão, persistência,
execução, confirmação e histórico sem alias ou transferência de autoridade.

## 22. Acceptance Criteria

| ID | Critério binário |
|---|---|
| AC-DOM-001 | Cada agregado testado, incluindo agente atribuído, efeito externo e publicação, recebe ID persistente resolvível; criação, unicidade, imutabilidade, lineage e resolução histórica são preservadas; nome de arquivo sozinho não satisfaz a verificação. |
| AC-DOM-002 | Nenhum processamento começa por descoberta automática sem comando manual explícito. |
| AC-DOM-003 | O snapshot conserva ADR hashes, base, configuração e versões e rejeita mutação posterior. |
| AC-DOM-004 | ADR não `ACCEPTED` ou revisão inelegível é recusada sem transição ou fallback. |
| AC-DOM-005 | Relações ADR↔SPEC múltiplas e progresso independente permanecem verificáveis. |
| AC-DOM-006 | Lifecycle decisório e de realização podem ser exercitados separadamente. |
| AC-DOM-007 | Remediação de ADR aceita não implementada produz nova revisão e histórico preservado. |
| AC-DOM-008 | Mutação de ADR implementada é bloqueada e sucessão exige nova ADR; hash operacional não é inserido no documento. |
| AC-DOM-009 | Um cenário que tente pular fase do pipeline é rejeitado. |
| AC-DOM-010 | Uma tentativa de combinar máquinas de agregados ou fabricar estado superior é rejeitada. |
| AC-DOM-011 | Comando com pré-condição inválida retorna rejeição registrada e estado inalterado. |
| AC-DOM-012 | Somente os seis estados funcionais de ticket são aceitos e terminais não reabrem. |
| AC-DOM-013 | As oito transições funcionais válidas são aceitas e qualquer outra é recusada. |
| AC-DOM-014 | `PR_MERGED` e `REMOTE_PUBLICATION_CONFIRMED` são observados como estados distintos. |
| AC-DOM-015 | Avanço sem veredito, dependência fechada ou cancelamento não cooperativo é recusado. |
| AC-DOM-049 | Cada artefato governado possui ciclo e rodada identificáveis. |
| AC-DOM-050 | Somente veredito estruturado encerra ciclo; remediação isolada não aprova. |
| AC-DOM-051 | A 10ª rodada pausa a unidade e exige autorização explícita para a seguinte. |
| AC-DOM-052 | Conformance final verifica cobertura, integração, regressão, testes, omissões e extrapolações. |
| AC-DOM-053 | Mudança normativa torna downstream afetado obsoleto e cria ajuste sem reabrir ticket concluído. |
| AC-DOM-054 | Qualquer drift de base/head/tree invalida autorização antes da publicação e a evidência permanece hash-linked. |

## 23. ADR / Obligation / Requirement Traceability

| Requirement | Portfolio obligation | ADR | ADR section | Ownership role | Acceptance / test |
|---|---|---|---|---|---|
| DOM-ID-001 | O-001 | ADR-0001 | Decisão | canonical owner | AC-DOM-001; C-01; C-24 |
| DOM-INGEST-001 | O-002 | ADR-0001 | Invariantes | canonical owner | AC-DOM-002 |
| DOM-SNAPSHOT-001 | O-003 | ADR-0001 | Decisão | canonical owner | AC-DOM-003; C-08 |
| DOM-ELIG-001 | O-004 | ADR-0001 | Invariantes | canonical owner | AC-DOM-004; C-07 |
| DOM-LINEAGE-001 | O-005 | ADR-0001 | Decisão | canonical owner | AC-DOM-005; C-02 |
| DOM-LIFE-001 | O-006 | ADR-0001 | Invariantes | canonical owner | AC-DOM-006 |
| DOM-REV-001 | O-007 | ADR-0001 | Invariantes | canonical owner | AC-DOM-007; C-05 |
| DOM-IMMUT-001 | O-008 | ADR-0001 | Decisão/Invariantes | canonical owner | AC-DOM-008 |
| DOM-PIPE-001 | O-009 | ADR-0002 | Decisão | canonical owner | AC-DOM-009 |
| DOM-STATE-001 | O-010 | ADR-0002 | Decisão | canonical owner | AC-DOM-010 |
| DOM-CMD-001 | O-011 | ADR-0002 | Regras | canonical owner | AC-DOM-011 |
| DOM-TICKET-001 | O-012 | ADR-0002 | Transições | canonical owner | AC-DOM-012 |
| DOM-TICKET-002 | O-013 | ADR-0002 | Transições funcionais normativas | canonical owner | AC-DOM-013; C-03; C-09 |
| DOM-PUB-001 | O-014 | ADR-0002 | Vocabulário normativo de publicação | canonical owner | AC-DOM-014; C-14 |
| DOM-ADV-001 | O-015 | ADR-0002 | Regras de avanço | canonical owner | AC-DOM-015; C-10 |
| DOM-AUDIT-001 | O-049 | ADR-0009 | Decisão | canonical owner | AC-DOM-049 |
| DOM-AUDIT-002 | O-050 | ADR-0009 | Decisão | canonical owner | AC-DOM-050; C-11 |
| DOM-AUDIT-003 | O-051 | ADR-0009 | Decisão | canonical owner | AC-DOM-051; C-12 |
| DOM-AUDIT-004 | O-052 | ADR-0009 | Decisão | canonical owner | AC-DOM-052 |
| DOM-AUDIT-005 | O-053 | ADR-0009 | Decisão | canonical owner | AC-DOM-053; C-13 |
| DOM-AUDIT-006 | O-054 | ADR-0009 | Decisão | canonical owner | AC-DOM-054 |

`REQUIREMENTS_WITHOUT_PORTFOLIO_OBLIGATION = 0` e
`OWNED_OBLIGATIONS_WITHOUT_REQUIREMENT = 0`.

## 24. Known Gap Summary

Este resumo registra divergência observada; não é a Gap Matrix formal.

| Gap subject | Classification | Related requirement | Evidence |
|---|---|---|---|
| Runtime produtivo do domínio ausente | `IMPLEMENTATION_GAP` | DOM-ID-001…DOM-AUDIT-006 | ausência de serviço/runtime; apenas `prototype/src/mockDomain.ts` |
| Persistência canônica e recovery ausentes | `IMPLEMENTATION_GAP` | DOM-SNAPSHOT-001, DOM-AUDIT-006 | protótipo mantém estado em memória |
| API/adapters/integração produtiva ausentes | `IMPLEMENTATION_GAP` | DOM-CMD-001, DOM-PUB-001, DOM-AUDIT-006 | repository contém protótipo, não backend produtivo |
| Provas independentes de conformance produtiva ausentes | `IMPLEMENTATION_GAP` | seção 21 | testes atuais exercitam mock/UI |
| Protótipo React e relatórios de cenário | `PROTOTYPE_ONLY` | todos os requisitos observáveis | `prototype/README.md`, `prototype/src/*`, `prototype/tests/*` |
| Architecture gap | `NON_GAP` | todos | audit independente aprovou decomposição e ADRs aceitas são suficientes; reauditoria da SPEC permanece pendente |

A reconciliação formal desses itens permanece downstream, na geração da Gap
Matrix.

## 25. Dependencies

| Dependency SPEC | Contract consumed | Blocking? | Evidence |
|---|---|---|---|
| nenhuma | nenhum contrato upstream normativo | não | DAG aprovado: `SPEC-DOM-001` é a raiz |

Edges downstream registrados pelo portfolio, mas não dependências deste
componente: `SPEC-EXEC-001`, `SPEC-EXEC-002`, `SPEC-PLAT-001`, `SPEC-REPO-001`,
`SPEC-GIT-001`, `SPEC-BACKEND-001`, `SPEC-OPS-001` e `SPEC-UI-001`.

`NORMATIVE_DEPENDENCIES = 0`; `NEW_UNAPPROVED_DEPENDENCIES = 0`; nenhum ciclo
foi criado.

## 26. Risks

| Risk | Mitigation / conformance |
|---|---|
| backend virar segunda state machine | C-19 verifica que mapping não cria transição |
| UI ou OPS virar autoridade | C-20 verifica projeção sem confirmação |
| legacy virar segundo caminho canônico | AC-DOM-004/008 e C-21 verificam elegibilidade e sucessão |
| retry duplicar efeito | seção 16 e C-22 exigem owner PLAT/GIT para efeito |
| stale snapshot avançar | AC-DOM-003/011 e C-03/C-10 |
| publicação parcial ser declarada concluída | AC-DOM-014/054 e C-12/C-18 |
| mudança normativa deixar aprovações downstream válidas | AC-DOM-053 e C-17 |
| protótipo ser tratado como implementação | classificação `PROTOTYPE_ONLY` e C-23 |

## 27. Implementation Details Intentionally Unfrozen

Permanecem livres, salvo decisão posterior válida:

- classes, funções, módulos, namespaces e layout de arquivos;
- tecnologia e schema de banco;
- protocolo de eventos e mecanismo de replay;
- formato de DTO/envelope interno e rotas HTTP;
- framework de frontend;
- mecanismo de token e provedor de e-mail, dentro de ADR-0012;
- biblioteca de adapters Git/Codex/GitHub;
- estratégia de cache, fila física e serialização interna;
- mecanismo de persistência dos registros operacionais;
- nomes de implementação para os comandos e eventos semânticos.

Essas escolhas não podem alterar os requisitos, IDs, ownership, invariantes ou
falhas canônicas desta SPEC.

## 28. Open Questions

### IMPLEMENTATION_DETAIL_QUESTION

- Qual protocolo de eventos oferecerá replay consistente com snapshots?
- Qual banco local permitirá journal, backup e restauração testáveis?
- Como a implementação exporá checkpoints e saída estruturada do Codex CLI?
- Como tokens locais serão entregues ao navegador sem ampliar exposição de rede?

Essas questões não bloqueiam a validação da fronteira normativa enquanto não
alterarem ownership ou semântica.

### ARCHITECTURAL_QUESTION

Nenhuma. Se uma resposta futura exigir mudar owner, autoridade, lifecycle,
compatibilidade ou DAG, o trabalho deve parar com `BLOCKED — ARCHITECTURAL
DECISION REQUIRED` ou `BLOCKED — PORTFOLIO DECOMPOSITION CHANGE REQUIRED` e
uma nova decisão/portfolio auditado deverá preceder a revisão.

## 29. Definition of Done

- portfolio revision 2 possui auditoria independente com
  `PORTFOLIO_DECOMPOSITION_APPROVED`;
- ADRs primárias `ADR-0001`, `ADR-0002` e `ADR-0009` estão aceitas e efetivas;
- todas as 21 obrigações DOM estão cobertas;
- nenhum contrato consumidor foi redefinido;
- requisitos, falhas, identidade, compatibilidade e projections têm owner claro;
- acceptance criteria e conformance tests são binários e verificáveis;
- repository evidence foi inspecionada e gaps foram classificados;
- não há architecture gap ou portfolio ownership gap conhecido; a reauditoria independente deve confirmar essa condição;
- nenhuma dependência upstream nova foi criada;
- nenhum Gap Matrix, Plano, ticket ou código de produção foi gerado.

## 30. Mechanical Validation

```text
PORTFOLIO_OBLIGATIONS_OWNED = 21
PORTFOLIO_OBLIGATIONS_COVERED = 21
OWNED_OBLIGATIONS_UNCOVERED = 0
NORMATIVE_REQUIREMENTS = 21
REQUIREMENTS_WITHOUT_AUTHORITY = 0
CONSUMED_CONTRACTS = 6 non-authoritative references; 0 upstream normative dependencies
CONSUMED_CONTRACTS_REDEFINED = 0
FAILURES_OWNED = 3 semantic families / 5 canonical codes
FAILURES_CONSUMED = 8 adjacent families
AMBIGUOUS_FAILURE_OWNERS = 0
NORMATIVE_DEPENDENCIES = 0
NEW_UNAPPROVED_DEPENDENCIES = 0
KNOWN_SPECIFICATION_GAPS = 0
KNOWN_IMPLEMENTATION_GAPS = 4
ARCHITECTURE_GAPS = 0
PORTFOLIO_OWNERSHIP_GAPS = 0
ACCEPTANCE_CRITERIA = 21
CONFORMANCE_TESTS = 24
```

Required invariants:

```text
OWNED_OBLIGATIONS_UNCOVERED = 0
REQUIREMENTS_WITHOUT_AUTHORITY = 0
CONSUMED_CONTRACTS_REDEFINED = 0
AMBIGUOUS_FAILURE_OWNERS = 0
NEW_UNAPPROVED_DEPENDENCIES = 0
ARCHITECTURE_GAPS = 0
PORTFOLIO_OWNERSHIP_GAPS = 0
```

## 31. Adversarial Validation

Ownership: nenhuma obrigação fora de `O-001…O-015` e `O-049…O-054` foi tornada
normativa; consumidores não receberam authority; todas as obrigações têm
requisito.

Dependency: DOM permanece raiz do DAG; nenhuma dependência downstream foi
invertida ou adicionada; nenhuma SPEC consumidora é necessária para completar
este contrato.

Authority: repository e protótipo foram tratados como evidência; backend, UI,
OPS e GIT foram mantidos como mapping/projection/effect owners onde aplicável.

Failure: as três famílias DOM têm owner único; mappings locais preservam código,
trigger e significado.

Compatibility: histórico é preservado, legado é adapter e mudança normativa
invalida downstream sem manter dois caminhos canônicos.

Quality: todos os requisitos têm ADR, obligation, acceptance/test; nenhum
requisito escolhe classe, arquivo, tecnologia ou fase de implementação.

## 32. Final Gate

```text
COMPONENT_SPEC_REMEDIATION_COMPLETE
COMPONENT: SPEC-DOM-001
PORTFOLIO: SPEC-PORTFOLIO-001
PORTFOLIO_VERDICT: PORTFOLIO_DECOMPOSITION_APPROVED
GATE: READY_FOR_INDEPENDENT_COMPONENT_SPEC_REAUDIT
```

Esta remediação não emite `PASS — COMPONENT_SPEC_CONFORMANT`. O próximo passo
obrigatório é uma auditoria independente da SPEC.
