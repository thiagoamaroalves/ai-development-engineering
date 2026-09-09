# DOM-001-TICKET-004 — Revalidação do Implementation Design

## 1. Specialist Result

`SPECIALIST_DESIGN_FINDINGS`

`DOMAIN_AUDIT_COMPLETE = YES`

`REVALIDATION_CLASSIFICATION = UPSTREAM_DESIGN_AUTHORITY_GAP`

Os dois blockers não podem ser resolvidos legitimamente apenas no
Implementation Design existente. O design precisa ser revalidado depois de
decisões normativas upstream sobre identidade do pipeline e prova de
progressão persistida.

## 2. Audit Subject

| Item | Valor |
|---|---|
| Ticket | `DOM-001-TICKET-004` |
| Design | `docs/tickets/SPEC-DOM-001/DOM-001-TICKET-004-implementation-design.md` |
| Remediation | `docs/tickets/SPEC-DOM-001/DOM-001-TICKET-004-implementation-remediation.md` |
| Initial canonical audit | `docs/tickets/SPEC-DOM-001/DOM-001-TICKET-004-implementation-audit.md` |
| Ticket status | `VALIDATION_REQUIRED` |
| Audit target | `a58ce959f9b34f3c1c83ed41c01b058d31bf3366` plus working-tree implementation state recorded by the ticket |

## 3. Audit Mode

```text
READ_ONLY
INDEPENDENT
ADVERSARIAL
AUTHORITY_FIRST
DESIGN_REVALIDATION_ONLY
IMPLEMENTATION_AS_EVIDENCE_ONLY
NO_CODE_OR_TEST_CHANGES
NO_UPSTREAM_CHANGES
```

## 4. Authority / Design Baseline

A autoridade efetiva é `ADR-0001`/`ADR-0002`, a SPEC-DOM-001, o Gap Matrix
validado, o Implementation Plan validado e, dentro desses limites, o design
do ticket. Os dois audits de planejamento declararam ausência de gaps de
autoridade, mas esses audits não podem decidir semânticas ausentes.

Autoridade relevante:

- `ADR-0001`: identidade persistente, escopo, revisão/linhagem, resolução
  histórica e distinção entre identidades.
- `ADR-0002`: ordem canônica, máquinas separadas, derivação de estados
  superiores e rejeição de transições inválidas.
- `ADR-0006`: journal append-only, replay/recovery a partir de checkpoint
  seguro e regra de que status isolado não prova conclusão.
- `SPEC-DOM-001` §12, `DOM-ID-001`, `DOM-PIPE-001`, `DOM-STATE-001` e
  `DOM-CMD-001`: DOM é owner de identidade, pipeline, estado e pré-condições.
- `SPEC-PLAT-001`: PLAT persiste e reconcilia registros físicos, mas não pode
  alterar identidade canônica ou transição DOM.
- `GAP-009`/`GAP-010` e `DOM-IMP-04`: cobrem ordenação, separação e derivação,
  sem congelar a identidade concreta do aggregate nem a proveniência de
  reidratação.

O design atual modela `WorkflowPipeline` como Aggregate Root, mantém um
`PipelineId` local e descreve reidratação por estágio/revisão, mas marca
`Open Questions / Blockers = NONE`. Essa parte não é sustentável diante dos
dois blockers recebidos.

## 5. Implementation Diff

A implementação foi consultada somente para confirmar a manifestação dos
blockers: `src/domain/pipeline.ts` usa `PipelineId` local e
`WorkflowPipeline.rehydrate` recebe apenas `id`, `stage` e `revision`;
`src/application/pipeline.ts` e o teste usam essa identidade. A remediação
registrou três correções locais e deixou `IMA-CRITICAL-001` e
`IMA-MAJOR-002` bloqueados. Nenhum código ou teste foi alterado nesta
revalidação.

## 6. Responsibility Conformance

| Responsabilidade | Owner já decidido | Estado da revalidação |
|---|---|---|
| Ordem e sucessor imediato | `WorkflowPipeline` / `PipelineOrder` | Decidido; não é blocker desta análise |
| Identidade canônica dos aggregates | DOM / `SPEC-DOM-001` | Obrigação decidida; binding concreto do pipeline ausente |
| Persistência física e recovery | PLAT | Owner decidido; evidência semântica de progressão do pipeline ausente |
| Reidratação sem bypass | Aggregate, com evidência fornecida pelo adapter | Princípio decidido; contrato mínimo da evidência ausente |
| Command identity e repository key | Devem preservar identidade aggregate canônica | Forma concreta não decidida para `WorkflowPipeline` |

