---
schema_version: "1.0.0"
id: SPEC-PORTFOLIO-001
title: Organização das especificações de implementação do orquestrador
status: PROPOSED
revision: 2
date: 2026-09-08
spec_scope: governance
authoritative_adrs: [ADR-0001, ADR-0002, ADR-0003, ADR-0004, ADR-0005, ADR-0006, ADR-0007, ADR-0008, ADR-0009, ADR-0010, ADR-0011, ADR-0012, ADR-0013, ADR-0014]
supersedes: []
superseded_by: null
related: [ADR-0001-0014-portfolio-conformance-audit-2026-08-28, ADR-0001-0014-portfolio-remediation-2026-08-28, ADR-0001-0014-portfolio-remediation-ASC-MAJOR-002-2026-08-28]
---

# SPEC-PORTFOLIO-001 — Organização das especificações de implementação do orquestrador

## 1. Status

`PROPOSED`

Esta é uma especificação de organização do portfólio. Ela define ownership,
fronteiras, dependências e rastreabilidade para as specs de capacidade que
serão escritas em seguida. Não substitui as ADRs, não cria novas decisões
arquiteturais e não é um Plano de Implementação.

## 2. Ownership

Esta spec owns:

- a decomposição normativa das ADR-0001–ADR-0014 em specs de capacidade;
- a atribuição de um único owner normativo para cada comportamento;
- as dependências entre specs;
- a separação entre autoridade arquitetural, contratos transversais,
  implementação e projeções;
- a rastreabilidade ADR → spec → gap → evidência;
- os critérios para aceitar uma spec componente para validação.

Esta spec não owns:

- estados, comandos ou contratos de produto além dos necessários para definir
  fronteiras entre specs;
- tecnologia de banco, transporte de eventos, rotas HTTP, provedor de e-mail,
  mecanismo de token ou tecnologia final do frontend;
- o conteúdo detalhado das nove specs componentes;
- Gap Matrix, Plano de Implementação, tickets ou código de produção.

## 3. Autoridade arquitetural

Todas as ADRs canônicas abaixo estão `decision_status: ACCEPTED`,
`implementation_status: UNPROCESSED` e `revision: 3`:

- [ADR-0001 — Domínio, identidade e imutabilidade](../adrs/ADR-0001-workflow-domain-and-identity.md);
- [ADR-0002 — Pipeline e máquinas de estados](../adrs/ADR-0002-pipeline-state-machines-and-transitions.md);
- [ADR-0003 — Contratos versionados das skills](../adrs/ADR-0003-versioned-skill-contracts.md);
- [ADR-0004 — Sessões Codex e segregação de agentes](../adrs/ADR-0004-codex-agent-sessions-and-role-segregation.md);
- [ADR-0005 — Scheduler, capacidade e concorrência](../adrs/ADR-0005-scheduler-capacity-and-concurrency.md);
- [ADR-0006 — Persistência, idempotência e recuperação](../adrs/ADR-0006-persistence-journal-idempotency-and-recovery.md);
- [ADR-0007 — Git, worktrees, ondas e commits](../adrs/ADR-0007-git-worktrees-waves-and-commits.md);
- [ADR-0008 — GitHub, publicação e aprovação humana](../adrs/ADR-0008-github-publication-and-human-approval.md);
- [ADR-0009 — Auditoria, remediação e conformidade final](../adrs/ADR-0009-audit-remediation-and-final-conformance.md);
- [ADR-0010 — Configuração e migração de repositórios](../adrs/ADR-0010-repository-configuration-and-legacy-migration.md);
- [ADR-0011 — Backend local .NET e API em tempo real](../adrs/ADR-0011-local-dotnet-backend-and-realtime-api.md);
- [ADR-0012 — Segurança local, credenciais e notificações](../adrs/ADR-0012-local-security-credentials-and-notifications.md);
- [ADR-0013 — Observabilidade, retenção, backup e exportação](../adrs/ADR-0013-observability-retention-backup-and-export.md);
- [ADR-0014 — Contrato operacional do frontend](../adrs/ADR-0014-frontend-operational-contract.md).

O [relatório de auditoria do portfólio](../adrs/ADR-0001-0014-portfolio-conformance-audit-2026-08-28.md)
identificou dez findings e a [remediação aprovada](../adrs/ADR-0001-0014-portfolio-remediation-2026-08-28.md)
registrou `ADR_PORTFOLIO_APPROVED`. A remediação específica do schema também
está referenciada em [ASC-MAJOR-002](../adrs/ADR-0001-0014-portfolio-remediation-ASC-MAJOR-002-2026-08-28.md).
Portanto, não há bloqueio arquitetural conhecido para organizar as specs.

## 4. Problema

As ADRs estão corretamente separadas por decisão arquitetural, mas uma
decomposição um-para-um produziria specs com fronteiras artificiais: identidade
é usada por estados, auditoria e persistência; contratos de skills são usados
por agentes, scheduler, onboarding e backend; Git e publicação formam uma
única cadeia de integração; backend e frontend precisam de um limite claro de
autoridade.

O repositório ainda não possui specs componentes aceitas. O estado atual contém
as ADRs, esta organização, o relatório de auditoria desta organização, um
rascunho componente `PROPOSED` de DOM, um protótipo React em memória e
evidências de auditoria do protótipo. Não há backend .NET, persistência
operacional, API, catálogo de skills, runtime Codex, adapters Git/GitHub ou
frontend de produção.

A organização precisa permitir implementação por fatias, sem duplicar
ownership nem transformar o protótipo em autoridade de produto.

## 5. Objetivos

- converter as 14 ADRs em um portfólio pequeno de specs por capacidade e
  boundary de ownership;
- preservar a distinção entre decisão arquitetural, comportamento normativo,
  implementação e projeção;
- tornar explícita a ordem de dependência entre contratos, runtime, backend e
  frontend;
- permitir que cada spec componente seja auditada e fechada de forma
  independente quando suas dependências estiverem satisfeitas;
- manter compatibilidade, identidade, imutabilidade, evidência e conformance
  como contratos transversais sem duplicação;
- usar o protótipo apenas como evidência de UX e de comportamento simulado.

## 6. Não objetivos

- criar novas ADRs ou alterar o conteúdo das ADRs aceitas;
- transformar o protótipo em implementação do backend;
- escolher tecnologia de banco, mensageria, e-mail, token ou frontend sem
  autoridade aceita;
- produzir a Gap Matrix completa, o Plano de Implementação ou issues;
- definir nomes de classes, módulos, endpoints ou tabelas;
- reescrever os relatórios históricos do protótipo;
- tratar testes de memória do protótipo como prova de persistência, concorrência
  real, integração GitHub ou segurança local.

## 7. Estado atual do repositório

| Área | Estado observado | Classificação |
|---|---|---|
| ADRs canônicas | 14 documentos aceitos, revision 3, schema uniforme | Autoridade aceita |
| Auditoria/remediação das ADRs | Portfólio aprovado em 2026-08-31 | Evidência de autoridade |
| Specs componentes | Nenhuma aceita; um rascunho `PROPOSED` `SPEC-DOM-001` materializado | `SPECIFICATION_GAP` |
| Artefatos de governança desta organização | `SPEC-PORTFOLIO-001-organization.md` e seu relatório de auditoria | Evidência de decomposição; não são specs componentes |
| Gap Matrix e plano | Nenhum artefato canônico encontrado | Dependente desta organização |
| Backend .NET | Ausente | `IMPLEMENTATION_GAP` |
| Banco, journal e outbox | Ausentes | `IMPLEMENTATION_GAP` |
| Registro de skills e runtime Codex | Ausentes | `IMPLEMENTATION_GAP` |
| Onboarding real | Apenas simulação no protótipo | `IMPLEMENTATION_GAP` |
| Git/GitHub real | Apenas simulação no protótipo | `IMPLEMENTATION_GAP` |
| Frontend de produção | Ausente; existe protótipo React local | `IMPLEMENTATION_GAP` |
| Protótipo | Simulação determinística, sem integrações externas | `NON_GAP / PROTOTYPE_ONLY` |
| Relatórios do protótipo | Evidência histórica e de design | `NON_GAP`, evidence type `HISTORICAL_EVIDENCE` |

Inventário exato de `docs/specs/SPEC-*.md` nesta revisão:

| Arquivo | Tipo | Autoridade |
|---|---|---|
| `SPEC-PORTFOLIO-001-organization.md` | organização | proposta, não componente |
| `SPEC-PORTFOLIO-001-decomposition-audit.md` | auditoria histórica da decomposição | evidência imutável |
| `SPEC-PORTFOLIO-001-decomposition-remediation.md` | evidência desta remediação | evidência de remediação, não componente |
| `SPEC-DOM-001-workflow-authority-and-governance.md` | componente | `PROPOSED`, não aceita |

O inventário contém quatro arquivos com o padrão `SPEC-*.md`, mas somente um
é rascunho componente (`PROPOSED`); não existem componentes `ACCEPTED`. Não
foram encontrados Gap Matrix, Implementation Plan ou tickets.

O protótipo não redefine nenhuma ADR. Seus estados, fixtures e comandos só
podem ser reutilizados como evidência ou como referência de UX depois de
traduzidos para os contratos do backend.

## 8. Decisão de organização

O portfólio terá um índice de organização e nove specs componentes. A unidade
de decomposição é a capacidade/boundary de ownership, não a ADR individual.
Uma ADR pode ser autoridade primária de uma spec e autoridade relacionada de
outras, mas cada comportamento normativo terá um único owner.

Estrutura proposta:

```text
docs/specs/
├── SPEC-PORTFOLIO-001-organization.md
├── SPEC-DOM-001-workflow-authority-and-governance.md
├── SPEC-EXEC-001-skill-contracts-and-capability-registry.md
├── SPEC-EXEC-002-agent-sessions-and-scheduler.md
├── SPEC-PLAT-001-persistence-effects-and-recovery.md
├── SPEC-REPO-001-repository-onboarding-and-legacy-migration.md
├── SPEC-GIT-001-worktrees-waves-and-publication.md
├── SPEC-BACKEND-001-local-api-security-and-notifications.md
├── SPEC-OPS-001-observability-retention-backup-and-export.md
└── SPEC-UI-001-frontend-operational-client.md
```

O prefixo indica o boundary principal, não uma ordem de execução de código:

- `DOM`: autoridade de domínio e governança;
- `EXEC`: contratos e execução de agentes;
- `PLAT`: durabilidade e efeitos externos;
- `REPO`: habilitação e migração de repositórios;
- `GIT`: integração e publicação;
- `BACKEND`: boundary de aplicação e segurança local;
- `OPS`: operação, observabilidade e exportação;
- `UI`: cliente operacional.

### 8.1 Catálogo e ownership

