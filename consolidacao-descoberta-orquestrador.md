# Consolidação da descoberta — Orquestrador simples de tarefas

**Data:** 2026-08-28  
**Status:** Descoberta funcional consolidada; lacunas prioritárias fechadas; pronta para geração das ADRs  
**Objetivo:** Orquestrar, com Codex CLI, o fluxo completo de engenharia derivado de ADRs, com execução autônoma, auditoria/remediação iterativa, rastreabilidade e intervenção humana apenas nos pontos definidos.

## 1. Visão do produto

O produto será um orquestrador local, de usuário único, capaz de administrar vários repositórios independentes. O operador inicia manualmente um processamento com a intenção **“processe todas as ADRs novas”**, acompanha toda a execução por uma interface web local e intervém somente diante de aprovações, limites, falhas ou inconsistências que exijam decisão humana.

O backend será um serviço autônomo em C#/.NET, iniciado manualmente no Windows nativo. Ele exporá API e eventos em tempo real; o frontend será apenas um cliente. O Codex será acionado por meio do Codex CLI executado como processo local.

## 2. Estratégia de desenvolvimento

1. Concluir a descoberta e fechar as lacunas restantes.
2. Gerar ADRs separadas por responsabilidade arquitetural.
3. Criar e validar o protótipo com base nas ADRs.
4. Implementar e concluir o backend.
5. Implementar o frontend sobre os contratos estabilizados do backend.

## 3. Entrada, elegibilidade e imutabilidade das ADRs

- O processamento é iniciado somente por comando manual.
- Antes de iniciar, o orquestrador apresenta uma prévia com ADRs elegíveis, configurações, commit-base, capacidade e versões das skills; a execução depende de confirmação explícita.
- O orquestrador mantém registro persistente próprio para cada ADR.
- Somente ADRs com status formal `ACCEPTED` são elegíveis.
- O conjunto de ADRs é fechado no início da execução. ADRs aceitas posteriormente aguardam novo comando.
- Uma ADR implementada é imutável.
- Um detalhamento posterior exige uma nova ADR vinculada à original.
- Uma mudança de decisão exige nova ADR que supera a anterior.
- A ADR superada permanece preservada com status `SUPERSEDED`, referenciando sua sucessora; a sucessora registra a relação inversa.
- Alteração física em ADR já implementada é violação de governança: bloqueia o processamento e exige intervenção.
- Metadados de ADRs e demais artefatos Markdown serão padronizados em front matter YAML.

## 4. Pipeline end-to-end

O pipeline canônico será:

1. descobrir ADRs `ACCEPTED` ainda sem cobertura;
2. gerar ou atualizar SPECs;
3. auditar/remediar SPECs até aprovação;
4. gerar Gap Matrix;
5. auditar/remediar Gap Matrix até aprovação;
6. gerar Plano de Implementação;
7. auditar/remediar o plano até aprovação;
8. decompor em tickets;
9. auditar/remediar os tickets até aprovação;
10. consolidar e commitar a documentação da SPEC;
11. implementar tickets por ondas determinadas pelo DAG;
12. auditar/remediar cada implementação;
13. integrar e auditar cada onda;
14. finalizar tickets e recalcular o DAG;
15. executar `Spec Implementation Conformance` após todos os tickets;
16. auditar/remediar a conformidade até aprovação;
17. atualizar a branch da SPEC com a principal e repetir a conformidade;
18. solicitar aprovação para publicação;
19. integrar/publicar serialmente;
20. confirmar integração remota e limpar recursos temporários.

## 5. Geração e independência das SPECs

- Uma skill existente recebe o conjunto completo de ADRs aceitas ainda sem SPEC/cobertura.
- A skill decide autonomamente quantas SPECs criar e o mapeamento ADR ↔ SPEC.
- O relacionamento pode ser muitos-para-muitos.
- O contrato de saída deve informar ADRs analisadas, SPECs criadas/atualizadas, rastreabilidade, justificativa de agrupamento e eventuais ADRs não cobertas.
- ADR elegível sem cobertura e sem justificativa válida impede a conclusão da etapa.
- Após a geração, cada SPEC torna-se uma unidade independente e avança em paralelo sempre que houver capacidade e não houver dependência explícita.
- Uma SPEC não espera outras SPECs da mesma execução para avançar.

