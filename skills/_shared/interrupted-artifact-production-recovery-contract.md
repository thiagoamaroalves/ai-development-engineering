# Interrupted Artifact Production Recovery Contract

This contract governs read-only artifact producers whose output was written or
partially written before an external failure. It applies to Gap Matrix,
Implementation Plan, and ticket-decomposition producers.

A dirty output artifact is an untrusted candidate, not proof of completion and
not a reason to discard work. When the producer's current authority gates are
still valid and the dirty paths are limited to the producer's declared output
boundary, rerun the same producer and reconcile/replace the candidate from the
current authority. Do not checkpoint, audit downstream, or treat a completion
marker in the candidate as sufficient evidence before the producer completes.

## Recovery entry

```text
SOURCE_AUTHORITY_AUDIT_UNMODIFIED = YES
SOURCE_AUTHORITY_VERDICT = current required PASS/CONFORMANT
OUTPUT_CANDIDATE_PATHS = subset of producer output boundary
COMPLETE_CURRENT_OUTPUT_EVIDENCE = NO
=> ARTIFACT_PRODUCTION_RECOVERY = RESUME_OR_RECONCILE
=> rerun the owning producer
```

A changed authority audit, upstream contract, or path outside the producer
boundary blocks and requires canonical reassessment. The candidate must remain
preserved; never reset, clean, stash, or silently discard it.

## Producer requirements

At intake, record:

```text
ARTIFACT_PRODUCTION_RECOVERY = NONE | RESUME_OR_RECONCILE
INTERRUPTED_OUTPUT_ATTEMPT = YES | NO
OUTPUT_CANDIDATE_CLASSIFICATION = CLEAN | PARTIAL | COMPLETE_CLAIM_UNVERIFIED | CONTRADICTORY
SOURCE_AUTHORITY_IDENTITY = <path, revision/round, verdict, basis>
OUTPUT_CANDIDATE_PATHS = <exact paths>
```

Re-read all current authority and regenerate the complete output. Reconcile
identity, revision, basis, metrics, traceability, evidence, and readiness as a
single result. A candidate that claims downstream readiness without complete
current output is `COMPLETE_CLAIM_UNVERIFIED`.

Only a complete producer result may move to its phase checkpoint. The
independent downstream audit remains mandatory.
