import { appendFile, open, readFile, readdir, realpath } from "node:fs/promises";
import { relative, resolve, sep } from "node:path";

import { fieldLast } from "./artifacts.ts";
import { OrchestrationStop } from "./contracts.ts";
import {
  assertLegacyTicketSetAuditProofCurrent,
  assertLegacyCheckpointProofCurrent,
  isLegacyCheckpointProof,
  isLegacyTicketSetAuditProof,
  type LegacyCheckpointProof,
  type LegacyTicketSetAuditProof,
} from "./legacy-checkpoint.ts";

const RESULT_BLOCK = /<!-- WORKFLOW_RESULT_V2\r?\n([\s\S]*?)\r?\n-->/g;
const RESULT_FIELDS = [
  "OPERATION",
  "SUBJECT_ID",
  "RESULT_ID",
  "SUPERSEDES_RESULT_ID",
  "GATE_FIELD",
  "GATE_VALUE",
  "BASIS",
] as const;
const MAX_DOCUMENTS = 10_000;
const MAX_RESULT_RECORDS_PER_LINEAGE = 1_000;
const MAX_BASIS_JSON_LENGTH = 32_768;

interface LineageReadContext {
  documents?: Promise<Array<{ artifactPath: string; text: string }>>;
  records: Map<string, Promise<WorkflowResultRecord[]>>;
  current: Map<string, Promise<WorkflowResultRecord | null>>;
}

function createLineageReadContext(): LineageReadContext {
  return { records: new Map(), current: new Map() };
}

function lineageKey(operation: string, subject: string): string {
  return `${operation}\u0000${subject}`;
}

export interface WorkflowResultContext {
  resultId: string;
  supersedesResultId: string | null;
  basis?: WorkflowResultBasis;
}

export interface WorkflowArtifactSnapshot {
  artifactPath: string;
  fields: Record<string, string[]>;
}

export type WorkflowResultBasis =
  | { type: "none" }
  | { type: "intake"; artifacts: WorkflowArtifactSnapshot[] }
  | { type: "legacy-checkpoint"; proof: LegacyCheckpointProof }
  | { type: "legacy-ticket-set-audit"; proof: LegacyTicketSetAuditProof }
  | {
    type: "transition";
    source: {
      operation: string;
      subject: string;
      resultId: string;
      artifactPath: string;
      gateField: string;
      gateValue: string;
      fields: Record<string, string[]>;
    };
  };

const AUTOMATIC_BASIS_FIELD = /(?:^|_)(?:ID|REVISION|ROUND|VERSION|HEAD|FINGERPRINT|WAVE)$/i;
const FIXED_BASIS_FIELD = /^(?:STATUS|VERDICT|GATE|WORKFLOW_GATE|IMPLEMENTATION_PLAN_GATE|TICKET_DECOMPOSITION_GATE|TICKET_GATE|NEXT_AUTHORIZED_OPERATION|NEXT_WORKFLOW_GATE|STRUCTURAL_REVIEW_RESULT|AUDIT_VERDICT|AUDIT_TARGET_HEAD|AUDIT_TARGET_STATE_FINGERPRINT|AUDIT_WAVE_ID)$/i;

export interface WorkflowResultRecord extends WorkflowResultContext {
  operation: string;
  subject: string;
  gateField: string;
  gateValue: string;
  artifactPath: string;
  basis: WorkflowResultBasis;
}

interface RawWorkflowResultRecord extends WorkflowResultRecord {}

function normalizePath(path: string): string {
  return path.replaceAll("\\", "/").replace(/^\.\//, "");
}

function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => left < right ? -1 : left > right ? 1 : 0);
    return `{${entries.map(([key, item]) => `${JSON.stringify(key)}:${canonicalJson(item)}`).join(",")}}`;
  }
  return JSON.stringify(value) ?? "undefined";
}

function docsMarkdownPath(path: string): boolean {
  const normalized = normalizePath(path);
  return normalized.startsWith("docs/") && normalized.toLowerCase().endsWith(".md");
}

function extractBasisFields(text: string, explicitFields: string[] = []): Record<string, string[]> {
  const wanted = new Set(explicitFields.map((field) => field.toUpperCase()));
  const values = new Map<string, string[]>();
  let inResultBlock = false;
  for (const line of text.split(/\r?\n/)) {
    if (line.trim() === "<!-- WORKFLOW_RESULT_V2") {
      inResultBlock = true;
      continue;
    }
    if (inResultBlock) {
      if (line.trim() === "-->") inResultBlock = false;
      continue;
    }
    const match = line.match(/^\s*`?([A-Za-z][A-Za-z0-9_]*)`?\s*[:=]\s*(.*?)\s*$/);
    if (!match) continue;
    const key = match[1].toUpperCase();
    if (key === "RESULT_ID" || key === "SUPERSEDES_RESULT_ID" || key === "SUBJECT_ID" || key === "OPERATION" || key === "BASIS") continue;
    if (!wanted.has(key) && !AUTOMATIC_BASIS_FIELD.test(key) && !FIXED_BASIS_FIELD.test(key)) continue;
    values.set(key, [match[2].trim()]);
  }
  return Object.fromEntries([...values.entries()].sort(([left], [right]) => left.localeCompare(right)));
}

