import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const shared = (name) => join(root, "skills", "_shared", name);
const skill = (name) => join(root, "skills", name, "SKILL.md");

const requiredContracts = {
  "root-cause-campaign-contract.md": [
    "ROOT_CAUSE_CAMPAIGN_ID",
    "CAMPAIGN_MATRIX_COMPLETE",
    "ALL_SURFACE_ROWS_COVERED",
    "ALL_NEGATIVE_WITNESSES_PASS",
    "PORT_SUBSTITUTION_PATHS",
  ],
  "audit-convergence-contract.md": [
    "CONSECUTIVE_FINDING_PERSISTENCE",
    "TWO_CONSECUTIVE_UNCLOSED_REAUDITS",
    "EXPANDED_RADIUS_REQUIRED",
    "NON_CONVERGING",
  ],
  "authority-provenance-anti-forgery-contract.md": [
    "PROOF_ISSUER_OWNER",
    "PROOF_IDENTITY_OR_BRAND",
    "FORGERY_NEGATIVE_TEST",
    "CALLER_INJECTION_NEGATIVE_TEST",
  ],
  "remediation-preflight-contract.md": [
    "REMEDIATION_PREFLIGHT_VERSION = 1",
    "SEMANTIC_PROGRESS_PROVEN",
    "REMEDIATION_PREFLIGHT = PASS",
    "REMEDIATION_CHECKPOINT = NOT_AUTHORIZED",
  ],
  "audit-report-structure-contract.md": [
    "BASE_REPORT_PATH",
    "ROUND_DELTA_PATH",
    "FINDING_LINEAGE_LEDGER_PATH",
    "FINDING_LINEAGE_LEDGER_COMPLETE",
  ],
};

const requiredSkillMarkers = {
  "consolidate-implementation-audit": [
    "root-cause-campaign-contract.md",
    "audit-convergence-contract.md",
    "audit-report-structure-contract.md",
    "CAMPAIGNS_NON_CONVERGING",
  ],
  "remediate-implemented-ticket": [
    "root-cause-campaign-contract.md",
    "remediation-preflight-contract.md",
    "EXPANDED_RADIUS_REQUIRED",
    "REMEDIATION_PREFLIGHT = PASS",
  ],
  "checkpoint-implemented-ticket": [
    "remediation-preflight-contract.md",
    "REMEDIATION_CHECKPOINT = NOT_AUTHORIZED",
    "untracked before this checkpoint is expected",
  ],
  "audit-implemented-ticket": [
    "audit-convergence-contract.md",
    "audit-report-structure-contract.md",
    "CONSECUTIVE_FINDING_PERSISTENCE",
  ],
  "audit-component-implementation-tickets": [
    "READY_FOR_TICKET_AUDIT | READY_FOR_INDEPENDENT_TICKET_REAUDIT",
    "NEXT_TICKET_SET_OPERATION",
    "design-ticket-implementation",
    "No independent design audit or pre-existing Git",
  ],
  "design-ticket-implementation": [
    "authority-provenance-anti-forgery-contract.md",
    "PROOF_IDENTITY_OR_BRAND",
    "This skill owns approval of the design artifact it creates",
  ],
  "audit-implementation-design-conformance": [
    "authority-provenance-anti-forgery-contract.md",
    "CALLER_INJECTION_REJECTED",
  ],
};

for (const [name, markers] of Object.entries(requiredContracts)) {
  const text = await readFile(shared(name), "utf8");
  for (const marker of markers) {
    if (!text.includes(marker)) throw new Error(`${name}: missing ${marker}`);
  }
}

for (const [name, markers] of Object.entries(requiredSkillMarkers)) {
  const text = await readFile(skill(name), "utf8");
  for (const marker of markers) {
    if (!text.includes(marker)) throw new Error(`${name}: missing ${marker}`);
  }
}

const controller = await readFile(join(root, ".pi", "agents", "workflow-controller.md"), "utf8");
for (const marker of [
  "historical remediation report in isolation",
  "latest current canonical ticket-set audit",
  "must never route back to ticket-set audit",
  "design-ticket-implementation",
  "Git-tracked status is not an approval predicate",
]) {
  if (!controller.includes(marker)) throw new Error(`workflow-controller: missing ${marker}`);
}

const routing = await readFile(shared("implementation-audit-routing-contract.md"), "utf8");
for (const marker of [
  "historical ticket-set remediation artifact is evidence",
  "NEXT_TICKET_SET_OPERATION: design-ticket-implementation",
  "wins over older remediation text",
]) {
  if (!routing.includes(marker)) throw new Error(`routing contract: missing ${marker}`);
}

console.log("PASS: audit governance contracts and guards");
