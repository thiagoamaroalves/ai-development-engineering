#!/usr/bin/env node
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const args = process.argv.slice(2);
const manifestIndex = args.indexOf("--manifest");
if (manifestIndex < 0 || !args[manifestIndex + 1]) {
  console.error("FAIL: usage: node tools/verify-phase-manifest.mjs --manifest <path>");
  process.exit(2);
}

const repo = path.resolve(execFileSync("git", ["rev-parse", "--show-toplevel"], { encoding: "utf8" }).trim());
const manifestPath = path.resolve(repo, args[manifestIndex + 1]);
const relative = (absolute) => path.relative(repo, absolute).replaceAll(path.sep, "/");
const fail = (message) => {
  console.error(`FAIL: phase manifest validation\n${message}`);
  process.exit(1);
};
const readJson = (file) => {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    fail(`cannot read JSON ${relative(file)}: ${error.message}`);
  }
};
const isSha256 = (value) => typeof value === "string" && /^[0-9a-f]{64}$/.test(value);
const isCommit = (value) => typeof value === "string" && /^[0-9a-f]{40}$/.test(value);
const pathError = (value) => {
  if (typeof value !== "string" || value.length === 0) return "must be a non-empty string";
  if (value.includes("\0") || value.includes("\n") || value.includes("\r")) return "contains control characters";
  if (value.startsWith("/") || /^[A-Za-z]:[\\/]/.test(value)) return "must be repository-relative";
  const normalized = path.posix.normalize(value);
  if (normalized !== value || value === "." || value.startsWith("../") || value.includes("/.git/") || value === ".git") {
    return "is not a normalized safe repository-relative path";
  }
  return null;
};
const ensurePath = (value, label) => {
  const error = pathError(value);
  if (error) fail(`${label} ${error}: ${JSON.stringify(value)}`);
  const absolute = path.resolve(repo, value);
  if (absolute !== repo && !absolute.startsWith(`${repo}${path.sep}`)) fail(`${label} escapes repository: ${value}`);
};

if (!fs.existsSync(manifestPath)) fail(`manifest does not exist: ${relative(manifestPath)}`);
const manifest = readJson(manifestPath);
if (manifest.schemaVersion !== 1 || manifest.manifestKind !== "PHASE_CHECKPOINT") {
  fail("schemaVersion must be 1 and manifestKind must be PHASE_CHECKPOINT");
}
for (const [key, value] of Object.entries({ phaseId: manifest.phaseId, operation: manifest.operation, nextAuthorizedOperation: manifest.nextAuthorizedOperation, commitMessage: manifest.commitMessage })) {
  if (typeof value !== "string" || value.trim() === "") fail(`${key} must be non-empty`);
}
if (!manifest.subject || typeof manifest.subject.id !== "string" || !["component", "ticket", "workspace"].includes(manifest.subject.type)) fail("subject must contain id and a supported type");
if (!manifest.target || !isCommit(manifest.target.head) || typeof manifest.target.semanticFingerprint !== "string" || manifest.target.semanticFingerprint.length === 0) fail("target.head or target.semanticFingerprint is invalid");
const head = execFileSync("git", ["rev-parse", "HEAD"], { cwd: repo, encoding: "utf8" }).trim();
if (head !== manifest.target.head) fail(`target.head=${manifest.target.head} does not equal current HEAD=${head}`);

if (!Array.isArray(manifest.sourceAuthority) || manifest.sourceAuthority.length === 0) fail("sourceAuthority must be a non-empty array");
for (const [index, source] of manifest.sourceAuthority.entries()) {
  if (!source || typeof source.path !== "string" || !isSha256(source.sha256)) fail(`sourceAuthority[${index}] requires path and lowercase sha256`);
  ensurePath(source.path, `sourceAuthority[${index}].path`);
  const sourcePath = path.resolve(repo, source.path);
  if (!fs.existsSync(sourcePath) || !fs.statSync(sourcePath).isFile()) fail(`sourceAuthority[${index}] does not exist: ${source.path}`);
  const digest = crypto.createHash("sha256").update(fs.readFileSync(sourcePath)).digest("hex");
  if (digest !== source.sha256) fail(`sourceAuthority[${index}] digest drift: ${source.path}`);
}

