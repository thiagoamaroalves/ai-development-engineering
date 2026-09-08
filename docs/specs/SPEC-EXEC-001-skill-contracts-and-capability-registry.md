---
schema_version: "1.0.0"
id: SPEC-EXEC-001
title: Skill Contracts and Capability Registry
status: PROPOSED
revision: 1
date: 2026-09-08
spec_scope: execution-contracts
portfolio: SPEC-PORTFOLIO-001
portfolio_revision: 2
portfolio_verdict: PORTFOLIO_DECOMPOSITION_APPROVED
portfolio_audit: docs/specs/SPEC-PORTFOLIO-001-decomposition-audit.md
authoritative_adrs: [ADR-0003]
related_adrs: [ADR-0001, ADR-0002, ADR-0006, ADR-0009, ADR-0010, ADR-0011]
upstream_dependencies: [SPEC-DOM-001]
---

# SPEC-EXEC-001 — Skill Contracts and Capability Registry

## 1. Status

`PROPOSED` — primeira materialização do boundary EXEC-001 a partir do
portfolio aprovado.

Generation baseline:

| Campo | Valor |
|---|---|
| Target component | `SPEC-EXEC-001` |
| Portfolio | `SPEC-PORTFOLIO-001` revision `2` |
| Portfolio audit | `docs/specs/SPEC-PORTFOLIO-001-decomposition-audit.md` |
| Portfolio verdict | `PORTFOLIO_DECOMPOSITION_APPROVED` |
| Primary ADR | `ADR-0003` revision `3`, `ACCEPTED` |
| Upstream dependency | `SPEC-DOM-001` revision `2`, audit `PASS — COMPONENT_SPEC_CONFORMANT` |
| Repository HEAD | `b1c2c4ab81ba716ccd079f80f187f6b773e0655f` |
| Existing target draft | ausente |
| Prior Gap Matrix | ausente |
| Gate | `READY_FOR_INDEPENDENT_COMPONENT_SPEC_AUDIT` |

Esta SPEC ainda não é aceita. Sua aceitação depende de auditoria independente
da SPEC. A decomposição do portfolio, a autoridade das ADRs e o contrato
canônico de DOM não são redefinidos aqui.

## 2. Ownership

### Owns

Este componente é o owner normativo de:

- envelope JSON comum e payload específico por capacidade, validados por JSON
  Schema;
- versionamento semântico, versões suportadas e compatibilidade de contratos;
- fixação das versões exatas de skill/contrato usadas por uma execução;
- falhas canônicas de contrato e de capacidade;
- registro explícito e versionado de skills/capabilities;
- separação entre catálogo normal habilitado e catálogo bootstrap;
- manifesto imutável completo de atividade, incluindo checkpoints seguros e
  informações de retomada.

Esses limites correspondem exatamente às obrigações `O-016…O-021` do
portfolio.

### Consumes

- `SPEC-DOM-001`: identidades canônicas, revisão, lifecycle, ArtifactId,
  ActivityId, AttemptId, AgentId, ArtifactCycleId, snapshot e estados
  canônicos. O consumo é referencial; EXEC-001 não redefine a semântica DOM.

Consumidores não-autoritários deste componente incluem `SPEC-EXEC-002`,
`SPEC-REPO-001` e `SPEC-BACKEND-001`. Eles podem validar, despachar, mapear ou
projetar os contratos, mas não alteram a semântica canônica desta SPEC.

### Does not own

- identidades, lifecycle ou transições canônicas dos agregados de domínio;
- criação de sessões Codex, assignments, elegibilidade de agentes, leases,
  filas ou scheduler (`SPEC-EXEC-002`);
- journal, outbox, intenção de efeito, evidência, idempotência operacional ou
  recovery físico (`SPEC-PLAT-001`);
- configuração habilitada de repositório, bootstrap operacional, migração ou
  habilitação (`SPEC-REPO-001`);
- processo de execução do Codex, API, transporte, autenticação, notificações
  ou mapeamentos de aplicação (`SPEC-BACKEND-001`);
- interpretação de texto humano como aprovação, retomada ou efeito;
- implementação de adapters, classes, módulos, banco, rotas ou protocolos não
  congelados por ADR.

## 3. Portfolio Authority

| Fonte | Uso nesta SPEC |
|---|---|
| `docs/specs/SPEC-PORTFOLIO-001-organization.md` | ownership, registry O-016…O-021, falhas, compatibilidade e DAG |
| `docs/specs/SPEC-PORTFOLIO-001-decomposition-audit.md` | aprovação independente mais recente; `PORTFOLIO_DECOMPOSITION_APPROVED` |
| `docs/specs/audits/SPEC-DOM-001-component-conformance-audit.md` | auditoria upstream mais recente; `PASS — COMPONENT_SPEC_CONFORMANT` |
| `docs/specs/SPEC-DOM-001-workflow-authority-and-governance.md` | contrato upstream de identidade, revisão, snapshot e lifecycle |

Esta especificação materializa ownership já atribuído pelo portfolio aprovado
e não redefine fronteiras do portfolio.

## 4. ADR Authority

### Primary accepted ADR

| ADR | Status | Seções/decisões usadas | Consequência local |
|---|---|---|---|
| `ADR-0003` | `ACCEPTED`, revision `3` | `Decisão` | contratos JSON Schema, envelope comum, semver, versões suportadas, snapshot exato, falha fechada, registry normal/bootstrap e manifesto imutável |

### Related accepted ADRs

| ADR | Uso sem transferência de ownership |
|---|---|
| `ADR-0001` | DOM fornece identidade/revisão e snapshot; EXEC-001 registra referências de versões, sem possuir a identidade DOM. |
| `ADR-0002` | estados, comandos e veredictos de workflow permanecem DOM-owned; resultados de skill são consumidos como contratos, não como nova máquina de estado. |
| `ADR-0006` | persistência, idempotência de efeitos e recovery físico pertencem a PLAT; o manifesto fornece a base contratual de retomada. |
| `ADR-0009` | veredito estruturado e ciclos de auditoria permanecem DOM-owned; EXEC-001 valida o envelope e o conjunto declarado de vereditos. |
| `ADR-0010` | REPO consome o catálogo normal/bootstrap para onboarding e migração; EXEC-001 não habilita repositório. |
| `ADR-0011` | BACKEND valida e transporta resultados estruturados; não pode alterar contrato ou falha canônica. |