## 7. Component Conformance

`WorkflowPipeline`, `PipelineStage`, `PipelineRevision`, repository port,
handlers e state-input boundary continuam componentes compatíveis com o
escopo local. A existência de `PipelineId` como identidade canônica e o
contrato escalar de `rehydrate` não podem ser aprovados como detalhes locais:
eles alteram contratos públicos, persistência e invariantes.

Não há base para introduzir framework genérico de state machine, factory
hierarchy, event bus ou abstração de serviço.

## 8. Domain Model Conformance

O design decide que `WorkflowPipeline` é o aggregate root que possui o estágio
canônico e o avanço ordenado. Isso não decide, upstream, se sua identidade
canônica é uma identidade própria de pipeline, uma identidade de etapa
(`StageId`) ou outra referência DOM explicitamente vinculada.

Consequentemente, a identidade de domínio não pode ser fechada pelo design
atual. Pela regra `DOM-ID-001`, se `WorkflowPipeline` é um aggregate normativo,
sua identidade deve ser canônica, persistente, resolvível e distinta de
labels/nomes locais. A decisão concreta ainda não existe.

## 9. Aggregate Boundary Audit

O boundary permanece correto: `WorkflowPipeline` decide a transição de seu
próprio estágio; as outras máquinas são referências somente leitura; repository
não decide ordem. O problema é que a raiz não tem uma identidade de aggregate
autoritativamente ligada ao catálogo DOM e pode ser reidratada sem prova de
histórico.

Isso é um problema de autoridade e reconstrução do aggregate, não autorização
para mover invariantes para handler, mapper ou repository.

## 10. Invariant Placement Audit

| Invariante | Decisão existente | Lacuna |
|---|---|---|
| Ordem canônica e sucessor imediato | `ADR-0002`, `DOM-PIPE-001`, design §14 | Nenhuma para avanço normal |
| Separação das máquinas | `ADR-0002`, `DOM-STATE-001` | Nenhuma para a separação estrutural |
| Identidade aggregate persistente | `ADR-0001`, `DOM-ID-001` | Não define qual referência/kind/scope identifica o pipeline |
| Reidratação não fabrica estágio posterior | `ADR-0002` e design | Não define qual evidência persistida torna a progressão legítima |
| CAS/stale | Design §13/§17 e contrato repository | `PipelineRevision` é revisão de persistência; não foi definida como prova causal de toda progressão |

## 11. Domain Rule Duplication Audit

Não foi encontrada duplicação normativa relevante. O risco é o inverso:
contratos insuficientemente definidos podem levar handlers, adapters ou
repository a inventarem a identidade e a validade histórica.

## 12. Value Object / Primitive Audit

`CanonicalIdentityReference` já existe no boundary de identidade do TICKET-001,
com `identity + revision`; o design de TICKET-004 não especifica sua aplicação
ao pipeline. `PipelineId` pode ser um Value Object local de transporte interno,
mas não pode ser aceito como autoridade canônica sem decisão upstream.

Não é legítimo escolher entre remover `PipelineId`, mantê-lo como wrapper local
ou vinculá-lo/derivá-lo da referência canônica durante a implementação.

## 13. Domain Service Audit

`PipelineOrder` e a política de derivação permanecem responsabilidades focadas.
Nenhuma política genérica deve absorver identity resolution ou reconstrução
persistida para mascarar a lacuna.

## 14. Application Service Audit

Handlers podem validar formato de entrada, carregar o aggregate, invocar a
decisão de domínio, persistir via port e mapear resultados. Não podem decidir:

- o `kind`, `scope`, correlação ou chave canônica do pipeline;
- quais registros de histórico bastam para validar um estágio posterior;
- uma relação estágio/revisão não definida upstream.

## 15. Repository / Persistence Boundary Audit

O repository/adapter pode desserializar, resolver registros, verificar
integridade física, ordenar journal/provenance e executar CAS. Ele não pode
inventar um estágio, selecionar um `kind` ou transformar uma fotografia escalar
em prova de progressão.

ADR-0006 e `SPEC-PLAT-001` exigem histórico append-only e recuperação de
checkpoint, mas não definem a forma mínima de evidência causal específica de
`WorkflowPipeline`. Essa forma precisa ser decidida no contrato DOM e então
refletida no contrato de persistência PLAT.

## 16. Anti-Corruption / Cross-Spec Design Audit

DOM continua owner da identidade e transição; PLAT é owner da persistência e
recovery físicos; consumidores apenas mapeiam. A fronteira é preservada, mas
precisa de um contrato explícito para que a referência canônica e a
proveniência atravessem DOM↔PLAT sem transferência de autoridade.

