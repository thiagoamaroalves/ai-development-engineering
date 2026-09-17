# AC-DOM-052 — Structured verdict

```text
TICKET = DOM-001-TICKET-012
WITNESS = T12-AC2
RESULT = PASS
STRUCTURED_RESULTS = CONFORMANT | REMEDIATION_REQUIRED
PROCESS_TERMINATION_AS_APPROVAL = FORBIDDEN
```

The evaluator returns an immutable structured result containing the exact
scope, aggregate revision, evidence bundle, result state, and structured
findings. Complete evidence returns `CONFORMANT`; failed, incomplete, or
empty evidence returns `REMEDIATION_REQUIRED` with findings. Missing authority
is a rejected command. There is no `TERMINATED` success result and process
termination cannot close conformance.

The direct executable witness is `tests/dom-001-ticket-012.test.ts`, T12-AC2.
