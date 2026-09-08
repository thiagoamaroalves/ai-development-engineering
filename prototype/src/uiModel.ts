import type { CommandName, PublicationMode, ScenarioId } from './mockDomain'

export interface ScenarioChoice { id: ScenarioId; label: string }

export function selectScenario(current: ScenarioId, next: ScenarioId): { scenario: ScenarioId; reset: boolean; hash: string } {
  return { scenario: next, reset: current !== next, hash: `scenario=${encodeURIComponent(next)}` }
}

export function activityInspectionHash(activityId: string): string { return `#activity:${activityId}` }

export function buildPrototypeUrl(pathname: string, view: string, variant: string, scenario: ScenarioId, hash = ''): string {
  const params = new URLSearchParams({ view, variant, scenario })
  return `${pathname}?${params}${hash}`
}

export function visiblePublicationCommands(mode: PublicationMode): CommandName[] {
  return mode === 'PULL_REQUEST' ? ['APPROVE_PUBLICATION', 'MERGE_PR', 'CONFIRM_REMOTE'] : ['APPROVE_PUBLICATION', 'LOCAL_INTEGRATE', 'PUSH_REMOTE']
}