async function artifactSnapshot(root: string, artifactPath: string, explicitFields: string[] = []): Promise<WorkflowArtifactSnapshot> {
  const normalized = normalizePath(artifactPath);
  if (!docsMarkdownPath(normalized)) {
    throw new OrchestrationStop("INVALID_PATH", "Workflow basis artifacts must be Markdown files under docs/.", { artifactPath });
  }
  const absolute = resolve(root, normalized);
  const docsRoot = resolve(root, "docs");
  const canonicalRelativePath = relative(root, absolute).split(sep).join("/");
  if (canonicalRelativePath !== normalized) {
    throw new OrchestrationStop("INVALID_PATH", "Workflow basis artifact path must use its canonical repository-relative spelling.", {
      artifactPath: normalized,
      canonicalPath: canonicalRelativePath,
    });
  }
  const lexicalRelative = relative(docsRoot, absolute);
  if (!lexicalRelative || lexicalRelative === ".." || lexicalRelative.startsWith(`..${sep}`) || lexicalRelative.startsWith(sep)) {
    throw new OrchestrationStop("INVALID_PATH", "Workflow basis artifact must resolve beneath docs/.", { artifactPath: normalized });
  }
  const [canonicalDocsRoot, canonicalArtifact] = await Promise.all([realpath(docsRoot), realpath(absolute)]).catch((error) => {
    throw new OrchestrationStop("INCOMPLETE_CANONICAL_RESULT", "Workflow basis artifact or docs root cannot be resolved.", {
      artifactPath: normalized,
      cause: String(error),
    });
  });
  const canonicalRelative = relative(canonicalDocsRoot, canonicalArtifact);
  if (canonicalRelative === ".." || canonicalRelative.startsWith(`..${sep}`) || canonicalRelative.startsWith(sep)) {
    throw new OrchestrationStop("INVALID_PATH", "Workflow basis artifact resolves outside docs/.", { artifactPath: normalized });
  }
  const text = await readFile(absolute, "utf8").catch((error) => {
    throw new OrchestrationStop("INCOMPLETE_CANONICAL_RESULT", "Workflow basis artifact is missing or unreadable.", {
      artifactPath: normalized,
      cause: String(error),
    });
  });
  const fields = extractBasisFields(text, explicitFields);
  if (!validFieldSnapshot(fields)) {
    throw new OrchestrationStop("INCOMPLETE_CANONICAL_RESULT", "Workflow basis contains too many selected machine fields or oversized values.", {
      artifactPath: normalized,
      fieldCount: Object.keys(fields).length,
    });
  }
  return { artifactPath: normalized, fields };
}

export async function createIntakeWorkflowBasis(
  root: string,
  artifacts: Array<{ artifactPath: string; fields?: string[] }>,
): Promise<WorkflowResultBasis> {
  if (artifacts.length === 0 || artifacts.length > 32) {
    throw new OrchestrationStop("INCOMPLETE_CANONICAL_RESULT", "Workflow intake basis must name between 1 and 32 artifacts.", { count: artifacts.length });
  }
  const snapshots = await Promise.all(artifacts.map(({ artifactPath, fields }) => artifactSnapshot(root, artifactPath, fields)));
  const basis: WorkflowResultBasis = { type: "intake", artifacts: snapshots };
  assertBasisBound(basis);
  return basis;
}

export function createLegacyCheckpointWorkflowBasis(proof: LegacyCheckpointProof): WorkflowResultBasis {
  const basis: WorkflowResultBasis = { type: "legacy-checkpoint", proof };
  assertBasisBound(basis);
  return basis;
}

export function createLegacyTicketSetAuditWorkflowBasis(proof: LegacyTicketSetAuditProof): WorkflowResultBasis {
  const basis: WorkflowResultBasis = { type: "legacy-ticket-set-audit", proof };
  assertBasisBound(basis);
  return basis;
}

export async function createTransitionWorkflowBasis(
  root: string,
  source: Pick<WorkflowResultRecord, "operation" | "subject" | "resultId" | "artifactPath" | "gateField" | "gateValue">,
): Promise<WorkflowResultBasis> {
  const snapshot = await artifactSnapshot(root, source.artifactPath, [source.gateField]);
  const basis: WorkflowResultBasis = {
    type: "transition",
    source: {
      operation: source.operation,
      subject: source.subject,
      resultId: source.resultId,
      artifactPath: snapshot.artifactPath,
      gateField: source.gateField,
      gateValue: source.gateValue,
      fields: snapshot.fields,
    },
  };
  assertBasisBound(basis);
  return basis;
}

function assertBasisBound(basis: WorkflowResultBasis): void {
  const length = JSON.stringify(basis).length;
  if (length > MAX_BASIS_JSON_LENGTH || !validBasis(basis)) {
    throw new OrchestrationStop("INCOMPLETE_CANONICAL_RESULT", "Workflow result basis exceeds its validated structured bounds.", {
      basisLength: length,
      maxBasisLength: MAX_BASIS_JSON_LENGTH,
    });
  }
}

function resultBlockError(message: string, details: Record<string, unknown> = {}): never {
  throw new OrchestrationStop("INCOMPLETE_CANONICAL_RESULT", message, details);
}

function parseBlock(block: string, artifactPath: string): RawWorkflowResultRecord {
  const values = new Map<string, string[]>();
  for (const line of block.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z][A-Z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (!match) {
      if (line.trim()) resultBlockError("Workflow result lineage block contains a malformed field.", { artifactPath, line });
      continue;
    }
    values.set(match[1], [...(values.get(match[1]) ?? []), match[2]]);
  }
  const duplicates = [...values.entries()].filter(([, entries]) => entries.length !== 1).map(([key]) => key);
  const missing = RESULT_FIELDS.filter((key) => !values.has(key));
  const unexpected = [...values.keys()].filter((key) => !(RESULT_FIELDS as readonly string[]).includes(key));
  if (duplicates.length || missing.length || unexpected.length) {
    resultBlockError("Workflow result lineage block has missing, repeated, or unexpected fields.", {
      artifactPath,
      duplicates,
      missing,
      unexpected,
    });
  }
  const value = (key: (typeof RESULT_FIELDS)[number]) => values.get(key)![0].trim();
  const operation = value("OPERATION");
  const subject = value("SUBJECT_ID");
  const resultId = value("RESULT_ID");
  const supersedesText = value("SUPERSEDES_RESULT_ID");
  const gateField = value("GATE_FIELD");
  const gateValue = value("GATE_VALUE");
  const basisJson = value("BASIS");
  if (basisJson.length > MAX_BASIS_JSON_LENGTH) {
    resultBlockError("Workflow result BASIS exceeds its validated size bound.", { artifactPath, basisLength: basisJson.length });
  }
  let basis: WorkflowResultBasis;
  try {
    basis = JSON.parse(basisJson) as WorkflowResultBasis;
  } catch {
    resultBlockError("Workflow result lineage block has invalid BASIS JSON.", { artifactPath });
  }
  if (!operation || !/^[a-z0-9][a-z0-9-]*$/.test(operation)
    || !subject || subject.length > 240
    || !resultId || resultId.length > 240 || /\s/.test(resultId)
    || !gateField || gateField.length > 80
    || !gateValue || gateValue.length > 4000
    || (supersedesText !== "NONE" && (!supersedesText || supersedesText.length > 240 || /\s/.test(supersedesText)))
    || !validBasis(basis)) {
    resultBlockError("Workflow result lineage block contains an invalid identity, predecessor, or gate.", {
      artifactPath,
      operation,
      subject,
      resultId,
      supersedesText,
      gateField,
      gateValue,
      basis: JSON.stringify(basis),
    });
  }
  return {
    operation,
    subject,
    resultId,
    supersedesResultId: supersedesText === "NONE" ? null : supersedesText,
    gateField,
    gateValue,
    artifactPath: normalizePath(artifactPath),
    basis,
  };
}

