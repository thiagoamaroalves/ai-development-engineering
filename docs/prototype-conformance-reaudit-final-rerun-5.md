# Independent Final Prototype Conformance Reaudit — Final Rerun 5

## 1. Formal verdict

`PROTOTYPE_CONFORMANT`

The current prototype satisfies the requested final remediation scope. PCA-MAJOR-021, PCA-MAJOR-027, PCA-MAJOR-028, and PCA-MAJOR-029 are CLOSED; PCA-MAJOR-006 is CLOSED; no new Critical, Major, or Minor finding was identified; and no previously closed finding regressed.

## 2. Independence and method

Mode: `READ_ONLY / INDEPENDENT / ADVERSARIAL / ADR_FIRST`.

The remediation report and `prototype/fresh-adversarial-probe.ts` were treated as claims only. I inspected the current repository, ADRs, source, tests, and prior audit directly; ran the required verification commands; executed fresh transient TypeScript probes with `node --import tsx -e` without creating probe files; and exercised the real browser at `http://localhost:4173/`.

No source, test, ADR, plan, traceability, coverage, prior audit, or remediation report was modified. The only authorized repository artifact created by this audit is this report.

## 3. Authority

Applied precedence:

1. ADR-0001 through ADR-0014.
2. Approved ADR portfolio records.
3. Normative project documentation.
4. Plan, traceability, and coverage artifacts.
5. Prior independent audits.
6. Remediation reports as claims only.
7. Implementation, tests, and fresh runtime/browser evidence.

The controlling authority requires persistent identity and immutable snapshots (ADR-0001), guarded state machines (ADR-0002), session/assignment/cycle segregation (ADR-0004), one bounded fair scheduler (ADR-0005), journal/idempotency/recovery (ADR-0006), and a frontend that consumes domain projections rather than becoming authority (ADR-0014).

## 4. Repository baseline

| Item | Fresh result |
| --- | --- |
| Repository | `C:\Users\taalves\OneDrive - Octave\Documents 1\pessoal\ai-engineering-development` |
| Branch | `main` |
| HEAD | `4ae336c7f6a1dae468a23e1e9cbfe1fb95b63386` |
| `origin/main` | `4ae336c7f6a1dae468a23e1e9cbfe1fb95b63386` |
| Staged changes | none |
| Tracked unstaged changes | none |
| Prototype Git tracking | none; `git ls-files prototype` returned no entries |
| Untracked material | prototype/, prior audit/remediation/docs artifacts, and `docs/adrs/draw.io-31.3.2-windows-installer.exe` |
| Node/npm | `v22.17.0` / `11.7.0` |
| Dependencies | installed and usable |

The untracked prototype limits historical Git diffability, but the current filesystem state, hashes, tests, probes, and browser evidence were independently captured.

## 5. Fresh hashes

| File | SHA-256 |
| --- | --- |
| `prototype/src/mockDomain.ts` | `87970aa71b889810dbbd873f94be421708093f98b18d3fbc263e734565e01347` |
| `prototype/src/App.tsx` | `5bf9547bbfdad1f0cbf7c5914db9b8ee93dc9696b93fcdf15867155729cc7146` |
| `prototype/src/main.tsx` | `77aaa85d0a532963cd63d1c6171a833f73b608dd83b4085f855b279dbe922939` |
| `prototype/src/styles.css` | `e4c71d6d4aeed2cc582cff05f8709dcdbe2bc44c7190e68f2f6ad5624e5738bd` |
| `prototype/tests/mockDomain.test.ts` | `8bb1e21632ec05e889c596c096f35953a5ddfb6e9ac8dc05a9803e8ea10c23fc` |
| `prototype/tests/ui.test.ts` | `04425a82d3ceb44e92bc12ef79aff0502e60057c622febd3949383c9893f5d5f` |
| `prototype/fresh-adversarial-probe.ts` | `9e98f0d53abf837ddac4fe62c55e1aab78ea36bef65e5c4cacdb8d25a3c75157` |
| `prototype/package.json` | `19057e64bff0a1e94d35233a8e926e52a48be3ee43f03100944a6e1d2dd42b25` |
| `prototype/package-lock.json` | `feb34da40e37b5075dffa3b9d9f77a95df26ebd01a26eadef53cb506fd301064` |
| `docs/prototype-conformance-remediation-final-rerun-4.md` | `d9caa6cac5bb8dc4f7f459aa2a189cfed7a0e0f174d7ab1c9d38c03614f25130` |

