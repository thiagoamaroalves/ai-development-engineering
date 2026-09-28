import assert from "node:assert/strict";
import test from "node:test";

import workflowOrchestrator from "../index.ts";

test("extension registers the full-flow tool, audit slice tool, and status command", () => {
  const tools: string[] = [];
  const commands: string[] = [];
  const api = {
    registerTool(tool: { name: string }) { tools.push(tool.name); },
    registerCommand(name: string) { commands.push(name); },
    events: {},
  };

  workflowOrchestrator(api as never);

  assert.deepEqual(tools.sort(), ["workflow_audit_implemented_ticket", "workflow_orchestrate"]);
  assert.deepEqual(commands, ["workflow-status"]);
});