## 6. Auditoria, remediação e critérios de conclusão

- Cada etapa auditável termina somente com veredito formal emitido pela skill de auditoria.
- Ausência aparente de findings ou término da sessão não representa aprovação.
- A remediação nunca aprova o próprio trabalho; sempre retorna à auditoria.
- Resultados mínimos esperados incluem aprovado, remediação requerida, bloqueado e falha operacional.
- Cada atividade de skill usa uma sessão nova e isolada do Codex.
- Em uma mesma unidade auditável, cada nova execução de auditoria ou remediação deve usar um agente que ainda não tenha atuado nela.
- Se não houver agente inédito elegível, a unidade aguarda até que um novo agente possa ser criado/alocado.
- O limite inicial é de 10 rodadas por artefato.
- Uma rodada corresponde a auditoria com remediação requerida, remediação e nova auditoria.
- Após 10 rodadas sem aprovação, somente a unidade afetada é pausada e solicita decisão humana.
- Rodadas adicionais podem ser autorizadas pela interface sem apagar o histórico.

## 7. Spec Implementation Conformance

- A conformidade começa somente depois que todos os tickets da SPEC estiverem formalmente concluídos.
- Ela verifica aderência integral à SPEC, cobertura completa, integração conjunta, regressões, testes, evidências, omissões e extrapolações de autoridade.
- Findings de implementação são remediados diretamente por um agente e retornam à auditoria final; não geram tickets automaticamente.
- O agente remediador não pode auditar o próprio trabalho.
- Se um finding exigir mudança normativa na SPEC ou em documento anterior, o fluxo volta à primeira etapa documental afetada e repete todo o downstream necessário.
- Aprovações posteriores ao ponto de retorno tornam-se obsoletas, mas permanecem no histórico.
- Tickets `COMPLETED` não são reabertos; novos tickets de ajuste ou substituição são criados e vinculados aos anteriores.
- A SPEC revisada mantém o mesmo arquivo e identificador, incrementa sua revisão e preserva o histórico Git.
- Após aprovação final, todas as remediações de conformidade são consolidadas em um único commit da SPEC.

## 8. Tickets, DAG e ondas

- Todos os repositórios usam uma máquina de estados funcional única.
- Estados funcionais: `DRAFT`, `READY`, `IMPLEMENTED`, `COMPLETED`, `BLOCKED` e `CANCELLED`.
- `CANCELLED` é terminal; retomada exige novo ticket referenciando o cancelado.
- Estados operacionais transitórios — fila, execução, auditoria, pausa, tentativa e agente — ficam no banco, não no Git.
- No commit documental, tickets sem dependências ficam `READY`; tickets com dependências pendentes ficam `BLOCKED`.
- O orquestrador executa em paralelo todos os tickets `READY`, respeitando o DAG e a capacidade.
- Dependências inválidas e ciclos bloqueiam o avanço.
- Cada ticket é implementado em branch e worktree próprias.
- Potencial sobreposição de arquivos não impede o paralelismo; conflitos são tratados na integração.
- Tickets aprovados aguardam todos os tickets da mesma onda atingirem estado adequado para integração.
- A onda é integrada na branch da SPEC como unidade.
- Conflitos são resolvidos por agente exclusivo e o resultado integrado é auditado por outro agente.
- A próxima onda parte somente da base integrada e aprovada.
- A skill de finalização roda após a onda estar integrada e auditada.
- Ela finaliza tickets, recalcula o DAG e libera dependentes.
- Cada ticket finalizado gera um commit próprio.
- Quando a finalização remove o último bloqueio, as mudanças dos dependentes para `READY` entram no mesmo commit daquele ticket.

## 9. Branches, integração e publicação

- Cada SPEC possui branch de integração própria.
- Branches/worktrees dos tickets convergem para a branch da SPEC por ondas.
- A branch principal recebe a SPEC somente após conformidade final aprovada.
- Antes do merge final, a branch da SPEC é atualizada com a principal mais recente, conflitos são resolvidos e a conformidade é repetida.
- O veredito válido corresponde exatamente ao commit candidato.
- Merges finais de SPECs são serializados em uma fila exclusiva.
- Se a principal mudar antes da integração, a próxima SPEC é novamente atualizada e revalidada.
- Publicação exige confirmação humana prévia.
- A interface permite aprovação individual ou em lote; o processamento interno do lote continua serial.
- A estratégia de publicação é configurável por repositório: push direto ou Pull Request.
- Na estratégia de PR, a SPEC só termina quando a PR é efetivamente merged.
- A primeira versão integra somente GitHub e reutiliza a autenticação existente do `gh` CLI.
- Worktrees e branches são removidas automaticamente somente após integração remota confirmada.
- Em pausa, bloqueio ou falha, são preservadas.