## 6. ADR integrity

All 14 current ADR files match the approved rev3 portfolio hash table in `docs/adrs/ADR-0001-0014-portfolio-remediation-ASC-MAJOR-002-2026-08-28.md`. Fresh hashes were independently recomputed. Each ADR reports `decision_status: ACCEPTED`, `revision: 3`, and `implementation_status: UNPROCESSED`. Result: `PASS`.

## 7. PCA-MAJOR-021 result

Result: `CLOSED`.

`prototype/src/main.tsx:7` renders `StrictMode`. `prototype/src/App.tsx:40` now performs `requestCommand` and scheduled `advanceCommand` calls outside React state-updater callbacks; setters receive only the already-produced projection. No productive domain call remains in render, `useMemo`, a state-updater callback, or an unstable effect.

## 8. Browser/StrictMode evidence

Using the real in-app browser at `http://localhost:4173/`, I completed the available equivalent journey: open Nova execução, validate the DRAFT snapshot, click `Confirmar e iniciar`, observe `RUNNING`, open Atividade e agente, select and complete `ACT-8F12`, navigate to Artefatos and back, and inspect the ledger.

Observed:

- the application remained rendered;
- snapshot reached `READY_TO_START`, then `CONFIRMED`;
- execution visibly reached `RUNNING`;
- `ACT-8F12` reached `COMPLETED`;
- exact ledger counts were 3 `command.requested`, 3 `command.accepted`, 1 `run.started`, and 1 `activity.completed` for the exercised three-action flow;
- no duplicate `run.started` effect occurred;
- no React, scheduler, or browser console error was emitted.

## 9. UI mutation inventory

The productive UI path is centralized in `App.tsx:40`. `useEffect` registrations at `App.tsx:41-44` only clean timers, synchronize the projection ref, update URL/inspection state, expire the toast, and manage keyboard listeners. Navigation and re-render did not add ledger events or mutate scheduler state. Representative start, completion, publication/divergence UI paths are covered by the production-facing UI test and the browser smoke.

## 10. PCA-MAJOR-027 result

Result: `CLOSED`.

The scheduler authority is instance-bound through `WeakMap`s at `mockDomain.ts:130-158`; scheduler projections are cloned and deeply frozen at `:147-153`; all productive scheduler mutators require the exact authority capability. Scheduler creation rejects duplicate IDs before registry insertion at `:187-209`; state lookup resolves the original scheduler instance from the registry at `:211-216`.

## 11. Scheduler identity evidence

Fresh probe results:

- two independent `createScenarioState('normal')` calls returned distinct scheduler instances, scheduler IDs, execution IDs, and publication identities;
- mutating A through validate/start left B revision and snapshot unchanged, and A continued to resolve scheduler A;
- explicit duplicate scheduler ID creation failed with no replacement or mutation of the first scheduler;
- shared A/B/C executions retained distinct execution identities on one scheduler.

## 12. Provenance/ownership evidence

Provenance is created by `canonicalRegistrationProvenance` at `mockDomain.ts:172-176`, stored in a `WeakMap`, and bound to scheduler instance plus the complete registration fingerprint. `verifyRegistrationProvenance` at `:179-182` rejects foreign, copied, serialized, missing, or content-mismatched provenance.

Fresh adversarial attempts all failed before canonical mutation: shape-valid forged registration; scheduler-A provenance on scheduler B; execution/activity cross-wire; role, artifact-cycle, session, assignment, and activity substitutions; copied provenance; and serialized/deserialized provenance. Revision, queue, leases, registrations, and capacity snapshots remained unchanged. Exact replay was a no-op. Canonical factory creation at `:273-287` also checks assignment session, role, and artifact-cycle ownership before issuing provenance.

## 13. Ceiling evidence

`reconcileSchedulerCapacity` validates ceiling bounds before writes at `mockDomain.ts:394-410`. Fresh probes rejected maximum=1/ceiling=99, maximum=0/ceiling=1, negative, and non-integer ceilings atomically. Revision, maximum, ceiling, used, available, leases, and queue remained unchanged on rejection. A valid ceiling-only change advanced revision once; an exact no-op did not advance revision.

## 14. Scheduler mutation inventory

Registration, lifecycle update, queue insertion, lease acquisition, lease release, dispatch, and capacity reconciliation all require canonical authority. SYSTEM leases cannot be released (`mockDomain.ts:454-460`). Canonical queue reasons are refreshed after mutation, and `assertCapacityCoherent` at `:653-672` checks capacity, lease, execution, identity, queue membership, and reason invariants. Projection mutation attempts are isolated from canonical state.

