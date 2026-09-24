---
schema_version: "1.0.0"
id: SPEC-EXEC-001
title: Skill Contracts and Capability Registry
status: PROPOSED
revision: 5
date: 2026-09-17
spec_scope: execution-contracts
portfolio: SPEC-PORTFOLIO-001
portfolio_revision: 2
portfolio_verdict: PORTFOLIO_DECOMPOSITION_APPROVED
portfolio_audit: docs/specs/SPEC-PORTFOLIO-001-decomposition-audit.md
authoritative_adrs: [ADR-0003]
related_adrs: [ADR-0001, ADR-0002, ADR-0006, ADR-0009, ADR-0010, ADR-0011]
upstream_dependencies: [SPEC-DOM-001]
remediation_source_audit: docs/specs/audits/SPEC-EXEC-001-component-conformance-audit.md
remediation_report: docs/specs/remediations/SPEC-EXEC-001-component-spec-remediation.md
---

# SPEC-EXEC-001 — Skill Contracts and Capability Registry

## 1. Status

`PROPOSED` — materialização remediada do boundary EXEC-001 a partir do
portfolio aprovado; a revisão 5 incorpora as correções dos achados validados da
auditoria independente (`CSC-MAJOR-003` e `CSC-MAJOR-004`). A revisão 4 e o
achado histórico `CSC-MAJOR-002` permanecem na linhagem e não são autoridade
para esta rodada.

Generation baseline:

| Campo | Valor |
|---|---|
| Target component | `SPEC-EXEC-001` |
| Portfolio | `SPEC-PORTFOLIO-001` revision `2` |
| Portfolio audit | `docs/specs/SPEC-PORTFOLIO-001-decomposition-audit.md` |
| Portfolio verdict | `PORTFOLIO_DECOMPOSITION_APPROVED` |
| Primary ADR | `ADR-0003` revision `3`, `ACCEPTED` |
| Upstream dependency | `SPEC-DOM-001` revision `4`, audit `PASS — COMPONENT_SPEC_CONFORMANT` (`docs/specs/audits/SPEC-DOM-001-component-conformance-audit.md`) |
| Repository HEAD | `222ee327f46c9832ab61f6640d81bb9cf002b75e` (current component-SPEC audit checkpoint) |
| Existing target draft | revision `4`, `PROPOSED`; revision 4 is the remediated candidate baseline |
| Prior Gap Matrix | downstream historical artifacts exist; they do not authorize this SPEC |
| Source audit | `docs/specs/audits/SPEC-EXEC-001-component-conformance-audit.md`, `FAIL — COMPONENT_SPEC_NON_CONFORMANT`, `CSC-MAJOR-003` and `CSC-MAJOR-004` |
| Gate | `READY_FOR_INDEPENDENT_COMPONENT_SPEC_REAUDIT` after this remediation |

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
| `docs/specs/audits/SPEC-DOM-001-component-conformance-audit.md` | auditoria upstream mais recente de `SPEC-DOM-001` revision `4`; `PASS — COMPONENT_SPEC_CONFORMANT` |
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
| Upstream DOM | SPEC revision 4; auditoria independente `PASS — COMPONENT_SPEC_CONFORMANT` | consumir IDs, revisão, snapshot e lifecycle canônicos | `ALREADY_CONFORMANT` |
| Schemas JSON produtivos | não encontrados | envelope e payload validáveis independentemente | `IMPLEMENTATION_GAP` |
| Registry normal/bootstrap | não encontrado fora da simulação | catálogo explícito, versionado, separado e com `RepositoryId` no escopo `NORMAL` | `IMPLEMENTATION_GAP` |
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
| O-017 | ADR-0003 / Decisão | semver e conjuntos de versões suportadas explícitos; conjuntos de entradas distintas na mesma chave de resolução devem ser disjuntos | EXEC-VERSION-001, EXEC-VERSION-002 |
| O-018 | ADR-0003 / Decisão | versão exata congelada por execução e cutover por revisão | EXEC-SNAPSHOT-001, EXEC-MANIFEST-003 |
| O-019 | ADR-0003 / Decisão | falha fechada para JSON/schema/veredito e resultado estruturado | EXEC-CONTRACT-001, EXEC-CONTRACT-002, EXEC-FAILURE-001 |
| O-020 | ADR-0003 / Decisão | registry versionado, identidade/reconstrução de entradas, resolução única sem precedência implícita, catálogo normal/bootstrap e extensibilidade | EXEC-REGISTRY-001, EXEC-REGISTRY-002, EXEC-REGISTRY-003, EXEC-REGISTRY-004, EXEC-CAPABILITY-001, EXEC-CAPABILITY-002 |
| O-021 | ADR-0003 / Decisão | manifesto completo imutável, identidade/reconstrução, checkpoints seguros e retomada | EXEC-MANIFEST-001, EXEC-MANIFEST-002, EXEC-MANIFEST-003, EXEC-MANIFEST-004, EXEC-HISTORY-001 |

Cada obrigação possui requisito, critério de aceitação e cobertura de
conformance nas seções 21–23.

## 10. Consumed Contracts

| Owner SPEC | Contract / requirement | Why consumed | Local rule |
|---|---|---|---|
| `SPEC-DOM-001` revision `4` | `DOM-ID-001`, `DOM-SNAPSHOT-001`, `DOM-LINEAGE-001`, `DOM-LIFE-001`, `DOM-AUDIT-002` | relacionar repositório, execução, atividade, ciclo, revisão, snapshot e veredito a contratos de skill | usar `RepositoryId` e demais IDs/revisões canônicos; não criar identidade, lifecycle ou veredito DOM alternativo |
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
as identidades e os estados de execução permanecem canônicos em DOM. Dentro de
uma mesma chave de resolução, conjuntos de versões suportadas de entradas
distintas devem ser disjuntos; sobreposição torna a base inválida e falha
fechado, sem precedência ou desempate implícito. Um resultado de skill pode
solicitar efeitos e informar evidência, mas não confirma efeito externo nem
altera estado de domínio por si só.

## 12. Identity and Authority Rules

| Identidade/conceito | Canonical owner | Reference identity | Local correlation | Derived projection |
|---|---|---|---|---|
| `ExecutionId`, `ActivityId`, `AttemptId`, `ArtifactCycleId`, `AgentId` | DOM | referência recebida no envelope/manifesto | correlation de contrato/execução | nome/status exibido |
| `NORMAL` catalog identity (`RepositoryId` + entry key) | EXEC-001; `RepositoryId` is DOM-owned | enabled repository catalog and its entries | catalog/resolution correlation | repository/skill label |
| `SkillContractId` + versão | EXEC-001 | entrada do registry | request/result correlation | nome da skill |
| `CapabilityId` + versão | EXEC-001 | entrada do registry e capability requerida | resolution correlation | label/categoria |
| `ContractVerdict` | EXEC-001 para validade do contrato; DOM para veredito de lifecycle | campo estruturado do envelope | result correlation | texto/status de consumidor |
| `Manifest` record + schema basis | EXEC-001 como owner contratual; `ArtifactId`, `ActivityId` e `AttemptId` permanecem referências DOM-owned | manifesto da atividade | checkpoint/resume correlation | resumo operacional |
| `SchemaId` + versão | EXEC-001 | referência no registry/envelope | validation correlation | metadado técnico |

Os IDs de agregados e sua revisão não podem ser substituídos por nomes de
arquivo, labels, títulos ou campos de transporte. `SkillContractId`,
`CapabilityId` e `SchemaId` são identificadores contratuais locais; para uma
entrada `NORMAL`, `RepositoryId` é a identidade canônica do catálogo
habilitado fornecida por DOM. O manifesto é vinculado às identidades DOM
recebidas e não cria uma identidade canônica concorrente.

### 12.1 — Identidade canônica das entradas do registry

Cada entrada do registry é uma entidade contratual de tipo
`REGISTRY_ENTRY`. Para uma entrada `NORMAL`, sua identidade canônica e chave
de lookup são o tuplo imutável
`(CatalogScope=NORMAL, RepositoryId, SkillContractId, CapabilityId, SchemaId,
SemanticVersion)`. `RepositoryId` é resolvido pela identidade canônica DOM do
repositório que fornece a configuração habilitada e não pode ser substituído
por nome, caminho, branch, URL ou digest. Para uma entrada `BOOTSTRAP`, a
identidade é o catálogo de sistema independente de escopo `BOOTSTRAP` mais
`(SkillContractId, CapabilityId, SchemaId, SemanticVersion)`; não há
`RepositoryId` de repositório habilitado nesse escopo. Assim, `NORMAL` é
sempre repository-scoped e `BOOTSTRAP` permanece uma fonte system-scoped
separada.