| Spec | Owner normativo | ADRs primárias | Dependências principais |
|---|---|---|---|
| `SPEC-DOM-001` | identidade, execução, estados, auditoria e conformance | ADR-0001, ADR-0002, ADR-0009 | nenhuma |
| `SPEC-EXEC-001` | contratos JSON Schema, versões, manifestos e registro de capabilities | ADR-0003 | `SPEC-DOM-001` |
| `SPEC-EXEC-002` | sessões, assignments, ciclos, elegibilidade, capacidade, leases e filas | ADR-0004, ADR-0005 | `SPEC-DOM-001`, `SPEC-EXEC-001` |
| `SPEC-PLAT-001` | journal, outbox, efeitos, idempotência, reconciliação e recovery | ADR-0006 | `SPEC-DOM-001`, `SPEC-EXEC-001` |
| `SPEC-REPO-001` | configuração, bootstrap, onboarding, migração e habilitação | ADR-0010 | `SPEC-DOM-001`, `SPEC-EXEC-001`, `SPEC-PLAT-001` |
| `SPEC-GIT-001` | worktrees, branches, ondas, commits, integração, PR e publicação | ADR-0007, ADR-0008 | `SPEC-DOM-001`, `SPEC-PLAT-001`, `SPEC-REPO-001` |
| `SPEC-BACKEND-001` | serviço .NET, envelopes de aplicação/transporte, queries, mapeamentos de eventos, auth local e notificações | ADR-0011, ADR-0012 | `SPEC-DOM-001`, `SPEC-EXEC-001`, `SPEC-EXEC-002`, `SPEC-PLAT-001`, `SPEC-REPO-001`, `SPEC-GIT-001` |
| `SPEC-OPS-001` | telemetria, correlação, retenção, backup, restauração e exportação como projeção operacional | ADR-0013 | `SPEC-PLAT-001`, `SPEC-BACKEND-001` |
| `SPEC-UI-001` | projeção operacional, navegação e interação sem autoridade | ADR-0014 | `SPEC-BACKEND-001`, `SPEC-OPS-001` |

ADR-0009 permanece autoridade transversal do ciclo de auditoria, mas seu
ownership normativo fica em `SPEC-DOM-001`. As demais specs devem referenciar
esse contrato e não redefinir rodadas, independência, veredictos ou retorno
downstream.

### 8.2 Registro canônico de obrigações arquiteturais

Esta é a fonte normativa da decomposição. Os IDs O-001–O-078 foram preservados
do inventário extraído pela auditoria independente e agora estão expandidos em
unidades estáveis. Em cada linha, `CANONICAL_OWNER` é o único owner normativo;
`Consumer SPECs` são consumidores explicitamente não-autoritativos. Os nomes de
falhas abaixo são rótulos de rastreabilidade, não congelam nomes de tipos ou
protocolos.