## 10. Política de commits

- Um commit pertence a exatamente uma SPEC; nunca contém alterações de duas SPECs.
- ADRs chegam aceitas e commitadas.
- SPEC, Gap Matrix, Plano de Implementação e tickets são auditados/remediados; quando todo o conjunto documental da SPEC estiver pronto, é criado um commit documental daquela SPEC.
- A implementação do ticket é commitada após aprovação formal individual.
- A finalização do ticket e atualização do DAG geram commits posteriores, um por ticket finalizado.
- Remediações finais aprovadas na conformidade são consolidadas em um commit final da SPEC.
- Antes de existir commit, a auditoria registra hash da árvore/conteúdo avaliado.
- Arquivos compartilhados podem ser alterados por SPECs diferentes em commits separados; conflitos são resolvidos na integração serial.
- Relatórios de auditoria, findings, logs e evidências intermediárias não entram no Git.

## 11. Estado dos tickets e reconciliação

- O estado funcional é mantido no Git e no banco como fontes equivalentes e reconciliadas.
- Cada transição correlaciona estado, commit e evento operacional.
- Divergência entre Git e banco bloqueia o ticket e exige decisão humana.
- O orquestrador nunca escolhe silenciosamente qual lado prevalece.

## 12. Capacidade, escalonamento e execuções concorrentes

- A capacidade de agentes é detectada dinamicamente e nunca é ultrapassada.
- Sem vaga, a atividade fica em fila; o orquestrador não executa no lugar do agente.
- Múltiplas execuções independentes podem coexistir e compartilhar o pool global.
- Cada execução possui snapshots, estado e histórico próprios.
- O escalonador usa prioridade configurável com distribuição justa, evitando inanição.
- A interface permite alterar prioridade.
- Estados de espera distinguem falta de capacidade de falta de agente elegível.

## 13. Skills e contratos estruturados

- Skills existentes serão atualizadas para emitir contratos estruturados nativos.
- Não haverá dependência de interpretação livre de resposta textual.
- Cada skill declara entradas, saídas, artefatos, vereditos, checkpoints, idempotência, retomada e versão do contrato.
- Cada skill declara checkpoints seguros em contrato estruturado.
- Um registro explícito e versionado mapeia etapas para skills.
- No início da execução, todas as versões de skills e contratos são fixadas e permanecem imutáveis até o fim.
- Cada atividade recebe manifesto completo e imutável preparado pelo orquestrador.
- O manifesto contém caminhos, hashes, commits, artefatos, autoridade, dependências, findings, rodada, tentativa, contrato esperado e diretório de trabalho.

## 14. Falhas, pausa, cancelamento e retomada

- Falhas operacionais transitórias recebem até 10 tentativas automáticas, configuráveis.
- Tentativas operacionais não contam como rodadas funcionais.
- Ao esgotar tentativas, somente a atividade afetada é pausada.
- Pausa e cancelamento são cooperativos no próximo checkpoint seguro.
- Não há interrupção forçada automática.
- `PAUSE_REQUESTED` e `CANCEL_REQUESTED` permanecem até confirmação do checkpoint.
- Após reinício, o orquestrador reconstrói o estado, reconcilia Git/agentes/processos e retoma automaticamente do checkpoint seguro.
- Evidências reais prevalecem sobre simples status persistido na reconstrução.
- Ao encerrar o backend, ele solicita checkpoint cooperativo, persiste, reconcilia e só encerra quando seguro.

## 15. Repositórios e configuração

- Uma instância administra vários repositórios independentes.
- Uma execução pertence a exatamente um repositório.
- Cada repositório possui configuração explícita e versionada para caminhos, convenções, branch principal, validações e estratégia de publicação.
- Essa configuração é congelada no snapshot da execução.
- Antes de iniciar, o repositório deve estar limpo.
- Alterações locais bloqueiam a execução; o orquestrador não faz stash, commit ou descarte automático.
- O orquestrador faz `fetch` e exige alinhamento exato entre a branch principal local e a remota.
- Builds, testes, lint e verificações obrigatórias são declarados na configuração versionada.

