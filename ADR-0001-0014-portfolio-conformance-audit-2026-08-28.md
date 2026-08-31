---
id: ADR-PORTFOLIO-AUDIT-2026-08-28
title: ADR-0001–ADR-0014 Portfolio Conformance Audit
status: COMPLETE
date: 2026-08-28
scope: [ADR-0001, ADR-0002, ADR-0003, ADR-0004, ADR-0005, ADR-0006, ADR-0007, ADR-0008, ADR-0009, ADR-0010, ADR-0011, ADR-0012, ADR-0013, ADR-0014]
verdict: ADR_PORTFOLIO_REMEDIATION_REQUIRED
---

# Auditoria de conformidade do portfólio ADR-0001–ADR-0014

## 1. Veredito

`ADR_PORTFOLIO_REMEDIATION_REQUIRED`

O portfólio possui cobertura arquitetural ampla e mantém a maior parte das decisões da descoberta, mas ainda não está internamente fechado para orientar o protótipo e a derivação automática de SPECs sem interpretações adicionais.

Foram encontrados **10 findings**:

- 2 `CRITICAL`;
- 7 `MAJOR`;
- 1 `MINOR`.

Nenhuma ADR foi modificada durante esta auditoria.

## 2. Escopo e baseline

Foram auditados os 14 arquivos `ADR-0001` a `ADR-0014`, todos com status `ACCEPTED`, contra:

- as decisões consolidadas da sessão de descoberta;
- coerência interna e entre ADRs;
- completude de autoridade para derivação de SPECs;
- implementabilidade do workflow;
- recuperação, idempotência e concorrência;
- governança de Git, PRs, commits, tickets e artefatos.

Os hashes SHA-256 do baseline auditado estão no Anexo A.

## 3. Resultado por eixo

| Eixo | Resultado | Observação |
|---|---|---|
| Cobertura do pipeline end-to-end | CONFORMANT | ADR-0001, 0002, 0007 e 0009 cobrem o fluxo completo. |
| Separação de responsabilidades | CONFORMANT | As 14 ADRs estão coesas e sem duplicação estrutural grave. |
| Contratos de skills | CONFORMANT_WITH_GAPS | Formato e versionamento estão definidos; faltam decisões complementares de checkpoint e efeito. |
| Segregação de agentes | CONFORMANT_WITH_GAPS | Regra está correta, mas a fronteira do ciclo precisa ser formalizada. |
| Máquinas de estados | NON_CONFORMANT | Estados foram listados sem transições normativas suficientes. |
| Idempotência e recuperação | CONFORMANT_WITH_GAPS | Journal/outbox está correto; divergência explicável e conflito real não foram separados. |
| Git/worktrees/commits | CONFORMANT_WITH_GAPS | Política central está coerente; falta fechar proteção do conteúdo pré-commit. |
| Publicação direta | CONFORMANT | Aprovação, fila, fetch, merge e push estão ordenados. |
| Publicação por PR | NON_CONFORMANT | Não preserva necessariamente o commit conformado nem a fila serial. |
| Migração legada | NON_CONFORMANT | Existe circularidade entre habilitação, configuração e skills de migração. |
| Segurança e operação local | CONFORMANT | Escopo local e controles estão coerentes. |
| Observabilidade e frontend | CONFORMANT | Cobertura suficiente para prototipação após remediação. |

## 4. Findings

### ASC-CRITICAL-001 — O modo Pull Request não garante publicação do conteúdo conformado

**ADRs afetadas:** ADR-0005, ADR-0007, ADR-0008, ADR-0009  
**Status:** `VALIDATED`  
**Impacto:** Uma PR pode ser merged externamente depois que a principal mudou. O merge produzido pelo GitHub pode não corresponder ao commit-base e à árvore sobre os quais a conformidade final foi emitida. Duas PRs também podem ser integradas fora da fila serial controlada localmente.

**Evidência:**

- ADR-0005 define fila de merge final exclusiva e serial.
- ADR-0008 determina que, no modo PR, a aprovação autoriza criar/atualizar a PR e a conclusão ocorre quando ela é merged.
- ADR-0009 exige conformidade contra o commit candidato exato.
- Não existe regra que obrigue a PR a permanecer atualizada com a principal, impeça merge externo fora da fila, ou invalide a conformidade quando o merge resultante não for a árvore auditada.

**Remediação requerida:**

Definir um protocolo único para PR:

