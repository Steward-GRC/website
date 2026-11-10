// Copyright 2026 The Steward Authors
// SPDX-License-Identifier: Apache-2.0
// Checks every font URL in a built site (url() in CSS and inline styles,
// href= in the HTML) for a build served under a base path: each one must sit
// under the base and resolve to a file in the build, read as if the build
// folder is served at the base. A bare /fonts/ URL passes at the server root
// and breaks under a sub-path, which is why CI runs this on a sub-path build.
// A build with no font URLs at all fails too, so the check can't pass by
// finding nothing.
//
// Usage: node scripts/check-fonts.mjs <built-site-directory> <base-path>

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const FONT_URL = /(?:url\(\s*["']?|href=["'])([^"')\s]+\.woff2)/g;

const walk = (directory) =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) return walk(full);
    return /\.(html|css)$/.test(entry.name) ? [full] : [];
  });

export const checkFonts = (root, base) => {
  const prefix = base.endsWith("/") ? base : `${base}/`;
  const broken = [];
  let checked = 0;
  for (const file of walk(root)) {
    const text = readFileSync(file, "utf8");
    for (const match of text.matchAll(FONT_URL)) {
      const url = match[1];
      checked += 1;
      const where = path.relative(root, file);
      if (!url.startsWith(prefix)) {
        broken.push({ file: where, url, why: `not under ${prefix}` });
        continue;
      }
      const target = path.join(root, url.slice(prefix.length));
      if (!existsSync(target) || !statSync(target).isFile()) {
        broken.push({ file: where, url, why: "no such file" });
      }
    }
  }
  return { broken, checked };
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [root, base] = process.argv.slice(2);
  if (!root || !base) {
    console.error(
      "usage: node scripts/check-fonts.mjs <built-site-directory> <base-path>",
    );
    process.exit(2);
  }
  const { broken, checked } = checkFonts(root, base);
  console.log(`checked ${checked} font URL(s) in ${root} under ${base}`);
  if (checked === 0) {
    console.error(
      "no font URLs found: the build loads no fonts, or this check can't see them",
    );
    process.exit(1);
  }
  if (broken.length > 0) {
    console.error(`${broken.length} font URL(s) don't resolve under ${base}:`);
    for (const { file, url, why } of broken)
      console.error(`  ${file} -> ${url} (${why})`);
    process.exit(1);
  }
  console.log("every font URL resolves under the base path");
}
