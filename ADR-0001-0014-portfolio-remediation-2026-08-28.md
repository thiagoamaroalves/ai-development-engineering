---
id: ADR-PORTFOLIO-REMEDIATION-2026-08-28
title: ADR-0001–ADR-0014 Portfolio Remediation
status: APPROVED
date: 2026-08-28
audit_source: ADR-PORTFOLIO-AUDIT-2026-08-28
result: ADR_PORTFOLIO_APPROVED
approved_by: HUMAN_USER
approved_at: 2026-08-31
---

# Remediação do portfólio ADR-0001–ADR-0014

## 1. Resultado

`ADR_PORTFOLIO_REMEDIATION_COMPLETE`

`ADR_PORTFOLIO_APPROVED`

Os dez findings do relatório `ADR-PORTFOLIO-AUDIT-2026-08-28` foram remediados e a remediação foi aprovada pelo usuário em 2026-08-31.

## 2. Arquivos alterados

- `README.md`;
- `ADR-0001` a `ADR-0014`.

O relatório de auditoria original não foi modificado.

## 3. Findings remediados

| Finding | Resultado | ADRs principais |
|---|---|---|
| ASC-CRITICAL-001 | `REMEDIATED` | ADR-0008, ADR-0009 |
| ASC-CRITICAL-002 | `REMEDIATED` | ADR-0003, ADR-0010, ADR-0011 |
| ASC-MAJOR-001 | `REMEDIATED` | README, ADR-0001 |
| ASC-MAJOR-002 | `REMEDIATED` | ADR-0001–ADR-0014 |
| ASC-MAJOR-003 | `REMEDIATED` | ADR-0002 |
| ASC-MAJOR-004 | `REMEDIATED` | ADR-0004 |
| ASC-MAJOR-005 | `REMEDIATED` | ADR-0005 |
| ASC-MAJOR-006 | `REMEDIATED` | ADR-0006 |
| ASC-MAJOR-007 | `REMEDIATED` | ADR-0007 |
| ASC-MINOR-001 | `REMEDIATED` | ADR-0002, ADR-0014 |

## 4. Mudanças realizadas

### 4.1 Lifecycle e schema das ADRs

- Separados `status` decisório e `implementation_status`.
- Permitida remediação de ADR `ACCEPTED` ainda não implementada.
- Mantida imutabilidade depois de `IMPLEMENTED`.
- Aplicado schema uniforme `1.0.0` às 14 ADRs.
- Adicionados `revision: 2`, `supersedes`, `superseded_by` e listas de relações uniformes.

### 4.2 Pull Request e conformidade

- PR permanece dentro da fila serial.
- Base SHA, head SHA, mergeability, checks e árvore candidata são vinculados ao veredito.
- Mudança de base, merge externo ou árvore divergente invalidam a conformidade.
- Conclusão exige `PR_MERGED` e `REMOTE_PUBLICATION_CONFIRMED`.

### 4.3 Bootstrap de repositórios legados

- Criado catálogo de skills de onboarding pertencente ao sistema.
- Criada configuração candidata e workspace de migração isolados.
- Definido lifecycle anterior à habilitação.
- Promoção para `ENABLED` ocorre somente após auditoria formal.

### 4.4 Tickets, agentes e capacidade

- Definida tabela normativa de transições funcionais dos tickets.
- Criado `ArtifactCycleId` com início, preservação e encerramento formais.
- Criada abstração `AgentCapacityProvider`.
- Capacidade desconhecida usa teto conservador e leases persistidos.

### 4.5 Recuperação e proteção documental

- Reconciliação separa efeito incompleto esperado, efeito ausente, divergência semântica e efeito conflitante.
- Casos reparáveis convergem automaticamente; conflitos reais bloqueiam.
- Criado `DocumentCandidateTreeHash`, revalidado imediatamente antes do commit.
- Drift invalida a aprovação e retorna o artefato à auditoria.

### 4.6 Terminologia

- Padronizados candidato, espera por aprovação, integração local, estados de PR e confirmação remota.
- “Concluído” só é usado após confirmação remota.

## 5. Validações executadas

- 14 ADRs encontradas com IDs contínuos `ADR-0001`–`ADR-0014`.
- Front matter YAML válido em todas.
- Campos obrigatórios presentes em todas.
- `schema_version: 1.0.0` uniforme.
- `status: ACCEPTED` uniforme.
- `implementation_status: UNPROCESSED` uniforme.
- `revision: 2` uniforme.
- Presença dos contratos remediados confirmada por busca mecânica.

## 6. Baseline remediado

| ADR | SHA-256 |
|---|---|
| ADR-0001 | `8a12369f2129c7690a2985a2892c4349d2f5f18915ba97be6ffef02ee9853caf` |
| ADR-0002 | `b690aa90aa60e66321accb08d743314ed69b933c00883a1ed6d1c60b50e0c2ad` |
| ADR-0003 | `7cd9b1329422761c0601f3d32f0af81e52b52fd22add6a9e0bffea08e958291f` |
| ADR-0004 | `2ec24c63bbc51d40e12bc59f30b0af8b57467ef3e463c3c609a3642534006bc8` |
| ADR-0005 | `f41de458231d148666664dd2a68de6545747eaa76f1e4726b95535d2a5bd8d68` |
| ADR-0006 | `e82b22500fd8966d6bc1535f53d74b1fd11b72af09af83ebd8b783835edf9a12` |
| ADR-0007 | `fa1d756904177b9f65ab1d7bfc1d5d9778520adacf15f676a94b8ca322e9ce19` |
| ADR-0008 | `a2c5fb287f8197b643d5f7ebaaf2aa712f6214c9db8d0bf22e659f4f93e33901` |
| ADR-0009 | `fe887874639865e9952f7dd4318f7cef9f7ff4583c341b285cf6316f384d48d1` |
| ADR-0010 | `33846dd812157d50a0d6e11407a3e2e0c7101bc24114834c34b008457c7179ec` |
| ADR-0011 | `79d32df40e1090ce2a893934380419a8a2900edcf637fa0e33bf6f76314f977d` |
| ADR-0012 | `eadef0335a644e0149053a02d32d03ddea4e1e78ed20d4bd8d6b89b32d2d1ba3` |
| ADR-0013 | `eabe0125a0ec6bbf4ed0850be7c2ae056ae74de173b7cb0ea5b99ba4e40d06ff` |
| ADR-0014 | `b90de96abf7103ac2d08aa57a1380337889bb6104c1b4ba7916f77a23f872e82` |

## 7. Aprovação

A aprovação humana autoriza o registro deste baseline como portfólio aprovado. A auditoria inicial permanece preservada como histórico.

## 8. Resultado estruturado

```json
{
  "schema_version": "1.0.0",
  "remediation_id": "ADR-PORTFOLIO-REMEDIATION-2026-08-28",
  "source_audit": "ADR-PORTFOLIO-AUDIT-2026-08-28",
  "result": "ADR_PORTFOLIO_APPROVED",
  "findings_remediated": 10,
  "adrs_modified": 14,
  "approved_by": "HUMAN_USER",
  "approved_at": "2026-08-31"
}
```