## 16. Migração de repositórios legados

- Artefatos Markdown usam front matter YAML padronizado.
- Repositórios legados precisam de migração explícita e auditada antes de serem habilitados.
- Uma skill dedicada executa a migração.
- Outra skill audita.
- Findings são tratados por skill de remediação da migração e nova auditoria, até aprovação formal.
- Aplicam-se agentes distintos, checkpoints e limite de 10 rodadas.

## 17. Persistência, retenção e exportação

- O estado operacional fica em banco local.
- Haverá backups automáticos e exportação.
- Logs, eventos, artefatos intermediários e execuções são mantidos indefinidamente até exclusão manual.
- Exclusão mostra impacto, exige confirmação e mantém registro mínimo auditável.
- Relatórios operacionais ficam fora do Git e mantêm hashes que os relacionam ao conteúdo e commit avaliados.

## 18. Backend, API e segurança local

- Backend em C#/.NET.
- Execução em Windows nativo.
- Aplicação iniciada manualmente.
- Serviço autônomo com API e eventos em tempo real.
- A API escuta somente em `localhost`.
- O acesso exige token local efêmero por sessão.
- Codex CLI é executado como processo local.
- Cada atividade de skill cria sessão Codex nova e isolada.
- O consumo de Codex é medido e exibido, sem limites automáticos.
- O desenho considera escala pequena inicialmente, mas não contém limites rígidos de domínio.

## 19. Interface e notificações

### Acompanhamento

- ADRs, SPECs, execuções, etapas, ondas e tickets;
- estado e atividade atuais;
- agente, skill, rodada e tentativa;
- duração atual e histórico de tempos;
- tempo ativo, total e em filas;
- progresso, DAG e bloqueios;
- capacidade ocupada/disponível;
- branches, worktrees e commits;
- logs, findings, vereditos e artefatos para inspeção/download;
- histórico completo de transições;
- métricas de consumo do Codex.

### Intervenção

- pausar e retomar SPEC ou atividade;
- repetir atividade falha;
- cancelar processamento ainda não integrado;
- alterar prioridade;
- autorizar rodadas adicionais;
- aprovar publicação individualmente ou em lote;
- resolver divergências Git/banco;
- inspecionar e exportar evidências.

### Notificações

- Alertas na interface.
- E-mail somente quando a intervenção humana for necessária.
- Credenciais de e-mail são protegidas localmente e separadas dos repositórios.

## 20. Invariantes centrais

1. Nenhuma ADR implementada pode ser alterada.
2. Nenhum artefato auditável avança sem veredito formal.
3. Remediador não aprova o próprio trabalho.
4. Cada nova atividade auditável usa sessão/agente inédito naquela unidade.
5. Nenhuma atividade inicia sem capacidade de agente.
6. Nenhum commit mistura SPECs.
7. Nenhuma SPEC entra na principal sem conformidade contra a principal atual.
8. Nenhum merge final ocorre em paralelo.
9. Nenhum push/PR final ocorre sem aprovação humana.
10. Nenhuma divergência Git/banco é resolvida silenciosamente.
11. Nenhuma limpeza de branch/worktree ocorre antes da integração remota confirmada.
12. Nenhuma execução muda suas versões de skills/configuração depois do snapshot.

## 21. Lacunas que precisam ser fechadas antes das ADRs

### Prioridade A — bloqueiam contratos e arquitetura do backend

