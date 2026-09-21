import type { SchemaValidationEvidence } from './exec-contract.ts'

/**
 * Issued evidence is tracked by object identity, not by a caller-controlled
 * prototype method.  A WeakSet deliberately makes a copied prototype,
 * lookalike receipt, or hostile verifier insufficient to establish provenance.
 *
 * The registration hook is an internal adapter handoff: the infrastructure
 * adapter calls it only after its schema engine and exact-input receipt checks
 * have succeeded.  Domain consumers can recognize a receipt but cannot mint
 * one by shaping an object or replacing a prototype method.
 */
const ISSUED_EVIDENCE = new WeakSet<object>()

export function registerIssuedSchemaValidationEvidence(value: SchemaValidationEvidence): void {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return
  ISSUED_EVIDENCE.add(value)
}

export function isIssuedSchemaValidationEvidence(value: unknown): value is SchemaValidationEvidence {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value) && ISSUED_EVIDENCE.has(value))
}
