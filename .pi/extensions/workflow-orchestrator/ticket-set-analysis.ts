import { createHash } from "node:crypto";
import type { Dirent } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";

export interface TicketSetStaticIssue {
  code: string;
  checkRefs: string[];
  message: string;
  paths?: string[];
  ticketIds?: string[];
}

export interface TicketSetStaticTicket {
  id: string | null;
  path: string;
  status: string | null;
  blockedBy: string[];
  dependsOn: string[];
  unblocks: string[];
}

export interface TicketSetStaticAnalysis {
  schemaVersion: 1;
  subject: string;
  status: "COMPLETE" | "INCOMPLETE";
  ticketFolder: string;
  ticketIndex: string;
  sourceFingerprints: Array<{ path: string; sha256: string }>;
  ticketFiles: number;
  uniqueTicketIds: number;
  indexTicketIds: string[];
  tickets: TicketSetStaticTicket[];
  dependencyCycles: string[][];
  blockerCycles: string[][];
  issues: TicketSetStaticIssue[];
}

const MAX_TICKET_FILES = 256;
const TICKET_REFERENCE = /(?:[A-Z0-9]+(?:-[A-Z0-9]+)*-)?TICKET-(\d+)/gi;
const GENERATED_TICKET_ARTIFACT_SUFFIXES = [
  "-architecture-audit.md",
  "-architecture-boundaries-audit.md",
  "-behavior-audit.md",
  "-implementation-audit.md",
  "-implementation-behavior-audit.md",
  "-implementation-design-conformance-audit.md",
  "-implementation-design.md",
  "-implementation-remediation.md",
  "-ticket-conformance-audit.md",
];

function issue(
  issues: TicketSetStaticIssue[],
  code: string,
  checkRefs: string[],
  message: string,
  paths?: string[],
  ticketIds?: string[],
): void {
  issues.push({ code, checkRefs, message, ...(paths ? { paths } : {}), ...(ticketIds ? { ticketIds } : {}) });
}

function componentPrefix(subject: string): string {
  return subject.replace(/^SPEC-/i, "").toUpperCase();
}

function normalizeTicketId(value: string, prefix: string): string | undefined {
  const normalized = value.replaceAll("`", "").trim().toUpperCase().replace(/^SPEC-/, "");
  const full = normalized.match(/^([A-Z0-9]+(?:-[A-Z0-9]+)*)-TICKET-(\d+)$/);
  if (full) {
    if (full[1] !== prefix) return undefined;
    return `${prefix}-TICKET-${full[2].padStart(3, "0")}`;
  }
  const short = normalized.match(/^TICKET-(\d+)$/);
  return short ? `${prefix}-TICKET-${short[1].padStart(3, "0")}` : undefined;
}

function referencedTicketIds(value: string | undefined, prefix: string): string[] {
  if (!value || /^(?:NONE|N\/A|NO(?:NE)?)$/i.test(value.trim())) return [];
  const references = [...value.matchAll(TICKET_REFERENCE)].map((match) => {
    const whole = match[0].toUpperCase();
    return normalizeTicketId(whole, prefix);
  });
  return [...new Set(references.filter((item): item is string => item !== undefined))].sort();
}

function firstField(section: string, key: string): string | undefined {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return section.match(new RegExp("^\\s*(?:[-*]\\s*)?`?" + escaped + "`?\\s*[:=]\\s*(.*?)\\s*$", "mi"))?.[1]?.trim();
}