## 5. Problem Statement

ADR-0003 exige que skills sejam componentes contratuais, com JSON validado,
versionamento explícito, registry de capabilities e manifesto imutável. O
repositório atual não possui runtime produtivo, schemas, registry, catálogo
bootstrap ou manifesto operacional. O único comportamento existente é uma
simulação em memória no protótipo, que contém versões e campos semelhantes,
mas não é autoridade nem prova de integração.

Sem este boundary, um consumidor poderia interpretar texto livre, aceitar
payloads incompatíveis, confundir capability desconhecida com ausência
temporária, usar a versão atual em vez da versão congelada, ou retomar uma
atividade sem manifesto e checkpoint verificáveis. A satisfação desta SPEC
permite que execução, onboarding e backend validem resultados
deterministicamente, mantendo a semântica de identidade e lifecycle em DOM e
as consequências persistentes/externas nos owners correspondentes.

## 6. Goals

- Todo resultado de skill válido deve ser validável por envelope comum e
  schema específico, sem depender de texto humano.
- Cada consumidor deve conhecer as versões de contrato suportadas e rejeitar
  incompatibilidade sem conversão silenciosa.
- Cada execução deve referenciar versões exatas congeladas no snapshot DOM e
  no manifesto imutável da atividade.
- O registry deve resolver etapa, capability, skill, versões, artefatos,
  vereditos e restrições de papel de maneira explícita e versionada.
- O catálogo bootstrap deve existir independentemente da configuração normal e
  ser limitado às capacidades de onboarding autorizadas por ADR-0003.
- Uma atividade deve poder ser auditada e retomada a partir de manifesto,
  artefatos/resultados persistidos e checkpoints seguros declarados, sem
  transformar texto ou estado transitório em autoridade.

## 7. Non-Goals

- Implementar o runtime de skills, Codex, scheduler, API ou persistência.
- Definir identidade, estado, transição, veredito de domínio ou lifecycle de
  `SPEC-DOM-001`.
- Definir sessões/assignments de agentes, capacidade ou leases.
- Definir execução, confirmação ou reconciliação de efeitos externos.
- Escolher tecnologia de schema, banco, transporte, SDK, linguagem ou adapter.
- Criar Gap Matrix, Plano de Implementação, tickets ou código de produção.
- Criar fases de migração, além do contrato de compatibilidade que este
  boundary owns.

## 8. Current Repository State

| Área | Current behavior | Target behavior | Classification |
|---|---|---|---|
| ADR-0003 | documento aceito, revision 3, não implementado | autoridade identificável para todos os contratos EXEC-001 | `ALREADY_CONFORMANT` |
| Portfolio e registry de obrigações | O-016…O-021 atribuídos uma única vez a EXEC-001 | boundary preservado | `ALREADY_CONFORMANT` |
| Upstream DOM | SPEC revision 2; auditoria independente `PASS — COMPONENT_SPEC_CONFORMANT` | consumir IDs, revisão, snapshot e lifecycle canônicos | `ALREADY_CONFORMANT` |
| Schemas JSON produtivos | não encontrados | envelope e payload validáveis independentemente | `IMPLEMENTATION_GAP` |
| Registry normal/bootstrap | não encontrado fora da simulação | catálogo explícito, versionado e separado | `IMPLEMENTATION_GAP` |
| Manifesto produtivo de atividade | não encontrado | manifesto imutável com versões e checkpoints | `IMPLEMENTATION_GAP` |
| Runtime/adapters de skills | não encontrados | consumidores usam contratos sem texto autoritativo | `IMPLEMENTATION_GAP` |
| `prototype/src/mockDomain.ts` | simula envelope/campos de skill, versões e checkpoints em memória | evidência de cenário, não implementação ou autoridade | `PROTOTYPE_ONLY` |
| `prototype/tests/*` | exercita mock e UI, não schemas/registry produtivos | conformance independente contra implementação real | `PROTOTYPE_ONLY` |
| Gap Matrix | ausente | artefato downstream após validação desta SPEC | `NON_GAP` |
| Tecnologia de schema/registro/transporte | não congelada por ADR | liberdade de implementação preservada | `UNFROZEN_IMPLEMENTATION_DETAIL` |
| Architecture gap | nenhuma encontrada pela auditoria do portfolio | nenhum novo decision point nesta SPEC | `NON_GAP` |

## 9. Owned Architectural Obligations

| ID | ADR / seção | Tratamento nesta SPEC | Requisitos |
|---|---|---|---|
| O-016 | ADR-0003 / Decisão | envelope comum, payload específico e validação JSON Schema | EXEC-ENVELOPE-001, EXEC-ENVELOPE-002 |
| O-017 | ADR-0003 / Decisão | semver e versões suportadas declaradas | EXEC-VERSION-001, EXEC-VERSION-002 |
| O-018 | ADR-0003 / Decisão | versão exata congelada por execução e cutover por revisão | EXEC-SNAPSHOT-001, EXEC-MANIFEST-003 |
| O-019 | ADR-0003 / Decisão | falha fechada para JSON/schema/veredito e resultado estruturado | EXEC-CONTRACT-001, EXEC-CONTRACT-002, EXEC-FAILURE-001 |
| O-020 | ADR-0003 / Decisão | registry versionado, catálogo normal/bootstrap e extensibilidade | EXEC-REGISTRY-001, EXEC-REGISTRY-002, EXEC-REGISTRY-003, EXEC-CAPABILITY-001, EXEC-CAPABILITY-002 |
| O-021 | ADR-0003 / Decisão | manifesto completo imutável, checkpoints seguros e retomada | EXEC-MANIFEST-001, EXEC-MANIFEST-002, EXEC-MANIFEST-003, EXEC-HISTORY-001 |

Cada obrigação possui requisito, critério de aceitação e cobertura de
conformance nas seções 21–23.

## 10. Consumed Contracts