function validFieldSnapshot(value: unknown): value is Record<string, string[]> {
  return !!value && typeof value === "object" && !Array.isArray(value)
    && Object.entries(value as Record<string, unknown>).length <= 64
    && Object.entries(value as Record<string, unknown>).every(([key, values]) => /^[A-Z][A-Z0-9_]*$/.test(key)
      && Array.isArray(values) && values.length <= 64 && values.every((item) => typeof item === "string" && item.length <= 4000));
}

function validSnapshot(value: unknown): value is WorkflowArtifactSnapshot {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const item = value as Record<string, unknown>;
  return typeof item.artifactPath === "string" && docsMarkdownPath(item.artifactPath)
    && validFieldSnapshot(item.fields);
}

function validBasis(value: unknown): value is WorkflowResultBasis {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const basis = value as Record<string, unknown>;
  if (basis.type === "none") return Object.keys(basis).length === 1;
  if (basis.type === "intake") {
    return Object.keys(basis).length === 2 && Array.isArray(basis.artifacts) && basis.artifacts.length > 0
      && basis.artifacts.length <= 32 && basis.artifacts.every(validSnapshot);
  }
  if (basis.type === "legacy-checkpoint") {
    return Object.keys(basis).length === 2 && isLegacyCheckpointProof(basis.proof);
  }
  if (basis.type === "legacy-ticket-set-audit") {
    return Object.keys(basis).length === 2 && isLegacyTicketSetAuditProof(basis.proof);
  }
  if (basis.type === "transition" && Object.keys(basis).length === 2 && basis.source && typeof basis.source === "object" && !Array.isArray(basis.source)) {
    const source = basis.source as Record<string, unknown>;
    return Object.keys(source).length === 7
      && typeof source.operation === "string" && /^[a-z0-9][a-z0-9-]*$/.test(source.operation)
      && typeof source.subject === "string" && source.subject.length > 0 && source.subject.length <= 240
      && typeof source.resultId === "string" && source.resultId.length > 0 && source.resultId.length <= 240
      && typeof source.artifactPath === "string" && docsMarkdownPath(source.artifactPath)
      && typeof source.gateField === "string" && source.gateField.length > 0 && source.gateField.length <= 80
      && typeof source.gateValue === "string" && source.gateValue.length > 0 && source.gateValue.length <= 4000
      && validFieldSnapshot(source.fields);
  }
  return false;
}

export function parseWorkflowResultRecords(
  text: string,
  artifactPath: string,
  filter?: { operation: string; subject: string },
): WorkflowResultRecord[] {
  const records: WorkflowResultRecord[] = [];
  for (const match of text.matchAll(RESULT_BLOCK)) {
    if (filter) {
      const operation = match[1].match(/^\s*OPERATION\s*=\s*(.*?)\s*$/mi)?.[1]?.trim();
      const subject = match[1].match(/^\s*SUBJECT_ID\s*=\s*(.*?)\s*$/mi)?.[1]?.trim();
      if ((operation && operation !== filter.operation) || (subject && subject !== filter.subject)) continue;
    }
    records.push(parseBlock(match[1], artifactPath));
  }
  return records;
}

async function markdownPaths(root: string): Promise<string[]> {
  const docsRoot = resolve(root, "docs");
  const output: string[] = [];
  const visit = async (directory: string): Promise<void> => {
    let entries;
    try {
      entries = await readdir(directory, { withFileTypes: true });
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return;
      throw error;
    }
    for (const entry of entries) {
      if (entry.isSymbolicLink()) continue;
      const absolute = resolve(directory, entry.name);
      if (entry.isDirectory()) {
        await visit(absolute);
      } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) {
        output.push(absolute);
        if (output.length > MAX_DOCUMENTS) {
          throw new OrchestrationStop("MISSING_AUTHORITY", "Workflow lineage scan exceeded its document bound.", {
            root: "docs",
            maxDocuments: MAX_DOCUMENTS,
          });
        }
      }
    }
  };
  await visit(docsRoot);
  return output;
}