function numberedSection(text: string, title: RegExp): string | undefined {
  const headings = [...text.matchAll(/^##\s+.+$/gm)];
  const start = headings.find((match) => title.test(match[0]));
  if (!start || start.index === undefined) return undefined;
  const next = headings.find((match) => (match.index ?? 0) > start.index!);
  return text.slice(start.index, next?.index ?? text.length);
}

function ticketStatusSection(text: string): string | undefined {
  return numberedSection(text, /^##\s+\d+\.\s+Status\s*$/i);
}

function indexTicketIds(text: string, prefix: string): { ids: string[]; found: boolean; unparsedRows: number } {
  const section = numberedSection(text, /^##\s+.*Ticket Status Summary.*$/i);
  if (!section) return { ids: [], found: false, unparsedRows: 0 };
  const ids: string[] = [];
  let unparsedRows = 0;
  for (const line of section.split(/\r?\n/)) {
    if (!/^\s*\|/.test(line)) continue;
    const firstCell = line.split("|")[1]?.trim() ?? "";
    if (/^ticket$/i.test(firstCell) || /^:?-+:?$/.test(firstCell)) continue;
    const reference = firstCell.match(/(?:[A-Z0-9]+(?:-[A-Z0-9]+)*-)?TICKET-\d+/i)?.[0];
    if (!reference) {
      unparsedRows++;
      continue;
    }
    const normalized = normalizeTicketId(reference, prefix);
    if (normalized) ids.push(normalized);
    else unparsedRows++;
  }
  return { ids: [...ids].sort(), found: true, unparsedRows };
}

function cycles(nodes: string[], edges: Map<string, string[]>): string[][] {
  const state = new Map<string, 0 | 1 | 2>();
  const stack: string[] = [];
  const found = new Map<string, string[]>();
  const visit = (node: string): void => {
    state.set(node, 1);
    stack.push(node);
    for (const target of edges.get(node) ?? []) {
      if (!edges.has(target)) continue;
      const targetState = state.get(target) ?? 0;
      if (targetState === 0) visit(target);
      else if (targetState === 1) {
        const cycle = [...stack.slice(stack.indexOf(target)), target];
        const body = cycle.slice(0, -1);
        const rotations = body.map((_, index) => [...body.slice(index), ...body.slice(0, index)].join("\u0000"));
        const key = rotations.sort()[0];
        if (!found.has(key)) found.set(key, cycle);
      }
    }
    stack.pop();
    state.set(node, 2);
  };
  for (const node of nodes) if ((state.get(node) ?? 0) === 0) visit(node);
  return [...found.values()];
}

function sha256(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

function splitStatusFields(section: string, prefix: string): Omit<TicketSetStaticTicket, "id" | "path"> & { missing: string[] } {
  const keys = ["STATUS", "BLOCKED_BY", "DEPENDS_ON", "UNBLOCKS"] as const;
  const values = Object.fromEntries(keys.map((key) => [key, firstField(section, key)])) as Record<(typeof keys)[number], string | undefined>;
  const status = values.STATUS?.replaceAll("`", "").trim().toUpperCase() ?? null;
  const parseRefs = (key: "BLOCKED_BY" | "DEPENDS_ON" | "UNBLOCKS") => referencedTicketIds(values[key], prefix);
  return {
    status,
    blockedBy: parseRefs("BLOCKED_BY"),
    dependsOn: parseRefs("DEPENDS_ON"),
    unblocks: parseRefs("UNBLOCKS"),
    missing: keys.filter((key) => values[key] === undefined),
  };
}

export async function analyzeTicketSet(root: string, subject: string): Promise<TicketSetStaticAnalysis> {
  const prefix = componentPrefix(subject);
  const folder = `docs/tickets/${subject}`;
  const indexPath = `${folder}/README.md`;
  const issues: TicketSetStaticIssue[] = [];
  const fingerprints: TicketSetStaticAnalysis["sourceFingerprints"] = [];
  const tickets: TicketSetStaticTicket[] = [];
  let complete = true;
  let indexIds: string[] = [];
  let indexExists = false;

  if (!/^[A-Z0-9]+(?:-[A-Z0-9]+)*$/.test(subject) || !prefix) {
    issue(issues, "INVALID_SUBJECT", ["CHECK-01", "CHECK-05"], "Subject is not a canonical SPEC identifier.");
    return {
      schemaVersion: 1, subject, status: "INCOMPLETE", ticketFolder: folder, ticketIndex: indexPath,
      sourceFingerprints: fingerprints, ticketFiles: 0, uniqueTicketIds: 0, indexTicketIds: [],
      tickets, dependencyCycles: [], blockerCycles: [], issues,
    };
  }

  let entries: Dirent[];
  try {
    entries = await readdir(resolve(root, folder), { withFileTypes: true });
  } catch (error) {
    issue(issues, "TICKET_FOLDER_UNAVAILABLE", ["CHECK-07", "CHECK-37", "CHECK-44"], `Ticket folder could not be enumerated: ${String(error)}`, [folder]);
    return {
      schemaVersion: 1, subject, status: "INCOMPLETE", ticketFolder: folder, ticketIndex: indexPath,
      sourceFingerprints: fingerprints, ticketFiles: 0, uniqueTicketIds: 0, indexTicketIds: [],
      tickets, dependencyCycles: [], blockerCycles: [], issues,
    };
  }

  const expectedFile = new RegExp(`^${prefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}-TICKET-(\\d+)-.+\\.md$`, "i");
  const ticketLikeFile = /^[A-Z0-9]+(?:-[A-Z0-9]+)*-TICKET-\d+(?:-|\.md$)/i;
  const ticketEntries = entries
    .filter((entry) => entry.isFile()
      && /\.md$/i.test(entry.name)
      && ticketLikeFile.test(entry.name)
      && !GENERATED_TICKET_ARTIFACT_SUFFIXES.some((suffix) => entry.name.toLowerCase().endsWith(suffix)))
    .sort((left, right) => left.name.localeCompare(right.name));
  if (ticketEntries.length > MAX_TICKET_FILES) {
    issue(issues, "TICKET_FILE_BOUND_EXCEEDED", ["CHECK-07", "CHECK-37", "CHECK-44"], `Ticket inventory exceeds the static analyzer limit of ${MAX_TICKET_FILES}.`, [folder]);
    complete = false;
  }
  if (ticketEntries.length === 0) {
    issue(issues, "NO_PRIMARY_TICKET_FILES", ["CHECK-07", "CHECK-37", "CHECK-44"], "No direct ticket files matched the canonical ticket filename pattern.", [folder]);
    complete = false;
  }

  const selectedEntries = ticketEntries.slice(0, MAX_TICKET_FILES);
  const seenIds = new Map<string, string[]>();
  for (const entry of selectedEntries) {
    const path = `${folder}/${entry.name}`;
    const filenameMatch = entry.name.match(expectedFile);
    if (!filenameMatch) {
      const foreignMatch = entry.name.match(/^([A-Z0-9]+(?:-[A-Z0-9]+)*)-TICKET-(\d+)-.+\.md$/i);
      const foreignComponent = foreignMatch?.[1].toUpperCase().replace(/^SPEC-/, "");
      if (foreignMatch && foreignComponent !== prefix) {
        const foreignId = `${foreignComponent}-TICKET-${foreignMatch[2].padStart(3, "0")}`;
        try {
          const foreignText = await readFile(resolve(root, path), "utf8");
          fingerprints.push({ path, sha256: sha256(foreignText) });
        } catch {
          complete = false;
        }
        issue(issues, "FOREIGN_COMPONENT_TICKET_FILE", ["CHECK-13", "CHECK-37", "CHECK-44"], "Ticket-like Markdown file belongs to a different component than the audited ticket set.", [path], [foreignId]);
      } else {
        issue(issues, "UNRECOGNIZED_TICKET_FILENAME", ["CHECK-37", "CHECK-44"], "Ticket-like Markdown file does not use the expected component ticket filename.", [path]);
        complete = false;
      }
      continue;
    }
    let text: string;
    try {
      text = await readFile(resolve(root, path), "utf8");
    } catch (error) {
      issue(issues, "TICKET_FILE_UNREADABLE", ["CHECK-07", "CHECK-37"], `Ticket file could not be read: ${String(error)}`, [path]);
      complete = false;
      continue;
    }
    fingerprints.push({ path, sha256: sha256(text) });
    const expectedId = `${prefix}-TICKET-${filenameMatch[1].padStart(3, "0")}`;
    const titleLine = text.match(/^#\s+([^\r\n]+)$/m)?.[1] ?? "";
    const titleReference = titleLine.match(/(?:[A-Z0-9]+(?:-[A-Z0-9]+)*-)?TICKET-\d+/i)?.[0];
    const parsedId = titleReference ? normalizeTicketId(titleReference, prefix) ?? null : null;
    const id = parsedId ?? expectedId;
    if (!parsedId) {
      issue(issues, "TICKET_ID_UNREADABLE", ["CHECK-07", "CHECK-37"], "Ticket title does not expose a canonical ticket ID for the audited component.", [path], [expectedId]);
      complete = false;
    }
    if (parsedId && parsedId !== expectedId) {
      issue(issues, "TICKET_FILENAME_ID_MISMATCH", ["CHECK-07", "CHECK-37", "CHECK-44"], "Ticket title ID does not match the ID derived from its filename.", [path], [parsedId, expectedId]);
    }
    seenIds.set(id, [...(seenIds.get(id) ?? []), path]);

    const statusSection = ticketStatusSection(text);
    if (!statusSection) {
      issue(issues, "TICKET_STATUS_SECTION_MISSING", ["CHECK-28", "CHECK-37"], "Ticket has no numbered Status section that can be parsed deterministically.", [path], [id]);
      complete = false;
      tickets.push({ id, path, status: null, blockedBy: [], dependsOn: [], unblocks: [] });
      continue;
    }
    const fields = splitStatusFields(statusSection, prefix);
    if (fields.missing.length > 0) {
      issue(issues, "TICKET_STATUS_FIELDS_MISSING", ["CHECK-28", "CHECK-26", "CHECK-27", "CHECK-33", "CHECK-37"], `Ticket status section is missing required fields: ${fields.missing.join(", ")}.`, [path], [id]);
      complete = false;
    }
    tickets.push({ id, path, status: fields.status, blockedBy: fields.blockedBy, dependsOn: fields.dependsOn, unblocks: fields.unblocks });
  }

  for (const [id, paths] of seenIds) {
    if (paths.length > 1) issue(issues, "DUPLICATE_TICKET_ID", ["CHECK-07", "CHECK-37", "CHECK-44"], "Multiple primary ticket files claim the same ticket ID.", paths, [id]);
  }

  let indexText: string | undefined;
  try {
    indexText = await readFile(resolve(root, indexPath), "utf8");
    indexExists = true;
    fingerprints.push({ path: indexPath, sha256: sha256(indexText) });
  } catch {
    issue(issues, "TICKET_INDEX_UNAVAILABLE", ["CHECK-44"], "Ticket index README.md is missing or unreadable.", [indexPath]);
    complete = false;
  }
  if (indexText !== undefined) {
    const parsedIndex = indexTicketIds(indexText, prefix);
    indexIds = parsedIndex.ids;
    if (!parsedIndex.found) {
      issue(issues, "TICKET_INDEX_SUMMARY_MISSING", ["CHECK-44"], "Ticket index has no Ticket Status Summary section to compare with primary ticket files.", [indexPath]);
      complete = false;
    }
    if (parsedIndex.unparsedRows > 0) {
      issue(issues, "TICKET_INDEX_ROWS_UNPARSEABLE", ["CHECK-44"], `Ticket status summary has ${parsedIndex.unparsedRows} table row(s) whose ticket identity could not be parsed.`, [indexPath]);
      complete = false;
    }
    const duplicates = indexIds.filter((id, index) => indexIds.indexOf(id) !== index);
    for (const id of [...new Set(duplicates)]) {
      issue(issues, "DUPLICATE_INDEX_TICKET_ID", ["CHECK-44"], "Ticket status summary lists the same ticket ID more than once.", [indexPath], [id]);
    }
  }

  const parsedTicketIds = tickets.map((ticket) => ticket.id).filter((id): id is string => id !== null);
  const ticketIdSet = new Set(parsedTicketIds);
  for (const id of indexIds) {
    if (!ticketIdSet.has(id)) issue(issues, "INDEX_ONLY_TICKET", ["CHECK-07", "CHECK-44"], "Ticket index lists an ID that has no matching primary ticket file.", [indexPath], [id]);
  }
  for (const id of ticketIdSet) {
    if (!indexIds.includes(id)) issue(issues, "FILE_ONLY_TICKET", ["CHECK-07", "CHECK-44"], "Primary ticket file is absent from the ticket status summary index.", [indexPath, ...tickets.filter((ticket) => ticket.id === id).map((ticket) => ticket.path)], [id]);
  }

  const knownIds = new Set(parsedTicketIds);
  const dependencyEdges = new Map<string, string[]>();
  const blockerEdges = new Map<string, string[]>();
  const byId = new Map<string, TicketSetStaticTicket>(
    tickets
      .filter((ticket): ticket is TicketSetStaticTicket & { id: string } => ticket.id !== null)
      .map((ticket) => [ticket.id, ticket] as const),
  );
  for (const ticket of tickets) {
    if (!ticket.id) continue;
    dependencyEdges.set(ticket.id, ticket.dependsOn);
    blockerEdges.set(ticket.id, ticket.blockedBy);
    for (const [kind, targets] of [["dependency", ticket.dependsOn], ["blocker", ticket.blockedBy], ["unblock", ticket.unblocks]] as const) {
      for (const target of targets) {
        if (!knownIds.has(target)) {
          issue(issues, `UNKNOWN_${kind.toUpperCase()}_TARGET`, ["CHECK-26", "CHECK-27", "CHECK-33", "CHECK-44"], `Ticket references an internal ${kind} target absent from the primary ticket set.`, [ticket.path], [ticket.id, target]);
        }
      }
    }
    for (const target of ticket.unblocks) {
      const downstream = byId.get(target);
      if (downstream && !downstream.blockedBy.includes(ticket.id)) {
        issue(issues, "UNBLOCKS_RECIPROCITY_MISMATCH", ["CHECK-27", "CHECK-33"], "Ticket UNBLOCKS edge is not reciprocated by the downstream BLOCKED_BY field.", [ticket.path, downstream.path], [ticket.id, target]);
      }
    }
    for (const blocker of ticket.blockedBy) {
      const upstream = byId.get(blocker);
      if (upstream && !upstream.unblocks.includes(ticket.id)) {
        issue(issues, "BLOCKED_BY_RECIPROCITY_MISMATCH", ["CHECK-27", "CHECK-33"], "Ticket BLOCKED_BY edge is not reciprocated by the upstream UNBLOCKS field.", [ticket.path, upstream.path], [ticket.id, blocker]);
      }
    }
  }

  const dependencyCycles = cycles([...knownIds], dependencyEdges);
  const blockerCycles = cycles([...knownIds], blockerEdges);
  for (const cycle of dependencyCycles) issue(issues, "DEPENDENCY_GRAPH_CYCLE", ["CHECK-31"], "Ticket dependency graph contains a directed cycle.", undefined, cycle);
  for (const cycle of blockerCycles) issue(issues, "BLOCKER_GRAPH_CYCLE", ["CHECK-32"], "Ticket blocker graph contains a directed cycle.", undefined, cycle);

  if (!indexExists) complete = false;
  fingerprints.sort((left, right) => left.path.localeCompare(right.path));
  tickets.sort((left, right) => (left.id ?? left.path).localeCompare(right.id ?? right.path));
  return {
    schemaVersion: 1,
    subject,
    status: complete ? "COMPLETE" : "INCOMPLETE",
    ticketFolder: folder,
    ticketIndex: indexPath,
    sourceFingerprints: fingerprints,
    ticketFiles: selectedEntries.length,
    uniqueTicketIds: ticketIdSet.size,
    indexTicketIds: indexIds,
    tickets,
    dependencyCycles,
    blockerCycles,
    issues,
  };
}
