import assert from 'node:assert/strict'
import test from 'node:test'
import { JSDOM } from 'jsdom'
import { createElement, StrictMode } from 'react'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { activityInspectionHash, buildPrototypeUrl, selectScenario, visiblePublicationCommands } from '../src/uiModel.ts'

test('seletor de cenário representa mudança como reset determinístico', () => {
  assert.deepEqual(selectScenario('normal', 'capacity'), { scenario: 'capacity', reset: true, hash: 'scenario=capacity' })
  assert.equal(selectScenario('normal', 'normal').reset, false)
})

test('inspeção de atividade produz alvo navegável e estável', () => {
  assert.equal(activityInspectionHash('ACT-8F21'), '#activity:ACT-8F21')
  assert.equal(buildPrototypeUrl('/prototype/', 'activity', 'B', 'normal', activityInspectionHash('ACT-8F21')), '/prototype/?view=activity&variant=B&scenario=normal#activity:ACT-8F21')
})

test('controles de publicação visíveis respeitam o modo do agregado', () => {
  assert.deepEqual(visiblePublicationCommands('DIRECT_PUSH'), ['APPROVE_PUBLICATION', 'LOCAL_INTEGRATE', 'PUSH_REMOTE'])
  assert.deepEqual(visiblePublicationCommands('PULL_REQUEST'), ['APPROVE_PUBLICATION', 'MERGE_PR', 'CONFIRM_REMOTE'])
})

test('variante B mantém nomes acessíveis nos itens da navegação', async () => {
  const mounted = await mountApp('?view=overview&variant=B&scenario=normal')
  try {
    const navigation = document.querySelector('[aria-label="Navegação principal"]')!
    for (const label of ['Visão geral', 'Execuções', 'Artefatos e auditoria']) {
      const item = [...navigation.querySelectorAll('button')].find((button) => button.getAttribute('aria-label') === label)
      assert.ok(item, `item de navegação ${label} deve ter nome acessível`)
      assert.equal(item?.getAttribute('role') ?? 'button', 'button')
    }
  } finally {
    await unmountApp(mounted.root, mounted.dom)
  }
})

function buttonContaining(text: string): HTMLButtonElement | undefined {
  return [...document.querySelectorAll('button')].find((button) => button.textContent?.includes(text)) as HTMLButtonElement | undefined
}

function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds))
}

async function mountApp(search: string): Promise<{ root: Root; dom: JSDOM }> {
  const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', { url: `http://localhost:4173/${search}` })
  Object.assign(globalThis, { window: dom.window, document: dom.window.document, HTMLElement: dom.window.HTMLElement, Node: dom.window.Node })
  Object.defineProperty(globalThis, 'navigator', { configurable: true, value: dom.window.navigator })
  globalThis.IS_REACT_ACT_ENVIRONMENT = true
  const { default: App } = await import('../src/App.tsx')
  const root = createRoot(dom.window.document.getElementById('root')!)
  await act(async () => { root.render(createElement(App)) })
  return { root, dom }
}

async function unmountApp(root: Root, dom: JSDOM): Promise<void> {
  await act(async () => { root.unmount() })
  dom.window.close()
  delete (globalThis as { window?: unknown }).window
  delete (globalThis as { document?: unknown }).document
}