async function collectRecords(root: string, operation: string, subject: string, context: LineageReadContext): Promise<WorkflowResultRecord[]> {
  const key = lineageKey(operation, subject);
  const cached = context.records.get(key);
  if (cached) return cached;
  const pending = (async () => {
    context.documents ??= (async () => {
      const paths = await markdownPaths(root);
      const documents = await Promise.all(paths.map(async (absolute) => {
        const text = await readFile(absolute, "utf8");
        if (!text.includes("<!-- WORKFLOW_RESULT_V2")) return null;
        return { artifactPath: relative(root, absolute).split(sep).join("/"), text };
      }));
      return documents.filter((document): document is { artifactPath: string; text: string } => document !== null);
    })();
    const documents = await context.documents;
    return documents.flatMap(({ artifactPath, text }) => parseWorkflowResultRecords(text, artifactPath, { operation, subject }));
  })();
  context.records.set(key, pending);
  const records = await pending;
  if (records.length > MAX_RESULT_RECORDS_PER_LINEAGE) {
    throw new OrchestrationStop("MISSING_AUTHORITY", "Workflow result lineage exceeds its record bound.", {
      operation,
      subject,
      count: records.length,
      maxRecords: MAX_RESULT_RECORDS_PER_LINEAGE,
    });
  }
  return records;
}

export async function resolveCurrentWorkflowResult(
  root: string,
  operation: string,
  subject: string,
  context: LineageReadContext = createLineageReadContext(),
): Promise<WorkflowResultRecord | null> {
  const key = lineageKey(operation, subject);
  const cached = context.current.get(key);
  if (cached) return cached;
  const pending = resolveCurrentWorkflowResultUncached(root, operation, subject, context);
  context.current.set(key, pending);
  return pending;
}

async function resolveCurrentWorkflowResultUncached(
  root: string,
  operation: string,
  subject: string,
  context: LineageReadContext,
): Promise<WorkflowResultRecord | null> {
  const records = await collectRecords(root, operation, subject, context);
  if (records.length === 0) return null;

  const byId = new Map<string, WorkflowResultRecord>();
  for (const record of records) {
    if (byId.has(record.resultId)) {
      throw new OrchestrationStop("AMBIGUOUS_STATE", "Workflow result ID is duplicated for the same operation and subject.", {
        operation,
        subject,
        resultId: record.resultId,
        paths: [byId.get(record.resultId)!.artifactPath, record.artifactPath],
      });
    }
    byId.set(record.resultId, record);
  }

  const children = new Map<string, string[]>();
  const roots: WorkflowResultRecord[] = [];
  for (const record of records) {
    if (record.supersedesResultId === null) {
      roots.push(record);
      continue;
    }
    if (!byId.has(record.supersedesResultId)) {
      throw new OrchestrationStop("INCOMPLETE_CANONICAL_RESULT", "Workflow result lineage names a missing predecessor.", {
        operation,
        subject,
        resultId: record.resultId,
        supersedesResultId: record.supersedesResultId,
        artifactPath: record.artifactPath,
      });
    }
    children.set(record.supersedesResultId, [...(children.get(record.supersedesResultId) ?? []), record.resultId]);
  }
  const forks = [...children.entries()].filter(([, childIds]) => childIds.length !== 1);
  if (roots.length !== 1 || forks.length > 0) {
    throw new OrchestrationStop("AMBIGUOUS_STATE", "Workflow result lineage is branched or has multiple roots.", {
      operation,
      subject,
      roots: roots.map((record) => record.resultId),
      forks: forks.map(([parent, childIds]) => ({ parent, childIds })),
    });
  }

  let current = roots[0];
  const visited = new Set<string>([current.resultId]);
  while (children.has(current.resultId)) {
    const childId = children.get(current.resultId)![0];
    if (visited.has(childId)) {
      throw new OrchestrationStop("AMBIGUOUS_STATE", "Workflow result lineage contains a cycle.", { operation, subject, childId });
    }
    current = byId.get(childId)!;
    visited.add(childId);
  }
  if (visited.size !== records.length) {
    throw new OrchestrationStop("AMBIGUOUS_STATE", "Workflow result lineage contains a disconnected record.", {
      operation,
      subject,
      reached: [...visited],
      all: [...byId.keys()],
    });
  }
  return current;
}

async function findWorkflowResultById(root: string, operation: string, subject: string, resultId: string, context: LineageReadContext): Promise<WorkflowResultRecord | null> {
  await resolveCurrentWorkflowResult(root, operation, subject, context);
  const records = await collectRecords(root, operation, subject, context);
  return records.find((record) => record.resultId === resultId) ?? null;
}

export async function createWorkflowResultContext(
  root: string,
  operation: string,
  subject: string,
  resultId: string,
  basis: WorkflowResultBasis = { type: "none" },
): Promise<WorkflowResultContext> {
  const current = await resolveCurrentWorkflowResult(root, operation, subject);
  return { resultId, supersedesResultId: current?.resultId ?? null, basis };
}

export function workflowResultBlock(context: WorkflowResultContext, operation: string, subject: string, gateField: string, gateValue: string): string {
  return [
    "<!-- WORKFLOW_RESULT_V2",
    `OPERATION = ${operation}`,
    `SUBJECT_ID = ${subject}`,
    `RESULT_ID = ${context.resultId}`,
    `SUPERSEDES_RESULT_ID = ${context.supersedesResultId ?? "NONE"}`,
    `GATE_FIELD = ${gateField}`,
    `GATE_VALUE = ${gateValue}`,
    `BASIS = ${JSON.stringify(context.basis ?? { type: "none" })}`,
    "-->",
  ].join("\n");
}

const COMPONENT_TICKET_SET_AUDIT = "audit-component-implementation-tickets";
const COMPONENT_TICKET_SET_AUDIT_CHECKPOINT = "checkpoint-component-implementation-tickets-audit";