A mesma chave (incluindo `RepositoryId` quando `NORMAL`) não pode representar
duas entradas ou ser substituída por mutação. Uma atualização que altera
semântica exige nova `SemanticVersion`; uma alteração de catálogo produz novo
`CatalogRevision` dentro do mesmo `RepositoryId`/escopo, sem reescrever a
entrada ou o basis de execuções existentes. `CatalogRevision` é distinto da
versão semântica do contrato.

A criação é a operação de registrar uma chave ausente; registro duplicado,
conflitante ou tentativa de substituir uma chave existente falha com
`CONTRACT_INVALID` e não altera o catálogo. Além da unicidade da chave, para
cada tuplo de resolução
`(CatalogScope, RepositoryId quando NORMAL, StageId, SkillContractId,
CapabilityId, SchemaId)`, os conjuntos explícitos de versões suportadas das
entradas distintas devem ser disjuntos. Se a interseção de dois conjuntos for
não vazia, o registro da entrada ou a construção do `CatalogRevision` falha
com `CONTRACT_INVALID`; nenhuma entrada, revisão de catálogo, snapshot ou
manifesto é criado ou mutado. Não existe precedência, desempate ou seleção
baseada em ordem de registro para esse caso. A regra é a mesma para qualquer
permutação de registro e preserva a base congelada anterior.

A resolução usa a chave completa, incluindo `RepositoryId` para `NORMAL`, o
`CatalogRevision` congelado pelo snapshot e as referências de etapa, papéis,
schemas, artefatos e vereditos. Em uma base válida, uma solicitação suportada
por uma única entrada resolve para a identidade canônica completa dessa
entrada e para o `CatalogRevision`; uma entrada cujo conjunto suporta várias
versões pode resolver cada uma delas sem criar ambiguidade. Nenhuma entrada
suportada produz `INCOMPATIBLE_CAPABILITY`. Uma base que contenha sobreposição
não possui entrada selecionável e falha fechado como `CONTRACT_INVALID`, sem
fallback. O registro normal é obtido da configuração habilitada do repositório
cuja identidade DOM é `RepositoryId`; o bootstrap é o catálogo de sistema
independente. EXEC-001 valida a semântica e a integridade, enquanto a fonte
respectiva fornece o material autorizado.

Um basis de catálogo persistido contém as entradas schema-válidas, seu
`CatalogScope`, `RepositoryId` quando `NORMAL` (ausente para o catálogo
`BOOTSTRAP` system-scoped), `CatalogRevision`, origem autorizada e digest de
conteúdo. Além desses campos, cada base deve carregar uma
`CatalogBasisProgression` normativa: para o basis inicial,
`PredecessorCatalogRevision = NONE` e uma observação de origem inicial; para
cada sucessor, a evidência deve vincular o predecessor aceito (escopo,
`RepositoryId` quando `NORMAL`, `CatalogRevision` e
`PredecessorContentDigest`) ao sucessor proposto (`SuccessorCatalogRevision` e
`SuccessorContentDigest`), com a `SourceSequence`/observação de autoridade
retornada pela fonte autorizada do catálogo. Para `NORMAL`, a fonte autorizada
é o material do catálogo da configuração habilitada ligada ao `RepositoryId`
DOM; para `BOOTSTRAP`, é a fonte independente do catálogo de sistema.
EXEC-001 é o owner da validação semântica e exige que a fonte retorne essa
relação de predecessor/sucessor e seus digests; REPO/PLAT podem fornecer
material e integridade física, mas não podem inventar a relação. Contiguidade
numérica é necessária, mas não prova causalidade sozinha: um basis posterior
auto-consistente, detached ou sem observação de fonte que vincule o
predecessor aceito falha fechado como `CONTRACT_INVALID` e não é
materializado.

Reidratação é distinta de registro: o resolver EXEC-001 deve validar a
identidade do catálogo, origem, digest, unicidade, referências, disjunção dos
conjuntos suportados, `CatalogBasisProgression` e continuidade da
`SourceSequence` antes de materializar. Material ausente, desconhecido,
detached, corrompido, duplicado, sobreposto, fora de ordem, com
predecessor/digest divergente ou sem relação causal autorizada falha fechado
como `CONTRACT_INVALID`; uma chave desconhecida produz `UNKNOWN_CAPABILITY` e
uma chave conhecida cujo basis, versão, schema ou papel não é compatível
produz `INCOMPATIBLE_CAPABILITY`. Nenhum desses caminhos muta estado
parcialmente e uma base histórica só pode ser reidratada pelo basis e pela
relação de progressão que lhe pertenciam.

O comando de registro/publicação de novo `CatalogRevision` deve transportar
`ExpectedCatalogRevision`: `NONE` somente para o basis inicial, ou a revisão
exata do basis atualmente aceito para um sucessor. Deve transportar também
uma `RegistryMutationKey` determinística para o comando canônico completo; ela
é chave de idempotência da operação, não identidade de entrada ou autoridade
de catálogo. A validação semântica, a relação de progressão e a publicação de
um sucessor formam uma operação atômica: ou um novo basis completo é aceito,
ou nenhuma entrada, revisão, snapshot ou manifesto é mutado. Se a revisão
esperada não for a revisão corrente, o resultado é `CONTRACT_INVALID` com
razão `STALE_CATALOG_BASIS`, sem merge, last-writer-wins ou mutação parcial.
Entre dois comandos válidos que partam do mesmo predecessor, somente o
primeiro sucessor aceito pela autoridade pode avançar; o outro é stale e deve
ser rejeitado. Repetir a mesma `RegistryMutationKey` com payload idêntico
devolve o resultado original (inclusive a mesma identidade/revisão), sem
criar outra revisão. A mesma chave com payload diferente falha
`CONTRACT_INVALID`. Depois de resposta ambígua, o retry deve primeiro
reconciliar a autoridade por `RegistryMutationKey`: se o resultado original
existir, ele é reapresentado; se não existir e o `ExpectedCatalogRevision`
ainda for corrente, o mesmo comando pode ser reapresentado; se a revisão
avançou, o resultado é stale. CAS, serialização, journal e durabilidade são
mecanismos físicos de PLAT; esses resultados semânticos e a fronteira
atômica pertencem a EXEC-001.

### 12.2 — Identidade canônica do manifesto

O manifesto é um artefato imutável de tipo `ACTIVITY_ATTEMPT_MANIFEST`, com
escopo de `ExecutionId`/`ArtifactCycleId` e identidade canônica exatamente
`(ExecutionId, ActivityId, AttemptId)`, resolvida por DOM. Cada tentativa
possui exatamente um manifesto; `ActivityId` e `AttemptId` permanecem
identidades distintas e um retry usa novo `AttemptId` e novo manifesto. O
`ArtifactCycleId` é referência de lineage, não um substituto da identidade do
manifesto, e não existe um `ManifestId` local concorrente.

A criação ocorre uma vez, antes do início da tentativa, com as referências DOM,
o snapshot e o basis do catálogo exatos e todos os campos mínimos de
`EXEC-MANIFEST-001`; criação duplicada, attachment a outra atividade/ciclo ou
referência ausente falha com `CONTRACT_INVALID`. O registro persistido inclui
a tupla canônica, tipo, escopo, `ManifestContentRevision = 1`, conteúdo
completo e digest de integridade. Esse revision é imutável; qualquer nova base
exige nova tentativa/identidade, não edição do registro histórico.

Reidratação não é criação: o material persistido é primeiro validado quanto ao
digest físico pelo owner de armazenamento e quanto à identidade, attachment,
basis, cardinalidade e campos normativos pelo owner semântico EXEC-001. PLAT
permanece responsável por serialização, durabilidade, ordenação e recovery
físico; EXEC-002 aplica contexto de sessão conforme O-025. Registro detached,
digest divergente, duplicado, corrompido, stale, com referência desconhecida
ou com basis incompatível falha fechado como `CONTRACT_INVALID`, sem mutação.
Replay carrega a identidade e o basis originais e nunca resolve o conteúdo
novamente contra o registry atual. Path, filename, hash isolado, checkpoint,
correlation ou label são aliases/evidência, nunca identidade canônica.

### 12.3 — Aggregate Identity Authority Proofs