| Owner SPEC | Contract / requirement | Why consumed | Local rule |
|---|---|---|---|
| `SPEC-DOM-001` | `DOM-ID-001`, `DOM-SNAPSHOT-001`, `DOM-LINEAGE-001`, `DOM-LIFE-001`, `DOM-AUDIT-002` | relacionar execução, atividade, ciclo, revisão, snapshot e veredito a contratos de skill | usar IDs/revisões canônicos; não criar identidade, lifecycle ou veredito DOM alternativo |
| `SPEC-DOM-001` | `DOM-CMD-001`, `DOM-ADV-001` | rejeições de contrato podem impedir avanço de domínio | propagar precondição/falha; validação de contrato não aprova transição DOM |

`SPEC-DOM-001` é a única dependência normativa upstream aprovada. Os
componentes `SPEC-EXEC-002`, `SPEC-REPO-001` e `SPEC-BACKEND-001` são
consumidores downstream deste contrato e não são dependencies desta SPEC.

## 11. Target Behavioral Model

```text
registro versionado + manifesto/atividade DOM + payload JSON recebido
        ↓
resolver versão/capability → validar envelope e payload por schema
        ↓
resultado estruturado validado OU falha canônica fail-closed
        ↓
consumidor recebe versão/veredito/artefatos/evidências/checkpoint
        ↓
DOM decide lifecycle; EXEC-002 despacha; PLAT persiste/reconcilia;
BACKEND transporta; OPS/UI projetam
```

O registry e os schemas são a fonte canônica do contrato EXEC-001. O snapshot,
as identidades e os estados de execução permanecem canônicos em DOM. Um
resultado de skill pode solicitar efeitos e informar evidência, mas não
confirma efeito externo nem altera estado de domínio por si só.

## 12. Identity and Authority Rules

| Identidade/conceito | Canonical owner | Reference identity | Local correlation | Derived projection |
|---|---|---|---|---|
| `ExecutionId`, `ActivityId`, `AttemptId`, `ArtifactCycleId`, `AgentId` | DOM | referência recebida no envelope/manifesto | correlation de contrato/execução | nome/status exibido |
| `SkillContractId` + versão | EXEC-001 | entrada do registry | request/result correlation | nome da skill |
| `CapabilityId` + versão | EXEC-001 | entrada do registry e capability requerida | resolution correlation | label/categoria |
| `ContractVerdict` | EXEC-001 para validade do contrato; DOM para veredito de lifecycle | campo estruturado do envelope | result correlation | texto/status de consumidor |
| `Manifest` record + schema basis | EXEC-001 como owner contratual; `ArtifactId`, `ActivityId` e `AttemptId` permanecem referências DOM-owned | manifesto da atividade | checkpoint/resume correlation | resumo operacional |
| `SchemaId` + versão | EXEC-001 | referência no registry/envelope | validation correlation | metadado técnico |

Os IDs de agregados e sua revisão não podem ser substituídos por nomes de
arquivo, labels, títulos ou campos de transporte. `SkillContractId`,
`CapabilityId` e `SchemaId` são identificadores contratuais locais; o manifesto
é vinculado às identidades DOM recebidas e não cria uma identidade canônica
concorrente.

## 13. Normative Requirements

### EXEC-ENVELOPE-001 — Envelope e payload validáveis

Toda skill deve produzir um envelope JSON comum e um payload específico da
capability. O envelope e o payload devem ser validados contra schemas
identificáveis antes de o resultado ser consumido como contrato. A presença de
texto humano não dispensa a validação nem possui autoridade operacional.

Authority: `O-016`, `ADR-0003`, `Decisão`.

### EXEC-ENVELOPE-002 — Conteúdo mínimo do envelope

O envelope comum deve representar, com campos estruturados, versão, execução,
atividade, atribuição de agente, artefato/ciclo, rodada/tentativa, status de
execução, veredito funcional, checkpoints, artefatos, evidências, findings,
efeitos solicitados e erros. Um consumidor não pode inferir a ausência desses
elementos a partir de texto livre.

Authority: `O-016`, `ADR-0003`, `Decisão`.

### EXEC-VERSION-001 — Versionamento semântico

Cada contrato de skill e capability deve declarar versão semântica. `major`
indica mudança incompatível, `minor` adiciona evolução compatível por campos
opcionais e `patch` corrige sem mudar semântica. A classificação deve ser
observável no registry e no resultado aplicável.

Authority: `O-017`, `ADR-0003`, `Decisão`.

### EXEC-VERSION-002 — Versões suportadas explícitas

O consumidor autoritativo de contratos deve declarar o conjunto de versões
suportadas para cada contrato/capability aplicável. Uma versão fora desse
conjunto, quando associada à resolução de uma capability, deve produzir
`INCOMPATIBLE_CAPABILITY`; payload ou schema inválido continua produzindo
`CONTRACT_INVALID`. Nenhuma versão pode ser aceita por aproximação de major,
alias não registrado ou conversão silenciosa.

Authority: `O-017`, `ADR-0003`, `Decisão`.

### EXEC-SNAPSHOT-001 — Versão exata congelada

Antes da execução, as versões exatas dos contratos e skills aplicáveis devem
ser fixadas no snapshot imutável de DOM e referenciadas pelo manifesto da
atividade. Alteração posterior no registry, configuração ou versão suportada
não modifica a base daquela execução; uma nova base/revisão exige novo
processamento conforme o contrato DOM.

Authority: `O-018`, `ADR-0003`, `Decisão`, consumindo `DOM-SNAPSHOT-001`.

### EXEC-CONTRACT-001 — JSON inválido e schema incompatível falham fechados

JSON inválido, envelope ausente, payload que não valida, schema desconhecido
ou schema incompatível devem resultar em `CONTRACT_INVALID`, sem tratar o
resultado como sucesso, aprovação, checkpoint confirmado ou efeito autorizado.
O resultado deve preservar a referência contratual e evidência suficiente
para diagnóstico pelo consumidor.

Authority: `O-019`, `ADR-0003`, `Decisão`.

### EXEC-CONTRACT-002 — Veredito desconhecido falha fechado

Um veredito não declarado para o contrato/capability no registry, ausente
quando obrigatório ou semanticamente não reconhecido deve resultar em
`VERDICT_UNKNOWN`. O consumidor não pode mapear esse caso para aprovação,
conclusão, retomada ou sucesso por fallback textual.