test('monta a UI real e exercita guards, dispatch confirmado, reset, ARIA e intervenções', async () => {
  const mounted = await mountApp('?view=publication&variant=A&scenario=pr')
  try {
    assert.ok(document.querySelector('[aria-label="Navegação principal"]'))
    assert.ok(document.querySelector('[aria-label="Variações do protótipo"]'))
    assert.equal(buttonContaining('Integrar local'), undefined)
    const confirmBeforeMerge = buttonContaining('Confirmar remoto')!
    assert.equal(confirmBeforeMerge.disabled, true)
    assert.match(confirmBeforeMerge.title, /merge/i)

    const approve = buttonContaining('Aprovar')!
    assert.equal(approve.disabled, false)
    await act(async () => { approve.click() })
    assert.match(document.querySelector('[role="status"]')?.textContent ?? '', /requested/)
    await act(async () => { await delay(220) })
    await act(async () => { document.querySelector<HTMLButtonElement>('[aria-label="Buscar evidências"]')!.click(); await delay(20) })
    assert.match(document.body.textContent ?? '', /command.accepted/)
    await act(async () => { await delay(320) })
    assert.match(document.body.textContent ?? '', /Aprovar publicação · confirmed/)
    await act(async () => { document.querySelector<HTMLButtonElement>('[aria-label="Navegação principal"] button:nth-of-type(9)')!.click(); await delay(20) })
    assert.equal(buttonContaining('Merge PR')?.disabled, false)
    assert.match(document.querySelector('[role="status"]')?.textContent ?? '', /confirmed/)

    const scenarioSelect = document.getElementById('scenario-select') as HTMLSelectElement
    await act(async () => {
      scenarioSelect.value = 'divergence'
      scenarioSelect.dispatchEvent(new mounted.dom.window.Event('change', { bubbles: true }))
      await delay(20)
    })
    assert.match(document.body.textContent ?? '', /Divergência Git \/ banco/)
    await act(async () => { document.querySelector<HTMLButtonElement>('[aria-label="Abrir intervenções"]')!.click(); await delay(20) })
    const classify = buttonContaining('Classificar SEMANTIC_DIVERGENCE')!
    await act(async () => { classify.click(); await delay(520) })
    assert.match(document.body.textContent ?? '', /decisão pendente/)
    assert.ok(buttonContaining('Autorizar Git'))
    await act(async () => { buttonContaining('Autorizar Git')!.click(); await delay(520) })
    assert.ok(buttonContaining('Aplicar efeito corretivo'))
    await act(async () => { buttonContaining('Aplicar efeito corretivo')!.click(); await delay(520) })
    assert.match(document.body.textContent ?? '', /resolvida após efeito/)
  } finally {
    await unmountApp(mounted.root, mounted.dom)
  }
})

test('fluxo real de snapshot e start permanece íntegro sob React StrictMode', async () => {
  const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', { url: 'http://localhost:4173/?view=new-run&scenario=normal' })
  Object.assign(globalThis, { window: dom.window, document: dom.window.document, HTMLElement: dom.window.HTMLElement, Node: dom.window.Node })
  Object.defineProperty(globalThis, 'navigator', { configurable: true, value: dom.window.navigator })
  globalThis.IS_REACT_ACT_ENVIRONMENT = true
  const { default: App } = await import('../src/App.tsx')
  const root = createRoot(dom.window.document.getElementById('root')!)
  try {
    await act(async () => { root.render(createElement(StrictMode, null, createElement(App))) })
    const validate = buttonContaining('Validar snapshot')!
    assert.ok(validate && !validate.disabled)
    await act(async () => { validate.click(); await delay(520) })
    const start = buttonContaining('Confirmar e iniciar')!
    assert.ok(start && !start.disabled)
    await act(async () => { start.click(); await delay(520) })
    assert.match(document.body.textContent ?? '', /RUNNING/)
    assert.doesNotMatch(document.body.textContent ?? '', /scheduler queue member .* inconsistent/i)
    await act(async () => {
      document.querySelector<HTMLButtonElement>('[aria-label="Buscar evidências"]')!.click()
      await delay(20)
    })
    const events = document.body.textContent ?? ''
    assert.equal((events.match(/command\.requested/g) ?? []).filter(() => true).length >= 2, true)
    assert.equal((events.match(/command\.accepted/g) ?? []).filter(() => true).length >= 2, true)
    assert.equal((events.match(/run\.started/g) ?? []).length, 1)
  } finally {
    await act(async () => { root.unmount() })
    dom.window.close()
    delete (globalThis as { window?: unknown }).window
    delete (globalThis as { document?: unknown }).document
  }
})