| Field | Registry entry | Activity-attempt manifest |
|---|---|---|
| `AGGREGATE_ROOT` | `REGISTRY_ENTRY` | `ACTIVITY_ATTEMPT_MANIFEST` |
| `CANONICAL_IDENTITY` | `NORMAL: (CatalogScope=NORMAL, RepositoryId, SkillContractId, CapabilityId, SchemaId, SemanticVersion)`; `BOOTSTRAP: (CatalogScope=BOOTSTRAP, SkillContractId, CapabilityId, SchemaId, SemanticVersion)` | `(ExecutionId, ActivityId, AttemptId)` |
| `IDENTITY_AUTHORITY_SOURCE` | EXEC-001 registry; `RepositoryId` comes from DOM `DOM-ID-001` for NORMAL; BOOTSTRAP is the independent system catalog | DOM `DOM-ID-001` identities consumed by EXEC-001 under O-021 |
| `IDENTITY_KIND_OR_TYPE` | `REGISTRY_ENTRY` | `ACTIVITY_ATTEMPT_MANIFEST` |
| `IDENTITY_SCOPE` | NORMAL is scoped to the canonical `RepositoryId`; BOOTSTRAP is the independent system catalog scope | `ExecutionId` and `ArtifactCycleId` scope; attempt attachment validated by DOM |
| `STABLE_CORRELATION_FIELDS` | `RepositoryId` when NORMAL, stage, capability, contract and catalog revision references; correlation is not identity | `ExecutionId`, `ActivityId`, `AttemptId`, `ArtifactCycleId`, exact snapshot/catalog basis |
| `CREATION_RULE` | register only an absent complete scoped key; duplicate/conflict or overlapping supported sets reject before a new CatalogRevision | create exactly one complete manifest before attempt start |
| `COMMAND_REPRESENTATION` | registry-entry registration / new scoped catalog revision application command carrying `ExpectedCatalogRevision`, `RegistryMutationKey` and the complete proposed basis | manifest creation with canonical DOM references and exact basis |
| `REPOSITORY_LOOKUP_REPRESENTATION` | complete scoped key, including `RepositoryId` for NORMAL, plus requested `CatalogRevision` | complete DOM identity tuple plus manifest content revision |
| `PERSISTED_REPRESENTATION` | schema-valid entry set, scope, `RepositoryId` when NORMAL, revision, authorized source, content digest and `CatalogBasisProgression` | identity tuple, type, scope, content revision `1`, complete fields and integrity digest |
| `REHYDRATED_REPRESENTATION` | validated entry set preserving scoped key, repository/catalog identity, revision, source, references, digest, progression and `SourceSequence` observation | validated immutable record preserving tuple, basis, fields and digest |
| `EQUALITY_AND_CONTINUITY_SEMANTICS` | same scoped key/version is same immutable entry; valid resolution has at most one supporting entry; catalog revisions cannot rewrite it or cross-resolve repositories; successor equality requires the validated predecessor/digest/source relation | same DOM tuple is same manifest; retry/new basis requires a new AttemptId |
| `REVISION_RELATIONSHIP` | semantic version is contract revision; `CatalogRevision` is catalog-basis revision within the scoped repository/catalog; `ExpectedCatalogRevision` is the mutation concurrency basis and is distinct from identity; rejected overlap or stale command creates no revision | `ManifestContentRevision=1`; DOM snapshot/basis revisions remain distinct |
| `ALIASES_LOCAL_IDS_DERIVED_IDS` | labels, paths, branch, URL, category, digest and correlation are not entry identity; `RepositoryId` is not replaceable by them | path, filename, digest, checkpoint, correlation and label are not manifest identity |
| `ALIAS_AUTHORITY_AND_FORBIDDEN_SUBSTITUTIONS` | no caller, projection, detached record or catalog source may replace the complete scoped key or its repository binding | no caller, storage adapter, filename or hash may replace DOM tuple |
| `PROOF_EVIDENCE` | this §12.1, §12.3, §12.4, §13 `EXEC-REGISTRY-004`, §14–§17, §21 C-EXEC-018/020/021/022/023, §22–§23 | this §12.2–§12.3, §13 `EXEC-MANIFEST-004`, §14, §15, §16–§18, §21, §22 |

### 12.4 — Aggregate Reconstruction Authority Proofs