## 15. PCA-MAJOR-028 result

Result: `CLOSED`.

Candidate identity is content- and execution-bound at `mockDomain.ts:122-124`; initial publication identity is created from repository, scheduler, execution, candidate, and display PR number. Display PR number is not treated as authority.

## 16. Publication identity inventory

Fresh inventories showed distinct scheduler identity, execution identity, candidate identity, canonical publication identity, command/event/correlation identities, and evidence identities for independent fixtures. Two concurrent PR executions sharing one scheduler both displayed PR 184 but retained distinct execution, candidate, and canonical publication identities.

## 17. Candidate rollover evidence

`CHANGE_CANDIDATE` at `mockDomain.ts:911` materially changes head/tree, derives candidate C2 from the new content, derives publication P2, clears prior merge/remote evidence, and invalidates approval/conformance. Fresh probe: C2 != C1 and P2 != P1. `REVALIDATE_PUBLICATION` at `:912` retained P2 and did not revert to P1.

## 18. Stale evidence evidence

`mergedPublicationEvidenceMatches` at `mockDomain.ts:811-812` requires current candidate, PR, base, head, tree, conformance run, publication identity, merge evidence ID, approval, checks, mergeability, and queue position. Fresh stale old-approval, old-conformance, old-merge, old-remote, old-identity-with-new-fields, cross-execution, and post-rollover evidence attempts were rejected without overwriting current identity.

## 19. Same-publication retry/recovery evidence

Exact approval replay, equivalent publication replay, revalidation with unchanged candidate, and recovery/retry paths preserve the existing canonical publication identity. A genuinely changed candidate receives a new identity. The prototype does not model a second post-terminal publication flow; no requirement was invented for that unsupported scope.

## 20. PCA-MAJOR-029 regression

Result: `CLOSED` and remains closed.

Fresh maximum=5/initialUsed=2 evidence showed used=3, available=2, four READY activities, and all four represented in the canonical queue. Fresh shared A/B/C evidence showed used=5, five unique leases, and 12 queued candidates. No valid READY candidate was omitted while capacity remained.

## 21. Shared A/B/C scheduler

Three normal executions on one scheduler retained distinct execution IDs, respected the global capacity ceiling, produced unique leases, and retained the complete fair queue. Mutating one execution did not redirect or overwrite another execution's scheduler authority.

## 22. PCA-MAJOR-006 aggregate assessment

Result: `CLOSED`.

The integrated scheduler contract is sound for the prototype scope: singular instance authority, collision-safe identity, provenance-backed registration, domain ownership, bounded capacity and ceiling, complete/fair queueing, lifecycle eligibility, lease acquisition/release, SYSTEM reservation protection, KNOWN/UNKNOWN behavior, revision semantics, retry/recovery, projection isolation, cancellation isolation, publication identity, and real browser command integration all passed the required evidence.

## 23. Closed-finding regression

| Finding | Result | Evidence |
| --- | --- | --- |
| PCA-MAJOR-022 | CLOSED | waiting activities cannot complete; confirmed completion releases only the owned user lease and redispatches |
| PCA-MAJOR-023 | CLOSED | shared scheduler priority and bounded fairness probes passed |
| PCA-MAJOR-024 | CLOSED | recovery evidence, safe checkpoint, journal interval, replay, race rejection, and idempotency tests passed |
| PCA-MAJOR-025 | CLOSED | frozen/copy/stale projections and forged lease inputs cannot mutate authority |
| PCA-MAJOR-026 | CLOSED | unstarted, paused, failed, cancelled, and terminal executions do not receive valid leases |
| PCA-MINOR-007 | CLOSED | missing scheduler read fails closed and does not create authority |

A fresh direct probe also confirmed waiting cannot complete, completion redispatches after lease release, recovery reaches `RECOVERED`, projections are frozen, missing scheduler lookup fails closed, and failed retry activity has no completion lease.

## 24. Twelve-scenario regression

The checked-in deterministic journey test at `prototype/tests/mockDomain.test.ts:1063` covers all 12 families: normal, audit, capacity, retry, rounds, conflict, divergence, recovery, drift, PR, migration, and ADR mutation. It passed. A fresh independent factory probe also instantiated all 12 and ran `assertCoherentState` successfully.

## 25. Tests/lint/build

