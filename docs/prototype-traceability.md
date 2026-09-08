# Matriz de rastreabilidade — ADR → protótipo

| ADR | Requisito operacional demonstrado | Tela principal | Cenários / evidência |
|---|---|---|---|
| ADR-0001 | Identidade persistente, snapshot imutável, ADR elegível, separação decisória/realização, imutabilidade | Nova execução; detalhe da SPEC | `normal`, `adr-mutation`; snapshot com IDs, hashes e revisão 3 |
| ADR-0002 | Pipeline canônico, máquinas separadas, transições válidas, vocabulário de publicação, pausa/cancelamento cooperativos | Execuções; DAG; Publicação | `normal`, `conflict`, `PR`; estados funcionais e operacionais distintos |
| ADR-0003 | Manifesto imutável, envelope JSON, versão semântica, skill/contrato fixados, checkpoints | Nova execução; Atividade e agente; Artefatos | `normal`, `retry`; painel de manifesto e resultado estruturado |
| ADR-0004 | Sessão isolada, `AgentAssignmentId`, `ArtifactCycleId`, segregação e elegibilidade | Atividade e agente; Intervenções | `audit`, `rounds`, `capacity`; agente auditor diferente do remediador |
| ADR-0005 | Capacidade dinâmica, leases, filas por motivo, prioridade justa, SPECs independentes, DAG paralelo | Visão geral; Execuções; DAG | `capacity`, `normal`, `conflict`; pool, fila e ondas simultâneas |
| ADR-0006 | Journal/outbox, chave idempotente, reconciliação, divergência Git/banco, retry até 10, recovery | Intervenções; Atividade e agente; Artefatos | `retry`, `divergence`, `recovery`; quatro resultados de reconciliação |
| ADR-0007 | Branch/worktree por SPEC/ticket, ondas, integração auditada, hashes de árvore, limpeza só após remoto | DAG; Detalhe da SPEC; Publicação | `conflict`, `normal`; branches, worktrees, commits e integração |
| ADR-0008 | Aprovação humana individual/lote, fila serial, SHA base/head, push ou PR, invalidação por drift | Publicação | `drift`, `PR`, `normal`; approval invalidated e `REMOTE_PUBLICATION_CONFIRMED` |
| ADR-0009 | Ciclos de auditoria/remediação, limite de 10 rodadas, conformance final e retorno downstream | Intervenções; Detalhe da SPEC; Artefatos | `audit`, `rounds`, `normal`; findings, rodada 10 e veredito |
| ADR-0010 | Configuração versionada, validação Git/gh/branch, repositório limpo, migração e onboarding | Repositórios | `migration`, `divergence`; lifecycle `DISCOVERED → ENABLED` |
| ADR-0011 | Backend local desacoplado, snapshots/eventos, processos/sessões, checkpoints | Visão geral; Atividade e agente | Todos; chip “simulação local”, event stream e comando correlacionado |
| ADR-0012 | localhost/token efêmero, gh existente, alertas de intervenção, comando auditável | Intervenções; barra superior | `capacity`, `rounds`, `drift`; alerta com alvo e justificativa |
| ADR-0013 | Duração ativa/fila, consumo, retenção, backup, exportação e correlação | Visão geral; Artefatos | `normal`, `recovery`; métricas e download/exportação simulados |
| ADR-0014 | Cliente sem autoridade, snapshots/comandos/eventos, controles operacionais, publicação normativa | Todas as telas | Todos; requested/accepted/confirmed e acessibilidade |

## Cobertura por tela

| Tela | Cobertura |
|---|---|
| Visão geral | estado agregado, intervenções, capacidade, duração, consumo e publicações |
| Repositórios | cadastro, validação, clean/dirty, alinhamento, onboarding e migração |
| Nova execução | ADRs ACCEPTED/UNPROCESSED, hash, revisão, base, skills, config, capacidade e confirmação |
| Execuções / detalhe | pipeline, SPECs independentes, etapas, progresso, timeline e comandos |
| DAG e ondas | dependências, estados funcionais, ondas, paralelismo e integração |
| Atividade e agente | IDs, sessão, skill, manifesto, tentativa, rodada, duração, checkpoint e saída |
| Intervenções | limites, capacidade, divergência, conflito, mutação de ADR e approvals |
| Publicação | push direto, PR, SHAs, diff, checks, aprovação individual/lote e drift |
| Artefatos e auditoria | manifestos, resultados, findings, relatórios, logs, evidências, transições e exportação |