| Field | Registry entry | Activity-attempt manifest |
|---|---|---|
| `WHAT_PERSISTED_MATERIAL_IS_ACCEPTED` | schema-valid complete catalog basis with authorized source, matching digest, contiguous `CatalogRevision`, `CatalogBasisProgression` and `RepositoryId` when `NORMAL` | complete immutable record with DOM tuple, basis, content revision `1`, fields and matching digest |
| `WHO_VALIDATES_PERSISTED_MATERIAL` | EXEC-001 validates semantic catalog identity, repository attachment, references, revision and failure result; physical adapter only supplies material/integrity evidence | PLAT validates physical integrity; EXEC-001 validates semantic identity, attachment, basis and fields |
| `CREATE_SEMANTICS` | absent scoped key creates one immutable entry in a new valid basis; `NORMAL` creation requires the DOM-resolved `RepositoryId` | one manifest for one DOM attempt before start |
| `REHYDRATE_SEMANTICS` | resolve requested scoped key/revision, requiring matching `RepositoryId` for `NORMAL`, obtain the authorized source progression observation, validate source/digest/predecessor-successor continuity, then materialize | resolve DOM tuple, validate attachment/basis/digest/content revision, then materialize |
| `REHYDRATABLE_STATES` | valid current catalog basis and historical frozen catalog basis within the same repository/system scope | pre-start-created, started-immutable and historical-replay record |
| `CURRENT_STATE_EVIDENCE` | exact scope, `RepositoryId` when `NORMAL`, `CatalogRevision`, complete key set, source, digest, predecessor/successor relation and `SourceSequence` observation | exact DOM tuple, snapshot/catalog basis, content revision and digest |
| `CANONICAL_IDENTITY_RESOLUTION` | `NORMAL` resolves complete key including DOM `RepositoryId`; `BOOTSTRAP` resolves independent system-scoped key | DOM resolves `ExecutionId`, `ActivityId`, `AttemptId`; `ArtifactCycleId` is lineage |
| `REFERENCE_ATTACHMENT_VALIDATION` | repository/catalog identity, stage/capability/schema/artifact/verdict/role references resolve in the same scoped basis; overlapping supported sets invalidate the basis before attachment | activity/attempt/cycle and snapshot references resolve to the same execution |
| `VERSION_OR_REVISION_VALIDATION` | semver and disjoint supported sets plus contiguous `CatalogRevision` within the same `RepositoryId`/scope | exact skill/schema/catalog basis plus `ManifestContentRevision=1` |
| `CAN_UNTRUSTED_OR_DETACHED_PERSISTED_MATERIAL_BE_MATERIALIZED_DIRECTLY_AS_VALID_DOMAIN_STATE?` | `NO` | `NO` |
| `RECONSTRUCTION_VALIDATOR_OR_RESOLVER_OWNER` | EXEC-001 semantic registry resolver; the authorized NORMAL/BOOTSTRAP catalog source returns progression evidence, while REPO/physical adapters cannot promote material or invent continuity | EXEC-001 manifest validator; PLAT remains physical storage/recovery owner |
| `PREDECESSOR_SUCCESSOR_OR_PROGRESSION_PROVENANCE` | every non-genesis basis carries the accepted predecessor revision/digest, proposed successor revision/digest and source-backed `SourceSequence` observation; genesis explicitly records `NONE` predecessor | not applicable to immutable content revision 1; retry uses a new DOM attempt |
| `CAUSAL_SEQUENCE_OR_EQUIVALENT_CONTINUITY_EVIDENCE` | numeric contiguity plus the authorized source observation binding the exact accepted predecessor to the successor; a digest or self-consistent number without that relation is insufficient | DOM tuple and immutable basis are the continuity evidence |
| `SOURCE_OWNER_AND_RETURNED_PROGRESSION_DATA` | EXEC-001 owns semantic validation; the NORMAL enabled-catalog source or independent BOOTSTRAP source returns scope, predecessor, successor, digests and `SourceSequence`; REPO/PLAT cannot invent them | DOM/PLAT provide their approved manifest material only |
| `PROGRESSION_FAILURE_BEHAVIOR` | missing, detached, foreign, skipped, out-of-order, digest-divergent or source-unobserved progression returns `CONTRACT_INVALID`, preserves the last valid basis and performs no mutation | invalid attachment/basis returns `CONTRACT_INVALID` with no mutation |
| `EXPECTED_REVISION_INPUT` | every registry mutation carries `ExpectedCatalogRevision`; `NONE` is valid only for genesis, otherwise the exact current accepted revision is required | no registry mutation is owned by the manifest |
| `STALE_CONCURRENT_BEHAVIOR` | an expected revision that is not current returns `CONTRACT_INVALID` with reason `STALE_CATALOG_BASIS`; competing valid successors from one predecessor do not merge or use last-writer-wins and the losing command does not mutate state | no concurrent manifest mutation is permitted |
| `ATOMICITY_LINEARIZATION_BOUNDARY` | validate complete proposed basis, progression, overlap and idempotency key before one semantic accept/reject decision; success publishes one complete successor, failure publishes nothing; physical CAS/serialization remains PLAT-owned | manifest creation/reconstruction remains one semantic validation before materialization |
| `DUPLICATE_REQUEST_IDEMPOTENCY_BEHAVIOR` | same `RegistryMutationKey` plus identical canonical payload returns the original structured outcome and revision without a second revision; same key with different payload returns `CONTRACT_INVALID` | duplicate DOM tuple remains `CONTRACT_INVALID` |
| `RETRY_AFTER_AMBIGUOUS_OUTCOME` | retry first reconciles the authoritative registry by `RegistryMutationKey`; existing matching result is replayed, absent result with current expected basis may retry, and an advanced basis yields stale rejection | retry uses a new `AttemptId` and never mutates the historical manifest |
| `COMPETING_SUCCESSOR_ORDERING` | successors are ordered only by the accepted predecessor relation and authority acceptance; no merge, arbitrary consumer order or last-writer selection may define semantics | not applicable |
| `CONTINUITY_VALIDATION` | no skipped, duplicate or conflicting revision; each successor has source-backed predecessor/digest/`SourceSequence` evidence; no forged later basis and no overlapping supported sets within one resolution tuple | no duplicate attachment, digest/basis divergence or cross-attempt attachment |
| `STALE_STATE_BEHAVIOR` | requested stale or foreign-repository basis fails closed; current or another repository catalog cannot reinterpret a frozen basis | stale current registry cannot reinterpret historical manifest |
| `UNKNOWN_REFERENCE_BEHAVIOR` | unknown capability returns `UNKNOWN_CAPABILITY`; unknown schema/reference is `CONTRACT_INVALID` | unknown DOM attachment is `CONTRACT_INVALID` |
| `DETACHED_REFERENCE_BEHAVIOR` | detached source/entry or entry attached to another `RepositoryId` fails `CONTRACT_INVALID` | detached manifest fails `CONTRACT_INVALID` |
| `CORRUPTED_MATERIAL_BEHAVIOR` | digest/schema/continuity corruption fails `CONTRACT_INVALID` | digest/schema/identity corruption fails `CONTRACT_INVALID` |
| `STATE_SKIP_REJECTION` | skipped/out-of-order `CatalogRevision` rejects without mutation | missing or mismatched manifest basis rejects without mutation |
| `STATE_EVIDENCE_INCONSISTENCY_REJECTION` | repository identity, source, digest, key set or revision mismatch rejects | DOM tuple, basis, content revision or digest mismatch rejects |
| `FORGED_LATER_STATE_REJECTION` | a later basis with self-consistent numbers/digests but without the authorized source observation binding it to the accepted predecessor fails `CONTRACT_INVALID`; it cannot replace a frozen scoped revision | untrusted later registry/manifest cannot replace historical record |
| `DOMAIN_VALIDATION_OWNER` | EXEC-001 | EXEC-001; DOM validates referenced identity authority |
| `PERSISTENCE_ADAPTER_RESPONSIBILITY` | physical storage/integrity remains outside this SPEC; adapter cannot define semantics | PLAT serializes, stores, orders and recovers; it cannot define manifest meaning |
| `FAIL_CLOSED_FAILURES` | `CONTRACT_INVALID` for invalid/overlapping catalog basis, missing or forged progression, stale expected revision or idempotency-key conflict; `UNKNOWN_CAPABILITY` for unknown key; `INCOMPATIBLE_CAPABILITY` for known unsupported request | `CONTRACT_INVALID` for invalid material/attachment/basis |
| `FAIL_CLOSED_RESULT` | no catalog mutation or resolution success | no manifest mutation, attachment or replay success |
| `MUTATION_ON_FAILURE` | `NO` | `NO` |
| `PERSISTED_IDENTITY_STATE_VERSION` | scoped catalog revision plus entry semantic version; `ExpectedCatalogRevision` is a distinct mutation basis; `RepositoryId` is required for `NORMAL` | manifest content revision `1` plus DOM snapshot/basis revisions |
| `INVARIANTS_REVALIDATED` | unique scoped key, repository attachment when `NORMAL`, source, digest, references, semantic compatibility, disjoint support sets, progression continuity, expected revision and idempotency-key/payload consistency | identity attachment, completeness, immutability, basis, digest and cardinality |
| `EXTERNAL_REFERENCES_REQUIRED` | DOM `RepositoryId` and stage, capability, schema, artifact, verdict and role references for `NORMAL`; system catalog scope for `BOOTSTRAP` | DOM execution/activity/attempt/cycle and snapshot/catalog basis |
| `INVALID_PERSISTENCE_BEHAVIOR` | reject `CONTRACT_INVALID`, no materialization/mutation | reject `CONTRACT_INVALID`, no materialization/mutation |
| `INCOMPLETE_HISTORY_BEHAVIOR` | reject missing/omitted repository identity, catalog revision or scoped history | reject missing original basis/manifest fields or detached history |
| `PROOF_EVIDENCE` | this §12.1, §12.3–§12.4, §13, §14–§18, §21 C-EXEC-018/020/021/022/023, §22–§23 | this §12.2–§12.4, §13, §14–§18, §21–§23 |

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

O consumidor autoritativo de contratos deve declarar o conjunto explícito de
versões suportadas para cada contrato/capability aplicável. Para entradas
distintas com o mesmo tuplo de resolução `(CatalogScope, RepositoryId quando
NORMAL, StageId, SkillContractId, CapabilityId, SchemaId)`, esses conjuntos
devem ser disjuntos. Uma sobreposição torna inválida a entrada ou a base de
catálogo e deve produzir `CONTRACT_INVALID`, sem criar ou mutar
`CatalogRevision`, snapshot ou manifesto; não há precedência ou desempate
implícito. Uma versão fora do conjunto, quando a base é válida, deve produzir
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
congelado da execução. Para cada tuplo de resolução, a validação do catálogo
deve rejeitar conjuntos suportados sobrepostos entre entradas distintas com
`CONTRACT_INVALID`; portanto, uma base válida contém no máximo uma entrada que
suporta qualquer versão solicitada. A entrada resolvida, quando existe, é a
identidade completa da entrada no `CatalogRevision` congelado; nenhuma ordem
de registro, ordenação conveniente ou consumidor escolhe entre candidatos.

Toda mutação que registre uma entrada ou publique um novo `CatalogRevision`
deve carregar `ExpectedCatalogRevision` e uma `RegistryMutationKey`
determinística. `NONE` só é permitido para a criação do basis inicial; um
sucessor exige a revisão atualmente aceita. A validação da proposta, incluindo
disunção, `CatalogBasisProgression`, referências e chave de idempotência, e a
publicação do successor formam uma decisão atômica: sucesso aceita um único
basis completo; qualquer falha preserva integralmente o basis anterior. Um
expected revision stale, uma corrida entre sucessores ou chave reutilizada
com payload diferente falha `CONTRACT_INVALID` com razão observável e sem
mutação. Uma repetição da mesma chave e payload devolve o resultado original,
sem criar nova revisão; não há merge ou last-writer-wins semântico.

Authority: `O-020`, `ADR-0003`, `Decisão`.

### EXEC-REGISTRY-004 — Identidade e reconstrução determinística do registry

Cada entrada deve ser do tipo `REGISTRY_ENTRY`. Para `NORMAL`, a identidade
canônica é `(CatalogScope=NORMAL, RepositoryId, SkillContractId, CapabilityId,
SchemaId, SemanticVersion)`, em que `RepositoryId` é a identidade canônica
DOM (`DOM-ID-001`) do repositório cuja configuração habilitada fornece o
catálogo. Para `BOOTSTRAP`, a identidade é o escopo independente do catálogo
de sistema mais `(SkillContractId, CapabilityId, SchemaId, SemanticVersion)`;
`RepositoryId` não é usado para esse escopo. A chave é imutável e única no
`CatalogRevision` dentro do seu escopo; registro de chave existente,
conflitante ou duplicado falha com `CONTRACT_INVALID` sem mutação. Dentro de
cada tuplo de resolução, conjuntos suportados sobrepostos entre entradas
distintas também falham com `CONTRACT_INVALID` antes de criar a entrada ou a
nova revisão; a decisão é independente da ordem de registro e não seleciona
um candidato. Alteração semântica exige nova versão semântica e uma nova base
de catálogo.

