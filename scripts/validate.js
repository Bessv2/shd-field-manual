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

process.exit(failed ? 1 : 0);