1. PR aguarda aprovação e entrada na fila serial;
2. branch da SPEC é atualizada com a principal e reconformada;
3. o orquestrador verifica SHA da base, SHA da head, mergeability e checks;
4. o merge é autorizado somente se a principal continuar no SHA validado;
5. merge externo ou mudança de base invalida o veredito e força reconciliação/reconformidade;
6. a árvore resultante do merge deve ser verificável contra a árvore aprovada.

### ASC-CRITICAL-002 — O onboarding de repositório legado possui circularidade de bootstrap

**ADRs afetadas:** ADR-0003, ADR-0010, ADR-0011  
**Status:** `VALIDATED`  
**Impacto:** ADR-0010 exige migração por skills antes de habilitar o repositório, mas o registro de skills, a configuração versionada e os caminhos do próprio repositório fazem parte do mecanismo normalmente carregado no cadastro/habilitação. Não está definido como executar as skills sobre um repositório ainda não habilitado.

**Evidência:**

- ADR-0010: repositório legado deve migrar antes de ser habilitado.
- ADR-0010: configuração por repositório contém caminhos e convenções.
- ADR-0003: registro explícito/versionado mapeia etapas para skills.
- Não há autoridade para um modo de onboarding anterior ao runtime normal.

**Remediação requerida:**

Criar autoridade de bootstrap independente do repositório habilitado:

- catálogo de skills de onboarding pertencente ao sistema;
- configuração candidata isolada;
- workspace de migração dedicado;
- estados `DISCOVERED`, `VALIDATING`, `MIGRATING`, `AUDITING`, `READY_TO_ENABLE`, `ENABLED`;
- promoção atômica da configuração candidata somente após auditoria aprovada.

### ASC-MAJOR-001 — O lifecycle de ADR aceita e implementada está inconsistente

**ADRs afetadas:** ADR-0001 e README  
**Status:** `VALIDATED`  
**Impacto:** ADR-0001 torna imutável apenas ADR implementada. O README afirma que qualquer mudança posterior nas ADRs `ACCEPTED` deve ocorrer por nova ADR. Isso impediria o próprio ciclo atual de auditoria/remediação antes da implementação.

**Remediação requerida:**

Definir separadamente:

- estado decisório (`PROPOSED`, `ACCEPTED`, `SUPERSEDED`, `REJECTED`);
- estado de realização (`UNPROCESSED`, `PROCESSING`, `IMPLEMENTED`);
- regra de revisão: ADR `ACCEPTED` mas ainda não implementada pode ser remediada com incremento de revisão e histórico; ADR implementada é imutável e só muda por nova ADR.

Atualizar o README para refletir essa distinção.

### ASC-MAJOR-002 — O front matter não segue um schema uniforme

**ADRs afetadas:** ADR-0001–ADR-0014  
**Status:** `VALIDATED`  
**Impacto:** Somente ADR-0001 declara `supersedes` e `superseded_by`; nenhuma ADR declara versão do schema, revisão documental, estado de realização ou hash implementado. O orquestrador não poderá validar todas as ADRs pelo mesmo contrato.

**Remediação requerida:**

Definir schema YAML uniforme e aplicá-lo às 14 ADRs, incluindo pelo menos:

- `schema_version`;
- `id`, `title`, `decision_status`, `implementation_status`;
- `revision`, `date`, `decision_scope`;
- `supersedes`, `superseded_by`, `related`;
- campos nulos/listas vazias explícitos quando não aplicáveis.

O hash de implementação deve permanecer no registro operacional ou em campo claramente não autoritativo do documento, conforme decisão explícita.

### ASC-MAJOR-003 — A máquina funcional de tickets não define transições normativas

**ADRs afetadas:** ADR-0002, ADR-0007  
**Status:** `VALIDATED`  
**Impacto:** Os estados estão listados, mas não estão definidas todas as origens/destinos válidos. Em especial, o commit documental cria tickets diretamente em `READY` ou `BLOCKED`; a implementação aprovada precisa produzir `IMPLEMENTED`; a finalização da onda produz `COMPLETED`; e `CANCELLED` pode ser alcançado de estados diferentes.

**Remediação requerida:**

Adicionar tabela normativa de transições, comandos, guards e efeitos. Cobrir no mínimo:

- `DRAFT → READY | BLOCKED | CANCELLED`;
- `BLOCKED → READY | CANCELLED`;
- `READY → IMPLEMENTED | CANCELLED`;
- `IMPLEMENTED → COMPLETED`;
- terminalidade de `COMPLETED` e `CANCELLED`;
- proibição de reabertura;
- distinção entre estado funcional no Git e estado operacional no banco.

### ASC-MAJOR-004 — A fronteira do ciclo de elegibilidade do agente é insuficientemente formal