| ID | ADR / seção | Obrigação normativa | Owner SPEC | Consumer SPECs (não-autoritários) | Authority type | Cross-cutting | Failure family | Compatibility class | Notes |
|---|---|---|---|---|---|---|---|---|---|
| O-001 | ADR-0001 / Decisão | Identidades persistentes para os agregados normativos listados. | `SPEC-DOM-001` | all components | `CANONICAL_OWNER` | YES | — | NEW_CANONICAL_PATH | — |
| O-002 | ADR-0001 / Invariantes | Entrada manual explícita dos artefatos e decisões governados. | `SPEC-DOM-001` | `SPEC-REPO-001`, `SPEC-BACKEND-001`, `SPEC-UI-001` | `CANONICAL_OWNER` | YES | — | NEW_CANONICAL_PATH | — |
| O-003 | ADR-0001 / Decisão | Snapshot imutável de ADRs elegíveis, hashes, base, configuração e versões de skills. | `SPEC-DOM-001` | `SPEC-PLAT-001`, `SPEC-EXEC-001`, `SPEC-REPO-001`, `SPEC-GIT-001`, `SPEC-BACKEND-001`, `SPEC-OPS-001`, `SPEC-UI-001` | `CANONICAL_OWNER` | YES | — | NEW_CANONICAL_PATH / HISTORICAL_REPLAY | — |
| O-004 | ADR-0001 / Invariantes | Somente ADRs aceitas entram na elegibilidade da execução. | `SPEC-DOM-001` | `SPEC-EXEC-002`, `SPEC-REPO-001`, `SPEC-BACKEND-001` | `CANONICAL_OWNER` | YES | SPEC_REVISION | NEW_CANONICAL_PATH | — |
| O-005 | ADR-0001 / Decisão | Relação ADR↔SPEC é muitos-para-muitos, com progresso independente. | `SPEC-DOM-001` | all components | `CANONICAL_OWNER` | YES | SPEC_REVISION | NEW_CANONICAL_PATH | — |
| O-006 | ADR-0001 / Invariantes | Lifecycle decisório e lifecycle de realização permanecem separados. | `SPEC-DOM-001` | `SPEC-EXEC-002`, `SPEC-GIT-001`, `SPEC-BACKEND-001`, `SPEC-UI-001` | `CANONICAL_OWNER` | YES | — | NEW_CANONICAL_PATH | — |
| O-007 | ADR-0001 / Invariantes | Remediação de ADR aceita e não implementada incrementa revisão. | `SPEC-DOM-001` | `SPEC-REPO-001`, `SPEC-BACKEND-001`, `SPEC-OPS-001` | `CANONICAL_OWNER` | YES | SPEC_REVISION | CUTOVER | — |
| O-008 | ADR-0001 / Invariantes | ADR implementada é imutável e sucedida por nova ADR; front matter e hash operacional são padronizados. | `SPEC-DOM-001` | all components | `CANONICAL_OWNER` | YES | SPEC_REVISION | HISTORICAL_REPLAY | — |
| O-009 | ADR-0002 / Decisão | Ordenação canônica do pipeline. | `SPEC-DOM-001` | `SPEC-EXEC-002`, `SPEC-GIT-001`, `SPEC-BACKEND-001`, `SPEC-UI-001` | `CANONICAL_OWNER` | YES | INVALID_DEPENDENCY_CLOSURE | NEW_CANONICAL_PATH | — |
| O-010 | ADR-0002 / Decisão | Máquinas de estado são separadas por agregado e estados superiores são derivados quando possível. | `SPEC-DOM-001` | `SPEC-EXEC-002`, `SPEC-GIT-001`, `SPEC-BACKEND-001`, `SPEC-OPS-001`, `SPEC-UI-001` | `CANONICAL_OWNER` | YES | INVALID_COMMAND_BASIS | NEW_CANONICAL_PATH | — |
| O-011 | ADR-0002 / Regras | Comandos validam pré-condições; transições inválidas são rejeitadas e registradas. | `SPEC-DOM-001` | `SPEC-BACKEND-001`, `SPEC-UI-001`, `SPEC-OPS-001` | `CANONICAL_OWNER` | YES | INVALID_COMMAND_BASIS | NEW_CANONICAL_PATH | — |
| O-012 | ADR-0002 / Transições | Estados de ticket e terminalidade são normativos. | `SPEC-DOM-001` | `SPEC-EXEC-002`, `SPEC-GIT-001`, `SPEC-BACKEND-001`, `SPEC-UI-001` | `CANONICAL_OWNER` | YES | — | NEW_CANONICAL_PATH | — |
| O-013 | ADR-0002 / Transições | Tabela completa de transições funcionais dos tickets. | `SPEC-DOM-001` | `SPEC-EXEC-002`, `SPEC-GIT-001`, `SPEC-BACKEND-001`, `SPEC-UI-001` | `CANONICAL_OWNER` | YES | INVALID_COMMAND_BASIS | NEW_CANONICAL_PATH | — |
| O-014 | ADR-0002 / Vocabulário | Vocabulário normativo de publicação distingue candidato, aprovação, integração e confirmação remota. | `SPEC-DOM-001` | `SPEC-GIT-001`, `SPEC-BACKEND-001`, `SPEC-UI-001`, `SPEC-OPS-001` | `CANONICAL_OWNER` | YES | PUBLICATION | NEW_CANONICAL_PATH / CUTOVER | — |
| O-015 | ADR-0002 / Regras | Não há avanço sem veredito formal; progresso de SPEC, DAG, rodadas, pausa e cancelamento seguem contratos independentes. | `SPEC-DOM-001` | `SPEC-EXEC-002`, `SPEC-GIT-001`, `SPEC-BACKEND-001`, `SPEC-UI-001` | `CANONICAL_OWNER` | YES | INVALID_DEPENDENCY_CLOSURE | NEW_CANONICAL_PATH | — |
| O-016 | ADR-0003 / Decisão | Toda skill emite envelope JSON validado por JSON Schema. | `SPEC-EXEC-001` | `SPEC-EXEC-002`, `SPEC-REPO-001`, `SPEC-BACKEND-001`, `SPEC-DOM-001` | `CANONICAL_OWNER` | YES | CONTRACT_VERDICT | NEW_CANONICAL_PATH | — |
| O-017 | ADR-0003 / Decisão | Versionamento semântico e conjunto de versões suportadas são explícitos. | `SPEC-EXEC-001` | `SPEC-EXEC-002`, `SPEC-BACKEND-001`, `SPEC-REPO-001` | `CANONICAL_OWNER` | YES | CONTRACT_VERDICT | NEW_CANONICAL_PATH / RETIREMENT | — |
| O-018 | ADR-0003 / Decisão | Cada execução congela versões exatas no snapshot. | `SPEC-EXEC-001` | `SPEC-DOM-001`, `SPEC-EXEC-002`, `SPEC-REPO-001`, `SPEC-BACKEND-001`, `SPEC-OPS-001` | `CANONICAL_OWNER` | YES | SPEC_REVISION | NEW_CANONICAL_PATH / CUTOVER | — |
| O-019 | ADR-0003 / Decisão | JSON inválido, schema incompatível e veredito desconhecido falham fechados. | `SPEC-EXEC-001` | `SPEC-EXEC-002`, `SPEC-BACKEND-001`, `SPEC-OPS-001`, `SPEC-UI-001` | `CANONICAL_OWNER` | YES | CONTRACT_VERDICT | NEW_CANONICAL_PATH | — |
| O-020 | ADR-0003 / Decisão | Registro versionado de skills/capabilities separa catálogo normal e bootstrap. | `SPEC-EXEC-001` | `SPEC-EXEC-002`, `SPEC-REPO-001`, `SPEC-BACKEND-001` | `CANONICAL_OWNER` | YES | CAPABILITY | NEW_CANONICAL_PATH / LEGACY_COMPATIBILITY | — |
| O-021 | ADR-0003 / Decisão | Manifesto completo de atividade é imutável e declara checkpoints seguros e retomada. | `SPEC-EXEC-001` | `SPEC-EXEC-002`, `SPEC-PLAT-001`, `SPEC-OPS-001`, `SPEC-BACKEND-001` | `CANONICAL_OWNER` | YES | CONTRACT_VERDICT | NEW_CANONICAL_PATH / HISTORICAL_REPLAY | — |
| O-022 | ADR-0004 / Decisão | Cada atividade recebe nova sessão Codex isolada e novo assignment. | `SPEC-EXEC-002` | `SPEC-DOM-001`, `SPEC-BACKEND-001`, `SPEC-OPS-001` | `CANONICAL_OWNER` | YES | LOCAL_SESSION | NEW_CANONICAL_PATH | — |
| O-023 | ADR-0004 / Decisão | O mesmo agente não retorna no mesmo ciclo do artefato. | `SPEC-EXEC-002` | `SPEC-DOM-001`, `SPEC-BACKEND-001`, `SPEC-OPS-001` | `CANONICAL_OWNER` | YES | LOCAL_SESSION | NEW_CANONICAL_PATH | — |
| O-024 | ADR-0004 / Decisão | `ArtifactCycleId` tem lifecycle formal e papéis de remediador, auditor e conflito são segregados. | `SPEC-EXEC-002` | `SPEC-DOM-001`, `SPEC-BACKEND-001`, `SPEC-OPS-001` | `CANONICAL_OWNER` | YES | LOCAL_SESSION | NEW_CANONICAL_PATH | — |
| O-025 | ADR-0004 / Decisão | Sem agente elegível, aguarda; somente manifestos, artefatos e resultados persistidos formam o contexto de retomada. | `SPEC-EXEC-002` | `SPEC-DOM-001`, `SPEC-PLAT-001`, `SPEC-BACKEND-001`, `SPEC-OPS-001` | `CANONICAL_OWNER` | YES | AGENT_ELIGIBILITY | HISTORICAL_REPLAY | — |
| O-026 | ADR-0005 / Decisão | Teto dinâmico de capacidade é fornecido por `AgentCapacityProvider`. | `SPEC-EXEC-002` | `SPEC-BACKEND-001`, `SPEC-UI-001`, `SPEC-OPS-001` | `CANONICAL_OWNER` | YES | CAPACITY_ELIGIBILITY | NEW_CANONICAL_PATH | — |
| O-027 | ADR-0005 / Regras | Não há substituição ou interrupção arbitrária de agente em atividade. | `SPEC-EXEC-002` | `SPEC-DOM-001`, `SPEC-BACKEND-001`, `SPEC-UI-001` | `CANONICAL_OWNER` | YES | CAPACITY_ELIGIBILITY | NEW_CANONICAL_PATH | — |
| O-028 | ADR-0005 / Regras | Capacidade `UNKNOWN` usa teto conservador. | `SPEC-EXEC-002` | `SPEC-BACKEND-001`, `SPEC-UI-001`, `SPEC-OPS-001` | `CANONICAL_OWNER` | YES | CAPACITY_ELIGIBILITY | NEW_CANONICAL_PATH | — |
| O-029 | ADR-0005 / Regras | Lease é persistido, exclusivo e liberado conforme o lifecycle. | `SPEC-EXEC-002` | `SPEC-PLAT-001`, `SPEC-BACKEND-001`, `SPEC-OPS-001` | `CANONICAL_OWNER` | YES | CAPACITY_ELIGIBILITY | NEW_CANONICAL_PATH / HISTORICAL_REPLAY | — |
| O-030 | ADR-0005 / Regras | Pool global justo coordena execuções independentes sem sobrescrever leases. | `SPEC-EXEC-002` | `SPEC-DOM-001`, `SPEC-BACKEND-001`, `SPEC-UI-001` | `CANONICAL_OWNER` | YES | CAPACITY_ELIGIBILITY | NEW_CANONICAL_PATH | — |
| O-031 | ADR-0005 / Regras | Ondas/DAG, razões distintas de fila, merge final serial e bloqueios de capacidade/dependência/ciclo são distintos de conflito de arquivo. | `SPEC-EXEC-002` | `SPEC-DOM-001`, `SPEC-GIT-001`, `SPEC-BACKEND-001`, `SPEC-UI-001` | `CANONICAL_OWNER` | YES | INVALID_DEPENDENCY_CLOSURE | NEW_CANONICAL_PATH | — |
| O-032 | ADR-0006 / Decisão | Persistência local usa banco, journal append-only e outbox. | `SPEC-PLAT-001` | `SPEC-DOM-001`, `SPEC-REPO-001`, `SPEC-GIT-001`, `SPEC-BACKEND-001`, `SPEC-OPS-001` | `CANONICAL_OWNER` | YES | EFFECT_RECONCILIATION | NEW_CANONICAL_PATH | tecnologia não congelada |
| O-033 | ADR-0006 / Decisão | Intenção é persistida antes do efeito externo e evidência/confirmação depois. | `SPEC-PLAT-001` | `SPEC-GIT-001`, `SPEC-REPO-001`, `SPEC-BACKEND-001`, `SPEC-OPS-001` | `CANONICAL_OWNER` | YES | EFFECT_RECONCILIATION | NEW_CANONICAL_PATH | — |
| O-034 | ADR-0006 / Decisão | Chaves idempotentes determinísticas são reutilizadas nas tentativas. | `SPEC-PLAT-001` | `SPEC-GIT-001`, `SPEC-REPO-001`, `SPEC-BACKEND-001` | `CANONICAL_OWNER` | YES | EFFECT_RECONCILIATION | NEW_CANONICAL_PATH / HISTORICAL_REPLAY | — |
| O-035 | ADR-0006 / Decisão | Antes de repetir, reconcilia evidências; divergência Git/banco exige decisão humana. | `SPEC-PLAT-001` | `SPEC-DOM-001`, `SPEC-GIT-001`, `SPEC-BACKEND-001`, `SPEC-OPS-001`, `SPEC-UI-001` | `CANONICAL_OWNER` | YES | EFFECT_RECONCILIATION | CUTOVER | — |
| O-036 | ADR-0006 / Decisão | As quatro classes de reconciliação têm semântica distinta. | `SPEC-PLAT-001` | `SPEC-GIT-001`, `SPEC-REPO-001`, `SPEC-BACKEND-001`, `SPEC-OPS-001`, `SPEC-UI-001` | `CANONICAL_OWNER` | YES | EFFECT_RECONCILIATION | HISTORICAL_REPLAY | — |
| O-037 | ADR-0006 / Decisão | Reinício reconstrói estado e recovery a partir de checkpoint seguro. | `SPEC-PLAT-001` | `SPEC-DOM-001`, `SPEC-EXEC-001`, `SPEC-EXEC-002`, `SPEC-BACKEND-001`, `SPEC-OPS-001` | `CANONICAL_OWNER` | YES | EFFECT_RECONCILIATION | HISTORICAL_REPLAY | — |
| O-038 | ADR-0006 / Decisão | Tentativas operacionais são limitadas e cooperativas; efeitos externos exigem evidência e chave. | `SPEC-PLAT-001` | `SPEC-EXEC-002`, `SPEC-GIT-001`, `SPEC-REPO-001`, `SPEC-BACKEND-001`, `SPEC-OPS-001` | `CANONICAL_OWNER` | YES | EFFECT_RECONCILIATION | RETIREMENT | — |
| O-039 | ADR-0007 / Decisão | Cada SPEC possui branch de integração. | `SPEC-GIT-001` | `SPEC-DOM-001`, `SPEC-REPO-001`, `SPEC-PLAT-001`, `SPEC-OPS-001` | `CANONICAL_OWNER` | YES | PUBLICATION | NEW_CANONICAL_PATH | — |
| O-040 | ADR-0007 / Decisão | Cada ticket possui branch e worktree isolados. | `SPEC-GIT-001` | `SPEC-DOM-001`, `SPEC-REPO-001`, `SPEC-PLAT-001`, `SPEC-OPS-001` | `CANONICAL_OWNER` | YES | PUBLICATION | NEW_CANONICAL_PATH | — |
| O-041 | ADR-0007 / Decisão | Trabalho pronto pode ocorrer em paralelo e integração ocorre em ondas auditadas. | `SPEC-GIT-001` | `SPEC-EXEC-002`, `SPEC-DOM-001`, `SPEC-PLAT-001` | `CANONICAL_OWNER` | YES | INVALID_DEPENDENCY_CLOSURE | NEW_CANONICAL_PATH | — |
| O-042 | ADR-0007 / Decisão | Principal é mesclada na branch da SPEC sem rebase/force-push automático. | `SPEC-GIT-001` | `SPEC-DOM-001`, `SPEC-PLAT-001`, `SPEC-REPO-001` | `CANONICAL_OWNER` | YES | PUBLICATION | NEW_CANONICAL_PATH | — |
| O-043 | ADR-0007 / Decisão | Cada commit cobre uma SPEC e respeita regras de milestone. | `SPEC-GIT-001` | `SPEC-DOM-001`, `SPEC-PLAT-001`, `SPEC-OPS-001` | `CANONICAL_OWNER` | YES | PUBLICATION | NEW_CANONICAL_PATH | — |
| O-044 | ADR-0007 / Proteção | `DocumentCandidateTreeHash` é protegido/revalidado e recursos ficam retidos até confirmação remota. | `SPEC-GIT-001` | `SPEC-PLAT-001`, `SPEC-OPS-001`, `SPEC-DOM-001` | `CANONICAL_OWNER` | YES | PUBLICATION | HISTORICAL_REPLAY / RETIREMENT | — |
| O-045 | ADR-0008 / Decisão | Integração GitHub/`gh` respeita modo por repositório de push ou PR. | `SPEC-GIT-001` | `SPEC-REPO-001`, `SPEC-BACKEND-001`, `SPEC-UI-001`, `SPEC-PLAT-001` | `CANONICAL_OWNER` | YES | PUBLICATION | NEW_CANONICAL_PATH / LEGACY_COMPATIBILITY | — |
| O-046 | ADR-0008 / Decisão | Aprovação humana cobre candidato exato; push é serial, controlado e idempotente. | `SPEC-GIT-001` | `SPEC-DOM-001`, `SPEC-BACKEND-001`, `SPEC-UI-001`, `SPEC-PLAT-001` | `CANONICAL_OWNER` | YES | PUBLICATION | NEW_CANONICAL_PATH | — |
| O-047 | ADR-0008 / Decisão | PR exige protocolo de base/head/mergeability/check/tree e drift invalida veredito. | `SPEC-GIT-001` | `SPEC-DOM-001`, `SPEC-BACKEND-001`, `SPEC-UI-001`, `SPEC-OPS-001` | `CANONICAL_OWNER` | YES | PUBLICATION | CUTOVER | — |
| O-048 | ADR-0008 / Decisão | Conclusão exige `PR_MERGED` e `REMOTE_PUBLICATION_CONFIRMED`; limpeza só depois da confirmação. | `SPEC-GIT-001` | `SPEC-DOM-001`, `SPEC-BACKEND-001`, `SPEC-UI-001`, `SPEC-PLAT-001`, `SPEC-OPS-001` | `CANONICAL_OWNER` | YES | PUBLICATION | RETIREMENT | — |
| O-049 | ADR-0009 / Decisão | Ciclos formais independentes cobrem todos os artefatos listados. | `SPEC-DOM-001` | all components; `SPEC-EXEC-001`, `SPEC-EXEC-002` | `CANONICAL_OWNER` | YES | CONTRACT_VERDICT | NEW_CANONICAL_PATH | — |
| O-050 | ADR-0009 / Decisão | Veredito estruturado encerra ciclo; remediação nunca aprova. | `SPEC-DOM-001` | all components; `SPEC-EXEC-001`, `SPEC-EXEC-002`, `SPEC-BACKEND-001` | `CANONICAL_OWNER` | YES | CONTRACT_VERDICT | NEW_CANONICAL_PATH | — |
| O-051 | ADR-0009 / Decisão | Limite de dez rodadas exige autorização para continuar. | `SPEC-DOM-001` | `SPEC-EXEC-002`, `SPEC-BACKEND-001`, `SPEC-UI-001`, `SPEC-OPS-001` | `CANONICAL_OWNER` | YES | CONTRACT_VERDICT | CUTOVER | — |
| O-052 | ADR-0009 / Decisão | Conformance final cobre cobertura, integração, legado, testes, regressões, omissões e extrapolações. | `SPEC-DOM-001` | all components; `SPEC-OPS-001` | `CANONICAL_OWNER` | YES | CONTRACT_VERDICT | NEW_CANONICAL_PATH | — |
| O-053 | ADR-0009 / Decisão | Mudança normativa invalida aprovações downstream e cria tickets de ajuste. | `SPEC-DOM-001` | all components; `SPEC-EXEC-002`, `SPEC-GIT-001`, `SPEC-PLAT-001` | `CANONICAL_OWNER` | YES | SPEC_REVISION | CUTOVER / RETIREMENT | — |
| O-054 | ADR-0009 / Decisão | Conformance exige base exata antes da publicação e relatórios/evidências externos ligados por hash. | `SPEC-DOM-001` | `SPEC-GIT-001`, `SPEC-PLAT-001`, `SPEC-OPS-001`, `SPEC-BACKEND-001`, `SPEC-UI-001` | `CANONICAL_OWNER` | YES | PUBLICATION | HISTORICAL_REPLAY | — |
| O-055 | ADR-0010 / Decisão | Configuração de repositório é explícita e versionada. | `SPEC-REPO-001` | `SPEC-DOM-001`, `SPEC-EXEC-001`, `SPEC-BACKEND-001`, `SPEC-GIT-001` | `CANONICAL_OWNER` | YES | REPOSITORY | NEW_CANONICAL_PATH | — |
| O-056 | ADR-0010 / Decisão | Registro valida árvore limpa e alinhamento local/remoto exato sem correção destrutiva. | `SPEC-REPO-001` | `SPEC-GIT-001`, `SPEC-PLAT-001`, `SPEC-BACKEND-001`, `SPEC-OPS-001` | `CANONICAL_OWNER` | YES | REPOSITORY | NEW_CANONICAL_PATH | — |
| O-057 | ADR-0010 / Decisão | Migração legada é explícita, com migration/audit/remediation segregados. | `SPEC-REPO-001` | `SPEC-DOM-001`, `SPEC-EXEC-001`, `SPEC-PLAT-001`, `SPEC-GIT-001`, `SPEC-BACKEND-001` | `CANONICAL_OWNER` | YES | LEGACY_COMPATIBILITY | LEGACY_COMPATIBILITY / CUTOVER | — |
| O-058 | ADR-0010 / Bootstrap | Catálogo bootstrap, configuração candidata e workspace isolado conduzem atomicamente a `ENABLED`. | `SPEC-REPO-001` | `SPEC-DOM-001`, `SPEC-EXEC-001`, `SPEC-PLAT-001`, `SPEC-GIT-001`, `SPEC-BACKEND-001` | `CANONICAL_OWNER` | YES | REPOSITORY | NEW_CANONICAL_PATH / CUTOVER | — |
| O-059 | ADR-0010 / Bootstrap | Uma execução cobre um repositório e não há dependência entre repositórios. | `SPEC-REPO-001` | `SPEC-DOM-001`, `SPEC-EXEC-002`, `SPEC-GIT-001`, `SPEC-BACKEND-001` | `CANONICAL_OWNER` | YES | REPOSITORY | NEW_CANONICAL_PATH | — |
| O-060 | ADR-0011 / Decisão | Backend nativo Windows C#/.NET é autônomo e independente do frontend. | `SPEC-BACKEND-001` | `SPEC-DOM-001`, `SPEC-EXEC-001`, `SPEC-EXEC-002`, `SPEC-PLAT-001`, `SPEC-REPO-001`, `SPEC-GIT-001`, `SPEC-OPS-001`, `SPEC-UI-001` | `CANONICAL_OWNER` | YES | LOCAL_SESSION | NEW_CANONICAL_PATH | hosting tecnológico conforme ADR |
| O-061 | ADR-0011 / Decisão | API local e stream realtime expõem comandos, aceitação/rejeição, correlação, snapshots e eventos sem redefinir domínio. | `SPEC-BACKEND-001` | `SPEC-DOM-001`, `SPEC-PLAT-001`, `SPEC-OPS-001`, `SPEC-UI-001` | `CANONICAL_OWNER` | YES | INVALID_COMMAND_BASIS | NEW_CANONICAL_PATH / HISTORICAL_REPLAY | application/transport mapping |
| O-062 | ADR-0011 / Decisão | Backend suporta modo de onboarding antes de `ENABLED`. | `SPEC-BACKEND-001` | `SPEC-REPO-001`, `SPEC-DOM-001`, `SPEC-UI-001` | `CANONICAL_OWNER` | YES | REPOSITORY | NEW_CANONICAL_PATH / CUTOVER | — |
| O-063 | ADR-0011 / Decisão | Processo/sessão Codex são isolados; saída estruturada, eventos, encerramento e checkpoints cooperativos são capturados. | `SPEC-BACKEND-001` | `SPEC-EXEC-001`, `SPEC-EXEC-002`, `SPEC-PLAT-001`, `SPEC-OPS-001` | `CANONICAL_OWNER` | YES | LOCAL_SESSION | NEW_CANONICAL_PATH | — |
| O-064 | ADR-0011 / Decisão | Domínio, aplicação, adapters, persistência e API permanecem separados em escala local. | `SPEC-BACKEND-001` | `SPEC-DOM-001`, `SPEC-PLAT-001`, `SPEC-OPS-001`, `SPEC-UI-001` | `CANONICAL_OWNER` | YES | — | NEW_CANONICAL_PATH | boundary, não layout de classes |
| O-065 | ADR-0012 / Decisão | API escuta somente localhost, usa token efêmero e escopo de usuário único. | `SPEC-BACKEND-001` | `SPEC-UI-001`, `SPEC-OPS-001` | `CANONICAL_OWNER` | YES | LOCAL_SESSION | NEW_CANONICAL_PATH | mecanismo de token não congelado |
| O-066 | ADR-0012 / Decisão | Autenticação `gh` é reutilizada sem copiar credenciais para o banco. | `SPEC-BACKEND-001` | `SPEC-GIT-001`, `SPEC-REPO-001`, `SPEC-OPS-001` | `CANONICAL_OWNER` | YES | UNAUTHORIZED_LOCAL_SESSION | NEW_CANONICAL_PATH | — |
| O-067 | ADR-0012 / Decisão | Configuração de e-mail é separada/protegida e mensagens são somente para intervenção. | `SPEC-BACKEND-001` | `SPEC-UI-001`, `SPEC-OPS-001`, `SPEC-GIT-001` | `CANONICAL_OWNER` | YES | UNAUTHORIZED_LOCAL_SESSION | NEW_CANONICAL_PATH | provedor não congelado |
| O-068 | ADR-0012 / Decisão | Entrega é idempotente/auditável e intervenção registra tempo, comando, alvo, antes/depois e justificativa. | `SPEC-BACKEND-001` | `SPEC-PLAT-001`, `SPEC-OPS-001`, `SPEC-UI-001` | `CANONICAL_OWNER` | YES | UNAUTHORIZED_LOCAL_SESSION | HISTORICAL_REPLAY | — |
| O-069 | ADR-0013 / Decisão | Registro operacional cobre estado, eventos, durações, agentes, skills, versões, tentativas, rodadas, consumo, DAG, bloqueios, Git, vereditos, findings e artefatos. | `SPEC-OPS-001` | `SPEC-BACKEND-001`, `SPEC-UI-001`, `SPEC-DOM-001`, `SPEC-PLAT-001` | `CANONICAL_OWNER` | YES | — | NEW_CANONICAL_PATH | operational projection |
| O-070 | ADR-0013 / Decisão | Logs, eventos, relatórios e artefatos intermediários são retidos até exclusão manual. | `SPEC-OPS-001` | `SPEC-PLAT-001`, `SPEC-BACKEND-001`, `SPEC-UI-001`, `SPEC-GIT-001` | `CANONICAL_OWNER` | YES | — | RETIREMENT | — |
| O-071 | ADR-0013 / Decisão | Backup/exportação reconstrói execução e exclusão deixa registro mínimo. | `SPEC-OPS-001` | `SPEC-PLAT-001`, `SPEC-BACKEND-001`, `SPEC-UI-001`, `SPEC-DOM-001` | `CANONICAL_OWNER` | YES | — | HISTORICAL_REPLAY / RETIREMENT | — |
| O-072 | ADR-0013 / Decisão | Correlação cobre repositório, execução, SPEC, atividade, agente e efeito; consumo é medido sem budget. | `SPEC-OPS-001` | `SPEC-DOM-001`, `SPEC-EXEC-002`, `SPEC-PLAT-001`, `SPEC-BACKEND-001`, `SPEC-UI-001` | `CANONICAL_OWNER` | YES | — | NEW_CANONICAL_PATH | — |
| O-073 | ADR-0014 / Decisão | Cliente web local consome snapshots, comandos e eventos do backend. | `SPEC-UI-001` | `SPEC-BACKEND-001`, `SPEC-OPS-001`, `SPEC-DOM-001` | `CANONICAL_OWNER` | YES | — | NEW_CANONICAL_PATH / HISTORICAL_REPLAY | projection/client boundary |
| O-074 | ADR-0014 / Decisão | Interface mostra repositórios, execuções, ADRs, SPECs, etapas, ondas, tickets, estados e atividade. | `SPEC-UI-001` | `SPEC-BACKEND-001`, `SPEC-OPS-001`, `SPEC-DOM-001` | `CANONICAL_OWNER` | YES | — | NEW_CANONICAL_PATH | presentation only |
| O-075 | ADR-0014 / Decisão | Interface oferece controles de execução, pausa, retry, cancelamento, prioridade, rodadas, reconciliação, evidência e publicação. | `SPEC-UI-001` | `SPEC-BACKEND-001`, `SPEC-DOM-001`, `SPEC-GIT-001`, `SPEC-PLAT-001` | `CANONICAL_OWNER` | YES | — | NEW_CANONICAL_PATH | requests, not authority |
| O-076 | ADR-0014 / Decisão | Vocabulário de publicação e estado terminal seguem ADR-0002; concluído só após confirmação remota. | `SPEC-UI-001` | `SPEC-DOM-001`, `SPEC-GIT-001`, `SPEC-BACKEND-001` | `CANONICAL_OWNER` | YES | PUBLICATION | NEW_CANONICAL_PATH / CUTOVER | presentation of canonical state |
| O-077 | ADR-0014 / Decisão | UI não é otimista: apresenta requested, accepted/rejected e confirmado; pausa/cancelamento aguardam checkpoint. | `SPEC-UI-001` | `SPEC-BACKEND-001`, `SPEC-DOM-001`, `SPEC-EXEC-002` | `CANONICAL_OWNER` | YES | — | NEW_CANONICAL_PATH | — |
| O-078 | ADR-0014 / Decisão | UI completa o acompanhamento operacional; e-mail permanece alerta de intervenção. | `SPEC-UI-001` | `SPEC-BACKEND-001`, `SPEC-OPS-001` | `CANONICAL_OWNER` | YES | — | NEW_CANONICAL_PATH | — |

