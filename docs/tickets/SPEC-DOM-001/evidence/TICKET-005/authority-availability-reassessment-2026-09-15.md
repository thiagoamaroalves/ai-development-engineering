# T005 — Command authority availability reassessment

```text
DATE = 2026-09-15
CAPABILITY_ID = CAP-DOM-COMMAND-AUTHORITY-OBSERVATION
AUTHORITY_OWNER = SPEC-DOM-001 / DOM / O-011 / DOM-CMD-001
CONSUMER = DOM-IMP-05 / DOM-001-TICKET-005
DEPENDENCY_CLASS = REQUIRED_FOR_LOCAL_EXECUTION
LOCAL_CLOSURE_BLOCKING = YES
LOCAL_ACCEPTANCE_REQUIRES_PRODUCTIVE_CAPABILITY = YES
```

## Authority reconstruction

The accepted ADR-0002 command rule, portfolio O-011, SPEC requirement
DOM-CMD-001, and validated GAP-011/GAP-012 establish DOM as the semantic
owner of command preconditions, rejection meaning, and no-effect behavior.
They do not assign `DOM-IMP-03` as the producer of a complete command
authority observation. The Plan's `DOM-IMP-03` handoff is specifically
`CAP-DOM-ADR-AUTHORITY-READ-OBSERVATION` for T002.

The command observation consumed by T005 contains canonical identity,
aggregate revision, stage, SPEC/revision/dependency/verdict evidence, and
dependency/verdict freshness. An ADR observation alone cannot satisfy that
contract.

## Repository search evidence

Searches were run from the repository root:

```text
rg "implements CommandAuthorityReader|: CommandAuthorityReader|CommandAuthorityReader\s*=|new .*CommandAuthorityReader" src -g "*.ts"
RESULT: no productive implementation, factory, registration, or composition
```

```text
rg "CommandAuthorityReader|CommandAuthorityObservation|dependencyRevision|verdictRevision" src tests -g "*.ts"
RESULT: contract and consumers in src; implementations only in test files
       InMemoryCommandAuthorityReader and SequenceCommandAuthorityReader
```

```text
rg "CommandAuthorityReader|command-authority|authority.*reader|reader.*authority|register.*authority|factory|container|bootstrap|DI" src -g "*.ts"
RESULT: no productive registration/composition for the command reader
```

No productive adapter, read model, runtime registration, factory, dependency
injection composition, capability promotion record, or integrated runtime
proof was found for this capability. `src/domain/adr.ts`/T003 evidence is an
ADR reader and is not command-authority evidence.

## Independent availability dimensions

| Dimension | Result | Evidence boundary |
| --- | --- | --- |
| `CONTRACT_AVAILABLE` | YES | `src/domain/command.ts` defines `CommandAuthorityReader.observe` and typed observation/freshness |
| `LOCAL_TESTABILITY_AVAILABLE` | YES | test-only `InMemoryCommandAuthorityReader` and `SequenceCommandAuthorityReader` |
| `PRODUCTIVE_IMPLEMENTATION_AVAILABLE` | NO | no implementation under `src` |
| `PRODUCTIVE_COMPOSITION_AVAILABLE` | NO | no factory, registration, or runtime wiring under `src` |
| `INTEGRATED_PROOF_AVAILABLE` | NO | no productive runtime evidence, first/second read proof, or promotion record |

Fixtures, mocks, fakes, interfaces, and in-memory test repositories are not
productive availability evidence.

## Promotion decision

```text
PREVIOUS_STATUS = CONTRACT_TESTABLE_LOCALLY
NEW_STATUS = CONTRACT_TESTABLE_LOCALLY
PREVIOUS_PRODUCTIVE_AVAILABILITY = NO
NEW_PRODUCTIVE_AVAILABILITY = NO
PROMOTION_RECORD = NONE
PROMOTION = PROHIBITED
```

`EV-DOM-IMP-03-AUTHORITY-READER-COMPLETE` and `PROMO-DOM-ADR-01` remain valid
only for `CAP-DOM-ADR-AUTHORITY-READ-OBSERVATION`. They cannot be reused for
the command capability.
