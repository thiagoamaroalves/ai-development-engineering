import { readdir, readFile } from "node:fs/promises";
import { join, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const canonicalRoot = join(root, "skills");
const mirrorRoot = join(root, ".codex", "skills");

async function sourceFiles(directory, prefix = "") {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const relativePath = join(prefix, entry.name);
    const absolutePath = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await sourceFiles(absolutePath, relativePath));
    else files.push(relativePath);
  }
  return files;
}

const files = (await sourceFiles(canonicalRoot)).sort();
const missing = [];
const different = [];

for (const file of files) {
  const canonical = await readFile(join(canonicalRoot, file));
  try {
    const mirror = await readFile(join(mirrorRoot, file));
    if (!canonical.equals(mirror)) different.push(file.split(sep).join("/"));
  } catch {
    missing.push(file.split(sep).join("/"));
  }
}

if (missing.length || different.length) {
  console.error("Skill mirror is out of sync with canonical skills/.");
  if (missing.length) console.error(`Missing mirror files:\n- ${missing.join("\n- ")}`);
  if (different.length) console.error(`Different mirror files:\n- ${different.join("\n- ")}`);
  process.exitCode = 1;
} else {
  console.log(`Skill mirror is synchronized: ${files.length} canonical source files.`);
}

const extra = (await sourceFiles(mirrorRoot))
  .filter((file) => !files.includes(file))
  .map((file) => file.split(sep).join("/"));
if (extra.length) {
  console.log(`Codex-only mirror extensions preserved: ${extra.length} files.`);
}