Cardinalidade obrigatória: cada ID acima tem exatamente uma linha
`CANONICAL_OWNER`; consumidores não são owners. O resumo ADR→owner abaixo é
derivado desta tabela e não pode divergir dela.

### 8.3 Dependências normativas entre specs

Esta tabela é a única fonte canônica de edges diretos. `From` depende de `To`;
isto significa que `From` requer o contrato autoritativo de `To` para definir o
próprio comportamento. Edges de implementação, projeção e evidência não
entram no DAG normativo.

| From SPEC | To dependency SPEC | Dependency type | Reason | Source obligation | Direct or transitive |
|---|---|---|---|---|---|
| `SPEC-EXEC-001` | `SPEC-DOM-001` | `NORMATIVE` | identidades e lifecycle de execução | O-001, O-005 | DIRECT |
| `SPEC-EXEC-002` | `SPEC-DOM-001` | `NORMATIVE` | ciclo e estados de atividade | O-006, O-015, O-024 | DIRECT |
| `SPEC-EXEC-002` | `SPEC-EXEC-001` | `NORMATIVE` | contratos e registry de capabilities | O-016, O-020 | DIRECT |
| `SPEC-PLAT-001` | `SPEC-DOM-001` | `NORMATIVE` | identidades, estados e transições persistidos | O-001, O-010 | DIRECT |
| `SPEC-PLAT-001` | `SPEC-EXEC-001` | `NORMATIVE` | manifesto, versão e checkpoint | O-018, O-021 | DIRECT |
| `SPEC-REPO-001` | `SPEC-DOM-001` | `NORMATIVE` | identidade e enablement | O-004, O-058 | DIRECT |
| `SPEC-REPO-001` | `SPEC-EXEC-001` | `NORMATIVE` | catálogo bootstrap e configuração de skills | O-020, O-055 | DIRECT |
| `SPEC-REPO-001` | `SPEC-PLAT-001` | `NORMATIVE` | workspace candidato e persistência/recovery | O-032, O-058 | DIRECT |
| `SPEC-GIT-001` | `SPEC-DOM-001` | `NORMATIVE` | lifecycle, conformance e publicação | O-014, O-054 | DIRECT |
| `SPEC-GIT-001` | `SPEC-PLAT-001` | `NORMATIVE` | intenção, evidência e idempotência | O-033, O-044 | DIRECT |
| `SPEC-GIT-001` | `SPEC-REPO-001` | `NORMATIVE` | configuração/habilitação do repositório | O-055, O-058 | DIRECT |
| `SPEC-BACKEND-001` | `SPEC-DOM-001` | `NORMATIVE` | mapeia comandos e estados canônicos | O-010, O-011, O-061 | DIRECT |
| `SPEC-BACKEND-001` | `SPEC-EXEC-001` | `NORMATIVE` | envelopes e versões | O-016, O-018 | DIRECT |
| `SPEC-BACKEND-001` | `SPEC-EXEC-002` | `NORMATIVE` | sessões, leases e dispatch | O-022, O-029 | DIRECT |
| `SPEC-BACKEND-001` | `SPEC-PLAT-001` | `NORMATIVE` | journal, efeitos e recovery | O-033, O-036 | DIRECT |
| `SPEC-BACKEND-001` | `SPEC-REPO-001` | `NORMATIVE` | onboarding e configuração habilitada | O-055, O-062 | DIRECT |
| `SPEC-BACKEND-001` | `SPEC-GIT-001` | `NORMATIVE` | publicação e confirmação remota | O-047, O-048 | DIRECT |
| `SPEC-OPS-001` | `SPEC-PLAT-001` | `NORMATIVE` | projeção de journal/evidência operacional | O-032, O-069 | DIRECT |
| `SPEC-OPS-001` | `SPEC-BACKEND-001` | `NORMATIVE` | ingestão de eventos e correlação | O-061, O-072 | DIRECT |
| `SPEC-UI-001` | `SPEC-BACKEND-001` | `NORMATIVE` | comandos, snapshots e eventos | O-061, O-073 | DIRECT |
| `SPEC-UI-001` | `SPEC-OPS-001` | `NORMATIVE` | dashboards e replay operacional | O-069, O-073 | DIRECT |