Authority: `O-019`, `ADR-0003`, `Decisão`.

### EXEC-REGISTRY-001 — Registry explícito e versionado

O registry deve mapear explicitamente cada etapa aplicável à skill/capability,
versões de entrada e saída, artefatos aceitos e produzidos, vereditos
permitidos e restrições de papel. Cada entrada deve possuir identidade e
versão resolvíveis, e a resolução deve ser determinística para o basis
congelado da execução.

Authority: `O-020`, `ADR-0003`, `Decisão`.

### EXEC-REGISTRY-002 — Catálogo normal separado de bootstrap

O registro normal de skills deve pertencer à configuração habilitada do
repositório. O catálogo de bootstrap deve ser versionado independentemente,
estar disponível antes da habilitação e não ser tratado como simples alias ou
extensão implícita do catálogo normal.

Authority: `O-020`, `ADR-0003`, `Decisão`.

### EXEC-REGISTRY-003 — Limite funcional do bootstrap

Somente capacidades de descoberta, validação, migração, auditoria e
remediação de onboarding podem ser executadas pelo catálogo bootstrap. Uma
capability fora dessa allowlist deve ser rejeitada com
`INCOMPATIBLE_CAPABILITY` para o contexto bootstrap, sem habilitar o
repositório ou executar trabalho normal.

Authority: `O-020`, `ADR-0003`, `Decisão`.

### EXEC-CAPABILITY-001 — Resolução de capability

Cada capability requerida por uma etapa deve resolver para uma entrada
versionada do registry, com contrato de entrada/saída, vereditos, artefatos e
restrições de papel compatíveis. Capability desconhecida deve resultar em
`UNKNOWN_CAPABILITY`; capability conhecida mas incompatível deve resultar em
`INCOMPATIBLE_CAPABILITY`.

Authority: `O-020`, `ADR-0003`, `Decisão`.

### EXEC-CAPABILITY-002 — Extensibilidade por registry

Uma capability nova que satisfaça o schema e as regras do registry deve poder
ser registrada e resolvida pela mesma autoridade, sem exigir que um consumidor
crie uma segunda tabela normativa ou lógica especial por categoria. O registro
de uma capability não altera retroativamente snapshots ou manifestos já
congelados.

Authority: `O-020`, `ADR-0003`, `Decisão`.

### EXEC-MANIFEST-001 — Manifesto completo e imutável

Cada atividade deve receber manifesto imutável contendo, no mínimo, caminhos,
hashes, commits, autoridade/basis, dependências, findings, rodada, tentativa,
configurações, diretório de trabalho e schema esperado, além das referências
de skill/capability e versões exatas. O manifesto deve permanecer ligado às
identidades DOM da atividade, tentativa e ciclo.

Authority: `O-021`, `ADR-0003`, `Decisão`, consumindo `DOM-ID-001`.

### EXEC-MANIFEST-002 — Checkpoints seguros e retomada

Cada skill deve declarar checkpoints seguros e informações de retomada no
manifesto/contrato aplicável. O manifesto deve expor o basis que os owners de
execução e persistência usarão para retomada; EXEC-001 não decide a
orquestração do contexto entre sessões. A aplicação do contexto deve seguir
`O-025`/`SPEC-EXEC-002` e o replay/persistência física deve seguir
`SPEC-PLAT-001`; texto de sessão e memória transitória não substituem esses
contratos.

Authority: `O-021`, `ADR-0003`, `Decisão`.

### EXEC-MANIFEST-003 — Imutabilidade da base contratual

Depois que a atividade começa, o manifesto, schema esperado e versões exatas
não podem ser alterados para acomodar resultado divergente. Se uma mudança
normativa ou incompatibilidade exigir nova base, o resultado deve permanecer
associado à tentativa/basis anterior e a nova execução deve obter identidade,
referência e manifesto próprios conforme DOM.

Authority: `O-018` e `O-021`, `ADR-0003`, `Decisão`, consumindo `DOM-SNAPSHOT-001`.

### EXEC-HISTORY-001 — Replay histórico

Replay ou consulta histórica deve preservar o manifesto, schema, versões,
hashes, commits, resultados e checkpoints que pertenciam à atividade original.
Um registry atual não pode reescrever a interpretação histórica nem converter
silenciosamente um payload incompatível para uma versão atual.

Authority: `O-021`, `ADR-0003`, `Decisão`.

### EXEC-FAILURE-001 — Falha estruturada sem sucesso implícito

Toda falha de contrato/capability deve ser emitida como resultado estruturado
com código/família, contrato e versão/basis envolvidos, causa observável e
estado de processamento. A falha não pode produzir aprovação, avanço de
atividade, confirmação de efeito ou conclusão por ausência de erro textual.
BACKEND, OPS e UI podem mapear ou projetar a falha, mas devem preservar seu
significado canônico.

Authority: `O-019`, `ADR-0003`, `Decisão`.

## 14. Commands / Queries / Events

Este componente define semântica de contrato, não comandos de domínio DOM nem
transporte HTTP. As interfaces abaixo são classificadas para evitar que um
consumidor transforme uma mensagem observável em nova autoridade:

| Interface | Classificação | Regra |
|---|---|---|
| Registro/atualização de entrada versionada | `APPLICATION_COMMAND` de contrato | só altera o catálogo aplicável a novas resoluções; não altera snapshot/manifesto existentes |
| Resolução de skill/capability para uma etapa | `QUERY`/resolução contratual | retorna entrada, versões, schemas, artefatos, vereditos e papéis; não cria lifecycle DOM |
| Resultado JSON de uma skill | `INTEGRATION_EVENT`/resultado estruturado | precisa do envelope e schema; texto humano é auxiliar |
| Falha `CONTRACT_INVALID`, `VERDICT_UNKNOWN`, `UNKNOWN_CAPABILITY`, `INCOMPATIBLE_CAPABILITY` | `INTEGRATION_EVENT` de falha canônica | preserva família, basis e não-sucesso; transporte e projeção só mapeiam |
| Manifesto de atividade | `IMMUTABLE_ARTIFACT` contratual associado a Activity/Attempt DOM | serve como basis de execução e replay; eventos que o referenciam permanecem no owner do aggregate; não confirma efeito externo |

