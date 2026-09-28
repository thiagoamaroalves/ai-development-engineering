import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { OrchestrationStop } from "./contracts.ts";

export async function requireFile(root: string, path: string, code: "MISSING_AUTHORITY" | "MISSING_SKILL" | "MISSING_AGENT"): Promise<string> {
  const absolute = resolve(root, path);
  try {
    await access(absolute);
    return absolute;
  } catch {
    throw new OrchestrationStop(code, `Required file is missing: ${path}`, { path });
  }
}

export function field(text: string, key: string): string | undefined {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = text.match(new RegExp(`^\\s*${escaped}\\s*[:=]\\s*(.+?)\\s*$`, "mi"));
  return match?.[1]?.trim();
}

export function explicitTicketState(text: string): string {
  // Only the uppercase STATUS field in the ticket artifact is canonical.
  // Designs, indexes, audits, and prose may legitimately mention other
  // status-like fields without changing ticket lifecycle state.
  const matches = [...text.matchAll(/^\s*`?STATUS\s*[:=]\s*(.+?)`?\s*$/gm)];
  const values = new Set(
    matches.map((match) => match[1].replaceAll("`", "").trim().toUpperCase()),
  );
  if (values.size !== 1 || matches.length !== 1) {
    throw new OrchestrationStop("AMBIGUOUS_STATE", "Ticket must expose exactly one explicit canonical STATUS field.", {
      canonicalStatusFields: matches.length,
      states: [...values],
    });
  }
  const [state] = [...values];
  if (state !== "VALIDATION_REQUIRED" && state !== "IMPLEMENTED") {
    throw new OrchestrationStop("AMBIGUOUS_STATE", `Ticket state is not eligible for implemented-ticket audit: ${state}`, {
      state,
    });
  }
  return state;
}

export async function readRequired(root: string, path: string, code: "MISSING_AUTHORITY" | "MISSING_SKILL" | "MISSING_AGENT" = "MISSING_AUTHORITY"): Promise<string> {
  const absolute = await requireFile(root, path, code);
  return readFile(absolute, "utf8");
}

export function requireField(text: string, key: string, expected: string, code: "DEPENDENCY_NOT_READY" | "INCOMPLETE_SPECIALIST_RESULT" | "INCOMPLETE_CANONICAL_RESULT"): void {
  const actual = field(text, key);
  if (actual !== expected) {
    throw new OrchestrationStop(code, `Required field ${key}=${expected} was not found.`, { key, expected, actual });
  }
}

export function requireOneOf(text: string, key: string, allowed: readonly string[], code: "INCOMPLETE_SPECIALIST_RESULT" | "INCOMPLETE_CANONICAL_RESULT"): string {
  const actual = field(text, key);
  if (!actual || !allowed.includes(actual)) {
    throw new OrchestrationStop(code, `Field ${key} did not contain an allowed result.`, { key, allowed, actual });
  }
  return actual;
}