Cada base persistida deve incluir o escopo, `RepositoryId` quando `NORMAL`,
`CatalogRevision`, origem autorizada, digest de conteúdo, referências
completas e `CatalogBasisProgression`. O basis inicial declara predecessor
`NONE`; todo sucessor declara predecessor e successor, digests correspondentes
e a `SourceSequence`/observação devolvida pela fonte autorizada que liga o
successor ao predecessor aceito. EXEC-001 é o owner da resolução e da
validação dessa relação; REPO fornece o material de configuração NORMAL,
a fonte de sistema fornece o material BOOTSTRAP e PLAT fornece apenas
persistência/integridade/ordenação física. Numericamente contíguo ou
self-consistente não é suficiente sem a relação observada pela fonte.

Criação e reidratação são operações separadas. Somente material
schema-válido, íntegro, ligado à origem e ao repositório correto quando
`NORMAL`, com continuidade de revisão e fonte, conjuntos suportados disjuntos
e referências resolvíveis pode ser reidratado. Material unknown, detached,
corrompido, stale, inconsistente, sobreposto, fora de ordem, com predecessor
ou digest divergente, sem progressão autorizada ou cross-repository falha
fechado com `CONTRACT_INVALID`; capability desconhecida e capability conhecida
incompatível conservam, respectivamente, `UNKNOWN_CAPABILITY` e
`INCOMPATIBLE_CAPABILITY`. A resolução de uma execução usa o `RepositoryId`
da execução e o `CatalogRevision` congelado, nunca outro catálogo ou o
catálogo atual por substituição implícita.

Uma mutação deve carregar `ExpectedCatalogRevision` e
`RegistryMutationKey`. A fonte semântica aceita somente um successor atômico
para o predecessor esperado; uma revisão stale, concorrência, retry sem
reconciliação ou chave idempotente conflitante retorna `CONTRACT_INVALID`,
preserva o último basis válido e não publica material parcial. Retry com a
mesma chave e payload retorna o resultado original sem nova revisão; retry após
resposta ambígua consulta primeiro a autoridade por essa chave. Assim,
reidratação de um basis posterior legítimo e rejeição de um basis posterior
forjado são observáveis sem congelar CAS, banco, journal ou outra tecnologia.

Authority: `O-020`, `ADR-0003`, `ADR-0010`, `Decisão`, identidade/reconstrução
consumidas de `DOM-ID-001`/`DOM-SNAPSHOT-001`.

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

Cada capability requerida por uma etapa deve resolver para uma única entrada
versionada do registry, com contrato de entrada/saída, vereditos, artefatos e
restrições de papel compatíveis. Em uma base válida, uma única entrada pode
suportar várias versões explícitas, mas duas entradas não podem suportar a
mesma versão dentro do mesmo tuplo de resolução. Capability desconhecida deve
resultar em `UNKNOWN_CAPABILITY`; capability conhecida mas incompatível deve
resultar em `INCOMPATIBLE_CAPABILITY`; base inválida por conjuntos sobrepostos
deve resultar em `CONTRACT_INVALID`, sem identidade selecionada, fallback ou
mutação.

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

### EXEC-MANIFEST-004 — Identidade e reconstrução do manifesto

Cada tentativa DOM possui exatamente um manifesto imutável do tipo
`ACTIVITY_ATTEMPT_MANIFEST`, cuja identidade canônica é
`(ExecutionId, ActivityId, AttemptId)` no escopo do `ArtifactCycleId`. A
criação ocorre uma vez antes do início e exige as referências DOM, o snapshot,
o basis de catálogo e todos os campos mínimos do manifesto. Criação duplicada,
attachment a outra atividade/tentativa/ciclo ou referência ausente falha com
`CONTRACT_INVALID`. O registro persistido conserva essa identidade, o tipo,
o escopo, `ManifestContentRevision = 1`, conteúdo completo e digest de
integridade; nenhum caminho, nome, hash isolado, checkpoint, correlation ou
label é identidade substituta.

Reidratação é distinta da criação. Material persistido não pode virar estado
válido diretamente: PLAT valida a integridade física e EXEC-001 valida
identidade, attachment, basis, cardinalidade, versão e campos normativos antes
de materializar. Registro desconhecido, detached, stale, corrompido,
duplicado ou com digest/basis/referência incompatível falha fechado com
`CONTRACT_INVALID`, sem mutação. Replay resolve a identidade e o basis
originais, não o registry atual; retry recebe novo `AttemptId` e novo
manifesto. A aplicação do contexto entre sessões continua sob O-025/EXEC-002 e
a durabilidade/recovery física sob PLAT.

Authority: `O-018`, `O-021`, `ADR-0003`, `ADR-0001`, `ADR-0006`, consumindo
`DOM-ID-001` e `DOM-SNAPSHOT-001`.

### EXEC-HISTORY-001 — Replay histórico

Replay ou consulta histórica deve preservar o manifesto, identidade do
repositório/catalog, schema, versões, hashes, commits, resultados e checkpoints
que pertenciam à atividade original. Um registry atual ou de outro repositório
não pode reescrever a interpretação histórica nem converter
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
| Registro de entrada versionada / publicação de novo `CatalogRevision` | `APPLICATION_COMMAND` de contrato | transporta `ExpectedCatalogRevision`, `RegistryMutationKey` e o basis completo; valida progressão, disjunção e idempotência atomically; expected revision stale, duplicata/conflito ou chave reutilizada com payload divergente falha fechado, enquanto replay idempotente devolve o resultado original; só altera o catálogo aplicável a novas resoluções e não altera snapshot/manifesto existentes |
| Resolução de skill/capability para uma etapa | `QUERY`/resolução contratual | retorna entrada, versões, schemas, artefatos, vereditos e papéis; não cria lifecycle DOM |
| Resultado JSON de uma skill | `INTEGRATION_EVENT`/resultado estruturado | precisa do envelope e schema; texto humano é auxiliar |
| Falha `CONTRACT_INVALID`, `VERDICT_UNKNOWN`, `UNKNOWN_CAPABILITY`, `INCOMPATIBLE_CAPABILITY` | `INTEGRATION_EVENT` de falha canônica | preserva família, basis e não-sucesso; sobreposição de conjuntos invalida a base com `CONTRACT_INVALID`; transporte e projeção só mapeiam |
| Manifesto de tentativa | `IMMUTABLE_ARTIFACT` contratual associado à identidade `(ExecutionId, ActivityId, AttemptId)` DOM | uma tentativa possui um registro imutável com revisão de conteúdo e digest; reidratação valida attachment/basis antes do replay; eventos que o referenciam permanecem no owner do aggregate e não confirmam efeito externo |

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
| Contract/basis | `CONTRACT_INVALID` | entrada de registry ou manifesto ausente, duplicada, detached, corrompida, stale, inconsistente, sem progressão causal, com expected revision stale, concorrência não reconciliada, conflito de `RegistryMutationKey` ou com conjuntos suportados sobrepostos na mesma chave de resolução | material não pode ser usado como contrato/basis autoritativo; nenhuma entrada é selecionada e `STALE_CATALOG_BASIS` permanece razão semântica local | não há materialização parcial, nova revisão ou mutação; correção exige uma base conforme e a mesma identidade não é sobrescrita; retry idempotente somente reapresenta o resultado já confirmado |

Todas as quatro falhas canônicas permanecem fail-closed; o caso adicional de
material inválido, inclusive sobreposição de conjuntos suportados, usa
`CONTRACT_INVALID` e não cria uma quinta família. Nenhum caminho produz
seleção, transição, nova revisão ou efeito parcial. O owner de transporte (`SPEC-BACKEND-001`) pode escolher status,
envelope ou representação local; `SPEC-OPS-001` pode registrar e `SPEC-UI-001`
apresentar. Nenhum pode renomear a semântica, torná-la sucesso ou substituí-la
por falha de outro owner.

## 16. Retry / Idempotency / Recovery

O contrato canônico distingue validade de contrato de política operacional de
tentativas:

- falha de JSON/schema/veredito/capability ou base sobreposta nunca é sucesso e
  não recebe retry implícito dentro do contrato;
- uma política operacional pode solicitar nova tentativa, mas deve conservar
  a identidade do repositório/catalog, a versão/basis declarada e produzir novo
  resultado estruturado;
- retry não pode converter uma versão incompatível, reciclar silenciosamente
  um manifesto, contornar uma base sobreposta ou duplicar um efeito externo;
- mutação de registry é uma semântica EXEC distinta da idempotência de efeitos
  de PLAT: o comando carrega `ExpectedCatalogRevision` e
  `RegistryMutationKey`, valida a progressão e publica no máximo um successor;
  expected revision stale ou corrida concorrente retorna `CONTRACT_INVALID`
  sem mutação, e uma repetição idêntica reapresenta o resultado original sem
  nova revisão;
