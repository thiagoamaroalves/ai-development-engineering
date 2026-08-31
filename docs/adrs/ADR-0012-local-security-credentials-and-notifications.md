---
schema_version: "1.0.0"
id: ADR-0012
title: Local Security, Credentials, and Notifications
decision_status: ACCEPTED
implementation_status: UNPROCESSED
revision: 3
date: 2026-08-28
decision_scope: security
supersedes: []
superseded_by: null
related: [ADR-0008, ADR-0011, ADR-0013]
---

# ADR-0012 — Segurança local, credenciais e notificações

## Contexto

Mesmo local, a API controla Git, Codex e publicação. Ela não deve ficar aberta à rede ou aceitar comandos de qualquer processo sem proteção.

## Decisão

A API escutará somente em `localhost` e exigirá token local efêmero por sessão. O produto é de usuário único na primeira versão; não haverá contas ou papéis multiusuário.

GitHub reutilizará autenticação existente do `gh` CLI; credenciais não serão copiadas ao banco. Configuração sensível de e-mail será protegida localmente e separada dos repositórios.

Notificações aparecem na interface. E-mail será enviado apenas para eventos que exigem intervenção: limite de rodadas, tentativas esgotadas, bloqueios, divergências, aprovação de publicação ou violações de governança. Envio deve ser idempotente e auditável.

Intervenções registram horário, comando, alvo, estado anterior/posterior e justificativa quando aplicável.

## Consequências

O frontend precisará obter/renovar o token por mecanismo local protegido. Logs devem redigir segredos. O modelo poderá evoluir para equipe sem conceder autoridade implícita hoje.

## Alternativas rejeitadas

- API local sem autenticação.
- Exposição padrão à rede local.
- Armazenar token do GitHub no banco quando `gh` já fornece sessão.