## 17. SOLID Audit

Nenhuma violação material de SRP, OCP, LSP, ISP ou DIP foi criada pelos dois
blockers. Adicionar uma abstração genérica para encobrir decisões ausentes
seria overengineering e não resolveria a autoridade.

## 18. Dependency Direction Audit

O domínio não deve depender de banco, journal, serializer ou framework. A
direção correta é: adapter fornece dados/proveniência validáveis; aggregate
decide sua validade sem conhecer a tecnologia. A ausência do contrato não
autoriza inverter essa direção.

## 19. Lifecycle Design Audit

`create(...)` deve continuar diferente de `rehydrate(...)`: criação inicia o
pipeline no primeiro estágio e na revisão inicial; reidratação pode restaurar
estágios posteriores somente quando a autoridade persistida provar a cadeia
legítima. Não há autorização para limitar todos os registros persistidos ao
estágio inicial.

## 20. Failure / Recovery Structure Audit

Falhas de identidade não resolvida, escopo/kind incompatível, cadeia de
proveniência ausente ou inconsistente e estágio não comprovado devem falhar
fechado, sem mutação. O aggregate deve validar semântica; o adapter/repository
deve fornecer e validar a integridade do material persistido. A divisão exata
dessas validações ainda precisa ser normativamente congelada.

## 21. Clean Code Structural Audit

O design é coeso e não requer novas abstrações. Porém, a frase
“one pipeline record containing canonical stage and persistence revision” e o
contrato `rehydrate(id, stage, revision)` são insuficientes para a semântica
exigida pelos blockers. Isso é uma lacuna de contrato, não um problema que
clean code possa resolver.

## 22. Testability / Structural Test Audit

Depois da decisão upstream, os testes deverão provar, no mínimo:

- criação, resolução, igualdade e imutabilidade da identidade canônica do
  pipeline;
- rejeição de kind/scope/revision/reference incompatíveis;
- que command e repository usam a mesma identidade canônica;
- reidratação inicial válida sem histórico adicional, se assim decidido;
- reidratação posterior somente com a evidência normativa definida;
- predecessor ausente, salto, ordem incorreta, revisão/cadeia inconsistente e
  provenance fabricada rejeitados;
- `create(...)` não aceita estado posterior e `rehydrate(...)` não vira setter;
- CAS continua sendo stale protection e não substitui a prova causal.

Não se deve adicionar teste que fixe uma dessas alternativas antes da decisão
normativa.

## 23. Design Deviation Audit

| Desvio | Resultado |
|---|---|
| `PipelineId` local como identidade canônica | `UNRESOLVED_UPSTREAM_AUTHORITY`, não detalhe local |
| `rehydrate` com estágio/revisão sem proveniência | `UNRESOLVED_UPSTREAM_AUTHORITY`, não corrigível por shape validation |
| Correções locais da remediação de derivação, input e replay | Preservadas; não são blockers atuais |

## 24. Structural Self-Check Verification

O self-check da remediação corretamente marcou identidade e reidratação como
parciais/bloqueadas. A alegação de conformance local não pode ser elevada a
pass enquanto os contratos upstream não forem definidos.

## 25. Findings

### IMA-CRITICAL-001 — Identidade canônica do WorkflowPipeline não está definida

**Normative authority:** `ADR-0001` e `SPEC-DOM-001` exigem identidade DOM
persistente, estável, escopo, revisão/lineage e resolução histórica; a SPEC
lista `StageId`, mas não define `WorkflowPipeline` nem seu binding.

**Already decided:** DOM é owner; identidade deve ser canônica; labels não
substituem IDs; comandos preservam aggregate identity, revision e correlation;
`WorkflowPipeline` é o aggregate root do design.

**Not decided:** se a identidade é `CanonicalIdentityReference`; qual `kind`
autoritativo; qual `scope`; quais dados compõem a correlação estável; se
`PipelineId` desaparece, permanece apenas como VO local ou é vinculado/derivado;
qual chave persistir; qual identidade o command recebe; qual chave o repository
usa; e como rehydration resolve/valida a identidade.

**Owner:** `SPEC-DOM-001` para materializar o binding do aggregate sob
`DOM-ID-001`. `ADR-0001` só precisa ser alterada se a escolha criar/alterar uma
categoria ou semântica fundacional não contida em sua decisão aceita. Gap Matrix,
Plan e Design são downstream dessa decisão.

**Minimum upstream level:** SPEC. O Implementation Design não pode escolher
entre `StageId`, um novo kind de pipeline ou outra referência sem mudar a
autoridade pública.

