---
name: reconcile-legacy-ticket-set-audit-lineage
description: >
  Establish a controlled V2 workflow basis for the current component
  implementation-ticket audit when the approved ticket-set generation,
  conformance audit, and ready-ticket design predate persisted result lineage.
metadata:
  short-description: Reconcile one verified legacy ticket-set audit
---

# Reconcile Legacy Ticket-Set Audit Lineage

This operation is available only through the catalog's explicit exceptional
recovery entry. It validates existing current authority and creates one
separate migration report; it does not rerun the ticket-set audit or create a
checkpoint commit.

## Preconditions

Require all of the following from the extension-validated workflow basis:

```text
BASIS.type = legacy-ticket-set-audit
BASIS.proof.specId = the selected component ID
BASIS.proof.auditPath = the current component implementation-ticket audit
BASIS.proof.designPath = the current design for the selected ready ticket
```

The extension has validated the current ticket-generation and ticket-set
conformance checkpoints, their exact manifests, commits, source-authority
digests, and ancestry. It has also validated that the conformance marker binds
the current conformant audit, that the selected design belongs to exactly one
ticket in the generated set, and that the design's readiness and audit
fingerprint match that conformance checkpoint. Every source path and digest is
pinned at the migration target HEAD. Stop if any proof field disagrees or if a
current V2 ticket-set audit result already exists.

The existing T001 implemented-ticket audit result is independent evidence. Do
not edit, remove, supersede, copy, or otherwise change it during this
operation. The only changed path permitted is the new migration report.

## Migration result

Create one canonical Markdown artifact under `docs/workflow-checkpoints/` at
the path derived by the extension from the component ID and the first 12
characters of the current ticket-set conformance checkpoint commit. Do not
overwrite a report for another migration basis. On same-operation recovery,
retain earlier result blocks and append only the new terminal
`WORKFLOW_RESULT_V2` block supplied by the extension.

Persist these exact proof fields from the validated basis:

```text
MIGRATION_KIND = LEGACY_COMPONENT_IMPLEMENTATION_TICKET_AUDIT_LINEAGE
COMPONENT_ID = <selected component ID>
SOURCE_GENERATION_MARKER = <validated generation checkpoint marker>
SOURCE_GENERATION_MANIFEST = <validated generation phase manifest>
SOURCE_GENERATION_COMMIT = <validated generation checkpoint commit>
SOURCE_TICKET_SET_CONFORMANCE_MARKER = <validated conformance checkpoint marker>
SOURCE_TICKET_SET_CONFORMANCE_MANIFEST = <validated conformance phase manifest>
SOURCE_TICKET_SET_CONFORMANCE_COMMIT = <validated conformance checkpoint commit>
SOURCE_TICKET_SET_AUDIT = <validated current audit path>
SOURCE_TICKET_SET_AUDIT_SHA256 = <validated audit digest>
SOURCE_TICKET_SET_AUDIT_VERDICT = IMPLEMENTATION_TICKETS_CONFORMANT
SOURCE_TICKET_SET_AUDIT_GATE = READY_FOR_IMPLEMENTATION
CURRENT_READY_TICKET_ID = <validated ready ticket ID>
CURRENT_READY_TICKET_PATH = <validated generated ticket path>
CURRENT_READY_TICKET_SHA256 = <validated ticket digest>
CURRENT_IMPLEMENTATION_DESIGN = <validated current design path>
CURRENT_IMPLEMENTATION_DESIGN_SHA256 = <validated design digest>
CURRENT_HEAD_AT_MIGRATION = <validated migration target HEAD>
NEXT_AUTHORIZED_OPERATION = audit-component-implementation-tickets
MIGRATION_VALIDATION = PASS
MIGRATION_GATE = LEGACY_TICKET_SET_AUDIT_VALIDATED
```

Do not add a V2 result block to the historical ticket-set audit or checkpoint.
The persisted migration result authorizes only a fresh independent
`audit-component-implementation-tickets` operation. That audit must re-read
the current generated ticket set and produce its own current result before a
ticket-set conformance checkpoint.

## Required receipt

Return a complete operation receipt with:

```text
operation = reconcile-legacy-ticket-set-audit-lineage
status = COMPLETE
subject = the selected component ID
gateField = MIGRATION_GATE
gateValue = LEGACY_TICKET_SET_AUDIT_VALIDATED
gateArtifactPath = the deterministic new migration report
```

List only the migration report in `artifactPaths` and `changedPaths`. Do not
modify the historical ticket-set audit, checkpoint markers or manifests, any
implemented-ticket audit, ticket, implementation design, implementation, or
test artifact. Do not commit, push, merge, publish, or change ticket lifecycle
state.

If the current generation, audit, design, or any source digest cannot be proved
exactly, return `BLOCKED` and make no repository change.