Nomes de rota, DTO interno, protocolo e mecanismo de emissão permanecem
livres. O conteúdo semântico acima não pode ser removido por um mapping de
transporte.

## 15. Failure Semantics

EXEC-001 é owner semântico das famílias `Capability` e `Contract/verdict` do
portfolio:

| Família | Código | Trigger | Significado | Retry/recovery |
|---|---|---|---|---|
| Capability | `UNKNOWN_CAPABILITY` | capability não resolve no registry/basis | nenhuma capability autorizada foi identificada | não há fallback; política operacional pode encerrar ou tentar outra entrada explicitamente autorizada |
| Capability | `INCOMPATIBLE_CAPABILITY` | capability/versão/schema/papel não é compatível | existe referência, mas ela não satisfaz o contrato requerido | não converter silenciosamente; nova tentativa exige basis/versão compatível |
| Contract/verdict | `CONTRACT_INVALID` | JSON, envelope ou schema inválido/incompatível | resultado não é contrato consumível | não é sucesso; tentativas seguem política operacional sem mudar o código/semântica |
| Contract/verdict | `VERDICT_UNKNOWN` | veredito ausente, desconhecido ou não declarado | não é possível interpretar resultado funcional com segurança | não é aprovação; nova tentativa exige resultado conforme registry |

Todas as quatro falhas são fail-closed e não produzem transição ou efeito
parcial. O owner de transporte (`SPEC-BACKEND-001`) pode escolher status,
envelope ou representação local; `SPEC-OPS-001` pode registrar e `SPEC-UI-001`
apresentar. Nenhum pode renomear a semântica, torná-la sucesso ou substituí-la
por falha de outro owner.

## 16. Retry / Idempotency / Recovery

O contrato canônico distingue validade de contrato de política operacional de
tentativas:

- falha de JSON/schema/veredito/capability nunca é sucesso e não recebe retry
  implícito dentro do contrato;
- uma política operacional pode solicitar nova tentativa, mas deve conservar
  a versão/basis declarada e produzir novo resultado estruturado;
- retry não pode converter uma versão incompatível, reciclar silenciosamente
  um manifesto ou duplicar um efeito externo;
- `AttemptId` permanece identidade canônica de `SPEC-DOM-001`; retry pode
  receber novo assignment/sessão de `SPEC-EXEC-002`, enquanto persistência do
  manifesto, replay de journal, idempotência de efeito e reconciliação seguem
  `SPEC-PLAT-001`/`SPEC-GIT-001`;
- EXEC-001 expõe checkpoint, manifesto e basis para retomada; a aplicação do
  contexto entre sessões segue `O-025`/`SPEC-EXEC-002` e a recuperação física
  segue `SPEC-PLAT-001`.

## 17. Compatibility / Cutover

| Classe | Papel EXEC-001 | Regra |
|---|---|---|
| `NEW_CANONICAL_PATH` | `OWNER` (`O-016`, `O-020`) | novos resultados e resoluções usam envelope/schema/registry canônicos |
| `LEGACY_COMPATIBILITY` | `CONSUMER` de `SPEC-REPO-001` | legado pode ser adaptado por REPO para o caminho canônico; não é segundo registry nem segunda semântica |
| `HISTORICAL_REPLAY` | `OWNER` (`O-021`) | manifesto, versão, schema, hashes e resultados históricos permanecem interpretáveis pelo basis original |
| `CUTOVER` | `OWNER` (`O-018`) | alteração incompatível exige nova versão/basis e invalida o uso do basis antigo para novas execuções; snapshots existentes não são mutados |
| `RETIREMENT` | `NOT_APPLICABLE` | ADR-0003 não atribui aposentadoria independente do registry a EXEC-001 |

Não há fases de implementação nesta seção. Compatibilidade histórica não
autoriza conversão silenciosa nem mantém um contrato legado como autoridade
canônica indefinidamente.

## 18. Projection Boundaries

| Fonte canônica | Projeção/consumidor | Refresh/replay/stale behavior | Limite |
|---|---|---|---|
| Registry e schemas EXEC-001 | EXEC-002/REPO/BACKEND | resolver novamente somente para nova base; snapshot antigo permanece congelado | consumidor não edita registry por projeção |
| Resultado e manifesto | DOM/PLAT/OPS/BACKEND | replay preserva basis, IDs, versão e hashes; dado stale não autoriza avanço | resultado não substitui estado/lifecycle DOM |
| Falha canônica | transporte, log e UI | reconexão pode reprojetar a mesma falha; representação pode variar | significado e retryability não mudam |
| Capability catalog | UI/OPS | label/lista pode ficar stale e requer refresh; não pode criar capability | projeção não é catálogo canônico |

## 19. External Effects

O envelope pode carregar `requested effects` conforme ADR-0003, mas EXEC-001
não possui a execução, intenção persistida, evidência, confirmação ou
reconciliação do efeito. A distinção é:

| Semântica | Owner/limite |
|---|---|
| pedido declarado pela skill | campo estruturado validado por EXEC-001 |
| intenção durável e chave idempotente | `SPEC-PLAT-001` |
| execução de adapter/Git/Codex | owner do adapter ou `SPEC-GIT-001`/`SPEC-BACKEND-001` conforme portfolio |
| evidência, confirmação e recovery | `SPEC-PLAT-001`/owner do efeito |
| projeção operacional | `SPEC-OPS-001`/`SPEC-UI-001` |

Um payload válido nunca é, sozinho, confirmação de efeito externo.

## 20. Security / Authorization

Não há obrigação de autenticação, autorização de domínio ou armazenamento de
segredos alocada a EXEC-001. `SPEC-BACKEND-001` owns autenticação de transporte
e sessão local; `SPEC-DOM-001` owns autorização/lifecycle de domínio quando
aplicável. O contrato não pode tratar presença de token, nome de usuário ou
texto humano como aprovação funcional. Segredos não são exigidos pelos campos
normativos desta SPEC; armazenamento e proteção, quando necessários, seguem o
owner de segurança sem alterar o schema sem versionamento.