- após resposta ambígua, o retry de registry reconcilia primeiro a autoridade
  por `RegistryMutationKey`; só reapresenta o mesmo comando se não houver
  resultado e a revisão esperada continuar corrente, caso contrário retorna
  stale; merge e last-writer-wins não são semântica de EXEC;
- `AttemptId` permanece identidade canônica de `SPEC-DOM-001`; cada retry usa
  novo `AttemptId` e novo manifesto, enquanto assignment/sessão operacional
  pertence a `SPEC-EXEC-002`;
- o manifesto de uma tentativa não é mutado nem substituído por um registro de
  outra tentativa; persistência, replay de journal, idempotência de efeito e
  reconciliação seguem `SPEC-PLAT-001`/`SPEC-GIT-001`;
- EXEC-001 expõe checkpoint, manifesto e basis para retomada; a aplicação do
  contexto entre sessões segue `O-025`/`SPEC-EXEC-002` e a recuperação física
  segue `SPEC-PLAT-001`; CAS, serialização, journal e durabilidade não escolhem
  os resultados semânticos de stale, concorrência ou idempotência do registry.

## 17. Compatibility / Cutover

| Classe | Papel EXEC-001 | Regra |
|---|---|---|
| `NEW_CANONICAL_PATH` | `OWNER` (`O-016`, `O-020`) | novos resultados e resoluções usam envelope/schema/registry canônicos; bases com conjuntos sobrepostos são rejeitadas fail-closed |
| `LEGACY_COMPATIBILITY` | `CONSUMER` de `SPEC-REPO-001` | legado pode ser adaptado por REPO para o caminho canônico; não é segundo registry nem segunda semântica |
| `HISTORICAL_REPLAY` | `OWNER` (`O-021`) | manifesto, identidade do repositório/catalog, versão, schema, hashes e resultados históricos permanecem interpretáveis pelo basis original; uma tentativa de introduzir sobreposição não reinterpreta bases históricas válidas |
| `CUTOVER` | `OWNER` (`O-018`) | alteração incompatível exige nova versão/basis; qualquer nova base deve manter conjuntos disjuntos e uma base inválida não pode substituir o basis antigo; snapshots existentes não são mutados |
| `RETIREMENT` | `NOT_APPLICABLE` | ADR-0003 não atribui aposentadoria independente do registry a EXEC-001 |

Não há fases de implementação nesta seção. Compatibilidade histórica não
autoriza conversão silenciosa nem mantém um contrato legado como autoridade
canônica indefinidamente.

## 18. Projection Boundaries

| Fonte canônica | Projeção/consumidor | Refresh/replay/stale behavior | Limite |
|---|---|---|---|
| Registry e schemas EXEC-001 | EXEC-002/REPO/BACKEND | resolver novamente somente para nova base no `RepositoryId` correto; snapshot antigo permanece congelado | consumidor não edita registry por projeção |
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
  resolvidos conforme o conjunto explícito suportado; versão fora do conjunto
  válido não recebe aproximação.
- `C-EXEC-004`: em uma base válida, registry resolve etapa/capability com
  entradas/saídas, artefatos, vereditos e papel corretos, retornando a
  identidade completa da única entrada que suporta a versão solicitada.
- `C-EXEC-005`: catálogo bootstrap resolve descoberta/validação/migração/
  auditoria/remediação antes de `ENABLED`.
- `C-EXEC-006`: capability sintética registrada no mesmo registry é resolvida
  sem regra especial por categoria.
- `C-EXEC-007`: manifesto completo e imutável é associado a Activity/Attempt
  DOM e declara checkpoint seguro.
- `C-EXEC-018`: entradas `NORMAL` de dois `RepositoryId` distintos com o
  mesmo `(SkillContractId, CapabilityId, SchemaId, SemanticVersion)` resolvem
  somente dentro do catálogo do repositório solicitado; a entrada resolve
  pela chave completa e pelo `CatalogRevision`. Material reidratado com
  digest, origem, referência, escopo/repositório ou continuidade inválidos não
  é materializado e uma duplicata não substitui a entrada existente.
- `C-EXEC-019`: uma tentativa cria exatamente um manifesto pela tupla DOM;
  reidratação valida identidade, attachment, basis, revisão de conteúdo e
  digest antes do replay.

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
- `C-EXEC-020`: registro duplicado ou material de registry/manifesto
  desconhecido, detached, corrompido, stale, cross-repository ou inconsistente
  produz `CONTRACT_INVALID`, sem mutação; capability desconhecida e
  incompatível mantêm seus códigos canônicos.
- `C-EXEC-021`: para duas entradas distintas do mesmo tuplo de resolução, uma
  interseção de conjuntos suportados (por exemplo, A `{1.5.0}` e B `{1.5.0}`)
  falha com `CONTRACT_INVALID` tanto na ordem de registro A→B quanto B→A, sem selecionar
  identidade, criar `CatalogRevision`, alterar a base anterior ou permitir
  manifesto/snapshot derivado. Conjuntos não sobrepostos (por exemplo,
  A `{1.5.0, 1.6.0}` e B `{2.0.0}`) resolvem 1.5.0 e 1.6.0 para A e 2.0.0
  para B, com a identidade completa e o basis congelado; uma solicitação fora
  desses conjuntos produz `INCOMPATIBLE_CAPABILITY`. Replay histórico mantém
  o basis válido original, e nenhum consumidor ou camada de projeção escolhe
  precedência.
- `C-EXEC-022`: um basis inicial e um successor legítimo reidratam somente
  quando a fonte autorizada retorna `CatalogBasisProgression` com predecessor,
  successor, digests, escopo e `SourceSequence` correspondentes ao basis aceito.
  Um basis posterior auto-consistente mas sem essa observação, com predecessor
  ou digest divergente, salto, fonte detached/foreign ou sequência fora de
  ordem produz `CONTRACT_INVALID`, preserva o último basis válido e não muta o
  catálogo; replay histórico conserva a relação original.
- `C-EXEC-023`: registro de entrada/publicação de novo basis exige
  `ExpectedCatalogRevision` e `RegistryMutationKey`. Uma proposta válida
  aceita um único successor atomicamente; uma corrida com expected revision
  stale retorna `CONTRACT_INVALID` com `STALE_CATALOG_BASIS` e sem mutação.
  Repetição após resposta ambígua reconcilia por chave: mesma chave e payload
  devolve o resultado original sem nova revisão, chave reutilizada com payload
  diferente falha, e ausência de resultado só permite reapresentação se a
  revisão esperada ainda for corrente. Não há merge nem last-writer-wins.

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
- `C-EXEC-022` e `C-EXEC-023` também são recovery/concurrency witnesses:
  nenhum retry de reconstrução ou mutação pode promover material sem relação
  causal, ultrapassar basis stale ou produzir uma segunda revisão.

Esses testes devem ser executáveis contra a implementação produtiva quando ela
existir. Os testes atuais do protótipo não satisfazem esta suíte.

## 22. Acceptance Criteria

