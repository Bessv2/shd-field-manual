#!/usr/bin/env node
// Lightweight sanity checks for index.html — no dependencies, no build step.
// Catches the two failure modes most likely from a hand-edit: broken inline
// JS, and a duplicate id (which silently breaks getElementById-driven render
// code elsewhere on the page).
const fs = require("fs");

const path = "index.html";
const src = fs.readFileSync(path, "utf8");
let failed = false;

function check(label, ok) {
  console.log(`${ok ? "OK  " : "FAIL"} ${label}`);
  if (!ok) failed = true;
}

check("has <!DOCTYPE html>", /^<!DOCTYPE html>/i.test(src));
check("has charset meta", /<meta charset=/i.test(src));
check("has viewport meta", /<meta name="viewport"/i.test(src));
check("has <title>", /<title>[^<]+<\/title>/i.test(src));

const scriptMatches = [...src.matchAll(/<script>([\s\S]*?)<\/script>/g)];
check("has at least one inline <script>", scriptMatches.length > 0);
for (const [, body] of scriptMatches) {
  try {
    new Function(body);
  } catch (e) {
    check(`inline script parses (${e.message})`, false);
  }
}
if (scriptMatches.every(([, body]) => {
  try { new Function(body); return true; } catch { return false; }
})) {
  check("all inline scripts parse as valid JS", true);
}

const ids = [...src.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
const seen = new Set();
const dupes = new Set();
for (const id of ids) {
  if (seen.has(id)) dupes.add(id);
  seen.add(id);
}
check(
  dupes.size === 0
    ? "no duplicate id attributes"
    : `no duplicate id attributes (found: ${[...dupes].join(", ")})`,
  dupes.size === 0
);

// data/*.json is edited through the /admin CMS, so a bad save there is the
// most likely way this site actually breaks — validate its shape directly.
function checkJsonFile(file, itemFields) {
  let data;
  try {
    data = JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (e) {
    check(`${file} is valid JSON (${e.message})`, false);
    return;
  }
  check(`${file} is valid JSON`, true);
  const items = data && data.items;
  check(`${file} has an "items" array`, Array.isArray(items));
  if (!Array.isArray(items)) return;
  const missing = items
    .map((item, i) => itemFields.filter((f) => !(f in item)).map((f) => `#${i}.${f}`))
    .flat();
  check(
    missing.length === 0
      ? `every entry in ${file} has all required fields`
      : `every entry in ${file} has all required fields (missing: ${missing.join(", ")})`,
    missing.length === 0
  );
}

checkJsonFile("data/cards.json", ["cat", "tags", "name", "gear", "weapons", "spec", "cores", "skills", "mods", "note", "best"]);
checkJsonFile("data/glossary.json", ["term", "category", "description"]);

check("admin/config.yml exists", fs.existsSync("admin/config.yml"));
check("admin/index.html exists", fs.existsSync("admin/index.html"));

process.exit(failed ? 1 : 0);