**Impact:** public aggregate/command contracts, persistence key and lookup,
repository port, identity resolution during rehydration, correlation and tests.
Application Service, mapper e repository não podem assumir essa invariância.

### IMA-MAJOR-002 — Reidratação posterior não tem evidência de progressão legítima

**Normative authority:** `ADR-0002`, `DOM-PIPE-001` e `DOM-STATE-001` exigem
ordem, máquinas separadas e ausência de transições fabricadas; `ADR-0006` e
`SPEC-PLAT-001` exigem histórico/recovery seguro, mas não definem a prova
causal específica do pipeline.

**Already decided:** avanço normal é sucessor imediato; criação e reidratação
são caminhos distintos; aggregate é owner da semântica; PLAT é owner do
armazenamento/replay físico; CAS protege stale; revision não pode ser usada como
fórmula de estágio sem decisão explícita.

**Not decided:** qual evidência basta — predecessor, provenance da transição,
progression token, sequence/revision causal, histórico append-only ou combinação
dessas formas; quais campos são obrigatórios; como provar completude, ordem,
imutabilidade e correspondência entre evidência, identidade e estágio; e a
divisão exata entre validação semântica do aggregate e integridade do adapter.

**Owner:** `SPEC-DOM-001` para o invariante de progressão/reidratação. O contrato
físico e replay de `SPEC-PLAT-001` deve ser sincronizado depois; `ADR-0006`
permanece autoridade se a decisão alterar sua semântica de journal/checkpoint.

**Minimum upstream level:** SPEC-DOM-001 para a regra semântica. Um modelo que
altere a decisão aceita de persistência/recovery exigirá também ADR/PLAT
correspondente, mas isso não pode ser decidido antecipadamente.

**Impact:** rehydration input and public constructor boundary, serialized
record/journal contract, repository/adapter responsibilities, aggregate
invariants, command/reconciliation behavior and negative/positive tests.
Não se resolve rejeitando todo estágio posterior nem derivando estágio apenas
de `revision`.

## 26. Metrics

```text
BLOCKERS_REVIEWED = 2
BLOCKERS_RESOLVABLE_IN_IMPLEMENTATION_DESIGN_ONLY = 0
UPSTREAM_AUTHORITY_GAPS = 2
CRITICAL = 1
MAJOR = 1
MINOR = 0
INFO = 0
DOMAIN_INVARIANT_BYPASSES_ACCEPTED = 0
UNJUSTIFIED_ABSTRACTIONS_REQUIRED = 0
```

## 27. Re-audit Reconciliation

`IMA-MAJOR-001`, `IMA-MINOR-001` e `IMA-INFO-001` foram tratados pela
remediação local conforme seu relatório. `IMA-CRITICAL-001` e
`IMA-MAJOR-002` permanecem bloqueados, não por defeito de implementação
decidível localmente, mas por ausência de contrato normativo suficiente.

## 28. Specialist Completeness Proof

Foram examinados o ticket, design, remediation, canonical implementation audit,
ADR-0001, ADR-0002, ADR-0006, SPEC-DOM-001, SPEC-PLAT-001, Gap Matrix,
Implementation Plan e a implementação apenas como evidência. Para ambos os
blockers foram separados authority existente, decisões ausentes, owner,
menor nível upstream, impacto e limites DDD/SOLID/dependency direction.

## 29. Required Upstream Closure

`ROOT_CAUSE_STAGE: SPECIFICATION_NORMATIVE_CONTRACT`

`MINIMUM_ARTIFACT_TO_CHANGE: docs/specs/SPEC-DOM-001-workflow-authority-and-governance.md`

Decisões humanas necessárias:

1. declarar a identidade canônica de `WorkflowPipeline`, referência/kind/scope,
   correlação estável, chave persistida, command identity, repository identity
   e regra de rehydration dessa identidade;
2. declarar a evidência mínima e suficiente de progressão persistida para
   estágios posteriores, seus invariantes e a divisão DOM versus PLAT.

Depois disso, regenerar ou remediar e auditar novamente a Gap Matrix e o
Implementation Plan; revalidar o Implementation Design, o ticket, os contratos
de command/repository e os testes; sincronizar `SPEC-PLAT-001`/ADR-0006 se a
decisão afetar persistência ou recovery.

O Implementation Design não pode tomar essas decisões porque elas definem
identidade pública, autoridade de aggregate, chave de persistência, prova de
histórico e fronteira DOM/PLAT — precisamente as premissas que o design deveria
receber, e não criar.
