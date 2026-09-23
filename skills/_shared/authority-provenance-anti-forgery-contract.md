# Authority Provenance and Anti-Forgery Contract

Apply this contract whenever a design, implementation, adapter, port, receipt,
result, evidence record, or projection carries or claims canonical authority,
identity, approval, lifecycle, version, capability, or completion meaning.

## Required authority-proof record

The design and the independent design audit must record:

```text
PROOF_ISSUER_OWNER = <canonical authority owner>
PROOF_SCOPE = <exact authority obligation and input scope>
PROOF_IDENTITY_OR_BRAND = <identity/brand/nominal or equivalent boundary>
CONSUMER_VERIFICATION_RULE = <exact consumer-side verification>
STALE_OR_MUTATION_POLICY = <behavior after source/input mutation>
FORGERY_NEGATIVE_TEST = <direct executable witness>
CALLER_INJECTION_NEGATIVE_TEST = <direct executable witness>
ALTERNATE_ADAPTER_CONTRACT_TEST = <direct witness or NOT_APPLICABLE with reason>
```

`PROOF_IDENTITY_OR_BRAND` does not mandate a language feature; it requires an
unforgeable or independently verified identity boundary appropriate to the
accepted architecture. A caller-supplied boolean, copied shape, public
constructor, nominally unused port, or matching text is not proof by itself.

## Required verification semantics

For each proof, verify:

```text
ISSUER_IS_AUTHORIZED = YES
PROOF_SCOPE_IS_EXACT = YES
CONSUMER_VERIFIES_PROVENANCE = YES
INPUT_OR_REFERENCE_BINDING = YES
MUTATION_OR_STALE_REJECTION = YES | NOT_APPLICABLE with reason
FORGERY_PATH_REJECTED = YES
CALLER_INJECTION_REJECTED = YES
ALTERNATE_ADAPTER_CONTRACT = PASS | NOT_APPLICABLE with reason
```

The consumer, not the caller, owns verification of authority-bearing results.
Adapters may translate or transport authority but may not mint it. If a port is
intended for alternate implementations, every alternate adapter must satisfy
the same proof contract; otherwise record the concrete protocol dependency and
classify it as a boundary defect.

## Closure rule

Source inspection, a type annotation, a passing happy path, or a fixture-only
result cannot close a provenance obligation. Closure requires direct positive
and negative executable witnesses, including forged/caller-injected input,
stale or mutated input/reference where applicable, and alternate-adapter
compatibility where the design claims substitutability.
