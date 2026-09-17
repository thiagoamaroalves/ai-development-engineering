# T011 — Temporal Authority Evidence

```text
EVIDENCE_ID: T11-TAP-11
AUTHORITY: CandidateEvidenceReader / GIT mapping boundary
INITIAL_OBSERVATION: exact candidate basis plus evidence ID/hash
SECOND_OBSERVATION: independent reader observation before gate CAS/effect
EFFECT_BOUNDARY: CandidateEvidenceRepository.commit
DRIFT_RESULT: CANDIDATE_DRIFT / prior authorization preserved
CALLER_AS_AUTHORITY_CHECK: PASS
TEMPORAL_AUTHORITY_PROOF: PASS
```

DOM owns semantic candidate authorization and drift rejection. GIT owns remote
observation/execution; PLAT owns physical evidence durability; OPS projects the
result. None is recreated by T011.