| ID | Critério binário | Requirement |
|---|---|---|
| AC-EXEC-001 | Dado envelope e payload válidos, ambos passam nos schemas registrados; texto isolado nunca é aceito como resultado autoritativo. | EXEC-ENVELOPE-001 |
| AC-EXEC-002 | Um resultado sem qualquer campo mínimo estruturado exigido é rejeitado com `CONTRACT_INVALID`, sem ser inferido de texto. | EXEC-ENVELOPE-002 |
| AC-EXEC-003 | O registry exibe semver e classifica corretamente major/minor/patch em um caso compatível e um incompatível. | EXEC-VERSION-001 |
| AC-EXEC-004 | Uma versão fora do conjunto suportado, quando a base é válida, produz `INCOMPATIBLE_CAPABILITY`, sem alias ou conversão silenciosa; conjuntos suportados sobrepostos entre entradas distintas da mesma chave de resolução rejeitam o registro/basis com `CONTRACT_INVALID`, sem mutação ou precedência; payload/schema inválido produz `CONTRACT_INVALID`. | EXEC-VERSION-002 |
| AC-EXEC-005 | Após iniciar a atividade, alteração no registry não muda a versão observada no snapshot/manifesto da atividade. | EXEC-SNAPSHOT-001 |
| AC-EXEC-006 | JSON inválido, schema incompatível ou desconhecido resulta em `CONTRACT_INVALID` e nenhum avanço/efeito é produzido. | EXEC-CONTRACT-001 |
| AC-EXEC-007 | Veredito desconhecido ou ausente quando obrigatório resulta em `VERDICT_UNKNOWN`, nunca em aprovação. | EXEC-CONTRACT-002 |
| AC-EXEC-008 | Para uma etapa registrada em base válida, a resolução retorna deterministicamente capability, skill, versões, schemas, artefatos, vereditos, papel, identidade completa da única entrada compatível e `CatalogRevision`; nenhum ordenamento seleciona entre candidatos. | EXEC-REGISTRY-001 |
| AC-EXEC-009 | Catálogo normal e bootstrap possuem versões/fontes independentes e uma alteração em um não muta o outro. | EXEC-REGISTRY-002 |
| AC-EXEC-010 | Solicitação de capability fora da allowlist bootstrap produz `INCOMPATIBLE_CAPABILITY` antes de habilitação ou execução normal. | EXEC-REGISTRY-003 |
| AC-EXEC-011 | Capability inexistente e capability incompatível em base válida produzem, respectivamente, `UNKNOWN_CAPABILITY` e `INCOMPATIBLE_CAPABILITY`; base com conjuntos suportados sobrepostos produz `CONTRACT_INVALID`, sem identidade selecionada ou mutação. | EXEC-CAPABILITY-001 |
| AC-EXEC-012 | Uma capability sintética registrada conforme schema é resolvida pelo mesmo caminho de registry sem código específico de categoria. | EXEC-CAPABILITY-002 |
| AC-EXEC-013 | Cada atividade iniciada possui manifesto imutável com paths, hashes, commits, basis, dependências, findings, rodada, tentativa, config, workdir, schema e versões. | EXEC-MANIFEST-001 |
| AC-EXEC-014 | O manifesto declara checkpoint/basis de retomada; EXEC-001 não autoriza retomada sem essa declaração, e a aplicação do contexto persistido permanece sob `O-025`/`SPEC-EXEC-002` e `SPEC-PLAT-001`. | EXEC-MANIFEST-002 |
| AC-EXEC-015 | Tentativa de modificar manifesto, schema ou versão após início não altera o registro histórico nem o resultado associado. | EXEC-MANIFEST-003 |
| AC-EXEC-016 | Replay histórico reproduz o basis original mesmo quando o registry atual contém versão diferente. | EXEC-HISTORY-001 |
| AC-EXEC-017 | Toda falha canônica contém código/família, contrato, versão/basis e causa observável, sem aprovação ou confirmação implícita. | EXEC-FAILURE-001 |
| AC-EXEC-018 | Um retry solicitado externamente não altera semântica de falha, não converte versão e não confirma efeito externo por si só; um retry usa novo `AttemptId` e manifesto. | EXEC-FAILURE-001, EXEC-MANIFEST-002 |
| AC-EXEC-019 | Para `NORMAL`, uma chave `(CatalogScope=NORMAL, RepositoryId, SkillContractId, CapabilityId, SchemaId, SemanticVersion)` resolve somente no catálogo do `RepositoryId` da execução; para `BOOTSTRAP`, a chave permanece no catálogo de sistema independente. A resolução usa o `CatalogRevision` congelado; same-key duplicate/conflict, conjuntos suportados sobrepostos, digest/origem/referência/escopo inválidos, cross-repository lookup e quebra de continuidade produzem `CONTRACT_INVALID` sem mutação. | EXEC-REGISTRY-004 |
| AC-EXEC-020 | Cada tentativa tem exatamente um manifesto com identidade `(ExecutionId, ActivityId, AttemptId)`, `ManifestContentRevision = 1` e digest; criação duplicada, attachment detached ou reidratação stale/corrompida é rejeitada com `CONTRACT_INVALID`, uma base de catálogo sobreposta não pode originar manifesto e replay usa o basis original. | EXEC-MANIFEST-004 |
| AC-EXEC-021 | Basis inicial e successor de catálogo só podem ser reidratados quando a `CatalogBasisProgression` retornada pela fonte autorizada vincula predecessor aceito, successor, digests, escopo e `SourceSequence`; basis posterior auto-consistente, forged, skipped, detached, foreign ou divergente falha `CONTRACT_INVALID`, preserva o basis válido e não muta o catálogo. | EXEC-REGISTRY-004 |
| AC-EXEC-022 | Toda publicação de entrada/nova revisão exige `ExpectedCatalogRevision` e `RegistryMutationKey`: uma proposta válida publica um único successor atomically; expected revision stale/concurrent retorna `CONTRACT_INVALID`/`STALE_CATALOG_BASIS` sem mutação; retry idêntico reapresenta o resultado original sem nova revisão, chave com payload diferente falha e retry ambíguo reconcilia a autoridade antes de repetir. | EXEC-REGISTRY-001, EXEC-REGISTRY-004 |

## 23. ADR / Obligation / Requirement Traceability

| Requirement | Portfolio obligation | ADR | ADR section | Ownership role | Acceptance / test |
|---|---|---|---|---|---|
| EXEC-ENVELOPE-001 | O-016 | ADR-0003 | Decisão | canonical owner | AC-EXEC-001; C-EXEC-001 |
| EXEC-ENVELOPE-002 | O-016 | ADR-0003 | Decisão | canonical owner | AC-EXEC-002; C-EXEC-002 |
| EXEC-VERSION-001 | O-017 | ADR-0003 | Decisão | canonical owner | AC-EXEC-003; C-EXEC-003 |
| EXEC-VERSION-002 | O-017 | ADR-0003 | Decisão | canonical owner | AC-EXEC-004; C-EXEC-003, C-EXEC-021 |
| EXEC-SNAPSHOT-001 | O-018 | ADR-0003 | Decisão | canonical owner; consumes DOM-SNAPSHOT-001 | AC-EXEC-005; C-EXEC-012, C-EXEC-016 |
| EXEC-CONTRACT-001 | O-019 | ADR-0003 | Decisão | canonical owner | AC-EXEC-006; C-EXEC-008 |
| EXEC-CONTRACT-002 | O-019 | ADR-0003 | Decisão | canonical owner | AC-EXEC-007; C-EXEC-009 |
| EXEC-REGISTRY-001 | O-020 | ADR-0003 | Decisão | canonical owner | AC-EXEC-008, AC-EXEC-022; C-EXEC-004, C-EXEC-021, C-EXEC-023 |
| EXEC-REGISTRY-004 | O-020 | ADR-0003; ADR-0001; ADR-0010 | Decisão; DOM-ID-001/DOM-SNAPSHOT-001; configuração normal por repositório | canonical owner; consumes DOM authority | AC-EXEC-019, AC-EXEC-021, AC-EXEC-022; C-EXEC-018, C-EXEC-020, C-EXEC-021, C-EXEC-022, C-EXEC-023 |
| EXEC-REGISTRY-002 | O-020 | ADR-0003 | Decisão | canonical owner | AC-EXEC-009; C-EXEC-005 |
| EXEC-REGISTRY-003 | O-020 | ADR-0003 | Decisão | canonical owner | AC-EXEC-010; C-EXEC-011 |
| EXEC-CAPABILITY-001 | O-020 | ADR-0003 | Decisão | canonical owner | AC-EXEC-011; C-EXEC-010, C-EXEC-021 |
| EXEC-CAPABILITY-002 | O-020 | ADR-0003 | Decisão | canonical owner | AC-EXEC-012; C-EXEC-006 |
| EXEC-MANIFEST-001 | O-021 | ADR-0003 | Decisão | canonical owner; consumes DOM-ID-001 | AC-EXEC-013; C-EXEC-007 |
| EXEC-MANIFEST-002 | O-021 | ADR-0003 | Decisão | canonical owner; recovery consumed from PLAT/EXEC-002 | AC-EXEC-014; C-EXEC-017 |
| EXEC-MANIFEST-003 | O-018, O-021 | ADR-0003 | Decisão | canonical owner; consumes DOM-SNAPSHOT-001 | AC-EXEC-015; C-EXEC-012 |
| EXEC-MANIFEST-004 | O-018, O-021 | ADR-0003; ADR-0001; ADR-0006 | Decisão; DOM-ID-001/DOM-SNAPSHOT-001 | canonical owner; PLAT physical consumer | AC-EXEC-020; C-EXEC-019, C-EXEC-020 |
| EXEC-HISTORY-001 | O-021 | ADR-0003 | Decisão | canonical owner | AC-EXEC-016; C-EXEC-016 |
| EXEC-FAILURE-001 | O-019 | ADR-0003 | Decisão | canonical failure owner; mappings consumed by BACKEND/OPS/UI | AC-EXEC-017, AC-EXEC-018; C-EXEC-014 |

`REQUIREMENTS_WITHOUT_PORTFOLIO_OBLIGATION = 0` e
`OWNED_OBLIGATIONS_WITHOUT_REQUIREMENT = 0`.

