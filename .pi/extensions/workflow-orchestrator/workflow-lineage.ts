import { readFile, readdir, realpath } from "node:fs/promises";
import { relative, resolve, sep } from "node:path";

import { OrchestrationStop } from "./contracts.ts";
import {
  assertLegacyCheckpointProofCurrent,
  isLegacyCheckpointProof,
  type LegacyCheckpointProof,
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

async function assertArtifactSnapshotCurrent(root: string, expected: WorkflowArtifactSnapshot): Promise<void> {
  const actual = await artifactSnapshot(root, expected.artifactPath, Object.keys(expected.fields));
  if (JSON.stringify(actual.fields) !== JSON.stringify(expected.fields)) {
    throw new OrchestrationStop("CANONICAL_ARTIFACT_CONTRADICTION", "Workflow source artifact identity or revision fields changed after the result was produced.", {
      artifactPath: expected.artifactPath,
      expectedFields: expected.fields,
      actualFields: actual.fields,
    });
  }
}

async function assertRecordCurrent(
  root: string,
  record: WorkflowResultRecord,
  visiting = new Set<string>(),
  context: LineageReadContext = createLineageReadContext(),
): Promise<void> {
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
        await assertRecordCurrent(root, predecessor, visiting, context);
        return;
      }
      const current = await resolveCurrentWorkflowResult(root, expected.operation, expected.subject, context);
      if (!current || current.resultId !== expected.resultId || current.artifactPath !== expected.artifactPath
        || current.gateField !== expected.gateField || current.gateValue !== expected.gateValue) {
        throw new OrchestrationStop("CANONICAL_ARTIFACT_CONTRADICTION", "Workflow result is stale because its upstream transition result was superseded or changed.", {
          operation: record.operation,
          subject: record.subject,
          resultId: record.resultId,
          expectedSource: expected,
          currentSource: current,
        });
      }
      await assertArtifactSnapshotCurrent(root, { artifactPath: expected.artifactPath, fields: expected.fields });
      await assertRecordCurrent(root, current, visiting, context);
    }
  } finally {
    visiting.delete(key);
  }
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
    || JSON.stringify(current.basis) !== JSON.stringify(expected.basis ?? { type: "none" })
    || current.artifactPath !== normalizePath(expected.artifactPath)
    || current.gateField !== expected.gateField || current.gateValue !== expected.gateValue) {
    throw new OrchestrationStop("INCOMPLETE_CANONICAL_RESULT", "Operation did not publish the expected current workflow result and predecessor link in its gate artifact.", {
      expected,
      current,
    });
  }
  await assertRecordCurrent(root, current, new Set(), context);
}