## 21. Conformance Suite

### Positive

- `C-EXEC-001`: envelope e payload válidos são aceitos quando os schemas e
  versões estão registrados.
- `C-EXEC-002`: resultado contém todos os campos estruturados do envelope e
  texto adicional não participa da decisão.
- `C-EXEC-003`: versão `minor` compatível e `patch` sem mudança semântica são
  resolvidos conforme o conjunto suportado.
- `C-EXEC-004`: registry resolve etapa/capability com entradas/saídas,
  artefatos, vereditos e papel corretos.
- `C-EXEC-005`: catálogo bootstrap resolve descoberta/validação/migração/
  auditoria/remediação antes de `ENABLED`.
- `C-EXEC-006`: capability sintética registrada no mesmo registry é resolvida
  sem regra especial por categoria.
- `C-EXEC-007`: manifesto completo e imutável é associado a Activity/Attempt
  DOM e declara checkpoint seguro.

### Negative and fail-closed

- `C-EXEC-008`: JSON inválido ou payload incompatível produz
  `CONTRACT_INVALID`, sem avanço, aprovação ou efeito.
- `C-EXEC-009`: veredito ausente/desconhecido produz `VERDICT_UNKNOWN`.
- `C-EXEC-010`: capability desconhecida ou incompatível produz o código
  canônico correspondente, sem fallback ou alias não registrado.
- `C-EXEC-011`: capability normal solicitada pelo catálogo bootstrap produz
  `INCOMPATIBLE_CAPABILITY` e não habilita o repositório.
- `C-EXEC-012`: tentativa de alterar versão/schema/manifesto de atividade
  iniciada é rejeitada ou preserva o basis original.

### Boundary isolation and dependency conformance

- `C-EXEC-013`: a implementação consome `DOM-ID-001`, `DOM-SNAPSHOT-001` e
  `DOM-LIFE-001` sem criar IDs, lifecycle ou transições DOM concorrentes.
- `C-EXEC-014`: BACKEND/OPS/UI podem mapear uma falha, mas nenhum mapping muda
  família, significado, retryability ou sucesso/falha.
- `C-EXEC-015`: manifesto ou projeção não se torna estado canônico; efeito
  solicitado não é confirmação e registry projetado não é fonte de verdade.
- `C-EXEC-016`: mudança normativa cria nova versão/basis e não altera replay
  histórico nem snapshots anteriores.

### Recovery/retry

- `C-EXEC-017`: EXEC-001 expõe basis/versão e checkpoint; o owner de execução
  aplica contexto persistido em retry/retomada, sem retry implícito por texto.

Esses testes devem ser executáveis contra a implementação produtiva quando ela
existir. Os testes atuais do protótipo não satisfazem esta suíte.

## 22. Acceptance Criteria

| ID | Critério binário | Requirement |
|---|---|---|
| AC-EXEC-001 | Dado envelope e payload válidos, ambos passam nos schemas registrados; texto isolado nunca é aceito como resultado autoritativo. | EXEC-ENVELOPE-001 |
| AC-EXEC-002 | Um resultado sem qualquer campo mínimo estruturado exigido é rejeitado com `CONTRACT_INVALID`, sem ser inferido de texto. | EXEC-ENVELOPE-002 |
| AC-EXEC-003 | O registry exibe semver e classifica corretamente major/minor/patch em um caso compatível e um incompatível. | EXEC-VERSION-001 |
| AC-EXEC-004 | Uma versão fora do conjunto suportado, quando resolvida como capability, produz `INCOMPATIBLE_CAPABILITY`, sem alias ou conversão silenciosa; payload/schema inválido produz `CONTRACT_INVALID`. | EXEC-VERSION-002 |
| AC-EXEC-005 | Após iniciar a atividade, alteração no registry não muda a versão observada no snapshot/manifesto da atividade. | EXEC-SNAPSHOT-001 |
| AC-EXEC-006 | JSON inválido, schema incompatível ou desconhecido resulta em `CONTRACT_INVALID` e nenhum avanço/efeito é produzido. | EXEC-CONTRACT-001 |
| AC-EXEC-007 | Veredito desconhecido ou ausente quando obrigatório resulta em `VERDICT_UNKNOWN`, nunca em aprovação. | EXEC-CONTRACT-002 |
| AC-EXEC-008 | Para uma etapa registrada, a resolução retorna deterministicamente capability, skill, versões, schemas, artefatos, vereditos e papel. | EXEC-REGISTRY-001 |
| AC-EXEC-009 | Catálogo normal e bootstrap possuem versões/fontes independentes e uma alteração em um não muta o outro. | EXEC-REGISTRY-002 |
| AC-EXEC-010 | Solicitação de capability fora da allowlist bootstrap produz `INCOMPATIBLE_CAPABILITY` antes de habilitação ou execução normal. | EXEC-REGISTRY-003 |
| AC-EXEC-011 | Capability inexistente e capability incompatível produzem, respectivamente, `UNKNOWN_CAPABILITY` e `INCOMPATIBLE_CAPABILITY`. | EXEC-CAPABILITY-001 |
| AC-EXEC-012 | Uma capability sintética registrada conforme schema é resolvida pelo mesmo caminho de registry sem código específico de categoria. | EXEC-CAPABILITY-002 |
| AC-EXEC-013 | Cada atividade iniciada possui manifesto imutável com paths, hashes, commits, basis, dependências, findings, rodada, tentativa, config, workdir, schema e versões. | EXEC-MANIFEST-001 |
| AC-EXEC-014 | O manifesto declara checkpoint/basis de retomada; EXEC-001 não autoriza retomada sem essa declaração, e a aplicação do contexto persistido permanece sob `O-025`/`SPEC-EXEC-002` e `SPEC-PLAT-001`. | EXEC-MANIFEST-002 |
| AC-EXEC-015 | Tentativa de modificar manifesto, schema ou versão após início não altera o registro histórico nem o resultado associado. | EXEC-MANIFEST-003 |
| AC-EXEC-016 | Replay histórico reproduz o basis original mesmo quando o registry atual contém versão diferente. | EXEC-HISTORY-001 |
| AC-EXEC-017 | Toda falha canônica contém código/família, contrato, versão/basis e causa observável, sem aprovação ou confirmação implícita. | EXEC-FAILURE-001 |
| AC-EXEC-018 | Um retry solicitado externamente não altera semântica de falha, não converte versão e não confirma efeito externo por si só. | EXEC-FAILURE-001, EXEC-MANIFEST-002 |