1. **Identidade formal das unidades auditáveis:** definir se a proibição de reutilizar agente vale por artefato, revisão, etapa ou ciclo completo da SPEC.
2. **Modelo de identidade de agentes:** determinar como uma sessão nova do Codex se transforma em identidade verificável e como provar que é inédita.
3. **Esquema dos contratos das skills:** formato, versionamento, envelopes, vereditos comuns, erros, checkpoints, artefatos e compatibilidade.
4. **Máquina de estados completa:** separar e formalizar estados de execução, atividade, SPEC, etapa, onda, ticket, publicação e migração.
5. **Idempotência:** definir chaves e evidências para spawn de sessão, geração de artefato, commit, merge, push, criação de PR, e-mail e limpeza.
6. **Consistência Git/banco:** definir protocolo de gravação, outbox/event log, checkpoints e recuperação de gravações parciais.
7. **Semântica exata de cancelamento:** definir efeito sobre execução, SPEC, onda e ticket; decidir quais cancelamentos produzem `CANCELLED` funcional.
8. **Critério de onda pronta para integração:** a decisão mencionou estados terminais pausado/cancelado, mas é necessário definir se uma onda pode ser integrada com ticket não aprovado.
9. **Estratégia de atualização da branch da SPEC:** merge ou rebase; política de force-push; preservação de commits já auditados.
10. **Publicação por push direto:** definir se o merge local na principal acontece antes ou somente depois da confirmação humana.

### Prioridade B — necessárias para ADRs de infraestrutura e operação

11. **Banco local:** escolher tecnologia, esquema de migrations, transações, backup, restauração e criptografia de dados sensíveis.
12. **Armazenamento de logs/artefatos:** localização, estrutura, integridade, compressão opcional e exportação.
13. **Fila e scheduler:** algoritmo concreto de prioridade justa, reserva de capacidade e reação a mudanças de prioridade.
14. **Eventos em tempo real:** protocolo, ordenação, replay, reconexão e consistência entre snapshot e stream.
15. **Integração com Codex CLI:** comandos suportados, formato estruturado, limites reais de concorrência, captura de eventos e compatibilidade de versões.
16. **Parada cooperativa:** mecanismo real oferecido pelo CLI e fallback quando checkpoint não é alcançado.
17. **GitHub/gh:** permissões, checks exigidos, polling/webhook local, comportamento de PR fechada sem merge e atualização de branch.
18. **E-mail:** provedor/SMTP, armazenamento de configuração, retry, deduplicação e templates.
19. **Token local:** emissão, renovação, entrega ao frontend e proteção contra processos locais não autorizados.
20. **Backup/exportação:** frequência, retenção, formato, restauração testável e escopo dos arquivos externos ao banco.

### Prioridade C — podem ser fechadas no protótipo ou ADRs posteriores

21. Tecnologia do frontend.
22. Navegação, hierarquia visual, filtros e dashboards.
23. Formato exato de visualização do DAG e das timelines.
24. Conteúdo e UX das aprovações em lote.
25. Política de exclusão manual e registro mínimo preservado.
26. Métricas exatas de token quando o Codex CLI não as disponibilizar.
27. Limites práticos e alertas de volume de logs.

## 22. Pontos de tensão que exigem decisão consciente

### 22.1 Fontes equivalentes de estado de ticket

Manter Git e banco como fontes equivalentes exige bloqueio diante de divergência e um protocolo forte de reconciliação. Uma alternativa arquitetural futura seria escolher uma autoridade única e tratar a outra como projeção, mas a decisão atual preserva equivalência.

### 22.2 Agente inédito em todas as rodadas

Como cada atividade já cria uma sessão Codex isolada, é preciso decidir se “agente inédito” significa apenas nova sessão ou também outro perfil/modelo/identidade lógica. Sem essa precisão, a regra não é verificável.

### 22.3 Integração de onda com tickets pausados ou cancelados

Uma onda parcialmente aprovada não deveria liberar dependentes sem semântica explícita. A regra de integração precisa distinguir cancelamento autorizado de falha que torna a onda incompleta.

### 22.4 Commit documental único antes da implementação

SPEC, Gap Matrix, plano e tickets permanecem sem commit durante vários ciclos. O hash da árvore auditada deve ser persistido, e o uso de worktree/branch documental precisa impedir perda de trabalho e drift externo.

### 22.5 Retorno tardio à documentação

Quando a conformidade final força revisão normativa, tickets concluídos permanecem históricos e novos tickets são criados. É necessário definir como a nova revisão da SPEC invalida Gap Matrix, plano e tickets ainda não executados e como recalcula o DAG.

## 23. Agrupamento recomendado de ADRs

As decisões podem ser convertidas em uma família coesa de ADRs:

