# T010 — Temporal Authority Evidence

```text
EVIDENCE_ID: T10-TAP-10
AUTHORITY: NormativeChangeAuthorityReader
INITIAL_OBSERVATION: source/target normative revisions and exact affected set
SECOND_OBSERVATION: independent observation immediately before repository apply
EFFECT_BOUNDARY: NormativeChangeRepository.save
DRIFT_RESULT: NORMATIVE_CHANGE_STALE / prior approvals unchanged
CALLER_AS_AUTHORITY_CHECK: PASS
TEMPORAL_AUTHORITY_PROOF: PASS
```

DOM owns the semantic impact decision. The repository port owns only atomic
storage/CAS; PLAT/GIT/EXEC physical records and mappings remain foreign
integrated responsibilities.