**ADRs afetadas:** ADR-0001, ADR-0004, ADR-0009  
**Status:** `VALIDATED`  
**Impacto:** A regra “mesmo ciclo do mesmo artefato” foi preservada, mas não há evento normativo de início/fim do ciclo nem regra completa para aprovação, cancelamento, retorno tardio e nova execução. Isso impede o scheduler de decidir elegibilidade deterministicamente.

**Remediação requerida:**

Definir `ArtifactCycleId` e lifecycle:

- criado quando uma revisão entra em sua primeira atividade auditável;
- preservado em todas as rodadas e retornos downstream da mesma execução;
- encerrado por aprovação formal ou cancelamento terminal;
- nova execução sobre nova revisão cria novo ciclo;
- histórico de `AgentAssignmentId` é indexado pelo ciclo.

### ASC-MAJOR-005 — Capacidade dinâmica não possui semântica quando o Codex CLI não informa capacidade

**ADRs afetadas:** ADR-0004, ADR-0005, ADR-0011  
**Status:** `VALIDATED`  
**Impacto:** A decisão exige detectar capacidade real e nunca ultrapassá-la, mas não define o que acontece quando o CLI não disponibiliza um contador confiável. Tentativas cegas podem virar falhas operacionais ou exceder a intenção de concorrência.

**Remediação requerida:**

Definir uma abstração `AgentCapacityProvider` com:

- capacidade conhecida e vagas disponíveis quando suportado;
- estado `UNKNOWN` quando não suportado;
- limite conservador configurado como teto de fallback;
- reserva/lease antes do spawn;
- liberação por término/reconciliação;
- recusa de despacho quando não houver capacidade ou lease confirmada.

### ASC-MAJOR-006 — Recuperação automática e divergência Git/banco não distinguem casos reparáveis de conflito real

**ADRs afetadas:** ADR-0006  
**Status:** `VALIDATED`  
**Impacto:** A ADR determina recuperação automática por evidência, mas também bloqueia toda divergência Git/banco. Um crash depois do commit e antes da confirmação no banco produziria divergência esperada que deveria ser reparada automaticamente, não exigir intervenção.

**Remediação requerida:**

Classificar reconciliação:

- `EXPECTED_INCOMPLETE_EFFECT`: intenção pendente + evidência idempotente correspondente → confirmar automaticamente;
- `MISSING_EFFECT`: intenção pendente sem evidência → repetir com mesma chave;
- `SEMANTIC_DIVERGENCE`: estados incompatíveis sem intenção/evidência correlata → bloquear e solicitar decisão;
- `CONFLICTING_EFFECT`: evidência existe, mas conteúdo/hash diverge → bloquear.

### ASC-MAJOR-007 — O conteúdo auditado antes do commit documental não está protegido contra drift

**ADRs afetadas:** ADR-0007, ADR-0009  
**Status:** `VALIDATED`  
**Impacto:** ADR-0007 exige registrar o hash da árvore antes do commit, mas não exige revalidar esse hash imediatamente antes de criar o commit documental. SPEC, Gap Matrix, plano e tickets podem passar por várias sessões sem commit.

**Remediação requerida:**

Definir um `DocumentCandidateTreeHash`:

- calculado no veredito final da documentação;
- associado a todos os artefatos e aprovações do conjunto;
- comparado novamente imediatamente antes do commit;
- qualquer drift invalida a aprovação e retorna o artefato afetado à auditoria;
- o commit documental registra a árvore aprovada e sua correlação.

### ASC-MINOR-001 — A terminologia de publicação não separa candidato, integração e publicação remota

**ADRs afetadas:** ADR-0002, ADR-0007, ADR-0008, ADR-0014  
**Status:** `VALIDATED`  
**Impacto:** Termos como “merge final”, “publicação”, “integrar” e “concluir” são usados em momentos diferentes para push direto e PR, dificultando estados e rótulos da interface.

**Remediação requerida:**

Padronizar termos:

- `PUBLICATION_CANDIDATE_READY`;
- `AWAITING_PUBLICATION_APPROVAL`;
- `LOCAL_INTEGRATION_PENDING/COMPLETE` para push direto;
- `PR_OPEN/AWAITING_PR_MERGE/PR_MERGED` para PR;
- `REMOTE_PUBLICATION_CONFIRMED` como conclusão comum.

## 5. Pontos conformes que devem ser preservados