## 23. ADR / Obligation / Requirement Traceability

| Requirement | Portfolio obligation | ADR | ADR section | Ownership role | Acceptance / test |
|---|---|---|---|---|---|
| EXEC-ENVELOPE-001 | O-016 | ADR-0003 | Decisão | canonical owner | AC-EXEC-001; C-EXEC-001 |
| EXEC-ENVELOPE-002 | O-016 | ADR-0003 | Decisão | canonical owner | AC-EXEC-002; C-EXEC-002 |
| EXEC-VERSION-001 | O-017 | ADR-0003 | Decisão | canonical owner | AC-EXEC-003; C-EXEC-003 |
| EXEC-VERSION-002 | O-017 | ADR-0003 | Decisão | canonical owner | AC-EXEC-004; C-EXEC-003 |
| EXEC-SNAPSHOT-001 | O-018 | ADR-0003 | Decisão | canonical owner; consumes DOM-SNAPSHOT-001 | AC-EXEC-005; C-EXEC-012, C-EXEC-016 |
| EXEC-CONTRACT-001 | O-019 | ADR-0003 | Decisão | canonical owner | AC-EXEC-006; C-EXEC-008 |
| EXEC-CONTRACT-002 | O-019 | ADR-0003 | Decisão | canonical owner | AC-EXEC-007; C-EXEC-009 |
| EXEC-REGISTRY-001 | O-020 | ADR-0003 | Decisão | canonical owner | AC-EXEC-008; C-EXEC-004 |
| EXEC-REGISTRY-002 | O-020 | ADR-0003 | Decisão | canonical owner | AC-EXEC-009; C-EXEC-005 |
| EXEC-REGISTRY-003 | O-020 | ADR-0003 | Decisão | canonical owner | AC-EXEC-010; C-EXEC-011 |
| EXEC-CAPABILITY-001 | O-020 | ADR-0003 | Decisão | canonical owner | AC-EXEC-011; C-EXEC-010 |
| EXEC-CAPABILITY-002 | O-020 | ADR-0003 | Decisão | canonical owner | AC-EXEC-012; C-EXEC-006 |
| EXEC-MANIFEST-001 | O-021 | ADR-0003 | Decisão | canonical owner; consumes DOM-ID-001 | AC-EXEC-013; C-EXEC-007 |
| EXEC-MANIFEST-002 | O-021 | ADR-0003 | Decisão | canonical owner; recovery consumed from PLAT/EXEC-002 | AC-EXEC-014; C-EXEC-017 |
| EXEC-MANIFEST-003 | O-018, O-021 | ADR-0003 | Decisão | canonical owner; consumes DOM-SNAPSHOT-001 | AC-EXEC-015; C-EXEC-012 |
| EXEC-HISTORY-001 | O-021 | ADR-0003 | Decisão | canonical owner | AC-EXEC-016; C-EXEC-016 |
| EXEC-FAILURE-001 | O-019 | ADR-0003 | Decisão | canonical failure owner; mappings consumed by BACKEND/OPS/UI | AC-EXEC-017, AC-EXEC-018; C-EXEC-014 |

`REQUIREMENTS_WITHOUT_PORTFOLIO_OBLIGATION = 0` e
`OWNED_OBLIGATIONS_WITHOUT_REQUIREMENT = 0`.

## 24. Known Gap Summary

Esta tabela registra divergência observada; não é a Gap Matrix formal.

| Gap subject | Classification | Related requirement | Evidence |
|---|---|---|---|
| Schemas JSON e validação produtiva ausentes | `IMPLEMENTATION_GAP` | EXEC-ENVELOPE-001/002, EXEC-CONTRACT-001/002 | nenhum runtime/schema produtivo; somente `prototype/src/mockDomain.ts` |
| Registry normal/bootstrap ausente | `IMPLEMENTATION_GAP` | EXEC-REGISTRY-001/002/003, EXEC-CAPABILITY-001/002 | nenhum catálogo produtivo encontrado |
| Manifesto/checkpoint produtivo ausente | `IMPLEMENTATION_GAP` | EXEC-MANIFEST-001/002/003, EXEC-HISTORY-001 | campos simulados em memória; nenhum registro persistido |
| Runtime de skill e consumidores reais ausentes | `IMPLEMENTATION_GAP` | todos os requisitos EXEC | não há backend/.NET, scheduler ou onboarding produtivo |
| Protótipo e testes de mock | `PROTOTYPE_ONLY` | todos | `prototype/src/*`, `prototype/tests/*`, `prototype/README.md` |
| Conteúdo normativo desta SPEC | `SPECIFICATION_GAP` | todos | target inexistente antes desta geração; agora materializado para auditoria |
| Technology/schema/transport choice | `UNFROZEN_IMPLEMENTATION_DETAIL` | todos | nenhuma ADR congela biblioteca, banco ou protocolo |
| Architecture gap | `NON_GAP` | todos | portfolio audit aprovado; upstream DOM auditado como conformant |

A reconciliação formal desses itens permanece downstream, na geração da Gap
Matrix, depois da auditoria independente desta SPEC.

## 25. Dependencies

| Dependency SPEC | Contract consumed | Blocking? | Evidence |
|---|---|---|---|
| `SPEC-DOM-001` | `DOM-ID-001`, `DOM-SNAPSHOT-001`, `DOM-LINEAGE-001`, `DOM-LIFE-001`, `DOM-CMD-001`, `DOM-ADV-001`, `DOM-AUDIT-002` | sim | portfolio DAG: `SPEC-EXEC-001 → SPEC-DOM-001`; upstream audit `PASS — COMPONENT_SPEC_CONFORMANT` |

Não há nova dependência normativa. `SPEC-EXEC-002`, `SPEC-REPO-001` e
`SPEC-BACKEND-001` são consumidores downstream, não upstream dependencies.

