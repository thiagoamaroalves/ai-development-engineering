import { ValidateExecContract } from '../application/exec-contract.ts'
import { JsonSchemaExecValidator } from '../infrastructure/exec-schema-validator.ts'

/**
 * Composition root for the productive EXEC contract boundary.
 * Infrastructure selection stays outside the application service.
 */
export function createExecContractValidator(): ValidateExecContract {
  return new ValidateExecContract(new JsonSchemaExecValidator())
}