const paths = manifest.paths;
if (!paths || !Array.isArray(paths.preserve) || !Array.isArray(paths.delete) || !Array.isArray(paths.unstagedRecovery) || typeof paths.manifest !== "string" || typeof paths.marker !== "string") fail("paths must contain manifest, preserve[], delete[], unstagedRecovery[], and marker");
ensurePath(paths.manifest, "paths.manifest");
ensurePath(paths.marker, "paths.marker");
if (relative(manifestPath) !== paths.manifest) fail(`manifest argument ${relative(manifestPath)} does not match paths.manifest=${paths.manifest}`);
const effective = [...paths.preserve, ...paths.delete, paths.manifest, paths.marker];
const all = [...effective, ...paths.unstagedRecovery];
const duplicates = all.filter((value, index) => all.indexOf(value) !== index);
if (duplicates.length) fail(`duplicate manifest paths: ${[...new Set(duplicates)].join(", ")}`);
for (const [index, value] of paths.preserve.entries()) ensurePath(value, `paths.preserve[${index}]`);
for (const [index, value] of paths.delete.entries()) ensurePath(value, `paths.delete[${index}]`);
for (const [index, value] of paths.unstagedRecovery.entries()) ensurePath(value, `paths.unstagedRecovery[${index}]`);
const effectiveSet = new Set(effective);
const recoverySet = new Set(paths.unstagedRecovery);

const tracked = execFileSync("git", ["diff", "--name-only", "-z", "HEAD", "--"], { cwd: repo, encoding: "utf8" }).split("\0").filter(Boolean);
const untracked = execFileSync("git", ["ls-files", "--others", "--exclude-standard", "-z"], { cwd: repo, encoding: "utf8" }).split("\0").filter(Boolean);
const dirty = new Set([...tracked, ...untracked]);
const expected = new Set([...effectiveSet, ...recoverySet]);
const missing = [...expected].filter((value) => !dirty.has(value));
const unexpected = [...dirty].filter((value) => !expected.has(value));
if (missing.length || unexpected.length) {
  const details = [];
  if (missing.length) details.push(`missing dirty paths: ${missing.join(", ")}`);
  if (unexpected.length) details.push(`unexpected dirty paths: ${unexpected.join(", ")}`);
  fail(details.join("\n"));
}
const stagedOutput = execFileSync("git", ["diff", "--cached", "--name-only", "--no-renames", "-z", "HEAD", "--"], { cwd: repo, encoding: "utf8" });
const staged = new Set(stagedOutput.split("\0").filter(Boolean));
const stagedOutsideEffective = [...staged].filter((value) => !effectiveSet.has(value));
const stagedRecovery = [...staged].filter((value) => recoverySet.has(value));
if (stagedOutsideEffective.length || stagedRecovery.length) {
  const details = [];
  if (stagedOutsideEffective.length) details.push(`staged paths outside effective set: ${stagedOutsideEffective.join(", ")}`);
  if (stagedRecovery.length) details.push(`recovery paths must remain unstaged: ${stagedRecovery.join(", ")}`);
  fail(details.join("\n"));
}
for (const value of paths.delete) {
  if (fs.existsSync(path.resolve(repo, value))) fail(`declared deletion still exists: ${value}`);
}
console.log("PHASE_MANIFEST_VALID = PASS");
console.log(`PHASE_MANIFEST_PATH = ${paths.manifest}`);
console.log(`PRESERVED_PATHS = ${effectiveSet.size}`);
console.log(`UNSTAGED_RECOVERY_PATHS = ${recoverySet.size}`);
console.log(`STAGED_PATHS_WITHIN_EFFECTIVE_SET = ${staged.size}`);
console.log(`NEXT_AUTHORIZED_OPERATION = ${manifest.nextAuthorizedOperation}`);