- `npm test`: PASS, 86/86 tests passed, 0 failed, 0 skipped.
- `npm run lint`: PASS (`tsc --noEmit`).
- `npm run build`: PASS; TypeScript build and Vite production build completed.
- `npx tsx fresh-adversarial-probe.ts`: PASS (`FRESH_ADVERSARIAL_PROBE_PASS`), treated only as supplementary claim evidence.

## 26. Test-quality assessment

| Required defect | Current checked-in test coverage | Independent reaudit evidence |
| --- | --- | --- |
| cross-wired canonical ownership | partial explicit coverage | full session/role/cycle/activity/assignment cross-wire probe passed |
| copied provenance | no explicit clone/serialization case | copied and serialized provenance probe passed |
| duplicate scheduler-ID aliasing | explicit test at `mockDomain.test.ts:1364` | duplicate and post-rejection authority probe passed |
| provenance reuse after mutation | explicit identity/role/assignment cases | all listed field substitutions passed |
| ceiling overflow | explicit atomic overflow test | maximum/ceiling matrix passed |
| candidate rollover | explicit test at `:1394` | fresh C1/P1 to C2/P2 and revalidation probe passed |
| stale evidence reuse | explicit stale-evidence tests | old identity/evidence injection rejected |
| StrictMode duplicate command | UI test asserts one `run.started` | real browser ledger showed exact productive counts |
| render-triggered mutation | no dedicated mutation sentinel | static integration scan plus navigation/re-render smoke passed |
| independent same-scenario collision | explicit test at `:1364` | fresh independent fixtures passed |

Green tests alone would not have established closure; the independent probes and browser evidence supplied the missing adversarial coverage.

## 27. Browser result

`PASS`. Browser validation was available and completed. No audit block applies.

## 28. Static integration scan

No executable `fetch`, axios, WebSocket, EventSource, child_process, Git/gh, Codex CLI, database client, SMTP, localStorage, sessionStorage, IndexedDB, or other external-authority path was found in the prototype. Scan hits were display/mock content only, including the displayed `Codex CLI exit code 7` text in the retry scenario, Git/DB labels, localhost connection label, and test assertions.

## 29. New findings

None. The prior browser regression is closed, and no distinct Critical, Major, or Minor root cause was observed.

## 30. Consolidated finding table

| Finding | Final result | Basis |
| --- | --- | --- |
| PCA-MAJOR-006 | CLOSED | integrated scheduler contract passed |
| PCA-MAJOR-021 | CLOSED | real StrictMode browser path and exact ledger counts passed |
| PCA-MAJOR-022 | CLOSED | waiting/completion/lease-release regression passed |
| PCA-MAJOR-023 | CLOSED | priority/fairness regression passed |
| PCA-MAJOR-024 | CLOSED | recovery/replay/idempotency regression passed |
| PCA-MAJOR-025 | CLOSED | projection isolation regression passed |
| PCA-MAJOR-026 | CLOSED | lifecycle lease eligibility regression passed |
| PCA-MAJOR-027 | CLOSED | authority, identity, provenance, ownership, and ceiling passed |
| PCA-MAJOR-028 | CLOSED | persistent publication identity lifecycle passed |
| PCA-MAJOR-029 | CLOSED | queue completeness regression passed |
| PCA-MINOR-007 | CLOSED | missing scheduler fails closed |

## 31. Files modified

Only `docs/prototype-conformance-reaudit-final-rerun-5.md` was intentionally created by this audit. No source, test, ADR, plan, traceability, coverage, prior audit, or remediation report was changed. `npm run build` generated ignored `prototype/dist/` output as a verification side effect.

## 32. Final recommendation

The prototype may receive `PROTOTYPE_CONFORMANT` for the audited prototype scope. The result does not imply production backend readiness; the implementation remains a local mock-domain prototype, and the prototype's untracked Git status should be addressed separately if historical change traceability is required.

## 33. Machine-readable summary

FINAL_PROTOTYPE_REAUDIT_RERUN_5_COMPLETE
VERDICT: PROTOTYPE_CONFORMANT

PCA-MAJOR-006: CLOSED
PCA-MAJOR-021: CLOSED
PCA-MAJOR-027: CLOSED
PCA-MAJOR-028: CLOSED
PCA-MAJOR-029: CLOSED

Previously closed findings reopened: NONE

New findings:
CRITICAL=0
MAJOR=0
MINOR=0
INFO=0

Tests: PASS (86/86)
Lint: PASS
Build: PASS
Browser: PASS

Report:
docs/prototype-conformance-reaudit-final-rerun-5.md