`NORMATIVE_DEPENDENCIES = 1`; `NEW_UNAPPROVED_DEPENDENCIES = 0`; nenhum ciclo
foi criado.

## 26. Risks

| Risk | Mitigation / conformance |
|---|---|
| Texto humano virar autoridade | EXEC-ENVELOPE-001/002 e C-EXEC-002 |
| Conversão silenciosa entre versões | EXEC-VERSION-002, EXEC-SNAPSHOT-001 e C-EXEC-003/012 |
| Registry normal e bootstrap virarem autoridade dupla | EXEC-REGISTRY-002/003 e C-EXEC-005/011 |
| Capability desconhecida ser tratada como indisponibilidade ou sucesso | EXEC-CAPABILITY-001 e C-EXEC-010 |
| Manifesto atual ser usado para reinterpretar histórico | EXEC-MANIFEST-003, EXEC-HISTORY-001 e C-EXEC-012/016 |
| Falha mapeada por BACKEND/UI perder semântica | EXEC-FAILURE-001 e C-EXEC-014 |
| Manifesto/projeção confirmar efeito externo | seção 19 e C-EXEC-015 |
| Retry duplicar efeito ou alterar basis | seção 16 e C-EXEC-017 |
| Implementação do protótipo virar autoridade produtiva | seção 8 e C-EXEC-013/015 |

## 27. Implementation Details Intentionally Unfrozen

Permanecem livres, salvo decisão posterior válida:

- biblioteca ou mecanismo de JSON Schema;
- formato físico do registry e do catálogo bootstrap;
- nomes de classes, funções, módulos, namespaces e arquivos;
- linguagem/runtime do executor de skills;
- protocolo de transporte, rotas HTTP, DTOs internos e serialização;
- banco, journal, outbox e mecanismo de persistência;
- mecanismo de geração de SDK/tipos;
- formato físico de hash, armazenamento de artefatos e replay;
- estratégia de cache, fila e sincronização;
- biblioteca de adapters Codex/Git/GitHub.

Essas liberdades não podem alterar IDs, schemas sem versionamento, semântica
de falhas, basis congelado, ownership ou os limites de catálogo desta SPEC.

## 28. Open Questions

### IMPLEMENTATION_DETAIL_QUESTION

- Qual biblioteca implementará a validação JSON Schema?
- Onde o registry será armazenado e como será carregado pelo consumidor?
- Qual formato interno representará hashes e checkpoints?

Essas perguntas não impedem a validação normativa enquanto os contratos
observáveis forem preservados.

### ARCHITECTURAL_QUESTION

Nenhuma. Uma questão arquitetural futura exigiria ADR/portfolio; não é
resolvida nesta SPEC.

## 29. Definition of Done

- portfolio aprovado e `O-016…O-021` materializados;
- ADR-0003 aceita e efetiva;
- `SPEC-DOM-001` upstream revision 2 com auditoria independente conformante;
- ownership, consumers e exclusões explícitos;
- envelope, semver, registry, bootstrap, capabilities, manifestos,
  checkpoints e falhas definidos normativamente;
- identidade e lifecycle DOM consumidos sem redefinição;
- compatibilidade, replay e cutover explícitos;
- conformance positiva, negativa, de isolamento, dependência, extensibilidade
  e recovery definida;
- todos os requisitos têm autoridade e aceitação/teste;
- repository inspecionado e gaps classificados sem gerar Gap Matrix;
- nenhuma dependência não aprovada, architecture gap ou portfolio ownership gap;
- nenhum Plano de Implementação, ticket ou implementação produzido.

## 30. Mechanical Validation

```text
PORTFOLIO_OBLIGATIONS_OWNED = 6
PORTFOLIO_OBLIGATIONS_COVERED = 6
OWNED_OBLIGATIONS_UNCOVERED = 0
NORMATIVE_REQUIREMENTS = 17
REQUIREMENTS_WITHOUT_AUTHORITY = 0
CONSUMED_CONTRACTS = 2 contract groups from SPEC-DOM-001
CONSUMED_CONTRACTS_REDEFINED = 0
FAILURES_OWNED = 4
FAILURES_CONSUMED = 0
AMBIGUOUS_FAILURE_OWNERS = 0
NORMATIVE_DEPENDENCIES = 1
NEW_UNAPPROVED_DEPENDENCIES = 0
KNOWN_SPECIFICATION_GAPS = 0
KNOWN_IMPLEMENTATION_GAPS = 4
ARCHITECTURE_GAPS = 0
PORTFOLIO_OWNERSHIP_GAPS = 0
ACCEPTANCE_CRITERIA = 18
CONFORMANCE_TESTS = 17
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

- Nenhum comportamento foi alocado a EXEC-001 fora de `O-016…O-021`.
- DOM identity, lifecycle, commands e veredictos de domínio são consumidos,
  não redefinidos.
- Nenhum consumidor downstream precisa definir autoridade normativa de
  EXEC-001.
- Registry, manifesto e resultado não são projeção de UI/OPS nem confirmação
  de efeito externo.
- BACKEND/OPS/UI só mapeiam/projetam falhas e preservam significado.
- Legacy é consumer de REPO e não uma segunda autoridade.
- Semver, basis, schema, checkpoint e falhas têm precondições e comportamento
  negativo explícitos.
- Nenhuma seção contém plano de implementação, divisão de tickets ou nomes de
  arquivos exigidos.
- Todo requisito normativo aponta para obrigação do portfolio e ADR-0003.
- Todas as obrigações possuem requisito, aceitação e teste.

Resultado:

```text
OWNERSHIP_ISOLATION = PASS
DEPENDENCY_DIRECTION = PASS
ADR_TRACEABILITY = PASS
FAILURE_OWNERSHIP = PASS
COMPATIBILITY_BOUNDARY = PASS
IMPLEMENTATION_PLAN_LEAKAGE = PASS
```

## 32. Final Gate

```text
COMPONENT_SPEC_GENERATION_COMPLETE
```

The artifact is ready for the next independent SPEC conformance audit. It is
not an accepted implementation specification until that audit returns the
repository-governed conformant verdict.

```text
READY_FOR_SPEC_VALIDATION
```