Every changed or added requirement is authority-backed, observable,
implementation-independent and covered by a direct positive and negative
witness; no witness promotes local testability to productive availability.

## 24. Known Gap Summary

Esta tabela registra divergência observada; não é a Gap Matrix formal.

| Gap subject | Classification | Related requirement | Evidence |
|---|---|---|---|
| Schemas JSON e validação produtiva ausentes | `IMPLEMENTATION_GAP` | EXEC-ENVELOPE-001/002, EXEC-CONTRACT-001/002 | nenhum runtime/schema produtivo; somente `prototype/src/mockDomain.ts` |
| Registry normal/bootstrap ausente | `IMPLEMENTATION_GAP` | EXEC-REGISTRY-001/002/003/004, EXEC-CAPABILITY-001/002 | nenhum catálogo produtivo encontrado |
| Regra de sobreposição de versões suportadas | `NON_GAP` normativo; implementação ainda é gap | EXEC-VERSION-002, EXEC-REGISTRY-001/004, EXEC-CAPABILITY-001 | revisão 5 rejeita base sobreposta com `CONTRACT_INVALID`; C-EXEC-021 cobre sobreposição, ordens de registro, resolução única, identidade, basis e replay |
| Progressão causal do basis de catálogo e rejeição de basis posterior forjado | `NON_GAP` normativo; implementação ainda é gap | EXEC-REGISTRY-004 | revisão 5 exige `CatalogBasisProgression`, predecessor/successor, digests e `SourceSequence`; C-EXEC-022 prova sucessor legítimo e rejeições sem mutação |
| Concorrência, stale e retry idempotente de mutação do registry | `NON_GAP` normativo; implementação ainda é gap | EXEC-REGISTRY-001/004 | revisão 5 exige `ExpectedCatalogRevision`, `RegistryMutationKey`, atomicidade semântica, stale rejection e reconciliação; C-EXEC-023 cobre corrida, duplicata e resposta ambígua |
| Manifesto/checkpoint produtivo ausente | `IMPLEMENTATION_GAP` | EXEC-MANIFEST-001/002/003/004, EXEC-HISTORY-001 | campos simulados em memória; nenhum registro persistido |
| Runtime de skill e consumidores reais ausentes | `IMPLEMENTATION_GAP` | todos os requisitos EXEC | não há backend/.NET, scheduler ou onboarding produtivo |
| Protótipo e testes de mock | `PROTOTYPE_ONLY` | todos | `prototype/src/*`, `prototype/tests/*`, `prototype/README.md` |
| Autoridade normativa desta SPEC após remediação | `NON_GAP` | todos | requisitos, identidade, reconstrução, rejeição de sobreposição, acceptance e conformance materializados; validação independente ainda pendente |
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
foi criado. A revisão upstream exigida é `SPEC-DOM-001` revision `4`, conforme a
auditoria upstream conformante vigente; nenhuma referência normativa
superseded permanece.

## 26. Risks

| Risk | Mitigation / conformance |
|---|---|
| Identidade de entrada ou manifesto ser substituída por alias/digest/path | EXEC-REGISTRY-004, EXEC-MANIFEST-004 e C-EXEC-018/019/020 |
| Texto humano virar autoridade | EXEC-ENVELOPE-001/002 e C-EXEC-002 |
| Conversão silenciosa entre versões | EXEC-VERSION-002, EXEC-SNAPSHOT-001 e C-EXEC-003/012 |
| Conjuntos suportados sobrepostos produzirem seleção por ordenação ou registro | EXEC-VERSION-002, EXEC-REGISTRY-001/004, EXEC-CAPABILITY-001 e C-EXEC-021 |
| Basis posterior forjado ou detached ser aceito pela continuidade numérica isolada | EXEC-REGISTRY-004, C-EXEC-022 e `CatalogBasisProgression` |
| Corrida de publicação gerar successor conflitante ou retry duplicado | EXEC-REGISTRY-001/004, C-EXEC-023 e seção 16 |
| Registry normal e bootstrap virarem autoridade dupla ou um catálogo NORMAL ser resolvido em outro repositório | EXEC-REGISTRY-002/003/004 e C-EXEC-005/011/018 |
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
- `SPEC-DOM-001` upstream revision 4 com auditoria independente conformante;
- ownership, consumers e exclusões explícitos;
- envelope, semver, registry, bootstrap, capabilities, manifestos,
  checkpoints e falhas definidos normativamente;
- conjuntos suportados sobrepostos na mesma chave de resolução falham
  `CONTRACT_INVALID` sem precedência, mutação, identidade selecionada ou
  reinterpretação histórica;
- cada successor de catálogo possui `CatalogBasisProgression` observável,
  predecessor/digest e `SourceSequence` autorizados; basis posterior forjado,
  detached ou sem relação causal falha fechado sem mutação;
- mutação de registry exige `ExpectedCatalogRevision` e
  `RegistryMutationKey`, com decisão atômica, stale rejection, ordenação pelo
  predecessor aceito e retry idempotente sem nova revisão;
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
OWNED_OBLIGATIONS_PARTIAL = 0
NORMATIVE_REQUIREMENTS = 19
REQUIREMENTS_WITHOUT_AUTHORITY = 0
UNTESTABLE_REQUIREMENTS = 0
ACCEPTANCE_GAPS = 0
CONSUMED_CONTRACTS = 2 contract groups from SPEC-DOM-001 revision 4
CONSUMED_CONTRACTS_REDEFINED = 0
FAILURES_OWNED = 4
FAILURES_CONSUMED = 0
AMBIGUOUS_FAILURE_OWNERS = 0
NORMATIVE_DEPENDENCIES = 1
UNAPPROVED_DEPENDENCIES = 0
MISSING_REQUIRED_DEPENDENCIES = 0
DEPENDENCY_DIRECTION_VIOLATIONS = 0
FAILURE_OWNER_VIOLATIONS = 0
COMPATIBILITY_OWNER_VIOLATIONS = 0
KNOWN_SPECIFICATION_GAPS = 0
KNOWN_IMPLEMENTATION_GAPS = 4
ARCHITECTURE_GAPS = 0
PORTFOLIO_GAPS = 0
UPSTREAM_CONTRACT_GAPS = 0
IMPLEMENTATION_PLAN_LEAKS = 0
IMPLEMENTER_DECISION_CHECKS = 19
IMPLEMENTER_DECISION_CHECK_FAILURES = 0
RECONSTRUCTION_AUTHORITY_GAPS = 0
CONCURRENCY_SEMANTICS_GAPS = 0
LIFECYCLE_AUTHORITY_GAPS = 0
OVERLAP_SELECTION_RULE = REJECT_OVERLAPPING_SUPPORTED_SETS_FAIL_CLOSED
OVERLAP_CANONICAL_FAILURE = CONTRACT_INVALID
CATALOG_PROGRESSION_RULE = SOURCE_BACKED_PREDECESSOR_SUCCESSOR_EVIDENCE
CATALOG_MUTATION_EXPECTED_REVISION = REQUIRED
CATALOG_MUTATION_ATOMICITY = ONE_SUCCESSOR_OR_NO_MUTATION
CATALOG_MUTATION_IDEMPOTENCY = SAME_KEY_AND_PAYLOAD_REPLAYS_ORIGINAL_RESULT
CAPABILITY_AVAILABILITY_CLASSIFICATION_ERRORS = 0
DOWNSTREAM_PROMOTION_WITHOUT_NEW_EVIDENCE = 0
ACCEPTANCE_CRITERIA = 22
CONFORMANCE_TESTS = 23
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
- Sobreposição de conjuntos suportados não possui precedência: é rejeitada
  antes de criar/revisar o catálogo, independentemente da ordem de registro;
  base válida resolve uma única identidade e preserva replay.
- Progressão de catálogo exige predecessor/successor, digests e observação da
  fonte autorizada; continuidade numérica isolada não é autoridade.
- Concorrência de mutação exige expected revision, stale rejection,
  atomicidade semântica e replay idempotente; CAS/journal permanecem detalhes
  de PLAT e não escolhem o resultado.
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
COMPONENT_SPEC_REMEDIATION_MATERIALIZATION_COMPLETE
REMEDIATED_FINDINGS = CSC-MAJOR-003, CSC-MAJOR-004
REVISION = 5
```

The artifact is ready for the next independent component SPEC conformance
audit. It is not an accepted implementation specification until that audit
returns the repository-governed conformant verdict. The rejection rule is a
SPEC contract completion, not an implementation approval or a downstream gate.

```text
READY_FOR_INDEPENDENT_COMPONENT_SPEC_REAUDIT
```
