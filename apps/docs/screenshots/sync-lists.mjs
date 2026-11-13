// Copyright 2026 The Steward Authors
// SPDX-License-Identifier: Apache-2.0
// Writes each slot's numbered list in the guide from screenshots/slots.json,
// so the numbers on a picture and the list under it come from one place.
//
//   node apps/docs/screenshots/sync-lists.mjs
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, "..");
const slots = JSON.parse(readFileSync(path.join(here, "slots.json"), "utf8"));

const markdownFiles = (directory) =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) return markdownFiles(full);
    return entry.name.endsWith(".md") ? [full] : [];
  });

export const listFor = (slot) =>
  slots[slot].callouts.map((text, index) => `${index + 1}. ${text}`).join("\n");

// The list directly under a <Screenshot> tag: the tag, a blank line, then the
// lines that start with a number, to the next blank line.
const BLOCK = /(<Screenshot slot="([^"]+)"[^>]*\/>\n\n)((?:\d+\. .*\n?)+)/g;

export const sync = (text) =>
  text.replaceAll(BLOCK, (whole, tag, slot) => `${tag}${listFor(slot)}\n`);

if (import.meta.url === `file://${process.argv[1]}`) {
  const directories = [
    path.join(root, "docs"),
    ...readdirSync(path.join(root, "versioned_docs")).map((name) =>
      path.join(root, "versioned_docs", name),
    ),
  ];
  for (const directory of directories) {
    for (const file of markdownFiles(directory)) {
      const before = readFileSync(file, "utf8");
      const after = sync(before);
      if (after !== before) writeFileSync(file, after);
    }
  }
}
