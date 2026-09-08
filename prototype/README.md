# Forgeflow — protótipo local

Protótipo navegável e descartável da interface web do Orquestrador de Tarefas para IA Engineering Development.

## Executar

No PowerShell:

```powershell
cd prototype
npm install
npm run dev
```

Abra `http://localhost:4173/`.

Verificações disponíveis:

```powershell
npm run lint
npm run build
npm test
```

## Navegação rápida

- `/?view=overview&variant=A&scenario=normal`
- `/?view=new-run&variant=A` — snapshot e confirmação de execução
- `/?view=spec&variant=B&scenario=audit` — detalhe, findings e lineage
- `/?view=dag&variant=C&scenario=conflict` — DAG e integração
- `/?view=interventions&scenario=divergence` — decisões humanas
- `/?view=publication&scenario=drift` — aprovação invalidada por drift
- `/?view=artifacts` — ledger e trilha de auditoria

Use as setas `←` e `→` para alternar entre as variações A, B e C. O seletor de cenários fica no rodapé da barra lateral.

## Escopo

Git, GitHub, Codex CLI, banco, e-mail e backend são simulados em memória por um domínio centralizado em `src/mockDomain.ts`. Os botões demonstram o ciclo `requested → accepted → confirmed`; rejeições, pré-condições, checkpoints e efeitos confirmados ficam no journal determinístico. Nenhuma integração externa é executada e nenhuma ADR é modificada.