There are 21 direct normative edges. No self-edge is valid. The graph below is
a derived `COMPLETE_VIEW` of exactly these edges, using the same direction as
the table (`consumer → dependency`); it is not a second source of truth:

```text
EXEC-001 ──> DOM
EXEC-002 ──> DOM + EXEC-001
PLAT ──────> DOM + EXEC-001
REPO ──────> DOM + EXEC-001 + PLAT
GIT ───────> DOM + PLAT + REPO
BACKEND ──> DOM + EXEC-001 + EXEC-002 + PLAT + REPO + GIT
OPS ──────> PLAT + BACKEND
UI ───────> BACKEND + OPS
```

The recommended specification order is the topological order derived from the
same list: `DOM → EXEC-001 → EXEC-002/PLAT-001 → REPO-001 → GIT-001 →
BACKEND-001 → OPS-001 → UI-001`. A slash denotes independent ready nodes, not
an additional edge. This section does not authorize branches, tickets or
commits.

## 9. Modelo-alvo de execução

O modelo integrado derivado das ADRs é:

```text
repositório descoberto
    ↓
configuração candidata + catálogo de bootstrap
    ↓ auditoria de onboarding
repositório ENABLED + configuração versionada
    ↓
ADRs ACCEPTED elegíveis
    ↓ snapshot imutável de execução
SPEC / Gap Matrix / Plano / tickets
    ↓ contratos e manifestos versionados
sessões Codex isoladas + assignments elegíveis + leases de capacidade
    ↓ journal/outbox + eventos + projeções
worktrees / branches / ondas / integração
    ↓ conformance contra a principal atual
candidato de publicação
    ↓ aprovação humana + fila serial
integração local ou PR + confirmação remota
    ↓
projeções do backend → frontend operacional
```

Cada etapa produz evidência persistida e correlacionada. A UI apenas consulta
snapshots, envia comandos e apresenta eventos confirmados.

## 10. Regras de autoridade e identidade

Estas regras atravessam todas as specs e devem ser referenciadas, não copiadas:

- ADR, SPEC, revisão, execução, ciclo auditável, etapa, atividade, assignment,
  ticket, onda, commit, efeito externo e publicação têm identidade própria;
- `decision_status` e `implementation_status` permanecem separados;
- uma ADR implementada é imutável; mudanças exigem ADR nova;
- uma execução congela ADRs, hashes, commit-base, configuração e versões de
  skills no snapshot;
- semântica canônica de identidade, lifecycle, estados, comandos de domínio,
  precondições, eventos de domínio, findings de auditoria e veredictos pertence
  ao `SPEC-DOM-001`; persistência e reconciliação pertencem ao `SPEC-PLAT-001`;
- `SPEC-BACKEND-001` possui somente orquestração de aplicação, envelopes de
  comando/query, mapeamento e transporte de eventos, correlação, replay,
  autenticação/autorização local e notificações; não redefine domínio,
  elegibilidade, publicação ou confirmação de efeitos;
- `SPEC-OPS-001` possui somente projeção operacional, telemetria, retenção,
  correlação, logs, backup e exportação; não redefine findings canônicos,
  eventos de domínio, transições ou confirmação de efeito;
- `SPEC-UI-001` possui interação, navegação, apresentação e projeções locais;
  nunca possui estado operacional canônico;
- commands de domínio validam pré-condições e produzem `requested`,
  `accepted/rejected` e efeito confirmado; backend apenas transporta/mapeia;
- efeitos externos usam intenção persistida, chave idempotente, evidência e
  confirmação; nenhuma publicação é concluída antes de
  `REMOTE_PUBLICATION_CONFIRMED`;
- relatórios operacionais e evidências intermediárias são projeções/records
  associados por hash, não autoridade documental das ADRs.

## 11. Requisitos normativos desta organização

### SPO-ORG-001 — Owner único

Cada comportamento normativo deve aparecer em exatamente uma spec componente
como owner. Outras specs podem declarar dependência e consumir o contrato, mas
não podem redefini-lo.

### SPO-ORG-002 — Autoridade ADR explícita

Cada spec componente deve listar as ADRs primárias, as ADRs relacionadas e a
revisão efetiva. Uma spec não pode depender de ADR `PROPOSED`, de texto de
descoberta ou de comportamento atual como autoridade.

### SPO-ORG-003 — Dependências acíclicas

As specs devem declarar dependências como contratos direcionados. O catálogo
deve permanecer acíclico; uma dependência compartilhada deve ser extraída para
o owner apropriado, nunca resolvida por duplicação.

### SPO-ORG-004 — Fronteira de projeção

Backend, API, frontend, relatórios e fixtures não podem se tornar autoridade
canônica de identidade, estado, elegibilidade, aprovação ou publicação.

### SPO-ORG-005 — Contratos transversais por referência

Identidade, máquina de estados, auditoria, contratos de skills, journal,
idempotência e vocabulário de publicação devem ter uma única definição
normativa e ser referenciados pelas specs consumidoras.

### SPO-ORG-006 — Componentes independentes

Cada spec componente deve possuir requisitos testáveis, critérios de aceitação,
gaps, dependências e evidência local suficientes para ser auditada sem exigir
que uma spec downstream complete seus próprios critérios.

### SPO-ORG-007 — Protótipo não normativo

O protótipo React e seus relatórios podem fornecer evidência de UX, cenários e
probes de domínio, mas não podem justificar a ausência de backend, persistência,
concorrência, integração externa ou autenticação na implementação de produção.

### SPO-ORG-008 — Compatibilidade explícita

Cada spec que toca dados, estados ou integrações deve distinguir caminho novo
canônico, compatibilidade legada, replay histórico e critérios de cutover.

### SPO-ORG-009 — Auditoria independente

Cada spec componente deve ser auditável por ciclo formal separado da
implementação e remediação. O implementador não pode aprovar sua própria
alteração.

### SPO-ORG-010 — Separação de fases

Esta organização deve preceder Gap Matrix, Plano de Implementação e tickets.
Nenhum desses artefatos pode ser incorporado nesta spec para esconder lacunas
de implementação ou decisões ainda não validadas.