/** Normalize only redundant line endings after the current extension-owned ticket-set audit block. */
export async function normalizeTicketSetAuditWorkflowResultEnding(
  root: string,
  expected: WorkflowResultRecord,
): Promise<boolean> {
  if (expected.operation !== COMPONENT_TICKET_SET_AUDIT) {
    throw new OrchestrationStop("PROCESS_AUTHORITY_DRIFT", "Terminal workflow metadata normalization is limited to the component ticket-set audit.", {
      operation: expected.operation,
    });
  }
  const artifactPath = normalizePath(expected.artifactPath);
  if (artifactPath !== expected.artifactPath || !docsMarkdownPath(artifactPath)) {
    throw new OrchestrationStop("INVALID_PATH", "Ticket-set audit workflow metadata requires a canonical Markdown artifact under docs/.", {
      artifactPath: expected.artifactPath,
    });
  }
  const docsRoot = await realpath(resolve(root, "docs"));
  const absolute = await realpath(resolve(root, artifactPath));
  const docsRelative = relative(docsRoot, absolute);
  if (docsRelative === ".." || docsRelative.startsWith(`..${sep}`) || docsRelative.startsWith(sep)) {
    throw new OrchestrationStop("INVALID_PATH", "Ticket-set audit artifact resolves outside docs/.", { artifactPath });
  }
  const text = await readFile(absolute, "utf8");
  const records = parseWorkflowResultRecords(text, artifactPath, { operation: expected.operation, subject: expected.subject })
    .filter((record) => record.resultId === expected.resultId);
  if (records.length !== 1 || records[0].supersedesResultId !== expected.supersedesResultId
    || records[0].gateField !== expected.gateField || records[0].gateValue !== expected.gateValue
    || records[0].artifactPath !== artifactPath
    || canonicalJson(records[0].basis) !== canonicalJson(expected.basis)) {
    throw new OrchestrationStop("INCOMPLETE_CANONICAL_RESULT", "Ticket-set audit artifact does not contain exactly the expected workflow result record.", {
      artifactPath,
      resultId: expected.resultId,
      matches: records.length,
    });
  }
  const block = workflowResultBlock(expected, expected.operation, expected.subject, expected.gateField, expected.gateValue);
  const blockStart = text.lastIndexOf(block);
  if (blockStart < 0) return false;
  const suffix = text.slice(blockStart + block.length);
  if (!/^(?:\r?\n)*$/.test(suffix) || suffix === "\n") return false;
  const current = await resolveCurrentWorkflowResult(root, expected.operation, expected.subject);
  if (!current || current.resultId !== expected.resultId || current.artifactPath !== artifactPath) {
    throw new OrchestrationStop("CANONICAL_ARTIFACT_CONTRADICTION", "Only the current ticket-set audit result may have its terminal metadata ending normalized.", {
      artifactPath,
      expectedResultId: expected.resultId,
      currentResultId: current?.resultId,
    });
  }

  const terminalBlockEnd = Buffer.byteLength(text.slice(0, blockStart + block.length), "utf8");
  const handle = await open(absolute, "r+");
  try {
    if (await handle.readFile("utf8") !== text) {
      throw new OrchestrationStop("CANONICAL_ARTIFACT_CONTRADICTION", "Ticket-set audit artifact changed before its terminal metadata was normalized.", {
        artifactPath,
        resultId: expected.resultId,
      });
    }
    await handle.truncate(terminalBlockEnd);
    await handle.write(Buffer.from("\n"), 0, 1, terminalBlockEnd);
    await handle.sync();
  } finally {
    await handle.close();
  }
  return true;
}

/**
 * The extension owns only this terminal process-metadata block for the ticket-set
 * audit. The audit skill remains the sole owner of the report body and verdict.
 */
export async function ensureTicketSetAuditWorkflowResultBlock(
  root: string,
  expected: WorkflowResultRecord,
): Promise<void> {
  if (expected.operation !== COMPONENT_TICKET_SET_AUDIT) {
    throw new OrchestrationStop("PROCESS_AUTHORITY_DRIFT", "Extension-owned workflow metadata is limited to the component ticket-set audit.", {
      operation: expected.operation,
    });
  }
  const artifactPath = normalizePath(expected.artifactPath);
  if (artifactPath !== expected.artifactPath || !docsMarkdownPath(artifactPath)) {
    throw new OrchestrationStop("INVALID_PATH", "Ticket-set audit workflow metadata requires a canonical Markdown artifact under docs/.", {
      artifactPath: expected.artifactPath,
    });
  }
  const docsRoot = await realpath(resolve(root, "docs"));
  const absolute = await realpath(resolve(root, artifactPath));
  const docsRelative = relative(docsRoot, absolute);
  if (docsRelative === ".." || docsRelative.startsWith(`..${sep}`) || docsRelative.startsWith(sep)) {
    throw new OrchestrationStop("INVALID_PATH", "Ticket-set audit artifact resolves outside docs/.", { artifactPath });
  }

  const block = workflowResultBlock(expected, expected.operation, expected.subject, expected.gateField, expected.gateValue);
  const readCanonicalArtifact = async (): Promise<string> => {
    try {
      return await readFile(absolute, "utf8");
    } catch (error) {
      throw new OrchestrationStop("INCOMPLETE_CANONICAL_RESULT", "Ticket-set audit result artifact is missing or unreadable.", {
        artifactPath,
        cause: String(error),
      });
    }
  };
  const assertExpectedRecord = async (text: string): Promise<void> => {
    const records = parseWorkflowResultRecords(text, artifactPath, { operation: expected.operation, subject: expected.subject })
      .filter((record) => record.resultId === expected.resultId);
    if (records.length !== 1 || records[0].supersedesResultId !== expected.supersedesResultId
      || records[0].gateField !== expected.gateField || records[0].gateValue !== expected.gateValue
      || records[0].artifactPath !== artifactPath
      || canonicalJson(records[0].basis) !== canonicalJson(expected.basis)) {
      throw new OrchestrationStop("INCOMPLETE_CANONICAL_RESULT", "Ticket-set audit artifact does not contain exactly the expected workflow result record.", {
        artifactPath,
        resultId: expected.resultId,
        matches: records.length,
      });
    }
    if (!text.replaceAll("\r\n", "\n").endsWith(`${block}\n`)) {
      throw new OrchestrationStop("INCOMPLETE_CANONICAL_RESULT", "Ticket-set audit workflow result must be the exact terminal metadata block.", {
        artifactPath,
        resultId: expected.resultId,
      });
    }
  };
  let text = await readCanonicalArtifact();
  const current = await resolveCurrentWorkflowResult(root, expected.operation, expected.subject);
  const alreadyPresent = parseWorkflowResultRecords(text, artifactPath, { operation: expected.operation, subject: expected.subject })
    .some((record) => record.resultId === expected.resultId);
  if (alreadyPresent) {
    await normalizeTicketSetAuditWorkflowResultEnding(root, expected);
    text = await readCanonicalArtifact();
    await assertExpectedRecord(text);
    if (!current || current.resultId !== expected.resultId) {
      throw new OrchestrationStop("CANONICAL_ARTIFACT_CONTRADICTION", "Ticket-set audit workflow result is present but is not the current lineage leaf.", {
        expectedResultId: expected.resultId,
        currentResultId: current?.resultId,
      });
    }
    return;
  }

  if ((current?.resultId ?? null) !== expected.supersedesResultId) {
    throw new OrchestrationStop("CANONICAL_ARTIFACT_CONTRADICTION", "Ticket-set audit predecessor changed before extension metadata could be appended.", {
      expectedPredecessor: expected.supersedesResultId,
      currentPredecessor: current?.resultId ?? null,
    });
  }
  const persistedGate = fieldLast(text, expected.gateField);
  if (persistedGate !== expected.gateValue) {
    throw new OrchestrationStop("INCOMPLETE_CANONICAL_RESULT", "Ticket-set audit report does not persist the exact gate value returned in its receipt.", {
      artifactPath,
      gateField: expected.gateField,
      expectedGateValue: expected.gateValue,
      actualGateValue: persistedGate,
    });
  }

  const separator = text.endsWith("\n\n") ? "" : text.endsWith("\n") ? "\n" : "\n\n";
  const suffix = `${separator}${block}\n`;
  await appendFile(absolute, suffix, "utf8");
  const updated = await readCanonicalArtifact();
  if (!updated.startsWith(text) || updated.slice(text.length) !== suffix) {
    throw new OrchestrationStop("CANONICAL_ARTIFACT_CONTRADICTION", "Ticket-set audit artifact changed while extension metadata was being appended.", {
      artifactPath,
      resultId: expected.resultId,
    });
  }
  await assertExpectedRecord(updated);
  const updatedCurrent = await resolveCurrentWorkflowResult(root, expected.operation, expected.subject);
  if (!updatedCurrent || updatedCurrent.resultId !== expected.resultId) {
    throw new OrchestrationStop("INCOMPLETE_CANONICAL_RESULT", "Extension metadata did not become the current ticket-set audit workflow result.", {
      expectedResultId: expected.resultId,
      currentResultId: updatedCurrent?.resultId,
    });
  }
}

