# Remediation Checkpoint Preflight Contract

A `REMEDIATION_CHECKPOINT` is a guarded transition into independent re-audit.
It may not be created from a remediation narrative alone.

## Required preflight result

Before the checkpoint marker is written, the remediation must emit:

```text
REMEDIATION_PREFLIGHT_VERSION = 1
CAMPAIGN_MATRIX_COMPLETE = YES
ALL_SURFACE_ROWS_COVERED = YES
ALL_NEGATIVE_WITNESSES_PASS = YES
NO_UNEXPLAINED_PUBLIC_AUTHORITY_PATH = YES
NO_HIDDEN_CONCRETE_PROTOCOL = YES | NOT_APPLICABLE
SEMANTIC_PROGRESS_PROVEN = YES
ROOT_CAUSE_CLOSURE_PROOF_COMPLETE = YES
NO_KNOWN_MATERIAL_BEHAVIOR_REGRESSION = YES
NO_KNOWN_STRUCTURAL_REMEDIATION_REGRESSION = YES
REMEDIATION_PREFLIGHT = PASS
```

The preflight must cite the campaign matrix, negative-witness evidence,
convergence record, changed-file set, test results, and structural self-check.
`SEMANTIC_PROGRESS_PROVEN = YES` requires more than changed files or green
proxy tests: the corrected obligation must have direct evidence and the
expanded-radius check must be complete whenever required.

## Blocking behavior

If any required field is missing, `NO`, `MISSING`, or unresolved:

```text
REMEDIATION_PREFLIGHT = BLOCKED
REMEDIATION_CHECKPOINT = NOT_AUTHORIZED
```

The checkpoint skill must stop without creating a commit. The remediation may
return to its owning scope or human gate; it must not self-certify closure.