## 12. Contrato mínimo de cada spec componente

Cada arquivo componente deve conter:

1. status, owner e autoridade ADR;
2. problema, objetivos e não objetivos;
3. estado atual observado e classificação dos gaps;
4. modelo-alvo limitado ao seu boundary;
5. identidade, autoridade e imutabilidade aplicáveis;
6. requisitos normativos com IDs próprios;
7. comandos, queries, eventos e falhas quando forem de seu ownership;
8. compatibilidade e migração;
9. suite de conformance positiva, negativa e de isolamento;
10. critérios de aceitação binários;
11. matriz de rastreabilidade ADR → requisito → gap → evidência;
12. dependências, riscos e detalhes intencionalmente não congelados;
13. definição de pronto para auditoria da spec.

Uma spec componente não deve incluir o plano de arquivos, a divisão de
commits, a tecnologia escolhida ou tickets, salvo quando já forem autoridade
de outra ADR.

## 13. Contrato de cada spec componente

### SPEC-DOM-001 — Workflow Authority and Governance

**Owns:** identidades, snapshots, lifecycle decisório/realização, agregados,
transições, ciclos de auditoria, veredictos, invalidação downstream e
conformance final.

**Must reference:** ADR-0001, ADR-0002, ADR-0009.

**Must not own:** schema de persistência, transporte HTTP, UI, algoritmo de
scheduler ou detalhes de GitHub.

**Primary conformance:** transições inválidas são rejeitadas; ADR implementada
permanece imutável; retorno normativo invalida downstream; ticket cancelado e
concluído permanecem terminais; a conformidade final não é inferida pela soma
de tickets.

### SPEC-EXEC-001 — Skill Contracts and Capability Registry

**Owns:** envelope JSON, JSON Schema, versionamento semântico, suporte de
versões, manifesto imutável, registro de capabilities e separação entre
catálogo normal e catálogo de bootstrap.

**Must reference:** ADR-0003 e as identidades de `SPEC-DOM-001`.

**Must not own:** elegibilidade do agente, leases, persistência de efeitos ou
decisões de aprovação.

**Primary conformance:** saída inválida, schema incompatível e veredito
desconhecido falham fechados; uma execução fixa versões exatas; capability
desconhecida não recebe fallback silencioso.

### SPEC-EXEC-002 — Agent Sessions and Scheduler

**Owns:** `AgentAssignmentId`, sessão nova por atividade, `ArtifactCycleId`,
segregação, elegibilidade, `AgentCapacityProvider`, leases, filas, prioridade
justa, concorrência global e despacho.

**Must reference:** ADR-0004, ADR-0005 e os contratos de
`SPEC-EXEC-001`.

**Must not own:** conteúdo semântico de skills, estados funcionais de tickets
ou transporte de eventos.

**Primary conformance:** nenhum spawn sem lease; capacidade `UNKNOWN` respeita
teto conservador; agente inelegível aguarda; prioridades não monopolizam o
pool; execuções independentes compartilham capacidade sem sobrescrever leases.

### SPEC-PLAT-001 — Persistence, Effects and Recovery

**Owns:** journal append-only, outbox, intenção antes do efeito, chaves
idempotentes, evidências, confirmação, reconciliação, checkpoints e recovery.

**Must reference:** ADR-0006 e as identidades/estados dos specs upstream.

**Must not own:** tecnologia específica de banco, semântica de Git/GitHub ou
retention/exportação detalhada de `SPEC-OPS-001`.

**Primary conformance:** `EXPECTED_INCOMPLETE_EFFECT`, `MISSING_EFFECT`,
`SEMANTIC_DIVERGENCE` e `CONFLICTING_EFFECT` produzem comportamentos distintos;
repetição reutiliza a chave; divergência real bloqueia sem escolher Git ou banco
silenciosamente.

### SPEC-REPO-001 — Repository Onboarding and Legacy Migration

**Owns:** configuração versionada, descoberta, validação, catálogo de
bootstrap, configuração candidata, workspace isolado, lifecycle de migração e
promoção atômica para `ENABLED`.

**Must reference:** ADR-0010, ADR-0001 e o catálogo de `SPEC-EXEC-001`.

**Must not own:** publicação final, execução normal de skills ou UI de
acompanhamento.

**Primary conformance:** onboarding não depende do runtime habilitado; falha,
pausa ou cancelamento preservam o workspace; configuração ativa não é mutada;
somente auditoria aprovada habilita o repositório.

### SPEC-GIT-001 — Worktrees, Waves and Publication

**Owns:** branches/worktrees por SPEC e ticket, ondas, integração, conflitos,
commits por SPEC, atualização da principal, fila serial, push direto, PR,
aprovação humana e confirmação remota.

**Must reference:** ADR-0007, ADR-0008, ADR-0009 e efeitos de
`SPEC-PLAT-001`.

**Must not own:** regras internas de tickets, tokens locais ou projeções de
frontend.

**Primary conformance:** nenhum commit mistura SPECs; nenhuma onda integra
ticket não aprovado; drift de base/head/árvore invalida aprovação; merge externo
ou PR fechada sem merge não conclui; não há reset destrutivo automático.

### SPEC-BACKEND-001 — Local API, Security and Notifications

**Owns:** serviço .NET autônomo, adapters de processos, API local, envelopes de
aplicação/transporte de commands/queries/events, autenticação local,
autorização de usuário único, redação de segredos e notificações de
intervenção. `SPEC-DOM-001` continua owner das semânticas de comandos de
domínio, precondições, eventos de domínio, estados e veredictos.

**Must reference:** ADR-0011, ADR-0012 e todos os contratos de domínio que a
API expõe.

**Must not own:** regra de domínio duplicada, estado de UI, persistência
específica ou decisão de publicação.

**Primary conformance:** backend continua sem navegador; API escuta somente em
localhost e exige token efêmero; comandos retornam correlação e aceitação;
eventos permitem replay/reconexão; secrets não aparecem em logs; notificações
são idempotentes e auditáveis.

### SPEC-OPS-001 — Observability, Retention, Backup and Export

**Owns:** correlação operacional, estado/projeções de observabilidade, duração,
consumo, logs, retenção indefinida até exclusão manual, backup, restauração e
exportação reconstruível. Findings, eventos, veredictos e confirmações
canônicos são consumidos como `DERIVED_PROJECTION`; seu significado pertence ao
owner registrado na matriz de obrigações.

**Must reference:** ADR-0013 e o journal de `SPEC-PLAT-001`.

**Must not own:** lifecycle do domínio, decisões de aprovação ou protocolo de
UI.

**Primary conformance:** eventos são correlacionáveis por repositório,
execução, SPEC, atividade, agente e efeito; exportação permite reconstruir a
história; exclusão exige confirmação e deixa registro mínimo; backup inclui
estado e arquivos externos associados.

### SPEC-UI-001 — Frontend Operational Client

**Owns:** snapshots, eventos, navegação, visualização de estados, filas, DAG,
intervenções, aprovação e evidências como experiência de cliente.

**Must reference:** ADR-0014, ADR-0011, ADR-0002, ADR-0005, ADR-0008 e
ADR-0013.

**Must not own:** identidade, elegibilidade, comandos confirmados, publicação,
segurança ou estado funcional.

**Primary conformance:** UI não fabrica estado otimista; mostra requested,
accepted/rejected e confirmado; usa vocabulário de publicação; recupera por
snapshot/replay; não apresenta concluído antes de
`REMOTE_PUBLICATION_CONFIRMED`.

## 14. Fronteiras de comandos, eventos, findings e evidências

| Classe | Canonical semantic owner | Mapping/projection owner | Authority type | Regra |
|---|---|---|---|---|
| `CANONICAL_DOMAIN_COMMAND` | `SPEC-DOM-001` (O-011) | `SPEC-BACKEND-001` (O-061) | `CANONICAL_OWNER` → `TRANSPORT_MAPPING` | backend não altera precondição, trigger ou terminalidade |
| `APPLICATION_COMMAND_ENVELOPE` | `SPEC-BACKEND-001` (O-061) | `SPEC-UI-001` (O-073/O-075) | `CANONICAL_OWNER` | envelope não redefine comando de domínio |
| `TRANSPORT_COMMAND` | `SPEC-BACKEND-001` (O-061) | `SPEC-UI-001` | `TRANSPORT_MAPPING` | rota/protocolo permanecem detalhes não congelados |
| `CANONICAL_DOMAIN_EVENT` | `SPEC-DOM-001` (O-010/O-014) | `SPEC-BACKEND-001` (O-061) | `CANONICAL_OWNER` → `TRANSPORT_MAPPING` | evento canônico é emitido pelo lifecycle proprietário |
| `INTEGRATION_EVENT` | owner do efeito/integração: `SPEC-PLAT-001` ou `SPEC-GIT-001` (O-033/O-047) | `SPEC-BACKEND-001`, `SPEC-OPS-001` | `CANONICAL_OWNER` → `DERIVED_PROJECTION` | origem define semântica; consumidores correlacionam |
| `TRANSPORT_EVENT` | `SPEC-BACKEND-001` (O-061) | `SPEC-OPS-001`, `SPEC-UI-001` | `TRANSPORT_MAPPING` | não vira autoridade por ser observável |
| `PROJECTION_EVENT` | source owner da semântica | `SPEC-OPS-001`/`SPEC-UI-001` | `DERIVED_PROJECTION` | representação pode mudar; significado não |

### Findings e evidências

| Classe | Owner semântico único | Consumidores | Authority type |
|---|---|---|---|
| `CANONICAL_AUDIT_FINDING` | `SPEC-DOM-001` (O-049/O-052) | all components | `CANONICAL_OWNER` |
| `AUDIT_REPORT` | `SPEC-DOM-001` para lifecycle/veredito; record externo ligado por hash | `SPEC-OPS-001`, `SPEC-UI-001` | `CANONICAL_OWNER` + `DERIVED_PROJECTION` |
| `OPERATIONAL_EVENT` | `SPEC-OPS-001` (O-069) | `SPEC-BACKEND-001`, `SPEC-UI-001` | `OPERATIONAL_PROJECTION` |
| `EFFECT_EVIDENCE` | `SPEC-PLAT-001` (O-033/O-036) | `SPEC-GIT-001`, `SPEC-REPO-001`, `SPEC-OPS-001`, `SPEC-UI-001` | `CANONICAL_OWNER` |
| `PUBLICATION_EVIDENCE` | `SPEC-GIT-001` (O-047/O-048) | `SPEC-DOM-001`, `SPEC-PLAT-001`, `SPEC-OPS-001`, `SPEC-UI-001` | `CANONICAL_OWNER` |
| `EXPORT_RECORD` | `SPEC-OPS-001` (O-071) | `SPEC-DOM-001`, `SPEC-UI-001` | `OPERATIONAL_PROJECTION` |
| `UI_PROJECTION` | source owner da semântica | `SPEC-UI-001` (O-073/O-077) | `DERIVED_PROJECTION` |