async function assertArtifactSnapshotCurrent(root: string, expected: WorkflowArtifactSnapshot): Promise<void> {
  const actual = await artifactSnapshot(root, expected.artifactPath, Object.keys(expected.fields));
  if (canonicalJson(actual.fields) !== canonicalJson(expected.fields)) {
    throw new OrchestrationStop("CANONICAL_ARTIFACT_CONTRADICTION", "Workflow source artifact identity or revision fields changed after the result was produced.", {
      artifactPath: expected.artifactPath,
      expectedFields: expected.fields,
      actualFields: actual.fields,
    });
  }
}

async function capturedTicketAuditContext(
  root: string,
  record: WorkflowResultRecord,
  context: LineageReadContext,
): Promise<{ auditRoot?: WorkflowResultRecord; auditCheckpointRoot?: WorkflowResultRecord }> {
  let auditRoot: WorkflowResultRecord | undefined;
  let auditCheckpointRoot: WorkflowResultRecord | undefined;
  let current: WorkflowResultRecord | undefined = record;
  const visited = new Set<string>();

  while (current) {
    const key = `${current.operation}\u0000${current.subject}\u0000${current.resultId}`;
    if (visited.has(key)) break;
    visited.add(key);

    if (current.operation === COMPONENT_TICKET_SET_AUDIT && !auditRoot) {
      auditRoot = current;
      const checkpoint = await resolveCurrentWorkflowResult(root, COMPONENT_TICKET_SET_AUDIT_CHECKPOINT, current.subject, context);
      if (checkpoint?.basis.type === "transition"
        && checkpoint.basis.source.operation === COMPONENT_TICKET_SET_AUDIT
        && checkpoint.basis.source.subject === current.subject
        && checkpoint.basis.source.resultId === current.resultId) {
        auditCheckpointRoot = checkpoint;
      }
    }

    if (current.operation === COMPONENT_TICKET_SET_AUDIT_CHECKPOINT) {
      const latestCheckpoint = await resolveCurrentWorkflowResult(root, COMPONENT_TICKET_SET_AUDIT_CHECKPOINT, current.subject, context);
      if (latestCheckpoint?.resultId === current.resultId) {
        auditCheckpointRoot = current;
        if (!auditRoot && current.basis.type === "transition"
          && current.basis.source.operation === COMPONENT_TICKET_SET_AUDIT
          && current.basis.source.subject === current.subject) {
          auditRoot = await findWorkflowResultById(
            root,
            current.basis.source.operation,
            current.basis.source.subject,
            current.basis.source.resultId,
            context,
          ) ?? undefined;
        }
      }
    }

    if (auditRoot && auditCheckpointRoot) break;
    if (current.basis.type !== "transition") break;
    current = await findWorkflowResultById(
      root,
      current.basis.source.operation,
      current.basis.source.subject,
      current.basis.source.resultId,
      context,
    ) ?? undefined;
  }

  return { auditRoot, auditCheckpointRoot };
}

