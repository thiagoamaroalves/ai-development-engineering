---
id: ADR-PORTFOLIO-REMEDIATION-ASC-MAJOR-002-2026-08-28
title: Remediação do ASC-MAJOR-002 no portfólio ADR-0001–ADR-0014
status: APPROVED
date: 2026-08-28
finding: ASC-MAJOR-002
source_audit: ADR-PORTFOLIO-AUDIT-2026-08-28
prior_remediation: ADR-PORTFOLIO-REMEDIATION-2026-08-28
result: ADR_PORTFOLIO_APPROVED
approved_by: HUMAN_USER
approved_at: 2026-08-31
scope: [ADR-0001, ADR-0002, ADR-0003, ADR-0004, ADR-0005, ADR-0006, ADR-0007, ADR-0008, ADR-0009, ADR-0010, ADR-0011, ADR-0012, ADR-0013, ADR-0014]
---

# Remediação do ASC-MAJOR-002

## Resultado

`ADR_PORTFOLIO_APPROVED`

Foi remediado exclusivamente o finding `ASC-MAJOR-002 — O front matter não segue um schema uniforme`, e a remediação foi aprovada pelo usuário em 2026-08-31.

## Alterações realizadas

- O campo `status` foi substituído por `decision_status: ACCEPTED` nas 14 ADRs.
- `implementation_status: UNPROCESSED` foi preservado nas 14 ADRs.
- `revision` foi incrementado de `2` para `3` nas 14 ADRs.
- A ADR-0001 passou a definir que `adr_content_hash`, `implementation_commit_sha`, `implemented_at` e a evidência de realização pertencem exclusivamente ao registro operacional persistente do orquestrador, não ao documento ADR ou ao seu front matter.
- O README passou a documentar `decision_status`, `implementation_status` e a autoridade do registro operacional para os metadados de realização.

Nenhuma outra decisão arquitetural foi alterada. Os valores de `supersedes`, `superseded_by`, `related`, `decision_scope` e `implementation_status` foram preservados.

## Validações

- IDs contínuos `ADR-0001`–`ADR-0014` encontrados.
- Schema uniforme verificado nas 14 ADRs: `schema_version`, `id`, `title`, `decision_status`, `implementation_status`, `revision`, `date`, `decision_scope`, `supersedes`, `superseded_by` e `related`.
- Nenhum campo front matter genérico `status` permanece nas 14 ADRs.
- Nenhum valor de hash de conteúdo, commit de implementação, data de implementação ou evidência de realização foi inserido no documento ADR.
- A remediação permanece limitada ao finding vinculado.

## Hashes SHA-256 do baseline remediado

| ADR | SHA-256 |
|---|---|
| ADR-0001 | `33705082b9d2f46e638cd93bdf27ca676cfc6181a2684ad583e4501f5d06d50d` |
| ADR-0002 | `ef9289c6fca4bba73fca53ca38c71dd19110eb1cfe948358a7cca1fe14e177d9` |
| ADR-0003 | `6325234bb9c927a6d2b38886206119c643a05718f6db8cce8df5625653260073` |
| ADR-0004 | `5b2454da004f5ca0f7c0b6dd36c35aeeae642dbc139b5c11e1295e0db62a1e4c` |
| ADR-0005 | `c1a9aaef50599f06afb979edbe8ac1084bde3eada4b2d1bbf87c3d5be886917d` |
| ADR-0006 | `ab39573f39849d9d9016683096126a63b037d763f09b4f00293500fd8fbcc6b2` |
| ADR-0007 | `ee4d22de0ff3e71f325bbf4f702c5c20221303db141f1d873c4e9cc438d38428` |
| ADR-0008 | `f887895fac13c0236b2f34cc5db9c3e43ef97bcd8e3e8b537db2fc8fa0f94947` |
| ADR-0009 | `4ab502aea4f09afe2c5fa33bfb6c5ee0d11e2d8f9af65f244209ce1fac935761` |
| ADR-0010 | `874b77ac7f1f19fe0b22a95705721905ae861feecd1e043a956c5c1bbfdac186` |
| ADR-0011 | `f17a2f90f8c7d8058bb927786dadfeabbe112e5fd898fc50115d37c9d02b3971` |
| ADR-0012 | `f73cf9dd962be0a0a45b0f69aa6e22bd3f5c0ac713fa9cae23fa8d285e4a4d88` |
| ADR-0013 | `377b712c1544d07e3c4e1990b84c124afceec984e54ef8c1ba6fadba14a5f218` |
| ADR-0014 | `3ac6d6c75e05bd65b2d90cc754ffdc4885f36cd98eb7a87c6bfb8395f044c642` |

## Resultado estruturado

```json
{
  "schema_version": "1.0.0",
  "remediation_id": "ADR-PORTFOLIO-REMEDIATION-ASC-MAJOR-002-2026-08-28",
  "finding": "ASC-MAJOR-002",
  "scope": "ADR-0001–ADR-0014",
  "result": "ADR_PORTFOLIO_APPROVED",
  "adrs_updated": 14,
  "architectural_decisions_changed": 0,
  "approved_by": "HUMAN_USER",
  "approved_at": "2026-08-31"
}
```