Consumidores podem persistir, correlacionar, transportar, exportar ou renderizar
essas classes. Não podem alterar trigger, significado, retryability,
terminalidade, recovery ou autoridade.

## 15. Failure semantics entre specs

A tabela é normativa para a semântica e os mapeamentos. Os nomes são
`PROVISIONAL_CANONICAL_LABEL`: podem receber alias rastreável durante a spec
componente, mas não podem mudar significado, retryability, terminalidade ou
recovery.

| Failure family | Codes/classes | Source ADR | Canonical semantic owner | Consumer SPECs | Transport mapping owner | UI presentation owner | Log/observability owner | Name stability | Recovery semantics owner |
|---|---|---|---|---|---|---|---|---|---|
| Repository | `UNKNOWN_REPOSITORY`, `REPOSITORY_NOT_ENABLED` | ADR-0010 | `SPEC-REPO-001` (O-055/O-058) | DOM, BACKEND, GIT, UI | `SPEC-BACKEND-001` | `SPEC-UI-001` | `SPEC-OPS-001` | `PROVISIONAL_CANONICAL_LABEL` | `SPEC-REPO-001` |
| SPEC/revision | `UNKNOWN_SPEC`, `INELIGIBLE_REVISION` | ADR-0001/0002 | `SPEC-DOM-001` (O-004/O-005) | EXEC, REPO, BACKEND, GIT, UI | `SPEC-BACKEND-001` | `SPEC-UI-001` | `SPEC-OPS-001` | `PROVISIONAL_CANONICAL_LABEL` | `SPEC-DOM-001` |
| Capability | `UNKNOWN_CAPABILITY`, `INCOMPATIBLE_CAPABILITY` | ADR-0003 | `SPEC-EXEC-001` (O-017/O-020) | EXEC-002, REPO, BACKEND, UI | `SPEC-BACKEND-001` | `SPEC-UI-001` | `SPEC-OPS-001` | `PROVISIONAL_CANONICAL_LABEL` | `SPEC-EXEC-001` |
| Dependency closure | `INVALID_DEPENDENCY_CLOSURE` | ADR-0002/0005 | `SPEC-DOM-001` (O-009/O-015) | EXEC-002, GIT, BACKEND, UI | `SPEC-BACKEND-001` | `SPEC-UI-001` | `SPEC-OPS-001` | `PROVISIONAL_CANONICAL_LABEL` | `SPEC-DOM-001` |
| Command basis | `INVALID_COMMAND_BASIS`, `STALE_REVISION` | ADR-0001/0002 | `SPEC-DOM-001` (O-003/O-011) | BACKEND, EXEC-002, GIT, UI | `SPEC-BACKEND-001` | `SPEC-UI-001` | `SPEC-OPS-001` | `PROVISIONAL_CANONICAL_LABEL` | `SPEC-DOM-001` |
| Local session | `UNAUTHORIZED_LOCAL_SESSION` | ADR-0012 | `SPEC-BACKEND-001` (O-065/O-066) | UI, OPS, GIT | `SPEC-BACKEND-001` | `SPEC-UI-001` | `SPEC-OPS-001` | `PROVISIONAL_CANONICAL_LABEL` | `SPEC-BACKEND-001` |
| Capacity/eligibility | `CAPACITY_UNKNOWN`, `CAPACITY_EXHAUSTED`, `AGENT_INELIGIBLE` | ADR-0005 | `SPEC-EXEC-002` (O-026/O-031) | DOM, BACKEND, UI, OPS | `SPEC-BACKEND-001` | `SPEC-UI-001` | `SPEC-OPS-001` | `PROVISIONAL_CANONICAL_LABEL` | `SPEC-EXEC-002` |
| Contract/verdict | `CONTRACT_INVALID`, `VERDICT_UNKNOWN` | ADR-0003/0009 | `SPEC-EXEC-001` (O-016/O-019) | DOM, EXEC-002, BACKEND, OPS, UI | `SPEC-BACKEND-001` | `SPEC-UI-001` | `SPEC-OPS-001` | `PROVISIONAL_CANONICAL_LABEL` | `SPEC-EXEC-001` |
| Effect reconciliation | `EXPECTED_INCOMPLETE_EFFECT`, `MISSING_EFFECT`, `SEMANTIC_DIVERGENCE`, `CONFLICTING_EFFECT` | ADR-0006 | `SPEC-PLAT-001` (O-033/O-036) | DOM, REPO, GIT, BACKEND, OPS, UI | `SPEC-BACKEND-001` | `SPEC-UI-001` | `SPEC-OPS-001` | `PROVISIONAL_CANONICAL_LABEL` | `SPEC-PLAT-001` |
| Publication | `PUBLICATION_DRIFT`, `MERGE_CONFLICT`, `REMOTE_PUBLICATION_UNCONFIRMED` | ADR-0007/0008 | `SPEC-GIT-001` (O-044/O-048) | DOM, PLAT, BACKEND, OPS, UI | `SPEC-BACKEND-001` | `SPEC-UI-001` | `SPEC-OPS-001` | `PROVISIONAL_CANONICAL_LABEL` | `SPEC-GIT-001` |
| Legacy compatibility | `LEGACY_COMPATIBILITY_ONLY` | ADR-0010 | `SPEC-REPO-001` (O-057/O-058) | DOM, PLAT, GIT, BACKEND, OPS, UI | `SPEC-BACKEND-001` | `SPEC-UI-001` | `SPEC-OPS-001` | `PROVISIONAL_CANONICAL_LABEL` | `SPEC-REPO-001` |

The hierarchy is fixed as: canonical failure semantic → application mapping →
transport representation → operational logging → UI presentation. A consumer
may change representation, never the semantic contract.

## 16. Compatibilidade, replay e cutover

Each cell is classified as `OWNER`, `CONSUMER` or `NOT_APPLICABLE`. `OWNER`
references an obligation and ADR; `CONSUMER` names the owner; `NOT_APPLICABLE`
records why this boundary has no independent obligation. Legacy support is an
adapter to the new canonical path, never a second canonical authority.

| SPEC | NEW_CANONICAL_PATH | LEGACY_COMPATIBILITY | HISTORICAL_REPLAY | CUTOVER | RETIREMENT |
|---|---|---|---|---|---|
| `SPEC-DOM-001` | `OWNER` O-003/O-005, ADR-0001 | `CONSUMER` `SPEC-REPO-001` | `OWNER` O-003/O-054, ADR-0001/0009 | `OWNER` O-053, ADR-0009 | `NOT_APPLICABLE` — preserves immutable domain history; boundary retirement belongs to adapter |
| `SPEC-EXEC-001` | `OWNER` O-016/O-020, ADR-0003 | `CONSUMER` `SPEC-REPO-001` | `OWNER` O-021, ADR-0003 | `OWNER` O-018, ADR-0003 | `NOT_APPLICABLE` — ADR-0003 does not assign registry retirement |
| `SPEC-EXEC-002` | `OWNER` O-022/O-030, ADR-0004/0005 | `NOT_APPLICABLE` — no legacy session authority | `CONSUMER` `SPEC-PLAT-001` / `SPEC-DOM-001` | `NOT_APPLICABLE` — no independent path cutover | `NOT_APPLICABLE` — no retirement obligation in ADR-0004/0005 |
| `SPEC-PLAT-001` | `OWNER` O-032/O-033, ADR-0006 | `CONSUMER` `SPEC-REPO-001` / `SPEC-GIT-001` | `OWNER` O-037/O-038, ADR-0006 | `OWNER` O-035, ADR-0006 | `NOT_APPLICABLE` — recovery preserves records; deletion is OPS-owned |
| `SPEC-REPO-001` | `OWNER` O-055/O-058, ADR-0010 | `OWNER` O-057, ADR-0010 | `CONSUMER` `SPEC-DOM-001` / `SPEC-PLAT-001` | `OWNER` O-058, ADR-0010 | `OWNER` O-057, ADR-0010 |
| `SPEC-GIT-001` | `OWNER` O-039/O-045, ADR-0007/0008 | `OWNER` O-044/O-045, ADR-0007/0008 | `OWNER` O-044, ADR-0007 | `OWNER` O-048, ADR-0008 | `OWNER` O-044/O-048, ADR-0007/0008 |
| `SPEC-BACKEND-001` | `OWNER` O-060/O-061, ADR-0011 | `CONSUMER` `SPEC-REPO-001` / `SPEC-PLAT-001` / `SPEC-GIT-001` | `OWNER` O-061, ADR-0011 (replay/reconnect mapping) | `CONSUMER` `SPEC-DOM-001` / `SPEC-REPO-001` / `SPEC-GIT-001` | `NOT_APPLICABLE` — no independent canonical data retirement |
| `SPEC-OPS-001` | `OWNER` O-069, ADR-0013 | `CONSUMER` `SPEC-REPO-001` / `SPEC-PLAT-001` / `SPEC-GIT-001` | `OWNER` O-071, ADR-0013 | `NOT_APPLICABLE` — ADR-0013 defines projection/retention, not canonical path cutover | `OWNER` O-070/O-071, ADR-0013 |
| `SPEC-UI-001` | `OWNER` O-073/O-077, ADR-0014 | `CONSUMER` `SPEC-BACKEND-001` / `SPEC-OPS-001` | `OWNER` O-073, ADR-0014 | `CONSUMER` `SPEC-GIT-001` / `SPEC-DOM-001` / `SPEC-BACKEND-001` | `NOT_APPLICABLE` — presentation follows source retirement |

For every owner cell, the canonical new behavior, legacy adaptation,
migration/reconciliation, cutover condition, retirement condition and
historical preservation are defined by the cited ADR and obligation. No
historical artifact is rewritten.

## 17. Suite de conformance do portfólio

Antes de gerar o Plano de Implementação, a validação deve provar:

### Positivos

- as 14 ADRs têm owner primário e aparecem na matriz de rastreabilidade;
- o grafo das nove specs é acíclico;
- cada requisito componente referencia ADR aceita;
- cada dependência possui owner declarado;
- uma execução conserva o snapshot de versões e autoridade;
- uma nova capability pode ser registrada sem nova regra de domínio.

### Negativos

- nenhuma spec pode redefinir uma transição de `SPEC-DOM-001`;
- frontend não pode confirmar efeito, lease, publicação ou aprovação;
- capability desconhecida não pode virar capability conhecida por fallback;
- PR criada não pode virar publicação concluída;
- divergência Git/banco não pode escolher uma fonte silenciosamente;
- onboarding não pode usar a configuração ativa como autoridade inicial;
- auditoria não pode reutilizar agente no mesmo ciclo.

### Isolamento

- `SPEC-BACKEND-001` expõe contratos, mas não se torna owner do domínio;
- `SPEC-UI-001` não cria uma segunda lista de repositórios ou estados;
- `SPEC-GIT-001` não modifica a semântica de tickets;
- `SPEC-OPS-001` não transforma relatório em autoridade de estado;
- protótipo não substitui a prova de persistência, concorrência ou integração
  externa.