async function assertRecordCurrent(
  root: string,
  record: WorkflowResultRecord,
  visiting = new Set<string>(),
  context: LineageReadContext = createLineageReadContext(),
  capturedTicketAuditRoot?: WorkflowResultRecord,
  capturedTicketAuditAncestors?: ReadonlySet<string>,
  capturedTicketAuditCheckpointRoot?: WorkflowResultRecord,
): Promise<void> {
  if (!capturedTicketAuditRoot) {
    const ticketAuditContext = await capturedTicketAuditContext(root, record, context);
    capturedTicketAuditRoot = ticketAuditContext.auditRoot ?? record;
    capturedTicketAuditCheckpointRoot = ticketAuditContext.auditCheckpointRoot;
    capturedTicketAuditAncestors = await capturedTicketAuditAncestorIds(root, capturedTicketAuditRoot, context);
  }
  const supersededTicketAuditAncestors = capturedTicketAuditAncestors ?? new Set<string>();
  const key = `${record.operation}\u0000${record.subject}\u0000${record.resultId}`;
  if (visiting.has(key)) {
    throw new OrchestrationStop("AMBIGUOUS_STATE", "Workflow result basis contains a cycle.", {
      operation: record.operation,
      subject: record.subject,
      resultId: record.resultId,
    });
  }
  visiting.add(key);
  try {
    if (record.basis.type === "intake") {
      for (const artifact of record.basis.artifacts) await assertArtifactSnapshotCurrent(root, artifact);
    } else if (record.basis.type === "legacy-checkpoint") {
      await assertLegacyCheckpointProofCurrent(root, record.basis.proof);
    } else if (record.basis.type === "legacy-ticket-set-audit") {
      await assertLegacyTicketSetAuditProofCurrent(root, record.basis.proof);
    } else if (record.basis.type === "transition") {
      const expected = record.basis.source;
      if (expected.operation === record.operation && expected.subject === record.subject) {
        if (record.supersedesResultId !== expected.resultId) {
          throw new OrchestrationStop("CANONICAL_ARTIFACT_CONTRADICTION", "Same-operation result basis must name its immediate predecessor.", {
            operation: record.operation,
            subject: record.subject,
            resultId: record.resultId,
            expectedPredecessor: record.supersedesResultId,
            basisResultId: expected.resultId,
          });
        }
        const predecessor = await findWorkflowResultById(root, expected.operation, expected.subject, expected.resultId, context);
        if (!predecessor || predecessor.artifactPath !== expected.artifactPath
          || predecessor.gateField !== expected.gateField || predecessor.gateValue !== expected.gateValue) {
          throw new OrchestrationStop("CANONICAL_ARTIFACT_CONTRADICTION", "Same-operation result no longer preserves its declared predecessor record.", {
            operation: record.operation,
            subject: record.subject,
            resultId: record.resultId,
            expectedSource: expected,
            currentPredecessor: predecessor,
          });
        }
        await assertRecordCurrent(
          root,
          predecessor,
          visiting,
          context,
          capturedTicketAuditRoot,
          supersededTicketAuditAncestors,
          capturedTicketAuditCheckpointRoot,
        );
        return;
      }
      const current = await resolveCurrentWorkflowResult(root, expected.operation, expected.subject, context);
      if (!current || current.resultId !== expected.resultId || current.artifactPath !== expected.artifactPath
        || current.gateField !== expected.gateField || current.gateValue !== expected.gateValue) {
        if (capturedTicketAuditRoot.operation === COMPONENT_TICKET_SET_AUDIT
          && current?.operation === COMPONENT_TICKET_SET_AUDIT
          && current.subject === capturedTicketAuditRoot.subject
          && current.resultId === capturedTicketAuditRoot.resultId
          && expected.operation === COMPONENT_TICKET_SET_AUDIT
          && expected.subject === capturedTicketAuditRoot.subject
          && supersededTicketAuditAncestors.has(expected.resultId)) {
          const superseded = await findWorkflowResultById(root, expected.operation, expected.subject, expected.resultId, context);
          if (!superseded || superseded.artifactPath !== expected.artifactPath
            || superseded.gateField !== expected.gateField || superseded.gateValue !== expected.gateValue) {
            throw new OrchestrationStop("CANONICAL_ARTIFACT_CONTRADICTION", "Captured ticket-set audit ancestor no longer matches its persisted source record.", {
              expectedSource: expected,
              supersededRecord: superseded,
            });
          }
          if (expected.artifactPath !== capturedTicketAuditRoot.artifactPath) {
            await assertArtifactSnapshotCurrent(root, { artifactPath: expected.artifactPath, fields: expected.fields });
          }
          // The pre-dispatch basis validation already proved this audit ancestor
          // current before its successor was created. Its own old basis may now
          // be superseded as part of the same valid re-audit chain.
          return;
        }
        if (capturedTicketAuditRoot.operation === COMPONENT_TICKET_SET_AUDIT
          && current?.operation === COMPONENT_TICKET_SET_AUDIT_CHECKPOINT
          && current.subject === capturedTicketAuditRoot.subject
          && capturedTicketAuditCheckpointRoot?.operation === COMPONENT_TICKET_SET_AUDIT_CHECKPOINT
          && capturedTicketAuditCheckpointRoot.subject === capturedTicketAuditRoot.subject
          && current.resultId === capturedTicketAuditCheckpointRoot.resultId
          && capturedTicketAuditCheckpointRoot.basis.type === "transition"
          && capturedTicketAuditCheckpointRoot.basis.source.operation === COMPONENT_TICKET_SET_AUDIT
          && capturedTicketAuditCheckpointRoot.basis.source.subject === capturedTicketAuditRoot.subject
          && capturedTicketAuditCheckpointRoot.basis.source.resultId === capturedTicketAuditRoot.resultId
          && expected.operation === COMPONENT_TICKET_SET_AUDIT_CHECKPOINT
          && expected.subject === capturedTicketAuditRoot.subject
          && expected.resultId === capturedTicketAuditCheckpointRoot.supersedesResultId) {
          const superseded = await findWorkflowResultById(root, expected.operation, expected.subject, expected.resultId, context);
          if (!superseded || superseded.artifactPath !== expected.artifactPath
            || superseded.gateField !== expected.gateField || superseded.gateValue !== expected.gateValue) {
            throw new OrchestrationStop("CANONICAL_ARTIFACT_CONTRADICTION", "Captured ticket-set audit checkpoint predecessor no longer matches its persisted source record.", {
              expectedSource: expected,
              supersededRecord: superseded,
            });
          }
          await assertArtifactSnapshotCurrent(root, { artifactPath: expected.artifactPath, fields: expected.fields });
          // A re-audit checkpoint replaces the previous audit checkpoint, while
          // the re-audit itself legitimately depends on the earlier checkpoint
          // through its completed remediation cycle.
          return;
        }
        throw new OrchestrationStop("CANONICAL_ARTIFACT_CONTRADICTION", "Workflow result is stale because its upstream transition result was superseded or changed.", {
          operation: record.operation,
          subject: record.subject,
          resultId: record.resultId,
          expectedSource: expected,
          currentSource: current,
        });
      }
      await assertArtifactSnapshotCurrent(root, { artifactPath: expected.artifactPath, fields: expected.fields });
      await assertRecordCurrent(
        root,
        current,
        visiting,
        context,
        capturedTicketAuditRoot,
        supersededTicketAuditAncestors,
        capturedTicketAuditCheckpointRoot,
      );
    }
  } finally {
    visiting.delete(key);
  }
}

