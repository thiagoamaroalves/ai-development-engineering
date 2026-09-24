import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const planPath = "docs/specs/implementation-plans/SPEC-EXEC-001-implementation-plan.md";
const checkpointPath = "docs/workflow-checkpoints/SPEC-EXEC-001-component-implementation-plan-remediation.md";

const failures = [];
const checked = [];

async function load(relativePath) {
  try {
    return await readFile(join(root, relativePath), "utf8");
  } catch (error) {
    failures.push(`${relativePath}: cannot read (${String(error)})`);
    return "";
  }
}

function fields(text, name, path) {
  const pattern = new RegExp(`^\\s*${name.replaceAll(".", "\\.")}\\s*[:=]\\s*(.+?)\\s*$`, "gm");
  const values = [];
  for (const match of text.matchAll(pattern)) {
    const before = text.slice(0, match.index ?? 0);
    const line = before.split("\n").length;
    values.push({ value: match[1].trim(), line });
  }
  checked.push(`${path}:${name}`);
  return values;
}

function requireSingle(path, name, values) {
  const distinct = [...new Set(values.map(({ value }) => value))];
  if (distinct.length !== 1) {
    failures.push(`${path}:${name} must have one effective value; found ${values.map(({ value, line }) => `${value} (line ${line})`).join(", ") || "none"}`);
  }
  return distinct[0];
}

const plan = await load(planPath);
const checkpoint = await load(checkpointPath);
const planGate = requireSingle(planPath, "IMPLEMENTATION_PLAN_GATE", fields(plan, "IMPLEMENTATION_PLAN_GATE", planPath));
const nextOperation = requireSingle(checkpointPath, "NEXT_AUTHORIZED_OPERATION", fields(checkpoint, "NEXT_AUTHORIZED_OPERATION", checkpointPath));
const remediationVerdict = requireSingle(checkpointPath, "REMEDIATION_VERDICT", fields(checkpoint, "REMEDIATION_VERDICT", checkpointPath));

if (remediationVerdict === "COMPONENT_IMPLEMENTATION_PLAN_REMEDIATION_COMPLETE" && nextOperation === "audit-component-implementation-plan") {
  if (planGate !== "READY_FOR_IMPLEMENTATION_PLAN_AUDIT") {
    failures.push(`${planPath}: remediation-complete checkpoint routes to audit, but IMPLEMENTATION_PLAN_GATE is ${planGate ?? "missing"}; expected READY_FOR_IMPLEMENTATION_PLAN_AUDIT`);
  }
  if (/^\s*IMPLEMENTATION_PLAN_GATE\s*[:=]\s*REMEDIATION_PENDING_INDEPENDENT_REAUDIT\s*$/m.test(plan)) {
    failures.push(`${planPath}: stale REMEDIATION_PENDING_INDEPENDENT_REAUDIT gate contradicts the remediation-complete checkpoint`);
  }
}

if (nextOperation === "audit-component-implementation-plan" && remediationVerdict !== "COMPONENT_IMPLEMENTATION_PLAN_REMEDIATION_COMPLETE") {
  failures.push(`${checkpointPath}: audit route requires COMPONENT_IMPLEMENTATION_PLAN_REMEDIATION_COMPLETE, found ${remediationVerdict ?? "missing"}`);
}

if (failures.length) {
  console.error("FAIL: canonical artifact consistency");
  console.error(`CONSISTENCY_FIELDS_CHECKED = ${checked.join("; ")}`);
  console.error(`CONSISTENCY_CONTRADICTIONS = ${failures.join(" | ")}`);
  process.exitCode = 1;
} else {
  console.log("PASS: canonical artifact consistency");
  console.log(`CONSISTENCY_FIELDS_CHECKED = ${checked.join("; ")}`);
  console.log(`ROUTING_DERIVATION = ${planGate} -> ${nextOperation}`);
}