1. **Modelo de domínio e identidade do workflow**
2. **Pipeline, estados e regras de transição**
3. **Contratos versionados de skills e manifestos de execução**
4. **Agentes, sessões Codex e segregação de papéis**
5. **Scheduler, capacidade, prioridades e concorrência**
6. **Persistência, event log, reconciliação e recuperação**
7. **Git, worktrees, commits, ondas e integração de SPECs**
8. **GitHub, publicação e aprovação humana**
9. **Auditoria, remediação e conformidade final**
10. **Configuração e migração de repositórios**
11. **Backend local .NET, API e eventos em tempo real**
12. **Segurança local, credenciais e notificações**
13. **Observabilidade, retenção, backup e exportação**
14. **Contrato de frontend e experiência operacional**

## 24. Critério para iniciar a geração das ADRs

As dez lacunas da Prioridade A foram respondidas na continuação do interrogatório. As ADRs já podem ser iniciadas. As lacunas de Prioridade B podem ser decididas durante a elaboração das ADRs técnicas, desde que sejam explicitadas como decisões e não assumidas silenciosamente. As de Prioridade C podem ser refinadas durante o protótipo.

## 25. Resolução das dez lacunas prioritárias

### 25.1 Escopo da regra de agente inédito

Um agente não pode atuar novamente no mesmo ciclo do mesmo artefato, incluindo revisões produzidas naquele ciclo. Ele permanece elegível para outros artefatos e outras SPECs. Se a conformidade devolver o artefato a uma etapa anterior dentro da mesma execução, o ciclo continua e a inelegibilidade é preservada.

### 25.2 Identidade verificável de agentes

Cada atividade recebe um `AgentAssignmentId` novo e uma nova sessão isolada do Codex CLI. A identidade é vinculada ao manifesto, papel, skill, artefato, rodada, processo e identificador nativo de sessão, quando disponível. Não é necessário trocar modelo ou persona.

### 25.3 Contratos estruturados das skills

As skills emitem JSON validado por JSON Schema, com envelope comum e payload específico. Os contratos usam versionamento semântico e suporte explícito pelo backend. Cada execução fixa versões exatas. Saída inválida é falha de contrato e nunca pode ser interpretada como aprovação.

### 25.4 Máquinas de estados

O domínio utiliza máquinas de estados separadas por agregado, coordenadas por eventos. Transições inválidas são rejeitadas e registradas. Estados superiores são derivados dos inferiores sempre que possível.

### 25.5 Idempotência

Cada efeito externo possui chave idempotente determinística. Todas as tentativas da mesma intenção reutilizam a chave e reconciliam evidências antes de repetir. Evidência compatível confirma o efeito; evidência divergente bloqueia a operação.

### 25.6 Consistência entre banco, Git e serviços externos

A coordenação utiliza journal/outbox, efeitos idempotentes e reconciliação por evidência. A intenção é persistida antes do efeito; a confirmação é registrada depois. Falhas intermediárias convergem por reconciliação, sem pressupor transação distribuída.

### 25.7 Cancelamento

O cancelamento é operacional, cooperativo e em cascata. Atividades deixam de receber novas tentativas; SPECs e execuções impedem novos despachos. Estados funcionais, commits e evidências são preservados. Tickets somente recebem `CANCELLED` por transição funcional explícita. Nada integrado remotamente é revertido automaticamente.

### 25.8 Integração de ondas

Uma onda somente é integrada quando todos os seus tickets estiverem formalmente aprovados. Ticket pausado, bloqueado, falho ou ainda em auditoria impede a integração. Cancelamento funcional exige revisão e auditoria da documentação e do DAG antes do recálculo da onda.

### 25.9 Atualização da branch da SPEC

A branch principal é incorporada à branch da SPEC por merge. Commits e hashes auditados são preservados. Não há rebase ou force-push automático. Conflitos são resolvidos em commit pertencente à SPEC e o resultado integrado retorna à conformidade.

### 25.10 Aprovação, merge local e push

O candidato aprovado permanece na branch da SPEC enquanto aguarda autorização. Após aprovação, o orquestrador adquire a fila exclusiva, faz `fetch`, confirma que a principal não mudou, realiza o merge local e executa o push como uma operação controlada. Se a principal mudou, a SPEC retorna à atualização e conformidade. Falha de push preserva o merge local para reconciliação idempotente. No modo PR, a aprovação autoriza criar/atualizar a PR e a conclusão depende do merge remoto.