async function capturedTicketAuditAncestorIds(
  root: string,
  auditRoot: WorkflowResultRecord,
  context: LineageReadContext,
): Promise<ReadonlySet<string>> {
  const result = new Set<string>();
  if (auditRoot.operation !== COMPONENT_TICKET_SET_AUDIT || auditRoot.supersedesResultId === null) return result;
  const current = await resolveCurrentWorkflowResult(root, auditRoot.operation, auditRoot.subject, context);
  if (!current || current.resultId !== auditRoot.resultId) return result;
  const records = await collectRecords(root, auditRoot.operation, auditRoot.subject, context);
  const byId = new Map(records.map((item) => [item.resultId, item] as const));
  let predecessorId: string | null = auditRoot.supersedesResultId;
  while (predecessorId !== null) {
    if (result.has(predecessorId)) {
      throw new OrchestrationStop("AMBIGUOUS_STATE", "Ticket-set audit predecessor chain contains a cycle.", {
        subject: auditRoot.subject,
        resultId: predecessorId,
      });
    }
    const predecessor = byId.get(predecessorId);
    if (!predecessor) {
      throw new OrchestrationStop("INCOMPLETE_CANONICAL_RESULT", "Ticket-set audit result is missing a persisted predecessor record.", {
        subject: auditRoot.subject,
        resultId: auditRoot.resultId,
        missingPredecessor: predecessorId,
      });
    }
    result.add(predecessorId);
    predecessorId = predecessor.supersedesResultId;
  }
  return result;
}

export async function validateCurrentWorkflowBasis(
  root: string,
  operation: string,
  subject: string,
  artifactPath: string,
  gateField: string,
  gateValue: string,
): Promise<WorkflowResultRecord> {
  const context = createLineageReadContext();
  const current = await resolveCurrentWorkflowResult(root, operation, subject, context);
  if (!current) {
    const citedText = await readFile(resolve(root, artifactPath), "utf8").catch(() => "");
    const mismatchedSubjectRecord = parseWorkflowResultRecords(citedText, artifactPath)
      .find((record) => record.operation === operation && record.subject !== subject);
    if (mismatchedSubjectRecord) {
      throw new OrchestrationStop("CANONICAL_ARTIFACT_CONTRADICTION", "Transition result subject does not match the selected canonical subject.", {
        operation,
        expectedSubject: subject,
        actualSubject: mismatchedSubjectRecord.subject,
        artifactPath: normalizePath(artifactPath),
      });
    }
    throw new OrchestrationStop("INCOMPLETE_CANONICAL_RESULT", "Transition source has no structured workflow result lineage; currentness cannot be established.", {
      operation,
      subject,
      artifactPath,
    });
  }
  if (current.artifactPath !== normalizePath(artifactPath)
    || current.gateField !== gateField
    || current.gateValue !== gateValue) {
    throw new OrchestrationStop("CANONICAL_ARTIFACT_CONTRADICTION", "Controller cited a historical or contradictory workflow result instead of the current lineage leaf.", {
      operation,
      subject,
      citedArtifactPath: normalizePath(artifactPath),
      currentArtifactPath: current.artifactPath,
      citedGateField: gateField,
      currentGateField: current.gateField,
      citedGateValue: gateValue,
      currentGateValue: current.gateValue,
      currentResultId: current.resultId,
    });
  }
  await assertRecordCurrent(root, current, new Set(), context);
  return current;
}

export async function validateProducedWorkflowResult(
  root: string,
  expected: WorkflowResultRecord,
): Promise<void> {
  const normalizedArtifactPath = normalizePath(expected.artifactPath);
  if (!normalizedArtifactPath.startsWith("docs/") || !normalizedArtifactPath.toLowerCase().endsWith(".md")) {
    throw new OrchestrationStop("INVALID_PATH", "Workflow result artifact must be a Markdown file under docs/.", {
      operation: expected.operation,
      subject: expected.subject,
      artifactPath: expected.artifactPath,
    });
  }
  const context = createLineageReadContext();
  const current = await resolveCurrentWorkflowResult(root, expected.operation, expected.subject, context);
  if (!current || current.resultId !== expected.resultId
    || current.supersedesResultId !== expected.supersedesResultId
    || canonicalJson(current.basis) !== canonicalJson(expected.basis ?? { type: "none" })
    || current.artifactPath !== normalizePath(expected.artifactPath)
    || current.gateField !== expected.gateField || current.gateValue !== expected.gateValue) {
    throw new OrchestrationStop("INCOMPLETE_CANONICAL_RESULT", "Operation did not publish the expected current workflow result and predecessor link in its gate artifact.", {
      expected,
      current,
    });
  }
  await assertRecordCurrent(root, current, new Set(), context);
}