### Extensibilidade sintética

Uma SPEC sintética composta somente por capabilities registradas deve ser
descobrível, elegível e executável sem:

- novo enum ou branch por categoria de SPEC no runtime;
- novo reviewer específico;
- nova página frontend específica;
- fallback para outra SPEC.

## 18. Matriz de rastreabilidade ADR → spec

| ADR | Owner primário | Specs consumidoras | Gap atual |
|---|---|---|---|
| ADR-0001 | `SPEC-DOM-001` | todas | implementação ausente; protótipo simulado |
| ADR-0002 | `SPEC-DOM-001` | EXEC-002, GIT-001, UI-001 | runtime de estados ausente |
| ADR-0003 | `SPEC-EXEC-001` | EXEC-002, REPO-001, BACKEND-001 | contratos e registry ausentes |
| ADR-0004 | `SPEC-EXEC-002` | BACKEND-001, OPS-001 | sessões/eligibilidade reais ausentes |
| ADR-0005 | `SPEC-EXEC-002` | BACKEND-001, UI-001 | scheduler persistido ausente |
| ADR-0006 | `SPEC-PLAT-001` | GIT-001, REPO-001, OPS-001, BACKEND-001 | journal/outbox ausentes |
| ADR-0007 | `SPEC-GIT-001` | REPO-001, OPS-001 | worktrees/integração reais ausentes |
| ADR-0008 | `SPEC-GIT-001` | BACKEND-001, UI-001 | GitHub/publicação ausentes |
| ADR-0009 | `SPEC-DOM-001` | todas | ciclos formais de produção ausentes |
| ADR-0010 | `SPEC-REPO-001` | BACKEND-001, GIT-001 | onboarding real ausente |
| ADR-0011 | `SPEC-BACKEND-001` | OPS-001, UI-001 | backend/API ausentes |
| ADR-0012 | `SPEC-BACKEND-001` | OPS-001, UI-001, GIT-001 | segurança/notificações ausentes |
| ADR-0013 | `SPEC-OPS-001` | BACKEND-001, UI-001 | observabilidade/backup ausentes |
| ADR-0014 | `SPEC-UI-001` | BACKEND-001, OPS-001 | frontend de produção ausente |

## 19. Gap taxonomy baseline

Não existe Gap Matrix anterior no repositório. Esta classificação inicial é
somente baseline para a futura Gap Matrix formal:

| Gap ID | Gap subject | Gap category | Closure status | Evidence type | Owner | Next gate |
|---|---|---|---|---|---|---|
| GAP-001 | Organização canônica da decomposição | `SPECIFICATION_GAP` | `OPEN` | `ARCHITECTURAL_AUTHORITY` | `SPEC-PORTFOLIO-001` | independent decomposition re-audit |
| GAP-002 | Conteúdo normativo das specs componentes | `SPECIFICATION_GAP` | `OPEN` | `NONE` | component SPEC owners | component SPEC audits |
| GAP-003 | Backend, persistência e integrações ausentes | `IMPLEMENTATION_GAP` | `OPEN` | `NONE` | future implementation plan | implementation validation |
| GAP-004 | Protótipo sem integrações reais | `PROTOTYPE_ONLY` | `NOT_APPLICABLE` | `PROTOTYPE_EVIDENCE` | prototype evidence owner | production conformance |
| GAP-005 | Banco, transporte, token, e-mail e framework não escolhidos | `UNFROZEN_IMPLEMENTATION_DETAIL` | `NOT_APPLICABLE` | `NONE` | component design | component design/audit |
| GAP-006 | Relatórios históricos do protótipo | `NON_GAP` | `NOT_APPLICABLE` | `HISTORICAL_EVIDENCE` | evidence governance | historical preservation check |

`CLOSED_BY_SPEC` não é categoria; `HISTORICAL_EVIDENCE` é evidence type. O
estado `OPEN` nesta baseline não é uma aprovação nem fechamento de finding.
Nenhuma arquitetura gap foi identificada pela auditoria de decomposição; isso
é uma observação local, não uma certificação. Se a revalidação encontrar
autoridade aceita contraditória ou exigir decisão nova, o resultado será
`ARCHITECTURE_DECISION_REQUIRED` e nenhuma escolha será feita aqui.

## 20. Dependências resumidas

Esta tabela é somente um resumo legível derivado do edge list canônico da
seção 8.3. Ela não substitui nem acrescenta edges ao DAG.

| Dependência | Por que é necessária | Bloqueia | Owner |
|---|---|---|---|
| Identidade e estados | todos os agregados precisam de autoridade comum | todas | `SPEC-DOM-001` |
| Contratos de skills | execução, onboarding e backend validam resultados estruturados | EXEC-002, REPO-001, BACKEND-001 | `SPEC-EXEC-001` |
| Journal e idempotência | efeitos externos e recovery precisam convergir | REPO-001, GIT-001, BACKEND-001, OPS-001 | `SPEC-PLAT-001` |
| Configuração habilitada | Git/publicação e runtime precisam de política por repositório | GIT-001, BACKEND-001 | `SPEC-REPO-001` |
| API/eventos | UI e observabilidade consomem o backend sem autoridade própria | OPS-001, UI-001 | `SPEC-BACKEND-001` |
| Evidência e exportação | auditoria humana precisa reconstruir uma execução | UI-001 e conformance | `SPEC-OPS-001` |

## 21. Riscos e mitigação

| Risco | Mitigação |
|---|---|
| Duplicação de autoridade entre specs | owner único obrigatório e auditoria de colisões |
| Backend virar segunda máquina de estados | `SPEC-DOM-001` owns transições; backend apenas aplica/comunica |
| Frontend fabricar estados | comandos/eventos confirmados e testes negativos de UI |
| Protótipo ser tratado como implementação | classificação `PROTOTYPE_ONLY` e conformance separada |
| Ciclo de onboarding depender do runtime | catálogo de bootstrap e workspace candidato isolados |
| Dois caminhos canônicos de publicação | `SPEC-GIT-001` owns vocabulário e confirmação remota |
| Falha parcial duplicar efeitos | journal/outbox, chaves idempotentes e reconciliação |
| Reutilização de agente em auditoria | `ArtifactCycleId` e histórico de assignments |
| Specs crescerem até uma mega-spec | limites explícitos e dependências direcionadas |
| Decisão de implementação vazar como arquitetura | seção de detalhes não congelados e ADR gate |

## 22. Detalhes intencionalmente não congelados

As seguintes escolhas permanecem abertas para as specs componentes e a
implementação, desde que os contratos das ADRs sejam preservados:

- tecnologia do banco local e estratégia de migrations;
- localização/estrutura física de logs e artefatos;
- protocolo concreto de eventos, replay e reconexão;
- rotas HTTP, DTOs internos e biblioteca de cliente;
- algoritmo concreto de fairness dentro das invariantes de ADR-0005;
- comandos e formato estruturado exatos do Codex CLI;
- mecanismo local de emissão/renovação do token efêmero;
- provedor SMTP/e-mail, templates e política de polling do GitHub;
- frequência e formato de backups/exports;
- tecnologia final do frontend e detalhes de navegação;
- alertas de volume e métricas quando o CLI não fornece consumo.

Esses itens não podem contradizer localhost, usuário único, aprovação humana,
idempotência, retenção, conformance, separação de autoridade ou imutabilidade.

## 23. Questões abertas

Não há questão arquitetural bloqueante para esta organização. Permanecem
questões de implementação que cada spec componente deve fechar ou deixar
explicitamente como escolha interna:

- qual protocolo de eventos fornece replay consistente com snapshots;
- qual banco local atende journal, backup e restauração testável;
- como o Codex CLI expõe capacidade, checkpoints e saída estruturada na versão
  suportada;
- como o token local é entregue ao navegador sem ampliar exposição de rede;
- como os adapters detectam checks, mergeability e drift do GitHub.

Se qualquer resposta exigir alterar ownership, autoridade, lifecycle ou
compatibilidade, o trabalho deve parar com `ARCHITECTURE_GAP` e uma nova ADR.

## 24. Critérios de aceitação

- [ ] Todas as ADR-0001–ADR-0014 aparecem na matriz ADR e no registro de obrigações.
- [ ] Cada obrigação O-001–O-078 tem exatamente um owner normativo.
- [ ] Cada consumidor está explicitamente classificado como não-autoritativo.
- [ ] Não há obrigação órfã ou colisão de ownership.
- [ ] Cada família de falha tem um único owner semântico.
- [ ] Compatibilidade, replay, cutover e retirement têm owner explícito onde aplicável.
- [ ] O DAG normativo canônico tem zero ciclos e zero self-edges.
- [ ] Tabela, diagrama, prosa e ordem derivam do mesmo edge set.
- [ ] Nenhuma SPEC upstream depende de autoridade de projeção downstream.
- [ ] Protótipo permanece não-autoritativo.
- [ ] Backend/API/OPS/UI permanecem mapping/projection onde aplicável.
- [ ] Categoria, status e evidence type de gaps são campos separados e enumerados.
- [ ] Inventário do repositório está sincronizado.
- [ ] Nenhuma arquitetura não suportada foi introduzida.
- [ ] Nenhum Gap Matrix, plano, ticket ou implementação foi gerado.

## 25. Gates de prontidão

### Gate A — decomposição

`PORTFOLIO_DECOMPOSITION_APPROVED` será uma decisão exclusiva da auditoria
independente. Este portfólio só pode solicitar o gate quando autoridade ADR,
ownership, consumidores, DAG, falhas, compatibilidade, projeções, inventário e
ausência de arquitetura inventada estiverem localmente demonstráveis.

### Gate B — portfólio materializado

`SPEC_PORTFOLIO_CONFORMANT` é um gate futuro e independente. Ele validará as
specs componentes geradas contra esta decomposição, incluindo ausência de drift,
duplicação, omissões e novos ciclos. Gate B não é pré-requisito para aprovar o
Gate A, e componentes ainda não gerados não são evidência do Gate A.

## 26. Definition of Done da decomposição

A decomposição está pronta para auditoria independente quando:

- autoridade ADR aceita está congelada e identificável;
- cada obrigação tem exatamente um owner e consumidores não-autoritativos;
- o grafo normativo completo é acíclico e todas as representações coincidem;
- ownership de falhas, compatibilidade/cutover e fronteiras de projeção é explícito;
- o inventário atual do repositório está sincronizado;
- nenhuma decisão arquitetural não suportada foi introduzida;
- nenhum artefato downstream foi gerado.

Isso não aprova a decomposição. Após aprovação independente, a geração das
specs componentes poderá começar.

## 27. Recomendação

Submeter esta revisão à auditoria independente de decomposição. Somente depois
de `PORTFOLIO_DECOMPOSITION_APPROVED` gerar e auditar as specs na ordem
topológica `DOM → EXEC-001 → EXEC-002/PLAT-001 → REPO-001 → GIT-001 →
BACKEND-001 → OPS-001 → UI-001`. Gap Matrix, Plano de Implementação e tickets
permanecem fases posteriores.
