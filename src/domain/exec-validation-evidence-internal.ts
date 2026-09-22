import type { SchemaValidationEvidence } from './exec-contract.ts'

/**
 * Validation evidence is recognized by object identity in this module-private
 * ledger. The adapter handoff is deliberately kept off the named module API;
 * only the infrastructure adapter imports the internal handoff object. A
 * copied receipt, caller-defined prototype, or hostile verifier therefore
 * cannot establish schema-validation authority.
 */
const ISSUED_EVIDENCE = new WeakSet<object>()

const adapterEvidenceHandoff = Object.freeze({
  accept(value: SchemaValidationEvidence): void {
    if (!value || typeof value !== 'object' || Array.isArray(value) || !Object.isFrozen(value)) return
    ISSUED_EVIDENCE.add(value)
  },
})

export default adapterEvidenceHandoff

export function isIssuedSchemaValidationEvidence(value: unknown): value is SchemaValidationEvidence {
  return Boolean(
    value
      && typeof value === 'object'
      && !Array.isArray(value)
      && Object.isFrozen(value)
      && ISSUED_EVIDENCE.has(value),
  )
}