1. Um commit nunca mistura SPECs.
2. Sessão Codex nova e `AgentAssignmentId` por atividade.
3. Agente não retorna ao mesmo ciclo do artefato.
4. Skills usam JSON/JSON Schema e versionamento semântico.
5. Scheduler respeita capacidade, prioridade justa e DAG.
6. Tickets usam worktrees e branches isoladas.
7. Onda integra somente com todos os tickets aprovados.
8. Principal é merged na branch da SPEC sem rebase automático.
9. Conformidade é repetida contra a principal atualizada.
10. Publicação exige aprovação humana.
11. Falhas usam efeitos idempotentes e journal/outbox.
12. Relatórios operacionais ficam fora do Git.
13. Backend é autônomo, local e independente do frontend.
14. Repositórios legados exigem migração auditada.

## 6. Ordem recomendada de remediação

| Ordem | Finding | Motivo |
|---|---|---|
| 1 | ASC-MAJOR-001 | Libera a alteração das ADRs aceitas ainda não implementadas. |
| 2 | ASC-MAJOR-002 | Estabelece schema uniforme para todas as remediações. |
| 3 | ASC-CRITICAL-002 | Remove a circularidade de onboarding. |
| 4 | ASC-MAJOR-003 | Fecha o contrato funcional dos tickets. |
| 5 | ASC-MAJOR-004 | Fecha a elegibilidade de agentes. |
| 6 | ASC-MAJOR-005 | Torna o scheduler implementável. |
| 7 | ASC-MAJOR-006 | Fecha recuperação e reconciliação. |
| 8 | ASC-MAJOR-007 | Protege a auditoria pré-commit. |
| 9 | ASC-CRITICAL-001 | Fecha publicação por PR com base exata. |
| 10 | ASC-MINOR-001 | Uniformiza estados e UX de publicação. |

## 7. Critério de fechamento

O próximo veredito poderá ser `ADR_PORTFOLIO_APPROVED` somente quando:

- todos os findings críticos e major estiverem remediados;
- o finding minor estiver remediado ou formalmente aceito como follow-up;
- as 14 ADRs compartilharem schema uniforme;
- uma nova auditoria confirmar ausência de regressão;
- hashes do novo baseline forem registrados.

## 8. Resultado estruturado

```json
{
  "schema_version": "1.0.0",
  "audit_id": "ADR-PORTFOLIO-AUDIT-2026-08-28",
  "scope": {
    "first": "ADR-0001",
    "last": "ADR-0014",
    "count": 14
  },
  "verdict": "ADR_PORTFOLIO_REMEDIATION_REQUIRED",
  "findings": {
    "critical": 2,
    "major": 7,
    "minor": 1,
    "total": 10
  },
  "modified_adrs": [],
  "next_action": "REMEDIATE_ADR_PORTFOLIO"
}
```

## Anexo A — SHA-256 do baseline

| ADR | SHA-256 |
|---|---|
| ADR-0001 | `0c0d72e439172257d40208f1f3e3de3f4730ce714e8d8a0a6bdfc6900a6b466a` |
| ADR-0002 | `3d440a658d23e198f3430617a9c7ea9ae44b92e9a2a14d29fd57d7e4b0900dae` |
| ADR-0003 | `054c895789e9e78dd433a228b93258e02003fee4be6d6ebaf0898f94aed92f52` |
| ADR-0004 | `00c72302286e7736428f966984ec35d1e96af67a6d768402c5fd7846b2206363` |
| ADR-0005 | `925fb62972dced5bbaec6afeec0c715300be758f62fda2eb7f8020c43ddd766c` |
| ADR-0006 | `ce54aaaa81e246feaa473a037721fd125f17350ffb41352a99c645e868de796a` |
| ADR-0007 | `4601145fce8b84575883ab73e9f0d70cb5b62573246d78284a6fc71c78f30e5a` |
| ADR-0008 | `6efe266b7602a7b199ec516ba2be2e7758fadec5bb8d3d77bdb5c059228d1522` |
| ADR-0009 | `b16c69b9be77ca24be4e3e33b68d6ada2bbb0fb64c8c02c693bf57545aa7c322` |
| ADR-0010 | `59bd7c2b5f79dc7d0bff974a3d17b744c99fc8480252c1ee29d12759bec79d2d` |
| ADR-0011 | `6acc81dd7f3a892a7664d8f103e8999f1c6a0fcc65125d53f17fcd2a2f91f514` |
| ADR-0012 | `8b777cd0a95bc6df8413f3bd5b49277be2d3476991fce4ebd3e94ed014a0b266` |
| ADR-0013 | `02f341645429fde17518768a58d6cab1163426d5284950096a7e5ea738a4eaed` |
| ADR-0014 | `5b269cd3c8b754ea4807310e9f1b23a8270b715a32bdb2139fa01dce7157138e` |
